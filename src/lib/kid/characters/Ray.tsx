import React from "react";
import { CharacterFrame, Face, useRig, type CharacterProps } from "../Character";
import { kidTheme } from "../theme";

// Ray — the hero of episode three. One beam of sunlight, eight minutes old.
//
// The design problem: he is *white*, he spends most of the episode over bright
// painted plates, and the story's whole first act is him being wrong about
// exactly that. Three decisions come out of it and they are the character.
//
//   1. He is a BEAM, not a star. Sunny is a disc with rays going out in every
//      direction; Ray is a lozenge with a rounded nose and a tail that tapers
//      away behind him, and his light streams *backwards along his own path*.
//      One is a source, the other is a thing travelling, and a six-year-old has
//      to be able to tell them apart in the same frame (Scenes 3, 4, 13, 23).
//   2. His legibility is carried by the OUTLINE, not by the fill. A warm-white
//      body on a cyan sky or a gold sun has almost no value contrast, so the
//      edge is a chunky `sunDeep` stroke and the face sits on a flat core that
//      is the palest thing in frame. `edge` is overridable for the two scenes
//      staged against gold. This is the Puff lesson (the hierarchy has to
//      survive the background) arriving at the opposite end of the value scale.
//   3. `brightness` is the arc, and nobody mentions it. He plays Act One a
//      little dimmer and plainer — smaller halo, cooler core, no spectrum in
//      the edge — and from Scene 13 he is warmer and fuller with the seven
//      colours faintly visible in his outline for the rest of the episode
//      (script.md, Scene 13: "Nobody ever says a word about that"). Like
//      Puff's opacity ramp, a scene that wants him more readable darkens what
//      is *behind* him rather than moving the number.
//
// The seven colours he comes apart into are `RayShard` at the foot of this
// file: the same face on a much cheaper body, taking one hue. The split itself
// is **staged motion in the scene**, not a mutation of this component — seven
// shards fade up along an arc as Ray fades down, so any frame renders alone and
// the whole beat is a pure function of the frame like everything else.

/** Natural SVG box height, for an episode's `CHAR_BOX`. */
export const RAY_BOX = 320;
/** Natural SVG box height of one colour shard. */
export const RAY_SHARD_BOX = 200;

const W = 380;
const H = RAY_BOX;
/** Body radius in local units. */
const R = 92;

/** The warm white he is made of. Flat — see the `skin` note in Character.tsx. */
const CORE = "#fffdf2";
const CORE_WARM = "#fff5d8";
const GLOW = kidTheme.sunLight;
const EDGE = kidTheme.sunDeep;

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
   * **The arc.** 0..1. Act One's sulk sits around 0.6 (smaller halo, cooler
   * core); from Scene 13 he is 1. Never animate this to make him easier to see
   * — darken what is behind him instead.
   */
  brightness?: number;
  /**
   * How much of the seven is visible in his outline, 0..1. Zero for the whole
   * of Act One; a low number (~0.5) from Scene 13 onward. It is *faint* on
   * purpose: the script mandates the detail and forbids anybody mentioning it,
   * so it has to be findable and never announced.
   */
  spectrum?: number;
  /**
   * Banking angle in degrees, for a character in flight. Feed it
   * `moveAlong(...).angle` and he leans into his own path. He travels more than
   * anyone in the series, so this is the prop that gets used.
   */
  bank?: number;
  /** Light streaming back along his path. 0 for a Ray sitting still. */
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

  const b = Math.max(0, Math.min(1, brightness));
  const t = rig.frame / rig.fps;
  // His own clock, offset per character like everything else in the rig.
  const st = t + rig.phase * 1.7;
  const d = beamBlob(R, st);
  // Accessories ride the *lagged* breath (see Rig.trail).
  const lag = rig.trail.dy;

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
      <g transform={`rotate(${bank})`} opacity={opacity}>
        {/* The light he is trailing, behind everything. Not rays: three
            tapering streaks running back along the path he came in on, which
            is the one thing that separates a beam from a small sun. */}
        {streak > 0.02 ? <Streaks t={st} lag={lag} strength={streak * (0.5 + 0.5 * b)} /> : null}

        {/* Radiance. Concentric flat ellipses rather than a radial gradient:
            a gradient needs a per-instance id, and seven shards plus Ray share
            one document. Four rings read as soft at this size. */}
        <Halo b={b} t={st} />

        <Body d={d} b={b} edge={edge} />
        {spectrum > 0.01 ? <SpectrumEdge d={d} strength={spectrum} frame={rig.frame} /> : null}

        {arms ? <Arms pose={pose} swing={lag * 0.4} t={st} wave={wave} edge={edge} /> : null}

        {/* The face, on a flat core. The core is what the eyelids are painted
            in (Face's `skin` note), so it stays a single flat colour however
            bright he is — the warmth lives in the ring *around* it. */}
        <g>
          <ellipse cx={26} cy={-2} rx={80} ry={68} fill={CORE_WARM} opacity={0.35 + 0.45 * b} />
          <ellipse cx={26} cy={-2} rx={62} ry={54} fill={CORE} />
          <Face
            rig={rig}
            x={26}
            y={-4}
            size={1.2}
            eyeScale={1.02}
            skin={CORE}
            // Pink over near-white needs no help; the default strength puts two
            // hot spots on a pale face (the Puff finding, same problem).
            blushColor="#ffa06b"
            blushStrength={0.85}
          />
        </g>
      </g>
    </CharacterFrame>
  );
};

