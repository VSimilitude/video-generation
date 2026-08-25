import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Blobby,
  Camera,
  Drip,
  Face,
  KidBackdrop,
  KidContactShadow,
  Puff,
  Rock,
  SpeechBubble,
  Sunny,
  EMOTION_EASE,
  RAY_SHARD_BOX,
  blueRicochet,
  blueTrail,
  kidEase,
  kidInkOutline,
  kidOutline,
  kidShadow,
  kidTheme,
  kidType,
  lineKeyOf,
  lookAt,
  makeBodyGeometry,
  makeShard,
  makeWideLayer,
  mixHex,
  settleWave,
  shardOf,
  useRig,
  type Box,
  type Cam,
  type Emotion,
  type EmotionInput,
  type LookDirection,
  type Mark as KitMark,
  type ShardName,
  type SpectrumColor,
} from "../../../lib/kid";
import {
  isSpeaking,
  useSpeaking,
  type DialogueTurn,
  type TimedScene,
  type TimedTurn,
} from "../../../lib/narration";
import { BACKGROUNDS } from "../backgroundManifest";
import { NARRATION } from "../narrationManifest";
import { EMBER_BOX, EMBER_COLOR, Ember, GlowDrop } from "./Ember";
import { VOLCANO_PORTRAIT, makeVolcano, volcanoFace } from "./Volcano";

// Shared kit for "Ember and the Mountain That Said Good Morning" — Little Big
// World, episode five.
//
// Same shape as episodes three and four's, and thinner again: everything four
// episodes wrote identically now lives in `src/lib/kid/`. What is left here is
// only what is genuinely this episode's:
//
//   the cast    `Speaker`/`Stage`, `PHASE`, `CHAR_BOX`, and the two new bodies
//               (`Ember`, `Volcano` — each in its own file)
//   the timing  `turnsOf`, bound to *this* video's narration manifest
//   the world   `COAST` and `CHAMBER` — the two places this episode happens in,
//               the plates that paint them, and the seat the volcano stands on
//   the kid     `KidSilhouette`, copied forward from ep 4 and FLAGGED (below)
//
// The staging API is episodes two through four's — `useStage` + per-line
// emotion maps + `Bubbles` — unchanged, so an act file written against ep 4
// reads identically here.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/**
 * **Every voice in the show.** `narrator` is off-stage: no body, no bubble.
 *
 * Nine voices, the biggest cast the series has had, and **two of them are new
 * in a way nothing before has been**: `ember` is a brand-new hero, and
 * `volcano` is four episodes of scenery that has been given a mouth. The
 * volcano is why `VisualSpeaker` no longer contains him — up to ep 4 he was
 * furniture with no `Mark`; here he is staged, looked at, and answered.
 *
 * **There is no `violet`, and there is never going to be one** (world rule 3,
 * carried from ep 3). He works harder than anybody on screen, is never once
 * looked at, and the joke survives only while he is the one who never speaks.
 * `speakerOf` throws if a line key ever claims otherwise.
 */
export type Speaker =
  | "narrator"
  | "ember"
  | "volcano"
  | "rock"
  | "sunny"
  | "drip"
  | "puff"
  | "pip"
  | "blue";

/**
 * Bodies that appear on screen without a voice of their own.
 *
 * `kid` never speaks, in any episode, and is five canon episodes into not doing
 * it — this one opens on the sandcastle and closes on the changed horizon.
 * `violet` gets one silent garnish firing at the frame edge of Scene 22.
 */
export type VisualSpeaker = "kid" | "violet";

/** Anything that can be staged, whether or not it owns a voice. */
export type Stage = Speaker | VisualSpeaker;

/**
 * Per-character cycle offset. Breathing, blinking, mouth timing and Ember's
 * crown wobble all key off it, so two characters sharing one bob in lockstep —
 * always pass these.
 *
 * The returning cast keep the phases they had in the episodes they came from,
 * which costs nothing and means a shot with Drip and Puff in it does not
 * suddenly breathe differently from the ep-2 shot it is quoting. Blue and
 * Violet read theirs out of the promoted `SHARD_PHASE` table.
 */
export const PHASE: Record<Stage, number> = {
  narrator: 0,
  ember: 2.2,
  volcano: 5.5,
  rock: 6.8,
  sunny: 3.4,
  drip: 2.6,
  puff: 1.4,
  pip: 5.1,
  kid: 7.4,
  blue: shardOf("blue").phase,
  violet: shardOf("violet").phase,
};

// ---------------------------------------------------------------------------
// API 1 — building a scene's turns from script.md's line keys
// ---------------------------------------------------------------------------

const VOICES = new Set<string>([
  "ember",
  "volcano",
  "rock",
  "sunny",
  "drip",
  "puff",
  "pip",
  "blue",
]);

/**
 * `a1_08_ember` -> `ember`, `a1_20_volcano` -> `volcano`. The key convention
 * *is* the cast list, which is why a character line that quietly resolved to
 * `narrator` was invisible rather than an error for a whole wave of episode
 * three.
 *
 * A key ending in `_violet` throws rather than falling through. That is not
 * defensive programming, it is the series rule with teeth on it.
 */
