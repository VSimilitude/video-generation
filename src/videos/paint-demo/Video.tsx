import React from "react";
import { AbsoluteFill, Sequence, getInputProps, useCurrentFrame } from "remotion";
import {
  Cloudia,
  Drip,
  GroundShadow,
  LightPool,
  PaintFill,
  Plane,
  Post,
  Sunny,
  World,
  burst,
  holdCreep,
  keyDirTo,
  kidTheme,
  lookAt,
  outlinePath,
  ribbon,
  roundRectPath,
  skyGradient,
  withCam,
  type Bloom,
  type Cam,
  type LightRig,
  type Pt,
  type TimeOfDay,
} from "../../lib/kid";

// paint-demo — the look-package gate (docs/ANIMATION-ROADMAP.md Step 2,
// remaster brief §6.2). Hidden workbench like kid-demo / step-demo.
//
// Three frames, each FLAT (today's kit: kid colours, uniform strokes, one
// plane, no post) vs PAINTED (ribbons + PaintFill + boil + light rig +
// ground shadow + planes + Post):
//   (a) Drip on the dawn ocean — night band, key low camera-right, rose
//   (b) Sunny's intro on the morning sky with Drip — day band, Sunny is the key
//   (c) Cloud Hotel interior with Cloudia and Drip — interior band, top soft
//       key, a lamp light pool
// Timeline: 0–299 the 10 s painted motion clip (a→b→c, 100 f each: idle,
// holdCreep, one burst in b, boil on) for the cost measurement; 300–599 the
// same clip FLAT (the filters-off control); 600–779 six 30-frame still
// holds, read at local frame 20: a_flat 620, a_painted 650, b_flat 680,
// b_painted 710, c_flat 740, c_painted 770. Placeholder planes are SVG —
// the gate is the kit, not the plates.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const STILL_FRAMES = {
  a_flat: 620,
  a_painted: 650,
  b_flat: 680,
  b_painted: 710,
  c_flat: 740,
  c_painted: 770,
} as const;

export function timeline() {
  return { durationInFrames: 780 };
}

type SceneProps = { painted: boolean; frame: number; cam: Cam };

/**
 * Render-cost knobs (ROADMAP Step 2 "Render-cost budget", applied in order):
 * `--props='{"bleed":false,"every":4,"flatPlanes":true}'`. `noPost`/`noBoil`
 * are diagnostics only (the grade and ground shadows are never dropped).
 */
type CostKnobs = { debugDir?: number; boilScope?: "ink" | "all"; grade?: { saturate?: number; contrast?: number }; postMode?: "baked" | "css"; post?: { grade?: boolean; paper?: boolean; vignette?: boolean }; bleed?: boolean; every?: number; flatPlanes?: boolean; noPost?: boolean; noBoil?: boolean };
const KNOBS = getInputProps() as CostKnobs;
const paintOpts = (light: LightRig, boilKey: string) => ({
  light,
  boilKey,
  bleed: KNOBS.bleed ?? true,
  boilEvery: KNOBS.every ?? 3,
  boilOff: KNOBS.noBoil ?? false,
  boilScope: KNOBS.boilScope,
});

const BASE_CAM: Cam = { x: 960, y: 540 };
const FLAT_INK = kidTheme.ink;

// --- scenery helpers ------------------------------------------------------

function wave(y: number, amp: number, len: number, phase: number, x0 = -200, x1 = 2120, step = 24): Pt[] {
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += step) {
    pts.push([x, y + Math.sin((x / len) * Math.PI * 2 + phase) * amp + Math.sin((x / (len * 0.37)) * Math.PI * 2 + phase * 1.7) * amp * 0.3]);
  }
  return pts;
}

function bandPath(top: Pt[], bottom: number): string {
  const first = top[0];
  const last = top[top.length - 1];
  return `M ${first[0]} ${bottom} L ${top.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")} L ${last[0]} ${bottom} Z`;
}

