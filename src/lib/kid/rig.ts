// The character rig: every bit of a kid character's motion, as pure frame ->
// number functions. Nothing here touches React, so a character component is
// just "read the rig, draw the shapes", and a still at frame N is always the
// same picture (no state, no randomness that isn't derived from the frame).
//
// The four behaviours, and why each one exists:
//   idle    — a body that holds perfectly still reads as a diagram. A slow
//             squash-and-stretch breath is the cheapest thing that makes a
//             shape read as alive.
//   blink   — eyes that never close read as dead. Blinks are deterministic per
//             character but *irregular*, because a metronome blink is worse
//             than none.
//   talking — mouth amplitude from three detuned sines, so the open/close
//             pattern never repeats on a countable beat.
//   emotion — brows and mouth carry ~90% of it; eye size and pupil size carry
//             the rest. See `EMOTIONS` below.
//
// Every function takes an explicit `phase` so a group of characters is
// desynchronised: same maths, different offset, no two bouncing together.
//
// On top of those four, the rig encodes the handful of classic animation
// principles that pay for themselves at this scale — see "Motion craft" in
// docs/STYLE.md:
//   anticipation     a counter-move before the move (`Entrance.anticipate`).
//   follow-through   nothing stops dead; entrances land with a damped settle
//                    (`settleWave`), accessories trail the body by a few
//                    frames (`Rig.trail`).
//   arcs             things travel on curves, not straight lines (`moveAlong`).
//   slow in/out      no linear ramps anywhere (`kidEase`).
//   secondary action a face never *snaps*: emotions morph over ~8 frames
//                    (`EmotionCue`), and idle eyes drift (`eyeLife`).

// --- easing ----------------------------------------------------------------

const clamp01 = (u: number): number => (u < 0 ? 0 : u > 1 ? 1 : u);

/**
 * The show's easing set. Scenes should reach for these rather than hand-rolling
 * a curve, so two characters accelerating "the same way" actually do.
 *
 * All of them take and return 0..1 and clamp their input, which is what lets
 * them be fed a raw `(frame - at) / duration` without a guard.
 */
export const kidEase = {
  /** Only for things that genuinely are linear — a conveyor, a clock hand. */
  linear: (u: number): number => clamp01(u),
  easeInSine: (u: number): number => 1 - Math.cos((clamp01(u) * Math.PI) / 2),
  easeOutSine: (u: number): number => Math.sin((clamp01(u) * Math.PI) / 2),
  /** The default for anything that starts and stops on screen. */
  easeInOutSine: (u: number): number => 0.5 - 0.5 * Math.cos(clamp01(u) * Math.PI),
  easeInQuad: (u: number): number => clamp01(u) ** 2,
  easeOutQuad: (u: number): number => 1 - (1 - clamp01(u)) ** 2,
  easeInCubic: (u: number): number => clamp01(u) ** 3,
  easeOutCubic: (u: number): number => 1 - (1 - clamp01(u)) ** 3,
  /** Gravity: use for anything falling. */
  gravity: (u: number): number => clamp01(u) ** 2,
  /** Overshoots the target and comes back — the cartoon "arrive". */
  easeOutBack: (u: number, overshoot = 1.7): number => {
    const t = clamp01(u) - 1;
    return 1 + (overshoot + 1) * t ** 3 + overshoot * t ** 2;
  },
  /** Pulls *back* before it leaves — the cartoon "depart". */
  easeInBack: (u: number, overshoot = 1.7): number => {
    const t = clamp01(u);
    return (overshoot + 1) * t ** 3 - overshoot * t ** 2;
  },
  /**
   * 0..1 with a dip below zero first: the whole anticipation principle as one
   * curve. `back` is how far the counter-move goes (in output units), `hold`
   * how much of the duration it occupies.
   */
  anticipate01: (u: number, back = 0.16, hold = 0.3): number => {
    const t = clamp01(u);
    if (t < hold) return -back * Math.sin((t / hold) * Math.PI);
    return kidEase.easeOutBack((t - hold) / (1 - hold), 1.4);
  },
} as const;

