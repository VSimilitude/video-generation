import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Drip, KidBackdrop, kidTheme, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import { Splash } from "../../water-cycle/scenes/act3";
import {
  Bubbles,
  Camera,
  PHASE,
  SETTLE_FRAMES,
  WideLayer,
  clamp01,
  lineWindow,
  projectMark,
  stand,
  useEmotion,
  type Mark,
  type SceneProps,
} from "./common";
import { RainField, SmokeRing, Volcano, WaySign, WildCloud } from "./props";

// MOUNTAIN — the second first-branch. A big grey mountain, all by itself, with
// a hat of snow. Drip lands near the top; it is warm; it burps (one smoke
// ring, nothing else moves — its whole performance, ruling 5); a crack, a
// trickle of lava straight down the middle; then the two sides he could race
// down, drawn as routes with LEFT / RIGHT furniture, and the half-choice.
//
// One mountain, drawn once (MOUNTAIN), front-on, for this segment and the race.

export const MOUNTAIN = {
  x: 960,
  baseY: 900,
  h: 760,
  w: 2000,
  /** Where Drip lands, and where both routes start. */
  top: { x: 960, ground: 384 },
  /** The crack the lava comes out of, just below him. */
  crackY: 420,
  /** Where the lava (and both routes) arrive: the foot, at the pond's edge. */
  footY: 896,
} as const;

/** A point along the LEFT route (steep, straight, bumpy), t 0..1. */
export function leftRoute(t: number): { x: number; y: number } {
  const x = MOUNTAIN.top.x - 40 - 420 * t;
  const y = MOUNTAIN.top.ground + (MOUNTAIN.footY - MOUNTAIN.top.ground) * t;
  return { x, y: y - Math.abs(Math.sin(t * Math.PI * 6)) * 36 * (1 - t * 0.3) };
}

/** A point along the RIGHT route (round and round, long and lovely), t 0..1. */
export function rightRoute(t: number): { x: number; y: number } {
  // Loops that always stay right of the lava's line down the middle.
  const swing = (1 - Math.cos(t * Math.PI * 4.5)) * 0.5 * (130 + 170 * t);
  const x = MOUNTAIN.top.x + 50 + 230 * t + swing;
  const y = MOUNTAIN.top.ground + (MOUNTAIN.footY - MOUNTAIN.top.ground) * t;
  return { x, y };
}

const sample = (f: (t: number) => { x: number; y: number }, n = 80) =>
  Array.from({ length: n + 1 }, (_, i) => f(i / n))
    .map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

