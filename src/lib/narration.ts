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

// --- Beat timing ----------------------------------------------------------

/**
 * Resolve a scene's element entrances as fractions of *its own* clip length.
 *
 * Element entrances inside a scene are staggered (docs/STYLE.md), which needs
 * per-element frame numbers. Eyeballing those against a take rots the moment a
 * line is reworded, so each beat is expressed as a fraction of the scene's
 * narration clip and resolved against the generated manifest: re-run
 * `npm run narration` and every stagger moves with the voice, exactly like the
 * scene lengths do.
 *
 *   const at = beats(NARRATION.terms, [0.22, 0.47, 0.7], FPS);
 *
 * Caveats worth keeping in mind (bond-basics v1 retro): it assumes clause
 * proportions stay stable under rewording, so every fraction deserves a comment
 * naming the clause it targets. Fractions are of the *clip*, not the scene, so
 * a beat at 1.0 lands where the voice stops, before the silent tail.
 */
export function beats(
  clip: NarrationClip,
  fractions: number[],
  fps: number,
): number[] {
  const frames = clip.durationSeconds * fps;
  return fractions.map((f) => Math.round(f * frames));
}

// Mounts a scene's narration clip (no-op for silent scenes). Place inside the
// scene's <Series.Sequence> so the audio starts with the scene.
export const SceneAudio: React.FC<{ clip?: NarrationClip }> = ({ clip }) => {
  if (!clip) return null;
  return React.createElement(Audio, { src: staticFile(clip.file) });
};
