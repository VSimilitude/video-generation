import React from "react";
import { CharacterFrame, Face, useRig, type CharacterProps, type Rig } from "../Character";
import { kidTheme, mixHex } from "../theme";

// Ray — the hero of episode three. One beam of sunlight, eight minutes old.
//
// The design problem: he is *white*, he spends most of the episode over bright
// painted plates, and the story's whole first act is him being wrong about
// exactly that.
//
// **The body is round-two candidate F2 (Mike, 2026-08-01).** Two rounds of
// redesign were needed to get here and both are worth remembering for the same
// reason: silhouette is read first and detail is read never.
//
//   Round one drew four bodies, and all four were POLAR — a compact rounded
//   mass at one end and a motif tapering away from it at the other. Wave-form,
//   comet, refined lozenge, seven-strand braid: change the tail's texture all
//   you like, head-plus-taper is the sperm silhouette, and a six-year-old sees
//   the silhouette. The lozenge this file used to hold was the same shape.
//
//   Round two took the polarity out at the root: every candidate symmetric
//   about its own centre, the wave extending equally both ways, so there is no
//   end to call the front. F2 is the one Mike picked and the most radical of
//   them: **there is no head at all.** Ray is a set of features floating in a
//   feathered wash of light, hovering over a wave ribbon that is nobody's body
//   — and the face bobs on that wave's centre crest a fifth of a second LATE,
//   which is the only thing joining them. Late is the whole trick: on the same
//   frame the pair welds into a head on a wavy body (a jellyfish); a fifth of a
//   second behind it they are a face that happens to be over a wave and
//   unmistakably belongs to it.
//
// What that buys, and what it costs:
//
//   1. He is a BEAM, not a star, and now the drawing says so without a tail.
//      Sunny is a disc with rays going out in every direction; Ray is a
//      travelling wave with a face over it. Direction of travel is carried by
//      `bank` (the ribbon leans into its own path) and by detached motion
//      dashes — a comics device rather than an anatomy — so he reads with
//      `streak={0}` and nothing about him points anywhere. See `MotionDashes`.
//   2. His legibility is carried by the FEATURES and the light immediately
//      around them, not by an outline. A warm-white body on a cyan sky or a
//      gold sun has almost no value contrast, and F2 has no outline at all to
//      fall back on, so the wash under the features is built as a ten-step ramp
//      that is genuinely opaque where the face is drawn and feathers out over a
//      hundred and fourteen units. That is the F2 mitigation — see `FACE_RAMP`.
//   3. `brightness` is the arc, and nobody mentions it. He plays Act One a
//      little dimmer and plainer — cooler wash, flatter wave, no spectrum in
//      the ribbon — and from Scene 13 he is warmer and fuller with the seven
//      colours faintly visible for the rest of the episode (script.md, Scene
//      13: "Nobody ever says a word about that"). A scene that wants him more
//      readable darkens what is *behind* him rather than moving the number.
//
// The seven colours he comes apart into are `RayShard` at the foot of this
// file: the same face on the same wave, each taking one hue *and one
// wavelength* — the frequency ladder, the other half of the 2026-08-01
// revision, documented down there. The split itself is **staged motion in the
// scene**, not a mutation of this component — seven shards fade up along an arc
// as Ray fades down, so any frame renders alone and the whole beat is a pure
// function of the frame like everything else.

/** Natural SVG box height, for an episode's `CHAR_BOX`. */
export const RAY_BOX = 320;
/** Natural SVG box height of one colour shard. */
export const RAY_SHARD_BOX = 200;

const W = 380;
const H = RAY_BOX;

/** The warm white he is made of. Flat — see the `skin` note in Character.tsx. */
const CORE = "#fffdf2";
const CORE_WARM = "#fff5d8";
const GLOW = kidTheme.sunLight;
const EDGE = kidTheme.sunDeep;
/** The cool white of a beam who thinks he is the plain one. */
const CORE_COOL = "#e9f0f8";
/** The whisper of warmth the wash has left at zero. */
const RING_COOL = "#eef2f7";
const RING_HOT = "#ffeec2";

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

type Pt = [number, number];

/**
 * The seven, in order, red on the outside through to violet.
 *
 * Saturated enough to be *named* by a six-year-old at a glance and to survive a
 * painted plate behind them, and spaced so that adjacent pairs (yellow/green,
 * indigo/violet) are still two colours rather than one gradient — the roll call
 * in Scene 10 asks the audience to count seven, so seven is what has to be
 * countable. `deep` is each one's outline; `light` its inner highlight.
 */
export const SPECTRUM = [
  { name: "Red", fill: "#ff5b4c", light: "#ff9184", deep: "#b8332a" },
  { name: "Orange", fill: "#ff9a2e", light: "#ffc172", deep: "#bf6205" },
  { name: "Yellow", fill: "#ffd23c", light: "#ffea92", deep: "#bd8f06" },
  { name: "Green", fill: "#4fc85c", light: "#8fe396", deep: "#2a8134" },
  { name: "Blue", fill: "#3aa0ec", light: "#8ccbf5", deep: "#17679f" },
  { name: "Indigo", fill: "#5a5fd6", light: "#9195e8", deep: "#2f3592" },
  { name: "Violet", fill: "#a86bff", light: "#c9a4ff", deep: "#6a34b8" },
] as const;

