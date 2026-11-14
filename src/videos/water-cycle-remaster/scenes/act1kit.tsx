import React from "react";
import { staticFile } from "remotion";
import { PAPER_SRC, mixHex } from "../../../lib/kid";
import {
  FPS,
  HEIGHT,
  WIDTH,
  kidPaintTheme,
  outlinePath,
  ribbon,
  useCurrentFrame,
  type CamDelta,
  type Pt,
} from "./common";

// Shared painted props for the cold open + act one (owned by the act-1
// builder). Everything here is SVG on top of the plates, painted per the ACT
// notes: flat base + a pooled shadow band + a tapered ribbon outline, cream
// (never #fff) highlights, no gradients. Static geometry is computed ONCE at
// module level and reused with <use>, so a crowd of 100 drops costs no
// perfect-freehand work per frame and no per-drop filter.

const W = kidPaintTheme.water;
const INK = kidPaintTheme.ink;
const PAPER = kidPaintTheme.paper;

// ---------------------------------------------------------------------------
// Camera helpers
// ---------------------------------------------------------------------------

/** A damped vertical (or any-axis) shake: peak on frame 1, gone by `frames`. */
export function shake(frame: number, at: number, amp: number, frames = 12, axis: "x" | "y" = "y"): CamDelta {
  const t = frame - at;
  if (t < 0 || t > frames) return {};
  const v = amp * Math.sin((t / frames) * Math.PI * 3) * (1 - t / frames);
  return axis === "y" ? { dy: v } : { dx: v };
}

/** Frame at `sec` seconds into a line (measured with silencedetect; see act1.tsx). */
export const secs = (from: number, sec: number) => from + Math.round(sec * FPS);

// ---------------------------------------------------------------------------
// The crowd drop ("Blobby", re-pictured) — <CrowdDefs/> once per SVG, then <CrowdDrop/>
// ---------------------------------------------------------------------------

const DROP_D = "M 0 -58 C 14 -36 40 -14 40 12 A 40 40 0 0 1 -40 12 C -40 -14 -14 -36 0 -58 Z";
const DROP_INK = outlinePath(DROP_D, 5.5, 1.4, 4242, { thickAt: Math.PI * 0.6, step: 5 });
const DROP_SMILE = ribbon(
  [
    [-11, 18],
    [-5, 23],
    [0, 24],
    [5, 23],
    [11, 18],
  ] as Pt[],
  3.2,
  1.2,
  77,
  { jitter: 0.2 },
);

export const CrowdDefs: React.FC<{ id?: string }> = ({ id = "crowd" }) => (
  <defs>
    <path id={`${id}-body`} d={DROP_D} />
    <clipPath id={`${id}-clip`}>
      <path d={DROP_D} />
    </clipPath>
    <path id={`${id}-ink`} d={DROP_INK} />
    <path id={`${id}-smile`} d={DROP_SMILE} />
  </defs>
);

/**
 * One crowd drop at (x, y) = its body centre, `s` scale. Lit from `litDir`
 * (+1 = key camera-right): the dry band sits on that side. `mood` "o" = a
 * small round mouth (surprised).
 */
export const CrowdDrop: React.FC<{
  x: number;
  y: number;
  s: number;
  id?: string;
  litDir?: number;
  mood?: "smile" | "o";
  tint?: number;
  opacity?: number;
  blink?: boolean;
}> = ({ x, y, s, id = "crowd", litDir = 1, mood = "smile", tint = 0, opacity = 1, blink = false }) => {
  const base = tint ? mixHex(W.base, "#2a3a6a", tint) : W.base;
  const shadow = tint ? mixHex(W.shadow, "#1a2048", tint) : W.shadow;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})`} opacity={opacity}>
      <use href={`#${id}-body`} fill={base} />
      <g clipPath={`url(#${id}-clip)`}>
        <ellipse cx={-litDir * 16} cy={44} rx={52} ry={30} fill={shadow} opacity={0.85} />
        <ellipse cx={litDir * 22} cy={-6} rx={14} ry={30} fill={W.light} opacity={0.55} />
      </g>
      <use href={`#${id}-ink`} fill={W.line} />
      {blink ? (
        <>
          <rect x={-17} y={2} width={11} height={3} rx={1.5} fill={INK} />
          <rect x={6} y={2} width={11} height={3} rx={1.5} fill={INK} />
        </>
      ) : (
        <>
          <ellipse cx={-11} cy={3} rx={5.5} ry={7.5} fill={INK} />
          <ellipse cx={11} cy={3} rx={5.5} ry={7.5} fill={INK} />
          <circle cx={-9.5} cy={0.5} r={1.8} fill={PAPER} />
          <circle cx={12.5} cy={0.5} r={1.8} fill={PAPER} />
        </>
      )}
      {mood === "o" ? <ellipse cx={0} cy={20} rx={5} ry={6} fill={INK} /> : <use href={`#${id}-smile`} fill={INK} />}
    </g>
  );
};

