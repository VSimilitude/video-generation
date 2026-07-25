import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kidRadius, kidShadow, kidTheme, kidType } from "./theme";

// The Big Word card. When a vocabulary word lands in the narration —
// EVAPORATION, CONDENSATION — it arrives as an event: a starburst behind, a
// ribbon banner, and the letters bouncing in one at a time so the word is
// spelled out rather than revealed.
//
// One per scene, and only for a word the episode is actually teaching. If two
// of these fire in a minute they stop meaning "learn this".

export type WordCardProps = {
  text: string;
  /** Frame the first letter lands on. */
  from?: number;
  /** Frame it leaves on; omit to hold. */
  until?: number;
  /** Vertical centre in composition px. */
  y?: number;
  /** Letter colour and the banner behind it. */
  color?: string;
  bannerColor?: string;
  /** Small line under the word (a definition in four words, at most). */
  sub?: string;
  fontSize?: number;
  /** Frames between consecutive letters. */
  stagger?: number;
  starburst?: boolean;
  zIndex?: number;
};

export const WordCard: React.FC<WordCardProps> = ({
  text,
  from = 0,
  until,
  y = 300,
  color = kidTheme.paper,
  bannerColor = kidTheme.pink,
  sub,
  fontSize = kidType.word,
  stagger = 2.5,
  starburst = true,
  zIndex = 50,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const letters = text.split("");
  const f = frame - from;

  // The banner arrives first and the letters land on it.
  const banner = spring({ frame: f, fps, config: { damping: 12, mass: 0.8 } });
  const allIn = f - (letters.length - 1) * stagger;
  const out = until === undefined ? 0 : Math.max(0, Math.min(1, (frame - until) / 8));
  const showScale = banner * (1 - out);
  if (showScale <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(-50%) scale(${showScale})`,
        opacity: 1 - out,
        zIndex,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      {/* Kept small enough to stay behind the banner: at 1500px the spikes
          reached the characters and, because the card owns a z-index, drew
          over their faces. */}
      {starburst ? <Starburst frame={f} size={Math.min(width * 0.42, 800)} /> : null}

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          background: bannerColor,
          border: `9px solid ${kidTheme.ink}`,
          borderRadius: kidRadius.banner,
          padding: "18px 72px 26px",
          boxShadow: kidShadow(1.2),
          transform: `rotate(${-1.6 + (1 - banner) * 4}deg)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          {letters.map((ch, i) => (
            <Letter
              key={`${ch}-${i}`}
              ch={ch}
              frame={f - i * stagger}
              fps={fps}
              fontSize={fontSize}
              color={color}
            />
          ))}
        </div>
        {sub ? (
          <div
            style={{
              fontSize: kidType.bubbleSmall,
              fontWeight: 800,
              color: kidTheme.paper,
              opacity: Math.max(0, Math.min(1, allIn / 8)),
              letterSpacing: 1.5,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Letter: React.FC<{
  ch: string;
  frame: number;
  fps: number;
  fontSize: number;
  color: string;
}> = ({ ch, frame, fps, fontSize, color }) => {
  const s = spring({ frame, fps, config: { damping: 9, mass: 0.5 } });
  if (ch === " ") return <span style={{ width: fontSize * 0.34 }} />;
  return (
    <span
      style={{
        display: "inline-block",
        fontSize,
        fontWeight: 900,
        lineHeight: 1,
        color,
        WebkitTextStroke: `${Math.round(fontSize * 0.055)}px ${kidTheme.ink}`,
        textShadow: `0 ${Math.round(fontSize * 0.05)}px 0 rgba(36,52,71,0.35)`,
        transform: `translateY(${(1 - s) * -120}px) scale(${0.3 + 0.7 * s}) rotate(${(1 - s) * 14}deg)`,
        opacity: Math.min(1, Math.max(0, frame / 2)),
      }}
    >
      {ch}
    </span>
  );
};

/** Slowly rotating spikes behind the banner. Pure decoration, kept cheap. */
const Starburst: React.FC<{ frame: number; size: number }> = ({ frame, size }) => {
  const spikes = 18;
  const r = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-r} ${-r} ${size} ${size}`}
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <g transform={`rotate(${frame * 0.18})`} opacity={0.34}>
        {Array.from({ length: spikes }, (_, i) => {
          const len = i % 2 === 0 ? r : r * 0.72;
          return (
            <path
              key={i}
              transform={`rotate(${(360 / spikes) * i})`}
              d={`M -26 0 L 0 ${-len} L 26 0 Z`}
              fill={i % 2 === 0 ? kidTheme.star : kidTheme.sunLight}
            />
          );
        })}
      </g>
      <circle r={r * 0.42} fill={kidTheme.star} opacity={0.35} />
    </svg>
  );
};
