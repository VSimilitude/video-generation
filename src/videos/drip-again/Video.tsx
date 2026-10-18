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
import { VALLEY_SCENES } from "./scenes/valley";
import { DAM_SCENES } from "./scenes/dam";
import { MOUNTAIN_SCENES } from "./scenes/mountain";
import { RACE_SCENES } from "./scenes/race";
import { POND_SCENES } from "./scenes/pond";
import { OVER_SCENES } from "./scenes/over";
import { LODGE_SCENES } from "./scenes/lodge";
import { HOME_SCENES } from "./scenes/home";

// "Drip Goes Up Again" — Little Big World, the second choose-your-own-adventure
// demo (docs/CYOA.md; src/videos/drip-again/brief.md is the design). Built
// exactly as DripChooses is (src/videos/drip-fork/Video.tsx): ONE composition,
// nine segments laid out end to end, and the site player seeks between them.
//
//   intro ─┬─ valley ──(left|right)── dam ───┐
//          └─ mountain ─(left|right)── race ─┴─ pond ─┬─ over ──┐
//                                                     └─ lodge ─┴─ home
//
// Two full choices (`where`, `wayOut`) and a HALF-CHOICE inside each first
// branch (`valleyWay`, `mountainWay`): a real card, but both options go to the
// same next segment, which swaps a few clips and pictures. Eight paths.
//
// The composition stays a pure function of frame + props. The viewer's choices
// reach it only as `path` (Player inputProps), and change exactly two things:
// which clip a VARIANT line plays (twenty clips — brief ruling 3), and the
// small path-read pictures that go with them.

export { FPS, WIDTH, HEIGHT };

/** The branch nodes, in layout order. */
export type SegmentId =
  | "intro"
  | "valley"
  | "dam"
  | "mountain"
  | "race"
  | "pond"
  | "over"
  | "lodge"
  | "home";

const SEGMENT_ORDER: SegmentId[] = [
  "intro",
  "valley",
  "dam",
  "mountain",
  "race",
  "pond",
  "over",
  "lodge",
  "home",
];

/**
 * A line of a segment that differs by path: the same beat, one clip per
 * flavour. DripChooses keyed every variant on ONE choice; `hm_04` here keys on
 * a pair (`where` + that branch's half-choice), so the line carries its own
 * `pick` plus the list of every key it can play (for layout and preload).
 *
 * The frame layout cannot depend on the path, so the slot is sized for the
 * LONGEST clip; a shorter one plays from the same frame and leaves the
 * difference as silence before the next line.
 */
export type VariantLine = {
  keys: string[];
  pick: (choices: Choices) => string;
};
type Line = string | VariantLine;

type SceneSpec = {
  id: string;
  seg: SegmentId;
  lines: Line[];
  /** Per-line silence *after* a line. A variant may be named by any of its keys. */
  gaps?: Record<string, number>;
  /** Silent frames before the first line (SETTLE_FRAMES + 6 on segment heads). */
  lead?: number;
  minFrames?: number;
  tailFrames?: number;
};

/** A variant keyed on one choice: `{ option: key }`. */
const v = <C extends ChoiceId>(by: C, keys: Record<Choices[C], string>): VariantLine => ({
  keys: Object.values(keys) as string[],
  pick: (choices) => keys[choices[by]],
});

/** The variant beats. Twenty clips (brief ruling 3), and no more. */
export const VARIANTS = {
  damFall: v("valleyWay", { left: "da_01a_narrator", right: "da_01b_narrator" }),
  damHello: v("valleyWay", { left: "da_02a_drip", right: "da_02b_drip" }),
  damWall: v("valleyWay", { left: "da_03a_narrator", right: "da_03b_narrator" }),
  raceDown: v("mountainWay", { left: "rc_01a_narrator", right: "rc_01b_narrator" }),
  raceResult: v("mountainWay", { left: "rc_02a_drip", right: "rc_02b_drip" }),
  raceMeet: v("mountainWay", { left: "rc_03a_narrator", right: "rc_03b_narrator" }),
  beaverHello: v("where", { valley: "po_01a_beaver", mountain: "po_01b_beaver" }),
  /** Four flavours: the branch, and the half-choice inside it. */
  creditWhere: {
    keys: ["hm_04a_sunny", "hm_04b_sunny", "hm_04c_sunny", "hm_04d_sunny"],
    pick: (c: Choices) =>
      c.where === "valley"
        ? c.valleyWay === "left"
          ? "hm_04a_sunny"
          : "hm_04b_sunny"
        : c.mountainWay === "left"
          ? "hm_04c_sunny"
          : "hm_04d_sunny",
  } satisfies VariantLine,
  creditOut: v("wayOut", { over: "hm_05a_sunny", lodge: "hm_05b_sunny" }),
};

