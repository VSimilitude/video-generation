// Offline plate keyer + atmosphere bake for `water-cycle-remaster` (decision log D17).
//
//   node src/videos/water-cycle-remaster/key-plates.mjs [--only k1,k2]
//
// Reads backgrounds.mjs (+ the generated backgroundManifest.ts paths), and for every entry with a
// `key` field writes public/backgrounds/water-cycle-remaster/keyed/<key>.webp with a real alpha:
//   magenta | green — chroma key. The key colour K is MEASURED from the plate (mean of the pixels
//     that are obviously key), so a painted, brush-textured key still keys; alpha ramps with RGB
//     distance from K (d0 = background noise, d1 = d0 + 90), then the colour is UNMIXED,
//     O = K + (C − K) / α, so soft painted edges keep their own colour instead of a pink fringe.
//     A light despill caps the key's channel signature on partial-alpha pixels.
//   black — luma key (mist, rain, spray): α from brightness, colour = the entry's `tint`.
// Then the Step-2 atmosphere is baked by `depth` (far ≤0.15: saturation ×0.7 + 1.5 px blur;
// mid 0.4: ×0.9; fg 1.3: brightness ×0.92 + 2.5 px blur; blur is premultiplied so edges stay
// clean) — so scenes use <Plane flat> with no live filter at all.
// Sky/insert plates (no `key`) pass through untouched. Writes plateManifest.ts (GENERATED).
// Deterministic; free; re-run after any re-roll.

import sharp from "sharp";
import path from "node:path";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../..");
const SLUG = "water-cycle-remaster";
const PUB = path.join(ROOT, "public");
const KEYED_DIR = path.join(PUB, "backgrounds", SLUG, "keyed");

const argv = process.argv.slice(2);
const onlyIdx = argv.indexOf("--only");
const only = onlyIdx >= 0 ? argv[onlyIdx + 1].split(",") : null;

const config = (await import(path.join(HERE, "backgrounds.mjs"))).default;
// The generator's manifest when present; otherwise any `<key>.webp` already on disk.
const manifestSrc = await readFile(path.join(HERE, "backgroundManifest.ts"), "utf8").catch(() => "");
const generated = Object.fromEntries(
  [...manifestSrc.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]),
);
for (const key of Object.keys(config.backgrounds)) {
  const rel = `backgrounds/${SLUG}/${key}.webp`;
  if (!generated[key] && existsSync(path.join(PUB, rel))) generated[key] = rel;
}

const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const smooth = (u) => {
  const t = clamp(u);
  return t * t * (3 - 2 * t);
};

// Flux never paints the key colour as asked: "magenta" comes back pink (#ff90d0), "green" comes
// back lime/yellow (#e0f060) or olive. So the key is MEASURED: the most frequent colour bin of the
// plate (the flat background is by far the largest flat area), refined per horizontal band from
// the pixels near it. `mode` only names what was asked for (logged).
const looksAsked = (mode, r, g, b) =>
  mode === "magenta" ? r > g + 40 && b > g + 20 : g >= Math.max(r, b) && g - Math.min(r, b) > 60;

/** Most frequent colour bin — among bins that look like the asked key when those cover ≥ 5%. */
function dominantColour(data, n, mode) {
  const bins = new Map();
  for (let i = 0; i < n; i += 3) {
    const k = ((data[i * 3] >> 3) << 10) | ((data[i * 3 + 1] >> 3) << 5) | (data[i * 3 + 2] >> 3);
    bins.set(k, (bins.get(k) ?? 0) + 1);
  }
  const rgbOf = (k) => [((k >> 10) & 31) * 8 + 4, ((k >> 5) & 31) * 8 + 4, (k & 31) * 8 + 4];
  let asked = 0;
  for (const [k, c] of bins) if (looksAsked(mode, ...rgbOf(k))) asked += c;
  const restrict = asked >= (n / 3) * 0.05;
  let best = 0, bk = 0;
  for (const [k, c] of bins) {
    if (restrict && !looksAsked(mode, ...rgbOf(k))) continue;
    if (c > best) { best = c; bk = k; }
  }
  return [((bk >> 10) & 31) * 8 + 4, ((bk >> 5) & 31) * 8 + 4, (bk & 31) * 8 + 4];
}

let KEY0 = [255, 0, 255];
function isKeyish(_mode, r, g, b) {
  return Math.hypot(r - KEY0[0], g - KEY0[1], b - KEY0[2]) < 48;
}

const BANDS = 12;

