import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { kidTheme, skyColors, skyGradient, type SkyVariant } from "./theme";

// The kids' series backdrop. A sky, and then the smallest amount of motion
// that stops a still frame from looking like a slide: clouds that drift,
// waves that roll, stars that breathe.
//
// Everything is frame-driven and periodic — no state, no random() — so any
// frame can be rendered on its own and a scene can be cut anywhere. All of it
// is cheap DOM/SVG; there are no filters, no blurs and no images, because the
// backdrop is behind three animated characters and must cost nothing.
//
// Deliberately separate from src/lib/components/Backdrop.tsx: that one is the
// dark financial look and the two must never be mixed in one composition.

export type KidBackdropProps = {
  variant?: SkyVariant;
  /** Number of drifting background clouds (0 = none). */
  clouds?: number;
  /** Rolling water at the bottom of the frame; the number is its height in px. */
  waves?: number | boolean;
  /** Twinkling stars — on by default for `night`. */
  stars?: boolean;
  /** Grass hills along the bottom. */
  ground?: boolean;
  /** Rising bubbles + light shafts — on by default for `underwater`. */
  bubbles?: boolean;
  children?: React.ReactNode;
};

export const KidBackdrop: React.FC<KidBackdropProps> = ({
  variant = "day",
  clouds = 3,
  waves = false,
  stars,
  ground = false,
  bubbles,
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const showStars = stars ?? variant === "night";
  const showBubbles = bubbles ?? variant === "underwater";
  const waveHeight = waves === true ? 220 : waves === false ? 0 : (waves ?? 0);
  const [, , low] = skyColors(variant);

  return (
    <AbsoluteFill
      style={{
        background: skyGradient(variant),
        fontFamily: kidTheme.fontFamily,
        color: kidTheme.ink,
        // Pinned for the same reason Backdrop pins it: @remotion/player does
        // not reset inherited typography, so whatever the host page sets would
        // otherwise cascade into the composition. See docs/STYLE.md.
        lineHeight: "normal",
      }}
    >
      {/* Warm haze at the horizon — the cheapest thing that stops a two-stop
          gradient reading as a colour ramp. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 52% at 50% 96%, ${low}cc 0%, transparent 62%)`,
        }}
      />

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0 }}
      >
        {showStars ? <Stars frame={frame} fps={fps} width={width} height={height} /> : null}
        {showBubbles ? (
          <Bubbles frame={frame} fps={fps} width={width} height={height} />
        ) : null}
        {clouds > 0 ? (
          <Clouds frame={frame} count={clouds} width={width} height={height} variant={variant} />
        ) : null}
        {ground ? <Ground width={width} height={height} /> : null}
        {waveHeight > 0 ? (
          <Waves frame={frame} fps={fps} width={width} height={height} band={waveHeight} />
        ) : null}
      </svg>

      {children}
    </AbsoluteFill>
  );
};

// --- clouds ----------------------------------------------------------------

const CLOUD_TINT: Record<SkyVariant, [string, number]> = {
  day: ["#ffffff", 0.58],
  sunset: ["#ffd9c9", 0.7],
  night: ["#33507f", 0.55],
  underwater: ["#9fe9ff", 0.18],
};

const Clouds: React.FC<{
  frame: number;
  count: number;
  width: number;
  height: number;
  variant: SkyVariant;
}> = ({ frame, count, width, height, variant }) => {
  const [tint, alpha] = CLOUD_TINT[variant];
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        // Deterministic per-cloud lane, size and speed.
        const s = 0.55 + 0.5 * Math.abs(Math.sin(i * 5.31));
        const lane = height * (0.1 + 0.34 * Math.abs(Math.sin(i * 2.17)));
        const speed = 0.22 + 0.28 * Math.abs(Math.sin(i * 3.71));
        const span = width + 900;
        const x = ((frame * speed + i * 617) % span) - 450;
        const bob = Math.sin(frame / 60 + i) * 8;
        return (
          <g
            key={i}
            transform={`translate(${x} ${lane + bob}) scale(${s})`}
            opacity={alpha * (0.55 + 0.45 * s)}
          >
            <ellipse cx={0} cy={0} rx={150} ry={62} fill={tint} />
            <circle cx={-62} cy={-22} r={62} fill={tint} />
            <circle cx={18} cy={-46} r={78} fill={tint} />
            <circle cx={92} cy={-16} r={56} fill={tint} />
          </g>
        );
      })}
    </g>
  );
};

// --- stars -----------------------------------------------------------------

const Stars: React.FC<{ frame: number; fps: number; width: number; height: number }> = ({
  frame,
  fps,
  width,
  height,
}) => {
  const t = frame / fps;
  return (
    <g>
      {Array.from({ length: 46 }, (_, i) => {
        const rx = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const ry = Math.abs(Math.sin(i * 78.233) * 12345.6789) % 1;
        const x = rx * width;
        const y = ry * height * 0.68;
        const r = 2 + (i % 4) * 1.4;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (1.1 + (i % 5) * 0.4) + i));
        // Every seventh star is a four-point sparkle rather than a dot.
        if (i % 7 === 3) {
          const a = r * 3.6 * tw;
          return (
            <path
              key={i}
              transform={`translate(${x} ${y})`}
              d={`M 0 ${-a} Q ${a * 0.16} ${-a * 0.16} ${a} 0 Q ${a * 0.16} ${a * 0.16} 0 ${a} Q ${-a * 0.16} ${a * 0.16} ${-a} 0 Q ${-a * 0.16} ${-a * 0.16} 0 ${-a} Z`}
              fill={kidTheme.star}
              opacity={tw}
            />
          );
        }
        return <circle key={i} cx={x} cy={y} r={r} fill={kidTheme.star} opacity={tw} />;
      })}
    </g>
  );
};

// --- water -----------------------------------------------------------------

/** One sine crest across the frame, as a path closed to the bottom edge. */
function wavePath(
  width: number,
  height: number,
  top: number,
  amp: number,
  wavelength: number,
  phase: number,
): string {
  const step = wavelength / 2;
  let d = `M ${-step} ${top + Math.sin(phase) * amp}`;
  for (let x = -step; x < width + step * 2; x += step) {
    const nx = x + step;
    const y0 = top + Math.sin((x / wavelength) * Math.PI * 2 + phase) * amp;
    const y1 = top + Math.sin((nx / wavelength) * Math.PI * 2 + phase) * amp;
    d += ` C ${x + step * 0.4} ${y0} ${x + step * 0.6} ${y1} ${nx} ${y1}`;
  }
  return `${d} L ${width + step * 2} ${height} L ${-step} ${height} Z`;
}

const Waves: React.FC<{
  frame: number;
  fps: number;
  width: number;
  height: number;
  band: number;
}> = ({ frame, fps, width, height, band }) => {
  const t = frame / fps;
  const top = height - band;
  const layers = [
    { dy: 0, amp: 16, wl: 700, speed: 0.55, fill: kidTheme.waterLight, o: 0.85 },
    { dy: 34, amp: 21, wl: 520, speed: -0.8, fill: kidTheme.water, o: 1 },
    { dy: 86, amp: 26, wl: 900, speed: 0.35, fill: kidTheme.waterDark, o: 1 },
  ];
  return (
    <g>
      {layers.map((l, i) => (
        <path
          key={i}
          d={wavePath(width, height, top + l.dy, l.amp, l.wl, t * l.speed)}
          fill={l.fill}
          opacity={l.o}
        />
      ))}
      {/* Foam flecks riding the top crest. */}
      {Array.from({ length: 7 }, (_, i) => {
        const x = ((i * 317 + t * 40) % (width + 200)) - 100;
        const y = top + Math.sin((x / 700) * Math.PI * 2 + t * 0.55) * 16 - 6;
        return <ellipse key={i} cx={x} cy={y} rx={26} ry={5} fill="#ffffff" opacity={0.5} />;
      })}
    </g>
  );
};

// --- underwater ------------------------------------------------------------

const Bubbles: React.FC<{ frame: number; fps: number; width: number; height: number }> = ({
  frame,
  fps,
  width,
  height,
}) => {
  const t = frame / fps;
  return (
    <g>
      {/* Light shafts from the surface. */}
      {[0.18, 0.44, 0.72].map((u, i) => (
        <path
          key={u}
          d={`M ${width * u - 70} 0 L ${width * u + 70} 0 L ${width * u + 190} ${height} L ${width * u + 40} ${height} Z`}
          fill="#ffffff"
          opacity={0.07 + 0.03 * Math.sin(t * 0.5 + i)}
        />
      ))}
      {Array.from({ length: 18 }, (_, i) => {
        const rx = Math.abs(Math.sin(i * 9.71) * 4321.12) % 1;
        const speed = 40 + (i % 5) * 22;
        const y = height - ((t * speed + i * 137) % (height + 160)) + 80;
        const x = rx * width + Math.sin(t * 0.9 + i) * 26;
        const r = 5 + (i % 4) * 5;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="none"
            stroke="#ffffff"
            strokeWidth={3}
            opacity={0.4}
          />
        );
      })}
    </g>
  );
};

// --- ground ----------------------------------------------------------------

const Ground: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <g>
    <path
      d={`M -50 ${height} L -50 ${height - 120} Q ${width * 0.25} ${height - 250} ${width * 0.55} ${height - 140} Q ${width * 0.8} ${height - 60} ${width + 50} ${height - 170} L ${width + 50} ${height} Z`}
      fill={kidTheme.grassDark}
    />
    <path
      d={`M -50 ${height} L -50 ${height - 70} Q ${width * 0.35} ${height - 190} ${width * 0.7} ${height - 90} Q ${width * 0.88} ${height - 40} ${width + 50} ${height - 110} L ${width + 50} ${height} Z`}
      fill={kidTheme.grass}
    />
  </g>
);
