import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { kidTheme } from "./theme";

// The painted backdrop — Tier 2 of the kids' series look.
//
// `KidBackdrop` draws a sky out of CSS gradients and SVG; this one mounts a
// generated gouache plate (scripts/generate-backgrounds.mjs → public/backgrounds)
// underneath the same cast. The two are meant to coexist: a scene uses the
// painted plate for everything that is *scenery* and keeps every SVG element
// that moves, gets touched, or has to line up with a character's feet.
//
// Rules this component encodes:
//
//   - **A painted plate is never dead still.** Next to characters that breathe,
//     blink and drift, a photographic still reads as a slide the show forgot to
//     animate. `drift` is a few pixels of very slow sine on a plate scaled up
//     just enough that the edges never come into frame. Judge it in motion: if
//     you can see it move in a still pair two frames apart, it is too big.
//   - **The bottom of the frame belongs to the characters.** `vignette` pulls
//     the lower edge down a little so a character standing there is sitting in
//     a shadowed foreground instead of pasted onto a lit one.
//   - **Everything is a pure function of `frame`.** Same reason as the rig: no
//     refs, no `Date`, no randomness, so any frame renders alone.
//
// `Img` (rather than `<img>`) is deliberate: Remotion blocks the frame until it
// has decoded, so a render never emits a frame with a missing background.

export type KidPaintedBackdropProps = {
  /** Resolved URL — pass `staticFile(BACKGROUNDS[key])`. */
  src: string;
  /**
   * Peak drift in px. The plate is over-scaled by twice this, so the drift can
   * never expose an edge. 0 pins it (a scene that is *about* stillness).
   */
  drift?: number;
  /** Seconds for one full drift cycle. Long — this is scenery, not motion. */
  driftSeconds?: number;
  /** Phase offset, so two consecutive scenes don't drift in lockstep. */
  phase?: number;
  /** Extra zoom on top of the overscan (a scene pushing in on the world). */
  zoom?: number;
  /** Pan the plate, in px: a scene framing the left half of its world. */
  dx?: number;
  dy?: number;
  /** Soft darkening of the bottom edge, 0..1, for seating characters. */
  vignette?: number;
  /** Colour wash over the plate — an act's light, not a new palette. */
  tint?: string;
  /** Wash strength 0..1. */
  tintStrength?: number;
  /** Flip horizontally, when a scene needs its world facing the other way. */
  flip?: boolean;
  children?: React.ReactNode;
};

export const KidPaintedBackdrop: React.FC<KidPaintedBackdropProps> = ({
  src,
  drift = 12,
  driftSeconds = 26,
  phase = 0,
  zoom = 1,
  dx = 0,
  dy = 0,
  vignette = 0,
  tint,
  tintStrength = 0.18,
  flip = false,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  // Two incommensurable periods, so the plate never visibly repeats a loop:
  // horizontal on `driftSeconds`, vertical on roughly 1.6× that.
  const w = (2 * Math.PI) / Math.max(1, driftSeconds);
  const px = Math.sin(t * w + phase) * drift;
  const py = Math.sin(t * w * 0.62 + phase * 1.7) * drift * 0.45;
  // A breath of scale as well: pure translation on a flat plate reads as a
  // sliding photograph, a little scale with it reads as air.
  const breathe = 1 + 0.0035 * Math.sin(t * w * 0.5 + phase);

  // Overscan: enough that the drift *and* any pan can never show an edge. A
  // scene that pans the plate 200px to put its horizon where the SVG world
  // expects one pays for it in magnification — which is the honest trade, and
  // the reason `dy` is a staging decision rather than a nudge.
  const overscan =
    1 +
    Math.max(
      (drift * 2.4 + Math.abs(dx) * 2) / width,
      (drift * 2.4 + Math.abs(dy) * 2) / height,
    );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: kidTheme.skyLow,
        fontFamily: kidTheme.fontFamily,
        color: kidTheme.ink,
        // Pinned for the same reason KidBackdrop pins it: @remotion/player does
        // not reset inherited typography. See docs/STYLE.md.
        lineHeight: "normal",
      }}
    >
      <AbsoluteFill
        style={{
          transform: [
            `translate(${px + dx}px, ${py + dy}px)`,
            `scale(${overscan * breathe * zoom})`,
            flip ? "scaleX(-1)" : "",
          ].join(" "),
        }}
      >
        <Img
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </AbsoluteFill>

      {tint ? (
        <AbsoluteFill style={{ background: tint, opacity: tintStrength, mixBlendMode: "soft-light" }} />
      ) : null}

      {vignette > 0 ? (
        <AbsoluteFill
          style={{
            background: `linear-gradient(to top, rgba(28,52,38,${0.42 * vignette}) 0%, rgba(28,52,38,${0.16 * vignette}) 14%, transparent 34%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}

      {children}
    </AbsoluteFill>
  );
};

/**
 * The soft dark patch a character sits in. A painted world has real light in
 * it, so a flat-filled character with nothing underneath floats a few
 * centimetres off the plate — this is the cheapest fix and the one the
 * characters' own `shadow` props are too small for once they are staged in
 * front of a painting.
 *
 * `x`/`y` is the point on the ground (or the point directly under a hovering
 * character), in composition coordinates.
 */
export const KidContactShadow: React.FC<{
  x: number;
  y: number;
  /** Half-width in px. Roughly the character's own width. */
  rx?: number;
  ry?: number;
  strength?: number;
  /** rgb triple; the default is a green-shifted ink for grass and sand. */
  color?: string;
  zIndex?: number;
}> = ({ x, y, rx = 120, ry = 26, strength = 0.26, color = "26,50,36", zIndex }) => (
  <div
    style={{
      position: "absolute",
      left: x - rx,
      top: y - ry,
      width: rx * 2,
      height: ry * 2,
      borderRadius: "50%",
      background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(${color},${strength}) 0%, rgba(${color},${strength * 0.5}) 55%, rgba(${color},0) 78%)`,
      pointerEvents: "none",
      zIndex,
    }}
  />
);
