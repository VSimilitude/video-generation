// The branching player's decision logic, kept pure and DOM-free.
//
// BranchingPlayer.tsx owns the Player, the React state and the overlay; this
// file owns the one question that actually defines the format: "playback is at
// frame N of segment S — what now?". Pure in, pure out, so it can be reasoned
// about (and tested) without a browser, a Player instance or a composition.

import type { BranchSegment, BranchingSpec } from "./registry";

/**
 * How close to a segment's last frame counts as "reached the end".
 *
 * `frameupdate` fires per rendered frame and a busy phone can skip one, so
 * waiting for the exact last frame would miss the seam and run the viewer past
 * it into the next segment's frames. Segments are authored to tolerate ±2
 * frames at the seam (they end on a held beat), so firing 2 frames early is
 * free — and firing early is the only failure direction that stays invisible.
 */
export const SEAM_TOLERANCE = 2;

export type SeamAction =
  /** Nothing to do: still inside the segment. */
  | { kind: "wait" }
  /** Pause and put the choice card up over this segment's held frames. */
  | { kind: "choice"; segmentId: string }
  /** Merge/branch: keep playing, from `frame`, now inside `segmentId`. */
  | { kind: "seek"; segmentId: string; frame: number }
  /** The next segment is adjacent — just take ownership of it. */
  | { kind: "advance"; segmentId: string }
  /** Pause and show the end card. */
  | { kind: "end" };

/** The segment a frame falls inside; the nearest earlier one if it falls in a gap. */
export function segmentAtFrame(
  segments: BranchSegment[],
  frame: number,
): BranchSegment | null {
  let fallback: BranchSegment | null = segments[0] ?? null;
  for (const segment of segments) {
    if (frame >= segment.from && frame < segment.from + segment.durationInFrames) {
      return segment;
    }
    if (segment.from <= frame) fallback = segment;
  }
  return fallback;
}

/** The frame a choice segment is parked on while its card is up. */
export function choiceHoldFrame(segment: BranchSegment): number {
  return segment.from + segment.durationInFrames - SEAM_TOLERANCE;
}

/**
 * What the player should do, given where playback is and which segment it
 * believes it is playing. Everything that is not "the current segment just
 * ended" answers `wait`.
 */
export function seamAction(
  segments: BranchSegment[],
  currentSegmentId: string,
  frame: number,
): SeamAction {
  const index = segments.findIndex((s) => s.id === currentSegmentId);
  const segment = index < 0 ? undefined : segments[index];
  if (!segment) return { kind: "wait" };
  if (frame < choiceHoldFrame(segment)) return { kind: "wait" };

  const next = segment.next;
  if (next.kind === "choice") {
    return { kind: "choice", segmentId: segment.id };
  }
  if (next.kind === "jump") {
    const target = segments.find((s) => s.id === next.to);
    // A dangling merge target is an authoring bug. Stopping is better than
    // looping this branch's last two frames forever.
    if (!target) return { kind: "end" };
    return { kind: "seek", segmentId: target.id, frame: target.from };
  }
  if (next.kind === "continue") {
    const following = segments[index + 1];
    if (!following) return { kind: "end" };
    return { kind: "advance", segmentId: following.id };
  }
  return { kind: "end" };
}

/** The first choice point in the story — what "try a different way" rewinds to. */
export function firstChoiceSegment(spec: BranchingSpec): BranchSegment | null {
  return spec.segments.find((segment) => segment.next.kind === "choice") ?? null;
}
