import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme, svgTextOutline } from "../../theme";

// A plotted graph that *draws itself*: axes first, then the curves, then the
// markers that read values off them. Built for the financial series, where the
// motion has to carry the explanation (docs/STYLE.md, "Animation must mean
// something") rather than decorate a static chart.
//
// The frame is deliberately video-agnostic: it knows about domains, ticks,
// units and draw-on timing, and nothing about bonds. Children position
// themselves in *data* coordinates via `useGraph()`.
//
// Sizing follows docs/STYLE.md legibility floors: nothing here renders text
// below 34px, and axis titles are larger than tick labels.

export type AxisSpec = {
  /** [min, max] in data units. Values outside are clipped, not rescaled. */
  domain: [number, number];
  /** Tick positions in data units. Keep these few — gridlines are not drawn. */
  ticks: number[];
  /** Axis title, including units, e.g. "Price (per $1,000 face)". */
  label: string;
  /** Formats tick labels and any readout that doesn't override it. */
  format: (v: number) => string;
};

/** Frame window for a draw-on animation: progress runs 0→1 over `frames`. */
export type DrawSpec = { at: number; frames: number };

/**
 * Pass as `draw` to mount an element already fully drawn. Used when a graph
 * persists across a cut (bond-basics scenes 8→9→10): the axes and curve must
 * not re-draw, or the cut reads as a new chart instead of the same one.
 */
export const ALREADY_DRAWN: DrawSpec = { at: -100000, frames: 1 };

export const graphType = {
  tick: 34,
  axisLabel: 40,
  readout: 42,
  legend: 36,
  chip: 38,
} as const;

export type GraphMargin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/**
 * Default margins, sized from the type scale above:
 *  - left   rotated y title (44) + right-aligned tick labels (~140) + gap
 *  - bottom tick labels (34 + gap) + axis title (40) + gap
 * A readout chip on an axis deliberately overlays the tick labels in its
 * margin — it is the live value replacing the static scale.
 */
export const GRAPH_MARGIN: GraphMargin = {
  top: 40,
  right: 110,
  bottom: 160,
  left: 290,
};

// Baseline of the x-axis title, measured down from the plot's bottom edge:
// 12 (tick mark) + 34 (tick label) + 52 (gap) + 32 (cap height) = 130. The gap
// is what it is because an x-axis readout chip overlays the tick labels and
// reaches plot + 82; the title's glyph tops sit at plot + 98, so the two clear
// each other by ~16px. Bottom margin (160) covers the title's descenders.
export const X_TITLE_BASELINE = 12 + graphType.tick + 52 + graphType.axisLabel * 0.8;

type GraphContextValue = {
  /** Data x → px within the plot area. */
  sx: (v: number) => number;
  /** Data y → px within the plot area (0 = top). */
  sy: (v: number) => number;
  plotW: number;
  plotH: number;
  x: AxisSpec;
  y: AxisSpec;
  /** clip-path url() that keeps a curve inside the plot area. */
  clip: string;
};

const GraphContext = React.createContext<GraphContextValue | null>(null);

export function useGraph(): GraphContextValue {
  const ctx = React.useContext(GraphContext);
  if (!ctx) {
    throw new Error("Graph children must be rendered inside <AnimatedGraph>.");
  }
  return ctx;
}

