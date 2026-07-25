// Build-time narration generator for all videos in the suite.
//
//   npm run narration                 # all videos
//   npm run narration -- --video foo  # just src/videos/foo
//   npm run narration -- --audition foo:intro /tmp/auditions
//                                     # render one line in several candidate
//                                     # voices so a human can pick by ear
//
// Each video directory (src/videos/<slug>/) declares its lines in a
// narration.mjs file:
//
//   export default {
//     voice: "af_heart",   // default voice for the video
//     speed: 1.0,
//     lines: {
//       intro: "Hello and welcome…",
//       // A line may also override voice/speed:
//       aside: { text: "Meanwhile…", voice: "am_puck", speed: 1.1 },
//     },
//   };
//
// Output per video:
//   public/narration/<slug>/<key>.mp3      (mono, 48 kbps; WAV fallback)
//   src/videos/<slug>/narrationManifest.ts (file path + exact duration per key)
//   public/narration/<slug>/.cache.json    (content hashes for skip-unchanged)
//
// Clips whose text/voice/speed are unchanged since the last run are skipped —
// the Kokoro model is only loaded when at least one clip needs synthesis.

import { writeFile, mkdir, rm, readFile, readdir, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const DEFAULT_VOICE = "af_heart";
const DEFAULT_SPEED = 1.0;

// Voices offered by --audition (in addition to the video's own voice).
const AUDITION_VOICES = [
  { voice: "af_heart", speed: 1.0 },
  { voice: "af_bella", speed: 1.0 },
  { voice: "am_michael", speed: 1.0 },
  { voice: "am_puck", speed: 1.05 },
  { voice: "bf_emma", speed: 1.0 },
  { voice: "bm_george", speed: 1.0 },
];

const HERE = import.meta.dirname;
const ROOT = path.resolve(HERE, "..");
const VIDEOS_DIR = path.join(ROOT, "src", "videos");
const PUBLIC_NARRATION = path.join(ROOT, "public", "narration");

function hasFfmpeg() {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function toInt16(samples) {
  const out = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

async function encodeMp3Lame(samples, rate, kbps = 48) {
  let lame;
  try {
    const mod = await import("@breezystack/lamejs");
    lame = mod.default || mod;
  } catch {
    return null;
  }
  const enc = new lame.Mp3Encoder(1, rate, kbps);
  const int16 = toInt16(samples);
  const chunks = [];
  const block = 1152;
  for (let i = 0; i < int16.length; i += block) {
    const buf = enc.encodeBuffer(int16.subarray(i, i + block));
    if (buf.length > 0) chunks.push(Buffer.from(buf));
  }
  const end = enc.flush();
  if (end.length > 0) chunks.push(Buffer.from(end));
  return Buffer.concat(chunks);
}

function encodeWav16(samples, rate) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  let o = 44;
  for (let i = 0; i < n; i++) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7fff;
    buf.writeInt16LE(s | 0, o);
    o += 2;
  }
  return buf;
}

async function encodeClip(samples, rate, dir, base, encMode) {
  if (encMode === "ffmpeg") {
    const wavPath = path.join(dir, `${base}.wav`);
    await writeFile(wavPath, encodeWav16(samples, rate));
    const mp3Path = path.join(dir, `${base}.mp3`);
    execFileSync(
      "ffmpeg",
      ["-y", "-i", wavPath, "-ac", "1", "-b:a", "48k", mp3Path],
      { stdio: "ignore" },
    );
    await rm(wavPath);
  } else if (encMode === "lamejs") {
    await writeFile(path.join(dir, `${base}.mp3`), await encodeMp3Lame(samples, rate));
  } else {
    await writeFile(path.join(dir, `${base}.wav`), encodeWav16(samples, rate));
  }
  const outFile = `${base}.${encMode === "wav" ? "wav" : "mp3"}`;
  const { size } = await stat(path.join(dir, outFile));
  return { outFile, size };
}

async function detectEncoder() {
  if (hasFfmpeg()) return "ffmpeg";
  const lameOk = (await encodeMp3Lame(new Float32Array(1152), 24000)) !== null;
  return lameOk ? "lamejs" : "wav";
}

let ttsPromise = null;
function loadTts() {
  if (!ttsPromise) {
    ttsPromise = (async () => {
      console.log(`Loading ${MODEL_ID} (q8 / cpu)…`);
      const { KokoroTTS } = await import("kokoro-js");
      return KokoroTTS.from_pretrained(MODEL_ID, { dtype: "q8", device: "cpu" });
    })();
  }
  return ttsPromise;
}

// Normalize a line entry ("text" or {text, voice?, speed?}) against defaults.
function lineSpec(entry, defaults) {
  if (typeof entry === "string") return { text: entry, ...defaults };
  return {
    text: entry.text,
    voice: entry.voice ?? defaults.voice,
    speed: entry.speed ?? defaults.speed,
  };
}

function clipHash(spec, encMode) {
  return createHash("sha256")
    .update(JSON.stringify([spec.text, spec.voice, spec.speed, encMode]))
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
    const cfgPath = path.join(VIDEOS_DIR, slug, "narration.mjs");
    if (!(await fileExists(cfgPath))) continue;
    const mod = await import(`${cfgPath}?t=${Math.trunc(performance.now())}`);
    videos.push({ slug, config: mod.default });
  }
  return videos;
}

