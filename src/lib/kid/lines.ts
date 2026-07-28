import type { TimedScene, TimedTurn } from "../narration";

// Line-key plumbing for a dialogue episode.
//
// Every kids' episode names its narration clips after its script's line keys
// (`a1_07_narrator`, `co_02_drip`), and every scene keys its beats to those
// keys rather than to frame numbers — which is what lets a re-synthesized line
// move the staging with it. These five functions are that lookup, and they were
// written character-for-character twice (episodes one and two) before being
// promoted here.
//
// Nothing here knows a cast list: the *speaker* half of the convention
// (`speakerOf`) stays in the episode, because that is where the cast is.

/** The line key a turn plays, recovered from its clip path. */
export function lineKeyOf(turn: { clip: { file: string } }): string {
  const base = turn.clip.file.split("/").pop() ?? "";
  return base.replace(/\.mp3$/, "");
}

/** The timed turn that plays `lineKey`, for beats keyed to one line. */
export function turnFor(scene: TimedScene, lineKey: string): TimedTurn | null {
  return (scene.turns ?? []).find((t) => lineKeyOf(t) === lineKey) ?? null;
}

/** `[start, end)` of a line inside its scene; `[0, 0]` if the line isn't here. */
export function lineWindow(scene: TimedScene, lineKey: string): [number, number] {
  const turn = turnFor(scene, lineKey);
  return turn ? [turn.from, turn.from + turn.durationInFrames] : [0, 0];
}

/**
 * The held beat *after* a line: `[start, end)` of the silence the script bought
 * with a `gapFrames`. This is how a scene stages a beat without hard-coding its
 * length — raise the gap in `Video.tsx` and the staging follows, which is the
 * whole point of the script owning those numbers.
 *
 * Returns `[end, end]` (an empty window) when the next line starts immediately.
 */
export function heldBeat(scene: TimedScene, lineKey: string): [number, number] {
  const turns = scene.turns ?? [];
  const i = turns.findIndex((t) => lineKeyOf(t) === lineKey);
  if (i < 0) return [0, 0];
  const end = turns[i].from + turns[i].durationInFrames;
  const next = turns[i + 1];
  return [end, next ? next.from : scene.durationInFrames];
}

/** 0..1 progress through a line — the honest way to key a beat to a clause. */
export function lineProgress(
  scene: TimedScene,
  lineKey: string,
  frame: number,
): number {
  const [a, b] = lineWindow(scene, lineKey);
  if (b <= a) return 0;
  return Math.max(0, Math.min(1, (frame - a) / (b - a)));
}