/** Deterministic pseudo-random in [0,1). */
export const rnd = (i: number, salt = 0) => {
  const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * A crowd of identical drops on rows (s03's family, s09/s11's risers). Each
 * row: y, scale, count, spread. `rise(frame, i)` lifts drop i (px). Blinks on
 * a staggered 0.5–2.3 s schedule (ref blink gap).
 */
export const Crowd: React.FC<{
  rows: Array<{ y: number; s: number; count: number; spread: number; x?: number; tint?: number }>;
  id?: string;
  litDir?: number;
  rise?: (frame: number, i: number) => number;
  bob?: number;
  moodO?: (i: number) => boolean;
  /** Leave a hole (e.g. around the hero, so the name arrow points at nobody else). */
  avoid?: { x: number; y: number; r: number };
}> = ({ rows, id = "crowd", litDir = 1, rise, bob = 6, moodO, avoid }) => {
  const frame = useCurrentFrame();
  let k = 0;
  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", overflow: "visible" }}>
      <CrowdDefs id={id} />
      {rows.map((r, ri) =>
        Array.from({ length: r.count }, (_, j) => {
          const i = k++;
          const u = r.count === 1 ? 0.5 : j / (r.count - 1);
          const x = (r.x ?? WIDTH / 2) + (u - 0.5) * r.spread + (rnd(i, 1) - 0.5) * 60;
          const y = r.y + (rnd(i, 2) - 0.5) * 24 + Math.sin(frame / 14 + i * 1.7) * bob - (rise ? rise(frame, i) : 0);
          const gap = 15 + Math.floor(rnd(i, 3) * 54);
          const blink = (frame + Math.floor(rnd(i, 4) * 60)) % (gap + 4) < 4;
          if (avoid && Math.hypot(x - avoid.x, (y - avoid.y) * 1.6) < avoid.r) return null;
          return (
            <CrowdDrop key={`${ri}-${j}`} id={id} x={x} y={y} s={r.s * (0.94 + rnd(i, 5) * 0.12)} litDir={litDir}
              tint={r.tint} blink={blink} mood={moodO?.(i) ? "o" : "smile"} />
          );
        }),
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Sparkles, beams, arcs — light and motion marks
// ---------------------------------------------------------------------------

/** Four-point glints orbiting a point (s01's "glittering drop"). Cream, soft. */
export const Glints: React.FC<{ x: number; y: number; from: number; r?: number; color?: string }> = ({
  x,
  y,
  from,
  r = 96,
  color = "#f6deb0",
}) => {
  const frame = useCurrentFrame();
  const u = Math.max(0, Math.min(1, (frame - from) / 20));
  if (u <= 0) return null;
  const t = frame / FPS;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      {Array.from({ length: 6 }, (_, i) => {
        const ang = (i / 6) * Math.PI * 2 + t * 0.4;
        const rr = r + Math.sin(t * 1.7 + i) * r * 0.14;
        const a = (12 + 8 * Math.abs(Math.sin(t * 2.3 + i * 1.7))) * (r / 96);
        return (
          <path
            key={i}
            transform={`translate(${Math.cos(ang) * rr * 1.5} ${Math.sin(ang) * rr})`}
            d={`M 0 ${-a} Q ${a * 0.16} ${-a * 0.16} ${a} 0 Q ${a * 0.16} ${a * 0.16} 0 ${a} Q ${-a * 0.16} ${a * 0.16} ${-a} 0 Q ${-a * 0.16} ${-a * 0.16} 0 ${-a} Z`}
            fill={color}
            opacity={u * (0.35 + 0.45 * Math.abs(Math.sin(t * 2 + i)))}
          />
        );
      })}
    </svg>
  );
};

/** Soft sunbeam ropes from (x, y) down to the water: tapered ribbons, low alpha, screen. */
export const SunBeams: React.FC<{ x: number; y: number; strength: number; to: number; color?: string }> = ({
  x,
  y,
  strength,
  to,
  color = "#ffe2a0",
}) => {
  const frame = useCurrentFrame();
  if (strength <= 0.01) return null;
  const t = frame / FPS;
  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", overflow: "visible", mixBlendMode: "screen" }}>
      {Array.from({ length: 6 }, (_, i) => {
        const landing = 1500 - i * 270;
        const shimmer = 0.5 + 0.5 * Math.sin(t * 1.6 + i * 1.1);
        const pts: Pt[] = Array.from({ length: 8 }, (_, k) => {
          const u = k / 7;
          return [x + (landing - x) * u + Math.sin(u * 3 + i + t) * 10, y + (to - y) * u];
        });
        return <path key={i} d={ribbon(pts, 70 + (i % 2) * 30, 20, 500 + i, { jitter: 0 })} fill={color}
          opacity={strength * (0.14 + 0.1 * shimmer)} />;
      })}
    </svg>
  );
};

/** Vibration arcs either side of a body (s09). Tapered, water-light. */
export const MotionArcs: React.FC<{ x: number; y: number; amount: number; s?: number }> = ({ x, y, amount, s = 1 }) => {
  const frame = useCurrentFrame();
  if (amount <= 0.05) return null;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      {[-1, 1].map((side) =>
        [0, 1, 2].map((i) => {
          const r = (150 + i * 46) * s;
          const spread = (0.5 + amount * 0.5) * s;
          const pts: Pt[] = [
            [side * r, -70 * spread],
            [side * (r + 22 * s), -30 * spread],
            [side * (r + 30 * s), 0],
            [side * (r + 22 * s), 30 * spread],
            [side * r, 70 * spread],
          ];
          return (
            <path key={`${side}-${i}`} d={ribbon(pts, 12 * s, 3 * s, 600 + i * 2 + side, { jitter: 0.3 })}
              fill={kidPaintTheme.water.light}
              opacity={amount * (0.8 - i * 0.2) * (0.6 + 0.4 * Math.sin(frame * 0.8 + i))} />
          );
        }),
      )}
    </svg>
  );
};

/** A full-frame SVG layer in composition coordinates (overflow visible for pull-outs). */
export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", overflow: "visible", ...style }}>
    {children}
  </svg>
);

