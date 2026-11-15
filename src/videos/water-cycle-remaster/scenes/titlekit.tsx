import React from "react";
import { kidTheme, kidType, mixHex, samplePath } from "../../../lib/kid";
import { kidPaintTheme, ribbon, roundRectPath, spring, useCurrentFrame, useVideoConfig, type Pt } from "./common";
import { Svg } from "./act1kit";
import { PaintedShape } from "./act3kit";

// The ep-1 remaster title card, made of WATER (title brief, scratchpad/remaster/title/brief.md).
//
// Every glyph is a hand-built SKELETON (1-3 centre-line strokes on a common
// cap box) drawn as a fat round tube, several times over: soft shadow, a
// thick-thin ink edge (the ink is wider and offset down-right), the pooled
// deep value, a warm sunrise bounce along the underside, the main body (a
// vertical gradient, nudged up-left so the deep value shows as a low rim), and
// a broken cream specular streak. No filters anywhere: per frame this is only
// arithmetic and path strings.
//
// Life: each skeleton point wobbles on a spatially smooth sine field; letters
// squash when they finish flowing on and when a drop from the line above
// lands on them. Drips grow from real low points of the letterforms (swell,
// stretch, neck, snap, recoil), fall under gravity as teardrops, and LAND:
// line-1 drops splat on the line-2 letter beneath, line-2 drops fall into the
// sea with a crown and ripple rings. Nothing fades out in mid-air.

const P = kidPaintTheme;
const FPS = 30;

// ---------------------------------------------------------------------------
// Geometry constants (px, composition space)
// ---------------------------------------------------------------------------

/** Tube width (≈23% of the 200 px cap height). */
const SW = 46;
const HW = SW / 2;
/** Centre-line cap height: outer cap = C + SW = 200. */
const C = 154;

const L_INK = { w: SW + 13, off: [4, 5] as Pt };
const L_SHADOW = { w: SW + 18, off: [10, 15] as Pt };
const L_BOUNCE = { w: SW - 16, off: [1.5, 4] as Pt };
const L_MAIN = { w: SW - 12, off: [-2.5, -2.5] as Pt };
const L_GLOW = { w: 20, off: [2.5, 7] as Pt };
const L_HI = { w: 7, off: [-8.5, -10] as Pt };

const COL = {
  ink: P.ink,
  deep: "#0d4f7c",
  bounce: "#f2bd78",
  top: "#55c4ee",
  mid: "#2896d6",
  bot: "#1663a8",
  hi: P.paper,
  glow: "#a6ecf6",
  trough: "#3d7f95",
  glass: "#c9dcea",
  spray: mixHex(P.paper, "#bfe3ee", 0.35),
};

// ---------------------------------------------------------------------------
// Glyphs: centre-line skeletons, y down, 0 = cap top, C = baseline.
// `lows` are real low points of the letterform (drip sites), centre-line coords.
// ---------------------------------------------------------------------------

type GStroke = { d: string; w?: number };
type Glyph = { s: GStroke[]; lows: Pt[] };

