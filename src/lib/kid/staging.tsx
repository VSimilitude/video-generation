import React from "react";
import { AbsoluteFill } from "remotion";

// Staging geometry and the camera — the part of an episode's scene kit that is
// arithmetic rather than art direction.
//
// Episodes one and two each grew their own copy of this (`scenes/common.tsx`),
// and the copies agreed on every formula. Where they differed they differed in
// *data* — a different cast in `CHAR_BOX`, a different default body, ten pixels
// of bubble lift, a taller wide-layer box — so what is promoted here is the
// arithmetic, parameterised by that data. An episode binds it once:
//
//   export const CHAR_BOX = { puff: 340, drip: 380, … } as const;
//   export type Body = keyof typeof CHAR_BOX;
//   export type Mark = KitMark<Body>;
//   const geom = makeBodyGeometry({ box: CHAR_BOX, body: "puff", bubbleLift: 165 });
//   export const { stand, hover, crownOf, midOf, bubbleAbove, markCentre,
//                  projectMark } = geom;
//
// and its act files keep importing those names from `./common`, unchanged.

/**
 * Where a body stands. Pass exactly the `x`, `y` and `scale` you gave the
 * component and the helpers do the rest: bubbles clear the crown, looks aim at
 * the middle.
 */
export type Mark<B extends string = string> = {
  x: number;
  y: number;
  /** The component's own `scale` prop. */
  scale?: number;
  /** Which body's geometry to use. Defaults to the episode's hero. */
  who?: B;
  /** Override: bubble centre this far above `y` instead of above the crown. */
  lift?: number;
  /** Horizontal gap from the body to the bubble. Default 330. */
  offset?: number;
  /** Which side of the body the bubble sits on; default = towards centre. */
  side?: "left" | "right";
};

export type BodyGeometry<B extends string> = {
  /** `y` prop for a body whose feet should land on `groundY`. */
  stand: (who: B, groundY: number) => number;
  /**
   * `y` prop for a body whose *middle* should sit at `centreY` — the one a
   * character who never stands on anything needs. At scale 1 it is the same as
   * `centreY`; below 1 the difference is most of the character.
   */
  hover: (who: B, centreY: number, scale?: number) => number;
  /** Screen y of the top of a body's head — what a bubble has to clear. */
  crownOf: (who: B, y: number, scale?: number) => number;
  /** Screen y of a body's visual middle — what another character looks at. */
  midOf: (who: B, y: number, scale?: number) => number;
  /** Bubble centre for a mark: clear of the crown, with room for the tail. */
  bubbleAbove: (m: Mark<B>) => number;
  /** The point another character should look at. */
  markCentre: (m: Mark<B>) => { x: number; y: number };
  /** A mark as it appears on screen under a camera move. */
  projectMark: (cam: Cam, m: Mark<B>) => Mark<B>;
};

/**
 * The staging arithmetic for one episode's cast.
 *
 * `box` is the natural SVG box height of each body, from its component file.
 * It is needed because `CharacterFrame` scales about the **bottom** of that
 * box: a character's `y` prop plus half this number is a ground line that does
 * not move when you change `scale`. Everything below is derived from that fact
 * — it is the single easiest thing to get wrong when staging.
 */
export function makeBodyGeometry<Box extends Record<string, number>>(opts: {
  box: Box;
  /** Default body for a mark that does not name one. */
  body: keyof Box & string;
  /** How far above the crown a bubble's centre sits. */
  bubbleLift?: number;
}): BodyGeometry<keyof Box & string> {
  type B = keyof Box & string;
  const { box, body: fallback, bubbleLift = 170 } = opts;
  const stand = (who: B, groundY: number): number => groundY - box[who] / 2;
  const hover = (who: B, centreY: number, scale = 1): number =>
    centreY - box[who] / 2 + (box[who] * scale) / 2;
  const crownOf = (who: B, y: number, scale = 1): number => {
    const h = box[who];
    return y + h / 2 - h * scale;
  };
  const midOf = (who: B, y: number, scale = 1): number => {
    const h = box[who];
    return y + h / 2 - (h * scale) / 2;
  };
  const bubbleAbove = (m: Mark<B>): number => {
    if (m.lift !== undefined) return m.y - m.lift;
    return crownOf(m.who ?? fallback, m.y, m.scale ?? 1) - bubbleLift;
  };
  const markCentre = (m: Mark<B>): { x: number; y: number } => ({
    x: m.x,
    y: midOf(m.who ?? fallback, m.y, m.scale ?? 1),
  });
  // The character's ground line projects like any point; the scale multiplies.
  const projectMark = (cam: Cam, m: Mark<B>): Mark<B> => {
    const h = box[m.who ?? fallback];
    const ground = project(cam, { x: m.x, y: m.y + h / 2 });
    return {
      ...m,
      x: ground.x,
      y: ground.y - h / 2,
      scale: (m.scale ?? 1) * (cam.zoomY ?? cam.zoom ?? 1),
    };
  };
  return { stand, hover, crownOf, midOf, bubbleAbove, markCentre, projectMark };
}

