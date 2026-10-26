import React from "react";
import {
  AbsoluteFill,
  Boom,
  Bubbles,
  Flash,
  FlashSky,
  GARDEN,
  HAIL_NAMED,
  HEIGHT,
  HailBall,
  Horizon,
  HotelTower,
  KID_AT_WINDOW,
  KidBackdrop,
  PHASE,
  STONY,
  Stony,
  Sunny,
  SunnyGlow,
  WIDTH,
  WideLayer,
  WindowWorld,
  WordCard,
  boomMark,
  hover,
  kidEase,
  kidRadius,
  kidShadow,
  kidTheme,
  lineWindow,
  spring,
  useCurrentFrame,
  useStage,
  useVideoConfig,
  type EmotionInput,
  type HorizonLight,
  type LookDirection,
  type Mark,
  type TimedScene,
} from "./common";

// RECAP (s24_chant, s25_amazing, s26_end_card). Staged by the recap wave,
// 2026-10-26 (report: scratchpad/ep6/recap-report.md).
//
// ===========================================================================
// THE RECAP BRIEF (skeleton wave, 2026-10-26) — read before writing a line
// ===========================================================================
//
// OWNERSHIP. You own THIS FILE ONLY; everything shared is FROZEN (report a
// "Shared-change requests" section instead). The recap REUSES plates
// (`bay_dusk_clear` from act 3 — wait for it; `garden_heavy_day` /
// `bay_through_window_yellow` are here now); it generates none.
//
// YOUR SCENES (current manifest frames):
//   s24_chant     25895  +380  card stack STATIC / LIGHTNING / THUNDER, one
//                              voice (rc_02–rc_04, three one-word clips);
//                              the visual slams in owner order: the
//                              penthouse hail slam STATIC; FLASH slams
//                              LIGHTNING and is on screen for SIX FRAMES of
//                              her own slam (that IS the joke); Boom slams
//                              THUNDER one beat BEHIND her, on purpose — he
//                              looks for her, she has gone (the staged
//                              seventh address; no clip). Then "Thunder is
//                              not late. Thunder is FAR."
//   s25_amazing   26275 +1426  the garden at dusk from the window; Sunny LOW
//                              and fully visible; the lightning-vs-Sun fact +
//                              THE AWE 60f after rc_07 (Sunny visibly hearing
//                              it); Maracaibo; Boom FAR, a voice from the
//                              horizon ("I know. I am busy."); the two small
//                              true things
//   s26_end_card  27701  +348  dusk clear; the volcano + island hold the
//                              horizon, summit lit; the HALF MOON (SVG — a
//                              phase a kid can check; it is never painted);
//                              card WHY DOES THE MOON CHANGE SHAPE? (Mike's
//                              overturnable tease: one card + two kokoro
//                              lines, stage it so a swap is one string);
//                              Sunny below the horizon (muffled — no body);
//                              the last picture rides the 120f tail: one more
//                              far, silent flash past the island, the kid's
//                              ten fingers up anyway — and a WAVE
//                              (`KidAtWindow` `raise` + `wave`)
//
// THE HELD BEAT YOU OWN: rc_07 60f THE AWE (`NO_LEAD` on s25). The 120f tail on
// s26 is the builder's number for the last picture (Video.tsx).
//
// HELPERS: WordCard (one per Big Word — the chant reprises the three, the
// recap does not invent a fourth), Flash (≤6f — her slam is six frames by
// construction), Boom (`burstAt` for his slam; `distance` 1 for "far"),
// WindowWorld / GardenWorld, Horizon (light "dusk"), KidAtWindow via `kid`,
// fingersAt is not needed here (no counts in the recap).
//
// WEAK POINTS: the one-word chant clips are the highest TTS-risk class (the
// fallbacks are in script.md); Boom's voice is PROVISIONAL; the moon must be
// HALF-lit and drawn, never a full disc.
// ===========================================================================

