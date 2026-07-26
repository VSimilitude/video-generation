import React from "react";
import { Series, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Blobby,
  BlobbyCrowd,
  Cloudia,
  Drip,
  KidBackdrop,
  SpeechBubble,
  Sunny,
  WordCard,
  kidOutline,
  kidTheme,
  kidEase,
  kidType,
  lookAt,
  moveAlong,
  type Emotion,
  type EmotionInput,
} from "../../lib/kid";
import {
  DialogueAudio,
  buildTimeline,
  isSpeaking,
  type TimedScene,
} from "../../lib/narration";
import { NARRATION as PIPELINE } from "../pipeline-demo/narrationManifest";

// kid-demo — the showcase/regression composition for src/lib/kid/.
//
// It is not an episode and it is `hidden` in the registry: it exists so every
// piece of the kid toolkit can be rendered as a still and *looked at*, which is
// the only review that catches a face that doesn't read (see the still-review
// entry in docs/LEARNINGS.md).
//
// The dialogue scene borrows pipeline-demo's clips as stand-in audio. The words
// are wrong — it's the pipeline video's script — but the point is that the
// mouth of the character whose turn it is opens for exactly the length of that
// turn, which is a timing claim, not a content one.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

const CAST = {
  drip: { x: 380, y: 650 },
  cloudia: { x: 1030, y: 350 },
  sunny: { x: 1560, y: 545 },
};

export function timeline() {
  return buildTimeline(
    [
      { id: "cast", minFrames: 150 },
      {
        id: "chat",
        turns: [
          { clip: PIPELINE.intro, speaker: "drip" },
          { clip: PIPELINE.outro, speaker: "sunny", gapFrames: 12 },
        ],
        minFrames: 120,
      },
      { id: "portraits", minFrames: 240 },
      { id: "emotions", minFrames: 300 },
      { id: "bigword", minFrames: 150 },
      { id: "sea", minFrames: 150 },
    ],
    FPS,
  );
}

const EMOTION_CYCLE: Emotion[] = [
  "happy",
  "excited",
  "amazed",
  "scared",
  "grumpy",
  "proud",
];

/** Cast line-up: everyone bounces in, looks at each other, name plates land. */
const CastScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Drip
        {...CAST.drip}
        scale={1.15}
        emotion="happy"
        phase={0}
        look={lookAt(CAST.drip, CAST.cloudia)}
        enter={{ at: 0, kind: "bounce" }}
      />
      <Cloudia
        {...CAST.cloudia}
        scale={1.05}
        emotion="happy"
        phase={1.9}
        clipboard
        look={lookAt(CAST.cloudia, CAST.drip)}
        enter={{ at: 10, kind: "bounce" }}
      />
      <Sunny
        {...CAST.sunny}
        scale={1}
        emotion="proud"
        phase={3.4}
        shades={0.7}
        look={lookAt(CAST.sunny, CAST.drip)}
        enter={{ at: 20, kind: "bounce" }}
      />
      <NamePlate x={CAST.drip.x} y={940} text="DRIP" at={40} color={kidTheme.water} />
      <NamePlate x={CAST.cloudia.x} y={940} text="CLOUDIA" at={50} color={kidTheme.purple} />
      <NamePlate x={CAST.sunny.x} y={940} text="SUNNY" at={60} color={kidTheme.sun} />
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <BlobbyCrowd count={6} x={1150} y={1000} spread={900} scale={0.6} opacity={0.95} />
      </svg>
      {frame > 70 ? (
        <SpeechBubble x={560} y={300} text="Hi! I'm Drip." tail="left" from={70} />
      ) : null}
    </>
  );
};

