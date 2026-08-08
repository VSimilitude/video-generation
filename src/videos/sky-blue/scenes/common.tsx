import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Drip,
  Face,
  KidBackdrop,
  KidContactShadow,
  KidPaintedBackdrop,
  Puff,
  Ray,
  RayShard,
  SpeechBubble,
  Sunny,
  EMOTION_EASE,
  RAY_BOX,
  RAY_SHARD_BOX,
  SEVEN_NAMES,
  SHARD_PHASE,
  SNORE_RING_WARM,
  SPECTRUM,
  kidEase,
  kidOutline,
  kidShadow,
  kidTheme,
  kidType,
  lineKeyOf,
  lookAt,
  makeBodyGeometry,
  makeShard,
  makeSleepingVolcano,
  makeWideLayer,
  mixHex,
  settleWave,
  useRig,
  type Cam,
  type ShardName,
  type Emotion,
  type EmotionInput,
  type KidPaintedBackdropProps,
  type LookDirection,
  type Mark as KitMark,
  type SpectrumColor,
} from "../../../lib/kid";
import { BACKGROUNDS } from "../backgroundManifest";
import { BACKGROUNDS as WIND_BACKGROUNDS } from "../../wind/backgroundManifest";
import {
  isSpeaking,
  useSpeaking,
  type DialogueTurn,
  type TimedScene,
  type TimedTurn,
} from "../../../lib/narration";
import { NARRATION } from "../narrationManifest";

// Shared kit for "Ray and the Sky Nobody Painted" — Little Big World, episode
// three.
//
// This file is deliberately **thin**. Episodes one and two each grew a
// 1400-line `scenes/common.tsx`; almost all of it was promoted to
// `src/lib/kid/` before this episode (docs/LEARNINGS.md, "The consolidation
// before episode three"), so what is left here is only the five things that are
// genuinely per-episode:
//
//   the cast      `Speaker`/`Stage`, `PHASE`, `CHAR_BOX`, the marks
//   the ensemble  `SEVEN` — who each of the seven colours is, and the laws of
//                 motion that say so (API 6). The heaviest thing in the file
//                 and the one every act reads.
//   the timing    `turnsOf`, bound to *this* video's narration manifest
//   the arc       `RAY_LIGHT` — Ray's brightness ramp, in one place
//   the world     `PLATES` + `PaintedSky`, and the two bits of drawn scenery
//                 (`SoftShade`, `WideLayer`) a plate cannot do
//
// **The staging API is episode two's, as LEARNINGS instructed**: `useStage` +
// `SpeakerVisual` (a per-line "this narrator line comes out of *that* body's
// mouth" override), not episode one's line-key-derives-the-body. Episode three
// has no narrator-voiced cameos — the kid, Violet and the volcano are silent
// and stay silent, and the other six colours have voices of their own rather
// than borrowed ones — so `SpeakerVisual` is threaded through every helper here
// and used by nobody. That is on purpose: it is the shape a third episode is
// meant to prove, and an act that gains a cameo tomorrow does not have to
// re-plumb four hooks to get it.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// `SEVEN_NAMES`, `ShardName` and `SHARD_PHASE` — and the whole cast table, the
// laws of motion and the `Shard` wrapper that used to live at the foot of this
// file — moved to `src/lib/kid/shards.tsx` when episode four staged Blue and
// Violet (2026-08-08). They are imported above and re-exported at the foot of
// this file, so no act file's imports changed.

/**
 * **Every voice in the show.** `narrator` is off-stage: no body, no bubble.
 *
 * The six colour names are the 2026-08-01 revision's whole cast growth
 * (ADDENDUM 2, "SIX VOICES, ONE SILENCE"). Fifteen lines in this episode are
 * theirs — `a2_23b_red`, `a2_25b_blue`, `a2_28c_indigo`, `a3_13d_yellow`,
 * `a3_14f_green`, `a3_18e_orange`, `rc_03b_blue` and the rest — and until the
 * kit-prerequisite wave every one of them resolved to `narrator`, so all
 * fifteen staged as narration: no mouth wired to the clip, no bubble, no
 * attribution. A character with a line who is staged as narration is not in the
 * scene.
 *
 * **There is no `violet`, and there is never going to be one.** It is the one
 * rule in this file that is load-bearing across episodes rather than inside
 * this one: Violet works harder than anybody on screen, is never once looked
 * at, and the joke only survives while he is the *only* one who never speaks —
 * which is exactly why his six siblings gaining voices makes it better. He
 * is a `VisualSpeaker`. `speakerOf` throws if a line key ever claims otherwise.
 */
export type Speaker =
  | "narrator"
  | "ray"
  | "sunny"
  | "drip"
  | "puff"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "indigo";

/**
 * Bodies that appear on screen without a voice of their own.
 *
 * `kid` never speaks, in any episode, and is three episodes into not doing it.
 * `violet` never speaks either, and that is the point of him — see `Speaker`.
 */
export type VisualSpeaker = "kid" | "violet";

/** Anything that can be staged, whether or not it owns a voice. */
export type Stage = Speaker | VisualSpeaker;

/**
 * Per-character cycle offset. Breathing, blinking, mouth timing and Ray's own
 * shimmer all key off it, so two characters sharing one ripple in lockstep —
 * always pass these.
 *
 * The seven read theirs out of `SHARD_PHASE`, so the same table answers
 * "which phase does Blue have" whether a scene reached him as a *speaker*
 * (`PHASE.blue`) or as the fifth of an arc (`SEVEN[4].phase`). Two numbers for
 * one character is how a cast drifts.
 */
