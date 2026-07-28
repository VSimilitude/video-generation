import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Drip, KidBackdrop, Sunny, kidTheme, lookAt } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  Bubbles,
  CHAR_BOX,
  Camera,
  CloudPuff,
  CutFlash,
  PHASE,
  SETTLE_FRAMES,
  SpeedStreaks,
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

// SUNBEAM — the fast branch. Two scenes: the launch and the arrival.
//
// Both open on a held pose (nothing enters, nothing is mid-move) for the first
// `SETTLE_FRAMES`, because the site player's segment-boundary detection can
// overshoot and put those frames on screen before the seek lands.

const SURFACE = 780;

// ---------------------------------------------------------------------------
// Scene 1 — the launch
// ---------------------------------------------------------------------------

const S1_X = 760;
const S1_GROUND = SURFACE + 60;
const S1_SCALE = 1.05;
const S1_SUNNY = { x: 1580, y: stand("sunny", 430), scale: 0.9 };

const S1_BUBBLES: Record<string, string> = {
  sa_01_sunny: "NOW BOARDING!",
  sa_02_drip: "My feet are LEAVING!",
};

const LaunchScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [boardFrom, boardTo] = lineWindow(scene, "sa_01_sunny");
  const [whooshFrom] = lineWindow(scene, "sa_02_drip");

  // The launch frame: on the word, not on the scene. Never before the settle.
  const goAt = Math.max(SETTLE_FRAMES + 6, Math.min(boardTo, whooshFrom - 6));

  const beam = interpolate(frame, [boardFrom + 10, goAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // He climbs a little and the *ocean falls away* a lot — the ep-1 liftoff
  // trick, and the only way a bubble stays above his head through an ascent.
  const rise = interpolate(frame, [goAt, goAt + 40], [0, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const fall = interpolate(frame, [goAt, goAt + 115], [0, 1500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const speed = interpolate(frame, [goAt, goAt + 12, goAt + 80], [0, 1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The thwip: a vertical stretch about his feet, so it pulls him off the
  // surface instead of sliding him through it.
  const since = frame - goAt;
  const stretch = since >= 0 && since < 18 ? 1 + 0.6 * Math.sin((since / 18) * Math.PI) : 1;

  const y = stand("drip", S1_GROUND) - rise;
  const cast: Cast = {
    drip: { x: S1_X, y, scale: S1_SCALE, who: "drip", side: "right" },
    sunny: { ...S1_SUNNY, who: "sunny", side: "left" },
  };
  const sunnyMid = { x: S1_SUNNY.x, y: midOf("sunny", S1_SUNNY.y, S1_SUNNY.scale) };

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WaterBand top={SURFACE + fall} warmth={0.6} />
      {/* The beam he rides. Its foot is his own feet, not a fixed point on the
          water: he is riding the thing, so it has to stay under him all the way
          up (the first pass anchored it to the sea and he floated off it). */}
      <WideLayer opacity={beam}>
        {Array.from({ length: 3 }, (_, i) => {
          const w = 90 + i * 34;
          const foot = Math.min(S1_GROUND + 120, y + CHAR_BOX.drip / 2 + 30);
          return (
            <path
              key={i}
              d={
                `M ${sunnyMid.x - w * 0.5} ${sunnyMid.y} L ${sunnyMid.x + w * 0.5} ${sunnyMid.y}` +
                ` L ${S1_X + w * 1.7} ${foot} L ${S1_X - w * 1.7} ${foot} Z`
              }
              fill={kidTheme.sunLight}
              opacity={0.14 + i * 0.06}
            />
          );
        })}
      </WideLayer>
      <WideLayer>
        <SpeedStreaks strength={speed} frame={frame} />
      </WideLayer>
      <Camera cam={{ x: S1_X, y: y + CHAR_BOX.drip / 2, zoomY: stretch, zoom: 1 - (stretch - 1) * 0.25 }}>
        <Drip
          x={S1_X}
          y={y}
          scale={S1_SCALE}
          emotion={useEmotion(scene, "drip", { sa_02_drip: "excited" }, "amazed", 6)}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          idle={frame < goAt ? 0.5 : 1.5}
          look={frame < goAt ? "upRight" : "up"}
        />
      </Camera>
      <Sunny
        x={S1_SUNNY.x}
        y={S1_SUNNY.y}
        scale={S1_SUNNY.scale}
        emotion="proud"
        speaking={useSpeaking(scene, "sunny")}
        phase={PHASE.sunny}
        shades={1}
        look={{ x: -0.7, y: 0.4 }}
      />
      <CutFlash at={goAt} strength={0.6} />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S1_BUBBLES}
        at={{ sa_01_sunny: { x: 1080, y: 250, tail: "right" } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — arrival at cloud level, dizzy and delighted
// ---------------------------------------------------------------------------

const S2_DRIP = { x: 660, y: stand("drip", 700) };
const S2_SCALE = 1.15;
const S2_MARK: Mark = { ...S2_DRIP, scale: S2_SCALE, who: "drip", side: "right" };
const S2_SUNNY = { x: 1620, y: stand("sunny", 470), scale: 1.0 };

const S2_BUBBLES: Record<string, string> = {
  sa_04_sunny: "ALL me. Every bit!",
  sa_05_drip: "I saw a bird. Probably.",
};

const ArriveScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, creditTo] = lineWindow(scene, "sa_04_sunny");

  // Still spinning a little from the ride. A *cycle*, so frame zero looks like
  // any other frame of it — the opening frames are settled by construction.
  const dizzy = interpolate(frame, [0, creditTo], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wobble = Math.sin(frame / 6) * 7 * dizzy;
  const drift = Math.sin(frame / 9 + 1) * 10 * dizzy;

  const cast: Cast = { drip: S2_MARK, sunny: { ...S2_SUNNY, who: "sunny", side: "left" } };
  const dripMid = { x: S2_DRIP.x, y: midOf("drip", S2_DRIP.y, S2_SCALE) };
  const sunnyMid = { x: S2_SUNNY.x, y: midOf("sunny", S2_SUNNY.y, S2_SUNNY.scale) };

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={2} waves={false} />
      {/* Cloud tops, well below him: we are at hotel altitude now. */}
      <WideLayer>
        <CloudPuff x={420} y={980} w={1500} h={300} seed={5} opacity={0.95} />
        <CloudPuff x={1560} y={1050} w={1300} h={280} seed={9} opacity={0.9} />
        <CloudPuff x={1120} y={880} w={700} h={180} seed={2} opacity={0.55} />
      </WideLayer>
      <Drip
        x={S2_DRIP.x + drift}
        y={S2_DRIP.y}
        scale={S2_SCALE}
        emotion={useEmotion(scene, "drip", { sa_05_drip: "excited" }, "amazed", 6)}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={1.2}
        look={lookAt(dripMid, sunnyMid, 1200)}
      />
      <DizzyStars x={S2_DRIP.x + drift} y={midOf("drip", S2_DRIP.y, S2_SCALE) - 180} u={dizzy} frame={frame} tilt={wobble} />
      <Sunny
        x={S2_SUNNY.x}
        y={S2_SUNNY.y}
        scale={S2_SUNNY.scale}
        emotion="proud"
        speaking={useSpeaking(scene, "sunny")}
        phase={PHASE.sunny}
        shades={1}
        look={lookAt(sunnyMid, dripMid, 1200)}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S2_BUBBLES}
        at={{ sa_04_sunny: { x: 1120, y: 280, tail: "right" } }}
      />
    </AbsoluteFill>
  );
};

/** The classic ring of stars over a dizzy head. */
const DizzyStars: React.FC<{
  x: number;
  y: number;
  u: number;
  frame: number;
  tilt: number;
}> = ({ x, y, u, frame, tilt }) => {
  if (u <= 0.02) return null;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      <g transform={`rotate(${tilt})`}>
        {Array.from({ length: 5 }, (_, i) => {
          const ang = (i / 5) * Math.PI * 2 + frame / 12;
          const px = Math.cos(ang) * 130;
          const py = Math.sin(ang) * 34;
          const a = 20 + 6 * Math.sin(frame / 7 + i);
          return (
            <path
              key={i}
              transform={`translate(${px} ${py})`}
              d={`M 0 ${-a} L ${a * 0.28} ${-a * 0.28} L ${a} 0 L ${a * 0.28} ${a * 0.28} L 0 ${a} L ${-a * 0.28} ${a * 0.28} L ${-a} 0 L ${-a * 0.28} ${-a * 0.28} Z`}
              fill={kidTheme.star}
              stroke={kidTheme.ink}
              strokeWidth={5}
              strokeLinejoin="round"
              opacity={u * (0.55 + 0.45 * Math.sin(frame / 9 + i))}
            />
          );
        })}
      </g>
    </svg>
  );
};

export const SUNBEAM_SCENES: Record<string, React.FC<SceneProps>> = {
  sa_launch: LaunchScene,
  sa_arrive: ArriveScene,
};
