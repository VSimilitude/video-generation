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
  Cloudia,
  Drip,
  Face,
  KidBackdrop,
  KidContactShadow,
  Puff,
  SpeechBubble,
  Sunny,
  EMOTION_EASE,
  RAY_SHARD_BOX,
  blueRicochet,
  blueTrail,
  kidEase,
  kidInkOutline,
  kidOutline,
  kidTheme,
  kidType,
  lineKeyOf,
  lookAt,
  makeBodyGeometry,
  makeShard,
  makeVolcano,
  makeWideLayer,
  mixHex,
  shardOf,
  useRig,
  volcanoFace,
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
import { BOOM_BOX, BOOM_R, Boom, boomGrow, distanceForCount } from "./Boom";
import { FLASH_FRAMES, Flash, FlashSky, flashLevel } from "./Flash";
import { KidAtWindow } from "./Kid";

// Shared kit for "Boom and the One, Two, Three" — Little Big World, episode
// six (`storm`).
//
// Same shape as episodes two through five, deliberately — an act file written
// against ep 5's common reads identically here. What is genuinely this
// episode's:
//
//   the cast      `Speaker`/`Stage`, `PHASE`, `CHAR_BOX`, and three new bodies
//                 in their own files: `Boom` (Boom.tsx), `Flash` (Flash.tsx),
//                 the kid's two new poses with THE COUNTABLE FINGERS (Kid.tsx)
//   the timing    `turnsOf` bound to this manifest — with the optional per-key
//                 `volumes` — and THE COUNT GRID (`countGap`, `fingersAt`,
//                 `countRuns`), the episode's production gate
//   the worlds    `GardenWorld` (the coastal wide), `WindowWorld` (the stage
//                 for acts two and three), `HotelWorld` (the lobby, the tower,
//                 the penthouse) — and the horizon every coastal wide shares:
//                 the volcano AWAKE with Ember's island beside him
//   the hotel     the tower outside (`HotelTower`) and in section
//                 (`TowerSection`), the guests (`DropGuests`, `HailCrowd`,
//                 `Stony`), Cloudia's standing-up hair (`StaticHair`)

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// ---------------------------------------------------------------------------
// The cast
// ---------------------------------------------------------------------------

/**
 * **Every voice in the show.** `narrator` is off-stage: no body, no bubble.
 * `volcano` is the ep-5 mountain, awake, with ONE line (CUTTABLE).
 */
export type Speaker =
  | "narrator"
  | "boom"
  | "cloudia"
  | "sunny"
  | "drip"
  | "puff"
  | "blue"
  | "volcano";

/**
 * Bodies with no voice, ever. `flash` (the lightning — the zero replies are
 * the physics), `violet` (one silent garnish, Scene 12), `kid` (silhouette),
 * the hail crowd and `stony` (named, silent, the same body three times).
 */
export type VisualSpeaker = "kid" | "flash" | "violet" | "hail" | "stony";

export type Stage = Speaker | VisualSpeaker;

/** Per-character cycle offsets. Returning cast keep their ep-5 numbers. */
export const PHASE: Record<Stage, number> = {
  narrator: 0,
  boom: 4.4,
  cloudia: 1.9,
  sunny: 3.4,
  drip: 2.6,
  puff: 1.4,
  volcano: 5.5,
  kid: 7.4,
  flash: 0,
  hail: 6.1,
  stony: 0.8,
  blue: shardOf("blue").phase,
  violet: shardOf("violet").phase,
};

const VOICES = new Set<string>(["boom", "cloudia", "sunny", "drip", "puff", "blue", "volcano"]);
const SILENT = new Set<string>(["flash", "violet", "kid", "hail", "stony"]);

/**
 * `a1_48_boom` -> `boom`. A key that names a silent body throws: Flash has
 * never finished a sentence in her life, Violet never gets one, and the kid is
 * six episodes into not speaking.
 */
export function speakerOf(lineKey: string): Speaker {
  const tail = lineKey.split("_").slice(2).join("_");
  if (SILENT.has(tail)) {
    throw new Error(`[storm] "${lineKey}": ${tail} never speaks — see Speaker in scenes/common.tsx.`);
  }
  return VOICES.has(tail) ? (tail as Speaker) : "narrator";
}

/**
 * Turn list for a scene, straight from script.md's line keys. The last turn
 * gets `gapFrames: 0` unless the script asked for one explicitly (a trailing
 * gap would stack with the tail). `volumes` is the per-key instance volume
 * (`TimedTurn.volume`) — the far thunder is the SAME clip, quieter.
 */
export function turnsOf(
  keys: string[],
  opts?: { gap?: number; gaps?: Record<string, number>; volumes?: Record<string, number> },
): DialogueTurn[] {
  return keys.map((key, i) => {
    const clip = NARRATION[key];
    if (!clip) throw new Error(`[storm] no narration clip for "${key}"`);
    const explicit = opts?.gaps?.[key];
    const gapFrames =
      explicit !== undefined ? explicit : i === keys.length - 1 ? 0 : opts?.gap;
    const volume = opts?.volumes?.[key];
    return {
      clip,
      speaker: speakerOf(key),
      gapFrames,
      ...(volume !== undefined ? { volume } : {}),
    };
  });
}

// ---------------------------------------------------------------------------
// THE COUNT GRID — the episode's production gate
// ---------------------------------------------------------------------------
//
// script.md: "each number clip plus its gap totals exactly 30 frames, so three
// counts on screen are genuinely three seconds and the ruler is honest. That is
// a production gate, not a taste call." The edit pass ruled it an ONSET grid:
// kokoro pads every number clip with ~13f of leading and ~16f of trailing
// silence (clips are 38–43f), so `gap = 30 − clipFrames` is NEGATIVE (−8 to
// −13) and consecutive numbers overlap in silence. Every number therefore
// STARTS exactly 30f after the last one. `countGap` computes it from the
// manifest — never hand-typed — and `Video.tsx` asserts the sum at load.

/** One count, in frames. One second. */
export const COUNT_GRID = 30;

/**
 * The spoken word's onset inside every number clip, MEASURED (Remotion's
 * ffmpeg `silencedetect -35dB`, skeleton wave): 0.418–0.443s, i.e. 12.5–13.3f
 * for all ten recordings. The finger starts rising on the clip's first frame
 * and is fully up by the time the word is heard.
 */
export const COUNT_VOICE_LEAD = 13;

/** The ten recordings: "One." … "Nine." are co_15–co_23, "Ten." is a3_60. */
const COUNT_SOURCE: Record<string, number> = {
  co_15_narrator: 1,
  co_16_narrator: 2,
  co_17_narrator: 3,
  co_18_narrator: 4,
  co_19_narrator: 5,
  co_20_narrator: 6,
  co_21_narrator: 7,
  co_22_narrator: 8,
  co_23_narrator: 9,
  a3_60_narrator: 10,
};

/**
 * The forty-two count aliases, key → its source (mirrors narration.mjs's
 * `sameAs`; script.md's count ledger). `a2_15_narrator` "Six." is DIALOGUE,
 * aliased for wording only, and sits OFF the grid — it is deliberately absent.
 */
const COUNT_ALIAS: Record<string, string> = {
  a1_56_narrator: "co_21_narrator",
  a1_57_narrator: "co_22_narrator",
  a1_58_narrator: "co_23_narrator",
  a2_06_narrator: "co_15_narrator",
  a2_07_narrator: "co_16_narrator",
  a2_08_narrator: "co_17_narrator",
  a2_09_narrator: "co_18_narrator",
  a2_10_narrator: "co_19_narrator",
  a2_11_narrator: "co_20_narrator",
  a2_22_narrator: "co_15_narrator",
  a2_23_narrator: "co_16_narrator",
  a2_24_narrator: "co_17_narrator",
  a2_50_narrator: "co_15_narrator",
  a2_51_narrator: "co_16_narrator",
  a2_56_narrator: "co_15_narrator",
  a3_08_narrator: "co_15_narrator",
  a3_09_narrator: "co_16_narrator",
  a3_10_narrator: "co_17_narrator",
  a3_15_narrator: "co_15_narrator",
  a3_16_narrator: "co_16_narrator",
  a3_17_narrator: "co_17_narrator",
  a3_18_narrator: "co_18_narrator",
  a3_19_narrator: "co_19_narrator",
  a3_20_narrator: "co_20_narrator",
  a3_29_narrator: "co_15_narrator",
  a3_30_narrator: "co_16_narrator",
  a3_31_narrator: "co_17_narrator",
  a3_32_narrator: "co_18_narrator",
  a3_33_narrator: "co_19_narrator",
  a3_34_narrator: "co_20_narrator",
  a3_35_narrator: "co_21_narrator",
  a3_36_narrator: "co_22_narrator",
  a3_37_narrator: "co_23_narrator",
  a3_51_narrator: "co_15_narrator",
  a3_52_narrator: "co_16_narrator",
  a3_53_narrator: "co_17_narrator",
  a3_54_narrator: "co_18_narrator",
  a3_55_narrator: "co_19_narrator",
  a3_56_narrator: "co_20_narrator",
  a3_57_narrator: "co_21_narrator",
  a3_58_narrator: "co_22_narrator",
  a3_59_narrator: "co_23_narrator",
};

/** Every count firing (52), key → the number it says. */
export const COUNT_OF: Record<string, number> = {
  ...COUNT_SOURCE,
  ...Object.fromEntries(Object.entries(COUNT_ALIAS).map(([k, src]) => [k, COUNT_SOURCE[src]])),
};

/** How many count firings the script has. `Video.tsx` asserts it. */
export const COUNT_FIRINGS = 52;

// An alias is a byte copy of its source, so its manifest length must equal the
// source's; a mismatch means the table above has drifted from narration.mjs.
for (const [alias, src] of Object.entries(COUNT_ALIAS)) {
  if (NARRATION[alias]?.durationSeconds !== NARRATION[src]?.durationSeconds) {
    throw new Error(`[storm] count alias ${alias} does not match its source ${src} in the manifest`);
  }
}

export function isCountKey(key: string): boolean {
  return key in COUNT_OF;
}

