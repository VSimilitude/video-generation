// The suite's video registry — the one place a video is declared.
//
// Adding a video is ONE entry below: import its composition, `timeline()` and
// FPS/WIDTH/HEIGHT, then fill in a title and a one-line description. `id` is
// the <Composition> id, the URL hash on the site (#/BondBasics) and the
// argument to `npx remotion render <id>`, so it has to match everywhere — which
// is the reason this list exists exactly once.
//
// It used to exist twice: src/Root.tsx and src/site/registry.ts each imported
// every video with aliased FPS/WIDTH/HEIGHT (`FPS as BOND_BASICS_FPS`, …), a
// block per video per file. At two videos that was noise; at three it was four
// aliased blocks and two places to forget. Root.tsx now maps over this list and
// the site re-exports it. Durations are still derived from each video's
// `timeline()` — never a hand-entered number.

import type React from "react";
import {
  PipelineDemoVideo,
  timeline as pipelineDemoTimeline,
  FPS as PIPELINE_DEMO_FPS,
  WIDTH as PIPELINE_DEMO_WIDTH,
  HEIGHT as PIPELINE_DEMO_HEIGHT,
} from "./pipeline-demo/Video";
import {
  BondBasicsVideo,
  timeline as bondBasicsTimeline,
  FPS as BOND_BASICS_FPS,
  WIDTH as BOND_BASICS_WIDTH,
  HEIGHT as BOND_BASICS_HEIGHT,
} from "./bond-basics/Video";
import {
  SwapBasicsVideo,
  timeline as swapBasicsTimeline,
  FPS as SWAP_BASICS_FPS,
  WIDTH as SWAP_BASICS_WIDTH,
  HEIGHT as SWAP_BASICS_HEIGHT,
} from "./swap-basics/Video";
import {
  WaterCycleVideo,
  timeline as waterCycleTimeline,
  FPS as WATER_CYCLE_FPS,
  WIDTH as WATER_CYCLE_WIDTH,
  HEIGHT as WATER_CYCLE_HEIGHT,
} from "./water-cycle/Video";
import {
  WindVideo,
  timeline as windTimeline,
  FPS as WIND_FPS,
  WIDTH as WIND_WIDTH,
  HEIGHT as WIND_HEIGHT,
} from "./wind/Video";
import {
  SkyBlueVideo,
  timeline as skyBlueTimeline,
  FPS as SKY_BLUE_FPS,
  WIDTH as SKY_BLUE_WIDTH,
  HEIGHT as SKY_BLUE_HEIGHT,
} from "./sky-blue/Video";
import {
  KidDemoVideo,
  timeline as kidDemoTimeline,
  FPS as KID_DEMO_FPS,
  WIDTH as KID_DEMO_WIDTH,
  HEIGHT as KID_DEMO_HEIGHT,
} from "./kid-demo/Video";
import {
  DripForkVideo,
  branching as dripForkBranching,
  timeline as dripForkTimeline,
  FPS as DRIP_FORK_FPS,
  WIDTH as DRIP_FORK_WIDTH,
  HEIGHT as DRIP_FORK_HEIGHT,
} from "./drip-fork/Video";
import {
  AppIconVideo,
  AppIconMaskableVideo,
  DURATION_IN_FRAMES as APP_ICON_DURATION,
  FPS as APP_ICON_FPS,
  WIDTH as APP_ICON_WIDTH,
  HEIGHT as APP_ICON_HEIGHT,
} from "./app-icon/Video";

// --- Branching (CYOA) ------------------------------------------------------
//
// A branching video is ONE composition whose timeline is laid out as segments
// at fixed offsets; the site player plays a path through it by seeking, so a
// segment handoff is a seek inside one mounted Player, never a remount. The
// composition itself stays a pure function of frame — the viewer's choices
// reach it only through Player inputProps (`{ path }`), which variant scenes
// read to pick a clip or prop. See docs/CYOA.md (phase 1).

export type BranchChoiceOption = {
  /** Stable id recorded in the path state (localStorage) — never rename. */
  id: string;
  /** Kid-readable, four words max — pre-readers get the emoji + narration. */
  label: string;
  emoji: string;
  /** Segment to seek to when picked. */
  to: string;
  /** Site-relative audio (e.g. "narration/<slug>/<key>.mp3") that reads the
   * option aloud when the card shows. Played by the site, not Remotion. */
  narrationFile?: string;
};

export type BranchNext =
  | {
      kind: "choice";
      /** Stable id for the path state, e.g. "wayUp". */
      id: string;
      prompt: string;
      promptNarrationFile?: string;
      options: BranchChoiceOption[];
    }
  /** Merge: seek to another segment (e.g. branch end -> shared trunk). */
  | { kind: "jump"; to: string }
  /** Fall through — the next segment is adjacent in the composition. */
  | { kind: "continue" }
  | { kind: "end" };

export type BranchSegment = {
  id: string;
  /** Offset of the segment inside the composition, in frames. */
  from: number;
  durationInFrames: number;
  /** What the player does when playback reaches the segment's last frame. */
  next: BranchNext;
  /**
   * Site-relative assets (narration mp3s, plates) this segment plays, so the
   * player can prefetch a branch while the previous segment is still on
   * screen and the seek lands with its audio already cached.
   */
  preload?: string[];
};

export type BranchingSpec = {
  /** Segment playback starts on. */
  start: string;
  segments: BranchSegment[];
};

