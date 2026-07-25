import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme, darkOutline, captionMetrics } from "../theme";

// Bottom caption panel, fading/rising in slowly enough to be read. Keep the
// text matching (or tightly summarizing) the narration line for the scene.
//
// Geometry lives in `captionMetrics` (src/lib/theme.ts) because
// `CAPTION_SAFE_BOTTOM` — the strip scenes must keep clear — is derived from
// it. Change sizes there, not here.
export const Caption: React.FC<{ text: string; accent?: string }> = ({
  text,
  accent = theme.accent,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 20], [28, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: captionMetrics.bottom,
        display: "flex",
        justifyContent: "center",
        padding: "0 90px",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          maxWidth: captionMetrics.maxWidth,
          textAlign: "center",
          background: theme.panel,
          border: `${captionMetrics.borderWidth}px solid ${accent}88`,
          fontSize: captionMetrics.fontSize,
          fontWeight: 600,
          lineHeight: captionMetrics.lineHeight,
          padding: `${captionMetrics.paddingY}px ${captionMetrics.paddingX}px`,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          textShadow: darkOutline(1),
        }}
      >
        {text}
      </div>
    </div>
  );
};
