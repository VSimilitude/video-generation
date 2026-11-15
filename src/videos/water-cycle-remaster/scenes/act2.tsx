import React from "react";
import { Easing, staticFile } from "remotion";
import { LobbyDesk, LobbyLamp, LobbySign } from "./lobbykit";
import { PaperWash } from "./act1kit";
import {
  SpeechBubble,
  circlePts,
  kidInkOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  lookAt,
  mixHex,
  samplePath,
  softRadial,
  threeValues,
  type Emotion,
  type Value3,
} from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  ACT_COLOR,
  AbsoluteFill,
  BigWordBeat,
  Bubbles,
  CutFlash,
  HEIGHT,
  KeyBloom,
  LightPool,
  NameArrow,
  PHASE,
  PLATES,
  PaintFill,
  PaintedCloudia,
  PaintedDrip,
  PaintedSunny,
  Plane,
  Plate,
  SETS,
  SetStack,
  SkyBlend,
  Vignette,
  WIDTH,
  World,
  atLine,
  bigWordPush,
  crownOf,
  interpolate,
  kidPaintTheme,
  lineProgress,
  lineWindow,
  midOf,
  outlinePath,
  projectMark,
  remasterCam,
  ribbon,
  roundRectPath,
  spring,
  stand,
  useCurrentFrame,
  useEmotion,
  useLookAtSpeaker,
  useVideoConfig,
  type Cam,
  type CamDelta,
  type Cast,
  type Mark,
  type PlateKey,
  type Pt,
  type TimedScene,
} from "./common";

// ACT TWO — THE SKY (remaster). Scenes s12–s21: the stepped climb, the Cloud
// Hotel, the pillow myth, condensation, and a hotel that fills until it cannot
// stay up. Ep 1's beats (src/videos/water-cycle/scenes/act2.tsx) re-pictured on
// the look package: every scene is a <SetStack> of pre-blurred plates (sky ∞ /
// far 0.15 / mid 0.4 / stage 1.0 / fg 1.3), the cast on the paint path with
// LIGHT[id], every set-piece a PaintFill + ribbon outline, a light pool on every
// hotel interior, and the camera grammar of shot-plan.md (creeping holds,
// stepped 26 px bursts pinned to line keys, no move while a bubble is up).
//
// The act's two shared props, as in ep 1: `PaintedCloud` (every cloud built in
// SVG — floors, shelves, mist, the doorman) and `PaintedDrops` (the guests: ONE
// PaintFill for a whole swarm, so a hundred drops cost one filter set). `grey`
// (0 cream .. 1 storm) is still the one number the hotel and Cloudia share.

const INK = kidPaintTheme.ink;
const CREAM = kidPaintTheme.paper;
const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Burst-shaped step (the kit's burst curve, 0 → 1 over `frames`). */
const stepAt = (frame: number, at: number, frames = 12) => 1 - Math.pow(1 - clamp01((frame - at) / frames), 3);

// ---------------------------------------------------------------------------
// Paint helpers
// ---------------------------------------------------------------------------

/** Full-frame SVG layer (scene px), overflow visible so pull-outs never show an edge. */
const Svg: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity }) => (
  <svg
    width={WIDTH}
    height={HEIGHT}
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity }}
  >
    {children}
  </svg>
);

function bboxOf(d: string) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const p of samplePath(d, 24)) {
    for (const [x, y] of p.pts) {
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    }
  }
  return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
}

/** One painted prop: pooled PaintFill + tapered ink outline. `id` must be unique on screen. */
const PShape: React.FC<{
  id: string;
  d: string;
  v: Value3;
  seed?: number;
  w?: [number, number];
  ink?: string;
  strength?: number;
  bleed?: boolean;
  opacity?: number;
  thickAt?: number;
}> = ({ id, d, v, seed = 1, w = [6, 2], ink, strength, bleed = true, opacity, thickAt }) => (
  <g opacity={opacity}>
    <PaintFill id={id} shape={<path d={d} />} bbox={bboxOf(d)} v={v} seed={seed} strength={strength} bleed={bleed} />
    {w[0] > 0 ? <path d={outlinePath(d, w[0], w[1], seed, { thickAt })} fill={ink ?? v.line} /> : null}
  </g>
);

