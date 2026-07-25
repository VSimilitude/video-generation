import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kidTheme } from "./theme";
import {
  EMOTIONS,
  blinkAmount,
  combine,
  entranceTransform,
  exitTransform,
  idleSquash,
  lookOffset,
  mouthAmplitude,
  type Emotion,
  type EmotionSpec,
  type Entrance,
  type Exit,
  type LookDirection,
  type MouthShape,
  type Placement,
  type Squash,
} from "./rig";

// The shared half of every kid character: the rig hook that turns the current
// frame into a pose, the frame that positions and squashes a body, and the
// face that all three characters wear.
//
// A character component is then only its *silhouette* — Drip's teardrop,
// Sunny's disc and rays, Cloudia's cloud puffs — plus one <Face>. That split
// is what keeps them looking like the same show: the eyes, brows and mouth are
// literally the same code at three sizes.

// --- props shared by every character ---------------------------------------

export type CharacterProps = {
  /** Composition-space centre of the character, in px. */
  x: number;
  y: number;
  /** Size multiplier on the character's natural size. */
  scale?: number;
  emotion?: Emotion;
  /** True while this character's narration turn is playing (drives the mouth). */
  speaking?: boolean;
  look?: LookDirection;
  /**
   * Per-character offset for every cyclic behaviour (breath, blink, mouth).
   * Give each character on screen a different one — that's the only thing
   * stopping a group from bouncing and blinking in lockstep.
   */
  phase?: number;
  /** Mirror horizontally, to turn a character towards the other side. */
  flip?: boolean;
  /** 0 turns breathing off; 1 default; >1 for a bouncier beat. */
  idle?: number;
  enter?: Entrance;
  exit?: Exit;
  /** Stacking against other characters. */
  zIndex?: number;
};

export type Rig = {
  frame: number;
  fps: number;
  phase: number;
  emo: EmotionSpec;
  /** 0 open .. 1 shut, blinking plus any constant lid from the emotion. */
  lid: number;
  /** Final mouth opening 0..1 (emotion at rest, sine mix while speaking). */
  mouth: number;
  mouthShape: MouthShape;
  look: { x: number; y: number };
  squash: Squash;
  placement: Placement;
  speaking: boolean;
};

/**
 * Read the current frame into a pose. Pure apart from Remotion's frame/fps —
 * a still at frame N always draws the same character.
 */
export function useRig(props: CharacterProps): Rig {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase = props.phase ?? 0;
  const emo = EMOTIONS[props.emotion ?? "neutral"];
  const speaking = props.speaking ?? false;

  const blink = blinkAmount(frame, fps, phase);
  const lid = emo.lidBase + (1 - emo.lidBase) * blink;

  const mouth = speaking
    ? Math.max(emo.mouthOpen * 0.35, mouthAmplitude(frame, fps, phase))
    : emo.mouthOpen;
  // A talking mouth has to be able to close, so the "round" (amazed) and
  // "wobble" (scared) shapes give way to the parametric curve while speaking.
  const mouthShape: MouthShape = speaking ? "curve" : emo.mouthShape;

  const enter = entranceTransform(frame, fps, props.enter, (t, damping, mass) =>
    spring({ frame: t, fps, config: { damping, mass } }),
  );
  const leave = exitTransform(frame, fps, props.exit);

  return {
    frame,
    fps,
    phase,
    emo,
    lid,
    mouth,
    mouthShape,
    look: lookOffset(props.look),
    squash: idleSquash(frame, fps, phase, props.idle ?? 1),
    placement: combine(enter, leave),
    speaking,
  };
}

// --- the positioned, squashing frame ---------------------------------------

export const CharacterFrame: React.FC<{
  rig: Rig;
  x: number;
  y: number;
  /** Natural pixel size of the SVG box at scale 1. */
  width: number;
  height: number;
  viewBox: string;
  scale?: number;
  flip?: boolean;
  zIndex?: number;
  children: React.ReactNode;
}> = ({
  rig,
  x,
  y,
  width,
  height,
  viewBox,
  scale = 1,
  flip = false,
  zIndex,
  children,
}) => {
  const p = rig.placement;
  const sx = scale * rig.squash.sx * p.scaleX * (flip ? -1 : 1);
  const sy = scale * rig.squash.sy * p.scaleY;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        // Bottom-centre origin: squash-and-stretch has to keep the feet
        // planted, or breathing turns into the whole character floating.
        transformOrigin: "50% 100%",
        transform: [
          `translate(${p.dx}px, ${p.dy + rig.squash.dy}px)`,
          `rotate(${p.rotate}deg)`,
          `scale(${sx}, ${sy})`,
        ].join(" "),
        opacity: p.opacity,
        zIndex,
      }}
    >
      <svg width={width} height={height} viewBox={viewBox} overflow="visible">
        {children}
      </svg>
    </div>
  );
};

// --- the face --------------------------------------------------------------

