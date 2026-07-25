import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { kidTheme } from "./../theme";

// Blobby — a background water drop. Deliberately *not* rigged: no blink, no
// emotion table, no mouth sync, one sine for the bob. A crowd scene wants
// twenty of these, and twenty full rigs would be twenty blink sequences walked
// per frame for characters nobody is looking at.
//
// Rule of thumb: if it has a line, it's a Drip; if it's scenery, it's a Blobby.

export type BlobbyProps = {
  x: number;
  y: number;
  scale?: number;
  /** Desync offset — always give each one a different value. */
  phase?: number;
  color?: string;
  edge?: string;
  /** -1 looks left, 0 at camera, 1 right. */
  look?: number;
  /** Simple mood: a smile, a flat line, or an open "o". */
  mood?: "happy" | "calm" | "surprised";
  opacity?: number;
};

export const Blobby: React.FC<BlobbyProps> = ({
  x,
  y,
  scale = 1,
  phase = 0,
  color = kidTheme.water,
  edge = kidTheme.waterDeep,
  look = 0,
  mood = "happy",
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const bob = Math.sin(t * 2.4 + phase) * 6;
  const squash = 1 + Math.sin(t * 2.4 + phase) * 0.04;

  const mouth =
    mood === "surprised"
      ? null
      : mood === "calm"
        ? "M -12 22 L 12 22"
        : "M -13 18 Q 0 30 13 18";

  return (
    <g
      transform={`translate(${x} ${y + bob}) scale(${scale} ${scale * squash})`}
      opacity={opacity}
    >
      <path
        d="M 0 -62 C 11 -38 38 -18 38 6 A 38 38 0 0 1 -38 6 C -38 -18 -11 -38 0 -62 Z"
        fill={color}
        stroke={edge}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <ellipse cx={-19} cy={0} rx={7} ry={9} fill="#ffffff" opacity={0.75} />
      <circle cx={-11 + look * 3} cy={2} r={5.4} fill={kidTheme.ink} />
      <circle cx={11 + look * 3} cy={2} r={5.4} fill={kidTheme.ink} />
      {mouth ? (
        <path d={mouth} stroke={kidTheme.ink} strokeWidth={4} strokeLinecap="round" fill="none" />
      ) : (
        <ellipse cx={0} cy={22} rx={7} ry={9} fill={kidTheme.mouthDark} />
      )}
    </g>
  );
};

/**
 * A crowd of Blobbys along a line — the common case, with the phases already
 * spread so nothing bobs in sync. Render inside an <svg> that covers the frame.
 */
export const BlobbyCrowd: React.FC<{
  count: number;
  x: number;
  y: number;
  spread: number;
  scale?: number;
  jitter?: number;
  opacity?: number;
}> = ({ count, x, y, spread, scale = 1, jitter = 26, opacity = 1 }) => (
  <>
    {Array.from({ length: count }, (_, i) => {
      const u = count === 1 ? 0.5 : i / (count - 1);
      // Deterministic wobble so a row doesn't look like a ruler.
      const j = Math.sin(i * 12.9898) * jitter;
      return (
        <Blobby
          key={i}
          x={x + (u - 0.5) * spread}
          y={y + j}
          scale={scale * (0.82 + 0.3 * Math.abs(Math.sin(i * 7.13)))}
          phase={i * 1.37}
          look={Math.sin(i * 4.2)}
          mood={i % 3 === 0 ? "calm" : "happy"}
          opacity={opacity}
        />
      );
    })}
  </>
);