/**
 * Damped oscillation for follow-through: 1 at u=0, ringing down to 0 by u≈1.
 *
 * Multiply by an amplitude and add. Pass `phase = -Math.PI / 2` for a *kick*
 * that starts at rest (an emotion settling) rather than at full deflection (an
 * impact, which is already compressed on the frame it lands).
 */
export function settleWave(
  u: number,
  cycles = 1.4,
  decay = 4.5,
  phase = 0,
): number {
  if (u <= 0 || u >= 1) return 0;
  return Math.exp(-decay * u) * Math.cos(u * cycles * Math.PI * 2 + phase);
}

export type Emotion =
  | "neutral"
  | "happy"
  | "excited"
  | "scared"
  | "proud"
  | "grumpy"
  | "amazed"
  | "sad";

export type LookDirection =
  | "camera"
  | "left"
  | "right"
  | "up"
  | "down"
  | "upLeft"
  | "upRight"
  | { x: number; y: number };

export type MouthShape = "curve" | "round" | "wobble";

/**
 * The pose knobs a face is drawn from. Units are "face units" — the Face
 * component works in a 100-wide local box and scales to the character.
 */
export type EmotionSpec = {
  /** Brow vertical offset; negative is raised. */
  browRaise: number;
  /**
   * Brow rotation in degrees, applied mirrored to the two brows. Positive
   * lowers the *inner* ends (angry); negative raises them (worried).
   */
  browAngle: number;
  /** Extra rotation on the character-left brow only — asymmetry reads as smug. */
  browAsym: number;
  eyeScaleX: number;
  eyeScaleY: number;
  /** Constant lid closure 0..1, on top of blinking. Half-lids read as cocky. */
  lidBase: number;
  pupilScale: number;
  mouthWidth: number;
  /** Mouth corner curve; positive is a smile, negative a frown. */
  mouthCurve: number;
  /** Resting mouth opening 0..1 (before talking). */
  mouthOpen: number;
  /** Mouth corner tilt in px — one corner up, for a lopsided grin. */
  mouthTilt: number;
  mouthShape: MouthShape;
  /** Cheek blush opacity 0..1. */
  blush: number;
  /** Head tilt in degrees. */
  tilt: number;
  /** Teeth show when the mouth opens this wide (1 = never). */
  teethAt: number;
};

const BASE: EmotionSpec = {
  browRaise: 0,
  browAngle: 0,
  browAsym: 0,
  eyeScaleX: 1,
  eyeScaleY: 1,
  lidBase: 0,
  pupilScale: 1,
  mouthWidth: 54,
  mouthCurve: 10,
  mouthOpen: 0,
  mouthTilt: 0,
  mouthShape: "curve",
  blush: 0,
  tilt: 0,
  teethAt: 0.3,
};

