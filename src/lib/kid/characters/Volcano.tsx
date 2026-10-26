import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Face, useRig } from "../Character";
import { VOLCANO_BODY, VOLCANO_SHAPE } from "../props";
import { kidEase, type LookDirection } from "../rig";
import type { WideLayerProps } from "../staging";
import { kidTheme, mixHex } from "../theme";

// PROMOTED 2026-10-26 (ep 6 skeleton wave) out of
// `src/videos/volcano/scenes/Volcano.tsx`, because episode six needs him
// awake on every coastal horizon and needed-twice is the promotion rule. A
// pure move: not one number below changed, the old file is a one-line
// re-export so no ep-5 scene import changed, and it was proved with the
// PROCESS §7 frame grid on `EmberVolcano` (before / after / same-code control)
// — results in `scratchpad/ep6/skeleton-wave-report.md`. The SVG ids keep
// their `ep5-` prefix on purpose: renaming them is a change to the drawn
// document, and this promotion is not allowed one.

// THE VOLCANO — four episodes of scenery, and in this one he is a character.
//
// He has stood on the horizon of every coastal wide since episode two as
// `makeSleepingVolcano` in the kit: a silhouette with two closed arcs and a
// smoke ring, that nobody looks at, points at or names. In Scene 3 of this
// episode the camera turns and faces him, and in Scene 9 he says the first line
// the scenery has ever spoken. That is the whole reason this component exists
// rather than a prop on the kit one.
//
// ---------------------------------------------------------------------------
// THE CONTINUITY CONTRACT — read this before changing a number
//
// **He is drawn in the kit's own local units** (`VOLCANO_SHAPE`: halfW 88, h
// 108, crater 18, baseline at y = 0), which means `scale` means exactly what it
// meant in episodes two, three and four: ep 2 staged him at 1.0, ep 3 at 1.15,
// ep 4 at 0.92, and a wide in THIS episode staging him at 1.15 puts him on the
// horizon at the size the audience has been ignoring for three shows. The
// portrait framings then just turn that number up (`VOLCANO_PORTRAIT`), and
// the silhouette the audience already knows grows into the frame instead of
// being replaced by a different mountain. Do not re-proportion him.
//
// **The profile path is byte-identical to the kit's.** Same control points,
// same lit flank, same haze ellipse at the waterline. What is added is
// everything a character needs and scenery does not:
//
//   THE FACE PANEL   A paler patch of stone on the upper flank. Present from
//                    the first frame of the episode at low strength, where it
//                    reads as a lit crag and is completely deniable — which is
//                    the volcano rule ("nobody looks at it") holding right up
//                    to the moment it stops. It is also the mechanical reason
//                    he can have a face at all: `Face` paints its eyelids as
//                    `skin`-coloured rectangles, so the features need an opaque
//                    field of a *known* colour under them (the ep-3 Ray rule).
//   THE WAKE         `awake` 0..1. Asleep, the kit's two small closed arcs and
//                    its small mouth curve, exactly as shipped. Awake, a full
//                    kit `Face` at character scale. The two cross-dissolve
//                    ACROSS A SCALE — the big face grows out of the small one
//                    rather than fading on top of it, because a cross-faded
//                    face is a double exposure and this beat has to read as a
//                    decision.
//   THE EYES         Drawn here rather than by `Face` (`eyes={false}`), because
//                    the opening is a lid *rising* — the same mechanism the
//                    kit's one-eye tease used in ep 3 — and because the two
//                    lids open a few frames apart, which is most of what makes
//                    him read as unhurried rather than startled.
//   THE VENT         `smoke` (a thin curl, the cold open) and `erupt` (the
//                    fountain, act two). Both deterministic from the frame.
//
// ---------------------------------------------------------------------------
// HIS STAGING VOCABULARY IS ONE SENTENCE (script.md, casting table): **"the
// mountain moved slightly and that is enormous."** No body walk, no gestures,
// no banter, no lean. Everything this component can do is a fraction of a
// degree, a fraction of a percent, or his face. If an act wants him to react,
// the answer is `look` and a slower `breath` — never a move.