// ---------------------------------------------------------------------------
// WHAT THIS FILE STAGES
//
//   S24 THE CHANT  A card stack on a plain sunset sky: three dashed slots,
//                  filled in owner order on the three one-word clips. The
//                  penthouse hail (the named four + Stony, the same bodies)
//                  drop out of the sky and SLAM onto STATIC on "Static!" and
//                  sit there crackling. FLASH slams LIGHTNING on "Lightning!"
//                  — her own six frames (the `Flash` rig cannot do more), right
//                  to left across the row, the sky whiting — and is gone for
//                  the rest of the scene. BOOM leaves the right edge on her
//                  first frame (he always leaves when she leaves), walks in at
//                  his one pace and slams THUNDER `BOOM_LATE` frames after the
//                  word: the card is already there, his ring burst jolts it.
//                  Then he looks left for her (where she went) and up at her
//                  card (the seventh address; no clip, no bubble). On "Thunder
//                  is FAR." he puffs.
//   S25 / S26      THE SAME DUSK as Scene 23 (act3.tsx `TenWindow`, copied, not
//                  imported): `bay_dusk_clear`, sky "dusk", phase 3.9, the
//                  storm a low flicker right of the island (`FarStorm`, S23's
//                  numbers), `FrontHorizon`, the dusk hills, the wet step and
//                  the puddles the hail left, the kid at `KID_AT_WINDOW`.
//   SUNNY'S SIDE   He left the storm wall moving frame-RIGHT in Scene 22, so he
//                  sets frame-RIGHT: in S25 he sits low over the sea at
//                  `SUNNY_LOW` with a gold path on the water; in S26 he is
//                  under the horizon at the same x — a clipped glow, no body.
//   THE MOON       Above the volcano and the island (frame left, opposite the
//                  sunset), drawn: an exact half, the lit half turned TOWARD
//                  where Sunny went down (the light on the moon is his — the
//                  lit side always faces the Sun; a first-quarter moon at dusk).
//                  A kid can check it: evening half moon, bright side towards
//                  the sunset.
//   THE TEASE      ONE component (`NextTimeCard`), ONE string (`NEXT_TIME`).
// ---------------------------------------------------------------------------

type Pt = { x: number; y: number };
type SceneFC = React.FC<{ scene: TimedScene }>;

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

/** 0→1 between two frames, eased; safe when a line is missing. */
function ramp(frame: number, a: number, b: number, ease: (u: number) => number = kidEase.easeInOutSine): number {
  if (b <= a) return frame >= a ? 1 : 0;
  return ease(clamp01((frame - a) / (b - a)));
}

/** Frame offset of a phrase inside a clip, from its measured seconds. */
const at = (from: number, seconds: number): number => from + Math.round(seconds * 30);

// ===========================================================================
// Scene 24 — The chant
// ===========================================================================

/**
 * The one-word chant clips' word onsets, MEASURED (silencedetect −35dB):
 * "Static!" 0.418s, "Lightning!" 0.425s, "Thunder!" 0.427s — kokoro's usual
 * ~13f of leading silence, the same as the count numbers.
 */
const CHANT_ONSET = 13;
/**
 * Boom's slam lands this many frames AFTER the word "Thunder!" — one beat
 * behind, in the silence between the word's end (+28f) and "Thunder is not
 * late." (rc_05 speech at +12f of its clip, which starts 50f after rc_04).
 */
const BOOM_LATE = 26;

const CARD_FONT = 120;
/** Owner order, top to bottom. Banner colours are the act cards' own. */
const CHANT = [
  { key: "rc_02_narrator", text: "STATIC", color: "#7b5cc4", y: 262, w: 700 },
  { key: "rc_03_narrator", text: "LIGHTNING", color: "#2f6fd6", y: 548, w: 960 },
  { key: "rc_04_narrator", text: "THUNDER", color: "#6d5c8f", y: 834, w: 800 },
] as const;
/** Top edge of the STATIC banner (half the banner's height above its centre). */
const STATIC_TOP = CHANT[0].y - 90;

/** The hail on top of STATIC: the named four (same phases, lawn-size) + Stony. */
const CHANT_HAIL = [
  { ...HAIL_NAMED[0], x: 690, r: 50, delay: 0 },
  { ...HAIL_NAMED[1], x: 806, r: 45, delay: 2 },
  { ...HAIL_NAMED[2], x: 1114, r: 48, delay: 1 },
  { ...HAIL_NAMED[3], x: 1230, r: 47, delay: 3 },
] as const;
const CHANT_STONY = { x: 960, r: STONY.r * 0.7 } as const;

