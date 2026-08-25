import React from "react";
import {
  CharacterFrame,
  Face,
  kidTheme,
  mixHex,
  useRig,
  type CharacterProps,
} from "../../../lib/kid";

// EMBER — the hero of episode five, and the first brand-new body since Pip.
//
// A drop of lava. One minute old at her first line, she/her, and the fastest
// thing the series has ever cast. Everything below is in service of one note
// from the script's casting table: *small, bright, quick, GLEEFUL — indignation
// played inside delight, never whiny.*
//
// ---------------------------------------------------------------------------
// THE DESIGN, AND THE THREE THINGS IT HAD TO DODGE
//
//   NOT DRIP.    A teardrop — pointed on top, heavy at the bottom — is taken,
//                and it is taken by the other liquid in the show. Ember is a
//                *blob*: round all the way over, with a soft three-lobed
//                molten crown instead of a tip. Flattened to a solid shape she
//                is a circle with a wobbly hat; flattened, Drip is a comma.
//                They do not share a silhouette at any distance.
//   NOT SUNNY.   `kidTheme.sun` is #ffc93c and it belongs to a character who
//                is on screen in eleven of this episode's thirty-one scenes.
//                Ember's body is a deeper, redder orange (#ff7a2a) with her
//                highlight at #ffc247 — one step warmer and two steps darker
//                than his disc — and she is never a disc: no rays, ever.
//   NOT POLAR.   STYLE's silhouette test kills anything with a front. The
//                first pass gave her three tapering flame licks off the crown
//                and it was a candle at squint distance — one tapering thing
//                off a round body is the tadpole failure by another name. The
//                crown is now part of the body outline (three lobes, none of
//                them dominant, none of them pointed) and the only detached
//                pieces are two small heat wisps well clear of her, which is
//                the comics device rather than anatomy.
//
// ---------------------------------------------------------------------------
// SHE HAS NO ARMS, AND THAT IS THE RIG
//
// Pip has no arms because she is rooted; Ember has none because she is molten,
// and because the alternative is two orange bars that read as fins at the size
// she is usually staged. Her gesture vocabulary is **motion** — which is also
// her characterisation, so the constraint pays for itself:
//
//   `lean`     signed degrees. She tips into wherever she is going and into
//              whatever she has opinions about. This is her pointing finger.
//   `squish`   −1..1. Negative squashes her wide (landing, stalling, being
//              told a number); positive stretches her tall (launching, wanting).
//              It rides on top of the rig's own breath rather than replacing it.
//   `wisps`    0..1. Heat coming off her. Turn it down when she has cooled.
//   `crust`    0..1. **The spine gag's body.** Her dark skin, growing from the
//              edge inward, drawn as a stroke ON the body outline so the rind
//              is genuinely on her *outside* — which is the physics the script
//              says out loud twice ("The outside cools first").
//
// An act that needs her to hold, carry, point at or touch something has to
// solve it with `lean` and staging. Flagged for the act agents: this is the
// one thing the rig cannot do.

/** Natural SVG box, for `CHAR_BOX` and therefore for every ground line. */
export const EMBER_BOX = 320;
const W = 340;
const H = EMBER_BOX;

/** Body centre and radius inside the local viewBox. */
const BALL_Y = 10;
const BALL_R = 102;

/**
 * **Her palette.** Flat fills only — the eyelids are painted over the eyes in
 * body colour, so a gradient body cannot have matching lids (Character.tsx).
 * Depth is separate flat highlight shapes, kept clear of the face, plus the
 * outline and one soft halo *behind* her.
 */
export const EMBER_COLOR = {
  body: "#ff7a2a",
  /** The flat highlight on her shoulder, and the crown's inner glow. */
  hot: "#ffc247",
  /** Outline. Warm rather than ink: an ink ring round a glowing body kills it. */
  edge: "#a33208",
  /** The crust. Not black — a cooled basalt grey-brown. */
  crust: "#4a3b3a",
  /** The halo she casts. */
  glow: "#ff9d3c",
} as const;

/**
 * The three-lobed crown, as a function.
 *
 * `k` is 0..1 through one wobble cycle. The lobes are deliberately UNEQUAL in
 * height and EQUAL in weight — a dominant middle lobe is a flame, and a flame
 * on a round body is the polar silhouette this design exists to avoid.
 */
