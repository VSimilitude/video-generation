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
  SPECTRUM,
  kidEase,
  kidOutline,
  kidShadow,
  kidTheme,
  kidType,
  lineKeyOf,
  lookAt,
  makeBodyGeometry,
  makeWideLayer,
  mixHex,
  settleWave,
  useRig,
  type Cam,
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

/**
 * The seven, by name, in spectrum order. Index `i` is `SPECTRUM[i]` and
 * `SHARD_PHASE[i]` and rung `i` of the frequency ladder, everywhere, forever.
 */
export const SEVEN_NAMES = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
] as const;
export type ShardName = (typeof SEVEN_NAMES)[number];

/**
 * Phases for the seven, one each, so an arc of seven faces never blinks
 * together. Spread irregularly on purpose — an even spacing gives a visible
 * Mexican wave down the line.
 *
 * **These are identities, not decorations** (revision §2, now binding on all
 * seven rather than only on Violet): a colour keeps its phase index for the
 * whole episode, in every scene, or it is four different accidents wearing the
 * same hue. Nothing should read this array directly — `SEVEN[i].phase` and the
 * `<Shard>` component below carry it so a scene cannot forget to.
 */
export const SHARD_PHASE = [0.7, 4.1, 2.3, 5.8, 1.6, 3.2, 6.4] as const;

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
// **This is the table the whole episode's ensemble comes out of, and it is
// written exactly once.** (revision §2, the ensemble sheet; addendum 2; the
// wave-2 worklist calls it "the heaviest single item".)
//
// The rule it exists to enforce: seven bodies that bob identically are a
// diagram, seven bodies that each move *wrongly in their own way* are a cast,
// and the difference between the two is a lookup table rather than new art.
// script.md's old line about the seven being "a crowd, not a cast" is dead —
// six of them have lines now, and every one of the seven has a movement that is
// the only characterisation five of them will ever get.
//
// Three things are identity and belong here:
//
//   1. **the phase** — one index per colour for the whole episode
//      (`SHARD_PHASE[i]`). Promoted from Violet's rule to all seven: the same
//      blob every time, or he is four different accidents.
//   2. **the signature move** — the thing that colour does instead of acting.
//      It is a *law of motion*, not a route: Red's law is "one speed, dead
//      straight"; the scene says where from and where to.
//   3. **the idle** — what they do when the scene is not asking anything of
//      them, which for five of them is most of their screen time.
//
// What does NOT belong here is choreography. There is no "Scene 28b race" in
// this file and there must never be: the acts stage, the table supplies who
// each of them is while being staged.
//
// **The paused-frame test governs every one of them.** A signature that only
// exists in motion is not in the episode (the ep-2 backwards-puff finding): a
// child pausing on any frame has to be able to say which one is Red. So each
// law below has a *static* tell as well as a moving one — Red's dead-level
// zero-bank stance, Orange's identical stance exactly one body behind it,
// Yellow's raised arm, Green sitting a third of a body lower than everyone
// else, Blue's cornered trail, Indigo's identical trail four frames stale, and
// Violet's smear of ghosts around a point he never leaves.
//
// And the two blurs are two different *kinds* of blur, which is a hard
// requirement rather than a nicety: **Blue's blur is a change of DIRECTION**
// (an elbowed trail behind a body leaning into the new leg) and **Violet's is
// amplitude IN PLACE** (copies of himself either side of a fixed point, with a
// visibly wider smear than Blue's step and the highest speed of the seven). Two
// bodies with the same generic speed-smear would say the two are the same kind
// of fast, and the entire physics of the episode is that they are not.

