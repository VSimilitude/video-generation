import React from "react";
import { CharacterFrame, Face, useRig, type CharacterProps } from "../Character";
import { kidTheme } from "../theme";

// Puff — the hero of episode two. One small puff of air with a face.
//
// The design problem this file solves is unusual: the character is *invisible*
// and the story says so out loud, so the drawing has to be legible while it is
// mostly not there. Puff plays the whole of Act One at forty percent opacity
// and dips to twenty-five in Scene 6; he does not reach full strength until
// Scene 32. That ramp is the character arc (script.md, "Puff's opacity is the
// arc") and it is the one thing a scene must never fudge — a scene that needs
// him more readable darkens the *background* behind him (`SoftShade` in the
// episode kit), it does not raise `opacity`.
//
// Three decisions follow from that, and they are the whole character:
//
//   1. His alphas are weighted, not uniform. `opacity` is a single knob, but
//      the fill fades *faster* than the outline and the outline faster than the
//      face (see ALPHA below). At 25% the vapour has all but gone and what is
//      left on screen is a pale face with two dark eyes in it — which is the
//      correct read, because the eyes are the anchor. A viewer must be able to
//      find his face instantly at every point on the ramp.
//   2. He is an *open* form. Drip is a solid teardrop; Puff is a lobed cloud of
//      vapour whose outline is a dashed stroke that streams slowly around him,
//      so the silhouette is never closed and never quite the same twice. The
//      lobes are three detuned sines, in the same spirit as the rig's mouth.
//   3. He travels more than anyone in the series so far. `bank` takes degrees
//      straight from `moveAlong().angle`, so a flight is two lines: move along
//      the arc, bank into it.
//
// Everything is a pure function of the frame, like the rest of the rig.

const W = 340;
const H = 340;

/** Body radius in local units. The box is square and he is centred in it. */
const R = 96;

export type PuffPose = "rest" | "wave" | "brace" | "cheer" | "point" | "hug";

export type PuffProps = CharacterProps & {
  /**
   * **The arc.** 0..1, defaulting to Act One's forty percent. Weighted
   * internally: see ALPHA. Never animate this to make him easier to see —
   * darken what is behind him instead.
   */
  opacity?: number;
  /**
   * Puffed-up cheeks, 0..1. The body swells around a face that does not, which
   * is what reads as "holding a breath": the dandelion in Scene 7 and the
   * PUUUSH in Scene 31.
   */
  swell?: number;
  /**
   * Banking angle in degrees, for a character in flight. Feed it
   * `moveAlong(...).angle` and he leans into his own path.
   */
  bank?: number;
  arms?: boolean;
  pose?: PuffPose;
  /** Wave size 0..1, for `pose="wave"`. Scene 5's wave is smaller than 4's. */
  wave?: number;
  /** Trailing wisps behind him. 0 turns them off (a Puff sitting still). */
  wisps?: number;
  /** Ground contact shadow. Off by default — he floats for a living. */
  shadow?: boolean;
};

/**
 * The opacity weighting, and the most important six lines in the file.
 *
 * A single alpha applied to the whole character disappears at 25%: the fill and
 * the outline are similar values against grass, so they vanish together and
 * take the face with them. Splitting them by exponent keeps the *hierarchy*
 * intact all the way down — at any point on the ramp the face is the most
 * present thing on screen, then the outline, then the vapour.
 *
 *   p     fill   edge   face
 *   0.25  0.15   0.50   0.53
 *   0.40  0.26   0.63   0.66
 *   0.55  0.40   0.74   0.76
 *   0.70  0.54   0.84   0.85
 *   1.00  0.86   1.00   1.00
 */
const ALPHA = {
  fill: (p: number) => Math.min(1, p ** 1.25 * 0.86),
  edge: (p: number) => Math.min(1, p ** 0.5),
  face: (p: number) => Math.min(1, p ** 0.45),
};

