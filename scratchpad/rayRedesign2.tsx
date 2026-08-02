import React from "react";
import { AbsoluteFill, Composition, Img, registerRoot, staticFile } from "remotion";
import {
  CharacterFrame,
  Face,
  SPECTRUM,
  SpeechBubble,
  kidTheme,
  mixHex,
  useRig,
  type RayPose,
  type RayProps,
  type Rig,
  type SpectrumColor,
} from "../src/lib/kid";

// Ray redesign — ROUND TWO. Throwaway design workbench, scratchpad only:
// outside tsconfig's `include`, not imported by anything in the suite.
//
//   npx remotion still scratchpad/rayRedesign2.tsx RaySheet2 scratchpad/ray_redesign2_sheet.png --frame=24
//   npx remotion still scratchpad/rayRedesign2.tsx CandE     scratchpad/ray2_candidate_E.png --frame=24
//
// ---------------------------------------------------------------------------
// WHY ROUND ONE FAILED, precisely.
//
// All four round-one bodies were POLAR: a compact rounded mass at one end and a
// motif that tapered away from it at the other. A (wave-form) put the face on
// the leading crest and ran a tapering ribbon back; B (comet) was a dart plus a
// trail; C (refined lozenge) was a nose plus a point; D (braid) was a head plus
// seven strands. Change the tail's texture all you like — head-plus-taper is
// the sperm silhouette, and a six-year-old (and his father) read silhouette
// first and detail never.
//
// So round two takes the polarity out at the root. Every candidate here is
// SYMMETRIC about its own centre — mirror-symmetric left/right, and in most
// cases up/down as well — with the face at that centre or floating over it.
// The wave extends EQUALLY both ways, so there is no end to call the front.
//
// The consequences, taken deliberately:
//
//   * Direction of travel can no longer be carried by the body. It is carried
//     by `bank` (the whole ribbon leans into its path) and by detached motion
//     dashes, which are a comics device rather than an anatomy. Every candidate
//     is legible with `streak={0}` — see the silhouette band.
//   * The face is no longer "the head". It is the person, and the wave is the
//     body language. That is a better fit for the character anyway: Ray is a
//     beam, and a beam does not have a front.
//   * The seven-split gets *better*, not worse. A centred symmetric ribbon per
//     colour, each at its own wavelength with one shared wave speed, keeps the
//     wavelength-as-temperament synergy from round one — red a long lazy swell,
//     violet a tight fizz — and now every shard is anti-polar too.
// ---------------------------------------------------------------------------

const W = 380;
const H = 320;
const VB = "-190 -160 380 320";

const CORE = "#fffdf2";
const CORE_COOL = "#e9f0f8";
const CORE_WARM = "#fff5d8";
const RING_COOL = "#eef2f7";
const RING_HOT = "#ffeec2";
const GLOW = kidTheme.sunLight;
const EDGE = kidTheme.sunDeep;

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

type Pt = [number, number];

/**
 * `|x|`, with the corner taken off the origin.
 *
 * Every wave here is a function of the distance from the centre, which is what
 * makes it mirror-symmetric — but `Math.abs` has a kink at zero, the ribbon's
 * normal flips across it, and the offset outline sprouts a small horn out of the
 * top of his head on every frame. `hypot(x, soft) - soft` is the same function
 * everywhere that matters and has zero slope at the centre, which is exactly
 * where the ribbon is fattest and least forgiving.
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

/** An open polyline, smoothed the same way. */
function smoothOpen(pts: Pt[]): string {
  const f = (p: Pt): string => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M ${f(pts[0])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    d += ` Q ${f(pts[i])} ${f(mid(pts[i], pts[i + 1]))}`;
  }
  d += ` L ${f(pts[pts.length - 1])}`;
  return d;
}