export const PHASE: Record<Stage, number> = {
  narrator: 0,
  ray: 0,
  sunny: 3.4,
  drip: 2.6,
  puff: 1.4,
  kid: 7.4,
  red: SHARD_PHASE[0],
  orange: SHARD_PHASE[1],
  yellow: SHARD_PHASE[2],
  green: SHARD_PHASE[3],
  blue: SHARD_PHASE[4],
  indigo: SHARD_PHASE[5],
  violet: SHARD_PHASE[6],
};

/**
 * Act colours. The recap's three-way split screen wears these one per panel
 * (script.md, Scene 32: "rainbow spectrum, sky blue, sunset orange"), so the
 * Big Word cards have to be dressed from the same table or the recap will not
 * match the thing it is recapping.
 *
 * `rainbow` is an indigo rather than a literal spectrum, because a `WordCard`
 * takes one banner colour and a seven-stop gradient behind seven white letters
 * is a smear at 1920×1080. The spectrum reading comes from what the card is
 * standing *on*: Scene 11 freezes the seven-blob arc behind it, and the recap
 * panel draws `SPECTRUM` directly.
 */
export const ACT_COLOR = {
  rainbow: SPECTRUM[5].fill,
  scatter: kidTheme.skyTop,
  sunset: kidTheme.sunDeep,
} as const;

/**
 * **Ray's brightness, scene by scene — the character arc, drawn.**
 *
 * Same job as episode two's `PUFF_OPACITY`, and the same rule: these four
 * numbers live here so the ramp can be read in one place, an act that invents a
 * fifth value has broken the arc, and **nothing in dialogue ever mentions it**
 * (script.md, Scene 13: "Nobody ever says a word about that").
 *
 * A scene where he is hard to see darkens the background behind him
 * (`SoftShade`) or switches his outline to ink (`edge`); it does not raise the
 * number.
 */
export const RAY_LIGHT = {
  /** Scenes 3–12. A little dimmer and plainer than he ends up. */
  actOne: 0.6,
  /** Scene 7 only, his lowest — the shot where he says he is the plain one. */
  lowest: 0.48,
  /** From Scene 13's snap-back. "Noticeably brighter than he was in Scene 7." */
  afterRainbow: 0.85,
  /** Scene 24 onward: "at his brightest yet", and it stays there. */
  full: 1,
} as const;

/**
 * How much of the seven shows in his outline. Zero for the whole of Act One;
 * from Scene 13 it is there for the rest of the episode and nobody mentions it,
 * which is exactly why it is faint rather than off/on.
 */
export const RAY_SPECTRUM = { none: 0, afterRainbow: 0.5 } as const;

// ---------------------------------------------------------------------------
// API 1 — building a scene's turns from script.md's line keys
// ---------------------------------------------------------------------------

/**
 * Every tail a line key is allowed to end in. Kept as a set rather than a
 * chain of `===` so that adding a voice is one line in `Speaker` and one entry
 * here, and so that the ordering of the two can never disagree.
 */
const VOICES = new Set<string>([
  "ray",
  "sunny",
  "drip",
  "puff",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
]);

/**
 * `a1_07_ray` -> `ray`, `a2_23b_red` -> `red`. The key convention *is* the cast
 * list, which is why a colour line that resolved to `narrator` was invisible
 * rather than an error for a whole wave.
 *
 * A key ending in `_violet` throws rather than falling through to `narrator`.
 * That is not defensive programming, it is the series rule with teeth on it:
 * Violet never speaks, the day somebody writes him a line the build should stop
 * and make them read this comment, and a silent fallback would have shipped it.
 */
export function speakerOf(lineKey: string): Speaker {
  const tail = lineKey.split("_").slice(2).join("_");
  if (tail === "violet") {
    throw new Error(
      `[sky-blue] "${lineKey}": Violet never speaks. He is the only one of the ` +
        `seven who never gets a line, in this episode or any other — see the ` +
        `Speaker doc in scenes/common.tsx. Give the line to Yellow, who is the ` +
        `only character who ever addresses him.`,
    );
  }
  return VOICES.has(tail) ? (tail as Speaker) : "narrator";
}

/**
 * Turn list for a scene, straight from script.md's line keys. The speaker is
 * derived from the key, so a scene's cast can never drift from its audio.
 *
 * The last turn gets `gapFrames: 0` unless the script asked for one explicitly
 * — a trailing gap stacks with the scene's tail and leaves a scene sitting
 * silent twice as long as intended. Five of this episode's held beats *are*
 * trailing (Scenes 4, 7, 23, 26, 31), and those pass an explicit number.
 */
export function turnsOf(
  keys: string[],
  opts?: { gap?: number; gaps?: Record<string, number> },
): DialogueTurn[] {
  return keys.map((key, i) => {
    const clip = NARRATION[key];
    if (!clip) throw new Error(`[sky-blue] no narration clip for "${key}"`);
    const explicit = opts?.gaps?.[key];
    const gapFrames =
      explicit !== undefined ? explicit : i === keys.length - 1 ? 0 : opts?.gap;
    return { clip, speaker: speakerOf(key), gapFrames };
  });
}

// `lineKeyOf`, `turnFor`, `lineWindow`, `heldBeat` (the silence a `gapFrames`
// bought, which is how this episode's forty-one held beats are staged without
// hard-coding a length) and `lineProgress` are the kit's
// (`src/lib/kid/lines.ts`); they are re-exported at the foot of this file.

// ---------------------------------------------------------------------------
// API 2 — staging: who stands where, who is talking, who looks at whom
// ---------------------------------------------------------------------------

/**
 * Natural SVG box height of each body, from its component file. Needed because
 * `CharacterFrame` scales about the **bottom** of that box: a character's `y`
 * prop plus half this number is a ground line that does not move when you
 * change `scale`. Everything geometric below is derived from that fact — it is
 * the single easiest thing to get wrong when staging.
 */