/** A filled band whose top edge is ink: a ribbon when painted, a uniform stroke when flat. */
const Band: React.FC<{
  top: Pt[];
  bottom: number;
  fill: string;
  flatFill: string;
  painted: boolean;
  ink: string;
  w?: [number, number];
  seed: number;
  opacity?: number;
  /** Painted only: pooled PaintFill with these shadow/light values instead of a flat fill. */
  pool?: { shadow: string; light: string };
}> = ({ top, bottom, fill, flatFill, painted, ink, w = [4, 1.2], seed, opacity, pool }) => (
  <g opacity={opacity}>
    {painted && pool ? (
      <PaintFill
        id={`band-${seed}`}
        shape={<path d={bandPath(top, bottom)} />}
        bbox={{ x: -200, y: Math.min(...top.map((p) => p[1])) - 4, w: 2320, h: Math.min(bottom, 1100) - Math.min(...top.map((p) => p[1])) }}
        v={{ base: fill, shadow: pool.shadow, light: pool.light, line: ink }}
        seed={seed}
        bleed={false}
      />
    ) : (
      <path d={bandPath(top, bottom)} fill={painted ? fill : flatFill} />
    )}
    {painted ? (
      <path d={ribbon(top, w[0], w[1], seed, { jitter: 0.8 })} fill={ink} />
    ) : (
      <path d={`M ${top.map((p) => `${p[0]} ${p[1]}`).join(" L ")}`} stroke={FLAT_INK} strokeWidth={5} fill="none" />
    )}
  </g>
);

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", overflow: "visible" }}>
    {children}
  </svg>
);

/** Planes when painted; one flat stack (today's single plane) when not. */
const Layer: React.FC<{ painted: boolean; depth: Plane_Depth; haze?: string; children: React.ReactNode }> = ({
  painted,
  depth,
  haze,
  children,
}) =>
  painted ? (
    <Plane depth={depth} haze={haze} flat={KNOBS.flatPlanes ?? false}>
      {children}
    </Plane>
  ) : (
    <AbsoluteFill>{children}</AbsoluteFill>
  );
type Plane_Depth = React.ComponentProps<typeof Plane>["depth"];