/** The clip's frame length, exactly as `layoutTurns` rounds it. */
export function clipFrames(key: string): number {
  const clip = NARRATION[key];
  if (!clip) throw new Error(`[storm] no narration clip for "${key}"`);
  return Math.ceil(clip.durationSeconds * FPS);
}

/** **The grid gap**: `30 − clipFrames`, computed, never typed. Negative. */
export function countGap(key: string): number {
  if (!isCountKey(key)) throw new Error(`[storm] "${key}" is not a count firing`);
  return COUNT_GRID - clipFrames(key);
}

/** The grid gaps for every count key in a scene's line list. */
export function countGaps(keys: string[]): Record<string, number> {
  return Object.fromEntries(keys.filter(isCountKey).map((k) => [k, countGap(k)]));
}

/**
 * **How many fingers are up**, at a scene-local frame. THE CONTRACT the act
 * builders reuse:
 *
 *   - driven by the count firings' START frames (the onset grid): finger N
 *     begins to rise on the first frame of the clip that says N and is fully
 *     up `COUNT_VOICE_LEAD` (13) frames later, when the word is heard;
 *   - returns a FLOAT 0..10 — pass it straight to `KidAtWindow`'s `fingers`;
 *   - it is the NUMBER said, not a tally of turns, so a scene that rejoins a
 *     count mid-way (Scene 10 rejoins at "Seven.") is right automatically —
 *     pass `before` for the fingers already up when the scene opens (6 there);
 *   - after the last number it HOLDS (the hand stays up through the arrival);
 *     a scene lowers the hand itself, with `fingersDown` or its own ramp;
 *   - it never counts `a2_15_narrator` ("Six." as dialogue — off the grid).
 */
export function fingersAt(
  scene: TimedScene,
  frame: number,
  opts?: { before?: number; from?: number },
): number {
  let value = opts?.before ?? 0;
  for (const turn of scene.turns ?? []) {
    const n = COUNT_OF[lineKeyOf(turn)];
    if (n === undefined) continue;
    if (opts?.from !== undefined && turn.from < opts.from) continue;
    if (frame < turn.from) break;
    const rise = Math.min(1, (frame - turn.from) / COUNT_VOICE_LEAD);
    value = Math.max(value, n - 1 + rise);
  }
  return Math.max(0, Math.min(10, value));
}

/** A count run inside a scene: consecutive number firings. */
export type CountRun = {
  keys: string[];
  /** First clip's start frame (the onset of "One."). */
  from: number;
  /** One grid step after the last number's onset — where the arrival lands. */
  arrive: number;
  /** The last number said. */
  count: number;
};

/** Every count run in a scene, in order (Scene 15 has two). */
export function countRuns(scene: TimedScene): CountRun[] {
  const runs: CountRun[] = [];
  let cur: CountRun | null = null;
  for (const turn of scene.turns ?? []) {
    const key = lineKeyOf(turn);
    const n = COUNT_OF[key];
    if (n === undefined) {
      cur = null;
      continue;
    }
    if (!cur) {
      cur = { keys: [], from: turn.from, arrive: 0, count: 0 };
      runs.push(cur);
    }
    cur.keys.push(key);
    cur.arrive = turn.from + COUNT_GRID;
    cur.count = n;
  }
  return runs;
}

/**
 * Where Flash goes for a count run: `FLASH_BEFORE_COUNT` frames before the
 * run's first clip starts, so her six frames are over before "One." begins and
 * the count measures from her (physics: you start counting at the flash).
 */
export const FLASH_BEFORE_COUNT = 8;
export function flashFor(run: CountRun): number {
  return run.from - FLASH_BEFORE_COUNT;
}

// ---------------------------------------------------------------------------
// Staging: bodies, marks, who is talking
// ---------------------------------------------------------------------------

/** Natural SVG box height of each body (see `makeBodyGeometry`). */
export const CHAR_BOX = {
  boom: BOOM_BOX,
  cloudia: 380,
  sunny: 460,
  drip: 380,
  puff: 340,
  shard: RAY_SHARD_BOX,
  kid: 420,
} as const;
export type Body = keyof typeof CHAR_BOX;
export type Mark = KitMark<Body>;

const geometry = makeBodyGeometry({ box: CHAR_BOX, body: "boom", bubbleLift: 165, faceOffset: { shard: -77 } });
export const { stand, hover, crownOf, midOf, faceOf, bubbleAbove, markCentre, projectMark } = geometry;

export function centreOf(m: Mark): { x: number; y: number } {
  return markCentre(m);
}

export type Cast = Partial<Record<Stage, Mark>>;

/**
 * **Boom's mark**, because his box is a 900px square around a body that is a
 * fraction of it (the rings and far halos need the room), and `crownOf` would
 * put his bubble 300px above his head. `lift` is derived from the body radius
 * `distance` actually draws, so a bubble clears him at every size.
 */
export function boomMark(
  x: number,
  centreY: number,
  scale: number,
  distance: number,
  side?: "left" | "right",
  offset = 300,
): Mark {
  const r = BOOM_R * boomGrow(distance) * scale;
  const y = hover("boom", centreY, scale);
  return { x, y, scale, who: "boom", lift: y - (centreY - r - 120), side, offset };
}

/** Per-line override: "this turn comes out of THAT body". */
export type SpeakerVisual = Record<string, Stage>;

export function stageSpeakerOf(turn: TimedTurn, visual?: SpeakerVisual): Stage {
  return visual?.[lineKeyOf(turn)] ?? (turn.speaker as Stage);
}

export type StageState = {
  current: Stage | null;
  speaking: (who: Stage) => boolean;
  lineKey: string | null;
  frame: number;
};

/**
 * The turn playing at `frame`. **The LATEST-started turn wins** — a change
 * from ep 5's kit, and the count grid is why: a number clip's 16f silent tail
 * overlaps the start of whatever follows it (negative gaps), so first-match
 * would hand Boom's "Present!" to the Narrator for its first twelve frames
 * and his mouth would open late.
 */
export function turnAt(scene: TimedScene, frame: number): TimedTurn | null {
  let live: TimedTurn | null = null;
  for (const t of scene.turns ?? []) {
    if (frame >= t.from && frame < t.from + t.durationInFrames) live = t;
  }
  return live;
}

export function useStage(scene: TimedScene, visual?: SpeakerVisual): StageState {
  const frame = useCurrentFrame();
  const live = turnAt(scene, frame);
  const current = live ? stageSpeakerOf(live, visual) : null;
  return {
    current,
    speaking: (who: Stage) => current === who,
    lineKey: live ? lineKeyOf(live) : null,
    frame,
  };
}

export function useLineKey(scene: TimedScene): string | null {
  const live = turnAt(scene, useCurrentFrame());
  return live ? lineKeyOf(live) : null;
}

/**
 * Per-line emotion for one body (ep 5's, unchanged). **`lead` is `NO_LEAD` on
 * every held-beat scene** — script.md: "cut the staging kit's 8-frame
 * `useEmotion` lead to 0 wherever a HELD BEAT direction appears".
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

export const NO_LEAD = 0;

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

export type BubblePlacement = {
  x?: number;
  y?: number;
  tail?: "left" | "right" | "none";
  tailAt?: number;
  side?: "left" | "right";
  offset?: number;
};

/**
 * Every bubble in a dialogue scene, placed from the speakers' marks (ep 5's).
 * Six words maximum, a summary not a transcript; the bubble may shout in caps
 * where the MiniMax clip is lowercase (script.md's bubble lines).
 *
 * **Tails aim at their speaker by default here** — ep 5's `aimTails` pattern
 * (three files pending kit promotion) folded in: unless a line's placement
 * sets `tailAt` or `tail: "none"`, the tail is pinned to the speaker mark's x.
 * The kit tail cannot stretch; it slides along the bubble's bottom edge and
 * clamps, so a far speaker still gets a tail leaning the right way.
 */
export const Bubbles: React.FC<{
  scene: TimedScene;
  cast: Cast;
  text: Record<string, string>;
  visual?: SpeakerVisual;
  at?: Record<string, BubblePlacement>;
  fontSize?: number;
  maxWidth?: number;
  /** Turn the automatic tail-aim off (ep 5's default behaviour). */
  aim?: boolean;
}> = ({ scene, cast, text, visual, at, fontSize, maxWidth, aim = true }) => (
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
      const tailAt = override?.tailAt ?? (aim && tail !== "none" ? mark.x : undefined);
      return (
        <SpeechBubble
          key={`${key}-${i}`}
          x={bx}
          y={by}
          text={body}
          tail={tail}
          tailAt={tailAt}
          from={turn.from}
          until={turn.from + turn.durationInFrames}
          fontSize={fontSize}
          maxWidth={maxWidth}
        />
      );
    })}
  </>
);

/** ep 5's helper, for a scene that builds its own `at` map. */
export const aimTails = (
  text: Record<string, string>,
  cast: Cast,
): Record<string, { tailAt: number }> =>
  Object.fromEntries(
    Object.keys(text).flatMap((key) => {
      const mark = cast[key.slice(key.lastIndexOf("_") + 1) as keyof Cast];
      return mark ? [[key, { tailAt: mark.x }] as const] : [];
    }),
  );

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function rgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

// ---------------------------------------------------------------------------
// The wide layer, the volcano, Ember's island
// ---------------------------------------------------------------------------

/** Room past the frame: the tower cross-sections pan up a tall building. */
export const WIDE = { x: -1400, y: -2200, w: 4720, h: 4880 } as const;
export const WideLayer = makeWideLayer(WIDE);
export const Shard = makeShard(WideLayer);
/** The ep-5 mountain, promoted to the kit, bound to this episode's layer. */
export const Volcano = makeVolcano(WideLayer);

/**
 * **The coastal garden, and the one line every wide agrees on.** `horizon`
 * is ep 5's `COAST.horizon` (470) — the same sea, the same seat, so the
 * volcano at `VOLCANO_AT` is the SAME mountain at the same size the audience
 * watched wake up. `lawn` is where the drawn lawn band starts (it covers the
 * plate's painted grass, ep 5's `Beach` mechanism); `ground` is where a body
 * lying on it puts its back.
 */
export const GARDEN = { horizon: 470, lawn: 690, ground: 930 } as const;

/** Scene 5's sea seat (`sea_sky_heavy`'s low horizon). The volcano stands on it too. */
export const SEA_SEAT = 800;

