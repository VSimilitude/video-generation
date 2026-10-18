import React from "react";
import { Series } from "remotion";
import { DialogueAudio, buildTimeline, type Timeline, type TimedScene } from "../../lib/narration";
import type { BranchingSpec, BranchSegment } from "../registry";
import {
  FPS,
  HEIGHT,
  SETTLE_FRAMES,
  WIDTH,
  ScenePlaceholder,
  choicesFrom,
  clipFrames,
  clipOf,
  turnsOf,
  type ChoiceId,
  type Choices,
  type SceneProps,
} from "./scenes/common";
import { INTRO_SCENES } from "./scenes/intro";
import { SUNBEAM_SCENES } from "./scenes/sunbeam";
import { FLOAT_SCENES } from "./scenes/float";
import { HOTEL_SCENES } from "./scenes/hotel";
import { RAIN_SCENES } from "./scenes/rain";
import { SNOW_SCENES } from "./scenes/snow";
import { STREAM_SCENES } from "./scenes/stream";
import { RIVER_SCENES } from "./scenes/river";
import { UNDERGROUND_SCENES } from "./scenes/underground";
import { ENDING_SCENES } from "./scenes/ending";

// "Drip Chooses the Way Up" — Little Big World, the choose-your-own-adventure
// demo (docs/CYOA.md; phase 1.5, the expansion: src/videos/drip-fork/
// expansion-brief.md). Episode one's cast, episode one's staging kit, the whole
// water-cycle day as one tree:
//
//   intro ─┬─ sunbeam ─┐
//          └─ float ───┴─ hotel ─┬─ rain ─┐
//                                └─ snow ─┴─ stream ─┬─ river ──────┐
//                                                    └─ underground ┴─ ending
//
// ONE composition, ten segments laid out end to end in the order below. That
// layout is the whole trick: the site player mounts the composition once and
// *seeks* between segments, so a branch handoff is a seek rather than a
// remount, and `remotion render` / Studio still see one linear video with every
// segment in it — which is what the every-frame validation gate needs.
//
// The composition stays a pure function of frame + props. The viewer's choices
// reach it only as `path` (Player inputProps), and they change exactly two
// things: which clip a VARIANT line plays (ten clips, in three shared
// segments — brief ruling 2), and the small pictures that go with them. Branch
// segments carry no variants at all: everything else plays identically under
// every history, because the merge rule in docs/CYOA.md says it must.

export { FPS, WIDTH, HEIGHT };

/** The branch nodes, in layout order. `id` is what the path state records. */
export type SegmentId =
  | "intro"
  | "sunbeam"
  | "float"
  | "hotel"
  | "rain"
  | "snow"
  | "stream"
  | "river"
  | "underground"
  | "ending";

const SEGMENT_ORDER: SegmentId[] = [
  "intro",
  "sunbeam",
  "float",
  "hotel",
  "rain",
  "snow",
  "stream",
  "river",
  "underground",
  "ending",
];

/**
 * A line of a shared segment that differs by path: the same beat, one clip per
 * option of an earlier choice (two tagged variants, docs/CYOA.md amendment 2).
 *
 * The composition's frame layout cannot depend on the path — the player seeks
 * by frame offsets computed once — so the slot is sized for the LONGER clip,
 * and the shorter one plays from the same frame and leaves the difference as
 * silence before the next line.
 */
export type VariantLine = {
  by: ChoiceId;
  keys: Record<string, string>;
};
type Line = string | VariantLine;

type SceneSpec = {
  id: string;
  seg: SegmentId;
  /** Line keys for this scene, in playback order. */
  lines: Line[];
  /** Per-line silence *after* a line, when a beat needs room. */
  gaps?: Record<string, number>;
  /**
   * Silent frames before the first line. Every segment's first scene gets at
   * least `SETTLE_FRAMES` of it (brief ruling 5): the player can overshoot a
   * seam and show those frames before the seek lands, so nothing — not even a
   * voice — starts there. (The three phase-1 segments predate this and open on
   * a visual hold instead; their timing is unchanged.)
   */
  lead?: number;
  minFrames?: number;
  tailFrames?: number;
};

const v = (by: ChoiceId, keys: Record<string, string>): VariantLine => ({ by, keys });

