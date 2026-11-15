import React from "react";
import { kidTheme, kidType, mixHex, softRadial, threeValues, type Value3 } from "../../../lib/kid";
import {
  FPS,
  HEIGHT,
  WIDTH,
  PaintFill,
  Plate,
  kidPaintTheme,
  outlinePath,
  ribbon,
  roundRectPath,
  useCurrentFrame,
  type PlateKey,
  type Pt,
} from "./common";
import { CrowdDefs, CrowdDrop, Svg, rnd } from "./act1kit";

// Painted props for act three (owned by the act-3 builder). Same recipe as
// act1kit: flat base + pooled band + dry band (PaintFill) under a tapered ink
// ribbon; cream (#f3ead8) is the lightest value anywhere; no gradients on a
// prop. Every PaintFill instance needs its own id — pass `id`.

const INK = kidPaintTheme.ink;
const PAPER = kidPaintTheme.paper;
const W = kidPaintTheme.water;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

// ---------------------------------------------------------------------------
// Palette (tamed: sat ≤ 0.5 bands; shadows lean violet)
// ---------------------------------------------------------------------------

export const PV = {
  lilac: threeValues("#b9aed6", "#6a5f9a", { tame: 0.1 }),
  desk: threeValues("#9d8fc4", "#4c4180", { tame: 0.08 }),
  cream: { base: "#e6dccb", shadow: "#a99cb8", light: PAPER, line: "#5a5170" } as Value3,
  red: threeValues("#d4524a", "#8a2a30", { tame: 0.08 }),
  brass: threeValues("#c9a45a", "#7a5a2a", { tame: 0.1 }),
  rock: threeValues("#8f8c92", "#4a4660", { tame: 0.05 }),
  moss: threeValues("#7fa24a", "#3e5a2a", { tame: 0.15 }),
  snow: { base: "#e4e8ee", shadow: "#9aa8c4", light: PAPER, line: "#4e5a78" } as Value3,
  earth: threeValues("#9a6a44", "#5a3624", { tame: 0.12 }),
  grass: threeValues("#6fae4a", "#2f6a34", { tame: 0.2 }),
  hide: threeValues("#8a6242", "#4a2e22", { tame: 0.08 }),
  muzzle: threeValues("#c09a74", "#7a5a44", { tame: 0.08 }),
  petal: { base: "#ece2cf", shadow: "#b4a6b8", light: PAPER, line: "#5a5168" } as Value3,
  yolk: threeValues("#e8b64a", "#a06a20", { tame: 0.12 }),
  water: W,
  flag: threeValues("#e06a52", "#9a3a34", { tame: 0.1 }),
  steel: threeValues("#8fa0b4", "#46506a", { tame: 0.1 }),
};

// ---------------------------------------------------------------------------
// The generic painted shape
// ---------------------------------------------------------------------------

/**
 * Painted union of one or more closed paths: their tapered ink outlines are
 * drawn first (thick), then the PaintFill on top, so interior seams vanish and
 * the outer half of each ribbon stays as the silhouette line.
 */
export const PaintedShape: React.FC<{
  id: string;
  ds: string[];
  bbox: { x: number; y: number; w: number; h: number };
  v: Value3;
  ink?: number;
  inkColor?: string;
  seed?: number;
  strength?: number;
  bleed?: boolean;
  thickAt?: number;
}> = ({ id, ds, bbox, v, ink = 7, inkColor, seed = 1, strength = 1, bleed = true, thickAt }) => (
  <g>
    {ink > 0
      ? ds.map((d, i) => (
          <path key={i} d={outlinePath(d, ink * 2, ink * 0.7, seed + i * 7, { thickAt: thickAt ?? Math.PI / 2, step: 7 })}
            fill={inkColor ?? v.line} />
        ))
      : null}
    <PaintFill id={id} shape={<>{ds.map((d, i) => <path key={i} d={d} />)}</>} bbox={bbox} v={v} seed={seed} strength={strength} bleed={bleed} />
  </g>
);

/**
 * A long painted band along `pts` with width `w(u)` (u 0..1 along it) and a
 * seeded hand wobble — for strokes too long for `ribbon` (perfect-freehand's
 * open-stroke taper runs the whole length and thins a long line to a hair).
 */
export function band(pts: Pt[], w: (u: number) => number, seed = 0, wobble = 0.08): string {
  const n = pts.length;
  if (n < 2) return "";
  const L: Pt[] = [];
  const R: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const tl = Math.hypot(tx, ty) || 1;
    const u = i / (n - 1);
    const hw = (w(u) / 2) * (1 + wobble * Math.sin(i * 0.9 + seed) + wobble * 0.5 * Math.sin(i * 2.3 + seed * 1.7));
    L.push([pts[i][0] - (ty / tl) * hw, pts[i][1] + (tx / tl) * hw]);
    R.push([pts[i][0] + (ty / tl) * hw, pts[i][1] - (tx / tl) * hw]);
  }
  const all = [...L, ...R.reverse()];
  return `M ${all.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")} Z`;
}

/** Circle path for outlinePath/PaintFill. */
export const circleD = (cx: number, cy: number, r: number, ry = r) =>
  `M ${cx - r} ${cy} A ${r} ${ry} 0 1 0 ${cx + r} ${cy} A ${r} ${ry} 0 1 0 ${cx - r} ${cy} Z`;

const ptsD = (pts: Pt[], close = true) => `M ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")}${close ? " Z" : ""}`;

