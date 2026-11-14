import { getStroke } from "perfect-freehand";

// Tapered ink — the look package's answer to "uniform SVG stroke = clip-art"
// (docs/ANIMATION-ROADMAP.md Step 2, gap 1 §2).
//
// `ribbon()` turns a polyline into a FILLED variable-width outline with
// perfect-freehand (deterministic: the outline is a pure function of the
// points and options; no Math.random anywhere). Pressure is baked into each
// point instead of simulated, so the thick side of a closed contour is a
// choice (`thickAt`, default: the bottom — ink pools where gravity puts it)
// and an open stroke swells in the middle and tapers at both ends.
//
// `outlinePath()` samples an existing SVG path string (M L H V C S Q T A Z,
// absolute + relative) into polylines, so a character's current outline can
// become a ribbon without being redrawn.

export type Pt = [number, number];

/** FNV-1a, for seeds and filter ids. */
export function hashKey(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) % 100000;
}

/** Deterministic 0..1 noise from an integer pair. */
function rand(seed: number, i: number): number {
  let x = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(i + 1, 0xc2b2ae35);
  x ^= x >>> 15;
  x = Math.imul(x, 0x2c1b3c6d);
  x ^= x >>> 12;
  return ((x >>> 0) % 10000) / 10000;
}

const avg = (a: number, b: number) => (a + b) / 2;

/** perfect-freehand outline polygon -> closed SVG path (the README recipe). */
export function svgFromStroke(points: number[][]): string {
  const len = points.length;
  if (len < 4) return "";
  let a = points[0];
  let b = points[1];
  const c = points[2];
  let out =
    `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(2)} ` +
    `${avg(b[0], c[0]).toFixed(2)},${avg(b[1], c[1]).toFixed(2)} T`;
  for (let i = 2; i < len - 1; i++) {
    a = points[i];
    b = points[i + 1];
    out += `${avg(a[0], b[0]).toFixed(2)},${avg(a[1], b[1]).toFixed(2)} `;
  }
  return out + "Z";
}

export type RibbonOpts = {
  /** Closed contour (body outline) vs open stroke (a ray, a crease). */
  closed?: boolean;
  /** Closed only: direction (radians, SVG y-down) of the thickest ink. Default π/2 = bottom. */
  thickAt?: number;
  /** Perpendicular hand wobble in px, seeded. Default 0.7. */
  jitter?: number;
  /** perfect-freehand thinning; 0.6 per the spec. */
  thinning?: number;
  /** Open strokes longer than this (px) swell/thin every `period` px. Default 320. */
  period?: number;
};

/**
 * Variable-width ink along `points`: width runs between `w1` (thinnest) and
 * `w0` (thickest). Returns a filled-path `d` string — draw it with
 * `<path d={...} fill={ink} />`, never with `stroke`.
 */
