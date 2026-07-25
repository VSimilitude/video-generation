import React from "react";
import { useCurrentFrame } from "remotion";
import { useGraph, drawProgress, type DrawSpec } from "./AnimatedGraph";

// A function plotted across the graph's x domain, drawn on left→right.
//
// The path is sampled from a real JS function rather than a list of points, so
// the drawing is always the maths (bond-basics plots `price3y` straight from
// src/videos/bond-basics/pricing.ts). Draw-on uses `pathLength={1}`, which
// normalizes the dash units to the path's own length — no DOM measurement, so
// every frame is deterministic.

export const GraphCurve: React.FC<{
  /** Data y for a given data x. Sampled, never memoized against frame. */
  fn: (x: number) => number;
  color: string;
  /** Draw-on window; pass ALREADY_DRAWN to persist across a cut. */
  draw?: DrawSpec;
  /**
   * Plot only part of the x domain. Use it when a curve leaves the y domain
   * near an edge: the invisible, clipped-away section would otherwise soak up
   * most of the draw-on progress (it still has path length) and the curve would
   * appear to start late.
   */
  range?: [number, number];
  /** Sample count across the x domain. 120 is smooth at 1920px wide. */
  samples?: number;
  strokeWidth?: number;
  /** Whole-curve opacity — used to dim a curve that has become context. */
  opacity?: number;
}> = ({
  fn,
  color,
  draw = { at: 0, frames: 30 },
  range,
  samples = 120,
  strokeWidth = 7,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { sx, sy, x, clip } = useGraph();
  const p = drawProgress(frame, draw);

  const [x0, x1] = range ?? x.domain;
  const d = Array.from({ length: samples + 1 }, (_, i) => {
    const xv = x0 + ((x1 - x0) * i) / samples;
    return `${i === 0 ? "M" : "L"}${sx(xv).toFixed(2)},${sy(fn(xv)).toFixed(2)}`;
  }).join(" ");

  if (p <= 0) return null;
  return (
    <g clipPath={clip}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        style={{ filter: `drop-shadow(0 0 18px ${color}55)` }}
      />
    </g>
  );
};