const GLYPHS: Record<string, Glyph> = {
  D: { s: [{ d: `M 0 0 L 0 ${C} L 38 ${C} C 118 ${C} 118 0 38 0 Z` }], lows: [[54, C]] },
  R: {
    s: [{ d: `M 0 0 L 0 ${C}` }, { d: "M 0 0 L 42 0 C 104 0 104 82 42 82 L 0 82" }, { d: `M 42 82 L 100 ${C}` }],
    lows: [[0, C], [100, C]],
  },
  I: { s: [{ d: `M 0 0 L 0 ${C}` }], lows: [[0, C]] },
  P: { s: [{ d: `M 0 0 L 0 ${C}` }, { d: "M 0 0 L 42 0 C 106 0 106 88 42 88 L 0 88" }], lows: [[0, C], [52, 88]] },
  "'": {
    s: [{ d: "M 3 0 L -2 26", w: 0.92 }],
    lows: [[-2, 26]],
  },
  S: {
    s: [{ d: `M 94 26 C 86 8 68 0 48 0 C 20 0 4 16 4 38 C 4 62 26 70 50 77 C 74 84 96 94 96 116 C 96 140 76 ${C} 48 ${C} C 24 ${C} 8 146 -2 126` }],
    lows: [[48, C], [4, 132]],
  },
  B: {
    s: [{ d: `M 0 0 L 0 ${C}` }, { d: "M 0 0 L 40 0 C 94 0 94 72 40 72 L 0 72" }, { d: `M 40 72 C 106 72 106 ${C} 40 ${C} L 0 ${C}` }],
    lows: [[0, C], [56, C]],
  },
  G: {
    s: [{ d: `M 100 28 C 90 8 70 0 52 0 C 18 0 0 34 0 77 C 0 124 22 ${C} 54 ${C} C 84 ${C} 102 136 102 108 L 102 96 L 62 96` }],
    lows: [[50, C]],
  },
  A: { s: [{ d: `M 0 ${C} L 42 0 L 72 0 L 114 ${C}` }, { d: "M 24 110 L 90 110" }], lows: [[0, C], [114, C]] },
  V: { s: [{ d: `M 0 0 L 54 ${C} L 108 0` }], lows: [[54, C]] },
  E: { s: [{ d: `M 88 0 L 0 0 L 0 ${C} L 90 ${C}` }, { d: "M 0 77 L 72 77" }], lows: [[0, C], [86, C]] },
  N: { s: [{ d: `M 0 ${C} L 0 0 L 100 ${C} L 100 0` }], lows: [[0, C], [100, C]] },
  T: { s: [{ d: "M 0 0 L 108 0" }, { d: `M 54 0 L 54 ${C}` }], lows: [[54, C]] },
  U: { s: [{ d: "M 0 0 L 0 98 C 0 172 104 172 104 98 L 104 0" }], lows: [[52, C]] },
};

// ---------------------------------------------------------------------------
// Layout (module scope, static)
// ---------------------------------------------------------------------------

export const TITLE_LINES = ["DRIP'S BIG", "ADVENTURE"];

/** Outer cap tops of the two lines. */
const LINE_TOP = [104, 390];
const GAP = 26;
const SPACE = 70;
/** Fill-on: the empty glass letter appears at `start`, water rises through it over FLOW_DUR; last done ≈ scene f57. */
const FLOW_AT = 11;
const STAGGER = 2.1;
const FLOW_DUR = 10;

type Sub = { pts: Pt[]; w: number; len: number };
type Letter = {
  ch: string;
  line: number;
  order: number;
  subs: Sub[];
  total: number;
  /** Squash pivot: horizontal centre, baseline. */
  cx: number;
  base: number;
  lows: Pt[];
  start: number;
  done: number;
  seed: number;
  dash: string;
  /** Static bounds of the centre lines. */
  box: { x0: number; x1: number; y0: number; y1: number };
};

const srand = (i: number, salt = 0) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function buildLine(text: string, line: number, orderFrom: number): Letter[] {
  type Raw = { ch: string; subs: Sub[]; minX: number; maxX: number; lows: Pt[] };
  const raws: Array<Raw | null> = text.split("").map((ch) => {
    if (ch === " ") return null;
    const g = GLYPHS[ch];
    const subs: Sub[] = g.s.map(({ d, w = 1 }) => {
      const poly = samplePath(d, 7)[0];
      const pts = poly.closed ? [...poly.pts, poly.pts[0], poly.pts[1]] : poly.pts;
      let len = 0;
      for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      return { pts, w, len };
    });
    const xs = subs.flatMap((s) => s.pts.map((p) => p[0]));
    return { ch, subs, minX: Math.min(...xs), maxX: Math.max(...xs), lows: g.lows };
  });
  // Advance: outer widths + gaps; tighter around the apostrophe.
  const gapAfter = (i: number) => {
    const a = text[i];
    const b = text[i + 1];
    if (a === "'" || b === "'") return 10;
    return GAP;
  };
  let x = 0;
  const xs: number[] = [];
  raws.forEach((r, i) => {
    if (!r) {
      xs.push(x);
      x += SPACE - GAP;
      return;
    }
    xs.push(x + HW - r.minX);
    x += r.maxX - r.minX + SW + (i < raws.length - 1 ? gapAfter(i) : 0);
  });
  const left = 960 - x / 2;
  const out: Letter[] = [];
  let order = orderFrom;
  raws.forEach((r, i) => {
    if (!r) return;
    const k = order * 7 + 3;
    const ox = left + xs[i];
    const oy = LINE_TOP[line] + HW + (srand(k, 1) - 0.5) * 12;
    const tilt = ((srand(k, 2) - 0.5) * 5 * Math.PI) / 180;
    const gcx = (r.minX + r.maxX) / 2;
    const gcy = C / 2;
    const place = ([px, py]: Pt): Pt => {
      const dx = px - gcx;
      const dy = py - gcy;
      return [ox + gcx + dx * Math.cos(tilt) - dy * Math.sin(tilt), oy + gcy + dx * Math.sin(tilt) + dy * Math.cos(tilt)];
    };
    const subs = r.subs.map((s) => ({ ...s, pts: s.pts.map(place) }));
    const all = subs.flatMap((s) => s.pts);
    const box = {
      x0: Math.min(...all.map((p) => p[0])),
      x1: Math.max(...all.map((p) => p[0])),
      y0: Math.min(...all.map((p) => p[1])),
      y1: Math.max(...all.map((p) => p[1])),
    };
    const start = FLOW_AT + order * STAGGER;
    const dl = (j: number) => 14 + Math.round(srand(k, 10 + j) * 40);
    out.push({
      ch: r.ch,
      line,
      order,
      subs,
      total: subs.reduce((a, s) => a + s.len, 0),
      cx: ox + gcx,
      base: oy + C,
      lows: r.lows.map(place),
      start,
      done: start + FLOW_DUR,
      seed: k,
      // Specular: a streak, a gap, a dot, a longer gap, a second streak (never a second outline).
      dash: `${dl(0) + 22} 12 0.1 2000`,
      box,
    });
    order++;
  });
  return out;
}

