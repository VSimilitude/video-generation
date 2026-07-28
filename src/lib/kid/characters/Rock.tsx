import React from "react";
import { Face, useRig } from "../Character";
import { kidTheme } from "../theme";

/**
 * The rock. Wide, flat, grey, eyes shut, and — for the whole scene — utterly
 * motionless: `idle={0}` kills the breath, `eyeLife={0}` the saccades, the
 * closed eyes are drawn rather than blinked, and the emotion is a bare string
 * so there is no morph and no head settle. The only thing wired to anything is
 * the mouth, and only while its own line plays.
 *
 * This is the moose's successor (episode one's best-loved gag) and the
 * mechanism is identical: restraint. Nothing here is animated on purpose, and a
 * later episode that wakes it up should think hard first.
 *
 * A body with a face and a line gets its own voice — it is cameo-voiced, not
 * narrated, and the caller wires `speaking` from the *staged* speaker.
 */
export const Rock: React.FC<{
  x: number;
  y: number;
  scale: number;
  speaking: boolean;
  /** The cast's cycle offset for this body. */
  phase?: number;
}> = ({ x, y, scale, speaking, phase = 6.8 }) => {
  const rig = useRig({
    x,
    y,
    emotion: "happy",
    speaking,
    phase,
    idle: 0,
    eyeLife: 0,
    look: "camera",
  });
  const grey = "#9aa3ad";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 620,
        height: 340,
        marginLeft: -310,
        marginTop: -170,
        transform: `scale(${scale})`,
        transformOrigin: "50% 100%",
      }}
    >
      <svg width={620} height={340} viewBox="-310 -170 620 340" overflow="visible">
        <ellipse cx={10} cy={132} rx={280} ry={26} fill={kidTheme.ink} opacity={0.16} />
        <path
          d="M -262 118 Q -286 24 -196 -34 Q -108 -96 22 -92 Q 168 -88 244 -28 Q 292 12 268 118 Z"
          fill={grey}
          stroke={kidTheme.ink}
          strokeWidth={11}
          strokeLinejoin="round"
        />
        {/* Two flat highlights, not a gradient — the lids are painted in body
            colour and a ramp cannot be matched (Character.tsx, `skin`). */}
        <path d="M -184 -28 Q -96 -70 8 -66 Q -78 -34 -142 4 Z" fill="#b6bec7" opacity={0.85} />
        <path d="M 96 -70 Q 190 -56 232 -14 Q 172 -40 92 -46 Z" fill="#b6bec7" opacity={0.55} />
        <path
          d="M -212 66 Q -80 44 96 62"
          stroke="#7c858f"
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />
        {/* Eyes shut, drawn as two content little arcs, so no blink can fire. */}
        {[-1, 1].map((s) => (
          <path
            key={s}
            d={`M ${s * 66 - 26} -18 q 26 26 52 0`}
            stroke={kidTheme.ink}
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
          />
        ))}
        <Face
          rig={rig}
          x={0}
          y={-14}
          size={1.28}
          eyes={false}
          skin={grey}
          blushColor="#ff9a86"
          blushStrength={1.5}
        />
      </svg>
    </div>
  );
};