export function ribbon(points: Pt[], w0: number, w1: number, seed = 0, opts: RibbonOpts = {}): string {
  const n = points.length;
  if (n < 2) return "";
  const closed = opts.closed ?? false;
  const thinning = opts.thinning ?? 0.6;
  const jitter = opts.jitter ?? 0.7;
  // perfect-freehand: diameter = size * (1 - thinning + 2·thinning·p) at
  // pressure p (radius = size·(0.5 − thinning·(0.5 − p))). p = 1 gives w0.
  const size = w0 / (1 + thinning);
  const pMin = Math.max(0, Math.min(1, (w1 / size - (1 - thinning)) / (2 * thinning)));

  let cx = 0;
  let cy = 0;
  for (const [x, y] of points) {
    cx += x / n;
    cy += y / n;
  }
  const thickAt = opts.thickAt ?? Math.PI / 2;
  const phase = rand(seed, 7) * 0.6 - 0.3;

  // Open strokes: cumulative length, so a long horizon line swells and thins
  // every ~`period` px instead of reading as one uniform band.
  const cum: number[] = [0];
  for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  const period = opts.period ?? 320;
  const swellPhase = rand(seed, 13) * Math.PI * 2;

  const pts: number[][] = points.map(([x, y], i) => {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(n - 1, i + 1)];
    const tx = next[0] - prev[0];
    const ty = next[1] - prev[1];
    const tl = Math.hypot(tx, ty) || 1;
    const j = (rand(seed, i) - 0.5) * 2 * jitter;
    let p: number;
    if (closed) {
      const ang = Math.atan2(y - cy, x - cx);
      p = 0.5 + 0.5 * Math.cos(ang - thickAt - phase);
      // A little seeded irregularity, so two identical shapes never ink alike.
      p = Math.max(0, Math.min(1, p + (rand(seed, i + 5000) - 0.5) * 0.12));
    } else {
      const u = i / (n - 1);
      const ends = Math.min(1, Math.sin(Math.PI * u) * (cum[n - 1] > period ? 2.2 : 1));
      const swell = cum[n - 1] > period ? 0.3 + 0.7 * (0.5 + 0.5 * Math.sin((cum[i] / period) * Math.PI * 2 + swellPhase)) : 1;
      p = ends * swell * (0.85 + rand(seed, 11) * 0.15);
    }
    const pressure = pMin + (1 - pMin) * p;
    return [x + (-ty / tl) * j, y + (tx / tl) * j, pressure];
  });

  if (closed) {
    // Overlap the seam by a few points so the pen lifts past where it started.
    const extra = Math.min(4, n - 1);
    for (let i = 1; i <= extra; i++) pts.push(pts[i]);
  }

  const outline = getStroke(pts, {
    size,
    thinning,
    smoothing: 0.5,
    streamline: 0,
    simulatePressure: false,
    start: closed ? { cap: true, taper: 0 } : { cap: true, taper: true },
    end: closed ? { cap: true, taper: 0 } : { cap: true, taper: true },
    last: true,
  });
  return svgFromStroke(outline);
}

// ---------------------------------------------------------------------------
// Path sampler
// ---------------------------------------------------------------------------

export type Polyline = { pts: Pt[]; closed: boolean };

function arcToCenter(
  x1: number, y1: number, rx: number, ry: number, phiDeg: number,
  fa: number, fs: number, x2: number, y2: number,
): { cx: number; cy: number; rx: number; ry: number; phi: number; t1: number; dt: number } {
  const phi = (phiDeg * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) {
    rx *= Math.sqrt(lam);
    ry *= Math.sqrt(lam);
  }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  let co = Math.sqrt(Math.max(0, num / (den || 1)));
  if (fa === fs) co = -co;
  const cxp = (co * rx * y1p) / ry;
  const cyp = (-co * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux: number, uy: number, vx: number, vy: number) =>
    Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!fs && dt > 0) dt -= 2 * Math.PI;
  if (fs && dt < 0) dt += 2 * Math.PI;
  return { cx, cy, rx, ry, phi, t1, dt };
}

