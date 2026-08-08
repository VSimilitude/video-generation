import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { RayShard, RAY_SHARD_BOX, SPECTRUM } from "./characters/Ray";
import { kidEase, type Pt, type Travel } from "./rig";
import type { WideLayerProps } from "./staging";

// THE SEVEN, AS A CAST — the ensemble kit that came out of episode three.
//
// `characters/Ray.tsx` owns the *bodies*: Ray himself (candidate F2, a face
// floating over an independent wave ribbon) and `RayShard`, one of the seven
// colours, with the frequency ladder (`SHARD_CYCLES`) drawn into it. This file
// owns everything that turns those seven bodies into seven *characters*:
// their identities, their laws of motion, and the one wrapper an act should
// ever stage a shard through.
//
// **It was written once, for episode three, and promoted here unchanged when
// episode four staged Blue and Violet.** Ep 4 needs exactly two of the seven —
// Blue's dawn cameo and Violet's silent garnish — but the table is one
// statement and cherry-picking two rows out of it is how a cast drifts into
// two casts. What moved is data plus arithmetic; the art did not change.
//
// The rule the table exists to enforce (ep-3 revision §2): seven bodies that
// bob identically are a diagram, seven bodies that each move *wrongly in their
// own way* are a cast, and the difference between the two is a lookup table
// rather than new art.
//
// Three things are identity and belong here:
//
//   1. **the phase** — one index per colour, for every episode, forever
//      (`SHARD_PHASE[i]`). A colour keeps its phase in every scene it appears
//      in, or it is four different accidents wearing the same hue.
//   2. **the signature move** — the thing that colour does instead of acting.
//      It is a *law of motion*, not a route: Red's law is "one speed, dead
//      straight"; the scene says where from and where to.
//   3. **the idle** — what they do when the scene is not asking anything of
//      them, which for five of them is most of their screen time.
//
// What does NOT belong here is choreography. There is no scene in this file
// and there must never be: the acts stage, the table supplies who each of
// them is while being staged.
//
// **The paused-frame test governs every one of them.** A signature that only
// exists in motion is not in the episode (the ep-2 backwards-puff finding): a
// child pausing on any frame has to be able to say which one is Red. So each
// law below has a *static* tell as well as a moving one — Red's dead-level
// zero-bank stance, Orange's identical stance exactly one body behind it,
// Yellow's raised arm, Green sitting a third of a body lower than everyone
// else, Blue's cornered trail, Indigo's identical trail four frames stale, and
// Violet's smear of ghosts around a point he never leaves.
//
// And the two blurs are two different *kinds* of blur, which is a hard
// requirement rather than a nicety: **Blue's blur is a change of DIRECTION**
// (an elbowed trail behind a body leaning into the new leg) and **Violet's is
// amplitude IN PLACE** (copies of himself either side of a fixed point, with a
// visibly wider smear than Blue's step and the highest speed of the seven).
// Two bodies with the same generic speed-smear would say the two are the same
// kind of fast, and the entire physics of episode three is that they are not.

/**
 * The seven, by name, in spectrum order. Index `i` is `SPECTRUM[i]` and
 * `SHARD_PHASE[i]` and rung `i` of the frequency ladder, everywhere, forever.
 */
export const SEVEN_NAMES = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
] as const;
export type ShardName = (typeof SEVEN_NAMES)[number];

/**
 * Phases for the seven, one each, so an arc of seven faces never blinks
 * together. Spread irregularly on purpose — an even spacing gives a visible
 * Mexican wave down the line.
 *
 * **These are identities, not decorations.** Nothing should read this array
 * directly — `SEVEN[i].phase` and the `Shard` component carry it so a scene
 * cannot forget to.
 */
export const SHARD_PHASE = [0.7, 4.1, 2.3, 5.8, 1.6, 3.2, 6.4] as const;