/**
 * Flash's slam: right to left down INTO the LIGHTNING row (her zig spans
 * ±0.1 of her length, so she stays clear of STATIC's hail and THUNDER's slot).
 */
const CHANT_FLASH = { from: { x: 1640, y: 470 }, to: { x: 330, y: 600 } } as const;
/** Boom beside THUNDER, near (small, sharp): he is right here. */
const CHANT_BOOM = { x: 1560, y: CHANT[2].y, enterX: 2160, scale: 0.9, distance: 0.3 } as const;

/** An empty card slot: a dashed outline that the card fills. */
const Slot: React.FC<{ y: number; w: number; until: number }> = ({ y, w, until }) => {
  const frame = useCurrentFrame();
  const o = 1 - ramp(frame, until - 2, until + 6);
  if (o <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: (WIDTH - w) / 2,
        top: y - 88,
        width: w,
        height: 176,
        borderRadius: kidRadius.banner,
        border: `7px dashed ${kidTheme.paper}`,
        opacity: 0.45 * o,
        transform: "rotate(-1.6deg)",
      }}
    />
  );
};

/** Height above the rest line for a ball that drops in and lands ON `land`. */
function dropLift(frame: number, land: number, drop: number): number {
  if (frame < land) {
    const u = clamp01((frame - (land - 12)) / 12);
    return drop * (1 - u * u);
  }
  // One hop off the card, one small one, still.
  const t = frame - land;
  if (t < 14) return 46 * Math.sin((t / 14) * Math.PI);
  if (t < 22) return 12 * Math.sin(((t - 14) / 8) * Math.PI);
  return 0;
}

const ChantHail: React.FC<{ land: number }> = ({ land }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < land - 14) return null;
  const t = frame / fps;
  const settled = frame >= land + 22;
  return (
    <>
      <WideLayer zIndex={60}>
        {CHANT_HAIL.map((h) => {
          const y = STATIC_TOP - h.r - dropLift(frame, land + h.delay, 700);
          return <HailBall key={h.name} x={h.x} y={y} r={h.r} phase={h.phase} look={0} mood={settled ? "happy" : "surprised"} />;
        })}
        {/* The crackle they are still making: tiny sparks between them. */}
        {settled
          ? [748, 872, 1050, 1172].map((x, i) =>
              Math.sin(t * 9 + i * 2.1) > 0.35 ? (
                <path
                  key={x}
                  d={`M ${x - 14} ${STATIC_TOP - 30} l 9 -12 l 7 10 l 9 -12`}
                  stroke="#fff3a0"
                  strokeWidth={5}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null,
            )
          : null}
      </WideLayer>
      <div style={{ position: "absolute", inset: 0, zIndex: 60 }}>
        <Stony
          x={CHANT_STONY.x}
          y={STATIC_TOP - CHANT_STONY.r - dropLift(frame, land - 1, 760)}
          r={CHANT_STONY.r}
          mood={settled ? "happy" : "surprised"}
        />
      </div>
    </>
  );
};

