import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  CharacterFrame,
  Face,
  kidEase,
  kidTheme,
  mixHex,
  settleWave,
  useRig,
  type CharacterProps,
} from "../../../lib/kid";

// PIP — the hero of episode four, and the campaign's one new rig body.
//
// A dandelion seed who will never take a single step and intends to build the
// biggest thing in the world anyway. She lives in the episode until a second
// one needs her; then this file moves to `src/lib/kid/characters/`.
//
// ---------------------------------------------------------------------------
// THE THREE DESIGN CONSTRAINTS, AND HOW EACH ONE IS PAID FOR
// ---------------------------------------------------------------------------
//
// **1. The silhouette must survive being mirrored** (STYLE, "Silhouette before
// detail"). A dandelion seed is, drawn honestly, the exact shape the Ray
// rounds died on: a compact mass at one end and a motif tapering away at the
// other. A real achene has a pointed seed, a long bare *beak*, and the fluff
// on top — a tadpole with a parachute. Three things kill that here:
//
//   - **the beak is deleted.** The pappus attaches straight onto the crown of
//     the pod, so there is no bare tapering stalk anywhere in the shape;
//   - **the pod is wider than it is tall** (208 × 168) and its bottom is
//     *round*, not pointed — nothing about her tapers downwards;
//   - **the fluff is a symmetric radial crown**, not a plume: eleven filaments
//     fanned about the vertical axis, so the flattened shape is a wide round
//     body under a symmetric halo. Mirrored it is identical, which is the test.
//
// The one polarity left in her is up/down, which every character in the show
// has and which is what "top of the head" means.
//
// **2. The face is 60–75% of the body's width.** The pod is 208 wide; `Face`
// at `size` 1.32 draws about 145 of face across it — 70%, and the reason she
// reads at the 0.42 scale a wide shot puts her at.
//
// **3. She never travels.** There is no `moveAlong` anywhere in this file and
// there must never be one in a scene that stages her after the cold open: her
// entire locomotion budget is spent in Scene 3 ("the whole seed tips one
// degree, and settles back"), and after that the only thing that ever changes
// about her position is that she is TALLER. Growth is her travel; see
// `PipState`. The cold-open flight is the exception that proves it — she is
// cargo, not a mover, and the wind is doing it.
//
// ---------------------------------------------------------------------------
// THE GESTURE RIG
// ---------------------------------------------------------------------------
//
// She has no arms — deliberately, and for the same reason Ray has none at
// rest. Short thick limbs on a round body read as fins (STYLE, "Limbs read
// only outside the silhouette"), and everything she needs to do she does with
// the two things a plant actually has:
//
//   THE LEAN    the whole body tilting about its own base. It is
//               heliotropism, it is true botany, and it is the episode's
//               longest runner (Scenes 5, 7, 12, 15, 22, 26 — six firings, two
//               of them uncorrected). It is a *signed* number of degrees with
//               a snap-back, and it has its own scheduler: `pipLean`.
//   THE LEAF    her first pointer, unlocked in Scene 16. Before it she can
//               only lean at the world; after it she has an arm. `point` is
//               the angle it is held at, and above 14° the leaf BENDS at an
//               elbow to get past her own head — see `ELBOW`, which is what
//               lets Scene 23 aim it at a Sun 56° up instead of settling for
//               a leaf held out at 14°.
//   THE TREMBLE small, fast, on top of the lean — straining against being
//               planted, and later the kitchen at full roar.
//
// Everything here is a pure function of `frame` + `phase`. No refs, no state.

// ---------------------------------------------------------------------------
// The box
// ---------------------------------------------------------------------------

/**
 * Natural SVG box, at `scale` 1. **One number for every growth state**, which
 * is what lets `CHAR_BOX.pip` exist at all: `CharacterFrame` scales about the
 * bottom of this box, so a fixed box with the drawing anchored to its floor
 * means `stand("pip", groundY)` puts her feet on `groundY` whether she is a
 * seed or a young plant. The states differ in how much of the box they fill,
 * never in where the ground is.
 *
 * The consequence is that her *crown* and her *face* are not derivable from
 * the box, which every other body in the kit allows. `pipCrownLocal` and
 * `pipFaceLocal` below are the two functions that replace that assumption, and
 * `scenes/common.tsx` routes bubbles and looks through them.
 */
export const PIP_BOX = 460;

/** Her ground contact, in local units: the bottom edge of the box. */
const GROUND = 230;

/** The seed pod: wider than it is tall, and round at the bottom. */
const POD = { rx: 104, ry: 84 } as const;

/**
 * How high the stem lifts the pod off the ground, per growth state.
 *
 * These are the capability unlocks, not a time-lapse. Each one lands on a
 * scripted beat and buys her something she could not do before:
 *
 *   `seed`     the cold open, in the air. Same pod, fluff fully open.
 *   `planted`  Scene 3. The fluff folds; she is on the dirt and stays there.
 *   `sprout`   Scene 14, on "GERMINATION". Her first height, and her first
 *              leaves are the two round cotyledons at the pod's base.
 *   `leaf`     Scene 16. The first TRUE leaf unfurls: somewhere to cook, and
 *              her first pointer.
 *   `young`    Scene 24 onward. Five leaves, a real stem, taller than the
 *              sprout row she is standing in.
 */
export type PipState = "seed" | "planted" | "sprout" | "leaf" | "young";