export const EMOTIONS: Record<Emotion, EmotionSpec> = {
  neutral: { ...BASE },
  happy: {
    ...BASE,
    browRaise: -4,
    browAngle: -4,
    mouthWidth: 66,
    mouthCurve: 27,
    mouthOpen: 0.1,
    blush: 0.45,
  },
  excited: {
    ...BASE,
    browRaise: -13,
    browAngle: -8,
    eyeScaleX: 1.08,
    eyeScaleY: 1.14,
    mouthWidth: 72,
    mouthCurve: 32,
    mouthOpen: 0.8,
    blush: 0.7,
    tilt: -3,
  },
  scared: {
    ...BASE,
    browRaise: -10,
    browAngle: -17,
    eyeScaleX: 1.1,
    eyeScaleY: 1.28,
    // Small pupils in a wide eye is the whole trick for fear.
    pupilScale: 0.66,
    mouthWidth: 44,
    mouthCurve: -15,
    mouthOpen: 0.45,
    mouthShape: "wobble",
    tilt: 2,
  },
  proud: {
    ...BASE,
    browRaise: -6,
    browAngle: 7,
    eyeScaleY: 0.84,
    lidBase: 0.16,
    mouthWidth: 60,
    mouthCurve: 21,
    blush: 0.3,
    tilt: -4,
  },
  grumpy: {
    ...BASE,
    browRaise: 5,
    browAngle: 19,
    eyeScaleX: 0.96,
    eyeScaleY: 0.78,
    lidBase: 0.1,
    mouthWidth: 48,
    mouthCurve: -17,
    mouthTilt: 4,
  },
  // Added for episode two: Puff apologises nine times in Act One and the kit
  // had no face for it. `grumpy` reads as cross and `scared` cannot be mapped
  // to a line at all (its squiggle mouth hard-cuts when the mouth opens), so
  // there was nothing between "fine" and "frightened".
  //
  // The whole expression is the brow: inner ends *up* is the one shape a
  // six-year-old reads as sad rather than as tired. Half-lids and a small
  // downturned mouth do the rest, and the shape stays `curve` so it can be
  // mapped to a spoken line and lerped out of like any other face.
  sad: {
    ...BASE,
    browRaise: -2,
    browAngle: -15,
    eyeScaleX: 1.02,
    eyeScaleY: 1.06,
    lidBase: 0.2,
    pupilScale: 1.08,
    mouthWidth: 46,
    mouthCurve: -15,
    mouthOpen: 0,
    blush: 0.12,
    tilt: 3,
  },
  amazed: {
    ...BASE,
    browRaise: -17,
    browAngle: -3,
    eyeScaleX: 1.2,
    eyeScaleY: 1.32,
    pupilScale: 1.12,
    mouthWidth: 40,
    mouthCurve: 0,
    mouthOpen: 0.95,
    mouthShape: "round",
    blush: 0.25,
    teethAt: 1,
  },
};

// --- emotion transitions ---------------------------------------------------

/**
 * An emotion *with the frame it changed on*, so the face can morph into it
 * instead of cutting. A plain `Emotion` string still works everywhere an
 * `EmotionInput` is accepted — it just snaps, exactly as it always did.
 *
 * The change frame has to come from the caller because the rig is a pure
 * function of the current frame: a character cannot remember what face it was
 * wearing last frame (Remotion hands frames to a pool of browser tabs, so any
 * ref-based history is a different picture on a re-render). Whoever *decides*
 * the emotion knows when it changed; it passes that down.
 */
export type EmotionCue = {
  emotion: Emotion;
  /** The face being left. Omit — or repeat `emotion` — for no transition. */
  from?: Emotion;
  /** Frame the change lands on, on the same clock as `useCurrentFrame()`. */
  at?: number;
  /** Morph length. Default `EMOTION_EASE`; anything under 5 reads as a cut. */
  frames?: number;
};

export type EmotionInput = Emotion | EmotionCue;

/** ~0.27s at 30fps: long enough to read as a face *changing*, short enough to
 * land before the line it belongs to starts. */
export const EMOTION_EASE = 8;

export type EmotionPose = {
  spec: EmotionSpec;
  /** 0..1 through the current morph; 1 when settled. */
  mix: number;
  /**
   * 1 normally. During a morph between two *different* mouth shapes it dips to
   * 0 at the midpoint, so the old shape flattens out before the new one grows
   * — a squiggle cannot be lerped into an ellipse, but both can go through a
   * line.
   */
  shapeFade: number;
  /** Degrees of damped head follow-through after the change. */
  settle: number;
};

/** Morph one face pose into another. `u` is 0 (all `a`) .. 1 (all `b`). */
export function blendEmotion(a: EmotionSpec, b: EmotionSpec, u: number): EmotionSpec {
  if (u <= 0) return a;
  if (u >= 1) return b;
  const m = (x: number, y: number): number => x + (y - x) * u;
  return {
    browRaise: m(a.browRaise, b.browRaise),
    browAngle: m(a.browAngle, b.browAngle),
    browAsym: m(a.browAsym, b.browAsym),
    eyeScaleX: m(a.eyeScaleX, b.eyeScaleX),
    eyeScaleY: m(a.eyeScaleY, b.eyeScaleY),
    lidBase: m(a.lidBase, b.lidBase),
    pupilScale: m(a.pupilScale, b.pupilScale),
    mouthWidth: m(a.mouthWidth, b.mouthWidth),
    mouthCurve: m(a.mouthCurve, b.mouthCurve),
    mouthOpen: m(a.mouthOpen, b.mouthOpen),
    mouthTilt: m(a.mouthTilt, b.mouthTilt),
    // Not lerpable: a squiggle is not halfway to an ellipse. The swap happens
    // at the midpoint, where `shapeFade` has flattened both to nearly a line.
    mouthShape: u < 0.5 ? a.mouthShape : b.mouthShape,
    blush: m(a.blush, b.blush),
    tilt: m(a.tilt, b.tilt),
    teethAt: m(a.teethAt, b.teethAt),
  };
}

