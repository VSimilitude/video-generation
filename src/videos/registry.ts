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

export type VideoEntry = {
  /** Composition id: used by Remotion, by `remotion render`, and as the site's URL hash. */
  id: string;
  title: string;
  /** One line, shown in the gallery and above the player. */
  description: string;
  component: React.FC;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
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
];

export function findVideo(id: string | null): VideoEntry | undefined {
  if (!id) return undefined;
  return VIDEOS.find((video) => video.id === id);
}