const V = VOLCANO_SHAPE;

/** Where a portrait framing stands him. See the continuity contract. */
export const VOLCANO_PORTRAIT = 5.6;

/**
 * **The face's geometry, as constants, because two things now read it.**
 *
 * The component draws his features from these; `volcanoFace()` below aims at
 * them. They were literals inside the component until a speech bubble had to
 * point at his mouth and the only way to find the mouth was to re-derive the
 * same arithmetic by hand somewhere else — which is exactly how a bubble ends
 * up with its tail on his eye. **Nothing outside this file may hard-code a
 * position on his face.**
 *
 * `FACE_SEAT` is the fraction of his height the face centre sits at; see the
 * long note at its use site for why it is 0.40 at size 0.85. His profile is
 * ≈ 88 − 70f wide at height fraction f, and those two numbers are the solution
 * to keeping brows, eyelid rectangles and mouth inside it.
 */
const FACE_SEAT = 0.4;
const FACE_SIZE_AWAKE = 0.85;
const FACE_SIZE_ASLEEP = 0.42;
const FACE_X = 2;
const FACE_EYE_SPREAD = 1.12;

/**
 * The kit's own face metrics, in `Face` units. `Character.tsx`'s `FACE` table
 * is private to that file; these are the rows anything outside it needs in
 * order to point at a feature rather than at a guess.
 */
const FACE_UNITS = { eyeY: -8, eyeX: 23, eyeRx: 17, eyeRy: 19, browY: -37, mouthY: 30 } as const;

/**
 * **Where his features are on screen** — the anchor points a bubble, a look or
 * a camera focus should use, in composition pixels.
 *
 * Derived from the same constants the component draws with, so it cannot drift
 * from the picture. `awake` matters because the face *grows* as he wakes: the
 * mouth at `awake: 0` is nearly a third of the way up the flank from where it
 * ends at `awake: 1`, and a bubble anchored on the wrong one slides during the
 * eyelid rise.
 */
export function volcanoFace(seat: {
  x: number;
  base: number;
  scale?: number;
  awake?: number;
}): {
  /** The face's own centre line. */
  x: number;
  browY: number;
  eyeY: number;
  /** Centres of the left and right eyes. */
  eyeX: [number, number];
  /** Half the drawn width of one eye — what a bubble has to clear. */
  eyeRx: number;
  /** Half the drawn height of one eye. */
  eyeRy: number;
  /** **THE MOUTH.** Everything he says comes out of here. */
  mouthY: number;
  mouthX: number;
} {
  const s = seat.scale ?? 1;
  const size =
    FACE_SIZE_ASLEEP + (FACE_SIZE_AWAKE - FACE_SIZE_ASLEEP) * clamp01(seat.awake ?? 1);
  const faceLocalY = -V.h * FACE_SEAT;
  const at = (localY: number): number => seat.base + localY * s;
  const cx = seat.x + FACE_X * s;
  const eyeDx = FACE_UNITS.eyeX * FACE_EYE_SPREAD * size * s;
  return {
    x: cx,
    browY: at(faceLocalY + FACE_UNITS.browY * size),
    eyeY: at(faceLocalY + FACE_UNITS.eyeY * size),
    eyeX: [cx - eyeDx, cx + eyeDx],
    eyeRx: FACE_UNITS.eyeRx * size * s,
    eyeRy: FACE_UNITS.eyeRy * size * s,
    mouthY: at(faceLocalY + FACE_UNITS.mouthY * size),
    mouthX: cx,
  };
}

/**
 * The stone panel his features are drawn on.
 *
 * **0.24 toward paper, not 0.46.** The first pass made it pale enough to see on
 * its own and the result was a cartoon face stuck on a triangle: the panel read
 * as the face and the mountain read as the thing it was stuck to. At 0.24 it is
 * a subtly lit crag, the ink features carve into it, and all the contrast the
 * eyes need comes from the whites of the eyes — which is where it comes from on
 * every other character in the show.
 */