const NO_TRANSITION: EmotionPose = {
  spec: EMOTIONS.neutral,
  mix: 1,
  shapeFade: 1,
  settle: 0,
};

/**
 * Turn an `emotion` prop into the pose to draw this frame: the morphed spec,
 * plus the follow-through the change leaves behind.
 */
export function resolveEmotion(
  input: EmotionInput | undefined,
  frame: number,
  fps: number,
): EmotionPose {
  if (input === undefined) return NO_TRANSITION;
  if (typeof input === "string") {
    return { ...NO_TRANSITION, spec: EMOTIONS[input] };
  }
  const to = EMOTIONS[input.emotion];
  const from = input.from ? EMOTIONS[input.from] : to;
  if (from === to || input.at === undefined) {
    return { ...NO_TRANSITION, spec: to };
  }
  const since = frame - input.at;
  if (since < 0) return { ...NO_TRANSITION, spec: from };
  const dur = Math.max(1, input.frames ?? EMOTION_EASE);
  const mix = kidEase.easeInOutSine(since / dur);
  const shapeFade =
    from.mouthShape === to.mouthShape ? 1 : Math.abs(2 * mix - 1);
  // Follow-through: the head over-rotates a touch past the new pose and rings
  // down. Scaled by how big a change it was, so `happy`→`excited` gets a nudge
  // and `neutral`→`neutral` gets nothing.
  const size = Math.min(
    1,
    (Math.abs(to.tilt - from.tilt) * 0.22 +
      Math.abs(to.browRaise - from.browRaise) * 0.05 +
      Math.abs(to.mouthCurve - from.mouthCurve) * 0.02) /
      1.6,
  );
  const settle =
    size * 2.1 * settleWave(since / (fps * 0.62), 1.15, 4.2, -Math.PI / 2);
  return { spec: blendEmotion(from, to, mix), mix, shapeFade, settle };
}

// --- idle ------------------------------------------------------------------

export type Squash = { sx: number; sy: number; dy: number };

/**
 * Breathing squash-and-stretch. Volume is roughly preserved (tall => narrow),
 * which is what separates "breathing" from "scaling".
 *
 * @param amount 0 disables it; 1 is the default breath; >1 for bouncier beats.
 */
export function idleSquash(
  frame: number,
  fps: number,
  phase = 0,
  amount = 1,
): Squash {
  if (amount === 0) return { sx: 1, sy: 1, dy: 0 };
  const t = frame / fps;
  // ~2.4s breath, plus a slower 5.7s swell so repeats aren't countable.
  const a =
    0.035 * amount * Math.sin(t * ((Math.PI * 2) / 2.4) + phase) +
    0.012 * amount * Math.sin(t * ((Math.PI * 2) / 5.7) + phase * 1.7);
  return { sx: 1 - a * 0.75, sy: 1 + a, dy: -a * 26 };
}

// --- blink -----------------------------------------------------------------

const BLINK_CLOSE = 0.055; // seconds, lid down
const BLINK_HOLD = 0.03;
const BLINK_OPEN = 0.1; // lids open slower than they close — always true
const BLINK_MIN_GAP = 2.6;
const BLINK_MAX_GAP = 5.2;

