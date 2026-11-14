import React from "react";
import { hashKey } from "./strokes";
import type { BBox } from "./PaintFill";

// Boil (ROADMAP Step 2, gap 1 §4; remaster log D9). A per-group
// feTurbulence (fractalNoise, bf 0.02, 1 octave — bible row; D9 said 2) + feDisplacementMap that
// re-seeds every `every` frames (3 = 10 re-seeds/s), so linework crawls
// like a redrawn line while nothing else steps. A still group keeps its own
// `boilKey`, so two characters never boil in lockstep.
//
// Rules from the memo §2(b): color-interpolation-filters sRGB (or the map is
// biased by ~0.3·scale), an explicit userSpaceOnUse region padded by
// scale/2 + stroke + 4 px (the default region clips the displacement), one
// filter id per instance. Faces are NOT children of a Boil — render the
// `Face` after (outside) the boiled group so it stays crisp.

export function boilSeed(boilKey: string, frame: number, every = 3): number {
  return hashKey(boilKey) + Math.floor(frame / every);
}

export const Boil: React.FC<{
  id: string;
  boilKey: string;
  frame: number;
  bbox: BBox;
  /** Displacement in user units (≈px at scale 1). Bible: 2.5. */
  scale?: number;
  every?: number;
  off?: boolean;
  /** Emit the filter but do not apply it to `children` (they boil via <BoilGroup>s). */
  defsOnly?: boolean;
  /** Noise octaves: 1 per the bible table (half the cost of D9's 2). */
  octaves?: number;
  children: React.ReactNode;
}> = ({ id, boilKey, frame, bbox, scale = 3, every = 3, off = false, defsOnly = false, octaves = 1, children }) => {
  if (off) return <g>{children}</g>;
  const pad = scale / 2 + 12;
  return (
    <g>
      <defs>
        <filter
          id={id}
          filterUnits="userSpaceOnUse"
          x={bbox.x - pad}
          y={bbox.y - pad}
          width={bbox.w + pad * 2}
          height={bbox.h + pad * 2}
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.02}
            numOctaves={octaves}
            seed={boilSeed(boilKey, frame, every)}
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={defsOnly ? undefined : `url(#${id})`}>{children}</g>
    </g>
  );
};

/**
 * A second (third…) group boiled by an existing <Boil>'s filter — same noise,
 * same seed. Used to boil ink that has to sit at a different depth in the
 * drawing order (e.g. arm outlines under the arm fill) without paying for a
 * second filter definition.
 */
export const BoilGroup: React.FC<{ id: string; off?: boolean; children: React.ReactNode }> = ({ id, off = false, children }) => (
  <g filter={off ? undefined : `url(#${id})`}>{children}</g>
);