const PANEL = mixHex(VOLCANO_BODY, kidTheme.paper, 0.24);
/** The kit's own face-stroke colour, for the sleeping arcs. */
const SLEEP_FACE = mixHex(VOLCANO_BODY, kidTheme.paper, 0.52);

export type VolcanoProps = {
  x: number;
  /** The horizon line he seats on. His baseline is y = 0 locally. */
  base: number;
  scale?: number;
  phase?: number;
  /** Warm rim light, 0..1. Zero on a bright plate, ~0.9 on a dark one. */
  rim?: number;
  /**
   * **The wake, 0..1.** 0 is four episodes of closed arcs; 1 is a character
   * with a face. Anything in between is the morph, and the morph is the beat.
   */
  awake?: number;
  /** True while his own clip is playing. Drives the mouth. */
  speaking?: boolean;
  /** Where his eyes point. Only meaningful once `awake` is up. */
  look?: LookDirection;
  /** Face expression. `neutral` is the butler at rest and is the default. */
  emotion?: Parameters<typeof useRig>[0]["emotion"];
  /**
   * The thin curl off the summit, 0..1. The cold open runs this at ~0.5 (the
   * script's "thin smoke rises from the summit") and Scene 9 pops it.
   */
  smoke?: number;
  /** A single ash pop, as a frame number. `undefined` for none. */
  ashAt?: number;
  /** The fountain, 0..1 — act two's. Nothing in the cold open or act one. */
  erupt?: number;
  /**
   * How deep he breathes, multiplier on the default. His breath is the ONLY
   * thing that ever moves, so an act that wants him to seem more awake turns
   * this up rather than moving him.
   */
  breath?: number;
  opacity?: number;
};

/**
 * Bound to an episode's `WideLayer`, exactly like the kit's sleeping one:
 *
 *   export const Volcano = makeVolcano(WideLayer);
 */