const LINE1 = buildLine(TITLE_LINES[0], 0, 0);
const LETTERS: Letter[] = [...LINE1, ...buildLine(TITLE_LINES[1], 1, LINE1.length)];
const LAST_DONE = Math.max(...LETTERS.map((l) => l.done));

/** Top surface (outer tube edge) of a line-2 letter under x, or null. Static geometry. */
function surfaceUnder(x: number): { y: number; letter: number } | null {
  let best: { y: number; letter: number } | null = null;
  LETTERS.forEach((L, li) => {
    if (L.line !== 1) return;
    for (const s of L.subs) {
      const r = (SW * s.w) / 2;
      for (const [px, py] of s.pts) {
        const dx = Math.abs(px - x);
        if (dx >= r * 0.8) continue;
        const y = py - Math.sqrt(r * r - dx * dx);
        if (!best || y < best.y) best = { y, letter: li };
      }
    }
  });
  return best;
}

// ---------------------------------------------------------------------------
// Drip sites (seeded, varied; periods 2-4.5 s; first starts staggered)
// ---------------------------------------------------------------------------

type SiteDef = { ch: string; line: number; nth?: number; low: number; R: number; period: number; first: number; sea?: number; hold?: boolean };

/**
 * `first` is the scene frame the first swell begins. `sea` = landing y in the
 * water (perspective: far drops land high and small). Line-1 sites land on the
 * line-2 letter beneath (surfaceUnder) or fall through a gap to `sea`.
 */
const SITE_DEFS: SiteDef[] = [
  { ch: "D", line: 0, low: 0, R: 15, period: 104, first: 44 },
  { ch: "'", line: 0, low: 0, R: 9, period: 76, first: 58 },
  { ch: "S", line: 0, low: 1, R: 14, period: 128, first: 92 },
  { ch: "G", line: 0, low: 0, R: 14, period: 92, first: 70 },
  { ch: "A", line: 1, low: 0, R: 24, period: 118, first: 66, sea: 812 },
  // V and U sit over the episode tag: their beads gather and draw back, never let go.
  { ch: "V", line: 1, low: 0, R: 14, period: 86, first: 78, hold: true },
  { ch: "U", line: 1, low: 0, R: 13, period: 112, first: 104, hold: true },
  { ch: "R", line: 1, low: 1, R: 19, period: 96, first: 122, sea: 700 },
  { ch: "E", line: 1, nth: 1, low: 1, R: 22, period: 100, first: 90, sea: 724 },
];

const G_ACC = 1.15; // px / frame²
const V0 = 0.8;

type Event = {
  site: number;
  letter: number;
  start: number;
  swell: number;
  release: number;
  y0: number;
  x: number;
  land: number;
  impact: number;
  target: number | null; // letter index for a splat, null = sea
  hold: boolean;
};

const swellOf = (R: number) => 20 + R;
const stretchOf = (R: number) => 9 + Math.round(R * 0.45);
/** Bead depth below the tube bottom at release. */
const reachOf = (R: number) => R * 0.3 + R * 1.9;