/** One colour's identity. Data only — the helpers below do the arithmetic. */
export type ShardIdentity = {
  /** Index into `SPECTRUM`, `SHARD_PHASE` and the frequency ladder. */
  i: number;
  who: ShardName;
  /** Display name, from `SPECTRUM`. */
  name: string;
  /** Whether this colour has lines. Six do; Violet never will. */
  speaks: boolean;
  /** The identity phase. Never pass `SHARD_PHASE[i]` by hand again. */
  phase: number;
  /**
   * Cycles across the ribbon — rung `i` of the frequency ladder. Owned by
   * `RayShard` (`SHARD_CYCLES` in `src/lib/kid/characters/Ray.tsx`) and copied
   * here for reading, because the ladder and the temperaments are the same
   * statement and a table that lists one without the other invites somebody to
   * change one of them.
   */
  cycles: number;
  /**
   * How much of `SHARD_LEAN` this colour is willing to lean into its own
   * direction of travel, 0..1. Red is 0 because Red does not react to
   * anything, including where he is going; Violet is 0 because Violet does not
   * go anywhere.
   */
  lean: number;
  /**
   * How much of the rig's ordinary breathing this colour does. Red and Orange
   * are damped rather than switched off — a body with a *dead* idle reads as a
   * frozen sprite rather than as a calm character, which is a mistake this kit
   * has made before — and Blue is wound up.
   */
  idleScale: number;
  /** The signature move, in one line. Binding — revision §2. */
  signature: string;
  /** What they do when nothing is being asked of them. */
  idle: string;
};

export const SEVEN: readonly ShardIdentity[] = SEVEN_NAMES.map((who, i) => ({
  i,
  who,
  name: SPECTRUM[i].name,
  speaks: who !== "violet",
  phase: SHARD_PHASE[i],
  cycles: [1, 1.5, 2.1, 2.9, 4, 5.4, 7.2][i],
  lean: [0, 0, 0.5, 0.3, 1, 1, 0][i],
  idleScale: [0.5, 0.5, 1.1, 0.85, 1.25, 1, 1][i],
  signature: [
    "Walks. One unvaried speed, a dead-straight line, and he never reacts to anything crossing his path.",
    "Matches Red's stride exactly, one body-length behind, and never overtakes him.",
    "Waves. At everyone, continuously, including at things that are leaving.",
    "Sits down the instant anything on screen stops moving.",
    "Ricochets. Never travels more than half a frame without changing direction.",
    "Copies Blue's last move four frames late, and arrives after the joke.",
    "Vibrates so hard his own outline blurs. In place — he is the fastest thing in any frame he is in and he never goes anywhere.",
  ][i],
  idle: [
    "Barely bobs, never leans, does not react to anything entering frame. He is already walking.",
    "Red's idle, one body behind it.",
    "Still waving.",
    "Sitting, unless the frame gave him a reason to stand, which it usually did not.",
    "Ricochets in a smaller box. Blue at rest is Blue in a cupboard.",
    "Blue's idle, four frames stale.",
    "Vibrating. There is no other setting.",
  ][i],
}));

/**
 * The six with lines, in spectrum order — every colour except Violet. Anything
 * that iterates "the colours who take turns" iterates this, so the day somebody
 * adds a seventh entry the type stops them at `Speaker`.
 */
export const SPEAKING_COLOURS = SEVEN_NAMES.filter(
  (n): n is Extract<Speaker, ShardName> => n !== "violet",
);

/** Look a colour up by name: `shardOf("blue").phase`. */
export function shardOf(who: ShardName): ShardIdentity {
  return SEVEN[SEVEN_NAMES.indexOf(who)];
}

/** The most any of the seven ever leans, in degrees. */
export const SHARD_LEAN = 26;

/**
 * **A heading, turned into a lean.** Degrees in, degrees out.
 *
 * Feeding a heading straight to a `bank` prop is a mistake this episode has
 * already made twice — `arcPoint` carries a paragraph about it — and on a shard
 * it is worse than on Ray, because `RayShard` rotates the *whole* body about
 * its centre: at 40° the face swings off to the side of the wave and the pair
 * stops being a character. It also cannot be fixed by scaling the angle down,
 * because a heading is circular: 179° and −179° are the same direction and
 * scaling them gives two opposite leans.
 *
 * So the lean is the **sine** of the heading, which is the only honest reading
 * of it on a body with no front: climbing leans back, diving leans forward, and
 * travelling flat out to the left or the right — which is most of what happens
 * in this episode — leans not at all.
 */
