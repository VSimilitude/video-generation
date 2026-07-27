// Build-time narration generator for all videos in the suite.
//
//   npm run narration                 # all videos
//   npm run narration -- --video foo  # just src/videos/foo
//   npm run narration -- --audition foo:intro /tmp/auditions
//                                     # render one line in several candidate
//                                     # voices so a human can pick by ear
//   npm run narration -- --audition foo:intro /tmp/auditions \
//       --engine minimax --voices Abbess,Imposing_Manner [--emotion happy]
//                                     # same, in candidate MiniMax voices
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
//       // …or move to the other engine entirely:
//       cloud: {
//         text: "Door to door service, darling!",
//         engine: "minimax", voiceId: "Abbess", emotion: "happy", speed: 1.0,
//       },
//       // …or replay an earlier line's *exact recording* under a new key:
//       askAgain: { sameAs: "ask" },
//     },
//   };
//
// SAME RECORDING, TWICE. `{ sameAs: "<earlier key>" }` copies that line's clip
// under this key's own filename — no synthesis, no API call, no money. It is
// for a repetition gag, where the joke is that the line is identical: kokoro
// gives that away for free (it is deterministic), MiniMax does not, and a
// re-generated sentence can come back half a second longer in a different
// reading. An alias must name a line defined *earlier* in the file, and it
// re-copies whenever the source line changes.
//
// TWO ENGINES
//   kokoro  (default) — local, free, instant, the Narrator's voice and the
//                       house default. Nothing about this path has changed.
//   minimax           — MiniMax speech-2.8-hd via Replicate, paid, ~$0.11 per
//                       1000 characters. Character acting: it takes an
//                       `emotion` and honours inline pause markers `<#0.4#>`
//                       (seconds of silence), neither of which kokoro has.
//
// A minimax line declares `engine: "minimax"` and a `voiceId`; `emotion`
// defaults to "auto". Pause markers are a MiniMax feature and are rejected on
// a kokoro line, where the model would read the punctuation out loud.
//
// Output per video (identical for both engines):
//   public/narration/<slug>/<key>.mp3      (mono, 48 kbps; WAV fallback)
//   src/videos/<slug>/narrationManifest.ts (file path + exact duration per key)
//   public/narration/<slug>/.cache.json    (content hashes for skip-unchanged)
//
// Clips whose text/voice/speed (and, on minimax, engine/voiceId/emotion) are
// unchanged since the last run are skipped — the Kokoro model is only loaded
// when at least one kokoro clip needs synthesis, and Replicate is only called
// for minimax lines that actually changed. Paid work is never re-spent by a
// run that fails halfway: each line retries three times on its own, and a line
// that still fails leaves its previous clip in place and reports at the end.