const SITES = SITE_DEFS.map((d) => {
  const matches = LETTERS.map((L, i) => ({ L, i })).filter(({ L }) => L.ch === d.ch && L.line === d.line);
  const { L, i } = matches[d.nth ?? 0];
  return { ...d, letter: i, anchor: L.lows[d.low] };
});

export const EVENTS: Event[] = [];
SITES.forEach((s, si) => {
  for (let k = 0; k < 4; k++) {
    const start = s.first + k * s.period + Math.round((srand(si * 13 + k, 5) - 0.5) * 12);
    if (start > 260) break;
    const swell = swellOf(s.R);
    const release = start + swell + stretchOf(s.R);
    const y0 = s.anchor[1] + HW + reachOf(s.R);
    let land = s.sea ?? 700;
    let target: number | null = null;
    if (s.line === 0) {
      const surf = surfaceUnder(s.anchor[0]);
      if (surf) {
        land = surf.y - s.R * 0.8;
        target = surf.letter;
      }
    }
    // A line-1 drop with no letter beneath would fall onto the episode tag: it only hangs.
    const hold = !!s.hold || (s.line === 0 && target === null);
    if (hold) {
      EVENTS.push({ site: si, letter: s.letter, start, swell, release, y0, x: s.anchor[0], land, impact: 1e9, target, hold: true });
      continue;
    }
    const dist = Math.max(1, land - y0);
    const tau = (-V0 + Math.sqrt(V0 * V0 + 2 * G_ACC * dist)) / G_ACC;
    EVENTS.push({ site: si, letter: s.letter, start, swell, release, y0, x: s.anchor[0], land, impact: s.hold ? 1e9 : release + tau, target, hold: !!s.hold });
  }
});

// ---------------------------------------------------------------------------
// Per-frame helpers
// ---------------------------------------------------------------------------

const f1 = (v: number) => v.toFixed(1);
const lineD = (pts: Pt[]) => (pts.length ? `M${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}` : "");
const polyD = (pts: Pt[]) => `${lineD(pts)}Z`;

/** Damped bounce impulse. */
const bounce = (f: number, at: number, amp: number, decay = 6, w = 0.6) =>
  f < at ? 0 : amp * Math.exp(-(f - at) / decay) * Math.sin((f - at) * w);

/** Squash of a letter at frame f: flow-on overshoot + drops landing on it + own snaps. */
function squashOf(li: number, f: number): number {
  const L = LETTERS[li];
  let s = bounce(f, L.done - 1, 0.075, 6.5, 0.62);
  for (const e of EVENTS) {
    if (e.target === li) s += bounce(f, e.impact, 0.045, 5, 0.7);
    if (e.letter === li && !e.hold) s += bounce(f, e.release, -0.018, 5, 0.8);
  }
  return s;
}

/** A letter's point transform at frame f: liquid wobble + squash about (cx, base). */
function xformOf(li: number, f: number) {
  const L = LETTERS[li];
  const t = f / FPS;
  const s = squashOf(li, f);
  const ph = L.seed * 0.37;
  return ([x, y]: Pt): Pt => {
    const wx = 1.9 * Math.sin(t * 2.3 + x * 0.019 + y * 0.011 + ph);
    const wy = 1.7 * Math.sin(t * 1.9 + x * 0.014 - y * 0.018 + ph * 1.7);
    return [L.cx + (x - L.cx) * (1 + s * 0.8) + wx, L.base + (y - L.base) * (1 - s) + wy];
  };
}

/**
 * A hanging drip: neck from inside the tube down to a bead of radius r at
 * (x, by); `nw` = neck half-width at its thinnest. `inset` shrinks it (for the
 * narrower main-body layer). Closed path string.
 */
function hangD(x: number, ay: number, r: number, by: number, nw: number, inset: number): string {
  const top = ay - HW * 0.2;
  const tw = Math.max(r * 1.15, nw) + 7;
  const y0 = ay + HW * 0.55;
  const yN = Math.max(y0 + 1, by - r * 0.55);
  const N = 14;
  const right: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const y = top + ((by - top) * i) / N;
    let w: number;
    if (y <= y0) w = tw;
    else if (y <= yN) {
      const s = (y - y0) / (yN - y0);
      w = nw + (tw - nw) * (1 - s) * (1 - s);
    } else w = nw;
    const dy = y - by;
    if (Math.abs(dy) < r) w = Math.max(w, Math.sqrt(r * r - dy * dy));
    right.push([x + Math.max(0.5, w - inset), y]);
  }
  const rr = Math.max(0.5, r - inset);
  const left = right.map(([px, py]) => [2 * x - px, py] as Pt).reverse();
  return `${lineD(right)}A${f1(rr)} ${f1(rr)} 0 0 1 ${f1(x - rr)} ${f1(by)}L${left.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}Z`;
}