/** A soft multiply shadow pool (cast shadows on water/ground — no hard edge). */
export const ShadowPool: React.FC<{ x: number; y: number; rx: number; ry: number; color: string; opacity?: number; rotate?: number }> = ({
  x,
  y,
  rx,
  ry,
  color,
  opacity = 0.45,
  rotate = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - rx,
      top: y - ry,
      width: rx * 2,
      height: ry * 2,
      background: softRadial(color),
      mixBlendMode: "multiply",
      opacity,
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// s22 — the lobby: sign, desk, lever, lamp, the cloud floor with its hole
// ---------------------------------------------------------------------------

export const HotelSign: React.FC<{ x: number; y: number; w?: number; dim?: number }> = ({ x, y, w = 600, dim = 0 }) => {
  const h = 116;
  const d = roundRectPath(x - w / 2, y - h / 2, w, h, 40);
  const cords: Pt[][] = [
    [[x - w * 0.32, y - h / 2], [x - w * 0.34, y - h / 2 - 90], [x - w * 0.36, y - h / 2 - 220]],
    [[x + w * 0.32, y - h / 2], [x + w * 0.34, y - h / 2 - 90], [x + w * 0.36, y - h / 2 - 220]],
  ];
  return (
    <g>
      {cords.map((c, i) => <path key={i} d={ribbon(c, 6, 3, 90 + i, { jitter: 0.4 })} fill={INK} opacity={0.85} />)}
      <PaintedShape id="a3-sign" ds={[d]} bbox={{ x: x - w / 2, y: y - h / 2, w, h }} v={PV.cream} ink={6} seed={31} />
      <path d={outlinePath(roundRectPath(x - w / 2 + 16, y - h / 2 + 14, w - 32, h - 28, 28), 3, 1.4, 33)} fill={PV.desk.line} opacity={0.7} />
      <text x={x} y={y + 19} textAnchor="middle" fontFamily={kidTheme.fontFamily} fontWeight={900} fontSize={58} letterSpacing={6}
        fill={mixHex("#4c4180", INK, dim)}>CLOUD HOTEL</text>
    </g>
  );
};

/** A cloud-topped reception desk: scalloped top, lilac front. */
export const ReceptionDesk: React.FC<{ x0: number; x1: number; top: number; bottom: number }> = ({ x0, x1, top, bottom }) => {
  const w = x1 - x0;
  const front = roundRectPath(x0, top + 30, w, bottom - top - 30, 26);
  const puffs: string[] = [];
  const n = Math.max(4, Math.round(w / 150));
  for (let i = 0; i < n; i++) {
    const cx = x0 + 40 + ((w - 80) * i) / (n - 1);
    puffs.push(circleD(cx, top + 34, 62 + (i % 2) * 12, 44));
  }
  return (
    <g>
      <PaintedShape id="a3-desk" ds={[front]} bbox={{ x: x0, y: top + 30, w, h: bottom - top - 30 }} v={PV.desk} ink={7} seed={41} />
      {/* A panel line and a lower kick band — the desk reads as furniture, not a slab. */}
      <path d={ribbon([[x0 + 30, top + 120], [x0 + w * 0.5, top + 124], [x1 - 30, top + 118]], 5, 2, 43)} fill={PV.desk.line} opacity={0.6} />
      <text x={x1 - 150} y={top + 220} textAnchor="middle" fontFamily={kidTheme.fontFamily} fontWeight={900} fontSize={34} letterSpacing={3}
        fill={PV.cream.base}>CHECK OUT</text>
      <PaintedShape id="a3-desktop" ds={puffs} bbox={{ x: x0 - 40, y: top - 30, w: w + 80, h: 110 }} v={PV.lilac} ink={6} seed={45} />
    </g>
  );
};

/** The CHECK OUT lever: brass post pivoting at its base, red knob (no specular). `pull` 0 → 1. */
export const Lever: React.FC<{ x: number; y: number; pull: number }> = ({ x, y, pull }) => {
  const ang = -28 + pull * 74;
  const plate = roundRectPath(x - 54, y - 18, 108, 36, 14);
  return (
    <g>
      <PaintedShape id="a3-lever-plate" ds={[plate]} bbox={{ x: x - 54, y: y - 18, w: 108, h: 36 }} v={PV.steel} ink={4} seed={51} />
      <g transform={`rotate(${ang} ${x} ${y})`}>
        <PaintedShape id="a3-lever-post" ds={[roundRectPath(x - 11, y - 200, 22, 200, 10)]} bbox={{ x: x - 11, y: y - 200, w: 22, h: 200 }}
          v={PV.brass} ink={4} seed={53} />
        <PaintedShape id="a3-lever-knob" ds={[circleD(x, y - 214, 40)]} bbox={{ x: x - 40, y: y - 254, w: 80, h: 80 }} v={PV.red} ink={5} seed={55} />
      </g>
    </g>
  );
};

/** Desk lamp: shade + stem; its cone is a LightPool the scene places. */
export const DeskLamp: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const shade = ptsD([[x - 70, y - 150], [x + 70, y - 150], [x + 44, y - 220], [x - 44, y - 220]]);
  return (
    <g>
      <path d={ribbon([[x, y], [x + 4, y - 80], [x, y - 152]], 10, 6, 61)} fill={PV.brass.line} />
      <PaintedShape id="a3-lamp-base" ds={[circleD(x, y - 8, 46, 16)]} bbox={{ x: x - 46, y: y - 24, w: 92, h: 32 }} v={PV.brass} ink={4} seed={63} />
      <PaintedShape id="a3-lamp-shade" ds={[shade]} bbox={{ x: x - 70, y: y - 220, w: 140, h: 70 }} v={threeValues("#e8c88a", "#9a6a3a", { tame: 0.05 })}
        ink={5} seed={65} />
    </g>
  );
};

/**
 * The cloud floor slab, scalloped top at `top`, with an elliptical hole at
 * `hole.x` opening to `hole.r` (0 = closed). Evenodd: the hole shows whatever
 * was drawn underneath (the rain world).
 */
export const CloudFloor: React.FC<{ top: number; hole: { x: number; r: number }; depth?: number }> = ({ top, hole, depth = 300 }) => {
  const x0 = -700;
  const x1 = WIDTH + 700;
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += 30) pts.push([x, top + Math.sin(x / 70) * 6 + Math.sin(x / 23) * 2]);
  const slab = `M ${x0} ${top + depth} L ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")} L ${x1} ${top + depth} Z`;
  const r = hole.r;
  const ry = r * 0.22;
  const holeD = r > 1 ? ` ${circleD(hole.x, top + ry * 0.9, r, ry)}` : "";
  return (
    <g>
      <PaintFill id="a3-floor" shape={<path d={slab + holeD} fillRule="evenodd" clipRule="evenodd" />}
        bbox={{ x: x0, y: top - 10, w: x1 - x0, h: depth }} v={PV.lilac} seed={71} bleed={false} />
      <path d={ribbon(pts, 6, 2, 73, { jitter: 0.6 })} fill={PV.lilac.line} opacity={0.8} />
      {r > 1 ? (
        <>
          {/* The slab's cut wall, seen on the far side of the hole: it is a thick floor over a long drop. */}
          <path d={`M ${hole.x - r} ${top + ry * 0.9} A ${r} ${ry} 0 0 1 ${hole.x + r} ${top + ry * 0.9} L ${hole.x + r * 0.97} ${top + ry * 0.9 + 46} A ${r * 0.97} ${ry * 0.8} 0 0 0 ${hole.x - r * 0.97} ${top + ry * 0.9 + 46} Z`}
            fill={PV.lilac.shadow} opacity={0.95} />
          <path d={outlinePath(circleD(hole.x, top + ry * 0.9, r, ry), 9, 3, 75, { thickAt: -Math.PI / 2 })} fill={PV.lilac.line} />
        </>
      ) : null}
    </g>
  );
};

/** The rain world under the hotel (seen through the hole, then followed into). */
export const RainBelow: React.FC<{ top: number; height?: number; scroll?: number }> = ({ top, height = 2200, scroll = 0 }) => (
  <div style={{ position: "absolute", left: -700, top, width: WIDTH + 1400, height, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "#55667c" }} />
    <div style={{ position: "absolute", left: 700, top: 0, width: WIDTH, height: HEIGHT * 1.6 }}>
      <Plate k="rain_sky" bleed={0.4} />
    </div>
    <ScrollPlate k="rain_mid_curtain" speed={scroll} left={700} />
  </div>
);

