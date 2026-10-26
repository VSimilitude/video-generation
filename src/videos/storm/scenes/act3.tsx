import React from "react";
import {
  AbsoluteFill,
  BOOM_R,
  Boom,
  Bubbles,
  COUNT_GRID,
  COUNT_VOICE_LEAD,
  Cloudia,
  Drip,
  Flash,
  FlashSky,
  FrontDesk,
  GARDEN,
  HAIL_NAMED,
  HailBall,
  HEIGHT,
  HailCrowd,
  Horizon,
  HotelTower,
  HotelWorld,
  KID_AT_WINDOW,
  LOBBY,
  PHASE,
  PLATES,
  STONY,
  SpeechBubble,
  Stony,
  Sunny,
  SunnyGlow,
  WIDE,
  WIDTH,
  WideLayer,
  WindowWorld,
  NO_LEAD,
  boomGrow,
  boomMark,
  clamp,
  countRuns,
  distanceForCount,
  emotionAt,
  fingersAt,
  flashFor,
  hover,
  interpolate,
  kidEase,
  kidInkOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  lineKeyOf,
  lineWindow,
  lookAt,
  mixHex,
  moveAlong,
  projectMark,
  settleWave,
  stand,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cam,
  type Cast,
  type HorizonLight,
  type LookDirection,
  type Mark,
  type TimedScene,
} from "./common";

// ACT THREE — THE COUNT GOES UP (s18_checkout … s23_ten_nothing).
//
// "The grandest check-out in hotel history, a three, a six that turns the
// hero, a nine that rumbles, a goodbye on the lawn, and ten fingers at a flash
// nobody can hear."
//
// ===========================================================================
// THE ACT-3 BRIEF (skeleton wave, 2026-10-26) — read before writing a line
// ===========================================================================
//
// OWNERSHIP. You own THIS FILE ONLY. Video.tsx, common.tsx, Boom.tsx,
// Flash.tsx, Kid.tsx, coldOpen.tsx, act1.tsx and the existing plates are
// FROZEN; needed shared changes go in your report ("Shared-change requests").
// Two plates are YOURS, under the names declared in backgrounds.mjs (prompt
// under exactly that key; no volcano / mountain / island / peak / summit /
// hill / sun / moon word):
//   lawn_hail_dark    Scenes 18 and 22 — the lawn the hail bounces on, dark
//                     wet green, seen from the house
//   bay_dusk_clear    Scenes 23 (and the recap's 25–26) — dusk, the storm a
//                     far flicker, the sky clearing; the HALF MOON is SVG
//                     (recap's), never painted. Same skeleton as the window
//                     plates so the horizon does not move.
// Run `npm run backgrounds -- --video storm --only <key>`; measure; report
// the PLATES row.
//
// YOUR SCENES (current manifest frames):
//   s18_checkout     19703  +900  the grandest check-out: hail + rain onto the
//                                 lawn, bouncing, NOBODY under it; Stony
//                                 bounces ONCE and sits on the step; Drip
//                                 lands on the sill as a drop (a3_07,
//                                 CUTTABLE — one-line cut leaves it whole)
//   s19_three_again  20603  +625  FLASH behind the house over the hills;
//                                 THREE; "Present!" (0.85); theory 3
//   s20_six_turn     21228 +1417  SIX; the first FAR "Present!" (0.6 — the
//                                 same clip, quieter); THE TURN "Count me."
//                                 + 60f; stamp THREE COUNTS = ONE KILOMETRE.
//   s21_nine_rumble  22645 +1225  dusk coming; NINE (audit this stretch
//                                 first: the hand is the picture, the rings
//                                 visibly crossing the hills the whole way);
//                                 "Present!" at 0.45 inside the rumble; a3_44
//                                 CUTTABLE
//   s22_goodbye      23870  +666  Sunny back at last (low, gold — his FACE
//                                 again); roll call firing 2: Hail, Hailey,
//                                 other Hail, Hail the third, Stony — same
//                                 order, melting; Stony last to melt
//   s23_ten_nothing  24536 +1359  TEN — all the fingers; 120f of nothing; the
//                                 hotel cut: FLASH and instantly "Present!"
//                                 (full, zero distance, in the lobby — Boom
//                                 small, tight, sharp, as at his birth);
//                                 back to the window; "Both true."
//
// THE HELD BEATS YOU OWN (script.md's numbers; nothing enters):
//   a3_13 24f "Didn't I?" · a3_24 36f address 5 · a3_27 60f THE TURN ·
//   a3_48 36f the goodbye middle · a3_61 120f TEN-AND-NOTHING · a3_62 30f ·
//   a3_66 30f · a3_67 30f. `NO_LEAD` on every one of these scenes.
//   Counts: s19 three (a3_08–10), s20 six (a3_15–20), s21 nine (a3_29–37),
//   s23 ten (a3_51–59 + the "Ten." source a3_60). Computed grid — never touch.
//   Volumes: a3_11 0.85, a3_21 0.6, a3_38 0.45, a3_64 1.0.
//
// THE SHARED HELPERS (./common; see act2.tsx's brief for the full list):
//   WindowWorld (sky "dark" → "dusk"), KidAtWindow via `kid` (fingers to 10;
//   `raise` + `wave` for the end), fingersAt / countRuns / flashFor, Boom
//   (`distance` = distanceForCount(n); far = huge and soft), Flash (≤6f; the
//   sea far out or sideways — far PAST the volcano by Scene 23), SoundRings,
//   HailCrowd / HailBall / HAIL_NAMED / Stony (THE SAME BODY: `Stony` with
//   its frost crown; `melt` 0..1 for Scene 22), HotelWorld("lobby") +
//   FrontDesk + Cloudia for the s23 hotel cut, Horizon (the volcano's summit
//   is the ONE STEADY LIGHT on the dark horizon in act three — `light`
//   "dark"/"dusk"), SunnyGlow (Scenes 18–21: behind the thinning tower).
//
// WEAK POINTS CARRIED:
//   - The ten-count Flash must read as FAR (tiny, past the volcano): a
//     ten-count flash is three kilometres and audible, so the silent one is
//     the "more than fifteen kilometres" one the Narrator names (a3_62).
//   - Stony must be the same body at the penthouse (Scene 6 — done), on the
//     step (Scene 18) and last to melt (Scene 22).
//   - Hail bounces on GRASS with nobody under it; the kid behind the glass,
//     mug up. Nothing struck.
//   - a3_07 (travel-sized) and a3_44 (rumble tie-back) are Mike's
//     overturnables: one-line cuts must leave the scenes whole.
//   - Two long counts (s21, s23) back to back: the cadence report's worst
//     gap is here (~30s). Ensemble business around the counts matters most.
//   - Boom's voice is PROVISIONAL.
// ===========================================================================

// ---------------------------------------------------------------------------
// WHAT THIS ACT STAGES (and what the recap may assume)
//
//   THE GEOGRAPHY  The window is the stage from Scene 18 to the end. The storm
//                  LEAVES along one path the whole act: overhead (18, the
//                  hotel's underside across the top of the glass) → walking off
//                  over the house to the upper left (19) → out over the HILLS
//                  (20 — the headland drawn on the left of the bay, `Hills`) →
//                  past the volcano, a small tower behind him (21) → a grey wall
//                  behind him (22) → a low flicker on the horizon (23). The
//                  volcano and the island are re-drawn IN FRONT of the storm
//                  (`FrontHorizon`) so "past the volcano" reads as behind him,
//                  and his lit summit is the one steady light in every shot.
//   THE COUNTS     Flash on the run's first frame (the count measures from
//                  her; three counts on screen are three seconds), fingers on
//                  `fingersAt`, Boom WALKING the whole way in from where she
//                  was, growing with distance (`legAt`) — a chase, never a
//                  wait. He arrives on the grid at the size the count earns:
//                  three → 0.33, six → 0.67, nine → 1 (huge, soft). The ten
//                  never arrives: the rings set out and thin to nothing.
//   THE LAWN       `lawn_hail_dark` (18–22): pea hail bouncing on the grass and
//                  the path with nobody under it (`PeaHail`), the four named
//                  hail and Stony landing (`LAWN_NAMED`, `STEP`), lying there
//                  through 19–21, melting in 22. Drip lands on the outside sill
//                  in 18 and watches from it until 22.
//   SUNNY          `SunnyGlow` on the storm's right rim (18–21); in 22 he slides
//                  out from behind the wall, his face again.
//
// OVERTURNABLES (Mike's, decision log): `a3_07` (travel-sized) and `a3_44` (the
// rumble tie-back) are CUTTABLE. Nothing in this file is timed off either line:
// Drip lands off `a3_04`, and `a3_44` only carries a bubble-less face. Delete
// the key from Video.tsx and both scenes stay whole.
// ---------------------------------------------------------------------------

type Pt = { x: number; y: number };
type SceneFC = React.FC<{ scene: TimedScene }>;

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

/** 0→1 between two frames, eased; safe when a line is missing (a cut key). */
function ramp(frame: number, a: number, b: number, ease: (u: number) => number = kidEase.easeInOutSine): number {
  if (b <= a) return frame >= a ? 1 : 0;
  return ease(clamp01((frame - a) / (b - a)));
}