/** The variant beats. Ten clips — brief ruling 2 — and no more. */
export const VARIANTS = {
  greeting: v("wayUp", { sunbeam: "ho_01a_cloudia", float: "ho_01b_cloudia" }),
  hello: v("wayDown", { rain: "st_02a_drip", snow: "st_02b_drip" }),
  creditUp: v("wayUp", { sunbeam: "en_04a_sunny", float: "en_04b_sunny" }),
  creditDown: v("wayDown", { rain: "en_05a_sunny", snow: "en_05b_sunny" }),
  creditHome: v("whereTo", { river: "en_06a_sunny", underground: "en_06b_sunny" }),
};

/** The key a line plays on a given path. */
function keyFor(line: Line, choices: Choices): string {
  return typeof line === "string" ? line : line.keys[choices[line.by]];
}

/** The longest clip a line can play — what its slot is sized for. */
function layoutKey(line: Line): string {
  if (typeof line === "string") return line;
  return Object.values(line.keys).reduce((a, b) => (clipFrames(b) > clipFrames(a) ? b : a));
}

/** Gap lookup that understands variant lines (any of their keys may name it). */
function gapsFor(spec: SceneSpec): Record<string, number> | undefined {
  if (!spec.gaps) return undefined;
  const out: Record<string, number> = { ...spec.gaps };
  for (const line of spec.lines) {
    if (typeof line === "string") continue;
    const named = Object.values(line.keys).find((k) => spec.gaps?.[k] !== undefined);
    if (named) out[layoutKey(line)] = spec.gaps[named];
  }
  return out;
}

/**
 * The whole tree, scene by scene. Tails run longer than the suite default (15):
 * this is a show for six-year-olds and every cut wants a breath after the line.
 * Every choice segment ends on a generous tail — the card sits on those frames.
 */