/** A keyed curtain plate tiled vertically and scrolled upward by `speed` px/frame. */
export const ScrollPlate: React.FC<{ k: PlateKey; speed: number; left?: number; opacity?: number }> = ({ k, speed, left = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const h = HEIGHT * 1.2;
  const off = (((frame * speed) % h) + h) % h;
  return (
    <>
      {/* Polish A3-2: three columns (the plate spans 1.2 W), so a roll's corners never reach a tile edge. */}
      {[0, 1, 2].flatMap((i) =>
        [-1, 0, 1].map((j) => (
          <div key={`${i}:${j}`} style={{ position: "absolute", left: left + j * WIDTH * 1.2, top: i * h - off - HEIGHT * 0.1, width: WIDTH, height: h, opacity }}>
            <Plate k={k} bleed={0.1} />
          </div>
        )),
      )}
    </>
  );
};

/** Soft painted rain streaks on the 1.3 plane (the fg plate came back nearly empty). */
export const RainStreaks: React.FC<{ count?: number; speed?: number; len?: number; color?: string; opacity?: number; seed?: number; slant?: number }> = ({
  count = 18,
  speed = 40,
  len = 220,
  color = "#d9e2ee",
  opacity = 0.45,
  seed = 5,
  slant = 0.12,
}) => {
  const frame = useCurrentFrame();
  return (
    <Svg>
      {Array.from({ length: count }, (_, i) => {
        const span = HEIGHT + len + 400;
        const x = -200 + rnd(i, seed) * (WIDTH + 400);
        const y = ((rnd(i, seed + 1) * span + frame * speed * (0.8 + rnd(i, seed + 2) * 0.4)) % span) - len - 200;
        const l = len * (0.6 + rnd(i, seed + 3) * 0.8);
        const pts: Pt[] = [[x, y], [x - slant * l * 0.5, y + l * 0.5], [x - slant * l, y + l]];
        return <path key={i} d={ribbon(pts, 7 + rnd(i, seed + 4) * 7, 1, seed * 100 + i, { jitter: 0.3 })} fill={color}
          opacity={opacity * (0.5 + rnd(i, seed + 5) * 0.5)} />;
      })}
    </Svg>
  );
};

/** Speed lines either side of a falling body. */
export const DropStreaks: React.FC<{ x: number; y: number; strength: number; up?: boolean }> = ({ x, y, strength, up = true }) => {
  const frame = useCurrentFrame();
  if (strength <= 0.02) return null;
  return (
    <Svg>
      {[-1, 1].map((side) =>
        [0, 1, 2].map((i) => {
          const sx = x + side * (70 + i * 34);
          const y0 = y + (up ? -60 : 60) - i * 20 + Math.sin(frame * 0.7 + i) * 8;
          const l = 150 + i * 50;
          const pts: Pt[] = [[sx, y0], [sx + side * 4, y0 + (up ? -l / 2 : l / 2)], [sx + side * 6, y0 + (up ? -l : l)]];
          return <path key={`${side}${i}`} d={ribbon(pts, 9, 1.5, 300 + i * 3 + side, { jitter: 0.3 })} fill={W.light} opacity={strength * (0.75 - i * 0.18)} />;
        }),
      )}
    </Svg>
  );
};

// ---------------------------------------------------------------------------
// s23 — precipitation icons (rain, snow, sleet, hail), painted on cream discs
// ---------------------------------------------------------------------------

export const PRECIP = ["rain", "snow", "sleet", "hail"] as const;
export type PrecipKind = (typeof PRECIP)[number];

const DROP_PATH = (cx: number, cy: number, s: number) =>
  `M ${cx} ${cy - 30 * s} C ${cx + 8 * s} ${cy - 18 * s} ${cx + 20 * s} ${cy - 6 * s} ${cx + 20 * s} ${cy + 8 * s} A ${20 * s} ${20 * s} 0 0 1 ${cx - 20 * s} ${cy + 8 * s} C ${cx - 20 * s} ${cy - 6 * s} ${cx - 8 * s} ${cy - 18 * s} ${cx} ${cy - 30 * s} Z`;

const Flake: React.FC<{ cx: number; cy: number; r: number; seed: number }> = ({ cx, cy, r, seed }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const a = (i * Math.PI) / 3;
      const dx = Math.cos(a) * r;
      const dy = Math.sin(a) * r;
      return <path key={i} d={ribbon([[cx - dx, cy - dy], [cx, cy], [cx + dx, cy + dy]], 9, 4, seed + i)} fill={PV.snow.line} />;
    })}
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const a = (i * Math.PI) / 3;
      const px = cx + Math.cos(a) * r * 0.62;
      const py = cy + Math.sin(a) * r * 0.62;
      const b = a + Math.PI / 2;
      return <path key={`b${i}`} d={ribbon([[px - Math.cos(b) * 10 + Math.cos(a) * 9, py - Math.sin(b) * 10 + Math.sin(a) * 9], [px, py],
        [px + Math.cos(b) * 10 + Math.cos(a) * 9, py + Math.sin(b) * 10 + Math.sin(a) * 9]], 6, 3, seed + 10 + i)} fill={PV.snow.line} />;
    })}
  </g>
);