export function speakerOf(lineKey: string): Speaker {
  const tail = lineKey.split("_").slice(2).join("_");
  if (tail === "violet") {
    throw new Error(
      `[volcano] "${lineKey}": Violet never speaks. He is the one of the seven ` +
        `who never gets a line, in this episode or any other — see the Speaker ` +
        `doc in scenes/common.tsx. His whole firing here is that nobody ` +
        `notices him.`,
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
 * silent twice as long as intended. This episode has eight *trailing* held
 * beats (Scenes 2, 13, 21, 23, 26, 28 and the recap's), and those pass an
 * explicit number and take a short `tailFrames` to match.
 */
export function turnsOf(
  keys: string[],
  opts?: { gap?: number; gaps?: Record<string, number> },
): DialogueTurn[] {
  return keys.map((key, i) => {
    const clip = NARRATION[key];
    if (!clip) throw new Error(`[volcano] no narration clip for "${key}"`);
    const explicit = opts?.gaps?.[key];
    const gapFrames =
      explicit !== undefined ? explicit : i === keys.length - 1 ? 0 : opts?.gap;
    return { clip, speaker: speakerOf(key), gapFrames };
  });
}

// ---------------------------------------------------------------------------
// API 2 — staging: who stands where, who is talking, who looks at whom
// ---------------------------------------------------------------------------

/**
 * Natural SVG box height of each body, from its component file. Needed because
 * `CharacterFrame` scales about the **bottom** of that box: a character's `y`
 * prop plus half this number is a ground line that does not move when you
 * change `scale`.
 *
 * **The volcano is not in here.** He is not a `CharacterFrame` body: he is
 * drawn into the wide layer at a baseline (`Volcano`'s `base`), because the one
 * thing every shot of him has to agree about is where his feet meet the water,
 * and that is a horizon rather than a ground line. Stage him with
 * `VOLCANO_AT` / `VOLCANO_SEAT`, never with a `Mark`.
 */
export const CHAR_BOX = {
  ember: EMBER_BOX,
  sunny: 460,
  drip: 380,
  puff: 340,
  rock: 340,
  /** Pip's ep-4 body is not promoted yet — see `PIP_STANDIN` below. */
  pip: 300,
  shard: RAY_SHARD_BOX,
  kid: 420,
} as const;
export type Body = keyof typeof CHAR_BOX;

export type Mark = KitMark<Body>;

/**
 * **Where each body's face is**, in its own natural units, negative up, from
 * the centre of its box. `markCentre` aims at it, so it is what every `look` in
 * the episode aims at.
 *
 * Ember's face sits at local y = +6 in a box centred on 0 — a hair below
 * centre, because her crown is taller than her chin is deep. Rock's is at −14,
 * measured off `Rock.tsx`'s own `<Face y={-14}>`; without it every character
 * talking to Rock aimed at the middle of a 620-wide boulder, which is his knee.
 */
const FACE_OFFSET = {
  ember: 6,
  rock: -14,
  shard: -77,
} as const;

const geometry = makeBodyGeometry({
  box: CHAR_BOX,
  body: "ember",
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

/** The point another character should look at. */
export function centreOf(m: Mark): { x: number; y: number } {
  return markCentre(m);
}

/** Bubble centre for a mark. */
export function bubbleOver(m: Mark): number {
  return bubbleAbove(m);
}

export type Cast = Partial<Record<Stage, Mark>>;

// ---------------------------------------------------------------------------
// API 2b — the cameo bodies (`speakerVisual`)
// ---------------------------------------------------------------------------

/**
 * Per-line override: "this NARRATOR turn comes out of *that* body's mouth".
 * A key with no entry keeps its voiced speaker, so a scene only lists its
 * cameos. Unused in this episode — the kid is silent, Violet is silent — and
 * threaded through anyway.
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
 * One hook per scene, and the way to drive mouths. `stage.speaking` is a plain
 * function, not a hook, so a scene with six bodies does not need six
 * conditional hook calls.
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
 * Per-line emotion for one body: `{ "a1_08_ember": "excited" }`.
 *
 * The emotion lands `lead` frames *before* the line starts and holds until that
 * body's next mapped line. Returns an `EmotionCue`, so the face *morphs* rather
 * than cutting.
 *
 * **`lead` is `NO_LEAD` on every held-beat scene in this episode**, and
 * script.md makes it a rule rather than a note: "No emotion lead on held-beat
 * scenes — cut the staging kit's 8-frame `useEmotion` lead to 0 wherever a HELD
 * BEAT direction appears." Twenty-nine of this episode's beats say so.
 *
 * Never map a line to `scared`: the rig's wobble-mouth hard-cuts to a talking
 * mouth on the first frame of a line. Put `scared` in the gap between two lines
 * instead (`emotionAt`). This episode should never need it — nothing is ever
 * menaced by anything (the tone gate).
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
    if (emotion !== current) {
      previous = current;
      at = turn.from - lead;
    }
    current = emotion;
  }
  const frames = Math.min(EMOTION_EASE, Math.max(4, lead));
  return at < 0 ? current : { emotion: current, from: previous, at, frames };
}

/** The emotion lead a held-beat scene uses. Zero. See `useEmotion`. */
export const NO_LEAD = 0;

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
  return lookAt(centreOf(from), centreOf(to));
}

/**
 * Every bubble in a dialogue scene, placed automatically. One entry per line
 * key you want a bubble for — six words maximum, and a *summary* rather than a
 * transcript.
 *
 * **A bubble is allowed to disagree with its clip, and two of them do on
 * purpose** (script.md, sound-word note): `a3_56` draws "FIRST!" in caps while
 * the MiniMax clip stays lowercase, and the chant bubbles draw their shouts.
 * Caps inside a MiniMax sentence are read letter-wise; on screen they are a
 * picture of loudness. Do not "fix" one of them to match the other.
 *
 * ---------------------------------------------------------------------------
 * **KNOWN KIT GAP, carried from ep 4 and still unfixed.** In a cutaway framing
 * with a speaker ABOVE the frame's midline, bubble WIDTH ends up coupled to
 * x-position: `by` is clamped to ≥170 and `bx` to ±400 of the frame, and
 * `SpeechBubble` has no per-bubble `maxWidth` lever below the component-level
 * one passed here. The consequence is that a bubble pushed toward a frame edge
 * shrinks rather than moving. **Avoid that framing**, or budget the kit fix
 * before staging one. Every scene in the cold open and act one is staged
 * around it.
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
      const side =
        override?.side ?? mark.side ?? (mark.x < WIDTH / 2 ? "right" : ("left" as const));
      const offset = override?.offset ?? mark.offset ?? 330;
      const bx = clamp(
        override?.x ?? mark.x + (side === "right" ? offset : -offset),
        400,
        WIDTH - 400,
      );
      const by = clamp(override?.y ?? bubbleOver(mark), 170, HEIGHT - 280);
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

// ---------------------------------------------------------------------------
// API 3 — the camera, the wide scenery layer, and the two new bodies
// ---------------------------------------------------------------------------

/**
 * How far past the frame this episode's scenery has to reach.
 *
 * Bigger than episode four's, because this one goes *down*: Scene 5's descent
 * slides a column of strata past the frame for several seconds, and Scene 8
 * rides the whole chamber upward. The box covers a 0.42× frame with room either
 * side, plus 1600px of travel above and below.
 */
export const WIDE = { x: -1400, y: -1600, w: 4720, h: 4280 } as const;

export const WideLayer = makeWideLayer(WIDE);

/** One of the seven, staged, bound to this episode's `WideLayer`. */
export const Shard = makeShard(WideLayer);

/** The mountain, bound to this episode's `WideLayer`. See `Volcano.tsx`. */
export const Volcano = makeVolcano(WideLayer);

// ---------------------------------------------------------------------------
// API 4 — the world
// ---------------------------------------------------------------------------

/**
 * **The coast**, and the one thing every wide in this episode has to agree
 * about.
 *
 * `horizon` is where the sea meets the sky. It is the line the volcano seats
 * on, so it is a *measured* fraction of every coastal plate (`PLATES`, and
 * `plateFit` in the act files) rather than a drawn one — and the volcano rule
 * ("on the measured horizon of every wide, from the first frame of Scene 1") is
 * what makes it load-bearing rather than decorative.
 *
 * `ground` is where a body kneeling on the beach puts its feet. It is 946 of
 * 1080 — the low-detail lower third STYLE asks every frame to owe its
 * characters.
 */
export const COAST = {
  /**
   * 470 of 1080 — a high horizon, and it is a seating decision rather than a
   * taste one. `coast_day` came off the model with its skyline at 0.404 of the
   * plate, and seating THAT on 560 needs a 1.85× upscale of a 1344-wide
   * painting (ep 4's worst was 1.81 and it was at the limit). At 470 the whole
   * set seats between 1.43× and 1.53×, which is where soft gouache still
   * holds up. It also buys the upper half of the frame for bubbles and for
   * Sunny, which this episode needs more than ep 4 did.
   */
  horizon: 470,
  ground: 946,
  /**
   * Where the drawn beach starts. **The painted sand is covered, not used** —
   * the ep-4 `NearField` mechanism, and for the same reason: the two coastal
   * plates put their waterline at wildly different depths (0.66 and 0.78 of
   * the plate), so a character standing on a fixed ground line is on sand in
   * one and in the sea in the other. The plate provides sky, sea and a
   * horizon; the band a character actually stands in is drawn on top of it and
   * tinted from that plate's own sampled sand, so the seam does not read.
   */
  sand: 680,
  /** The sandcastle. The silent builder-parallel runner lives here all show. */
  castle: { x: 972 },
  /** The kid, kneeling beside it, facing frame-left towards their own work. */
  kid: { x: 1354 },
} as const;

/**
 * **Where the volcano is** — the same island, in the same place, on the same
 * horizon, in every coastal wide of the series.
 *
 * Frame left, small, and unremarked on for four whole episodes. `1.15` is
 * episode three's number (a *sea* horizon rather than ep 4's land one), which
 * is the right one to inherit: this is an island out on open water, seen from a
 * beach, exactly as it was in the wind episode.
 */
export const VOLCANO_AT = { x: 336, scale: 1.15 } as const;

/**
 * **Where the volcano is when the episode is looking straight at him.**
 *
 * Scene 3's turn and Scene 4's title are the first time in five episodes the
 * camera has faced him, and Scene 9 is where he speaks. The framing is out on
 * the water looking back: a low horizon (`base`) and a mountain that fills the
 * middle of the frame at `VOLCANO_PORTRAIT`. Same body, same silhouette, same
 * units — only the number is bigger. See the continuity contract in
 * `Volcano.tsx`.
 */
export const VOLCANO_SEAT = { x: 960, base: 726, scale: VOLCANO_PORTRAIT } as const;

/**
 * **THE MOUTH-ANCHOR RULE — every volcano bubble, in every act, goes through
 * here.**
 *
 * A speech bubble's tail is the only thing on screen that says *which* body a
 * line came out of, and on a character whose face is 500 pixels across it also
 * says which part of the body. V1 and V2 were first staged with a hand-typed
 * anchor (`x: 470, y: 252`) and the tail landed on his **eye** — the first
 * words the scenery has ever spoken appeared to come out of his eyeball. This
 * helper exists so that cannot happen again to V3–V7.
 *
 * The rule, in three parts:
 *
 *   1. **The tail points at the MOUTH**, whose position comes from
 *      `volcanoFace()` — the same constants the component draws the mouth
 *      with, so it cannot drift from the picture. Never type a y.
 *   2. **The bubble clears the eyes and brows.** It sits entirely to the
 *      speaking side of the near eye (`eyeX[0] − eyeRx`), so nothing is
 *      occluded during the eyelid rise, which is the beat the wake is built
 *      on. `maxWidth` is capped for the same reason: an unclamped bubble grows
 *      rightwards into his face.
 *   3. **The tail tip is ~48px below the bubble's bottom edge** (measured off
 *      `SpeechBubble`'s `Tail`: a 78px svg pinned `bottom: −52`, tip at its
 *      local y = 74). The `y` this returns is therefore the mouth line minus
 *      that drop and minus half a two-line bubble — so a two-line line lands
 *      the tip on the mouth and a one-line line lands it a few pixels high,
 *      still aimed into the mouth.
 *
 * `Bubbles` clamps a tail to inside its own bubble, so the tip ends at the
 * bubble's inner right edge pointing at the mouth rather than reaching it. That
 * is the correct read — a tail is an arrow, not a straw.
 *
 * Usage, and this is the whole pattern an act should copy:
 *
 *   const vb = volcanoBubble({ ...VOLCANO_SEAT, awake: 1 });
 *   <Bubbles
 *     scene={scene}
 *     cast={{ volcano: vb.mark } as Cast}
 *     text={{ a2_02_volcano: "This is the loud part." }}
 *     at={{ a2_02_volcano: vb.at }}
 *     maxWidth={vb.maxWidth}
 *   />
 */
export function volcanoBubble(seat: {
  x: number;
  base: number;
  scale?: number;
  awake?: number;
  /** Which side of his face the bubble sits on. Default left. */
  side?: "left" | "right";
}): {
  mark: Mark;
  at: { x: number; y: number; tail: "left" | "right"; tailAt: number };
  maxWidth: number;
} {
  const face = volcanoFace(seat);
  const side = seat.side ?? "left";
  // Half the widest box this bubble is allowed to become: `maxWidth` of text
  // plus `SpeechBubble`'s own 44px padding and 7px border on each side.
  //
  // 520 rather than 440: at 440 "Do pardon the ash." broke over THREE lines and
  // the bubble came out taller than it was wide, which reads as a column of
  // words rather than as somebody talking. 520 gives two lines and still leaves
  // 24px of clearance from his eye, because `bx` below is derived from the eye
  // rather than typed.
  const maxWidth = 520;
  const half = maxWidth / 2 + 51;
  // Clear of the near eye by a whole eye-radius, on the side the bubble is on.
  const nearEye = side === "left" ? face.eyeX[0] - face.eyeRx : face.eyeX[1] + face.eyeRx;
  const bx = clamp(
    side === "left" ? nearEye - half - 24 : nearEye + half + 24,
    400,
    WIDTH - 400,
  );
  // `TAIL_DROP` is `SpeechBubble`'s tail tip below the bubble's bottom edge;
  // `TWO_LINE_HALF` is half a two-line bubble at the default 60px type.
  const TAIL_DROP = 48;
  const TWO_LINE_HALF = 103;
  const by = clamp(face.mouthY - TAIL_DROP - TWO_LINE_HALF, 170, HEIGHT - 280);
  return {
    mark: { x: bx, y: by, who: "ember", lift: 0, side, offset: 0 },
    at: {
      x: bx,
      y: by,
      tail: side === "left" ? "right" : "left",
      tailAt: face.mouthX,
    },
    maxWidth,
  };
}

/**
 * **Downstairs.** The world's basement, and the first time the series has been
 * underground.
 *
 * `floor` is the level surface of the molten pool the magma crowd waits on —
 * the ground line for every body in Scenes 5 to 8. `door` is the sealed vent in
 * the ceiling: it is UP, because the whole physics of the act is that warm
 * things rise, and a door in the wall would have made the rise a detour.
 */
export const CHAMBER = {
  floor: 902,
  ceiling: 232,
  /** The sealed vent. Ember inspects it, bounces off it, and eventually wins. */
  door: { x: 960, y: 268 },
} as const;

/**
 * **The painted plates.**
 *
 * One row per plate the cold open and act one stage against; derivation lives
 * at the bottom of `backgrounds.mjs`. What each number buys:
 *
 *   `skyline`  the sky→land row as a fraction of plate height, MEASURED. THE
 *              SEATING NUMBER: draw the plate so this row lands on the scene's
 *              seat line and the volcano stands on the painted horizon. `null`
 *              means the plate has no horizon in it (the two underground ones
 *              and the strata column), and it is the sanctioned way to be in
 *              this episode without a volcano in the shot.
 *   `scale`    plate width ÷ 1344 that seating requires.
 *   `near`     mean near-field colour (rows 78–94%), the ep-2 `PAINTED_GREEN`
 *              precedent: any drawn surface sharing an edge with the plate
 *              tints from this so the seam does not read.
 *
 * **Acts two and three add their own rows here** when they add plates. Keep
 * this table the single place the numbers live: an act that hard-codes a seat
 * is an act whose volcano moves the day a plate is re-rolled.
 */
export const PLATES: Record<
  string,
  { skyline: number | null; scale: number; near: string }
> = {
  // The two beaches. Their skylines are 0.08 of a plate apart, which is why
  // `plateFit` exists: seated, they put the sea on the same line and the two
  // shots are the same beach at two hours.
  coast_dawn: { skyline: 0.484, scale: 1.43, near: "#f2cd90" },
  coast_day: { skyline: 0.404, scale: 1.53, near: "#f5c85a" },
  // The two portraits. Both came off the model with the horizon a third of the
  // way up, within 0.016 of each other — the closest agreeing pair in the set.
  sea_horizon_dawn: { skyline: 0.677, scale: 1.45, near: "#2f6f86" },
  sea_horizon_day: { skyline: 0.693, scale: 1.48, near: "#45dbe0" },
  // No horizon: the sanctioned way to be in this episode without a volcano.
  strata_column: { skyline: null, scale: 1.43, near: "#a8281f" },
  magma_chamber: { skyline: null, scale: 1.43, near: "#e8622a" },
  magma_shaft: { skyline: null, scale: 1.43, near: "#d8763d" },
};

/** Every plate is generated at this size (`scripts/generate-backgrounds.mjs`). */
export const PLATE = { w: 1344, h: 768 } as const;

/**
 * A uniform 2% over-scale on top of the seat scale — ep 4's `PLATE_BLEED`, and
 * the same reason: a plate that lands its top edge a pixel below the top of
 * frame shows a one-pixel band of the backdrop gradient across the sky.
 */
export const PLATE_BLEED = 1.02;

/**
 * **Where a plate is drawn**, in composition px.
 *
 * The seating rule, and the only place in the episode that knows it: draw the
 * plate `scale × bleed` big and put its measured `skyline` row on `seat`.
 * Everything else — the volcano's feet, where a character stands — is already
 * keyed to that line, so the plate is the thing that moves.
 *
 * A plate with no skyline covers the frame and is centred; `offsetY` slides it,
 * which is what the descent in Scene 5 rides.
 */
export function plateFit(
  key: string,
  seat: number,
  offsetY = 0,
): { left: number; top: number; w: number; h: number } {
  const spec = PLATES[key] ?? { skyline: null, scale: 1.43, near: "#000000" };
  if (spec.skyline === null) {
    const cover = Math.max(WIDTH / PLATE.w, HEIGHT / PLATE.h) * PLATE_BLEED;
    const w = PLATE.w * cover;
    const h = PLATE.h * cover;
    return { left: (WIDTH - w) / 2, top: (HEIGHT - h) / 2 + offsetY, w, h };
  }
  const s = spec.scale * PLATE_BLEED;
  const w = PLATE.w * s;
  const h = PLATE.h * s;
  return { left: (WIDTH - w) / 2, top: seat - h * spec.skyline + offsetY, w, h };
}

/**
 * The plate itself.
 *
 * **The drift is horizontal only** (ep-4's finding, and it is not optional
 * here): a vertical drift moves the painted skyline, and the volcano standing
 * on it does not move with it. Five pixels on a 34-second cycle is under the
 * threshold of noticing and is what keeps the plate from reading as a slide the
 * show forgot to animate. `drift={0}` for a shot that has to be dead still.
 *
 * `Img` rather than `<img>`: Remotion blocks the frame until it has decoded, so
 * a render never emits a frame with a missing background.
 */
export const Plate: React.FC<{
  bg: string;
  seat?: number;
  phase?: number;
  drift?: number;
  /** Slides the whole plate. The descent and the rise ride this. */
  offsetY?: number;
  flip?: boolean;
  opacity?: number;
}> = ({ bg, seat = COAST.horizon, phase = 0, drift = 5, offsetY = 0, flip = false, opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fit = plateFit(bg, seat, offsetY);
  const dx = drift === 0 ? 0 : Math.sin((frame / fps) * ((2 * Math.PI) / 34) + phase) * drift;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, opacity }}>
      <Img
        src={staticFile(BACKGROUNDS[bg as keyof typeof BACKGROUNDS])}
        style={{
          position: "absolute",
          left: fit.left + dx,
          top: fit.top,
          width: fit.w,
          height: fit.h,
          display: "block",
          transform: flip ? "scaleX(-1)" : undefined,
        }}
      />
    </div>
  );
};

/**
 * **The episode's stacking order, and the bug it exists to make impossible.**
 *
 * A `WideLayer` is an absolutely-positioned `<svg>`; giving it a positive
 * `zIndex` puts it in CSS's *positive* paint layer, and everything a scene
 * staged as `children` renders at `z-index: auto`, which CSS paints
 * **underneath** all of them. Episode four shipped a whole cold open that way
 * (a kid and the hero buried in the grass band with their heads over the
 * horizon like periscopes) before it was found.
 *
 * The fix is that nothing in this world is allowed to be `auto`.
 */
export const Z = {
  plate: 0,
  /** The near ground, the sand, the molten floor. */
  ground: 1,
  /** The volcano, standing ON the horizon. */
  scenery: 2,
  /** Everything a scene stages. Always in front of the ground. */
  cast: 10,
  /** Word cards, bubbles, titles — outside the camera. */
  overlay: 60,
} as const;

/** Where a body's feet go on the beach, and where a bubble still has headroom. */
export const CAST_ZONE = { top: COAST.horizon + 40, bottom: HEIGHT - 60 } as const;

/**
 * **A coastal wide**: the painted plate, the sand on top of it, the volcano
 * standing on the painted horizon, and the cast in front.
 *
 * The plate is *inside* the camera — a wide that pushes in has to push in on
 * its own world, and the seat is a fraction of the plate rather than a screen
 * position, so a zoom keeps the volcano on the painted horizon for free. Every
 * camera in a coastal wide therefore stays at or above 1.0; a pull-out below
 * 1.0 would show past the plate's edge.
 */
export const CoastWorld: React.FC<{
  bg?: "coast_dawn" | "coast_day";
  phase?: number;
  cam?: Cam;
  drift?: number;
  /** The volcano's props, forwarded. He is in EVERY coastal wide. */
  volcano?: {
    awake?: number;
    smoke?: number;
    rim?: number;
    speaking?: boolean;
    look?: LookDirection;
    emotion?: Emotion;
    ashAt?: number;
    erupt?: number;
    breath?: number;
  };
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ bg = "coast_dawn", phase = 0, cam, drift, volcano, overlay, children }) => (
  <KidBackdrop variant="day" clouds={0}>
    <Camera cam={cam ?? { x: WIDTH / 2, y: HEIGHT / 2 }}>
      <Plate bg={bg} seat={COAST.horizon} phase={phase} drift={drift} />
      <Beach near={PLATES[bg].near} phase={phase} />
      <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery }}>
        <Volcano
          x={VOLCANO_AT.x}
          base={COAST.horizon}
          scale={VOLCANO_AT.scale}
          phase={PHASE.volcano}
          smoke={volcano?.smoke ?? 0}
          rim={volcano?.rim ?? 0}
          awake={volcano?.awake ?? 0}
          speaking={volcano?.speaking}
          look={volcano?.look}
          emotion={volcano?.emotion}
          ashAt={volcano?.ashAt}
          erupt={volcano?.erupt}
          breath={volcano?.breath}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>{children}</div>
    </Camera>
    {overlay ? (
      <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>{overlay}</AbsoluteFill>
    ) : null}
  </KidBackdrop>
);