function keyFor(line: Line, choices: Choices): string {
  return typeof line === "string" ? line : line.pick(choices);
}

/** The longest clip a line can play — what its slot is sized for. */
function layoutKey(line: Line): string {
  if (typeof line === "string") return line;
  return line.keys.reduce((a, b) => (clipFrames(b) > clipFrames(a) ? b : a));
}

function gapsFor(spec: SceneSpec): Record<string, number> | undefined {
  if (!spec.gaps) return undefined;
  const out: Record<string, number> = { ...spec.gaps };
  for (const line of spec.lines) {
    if (typeof line === "string") continue;
    const named = line.keys.find((k) => spec.gaps?.[k] !== undefined);
    if (named) out[layoutKey(line)] = spec.gaps[named];
  }
  return out;
}

const HEAD = SETTLE_FRAMES + 6;

/**
 * The whole tree, scene by scene. Every segment's first scene opens on
 * `HEAD` silent frames (ruling 6); every choice scene ends on a 45-frame tail
 * the card sits on.
 */
const SCRIPT: SceneSpec[] = [
  // --- INTRO — shared trunk; ends on `where` --------------------------------
  {
    id: "in_home",
    seg: "intro",
    lines: ["in_01_narrator", "in_02_drip", "in_03_narrator"],
    lead: HEAD,
    gaps: { in_02_drip: 14 },
    tailFrames: 20,
  },
  { id: "in_launch", seg: "intro", lines: ["in_04_sunny", "in_05_drip"], gaps: { in_04_sunny: 10 }, tailFrames: 24 },
  {
    id: "in_closed",
    seg: "intro",
    lines: ["in_06_narrator", "in_07_narrator", "in_08_drip"],
    gaps: { in_06_narrator: 14, in_07_narrator: 16 },
    // "No Kevin." gets its room before the cut.
    tailFrames: 30,
  },
  { id: "in_cloud", seg: "intro", lines: ["in_09_narrator"], tailFrames: 24 },
  {
    id: "in_winds",
    seg: "intro",
    lines: ["in_10_narrator", "in_11_drip", "in_12_narrator"],
    gaps: { in_10_narrator: 10, in_11_drip: 26 },
    tailFrames: 45,
  },

  // --- VALLEY — branch; ends on the half-choice `valleyWay` -----------------
  { id: "va_cloud", seg: "valley", lines: ["va_01_narrator", "va_02_drip"], lead: HEAD, tailFrames: 16 },
  {
    id: "va_sides",
    seg: "valley",
    lines: ["va_03_narrator", "va_04_drip", "va_05_narrator"],
    gaps: { va_03_narrator: 10, va_04_drip: 26 },
    tailFrames: 45,
  },

  // --- DAM — after valleyWay; the opening is its variant --------------------
  {
    id: "da_arrive",
    seg: "dam",
    lines: [VARIANTS.damFall, VARIANTS.damHello, VARIANTS.damWall],
    lead: HEAD,
    gaps: { da_01a_narrator: 8, da_02a_drip: 12 },
    tailFrames: 20,
  },
  {
    id: "da_dam",
    seg: "dam",
    lines: ["da_04_drip", "da_05_beaver", "da_06_drip", "da_07_beaver"],
    // The repetition gag: flat, with room in front of each "Dam." (ruling 8).
    gaps: { da_04_drip: 14, da_05_beaver: 16, da_06_drip: 16 },
    tailFrames: 20,
  },
  { id: "da_teeth", seg: "dam", lines: ["da_08_narrator", "da_09_drip"], gaps: { da_08_narrator: 12 }, tailFrames: 20 },
  { id: "da_pond", seg: "dam", lines: ["da_10_narrator"], tailFrames: 34 },

  // --- MOUNTAIN — branch; ends on the half-choice `mountainWay` -------------
  {
    id: "mo_land",
    seg: "mountain",
    lines: ["mo_01_narrator", "mo_02_drip", "mo_03_narrator", "mo_04_drip"],
    lead: HEAD,
    gaps: { mo_02_drip: 8, mo_03_narrator: 8 },
    tailFrames: 16,
  },
  {
    id: "mo_burp",
    seg: "mountain",
    lines: ["mo_05_narrator", "mo_06_narrator", "mo_07_drip"],
    // Silence before the burp; the smoke ring has the frames after it.
    lead: 24,
    gaps: { mo_05_narrator: 34, mo_06_narrator: 8 },
    tailFrames: 16,
  },
  {
    id: "mo_sides",
    seg: "mountain",
    lines: ["mo_08_narrator", "mo_09_drip", "mo_10_narrator"],
    gaps: { mo_08_narrator: 10, mo_09_drip: 26 },
    tailFrames: 45,
  },

  // --- RACE — after mountainWay; who wins is its variant --------------------
  {
    id: "rc_race",
    seg: "race",
    lines: [VARIANTS.raceDown, VARIANTS.raceResult],
    lead: HEAD,
    gaps: { rc_01a_narrator: 8 },
    tailFrames: 10,
  },
  {
    id: "rc_hiss",
    seg: "race",
    lines: [VARIANTS.raceMeet, "rc_04_narrator", "rc_05_drip"],
    // Silence before "the lava reached the water", and a beat after it.
    lead: 22,
    gaps: { rc_03a_narrator: 16, rc_04_narrator: 14 },
    tailFrames: 20,
  },
  { id: "rc_wide", seg: "race", lines: ["rc_06_narrator"], tailFrames: 34 },

  // --- POND — shared trunk; ends on `wayOut` --------------------------------
  {
    id: "po_shore",
    seg: "pond",
    lines: [VARIANTS.beaverHello, "po_02_narrator", "po_03_drip", "po_04_beaver"],
    lead: HEAD,
    gaps: { po_01a_beaver: 12, po_03_drip: 14 },
    tailFrames: 24,
  },
  {
    id: "po_exits",
    seg: "pond",
    lines: ["po_05_narrator", "po_06_narrator", "po_07_drip", "po_08_narrator"],
    gaps: { po_05_narrator: 10, po_06_narrator: 10, po_07_drip: 26 },
    tailFrames: 45,
  },

  // --- OVER — over the top --------------------------------------------------
  {
    id: "ov_spill",
    seg: "over",
    lines: ["ov_01_narrator", "ov_02_drip", "ov_03_beaver"],
    lead: HEAD,
    gaps: { ov_01_narrator: 8, ov_02_drip: 16 },
    tailFrames: 20,
  },
  { id: "ov_river", seg: "over", lines: ["ov_04_narrator", "ov_05_drip"], gaps: { ov_04_narrator: 8 }, tailFrames: 34 },

  // --- LODGE — through the beaver's house -----------------------------------
  { id: "lo_door", seg: "lodge", lines: ["lo_01_narrator"], lead: HEAD, tailFrames: 14 },
  {
    id: "lo_room",
    seg: "lodge",
    lines: ["lo_02_drip", "lo_03_narrator", "lo_04_beaver", "lo_05_narrator", "lo_06_drip"],
    // The roll call's shape: names, one flat line, the unbothered button —
    // each with room in front of it.
    gaps: { lo_02_drip: 20, lo_03_narrator: 20, lo_04_beaver: 20, lo_05_narrator: 10 },
    tailFrames: 20,
  },
  { id: "lo_out", seg: "lodge", lines: ["lo_07_narrator"], tailFrames: 34 },

  // --- HOME — shared trunk; Sunny's credits honour every choice -------------
  { id: "hm_home", seg: "home", lines: ["hm_01_narrator", "hm_02_drip"], lead: HEAD, gaps: { hm_01_narrator: 12 }, tailFrames: 24 },
  {
    id: "hm_credits",
    seg: "home",
    lines: ["hm_03_sunny", VARIANTS.creditWhere, VARIANTS.creditOut, "hm_06_narrator"],
    gaps: {
      hm_03_sunny: 14,
      hm_04a_sunny: 14,
      // The narrator's flat verdict lands in silence.
      hm_05a_sunny: 24,
    },
    tailFrames: 26,
  },
  {
    id: "hm_circle",
    seg: "home",
    lines: ["hm_07_drip", "hm_08_narrator"],
    gaps: { hm_07_drip: 20 },
    // The site's end card lands on these frames.
    tailFrames: 50,
  },
];