import { writeFile, mkdir, rm, readFile, readdir, stat, copyFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const DEFAULT_VOICE = "af_heart";
const DEFAULT_SPEED = 1.0;

// --- minimax ---------------------------------------------------------------

const MINIMAX_MODEL = "minimax/speech-2.8-hd";
const MINIMAX_EMOTIONS = [
  "auto",
  "happy",
  "sad",
  "angry",
  "fearful",
  "disgusted",
  "surprised",
  "calm",
  "fluent",
  "neutral",
];
// MiniMax's inline silence marker: <#0.5#> is half a second of nothing.
const PAUSE_MARKER = /<#\s*\d+(?:\.\d+)?\s*#>/;
// Same account cap as the background generator: 6 requests/minute.
const MIN_REQUEST_GAP_MS = 12_000;
const POLL_INTERVAL_MS = 1_500;
const POLL_TIMEOUT_MS = 180_000;
// Replicate's published price for speech-2.8-hd, used only for the estimate
// printed at the end of a run.
const MINIMAX_USD_PER_1K_CHARS = 0.11;

// Voices offered by --audition (in addition to the video's own voice).
const AUDITION_VOICES = [
  { voice: "af_heart", speed: 1.0 },
  { voice: "af_bella", speed: 1.0 },
  { voice: "am_michael", speed: 1.0 },
  { voice: "am_puck", speed: 1.05 },
  { voice: "bf_emma", speed: 1.0 },
  { voice: "bm_george", speed: 1.0 },
  // Puff (kids ep 2) candidates — shy little air puff:
  { voice: "af_sky", speed: 1.05 },
  { voice: "af_nicole", speed: 1.0 }, // whispery; may be too quiet for kids
  { voice: "bf_lily", speed: 1.05 },
  { voice: "am_liam", speed: 1.1 },
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

// --- .env ------------------------------------------------------------------

/**
 * Read KEY=value pairs out of the project .env. Deliberately *not*
 * `process.env` — same reasoning as scripts/generate-backgrounds.mjs: the
 * token is never exported in a shell here, and a generator that silently falls
 * back to an unset variable fails halfway through a paid run.
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

// --- mp3 duration ----------------------------------------------------------

// MPEG audio frame tables. Indexed [versionId][layerId]; versionId 0 = MPEG2.5,
// 2 = MPEG2, 3 = MPEG1; layerId 1 = Layer III, 2 = Layer II, 3 = Layer I.
const BITRATES_V1 = {
  3: [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
  2: [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
  1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
};
const BITRATES_V2 = {
  3: [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
  2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
  1: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
};
const SAMPLE_RATES = {
  3: [44100, 48000, 32000], // MPEG1
  2: [22050, 24000, 16000], // MPEG2
  0: [11025, 12000, 8000], // MPEG2.5
};

function parseFrameHeader(buf, at) {
  if (at + 4 > buf.length) return null;
  if (buf[at] !== 0xff || (buf[at + 1] & 0xe0) !== 0xe0) return null;
  const versionId = (buf[at + 1] >> 3) & 3;
  const layerId = (buf[at + 1] >> 1) & 3;
  const bitrateIdx = (buf[at + 2] >> 4) & 15;
  const rateIdx = (buf[at + 2] >> 2) & 3;
  const padding = (buf[at + 2] >> 1) & 1;
  if (versionId === 1 || layerId === 0) return null; // reserved
  if (bitrateIdx === 0 || bitrateIdx === 15 || rateIdx === 3) return null;
  const table = versionId === 3 ? BITRATES_V1 : BITRATES_V2;
  const bitrate = table[layerId][bitrateIdx] * 1000;
  const sampleRate = SAMPLE_RATES[versionId][rateIdx];
  const samples =
    layerId === 3 ? 384 : layerId === 2 ? 1152 : versionId === 3 ? 1152 : 576;
  const size =
    layerId === 3
      ? (Math.floor((12 * bitrate) / sampleRate) + padding) * 4
      : Math.floor((samples / 8) * (bitrate / sampleRate)) + padding;
  if (size < 4) return null;
  const channelMode = (buf[at + 3] >> 6) & 3;
  return { size, samples, sampleRate, versionId, channelMode };
}

/**
 * Exact playback duration of an mp3, by walking its MPEG frames.
 *
 * The whole timeline is derived from these numbers (`buildTimeline` stretches
 * every scene to its clip), so this cannot be an estimate off the bitrate —
 * a VBR file or a stray ID3 tag would put every later scene out of sync. The
 * duration is the sum of each frame's own samples/sampleRate, which is what a
 * decoder will actually play, and the Xing/Info header frame (which carries no
 * audio) is left out of the sum.
 */
function mp3DurationSeconds(buf) {
  let at = 0;
  // ID3v2 tag: 10-byte header, syncsafe size, optional 10-byte footer.
  if (buf.length > 10 && buf.toString("latin1", 0, 3) === "ID3") {
    const size =
      (buf[6] << 21) | (buf[7] << 14) | (buf[8] << 7) | buf[9];
    at = 10 + size + ((buf[5] & 0x10) !== 0 ? 10 : 0);
  }
  let seconds = 0;
  let frames = 0;
  let resyncs = 0;
  while (at + 4 <= buf.length) {
    const header = parseFrameHeader(buf, at);
    if (!header) {
      // ID3v1 trailer, album art, or junk between frames — step and resync.
      if (++resyncs > 1_000_000) break;
      at++;
      continue;
    }
    const isXing =
      frames === 0 &&
      (() => {
        const sideInfo =
          header.versionId === 3
            ? header.channelMode === 3
              ? 17
              : 32
            : header.channelMode === 3
              ? 9
              : 17;
        const tagAt = at + 4 + sideInfo;
        const tag = buf.toString("latin1", tagAt, tagAt + 4);
        return tag === "Xing" || tag === "Info";
      })();
    if (!isXing) seconds += header.samples / header.sampleRate;
    frames++;
    at += header.size;
  }
  if (frames === 0) throw new Error("no MPEG audio frames found in downloaded clip");
  return Math.round(seconds * 1000) / 1000;
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
 * One MiniMax prediction, from POST to downloaded mp3 bytes.
 *
 * `Prefer: wait` asks Replicate to hold the connection until the prediction
 * finishes, but it is a preference — the poll below is the real completion
 * check, exactly as in scripts/generate-backgrounds.mjs.
 */
async function synthesizeMiniMax(token, spec) {
  const url = `https://api.replicate.com/v1/models/${MINIMAX_MODEL}/predictions`;
  const input = {
    text: spec.text,
    voice_id: spec.voiceId,
    emotion: spec.emotion,
  };
  if (spec.speed !== 1) input.speed = spec.speed;
  const body = JSON.stringify({ input });

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
    if (!res.ok) throw new Error(`replicate ${res.status}: ${await res.text()}`);
    prediction = await res.json();
    break;
  }
  if (!prediction) throw new Error("replicate: still rate limited after 5 attempts");

  const started = Date.now();
  while (prediction.status !== "succeeded") {
    if (prediction.status === "failed" || prediction.status === "canceled") {
      throw new Error(`prediction ${prediction.status}: ${prediction.error ?? ""}`);
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
  const audioUrl = Array.isArray(out) ? out[0] : out;
  if (typeof audioUrl !== "string") {
    throw new Error(`prediction succeeded with no audio url: ${JSON.stringify(out)}`);
  }
  const audio = await fetch(audioUrl);
  if (!audio.ok) throw new Error(`download ${audio.status} for ${audioUrl}`);
  const bytes = Buffer.from(await audio.arrayBuffer());
  if (bytes.length === 0) throw new Error("downloaded clip was empty");
  return bytes;
}

/**
 * `synthesizeMiniMax` with retries. Replicate returns the occasional
 * infrastructure failure that succeeds on the next identical request; the
 * background generator lost six paid images to one before it retried.
 */
async function synthesizeMiniMaxWithRetry(token, spec, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await synthesizeMiniMax(token, spec);
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

// Normalize a line entry ("text" or {text, voice?, speed?, engine?, voiceId?,
// emotion?, sameAs?}) against the video's defaults.
function lineSpec(entry, defaults) {
  if (typeof entry === "string") return { engine: "kokoro", text: entry, ...defaults };
  if (entry.sameAs) return { engine: "alias", sameAs: entry.sameAs };
  const engine = entry.engine ?? "kokoro";
  if (engine === "minimax") {
    return {
      engine,
      text: entry.text,
      voiceId: entry.voiceId,
      emotion: entry.emotion ?? "auto",
      speed: entry.speed ?? defaults.speed,
    };
  }
  return {
    engine,
    text: entry.text,
    voice: entry.voice ?? defaults.voice,
    speed: entry.speed ?? defaults.speed,
  };
}

// Every way a line can be wrong, checked before anything is synthesized or
// paid for. Returns a list of human-readable problems. `order` is the video's
// key list, needed only to check that an alias points backwards at a real line.
function specProblems(spec, order = [], key = null) {
  const problems = [];
  if (spec.engine === "alias") {
    const at = order.indexOf(spec.sameAs);
    if (at < 0) {
      problems.push(`sameAs names ${JSON.stringify(spec.sameAs)}, which is not a line here`);
    } else if (key !== null && at >= order.indexOf(key)) {
      // The copy is made as the run walks the file in order, so the source has
      // to have been made already. Aliasing forwards would silently produce a
      // clip of nothing.
      problems.push(
        `sameAs points forwards at ${JSON.stringify(spec.sameAs)} — an alias must name an earlier line`,
      );
    }
    if (spec.sameAs === key) problems.push("sameAs points at itself");
    return problems;
  }
  if (typeof spec.text !== "string" || spec.text.trim() === "") {
    problems.push("has no text");
  }
  if (spec.engine !== "kokoro" && spec.engine !== "minimax") {
    problems.push(`unknown engine ${JSON.stringify(spec.engine)} (kokoro | minimax)`);
    return problems;
  }
  if (spec.engine === "kokoro") {
    // A pause marker is a MiniMax instruction. Kokoro has no idea, and reads
    // the punctuation out loud — silently, into a finished episode.
    if (typeof spec.text === "string" && PAUSE_MARKER.test(spec.text)) {
      problems.push(
        "contains a MiniMax pause marker (<#0.4#>) on a kokoro line — " +
          "kokoro would read it aloud; remove it or move the line to minimax",
      );
    }
    if (!spec.voice) problems.push("has no voice");
  } else {
    if (!spec.voiceId) problems.push('is engine "minimax" but has no voiceId');
    if (!MINIMAX_EMOTIONS.includes(spec.emotion)) {
      problems.push(
        `emotion ${JSON.stringify(spec.emotion)} is not one of ${MINIMAX_EMOTIONS.join(", ")}`,
      );
    }
  }
  if (typeof spec.speed !== "number" || !(spec.speed > 0)) {
    problems.push(`speed ${JSON.stringify(spec.speed)} is not a positive number`);
  }
  return problems;
}

function clipHash(spec, encMode, sourceHash) {
  // The kokoro hash is exactly what it always was, so an engine that gained
  // fields does not re-synthesize a single existing clip. The minimax hash
  // leaves out encMode — the mp3 arrives already encoded, and a machine that
  // gains ffmpeg must not re-buy 75 lines. An alias hashes its *source's* hash,
  // so re-wording the source re-copies the alias.
  const material =
    spec.engine === "alias"
      ? ["alias", spec.sameAs, sourceHash]
      : spec.engine === "minimax"
        ? [MINIMAX_MODEL, spec.text, spec.voiceId, spec.emotion, spec.speed]
        : [spec.text, spec.voice, spec.speed, encMode];
  return createHash("sha256")
    .update(JSON.stringify(material))
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

async function generateVideo({ slug, config }, encMode, token) {
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
  const failed = [];
  let synthesized = 0;
  let paidChars = 0;

  console.log(`\n${slug}:`);
  const hashes = {};
  for (const [key, entry] of Object.entries(config.lines)) {
    const spec = lineSpec(entry, defaults);
    const hash = clipHash(spec, encMode, hashes[spec.sameAs]);
    hashes[key] = hash;
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

    if (spec.engine === "alias") {
      // A second key that plays the *same recording* as an earlier one.
      //
      // This exists for repetition gags. Kokoro is deterministic, so two keys
      // carrying the same words in the same voice used to produce byte-identical
      // clips for free; MiniMax is a remote model called once per key, and the
      // wind episode's beetle said its one sentence 0.65s slower the second time
      // it was generated. A running gag whose whole mechanism is the sameness
      // cannot be left to that, and re-buying the line is both a cost and a
      // second roll of the dice. The bytes are copied under the alias key's own
      // filename, so nothing downstream can tell the difference — several places
      // recover a line key from its clip path.
      const source = clips[spec.sameAs];
      if (!source) {
        failed.push(`${key}: sameAs "${spec.sameAs}" has no clip`);
        console.log(`  ${key.padEnd(16)} FAILED — sameAs "${spec.sameAs}" has no clip`);
        continue;
      }
      const sourceFile = source.file.split("/").pop();
      const outFile = `${key}${path.extname(sourceFile)}`;
      await copyFile(path.join(outDir, sourceFile), path.join(outDir, outFile));
      if (cached?.outFile && cached.outFile !== outFile) {
        await rm(path.join(outDir, cached.outFile), { force: true });
      }
      const { durationSeconds } = source;
      nextCache[key] = { hash, outFile, durationSeconds };
      clips[key] = { file: `narration/${slug}/${outFile}`, durationSeconds };
      console.log(
        `  ${key.padEnd(16)} ${durationSeconds.toFixed(2)}s  (same recording as ${spec.sameAs})`,
      );
      continue;
    }

    if (spec.engine === "minimax") {
      // Paid, remote and occasionally flaky: one line failing must not cost
      // the others. Keep whatever is already on disk for this key, carry on,
      // and fail the *run* at the end.
      try {
        if (!token) {
          throw new Error(
            "no REPLICATE_API_TOKEN in .env (minimax clips are committed, so a " +
              "checkout only needs this to *change* a line)",
          );
        }
        const t0 = Date.now();
        const bytes = await synthesizeMiniMaxWithRetry(token, spec);
        const outFile = `${key}.mp3`;
        await writeFile(path.join(outDir, outFile), bytes);
        // A line that used to be kokoro-on-a-machine-without-an-encoder left a
        // .wav behind; the delete-removed-keys sweep below won't catch it,
        // because the key is still here.
        if (cached?.outFile && cached.outFile !== outFile) {
          await rm(path.join(outDir, cached.outFile), { force: true });
        }
        const durationSeconds = mp3DurationSeconds(bytes);
        synthesized++;
        paidChars += spec.text.length;
        nextCache[key] = { hash, outFile, durationSeconds };
        clips[key] = { file: `narration/${slug}/${outFile}`, durationSeconds };
        console.log(
          `  ${key.padEnd(16)} ${durationSeconds.toFixed(2)}s  ${(bytes.length / 1024).toFixed(0)} KB  ` +
            `(minimax ${spec.voiceId}/${spec.emotion} @${spec.speed}, ${((Date.now() - t0) / 1000).toFixed(1)}s)`,
        );
      } catch (err) {
        failed.push(`${key}: ${err.message}`);
        if (cached && (await fileExists(path.join(outDir, cached.outFile)))) {
          nextCache[key] = cached;
          clips[key] = {
            file: `narration/${slug}/${cached.outFile}`,
            durationSeconds: cached.durationSeconds,
          };
        }
        console.log(`  ${key.padEnd(16)} FAILED — ${err.message}`);
      }
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
  return { synthesized, failed, paidChars };
}

// --audition <slug>:<key> <outDir> — render one line in candidate voices.
// With --engine minimax --voices a,b,c the candidates are MiniMax voice ids
// instead, optionally in a chosen --emotion.
async function runAudition(target, outDir, opts = {}) {
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
  await mkdir(outDir, { recursive: true });

  if (opts.engine === "minimax") {
    const voices = opts.voices ?? [];
    if (voices.length === 0) {
      console.error(
        "--engine minimax needs --voices <id1,id2,…> (MiniMax voice ids).",
      );
      process.exit(2);
    }
    const emotion = opts.emotion ?? spec.emotion ?? "auto";
    if (!MINIMAX_EMOTIONS.includes(emotion)) {
      console.error(`--emotion must be one of ${MINIMAX_EMOTIONS.join(", ")}.`);
      process.exit(2);
    }
    const token = (await readEnvFile()).REPLICATE_API_TOKEN;
    if (!token) {
      console.error("No REPLICATE_API_TOKEN in .env — minimax auditions need one.");
      process.exit(2);
    }
    const speed = opts.speed ?? spec.speed;
    console.log(
      `Auditioning ${slug}:${key} on ${MINIMAX_MODEL} (${emotion} @${speed}) — ${JSON.stringify(spec.text)}\n`,
    );
    for (const voiceId of voices) {
      try {
        const bytes = await synthesizeMiniMaxWithRetry(token, {
          text: spec.text,
          voiceId,
          emotion,
          speed,
        });
        const outFile = `audition_${voiceId}_${emotion}.mp3`;
        await writeFile(path.join(outDir, outFile), bytes);
        console.log(
          `  ${voiceId.padEnd(20)} ${mp3DurationSeconds(bytes).toFixed(2)}s  ` +
            `${(bytes.length / 1024).toFixed(0)} KB  -> ${path.join(outDir, outFile)}`,
        );
      } catch (err) {
        // One candidate failing should not cost the rest of the audition.
        console.log(`  ${voiceId.padEnd(20)} FAILED — ${err.message}`);
      }
    }
    return;
  }

  // Kokoro auditions: a minimax line's pause markers mean nothing here, so
  // strip them rather than have the model read them out.
  const text = spec.text.replace(new RegExp(PAUSE_MARKER.source, "g"), " ").trim();
  if (text !== spec.text) {
    console.log("(stripped MiniMax pause markers for the kokoro audition)");
  }
  const encMode = await detectEncoder();
  console.log(`Auditioning ${slug}:${key} — ${JSON.stringify(text)}\n`);
  const tts = await loadTts();
  for (const { voice, speed } of AUDITION_VOICES) {
    const audio = await tts.generate(text, { voice, speed });
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
  const flag = (name) => {
    const i = argv.indexOf(name);
    return i === -1 ? null : argv[i + 1];
  };
  const auditionIdx = argv.indexOf("--audition");
  if (auditionIdx !== -1) {
    const target = argv[auditionIdx + 1];
    const outDir = argv[auditionIdx + 2];
    if (!target || !target.includes(":") || !outDir) {
      console.error(
        "Usage: node generate-narration.mjs --audition <slug>:<lineKey> <outDir>\n" +
          "       [--engine minimax --voices <id1,id2,…> [--emotion happy] [--speed 1.0]]",
      );
      process.exit(2);
    }
    return runAudition(target, path.resolve(outDir), {
      engine: flag("--engine") ?? "kokoro",
      voices: flag("--voices")?.split(",").map((s) => s.trim()).filter(Boolean),
      emotion: flag("--emotion"),
      speed: flag("--speed") ? Number(flag("--speed")) : null,
    });
  }

  const only = flag("--video");

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

  // Validate every line of every video before synthesizing anything: a bad
  // emotion or a pause marker on a kokoro line should cost nothing to find.
  const invalid = [];
  let usesMiniMax = false;
  for (const { slug, config } of videos) {
    const defaults = {
      voice: config.voice ?? DEFAULT_VOICE,
      speed: config.speed ?? DEFAULT_SPEED,
    };
    const order = Object.keys(config.lines);
    for (const [key, entry] of Object.entries(config.lines)) {
      const spec = lineSpec(entry, defaults);
      if (spec.engine === "minimax") usesMiniMax = true;
      for (const problem of specProblems(spec, order, key)) {
        invalid.push(`${slug}/${key} ${problem}`);
      }
    }
  }
  if (invalid.length > 0) {
    console.error(`\n${invalid.length} invalid line(s):`);
    for (const p of invalid) console.error(`  ${p}`);
    process.exit(2);
  }

  const token = usesMiniMax ? (await readEnvFile()).REPLICATE_API_TOKEN : null;

  let synthesized = 0;
  let paidChars = 0;
  const failed = [];
  for (const video of videos) {
    const res = await generateVideo(video, encMode, token);
    synthesized += res.synthesized;
    paidChars += res.paidChars;
    failed.push(...res.failed.map((f) => `${video.slug}/${f}`));
  }
  console.log(
    `\nDone. ${synthesized} clip(s) synthesized, rest served from cache.`,
  );
  if (paidChars > 0) {
    const usd = (paidChars / 1000) * MINIMAX_USD_PER_1K_CHARS;
    console.log(
      `MiniMax: ${paidChars} characters this run ≈ $${usd.toFixed(2)} at $${MINIMAX_USD_PER_1K_CHARS}/1k.`,
    );
  }
  if (failed.length > 0) {
    console.error(`\n${failed.length} clip(s) FAILED:`);
    for (const f of failed) console.error(`  ${f}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