/**
 * Face geometry, in "face units". The face is drawn in a ~100-wide box centred
 * on (0,0) and scaled by the character; every number below is therefore a
 * proportion, not a pixel size.
 */
const FACE = {
  eyeX: 23,
  eyeY: -8,
  eyeRx: 17,
  eyeRy: 19,
  pupilR: 9.4,
  browY: -37,
  browW: 32,
  mouthY: 30,
  blushX: 45,
  blushY: 20,
} as const;

export type FaceProps = {
  rig: Rig;
  /** Face centre inside the character's own SVG coordinates. */
  x?: number;
  y?: number;
  /** Face size multiplier (1 == the 100-unit box above). */
  size?: number;
  /**
   * Paint the eyelids use — i.e. whatever the face sits on. The lid is drawn
   * *over* the eye in body colour rather than clipped, which is why it has to
   * match the surrounding skin exactly.
   *
   * This is why character bodies are **flat-filled**. A gradient body cannot
   * be matched here: `objectBoundingBox` units give the lid its own copy of
   * the whole ramp, and `userSpaceOnUse` is still resolved in the *Face's*
   * transformed space, so the ramp lands scaled and offset. Both leave two
   * flat rectangles sitting on the character's face — invisible at 1×, glaring
   * on the first 2× portrait. Where a body does keep a gradient, it must be
   * vertical-only and `skin` must be its colour sampled at eye height.
   */
  skin: string;
  ink?: string;
  /** Hide the eyes (Sunny behind sunglasses draws its own). */
  eyes?: boolean;
  /** Extra spread of the two eyes, for wide faces. */
  eyeSpread?: number;
  /** Per-character eye size. Drip's are deliberately the biggest. */
  eyeScale?: number;
  /**
   * Cheek colour. The default pink turns muddy grey over a blue body, so a
   * character picks a blush that survives its own skin.
   */
  blushColor?: string;
  /** Multiplier on blush opacity. Dark/saturated skins need more. */
  blushStrength?: number;
};

