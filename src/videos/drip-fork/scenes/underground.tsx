import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Blobby, Drip, KidBackdrop, kidTheme, mixHex, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  Bubbles,
  Camera,
  CutFlash,
  PHASE,
  SETTLE_FRAMES,
  WaterBand,
  WideLayer,
  lineWindow,
  midOf,
  projectMark,
  stand,
  useEmotion,
  type Mark,
  type SceneProps,
} from "./common";

// UNDERGROUND — home the secret way. The branch with no episode-one scene to
// restage, so its props are new and live here: the dark soil, the worms, the
// cliff spring, the crab.
//
// Dark, but never a black frame: the soil is a deep plum rather than black,
// the stones have ink outlines and a lit edge, and Drip carries his own light
// (`SelfGlow`) — a six-year-old has to be able to find him in every frame.
//
// Branch segments carry no variants (brief ruling 2).

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const SOIL_TOP = "#3a2d44";
const SOIL_LOW = "#241b2e";

/** The underground: deep soil and stones, scrolling by `dx`/`dy`. */
const Soil: React.FC<{ dx?: number; dy?: number; water?: number }> = ({ dx = 0, dy = 0, water = 0 }) => {
  const frame = useCurrentFrame();
  const stones = Array.from({ length: 34 }, (_, i) => ({
    x: ((i * 397 + dx) % 2600 + 2600) % 2600 - 340,
    y: ((i * 263 + dy) % 1500 + 1500) % 1500 - 210,
    r: 46 + (i % 5) * 18,
    rot: (i * 37) % 180,
  }));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${SOIL_TOP} 0%, ${SOIL_LOW} 100%)` }} />
      <WideLayer>
        {/* Groundwater, between the stones: "a huge amount of the world's
            water is under the ground". Faint blue seams, slowly moving. */}
        {water > 0.01
          ? Array.from({ length: 9 }, (_, i) => (
              <path
                key={`w${i}`}
                d={`M -1200 ${140 + i * 120 + Math.sin(frame / 60 + i) * 10} q 600 40 1200 0 t 1200 0 t 1200 0 t 1200 0`}
                stroke={kidTheme.water}
                strokeWidth={34}
                strokeLinecap="round"
                fill="none"
                opacity={0.32 * water}
              />
            ))
          : null}
        {stones.map((s, i) => (
          <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}>
            <ellipse rx={s.r} ry={s.r * 0.66} fill="#6f6578" stroke={kidTheme.ink} strokeWidth={7} />
            <ellipse cx={-s.r * 0.25} cy={-s.r * 0.22} rx={s.r * 0.4} ry={s.r * 0.2} fill="#8d849a" />
          </g>
        ))}
      </WideLayer>
    </AbsoluteFill>
  );
};

/** Drip's own light: a soft halo, so he is findable in the dark. */
const SelfGlow: React.FC<{ x: number; y: number; r?: number; strength?: number }> = ({
  x,
  y,
  r = 260,
  strength = 1,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(160,220,255,${0.55 * strength}) 0%, rgba(120,190,255,${0.2 * strength}) 55%, transparent 100%)`,
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// Scene 1 — into the dark
// ---------------------------------------------------------------------------

const S1_DRIP = { x: 900, y: stand("drip", 760) };
const S1_SCALE = 1;

const DarkScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [sinkFrom, sinkTo] = lineWindow(scene, "ug_01_narrator");
  const [trueFrom] = lineWindow(scene, "ug_03_narrator");
  // He sinks between the stones (the world rises past him) and the hole's
  // daylight shrinks away above — gone on "everything went dark".
  const sink = interpolate(frame, [SETTLE_FRAMES, sinkTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const daylight = 1 - clamp01((frame - sinkFrom) / Math.max(1, (sinkTo - sinkFrom) * 0.9));
  // "…moving very slowly, in the dark": the seams of water show up and drift.
  const water = interpolate(frame, [trueFrom + 20, trueFrom + 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = frame > trueFrom ? (frame - trueFrom) * 0.8 : 0;
  const mid = midOf("drip", S1_DRIP.y, S1_SCALE);
  const emotion = useEmotion(scene, "drip", { ug_02_drip: "neutral" }, "amazed", 6);

  return (
    <AbsoluteFill>
      <Soil dy={-sink * 900} dx={-drift} water={water} />
      {/* The way he came in: a disc of daylight above, shrinking. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${420 * daylight}px ${200 * daylight}px at 960px ${-60 - sink * 260}px, rgba(255,246,214,${0.9 * daylight}) 0%, rgba(255,246,214,0) 100%)`,
        }}
      />
      {/* Other drops, also down here, also glowing a little. */}
      <WideLayer opacity={water}>
        {Array.from({ length: 10 }, (_, i) => (
          <Blobby
            key={i}
            x={((i * 233 + drift * 0.6) % 2200) - 140}
            y={160 + ((i * 151) % 820)}
            scale={0.36}
            phase={i * 1.5}
            mood="calm"
            opacity={0.7}
          />
        ))}
      </WideLayer>
      <SelfGlow x={S1_DRIP.x} y={mid} />
      <Drip
        x={S1_DRIP.x}
        y={S1_DRIP.y}
        scale={S1_SCALE}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={0.8}
        look={frame < sinkTo ? "up" : "camera"}
      />
      <Bubbles
        scene={scene}
        cast={{ drip: { ...S1_DRIP, scale: S1_SCALE, who: "drip", side: "right" } }}
        text={{ ug_02_drip: "This is fine. I live here." }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — the roll call: Worm, Wormy, other Worm, Worm the third
// ---------------------------------------------------------------------------

/** Four identical worms. The same body every time — that is the gag. */
const WORMS = [
  { x: 330, y: 470 },
  { x: 620, y: 860 },
  { x: 1340, y: 420 },
  { x: 1600, y: 820 },
];
const S2_DRIP = { x: 960, y: stand("drip", 800) };
const S2_SCALE = 0.95;

const Worm: React.FC<{ x: number; y: number; up: number; phase: number }> = ({ x, y, up, phase }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 22 + phase) * 5;
  // A fat, round-topped worm with a face the size of its head — "faces must
  // be huge" applies to a worm too, or it reads as a pink post.
  const r = 44;
  const h = 70 + up * 90;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* The tunnel he is poking out of. */}
      <ellipse cx={0} cy={22} rx={90} ry={30} fill="#140f1c" stroke={kidTheme.ink} strokeWidth={7} />
      <g transform={`rotate(${sway})`}>
        <path
          d={`M ${-r} 22 L ${-r} ${-h} A ${r} ${r} 0 0 1 ${r} ${-h} L ${r} 22 Z`}
          fill={kidTheme.pink}
          stroke={kidTheme.ink}
          strokeWidth={9}
          strokeLinejoin="round"
        />
        {[0.25, 0.55].map((u) => (
          <path key={u} d={`M ${-r + 4} ${22 - (h + 22) * u} q ${r} 12 ${r * 2 - 8} 0`} stroke={kidTheme.pinkDeep} strokeWidth={6} fill="none" opacity={0.7} />
        ))}
        <g transform={`translate(0 ${-h - 4})`}>
          {/* Half-lidded: worms are busy. */}
          {[-17, 17].map((dx) => (
            <g key={dx}>
              <circle cx={dx} cy={0} r={15} fill="#ffffff" stroke={kidTheme.ink} strokeWidth={5} />
              <circle cx={dx} cy={4} r={7} fill={kidTheme.ink} />
              <path d={`M ${dx - 16} -1 h 32 v -17 h -32 Z`} fill={kidTheme.pink} />
              <path d={`M ${dx - 16} -1 h 32`} stroke={kidTheme.ink} strokeWidth={5} strokeLinecap="round" />
            </g>
          ))}
          <path d="M -12 30 h 24" stroke={kidTheme.ink} strokeWidth={6} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};

const WormsScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [callFrom, callTo] = lineWindow(scene, "ug_04_drip");
  // One name per worm, on the four clauses of the roll call.
  const named = [0.02, 0.27, 0.5, 0.74].map((u) => Math.round(callFrom + (callTo - callFrom) * u));
  const ups = named.map((at) => spring({ frame: frame - at, fps, config: { damping: 12, mass: 0.6 } }));
  let current = -1;
  for (let i = 0; i < named.length; i++) if (frame >= named[i] - 4 && frame < callTo) current = i;
  const mid = midOf("drip", S2_DRIP.y, S2_SCALE);
  const look =
    current >= 0
      ? { x: (WORMS[current].x - S2_DRIP.x) / 900, y: (WORMS[current].y - 60 - mid) / 700 }
      : ("camera" as const);
  const emotion = useEmotion(scene, "drip", { ug_04_drip: "excited", ug_06_drip: "neutral" }, "happy");

  return (
    <AbsoluteFill>
      <Soil dx={-120} dy={-300} />
      <WideLayer>
        {WORMS.map((w, i) => (
          <Worm key={i} x={w.x} y={w.y} up={ups[i]} phase={1.1} />
        ))}
      </WideLayer>
      <SelfGlow x={S2_DRIP.x} y={mid} />
      <Drip
        x={S2_DRIP.x}
        y={S2_DRIP.y}
        scale={S2_SCALE}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={1}
        look={look}
      />
      <Bubbles
        scene={scene}
        cast={{ drip: { ...S2_DRIP, scale: S2_SCALE, who: "drip", side: "right" } }}
        text={{ ug_04_drip: "Hi Worm! Hi Wormy! Hi Worm!", ug_06_drip: "Worms are busy." }}
        at={{
          ug_04_drip: { x: 960, y: 200, tail: "left", tailAt: S2_DRIP.x - 20 },
          ug_06_drip: { x: 960, y: 200, tail: "left", tailAt: S2_DRIP.x - 20 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — sideways to the sea, and out of a cliff
// ---------------------------------------------------------------------------

const S3_DARK_DRIP = { x: 760, y: stand("drip", 700) };
/** The beach, in world coordinates. The spring is a hole in the cliff face. */
const SPRING = { x: 470, y: 560 };
const SAND = 860;
const CRAB = { x: 1150, y: SAND - 20 };

const SpringScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [slowFrom, slowTo] = lineWindow(scene, "ug_07_narrator");
  const [outFrom, outTo] = lineWindow(scene, "ug_08_narrator");
  const [seaFrom, seaTo] = lineWindow(scene, "ug_09_drip");
  const outside = frame >= outFrom - 8;

  // Underground: "Slowly. Sideways. Towards the sea." — the soil slides left
  // past him, gently downhill.
  const travel = interpolate(frame, [slowFrom, slowTo + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Outside: he pops out of the cliff on "came out of a hole in a cliff",
  // slides down onto the sand, and the crab jumps on "which surprised a crab".
  const span = outTo - outFrom;
  const popAt = Math.round(outFrom + span * 0.18);
  const slideTo = Math.round(outFrom + span * 0.62);
  const crabAt = Math.round(outFrom + span * 0.86);
  const u = interpolate(frame, [popAt, slideTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const dripX = interpolate(u, [0, 1], [SPRING.x + 30, 860]);
  const dripGround = interpolate(u, [0, 0.5, 1], [SPRING.y + 40, SAND - 40, SAND]);
  const pop = clamp01((frame - popAt) / 10);
  const crab = clamp01((frame - crabAt) / 14);
  // "And there is the sea!" — the camera swings right to show it.
  const pan = interpolate(frame, [seaFrom + 10, seaTo + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cam = { x: 960 + pan * 560, y: 560, zoom: 1 - pan * 0.12, dx: -pan * 560 };
  const mark: Mark = { x: dripX, y: stand("drip", dripGround), scale: 0.85 * Math.max(0.2, pop), who: "drip", side: "right" };
  const talking = useSpeaking(scene, "drip");
  const outEmotion = useEmotion(scene, "drip", { ug_09_drip: "excited" }, "amazed");
  const emotion: EmotionInput = outside ? outEmotion : "happy";

  return (
    <AbsoluteFill>
      {!outside ? (
        <>
          <Soil dx={-travel * 1400} dy={-travel * 240} water={1} />
          <WideLayer>
            {Array.from({ length: 8 }, (_, i) => (
              <Blobby
                key={i}
                x={((i * 270 + travel * 900) % 2200) - 200}
                y={300 + ((i * 173) % 600) + travel * 60}
                scale={0.36}
                phase={i * 1.3}
                mood="calm"
                opacity={0.75}
              />
            ))}
          </WideLayer>
          <SelfGlow x={S3_DARK_DRIP.x} y={midOf("drip", S3_DARK_DRIP.y, 1)} />
          <Drip
            x={S3_DARK_DRIP.x}
            y={S3_DARK_DRIP.y}
            scale={1}
            emotion={emotion}
            phase={PHASE.drip}
            shadow={false}
            idle={0.7}
            look="right"
          />
        </>
      ) : (
        <>
          <KidBackdrop variant="day" clouds={3} waves={false} />
          <Camera cam={cam}>
            <WaterBand top={SAND - 40} dx={-frame * 1.2} />
            <WideLayer>
              <Beach />
              <Crab x={CRAB.x} y={CRAB.y} startle={crab} frame={frame} />
              {/* The spring itself, running out of the cliff onto the sand. */}
              <path
                d={`M ${SPRING.x} ${SPRING.y} q 60 30 90 120 q 30 110 160 ${SAND - SPRING.y - 120}`}
                stroke={kidTheme.water}
                strokeWidth={30}
                strokeLinecap="round"
                fill="none"
                opacity={0.9}
              />
            </WideLayer>
            {frame >= popAt ? (
            <Drip
              x={dripX}
              y={stand("drip", dripGround)}
              scale={0.85 * Math.max(0.2, pop)}
              emotion={emotion}
              speaking={talking}
              phase={PHASE.drip}
              shadow={false}
              idle={1}
              pose={frame >= seaFrom ? "cheer" : undefined}
              look={frame >= seaFrom ? "camera" : "right"}
            />
            ) : null}
          </Camera>
          <CutFlash at={outFrom - 8} strength={0.7} />
        </>
      )}
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(cam, mark) }}
        text={{ ug_09_drip: "SUNLIGHT! Hello crab!" }}
      />
    </AbsoluteFill>
  );
};

/** The cliff, the hole in it, and the beach below. */
const Beach: React.FC = () => (
  <g>
    {/* Sand, running into the sea on the right. */}
    <path d={`M -1200 ${SAND} Q 600 ${SAND - 30} 1300 ${SAND + 10} Q 1500 ${SAND + 40} 1620 1700 L -1200 1700 Z`} fill="#f2d79a" stroke="#c9a764" strokeWidth={10} />
    {/* The cliff. */}
    <path d={`M -1200 -500 L 360 -500 Q 520 120 430 420 Q 380 640 560 ${SAND + 10} L -1200 ${SAND + 10} Z`} fill="#a98a6e" stroke={kidTheme.ink} strokeWidth={10} strokeLinejoin="round" />
    <path d="M -1200 -40 L 380 -40 Q 420 -80 360 -120 L -1200 -120 Z" fill={kidTheme.grass} stroke={kidTheme.grassDark} strokeWidth={10} />
    {[[200, 200], [300, 700], [120, 520]].map(([x, y]) => (
      <path key={`${x}`} d={`M ${x - 60} ${y} q 60 -20 120 6`} stroke={mixHex("#a98a6e", kidTheme.ink, 0.4)} strokeWidth={8} fill="none" strokeLinecap="round" />
    ))}
    {/* The hole in the cliff face. */}
    <ellipse cx={SPRING.x - 10} cy={SPRING.y} rx={46} ry={34} fill="#2b2233" stroke={kidTheme.ink} strokeWidth={8} />
  </g>
);

/** One crab. `startle` 0..1 is the jump and the claws going up. */
const Crab: React.FC<{ x: number; y: number; startle: number; frame: number }> = ({ x, y, startle, frame }) => {
  const hop = Math.sin(clamp01(startle * 1.4) * Math.PI) * 60;
  const claws = startle > 0.05 ? -50 : -10 + Math.sin(frame / 14) * 5;
  const eyeR = 9 + startle * 6;
  const red = kidTheme.tomato;
  return (
    <g transform={`translate(${x} ${y - hop})`}>
      {[-1, 1].map((s) => (
        <g key={s}>
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M ${s * 40} ${10 + k * 10} q ${s * 34} 6 ${s * 50} 34`} stroke={kidTheme.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
          ))}
          <g transform={`translate(${s * 66} -18) rotate(${s * claws})`}>
            <path d={`M 0 0 L ${s * 20} -40`} stroke={kidTheme.ink} strokeWidth={9} strokeLinecap="round" />
            <circle cx={s * 24} cy={-54} r={22} fill={red} stroke={kidTheme.ink} strokeWidth={7} />
            <path d={`M ${s * 24} -54 L ${s * 44} -70`} stroke={kidTheme.ink} strokeWidth={6} strokeLinecap="round" />
          </g>
        </g>
      ))}
      <ellipse cx={0} cy={0} rx={70} ry={42} fill={red} stroke={kidTheme.ink} strokeWidth={8} />
      {[-18, 18].map((dx) => (
        <g key={dx}>
          <path d={`M ${dx} -34 L ${dx} -62`} stroke={kidTheme.ink} strokeWidth={6} />
          <circle cx={dx} cy={-66} r={eyeR} fill="#ffffff" stroke={kidTheme.ink} strokeWidth={5} />
          <circle cx={dx - 3} cy={-66} r={4} fill={kidTheme.ink} />
        </g>
      ))}
    </g>
  );
};

export const UNDERGROUND_SCENES: Record<string, React.FC<SceneProps>> = {
  ug_dark: DarkScene,
  ug_worms: WormsScene,
  ug_spring: SpringScene,
};
