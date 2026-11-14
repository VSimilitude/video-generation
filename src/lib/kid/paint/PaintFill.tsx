import React from "react";
import type { Value3 } from "./theme";

// Painted fill (ROADMAP Step 2, gap 1 §3). A flat base colour plus:
//   - a pooled band over the low 35% of the shape (shadow value, mottled by
//     feTurbulence 0.012 / 2 octaves — reads as pigment settling),
//   - a dry band over the top 20% (light value, also mottled),
//   - a faint all-over granulation,
//   - a 2–3 px edge bleed under the shape (dilate + blur, alpha 0.35).
// All pure SVG; the bands are clipped to the shape, so it works for any
// union of shapes passed as `shape`. Ids are derived from `id` — give every
// instance its own.

export type BBox = { x: number; y: number; w: number; h: number };

export const PaintFill: React.FC<{
  id: string;
  /** Shapes WITHOUT fill/stroke attributes (they inherit). */
  shape: React.ReactNode;
  bbox: BBox;
  v: Value3;
  seed?: number;
  /** Edge bleed layer on/off (first thing the render-cost budget drops). */
  bleed?: boolean;
  /** Strength multiplier on both bands. */
  strength?: number;
}> = ({ id, shape, bbox, v, seed = 1, bleed = true, strength = 1 }) => {
  const pad = 12;
  const r = { x: bbox.x - pad, y: bbox.y - pad, width: bbox.w + pad * 2, height: bbox.h + pad * 2 };
  const low = bbox.y + bbox.h * 0.65;
  const high = bbox.y + bbox.h * 0.2;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-clip`}>{shape}</clipPath>
        <filter id={`${id}-tex`} x={0} y={0} width={1} height={1} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={0.012} numOctaves={2} seed={seed} result="n" />
          {/* alpha = 1.9·R − 0.55: blotchy, clipped to 0..1 */}
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.3 0 0 0 -0.2" result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
        </filter>
        <filter id={`${id}-gran`} x={0} y={0} width={1} height={1} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={0.09} numOctaves={1} seed={seed + 3} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 0 0 0 -0.9" result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
        </filter>
        {bleed ? (
          <filter id={`${id}-bleed`} filterUnits="userSpaceOnUse" {...r}>
            <feMorphology operator="dilate" radius={2.5} />
            <feGaussianBlur stdDeviation={1.6} />
          </filter>
        ) : null}
        <linearGradient id={`${id}-lowg`} gradientUnits="userSpaceOnUse" x1={0} y1={low - bbox.h * 0.12} x2={0} y2={low + bbox.h * 0.1}>
          <stop offset="0" stopColor={v.shadow} stopOpacity={0} />
          <stop offset="1" stopColor={v.shadow} stopOpacity={1} />
        </linearGradient>
        <linearGradient id={`${id}-highg`} gradientUnits="userSpaceOnUse" x1={0} y1={high - bbox.h * 0.08} x2={0} y2={high + bbox.h * 0.1}>
          <stop offset="0" stopColor={v.light} stopOpacity={1} />
          <stop offset="1" stopColor={v.light} stopOpacity={0} />
        </linearGradient>
      </defs>
      {bleed ? (
        <g fill={v.base} opacity={0.35} filter={`url(#${id}-bleed)`}>
          {shape}
        </g>
      ) : null}
      <g fill={v.base}>{shape}</g>
      <g clipPath={`url(#${id}-clip)`}>
        <rect
          x={r.x}
          y={low - bbox.h * 0.12}
          width={r.width}
          height={bbox.y + bbox.h - low + bbox.h * 0.12 + pad}
          fill={`url(#${id}-lowg)`}
          opacity={0.75 * strength}
          filter={`url(#${id}-tex)`}
        />
        <rect
          x={r.x}
          y={r.y}
          width={r.width}
          height={high - r.y + bbox.h * 0.1}
          fill={`url(#${id}-highg)`}
          opacity={0.65 * strength}
          filter={`url(#${id}-tex)`}
        />
        <rect {...r} fill={v.shadow} opacity={0.1 * strength} filter={`url(#${id}-gran)`} />
      </g>
    </g>
  );
};
