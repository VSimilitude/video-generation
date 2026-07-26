import React from "react";
import {
  AbsoluteFill,
  Freeze,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Cloudia,
  Drip,
  Face,
  KidBackdrop,
  KidContactShadow,
  KidPaintedBackdrop,
  Puff,
  SpeechBubble,
  Sunny,
  WordCard,
  EMOTION_EASE,
  kidEase,
  kidOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  lookAt,
  settleWave,
  useRig,
  type Emotion,
  type EmotionInput,
  type KidPaintedBackdropProps,
  type LookDirection,
} from "../../../lib/kid";
import { BACKGROUNDS, type BackgroundKey } from "../backgroundManifest";
import {
  isSpeaking,
  useSpeaking,
  type DialogueTurn,
  type TimedScene,
  type TimedTurn,
} from "../../../lib/narration";
import { NARRATION } from "../narrationManifest";

// Shared kit for "Puff and the Kite That Wouldn't Fly" — Little Big World,
// episode two.
//
// Same shape as episode one's kit (src/videos/water-cycle/scenes/common.tsx),
// which an act file should read first if this is unfamiliar. What is *new*
// here, and why:
//
//   API 2b  `speakerVisual` — the Narrator cameo-voices a beetle, a leaf and a
//           rock. Those have bodies on screen and their mouths have to move on
//           NARRATOR-voiced turns, which the ep-1 kit could not express: it
//           derived the on-stage body from the line key, so every cameo line
//           moved nobody. A scene now hands `useStage()` a per-line override
//           and everything downstream (mouths, bubbles, emotions, looks) uses
//           the *staged* speaker instead of the voiced one.
//   API 4b  `RuleStamp` — WARM AIR RISES is a rule, not a vocabulary word, and
//           the script is explicit that it must NOT wear the `WordCard`
//           signature (script.md, Production notes). It gets a passport stamp
//           with an arrow instead. Keeping the two treatments distinct is what
//           keeps `WordCard` meaning "learn this word".
//   Props   the red kite and the silhouette kid bracket the episode (Scene 1
//           and Scene 31 are the same framing), so they are built once here
//           rather than twice at either end of the file tree.
//
// This file deliberately does not import from water-cycle/scenes/common.tsx.
// Nothing there is episode-agnostic in its current form — `Speaker`, `PHASE`,
// `CHAR_BOX`, `ACT_COLOR` and `PLACEHOLDER_MARKS` are all ep-1 cast lists, and
// `turnsOf` closes over ep-1's manifest. See the hand-off note in the report
// for the three pieces that have now been written twice and should be promoted
// to `src/lib/kid/` before episode three.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Every voice in the show. `narrator` is off-stage: no body, no bubble. */
export type Speaker = "narrator" | "puff" | "sunny" | "cloudia" | "drip";

/**
 * Bodies that appear on screen without a voice of their own. The Narrator
 * cameos all of them (script.md, Cast: "so the show never grows past five
 * actors"); `kid` never speaks at all, in any episode.
 */
export type VisualSpeaker = "beetle" | "leaf" | "rock" | "kid";

/** Anything that can be staged, whether or not it owns a voice. */
export type Stage = Speaker | VisualSpeaker;

/**
 * Per-character cycle offset. Breathing, blinking, mouth timing and Puff's own
 * silhouette wobble all key off it, so two characters sharing one ripple in
 * lockstep — always pass these.
 */
export const PHASE: Record<Stage, number> = {
  narrator: 0,
  puff: 0,
  sunny: 3.4,
  cloudia: 1.9,
  drip: 2.6,
  beetle: 4.7,
  leaf: 5.9,
  rock: 6.8,
  kid: 7.4,
};

/**
 * Act colours. The recap's four-way split screen wears these one per panel
 * (script.md, Scene 33: "grass green, gold, sky blue, sea green"), so the Big
 * Word cards have to be dressed from the same table or the recap will not
 * match the thing it is recapping.
 */
export const ACT_COLOR = {
  air: kidTheme.grassDark,
  warmAirRises: kidTheme.sunDark,
  wind: kidTheme.skyTop,
  seaBreeze: kidTheme.mint,
} as const;

/**
 * Puff's opacity, scene by scene — the character arc, drawn.
 *
 * script.md ("Puff's opacity is the arc") fixes these five numbers and forbids
 * any dialogue about them. They live here rather than in the act files so the
 * ramp can be read in one place: an act that invents a sixth value has broken
 * the arc.
 *
 * A scene where he is hard to see darkens the background behind him
 * (`SoftShade`), it does not raise the number.
 */
export const PUFF_OPACITY = {
  /** Act One, throughout. */
  actOne: 0.4,
  /** Scene 6 only, his lowest. */
  lowest: 0.25,
  /** From the AIR card (Scene 10's chant) to Scene 21. */
  afterAir: 0.55,
  /** Scene 22, "Not sorry". */
  notSorry: 0.7,
  /** Scene 32 onward, and the recap. */
  full: 1,
} as const;

// ---------------------------------------------------------------------------
// API 1 — building a scene's turns from script.md's line keys
// ---------------------------------------------------------------------------

/** `a1_02_puff` -> `puff`. The key convention *is* the cast list. */
export function speakerOf(lineKey: string): Speaker {
  const tail = lineKey.split("_").slice(2).join("_");
  if (tail === "puff" || tail === "sunny" || tail === "cloudia" || tail === "drip") {
    return tail;
  }
  return "narrator";
}

/** The line key a turn plays, recovered from its clip path. */
export function lineKeyOf(turn: { clip: { file: string } }): string {
  const base = turn.clip.file.split("/").pop() ?? "";
  return base.replace(/\.mp3$/, "");
}

/**
 * Turn list for a scene, straight from script.md's line keys. The speaker is
 * derived from the key, so a scene's cast can never drift from its audio.
 *
 * The last turn gets `gapFrames: 0` unless the script asked for one explicitly
 * — a trailing gap stacks with the scene's tail and leaves a scene sitting
 * silent twice as long as intended. Three of this episode's held beats *are*
 * trailing (Scenes 29, 31, 36), and those pass an explicit number.
 */
export function turnsOf(
  keys: string[],
  opts?: { gap?: number; gaps?: Record<string, number> },
): DialogueTurn[] {
  return keys.map((key, i) => {
    const clip = NARRATION[key];
    if (!clip) throw new Error(`[wind] no narration clip for "${key}"`);
    const explicit = opts?.gaps?.[key];
    const gapFrames =
      explicit !== undefined ? explicit : i === keys.length - 1 ? 0 : opts?.gap;
    return { clip, speaker: speakerOf(key), gapFrames };
  });
}