export type SpectrumColor = (typeof SPECTRUM)[number];

export type RayPose = "rest" | "wave" | "cheer" | "point" | "brace" | "hug";

export type RayProps = CharacterProps & {
  /**
   * **The arc.** 0..1. Act One's sulk sits around 0.6 (cooler wash, flatter
   * wave); from Scene 13 he is 1. Never animate this to make him easier to see
   * — darken what is behind him instead.
   */
  brightness?: number;
  /**
   * How much of the seven is visible in his ribbon, 0..1. Zero for the whole
   * of Act One; a low number (~0.5) from Scene 13 onward. It is *faint* on
   * purpose: the script mandates the detail and forbids anybody mentioning it,
   * so it has to be findable and never announced.
   */
  spectrum?: number;
  /**
   * Banking angle in degrees, for a character in flight. Feed it
   * `moveAlong(...).angle` and he leans into his own path. He travels more than
   * anyone in the series, so this is the prop that gets used — and on a body
   * with no front it is now carrying real weight rather than decorating.
   */
  bank?: number;
  /** Motion dashes, 0..1. 0 for a Ray sitting still. */
  streak?: number;
  arms?: boolean;
  pose?: RayPose;
  /** Wave size 0..1, for `pose="wave"`. */
  wave?: number;
  /** Outline colour. Override to `kidTheme.ink` when staged against gold. */
  edge?: string;
  /** Whole-character alpha, for a fade in a split/merge. */
  opacity?: number;
};

// --- geometry ---------------------------------------------------------------

/**
 * `|x|`, with the corner taken off the origin.
 *
 * Ray's own wave is a function of the distance from the centre, which is what
 * makes it mirror-symmetric — but `Math.abs` has a kink at zero, the ribbon's
 * normal flips across it, and the offset outline sprouts a small horn out of
 * the middle of the crest on every frame. `hypot(x, soft) - soft` is the same
 * function everywhere that matters and has zero slope at the centre, which is
 * exactly where the ribbon is fattest and least forgiving.
 */
const evenX = (x: number, soft = 26): number => Math.hypot(x, soft) - soft;

