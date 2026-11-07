import React from "react";
import { AbsoluteFill, Series, useCurrentFrame } from "remotion";
import {
  Drip,
  KidBackdrop,
  SpeechBubble,
  Stepped,
  Sunny,
  emotionAt,
  kidEase,
  kidOutline,
  kidTheme,
  kidType,
  lookAt,
  moveAlong,
  type EmotionCue,
} from "../../lib/kid";
import {
  DialogueAudio,
  buildTimeline,
  isSpeaking,
  type TimedScene,
} from "../../lib/narration";
import { NARRATION as DRIP_AGAIN } from "../drip-again/narrationManifest";

// step-demo — the A/B for stepped timing (docs/ANIMATION-ROADMAP.md, Step 1).
//
// Hidden workbench composition, like kid-demo. The SAME 8-second beat plays
// four times: on ones (30 poses/s), on twos (15/s), on threes (10/s), then a
// split screen ONES | TWOS. Only the character layer (Drip, Sunny, the bubble)
// sits inside `<Stepped>`; the sky, the clouds, the drifting extra cloud, the
// labels and the audio stay on ones — "smooth world, stepped characters".
//
// Drip's line is borrowed from drip-again (in_08_drip, ~3.1 s) the way
// kid-demo borrows pipeline-demo's clips: the point is the mouth timing.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** One pass of the beat, in frames. */
const BEAT = 240;

// Beat cue sheet, frames local to a pass.
const ENTER_AT = 0;
const TRAVEL_AT = 34;
const TRAVEL_FRAMES = 66;
const EXCITED_AT = TRAVEL_AT + TRAVEL_FRAMES - 2;
const SPEAK_AT = 110;
const SUNNY_REACT_AT = 150;
const EXIT_AT = 214;

const MARK_A = { x: 340, y: 740 };
const MARK_B = { x: 980, y: 720 };
const SUNNY = { x: 1580, y: 560 };

const LINE = DRIP_AGAIN.in_08_drip;
const LINE_TEXT = "No hotel. No rules. No Kevin.";

type Pass = { id: string; label: string; n: number | "split" };

const PASSES: Pass[] = [
  { id: "ones", label: "ONES — 30 poses/s", n: 1 },
  { id: "twos", label: "TWOS — 15 poses/s", n: 2 },
  { id: "threes", label: "THREES — 10 poses/s", n: 3 },
  { id: "split", label: "ONES | TWOS", n: "split" },
];

export function timeline() {
  const t = buildTimeline(
    PASSES.map((p) => ({
      id: p.id,
      turns: [{ clip: LINE, speaker: "drip" }],
      minFrames: BEAT,
    })),
    FPS,
  );
  // buildTimeline lays the first turn at frame 0; this beat wants the line
  // after Drip has landed, so shift it. The pass stays BEAT long (the line
  // plus its tail ends well before frame 240).
  return {
    durationInFrames: t.durationInFrames,
    scenes: t.scenes.map((s) => ({
      ...s,
      turns: (s.turns ?? []).map((turn) => ({ ...turn, from: turn.from + SPEAK_AT })),
    })),
  };
}

/**
 * The character layer. Everything frame-driven for the cast — the arc, the
 * emotion cues, the look target, the mouth — reads `useCurrentFrame()` HERE,
 * inside the Stepped subtree, so the travel steps along with the pose.
 */
const Cast: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const travel = moveAlong(MARK_A, MARK_B, (frame - TRAVEL_AT) / TRAVEL_FRAMES, {
    arc: 0.32,
    ease: kidEase.easeInOutSine,
  });
  const drip = { x: travel.x, y: travel.y };
  const dripEmotion: EmotionCue = { emotion: "excited", from: "neutral", at: EXCITED_AT };
  const talking = isSpeaking(scene, "drip", frame);
  const sunnyEmotion = emotionAt(frame, [{ at: SUNNY_REACT_AT, emotion: "skeptical" }], "happy");
  const sunnyLook =
    frame < TRAVEL_AT || frame >= EXIT_AT + 10 ? ("camera" as const) : lookAt(SUNNY, drip);
  const turn = scene.turns?.[0];
  return (
    <>
      <Drip
        x={drip.x}
        y={drip.y}
        scale={1.15}
        emotion={dripEmotion}
        speaking={talking}
        phase={0}
        look={frame < SPEAK_AT ? "right" : lookAt(drip, SUNNY)}
        enter={{ at: ENTER_AT, kind: "bounce" }}
        exit={{ at: EXIT_AT, kind: "zip", dir: "left" }}
      />
      <Sunny
        x={SUNNY.x}
        y={SUNNY.y}
        scale={1}
        emotion={sunnyEmotion}
        phase={3.4}
        look={sunnyLook}
      />
      {turn ? (
        <SpeechBubble
          x={MARK_B.x + 120}
          y={330}
          text={LINE_TEXT}
          tail="left"
          tailAt={MARK_B.x + 20}
          from={turn.from}
          until={turn.from + turn.durationInFrames}
        />
      ) : null}
    </>
  );
};

