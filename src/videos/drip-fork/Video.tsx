import React from "react";
import { Series } from "remotion";
import { DialogueAudio, buildTimeline, type Timeline } from "../../lib/narration";
import type { BranchingSpec, BranchSegment } from "../registry";
import { FPS, HEIGHT, WIDTH, clipOf, turnsOf, wayUpFrom, type SceneProps } from "./scenes/common";
import { INTRO_SCENES } from "./scenes/intro";
import { SUNBEAM_SCENES } from "./scenes/sunbeam";
import { FLOAT_SCENES } from "./scenes/float";
import { ENDING_SCENES, endingVariantFiles, greetingMinFrames } from "./scenes/ending";

// "Drip Chooses the Way Up" — Little Big World, the choose-your-own-adventure
// player demo (docs/CYOA.md, phase 1). Episode one's cast, episode one's
// staging kit, one branch point.
//
// ONE composition, four segments laid out end to end in the order
// intro -> sunbeam -> float -> ending. That layout is the whole trick: the
// site player mounts the composition once and *seeks* between segments, so a
// branch handoff is a seek rather than a remount, and `remotion render` /
// Studio still see one linear video with every segment in it — which is what
// the every-frame validation gate needs.
//
// The composition stays a pure function of frame + props. The viewer's choice
// reaches it only as `path` (Player inputProps), and only one scene reads it:
// the ending's greeting, which picks one of two clips. Nothing else in the
// video branches, because nothing else is allowed to — see the merge rule in
// docs/CYOA.md.

export { FPS, WIDTH, HEIGHT };

/** The branch nodes, in layout order. `id` is what the path state records. */
export type SegmentId = "intro" | "sunbeam" | "float" | "ending";

type SceneSpec = {
  id: string;
  seg: SegmentId;
  /** Line keys for this scene, in playback order. */
  lines: string[];
  /** Per-line silence *after* a line, when a beat needs room. */
  gaps?: Record<string, number>;
  minFrames?: number;
  tailFrames?: number;
};

/**
 * Eight scenes, two per segment. Tails run longer than the suite default (15):
 * this is a show for six-year-olds and every cut wants a breath after the line.
 */
const SCRIPT: SceneSpec[] = [
  // --- INTRO — the shared trunk ------------------------------------------
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

  // --- SUNBEAM — the fast way --------------------------------------------
  {
    id: "sa_launch",
    seg: "sunbeam",
    lines: ["sa_01_sunny", "sa_02_drip", "sa_03_narrator"],
    tailFrames: 26,
  },
  { id: "sa_arrive", seg: "sunbeam", lines: ["sa_04_sunny", "sa_05_drip"], tailFrames: 34 },

  // --- FLOAT — the slow way ----------------------------------------------
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

  // --- ENDING — the merged trunk -----------------------------------------
  // No lines: the greeting is the variant insert, and which clip plays is not
  // known until a viewer picks. It is sized as a silent scene long enough for
  // the longer of the two variants (see scenes/ending.tsx) and mounts its own
  // audio.
  { id: "en_greeting", seg: "ending", lines: [], minFrames: greetingMinFrames() },
  {
    id: "en_wrap",
    seg: "ending",
    lines: ["en_02_drip", "en_03_narrator", "en_04_narrator"],
    tailFrames: 50,
  },
];

export function timeline(): Timeline {
  return buildTimeline(
    SCRIPT.map((spec) => ({
      id: spec.id,
      turns: turnsOf(spec.lines, { gaps: spec.gaps }),
      minFrames: spec.minFrames,
      tailFrames: spec.tailFrames ?? 24,
    })),
    FPS,
  );
}

const SCENES: Record<string, React.FC<SceneProps>> = {
  ...INTRO_SCENES,
  ...SUNBEAM_SCENES,
  ...FLOAT_SCENES,
  ...ENDING_SCENES,
};

export const DripForkVideo: React.FC<{ path?: Record<string, string> }> = ({ path }) => {
  // The only thing the viewer's choices change inside the composition. It is
  // read once, as data; no hook anywhere is conditional on it.
  const wayUp = wayUpFrom(path);
  const { scenes } = timeline();
  return (
    <Series>
      {scenes.map((scene) => {
        const Scene = SCENES[scene.id];
        return (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
            <DialogueAudio scene={scene} />
            <Scene scene={scene} wayUp={wayUp} />
          </Series.Sequence>
        );
      })}
    </Series>
  );
};

// ---------------------------------------------------------------------------
// The branch graph
// ---------------------------------------------------------------------------

const SEGMENT_ORDER: SegmentId[] = ["intro", "sunbeam", "float", "ending"];

/** Site-relative mp3s a segment plays, straight from the manifest. */
function preloadFor(seg: SegmentId): string[] {
  const files = SCRIPT.filter((s) => s.seg === seg).flatMap((s) =>
    s.lines.map((key) => clipOf(key).file),
  );
  // The ending can play either greeting, and the player cannot know which until
  // the viewer has already chosen — so it prefetches both. They are ~28 KB.
  return seg === "ending" ? [...endingVariantFiles(), ...files] : files;
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

const NEXT: Record<SegmentId, BranchSegment["next"]> = {
  intro: {
    kind: "choice",
    id: "wayUp",
    prompt: "How should Drip go up?",
    promptNarrationFile: "narration/drip-fork/ch_01_narrator.mp3",
    options: [
      {
        id: "sunbeam",
        label: "Zoom with Sunny!",
        emoji: "☀️",
        to: "sunbeam",
        narrationFile: "narration/drip-fork/ch_02_narrator.mp3",
      },
      {
        id: "float",
        label: "Float up slow!",
        emoji: "☁️",
        to: "float",
        narrationFile: "narration/drip-fork/ch_03_narrator.mp3",
      },
    ],
  },
  // The fast branch is followed in the layout by the slow one, so it has to
  // jump the whole float segment to reach the merge.
  sunbeam: { kind: "jump", to: "ending" },
  // The slow branch is already adjacent to the ending: just keep playing.
  float: { kind: "continue" },
  ending: { kind: "end" },
};