/**
 * **The beach a character actually stands on**, drawn over the plate's own
 * painted sand.
 *
 * This is ep 4's `NearField` with the water added, and it exists for the same
 * reason: *where a painted shape and a character's ground line disagree, the
 * ground line wins* (STYLE). The two coastal plates put their waterline 12% of
 * a plate apart, and `COAST.ground` cannot move between two shots of one beach.
 *
 * Three things make the seam invisible rather than merely covered:
 *
 *   the FILL is `PLATES[key].near` — the plate's own sampled sand, the ep-2
 *   `PAINTED_GREEN` precedent, so the drawn band and the painted one are the
 *   same colour by construction;
 *   the EDGE is feathered over ~50px with three climbing ghost copies, because
 *   a hard line across 1920px shows up at any contrast;
 *   the WATERLINE is a soft curve with a slow surf highlight riding it, which
 *   is also the STYLE requirement that a plate is never dead still and that
 *   anything that rolls stays SVG.
 */
const Beach: React.FC<{ near: string; phase?: number }> = ({ near, phase = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase;
  const s = COAST.sand;
  const wet = mixHex(near, kidTheme.ink, 0.18);
  const foam = mixHex(near, kidTheme.paper, 0.72);
  // The waterline breathes very slowly — a few px over ~9s. Under the threshold
  // of noticing, and the difference between a beach and a cut-out of one.
  const tide = Math.sin(t * 0.7) * 5;
  const edge = (lift: number): string =>
    `M ${WIDE.x} ${WIDE.y + WIDE.h}` +
    ` L ${WIDE.x} ${(s - lift + tide).toFixed(1)}` +
    ` Q ${WIDTH * 0.26} ${(s - 34 - lift + tide).toFixed(1)} ${WIDTH * 0.58} ${(s - 12 - lift + tide).toFixed(1)}` +
    ` Q ${WIDTH * 0.86} ${(s + 6 - lift + tide).toFixed(1)} ${WIDE.x + WIDE.w} ${(s - 20 - lift + tide).toFixed(1)}` +
    ` L ${WIDE.x + WIDE.w} ${WIDE.y + WIDE.h} Z`;
  return (
    <>
      <WideLayer zIndex={Z.ground}>
        {/* Wet sand first — a darker band the dry sand sits in front of, so the
            beach has a near and a far rather than being one flat field. */}
        <path d={edge(-26)} fill={wet} opacity={0.85} />
        {/* The surf: one soft light stroke on the waterline, sliding. */}
        <path
          d={
            `M ${WIDE.x} ${(s - 24 + tide).toFixed(1)}` +
            ` Q ${WIDTH * 0.26} ${(s - 58 + tide).toFixed(1)} ${WIDTH * 0.58} ${(s - 36 + tide).toFixed(1)}` +
            ` Q ${WIDTH * 0.86} ${(s - 18 + tide).toFixed(1)} ${WIDE.x + WIDE.w} ${(s - 44 + tide).toFixed(1)}`
          }
          stroke={foam}
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
          opacity={0.55 + 0.15 * Math.sin(t * 0.9)}
        />
        {[42, 28, 14].map((lift, i) => (
          <path key={lift} d={edge(lift)} fill={near} opacity={0.24 + i * 0.18} />
        ))}
        <path d={edge(0)} fill={near} />
      </WideLayer>
      {/* The bottom of the frame belongs to the characters (STYLE, painted
          backgrounds): a soft darkening under them so a flat-filled body sits
          in a shadowed foreground rather than pasted onto a lit one. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: Z.ground,
          background: `linear-gradient(to top, ${rgba(wet, 0.36)} 0%, ${rgba(wet, 0.13)} 14%, transparent 34%)`,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

function rgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/**
 * **The portrait**: the framing the series has never used. Out on the water,
 * looking straight back at him, sky filling the top two thirds.
 *
 * Nothing else stands in this shot, ever. It is his.
 */
export const MountainWorld: React.FC<{
  bg?: "sea_horizon_dawn" | "sea_horizon_day";
  phase?: number;
  cam?: Cam;
  drift?: number;
  /** Overrides on the mountain. `x`, `base` and `scale` default to the seat. */
  volcano?: Partial<React.ComponentProps<typeof Volcano>>;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ bg = "sea_horizon_dawn", phase = 0, cam, drift = 3, volcano, overlay, children }) => (
  <KidBackdrop variant="day" clouds={0}>
    <Camera cam={cam ?? { x: WIDTH / 2, y: HEIGHT / 2 }}>
      <Plate bg={bg} seat={VOLCANO_SEAT.base} phase={phase} drift={drift} />
      <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery }}>
        <Volcano
          x={VOLCANO_SEAT.x}
          base={VOLCANO_SEAT.base}
          scale={VOLCANO_SEAT.scale}
          phase={PHASE.volcano}
          {...volcano}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>{children}</div>
    </Camera>
    {overlay ? (
      <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>{overlay}</AbsoluteFill>
    ) : null}
  </KidBackdrop>
);

/**
 * **Downstairs**: the magma chamber, and the shaft above it.
 *
 * No horizon, therefore no volcano — the sanctioned exemption from the volcano
 * rule (a shot with no horizon in it cannot see him), and the reason act one
 * can spend four scenes underground without breaking four episodes of
 * discipline. `MeadowWorld`'s `wide={false}` in ep 4 was the same licence.
 *
 * `offsetY` slides the plate, which is how the descent (Scene 5) and the rise
 * (Scene 8) are staged: the room moves past the frame rather than the camera
 * flying, because a camera move through a painted plate would show its edges.
 */
export const UnderWorld: React.FC<{
  bg?: "magma_chamber" | "magma_shaft" | "strata_column";
  phase?: number;
  cam?: Cam;
  offsetY?: number;
  /** The molten floor's glow, 0..1. */
  glow?: number;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ bg = "magma_chamber", phase = 0, cam, offsetY = 0, glow = 1, overlay, children }) => (
  <AbsoluteFill style={{ background: "#2b1119", fontFamily: kidTheme.fontFamily, lineHeight: "normal" }}>
    <Camera cam={cam ?? { x: WIDTH / 2, y: HEIGHT / 2 }}>
      <Plate bg={bg} phase={phase} drift={bg === "magma_chamber" ? 4 : 0} offsetY={offsetY} />
      {glow > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: Z.ground,
            background: `radial-gradient(ellipse 90% 46% at 50% 108%, rgba(255,150,40,${0.38 * glow}) 0%, rgba(255,110,20,${0.14 * glow}) 46%, transparent 78%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}
      <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>{children}</div>
    </Camera>
    {overlay ? (
      <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>{overlay}</AbsoluteFill>
    ) : null}
  </AbsoluteFill>
);

/** A soft dark ellipse behind a character who is hard to find. */
export const SoftShade: React.FC<{
  x: number;
  y: number;
  rx?: number;
  ry?: number;
  strength?: number;
  color?: string;
}> = ({ x, y, rx = 520, ry = 400, strength = 0.3, color = "22,48,72" }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse ${rx}px ${ry}px at ${x}px ${y}px, rgba(${color},${strength}) 0%, rgba(${color},${strength * 0.55}) 42%, transparent 74%)`,
      pointerEvents: "none",
    }}
  />
);

