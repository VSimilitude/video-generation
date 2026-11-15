import React from "react";
import { kidInkOutline, kidTheme, threeValues, type Value3 } from "../../../lib/kid";
import {
  ACT_COLOR,
  HEIGHT,
  WIDTH,
  kidPaintTheme,
  ribbon,
  roundRectPath,
  useCurrentFrame,
  type Pt,
} from "./common";
import { PaperWash, Svg, rnd } from "./act1kit";
import { PaintedShape, circleD, clamp01 } from "./act3kit";

// Painted props for the recap (s33–s36), owned by the recap builder. Same
// recipe as act1kit/act3kit: PaintFill (flat base + pooled band + dry band)
// under a tapered ink ribbon; cream #f3ead8 is the lightest value anywhere;
// no gradients on a prop; type is cream with an ink outline or ink on a tag.

const INK = kidPaintTheme.ink;
const PAPER = kidPaintTheme.paper;

/** One Value3 per Big Word, from the act colours the Big Word cards use. */
export const WORD_V: Record<"evaporation" | "condensation" | "precipitation" | "collection", Value3> = {
  evaporation: threeValues(ACT_COLOR.evaporation, "#9a4a10", { tame: 0.08 }),
  condensation: threeValues(ACT_COLOR.condensation, "#4a2f8a", { tame: 0.12 }),
  precipitation: threeValues(ACT_COLOR.precipitation, "#103a6a", { tame: 0.08 }),
  collection: threeValues("#2fae8e", "#145a4a", { tame: 0.1 }),
};

/** The evening card paper: warm cream-tan, kit grain multiplied twice, a low-left warm key. */
export const PaperCard: React.FC<{ tone?: string; grain?: number; night?: number }> = ({ tone = "#e6d6bb", grain = 0.42, night = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: tone, overflow: "hidden" }}>
    <PaperWash opacity={grain} />
    {/* Pigment blooms: big soft uneven washes so the card is a painted sheet, not a fill. */}
    <Svg>
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse
          key={i}
          cx={rnd(i, 3) * WIDTH}
          cy={rnd(i, 5) * HEIGHT}
          rx={260 + rnd(i, 7) * 420}
          ry={160 + rnd(i, 9) * 260}
          fill={i % 2 ? "#c9a98a" : "#b9a4b8"}
          opacity={0.1 + 0.06 * rnd(i, 11)}
        />
      ))}
    </Svg>
    {night > 0 ? <div style={{ position: "absolute", inset: 0, background: "#1c2452", mixBlendMode: "multiply", opacity: night }} /> : null}
  </div>
);

/** Text width estimate for the kit font at weight 900 (tag sizing; no DOM measurement in render). */
export const textW = (s: string, size: number) => s.length * size * 0.66 + size * 0.2;

/**
 * A painted label tag: PaintFill round-rect in `v` under a tapered ink ribbon,
 * cream type with an ink outline. Centred on (x, y); `on` 0..1 pops it.
 */