/**
 * A closed ribbon around a centreline with a per-sample half width, round caps
 * at both ends. Round caps at *both* ends is the point: a ribbon that is capped
 * one way and pointed the other is exactly the shape round one kept drawing.
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

/** The seven in an outline — the Ray.tsx trick, generalised over any path. */
const SpectrumEdge: React.FC<{
  d: string;
  strength: number;
  frame: number;
  wide?: number;
  thin?: number;
  repeats?: number;
}> = ({ d, strength, frame, wide = 22, thin = 11, repeats = 1 }) => {
  const s = Math.min(1, clamp01(strength) ** 0.65 * 1.12);
  const n = SPECTRUM.length * repeats;
  const dash = `${1 / n} ${(SPECTRUM.length - 1) / n}`;
  return (
    <g>
      {SPECTRUM.map((c, i) => {
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

/**
 * The pale core the eyes are anchored on, plus the face.
 *
 * `soft` swaps the two hard-edged discs for a feathered stack — that is the
 * Cheshire weight, where there is no drawn head at all and only the light
 * around the features says a face is there. The innermost step is still the
 * exact `skin` the eyelids are painted in, because a lid that does not match
 * what is under it is a pale rectangle on the character's eye.
 */
const FaceCore: React.FC<{
  rig: Rig;
  x?: number;
  y?: number;
  core: string;
  ring: string;
  b: number;
  s?: number;
  rot?: number;
  soft?: boolean;
  /** No disc at all — the body under the face already IS the flat core. */
  bare?: boolean;
}> = ({ rig, x = 0, y = 0, core, ring, b, s = 1, rot = 0, soft = false, bare = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    {bare ? null : soft ? (
      <g>
        {[
          [1.9, 0.07],
          [1.68, 0.09],
          [1.46, 0.12],
          [1.26, 0.16],
          [1.08, 0.22],
          [0.92, 0.3],
          [0.78, 0.45],
          [0.66, 0.7],
          [0.56, 0.95],
        ].map(([k, a]) => (
          <ellipse
            key={k}
            cx={0}
            cy={2}
            rx={86 * s * k}
            ry={76 * s * k}
            fill={k > 1.0 ? ring : core}
            opacity={a * (0.55 + 0.45 * b)}
          />
        ))}
      </g>
    ) : (
      <g>
        <ellipse cx={0} cy={2} rx={80 * s} ry={68 * s} fill={ring} opacity={0.3 + 0.55 * b} />
        <ellipse cx={0} cy={2} rx={62 * s} ry={54 * s} fill={core} />
      </g>
    )}
    <Face
      rig={rig}
      x={0}
      y={0}
      size={1.2 * s}
      eyeScale={1.02}
      skin={core}
      blushColor="#ffa06b"
      blushStrength={0.85}
    />
  </g>
);

// Arms at Drip's weight, held out to the sides. Both copies are mirrored, so
// arms never break the symmetry the whole round is built on.
const ARM_PATHS: Record<RayPose, string> = {
  rest: "M -20 18 Q -78 34 -108 52",
  wave: "M -24 8 Q -92 -22 -104 -84",
  cheer: "M -24 2 Q -110 -36 -104 -96",
  point: "M -20 14 Q -100 12 -152 6",
  brace: "M -20 20 Q -98 26 -138 18",
  hug: "M -24 22 Q -86 12 -54 -12",
};
const HAND_AT: Record<RayPose, Pt> = {
  rest: [-108, 52],
  wave: [-104, -84],
  cheer: [-104, -96],
  point: [-152, 6],
  brace: [-138, 18],
  hug: [-54, -12],
};

/**
 * Arms are drawn BEHIND the body in every candidate, the way Drip's are, so only
 * the part outside the silhouette exists on screen (STYLE.md, "limbs read only
 * outside the silhouette"). Ray.tsx draws his in front because his old body was
 * near-white and thin; on a symmetric body with a real interior that put two fat
 * amber bars across his own mouth. Each candidate picks the shoulder height that
 * gets the hands clear of its own outline.
 */
const Arms: React.FC<{
  pose: RayPose;
  swing: number;
  t: number;
  wave: number;
  edge: string;
  anchor?: Pt;
  scale?: number;
}> = ({ pose, swing, t, wave, edge, anchor = [0, 0], scale = 1 }) => {
  const d = ARM_PATHS[pose];
  const [hx, hy] = HAND_AT[pose];
  const flap = pose === "wave" ? Math.sin(t * 7.4) * 20 * clamp01(wave) : 0;
  const spread = pose === "wave" ? 0.55 + 0.45 * clamp01(wave) : 1;
  return (
    <g transform={`translate(${anchor[0]} ${anchor[1] + swing}) scale(${scale})`}>
      {[-1, 1].map((s) => (
        <g key={s} transform={s === 1 ? "scale(-1 1)" : undefined}>
          <g transform={`translate(-24 28) scale(${spread}) rotate(${flap}) translate(24 -28)`}>
            <path
              d={d}
              stroke={edge}
              strokeWidth={24}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx={hx} cy={hy} r={18} fill={edge} />
          </g>
        </g>
      ))}
    </g>
  );
};

/**
 * Speed, without a tail.
 *
 * Four short dashes, detached from the body by a clear gap, two above the axis
 * and two below. Detached and doubled is what stops them being anatomy — the
 * ep-2 finding ("a motion trail on a round body is two lines, never one") with
 * the extra step of never touching the body at all. Every candidate reads
 * without them; they are the only thing on Ray that is left/right asymmetric,
 * and the silhouette band shows him both ways.
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

/** Everything the candidates need out of the props, resolved once. */
function useBits(props: RayProps) {
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
  const pose: RayPose =
    props.pose ??
    (emotion === "excited" ? "cheer" : emotion === "scared" ? "hug" : "rest");
  const b = clamp01(brightness);
  const t = rig.frame / rig.fps;
  return {
    rig,
    b,
    core: mixHex(CORE_COOL, CORE, b),
    ring: mixHex(RING_COOL, RING_HOT, b),
    warm: mixHex("#f2f6fb", CORE_WARM, b),
    size: 0.9 + 0.18 * b,
    t,
    st: t + rig.phase * 1.7,
    lag: rig.trail.dy,
    spectrum,
    bank,
    streak,
    arms,
    wave,
    edge,
    opacity,
    pose,
    emotion,
  };
}

// ===========================================================================
// E — CENTRED FACE, SYMMETRIC WAVE.
// ===========================================================================
//
// One ribbon of light that extends equally both ways from the face, rippling
// *outward* from the centre: y is a function of |x|, so the drawing is exactly
// mirror-symmetric on every frame and the crests travel away from him in both
// directions at once. He is the source of his own wave, which is the truest
// thing you can say about a beam.
//
// The amplitude envelope is zero at the centre and grows outward, so the span
// under the face is flat and the face never rides a slope; the half-width does
// the opposite (fat at the middle, tapering to two identical round tips), which
// is what makes the middle read as the body and the ends as light.

const E_L = 176;
// Short enough that each side shows nearly two full cycles. The first pass ran
// one and a half over the whole span and the two ends read as *ears*: a wave
// only reads as a wave once you can see it repeat.
const E_LAM = 116;
const E_HZ = 0.42;
// Amplitude and half-width are one decision, not two: a fat ribbon on a steep
// wave folds over itself and the whole character becomes a knot of white. The
// ribbon has to be thin enough that a whole cycle fits beside itself.
const E_AMP = 33;

// Zero under the face, up to full by the time it clears the core disc, then
// held. A ramp that keeps growing to the tips makes the ends the loudest part
// of the drawing, which is the one thing this round is trying not to do.
const eAmp = (u: number): number => E_AMP * Math.min(1, (u / 0.38) ** 1.2) * (1 - 0.12 * u ** 4);
const eY = (x: number, t: number): number =>
  eAmp(Math.min(1, evenX(x) / E_L)) *
  Math.sin((2 * Math.PI * evenX(x)) / E_LAM - 2 * Math.PI * E_HZ * t);

function eSamples(t: number, N = 45): { pts: Pt[]; half: number[] } {
  const pts: Pt[] = [];
  const half: number[] = [];
  for (let i = 0; i < N; i++) {
    const u = (i / (N - 1)) * 2 - 1; // -1 .. 1
    const x = E_L * u;
    pts.push([x, eY(x, t)]);
    half.push(36 - 22 * Math.abs(u) ** 1.3);
  }
  return { pts, half };
}

export const RayE: React.FC<RayProps> = (props) => {
  const bits = useBits(props);
  const { rig, b, core, ring, warm, size, st, lag } = bits;
  const { pts, half } = eSamples(st);
  const d = ribbonPath(pts, half);
  const spine = smoothOpen(pts);
  // A slow whole-body rock. It is the only thing that leans him when he is not
  // travelling, and it is what keeps a symmetric drawing from reading as a logo.
  const rock = 2.4 * Math.sin(st * 0.62);

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox={VB}
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      <g transform={`rotate(${bits.bank + rock}) scale(${size})`} opacity={bits.opacity}>
        {bits.streak > 0.02 ? (
          <MotionDashes t={st} strength={bits.streak} b={b} from={E_L + 18} />
        ) : null}

        {/* Radiance: the ribbon itself, stroked fat and faint. A wave's halo has
            to be wave-shaped or it reads as a cloud he is flying through. */}
        <g opacity={0.3 + 0.7 * b}>
          {[
            [58, 0.1],
            [40, 0.15],
            [26, 0.2],
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

        {bits.arms ? (
          <Arms
            pose={bits.pose}
            swing={lag * 0.4}
            t={st}
            wave={bits.wave}
            edge={bits.edge}
            anchor={[0, 30]}
            scale={0.92}
          />
        ) : null}
        <path d={d} fill={warm} opacity={0.6 + 0.35 * b} />
        <path d={ribbonPath(pts, half.map((h) => h * 0.55))} fill={core} opacity={0.92} />
        <path
          d={d}
          fill="none"
          stroke={bits.edge}
          strokeWidth={9}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.72 + 0.28 * b}
        />
        {bits.spectrum > 0.01 ? (
          // Thin. On a 72-unit ribbon the 22/11 pair Ray.tsx uses on a compact
          // body paints the seven over most of his area and he stops being white
          // light with colour in his edge — which is the whole of Act One.
          <SpectrumEdge d={d} strength={bits.spectrum} frame={rig.frame} repeats={3} wide={14} thin={7} />
        ) : null}
        <path
          d={spine}
          fill="none"
          stroke={CORE}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.3 + 0.4 * b}
        />


        <FaceCore rig={rig} y={-2} core={core} ring={ring} b={b} />
      </g>
    </CharacterFrame>
  );
};

// ===========================================================================
// F — FREE-FLOATING FACE OVER A WAVE.  (F1 disc weight, F2 Cheshire weight.)
// ===========================================================================
//
// The face is its own element and the wave is a separate one underneath it.
// Nothing joins them but light: the face hovers, and it bobs on the wave's
// centre crest a fifth of a second LATE, so the eye reads the two as attached
// without a single drawn join. The wave is the body language — it flattens when
// he is flat, it fizzes when he is excited — and the face is the person.
//
// Two weights are drawn because they answer the dialogue question differently:
// F1 keeps a soft disc of light behind the features, which is a head in all but
// name and is unambiguous about who is talking; F2 has no disc at all, only the
// features and a feathered glow. F2 is the more beautiful idea and the riskier
// one, and the risk is exactly mouth-sync legibility at 0.44.

const F_L = 172;
const F_LAM = 116;
const F_HZ = 0.5;
const F_WAVE_Y = 66;

const fAmp = (u: number): number => 17 + 21 * u ** 1.25;
const fY = (x: number, t: number): number =>
  fAmp(Math.min(1, evenX(x) / F_L)) *
  Math.cos((2 * Math.PI * evenX(x)) / F_LAM - 2 * Math.PI * F_HZ * t);

function fSamples(t: number, N = 45): { pts: Pt[]; half: number[] } {
  const pts: Pt[] = [];
  const half: number[] = [];
  for (let i = 0; i < N; i++) {
    const u = (i / (N - 1)) * 2 - 1;
    const x = F_L * u;
    pts.push([x, F_WAVE_Y + fY(x, t)]);
    half.push(30 - 20 * Math.abs(u) ** 1.2);
  }
  return { pts, half };
}

const RayF: React.FC<RayProps & { soft?: boolean }> = (props) => {
  const bits = useBits(props);
  const { rig, b, core, ring, warm, size, st, lag } = bits;
  const soft = props.soft ?? false;
  const { pts, half } = fSamples(st);
  const d = ribbonPath(pts, half);
  // The loose attachment: the face rides the wave's own centre, damped and a
  // fifth of a second behind it. Late is the whole trick — on the same frame it
  // would be welded on, and Ray is a face that happens to be over a wave.
  const faceY = -74 + 0.55 * fY(0, st - 0.2);
  const rock = 2.2 * Math.sin(st * 0.58);

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox={VB}
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      <g transform={`rotate(${bits.bank + rock}) scale(${size})`} opacity={bits.opacity}>
        {bits.streak > 0.02 ? (
          <MotionDashes t={st} strength={bits.streak} b={b} from={F_L + 16} />
        ) : null}

        {/* The column of light between him and his wave. Not a neck — a wash,
            with no edge of its own, so the two stay separate objects that
            happen to belong to each other. */}
        <ellipse
          cx={0}
          cy={(faceY + F_WAVE_Y) / 2}
          rx={62}
          ry={(F_WAVE_Y - faceY) / 2 + 16}
          fill={GLOW}
          // Barely there. The first pass ran this at twice the alpha and it
          // welded the two together: a head on a wavy body, which is a jellyfish
          // and not a face floating free.
          opacity={0.05 + 0.07 * b}
        />

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

        {/* No arms at rest, and that is the design rather than an omission: at
            rest F is a face and a wave, the wave IS the gesture, and two amber
            bars slung under the chin turn the pair back into a head on a body.
            The expressive poses still get them. */}
        {bits.arms && bits.pose !== "rest" ? (
          <Arms
            pose={bits.pose}
            swing={lag * 0.4}
            t={st}
            wave={bits.wave}
            edge={bits.edge}
            // Under the face, reaching out across the gap. Anchored on the
            // wave instead they lay two fat orange bars along the crest and the
            // whole character turned into a moustache; anchored on the face they
            // turn it back into a head. Slung between the two is the only place
            // that reads as "he has arms and he is floating".
            anchor={[0, faceY + 58]}
            scale={0.76}
          />
        ) : null}
        <path d={d} fill={warm} opacity={0.62 + 0.32 * b} />
        <path d={ribbonPath(pts, half.map((h) => h * 0.5))} fill={core} opacity={0.9} />
        <path
          d={d}
          fill="none"
          stroke={bits.edge}
          strokeWidth={8}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.72 + 0.28 * b}
        />
        {bits.spectrum > 0.01 ? (
          <SpectrumEdge d={d} strength={bits.spectrum} frame={rig.frame} repeats={3} wide={12} thin={6} />
        ) : null}


        <FaceCore rig={rig} y={faceY} core={core} ring={ring} b={b} soft={soft} s={soft ? 1.02 : 1} />
      </g>
    </CharacterFrame>
  );
};

export const RayF1: React.FC<RayProps> = (props) => <RayF {...props} />;
export const RayF2: React.FC<RayProps> = (props) => <RayF {...props} soft />;

// ===========================================================================
// G — FACE IN THE WAVE.  The waveform opens around him.
// ===========================================================================
//
// One ribbon, whose thickness balloons at mid-span. Out at the sides it is a
// thin wave, symmetric left and right; coming in towards the centre its crest
// climbs and its trough drops until the two of them are the top and the bottom
// of a face, and then they close again on the other side. He has no head: the
// pale field his eyes sit on is the inside of his own waveform.
//
// This is the candidate where the face is neither sitting on the body nor
// floating above it — it is the shape the body makes.

const G_L = 178;
const G_LAM = 100;
const G_HZ = 0.4;

const gEnv = (u: number): number => 36 * u ** 1.6;
/** The shared wave. Even in x, so the drawing is mirror-symmetric every frame. */
const gWave = (x: number, t: number): number =>
  gEnv(Math.min(1, evenX(x, 34) / G_L)) *
  Math.sin((2 * Math.PI * evenX(x, 34)) / G_LAM - 2 * Math.PI * G_HZ * t);

/**
 * The aperture, as a half-width rather than as two separate strands.
 *
 * The first pass drew the upper and lower edge as two independent ribbons that
 * parted at the centre, and at any scale below a design sheet they merged into
 * one blob with two tendrils — a squid. Making it ONE ribbon whose half-width
 * balloons through a gaussian says the same thing and cannot come apart: the
 * top and bottom of his face are literally the crest and the trough of his own
 * waveform, pushed apart to make room for him, closing again either side.
 */
const gHalf = (x: number): number =>
  // Wide sigma on purpose. A tight gaussian makes the half-width change faster
  // than the outline can turn, the offset curve loops, and a small spur sprouts
  // off the top of his head every frame.
  15 + 76 * Math.exp(-((x / 98) ** 2)) - 6 * Math.min(1, Math.abs(x) / G_L) ** 1.4;

function gSamples(t: number, N = 51): { pts: Pt[]; half: number[] } {
  const pts: Pt[] = [];
  const half: number[] = [];
  for (let i = 0; i < N; i++) {
    const u = (i / (N - 1)) * 2 - 1;
    const x = G_L * u;
    pts.push([x, gWave(x, t)]);
    half.push(gHalf(x));
  }
  return { pts, half };
}

export const RayG: React.FC<RayProps> = (props) => {
  const bits = useBits(props);
  const { rig, b, core, ring, warm, size, st, lag } = bits;
  const { pts, half } = gSamples(st);
  const d = ribbonPath(pts, half);
  const inner = ribbonPath(pts, half.map((h) => Math.min(h * 0.82, h - 9)));
  const rock = 2.4 * Math.sin(st * 0.6);

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox={VB}
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      <g transform={`rotate(${bits.bank + rock}) scale(${size})`} opacity={bits.opacity}>
        {bits.streak > 0.02 ? (
          <MotionDashes t={st} strength={bits.streak} b={b} from={G_L + 16} />
        ) : null}

        <g opacity={0.3 + 0.7 * b}>
          {[
            [46, 0.1],
            [30, 0.15],
            [20, 0.2],
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

        {bits.arms ? (
          <Arms
            pose={bits.pose}
            swing={lag * 0.4}
            t={st}
            wave={bits.wave}
            edge={bits.edge}
            anchor={[0, 48]}
            scale={0.86}
          />
        ) : null}
        <path d={d} fill={warm} opacity={0.62 + 0.32 * b} />
        <path d={inner} fill={core} opacity={0.95} />
        <path
          d={d}
          fill="none"
          stroke={bits.edge}
          strokeWidth={9}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.72 + 0.28 * b}
        />
        {bits.spectrum > 0.01 ? (
          <SpectrumEdge d={d} strength={bits.spectrum} frame={rig.frame} repeats={2} wide={14} thin={7} />
        ) : null}


        {/* No head disc, and that is the candidate. The pale field the eyes sit
            on is the inside of his own waveform; the ring the other candidates
            paint would draw a head back on top of it. */}
        <FaceCore rig={rig} y={-2} core={core} ring={ring} b={b} bare />
      </g>
    </CharacterFrame>
  );
};

// ===========================================================================
// H — STANDING WAVE.  The body is the swept envelope of a vibrating string.
// ===========================================================================
//
// A plucked string, fixed at two ends that are the same end. His outline is the
// blur the string sweeps out — the classic lens, pinched to nothing at both
// tips, fattest exactly where the face is — and inside it the live string swings
// through its whole travel twice a second, with a ghost of its opposite extreme
// behind it.
//
// The wildcard's argument is that this is the only candidate whose silhouette is
// CONVEX and compact: a horizontal leaf. It survives 0.44 in a crowd, it holds a
// huge face, it is symmetric about both axes, and it is the same physics as the
// rest — a standing wave is two travelling waves going opposite ways, which is
// the anti-polarity rule stated as a fact about light rather than as a fix.
//
// Emotion changes the HARMONIC of the string inside, not the outline: excited
// buzzes at three, scared fizzes at five. The body he presents stays the body he
// presents, and the energy in him is what moves.

const H_L = 166;
const H_A = 82;
const H_HZ = 0.55;

const hShape = (x: number): number => Math.sin((Math.PI * (x + H_L)) / (2 * H_L));
// The envelope, fattened. A pure |sin| lens at this span is an almond — and an
// almond with two eyes drawn inside it reads as an EYE, which is the one
// silhouette worse than a tail. The 0.72 power pushes the outline out towards a
// leaf of light and blunts the two identical tips.
// ...and scalloped. A perfect almond with a bright round core in the middle of
// it is an EYE, which is the one silhouette worse than a tail; a shallow even
// ripple on the outline (even in x, so the symmetry is untouched) turns it back
// into a leaf of light with a wave running through its edge.
const hEnv = (x: number): number =>
  H_A * Math.max(0, hShape(x)) ** 0.72 * (1 + 0.14 * Math.cos((3 * Math.PI * x) / H_L));

function hBody(): string {
  const N = 41;
  const top: Pt[] = [];
  const bot: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const x = -H_L + ((2 * H_L) / (N - 1)) * i;
    top.push([x, -hEnv(x)]);
    bot.push([x, hEnv(x)]);
  }
  return smoothClosed([...top, ...bot.reverse()]);
}

/** The string at harmonic `n`, at phase `ph` of its swing. Always inside. */
function hString(n: number, t: number, ph: number): string {
  const N = 49;
  const pts: Pt[] = [];
  const swing = Math.cos(2 * Math.PI * H_HZ * t + ph);
  for (let i = 0; i < N; i++) {
    const x = -H_L + ((2 * H_L) / (N - 1)) * i;
    const env = Math.max(0, hShape(x)) ** 0.55;
    const y = H_A * 0.86 * env * Math.sin((n * Math.PI * (x + H_L)) / (2 * H_L)) * swing;
    pts.push([x, y]);
  }
  return smoothOpen(pts);
}

export const RayH: React.FC<RayProps> = (props) => {
  const bits = useBits(props);
  const { rig, b, core, ring, warm, size, st, lag } = bits;
  const d = hBody();
  const n = bits.pose === "cheer" ? 3 : bits.pose === "hug" ? 5 : bits.emotion === "amazed" ? 2 : 1;
  const rock = 2.2 * Math.sin(st * 0.64);

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox={VB}
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      <g transform={`rotate(${bits.bank + rock}) scale(${size})`} opacity={bits.opacity}>
        {bits.streak > 0.02 ? (
          <MotionDashes t={st} strength={bits.streak} b={b} from={H_L + 10} />
        ) : null}

        <g opacity={0.3 + 0.7 * b}>
          {[
            [54, 0.1],
            [36, 0.14],
            [22, 0.19],
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

        {bits.arms ? (
          <Arms
            pose={bits.pose}
            swing={lag * 0.4}
            t={st}
            wave={bits.wave}
            edge={bits.edge}
            anchor={[0, 30]}
            scale={0.88}
          />
        ) : null}
        <path d={d} fill={warm} opacity={0.55 + 0.35 * b} />
        {/* The string, and the ghost of where it was half a cycle ago. Two
            lines, and the pair of them is what says "vibrating" rather than
            "drawn". */}
        {/* Ghost first: where the string was half a cycle ago. */}
        <path
          d={hString(n, st, Math.PI)}
          fill="none"
          stroke={kidTheme.sun}
          strokeWidth={9}
          strokeLinecap="round"
          opacity={0.18 + 0.16 * b}
        />
        {/* The live string. White on warm white is invisible — the first pass
            lost the entire motif inside its own body — so the read is carried
            by a saturated gold casing with the white core sitting on top of it. */}
        <path
          d={hString(n, st, 0)}
          fill="none"
          stroke={GLOW}
          strokeWidth={26}
          strokeLinecap="round"
          opacity={0.4 + 0.3 * b}
        />
        <path
          d={hString(n, st, 0)}
          fill="none"
          stroke={kidTheme.sun}
          strokeWidth={15}
          strokeLinecap="round"
          opacity={0.55 + 0.3 * b}
        />
        <path
          d={hString(n, st, 0)}
          fill="none"
          stroke={CORE}
          strokeWidth={7}
          strokeLinecap="round"
          opacity={0.75 + 0.25 * b}
        />
        <path
          d={d}
          fill="none"
          stroke={bits.edge}
          strokeWidth={9}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.72 + 0.28 * b}
        />
        {bits.spectrum > 0.01 ? (
          <SpectrumEdge d={d} strength={bits.spectrum} frame={rig.frame} repeats={2} />
        ) : null}


        <FaceCore rig={rig} y={-2} core={core} ring={ring} b={b} />
      </g>
    </CharacterFrame>
  );
};

// ===========================================================================
// the seven — one anti-polar shard per candidate family
// ===========================================================================

type ShardProps = {
  x: number;
  y: number;
  color: SpectrumColor | number;
  index: number;
  scale?: number;
  phase?: number;
};

/**
 * Wavelength, frequency and amplitude for colour `i` — one wave speed for all
 * seven, so `f = v / λ` and the temperaments fall out of the physics: Red a
 * long slow swell, Violet a short fast fizz. Unchanged from round one; it is
 * the part of round one that was right.
 */
function waveOf(i: number): { lam: number; hz: number; amp: number } {
  const lam = 74 - i * 5;
  const speed = 78;
  return { lam, hz: speed / lam, amp: 12 + 0.14 * lam };
}

const SHARD_BOX = 200;
const S_L = 84;

const Shard: React.FC<ShardProps & { variant: "ribbon" | "float" | "aperture" | "lens" }> = ({
  x,
  y,
  color,
  index,
  scale = 1,
  phase = 0,
  variant,
}) => {
  const rig = useRig({ x, y, emotion: "happy", phase });
  const c = typeof color === "number" ? SPECTRUM[index] : color;
  const { lam, hz, amp } = waveOf(index);
  const t = rig.frame / rig.fps + phase * 0.7;
  const bob = 5 * Math.sin(2 * Math.PI * hz * t);

  const yOf = (px: number): number =>
    amp *
    (0.5 + 0.5 * Math.min(1, evenX(px, 12) / S_L)) *
    Math.sin((2 * Math.PI * evenX(px, 12)) / lam - 2 * Math.PI * hz * t);

  const samples = (off: number, hw: (u: number) => number): { pts: Pt[]; half: number[] } => {
    const pts: Pt[] = [];
    const half: number[] = [];
    const N = 29;
    for (let i = 0; i < N; i++) {
      const u = (i / (N - 1)) * 2 - 1;
      const px = S_L * u;
      pts.push([px, yOf(px) + off]);
      half.push(hw(Math.abs(u)));
    }
    return { pts, half };
  };

  let body: React.ReactNode = null;
  let faceY = 0;
  let faceS = 0.86;

  if (variant === "ribbon") {
    const { pts, half } = samples(0, (u) => 25 - 17 * u ** 1.3);
    const d = ribbonPath(pts, half);
    body = (
      <g>
        <ellipse cx={0} cy={0} rx={62} ry={52} fill={c.fill} opacity={0.2} />
        <path d={d} fill={c.fill} />
        <path d={ribbonPath(pts, half.map((h) => h * 0.55))} fill={c.light} opacity={0.5} />
        <path d={d} fill="none" stroke={c.deep} strokeWidth={7} strokeLinejoin="round" />
      </g>
    );
  } else if (variant === "float") {
    const { pts, half } = samples(30, (u) => 16 - 11 * u ** 1.2);
    const d = ribbonPath(pts, half);
    faceY = -24 + 0.5 * yOf(0);
    faceS = 0.8;
    body = (
      <g>
        <path d={d} fill={c.fill} />
        <path d={d} fill="none" stroke={c.deep} strokeWidth={6} strokeLinejoin="round" />
      </g>
    );
  } else if (variant === "aperture") {
    const bulge = (px: number): number => 8 + 34 * Math.exp(-((px / 34) ** 2));
    const pts: Pt[] = [];
    const half: number[] = [];
    const N = 33;
    for (let i = 0; i < N; i++) {
      const u = (i / (N - 1)) * 2 - 1;
      const px = S_L * u;
      pts.push([px, yOf(px) * 0.8]);
      half.push(bulge(px) - 3 * Math.abs(u) ** 1.4);
    }
    const d = ribbonPath(pts, half);
    faceS = 0;
    body = (
      <g>
        <path d={d} fill={c.fill} />
        <path d={ribbonPath(pts, half.map((h) => Math.min(h * 0.8, h - 4)))} fill={c.light} opacity={0.45} />
        <path d={d} fill="none" stroke={c.deep} strokeWidth={7} strokeLinejoin="round" />
      </g>
    );
  } else {
    // lens: the standing-wave shard. Harmonic rises with the colour.
    const n = [1, 1, 2, 2, 3, 3, 4][index] ?? 1;
    const A = 38;
    const shape = (px: number): number => Math.sin((Math.PI * (px + S_L)) / (2 * S_L));
    const top: Pt[] = [];
    const bot: Pt[] = [];
    const N = 29;
    for (let i = 0; i < N; i++) {
      const px = -S_L + ((2 * S_L) / (N - 1)) * i;
      const e = A * Math.max(0, shape(px));
      top.push([px, -e]);
      bot.push([px, e]);
    }
    const d = smoothClosed([...top, ...bot.reverse()]);
    const str: Pt[] = [];
    const swing = Math.cos(2 * Math.PI * hz * t);
    for (let i = 0; i < 33; i++) {
      const px = -S_L + ((2 * S_L) / 32) * i;
      const e = Math.max(0, shape(px)) ** 0.55;
      str.push([px, A * 0.86 * e * Math.sin((n * Math.PI * (px + S_L)) / (2 * S_L)) * swing]);
    }
    body = (
      <g>
        <path d={d} fill={c.fill} />
        <path d={smoothOpen(str)} fill="none" stroke={c.light} strokeWidth={8} strokeLinecap="round" />
        <path d={d} fill="none" stroke={c.deep} strokeWidth={7} strokeLinejoin="round" />
      </g>
    );
  }

  return (
    <CharacterFrame
      rig={rig}
      x={x}
      y={y}
      width={SHARD_BOX}
      height={SHARD_BOX}
      viewBox={`${-SHARD_BOX / 2} ${-SHARD_BOX / 2} ${SHARD_BOX} ${SHARD_BOX}`}
      scale={scale}
    >
      <g transform={`translate(0 ${bob})`}>
        {body}
        {faceS > 0 ? (
          <g>
            <ellipse cx={0} cy={faceY} rx={48 * faceS} ry={41 * faceS} fill={c.light} opacity={0.6} />
            <ellipse cx={0} cy={faceY} rx={40 * faceS} ry={34 * faceS} fill={c.fill} />
          </g>
        ) : null}
        <Face
          rig={rig}
          x={0}
          y={faceY}
          size={0.94 * (faceS || 0.82)}
          eyeScale={0.98}
          skin={c.fill}
          blushColor="#ffffff"
          blushStrength={1.1}
        />
      </g>
    </CharacterFrame>
  );
};

// ===========================================================================
// the sheet
// ===========================================================================

type Cand = {
  key: string;
  name: string;
  blurb: string;
  Comp: React.FC<RayProps>;
  variant: "ribbon" | "float" | "aperture" | "lens";
};

const CANDIDATES: Cand[] = [
  {
    key: "E",
    name: "Centred wave",
    blurb: "face at the middle of a ribbon that ripples outward both ways",
    Comp: RayE,
    variant: "ribbon",
  },
  {
    key: "F1",
    name: "Floating face (disc)",
    blurb: "glow disc hovering over an independent wave, bobbing late",
    Comp: RayF1,
    variant: "float",
  },
  {
    key: "F2",
    name: "Floating face (Cheshire)",
    blurb: "features only, no head at all — the wave is the body",
    Comp: RayF2,
    variant: "float",
  },
  {
    key: "G",
    name: "Face in the wave",
    blurb: "no head at all — the wave swells at mid-span and the swell is his face",
    Comp: RayG,
    variant: "aperture",
  },
  {
    key: "H",
    name: "Standing wave",
    blurb: "swept envelope of a plucked string; emotion = harmonic",
    Comp: RayH,
    variant: "lens",
  },
];

const FONT = kidTheme.fontFamily;

const Label: React.FC<{
  x: number;
  y: number;
  text: string;
  size?: number;
  color?: string;
  align?: "center" | "left";
  weight?: number;
}> = ({ x, y, text, size = 26, color = "#1d2733", align = "center", weight = 700 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      color,
      font: `${weight} ${size}px ${FONT}`,
      transform: align === "center" ? "translate(-50%, 0)" : "none",
      whiteSpace: "nowrap",
      textShadow:
        "-2px -2px 0 rgba(255,253,247,.9), 2px -2px 0 rgba(255,253,247,.9), -2px 2px 0 rgba(255,253,247,.9), 2px 2px 0 rgba(255,253,247,.9)",
    }}
  >
    {text}
  </div>
);

const Plate: React.FC<{
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  focusX?: number;
  focusY?: number;
  zoom?: number;
  children?: React.ReactNode;
}> = ({ src, left, top, width, height, focusX = 0.5, focusY = 0.55, zoom = 1, children }) => (
  <div style={{ position: "absolute", left, top, width, height, overflow: "hidden" }}>
    <Img
      src={src}
      style={{
        position: "absolute",
        width: `${100 * zoom}%`,
        height: `${100 * zoom}%`,
        objectFit: "cover",
        objectPosition: `${focusX * 100}% ${focusY * 100}%`,
        left: `${(1 - zoom) * 50}%`,
        top: `${(1 - zoom) * 50}%`,
      }}
    />
    {children}
  </div>
);

const GARDEN = "backgrounds/sky-blue/garden_day.webp";
const SKY = "backgrounds/sky-blue/sky_dome_day.webp";

/**
 * The silhouette filter: kill every colour channel, then push alpha hard so the
 * body goes solid and only the halo survives as a whisper. Applied to a wrapper
 * div, so it flattens the whole character exactly as the eye flattens it at a
 * distance.
 */
const SilDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="ray2sil" x="-60%" y="-60%" width="220%" height="220%">
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.05  0 0 0 0 0.07  0 0 0 0 0.11  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncA type="linear" slope={5} intercept={0} />
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
);