/**
 * A dark foreground swell across the bottom of frame (the 1.3 plane): the
 * scene's darkest value (LOOK bible p2) and an overlap that sells depth (V4).
 * Tapered ink top, pooled deeper band, slow drift. `top` = its crest line.
 */
export const FgSwell: React.FC<{ top: number; color?: string; deep?: string; ink?: string; seed?: number; amp?: number }> = ({
  top,
  color = "#16405e",
  deep = "#0d2a44",
  ink = "#122a3a",
  seed = 1300,
  amp = 22,
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const pts: Pt[] = [];
  for (let x = -400; x <= WIDTH + 400; x += 40) {
    pts.push([x, top + Math.sin(x / 420 + t * 0.6 + seed) * amp + Math.sin(x / 150 + t * 1.1) * amp * 0.25]);
  }
  const d = `M -400 ${HEIGHT + 400} L ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")} L ${WIDTH + 400} ${HEIGHT + 400} Z`;
  return (
    <Svg>
      <path d={d} fill={color} />
      <path d={d} fill={deep} transform={`translate(0 ${Math.max(40, (HEIGHT - top) * 0.45)})`} opacity={0.8} />
      <path d={ribbon(pts, 7, 2, seed, { jitter: 0.8 })} fill={ink} />
    </Svg>
  );
};

/**
 * Deepen a pale flux sky toward the zenith (multiply): the LOOK bible's day
 * value structure wants lum ≤ 0.62 and real saturation in the sky; the plates
 * come back high-key. Put it in the `sky` slot, under any pools/blooms.
 */
export const Zenith: React.FC<{ color?: string; mid?: string; reach?: number; opacity?: number }> = ({
  color = "#2f5fa8",
  mid = "#7a9ccf",
  reach = 62,
  opacity = 0.8,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `linear-gradient(180deg, ${color} 0%, ${mid} ${reach * 0.5}%, rgba(255,255,255,0) ${reach}%)`,
      mixBlendMode: "multiply",
      opacity,
      pointerEvents: "none",
    }}
  />
);

/**
 * Extra paper multiply for a sky plane (sky slot): the tileable kit paper at
 * `opacity`, so a big smooth gradient sky reads as painted on paper. One
 * full-frame blend layer — use per scene, not everywhere.
 */
export const PaperWash: React.FC<{ opacity?: number }> = ({ opacity = 0.3 }) => (
  <div
    style={{
      position: "absolute",
      inset: "-10%",
      backgroundImage: `url(${staticFile(PAPER_SRC)})`,
      backgroundSize: "1024px 1024px",
      mixBlendMode: "multiply",
      opacity,
      pointerEvents: "none",
    }}
  />
);