export const CHAR_BOX = {
  ray: RAY_BOX,
  shard: RAY_SHARD_BOX,
  sunny: 460,
  drip: 380,
  puff: 340,
  kid: 420,
} as const;
export type Body = keyof typeof CHAR_BOX;

/**
 * Where a body stands. Pass exactly the `x`, `y` and `scale` you gave the
 * component and the helpers do the rest: bubbles clear the crown, looks aim at
 * the middle.
 */
export type Mark = KitMark<Body>;

/**
 * **Where each body's face is, measured off its component.**
 *
 * In the body's own natural units, negative up, from the centre of its box —
 * see `faceOffset` in `src/lib/kid/staging.tsx`. It is what `markCentre` aims
 * at, so it is what every `look` in the episode aims at.
 *
 * Ray is the whole reason the option exists. On candidate F2 the centre of his
 * box is not a feature, it is the **gap** between the floating face and the
 * wave ribbon — the gap the design is built on — so a character looking at
 * "Ray" was looking at the hole in the middle of him, about a face-height low,
 * which reads as looking at his chest. Rendered before-and-after stills of
 * exactly that are in `scratchpad/w2kit/`.
 *
 * **The target is the eyes**, not the middle of the face, because that is what
 * `markCentre` already means for every other body in the kit: Sunny, Drip and
 * Puff are drawn with their eyes near the middle of their own boxes, so an aim
 * at Ray's eyes is the same aim rather than a new convention.
 *
 *   Ray     `faceY` is −96 local (mean; it bobs ±10 on the wave), the eyes sit
 *           `FACE.eyeY · 1.34` = −11 above that, and the pair is inside
 *           `translate(0 20) scale(0.78)` and a brightness-driven
 *           `scale(0.9 + 0.18b)`. **−68** at `RAY_LIGHT.afterRainbow`, where he
 *           spends most of the episode; it runs −63 at his dimmest and −69 at
 *           full, which is inside the bob.
 *   shard   `faceY` −70 with no fit transform, eyes `FACE.eyeY · 0.9` = −7
 *           above it: **−77**.
 *
 * Nobody else declares one. Sunny, Drip, Puff and the kid are ordinary bodies
 * with their faces at the middle of their own boxes, they have been aimed at
 * for two episodes, and inventing an eyeballed number for them here would
 * change staging that is already right.
 */
const FACE_OFFSET = { ray: -68, shard: -77 } as const;

/**
 * The staging arithmetic, bound to this episode's cast: `stand`, `hover`,
 * `crownOf`, `midOf`, `faceOf`, `bubbleAbove`, `markCentre`, `projectMark`.
 *
 * `hover` is the one Ray actually needs, because he never stands on anything —
 * he is a beam of light and spends the episode in flight. Ray is the default
 * body for a mark that does not name one, and a bubble sits 165px above the
 * crown.
 *
 * `midOf` is still the middle of the box (a camera focus, a shadow, a halo);
 * `faceOf` is the face, and `markCentre` — the thing eyes aim at — is `faceOf`.
 */
const geometry = makeBodyGeometry({
  box: CHAR_BOX,
  body: "ray",
  bubbleLift: 165,
  faceOffset: FACE_OFFSET,
});
export const {
  stand,
  hover,
  crownOf,
  midOf,
  faceOf,
  bubbleAbove,
  markCentre,
  projectMark,
} = geometry;

export type Cast = Partial<Record<Stage, Mark>>;

// ---------------------------------------------------------------------------
// API 2b — the cameo bodies (`speakerVisual`)
// ---------------------------------------------------------------------------

/**
 * Per-line override: "this NARRATOR turn comes out of *that* body's mouth".
 *
 *   const SPEAKER_VISUAL: SpeakerVisual = { a1_07_narrator: "kid" };
 *
 * Everything staged reads through it: `useStage()` for mouths, `Bubbles` for
 * bubbles, `useEmotion()` for faces, `useLookAtSpeaker()` for eyes. A key with
 * no entry keeps its voiced speaker, so a scene only lists its cameos.
 *
 * **Unused in this episode** (see the file header) and kept anyway.
 */
export type SpeakerVisual = Record<string, Stage>;

/** The body a turn comes out of: the override if there is one, else the voice. */
export function stageSpeakerOf(turn: TimedTurn, visual?: SpeakerVisual): Stage {
  return visual?.[lineKeyOf(turn)] ?? (turn.speaker as Stage);
}

export type StageState = {
  /** Whoever is mid-line right now, as a *body*, or null in the gaps. */
  current: Stage | null;
  /** True while this body's own turn is playing — wire straight to `speaking`. */
  speaking: (who: Stage) => boolean;
  /** The line key playing right now, or null in the gaps between turns. */
  lineKey: string | null;
  frame: number;
};

/**
 * One hook per scene, and the ep-2 way to drive mouths.
 *
 *   const stage = useStage(scene);
 *   <Ray   speaking={stage.speaking("ray")}   … />
 *   <Sunny speaking={stage.speaking("sunny")} … />
 *
 * `stage.speaking` is a plain function, not a hook, so it is safe to call once
 * per body inside the returned JSX — which is what keeps a scene with five
 * bodies from needing five conditional hook calls.
 */
export function useStage(scene: TimedScene, visual?: SpeakerVisual): StageState {
  const frame = useCurrentFrame();
  const turns = scene.turns ?? [];
  const live = turns.find((t) => frame >= t.from && frame < t.from + t.durationInFrames);
  const current = live ? stageSpeakerOf(live, visual) : null;
  return {
    current,
    speaking: (who: Stage) => current === who,
    lineKey: live ? lineKeyOf(live) : null,
    frame,
  };
}