/** ep 5's numbers, verbatim: frame left, small, awake. */
export const VOLCANO_AT = { x: 336, scale: 1.15 } as const;

/**
 * **Ember's island** — ep 5's `NewIsland`, at its numbers (x 584, h 30, w 62),
 * one show older. A continuity obligation: a kid will check that it is there.
 */
export const ISLAND = { x: 584, h: 30, w: 62 } as const;

/** The summit's lit state in each light. The one steady light in act three. */
export type HorizonLight = "day" | "heavy" | "dark" | "dusk";
const HORIZON_RIM: Record<HorizonLight, number> = { day: 0.28, heavy: 0.42, dark: 0.85, dusk: 0.62 };

/**
 * The volcano and the island on a horizon line. Every coastal wide draws this
 * — the garden, the window, the sea beside the hotel. `look` and `speaking`
 * are for his one line (Scene 16); everything else about him is "the mountain
 * moved slightly and that is enormous".
 */
export const Horizon: React.FC<{
  base?: number;
  x?: number;
  scale?: number;
  light?: HorizonLight;
  smoke?: number;
  speaking?: boolean;
  look?: LookDirection;
  emotion?: Emotion;
  opacity?: number;
}> = ({
  base = GARDEN.horizon,
  x = VOLCANO_AT.x,
  scale = VOLCANO_AT.scale,
  light = "day",
  smoke = 0.42,
  speaking,
  look = "camera",
  emotion = "neutral",
  opacity,
}) => (
  <>
    <EmberIsland base={base} x={x + (ISLAND.x - VOLCANO_AT.x) * (scale / VOLCANO_AT.scale)} k={scale / VOLCANO_AT.scale} light={light} />
    <Volcano
      x={x}
      base={base}
      scale={scale}
      phase={PHASE.volcano}
      awake={1}
      smoke={smoke}
      rim={HORIZON_RIM[light]}
      speaking={speaking}
      look={look}
      emotion={emotion}
      opacity={opacity}
    />
  </>
);

/** ep 5's `NewIsland` shape, a day-old black island with a warm crest. */
export const EmberIsland: React.FC<{ base: number; x: number; k?: number; light?: HorizonLight }> = ({
  base,
  x,
  k = 1,
  light = "day",
}) => {
  const h = ISLAND.h * k;
  const w = ISLAND.w * k;
  const body = mixHex("#3a3138", kidTheme.sunsetLow, 0.05);
  const crest = mixHex(body, "#ff9d3c", 0.45);
  return (
    <WideLayer>
      <path
        d={
          `M ${x - w} ${base}` +
          ` C ${x - w * 0.8} ${base - h * 0.55} ${x - w * 0.4} ${base - h * 0.95} ${x - w * 0.06} ${base - h}` +
          ` C ${x + w * 0.32} ${base - h * 1.02} ${x + w * 0.78} ${base - h * 0.58} ${x + w} ${base} Z`
        }
        fill={body}
      />
      <path
        d={
          `M ${x - w * 0.52} ${base - h * 0.72}` +
          ` C ${x - w * 0.2} ${base - h * 1.0} ${x + w * 0.28} ${base - h * 0.94} ${x + w * 0.56} ${base - h * 0.6}`
        }
        stroke={crest}
        strokeWidth={5 * k}
        strokeLinecap="round"
        fill="none"
        opacity={light === "dark" ? 0.75 : 0.55}
      />
    </WideLayer>
  );
};

/**
 * ep 5's mouth-anchor helper, for the volcano's one line. The tail points at
 * his MOUTH (from `volcanoFace`), never his eye. At the wide seat use
 * `side: "right"` — there is open sea on his right (ep 5's end-card finding).
 */
export function volcanoBubble(seat: {
  x: number;
  base: number;
  scale?: number;
  side?: "left" | "right";
}): { mark: Mark; at: BubblePlacement; maxWidth: number } {
  const face = volcanoFace({ ...seat, awake: 1 });
  const side = seat.side ?? "right";
  const maxWidth = 520;
  const half = maxWidth / 2 + 51;
  const nearEye = side === "left" ? face.eyeX[0] - face.eyeRx : face.eyeX[1] + face.eyeRx;
  const bx = clamp(side === "left" ? nearEye - half - 24 : nearEye + half + 24, 400, WIDTH - 400);
  const by = clamp(face.mouthY - 48 - 103, 170, HEIGHT - 280);
  return {
    mark: { x: bx, y: by, who: "boom", lift: 0, side, offset: 0 },
    at: { x: bx, y: by, tail: side === "left" ? "right" : "left", tailAt: face.mouthX },
    maxWidth,
  };
}

// ---------------------------------------------------------------------------
// The plates
// ---------------------------------------------------------------------------

/**
 * One row per plate (derivation: the skeleton-wave report; method = ep 5's
 * sharp skyline measure). `skyline` = the sky→sea row as a fraction of plate
 * height (null = no horizon: the hotel's insides); `scale` = width ÷ 1344
 * the seating needs; `near` = mean near-field colour, for drawn bands that
 * share an edge with the plate. **Acts add their rows here** (the act-2/3 keys
 * named in backgrounds.mjs) via the showrunner's shared-change pass.
 */
export const PLATES: Record<string, { skyline: number | null; scale: number; near: string }> = {
  // MEASURED (sharp, strongest 6-row luminance drop; rows 78–94% mean).
  // garden v2 (v1 came back at 0.313 — a 1.96× seat — and was re-rolled once,
  // same prompt, new seed; v1 kept in scratchpad/ep6/plate-rerolls/). Its lawn
  // is straw-yellow: the hottest morning of the summer, and the drawn lawn
  // band tints from it, so it reads parched rather than wrong.
  garden_heavy_day: { skyline: 0.469, scale: 1.5, near: "#dab31c" },
  // The window plate: the sky is mustard edge to edge (the heavy afternoon),
  // not cream — the STYLE failure was cream; this is a named colour.
  bay_through_window_yellow: { skyline: 0.465, scale: 1.5, near: "#818a2a" },
  // Scene 5: horizon LOW (0.742), seated at SEA_SEAT (800) — 1.42 covers the
  // frame with the tower's whole sky above it.
  sea_sky_heavy: { skyline: 0.742, scale: 1.42, near: "#0f7067" },
  // The insides: no horizon (the sanctioned no-volcano shots).
  hotel_lobby_grey: { skyline: null, scale: 1.43, near: "#efeef2" },
  tower_interior: { skyline: null, scale: 1.43, near: "#ece3f0" },
  penthouse_freezer: { skyline: null, scale: 1.43, near: "#cce5f3" },
};

export const PLATE = { w: 1344, h: 768 } as const;
export const PLATE_BLEED = 1.02;

/** Where a plate is drawn: its measured skyline on `seat` (ep 5's rule). */
export function plateFit(key: string, seat: number, offsetY = 0): { left: number; top: number; w: number; h: number } {
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

/** The plate. Horizontal drift only (a vertical one moves the volcano's seat). */
export const Plate: React.FC<{
  bg: string;
  seat?: number;
  phase?: number;
  drift?: number;
  offsetY?: number;
  opacity?: number;
  /** A flat colour wash over the plate (a light state), as `rgba(...)`. */
  tint?: string;
}> = ({ bg, seat = GARDEN.horizon, phase = 0, drift = 5, offsetY = 0, opacity, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fit = plateFit(bg, seat, offsetY);
  const dx = drift === 0 ? 0 : Math.sin((frame / fps) * ((2 * Math.PI) / 34) + phase) * drift;
  const src = BACKGROUNDS[bg as keyof typeof BACKGROUNDS];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: Z.plate, opacity }}>
      {src ? (
        <Img
          src={staticFile(src)}
          style={{ position: "absolute", left: fit.left + dx, top: fit.top, width: fit.w, height: fit.h, display: "block" }}
        />
      ) : null}
      {tint ? <div style={{ position: "absolute", inset: 0, background: tint }} /> : null}
    </div>
  );
};

/** The stacking order. Nothing in a world is allowed to be z-index auto. */
export const Z = {
  plate: 0,
  ground: 1,
  scenery: 2,
  /** Things in the sky between the horizon and the cast: the hotel, Boom far. */
  sky: 3,
  cast: 10,
  /** The room around the window (wall, frame, sill) — in front of the outside. */
  room: 20,
  /** The kid at the window, the mug: in front of the room. */
  kid: 30,
  overlay: 60,
} as const;

// ---------------------------------------------------------------------------
// WORLD 1 — the garden
// ---------------------------------------------------------------------------

/**
 * **The coastal garden wide**: the plate, a drawn lawn over its painted grass,
 * the volcano awake with the island beside him on the horizon, and the cast.
 * Heat shimmer off the lawn is `shimmer` (0..1).
 */
export const GardenWorld: React.FC<{
  bg?: string;
  phase?: number;
  cam?: Cam;
  drift?: number;
  light?: HorizonLight;
  shimmer?: number;
  /** Things in the sky behind the cast (the hotel, Sunny). */
  sky?: React.ReactNode;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ bg = "garden_heavy_day", phase = 0, cam, drift, light = "heavy", shimmer = 0, sky, overlay, children }) => (
  <KidBackdrop variant="day" clouds={0}>
    <Camera cam={cam ?? { x: WIDTH / 2, y: HEIGHT / 2 }}>
      <Plate bg={bg} seat={GARDEN.horizon} phase={phase} drift={drift} />
      <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery }}>
        <Horizon light={light} />
      </div>
      {sky ? <div style={{ position: "absolute", inset: 0, zIndex: Z.sky }}>{sky}</div> : null}
      <Lawn near={PLATES[bg]?.near ?? "#6faa3c"} phase={phase} />
      {shimmer > 0 ? <HeatShimmer strength={shimmer} /> : null}
      <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>{children}</div>
    </Camera>
    {overlay ? <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>{overlay}</AbsoluteFill> : null}
  </KidBackdrop>
);

