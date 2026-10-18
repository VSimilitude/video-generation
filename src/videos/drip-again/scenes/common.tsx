import React from "react";
import { useCurrentFrame } from "remotion";
import {
  EMOTION_EASE,
  SpeechBubble,
  lineKeyOf,
  lookAt,
  makeBodyGeometry,
  type Emotion,
  type EmotionInput,
  type LookDirection,
  type Mark as KitMark,
} from "../../../lib/kid";
import { speakerAt, type DialogueTurn, type NarrationClip, type TimedScene } from "../../../lib/narration";
import { NARRATION } from "../narrationManifest";

// Shared kit for "Drip Goes Up Again" — the second CYOA demo (brief ruling 1).
//
// A thin rebinding. Almost everything is episode one's kit (water-cycle/scenes/
// common) or DripChooses' small props (drip-fork/scenes/common), re-exported
// below so a scene file needs one `./common` import. What cannot be shared is
// bound here:
//
//   1. `clipOf` / `clipFrames` / `turnsOf`, bound to THIS video's manifest.
//   2. the format constants, which the registry reads off this composition.
//   3. the choice ids and `choicesFrom`.
//   4. the cast: this video adds a speaking Beaver, so `Speaker`, `speakerOf`,
//      `CHAR_BOX`, the staging geometry, `Bubbles`, `useEmotion` and
//      `useLookAtSpeaker` are rebound to a cast that includes him. They are
//      the water-cycle versions with a wider cast list, nothing else.
//
// This is the third video on the ep-1 kit, which drip-fork's header names as
// the signal to promote it to src/lib/kid. Noted, NOT done here (ruling 1).

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export { SETTLE_FRAMES } from "../../drip-fork/scenes/common";

// ---------------------------------------------------------------------------
// The cast
// ---------------------------------------------------------------------------

/** Every voice in this video. `narrator` is off-stage: no body, no bubble. */
export type Speaker = "narrator" | "drip" | "sunny" | "cloudia" | "beaver";

/** `da_05_beaver` -> `beaver`. The key convention *is* the cast list. */
export function speakerOf(lineKey: string): Speaker {
  const tail = lineKey.split("_").slice(2).join("_");
  if (tail === "drip" || tail === "sunny" || tail === "cloudia" || tail === "beaver") return tail;
  return "narrator";
}

/** Per-character cycle offset (breath, blink, mouth). Episode one's, plus him. */
export const PHASE: Record<Speaker, number> = {
  narrator: 0,
  drip: 0,
  sunny: 3.4,
  cloudia: 1.9,
  beaver: 5.3,
};

/** Natural SVG box height of each body (see water-cycle CHAR_BOX). */
export const CHAR_BOX = { drip: 380, sunny: 460, cloudia: 380, beaver: 380 } as const;
export type Body = keyof typeof CHAR_BOX;
export type Mark = KitMark<Body>;
const geometry = makeBodyGeometry({ box: CHAR_BOX, body: "drip", bubbleLift: 175 });
export const { stand, hover, crownOf, midOf, bubbleAbove, markCentre, projectMark } = geometry;
export type Cast = Partial<Record<Speaker, Mark>>;

// ---------------------------------------------------------------------------
// Narration, bound to this manifest
// ---------------------------------------------------------------------------

/** A clip by line key, with a loud failure rather than a silent gap. */
export function clipOf(key: string): NarrationClip {
  const clip = NARRATION[key];
  if (!clip) throw new Error(`[drip-again] no narration clip for "${key}"`);
  return clip;
}

/** Frames a clip occupies at this composition's fps. */
export function clipFrames(key: string): number {
  return Math.ceil(clipOf(key).durationSeconds * FPS);
}

/** Turn list for a scene from its line keys; the last turn gets no gap. */
export function turnsOf(
  keys: string[],
  opts?: { gap?: number; gaps?: Record<string, number> },
): DialogueTurn[] {
  return keys.map((key, i) => {
    const explicit = opts?.gaps?.[key];
    const gapFrames = explicit !== undefined ? explicit : i === keys.length - 1 ? 0 : opts?.gap;
    return { clip: clipOf(key), speaker: speakerOf(key), gapFrames };
  });
}

// ---------------------------------------------------------------------------
// The choices
// ---------------------------------------------------------------------------

/**
 * The four choice points, by their stable path ids (recorded in localStorage
 * by the site player — never rename one once shipped), each one's options in
 * card order. The FIRST option is the default outside the site and the
 * player's auto-pick. `valleyWay` / `mountainWay` are half-choices: both of
 * their options lead to the same next segment. A half-choice a path never
 * reaches is simply defaulted here; nothing keyed on it plays on that path.
 */
export const CHOICES = {
  where: ["valley", "mountain"],
  valleyWay: ["left", "right"],
  mountainWay: ["left", "right"],
  wayOut: ["over", "lodge"],
} as const;

export type ChoiceId = keyof typeof CHOICES;
export type Choices = { [C in ChoiceId]: (typeof CHOICES)[C][number] };

