import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Cloudia,
  Drip,
  KidBackdrop,
  SpeechBubble,
  kidTheme,
  lookAt,
  type EmotionInput,
} from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  Bubbles,
  CaptionCard,
  CloudPuff,
  HotelSign,
  PHASE,
  SETTLE_FRAMES,
  WideLayer,
  clipFrames,
  clipOf,
  lineWindow,
  midOf,
  stand,
  useEmotion,
  useLookAtSpeaker,
  type Cast,
  type Mark,
  type SceneProps,
  type WayUp,
} from "./common";

// ENDING — the merged trunk. Both branches arrive here, at the same place, at
// the same time, with the same cast on stage: that is the merge rule from
// docs/CYOA.md, and it is what licenses the foldback at all.
//
// The one thing that differs is Cloudia's greeting, and it differs for a
// reason that traces straight to the viewer's choice — the *variant insert*,
// in miniature. The two clips are the same beat with the same staging; only
// the audio and the bubble change. Everything after it is shared.

const GROUND = 950;
// She stands clear of the building's white bulk, against open sky: a white
// cloud manager in front of a white cloud hotel has no silhouette at all.
const CLOUDIA_MARK: Mark = {
  x: 1480,
  y: stand("cloudia", GROUND),
  scale: 1.05,
  who: "cloudia",
  side: "left",
};
const DRIP_MARK: Mark = {
  x: 620,
  y: stand("drip", GROUND + 40),
  scale: 1.1,
  who: "drip",
  side: "right",
};

/**
 * The variant insert's timing contract, read by Video.tsx to size the scene.
 *
 * The greeting scene carries no turns: `buildTimeline` cannot know which clip
 * a viewer will hear, so the scene is sized as a silent one, long enough for
 * the LONGER of the two variants. The component mounts the chosen clip itself
 * and drives Cloudia's mouth over that clip's own window — the house rule
 * (docs/STYLE.md) is that a mouth moves if and only if its own clip is playing,
 * and this is still exactly that, just with the clip picked from props.
 */
export const GREETING = {
  /** Frame her clip starts on. Leaves room for the settle + her entrance. */
  audioAt: 30,
  /** Silence after the longer variant, so the cut into the wrap can breathe. */
  tail: 40,
  clips: { sunbeam: "en_01a_cloudia", float: "en_01b_cloudia" } as Record<WayUp, string>,
  bubbles: {
    sunbeam: "You came up on a SUNBEAM!",
    float: "You saw every single bird!",
  } as Record<WayUp, string>,
};

/** `minFrames` for the greeting scene — the longer variant plus its tail. */
export function greetingMinFrames(): number {
  const longest = Math.max(
    clipFrames(GREETING.clips.sunbeam),
    clipFrames(GREETING.clips.float),
  );
  return GREETING.audioAt + longest + GREETING.tail;
}

/** Every asset the ending segment can play — BOTH variants, for preloading. */
export function endingVariantFiles(): string[] {
  return [clipOf(GREETING.clips.sunbeam).file, clipOf(GREETING.clips.float).file];
}

/** The hotel, the terrace it stands on, and the sky behind both. */
const Terrace: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    <KidBackdrop variant="day" clouds={2} waves={false} />
    <WideLayer>
      {/* The building stays the only pure-white thing in the frame; its
          neighbours and the shelf carry a little grey, which is what gives
          Cloudia (white) and the hotel itself an edge to read against. */}
      <CloudPuff x={780} y={470} w={1150} h={400} seed={3} windows={4} />
      <CloudPuff x={190} y={640} w={760} h={250} seed={7} grey={0.14} opacity={0.96} />
      <CloudPuff x={900} y={GROUND + 150} w={2600} h={360} seed={5} grey={0.1} />
      {/* Right of centre: the wrap's "try the other way" card takes the left
          half of this band, and two cards edge to edge read as one. */}
      <HotelSign x={1330} y={175 + Math.sin(frame / 40) * 6} />
    </WideLayer>
  </>
);

// ---------------------------------------------------------------------------
// Scene 1 — the greeting (variant insert)
// ---------------------------------------------------------------------------