/** One colour's identity. Data only — the helpers below do the arithmetic. */
export type ShardIdentity = {
  /** Index into `SPECTRUM`, `SHARD_PHASE` and the frequency ladder. */
  i: number;
  who: ShardName;
  /** Display name, from `SPECTRUM`. */
  name: string;
  /**
   * Whether this colour has lines. Six did in episode three; **Violet never
   * will, in any episode**. He works harder than anybody on screen, is never
   * once looked at, and the joke only survives while he is the only one who
   * never speaks.
   */
  speaks: boolean;
  /** The identity phase. Never pass `SHARD_PHASE[i]` by hand again. */
  phase: number;
  /**
   * Cycles across the ribbon — rung `i` of the frequency ladder. Owned by
   * `RayShard` (`SHARD_CYCLES` in `characters/Ray.tsx`) and copied here for
   * reading, because the ladder and the temperaments are the same statement
   * and a table that lists one without the other invites somebody to change
   * one of them.
   */
  cycles: number;
  /**
   * How much of `SHARD_LEAN` this colour is willing to lean into its own
   * direction of travel, 0..1. Red is 0 because Red does not react to
   * anything, including where he is going; Violet is 0 because Violet does not
   * go anywhere.
   */
  lean: number;
  /**
   * How much of the rig's ordinary breathing this colour does. Red and Orange
   * are damped rather than switched off — a body with a *dead* idle reads as a
   * frozen sprite rather than as a calm character — and Blue is wound up.
   */
  idleScale: number;
  /** The signature move, in one line. Binding. */
  signature: string;
  /** What they do when nothing is being asked of them. */
  idle: string;
};

export const SEVEN: readonly ShardIdentity[] = SEVEN_NAMES.map((who, i) => ({
  i,
  who,
  name: SPECTRUM[i].name,
  speaks: who !== "violet",
  phase: SHARD_PHASE[i],
  cycles: [1, 1.5, 2.1, 2.9, 4, 5.4, 7.2][i],
  lean: [0, 0, 0.5, 0.3, 1, 1, 0][i],
  idleScale: [0.5, 0.5, 1.1, 0.85, 1.25, 1, 1][i],
  signature: [
    "Walks. One unvaried speed, a dead-straight line, and he never reacts to anything crossing his path.",
    "Matches Red's stride exactly, one body-length behind, and never overtakes him.",
    "Waves. At everyone, continuously, including at things that are leaving.",
    "Sits down the instant anything on screen stops moving.",
    "Ricochets. Never travels more than half a frame without changing direction.",
    "Copies Blue's last move four frames late, and arrives after the joke.",
    "Vibrates so hard his own outline blurs. In place — he is the fastest thing in any frame he is in and he never goes anywhere.",
  ][i],
  idle: [
    "Barely bobs, never leans, does not react to anything entering frame. He is already walking.",
    "Red's idle, one body behind it.",
    "Still waving.",
    "Sitting, unless the frame gave him a reason to stand, which it usually did not.",
    "Ricochets in a smaller box. Blue at rest is Blue in a cupboard.",
    "Blue's idle, four frames stale.",
    "Vibrating. There is no other setting.",
  ][i],
}));

/** Look a colour up by name: `shardOf("blue").phase`. */
export function shardOf(who: ShardName): ShardIdentity {
  return SEVEN[SEVEN_NAMES.indexOf(who)];
}

/** The most any of the seven ever leans, in degrees. */
export const SHARD_LEAN = 26;

/**
 * **A heading, turned into a lean.** Degrees in, degrees out.
 *
 * Feeding a heading straight to a `bank` prop is a mistake episode three made
 * twice, and on a shard it is worse than on Ray, because `RayShard` rotates
 * the *whole* body about its centre: at 40° the face swings off to the side of
 * the wave and the pair stops being a character. It also cannot be fixed by
 * scaling the angle down, because a heading is circular: 179° and −179° are
 * the same direction and scaling them gives two opposite leans.
 *
 * So the lean is the **sine** of the heading, which is the only honest reading
 * of it on a body with no front: climbing leans back, diving leans forward,
 * and travelling flat out to the left or the right leans not at all.
 */
export function leanFrom(headingDeg: number, amount: number): number {
  return -Math.sin((headingDeg * Math.PI) / 180) * SHARD_LEAN * amount;
}

// --- the laws of motion ------------------------------------------------------