/** Sample an SVG path `d` into polylines, one per subpath, ~`step` px apart. */
export function samplePath(d: string, step = 6): Polyline[] {
  const tokens = d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/g) ?? [];
  const out: Polyline[] = [];
  let cur: Pt[] = [];
  let x = 0, y = 0, sx = 0, sy = 0;
  let lastC: Pt | null = null; // reflected control (S)
  let lastQ: Pt | null = null; // reflected control (T)
  let cmd = "";
  let i = 0;
  const num = () => parseFloat(tokens[i++]);
  const flush = (closed: boolean) => {
    if (cur.length > 1) out.push({ pts: cur, closed });
    cur = [];
  };
  const seg = (fn: (t: number) => Pt, approx: number) => {
    const k = Math.max(2, Math.ceil(approx / step));
    for (let s = 1; s <= k; s++) cur.push(fn(s / k));
  };
  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) cmd = tokens[i++];
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const ox = rel ? x : 0;
    const oy = rel ? y : 0;
    if (C === "Z") {
      x = sx; y = sy;
      flush(true);
      lastC = lastQ = null;
      continue;
    }
    if (C === "M") {
      flush(false);
      x = num() + ox; y = num() + oy;
      sx = x; sy = y;
      cur.push([x, y]);
      cmd = rel ? "l" : "L";
      lastC = lastQ = null;
      continue;
    }
    if (cur.length === 0) cur.push([x, y]);
    const x0 = x, y0 = y;
    if (C === "L" || C === "H" || C === "V") {
      if (C === "L") { x = num() + ox; y = num() + oy; }
      else if (C === "H") x = num() + ox;
      else y = num() + oy;
      const ex = x, ey = y;
      seg((t) => [x0 + (ex - x0) * t, y0 + (ey - y0) * t], Math.hypot(ex - x0, ey - y0));
      lastC = lastQ = null;
    } else if (C === "C" || C === "S") {
      let c1: Pt;
      if (C === "C") c1 = [num() + ox, num() + oy];
      else c1 = lastC ? [2 * x0 - lastC[0], 2 * y0 - lastC[1]] : [x0, y0];
      const c2: Pt = [num() + ox, num() + oy];
      x = num() + ox; y = num() + oy;
      const ex = x, ey = y;
      const L = Math.hypot(c1[0] - x0, c1[1] - y0) + Math.hypot(c2[0] - c1[0], c2[1] - c1[1]) + Math.hypot(ex - c2[0], ey - c2[1]);
      seg((t) => {
        const u = 1 - t;
        return [
          u * u * u * x0 + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * ex,
          u * u * u * y0 + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * ey,
        ];
      }, L);
      lastC = c2;
      lastQ = null;
    } else if (C === "Q" || C === "T") {
      let q: Pt;
      if (C === "Q") q = [num() + ox, num() + oy];
      else q = lastQ ? [2 * x0 - lastQ[0], 2 * y0 - lastQ[1]] : [x0, y0];
      x = num() + ox; y = num() + oy;
      const ex = x, ey = y;
      const L = Math.hypot(q[0] - x0, q[1] - y0) + Math.hypot(ex - q[0], ey - q[1]);
      seg((t) => {
        const u = 1 - t;
        return [u * u * x0 + 2 * u * t * q[0] + t * t * ex, u * u * y0 + 2 * u * t * q[1] + t * t * ey];
      }, L);
      lastQ = q;
      lastC = null;
    } else if (C === "A") {
      const rx = num(), ry = num(), phi = num(), fa = num(), fs = num();
      x = num() + ox; y = num() + oy;
      const a = arcToCenter(x0, y0, rx, ry, phi, fa, fs, x, y);
      const cos = Math.cos(a.phi), sin = Math.sin(a.phi);
      seg((t) => {
        const th = a.t1 + a.dt * t;
        const px = a.rx * Math.cos(th), py = a.ry * Math.sin(th);
        return [a.cx + cos * px - sin * py, a.cy + sin * px + cos * py];
      }, Math.abs(a.dt) * Math.max(a.rx, a.ry));
      lastC = lastQ = null;
    } else {
      i++; // unknown token: skip
    }
  }
  flush(false);
  // A closed contour's last sample duplicates its first; drop it.
  for (const p of out) {
    if (p.closed && p.pts.length > 2) {
      const a = p.pts[0], b = p.pts[p.pts.length - 1];
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.5) p.pts.pop();
    }
  }
  return out;
}

/** Ribbon of every subpath of an existing SVG path string. */
export function outlinePath(d: string, w0: number, w1: number, seed = 0, opts: RibbonOpts & { step?: number } = {}): string {
  return samplePath(d, opts.step ?? 6)
    .map((p, k) => ribbon(p.pts, w0, w1, seed + k * 31, { ...opts, closed: opts.closed ?? p.closed }))
    .join(" ");
}

/** Circle as a closed polyline (starts at angle `start`). */
export function circlePts(cx: number, cy: number, r: number, n = 48, start = 0): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const a = start + (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as Pt;
  });
}

/** Rounded rectangle as an SVG path string (feed it to `outlinePath`). */
export function roundRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, w / 2, h / 2);
  return (
    `M ${x + rr} ${y} L ${x + w - rr} ${y} A ${rr} ${rr} 0 0 1 ${x + w} ${y + rr}` +
    ` L ${x + w} ${y + h - rr} A ${rr} ${rr} 0 0 1 ${x + w - rr} ${y + h}` +
    ` L ${x + rr} ${y + h} A ${rr} ${rr} 0 0 1 ${x} ${y + h - rr}` +
    ` L ${x} ${y + rr} A ${rr} ${rr} 0 0 1 ${x + rr} ${y} Z`
  );
}