const GreetingScene: React.FC<SceneProps> = ({ wayUp }) => {
  const frame = useCurrentFrame();
  // `wayUp` is constant for the lifetime of a mount (it comes from the Player's
  // inputProps), and nothing below is a hook — the choice picks data, never a
  // code path with a hook in it.
  const key = GREETING.clips[wayUp];
  const clip = clipOf(key);
  const window: [number, number] = [GREETING.audioAt, GREETING.audioAt + clipFrames(key)];
  const speaking = frame >= window[0] && frame < window[1];

  const dripMid = { x: DRIP_MARK.x, y: midOf("drip", DRIP_MARK.y, DRIP_MARK.scale) };
  const cloudiaMid = {
    x: CLOUDIA_MARK.x,
    y: midOf("cloudia", CLOUDIA_MARK.y, CLOUDIA_MARK.scale),
  };

  return (
    <AbsoluteFill>
      <Terrace frame={frame} />
      {/* The chosen variant, mounted by the composition rather than by
          `DialogueAudio` — this scene has no turns to mount. */}
      <Sequence from={GREETING.audioAt}>
        <Audio src={staticFile(clip.file)} />
      </Sequence>
      <Drip
        x={DRIP_MARK.x}
        y={DRIP_MARK.y}
        scale={DRIP_MARK.scale ?? 1}
        emotion="excited"
        phase={PHASE.drip}
        shadow={false}
        idle={1.1}
        look={lookAt(dripMid, cloudiaMid, 1200)}
      />
      <Cloudia
        x={CLOUDIA_MARK.x}
        y={CLOUDIA_MARK.y}
        scale={CLOUDIA_MARK.scale ?? 1}
        fill={0}
        clipboard
        emotion="excited"
        speaking={speaking}
        phase={PHASE.cloudia}
        // Nothing enters before the settle: the player can overshoot the
        // segment boundary and put these first frames on screen.
        enter={{ at: SETTLE_FRAMES, kind: "slideLeft" }}
        look={lookAt(cloudiaMid, dripMid, 1200)}
      />
      <SpeechBubble
        x={1000}
        y={370}
        text={GREETING.bubbles[wayUp]}
        tail="right"
        from={window[0] + 4}
        until={window[1]}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — the shared wrap
// ---------------------------------------------------------------------------

const WRAP_BUBBLES: Record<string, string> = {
  en_02_drip: "I am extremely tall now!",
};

const WrapScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [againFrom] = lineWindow(scene, "en_04_narrator");

  const cast: Cast = { drip: DRIP_MARK, cloudia: CLOUDIA_MARK };
  const cloudiaMid = {
    x: CLOUDIA_MARK.x,
    y: midOf("cloudia", CLOUDIA_MARK.y, CLOUDIA_MARK.scale),
  };
  const dripMid = { x: DRIP_MARK.x, y: midOf("drip", DRIP_MARK.y, DRIP_MARK.scale) };
  const dripLook = useLookAtSpeaker(scene, cast, "drip", "camera");
  const [, boastTo] = lineWindow(scene, "en_02_drip");
  // Ends on a plain smile: the site's replay UI lands on these frames, and
  // `proud`'s half-lidded smirk is not the face to leave a six-year-old on.
  const dripEmotion = useEmotion(scene, "drip", { en_02_drip: "proud" }, "excited", 6);
  const emotion: EmotionInput =
    frame >= boastTo ? { emotion: "happy", from: "proud", at: boastTo, frames: 8 } : dripEmotion;

  // A slow pull-out over the wrap would be nice and is exactly what the last
  // frames must not do: the site's replay UI lands on them. It holds instead,
  // and the only motion is breath and one card arriving.
  const cheer = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Terrace frame={frame} />
      <Drip
        x={DRIP_MARK.x}
        y={DRIP_MARK.y}
        scale={DRIP_MARK.scale ?? 1}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={1 + cheer * 0.3}
        // Arms up for the boast, then back down — a character who holds a
        // cheer for fifteen seconds is a statue of a cheer.
        pose={cheer > 0.5 && frame < boastTo ? "cheer" : undefined}
        look={frame > againFrom ? "camera" : dripLook}
      />
      <Cloudia
        x={CLOUDIA_MARK.x}
        y={CLOUDIA_MARK.y}
        scale={CLOUDIA_MARK.scale ?? 1}
        fill={0}
        clipboard
        emotion="happy"
        speaking={useSpeaking(scene, "cloudia")}
        phase={PHASE.cloudia}
        look={lookAt(cloudiaMid, dripMid, 1200)}
      />
      <Bubbles scene={scene} cast={cast} text={WRAP_BUBBLES} />
      {/* The invitation, in the frame the narrator says it in. */}
      <CaptionCard
        text="try the other way"
        from={againFrom + 20}
        y={170}
        align="left"
        color={kidTheme.star}
      />
    </AbsoluteFill>
  );
};

export const ENDING_SCENES: Record<string, React.FC<SceneProps>> = {
  en_greeting: GreetingScene,
  en_wrap: WrapScene,
};
