// Pure geometry for the fullscreen stage (src/site/FullscreenStage.tsx).
//
// Kept in its own module, free of React and of the DOM, for one reason: it is
// the part that is easy to get wrong and impossible to eyeball on a laptop.
// The maths here decides where a phone held in portrait sees a landscape
// video, and it can be exercised as a plain function.
//
// The problem: iOS refuses `screen.orientation.lock`, so a rotation-locked
// iPhone in portrait stays in portrait no matter what the page asks for. The
// only way to fill the screen with a 16:9 picture is to rotate the *content*
// 90° ourselves and let the viewer turn the phone.
//
// The transform, for a portrait viewport w x h (h > w):
//
//   content box:  width = h, height = w   (a landscape box)
//   transform:    translate(w, 0) rotate(90deg), origin 0 0
//
//   content (x, y) -> screen (w - y, x)
//
//   (0,0)   -> (w, 0)    content's top-left     = screen's top-RIGHT
//   (h,0)   -> (w, h)    content's top-right    = screen's bottom-right
//   (0,w)   -> (0, 0)    content's bottom-left  = screen's top-left
//   (h,w)   -> (0, h)    content's bottom-right = screen's bottom-left
//
// so the box exactly covers the viewport, and the content's "up" points at the
// screen's right edge: the viewer turns the phone counter-clockwise (notch to
// the left) to watch. That direction is chosen deliberately — see `rotate90` on
// the safe-area remap below.

export type Viewport = { width: number; height: number };

/** The four safe-area insets, as CSS values (so they can stay `env()` calls). */
export type Insets = {
  top: string;
  right: string;
  bottom: string;
  left: string;
};

export type StageBox = {
  /** True when the viewport is portrait and the content is rotated 90°. */
  rotated: boolean;
  /** The physical viewport, CSS px — the size of the black backing element. */
  viewportWidth: number;
  viewportHeight: number;
  /** The content box's own dimensions: landscape whenever there is a choice. */
  width: number;
  height: number;
  transform: string;
  transformOrigin: string;
  /**
   * The device's safe-area insets expressed in the content box's own axes, so
   * a notch stays clear of the picture whichever way the box is turned.
   */
  insets: Insets;
};

const ENV: Insets = {
  top: "env(safe-area-inset-top, 0px)",
  right: "env(safe-area-inset-right, 0px)",
  bottom: "env(safe-area-inset-bottom, 0px)",
  left: "env(safe-area-inset-left, 0px)",
};

/**
 * `env(safe-area-inset-*)` is always reported in *screen* axes. Under the 90°
 * rotation above, the screen's top edge runs down the content's left edge, so
 * the insets have to be turned with the box:
 *
 *   content edge  <- screen edge
 *   left          <- top      (the notch, in a portrait-locked phone)
 *   right         <- bottom   (the home indicator)
 *   top           <- right
 *   bottom        <- left
 *
 * This is why the rotation goes clockwise rather than counter-clockwise: it
 * puts the notch and the home indicator on the content's *sides*, where a 16:9
 * picture in a 19.5:9 box already has black bars, instead of across the top of
 * the frame and the player's control bar.
 */
function rotate90(insets: Insets): Insets {
  return {
    top: insets.right,
    right: insets.bottom,
    bottom: insets.left,
    left: insets.top,
  };
}

/**
 * Lay out the fullscreen stage for a viewport.
 *
 * Landscape (including every desktop window) passes straight through: no
 * transform, insets unchanged. Portrait gets the rotated box described above.
 */
export function stageBox(viewport: Viewport, insets: Insets = ENV): StageBox {
  // Sub-pixel viewport sizes are normal on iOS (and a fractional box leaves a
  // hairline of page showing through at the edge). Floor, never round up.
  const width = Math.max(1, Math.floor(viewport.width));
  const height = Math.max(1, Math.floor(viewport.height));

  if (height <= width) {
    return {
      rotated: false,
      viewportWidth: width,
      viewportHeight: height,
      width,
      height,
      transform: "none",
      transformOrigin: "0 0",
      insets,
    };
  }

  return {
    rotated: true,
    viewportWidth: width,
    viewportHeight: height,
    width: height,
    height: width,
    transform: `translate(${width}px, 0px) rotate(90deg)`,
    transformOrigin: "0 0",
    insets: rotate90(insets),
  };
}