/** The line key playing right now, or null in the gaps between turns. */
export function useLineKey(scene: TimedScene): string | null {
  const frame = useCurrentFrame();
  const turn = (scene.turns ?? []).find(
    (t) => frame >= t.from && frame < t.from + t.durationInFrames,
  );
  return turn ? lineKeyOf(turn) : null;
}

/**
 * Per-line emotion for one body: `{ "a1_26_ray": "sad" }`.
 *
 * The emotion lands `lead` frames *before* the line starts and holds until that
 * body's next mapped line. Returns an `EmotionCue`, so the face *morphs* rather
 * than cutting (see `resolveEmotion` in the rig).
 *
 * **`lead` is 0 on every held-beat scene in this episode.** script.md makes
 * that a rule rather than a note ("No emotion lead on held-beat scenes"): the
 * default eight-frame lead lands a reaction inside the silence the joke is
 * being held for, which spends the beat early. Scenes 7, 16, 23 and 35 say so
 * explicitly; treat it as true of all forty-one held beats. `NO_LEAD` is
 * exported from each act file that needs it.
 *
 * Never map a line to `scared`: the rig's wobble-mouth hard-cuts to a talking
 * mouth on the first frame of a line. Put `scared` in the gap between two lines
 * instead (`emotionAt`).
 */
export function useEmotion(
  scene: TimedScene,
  who: Stage,
  byKey: Record<string, Emotion>,
  resting: Emotion = "happy",
  lead = 8,
  visual?: SpeakerVisual,
): EmotionInput {
  const frame = useCurrentFrame();
  let current = resting;
  let previous = resting;
  let at = -1;
  for (const turn of scene.turns ?? []) {
    if (stageSpeakerOf(turn, visual) !== who) continue;
    const emotion = byKey[lineKeyOf(turn)];
    if (!emotion) continue;
    if (frame < turn.from - lead) continue;
    // Two mapped lines with the same face are not a change: the morph (and the
    // settle it leaves behind) belongs to the frame the face actually moved.
    if (emotion !== current) {
      previous = current;
      at = turn.from - lead;
    }
    current = emotion;
  }
  const frames = Math.min(EMOTION_EASE, Math.max(4, lead));
  return at < 0 ? current : { emotion: current, from: previous, at, frames };
}

/**
 * A listener's eyes. Whoever is talking gets looked at; nobody talking (or the
 * Narrator talking with no body on stage) falls back to `fallback`.
 */
export function useLookAtSpeaker(
  scene: TimedScene,
  cast: Cast,
  me: Stage,
  fallback: LookDirection = "camera",
  visual?: SpeakerVisual,
): LookDirection {
  const { current } = useStage(scene, visual);
  const from = cast[me];
  const to = current && current !== me ? cast[current] : undefined;
  if (!from || !to) return fallback;
  return lookAt(markCentre(from), markCentre(to));
}

/**
 * Every bubble in a dialogue scene, placed automatically.
 *
 * One entry per line key you want a bubble for — six words maximum, and a
 * *summary* rather than a transcript. This episode's one deliberate exception
 * is Scene 10's roll call, where the seven-name line gets the bubble
 * **"Hi! Hi! Hi! Hi!"** — a summary and not a transcript, and script.md says so
 * in as many words.
 *
 * Placement: above the speaker's crown, on the side facing frame centre, tail
 * pointing back down at them, up for exactly the length of their turn.
 *
 * `at` overrides one line's bubble — `{x, y}` there is the **bubble's own
 * centre**, not the character's.
 *
 * `tailAt` in that override is a composition x for the *tail*. Use it whenever
 * `x` moved the bubble away from its speaker: the default tail sits at a fixed
 * inset from the bubble's corner, and a tail pointing at nobody reads as
 * narration rather than as somebody talking. **Ray travels through most of his
 * own lines**, so this episode reaches for it more than either of the last two.
 */
export const Bubbles: React.FC<{
  scene: TimedScene;
  cast: Cast;
  text: Record<string, string>;
  visual?: SpeakerVisual;
  at?: Record<
    string,
    {
      x?: number;
      y?: number;
      tail?: "left" | "right" | "none";
      /** Composition x the tail points at; defaults to the bubble's corner. */
      tailAt?: number;
      side?: "left" | "right";
      offset?: number;
    }
  >;
  fontSize?: number;
  maxWidth?: number;
}> = ({ scene, cast, text, visual, at, fontSize, maxWidth }) => (
  <>
    {(scene.turns ?? []).map((turn, i) => {
      const key = lineKeyOf(turn);
      const body = text[key];
      const mark = cast[stageSpeakerOf(turn, visual)];
      if (!body || !mark) return null;
      const override = at?.[key];
      const dress = bubbleStyleOf(stageSpeakerOf(turn, visual));
      const side =
        override?.side ?? mark.side ?? (mark.x < WIDTH / 2 ? "right" : ("left" as const));
      const offset = override?.offset ?? mark.offset ?? 330;
      const bx = clamp(
        override?.x ?? mark.x + (side === "right" ? offset : -offset),
        400,
        WIDTH - 400,
      );
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
          background={dress.background}
          outline={dress.outline}
        />
      );
    })}
  </>
);

