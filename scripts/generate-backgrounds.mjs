// Build-time painted-background generator for the video suite.
//
//   npm run backgrounds                      # every video with a manifest
//   npm run backgrounds -- --video wind      # just src/videos/wind
//   npm run backgrounds -- --video wind --only sky_gold,bay
//   npm run backgrounds -- --video wind --only bay --force
//                                            # re-roll a key whose prompt
//                                            # didn't change (a new seed)
//   npm run backgrounds -- --video wind --dry-run   # print final prompts only
//
// Same shape as scripts/generate-narration.mjs, deliberately: a per-video
// declaration file, a content-hash cache so only *changed* prompts cost money,
// generated assets committed to the repo, and a generated TypeScript manifest
// the composition imports. A fresh clone renders identically without an API
// key, exactly like the narration audio.
//
// Each video declares its worlds in src/videos/<slug>/backgrounds.mjs:
//
//   export default {
//     styleAnchor: "background art for a preschool animated series, …",
//     backgrounds: {
//       hill_day: { prompt: "a gentle grassy hill crest right of centre, …" },
//       sky_high: { prompt: "…", aspectRatio: "16:9" },
//     },
//   };
//
// The prompt sent to the model is `${prompt}, ${styleAnchor}` — the anchor is
// what keeps nine images looking like one show, so it lives once per episode
// and is never edited per key.
//
// Output per video:
//   public/backgrounds/<slug>/<key>.webp        (as delivered; see WEBP below)
//   src/videos/<slug>/backgroundManifest.ts     (staticFile paths)
//   public/backgrounds/<slug>/.cache.json       (prompt hashes, skip-unchanged)
//
// WEBP: flux returns webp and we save it byte-for-byte. Chrome decodes webp
// natively, so both `remotion studio` and `remotion render` are fine — but
// Remotion's bundled ffmpeg has no webp *decoder*, so anything that tries to
// convert or probe these through ffmpeg will fail. Don't convert them.

import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const MODEL = "black-forest-labs/flux-schnell";
const DEFAULT_ASPECT = "16:9";

// The account is capped at 6 requests/minute. One request every 12 s is the
// steady-state that never trips it; a 429 backs off further from there.
const MIN_REQUEST_GAP_MS = 12_000;
const POLL_INTERVAL_MS = 1_500;
const POLL_TIMEOUT_MS = 180_000;

const HERE = import.meta.dirname;
const ROOT = path.resolve(HERE, "..");
const VIDEOS_DIR = path.join(ROOT, "src", "videos");
const PUBLIC_BACKGROUNDS = path.join(ROOT, "public", "backgrounds");

// --- .env ------------------------------------------------------------------

/**
 * Read KEY=value pairs out of the project .env. Deliberately *not*
 * `process.env`: the token is never exported in a shell here, and a generator
 * that silently falls back to an unset variable fails halfway through a run
 * instead of before the first request.
 */
async function readEnvFile(file = path.join(ROOT, ".env")) {
  let raw;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    return {};
  }
  const env = {};
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    let value = t.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