/**
 * **Red's one speed**, in composition px per second at scale 1.
 *
 * It is a constant rather than a per-scene number because it is the joke: Red
 * crosses every shot he is in at *exactly* this, and a scene that speeds him
 * up to make an entrance land has deleted the character. 108 px/s is just
 * under eighteen seconds to cross the frame, which is slow enough to be a
 * decision and fast enough that he does arrive.
 */
export const RED_SPEED = 108;

/**
 * Red, walking. `t` is seconds; `from` is where he is at `t = 0`.
 *
 * A dead-straight horizontal line at one speed, and the returned `angle` is
 * exactly 0 or 180 — no bow, no ease, no anticipation, none of the things the
 * rest of this kit spends its time on, because the whole of Red is that he
 * does not do them. `moveAlong` is the wrong tool for him on purpose.
 */
export function redWalk(
  t: number,
  from: Pt,
  opts?: { dir?: number; speed?: number },
): Travel {
  const dir = opts?.dir ?? 1;
  const speed = opts?.speed ?? RED_SPEED;
  return { x: from.x + dir * speed * t, y: from.y, angle: dir >= 0 ? 0 : 180 };
}

/**
 * **The follow law**, shared by Orange and Indigo: run somebody else's path,
 * late. Both of them are *the same joke at two lags*, and writing them as one
 * function is what stops them drifting into two different ones.
 *
 * It takes the leader's path as a function of time rather than a position, so
 * the follower is literally the leader's own motion replayed — which is what
 * "matches his stride exactly" and "copies his last move" both mean, and is
 * unfakeable by hand-tuning an offset.
 */
export function trailBy<T>(path: (t: number) => T, t: number, lag: number): T {
  return path(t - lag);
}

/**
 * One body-length, the unit Orange's gap is specified in.
 *
 * 240 rather than the 200 of `RAY_SHARD_BOX`, and the difference is the point:
 * a shard's *drawn* body is a 188-unit ribbon plus a round cap at each end, so
 * it is wider than the box it is placed by. Specified against the box, Orange
 * ends up overlapping Red by about thirty pixels — which on a still reads as
 * one two-headed animal rather than as a man and his second.
 */
export const SHARD_BODY = 240;

/**
 * Orange: Red's path, delayed by exactly the time it takes Red to walk one
 * body length. Not "one body length behind" as a subtraction — as a *delay*,
 * so that on the frame Red turns a corner (he never does) or stops (he never
 * does), Orange does the same thing one body later and still never overtakes.
 *
 *   const red = (tt: number) => redWalk(tt, RED_FROM);
 *   const r = red(t);
 *   const o = orangeFollow(red, t, 0.9 * SHARD_BODY);
 */
export function orangeFollow<T>(
  red: (t: number) => T,
  t: number,
  bodyPx: number = SHARD_BODY,
  speed: number = RED_SPEED,
): T {
  return trailBy(red, t, bodyPx / speed);
}

/** How much of a wave Yellow is doing. The answer is always all of it. */
export const YELLOW_WAVE = 1;

/**
 * Green sits this far below where he was standing, at scale 1.
 *
 * A quarter of a body, and it started life at a third of that. On a sheet of
 * all seven, 34px read as "slightly lower" rather than as "sat down" — and
 * "slightly lower" is not a signature, it is a mistake. At 52 he is
 * unmistakably the one who has settled, in a paused frame, next to six who
 * have not.
 *
 * It is also very nearly the slack there is to use: a shard's ribbon is drawn
 * at local +50 inside a box that runs to +100, so a Green who has dropped 52
 * has put his wave *on the ground he was standing over* and gone no further.
 */
export const GREEN_SIT_DROP = 52;
/** "The instant": five frames, a sixth of a second. Not a decision, a reflex. */
export const GREEN_SIT_FRAMES = 5;

/**
 * Green's sit, 0..1. `changedAt` is the frame the world last started or
 * stopped moving, and `still` is which of the two it did.
 *
 *   const sit = greenSit(frame, beatFrom, frame >= beatFrom);
 *   <Shard who="green" sit={sit} … />
 *
 * A held beat is therefore *automatically* a Green joke, which is the point of
 * him: episode three has forty-one of them and he sits down in every one.
 */