/** The timed turn that plays `lineKey`, for beats keyed to one line. */
export function turnFor(scene: TimedScene, lineKey: string): TimedTurn | null {
  return (scene.turns ?? []).find((t) => lineKeyOf(t) === lineKey) ?? null;
}

/** `[start, end)` of a line inside its scene; `[0, 0]` if the line isn't here. */
export function lineWindow(scene: TimedScene, lineKey: string): [number, number] {
  const turn = turnFor(scene, lineKey);
  return turn ? [turn.from, turn.from + turn.durationInFrames] : [0, 0];
}

/**
 * The held beat *after* a line: `[start, end)` of the silence the script
 * bought with a `gapFrames`. This is how a scene stages a beat without
 * hard-coding its length — raise the gap in `Video.tsx` and the staging
 * follows, which is the whole point of the script owning those numbers.
 *
 * Returns `[end, end]` (an empty window) when the next line starts immediately.
 */
export function heldBeat(scene: TimedScene, lineKey: string): [number, number] {
  const turns = scene.turns ?? [];
  const i = turns.findIndex((t) => lineKeyOf(t) === lineKey);
  if (i < 0) return [0, 0];
  const end = turns[i].from + turns[i].durationInFrames;
  const next = turns[i + 1];
  return [end, next ? next.from : scene.durationInFrames];
}

/** 0..1 progress through a line — the honest way to key a beat to a clause. */
export function lineProgress(
  scene: TimedScene,
  lineKey: string,
  frame: number,
): number {
  const [a, b] = lineWindow(scene, lineKey);
  if (b <= a) return 0;
  return Math.max(0, Math.min(1, (frame - a) / (b - a)));
}

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
  puff: 340,
  drip: 380,
  sunny: 460,
  cloudia: 380,
  beetle: 260,
  leaf: 280,
  kid: 420,
} as const;
export type Body = keyof typeof CHAR_BOX;

/** `y` prop for a body whose feet should land on `groundY`. */
export function stand(who: Body, groundY: number): number {
  return groundY - CHAR_BOX[who] / 2;
}

/**
 * `y` prop for a body whose *middle* should sit at `centreY` — the one Puff
 * actually needs, because he never stands on anything. At scale 1 it is the
 * same as `centreY`; below 1 the difference is most of the character.
 */
export function hover(who: Body, centreY: number, scale = 1): number {
  const h = CHAR_BOX[who];
  return centreY - h / 2 + (h * scale) / 2;
}

/** Screen y of the top of a body's head — what a bubble has to clear. */
export function crownOf(who: Body, y: number, scale = 1): number {
  const h = CHAR_BOX[who];
  return y + h / 2 - h * scale;
}

/** Screen y of a body's visual middle — what another character looks at. */
export function midOf(who: Body, y: number, scale = 1): number {
  const h = CHAR_BOX[who];
  return y + h / 2 - (h * scale) / 2;
}

/**
 * Where a body stands. Pass exactly the `x`, `y` and `scale` you gave the
 * component and the helpers do the rest: bubbles clear the crown, looks aim at
 * the middle.
 */
export type Mark = {
  x: number;
  y: number;
  /** The component's own `scale` prop. */
  scale?: number;
  /** Which body's geometry to use. Default `puff`. */
  who?: Body;
  /** Override: bubble centre this far above `y` instead of above the crown. */
  lift?: number;
  /** Horizontal gap from the body to the bubble. Default 330. */
  offset?: number;
  /** Which side of the body the bubble sits on; default = towards centre. */
  side?: "left" | "right";
};

/** Bubble centre for a mark: clear of the crown, with room for the tail. */
export function bubbleAbove(m: Mark): number {
  if (m.lift !== undefined) return m.y - m.lift;
  return crownOf(m.who ?? "puff", m.y, m.scale ?? 1) - 165;
}

/** The point another character should look at. */
export function markCentre(m: Mark): { x: number; y: number } {
  return { x: m.x, y: midOf(m.who ?? "puff", m.y, m.scale ?? 1) };
}

export type Cast = Partial<Record<Stage, Mark>>;

// ---------------------------------------------------------------------------
// API 2b — the cameo bodies (`speakerVisual`)
// ---------------------------------------------------------------------------

/**
 * Per-line override: "this NARRATOR turn comes out of *that* body's mouth".
 *
 *   const SPEAKER_VISUAL: SpeakerVisual = {
 *     a1_07_narrator: "beetle",
 *     a1_09_narrator: "beetle",
 *   };
 *
 * Everything staged reads through it: `useStage()` for mouths, `Bubbles` for
 * bubbles, `useEmotion()` for faces, `useLookAtSpeaker()` for eyes. A key with
 * no entry keeps its voiced speaker, so a scene only lists its cameos.
 *
 * The Narrator himself stays voice-only for every line that is *not* listed —
 * he has no body and never gets one.
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
 *   const stage = useStage(scene, SPEAKER_VISUAL);
 *   <Beetle speaking={stage.speaking("beetle")} … />
 *   <Puff   speaking={stage.speaking("puff")}   … />
 *
 * `stage.speaking` is a plain function, not a hook, so it is safe to call once
 * per body inside the returned JSX — which is what keeps a scene with five
 * bodies from needing five conditional hook calls.
 */
