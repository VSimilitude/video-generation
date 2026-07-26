import React from "react";
import { CharacterFrame, Face, useRig, type CharacterProps } from "../Character";
import { kidTheme } from "../theme";

// Sunny — the sun. Big, warm, and completely convinced he is the main
// character, which is why his default expression is `proud` and his brows are
// deliberately asymmetric (`smug`).
//
// The rays rotate about one turn per minute: fast enough to register as alive
// over a 6-second beat, slow enough that nobody watches them instead of the
// dialogue. Alternating long/short rays keep the silhouette from reading as a
// gear.

const W = 460;
const H = 460;
const BODY_R = 124;
// 12 chunky rays, not 14 thin ones: at 14 the silhouette read as a gear.
const RAYS = 12;

export type SunnyProps = CharacterProps & {
  /**
   * Sunglasses position. `undefined` = no glasses at all, 0 = worn over the
   * eyes, 1 = lowered down the face so he can look at you over the top.
   */
  shades?: number;
  /** Lopsided brow + grin. On by default — it's most of who he is. */
  smug?: boolean;
  /** Ray rotation speed in degrees per frame. */
  raySpeed?: number;
};

export const Sunny: React.FC<SunnyProps> = (props) => {
  const base = useRig({ emotion: "proud", ...props });
  const smug = props.smug ?? true;
  const rig = smug
    ? { ...base, emo: { ...base.emo, browAsym: -14, mouthTilt: 5 } }
    : base;

  const spin = rig.frame * (props.raySpeed ?? 0.16) + rig.phase * 9;
  const shades = props.shades;

  // Secondary action: the rays breathe with him — and, being the outermost
  // thing on the character, they arrive last (`trail`, not `squash`). Long and
  // short rays get opposite signs, so the silhouette flickers rather than
  // pulsing as one disc.
  const flare = rig.trail.dy * 2.6;

  // Face geometry has to be repeated by the sunglasses, so it lives here once.
  const faceY = 10;
  const faceSize = 1.62;

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox="-230 -230 460 460"
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      {/* Rays, behind the disc so their bases are hidden under it. */}
      <g transform={`rotate(${spin})`}>
        {Array.from({ length: RAYS }, (_, i) => {
          const long = i % 2 === 0;
          const len = (long ? 78 : 50) + (long ? flare : -flare * 0.7);
          const half = long ? 26 : 21;
          return (
            <path
              key={i}
              transform={`rotate(${(360 / RAYS) * i}) translate(0 ${-BODY_R + 10})`}
              d={`M ${-half} 0 L 0 ${-len} L ${half} 0 Z`}
              fill={kidTheme.sunDark}
              stroke={kidTheme.sunDark}
              strokeWidth={22}
              strokeLinejoin="round"
            />
          );
        })}
      </g>

      {/* Flat body (see the `skin` note in Character.tsx) with the lit crown
          drawn as its own shape, kept above the brows. */}
      <circle
        cx={0}
        cy={0}
        r={BODY_R}
        fill={kidTheme.sun}
        stroke={kidTheme.sunDeep}
        strokeWidth={7}
      />
      <ellipse cx={-6} cy={-90} rx={80} ry={20} fill={kidTheme.sunLight} opacity={0.6} />

      <Face
        rig={rig}
        x={0}
        y={faceY}
        size={faceSize}
        skin={kidTheme.sun}
        eyeSpread={1.04}
        eyeScale={0.92}
        blushColor="#ff8f6a"
      />

      {shades === undefined ? null : (
        <Shades drop={shades} y={faceY} size={faceSize} />
      )}
    </CharacterFrame>
  );
};

/**
 * Sunglasses. Positioned from the same face constants the eyes use, so
 * "covering the eyes" is true by construction at drop=0 and they clear the
 * eyes entirely by drop=1.
 */
const Shades: React.FC<{ drop: number; y: number; size: number }> = ({
  drop,
  y,
  size,
}) => {
  // Face-unit geometry (see FACE in Character.tsx): eyes sit at x=±23·spread,
  // y=-8 with rx≈16. Lens centres are pushed out to ±27 so the two lenses
  // clear each other and leave room for a bridge — at ±23 they overlapped in
  // the middle and read as a blindfold.
  const cx = 25;
  // Lowered glasses have to fit in the ~22 units between the eyes and the
  // mouth, so they foreshorten as they slide down instead of just translating.
  const ey = -8 + drop * 28;
  const lensW = 44 - drop * 4;
  const lensH = 38 - drop * 16;
  const outer = cx + lensW / 2;
  return (
    <g transform={`translate(0 ${y}) scale(${size})`}>
      {/* Temple arms. Short, angled *up* away from the face (drawn level they
          ran across the disc and read as a blindfold), and retracting as the
          glasses come down — at full drop they're tilted towards the viewer,
          long temples there read as whiskers. */}
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={
            `M ${s * (outer - 6)} ${ey - 8}` +
            ` L ${s * (outer + 12 * (1 - drop * 0.85))} ${ey - 8 - 9 * (1 - drop * 0.85)}`
          }
          stroke={kidTheme.ink}
          strokeWidth={8}
          strokeLinecap="round"
        />
      ))}
      <rect x={-7} y={ey - 8} width={14} height={8} rx={4} fill={kidTheme.ink} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect
            x={s * cx - lensW / 2}
            y={ey - lensH / 2}
            width={lensW}
            height={lensH}
            rx={Math.min(15, lensH / 2)}
            fill="#1d2b40"
            stroke={kidTheme.ink}
            strokeWidth={5}
          />
          <path
            d={
              `M ${s * cx - lensW / 2 + 9} ${ey + lensH / 2 - 7}` +
              ` L ${s * cx + 1} ${ey - lensH / 2 + 6}` +
              ` L ${s * cx + 11} ${ey - lensH / 2 + 6}` +
              ` L ${s * cx - lensW / 2 + 19} ${ey + lensH / 2 - 7} Z`
            }
            fill="#ffffff"
            opacity={0.3}
          />
        </g>
      ))}
    </g>
  );
};
