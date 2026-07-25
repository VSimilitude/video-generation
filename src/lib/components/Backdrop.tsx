import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

// Standard scene backdrop: vertical gradient with a soft center glow.
export const Backdrop: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, ${theme.bgTop} 0%, ${theme.bgBottom} 100%)`,
      fontFamily: theme.fontFamily,
      color: theme.text,
      // Explicit, because @remotion/player does not reset inherited typography:
      // whatever line-height the *host page* sets around the <Player> cascades
      // into the composition. Studio and `remotion render` use the UA default
      // ("normal"), so pinning it here makes the site match them instead of
      // silently collapsing every line box that doesn't set its own.
      lineHeight: "normal",
    }}
  >
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 55% at 50% 42%, ${theme.bgGlow}66 0%, transparent 70%)`,
      }}
    />
    {children}
  </AbsoluteFill>
);