/** Falling teardrop, tip up, stretched along the fall. */
function dropD(x: number, y: number, rx: number, ry: number, inset: number): string {
  const n = 22;
  const pts: Pt[] = [];
  const a = Math.max(0.5, rx - inset);
  const b = Math.max(0.5, ry - inset);
  for (let i = 0; i < n; i++) {
    const th = (i / n) * Math.PI * 2; // 0 = tip (top)
    const pinch = Math.pow((1 - Math.cos(th)) / 2, 0.55);
    pts.push([x + a * Math.sin(th) * pinch, y - b * Math.cos(th) * (th < Math.PI / 2 || th > (Math.PI * 3) / 2 ? 1.25 : 1)]);
  }
  return polyD(pts);
}

/** Hanging-drip state of one event at frame f (null when nothing hangs). */
function hangingOf(e: Event, f: number, xf: (p: Pt) => Pt): { d: (inset: number) => string; hi: Pt; hr: number; r: number } | null {
  const s = SITES[e.site];
  const R = s.R;
  const tau = f - e.start;
  const stretch = e.release - e.start - e.swell;
  const [ax, ay] = xf(s.anchor);
  const bottom = ay + HW;
  const rest = R * 0.38;
  let r: number;
  let by: number;
  let nw: number;
  if (tau < 0) return null;
  if (tau < e.swell) {
    const u = tau / e.swell;
    const eu = 1 - (1 - u) * (1 - u);
    r = rest + (R - rest) * eu;
    by = bottom - r * 0.45 + (r * 0.75) * eu;
    nw = r * 0.95;
  } else if (e.hold) {
    // Gathers, sags halfway, then draws back up into the letter (surface tension wins).
    const k = tau - e.swell;
    const sag = k < stretch ? Math.sin(((k / stretch) * Math.PI) / 2) : Math.max(0, 1 - (k - stretch) / 20);
    if (k > stretch + 20) return null;
    const back = k < stretch ? 1 : sag;
    r = rest + (R - rest) * back;
    by = bottom - r * 0.45 + r * 0.75 * back + sag * R * 0.9;
    nw = r * (0.95 - 0.4 * sag);
  } else if (f < e.release) {
    const v = (tau - e.swell) / stretch;
    const ev = v * v;
    r = R * (1 - 0.1 * ev);
    by = bottom + R * 0.3 + ev * R * 1.9;
    nw = R * (0.95 - 0.8 * Math.pow(v, 1.3));
  } else {
    // Snapped: the stub recoils up with a small overshoot and settles to the resting bead.
    const k = f - e.release;
    if (k > 22) return null;
    const amp = R * 1.3 * Math.exp(-k / 3.5) * Math.cos(k * 0.55);
    r = rest + R * 0.25 * Math.exp(-k / 5);
    by = bottom - r * 0.45 + Math.max(-r * 0.6, amp);
    nw = r * 0.6;
  }
  return { d: (inset: number) => hangD(ax, ay, r, by, nw, inset), hi: [ax - r * 0.42, by - r * 0.38], hr: Math.max(1.6, r * 0.2), r };
}

// ---------------------------------------------------------------------------
// The title
// ---------------------------------------------------------------------------

