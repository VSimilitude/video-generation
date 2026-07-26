import React from "react";
import { CharacterFrame, Face, useRig, type CharacterProps } from "../Character";
import { kidTheme } from "../theme";

// Drip — the hero. A water droplet: pointed on top, heavy and round at the
// bottom, with the big eyes and small body of a character who is going to be
// braver than his size suggests.
//
// The silhouette does the characterisation: the teardrop tip reads as a
// cowlick, the low centre of gravity reads as small-and-round, and the arms
// are stubby enough that "hands on hips" is a whole pose rather than a detail.

const W = 360;
const H = 380;

// Ball centre and radius inside the local viewBox. The body is deliberately
// *wide* for its height: the first pass drew a tall narrow teardrop and it read
// as an icon, because there was nowhere for a big face to sit.
const BALL_Y = 46;
const BALL_R = 106;
const TIP_Y = -140;

export type DripProps = CharacterProps & {
  arms?: boolean;
  feet?: boolean;
  /** Ground contact shadow. Turn it off when he's floating or in water. */
  shadow?: boolean;
  /** Override the arm pose; by default it follows the emotion. */
  pose?: "rest" | "hips" | "cheer" | "clutch";
};

export const Drip: React.FC<DripProps> = (props) => {
  const rig = useRig(props);
  const { arms = true, feet = true, shadow = true } = props;
  const emotion = props.emotion ?? "neutral";
  // `proud` deliberately does NOT map to `hips`. Arms behind the body only
  // show the part outside the silhouette, and at 2× that turned a hands-on-hips
  // elbow into a flat fin however the control points were placed. `hips` stays
  // available as an explicit `pose`, but it needs a real shape (a drawn arm,
  // not a stroked path) before it's worth defaulting to — his confidence is
  // carried by the half-lidded eyes and head tilt instead.
  const pose =
    props.pose ??
    (emotion === "excited"
      ? "cheer"
      : emotion === "scared"
        ? "clutch"
        : "rest");

  // Arms swing with the breath, but a few frames *behind* it: a limb that
  // moves on the same frame as the body it hangs off reads as one rigid shape.
  const swing = rig.trail.dy * 0.35;
  // Secondary action: the highlights sit on the surface of a moving body of
  // water, so they slide a couple of pixels as he breathes instead of being
  // painted on. Driven from the lagged breath, so they arrive after the body.
  const shineX = rig.trail.dy * 1.8;
  const shineY = rig.trail.dy * 2.6;

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox="-180 -190 360 380"
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      {/* Ground contact shadow — cheap, but it stops the character floating. */}
      {shadow ? (
        <ellipse
          cx={0}
          cy={BALL_R + BALL_Y + 30}
          rx={96}
          ry={17}
          fill={kidTheme.ink}
          opacity={0.14}
        />
      ) : null}

      {feet ? <Feet /> : null}
      {/* Arms sit behind the body so shoulders and hands never need a join.
          The consequence is that only the part outside the silhouette is
          visible, which is why `hips` is a two-segment elbow rather than a
          curve: a quadratic with both ends inside the body drew a ring around
          him, and drawing it in front instead put a fat sleeve across the
          cheeks. */}
      {arms ? <Arms pose={pose} swing={swing} /> : null}

      {/* Body: tip at the top, ball at the bottom. */}
      <path
        d={
          `M 0 ${TIP_Y} C 34 -84 ${BALL_R} -34 ${BALL_R} ${BALL_Y}` +
          ` A ${BALL_R} ${BALL_R} 0 0 1 ${-BALL_R} ${BALL_Y}` +
          ` C ${-BALL_R} -34 -34 -84 0 ${TIP_Y} Z`
        }
        fill={kidTheme.water}
        stroke={kidTheme.waterDeep}
        strokeWidth={8}
        strokeLinejoin="round"
      />

      {/* Shine and reflection: both kept clear of the face, and both flat
          shapes rather than a gradient — see the `skin` note in Character.tsx
          for why a gradient body can't have matching eyelids. */}
      <g transform={`translate(${shineX} ${shineY})`}>
        <ellipse
          cx={-24}
          cy={-72}
          rx={15}
          ry={30}
          fill="#ffffff"
          opacity={0.5}
          transform="rotate(-16 -24 -72)"
        />
        <circle cx={-62 - shineX * 0.6} cy={-8} r={13} fill="#ffffff" opacity={0.6} />
      </g>
      <ellipse
        cx={4}
        cy={124}
        rx={62 + shineY * 1.6}
        ry={17}
        fill={kidTheme.waterLight}
        opacity={0.34}
      />

      <Face
        rig={rig}
        x={2}
        y={BALL_Y - 26}
        size={1.5}
        eyeScale={1.06}
        skin={kidTheme.water}
        // Warm pink at low alpha over blue skin goes grey; this one is
        // saturated enough to stay a cheek.
        blushColor="#ff7f8e"
        blushStrength={3}
      />
    </CharacterFrame>
  );
};

const Feet: React.FC = () => (
  <g>
    {[-1, 1].map((s) => (
      <ellipse
        key={s}
        cx={s * 50}
        cy={BALL_Y + BALL_R + 2}
        rx={40}
        ry={20}
        fill={kidTheme.waterDark}
        stroke={kidTheme.waterDeep}
        strokeWidth={7}
      />
    ))}
  </g>
);

// Arm poses. Each path starts at the shoulder (inside the body, so the join is
// hidden) and ends at the hand. Kept short and thick: the first pass reached
// 120 units out at 18 wide and the arms read as antennae.
const ARM_PATHS: Record<string, string> = {
  rest: "M -76 30 Q -150 56 -146 100",
  // Two straight segments with a round join: what shows outside the body is a
  // pointed elbow, which is what "hands on hips" looks like from the front.
  hips: "M -78 2 L -128 62 L -84 80",
  cheer: "M -76 14 Q -164 -24 -142 -72",
  clutch: "M -80 34 Q -140 4 -104 -32",
};

const HAND_AT: Record<string, [number, number]> = {
  rest: [-146, 100],
  hips: [-84, 80],
  cheer: [-142, -72],
  clutch: [-104, -32],
};

const Arms: React.FC<{ pose: string; swing: number }> = ({ pose, swing }) => {
  const d = ARM_PATHS[pose] ?? ARM_PATHS.rest;
  const [hx, hy] = HAND_AT[pose] ?? HAND_AT.rest;
  return (
    <g transform={`translate(0 ${swing})`}>
      {[-1, 1].map((s) => (
        <g key={s} transform={s === 1 ? "scale(-1 1)" : undefined}>
          <path
            d={d}
            stroke={kidTheme.waterDeep}
            strokeWidth={40}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d={d}
            stroke={kidTheme.waterDark}
            strokeWidth={28}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle
            cx={hx}
            cy={hy}
            r={22}
            fill={kidTheme.waterDark}
            stroke={kidTheme.waterDeep}
            strokeWidth={7}
          />
        </g>
      ))}
    </g>
  );
};