export function makeVolcano(
  WideLayer: React.FC<WideLayerProps>,
): React.FC<VolcanoProps> {
  const Volcano: React.FC<VolcanoProps> = ({
    x,
    base,
    scale = 1,
    phase = 0,
    rim = 0,
    awake = 0,
    speaking = false,
    look = "camera",
    emotion = "neutral",
    smoke = 0,
    ashAt,
    erupt = 0,
    breath = 1,
    opacity = 0.92,
  }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const t = frame / fps + phase * 3;
    const wake = clamp01(awake);
    const boom = clamp01(erupt);

    // The rig drives the face only. `idle: 0` because a mountain does not bob —
    // his breath is drawn below, in the body scale, at a hundredth of the
    // amplitude a character gets.
    const rig = useRig({
      x,
      y: base,
      emotion,
      speaking,
      look,
      phase,
      idle: 0,
      eyeLife: 0.35,
    });

    // ONE SLOW BREATH. 6.5 seconds in and out — half the rate the kit's snoring
    // one runs at, because he is awake for most of this episode and a sleeper's
    // rhythm on a character reads as snoring through his own dialogue.
    const b = Math.sin((t / 6.5) * Math.PI * 2);
    const amp = (0.014 + 0.01 * boom) * breath;
    const sy = 1 - amp * b;
    const sx = 1 + amp * 0.72 * b;
    // The rumble while he is erupting: in the island, never in the lens.
    const sway = boom * Math.sin(t * 4.7) * 1.3;

    const body = rim > 0 ? mixHex(VOLCANO_BODY, kidTheme.sunDeep, 0.18 * rim) : VOLCANO_BODY;
    const sleepFace = rim > 0 ? mixHex(SLEEP_FACE, kidTheme.sunLight, 0.5 * rim) : SLEEP_FACE;
    const panel = rim > 0 ? mixHex(PANEL, kidTheme.sunLight, 0.36 * rim) : PANEL;

    // **THE FACE'S SEAT, AND IT IS ARITHMETIC RATHER THAN TASTE.**
    //
    // His profile narrows fast: half-width ≈ 88 − 70f at height fraction f, so
    // at f = 0.6 he is only ±46 units wide and the first pass's face — centred
    // there at size 1.48 — put its BROWS at ±42 and its eyelid rectangles at
    // ±70. The eyes and brows rendered outside the mountain, floating on a pale
    // oval bigger than the peak. Solving the same inequality honestly gives
    // f = 0.40 and size 0.85: eyes land at ±42 where he is ±55 wide, brows at
    // ±35 where he is ±40, and the mouth at ±28 where he is ±76. Everything is
    // inside the silhouette by construction, and the clip below is a belt on
    // top of the braces.
    // Both of these come from the module constants rather than from literals,
    // so `volcanoFace()` above is aiming at the same face this draws.
    const faceY = -V.h * FACE_SEAT;
    // Asleep the features are the kit's — small, at its exact coordinates.
    // Awake they are a character's. The size ramp IS the morph.
    const faceSize =
      FACE_SIZE_ASLEEP + (FACE_SIZE_AWAKE - FACE_SIZE_ASLEEP) * kidEase.easeInOutSine(wake);
    // Asleep the panel is a CRAG, not a face field: small and barely there. The
    // first pass drew it at 34 units and 0.34 alpha and it read as a pale disc
    // stuck on the mountain — a smudge in the wide, a moon in the portrait, and
    // in both cases the one thing the volcano rule cannot afford, which is
    // being interesting. It only becomes a field when he needs one.
    const panelR = 18 + 16 * kidEase.easeInOutSine(wake);

    return (
      <WideLayer>
        <g transform={`translate(${(x + sway).toFixed(2)} ${base}) scale(${scale})`} opacity={opacity}>
          {rim > 0 ? (
            <>
              <defs>
                <radialGradient id="ep5-volcano-glow">
                  <stop offset="0" stopColor={kidTheme.sunDark} stopOpacity={0.42 * rim} />
                  <stop offset="0.5" stopColor={kidTheme.sunDark} stopOpacity={0.16 * rim} />
                  <stop offset="1" stopColor={kidTheme.sunDark} stopOpacity={0} />
                </radialGradient>
              </defs>
              <ellipse
                cx={0}
                cy={-V.h * 0.5}
                rx={V.halfW * 1.45}
                ry={V.h * 0.92}
                fill="url(#ep5-volcano-glow)"
              />
            </>
          ) : null}
          {/* Haze where he meets the water. Ink at low alpha, so the same
              component works over a painted horizon and a drawn one. */}
          <ellipse cx={0} cy={0} rx={V.halfW * 1.08} ry={6} fill={kidTheme.ink} opacity={0.16} />

          <g transform={`scale(${sx.toFixed(4)} ${sy.toFixed(4)})`}>
            <path d={profile()} fill={body} />
            {/* One lit flank, so he has a shape instead of being a cut-out. */}
            <path
              d={
                `M ${-V.halfW} 0` +
                ` C ${-V.halfW * 0.66} ${-V.h * 0.32} ${-V.halfW * 0.39} ${-V.h * 0.7} ${-V.crater} ${-V.h}` +
                ` L ${-V.crater * 0.2} ${-V.h * 0.9} L ${-V.halfW * 0.42} 0 Z`
              }
              fill={mixHex(body, kidTheme.sunLight, 0.16 + 0.14 * rim)}
              opacity={0.7 + 0.1 * rim}
            />
            {rim > 0 ? (
              <path
                d={crest()}
                fill="none"
                stroke={kidTheme.sunLight}
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.72 * rim}
              />
            ) : null}

            {/* **EVERYTHING FROM HERE IS CLIPPED TO HIS OWN SILHOUETTE.**
                One shared clip id is safe here where the kit warns it is not
                for eyelids: the lid warning is about a *gradient* resolving in
                the wrong space, and this is a path in the volcano's own local
                units — every instance references it from inside its own
                transform, so it clips correctly at any scale, and there is
                never more than one of him on screen anyway. */}
            <defs>
              <clipPath id="ep5-volcano-body">
                <path d={profile()} />
              </clipPath>
            </defs>
            <g clipPath="url(#ep5-volcano-body)">
            {/* THE FACE PANEL. Asleep it is a crag; awake it is the field the
                features need. Two ellipses rather than one so the edge is not a
                perfect oval sitting on a mountain like a badge. */}
            <g opacity={0.12 + 0.72 * kidEase.easeInOutSine(wake)}>
              <ellipse
                cx={2}
                cy={faceY + panelR * 0.1}
                rx={panelR * 1.42}
                ry={panelR}
                fill={panel}
              />
              <ellipse
                cx={-panelR * 0.5}
                cy={faceY - panelR * 0.34}
                rx={panelR * 0.7}
                ry={panelR * 0.46}
                fill={panel}
                opacity={0.7}
              />
            </g>

            {/* ASLEEP: the kit's own three strokes, unchanged, fading out as he
                wakes. This is the literal continuity — the thing on the horizon
                of episodes two through four is still drawn here. */}
            {wake < 0.995 ? (
              <g
                stroke={sleepFace}
                strokeWidth={6}
                strokeLinecap="round"
                fill="none"
                opacity={(0.8 + 0.2 * rim) * (1 - kidEase.easeInOutSine(wake))}
              >
                <path d={`M -33 ${-V.h * 0.56} q 11 -13 22 0`} />
                <path d={`M 11 ${-V.h * 0.56} q 11 -13 22 0`} />
                <path d={`M -10 ${-V.h * 0.4} q 10 9 20 0`} strokeWidth={5} />
              </g>
            ) : null}

            {/* AWAKE: a character. `eyes={false}` — the lids are drawn below,
                because they rise rather than fade and they rise a few frames
                apart. */}
            {wake > 0.005 ? (
              <g opacity={kidEase.easeInOutSine(wake)}>
                <Face
                  rig={rig}
                  x={2}
                  y={faceY}
                  size={faceSize}
                  eyes={false}
                  eyeSpread={FACE_EYE_SPREAD}
                  skin={panel}
                  // A mountain may blush, but faintly: at 0.9 the two pink
                  // patches read as smudges on stone rather than as cheeks.
                  blushColor="#e0705a"
                  blushStrength={0.4}
                />
                <VolcanoEyes
                  rig={rig}
                  x={2}
                  y={faceY}
                  size={faceSize}
                  spread={FACE_EYE_SPREAD}
                  skin={panel}
                  open={wake}
                />
              </g>
            ) : null}
            </g>
          </g>

          {/* THE VENT. Everything that leaves the crater. */}
          <Plume t={t} strength={smoke} rim={rim} />
          {ashAt !== undefined ? <AshPop since={frame - ashAt} /> : null}
          {boom > 0.01 ? <Fountain t={t} strength={boom} /> : null}
        </g>
      </WideLayer>
    );
  };
  return Volcano;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** The kit's profile, byte-identical. See the continuity contract. */