/** Quadratic-midpoint smoothing through sample points, as one closed path. */
function smoothClosed(pts: Pt[]): string {
  const n = pts.length;
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const f = (p: Pt): string => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M ${f(mid(pts[n - 1], pts[0]))}`;
  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    d += ` Q ${f(cur)} ${f(mid(cur, next))}`;
  }
  return `${d} Z`;
}

/**
 * A closed ribbon around a centreline with a per-sample half width, and round
 * caps at BOTH ends.
 *
 * Round caps at both ends is the point rather than a detail: a ribbon capped
 * one way and pointed the other is exactly the polar shape round one kept
 * accidentally drawing.
 */
function ribbonPath(pts: Pt[], half: number[], capSteps = 7): string {
  const n = pts.length;
  const norm: Pt[] = pts.map((_, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const L = Math.hypot(tx, ty) || 1;
    return [-ty / L, tx / L];
  });
  const side = (s: 1 | -1): Pt[] =>
    pts.map((p, i) => [p[0] + s * norm[i][0] * half[i], p[1] + s * norm[i][1] * half[i]]);
  const cap = (idx: number, dir: 1 | -1): Pt[] => {
    const c = pts[idx];
    const r = half[idx];
    const [nx, ny] = norm[idx];
    const tx = ny * dir;
    const ty = -nx * dir;
    const out: Pt[] = [];
    for (let k = 1; k < capSteps; k++) {
      const a = (k / capSteps) * Math.PI;
      out.push([
        c[0] + Math.cos(a) * nx * r + Math.sin(a) * tx * r,
        c[1] + Math.cos(a) * ny * r + Math.sin(a) * ty * r,
      ]);
    }
    return out;
  };
  return smoothClosed([
    ...side(1),
    ...cap(n - 1, 1),
    ...side(-1).reverse(),
    ...cap(0, -1).reverse(),
  ]);
}

// --- the wave he is over ----------------------------------------------------

/**
 * Half-span of Ray's own ribbon, in local units.
 *
 * Longer than the workbench drew it (196 against 172) and it is a legibility
 * number rather than a taste one. F2's face needs a genuinely opaque field
 * under it — see `FACE_RAMP` — and an opaque field is a big pale oval, so the
 * first shipped pass came out as a *ball with a squiggle under it*: F1 by
 * accident, which is the one thing the round-two decision was against. The
 * wave has to out-measure the face or it stops being the body. At 196 the
 * ribbon is over twice the face's solid width and the pair reads as it
 * was chosen to.
 */
const F_L = 196;
/** Wavelength of Ray's ribbon. He is the white one: one middling frequency. */
const F_LAM = 128;
const F_HZ = 0.5;
/** Where the ribbon sits, in local units, before `FIT`. */
const F_WAVE_Y = 66;

const fAmp = (u: number): number => 18 + 24 * u ** 1.25;
const fY = (x: number, t: number): number =>
  fAmp(Math.min(1, evenX(x) / F_L)) *
  Math.cos((2 * Math.PI * evenX(x)) / F_LAM - 2 * Math.PI * F_HZ * t);

/**
 * **`FIT` and `FIT_Y`, and why a redesign needs them.**
 *
 * The workbench drew F2 at its natural size, which spans about 344 × 254 local
 * units; the lozenge it replaces spanned about 250 × 150. Drop the new drawing
 * in unchanged and every one of the episode's thirty-odd staged Ray marks gets
 * a character half again as big, sitting higher in his own box — the `scale`
 * numbers in the scene files were all chosen against the old footprint, and
 * `CharacterFrame` scales about the *bottom* of the box, so the vertical shift
 * would not even be uniform.
 *
 * So the whole drawing is fitted once, here, into roughly the footprint the
 * staging was written for: 0.82 of natural size, nudged down so the visual
 * centre lands back on the box centre. Nothing else in the file knows about it
 * and the workbench's proportions survive exactly.
 */
const FIT = 0.78;
const FIT_Y = 20;

function fSamples(t: number, swing: number, N = 45): { pts: Pt[]; half: number[] } {
  const pts: Pt[] = [];
  const half: number[] = [];
  for (let i = 0; i < N; i++) {
    const u = (i / (N - 1)) * 2 - 1;
    const x = F_L * u;
    pts.push([x, F_WAVE_Y + fY(x, t) * swing]);
    half.push(34 - 22 * Math.abs(u) ** 1.2);
  }
  return { pts, half };
}

// --- the component ----------------------------------------------------------

export const Ray: React.FC<RayProps> = (props) => {
  const rig = useRig({ emotion: "happy", ...props });
  const {
    brightness = 1,
    spectrum = 0,
    bank = 0,
    streak = 1,
    arms = true,
    wave = 1,
    edge = EDGE,
    opacity = 1,
  } = props;
  const emotion =
    typeof props.emotion === "string" ? props.emotion : props.emotion?.emotion;
  const pose =
    props.pose ??
    (emotion === "excited" ? "cheer" : emotion === "scared" ? "hug" : "rest");

  const b = clamp01(brightness);
  // The three channels of the arc: colour, size, and how much the wave swings.
  const core = mixHex(CORE_COOL, CORE, b);
  const ring = mixHex(RING_COOL, RING_HOT, b);
  const warm = mixHex("#f2f6fb", CORE_WARM, b);
  const size = 0.9 + 0.18 * b;
  const t = rig.frame / rig.fps;
  // His own clock, offset per character like everything else in the rig.
  const st = t + rig.phase * 1.7;
  // Accessories ride the *lagged* breath (see Rig.trail).
  const lag = rig.trail.dy;

  // A dimmer Ray has a flatter wave. This is the channel the new body made
  // possible, and it is the best of the three: a sulk is a beam who has stopped
  // waving about.
  const swing = 0.72 + 0.28 * b;
  const { pts, half } = fSamples(st, swing);
  const d = ribbonPath(pts, half);
  // The loose attachment: the face rides the wave's own centre, damped and a
  // fifth of a second behind it.
  // −96, not the workbench's −74: the solid step of the face field grew when it
  // had to cover the blink (see `FACE_RAMP`), and at −74 its underside rested on
  // the wave's centre crest. The gap between the two is the whole illusion —
  // touching, they are one object with a lumpy outline; apart, they are a face
  // and a wave that belong to each other.
  const faceY = -96 + 0.55 * fY(0, st - 0.2) * swing;
  const rock = 2.2 * Math.sin(st * 0.58);

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox="-190 -160 380 320"
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      <g transform={`translate(0 ${FIT_Y}) scale(${FIT})`}>
        <g transform={`rotate(${bank + rock}) scale(${size})`} opacity={opacity}>
          {streak > 0.02 ? (
            <MotionDashes t={st} strength={streak} b={b} from={F_L + 16} />
          ) : null}

          {/* The column of light between him and his wave. Not a neck — a
              wash, with no edge of its own, so the two stay separate objects
              that happen to belong to each other. The first pass ran this at
              twice the alpha and it welded them together: a head on a wavy
              body, which is a jellyfish and not a face floating free. */}
          <ellipse
            cx={0}
            cy={(faceY + F_WAVE_Y) / 2}
            rx={62}
            ry={(F_WAVE_Y - faceY) / 2 + 16}
            fill={GLOW}
            opacity={0.05 + 0.07 * b}
          />

          {/* Radiance along the ribbon: three widening strokes of the same path
              rather than a radial gradient, because a gradient needs a
              per-instance id and seven shards plus Ray share one document. */}
          <g opacity={0.3 + 0.7 * b}>
            {[
              [46, 0.11],
              [30, 0.16],
              [20, 0.21],
            ].map(([w, a]) => (
              <path
                key={w}
                d={d}
                fill="none"
                stroke={GLOW}
                strokeWidth={w * (0.55 + 0.45 * b)}
                strokeLinejoin="round"
                opacity={a}
              />
            ))}
          </g>

          {/* No arms at rest, and that is the design rather than an omission:
              at rest F2 is a face and a wave, the wave IS the gesture, and two
              amber bars slung under the chin turn the pair back into a head on
              a body. The expressive poses still get them. */}
          {arms && pose !== "rest" ? (
            <Arms
              pose={pose}
              swing={lag * 0.4}
              t={st}
              wave={wave}
              edge={edge}
              // **Where the shoulder goes, and why it is a narrow window.**
              // Anchored on the wave, the arms lay two fat amber bars along the
              // crest and the character turns into a moustache. Anchored at the
              // face's centre they turn it back into a head. And the workbench's
              // compromise — sixty units down at 0.76 — was drawn against a face
              // field half this size: once the field grew to cover the blink,
              // every raised pose put its *hand* inside the field and `arms`
              // silently did nothing. Wave, cheer and hug all rendered armless.
              //
              // +38 at 1.35 is the window that works: the shoulder end of the
              // path is still under the field (so no arm has a blunt root
              // floating in the gap) and every hand clears it by enough to be a
              // gesture rather than a stub. The stroke widths come down to
              // compensate, so the *drawn* weight is still Drip's.
              anchor={[0, faceY + 38]}
              scale={1.35}
            />
          ) : null}

          <path d={d} fill={warm} opacity={0.62 + 0.32 * b} />
          <path d={ribbonPath(pts, half.map((h) => h * 0.5))} fill={core} opacity={0.9} />
          <path
            d={d}
            fill="none"
            stroke={edge}
            strokeWidth={8}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.72 + 0.28 * b}
          />
          {spectrum > 0.01 ? (
            <SpectrumEdge
              d={d}
              strength={spectrum}
              frame={rig.frame}
              repeats={3}
              wide={12}
              thin={6}
            />
          ) : null}

          <FaceCore rig={rig} y={faceY} core={core} ring={ring} b={b} />
        </g>
      </g>
    </CharacterFrame>
  );
};

// --- the face, and the whole of the F2 legibility problem --------------------

/**
 * **The Cheshire wash — F2's one real risk, and the mitigation.**
 *
 * There is no head. What says "a face is here" is this ten-step stack of flat
 * ellipses, from a whisper of warmth at the outside to solid core at the
 * middle. Two things in the ramp are load-bearing and both were settled by
 * rendering him talking at 0.44 (the crowd scale) and 0.62 (crossing space)
 * rather than by taste:
 *
 *   * **the eyelid, and why the solid step is WIDE AND FLAT.** `Face` paints a
 *     blink as a `skin`-coloured rectangle over the eye — it has to, because a
 *     clip path would need a per-instance id and seven shards share one
 *     document. On a solid body that is invisible. On a feathered wash it is a
 *     *pale rectangle on the character's eye* wherever the wash is not fully
 *     opaque, and the corners of that rectangle reach about (±60, −43) at rest
 *     and (±63, −50) on the wide-eyed emotions. The workbench's ramp was 66%
 *     opaque out there and every blink flashed two pale corners.
 *
 *     Those corners are the whole design constraint, and they are why the solid
 *     step is 92 × 70 rather than round: a *circle* that reaches (63, −50) has
 *     to be radius 80, and an 80-radius solid disc is F1 with extra steps. A
 *     wide flat oval covers the same corner in far less area, and it is a
 *     better face shape anyway — every face in this kit is wider than it is
 *     tall. Everything outside it feathers 100% → 4.5% over a hundred and
 *     fourteen units, which is a soft edge and not an outline. Verified on
 *     rendered blink frames at 0.44 and 0.62, not by eye on a still: solve
 *     `blinkAmount` for the frame and look.
 *   * **the feature size.** With no head to sit inside, the features are free
 *     to be bigger: 1.34 against the lozenge's 1.2, eyes at 1.06. That is not a
 *     bump on screen — `FIT` takes most of it back, and the point of it is to
 *     land the new drawing at the *same* on-screen feature size as the body it
 *     replaces, which is what the crowd shots were staged against. Mouth-sync
 *     is a dark shape on a bright field, so it survives any background; what it
 *     needed was to not get smaller.
 *
 * The outermost steps are deliberately weak (4.5%, 6%). They are what a
 * silhouette test flattens into a disc, and a disc is the one thing F2 must not
 * be allowed to grow back — see the kids' section of STYLE.md.
 */
const FACE_RAMP: Array<[rx: number, ry: number, alpha: number, warm: boolean]> = [
  [206, 158, 0.045, true],
  [178, 137, 0.06, true],
  [154, 118, 0.08, true],
  [134, 103, 0.11, true],
  [118, 91, 0.15, true],
  [108, 83, 0.22, true],
  [101, 78, 0.34, true],
  [97, 75, 0.55, false],
  [94, 72, 0.85, false],
  [92, 70, 1, false],
];

const FaceCore: React.FC<{
  rig: Rig;
  y: number;
  core: string;
  ring: string;
  b: number;
}> = ({ rig, y, core, ring, b }) => (
  <g transform={`translate(0 ${y})`}>
    {FACE_RAMP.map(([rx, ry, a, isWarm]) => (
      <ellipse
        key={rx}
        cx={0}
        cy={0}
        rx={rx}
        ry={ry}
        fill={isWarm ? ring : core}
        // Only the feathering answers to the arc. The three inner steps are
        // what the eyelid is painted in, so they are never allowed to go
        // translucent — a dim Ray would blink pale rectangles.
        opacity={isWarm ? a * (0.5 + 0.5 * b) : a}
      />
    ))}
    <Face
      rig={rig}
      x={0}
      y={0}
      size={1.34}
      eyeScale={1.06}
      skin={core}
      // Pink over near-white needs no help; the default strength puts two hot
      // spots on a pale face (the Puff finding, same problem).
      blushColor="#ffa06b"
      blushStrength={0.85}
    />
  </g>
);

// --- arms -------------------------------------------------------------------

/**
 * Arms are drawn **behind** the body, the way Drip's are, so only the part
 * outside the silhouette exists on screen (STYLE.md, "limbs read only outside
 * the silhouette"), and at Drip's weight rather than the old lozenge's: a
 * two-tone stroke with a hand on the end. The lozenge drew its arms in *front*
 * because a near-white body would have hidden them entirely; F2 has a real
 * interior and a face with nothing behind it, so in-front arms put two fat
 * amber bars across his own mouth.
 */
const ARM_PATHS: Record<RayPose, string> = {
  rest: "M -20 18 Q -78 34 -108 52",
  wave: "M -24 8 Q -92 -22 -104 -84",
  cheer: "M -24 2 Q -110 -36 -104 -96",
  // `point` and `brace` run out *low*, a good thirty units below where the
  // workbench had them. Both are near-horizontal, and both arms are mirrored —
  // at face height a mirrored horizontal pair is a rod through the character's
  // chin, which is what it looked like. Coming out under the field they read as
  // two arms held out, which is what they are.
  point: "M -20 44 Q -100 44 -152 40",
  brace: "M -20 48 Q -98 54 -138 48",
  hug: "M -24 22 Q -86 12 -54 -12",
};

const HAND_AT: Record<RayPose, Pt> = {
  rest: [-108, 52],
  wave: [-104, -84],
  cheer: [-104, -96],
  point: [-152, 40],
  brace: [-138, 48],
  hug: [-54, -12],
};

const Arms: React.FC<{
  pose: RayPose;
  swing: number;
  t: number;
  wave: number;
  edge: string;
  anchor: Pt;
  scale: number;
}> = ({ pose, swing, t, wave, edge, anchor, scale }) => {
  const d = ARM_PATHS[pose];
  const [hx, hy] = HAND_AT[pose];
  const flap = pose === "wave" ? Math.sin(t * 7.4) * 20 * clamp01(wave) : 0;
  const spread = pose === "wave" ? 0.55 + 0.45 * clamp01(wave) : 1;
  // Drip's two-tone, derived from whatever `edge` is: an episode that stages
  // him against gold overrides `edge` to ink, and a hard-coded amber highlight
  // would light up on a navy arm.
  const lit = mixHex(edge, "#ffffff", 0.3);
  return (
    <g transform={`translate(${anchor[0]} ${anchor[1] + swing}) scale(${scale})`}>
      {[-1, 1].map((s) => (
        <g key={s} transform={s === 1 ? "scale(-1 1)" : undefined}>
          <g transform={`translate(-24 28) scale(${spread}) rotate(${flap}) translate(24 -28)`}>
            <path
              d={d}
              stroke={edge}
              strokeWidth={26}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d={d}
              stroke={lit}
              strokeWidth={15}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx={hx} cy={hy} r={18} fill={edge} />
            <circle cx={hx} cy={hy} r={10} fill={lit} />
          </g>
        </g>
      ))}
    </g>
  );
};

// --- speed, without a tail ---------------------------------------------------

/**
 * Four short dashes, detached from the body by a clear gap, two above the axis
 * and two below.
 *
 * Detached and doubled is what stops them being anatomy — the ep-2 finding ("a
 * motion trail on a round body is two lines, never one") with the extra step of
 * never touching the body at all. Ray reads without them; they are the only
 * thing on him that is left/right asymmetric, which is exactly the point of
 * putting travel here instead of into the silhouette.
 */
const MotionDashes: React.FC<{ t: number; strength: number; b: number; from: number }> = ({
  t,
  strength,
  b,
  from,
}) => (
  <g opacity={clamp01(strength) * (0.45 + 0.55 * b)}>
    {[-1, 1].map((s) =>
      [0, 1].map((k) => {
        const y = s * (26 + k * 30);
        const x0 = -from - k * 30 - 10 * Math.sin(t * 2.3 + k * 1.6 + s);
        const len = 74 - k * 22;
        return (
          <g key={`${s}-${k}`}>
            <path
              d={`M ${x0} ${y} l ${-len} ${s * 5}`}
              stroke={GLOW}
              strokeWidth={20 - k * 6}
              strokeLinecap="round"
              opacity={0.5 - k * 0.16}
            />
            <path
              d={`M ${x0} ${y} l ${-len} ${s * 5}`}
              stroke={kidTheme.sun}
              strokeWidth={10 - k * 3}
              strokeLinecap="round"
              opacity={0.85 - k * 0.3}
            />
          </g>
        );
      }),
    )}
  </g>
);

// --- the seven, faintly, in his own ribbon ----------------------------------

/**
 * The same ribbon path stroked seven times, each showing one band of it, laid
 * end to end along the edge.
 *
 * `pathLength={1}` is what makes that exact and cheap: it renormalises the
 * path's own length to 1 for dash purposes, so a band is literally `1/n`
 * whatever the ribbon is doing this frame. The first pass estimated the
 * perimeter from a radius instead, and the estimate was wrong enough that the
 * bands bunched and read as a coloured smear rather than as colour *in his
 * edge*. Measuring the real length would mean a DOM read, and the rig is a pure
 * function of the frame.
 *
 * `repeats` is new with F2: the ribbon is long and thin where the lozenge was
 * compact, so one band per colour over the whole perimeter is a metre of red
 * followed by a metre of orange. Three repeats put the whole spectrum inside
 * any stretch a viewer is actually looking at.
 */
const SpectrumEdge: React.FC<{
  d: string;
  strength: number;
  frame: number;
  wide: number;
  thin: number;
  repeats: number;
}> = ({ d, strength, frame, wide, thin, repeats }) => {
  // The caller's 0.5 is remapped rather than the caller being changed — a scene
  // asking for "half" should get a findable half — and every band is drawn
  // twice: a wide soft pass that bleeds the hue outside the amber edge (where
  // it has a sky to be seen against) and a narrow solid one on the edge itself.
  // Still faint enough that nobody in the script has to mention it.
  const s = Math.min(1, clamp01(strength) ** 0.65 * 1.12);
  const n = SPECTRUM.length * repeats;
  const dash = `${1 / n} ${(SPECTRUM.length - 1) / n}`;
  return (
    <g>
      {SPECTRUM.map((c, i) => {
        // A very slow crawl, about one turn a minute: the colours are
        // travelling together, which is the sentence Act One ends on.
        const offset = -(i / n + frame * 0.0006);
        return (
          <g key={c.name}>
            <path
              d={d}
              fill="none"
              stroke={c.fill}
              strokeWidth={wide}
              strokeLinecap="butt"
              pathLength={1}
              strokeDasharray={dash}
              strokeDashoffset={offset}
              opacity={s * 0.3}
            />
            <path
              d={d}
              fill="none"
              stroke={c.fill}
              strokeWidth={thin}
              strokeLinecap="butt"
              pathLength={1}
              strokeDasharray={dash}
              strokeDashoffset={offset}
              opacity={s * 0.82}
            />
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// The seven — one colour shard, and THE FREQUENCY LADDER
// ---------------------------------------------------------------------------

export type ShardPose = "rest" | "wave";

export type RayShardProps = CharacterProps & {
  /** Which of the seven. Index into `SPECTRUM`, or the entry itself. */
  color: SpectrumColor | number;
  /** Whole-shard alpha, for the fade in a split or a merge. */
  opacity?: number;
  /** Banking angle in degrees, for a shard in flight. */
  bank?: number;
  /** Tiny arms. Off by default: seven pairs of arms is a lot of frame. */
  arms?: boolean;
  /**
   * `rest` hangs the arms down; `wave` raises both and flaps them.
   *
   * There is exactly one shard who waves and he does it in every frame he is
   * ever in (Yellow — "waves at everyone, continuously, including at things
   * that are leaving"), so this is a two-value pose rather than the six Ray
   * gets. A raised arm is also the only thing that makes his signature legible
   * in a *paused* frame, which is the standard the ensemble sheet sets.
   */
  pose?: ShardPose;
  /** Wave size 0..1, for `pose="wave"`. */
  wave?: number;
  /**
   * **Amplitude-in-place motion blur**: draw the whole body again either side
   * of itself, offset by this much in local units, at low alpha.
   *
   * One shard needs it (Violet, who "vibrates so hard his own outline blurs"),
   * and it is deliberately a *different kind of blur* from the one Blue gets.
   * Blue's blur is a bent trail behind him — a change of DIRECTION. Violet's is
   * this: three copies of a body spanning the width of a vibration it never
   * leaves. Two bodies wearing the same generic speed-smear would say the two
   * are the same kind of fast, and the physics of the whole episode is that
   * they are not.
   *
   * The caller supplies the vector because the *amplitude* is the episode's
   * ensemble sheet talking (`VIOLET_AMP` in the episode's `scenes/common.tsx`),
   * not the drawing's.
   */
  smear?: { dx: number; dy: number };
};

/**
 * **The frequency ladder** (Mike, revision addendum 3, 2026-08-01).
 *
 * The seven are the same face on the same wave, and the *only* thing that
 * differs between them — besides the hue — is how many times that wave goes up
 * and down. There is **one shared wave speed** for all seven, so `f = v / λ`
 * falls out of the drawing rather than being asserted: a long wave is
 * necessarily a slow one and a short wave is necessarily a fast one, and the
 * temperaments are the physics rather than a joke laid on top of it.
 *
 *   colour    cycles across the span    extrema    λ       frequency
 *   Red        1.0                       2         188      0.24 Hz
 *   Orange     1.5                       3         125      0.37
 *   Yellow     2.1                       4          90      0.51
 *   Green      2.9                       6          65      0.71
 *   Blue       4.0                       8          47      0.98
 *   Indigo     5.4                      11          35      1.32
 *   Violet     7.2                      14          26      1.76
 *
 * Red is **one trough and one peak** — the minimum thing that is still a wave,
 * and visibly a beam who cannot be bothered. Violet is a fizzing blur, and is
 * drawn as one: the two fastest also get ghost copies of their own ribbon a
 * fraction of a second either side, which is motion blur done as a pure
 * function of the frame.
 *
 * Amplitude is deliberately NOT a ladder. It is flat across the first five and
 * only tightens for the last two, and it tightens because it must (a swing
 * wider than about three quarters of a wavelength folds the ribbon through
 * itself). Keeping amplitude out of it is what makes the row read as
 * *frequency* ascending rather than "energy" ascending — line the seven up in
 * spectrum order and the picture is a frequency diagram wearing faces, which is
 * the whole of Scenes 9 and 10 and of the sunset race.
 *
 * The seven used to be described here as a **crowd, not a cast**. They are not,
 * and have not been since the 2026-08-01 revision: six of them speak, five of
 * them have a signature movement that is the only characterisation they will
 * ever get, and the seventh's entire joke is that he is the one who never gets
 * a line. Who each of them *is* lives in the episode's ensemble sheet
 * (`SEVEN` in `src/videos/sky-blue/scenes/common.tsx`); what lives here is the
 * one thing that is true of them as drawings — the body is cheap and the face
 * is expensive. Seven faces that are recognisably Ray's is the whole of Scene
 * 9, and a child who cannot see that they are all Ray has watched a special
 * effect instead of a fact.
 *
 * Seven of these is a fixed-length list in a scene, so the hook count never
 * changes across a frame — see PROCESS.md §5 on why that matters.
 */
const SHARD_CYCLES = [1, 1.5, 2.1, 2.9, 4, 5.4, 7.2] as const;
/**
 * Half-span of a shard's ribbon — wider than the 100-unit half-box it lives in,
 * on purpose. The wave has to out-measure the face disc or the ladder is seven
 * heads with squiggles behind them; `overflow="visible"` on the frame means the
 * box only ever governed *placement*, never what may be drawn.
 */
const S_L = 94;
/** The one wave speed, in local units per second. Shared by all seven. */
const S_SPEED = 46;
/** Where a shard's ribbon sits under its face, in local units. */
const S_WAVE_Y = 50;

function waveOf(i: number): { lam: number; hz: number; amp: number; hw: number } {
  const cycles = SHARD_CYCLES[i];
  const lam = (2 * S_L) / cycles;
  return {
    lam,
    hz: S_SPEED / lam,
    // Flat at 28 for the first five; the last two tighten because a swing wider
    // than ~0.75λ folds the ribbon through itself.
    amp: Math.min(28, lam * 0.75),
    // The ribbon thins as it speeds up, which is what turns Violet's wave into
    // a fizz rather than a fat zigzag.
    hw: 25 - i * 2.3,
  };
}

function shardIndexOf(color: SpectrumColor | number): number {
  if (typeof color === "number") {
    const n = SPECTRUM.length;
    return ((Math.round(color) % n) + n) % n;
  }
  const i = SPECTRUM.findIndex((c) => c.name === color.name);
  return i < 0 ? 0 : i;
}

export const RayShard: React.FC<RayShardProps> = (props) => {
  const rig = useRig({ emotion: "happy", ...props });
  const i = shardIndexOf(props.color);
  const c = SPECTRUM[i];
  const { opacity = 1, bank = 0, arms = false, pose = "rest", wave = 1, smear } = props;
  const box = RAY_SHARD_BOX;
  const { lam, hz, amp, hw } = waveOf(i);
  const t = rig.frame / rig.fps + rig.phase * 1.7;

  // A plain travelling sine, not the even function Ray's own ribbon uses. One
  // trough and one peak is *point*-symmetric rather than mirror-symmetric, and
  // that is what Red was asked for — a wave not bothered enough to be tidy. It
  // is still anti-polar (near-uniform width, round caps at both ends), which is
  // the property that actually matters.
  const yAt = (px: number, tt: number): number =>
    amp *
    // A gentle envelope, so the ends of the ribbon settle instead of flapping.
    (0.55 + 0.45 * Math.min(1, Math.abs(px) / S_L)) *
    Math.sin((2 * Math.PI * px) / lam - 2 * Math.PI * hz * tt);

  const ribbonAt = (dt: number): string => {
    const pts: Pt[] = [];
    const half: number[] = [];
    const N = 41;
    for (let k = 0; k < N; k++) {
      const u = (k / (N - 1)) * 2 - 1;
      const px = S_L * u;
      pts.push([px, yAt(px, t + dt) + S_WAVE_Y]);
      half.push(hw * (1 - 0.55 * Math.abs(u) ** 1.4));
    }
    return ribbonPath(pts, half);
  };

  const d = ribbonAt(0);
  // The fizz: the two fastest get their own ribbon ghosted a fraction of a
  // cycle either side. Motion blur, and like everything else in the kit a pure
  // function of the frame.
  const blur = i >= 5 ? (i - 4) * 0.5 : 0;
  const faceY = -70 + 0.5 * yAt(0, t);

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={box}
      height={box}
      viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`}
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      <g transform={`rotate(${bank})`} opacity={opacity}>
        {/* Violet's other blur — see `smear`. The ghosts are drawn FIRST and
            without features: a copy of a face either side of a face reads as
            three characters, where a copy of the silhouette either side of a
            body reads as one body whose outline has stopped holding still,
            which is the sentence the ensemble sheet actually writes. */}
        {smear ? (
          <>
            <g transform={`translate(${smear.dx} ${smear.dy})`}>
              <ShardSilhouette d={d} c={c} faceY={faceY} alpha={0.42} />
            </g>
            <g transform={`translate(${-smear.dx} ${-smear.dy})`}>
              <ShardSilhouette d={d} c={c} faceY={faceY} alpha={0.42} />
            </g>
          </>
        ) : null}

        {/* A whisper of the hue along the ribbon, so seven of them in a row glow
            into each other the way a rainbow does. Two widening strokes of the
            wave's own path, exactly as Ray's radiance is done — an *ellipse*
            behind the shard was the first two attempts and both put a grey coin
            on the fence behind every colour: a wash paler than the shard and
            darker than a sunlit plate cannot glow, it can only desaturate. A
            stroke that follows the wave has nowhere to be a coin. */}
        <path d={d} fill="none" stroke={c.light} strokeWidth={30} strokeLinejoin="round" opacity={0.2} />
        <path d={d} fill="none" stroke={c.light} strokeWidth={15} strokeLinejoin="round" opacity={0.34} />

        {blur > 0
          ? [-1, 1].map((s) => (
              <path key={s} d={ribbonAt((s * 0.055) / hz)} fill={c.fill} opacity={0.32 * blur} />
            ))
          : null}

        {arms ? (
          <ShardArms
            edge={c.deep}
            swing={rig.trail.dy * 0.4}
            y={faceY + 36}
            pose={pose}
            wave={wave}
            t={t}
          />
        ) : null}

        <path d={d} fill={c.fill} />
        <path d={d} fill="none" stroke={c.deep} strokeWidth={7} strokeLinejoin="round" />

        {/* The shard's face DOES keep a disc where Ray's has none, and the
            reason is crowd scale both ways round: a saturated hue over a
            painted plate needs its own field to hold the features, and seven of
            them at 0.44 have no room for the hundred-odd units of feathering
            Ray gets. The disc is the shard's own colour, so it reads as part of the
            same body rather than as a head — and the opaque step is exactly
            `skin`, so a blink has nothing to disagree with. */}
        <ellipse cx={0} cy={faceY} rx={74} ry={60} fill={c.light} opacity={0.26} />
        <ellipse cx={0} cy={faceY} rx={65} ry={53} fill={c.light} opacity={0.62} />
        {/* Wide and flat, and for exactly the reason Ray's is — see FACE_RAMP.
            The blink's rectangle reaches (±41, −32) at this face size and this
            oval is the smallest thing that covers the corner in `skin`. */}
        <ellipse cx={0} cy={faceY} rx={58} ry={48} fill={c.fill} />
        <Face
          rig={rig}
          x={0}
          y={faceY}
          size={0.9}
          eyeScale={0.98}
          skin={c.fill}
          // Blush over a saturated body needs opacity, not hue (the Drip
          // finding). On red and orange it simply will not show, and that is
          // the correct answer — a red cheek on a red face is a smudge.
          blushColor="#ffffff"
          blushStrength={1.1}
        />
      </g>
    </CharacterFrame>
  );
};