const ChantScene: SceneFC = ({ scene }) => {
  const frame = useCurrentFrame();
  const words = CHANT.map((c) => lineWindow(scene, c.key)[0] + CHANT_ONSET);
  const [staticAt, flashAt, thunderAt] = words;
  const slamAt = thunderAt + BOOM_LATE;
  const [rc05From] = lineWindow(scene, "rc_05_narrator");
  const farAt = at(rc05From, 1.72);
  // BOOM: he leaves the right edge on her first frame and walks in at his one
  // pace (linear), arriving on the slam.
  const walkU = ramp(frame, flashAt, slamAt, kidEase.linear);
  const boomX = CHANT_BOOM.enterX + (CHANT_BOOM.x - CHANT_BOOM.enterX) * walkU;
  const walking = frame >= flashAt && frame < slamAt ? 1 : 0;
  // The THUNDER card jolts on his slam (the card was already there).
  const jolt = frame >= slamAt ? 26 * Math.exp(-(frame - slamAt) / 5) * Math.cos((frame - slamAt) * 0.9) : 0;
  // He looks for her: left (where she went), then up at her card. Nobody
  // there. On "Thunder is FAR." he looks out at us, proud.
  const look: LookDirection =
    frame < slamAt ? "left" : frame < slamAt + 22 ? "left" : frame < farAt ? { x: -0.7, y: -0.9 } : "camera";
  const emotion: EmotionInput =
    frame < slamAt
      ? "excited"
      : frame < farAt
        ? { emotion: "amazed", from: "excited", at: slamAt + 4, frames: 6 }
        : { emotion: "proud", from: "amazed", at: farAt, frames: 8 };
  const puff = ramp(frame, farAt, farAt + 12);
  return (
    <KidBackdrop variant="sunset" clouds={2}>
      <AbsoluteFill>
        {CHANT.map((c, i) => (
          <Slot key={c.key} y={c.y} w={c.w} until={words[i]} />
        ))}
        <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>
          <FlashSky at={flashAt} strength={0.9} />
        </div>
        <WordCard text="STATIC" from={staticAt} y={CHANT[0].y} fontSize={CARD_FONT} stagger={1.2} bannerColor={CHANT[0].color} starburst={false} zIndex={40} />
        <WordCard text="LIGHTNING" from={flashAt} y={CHANT[1].y} fontSize={CARD_FONT} stagger={1.2} bannerColor={CHANT[1].color} starburst={false} zIndex={40} />
        <div style={{ position: "absolute", inset: 0, zIndex: 40, transform: `translateY(${jolt.toFixed(2)}px)` }}>
          <WordCard text="THUNDER" from={thunderAt} y={CHANT[2].y} fontSize={CARD_FONT} stagger={1.2} bannerColor={CHANT[2].color} starburst={false} />
        </div>
        <ChantHail land={staticAt} />
        <div style={{ position: "absolute", inset: 0, zIndex: 70 }}>
          <Flash at={flashAt} from={CHANT_FLASH.from} to={CHANT_FLASH.to} weight={1.1} />
        </div>
        {frame >= flashAt ? (
          <div style={{ position: "absolute", inset: 0, zIndex: 65 }}>
            <Boom
              x={boomX}
              y={hover("boom", CHANT_BOOM.y, CHANT_BOOM.scale)}
              scale={CHANT_BOOM.scale}
              distance={CHANT_BOOM.distance}
              phase={PHASE.boom}
              walking={walking}
              heading={180}
              burstAt={slamAt}
              puff={puff}
              emotion={emotion}
              look={look}
            />
          </div>
        ) : null}
      </AbsoluteFill>
    </KidBackdrop>
  );
};

// ===========================================================================
// The dusk window (Scenes 25–26) — Scene 23's furniture, COPIED from act3.tsx
// ===========================================================================

/** Scene 23's storm: a low flicker FAR past the volcano, right of the island. */
const DUSK_STORM = { x: 690, base: 468 } as const;

const FarStorm: React.FC<React.ComponentProps<typeof HotelTower> & { dim: number }> = ({ dim, ...tower }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      filter: `brightness(${(1 - dim).toFixed(3)}) saturate(0.85)`,
      clipPath: `inset(0 0 ${HEIGHT - GARDEN.horizon}px 0)`,
    }}
  >
    <HotelTower {...tower} />
  </div>
);

/** The volcano and the island re-drawn IN FRONT of the storm (act 3's). */
const FrontHorizon: React.FC<{ light: HorizonLight }> = ({ light }) => <Horizon light={light} />;