/** Deterministic 0..1 hash, so blink gaps vary without any randomness. */
function hash01(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Lid closure 0..1 for the current frame: 0 open, 1 fully shut.
 *
 * Blink *times* come from a deterministic irregular sequence seeded by
 * `phase`, so two characters on screen never blink together and neither one
 * blinks on a beat you can count.
 */
export function blinkAmount(frame: number, fps: number, phase = 0): number {
  const t = frame / fps;
  const seed = phase * 7.3 + 1;
  // Walk the blink sequence forward to the current time. ~1 iteration per 4s.
  let at = 1.2 + hash01(seed) * BLINK_MIN_GAP;
  for (let k = 0; k < 400; k++) {
    const span = BLINK_CLOSE + BLINK_HOLD + BLINK_OPEN;
    if (t < at) return 0;
    if (t < at + span) {
      const u = t - at;
      // Eased, not linear: a lid accelerates shut and decelerates open. At
      // 30fps a blink is only ~6 frames, and the curve is most of what
      // separates "eyes closing" from "a rectangle sliding down".
      if (u < BLINK_CLOSE) return kidEase.easeInQuad(u / BLINK_CLOSE);
      if (u < BLINK_CLOSE + BLINK_HOLD) return 1;
      return 1 - kidEase.easeOutQuad((u - BLINK_CLOSE - BLINK_HOLD) / BLINK_OPEN);
    }
    const r = hash01(seed + k * 3.77);
    const r2 = hash01(seed + k * 9.13 + 5);
    let gap = BLINK_MIN_GAP + r * (BLINK_MAX_GAP - BLINK_MIN_GAP);
    // ~1 blink in 6 comes as a quick double-blink. Cheap, and very alive.
    if (r2 > 0.84) gap = 0.22;
    at += span + gap;
  }
  return 0;
}

// --- talking ---------------------------------------------------------------

/**
 * Mouth opening 0..1 while speaking. Three detuned sines plus a floor test:
 * speech has closures in it, so the mouth must actually shut sometimes or it
 * reads as a chewing loop.
 */
export function mouthAmplitude(
  frame: number,
  fps: number,
  phase = 0,
  vigor = 1,
): number {
  const t = frame / fps;
  const a = Math.sin(t * 2 * Math.PI * 5.9 + phase * 2.1);
  const b = Math.sin(t * 2 * Math.PI * 3.4 + phase * 3.7 + 1.1);
  const c = Math.sin(t * 2 * Math.PI * 9.3 + phase * 1.3 + 2.4);
  // Weighted mix, biased so the resting state is closed-ish rather than half.
  let v = 0.44 + 0.3 * a + 0.2 * b + 0.12 * c;
  // Syllable gaps: when the slow envelope dips, shut the mouth completely.
  const env = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * 1.35 + phase * 5.1);
  if (env < 0.22) v = Math.min(v, 0.06);
  return Math.max(0, Math.min(1, v)) * vigor;
}

// --- look ------------------------------------------------------------------

/** Pupil offset in face units, -1..1 on each axis. */
export function lookOffset(look: LookDirection = "camera"): {
  x: number;
  y: number;
} {
  if (typeof look === "object") {
    return {
      x: Math.max(-1, Math.min(1, look.x)),
      y: Math.max(-1, Math.min(1, look.y)),
    };
  }
  switch (look) {
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 0.85 };
    case "upLeft":
      return { x: -0.8, y: -0.7 };
    case "upRight":
      return { x: 0.8, y: -0.7 };
    default:
      return { x: 0, y: 0 };
  }
}

/**
 * Eye life: the small involuntary motion that separates a *character* looking
 * at something from a decal of one.
 *
 * Two layers, both deterministic from the frame:
 *   - micro-saccades — the pupils jump a pixel or two and hold, on an
 *     irregular schedule. Never a drift: real eyes move in flicks.
 *   - an attention shift — an occasional glance away and back, for a character
 *     with nothing else to look at. `wander` is off whenever the scene has set
 *     a look direction, because a staged look is authoritative.
 *
 * The result is in look units (see `lookOffset`) and is *added* to the staged
 * direction, so it never overrides where a character has been told to look.
 */