/**
 * **A colour's bubble wears the colour.**
 *
 * Six of the seven speak from Scene 23 on, four of them ricochet or walk
 * through their own line, and two of them (Blue and Indigo) are adjacent hues
 * saying nearly the same words four frames apart. A tail is enough attribution
 * for one speaker in a two-shot; it is not enough for a crowd of seven in the
 * same frame, and the Indigo gag depends on the audience knowing which of two
 * blue-ish blobs just spoke.
 *
 * So the bubble takes the speaker's outline and a whisper of their hue in the
 * paper — outline only, and 12% of the hue, because the text is ink on paper
 * and a saturated bubble is an unreadable bubble. Everyone else keeps the
 * house paper-and-ink, which is what makes the coloured ones read as *whose*.
 */
function colourBubble(i: number): { background: string; outline: string } {
  return {
    background: mixHex(kidTheme.paper, SPECTRUM[i].light, 0.12),
    outline: SPECTRUM[i].deep,
  };
}

const BUBBLE_STYLE: Partial<Record<Stage, { background: string; outline: string }>> = {
  red: colourBubble(0),
  orange: colourBubble(1),
  yellow: colourBubble(2),
  green: colourBubble(3),
  blue: colourBubble(4),
  indigo: colourBubble(5),
  // No `violet`. He has no lines, so he has no bubble, so there is nothing to
  // dress — and an entry here would be the first half of somebody giving him
  // one.
};

function bubbleStyleOf(who: Stage): { background?: string; outline?: string } {
  return BUBBLE_STYLE[who] ?? {};
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// ---------------------------------------------------------------------------
// API 3 — the camera and the wide scenery layer
// ---------------------------------------------------------------------------
//
// `Cam`, `Camera`, `project` and `projectMark` are the kit's
// (`src/lib/kid/staging.tsx`) and are re-exported at the foot of this file.
// Bubbles live *outside* the camera — a zoomed bubble is unreadable — so a
// bubble on a character inside one is placed with `projectMark(cam, mark)`.

/**
 * How far past the frame this episode's scenery has to reach.
 *
 * Bigger than episode two's box, and it has to be: Scene 24 pulls back "until
 * he is one speck", Scene 31 pulls back until the whole planet is in frame, and
 * an `<svg>` clips to its own viewport, so a plain full-frame one loses its
 * edges the moment a scene goes below 1×.
 */
export const WIDE = { x: -1600, y: -900, w: 5200, h: 2900 } as const;

export const WideLayer = makeWideLayer(WIDE);

// ---------------------------------------------------------------------------
// API 4 — the world: painted plates
// ---------------------------------------------------------------------------

/**
 * Every plate this episode can name.
 *
 * Twelve of them are its own (`backgrounds.mjs` → `npm run backgrounds --video
 * sky-blue`). The thirteenth, `hill_day`, is **episode two's own file**, reused
 * verbatim for Scenes 1 and 30 — the crayon frame story happens on the hill the
 * last episode bracketed, and there is no reason to pay for a second painting
 * of the same sky. Reusing the file rather than copying it also means the two
 * episodes' hill cannot drift apart, because there is only one of them.
 */
export const PLATES = {
  ...BACKGROUNDS,
  hill_day: WIND_BACKGROUNDS.hill_day,
} as const;

export type PlateKey = keyof typeof PLATES;

/**
 * The painted world under a scene — Tier 2, and the one every staged scene
 * starts with.
 *
 *   <PaintedSky bg="garden_day" phase={1.1} />
 *
 * Three rules a scene has to keep in mind:
 *
 *   - **Pass a different `phase` per scene.** Same reason characters get one:
 *     two consecutive scenes drifting in lockstep read as one long shot with a
 *     cut in it.
 *   - **The plate is scenery, and only scenery.** Anything that moves, gets
 *     touched, or has to line up with a character stays SVG on top — the
 *     garden's flowerbed and duck (Scene 6 has to drain the colour out of them,
 *     and paint cannot go grey), the raindrops, the seven shards, the volcano,
 *     the astronaut, every arrow and every diagram. See `backgrounds.mjs`.
 *   - **`drift={0}` is a staging decision, not an optimisation.** Scene 5's
 *     whole joke is a star field in which *nothing changes*, and a sky
 *     breathing behind it is something changing.
 */
export const PaintedSky: React.FC<
  Omit<KidPaintedBackdropProps, "src"> & { bg: PlateKey }
> = ({ bg, ...rest }) => <KidPaintedBackdrop src={staticFile(PLATES[bg])} {...rest} />;

/** Every generated plate is this size; the reused `hill_day` too. */
const PLATE = { w: 1344, h: 768 } as const;

/**
 * A **feature in a plate**, as a composition y.
 *
 * `frac` is the feature's height as a fraction of the plate — measured off the
 * image, never guessed. The measured set is written down in `backgrounds.mjs`;
 * the two that matter are `sea_sunset` at 0.5391 and `sea_dusk` at 0.5130,
 * because THE VOLCANO RULE says the sleeping volcano sits on the *measured*
 * horizon or it floats (script.md, Production notes).
 *
 * This exists because the number is not eyeballable. Two real transforms sit
 * between the plate and the frame and both move it: `objectFit: cover` on a
 * 1.75 plate inside a 1.778 frame crops ~9px off the top and bottom, and
 * `KidPaintedBackdrop`'s overscan then scales the whole thing about the frame's
 * centre by however much drift and pan the scene asked for. Pass the *same*
 * numbers you passed to `PaintedSky`.
 *
 * The plate's slow drift moves the feature by up to `drift * 0.45` px more, on
 * a 26-second cycle. That is deliberately not modelled here: a volcano that
 * breathes with the sea it is standing in is correct, and a volcano pinned to a
 * static y while the water drifts under it is the thing that reads as broken.
 */
export function plateY(
  frac: number,
  opts?: { drift?: number; dx?: number; dy?: number; zoom?: number },
): number {
  const { drift = 12, dx = 0, dy = 0, zoom = 1 } = opts ?? {};
  const cover = Math.max(WIDTH / PLATE.w, HEIGHT / PLATE.h);
  const covered = PLATE.h * cover;
  const yCover = frac * covered + (HEIGHT - covered) / 2;
  const overscan =
    1 +
    Math.max(
      (drift * 2.4 + Math.abs(dx) * 2) / WIDTH,
      (drift * 2.4 + Math.abs(dy) * 2) / HEIGHT,
    );
  return HEIGHT / 2 + (yCover - HEIGHT / 2) * overscan * zoom + dy;
}

/**
 * The sanctioned fix for a character who is hard to find: darken the world
 * behind them. A soft elliptical shadow, sold in-fiction as shade.
 *
 * **This episode needs it more than episode two did, and for the opposite
 * reason.** Puff was too faint; Ray is too *bright* — a warm-white body on a
 * gold sun surface or a sunlit lawn has almost no value contrast, and the fix
 * is the same one: darken behind him rather than change the character. His
 * `brightness` is an arc script.md spends the episode drawing, so it is not
 * available as a legibility knob.
 */
export const SoftShade: React.FC<{
  x: number;
  y: number;
  rx?: number;
  ry?: number;
  strength?: number;
  color?: string;
}> = ({ x, y, rx = 520, ry = 400, strength = 0.32, color = "22,48,72" }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse ${rx}px ${ry}px at ${x}px ${y}px, rgba(${color},${strength}) 0%, rgba(${color},${strength * 0.55}) 42%, transparent 74%)`,
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// Recurring prop — the paint roller
// ---------------------------------------------------------------------------

/**
 * Sunny's paint roller, and the episode's one physical object.
 *
 * It lives here rather than in a scene file because it fires in three scenes in
 * two different act files and it is the *same* roller every time: the cold open
 * (where the last stroke of the title turns out to be his), Scene 16 (where the
 * Narrator asks to see the paint and it is completely dry) and Scene 23 (where
 * he is still holding it while being told there is no paint). The gag only
 * works if the audience recognises the prop, which means one component.
 *
 * `wet` is the whole joke: at 0 the sleeve is bare and there is nothing on the
 * frame, at 1 it is loaded with sky-blue. **It is 1 exactly once, in the cold
 * open**, because that is the only moment the show lets him appear to be right.
 */
export const PaintRoller: React.FC<{
  x: number;
  y: number;
  scale?: number;
  /** Degrees. 0 is the handle straight down, sleeve up. */
  rot?: number;
  /** 0 bone dry, 1 loaded. */
  wet?: number;
  color?: string;
  zIndex?: number;
}> = ({ x, y, scale = 1, rot = 0, wet = 0, color = kidTheme.skyTop, zIndex }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`,
      zIndex,
      pointerEvents: "none",
    }}
  >
    <svg width={220} height={420} viewBox="-110 -210 220 420" overflow="visible">
      {/* Handle, grip, and the bent arm up to the sleeve. */}
      <path
        d="M 0 200 L 0 70"
        stroke={kidTheme.ink}
        strokeWidth={26}
        strokeLinecap="round"
      />
      <rect x={-22} y={96} width={44} height={104} rx={22} fill={kidTheme.tomato} stroke={kidTheme.ink} strokeWidth={9} />
      <path
        d="M 0 70 L 0 10 L -62 10"
        stroke={kidTheme.ink}
        strokeWidth={18}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* The sleeve. Bare grey-white when dry; the paint is a separate shape
          on top, so "dry" is a thing the audience can see rather than infer. */}
      <rect x={-124} y={-34} width={128} height={88} rx={30} fill="#e8e2d4" stroke={kidTheme.ink} strokeWidth={9} />
      {wet > 0.02 ? (
        <g opacity={Math.min(1, wet)}>
          <rect x={-120} y={-30} width={120} height={80} rx={28} fill={color} />
          {/* A dribble, because a loaded roller drips. */}
          <path
            d={`M -76 50 q -6 ${26 * wet} 2 ${40 * wet}`}
            stroke={color}
            strokeWidth={11}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ) : null}
    </svg>
  </div>
);

