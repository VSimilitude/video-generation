import React from "react";
import { kidTheme, kidType, mixHex } from "../../../lib/kid";
import type { DialogueTurn, NarrationClip, TimedScene } from "../../../lib/narration";
import { NARRATION } from "../narrationManifest";
// Cross-video import, deliberately. This demo reuses episode one's staging kit
// wholesale — bubbles, camera, marks, emotions, looks, the water band — because
// it *is* episode one's cast on episode one's ocean, and a second copy of that
// kit would drift from the show within a day. Precedent: swap-basics imports
// `price3y` from ../bond-basics/pricing (docs/LEARNINGS.md, 2026-07-25). Same
// flag applies: if a THIRD video wants this kit, that is the signal to promote
// it to src/lib/kid (it is already on the ep-3 cleanup list) rather than grow
// another video-to-video edge. Nothing is promoted here.
import {
  speakerOf,
  type Speaker,
} from "../../water-cycle/scenes/common";

// Shared kit for "Drip Chooses the Way Up" — the CYOA phase-1 demo.
//
// Almost everything lives in ../../water-cycle/scenes/common; this file exists
// for the two things that cannot be shared:
//
//   1. `turnsOf`, which is bound to a video's own narration manifest.
//   2. the format constants, which the registry reads off *this* composition.
//
// Plus the handful of small props (a cloud, a bird) the branch scenes need and
// episode one keeps private inside its act files.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/**
 * Frames of settled backdrop every branch segment opens with, before anything
 * enters. The site player detects a segment boundary from the Player's frame
 * callback and can overshoot it by a frame or two, so the first frames of a
 * segment may be on screen before the seek lands — they have to be a held
 * pose, never the first frame of an entrance. See docs/CYOA.md.
 */
export const SETTLE_FRAMES = 10;

/** A clip by line key, with a loud failure rather than a silent gap. */
export function clipOf(key: string): NarrationClip {
  const clip = NARRATION[key];
  if (!clip) throw new Error(`[drip-fork] no narration clip for "${key}"`);
  return clip;
}

/** Frames a clip occupies at this composition's fps. */
export function clipFrames(key: string): number {
  return Math.ceil(clipOf(key).durationSeconds * FPS);
}

/**
 * Turn list for a scene from its line keys — the water-cycle helper, rebound to
 * this video's manifest (that binding is the only reason it is copied).
 *
 * The last turn gets `gapFrames: 0`: a trailing gap stacks with the scene's
 * tail and leaves the scene sitting silent twice as long as intended.
 */
export function turnsOf(
  keys: string[],
  opts?: { gap?: number; gaps?: Record<string, number> },
): DialogueTurn[] {
  return keys.map((key, i) => {
    const explicit = opts?.gaps?.[key];
    const gapFrames =
      explicit !== undefined ? explicit : i === keys.length - 1 ? 0 : opts?.gap;
    return { clip: clipOf(key), speaker: speakerOf(key), gapFrames };
  });
}

/** The viewer's choice at the one branch point. Default outside the site. */
export type WayUp = "sunbeam" | "float";
export const DEFAULT_WAY_UP: WayUp = "sunbeam";

export function wayUpFrom(path?: Record<string, string>): WayUp {
  return path?.wayUp === "float" ? "float" : DEFAULT_WAY_UP;
}

/** Every scene in this video takes the same two props. */
export type SceneProps = { scene: TimedScene; wayUp: WayUp };

// ---------------------------------------------------------------------------
// Props this demo needs and episode one keeps private
// ---------------------------------------------------------------------------

/**
 * One cloud: a rounded slab with a row of puffs, drawn filled-and-stroked and
 * then filled again so the union gets one clean outline with no mask. A trimmed
 * copy of `CloudBlob` in water-cycle/scenes/act2.tsx (which is private to that
 * act file); `windows` adds the Cloud Hotel's lit rooms.
 */
