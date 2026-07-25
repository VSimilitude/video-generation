// The video registry for the web player site.
//
// Adding a video to the site is ONE entry below: import its composition,
// timeline() and FPS/WIDTH/HEIGHT, then fill in a title + one-line
// description. Keep `id` identical to the <Composition> id in src/Root.tsx —
// it is the URL hash on the site (#/PipelineDemo) and the argument to
// `npx remotion render <id>`.

import type React from "react";
import {
  PipelineDemoVideo,
  timeline as pipelineDemoTimeline,
  FPS as PIPELINE_DEMO_FPS,
  WIDTH as PIPELINE_DEMO_WIDTH,
  HEIGHT as PIPELINE_DEMO_HEIGHT,
} from "../videos/pipeline-demo/Video";

export type SiteVideo = {
  /** Matches the <Composition> id in src/Root.tsx. */
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

export const VIDEOS: SiteVideo[] = [
  {
    id: "PipelineDemo",
    title: "Generated, Start to Finish",
    description:
      "How this video series is made: a script becomes Kokoro speech, and Remotion times the visuals to the voice.",
    component: PipelineDemoVideo,
    fps: PIPELINE_DEMO_FPS,
    width: PIPELINE_DEMO_WIDTH,
    height: PIPELINE_DEMO_HEIGHT,
    // Duration is derived from the generated narration manifest, exactly as
    // in src/Root.tsx — no hand-entered lengths.
    durationInFrames: pipelineDemoTimeline().durationInFrames,
  },
];

export function findVideo(id: string | null): SiteVideo | undefined {
  if (!id) return undefined;
  return VIDEOS.find((video) => video.id === id);
}

/** mm:ss for a frame count, for the gallery/player labels. */
export function formatDuration(durationInFrames: number, fps: number): string {
  const total = Math.round(durationInFrames / fps);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