/** Deterministic 0..1 noise (never `Math.random` — the render pool). */
function hash(i: number, k: number): number {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * The key of the most recent line to START at `frame` — even after it ends.
 * Held beats are empty because looks and faces key off this: nothing can
 * change inside a hold, since no line starts inside one.
 */
function lastKeyAt(scene: TimedScene, frame: number): string | null {
  let key: string | null = null;
  for (const t of scene.turns ?? []) if (t.from <= frame) key = lineKeyOf(t);
  return key;
}

/** A value that eases from `a` (the last scene's) to `b` over a scene's first `over` frames. */
function settleTo(frame: number, a: number, b: number, over = 60): number {
  return a + (b - a) * ramp(frame, 0, over);
}

// ---------------------------------------------------------------------------
// The window's furniture for act three
// ---------------------------------------------------------------------------

/**
 * **Boom at the glass, act three.** Not common's `BOOM_AT_GLASS` (560, 410):
 * from three counts out he is big enough there to cover Ember's island, and at
 * nine (distance 1, R ≈ 180) the island and half the volcano — and they hold
 * the horizon in every coastal wide. Up and right, over the kid's head: the
 * island and the summit stay clear at every size this act draws him.
 */
const GLASS: Pt = { x: 760, y: 290 };
const GLASS_SCALE = 0.8;
/** His framing scale at the storm (far away = small in frame). */
const SOURCE_SCALE = 0.16;

type Leg = { at: number; arrive: number; from: Pt; to?: Pt; count: number; arc?: number };
type LegState = { u: number; x: number; y: number; angle: number; scale: number; distance: number };

/**
 * **Boom on his way in.** He leaves where Flash was on her first frame and
 * walks at his ONE pace (linear in time — sound has one speed), growing as he
 * comes: framing scale for the perspective, `distance` for the physics (he
 * spreads and softens), arriving at the glass on the count's grid.
 */
function legAt(frame: number, leg: Leg): LegState {
  const u = clamp01((frame - leg.at) / Math.max(1, leg.arrive - leg.at));
  const p = moveAlong(leg.from, leg.to ?? GLASS, u, { arc: leg.arc ?? 0, ease: kidEase.linear });
  return {
    u,
    x: p.x,
    y: p.y,
    angle: p.angle,
    scale: SOURCE_SCALE + (GLASS_SCALE - SOURCE_SCALE) * Math.pow(u, 1.6),
    distance: distanceForCount(leg.count) * u,
  };
}

/** The headland on the left of the bay — "the hills". Drawn, never painted. */
const HILL_TONE = {
  dark: { far: "#2c4150", near: "#1d3328", rim: "#3d5a44" },
  dusk: { far: "#3b3a5e", near: "#232642", rim: "#4a4670" },
  gold: { far: "#5a5a5a", near: "#3b4a2a", rim: "#b49a4e" },
} as const;

const Hills: React.FC<{ tone: keyof typeof HILL_TONE; foot?: number }> = ({ tone, foot = 640 }) => {
  const c = HILL_TONE[tone];
  return (
    <WideLayer>
      {/* The far hills: a low run at the frame-left edge, meeting the sea just
          short of the volcano's left foot (x ~235). */}
      <path d={`M 100 ${GARDEN.horizon} L 100 430 C 150 426 196 444 230 ${GARDEN.horizon} Z`} fill={c.far} />
      {/* The near headland: in front of the sea, its ridge always BELOW the
          horizon, so the volcano and the island stand clear above it. */}
      <path
        d={
          `M 100 ${foot + 40} L 100 500 C 180 500 260 520 340 540` +
          ` C 450 566 560 588 640 604 C 700 616 740 ${foot - 14} 790 ${foot} L 790 ${foot + 40} Z`
        }
        fill={c.near}
      />
      <path d={`M 100 500 C 180 500 260 520 340 540 C 450 566 560 588 640 604`} stroke={c.rim} strokeWidth={6} fill="none" opacity={0.6} />
    </WideLayer>
  );
};

/**
 * **The volcano and the island IN FRONT of the storm.** `WindowWorld` draws
 * the hotel layer over its own horizon; in act three the storm is PAST him, so
 * the act re-draws the same `Horizon` (same light, same numbers — it sits
 * exactly on the first) after the storm cloud.
 */
const FrontHorizon: React.FC<{ light: HorizonLight }> = ({ light }) => <Horizon light={light} />;

/**
 * **The storm, seen far off**: the hotel's own tower (`HotelTower`, the kit
 * shape — not redesigned), pushed back into the evening by value: a CSS
 * brightness filter darkens it to a silhouette the further it has gone, and
 * its foot is cut at the horizon (it stands past the edge of the sea).
 */
const FarStorm: React.FC<React.ComponentProps<typeof HotelTower> & { dim: number }> = ({ dim, ...tower }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      filter: `brightness(${(1 - dim).toFixed(3)}) saturate(0.85)`,
      // Its foot is below the horizon: a far storm sits BEYOND the sea's edge.
      clipPath: `inset(0 0 ${HEIGHT - GARDEN.horizon}px 0)`,
    }}
  >
    <HotelTower {...tower} />
  </div>
);

/** The terrace step and the path out across the lawn (Stony's step). */
const STEP = { x: 420, top: 738, w: 250 } as const;
const STEP_TONE = {
  dark: { top: "#6d7480", face: "#454b58", stone: "#59606c" },
  dusk: { top: "#6a6386", face: "#3f3a58", stone: "#544f72" },
  gold: { top: "#a39780", face: "#6d6455", stone: "#8a806c" },
} as const;

const StepAndPath: React.FC<{ tone: keyof typeof STEP_TONE; wet?: number }> = ({ tone, wet = 0.5 }) => {
  const c = STEP_TONE[tone];
  const L = STEP.x - STEP.w / 2;
  const R = STEP.x + STEP.w / 2;
  const stones = [
    { x: 520, y: 712, rx: 40, ry: 13 },
    { x: 578, y: 688, rx: 34, ry: 11 },
    { x: 632, y: 668, rx: 29, ry: 9 },
    { x: 680, y: 652, rx: 24, ry: 8 },
  ];
  return (
    <WideLayer>
      {stones.map((s) => (
        <g key={s.x}>
          <ellipse cx={s.x} cy={s.y + 3} rx={s.rx} ry={s.ry} fill={c.face} />
          <ellipse cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} fill={c.stone} />
        </g>
      ))}
      <path d={`M ${L - 16} ${STEP.top + 22} L ${R + 16} ${STEP.top + 22} L ${R + 16} 800 L ${L - 16} 800 Z`} fill={c.face} />
      <path d={`M ${L} ${STEP.top} L ${R} ${STEP.top} L ${R + 16} ${STEP.top + 22} L ${L - 16} ${STEP.top + 22} Z`} fill={c.top} />
      {/* Wet sheen: two flat strokes, never a gradient. */}
      <path d={`M ${L + 30} ${STEP.top + 8} L ${L + 110} ${STEP.top + 8}`} stroke={kidTheme.paper} strokeWidth={4} strokeLinecap="round" opacity={0.25 * wet} />
      <path d={`M ${R - 70} ${STEP.top + 13} L ${R - 30} ${STEP.top + 13}`} stroke={kidTheme.paper} strokeWidth={3} strokeLinecap="round" opacity={0.2 * wet} />
    </WideLayer>
  );
};

/**
 * **The named four on the lawn** — the penthouse's Hail, Hailey, other Hail
 * and Hail the third, THE SAME BODIES (`HAIL_NAMED`'s phases, its radius ratio
 * at lawn distance), with Stony (`Stony`, the same body) on the step.
 */
const LAWN_K = 0.38;
const LAWN_NAMED = [
  { ...HAIL_NAMED[0], x: 222, y: 706 },
  { ...HAIL_NAMED[1], x: 585, y: 640 },
  { ...HAIL_NAMED[2], x: 1330, y: 652 },
  { ...HAIL_NAMED[3], x: 1346, y: 738 },
].map((h) => ({ ...h, r: h.r * LAWN_K }));
/** Stony on the step: nearer than the others, so a touch larger on screen. */
const STONY_R = STONY.r * 0.42;
const STONY_SEAT = { x: STEP.x - 20, y: STEP.top - STONY_R + 4 } as const;
/** Where Stony hits first: the far flagstone. He bounces ONCE, onto the step. */
const STONY_HIT = { x: 578, y: 688 - STONY_R * 0.8 } as const;

/**
 * One hailstone's fall and bounce at `t` frames after it lands: falls fast,
 * hits, bounces (`bounces` times, each a third of the last), lies still.
 * Returns the lift off its rest point in px (negative = up).
 */
function bounceLift(t: number, drop: number, hop: number, bounces: number): number {
  if (t < 0) {
    const f = Math.max(-1, t / 9);
    return -drop * f * f; // gravity: accelerating down to the ground
  }
  let h = hop;
  let dur = 10;
  let s = t;
  for (let b = 0; b < bounces; b++) {
    if (s < dur) {
      const u = s / dur;
      return -h * 4 * u * (1 - u);
    }
    s -= dur;
    h *= 0.32;
    dur *= 0.6;
  }
  return 0;
}

/**
 * **Pea hail**: a hundred-odd faceless pea-sized stones landing all over the
 * grass and the path, bouncing, and lying there — nobody under any of them.
 * Deterministic (a fixed layout, never random), so Scenes 18–22 share it:
 * the hail that lands in 18 is the hail that melts in 22.
 *
 *   `pour`  [first, last] landing frame (scene-local), or omit = all landed;
 *   `melt`  0..1, the field melting into puddles (Scene 22);
 *   `light` the puddles' sheen colour.
 */
const PEAS = Array.from({ length: 120 }, (_, i) => {
  const depth = hash(i, 1);
  return {
    x: 160 + hash(i, 2) * 1600,
    y: 634 + depth * 150,
    r: 4 + depth * 5,
    land: hash(i, 3),
    melt: 0.35 + 0.65 * hash(i, 4),
  };
});