export const PrecipIcon: React.FC<{ kind: PrecipKind; x: number; y: number; s: number; rot?: number }> = ({ kind, x, y, s, rot = 0 }) => {
  const id = `a3-precip-${kind}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <PaintedShape id={`${id}-disc`} ds={[circleD(0, 0, 66)]} bbox={{ x: -66, y: -66, w: 132, h: 132 }} v={PV.cream} ink={5} seed={81} />
      {kind === "rain" ? (
        [[-22, -8], [18, -18], [6, 26]].map(([dx, dy], i) => (
          <PaintedShape key={i} id={`${id}-${i}`} ds={[DROP_PATH(dx, dy, 0.8)]} bbox={{ x: dx - 16, y: dy - 24, w: 32, h: 46 }} v={W} ink={3} seed={83 + i} />
        ))
      ) : kind === "snow" ? (
        <Flake cx={0} cy={0} r={40} seed={90} />
      ) : kind === "sleet" ? (
        <>
          <Flake cx={-18} cy={-14} r={22} seed={95} />
          <PaintedShape id={`${id}-d`} ds={[DROP_PATH(22, 14, 0.75)]} bbox={{ x: 7, y: -9, w: 30, h: 44 }} v={W} ink={3} seed={97} />
          {[[-20, 30], [30, -30]].map(([dx, dy], i) => <path key={i} d={ribbon([[dx, dy - 10], [dx - 3, dy + 10]], 6, 2, 98 + i)} fill={W.line} />)}
        </>
      ) : (
        [[-22, -16, 17], [20, -12, 14], [-2, 22, 19]].map(([dx, dy, r], i) => (
          <PaintedShape key={i} id={`${id}-${i}`} ds={[circleD(dx, dy, r)]} bbox={{ x: dx - r, y: dy - r, w: r * 2, h: r * 2 }} v={PV.snow} ink={3} seed={101 + i} />
        ))
      )}
      <text x={0} y={102} textAnchor="middle" fontFamily={kidTheme.fontFamily} fontWeight={900} fontSize={kidType.label * 0.8} fill={PAPER}
        stroke={INK} strokeWidth={1.5} paintOrder="stroke" letterSpacing={2}>{kind}</text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// s24 — the mountain top: a mossy summit rock, the tiny flag, snow, splash
// ---------------------------------------------------------------------------

/** Summit rock across the bottom of frame; `snow` 0..1 lays a snow cap on it. */
export const SummitRock: React.FC<{ top: number; x: number; snow?: number }> = ({ top, x, snow = 0 }) => {
  const pts: Pt[] = [
    [x - 1300, HEIGHT + 300], [x - 1200, top + 260], [x - 820, top + 120], [x - 520, top + 40], [x - 200, top - 6], [x + 120, top - 10],
    [x + 380, top + 30], [x + 700, top + 150], [x + 1100, top + 300], [x + 1400, top + 420], [x + 1500, HEIGHT + 300],
  ];
  const d = ptsD(pts);
  const moss = [
    circleD(x - 420, top + 70, 130, 40),
    circleD(x + 60, top + 8, 200, 34),
    circleD(x + 520, top + 100, 120, 36),
    circleD(x - 760, top + 160, 110, 36),
  ];
  const cap: Pt[] = [[x - 900, top + 112], [x - 520, top + 26], [x - 200, top - 22], [x + 120, top - 26], [x + 400, top + 18], [x + 760, top + 150],
    [x + 600, top + 168], [x + 300, top + 70], [x + 60, top + 44], [x - 260, top + 50], [x - 600, top + 110]];
  return (
    <g>
      <PaintedShape id="a3-summit" ds={[d]} bbox={{ x: x - 1300, y: top - 10, w: 2800, h: HEIGHT + 300 - top }} v={PV.rock} ink={8} seed={111} />
      {/* Cracks: thin tapered ink, never a uniform line. */}
      {[[[x - 300, top + 120], [x - 260, top + 220], [x - 310, top + 330]], [[x + 420, top + 160], [x + 470, top + 260]], [[x - 700, top + 240], [x - 640, top + 330], [x - 660, top + 400]]].map((c, i) => (
        <path key={i} d={ribbon(c as Pt[], 6, 1, 113 + i)} fill={PV.rock.line} opacity={0.75} />
      ))}
      <g opacity={1 - snow}>
        <PaintedShape id="a3-moss" ds={moss} bbox={{ x: x - 870, y: top - 30, w: 1520, h: 230 }} v={PV.moss} ink={0} seed={117} />
      </g>
      {snow > 0.01 ? (
        <g opacity={snow}>
          <PaintedShape id="a3-snowcap" ds={[ptsD(cap)]} bbox={{ x: x - 900, y: top - 26, w: 1660, h: 200 }} v={PV.snow} ink={4} seed={119} />
        </g>
      ) : null}
    </g>
  );
};

export const TinyFlag: React.FC<{ x: number; y: number; from: number }> = ({ x, y, from }) => {
  const frame = useCurrentFrame();
  const u = clamp01((frame - from) / 10);
  if (u <= 0) return null;
  const h = 150 * (0.4 + 0.6 * u);
  const t = frame / FPS;
  const wave = (k: number) => Math.sin(t * 5 + k) * 6;
  const flag = ptsD([[x + 2, y - h], [x + 80, y - h + 14 + wave(0)], [x + 76, y - h + 30 + wave(1)], [x + 2, y - h + 50]]);
  return (
    <g>
      <path d={ribbon([[x, y], [x + 1, y - h / 2], [x + 2, y - h]], 7, 4, 121)} fill={INK} />
      <PaintedShape id="a3-flag" ds={[flag]} bbox={{ x, y: y - h, w: 82, h: 54 }} v={PV.flag} ink={3} seed={123} />
    </g>
  );
};

export const Snowfall: React.FC<{ opacity: number; count?: number }> = ({ opacity, count = 70 }) => {
  const frame = useCurrentFrame();
  if (opacity <= 0.01) return null;
  return (
    <Svg style={{ opacity }}>
      {Array.from({ length: count }, (_, i) => {
        const x = ((rnd(i, 7) * (WIDTH + 200) + Math.sin(frame / 30 + i) * 30) % (WIDTH + 200)) - 100;
        const y = ((rnd(i, 8) * (HEIGHT + 100) + frame * (1.5 + rnd(i, 9) * 1.5)) % (HEIGHT + 100)) - 50;
        const r = 4 + rnd(i, 10) * 6;
        return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.85} fill={PAPER} opacity={0.75} />;
      })}
    </Svg>
  );
};

export const Splash: React.FC<{ x: number; y: number; from: number; s?: number }> = ({ x, y, from, s = 1 }) => {
  const frame = useCurrentFrame();
  const u = (frame - from) / 22;
  if (u < 0 || u > 1) return null;
  return (
    <Svg>
      {Array.from({ length: 7 }, (_, i) => {
        const a = -Math.PI + (i + 0.5) * (Math.PI / 7);
        const r = (60 + 140 * u) * s;
        const hx = x + Math.cos(a) * r * 1.4;
        const hy = y + Math.sin(a) * r * (1 - u * 0.4) + 160 * u * u * s;
        const tx = x + Math.cos(a) * r * 0.9;
        const ty = y + Math.sin(a) * r * 0.6;
        return <path key={i} d={ribbon([[tx, ty], [hx, hy]], 3, 16 * s * (1 - u * 0.6), 130 + i)} fill={W.light} opacity={1 - u} />;
      })}
    </Svg>
  );
};

// ---------------------------------------------------------------------------
// River: the waterline over a body, floating crowd drops, tributaries, ripples
// ---------------------------------------------------------------------------

/**
 * Drip IN the water (ep-1 s27 bug fix): a translucent water tint over the
 * body below the surface line + a painted front ripple. Draw AFTER the body.
 * `w` = body width at this scale; `surface` = water y at the body.
 */
export const Waterline: React.FC<{ x: number; surface: number; w: number; depth: number; tint?: string; opacity?: number; seed?: number }> = ({
  x,
  surface,
  w,
  depth,
  tint = "#2c6f9e",
  opacity = 0.62,
  seed = 140,
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const hw = w * 0.62;
  const wob = (k: number) => Math.sin(t * 2.4 + k) * 3;
  const bw = w * 0.5;
  const body = `M ${x - bw} ${surface + wob(0)} Q ${x} ${surface + 8 + wob(1)} ${x + bw} ${surface + wob(2)} A ${bw} ${depth} 0 0 1 ${x - bw} ${surface + wob(0)} Z`;
  const front: Pt[] = Array.from({ length: 9 }, (_, i) => {
    const u = i / 8;
    return [x - hw * 1.25 + u * hw * 2.5, surface + 6 + Math.sin(u * Math.PI) * 12 + Math.sin(t * 3 + i) * 2.5];
  });
  const back: Pt[] = Array.from({ length: 7 }, (_, i) => {
    const u = i / 6;
    return [x - hw * 1.1 + u * hw * 2.2, surface - 4 - Math.sin(u * Math.PI) * 10 + Math.sin(t * 3 + i + 1) * 2];
  });
  return (
    <Svg>
      <path d={body} fill={tint} opacity={opacity} />
      <path d={ribbon(back, 4, 1, seed + 1, { jitter: 0.4 })} fill={W.light} opacity={0.5} />
      <path d={ribbon(front, 7, 2, seed, { jitter: 0.5 })} fill={PAPER} opacity={0.75} />
    </Svg>
  );
};

/** Floating family drops, half under the surface (they share Drip's waterline rule). */
export const FloatCrowd: React.FC<{
  id: string;
  drops: Array<{ x: number; y: number; s: number; o?: boolean }>;
  litDir?: number;
  tint?: string;
  shade?: number;
}> = ({ id, drops, litDir = -1, tint = "#2c6f9e", shade = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <Svg>
      <CrowdDefs id={id} />
      {drops.map((d, i) => {
        const bob = Math.sin(frame / 11 + i * 1.9) * 4;
        const gap = 15 + Math.floor(rnd(i, 3) * 54);
        const blink = (frame + Math.floor(rnd(i, 4) * 60)) % (gap + 4) < 4;
        return (
          <g key={i}>
            <CrowdDrop id={id} x={d.x} y={d.y + bob} s={d.s} litDir={litDir} blink={blink} mood={d.o ? "o" : "smile"} tint={shade} />
            <g transform={`translate(${d.x.toFixed(1)} ${(d.y + bob).toFixed(1)}) scale(${d.s.toFixed(3)})`}>
              <g clipPath={`url(#${id}-clip)`}>
                <rect x={-60} y={26} width={120} height={60} fill={tint} opacity={0.6} />
              </g>
              <path d={ribbon([[-58, 30], [-20, 36], [20, 36], [58, 30]], 6, 2, 150 + i)} fill={PAPER} opacity={0.6} />
            </g>
          </g>
        );
      })}
    </Svg>
  );
};