// ---------------------------------------------------------------------------
// The camera
// ---------------------------------------------------------------------------

/**
 * A camera move, as a transform on whatever is inside it. `x`/`y` is the point
 * that stays put (the thing you are pushing in on).
 *
 * Zooming *out* below 1 shows past the edge of the frame, so keep the sky
 * outside the camera in a pull-out shot and only put the world inside it.
 */
export type Cam = {
  x: number;
  y: number;
  zoom?: number;
  /** Vertical zoom, when it differs — a squash, a stretch. */
  zoomY?: number;
  dx?: number;
  dy?: number;
  rotate?: number;
};

export const Camera: React.FC<{ cam: Cam; children: React.ReactNode }> = ({
  cam,
  children,
}) => (
  <AbsoluteFill
    style={{
      transformOrigin: `${cam.x}px ${cam.y}px`,
      transform: [
        `translate(${cam.dx ?? 0}px, ${cam.dy ?? 0}px)`,
        `rotate(${cam.rotate ?? 0}deg)`,
        `scale(${cam.zoom ?? 1}, ${cam.zoomY ?? cam.zoom ?? 1})`,
      ].join(" "),
    }}
  >
    {children}
  </AbsoluteFill>
);

/**
 * World point -> screen point under a camera. Bubbles live *outside* the camera
 * (a zoomed bubble is unreadable), so a bubble on a character inside one is
 * placed with `project(cam, mark)`. Ignores `rotate`.
 */
export function project(cam: Cam, p: { x: number; y: number }): { x: number; y: number } {
  const z = cam.zoom ?? 1;
  const zy = cam.zoomY ?? z;
  return {
    x: cam.x + (p.x - cam.x) * z + (cam.dx ?? 0),
    y: cam.y + (p.y - cam.y) * zy + (cam.dy ?? 0),
  };
}

// ---------------------------------------------------------------------------
// The wide scenery layer
// ---------------------------------------------------------------------------

/** The box a `WideLayer` draws in, in composition coordinates. */
export type WideBox = { x: number; y: number; w: number; h: number };

export type WideLayerProps = {
  opacity?: number;
  zIndex?: number;
  children: React.ReactNode;
};

/**
 * A scenery layer that extends far past the frame on every side. An `<svg>`
 * clips to its own viewport, so a plain full-frame one loses its edges the
 * moment a scene pulls out below 1×. Draw in ordinary composition coordinates.
 *
 * The box is per episode (how far out a scene ever pulls), so the component is
 * bound to it once:
 *
 *   export const WIDE = { x: -1200, y: -600, w: 4400, h: 2400 } as const;
 *   export const WideLayer = makeWideLayer(WIDE);
 */
export function makeWideLayer(wide: WideBox): React.FC<WideLayerProps> {
  const WideLayer: React.FC<WideLayerProps> = ({ opacity = 1, zIndex, children }) => (
    <svg
      width={wide.w}
      height={wide.h}
      viewBox={`${wide.x} ${wide.y} ${wide.w} ${wide.h}`}
      style={{
        position: "absolute",
        left: wide.x,
        top: wide.y,
        opacity,
        zIndex,
        pointerEvents: "none",
      }}
    >
      {children}
    </svg>
  );
  return WideLayer;
}