const PeaHail: React.FC<{ pour?: [number, number]; melt?: number; sheen?: string }> = ({ pour, melt = 0, sheen = "#9fb6cc" }) => {
  const frame = useCurrentFrame();
  return (
    <WideLayer>
      {PEAS.map((p, i) => {
        const landAt = pour ? pour[0] + p.land * (pour[1] - pour[0]) : -1e6;
        const t = frame - landAt;
        if (t < -9) return null;
        // Each stone melts on its own clock: the small ones first.
        const m = clamp01((melt - (1 - p.melt) * 0.6) / 0.55);
        const r = p.r * (1 - 0.85 * m);
        const lift = bounceLift(t, 260, 10 + p.r * 2.2, 2);
        return (
          <g key={i}>
            {m > 0.02 ? <ellipse cx={p.x} cy={p.y + p.r * 0.7} rx={p.r * (1 + 1.4 * m)} ry={p.r * 0.35 * (1 + m)} fill={sheen} opacity={0.28 * m} /> : null}
            {r > 0.6 ? (
              <>
                {t >= 0 ? <ellipse cx={p.x} cy={p.y + r * 0.9} rx={r * 0.9} ry={r * 0.25} fill={kidTheme.ink} opacity={0.18} /> : null}
                <circle cx={p.x} cy={p.y + lift} r={r} fill="#eef6ff" stroke="#8fb0cf" strokeWidth={1.6} />
                <circle cx={p.x - r * 0.35} cy={p.y + lift - r * 0.35} r={r * 0.28} fill="#ffffff" opacity={0.85} />
              </>
            ) : null}
          </g>
        );
      })}
    </WideLayer>
  );
};

/** A puddle where a named stone was (melting, Scene 22; wet lawn, Scene 23). */
const Puddle: React.FC<{ x: number; y: number; r: number; amount: number; sheen: string }> = ({ x, y, r, amount, sheen }) =>
  amount > 0.01 ? (
    <WideLayer>
      <ellipse cx={x} cy={y + r * 0.9} rx={r * (0.6 + 1.3 * amount)} ry={r * (0.2 + 0.32 * amount)} fill={sheen} opacity={0.55 * Math.min(1, amount * 1.5)} />
      <path d={`M ${x - r * 0.5} ${y + r * 0.82} L ${x + r * 0.1} ${y + r * 0.82}`} stroke={kidTheme.paper} strokeWidth={3} strokeLinecap="round" opacity={0.35 * amount} />
    </WideLayer>
  ) : null;

/**
 * The named four: landing (`landAt` per stone, omit = landed), melting
 * (`melt` per stone 0..1), and where they look (`look` −1..1).
 */