export function useStage(scene: TimedScene, visual?: SpeakerVisual): StageState {
  const frame = useCurrentFrame();
  const turns = scene.turns ?? [];
  const live = turns.find(
    (t) => frame >= t.from && frame < t.from + t.durationInFrames,
  );
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
 * Per-line emotion for one body: `{ "a1_22_puff": "amazed" }`.
 *
 * The emotion lands `lead` frames *before* the line starts and holds until that
 * body's next mapped line. Returns an `EmotionCue`, so the face *morphs* rather
 * than cutting (see `resolveEmotion` in the rig).
 *
 * **`lead` is 0 on every held-beat scene in this episode.** script.md makes
 * that a rule rather than a note: the default eight-frame lead lands a reaction
 * inside the silence the joke is being held for, which spends the beat early.
 * Scenes 4, 5, 21 and 36 say so explicitly; treat it as true of all twenty-two
 * held beats.
 *
 * Never map a line to `scared`: the rig's wobble-mouth hard-cuts to a talking
 * mouth on the first frame of a line. Put `scared` in the gap between two lines
 * instead.
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
 * *summary* rather than a transcript. The one place this episode goes verbatim
 * is the running "Sorry." gag: where the line is a single word, the bubble
 * carries that word exactly, because one word is well inside the rule and the
 * reading-practice payoff favours verbatim when it fits.
 *
 * Placement: above the speaker's crown, on the side facing frame centre, tail
 * pointing back down at them, up for exactly the length of their turn.
 * `visual` routes a cameo line's bubble to the body that is saying it.
 *
 * `at` overrides one line's bubble — `{x, y}` there is the **bubble's own
 * centre**, not the character's.
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
      const by = clamp(override?.y ?? bubbleAbove(mark), 170, HEIGHT - 280);
      const tail = override?.tail ?? (side === "right" ? "left" : "right");
      return (
        <SpeechBubble
          key={`${key}-${i}`}
          x={bx}
          y={by}
          text={body}
          tail={tail}
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
// API 3 — the camera
// ---------------------------------------------------------------------------

/**
 * A camera move, as a transform on whatever is inside it. `x`/`y` is the point
 * that stays put (the thing you are pushing in on).
 *
 * Zooming *out* below 1 shows past the edge of the frame, so keep the sky
 * outside the camera in a pull-out shot and only put the world inside it.
 */
export type Cam = {
  x: number;
  y: number;
  zoom?: number;
  /** Vertical zoom, when it differs — a squash, a stretch. */
  zoomY?: number;
  dx?: number;
  dy?: number;
  rotate?: number;
};

export const Camera: React.FC<{ cam: Cam; children: React.ReactNode }> = ({
  cam,
  children,
}) => (
  <AbsoluteFill
    style={{
      transformOrigin: `${cam.x}px ${cam.y}px`,
      transform: [
        `translate(${cam.dx ?? 0}px, ${cam.dy ?? 0}px)`,
        `rotate(${cam.rotate ?? 0}deg)`,
        `scale(${cam.zoom ?? 1}, ${cam.zoomY ?? cam.zoom ?? 1})`,
      ].join(" "),
    }}
  >
    {children}
  </AbsoluteFill>
);

/**
 * World point -> screen point under a camera. Bubbles live *outside* the camera
 * (a zoomed bubble is unreadable), so a bubble on a character inside one is
 * placed with `project(cam, mark)`. Ignores `rotate`.
 */
export function project(cam: Cam, p: { x: number; y: number }): { x: number; y: number } {
  const z = cam.zoom ?? 1;
  const zy = cam.zoomY ?? z;
  return {
    x: cam.x + (p.x - cam.x) * z + (cam.dx ?? 0),
    y: cam.y + (p.y - cam.y) * zy + (cam.dy ?? 0),
  };
}

/** A mark as it appears on screen under a camera move. */
export function projectMark(cam: Cam, m: Mark): Mark {
  const h = CHAR_BOX[m.who ?? "puff"];
  const ground = project(cam, { x: m.x, y: m.y + h / 2 });
  return {
    ...m,
    x: ground.x,
    y: ground.y - h / 2,
    scale: (m.scale ?? 1) * (cam.zoomY ?? cam.zoom ?? 1),
  };
}

// ---------------------------------------------------------------------------
// API 4 — the Big Word signature, and the rule stamp that is deliberately not it
// ---------------------------------------------------------------------------

/**
 * The show's Big Word beat, identical to episode one's: the action behind
 * hard-freezes, the word slams on in capitals, then it splits into blocks that
 * bounce one at a time while Puff spells them.
 *
 * Three of these fire in episode two — AIR (Scene 10), WIND (Scene 19) and SEA
 * BREEZE (Scene 26) — roughly three minutes apart. **WARM AIR RISES is not one
 * of them**; see `RuleStamp`.
 *
 * `freeze` is frozen on the slam frame; `children` keep playing, because the
 * character chanting the letters has to be able to move their mouth.
 */
export const BigWordBeat: React.FC<{
  scene: TimedScene;
  word: string;
  syllables: string[];
  chantKey: string;
  /** Frame the freeze + slam happens. Default: 40 frames before the chant. */
  slamAt?: number;
  color?: string;
  sub?: string;
  /** Vertical centre of the banner. Default 300. */
  y?: number;
  freeze?: React.ReactNode;
  children?: React.ReactNode;
}> = ({
  scene,
  word,
  syllables,
  chantKey,
  slamAt,
  color = kidTheme.pink,
  sub,
  y = 300,
  freeze,
  children,
}) => {
  const frame = useCurrentFrame();
  const chant = turnFor(scene, chantKey);
  const chantFrom = chant ? chant.from : scene.durationInFrames;
  const chantLen = chant ? chant.durationInFrames : 45;
  const slam = slamAt ?? Math.max(0, chantFrom - 40);
  const split = Math.max(slam + 20, chantFrom - 8);

  return (
    <>
      {freeze ? (
        <Freeze frame={slam} active={frame >= slam}>
          {freeze}
        </Freeze>
      ) : null}
      {children}
      <CutFlash at={slam} />
      <WordCard text={word} from={slam} until={split} y={y} bannerColor={color} sub={sub} />
      <SyllableBlocks
        syllables={syllables}
        from={split}
        chantFrom={chantFrom}
        chantLen={chantLen}
        y={y}
        color={color}
      />
    </>
  );
};

/** The impact flash under a slam, and the cheapest way to sell a hard cut. */
export const CutFlash: React.FC<{ at: number; strength?: number }> = ({
  at,
  strength = 0.8,
}) => {
  const frame = useCurrentFrame();
  const u = frame - at;
  if (u < 0 || u > 8) return null;
  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        opacity: strength * Math.max(0, 1 - u / 8),
        zIndex: 60,
        pointerEvents: "none",
      }}
    />
  );
};

const SyllableBlocks: React.FC<{
  syllables: string[];
  from: number;
  chantFrom: number;
  chantLen: number;
  y: number;
  color: string;
}> = ({ syllables, from, chantFrom, chantLen, y, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from) return null;
  const per = chantLen / syllables.length;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        transform: "translateY(-50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
        zIndex: 50,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      {syllables.map((s, i) => {
        const land = spring({
          frame: frame - from - i * 3,
          fps,
          config: { damping: 11, mass: 0.6 },
        });
        const u = (frame - (chantFrom + i * per)) / per;
        const hop = u >= 0 && u <= 1 ? Math.sin(u * Math.PI) : 0;
        const hot = hop > 0.15;
        return (
          <div
            key={`${s}-${i}`}
            style={{
              background: hot ? kidTheme.star : color,
              color: hot ? kidTheme.ink : kidTheme.paper,
              border: `9px solid ${kidTheme.ink}`,
              borderRadius: kidRadius.card,
              padding: "14px 34px",
              fontSize: 116,
              fontWeight: 900,
              lineHeight: 1.05,
              boxShadow: kidShadow(1.1),
              transform: `translateY(${-hop * 56 + (1 - land) * -90}px) scale(${(0.4 + 0.6 * land) * (1 + hop * 0.14)}) rotate(${(1 - land) * 12 - 2 + hop * 3}deg)`,
              opacity: Math.min(1, Math.max(0, (frame - from - i * 3) / 3)),
            }}
          >
            {s}
          </div>
        );
      })}
    </div>
  );
};