/** A painted stream ribbon (tributary) running along `pts`, drawn up to `grow` 0..1. */
export const Stream: React.FC<{ pts: Pt[]; w0: number; w1: number; grow: number; seed?: number; color?: string }> = ({
  pts,
  w0,
  w1,
  grow,
  seed = 160,
  color = "#3f8fc4",
}) => {
  const frame = useCurrentFrame();
  if (grow <= 0.01) return null;
  const n = Math.max(2, Math.round(pts.length * grow));
  const p = pts.slice(0, n);
  const wd = (u: number) => lerp(w0, w1, u);
  const shimmer: Pt[] = p.map(([x, y], i) => [x + Math.sin(frame / 9 + i) * 3, y - wd(i / Math.max(1, n - 1)) * 0.18]);
  return (
    <Svg>
      <path d={band(p, (u) => wd(u) + 10, seed + 1)} fill={W.line} opacity={0.8} />
      <path d={band(p, wd, seed)} fill={color} />
      <path d={band(p, (u) => wd(u) * 0.55, seed + 3, 0.2)} fill={W.shadow} opacity={0.35} />
      <path d={band(shimmer, (u) => Math.max(3, wd(u) * 0.08), seed + 2, 0.3)} fill={W.light} opacity={0.6} />
    </Svg>
  );
};

/** Painted ripple rings on water (never UI ellipses): two tapered arcs per ring. */
export const Ripples: React.FC<{ at: Array<[number, number, number]>; color?: string; opacity?: number }> = ({ at, color = PAPER, opacity = 0.55 }) => {
  const frame = useCurrentFrame();
  return (
    <Svg>
      {at.map(([x, y, r], i) => {
        const k = ((frame / 40 + i * 0.37) % 1);
        const rr = r * (0.6 + 0.6 * k);
        const front: Pt[] = Array.from({ length: 9 }, (_, j) => {
          const a = Math.PI * 0.08 + (j / 8) * Math.PI * 0.84;
          return [x + Math.cos(a) * rr * 1.6, y + Math.sin(a) * rr * 0.32];
        });
        return <path key={i} d={ribbon(front, 5, 1, 170 + i, { jitter: 0.4 })} fill={color} opacity={opacity * (1 - k)} />;
      })}
    </Svg>
  );
};

// ---------------------------------------------------------------------------
// s26 — the daisy and the cut-away bank
// ---------------------------------------------------------------------------

/** The near bank on the right, cut away to show the soil; the daisy's roots live in it. */
export const BankCutaway: React.FC<{ x: number; top: number; surface: number }> = ({ x, top, surface }) => {
  const soil = ptsD([[x + 40, HEIGHT + 200], [x - 30, surface + 80], [x + 10, top + 60], [x + 120, top + 10], [WIDTH + 400, top - 10], [WIDTH + 400, HEIGHT + 200]]);
  const grass: Pt[] = [[x - 10, top + 70], [x + 60, top + 12], [x + 200, top - 2], [x + 600, top - 14], [WIDTH + 400, top - 18]];
  const turf = ptsD([...grass, [WIDTH + 400, top + 40], [x + 600, top + 44], [x + 200, top + 52], [x + 60, top + 66]]);
  return (
    <g>
      <PaintedShape id="a3-soil" ds={[soil]} bbox={{ x: x - 30, y: top, w: WIDTH + 430 - x, h: HEIGHT + 200 - top }} v={PV.earth} ink={7} seed={181} />
      {[[x + 180, top + 300, 34], [x + 560, top + 200, 26], [x + 300, top + 470, 30], [x + 700, top + 420, 38], [x + 90, top + 380, 20]].map(([cx, cy, r], i) => (
        <PaintedShape key={i} id={`a3-stone-${i}`} ds={[circleD(cx, cy, r, r * 0.7)]} bbox={{ x: cx - r, y: cy - r * 0.7, w: r * 2, h: r * 1.4 }}
          v={PV.rock} ink={3} seed={183 + i} />
      ))}
      <PaintedShape id="a3-turf" ds={[turf]} bbox={{ x: x - 10, y: top - 20, w: WIDTH + 410 - x, h: 90 }} v={PV.grass} ink={6} seed={191} />
      {Array.from({ length: 16 }, (_, i) => {
        const gx = x + 30 + i * 52 + rnd(i, 3) * 20;
        const gy = top + 8 - (i > 2 ? 14 : 0);
        return <path key={i} d={ribbon([[gx, gy + 14], [gx + 4, gy - 22], [gx + 12 * (rnd(i, 4) - 0.5), gy - 50]], 9, 1, 195 + i)} fill={PV.grass.shadow} />;
      })}
    </g>
  );
};

