import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Drip, KidBackdrop, Sunny, kidTheme, lookAt } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  Bird,
  Boat,
  Bubbles,
  CloudPuff,
  PHASE,
  SETTLE_FRAMES,
  SteamWisps,
  WaterBand,
  WideLayer,
  lineWindow,
  midOf,
  stand,
  useEmotion,
  type Cast,
  type Mark,
  type SceneProps,
} from "./common";

// FLOAT — the slow branch. Two scenes: the warming, and the sightseeing.
//
// Everything here is the opposite of the sunbeam branch on purpose: no cut
// flash, no speed streaks, no camera shove. The mechanism (warm water, a drop
// gets lighter, it rises) is the same one episode one teaches, run at a
// gentler speed — this branch's whole claim is that the slow way shows you
// more, so the frame has things in it to see.
//
// Both scenes open on a held pose for the first `SETTLE_FRAMES`: the player's
// segment-boundary detection can overshoot and show those frames.

const SURFACE = 780;

// ---------------------------------------------------------------------------
// Scene 1 — the gentle warming
// ---------------------------------------------------------------------------

const S1_X = 720;
const S1_GROUND = SURFACE + 90;
const S1_SCALE = 1.05;
const S1_SUNNY = { x: 1620, y: stand("sunny", 400), scale: 0.72 };

const S1_BUBBLES: Record<string, string> = {
  fl_02_drip: "Going up. Very politely.",
};

const WarmScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [warmFrom, warmTo] = lineWindow(scene, "fl_01_narrator");
  const [upFrom] = lineWindow(scene, "fl_02_drip");

  // One number for the whole scene: the water heats, the steam thickens and
  // the drop gets lighter together, because they are the same claim.
  // Capped at 0.75 on purpose: `WaterBand`'s warmth mixes the blues towards a
  // warm light, and at full strength with these rays over it the sea goes
  // olive and reads as a grass field (docs/STYLE.md has the same warning from
  // episode one's first pass).
  const heat = interpolate(frame, [Math.max(SETTLE_FRAMES, warmFrom + 20), warmTo], [0.05, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lift = interpolate(frame, [upFrom - 14, scene.durationInFrames], [0, 210], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const y = stand("drip", S1_GROUND) - lift;
  const sway = Math.sin(frame / 22) * 9 * Math.min(1, lift / 60);

  const cast: Cast = {
    drip: { x: S1_X, y, scale: S1_SCALE, who: "drip", side: "right" },
  };
  const dripMid = { x: S1_X, y: midOf("drip", y, S1_SCALE) };
  const sunnyMid = { x: S1_SUNNY.x, y: midOf("sunny", S1_SUNNY.y, S1_SUNNY.scale) };

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      {/* Soft, wide rays — the same energy as the sunbeam, spread out. */}
      <WideLayer opacity={heat}>
        {Array.from({ length: 4 }, (_, i) => {
          const landing = 1620 - i * 440;
          const w = 60 + (i % 2) * 26;
          // The rays stop AT the surface. Running them past it stacks yellow
          // over blue water and turns the sea green.
          const reach = SURFACE + 30;
          return (
            <path
              key={i}
              d={
                `M ${sunnyMid.x - w * 0.5} ${sunnyMid.y} L ${sunnyMid.x + w * 0.5} ${sunnyMid.y}` +
                ` L ${landing + w * 1.5} ${reach} L ${landing - w * 1.5} ${reach} Z`
              }
              fill={kidTheme.sunLight}
              opacity={0.09 + 0.035 * Math.sin(frame / 24 + i)}
            />
          );
        })}
      </WideLayer>
      <Sunny
        x={S1_SUNNY.x}
        y={S1_SUNNY.y}
        scale={S1_SUNNY.scale}
        emotion="happy"
        phase={PHASE.sunny}
        shades={1}
        look={{ x: -0.6, y: 0.5 }}
      />
      <WaterBand top={SURFACE} warmth={heat} />
      <WideLayer opacity={Math.max(0, (heat - 0.3) / 0.7)}>
        <SteamWisps x={380} y={SURFACE + 60} count={3} scale={0.9} />
        <SteamWisps x={1240} y={SURFACE + 110} count={3} scale={0.8} phase={0.4} />
        <SteamWisps x={1660} y={SURFACE + 40} count={2} scale={0.7} phase={0.7} />
      </WideLayer>
      <Drip
        x={S1_X + sway}
        y={y}
        scale={S1_SCALE}
        emotion={useEmotion(scene, "drip", { fl_02_drip: "amazed" }, "happy", 6)}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={0.8}
        look={lift > 40 ? "up" : lookAt(dripMid, sunnyMid, 1200)}
      />
      <Bubbles scene={scene} cast={cast} text={S1_BUBBLES} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — the sightseeing
// ---------------------------------------------------------------------------

// The world is a column: everything declares the altitude it sits at, and
// `sy()` turns that into a screen y. Drip stays framed and the column slides
// down past him, which is what lets his bubble stay above his head through a
// climb of two thousand px.
const S2_EYE = 560;
const S2_X = 760;
const S2_START_ALT = 300;
const S2_TOP_ALT = 2300;
const S2_SCALE = 1.1;
/**
 * Parallax factor for the sea. A thing far below slides down the frame far
 * more slowly than a bird passing at arm's length, and without that the ocean
 * — the one thing the narrator is measuring the climb against — leaves the
 * frame in three seconds and the rest of the scene is empty sky.
 */
const SEA_PARALLAX = 0.22;

const S2_BUBBLES: Record<string, string> = {
  fl_04_drip: "Hello, surprised bird!",
};

const SightsScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const dur = scene.durationInFrames;

  // Eased at both ends and *starting flat*, so the opening frames are a hold.
  const alt = interpolate(frame, [SETTLE_FRAMES, dur], [S2_START_ALT, S2_TOP_ALT], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const sy = (a: number) => S2_EYE + (alt - a);
  const sea = S2_EYE + (alt - 0) * SEA_PARALLAX;
  const far = 1 - (alt - S2_START_ALT) / (S2_TOP_ALT - S2_START_ALT);
  const sway = Math.sin(frame / 26) * 12;
  const y = stand("drip", S2_EYE + 190);
  const [gullFrom] = lineWindow(scene, "fl_04_drip");

  const cast: Cast = {
    drip: { x: S2_X, y, scale: S2_SCALE, who: "drip", side: "right" } as Mark,
  };

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={2} waves={false} />
      {/* The sea, sliding down and shrinking — with the boat on it, getting
          smaller at the same rate the sea does. */}
      <WaterBand top={sea} warmth={0.4} />
      <WideLayer>
        <Boat x={1320} y={sea + 30 * far} scale={0.3 + 0.34 * far} frame={frame} />
        {/* Eleven birds, at four altitudes, all going somewhere else. Their
            lanes avoid the middle of the frame, where Drip is. */}
        {BIRDS.map((b, i) => (
          <Bird
            key={i}
            x={((b.x + frame * b.speed) % 2600) - 340}
            y={sy(b.alt)}
            scale={b.scale}
            phase={i * 1.4}
            frame={frame}
          />
        ))}
        <CloudPuff x={300} y={sy(2050)} w={900} h={220} seed={4} opacity={0.9} />
        <CloudPuff x={1640} y={sy(2400)} w={1100} h={260} seed={8} opacity={0.85} />
        {/* The extremely surprised seagull. He holds station off Drip's right
            shoulder rather than riding the column, because he is the subject of
            the next line and has to be on screen for it — and he is drawn after
            the cloud decks, or the arriving cloud swallows him. */}
        <Bird
          x={1380}
          y={430 + Math.sin(frame / 18) * 12}
          scale={1.5}
          frame={frame}
          startled
          opacity={interpolate(frame, [gullFrom - 40, gullFrom - 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </WideLayer>
      <Drip
        x={S2_X + sway}
        y={y}
        scale={S2_SCALE}
        emotion={useEmotion(scene, "drip", { fl_04_drip: "excited" }, "happy", 6)}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={0.9}
        look={frame > (scene.turns?.[1]?.from ?? dur) ? "right" : "down"}
      />
      <Bubbles scene={scene} cast={cast} text={S2_BUBBLES} />
    </AbsoluteFill>
  );
};

/**
 * Eleven birds. The count is the narrator's, so it has to be right — and they
 * are big enough to read as birds: the first pass had them at half this size
 * and they looked like paperclips.
 */
const BIRDS = [
  { x: 120, alt: 560, scale: 0.8, speed: 1.6 },
  { x: 620, alt: 700, scale: 0.7, speed: 1.6 },
  { x: 1180, alt: 610, scale: 0.76, speed: 1.6 },
  { x: 1560, alt: 980, scale: 0.9, speed: 1.1 },
  { x: 2020, alt: 1090, scale: 0.8, speed: 1.1 },
  { x: 300, alt: 1010, scale: 0.74, speed: 1.1 },
  { x: 900, alt: 1340, scale: 1.0, speed: 0.8 },
  { x: 1740, alt: 1420, scale: 0.9, speed: 0.8 },
  { x: 2140, alt: 1760, scale: 1.05, speed: 0.55 },
  { x: 460, alt: 1880, scale: 1.0, speed: 0.55 },
  { x: 1700, alt: 2120, scale: 1.1, speed: 0.4 },
];

export const FLOAT_SCENES: Record<string, React.FC<SceneProps>> = {
  fl_warm: WarmScene,
  fl_sights: SightsScene,
};