/**
 * The rule stamp — **WARM AIR RISES**, and deliberately not a `WordCard`.
 *
 * script.md's Production notes make the case: the episode teaches four things
 * but only three of them are vocabulary. A rule gets a passport stamp with a
 * fat arrow behind it, thumping onto the frame and *staying* while the shot
 * keeps moving underneath. Keeping the letter-bouncing signature for the three
 * real words is what makes a `WordCard` mean "learn this word" rather than
 * "here is some text".
 *
 * The thump is the whole component: it arrives from 2.4× in six frames on
 * `easeInQuad` — a stamp accelerates *into* the paper — lands hard and rings
 * out on `settleWave`. Anything gentler reads as a card fading up.
 */
export const RuleStamp: React.FC<{
  text: string;
  /** Frame the stamp lands on. */
  from: number;
  y?: number;
  color?: string;
  /** Degrees the stamp is off true. A stamp is never square to the page. */
  tilt?: number;
  zIndex?: number;
}> = ({ text, from, y = 320, color = ACT_COLOR.warmAirRises, tilt = -3.5, zIndex = 50 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - from;
  if (f < -8) return null;
  // Six frames of approach, then the impact ring.
  const drop = kidEase.easeInQuad(Math.max(0, (f + 6) / 6));
  const scale = 2.4 - 1.4 * drop;
  const ring = f >= 0 ? settleWave(f / (fps * 0.7), 1.5, 4.2) : 0;
  const sx = scale * (1 + 0.1 * ring);
  const sy = scale * (1 - 0.12 * ring);
  const ink = Math.min(1, Math.max(0, (f + 6) / 5));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `translateY(-50%) scale(${sx}, ${sy}) rotate(${tilt}deg)`,
        opacity: ink,
        zIndex,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      <RiseArrow color={color} landed={f >= 0} frame={frame} />
      <div
        style={{
          position: "relative",
          background: color,
          border: `11px solid ${kidTheme.ink}`,
          borderRadius: kidRadius.banner,
          padding: "20px 74px",
          fontSize: 116,
          fontWeight: 900,
          letterSpacing: 2,
          lineHeight: 1.02,
          color: kidTheme.paper,
          WebkitTextStroke: `6px ${kidTheme.ink}`,
          paintOrder: "stroke",
          boxShadow: kidShadow(1.3),
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** The fat arrow behind the stamp, climbing on a loop. */
const RiseArrow: React.FC<{ color: string; landed: boolean; frame: number }> = ({
  color,
  landed,
  frame,
}) => (
  <svg
    width={520}
    height={620}
    viewBox="-260 -310 520 620"
    style={{ position: "absolute", pointerEvents: "none" }}
    overflow="visible"
  >
    {[0, 1, 2].map((i) => {
      // Each arrow climbs its own third of a two-second loop and fades out at
      // the top: the rule is not a static badge, it is a thing going up.
      const u = landed ? ((frame / 60 + i / 3) % 1) : 0;
      return (
        <g
          key={i}
          transform={`translate(0 ${180 - u * 420})`}
          opacity={(landed ? Math.sin(u * Math.PI) : 0.85) * 0.55}
        >
          <path
            d="M -66 150 L -66 -30 L -132 -30 L 0 -190 L 132 -30 L 66 -30 L 66 150 Z"
            fill={color}
            stroke={kidTheme.ink}
            strokeWidth={12}
            strokeLinejoin="round"
          />
        </g>
      );
    })}
  </svg>
);

// ---------------------------------------------------------------------------
// Scenery: the wide world (cold open, Scene 31) and the grass world (Act One)
// ---------------------------------------------------------------------------

/**
 * A scenery layer that extends far past the frame on every side. An `<svg>`
 * clips to its own viewport, so a plain full-frame one loses its edges the
 * moment a scene pulls out below 1×. Draw in ordinary composition coordinates.
 */
export const WIDE = { x: -1200, y: -600, w: 4400, h: 2400 } as const;

export const WideLayer: React.FC<{
  opacity?: number;
  zIndex?: number;
  children: React.ReactNode;
}> = ({ opacity = 1, zIndex, children }) => (
  <svg
    width={WIDE.w}
    height={WIDE.h}
    viewBox={`${WIDE.x} ${WIDE.y} ${WIDE.w} ${WIDE.h}`}
    style={{
      position: "absolute",
      left: WIDE.x,
      top: WIDE.y,
      opacity,
      zIndex,
      pointerEvents: "none",
    }}
  >
    {children}
  </svg>
);

/**
 * Ground height of the hill at composition `x` — a single broad crest.
 *
 * Exported because the kid has to *stand* on it and the kite has to *land* on
 * it, in two scenes five minutes apart. A hand-picked ground line drifts from
 * the drawn surface the moment either is nudged; this cannot, because `Hill`
 * draws the same function it hands out.
 */
export function hillY(x: number, crest = 640): number {
  const u = (x - 1250) / 1500;
  return crest - 26 + 300 * u * u;
}

function hillPath(crest: number, dy: number): string {
  const pts: string[] = [];
  for (let x = WIDE.x; x <= WIDE.x + WIDE.w; x += 120) {
    pts.push(`${x} ${(hillY(x, crest) + dy).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} L ${WIDE.x + WIDE.w} ${WIDE.y + WIDE.h} L ${WIDE.x} ${WIDE.y + WIDE.h} Z`;
}

/**
 * The hill: the cold open's geography, and Scene 31's, which is the same shot
 * five minutes later. One component so the two framings cannot drift — the
 * whole ending depends on the audience recognising the picture.
 *
 * `wind` is 0 for the entire cold open and the entire first act. That is not
 * laziness: the episode's premise is that there is no wind today, and a hill of
 * gently waving grass would contradict the narration in the first ten seconds.
 */
/**
 * Scenery greens, sampled off the painted plates rather than taken from
 * `kidTheme`. Any SVG ground that shares an edge with a plate uses these.
 *
 * `kidTheme.grass` (#5ccc63) is a *blue*-green, and against a gouache plate
 * whose meadows average #a6c013 it read as a different show's hill pasted onto
 * this one's sky. The characters keep the theme palette — nothing green is a
 * character in these two scenes — and the scenery matches the painting. This
 * is the palette-clash failure the retrofit was watching for, and it is worth
 * checking on any surface that shares an edge with a plate.
 */
export const PAINTED_GREEN = {
  /** Sunlit grass, as the plates paint it. */
  lit: "#9dbf2a",
  /** The shaded side of a slope. */
  shade: "#6d9418",
  /** Tufts, hedges, tree crowns — the darkest green in the set. */
  deep: "#5d8214",
} as const;

export const Hill: React.FC<{ wind?: number; crest?: number }> = ({
  wind = 0,
  crest = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer>
      {/* The far hills that used to be here (two flat shapes at crest+96 and
          crest+210) are in `hill_day.webp` now — the plate is panned up so its
          distant ridge sits just above this crest. What cannot come from the
          plate is the hill anybody *stands* on: `hillY` is a load-bearing
          function (the kid's feet, the kite's landing, Scene 31's whole frame
          story), so the near hill stays drawn. */}
      <path d={hillPath(crest, 0)} fill={PAINTED_GREEN.lit} />
      <path d={hillPath(crest, 190)} fill={PAINTED_GREEN.shade} opacity={0.35} />
      {/* Tufts along the crest, in two sizes so the surface has a texture and
          not a fringe. Perfectly still at wind 0 — "unnaturally still" is a
          staging note, not a mood. */}
      {Array.from({ length: 74 }, (_, i) => {
        const x = -320 + i * 46 + ((i * 53) % 23);
        const lean = wind * Math.sin(t * 1.6 + i * 0.7) * 16;
        const h = 26 + ((i * 97) % 30);
        const base = hillY(x, crest) + 16 + ((i * 37) % 90);
        return (
          <path
            key={i}
            d={`M ${x} ${base} q ${7 + lean} ${-h * 0.6} ${2 + lean * 1.6} ${-h}`}
            stroke={PAINTED_GREEN.deep}
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
            opacity={0.42}
          />
        );
      })}
    </WideLayer>
  );
};

/**
 * The grass world: Act One's geography, at Puff's scale, where blades are
 * green skyscrapers. Two layers — `back` behind the characters and `front` in
 * front of them — so a scene sandwiches its cast inside the grass rather than
 * standing them on a backdrop.
 *
 * `wind` is nearly zero all through Act One (there is no wind yet); the small
 * residual keeps the frame from reading as a photograph.
 */
export const GrassWorld: React.FC<{
  layer?: "back" | "front";
  /** Soil line in composition px. */
  ground?: number;
  wind?: number;
  dx?: number;
  seed?: number;
  /**
   * Keep the *front* layer off these bits of frame. A blade drawn in front of
   * a character reads as a bar across their face, and Puff at forty percent
   * loses to it every time — he is the one thing on screen that cannot afford
   * to be occluded. Pass a mark's x and a radius; anything closer is dropped.
   */
  avoid?: Array<{ x: number; r: number }>;
}> = ({ layer = "back", ground = 1120, wind = 0.06, dx = 0, seed = 0, avoid }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const front = layer === "front";
  const count = front ? 9 : 26;
  return (
    <WideLayer zIndex={front ? 30 : undefined}>
      <g transform={`translate(${dx} 0)`}>
        {!front ? (
          <rect
            x={WIDE.x}
            y={ground}
            width={WIDE.w}
            height={WIDE.y + WIDE.h - ground}
            fill={kidTheme.earth}
          />
        ) : null}
        {Array.from({ length: count }, (_, i) => {
          const k = i + seed * 13 + (front ? 100 : 0);
          const x = front ? -300 + i * 280 + ((k * 61) % 90) : -400 + i * 108 + ((k * 71) % 60);
          if (front && avoid?.some((a) => Math.abs(x - a.x) < a.r)) return null;
          const h = front ? 1500 + ((k * 137) % 420) : 700 + ((k * 173) % 640);
          const w = front ? 78 + ((k * 29) % 34) : 30 + ((k * 41) % 26);
          // Two-part sway so a blade bends rather than pivoting.
          const s = wind * (12 + (k % 5) * 4) * Math.sin(t * 1.2 + k * 0.6);
          const tip = s * 2.6;
          const shade = front
            ? k % 2
              ? "#2e8f3e"
              : kidTheme.grassDark
            : k % 3 === 0
              ? kidTheme.grassDark
              : k % 3 === 1
                ? "#4fbb58"
                : "#6ad673";
          return (
            <path
              key={k}
              d={
                `M ${x - w / 2} ${ground + 40}` +
                ` Q ${x - w * 0.34 + s} ${ground - h * 0.55} ${x + tip} ${ground - h}` +
                ` Q ${x + w * 0.34 + s} ${ground - h * 0.55} ${x + w / 2} ${ground + 40} Z`
              }
              fill={shade}
              opacity={front ? 0.96 : 0.92}
            />
          );
        })}
      </g>
    </WideLayer>
  );
};

/**
 * The sanctioned fix for a Puff who is hard to find: darken the world behind
 * him. A soft elliptical shadow, sold in-fiction as the shade between two
 * blades or the underside of a leaf.
 *
 * This exists because the alternative — nudging his `opacity` up for one shot —
 * silently breaks the arc script.md spends the episode drawing. Use this.
 */
export const SoftShade: React.FC<{
  x: number;
  y: number;
  rx?: number;
  ry?: number;
  strength?: number;
  color?: string;
}> = ({ x, y, rx = 520, ry = 400, strength = 0.32, color = "22,68,34" }) => (
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
// Recurring props — the kite and the kid bracket the whole episode
// ---------------------------------------------------------------------------

/**
 * The red kite. Diamond, cross-sparred, with a bow tail — the most legible
 * machine in the episode, and the entire emotional readout of the ending
 * (script.md, Scene 31: "legible from across a room").
 *
 * `rot` is the kite's own tilt; `flat` lies it in the grass. Both ends of the
 * episode use this component, which is the point: Scene 31 has to be the same
 * kite as Scene 1 or the frame story does not close.
 */
export const Kite: React.FC<{
  x: number;
  y: number;
  scale?: number;
  /** Degrees. 0 is nose-up. */
  rot?: number;
  /** Lying in the grass: flattened, seen nearly edge-on. */
  flat?: boolean;
  /** Tail liveliness 0..1 — 0 for a kite on the ground. */
  life?: number;
  opacity?: number;
  zIndex?: number;
}> = ({ x, y, scale = 1, rot = 0, flat = false, life = 1, opacity = 1, zIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const w = 128;
  const h = 176;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        // The squash is applied *before* the rotation, i.e. in screen space:
        // a kite lying in the grass is flattened towards the ground, not
        // foreshortened along its own spar.
        transform: `translate(-50%, -50%) scaleY(${flat ? 0.42 : 1}) scale(${scale}) rotate(${rot}deg)`,
        opacity,
        zIndex,
        pointerEvents: "none",
      }}
    >
      <svg width={340} height={520} viewBox="-170 -220 340 520" overflow="visible">
        {/* Tail: five bows on a string, each lagging the one above it. */}
        <g>
          {Array.from({ length: 5 }, (_, i) => {
            const u = (i + 1) / 5;
            const sway = life * Math.sin(t * 2.4 - u * 2.1) * (18 + u * 26);
            const ty = h + u * 200;
            return (
              <g key={i} transform={`translate(${sway} ${ty})`}>
                <ellipse
                  rx={26}
                  ry={13}
                  fill={i % 2 ? kidTheme.sun : kidTheme.paper}
                  stroke={kidTheme.ink}
                  strokeWidth={6}
                  transform={`rotate(${sway * 0.6})`}
                />
              </g>
            );
          })}
          <path
            d={
              `M 0 ${h}` +
              Array.from({ length: 5 }, (_, i) => {
                const u = (i + 1) / 5;
                const sway = life * Math.sin(t * 2.4 - u * 2.1) * (18 + u * 26);
                return ` L ${sway} ${h + u * 200}`;
              }).join("")
            }
            stroke={kidTheme.ink}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            opacity={0.8}
          />
        </g>
        {/* Sail: four panels, two shades, so the diamond reads as a kite and
            not as a playing card. */}
        <path d={`M 0 ${-h} L ${w} 0 L 0 ${h} L ${-w} 0 Z`} fill={kidTheme.tomato} />
        <path d={`M 0 ${-h} L ${w} 0 L 0 0 Z`} fill="#ff8b7d" />
        <path d={`M 0 0 L ${-w} 0 L 0 ${h} Z`} fill="#e04a3e" />
        <path
          d={`M 0 ${-h} L ${w} 0 L 0 ${h} L ${-w} 0 Z`}
          fill="none"
          stroke={kidTheme.ink}
          strokeWidth={10}
          strokeLinejoin="round"
        />
        <path
          d={`M 0 ${-h} L 0 ${h} M ${-w} 0 L ${w} 0`}
          stroke={kidTheme.ink}
          strokeWidth={7}
          opacity={0.75}
        />
      </svg>
    </div>
  );
};

/** The line from a hand to a kite. `slack` 0 is taut, 1 hangs on the ground. */
export const KiteString: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  slack?: number;
  /** Frames of thrum after the line goes tight. */
  thrumFrom?: number;
}> = ({ from, to, slack = 0, thrumFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const sag = slack * len * 0.55;
  // A tight line hums: a small standing wave across the middle of the string.
  const since = thrumFrom === undefined ? -1 : frame - thrumFrom;
  const thrum =
    since >= 0 ? Math.sin(since * 1.5) * 9 * Math.exp(-since / (fps * 1.6)) : 0;
  const mx = (from.x + to.x) / 2 - (dy / (len || 1)) * thrum;
  const my = (from.y + to.y) / 2 + sag + (dx / (len || 1)) * thrum;
  return (
    <WideLayer>
      <path
        d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
        stroke={kidTheme.ink}
        strokeWidth={4}
        fill="none"
        opacity={0.6}
      />
    </WideLayer>
  );
};

/**
 * The kid, in silhouette. No face, ever, and not one word all episode — the
 * kite is the entire emotional readout, so the body has exactly four knobs and
 * nothing else.
 *
 * `hand` reports where the string is held, in composition coordinates, so the
 * kite line always starts in the right place whatever the pose.
 */
export type KidPose = {
  /** Lean and stride, 0..1. */
  run?: number;
  /** Shoulders down, 0..1. This is the cold open's whole second beat. */
  slump?: number;
  /** Both arms up — the ending, and the only time it happens. */
  armsUp?: number;
};

export const KidSilhouette: React.FC<
  KidPose & { x: number; y: number; scale?: number; flip?: boolean; opacity?: number }
> = ({ x, y, scale = 1, flip = false, opacity = 0.92, run = 0, slump = 0, armsUp = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // A running stride, only while running.
  const stride = run > 0.02 ? Math.sin(t * 11) * 30 * run : 0;
  const lean = run * 13;
  const drop = slump * 30;
  const armAngle = -110 * armsUp;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 260,
        height: CHAR_BOX.kid,
        marginLeft: -130,
        marginTop: -CHAR_BOX.kid / 2,
        transformOrigin: "50% 100%",
        transform: `scale(${scale}) ${flip ? "scaleX(-1)" : ""}`,
        opacity,
        pointerEvents: "none",
      }}
    >
      <svg width={260} height={CHAR_BOX.kid} viewBox="-130 -210 260 420" overflow="visible">
        <g transform={`rotate(${lean} 0 200)`}>
          {/* Legs. */}
          <path
            d={`M 0 40 L ${-26 - stride * 0.5} 200`}
            stroke={kidTheme.ink}
            strokeWidth={30}
            strokeLinecap="round"
          />
          <path
            d={`M 0 40 L ${26 + stride * 0.5} 200`}
            stroke={kidTheme.ink}
            strokeWidth={30}
            strokeLinecap="round"
          />
          {/* Body. */}
          <path
            d={`M -42 ${-70 + drop} Q 0 ${-96 + drop} 42 ${-70 + drop} L 34 56 L -34 56 Z`}
            fill={kidTheme.ink}
          />
          {/* Arms. The string hand is the character-right one. */}
          <g transform={`translate(34 ${-56 + drop}) rotate(${armAngle - 24 - run * 26})`}>
            <path d="M 0 0 L 0 118" stroke={kidTheme.ink} strokeWidth={26} strokeLinecap="round" />
          </g>
          <g transform={`translate(-34 ${-56 + drop}) rotate(${-armAngle + 20 + run * 30})`}>
            <path d="M 0 0 L 0 112" stroke={kidTheme.ink} strokeWidth={26} strokeLinecap="round" />
          </g>
          {/* Head, with a scruff of hair so the silhouette is a child. */}
          <circle cx={0} cy={-120 + drop * 1.5} r={52} fill={kidTheme.ink} />
          <path
            d={`M -50 ${-146 + drop * 1.5} q 26 -34 60 -22 q 30 10 40 30`}
            stroke={kidTheme.ink}
            strokeWidth={26}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};

/**
 * Where the kid's string hand is, in composition coordinates, for the pose
 * given. Kept next to the component because it is derived from the same
 * numbers: the arm is 118 long off a shoulder at (34, -56).
 */
export function kidHand(
  x: number,
  y: number,
  scale = 1,
  pose: KidPose = {},
): { x: number; y: number } {
  const a = ((-110 * (pose.armsUp ?? 0) - 24 - (pose.run ?? 0) * 26) * Math.PI) / 180;
  const sx = 34 + Math.sin(a) * -118;
  const sy = -56 + (pose.slump ?? 0) * 30 + Math.cos(a) * 118;
  return { x: x + sx * scale, y: y + sy * scale };
}

// ---------------------------------------------------------------------------
// Recurring props — the two creatures who cannot see him
// ---------------------------------------------------------------------------

type CreatureProps = {
  x: number;
  y: number;
  scale?: number;
  phase?: number;
  speaking?: boolean;
  look?: LookDirection;
  emotion?: EmotionInput;
  /** Eye life. Drop it towards 0 for a creature holding a blank stare. */
  eyeLife?: number;
  idle?: number;
  zIndex?: number;
};

const BEETLE_SHELL = "#4a3f6e";
const BEETLE_LIGHT = "#6b5c99";

/**
 * The beetle. Round, shiny, extremely calm, and — this is the part that has to
 * be staged rather than implied — completely unable to see Puff.
 *
 * Fires three times: Scenes 4, 32 and (as the leaf) 5. Same size in frame every
 * time.
 */
export const Beetle: React.FC<CreatureProps> = (props) => {
  const rig = useRig({ ...props, idle: props.idle ?? 0.6 });
  return (
    <CreatureFrame rig={rig} {...props} box={CHAR_BOX.beetle}>
      {/* Legs, three a side, doing nothing. */}
      {[-1, 1].map((s) =>
        [0, 1, 2].map((i) => (
          <path
            key={`${s}-${i}`}
            d={`M ${s * 60} ${4 + i * 26} q ${s * 40} ${6 + i * 4} ${s * 52} ${34 + i * 10}`}
            stroke={kidTheme.ink}
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
          />
        )),
      )}
      {/* Antennae, with a ball on the end. */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <path
            d={`M ${s * 34} -76 q ${s * 30} -44 ${s * 62} -58`}
            stroke={kidTheme.ink}
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={s * 96} cy={-134} r={11} fill={kidTheme.ink} />
        </g>
      ))}
      <ellipse cx={0} cy={6} rx={104} ry={92} fill={BEETLE_SHELL} stroke={kidTheme.ink} strokeWidth={9} />
      {/* Shell seam and a hard highlight: "shiny" is one shape, not a gradient. */}
      <path d="M 0 -84 L 0 96" stroke={kidTheme.ink} strokeWidth={7} opacity={0.55} />
      <ellipse cx={-46} cy={-46} rx={30} ry={19} fill={BEETLE_LIGHT} opacity={0.9} transform="rotate(-24 -46 -46)" />
      <Face
        rig={rig}
        x={0}
        y={16}
        size={1.18}
        eyeScale={0.94}
        skin={BEETLE_SHELL}
        blushColor="#ff9bb6"
        blushStrength={1.6}
      />
    </CreatureFrame>
  );
};

/**
 * The leaf. Scene 5's creature, staged identically to Scene 4's beetle — same
 * framing, same distance, same everything, because script.md wants the audience
 * to feel the repeat before they hear it.
 */
export const Leaf: React.FC<CreatureProps> = (props) => {
  const rig = useRig({ ...props, idle: props.idle ?? 0.6 });
  return (
    <CreatureFrame rig={rig} {...props} box={CHAR_BOX.leaf}>
      <g transform="rotate(-12)">
        <path
          d="M 0 -128 C 96 -84 118 34 0 128 C -118 34 -96 -84 0 -128 Z"
          fill={kidTheme.grass}
          stroke={kidTheme.grassDark}
          strokeWidth={10}
          strokeLinejoin="round"
        />
        <path d="M 0 -120 L 0 124" stroke={kidTheme.grassDark} strokeWidth={9} opacity={0.7} />
        {[-74, -30, 16, 62].map((vy) => (
          <g key={vy}>
            <path
              d={`M 0 ${vy} q 32 6 54 34`}
              stroke={kidTheme.grassDark}
              strokeWidth={6}
              fill="none"
              opacity={0.55}
            />
            <path
              d={`M 0 ${vy} q -32 6 -54 34`}
              stroke={kidTheme.grassDark}
              strokeWidth={6}
              fill="none"
              opacity={0.55}
            />
          </g>
        ))}
      </g>
      <Face
        rig={rig}
        x={0}
        y={-4}
        size={1.1}
        eyeScale={0.94}
        skin={kidTheme.grass}
        blushColor="#ff8fae"
        blushStrength={1.4}
      />
    </CreatureFrame>
  );
};

/** Shared positioning frame for the cameo creatures. */
const CreatureFrame: React.FC<
  CreatureProps & { rig: ReturnType<typeof useRig>; box: number; children: React.ReactNode }
> = ({ rig, box, x, y, scale = 1, zIndex, children }) => {
  const p = rig.placement;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: box,
        height: box,
        marginLeft: -box / 2,
        marginTop: -box / 2,
        transformOrigin: "50% 100%",
        transform: `translate(${p.dx}px, ${p.dy + rig.squash.dy}px) scale(${scale * rig.squash.sx * p.scaleX}, ${scale * rig.squash.sy * p.scaleY})`,
        opacity: p.opacity,
        zIndex,
      }}
    >
      <svg width={box} height={box} viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} overflow="visible">
        {children}
      </svg>
    </div>
  );
};