const NamePlate: React.FC<{
  x: number;
  y: number;
  text: string;
  at: number;
  color: string;
}> = ({ x, y, text, at, color }) => {
  const frame = useCurrentFrame();
  const u = Math.max(0, Math.min(1, (frame - at) / 10));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * u})`,
        opacity: u,
        fontSize: kidType.label,
        fontWeight: 900,
        letterSpacing: 3,
        color,
        textShadow: kidOutline(4),
      }}
    >
      {text}
    </div>
  );
};

/** Two characters trading lines; only the current speaker's mouth moves. */
const ChatScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const dripTalks = isSpeaking(scene, "drip", frame);
  const sunnyTalks = isSpeaking(scene, "sunny", frame);
  // Each bubble is up for exactly its speaker's turn: [from, from+duration).
  const turns = scene.turns ?? [];
  const win = (i: number): { from: number; until: number } =>
    turns[i]
      ? { from: turns[i].from, until: turns[i].from + turns[i].durationInFrames }
      : { from: 0, until: 0 };
  return (
    <>
      <Drip
        x={520}
        y={700}
        scale={1.25}
        emotion={dripTalks ? "excited" : "happy"}
        speaking={dripTalks}
        phase={0}
        look={{ x: 0.75, y: -0.35 }}
      />
      <Sunny
        x={1440}
        y={520}
        scale={1.05}
        emotion={sunnyTalks ? "proud" : "grumpy"}
        speaking={sunnyTalks}
        phase={3.4}
        shades={sunnyTalks ? 0.85 : 0}
        look={{ x: -0.8, y: 0.4 }}
      />
      <SpeechBubble x={800} y={320} text="It is SO hot!" tail="left" {...win(0)} />
      <SpeechBubble x={1080} y={200} text="You're welcome." tail="right" {...win(1)} />
    </>
  );
};

/**
 * One character at a time, big, with a line — the view you actually need to
 * judge whether a face reads. 80 frames each.
 */
const PortraitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const slot = Math.min(2, Math.floor(frame / 80));
  const local = frame - slot * 80;
  if (slot === 0) {
    return (
      <>
        <Drip
          x={640}
          y={640}
          scale={2}
          emotion="proud"
          phase={0}
          look={{ x: 0.45, y: -0.15 }}
          enter={{ at: 0, kind: "bounce" }}
        />
        <SpeechBubble x={1330} y={330} text="I'm small. So what?" tail="left" from={local + 14} />
      </>
    );
  }
  if (slot === 1) {
    return (
      <>
        <Cloudia
          x={880}
          y={480}
          scale={1.5}
          emotion="grumpy"
          phase={1.1}
          fill={0.82}
          clipboard
          look={{ x: 0.5, y: 0.2 }}
          // `at` is the slot's own start, not 0: this scene swaps character at
          // frame 80, so an entrance keyed to the scene start is already over
          // before the character it belongs to is on screen.
          enter={{ at: 80, kind: "pop" }}
        />
        {/* Tail on the side the speaker is on, and the bubble above her, so
            the tail points back at the character rather than into the sky. */}
        <SpeechBubble x={1500} y={230} text="Full up. Sorry!" tail="left" from={local + 14} />
      </>
    );
  }
  return (
    <>
      <Sunny
        x={1140}
        y={560}
        scale={1.75}
        emotion="proud"
        phase={3.4}
        // Sliding the shades down over the beat is the gag; it's one prop.
        shades={Math.max(0, Math.min(1, (local - 18) / 26))}
        look={{ x: -0.55, y: 0.35 }}
        enter={{ at: 160, kind: "slideRight" }}
      />
      <SpeechBubble x={470} y={330} text="Watch this." tail="right" from={local + 40} />
    </>
  );
};

/**
 * Every emotion in the table, on all three characters, 45 frames each.
 *
 * Passed as an `EmotionCue` rather than a bare name, which is the point of the
 * scene as a regression view: the faces *morph* between poses over 8 frames and
 * settle, and the two non-lerpable mouths (amazed's O, scared's squiggle) flatten
 * through a line on the way rather than swapping.
 */
const EmotionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slot = Math.floor(frame / 45);
  const step = slot % EMOTION_CYCLE.length;
  const emotion = EMOTION_CYCLE[step];
  const cue: EmotionInput =
    slot === 0
      ? emotion
      : {
          emotion,
          from: EMOTION_CYCLE[(step + EMOTION_CYCLE.length - 1) % EMOTION_CYCLE.length],
          at: slot * 45,
        };
  const t = frame / fps;
  return (
    <>
      <Drip x={380} y={660} scale={1.35} emotion={cue} phase={0} />
      <Cloudia
        x={960}
        y={420}
        scale={1}
        emotion={cue}
        phase={2.2}
        fill={0.5 + 0.5 * Math.sin(t * 0.7)}
      />
      <Sunny x={1560} y={620} scale={1.1} emotion={cue} phase={4.1} smug={false} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 96,
          textAlign: "center",
          fontSize: kidType.label,
          fontWeight: 900,
          letterSpacing: 6,
          color: kidTheme.ink,
          textShadow: kidOutline(4),
        }}
      >
        {emotion.toUpperCase()}
      </div>
    </>
  );
};

/** The Big Word beat: everyone amazed, word card bouncing in over a sunset. */
const BigWordScene: React.FC = () => (
  <>
    <WordCard text="EVAPORATION" from={12} y={330} sub="water turning into air" />
    <Drip x={420} y={780} scale={1.05} emotion="amazed" phase={0} look="up" />
    <Cloudia x={1000} y={800} scale={0.7} emotion="excited" phase={2.2} fill={0.15} look="up" />
    <Sunny x={1560} y={790} scale={0.8} emotion="excited" phase={4.1} smug={false} look="up" />
  </>
);

/**
 * Ocean beat: crowd of Blobbys in the water, Drip up front, waves rolling —
 * and one drop lifting off along an arc, which is the review view for
 * `moveAlong`. Note it is never at the halfway point of the straight line
 * between its two marks; that is the entire principle.
 */
const SeaScene: React.FC = () => {
  const frame = useCurrentFrame();
  // `bias` under 1 puts the top of the arc early, so it climbs fast and drifts
  // — the difference between "lifted" and "moved".
  const lift = moveAlong(
    { x: 1700, y: 700 },
    { x: 1180, y: 250 },
    (frame - 20) / 110,
    { arc: 0.3, bias: 0.75, ease: kidEase.easeInOutSine },
  );
  return (
    <>
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <BlobbyCrowd count={9} x={960} y={806} spread={1500} scale={0.7} />
        <g transform={`translate(${lift.x} ${lift.y}) rotate(${lift.angle + 90})`}>
          <Blobby x={0} y={0} scale={0.5} phase={2} mood="surprised" opacity={0.8} />
        </g>
      </svg>
      <Drip
        x={560}
        y={560}
        scale={1.3}
        emotion="proud"
        phase={0}
        shadow={false}
        look="right"
        enter={{ at: 0, kind: "slideLeft" }}
      />
      <SpeechBubble
        x={1180}
        y={400}
        text="One drop. Big job."
        tail="left"
        variant="thought"
        from={22}
      />
    </>
  );
};

export const KidDemoVideo: React.FC = () => {
  const { scenes } = timeline();
  return (
    <Series>
      {scenes.map((scene) => (
        <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
          <DialogueAudio scene={scene} />
          <KidBackdrop
            variant={scene.id === "bigword" ? "sunset" : "day"}
            clouds={scene.id === "sea" ? 2 : 3}
            ground={
              scene.id === "cast" ||
              scene.id === "emotions" ||
              scene.id === "portraits"
            }
            waves={scene.id === "sea" ? 320 : false}
          >
            {scene.id === "cast" ? <CastScene /> : null}
            {scene.id === "chat" ? <ChatScene scene={scene} /> : null}
            {scene.id === "portraits" ? <PortraitScene /> : null}
            {scene.id === "emotions" ? <EmotionScene /> : null}
            {scene.id === "bigword" ? <BigWordScene /> : null}
            {scene.id === "sea" ? <SeaScene /> : null}
          </KidBackdrop>
        </Series.Sequence>
      ))}
    </Series>
  );
};