/** A soft vignette, for a scene that wants its edges pulled down. */
export const Vignette: React.FC<{ strength?: number; color?: string }> = ({
  strength = 0.4,
  color = "20,42,66",
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 76% 76% at 50% 50%, transparent 40%, rgba(${color},${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// The kid, and the sandcastle
// ---------------------------------------------------------------------------

/**
 * The kid, in silhouette. No face, ever, and not one word — **fifth canon
 * episode running**, sixth counting the drip-fork.
 *
 * ---------------------------------------------------------------------------
 * **THIS IS A COPY OF EPISODE FOUR'S BODY, AND IT IS THE PROMOTION THE EP-4
 * RETRO ASKED FOR.** That file's own comment says it: "a third episode that
 * needs a kid should promote a `KidSilhouette` that takes a pose table, with
 * these two poses in it." This is that third episode, it needs exactly the
 * kneeling pose ep 4 built, and the skeleton wave's brief forbids touching
 * `src/lib/`. So the code is copied forward byte-identically and **flagged at
 * handback**: `KidSilhouette` + `kidHands` + `kidPose` belong in
 * `src/lib/kid/characters/`, parameterised by a pose table, and the promotion
 * would delete this block and ep 4's identical one. Anyone doing it must run
 * the frame-grid pixel diff against a same-code control (PROCESS §7): the two
 * copies are byte-identical today, so a correct promotion is a zero-diff.
 * ---------------------------------------------------------------------------
 *
 * Drawn as flat ink at 0.92, no outline, no features. It is a shape a
 * six-year-old recognises as themselves, and any face at all would make it
 * somebody else.
 */
export type KidPlacement = {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  opacity?: number;
  /** Kneeling, 0..1. The cold open is 1 the whole way through. */
  kneel?: number;
  /** The breath, −1..1. Positive is the chest filling. */
  breath?: number;
  /** Both hands up in front, holding or patting something. 0..1. */
  hold?: number;
  /** The patch of shade they are kneeling in. On by default. */
  shadow?: boolean;
};

type KidPose = {
  hipY: number;
  shoulderY: number;
  headY: number;
  headR: number;
  waist: number;
  shoulder: number;
  hand: { x: number; y: number };
};

const KID_GROUND = 200;

function kidPose(kneel: number, breath: number, hold: number): KidPose {
  const k = Math.max(0, Math.min(1, kneel));
  const b = Math.max(-1, Math.min(1, breath));
  const h = Math.max(0, Math.min(1, hold));
  const lift = -26 * b;
  const chest = 20 * b;
  const hipY = 34 + k * 110;
  const shoulderY = -74 + k * 90 + lift;
  const headY = -134 + k * 98 + lift * 1.35;
  const rest = { x: 62, y: hipY + 22 };
  const held = { x: 46, y: headY - 4 };
  return {
    hipY,
    shoulderY,
    headY,
    headR: 46 - 4 * k,
    waist: 34,
    shoulder: 48 + chest,
    hand: { x: rest.x + (held.x - rest.x) * h, y: rest.y + (held.y - rest.y) * h },
  };
}

export const KidSilhouette: React.FC<KidPlacement> = ({
  x,
  y,
  scale = 1,
  flip = false,
  opacity = 0.92,
  kneel = 0,
  breath = 0,
  hold = 0,
  shadow = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sway = Math.sin(t * 0.7) * 1.1;
  const k = Math.max(0, Math.min(1, kneel));
  const pose = kidPose(kneel, breath, hold);
  const { hipY, shoulderY, headY, headR, waist, shoulder, hand } = pose;
  const knee = 24 + k * 40;
  const legMid = hipY + (KID_GROUND - hipY) * 0.52;
  return (
    <>
      {shadow ? (
        <KidContactShadow
          x={x}
          y={y + CHAR_BOX.kid / 2 - 6}
          rx={(58 + 76 * k) * scale}
          ry={24 * scale}
          strength={0.3}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 300,
          height: CHAR_BOX.kid,
          marginLeft: -150,
          marginTop: -CHAR_BOX.kid / 2,
          transformOrigin: "50% 100%",
          transform: `scale(${scale}) ${flip ? "scaleX(-1)" : ""}`,
          opacity,
          pointerEvents: "none",
        }}
      >
        <svg width={300} height={CHAR_BOX.kid} viewBox="-150 -210 300 420" overflow="visible">
          <g transform={`rotate(${sway.toFixed(2)} 0 ${KID_GROUND})`} fill={kidTheme.ink}>
            {([-1, 1] as const).map((s) => (
              <path
                key={`leg${s}`}
                d={
                  `M 0 ${hipY.toFixed(1)}` +
                  ` Q ${(s * (12 + knee * 0.6)).toFixed(1)} ${legMid.toFixed(1)}` +
                  ` ${(s * knee).toFixed(1)} ${KID_GROUND}`
                }
                stroke={kidTheme.ink}
                strokeWidth={30 + 12 * k}
                strokeLinecap="round"
                fill="none"
              />
            ))}
            <path
              d={
                `M ${-waist} ${(hipY + 22).toFixed(1)}` +
                ` C ${-waist - 6} ${(shoulderY + 46).toFixed(1)} ${-shoulder} ${(shoulderY + 30).toFixed(1)} ${-shoulder} ${shoulderY.toFixed(1)}` +
                ` Q ${-shoulder} ${(shoulderY - 18).toFixed(1)} ${(-shoulder * 0.42).toFixed(1)} ${(shoulderY - 22).toFixed(1)}` +
                ` Q 0 ${(shoulderY - 26).toFixed(1)} ${(shoulder * 0.42).toFixed(1)} ${(shoulderY - 22).toFixed(1)}` +
                ` Q ${shoulder} ${(shoulderY - 18).toFixed(1)} ${shoulder} ${shoulderY.toFixed(1)}` +
                ` C ${shoulder} ${(shoulderY + 30).toFixed(1)} ${waist + 6} ${(shoulderY + 46).toFixed(1)} ${waist} ${(hipY + 22).toFixed(1)}` +
                ` Z`
              }
            />
            <path
              d={`M 0 ${(shoulderY - 8).toFixed(1)} L 0 ${(headY + headR * 0.7).toFixed(1)}`}
              stroke={kidTheme.ink}
              strokeWidth={40}
              strokeLinecap="round"
              fill="none"
            />
            {([-1, 1] as const).map((s) => (
              <path
                key={`arm${s}`}
                d={
                  `M ${(s * (shoulder - 8)).toFixed(1)} ${(shoulderY + 14).toFixed(1)}` +
                  ` Q ${(s > 0 ? shoulder + 34 : -shoulder * 0.34).toFixed(1)} ${(shoulderY + 62).toFixed(1)}` +
                  ` ${(hand.x + s * 13).toFixed(1)} ${(hand.y + 12 + s * 7).toFixed(1)}`
                }
                stroke={kidTheme.ink}
                strokeWidth={26}
                strokeLinecap="round"
                fill="none"
              />
            ))}
            <circle cx={0} cy={headY} r={headR} />
            <path
              d={`M ${(-headR - 2).toFixed(1)} ${(headY - 22).toFixed(1)} q 22 -28 50 -19 q 26 8 34 25`}
              stroke={kidTheme.ink}
              strokeWidth={22}
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </svg>
      </div>
    </>
  );
};

/** Where the kid's hands are, in composition coordinates. */
export function kidHands(place: KidPlacement): { x: number; y: number } {
  const scale = place.scale ?? 1;
  const { hand } = kidPose(place.kneel ?? 0, place.breath ?? 0, place.hold ?? 0);
  const bottom = place.y + CHAR_BOX.kid / 2;
  const flip = place.flip ? -1 : 1;
  return { x: place.x + hand.x * scale * flip, y: bottom - (210 - hand.y) * scale };
}

/**
 * **THE SANDCASTLE — the silent builder-parallel runner.**
 *
 * Planted in Scene 1 ("Remember the sandcastle. It is doing something
 * important"), knocked in Scene 2, patted back together, present at the frame
 * edge through the recap, and cashed in Scene 29: sand is ground-up mountain,
 * so the kid and the volcano have been in the same business all day. Zero
 * lines, zero cost, and it is the episode's cheapest big beat.
 *
 * It is SVG rather than paint for all three of STYLE's reasons at once: it
 * moves (the wobble), it is touched (the pat), and it lines up with a
 * character's hands.
 *
 * `built` is 0..1 — how much of it exists. `wobble` is the knock, in px of
 * shake, and `slump` is how far the left turret has sagged before the kid pats
 * it back. Every act after this one only ever needs `built={1}`.
 */
export const Sandcastle: React.FC<{
  x: number;
  y: number;
  scale?: number;
  built?: number;
  wobble?: number;
  slump?: number;
  /** The plate's sampled sand, so the castle belongs to the beach it is on. */
  sand?: string;
}> = ({ x, y, scale = 1, built = 1, wobble = 0, slump = 0, sand = "#e8cfae" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // 9px, not 3. "The sandcastle wobbles" has to be visible on a single frame
  // for a six-year-old to connect it to the sound, and three pixels on a
  // 500px prop is a shiver only the person who wrote it can see.
  const shake = wobble * Math.sin(t * 26) * 9;
  // **It is not the plate's sand, it is the plate's sand PACKED.** The first
  // pass filled it with `PLATES[key].near` exactly and the castle vanished into
  // the beach it was standing on — same hue, same value, no silhouette. Wet
  // packed sand is a shade deeper and a shade browner than dry, which is both
  // true and the fix.
  const body = mixHex(sand, kidTheme.earth, 0.2);
  const light = mixHex(body, kidTheme.paper, 0.4);
  const dark = mixHex(body, kidTheme.ink, 0.46);
  const b = Math.max(0, Math.min(1, built));
  // Three towers and a curtain wall. **Flat tops with crenellations, not cone
  // roofs**: a bucket makes a cylinder, a six-year-old cuts the battlements
  // with a finger, and the first pass's dark cones read as three little sheds
  // at the size this thing is actually staged. Heights are unequal on purpose —
  // three equal towers read as a chess set.
  const towers = [
    { dx: -128, h: 150, w: 50 },
    { dx: 0, h: 208, w: 58 },
    { dx: 128, h: 136, w: 46 },
  ];
  const flag = Math.sin(t * 2.4) * 6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 520,
        height: 380,
        marginLeft: -260,
        marginTop: -330,
        transform: `translateX(${shake.toFixed(2)}px) scale(${scale})`,
        transformOrigin: "50% 100%",
        pointerEvents: "none",
      }}
    >
      <svg width={520} height={380} viewBox="-260 -320 520 380" overflow="visible">
        <ellipse cx={0} cy={52} rx={214} ry={24} fill={kidTheme.ink} opacity={0.16} />
        {/* The moat: one scratched arc in the sand in front of it. */}
        <path
          d="M -220 30 Q 0 86 220 30"
          stroke={dark}
          strokeWidth={11}
          strokeLinecap="round"
          fill="none"
          opacity={0.4 * b}
        />
        {/* The curtain wall, behind the towers so they stand ON it. */}
        <path
          d={`M -178 46 L -178 ${(-30 * b).toFixed(1)} L 178 ${(-30 * b).toFixed(1)} L 178 46 Z`}
          fill={body}
          stroke={dark}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <path
          d={`M -178 46 L -178 ${(-30 * b).toFixed(1)} L -108 ${(-30 * b).toFixed(1)} L -108 46 Z`}
          fill={light}
          opacity={0.55}
        />
        {b > 0.4
          ? [-146, -88, -30, 30, 88, 146].map((cx) => (
              <rect
                key={cx}
                x={cx - 17}
                y={-30 * b - 24}
                width={34}
                height={26}
                rx={4}
                fill={body}
                stroke={dark}
                strokeWidth={6}
              />
            ))
          : null}
        {towers.map((tw, i) => {
          const h = tw.h * b - (i === 0 ? slump * 54 : 0);
          const tilt = i === 0 ? slump * 8 : 0;
          const top = 46 - h;
          return (
            <g key={tw.dx} transform={`rotate(${tilt.toFixed(2)} ${tw.dx} 46)`}>
              {/* A slightly tapered drum: a bucket turned out, not a cone. */}
              <path
                d={
                  `M ${tw.dx - tw.w} 46` +
                  ` L ${(tw.dx - tw.w * 0.86).toFixed(1)} ${top.toFixed(1)}` +
                  ` L ${(tw.dx + tw.w * 0.86).toFixed(1)} ${top.toFixed(1)}` +
                  ` L ${tw.dx + tw.w} 46 Z`
                }
                fill={body}
                stroke={dark}
                strokeWidth={7}
                strokeLinejoin="round"
              />
              {/* A lit face on every tower, kept flat — no gradients anywhere in
                  this show, and a sandcastle is exactly where a lazy one would
                  go. */}
              <path
                d={
                  `M ${tw.dx - tw.w} 46` +
                  ` L ${(tw.dx - tw.w * 0.86).toFixed(1)} ${top.toFixed(1)}` +
                  ` L ${(tw.dx - tw.w * 0.22).toFixed(1)} ${top.toFixed(1)}` +
                  ` L ${(tw.dx - tw.w * 0.28).toFixed(1)} 46 Z`
                }
                fill={light}
                opacity={0.62}
              />
              {/* Crenellations: three blocks across each tower top. */}
              {b > 0.55
                ? [-1, 0, 1].map((s) => (
                    <rect
                      key={s}
                      x={tw.dx + s * tw.w * 0.56 - tw.w * 0.24}
                      y={top - tw.w * 0.42}
                      width={tw.w * 0.48}
                      height={tw.w * 0.46}
                      rx={3}
                      fill={body}
                      stroke={dark}
                      strokeWidth={6}
                    />
                  ))
                : null}
              {/* One flag, on the tall tower only. It is the castle's whole
                  silhouette read at a distance, and it is the only part of this
                  prop that moves on its own — which is exactly the licence for
                  it being drawn rather than painted. */}
              {i === 1 && b > 0.8 ? (
                <g>
                  <path
                    d={`M ${tw.dx} ${(top - tw.w * 0.42).toFixed(1)} L ${tw.dx} ${(top - tw.w * 0.42 - 62).toFixed(1)}`}
                    stroke={dark}
                    strokeWidth={6}
                    strokeLinecap="round"
                  />
                  <path
                    d={
                      `M ${tw.dx + 3} ${(top - tw.w * 0.42 - 60).toFixed(1)}` +
                      ` Q ${(tw.dx + 34 + flag).toFixed(1)} ${(top - tw.w * 0.42 - 50).toFixed(1)}` +
                      ` ${(tw.dx + 56).toFixed(1)} ${(top - tw.w * 0.42 - 40).toFixed(1)}` +
                      ` L ${tw.dx + 3} ${(top - tw.w * 0.42 - 26).toFixed(1)} Z`
                    }
                    fill={kidTheme.tomato}
                    stroke={dark}
                    strokeWidth={5}
                    strokeLinejoin="round"
                  />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Placeholder scenes (everything the act waves have not staged yet)
// ---------------------------------------------------------------------------

/**
 * Pip's stand-in, and it is deliberately NOT a dandelion seed.
 *
 * Her ep-4 body lives in `src/videos/plants/scenes/Pip.tsx` — a per-video file
 * this episode may not import (another episode's file changing under us is
 * exactly the coupling the ownership rule exists to prevent) and may not
 * promote this wave. So her one scene (24, the grading) gets a neutral blob
 * here, and the act-3 agent's first job on that scene is to decide between
 * promoting `Pip` to `src/lib/kid/characters/` (the right answer, and the ep-4
 * retro already leans that way) or drawing a cameo-scale one.
 *
 * **Flagged at handback.** A placeholder that drew a *wrong* Pip would be worse
 * than one that visibly is not her.
 */
const PIP_STANDIN = { color: "#f3ddb0", edge: "#b08a44" } as const;

const PLACEHOLDER_MARKS: Record<Exclude<Speaker, "narrator" | "volcano">, Mark> = {
  ember: { x: 780, y: stand("ember", CHAMBER.floor), scale: 0.86, who: "ember" },
  sunny: { x: 1580, y: hover("sunny", 258, 1.1), scale: 1.1, who: "sunny", side: "left" },
  rock: { x: 1310, y: stand("rock", COAST.ground), scale: 0.8, who: "rock", side: "left" },
  drip: { x: 520, y: stand("drip", COAST.ground), scale: 0.72, who: "drip" },
  puff: { x: 700, y: hover("puff", 420, 0.9), scale: 0.9, who: "puff" },
  pip: { x: 1080, y: stand("pip", COAST.ground), scale: 0.9, who: "pip", side: "left" },
  blue: { x: 460, y: hover("shard", 400, 0.7), scale: 0.7, who: "shard" },
};

/**
 * The scene's number, off its id.
 *
 * **String comparison is the wrong tool and it is wrong in a way that hides**:
 * `"s09_first_line" > "s09"` is true (a longer string with the same prefix
 * sorts after it), so an id-vs-prefix test puts Scene 9 on the wrong side of
 * its own boundary. Parse the two digits.
 */
function sceneNumber(id: string): number {
  const n = Number(id.slice(1, 3));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Stand-in for a scene nobody has staged yet: the real dialogue, in the real
 * voices, with the real timing, and every character on stage mouthing their own
 * lines — just no direction. Drop the finished scene into its act's map and the
 * timeline does not move by a frame.
 *
 * **It draws the volcano**, because in this episode that is not decoration: he
 * is on the horizon of every coastal wide from the first frame of Scene 1, he
 * is the only character who can be in a placeholder and be RIGHT, and a
 * placeholder on a bare gradient would make the one rule the episode is built
 * on invisible for two thirds of the run. Where a scene has a volcano line, the
 * placeholder wakes him and lets him mouth it.
 */
export const ScenePlaceholder: React.FC<{ scene: TimedScene; title?: string }> = ({
  scene,
  title,
}) => {
  const stage = useStage(scene);
  const lineKey = useLineKey(scene);
  const cast = Array.from(
    new Set(
      (scene.turns ?? [])
        .map((t) => t.speaker as Speaker)
        .filter((s): s is Exclude<Speaker, "narrator" | "volcano"> =>
          s !== "narrator" && s !== "volcano",
        ),
    ),
  );
  const marks: Cast = Object.fromEntries(cast.map((s) => [s, PLACEHOLDER_MARKS[s]]));
  const hasVolcano = (scene.turns ?? []).some((t) => t.speaker === "volcano");
  const n = sceneNumber(scene.id);
  // **HE IS AWAKE FROM SCENE 9 ON, AND STAYS AWAKE INTO EPISODE SIX.** A
  // placeholder that draws him asleep in act three is not a missing scene, it
  // is a wrong one: the whole episode turns on his eyes being open.
  const awakeHere = hasVolcano || n > 9 ? 1 : 0;
  // Downstairs is act one's world and nothing else's; every unstaged scene from
  // act two on is above ground, where the volcano lives.
  const under = n >= 5 && n <= 8;
  const banner = (
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
  );
  const bodies = (
    <>
      {cast.includes("ember") ? <PlaceholderEmber scene={scene} cast={marks} /> : null}
      {cast.includes("sunny") ? <PlaceholderSunny scene={scene} cast={marks} /> : null}
      {cast.includes("rock") ? <PlaceholderRock scene={scene} /> : null}
      {cast.includes("drip") ? <PlaceholderDrip scene={scene} cast={marks} /> : null}
      {cast.includes("puff") ? <PlaceholderPuff scene={scene} cast={marks} /> : null}
      {cast.includes("pip") ? <PlaceholderPip scene={scene} /> : null}
      {cast.includes("blue") ? <PlaceholderBlue scene={scene} /> : null}
    </>
  );
  if (under) {
    return (
      <UnderWorld phase={(scene.from % 900) / 300} overlay={banner}>
        {bodies}
      </UnderWorld>
    );
  }
  return (
    <CoastWorld
      bg="coast_day"
      phase={(scene.from % 900) / 300}
      volcano={{
        smoke: 0.55,
        awake: awakeHere,
        speaking: stage.speaking("volcano"),
      }}
      overlay={banner}
    >
      {bodies}
    </CoastWorld>
  );
};

const PlaceholderEmber: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Ember
    x={PLACEHOLDER_MARKS.ember.x}
    y={PLACEHOLDER_MARKS.ember.y}
    scale={PLACEHOLDER_MARKS.ember.scale}
    phase={PHASE.ember}
    emotion="excited"
    speaking={useSpeaking(scene, "ember")}
    look={useLookAtSpeaker(scene, cast, "ember")}
  />
);

const PlaceholderSunny: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Sunny
    x={PLACEHOLDER_MARKS.sunny.x}
    y={PLACEHOLDER_MARKS.sunny.y}
    scale={1.1}
    phase={PHASE.sunny}
    emotion="proud"
    speaking={useSpeaking(scene, "sunny")}
    look={useLookAtSpeaker(scene, cast, "sunny")}
  />
);

/** Rock does not look at anybody. Four episodes of that is who he is. */
const PlaceholderRock: React.FC<{ scene: TimedScene }> = ({ scene }) => (
  <Rock
    x={PLACEHOLDER_MARKS.rock.x}
    y={PLACEHOLDER_MARKS.rock.y}
    scale={0.8}
    phase={PHASE.rock}
    speaking={useSpeaking(scene, "rock")}
  />
);

const PlaceholderDrip: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Drip
    x={PLACEHOLDER_MARKS.drip.x}
    y={PLACEHOLDER_MARKS.drip.y}
    scale={0.72}
    phase={PHASE.drip}
    emotion="happy"
    speaking={useSpeaking(scene, "drip")}
    look={useLookAtSpeaker(scene, cast, "drip")}
  />
);

const PlaceholderPuff: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Puff
    x={PLACEHOLDER_MARKS.puff.x}
    y={PLACEHOLDER_MARKS.puff.y}
    scale={0.9}
    opacity={0.6}
    phase={PHASE.puff}
    emotion="happy"
    speaking={useSpeaking(scene, "puff")}
    look={useLookAtSpeaker(scene, cast, "puff")}
  />
);

/** See `PIP_STANDIN`. Not Pip — visibly not Pip, on purpose. */
const PlaceholderPip: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = PLACEHOLDER_MARKS.pip;
  const talking = useSpeaking(scene, "pip");
  return (
    <WideLayer>
      <Blobby
        x={m.x}
        y={midOf("pip", m.y, m.scale)}
        scale={(m.scale ?? 1) * 1.4}
        phase={PHASE.pip}
        color={PIP_STANDIN.color}
        edge={PIP_STANDIN.edge}
        mood={talking && Math.sin((frame / fps) * 26) > 0 ? "surprised" : "calm"}
      />
    </WideLayer>
  );
};

/** Blue keeps his ricochet even in a placeholder — it is who he is. */
const PlaceholderBlue: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const box: Box = { x: 360, y: 280, w: 520, h: 250 };
  const p = blueRicochet(frame, box, 4);
  return (
    <Shard
      who="blue"
      x={p.x}
      y={p.y}
      scale={0.7}
      heading={p.angle}
      trail={blueTrail(frame, box, 4)}
      speaking={useSpeaking(scene, "blue")}
      look="camera"
    />
  );
};

// Re-exported so a scene file needs one import for the whole kit.
export {
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  Img,
  isSpeaking,
  useSpeaking,
  KidContactShadow,
  Face,
  useRig,
};
export { Ember, GlowDrop, EMBER_COLOR, EMBER_BOX } from "./Ember";
export { VOLCANO_PORTRAIT, volcanoFace } from "./Volcano";
export {
  BigWordBeat,
  Blobby,
  BlobbyCrowd,
  CutFlash,
  Drip,
  KidBackdrop,
  Puff,
  Rock,
  SpeechBubble,
  Sunny,
  VOLCANO_BODY,
  VOLCANO_SHAPE,
  WordCard,
  emotionAt,
  heldBeat,
  kidEase,
  kidInkOutline,
  kidOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  lineKeyOf,
  lineProgress,
  lineWindow,
  lookAt,
  mixHex,
  moveAlong,
  project,
  settleWave,
  turnFor,
  violetVibrate,
} from "../../../lib/kid";
export { Camera, blueRicochet, blueTrail, shardOf, kidEase as ease };
export type { Box };
export type { Cam, Emotion, EmotionInput, LookDirection, ShardName, SpectrumColor };
export type { TimedScene };
