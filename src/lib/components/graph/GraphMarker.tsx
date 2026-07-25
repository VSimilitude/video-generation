import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme, svgTextOutline } from "../../theme";
import { useGraph, graphType, textWidth, type AxisSpec } from "./AnimatedGraph";

// A dot pinned to a curve at a given x, with dashed projections onto both axes
// and live numeric readouts.
//
// The readouts are the point of the component: the *value* is what animates
// (the caller interpolates x; y comes from the same function the curve is drawn
// from), so the number on screen is always the number the curve says. Nothing
// tweens between two pre-formatted strings.

/**
 * Width of a chip: its text (estimated — SVG has no layout pass we can read
 * back at render time) plus horizontal padding.
 */
export function chipWidth(text: string, fontSize: number, padX = 22): number {
  return textWidth(text, fontSize) + padX * 2;
}

const CHIP_H = graphType.readout + 26;

export const GraphChip: React.FC<{
  /** Chip centre, in data coordinates. */
  x: number;
  y: number;
  /** Pixel offset from that point — use to push a chip off the mark. */
  dx?: number;
  dy?: number;
  text: string;
  color: string;
  fontSize?: number;
  opacity?: number;
  /** "middle" centres the chip on (x+dx); "start"/"end" anchor an edge there. */
  anchor?: "start" | "middle" | "end";
}> = ({
  x,
  y,
  dx = 0,
  dy = 0,
  text,
  color,
  fontSize = graphType.chip,
  opacity = 1,
  anchor = "middle",
}) => {
  const { sx, sy, occlude } = useGraph();
  const w = chipWidth(text, fontSize);
  const h = fontSize + 26;
  const cx = sx(x) + dx;
  const cy = sy(y) + dy;
  const left = anchor === "middle" ? cx - w / 2 : anchor === "end" ? cx - w : cx;
  // Claim the space: a chip on an axis is the live value replacing that stretch
  // of the scale, so the tick labels underneath it get out of the way. Declared
  // once the chip is solid enough to hide what is behind it.
  if (opacity > 0.15) {
    occlude({ left, right: left + w, top: cy - h / 2, bottom: cy + h / 2 });
  }
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity}>
      <rect
        x={left}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={h / 2}
        fill={theme.panel}
        stroke={color}
        strokeWidth={3}
      />
      <text
        x={left + w / 2}
        y={cy + fontSize * 0.35}
        textAnchor="middle"
        style={{
          ...svgTextOutline(4),
          fill: theme.text,
          fontSize,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums lining-nums",
        }}
      >
        {text}
      </text>
    </g>
  );
};

export const GraphMarker: React.FC<{
  /** The curve this marker is constrained to. */
  fn: (x: number) => number;
  /** Data x. Animate this (interpolate) — the readouts follow the function. */
  x: number;
  color: string;
  /** Fade/scale-in window for the marker itself. */
  appearAt?: number;
  /** Dashed lines from the dot down to the x axis and left to the y axis. */
  projections?: boolean;
  /** Value chips on each axis, replacing the tick labels they cover. */
  readouts?: boolean;
  /** Override the axis `format` for the readouts (e.g. more precision). */
  formatX?: (v: number) => string;
  formatY?: (v: number) => string;
  radius?: number;
}> = ({
  fn,
  x,
  color,
  appearAt = 0,
  projections = true,
  readouts = true,
  formatX,
  formatY,
  radius = 13,
}) => {
  const frame = useCurrentFrame();
  const graph = useGraph();
  const { sx, sy, plotH } = graph;
  const show = interpolate(frame, [appearAt, appearAt + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (show <= 0) return null;

  const yv = fn(x);
  const px = sx(x);
  const py = sy(yv);
  const fx = (formatX ?? (graph.x as AxisSpec).format)(x);
  const fy = (formatY ?? (graph.y as AxisSpec).format)(yv);

  return (
    <>
      <g opacity={show}>
        {projections ? (
          <g stroke={color} strokeWidth={3} strokeDasharray="12 14" opacity={0.75}>
            <line x1={px} y1={py} x2={px} y2={plotH} />
            <line x1={px} y1={py} x2={0} y2={py} />
          </g>
        ) : null}
        {/* Surface ring keeps the dot legible where it sits on its own curve. */}
        <circle
          cx={px}
          cy={py}
          r={radius + 5}
          fill="none"
          stroke={theme.bgBottom}
          strokeWidth={5}
          opacity={0.9}
        />
        <circle
          cx={px}
          cy={py}
          r={radius * (0.6 + 0.4 * show)}
          fill={color}
          style={{ filter: `drop-shadow(0 0 16px ${color}aa)` }}
        />
      </g>
      {/* Readouts carry their own opacity rather than inheriting the group's,
          so the tick labels they displace fade in step with them. */}
      {readouts ? (
        <>
          {/* On the y axis, right edge tucked just left of the axis line. */}
          <GraphChip
            x={graph.x.domain[0]}
            y={yv}
            dx={-16}
            anchor="end"
            text={fy}
            color={color}
            fontSize={graphType.readout}
            opacity={show}
          />
          {/* On the x axis, below it, centred on the marker. */}
          <GraphChip
            x={x}
            y={graph.y.domain[0]}
            dy={14 + CHIP_H / 2}
            text={fx}
            color={color}
            fontSize={graphType.readout}
            opacity={show}
          />
        </>
      ) : null}
    </>
  );
};

export const GraphLegend: React.FC<{
  entries: { label: string; color: string; opacity?: number }[];
  /** Top-left corner of the legend block, in px within the plot area. */
  x: number;
  y: number;
  opacity?: number;
}> = ({ entries, x, y, opacity = 1 }) => {
  if (opacity <= 0) return null;
  const rowH = graphType.legend + 22;
  return (
    <g opacity={opacity}>
      {entries.map((e, i) => (
        <g key={e.label} transform={`translate(${x}, ${y + i * rowH})`} opacity={e.opacity ?? 1}>
          <line
            x1={0}
            y1={0}
            x2={54}
            y2={0}
            stroke={e.color}
            strokeWidth={7}
            strokeLinecap="round"
          />
          <text
            x={74}
            y={graphType.legend * 0.36}
            style={{
              ...svgTextOutline(4),
              fill: theme.text,
              fontSize: graphType.legend,
              fontWeight: 700,
            }}
          >
            {e.label}
          </text>
        </g>
      ))}
    </g>
  );
};