// --- the body --------------------------------------------------------------

const Body: React.FC<{ d: string; b: number; edge: string }> = ({ d, b, edge }) => (
  <g>
    <path d={d} fill={CORE_WARM} opacity={0.55 + 0.35 * b} />
    {/* An inner light, offset towards the nose, so the lozenge has a direction
        even when he is standing still. Big — it is most of his area, and it is
        what stops a warm-white body from reading as an orange one once the
        outline is on it. */}
    <path d={beamBlobStatic(R * 0.8)} fill={CORE} opacity={0.9} transform="translate(18 -6)" />
    <path
      d={d}
      fill="none"
      stroke={edge}
      // Nine, not eleven. At the scales he actually plays (0.44 in the crowd,
      // 0.62 crossing space) an eleven-pixel amber stroke around a hundred-pixel
      // white body reads as an *orange* character, which is the one thing he
      // must not be — he is white light and the whole first act is about it.
      strokeWidth={9}
      strokeLinejoin="round"
      strokeLinecap="round"
      // Solid, unlike Puff's dashes: Puff's open edge says "this is not quite
      // there", and Ray's whole problem is that he thinks he is nothing. The
      // outline is the one part of him that is unambiguous.
      opacity={0.72 + 0.28 * b}
    />
  </g>
);

/**
 * The soft radiance. Four flat rings at falling alpha — from the outside in,
 * so the innermost is the brightest — scaled by `brightness`, with a very slow
 * pulse so a still looks drawn and a shot looks alive.
 */
const Halo: React.FC<{ b: number; t: number }> = ({ b, t }) => {
  const breathe = 1 + 0.035 * Math.sin(t * 1.1);
  const size = (0.62 + 0.38 * b) * breathe;
  return (
    <g>
      {[
        [2.35, 0.07],
        [1.92, 0.11],
        [1.58, 0.15],
        [1.28, 0.2],
      ].map(([k, a]) => (
        <ellipse
          key={k}
          cx={10}
          cy={0}
          rx={R * k * size}
          ry={R * k * 0.82 * size}
          fill={GLOW}
          opacity={a * (0.5 + 0.5 * b)}
        />
      ))}
    </g>
  );
};

/**
 * The seven, faintly, in his own outline.
 *
 * The same body path stroked seven times, each showing exactly one seventh of
 * it, laid end to end around the edge.
 *
 * `pathLength={1}` is what makes that exact and cheap: it renormalises the
 * path's own length to 1 for dash purposes, so a seventh is literally `1/7`
 * whatever the outline is doing this frame. The first pass estimated the
 * perimeter from the radius instead, and the estimate was wrong enough that the
 * bands bunched at the tail and read as a coloured smear behind him rather than
 * as colour *in his edge*. Measuring the real length would mean a DOM read, and
 * the rig is a pure function of the frame.
 */
const SpectrumEdge: React.FC<{ d: string; strength: number; frame: number }> = ({
  d,
  strength,
  frame,
}) => (
  <g opacity={Math.max(0, Math.min(1, strength)) * 0.75}>
    {SPECTRUM.map((c, i) => (
      <path
        key={c.name}
        d={d}
        fill="none"
        stroke={c.fill}
        strokeWidth={10}
        strokeLinecap="butt"
        pathLength={1}
        strokeDasharray={`${1 / SPECTRUM.length} ${1 - 1 / SPECTRUM.length}`}
        // A very slow crawl, about one turn a minute: the colours are
        // travelling together, which is the sentence Act One ends on.
        strokeDashoffset={-(i / SPECTRUM.length + frame * 0.0006)}
      />
    ))}
  </g>
);