export function leanFrom(headingDeg: number, amount: number): number {
  return -Math.sin((headingDeg * Math.PI) / 180) * SHARD_LEAN * amount;
}

// --- the laws of motion ------------------------------------------------------

type Pt = { x: number; y: number };
/** Same shape `moveAlong` returns, so `heading={p.angle}` reads the same way. */
type Travel = { x: number; y: number; angle: number };

/**
 * **Red's one speed**, in composition px per second at scale 1.
 *
 * It is a constant rather than a per-scene number because it is the joke: Red
 * crosses Scene 18's corridor, Scene 23's finished diagram, the sunset race and
 * the recap's split screen at *exactly* this, and a scene that speeds him up to
 * make an entrance land has deleted the character. 108 px/s is just under
 * eighteen seconds to cross the frame, which is slow enough to be a decision
 * and fast enough that he does arrive.
 */
export const RED_SPEED = 108;

/**
 * Red, walking. `t` is seconds; `from` is where he is at `t = 0`.
 *
 * A dead-straight horizontal line at one speed, and the returned `angle` is
 * exactly 0 or 180 — no bow, no ease, no anticipation, none of the things the
 * rest of this kit spends its time on, because the whole of Red is that he does
 * not do them. `moveAlong` is the wrong tool for him on purpose.
 */
export function redWalk(
  t: number,
  from: Pt,
  opts?: { dir?: number; speed?: number },
): Travel {
  const dir = opts?.dir ?? 1;
  const speed = opts?.speed ?? RED_SPEED;
  return { x: from.x + dir * speed * t, y: from.y, angle: dir >= 0 ? 0 : 180 };
}

/**
 * **The follow law**, shared by Orange and Indigo: run somebody else's path,
 * late. Both of them are *the same joke at two lags*, and writing them as one
 * function is what stops them drifting into two different ones.
 *
 * It takes the leader's path as a function of time rather than a position, so
 * the follower is literally the leader's own motion replayed — which is what
 * "matches his stride exactly" and "copies his last move" both mean, and is
 * unfakeable by hand-tuning an offset.
 */
export function trailBy<T>(path: (t: number) => T, t: number, lag: number): T {
  return path(t - lag);
}

/**
 * One body-length, the unit Orange's gap is specified in.
 *
 * 240 rather than the 200 of `RAY_SHARD_BOX`, and the difference is the point:
 * a shard's *drawn* body is a 188-unit ribbon plus a round cap at each end, so
 * it is wider than the box it is placed by. Specified against the box, Orange
 * ends up overlapping Red by about thirty pixels — which on a still reads as
 * one two-headed animal rather than as a man and his second.
 */
export const SHARD_BODY = 240;

/**
 * Orange: Red's path, delayed by exactly the time it takes Red to walk one body
 * length. Not "one body length behind" as a subtraction — as a *delay*, so that
 * on the frame Red turns a corner (he never does) or stops (he never does),
 * Orange does the same thing one body later and still never overtakes.
 *
 *   const red = (tt: number) => redWalk(tt, RED_FROM);
 *   const r = red(t);
 *   const o = orangeFollow(red, t, 0.9 * SHARD_BODY);
 */
export function orangeFollow<T>(
  red: (t: number) => T,
  t: number,
  bodyPx: number = SHARD_BODY,
  speed: number = RED_SPEED,
): T {
  return trailBy(red, t, bodyPx / speed);
}

/** How much of a wave Yellow is doing. The answer is always all of it. */
export const YELLOW_WAVE = 1;

/**
 * Green sits this far below where he was standing, at scale 1.
 *
 * A quarter of a body, and it started life at a third of that. On a sheet of
 * all seven, 34px read as "slightly lower" rather than as "sat down" — and
 * "slightly lower" is not a signature, it is a mistake. At 52 he is
 * unmistakably the one who has settled, in a paused frame, next to six who have
 * not.
 *
 * It is also very nearly the slack there is to use: a shard's ribbon is drawn
 * at local +50 inside a box that runs to +100, so a Green who has dropped 52
 * has put his wave *on the ground he was standing over* and gone no further.
 * A scene can therefore stand him on a `stand("shard", …)` mark and let him sit
 * without him sinking through the floor.
 */