/** The shard with no features: ribbon, outline, face disc. A ghost. */
const ShardSilhouette: React.FC<{
  d: string;
  c: SpectrumColor;
  faceY: number;
  alpha: number;
}> = ({ d, c, faceY, alpha }) => (
  <g opacity={alpha}>
    <path d={d} fill={c.fill} />
    <path d={d} fill="none" stroke={c.deep} strokeWidth={7} strokeLinejoin="round" />
    <ellipse cx={0} cy={faceY} rx={58} ry={48} fill={c.fill} />
  </g>
);

/**
 * Two tiny arms, drawn behind the body like everything else in this kit.
 *
 * `wave` raises them and flaps, which exists for exactly one character: Yellow
 * waves at everyone, continuously, including at things that are leaving, and a
 * signature that only exists in motion is not in the episode. The raised arm is
 * the *paused-frame* half of it — in a line-up of seven, Yellow is the one with
 * his hand up, in any frame you stop on.
 *
 * **The first pass of this read as antennae**, and that is worth writing down
 * because the cause generalises: the arm left the shoulder *underneath* the
 * face disc, so the only part on screen was a thin stick emerging from the top
 * of a head with a ball on the end. An arm has to have a visible shoulder. The
 * root is now out at (−42, 14) from the anchor — clear of the disc's edge
 * (rx 58, ry 48 around `faceY`, anchor 36 below it) — the stroke is fatter than
 * the resting arm rather than thinner, and the hand is a proper hand instead of
 * a bead. Both arms go up rather than one: a single raised arm on a symmetric
 * body is the polar silhouette the whole redesign was about.
 */
