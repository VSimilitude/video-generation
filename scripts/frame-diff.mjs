// Compare two frame grids produced by scripts/frame-grid.mjs, pixel by pixel.
//
//   node scripts/frame-diff.mjs <dirA> <dirB>
//
// **Do not compare PNG hashes.** Chrome's rasterizer is not bit-deterministic
// across runs: rendering the *same* code twice disagreed on 22 of 831 frames
// (antialiased edges, dithered gradients), which a hash cannot tell from a prop
// that moved. So this counts pixels instead, and the procedure is: render the
// grid twice from the final tree to measure the noise floor, then require the
// real before/after comparison to sit at or below it everywhere except the
// frames you meant to change — and look at those (scripts/frame-crop.mjs).

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

function decode(file) {
  const buf = readFileSync(file);
  let pos = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    pos += len + 12;
  }
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * ch;
  const out = Buffer.alloc(height * stride);
  let p = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[p++];
    const line = raw.subarray(p, p + stride);
    p += stride;
    const o = y * stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? out[o + i - ch] : 0;
      const b = y > 0 ? out[o - stride + i] : 0;
      const c = i >= ch && y > 0 ? out[o - stride + i - ch] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const pp = a + b - c;
        const pa = Math.abs(pp - a);
        const pb = Math.abs(pp - b);
        const pc = Math.abs(pp - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[o + i] = v & 0xff;
    }
  }
  return { width, height, ch, data: out };
}

// A pixel only counts as changed if the change is *visible*: a channel delta of
// 8/255 or more. Below that is the rasterizer's own noise.
const VISIBLE = 8;

const [dirA, dirB] = process.argv.slice(2, 4);
const files = readdirSync(dirA).filter((f) => f.endsWith(".png")).sort();
const rows = [];
for (const f of files) {
  const a = decode(path.join(dirA, f));
  const b = decode(path.join(dirB, f));
  let changed = 0;
  let strong = 0;
  let max = 0;
  for (let i = 0; i < a.data.length; i += a.ch) {
    let d = 0;
    for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(a.data[i + c] - b.data[i + c]));
    if (d > 0) changed++;
    if (d >= VISIBLE) strong++;
    if (d > max) max = d;
  }
  rows.push({ f, changed, strong, max, total: a.width * a.height });
}

rows.sort((x, y) => y.strong - x.strong);
const any = rows.filter((r) => r.changed > 0);
console.log(`${files.length} frames compared; ${any.length} differ at all.`);
console.log(`Frames with >=1 visibly changed pixel (delta >= ${VISIBLE}):`);
for (const r of rows.filter((r) => r.strong > 0)) {
  console.log(
    `  ${r.f}  visible: ${r.strong} (${((r.strong / r.total) * 100).toFixed(3)}%)  any: ${r.changed}  max: ${r.max}`,
  );
}
const worstNoise = rows.filter((r) => r.strong === 0).reduce((m, r) => Math.max(m, r.changed), 0);
console.log(`Noise floor: worst frame with no visible change touched ${worstNoise} pixels.`);