export function greenSit(frame: number, changedAt: number, still: boolean): number {
  const u = kidEase.easeOutQuad(
    Math.max(0, Math.min(1, (frame - changedAt) / GREEN_SIT_FRAMES)),
  );
  return still ? u : 1 - u;
}

/** Frames Blue holds one leg of a ricochet before he changes direction. */
export const BLUE_LEG = 9;
/**
 * How far one leg travels, in px at scale 1 — **bounded by the box he is in**.
 *
 * A leg longer than the box is a leg that spends most of itself being clamped
 * against a wall, and a clamped leg is a short one: the first version of this
 * put a fixed 150–330 into a 400×210 corridor and produced legs of ten pixels,
 * which drew a Blue who twitched instead of ricocheting and a trail with no
 * visible corner in it. So the range is capped at 45%..85% of the box's
 * shorter side. A tight box therefore gives shorter, slower legs at the same
 * nine frames each, which is the right answer: a pinball in a small box
 * changes direction just as often and covers less ground.
 */
export const BLUE_LEG_PX = { min: 150, max: 330 } as const;

/**
 * The frame this kit draws in. 1920×1080 is the format rule (docs/STYLE.md)
 * and the only thing below that needs it is Blue's hard ceiling, which is
 * specified in *frames* rather than in pixels.
 */
const FRAME_WIDTH = 1920;

/**
 * The hard rule: "never travels more than half a frame without changing
 * direction". `BLUE_LEG_PX.max` is well inside it; this is the ceiling a
 * future scene is not allowed to raise past, and `blueRicochet` clamps to it.
 */
export const BLUE_MAX_LEG_PX = FRAME_WIDTH / 2;

/** The box a ricochet happens inside, in composition coordinates. */
export type Box = { x: number; y: number; w: number; h: number };

