// Audio-driven scene timing.
//
// The core pacing rule of the suite: narration audio is generated at build
// time (scripts/generate-narration.mjs) with exact durations recorded in each
// video's narrationManifest.ts, and every narrated scene is stretched to fit
// its clip plus a short silent tail. Visuals adapt to the voice, never the
// other way around.

import React from "react";
import { Audio, staticFile } from "remotion";

export type NarrationClip = { file: string; durationSeconds: number };

export type SceneDef = {
  id: string;
  // Narration for the scene; omit for silent scenes.
  clip?: NarrationClip;
  // Floor on scene length, even if the clip is shorter (default 2s worth).
  minFrames?: number;
  // Silence after the clip ends so cuts don't feel abrupt (default 15).
  tailFrames?: number;
};

export type TimedScene = {
  id: string;
  clip?: NarrationClip;
  from: number;
  durationInFrames: number;
};

export const DEFAULT_TAIL_FRAMES = 15;

export type Timeline = { scenes: TimedScene[]; durationInFrames: number };

export function buildTimeline(defs: SceneDef[], fps: number): Timeline {
  let from = 0;
  const scenes: TimedScene[] = defs.map((def) => {
    const minFrames = def.minFrames ?? fps * 2;
    const tail = def.tailFrames ?? DEFAULT_TAIL_FRAMES;
    const audioFrames = def.clip
      ? Math.ceil(def.clip.durationSeconds * fps) + tail
      : 0;
    const durationInFrames = Math.max(1, minFrames, audioFrames);
    const scene: TimedScene = {
      id: def.id,
      clip: def.clip,
      from,
      durationInFrames,
    };
    from += durationInFrames;
    return scene;
  });
  return { scenes, durationInFrames: Math.max(1, from) };
}

// Mounts a scene's narration clip (no-op for silent scenes). Place inside the
// scene's <Series.Sequence> so the audio starts with the scene.
export const SceneAudio: React.FC<{ clip?: NarrationClip }> = ({ clip }) => {
  if (!clip) return null;
  return React.createElement(Audio, { src: staticFile(clip.file) });
};
