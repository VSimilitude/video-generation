import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Camera,
  Cloudia,
  Drip,
  Face,
  KidBackdrop,
  KidContactShadow,
  Puff,
  Ray,
  RayShard,
  SpeechBubble,
  Sunny,
  EMOTION_EASE,
  RAY_BOX,
  RAY_SHARD_BOX,
  SNORE_RING_WARM,
  SPECTRUM,
  blueRicochet,
  blueTrail,
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
import { NARRATION } from "../narrationManifest";
import { PIP_BOX, Pip, pipCrownLocal, pipFaceLocal, type PipState } from "./Pip";

// Shared kit for "Pip and the Sunshine Kitchen" — Little Big World, episode
// four.
//
// Same shape as episode three's, and deliberately thinner: everything the two
// previous episodes wrote identically now lives in `src/lib/kid/`, including —
// as of this episode — the seven colours' cast table and laws of motion
// (`shards.tsx`) and the sleeping volcano (`props.tsx`). What is left here is
// only what is genuinely this episode's:
//
//   the cast    `Speaker`/`Stage`, `PHASE`, `CHAR_BOX`, and the one new body
//   the hero    Pip's geometry, which the kit's static `faceOffset` cannot
//               express because her face is 250 units higher at the end of the
//               episode than at the start (see `PIP_STATE_AT` and `centreOf`)
//   the timing  `turnsOf`, bound to *this* video's narration manifest
//   the world   `MEADOW` — the horizon, the volcano's place on it, and the
//               drawn stand-in for the plates batch B2 has not painted yet
//
// **The staging API is episodes two and three's**: `useStage` +
// `SpeakerVisual`, so a narrator line can be given a body without re-plumbing
// four hooks. This episode has no narrator-voiced cameos either — the kid and
// Violet are silent and stay silent — and it is threaded through anyway.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/**
 * **Every voice in the show.** `narrator` is off-stage: no body, no bubble.
 *
 * Eight voices, which is the biggest cast the series has had, and seven of
 * them are returning. `pip` is the only new one — MiniMax `Inspirational_girl`
 * (decision log, cast 2026-08-08 by audition; Mike's ear pending).
 *
 * **There is no `violet`, and there is never going to be one.** Same rule as
 * episode three's, and it travels with him: he works harder than anybody on
 * screen, is never once looked at, and the joke survives only while he is the
 * one who never speaks. He is a `VisualSpeaker`; `speakerOf` throws if a line
 * key ever claims otherwise.
 */
export type Speaker =
  | "narrator"
  | "pip"
  | "sunny"
  | "ray"
  | "drip"
  | "puff"
  | "blue"
  | "cloudia";

/**
 * Bodies that appear on screen without a voice of their own.
 *
 * `kid` never speaks, in any episode, and is five episodes into not doing it —
 * this one opens and closes on the silhouette. `violet` gets one silent
 * garnish firing at the frame edge of Scene 8 and is greeted by nobody. The
 * volcano is scenery rather than a body: it has no `Mark`, nothing looks at
 * it, and it lives in `MeadowWorld` below.
 */
export type VisualSpeaker = "kid" | "violet";

/** Anything that can be staged, whether or not it owns a voice. */
export type Stage = Speaker | VisualSpeaker;

/**
 * Per-character cycle offset. Breathing, blinking, mouth timing and Pip's
 * fluff all key off it, so two characters sharing one bob in lockstep — always
 * pass these.
 *
 * The returning cast keep the phases they had in the episodes they came from,
 * which costs nothing and means a shot with Drip and Puff in it does not
 * suddenly breathe differently from the shot in episode two it is quoting.
 * Blue and Violet read theirs out of the promoted `SHARD_PHASE` table via
 * `shardOf`, so the same number answers "which phase does Blue have" whether a
 * scene reached him as a speaker or as one of the seven.
 */
export const PHASE: Record<Stage, number> = {
  narrator: 0,
  pip: 5.1,
  sunny: 3.4,
  ray: 0,
  drip: 2.6,
  puff: 1.4,
  cloudia: 4.7,
  kid: 7.4,
  blue: shardOf("blue").phase,
  violet: shardOf("violet").phase,
};

/**
 * The three ingredients, as colours. The order board in Scene 6 posts them,
 * the inventory in Scene 17 ticks them off, and the recap gives each of them a
 * panel — three places that have to agree, so they are one table.
 *
 * Light is Sunny's gold rather than Ray's white: the whole episode is about
 * who the light actually belongs to, and the answer is on the order board from
 * the first time it is posted.
 */
export const INGREDIENT = {
  light: kidTheme.sun,
  water: kidTheme.water,
  air: kidTheme.airCool,
} as const;

// ---------------------------------------------------------------------------
// API 1 — building a scene's turns from script.md's line keys
// ---------------------------------------------------------------------------

/**
 * Every tail a line key is allowed to end in. Kept as a set rather than a
 * chain of `===` so that adding a voice is one line in `Speaker` and one entry
 * here, and so the ordering of the two can never disagree.
 */
const VOICES = new Set<string>([
  "pip",
  "sunny",
  "ray",
  "drip",
  "puff",
  "blue",
  "cloudia",
]);

/**
 * `a1_08_pip` -> `pip`, `a2_04_cloudia` -> `cloudia`. The key convention *is*
 * the cast list, which is why a character line that resolved to `narrator` was
 * invisible rather than an error for a whole wave of episode three.
 *
 * A key ending in `_violet` throws rather than falling through to `narrator`.
 * That is not defensive programming, it is the series rule with teeth on it.
 */
export function speakerOf(lineKey: string): Speaker {
  const tail = lineKey.split("_").slice(2).join("_");
  if (tail === "violet") {
    throw new Error(
      `[plants] "${lineKey}": Violet never speaks. He is the one of the seven ` +
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
 * silent twice as long as intended. Five of this episode's forty-four held
 * beats *are* trailing (Scenes 16, 22, 24, 26 and, in the middle of its
 * scene, 29), and those pass an explicit number.
 */
export function turnsOf(
  keys: string[],
  opts?: { gap?: number; gaps?: Record<string, number> },
): DialogueTurn[] {
  return keys.map((key, i) => {
    const clip = NARRATION[key];
    if (!clip) throw new Error(`[plants] no narration clip for "${key}"`);
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
 */
export const CHAR_BOX = {
  pip: PIP_BOX,
  ray: RAY_BOX,
  shard: RAY_SHARD_BOX,
  sunny: 460,
  drip: 380,
  puff: 340,
  cloudia: 380,
  kid: 420,
} as const;
export type Body = keyof typeof CHAR_BOX;

/**
 * Where a body stands.
 *
 * This episode adds one field to the kit's `Mark`: **`state`**, which is which
 * growth state Pip is in. It is on the mark rather than only on the component
 * because the two things every other character derives from its box — where
 * its face is, and where its crown is — are functions of that state for her,
 * and both of them are read by helpers (`centreOf`, `bubbleOver`) that only
 * ever see the mark.
 */
export type Mark = KitMark<Body> & {
  /** Pip only. Which capability she has unlocked in this shot. */
  state?: PipState;
  /** Pip only. 0..1 through the transition into `state`. */
  morph?: number;
};

/**
 * **Where each body's face is, measured off its component.**
 *
 * In the body's own natural units, negative up, from the centre of its box.
 * `markCentre` aims at it, so it is what every `look` in the episode aims at.
 *
 * Ray is candidate F2 and the centre of his box is the *gap* between his
 * floating face and his wave ribbon, so a character looking at "Ray" looks at
 * the hole in the middle of him. −68 is the measured face position at
 * `RAY_LIGHT.afterRainbow`, carried over from episode three unchanged.
 *
 * **Pip's entry is a lie that is true most of the time, on purpose.** Her face
 * climbs 250 units across the episode, and `faceOffset` is one static number
 * per body; the value here is her `planted` face, which is where she is for
 * the cold open and the whole of Acts One and Two — sixteen of twenty-nine
 * scenes. Anything staged after Scene 14 aims through `centreOf` below, which
 * takes the state into account. A scene that stages a grown Pip and lets a
 * listener aim at `markCentre` will aim at her stem.
 */
const FACE_OFFSET = {
  ray: -68,
  shard: -77,
  pip: pipFaceLocal("planted"),
} as const;

/**
 * The staging arithmetic, bound to this episode's cast: `stand`, `hover`,
 * `crownOf`, `midOf`, `faceOf`, `bubbleAbove`, `markCentre`, `projectMark`.
 *
 * Pip is the default body for a mark that does not name one — she is in
 * twenty-four of the twenty-nine scenes and she is in the middle of all of
 * them — and a bubble sits 165px above the crown.
 */
const geometry = makeBodyGeometry({
  box: CHAR_BOX,
  body: "pip",
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

/**
 * **The point another character should look at** — `markCentre`, corrected for
 * Pip's growth.
 *
 * Everything in this episode that aims at somebody goes through here rather
 * than through `markCentre` directly. For every body except Pip the two are
 * the same function; for her, the box says nothing about where her face is and
 * this is the only honest answer.
 */
export function centreOf(m: Mark): { x: number; y: number } {
  if ((m.who ?? "pip") !== "pip") return markCentre(m);
  const scale = m.scale ?? 1;
  return { x: m.x, y: midOf("pip", m.y, scale) + pipFaceLocal(m.state ?? "planted", m.morph ?? 1) * scale };
}

/**
 * **Bubble centre for a mark** — `bubbleAbove`, corrected for Pip's growth.
 *
 * Her crown is the top of her *parachute* when she is a seed and the top of
 * her tallest leaf when she is a young plant, and the box knows about neither.
 * A `lift` on the mark still wins, exactly as it does in the kit.
 */
export function bubbleOver(m: Mark): number {
  if (m.lift !== undefined) return m.y - m.lift;
  if ((m.who ?? "pip") !== "pip") return bubbleAbove(m);
  const scale = m.scale ?? 1;
  return (
    midOf("pip", m.y, scale) +
    pipCrownLocal(m.state ?? "planted", m.morph ?? 1) * scale -
    165
  );
}

export type Cast = Partial<Record<Stage, Mark>>;

// ---------------------------------------------------------------------------
// API 2b — the cameo bodies (`speakerVisual`)
// ---------------------------------------------------------------------------

/**
 * Per-line override: "this NARRATOR turn comes out of *that* body's mouth".
 *
 *   const SPEAKER_VISUAL: SpeakerVisual = { co_01_narrator: "kid" };
 *
 * Everything staged reads through it. A key with no entry keeps its voiced
 * speaker, so a scene only lists its cameos. Unused in this episode — the kid
 * is silent, Violet is silent — and kept anyway, because an act that gains a
 * cameo tomorrow should not have to re-plumb four hooks to get it.
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
 * One hook per scene, and the way to drive mouths.
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
 * Per-line emotion for one body: `{ "a1_08_pip": "skeptical" }`.
 *
 * The emotion lands `lead` frames *before* the line starts and holds until
 * that body's next mapped line. Returns an `EmotionCue`, so the face *morphs*
 * rather than cutting.
 *
 * **`lead` is `NO_LEAD` on every held-beat scene in this episode**, and
 * script.md makes that a rule rather than a note: "No emotion lead on
 * held-beat scenes — the staging kit's default 8-frame `useEmotion` lead leaks
 * punchlines into the silence in front of them; cut it to 0 wherever a HELD
 * BEAT direction appears." Forty-four of this episode's beats say so, which is
 * most of its scenes.
 *
 * Never map a line to `scared`: the rig's wobble-mouth hard-cuts to a talking
 * mouth on the first frame of a line. Put `scared` in the gap between two
 * lines instead (`emotionAt`).
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

/** The emotion lead a held-beat scene uses. Zero. See `useEmotion`. */
export const NO_LEAD = 0;

/**
 * A listener's eyes. Whoever is talking gets looked at; nobody talking (or the
 * Narrator talking with no body on stage) falls back to `fallback`.
 *
 * Aimed through `centreOf`, so a character listening to a grown Pip looks at
 * her face rather than at her stem.
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
 * Every bubble in a dialogue scene, placed automatically.
 *
 * One entry per line key you want a bubble for — six words maximum, and a
 * *summary* rather than a transcript.
 *
 * **This episode's bubbles are allowed to disagree with its clips, and three
 * of them do on purpose** (script.md, Production notes): `a1_35` draws "I am
 * FIRST!", `a1_54` draws "AWAY" and `a3_15` draws "I TRADED with a PLANT!",
 * while the MiniMax clip text stays lowercase — caps inside a MiniMax sentence
 * are read letter-wise, and on screen they are a picture of loudness. Do not
 * "fix" one of them to match the other.
 *
 * Placement: above the speaker's crown (`bubbleOver`, which knows how tall Pip
 * currently is), on the side facing frame centre, tail pointing back down at
 * them, up for exactly the length of their turn.
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
// API 3 — the camera and the wide scenery layer
// ---------------------------------------------------------------------------

/**
 * How far past the frame this episode's scenery has to reach.
 *
 * Smaller than episode three's, and it can be: nothing in this episode leaves
 * the meadow. The widest shot is Scene 4's title pull-back ("the seed becomes
 * a dot, the field becomes the world"), which sits around 0.5×, and the box
 * below covers a 0.42× frame with room either side.
 */
export const WIDE = { x: -1400, y: -800, w: 4720, h: 2680 } as const;

export const WideLayer = makeWideLayer(WIDE);

/** One of the seven, staged, bound to this episode's `WideLayer`. */
export const Shard = makeShard(WideLayer);

/**
 * The volcano, bound to this episode's `WideLayer` and to the warm snore-ring
 * style — every wide in this episode has a green field under a bright sky and
 * the ring has to survive being drawn over grass.
 */
export const SleepingVolcano = makeSleepingVolcano(WideLayer, SNORE_RING_WARM);

// ---------------------------------------------------------------------------
// API 4 — the world
// ---------------------------------------------------------------------------
//
// **PLACEHOLDER SCENERY, AND IT IS FLAGGED.** Batch B2 owns `backgrounds.mjs`
// and the painted plates; until they exist every staged scene here dresses a
// `KidBackdrop` gradient with the drawn pieces below. Two of those pieces —
// the volcano and the old tree — are NOT placeholders and do not go away when
// the plates arrive:
//
//   the volcano  is SVG in every episode, because it breathes and smokes, and
//                a painted one could not (STYLE: anything that moves stays
//                SVG). It sits on `MEADOW.horizon` in every wide.
//   the tree     is load-bearing in Act Three (Scene 20 is *about* it) and
//                Scene 1 has to establish it, so the plate paints the far
//                hedge and the tree stays drawn.
//
// What B2 replaces is the sky, the far hills and the grass texture.

/**
 * The meadow's fixed geography, and the one thing every wide in the episode
 * has to agree about.
 *
 * `horizon` is where the far field meets the sky. It is the line the volcano
 * seats on, so when B2 paints the plates this number becomes a **measured**
 * fraction of the plate (`plateY`, episode three) rather than a drawn one —
 * and the volcano rule ("on the measured horizon of every wide, from the first
 * frame of Scene 1") is what makes it load-bearing rather than decorative.
 *
 * `ground` is where a character standing in the near field puts their feet.
 * Pip's dirt patch is at `pip.x`, and she is there for fifteen minutes.
 */
export const MEADOW = {
  horizon: 604,
  ground: 902,
  /** Pip's square inch. She never leaves it, so it is a constant. */
  pip: { x: 812 },
  /** The big old tree at the field's edge — Scene 1 plants it, Scene 20 pays. */
  tree: { x: 1588, scale: 1 },
} as const;

/**
 * Where the volcano is: the same island in the same place on the same horizon,
 * in every wide of the series that can see it. Frame left, small, and never
 * remarked on.
 *
 * Smaller than episode three's 1.15 because this is a *land* horizon rather
 * than a sea one — it is a mountain a long way behind a field, not an island
 * out on open water — and because episode four's entire volcano budget is one
 * curl of steam that nobody looks at.
 */
export const VOLCANO_AT = { x: 336, scale: 0.92 } as const;

/**
 * **The episode's stacking order, and the bug it exists to make impossible.**
 *
 * A `WideLayer` is an absolutely-positioned `<svg>`; giving it a positive
 * `zIndex` puts it in CSS's *positive* paint layer, and everything a scene
 * staged as `children` — every character, every prop — renders at `z-index:
 * auto`, which CSS paints **underneath** all of them. The whole cold open was
 * built that way and shipped a kid, a dandelion clock and the hero herself
 * buried in the grass band with their heads poking over the horizon like
 * periscopes; the placeholders had the same disease (Puff sunk to the waist in
 * the far field).
 *
 * The fix is that nothing in this world is allowed to be `auto`. Every band has
 * a number, and `children` are wrapped in a layer above all of them, so a scene
 * cannot forget:
 *
 *   `ground`   the far field band and the near field crest.
 *   `scenery`  the volcano and the old tree, standing *on* the horizon.
 *   `cast`     everything a scene stages. Always in front of the ground.
 *   `overlay`  the bubble z-index law — a bubble is above everything except
 *              nothing — and it is *outside* the camera, so a shot that pulls
 *              back to 0.46× does not shrink its own title card.
 */
export const MEADOW_Z = {
  ground: 1,
  scenery: 2,
  cast: 10,
  overlay: 60,
} as const;

/**
 * Where a body's feet go, and the one number a staged scene should reach for.
 *
 * `MEADOW.ground` is 902 of 1080 — the low-detail lower third STYLE asks every
 * frame to owe its characters — and the near field's crest is drawn *above* it,
 * so a character on this line stands **in** the field rather than on the seam
 * of it. Anything hovering belongs above `MEADOW.horizon`, never straddling it:
 * the far band is a hard edge and a character crossing it reads as sunk.
 */
export const CAST_ZONE = { top: MEADOW.horizon + 40, bottom: HEIGHT - 60 } as const;

/**
 * The drawn meadow: far hills, the horizon, the near field, the old tree, and
 * the volcano on the horizon line.
 *
 * `wide` is whether this shot can see the horizon at all. A cutaway (Scene 14's
 * cross-section, Scene 21's crumb) cannot, and passing `wide={false}` is the
 * only sanctioned way to be in this episode without a volcano in it.
 */
export const MeadowWorld: React.FC<{
  variant?: "day" | "sunset" | "night";
  /** Per-scene offset so two consecutive shots do not breathe in lockstep. */
  phase?: number;
  /** False for a cutaway or a close shot with no horizon in it. */
  wide?: boolean;
  /** Volcano stir, 0..1 — Scene 13 only, and it is the whole budget. */
  stir?: number;
  /**
   * **How far the ground drops in frame**, in px. Zero is standing in the
   * field; positive is up in the air with the meadow below you, which is what
   * the cold open's ride needs. It moves the horizon, the volcano and the tree
   * together, because they are one place.
   */
  lift?: number;
  /**
   * The camera, applied to the drawn world and to `children` — **and never to
   * the sky**. A shot below 1× shows past the edge of the frame, and a scaled
   * sky gradient would leave two bands of nothing at the sides. The sky stays
   * a full-frame fill and the world moves inside it.
   */
  cam?: Cam;
  /**
   * **Everything the camera must not touch**: speech bubbles, word cards, the
   * title. Rendered outside `<Camera>` at `MEADOW_Z.overlay`, which is both
   * halves of the bubble law — a zoomed bubble is unreadable, and a bubble
   * behind a character is a bubble nobody has ever seen.
   */
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({
  variant = "day",
  phase = 0,
  wide = true,
  stir = 0,
  lift = 0,
  cam,
  overlay,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase;
  const night = variant === "night";
  const far = night
    ? mixHex(kidTheme.grassDark, kidTheme.nightMid, 0.62)
    : mixHex(kidTheme.grass, kidTheme.skyLow, 0.42);
  const near = night ? mixHex(kidTheme.grassDark, kidTheme.nightTop, 0.42) : kidTheme.grass;
  const horizon = MEADOW.horizon + lift;
  const ground = MEADOW.ground + lift;
  return (
    <KidBackdrop variant={variant} clouds={night ? 0 : 3} stars={night}>
      <Camera cam={cam ?? { x: WIDTH / 2, y: HEIGHT / 2 }}>
        {wide ? (
          <>
            <WideLayer zIndex={MEADOW_Z.ground}>
              {/* Far field: one flat band under the sky, low contrast, so the
                  volcano standing on it is the most interesting thing up there
                  and still not interesting. */}
              <rect x={WIDE.x} y={horizon} width={WIDE.w} height={WIDE.h} fill={far} />
              {/* Near field, with a soft crest so the ground is not a ruled
                  line. It rides `MEADOW.ground`, which is where feet go — the
                  crest sits ~60px ABOVE that line, so a character on the ground
                  line stands inside the near field rather than on its seam. */}
              <path
                d={
                  `M ${WIDE.x} ${WIDE.y + WIDE.h}` +
                  ` L ${WIDE.x} ${ground - 46}` +
                  ` Q ${WIDTH * 0.28} ${ground - 92} ${WIDTH * 0.62} ${ground - 54}` +
                  ` Q ${WIDTH * 0.9} ${ground - 26} ${WIDE.x + WIDE.w} ${ground - 62}` +
                  ` L ${WIDE.x + WIDE.w} ${WIDE.y + WIDE.h} Z`
                }
                fill={near}
              />
            </WideLayer>
            {/* The volcano and the tree stand ON the horizon, so they are a
                layer of their own rather than `auto` — at `auto` the ground
                band above would paint straight over their feet. */}
            <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.scenery }}>
              <SleepingVolcano
                x={VOLCANO_AT.x}
                base={horizon}
                scale={VOLCANO_AT.scale}
                phase={phase}
                stir={stir}
              />
              <OldTree x={MEADOW.tree.x} base={horizon + 22} t={t} night={night} />
            </div>
          </>
        ) : null}
        {/* THE CAST LAYER. Everything a scene stages goes in here, in front of
            the ground. See `MEADOW_Z`. */}
        <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.cast }}>
          {children}
        </div>
      </Camera>
      {overlay ? (
        <AbsoluteFill style={{ zIndex: MEADOW_Z.overlay, pointerEvents: "none" }}>
          {overlay}
        </AbsoluteFill>
      ) : null}
    </KidBackdrop>
  );
};

/**
 * The big old tree at the meadow's edge.
 *
 * Established in the first wide of the episode and never mentioned until Scene
 * 20 asks what it is made of — which only lands if the audience has been
 * looking at it for thirteen minutes, so it is in every wide and it is always
 * in the same place.
 *
 * Three flat canopy masses rather than one, because a single blob at this size
 * reads as a lollipop, and they sway on their own slow clock: a tree that is
 * dead still in a field where the grass moves is a cut-out.
 */
const OldTree: React.FC<{ x: number; base: number; t: number; night: boolean }> = ({
  x,
  base,
  t,
  night,
}) => {
  const sway = Math.sin(t * 0.42) * 1.5;
  const canopy = night
    ? mixHex(kidTheme.grassDark, kidTheme.nightTop, 0.5)
    : kidTheme.grassDark;
  const canopyLit = night ? mixHex(canopy, kidTheme.nightLow, 0.3) : kidTheme.grass;
  return (
    <WideLayer>
      <g transform={`translate(${x} ${base})`}>
        <ellipse cx={0} cy={4} rx={128} ry={16} fill={kidTheme.ink} opacity={0.14} />
        <path
          d="M -26 0 Q -18 -108 -34 -196 L 34 -196 Q 18 -108 26 0 Z"
          fill={night ? mixHex(kidTheme.earth, kidTheme.nightTop, 0.5) : kidTheme.earth}
          stroke={kidTheme.ink}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <g transform={`rotate(${sway.toFixed(2)} 0 -170)`}>
          <ellipse cx={-76} cy={-232} rx={104} ry={78} fill={canopy} stroke={kidTheme.ink} strokeWidth={7} />
          <ellipse cx={82} cy={-248} rx={96} ry={72} fill={canopy} stroke={kidTheme.ink} strokeWidth={7} />
          <ellipse cx={0} cy={-306} rx={118} ry={86} fill={canopy} stroke={kidTheme.ink} strokeWidth={7} />
          {/* One lit mass, kept off the outline, so the canopy has a top. */}
          <ellipse cx={-8} cy={-336} rx={72} ry={40} fill={canopyLit} opacity={0.75} />
        </g>
      </g>
    </WideLayer>
  );
};

/**
 * A soft dark ellipse behind a character who is hard to find. Sold in-fiction
 * as shade, and the sanctioned fix for a legibility problem — the alternative
 * (changing the character) is always worse.
 */
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
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.4 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 76% 76% at 50% 50%, transparent 40%, rgba(20,42,66,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// The kid
// ---------------------------------------------------------------------------

/**
 * The kid, in silhouette. No face, ever, and not one word — fifth episode
 * running, and this one opens and closes on them: the kid's breath launches
 * Pip in Scene 1, and a plant hands the breath back in Scene 28.
 *
 * **`breath` is the whole reason this is a new body rather than episode two's.**
 * That one is a standing child with a kite on the end of its arm and three
 * knobs for running, slumping and cheering; this one kneels in the grass and
 * its chest visibly rises twice in fifteen minutes, which is the entire
 * performance and is not expressible in any of those three. Generalising the
 * ep-2 art into a body that can also kneel and inhale is exactly the promotion
 * STYLE warns against ("parameterise the data, not the art"), so this is a
 * second body rather than a bigger one — **and it is flagged for the retro**:
 * a third episode that needs a kid should promote a `KidSilhouette` that takes
 * a pose table, with these two poses in it.
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
  /**
   * The breath, −1..1. Positive is the chest filling and the shoulders rising;
   * pushing it negative is the blow. Scene 1's held beat is a ramp to 1 and a
   * hard drop through 0, and Scene 28 is the same shape with the audience
   * doing it too.
   */
  breath?: number;
  /** Both hands up in front, holding something. 0..1. */
  hold?: number;
  /**
   * The patch of shade they are kneeling in. On by default: a flat ink
   * silhouette with nothing under it hovers a centimetre off the field, and
   * this one is kneeling in grass for the whole of Scene 1.
   */
  shadow?: boolean;
};

/**
 * **The kneeling pose, as numbers**, so the drawing and `kidHands` can never
 * drift apart — the whole reason the first build put a dandelion stem down the
 * middle of the child's chest.
 *
 * Local units, the component's own `viewBox`: y = 200 is the ground, negative
 * is up. Everything is a lerp on `kneel`, so the same body stands (Scene 28's
 * option) and kneels (Scene 1) without a second set of art.
 */
type KidPose = {
  hipY: number;
  shoulderY: number;
  headY: number;
  headR: number;
  waist: number;
  shoulder: number;
  /** Where the fists are — what a held prop hangs off. */
  hand: { x: number; y: number };
};

const KID_GROUND = 200;

function kidPose(kneel: number, breath: number, hold: number): KidPose {
  const k = Math.max(0, Math.min(1, kneel));
  const b = Math.max(-1, Math.min(1, breath));
  const h = Math.max(0, Math.min(1, hold));
  // The in-breath: shoulders and head rise, the chest widens. Small numbers —
  // it is a child filling their lungs, not a bellows — but they are the only
  // performance this body gives in fifteen minutes, so they are on the two
  // things a silhouette can actually show: the top line and the width.
  const lift = -26 * b;
  const chest = 20 * b;
  // Kneeling is not "standing with the legs bent": it takes about a quarter off
  // the child's total height and it takes ALL of it out of the legs. The hips
  // come down to within a shin of the grass and everything above rides down
  // with them, which is what makes the silhouette read as low and wide rather
  // than as a short person standing with their feet apart.
  const hipY = 34 + k * 110;
  const shoulderY = -74 + k * 90 + lift;
  const headY = -134 + k * 98 + lift * 1.35;
  // Hands: hanging at the hips at rest, up and to the child's camera-right
  // when they are holding something. Off to the side rather than dead centre
  // so the prop clears the head — a clock held on the axis buries the one
  // feature the silhouette has.
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
  // A very slow idle sway, so a child holding still is not a cardboard cutout.
  const sway = Math.sin(t * 0.7) * 1.1;
  const k = Math.max(0, Math.min(1, kneel));
  const pose = kidPose(kneel, breath, hold);
  const { hipY, shoulderY, headY, headR, waist, shoulder, hand } = pose;
  // Kneeling puts the knees ON the ground and splays them: a front-on V from
  // the hips to the grass. The first build folded the shins out sideways into
  // two horizontal bars under a rectangle, which flattened to a fire hydrant.
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
            {/* Legs. A splayed V down to the grass when kneeling, straight down
                when standing. */}
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
            {/* Body: round shoulders, a narrower waist, and a neck. The taper
                and the neck are the whole difference between a child and a
                pillar — the first sheet had neither and flattened to a robot. */}
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
            {/* Arms. Drawn AFTER the body and only visible outside it (STYLE,
                "limbs read only outside the silhouette"), so the elbows are
                thrown wide: an arm that comes straight up the front of the
                chest renders nothing at all. */}
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
            {/* Head, with a scruff of hair so the silhouette is a child. */}
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

/**
 * Where the kid's hands are, in composition coordinates — what the dandelion
 * clock is held by. Derived from the same numbers the arms are drawn from, and
 * it takes the whole placement rather than a pose, because the component
 * scales about the box's *bottom* and ignoring that put episode two's kite
 * string thirty pixels up the forearm.
 */
export function kidHands(place: KidPlacement): { x: number; y: number } {
  const scale = place.scale ?? 1;
  const { hand } = kidPose(place.kneel ?? 0, place.breath ?? 0, place.hold ?? 0);
  // `CharacterFrame`-style bottom anchoring: the box's bottom edge (local 210)
  // sits on `y + CHAR_BOX.kid / 2` at every scale, so a local point is that
  // line minus its height above it, scaled.
  const bottom = place.y + CHAR_BOX.kid / 2;
  const flip = place.flip ? -1 : 1;
  return { x: place.x + hand.x * scale * flip, y: bottom - (210 - hand.y) * scale };
}

// ---------------------------------------------------------------------------
// Placeholder scenes (everything B3 has not staged yet)
// ---------------------------------------------------------------------------

/**
 * Where Pip stands in an unstaged scene — and it is the SAME square inch she
 * stands on in the staged ones, because she cannot move. A placeholder that
 * puts her somewhere else would teach the eye a position the finished scene
 * then contradicts, and for this hero that is not a nitpick, it is the premise.
 */
export const PIP_MARK: Mark = {
  x: MEADOW.pip.x,
  y: stand("pip", MEADOW.ground),
  scale: 0.62,
  who: "pip",
};

/**
 * Which growth state Pip is in, by scene id — **the episode's growth clock, in
 * one place**.
 *
 * A placeholder reads it so an unstaged Act Three scene does not draw a seed,
 * and a staged scene reads it rather than hard-coding a state, so the day a
 * beat moves the plant does not have to be re-typed in four files. The unlocks
 * are script.md's: germination in Scene 14, the first leaf in Scene 16, the
 * growth spurt in Scene 24.
 */
export const PIP_STATE_AT: Record<string, PipState> = {
  s01_breath: "seed",
  s02_ride: "seed",
  s03_planted: "planted",
  s04_title: "planted",
};

export function pipStateAt(sceneId: string): PipState {
  const known = PIP_STATE_AT[sceneId];
  if (known) return known;
  const n = Number(sceneId.slice(1, 3));
  if (!Number.isFinite(n) || n <= 13) return "planted";
  if (n <= 15) return "sprout";
  if (n <= 23) return "leaf";
  return "young";
}

const PLACEHOLDER_MARKS: Record<Exclude<Speaker, "narrator">, Mark> = {
  pip: PIP_MARK,
  sunny: { x: 1560, y: hover("sunny", 250, 1.1), scale: 1.1, who: "sunny", side: "left" },
  ray: { x: 430, y: hover("ray", 430, 0.85), scale: 0.85, who: "ray" },
  drip: { x: 1180, y: stand("drip", MEADOW.ground), scale: 0.72, who: "drip" },
  // Hovering bodies stay wholly in the sky (`CAST_ZONE`): the far field's top
  // edge is a hard line, and a floater sitting across it reads as sunk into it
  // even now that it can no longer paint over him.
  puff: { x: 1060, y: hover("puff", 430, 0.9), scale: 0.9, who: "puff" },
  blue: { x: 560, y: hover("shard", 400, 0.7), scale: 0.7, who: "shard" },
  cloudia: { x: 1240, y: hover("cloudia", 300, 0.9), scale: 0.9, who: "cloudia" },
};

/**
 * Stand-in for a scene nobody has staged yet: the real dialogue, in the real
 * voices, with the real timing, and every character on stage mouthing their
 * own lines — just no direction. Drop the finished scene into its act's map
 * and the timeline does not move by a frame.
 *
 * It draws the world, because this episode's world is the joke's straight man:
 * the volcano is supposed to be visible in every wide from Scene 1, and a
 * placeholder on a bare gradient would make the one rule the episode has to
 * keep invisible for two thirds of the run.
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
  const state = pipStateAt(scene.id);
  return (
    <MeadowWorld
      phase={(scene.from % 900) / 300}
      overlay={
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
      }
    >
      {cast.includes("pip") ? (
        <PlaceholderPip scene={scene} cast={marks} state={state} />
      ) : null}
      {cast.includes("sunny") ? <PlaceholderSunny scene={scene} cast={marks} /> : null}
      {cast.includes("ray") ? <PlaceholderRay scene={scene} cast={marks} /> : null}
      {cast.includes("drip") ? <PlaceholderDrip scene={scene} cast={marks} /> : null}
      {cast.includes("puff") ? <PlaceholderPuff scene={scene} cast={marks} /> : null}
      {cast.includes("blue") ? <PlaceholderBlue scene={scene} /> : null}
      {cast.includes("cloudia") ? <PlaceholderCloudia scene={scene} cast={marks} /> : null}
    </MeadowWorld>
  );
};

const PlaceholderPip: React.FC<{ scene: TimedScene; cast: Cast; state: PipState }> = ({
  scene,
  cast,
  state,
}) => (
  <Pip
    x={PIP_MARK.x}
    y={PIP_MARK.y}
    scale={PIP_MARK.scale}
    state={state}
    phase={PHASE.pip}
    emotion="happy"
    speaking={useSpeaking(scene, "pip")}
    look={useLookAtSpeaker(scene, cast, "pip")}
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

const PlaceholderRay: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Ray
    x={PLACEHOLDER_MARKS.ray.x}
    y={PLACEHOLDER_MARKS.ray.y}
    scale={0.85}
    brightness={RAY_LIGHT}
    phase={PHASE.ray}
    emotion="happy"
    speaking={useSpeaking(scene, "ray")}
    look={useLookAtSpeaker(scene, cast, "ray")}
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

const PlaceholderCloudia: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Cloudia
    x={PLACEHOLDER_MARKS.cloudia.x}
    y={PLACEHOLDER_MARKS.cloudia.y}
    scale={0.9}
    phase={PHASE.cloudia}
    emotion="happy"
    speaking={useSpeaking(scene, "cloudia")}
    look={useLookAtSpeaker(scene, cast, "cloudia")}
  />
);

/** Blue keeps his ricochet even in a placeholder — it is who he is. */
const PlaceholderBlue: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const box: Box = { x: 380, y: 270, w: 520, h: 250 };
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

/**
 * Ray's brightness in this episode. He arrives on moonlight (Scene 7) and is a
 * direct beam from Scene 8 onward, but unlike episode three his brightness is
 * **not** an arc — that story is told and it is not this episode's. One value,
 * used everywhere, so nobody starts drawing a second one.
 */
export const RAY_LIGHT = 0.85;

// Re-exported so a scene file needs one import for the whole kit.
export {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  isSpeaking,
  KidContactShadow,
  Face,
  useRig,
};
export { Pip, pipCrownLocal, pipFaceLocal, pipLean, PIP_COLOR, LEAN_FULL } from "./Pip";
export type { PipState, LeanFiring } from "./Pip";
export {
  BigWordBeat,
  Cloudia,
  CutFlash,
  Drip,
  KidBackdrop,
  Puff,
  Ray,
  RayShard,
  // Raw, for the one thing `Bubbles` structurally cannot do: a scene where a
  // single clip carries several bubbles that replace one another (the roll
  // call). `Bubbles` is one bubble per *turn* and always will be.
  SpeechBubble,
  SPECTRUM,
  Sunny,
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
  mixHex,
  moveAlong,
  project,
  settleWave,
  turnFor,
  violetVibrate,
} from "../../../lib/kid";
export { Camera, blueRicochet, blueTrail, shardOf };
export type { Box };
export type { Cam, Emotion, EmotionInput, LookDirection, ShardName, SpectrumColor };
export type { TimedScene };
