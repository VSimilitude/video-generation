import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { kidTheme } from "../../../lib/kid";

// FLASH — the lightning, she/her, the series' fourth silent constant.
//
// ---------------------------------------------------------------------------
// HER WHOLE VOCABULARY (script.md cast table + the physics-honesty ledger)
//
//   CAN     be on screen for at most FLASH_FRAMES (6) frames per appearance —
//           the component renders `null` outside [at, at + 6), so an act
//           cannot hold her longer by accident;
//           go from the cloud DOWN TO THE SEA far out (`to` on the water), or
//           ACROSS THE SKY sideways (`to` in the sky — Scene 15's second bolt
//           and Scene 16's overhead one, which goes SIDEWAYS on purpose);
//           white the sky with her (`FlashSky`, same six frames, same curve);
//           be the SAME BODY every time: one fixed zig (ZIG below), one pair
//           of tiny eyes at its first kink, the same blue-white — a
//           six-year-old has to register that a CHARACTER went past, not a
//           glitch (Violet's same-blob law);
//   CANNOT  speak (no voice, ever — Boom addresses her six times and she
//           replies zero times; the zero is the physics);
//           strike anything: no tree, house, rod, creature or person. `to`
//           is the sea or the sky. There is no "hit" prop and there must
//           never be one;
//           linger, fade slowly, or come back in the same appearance;
//           change shape: the zig is scaled and rotated between `from` and
//           `to`, never re-drawn.

/** The hard ceiling on one appearance, in frames. */
export const FLASH_FRAMES = 6;

/**
 * Her silhouette, in bolt units: `t` along the bolt (0 = the cloud, 1 = the
 * end), `n` across it as a fraction of the bolt's length. Fixed — this IS her.
 */
const ZIG: Array<[number, number]> = [
  [0, 0],
  [0.14, 0.085],
  [0.27, -0.045],
  [0.43, 0.1],
  [0.58, -0.035],
  [0.76, 0.085],
  [0.9, -0.02],
  [1, 0.01],
];

/** Brightness on each of her six frames: a strike, a flicker, a re-strike, out. */
const CURVE = [1, 0.82, 0.32, 0.92, 0.42, 0.12] as const;

/** Her brightness on `frame` for an appearance at `at`, 0 outside her six frames. */
export function flashLevel(frame: number, at: number): number {
  const i = frame - at;
  return i >= 0 && i < FLASH_FRAMES ? CURVE[i] : 0;
}

/** True during her six frames. */
export function flashOn(frame: number, at: number): boolean {
  return frame >= at && frame < at + FLASH_FRAMES;
}

export const FLASH_COLOR = {
  core: "#ffffff",
  /** Saturated on purpose: she flies across a sky that is whiting with her. */
  edge: "#5aa6ff",
  rim: "#2b63c9",
  glow: "#8fc8ff",
} as const;

export const Flash: React.FC<{
  /** The first of her six frames (scene-local). */
  at: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** Stroke scale; 1 is a far bolt across a wide. */
  weight?: number;
  /** Mirror the zig across its own axis (same body, the other way round). */
  mirror?: boolean;
}> = ({ at, from, to, weight = 1, mirror = false }) => {
  const frame = useCurrentFrame();
  const level = flashLevel(frame, at);
  if (level <= 0) return null;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // Normal, always on the same side of the direction of travel unless mirrored.
  const nx = -uy * (mirror ? -1 : 1);
  const ny = ux * (mirror ? -1 : 1);
  const pts = ZIG.map(([t, n]) => ({
    x: from.x + dx * t + nx * n * len,
    y: from.y + dy * t + ny * n * len,
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  // The eyes: at the first kink, set off the bolt on the normal side.
  const k = pts[1];
  const eyeR = Math.max(9, Math.min(15, len * 0.022)) * weight;
  const ex = k.x + nx * eyeR * 1.6;
  const ey = k.y + ny * eyeR * 1.6;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
    >
      <g opacity={level} strokeLinejoin="round" strokeLinecap="round" fill="none">
        <path d={d} stroke={FLASH_COLOR.glow} strokeWidth={50 * weight} opacity={0.4} />
        <path d={d} stroke={FLASH_COLOR.rim} strokeWidth={28 * weight} />
        <path d={d} stroke={FLASH_COLOR.edge} strokeWidth={21 * weight} />
        <path d={d} stroke={FLASH_COLOR.core} strokeWidth={9 * weight} />
      </g>
      {/* Two tiny eyes — she is somebody. Same place on her every time. */}
      <g opacity={Math.min(1, level * 1.2)}>
        {[-1, 1].map((s) => (
          <g key={s}>
            <circle
              cx={ex + ux * s * eyeR * 1.15}
              cy={ey + uy * s * eyeR * 1.15}
              r={eyeR}
              fill={FLASH_COLOR.core}
              stroke={kidTheme.ink}
              strokeWidth={Math.max(2, eyeR * 0.22)}
            />
            <circle
              cx={ex + ux * (s * eyeR * 1.15 + eyeR * 0.3)}
              cy={ey + uy * (s * eyeR * 1.15 + eyeR * 0.3)}
              r={eyeR * 0.5}
              fill={kidTheme.ink}
            />
          </g>
        ))}
      </g>
    </svg>
  );
};

/**
 * **The sky whites with her.** A full-frame wash on her six frames, on her
 * curve. Put it in the OUTSIDE layer of a framing (behind a window frame,
 * under the cast) so the white is the sky's, not the lens's; `room` is the
 * small spill a lit interior gets on the same frames (`roomFlash`).
 */
export const FlashSky: React.FC<{ at: number; strength?: number; color?: string }> = ({
  at,
  strength = 1,
  color = "236,246,255",
}) => {
  const frame = useCurrentFrame();
  const level = flashLevel(frame, at) * strength;
  if (level <= 0) return null;
  return (
    <AbsoluteFill
      style={{ background: `rgba(${color},${(0.55 * level).toFixed(3)})`, pointerEvents: "none" }}
    />
  );
};

/** How much a room lights up on her frames (for an interior lit by the glass). */
export function roomFlash(frame: number, at: number): number {
  return 0.35 * flashLevel(frame, at);
}