/** What he leaves behind him: light streaming back along his path. */
const Streaks: React.FC<{ t: number; lag: number; strength: number }> = ({
  t,
  lag,
  strength,
}) => (
  <g transform={`translate(0 ${lag * 2})`} opacity={strength * 0.8}>
    {[0, 1, 2].map((i) => {
      const y = -28 + i * 28 + Math.sin(t * 0.9 + i * 2.1) * 5;
      const len = 210 + i * 52;
      const s = Math.sin(t * 1.3 + i * 1.7);
      // They start *at* the tail tip rather than out in space behind it, so
      // they read as light streaming off him and not as three drawn lines.
      return (
        <path
          key={i}
          d={`M ${-R * 1.35} ${y} q ${-len * 0.5} ${s * 8} ${-len} ${-4 + s * 6}`}
          fill="none"
          stroke={GLOW}
          strokeWidth={20 - i * 5}
          strokeLinecap="round"
          opacity={0.8 - i * 0.22}
        />
      );
    })}
  </g>
);

// --- arms ------------------------------------------------------------------

// Tiny, and drawn *in front* of the body: his fill is near-white, so an arm
// behind it would be invisible rather than hidden. Warm amber, the one colour
// on him that is not white.
const ARM_PATHS: Record<RayPose, string> = {
  rest: "M -30 34 Q -74 48 -96 56",
  wave: "M -34 16 Q -84 -18 -88 -70",
  cheer: "M -34 8 Q -96 -26 -86 -80",
  point: "M -30 24 Q -90 18 -128 10",
  brace: "M -30 32 Q -86 34 -116 22",
  hug: "M -34 34 Q -76 18 -48 -4",
};

const HAND_AT: Record<RayPose, [number, number]> = {
  rest: [-96, 56],
  wave: [-88, -70],
  cheer: [-86, -80],
  point: [-128, 10],
  brace: [-116, 22],
  hug: [-48, -4],
};

const Arms: React.FC<{
  pose: RayPose;
  swing: number;
  t: number;
  wave: number;
  edge: string;
}> = ({ pose, swing, t, wave, edge }) => {
  const d = ARM_PATHS[pose];
  const [hx, hy] = HAND_AT[pose];
  const flap =
    pose === "wave" ? Math.sin(t * 7.4) * 20 * Math.max(0, Math.min(1, wave)) : 0;
  const spread = pose === "wave" ? 0.55 + 0.45 * Math.max(0, Math.min(1, wave)) : 1;
  return (
    <g transform={`translate(0 ${swing})`}>
      {[-1, 1].map((s) => (
        <g key={s} transform={s === 1 ? "scale(-1 1)" : undefined}>
          <g transform={`translate(-32 24) scale(${spread}) rotate(${flap}) translate(32 -24)`}>
            <path
              d={d}
              stroke={edge}
              strokeWidth={15}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx={hx} cy={hy} r={13} fill={edge} />
          </g>
        </g>
      ))}
    </g>
  );
};

// --- geometry --------------------------------------------------------------

/**
 * Quadratic-midpoint smoothing through sample points, as one closed path.
 *
 * The kit has two other copies of this idea and both are deliberate: Puff's
 * hero outline uses Catmull-Rom cubics through 44 samples, `AirBlob`'s crowd
 * uses quadratic midpoints through 18. At the 40 samples used here the two are
 * visually indistinguishable and this one is a third of the path data, so Ray
 * takes the cheap smoothing at the high sample count. A fourth copy is the
 * point at which it should be promoted; it is not there yet, and neither of the
 * existing two can be changed without re-verifying episodes one and two.
 */