const circleD = (cx: number, cy: number, r: number) =>
  `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
const ellipseD = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;

const V = {
  plum: threeValues("#6b4f7a", "#3d2a4e", { tame: 0.05 }),
  tomato: threeValues(kidTheme.tomato, "#a3322b", { tame: 0.08 }),
  pink: kidPaintTheme.pink,
  pinkDeep: threeValues(kidTheme.pinkDeep, "#7a2350", { tame: 0.08 }),
  brass: threeValues(kidTheme.sun, kidTheme.sunDeep, { tame: 0.1, lightMix: 0.35 }),
  bronze: threeValues(kidTheme.sunDark, "#8a4a14", { tame: 0.12 }),
  wood: threeValues("#8e4f34", "#4a2a20", { tame: 0.04 }),
  creamCard: { base: "#eadcc0", shadow: "#b9a888", light: CREAM, line: "#5a4a3a" } as Value3,
  paperCard: { base: "#e9d2a6", shadow: "#b8945e", light: "#f1e2c4", line: "#7a5a34" } as Value3,
  steel: threeValues("#9aa6b4", "#55606e", { tame: 0.05 }),
  dust: { base: "#6c7280", shadow: "#454b58", light: "#9aa1ab", line: INK } as Value3,
  water: kidPaintTheme.water,
  /** The guests en masse: a touch tamer than Drip, so the hero stays the bluest thing in frame. */
  guest: threeValues(kidTheme.water, kidTheme.waterDeep, { tame: 0.55 }),
  glass: { base: "#cfe6ee", shadow: "#8fb6c8", light: CREAM, line: INK } as Value3,
  lit: { base: "#f2c46a", shadow: "#d9963e", light: "#f6dc9a", line: "#5a3f22" } as Value3,
  sky: threeValues("#7fb8e6", "#3f78b0", { tame: 0.05 }),
  marble: threeValues("#6a5aa8", "#2e2456", { tame: 0.04 }),
};

/** Cloud paint at a greyness, 0 cream .. 1 storm — Cloudia's own ramp, so building and manager agree. */
function cloudV(g: number): Value3 {
  const c = kidPaintTheme.cloud;
  return {
    base: mixHex(c.base, "#7c8798", g * 0.9),
    shadow: mixHex(c.shadow, "#3e4658", g),
    light: mixHex(CREAM, "#a9b0bd", g * 0.85),
    line: mixHex(c.line, "#262b38", g),
  };
}

// ---------------------------------------------------------------------------
// PaintedCloud — ep 1's CloudBlob, re-pictured
// ---------------------------------------------------------------------------

/**
 * A union-of-circles cloud. Ink ribbons go round EVERY puff first and the
 * pooled fill goes over them, so interior seams vanish and only the outside
 * half of each ribbon survives as one tapered silhouette line (ep 1's
 * stroke-then-fill trick, with paint). `line={0}` = no ink (mist).
 */
const PaintedCloud: React.FC<{
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  grey?: number;
  seed?: number;
  droop?: number;
  opacity?: number;
  line?: number;
  strength?: number;
}> = ({ id, x, y, w, h, grey = 0, seed = 0, droop = 0, opacity = 1, line = 7, strength = 1 }) => {
  const v = cloudV(grey);
  const n = Math.max(3, Math.round(w / (h * 0.62)));
  const puffs = Array.from({ length: n }, (_, i) => {
    const u = n === 1 ? 0.5 : i / (n - 1);
    const r = h * (0.3 + 0.17 * Math.abs(Math.sin((i + seed) * 2.71)));
    return { cx: (u - 0.5) * (w - r * 1.4), cy: -h * 0.1 + Math.sin((i + seed) * 1.31) * h * 0.1 - r * 0.2, r };
  });
  const slab = { x: -w / 2 + h * 0.1, y: -h * 0.06, w: w - h * 0.2, h: h * 0.5 };
  const lobes = [-0.4, -0.14, 0.14, 0.4].map((u, i) => ({
    cx: u * slab.w,
    cy: slab.y + slab.h * 0.74 + droop * (30 + 22 * Math.abs(Math.sin(i + seed))),
    r: h * (0.15 + 0.05 * Math.abs(Math.sin(i * 2.3 + seed))) * (1 + droop * 0.3),
  }));
  const circles = [...lobes, ...puffs];
  const slabD = roundRectPath(slab.x, slab.y, slab.w, slab.h, slab.h / 2);
  const ink =
    line > 0
      ? [
          outlinePath(slabD, line, line * 0.3, seed * 7 + 1, { thickAt: Math.PI / 2 }),
          ...circles.map((c, i) =>
            ribbon(circlePts(c.cx, c.cy, c.r, 40, seed + i), line, line * 0.3, seed * 13 + i, {
              closed: true,
              thickAt: Math.PI / 2,
            }),
          ),
        ].join(" ")
      : "";
  const top = Math.min(...puffs.map((p) => p.cy - p.r));
  const bottom = Math.max(slab.y + slab.h, ...lobes.map((l) => l.cy + l.r));
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      {ink ? <path d={ink} fill={v.line} /> : null}
      <PaintFill
        id={id}
        shape={
          <>
            <path d={slabD} />
            {circles.map((c, i) => (
              <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
            ))}
          </>
        }
        bbox={{ x: -w / 2, y: top, w, h: bottom - top }}
        v={v}
        seed={seed + 3}
        bleed={false}
        strength={strength}
      />
    </g>
  );
};

// ---------------------------------------------------------------------------
// PaintedDrops — the guests (ep 1's DropSwarm / Blobby, one PaintFill for all)
// ---------------------------------------------------------------------------

const DROP_UNIT_D = "M 0 -62 C 11 -38 38 -18 38 6 A 38 38 0 0 1 -38 6 C -38 -18 -11 -38 0 -62 Z";
const DROP_UNIT_PTS: Pt[] = samplePath(DROP_UNIT_D, 7)[0].pts;
const dropD = (x: number, y: number, s: number) =>
  `M ${x} ${y - 62 * s} C ${x + 11 * s} ${y - 38 * s} ${x + 38 * s} ${y - 18 * s} ${x + 38 * s} ${y + 6 * s}` +
  ` A ${38 * s} ${38 * s} 0 0 1 ${x - 38 * s} ${y + 6 * s}` +
  ` C ${x - 38 * s} ${y - 18 * s} ${x - 11 * s} ${y - 38 * s} ${x} ${y - 62 * s} Z`;

type DropSpec = { x: number; y: number; s: number; mood?: number; look?: number };

const PaintedDrops: React.FC<{
  id: string;
  drops: DropSpec[];
  v?: Value3;
  opacity?: number;
  faces?: boolean;
  seed?: number;
}> = ({ id, drops, v = V.water, opacity = 1, faces = true, seed = 5 }) => {
  if (drops.length === 0) return null;
  const d = drops.map((p) => dropD(p.x, p.y, p.s)).join(" ");
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const p of drops) {
    x0 = Math.min(x0, p.x - 40 * p.s);
    x1 = Math.max(x1, p.x + 40 * p.s);
    y0 = Math.min(y0, p.y - 64 * p.s);
    y1 = Math.max(y1, p.y + 46 * p.s);
  }
  const ink = drops
    .map((p, i) => {
      const w0 = Math.max(1.8, 6 * p.s);
      return ribbon(
        DROP_UNIT_PTS.map(([ux, uy]) => [p.x + ux * p.s, p.y + uy * p.s] as Pt),
        w0,
        w0 * 0.35,
        seed + i,
        { closed: true, thickAt: Math.PI / 2, jitter: 0.4 },
      );
    })
    .join(" ");
  const eyes = faces
    ? drops
        .map((p) => {
          const lx = (p.look ?? 0) * 5 * p.s;
          const r = 5.5 * p.s;
          return `${circleD(p.x - 13 * p.s + lx, p.y - 2 * p.s, r)} ${circleD(p.x + 13 * p.s + lx, p.y - 2 * p.s, r)}`;
        })
        .join(" ")
    : "";
  const mouths = faces
    ? drops
        .map((p) => {
          const s = p.s;
          if ((p.mood ?? 0) === 1) return circleD(p.x, p.y + 20 * s, 5 * s);
          return `M ${p.x - 12 * s} ${p.y + 16 * s} Q ${p.x} ${p.y + 31 * s} ${p.x + 12 * s} ${p.y + 16 * s} Q ${p.x} ${p.y + 23 * s} ${p.x - 12 * s} ${p.y + 16 * s} Z`;
        })
        .join(" ")
    : "";
  return (
    <g opacity={opacity}>
      <PaintFill id={id} shape={<path d={d} />} bbox={{ x: x0, y: y0, w: x1 - x0, h: y1 - y0 }} v={v} seed={seed} bleed={false} />
      <path d={ink} fill={v.line} />
      {faces ? <path d={`${eyes} ${mouths}`} fill={INK} /> : null}
    </g>
  );
};

/** A churning grid of guests (ep 1's DropSwarm maths), as DropSpecs. */
function swarm(
  t: number,
  cx: number,
  cy: number,
  halfW: number,
  halfH: number,
  spacing: number,
  scale: number,
  churn = 1,
): DropSpec[] {
  const cols = Math.ceil((halfW * 2) / spacing);
  const rows = Math.ceil((halfH * 2) / spacing);
  const out: DropSpec[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const jx = Math.sin(i * 12.9898) * spacing * 0.34;
      const jy = Math.cos(i * 7.233) * spacing * 0.3;
      out.push({
        x: cx - halfW + c * spacing + spacing / 2 + jx + Math.sin(t * 0.55 + i) * 11 * churn,
        y: cy - halfH + r * spacing + spacing / 2 + jy + Math.cos(t * 0.47 + i * 1.7) * 9 * churn + Math.sin(t * 2.4 + i * 0.83) * 5,
        s: scale * (0.84 + 0.3 * Math.abs(Math.sin(i * 4.1))),
        mood: i % 4 === 0 ? 1 : 0,
        look: Math.sin(i * 2.2),
      });
    }
  }
  return out;
}

/** A plate darkened toward `color` through its own alpha (the hotel greying, no live filter). */
const PlateTint: React.FC<{ k: PlateKey; color: string; opacity: number; y?: number }> = ({ k, color, opacity, y = 0 }) => {
  if (opacity <= 0.003) return null;
  const url = `url(${staticFile(PLATES[k].src)})`;
  return (
    <div
      style={{
        position: "absolute",
        left: -WIDTH * 0.1,
        top: -HEIGHT * 0.1 + y,
        width: WIDTH * 1.2,
        height: HEIGHT * 1.2,
        background: color,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: "cover",
        maskSize: "cover",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        mixBlendMode: "multiply",
        opacity,
      }}
    />
  );
};

type Pool = { x: number; y: number; r: number; ry?: number; color: string; opacity: number };

/**
 * The room's light, over the whole picture and under the bubbles: a multiply
 * `tint` (the cloud hotel is not lit like open sky — the plates are high-key
 * cream, the bible's interior band is mid-dark and saturated), `darks`
 * (multiply soft pools: corners, the floor under the deck, the storm's belly)
 * and `pools` (screen soft pools: the lamp, the arch, Sunny). The pools are what
 * tint Drip warm wherever he stands in one (ACT note 1).
 */
const Room: React.FC<{ tint: string; opacity?: number; darks?: Pool[]; pools?: Pool[] }> = ({
  tint,
  opacity = 1,
  darks = [],
  pools = [],
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply", opacity }} />
    {darks.map((d, i) => (
      <div
        key={`d${i}`}
        style={{
          position: "absolute",
          left: d.x - d.r,
          top: d.y - (d.ry ?? d.r),
          width: d.r * 2,
          height: (d.ry ?? d.r) * 2,
          background: softRadial(d.color),
          mixBlendMode: "multiply",
          opacity: d.opacity,
        }}
      />
    ))}
    {pools.map((p, i) => (
      <LightPool key={`p${i}`} x={p.x} y={p.y} r={p.r} ry={p.ry} color={p.color} opacity={p.opacity} />
    ))}
  </AbsoluteFill>
);

const WARM = "#ffbe5c";
const DUSK = "#1e1838";
/** The lobby's room light: rose-violet multiply, dark corners (s14–s18 share it). */
const LOBBY_TINT = "#b0bcee";
const LOBBY_DARKS: Pool[] = [
  { x: 0, y: 1080, r: 900, ry: 620, color: DUSK, opacity: 1 },
  { x: 1920, y: 1080, r: 900, ry: 620, color: DUSK, opacity: 1 },
  { x: 0, y: 0, r: 700, ry: 460, color: DUSK, opacity: 0.7 },
  { x: 1920, y: 0, r: 700, ry: 460, color: DUSK, opacity: 0.7 },
];
/** The amber arch of the lobby plate: one warm pool evens its red→yellow ramp into one amber. */
const ARCH_POOL: Pool = { x: 960, y: 430, r: 460, ry: 540, color: WARM, opacity: 1 };

/** The lobby's pastel column plate, shaded into the re-rolled dusk lobby's violet (on its own plane). */
const ColumnShade: React.FC = () => <PlateTint k="hotel_mid_columns" color="#5a4a8e" opacity={0.85} />;

/** Bubbles placed for a camera that is not identity (characters on the 1.0 plane). */
const projectCast = (cam: Cam, cast: Cast): Cast =>
  Object.fromEntries(Object.entries(cast).map(([k, m]) => [k, m ? projectMark(cam, m) : m])) as Cast;

/** A decaying shake (the s14 stamp thud), as a camera delta. */
function shake(frame: number, at: number, px: number, frames = 12): CamDelta {
  const u = frame - at;
  if (u < 0 || u > frames) return {};
  const k = 1 - u / frames;
  return { dx: Math.sin(u * 2.3) * px * 0.5 * k, dy: Math.cos(u * 2.9) * px * k };
}

// ---------------------------------------------------------------------------
// Scene 12 — Up through the layers (STEPPED rise, D12 Q3)
// ---------------------------------------------------------------------------

const S12_DRIP_X = 1180;
const S12_DRIP_Y = stand("drip", 760);
const S12_BUBBLES: Record<string, string> = {
  a2_02_drip: "Why is it so COLD?",
  a2_04_drip: "I'm getting droppy again!",
};
/** "Past the birds / Past the airplanes / Up where" — word starts in a2_01 (silencedetect: 1.17 s, 2.28 s, 3.67 s). */
const S12_STEP_U = [35 / 175, 68 / 175, 110 / 175];

const LayersScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const steps = S12_STEP_U.map((u) => atLine(scene, "a2_01_narrator", u));
  const k = steps.reduce((s, at) => s + stepAt(frame, at), 0);
  const [coldFrom] = lineWindow(scene, "a2_02_drip");
  const [explainFrom] = lineWindow(scene, "a2_03_narrator");
  const [droppyFrom] = lineWindow(scene, "a2_04_drip");
  const dripSpeaking = useSpeaking(scene, "drip");

  const chill = interpolate(frame, [coldFrom - 20, explainFrom + 60], [0.25, 1], CLAMP);
  const shiverAmp = chill * 4;
  const shakeX = Math.sin(t * 21) * shiverAmp + Math.sin(t * 33) * shiverAmp * 0.4;
  const shakeY = Math.cos(t * 27) * shiverAmp * 0.5;
  let emotion: Emotion = frame < coldFrom - 8 ? "amazed" : "grumpy";
  if (frame >= explainFrom + 12 && frame < droppyFrom - 12) emotion = "scared";
  else if (frame >= droppyFrom - 12) emotion = "amazed";
  const hugging = frame >= coldFrom - 8 && frame < droppyFrom - 12;
  const droppy = interpolate(frame, [droppyFrom - 10, droppyFrom + 46], [0, 1], CLAMP);

  const cam = remasterCam(frame, {
    base: { x: 960, y: 640 },
    bursts: steps.map((at) => ({ at, delta: { dy: 26 } })),
  });
  const mark: Mark = { x: S12_DRIP_X, y: S12_DRIP_Y, scale: 1, who: "drip", side: "left" };

  // Altitude per plane per step: the far wisps barely move, the 0.4 plane's
  // set-pieces (sea, boats, gulls, the airliner) pass right through the frame.
  const skyY = interpolate(k, [0, 3], [-2650, -60]);
  const farY = -60 + k * 150;
  const midY = -820 + k * 430;
  const sea = 330 + k * 760;
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.layers.climb}
        cam={cam}
        skyFit="width"
        offsets={{ sky: skyY, far: farY, mid: midY }}
        // Polish (act-2 L1): act 1's paper multiply over the otherwise smooth gradient sky.
        sky={<PaperWash opacity={0.32} />}
        far={
          <Svg>
            {/* High cirrus: at this height clouds are streaks, not puffs. */}
            {[0, 1, 2, 3].map((i) => {
              const y = -620 + i * 120 + k * 260;
              const x0 = -100 + i * 470 + Math.sin(t * 0.2 + i) * 30;
              const pts: Pt[] = [
                [x0, y],
                [x0 + 260, y - 22],
                [x0 + 560, y - 10],
                [x0 + 820, y + 8],
              ];
              return <path key={i} d={ribbon(pts, 16 - (i % 2) * 5, 3, 120 + i)} fill={CREAM} opacity={0.55} />;
            })}
          </Svg>
        }
        mid={
          <>
            <Plate k="ocean_mid_morning" y={sea} />
            <Svg>
              {k < 1.6 ? (
                <>
                  <Boat id="s12-boat1" x={520} y={sea + 700} s={0.9} />
                  <Boat id="s12-boat2" x={1420} y={sea + 690} s={0.6} />
                </>
              ) : null}
              {[
                { x: 360, y: 430, s: 1 },
                { x: 820, y: 330, s: 0.75 },
                { x: 1560, y: 470, s: 0.9 },
                { x: 640, y: 560, s: 0.6 },
              ].map((g, i) => (
                <Gull key={i} x={g.x + Math.sin(t * 0.7 + i) * 50} y={g.y + k * 820} s={g.s} phase={i * 1.7} />
              ))}
              {k > 0.3 && k < 2.8 ? (
                <Airliner id="s12-plane" x={1500 - (frame - steps[1]) * 2.2} y={-560 + k * 760} />
              ) : null}
            </Svg>
          </>
        }
        stage={
          <>
            <PaintedDrip
              id={scene.id}
              x={S12_DRIP_X + shakeX}
              y={S12_DRIP_Y + shakeY}
              scale={1}
              emotion={emotion}
              speaking={dripSpeaking}
              phase={PHASE.drip}
              idle={1.3}
              pose={hugging ? "clutch" : undefined}
              look={k < 1 ? "down" : "up"}
            />
            {droppy > 0.05 ? <DroppySparks x={S12_DRIP_X} y={midOf("drip", S12_DRIP_Y, 1)} u={droppy} /> : null}
          </>
        }
      />
      {/* Thin blue: the sky deepens overhead as the air runs out; the overhead key pools on Drip. */}
      <Room
        tint="#acc0e8"
        darks={[
          { x: 960, y: 0, r: 1800, ry: 720, color: "#0a1236", opacity: 1 },
          { x: 0, y: 0, r: 800, ry: 600, color: "#0a1236", opacity: 0.8 },
          { x: 1920, y: 0, r: 800, ry: 600, color: "#0a1236", opacity: 0.8 },
          { x: 0, y: 1080, r: 700, ry: 420, color: "#1c2a5a", opacity: 0.6 },
          { x: 1920, y: 1080, r: 700, ry: 420, color: "#1c2a5a", opacity: 0.6 },
        ]}
        pools={[
          { x: S12_DRIP_X, y: 400, r: 700, ry: 600, color: "#fff0d2", opacity: 0.6 },
          { x: 520, y: 820, r: 700, ry: 420, color: "#eef0f2", opacity: 0.55 },
        ]}
      />
      <Gauge x={1800} y={560} level={interpolate(k + chill * 0.6, [0, 3.6], [0.82, 0.1], CLAMP)} />
      <Bubbles scene={scene} cast={projectCast(cam, { drip: mark })} text={S12_BUBBLES} />
    </AbsoluteFill>
  );
};

const Boat: React.FC<{ id: string; x: number; y: number; s: number }> = ({ id, x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <PShape id={`${id}-hull`} d="M -86 0 L 86 0 L 58 42 L -58 42 Z" v={V.tomato} w={[6, 2]} seed={3} />
    <path d={ribbon([[0, -4], [1, -56], [0, -106]], 7, 3, 11)} fill={INK} />
    <PShape id={`${id}-sail`} d="M 8 -100 L 70 -14 L 8 -14 Z" v={V.creamCard} w={[5, 1.6]} seed={4} />
  </g>
);

const Gull: React.FC<{ x: number; y: number; s: number; phase: number }> = ({ x, y, s, phase }) => {
  const frame = useCurrentFrame();
  const flap = Math.sin(frame / 4 + phase) * 12;
  const pts: Pt[] = [
    [-66, 2],
    [-33, -30 - flap],
    [0, 0],
    [33, -30 - flap],
    [66, 2],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={ribbon(pts, 9, 2.5, 40 + Math.round(phase * 10))} fill={INK} />
    </g>
  );
};

/** "Past the airplanes": one chunky airliner seen from below, painted. */
const Airliner: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => (
  <g transform={`translate(${x} ${y}) scale(0.8)`}>
    <PShape id={`${id}-w1`} d="M -40 -8 L 40 -8 L 190 -96 L 120 -96 Z" v={V.steel} w={[6, 2]} seed={21} />
    <PShape id={`${id}-w2`} d="M -40 8 L 40 8 L 190 96 L 120 96 Z" v={V.steel} w={[6, 2]} seed={22} />
    <PShape id={`${id}-tail`} d="M -196 -6 L -150 -6 L -206 -90 L -240 -90 Z" v={V.sky} w={[6, 2]} seed={23} />
    <PShape id={`${id}-body`} d={ellipseD(0, 0, 230, 46)} v={V.creamCard} w={[7, 2.5]} seed={24} />
    {[-120, -60, 0, 60, 120].map((wx) => (
      <circle key={wx} cx={wx} cy={-8} r={11} fill={kidTheme.waterDark} />
    ))}
  </g>
);

/** Condensation beading on Drip: he is turning back into a drop. */
const DroppySparks: React.FC<{ x: number; y: number; u: number }> = ({ x, y, u }) => {
  const frame = useCurrentFrame();
  const drops: DropSpec[] = Array.from({ length: 7 }, (_, i) => {
    const ang = (i / 7) * Math.PI * 2 + frame / 60;
    const r = 160 + Math.sin(frame / 12 + i) * 14;
    return { x: x + Math.cos(ang) * r * 1.1, y: y + Math.sin(ang) * r * 0.85, s: (0.22 + (i % 3) * 0.06) * u };
  });
  return (
    <Svg>
      <PaintedDrops id="s12-sparks" drops={drops} faces={false} opacity={0.85} />
    </Svg>
  );
};

/** The side gauge on the right edge, falling with altitude. Painted tube, bulb and ticks. */
const Gauge: React.FC<{ x: number; y: number; level: number }> = ({ x, y, level }) => {
  const tubeH = 420;
  const top = y - tubeH / 2;
  const fillH = (tubeH - 40) * clamp01(level);
  return (
    <Svg>
      <PShape id="s12-gauge-tube" d={roundRectPath(x - 30, top, 60, tubeH, 30)} v={V.glass} w={[6, 2]} seed={61} />
      <rect x={x - 14} y={top + tubeH - 20 - fillH} width={28} height={fillH + 20} rx={14} fill={V.tomato.base} />
      <PShape id="s12-gauge-bulb" d={circleD(x, top + tubeH + 26, 46)} v={V.tomato} w={[6, 2]} seed={62} />
      <path
        d={[0, 1, 2, 3, 4].map((i) => ribbon([[x + 32, top + 60 + i * 72], [x + 58, top + 60 + i * 72]], 5, 2, 63 + i)).join(" ")}
        fill={INK}
      />
      <text
        x={x}
        y={top - 22}
        textAnchor="middle"
        fontFamily={kidTheme.fontFamily}
        fontSize={kidType.min}
        fontWeight={900}
        fill={CREAM}
        stroke={INK}
        strokeWidth={6}
        paintOrder="stroke"
      >
        COLD
      </text>
    </Svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 13 — The Cloud Hotel
// ---------------------------------------------------------------------------

const S13_GROUND = 960;
const S13_DOOR_X = 960;
const S13_CLOUDIA: Mark = { x: 360, y: stand("cloudia", S13_GROUND), scale: 0.95, who: "cloudia", side: "right" };
const S13_DRIP = { x: 1640, y: stand("drip", 985), scale: 0.6 };

const CloudHotelScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const mist = lineProgress(scene, "a2_05_narrator", frame);
  const [, doorTo] = lineWindow(scene, "a2_05_narrator");
  const [cloudiaFrom] = lineWindow(scene, "a2_06_cloudia");
  const enterAt = Math.max(0, cloudiaFrom - 22);
  const bell = frame - (enterAt + 10);
  const cloudiaSpeaking = useSpeaking(scene, "cloudia");
  const dripEmotion = useEmotion(scene, "drip", {}, "amazed");
  const cam = remasterCam(frame, { base: { x: 960, y: 700 } });
  const dripMid = { x: S13_DRIP.x, y: midOf("drip", S13_DRIP.y, S13_DRIP.scale) };
  const mistFade = interpolate(mist, [0.2, 0.95], [1, 0], CLAMP);
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.hotel.noon}
        cam={cam}
        offsets={{ sky: -260, far: 40, mid: 120 }}
        hide={["fg"]}
        stage={
          <>
            <Svg>
              {/* The terrace they stand on: the cloud deck, painted on the 1.0 plane. */}
              <PaintedCloud id="s13-deck" x={900} y={S13_GROUND + 150} w={2600} h={330} seed={5} line={8} />
              <Doorway id="s13-door" x={S13_DOOR_X} groundY={S13_GROUND} />
              <Doorman id="s13-doorman" x={S13_DOOR_X + 440} groundY={S13_GROUND} />
              <Bell id="s13-bell" x={S13_DOOR_X + 250} y={S13_GROUND - 250} ring={bell} />
            </Svg>
            {/* Warm light from the doorway, pooling on the deck. */}
            <LightPool x={S13_DOOR_X} y={S13_GROUND - 40} r={520} ry={170} color="#ffd9a0" opacity={0.45} />
            <PaintedCloudia
              id={scene.id}
              x={S13_CLOUDIA.x}
              y={S13_CLOUDIA.y}
              scale={S13_CLOUDIA.scale}
              fill={0}
              clipboard
              emotion="proud"
              speaking={cloudiaSpeaking}
              phase={PHASE.cloudia}
              enter={{ at: enterAt, kind: "slideRight" }}
              groundY={frame >= enterAt + 8 ? S13_GROUND : undefined}
              look={lookAt({ x: S13_CLOUDIA.x, y: midOf("cloudia", S13_CLOUDIA.y, S13_CLOUDIA.scale) }, dripMid, 900)}
            />
          </>
        }
        fg={
          <>
            <Plate k="hotel_fg_mist" opacity={0.7 * mistFade} />
            <MistBanks u={mist} />
          </>
        }
      />
      {/* Low cam under a giant softbox: the deck's belly and the bulk's underside go dark; the door glows. */}
      <Room
        tint="#8478f4"
        darks={[
          { x: 960, y: 1080, r: 1500, ry: 470, color: "#2a1866", opacity: 1 },
          { x: 0, y: 140, r: 820, ry: 680, color: "#1a2c8a", opacity: 0.9 },
          { x: 1920, y: 140, r: 820, ry: 680, color: "#1a2c8a", opacity: 0.9 },
        ]}
        pools={[
          { x: S13_DOOR_X, y: 760, r: 420, ry: 330, color: WARM, opacity: 0.55 },
          // Polish A2-2: the awning panels went one value deeper (pinkDeep) to hold under this softbox.
          { x: 960, y: 290, r: 1150, ry: 560, color: "#cadcff", opacity: 1 },
        ]}
      />
      {/* The sign hangs above the softbox glow, not under it (it washed out in the first pass).
          Polish A2-2: Drip too is drawn above the room's violet multiply (it turned him navy); the
          door's warm light reaches his camera-left (lit) side through its own small pool. */}
      <World cam={cam}>
        <Plane depth={1.0} flat>
          <Svg>
            <HotelSign id="s13-sign" x={S13_DOOR_X} y={150} from={Math.round(doorTo * 0.55)} />
          </Svg>
            <PaintedDrip
              id={scene.id}
              x={S13_DRIP.x}
              y={S13_DRIP.y}
              scale={S13_DRIP.scale}
              emotion={dripEmotion}
              phase={PHASE.drip}
              idle={0.9}
              groundY={985}
              look={lookAt(dripMid, { x: S13_DOOR_X, y: 300 }, 900)}
            />
          <LightPool x={S13_DRIP.x - 70} y={dripMid.y} r={120} ry={150} color={WARM} opacity={0.3} />
        </Plane>
      </World>
      <Bubbles
        scene={scene}
        cast={{ cloudia: S13_CLOUDIA }}
        text={{ a2_06_cloudia: "Welcome to the CLOUD HOTEL!" }}
        // Lower-left, below the awning line: the sign owns the top centre.
        at={{ a2_06_cloudia: { x: 600, y: 485, tail: "left", tailAt: 420 } }}
      />
    </AbsoluteFill>
  );
};

/** The grand doorway: arch, inner glow, doors, carpet, scalloped awning. */
const Doorway: React.FC<{ id: string; x: number; groundY: number }> = ({ id, x, groundY }) => {
  const w = 150;
  const top = groundY - 400;
  const arch = (inset: number) =>
    `M ${x - w + inset} ${groundY} L ${x - w + inset} ${top + w} A ${w - inset} ${w - inset} 0 0 1 ${x + w - inset} ${top + w} L ${x + w - inset} ${groundY} Z`;
  const bw = (w * 2.9) / 7;
  const panel = (i: number) => {
    const bx = x - w * 1.45 + i * bw;
    return `M ${bx} ${top - 70} L ${bx + bw} ${top - 70} L ${bx + bw} ${top + 6} Q ${bx + bw / 2} ${top + 48} ${bx} ${top + 6} Z`;
  };
  const pinkD = [0, 2, 4, 6].map(panel).join(" ");
  const creamD = [1, 3, 5].map(panel).join(" ");
  return (
    <g>
      <PShape id={`${id}-arch`} d={arch(0)} v={V.plum} w={[9, 3]} seed={71} />
      <path d={arch(24)} fill={V.lit.base} opacity={0.55} />
      <path d={ribbon([[x, top + 40], [x, (top + groundY) / 2], [x, groundY]], 6, 2, 72)} fill={INK} opacity={0.6} />
      <PShape id={`${id}-h1`} d={circleD(x - 38, groundY - 200, 13)} v={V.brass} w={[4, 1.5]} seed={73} />
      <PShape id={`${id}-h2`} d={circleD(x + 38, groundY - 200, 13)} v={V.brass} w={[4, 1.5]} seed={74} />
      <PShape id={`${id}-carpet`} d={roundRectPath(x - w - 70, groundY - 14, (w + 70) * 2, 26, 13)} v={V.tomato} w={[5, 2]} seed={75} />
      <PShape id={`${id}-awnP`} d={pinkD} v={V.pinkDeep} w={[5, 1.6]} seed={76} />
      <PShape id={`${id}-awnC`} d={creamD} v={V.creamCard} w={[5, 1.6]} seed={77} />
      <PShape id={`${id}-rail`} d={roundRectPath(x - w * 1.5, top - 84, w * 3, 28, 14)} v={V.plum} w={[6, 2]} seed={78} />
    </g>
  );
};

/** "A swirl of a doorman": a cloud wisp in a bellhop cap. */
const Doorman: React.FC<{ id: string; x: number; groundY: number }> = ({ id, x, groundY }) => {
  const frame = useCurrentFrame();
  const y = groundY - 180 + Math.sin(frame / 26) * 8;
  const v = cloudV(0.05);
  const blobs = [
    { cx: 20, cy: 30, r: 62 },
    { cx: -32, cy: 4, r: 38 },
    { cx: 44, cy: -42, r: 54 },
  ];
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={blobs.map((b, i) => ribbon(circlePts(b.cx, b.cy, b.r, 36, i), 7, 2, 80 + i, { closed: true })).join(" ")}
        fill={v.line}
      />
      <PaintFill
        id={`${id}-body`}
        shape={
          <>
            {blobs.map((b, i) => (
              <circle key={i} cx={b.cx} cy={b.cy} r={b.r} />
            ))}
          </>
        }
        bbox={{ x: -70, y: -96, w: 160, h: 190 }}
        v={v}
        seed={83}
        bleed={false}
      />
      <circle cx={28} cy={-48} r={7} fill={INK} />
      <circle cx={62} cy={-48} r={7} fill={INK} />
      <path d="M 30 -26 Q 46 -10 62 -26 Q 46 -18 30 -26 Z" fill={INK} />
      <PShape id={`${id}-cap`} d="M -2 -84 L 94 -84 L 86 -112 L 6 -112 Z" v={V.tomato} w={[5, 1.6]} seed={84} />
      <PShape id={`${id}-band`} d={roundRectPath(-6, -90, 104, 14, 7)} v={V.pinkDeep} w={[4, 1.4]} seed={85} />
    </g>
  );
};

/** Brass bell on a post. It rings when Cloudia sweeps in. */
const Bell: React.FC<{ id: string; x: number; y: number; ring: number }> = ({ id, x, y, ring }) => {
  const swing = ring > 0 && ring < 40 ? Math.sin(ring * 0.7) * 14 * Math.max(0, 1 - ring / 40) : 0;
  return (
    <g transform={`translate(${x} ${y})`}>
      <PShape id={`${id}-post`} d={roundRectPath(-14, 0, 28, 250, 14)} v={V.bronze} w={[6, 2]} seed={91} />
      <g transform={`rotate(${swing})`}>
        <PShape id={`${id}-dome`} d="M -58 -6 Q -58 -84 0 -84 Q 58 -84 58 -6 Z" v={V.brass} w={[7, 2.4]} seed={92} />
        <PShape id={`${id}-rim`} d={roundRectPath(-76, -14, 152, 26, 13)} v={V.brass} w={[6, 2]} seed={93} />
        <path d={ribbon([[0, -84], [-16, -100], [0, -118], [16, -100], [0, -84]], 7, 3, 94)} fill={INK} />
        <PShape id={`${id}-clap`} d={circleD(0, 26, 14)} v={V.bronze} w={[5, 1.6]} seed={95} />
      </g>
      {swing !== 0
        ? [-1, 1].map((s) => (
            <path
              key={s}
              d={ribbon([[s * 100, -70], [s * 122, -48], [s * 100, -26]], 8, 2, 96 + s)}
              fill={CREAM}
              opacity={Math.abs(swing) / 14}
            />
          ))
        : null}
    </g>
  );
};

/** The CLOUD HOTEL sign: a painted card on two chains, springing in. Top-centre; nothing sits above the awning line. */
const HotelSign: React.FC<{ id: string; x: number; y: number; from: number }> = ({ id, x, y, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 11, mass: 0.7 } });
  if (s <= 0.01) return null;
  // Polish A2-3 (D30): the canon board lives in lobbykit (s22 hangs the same one indoors).
  return <LobbySign id={id} x={x} y={y} scale={s} rotate={-2.5 + (1 - s) * 8} />;
};

/** Two banks of mist, parting on the narrator's sentence (fg 1.3, no ink: mist has no edge). */
const MistBanks: React.FC<{ u: number }> = ({ u }) => {
  const frame = useCurrentFrame();
  const shift = interpolate(u, [0, 1], [0, 1500], { easing: Easing.inOut(Easing.quad) });
  const fade = interpolate(u, [0.25, 0.95], [1, 0], CLAMP);
  if (fade <= 0.01) return null;
  return (
    <Svg opacity={fade}>
      <g transform={`translate(${-shift} ${Math.sin(frame / 50) * 12})`}>
        <PaintedCloud id="s13-mist1" x={340} y={520} w={1800} h={760} seed={11} line={0} opacity={0.94} strength={0.6} />
        <PaintedCloud id="s13-mist2" x={-140} y={880} w={1500} h={620} seed={13} line={0} opacity={0.9} strength={0.6} />
      </g>
      <g transform={`translate(${shift} ${Math.sin(frame / 42 + 2) * 12})`}>
        <PaintedCloud id="s13-mist3" x={1620} y={480} w={1800} h={780} seed={17} line={0} opacity={0.94} strength={0.6} />
        <PaintedCloud id="s13-mist4" x={2050} y={860} w={1500} h={620} seed={19} line={0} opacity={0.9} strength={0.6} />
      </g>
    </Svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 14 — Myth-bust: clouds are not pillows
// ---------------------------------------------------------------------------

const S14_SHELF_Y = 780;
const S14_SHELF_TOP = 650;
const S14_DRIP_X = 640;
const S14_FLOP = 196;
const S14_CONTACT = S14_FLOP + 22;
const S14_THROUGH = S14_CONTACT + 14;
const S14_OUT = S14_THROUGH + 18;
const S14_CLOUDIA: Mark = { x: 1400, y: stand("cloudia", S14_SHELF_TOP + 30), scale: 0.95, who: "cloudia", side: "left" };
const S14_BUBBLES: Record<string, string> = {
  a2_07_drip: "A giant fluffy pillow?",
  a2_08_cloudia: "A PILLOW? Absolutely not.",
};

const MythPillowScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  // The stamp lands after both bubbles are gone: on the narrator's first word.
  const stampAt = Math.max(S14_OUT + 2, atLine(scene, "a2_09_narrator", 0) + 4);
  const ground = interpolate(
    frame,
    [S14_FLOP, S14_CONTACT, S14_THROUGH, S14_OUT, S14_OUT + 40],
    [S14_SHELF_TOP, S14_SHELF_TOP + 20, S14_SHELF_TOP + 130, 1080, 1120],
    { ...CLAMP, easing: Easing.in(Easing.quad) },
  );
  const lean = interpolate(frame, [S14_FLOP, S14_CONTACT], [0, -18], CLAMP);
  const since = frame - S14_CONTACT;
  const squash = since >= 0 && since < 12 ? 1 - 0.22 * Math.max(0, 1 - since / 12) : 1;
  let emotion: Emotion = frame < S14_FLOP - 8 ? "excited" : "happy";
  if (frame >= S14_CONTACT - 6 && frame < S14_OUT + 60) emotion = "scared";
  else if (frame >= S14_OUT + 60) emotion = "grumpy";

  const cast: Cast = {
    drip: { x: S14_DRIP_X, y: stand("drip", S14_SHELF_TOP), scale: 1, who: "drip", side: "right" },
    cloudia: S14_CLOUDIA,
  };
  const cloudiaLook = useLookAtSpeaker(scene, cast, "cloudia", "left");
  const dripSpeaking = useSpeaking(scene, "drip");
  const cloudiaSpeaking = useSpeaking(scene, "cloudia");
  const cloudiaEmotion = useEmotion(scene, "cloudia", { a2_08_cloudia: "grumpy" }, "neutral");
  const cam = remasterCam(frame, { deltas: [shake(frame, stampAt, 14)] });
  // The shadow goes with him into the floor: full on the shelf, gone by the time he is through.
  const onShelf = frame < S14_THROUGH;
  const hole = interpolate(frame, [S14_CONTACT, S14_THROUGH], [0, 1], CLAMP);

  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.lobby.noon}
        cam={cam}
        hide={["fg"]}
        mid={<ColumnShade />}
        sky={<LightPool x={960} y={420} r={620} ry={460} color="#ffd9a0" opacity={0.35} />}
        stage={
          <>
            {/* Drip, drawn BEFORE the shelf: falling through it is literal. */}
            <AbsoluteFill
              style={{
                transformOrigin: `${S14_DRIP_X}px ${ground}px`,
                transform: `rotate(${frame < S14_CONTACT ? lean : interpolate(frame, [S14_THROUGH, S14_OUT + 30], [-18, 8], CLAMP)}deg) scale(${1 + (1 - squash) * 0.3}, ${squash})`,
              }}
            >
              <PaintedDrip
                id={scene.id}
                x={S14_DRIP_X}
                y={stand("drip", ground)}
                scale={1}
                emotion={emotion}
                speaking={dripSpeaking}
                phase={PHASE.drip}
                idle={frame > S14_CONTACT ? 1.4 : 0.8}
                pose={frame >= S14_CONTACT ? "clutch" : undefined}
                look={frame < S14_FLOP ? "upRight" : "camera"}
                groundY={onShelf ? S14_SHELF_TOP + (ground - S14_SHELF_TOP) * 0.2 : undefined}
              />
            </AbsoluteFill>
            <Svg>
              <PaintedCloud id="s14-shelf" x={700} y={S14_SHELF_Y} w={1900} h={250} seed={3} line={8} />
              {hole > 0 ? (
                <ellipse cx={S14_DRIP_X} cy={S14_SHELF_TOP + 34} rx={120 * hole} ry={26 * hole} fill="#4a4470" opacity={0.55} />
              ) : null}
              <PuffBurst x={S14_DRIP_X} y={S14_SHELF_TOP} at={S14_CONTACT} />
            </Svg>
            <PaintedCloudia
              id={scene.id}
              x={S14_CLOUDIA.x}
              y={S14_CLOUDIA.y}
              scale={S14_CLOUDIA.scale}
              fill={0}
              clipboard
              emotion={cloudiaEmotion}
              speaking={cloudiaSpeaking}
              phase={PHASE.cloudia}
              look={frame > S14_CONTACT ? "down" : cloudiaLook}
              groundY={S14_SHELF_TOP + 30}
              altitude={20}
            />
            {/* The lobby lamp's pool on the shelf, over both of them. */}
            <LightPool x={1000} y={S14_SHELF_TOP + 10} r={760} ry={200} color="#ffd9a0" opacity={0.4} />
          </>
        }
      />
      <Room
        tint={LOBBY_TINT}
        darks={[...LOBBY_DARKS, { x: 700, y: 1080, r: 1100, ry: 220, color: DUSK, opacity: 0.6 }]}
        pools={[
          ARCH_POOL,
          { x: 1000, y: S14_SHELF_TOP - 60, r: 760, ry: 260, color: WARM, opacity: 0.45 },
        ]}
      />
      <Foomp x={S14_DRIP_X - 330} y={S14_SHELF_TOP - 80} at={S14_CONTACT} />
      <CutFlash at={stampAt} strength={0.35} />
      <MythStamp at={stampAt} />
      <Bubbles
        scene={scene}
        cast={projectCast(cam, cast)}
        text={S14_BUBBLES}
        at={{
          a2_07_drip: { x: 1000, y: 230, tail: "left", tailAt: 820 },
          a2_08_cloudia: { x: 960, y: 230, tail: "right", tailAt: 1240 },
        }}
      />
    </AbsoluteFill>
  );
};

/** Cloud thrown up where he hit it — the only evidence it was ever solid. */
const PuffBurst: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const u = (frame - at) / 26;
  if (u < 0 || u > 1) return null;
  const v = cloudV(0);
  const puffs = Array.from({ length: 9 }, (_, i) => {
    const ang = Math.PI + (i / 8) * Math.PI;
    const d = 50 + u * (170 + (i % 3) * 60);
    return { cx: x + Math.cos(ang) * d * 1.5, cy: y + Math.sin(ang) * d * 0.7, r: (26 + (i % 4) * 12) * (1 - u * 0.4) };
  });
  return (
    <g opacity={1 - u}>
      {puffs.map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r={p.r} fill={v.base} />
          <path d={ribbon(circlePts(p.cx, p.cy, p.r, 28, i), 4, 1.2, 140 + i, { closed: true })} fill={v.line} />
        </g>
      ))}
    </g>
  );
};

const Foomp: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = frame - at;
  if (u < 0 || u > 40) return null;
  const s = spring({ frame: u, fps, config: { damping: 9, mass: 0.5 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s * (1 - Math.max(0, (u - 26) / 14))}) rotate(-9deg)`,
        fontFamily: kidTheme.fontFamily,
        fontSize: 96,
        fontWeight: 900,
        color: CREAM,
        textShadow: kidInkOutline(4.5),
        letterSpacing: 2,
        zIndex: 30,
      }}
    >
      foomp!
    </div>
  );
};