const Sil: React.FC<{ mirror?: boolean; children: React.ReactNode }> = ({ mirror, children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      filter: "url(#ray2sil)",
      transform: mirror ? "scaleX(-1)" : undefined,
    }}
  >
    {children}
  </div>
);

const SHEET_W = 2860;
const ROW_H = 600;
const HEAD_H = 190;
const SIL_H = 780;
const SHEET_H = HEAD_H + ROW_H * CANDIDATES.length + SIL_H;

const Row: React.FC<{ cand: Cand; top: number }> = ({ cand, top }) => {
  const { Comp, variant } = cand;
  const cy = 280;
  const gardenW = 1460;
  const skyX = 200 + gardenW;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top,
          width: 200,
          height: ROW_H,
          background: "#f4efe2",
          borderTop: "4px solid #1d2733",
        }}
      />
      <Label x={30} y={top + 30} text={cand.key} size={96} align="left" weight={900} />
      <div
        style={{
          position: "absolute",
          left: 22,
          top: top + 152,
          width: 168,
          color: "#1d2733",
          font: `800 24px ${FONT}`,
          lineHeight: 1.2,
        }}
      >
        {cand.name}
      </div>
      <div
        style={{
          position: "absolute",
          left: 22,
          top: top + 224,
          width: 170,
          color: "#455368",
          font: `600 18px ${FONT}`,
          lineHeight: 1.25,
        }}
      >
        {cand.blurb}
      </div>

      <Plate src={staticFile(GARDEN)} left={200} top={top} width={gardenW} height={ROW_H} focusY={0.62}>
        <Comp x={300} y={cy} scale={0.7} brightness={1} spectrum={0.5} phase={0.4} emotion="happy" streak={0.25} />
        <Label x={300} y={ROW_H - 66} text="idle" size={28} />
        <Comp
          x={760}
          y={cy - 34}
          scale={0.7}
          brightness={1}
          spectrum={0.5}
          phase={2.6}
          emotion="excited"
          bank={-19}
          streak={1}
        />
        <Label x={760} y={ROW_H - 66} text="banking flight" size={28} />
        <Comp x={1200} y={cy} scale={0.7} brightness={1} spectrum={0.5} phase={4.9} emotion="amazed" streak={0.15} />
        <Label x={1200} y={ROW_H - 66} text="amazed" size={28} />
      </Plate>

      <Plate
        src={staticFile(SKY)}
        left={skyX}
        top={top}
        width={SHEET_W - skyX}
        height={ROW_H}
        focusY={0.5}
        zoom={1.2}
      >
        <Comp x={150} y={cy} scale={0.62} brightness={0.25} spectrum={0} phase={1.7} emotion="sad" streak={0.4} />
        <Label x={150} y={ROW_H - 66} text="b = 0.25" size={28} />
        <Comp x={420} y={cy} scale={0.62} brightness={1} spectrum={1} phase={3.3} emotion="proud" streak={0.4} />
        <Label x={420} y={ROW_H - 66} text="b = 1 · spectrum 1" size={28} />
        {SPECTRUM.map((c, i) => {
          const u = i / 6;
          const sx = 640 + u * 400;
          const sy = cy - 40 - Math.sin(u * Math.PI) * 56;
          return (
            <Shard key={c.name} x={sx} y={sy} scale={0.42} color={i} index={i} phase={i * 1.31} variant={variant} />
          );
        })}
        <Label x={840} y={ROW_H - 66} text="the seven" size={28} />
      </Plate>
    </>
  );
};