/** 0→1 progress for a draw window, clamped at both ends. */
export function drawProgress(frame: number, draw: DrawSpec): number {
  return interpolate(frame, [draw.at, draw.at + Math.max(1, draw.frames)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export const AnimatedGraph: React.FC<{
  /** Overall SVG box, including margins. */
  width: number;
  height: number;
  x: AxisSpec;
  y: AxisSpec;
  /** When the axes draw on. Pass ALREADY_DRAWN to persist across a cut. */
  draw?: DrawSpec;
  margin?: Partial<GraphMargin>;
  children?: React.ReactNode;
}> = ({ width, height, x, y, draw = { at: 0, frames: 20 }, margin, children }) => {
  const frame = useCurrentFrame();
  const m = { ...GRAPH_MARGIN, ...margin };
  const plotW = width - m.left - m.right;
  const plotH = height - m.top - m.bottom;
  const clipId = React.useId().replace(/:/g, "");

  const sx = (v: number) =>
    ((v - x.domain[0]) / (x.domain[1] - x.domain[0])) * plotW;
  const sy = (v: number) =>
    plotH - ((v - y.domain[0]) / (y.domain[1] - y.domain[0])) * plotH;

  const p = drawProgress(frame, draw);
  // Ticks and titles land once the axis lines have mostly arrived, staggered so
  // the scale reads as being laid down rather than stamped.
  const tickAt = draw.at + draw.frames * 0.55;
  const fadeIn = (delay: number) =>
    interpolate(frame, [delay, delay + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const axisColor = theme.textMuted;
  const ctx: GraphContextValue = {
    sx,
    sy,
    plotW,
    plotH,
    x,
    y,
    clip: `url(#${clipId})`,
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <clipPath id={clipId}>
          {/* A little headroom so a marker dot at the top isn't sliced. */}
          <rect x={-4} y={-14} width={plotW + 8} height={plotH + 18} />
        </clipPath>
      </defs>
      <g transform={`translate(${m.left}, ${m.top})`}>
        {/* Axis lines: both grow from the origin corner. */}
        <line
          x1={0}
          y1={plotH}
          x2={0}
          y2={plotH - plotH * p}
          stroke={axisColor}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.9}
        />
        <line
          x1={0}
          y1={plotH}
          x2={plotW * p}
          y2={plotH}
          stroke={axisColor}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.9}
        />

        {/* X ticks + labels */}
        {x.ticks.map((t, i) => {
          const o = fadeIn(tickAt + i * 2);
          return (
            <g key={`xt-${t}`} opacity={o} transform={`translate(${sx(t)}, ${plotH})`}>
              <line y1={0} y2={12} stroke={axisColor} strokeWidth={3} opacity={0.9} />
              <text
                y={12 + graphType.tick}
                textAnchor="middle"
                style={{
                  ...svgTextOutline(4),
                  fill: theme.textMuted,
                  fontSize: graphType.tick,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums lining-nums",
                }}
              >
                {x.format(t)}
              </text>
            </g>
          );
        })}

        {/* Y ticks + labels */}
        {y.ticks.map((t, i) => {
          const o = fadeIn(tickAt + i * 2);
          return (
            <g key={`yt-${t}`} opacity={o} transform={`translate(0, ${sy(t)})`}>
              <line x1={-12} x2={0} stroke={axisColor} strokeWidth={3} opacity={0.9} />
              <text
                x={-24}
                y={graphType.tick * 0.36}
                textAnchor="end"
                style={{
                  ...svgTextOutline(4),
                  fill: theme.textMuted,
                  fontSize: graphType.tick,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums lining-nums",
                }}
              >
                {y.format(t)}
              </text>
            </g>
          );
        })}

        {/* Axis titles */}
        <text
          x={plotW / 2}
          y={plotH + X_TITLE_BASELINE}
          textAnchor="middle"
          opacity={fadeIn(tickAt + 6)}
          style={{
            ...svgTextOutline(5),
            fill: theme.text,
            fontSize: graphType.axisLabel,
            fontWeight: 800,
          }}
        >
          {x.label}
        </text>
        <text
          transform={`translate(${-m.left + graphType.axisLabel * 0.9}, ${plotH / 2}) rotate(-90)`}
          // x = -254 with the default margin; the widest y readout chip reaches
          // x = -216, so the two clear each other by ~20px.
          textAnchor="middle"
          opacity={fadeIn(tickAt + 6)}
          style={{
            ...svgTextOutline(5),
            fill: theme.text,
            fontSize: graphType.axisLabel,
            fontWeight: 800,
          }}
        >
          {y.label}
        </text>

        <GraphContext.Provider value={ctx}>{children}</GraphContext.Provider>
      </g>
    </svg>
  );
};