export const CloudPuff: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  seed?: number;
  grey?: number;
  opacity?: number;
  windows?: number;
}> = ({ x, y, w, h, seed = 0, grey = 0, opacity = 1, windows = 0 }) => {
  const g = Math.max(0, Math.min(1, grey));
  const top = mixHex(kidTheme.cloud, kidTheme.cloudGrey, g * 0.92);
  const bottom = mixHex(kidTheme.cloudShade, kidTheme.cloudStorm, g);
  // A white cloud on a pale blue sky has no silhouette without this.
  const edge = mixHex("#7d93aa", "#33414f", g);
  const n = Math.max(3, Math.round(w / (h * 0.62)));
  const puffs = Array.from({ length: n }, (_, i) => {
    const u = n === 1 ? 0.5 : i / (n - 1);
    const r = h * (0.3 + 0.17 * Math.abs(Math.sin((i + seed) * 2.71)));
    return {
      cx: (u - 0.5) * (w - r * 1.4),
      cy: -h * 0.1 + Math.sin((i + seed) * 1.31) * h * 0.1 - r * 0.2,
      r,
    };
  });
  const slab = { x: -w / 2 + h * 0.1, y: -h * 0.06, w: w - h * 0.2, h: h * 0.5 };
  const lit = mixHex(kidTheme.star, kidTheme.sunLight, 0.4);

  const shapes = (stroked: boolean) => (
    <>
      <rect
        x={slab.x}
        y={slab.y}
        width={slab.w}
        height={slab.h}
        rx={slab.h / 2}
        fill={bottom}
        stroke={stroked ? edge : "none"}
        strokeWidth={stroked ? 12 : 0}
      />
      {puffs.map((p, i) => (
        <circle
          key={`p${i}`}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill={top}
          stroke={stroked ? edge : "none"}
          strokeWidth={stroked ? 12 : 0}
        />
      ))}
    </>
  );

  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      {shapes(true)}
      {shapes(false)}
      {Array.from({ length: windows }, (_, k) => {
        const u = windows === 1 ? 0.5 : k / (windows - 1);
        const wx = (u - 0.5) * slab.w * 0.72;
        const ww = Math.min(40, w * 0.03);
        return (
          <rect
            key={`w${k}`}
            x={wx - ww}
            y={slab.y + slab.h * 0.1 - ww}
            width={ww * 2}
            height={ww * 2}
            rx={ww * 0.45}
            fill={lit}
            stroke={edge}
            strokeWidth={6}
          />
        );
      })}
    </g>
  );
};

/** The Cloud Hotel's sign. Drawn in SVG so it rides inside a `WideLayer`. */
export const HotelSign: React.FC<{ x: number; y: number; size?: number }> = ({
  x,
  y,
  size = kidType.min,
}) => (
  <g transform={`translate(${x} ${y}) rotate(-2.5)`}>
    <rect
      x={-size * 5.4}
      y={-size * 0.95}
      width={size * 10.8}
      height={size * 1.9}
      rx={22}
      fill={kidTheme.paper}
      stroke={kidTheme.ink}
      strokeWidth={9}
    />
    <text
      x={0}
      y={size * 0.4}
      textAnchor="middle"
      fontFamily={kidTheme.fontFamily}
      fontSize={size}
      fontWeight={900}
      letterSpacing={3}
      fill={kidTheme.ink}
    >
      CLOUD HOTEL
    </text>
  </g>
);

/**
 * A gull, seen from the side, flapping on its own cycle. Pure `frame`.
 *
 * Wings are drawn as filled shapes rather than one stroke through the body:
 * a stroked "M" behind a white ellipse reads as a paperclip at any size a
 * background bird is drawn at.
 */