const SilBand: React.FC<{ top: number }> = ({ top }) => {
  const colW = SHEET_W / CANDIDATES.length;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        width: SHEET_W,
        height: SIL_H,
        background: "#fbf7ec",
        borderTop: "6px solid #1d2733",
      }}
    >
      <Label
        x={30}
        y={16}
        align="left"
        size={40}
        weight={900}
        text="SILHOUETTE TEST — solid fill, and the same fill mirrored. If you can pick the front, the candidate fails."
      />
      <Label
        x={30}
        y={68}
        align="left"
        size={23}
        weight={600}
        color="#455368"
        text="top pair: body at rest, streak=0, arms off — the left one flipped horizontally on the right. If the two are the same drawing, no end is the front."
      />
      <Label
        x={30}
        y={100}
        align="left"
        size={23}
        weight={600}
        color="#455368"
        text="bottom: in flight, banked, with the motion dashes on — the one asymmetric element on him, and a comics device rather than an anatomy. (F2's glow flattens to a solid disc here; on screen it is a feathered wash.)"
      />
      {CANDIDATES.map((c, i) => {
        const x0 = i * colW;
        return (
          <div
            key={c.key}
            style={{
              position: "absolute",
              left: x0,
              top: 140,
              width: colW,
              height: SIL_H - 140,
              borderLeft: i === 0 ? undefined : "2px dashed #c9c0ab",
            }}
          >
            <Sil>
              <c.Comp x={colW * 0.245} y={150} scale={0.5} brightness={1} spectrum={0} streak={0} phase={0.4} emotion="happy" arms={false} />
            </Sil>
            {/* Mirrored about the column's own centre, so the child has to be
                placed on the LEFT to land on the right. */}
            <Sil mirror>
              <c.Comp x={colW * 0.245} y={150} scale={0.5} brightness={1} spectrum={0} streak={0} phase={0.4} emotion="happy" arms={false} />
            </Sil>
            <Sil>
              <c.Comp x={colW * 0.5} y={400} scale={0.5} brightness={1} spectrum={0} streak={1} bank={-16} phase={2.2} emotion="excited" />
            </Sil>
            <Label x={colW * 0.5} y={540} text={c.key} size={38} weight={900} />
          </div>
        );
      })}
    </div>
  );
};

const Sheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#f4efe2" }}>
    <SilDefs />
    <Label x={SHEET_W / 2} y={24} text="RAY — round two: anti-polarity" size={68} weight={900} />
    <Label
      x={SHEET_W / 2}
      y={106}
      size={30}
      weight={600}
      color="#455368"
      text="every body is symmetric about its own centre — the wave goes equally both ways, so there is no end to call the front. Same drop-in React.FC<RayProps>."
    />
    <Label
      x={SHEET_W / 2}
      y={146}
      size={26}
      weight={600}
      color="#7a6a4f"
      text="round one failed as one class of shape: compact mass + tapering motif. Nothing below has a taper that ends."
    />
    {CANDIDATES.map((c, i) => (
      <Row key={c.key} cand={c} top={HEAD_H + i * ROW_H} />
    ))}
    <SilBand top={HEAD_H + CANDIDATES.length * ROW_H} />
  </AbsoluteFill>
);

// --- per-candidate close-up -------------------------------------------------

const CLOSE_W = 1920;
const CLOSE_H = 1320;

const CloseUp: React.FC<{ cand: Cand; alt?: Cand }> = ({ cand, alt }) => {
  const { Comp, variant } = cand;
  const Alt = alt?.Comp ?? Comp;
  return (
    <AbsoluteFill style={{ background: "#f4efe2" }}>
      <SilDefs />
      <Plate src={staticFile(GARDEN)} left={0} top={90} width={1120} height={700} focusY={0.62}>
        <Comp x={310} y={300} scale={1.05} brightness={1} spectrum={0.5} phase={0.4} emotion="happy" streak={0.25} />
        <Label x={310} y={500} text="idle · b=1 · spectrum 0.5" size={26} />
        <Comp
          x={810}
          y={230}
          scale={0.82}
          brightness={1}
          spectrum={0.5}
          phase={2.6}
          emotion="excited"
          bank={-22}
          streak={1}
        />
        <Label x={810} y={390} text="banking flight, excited" size={26} />
        <Comp x={760} y={580} scale={0.78} brightness={1} spectrum={0.5} phase={5.2} emotion="amazed" streak={0.15} />
        <Label x={760} y={670} text="amazed" size={26} />
      </Plate>

      <Plate src={staticFile(SKY)} left={1120} top={90} width={800} height={700} zoom={1.25}>
        <Alt x={200} y={180} scale={0.74} brightness={0.25} spectrum={0} phase={1.1} emotion="sad" streak={0.4} />
        <Label x={200} y={296} text={`${alt ? alt.key + " · " : ""}b = 0.25, spectrum 0`} size={24} />
        <Alt x={570} y={180} scale={0.74} brightness={1} spectrum={0} phase={3.4} emotion="neutral" streak={0.4} />
        <Label x={570} y={296} text={`${alt ? alt.key + " · " : ""}b = 1, spectrum 0`} size={24} />
        <Alt x={200} y={510} scale={0.74} brightness={0.6} spectrum={0.5} phase={2.2} emotion="grumpy" streak={0.4} />
        <Label x={200} y={626} text={`${alt ? alt.key + " · " : ""}b = 0.6, spectrum 0.5`} size={24} />
        <Alt x={570} y={510} scale={0.74} brightness={1} spectrum={1} phase={4.7} emotion="proud" streak={0.4} />
        <Label x={570} y={626} text={`${alt ? alt.key + " · " : ""}b = 1, spectrum 1`} size={24} />
      </Plate>

      <Label x={36} y={18} text={`${cand.key} — ${cand.name}`} size={48} align="left" weight={900} />
      <Label x={740} y={34} text={cand.blurb} size={26} align="left" weight={600} color="#455368" />

      {/* talking + scale + silhouette, the three things that decide it */}
      <Plate src={staticFile(GARDEN)} left={0} top={810} width={1120} height={300} focusY={0.5}>
        <Comp x={210} y={180} scale={0.62} brightness={1} spectrum={0.5} phase={1.2} emotion="happy" speaking streak={0} />
        <SpeechBubble x={470} y={70} text="I am the plain one" tail="left" tailAt={250} fontSize={30} maxWidth={380} />
        <Comp x={820} y={190} scale={0.44} brightness={1} spectrum={0.5} phase={3.1} emotion="happy" speaking streak={0} />
        <Label x={210} y={262} text="speaking · 0.62 (crossing)" size={24} />
        <Label x={880} y={262} text="0.44 (crowd)" size={24} />
      </Plate>

      <div style={{ position: "absolute", left: 1120, top: 810, width: 800, height: 300, background: "#fbf7ec" }}>
        <Label x={20} y={10} align="left" size={26} weight={900} text="silhouette · mirrored · in flight" />
        <Sil>
          <Comp x={140} y={170} scale={0.52} brightness={1} spectrum={0} streak={0} phase={0.4} emotion="happy" arms={false} />
        </Sil>
        <Sil mirror>
          <Comp x={400} y={170} scale={0.52} brightness={1} spectrum={0} streak={0} phase={0.4} emotion="happy" arms={false} />
        </Sil>
        <Sil>
          <Comp x={660} y={170} scale={0.52} brightness={1} spectrum={0} streak={1} bank={-16} phase={2.2} emotion="excited" />
        </Sil>
      </div>

      {SPECTRUM.map((c, i) => {
        const u = i / 6;
        const sx = 240 + u * 1440;
        const sy = 1200 - Math.sin(u * Math.PI) * 60;
        return (
          <React.Fragment key={c.name}>
            <Shard x={sx} y={sy} scale={0.6} color={i} index={i} phase={i * 1.31} variant={variant} />
            <Label x={sx} y={1272} text={c.name} size={22} />
          </React.Fragment>
        );
      })}
      <Label x={40} y={1124} text="the seven — same symmetric body, each at its own wavelength" size={28} align="left" weight={900} />
    </AbsoluteFill>
  );
};