/**
 * The daisy: stem out of the bank at (x, top), leaning left over the water
 * to a head; roots down to `root`, glowing with `drink`. `lean` 0..1 extra lean.
 */
export const Daisy: React.FC<{ x: number; top: number; root: number; drink: number; lean?: number; glowColor?: string }> = ({
  x,
  top,
  root,
  drink,
  lean = 0,
  glowColor = "#f0c75a",
}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 34) * 8;
  const head = { x: x - 400 - lean * 60 + sway, y: top - 300 + lean * 40 - drink * 18 };
  const stem: Pt[] = [[x, top + 20], [x - 30, top - 160], [x - 150 - lean * 20, top - 260], [head.x + 60, head.y + 30]];
  const roots = [-1, -0.4, 0.35, 1].map((s) => [[x, top + 40], [x + s * 60, (top + root) / 2], [x + s * 170, root]] as Pt[]);
  const glow = drink > 0.02;
  const rootCol = glow ? mixHex(PV.earth.light, glowColor, drink) : PV.earth.line;
  const leaf = (lx: number, ly: number, dir: number, k: number) =>
    `M ${lx} ${ly} Q ${lx + dir * 60} ${ly - 50} ${lx + dir * 130} ${ly - 20} Q ${lx + dir * 60} ${ly + 10} ${lx} ${ly} Z` + (k ? "" : "");
  const petals: string[] = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const cx = head.x + Math.cos(a) * 62;
    const cy = head.y + Math.sin(a) * 50;
    return `M ${head.x} ${head.y} Q ${cx + Math.cos(a + 0.5) * 30} ${cy + Math.sin(a + 0.5) * 30} ${head.x + Math.cos(a) * 112} ${head.y + Math.sin(a) * 92} Q ${cx + Math.cos(a - 0.5) * 30} ${cy + Math.sin(a - 0.5) * 30} ${head.x} ${head.y} Z`;
  });
  return (
    <g>
      {roots.map((r, i) => <path key={i} d={ribbon(r, 18, 6, 201 + i, { jitter: 0.6 })} fill={rootCol} />)}
      {glow
        ? roots.map((r, i) => {
            const u = (frame / 30 + i * 0.25) % 1;
            const px = lerp(r[2][0], r[0][0], u);
            const py = lerp(r[2][1], r[0][1], u);
            return <circle key={`g${i}`} cx={px} cy={py} r={22} fill={glowColor} opacity={0.75 * drink * Math.sin(u * Math.PI)} />;
          })
        : null}
      <path d={ribbon(stem, 22, 12, 211, { jitter: 0.5 })} fill={PV.grass.line} />
      <path d={ribbon(stem, 15, 8, 212, { jitter: 0.5 })} fill={glow ? mixHex(PV.grass.base, glowColor, drink * 0.5) : PV.grass.base} />
      <PaintedShape id="a3-leaves" ds={[leaf(x - 24, top - 110, -1, 0), leaf(x - 110, top - 215, 1, 1)]} bbox={{ x: x - 160, y: top - 290, w: 260, h: 200 }}
        v={PV.grass} ink={4} seed={215} />
      <PaintedShape id="a3-petals" ds={petals} bbox={{ x: head.x - 112, y: head.y - 92, w: 224, h: 184 }} v={PV.petal} ink={4} seed={221} />
      <PaintedShape id="a3-yolk" ds={[circleD(head.x, head.y, 46, 40)]} bbox={{ x: head.x - 46, y: head.y - 40, w: 92, h: 80 }} v={PV.yolk} ink={4} seed={223} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// s27 — the moose (painted; total stillness is the joke — nothing here reads the frame)
// ---------------------------------------------------------------------------

/** The moose in its own 1920-wide coordinates (ep-1 layout); place with a transform. */
export const PaintedMoose: React.FC = () => {
  const legs = [
    [1010, 58],
    [1140, 50],
    [1470, 56],
    [1600, 48],
  ].map(([x, w]) => roundRectPath(x - w / 2, 520, w, 440, 24));
  const body = [
    roundRectPath(960, 330, 700, 290, 142),
    "M 980 430 Q 1040 250 1210 270 Q 1340 286 1370 430 Z",
    "M 1010 350 L 830 300 L 780 420 L 1000 480 Z",
    roundRectPath(520, 252, 330, 180, 88),
  ];
  const ears = [roundRectPath(666, 168, 48, 92, 24), roundRectPath(756, 164, 48, 92, 24), "M 806 270 Q 846 220 896 250 Q 860 290 806 270 Z"];
  const v = PV.hide;
  const far = { ...v, base: mixHex(v.base, v.shadow, 0.35) };
  return (
    <g>
      {/* Far legs first, a value darker: three ink weights (moose 7, trees soft, Drip 5) carry V4. */}
      <PaintedShape id="a3-moose-legs-far" ds={[legs[1], legs[3]]} bbox={{ x: 1110, y: 520, w: 520, h: 440 }} v={far} ink={6} seed={231} />
      <PaintedShape id="a3-moose-body" ds={body} bbox={{ x: 520, y: 252, w: 1140, h: 370 }} v={v} ink={8} seed={233} thickAt={Math.PI / 2} />
      <PaintedShape id="a3-moose-legs" ds={[legs[0], legs[2]]} bbox={{ x: 980, y: 520, w: 650, h: 440 }} v={v} ink={7} seed={235} />
      <PaintedShape id="a3-moose-ears" ds={ears} bbox={{ x: 666, y: 164, w: 230, h: 130 }} v={far} ink={5} seed={237} />
      <PaintedShape id="a3-moose-muzzle" ds={[circleD(556, 368, 96, 74)]} bbox={{ x: 460, y: 294, w: 192, h: 148 }} v={PV.muzzle} ink={6} seed={239} />
      <PaintedShape id="a3-moose-dewlap" ds={["M 636 424 Q 676 528 628 564 Q 572 530 578 430 Z"]} bbox={{ x: 578, y: 424, w: 90, h: 140 }} v={PV.muzzle}
        ink={5} seed={241} />
      <ellipse cx={524} cy={346} rx={11} ry={13} fill={INK} />
      <ellipse cx={576} cy={352} rx={11} ry={13} fill={INK} />
      <path d={ribbon([[500, 404], [556, 424], [612, 410]], 9, 3, 243)} fill={INK} />
      {/* Deadpan eyes: half a lid, no highlight, no interest. Cream, never white. */}
      {[
        [640, 308],
        [742, 304],
      ].map(([x, y], i) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx={30} ry={28} fill={PV.cream.base} />
          <circle cx={x} cy={y + 9} r={14} fill={INK} />
          <path d={`M ${x - 32} ${y + 1} h 64 v -32 h -64 Z`} fill={v.base} />
          <path d={outlinePath(circleD(x, y, 30, 28), 6, 2.5, 245 + i)} fill={INK} />
          <path d={ribbon([[x - 32, y + 1], [x, y + 3], [x + 32, y + 1]], 8, 4, 247 + i)} fill={INK} />
          <path d={ribbon([[x - 34, y - 40], [x, y - 44], [x + 34, y - 40]], 10, 4, 249 + i)} fill={INK} />
        </g>
      ))}
      <path d={ribbon([[1660, 386], [1700, 410], [1692, 474]], 20, 8, 251)} fill={v.line} />
    </g>
  );
};