export const WaterTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame;

  // Hanging drips per letter (the resting bead lives at every site once its letter is done).
  const hangs: Array<Array<{ d: (inset: number) => string; hi: Pt; hr: number; r: number }>> = LETTERS.map(() => []);
  const xfs = LETTERS.map((_, li) => xformOf(li, f));
  SITES.forEach((s, si) => {
    const L = LETTERS[s.letter];
    if (f < L.done) return;
    const xf = xfs[s.letter];
    const mine = EVENTS.filter((e) => e.site === si);
    let got = false;
    for (const e of mine) {
      if (f < e.start || f > e.release + 22) continue;
      const h = hangingOf(e, f, xf);
      if (h) {
        hangs[s.letter].push(h);
        got = true;
        break;
      }
    }
    if (!got) {
      // Resting bead: water pooled at the low point.
      const [ax, ay] = xf(s.anchor);
      const r = s.R * 0.38;
      const by = ay + HW - r * 0.45;
      hangs[s.letter].push({ d: (inset: number) => hangD(ax, ay, r, by, r * 0.95, inset), hi: [0, 0], hr: 0, r });
    }
  });

  return (
    <Svg>
      <defs>
        {[0, 1].map((line) => (
          <linearGradient key={line} id={`wt-body${line}`} gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={LINE_TOP[line]} y2={LINE_TOP[line] + SW + C}>
            <stop offset="0" stopColor={COL.top} />
            <stop offset="0.45" stopColor={COL.mid} />
            <stop offset="1" stopColor={COL.bot} />
          </linearGradient>
        ))}
      </defs>
      {LETTERS.map((L, li) => {
        const u = (f - L.start) / FLOW_DUR;
        if (u <= -0.25) return null;
        const shell = Math.min(1, (u + 0.25) / 0.3);
        const filling = u < 1;
        const xf = xfs[li];
        const tsubs = L.subs.map((s) => ({ pts: s.pts.map(xf), w: s.w }));
        const layer = (lw: number, off: Pt, color: string, extra: React.SVGProps<SVGPathElement> = {}) =>
          tsubs.map((s, k) => (
            <path key={k} d={lineD(s.pts)} fill="none" stroke={color} strokeWidth={Math.max(lw * s.w, lw - SW * (1 - s.w))} strokeLinecap="round" strokeLinejoin="round"
              transform={off[0] || off[1] ? `translate(${off[0]} ${off[1]})` : undefined} {...extra} />
          ));
        const hs = hangs[li];
        const tr = (off: Pt) => `translate(${off[0]} ${off[1]})`;
        const grad = `url(#wt-body${L.line})`;
        // The rising waterline (fill-on): wavy, sloshing top edge that settles as it reaches the top.
        let clip: string | null = null;
        if (filling) {
          const eu = u <= 0 ? 0 : 1 - Math.pow(1 - u, 1.6);
          const bot = L.box.y1 + HW + 10;
          const top = L.box.y0 - HW - 14;
          const level = bot - (bot - top) * eu;
          const xa = L.box.x0 - HW - 16;
          const xb = L.box.x1 + HW + 16;
          const pts: Pt[] = [];
          for (let i = 0; i <= 10; i++) {
            const x = xa + ((xb - xa) * i) / 10;
            pts.push([x, level + 5 * Math.sin(x * 0.05 + f * 0.9 + L.seed) * (1 - eu * 0.6) + (x - L.cx) * 0.1 * Math.sin(f * 0.5 + L.seed) * (1 - eu)]);
          }
          clip = `${lineD(pts)}L${f1(xb)} ${f1(bot + 60)}L${f1(xa)} ${f1(bot + 60)}Z`;
        }
        return (
          <g key={li}>
            {clip ? (
              <defs>
                <clipPath id={`wt-fill${li}`}>
                  <path d={clip} />
                </clipPath>
              </defs>
            ) : null}
            <g opacity={0.16 * shell}>{layer(L_SHADOW.w, L_SHADOW.off, COL.ink)}</g>
            <g opacity={shell}>
              {layer(L_INK.w, L_INK.off, COL.ink)}
              {/* The empty glass letter the water rises through. */}
              {filling ? layer(SW, [0, 0], COL.glass) : null}
            </g>
            <g clipPath={clip ? `url(#wt-fill${li})` : undefined}>
              {hs.map((h, k) => (
                <path key={`hi${k}`} d={h.d(0)} fill={COL.ink} stroke={COL.ink} strokeWidth={L_INK.w - SW} strokeLinejoin="round" transform={tr(L_INK.off)} />
              ))}
              {layer(SW, [0, 0], COL.deep)}
              {hs.map((h, k) => <path key={`hd${k}`} d={h.d(0)} fill={COL.deep} />)}
              {layer(L_BOUNCE.w, L_BOUNCE.off, COL.bounce)}
              {hs.map((h, k) => <path key={`hb${k}`} d={h.d(Math.min(6, 2 + h.r * 0.2))} fill={COL.bounce} transform={tr(L_BOUNCE.off)} />)}
              {layer(L_MAIN.w, L_MAIN.off, grad)}
              {hs.map((h, k) => <path key={`hm${k}`} d={h.d(Math.min(6, 2 + h.r * 0.2))} fill={grad} transform={tr(L_MAIN.off)} />)}
              <g opacity={0.2}>{layer(L_GLOW.w, L_GLOW.off, COL.glow)}</g>
              {u >= 0.7 && tsubs[0] ? (
                <path d={lineD(tsubs[0].pts)} fill="none" stroke={COL.hi} strokeWidth={L_HI.w * tsubs[0].w} strokeLinecap="round" strokeLinejoin="round"
                  transform={tr(L_HI.off)} strokeDasharray={L.dash} strokeDashoffset={-10} opacity={Math.min(1, (u - 0.7) * 3)} />
              ) : null}
              {hs.map((h, k) => {
                if (h.hr <= 0 || h.r < 6) return null;
                return <circle key={`hh${k}`} cx={h.hi[0]} cy={h.hi[1]} r={h.hr} fill={COL.hi} />;
              })}
            </g>
          </g>
        );
      })}
      <Falls f={f} />
    </Svg>
  );
};