/** The headland on the left of the bay, dusk tone (act 3's `Hills`). */
const DuskHills: React.FC<{ foot?: number }> = ({ foot = 660 }) => {
  const c = { far: "#3b3a5e", near: "#232642", rim: "#4a4670" };
  return (
    <WideLayer>
      <path d={`M 100 ${GARDEN.horizon} L 100 430 C 150 426 196 444 230 ${GARDEN.horizon} Z`} fill={c.far} />
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

/** The terrace step + path, dusk tone, wet (act 3's `StepAndPath`). */
const STEP = { x: 420, top: 738, w: 250 } as const;
const DuskStep: React.FC = () => {
  const c = { top: "#6a6386", face: "#3f3a58", stone: "#544f72" };
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
      <path d={`M ${L + 30} ${STEP.top + 8} L ${L + 110} ${STEP.top + 8}`} stroke={kidTheme.paper} strokeWidth={4} strokeLinecap="round" opacity={0.25} />
      <path d={`M ${R - 70} ${STEP.top + 13} L ${R - 30} ${STEP.top + 13}`} stroke={kidTheme.paper} strokeWidth={3} strokeLinecap="round" opacity={0.2} />
    </WideLayer>
  );
};

/**
 * The puddles the hail left — Scene 23's three, at its numbers (Stony's on the
 * step, Hail's and Hail the third's on the lawn), sheen #6f6aa8.
 */
const DUSK_PUDDLES = [
  { x: 400, y: 701.68, r: 40.32, amount: 0.6 },
  { x: 222, y: 712, r: 24.32, amount: 0.5 },
  { x: 1346, y: 738, r: 22.8, amount: 0.5 },
] as const;
const Puddles: React.FC = () => (
  <WideLayer>
    {DUSK_PUDDLES.map(({ x, y, r, amount }) => (
      <g key={x}>
        <ellipse cx={x} cy={y + r * 0.9} rx={r * (0.6 + 1.3 * amount)} ry={r * (0.2 + 0.32 * amount)} fill="#6f6aa8" opacity={0.55 * Math.min(1, amount * 1.5)} />
        <path d={`M ${x - r * 0.5} ${y + r * 0.82} L ${x + r * 0.1} ${y + r * 0.82}`} stroke={kidTheme.paper} strokeWidth={3} strokeLinecap="round" opacity={0.35 * amount} />
      </g>
    ))}
  </WideLayer>
);

/** Clip anything to the sky (above the sea's edge): a sun below it lights only the sky. */
const SkyOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${HEIGHT - GARDEN.horizon}px 0)` }}>{children}</div>
);

/** Where Sunny sits low over the sea (S25) and goes down (S26): frame RIGHT. */
const SUNNY_LOW = { x: 1250, y: 345, scale: 0.58 } as const;

/** The gold of the low Sun on the sky and the water. Static: nothing shimmers in the awe. */
const SunsetGold: React.FC<{ x: number; strength: number; path?: number }> = ({ x, strength, path = 1 }) => (
  <>
    <SkyOnly>
      <div
        style={{
          position: "absolute",
          left: x - 760,
          top: GARDEN.horizon - 300,
          width: 1520,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, rgba(255,196,110,${(0.62 * strength).toFixed(3)}) 0%, rgba(255,150,110,${(0.28 * strength).toFixed(3)}) 38%, rgba(255,140,120,0) 70%)`,
        }}
      />
    </SkyOnly>
    {path > 0 ? (
      <WideLayer opacity={path * strength}>
        {[
          [0, 482, 120],
          [-14, 498, 92],
          [10, 516, 150],
          [-6, 536, 70],
          [16, 556, 110],
          [-10, 580, 60],
        ].map(([dx, y, w], i) => (
          <path key={i} d={`M ${x + dx - w / 2} ${y} L ${x + dx + w / 2} ${y}`} stroke="#ffd27a" strokeWidth={6 - i * 0.5} strokeLinecap="round" opacity={0.75 - i * 0.08} />
        ))}
      </WideLayer>
    ) : null}
  </>
);

/** Scene 23's dusk wash (`rgba(20, 18, 60, a)`): S23 runs 0.05 → 0.35. */
const duskTint = (a: number): string => `rgba(20, 18, 60, ${a.toFixed(3)})`;

/** The far storm, Scene 23's numbers; `crackle` = its inner flicker. */
const DuskStorm: React.FC<{ crackle: number }> = ({ crackle }) => (
  <FarStorm x={DUSK_STORM.x} base={DUSK_STORM.base} width={140} height={110} grow={0.5} anvil={0} tone="dusk" crackle={crackle} dim={0.4} />
);

/** A soft on/off flicker in a window (the storm, far): 0 outside [a, b]. */
function flicker(frame: number, a: number, b: number, k = 0): number {
  if (frame < a || frame >= b) return 0;
  return 0.5 * Math.max(0, Math.sin(frame * 0.53 + k) * Math.sin(frame * 0.21 + 1.3 * k));
}

