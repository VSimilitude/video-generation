import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  BlobbyCrowd,
  Drip,
  KidBackdrop,
  Sunny,
  kidTheme,
  lookAt,
  type EmotionInput,
} from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  Bubbles,
  Camera,
  CloudPuff,
  PHASE,
  WaterBand,
  WideLayer,
  lineWindow,
  midOf,
  projectMark,
  stand,
  useEmotion,
  useLookAtSpeaker,
  type Cast,
  type Mark,
  type SceneProps,
} from "./common";

// INTRO — the shared trunk, and the only segment every viewer sees.
//
// Two scenes: home, and the fork. The fork scene is the one with a hard
// contract on it — the site player pauses on its LAST frames and overlays the
// choice card there, so it ends on a held, symmetrical pose (Drip centred
// between the two routes, both routes lit, nothing moving but breath) with a
// generous tail. Anything mid-move on those frames would be frozen under the
// card for as long as the viewer takes to decide.

const SURFACE = 760;

// ---------------------------------------------------------------------------
// Scene 1 — home, in the ocean
// ---------------------------------------------------------------------------

const S1_SCALE = 1.0;
// `y` is a ground line minus half the character's box: CharacterFrame scales
// about the bottom of that box (see CHAR_BOX / stand() in the ep-1 kit).
const S1_DRIP = { x: 700, y: stand("drip", SURFACE + 190) };
const S1_MARK: Mark = { ...S1_DRIP, scale: S1_SCALE, who: "drip", side: "right" };

const S1_BUBBLES: Record<string, string> = {
  in_02_drip: "TRAVEL-SIZED!",
  in_03_drip: "Off to the Cloud Hotel!",
};

const HomeScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, introEnd] = lineWindow(scene, "in_01_narrator");
  const [planFrom] = lineWindow(scene, "in_03_drip");

  // One slow push-in over the whole scene: it starts on the ocean and ends on
  // the drop who is about to have an opinion about it.
  const zoom = interpolate(frame, [0, introEnd, planFrom], [0.92, 1.15, 1.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cam = { x: S1_DRIP.x, y: midOf("drip", S1_DRIP.y, S1_SCALE), zoom };
  const cast: Cast = { drip: projectMark(cam, S1_MARK) };

  return (
    <AbsoluteFill>
      {/* Sky outside the camera: a pull-out below 1x would show past its edge. */}
      <KidBackdrop variant="day" clouds={3} waves={false} />
      {/* The destination, on screen from the first shot — the whole segment is
          about getting to it. */}
      <WideLayer>
        {/* Far right and high: Drip's bubble owns the middle of the top half. */}
        <CloudPuff x={1660} y={200} w={560} h={200} seed={3} windows={4} />
      </WideLayer>
      <Camera cam={cam}>
        <WaterBand top={SURFACE} />
        <WideLayer>
          <BlobbyCrowd count={14} x={980} y={SURFACE + 90} spread={3400} scale={0.5} opacity={0.8} />
          <BlobbyCrowd count={12} x={860} y={SURFACE + 300} spread={3600} scale={0.75} />
          <BlobbyCrowd count={12} x={1060} y={SURFACE + 520} spread={3800} scale={0.95} />
        </WideLayer>
        <Drip
          {...S1_DRIP}
          scale={S1_SCALE}
          emotion={useEmotion(scene, "drip", { in_02_drip: "proud", in_03_drip: "excited" }, "happy")}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          look="camera"
        />
      </Camera>
      <Bubbles scene={scene} cast={cast} text={S1_BUBBLES} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — the fork: two ways up, and the question
// ---------------------------------------------------------------------------

const S2_SCALE = 1.05;
const S2_DRIP = { x: 700, y: stand("drip", SURFACE + 200) };
const S2_MARK: Mark = { ...S2_DRIP, scale: S2_SCALE, who: "drip", side: "right" };
const S2_SUNNY = { x: 1560, y: stand("sunny", 470), scale: 0.9 };

const S2_BUBBLES: Record<string, string> = {
  in_04_sunny: "SUNBEAM EXPRESS! All aboard!",
  in_06_drip: "I cannot pick!",
};

const ForkScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [beamFrom] = lineWindow(scene, "in_04_sunny");
  const [floatFrom] = lineWindow(scene, "in_05_narrator");
  const [askFrom] = lineWindow(scene, "in_07_narrator");

  // Each route lights up under the line that offers it, and both then stay lit
  // for the rest of the scene — the held frames the choice card lands on have
  // to show the viewer both of the things they are choosing between.
  const beam = interpolate(frame, [beamFrom + 8, beamFrom + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = interpolate(frame, [floatFrom + 6, floatFrom + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // A soft pulse on the two routes while the question is being asked. It is a
  // *cycle*, not a ramp, so the last frames of the scene look like any other
  // frame of the hold rather than like the end of a move.
  const glow = frame > askFrom ? 0.5 + 0.5 * Math.sin((frame - askFrom) / 11) : 0;

  const cast: Cast = {
    drip: S2_MARK,
    sunny: { ...S2_SUNNY, who: "sunny", side: "left" },
  };
  const dripMid = { x: S2_DRIP.x, y: midOf("drip", S2_DRIP.y, S2_SCALE) };
  const sunnyMid = { x: S2_SUNNY.x, y: midOf("sunny", S2_SUNNY.y, S2_SUNNY.scale) };
  // Hook first, choose after: a hook behind a ternary is a hook-order bug even
  // when the condition is a pure function of the frame.
  const dripLook = useLookAtSpeaker(scene, cast, "drip");
  // He settles out of the "I cannot pick" face and back into a plain smile
  // before the question, and holds it: the card sits on these frames, and an
  // open-mouthed freeze under it looks like the video crashed. Hand-placed as
  // a cue (`from`/`at`) so it morphs rather than cuts — the rig cannot see the
  // change itself, so whoever decides it hands over the frame.
  const settleAt = askFrom - 6;
  const dripEmotion = useEmotion(scene, "drip", { in_06_drip: "amazed" }, "happy", 4);
  const emotion: EmotionInput =
    frame >= settleAt ? { emotion: "happy", from: "amazed", at: settleAt, frames: 8 } : dripEmotion;

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WideLayer>
        {/* The destination sits between the two routes, clear of Sunny's rays
            on the right and the drop column on the left. */}
        <CloudPuff x={960} y={175} w={520} h={180} seed={3} windows={4} opacity={0.98} />
      </WideLayer>
      {/* Route A — the sunbeam: a fat golden ramp from Sunny to the water. */}
      <WideLayer opacity={beam}>
        {Array.from({ length: 3 }, (_, i) => {
          const w = 74 + i * 26;
          return (
            <path
              key={i}
              d={
                `M ${sunnyMid.x - w * 0.5} ${sunnyMid.y} L ${sunnyMid.x + w * 0.5} ${sunnyMid.y}` +
                ` L ${1360 + w * 1.6} ${SURFACE + 250} L ${1360 - w * 1.6} ${SURFACE + 250} Z`
              }
              fill={kidTheme.sunLight}
              opacity={0.16 + 0.1 * glow + i * 0.05}
            />
          );
        })}
      </WideLayer>
      {/* Route B — the gentle way: a column of little drops going up, slowly,
          on the far side of the frame from the beam. */}
      <WideLayer opacity={drift}>
        {Array.from({ length: 9 }, (_, i) => {
          const rise = ((frame * 0.9 + i * 96) % 860);
          const y = SURFACE + 120 - rise;
          const x = 250 + Math.sin((rise + i * 40) / 130) * 46;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={17 + (i % 3) * 5}
              fill={kidTheme.waterLight}
              stroke={kidTheme.waterDeep}
              strokeWidth={7}
              opacity={(0.45 + 0.35 * glow) * Math.min(1, rise / 120)}
            />
          );
        })}
      </WideLayer>
      <WaterBand top={SURFACE} warmth={0.25 * drift} />
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
      <Drip
        {...S2_DRIP}
        scale={S2_SCALE}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={0.9}
        // He looks at whoever is talking, and back at the camera for the
        // question — the viewer is the one being asked.
        look={frame > askFrom - 10 ? "camera" : dripLook}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S2_BUBBLES}
        // Left of Sunny and low enough to clear the hotel: his own face is the
        // last thing a bubble of his may cover.
        at={{ in_04_sunny: { x: 900, y: 430, tail: "right" } }}
      />
    </AbsoluteFill>
  );
};

export const INTRO_SCENES: Record<string, React.FC<SceneProps>> = {
  in_home: HomeScene,
  in_fork: ForkScene,
};