const Droplet: React.FC<{ x: number; y: number; r: number; v: number }> = ({ x, y, r, v }) => {
  const st = Math.min(0.5, Math.abs(v) * 0.05);
  const up = v < 0;
  const d = dropD(x, y, r * (1 - st * 0.3), r * (1 + st), 0);
  return (
    <g transform={up ? `rotate(180 ${f1(x)} ${f1(y)})` : undefined}>
      <path d={d} fill={COL.ink} stroke={COL.ink} strokeWidth={4} strokeLinejoin="round" transform="translate(1.5 2)" />
      <path d={d} fill={COL.mid} />
      <circle cx={x - r * 0.35} cy={y - r * 0.2} r={Math.max(1.2, r * 0.28)} fill={COL.hi} />
    </g>
  );
};

/** Falling drops, splats on letters, and sea landings (crown + ripple rings). */
const Falls: React.FC<{ f: number }> = ({ f }) => (
  <>
    {EVENTS.map((e, i) => {
      const s = SITES[e.site];
      const R = s.R;
      if (e.hold || f < e.release || f > e.impact + 40) return null;
      if (f < e.impact) {
        const tau = f - e.release;
        const y = e.y0 + V0 * tau + 0.5 * G_ACC * tau * tau;
        const v = V0 + G_ACC * tau;
        const st = Math.min(0.32, v * 0.035);
        // A touch larger than the bead it left (the neck's water joins it), so it reads on a phone.
        const grow = Math.min(1, tau / 4);
        const DS = 0.9 + (e.target === null ? 0.45 : 0.2) * grow;
        // Never touch the episode tag: cap the width beside it (clearance 18 px past its ink).
        const clear = Math.abs(e.x - TAG.x) - TAG.w / 2 - 18;
        const rx = Math.min(R * DS * (1 - st * 0.35), Math.max(R * 0.7, clear));
        const ry = R * DS * (1 + st);
        const d0 = dropD(e.x, y, rx, ry, 0);
        return (
          <g key={i}>
            <path d={d0} fill={COL.ink} stroke={COL.ink} strokeWidth={7} strokeLinejoin="round" transform="translate(3 3.5)" />
            <path d={d0} fill={COL.deep} />
            <path d={dropD(e.x, y, rx, ry, 3.5)} fill={COL.mid} transform="translate(-1 -1.5)" />
            <circle cx={e.x - rx * 0.4} cy={y - ry * 0.25} r={Math.max(1.8, R * 0.17)} fill={COL.hi} />
          </g>
        );
      }
      const k = f - e.impact;
      return e.target !== null ? <Splat key={i} x={e.x} y={e.land + R * 0.8} R={R} k={k} seed={i} /> : <SeaLanding key={i} x={e.x} y={e.land} R={R} k={k} seed={i} />;
    })}
  </>
);

/** A drop landing on a letter top: it flattens into the tube in 3 frames (the letter's squash carries the hit). */
const Splat: React.FC<{ x: number; y: number; R: number; k: number; seed: number }> = ({ x, y, R, k }) => {
  const m = k / 3;
  if (m >= 1) return null;
  return <ellipse cx={x} cy={y + 2 + R * 0.4 * m} rx={R * (1 + 0.8 * m)} ry={R * 0.7 * (1 - m) + 1} fill={COL.mid} />;
};

