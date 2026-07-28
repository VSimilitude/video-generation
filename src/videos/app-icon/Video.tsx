// The home-screen icon for the player site, drawn as a Remotion composition.
//
// Not a video: this is here so `npm run icons` can render the PNGs the web app
// manifest needs (192/512/maskable/apple-touch) with the tooling the project
// already has, instead of adding an image library or committing a hand-made
// binary nobody can edit. Re-render after any change — the PNGs in site/icons/
// are generated output, committed like the narration audio.
//
// Design rules, because an icon is 60 physical pixels on a phone:
//   - one shape, no text, no thin lines
//   - full-bleed background, so iOS's rounded-rect mask and Android's circle
//     mask both crop into colour rather than into a corner
//   - the drop stays inside the middle ~64%, which is well within the maskable
//     safe zone (a circle of 80% diameter)
//
// Everything is a viewBox-relative SVG, so `remotion still --width/--height`
// re-renders it at any size without resampling.

import React from "react";
import { AbsoluteFill } from "remotion";
import { kidTheme } from "../../lib/kid/theme";

export const FPS = 30;
export const WIDTH = 1024;
export const HEIGHT = 1024;
export const DURATION_IN_FRAMES = 1;

/**
 * A water drop: a point at the top, a circle at the bottom, two mirrored
 * curves joining them tangentially. Bounding box x 264–760, y 232–880 of a
 * 1024 field — the centre of the shape sits a touch low, which the group
 * transform lifts back to optical centre.
 */
const DROP_PATH =
  "M512 232 C640 380 760 520 760 632 A248 248 0 0 1 264 632 C264 520 384 380 512 232 Z";

export const AppIconArt: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <AbsoluteFill style={{ background: kidTheme.skyTop }}>
    <svg
      viewBox="0 0 1024 1024"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="icon-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={kidTheme.waterDeep} />
          <stop offset="55%" stopColor={kidTheme.skyTop} />
          <stop offset="100%" stopColor={kidTheme.water} />
        </linearGradient>
        <linearGradient id="icon-drop" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={kidTheme.paper} />
          <stop offset="100%" stopColor={kidTheme.waterLight} />
        </linearGradient>
      </defs>

      {/* Full bleed: whatever mask the OS applies, it lands on sky. */}
      <rect x="0" y="0" width="1024" height="1024" fill="url(#icon-sky)" />

      <g
        transform={`translate(512 490) scale(${scale}) translate(-512 -512)`}
      >
        {/* A soft ring of lighter sky, so the white drop has somewhere to sit
            when the icon is tiny and the gradient reads as one flat blue. */}
        <circle
          cx="512"
          cy="556"
          r="352"
          fill={kidTheme.skyLow}
          opacity={0.22}
        />
        <path
          d={DROP_PATH}
          fill="url(#icon-drop)"
          stroke={kidTheme.ink}
          strokeWidth={16}
          strokeLinejoin="round"
        />
        {/* The one piece of shading: a fat shine on the drop's left cheek. A
            thin sliver would read as a scratch at 60px; this stays a shape. */}
        <ellipse
          cx="422"
          cy="566"
          rx="33"
          ry="98"
          transform="rotate(-20 422 566)"
          fill={kidTheme.shine}
          opacity={0.92}
        />
      </g>
    </svg>
  </AbsoluteFill>
);

/** Manifest `purpose: "any"` + apple-touch-icon. */
export const AppIconVideo: React.FC = () => <AppIconArt />;

/**
 * Manifest `purpose: "maskable"`. Android crops maskable icons to whatever
 * shape the launcher likes — anything outside the inner 80% circle can be cut
 * off — so the drop is pulled in further here.
 */
export const AppIconMaskableVideo: React.FC = () => <AppIconArt scale={0.78} />;