const Stage: React.FC<{ painted: boolean; cam: Cam; time: TimeOfDay; bloom?: Bloom[]; skyRamp?: boolean; children: React.ReactNode }> = ({
  painted,
  cam,
  time,
  bloom,
  skyRamp,
  children,
}) =>
  painted ? (
    <Post time={time} bloom={bloom} off={KNOBS.noPost ?? false} layers={KNOBS.post} mode={KNOBS.postMode} grade={KNOBS.grade} skyRamp={skyRamp}>
      <World cam={cam}>{children}</World>
    </Post>
  ) : (
    // Flat = today's kit: one Camera transform for everything.
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${cam.x}px ${cam.y}px`,
          transform: `translate(${cam.dx ?? 0}px, ${cam.dy ?? 0}px) scale(${cam.zoom ?? 1})`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );

// --- (a) dawn ocean ---------------------------------------------------------

const A_LIGHT: LightRig = { dir: KNOBS.debugDir ?? -8, elevation: 0.08, key: "#ffb09a", shadow: "#1e2050", contrast: 0.3 };
const A_DRIP = { x: 900, y: 640 };

const SceneA: React.FC<SceneProps> = ({ painted, frame, cam }) => {
  const t = frame / FPS;
  const sky = painted
    ? "linear-gradient(180deg, #070920 0%, #151a4c 30%, #43367a 52%, #c0607a 70%, #ffb894 83%)"
    : skyGradient("night");
  return (
    <Stage painted={painted} cam={cam} time="night" skyRamp>
      <Layer painted={painted} depth="sky">
        <AbsoluteFill style={{ background: sky }} />
        {painted ? <LightPool x={1640} y={660} r={1400} ry={620} color="#ffb48e" opacity={0.8} /> : null}
        <Svg>
          <defs>
            <radialGradient id="starSoft">
              <stop offset="0" stopColor="#efe4cc" stopOpacity={1} />
              <stop offset="0.35" stopColor="#efe4cc" stopOpacity={0.55} />
              <stop offset="1" stopColor="#efe4cc" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="streakSoft">
              <stop offset="0" stopColor="#f0a08e" stopOpacity={0.8} />
              <stop offset="0.5" stopColor="#ffb89a" stopOpacity={0.35} />
              <stop offset="1" stopColor="#ffb89a" stopOpacity={0} />
            </radialGradient>
          </defs>
          {[[180, 120], [420, 220], [760, 90], [1080, 180], [1320, 70], [560, 340], [240, 400]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={painted ? 6 : 3} fill={painted ? "url(#starSoft)" : "#ffffff"} opacity={painted ? 0.5 : 0.85} />
          ))}
        </Svg>
      </Layer>
      <Layer painted={painted} depth={0.15} haze="#8a6a86">
        <Svg>
          <Band top={wave(640, 5, 520, 0.4)} bottom={1100} fill="#3b3a78" flatFill="#1f3b7a" painted={painted} ink="#2a2a4a" w={[2.2, 0.8]} seed={11} />
        </Svg>
      </Layer>
      <Layer painted={painted} depth={0.4}>
        <Svg>
          <Band top={wave(700, 9, 380, t * 0.6)} bottom={1100} fill="#1f4478" flatFill="#159fbc" painted={painted} ink="#22284a" w={[3.5, 1]} seed={12} />
          {painted
            ? [0, 1, 2, 3].map((i) => (
                <ellipse key={i} cx={1500 + i * 40 + Math.sin(t * 2 + i) * 6} cy={722 + i * 18} rx={170 - i * 30} ry={7 + i * 2} fill="url(#streakSoft)" opacity={0.5 - i * 0.1} />
              ))
            : null}
        </Svg>
      </Layer>
      <Layer painted={painted} depth={1.0}>
        <Svg>
          <Band top={wave(812, 12, 300, t * 0.9 + 1)} bottom={1200} fill="#173a6a" flatFill="#0a6d8c" painted={painted} ink="#1d2142" w={[5, 1.4]} seed={13} pool={{ shadow: "#0d1f44", light: "#3b5a8a" }} />
          <Band top={wave(930, 14, 260, t * 1.1 + 2)} bottom={1200} fill="#112a52" flatFill="#08597a" painted={painted} ink="#181b38" w={[5, 1.4]} seed={14} />
          {!painted ? <path d={bandPath(wave(806, 6, 120, 0), 822)} fill="#ffffff" opacity={0.9} /> : null}
        </Svg>
        {painted ? <GroundShadow x={A_DRIP.x} y={812} bodyW={212} light={A_LIGHT} ground={0.25} /> : null}
        <Drip {...A_DRIP} emotion="happy" look={{ x: 0.6, y: -0.1 }} shadow={!painted}
          paint={painted ? paintOpts(A_LIGHT, "drip-a") : undefined} />
      </Layer>
      <Layer painted={painted} depth={1.3}>
        <Svg>
          <Band top={wave(1010, 20, 340, 3)} bottom={1200} fill="#0f1838" flatFill="#08597a" painted={painted} ink="#101226" w={[6.5, 2]} seed={15} pool={{ shadow: "#080d24", light: "#25305a" }} />
          {painted
            ? [[140, 960], [260, 990], [1720, 980], [1820, 950]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={7 - i} fill="#cfc0c8" opacity={0.35} />
              ))
            : null}
        </Svg>
      </Layer>
    </Stage>
  );
};

// --- (b) Sunny's intro ------------------------------------------------------

const B_DRIP = { x: 430, y: 720 };
const B_SUNNY = { x: 1390, y: 360 };
const B_LIGHT: LightRig = {
  dir: keyDirTo(B_DRIP, B_SUNNY),
  elevation: 0.45,
  key: "#ffd27a",
  shadow: "#3c5c92",
  contrast: 0.7,
};

const SceneB: React.FC<SceneProps> = ({ painted, frame, cam }) => {
  const t = frame / FPS;
  const sky = painted
    ? "linear-gradient(180deg, #1c6cc4 0%, #3d8fd4 36%, #86c2e4 62%, #ecd29a 84%)"
    : skyGradient("day");
  const cloud = (x: number, y: number, s: number, seed: number) => {
    const pts: Pt[] = Array.from({ length: 30 }, (_, i) => {
      const u = i / 29;
      return [x - 160 * s + u * 320 * s, y + Math.sin(u * Math.PI * 3) * 3 * s] as Pt;
    });
    return painted ? (
      <g key={seed}>
        <ellipse cx={x} cy={y - 14 * s} rx={170 * s} ry={30 * s} fill="#e6e0d2" opacity={0.75} />
        <ellipse cx={x - 40 * s} cy={y - 30 * s} rx={80 * s} ry={26 * s} fill="#ece6d8" opacity={0.7} />
        <path d={ribbon(pts, 2.5, 0.6, seed)} fill="#8d9fb4" opacity={0.7} />
      </g>
    ) : (
      <g key={seed}>
        <ellipse cx={x} cy={y - 14 * s} rx={170 * s} ry={30 * s} fill="#ffffff" />
        <ellipse cx={x - 40 * s} cy={y - 30 * s} rx={80 * s} ry={26 * s} fill="#ffffff" />
      </g>
    );
  };
  return (
    <Stage painted={painted} cam={cam} time="day" skyRamp
      bloom={[{ x: B_SUNNY.x, y: B_SUNNY.y, r: 420, color: "#ffe09a", opacity: 0.55 }]}>
      <Layer painted={painted} depth="sky">
        <AbsoluteFill style={{ background: sky }} />
        {painted ? <LightPool x={B_SUNNY.x} y={B_SUNNY.y} r={560} color="#ffd98a" opacity={0.3} /> : (
          <Svg><ellipse cx={B_SUNNY.x} cy={B_SUNNY.y} rx={330} ry={330} fill="#ffffff" opacity={0.2} /></Svg>
        )}
      </Layer>
      <Layer painted={painted} depth={0.15} haze="#c9d2c8">
        <Svg>
          {cloud(380 + t * 6, 260, 1.1, 21)}
          {cloud(900 + t * 4, 170, 0.8, 22)}
          {cloud(1750 + t * 5, 560, 0.9, 23)}
        </Svg>
      </Layer>
      <Layer painted={painted} depth={0.4}>
        <Svg>
          <Band top={wave(800, 6, 420, t * 0.5)} bottom={1100} fill="#2f84a6" flatFill="#159fbc" painted={painted} ink="#2c4f66" w={[3.5, 1]} seed={24} />
          {painted
            ? [0, 1, 2].map((i) => (
                <path key={i} d={ribbon(wave(830 + i * 22, 2, 140, i), 3.2, 0.6, 50 + i)} fill="#f6d88a" opacity={0.7 - i * 0.15}
                  transform={`translate(${880 + i * 40} 0) scale(0.35 1)`} />
              ))
            : null}
        </Svg>
      </Layer>
      <Layer painted={painted} depth={1.0}>
        <Svg>
          <Band top={wave(880, 10, 300, t * 0.8 + 1)} bottom={1200} fill="#22688a" flatFill="#0a6d8c" painted={painted} ink="#25465c" w={[5, 1.4]} seed={25} pool={{ shadow: "#14465f", light: "#4a90ae" }} />
        </Svg>
        {painted ? <GroundShadow x={B_DRIP.x} y={890} bodyW={212 * 0.8} light={B_LIGHT} ground={0.35} /> : null}
        <Drip {...B_DRIP} scale={0.8} emotion="excited" look={lookAt(B_DRIP, B_SUNNY)} shadow={!painted}
          paint={painted ? paintOpts(B_LIGHT, "drip-b") : undefined} />
        <Sunny {...B_SUNNY} scale={1.25} shades={0.7} look={lookAt(B_SUNNY, B_DRIP)}
          paint={painted ? paintOpts(B_LIGHT, "sunny-b") : undefined} />
      </Layer>
      <Layer painted={painted} depth={1.3}>
        <Svg>
          <Band top={wave(1000, 18, 360, 2)} bottom={1200} fill="#0f3a55" flatFill="#08597a" painted={painted} ink="#122a3a" w={[6.5, 2]} seed={26} pool={{ shadow: "#081f30", light: "#2c6684" }} />
        </Svg>
      </Layer>
    </Stage>
  );
};

// --- (c) Cloud Hotel interior ----------------------------------------------

const C_LIGHT: LightRig = { dir: -90, elevation: 0.85, key: "#fff0d2", shadow: "#4f4c70", contrast: 0.45 };
const C_DRIP = { x: 620, y: 680 };
const C_CLOUDIA = { x: 1250, y: 560 };
const LAMP = { x: 960, y: 250 };

const SceneC: React.FC<SceneProps> = ({ painted, frame, cam }) => {
  const P = painted;
  const wall = P ? "#6a54a8" : "#d9d2f0";
  const floor = P ? "#2f6290" : "#8fd4ea";
  const desk = P ? "#8e4f34" : "#c98a5a";
  const deskTop: Pt[] = wave(600, 1.5, 300, 0, 1020, 1800, 20);
  return (
    <Stage painted={P} cam={cam} time="interior"
      bloom={[{ x: LAMP.x, y: LAMP.y + 30, r: 190, color: "#ffd9a0", opacity: 0.35 }]}>
      <Layer painted={P} depth="sky">
        <AbsoluteFill style={{ background: wall }} />
        <Svg>
          {/* wainscot */}
          <rect x={0} y={560} width={1920} height={260} fill={P ? "#52439a" : "#c7bfe6"} />
          {P ? <path d={ribbon(wave(560, 1, 400, 0, -20, 1940, 30), 3, 0.8, 31)} fill="#3e3a56" /> : (
            <path d="M 0 560 L 1920 560" stroke={FLAT_INK} strokeWidth={5} />
          )}
        </Svg>
        {P ? <LightPool x={LAMP.x} y={LAMP.y + 260} r={520} ry={420} color="#ffd9a0" opacity={0.4} /> : null}
        {P ? <LightPool x={510} y={700} r={480} ry={300} color="#dfeaf6" opacity={0.2} /> : null}
      </Layer>
      <Layer painted={P} depth={0.15} haze="#cfe0f0">
        <Svg>
          <rect x={270} y={150} width={480} height={360} rx={18} fill={P ? "#93c2ea" : "#7ed0f5"} />
          <ellipse cx={430} cy={420} rx={135} ry={42} fill={P ? "#f2ead8" : "#ffffff"} />
          <ellipse cx={620} cy={300} rx={110} ry={30} fill={P ? "#f3ead8" : "#ffffff"} />
          {P ? (
            <path d={outlinePath(roundRectPath(270, 150, 480, 360, 18), 8, 3, 32, { thickAt: Math.PI / 2 })} fill="#3a3456" />
          ) : (
            <rect x={270} y={150} width={480} height={360} rx={18} fill="none" stroke={FLAT_INK} strokeWidth={8} />
          )}
          {P ? (
            <path d={`${ribbon([[510, 152], [510, 330], [510, 508]], 6, 2, 37)} ${ribbon([[272, 330], [510, 330], [748, 330]], 6, 2, 38)}`} fill="#3a3456" />
          ) : (
            <path d="M 510 150 L 510 510 M 270 330 L 750 330" stroke={FLAT_INK} strokeWidth={8} />
          )}
        </Svg>
      </Layer>
      <Layer painted={P} depth={0.4}>
        <Svg>
          <path d={bandPath(deskTop, 800)} fill={desk} />
          <rect x={1020} y={600} width={780} height={26} fill={P ? "#a8664a" : "#e0a572"} />
          {P ? (
            <>
              <path d={ribbon(deskTop, 4.5, 1.2, 33)} fill="#3a2a2c" />
              <rect x={1020} y={700} width={780} height={100} fill="#5c3e38" opacity={0.45} />
            </>
          ) : (
            <path d={`M ${deskTop.map((p) => `${p[0]} ${p[1]}`).join(" L ")}`} stroke={FLAT_INK} strokeWidth={5} fill="none" />
          )}
        </Svg>
      </Layer>
      <Layer painted={P} depth={1.0}>
        <Svg>
          <rect x={-100} y={800} width={2120} height={400} fill={floor} />
          {P ? (
            <>
              <path d={ribbon(wave(800, 1.5, 500, 0, -40, 1960, 30), 5, 1.4, 34)} fill="#34304a" />
              <rect x={-100} y={960} width={2120} height={200} fill="#10263e" opacity={0.85} />
            </>
          ) : (
            <path d="M 0 800 L 1920 800" stroke={FLAT_INK} strokeWidth={5} />
          )}
          {/* lamp: cord + shade */}
          {P ? (
            <path d={ribbon([[LAMP.x, -20], [LAMP.x + 1, 60], [LAMP.x - 1, 140], [LAMP.x, LAMP.y - 28]], 3.5, 1.2, 39)} fill="#2b2a33" />
          ) : (
            <path d={`M ${LAMP.x} -20 L ${LAMP.x} ${LAMP.y - 30}`} stroke={FLAT_INK} strokeWidth={5} />
          )}
          <path d={`M ${LAMP.x - 70} ${LAMP.y + 30} Q ${LAMP.x} ${LAMP.y - 70} ${LAMP.x + 70} ${LAMP.y + 30} Z`}
            fill={P ? "#e8b85a" : "#ffd93c"} stroke={P ? undefined : FLAT_INK} strokeWidth={P ? undefined : 5} />
          {P ? (
            <path d={ribbon([[LAMP.x - 70, LAMP.y + 30], [LAMP.x - 40, LAMP.y - 18], [LAMP.x, LAMP.y - 30], [LAMP.x + 40, LAMP.y - 18], [LAMP.x + 70, LAMP.y + 30]], 4.5, 1.2, 35)} fill="#5a3f22" />
          ) : null}
          <ellipse cx={LAMP.x} cy={LAMP.y + 32} rx={34} ry={9} fill={P ? "#f3ead8" : "#ffffff"} />
        </Svg>
        {P ? (
          <>
            <LightPool x={LAMP.x} y={860} r={520} ry={110} color="#ffd9a0" opacity={0.28} />
            <GroundShadow x={C_DRIP.x} y={835} bodyW={212 * 0.9} light={C_LIGHT} ground={0.32} />
            {/* Top key: Cloudia's shadow falls straight down onto the desk front she hovers over. */}
            <GroundShadow x={C_CLOUDIA.x} y={692} bodyW={300} light={C_LIGHT} altitude={18} ground={0.3} />
          </>
        ) : null}
        <Cloudia {...C_CLOUDIA} scale={0.95} emotion="happy" look={lookAt(C_CLOUDIA, C_DRIP)}
          paint={P ? paintOpts(C_LIGHT, "cloudia-c") : undefined} />
        <Drip {...C_DRIP} scale={0.9} emotion="neutral" look={lookAt(C_DRIP, C_CLOUDIA)} shadow={!P}
          paint={P ? paintOpts(C_LIGHT, "drip-c") : undefined} />
      </Layer>
      <Layer painted={P} depth={1.3}>
        <Svg>
          <rect x={-40} y={-20} width={150} height={1120} fill={P ? "#271f48" : "#b8a6e0"} stroke={P ? undefined : FLAT_INK} strokeWidth={P ? undefined : 6} />
          {P ? <path d={ribbon([[110, -20], [112, 400], [109, 800], [111, 1100]], 8, 3, 36)} fill="#2b2a33" /> : null}
          {P ? null : <ellipse cx={1760} cy={1060} rx={260} ry={60} fill="#ffffff" opacity={0.8} />}
        </Svg>
      </Layer>
    </Stage>
  );
};

// --- composition -----------------------------------------------------------

const SCENES = [SceneA, SceneB, SceneC];

/** The 10 s motion clip: a → b → c, 100 frames each; creep everywhere, one burst in b. */
const Motion: React.FC<{ painted: boolean }> = ({ painted }) => {
  const frame = useCurrentFrame();
  const i = Math.min(2, Math.floor(frame / 100));
  const local = frame - i * 100;
  const Scene = SCENES[i];
  const cam = withCam(
    BASE_CAM,
    holdCreep(local, 0, 6, FPS, 0.02),
    i === 1 ? burst(local, 40, { zoom: 1.05, dx: -90, dy: 30 }) : {},
  );
  return <Scene painted={painted} frame={frame} cam={cam} />;
};

const Still: React.FC<{ scene: number; painted: boolean }> = ({ scene, painted }) => {
  const frame = useCurrentFrame();
  const Scene = SCENES[scene];
  return <Scene painted={painted} frame={frame} cam={withCam(BASE_CAM, holdCreep(frame, 0, 6, FPS, 0.02))} />;
};

export const PaintDemoVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={0} durationInFrames={300}>
      <Motion painted />
    </Sequence>
    <Sequence from={300} durationInFrames={300}>
      <Motion painted={false} />
    </Sequence>
    {[0, 1, 2].flatMap((s) =>
      [false, true].map((painted, j) => (
        <Sequence key={`${s}-${j}`} from={600 + (s * 2 + j) * 30} durationInFrames={30}>
          <Still scene={s} painted={painted} />
        </Sequence>
      )),
    )}
  </AbsoluteFill>
);
