import React from "react";
import { CharacterFrame, Face, useRig, type CharacterProps } from "../Character";
import { kidTheme, mixHex } from "../theme";

// Cloudia — the cloud who runs the place. Her `fill` prop (0..1) is the
// character's whole arc in one number: as she takes on water she darkens from
// white to storm grey, sags, and starts leaking drops from her underside.
//
// The silhouette is five overlapping puffs drawn twice: once filled *and*
// thickly stroked, then again fill-only on top. The second pass covers every
// interior seam, so a union of circles gets a single clean outline without a
// mask, a filter, or a hand-built path.

const W = 520;
const H = 380;

const PUFFS: Array<[number, number, number]> = [
  [-118, 12, 66],
  [-46, -34, 88],
  [46, -20, 76],
  [122, 20, 58],
];
const SLAB = { x: -172, y: 8, w: 344, h: 84, r: 42 };

export type CloudiaProps = CharacterProps & {
  /** 0 = fluffy and white, 1 = grey, heavy and about to rain. */
  fill?: number;
  /** Her bow tie. On by default; she is on duty. */
  bowTie?: boolean;
  /** Manager's clipboard, tucked under one side. */
  clipboard?: boolean;
};

export const Cloudia: React.FC<CloudiaProps> = (props) => {
  const rig = useRig(props);
  const fill = Math.max(0, Math.min(1, props.fill ?? 0));

  // Colour, sag and drip all key off the same number.
  const top = mixHex(kidTheme.cloud, kidTheme.cloudGrey, fill * 0.85);
  const bottom = mixHex(kidTheme.cloudShade, kidTheme.cloudStorm, fill);
  // A white cloud on a pale-blue sky has no silhouette at all without this;
  // the first pass used #b9cadb and she dissolved into the backdrop.
  const edge = mixHex("#7d93aa", "#33414f", fill);
  const sag = fill * 16;
  // The gradient id has to vary with `fill`, because SVG ids are global to the
  // document: two Cloudias at different fills sharing one id would both render
  // with whichever definition happened to be first.
  const gid = `cloudia-body-${Math.round(fill * 100)}`;

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox="-260 -190 520 380"
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      <defs>
        {/* Vertical-only, in user space: that's the one gradient shape whose
            colour at eye height can be reproduced as the flat `skin` the
            eyelids paint with (see the `skin` note in Character.tsx). */}
        <linearGradient
          id={gid}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={-124}
          x2={0}
          y2={SLAB.y + SLAB.h}
        >
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
      </defs>

      {props.clipboard ? <Clipboard /> : null}

      <g transform={`translate(0 ${sag}) scale(1 ${1 + fill * 0.06})`}>
        {/* Pass 1: filled + thickly stroked, so the union gets an outline. */}
        <g fill={`url(#${gid})`} stroke={edge} strokeWidth={14}>
          <Puffs />
        </g>
        {/* Pass 2: fill only, covering every interior seam from pass 1. */}
        <g fill={`url(#${gid})`}>
          <Puffs />
        </g>

        {/* A lighter crown so the top reads as lit even at full grey. */}
        <ellipse cx={-52} cy={-84} rx={62} ry={26} fill="#ffffff" opacity={0.35 - fill * 0.28} />

        <Face
          rig={rig}
          x={0}
          y={-10}
          size={1.34}
          // The body ramp runs y=-124..92; the eyes sit at y≈-21, i.e. 48%
          // down it. Sampling it here is what lets the lids disappear.
          skin={mixHex(top, bottom, 0.48)}
          eyeSpread={1.02}
          eyeScale={0.94}
        />

        {(props.bowTie ?? true) ? <BowTie y={98} rig={rig} /> : null}
      </g>

      {fill > 0.55 ? <Drips rig={rig} fill={fill} /> : null}
    </CharacterFrame>
  );
};

const Puffs: React.FC = () => (
  <>
    <rect x={SLAB.x} y={SLAB.y} width={SLAB.w} height={SLAB.h} rx={SLAB.r} />
    {PUFFS.map(([cx, cy, r]) => (
      <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={r} />
    ))}
  </>
);

/**
 * Follow-through, worn as an accessory: the bow tie hangs off a body that is
 * breathing, so it bobs *after* she does (the lagged breath, `rig.trail`) and
 * counter-rotates a degree or two as it catches up. She settles, then it does.
 */
const BowTie: React.FC<{ y: number; rig: ReturnType<typeof useRig> }> = ({ y, rig }) => {
  const bob = rig.trail.dy * 2.2;
  const tip = (rig.trail.dy - rig.squash.dy) * 2.4;
  return (
    <g transform={`translate(0 ${y + bob}) rotate(${tip})`}>
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={`M ${s * 9} 0 L ${s * 52} -22 Q ${s * 60} 0 ${s * 52} 22 Z`}
          fill={kidTheme.pink}
          stroke={kidTheme.pinkDeep}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      ))}
      <circle cx={0} cy={0} r={13} fill={kidTheme.pinkDeep} />
    </g>
  );
};

/** Drops gathering on her underside once she's carrying too much water. */
const Drips: React.FC<{ rig: ReturnType<typeof useRig>; fill: number }> = ({
  rig,
  fill,
}) => {
  const t = rig.frame / rig.fps;
  const strength = (fill - 0.55) / 0.45;
  return (
    <g opacity={Math.min(1, strength)}>
      {/* Kept off the centre line — that's where the bow tie hangs. */}
      {[-146, -84, 84, 146].map((x, i) => {
        const cycle = (t * 0.55 + i * 0.27) % 1;
        const y = 96 + cycle * 78;
        return (
          <path
            key={x}
            transform={`translate(${x} ${y}) scale(${0.5 + cycle * 0.35})`}
            d="M 0 -26 C 6 -14 17 -6 17 6 A 17 17 0 0 1 -17 6 C -17 -6 -6 -14 0 -26 Z"
            fill={kidTheme.water}
            stroke={kidTheme.waterDeep}
            strokeWidth={4}
            opacity={1 - cycle * 0.5}
          />
        );
      })}
    </g>
  );
};

/** The manager's clipboard, half-tucked behind her so it reads as "held". */
const Clipboard: React.FC = () => (
  <g transform="translate(178 66) rotate(11)">
    <rect x={-42} y={-56} width={84} height={112} rx={10} fill="#e9d2a6" stroke="#a8783f" strokeWidth={6} />
    <rect x={-26} y={-68} width={52} height={22} rx={8} fill="#b9c3ce" stroke="#75828f" strokeWidth={5} />
    {[-26, -4, 18].map((y) => (
      <path
        key={y}
        d={`M -26 ${y} L 26 ${y}`}
        stroke="#a8783f"
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.55}
      />
    ))}
  </g>
);
