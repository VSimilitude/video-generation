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

export type Emotion =
  | "neutral"
  | "happy"
  | "excited"
  | "scared"
  | "proud"
  | "grumpy"
  | "amazed";

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
      if (u < BLINK_CLOSE) return u / BLINK_CLOSE;
      if (u < BLINK_CLOSE + BLINK_HOLD) return 1;
      return 1 - (u - BLINK_CLOSE - BLINK_HOLD) / BLINK_OPEN;
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

// --- entrances & exits -----------------------------------------------------

export type EntranceKind = "bounce" | "pop" | "slideLeft" | "slideRight";
export type ExitKind = "zip" | "shrink" | "poof";

export type Entrance = { at?: number; kind?: EntranceKind };
export type Exit = { at: number; kind?: ExitKind; dir?: "left" | "right" | "up" };

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

/**
 * Entrance transform. `bounce` drops in from above and squashes on landing —
 * the landing squash is the part that sells it, and it's why this returns
 * separate x/y scales instead of one number.
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
  const s = springFn(f, kind === "pop" ? 10 : 12, 0.7);
  const land = Math.max(0, 1 - f / (fps * 0.55));
  // Decaying squash right after the spring settles.
  const wob = Math.sin(f * 0.55) * 0.16 * land * (kind === "bounce" ? 1 : 0.5);
  const opacity = Math.min(1, f / 4);
  if (kind === "slideLeft" || kind === "slideRight") {
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
  return {
    scaleX: s * (1 - wob),
    scaleY: s * (1 + wob),
    dx: 0,
    dy: kind === "bounce" ? -(1 - s) * 320 : 0,
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
  const anticip = u < 0.32 ? Math.sin((u / 0.32) * Math.PI) : 0;
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
    return {
      scaleX: 1 + Math.sin(u * Math.PI) * 0.3 - u * 1,
      scaleY: 1 + Math.sin(u * Math.PI) * 0.3 - u * 1,
      dx: 0,
      dy: -u * 60,
      rotate: u * 40,
      opacity: 1 - u,
    };
  }
  return {
    scaleX: 1 - u,
    scaleY: 1 - u,
    dx: 0,
    dy: u * 40,
    rotate: 0,
    opacity: 1 - u,
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