/** A big cloud that drifts smoothly over the top of the frame, on ones always. */
const DriftCloud: React.FC = () => {
  const frame = useCurrentFrame();
  const x = -300 + frame * 2.4;
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g transform={`translate(${x} 150) scale(1.1)`} opacity={0.8}>
        <ellipse cx={0} cy={0} rx={150} ry={62} fill="#ffffff" />
        <circle cx={-62} cy={-22} r={62} fill="#ffffff" />
        <circle cx={18} cy={-46} r={78} fill="#ffffff" />
        <circle cx={92} cy={-16} r={56} fill="#ffffff" />
      </g>
    </svg>
  );
};

/** The whole beat at 1920×1080: smooth world, stepped cast. */
const Beat: React.FC<{ scene: TimedScene; n: number }> = ({ scene, n }) => (
  <KidBackdrop variant="day" clouds={3} ground>
    <DriftCloud />
    <Stepped n={n}>
      <Cast scene={scene} />
    </Stepped>
  </KidBackdrop>
);

const Label: React.FC<{ text: string; x?: number; y?: number; size?: number }> = ({
  text,
  x = 64,
  y = 48,
  size = 80,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontFamily: kidTheme.fontFamily,
      fontSize: size,
      fontWeight: 900,
      letterSpacing: 3,
      color: kidTheme.ink,
      textShadow: kidOutline(5),
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

/** One half of the split screen: the full beat at half scale, letterboxed. */
const Pane: React.FC<{ scene: TimedScene; n: number; left: number; label: string }> = ({
  scene,
  n,
  left,
  label,
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top: 0,
      width: WIDTH / 2,
      height: HEIGHT,
      overflow: "hidden",
      background: kidTheme.inkSoft,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: HEIGHT / 4,
        width: WIDTH,
        height: HEIGHT,
        transform: "scale(0.5)",
        transformOrigin: "0 0",
      }}
    >
      <Beat scene={scene} n={n} />
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: HEIGHT / 4 + HEIGHT / 2 + 40,
        textAlign: "center",
        fontFamily: kidTheme.fontFamily,
        fontSize: kidType.label,
        fontWeight: 900,
        letterSpacing: 3,
        color: kidTheme.paper,
      }}
    >
      {label}
    </div>
  </div>
);

const SplitPass: React.FC<{ scene: TimedScene; label: string }> = ({ scene, label }) => (
  <AbsoluteFill style={{ background: kidTheme.inkSoft }}>
    <Pane scene={scene} n={1} left={0} label="ONES · 30/s" />
    <Pane scene={scene} n={2} left={WIDTH / 2} label="TWOS · 15/s" />
    <div
      style={{
        position: "absolute",
        left: WIDTH / 2 - 2,
        top: 0,
        width: 4,
        height: HEIGHT,
        background: kidTheme.paper,
      }}
    />
    <Label text={label} />
  </AbsoluteFill>
);

export const StepDemoVideo: React.FC = () => {
  const { scenes } = timeline();
  return (
    <Series>
      {scenes.map((scene, i) => {
        const pass = PASSES[i];
        return (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
            {/* Audio is OUTSIDE Stepped, always. */}
            <DialogueAudio scene={scene} />
            {pass.n === "split" ? (
              <SplitPass scene={scene} label={pass.label} />
            ) : (
              <AbsoluteFill>
                <Beat scene={scene} n={pass.n} />
                <Label text={pass.label} />
              </AbsoluteFill>
            )}
          </Series.Sequence>
        );
      })}
    </Series>
  );
};