/**
 * Puff-coloured motion arcs: the shape of moving air, used wherever the
 * episode needs to draw the invisible thing without drawing Puff. Scene 8's
 * hand-wave is nothing but these.
 */
export const AirArcs: React.FC<{
  x: number;
  y: number;
  scale?: number;
  /** Degrees; the direction the air is travelling. */
  rot?: number;
  strength?: number;
  count?: number;
  phase?: number;
  color?: string;
}> = ({ x, y, scale = 1, rot = 0, strength = 1, count = 3, phase = 0, color = kidTheme.airEdge }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (strength <= 0.02) return null;
  return (
    <svg
      style={{ position: "absolute", left: x, top: y, overflow: "visible" }}
      width={1}
      height={1}
    >
      <g transform={`rotate(${rot}) scale(${scale})`}>
        {Array.from({ length: count }, (_, i) => {
          const r = 90 + i * 54;
          const wob = 0.7 + 0.3 * Math.sin(t * 2.2 + i * 1.3 + phase);
          return (
            <path
              key={i}
              d={`M ${-r * 0.55} ${-70 - i * 16} Q ${r * 0.4} ${-96 - i * 20} ${r} ${-30 - i * 12} Q ${r * 0.5} ${20 + i * 6} ${-r * 0.35} ${4 + i * 8}`}
              stroke={color}
              strokeWidth={14 - i * 3}
              strokeLinecap="round"
              fill="none"
              opacity={strength * (0.72 - i * 0.16) * wob}
            />
          );
        })}
      </g>
    </svg>
  );
};