export type VideoEntry = {
  /** Composition id: used by Remotion, by `remotion render`, and as the site's URL hash. */
  id: string;
  title: string;
  /** One line, shown in the gallery and above the player. */
  description: string;
  /** Branching compositions receive `{ path }` via Player inputProps; linear
   * ones take no props. */
  component: React.FC<{ path?: Record<string, string> }>;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  /**
   * Registered as a Remotion composition (so `remotion still/render <id>` and
   * Studio can reach it) but kept out of the site gallery. For workbenches and
   * component showcases — anything renderable that isn't a video to watch.
   */
  hidden?: boolean;
  /**
   * Present only on choose-your-own-adventure entries. The site swaps in the
   * branching player screen; Studio and `remotion render` still see the whole
   * composition (every segment, in layout order), which is what the
   * every-frame validation gate renders.
   */
  branching?: BranchingSpec;
};

export const VIDEOS: VideoEntry[] = [
  {
    id: "PipelineDemo",
    title: "Generated, Start to Finish",
    description:
      "How this video series is made: a script becomes Kokoro speech, and Remotion times the visuals to the voice.",
    component: PipelineDemoVideo,
    fps: PIPELINE_DEMO_FPS,
    width: PIPELINE_DEMO_WIDTH,
    height: PIPELINE_DEMO_HEIGHT,
    durationInFrames: pipelineDemoTimeline().durationInFrames,
  },
  {
    id: "BondBasics",
    title: "Bond Basics",
    description:
      "What a bond is, how discounting its future payments sets the price, and why the price slides down the yield curve when rates rise. Part 1 of the financial series.",
    component: BondBasicsVideo,
    fps: BOND_BASICS_FPS,
    width: BOND_BASICS_WIDTH,
    height: BOND_BASICS_HEIGHT,
    durationInFrames: bondBasicsTimeline().durationInFrames,
  },
  {
    id: "SwapBasics",
    title: "Swap Basics",
    description:
      "How interest rate swaps work: fixed vs floating legs, netting, hedging a loan, the fair swap rate, and why a swap is bond exposure repackaged. Part 2 of the financial series.",
    component: SwapBasicsVideo,
    fps: SWAP_BASICS_FPS,
    width: SWAP_BASICS_WIDTH,
    height: SWAP_BASICS_HEIGHT,
    durationInFrames: swapBasicsTimeline().durationInFrames,
  },
  {
    id: "DripWaterCycle",
    title: "Drip's Big Adventure",
    description:
      "Follow one very small, very brave water drop all the way around the water cycle. Episode one of Little Big World.",
    component: WaterCycleVideo,
    fps: WATER_CYCLE_FPS,
    width: WATER_CYCLE_WIDTH,
    height: WATER_CYCLE_HEIGHT,
    durationInFrames: waterCycleTimeline().durationInFrames,
  },
  {
    id: "PuffWind",
    title: "Puff and the Kite That Wouldn't Fly",
    description:
      "Where does wind come from? A very small, very invisible hero finds out. Episode two of Little Big World.",
    component: WindVideo,
    fps: WIND_FPS,
    width: WIND_WIDTH,
    height: WIND_HEIGHT,
    durationInFrames: windTimeline().durationInFrames,
  },
  {
    id: "RaySkyBlue",
    title: "Ray and the Sky Nobody Painted",
    description:
      "Why is the sky blue? A brand-new sunbeam finds out he was never plain — and that nobody painted anything. Episode three of Little Big World.",
    component: SkyBlueVideo,
    fps: SKY_BLUE_FPS,
    width: SKY_BLUE_WIDTH,
    height: SKY_BLUE_HEIGHT,
    durationInFrames: skyBlueTimeline().durationInFrames,
  },
  {
    id: "DripChooses",
    title: "Drip Chooses the Way Up",
    description:
      "Drip needs to get to the Cloud Hotel, and you decide how: a sunbeam at high speed, or the slow gentle float. A Little Big World choose-your-own-adventure demo.",
    component: DripForkVideo,
    fps: DRIP_FORK_FPS,
    width: DRIP_FORK_WIDTH,
    height: DRIP_FORK_HEIGHT,
    durationInFrames: dripForkTimeline().durationInFrames,
    branching: dripForkBranching(),
  },
  {
    id: "KidDemo",
    title: "Kids' series — component workbench",
    description:
      "Showcase for src/lib/kid/: the three episode-one characters, their emotions and mouth sync, speech bubbles and a Big Word card. Not an episode.",
    component: KidDemoVideo,
    fps: KID_DEMO_FPS,
    width: KID_DEMO_WIDTH,
    height: KID_DEMO_HEIGHT,
    durationInFrames: kidDemoTimeline().durationInFrames,
    hidden: true,
  },
  // The player site's home-screen icon, rendered to PNG by `npm run icons`
  // (which bundles src/videos/app-icon/entry.tsx directly rather than this
  // registry). Listed here so Studio and `remotion still` can reach it too.
  {
    id: "AppIcon",
    title: "Player site — app icon",
    description:
      "The 1024×1024 home-screen icon for the web player. Rendered to site/icons/*.png by `npm run icons`. Not a video.",
    component: AppIconVideo,
    fps: APP_ICON_FPS,
    width: APP_ICON_WIDTH,
    height: APP_ICON_HEIGHT,
    durationInFrames: APP_ICON_DURATION,
    hidden: true,
  },
  {
    id: "AppIconMaskable",
    title: "Player site — app icon (maskable)",
    description:
      "The same mark with Android's maskable safe zone respected. Rendered by `npm run icons`. Not a video.",
    component: AppIconMaskableVideo,
    fps: APP_ICON_FPS,
    width: APP_ICON_WIDTH,
    height: APP_ICON_HEIGHT,
    durationInFrames: APP_ICON_DURATION,
    hidden: true,
  },
];

/** The videos the site shows — everything except workbenches. */
export const PUBLIC_VIDEOS: VideoEntry[] = VIDEOS.filter((v) => !v.hidden);

export function findVideo(id: string | null): VideoEntry | undefined {
  if (!id) return undefined;
  return VIDEOS.find((video) => video.id === id);
}