/** A soft vignette, for a scene that wants its edges pulled down. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.4 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 76% 76% at 50% 50%, transparent 40%, rgba(20,42,66,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// API 5 — the seven, as an arc
// ---------------------------------------------------------------------------

/**
 * Where the i-th colour sits on the rainbow arc, in composition coordinates.
 *
 * One function, because **four scenes have to agree on it**: Scene 9 fans the
 * seven out into it, Scene 10 walks Ray along it greeting them, Scene 11
 * freezes it behind the RAINBOW card and Scene 13 snaps it back together. Marks
 * picked by eye in four places would drift, and the arc is the biggest picture
 * in Act One.
 *
 * Red on the outside (i = 0, the top of the arc) through to violet on the
 * inside, which is the way round a real rainbow is and the order the roll call
 * names them in.
 */
export function arcPoint(
  u: number,
  opts?: { cx?: number; cy?: number; rx?: number; ry?: number; spread?: number },
): { x: number; y: number; angle: number } {
  const { cx = 960, cy = 1120, rx = 700, ry = 520, spread = 1 } = opts ?? {};
  // Laid along the top of an ellipse, from 201° to 339° — a wide, shallow bow
  // rather than a half circle, because a half circle puts violet on the floor
  // at either end and the seven have to be *countable*, which means all seven
  // in frame with air around each one.
  //
  // All seven sit on the SAME ellipse rather than on concentric bands. A real
  // rainbow is bands; this is seven characters standing in a rainbow-shaped
  // line, which is what Scene 10 needs (Ray walks along it greeting them one at
  // a time) and what "red on the outside through to violet" means when the
  // colours have faces: red at the left-hand end, violet at the right.
  const a = Math.PI * (201 / 180) + Math.PI * ((339 - 201) / 180) * u;
  return {
    x: cx + Math.cos(a) * rx * spread,
    y: cy + Math.sin(a) * ry * spread,
    // Tangent to the arc, for a shard banking along it.
    //
    // **Normalised to (-180, 180].** The raw expression runs 291° -> 429° across
    // the bow, which is the same direction but is not a *lean*: fed to a `bank`
    // prop at even a quarter strength it rotates a character ninety degrees, and
    // a still of the roll call had Ray walking the line lying on his back with
    // his tail in the air. Along the arc reads as zero, the left-hand end leans
    // back, the right-hand end leans forward.
    angle: wrapDegrees(((a + Math.PI / 2) * 180) / Math.PI),
  };
}