function profile(): string {
  return (
    `M ${-V.halfW} 0` +
    ` C ${-V.halfW * 0.66} ${-V.h * 0.32} ${-V.halfW * 0.39} ${-V.h * 0.7} ${-V.crater} ${-V.h}` +
    ` Q 0 ${-V.h * 0.87} ${V.crater} ${-V.h}` +
    ` C ${V.halfW * 0.39} ${-V.h * 0.7} ${V.halfW * 0.66} ${-V.h * 0.32} ${V.halfW} 0 Z`
  );
}

function crest(): string {
  return (
    `M ${-V.halfW} 0` +
    ` C ${-V.halfW * 0.66} ${-V.h * 0.32} ${-V.halfW * 0.39} ${-V.h * 0.7} ${-V.crater} ${-V.h}` +
    ` Q 0 ${-V.h * 0.87} ${V.crater} ${-V.h}`
  );
}

/**
 * **His eyes**, drawn here rather than by `Face`.
 *
 * The opening is a lid *rising*: the eye grows in height about its own centre
 * and the lash line rides up with it. A cross-fade between a closed arc and an
 * open eye is a double exposure, and this beat — the scenery of four episodes
 * deciding to look at you — has to read as a decision.
 *
 * **The two lids are 0.12 out of phase.** He opens one eye a beat before the
 * other, and that asymmetry is the entire difference between a mountain waking
 * up and a mountain being startled. It is also, quietly, the ep-3 tease
 * collected: the eye that opens first is the right one, which is the one that
 * opened for 45 frames in the sunset race and closed again.
 */