const SCRIPT: SceneSpec[] = [
  // --- INTRO — the shared trunk (phase 1, unchanged) ----------------------
  { id: "in_home", seg: "intro", lines: ["in_01_narrator", "in_02_drip", "in_03_drip"], tailFrames: 26 },
  {
    id: "in_fork",
    seg: "intro",
    lines: ["in_04_sunny", "in_05_narrator", "in_06_drip", "in_07_narrator"],
    // "I cannot pick!" is a punchline; the question that follows it is the
    // whole point of the segment, so both get room (docs/STYLE.md, comedy
    // pacing: never let the next line begin under the punchline).
    gaps: { in_06_drip: 26 },
    // The player pauses HERE and overlays the choice card. These frames are on
    // screen for as long as a six-year-old takes to decide, so they are a held
    // pose with a generous tail rather than the tail end of a move.
    tailFrames: 45,
  },

  // --- SUNBEAM — the fast way up (phase 1, unchanged) ---------------------
  {
    id: "sa_launch",
    seg: "sunbeam",
    lines: ["sa_01_sunny", "sa_02_drip", "sa_03_narrator"],
    tailFrames: 26,
  },
  { id: "sa_arrive", seg: "sunbeam", lines: ["sa_04_sunny", "sa_05_drip"], tailFrames: 34 },

  // --- FLOAT — the slow way up (phase 1, unchanged) -----------------------
  { id: "fl_warm", seg: "float", lines: ["fl_01_narrator", "fl_02_drip"], tailFrames: 26 },
  {
    id: "fl_sights",
    seg: "float",
    lines: ["fl_03_narrator", "fl_04_drip", "fl_05_narrator"],
    // "It took a while. Nobody minded." is deadpan, and deadpan needs the
    // silence in front of it.
    gaps: { fl_04_drip: 30 },
    tailFrames: 34,
  },

  // --- HOTEL — shared trunk 1; ends on choice 2 ---------------------------
  // The greeting keeps phase 1's timing exactly: Cloudia's clip at frame 30
  // (the settle plus her entrance), forty frames of tail after the longer
  // variant — and then Drip's boast, which used to open the old wrap scene.
  {
    id: "ho_greeting",
    seg: "hotel",
    lines: [VARIANTS.greeting, "ho_02_drip"],
    gaps: { ho_01a_cloudia: 12 },
    lead: 30,
    tailFrames: 30,
  },
  { id: "ho_rules", seg: "hotel", lines: ["ho_03_cloudia", "ho_04_drip"], gaps: { ho_03_cloudia: 14 }, tailFrames: 34 },
  {
    id: "ho_fill",
    seg: "hotel",
    lines: ["ho_05_narrator", "ho_06_cloudia", "ho_07_narrator"],
    gaps: { ho_06_cloudia: 16 },
    tailFrames: 26,
  },
  {
    id: "ho_exits",
    seg: "hotel",
    lines: ["ho_08_cloudia", "ho_09_drip", "ho_10_narrator"],
    // Same shape as in_fork: the punchline gets its gap, the question its
    // room, and the card a held tail.
    gaps: { ho_08_cloudia: 12, ho_09_drip: 26 },
    tailFrames: 45,
  },

  // --- RAIN — the fast way down -------------------------------------------
  {
    id: "ra_drop",
    seg: "rain",
    lines: ["ra_01_cloudia", "ra_02_drip"],
    lead: SETTLE_FRAMES + 6,
    gaps: { ra_01_cloudia: 10 },
    tailFrames: 20,
  },
  { id: "ra_slide", seg: "rain", lines: ["ra_03_narrator", "ra_04_drip"], tailFrames: 24 },
  {
    id: "ra_land",
    seg: "rain",
    lines: ["ra_05_narrator", "ra_06_drip", "ra_07_narrator"],
    // "He lived there for about four seconds." is deadpan: silence in front.
    gaps: { ra_05_narrator: 12, ra_06_drip: 32 },
    tailFrames: 34,
  },

  // --- SNOW — the slow way down, and a whole winter -----------------------
  {
    id: "sn_roof",
    seg: "snow",
    lines: ["sn_01_cloudia", "sn_02_narrator", "sn_03_drip"],
    lead: SETTLE_FRAMES + 6,
    gaps: { sn_02_narrator: 14 },
    tailFrames: 30,
  },
  { id: "sn_drift", seg: "snow", lines: ["sn_04_narrator", "sn_05_drip"], gaps: { sn_04_narrator: 14 }, tailFrames: 30 },
  {
    id: "sn_winter",
    seg: "snow",
    lines: ["sn_06_narrator", "sn_07_drip", "sn_08_narrator", "sn_09_sunny", "sn_10_drip"],
    // The winter passes on screen in the two long holds either side of
    // "Still waiting. Still fancy." (brief: long hold before and after).
    gaps: { sn_06_narrator: 66, sn_07_drip: 66, sn_09_sunny: 14 },
    tailFrames: 36,
  },

  // --- STREAM — shared trunk 2; ends on choice 3 --------------------------
  {
    id: "st_downhill",
    seg: "stream",
    lines: ["st_01_narrator", VARIANTS.hello],
    lead: SETTLE_FRAMES + 6,
    tailFrames: 26,
  },
  {
    id: "st_fork",
    seg: "stream",
    lines: ["st_03_narrator", "st_04_drip", "st_05_narrator"],
    gaps: { st_04_drip: 26 },
    tailFrames: 45,
  },

  // --- RIVER — home the long way round ------------------------------------
  {
    id: "ri_flower",
    seg: "river",
    lines: ["ri_01_narrator", "ri_02_narrator", "ri_03_drip"],
    lead: SETTLE_FRAMES + 6,
    gaps: { ri_02_narrator: 12 },
    tailFrames: 30,
  },
  { id: "ri_moose", seg: "river", lines: ["ri_04_narrator", "ri_05_drip"], gaps: { ri_04_narrator: 16 }, tailFrames: 30 },
  {
    id: "ri_wants",
    seg: "river",
    lines: ["ri_06_narrator", "ri_07_drip", "ri_08_narrator"],
    gaps: { ri_07_drip: 14 },
    tailFrames: 34,
  },

  // --- UNDERGROUND — home the secret way ----------------------------------
  {
    id: "ug_dark",
    seg: "underground",
    lines: ["ug_01_narrator", "ug_02_drip", "ug_03_narrator"],
    lead: SETTLE_FRAMES + 6,
    tailFrames: 26,
  },
  {
    id: "ug_worms",
    seg: "underground",
    lines: ["ug_04_drip", "ug_05_narrator", "ug_06_drip"],
    // The roll call's shape: names, one flat line, an unbothered button —
    // each with room in front of it.
    gaps: { ug_04_drip: 22, ug_05_narrator: 20 },
    tailFrames: 30,
  },
  {
    id: "ug_spring",
    seg: "underground",
    lines: ["ug_07_narrator", "ug_08_narrator", "ug_09_drip"],
    gaps: { ug_07_narrator: 12, ug_08_narrator: 12 },
    tailFrames: 34,
  },

  // --- ENDING — shared trunk 3; Sunny's credits honour every choice -------
  {
    id: "en_home",
    seg: "ending",
    lines: ["en_01_narrator", "en_02_drip"],
    lead: SETTLE_FRAMES + 6,
    gaps: { en_01_narrator: 12 },
    tailFrames: 26,
  },
  {
    id: "en_credits",
    seg: "ending",
    lines: [
      "en_03_sunny",
      VARIANTS.creditUp,
      VARIANTS.creditDown,
      VARIANTS.creditHome,
      "en_07_narrator",
    ],
    gaps: {
      en_03_sunny: 14,
      en_04a_sunny: 14,
      en_05a_sunny: 14,
      // The narrator's flat verdict lands in silence.
      en_06a_sunny: 24,
    },
    tailFrames: 30,
  },
  {
    id: "en_circle",
    seg: "ending",
    lines: ["en_08_drip", "en_09_narrator"],
    gaps: { en_08_drip: 20 },
    // The site's end card lands on these frames.
    tailFrames: 50,
  },
];

