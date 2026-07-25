import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, darkOutline } from "../theme";

// Full-screen opening title: springs in, subtitle follows.
export const TitleCard: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const sub = spring({
    frame: frame - 12,
    fps,
    config: { damping: 16, mass: 0.9 },
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        padding: "0 120px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 108,
          fontWeight: 900,
          letterSpacing: -1,
          textShadow: darkOutline(3),
          transform: `scale(${0.6 + 0.4 * pop})`,
          opacity: pop,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontSize: 46,
            fontWeight: 600,
            color: theme.textMuted,
            textShadow: darkOutline(1),
            transform: `translateY(${(1 - sub) * 30}px)`,
            opacity: Math.max(0, sub),
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};