/** A drop landing in the sea: a crown of 3 flecks (they fall back in) and 2-3 tapered ripple rings. */
const SeaLanding: React.FC<{ x: number; y: number; R: number; k: number; seed: number }> = ({ x, y, R, k, seed }) => {
  // Perspective (far lands high and small) times a phone-legibility boost.
  const persp = (0.55 + 0.45 * Math.min(1, Math.max(0, (y - 640) / 220))) * 1.35;
  const rings = R > 12 ? 3 : 2;
  return (
    <g>
      {Array.from({ length: rings }, (_, j) => {
        const u = (k - j * 6) / 30;
        if (u < 0 || u > 1) return null;
        const rx = (R * 1.0 + u * R * 4.6) * persp * (1 - j * 0.14);
        const ry = rx * 0.24 * persp;
        const pts: Pt[] = Array.from({ length: 30 }, (_, q) => {
          const a = (q / 30) * Math.PI * 2;
          return [x + Math.cos(a) * rx, y + Math.sin(a) * ry];
        });
        const rd = ribbon(pts, Math.max(2.2, (6.5 - j) * persp * (1 - u * 0.5)), 1.2, 400 + seed * 3 + j, { closed: true, thickAt: Math.PI / 2, jitter: 0.25 });
        const op = (1 - u) ** 1.1;
        return (
          <g key={j}>
            <path d={rd} fill={COL.trough} opacity={0.7 * op} transform="translate(0 2.5)" />
            <path d={rd} fill={COL.spray} opacity={0.95 * op} />
          </g>
        );
      })}
      {/* The rebound column: a short neck of water that rises and drops back. */}
      {k < 12 ? (
        <Droplet x={x} y={y - Math.sin((k / 12) * Math.PI) * R * 1.7 * persp} r={Math.max(3, R * 0.42 * persp)} v={k < 6 ? -1 : 1} />
      ) : null}
      {Array.from({ length: 3 }, (_, j) => {
        const a = -Math.PI / 2 + (j - 1) * 0.9 + (srand(seed * 5 + j, 40) - 0.5) * 0.3;
        const sp = (3 + srand(seed * 5 + j, 41) * 1.6) * persp;
        const vx = Math.cos(a) * sp * 1.3;
        const vy = Math.sin(a) * sp * 1.4;
        const fl = (-2 * vy) / G_ACC;
        if (k > fl) return null;
        const px = x + vx * k;
        const py = y - 2 + vy * k + 0.5 * G_ACC * k * k;
        const r = Math.max(2, R * 0.22 * persp);
        return <Droplet key={`c${j}`} x={px} y={py} r={r} v={vy + G_ACC * k} />;
      })}
    </g>
  );
};

/** Debug/export: the title's settled frame (all letters done). */
export const TITLE_DONE_AT = LAST_DONE;

// ---------------------------------------------------------------------------
// Episode tag: a painted paper tag, one PaintFill
// ---------------------------------------------------------------------------

const TAG = { x: 960, y: 736, w: 1110, h: 92 };
const TAG_V = { base: "#efe4cf", shadow: "#c8b8a2", light: P.paper, line: P.ink };

export const EpisodeTag: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = frame - from;
  const s = spring({ frame: k, fps, config: { damping: 11, mass: 0.6 } });
  if (k < 0) return null;
  const x0 = TAG.x - TAG.w / 2;
  const y0 = TAG.y - TAG.h / 2;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none",
      opacity: Math.min(1, k / 8),
      transformOrigin: `${TAG.x}px ${TAG.y}px`,
      transform: `translateY(${(1 - s) * 26}px) rotate(${-1.2 + (1 - s) * 3}deg) scale(${0.9 + 0.1 * s})` }}>
      <Svg>
        <PaintedShape id="s02-tag" ds={[roundRectPath(x0, y0, TAG.w, TAG.h, 30)]} bbox={{ x: x0, y: y0, w: TAG.w, h: TAG.h }}
          v={TAG_V} ink={4.5} seed={512} strength={0.9} />
      </Svg>
      <div style={{ position: "absolute", left: x0, top: y0, width: TAG.w, height: TAG.h, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: kidTheme.fontFamily, fontSize: kidType.min, fontWeight: 900, letterSpacing: 6, color: P.ink, whiteSpace: "nowrap" }}>
        LITTLE BIG WORLD · EPISODE ONE
      </div>
    </div>
  );
};