/**
 * The painted world under a scene — episode two's Tier-2 backdrop, and the one
 * every staged scene starts with.
 *
 *   <PaintedSky bg="grass_low" phase={1.1} />
 *
 * `bg` is a key from `backgrounds.mjs`, resolved through the generated
 * manifest, so a scene naming a world that was never generated fails to
 * typecheck rather than rendering a blank frame.
 *
 * Three rules a scene has to keep in mind:
 *
 *   - **Pass a different `phase` per scene.** Same reason characters get one:
 *     two consecutive scenes drifting in lockstep read as one long shot with a
 *     cut in it.
 *   - **The plate is scenery, and only scenery.** Anything that moves, gets
 *     touched, or has to line up with a character's feet stays SVG on top —
 *     the grass blades, the waves, the turbine rotors, the dandelions, the
 *     kite. See the notes in `backgrounds.mjs`.
 *   - **`drift={0}` is a staging decision, not an optimisation.** The cold open
 *     and the title card are written as "perfectly, unnaturally still", and a
 *     sky breathing behind them would say there was wind.
 */
export const PaintedSky: React.FC<
  Omit<KidPaintedBackdropProps, "src"> & { bg: BackgroundKey }
> = ({ bg, ...rest }) => (
  <KidPaintedBackdrop src={staticFile(BACKGROUNDS[bg])} {...rest} />
);

