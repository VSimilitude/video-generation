import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme, darkOutline } from "../theme";

// Bottom caption panel, fading/rising in slowly enough to be read. Keep the
// text matching (or tightly summarizing) the narration line for the scene.
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
        bottom: 64,
        display: "flex",
        justifyContent: "center",
        padding: "0 90px",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          textAlign: "center",
          background: theme.panel,
          border: `2px solid ${accent}88`,
          fontSize: 42,
          fontWeight: 600,
          lineHeight: 1.35,
          padding: "24px 46px",
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