export const PaintedTag: React.FC<{
  id: string;
  text: string;
  x: number;
  y: number;
  v: Value3;
  size?: number;
  on?: number;
  rot?: number;
  dark?: boolean;
  seed?: number;
}> = ({ id, text, x, y, v, size = 56, on = 1, rot = -1.5, dark = false, seed = 501 }) => {
  if (on <= 0.002) return null;
  const w = textW(text, size) + size * 1.1;
  const h = size * 1.55;
  const pad = 24;
  const s = 0.55 + 0.45 * Math.min(1.08, on);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2 - pad,
        top: y - h / 2 - pad,
        width: w + pad * 2,
        height: h + pad * 2,
        transform: `scale(${s}) rotate(${rot + (1 - clamp01(on)) * 6}deg)`,
        opacity: clamp01(on * 3),
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      <svg width={w + pad * 2} height={h + pad * 2} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <PaintedShape id={id} ds={[roundRectPath(pad, pad, w, h, h * 0.42)]} bbox={{ x: pad, y: pad, w, h }} v={v} ink={size * 0.11} seed={seed} />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: kidTheme.fontFamily,
          fontWeight: 900,
          fontSize: size,
          letterSpacing: 1,
          color: dark ? INK : PAPER,
          textShadow: dark ? undefined : kidInkOutline(size / 26, v.line),
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** A row of syllable chips (the Big Word card's blocks, painted), stressed syllable bigger. */
export const SyllableRow: React.FC<{
  id: string;
  syllables: string[];
  stress: number;
  x: number;
  y: number;
  v: Value3;
  size?: number;
  from: number;
  step?: number;
}> = ({ id, syllables, stress, x, y, v, size = 44, from, step = 4 }) => {
  const frame = useCurrentFrame();
  const sizes = syllables.map((_, i) => (i === stress ? size * 1.18 : size));
  const ws = syllables.map((s, i) => textW(s, sizes[i]) + sizes[i] * 0.9);
  const gap = 12;
  const total = ws.reduce((a, b) => a + b, 0) + gap * (syllables.length - 1);
  let cx = x - total / 2;
  return (
    <>
      {syllables.map((s, i) => {
        const left = cx;
        cx += ws[i] + gap;
        const on = clamp01((frame - from - i * step) / 6);
        return (
          <PaintedTag
            key={s + i}
            id={`${id}-${i}`}
            text={s}
            x={left + ws[i] / 2}
            y={y}
            v={i === stress ? v : SYL_V}
            dark={i !== stress}
            size={sizes[i]}
            on={on}
            rot={i % 2 ? 1.5 : -1.5}
            seed={600 + i * 13}
          />
        );
      })}
    </>
  );
};

const SYL_V: Value3 = { base: "#e2d4bb", shadow: "#b4a2a6", light: PAPER, line: "#4a4060" };

/** A painted paper frame (cut-card edge): tapered ink ribbon around a rect, plus a pooled shadow under it. */
export const CardFrame: React.FC<{ x: number; y: number; w: number; h: number; seed?: number; ink?: string; weight?: number }> = ({
  x,
  y,
  w,
  h,
  seed = 700,
  ink = INK,
  weight = 9,
}) => {
  const pts: Pt[] = [
    [x, y],
    [x + w * 0.5, y + 1],
    [x + w, y],
    [x + w - 1, y + h * 0.5],
    [x + w, y + h],
    [x + w * 0.5, y + h - 1],
    [x, y + h],
    [x + 1, y + h * 0.5],
    [x, y],
  ];
  return (
    <Svg>
      <path d={roundRectPath(x + 6, y + 10, w, h, 14)} fill="#3a2c40" opacity={0.22} />
      {[0, 2, 4, 6].map((i) => (
        <path key={i} d={ribbon([pts[i], pts[i + 1], pts[i + 2]], weight, weight * 0.45, seed + i, { jitter: 0.6 })} fill={ink} />
      ))}
    </Svg>
  );
};

/** A circular painted medallion rim (ring station vignettes): tapered ink ribbon + pooled lower shade. */
export const MedallionRim: React.FC<{ x: number; y: number; r: number; seed?: number; on?: number }> = ({ x, y, r, seed = 760, on = 1 }) => {
  const n = 40;
  const pts: Pt[] = Array.from({ length: n + 1 }, (_, i) => {
    const th = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return [x + Math.cos(th) * r, y + Math.sin(th) * r];
  });
  return (
    <Svg style={{ opacity: clamp01(on * 2) }}>
      <path d={circleD(x + 4, y + 8, r + 6)} fill="none" stroke="#3a2c40" strokeWidth={1.5} opacity={0.3} />
      <path d={ribbon(pts.slice(0, 22), 11, 4, seed, { jitter: 0.6 })} fill={INK} />
      <path d={ribbon(pts.slice(20), 5, 12, seed + 3, { jitter: 0.6 })} fill={INK} />
    </Svg>
  );
};

/** Painted wind streaks (ribbons, cream, low opacity) blowing camera-right. */
export const WindRibbons: React.FC<{ strength: number; count?: number; seed?: number }> = ({ strength, count = 16, seed = 800 }) => {
  const frame = useCurrentFrame();
  if (strength <= 0.01) return null;
  return (
    <Svg>
      {Array.from({ length: count }, (_, i) => {
        const y = 80 + rnd(i, seed) * 880;
        const speed = 34 + rnd(i, seed + 1) * 30;
        const len = 260 + rnd(i, seed + 2) * 360;
        const x = ((frame * speed + rnd(i, seed + 3) * 4000) % 3600) - 1200;
        const pts: Pt[] = Array.from({ length: 6 }, (_, k) => {
          const u = k / 5;
          return [x + u * len, y - Math.sin(u * Math.PI) * (18 + (i % 3) * 10) + Math.sin(frame / 9 + i) * 6];
        });
        return <path key={i} d={ribbon(pts, 3, 9, seed + i, { jitter: 0 })} fill={PAPER} opacity={strength * (0.28 + 0.2 * rnd(i, seed + 4))} />;
      })}
    </Svg>
  );
};

const LEAF_V: Value3[] = [
  threeValues("#d98a3a", "#8a3a1a", { tame: 0.12 }),
  threeValues("#c8553a", "#7a2a24", { tame: 0.12 }),
  threeValues("#7a9a3a", "#3a5a24", { tame: 0.15 }),
];

/** Leaves tumbling through on the 1.3 plane: two-value painted leaf + ink ribbon spine. */
export const BlowingLeaves: React.FC<{ strength: number; count?: number; seed?: number }> = ({ strength, count = 12, seed = 840 }) => {
  const frame = useCurrentFrame();
  if (strength <= 0.01) return null;
  return (
    <Svg>
      {Array.from({ length: count }, (_, i) => {
        const v = LEAF_V[i % 3];
        const speed = 22 + rnd(i, seed) * 22;
        const x = ((frame * speed + rnd(i, seed + 1) * 4000) % 3400) - 900;
        const y = 120 + rnd(i, seed + 2) * 760 + Math.sin(frame / 12 + i) * 60;
        const rot = frame * (3 + (i % 3) * 2) + i * 40;
        const s = 0.7 + rnd(i, seed + 3) * 0.6;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={clamp01(strength * 1.5)}>
            <path d="M 0 0 Q 44 -40 92 0 Q 44 40 0 0 Z" fill={v.base} />
            <path d="M 0 0 Q 44 40 92 0 Q 46 14 0 0 Z" fill={v.shadow} />
            <path d={ribbon([[2, 0], [46, -3], [90, 0]], 3, 1, seed + i)} fill={v.line} />
            <path d={ribbon([[0, 0], [44, -38], [92, 0]], 4, 2, seed + i + 50)} fill={v.line} opacity={0.8} />
          </g>
        );
      })}
    </Svg>
  );
};