export function eyeLife(
  frame: number,
  fps: number,
  phase = 0,
  amount = 1,
  wander = false,
): { x: number; y: number } {
  if (amount === 0) return { x: 0, y: 0 };
  const t = frame / fps;
  const seed = phase * 3.1 + 0.5;

  // --- saccades: hold a target for ~0.6s, flick to the next in ~4 frames.
  const s = t / 0.6 + phase * 0.37;
  const n = Math.floor(s);
  const u = s - n;
  // Some slots repeat the previous target, so the flicks aren't a metronome.
  const target = (k: number, axis: number): number => {
    let i = k;
    if (hash01(i * 5.1 + seed) < 0.42) i -= 1;
    return (hash01(i * 1.73 + seed + axis * 11.3) - 0.5) * 2;
  };
  const m = kidEase.easeInOutSine(u / 0.14);
  const sx = target(n - 1, 0) + (target(n, 0) - target(n - 1, 0)) * m;
  const sy = target(n - 1, 1) + (target(n, 1) - target(n - 1, 1)) * m;

  let x = sx * 0.15 * amount;
  let y = sy * 0.1 * amount;

  // --- attention shift: ~1s of looking elsewhere, a few times a minute.
  if (wander) {
    const w = t / 4.4 + phase * 0.61;
    const k = Math.floor(w);
    const wu = w - k;
    if (wu < 0.22 && hash01(k * 3.37 + seed) > 0.45) {
      const env = Math.sin((wu / 0.22) * Math.PI);
      x += (hash01(k * 7.91 + seed) - 0.5) * 2 * 0.42 * env * amount;
      y += (hash01(k * 2.19 + seed) - 0.5) * 0.34 * env * amount;
    }
  }

  return { x, y };
}

/**
 * Convert a composition-space point into a look direction for a character
 * standing at (cx, cy) — "look at the other character" without hand-tuning.
 */
export function lookAt(
  from: { x: number; y: number },
  to: { x: number; y: number },
  reach = 420,
): { x: number; y: number } {
  return {
    x: Math.max(-1, Math.min(1, (to.x - from.x) / reach)),
    y: Math.max(-1, Math.min(1, (to.y - from.y) / (reach * 0.7))),
  };
}

// --- arcs ------------------------------------------------------------------

export type Pt = { x: number; y: number };

export type Travel = {
  x: number;
  y: number;
  /** Heading along the path, in degrees. 0 is straight right, -90 is up. */
  angle: number;
};

/**
 * Move between two marks *along an arc*. Nothing alive travels in a straight
 * line, and a character sliding down a lerp is the single most obvious tell
 * that a scene was positioned rather than animated.
 *
 * The arc bows to the left of the direction of travel — i.e. up, for a move to
 * the right — which is the "thrown, not dragged" read. Negative `arc` sags
 * instead, for something heavy or tired.
 *
 * @param u    0..1 along the move; feed it a raw `(frame - at) / dur`.
 * @param arc  Bow height as a fraction of the distance. 0 is a straight line.
 * @param bias <1 puts the peak of the arc early (a throw that loses height);
 *             >1 late. 1 is a symmetric bow.
 * @param ease Timing curve. Default `easeInOutSine`; use `gravity` for a fall.
 */
export function moveAlong(
  from: Pt,
  to: Pt,
  u: number,
  opts?: { arc?: number; bias?: number; ease?: (u: number) => number },
): Travel {
  const arc = opts?.arc ?? 0.16;
  const bias = opts?.bias ?? 1;
  const e = (opts?.ease ?? kidEase.easeInOutSine)(clamp01(u));
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 0.0001 || arc === 0) {
    return {
      x: from.x + dx * e,
      y: from.y + dy * e,
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    };
  }
  // Left-hand normal of the chord: for a rightward move this points up.
  const nx = dy / dist;
  const ny = -dx / dist;
  const eb = bias === 1 ? e : Math.pow(Math.max(e, 1e-4), bias);
  const off = arc * dist * Math.sin(Math.PI * eb);
  // Heading: the ease factor cancels between the two terms, so the tangent is
  // the chord plus the derivative of the bow. Cheap, and exact.
  const slope =
    arc *
    dist *
    Math.PI *
    Math.cos(Math.PI * eb) *
    (bias === 1 ? 1 : bias * Math.pow(Math.max(e, 1e-4), bias - 1));
  return {
    x: from.x + dx * e + nx * off,
    y: from.y + dy * e + ny * off,
    angle: (Math.atan2(dy + ny * slope, dx + nx * slope) * 180) / Math.PI,
  };
}