// `SkyBlend` (a crossfade between two gradient `KidBackdrop`s) used to live
// here and every world scene in the episode opened with it. The painted plates
// replaced all thirty-three of those call sites, so it is gone rather than left
// lying around: the two scenes that still want flat colour are a crayon diagram
// (Scene 14) and the recap's four-way split (Scene 33), and both draw their own
// gradient because what they want is a *surface*, not a sky. `KidBackdrop`
// itself is still the fallback for an unstaged scene (see `ScenePlaceholder`).

/** The cartoon thermometer. `level` is 0..1 of the tube. */
export const Thermometer: React.FC<{
  x: number;
  y: number;
  level: number;
  scale?: number;
  label?: string;
}> = ({ x, y, level, scale = 1, label }) => {
  const frame = useCurrentFrame();
  const u = Math.max(0, Math.min(1, level));
  const tubeTop = -230;
  const tubeBottom = 120;
  const fillTop = tubeBottom - (tubeBottom - tubeTop) * u;
  const shake = Math.sin(frame * 0.9) * 3 * u * u;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${shake}deg)`,
      }}
    >
      <svg width={220} height={520} viewBox="-110 -270 220 520" overflow="visible">
        <g stroke={kidTheme.ink} strokeWidth={9} strokeLinecap="round">
          <rect
            x={-34}
            y={tubeTop}
            width={68}
            height={tubeBottom - tubeTop + 40}
            rx={34}
            fill={kidTheme.paper}
          />
          <circle cx={0} cy={148} r={62} fill={kidTheme.paper} />
        </g>
        <rect x={-19} y={fillTop} width={38} height={tubeBottom - fillTop + 60} rx={19} fill={kidTheme.tomato} />
        <circle cx={0} cy={148} r={46} fill={kidTheme.tomato} />
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const ty = tubeBottom - (tubeBottom - tubeTop) * p;
          return (
            <path
              key={p}
              d={`M 36 ${ty} L ${p === 0 || p === 1 ? 84 : 66} ${ty}`}
              stroke={kidTheme.ink}
              strokeWidth={8}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -70,
            transform: "translateX(-50%)",
            fontSize: kidType.min,
            fontWeight: 900,
            letterSpacing: 2,
            color: kidTheme.ink,
            textShadow: kidOutline(4),
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** A caption card — gag furniture, not a caption; the kids' series has none. */
export const CaptionCard: React.FC<{
  text: string;
  from?: number;
  until?: number;
  y?: number;
  color?: string;
  align?: "left" | "center" | "right";
}> = ({ text, from = 0, until, y = 150, color = kidTheme.paper, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 12, mass: 0.6 } });
  const out = until === undefined ? 0 : Math.max(0, Math.min(1, (frame - until) / 6));
  const scale = s * (1 - out);
  if (scale <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent:
          align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        padding: align === "center" ? 0 : "0 96px",
        transform: `translateY(-50%) scale(${scale})`,
        zIndex: 45,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: color,
          border: `9px solid ${kidTheme.ink}`,
          borderRadius: kidRadius.card,
          padding: "16px 56px",
          fontSize: kidType.title * 0.62,
          fontWeight: 900,
          color: kidTheme.ink,
          boxShadow: kidShadow(1.2),
          transform: `rotate(${-1.5 + (1 - s) * 5}deg)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Placeholder scenes (Acts Two and Three, and the recap, until they are built)