export const Bonk: React.FC<{ x: number; y: number; from: number }> = ({ x, y, from }) => {
  const frame = useCurrentFrame();
  const u = clamp01((frame - from) / 16);
  if (frame < from || u >= 1) return null;
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${0.6 + u * 0.9})`} opacity={1 - u}>
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2;
          const pts: Pt[] = [[Math.cos(a) * 30, Math.sin(a) * 30], [Math.cos(a) * 96, Math.sin(a) * 96]];
          return <path key={i} d={ribbon(pts, 18, 2, 261 + i)} fill={PV.yolk.light} />;
        })}
      </g>
    </Svg>
  );
};

// ---------------------------------------------------------------------------
// s30–s31 — the journey ring (painted; ribbon line, drawn by progress)
// ---------------------------------------------------------------------------

/**
 * The cycle ring: from the ocean at lower-left, up, across the top, down the
 * right and home. `progress` draws it; `spin` turns it (s31); `glow` 0..1
 * flashes the snap. Stations appear once the line reaches them.
 */
export const PaintedRing: React.FC<{ cx: number; cy: number; r: number; progress?: number; spin?: number; glow?: number; stations?: boolean }> = ({
  cx,
  cy,
  r,
  progress = 1,
  spin = 0,
  glow = 0,
  stations = true,
}) => {
  const p = clamp01(progress);
  const start = 140;
  const n = Math.max(2, Math.round(120 * p));
  const pts: Pt[] = Array.from({ length: n + 1 }, (_, i) => {
    const th = ((start + (i / 120) * 360) * Math.PI) / 180;
    return [cx + Math.cos(th) * r, cy + Math.sin(th) * r];
  });
  const s = r / 330;
  const station = (deg: number, node: React.ReactNode) => {
    const frac = ((((deg - start) % 360) + 360) % 360) / 360;
    if (frac > p + 0.001) return null;
    const th = (deg * Math.PI) / 180;
    return (
      <g transform={`translate(${cx + Math.cos(th) * r} ${cy + Math.sin(th) * r}) rotate(${-spin}) scale(${s * 1.4})`}>{node}</g>
    );
  };
  return (
    <Svg>
      <g transform={`rotate(${spin} ${cx} ${cy})`}>
        <path d={band(pts, () => (56 + glow * 30) * s, 271, 0.12)} fill={glow > 0.05 ? PV.yolk.light : PAPER} opacity={0.3 + glow * 0.4} />
        <path d={band(pts, () => 26 * s, 273, 0.1)} fill={PAPER} />
        <path d={band(pts, () => 12 * s, 275, 0.14)} fill={W.line} />
        {[0, 90, 180, 270].map((deg) => {
          const frac = (deg + 44) / 360;
          if (frac > p) return null;
          const at = ((start + deg + 44) * Math.PI) / 180;
          const x = cx + Math.cos(at) * r;
          const y = cy + Math.sin(at) * r;
          const rot = (at * 180) / Math.PI + 90;
          return (
            <g key={deg} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
              <path d={ribbon([[-26, -18], [0, 14], [26, -18]], 14, 6, 277 + deg)} fill={W.shadow} />
            </g>
          );
        })}
        {stations ? (
          <>
            {station(
              186,
              <g>
                {[-30, 0, 30].map((dx, i) => <path key={dx} d={ribbon([[dx, 30 - i * 6], [dx + 6, 0], [dx, -32 - i * 6]], 12, 4, 281 + i)} fill={W.shadow} />)}
              </g>,
            )}
            {station(
              272,
              <PaintedShape id="a3-ring-cloud" ds={[circleD(-38, 6, 34), circleD(4, -16, 44), circleD(46, 8, 32)]} bbox={{ x: -72, y: -60, w: 150, h: 104 }}
                v={PV.cream} ink={4} seed={285} />,
            )}
            {station(
              6,
              <g>
                {[-28, 0, 28].map((dx, i) => (
                  <PaintedShape key={dx} id={`a3-ring-drop-${i}`} ds={[DROP_PATH(dx, i * 8 - 6, 0.9)]} bbox={{ x: dx - 18, y: i * 8 - 33, w: 36, h: 52 }} v={W}
                    ink={3} seed={287 + i} />
                ))}
              </g>,
            )}
            {station(
              92,
              <g>
                <PaintedShape id="a3-ring-mtn" ds={["M -78 40 L -10 -52 L 58 40 Z"]} bbox={{ x: -78, y: -52, w: 136, h: 92 }} v={PV.rock} ink={4} seed={291} />
                <PaintedShape id="a3-ring-cap" ds={["M -34 -18 L -10 -52 L 14 -18 Q -10 -30 -34 -18 Z"]} bbox={{ x: -34, y: -52, w: 48, h: 34 }} v={PV.snow}
                  ink={0} seed={293} />
                <path d={ribbon([[30, 40], [70, 26], [108, 34]], 16, 6, 295)} fill={W.base} />
              </g>,
            )}
          </>
        ) : null}
      </g>
    </Svg>
  );
};

/** Soft beam ribbons from (x, y) toward a target point (Sunny driving the ring). Screen blend. */
export const BeamsTo: React.FC<{ x: number; y: number; tx: number; ty: number; spread: number; strength: number; color?: string; count?: number }> = ({
  x,
  y,
  tx,
  ty,
  spread,
  strength,
  color = "#ffd28a",
  count = 5,
}) => {
  const frame = useCurrentFrame();
  if (strength <= 0.01) return null;
  const t = frame / FPS;
  const ang = Math.atan2(ty - y, tx - x) + Math.PI / 2;
  return (
    <Svg style={{ mixBlendMode: "screen" }}>
      {Array.from({ length: count }, (_, i) => {
        const off = (i / (count - 1) - 0.5) * spread;
        const ex = tx + Math.cos(ang) * off;
        const ey = ty + Math.sin(ang) * off;
        const pts: Pt[] = Array.from({ length: 7 }, (_, k) => {
          const u = k / 6;
          return [x + (ex - x) * u + Math.sin(u * 3 + i + t) * 8, y + (ey - y) * u];
        });
        const shimmer = 0.5 + 0.5 * Math.sin(t * 1.8 + i);
        return <path key={i} d={ribbon(pts, 30, 110, 301 + i, { jitter: 0 })} fill={color} opacity={strength * (0.12 + 0.1 * shimmer)} />;
      })}
    </Svg>
  );
};

/** A plate mirrored horizontally (the home headland was painted on the wrong side). */
export const MirroredPlate: React.FC<{ k: PlateKey; y?: number; bleed?: number }> = ({ k, y = 0, bleed = 0.1 }) => (
  <div style={{ position: "absolute", inset: 0, transform: "scaleX(-1)" }}>
    <Plate k={k} y={y} bleed={bleed} />
  </div>
);

/**
 * A dark painted foreground mound on the 1.3 plane at one bottom corner — the
 * scene's darkest value (LOOK bible p2) and an overlap that sells depth.
 * `side` picks the corner, `reach` how far in it comes, `top` its crest y.
 */
export const FgMound: React.FC<{
  id: string;
  side: "left" | "right";
  reach: number;
  top: number;
  v?: Value3;
  blades?: boolean;
  seed?: number;
  /** The near-black core in the corner (the scene's darkest value, LOOK p2); the bank `v` sits a step above it. */
  core?: Value3;
}> = ({
  id,
  side,
  reach,
  top,
  // Polish A3-4: a value FAMILY, not a #1a221e-flat blob — mid-dark moss bank, a lit ribbon top edge,
  // and a near-black core pooled in the corner, so it reads as a bank/rock at phone size.
  v = { base: "#2c3a28", shadow: "#172014", light: "#5f7444", line: "#0e120e" },
  blades = true,
  seed = 401,
  core = { base: "#141a16", shadow: "#0a0d0e", light: "#232c24", line: "#0a0c10" },
}) => {
  const frame = useCurrentFrame();
  const sx = (x: number) => (side === "left" ? x : WIDTH - x);
  const pts: Pt[] = [];
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = -300 + (reach + 300) * u;
    const y = top + (HEIGHT - top + 40) * Math.pow(u, 2.2) + Math.sin(u * 9 + seed) * 10;
    pts.push([sx(x), y]);
  }
  const d = `M ${sx(-300)} ${HEIGHT + 300} L ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")} L ${sx(reach)} ${HEIGHT + 300} Z`;
  const x0 = Math.min(sx(-300), sx(reach));
  // Polish A3-4: the moss bank band is ~CORE_DROP px deep so it reads as a bank at phone size (22 read as a hairline).
  const CORE_DROP = 64;
  const corePts: Pt[] = pts.map(([px, py], i) => {
    const u = i / n;
    return [sx(-300 + (reach * 0.9 + 300) * u), py + CORE_DROP + Math.sin(u * 7 + seed) * 10];
  });
  const coreD = `M ${sx(-300)} ${HEIGHT + 300} L ${corePts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")} L ${sx(reach * 0.9)} ${HEIGHT + 300} Z`;
  return (
    <Svg>
      <PaintedShape id={id} ds={[d]} bbox={{ x: x0, y: top - 10, w: reach + 300, h: HEIGHT + 300 - top }} v={v} ink={7} seed={seed} />
      {/* The core: the same silhouette, reach × 0.9, CORE_DROP px lower — the bank is a lit band over a near-black body. */}
      <PaintedShape id={`${id}-core`} ds={[coreD]} bbox={{ x: Math.min(sx(-300), sx(reach * 0.9)), y: top + CORE_DROP - 12, w: reach * 0.9 + 300, h: HEIGHT + 300 - top - CORE_DROP + 12 }}
        v={core} ink={0} seed={seed + 50} bleed={false} />
      {/* Lit top edge: a tapered light ribbon along the crest (the key catches the bank's lip). */}
      <path d={ribbon(pts.slice(0, n - 2), 7, 1.5, seed + 3, { jitter: 0.5 })} fill={v.light} opacity={0.85} />
      {blades
        ? Array.from({ length: 12 }, (_, i) => {
            const u = 0.05 + (i / 12) * 0.8;
            const p = pts[Math.round(u * n)];
            const h = 60 + rnd(i, seed) * 90;
            const sway = Math.sin(frame / 40 + i) * 6;
            return (
              <path key={i} d={ribbon([[p[0], p[1] + 10], [p[0] + (side === "left" ? 8 : -8), p[1] - h * 0.5], [p[0] + sway + (rnd(i, seed + 1) - 0.5) * 40, p[1] - h]], 14, 1, seed + i)}
                fill={i % 3 ? v.base : v.line} />
            );
          })
        : null}
    </Svg>
  );
};