const VolcanoEyes: React.FC<{
  rig: ReturnType<typeof useRig>;
  x: number;
  y: number;
  size: number;
  spread: number;
  skin: string;
  open: number;
}> = ({ rig, x, y, size, spread, skin, open }) => {
  const ink = kidTheme.ink;
  return (
    <g transform={`translate(${x} ${y}) scale(${size}) rotate(${rig.emo.tilt + rig.headSettle})`}>
      {([1, -1] as const).map((side, i) => {
        // side 1 is his right (camera-left is −1): the right one leads.
        const o = clamp01((open - i * 0.12) / (1 - 0.12));
        const lidRise = kidEase.easeInOutSine(o);
        const ex = side * 23 * spread;
        const ey = -8;
        const rx = 17 * rig.emo.eyeScaleX;
        const ry = 19 * rig.emo.eyeScaleY * (0.06 + 0.94 * lidRise);
        const pr = 9.4 * rig.emo.pupilScale * (0.4 + 0.6 * lidRise);
        const px = ex + rig.look.x * Math.max(0, rx - pr - 1.5);
        const py = ey + rig.look.y * Math.max(0, ry - pr - 1.5) + rig.lid * ry * 0.55;
        const lidY = ey - ry + rig.lid * 2 * ry;
        return (
          <g key={side}>
            <ellipse cx={ex} cy={ey} rx={rx} ry={ry} fill="#ffffff" stroke={ink} strokeWidth={2.6} />
            <circle cx={px} cy={py} r={pr} fill={ink} />
            <circle cx={px - pr * 0.36} cy={py - pr * 0.44} r={pr * 0.36} fill="#ffffff" />
            {rig.lid > 0.02 ? (
              <rect
                x={ex - rx - 4}
                y={ey - ry - 4}
                width={rx * 2 + 8}
                height={Math.max(0, lidY - (ey - ry - 4))}
                fill={skin}
              />
            ) : null}
            {/* The lash line: the top edge of the opening eye, so the lid reads
                as a thing that has moved rather than as a shape that grew. */}
            <path
              d={`M ${ex - rx - 1} ${(ey - ry).toFixed(1)} q ${rx} ${(-5 - 4 * lidRise).toFixed(1)} ${rx * 2 + 2} 0`}
              stroke={ink}
              strokeWidth={3.2}
              strokeLinecap="round"
              fill="none"
              opacity={0.9}
            />
          </g>
        );
      })}
    </g>
  );
};

/**
 * The thin curl off the summit.
 *
 * Four soft puffs on one deterministic ladder, rising and spreading and fading.
 * Not the kit's snore *ring*: a ring is a sleeping gag, and from Scene 3 on he
 * is not asleep. Ten thousand years of quiet venting, which is also the honest
 * physics — a shield volcano's summit steams for a very long time before it
 * does anything.
 */