function pick<C extends ChoiceId>(id: C, path?: Record<string, string>) {
  const options = CHOICES[id] as readonly string[];
  const chosen = path?.[id];
  return (chosen && options.includes(chosen) ? chosen : options[0]) as (typeof CHOICES)[C][number];
}

/** Player inputProps `path` -> a fully-answered `Choices`. Pure data. */
export function choicesFrom(path?: Record<string, string>): Choices {
  return {
    where: pick("where", path),
    valleyWay: pick("valleyWay", path),
    mountainWay: pick("mountainWay", path),
    wayOut: pick("wayOut", path),
  };
}

/** The half-choice that belongs to the branch this path took. */
export function wayOf(choices: Choices): "left" | "right" {
  return choices.where === "valley" ? choices.valleyWay : choices.mountainWay;
}

/** Every scene takes the same two props (see drip-fork/scenes/common). */
export type SceneProps = { scene: TimedScene; choices: Choices };

// ---------------------------------------------------------------------------
// Staging helpers, rebound to the wider cast
// ---------------------------------------------------------------------------

/**
 * Per-line emotion for one character — water-cycle's `useEmotion`, for a cast
 * that includes the Beaver. The face lands `lead` frames before the line.
 */
export function useEmotion(
  scene: TimedScene,
  speaker: Speaker,
  byKey: Record<string, Emotion>,
  resting: Emotion = "happy",
  lead = 8,
): EmotionInput {
  const frame = useCurrentFrame();
  let current = resting;
  let previous = resting;
  let at = -1;
  for (const turn of scene.turns ?? []) {
    if (turn.speaker !== speaker) continue;
    const emotion = byKey[lineKeyOf(turn)];
    if (!emotion) continue;
    if (frame < turn.from - lead) continue;
    if (emotion !== current) {
      previous = current;
      at = turn.from - lead;
    }
    current = emotion;
  }
  const frames = Math.min(EMOTION_EASE, Math.max(4, lead));
  return at < 0 ? current : { emotion: current, from: previous, at, frames };
}

/** A listener's eyes: whoever is talking, else `fallback`. */
export function useLookAtSpeaker(
  scene: TimedScene,
  cast: Cast,
  me: Speaker,
  fallback: LookDirection = "camera",
): LookDirection {
  const frame = useCurrentFrame();
  const current = speakerAt(scene, frame) as Speaker | null;
  const from = cast[me];
  const to = current && current !== me ? cast[current] : undefined;
  if (!from || !to) return fallback;
  return lookAt(markCentre(from), markCentre(to));
}

/**
 * Every bubble in a scene, placed automatically — water-cycle's `Bubbles`
 * for a cast that includes the Beaver. `at` overrides a bubble's own centre
 * (and `tailAt` the composition x its tail points at).
 */
export const Bubbles: React.FC<{
  scene: TimedScene;
  cast: Cast;
  text: Record<string, string>;
  at?: Record<
    string,
    {
      x?: number;
      y?: number;
      tail?: "left" | "right" | "none";
      tailAt?: number;
      side?: "left" | "right";
      offset?: number;
    }
  >;
  fontSize?: number;
  maxWidth?: number;
}> = ({ scene, cast, text, at, fontSize, maxWidth }) => (
  <>
    {(scene.turns ?? []).map((turn, i) => {
      const key = lineKeyOf(turn);
      const body = text[key];
      const mark = cast[turn.speaker as Speaker];
      if (!body || !mark) return null;
      const override = at?.[key];
      const side = override?.side ?? mark.side ?? (mark.x < WIDTH / 2 ? "right" : ("left" as const));
      const offset = override?.offset ?? mark.offset ?? 330;
      const bx = clamp(override?.x ?? mark.x + (side === "right" ? offset : -offset), 400, WIDTH - 400);
      const by = clamp(override?.y ?? bubbleAbove(mark), 170, HEIGHT - 280);
      const tail = override?.tail ?? (side === "right" ? "left" : "right");
      return (
        <SpeechBubble
          key={`${key}-${i}`}
          x={bx}
          y={by}
          text={body}
          tail={tail}
          tailAt={override?.tailAt}
          from={turn.from}
          until={turn.from + turn.durationInFrames}
          fontSize={fontSize}
          maxWidth={maxWidth}
        />
      );
    })}
  </>
);

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// Re-exported so a scene file needs one import for the whole kit.
export {
  Bird,
  Boat,
  CloudPuff,
  HotelSign,
  SnowGlyph,
  SpeedStreaks,
} from "../../drip-fork/scenes/common";
export {
  Camera,
  CaptionCard,
  CutFlash,
  NameArrow,
  ScenePlaceholder,
  SkyBlend,
  SteamWisps,
  Vignette,
  WaterBand,
  WideLayer,
  lineProgress,
  lineWindow,
  project,
  turnFor,
  useLineKey,
} from "../../water-cycle/scenes/common";
export type { TimedScene };