export const Bird: React.FC<{
  x: number;
  y: number;
  scale?: number;
  phase?: number;
  frame: number;
  /** Wings hold wide open and the eye goes round — the surprised one. */
  startled?: boolean;
  opacity?: number;
}> = ({ x, y, scale = 1, phase = 0, frame, startled = false, opacity = 1 }) => {
  const flap = startled ? 0.9 : 0.5 + 0.5 * Math.sin(frame / 5 + phase);
  // Wing tips swing from below the body to well above it.
  const tip = 24 - flap * 62;
  const wing = (s: number) =>
    `M ${s * 14} -4 Q ${s * 52} ${tip * 0.5} ${s * 84} ${tip} Q ${s * 48} ${tip * 0.2 + 12} ${s * 16} 12 Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={wing(s)}
          fill={kidTheme.paper}
          stroke={kidTheme.ink}
          strokeWidth={7}
          strokeLinejoin="round"
        />
      ))}
      <ellipse cx={0} cy={4} rx={34} ry={22} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={8} />
      <circle cx={22} cy={-14} r={18} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={8} />
      <circle cx={26} cy={-17} r={startled ? 7 : 4} fill={kidTheme.ink} />
      <path
        d="M 38 -12 L 62 -6 L 38 -1 Z"
        fill={kidTheme.sunDark}
        stroke={kidTheme.ink}
        strokeWidth={6}
        strokeLinejoin="round"
      />
    </g>
  );
};

/** A little boat on the sea, for the float branch's sightseeing. */
export const Boat: React.FC<{ x: number; y: number; scale?: number; frame: number }> = ({
  x,
  y,
  scale = 1,
  frame,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${Math.sin(frame / 28) * 3})`}>
    <path
      d="M -110 0 L 110 0 L 74 62 L -74 62 Z"
      fill={kidTheme.tomato}
      stroke={kidTheme.ink}
      strokeWidth={10}
      strokeLinejoin="round"
    />
    <path d="M 0 0 L 0 -128" stroke={kidTheme.ink} strokeWidth={11} strokeLinecap="round" />
    <path
      d="M 8 -122 L 92 -46 L 8 -46 Z"
      fill={kidTheme.paper}
      stroke={kidTheme.ink}
      strokeWidth={9}
      strokeLinejoin="round"
    />
  </g>
);

/**
 * Speed streaks for the sunbeam ride: near-vertical strokes that scroll down
 * the frame. `strength` fades the whole field, so the ride can stop.
 */
export const SpeedStreaks: React.FC<{ strength: number; frame: number; color?: string }> = ({
  strength,
  frame,
  color = kidTheme.sunLight,
}) => {
  if (strength <= 0.01) return null;
  return (
    <>
      {Array.from({ length: 22 }, (_, i) => {
        const lane = ((i * 173) % 1900) + 20;
        const len = 180 + (i % 4) * 120;
        const y = ((frame * (26 + (i % 5) * 7) + i * 331) % 2200) - 700;
        return (
          <path
            key={i}
            d={`M ${lane} ${y} L ${lane + 12} ${y + len}`}
            stroke={color}
            strokeWidth={9 + (i % 3) * 4}
            strokeLinecap="round"
            opacity={strength * (0.25 + 0.3 * ((i % 4) / 4))}
          />
        );
      })}
    </>
  );
};

// Re-exported so a scene file needs one import for the whole kit. Everything
// below is episode one's, unchanged.
export {
  Bubbles,
  CHAR_BOX,
  Camera,
  CaptionCard,
  CutFlash,
  PHASE,
  SkyBlend,
  SteamWisps,
  Vignette,
  WaterBand,
  WideLayer,
  bubbleAbove,
  crownOf,
  lineProgress,
  lineWindow,
  markCentre,
  midOf,
  project,
  projectMark,
  speakerOf,
  stand,
  turnFor,
  useEmotion,
  useLineKey,
  useLookAtSpeaker,
  useTalking,
} from "../../water-cycle/scenes/common";
export type { Cast, Mark, Speaker } from "../../water-cycle/scenes/common";
export type { TimedScene };