// ===========================================================================
// Scene 25 — The amazing part
// ===========================================================================

/** Boom, far: on the horizon by the storm, distance 1 — huge and soft. */
const S25_BOOM = { x: 800, y: 318, scale: 0.56 } as const;
/** His bubbles sit up and right of him, clear of his face and of Sunny's rays. */
const S25_BOOM_BUBBLE = { x: 1190, y: 160 } as const;

const S25_BUBBLES: Record<string, string> = {
  rc_08_sunny: "ONLY THE SURFACE.",
  rc_10_sunny: "You're welcome! HA! HA!",
  rc_12_boom: "I know. I am busy.",
  rc_14_boom: "I HAVE ALREADY HAPPENED.",
};

const AmazingScene: SceneFC = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [factFrom, factTo] = lineWindow(scene, "rc_07_narrator");
  const [surfaceFrom] = lineWindow(scene, "rc_08_sunny");
  const [welcomeFrom, welcomeTo] = lineWindow(scene, "rc_10_sunny");
  const [lakeFrom, lakeTo] = lineWindow(scene, "rc_11_narrator");
  const [busyFrom, busyTo] = lineWindow(scene, "rc_12_boom");
  const [happenedFrom] = lineWindow(scene, "rc_14_boom");
  const [balloonFrom] = lineWindow(scene, "rc_15_narrator");
  // THE FACT LANDS: "…than the surface of the Sun." — Sunny hears his own
  // name (~3.6s into rc_07, measured speech 0.36–4.16s), his eyes go wide and
  // turn to the storm, and HOLD there through the 60f of awe. Nothing else
  // starts, moves or flickers until "The surface. Only the surface."
  const hearsAt = at(factFrom, 3.6);
  const sunnyEmotion: EmotionInput =
    frame < hearsAt
      ? "happy"
      : frame < surfaceFrom
        ? { emotion: "amazed", from: "happy", at: hearsAt, frames: 8 }
        : frame < welcomeFrom
          ? { emotion: "proud", from: "amazed", at: surfaceFrom, frames: 8 }
          : frame < welcomeTo
            ? { emotion: "excited", from: "proud", at: welcomeFrom, frames: 6 }
            : { emotion: "happy", from: "excited", at: welcomeTo, frames: 8 };
  const sunnyLook: LookDirection =
    frame >= hearsAt && frame < surfaceFrom
      ? { x: -1, y: 0.2 }
      : frame >= lakeFrom && frame < busyTo + 10
        ? "left"
        : frame >= happenedFrom && frame < balloonFrom
          ? "left"
          : "camera";
  // BOOM, far: a voice from the horizon. He is not there in the awe — he
  // comes up out of the evening by the storm on "I know. I am busy."
  const boomOn = ramp(frame, busyFrom - 10, busyFrom + 4);
  const boomEmotion: EmotionInput = frame < happenedFrom ? "happy" : { emotion: "proud", from: "happy", at: happenedFrom, frames: 8 };
  // The storm flickers far out at the open and again for the lake's hundred
  // nights — never inside the awe.
  const crackle = flicker(frame, 0, factFrom, 0) + flicker(frame, lakeFrom + 60, busyTo, 2);
  // "Count that one." — the kid lifts a finger to count; "You will not need
  // any fingers." — and puts it back down.
  const countAt = at(balloonFrom, 2.9);
  const noneAt = at(balloonFrom, 3.91);
  const lift = ramp(frame, countAt, countAt + 10) * (1 - ramp(frame, noneAt + 6, noneAt + 22));
  const sunny: Mark = { x: SUNNY_LOW.x, y: hover("sunny", SUNNY_LOW.y, SUNNY_LOW.scale), scale: SUNNY_LOW.scale, who: "sunny", side: "left", offset: 330 };
  const boom = boomMark(S25_BOOM.x, S25_BOOM.y, S25_BOOM.scale, 1, "right", 320);
  return (
    <WindowWorld
      bg="bay_dusk_clear"
      sky="dusk"
      phase={3.9}
      drift={0}
      tint={duskTint(0.08)}
      outside={
        <>
          <SunsetGold x={SUNNY_LOW.x} strength={1} />
          <Sunny
            x={sunny.x}
            y={sunny.y}
            scale={SUNNY_LOW.scale}
            phase={PHASE.sunny}
            emotion={sunnyEmotion}
            speaking={stage.speaking("sunny")}
            look={sunnyLook}
          />
          <DuskStorm crackle={crackle} />
          <FrontHorizon light="dusk" />
          <DuskHills />
          <DuskStep />
          <Puddles />
          {boomOn > 0.01 ? (
            <Boom
              x={S25_BOOM.x}
              y={hover("boom", S25_BOOM.y, S25_BOOM.scale)}
              scale={S25_BOOM.scale}
              distance={1}
              phase={PHASE.boom}
              emotion={boomEmotion}
              speaking={stage.speaking("boom")}
              look="camera"
              opacity={boomOn}
            />
          ) : null}
        </>
      }
      kid={{ ...KID_AT_WINDOW, fingers: lift, raise: 0.25 * lift }}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ sunny, boom }}
          text={S25_BUBBLES}
          at={{
            rc_12_boom: { ...S25_BOOM_BUBBLE, tail: "left", tailAt: S25_BOOM.x },
            rc_14_boom: { ...S25_BOOM_BUBBLE, tail: "left", tailAt: S25_BOOM.x },
          }}
        />
      }
    />
  );
};

