// Audio-driven scene timing.
//
// The core pacing rule of the suite: narration audio is generated at build
// time (scripts/generate-narration.mjs) with exact durations recorded in each
// video's narrationManifest.ts, and every narrated scene is stretched to fit
// its clip plus a short silent tail. Visuals adapt to the voice, never the
// other way around.

import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame } from "remotion";

export type NarrationClip = { file: string; durationSeconds: number };

/**
 * One line of dialogue inside a scene: who says it, and the clip they say it
 * with. `gapFrames` is the beat of silence *after* the line, before the next
 * character starts (default `DEFAULT_TURN_GAP_FRAMES`).
 */
export type DialogueTurn = {
  clip: NarrationClip;
  /** Character id — matched by `isSpeaking`/`speakerAt`, so keep it stable. */
  speaker: string;
  gapFrames?: number;
};

export type SceneDef = {
  id: string;
  // Narration for the scene; omit for silent scenes.
  clip?: NarrationClip;
  /**
   * Multi-speaker scene: several clips played back to back. Mutually exclusive
   * with `clip` — a scene is either one narrated beat or one exchange.
   */
  turns?: DialogueTurn[];
  // Floor on scene length, even if the clip is shorter (default 2s worth).
  minFrames?: number;
  // Silence after the clip ends so cuts don't feel abrupt (default 15).
  tailFrames?: number;
};

/** A dialogue turn placed on the scene's own frame axis. */
export type TimedTurn = {
  speaker: string;
  clip: NarrationClip;
  /** Frames from the start of the *scene*. */
  from: number;
  durationInFrames: number;
};

export type TimedScene = {
  id: string;
  clip?: NarrationClip;
  turns?: TimedTurn[];
  from: number;
  durationInFrames: number;
};

export const DEFAULT_TAIL_FRAMES = 15;
/** Beat between two characters' lines. Long enough to read as a reply. */
export const DEFAULT_TURN_GAP_FRAMES = 8;

export type Timeline = { scenes: TimedScene[]; durationInFrames: number };

export function buildTimeline(defs: SceneDef[], fps: number): Timeline {
  let from = 0;
  const scenes: TimedScene[] = defs.map((def) => {
    const minFrames = def.minFrames ?? fps * 2;
    const tail = def.tailFrames ?? DEFAULT_TAIL_FRAMES;

    // Dialogue scene: lay the turns out end to end, then the usual tail. The
    // single-clip path below is untouched — a scene without `turns` produces
    // exactly the frame counts it did before this branch existed.
    if (def.turns && def.turns.length > 0) {
      const turns = layoutTurns(def.turns, fps);
      const spoken = turns.length
        ? turns[turns.length - 1].from +
          turns[turns.length - 1].durationInFrames +
          (def.turns[def.turns.length - 1].gapFrames ?? DEFAULT_TURN_GAP_FRAMES)
        : 0;
      const durationInFrames = Math.max(1, minFrames, spoken + tail);
      const scene: TimedScene = {
        id: def.id,
        clip: def.clip,
        turns,
        from,
        durationInFrames,
      };
      from += durationInFrames;
      return scene;
    }

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

function layoutTurns(defs: DialogueTurn[], fps: number): TimedTurn[] {
  let at = 0;
  return defs.map((def) => {
    const durationInFrames = Math.ceil(def.clip.durationSeconds * fps);
    const turn: TimedTurn = {
      speaker: def.speaker,
      clip: def.clip,
      from: at,
      durationInFrames,
    };
    at += durationInFrames + (def.gapFrames ?? DEFAULT_TURN_GAP_FRAMES);
    return turn;
  });
}

// --- dialogue windows -----------------------------------------------------

/** `[start, end)` of a turn, in frames from the start of its scene. */
export function turnWindow(turn: TimedTurn): [number, number] {
  return [turn.from, turn.from + turn.durationInFrames];
}

/** Every window a given speaker holds in a scene, in order. */
export function speakerWindows(
  scene: TimedScene,
  speaker: string,
): Array<[number, number]> {
  return (scene.turns ?? [])
    .filter((t) => t.speaker === speaker)
    .map(turnWindow);
}

/** Is `speaker` mid-line at this scene-local frame? */
export function isSpeaking(
  scene: TimedScene,
  speaker: string,
  frame: number,
): boolean {
  return (scene.turns ?? []).some(
    (t) =>
      t.speaker === speaker &&
      frame >= t.from &&
      frame < t.from + t.durationInFrames,
  );
}

/** Whoever is talking at this scene-local frame, or null in the gaps. */
export function speakerAt(scene: TimedScene, frame: number): string | null {
  const turn = (scene.turns ?? []).find(
    (t) => frame >= t.from && frame < t.from + t.durationInFrames,
  );
  return turn ? turn.speaker : null;
}

/**
 * Hook form, for a character that should mouth exactly its own line:
 *
 *   <Drip speaking={useSpeaking(scene, "drip")} … />
 *
 * Call it inside the scene's `<Series.Sequence>`, where `useCurrentFrame()` is
 * already scene-local.
 */
export function useSpeaking(scene: TimedScene, speaker: string): boolean {
  return isSpeaking(scene, speaker, useCurrentFrame());
}

/** Hook form of `speakerAt`, for a scene that drives several characters. */
export function useSpeaker(scene: TimedScene): string | null {
  return speakerAt(scene, useCurrentFrame());
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

// `pauseWhenBuffering` on every narration clip: on a phone, a clip that is
// still loading when its frame arrives must hold the video, not get its first
// words skipped. Desktop never notices; iPhone playback is where an episode's
// dozens of just-in-time <audio> mounts otherwise race the network.

// Mounts a scene's narration clip (no-op for silent scenes). Place inside the
// scene's <Series.Sequence> so the audio starts with the scene.
export const SceneAudio: React.FC<{ clip?: NarrationClip }> = ({ clip }) => {
  if (!clip) return null;
  return React.createElement(Audio, {
    src: staticFile(clip.file),
    pauseWhenBuffering: true,
  });
};

/**
 * How far ahead a dialogue turn mounts (silently) before it plays. Three
 * seconds is enough for the phone to fetch a short mp3 through the service
 * worker; turns earlier than that in a scene simply get whatever headroom the
 * scene's own start gives them.
 */
const TURN_PREMOUNT_FRAMES = 90;

/**
 * Mounts every turn of a dialogue scene at its own offset. Drop it in place of
 * `SceneAudio` for a scene built from `turns`; it is a no-op for a scene that
 * has none, so a `<Series.Sequence>` can carry both without branching.
 */
export const DialogueAudio: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  if (!scene.turns || scene.turns.length === 0) return null;
  return React.createElement(
    React.Fragment,
    null,
    scene.turns.map((turn, i) =>
      React.createElement(
        Sequence,
        {
          key: `${turn.speaker}-${i}`,
          from: turn.from,
          durationInFrames: turn.durationInFrames,
          premountFor: TURN_PREMOUNT_FRAMES,
        },
        React.createElement(Audio, {
          src: staticFile(turn.clip.file),
          pauseWhenBuffering: true,
        }),
      ),
    ),
  );
};
