import type { Cam } from "../staging";

// Camera + motion grammar (ROADMAP Step 2, gap 2). Pure frame -> Cam-delta
// helpers that compose onto the existing `Cam` with `withCam()`.
//   holdCreep — every hold creeps: push-in 1.00 → 1.02 over 6 s.
//   burst     — ease-out burst: peak velocity on frame 1, decaying to
//               < 0.5 px/frame by frame 12 (ref 720p 6,26,12,14,6,5,2,1 ×1.5).
//   follow    — the camera carries the eye along a subject, lagged.
//   dissolve  — 6–8 frame seam.

export type CamDelta = { zoom?: number; dx?: number; dy?: number; rotate?: number };

const clamp01 = (u: number) => Math.max(0, Math.min(1, u));

/** Slow push-in from `from`: zoom 1 → 1 + amount over `seconds`; eased in over the first 0.5 s, then constant. */
export function holdCreep(frame: number, from: number, seconds = 6, fps = 30, amount = 0.02): CamDelta {
  const T = seconds * fps;
  const t = Math.max(0, frame - from);
  const e = 15; // ease-in frames
  const lin = t < e ? (t * t) / (2 * e) : t - e / 2;
  return { zoom: 1 + amount * clamp01(lin / (T - e / 2)) };
}

/** Max per-frame pan of `holdCreep` at a given zoom origin distance (for the ≤0.3 px/f drift check). */
export function creepVelocity(seconds = 6, fps = 30, amount = 0.02, radius = 960): number {
  return (amount * radius) / (seconds * fps);
}

/**
 * Ease-out burst toward `delta`, starting at frame `at`. p(t) = 1 − (1 − t/12)³:
 * the largest step is frame 1 (25% of the move), the step at frame 11→12 is
 * 0.06% — < 0.5 px/frame for moves up to ~800 px.
 */
export function burst(frame: number, at: number, delta: CamDelta, frames = 12): CamDelta {
  const u = clamp01((frame - at) / frames);
  const p = 1 - Math.pow(1 - u, 3);
  return {
    zoom: delta.zoom === undefined ? undefined : 1 + (delta.zoom - 1) * p,
    dx: (delta.dx ?? 0) * p,
    dy: (delta.dy ?? 0) * p,
    rotate: (delta.rotate ?? 0) * p,
  };
}

/** Pan so a moving subject drifts toward `target` (screen px), lagging `lag` frames, by `strength` 0–1. */
export function follow(
  frame: number,
  subject: (f: number) => { x: number; y: number },
  target: { x: number; y: number } = { x: 960, y: 540 },
  strength = 0.6,
  lag = 6,
): CamDelta {
  const p = subject(frame - lag);
  return { dx: (target.x - p.x) * strength, dy: (target.y - p.y) * strength };
}

/** Incoming-shot opacity for a `frames`-long (6–8) dissolve starting at `at`. */
export function dissolve(frame: number, at: number, frames = 7): number {
  const u = clamp01((frame - at) / frames);
  return u * u * (3 - 2 * u);
}

/** Compose deltas onto a base Cam: zooms multiply, pans and tilts add. */
export function withCam(base: Cam, ...deltas: CamDelta[]): Cam {
  let zoom = base.zoom ?? 1;
  let dx = base.dx ?? 0;
  let dy = base.dy ?? 0;
  let rotate = base.rotate ?? 0;
  for (const d of deltas) {
    if (d.zoom !== undefined) zoom *= d.zoom;
    dx += d.dx ?? 0;
    dy += d.dy ?? 0;
    rotate += d.rotate ?? 0;
  }
  return { ...base, zoom, dx, dy, rotate, zoomY: base.zoomY === undefined ? undefined : base.zoomY * (zoom / (base.zoom ?? 1)) };
}