const NamedHail: React.FC<{
  landAt?: number[];
  melt?: number[];
  look?: number;
  mood?: "happy" | "calm" | "surprised";
  sheen?: string;
}> = ({ landAt, melt, look = 0, mood = "happy", sheen = "#9fb6cc" }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {LAWN_NAMED.map((h, i) => {
        const t = landAt ? frame - landAt[i] : 1e6;
        const m = clamp01(melt?.[i] ?? 0);
        const lift = bounceLift(t, 380, h.r * 1.6, 2);
        return (
          <React.Fragment key={h.name}>
            <Puddle x={h.x} y={h.y} r={h.r} amount={m} sheen={sheen} />
            {t < -9 || m >= 0.99 ? null : (
              <WideLayer>
                <HailBall
                  x={h.x}
                  y={h.y + lift + m * h.r * 0.55}
                  r={h.r * (1 - 0.7 * m)}
                  phase={h.phase}
                  look={look}
                  mood={t < 6 ? "surprised" : mood}
                  opacity={1 - 0.75 * m}
                />
              </WideLayer>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

/**
 * **Stony on the step.** `landAt` (Scene 18): he falls onto the far flagstone,
 * bounces ONCE — one arc, onto the step — and sits. Otherwise he is sitting.
 */
const StonyOnStep: React.FC<{ landAt?: number; melt?: number; look?: number; mood?: "happy" | "calm" | "surprised"; sheen?: string }> = ({
  landAt,
  melt = 0,
  look = 0,
  mood = "calm",
  sheen = "#9fb6cc",
}) => {
  const frame = useCurrentFrame();
  const HOP = 22;
  let x: number = STONY_SEAT.x;
  let y: number = STONY_SEAT.y;
  let squash = 0;
  if (landAt !== undefined) {
    const t = frame - landAt;
    if (t < -10) return null;
    if (t < 0) {
      // Falling onto the far flagstone, accelerating.
      const f = (t + 10) / 10;
      x = STONY_HIT.x;
      y = STONY_HIT.y - 420 * (1 - f * f);
    } else if (t < HOP) {
      // THE ONE BOUNCE: an arc off the flagstone onto the step.
      const u = t / HOP;
      x = STONY_HIT.x + (STONY_SEAT.x - STONY_HIT.x) * u;
      y = STONY_HIT.y + (STONY_SEAT.y - STONY_HIT.y) * u - 120 * 4 * u * (1 - u);
      squash = t < 3 ? 1 - t / 3 : 0;
    } else {
      // Sits down: a small settle on the step, then still.
      squash = Math.max(0, settleWave((t - HOP) / 14, 1, 4)) * 0.7;
    }
  }
  return (
    <>
      <Puddle x={STONY_SEAT.x} y={STONY_SEAT.y} r={STONY_R} amount={melt * 0.9} sheen={sheen} />
      <g transform={`translate(0 ${(squash * STONY_R * 0.12).toFixed(2)})`}>
        <Stony x={x} y={y} r={STONY_R} look={look} mood={landAt !== undefined && frame - landAt < HOP ? "surprised" : mood} melt={melt} />
      </g>
    </>
  );
};

/** Rain: slanted strokes off the storm, deterministic. */
const Rain: React.FC<{ strength: number; top?: number }> = ({ strength, top = 90 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (strength <= 0.01) return null;
  const t = frame / fps;
  const n = Math.round(30 + 60 * strength);
  return (
    <WideLayer>
      {Array.from({ length: n }, (_, i) => {
        const u = (t * (1.6 + hash(i, 5) * 0.6) + hash(i, 6)) % 1;
        const x = 150 + hash(i, 7) * 1700 - u * 60;
        const y = top + u * (800 - top);
        return <path key={i} d={`M ${x.toFixed(1)} ${y.toFixed(1)} l -9 30`} stroke="#c9d6e6" strokeWidth={3} strokeLinecap="round" opacity={0.42 * strength} />;
      })}
    </WideLayer>
  );
};

/**
 * **Scene 18's sky: the hotel overhead.** Its underside — dark, lumpy —
 * across the top of the glass; the rain and the hail come off it. `thin`
 * (0..1) shrinks its right end: the tower thinning, Sunny's glow behind it.
 */
const Underside: React.FC<{ thin: number }> = ({ thin }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const puffs = Array.from({ length: 16 }, (_, i) => {
    const f = i / 15;
    const fade = f > 1 - 0.45 * thin ? clamp01(1 - (f - (1 - 0.45 * thin)) / (0.45 * thin + 0.001)) : 1;
    return { x: 120 + f * 1700, y: 120 + Math.sin(i * 2.3) * 22 + Math.sin(t * 0.4 + i) * 4, r: (90 + (i % 3) * 22) * (0.5 + 0.5 * fade), a: fade };
  });
  return (
    <WideLayer>
      <rect x={100} y={-40} width={1720 * (1 - 0.3 * thin)} height={130} fill="#3b3e51" />
      {puffs.map((p, i) => (
        <circle key={`e${i}`} cx={p.x} cy={p.y} r={p.r + 8} fill="#3b3e51" opacity={p.a} />
      ))}
      {puffs.map((p, i) => (
        <circle key={`b${i}`} cx={p.x - 6} cy={p.y - 6} r={p.r} fill="#5a5f74" opacity={p.a} />
      ))}
    </WideLayer>
  );
};

/** A far bolt's sky-white: fainter with distance than the near ones. */
const FarSky: React.FC<{ at: number; strength: number }> = ({ at, strength }) => <FlashSky at={at} strength={strength} />;

/** The glass hum after an arrival: sharp and short near, long and low far. */
function humAfter(frame: number, arrive: number, count: number): number {
  const len = 24 + count * 16;
  const peak = count >= 9 ? 0.55 : count >= 6 ? 0.8 : 1;
  if (frame < arrive - 2 || frame > arrive + len) return 0;
  const u = (frame - arrive + 2) / (len + 2);
  const env = u < 0.08 ? u / 0.08 : 1 - (u - 0.08) / 0.92;
  // The far one ROLLS: a slow swell inside the decay.
  const roll = count >= 9 ? 0.6 + 0.4 * Math.sin((frame - arrive) * 0.22) : 1;
  return Math.max(0, peak * env * roll);
}

/**
 * **The rule stamp** — THREE COUNTS = ONE KILOMETRE (wind ep's `RuleStamp`
 * shape: thumps on from 2.4× in six frames on easeInQuad, rings out, stays).
 */
const RuleStamp: React.FC<{ lines: string[]; from: number; until: number; y?: number; color?: string; tilt?: number }> = ({
  lines,
  from,
  until,
  y = 170,
  color = "#d9663a",
  tilt = -3.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - from;
  if (f < -6 || frame >= until) return null;
  const drop = kidEase.easeInQuad(clamp01((f + 6) / 6));
  const scale = 2.4 - 1.4 * drop;
  const ring = f >= 0 ? settleWave(f / (fps * 0.7), 1.5, 4.2) : 0;
  const out = ramp(frame, until - 8, until);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(-50%) scale(${(scale * (1 + 0.1 * ring)).toFixed(3)}, ${(scale * (1 - 0.12 * ring)).toFixed(3)}) rotate(${tilt}deg)`,
        opacity: clamp01((f + 6) / 5) * (1 - out),
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: color,
          border: `10px solid ${kidTheme.ink}`,
          borderRadius: kidRadius.banner,
          padding: "14px 56px",
          fontSize: 76,
          fontWeight: 900,
          letterSpacing: 2,
          lineHeight: 1.05,
          textAlign: "center",
          color: kidTheme.paper,
          textShadow: kidInkOutline(3),
          boxShadow: kidShadow(1.3),
          whiteSpace: "nowrap",
        }}
      >
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </div>
  );
};

/** Drip on the outside sill (Scenes 18–21): a drop, travel-sized, watching. */
const DRIP_SILL = { x: 556, ground: 786, scale: 0.21 } as const;
const dripSillMark: Mark = { x: DRIP_SILL.x, y: stand("drip", DRIP_SILL.ground), scale: DRIP_SILL.scale, who: "drip", side: "right", offset: 300 };

const DripOnSill: React.FC<{ look?: LookDirection; emotion?: React.ComponentProps<typeof Drip>["emotion"]; speaking?: boolean }> = ({
  look = "camera",
  emotion = "happy",
  speaking = false,
}) => (
  <Drip
    x={DRIP_SILL.x}
    y={stand("drip", DRIP_SILL.ground)}
    scale={DRIP_SILL.scale}
    phase={PHASE.drip}
    emotion={emotion}
    speaking={speaking}
    look={look}
    shadow={false}
  />
);

/** The kid's look-target points (for `lookAt` from bodies outside). */
const KID_HANDS: Pt = { x: 960, y: 640 };

// ---------------------------------------------------------------------------
// Scene 18 — The grandest check-out
// ---------------------------------------------------------------------------

const S18_BUBBLES: Record<string, string> = {
  a3_02_cloudia: "LOVE MY GUESTS. HATE GRAVITY.",
  a3_03_cloudia: "THE GRANDEST CHECK-OUT IN HISTORY.",
  a3_04_sunny: "THAT RAIN IS MY WATER!",
  a3_06_sunny: "You're welcome! HA! HA!",
  a3_07_drip: "I am travel-sized again.",
};

/** Penthouse marks: Scene 6's, so the room is the room we left. */
const S18_DRIP = { x: 820, ground: 900, scale: 0.9 } as const;
const S18_STONY = { x: 1060, y: 640 } as const;
/** "Through the floor." inside a3_01, measured (silencedetect −35dB): 3.63s. */
const THROUGH_THE_FLOOR_S = 3.63;

/** The penthouse floor drawn again IN FRONT of the guests, so they fall into it. */
const FrontFloor: React.FC = () => {
  const y = LOBBY.floor;
  const near = PLATES.penthouse_freezer.near;
  return (
    <WideLayer>
      <path
        d={`M ${WIDE.x} ${WIDE.y + WIDE.h} L ${WIDE.x} ${y - 30} Q ${WIDTH / 2} ${y - 70} ${WIDE.x + WIDE.w} ${y - 30} L ${WIDE.x + WIDE.w} ${WIDE.y + WIDE.h} Z`}
        fill={mixHex(near, "#ffffff", 0.2)}
      />
      <path d={`M ${WIDE.x} ${y - 30} Q ${WIDTH / 2} ${y - 70} ${WIDE.x + WIDE.w} ${y - 30}`} stroke={mixHex(near, kidTheme.paper, 0.5)} strokeWidth={10} fill="none" opacity={0.6} />
    </WideLayer>
  );
};

/** Drip's ice coat (Scene 6's, simplified): faceted shell, `on` 0..1. */
const IceShell: React.FC<{ x: number; y: number; scale: number; on: number }> = ({ x, y, scale, on }) => {
  if (on <= 0.01) return null;
  const cy = y + 190 - 190 * scale + 20 * scale;
  const rx = 150 * scale;
  const ry = 180 * scale;
  const pts = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
    const k = i % 2 ? 0.94 : 1.04;
    return `${(x + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * ry * k).toFixed(1)}`;
  }).join(" ");
  return (
    <WideLayer>
      <g opacity={on}>
        <polygon points={pts} fill="#e3f3ff" opacity={0.42} stroke="#8dbbe2" strokeWidth={Math.max(2, 8 * scale)} strokeLinejoin="round" />
        <path d={`M ${x - rx * 0.5} ${cy - ry * 0.4} l ${rx * 0.25} ${-ry * 0.2}`} stroke="#ffffff" strokeWidth={Math.max(2, 12 * scale)} strokeLinecap="round" opacity={0.8} />
      </g>
    </WideLayer>
  );
};

const CheckoutPenthouse: SceneFC = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [narrFrom] = lineWindow(scene, "a3_01_narrator");
  const [loveFrom] = lineWindow(scene, "a3_02_cloudia");
  const [grandFrom] = lineWindow(scene, "a3_03_cloudia");
  // THE CHECK-OUT: every guest on the top floor, at the same time, on the
  // word — through the floor (there are no stairs).
  const dropAt = narrFrom + Math.round(THROUGH_THE_FLOOR_S * 30) - 4;
  const t = frame - dropAt;
  const fall = t <= 0 ? 0 : 1000 * Math.pow(t / 20, 2);
  // The floor going soft under them first: the crowd shivers, looks down.
  const shiver = ramp(frame, narrFrom + 30, dropAt);
  const glide = ramp(frame, dropAt + 10, loveFrom - 4);
  const cloudia: Mark = {
    x: 1690 - 420 * glide,
    y: hover("cloudia", 420 + 40 * glide, 0.52),
    scale: 0.52,
    who: "cloudia",
    side: "left",
    offset: 340,
  };
  const cloudiaEmotion = emotionAt(
    frame,
    [
      { at: dropAt, emotion: "amazed" },
      { at: loveFrom, emotion: "sad" },
      { at: grandFrom, emotion: "proud" },
    ],
    "happy",
  );
  const dripEmotion = emotionAt(frame, [{ at: dropAt - 6, emotion: "amazed" }], "happy");
  // Poofs where they went through the floor.
  const poof = t > 6 ? clamp01((t - 6) / 26) : 0;
  return (
    <HotelWorld
      mode="penthouse"
      phase={1.1}
      overlay={<Bubbles scene={scene} cast={{ cloudia }} text={S18_BUBBLES} />}
    >
      {fall < 900 ? (
        <>
          <HailCrowd look={0} dy={fall} mood={t > -8 ? "surprised" : "happy"} extras={9} rub={0.35 * shiver} />
          <Stony x={S18_STONY.x} y={S18_STONY.y + fall} mood={t > -8 ? "surprised" : "calm"} />
          <Drip
            x={S18_DRIP.x}
            y={stand("drip", S18_DRIP.ground) + fall}
            scale={S18_DRIP.scale}
            phase={PHASE.drip}
            emotion={dripEmotion}
            pose={t > 0 ? "cheer" : "rest"}
            shadow={false}
            look={t > -8 ? "down" : "camera"}
          />
          <IceShell x={S18_DRIP.x} y={stand("drip", S18_DRIP.ground) + fall} scale={S18_DRIP.scale} on={1} />
        </>
      ) : null}
      {t > 0 ? <FrontFloor /> : null}
      {poof > 0 && poof < 1 ? (
        <WideLayer>
          {[300, 560, 820, 1060, 1300, 1560].map((x, i) => (
            <ellipse
              key={x}
              cx={x + Math.sin(i * 2) * 20}
              cy={LOBBY.floor - 46 - poof * 40}
              rx={50 + 90 * poof}
              ry={18 + 26 * poof}
              fill="#ffffff"
              opacity={0.55 * (1 - poof)}
            />
          ))}
        </WideLayer>
      ) : null}
      <Cloudia
        x={cloudia.x}
        y={cloudia.y}
        scale={0.52}
        phase={PHASE.cloudia}
        fill={0.5}
        emotion={cloudiaEmotion}
        speaking={stage.speaking("cloudia")}
        look={t > -10 ? "down" : "left"}
      />
    </HotelWorld>
  );
};

/** Sunny's glow at the thinning underside's right end (Scene 18). */
const S18_GLOW = { x: 1400, y: 236 } as const;

const CheckoutWindow: React.FC<{ scene: TimedScene; w0: number }> = ({ scene, w0 }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [sunnyFrom] = lineWindow(scene, "a3_04_sunny");
  // The pour is already on when we cut out of the penthouse, and keeps going.
  const pour: [number, number] = [w0 - 70, scene.durationInFrames + 40];
  // The named four land in the first second; Stony after them.
  const named = [w0 + 14, w0 + 30, w0 + 44, w0 + 58];
  const stonyAt = w0 + 70;
  // DRIP: small hail melts on the way down — she falls through the frame in
  // a shrinking ice coat and lands on the sill as a drop. Timed off a3_04
  // (never a3_07, which is CUTTABLE).
  const dripAt = (sunnyFrom || w0 + 4) + 110;
  const dripFall = 34;
  const df = clamp01((frame - (dripAt - dripFall)) / dripFall);
  const dripY = interpolate(df, [0, 1], [20, DRIP_SILL.ground], { easing: kidEase.gravity });
  const landed = frame >= dripAt;
  const thin = ramp(frame, w0, scene.durationInFrames);
  const lean = 0.25 + 0.2 * ramp(frame, stonyAt, stonyAt + 20);
  const sunny: Mark = { x: S18_GLOW.x, y: S18_GLOW.y + 100, scale: 1, who: "boom", lift: 0, side: "left", offset: 330 };
  const glowAt = { x: 1000, y: 180, tail: "right" as const, tailAt: S18_GLOW.x - 60 };
  return (
    <WindowWorld
      bg="lawn_hail_dark"
      sky="dark"
      phase={0.7}
      outside={
        <>
          <SunnyGlow x={S18_GLOW.x} y={S18_GLOW.y} r={170} strength={0.75 + 0.25 * thin} speaking={stage.speaking("sunny")} />
          <Underside thin={thin} />
          <Hills tone="dark" />
          <StepAndPath tone="dark" wet={1} />
          <PeaHail pour={pour} />
          <NamedHail landAt={named} look={0.3} />
          <StonyOnStep landAt={stonyAt} look={0.6} />
          {frame >= dripAt - dripFall ? (
            landed ? (
              <DripOnSill emotion="happy" speaking={stage.speaking("drip")} look={stage.speaking("drip") ? "camera" : "upRight"} />
            ) : (
              <>
                <Drip x={DRIP_SILL.x + 30 * (1 - df)} y={stand("drip", dripY)} scale={DRIP_SILL.scale * (1.5 - 0.5 * df)} phase={PHASE.drip} emotion="amazed" pose="cheer" shadow={false} look="down" />
                <IceShell x={DRIP_SILL.x + 30 * (1 - df)} y={stand("drip", dripY)} scale={DRIP_SILL.scale * (1.5 - 0.5 * df)} on={1 - df} />
              </>
            )
          ) : null}
          <Rain strength={1 - 0.3 * thin} />
        </>
      }
      kid={{ ...KID_AT_WINDOW, blanket: 0.7, lean }}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ sunny, drip: dripSillMark }}
          text={S18_BUBBLES}
          at={{ a3_04_sunny: glowAt, a3_06_sunny: glowAt, a3_07_drip: { x: 420, y: 560, tail: "right", tailAt: DRIP_SILL.x } }}
        />
      }
    />
  );
};

const CheckoutScene: SceneFC = ({ scene }) => {
  const frame = useCurrentFrame();
  // CUT out of the penthouse when Cloudia has finished with her gala (a3_03),
  // to the window: the check-out arriving on the lawn.
  const [, grandTo] = lineWindow(scene, "a3_03_cloudia");
  const [sunnyFrom] = lineWindow(scene, "a3_04_sunny");
  const w0 = grandTo > 0 ? grandTo + 4 : sunnyFrom - 4;
  return frame < w0 ? <CheckoutPenthouse scene={scene} /> : <CheckoutWindow scene={scene} w0={w0} />;
};

// ---------------------------------------------------------------------------
// Scenes 19–21 — the counts going up (one component each, shared pieces)
// ---------------------------------------------------------------------------

/** Boom: walking in on his leg, then standing at the glass. */
const BoomIn: React.FC<{
  leg: Leg;
  speaking: boolean;
  emotion: React.ComponentProps<typeof Boom>["emotion"];
  look: LookDirection;
  burstAt?: number;
  puff?: number;
}> = ({ leg, speaking, emotion, look, burstAt, puff }) => {
  const frame = useCurrentFrame();
  if (frame < leg.at) return null;
  const s = legAt(frame, leg);
  const arrived = s.u >= 1;
  return (
    <Boom
      x={s.x}
      y={hover("boom", s.y, s.scale)}
      scale={s.scale}
      distance={s.distance}
      phase={PHASE.boom}
      walking={arrived ? 0 : 1}
      heading={arrived ? 200 : s.angle}
      burstAt={burstAt}
      emotion={emotion}
      speaking={speaking}
      look={arrived ? look : "camera"}
      puff={puff}
      opacity={Math.min(1, (frame - leg.at) / 6)}
    />
  );
};

/** His bubble clears his body at every size: the offset grows with his radius. */
const boomGlassMark = (count: number): Mark =>
  boomMark(GLASS.x, GLASS.y, GLASS_SCALE, distanceForCount(count), "right", BOOM_R * boomGrow(distanceForCount(count)) * GLASS_SCALE + 330);

/** Boom's eye-lines: the kid's hands, and the sky where Flash was. */
const BOOM_TO_HANDS = lookAt(GLASS, KID_HANDS);

// ---------------------------------------------------------------------------
// Scene 19 — Three again
// ---------------------------------------------------------------------------

const S19_BUBBLES: Record<string, string> = {
  a3_11_boom: "PRESENT!",
  a3_12_boom: "I HAVE NOT CHANGED ONE THING.",
  a3_13_boom: "Didn't I?",
};

/** Flash, BEHIND the house over the hills: sideways, off towards frame left. */
const S19_FLASH = { from: { x: 560, y: 236 }, to: { x: 100, y: 150 } } as const;

const ThreeAgainScene: SceneFC = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const run = countRuns(scene)[0];
  // Flash on the run's first frame: the count measures from her, so three
  // counts on screen are exactly three seconds to his arrival.
  const flashAt = run.from;
  const [presentFrom] = lineWindow(scene, "a3_11_boom");
  const [theoryFrom, theoryTo] = lineWindow(scene, "a3_12_boom");
  const leg: Leg = { at: flashAt, arrive: run.arrive, from: { x: 430, y: 236 }, count: run.count, arc: 0.1 };
  const fingers = fingersAt(scene, frame) * (1 - ramp(frame, theoryFrom + 70, theoryFrom + 92));
  // THE HOTEL WALKS ON over the house and out the other side: from overhead
  // (its body off the top of the glass) away to the upper left.
  const walk = ramp(frame, 0, Math.min(scene.durationInFrames, 330), kidEase.easeInOutSine);
  const hotel = { x: 820 - 520 * walk, base: 250 + 50 * walk, width: 520 - 160 * walk, height: 760 - 260 * walk };
  const glow = { x: hotel.x + hotel.width * 0.78, y: hotel.base - 120 };
  const key = lastKeyAt(scene, frame);
  const boomEmotion = useEmotion(
    scene,
    "boom",
    { a3_11_boom: "excited", a3_12_boom: "amazed", a3_13_boom: "neutral", a3_14_narrator: "happy" },
    "happy",
    NO_LEAD,
    { a3_14_narrator: "boom" },
  );
  // Halfway through his run-on the delight turns to puzzlement ("I have not
  // changed one thing") — dismay played as comedy inside delight.
  const theoryFace = frame >= theoryFrom + (theoryTo - theoryFrom) * 0.45 && key === "a3_12_boom" ? "skeptical" : null;
  const boomLook: LookDirection =
    key === "a3_13_boom" ? "upLeft" : key === "a3_12_boom" && frame < theoryFrom + 60 ? BOOM_TO_HANDS : "camera";
  const hum = humAfter(frame, run.arrive, run.count);
  return (
    <WindowWorld
      bg="lawn_hail_dark"
      sky="dark"
      phase={1.4}
      flashes={[flashAt]}
      outside={
        <>
          <SunnyGlow x={glow.x} y={glow.y} r={140} strength={0.7} />
          <HotelTower x={hotel.x} base={hotel.base} width={hotel.width} height={hotel.height} grow={1} tone="storm" />
          <Hills tone="dark" />
          <StepAndPath tone="dark" />
          <PeaHail melt={0.04} />
          <NamedHail look={frame >= run.arrive ? -0.6 : 0} />
          <StonyOnStep look={frame >= run.arrive ? 0.8 : 0} />
          <DripOnSill look={frame >= run.arrive ? "up" : "upLeft"} emotion={frame >= presentFrom && frame < presentFrom + 40 ? "excited" : "happy"} />
          <Rain strength={0.35 * (1 - walk)} top={hotel.base} />
          <Flash at={flashAt} from={S19_FLASH.from} to={S19_FLASH.to} weight={0.9} />
          <BoomIn
            leg={leg}
            speaking={stage.speaking("boom")}
            emotion={theoryFace ?? boomEmotion}
            look={boomLook}
            burstAt={presentFrom + 7}
          />
        </>
      }
      kid={{ ...KID_AT_WINDOW, fingers, blanket: settleTo(frame, 0.7, 0.6), lean: settleTo(frame, 0.45, 0.15) }}
      ripple={hum}
      rattle={hum}
      overlay={<Bubbles scene={scene} cast={{ boom: boomGlassMark(run.count) }} text={S19_BUBBLES} />}
    />
  );
};

// ---------------------------------------------------------------------------
// Scene 20 — Six. The turn
// ---------------------------------------------------------------------------

const S20_BUBBLES: Record<string, string> = {
  a3_21_boom: "PRESENT!",
  a3_23_boom: "NEVER LATE. I WAS FAR.",
  a3_24_boom: "Flash! Did you hear that?",
  a3_25_boom: "I TELL HER EVERYTHING ANYWAY.",
  a3_27_boom: "Count me.",
};

/** Flash, farther out over the hills: sideways again, smaller. */
const S20_FLASH = { from: { x: 470, y: 286 }, to: { x: 190, y: 246 } } as const;

const SixTurnScene: SceneFC = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const run = countRuns(scene)[0];
  const flashAt = run.from;
  const [presentFrom] = lineWindow(scene, "a3_21_boom");
  const [workFrom] = lineWindow(scene, "a3_23_boom");
  const [stampFrom, stampTo] = lineWindow(scene, "a3_26_narrator");
  const [, countMeTo] = lineWindow(scene, "a3_27_boom");
  const [weWillFrom] = lineWindow(scene, "a3_28_narrator");
  const leg: Leg = { at: flashAt, arrive: run.arrive, from: { x: 330, y: 270 }, count: run.count, arc: 0.12 };
  // Six fingers held while the Narrator says "Six. Two kilometres." and Boom
  // looks at them — down as his working-out gets going.
  const fingers = fingersAt(scene, frame) * (1 - ramp(frame, workFrom + 40, workFrom + 62));
  // THE TURN, after it: "We will." — the kid's hands come off the sill,
  // ready to count him. (After the 60f hold; nothing enters inside it.)
  const ready = ramp(frame, weWillFrom + 6, weWillFrom + 30);
  // He swells on "We will." — his pride louder than before.
  const puff = ramp(frame, weWillFrom + 4, weWillFrom + 24, kidEase.easeOutBack);
  const drift = ramp(frame, 0, scene.durationInFrames, kidEase.linear);
  const hotel = { x: 290 - 50 * drift, base: 352 + 10 * drift, width: 250 - 30 * drift, height: 400 - 40 * drift };
  const glow = { x: hotel.x + hotel.width * 0.82, y: hotel.base - 150 };
  const key = lastKeyAt(scene, frame);
  const boomEmotion = useEmotion(
    scene,
    "boom",
    {
      a3_21_boom: "excited",
      a3_22_narrator: "amazed",
      a3_23_boom: "excited",
      a3_24_boom: "happy",
      a3_25_boom: "happy",
      a3_26_narrator: "proud",
      a3_27_boom: "happy",
    },
    "happy",
    NO_LEAD,
    { a3_22_narrator: "boom", a3_26_narrator: "boom" },
  );
  // Eye-lines, keyed off the last line STARTED (constant inside both holds).
  const boomLook: LookDirection =
    key === "a3_22_narrator" || key === "a3_27_boom" || key === "a3_28_narrator"
      ? BOOM_TO_HANDS
      : key === "a3_24_boom"
        ? "upLeft"
        : key === "a3_25_boom"
          ? "left"
          : "camera";
  const hum = humAfter(frame, run.arrive, run.count);
  return (
    <WindowWorld
      bg="lawn_hail_dark"
      sky="dark"
      phase={2.1}
      outside={
        <>
          <SunnyGlow x={glow.x} y={glow.y} r={140} strength={0.8} />
          <FarStorm x={hotel.x} base={hotel.base} width={hotel.width} height={hotel.height} grow={1} tone="storm" dim={0.12 + 0.08 * drift} />
          <FrontHorizon light="dark" />
          <Hills tone="dark" />
          <StepAndPath tone="dark" />
          <PeaHail melt={0.1} />
          <NamedHail look={frame >= run.arrive ? -0.6 : 0} />
          <StonyOnStep look={frame >= run.arrive ? 0.8 : 0} />
          <DripOnSill look={frame >= run.arrive ? "up" : "upLeft"} />
          <Rain strength={0.12} top={hotel.base} />
          <FarSky at={flashAt} strength={0.7} />
          <Flash at={flashAt} from={S20_FLASH.from} to={S20_FLASH.to} weight={0.7} />
          <BoomIn leg={leg} speaking={stage.speaking("boom")} emotion={boomEmotion} look={boomLook} burstAt={presentFrom + 7} puff={puff} />
        </>
      }
      kid={{ ...KID_AT_WINDOW, fingers, raise: 0.3 * ready, blanket: settleTo(frame, 0.6, 0.5), lean: 0.15 }}
      ripple={hum}
      rattle={hum}
      overlay={
        <>
          <RuleStamp lines={["THREE COUNTS", "= ONE KILOMETRE"]} from={stampFrom + 40} until={Math.min(stampTo + 6, countMeTo - 30)} y={150} />
          <Bubbles scene={scene} cast={{ boom: boomGlassMark(run.count) }} text={S20_BUBBLES} />
        </>
      }
    />
  );
};

// ---------------------------------------------------------------------------
// Scene 21 — Nine. The rumble
// ---------------------------------------------------------------------------

const S21_BUBBLES: Record<string, string> = {
  a3_38_boom: "Present!",
  a3_40_boom: "I am very long.",
  a3_41_boom: "They let me arrive twice.",
  a3_42_boom: "Did you see that one?",
};

/** The storm, past the volcano: a small tower BEHIND him on the horizon. */
const S21_STORM = { x: 470, base: 462 } as const;
/** Flash, far, past the volcano: a short sideways bolt across the far storm. */
const S21_FLASH = { from: { x: 392, y: 262 }, to: { x: 560, y: 230 } } as const;
/** Where the hills hand him back from: several directions. */
const ECHO_FROM: Pt[] = [
  { x: 230, y: 520 },
  { x: 175, y: 440 },
  { x: 1500, y: 470 },
];

/** A faceless pair of rings (the sound itself) from `from` to the glass. */
const RingsOnTheWay: React.FC<{ from: Pt; at: number; dur: number; count: number; alpha: number; to?: Pt }> = ({ from, at, dur, count, alpha, to }) => {
  const frame = useCurrentFrame();
  const u = (frame - at) / dur;
  if (u <= 0 || u >= 1) return null;
  const p = moveAlong(from, to ?? GLASS, u, { arc: 0, ease: kidEase.linear });
  const scale = 0.25 + 0.55 * u;
  return (
    <Boom
      x={p.x}
      y={hover("boom", p.y, scale)}
      scale={scale}
      distance={distanceForCount(count) * (0.5 + 0.5 * u)}
      phase={PHASE.boom + at * 0.01}
      heading={p.angle}
      ringsOnly
      rings={1}
      opacity={alpha * Math.min(1, u * 6) * Math.min(1, (1 - u) * 5)}
    />
  );
};

const NineRumbleScene: SceneFC = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const run = countRuns(scene)[0];
  const flashAt = run.from;
  const [presentFrom] = lineWindow(scene, "a3_38_boom");
  const [longFrom, longTo] = lineWindow(scene, "a3_39_narrator");
  const [veryLongFrom] = lineWindow(scene, "a3_40_boom");
  const from: Pt = { x: S21_STORM.x, y: S21_STORM.base - 30 };
  // He rolls in OVER THE HILLS: the path bows down across the headland.
  const leg: Leg = { at: flashAt, arrive: run.arrive, from, count: run.count, arc: -0.45 };
  const down = ramp(frame, longFrom + 80, longFrom + 104);
  const fingers = fingersAt(scene, frame) * (1 - down);
  // The hands are already up off the sill ("We will.") and count there.
  const raise = 0.3 * (1 - down);
  // "He is kilometres long, and the near end of him gets here before the far
  // end does": a string of ring pairs strung back along his road, arriving
  // one after another, across the first half of a3_39.
  const chain = (frame - (longFrom + 20)) / Math.max(1, (longTo - longFrom) * 0.5);
  // "The hills hand him back as well." (~60% into a3_39): the echoes again.
  const handBack = longFrom + Math.round((longTo - longFrom) * 0.58);
  const echoes = [
    { from: ECHO_FROM[0], at: run.arrive + 10 },
    { from: ECHO_FROM[1], at: run.arrive + 34 },
    { from: ECHO_FROM[2], at: run.arrive + 60 },
    { from: ECHO_FROM[0], at: handBack },
    { from: ECHO_FROM[2], at: handBack + 18 },
    { from: ECHO_FROM[1], at: handBack + 34 },
  ];
  // The rumble ROLLS ON after it should have stopped: a long low hum, and a
  // second swell with the echoes.
  const hum = Math.max(humAfter(frame, run.arrive, run.count), 0.6 * humAfter(frame, handBack + 10, run.count));
  // Dusk coming: the storm light warms to violet across the scene.
  const dusk = ramp(frame, 0, scene.durationInFrames, kidEase.linear);
  // The kid's hand is the picture: a slow push towards the glass on the count.
  const push = ramp(frame, run.from, run.arrive + 30) * (1 - ramp(frame, longFrom + 90, longFrom + 160));
  const key = lastKeyAt(scene, frame);
  const boomEmotion = useEmotion(
    scene,
    "boom",
    { a3_38_boom: "excited", a3_39_narrator: "happy", a3_40_boom: "proud", a3_41_boom: "happy", a3_42_boom: "excited", a3_43_narrator: "proud" },
    "happy",
  );
  const boomLook: LookDirection = key === "a3_42_boom" ? "upLeft" : key === "a3_41_boom" ? "left" : key === "a3_39_narrator" ? BOOM_TO_HANDS : "camera";
  const puff = ramp(frame, veryLongFrom, veryLongFrom + 20, kidEase.easeOutBack) * (1 - ramp(frame, veryLongFrom + 60, veryLongFrom + 90));
  const world = (
    <WindowWorld
      bg="lawn_hail_dark"
      sky="dusk"
      phase={2.8}
      tint={`rgba(${Math.round(70 + 40 * dusk)}, ${Math.round(48 + 10 * dusk)}, ${Math.round(110 + 20 * dusk)}, ${(0.12 + 0.3 * dusk).toFixed(3)})`}
      outside={
        <>
          <SunnyGlow x={S21_STORM.x + 160} y={S21_STORM.base - 110} r={110} strength={0.55 + 0.3 * dusk} />
          <FarStorm x={S21_STORM.x} base={S21_STORM.base} width={250 - 20 * dusk} height={300 - 30 * dusk} grow={1} anvil={0.2} tone="storm" dim={0.3 + 0.1 * dusk} />
          <FrontHorizon light="dusk" />
          <Hills tone="dusk" />
          <StepAndPath tone="dusk" />
          <PeaHail melt={0.18} sheen="#8a86b8" />
          <NamedHail look={frame >= run.arrive ? -0.6 : 0} mood={frame >= run.arrive && frame < run.arrive + 90 ? "surprised" : "happy"} />
          <StonyOnStep look={frame >= run.arrive ? 0.8 : 0} mood={frame >= run.arrive && frame < run.arrive + 90 ? "surprised" : "calm"} />
          <DripOnSill look={frame >= run.arrive ? "up" : "upLeft"} />
          <FarSky at={flashAt} strength={0.4} />
          <Flash at={flashAt} from={S21_FLASH.from} to={S21_FLASH.to} weight={0.5} />
          {chain > 0 && chain < 1.25
            ? [1, 2, 3, 4, 5].map((k) => {
                const u = clamp01(1 - k * 0.18 + chain * 0.95);
                if (u >= 0.999) return null;
                const s = legAt(leg.at + u * (leg.arrive - leg.at), leg);
                return (
                  <Boom
                    key={k}
                    x={s.x}
                    y={hover("boom", s.y, s.scale)}
                    scale={s.scale}
                    distance={s.distance}
                    phase={PHASE.boom + k}
                    heading={s.angle}
                    ringsOnly
                    rings={1}
                    opacity={0.55 * clamp01(chain * 5) * clamp01((1 - u) * 6)}
                  />
                );
              })
            : null}
          {echoes.map((e) => (
            <RingsOnTheWay key={`${e.at}-${e.from.x}`} from={e.from} at={e.at} dur={40} count={run.count} alpha={0.55} />
          ))}
          <BoomIn leg={leg} speaking={stage.speaking("boom")} emotion={boomEmotion} look={boomLook} burstAt={presentFrom + 7} puff={puff} />
        </>
      }
      kid={{ ...KID_AT_WINDOW, fingers, raise, blanket: settleTo(frame, 0.5, 0.4), lean: 0.15 + 0.15 * push }}
      ripple={hum}
      rattle={hum}
      overlay={<Bubbles scene={scene} cast={{ boom: boomGlassMark(run.count) }} text={S21_BUBBLES} />}
    />
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 640px", transform: `scale(${(1 + 0.05 * push).toFixed(4)})` }}>{world}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 22 — Roll call, firing 2: goodbye on the lawn
// ---------------------------------------------------------------------------

/**
 * The goodbye roll call's name onsets inside `a3_47_drip`, MEASURED (ffmpeg
 * silencedetect −35dB): "Bye, Hail." 0.18s, "Bye, Hailey." 1.21s, "Bye, other
 * Hail." 2.27s, "Bye, Hail the third." 3.71s, "Bye, Stony." 5.02s.
 */
const BYE_ONSETS_S = [0.18, 1.21, 2.27, 3.71, 5.02];
const BYE_NAMES = ["Bye, Hail.", "Bye, Hailey.", "Bye, other Hail.", "Bye, Hail the third.", "Bye, Stony."];

/** Drip on the step beside Stony, drop-sized, among them. */
const S22_DRIP = { x: STEP.x + 92, ground: STEP.top + 6, scale: 0.21 } as const;
/** The storm wall past the volcano, and Sunny out from behind it. */
const S22_WALL = { x: 600, base: 466 } as const;
const S22_SUNNY = { fromX: 610, toX: 1010, y: 336, scale: 0.5 } as const;
const S22_SHEEN = "#cdb27e";

const S22_BUBBLES: Record<string, string> = {
  a3_45_sunny: "I NEVER LEFT!",
  a3_49_drip: "I was big for an hour.",
};

const GoodbyeScene: SceneFC = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage(scene);
  const [rollFrom, rollTo] = lineWindow(scene, "a3_47_drip");
  // SUNNY, OUT FROM BEHIND THE TOWER AT LAST: low and gold, his face again,
  // sliding out from behind the storm wall on "I am back!".
  const out = ramp(frame, 0, 34, kidEase.easeOutBack);
  const sunnyX = S22_SUNNY.fromX + (S22_SUNNY.toX - S22_SUNNY.fromX) * out;
  const sunny: Mark = { x: sunnyX, y: hover("sunny", S22_SUNNY.y, S22_SUNNY.scale), scale: S22_SUNNY.scale, who: "sunny", side: "right", offset: 330 };
  // The garden gets its light back: a gold wash comes up over the scene's
  // first two seconds (a value change, not a hue).
  const light = ramp(frame, 0, 60);
  // THE ROLL CALL: one bubble per name on its measured onset; each named
  // stone finishes melting just after its goodbye; Stony last of all.
  const onsets = BYE_ONSETS_S.map((s) => rollFrom + Math.round(s * fps));
  const named = onsets.reduce((n, at, i) => (frame >= at ? i : n), -1);
  const meltNamed = LAWN_NAMED.map((_, i) => 0.2 * ramp(frame, 0, onsets[i] - 20) + 0.8 * ramp(frame, onsets[i] - 20, onsets[i] + 40));
  const stonyMelt = 0.12 * ramp(frame, 0, onsets[4]) + 0.73 * ramp(frame, onsets[4], scene.durationInFrames, kidEase.easeInOutSine);
  const fieldMelt = 0.18 + 0.82 * ramp(frame, 0, scene.durationInFrames * 0.85);
  // Drip's eye-line goes to each stone as she names it, and stays on Stony.
  const target =
    named >= 4 ? STONY_SEAT : named >= 0 && frame < rollTo + 20 ? LAWN_NAMED[named] : frame >= rollTo ? STONY_SEAT : null;
  const dripLook: LookDirection = target
    ? { x: clamp((target.x - S22_DRIP.x) / 500, -1, 1), y: clamp((target.y - (S22_DRIP.ground - 40)) / 300, -1, 1) }
    : "upRight";
  const sunnyLook: LookDirection = frame < 50 ? "left" : { x: -0.8, y: 0.8 };
  const dripMark: Mark = { x: S22_DRIP.x, y: stand("drip", S22_DRIP.ground), scale: S22_DRIP.scale, who: "drip", side: "right", offset: 300 };
  const nameAt = { x: 640, y: 560, tail: "left" as const, tailAt: S22_DRIP.x };
  return (
    <WindowWorld
      bg="lawn_hail_dark"
      sky="dusk"
      phase={3.3}
      // From Scene 21's last light (violet dusk wash) up to the gold.
      tint={`rgba(${Math.round(110 + 145 * light)}, ${Math.round(58 + 138 * light)}, ${Math.round(130 - 20 * light)}, ${(0.42 - 0.36 * light).toFixed(3)})`}
      outside={
        <>
          {/* The garden gets its light back: the sky lifts, gold low down. */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: GARDEN.horizon,
              background: `linear-gradient(to bottom, rgba(150, 178, 222, ${(0.5 * light).toFixed(3)}) 0%, rgba(255, 206, 140, ${(0.7 * light).toFixed(3)}) 100%)`,
            }}
          />
          <Sunny x={sunny.x} y={sunny.y} scale={S22_SUNNY.scale} phase={PHASE.sunny} emotion={stage.speaking("sunny") ? "excited" : "proud"} speaking={stage.speaking("sunny")} look={sunnyLook} />
          <FarStorm x={S22_WALL.x} base={S22_WALL.base} width={330} height={250} grow={0.78} anvil={0} tone="storm" dim={0.18} />
          <FrontHorizon light="dusk" />
          <Hills tone="gold" />
          {/* The lawn catching the low gold light. */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 600, height: 200, background: `rgba(255, 205, 120, ${(0.14 * light).toFixed(3)})` }} />
          <StepAndPath tone="gold" wet={1} />
          <PeaHail melt={fieldMelt} sheen={S22_SHEEN} />
          <NamedHail melt={meltNamed} look={0} sheen={S22_SHEEN} />
          <StonyOnStep melt={stonyMelt} look={0.7} mood="happy" sheen={S22_SHEEN} />
          <Drip
            x={S22_DRIP.x}
            y={stand("drip", S22_DRIP.ground)}
            scale={S22_DRIP.scale}
            phase={PHASE.drip}
            emotion="happy"
            speaking={stage.speaking("drip")}
            look={dripLook}
            shadow={false}
          />
        </>
      }
      kid={{ ...KID_AT_WINDOW, blanket: settleTo(frame, 0.4, 0, scene.durationInFrames) }}
      overlay={
        <>
          <Bubbles scene={scene} cast={{ sunny, drip: dripMark }} text={S22_BUBBLES} at={{ a3_45_sunny: { x: S22_SUNNY.toX + 330, y: 170, tail: "left", tailAt: S22_SUNNY.toX }, a3_49_drip: nameAt }} />
          {BYE_NAMES.map((text, i) => (
            <SpeechBubble
              key={text}
              x={nameAt.x}
              y={nameAt.y}
              text={text}
              tail="left"
              tailAt={S22_DRIP.x}
              from={onsets[i]}
              until={i < 4 ? onsets[i + 1] - 7 : rollTo}
            />
          ))}
        </>
      }
    />
  );
};

// ---------------------------------------------------------------------------
// Scene 23 — Ten fingers, and nothing
// ---------------------------------------------------------------------------

/** The storm at dusk: a low flicker FAR past the volcano, right of the island. */
const S23_STORM = { x: 690, base: 468 } as const;
/** Flash, tiny, out there: down to the sea right of the island (>15 km). */
const S23_FLASH = { from: { x: 706, y: 418 }, to: { x: 728, y: 467 } } as const;

/** The lobby camera — act 1's pattern, copied (never imported). */
const LOBBY_CAM: Cam = { x: 1010, y: 860, zoom: 1.4 };
const onLobby = (cast: Cast): Cast =>
  Object.fromEntries(Object.entries(cast).map(([k, m]) => [k, m ? projectMark(LOBBY_CAM, m) : m])) as Cast;
/** Cloudia behind the desk — act 1's mark, so the lobby is the lobby. */
const DESK_CLOUDIA: Mark = { x: LOBBY.deskX, y: hover("cloudia", 590, 0.62), scale: 0.62, who: "cloudia", side: "left", offset: 360 };
/** Where he was born, and the hole she left by (Scene 9's numbers). */
const BIRTH = { x: 860, y: 680 } as const;
const HOLE = { x: 400, y: 600, rx: 110, ry: 150 } as const;

/** Scene 9's hole in the lobby wall — still there — with DUSK through it. */
const DuskHole: React.FC = () => {
  const pts = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const k = i % 2 ? 0.82 : 1.06;
    return `${(HOLE.x + Math.cos(a) * HOLE.rx * k).toFixed(1)},${(HOLE.y + Math.sin(a) * HOLE.ry * k).toFixed(1)}`;
  }).join(" ");
  return (
    <WideLayer>
      <defs>
        <clipPath id="storm-a3-dusk-hole">
          <polygon points={pts} />
        </clipPath>
      </defs>
      <polygon points={pts} fill="#8d8aa0" transform="translate(10 10)" />
      <g clipPath="url(#storm-a3-dusk-hole)">
        <rect x={HOLE.x - 300} y={HOLE.y - 300} width={600} height={180} fill="#6f63b3" />
        <rect x={HOLE.x - 300} y={HOLE.y - 120} width={600} height={180} fill="#d98aa6" />
        <rect x={HOLE.x - 300} y={HOLE.y + 60} width={600} height={300} fill="#2b4c8f" />
      </g>
      <polygon points={pts} fill="none" stroke="#77748a" strokeWidth={12} strokeLinejoin="round" />
    </WideLayer>
  );
};

/** The register, and the tick she gives him (`on` 0..1 draws the stroke). */
const RegisterTick: React.FC<{ on: number }> = ({ on }) =>
  on > 0.01 ? (
    <WideLayer>
      <path
        d={`M ${LOBBY.deskX - 52} ${LOBBY.floor - 226} l 10 10 l 22 -22`}
        stroke="#2f6fd6"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - on}
        transform={`rotate(-4 ${LOBBY.deskX} ${LOBBY.floor - 220})`}
      />
    </WideLayer>
  ) : null;

const S23_LOBBY_BUBBLES: Record<string, string> = {
  a3_64_boom: "PRESENT!",
  a3_65_cloudia: "MARK HIM PRESENT, DARLING.",
};

/** THE HOTEL CUT: Flash, and instantly — at zero distance — "Present!". */
const HotelCut: React.FC<{ scene: TimedScene; cutAt: number }> = ({ scene, cutAt }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [presentFrom] = lineWindow(scene, "a3_64_boom");
  const [markFrom, markTo] = lineWindow(scene, "a3_65_cloudia");
  const flashAt = cutAt;
  // Boom is standing where the crackle was from her first frame — small,
  // tight and sharp, exactly as at his birth (distance 0).
  const appear = interpolate(frame, [flashAt + 1, flashAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeOutBack });
  const tick = ramp(frame, markFrom + (markTo - markFrom) * 0.45, markFrom + (markTo - markFrom) * 0.7);
  const cloudiaEmotion = emotionAt(frame, [{ at: flashAt, emotion: "amazed" }, { at: markFrom, emotion: "proud" }], "happy", 6);
  const boomEmotion = emotionAt(frame, [{ at: presentFrom, emotion: "excited" }, { at: markFrom, emotion: "happy" }], "happy", 6);
  const z = LOBBY_CAM.zoom ?? 1;
  return (
    <HotelWorld
      mode="lobby"
      phase={0.4}
      cam={LOBBY_CAM}
      flashes={[flashAt]}
      overlay={
        <>
          {/* Grey-gold, the last light. */}
          <AbsoluteFill style={{ background: "rgba(255, 190, 110, 0.16)" }} />
          <Bubbles
            scene={scene}
            cast={{
              ...onLobby({ cloudia: DESK_CLOUDIA }),
              boom: boomMark(LOBBY_CAM.x + (BIRTH.x - LOBBY_CAM.x) * z, LOBBY_CAM.y + (BIRTH.y - LOBBY_CAM.y) * z, z, 0, "right", 320),
            }}
            text={S23_LOBBY_BUBBLES}
          />
        </>
      }
    >
      <DuskHole />
      <Cloudia
        x={DESK_CLOUDIA.x}
        y={DESK_CLOUDIA.y}
        scale={DESK_CLOUDIA.scale}
        phase={PHASE.cloudia}
        fill={0.55}
        emotion={cloudiaEmotion}
        speaking={stage.speaking("cloudia")}
        look={frame >= markFrom + (markTo - markFrom) * 0.4 ? "down" : "left"}
      />
      <FrontDesk />
      <RegisterTick on={tick} />
      <Boom
        x={BIRTH.x}
        y={hover("boom", BIRTH.y, Math.max(0.01, appear))}
        scale={Math.max(0.01, appear)}
        distance={0}
        phase={PHASE.boom}
        burstAt={presentFrom + 7}
        emotion={boomEmotion}
        speaking={stage.speaking("boom")}
        look={frame >= markFrom ? "right" : "camera"}
      />
      <div style={{ position: "absolute", inset: 0 }}>
        <Flash at={flashAt} from={{ x: BIRTH.x + 20, y: BIRTH.y - 260 }} to={{ x: HOLE.x - 30, y: HOLE.y + 10 }} weight={0.9} />
      </div>
    </HotelWorld>
  );
};

const TenWindow: React.FC<{ scene: TimedScene; after: boolean }> = ({ scene, after }) => {
  const frame = useCurrentFrame();
  const run = countRuns(scene)[0];
  const flashAt = flashFor(run);
  const [tooFarFrom, tooFarTo] = lineWindow(scene, "a3_66_narrator");
  // TEN — all the fingers — held through "That is all the fingers.", the 120f
  // of nothing, the forty-five counts and the four and a half kids. The hand
  // only comes down at the cut.
  const fingers = after ? 0 : fingersAt(scene, frame);
  // "Here is the last one." — the hands come up off the sill, ready.
  const [lastFrom, lastTo] = lineWindow(scene, "a3_50_narrator");
  const raise = after ? 0 : 0.3 * ramp(frame, lastFrom + (lastTo - lastFrom) * 0.5, lastTo);
  // THE RINGS SET OUT and never arrive: they cross the near part of the bay
  // through the count, thinning, and are gone by "Ten." — too far to hear.
  const tenAt = run.arrive - COUNT_GRID + COUNT_VOICE_LEAD;
  const span = tenAt - flashAt;
  const v = (frame - flashAt) / span;
  const ringsAlpha = v <= 0 || v >= 1 ? 0 : Math.min(1, v * 8) * (1 - ramp(v, 0.55, 1));
  const ringsU = 0.42 * clamp01(v);
  const rp = moveAlong({ x: S23_STORM.x + 20, y: S23_STORM.base - 20 }, { x: 960, y: 420 }, ringsU, { arc: 0, ease: kidEase.linear });
  const rScale = 0.12 + 0.7 * ringsU;
  // One more far flash on "From here, he is too far to hear." — nothing follows.
  const silentAt = tooFarFrom + Math.round((tooFarTo - tooFarFrom) * 0.55);
  // Dark-dusk: the light going down across the scene.
  const dark = ramp(frame, 0, scene.durationInFrames, kidEase.linear);
  // The far storm flickers only while it is still "the last one" (a3_50).
  const crackle = after ? 0 : 0.5 * (1 - ramp(frame, flashAt + 6, flashAt + 40));
  return (
    <WindowWorld
      bg="bay_dusk_clear"
      sky="dusk"
      phase={3.9}
      tint={`rgba(20, 18, 60, ${(0.05 + 0.3 * dark).toFixed(3)})`}
      outside={
        <>
          <FarStorm x={S23_STORM.x} base={S23_STORM.base} width={140} height={110} grow={0.5} anvil={0} tone="dusk" crackle={crackle} dim={0.4} />
          <FrontHorizon light="dusk" />
          <Hills tone="dusk" foot={660} />
          <StepAndPath tone="dusk" wet={1} />
          {/* The wet lawn: the puddles the hail left, on the step and the grass. */}
          <Puddle x={STONY_SEAT.x} y={STONY_SEAT.y} r={STONY_R} amount={0.6} sheen="#6f6aa8" />
          <Puddle x={LAWN_NAMED[0].x} y={LAWN_NAMED[0].y + 6} r={LAWN_NAMED[0].r} amount={0.5} sheen="#6f6aa8" />
          <Puddle x={LAWN_NAMED[3].x} y={LAWN_NAMED[3].y} r={LAWN_NAMED[3].r} amount={0.5} sheen="#6f6aa8" />
          {after ? null : (
            <>
              <FarSky at={flashAt} strength={0.2} />
              <Flash at={flashAt} from={S23_FLASH.from} to={S23_FLASH.to} weight={0.35} />
              {ringsAlpha > 0.01 ? (
                <Boom x={rp.x} y={hover("boom", rp.y, rScale)} scale={rScale} distance={ringsU * 2.2} phase={PHASE.boom} heading={rp.angle} ringsOnly rings={1} opacity={ringsAlpha} />
              ) : null}
            </>
          )}
          {after ? (
            <>
              <FarSky at={silentAt} strength={0.15} />
              <Flash at={silentAt} from={{ x: S23_FLASH.from.x + 14, y: S23_FLASH.from.y + 6 }} to={{ x: S23_FLASH.to.x + 6, y: S23_FLASH.to.y }} weight={0.3} mirror />
            </>
          ) : null}
        </>
      }
      kid={{ ...KID_AT_WINDOW, fingers, raise }}
    />
  );
};

const TenNothingScene: SceneFC = ({ scene }) => {
  const frame = useCurrentFrame();
  // CUT to the hotel on the first frame after "four and a half kids", and back
  // to the window after Cloudia marks him present.
  const [, kidsTo] = lineWindow(scene, "a3_63_narrator");
  const [presentFrom] = lineWindow(scene, "a3_64_boom");
  const [, markTo] = lineWindow(scene, "a3_65_cloudia");
  const [backFrom] = lineWindow(scene, "a3_66_narrator");
  const cutAt = kidsTo > 0 ? kidsTo + 2 : presentFrom - 6;
  const backAt = markTo > 0 ? markTo + 4 : backFrom - 4;
  if (frame >= cutAt && frame < backAt) return <HotelCut scene={scene} cutAt={cutAt} />;
  return <TenWindow scene={scene} after={frame >= backAt} />;
};

export const ACT3_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s18_checkout: CheckoutScene,
  s19_three_again: ThreeAgainScene,
  s20_six_turn: SixTurnScene,
  s21_nine_rumble: NineRumbleScene,
  s22_goodbye: GoodbyeScene,
  s23_ten_nothing: TenNothingScene,
};