// --- the scale check --------------------------------------------------------

const Scales: React.FC = () => (
  <AbsoluteFill style={{ background: "#f4efe2" }}>
    <Label x={40} y={16} text="scale check — 0.44 (crowd) · 0.62 (crossing)" size={40} align="left" weight={900} />
    <Plate src={staticFile(SKY)} left={0} top={80} width={1920} height={320} zoom={1.3}>
      {CANDIDATES.map((c, i) => (
        <React.Fragment key={c.key}>
          <c.Comp
            x={190 + i * 380}
            y={140}
            scale={0.44}
            brightness={1}
            spectrum={0.5}
            phase={i * 1.7}
            emotion="happy"
            speaking
            streak={0.5}
          />
          <Label x={190 + i * 380} y={244} text={`${c.key} · 0.44 · speaking`} size={24} />
        </React.Fragment>
      ))}
    </Plate>
    <Plate src={staticFile(GARDEN)} left={0} top={420} width={1920} height={420} focusY={0.6}>
      {CANDIDATES.map((c, i) => (
        <React.Fragment key={c.key}>
          <c.Comp
            x={200 + i * 380}
            y={170}
            scale={0.62}
            brightness={0.5}
            spectrum={0}
            phase={i * 2.3}
            emotion="neutral"
            streak={0.8}
            bank={-6}
          />
          <Label x={200 + i * 380} y={320} text={`${c.key} · 0.62 · Act One`} size={24} />
        </React.Fragment>
      ))}
    </Plate>
  </AbsoluteFill>
);

registerRoot(() => (
  <>
    <Composition id="RaySheet2" component={Sheet} durationInFrames={90} fps={30} width={SHEET_W} height={SHEET_H} />
    <Composition id="Scales2" component={Scales} durationInFrames={90} fps={30} width={1920} height={860} />
    {[
      { c: CANDIDATES[0], alt: undefined, id: "CandE" },
      { c: CANDIDATES[1], alt: CANDIDATES[2], id: "CandF" },
      { c: CANDIDATES[3], alt: undefined, id: "CandG" },
      { c: CANDIDATES[4], alt: undefined, id: "CandH" },
    ].map(({ c, alt, id }) => {
      const Bound: React.FC = () => <CloseUp cand={c} alt={alt} />;
      return (
        <Composition
          key={id}
          id={id}
          component={Bound}
          durationInFrames={90}
          fps={30}
          width={CLOSE_W}
          height={CLOSE_H}
        />
      );
    })}
  </>
));