/** The MYTH stamp: thuds on at 3×, cracks along one jagged seam half a beat later (ep 1). */
const MythStamp: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const u = frame - at;
  if (u < 0) return null;
  const land = interpolate(u, [0, 9], [3.2, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const opacity = Math.min(1, u / 3);
  const crack = Math.max(0, Math.min(1, (u - 16) / 22));
  const seam = "50% 0%, 43% 26%, 57% 52%, 45% 76%, 51% 100%";
  const halves = [
    { clip: `polygon(0% 0%, ${seam}, 0% 100%)`, dx: -crack * 24, rot: -crack * 3 },
    { clip: `polygon(100% 0%, ${seam}, 100% 100%)`, dx: crack * 24, rot: crack * 3 },
  ];
  const red = mixHex(kidTheme.tomato, "#a3322b", 0.25);
  const face = (
    <div
      style={{
        border: `14px solid ${red}`,
        borderRadius: kidRadius.card,
        padding: "8px 20px 16px",
        background: "rgba(243,234,216,0.94)",
        textAlign: "center",
      }}
    >
      <div style={{ border: `7px solid ${red}`, borderRadius: kidRadius.chip, padding: "8px 30px" }}>
        <div style={{ fontSize: 116, fontWeight: 900, color: red, lineHeight: 1 }}>MYTH</div>
        <div style={{ fontSize: 48, fontWeight: 900, color: red, letterSpacing: 8 }}>BUSTED</div>
      </div>
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 960,
        top: 430,
        transform: `translate(-50%, -50%) scale(${land}) rotate(-11deg)`,
        opacity,
        zIndex: 55,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      {halves.map((h, i) => (
        <div
          key={i}
          style={{
            position: i === 0 ? "relative" : "absolute",
            inset: i === 0 ? undefined : 0,
            clipPath: h.clip,
            transform: `translateX(${h.dx}px) rotate(${h.rot}deg)`,
            filter: "drop-shadow(0 10px 0 rgba(43,42,51,0.25))",
          }}
        >
          {face}
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 15 — What a cloud actually is
// ---------------------------------------------------------------------------

const S15_FOCUS = { x: 930, y: 500 };
const S15_CLOUDIA: Mark = { x: 300, y: stand("cloudia", 1000), scale: 0.95, who: "cloudia", side: "right" };
const S15_DRIP = { x: 1650, y: stand("drip", 1020), scale: 0.8 };
const S15_BUBBLES: Record<string, string> = {
  a2_11_drip: "The hotel is the guests?",
  a2_12_cloudia: "You are the wallpaper, darling.",
};
/** a2_10 in two bubble chunks, each popping after its dive settles ("zillion" / "floating together"; gap at 3.02–3.38 s). */
const S15_CHUNK_SPLIT = 92 / 240;

const WhatACloudIsScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [zFrom, zTo] = lineWindow(scene, "a2_10_cloudia");
  const split = Math.round(zFrom + (zTo - zFrom) * S15_CHUNK_SPLIT);
  const dive1 = zFrom + 2;
  const dive2 = split;
  const b1 = stepAt(frame, dive1);
  const b2 = stepAt(frame, dive2);
  // The wall itself is the prop that dives: 1 → 1.9 → 3.3 on the two bursts.
  const z = 1 + 0.9 * b1 + 1.4 * b2;
  const resolved = interpolate(z, [1.3, 2.4], [0, 1], CLAMP);
  const cam = remasterCam(frame, {
    creep: { from: dive2 + 12 },
    bursts: [
      { at: dive1, delta: { zoom: 1.027 } },
      { at: dive2, delta: { zoom: 1.027 } },
    ],
  });
  const cast: Cast = { cloudia: S15_CLOUDIA, drip: { ...S15_DRIP, who: "drip", side: "left" } };
  const dripEmotion = useEmotion(scene, "drip", { a2_11_drip: "amazed" }, "happy");
  const dripLook = useLookAtSpeaker(scene, cast, "drip", "upLeft");
  const cloudiaLook = useLookAtSpeaker(scene, cast, "cloudia", "right");
  const dripSpeaking = useSpeaking(scene, "drip");
  const cloudiaSpeaking = useSpeaking(scene, "cloudia");
  // Drops whose zoomed screen position would land on a face are left out (the swarm is texture, never over a hero).
  const faces = [
    { x: S15_CLOUDIA.x, y: midOf("cloudia", S15_CLOUDIA.y, S15_CLOUDIA.scale ?? 1) },
    { x: S15_DRIP.x, y: midOf("drip", S15_DRIP.y, S15_DRIP.scale) },
  ];
  const drops =
    resolved > 0.01
      ? swarm(frame / fps, S15_FOCUS.x, S15_FOCUS.y, 520, 360, 56, 0.4, 1).filter((d) => {
          const sx = S15_FOCUS.x + (d.x - S15_FOCUS.x) * z;
          const sy = S15_FOCUS.y + (d.y - S15_FOCUS.y) * z;
          return faces.every((f) => Math.hypot(sx - f.x, sy - f.y) > 240);
        })
      : [];
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.lobby.noon}
        cam={cam}
        hide={["fg"]}
        mid={<ColumnShade />}
        offsets={{ mid: 0 }}
        stage={
          <>
            <Svg>
              <g transform={`translate(${S15_FOCUS.x} ${S15_FOCUS.y}) scale(${z}) translate(${-S15_FOCUS.x} ${-S15_FOCUS.y})`}>
                <PaintedDrops id="s15-swarm" drops={drops} opacity={resolved} v={V.guest} />
                <g opacity={1 - resolved}>
                  <PaintedCloud id="s15-wall1" x={S15_FOCUS.x - 60} y={S15_FOCUS.y - 20} w={1500} h={560} seed={3} />
                  <PaintedCloud id="s15-wall2" x={S15_FOCUS.x + 380} y={S15_FOCUS.y + 230} w={900} h={380} seed={7} />
                </g>
              </g>
              <PaintedCloud id="s15-floor" x={960} y={1150} w={2600} h={300} seed={5} />
            </Svg>
            {/* Interior glow from below the floor. */}
            <LightPool x={960} y={1010} r={1100} ry={260} color="#ffd9a0" opacity={0.42} />
            <PaintedCloudia
              id={scene.id}
              x={S15_CLOUDIA.x}
              y={S15_CLOUDIA.y}
              scale={S15_CLOUDIA.scale}
              fill={0}
              clipboard
              emotion="proud"
              speaking={cloudiaSpeaking}
              phase={PHASE.cloudia}
              look={cloudiaLook}
              groundY={1000}
              altitude={10}
            />
            <PaintedDrip
              id={scene.id}
              x={S15_DRIP.x}
              y={S15_DRIP.y}
              scale={S15_DRIP.scale}
              emotion={dripEmotion}
              speaking={dripSpeaking}
              phase={PHASE.drip}
              look={dripLook}
              groundY={1020}
            />
          </>
        }
      />
      <Room
        tint="#b6bbee"
        darks={LOBBY_DARKS}
        pools={[
          ARCH_POOL,
          { x: 960, y: 660, r: 360, ry: 220, color: "#ffd46a", opacity: 0.9 },
          { x: 960, y: 1060, r: 1100, ry: 320, color: "#ffe2b8", opacity: 0.5 },
          { x: S15_FOCUS.x, y: S15_FOCUS.y, r: 620, ry: 440, color: "#fff0d2", opacity: 0.35 },
          { x: S15_DRIP.x, y: 880, r: 320, ry: 280, color: WARM, opacity: 0.2 },
        ]}
      />
      {/* a2_10's two chunks (text unchanged in the voice; the bubble is a summary). */}
      <SpeechBubble x={720} y={760} text="A zillion tiny water drops!" tail="left" tailAt={470} from={dive1 + 12} until={split} background={kidPaintTheme.paper} />
      <SpeechBubble x={720} y={760} text="Floating together. No fluff!" tail="left" tailAt={470} from={dive2 + 12} until={zTo} background={kidPaintTheme.paper} />
      <Bubbles
        scene={scene}
        cast={projectCast(cam, cast)}
        text={S15_BUBBLES}
        at={{
          a2_11_drip: { x: 1380, y: 600, tail: "right", tailAt: 1600 },
          a2_12_cloudia: { x: 720, y: 760, tail: "left", tailAt: 470 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 16 — House rules: hug a speck of dust
// ---------------------------------------------------------------------------

const S16_GROUND = 990;
const S16_DRIP = { x: 1560, y: stand("drip", S16_GROUND) };
const S16_BOWL = { x: 960, y: 740 };
const S16_DESK_TOP = 780;
const S16_CLOUDIA: Mark = { x: 380, y: stand("cloudia", S16_DESK_TOP), scale: 0.95, who: "cloudia", side: "right" };
const S16_LAMP = { x: 1260, y: 230 };
const S16_BUBBLES: Record<string, string> = {
  a2_13_cloudia: "Every guest hugs a dust speck!",
  a2_14_drip: "Dust? Why dust?",
};

const DustRuleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [factFrom] = lineWindow(scene, "a2_15_narrator");
  const chain = lineProgress(scene, "a2_16_narrator", frame);
  const pickAt = factFrom + 56;
  const hugAt = pickAt + 26;
  const speckU = interpolate(frame, [pickAt, hugAt], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.quad) });
  const balloon = interpolate(frame, [hugAt + 4, hugAt + 40], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const scale = 1 + balloon * 0.22;
  const handsY = S16_GROUND - 262 * scale;
  const speckX = interpolate(speckU, [0, 1], [S16_BOWL.x + 30, S16_DRIP.x - 150 * scale]);
  const speckY = interpolate(speckU, [0, 1], [S16_BOWL.y - 50, handsY]) - Math.sin(speckU * Math.PI) * 90;
  const pose = frame >= pickAt - 10 ? "cheer" : undefined;
  const [whyFrom] = lineWindow(scene, "a2_14_drip");
  let dripEmotion: Emotion = "happy";
  if (frame >= whyFrom - 8) dripEmotion = "grumpy";
  if (frame >= pickAt - 10) dripEmotion = "amazed";
  if (frame >= hugAt + 4) dripEmotion = "excited";
  const cast: Cast = {
    drip: { ...S16_DRIP, scale, who: "drip", side: "left" },
    cloudia: S16_CLOUDIA,
  };
  const dripLook = useLookAtSpeaker(scene, cast, "drip", frame > pickAt - 20 ? "up" : "left");
  const cloudiaLook = useLookAtSpeaker(scene, cast, "cloudia", "right");
  const cloudiaEmotion = useEmotion(scene, "cloudia", { a2_13_cloudia: "proud" }, "happy");
  const dripSpeaking = useSpeaking(scene, "drip");
  const cloudiaSpeaking = useSpeaking(scene, "cloudia");
  const cam = remasterCam(frame);
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.lobby.noon}
        cam={cam}
        hide={["fg"]}
        mid={<ColumnShade />}
        stage={
          <>
            <Svg>
              <PaintedCloud id="s16-floor" x={960} y={S16_GROUND + 190} w={2700} h={420} seed={5} />
              <Lamp id="s16-lamp" x={S16_LAMP.x} y={S16_LAMP.y} />
              {/* Polish A2-3 (D30): the canon lobby desk + its lamp (lobbykit), shared with act 3's s22. */}
              <LobbyDesk id="s16-desk" x0={60} x1={720} top={S16_DESK_TOP} bottom={S16_GROUND + 30} label="FRONT DESK" labelX={390} />
              <LobbyLamp id="s16-desklamp" x={640} y={S16_DESK_TOP + 4} />
              <Pedestal id="s16-ped" x={S16_BOWL.x} groundY={S16_GROUND} bowlY={S16_BOWL.y} />
              <VelvetRope id="s16-rope" x0={1160} x1={1340} y={S16_GROUND - 10} />
            </Svg>
            <PaintedCloudia
              id={scene.id}
              x={S16_CLOUDIA.x}
              y={S16_CLOUDIA.y}
              scale={S16_CLOUDIA.scale}
              fill={0.06}
              clipboard
              emotion={cloudiaEmotion}
              speaking={cloudiaSpeaking}
              phase={PHASE.cloudia}
              look={cloudiaLook}
              groundY={S16_DESK_TOP + 8}
              altitude={16}
            />
            <AbsoluteFill
              style={{ transformOrigin: `${S16_DRIP.x}px ${S16_GROUND}px`, transform: `scale(1, ${1 + balloon * 0.02})` }}
            >
              <PaintedDrip
                id={scene.id}
                x={S16_DRIP.x}
                y={stand("drip", S16_GROUND)}
                scale={scale}
                emotion={dripEmotion}
                speaking={dripSpeaking}
                phase={PHASE.drip}
                pose={pose}
                idle={1 + balloon * 0.6}
                look={dripLook}
                groundY={S16_GROUND}
              />
            </AbsoluteFill>
            {frame >= pickAt - 4 ? (
              <Svg>
                <Speck id="s16-speck" x={speckX} y={speckY} r={22} glow={balloon} />
              </Svg>
            ) : null}
            {balloon > 0.02 && balloon < 0.99 ? (
              <Svg>
                <path
                  d={ribbon(circlePts(S16_DRIP.x, midOf("drip", S16_DRIP.y, scale), 90 + balloon * 200, 48), 18 * (1 - balloon) + 2, 4, 160, { closed: true })}
                  fill={kidTheme.waterLight}
                  opacity={0.7 * (1 - balloon)}
                />
              </Svg>
            ) : null}
            {/* The lamp's pool: over the bowl and Drip, tinting him warm. */}
          </>
        }
      />
      <Room
        tint={LOBBY_TINT}
        darks={LOBBY_DARKS}
        pools={[
          ARCH_POOL,
          { x: S16_LAMP.x - 120, y: 720, r: 700, ry: 400, color: WARM, opacity: 0.42 },
          { x: S16_CLOUDIA.x, y: 620, r: 380, ry: 300, color: "#fff0d2", opacity: 0.3 },
          // The desk lamp's pool on the desk top and Cloudia's camera-right side.
          { x: 620, y: S16_DESK_TOP - 40, r: 260, ry: 150, color: WARM, opacity: 0.5 },
        ]}
      />
      <ChainCards u={chain} />
      <Bubbles
        scene={scene}
        cast={projectCast(cam, cast)}
        text={S16_BUBBLES}
        at={{
          a2_13_cloudia: { x: 560, y: 250, tail: "left", tailAt: 430 },
          a2_14_drip: { x: 1440, y: 360, tail: "right", tailAt: 1560 },
        }}
      />
    </AbsoluteFill>
  );
};

/** A hanging lamp: ribbon cord, painted brass shade, cream bulb. */
const Lamp: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => (
  <g>
    <path d={ribbon([[x, -40], [x + 1, y * 0.4], [x - 1, y * 0.75], [x, y - 28]], 4, 1.5, 170)} fill={INK} />
    <PShape id={`${id}-shade`} d={`M ${x - 80} ${y + 34} Q ${x} ${y - 78} ${x + 80} ${y + 34} Z`} v={V.brass} w={[6, 2]} seed={171} />
    <ellipse cx={x} cy={y + 36} rx={38} ry={10} fill={CREAM} />
  </g>
);

/** A bowl of dust specks by the door, like complimentary mints. */
const Pedestal: React.FC<{ id: string; x: number; groundY: number; bowlY: number }> = ({ id, x, groundY, bowlY }) => {
  const specks = Array.from({ length: 11 }, (_, i) => ({
    cx: x - 84 + (i % 6) * 34 + (i > 5 ? 17 : 0),
    cy: bowlY - 40 - Math.floor(i / 6) * 24,
  }));
  return (
    <g>
      <PShape id={`${id}-col`} d={roundRectPath(x - 24, bowlY + 60, 48, groundY - bowlY - 60, 10)} v={V.bronze} w={[6, 2]} seed={191} />
      <PShape id={`${id}-base`} d={ellipseD(x, groundY, 92, 20)} v={V.bronze} w={[6, 2]} seed={192} />
      {specks.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={13} fill={i % 3 ? V.dust.base : V.dust.light} />
      ))}
      <path d={specks.map((s, i) => ribbon(circlePts(s.cx, s.cy, 13, 18, i), 3, 1, 193 + i, { closed: true })).join(" ")} fill={INK} />
      <PShape
        id={`${id}-bowl`}
        d={`M ${x - 120} ${bowlY - 34} A 120 96 0 0 0 ${x + 120} ${bowlY - 34} Z`}
        v={V.glass}
        w={[6, 2]}
        seed={194}
        opacity={0.8}
      />
      <path d={ribbon(circlePts(x, bowlY - 34, 1, 40).map(([px, py]) => [x + (px - x) * 120, bowlY - 34 + (py - bowlY + 34) * 20] as Pt), 5, 1.6, 195, { closed: true })} fill={INK} />
      <g transform={`translate(${x} ${bowlY + 110})`}>
        <PShape id={`${id}-card`} d={roundRectPath(-140, -30, 280, 60, 30)} v={V.creamCard} w={[6, 2]} ink={INK} seed={196} />
        <text x={0} y={15} textAnchor="middle" fontFamily={kidTheme.fontFamily} fontSize={kidType.min} fontWeight={900} fill={INK}>
          TAKE ONE
        </text>
      </g>
    </g>
  );
};

const VelvetRope: React.FC<{ id: string; x0: number; x1: number; y: number }> = ({ id, x0, x1, y }) => (
  <g>
    {[x0, x1].map((x, i) => (
      <g key={x}>
        <PShape id={`${id}-p${i}`} d={roundRectPath(x - 13, y - 200, 26, 200, 13)} v={V.bronze} w={[5, 1.6]} seed={201 + i} />
        <PShape id={`${id}-b${i}`} d={ellipseD(x, y, 56, 14)} v={V.bronze} w={[5, 1.6]} seed={203 + i} />
        <PShape id={`${id}-k${i}`} d={circleD(x, y - 212, 24)} v={V.brass} w={[5, 1.6]} seed={205 + i} />
      </g>
    ))}
    <path
      d={ribbon([[x0, y - 194], [(x0 * 3 + x1) / 4, y - 130], [(x0 + x1) / 2, y - 112], [(x0 + x1 * 3) / 4, y - 130], [x1, y - 194]], 26, 16, 207)}
      fill={V.pinkDeep.base}
    />
  </g>
);

/** One speck of dust. Kevin, later. ≥24 px with a ≥2 px ink rim. */
const Speck: React.FC<{ id: string; x: number; y: number; r: number; glow?: number; dark?: boolean }> = ({ id, x, y, r, glow = 0, dark = false }) => {
  const frame = useCurrentFrame();
  const rot = Math.sin(frame / 40) * 8;
  // Polish L3 (`dark`, Kevin): the core one value step darker and a 4 px rim, findable at phone size.
  const v = dark ? { ...V.dust, base: V.dust.shadow, shadow: mixHex(V.dust.shadow, INK, 0.35), light: V.dust.base } : V.dust;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {glow > 0.02 ? <circle r={r * 2.2} fill={V.lit.light} opacity={0.3 * glow} /> : null}
      <PShape id={id} d={circleD(0, 0, r)} v={v} w={dark ? [8, 4] : [Math.max(3.5, r * 0.18), 2.5]} ink={INK} seed={211} />
      <circle cx={r * 0.45} cy={r * 0.3} r={r * 0.28} fill={v.shadow} />
    </g>
  );
};

const CHAIN = ["NO DUST", "NO CLOUDS", "NO RAIN"];
const ChainCards: React.FC<{ u: number }> = ({ u }) => {
  const { fps } = useVideoConfig();
  if (u <= 0.001) return null;
  const at = [0.34, 0.58, 0.8];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 150,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 26,
        fontFamily: kidTheme.fontFamily,
        zIndex: 44,
        pointerEvents: "none",
      }}
    >
      {CHAIN.map((text, i) => {
        const on = u >= at[i];
        const s = spring({ frame: on ? Math.round((u - at[i]) * 200) : -1, fps, config: { damping: 11, mass: 0.6 } });
        if (s <= 0.01) return null;
        return (
          <React.Fragment key={text}>
            {i > 0 ? (
              <div style={{ fontSize: 64, fontWeight: 900, color: INK, transform: `scale(${s})` }}>→</div>
            ) : null}
            <div
              style={{
                background: i === 2 ? V.tomato.base : CREAM,
                color: i === 2 ? CREAM : INK,
                border: `8px solid ${INK}`,
                borderRadius: kidRadius.pill,
                padding: "10px 34px",
                fontSize: kidType.min,
                fontWeight: 900,
                letterSpacing: 2,
                boxShadow: kidShadow(1),
                transform: `scale(${s}) rotate(${(1 - s) * 8 - 1.5}deg)`,
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 17 — Kevin  (do almost nothing: creep, breathe, the name)
// ---------------------------------------------------------------------------

const S17_GROUND = 1010;
const S17_DRIP = { x: 840, y: stand("drip", S17_GROUND) };
const S17_DRIP_SCALE = 1.45;
const S17_CLOUDIA = { x: 1690, y: stand("cloudia", 1110), scale: 1.15 };
/** The lamp pool Kevin is held up into (s17, and frozen under s18's card). */
const KEVIN_POOLS: Pool[] = [
  { x: 960, y: 430, r: 430, ry: 520, color: "#ffcf8a", opacity: 0.7 },
  { x: 840, y: 330, r: 520, ry: 420, color: WARM, opacity: 0.45 },
  { x: 960, y: 1000, r: 900, ry: 200, color: WARM, opacity: 0.3 },
];
const S17_SPECK = { x: S17_DRIP.x, y: crownOf("drip", S17_DRIP.y, S17_DRIP_SCALE) - 40 };

/** The lobby behind Kevin and the CONDENSATION card (s17 + s18 share it: s18 freezes this world). */
const LobbyClose: React.FC<{ cam: Cam; cloudiaFill: number; cloudiaSpeaking: boolean; sceneId: string; live: boolean }> = ({
  cam,
  cloudiaFill,
  cloudiaSpeaking,
  sceneId,
  live,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SetStack
      set={SETS.lobby.noon}
      cam={cam}
      hide={["fg"]}
      offsets={{ mid: 60 }}
      sky={<LightPool x={960} y={430} r={700} ry={480} color="#ffd9a0" opacity={0.3} />}
      mid={
        <>
          <ColumnShade />
          <Svg>
            {/* The other guests, far back in the lobby, softened by the 0.4 plane's haze. */}
            <PaintedDrops id={`${sceneId}-guests`} drops={swarm(frame / fps, 960, 470, 1100, 120, 150, 0.62, 0.35)} opacity={0.5} />
          </Svg>
          {live ? (
            <PaintedCloudia
              id={sceneId}
              x={S17_CLOUDIA.x}
              y={S17_CLOUDIA.y}
              scale={S17_CLOUDIA.scale}
              fill={cloudiaFill}
              clipboard
              emotion="neutral"
              speaking={cloudiaSpeaking}
              phase={PHASE.cloudia}
              idle={0.4}
              look={{ x: 0.55, y: 0.9 }}
            />
          ) : null}
        </>
      }
      stage={
        <Svg>
          <PaintedCloud id={`${sceneId}-floor`} x={900} y={S17_GROUND + 230} w={2700} h={480} seed={5} />
        </Svg>
      }
    />
  );
};

const KevinScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [nameFrom, nameTo] = lineWindow(scene, "a2_17_drip");
  // "…I shall call you Kevin" (silencedetect: 1.87–2.91 s of 3.28) — the arrow lands on the name.
  const arrowAt = Math.round(nameFrom + (nameTo - nameFrom) * 0.78);
  const cam = remasterCam(frame);
  const dripEmotion = useEmotion(scene, "drip", { a2_17_drip: "amazed" }, "happy");
  const dripSpeaking = useSpeaking(scene, "drip");
  const cloudiaSpeaking = useSpeaking(scene, "cloudia");
  const cast: Cast = {
    drip: { ...S17_DRIP, scale: S17_DRIP_SCALE, who: "drip", side: "left" },
    cloudia: { ...S17_CLOUDIA, who: "cloudia", side: "left" },
  };
  return (
    <AbsoluteFill>
      <LobbyClose cam={cam} cloudiaFill={0.1} cloudiaSpeaking={cloudiaSpeaking} sceneId={scene.id} live />
      <World cam={cam}>
        <Plane depth={1.0} flat>
          <PaintedDrip
            id={scene.id}
            x={S17_DRIP.x}
            y={S17_DRIP.y}
            scale={S17_DRIP_SCALE}
            emotion={dripEmotion}
            speaking={dripSpeaking}
            phase={PHASE.drip}
            idle={0.35}
            pose="cheer"
            look="up"
            groundY={S17_GROUND}
          />
          <Svg>
            {/* Kevin's own tiny shadow, on Drip's crown below him. */}
            <ellipse cx={S17_SPECK.x + 6} cy={S17_SPECK.y + 62} rx={34} ry={9} fill="#2a2850" opacity={0.28} />
            <Speck id="s17-kevin" x={S17_SPECK.x} y={S17_SPECK.y} r={40} glow={0.5} dark />
          </Svg>
        </Plane>
      </World>
      <Room tint={LOBBY_TINT} darks={LOBBY_DARKS} pools={KEVIN_POOLS} />
      {/* Brass, not tomato: the lamp-lit lobby keeps one warm hue family (the shape and label are the callback). */}
      <NameArrow x={S17_SPECK.x - 44} y={S17_SPECK.y - 20} label="KEVIN" from={arrowAt} dir="left" color="#d98a2b" />
      <Bubbles
        scene={scene}
        cast={cast}
        text={{ a2_17_drip: "Hello, dust speck.", a2_18_cloudia: "Kevin is a lovely name." }}
        at={{
          a2_17_drip: { x: 430, y: 230, tail: "right", tailAt: 700 },
          a2_18_cloudia: { x: 1300, y: 640, tail: "right", tailAt: 1580 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 18 — Big Word Two: CONDENSATION  (push 1.00→1.06 / 24 f to the slam, CutFlash)
// ---------------------------------------------------------------------------

const S18_DRIP = { x: 560, y: stand("drip", 1010) };
const S18_CLOUDIA: Mark = { x: 1430, y: stand("cloudia", 1010), scale: 1, who: "cloudia", side: "left" };

/** The frozen world: s17's lobby, pushed in on the slam (Freeze holds this at the slam frame). */
const CondensingWorld: React.FC<{ slam: number; sceneId: string }> = ({ slam, sceneId }) => {
  const frame = useCurrentFrame();
  const cam = remasterCam(frame, { creep: false, deltas: [bigWordPush(frame, slam)] });
  return <LobbyClose cam={cam} cloudiaFill={0.1} cloudiaSpeaking={false} sceneId={sceneId} live={false} />;
};

const BigWordCondensationScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [wordFrom, wordTo] = lineWindow(scene, "a2_19_narrator");
  // "…that is condensation" ends at 4.65 s of 5.16 (silencedetect) — the slam is on it.
  const slamAt = Math.round(wordFrom + (wordTo - wordFrom) * 0.89);
  const cam = remasterCam(frame, { creep: false, deltas: [bigWordPush(frame, slamAt)] });
  const dripSpeaking = useSpeaking(scene, "drip");
  const cloudiaSpeaking = useSpeaking(scene, "cloudia");
  return (
    <AbsoluteFill>
      <BigWordBeat
        scene={scene}
        word="CONDENSATION"
        syllables={["Con", "den", "SAY", "shun"]}
        chantKey="a2_20_drip"
        slamAt={slamAt}
        color={ACT_COLOR.condensation}
        sub="cold air makes drops"
        y={300}
        freeze={<CondensingWorld slam={slamAt} sceneId={scene.id} />}
      >
        <World cam={cam}>
          <Plane depth={1.0} flat>
            <PaintedDrip
              id={scene.id}
              x={S18_DRIP.x}
              y={S18_DRIP.y}
              scale={1.15}
              emotion={frame > slamAt ? "proud" : "excited"}
              speaking={dripSpeaking}
              phase={PHASE.drip}
              idle={0.45}
              look="upRight"
              groundY={1010}
            />
            <PaintedCloudia
              id={scene.id}
              x={S18_CLOUDIA.x}
              y={S18_CLOUDIA.y}
              scale={S18_CLOUDIA.scale}
              fill={0.15}
              clipboard
              emotion="proud"
              speaking={cloudiaSpeaking}
              phase={PHASE.cloudia}
              idle={0.6}
              look="upLeft"
              groundY={1010}
              altitude={10}
            />
            <LightPool x={960} y={900} r={900} ry={260} color="#ffd9a0" opacity={0.3} />
          </Plane>
        </World>
        {/* Inside the beat, so the room light grades the world and the cast but never the card. */}
        <Room
          tint={LOBBY_TINT}
          darks={LOBBY_DARKS}
          pools={[
            ARCH_POOL,
            { x: 560, y: 760, r: 460, ry: 380, color: WARM, opacity: 0.5 },
            { x: 1430, y: 760, r: 460, ry: 380, color: WARM, opacity: 0.4 },
          ]}
        />
      </BigWordBeat>
      <Frost from={slamAt} />
      {/* The kit card paints #fffdf7 + a pale-yellow block: one cream multiply holds the card at the paper ceiling (#f3ead8). */}
      <AbsoluteFill style={{ background: CREAM, mixBlendMode: "multiply", pointerEvents: "none", zIndex: 60 }} />
      <Bubbles
        scene={scene}
        cast={{ cloudia: S18_CLOUDIA }}
        text={{ a2_21_cloudia: "That's how I get guests!" }}
        at={{ a2_21_cloudia: { x: 1000, y: 690, tail: "right", tailAt: 1300 } }}
      />
    </AbsoluteFill>
  );
};

/** Frost: painted ice crystals creeping in at the frame edges (cream ribbons, no gradient, no white). */
const Frost: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const u = interpolate(frame, [from, from + 26], [0, 1], CLAMP);
  if (u <= 0.01) return null;
  const crystals = Array.from({ length: 26 }, (_, i) => {
    // Edges only: a ring of crystals round the frame, none over the card or the faces.
    const side = i % 4;
    const along = ((i * 0.618) % 1) * (side < 2 ? WIDTH : HEIGHT);
    const inset = 30 + ((i * 37) % 90);
    const x = side === 0 ? along : side === 1 ? along : side === 2 ? inset : WIDTH - inset;
    const y = side === 0 ? inset : side === 1 ? HEIGHT - inset : along;
    return { x, y: y + Math.sin(frame / 30 + i) * 6, a: (14 + (i % 3) * 8) * u, rot: frame * 0.3 + i * 24 };
  });
  return (
    <Svg>
      {crystals.map((c, i) => {
        const arms: Pt[][] = [0, 60, 120].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return [
            [-Math.cos(r) * c.a, -Math.sin(r) * c.a],
            [Math.cos(r) * c.a, Math.sin(r) * c.a],
          ];
        });
        return (
          <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.rot})`} opacity={0.75 * u}>
            <path d={arms.map((a, k) => ribbon(a, 5, 1.5, 230 + i * 3 + k)).join(" ")} fill="#c9d6e2" />
          </g>
        );
      })}
    </Svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 19 — The hotel fills  (two stepped pull-outs on "The hotel grew.")
// ---------------------------------------------------------------------------

const S19_CLOUDIA: Mark = { x: 330, y: stand("cloudia", 1000), scale: 0.95, who: "cloudia", side: "right" };
const S19_PEAK = { x: 1000, y: 360 };

const HotelFillsScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = scene.durationInFrames;
  const [, keepComingTo] = lineWindow(scene, "a2_22_narrator");
  const [crowdedFrom] = lineWindow(scene, "a2_24_narrator");
  // a2_24: "The hotel grew." at 2.17 s, "The hotel got crowded." at 3.35 s (silencedetect).
  const grew = atLine(scene, "a2_24_narrator", 2.17 / 5.04);
  const crowded = atLine(scene, "a2_24_narrator", 3.35 / 5.04);
  const full = interpolate(frame, [0, keepComingTo, crowdedFrom, dur], [0.06, 0.3, 0.66, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const floorAt = [atLine(scene, "a2_23_cloudia", 0.55), grew, crowded];
  const cam = remasterCam(frame, {
    base: { x: 960, y: 620 },
    bursts: [
      { at: grew, delta: { zoom: 0.973 } },
      { at: crowded, delta: { zoom: 0.973 } },
    ],
  });
  const cloudiaSpeaking = useSpeaking(scene, "cloudia");
  const cloudiaEmotion = useEmotion(scene, "cloudia", { a2_23_cloudia: "excited" }, "happy");
  const grey = full * 0.4;
  const t = frame / fps;
  // The column of arrivals, rising from below into the hotel's base.
  const column: DropSpec[] = Array.from({ length: 14 }, (_, i) => {
    const u = ((frame * 6 + i * 128) % 1400) / 1400;
    return { x: 1290 + Math.sin(u * 5 + i) * 110, y: 1180 - u * 520, s: (0.5 + (i % 3) * 0.08) * Math.min(1, (1 - u) * 5), mood: i % 3 === 0 ? 1 : 0 };
  });
  const ticks = Math.floor(full * 9);
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.hotel.noon}
        cam={cam}
        hide={["far", "fg"]}
        offsets={{ mid: 300 }}
        hazeOn={["far"]}
        sky={
          <>
            <SkyBlend from="hotel_sky" to="hotel_sky_grey" u={0.12 + full * 0.3} y={-260} />
          </>
        }
        far={<Plate k="hotel_far" x={-((t * 70) % 400)} y={80} />}
        mid={
          <>
            <PlateTint k="hotel_mid_bulk" color="#5a6494" opacity={Math.min(1, 0.3 + grey * 1.4)} y={300} />
            {/* Polish A2-1: a shade side on the bulk's camera-left half, so the tower separates from the sky. */}
            <AbsoluteFill style={{ WebkitMaskImage: "linear-gradient(90deg, #000 0%, #000 52%, transparent 64%)", maskImage: "linear-gradient(90deg, #000 0%, #000 52%, transparent 64%)" }}>
              <PlateTint k="hotel_mid_bulk" color="#2a2850" opacity={0.45} y={300} />
            </AbsoluteFill>
            <Svg>
              {floorAt.map((at, i) => {
                const pop = spring({ frame: frame - at, fps, config: { damping: 11, mass: 0.7 } });
                if (pop <= 0.01) return null;
                const fy = S19_PEAK.y + 30 - i * 105;
                const fw = 560 - i * 90;
                const windows = 3 + (i === 0 ? 1 : 0);
                return (
                  <g key={i} transform={`translate(${S19_PEAK.x} ${fy}) scale(${0.3 + 0.7 * pop}) translate(${-S19_PEAK.x} ${-fy})`} opacity={Math.min(1, pop * 1.6)}>
                    <PaintedCloud id={`s19-floor${i}`} x={S19_PEAK.x} y={fy} w={fw} h={170} grey={0.2 + grey} seed={i * 1.7 + 2} line={8} />
                    {Array.from({ length: windows }, (_, k) => {
                      const wx = S19_PEAK.x + ((k + 0.5) / windows - 0.5) * fw * 0.6;
                      return (
                        <PShape key={k} id={`s19-win${i}-${k}`} d={roundRectPath(wx - 22, fy - 18, 44, 44, 18)} v={V.lit} w={[4, 1.4]} seed={250 + i * 5 + k} />
                      );
                    })}
                  </g>
                );
              })}
            </Svg>
            {/* The lit windows pool warm light on the cloud round them. */}
            <LightPool x={S19_PEAK.x + 60} y={S19_PEAK.y + 260} r={420} ry={300} color="#ffd9a0" opacity={0.35} />
          </>
        }
        stage={
          <>
            <Svg>
              <PaintedDrops id="s19-column" drops={column} />
              <PaintedCloud id="s19-deck" x={700} y={1150} w={2000} h={300} seed={5} grey={grey * 0.5} />
              <GuestList id="s19-list" x={680} y={800} ticks={ticks} />
            </Svg>
            <PaintedCloudia
              id={scene.id}
              x={S19_CLOUDIA.x}
              y={S19_CLOUDIA.y}
              scale={S19_CLOUDIA.scale}
              fill={full * 0.5}
              clipboard
              emotion={cloudiaEmotion}
              speaking={cloudiaSpeaking}
              phase={PHASE.cloudia}
              look={{ x: 0.7, y: -0.3 }}
              groundY={1000}
              altitude={10}
            />
          </>
        }
      />
      {/* Cooling one band: blue-grey multiply; the lit windows pool warm; the deck's belly is dark. */}
      <Room
        tint="#7c8ce6"
        darks={[
          { x: 960, y: 1080, r: 1700, ry: 520, color: DUSK, opacity: 1 },
          { x: 1920, y: 0, r: 1000, ry: 700, color: DUSK, opacity: 1 },
          // The plate's painted sun disc (top centre) held down: Sunny is the only sun in this show.
          { x: 960, y: 110, r: 560, ry: 300, color: "#2a3470", opacity: 0.85 },
          { x: 0, y: 0, r: 900, ry: 640, color: DUSK, opacity: 0.9 },
        ]}
        pools={[
          // The lit windows (the plate's four, the new floors') pool warm on the cloud round them.
          ...[
            [975, 711],
            [1200, 651],
            [975, 891],
            [S19_PEAK.x, S19_PEAK.y + 30],
          ].map(([wx, wy]) => ({ x: wx, y: wy, r: 130, color: WARM, opacity: 1 })),
          // Polish A2-1: the white top-centre pool read as a digital sun glare; the new floors now take a warm,
          // tight pool and the plate's sun stays held down by the dark above.
          { x: S19_PEAK.x, y: S19_PEAK.y - 30, r: 460, ry: 260, color: "#ffd9a0", opacity: 1 },
          { x: 330, y: 330, r: 620, ry: 380, color: "#b8ceff", opacity: 0.6 },
          { x: S19_CLOUDIA.x + 120, y: 760, r: 460, ry: 380, color: "#fff0d2", opacity: 0.55 },
        ]}
      />
      <Bubbles
        scene={scene}
        cast={projectCast(cam, { cloudia: S19_CLOUDIA })}
        text={{ a2_23_cloudia: "Room for one more! Oh my." }}
        at={{ a2_23_cloudia: { x: 520, y: 330, tail: "left", tailAt: 380 } }}
      />
    </AbsoluteFill>
  );
};

/** Cloudia's guest list, filling with check-marks (painted card, ribbon ticks). */
const GuestList: React.FC<{ id: string; x: number; y: number; ticks: number }> = ({ id, x, y, ticks }) => (
  <g transform={`translate(${x} ${y}) rotate(-7) scale(0.8)`}>
    <PShape id={`${id}-card`} d={roundRectPath(-150, -210, 300, 420, 22)} v={V.paperCard} w={[8, 2.6]} seed={261} />
    <PShape id={`${id}-clip`} d={roundRectPath(-70, -244, 140, 54, 16)} v={V.steel} w={[6, 2]} seed={262} />
    <text x={0} y={-150} textAnchor="middle" fontFamily={kidTheme.fontFamily} fontSize={kidType.min} fontWeight={900} fill={INK}>
      GUESTS
    </text>
    <path
      d={Array.from({ length: 9 }, (_, i) => ribbon([[-104, -100 + i * 34], [-20, -101 + i * 34], [60, -100 + i * 34]], 4, 1.5, 263 + i)).join(" ")}
      fill={V.paperCard.line}
      opacity={0.6}
    />
    <path
      d={Array.from({ length: Math.min(9, ticks) }, (_, i) => {
        const ry = -100 + i * 34;
        return ribbon([[74, ry - 6], [90, ry + 10], [122, ry - 22]], 10, 4, 280 + i);
      }).join(" ")}
      fill={mixHex(kidTheme.mint, "#2a7a5a", 0.35)}
    />
  </g>
);

// ---------------------------------------------------------------------------
// Scene 20 — Full capacity  (camera dead-still; the window light dims two bands)
// ---------------------------------------------------------------------------

const S20_PORT = { x: 900, y: 520, r: 440 };
const S20_CLOUDIA = { x: 1010, ground: 900, scale: 1.05 };
const S20_DRIP = { x: 640, ground: 860, scale: 0.62 };

const FullCapacityScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = scene.durationInFrames;
  const press = interpolate(frame, [0, dur], [0.35, 1], CLAMP);
  const dim = interpolate(frame, [0, dur], [0.12, 0.6], CLAMP);
  const cam = remasterCam(frame);
  const cloudiaY = stand("cloudia", S20_CLOUDIA.ground);
  const dripY = stand("drip", S20_DRIP.ground);
  const cloudiaEmotion = useEmotion(scene, "cloudia", { a2_25_cloudia: "grumpy" }, "grumpy");
  const dripEmotion = useEmotion(scene, "drip", { a2_26_drip: "amazed" }, "grumpy");
  const cloudiaSpeaking = useSpeaking(scene, "cloudia");
  const dripSpeaking = useSpeaking(scene, "drip");
  // The hotel's flank, gone storm-slate on the outside (cool and saturated, not a grey).
  const wallV: Value3 = {
    base: mixHex("#6f7fb4", "#3c4678", dim),
    shadow: mixHex("#3c4678", "#232848", dim),
    light: mixHex("#a4b2d8", "#6f7fb4", dim),
    line: INK,
  };
  const ringD = `${circleD(S20_PORT.x, S20_PORT.y, S20_PORT.r + 46)} ${circleD(S20_PORT.x, S20_PORT.y, S20_PORT.r)}`;
  return (
    <AbsoluteFill>
      {/* The hotel's own grey flank (1.0), painted. */}
      <World cam={cam}>
        <Plane depth={1.0} flat>
          <Svg>
            <PaintFill id="s20-wall" shape={<rect x={-200} y={-200} width={2320} height={1480} />} bbox={{ x: -200, y: -200, w: 2320, h: 1480 }} v={wallV} seed={301} bleed={false} />
          </Svg>
        </Plane>
      </World>
      {/* Inside the glass: dim room (∞), packed guests (0.4), the two of them (1.0). */}
      <AbsoluteFill style={{ clipPath: `circle(${S20_PORT.r}px at ${S20_PORT.x}px ${S20_PORT.y}px)` }}>
        <SetStack
          set={SETS.lobby.dim}
          cam={cam}
          hide={["fg"]}
          sky={<LightPool x={S20_PORT.x + 180} y={300} r={420} color="#ffd9a0" opacity={0.5 * (1 - dim)} />}
          mid={
            <Svg>
              <PaintedDrops id="s20-packed" drops={swarm(frame / fps, S20_PORT.x, S20_PORT.y + 20, 560, 500, 104, 0.7, 0.4)} />
            </Svg>
          }
          stage={
            <>
              <AbsoluteFill
                style={{
                  transformOrigin: `${S20_CLOUDIA.x}px ${S20_CLOUDIA.ground - 150}px`,
                  transform: `scale(${1 + press * 0.28}, ${1 - press * 0.18}) skewX(${-press * 6}deg)`,
                }}
              >
                <PaintedCloudia
                  id={scene.id}
                  x={S20_CLOUDIA.x}
                  y={cloudiaY}
                  scale={S20_CLOUDIA.scale}
                  fill={0.6}
                  clipboard={false}
                  emotion={cloudiaEmotion}
                  speaking={cloudiaSpeaking}
                  phase={PHASE.cloudia}
                  idle={0.5}
                  look="camera"
                  groundY={S20_CLOUDIA.ground}
                  altitude={14}
                  groundLum={0.3}
                />
              </AbsoluteFill>
              <PaintedDrip
                id={scene.id}
                x={S20_DRIP.x}
                y={dripY}
                scale={S20_DRIP.scale}
                emotion={dripEmotion}
                speaking={dripSpeaking}
                phase={PHASE.drip}
                idle={0.5}
                look="camera"
                groundY={S20_DRIP.ground}
                groundLum={0.3}
              />
              {/* The room's lamp, going: its pool on the two of them fades with the light. */}
              <LightPool x={700} y={760} r={420} ry={300} color="#ffd9a0" opacity={0.42 * (1 - dim)} />
              <AbsoluteFill style={{ background: "#141a30", opacity: dim }} />
            </>
          }
        />
      </AbsoluteFill>
      {/* The porthole frame + the mist drifting past outside (1.3). */}
      <World cam={cam}>
        <Plane depth={1.0} flat>
          <Svg>
            <path d={ringD} fill={mixHex(V.bronze.base, "#2a2440", dim * 0.5)} fillRule="evenodd" />
            <path d={outlinePath(circleD(S20_PORT.x, S20_PORT.y, S20_PORT.r + 46), 10, 3, 311)} fill={INK} />
            <path d={outlinePath(circleD(S20_PORT.x, S20_PORT.y, S20_PORT.r), 9, 3, 312)} fill={INK} />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * Math.PI * 2 + 0.3;
              return (
                <PShape
                  key={i}
                  id={`s20-rivet${i}`}
                  d={circleD(S20_PORT.x + Math.cos(a) * (S20_PORT.r + 23), S20_PORT.y + Math.sin(a) * (S20_PORT.r + 23), 13)}
                  v={V.brass}
                  w={[4, 1.4]}
                  seed={313 + i}
                />
              );
            })}
            {/* Glass sheen: one cream streak, low. */}
            <path
              d={ribbon([[S20_PORT.x - 300, S20_PORT.y + 220], [S20_PORT.x - 120, S20_PORT.y - 60], [S20_PORT.x + 20, S20_PORT.y - 300]], 26, 6, 319)}
              fill={CREAM}
              opacity={0.16}
            />
          </Svg>
        </Plane>
        <Plane depth={1.3} flat>
          <Plate k="hotel_fg_mist" y={260} opacity={0.5} />
        </Plane>
      </World>
      <Room
        tint="#c6d0f6"
        darks={[
          { x: 0, y: 1080, r: 1000 + dim * 300, ry: 660 + dim * 200, color: DUSK, opacity: 1 },
          { x: 1920, y: 1080, r: 1000 + dim * 300, ry: 660 + dim * 200, color: DUSK, opacity: 1 },
          { x: 1920, y: 0, r: 860, ry: 560, color: DUSK, opacity: 0.9 },
          { x: 1300, y: 1080, r: 1100, ry: 460, color: "#0e0a20", opacity: dim * 1.6 },
          { x: 0, y: 0, r: 700, ry: 460, color: DUSK, opacity: 0.6 + dim * 0.4 },
          { x: S20_PORT.x, y: S20_PORT.y, r: S20_PORT.r, color: "#080c20", opacity: dim * 1.1 },
        ]}
        pools={[
          { x: S20_PORT.x + 100, y: 400, r: 520, ry: 460, color: WARM, opacity: 1.1 * (1 - dim) },
          // Daylight on the outside of the porthole: the brass rim and the wall round it stay lit as the room goes dark.
          { x: S20_PORT.x - 300, y: S20_PORT.y - 320, r: 640, ry: 460, color: "#eef0f2", opacity: 0.95 },
          { x: 1560, y: 560, r: 600, ry: 700, color: "#dfe6f2", opacity: 0.22 },
        ]}
      />
      <Bubbles
        scene={scene}
        cast={{
          cloudia: { x: S20_CLOUDIA.x, y: cloudiaY, scale: S20_CLOUDIA.scale, who: "cloudia" },
          drip: { x: S20_DRIP.x, y: dripY, scale: S20_DRIP.scale, who: "drip" },
        }}
        text={{ a2_25_cloudia: "We are at FULL CAPACITY!", a2_26_drip: "It's getting dark in here." }}
        at={{
          a2_25_cloudia: { x: 1540, y: 330, tail: "left", tailAt: 1300 },
          a2_26_drip: { x: 420, y: 930, tail: "right", tailAt: 600 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 21 — Grey, and heavy  (SHADOWLESS; the darkest scene; beams stop dead)
// ---------------------------------------------------------------------------

const S21_SINK_MAX = 60;
const S21_SUNNY = { x: 1660, y: stand("sunny", 300), scale: 0.6 };
const S21_CLOUDIA: Mark = { x: 760, y: stand("cloudia", 840), scale: 0.9, who: "cloudia", side: "left" };
/** The bulk plate's roof, where the beams must stop (scene px at offsets.mid = 330). */
const S21_ROOF = { x0: 860, x1: 1240, y: 400 };

const GreyAndHeavyScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = scene.durationInFrames;
  const [, greyTo] = lineWindow(scene, "a2_27_narrator");
  const [heavyFrom] = lineWindow(scene, "a2_29_cloudia");
  const grey = interpolate(frame, [20, greyTo - 20], [0.4, 1], CLAMP);
  const heavy = interpolate(frame, [heavyFrom - 30, dur], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.quad) });
  const sink = heavy * S21_SINK_MAX;
  const cam = remasterCam(frame, { base: { x: 960, y: 620 } });
  const sunnyEmotion = useEmotion(scene, "sunny", { a2_28_sunny: "grumpy" }, "proud");
  const cloudiaEmotion = useEmotion(scene, "cloudia", { a2_29_cloudia: "grumpy" }, "neutral");
  const cast: Cast = { sunny: { ...S21_SUNNY, who: "sunny" }, cloudia: S21_CLOUDIA };
  const cloudiaLook = useLookAtSpeaker(scene, cast, "cloudia", "down");
  const sunnySpeaking = useSpeaking(scene, "sunny");
  const cloudiaSpeaking = useSpeaking(scene, "cloudia");
  const t = frame / fps;
  const sunnyMid = { x: S21_SUNNY.x, y: midOf("sunny", S21_SUNNY.y, S21_SUNNY.scale) };
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.hotel.noon}
        cam={cam}
        hide={["far", "fg"]}
        offsets={{ mid: 330 + sink }}
        sky={<SkyBlend from="hotel_sky" to="hotel_sky_grey" u={0.45 + grey * 0.55} y={-260} />}
        far={
          <>
            <Plate k="hotel_far" y={60} />
            <AbsoluteFill style={{ opacity: grey }}>
              <Plate k="hotel_far_grey" y={60} />
            </AbsoluteFill>
            {/* Polish L2: the far cloud bank one band darker (it was the brightest thing in the darkest scene). */}
            <PlateTint k="hotel_far_grey" color="#262c46" opacity={0.4 + 0.35 * grey} y={60} />
          </>
        }
        mid={
          <>
            <Svg>
              {/* Beams first: the hotel covers them, so no light leaks past its silhouette. */}
              <StoppedBeams part="rays" from={sunnyMid} roof={{ ...S21_ROOF, y: S21_ROOF.y + sink }} blocked={grey} t={t} />
            </Svg>
            <Plate k="hotel_mid_bulk" y={330 + sink} />
            <PlateTint k="hotel_mid_bulk" color="#3a4152" opacity={0.35 + grey * 0.6} y={330 + sink} />
            <Svg>
              <PreDrips x={1000} y={1000 + sink} w={900} u={heavy} />
              <StoppedBeams part="hits" from={sunnyMid} roof={{ ...S21_ROOF, y: S21_ROOF.y + sink }} blocked={grey} t={t} />
            </Svg>
          </>
        }
        stage={
          <>
            <Svg>
              {/* Her balcony, sinking with the hotel. */}
              <g transform={`translate(0 ${sink * 0.6})`}>
                <PShape id="s21-balcony" d={roundRectPath(560, 840, 420, 40, 14)} v={cloudV(0.75)} w={[7, 2.4]} seed={331} />
                <path
                  d={Array.from({ length: 6 }, (_, i) => ribbon([[590 + i * 72, 840], [591 + i * 72, 760]], 7, 3, 332 + i)).join(" ") +
                    " " + ribbon([[566, 760], [770, 758], [974, 760]], 8, 3, 340)}
                  fill={mixHex(INK, "#4a5266", 0.3)}
                />
              </g>
            </Svg>
            <PaintedCloudia
              id={scene.id}
              x={S21_CLOUDIA.x}
              y={S21_CLOUDIA.y + sink * 0.6}
              scale={S21_CLOUDIA.scale}
              fill={Math.min(1, grey * 0.9 + heavy * 0.1)}
              clipboard
              emotion={cloudiaEmotion}
              speaking={cloudiaSpeaking}
              phase={PHASE.cloudia}
              idle={0.6}
              look={cloudiaLook}
            />
          </>
        }
      />
      {/* The darkest scene: slate multiply, the storm's belly black-blue; only Sunny's own disc stays lit. */}
      <Room
        tint="#5e7cc4"
        opacity={0.85}
        darks={[
          { x: 1000, y: 1080, r: 1300, ry: 380, color: "#141630", opacity: 0.8 + heavy * 0.2 },
          { x: 0, y: 160, r: 760, ry: 620, color: DUSK, opacity: 0.7 },
        ]}
        pools={[
          { x: S21_SUNNY.x, y: sunnyMid.y, r: 680, color: "#ffc870", opacity: 0.95 },
          { x: (S21_ROOF.x0 + S21_ROOF.x1) / 2, y: S21_ROOF.y + sink, r: 420, ry: 140, color: "#ffc870", opacity: 0.5 * grey },
          // The windows stay lit as the hotel darkens: a black hotel with no windows is a storm, not a hotel.
          ...[
            [910, 610],
            [1200, 690],
            [980, 910],
          ].map(([wx, wy]) => ({ x: wx, y: wy + sink, r: 80, color: "#ffb860", opacity: 0.75 })),
        ]}
      />
      {/* Sunny IS the key: drawn above the room light, the one thing in the frame it does not dim. */}
      <World cam={cam}>
        <Plane depth={1.0} flat>
          <PaintedSunny
            id={scene.id}
            x={S21_SUNNY.x}
            y={S21_SUNNY.y}
            scale={S21_SUNNY.scale}
            emotion={sunnyEmotion}
            speaking={sunnySpeaking}
            phase={PHASE.sunny}
            shades={1}
            look={{ x: -0.8, y: 0.4 }}
          />
        </Plane>
      </World>
      <KeyBloom x={S21_SUNNY.x} y={sunnyMid.y} r={260} color="#ffe2a4" opacity={0.25} />
      <Vignette strength={0.25 * grey} />
      <Bubbles
        scene={scene}
        cast={projectCast(cam, cast)}
        text={{ a2_28_sunny: "Rude! I was shining nicely.", a2_29_cloudia: "I love guests. I hate gravity." }}
        at={{
          a2_28_sunny: { x: 1200, y: 200, tail: "right", tailAt: 1480 },
          a2_29_cloudia: { x: 420, y: 920, tail: "right", tailAt: 620 }, // polish L5: tail 20 px left, off the balcony edge
        }}
      />
    </AbsoluteFill>
  );
};

/** Sunlight landing on the roof and stopping dead: a flat cap and a splash, nothing through. */
const StoppedBeams: React.FC<{
  part: "rays" | "hits";
  from: { x: number; y: number };
  roof: { x0: number; x1: number; y: number };
  blocked: number;
  t: number;
}> = ({ part, from, roof, blocked, t }) => (
  <g>
    {Array.from({ length: 4 }, (_, i) => {
      const u = i / 3;
      const landing = roof.x0 + (roof.x1 - roof.x0) * u;
      const drop = Math.abs(u - 0.5) * 2;
      const hitY = roof.y + drop * drop * 70;
      const w = 34 + (i % 2) * 14;
      const shimmer = 0.5 + 0.5 * Math.sin(t * 1.7 + i * 1.3);
      if (part === "rays") {
        return (
          <path
            key={i}
            d={`M ${from.x - w * 0.5} ${from.y} L ${from.x + w * 0.5} ${from.y} L ${landing + w * 1.4} ${hitY} L ${landing - w * 1.4} ${hitY} Z`}
            fill="#f6dc9a"
            opacity={0.18 + 0.1 * shimmer}
          />
        );
      }
      return (
        <g key={i}>
          <path d={ribbon([[landing - w * 1.5, hitY], [landing, hitY - 2], [landing + w * 1.5, hitY]], 14, 5, 350 + i)} fill="#f6dc9a" opacity={0.5 + 0.3 * shimmer} />
          {i % 2 === 0
            ? [-1, 1].map((s) => (
                <path
                  key={s}
                  d={ribbon([[landing + s * w * 1.2, hitY - 10], [landing + s * (w * 1.2 + 36), hitY - 28], [landing + s * (w * 1.2 + 56), hitY - 60]], 10, 3, 360 + i + s)}
                  fill="#f6dc9a"
                  opacity={0.55 * blocked * (0.6 + 0.4 * shimmer)}
                />
              ))
            : null}
        </g>
      );
    })}
  </g>
);

/** Drops gathering on the underside. Not falling yet — that is Act Three. */
const PreDrips: React.FC<{ x: number; y: number; w: number; u: number }> = ({ x, y, w, u }) => {
  const frame = useCurrentFrame();
  if (u <= 0.02) return null;
  return (
    <g opacity={Math.min(1, u * 1.6)}>
      {Array.from({ length: 7 }, (_, i) => {
        const px = x + ((i - 3) / 3) * w * 0.4;
        const wob = 1 + 0.18 * Math.sin(frame / 14 + i);
        const len = (34 + (i % 3) * 22) * u * wob;
        const r = 20;
        const d =
          `M ${px - 9} ${y} C ${px - 12} ${y + len * 0.5} ${px - r} ${y + len - r} ${px - r} ${y + len}` +
          ` A ${r} ${r} 0 0 0 ${px + r} ${y + len} C ${px + r} ${y + len - r} ${px + 12} ${y + len * 0.5} ${px + 9} ${y} Z`;
        return (
          <g key={i} transform={`translate(0 ${Math.abs(Math.sin(i * 2.1)) * 26})`}>
            <path d={d} fill={kidTheme.water} />
            <path d={outlinePath(d, 4.5, 1.5, 370 + i)} fill={kidPaintTheme.water.line} />
          </g>
        );
      })}
    </g>
  );
};

export const ACT2_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s12_layers: LayersScene,
  s13_cloud_hotel: CloudHotelScene,
  s14_myth_pillow: MythPillowScene,
  s15_what_a_cloud_is: WhatACloudIsScene,
  s16_dust_rule: DustRuleScene,
  s17_kevin: KevinScene,
  s18_bigword_condensation: BigWordCondensationScene,
  s19_hotel_fills: HotelFillsScene,
  s20_full_capacity: FullCapacityScene,
  s21_grey_and_heavy: GreyAndHeavyScene,
};