const ShardArms: React.FC<{
  edge: string;
  swing: number;
  y: number;
  pose?: ShardPose;
  wave?: number;
  t?: number;
}> = ({ edge, swing, y, pose = "rest", wave = 1, t = 0 }) => {
  const up = pose === "wave" ? Math.max(0, Math.min(1, wave)) : 0;
  const waving = up > 0.01;
  const d = waving ? "M -42 14 Q -84 2 -96 -46" : "M -30 4 Q -68 16 -84 24";
  const hand: Pt = waving ? [-96, -46] : [-84, 24];
  const flap = waving ? Math.sin(t * 7.4) * 15 * up : 0;
  return (
    <g transform={`translate(0 ${y + swing})`}>
      {[-1, 1].map((s) => (
        <g key={s} transform={s === 1 ? "scale(-1 1)" : undefined}>
          {/* The flap pivots at the shoulder, not at the body's centre — an arm
              rotating about the middle of the character is a windmill. */}
          <g transform={`translate(-42 14) rotate(${flap}) translate(42 -14)`}>
            <path
              d={d}
              stroke={edge}
              strokeWidth={waving ? 16 : 13}
              strokeLinecap="round"
              fill="none"
            />
            <circle cx={hand[0]} cy={hand[1]} r={waving ? 15 : 11} fill={edge} />
          </g>
        </g>
      ))}
    </g>
  );
};