// ===========================================================================
// Scene 26 — End card: the moon
// ===========================================================================

/**
 * **THE EP-7 TEASE — Mike's overturnable (decision log TOP).** One component,
 * one string: swapping the tease (e.g. to sea salt) is THIS LINE. The moon is
 * the end card's picture either way.
 */
const NEXT_TIME = "WHY DOES THE MOON CHANGE SHAPE?";

const NextTimeCard: React.FC<{ from: number; until: number; x: number; y: number; width: number }> = ({ from, until, x, y, width }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 12, mass: 0.8 } });
  const out = clamp01((frame - until) / 8);
  const k = s * (1 - out);
  if (frame < from || k <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y,
        width,
        transform: `translateY(-50%) scale(${k.toFixed(4)}) rotate(${(-1.6 + (1 - s) * 4).toFixed(2)}deg)`,
        opacity: 1 - out,
        background: "#3d4fa8",
        border: `9px solid ${kidTheme.ink}`,
        borderRadius: kidRadius.banner,
        boxShadow: kidShadow(1.2),
        padding: "20px 44px 26px",
        textAlign: "center",
        fontFamily: kidTheme.fontFamily,
        fontSize: 64,
        fontWeight: 900,
        lineHeight: 1.08,
        color: kidTheme.paper,
        textShadow: `0 4px 0 rgba(36,52,71,0.35)`,
      }}
    >
      {NEXT_TIME}
    </div>
  );
};

/**
 * The moon: above the island (and up-right of the volcano), frame left,
 * opposite the sunset — clear of the glass's two glare streaks.
 */
const MOON = { x: 604, y: 150, r: 64 } as const; // r 46→64 (showrunner): the phase must read on a phone
/** Where the Sun is, under the horizon at Sunny's x — the lit half faces it. */
const SUN_DOWN: Pt = { x: SUNNY_LOW.x, y: GARDEN.horizon + 90 };

/**
 * **THE HALF MOON — drawn, never painted.** An exact half (first quarter: the
 * evening half moon), the straight edge through the centre, the lit half
 * turned toward where the Sun went down — the light on the moon is his. The
 * dark half is a faint disc so the whole round still reads.
 */