/** An angle in degrees, wrapped to (-180, 180]. */
function wrapDegrees(deg: number): number {
  const d = ((deg % 360) + 360) % 360;
  return d > 180 ? d - 360 : d;
}

/** `arcPoint` for the i-th of the seven. */
export function shardPoint(
  i: number,
  opts?: Parameters<typeof arcPoint>[1],
): ReturnType<typeof arcPoint> {
  return arcPoint(i / (SPECTRUM.length - 1), opts);
}

// ---------------------------------------------------------------------------
// API 6 — the seven, as a CAST: identity, signature, idle
// ---------------------------------------------------------------------------
//
// **PROMOTED, 2026-08-08.** The cast table (`SEVEN`), the frequency-ladder
// copy, the laws of motion (`redWalk`, `orangeFollow`, `greenSit`,
// `blueRicochet`, `blueTrail`, `indigoEcho`, `violetVibrate`), the lean
// (`leanFrom`) and the `<Shard>` wrapper all moved to
// `src/lib/kid/shards.tsx` when episode four staged Blue and Violet. Nothing
// about them changed — they are the same functions, in the same order, with
// the same comments — and every one of them is re-exported at the foot of this
// file, so the act files that import them from `./common` did not change.
//
// What stays here is the part that is *this* episode's: `SPEAKING_COLOURS`
// (typed against this episode's `Speaker`, because episode four's cast does
// not include six talking colours) and the binding below.

/**
 * The six with lines, in spectrum order — every colour except Violet. Anything
 * that iterates "the colours who take turns" iterates this, so the day somebody
 * adds a seventh entry the type stops them at `Speaker`.
 */
export const SPEAKING_COLOURS = SEVEN_NAMES.filter(
  (n): n is Extract<Speaker, ShardName> => n !== "violet",
);

/**
 * One of the seven, staged, bound to this episode's `WideLayer` (Blue's
 * direction-change trail is drawn in it). See `makeShard` for the whole
 * contract; the box is per episode, the component is not.
 */
export const Shard = makeShard(WideLayer);

/**
 * The sleeping volcano, bound to this episode's `WideLayer` and to the warm
 * snore-ring style — episode three plays every horizon it owns against orange
 * or indigo, where episode two's ring colour is invisible. Re-exported from
 * `scenes/act3.tsx`, where it used to be written out, so `recap.tsx` and
 * `s28b2_two_walkers.tsx` still import it from there.
 */
export const SleepingVolcano = makeSleepingVolcano(WideLayer, SNORE_RING_WARM);


// ---------------------------------------------------------------------------
// Placeholder scenes (Acts Two and Three, and the recap, until they are built)
// ---------------------------------------------------------------------------

/**
 * The six speaking colours stand along the bottom of the frame in spectrum
 * order, spaced so seven of them would fit — because the seventh is standing
 * there too in the finished scene and a placeholder that packs six into the
 * gap teaches the eye a spacing the staged version then contradicts.
 */
function placeholderShardMark(i: number): Mark {
  return { x: 330 + i * 226, y: hover("shard", 830, 0.72), scale: 0.72, who: "shard" };
}

const PLACEHOLDER_MARKS: Record<Exclude<Speaker, "narrator">, Mark> = {
  ray: { x: 620, y: hover("ray", 560, 1.1), scale: 1.1, who: "ray" },
  sunny: { x: 1520, y: stand("sunny", 880), scale: 0.9, who: "sunny" },
  drip: { x: 1120, y: stand("drip", 940), scale: 0.8, who: "drip" },
  puff: { x: 1000, y: hover("puff", 560, 1), scale: 1, who: "puff" },
  red: placeholderShardMark(0),
  orange: placeholderShardMark(1),
  yellow: placeholderShardMark(2),
  green: placeholderShardMark(3),
  blue: placeholderShardMark(4),
  indigo: placeholderShardMark(5),
};

/**
 * Stand-in for a scene nobody has staged yet: the real dialogue, in the real
 * voices, with the real timing, and every character on stage mouthing their own
 * lines — just no direction. Drop the finished scene into its act's map and the
 * timeline does not move by a frame.
 *
 * Ray is drawn here at Act One's brightness regardless of where the scene sits
 * in the arc. That is deliberate: a placeholder should not quietly assert a
 * number the staged scene has to match.
 */