/** The lawn a body lies on: ep 5's `Beach`, grass instead of sand, no surf. */
export const Lawn: React.FC<{ near: string; phase?: number; top?: number }> = ({ near, phase = 0, top = GARDEN.lawn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase;
  const s = top;
  const dark = mixHex(near, kidTheme.ink, 0.2);
  const sway = Math.sin(t * 0.5) * 3;
  const edge = (lift: number): string =>
    `M ${WIDE.x} ${WIDE.y + WIDE.h}` +
    ` L ${WIDE.x} ${(s - lift + sway).toFixed(1)}` +
    ` Q ${WIDTH * 0.3} ${(s - 26 - lift).toFixed(1)} ${WIDTH * 0.6} ${(s - 8 - lift).toFixed(1)}` +
    ` Q ${WIDTH * 0.86} ${(s + 6 - lift).toFixed(1)} ${WIDE.x + WIDE.w} ${(s - 16 - lift - sway).toFixed(1)}` +
    ` L ${WIDE.x + WIDE.w} ${WIDE.y + WIDE.h} Z`;
  return (
    <>
      <WideLayer zIndex={Z.ground}>
        {[40, 26, 12].map((lift, i) => (
          <path key={lift} d={edge(lift)} fill={near} opacity={0.22 + i * 0.18} />
        ))}
        <path d={edge(0)} fill={near} />
      </WideLayer>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: Z.ground,
          background: `linear-gradient(to top, ${rgba(dark, 0.34)} 0%, ${rgba(dark, 0.12)} 16%, transparent 36%)`,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

/** Heat off the lawn: a few faint rising wavy strokes, never a filter. */
const HeatShimmer: React.FC<{ strength: number }> = ({ strength }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer zIndex={Z.ground}>
      {Array.from({ length: 9 }, (_, i) => {
        const u = (t * 0.32 + i / 9) % 1;
        const x = 140 + ((i * 397) % 1640);
        const y = GARDEN.lawn + 200 - u * 230;
        const w = Math.sin(t * 3 + i) * 8;
        return (
          <path
            key={i}
            d={`M ${x} ${y.toFixed(0)} q ${10 + w} -20 0 -40 q ${-10 - w} -20 0 -40`}
            stroke={kidTheme.paper}
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            opacity={0.22 * strength * Math.sin(u * Math.PI)}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// WORLD 2 — the window (the stage for acts two and three)
// ---------------------------------------------------------------------------

/**
 * **The window.** The kid is indoors from Scene 2 to the end card and every
 * outdoor event is seen THROUGH this glass. A persistent graphic that owns
 * part of the frame fixes where speakers can stand (STYLE), so the numbers
 * are here once:
 *
 *   the GLASS is x 150..1770, y 64..`sill` — the bay, the horizon (470, the
 *   garden's seat: the volcano is the SAME mountain at the same size, framed),
 *   the hotel far out past him, Boom arriving, Flash.
 *   the SILL is y 790. The kid's hands rest on it; the mug sits on it.
 *   the KID sits centre-bottom, back to camera, head over the lower glass —
 *   so the band x 640..1280 below y ~560 is theirs. **Anything outside that
 *   wants to talk stands in the upper two thirds of the glass**, and Boom at
 *   the glass is frame-left of the kid (he arrives from the sea, `boomAtGlass`).
 *   the CURTAIN hangs inside the right edge of the glass; `curtain` lifts it
 *   (Scene 11, the gust front).
 */
export const WINDOW = { left: 150, right: 1770, top: 64, sill: 790, kidX: 960, mugX: 1440 } as const;

/** Where Boom stands when he has arrived at the glass (centre of his body). */
export const BOOM_AT_GLASS = { x: 560, y: 410 } as const;

export type WindowSky = "yellow" | "dark" | "lit" | "dusk";

/** The room's colours under each sky. Warm and cosy in all four — never fear. */
const ROOM: Record<WindowSky, { wall: string; trim: string; sill: string; light: number }> = {
  yellow: { wall: "#5d4a52", trim: "#7b6052", sill: "#8c6c56", light: 0.16 },
  dark: { wall: "#2f2a3c", trim: "#4a3e44", sill: "#5a4a46", light: 0.05 },
  lit: { wall: "#454056", trim: "#5f5560", sill: "#6f625e", light: 0.12 },
  dusk: { wall: "#463a4e", trim: "#6a5052", sill: "#7a5e52", light: 0.1 },
};

const SKY_LIGHT: Record<WindowSky, HorizonLight> = { yellow: "heavy", dark: "dark", lit: "dark", dusk: "dusk" };

export const WindowWorld: React.FC<{
  bg?: string;
  sky?: WindowSky;
  phase?: number;
  drift?: number;
  /** Plate tint for a light state the plate itself does not have. */
  tint?: string;
  /** The hotel out past the volcano, as drawn by `HotelTower`; omit for none. */
  hotel?: React.ComponentProps<typeof HotelTower>;
  /** Everything outside the glass that is not the hotel (Boom, rings, Flash…). */
  outside?: React.ReactNode;
  /** Flash appearances on this shot — the sky whites with each. */
  flashes?: number[];
  /** The kid. Omit to leave the window empty. */
  kid?: React.ComponentProps<typeof KidAtWindow> | null;
  /** The curtain's lift, 0..1. */
  curtain?: number;
  /** The mug's ripple, 0..1 (the CRACK, the glass hum). */
  ripple?: number;
  /** The glass buzz, 0..1 — a few px of rattle in the frame. */
  rattle?: number;
  /** The volcano's one line (Scene 16). */
  volcano?: { speaking?: boolean; look?: LookDirection; emotion?: Emotion };
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({
  bg = "bay_through_window_yellow",
  sky = "yellow",
  phase = 0,
  drift = 3,
  tint,
  hotel,
  outside,
  flashes = [],
  kid,
  curtain = 0,
  ripple = 0,
  rattle = 0,
  volcano,
  overlay,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const room = ROOM[sky];
  const flare = flashes.reduce((a, at) => Math.max(a, flashLevel(frame, at)), 0);
  const shake = rattle > 0 ? Math.sin((frame / fps) * 80) * 3 * rattle : 0;
  return (
    <AbsoluteFill style={{ background: room.wall, fontFamily: kidTheme.fontFamily, lineHeight: "normal" }}>
      {/* OUTSIDE: everything beyond the glass. Its own stacking context at
          z 0 (`isolation`), CLIPPED to the glass rectangle — so nothing out
          there (the hotel, Flash, Boom, his rings) can ever paint over the
          frame, the sill, the curtain or the kid, whatever z-index it uses
          internally. Showrunner repair R2. */}
      <AbsoluteFill
        style={{
          zIndex: 0,
          isolation: "isolate",
          clipPath: `inset(${WINDOW.top}px ${WIDTH - WINDOW.right}px ${HEIGHT - WINDOW.sill}px ${WINDOW.left}px)`,
        }}
      >
        <Plate bg={bg} seat={GARDEN.horizon} phase={phase} drift={drift} tint={tint} />
        <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery }}>
          <Horizon light={SKY_LIGHT[sky]} speaking={volcano?.speaking} look={volcano?.look} emotion={volcano?.emotion} />
        </div>
        {hotel ? (
          <div style={{ position: "absolute", inset: 0, zIndex: Z.sky }}>
            <HotelTower {...hotel} />
          </div>
        ) : null}
        <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>{outside}</div>
        <div style={{ position: "absolute", inset: 0, zIndex: Z.cast + 1 }}>
          {flashes.map((at) => (
            <FlashSky key={at} at={at} />
          ))}
        </div>
      </AbsoluteFill>
      {/* THE ROOM: wall with the window cut out, the frame, the sill, the curtain. */}
      <div style={{ position: "absolute", inset: 0, zIndex: Z.room, transform: `translateX(${shake.toFixed(2)}px)` }}>
        <Room room={room} curtain={curtain} flare={flare} />
      </div>
      {/* The kid and the mug, in front of the room. */}
      <div style={{ position: "absolute", inset: 0, zIndex: Z.kid }}>
        <Mug x={WINDOW.mugX} sill={WINDOW.sill} ripple={ripple} />
        {kid ? <KidAtWindow {...kid} /> : null}
        {children}
      </div>
      {overlay ? <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>{overlay}</AbsoluteFill> : null}
    </AbsoluteFill>
  );
};

/** The kid's default placement at the window. Spread it and override fields. */
export const KID_AT_WINDOW = { x: WINDOW.kidX, sill: WINDOW.sill, scale: 1 } as const;

const Room: React.FC<{ room: (typeof ROOM)[WindowSky]; curtain: number; flare: number }> = ({ room, curtain, flare }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { left: L, right: R, top: T, sill: S } = WINDOW;
  // Wall: the whole frame with the glass cut out (evenodd).
  const wall = `M -20 -20 H 1940 V 1100 H -20 Z M ${L} ${T} H ${R} V ${S} H ${L} Z`;
  const lift = Math.max(0, Math.min(1, curtain));
  const billow = lift * (Math.sin(t * 2.3) * 0.5 + 0.5);
  // The curtain hangs inside the right edge of the glass; lifting swings its
  // hem in towards the room and up.
  const cx0 = R - 230;
  const hemX = cx0 - 60 * lift - 40 * billow;
  const hemY = S + 30 - 170 * lift - 40 * billow;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={wall} fill={room.wall} fillRule="evenodd" />
      {/* The light from the glass falling on the wall round it. */}
      <path d={wall} fill={kidTheme.paper} fillRule="evenodd" opacity={room.light + 0.35 * flare} />
      {/* The glass: a faint sheen, two diagonal strokes. */}
      <g opacity={0.12}>
        <path d={`M ${L + 120} ${T + 40} L ${L + 380} ${T + 300}`} stroke={kidTheme.paper} strokeWidth={26} strokeLinecap="round" />
        <path d={`M ${L + 200} ${T + 30} L ${L + 300} ${T + 130}`} stroke={kidTheme.paper} strokeWidth={12} strokeLinecap="round" />
      </g>
      {/* The frame. */}
      <rect x={L - 22} y={T - 22} width={R - L + 44} height={S - T + 22} fill="none" stroke={room.trim} strokeWidth={44} rx={10} />
      <rect x={L - 4} y={T - 4} width={R - L + 8} height={S - T + 4} fill="none" stroke={mixHex(room.trim, kidTheme.ink, 0.35)} strokeWidth={8} rx={4} />
      {/* The sill: a deep board the hands and the mug rest on. */}
      <rect x={L - 70} y={S - 6} width={R - L + 140} height={46} rx={10} fill={room.sill} />
      <rect x={L - 70} y={S + 34} width={R - L + 140} height={14} rx={6} fill={mixHex(room.sill, kidTheme.ink, 0.4)} />
      {/* The curtain. */}
      <path
        d={
          `M ${cx0 - 10} ${T - 30} L ${R + 40} ${T - 30} L ${R + 40} ${S + 30} ` +
          `Q ${(R + hemX) / 2} ${hemY + 30} ${hemX} ${hemY} ` +
          `Q ${cx0 - 30 - 20 * lift} ${(T + hemY) / 2} ${cx0 - 10} ${T - 30} Z`
        }
        fill={mixHex(room.trim, "#b85a4a", 0.55)}
        opacity={0.96}
      />
      {[0.3, 0.55, 0.8].map((f) => (
        <path
          key={f}
          d={`M ${cx0 + (R + 40 - cx0) * f} ${T - 30} Q ${cx0 + (R + 40 - cx0) * f - 14 * lift} ${(T + S) / 2} ${hemX + (R + 40 - hemX) * f} ${hemY + (S + 30 - hemY) * f * 0.5}`}
          stroke={mixHex(room.trim, kidTheme.ink, 0.3)}
          strokeWidth={6}
          fill="none"
          opacity={0.45}
        />
      ))}
      {/* The curtain rod. */}
      <rect x={cx0 - 40} y={T - 44} width={R + 80 - cx0} height={14} rx={7} fill={mixHex(room.trim, kidTheme.ink, 0.5)} />
    </svg>
  );
};

/** The mug on the sill. `ripple` makes the cocoa ring (the CRACK, the hum). */
const Mug: React.FC<{ x: number; sill: number; ripple?: number }> = ({ x, sill, ripple = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const steam = (k: number) => Math.sin(t * 1.4 + k) * 6;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
      {[0, 1].map((k) => (
        <path
          key={k}
          d={`M ${x - 18 + k * 30} ${sill - 120} q ${10 + steam(k)} -20 0 -40 q ${-10 - steam(k)} -20 0 -40`}
          stroke={kidTheme.paper}
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
          opacity={0.32}
        />
      ))}
      <path d={`M ${x + 46} ${sill - 86} q 40 4 36 34 q -4 26 -40 22`} stroke="#d9634c" strokeWidth={14} fill="none" />
      <rect x={x - 52} y={sill - 108} width={100} height={110} rx={18} fill="#e8744f" />
      <ellipse cx={x - 2} cy={sill - 104} rx={46} ry={10} fill="#6b3a26" />
      {ripple > 0.01 ? (
        <ellipse
          cx={x - 2}
          cy={sill - 104}
          rx={18 + 26 * ((t * 3) % 1)}
          ry={4 + 5 * ((t * 3) % 1)}
          fill="none"
          stroke="#a46a4a"
          strokeWidth={3}
          opacity={ripple * (1 - ((t * 3) % 1))}
        />
      ) : null}
      <rect x={x - 40} y={sill - 90} width={18} height={70} rx={9} fill={kidTheme.paper} opacity={0.22} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// The Cloud Hotel, outside
// ---------------------------------------------------------------------------

/**
 * **The hotel, seen from outside**: Cloudia's building, a cloud. `grow` 0 is
 * the small flat drizzle-grey hotel of every show so far; 1 is the tower,
 * flat-topped (the anvil), tall. Drawn in composition coords standing on
 * `base` (its underside; it floats over the sea, it is not on it).
 *
 * It has no face: in exteriors the hotel is the BUILDING. Cloudia, the
 * manager, is a character inside it (the lobby, the cross-section).
 */
export const HotelTower: React.FC<{
  x: number;
  base: number;
  /** Width of the column at full height, px. The anvil spreads to ~2.4×. */
  width?: number;
  /** Height at grow 1, px (cloud base to the flat top). */
  height?: number;
  grow?: number;
  /** 0..1 how much of the flat top (the anvil) has spread. Default follows grow. */
  anvil?: number;
  /** Light on it: the heavy-yellow afternoon, the storm, dusk gold, plain grey. */
  tone?: "heavy" | "storm" | "dusk" | "grey";
  /** Inner flicker (the crackle, seen from far), 0..1. */
  crackle?: number;
  opacity?: number;
}> = ({ x, base, width = 230, height = 330, grow = 1, anvil, tone = "heavy", crackle = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const g = Math.max(0, Math.min(1, grow));
  const a = Math.max(0, Math.min(1, anvil ?? Math.max(0, (g - 0.65) / 0.35)));
  // At grow 0 it is the small flat drizzle hotel: wide, low. It narrows into a
  // column as it climbs, and the anvil spreads off the top.
  const h = 44 + (height - 44) * kidEase.easeInOutSine(g);
  const colW = width * (1.5 - 0.5 * g);
  const top = base - h;
  const pal = {
    heavy: { lit: "#fbf3e2", body: "#ddd8d8", shade: "#9c99aa", edge: "#77748a" },
    storm: { lit: "#a9afc0", body: "#7c8196", shade: "#525669", edge: "#3b3e51" },
    dusk: { lit: "#f8dcb8", body: "#c5b4c0", shade: "#85778f", edge: "#5f546c" },
    grey: { lit: "#e9ecf0", body: "#bfc6cf", shade: "#8e97a4", edge: "#6f7887" },
  }[tone];
  // CAULIFLOWER: rows of overlapping puffs filling the column, so the whole
  // silhouette is lumpy (straight sides read as a jar). Deterministic.
  const rows = Math.max(1, Math.round(1 + 5 * g));
  const puffs: Array<{ cx: number; cy: number; r: number }> = [];
  for (let i = 0; i < rows; i++) {
    const f = rows === 1 ? 0 : i / (rows - 1);
    const y = base - 40 - f * Math.max(0, h - 100);
    const r = colW * (0.36 - 0.1 * f);
    const n = 3;
    for (let k = 0; k < n; k++) {
      const u = k / (n - 1) - 0.5;
      puffs.push({ cx: x + u * colW * 0.72 + Math.sin(i * 2.1 + k) * 6, cy: y - Math.abs(u) * r * 0.3 + (k === 1 ? -r * 0.25 : 0), r: r * (k === 1 ? 1.05 : 0.9) });
    }
  }
  const anvilW = colW * (1 + 1.2 * a);
  const anvilH = 30 + 20 * a;
  // The anvil: a flat top, thin at its tips, its underside sagging to the
  // column — the shape a kid can be told "you can see one coming from a long
  // way off".
  const anvilPath =
    `M ${x - anvilW / 2} ${top + 8}` +
    ` Q ${x - anvilW / 2 - 8} ${top - 2} ${x - anvilW / 2 + 16} ${top - 4}` +
    ` L ${x + anvilW / 2 - 16} ${top - 4}` +
    ` Q ${x + anvilW / 2 + 8} ${top - 2} ${x + anvilW / 2} ${top + 8}` +
    ` Q ${x + colW * 0.62} ${top + anvilH * 0.6} ${x + colW * 0.46} ${top + anvilH * 1.6}` +
    ` L ${x - colW * 0.46} ${top + anvilH * 1.6}` +
    ` Q ${x - colW * 0.62} ${top + anvilH * 0.6} ${x - anvilW / 2} ${top + 8} Z`;
  const flick = crackle > 0 && Math.sin(t * 23) > 0.6 ? crackle : 0;
  const shape = (dx = 0, dy = 0) => (
    <g transform={`translate(${dx} ${dy})`}>
      <rect x={x - colW * 0.45} y={top + anvilH} width={colW * 0.9} height={h - anvilH - 40} rx={colW * 0.2} />
      <rect x={x - colW * 0.7} y={base - 70} width={colW * 1.4} height={70} rx={34} />
      {puffs.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} />
      ))}
      {a > 0.02 ? <path d={anvilPath} /> : <ellipse cx={x} cy={top + 16} rx={colW * 0.5} ry={22} />}
    </g>
  );
  // The light comes from upper right (the hidden Sunny): every puff gets a lit
  // crescent by drawing the whole shape once in the lit colour nudged up-right
  // and then in the body colour on top of it — two flat passes, no gradient.
  const lx = Math.max(4, colW * 0.05);
  return (
    <WideLayer opacity={opacity}>
      <g fill={pal.edge} stroke={pal.edge} strokeWidth={8} strokeLinejoin="round">
        {shape()}
      </g>
      <g fill={pal.lit}>{shape()}</g>
      <g fill={pal.body}>{shape(-lx, lx * 0.8)}</g>
      <ellipse cx={x} cy={base - 14} rx={colW * 0.7} ry={16} fill={pal.shade} opacity={0.9} />
      {flick > 0 ? <ellipse cx={x} cy={top + h * 0.5} rx={colW * 0.4} ry={h * 0.3} fill="#f6f2ff" opacity={0.3 * flick} /> : null}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// The Cloud Hotel, in section
// ---------------------------------------------------------------------------

/**
 * **THE TOWER IN SECTION** (diagram-sag rule: a diagram with characters
 * standing in it). The lift shaft up the middle, floors stacking, the
 * freezing line, the penthouse above it, the flat roof, and the crackle in
 * the walls. Composition coords: `x` is the shaft's centre, `base` the lobby
 * floor, `top` the roof line at full height.
 *
 *   `floors`   how many floors are built (stacking upward from the lobby);
 *   `roof`     0..1, the flat top spreading;
 *   `lift`     0..1, the updraft running up the shaft (Puff's lift), as
 *              rising streak PAIRS (two lines, never one — STYLE);
 *   `crackle`  0..1, sparks in the walls wherever guests rub past;
 *   `charge`   0..1, the top floor glowing one way (gold), the lobby the
 *              other (blue) — "honest charge separation at kid level";
 *   `walls`    draw the outer cloud wall + interior fill (an exterior
 *              cutaway, Scene 5) or not (`false`: we are INSIDE, Scenes 7–8,
 *              and the painted `tower_interior` plate is the room).
 *
 * `floorY(i)` is exported so a body can stand on floor `i`.
 */
export type TowerSpec = {
  x: number;
  base: number;
  top: number;
  width: number;
  /** Total floors at full height (the penthouse is the last). */
  count: number;
  /** Freezing line, as a floor index: floors at or above it are ice. */
  freezeAt: number;
};

export const TOWER_FULL: TowerSpec = { x: 960, base: 1000, top: -1500, width: 1500, count: 6, freezeAt: 4.4 };

export function floorY(spec: TowerSpec, i: number): number {
  const step = (spec.base - spec.top) / spec.count;
  return spec.base - i * step;
}

export const TowerSection: React.FC<{
  spec: TowerSpec;
  floors?: number;
  roof?: number;
  lift?: number;
  crackle?: number;
  charge?: number;
  walls?: boolean;
  tone?: "heavy" | "grey";
}> = ({ spec, floors = spec.count, roof = 1, lift = 0, crackle = 0, charge = 0, walls = true, tone = "heavy" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const step = (spec.base - spec.top) / spec.count;
  const built = Math.max(0, Math.min(spec.count, floors));
  const builtTop = spec.base - built * step;
  const W = spec.width;
  const L = spec.x - W / 2;
  const shaftW = Math.min(240, W * 0.16);
  const freezeY = spec.base - spec.freezeAt * step;
  const wall = tone === "heavy" ? "#cfc7cc" : "#bfc6d0";
  const inner = tone === "heavy" ? "#e9e3e2" : "#dde3ea";
  const edge = "#7a7488";
  const slab = "#a7a0b2";
  const roofW = W * (1 + 0.75 * roof);
  return (
    <WideLayer>
      {walls ? (
        <>
          {/* The cloud wall round the section: puffs on both flanks. */}
          <g fill={edge}>
            <rect x={L - 26} y={builtTop - 26} width={W + 52} height={spec.base - builtTop + 60} rx={70} />
          </g>
          <g fill={wall}>
            <rect x={L - 16} y={builtTop - 16} width={W + 32} height={spec.base - builtTop + 40} rx={64} />
            {Array.from({ length: Math.ceil(built * 2) + 2 }, (_, i) => {
              const y = spec.base - i * step * 0.5;
              if (y < builtTop) return null;
              return (
                <g key={i}>
                  <circle cx={L - 6 + Math.sin(i * 1.9) * 8} cy={y} r={56 + (i % 3) * 8} />
                  <circle cx={L + W + 6 + Math.cos(i * 1.4) * 8} cy={y - 20} r={52 + (i % 2) * 10} />
                </g>
              );
            })}
          </g>
          <rect x={L + 20} y={builtTop + 10} width={W - 40} height={spec.base - builtTop - 10} rx={40} fill={inner} />
        </>
      ) : null}
      {/* Above the freezing line: ice. A cold tint and a dashed line. */}
      {builtTop < freezeY ? (
        <>
          <rect x={L + (walls ? 20 : -400)} y={Math.max(builtTop, spec.top) + 10} width={walls ? W - 40 : W + 800} height={freezeY - Math.max(builtTop, spec.top) - 10} fill="#cfe6fb" opacity={walls ? 0.7 : 0.35} rx={walls ? 30 : 0} />
          <path
            d={`M ${L + (walls ? 30 : -400)} ${freezeY} H ${L + (walls ? W - 30 : W + 400)}`}
            stroke="#5f8fc4"
            strokeWidth={6}
            strokeDasharray="26 18"
            opacity={0.75}
          />
        </>
      ) : null}
      {/* THE GLOWS: top one way, lobby the other. */}
      {charge > 0.01 ? (
        <>
          <rect x={L + 20} y={Math.max(builtTop, freezeY - step * 1.2)} width={W - 40} height={step * 1.1} fill="#ffd36e" opacity={0.28 * charge} rx={30} />
          <rect x={L + 20} y={spec.base - step * 0.9} width={W - 40} height={step * 0.9} fill="#7fb2ff" opacity={0.26 * charge} rx={30} />
        </>
      ) : null}
      {/* The floors: slabs either side of the shaft. */}
      {Array.from({ length: Math.floor(built) + 1 }, (_, i) => {
        const y = spec.base - i * step;
        const grow = Math.min(1, built - i + 1);
        const reach = (W / 2 - shaftW / 2 - 30) * Math.max(0, Math.min(1, grow));
        return (
          <g key={i} fill={slab}>
            <rect x={spec.x - shaftW / 2 - reach} y={y - 6} width={reach} height={20} rx={10} />
            <rect x={spec.x + shaftW / 2} y={y - 6} width={reach} height={20} rx={10} />
          </g>
        );
      })}
      {/* THE SHAFT. The lift has no car: the lift IS the updraft. */}
      <rect x={spec.x - shaftW / 2} y={builtTop} width={shaftW} height={spec.base - builtTop} fill="#fff8f0" opacity={0.32} />
      <path d={`M ${spec.x - shaftW / 2} ${builtTop} V ${spec.base}`} stroke={edge} strokeWidth={5} opacity={0.5} />
      <path d={`M ${spec.x + shaftW / 2} ${builtTop} V ${spec.base}`} stroke={edge} strokeWidth={5} opacity={0.5} />
      {lift > 0.01
        ? Array.from({ length: 10 }, (_, i) => {
            const u = (t * 0.7 + i / 10) % 1;
            const y = spec.base - u * (spec.base - builtTop);
            const xx = spec.x - shaftW * 0.25 + ((i * 37) % 5) * shaftW * 0.12;
            return (
              <g key={i} opacity={lift * 0.6 * Math.sin(u * Math.PI)} stroke="#ffffff" strokeLinecap="round">
                <path d={`M ${xx} ${y} v -70`} strokeWidth={6} />
                <path d={`M ${xx + 16} ${y + 22} v -60`} strokeWidth={4} opacity={0.7} />
              </g>
            );
          })
        : null}
      {/* THE ROOF: flat, spreading — the anvil. */}
      {built >= spec.count - 0.01 && roof > 0.01 ? (
        <path
          d={
            `M ${spec.x - roofW / 2} ${spec.top + 6} Q ${spec.x - roofW / 2 - 10} ${spec.top - 40} ${spec.x - roofW / 2 + 30} ${spec.top - 44}` +
            ` L ${spec.x + roofW / 2 - 30} ${spec.top - 44} Q ${spec.x + roofW / 2 + 10} ${spec.top - 40} ${spec.x + roofW / 2} ${spec.top + 6}` +
            ` Q ${spec.x + W * 0.55} ${spec.top + 10} ${spec.x + W / 2} ${spec.top + 40} L ${spec.x - W / 2} ${spec.top + 40}` +
            ` Q ${spec.x - W * 0.55} ${spec.top + 10} ${spec.x - roofW / 2} ${spec.top + 6} Z`
          }
          fill={walls ? wall : slab}
          stroke={edge}
          strokeWidth={8}
          strokeLinejoin="round"
          opacity={Math.min(1, roof * 2)}
        />
      ) : null}
      {/* THE CRACKLE: little sparks in the walls, deterministic, flickering. */}
      {crackle > 0.01 ? <Sparks spec={spec} builtTop={builtTop} strength={crackle} t={t} walls={walls} /> : null}
    </WideLayer>
  );
};

const Sparks: React.FC<{ spec: TowerSpec; builtTop: number; strength: number; t: number; walls: boolean }> = ({
  spec,
  builtTop,
  strength,
  t,
  walls,
}) => {
  const W = spec.width;
  const L = spec.x - W / 2;
  const n = Math.round(6 + 18 * strength);
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const on = Math.sin(t * (9 + (i % 5)) + i * 2.3) > 0.55 - 0.4 * strength;
        if (!on) return null;
        const fx = (i * 0.618) % 1;
        const fy = (i * 0.382 + 0.13) % 1;
        const x = walls ? L + 60 + fx * (W - 120) : L - 300 + fx * (W + 600);
        const y = builtTop + 30 + fy * (spec.base - builtTop - 60);
        const r = 14 + (i % 3) * 6;
        return (
          <path
            key={i}
            d={`M ${x - r} ${y} L ${x - r * 0.2} ${y - r * 0.5} L ${x + r * 0.2} ${y + r * 0.4} L ${x + r} ${y - r * 0.2}`}
            stroke="#fffbe0"
            strokeWidth={5}
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
            opacity={0.9}
          />
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// WORLD 3 — the Cloud Hotel, inside
// ---------------------------------------------------------------------------

/**
 * **The hotel's insides.** No horizon in any of them, so no volcano — the
 * sanctioned exemption (ep 5's `UnderWorld` licence).
 *
 *   `lobby`      the drizzle-grey lobby (ep-1 echo: drops hugging specks) —
 *                Scenes 3, 4, 9. `LOBBY.floor` is its ground line.
 *   `tower`      inside the tower, the cross-section around us — Scenes 7, 8.
 *                Pass `tower` props; the plate is the room.
 *   `penthouse`  the top floor, above the freezing line — Scene 6.
 */
export const LOBBY = { floor: 900, deskX: 1420 } as const;

export const HotelWorld: React.FC<{
  mode?: "lobby" | "tower" | "penthouse";
  phase?: number;
  cam?: Cam;
  tower?: React.ComponentProps<typeof TowerSection>;
  /** Room flare on Flash's frames (the lobby whites with her). */
  flashes?: number[];
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ mode = "lobby", phase = 0, cam, tower, flashes = [], overlay, children }) => {
  const bg = mode === "lobby" ? "hotel_lobby_grey" : mode === "tower" ? "tower_interior" : "penthouse_freezer";
  return (
    <AbsoluteFill style={{ background: "#a9a6b6", fontFamily: kidTheme.fontFamily, lineHeight: "normal" }}>
      <Camera cam={cam ?? { x: WIDTH / 2, y: HEIGHT / 2 }}>
        <Plate bg={bg} phase={phase} drift={mode === "tower" ? 0 : 3} />
        {mode !== "tower" ? <MistFloor y={LOBBY.floor} near={PLATES[bg].near} cold={mode === "penthouse"} /> : null}
        {tower ? (
          <div style={{ position: "absolute", inset: 0, zIndex: Z.ground }}>
            <TowerSection walls={false} {...tower} />
          </div>
        ) : null}
        <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>{children}</div>
      </Camera>
      <div style={{ position: "absolute", inset: 0, zIndex: Z.cast + 5 }}>
        {flashes.map((at) => (
          <FlashSky key={at} at={at} strength={0.9} />
        ))}
      </div>
      {overlay ? <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>{overlay}</AbsoluteFill> : null}
    </AbsoluteFill>
  );
};

/** The floor a body stands on in the lobby/penthouse: drawn, plate-tinted. */
const MistFloor: React.FC<{ y: number; near: string; cold?: boolean }> = ({ y, near, cold }) => (
  <WideLayer zIndex={Z.ground}>
    <path
      d={`M ${WIDE.x} ${WIDE.y + WIDE.h} L ${WIDE.x} ${y - 30} Q ${WIDTH / 2} ${y - 70} ${WIDE.x + WIDE.w} ${y - 30} L ${WIDE.x + WIDE.w} ${WIDE.y + WIDE.h} Z`}
      fill={mixHex(near, cold ? "#ffffff" : kidTheme.ink, cold ? 0.2 : 0.12)}
      opacity={0.9}
    />
    <path
      d={`M ${WIDE.x} ${y - 30} Q ${WIDTH / 2} ${y - 70} ${WIDE.x + WIDE.w} ${y - 30}`}
      stroke={mixHex(near, kidTheme.paper, 0.5)}
      strokeWidth={10}
      fill="none"
      opacity={0.6}
    />
  </WideLayer>
);

/** Cloudia's front desk, and the register nobody signed. */
export const FrontDesk: React.FC<{ x?: number; floor?: number; register?: boolean }> = ({
  x = LOBBY.deskX,
  floor = LOBBY.floor,
  register = true,
}) => (
  <WideLayer>
    <rect x={x - 230} y={floor - 190} width={460} height={190} rx={40} fill="#8d8aa0" />
    <rect x={x - 250} y={floor - 214} width={500} height={44} rx={22} fill="#a9a6bc" />
    {[-150, -50, 50, 150].map((dx) => (
      <circle key={dx} cx={x + dx} cy={floor - 190} r={34} fill="#a9a6bc" />
    ))}
    {register ? (
      <>
        <rect x={x - 90} y={floor - 236} width={130} height={30} rx={6} fill={kidTheme.paper} transform={`rotate(-4 ${x} ${floor - 220})`} />
        <path d={`M ${x - 25} ${floor - 234} v 26`} stroke="#9a8fb0" strokeWidth={4} transform={`rotate(-4 ${x} ${floor - 220})`} />
      </>
    ) : null}
    {/* The bell. */}
    <path d={`M ${x + 110} ${floor - 214} a 26 26 0 0 1 52 0 Z`} fill="#e9c35a" />
  </WideLayer>
);

/**
 * **The drizzle guests**: drops hugging specks (ep-1 house rule: "every guest
 * must hug a speck of dust"). Deterministic, never random. `lift` raises a
 * subset (the first guests going up in the lift, Scene 3).
 */
export const DROP_GUESTS = Array.from({ length: 11 }, (_, i) => ({
  x: 160 + ((i * 337) % 960),
  y: LOBBY.floor - 40 - ((i * 53) % 4) * 36,
  scale: 0.42 + ((i * 7) % 4) * 0.05,
  phase: (i * 1.37) % 6.28,
  riser: i % 3 === 0,
}));

export const DropGuests: React.FC<{ look?: number; lift?: number; only?: "risers" | "stayers" }> = ({
  look = 0,
  lift = 0,
  only,
}) => (
  <WideLayer>
    {DROP_GUESTS.map((g, i) => {
      if (only === "risers" && !g.riser) return null;
      if (only === "stayers" && g.riser) return null;
      const y = g.y - (g.riser ? lift : 0);
      return (
        <g key={i}>
          <Blobby x={g.x} y={y} scale={g.scale} phase={g.phase} look={look} color={kidTheme.water} edge={kidTheme.waterDeep} />
          {/* The speck being hugged. */}
          <circle cx={g.x + 34 * g.scale * 2} cy={y + 18 * g.scale * 2} r={9 * g.scale * 2} fill="#6b5a4a" />
        </g>
      );
    })}
  </WideLayer>
);

/**
 * **A HAILSTONE WITH A FACE** — round, icy, faceted, frozen-cheerful. Not a
 * Blobby (Blobby is a DROP; the hail are drops that went up the lift and came
 * back as balls). Drawn in a `WideLayer`; `x`,`y` is the ball's centre and `r`
 * its radius in px. `look` −1..1 slides the pupils; `mood` is the mouth.
 */
export const HailBall: React.FC<{
  x: number;
  y: number;
  r: number;
  phase?: number;
  look?: number;
  mood?: "happy" | "calm" | "surprised";
  body?: string;
  edge?: string;
  /** Stony's frost crown. */
  crown?: boolean;
  opacity?: number;
}> = ({ x, y, r, phase = 0, look = 0, mood = "happy", body = HAIL_COLOR.body, edge = HAIL_COLOR.edge, crown = false, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase;
  const bob = Math.sin(t * 1.7) * r * 0.04;
  const blink = (t * 0.37) % 1 > 0.965;
  const cy = y + bob;
  const ex = r * 0.3;
  const ey = cy - r * 0.08;
  const px = look * r * 0.07;
  return (
    <g opacity={opacity}>
      <ellipse cx={x} cy={cy + r * 0.98} rx={r * 0.7} ry={r * 0.12} fill={kidTheme.ink} opacity={0.12} />
      <circle cx={x} cy={cy} r={r} fill={body} stroke={edge} strokeWidth={Math.max(3, r * 0.08)} />
      {/* Facets: two flat pale planes and one shade, so it reads as ICE. */}
      <path d={`M ${x - r * 0.62} ${cy - r * 0.42} L ${x - r * 0.2} ${cy - r * 0.8} L ${x + r * 0.1} ${cy - r * 0.5} Z`} fill="#ffffff" opacity={0.7} />
      <path d={`M ${x + r * 0.35} ${cy + r * 0.55} L ${x + r * 0.8} ${cy + r * 0.2} L ${x + r * 0.7} ${cy + r * 0.62} Z`} fill={edge} opacity={0.22} />
      {/* The face: the series' big eyes, small. */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <ellipse cx={x + sd * ex} cy={ey} rx={r * 0.17} ry={blink ? r * 0.03 : r * 0.21} fill="#ffffff" stroke={kidTheme.ink} strokeWidth={Math.max(2, r * 0.045)} />
          {blink ? null : <circle cx={x + sd * ex + px} cy={ey + r * 0.03} r={r * 0.095} fill={kidTheme.ink} />}
        </g>
      ))}
      {mood === "surprised" ? (
        <ellipse cx={x} cy={cy + r * 0.38} rx={r * 0.09} ry={r * 0.12} fill={kidTheme.ink} />
      ) : (
        <path
          d={`M ${x - r * 0.2} ${cy + r * 0.32} Q ${x} ${cy + r * (mood === "happy" ? 0.5 : 0.36)} ${x + r * 0.2} ${cy + r * 0.32}`}
          stroke={kidTheme.ink}
          strokeWidth={Math.max(2, r * 0.06)}
          strokeLinecap="round"
          fill="none"
        />
      )}
      {crown
        ? [-1, 0, 1].map((k) => (
            <path
              key={k}
              d={`M ${x + k * r * 0.34 - r * 0.13} ${cy - r * 0.9 + Math.abs(k) * r * 0.1} l ${r * 0.13} ${-r * 0.34} l ${r * 0.13} ${r * 0.34} Z`}
              fill="#ffffff"
              stroke={edge}
              strokeWidth={Math.max(2, r * 0.05)}
              strokeLinejoin="round"
            />
          ))
        : null}
    </g>
  );
};

/**
 * **THE HAIL CROWD** — hailstones with faces, frozen, silent
 * (crowd-with-faces rule). Roll-call names, same order both firings: Hail,
 * Hailey, other Hail, Hail the third, Stony. `HAIL_NAMED` are their marks in
 * the penthouse (Scene 6); the act-3 lawn restages the same five (same
 * `phase`, same radius ratio — the same bodies).
 */
export const HAIL_COLOR = { body: "#e6f4ff", edge: "#5b87b3" } as const;

export const HAIL_NAMED = [
  { name: "Hail", x: 300, y: 800, r: 64, phase: 0.4 },
  { name: "Hailey", x: 560, y: 836, r: 58, phase: 2.1 },
  { name: "other Hail", x: 1300, y: 830, r: 62, phase: 3.7 },
  { name: "Hail the third", x: 1560, y: 800, r: 60, phase: 5.2 },
] as const;

/**
 * **STONY** — the big one, the most trips up and down the tower. THE SAME
 * BODY at the penthouse (Scene 6), up and down the section (Scene 8), on the
 * step (Scene 18) and last to melt (Scene 22): greyer ice, the frost crown,
 * the same phase. Never restyle him; scale him with `r`.
 */
export const STONY = { r: 96, phase: PHASE.stony, body: "#d7e3ee", edge: "#4c6f93" } as const;

export const Stony: React.FC<{ x: number; y: number; r?: number; look?: number; mood?: "happy" | "calm" | "surprised"; melt?: number }> = ({
  x,
  y,
  r = STONY.r,
  look = 0,
  mood = "calm",
  melt = 0,
}) => (
  <WideLayer>
    <HailBall
      x={x}
      y={y + melt * r * 0.6}
      r={r * (1 - 0.45 * melt)}
      phase={STONY.phase}
      look={look}
      mood={mood}
      body={STONY.body}
      edge={STONY.edge}
      crown={melt < 0.8}
      opacity={1 - 0.6 * melt}
    />
  </WideLayer>
);

export const HailCrowd: React.FC<{
  look?: number;
  /** Extra anonymous hail filling the room behind the named four. */
  extras?: number;
  dy?: number;
  mood?: "happy" | "calm" | "surprised";
  /** Side-to-side rubbing, 0..1 (the crackle being built). */
  rub?: number;
}> = ({ look = 0, extras = 9, dy = 0, mood = "happy", rub = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer>
      {Array.from({ length: extras }, (_, i) => {
        const x = 200 + ((i * 431) % 1520);
        const y = 640 - ((i * 47) % 3) * 44 + dy;
        const dx = Math.sin(t * 2.2 + i) * 18 * rub;
        return <HailBall key={`e${i}`} x={x + dx} y={y} r={34} phase={(i * 0.9) % 6} look={look} mood="calm" opacity={0.8} />;
      })}
      {HAIL_NAMED.map((h, i) => (
        <HailBall key={h.name} x={h.x + Math.sin(t * 2.4 + i * 1.7) * 22 * rub} y={h.y + dy} r={h.r} phase={h.phase} look={look} mood={mood} />
      ))}
    </WideLayer>
  );
};

/**
 * **Cloudia's hair standing up** — STATIC, the picture before the word. Five
 * wisps off her crown; `amount` 0 lies flat, 1 stands straight up and
 * crackles. Positioned off her own mark so it rides her.
 */
export const StaticHair: React.FC<{ x: number; y: number; scale?: number; amount?: number }> = ({
  x,
  y,
  scale = 1,
  amount = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // Her crown: the top of her tallest puff, local y −122 in a 380 box.
  const crownY = y + 190 - (190 + 122) * scale;
  const a = Math.max(0, Math.min(1, amount));
  return (
    <WideLayer>
      {[-2, -1, 0, 1, 2].map((k) => {
        const bx = x + (k * 44 - 46) * scale;
        const by = crownY + Math.abs(k) * 12 * scale;
        const len = (36 + 30 * a) * scale;
        const ang = (k * 18 * (1 - a) + k * 9 * a) * (Math.PI / 180) - (Math.PI / 2) * (0.35 + 0.65 * a);
        const jit = a * Math.sin(t * 17 + k * 2) * 4 * scale;
        const ex = bx + Math.cos(ang) * len + jit;
        const ey = by + Math.sin(ang) * len;
        return (
          <path
            key={k}
            d={`M ${bx} ${by} Q ${bx + (ex - bx) * 0.3 + 8 * scale} ${by + (ey - by) * 0.5} ${ex} ${ey}`}
            stroke="#f4f6fb"
            strokeWidth={14 * scale}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
      {a > 0.6
        ? [0, 1].map((k) =>
            Math.sin(t * 13 + k * 3) > 0.4 ? (
              <path
                key={`s${k}`}
                d={`M ${x + (k ? 60 : -110) * scale} ${crownY - 70 * scale} l ${10 * scale} ${-14 * scale} l ${8 * scale} ${12 * scale} l ${10 * scale} ${-14 * scale}`}
                stroke="#fff3a0"
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
              />
            ) : null,
          )
        : null}
    </WideLayer>
  );
};

/**
 * **Sunny behind the tower** (Scene 5 to Scene 22): a glow at the cloud's
 * edge, and his bubbles come from the glow. `x`,`y` is the glow's centre on
 * the tower's rim.
 */
export const SunnyGlow: React.FC<{ x: number; y: number; r?: number; strength?: number; speaking?: boolean }> = ({
  x,
  y,
  r = 160,
  strength = 1,
  speaking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = speaking ? 0.12 * Math.abs(Math.sin((frame / fps) * 9)) : 0.04 * Math.sin((frame / fps) * 1.5);
  return (
    <div
      style={{
        position: "absolute",
        left: x - r * 2,
        top: y - r * 2,
        width: r * 4,
        height: r * 4,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(255,232,128,${(0.85 * strength + pulse).toFixed(3)}) 0%, rgba(255,200,80,${(0.42 * strength).toFixed(3)}) 34%, rgba(255,190,70,0) 70%)`,
        pointerEvents: "none",
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Placeholder scenes (everything the act waves have not staged yet)
// ---------------------------------------------------------------------------

function sceneNumber(id: string): number {
  const n = Number(id.slice(1, 3));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Stand-in for an unstaged scene: the real dialogue in the real voices, the
 * cast mouthing their own lines — in the RIGHT WORLD (the window from Scene 2
 * to the end card, with the volcano on the horizon, the fingers climbing on
 * every count, Flash on every count run, and Boom rolling in under it) — just
 * no direction. Drop the finished scene into its act's map and the timeline
 * does not move by a frame.
 */
export const ScenePlaceholder: React.FC<{ scene: TimedScene; title?: string }> = ({ scene, title }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const lineKey = useLineKey(scene);
  const n = sceneNumber(scene.id);
  const speakers = new Set((scene.turns ?? []).map((t) => t.speaker));
  const runs = countRuns(scene);
  const flashes = runs.map(flashFor);
  const fingers = fingersAt(scene, frame);
  // Boom rolls in under each run; he is at the glass from its arrival on.
  const run = runs.find((r) => frame >= flashFor(r) && frame < r.arrive) ?? null;
  // Ten counts and more is "nothing arrives" (Scene 23): no Boom at the glass.
  const arrived = runs.some((r) => frame >= r.arrive && r.count < 10) || (runs.length === 0 && speakers.has("boom"));
  const lastRun = [...runs].reverse().find((r) => frame >= r.arrive);
  const dist = distanceForCount(lastRun?.count ?? run?.count ?? 3);
  const banner = (
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: kidTheme.fontFamily }}>
      <div style={{ fontSize: kidType.label, fontWeight: 900, letterSpacing: 3, color: kidTheme.paper, textShadow: kidInkOutline(4) }}>
        {title ?? scene.id}
      </div>
      <div style={{ marginTop: 10, fontSize: kidType.min, fontWeight: 800, letterSpacing: 2, color: kidTheme.paper, textShadow: kidInkOutline(3) }}>
        {lineKey ?? "…"} · staging to come
      </div>
    </div>
  );
  const boomCast: Cast = { boom: boomMark(BOOM_AT_GLASS.x, BOOM_AT_GLASS.y, 0.8, dist, "right") };
  const others = (
    <>
      {speakers.has("sunny") ? <SunnyGlow x={1720} y={150} speaking={stage.speaking("sunny")} /> : null}
      {speakers.has("cloudia") ? (
        <Cloudia x={1500} y={hover("cloudia", 230, 0.5)} scale={0.5} phase={PHASE.cloudia} fill={0.6} emotion="happy" speaking={stage.speaking("cloudia")} />
      ) : null}
      {speakers.has("drip") ? (
        <Drip x={1240} y={hover("drip", 330, 0.42)} scale={0.42} phase={PHASE.drip} emotion="happy" speaking={stage.speaking("drip")} shadow={false} />
      ) : null}
      {speakers.has("puff") ? (
        <Puff x={1100} y={hover("puff", 260, 0.6)} scale={0.6} opacity={0.6} phase={PHASE.puff} emotion="happy" speaking={stage.speaking("puff")} />
      ) : null}
      {speakers.has("blue") ? <PlaceholderBlue scene={scene} /> : null}
    </>
  );
  const boomBody = run ? (
    <Boom
      x={interpolate(frame, [flashFor(run), run.arrive], [1240, BOOM_AT_GLASS.x], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      y={hover("boom", interpolate(frame, [flashFor(run), run.arrive], [GARDEN.horizon - 40, BOOM_AT_GLASS.y], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), 0.8)}
      scale={0.8}
      distance={distanceForCount(run.count) * interpolate(frame, [flashFor(run), run.arrive], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      phase={PHASE.boom}
      walking={1}
      heading={200}
      ringsOnly={n < 9}
    />
  ) : arrived && n >= 9 ? (
    <Boom
      x={BOOM_AT_GLASS.x}
      y={hover("boom", BOOM_AT_GLASS.y, 0.8)}
      scale={0.8}
      distance={dist}
      phase={PHASE.boom}
      speaking={stage.speaking("boom")}
      emotion="happy"
    />
  ) : null;
  return (
    <WindowWorld
      sky={n >= 21 ? "dusk" : n >= 11 ? "dark" : "yellow"}
      // Until the act waves deliver the dark / dusk plates, the light state is
      // a flat wash over the yellow one (STYLE: paint the value).
      tint={n >= 21 ? "rgba(70,50,110,0.42)" : n >= 11 ? "rgba(28,36,66,0.58)" : undefined}
      phase={(scene.from % 900) / 300}
      hotel={{ x: 1250, base: GARDEN.horizon - 24, grow: 1, tone: n >= 11 ? "storm" : "heavy" }}
      flashes={flashes}
      outside={
        <>
          {runs.map((r) => (
            <Flash key={r.from} at={flashFor(r)} from={{ x: 1230, y: 150 }} to={{ x: 1150, y: GARDEN.horizon + 10 }} />
          ))}
          {boomBody}
          {others}
        </>
      }
      kid={{ ...KID_AT_WINDOW, fingers }}
      volcano={{ speaking: stage.speaking("volcano") }}
      overlay={
        <>
          {banner}
          {arrived ? (
            <Bubbles scene={scene} cast={boomCast} text={Object.fromEntries((scene.turns ?? []).filter((t) => t.speaker === "boom").map((t) => [lineKeyOf(t), "…"]))} />
          ) : null}
        </>
      }
    />
  );
};

const PlaceholderBlue: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const box: Box = { x: 360, y: 160, w: 700, h: 240 };
  const p = blueRicochet(frame, box, 6);
  return (
    <Shard who="blue" x={p.x} y={p.y} scale={0.6} heading={p.angle} trail={blueTrail(frame, box, 6)} speaking={useSpeaking(scene, "blue")} look="camera" />
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
  Cloudia,
  Drip,
  Puff,
  Sunny,
  Blobby,
  SpeechBubble,
};
export { Boom, BOOM_BOX, BOOM_COLOR, BOOM_R, BOOM_NEAR, BOOM_FAR, WALK_HZ, boomGrow, boomTravel, distanceForCount } from "./Boom";
export { Flash, FlashSky, FLASH_FRAMES, FLASH_COLOR, flashLevel, flashOn, roomFlash } from "./Flash";
export { KidAtWindow, KidLying, HAND_SPREAD } from "./Kid";
export {
  BigWordBeat,
  CutFlash,
  KidBackdrop,
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
  VOLCANO_PORTRAIT,
  volcanoFace,
} from "../../../lib/kid";
export { Camera, blueRicochet, blueTrail, shardOf, kidEase as ease, FLASH_FRAMES as FLASH_MAX_FRAMES };
export type { Box };
export type { Cam, Emotion, EmotionInput, LookDirection, ShardName, SpectrumColor };
export type { TimedScene, TimedTurn };