// --- entrances & exits -----------------------------------------------------

export type EntranceKind = "bounce" | "pop" | "slideLeft" | "slideRight";
export type ExitKind = "zip" | "shrink" | "poof";

export type Entrance = {
  at?: number;
  kind?: EntranceKind;
  /**
   * Counter-move before the move: a hang-and-stretch before a `bounce` drops,
   * a crouch before a `pop`. ~5 frames. On by default for those two — an
   * entrance that starts at full speed on frame one has no weight.
   *
   * Off by default for the slides, where the character is still off frame
   * during the anticipation and there is nothing to see.
   */
  anticipate?: boolean;
};
export type Exit = {
  at: number;
  kind?: ExitKind;
  dir?: "left" | "right" | "up";
  /** `zip`'s lean the wrong way before the launch. On by default. */
  anticipate?: boolean;
};

export type Placement = {
  scaleX: number;
  scaleY: number;
  dx: number;
  dy: number;
  rotate: number;
  opacity: number;
};

export const NO_PLACEMENT: Placement = {
  scaleX: 1,
  scaleY: 1,
  dx: 0,
  dy: 0,
  rotate: 0,
  opacity: 1,
};

/** How far above the mark a `bounce` starts, in composition px. */
const DROP_HEIGHT = 320;

/**
 * Entrance transform, in three beats: anticipate, move, settle.
 *
 * `bounce` hangs a moment and stretches (anticipation), *accelerates* down
 * under `gravity` rather than easing into the mark, then compresses on the
 * frame it lands and rings out (follow-through). The landing squash is the
 * part that sells it, and it's why this returns separate x/y scales.
 *
 * `pop` crouches small and wide before it springs, which is the same principle
 * at a different scale.
 */
export function entranceTransform(
  frame: number,
  fps: number,
  spec: Entrance | undefined,
  springFn: (t: number, damping: number, mass: number) => number,
): Placement {
  if (!spec) return NO_PLACEMENT;
  const at = spec.at ?? 0;
  const f = frame - at;
  if (f < 0) return { ...NO_PLACEMENT, opacity: 0, scaleX: 0, scaleY: 0 };
  const kind = spec.kind ?? "bounce";
  const slide = kind === "slideLeft" || kind === "slideRight";
  const anticipate = spec.anticipate ?? !slide;
  // ~5 frames at 30fps. Longer reads as a stall, shorter as a glitch.
  const lead = anticipate ? Math.max(2, Math.round(fps * 0.17)) : 0;
  const opacity = kidEase.easeOutQuad(f / 4);

  if (slide) {
    const s = springFn(f, 12, 0.7);
    const dir = kind === "slideLeft" ? -1 : 1;
    return {
      scaleX: 1,
      scaleY: 1,
      dx: dir * (1 - s) * 900,
      dy: 0,
      rotate: dir * (1 - s) * 8,
      opacity,
    };
  }

  if (kind === "bounce") {
    // Beat 1 — hang above the mark, stretching, drifting a touch higher.
    if (f < lead) {
      const u = f / lead;
      const rise = kidEase.easeOutSine(u);
      // Grows over the whole hang rather than popping: the anticipation *is*
      // the hang and the stretch, and a scale pop on top of it reads as two
      // entrances stacked.
      const s = kidEase.easeOutQuad(u);
      return {
        scaleX: s * (1 - 0.05 * rise),
        scaleY: s * (1 + 0.09 * rise),
        dx: 0,
        dy: -(DROP_HEIGHT + 44 * rise),
        rotate: 0,
        opacity,
      };
    }
    // Beat 2 — the fall, accelerating.
    const g = f - lead;
    const fallDur = fps * 0.34;
    const top = DROP_HEIGHT + (anticipate ? 44 : 0);
    if (g < fallDur) {
      const drop = kidEase.gravity(g / fallDur);
      return {
        scaleX: 1 - 0.07 * drop,
        scaleY: 1 + 0.11 * drop,
        dx: 0,
        dy: -top * (1 - drop),
        rotate: 0,
        opacity,
      };
    }
    // Beat 3 — impact, then ring out. Starts fully compressed, because that
    // is the frame the feet hit.
    const w = settleWave((g - fallDur) / (fps * 0.72), 1.35, 3.9);
    return {
      scaleX: 1 + 0.19 * w,
      scaleY: 1 - 0.22 * w,
      dx: 0,
      dy: 0,
      rotate: 0,
      opacity,
    };
  }

  // `pop` — crouch, then spring, then ring out.
  if (f < lead) {
    const s = 0.12 + 0.26 * kidEase.easeOutQuad(f / lead);
    return {
      scaleX: s * 1.18,
      scaleY: s * 0.82,
      dx: 0,
      dy: 0,
      rotate: 0,
      opacity,
    };
  }
  const g = f - lead;
  const spr = springFn(g, 10, 0.7);
  const s = anticipate ? 0.38 + 0.62 * spr : spr;
  const w = settleWave(g / (fps * 0.6), 1.3, 4.2, -Math.PI / 2);
  return {
    scaleX: s * (1 + 0.1 * w),
    scaleY: s * (1 - 0.1 * w),
    dx: 0,
    dy: 0,
    rotate: 0,
    opacity,
  };
}

