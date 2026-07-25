import React from "react";
import { CAPTION_SAFE_BOTTOM } from "../theme";

// The usable area of a captioned scene: the whole frame minus the strip
// reserved for the caption panel (`CAPTION_SAFE_BOTTOM`), with its children
// centered inside what's left.
//
// Use this instead of an ad-hoc `position: absolute; inset: 0` +
// `paddingBottom: <number>`. Hand-picked paddings drift from the caption's
// real height and produce overlap; this stays correct because both sides come
// from the same constant. See docs/STYLE.md.
export const ContentArea: React.FC<{
  children?: React.ReactNode;
  /** Main-axis direction for the centered children. */
  direction?: "row" | "column";
  /** Gap between children, in px. */
  gap?: number;
  /** Horizontal padding, in px. */
  paddingX?: number;
  /** Escape hatch for scene-specific tweaks; cannot widen the safe area. */
  style?: React.CSSProperties;
}> = ({ children, direction = "row", gap = 0, paddingX = 90, style }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: CAPTION_SAFE_BOTTOM,
      display: "flex",
      flexDirection: direction,
      alignItems: "center",
      justifyContent: "center",
      gap,
      paddingLeft: paddingX,
      paddingRight: paddingX,
      ...style,
    }}
  >
    {children}
  </div>
);