export const Puff: React.FC<PuffProps> = (props) => {
  const rig = useRig(props);
  const {
    opacity = 0.4,
    swell = 0,
    bank = 0,
    arms = true,
    wave = 1,
    wisps = 3,
    shadow = false,
  } = props;
  const emotion = typeof props.emotion === "string" ? props.emotion : props.emotion?.emotion;
  const pose =
    props.pose ??
    (emotion === "excited" ? "cheer" : emotion === "scared" ? "hug" : "rest");

  const p = Math.max(0, Math.min(1, opacity));
  const fillA = ALPHA.fill(p);
  const edgeA = ALPHA.edge(p);
  const faceA = ALPHA.face(p);

  const t = rig.frame / rig.fps;
  // The silhouette's own clock, offset per character like everything else in
  // the rig, so two puffs on screen never ripple together.
  const st = t + rig.phase * 1.7;

  // Swell is volume, not scale: he goes wide faster than he goes tall, and the
  // face stays exactly the size it was. That difference is the puffed cheek.
  const sw = Math.max(0, Math.min(1, swell));
  const bodySx = 1 + 0.3 * sw;
  const bodySy = 1 + 0.22 * sw;

  // Accessories ride the *lagged* breath (see Rig.trail): wisps that move on
  // the same frame as the body read as welded to it.
  const lag = rig.trail.dy;

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox="-170 -170 340 340"
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      {shadow ? (
        <ellipse cx={0} cy={150} rx={78} ry={14} fill={kidTheme.ink} opacity={0.1 * p} />
      ) : null}

      <g transform={`rotate(${bank})`}>
        {/* Behind everything: what he leaves in the air on his way past. */}
        {wisps > 0 ? (
          <Wisps count={wisps} t={st} lag={lag} settle={rig.headSettle} alpha={edgeA} />
        ) : null}

        <g transform={`scale(${bodySx} ${bodySy})`}>
          <Tail t={st} alpha={edgeA} />
          <Body t={st} frame={rig.frame} fill={fillA} edge={edgeA} swell={sw} />
          {arms ? (
            <Arms pose={pose} swing={lag * 0.4} t={st} wave={wave} alpha={edgeA} />
          ) : null}
        </g>

        {/* The face is a group of its own at the *highest* alpha, and it is
            drawn at a constant size however far the body has swelled. The pale
            core under it is what the eyelids are painted in (see Face's `skin`
            note), so it has to sit inside this group at full local alpha —
            which is also why he reads as a face wearing a cloud rather than a
            cloud with a face in it. That is the correct hierarchy for a
            character who spends an act at forty percent. */}
        <g opacity={faceA}>
          <ellipse cx={10} cy={-4 + sw * 10} rx={102} ry={86} fill={kidTheme.airLight} opacity={0.4} />
          <ellipse cx={10} cy={-4 + sw * 10} rx={73} ry={62} fill={kidTheme.airLight} />
          <Face
            rig={rig}
            x={10}
            y={-6 + sw * 10}
            size={1.24}
            eyeScale={1.04}
            skin={kidTheme.airLight}
            // Pink over near-white needs no help; the default strength would
            // put two hot spots on a pale face.
            blushColor="#ff9bb6"
            blushStrength={0.8}
          />
        </g>
      </g>
    </CharacterFrame>
  );
};

// --- the body --------------------------------------------------------------

/**
 * The vapour and its streaming edge.
 *
 * The fill and the outline are the *same* path drawn twice: filled at the low
 * alpha, then stroked with a dash pattern that crawls around the perimeter. The
 * dashes are the whole trick — a closed outline reads as a balloon, and a set
 * of arcs that never quite meets reads as air.
 */
