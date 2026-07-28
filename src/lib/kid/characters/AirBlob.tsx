import React from "react";
import { kidTheme } from "../theme";

// Air, drawn — a puff of it as a bare shape, with no face on it.
//
// The character `Puff` is built from `puffBlob` (Puff.tsx); this is the same
// silhouette derived for crowds and holes: the puffs rising beside him, the
// cool air pouring in sideways, the Puff-shaped gap left behind him, which is
// this outline with nothing inside it. Drawing them all from one function is
// what makes the hole legibly *him* and the crowd legibly the same stuff.
//
// It is deliberately not `puffBlob` itself. Puff's own outline smooths with
// Catmull-Rom cubics through 44 samples (a hero's edge, at hero size); this
// smooths with quadratic midpoints through 18–22 (hundreds of them per frame,
// most of them small). Same lobes, same wing, a tenth of the path data.

/** Quadratic-midpoint smoothing through sample points, as one closed path. */
function smoothClosed(pts: Array<[number, number]>): string {
  const n = pts.length;
  const mid = (a: [number, number], b: [number, number]): [number, number] => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];
  const f = (p: [number, number]): string => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M ${f(mid(pts[n - 1], pts[0]))}`;
  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    d += ` Q ${f(cur)} ${f(mid(cur, next))}`;
  }
  return `${d} Z`;
}

/**
 * The vapour outline: three detuned lobe frequencies drifting at their own
 * rates, plus the directional stretch that pulls the left side out into a soft
 * wing. `t` is seconds; `seed` detunes one blob from its neighbours so a crowd
 * never ripples in lockstep.
 */
export function airBlobPath(r: number, t: number, seed = 0, points = 22): string {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const wob =
      0.15 * Math.sin(3 * a + t * 0.9 + seed) +
      0.075 * Math.sin(5 * a - t * 0.62 + seed * 1.7) +
      0.04 * Math.sin(7 * a + t * 1.31 + seed * 0.7);
    // 1 at the far left, 0 at the far right — the wing that makes a puff a
    // comma travelling to the right rather than a pearl.
    const back = (0.5 - 0.5 * Math.cos(a)) ** 1.7;
    const rr = r * (1 + wob) * (1 + 0.22 * back);
    const sy = 0.9 * (1 - 0.26 * back);
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr * sy]);
  }
  return smoothClosed(pts);
}

/** One faceless puff, for drawing inside a `WideLayer` or any other `<svg>`. */
export const AirBlob: React.FC<{
  x: number;
  y: number;
  r: number;
  /** Seconds — the caller's clock, so a whole crowd shares one. */
  t: number;
  seed?: number;
  fill?: string;
  edge?: string;
  opacity?: number;
  flip?: boolean;
  rotate?: number;
  points?: number;
}> = ({
  x,
  y,
  r,
  t,
  seed = 0,
  fill = kidTheme.air,
  edge = kidTheme.airEdge,
  opacity = 1,
  flip = false,
  rotate = 0,
  points = 18,
}) => {
  const d = airBlobPath(r, t, seed, points);
  return (
    <g
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotate.toFixed(1)}) ${flip ? "scale(-1 1)" : ""}`}
      opacity={opacity}
    >
      <path d={d} fill={fill} opacity={0.82} />
      <path
        d={d}
        fill="none"
        stroke={edge}
        strokeWidth={Math.max(3, r * 0.1)}
        strokeLinecap="round"
        strokeDasharray={`${r * 1.1} ${r * 0.26} ${r * 0.66} ${r * 0.22}`}
        strokeDashoffset={-t * 12}
        opacity={0.85}
      />
    </g>
  );
};