function crownPath(k: number): string {
  const r = BALL_R;
  const y = BALL_Y;
  const w = (a: number, b: number): number => Math.sin(k * Math.PI * 2 + a) * b;
  // Three shallow bumps across the top of the circle, riding a slow wobble.
  return (
    `M ${-r} ${y}` +
    ` C ${-r} ${y - r * 0.62} ${-r * 0.86} ${y - r * 0.96 + w(0, 5)} ${-r * 0.5} ${y - r * 1.02 + w(0, 7)}` +
    ` Q ${-r * 0.34} ${y - r * 1.22 + w(1.1, 8)} ${-r * 0.16} ${y - r * 1.03 + w(2.2, 6)}` +
    ` Q 0 ${y - r * 1.28 + w(2.4, 9)} ${r * 0.18} ${y - r * 1.02 + w(3.5, 6)}` +
    ` Q ${r * 0.36} ${y - r * 1.18 + w(4.6, 8)} ${r * 0.54} ${y - r * 0.99 + w(5.1, 7)}` +
    ` C ${r * 0.88} ${y - r * 0.9} ${r} ${y - r * 0.6} ${r} ${y}` +
    // The bottom: a touch wider and flatter than a circle. She is a drop that
    // has landed on something, not a ball hanging in the air.
    ` Q ${r * 0.96} ${y + r * 0.86} 0 ${y + r * 0.9}` +
    ` Q ${-r * 0.96} ${y + r * 0.86} ${-r} ${y} Z`
  );
}

export type EmberProps = CharacterProps & {
  /** Signed degrees of tip. Her pointing finger — see the header. */
  lean?: number;
  /** −1 squashed wide .. 1 stretched tall, on top of the rig's own breath. */
  squish?: number;
  /** Heat coming off her, 0..1. Default 1. */
  wisps?: number;
  /** The dark skin, 0..1. The spine gag's body. */
  crust?: number;
  /** The halo she casts on her surroundings, 0..1. Default 1. */
  glow?: number;
  /** Ground contact shadow. Off when she is airborne. */
  shadow?: boolean;
};

export const Ember: React.FC<EmberProps> = (props) => {
  const rig = useRig({ emotion: "excited", ...props });
  const {
    lean = 0,
    squish = 0,
    wisps = 1,
    crust = 0,
    glow = 1,
    shadow = true,
  } = props;

  // The crown wobbles on its own slow clock, offset by the character's phase so
  // two drops in one shot are not one puppet. Molten things do not hold still.
  const k = (rig.frame / rig.fps) * 0.34 + rig.phase * 0.21;

  // `squish` on top of the breath rather than instead of it: the rig's own
  // squash keeps running underneath, so a stretched Ember still breathes.
  const sx = 1 - squish * 0.22;
  const sy = 1 + squish * 0.26;

  // The highlight slides a couple of px on the lagged breath, like Drip's — she
  // is a body of liquid and light on her surface should not be painted on.
  const shineX = rig.trail.dy * 1.6;
  const shineY = rig.trail.dy * 2.2;

  const crustW = Math.max(0, Math.min(1, crust)) * 34;
  const body = crownPath(k);

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox="-170 -170 340 320"
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      {/* The halo. Behind everything, wide and soft, and the reason a flat
          orange body reads as *molten* rather than as an orange sticker. One
          shared gradient id across every instance on purpose: they all want
          the identical ramp, and a per-instance id is the thing that makes a
          document with a dozen glow-drops in it expensive. */}
      {glow > 0 ? (
        <>
          <defs>
            <radialGradient id="ember-glow">
              <stop offset="0" stopColor={EMBER_COLOR.glow} stopOpacity={0.55 * glow} />
              <stop offset="0.55" stopColor={EMBER_COLOR.glow} stopOpacity={0.2 * glow} />
              <stop offset="1" stopColor={EMBER_COLOR.glow} stopOpacity={0} />
            </radialGradient>
          </defs>
          <ellipse cx={0} cy={BALL_Y - 6} rx={BALL_R * 2.1} ry={BALL_R * 2} fill="url(#ember-glow)" />
        </>
      ) : null}

      {shadow ? (
        <ellipse
          cx={0}
          cy={BALL_Y + BALL_R * 0.9 + 22}
          rx={92}
          ry={16}
          fill={kidTheme.ink}
          opacity={0.16}
        />
      ) : null}

      <g transform={`rotate(${lean.toFixed(2)} 0 ${BALL_Y + BALL_R * 0.9}) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`}>
        {/* Two detached heat wisps, well clear of the crown. Detached is the
            whole licence: a wisp joined to her would be a flame, and a flame on
            a round body is the silhouette this design refuses. */}
        {wisps > 0 ? (
          <g opacity={0.62 * wisps}>
            {[0, 1].map((i) => {
              const u = ((rig.frame / rig.fps) * 0.5 + i * 0.5 + rig.phase * 0.13) % 1;
              return (
                <ellipse
                  key={i}
                  cx={(i === 0 ? -34 : 40) + Math.sin(u * Math.PI * 2 + i) * 12}
                  cy={BALL_Y - BALL_R * 1.28 - u * 62}
                  rx={19 * (1 - u * 0.45)}
                  ry={25 * (1 - u * 0.35)}
                  fill={EMBER_COLOR.hot}
                  opacity={(1 - u) * 0.9}
                />
              );
            })}
          </g>
        ) : null}

        <path
          d={body}
          fill={EMBER_COLOR.body}
          stroke={EMBER_COLOR.edge}
          strokeWidth={8}
          strokeLinejoin="round"
        />

        {/* THE CRUST. A stroke on the body's own outline, so it grows from the
            edge and half of it sits genuinely outside her — the dark skin the
            script says twice is a *surface*. Drawn over the body and under the
            highlights, so a crusted Ember still has a lit shoulder. */}
        {crustW > 0 ? (
          <path
            d={body}
            fill="none"
            stroke={EMBER_COLOR.crust}
            strokeWidth={crustW}
            strokeLinejoin="round"
            opacity={0.92}
          />
        ) : null}

        {/* Highlights: flat shapes, kept clear of the face. The crown one is
            what makes the three lobes read as glowing rather than as a hat. */}
        <g transform={`translate(${shineX.toFixed(1)} ${shineY.toFixed(1)})`} opacity={1 - crust * 0.7}>
          <ellipse
            cx={-6}
            cy={BALL_Y - BALL_R * 0.78}
            rx={68}
            ry={22}
            fill={EMBER_COLOR.hot}
            opacity={0.75}
          />
          <ellipse
            cx={-58}
            cy={BALL_Y - 14}
            rx={16}
            ry={26}
            fill={EMBER_COLOR.hot}
            opacity={0.5}
            transform={`rotate(-18 -58 ${BALL_Y - 14})`}
          />
        </g>

        <Face
          rig={rig}
          x={0}
          y={BALL_Y - 4}
          size={1.52}
          eyeScale={1.04}
          skin={EMBER_COLOR.body}
          // Pink over hot orange goes invisible; this is a magenta hot enough to
          // stay a cheek on her, and it is the same fix Drip's `blushStrength`
          // is (STYLE: "blush over a cold body needs opacity, not hue" — the
          // same is true the other way round over a hot one).
          blushColor="#ff2f6b"
          blushStrength={1.5}
        />
      </g>
    </CharacterFrame>
  );
};