function hash01(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * The k-th corner of Blue's path, as a pure function of k.
 *
 * A real billiard rather than seven random points: each leg leaves the last
 * corner at a heading that has **turned by at least 62°** from the one before
 * it, and reflects off the walls of the box when it reaches them. Both of
 * those put a corner in the path, and a corner is the whole of Blue — the
 * audience has to be able to see him change his mind, not merely see him fast.
 *
 * Iterated from k = 0 rather than memoised, because everything in this kit is
 * a pure function of the frame and Remotion hands frames to a *pool* of tabs:
 * a cache that survives between frames renders a different film in each tab.
 * A hundred legs of trigonometry is nothing next to one `<Face>`.
 */
function blueCorner(k: number, box: Box, seed: number): Pt {
  const span = Math.min(box.w, box.h);
  const lo = Math.min(BLUE_LEG_PX.min, span * 0.45);
  const hi = Math.min(BLUE_LEG_PX.max, span * 0.85, BLUE_MAX_LEG_PX);
  let x = box.x + box.w / 2;
  let y = box.y + box.h / 2;
  let dir = hash01(seed + 0.5) * Math.PI * 2;
  for (let n = 0; n < k; n++) {
    const h1 = hash01(seed + n * 3.1);
    const h2 = hash01(seed + n * 7.7 + 1.3);
    // A real turn, either way: 62°..148°. Anything less is a wobble.
    dir += ((h1 < 0.5 ? -1 : 1) * ((62 + h2 * 86) * Math.PI)) / 180;
    const len = lo + hash01(seed + n * 5.3 + 2.7) * Math.max(0, hi - lo);
    let nx = x + Math.cos(dir) * len;
    let ny = y + Math.sin(dir) * len;
    // Bounce off the wall by **turning the heading and re-walking the leg**,
    // rather than by reflecting the endpoint. Reflecting the endpoint is the
    // obvious way to do it and it is wrong: it folds the leg back on itself
    // and leaves a *shorter* one, so a Blue near a wall stops travelling and
    // starts twitching. The distance he covers is his whole characterisation,
    // so it is the thing the wall is not allowed to take.
    if (nx < box.x || nx > box.x + box.w) {
      dir = Math.PI - dir;
      nx = x + Math.cos(dir) * len;
      ny = y + Math.sin(dir) * len;
    }
    if (ny < box.y || ny > box.y + box.h) {
      dir = -dir;
      nx = x + Math.cos(dir) * len;
      ny = y + Math.sin(dir) * len;
    }
    x = Math.max(box.x, Math.min(box.x + box.w, nx));
    y = Math.max(box.y, Math.min(box.y + box.h, ny));
  }
  return { x, y };
}

/**
 * **Blue, ricocheting.** `frame` is scene-local; the box is where he is
 * allowed to be.
 *
 * Constant speed along each leg and a hard corner at the end of it — no ease,
 * because a ricochet that decelerates into its own bounce is a float. The
 * `angle` is the heading of the leg he is on, so `bank` leans him into the leg
 * he is on *now* while his trail still points at the one he was on, which is
 * the frame-by-frame read of somebody who has just changed his mind.
 */
export function blueRicochet(frame: number, box: Box, seed = 0): Travel {
  const k = Math.floor(frame / BLUE_LEG);
  const u = frame / BLUE_LEG - k;
  const a = blueCorner(k, box, seed);
  const b = blueCorner(k + 1, box, seed);
  return {
    x: a.x + (b.x - a.x) * u,
    y: a.y + (b.y - a.y) * u,
    angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
}

/**
 * **Blue's blur, and it is a change of DIRECTION.**
 *
 * The path he has been on for the last `BLUE_LEG * 2` frames, as points,
 * oldest first — a window deliberately **two legs long**, so at least one
 * corner is inside it on every frame and there is no paused frame in which
 * Blue looks like something merely travelling fast. Feed it straight to
 * `<Shard trail={…} />`, which fades it from nothing at the old end.
 *
 * It is drawn as a line rather than as ghost bodies for the same reason it is
 * two legs long: ghosts of a body say "this thing is smeared", and a bent line
 * says "this thing turned". Violet gets the ghosts. The two must never be
 * given the same treatment.
 *
 * One leg is roughly one body long, so a one-leg window is a tail that hides
 * behind the body it belongs to. That was the first version and it was
 * invisible on the sheet.
 */
export function blueTrail(
  frame: number,
  box: Box,
  seed = 0,
  span = BLUE_LEG * 2,
): { x: number; y: number }[] {
  const n = 14;
  const out: { x: number; y: number }[] = [];
  for (let s = 0; s <= n; s++) {
    const p = blueRicochet(frame - span + (span * s) / n, box, seed);
    out.push({ x: p.x, y: p.y });
  }
  return out;
}

/** Frames Indigo lands behind Blue. Four. It is in the script as four. */
export const INDIGO_LAG = 4;

/**
 * Indigo: Blue's own path, four frames ago.
 *
 *   const blue = (f: number) => blueRicochet(f, S19_BOX);
 *   const b = blue(frame);
 *   const ind = indigoEcho(blue, frame);
 *
 * Because it is the same function, Indigo inherits Blue's corners — his trail
 * has the same elbow in it, four frames stale, which is the drawing of "does
 * everything Blue does, slightly worse, half a beat late" and is also
 * physics-true (an adjacent wavelength is a faded copy).
 */
export function indigoEcho<T>(blue: (frame: number) => T, frame: number): T {
  return trailBy(blue, frame, INDIGO_LAG);
}

/**
 * **Violet's amplitude**, in px at scale 1, and **his frequency**, in Hz.
 *
 * Sized against Blue rather than picked: Blue's fastest leg is 330px in nine
 * frames, about 37px per frame. Violet's peak speed is `2π · hz · amp` = about
 * 1700 px/s = **57px per frame**, and his smear is 2·amp = 68px wide against
 * Blue's 37px step. So on any frame containing both, Violet is both the faster
 * object and the wider blur — and he achieves it *without going anywhere*,
 * which is the joke.
 */
export const VIOLET_AMP = 34;
export const VIOLET_HZ = 8;

/**
 * Violet, vibrating in place. Returns a displacement, not a position: he is
 * always exactly where the scene put him, plus this.
 *
 * Two incommensurate frequencies (the vertical is 1.37× the horizontal and
 * offset), so the figure never closes into a visible loop — a Lissajous that
 * repeats reads as a tidy little orbit, and Violet is not tidy.
 *
 * Applied automatically by `<Shard who="violet">`, so a scene cannot stage him
 * and forget: there is no frame of any episode in which Violet holds still.
 */
export function violetVibrate(t: number, strength = 1): { dx: number; dy: number } {
  const a = VIOLET_AMP * strength;
  return {
    dx: a * Math.sin(2 * Math.PI * VIOLET_HZ * t),
    dy: a * 0.62 * Math.sin(2 * Math.PI * VIOLET_HZ * 1.37 * t + 1.1),
  };
}

/**
 * The four bands a ricochet trail is drawn in: `[from, to, alpha, width]`
 * along the trail, oldest first. Overlapping at three points instead of
 * thirteen — see the note where it is used.
 */
const TRAIL_BANDS: Array<[number, number, number, number]> = [
  [0, 0.3, 0.12, 8],
  [0.3, 0.56, 0.24, 12],
  [0.56, 0.8, 0.4, 16],
  [0.8, 1, 0.58, 21],
];

export type ShardProps = {
  who: ShardName;
  x: number;
  y: number;
  scale?: number;
  /**
   * **A heading in degrees**, straight from a travel helper (`blueRicochet`,
   * `redWalk`, `moveAlong`). Turned into a lean by `leanFrom` and the colour's
   * own willingness to lean — never used as a rotation. Pass `p.angle`.
   */
  heading?: number;
  /** Green: 0..1 from `greenSit`. Ignored on the other six. */
  sit?: number;
  /** Yellow: wave size, 0..1. Defaults to all of it. */
  wave?: number;
  /** Violet: vibration strength, 0..1. Defaults to all of it. */
  vibrate?: number;
  /** Blue and Indigo: the direction-change blur, from `blueTrail`. */
  trail?: { x: number; y: number }[];
  /**
   * On for Yellow (his wave *is* his characterisation) and off for the other
   * six, unless a scene says otherwise. `arms={false}` on Yellow is therefore
   * a scene deliberately taking his signature away — legitimate in a shot
   * where seven of them are 44px tall and eight raised arms are noise, and a
   * mistake anywhere else.
   */
  arms?: boolean;
  opacity?: number;
  idle?: number;
  eyeLife?: number;
  emotion?: Parameters<typeof RayShard>[0]["emotion"];
  speaking?: boolean;
  look?: Parameters<typeof RayShard>[0]["look"];
  flip?: boolean;
  zIndex?: number;
};

/**
 * **One of the seven, staged.** The way an act should ever reach for a shard.
 *
 *   const Shard = makeShard(WideLayer);   // once, in scenes/common.tsx
 *
 *   <Shard who="blue" x={p.x} y={p.y} heading={p.angle} trail={blueTrail(frame, BOX)} />
 *   <Shard who="green" x={220} y={GROUND} sit={greenSit(frame, beatFrom, held)} />
 *   <Shard who="violet" x={1500} y={480} />
 *
 * It is a thin wrapper over `RayShard` and it stays thin. All it does is put
 * the identity on — and put it on in the places a scene file cannot be trusted
 * to remember, because it has forgotten them before:
 *
 *   - the **phase** comes from the table, always, so a colour blinks on its
 *     own clock in every scene it appears in;
 *   - the **heading** becomes a lean rather than a rotation (`leanFrom`), and
 *     is scaled by the colour's own willingness to do it, so Red stays dead
 *     level however enthusiastic the heading he was handed and Violet — who
 *     has no heading, because he does not travel — stays upright;
 *   - **Yellow is waving** and **Violet is vibrating** whether or not the
 *     scene asked, because those are not things they do, they are what they
 *     are;
 *   - **Green's sit** is one number that moves him down, kills his idle and
 *     flattens him onto the floor, so "sat down" is one prop rather than three
 *     that a later edit can get out of step.
 *
 * What it does NOT do is decide where anybody is. Position, timing, look,
 * emotion and the decision to be on screen at all belong to the scene.
 *
 * **Why it is a factory.** The trail is drawn in the episode's `WideLayer`,
 * whose box is how far past the frame *that* episode ever pulls out — episode
 * three reaches 5200×2900 because Scene 31 shows a planet, episode four does
 * not. The box is per episode; the component is not. Same shape as
 * `makeWideLayer` and `makeBodyGeometry`.
 */
export function makeShard(
  WideLayer: React.FC<WideLayerProps>,
): React.FC<ShardProps> {
  const Shard: React.FC<ShardProps> = ({
    who,
    x,
    y,
    scale = 1,
    heading = 0,
    sit = 0,
    wave,
    vibrate,
    trail,
    arms,
    opacity = 1,
    idle,
    eyeLife,
    emotion,
    speaking,
    look,
    flip,
    zIndex,
  }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const id = shardOf(who);
    const t = frame / fps;

    // Violet's displacement is applied here rather than by the caller so that
    // there is no way to stage him still. It scales with the body, like a
    // vibration would.
    const shake = who === "violet" ? violetVibrate(t, vibrate ?? 1) : { dx: 0, dy: 0 };
    const drop = who === "green" ? sit * GREEN_SIT_DROP : 0;

    return (
      <>
        {trail && trail.length > 1 ? (
          <WideLayer zIndex={(zIndex ?? 14) - 1}>
            {/* Graded in four BANDS rather than per segment, and that is a
                rendering fix rather than a style: fourteen translucent segments
                with round caps overlap at every joint, each overlap composites
                twice, and the trail comes out as a string of beads. Four
                contiguous polylines overlap at three points instead of thirteen,
                and a polyline gets `strokeLinejoin` for free — which is what
                keeps the corner (the entire point of Blue's blur) a corner rather
                than a gap. A gradient would be the obvious answer and is not
                available: it needs a per-instance id and the seven share one
                document. */}
            {TRAIL_BANDS.map(([from, to, alpha, width], k) => {
              const lo = Math.floor((trail.length - 1) * from);
              const hi = Math.ceil((trail.length - 1) * to);
              const d = trail
                .slice(lo, hi + 1)
                .map((p, j) => `${j === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                .join(" ");
              return (
                <path
                  key={k}
                  d={d}
                  fill="none"
                  stroke={SPECTRUM[id.i].fill}
                  strokeWidth={width * scale}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={alpha * opacity}
                />
              );
            })}
          </WideLayer>
        ) : null}
        <RayShard
          color={id.i}
          x={x + shake.dx * scale}
          y={y + (drop + shake.dy) * scale}
          scale={scale}
          phase={id.phase}
          bank={leanFrom(heading, id.lean)}
          // Yellow's arm is his whole characterisation, so it is on unless a
          // scene takes it off; everyone else's is off unless a scene puts it
          // on (seven pairs of arms is a lot of frame).
          arms={arms ?? who === "yellow"}
          pose={who === "yellow" ? "wave" : "rest"}
          wave={wave ?? YELLOW_WAVE}
          // Violet's own body already fizzes at the top of the frequency
          // ladder; this is the *other* blur, the one that is a body moving
          // rather than a wave being short. See the file header.
          //
          // A CONSTANT smear rather than one derived from his instantaneous
          // velocity, and that was a real choice: velocity-derived ghosts
          // collapse to nothing at the two ends of every swing, so a third of
          // the paused frames in the episode would have shown a perfectly
          // crisp Violet. The smear IS the amplitude, which is what the sheet
          // says his blur is, so it is drawn as the amplitude and is there in
          // every frame.
          smear={
            who === "violet"
              ? {
                  dx: VIOLET_AMP * 0.85 * (vibrate ?? 1),
                  dy: VIOLET_AMP * 0.24 * (vibrate ?? 1),
                }
              : undefined
          }
          idle={idle ?? id.idleScale * (who === "green" ? 1 - 0.85 * sit : 1)}
          eyeLife={eyeLife}
          emotion={emotion}
          speaking={speaking}
          look={look}
          opacity={opacity}
          flip={flip}
          zIndex={zIndex}
        />
      </>
    );
  };
  return Shard;
}

/** Re-exported so an episode binding this kit needs one import. */
export { RAY_SHARD_BOX };