const STATE_ORDER: readonly PipState[] = [
  "seed",
  "planted",
  "sprout",
  "leaf",
  "young",
] as const;

const STEM: Record<PipState, number> = {
  seed: 0,
  planted: 0,
  sprout: 132,
  leaf: 152,
  young: 252,
};

/**
 * How open the parachute is, per state.
 *
 * **She keeps a remnant of it forever, and that is a design call rather than
 * botany.** A real pappus blows off; this one folds down into a ruff around
 * her shoulders and shrinks as she grows. The alternative — losing it at
 * germination — was rejected because the fluff is 60% of her silhouette, and a
 * hero whose outline changes completely halfway through the episode is two
 * characters. The ruff also does a second job: it is the thing that is
 * visibly *smaller* every time she grows, which is how a still reads "later".
 */
const FLUFF: Record<PipState, number> = {
  seed: 1,
  planted: 0.18,
  sprout: 0.15,
  leaf: 0.13,
  young: 0.08,
};

/** True leaves (not counting the two cotyledons), per state. */
const LEAVES: Record<PipState, number> = {
  seed: 0,
  planted: 0,
  sprout: 0,
  leaf: 1,
  young: 5,
};

/** Cotyledons — the two round seed-leaves — appear with the sprout. */
const COTYLEDONS: Record<PipState, number> = {
  seed: 0,
  planted: 0,
  sprout: 1,
  leaf: 1,
  young: 0.25,
};

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

/**
 * Her colours. Warm oat against a green field and a blue sky: the two things
 * she is going to spend fifteen minutes standing in front of are both *cool*,
 * so the one warm value in the frame is the hero.
 *
 * Deliberately not `kidTheme.sun`: Sunny is the other end of every scene she is
 * in, and a gold seed shouting at a gold sun is one colour having an argument
 * with itself.
 */
export const PIP_COLOR = {
  seed: "#f3ddb0",
  seedShade: "#dcbe83",
  seedDeep: "#c0995c",
  fluff: kidTheme.paper,
  fluffEdge: "#e2d7bf",
  stem: kidTheme.grass,
  stemDark: kidTheme.grassDark,
  leaf: "#63d16b",
  leafDark: "#2f8c40",
} as const;

// ---------------------------------------------------------------------------
// Geometry helpers — what a scene needs that the box cannot tell it
// ---------------------------------------------------------------------------

function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u;
}

function clamp01(u: number): number {
  return u < 0 ? 0 : u > 1 ? 1 : u;
}

/** The state before this one, for a growth morph. `seed` morphs from itself. */
function previousState(state: PipState): PipState {
  const i = STATE_ORDER.indexOf(state);
  return STATE_ORDER[Math.max(0, i - 1)];
}

/**
 * The blended shape numbers for a state part-way through arriving.
 *
 * `morph` is 0..1 through the transition *into* `state`. At 1 (the default)
 * nothing is blended and this is a table lookup.
 */
function shapeOf(state: PipState, morph: number): {
  stem: number;
  fluff: number;
  leaves: number;
  cotyledons: number;
} {
  const u = kidEase.easeInOutSine(clamp01(morph));
  const prev = previousState(state);
  return {
    stem: lerp(STEM[prev], STEM[state], u),
    fluff: lerp(FLUFF[prev], FLUFF[state], u),
    leaves: lerp(LEAVES[prev], LEAVES[state], u),
    cotyledons: lerp(COTYLEDONS[prev], COTYLEDONS[state], u),
  };
}

/** Local y of the pod's centre. Everything on her hangs off this. */
function podLocal(state: PipState, morph = 1): number {
  return GROUND - POD.ry - shapeOf(state, morph).stem;
}

/**
 * **Local y of her face**, measured from the centre of the box — i.e. the
 * number `faceOf`/`markCentre` wants, and therefore what every other
 * character's eyes aim at.
 *
 * It is a *function* rather than the kit's usual static `faceOffset` because
 * her face is 250 units higher at the end of the episode than at the start.
 * `scenes/common.tsx` binds the static entry to `planted` — where she spends
 * the cold open and the whole of Acts One and Two — and routes anything that
 * needs to be right in the later states through `pipCentre`.
 */
export function pipFaceLocal(state: PipState, morph = 1): number {
  return podLocal(state, morph) - 12;
}

/**
 * **Local y of the top of the drawing** — the crown a bubble has to clear.
 *
 * Includes the fluff, which is the whole reason this is not `-PIP_BOX / 2`: a
 * seed's parachute is half her height and a bubble parked over the box would
 * float a hundred and fifty pixels above her.
 */
export function pipCrownLocal(state: PipState, morph = 1): number {
  const shape = shapeOf(state, morph);
  const pod = podLocal(state, morph);
  // The tallest filament is the middle one, which stands straight up when the
  // crown is open and stays nearly upright when it folds.
  return pod - POD.ry * 0.86 - filamentLength(5, shape.fluff);
}

// ---------------------------------------------------------------------------
// THE LEAN — the episode's longest runner, as a scheduler
// ---------------------------------------------------------------------------

/**
 * One firing of the lean.
 *
 * The runner's shape, every time, is: **her stem drifts toward the light all
 * by itself, and she puts it back.** The drift is slow and involuntary (it is
 * her body voting against her attitude); the snap is fast and deliberate. Two
 * of the six firings have no snap at all — Scene 22 ("This time, she let it")
 * and Scene 26 ("fully, and she leaves it there. Permanent.") — and those are
 * the runner resolving, silently, in the body rather than in a line.
 */