/** The two routes drawn on the face: a bumpy chute and a winding path. */
export const Routes: React.FC<{ left: number; right: number; glow?: number }> = ({ left, right, glow = 0 }) => (
  <g>
    {left > 0.01 ? (
      <g opacity={left}>
        <path d={sample(leftRoute)} stroke="#5d5964" strokeWidth={46 + glow * 8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={sample(leftRoute)} stroke="#c9c4cf" strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ) : null}
    {right > 0.01 ? (
      <g opacity={right}>
        <path d={sample(rightRoute, 140)} stroke="#5d5964" strokeWidth={46 + glow * 8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={sample(rightRoute, 140)} stroke="#d9e6b5" strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ) : null}
  </g>
);

/** The mountain with everything on it, for any shot in this segment or the race. */
export const MountainWorld: React.FC<{ lava: number; glow?: number; children?: React.ReactNode }> = ({ lava, glow = 0, children }) => (
  <g>
    <path d="M -1200 760 Q 0 640 900 720 Q 1800 800 3200 700 L 3200 1700 L -1200 1700 Z" fill={kidTheme.grass} stroke={kidTheme.grassDark} strokeWidth={10} />
    <Volcano
      x={MOUNTAIN.x}
      baseY={MOUNTAIN.baseY + 60}
      h={MOUNTAIN.h + 60}
      w={MOUNTAIN.w}
      lava={lava}
      glow={glow}
      lavaTop={MOUNTAIN.crackY}
      lavaBottom={MOUNTAIN.footY}
    />
    {children}
  </g>
);

const TOP_SCALE = 0.42;
const CLOSE = { x: 960, y: 215, zoom: 1.6 };

// ---------------------------------------------------------------------------
// Scene 1 — the cloud lets go, and the mountain is warm
// ---------------------------------------------------------------------------

const S1_BUBBLES: Record<string, string> = {
  mo_02_drip: "Everybody out! I am in charge!",
  mo_04_drip: "This mountain is WARM.",
};

const LandScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [goFrom, goTo] = lineWindow(scene, "mo_01_narrator");
  const [, outTo] = lineWindow(scene, "mo_02_drip");
  const [landFrom, landTo] = lineWindow(scene, "mo_03_narrator");
  const rainAt = Math.round(goFrom + (goTo - goFrom) * 0.7);
  // "Sploosh." sits ~60% into mo_03; "warm" at its end.
  const splooshAt = Math.round(landFrom + (landTo - landFrom) * 0.6);
  const warmAt = Math.round(landFrom + (landTo - landFrom) * 0.85);
  const rain = clamp01((frame - rainAt) / 20);
  // Wide on the cloud and the mountain; push in to the summit as he falls.
  const zoom = interpolate(frame, [outTo, splooshAt - 6], [0.85, CLOSE.zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cam = { x: CLOSE.x, y: interpolate(zoom, [0.85, CLOSE.zoom], [600, CLOSE.y]), zoom };
  // In the cloud (his shout), then falling, then down near the top.
  const inCloudY = 170;
  const fallY = interpolate(frame, [outTo, splooshAt], [inCloudY, MOUNTAIN.top.ground], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const ground = frame < outTo ? inCloudY : fallY;
  const landed = frame >= splooshAt;
  const squash = landed ? Math.sin(clamp01((frame - splooshAt) / 14) * Math.PI) * 0.7 : 0;
  const shimmer = clamp01((frame - warmAt) / 20);
  const dripMark: Mark = { x: MOUNTAIN.top.x, y: stand("drip", ground), scale: TOP_SCALE, who: "drip" };
  const emotion = useEmotion(scene, "drip", { mo_02_drip: "excited", mo_04_drip: "skeptical" }, "excited");

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={cam}>
        <WideLayer>
          <MountainWorld lava={0}>
            <HeatShimmer u={shimmer} />
          </MountainWorld>
          <RainField x0={680} x1={1240} y0={180} y1={880} strength={rain * (1 - clamp01((frame - splooshAt) / 16))} count={30} />
          {/* Rained out, the cloud thins and drifts off after the landing. */}
          <g opacity={1 - clamp01((frame - splooshAt) / 40)} transform={`translate(${clamp01((frame - splooshAt) / 60) * 300} 0)`}>
            <WildCloud x={960} y={110} w={760} h={210} grey={0.7} faces={10} />
          </g>
        </WideLayer>
        <Camera cam={{ x: dripMark.x, y: ground, zoom: 1 + squash * 0.2, zoomY: 1 - squash * 0.25 }}>
          <Drip
            x={dripMark.x}
            y={dripMark.y}
            scale={TOP_SCALE}
            emotion={emotion}
            speaking={useSpeaking(scene, "drip")}
            phase={PHASE.drip}
            shadow={landed}
            pose={frame < splooshAt ? "cheer" : undefined}
            look="camera"
          />
        </Camera>
      </Camera>
      {frame >= splooshAt && frame < splooshAt + 34 ? <SplashAt cam={cam} from={splooshAt} /> : null}
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(cam, dripMark) }}
        text={S1_BUBBLES}
        at={{
          mo_02_drip: { x: 1380, y: 330, tail: "left", tailAt: 1000 },
          mo_04_drip: { x: 1420, y: 260, tail: "left", tailAt: 1060 },
        }}
      />
    </AbsoluteFill>
  );
};

const SplashAt: React.FC<{ cam: { x: number; y: number; zoom: number }; from: number }> = ({ cam, from }) => {
  const p = projectMark(cam, { x: MOUNTAIN.top.x, y: MOUNTAIN.top.ground - 190, scale: 1, who: "drip" });
  return <Splash x={p.x} y={p.y + 190 * (cam.zoom ?? 1) - 10} from={from} />;
};

/** Wavy lines rising off a warm slope. */
const HeatShimmer: React.FC<{ u: number }> = ({ u }) => {
  const frame = useCurrentFrame();
  if (u <= 0.01) return null;
  return (
    <g opacity={u * 0.8}>
      {[-150, -60, 60, 150].map((dx, i) => {
        const t = (frame / 40 + i * 0.27) % 1;
        const y = MOUNTAIN.top.ground + 40 - t * 140;
        return (
          <path
            key={dx}
            d={`M ${MOUNTAIN.top.x + dx} ${y} q 12 -14 0 -28 q -12 -14 0 -28 q 12 -14 0 -28`}
            stroke="#ff9a3c"
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
            opacity={Math.sin(t * Math.PI)}
          />
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — the burp, the volcano, the lava, RACE YOU
// ---------------------------------------------------------------------------

const S2_BUBBLES: Record<string, string> = {
  mo_07_drip: "It is GLOWING! RACE YOU!",
};

const BurpScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, burpTo] = lineWindow(scene, "mo_05_narrator");
  const [factFrom, factTo] = lineWindow(scene, "mo_06_narrator");
  const [raceFrom] = lineWindow(scene, "mo_07_drip");
  const span = factTo - factFrom;
  // The ring goes on the silence right after "burped" (ruling 5: once).
  const ring = (frame - (burpTo - 6)) / 60;
  const glowAt = Math.round(factFrom + span * 0.06);
  const crackAt = Math.round(factFrom + span * 0.36);
  const lava = interpolate(frame, [crackAt, factTo + 10, raceFrom + 160], [0, 0.45, 0.62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = clamp01((frame - glowAt) / 30);
  // Close on the summit through the burp; pull back as the lava "went
  // downhill, because everything does".
  const zoom = interpolate(frame, [Math.round(factFrom + span * 0.75), factTo], [CLOSE.zoom, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cam = { x: CLOSE.x, y: interpolate(zoom, [1.2, CLOSE.zoom], [500, CLOSE.y]), zoom };
  const dripMark: Mark = { x: MOUNTAIN.top.x, y: stand("drip", MOUNTAIN.top.ground), scale: TOP_SCALE, who: "drip" };
  const mapped = useEmotion(scene, "drip", { mo_07_drip: "excited" }, "skeptical", 6);
  // Before the burp he is still skeptical; the burp itself: nothing moves.
  const emotion: EmotionInput = frame < crackAt ? "skeptical" : mapped;
  const still = frame < factFrom;

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={cam}>
        <WideLayer>
          <MountainWorld lava={lava} glow={glow} />
          <SmokeRing x={MOUNTAIN.x} y={MOUNTAIN.baseY + 60 - (MOUNTAIN.h + 60) + 6} u={ring} />
        </WideLayer>
        <Drip
          x={dripMark.x + 70}
          y={dripMark.y}
          scale={TOP_SCALE}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          idle={still ? 0.3 : 1}
          eyeLife={still ? 0 : 1}
          pose={frame >= raceFrom ? "cheer" : undefined}
          look={frame >= crackAt ? "down" : ring > 0 && ring < 1 ? "up" : "camera"}
        />
      </Camera>
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(cam, { ...dripMark, x: dripMark.x + 70 }) }}
        text={S2_BUBBLES}
        at={{ mo_07_drip: { x: 1420, y: 230, tail: "left" } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — two sides, and the half-choice
// ---------------------------------------------------------------------------

const S3_BUBBLES: Record<string, string> = {
  mo_09_drip: "Steep? Or lovely? I CANNOT PICK.",
};

const S3_CAM = { x: 960, y: 520, zoom: 1.08 };

const SidesScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [sideFrom, sideTo] = lineWindow(scene, "mo_08_narrator");
  const [pickFrom, pickTo] = lineWindow(scene, "mo_09_drip");
  const [askFrom] = lineWindow(scene, "mo_10_narrator");
  const span = sideTo - sideFrom;
  // "On the left, …" ~48%, "On the right, …" ~72% into mo_08.
  const leftAt = Math.round(sideFrom + span * 0.47);
  const rightAt = Math.round(sideFrom + span * 0.72);
  const left = spring({ frame: frame - leftAt, fps, config: { damping: 12, mass: 0.7 } });
  const right = spring({ frame: frame - rightAt, fps, config: { damping: 12, mass: 0.7 } });
  const glow = frame > askFrom ? 0.5 + 0.5 * Math.sin((frame - askFrom) / 11) : 0;
  // The lava keeps going down the middle, slowly, and stops well short of the
  // foot before the card: a held frame must not be mid-move, so it eases to a
  // stop by the question.
  const lava = interpolate(frame, [0, askFrom - 20], [0.62, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const dripMark: Mark = { x: MOUNTAIN.top.x, y: stand("drip", MOUNTAIN.top.ground), scale: TOP_SCALE, who: "drip" };
  const eyes =
    frame > askFrom - 10
      ? ("camera" as const)
      : frame >= pickFrom && frame < pickFrom + (pickTo - pickFrom) * 0.3
        ? { x: -0.9, y: 0.5 }
        : frame >= pickFrom && frame < pickFrom + (pickTo - pickFrom) * 0.55
          ? { x: 0.9, y: 0.5 }
          : frame >= pickFrom
            ? ("down" as const)
            : frame >= rightAt
              ? { x: 0.9, y: 0.5 }
              : frame >= leftAt
                ? { x: -0.9, y: 0.5 }
                : ("down" as const);
  const settleAt = askFrom - 6;
  const mapped = useEmotion(scene, "drip", { mo_09_drip: "amazed" }, "excited", 4);
  const emotion: EmotionInput =
    frame >= settleAt ? { emotion: "happy", from: "amazed", at: settleAt, frames: 8 } : mapped;

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={S3_CAM}>
        <WideLayer>
          <MountainWorld lava={lava} glow={1}>
            <Routes left={left} right={right} glow={glow} />
          </MountainWorld>
        </WideLayer>
        <Drip
          x={dripMark.x}
          y={dripMark.y}
          scale={TOP_SCALE}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          idle={0.9}
          look={eyes}
        />
      </Camera>
      <WaySign x={330} y={560} s={left} glow={glow} label="LEFT" arrow="left" />
      <WaySign x={1590} y={560} s={right} glow={glow} label="RIGHT" arrow="right" />
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(S3_CAM, dripMark) }}
        text={S3_BUBBLES}
        at={{ mo_09_drip: { x: 1300, y: 190, tail: "left", tailAt: 990 } }}
      />
    </AbsoluteFill>
  );
};

export const MOUNTAIN_SCENES: Record<string, React.FC<SceneProps>> = {
  mo_land: LandScene,
  mo_burp: BurpScene,
  mo_sides: SidesScene,
};

export { SETTLE_FRAMES };
