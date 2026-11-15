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
import { PaintedShape, band, circleD, clamp01 } from "./act3kit";

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

// ---------------------------------------------------------------------------
// Cloudia's hat, painted (a recap copy of the kit's flat CloudiaHat: same
// silhouette, PaintFill + tapered ink ribbons, tapered wavy streamers)
// ---------------------------------------------------------------------------

/** Evening values for the hat: dusky rose (it flies in front of the dusk multiply, so it is pre-darkened), warm rim. */
const HAT_V: Value3 = { base: "#c4628a", shadow: "#7a3060", light: "#e4949a", line: "#341230" };
const BRIM_V: Value3 = { base: "#a24672", shadow: "#62224e", light: "#d07e90", line: "#341230" };
const HAT_RIM = "#f0a070";

export const PaintedHat: React.FC<{ id: string; stream?: number; frame?: number }> = ({ id, stream = 0, frame = 0 }) => {
  const brim = "M -120 40 A 120 30 0 1 0 120 40 A 120 30 0 1 0 -120 40 Z";
  const crown = "M -66 40 L -50 -66 Q 0 -96 50 -66 L 66 40 Z";
  return (
    <g>
      {stream > 0
        ? [0, 1].map((i) => {
            const L = 170 + stream * 240;
            const pts: Pt[] = Array.from({ length: 16 }, (_, k) => {
              const u = k / 15;
              const amp = (6 + 22 * u) * (i ? 0.8 : 1);
              return [
                50 + u * L,
                -16 + i * 30 + u * (10 + i * 30) + Math.sin(u * 4.2 - frame / 4 + i * 1.7) * amp + Math.sin(u * 9 - frame / 3 + i) * 3 * u,
              ];
            });
            // tapered ribbon streamer: body, a light dry stroke along it, a thin ink edge on the under side
            const w = (u: number) => 30 * (1 - u) ** 0.7 + 3;
            const lightPts = pts.map(([x, y]) => [x, y - 4] as Pt);
            const edgePts = pts.map(([x, y], k) => [x, y + w(k / 15) * 0.45] as Pt);
            return (
              <g key={i}>
                <path d={band(pts, w, 1201 + i, 0.18)} fill={HAT_V.shadow} />
                <path d={band(pts, (u) => w(u) * 0.62, 1203 + i, 0.25)} fill={HAT_V.base} />
                <path d={band(lightPts.slice(0, 11), (u) => 5 * (1 - u) + 1, 1205 + i, 0.3)} fill={HAT_V.light} opacity={0.8} />
                <path d={band(edgePts, (u) => 3 * (1 - u) + 0.6, 1211 + i, 0.2)} fill={HAT_V.line} opacity={0.85} />
              </g>
            );
          })
        : null}
      <PaintedShape id={`${id}-brim`} ds={[brim]} bbox={{ x: -120, y: 10, w: 240, h: 60 }} v={BRIM_V} ink={5} seed={1221} strength={1.6} />
      <PaintedShape id={`${id}-crown`} ds={[crown]} bbox={{ x: -66, y: -90, w: 132, h: 130 }} v={HAT_V} ink={5} seed={1223} strength={1.6} />
      {/* the brim's shadow on the crown foot, the band, and a warm evening rim on the sun (left) side */}
      <path d={band([[-62, 30], [0, 36], [62, 30]], () => 16, 1227, 0.2)} fill={HAT_V.shadow} opacity={0.75} />
      <path d={ribbon([[-58, -16], [0, -21], [58, -16]], 10, 5, 1225)} fill={HAT_V.line} />
      <path d={ribbon([[-58, 30], [-52, -20], [-44, -64], [-20, -80]], 7, 2, 1229)} fill={HAT_RIM} opacity={0.7} />
      <path d={ribbon([[-112, 44], [-60, 60], [0, 66]], 6, 1, 1231)} fill={HAT_RIM} opacity={0.5} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// The DIRECTED ring for s34: a thick painted band (1.6x act 3's) carrying the
// process between stations — wisps rising (sea→cloud), rain falling
// (cloud→ground), a river running (ground→sea), waves (sea) — and big
// ribbon arrowheads travelling clockwise.
// ---------------------------------------------------------------------------

const RW = kidPaintTheme.water;
/** Process marks need a mid value on the cream band (the water family's light reads as paper). */
const VAPOUR = "#45689a";
const RAIN = "#17507f";

/**
 * Ring station geometry is the caller's (degrees, SVG convention: 0 = right,
 * 90 = bottom); the ring runs CLOCKWISE on screen, i.e. increasing degrees.
 * Legs: sea(180)→cloud(270) wisps rise, cloud(270)→ground(0) rain falls,
 * ground(0)→sea(90) a river runs, sea leg (90→180) waves. `travel` (deg)
 * moves a train of water drops round the band once the ring has closed.
 */
export const DirectedRing: React.FC<{
  cx: number;
  cy: number;
  r: number;
  progress: number;
  start?: number;
  flow?: number;
  travel?: number;
  /** Station half-width in degrees: the marks stay inside the visible part of each leg. */
  gap?: number;
}> = ({ cx, cy, r, progress, start = 140, flow = 0, travel = 0, gap = 18 }) => {
  const frame = useCurrentFrame();
  const p = clamp01(progress);
  const at = (deg: number, rr = r): Pt => {
    const th = (deg * Math.PI) / 180;
    return [cx + Math.cos(th) * rr, cy + Math.sin(th) * rr];
  };
  const arc = (a: number, b: number, rr = r, n = 40): Pt[] =>
    Array.from({ length: n + 1 }, (_, i) => at(a + ((b - a) * i) / n, rr));
  const drawnFrac = (deg: number) => ((((deg - start) % 360) + 360) % 360) / 360;
  const drawn = (deg: number) => drawnFrac(deg) <= p + 0.001;
  // How far into a leg the drawing has reached (0..1), so marks appear as the band passes.
  const legOn = (a: number, b: number) => clamp01((p - drawnFrac(a)) / Math.max(0.001, drawnFrac(b) - drawnFrac(a)));
  const end = start + 360 * p;
  const k = 1.6;
  const n = Math.max(4, Math.round(140 * p));
  const speed = 1 + flow * 1.6;
  const lo = gap + 6;
  // The sea leg (94°→178°) can contain the draw start: paint only the part of it the band has reached.
  const seaPieces: Array<[number, number]> = [];
  {
    const S0 = 94;
    const S1 = 178;
    const s0 = ((start - S0) % 360 + 360) % 360 + S0; // start expressed inside [S0, S0+360)
    if (s0 < S1) {
      if (end > s0 + 1) seaPieces.push([s0, Math.min(S1, end)]);
      if (end > S0 + 360) seaPieces.push([S0, Math.min(s0, end - 360)]);
    } else {
      const a0 = S0 + 360 * Math.ceil((start - S0) / 360);
      if (end > a0) seaPieces.push([a0, Math.min(a0 + (S1 - S0), end)]);
    }
  }
  return (
    <Svg>
      {p > 0.01 ? (
        <>
          <path d={band(arc(start, end, r, n), () => 66 * k, 271, 0.12)} fill={PAPER} opacity={0.4} />
          <path d={band(arc(start, end, r, n), () => 32 * k, 273, 0.1)} fill={PAPER} />
          <path d={band(arc(start, end, r + 1, n), () => 34, 277, 0.14)} fill={RW.light} opacity={0.75} />
          <path d={band(arc(start, end, r, n), () => 16, 275, 0.16)} fill={RW.line} />
        </>
      ) : null}
      {/* sea leg (collection → evaporation): a broad sea-blue band with small cream crests drifting along it */}
      {seaPieces.map(([a, b], j) => (
        <g key={`sea${j}`}>
          <path d={band(arc(a, b, r, 20), () => 46, 1301 + j, 0.12)} fill={RW.shadow} />
          <path d={band(arc(a, b, r - 4, 20), () => 26, 1303 + j, 0.16)} fill={RW.base} opacity={0.9} />
        </g>
      ))}
      {seaPieces.length > 0 ? (
        <>
          {Array.from({ length: 4 }, (_, i) => {
            const u = (frame * 0.006 * speed + i / 4) % 1;
            const d = 96 + u * 80;
            if (!drawn(d)) return null;
            const pts = arc(d - 4, d + 4, r - 8, 6).map(([x, y], j) => [x, y - Math.sin((j / 6) * Math.PI) * 7] as Pt);
            return <path key={`w${i}`} d={ribbon(pts, 5, 2, 1305 + i)} fill={PAPER} opacity={0.85 * Math.sin(u * Math.PI)} />;
          })}
        </>
      ) : null}
      {/* evaporation → condensation: vapour wisps rising off the band, outside the ring */}
      {legOn(180 + gap, 270 - gap) > 0
        ? Array.from({ length: 6 }, (_, i) => {
            const u = (frame * 0.012 * speed + i / 6) % 1;
            const d = 180 + lo + (i / 5) * (90 - 2 * lo);
            if (!drawn(d)) return null;
            const [x0, y0] = at(d, r + 20);
            const y = y0 + 30 - u * 120;
            const x = x0 - 20 + Math.sin(u * 5 + i) * 10;
            const o = Math.sin(u * Math.PI);
            const pts: Pt[] = Array.from({ length: 12 }, (_, j) => {
              const t = j / 11;
              return [x + Math.sin(t * 5.5 + i) * 13, y + 52 - t * 104];
            });
            return (
              <g key={`v${i}`} opacity={0.95 * o}>
                <path d={band(pts, (t) => 20 * (0.3 + 0.7 * Math.sin(Math.PI * t)), 1311 + i, 0.15)} fill={VAPOUR} />
                <path d={band(pts, (t) => 6 * Math.sin(Math.PI * t), 1316 + i, 0.2)} fill={PAPER} opacity={0.45} />
              </g>
            );
          })
        : null}
      {/* condensation → precipitation: a sheet of rain falling across the band */}
      {legOn(270 + gap, 360 - gap) > 0
        ? Array.from({ length: 9 }, (_, i) => {
            const d = 270 + lo + (i / 8) * (90 - 2 * lo);
            if (!drawn(d)) return null;
            const [x, y] = at(d);
            const f = ((frame * 2.2 * speed + i * 23) % 50) / 50;
            const yy = y - 70 + f * 130;
            return (
              <path key={`r${i}`} d={ribbon([[x + 11, yy], [x + 4, yy + 32], [x - 3, yy + 64]], 15, 3, 1321 + i)} fill={RAIN}
                opacity={Math.min(1, 1.6 * Math.sin(f * Math.PI))} />
            );
          })
        : null}
      {/* precipitation → collection: the river, a blue painted ribbon widening as it runs to the sea */}
      {legOn(gap, 90 - gap) > 0 ? (
        <>
          <path d={band(arc(4, 4 + 82 * legOn(4, 86), r, 30), (u) => 26 + u * 22, 1331, 0.1)} fill={RW.base} />
          <path d={band(arc(4, 4 + 82 * legOn(4, 86), r + 8, 30), (u) => 6 + u * 6, 1333, 0.2)} fill={RW.shadow} opacity={0.75} />
          {Array.from({ length: 5 }, (_, i) => {
            const u = (frame * 0.01 * speed + i / 5) % 1;
            const d = 6 + u * 78;
            if (!drawn(d)) return null;
            return <path key={i} d={ribbon(arc(d - 4, d + 4, r - 6, 4), 3, 6, 1341 + i)} fill={PAPER} opacity={0.85 * Math.sin(u * Math.PI)} />;
          })}
        </>
      ) : null}
      {/* the drops going round (after the ring closes): travel clockwise along the band */}
      {travel > 0 && p >= 0.999
        ? Array.from({ length: 6 }, (_, i) => {
            const d = start + travel + i * 60 + 20;
            const [x, y] = at(d);
            const fade = clamp01(travel / 30);
            return (
              <g key={`d${i}`} transform={`translate(${x} ${y}) rotate(${d + 90}) scale(1.6)`} opacity={fade}>
                {/* teardrop pointing back along the path (round head leads, clockwise), cream-haloed off the band */}
                <path d="M -40 0 Q -6 -22 10 -21 A 21 21 0 0 1 10 21 Q -6 22 -40 0 Z" fill={PAPER} />
                <path d="M -34 0 Q -6 -17 10 -16 A 16 16 0 0 1 10 16 Q -6 17 -34 0 Z" fill={RW.line} />
                <path d="M -27 0 Q -4 -11 10 -11 A 11 11 0 0 1 10 11 Q -4 11 -27 0 Z" fill={RW.base} />
                <path d={ribbon([[2, -6], [10, -8], [16, -4]], 3, 1, 1371 + i)} fill={PAPER} opacity={0.7} />
              </g>
            );
          })
        : null}
      {/* arrowheads: one per leg at its middle, >= 60 px, tangent and pointing clockwise */}
      {[225, 315, 45, 135].map((deg, i) => {
        if (!drawn(deg) || !drawn(deg + 10)) return null;
        const pop = clamp01(legOn(deg - 20, deg + 10));
        const d = deg + Math.sin(frame / 14 + i) * 2;
        const [x, y] = at(d);
        const s = 0.6 + 0.4 * pop;
        return (
          <g key={deg} transform={`translate(${x} ${y}) rotate(${d + 90}) scale(${s})`}>
            <path d="M 46 0 L -34 -48 L -16 0 L -34 48 Z" fill={INK} />
            <path d="M 33 0 L -24 -34 L -9 0 L -24 34 Z" fill={RW.base} />
            <path d={ribbon([[-20, -27], [24, 0]], 5, 2, 1351 + i)} fill={RW.light} opacity={0.8} />
          </g>
        );
      })}
    </Svg>
  );
};