// ---------------------------------------------------------------------------

const PLACEHOLDER_MARKS: Record<Exclude<Speaker, "narrator">, Mark> = {
  puff: { x: 470, y: hover("puff", 620, 1.2), scale: 1.2, who: "puff" },
  cloudia: { x: 980, y: stand("cloudia", 600), scale: 0.9, who: "cloudia" },
  sunny: { x: 1520, y: stand("sunny", 880), scale: 0.9, who: "sunny" },
  drip: { x: 1180, y: stand("drip", 940), scale: 0.8, who: "drip" },
};

/**
 * Stand-in for a scene nobody has staged yet: the real dialogue, in the real
 * voices, with the real timing, and every character on stage mouthing their own
 * lines — just no direction. Drop the finished scene into its act's map and the
 * timeline does not move by a frame.
 *
 * Puff is drawn here at Act One's forty percent regardless of where the scene
 * sits in the arc. That is deliberate: a placeholder should not quietly assert
 * a number the staged scene has to match.
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
      {cast.includes("puff") ? <PlaceholderPuff scene={scene} cast={marks} /> : null}
      {cast.includes("cloudia") ? <PlaceholderCloudia scene={scene} cast={marks} /> : null}
      {cast.includes("sunny") ? <PlaceholderSunny scene={scene} cast={marks} /> : null}
      {cast.includes("drip") ? <PlaceholderDrip scene={scene} cast={marks} /> : null}
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

const PlaceholderPuff: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Puff
    x={PLACEHOLDER_MARKS.puff.x}
    y={PLACEHOLDER_MARKS.puff.y}
    scale={1.2}
    opacity={PUFF_OPACITY.actOne}
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
    clipboard
    speaking={useSpeaking(scene, "cloudia")}
    look={useLookAtSpeaker(scene, cast, "cloudia")}
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

// Re-exported so an act file needs one import for the whole kit.
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
};
export type { TimedScene };