async function generateVideo({ slug, config }, encMode) {
  const defaults = {
    voice: config.voice ?? DEFAULT_VOICE,
    speed: config.speed ?? DEFAULT_SPEED,
  };
  const outDir = path.join(PUBLIC_NARRATION, slug);
  await mkdir(outDir, { recursive: true });
  const cachePath = path.join(outDir, ".cache.json");
  const cache = await readJson(cachePath, {});
  const nextCache = {};
  const clips = {};
  let synthesized = 0;

  console.log(`\n${slug}:`);
  for (const [key, entry] of Object.entries(config.lines)) {
    const spec = lineSpec(entry, defaults);
    const hash = clipHash(spec, encMode);
    const cached = cache[key];
    if (
      cached &&
      cached.hash === hash &&
      (await fileExists(path.join(outDir, cached.outFile)))
    ) {
      nextCache[key] = cached;
      clips[key] = {
        file: `narration/${slug}/${cached.outFile}`,
        durationSeconds: cached.durationSeconds,
      };
      console.log(`  ${key.padEnd(16)} (cached) ${cached.durationSeconds.toFixed(2)}s`);
      continue;
    }

    const tts = await loadTts();
    const audio = await tts.generate(spec.text, {
      voice: spec.voice,
      speed: spec.speed,
    });
    const durationSeconds =
      Math.round((audio.audio.length / audio.sampling_rate) * 1000) / 1000;
    const { outFile, size } = await encodeClip(
      audio.audio,
      audio.sampling_rate,
      outDir,
      key,
      encMode,
    );
    synthesized++;
    nextCache[key] = { hash, outFile, durationSeconds };
    clips[key] = { file: `narration/${slug}/${outFile}`, durationSeconds };
    console.log(
      `  ${key.padEnd(16)} ${durationSeconds.toFixed(2)}s  ${(size / 1024).toFixed(0)} KB  (${spec.voice} @${spec.speed})`,
    );
  }

  // Remove clips whose keys were deleted from narration.mjs.
  for (const [key, old] of Object.entries(cache)) {
    if (!nextCache[key] && old.outFile) {
      await rm(path.join(outDir, old.outFile), { force: true });
    }
  }

  await writeFile(cachePath, JSON.stringify(nextCache, null, 2));

  const entries = Object.keys(clips)
    .sort()
    .map(
      (k) =>
        `  ${JSON.stringify(k)}: { file: ${JSON.stringify(clips[k].file)}, durationSeconds: ${clips[k].durationSeconds} },`,
    )
    .join("\n");
  const manifest = `// GENERATED FILE — do not edit by hand.
// Produced by scripts/generate-narration.mjs (npm run narration).
// Paths are relative to public/ — pass through staticFile().

import type { NarrationClip } from "../../lib/narration";

export const NARRATION: Record<string, NarrationClip> = {
${entries}
};
`;
  await writeFile(
    path.join(VIDEOS_DIR, slug, "narrationManifest.ts"),
    manifest,
  );
  return synthesized;
}

// --audition <slug>:<key> <outDir> — render one line in candidate voices.
async function runAudition(target, outDir) {
  const [slug, key] = target.split(":");
  const videos = await discoverVideos(slug);
  if (videos.length === 0) {
    console.error(`No video "${slug}" with a narration.mjs found.`);
    process.exit(2);
  }
  const { config } = videos[0];
  const entry = config.lines[key];
  if (!entry) {
    console.error(`No line "${key}" in ${slug}/narration.mjs.`);
    process.exit(2);
  }
  const spec = lineSpec(entry, {
    voice: config.voice ?? DEFAULT_VOICE,
    speed: config.speed ?? DEFAULT_SPEED,
  });
  const encMode = await detectEncoder();
  await mkdir(outDir, { recursive: true });
  console.log(`Auditioning ${slug}:${key} — ${JSON.stringify(spec.text)}\n`);
  const tts = await loadTts();
  for (const { voice, speed } of AUDITION_VOICES) {
    const audio = await tts.generate(spec.text, { voice, speed });
    const dur = audio.audio.length / audio.sampling_rate;
    const { outFile, size } = await encodeClip(
      audio.audio,
      audio.sampling_rate,
      outDir,
      `audition_${voice}`,
      encMode,
    );
    console.log(
      `  ${voice.padEnd(12)} @${speed}  ${dur.toFixed(2)}s  ${(size / 1024).toFixed(0)} KB  -> ${path.join(outDir, outFile)}`,
    );
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const auditionIdx = argv.indexOf("--audition");
  if (auditionIdx !== -1) {
    const target = argv[auditionIdx + 1];
    const outDir = argv[auditionIdx + 2];
    if (!target || !target.includes(":") || !outDir) {
      console.error(
        "Usage: node generate-narration.mjs --audition <slug>:<lineKey> <outDir>",
      );
      process.exit(2);
    }
    return runAudition(target, path.resolve(outDir));
  }

  const videoIdx = argv.indexOf("--video");
  const only = videoIdx !== -1 ? argv[videoIdx + 1] : null;

  const videos = await discoverVideos(only);
  if (videos.length === 0) {
    console.error(
      only
        ? `No video "${only}" with a narration.mjs found under src/videos/.`
        : "No videos with a narration.mjs found under src/videos/.",
    );
    process.exit(1);
  }

  const encMode = await detectEncoder();
  console.log(`Encoder: ${encMode === "wav" ? "16-bit PCM WAV" : `${encMode} -> mp3`}`);

  let synthesized = 0;
  for (const video of videos) {
    synthesized += await generateVideo(video, encMode);
  }
  console.log(
    `\nDone. ${synthesized} clip(s) synthesized, rest served from cache.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