export const ScenePlaceholder: React.FC<{ scene: TimedScene; title?: string }> = ({
  scene,
  title,
}) => {
  const cast = Array.from(
    new Set(
      (scene.turns ?? [])
        .map((t) => t.speaker as Speaker)
        .filter((s): s is Exclude<Speaker, "narrator"> => s !== "narrator"),
    ),
  );
  const marks: Cast = Object.fromEntries(cast.map((s) => [s, PLACEHOLDER_MARKS[s]]));
  const lineKey = useLineKey(scene);
  return (
    <KidBackdrop variant="day" clouds={3} ground waves={false}>
      {cast.includes("ray") ? <PlaceholderRay scene={scene} cast={marks} /> : null}
      {cast.includes("sunny") ? <PlaceholderSunny scene={scene} cast={marks} /> : null}
      {cast.includes("drip") ? <PlaceholderDrip scene={scene} cast={marks} /> : null}
      {cast.includes("puff") ? <PlaceholderPuff scene={scene} cast={marks} /> : null}
      {/* A colour with a line gets a body with its own mouth on it, exactly
          like everybody else. Fifteen of this episode's lines are theirs, and
          an unstaged scene that draws them as narration is the bug the kit
          prerequisite wave existed to fix — the placeholder must not
          re-introduce it while it stands in. */}
      {SPEAKING_COLOURS.map((who) =>
        cast.includes(who) ? <PlaceholderShard key={who} who={who} scene={scene} /> : null,
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 78,
          textAlign: "center",
          fontFamily: kidTheme.fontFamily,
        }}
      >
        <div
          style={{
            fontSize: kidType.label,
            fontWeight: 900,
            letterSpacing: 3,
            color: kidTheme.ink,
            textShadow: kidOutline(4),
          }}
        >
          {title ?? scene.id}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: kidType.min,
            fontWeight: 800,
            letterSpacing: 2,
            color: kidTheme.inkSoft,
            textShadow: kidOutline(3),
          }}
        >
          {lineKey ?? "…"} · staging to come
        </div>
      </div>
    </KidBackdrop>
  );
};

const PlaceholderRay: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Ray
    x={PLACEHOLDER_MARKS.ray.x}
    y={PLACEHOLDER_MARKS.ray.y}
    scale={1.1}
    brightness={RAY_LIGHT.actOne}
    phase={PHASE.ray}
    emotion="happy"
    speaking={useSpeaking(scene, "ray")}
    look={useLookAtSpeaker(scene, cast, "ray")}
  />
);

const PlaceholderSunny: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Sunny
    x={PLACEHOLDER_MARKS.sunny.x}
    y={PLACEHOLDER_MARKS.sunny.y}
    scale={0.9}
    phase={PHASE.sunny}
    emotion="proud"
    speaking={useSpeaking(scene, "sunny")}
    look={useLookAtSpeaker(scene, cast, "sunny")}
  />
);

const PlaceholderDrip: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Drip
    x={PLACEHOLDER_MARKS.drip.x}
    y={PLACEHOLDER_MARKS.drip.y}
    scale={0.8}
    phase={PHASE.drip}
    emotion="happy"
    speaking={useSpeaking(scene, "drip")}
    look={useLookAtSpeaker(scene, cast, "drip")}
  />
);

const PlaceholderShard: React.FC<{ who: ShardName; scene: TimedScene }> = ({
  who,
  scene,
}) => {
  const mark = PLACEHOLDER_MARKS[who as Exclude<Speaker, "narrator">];
  return (
    <Shard
      who={who}
      x={mark.x}
      y={mark.y}
      scale={mark.scale}
      speaking={useSpeaking(scene, who)}
      look="camera"
    />
  );
};

const PlaceholderPuff: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Puff
    x={PLACEHOLDER_MARKS.puff.x}
    y={PLACEHOLDER_MARKS.puff.y}
    scale={1}
    opacity={0.55}
    phase={PHASE.puff}
    emotion="happy"
    speaking={useSpeaking(scene, "puff")}
    look={useLookAtSpeaker(scene, cast, "puff")}
  />
);

// Re-exported so an act file needs one import for the whole kit — including
// everything that lives in `src/lib/kid/`, which is what keeps an act file's
// imports to `./common` and `../../../lib/kid` for the character components.
export {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  isSpeaking,
  // The contact shadow a body needs once there is a painting under it: a flat
  // character with nothing beneath it floats over painted ground in a way it
  // never did over a flat gradient.
  KidContactShadow,
  Face,
  useRig,
};
export {
  AirBlob,
  BigWordBeat,
  CaptionCard,
  CutFlash,
  Camera,
  Drip,
  KidBackdrop,
  Puff,
  Ray,
  RayShard,
  SPECTRUM,
  Sunny,
  WordCard,
  airBlobPath,
  emotionAt,
  heldBeat,
  kidEase,
  kidOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  lineKeyOf,
  lineProgress,
  lineWindow,
  moveAlong,
  project,
  settleWave,
  turnFor,
} from "../../../lib/kid";
// The ensemble kit, promoted to `src/lib/kid/shards.tsx` at episode four and
// re-exported here **so that no act file's imports changed** (STYLE: "Keep the
// episode's re-export"). Every name below was defined in this file until
// 2026-08-08 and is imported from `./common` by act1, act2, act3, recap and
// the two revision-2 scene files.
export {
  BLUE_LEG,
  BLUE_LEG_PX,
  BLUE_MAX_LEG_PX,
  GREEN_SIT_DROP,
  GREEN_SIT_FRAMES,
  INDIGO_LAG,
  RED_SPEED,
  SEVEN,
  SEVEN_NAMES,
  SHARD_BODY,
  SHARD_LEAN,
  SHARD_PHASE,
  VIOLET_AMP,
  VIOLET_HZ,
  YELLOW_WAVE,
  blueRicochet,
  blueTrail,
  greenSit,
  indigoEcho,
  leanFrom,
  orangeFollow,
  redWalk,
  shardOf,
  trailBy,
  violetVibrate,
  type Box,
  type ShardIdentity,
} from "../../../lib/kid";
export type { Cam, Emotion, EmotionInput, LookDirection, ShardName, SpectrumColor };
export type { TimedScene };