export type LeanFiring = {
  /** Frame the drift starts, on the scene's own clock. */
  at: number;
  /**
   * Signed target, in degrees. **Positive leans toward camera-right.** Aim it
   * at wherever the light is: the whole gag is that the direction is not hers.
   */
  to: number;
  /** Frame she puts it back. Omit for a lean she never corrects. */
  snapAt?: number;
  /** Frames the involuntary drift takes. Slow on purpose. */
  drift?: number;
  /** Frames the correction takes. Fast on purpose. */
  snap?: number;
};

/** How long the body takes to drift over: ~0.9s, well under a conscious move. */
export const LEAN_DRIFT_FRAMES = 26;
/** How long she takes to put it back: ~0.23s, and it rings. */
export const LEAN_SNAP_FRAMES = 7;
/** The lean she settles into when it is finally allowed to stay (Scene 26). */
export const LEAN_FULL = 15;

/**
 * The lean, in degrees, at `frame` — the whole runner as one pure function.
 *
 *   const lean = pipLean(frame, [
 *     { at: driftFrom, to: 12, snapAt: snapFrom },   // Scene 5, corrected
 *     { at: letGo, to: LEAN_FULL },                  // Scene 26, permanent
 *   ]);
 *
 * Firings must be in ascending `at` order. Each one starts from whatever the
 * last one left behind, so a scene that leans twice does not snap through
 * upright on the way — which is the part a hand-written `interpolate` chain
 * gets wrong every time.
 *
 * The snap-back overshoots a couple of degrees past upright and rings down
 * (`settleWave`), because a correction that eases to a stop reads as a second,
 * slower drift rather than as somebody catching themselves.
 */
export function pipLean(frame: number, firings: LeanFiring[], resting = 0): number {
  let value = resting;
  for (const fire of firings) {
    const drift = fire.drift ?? LEAN_DRIFT_FRAMES;
    const snapFrames = fire.snap ?? LEAN_SNAP_FRAMES;
    if (frame < fire.at) break;
    const from = value;
    const drifted = lerp(from, fire.to, kidEase.easeInOutSine((frame - fire.at) / drift));
    if (fire.snapAt === undefined) {
      value = drifted;
      continue;
    }
    if (frame < fire.snapAt) {
      value = drifted;
      continue;
    }
    // Where she was when she noticed. Sampling the drift at `snapAt` rather
    // than assuming it had finished is what keeps a short firing (noticed
    // early) from jumping to full lean on the frame she corrects it.
    const caught = lerp(from, fire.to, kidEase.easeInOutSine((fire.snapAt - fire.at) / drift));
    const u = (frame - fire.snapAt) / snapFrames;
    const back = lerp(caught, resting, kidEase.easeOutCubic(u));
    // The ring-out: a couple of degrees the other way, dying inside half a
    // second. Signed against the lean, so she rebounds *through* upright.
    const ring = -Math.sign(caught) * 2.6 * settleWave((frame - fire.snapAt) / 18, 1.3, 4.2);
    value = u >= 1 ? resting + ring : back + ring * kidEase.easeOutQuad(u);
  }
  return value;
}

// ---------------------------------------------------------------------------
// The fluff
// ---------------------------------------------------------------------------

const FILAMENTS = 11;

/** Filament `i`'s position across the fan, -1 (far left) .. +1 (far right). */
function filamentSpread(i: number): number {
  return (i / (FILAMENTS - 1) - 0.5) * 2;
}

/**
 * Filament angle in degrees, 0 straight up, positive toward camera-right.
 *
 * Open, the fan spans ±78° — wide enough that the crown is visibly *wider*
 * than the pod, which is what makes the silhouette a dandelion clock rather
 * than a hairdo. Folded, it collapses to ±128°, so the outer filaments hang
 * below the pod's shoulders as a ruff while the middle ones stay up as a tuft.
 * Nothing about the fold is a fade: every strand is in both pictures.
 */
function filamentAngle(i: number, fluff: number): number {
  const s = filamentSpread(i);
  // The fold is deliberately NOT the open fan scaled down. A linear squeeze
  // leaves the middle strands pointing up and out at even angles, which drew a
  // sea urchin: every strand still radiating, just shorter. A folded parachute
  // is the opposite shape — almost everything swept *past* horizontal into a
  // ruff, with one strand left standing up in the middle — so the folded map
  // jumps to 112° at the first strand off centre and ramps to 174° at the
  // edge. The centre strand (s = 0) is the exception and stays vertical.
  const folded = s === 0 ? 0 : Math.sign(s) * (112 + 62 * Math.abs(s));
  return lerp(folded, s * 78, clamp01(fluff));
}

/**
 * Filament length. Folded, the outer strands shorten much harder than the
 * inner ones — a collapsed parachute is a *ruff* around the shoulders with a
 * tuft still standing up in the middle, and equal-length strands at ±152° drew
 * a pair of horns instead.
 */
function filamentLength(i: number, fluff: number): number {
  const s = Math.abs(filamentSpread(i));
  const f = clamp01(fluff);
  // Two different shapes rather than one scaled: OPEN is a dome (longest in
  // the middle, tapering to the rim), FOLDED is a ruff (shortest in the
  // middle, longest at the edges where the collar hangs). Interpolating
  // between them is what makes the fold a *fold* rather than a shrink.
  const folded = 26 + 56 * s;
  const open = 142 * (1 - 0.22 * s);
  return lerp(folded, open, f);
}

