import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kidRadius, kidShadow, kidTheme, kidType } from "./theme";

// Speech and thought bubbles for the kids' series.
//
// Nothing about this is the financial suite's caption: a caption is a bottom
// panel that mirrors the narration, a bubble is a character *saying a thing*.
// It sits next to the speaker, it pops rather than fades, and it holds at most
// six words — a six-year-old reads a bubble by shape, so anything longer is a
// paragraph floating in the sky.

/** Hard limit, enforced by a warning rather than by truncation. */
export const MAX_BUBBLE_WORDS = 6;

const warned = new Set<string>();

export type SpeechBubbleProps = {
  /** Bubble centre in composition px. */
  x: number;
  y: number;
  text: string;
  /** Which side the tail leaves from — put it on the speaker's side. */
  tail?: "left" | "right" | "none";
  variant?: "speech" | "thought";
  /** Frame the bubble pops in on (local to the enclosing sequence). */
  from?: number;
  /** Frame it pops back out on; omit to leave it up. */
  until?: number;
  fontSize?: number;
  maxWidth?: number;
  /** Bubble fill and outline. Defaults are paper + ink. */
  background?: string;
  outline?: string;
  color?: string;
  zIndex?: number;
};

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  x,
  y,
  text,
  tail = "left",
  variant = "speech",
  from = 0,
  until,
  fontSize = kidType.bubble,
  maxWidth = 660,
  background = kidTheme.paper,
  outline = kidTheme.ink,
  color = kidTheme.ink,
  zIndex = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.trim().split(/\s+/).length;
  if (words > MAX_BUBBLE_WORDS && !warned.has(text)) {
    warned.add(text);
    // eslint-disable-next-line no-console
    console.warn(
      `[kid/SpeechBubble] "${text}" is ${words} words; the limit is ${MAX_BUBBLE_WORDS}. Split it into two beats.`,
    );
  }

  const pop = spring({
    frame: frame - from,
    fps,
    config: { damping: 10, mass: 0.55 },
  });
  // Popping out is a fast shrink, not a spring — an overshoot on the way out
  // reads as a second entrance.
  const out =
    until === undefined ? 0 : Math.max(0, Math.min(1, (frame - until) / 7));
  const scale = Math.max(0, pop * (1 - out));
  const opacity = Math.min(1, Math.max(0, (frame - from) / 3)) * (1 - out);
  if (scale <= 0.001) return null;

  const isThought = variant === "thought";
  // Grow out of the tail, i.e. out of the speaker's mouth.
  const origin =
    tail === "left" ? "18% 105%" : tail === "right" ? "82% 105%" : "50% 100%";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: origin,
        opacity,
        zIndex,
        fontFamily: kidTheme.fontFamily,
      }}
    >
      {tail !== "none" ? (
        isThought ? (
          <ThoughtTrail side={tail} outline={outline} background={background} />
        ) : (
          <Tail side={tail} outline={outline} background={background} />
        )
      ) : null}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth,
          background,
          border: `7px solid ${outline}`,
          borderRadius: isThought ? kidRadius.pill : kidRadius.bubble,
          padding: isThought ? "34px 56px" : "26px 44px",
          fontSize,
          fontWeight: 800,
          lineHeight: 1.16,
          letterSpacing: -0.5,
          color,
          textAlign: "center",
          whiteSpace: "pre-wrap",
          boxShadow: kidShadow(1),
        }}
      >
        {text}
      </div>
    </div>
  );
};

// The tail is drawn *behind* the bubble and pushed up under it, so the bubble's
// own background and border cover the seam. No masks, no matching arcs.
const TAIL_W = 104;
const TAIL_H = 78;

const Tail: React.FC<{ side: "left" | "right"; outline: string; background: string }> = ({
  side,
  outline,
  background,
}) => (
  <svg
    width={TAIL_W}
    height={TAIL_H}
    viewBox={`0 0 ${TAIL_W} ${TAIL_H}`}
    style={{
      position: "absolute",
      bottom: -TAIL_H + 26,
      left: side === "left" ? 54 : undefined,
      right: side === "right" ? 54 : undefined,
      zIndex: 0,
      transform: side === "right" ? "scaleX(-1)" : undefined,
      overflow: "visible",
    }}
  >
    <path
      d="M 96 -22 Q 52 20 2 74 Q 44 46 104 18 Z"
      fill={background}
      stroke={outline}
      strokeWidth={7}
      strokeLinejoin="round"
    />
  </svg>
);

const ThoughtTrail: React.FC<{
  side: "left" | "right";
  outline: string;
  background: string;
}> = ({ side, outline, background }) => (
  <svg
    width={120}
    height={130}
    viewBox="0 0 120 130"
    style={{
      position: "absolute",
      bottom: -118,
      left: side === "left" ? 36 : undefined,
      right: side === "right" ? 36 : undefined,
      zIndex: 0,
      transform: side === "right" ? "scaleX(-1)" : undefined,
      overflow: "visible",
    }}
  >
    {[
      [86, 18, 26],
      [46, 62, 17],
      [16, 104, 11],
    ].map(([cx, cy, r]) => (
      <circle
        key={cx}
        cx={cx}
        cy={cy}
        r={r}
        fill={background}
        stroke={outline}
        strokeWidth={6}
      />
    ))}
  </svg>
);