/** Exit transform. `zip` slings the character off frame with a lean. */
export function exitTransform(
  frame: number,
  fps: number,
  spec: Exit | undefined,
): Placement {
  if (!spec) return NO_PLACEMENT;
  const f = frame - spec.at;
  if (f <= 0) return NO_PLACEMENT;
  const kind = spec.kind ?? "zip";
  const dur = kind === "zip" ? fps * 0.4 : fps * 0.35;
  const u = Math.min(1, f / dur);
  // Anticipation: a small lean the *wrong* way before the launch.
  const anticip =
    (spec.anticipate ?? true) && u < 0.32 ? Math.sin((u / 0.32) * Math.PI) : 0;
  const ease = u < 0.32 ? 0 : Math.pow((u - 0.32) / 0.68, 2.2);
  const dir = spec.dir === "left" ? -1 : spec.dir === "up" ? 0 : 1;
  if (kind === "zip") {
    return {
      scaleX: 1 + ease * 0.25 - anticip * 0.06,
      scaleY: 1 - ease * 0.2 + anticip * 0.06,
      dx: dir * ease * 2400 - dir * anticip * 60,
      dy: spec.dir === "up" ? -ease * 1600 : 0,
      rotate: dir * ease * 22,
      opacity: u > 0.9 ? 0 : 1,
    };
  }
  if (kind === "poof") {
    // Swells, then collapses — the swell *is* the anticipation, so it is not
    // gated on `anticipate`. The collapse accelerates; a linear one read as a
    // shape being deleted rather than popping.
    const gone = kidEase.easeInQuad(u);
    return {
      scaleX: 1 + Math.sin(u * Math.PI) * 0.3 - gone,
      scaleY: 1 + Math.sin(u * Math.PI) * 0.3 - gone,
      dx: 0,
      dy: -kidEase.easeOutQuad(u) * 60,
      rotate: kidEase.easeOutQuad(u) * 40,
      opacity: 1 - kidEase.easeInSine(u),
    };
  }
  // `shrink` — used for a character receding, so the size decays *away* from
  // the viewer rather than at a constant rate: he holds his presence for a
  // beat and then goes. (Linear here read as a scale slider being dragged.)
  const away = kidEase.easeInQuad(u);
  return {
    scaleX: 1 - away,
    scaleY: 1 - away,
    dx: 0,
    dy: kidEase.easeInQuad(u) * 40,
    rotate: 0,
    opacity: 1 - kidEase.easeInSine(u),
  };
}

/** Compose two placements (entrance then exit). */
export function combine(a: Placement, b: Placement): Placement {
  return {
    scaleX: a.scaleX * b.scaleX,
    scaleY: a.scaleY * b.scaleY,
    dx: a.dx + b.dx,
    dy: a.dy + b.dy,
    rotate: a.rotate + b.rotate,
    opacity: a.opacity * b.opacity,
  };
}