const Body: React.FC<{
  t: number;
  frame: number;
  fill: number;
  edge: number;
  swell: number;
}> = ({ t, frame, fill, edge, swell }) => {
  const d = puffBlob(R, t, 0.9);
  return (
    <g>
      <path d={d} fill={kidTheme.air} opacity={fill} />
      {/* An inner highlight, so the vapour has some depth at high opacity and
          costs nothing at low. */}
      <path
        d={puffBlob(R * 0.6, t + 1.4, 0.88)}
        fill={kidTheme.airLight}
        opacity={fill * 0.55}
        transform="translate(14 -16)"
      />
      {swell > 0.02 ? (
        <g opacity={fill * 1.15}>
          <ellipse cx={-62} cy={22} rx={30 * swell + 6} ry={26 * swell + 6} fill={kidTheme.air} />
          <ellipse cx={78} cy={22} rx={30 * swell + 6} ry={26 * swell + 6} fill={kidTheme.air} />
        </g>
      ) : null}
      <path
        d={d}
        fill="none"
        stroke={kidTheme.airEdge}
        strokeWidth={10}
        strokeLinecap="round"
        // Long strokes with real gaps in them; the offset crawls so the edge
        // is permanently streaming around him at about a fifth of a turn a
        // second. Slow enough that a still looks drawn, not dashed.
        strokeDasharray="112 26 64 22 84 28"
        strokeDashoffset={-frame * 0.62}
        opacity={edge}
      />
    </g>
  );
};

/**
 * The curl — a tapering ribbon off the crown, winding three quarters of a turn
 * back on itself. A cowlick made of air.
 *
 * It sat at the lower left for two passes and read as a lasso hanging off him;
 * on top it does three jobs instead. It breaks the silhouette, it rhymes with
 * Drip's teardrop tip (the same trick: a head shape with one thing sticking up
 * out of it), and it is the one part of him that is unambiguously *moving air*
 * rather than a small cloud.
 */
const Tail: React.FC<{ t: number; alpha: number }> = ({ t, alpha }) => (
  <path d={curlTail(t)} fill={kidTheme.airEdge} opacity={alpha * 0.92} />
);

/** What he leaves behind him in the air. */
const Wisps: React.FC<{
  count: number;
  t: number;
  lag: number;
  settle: number;
  alpha: number;
}> = ({ count, t, lag, settle, alpha }) => (
  <g transform={`translate(0 ${lag * 2.2})`} opacity={alpha * 0.5}>
    {Array.from({ length: count }, (_, i) => {
      const y = -40 + i * 42 + Math.sin(t * 0.9 + i * 2.1) * 7;
      const len = 116 + i * 24;
      const s = Math.sin(t * 1.15 + i * 1.7);
      // An emotion change kicks the wisps and they ring down — follow-through
      // on the one part of him light enough to show it. `headSettle` is already
      // a damped `settleWave`, so this is that ring arriving a wisp later.
      const kick = settle * (3.2 - i * 0.6);
      return (
        <path
          key={i}
          d={
            `M -116 ${y}` +
            ` q ${-len * 0.36} ${s * 15 + kick} ${-len * 0.62} ${-9 + s * 9}` +
            ` q ${-len * 0.26} ${-s * 13} ${-len * 0.3} ${7 - s * 7}`
          }
          fill="none"
          stroke={kidTheme.airEdge}
          strokeWidth={8 - i * 1.6}
          strokeLinecap="round"
          opacity={0.9 - i * 0.22}
        />
      );
    })}
  </g>
);

// --- arms ------------------------------------------------------------------

// Tiny, and drawn *in front* of the body rather than behind it: Puff's fill is
// translucent, so an arm hidden behind the silhouette would show through as a
// darker smear rather than disappearing. Each path starts just inside the edge
// and ends at the hand.
const ARM_PATHS: Record<PuffPose, string> = {
  rest: "M -44 36 Q -86 50 -106 58",
  wave: "M -48 18 Q -96 -18 -98 -70",
  brace: "M -44 34 Q -96 36 -126 24",
  cheer: "M -48 10 Q -106 -26 -94 -80",
  point: "M -44 26 Q -100 20 -138 12",
  hug: "M -48 36 Q -86 20 -58 -2",
};

const HAND_AT: Record<PuffPose, [number, number]> = {
  rest: [-106, 58],
  wave: [-98, -70],
  brace: [-126, 24],
  cheer: [-94, -80],
  point: [-138, 12],
  hug: [-58, -2],
};