/**
 * The composition's one frame layout, the same for every path: each variant
 * slot sized for its longest clip. `buildTimeline` does the arithmetic; `lead`
 * is applied on top, by shifting a scene's turns and re-chaining `from`.
 */
export function timeline(): Timeline {
  const built = buildTimeline(
    SCRIPT.map((spec) => ({
      id: spec.id,
      turns: turnsOf(spec.lines.map(layoutKey), { gaps: gapsFor(spec) }),
      minFrames: spec.minFrames,
      tailFrames: spec.tailFrames ?? 24,
    })),
    FPS,
  );
  let from = 0;
  const scenes = built.scenes.map((scene, i) => {
    const lead = SCRIPT[i].lead ?? 0;
    const shifted: TimedScene = {
      ...scene,
      from,
      durationInFrames: scene.durationInFrames + lead,
      turns: scene.turns?.map((t) => ({ ...t, from: t.from + lead })),
    };
    from += shifted.durationInFrames;
    return shifted;
  });
  return { scenes, durationInFrames: Math.max(1, from) };
}

/**
 * One scene as a given path hears it: each variant turn plays the chosen clip,
 * from the slot's own frame, for the chosen clip's own length — so mouths,
 * bubbles and `lineWindow` all follow the clip that is actually playing.
 */
export function resolveScene(scene: TimedScene, choices: Choices): TimedScene {
  const spec = SCRIPT.find((s) => s.id === scene.id);
  if (!spec || !scene.turns || spec.lines.every((l) => typeof l === "string")) return scene;
  return {
    ...scene,
    turns: scene.turns.map((turn, i) => {
      const line = spec.lines[i];
      if (typeof line === "string") return turn;
      const key = keyFor(line, choices);
      return { ...turn, clip: clipOf(key), durationInFrames: clipFrames(key) };
    }),
  };
}

const SCENES: Record<string, React.FC<SceneProps>> = {
  ...INTRO_SCENES,
  ...SUNBEAM_SCENES,
  ...FLOAT_SCENES,
  ...HOTEL_SCENES,
  ...RAIN_SCENES,
  ...SNOW_SCENES,
  ...STREAM_SCENES,
  ...RIVER_SCENES,
  ...UNDERGROUND_SCENES,
  ...ENDING_SCENES,
};

/** A scene not staged yet: the real lines, in the real voices, cast mouthing. */
const Placeholder: React.FC<SceneProps> = ({ scene }) => (
  <ScenePlaceholder scene={scene} title={`${scene.id} · placeholder`} />
);