// --- replicate -------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let lastRequestAt = 0;
async function pace() {
  const wait = lastRequestAt + MIN_REQUEST_GAP_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

/**
 * One prediction, from POST to a finished output URL.
 *
 * `Prefer: wait` asks Replicate to hold the connection open until the
 * prediction finishes, but it is a *preference*: the response often comes back
 * still `starting`/`processing`, so the poll below is the real completion
 * check rather than a fallback.
 */
async function generateImage(token, prompt, aspectRatio) {
  const url = `https://api.replicate.com/v1/models/${MODEL}/predictions`;
  const body = JSON.stringify({
    input: { prompt, aspect_ratio: aspectRatio, output_format: "webp" },
  });

  let prediction = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    await pace();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body,
    });
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after") ?? 0);
      const backoff = Math.max(retryAfter * 1000, MIN_REQUEST_GAP_MS * (attempt + 2));
      console.log(`    rate limited (429) — backing off ${(backoff / 1000).toFixed(0)}s`);
      await sleep(backoff);
      continue;
    }
    if (!res.ok) {
      throw new Error(`replicate ${res.status}: ${await res.text()}`);
    }
    prediction = await res.json();
    break;
  }
  if (!prediction) throw new Error("replicate: still rate limited after 5 attempts");

  const started = Date.now();
  while (prediction.status !== "succeeded") {
    if (prediction.status === "failed" || prediction.status === "canceled") {
      throw new Error(
        `prediction ${prediction.status}: ${prediction.error ?? ""}`,
        { cause: "prediction" },
      );
    }
    if (Date.now() - started > POLL_TIMEOUT_MS) {
      throw new Error(`prediction timed out after ${POLL_TIMEOUT_MS / 1000}s`);
    }
    await sleep(POLL_INTERVAL_MS);
    const res = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 429) {
      await sleep(MIN_REQUEST_GAP_MS);
      continue;
    }
    if (!res.ok) throw new Error(`replicate poll ${res.status}: ${await res.text()}`);
    prediction = await res.json();
  }

  const out = prediction.output;
  const imageUrl = Array.isArray(out) ? out[0] : out;
  if (typeof imageUrl !== "string") {
    throw new Error(`prediction succeeded with no image url: ${JSON.stringify(out)}`);
  }
  const img = await fetch(imageUrl);
  if (!img.ok) throw new Error(`download ${img.status} for ${imageUrl}`);
  return Buffer.from(await img.arrayBuffer());
}

/**
 * `generateImage` with retries. Replicate returns the occasional infrastructure
 * failure ("Director: unexpected error handling prediction") that succeeds on
 * the next identical request — the first run of this script lost six paid
 * images to one of them, because the throw took the whole run (and its unwritten
 * cache) with it.
 */
async function generateImageWithRetry(token, prompt, aspectRatio, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await generateImage(token, prompt, aspectRatio);
    } catch (err) {
      last = err;
      if (i < tries - 1) {
        console.log(`    ${err.message} — retrying (${i + 2}/${tries})`);
        await sleep(MIN_REQUEST_GAP_MS);
      }
    }
  }
  throw last;
}

// --- cache + manifest ------------------------------------------------------