/**
 * One of the magma crowd: the same body, no rig, no face rig, no hooks.
 *
 * The chamber holds dozens of these (script.md, Scene 5: "dozens of identical
 * glow-drops with faces — the episode's free crowd"), and the crowd rule is
 * STYLE's: **a crowd that has faces is a comedy cast that costs nothing, as
 * long as nobody gives it a line.** Two dots and an arc, drawn inside whatever
 * `<svg>` the scene is already using, so a chamber with forty of them in it
 * costs forty paths rather than forty `useRig` calls.
 *
 * `t` is the scene's own seconds, passed in — these are pure geometry and are
 * deliberately not allowed a hook of their own.
 */
export const GlowDrop: React.FC<{
  x: number;
  y: number;
  scale?: number;
  /** Desync. Always give each one a different value. */
  phase?: number;
  t: number;
  /** −1 looks left, 0 at camera, 1 right. */
  look?: number;
  opacity?: number;
}> = ({ x, y, scale = 1, phase = 0, t, look = 0, opacity = 1 }) => {
  const bob = Math.sin(t * 1.4 + phase) * 5;
  const squash = 1 + Math.sin(t * 1.4 + phase) * 0.035;
  // 62, not 46. At 46 a crowd drop staged at 0.8 was a 74px circle with two
  // dots in it — an emoji, not a body — and Ember standing among them at the
  // same size stopped being the hero of the shot.
  const r = 62;
  return (
    <g
      transform={`translate(${x.toFixed(1)} ${(y + bob).toFixed(1)}) scale(${(scale * squash).toFixed(3)} ${(scale / squash).toFixed(3)})`}
      opacity={opacity}
    >
      {/* A tight halo, not a wide one: at 1.7r and 0.16 alpha a dozen of these
          in one shot merged into a single pale cloud with faces in it. */}
      <ellipse cx={0} cy={-4} rx={r * 1.3} ry={r * 1.25} fill={EMBER_COLOR.glow} opacity={0.1} />
      <path
        d={
          `M ${-r} 0` +
          ` C ${-r} ${-r * 0.7} ${-r * 0.5} ${-r * 1.06} 0 ${-r * 1.04}` +
          ` C ${r * 0.5} ${-r * 1.06} ${r} ${-r * 0.7} ${r} 0` +
          ` Q ${r * 0.95} ${r * 0.86} 0 ${r * 0.9}` +
          ` Q ${-r * 0.95} ${r * 0.86} ${-r} 0 Z`
        }
        fill={mixHex(EMBER_COLOR.body, EMBER_COLOR.hot, 0.22)}
        stroke={EMBER_COLOR.edge}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <ellipse cx={-4} cy={-r * 0.72} rx={34} ry={12} fill={EMBER_COLOR.hot} opacity={0.7} />
      {/* Two dots and an arc. Content, and completely unbothered. */}
      <circle cx={-18 + look * 5} cy={-8} r={8} fill={kidTheme.ink} />
      <circle cx={18 + look * 5} cy={-8} r={8} fill={kidTheme.ink} />
      <path
        d="M -14 18 q 14 12 28 0"
        stroke={kidTheme.ink}
        strokeWidth={5.5}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
};
