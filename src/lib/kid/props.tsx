import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kidOutline, kidRadius, kidShadow, kidTheme, kidType } from "./theme";

// Recurring props that have earned their way out of an episode: drawn furniture
// with no episode knowledge in them, each written identically twice before
// being promoted.

/**
 * The cartoon thermometer. `level` is 0..1 of the tube.
 *
 * Episode one heats the sea under Sunny with it; episode two heats a rock. A
 * hot thermometer shivers a little and a cold one holds still, which is the
 * only thing in it that is not a straight readout.
 */
export const Thermometer: React.FC<{
  x: number;
  y: number;
  level: number;
  scale?: number;
  label?: string;
}> = ({ x, y, level, scale = 1, label }) => {
  const frame = useCurrentFrame();
  const u = Math.max(0, Math.min(1, level));
  const tubeTop = -230;
  const tubeBottom = 120;
  const fillTop = tubeBottom - (tubeBottom - tubeTop) * u;
  const shake = Math.sin(frame * 0.9) * 3 * u * u;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${shake}deg)`,
      }}
    >
      <svg width={220} height={520} viewBox="-110 -270 220 520" overflow="visible">
        <g stroke={kidTheme.ink} strokeWidth={9} strokeLinecap="round">
          <rect
            x={-34}
            y={tubeTop}
            width={68}
            height={tubeBottom - tubeTop + 40}
            rx={34}
            fill={kidTheme.paper}
          />
          <circle cx={0} cy={148} r={62} fill={kidTheme.paper} />
        </g>
        <rect
          x={-19}
          y={fillTop}
          width={38}
          height={tubeBottom - fillTop + 60}
          rx={19}
          fill={kidTheme.tomato}
        />
        <circle cx={0} cy={148} r={46} fill={kidTheme.tomato} />
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const ty = tubeBottom - (tubeBottom - tubeTop) * p;
          return (
            <path
              key={p}
              d={`M 36 ${ty} L ${p === 0 || p === 1 ? 84 : 66} ${ty}`}
              stroke={kidTheme.ink}
              strokeWidth={8}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -70,
            transform: "translateX(-50%)",
            fontSize: kidType.min,
            fontWeight: 900,
            letterSpacing: 2,
            color: kidTheme.ink,
            textShadow: kidOutline(4),
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/**
 * A caption card — gag furniture (episode one's "Monday / Tuesday / also
 * Tuesday"), and *not* a caption in the financial series' sense: the kids'
 * series has none.
 *
 * `align` exists because a centred card and a speech bubble both want the top
 * of the frame: put the card on the opposite side from the speaker.
 */
export const CaptionCard: React.FC<{
  text: string;
  from?: number;
  until?: number;
  y?: number;
  color?: string;
  align?: "left" | "center" | "right";
}> = ({ text, from = 0, until, y = 150, color = kidTheme.paper, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 12, mass: 0.6 } });
  const out = until === undefined ? 0 : Math.max(0, Math.min(1, (frame - until) / 6));
  const scale = s * (1 - out);
  if (scale <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent:
          align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        padding: align === "center" ? 0 : "0 96px",
        transform: `translateY(-50%) scale(${scale})`,
        zIndex: 45,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: color,
          border: `9px solid ${kidTheme.ink}`,
          borderRadius: kidRadius.card,
          padding: "16px 56px",
          fontSize: kidType.title * 0.62,
          fontWeight: 900,
          color: kidTheme.ink,
          boxShadow: kidShadow(1.2),
          transform: `rotate(${-1.5 + (1 - s) * 5}deg)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/**
 * Cloudia's hat, off her head — a prop in its own right, because it has now
 * blown across two episodes' endings (episode one's sign-off, episode two's
 * Scene 34) and the joke is that it is the *same* hat.
 *
 * Drawn as a bare `<g>` in composition coordinates: the caller supplies the
 * `<svg>` (a `WideLayer`, usually) and its own translate/rotate, because how it
 * tumbles is the scene's business. `stream` (0..1) adds the two ribbons trailing
 * behind it at speed; omit it for a hat that is merely in the air.
 */
export const CloudiaHat: React.FC<{ stream?: number }> = ({ stream }) => (
  <>
    <ellipse
      cx={0}
      cy={40}
      rx={120}
      ry={30}
      fill={kidTheme.pinkDeep}
      stroke={kidTheme.ink}
      strokeWidth={9}
    />
    <path
      d="M -66 40 L -50 -66 Q 0 -96 50 -66 L 66 40 Z"
      fill={kidTheme.pink}
      stroke={kidTheme.ink}
      strokeWidth={9}
      strokeLinejoin="round"
    />
    <path d="M -58 -18 L 58 -18" stroke={kidTheme.ink} strokeWidth={9} />
    {stream === undefined
      ? null
      : /* Ribbons, going the way the wind is. */
        [0, 1].map((i) => (
          <path
            key={i}
            d={`M 60 ${-20 + i * 26} q ${80 + stream * 120} ${-10 + i * 18} ${150 + stream * 220} ${4 + i * 26}`}
            stroke={kidTheme.pink}
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
            opacity={0.9}
          />
        ))}
  </>
);