function chromaKey(data, w, h, mode) {
  const n = w * h;
  KEY0 = dominantColour(data, n, mode);
  // 1. measure K per horizontal band (the key is often a soft vertical gradient)
  const acc = Array.from({ length: BANDS }, () => [0, 0, 0, 0]);
  let total = 0;
  for (let i = 0; i < n; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    if (!isKeyish(mode, r, g, b)) continue;
    const band = Math.min(BANDS - 1, Math.floor(((i / w) | 0) * BANDS / h));
    const A = acc[band];
    A[0] += r; A[1] += g; A[2] += b; A[3]++;
    total++;
  }
  if (total < n * 0.03) throw new Error(`key ${mode}: only ${(100 * total / n).toFixed(1)}% key pixels — re-roll this plate`);
  const all = acc.reduce((s, A) => [s[0] + A[0], s[1] + A[1], s[2] + A[2], s[3] + A[3]], [0, 0, 0, 0]);
  const G = [all[0] / all[3], all[1] / all[3], all[2] / all[3]];
  let Ks = acc.map((A) => (A[3] > w * 2 ? [A[0] / A[3], A[1] / A[3], A[2] / A[3]] : null));
  // fill empty bands from the nearest measured band (or the global mean)
  Ks = Ks.map((K, i) => {
    if (K) return K;
    for (let d = 1; d < BANDS; d++) {
      if (Ks[i - d]) return Ks[i - d];
      if (Ks[i + d]) return Ks[i + d];
    }
    return G;
  });
  // band centre interpolation
  const Kat = (y) => {
    const f = (y / h) * BANDS - 0.5;
    const i0 = Math.max(0, Math.min(BANDS - 1, Math.floor(f)));
    const i1 = Math.min(BANDS - 1, i0 + 1);
    const u = Math.max(0, Math.min(1, f - i0));
    return [0, 1, 2].map((c) => Ks[i0][c] * (1 - u) + Ks[i1][c] * u);
  };
  const d0 = 26;
  const d1 = 78;
  const out = Buffer.alloc(n * 4);
  for (let y = 0; y < h; y++) {
    const K = Kat(y);
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
      const d = Math.hypot(r - K[0], g - K[1], b - K[2]);
      const a = smooth((d - d0) / (d1 - d0));
      if (a < 1) {
        // Half-strength unmix (a full unmix is ill-conditioned when flux paints the
        // key pale), then despill the key's channel signature.
        const am = Math.max(a, 0.5);
        r = clamp(K[0] + (r - K[0]) / am, 0, 255);
        g = clamp(K[1] + (g - K[1]) / am, 0, 255);
        b = clamp(K[2] + (b - K[2]) / am, 0, 255);
        // generic despill: remove the key's chroma (K minus its grey) in proportion to 1 − α
        const kg = (K[0] + K[1] + K[2]) / 3;
        const sp = (1 - a) * 0.8;
        r = clamp(r - (K[0] - kg) * sp, 0, 255);
        g = clamp(g - (K[1] - kg) * sp, 0, 255);
        b = clamp(b - (K[2] - kg) * sp, 0, 255);
      }
      out[i * 4] = r; out[i * 4 + 1] = g; out[i * 4 + 2] = b; out[i * 4 + 3] = Math.round(a * 255);
    }
  }
  return { out, K: G, d0 };
}

/** Luma key: brightness → alpha; colour = the entry's `tint` (default paper cream) shaded by brightness. */
function lumaKey(data, n, tint = "#efe6d6") {
  const T = [1, 3, 5].map((o) => parseInt(tint.slice(o, o + 2), 16));
  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const a = smooth((L - 0.06) / 0.55);
    const shade = 0.82 + 0.18 * clamp(L / 0.7);
    out[i * 4] = T[0] * shade; out[i * 4 + 1] = T[1] * shade; out[i * 4 + 2] = T[2] * shade;
    out[i * 4 + 3] = Math.round(a * 255);
  }
  return { out };
}

/** Horizon cut derived from the key: per column, opaque from the first solid row down (3 px feather). */
function fillBelow(rgba, w, h, src) {
  for (let x = 0; x < w; x++) {
    let top = -1;
    for (let y = 0; y < h; y++) {
      // first row that is solid for 4 rows running (ignores specks in the key)
      let solid = true;
      for (let k = 0; k < 4 && y + k < h; k++) if (rgba[((y + k) * w + x) * 4 + 3] < 200) { solid = false; break; }
      if (solid) { top = y; break; }
    }
    if (top < 0) continue;
    for (let y = 0; y < h; y++) {
      const i = (y * w + x) * 4 + 3;
      if (y >= top) {
        // inside the band: the painted colour as generated (no unmix/despill)
        const j = y * w + x;
        if (y >= top + 3) { rgba[i - 3] = src[j * 3]; rgba[i - 2] = src[j * 3 + 1]; rgba[i - 1] = src[j * 3 + 2]; }
        rgba[i] = 255;
      }
      else if (y >= top - 3) rgba[i] = Math.max(rgba[i], Math.round(255 * (1 - (top - y) / 4)));
      else rgba[i] = Math.min(rgba[i], 40); // nothing solid floats above the horizon
    }
  }
}