export const Face: React.FC<FaceProps> = ({
  rig,
  x = 0,
  y = 0,
  size = 1,
  skin,
  ink = kidTheme.ink,
  eyes = true,
  eyeSpread = 1,
  eyeScale = 1,
  blushColor = kidTheme.blush,
  blushStrength = 1,
}) => {
  const { emo } = rig;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${size}) rotate(${emo.tilt})`}
      style={{ transformBox: "view-box" }}
    >
      <Blush rig={rig} color={blushColor} strength={blushStrength} />
      {eyes ? (
        <>
          <Eye rig={rig} side={-1} skin={skin} ink={ink} spread={eyeSpread} eyeScale={eyeScale} />
          <Eye rig={rig} side={1} skin={skin} ink={ink} spread={eyeSpread} eyeScale={eyeScale} />
        </>
      ) : null}
      <Brow rig={rig} side={-1} ink={ink} spread={eyeSpread} eyeScale={eyeScale} />
      <Brow rig={rig} side={1} ink={ink} spread={eyeSpread} eyeScale={eyeScale} />
      <Mouth rig={rig} ink={ink} />
    </g>
  );
};

const Blush: React.FC<{ rig: Rig; color: string; strength: number }> = ({
  rig,
  color,
  strength,
}) => {
  const o = Math.min(1, rig.emo.blush * strength);
  if (o <= 0) return null;
  return (
    <g opacity={o * 0.85}>
      <ellipse cx={-FACE.blushX} cy={FACE.blushY} rx={16} ry={10} fill={color} />
      <ellipse cx={FACE.blushX} cy={FACE.blushY} rx={16} ry={10} fill={color} />
    </g>
  );
};

const Eye: React.FC<{
  rig: Rig;
  side: -1 | 1;
  skin: string;
  ink: string;
  spread: number;
  eyeScale: number;
}> = ({ rig, side, skin, ink, spread, eyeScale }) => {
  const { emo, look, lid } = rig;
  const ex = side * FACE.eyeX * spread;
  const ey = FACE.eyeY;
  const rx = FACE.eyeRx * emo.eyeScaleX * eyeScale;
  const ry = FACE.eyeRy * emo.eyeScaleY * eyeScale;
  const pr = FACE.pupilR * emo.pupilScale * eyeScale;
  const px = ex + look.x * (rx - pr - 1.5);
  // The pupil rides down with the lid. Without this the eye finishes a blink
  // as a white crescent with no pupil in it, which reads as eyes rolling back
  // rather than as a blink.
  const py = ey + look.y * (ry - pr - 1.5) + lid * ry * 0.55;

  // Lid: a skin-coloured shutter that comes down over the eye, plus a lash
  // line at its edge. Painting over in body colour (rather than clipping) is
  // deliberate — it needs no per-instance clipPath id, so any number of
  // characters can share the document.
  const lidY = ey - ry + lid * 2 * ry;
  const lidTop = ey - ry - 4;

  return (
    <g>
      <ellipse cx={ex} cy={ey} rx={rx} ry={ry} fill="#ffffff" stroke={ink} strokeWidth={2.6} />
      <circle cx={px} cy={py} r={pr} fill={ink} />
      <circle cx={px - pr * 0.36} cy={py - pr * 0.44} r={pr * 0.36} fill="#ffffff" />
      <circle
        cx={px + pr * 0.36}
        cy={py + pr * 0.42}
        r={pr * 0.18}
        fill="#ffffff"
        opacity={0.75}
      />
      {lid > 0.02 ? (
        <>
          <rect
            x={ex - rx - 4}
            y={lidTop}
            width={rx * 2 + 8}
            height={Math.max(0, lidY - lidTop)}
            fill={skin}
          />
          <path
            d={`M ${ex - rx - 1} ${lidY} Q ${ex} ${lidY + 5 * lid} ${ex + rx + 1} ${lidY}`}
            stroke={ink}
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : null}
    </g>
  );
};

const Brow: React.FC<{
  rig: Rig;
  side: -1 | 1;
  ink: string;
  spread: number;
  eyeScale: number;
}> = ({ rig, side, ink, spread, eyeScale }) => {
  const { emo } = rig;
  const bx = side * FACE.eyeX * spread;
  // Brows ride above the eye, so a bigger eye pushes them up with it.
  const by = FACE.browY * (0.55 + 0.45 * eyeScale) + emo.browRaise;
  // Mirrored rotation: positive lowers the inner ends (angry), negative
  // raises them (worried). `browAsym` tilts only the character's left brow.
  const angle = -side * emo.browAngle + (side === -1 ? emo.browAsym : 0);
  const w = FACE.browW * eyeScale;
  return (
    <path
      d={`M ${-w / 2} 3 Q 0 -5 ${w / 2} 3`}
      transform={`translate(${bx} ${by}) rotate(${angle})`}
      stroke={ink}
      strokeWidth={8.5 * eyeScale}
      strokeLinecap="round"
      fill="none"
    />
  );
};

const Mouth: React.FC<{ rig: Rig; ink: string }> = ({ rig, ink }) => {
  const { emo, mouth, mouthShape } = rig;
  const w = emo.mouthWidth;
  const curve = emo.mouthCurve;
  const tilt = emo.mouthTilt;
  const y = FACE.mouthY;
  const depth = mouth * 30;

  if (mouthShape === "round") {
    const rx = w * 0.4;
    const ry = w * 0.4 * (0.55 + 0.8 * mouth);
    return (
      <g transform={`translate(0 ${y + ry * 0.25})`}>
        <ellipse rx={rx} ry={ry} fill={kidTheme.mouthDark} stroke={ink} strokeWidth={5.5} />
        <ellipse
          cy={ry * 0.42}
          rx={rx * 0.6}
          ry={ry * 0.32}
          fill={kidTheme.tongue}
        />
      </g>
    );
  }

  if (mouthShape === "wobble") {
    // A squiggle mouth reads as "nervous" instantly — no other cue needed.
    const n = 4;
    const step = w / n;
    let d = `M ${-w / 2} ${y}`;
    for (let i = 0; i < n; i++) {
      const x0 = -w / 2 + step * i;
      d += ` Q ${x0 + step * 0.5} ${y + (i % 2 === 0 ? -8 : 8)} ${x0 + step} ${y}`;
    }
    return <path d={d} stroke={ink} strokeWidth={6} strokeLinecap="round" fill="none" />;
  }

  const upperCtrl = curve * 0.62;
  const lowerCtrl = upperCtrl + depth * 1.45;
  const left = `${-w / 2} ${y + tilt}`;
  const right = `${w / 2} ${y - tilt}`;
  const d =
    `M ${left} Q 0 ${y + upperCtrl} ${right}` +
    ` Q 0 ${y + lowerCtrl} ${left.split(" ")[0]} ${y + tilt} Z`;

  const teethDepth = Math.min(depth * 0.4, 12);
  const showTeeth = mouth > emo.teethAt && teethDepth > 3;
  const tongueR = Math.min(w * 0.26, depth * 0.5);

  return (
    <g>
      <path d={d} fill={kidTheme.mouthDark} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
      {mouth > 0.5 && tongueR > 4 ? (
        <ellipse
          cx={0}
          cy={y + upperCtrl * 0.4 + depth * 0.78}
          rx={tongueR}
          ry={tongueR * 0.55}
          fill={kidTheme.tongue}
        />
      ) : null}
      {showTeeth ? (
        <path
          d={
            `M ${-w / 2 + 4} ${y + tilt} Q 0 ${y + upperCtrl} ${w / 2 - 4} ${y - tilt}` +
            ` L ${w / 2 - 4} ${y - tilt + teethDepth}` +
            ` Q 0 ${y + upperCtrl + teethDepth} ${-w / 2 + 4} ${y + tilt + teethDepth} Z`
          }
          fill={kidTheme.teeth}
        />
      ) : null}
    </g>
  );
};

/** Re-exported so a character file needs one import for its types. */
export type { Emotion, LookDirection, Entrance, Exit };