export const DripForkVideo: React.FC<{ path?: Record<string, string> }> = ({ path }) => {
  // The only thing the viewer's choices change inside the composition. Read
  // once, as data; no hook anywhere is conditional on it.
  const choices = choicesFrom(path);
  const { scenes } = timeline();
  return (
    <Series>
      {scenes.map((timed) => {
        const scene = resolveScene(timed, choices);
        const Scene = SCENES[scene.id] ?? Placeholder;
        return (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
            <DialogueAudio scene={scene} />
            <Scene scene={scene} choices={choices} />
          </Series.Sequence>
        );
      })}
    </Series>
  );
};

// ---------------------------------------------------------------------------
// The branch graph
// ---------------------------------------------------------------------------

/**
 * Site-relative mp3s a segment can play, straight from the manifest. A variant
 * line contributes EVERY one of its clips: the player cannot know which one a
 * viewer will hear until they have already chosen. They are ~30 KB each.
 */
function preloadFor(seg: SegmentId): string[] {
  return SCRIPT.filter((s) => s.seg === seg).flatMap((s) =>
    s.lines.flatMap((line) =>
      (typeof line === "string" ? [line] : Object.values(line.keys)).map((key) => clipOf(key).file),
    ),
  );
}

/**
 * The branch graph, computed from `timeline()` — every frame number in here is
 * derived, never typed in, so re-running `npm run narration` moves the segment
 * boundaries and the player follows automatically.
 */
export function branching(): BranchingSpec {
  const { scenes } = timeline();
  const segOf = new Map(SCRIPT.map((s) => [s.id, s.seg]));

  const bounds = (seg: SegmentId) => {
    const mine = scenes.filter((s) => segOf.get(s.id) === seg);
    if (mine.length === 0) throw new Error(`[drip-fork] no scenes in segment "${seg}"`);
    return {
      from: mine[0].from,
      durationInFrames: mine.reduce((n, s) => n + s.durationInFrames, 0),
    };
  };

  const segments: BranchSegment[] = SEGMENT_ORDER.map((seg) => ({
    id: seg,
    ...bounds(seg),
    next: NEXT[seg],
    preload: preloadFor(seg),
  }));

  return { start: "intro", segments };
}

const card = (key: string) => `narration/drip-fork/${key}.mp3`;

const NEXT: Record<SegmentId, BranchSegment["next"]> = {
  intro: {
    kind: "choice",
    id: "wayUp",
    prompt: "How should Drip go up?",
    promptNarrationFile: card("ch_01_narrator"),
    options: [
      {
        id: "sunbeam",
        label: "Zoom with Sunny!",
        emoji: "☀️",
        to: "sunbeam",
        narrationFile: card("ch_02_narrator"),
      },
      {
        id: "float",
        label: "Float up slow!",
        emoji: "☁️",
        to: "float",
        narrationFile: card("ch_03_narrator"),
      },
    ],
  },
  // Each fast branch is followed in the layout by its slow sibling, so it has
  // to jump the sibling to reach the merge; each slow one is already adjacent.
  sunbeam: { kind: "jump", to: "hotel" },
  float: { kind: "continue" },
  hotel: {
    kind: "choice",
    id: "wayDown",
    prompt: "How should Drip come down?",
    promptNarrationFile: card("ch_04_narrator"),
    options: [
      {
        id: "rain",
        label: "Rain down fast!",
        emoji: "☔",
        to: "rain",
        narrationFile: card("ch_05_narrator"),
      },
      {
        id: "snow",
        label: "Snow down slow!",
        emoji: "❄️",
        to: "snow",
        narrationFile: card("ch_06_narrator"),
      },
    ],
  },
  rain: { kind: "jump", to: "stream" },
  snow: { kind: "continue" },
  stream: {
    kind: "choice",
    id: "whereTo",
    prompt: "Which way should Drip go home?",
    promptNarrationFile: card("ch_07_narrator"),
    options: [
      {
        id: "river",
        label: "Down the river!",
        emoji: "🏞️",
        to: "river",
        narrationFile: card("ch_08_narrator"),
      },
      {
        id: "underground",
        label: "Under the ground!",
        emoji: "🕳️",
        to: "underground",
        narrationFile: card("ch_09_narrator"),
      },
    ],
  },
  river: { kind: "jump", to: "ending" },
  underground: { kind: "continue" },
  ending: { kind: "end" },
};