function atmosphere(depth) {
  if (depth === "sky") return null;
  if (depth <= 0.2) return { sat: 0.7, blur: 0.9, bright: 1 };
  if (depth <= 0.6) return { sat: 0.9, blur: 0, bright: 1 };
  if (depth <= 1.05) return null;
  return { sat: 1, blur: 1.5, bright: 0.92 };
}

async function bake(rgba, w, h, atm) {
  if (!atm) return rgba;
  const n = w * h;
  // saturation + brightness in place (luma-preserving lerp)
  for (let i = 0; i < n; i++) {
    const r = rgba[i * 4], g = rgba[i * 4 + 1], b = rgba[i * 4 + 2];
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    rgba[i * 4] = clamp((L + (r - L) * atm.sat) * atm.bright, 0, 255);
    rgba[i * 4 + 1] = clamp((L + (g - L) * atm.sat) * atm.bright, 0, 255);
    rgba[i * 4 + 2] = clamp((L + (b - L) * atm.sat) * atm.bright, 0, 255);
  }
  if (!atm.blur) return rgba;
  // premultiplied blur
  const pm = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const a = rgba[i * 4 + 3] / 255;
    pm[i * 4] = rgba[i * 4] * a; pm[i * 4 + 1] = rgba[i * 4 + 1] * a; pm[i * 4 + 2] = rgba[i * 4 + 2] * a; pm[i * 4 + 3] = rgba[i * 4 + 3];
  }
  const bl = await sharp(pm, { raw: { width: w, height: h, channels: 4 } }).blur(atm.blur).raw().toBuffer();
  for (let i = 0; i < n; i++) {
    const a = bl[i * 4 + 3] / 255;
    if (a > 0.004) {
      bl[i * 4] = clamp(bl[i * 4] / a, 0, 255); bl[i * 4 + 1] = clamp(bl[i * 4 + 1] / a, 0, 255); bl[i * 4 + 2] = clamp(bl[i * 4 + 2] / a, 0, 255);
    }
  }
  return bl;
}

await mkdir(KEYED_DIR, { recursive: true });
const plates = {};
const report = [];
for (const [key, spec] of Object.entries(config.backgrounds)) {
  const src = generated[key];
  const depth = spec.depth ?? "sky";
  if (!src) { report.push(`${key}: MISSING (not generated)`); continue; }
  if (!spec.key) { plates[key] = { src, depth, keyed: false }; continue; }
  const keyedRel = `backgrounds/${SLUG}/keyed/${key}.webp`;
  plates[key] = { src: keyedRel, depth, keyed: true };
  if (only && !only.includes(key)) continue;
  const { data, info } = await sharp(path.join(PUB, src)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  let res;
  try {
    res = spec.key === "black" ? lumaKey(data, n, spec.tint) : chromaKey(data, info.width, info.height, spec.key);
  } catch (e) {
    report.push(`${key}: FAILED ${e.message}`);
    plates[key] = { src, depth, keyed: false };
    continue;
  }
  if (spec.fill === "below") fillBelow(res.out, info.width, info.height, data);
  const baked = await bake(res.out, info.width, info.height, atmosphere(depth));
  await sharp(baked, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(path.join(PUB, keyedRel));
  let opaque = 0;
  for (let i = 0; i < n; i++) if (baked[i * 4 + 3] > 128) opaque++;
  report.push(`${key}: ${spec.key} ${res.K ? `K=${res.K.map((v) => v.toFixed(0)).join(",")} d0=${res.d0.toFixed(0)} ` : ""}opaque=${((100 * opaque) / n).toFixed(1)}%`);
}

const lines = Object.keys(plates).sort().map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(plates[k])},`).join("\n");
await writeFile(
  path.join(HERE, "plateManifest.ts"),
  `// GENERATED FILE — do not edit by hand.\n// Produced by src/videos/water-cycle-remaster/key-plates.mjs (after npm run backgrounds).\n// Paths are relative to public/ — pass through staticFile(). keyed = alpha + baked atmosphere.\n\nexport const PLATES = {\n${lines}\n} as const;\n\nexport type PlateKey = keyof typeof PLATES;\n`,
);
console.log(report.join("\n"));
