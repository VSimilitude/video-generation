// Base visual language for the educational suite. Deliberately neutral — a
// clean dark slate look with one accent — so individual videos can lean on it
// directly or override pieces per topic. Refine here as we learn what reads
// well (see docs/STYLE.md).

export const theme = {
  bgTop: "#1d2433",
  bgBottom: "#10141d",
  bgGlow: "#2a3550",

  panel: "rgba(10, 14, 24, 0.66)",
  panelBorder: "rgba(255, 255, 255, 0.14)",

  text: "#f4f6fb",
  textMuted: "#a8b0c4",

  accent: "#4cc2ff",
  accentSoft: "#8fdcff",
  warm: "#ffb84c",
  good: "#7fe08a",

  outline: "#0a0e18",
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as const;

// --- Caption geometry / layout safe area ----------------------------------
//
// The single source of truth for the bottom caption panel's size. `Caption`
// renders from these numbers, and `CAPTION_SAFE_BOTTOM` is derived from them,
// so the panel and the space reserved for it can never drift apart.

export const captionMetrics = {
  bottom: 64, // distance from the frame's bottom edge to the panel
  maxWidth: 1440,
  fontSize: 42,
  lineHeight: 1.35,
  paddingY: 24,
  paddingX: 46,
  borderWidth: 2,
  maxLines: 2, // see docs/STYLE.md — a caption that needs 3 lines is too long
} as const;

// Worst-case rendered height of the caption panel itself:
//
//   text     2 lines x 42px x 1.35 line-height = 113.4 -> 114 px
//   padding  24 top + 24 bottom                =  48 px
//   border   2 top + 2 bottom                  =   4 px
//                                               ------
//                                                166 px
const CAPTION_PANEL_HEIGHT =
  Math.ceil(
    captionMetrics.maxLines * captionMetrics.fontSize * captionMetrics.lineHeight,
  ) +
  2 * captionMetrics.paddingY +
  2 * captionMetrics.borderWidth;

// Breathing room above the panel. Covers the panel's 30px drop-shadow blur and
// keeps diagram edges from visually crowding the caption's top border.
const CAPTION_SAFE_MARGIN = 50;

/**
 * Height in px of the strip at the bottom of the frame that belongs to the
 * caption. Nothing else may be drawn inside it.
 *
 *   64 (bottom offset) + 166 (panel) + 50 (margin) = 280
 *
 * On a 1080-tall frame that leaves 800px of usable content height. Captioned
 * scenes get that area from `<ContentArea>` (src/lib/components/ContentArea.tsx)
 * rather than by picking their own `paddingBottom`.
 */
export const CAPTION_SAFE_BOTTOM =
  captionMetrics.bottom + CAPTION_PANEL_HEIGHT + CAPTION_SAFE_MARGIN;

// Layered dark outline so light text stays readable over any backdrop.
export function darkOutline(w = 2): string {
  const o = theme.outline;
  return [
    `-${w}px -${w}px 0 ${o}`,
    `${w}px -${w}px 0 ${o}`,
    `-${w}px ${w}px 0 ${o}`,
    `${w}px ${w}px 0 ${o}`,
    `0 ${w + 1}px ${w + 2}px rgba(0,0,0,0.55)`,
  ].join(", ");
}
