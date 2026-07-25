import React from "react";
import { theme, darkOutline } from "../theme";

// A rate dial: a 240°-sweep gauge whose needle and coloured arc read a single
// number, with the formatted value under it.
//
// Promoted from bond-basics (where it was the "yield" scene's dial) on its
// second use — swap-basics turns the same dial to find the fair swap rate. The
// component is deliberately dumb: the caller decides the angle, the colour and
// the formatted string, because "which way is good" is a per-scene judgement
// (a yield above the coupon is one story, a fixed rate below the market rate is
// another). What it owns is the geometry, which is what two videos should not
// each re-derive.
//
// Rendered height is 327px: 43 (label) + 210 (arc svg) + 74 (value). Callers
// budget `DIAL_HEIGHT` against CAPTION_SAFE_BOTTOM.

/** Needle angle, in degrees, at either end stop. */
export const DIAL_END_ANGLE = 120;

export const DIAL_HEIGHT = 43 + 210 + 74;

/**
 * Map a value to a needle angle: `center` points straight up, and a distance of
 * `range` in either direction swings the needle to its end stop.
 *
 *   dialAngle(0.06, 0.05, 0.02) -> +60°
 */
export function dialAngle(value: number, center: number, range: number): number {
  return ((value - center) / range) * DIAL_END_ANGLE;
}

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
}

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M${x0},${y0} A${r},${r} 0 ${large} ${sweep} ${x1},${y1}`;
}

export const Dial: React.FC<{
  /** Small caps label above the gauge, e.g. "YIELD". */
  label: string;
  /** The formatted reading, e.g. "4.0%". Format it from the *value*. */
  value: string;
  /** Needle angle in degrees; use `dialAngle()`. 0 = straight up. */
  angle: number;
  /** Arc + reading colour. The caller picks it, so "which way is good" is a
   * scene decision rather than a component one. */
  color: string;
  opacity?: number;
}> = ({ label, value, angle, color, opacity = 1 }) => {
  const [nx, ny] = polar(150, 150, 86, angle);
  return (
    <div style={{ textAlign: "center", opacity }}>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: 2,
          color: theme.textMuted,
          textShadow: darkOutline(1),
        }}
      >
        {label}
      </div>
      <svg width={300} height={210} viewBox="0 0 300 210">
        <path
          d={arcPath(150, 150, 100, -DIAL_END_ANGLE, DIAL_END_ANGLE)}
          fill="none"
          stroke={theme.panelBorder}
          strokeWidth={16}
          strokeLinecap="round"
        />
        <path
          d={arcPath(150, 150, 100, 0, angle)}
          fill="none"
          stroke={color}
          strokeWidth={16}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 14px ${color}88)` }}
        />
        <line
          x1={150}
          y1={150}
          x2={nx}
          y2={ny}
          stroke={theme.text}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <circle cx={150} cy={150} r={16} fill={theme.text} />
      </svg>
      <div
        style={{
          marginTop: -4,
          fontSize: 62,
          fontWeight: 900,
          color,
          fontVariantNumeric: "tabular-nums lining-nums",
          textShadow: darkOutline(2),
        }}
      >
        {value}
      </div>
    </div>
  );
};
