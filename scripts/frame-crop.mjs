// Crop and zoom a PNG so a detail can actually be looked at — the last step of
// a promotion check, where a frame that changed on purpose has to be seen
// rather than counted.
//
//   node scripts/frame-crop.mjs in.png out.png <x> <y> <w> <h> [zoom]
//
// Coordinates are in the input image's own pixels (frame-grid.mjs writes stills
// at half size, so composition x/2). Nearest-neighbour, because the point is to
// see which pixels are there.
import { readFileSync, writeFileSync } from "node:fs";
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

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodeRGB(width, height, rgb) {
  const stride = width * 3;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const [inFile, outFile, X, Y, W, H, Z] = process.argv.slice(2);
const x0 = Number(X);
const y0 = Number(Y);
const w = Number(W);
const h = Number(H);
const zoom = Number(Z ?? 3);
const img = decode(inFile);
const out = Buffer.alloc(w * zoom * h * zoom * 3);
for (let y = 0; y < h * zoom; y++) {
  for (let x = 0; x < w * zoom; x++) {
    const sx = x0 + Math.floor(x / zoom);
    const sy = y0 + Math.floor(y / zoom);
    const si = (sy * img.width + sx) * img.ch;
    const di = (y * w * zoom + x) * 3;
    for (let c = 0; c < 3; c++) out[di + c] = img.data[si + c];
  }
}
writeFileSync(outFile, encodeRGB(w * zoom, h * zoom, out));
console.log(`${outFile}  ${w * zoom}x${h * zoom}`);