const Arms: React.FC<{
  pose: PuffPose;
  swing: number;
  t: number;
  wave: number;
  alpha: number;
}> = ({ pose, swing, t, wave, alpha }) => {
  const d = ARM_PATHS[pose];
  const [hx, hy] = HAND_AT[pose];
  // Only `wave` actually waves; everything else just rides the breath late.
  const flap = pose === "wave" ? Math.sin(t * 7.4) * 20 * Math.max(0, Math.min(1, wave)) : 0;
  const spread = pose === "wave" ? 0.55 + 0.45 * Math.max(0, Math.min(1, wave)) : 1;
  return (
    <g transform={`translate(0 ${swing})`} opacity={alpha}>
      {[-1, 1].map((s) => (
        <g key={s} transform={s === 1 ? "scale(-1 1)" : undefined}>
          <g transform={`translate(-46 26) scale(${spread}) rotate(${flap}) translate(46 -26)`}>
            <path
              d={d}
              stroke={kidTheme.airEdge}
              strokeWidth={17}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx={hx} cy={hy} r={15} fill={kidTheme.airEdge} />
          </g>
        </g>
      ))}
    </g>
  );
};

// --- geometry --------------------------------------------------------------

/** Catmull-Rom through the sample points, as one closed cubic path. */
function smoothClosedPath(pts: Array<[number, number]>): string {
  const n = pts.length;
  const at = (i: number): [number, number] => pts[((i % n) + n) % n];
  const f = (v: number): string => v.toFixed(1);
  let d = `M ${f(at(0)[0])} ${f(at(0)[1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d} Z`;
}

/**
 * The vapour outline.
 *
 * Three things are happening to one circle, and all three are load-bearing:
 *
 *   lobes  three detuned frequencies, each drifting at its own rate, so the
 *          edge is scalloped like vapour and has no countable period (same
 *          principle as `mouthAmplitude`).
 *   sweep  a directional stretch that pulls the *left* side out into a soft
 *          wing. Without it he is a ball with a face on it — the first pass
 *          was, and it read as a pearl. The asymmetry is what makes the
 *          silhouette a comma of air travelling to the right.
 *   squash wider than tall, because a puff spreads.
 */
function puffBlob(r: number, t: number, squash: number): string {
  const N = 44;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const wob =
      0.15 * Math.sin(3 * a + t * 0.9) +
      0.075 * Math.sin(5 * a - t * 0.62) +
      0.04 * Math.sin(7 * a + t * 1.31);
    // 1 at the far left, 0 at the far right.
    const back = (0.5 - 0.5 * Math.cos(a)) ** 1.7;
    const rr = r * (1 + wob) * (1 + 0.22 * back);
    // The wing tapers as it reaches back, rather than ballooning.
    const sy = squash * (1 - 0.26 * back);
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr * sy]);
  }
  return smoothClosedPath(pts);
}

/**
 * The curl: a tapering ribbon that leaves the underside of the wing and winds
 * three quarters of a turn back on itself.
 *
 * Three quarters, not a full turn — the first pass closed the loop and the
 * result read as a lasso hanging off him rather than as air curling. A curl
 * that does not meet its own start is the difference.
 */
function curlTail(t: number): string {
  const cx = -24;
  const cy = -112;
  const N = 24;
  const outer: string[] = [];
  const inner: string[] = [];
  const f = (v: number): string => v.toFixed(1);
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    // Unwinds a few degrees on its own slow cycle: a curl frozen at one angle
    // is the tell that a character is a decal.
    const a = 0.16 * Math.PI + u * 1.5 * Math.PI + Math.sin(t * 0.5) * 0.08;
    const rad = 47 - 35 * u;
    const w = (22 * (1 - u) ** 0.85 + 2) / 2;
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad;
    const nx = Math.cos(a);
    const ny = Math.sin(a);
    outer.push(`${f(px + nx * w)} ${f(py + ny * w)}`);
    inner.push(`${f(px - nx * w)} ${f(py - ny * w)}`);
  }
  inner.reverse();
  return `M ${outer[0]} L ${outer.slice(1).join(" L ")} L ${inner.join(" L ")} Z`;
}