function smoothClosed(pts: Array<[number, number]>): string {
  const n = pts.length;
  const mid = (a: [number, number], b: [number, number]): [number, number] => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];
  const f = (p: [number, number]): string => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M ${f(mid(pts[n - 1], pts[0]))}`;
  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    d += ` Q ${f(cur)} ${f(mid(cur, next))}`;
  }
  return `${d} Z`;
}

/**
 * The beam outline: a lozenge with a blunt rounded nose to the right and a tail
 * that tapers away to the left.
 *
 * Three things are happening to one circle:
 *
 *   tail     a directional stretch that pulls the left side out *and squashes
 *            it vertically*, so it comes to a soft point instead of ballooning.
 *            Puff's equivalent wing widens; this one narrows, and that single
 *            sign difference is beam-versus-vapour.
 *   shimmer  two detuned frequencies at small amplitude. Light shimmers at its
 *            edge; it does not billow, so this is a quarter of Puff's.
 *   squash   slightly wider than tall, because he is going somewhere.
 */
function beamBlob(r: number, t: number, seed = 0): string {
  const N = 40;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const shimmer =
      0.042 * Math.sin(4 * a + t * 2.1 + seed) + 0.024 * Math.sin(7 * a - t * 1.5 + seed * 1.3);
    // 1 at the far left, 0 at the far right.
    const tail = (0.5 - 0.5 * Math.cos(a)) ** 1.5;
    const rr = r * (1 + shimmer) * (1 + 0.72 * tail);
    const sy = 0.82 * (1 - 0.7 * tail);
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr * sy]);
  }
  return smoothClosed(pts);
}

/** The same shape with no shimmer, for the inner light. */
function beamBlobStatic(r: number): string {
  return beamBlob(r, 0);
}

// ---------------------------------------------------------------------------
// The seven — one colour shard
// ---------------------------------------------------------------------------

export type RayShardProps = CharacterProps & {
  /** Which of the seven. Index into `SPECTRUM`, or the entry itself. */
  color: SpectrumColor | number;
  /** Whole-shard alpha, for the fade in a split or a merge. */
  opacity?: number;
  /** Banking angle in degrees, for a shard in flight. */
  bank?: number;
  /** Tiny arms. Off by default: seven pairs of arms is a lot of frame. */
  arms?: boolean;
};

/**
 * One seventh of Ray, with his face on it.
 *
 * script.md is explicit that the seven are a **crowd, not a cast** — they bob,
 * wave, march and ricochet, and not one of them ever has a line. So this is
 * deliberately the cheap body (a round blob, not the beam lozenge: a shard is a
 * piece that came out, not a beam in its own right) carrying the *expensive*
 * part, which is the face. Seven faces that are recognisably his is the whole
 * of Scene 9, and a child who cannot see that they are all Ray has watched a
 * special effect instead of a fact.
 *
 * Seven of these is a fixed-length list in a scene, so the hook count never
 * changes across a frame — see PROCESS.md §5 on why that matters.
 */
export const RayShard: React.FC<RayShardProps> = (props) => {
  const rig = useRig({ emotion: "happy", ...props });
  const c = typeof props.color === "number" ? SPECTRUM[props.color % SPECTRUM.length] : props.color;
  const { opacity = 1, bank = 0, arms = false } = props;
  const box = RAY_SHARD_BOX;
  const r = 62;
  const t = rig.frame / rig.fps;
  const d = shardBlob(r, t + rig.phase * 1.7);

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
        {/* A whisper of the hue around him, so seven of them in a row glow
            into each other the way a rainbow does. */}
        {/* Two rings, and both of them tinted.
            A single 40%-opaque pale ellipse was the first attempt and a still of
            the seven standing on a sunlit lawn showed what it actually is: a
            grey coin behind every shard. A wash that is *paler* than the shard
            and *darker* than a bright background cannot glow — it can only
            desaturate. So the outer ring carries the hue itself at low alpha
            (it tints rather than greys) and the inner one carries the light
            partner at an alpha high enough to actually be lighter than a lawn. */}
        <ellipse cx={0} cy={0} rx={r * 1.5} ry={r * 1.34} fill={c.fill} opacity={0.2} />
        <ellipse cx={0} cy={0} rx={r * 1.2} ry={r * 1.1} fill={c.light} opacity={0.55} />
        <path d={d} fill={c.fill} />
        <path d={shardBlob(r * 0.62, 0)} fill={c.light} opacity={0.6} transform="translate(6 -12)" />
        <path
          d={d}
          fill="none"
          stroke={c.deep}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        {arms ? <ShardArms edge={c.deep} swing={rig.trail.dy * 0.4} /> : null}
        <Face
          rig={rig}
          x={0}
          y={2}
          size={0.94}
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

const ShardArms: React.FC<{ edge: string; swing: number }> = ({ edge, swing }) => (
  <g transform={`translate(0 ${swing})`}>
    {[-1, 1].map((s) => (
      <g key={s} transform={s === 1 ? "scale(-1 1)" : undefined}>
        <path
          d="M -26 22 Q -58 32 -72 38"
          stroke={edge}
          strokeWidth={11}
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={-72} cy={38} r={9} fill={edge} />
      </g>
    ))}
  </g>
);

/** A shard's outline: round, gently wobbling, no wing and no tail. */
function shardBlob(r: number, t: number): string {
  const N = 22;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const wob = 0.06 * Math.sin(3 * a + t * 1.5) + 0.035 * Math.sin(5 * a - t * 1.1);
    const rr = r * (1 + wob);
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.9]);
  }
  return smoothClosed(pts);
}