function promptHash(finalPrompt, aspectRatio) {
  return createHash("sha256")
    .update(JSON.stringify([MODEL, finalPrompt, aspectRatio]))
    .digest("hex")
    .slice(0, 16);
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function fileExists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function discoverVideos(only) {
  let entries;
  try {
    entries = await readdir(VIDEOS_DIR, { withFileTypes: true });
  } catch {
    return [];
  }
  const slugs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
    .map((e) => e.name)
    .filter((slug) => !only || slug === only);
  const videos = [];
  for (const slug of slugs) {
    const cfgPath = path.join(VIDEOS_DIR, slug, "backgrounds.mjs");
    if (!(await fileExists(cfgPath))) continue;
    const mod = await import(`${cfgPath}?t=${Math.trunc(performance.now())}`);
    videos.push({ slug, config: mod.default });
  }
  return videos;
}

async function generateVideo({ slug, config }, { token, only, force, dryRun }) {
  const anchor = config.styleAnchor ?? "";
  const outDir = path.join(PUBLIC_BACKGROUNDS, slug);
  await mkdir(outDir, { recursive: true });
  const cachePath = path.join(outDir, ".cache.json");
  const cache = await readJson(cachePath, {});
  const nextCache = {};
  const images = {};
  const failed = [];
  let generated = 0;

  console.log(`\n${slug}:`);
  for (const [key, entry] of Object.entries(config.backgrounds)) {
    const spec = typeof entry === "string" ? { prompt: entry } : entry;
    const aspectRatio = spec.aspectRatio ?? config.aspectRatio ?? DEFAULT_ASPECT;
    const finalPrompt = anchor ? `${spec.prompt}, ${anchor}` : spec.prompt;
    const hash = promptHash(finalPrompt, aspectRatio);
    const outFile = `${key}.webp`;
    const cached = cache[key];
    const selected = !only || only.includes(key);

    if (dryRun) {
      console.log(`  ${key.padEnd(20)} ${aspectRatio}\n    ${finalPrompt}`);
      continue;
    }

    if (
      !(force && selected) &&
      cached &&
      cached.hash === hash &&
      (await fileExists(path.join(outDir, cached.outFile)))
    ) {
      nextCache[key] = cached;
      images[key] = `backgrounds/${slug}/${cached.outFile}`;
      console.log(`  ${key.padEnd(20)} (cached)`);
      continue;
    }
    if (!selected) {
      // --only asked for a different key; leave this one exactly as it is.
      if (cached) {
        nextCache[key] = cached;
        images[key] = `backgrounds/${slug}/${cached.outFile}`;
      }
      console.log(`  ${key.padEnd(20)} (skipped — not in --only)`);
      continue;
    }

    const t0 = Date.now();
    try {
      const bytes = await generateImageWithRetry(token, finalPrompt, aspectRatio);
      await writeFile(path.join(outDir, outFile), bytes);
      generated++;
      nextCache[key] = { hash, outFile, aspectRatio, prompt: finalPrompt };
      images[key] = `backgrounds/${slug}/${outFile}`;
      console.log(
        `  ${key.padEnd(20)} ${(bytes.length / 1024).toFixed(0)} KB  ${aspectRatio}  ${((Date.now() - t0) / 1000).toFixed(1)}s`,
      );
    } catch (err) {
      // One key failing must not cost the other eight: keep whatever was
      // already on disk for it, carry on, and fail the *run* at the end.
      failed.push(`${key}: ${err.message}`);
      if (cached && (await fileExists(path.join(outDir, cached.outFile)))) {
        nextCache[key] = cached;
        images[key] = `backgrounds/${slug}/${cached.outFile}`;
      }
      console.log(`  ${key.padEnd(20)} FAILED — ${err.message}`);
    }
  }

  // Drop images whose keys were deleted from backgrounds.mjs.
  for (const [key, old] of Object.entries(cache)) {
    if (!nextCache[key] && old.outFile) {
      await rm(path.join(outDir, old.outFile), { force: true });
    }
  }

  if (dryRun) return { generated, failed };

  await writeFile(cachePath, JSON.stringify(nextCache, null, 2));

  const entries = Object.keys(images)
    .sort()
    .map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(images[k])},`)
    .join("\n");
  const manifest = `// GENERATED FILE — do not edit by hand.
// Produced by scripts/generate-backgrounds.mjs (npm run backgrounds).
// Paths are relative to public/ — pass through staticFile().

export const BACKGROUNDS = {
${entries}
} as const;

export type BackgroundKey = keyof typeof BACKGROUNDS;
`;
  await writeFile(path.join(VIDEOS_DIR, slug, "backgroundManifest.ts"), manifest);
  return { generated, failed };
}

async function main() {
  const argv = process.argv.slice(2);
  const flag = (name) => {
    const i = argv.indexOf(name);
    return i === -1 ? null : argv[i + 1];
  };
  const only = flag("--only")?.split(",").map((s) => s.trim());
  const slug = flag("--video");
  const force = argv.includes("--force");
  const dryRun = argv.includes("--dry-run");

  const env = await readEnvFile();
  const token = env.REPLICATE_API_TOKEN;
  if (!token && !dryRun) {
    console.error(
      "No REPLICATE_API_TOKEN in .env — background images are committed, so a\n" +
        "checkout only needs this to *change* a prompt.",
    );
    process.exit(1);
  }

  const videos = await discoverVideos(slug);
  if (videos.length === 0) {
    console.error(
      slug
        ? `No video "${slug}" with a backgrounds.mjs found under src/videos/.`
        : "No videos with a backgrounds.mjs found under src/videos/.",
    );
    process.exit(1);
  }

  let generated = 0;
  const failed = [];
  for (const video of videos) {
    const res = await generateVideo(video, { token, only, force, dryRun });
    generated += res.generated;
    failed.push(...res.failed.map((f) => `${video.slug}/${f}`));
  }
  console.log(
    `\nDone. ${generated} image(s) generated${dryRun ? " (dry run)" : ""}, rest served from cache.`,
  );
  if (failed.length > 0) {
    console.error(`\n${failed.length} image(s) FAILED:`);
    for (const f of failed) console.error(`  ${f}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