/**
 * Polish A3-3: the bath's rubber duck as OUR prop (the plate's was a glossy 3D render): pooled yolk
 * body + head, flag-orange beak, ink eye, a ribbon wing, a painted ripple at the waterline. No
 * specular. Origin = the waterline under the body's centre; `bob` = a frame-driven phase.
 */
export const RubberDuck: React.FC<{ id: string; x: number; y: number; s?: number; bob?: number }> = ({ id, x, y, s = 1, bob = 0 }) => {
  const dy = Math.sin(bob * 0.12) * 3;
  const rock = Math.sin(bob * 0.09 + 1) * 3;
  const body = "M -78 -26 C -86 -56 -60 -62 -40 -46 C -10 -58 50 -58 70 -30 C 82 -12 70 10 40 12 L -50 12 C -74 10 -80 -6 -78 -26 Z";
  const head = circleD(34, -86, 34);
  const beak = "M 60 -92 C 82 -98 100 -90 98 -80 C 96 -72 78 -70 62 -76 Z";
  return (
    <g transform={`translate(${x} ${y + dy}) rotate(${rock}) scale(${s})`}>
      <PaintedShape id={`${id}-body`} ds={[body, head]} bbox={{ x: -86, y: -120, w: 170, h: 132 }} v={PV.yolk} ink={5} seed={701} />
      <PaintedShape id={`${id}-beak`} ds={[beak]} bbox={{ x: 60, y: -98, w: 40, h: 28 }} v={PV.flag} ink={3} seed={703} />
      <path d={ribbon([[-34, -30], [-6, -40], [24, -28]], 5, 1.5, 705)} fill={PV.yolk.line} />
      <circle cx={44} cy={-94} r={5.5} fill={INK} />
      <path d={ribbon([[-104, 10], [-40, 16], [30, 14], [96, 8]], 5, 1.2, 707)} fill={PAPER} opacity={0.75} />
    </g>
  );
};
