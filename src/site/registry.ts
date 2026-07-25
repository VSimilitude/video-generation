// The site's view of the suite.
//
// The list itself lives in src/videos/registry.ts — one entry per video, shared
// with src/Root.tsx so the compositions Remotion registers and the videos the
// player offers can't drift apart. Add a video there; this file only adds the
// formatting the gallery needs.

export {
  VIDEOS,
  findVideo,
  type VideoEntry,
  type VideoEntry as SiteVideo,
} from "../videos/registry";

/** mm:ss for a frame count, for the gallery/player labels. */
export function formatDuration(durationInFrames: number, fps: number): string {
  const total = Math.round(durationInFrames / fps);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