export const GREEN_SIT_DROP = 52;
/** "The instant": five frames, a sixth of a second. Not a decision, a reflex. */
export const GREEN_SIT_FRAMES = 5;

/**
 * Green's sit, 0..1. `changedAt` is the frame the world last started or stopped
 * moving, and `still` is which of the two it did.
 *
 *   const sit = greenSit(frame, beatFrom, frame >= beatFrom);
 *   <Shard who="green" sit={sit} … />
 *
 * A held beat is therefore *automatically* a Green joke, which is the point of
 * him: this episode has forty-one of them and he sits down in every single one.
 */
export function greenSit(frame: number, changedAt: number, still: boolean): number {
  const u = kidEase.easeOutQuad(
    Math.max(0, Math.min(1, (frame - changedAt) / GREEN_SIT_FRAMES)),
  );
  return still ? u : 1 - u;
}

/** Frames Blue holds one leg of a ricochet before he changes direction. */
export const BLUE_LEG = 9;
/**
 * How far one leg travels, in px at scale 1 — **bounded by the box he is in**.
 *
 * A leg longer than the box is a leg that spends most of itself being clamped
 * against a wall, and a clamped leg is a short one: the first version of this
 * put a fixed 150–330 into Scene 19's 400×210 corridor and produced legs of
 * ten pixels, which drew a Blue who twitched instead of ricocheting and a trail
 * with no visible corner in it. So the range is capped at 45%..85% of the box's
 * shorter side. A tight box therefore gives shorter, slower legs at the same
 * nine frames each, which is the right answer: a pinball in a small box changes
 * direction just as often and covers less ground.
 */
export const BLUE_LEG_PX = { min: 150, max: 330 } as const;
/**
 * The hard rule (revision §2): "never travels more than half a frame without
 * changing direction". `BLUE_LEG_PX.max` is well inside it; this is the ceiling
 * a future scene is not allowed to raise past, and `blueRicochet` clamps to it.
 */
export const BLUE_MAX_LEG_PX = WIDTH / 2;

/** The box a ricochet happens inside, in composition coordinates. */
export type Box = { x: number; y: number; w: number; h: number };