/** The composition's one frame layout, the same for every path. */
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

/** One scene as a given path hears it: each variant turn plays the chosen clip. */
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
  ...VALLEY_SCENES,
  ...DAM_SCENES,
  ...MOUNTAIN_SCENES,
  ...RACE_SCENES,
  ...POND_SCENES,
  ...OVER_SCENES,
  ...LODGE_SCENES,
  ...HOME_SCENES,
};

/** A scene not staged yet: the real lines, in the real voices, cast mouthing. */
const Placeholder: React.FC<SceneProps> = ({ scene }) => (
  <ScenePlaceholder scene={scene} title={`${scene.id} · placeholder`} />
);

export const DripAgainVideo: React.FC<{ path?: Record<string, string> }> = ({ path }) => {
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

/** Every mp3 a segment can play; a variant line contributes all its clips. */
function preloadFor(seg: SegmentId): string[] {
  return SCRIPT.filter((s) => s.seg === seg).flatMap((s) =>
    s.lines.flatMap((line) =>
      (typeof line === "string" ? [line] : line.keys).map((key) => clipOf(key).file),
    ),
  );
}

/** The branch graph, computed from `timeline()` — no frame number typed in. */
export function branching(): BranchingSpec {
  const { scenes } = timeline();
  const segOf = new Map(SCRIPT.map((s) => [s.id, s.seg]));
  const bounds = (seg: SegmentId) => {
    const mine = scenes.filter((s) => segOf.get(s.id) === seg);
    if (mine.length === 0) throw new Error(`[drip-again] no scenes in segment "${seg}"`);
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

const card = (key: string) => `narration/drip-again/${key}.mp3`;

const NEXT: Record<SegmentId, BranchSegment["next"]> = {
  intro: {
    kind: "choice",
    id: "where",
    prompt: "Where should the wind take Drip?",
    promptNarrationFile: card("ch_01_narrator"),
    options: [
      { id: "valley", label: "The beaver valley!", emoji: "🦫", to: "valley", narrationFile: card("ch_02_narrator") },
      { id: "mountain", label: "The big mountain!", emoji: "🏔️", to: "mountain", narrationFile: card("ch_03_narrator") },
    ],
  },
  // A half-choice: a real card, both options lead to the same next segment.
  valley: {
    kind: "choice",
    id: "valleyWay",
    prompt: "Which side should Drip fall off?",
    promptNarrationFile: card("ch_04_narrator"),
    options: [
      { id: "left", label: "Left, into the river!", emoji: "⬅️", to: "dam", narrationFile: card("ch_05_narrator") },
      { id: "right", label: "Right, onto the tree!", emoji: "➡️", to: "dam", narrationFile: card("ch_06_narrator") },
    ],
  },
  // The valley branch's tail is followed in the layout by the mountain branch,
  // so it jumps to the merge; the race is already adjacent to the pond.
  dam: { kind: "jump", to: "pond" },
  mountain: {
    kind: "choice",
    id: "mountainWay",
    prompt: "Which side should Drip race down?",
    promptNarrationFile: card("ch_07_narrator"),
    options: [
      { id: "left", label: "Left, steep and bumpy!", emoji: "⬅️", to: "race", narrationFile: card("ch_08_narrator") },
      { id: "right", label: "Right, long and lovely!", emoji: "➡️", to: "race", narrationFile: card("ch_09_narrator") },
    ],
  },
  race: { kind: "continue" },
  pond: {
    kind: "choice",
    id: "wayOut",
    prompt: "Which way should Drip get out?",
    promptNarrationFile: card("ch_10_narrator"),
    options: [
      { id: "over", label: "Over the top!", emoji: "🌊", to: "over", narrationFile: card("ch_11_narrator") },
      { id: "lodge", label: "Through the beaver's house!", emoji: "🏠", to: "lodge", narrationFile: card("ch_12_narrator") },
    ],
  },
  over: { kind: "jump", to: "home" },
  lodge: { kind: "continue" },
  home: { kind: "end" },
};