const Fluff: React.FC<{
  /** Local centre of the pod. */
  cy: number;
  fluff: number;
  /** Seconds, for the waft. */
  t: number;
  phase: number;
  /** The lagged breath, so the crown arrives after the body does. */
  trail: number;
}> = ({ cy, fluff, t, phase, trail }) => {
  const f = clamp01(fluff);
  if (f <= 0.02) return null;
  const crown = cy - POD.ry * 0.86;
  return (
    <g>
      {/* The soft mass. At a wide shot's 0.4 scale the eleven strands are two
          pixels each and the fluff would vanish; this is what stays. It is
          kept well under the strands' opacity so it never becomes a balloon. */}
      {f > 0.35 ? (
        <ellipse
          cx={0}
          cy={crown - filamentLength(5, f) * 0.52}
          rx={filamentLength(0, f) * 1.02}
          ry={filamentLength(0, f) * 0.86}
          fill={PIP_COLOR.fluff}
          opacity={0.26 * f}
        />
      ) : null}
      {Array.from({ length: FILAMENTS }, (_, i) => {
        // Each strand wafts on its own clock, and four frames behind the body.
        const waft = Math.sin(t * 1.15 + phase + i * 0.71) * 5.4 * f + trail * 0.055;
        const a = ((filamentAngle(i, f) + waft) * Math.PI) / 180;
        const len = filamentLength(i, f);
        const dx = Math.sin(a);
        const dy = -Math.cos(a);
        // **Where the strand is rooted, and it moves as the parachute folds.**
        // Open, every filament comes off the crown, which is what a dandelion
        // clock is. Folded, they slide round onto the pod's shoulders — because
        // rooted at the crown a folded strand is 35 units long pointing
        // *downwards from the top of her head*, which is entirely inside the
        // pod and therefore invisible. The whole ruff was missing on the first
        // sheet for exactly that reason.
        const edgeX = dx * POD.rx * 0.88;
        const edgeY = cy - Math.cos(a) * POD.ry * 0.88;
        const rootX = lerp(edgeX, 0, f);
        const rootY = lerp(edgeY, crown, f);
        const tipX = rootX + dx * len;
        // A folded strand hangs *down*, and her pod bottom is the ground line,
        // so an unclamped ruff puts three filaments underground. Clamped, the
        // lowest ones lie along the dirt, which is what a collapsed parachute
        // on the ground actually does.
        const tipY = Math.min(rootY + dy * len, GROUND - 8);
        // A gentle bow away from the axis, so the crown is a dome rather than
        // a starburst: nothing on a plant is dead straight.
        const bow = -dx * len * 0.16;
        const midX = rootX + dx * len * 0.5 + bow;
        const midY = rootY + dy * len * 0.5;
        return (
          <g key={i}>
            <path
              d={`M ${rootX.toFixed(1)} ${rootY.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}`}
              stroke={PIP_COLOR.fluffEdge}
              strokeWidth={4.5}
              strokeLinecap="round"
              fill="none"
            />
            {/* The feather at the tip: two barbs and a soft head. Together
                they blur into a fuzzy end at any size a scene will use. */}
            <g transform={`translate(${tipX.toFixed(1)} ${tipY.toFixed(1)})`}>
              <ellipse
                rx={7 + 9 * f}
                ry={5 + 7 * f}
                fill={PIP_COLOR.fluff}
                opacity={0.92}
              />
              <path
                d={`M ${-6 - 7 * f} ${-4 - 4 * f} L 0 0 L ${6 + 7 * f} ${-4 - 4 * f}`}
                stroke={PIP_COLOR.fluff}
                strokeWidth={3.5}
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Leaves
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// THE POINTER'S ELBOW — how a leaf shorter than her head points above her head
// ---------------------------------------------------------------------------

/**
 * **Below this angle the pointer is the drawing it always was, to the byte.**
 *
 * The rig's original problem, written down in `act3.tsx`'s own analysis and now
 * obsolete: the pointer is the topmost true leaf, its node sits 56 local units
 * under the pod's bottom edge, the leaf is 150 long, the pod is 208 across and
 * leaves are drawn BEHIND the pod. A straight leaf raised past ~14° therefore
 * walks its own tip into her cheek — at 56° (the angle Scene 23's Sun actually
 * sits at) the tip is *inside* the pod ellipse and the gesture reads as a
 * collar. Fourteen degrees was the whole usable range, and 14° is barely
 * distinguishable from rest.
 *
 * Above 14° the leaf now bends. `POINT_ELBOW_FROM` is the threshold and
 * `POINT_ELBOW_FULL` is where the bend is fully engaged; in between the joint
 * is interpolated, so a ramp *through* the threshold has no kink in it. At or
 * below the threshold — and at every negative angle down to the −24° floor the
 * acts clamp to — `Leaf` takes the same branch, builds the same path string and
 * hangs it off the same `rotate()` transform as before this existed.
 */
const POINT_ELBOW_FROM = 14;
const POINT_ELBOW_FULL = 40;

/**
 * The elbow's geometry, and every number in it is paid for by the pod.
 *
 *   `baseAngle`  the first run goes out at 12°, nearly flat, because the thing
 *                it has to do is get OUT before it goes UP. Everything that
 *                climbs early climbs into her cheek.
 *   `baseFrac`   0.36 of the leaf — 68 units at full bend, putting the joint
 *                at (67, 117) local, which is 39 units *below* the pod's
 *                bottom edge. **The joint deliberately does NOT clear the
 *                pod's 104-unit rim laterally**, and it does not have to:
 *                there is no pod at that height. What has to clear the pod is
 *                the blade's upper edge as it comes round, and the measured
 *                test below is the one that matters. Longer base runs are
 *                safer and *worse*: at 0.6 the tip only gets 78 units above
 *                its rest height, at 0.36 it gets 107, and a gesture reads on
 *                how far it moved.
 *   `tailFrac`   at least 45% of what is left after the base is a STRAIGHT run
 *                at the angle she asked for. That straight run is the part
 *                that reads as aim: the first pass spent the whole budget on
 *                the arc and drew a curl.
 *   `rPref`/`rMin`  the joint is a CURVE, not a hinge: she is a plant. 90 is
 *                the radius it prefers; 78 is the tightest it will bend,
 *                which is what stops the blade pinching into a cusp on the
 *                inside of the turn. That floor is also the rig's real aim
 *                limit — 12° plus the 49.1° the arc budget buys at r=78 =
 *                **61.1°** — and a `point` above it saturates there rather
 *                than kinking. Scene 23's Sun is at 56.5°, which is the number
 *                this was solved for; Scene 16's 78° comes out at 61.1.
 *   `lenGain`/`lenCap`  the bent leaf reaches 40 units further than the
 *                straight one (190 total) so the tip still ends up somewhere,
 *                capped so it stays a leaf rather than becoming an arm.
 *
 * Measured (`scratchpad/ep4b3_pointer/geom.mjs`, which mirrors this file, blade
 * slimming included). In the `leaf` state — every raised pointer in episode
 * four — the tip is outside the pod at EVERY angle, and the share of the blade
 * outline inside the pod is 0% at 26° and above, ≤3% at 18–22°. A straight leaf
 * buries its tip from ~48° up and a third of its blade from 20°.
 *
 * (The `young` plant's top node sits 13 units under the pod rather than 56, so
 * a third of that leaf overlaps the pod at ANY angle including rest — 33% at
 * 14°, 34% at 60°. Pre-existing, unchanged by the elbow, and academic: nothing
 * in the episode points the young pointer above 14°.)
 */
const ELBOW = {
  baseAngle: 12,
  baseFrac: 0.36,
  tailFrac: 0.45,
  rPref: 90,
  rMin: 78,
  lenGain: 40,
  lenCap: 190,
} as const;

/**
 * The bent leaf's spine: an arc-length parameterised curve from the node out.
 *
 * A straight run at `a1`, a constant-radius turn, then a straight run at the
 * angle it was asked for. It is written as an integral of the tangent rather
 * than as a Bézier for one reason: at `bend` 0 it collapses **exactly** onto
 * `s ↦ (s cos θ, −s sin θ)`, which is what `rotate(-angle)` does to the flat
 * profile, so the drawing is continuous across the threshold instead of
 * jumping onto a differently-parameterised curve.
 */
function elbowSpine(angle: number, L: number, bend: number) {
  const total = lerp(L, Math.min(ELBOW.lenCap, L + ELBOW.lenGain), bend);
  const a1 = (lerp(angle, ELBOW.baseAngle, bend) * Math.PI) / 180;
  const base = total * ELBOW.baseFrac;
  const budget = (total - base) * (1 - ELBOW.tailFrac);
  // How far it is allowed to turn: what was asked for, or what the tightest
  // honest radius can buy out of the length that is left.
  const turn = Math.min(Math.max(0, (angle * Math.PI) / 180 - a1), budget / ELBOW.rMin);
  const r = turn > 1e-6 ? Math.min(ELBOW.rPref, budget / turn) : 0;
  const arc = r * turn;
  const a2 = a1 + turn;
  const jx = base * Math.cos(a1);
  const jy = -base * Math.sin(a1);
  const ex = jx + r * (Math.sin(a2) - Math.sin(a1));
  const ey = jy + r * (Math.cos(a2) - Math.cos(a1));
  /** The point `n` units off the spine's left-hand normal, `s` along it. */
  const at = (s: number, n: number): { x: number; y: number } => {
    let x: number;
    let y: number;
    let th: number;
    if (s <= base) {
      th = a1;
      x = s * Math.cos(a1);
      y = -s * Math.sin(a1);
    } else if (s <= base + arc) {
      th = a1 + (s - base) / r;
      x = jx + r * (Math.sin(th) - Math.sin(a1));
      y = jy + r * (Math.cos(th) - Math.cos(a1));
    } else {
      th = a2;
      const k = s - base - arc;
      x = ex + k * Math.cos(a2);
      y = ey - k * Math.sin(a2);
    }
    return { x: x + n * Math.sin(th), y: y + n * Math.cos(th) };
  };
  return { total, at };
}

/**
 * One leaf, drawn pointing along +x from its own origin, then rotated.
 *
 * `grow` scales it out of nothing at the node — Scene 16 unfurls one of these
 * in real time and the audience has to see it *become* a leaf, so it opens
 * width-first (a rolled leaf unrolls) rather than scaling uniformly.
 *
 * `elbow` bends it (see `ELBOW`). At 0 — every leaf that is not the pointer,
 * every pointer at or below `POINT_ELBOW_FROM`, and both cotyledons — this
 * function is the one it always was: same path string, same transform.
 */
const Leaf: React.FC<{
  x: number;
  y: number;
  /** Degrees from horizontal; negative points up. */
  angle: number;
  side: -1 | 1;
  length: number;
  grow: number;
  /** Toothed edge — the dandelion tell. Off on the cotyledons. */
  toothed?: boolean;
  /** 0..1, how far the pointer's joint is engaged. 0 = today's flat leaf. */
  elbow?: number;
}> = ({ x, y, angle, side, length, grow, toothed = true, elbow = 0 }) => {
  const g = clamp01(grow);
  if (g <= 0.01) return null;
  const L = length * (0.34 + 0.66 * g);
  const w = length * 0.3 * g;
  const bend = clamp01(elbow);
  if (bend <= 0) {
    const d = toothed
      ? `M 0 0 Q ${L * 0.22} ${-w} ${L * 0.42} ${-w * 0.72}` +
        ` Q ${L * 0.5} ${-w * 1.15} ${L * 0.66} ${-w * 0.78}` +
        ` Q ${L * 0.78} ${-w * 1.05} ${L} 0` +
        ` Q ${L * 0.78} ${w * 1.05} ${L * 0.66} ${w * 0.78}` +
        ` Q ${L * 0.5} ${w * 1.15} ${L * 0.42} ${w * 0.72}` +
        ` Q ${L * 0.22} ${w} 0 0 Z`
      : `M 0 0 Q ${L * 0.45} ${-w * 1.05} ${L} 0 Q ${L * 0.45} ${w * 1.05} 0 0 Z`;
    return (
      <g transform={`translate(${x} ${y}) scale(${side} 1) rotate(${-angle})`}>
        <path
          d={d}
          fill={PIP_COLOR.leaf}
          stroke={kidTheme.ink}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <path
          d={`M ${L * 0.06} 0 L ${L * 0.88} 0`}
          stroke={PIP_COLOR.leafDark}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.8}
          fill="none"
        />
      </g>
    );
  }
  // Bent. The SAME profile — the same fractions of the length, the same
  // multiples of the width, the same toothed bumps — laid along the spine
  // instead of along the x axis, so it is one leaf with a bend in it rather
  // than a second prop. The rotation is baked into the spine, which is why
  // this branch's group has no `rotate()`.
  const spine = elbowSpine(angle, L, bend);
  const T = spine.total;
  // **A raised leaf is a NARROWER leaf, and that is the one place the bend
  // touches the blade rather than just its spine.** At rest the blade is 90
  // across on a 150 spine; laid along a turn of radius ~87 at that width the
  // outer edge balloons and the inner edge compresses, and the first pass drew
  // a boxing glove. Slimmed 30% it is the same leaf cocked over — a plant
  // lifting a blade turns it, so it is also what one looks like — and the
  // direction the tip is aiming becomes legible, which is the whole gesture.
  const bw = w * (1 - 0.3 * bend);
  const p = (s: number, n: number): string => {
    const q = spine.at(s, n);
    return `${q.x.toFixed(2)} ${q.y.toFixed(2)}`;
  };
  const d = toothed
    ? `M ${p(0, 0)} Q ${p(T * 0.22, -bw)} ${p(T * 0.42, -bw * 0.72)}` +
      ` Q ${p(T * 0.5, -bw * 1.15)} ${p(T * 0.66, -bw * 0.78)}` +
      ` Q ${p(T * 0.78, -bw * 1.05)} ${p(T, 0)}` +
      ` Q ${p(T * 0.78, bw * 1.05)} ${p(T * 0.66, bw * 0.78)}` +
      ` Q ${p(T * 0.5, bw * 1.15)} ${p(T * 0.42, bw * 0.72)}` +
      ` Q ${p(T * 0.22, bw)} ${p(0, 0)} Z`
    : `M ${p(0, 0)} Q ${p(T * 0.45, -bw * 1.05)} ${p(T, 0)} Q ${p(T * 0.45, bw * 1.05)} ${p(0, 0)} Z`;
  // The midrib follows the bend, sampled rather than solved: at stroke width 5
  // an eight-segment polyline through a 46° turn is a curve.
  const vein = Array.from({ length: 9 }, (_, i) =>
    p(T * (0.06 + (0.82 * i) / 8), 0),
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${side} 1)`}>
      <path
        d={d}
        fill={PIP_COLOR.leaf}
        stroke={kidTheme.ink}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      <path
        d={`M ${vein.join(" L ")}`}
        stroke={PIP_COLOR.leafDark}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
        fill="none"
      />
    </g>
  );
};

// ---------------------------------------------------------------------------
// The component
// ---------------------------------------------------------------------------

export type PipProps = CharacterProps & {
  /** Which capability she has unlocked. Defaults to `planted`. */
  state?: PipState;
  /** 0..1 through the transition *into* `state`; 1 (settled) by default. */
  morph?: number;
  /**
   * **Signed lean in degrees, positive toward camera-right.** Feed it
   * `pipLean(frame, …)`; a bare number is fine for a scene that holds one.
   */
  lean?: number;
  /**
   * 0..1. Fast, small, on top of the lean: straining against being planted
   * (Scene 3), and the kitchen at full roar (Scene 24).
   */
  tremble?: number;
  /**
   * **The pointer.** Degrees from horizontal, positive up, for the top true
   * leaf. `undefined` leaves every leaf at rest — which is the only correct
   * value before Scene 16, because before Scene 16 she does not have one.
   */
  point?: number;
  /** Which side the pointer leaf is on. */
  pointSide?: "left" | "right";
  /** Override the parachute (0 folded .. 1 open); defaults to the state's. */
  fluff?: number;
  /** Ground contact shadow. Off in the air. */
  shadow?: boolean;
};

export const Pip: React.FC<PipProps> = (props) => {
  const rig = useRig(props);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = props.state ?? "planted";
  const morph = props.morph ?? 1;
  const shape = shapeOf(state, morph);
  const fluff = props.fluff ?? shape.fluff;
  const shadow = props.shadow ?? state !== "seed";
  const t = frame / fps;
  const phase = props.phase ?? 0;

  // The lean, plus the tremble on top of it. Both are rotations about her
  // BASE — a plant bends at the ground, not at the waist, and rotating about
  // the centre would lift her out of her own dirt.
  const tremble = props.tremble ?? 0;
  const lean =
    (props.lean ?? 0) + tremble * Math.sin(t * Math.PI * 2 * 9.4 + phase * 3.1) * 1.9;

  const pod = podLocal(state, morph);
  const stemTop = pod + POD.ry * 0.5;

  // Leaves. The pointer is the top one; the rest keep their rest angle, which
  // droops slightly under its own weight (nothing on a plant is horizontal).
  const nodes = LEAF_NODES.slice(0, Math.ceil(shape.leaves));
  const pointing = props.point;
  const pointSide = props.pointSide === "left" ? -1 : 1;
  // The elbow, and ONLY the pointer has one: a resting leaf, a cotyledon and a
  // pointer held at or under `POINT_ELBOW_FROM` all take `Leaf`'s original
  // branch. Blended continuously with the angle, so a ramp through the
  // threshold bends rather than snapping.
  const pointerBend =
    pointing === undefined
      ? 0
      : clamp01((pointing - POINT_ELBOW_FROM) / (POINT_ELBOW_FULL - POINT_ELBOW_FROM));
  const pointerNode = nodes.length > 0 ? nodes[nodes.length - 1] : undefined;
  const pointerNodeY = pointerNode
    ? lerp(GROUND - 24, stemTop + 14, pointerNode.u)
    : 0;

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={PIP_BOX}
      height={PIP_BOX}
      viewBox={`${-PIP_BOX / 2} ${-PIP_BOX / 2} ${PIP_BOX} ${PIP_BOX}`}
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      {shadow ? (
        <ellipse
          cx={0}
          cy={GROUND + 6}
          rx={POD.rx * 0.86}
          ry={15}
          fill={kidTheme.ink}
          opacity={0.15}
        />
      ) : null}
      {/* Everything above the dirt bends together, about the ground. */}
      <g transform={`rotate(${lean.toFixed(2)} 0 ${GROUND})`}>
        {/* Stem first: it is behind everything. Then the fluff, so the leaves
            draw *over* the ruff rather than having white filaments lying
            across them — on the young plant the top leaf and the collar share
            a lot of frame and the leaf is the one in front. */}
        {shape.stem > 1 ? <Stem top={stemTop} lean={lean} /> : null}
        <Fluff cy={pod} fluff={fluff} t={t} phase={phase} trail={rig.trail.dy} />
        {nodes.map((node, i) => {
          const nodeY = lerp(GROUND - 24, stemTop + 14, node.u);
          if (nodeY > GROUND - 10) return null;
          const grow = clamp01((shape.leaves - i) * 1.4);
          const isPointer = i === nodes.length - 1;
          // A RAISED pointer is drawn later, over the cotyledons — see below.
          if (isPointer && pointerBend > 0) return null;
          const side: -1 | 1 = isPointer ? (pointSide as -1 | 1) : node.side;
          const rest = node.angle;
          const angle = isPointer && pointing !== undefined ? pointing : rest;
          return (
            <Leaf
              key={i}
              x={0}
              y={nodeY}
              angle={angle}
              side={side}
              length={node.length}
              grow={grow}
            />
          );
        })}
        {/* The two cotyledons: round, plain-edged, and at the pod's shoulders
            rather than on the stem — they are the seed's own first leaves and
            they come out of the case, which is what makes germination read. */}
        {shape.cotyledons > 0.02
          ? ([-1, 1] as const).map((s) => (
              <Leaf
                key={s}
                x={s * POD.rx * 0.42}
                y={pod + POD.ry * 0.62}
                angle={-16}
                side={s}
                length={86}
                grow={shape.cotyledons}
                toothed={false}
              />
            ))
          : null}
        {/* **The raised pointer, and it is the one leaf drawn over the seed
            leaves.** A pointer lifted past 14° sweeps its tip up through
            exactly where the camera-right cotyledon hangs, and painted under
            it the gesture came out as one lumpy green mass with no direction
            in it — the tip, which is the whole point of a point, was the part
            underneath. Above them it has an outline. It is still behind the
            POD: her face is never crossed by her own leaf.
            At `pointerBend` 0 this branch does not exist and the leaf is back
            in the map above, in its original z-order — which is what keeps
            every pose at or under 14° the drawing it always was. */}
        {pointerBend > 0 && pointerNode && pointerNodeY <= GROUND - 10 ? (
          <Leaf
            x={0}
            y={pointerNodeY}
            angle={pointing ?? 0}
            side={pointSide as -1 | 1}
            length={pointerNode.length}
            grow={clamp01((shape.leaves - (nodes.length - 1)) * 1.4)}
            elbow={pointerBend}
          />
        ) : null}
        <Pod cy={pod} shine={rig.trail.dy} />
        <Face
          rig={rig}
          x={0}
          y={pod - 12}
          size={1.32}
          eyeScale={1.04}
          skin={PIP_COLOR.seed}
          // Warm pink over warm oat stays a cheek at the default strength —
          // the blush problem in this kit is cold bodies, and she is not one.
          blushStrength={1.1}
        />
      </g>
    </CharacterFrame>
  );
};

/**
 * Where a true leaf can grow, up the stem. `u` is 0 at the ground and 1 at the
 * pod, so the same table works at every stem height — a young plant's leaves
 * are spread up a 252-unit stem and a sprout's would be spread up a 132-unit
 * one, and neither has to know the number.
 *
 * The last entry is always the pointer, which is why the sides alternate
 * *ending* on the right: her pointer leaf is on her camera-right in Scene 16,
 * and it is the same leaf in Scene 23 when she aims it at the Sun.
 */
const LEAF_NODES: readonly {
  u: number;
  side: -1 | 1;
  angle: number;
  length: number;
}[] = [
  // Index order is the order they GROW in; `u` is where they grow. The first
  // one is mid-stem because for eight scenes it is the only leaf she has and a
  // solo leaf at ankle height reads as a shoe. Sorted by height the sides
  // alternate 0.16 R, 0.28 L, 0.46 R, 0.66 L, 0.84 R, which is what stops a
  // five-leaf plant looking like it is falling over.
  { u: 0.46, side: 1, angle: -4, length: 150 },
  { u: 0.28, side: -1, angle: -8, length: 128 },
  { u: 0.66, side: -1, angle: -2, length: 138 },
  { u: 0.16, side: 1, angle: -10, length: 118 },
  { u: 0.84, side: 1, angle: 0, length: 158 },
];

/** The stem: a filled taper, because an SVG stroke cannot get thinner. */
const Stem: React.FC<{ top: number; lean: number }> = ({ top, lean }) => {
  // A hair of S-curve, bowed *against* the lean, so a leaning plant looks like
  // it is being pulled rather than tipped over as one rigid piece.
  const bow = -lean * 0.22;
  const mid = (GROUND + top) / 2;
  return (
    <g>
      <path
        d={
          `M -15 ${GROUND}` +
          ` Q ${-13 + bow} ${mid} -9 ${top}` +
          ` L 9 ${top}` +
          ` Q ${13 + bow} ${mid} 15 ${GROUND} Z`
        }
        fill={PIP_COLOR.stem}
        stroke={kidTheme.ink}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      <path
        d={`M ${-6 + bow * 0.6} ${GROUND - 12} Q ${-5 + bow} ${mid} ${-3} ${top + 10}`}
        stroke={PIP_COLOR.leaf}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.6}
        fill="none"
      />
    </g>
  );
};

/**
 * The seed pod, and the one shape the whole character has to survive being
 * shrunk to.
 *
 * Slightly narrower at the crown than at the base — a seed, not an egg — and
 * flat-filled, because the eyelids are painted over the eyes in this colour
 * (see `Face`'s `skin` note). The two ribs are separate flat shapes kept well
 * clear of the face, which is how depth is done in this kit.
 */
const Pod: React.FC<{ cy: number; shine: number }> = ({ cy, shine }) => {
  const { rx, ry } = POD;
  return (
    <g>
      <path
        d={
          `M ${-rx} ${cy + ry * 0.1}` +
          ` C ${-rx} ${cy - ry * 0.62} ${-rx * 0.62} ${cy - ry} ${0} ${cy - ry}` +
          ` C ${rx * 0.62} ${cy - ry} ${rx} ${cy - ry * 0.62} ${rx} ${cy + ry * 0.1}` +
          ` C ${rx} ${cy + ry * 0.78} ${rx * 0.6} ${cy + ry} ${0} ${cy + ry}` +
          ` C ${-rx * 0.6} ${cy + ry} ${-rx} ${cy + ry * 0.78} ${-rx} ${cy + ry * 0.1} Z`
        }
        fill={PIP_COLOR.seed}
        stroke={kidTheme.ink}
        strokeWidth={8}
        strokeLinejoin="round"
      />
      {/* Ribs: two on the lower flanks, both outside the face's box. */}
      {([-1, 1] as const).map((s) => (
        <path
          key={s}
          d={`M ${s * rx * 0.8} ${cy + ry * 0.2} Q ${s * rx * 0.84} ${cy + ry * 0.5} ${s * rx * 0.58} ${cy + ry * 0.82}`}
          stroke={PIP_COLOR.seedDeep}
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
          opacity={0.9}
        />
      ))}
      {/* One flat highlight on the crown, sliding a couple of pixels on the
          lagged breath so it sits on a surface rather than being painted on. */}
      <ellipse
        cx={-rx * 0.34}
        cy={cy - ry * 0.62 + shine * 1.4}
        rx={rx * 0.24}
        ry={ry * 0.15}
        fill={mixHex(PIP_COLOR.seed, kidTheme.paper, 0.7)}
        opacity={0.75}
        transform={`rotate(-18 ${-rx * 0.34} ${cy - ry * 0.62})`}
      />
    </g>
  );
};