function hash01(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * The k-th corner of Blue's path, as a pure function of k.
 *
 * A real billiard rather than seven random points: each leg leaves the last
 * corner at a heading that has **turned by at least 62°** from the one before
 * it, and reflects off the walls of the box when it reaches them. Both of those
 * put a corner in the path, and a corner is the whole of Blue — the audience
 * has to be able to see him change his mind, not merely see him fast.
 *
 * Iterated from k = 0 rather than memoised, because everything in this kit is a
 * pure function of the frame and Remotion hands frames to a *pool* of tabs: a
 * cache that survives between frames renders a different film in each tab.
 * A hundred legs of trigonometry is nothing next to one `<Face>`.
 */
function blueCorner(k: number, box: Box, seed: number): Pt {
  const span = Math.min(box.w, box.h);
  const lo = Math.min(BLUE_LEG_PX.min, span * 0.45);
  const hi = Math.min(BLUE_LEG_PX.max, span * 0.85, BLUE_MAX_LEG_PX);
  let x = box.x + box.w / 2;
  let y = box.y + box.h / 2;
  let dir = hash01(seed + 0.5) * Math.PI * 2;
  for (let n = 0; n < k; n++) {
    const h1 = hash01(seed + n * 3.1);
    const h2 = hash01(seed + n * 7.7 + 1.3);
    // A real turn, either way: 62°..148°. Anything less is a wobble.
    dir += ((h1 < 0.5 ? -1 : 1) * ((62 + h2 * 86) * Math.PI)) / 180;
    const len = lo + hash01(seed + n * 5.3 + 2.7) * Math.max(0, hi - lo);
    let nx = x + Math.cos(dir) * len;
    let ny = y + Math.sin(dir) * len;
    // Bounce off the wall by **turning the heading and re-walking the leg**,
    // rather than by reflecting the endpoint. Reflecting the endpoint is the
    // obvious way to do it and it is wrong: it folds the leg back on itself and
    // leaves a *shorter* one, so a Blue near a wall stops travelling and starts
    // twitching. The distance he covers is his whole characterisation, so it is
    // the thing the wall is not allowed to take.
    if (nx < box.x || nx > box.x + box.w) {
      dir = Math.PI - dir;
      nx = x + Math.cos(dir) * len;
      ny = y + Math.sin(dir) * len;
    }
    if (ny < box.y || ny > box.y + box.h) {
      dir = -dir;
      nx = x + Math.cos(dir) * len;
      ny = y + Math.sin(dir) * len;
    }
    x = Math.max(box.x, Math.min(box.x + box.w, nx));
    y = Math.max(box.y, Math.min(box.y + box.h, ny));
  }
  return { x, y };
}

/**
 * **Blue, ricocheting.** `frame` is scene-local; the box is where he is allowed
 * to be.
 *
 * Constant speed along each leg and a hard corner at the end of it — no ease,
 * because a ricochet that decelerates into its own bounce is a float. The
 * `angle` is the heading of the leg he is on, so `bank` leans him into the leg
 * he is on *now* while his trail still points at the one he was on, which is
 * the frame-by-frame read of somebody who has just changed his mind.
 */
export function blueRicochet(frame: number, box: Box, seed = 0): Travel {
  const k = Math.floor(frame / BLUE_LEG);
  const u = frame / BLUE_LEG - k;
  const a = blueCorner(k, box, seed);
  const b = blueCorner(k + 1, box, seed);
  return {
    x: a.x + (b.x - a.x) * u,
    y: a.y + (b.y - a.y) * u,
    angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
}

/**
 * **Blue's blur, and it is a change of DIRECTION.**
 *
 * The path he has been on for the last `BLUE_LEG * 2` frames, as points, oldest
 * first — a window deliberately **two legs long**, so at least one corner is
 * inside it on every frame of the episode and there is no paused frame in which
 * Blue looks like something merely travelling fast. Feed it straight to
 * `<Shard trail={…} />`, which fades it from nothing at the old end.
 *
 * It is drawn as a line rather than as ghost bodies for the same reason it is
 * two legs long: ghosts of a body say "this thing is smeared", and a bent line
 * says "this thing turned". Violet gets the ghosts. The two must never be given
 * the same treatment — see the header of this section.
 *
 * One leg is roughly one body long, so a one-leg window is a tail that hides
 * behind the body it belongs to. That was the first version and it was
 * invisible on the sheet.
 */
export function blueTrail(
  frame: number,
  box: Box,
  seed = 0,
  span = BLUE_LEG * 2,
): { x: number; y: number }[] {
  const n = 14;
  const out: { x: number; y: number }[] = [];
  for (let s = 0; s <= n; s++) {
    const p = blueRicochet(frame - span + (span * s) / n, box, seed);
    out.push({ x: p.x, y: p.y });
  }
  return out;
}

/** Frames Indigo lands behind Blue. Four. It is in the script as four. */
export const INDIGO_LAG = 4;

/**
 * Indigo: Blue's own path, four frames ago.
 *
 *   const blue = (f: number) => blueRicochet(f, S19_BOX);
 *   const b = blue(frame);
 *   const ind = indigoEcho(blue, frame);
 *
 * Because it is the same function, Indigo inherits Blue's corners — his trail
 * has the same elbow in it, four frames stale, which is the drawing of "does
 * everything Blue does, slightly worse, half a beat late" and is also
 * physics-true (an adjacent wavelength is a faded copy).
 */
export function indigoEcho<T>(blue: (frame: number) => T, frame: number): T {
  return trailBy(blue, frame, INDIGO_LAG);
}

/**
 * **Violet's amplitude**, in px at scale 1, and **his frequency**, in Hz.
 *
 * Sized against Blue rather than picked: Blue's fastest leg is 330px in nine
 * frames, about 37px per frame. Violet's peak speed is `2π · hz · amp` = about
 * 1700 px/s = **57px per frame**, and his smear is 2·amp = 68px wide against
 * Blue's 37px step. So on any frame containing both, Violet is both the faster
 * object and the wider blur, which is what revision §2 asks for in as many
 * words — and he achieves it *without going anywhere*, which is the joke.
 */
export const VIOLET_AMP = 34;
export const VIOLET_HZ = 8;

/**
 * Violet, vibrating in place. Returns a displacement, not a position: he is
 * always exactly where the scene put him, plus this.
 *
 * Two incommensurate frequencies (the vertical is 1.37× the horizontal and
 * offset), so the figure never closes into a visible loop — a Lissajous that
 * repeats reads as a tidy little orbit, and Violet is not tidy.
 *
 * Applied automatically by `<Shard who="violet">`, so a scene cannot stage him
 * and forget: there is no frame of this episode in which Violet holds still.
 */
export function violetVibrate(t: number, strength = 1): { dx: number; dy: number } {
  const a = VIOLET_AMP * strength;
  return {
    dx: a * Math.sin(2 * Math.PI * VIOLET_HZ * t),
    dy: a * 0.62 * Math.sin(2 * Math.PI * VIOLET_HZ * 1.37 * t + 1.1),
  };
}

/**
 * The four bands a ricochet trail is drawn in: `[from, to, alpha, width]` along
 * the trail, oldest first. Overlapping at three points instead of thirteen —
 * see the note where it is used.
 */
const TRAIL_BANDS: Array<[number, number, number, number]> = [
  [0, 0.3, 0.12, 8],
  [0.3, 0.56, 0.24, 12],
  [0.56, 0.8, 0.4, 16],
  [0.8, 1, 0.58, 21],
];

// --- the body, with its identity already on ---------------------------------

/**
 * **One of the seven, staged.** The way an act should ever reach for a shard.
 *
 *   <Shard who="blue" x={p.x} y={p.y} heading={p.angle} trail={blueTrail(frame, BOX)} />
 *   <Shard who="green" x={220} y={GROUND} sit={greenSit(frame, beatFrom, held)} />
 *   <Shard who="violet" x={1500} y={480} />
 *
 * It is a thin wrapper over `RayShard` and it stays thin. All it does is put
 * the identity on — and put it on in the places a scene file cannot be trusted
 * to remember, because it has forgotten them before:
 *
 *   - the **phase** comes from the table, always, so a colour blinks on its own
 *     clock in every scene it appears in;
 *   - the **heading** becomes a lean rather than a rotation (`leanFrom`), and
 *     is scaled by the colour's own willingness to do it, so Red stays dead
 *     level however enthusiastic the heading he was handed and Violet — who has
 *     no heading, because he does not travel — stays upright;
 *   - **Yellow is waving** and **Violet is vibrating** whether or not the scene
 *     asked, because those are not things they do, they are what they are;
 *   - **Green's sit** is one number that moves him down, kills his idle and
 *     flattens him onto the floor, so "sat down" is one prop rather than three
 *     that a later edit can get out of step.
 *
 * What it does NOT do is decide where anybody is. Position, timing, look,
 * emotion and the decision to be on screen at all belong to the scene.
 */
export const Shard: React.FC<{
  who: ShardName;
  x: number;
  y: number;
  scale?: number;
  /**
   * **A heading in degrees**, straight from a travel helper (`blueRicochet`,
   * `redWalk`, `moveAlong`). Turned into a lean by `leanFrom` and the colour's
   * own willingness to lean — never used as a rotation. Pass `p.angle`.
   */
  heading?: number;
  /** Green: 0..1 from `greenSit`. Ignored on the other six. */
  sit?: number;
  /** Yellow: wave size, 0..1. Defaults to all of it. */
  wave?: number;
  /** Violet: vibration strength, 0..1. Defaults to all of it. */
  vibrate?: number;
  /** Blue and Indigo: the direction-change blur, from `blueTrail`. */
  trail?: { x: number; y: number }[];
  /**
   * On for Yellow (his wave *is* his characterisation) and off for the other
   * six, unless a scene says otherwise. `arms={false}` on Yellow is therefore a
   * scene deliberately taking his signature away — legitimate in a shot where
   * seven of them are 44px tall and eight raised arms are noise, and a mistake
   * anywhere else.
   */
  arms?: boolean;
  opacity?: number;
  idle?: number;
  eyeLife?: number;
  emotion?: Parameters<typeof RayShard>[0]["emotion"];
  speaking?: boolean;
  look?: Parameters<typeof RayShard>[0]["look"];
  flip?: boolean;
  zIndex?: number;
}> = ({
  who,
  x,
  y,
  scale = 1,
  heading = 0,
  sit = 0,
  wave,
  vibrate,
  trail,
  arms,
  opacity = 1,
  idle,
  eyeLife,
  emotion,
  speaking,
  look,
  flip,
  zIndex,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = shardOf(who);
  const t = frame / fps;

  // Violet's displacement is applied here rather than by the caller so that
  // there is no way to stage him still. It scales with the body, like a
  // vibration would.
  const shake = who === "violet" ? violetVibrate(t, vibrate ?? 1) : { dx: 0, dy: 0 };
  const drop = who === "green" ? sit * GREEN_SIT_DROP : 0;

  return (
    <>
      {trail && trail.length > 1 ? (
        <WideLayer zIndex={(zIndex ?? 14) - 1}>
          {/* Graded in four BANDS rather than per segment, and that is a
              rendering fix rather than a style: fourteen translucent segments
              with round caps overlap at every joint, each overlap composites
              twice, and the trail comes out as a string of beads. Four
              contiguous polylines overlap at three points instead of thirteen,
              and a polyline gets `strokeLinejoin` for free — which is what
              keeps the corner (the entire point of Blue's blur) a corner rather
              than a gap. A gradient would be the obvious answer and is not
              available: it needs a per-instance id and the seven share one
              document. */}
          {TRAIL_BANDS.map(([from, to, alpha, width], k) => {
            const lo = Math.floor((trail.length - 1) * from);
            const hi = Math.ceil((trail.length - 1) * to);
            const d = trail
              .slice(lo, hi + 1)
              .map((p, j) => `${j === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
              .join(" ");
            return (
              <path
                key={k}
                d={d}
                fill="none"
                stroke={SPECTRUM[id.i].fill}
                strokeWidth={width * scale}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={alpha * opacity}
              />
            );
          })}
        </WideLayer>
      ) : null}
      <RayShard
        color={id.i}
        x={x + shake.dx * scale}
        y={y + (drop + shake.dy) * scale}
        scale={scale}
        phase={id.phase}
        bank={leanFrom(heading, id.lean)}
        // Yellow's arm is his whole characterisation, so it is on unless a scene
        // takes it off; everyone else's is off unless a scene puts it on (seven
        // pairs of arms is a lot of frame).
        arms={arms ?? who === "yellow"}
        pose={who === "yellow" ? "wave" : "rest"}
        wave={wave ?? YELLOW_WAVE}
        // Violet's own body already fizzes at the top of the frequency ladder;
        // this is the *other* blur, the one that is a body moving rather than a
        // wave being short. See the section header.
        //
        // A CONSTANT smear rather than one derived from his instantaneous
        // velocity, and that was a real choice: velocity-derived ghosts collapse
        // to nothing at the two ends of every swing, so a third of the paused
        // frames in the episode would have shown a perfectly crisp Violet. The
        // smear IS the amplitude, which is what the sheet says his blur is, so
        // it is drawn as the amplitude and is there in every frame.
        smear={
          who === "violet"
            ? {
                dx: VIOLET_AMP * 0.85 * (vibrate ?? 1),
                dy: VIOLET_AMP * 0.24 * (vibrate ?? 1),
              }
            : undefined
        }
        idle={idle ?? id.idleScale * (who === "green" ? 1 - 0.85 * sit : 1)}
        eyeLife={eyeLife}
        emotion={emotion}
        speaking={speaking}
        look={look}
        opacity={opacity}
        flip={flip}
        zIndex={zIndex}
      />
    </>
  );
};

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
export type { Cam, Emotion, EmotionInput, LookDirection, SpectrumColor };
export type { TimedScene };