const HalfMoon: React.FC<{ glow: number }> = ({ glow }) => {
  const { x, y, r } = MOON;
  const angle = (Math.atan2(SUN_DOWN.y - y, SUN_DOWN.x - x) * 180) / Math.PI;
  return (
    <WideLayer>
      <circle cx={x} cy={y} r={r * 2.4} fill="#f4f1dc" opacity={0.1 * glow} />
      <circle cx={x} cy={y} r={r * 1.5} fill="#f4f1dc" opacity={0.12 * glow} />
      <g transform={`rotate(${angle.toFixed(2)} ${x} ${y})`}>
        {/* The night side: there, but dark. */}
        <circle cx={x} cy={y} r={r} fill="#2c2f5c" opacity={0.55} />
        {/* The day side: the half facing the Sun. */}
        <path d={`M ${x} ${y - r} A ${r} ${r} 0 0 1 ${x} ${y + r} Z`} fill="#f6f1d6" />
        <circle cx={x + r * 0.45} cy={y - r * 0.3} r={r * 0.16} fill="#ddd5b4" />
        <circle cx={x + r * 0.3} cy={y + r * 0.38} r={r * 0.22} fill="#ddd5b4" />
        <circle cx={x + r * 0.68} cy={y + r * 0.12} r={r * 0.1} fill="#ddd5b4" />
        <circle cx={x} cy={y} r={r} fill="none" stroke={kidTheme.ink} strokeWidth={3} opacity={0.35} />
      </g>
    </WideLayer>
  );
};

/** The last picture's far, silent flash: tiny, out past the island, down to the sea. */
const LAST_FLASH = { from: { x: 718, y: 424 }, to: { x: 738, y: 467 } } as const;

const S26_BUBBLES: Record<string, string> = {
  rc_17_sunny: "I CAN ANSWER THAT ONE!",
};

const EndCardScene: SceneFC = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [nextFrom] = lineWindow(scene, "rc_16_narrator");
  const [, lastTo] = lineWindow(scene, "rc_18_narrator");
  const questionAt = at(nextFrom, 1.38);
  // The tease card lands on the question and leaves after the last line, so
  // the last picture (the 120f tail) is the window alone.
  const cardUntil = lastTo + 2;
  // THE LAST PICTURE: one more far, silent flash past the island — nothing
  // follows — and the kid holds up ten fingers anyway, then waves.
  const flashAt = lastTo + 14;
  const handsUp = ramp(frame, flashAt + 10, flashAt + 26, kidEase.easeOutCubic);
  const fingers = 10 * ramp(frame, flashAt + 12, flashAt + 30, kidEase.easeOutCubic);
  const wave = ramp(frame, flashAt + 44, flashAt + 58);
  // Night coming on: Scene 23's wash, a little further.
  const dark = ramp(frame, 0, scene.durationInFrames, kidEase.linear);
  const glow = 0.85 - 0.35 * dark;
  // Sunny below the horizon: a glow at the sea's edge, his bubble from it.
  const sunny: Mark = { x: SUNNY_LOW.x, y: GARDEN.horizon - 20, scale: 1, who: "sunny", lift: 0, side: "left", offset: 0 };
  return (
    <WindowWorld
      bg="bay_dusk_clear"
      sky="dusk"
      phase={3.9}
      drift={0}
      tint={duskTint(0.14 + 0.16 * dark)}
      outside={
        <>
          <SunsetGold x={SUNNY_LOW.x} strength={0.55 - 0.2 * dark} path={0} />
          <SkyOnly>
            <SunnyGlow x={SUNNY_LOW.x} y={GARDEN.horizon + 40} r={110} strength={glow} speaking={stage.speaking("sunny")} />
          </SkyOnly>
          <HalfMoon glow={0.7 + 0.3 * dark} />
          <DuskStorm crackle={0} />
          <FrontHorizon light="dusk" />
          <DuskHills />
          <DuskStep />
          <Puddles />
          <FlashSky at={flashAt} strength={0.2} />
          <Flash at={flashAt} from={LAST_FLASH.from} to={LAST_FLASH.to} weight={0.3} mirror />
        </>
      }
      kid={{ ...KID_AT_WINDOW, fingers, raise: 0.35 * handsUp, wave }}
      overlay={
        <>
          <NextTimeCard from={questionAt} until={cardUntil} x={1170} y={176} width={1000} />
          <Bubbles
            scene={scene}
            cast={{ sunny }}
            text={S26_BUBBLES}
            at={{ rc_17_sunny: { x: SUNNY_LOW.x - 40, y: 392, tail: "right", tailAt: SUNNY_LOW.x } }}
          />
        </>
      }
    />
  );
};

export const RECAP_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s24_chant: ChantScene,
  s25_amazing: AmazingScene,
  s26_end_card: EndCardScene,
};