const Plume: React.FC<{ t: number; strength: number; rim: number }> = ({
  t,
  strength,
  rim,
}) => {
  const s = clamp01(strength);
  if (s <= 0.005) return null;
  // **Not near-white.** At 0.72–0.8 toward paper the plume was invisible
  // against the dawn plate's cream horizon band — and Scene 3's *entire* visual
  // content is "thin smoke rises from the summit", so a plume that only reads
  // over a blue sky is a scene that only works half the time. A light warm grey
  // reads on both, because it has a value of its own rather than borrowing the
  // sky's.
  const tint = mixHex(SLEEP_FACE, kidTheme.paper, rim > 0 ? 0.52 : 0.46);
  // **Ten puffs on a 0.55s ladder, not four on a 2.6s one.** The first pass
  // spaced them so widely that on most frames the youngest puff was already a
  // quarter of its life old — twenty units above a crater it was supposed to be
  // leaving — and the plume rendered as three detached blobs hanging in the sky
  // with clear air under them. A curl has to be attached to the thing making
  // it, and the only way to guarantee that on EVERY frame is for a new one to
  // be born often enough that the youngest is always newborn.
  const period = 0.55;
  const count = 10;
  const life = period * count;
  const newest = Math.floor(t / period);
  return (
    <g>
      {Array.from({ length: count }, (_, i) => newest - i).map((k) => {
        const age = t - k * period;
        if (age < 0 || age > life) return null;
        const u = age / life;
        const rise = kidEase.easeOutSine(u) * (58 + 52 * s);
        const rr = (4.5 + u * 15) * (0.62 + 0.7 * s);
        const cx = u * 20 + Math.sin(u * 3.1 + k) * 5;
        // +9 rather than −1: the youngest puff has to be INSIDE the crater lip
        // on the frame it is born, or the plume renders as a column of blobs
        // with clear sky under it — smoke that is not coming from anything.
        const cy = -V.h + 9 - rise;
        return (
          <ellipse
            key={k}
            cx={cx}
            cy={cy}
            rx={rr}
            ry={rr * 0.82}
            fill={tint}
            opacity={0.68 * s * Math.min(1, u * 9) * (1 - u) ** 1.25}
          />
        );
      })}
    </g>
  );
};

/**
 * ONE ash pop, on the button of "Do pardon the ash."
 *
 * The script's direction is "One small ash pop, ON the button — the butler
 * register confirmed", so it is small, it is fast, and it is over: eight dark
 * flecks out of the crater on a short arc and gone inside a second. Anything
 * bigger is an eruption, and the eruption is two scenes away.
 */
const AshPop: React.FC<{ since: number }> = ({ since }) => {
  if (since < 0 || since > 34) return null;
  const u = since / 34;
  return (
    <g opacity={(1 - u) ** 0.9}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = -Math.PI * 0.5 + ((i - 3.5) / 3.5) * 0.72;
        const sp = 22 + (i % 3) * 9;
        const out = kidEase.easeOutCubic(u);
        return (
          <circle
            key={i}
            cx={Math.cos(a) * sp * out}
            cy={-V.h - 2 + Math.sin(a) * sp * out + u * u * 26}
            r={2.6 + (i % 2) * 1.1}
            fill={mixHex(VOLCANO_BODY, kidTheme.ink, 0.35)}
          />
        );
      })}
    </g>
  );
};

/**
 * The fountain — act two's, wired here so the act agent gets it for free.
 *
 * **It is fireworks, not a disaster** (the episode's hard tone gate): the
 * script stages the eruption as a construction site from its first frame, so
 * this is a bright fountain that rises and arcs back into the crater, warm and
 * unhurried, with nothing thrown at anybody.
 */
const Fountain: React.FC<{ t: number; strength: number }> = ({ t, strength }) => {
  const s = clamp01(strength);
  const n = 14;
  return (
    <g>
      <ellipse
        cx={0}
        cy={-V.h - 6 * s}
        rx={V.crater * 1.1}
        ry={5}
        fill="#ffc247"
        opacity={0.8 * s}
      />
      {Array.from({ length: n }, (_, i) => {
        const u = ((t * 0.9 + i / n) % 1);
        const a = -Math.PI * 0.5 + ((i % 7) - 3) * 0.2;
        const sp = (26 + (i % 5) * 8) * s;
        const rise = Math.sin(u * Math.PI) * sp;
        return (
          <circle
            key={i}
            cx={Math.cos(a) * sp * u * 1.1}
            cy={-V.h - rise}
            r={(3.4 - u * 1.4) * (0.6 + 0.6 * s)}
            fill={u < 0.5 ? "#ffd86a" : "#ff8a2b"}
            opacity={0.9 * s * (1 - u * 0.4)}
          />
        );
      })}
    </g>
  );
};
