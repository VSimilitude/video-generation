import React from "react";
import { Freeze } from "remotion";
import {
  AbsoluteFill,
  Blobby,
  Boom,
  BOOM_R,
  BOOM_COLOR,
  Bubbles,
  Camera,
  Cloudia,
  Flash,
  FrontDesk,
  GARDEN,
  HailBall,
  Horizon,
  HotelTower,
  HotelWorld,
  KID_AT_WINDOW,
  LOBBY,
  Lawn,
  PHASE,
  PLATES,
  Plate,
  Puff,
  Shard,
  SpeechBubble,
  SunnyGlow,
  WideLayer,
  WindowWorld,
  WordCard,
  Z,
  blueRicochet,
  blueTrail,
  boomGrow,
  boomMark,
  clamp,
  countRuns,
  distanceForCount,
  fingersAt,
  flashFor,
  floorY,
  hover,
  interpolate,
  kidEase,
  kidInkOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  lineWindow,
  project,
  projectMark,
  settleWave,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  volcanoFace,
  NO_LEAD,
  VOLCANO_AT,
  type Box,
  type BubblePlacement,
  type Cam,
  type Cast,
  type EmotionInput,
  type LookDirection,
  type Mark,
  type TimedScene,
  type TowerSpec,
} from "./common";

// ACT TWO — THE COUNT COMES DOWN (s11_six … s17_myth_thunder).
//
// "The mechanism act, written to be the funniest: a wind that arrives before
// its storm, a six, a three with Blue finally right, the lesson said once, a
// two, a one, and the one firing with nothing in front of it."
//
// ---------------------------------------------------------------------------
// HOW THIS ACT IS BUILT (read before changing a number)
//
//   THE STAGE     The window (`WindowWorld`) for every outdoor beat: the dark
//                 slate storm plate for Scenes 11–15, the lit-from-above plate
//                 for 16–17 (the hotel overhead). Two cuts leave it: the
//                 lobby (Scene 14's house phone — `LOBBY_CAM`/`onLobby` COPIED
//                 from act1, never imported) and the coastal wide for the
//                 volcano's one line (Scene 16, CUTTABLE). Scene 11 opens
//                 inside the tower for "the lift changed its mind" (an
//                 interior: no horizon, the sanctioned no-volcano shot).
//
//   BOOM AT THE GLASS sits at `BOOM_GLASS` (720, 250), NOT the skeleton's
//                 BOOM_AT_GLASS (560, 410): at six counts his body is 150px in
//                 radius and the skeleton seat put him over Ember's island and
//                 the volcano's flank (measured off a placeholder still: the
//                 volcano spans x 240–480 / y 350–470, the island 522–646). The
//                 volcano rule wins. Frame-left of the kid, upper glass.
//                 `GLASS_SCALE` 0.8 is FRAMING and is the same in every scene,
//                 so his size at the glass is pure `distance` — the ladder
//                 six → three → two → one → zero reads side by side.
//
//   THE CHASE     Every count: `Chase` walks Boom (face on — he has been
//                 introduced) from where Flash left the cloud to the glass at
//                 ONE PACE in world terms: depth falls linearly in time and the
//                 screen position/scale are its perspective projection
//                 (`perspectiveWalk`), so he speeds up on screen as he nears
//                 exactly as a walker at constant speed would. His `distance`
//                 grows from 0 to the count's, so he spreads as he comes.
//                 He is never waiting; at the flash he is already walking.
//
//   FLASH         `Flash` (≤6 frames by construction) at `flashFor(run)` on
//                 every counted run — except Scene 12 (frame 0: Blue's 4f
//                 identity gap is measured from HER, see the weak point in the
//                 report) and Scene 15's first run (frame 0: the scene opens on
//                 "One."). Scene 16 shows her for ONE frame (the script: "visible
//                 beside him for one frame and gone the next"). No end point
//                 sits on or near the kid, the house or a body.
//
//   HELD BEATS    Scene 12's 90f: Blue is a `<Freeze>` (one still frame of Blue
//                 IS the joke) and Violet has already left. Scene 16's 60f
//                 break: the WHOLE picture is a `<Freeze>` — nothing moves.
//                 Every held-beat scene uses `NO_LEAD`.
//
//   OVERTURNABLE  The volcano pair (a2_63 + a2_64): the coastal-wide cut is
//                 keyed on `lineWindow(scene, "a2_63_volcano")`; cut both lines
//                 (and a2_62's 48f gap) from Video.tsx and Scene 16 plays
//                 a2_62 → a2_65 at the window with nothing else to change.
// ---------------------------------------------------------------------------

type Pt = { x: number; y: number };

const DARK_BG = "bay_through_window_dark";
const LIT_BG = "bay_lit_from_above";

/** Boom at the glass (centre of his body) and the one framing scale there. */
const BOOM_GLASS = { x: 720, y: 250 } as const;
const GLASS_SCALE = 0.8;

/** His drawn radius at a distance and a scale (what a bubble has to clear). */
const boomRadius = (d: number, scale: number): number => BOOM_R * boomGrow(d) * scale;

/** Boom's bubble beside him at the glass: right (over the storm) or left. */
const GLASS_RIGHT: BubblePlacement = { x: 1160, y: 170, tail: "left", tailAt: BOOM_GLASS.x };
const GLASS_LEFT: BubblePlacement = { x: 420, y: 170, tail: "right", tailAt: BOOM_GLASS.x };

/** Every key in `keys` placed the same way. */
const placeAll = (keys: string[], at: BubblePlacement): Record<string, BubblePlacement> =>
  Object.fromEntries(keys.map((k) => [k, at]));

const glassMark = (d: number): Mark => boomMark(BOOM_GLASS.x, BOOM_GLASS.y, GLASS_SCALE, d, "right");

/** A HELD-BEAT-safe clamp-both interpolate. */
const ramp = (frame: number, input: number[], output: number[], ease?: (u: number) => number): number =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    ...(ease ? { easing: ease } : {}),
  });

// ---------------------------------------------------------------------------
// The chase: one pace, in perspective
// ---------------------------------------------------------------------------

/**
 * A walker at constant speed towards the camera, projected: depth falls
 * linearly with `u`, screen scale is `s1 / (1 + K·depth)` and screen offset
 * follows the same curve, so the first half of the walk covers less screen
 * than the second. Returns the screen fraction `g` (0 → 1) and the scale.
 */
function perspectiveWalk(u: number, s0: number, s1: number): { g: number; scale: number } {
  const k = Math.max(0, Math.min(1, u));
  const K = s1 / s0 - 1;
  const w = (v: number): number => 1 / (1 + K * (1 - v));
  const w0 = w(0);
  const wu = w(k);
  return { g: w0 >= 1 ? k : (wu - w0) / (1 - w0), scale: s1 * wu };
}

/**
 * **THE CHASE** — Boom, face on, walking from where Flash left the cloud
 * (`at`, `from`) to the glass (`arrive`), at his one pace. `count` is the
 * scripted count: his `distance` grows from 0 to `distanceForCount(count)`.
 */
const Chase: React.FC<{
  at: number;
  arrive: number;
  from: Pt;
  fromScale: number;
  count: number;
  to?: Pt;
  toScale?: number;
}> = ({ at, arrive, from, fromScale, count, to = BOOM_GLASS, toScale = GLASS_SCALE }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= arrive) return null;
  const u = (frame - at) / (arrive - at);
  const { g, scale } = perspectiveWalk(u, fromScale, toScale);
  const x = from.x + (to.x - from.x) * g;
  const y = from.y + (to.y - from.y) * g;
  const heading = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
  return (
    <Boom
      x={x}
      y={hover("boom", y, scale)}
      scale={scale}
      distance={distanceForCount(count) * u}
      phase={PHASE.boom}
      walking={1}
      heading={heading}
      emotion="happy"
      look="left"
    />
  );
};

/** Boom at the glass. Everything else is passed straight through. */
const AtGlass: React.FC<{
  d: number;
  emotion?: EmotionInput;
  speaking?: boolean;
  look?: LookDirection;
  burstAt?: number;
  puff?: number;
  opacity?: number;
  y?: number;
}> = ({ d, emotion = "happy", speaking, look = "camera", burstAt, puff, opacity, y = BOOM_GLASS.y }) => (
  <Boom
    x={BOOM_GLASS.x}
    y={hover("boom", y, GLASS_SCALE)}
    scale={GLASS_SCALE}
    distance={d}
    phase={PHASE.boom}
    emotion={emotion}
    speaking={speaking}
    look={look}
    burstAt={burstAt}
    puff={puff}
    opacity={opacity}
  />
);

/** The glass hum on an arrival: rattle + mug ripple for ~1.3s. */
const arrivalHum = (frame: number, arrive: number, peak = 1): number =>
  ramp(frame, [arrive - 2, arrive + 6, arrive + 40], [0, peak, 0]);

// ---------------------------------------------------------------------------
// The hotel as the storm comes in (perspective: nearer = bigger, base higher)
// ---------------------------------------------------------------------------

type HotelSpec = React.ComponentProps<typeof HotelTower>;

/** Six counts out (two kilometres): the tower, its anvil just in the glass. */
const HOTEL_SIX: HotelSpec = { x: 1300, base: 446, width: 300, height: 380, grow: 1, tone: "storm", crackle: 0.35 };
/** Three counts (one kilometre): bigger, the anvil out of the top of the glass. */
const HOTEL_THREE: HotelSpec = { x: 1270, base: 420, width: 420, height: 520, grow: 1, tone: "storm", crackle: 0.35 };
/** Two counts. */
const HOTEL_TWO: HotelSpec = { x: 1220, base: 390, width: 560, height: 700, grow: 1, tone: "storm", crackle: 0.4 };
/** One count: nearly overhead, its base high in the glass. */
const HOTEL_ONE: HotelSpec = { x: 1130, base: 250, width: 820, height: 1000, grow: 1, tone: "storm", crackle: 0.45 };

function lerpHotel(a: HotelSpec, b: HotelSpec, u: number): HotelSpec {
  const k = Math.max(0, Math.min(1, u));
  const l = (p: number, q: number): number => p + (q - p) * k;
  return {
    ...a,
    x: l(a.x, b.x),
    base: l(a.base, b.base),
    width: l(a.width ?? 230, b.width ?? 230),
    height: l(a.height ?? 330, b.height ?? 330),
    crackle: l(a.crackle ?? 0, b.crackle ?? 0),
  };
}

/** Sunny, faint, at the tower's right rim — behind it from Scene 5 to 22. */
const RimGlow: React.FC<{ hotel: HotelSpec; y?: number; strength?: number; speaking?: boolean }> = ({
  hotel,
  y = 150,
  strength = 0.45,
  speaking = false,
}) => (
  <SunnyGlow
    x={Math.min(1500, hotel.x + (hotel.width ?? 230) / 2 + 30)}
    y={y}
    r={120}
    strength={strength}
    speaking={speaking}
  />
);

// ---------------------------------------------------------------------------
// Scene 11 pieces: the lift reversed, the gust front
// ---------------------------------------------------------------------------

/** Inside the tower (act one's 4-floor section, the same numbers — copied). */
const S11_TOWER: TowerSpec = { x: 960, base: 1040, top: 78, width: 1760, count: 4, freezeAt: 2.6 };

/** The DOWNdraft in the shaft: falling streak PAIRS (two lines, never one). */
const DownDraft: React.FC<{ x: number; top: number; bottom: number; strength: number }> = ({ x, top, bottom, strength }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (strength <= 0.02) return null;
  const t = frame / fps;
  return (
    <WideLayer>
      {Array.from({ length: 10 }, (_, i) => {
        const u = (t * 1.0 + i / 10) % 1;
        const y = top + u * (bottom - top);
        const xx = x - 100 + ((i * 73) % 200);
        return (
          <g key={i} opacity={strength * 0.6 * Math.sin(u * Math.PI)} stroke="#dbe9fb" strokeLinecap="round">
            <path d={`M ${xx} ${y.toFixed(0)} v 70`} strokeWidth={7} />
            <path d={`M ${xx + 16} ${(y - 22).toFixed(0)} v 56`} strokeWidth={5} opacity={0.7} />
          </g>
        );
      })}
    </WideLayer>
  );
};

/**
 * **THE GUST FRONT** — cold air falling out of the bottom of the hotel and
 * running along the sea and the lawn to the window, as streak pairs that
 * grow as they come (they are coming at us). Drawn outside the glass.
 */
const ColdGust: React.FC<{ strength: number; from: Pt }> = ({ strength, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (strength <= 0.01) return null;
  const t = frame / fps;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {Array.from({ length: 14 }, (_, i) => {
        const u = (t * 0.5 + i / 14) % 1;
        const p0 = { x: from.x + ((i % 5) - 2) * 36, y: from.y + 6 };
        const p1 = { x: from.x - 40 + ((i * 53) % 110), y: 600 };
        const p2 = { x: 260 + ((i * 397) % 1240), y: 830 };
        const a = (1 - u) * (1 - u);
        const b = 2 * (1 - u) * u;
        const c = u * u;
        const x = a * p0.x + b * p1.x + c * p2.x;
        const y = a * p0.y + b * p1.y + c * p2.y;
        const dx = 2 * (1 - u) * (p1.x - p0.x) + 2 * u * (p2.x - p1.x);
        const dy = 2 * (1 - u) * (p1.y - p0.y) + 2 * u * (p2.y - p1.y);
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const s = 0.35 + 1.3 * u * u;
        const L = 46 * s;
        const nx = -uy * 11 * s;
        const ny = ux * 11 * s;
        const line = (ox: number, oy: number, k: number) =>
          `M ${(x + ox).toFixed(1)} ${(y + oy).toFixed(1)} L ${(x + ox - ux * L * k).toFixed(1)} ${(y + oy - uy * L * k).toFixed(1)}`;
        return (
          <g key={i} stroke="#eef5ff" strokeLinecap="round" opacity={strength * 0.9 * Math.sin(u * Math.PI)}>
            <path d={line(0, 0, 1)} strokeWidth={7 * s} />
            <path d={line(nx - ux * L * 0.3, ny - uy * L * 0.3, 0.75)} strokeWidth={5 * s} opacity={0.8} />
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 11 — The storm arrives before itself; six
// ---------------------------------------------------------------------------

const S11_STRIKE = { from: { x: 1282, y: 440 }, to: { x: 1432, y: 590 } } as const;
/** Where the sound leaves from: the hotel's base, where the crackle let go. */
const S11_SOURCE: Pt = { x: 1290, y: 446 };
/** Puff at the glass: over the dark storm column, under Boom's bubbles, clear of the curtain. */
const S11_PUFF = { x: 1320, y: 360, scale: 0.6 } as const;

const S11_BUBBLES: Record<string, string> = {
  a2_02_puff: "Going down.",
  a2_03_puff: "YOU CAN FEEL ME.",
  a2_04_puff: "I ran ahead.",
  a2_12_boom: "PRESENT!",
  a2_13_boom: "I AM OVER HERE.",
  a2_14_boom: "You could wait. Just once.",
  a2_16_boom: "Six whats?",
  a2_18_boom: "Counts of what?",
  a2_20_boom: "IT IS A VERY EARLY PLANET.",
};

const SixScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [downFrom, downTo] = lineWindow(scene, "a2_02_puff");
  const [feelFrom] = lineWindow(scene, "a2_03_puff");
  const [explainFrom, explainTo] = lineWindow(scene, "a2_05_narrator");
  const [, overTo] = lineWindow(scene, "a2_13_boom");
  const [waitFrom] = lineWindow(scene, "a2_14_boom");
  const [youFrom, youTo] = lineWindow(scene, "a2_19_narrator");
  const run = countRuns(scene)[0];
  const flashAt = flashFor(run);
  const arrived = frame >= run.arrive;
  const D = distanceForCount(run.count);

  const boomEmotion = useEmotion(
    scene,
    "boom",
    { a2_12_boom: "excited", a2_13_boom: "amazed", a2_14_boom: "neutral", a2_16_boom: "amazed", a2_18_boom: "skeptical", a2_20_boom: "proud" },
    "happy",
  );
  const puffEmotion = useEmotion(scene, "puff", { a2_02_puff: "excited", a2_03_puff: "happy", a2_04_puff: "proud" }, "happy");

  // ---- SHOT A: inside the tower, the lift changes its mind -----------------
  if (frame < feelFrom) {
    // The up-streaks die and the down-streaks take over across a2_01; Puff
    // hangs in the shaft, then drops out of the bottom on "Going down."
    const up = ramp(frame, [0, 46], [1, 0]);
    const down = ramp(frame, [24, 80], [0, 1]);
    const drop = ramp(frame, [downFrom + 4, downTo + 8], [0, 1], kidEase.gravity);
    const puffY = hover("puff", 470 + Math.sin(frame / 9) * 8 + drop * 820, 0.62);
    const puff: Mark = { x: S11_TOWER.x, y: puffY, scale: 0.62, who: "puff", side: "right", offset: 300 };
    const top = floorY(S11_TOWER, 3) - 46;
    return (
      <HotelWorld
        mode="tower"
        tower={{ spec: S11_TOWER, floors: S11_TOWER.count, roof: 1, lift: up, crackle: 0.6, charge: 0.6 }}
        overlay={<Bubbles scene={scene} cast={{ puff }} text={{ a2_02_puff: S11_BUBBLES.a2_02_puff }} at={{ a2_02_puff: { x: 1340, y: 300, tail: "left", tailAt: S11_TOWER.x } }} />}
      >
        <DownDraft x={S11_TOWER.x} top={floorY(S11_TOWER, 4)} bottom={S11_TOWER.base + 60} strength={down} />
        <WideLayer>
          {[300, 560, 1360, 1600].map((x, i) => (
            <HailBall key={x} x={x} y={top} r={42} phase={i * 0.8} look={x < S11_TOWER.x ? 0.8 : -0.8} mood={drop > 0.05 ? "surprised" : "happy"} />
          ))}
        </WideLayer>
        <Puff x={puff.x} y={puff.y} scale={0.62} opacity={0.55} phase={PHASE.puff} emotion={puffEmotion} speaking={stage.speaking("puff")} look="down" />
      </HotelWorld>
    );
  }

  // ---- SHOT B: the window -------------------------------------------------
  // The gust arrives WITH Puff's catch-phrase: curtain, hair, mug. It runs
  // through the Narrator's explanation and dies before the flash.
  const gust = ramp(frame, [feelFrom - 6, feelFrom + 14, explainTo - 70, explainTo - 10], [0, 1, 0.75, 0]);
  const curtain = ramp(frame, [feelFrom - 4, feelFrom + 12, explainTo - 60, explainTo + 10], [0, 1, 0.8, 0]);
  const hum = arrivalHum(frame, run.arrive, 0.9);
  // Puff rides the gust in from the sea, waits at the glass, looks where
  // Flash was (the room "looking over there"), and runs ahead off right.
  // He is the cold air, so he does what it does: rides in from the sea to
  // the glass, and on the Narrator's "runs along the ground in front" comes
  // IN through the open window, past the kid's shoulder (the hair, the
  // curtain), and is gone into the room — long before the flash.
  const puffIn = ramp(frame, [feelFrom - 10, feelFrom + 16], [0, 1], kidEase.easeOutCubic);
  const puffThrough = ramp(frame, [explainFrom + 120, explainFrom + 175], [0, 1], kidEase.easeInCubic);
  const puffX = 1700 + (S11_PUFF.x - 1700) * puffIn + (380 - S11_PUFF.x) * puffThrough;
  const puffCY = 520 + (S11_PUFF.y - 520) * puffIn + (1230 - S11_PUFF.y) * puffThrough;
  const puffScale = S11_PUFF.scale * (1 + 1.1 * puffThrough);
  const puff: Mark = { x: puffX, y: hover("puff", puffCY, puffScale), scale: puffScale, who: "puff" };
  const puffBody = (
    <Puff x={puff.x} y={puff.y} scale={puffScale} opacity={0.6} phase={PHASE.puff} emotion={puffEmotion} speaking={stage.speaking("puff")} look={puffThrough > 0 ? "left" : "camera"} bank={-30 * puffThrough} />
  );

  // The count: six fingers on the grid, held through "You.", down on a2_20.
  const fingers = fingersAt(scene, frame) * ramp(frame, [youTo + 6, youTo + 26], [1, 0], kidEase.easeInOutSine);

  // Boom's look: at the room on "I am over here", at the empty sky where she
  // went on "You could wait", up at the voice for the Six/Counts/You exchange.
  const boomLook: LookDirection =
    frame < overTo ? "camera" : frame < waitFrom + 80 ? { x: 1, y: 0.5 } : frame < youFrom - 30 ? "up" : "camera";

  return (
    <WindowWorld
      bg={DARK_BG}
      sky="dark"
      phase={0.7}
      hotel={HOTEL_SIX}
      flashes={[flashAt]}
      curtain={curtain}
      ripple={Math.max(gust * 0.5, hum)}
      rattle={hum}
      kid={{ ...KID_AT_WINDOW, fingers, wind: gust, lean: ramp(frame, [run.from - 20, run.from + 20], [0, 0.18]) }}
      // In the room: Puff, through the window, for the second it takes him.
      children={puffThrough > 0 && puffThrough < 1 ? puffBody : null}
      outside={
        <>
          <RimGlow hotel={HOTEL_SIX} />
          <ColdGust strength={gust} from={S11_SOURCE} />
          {puffThrough <= 0 ? puffBody : null}
          <Flash at={flashAt} from={S11_STRIKE.from} to={S11_STRIKE.to} />
          <Chase at={flashAt} arrive={run.arrive} from={S11_SOURCE} fromScale={0.16} count={run.count} />
          {arrived ? (
            <AtGlass d={D} emotion={boomEmotion} speaking={stage.speaking("boom")} look={boomLook} burstAt={run.arrive} />
          ) : null}
        </>
      }
      overlay={
        <Bubbles
          scene={scene}
          cast={{ puff, boom: glassMark(D) }}
          text={S11_BUBBLES}
          at={{
            a2_03_puff: { x: 1080, y: 180, tail: "right", tailAt: puffX },
            a2_04_puff: { x: 1080, y: 180, tail: "right", tailAt: puffX },
            ...placeAll(["a2_12_boom", "a2_13_boom", "a2_14_boom", "a2_16_boom", "a2_18_boom", "a2_20_boom"], GLASS_RIGHT),
          }}
        />
      }
    />
  );
};

// ---------------------------------------------------------------------------
// Scene 12 — Blue, first; three
// ---------------------------------------------------------------------------

/** Flash at frame 0 (Blue's 4f identity gap is measured from her). */
const S12_FLASH = 0;
const S12_STRIKE = { from: { x: 1250, y: 416 }, to: { x: 1400, y: 562 } } as const;
const S12_SOURCE: Pt = { x: 1262, y: 420 };
/** Where Blue ricochets: upper right, in front of the storm, clear of Boom. */
const BLUE_BOX: Box = { x: 1030, y: 262, w: 430, h: 170 };
const BLUE_SEED = 3;
const BLUE_SCALE = 0.6;
/** Violet at the FAR frame edge: top-left corner of the glass. */
const VIOLET_AT = { x: 222, y: 150 } as const;

const S12_BUBBLES: Record<string, string> = {
  a2_21_blue: "FIRST! SORRY, SEA! I AM FIRST!",
  a2_25_boom: "PRESENT!",
  a2_28_boom: "YOU ARE EARLY.",
  a2_29_blue: "I WAS FIRST!",
  a2_30_boom: "I WAS ON TIME. GOOD TEAM.",
  a2_32_blue: "FIRST TO GO HOME!",
};

const BlueThreeScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [firstFrom] = lineWindow(scene, "a2_21_blue");
  const [presentFrom, presentTo] = lineWindow(scene, "a2_25_boom");
  const [buttonFrom, buttonTo] = lineWindow(scene, "a2_26_narrator");
  const [againFrom] = lineWindow(scene, "a2_29_blue");
  const [homeFrom, homeTo] = lineWindow(scene, "a2_32_blue");
  const [helloFrom] = lineWindow(scene, "a2_28_boom");
  const run = countRuns(scene)[0];
  const D = distanceForCount(run.count);
  const arrived = frame >= run.arrive;

  // BLUE'S STUNNED BEAT: the ricochet STOPS DEAD at the end of the flipped
  // button and holds through the 90f and the Narrator's next line; he comes
  // back to life on his own 4f approach to "I was first!".
  const stopAt = buttonTo;
  const resumeAt = againFrom - 4;
  const stopped = frame >= stopAt && frame < resumeAt;
  const bt = stopped ? stopAt : frame >= resumeAt ? frame - (resumeAt - stopAt) : frame;
  // His first leg: off the water where she struck, 4f behind her.
  const arriveBlue = S12_FLASH + 4;
  const firstLeg = arriveBlue + 9;
  const rico = blueRicochet(bt - arriveBlue, BLUE_BOX, BLUE_SEED);
  const legStart = blueRicochet(firstLeg - arriveBlue, BLUE_BOX, BLUE_SEED);
  let bx = rico.x;
  let by = rico.y;
  let heading = rico.angle;
  if (bt < firstLeg) {
    const u = Math.max(0, (bt - arriveBlue) / (firstLeg - arriveBlue));
    bx = S12_STRIKE.to.x + (legStart.x - S12_STRIKE.to.x) * u;
    by = S12_STRIKE.to.y - 6 + (legStart.y - S12_STRIKE.to.y + 6) * u;
    heading = (Math.atan2(legStart.y - S12_STRIKE.to.y, legStart.x - S12_STRIKE.to.x) * 180) / Math.PI;
  }
  // "First to go home! Sorry, curtain!" — off the curtain and out the top.
  const exitA = homeFrom + 14;
  const exitB = homeFrom + 34;
  const curtainHit = { x: 1500, y: 330 };
  if (frame >= homeFrom) {
    const fromP = blueRicochet(homeFrom - arriveBlue - (resumeAt - stopAt), BLUE_BOX, BLUE_SEED);
    if (frame < exitA) {
      const u = (frame - homeFrom) / (exitA - homeFrom);
      bx = fromP.x + (curtainHit.x - fromP.x) * u;
      by = fromP.y + (curtainHit.y - fromP.y) * u;
      heading = (Math.atan2(curtainHit.y - fromP.y, curtainHit.x - fromP.x) * 180) / Math.PI;
    } else {
      const u = Math.min(1, (frame - exitA) / (exitB - exitA));
      bx = curtainHit.x + (1530 - curtainHit.x) * u;
      by = curtainHit.y + (-140 - curtainHit.y) * u;
      heading = (Math.atan2(-140 - curtainHit.y, 1530 - curtainHit.x) * 180) / Math.PI;
    }
  }
  const blueOn = frame >= arriveBlue && frame < exitB;
  const blueEmotion: EmotionInput = stopped
    ? "amazed"
    : frame >= buttonTo - 24 && frame < resumeAt
      ? { emotion: "amazed", from: "excited", at: buttonTo - 24, frames: 8 }
      : "excited";
  const trail = !stopped && bt >= firstLeg + 6 && frame < homeFrom ? blueTrail(bt - arriveBlue, BLUE_BOX, BLUE_SEED) : undefined;

  // VIOLET: with the flash, also first, noticed by nobody — and gone (up and
  // out) before the stunned beat, which must be empty.
  const violetOut = ramp(frame, [presentTo + 4, presentTo + 16], [0, 1], kidEase.easeInBack);
  const violetOn = frame >= arriveBlue && violetOut < 1;

  // Fingers: three on the grid, down during the flipped button.
  const fingers = fingersAt(scene, frame) * ramp(frame, [buttonFrom + 10, buttonFrom + 30], [1, 0], kidEase.easeInOutSine);
  const hum = arrivalHum(frame, run.arrive, 0.8);
  const boomEmotion = useEmotion(scene, "boom", { a2_25_boom: "excited", a2_28_boom: "happy", a2_30_boom: "proud" }, "happy", NO_LEAD);
  const boomLook: LookDirection = frame >= helloFrom - 6 && frame < homeTo ? { x: 1, y: 0.1 } : "camera";

  const blueMark: Mark = { x: bx, y: by, who: "shard", scale: BLUE_SCALE };
  const blueAt: BubblePlacement = { x: 1250, y: 172, tail: bx < 1250 ? "left" : "right", tailAt: bx };

  return (
    <WindowWorld
      bg={DARK_BG}
      sky="dark"
      phase={1.4}
      hotel={HOTEL_THREE}
      flashes={[S12_FLASH]}
      ripple={hum}
      rattle={hum}
      kid={{ ...KID_AT_WINDOW, fingers, lean: 0.12 }}
      outside={
        <>
          <RimGlow hotel={HOTEL_THREE} />
          <Flash at={S12_FLASH} from={S12_STRIKE.from} to={S12_STRIKE.to} />
          <Chase at={S12_FLASH} arrive={run.arrive} from={S12_SOURCE} fromScale={0.24} count={run.count} />
          {arrived ? (
            <AtGlass d={D} emotion={boomEmotion} speaking={stage.speaking("boom")} look={boomLook} burstAt={run.arrive} />
          ) : null}
          {violetOn ? (
            <Shard who="violet" x={VIOLET_AT.x} y={hover("shard", VIOLET_AT.y - 420 * violetOut, 0.5)} scale={0.5} emotion="happy" look="camera" />
          ) : null}
          {blueOn ? (
            <Freeze frame={stopAt} active={stopped}>
              <Shard
                who="blue"
                x={bx}
                y={hover("shard", by, BLUE_SCALE)}
                scale={BLUE_SCALE}
                heading={stopped ? 0 : heading}
                trail={trail}
                emotion={blueEmotion}
                speaking={stage.speaking("blue")}
                look="camera"
              />
            </Freeze>
          ) : null}
        </>
      }
      overlay={
        <Bubbles
          scene={scene}
          cast={{ blue: blueMark, boom: glassMark(D) }}
          text={S12_BUBBLES}
          maxWidth={460}
          at={{
            a2_21_blue: blueAt,
            a2_29_blue: blueAt,
            a2_32_blue: { x: 1130, y: 172, tail: "right", tailAt: bx },
            ...placeAll(["a2_25_boom", "a2_28_boom", "a2_30_boom"], GLASS_LEFT),
          }}
        />
      }
    />
  );
};

// ---------------------------------------------------------------------------
// Scene 13 — The ruler, said once (the diagram, with Boom standing in it)
// ---------------------------------------------------------------------------

/** The ruler drawn across the glass: the window end left, the hotel end right. */
const RULER = { left: 560, right: 1400, y: 330, h: 34 } as const;
const DIAG_SCALE = 0.75;
/** Where Boom stops at the window end (clear of the window icon and Blue). */
const DIAG_STOP_X = RULER.left + 110;

/** a2_33's clause onsets (measured, silencedetect −35dB), in seconds. */
const A2_33_FLASH_S = 6.55; // "When Flash goes,"
/** a2_38's: end of "…light is fast." and end of "…sound is slow." */
const A2_38_FAST_S = 6.89;
const A2_38_SLOW_S = 9.63;
/** a2_40's: "Blue's gap…" 0.37, "Boom's gap…" 1.98, "It changes." 4.22. */
const A2_40_BLUE_S = 0.37;
const A2_40_CHANGES_S = 4.22;

/** Boom's centre, standing on the ruler at `x` with distance `d`. */
const onRuler = (x: number, d: number): Pt => ({ x, y: RULER.y - boomRadius(d, DIAG_SCALE) * 1.02 });

const RulerStrip: React.FC<{ right: number; draw: number; ticks: number; labels: number[] }> = ({ right, draw, ticks, labels }) => {
  const w = (right - RULER.left) * draw;
  if (w <= 2) return null;
  const tickXs = [1, 2, 3].map((k) => right - ((right - RULER.left) * k) / 3);
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      <rect x={RULER.left} y={RULER.y} width={w} height={RULER.h} rx={8} fill="#f3ead2" stroke={kidTheme.ink} strokeWidth={6} />
      {Array.from({ length: 13 }, (_, i) => {
        const x = RULER.left + ((right - RULER.left) * i) / 12;
        if (x > RULER.left + w) return null;
        return <path key={i} d={`M ${x} ${RULER.y} v ${i % 4 === 0 ? 22 : 12}`} stroke={kidTheme.ink} strokeWidth={4} />;
      })}
      {ticks > 0.01
        ? tickXs.map((x, i) => (
            <g key={`t${i}`} opacity={ticks}>
              <path d={`M ${x} ${RULER.y - 8} v ${RULER.h + 16}`} stroke={kidTheme.ink} strokeWidth={8} strokeLinecap="round" />
            </g>
          ))
        : null}
      {labels.map((pop, i) =>
        pop > 0.01 ? (
          <text
            key={`l${i}`}
            x={tickXs[i]}
            y={RULER.y + RULER.h + 58}
            textAnchor="middle"
            fontFamily={kidTheme.fontFamily}
            fontWeight={900}
            fontSize={56 * (0.6 + 0.4 * pop)}
            fill={kidTheme.paper}
            stroke={kidTheme.ink}
            strokeWidth={8}
            paintOrder="stroke"
            opacity={Math.min(1, pop * 1.5)}
          >
            {i + 1}
          </text>
        ) : null,
      )}
    </svg>
  );
};

/** The little window at the near end of the ruler, with the kid in it. */
const WindowIcon: React.FC<{ on: number }> = ({ on }) =>
  on <= 0.01 ? null : (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, opacity: on, pointerEvents: "none" }}>
      <rect x={RULER.left - 96} y={RULER.y - 66} width={76} height={92} rx={8} fill="#4a3e44" />
      <rect x={RULER.left - 86} y={RULER.y - 56} width={56} height={72} rx={4} fill="#f0d98a" />
      <circle cx={RULER.left - 58} cy={RULER.y - 4} r={14} fill={kidTheme.ink} />
      <path d={`M ${RULER.left - 80} ${RULER.y + 16} q 22 -26 44 0 Z`} fill={kidTheme.ink} />
    </svg>
  );

/** Flash's track: drawn on her frames, left on the glass. */
const FlashTrack: React.FC<{ at: number; from: number; to: number; y: number }> = ({ at, from, to, y }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const u = Math.min(1, (frame - at + 1) / 5);
  const x = from + (to - from) * u;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      <path d={`M ${from} ${y} L ${x} ${y}`} stroke="#2b63c9" strokeWidth={12} strokeLinecap="round" />
      <path d={`M ${from} ${y} L ${x} ${y}`} stroke="#e8f3ff" strokeWidth={5} strokeLinecap="round" />
      {u >= 1 ? <path d={`M ${to + 22} ${y - 16} L ${to} ${y} L ${to + 22} ${y + 16}`} stroke="#e8f3ff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" /> : null}
    </svg>
  );
};

/** Boom's track: the pen, under his feet, as far as he has walked. */
const PenLine: React.FC<{ from: number; to: number }> = ({ from, to }) =>
  Math.abs(from - to) < 2 ? null : (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      <path d={`M ${from} ${RULER.y + RULER.h / 2} L ${to} ${RULER.y + RULER.h / 2}`} stroke={BOOM_COLOR.edge} strokeWidth={14} strokeLinecap="round" />
      <path d={`M ${from} ${RULER.y + RULER.h / 2} L ${to} ${RULER.y + RULER.h / 2}`} stroke={BOOM_COLOR.ringBody} strokeWidth={7} strokeLinecap="round" />
    </svg>
  );

/**
 * **A RULE STAMP** (a rule is not a word: it gets a stamp, not a card). One
 * line per stamp; it accelerates INTO the glass from 2.4× in six frames and
 * rings out (the wind episode's `RuleStamp` treatment, redrawn here).
 */
const StampLine: React.FC<{ text: string; from: number; until: number; x: number; y: number; color: string; tilt?: number }> = ({
  text,
  from,
  until,
  x,
  y,
  color,
  tilt = -3.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - from;
  if (f < -6 || frame >= until + 10) return null;
  const drop = kidEase.easeInQuad(Math.max(0, Math.min(1, (f + 6) / 6)));
  const scale = 2.4 - 1.4 * drop;
  const ring = f >= 0 ? settleWave(f / (fps * 0.7), 1.5, 4.2) : 0;
  const out = Math.max(0, Math.min(1, (frame - until) / 10));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${(scale * (1 + 0.08 * ring)).toFixed(3)}, ${(scale * (1 - 0.1 * ring)).toFixed(3)}) rotate(${tilt}deg)`,
        opacity: Math.min(1, Math.max(0, (f + 6) / 5)) * (1 - out),
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
        background: color,
        border: `9px solid ${kidTheme.ink}`,
        borderRadius: kidRadius.banner,
        padding: "12px 46px",
        fontSize: 68,
        fontWeight: 900,
        letterSpacing: 2,
        lineHeight: 1.02,
        color: kidTheme.paper,
        textShadow: kidInkOutline(3),
        boxShadow: kidShadow(1.1),
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

const S13_BUBBLES: Record<string, string> = {
  a2_34_boom: "SHE IS FASTER THAN EVERYTHING.",
  a2_36_boom: "I am a kilometre?",
  a2_41_boom: "Distance.",
  a2_42_boom: "I have a lot of that.",
};

const RulerScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage(scene);
  const [hereFrom] = lineWindow(scene, "a2_33_narrator");
  const [kmFrom] = lineWindow(scene, "a2_35_narrator");
  const [askFrom, askTo] = lineWindow(scene, "a2_36_boom");
  const [lessonFrom] = lineWindow(scene, "a2_38_narrator");
  const [countsFrom] = lineWindow(scene, "a2_39_narrator");
  const [gapFrom, gapTo] = lineWindow(scene, "a2_40_narrator");
  const [distFrom] = lineWindow(scene, "a2_41_boom");
  const [lotFrom] = lineWindow(scene, "a2_42_boom");

  // "Here is the bay, as a ruler." — the ruler draws in across the glass;
  // the dim wash comes over the real bay so the drawing reads.
  const draw = ramp(frame, [hereFrom + 8, hereFrom + 44], [0, 1], kidEase.easeOutCubic);
  const wash = ramp(frame, [hereFrom, hereFrom + 30], [0, 0.62]);
  const iconOn = ramp(frame, [hereFrom + 136, hereFrom + 150], [0, 1]);
  // "When Flash goes, she is here before the pen has moved."
  const flashAt = hereFrom + Math.round(A2_33_FLASH_S * fps);
  // "It changes." — the hotel end slides in; the distance he arrives at shrinks.
  const changesAt = gapFrom + Math.round(A2_40_CHANGES_S * fps);
  const slide = ramp(frame, [changesAt - 4, changesAt + 30], [0, 1], kidEase.easeInOutSine);
  const right = RULER.right + (1150 - RULER.right) * slide;
  // BOOM WALKS — from the flash, at his one pace, the whole length of the
  // ruler; he is at the window as "You were one kilometre away" begins.
  const walkTo = kmFrom - 6;
  const u = ramp(frame, [flashAt, walkTo], [0, 1]);
  const born = frame >= flashAt;
  const startX = RULER.right - 24;
  const bx = startX + (DIAG_STOP_X - startX) * u;
  const dEnd = distanceForCount(3) + (distanceForCount(2) - distanceForCount(3)) * slide;
  const d = dEnd * u;
  const p = onRuler(bx, d);
  const walking = frame >= flashAt && frame < walkTo ? 1 : 0;
  // The three counts to a kilometre, on the grid: 1 · 2 · 3, 30f apart.
  const labels = [0, 1, 2].map((k) => ramp(frame, [countsFrom + 10 + k * 30, countsFrom + 22 + k * 30], [0, 1], kidEase.easeOutBack) * (1 - slide));
  const ticks = ramp(frame, [countsFrom, countsFrom + 10], [0, 1]) * (1 - slide);
  // "Blue's gap is who he is." — a tiny Blue at the window end, 4f behind.
  const blueFrom = gapFrom + Math.round(A2_40_BLUE_S * fps) + 4;
  const blueOn = frame >= blueFrom && frame < blueFrom + 52;
  const tinyBox: Box = { x: 400, y: 196, w: 130, h: 70 };
  const tb = blueRicochet(frame - blueFrom, tinyBox, 1);

  const boomEmotion = useEmotion(
    scene,
    "boom",
    { a2_34_boom: "proud", a2_36_boom: "amazed", a2_41_boom: "neutral", a2_42_boom: "proud" },
    "happy",
    NO_LEAD,
  );
  const boomLook: LookDirection =
    frame < walkTo ? "left" : frame >= distFrom - 4 && frame < lotFrom ? "upLeft" : frame >= askFrom && frame < askTo ? "up" : "camera";
  const R = boomRadius(d, DIAG_SCALE);
  // Walking (right to left) his bubble leads him on the left; at the window
  // end it sits to his right, over the dimmed bay.
  const boomAt: BubblePlacement =
    frame < walkTo
      ? { x: clamp(bx - R - 300, 400, 1520), y: 170, tail: "right", tailAt: bx }
      : { x: clamp(bx + R + 300, 400, 1520), y: 170, tail: "left", tailAt: bx };
  const kmOn = ramp(frame, [kmFrom, kmFrom + 10, lessonFrom, lessonFrom + 14], [0, 1, 1, 0]);

  return (
    <WindowWorld
      bg={DARK_BG}
      sky="dark"
      phase={2.1}
      hotel={HOTEL_THREE}
      flashes={[flashAt]}
      kid={{ ...KID_AT_WINDOW }}
      outside={
        <>
          <AbsoluteFill style={{ background: `rgba(14,18,38,${wash.toFixed(3)})` }} />
          <WindowIcon on={iconOn} />
          <div style={{ position: "absolute", inset: 0, opacity: draw }}>
            <HotelTower x={right + 40} base={RULER.y - 6} width={96} height={150} grow={1} tone="grey" />
          </div>
          <RulerStrip right={right} draw={draw} ticks={ticks} labels={labels} />
          <PenLine from={startX} to={born ? bx : startX} />
          <FlashTrack at={flashAt} from={RULER.right - 30} to={RULER.left + 6} y={RULER.y - 26} />
          <Flash at={flashAt} from={{ x: RULER.right - 30, y: RULER.y - 70 }} to={{ x: RULER.left + 40, y: RULER.y - 60 }} weight={0.85} />
          {born ? (
            <Boom
              x={bx}
              y={hover("boom", p.y, DIAG_SCALE)}
              scale={DIAG_SCALE}
              distance={d}
              phase={PHASE.boom}
              walking={walking}
              heading={180}
              emotion={boomEmotion}
              speaking={stage.speaking("boom")}
              look={boomLook}
              puff={frame >= lotFrom ? ramp(frame, [lotFrom, lotFrom + 16], [0, 1]) : 0}
            />
          ) : null}
          {blueOn ? <Shard who="blue" x={tb.x} y={hover("shard", tb.y, 0.34)} scale={0.34} heading={tb.angle} emotion="excited" look="camera" /> : null}
          {kmOn > 0.01 ? (
            <div
              style={{
                position: "absolute",
                left: RULER.left,
                width: RULER.right - RULER.left,
                top: RULER.y - 140,
                textAlign: "center",
                opacity: kmOn,
                fontFamily: kidTheme.fontFamily,
                fontSize: 56,
                fontWeight: 900,
                color: kidTheme.paper,
                textShadow: kidInkOutline(4),
              }}
            >
              ONE KILOMETRE
            </div>
          ) : null}
        </>
      }
      overlay={
        <>
          <StampLine text="LIGHT IS FAST." from={lessonFrom + Math.round(A2_38_FAST_S * fps)} until={gapFrom - 4} x={1210} y={146} color="#2f6fd6" />
          <StampLine text="SOUND IS SLOW." from={lessonFrom + Math.round(A2_38_SLOW_S * fps)} until={gapFrom - 4} x={1210} y={252} color="#6d5c8f" tilt={2.5} />
          <Bubbles
            scene={scene}
            cast={{ boom: boomMark(bx, p.y, DIAG_SCALE, d, "right") }}
            text={S13_BUBBLES}
            at={placeAll(Object.keys(S13_BUBBLES), boomAt)}
          />
        </>
      }
    />
  );
};

// ---------------------------------------------------------------------------
// The lobby (Scene 14) — act one's camera PATTERN, copied, never imported
// ---------------------------------------------------------------------------

const LOBBY_CAM: Cam = { x: 1010, y: 860, zoom: 1.4 };
const onLobby = (cast: Cast): Cast =>
  Object.fromEntries(Object.entries(cast).map(([k, m]) => [k, m ? projectMark(LOBBY_CAM, m) : m])) as Cast;

/** Cloudia behind the desk (act one's numbers). */
const DESK_CLOUDIA: Mark = {
  x: LOBBY.deskX,
  y: hover("cloudia", 590, 0.62),
  scale: 0.62,
  who: "cloudia",
  side: "left",
  offset: 360,
};

/** Flash's hole in the lobby's left wall (Scene 9) — it stays. The storm through it now. */
const HOLE = { x: 400, y: 600, rx: 110, ry: 150 } as const;
const StormHole: React.FC = () => {
  const pts = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const k = i % 2 ? 0.82 : 1.06;
    return `${(HOLE.x + Math.cos(a) * HOLE.rx * k).toFixed(1)},${(HOLE.y + Math.sin(a) * HOLE.ry * k).toFixed(1)}`;
  }).join(" ");
  return (
    <WideLayer>
      <defs>
        <clipPath id="storm-act2-wall-hole">
          <polygon points={pts} />
        </clipPath>
      </defs>
      <polygon points={pts} fill="#8d8aa0" transform="translate(10 10)" />
      <g clipPath="url(#storm-act2-wall-hole)">
        <rect x={HOLE.x - 300} y={HOLE.y - 300} width={600} height={360} fill="#4d6380" />
        <rect x={HOLE.x - 300} y={HOLE.y + 60} width={600} height={300} fill="#163447" />
      </g>
      <polygon points={pts} fill="none" stroke="#77748a" strokeWidth={12} strokeLinejoin="round" />
    </WideLayer>
  );
};

/** The house phone: a base on the desk, the handset at her cheek, a curly cord. */
const HousePhone: React.FC<{ lift: number }> = ({ lift }) => {
  const frame = useCurrentFrame();
  const baseX = LOBBY.deskX - 200;
  const baseY = LOBBY.floor - 214;
  // The handset: up at her cheek (lift 1) or in its cradle (lift 0).
  const hx = baseX + (LOBBY.deskX - 112 - baseX) * lift;
  const hy = baseY - 30 + (560 - (baseY - 30)) * lift;
  const rot = -18 * lift + Math.sin(frame / 11) * 1.5 * lift;
  const coil = Array.from({ length: 9 }, (_, i) => {
    const u = i / 8;
    const x = baseX + 30 + (hx - baseX - 30) * u;
    const y = baseY - 10 + (hy + 40 - (baseY - 10)) * u + Math.sin(u * Math.PI) * 50;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${(y + (i % 2 ? 8 : -8)).toFixed(1)}`;
  }).join(" ");
  return (
    <WideLayer>
      <path d={coil} stroke="#3a3346" strokeWidth={6} fill="none" strokeLinejoin="round" />
      <rect x={baseX - 46} y={baseY - 34} width={92} height={40} rx={14} fill="#c0504d" stroke="#6e2c2a" strokeWidth={5} />
      <circle cx={baseX} cy={baseY - 16} r={11} fill="#f3e6c8" />
      <g transform={`rotate(${rot.toFixed(2)} ${hx} ${hy})`}>
        <rect x={hx - 14} y={hy - 52} width={28} height={104} rx={12} fill="#c0504d" stroke="#6e2c2a" strokeWidth={5} />
        <ellipse cx={hx} cy={hy - 52} rx={22} ry={16} fill="#c0504d" stroke="#6e2c2a" strokeWidth={5} />
        <ellipse cx={hx} cy={hy + 52} rx={22} ry={16} fill="#c0504d" stroke="#6e2c2a" strokeWidth={5} />
      </g>
    </WideLayer>
  );
};

/** A few lobby guests (drops hugging specks), as act one has them. */
const LobbyGuests: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const spots = [
    { x: 620, y: LOBBY.floor - 30, s: 0.44 },
    { x: 760, y: LOBBY.floor - 70, s: 0.38 },
    { x: 1000, y: LOBBY.floor - 40, s: 0.42 },
  ];
  return (
    <WideLayer>
      {spots.map((g, i) => (
        <g key={i}>
          <Blobby x={g.x} y={g.y + Math.sin(t * 1.2 + i) * 3} scale={g.s} phase={i * 1.7} look={0.6} color={kidTheme.water} edge={kidTheme.waterDeep} />
          <circle cx={g.x + 62 * g.s} cy={g.y + 30 * g.s} r={16 * g.s} fill="#6b5a4a" />
        </g>
      ))}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 14 — The house phone (two frames)
// ---------------------------------------------------------------------------

/** Sunny's glow at the three-count tower's right rim (clear of Boom, frame left). */
const S14_GLOW = { x: 1470, y: 330 } as const;

const S14_BUBBLES: Record<string, string> = {
  a2_43_boom: "EVERYBODY KEEPS COUNTING AT ME.",
  a2_44_cloudia: "HE WAS BORN IN IT, DARLING.",
  a2_46_cloudia: "THEN THE WINDOW IS FAR, DARLING.",
  a2_48_sunny: "THE CLOUD IS IN THE WAY!",
};

const HousePhoneScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [bornFrom] = lineWindow(scene, "a2_44_cloudia");
  const [behindFrom] = lineWindow(scene, "a2_45_narrator");
  const [farFrom] = lineWindow(scene, "a2_46_cloudia");
  const [sunnyFrom] = lineWindow(scene, "a2_48_sunny");
  const [allFrom] = lineWindow(scene, "a2_49_narrator");
  const D = distanceForCount(3);
  // Two frames of reference, cut between: the window, the lobby, the window,
  // the lobby (through the held beat and "Yes."), the window for Sunny.
  const inLobby = (frame >= bornFrom && frame < behindFrom) || (frame >= farFrom && frame < sunnyFrom);
  const cloudiaEmotion = useEmotion(scene, "cloudia", { a2_44_cloudia: "proud", a2_46_cloudia: "happy" }, "proud", NO_LEAD);
  const boomEmotion = useEmotion(scene, "boom", { a2_43_boom: "skeptical" }, "happy", NO_LEAD);

  if (inLobby) {
    return (
      <HotelWorld
        mode="lobby"
        phase={0.4}
        cam={LOBBY_CAM}
        overlay={<Bubbles scene={scene} cast={onLobby({ cloudia: DESK_CLOUDIA })} text={S14_BUBBLES} />}
      >
        <StormHole />
        <Cloudia
          x={DESK_CLOUDIA.x}
          y={DESK_CLOUDIA.y}
          scale={DESK_CLOUDIA.scale}
          phase={PHASE.cloudia}
          fill={0.6}
          emotion={cloudiaEmotion}
          speaking={stage.speaking("cloudia")}
          look={frame >= farFrom ? "camera" : "left"}
        />
        <FrontDesk />
        <HousePhone lift={1} />
        <LobbyGuests />
      </HotelWorld>
    );
  }

  // The window: three fingers held up at the hotel; Boom looks at them.
  const hold = frame < allFrom + 10 ? 1 : ramp(frame, [allFrom + 10, allFrom + 30], [1, 0], kidEase.easeInOutSine);
  const boomLook: LookDirection = frame >= sunnyFrom - 6 ? { x: 1, y: -0.4 } : frame < bornFrom ? "down" : "camera";
  return (
    <WindowWorld
      bg={DARK_BG}
      sky="dark"
      phase={2.6}
      hotel={HOTEL_THREE}
      kid={{ ...KID_AT_WINDOW, fingers: 3 * hold, raise: 0.85 * hold }}
      outside={
        <>
          <SunnyGlow x={S14_GLOW.x} y={S14_GLOW.y} r={130} strength={0.9} speaking={stage.speaking("sunny")} />
          <AtGlass d={D} emotion={boomEmotion} speaking={stage.speaking("boom")} look={boomLook} />
        </>
      }
      overlay={
        <Bubbles
          scene={scene}
          cast={{ boom: glassMark(D), sunny: { x: S14_GLOW.x, y: S14_GLOW.y, who: "boom", lift: 0 } }}
          text={S14_BUBBLES}
          at={{
            a2_43_boom: GLASS_RIGHT,
            a2_48_sunny: { x: 1170, y: 175, tail: "right", tailAt: S14_GLOW.x - 30 },
          }}
        />
      }
    />
  );
};

// ---------------------------------------------------------------------------
// Scene 15 — Two. One.
// ---------------------------------------------------------------------------

/** Run one (two counts): Flash over the NEAR water, right of the kid. */
const S15_STRIKE_1 = { from: { x: 1196, y: 384 }, to: { x: 1424, y: 600 } } as const;
const S15_SOURCE_1: Pt = { x: 1200, y: 392 };
/** Run two (one count): Flash SIDEWAYS across the sky, under the hotel. */
const S15_STRIKE_2 = { from: { x: 1480, y: 300 }, to: { x: 930, y: 336 } } as const;
const S15_SOURCE_2: Pt = { x: 1180, y: 320 };

const S15_BUBBLES: Record<string, string> = {
  a2_52_boom: "PRESENT!",
  a2_53_boom: "THE GROUND IS MOVING.",
  a2_55_boom: "I will take it.",
  a2_57_boom: "PRESENT!",
  a2_58_boom: "ONE IS NEARLY NONE.",
};

const TwoOneScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [halfFrom, halfTo] = lineWindow(scene, "a2_54_narrator");
  const [noneFrom, noneTo] = lineWindow(scene, "a2_58_boom");
  const [r1, r2] = countRuns(scene);
  // Run one opens the scene on "One.": she goes on frame 0.
  const flash1 = Math.max(0, flashFor(r1));
  const flash2 = flashFor(r2);
  // "The hotel is moving. You are coming with it." — it slides in overhead.
  const hotel = lerpHotel(HOTEL_TWO, HOTEL_ONE, ramp(frame, [halfFrom + 10, halfTo], [0, 1], kidEase.easeInOutSine));
  // Boom: chase one, at the glass (two counts); chase two from the sideways
  // bolt (one count), at the glass again. He is not at the glass while the
  // second chase runs: the Boom at the glass is the last flash's.
  const atGlass1 = frame >= r1.arrive && frame < flash2;
  const atGlass2 = frame >= r2.arrive;
  const D = distanceForCount(atGlass2 ? r2.count : r1.count);
  const fingers =
    frame < r2.from
      ? fingersAt(scene, frame) * ramp(frame, [halfFrom, halfFrom + 20], [1, 0], kidEase.easeInOutSine)
      : fingersAt(scene, frame, { from: r2.from }) * ramp(frame, [noneTo + 4, noneTo + 24], [1, 0], kidEase.easeInOutSine);
  const hum = Math.max(arrivalHum(frame, r1.arrive, 1), arrivalHum(frame, r2.arrive, 1));
  // The glass HUMS after "Present!" number five — a long buzz under a2_58.
  const buzz = ramp(frame, [r2.arrive, r2.arrive + 10, noneTo - 20, noneTo + 10], [0, 0.55, 0.4, 0]);
  // The kid leans IN as it comes; the blanket comes up over a2_58.
  const lean = ramp(frame, [r2.from - 10, r2.arrive + 10], [0.2, 1], kidEase.easeInOutSine);
  const blanket = ramp(frame, [noneFrom, noneTo], [0, 0.75], kidEase.easeInOutSine);
  const boomEmotion = useEmotion(
    scene,
    "boom",
    { a2_52_boom: "excited", a2_53_boom: "proud", a2_55_boom: "happy", a2_57_boom: "excited", a2_58_boom: "excited" },
    "happy",
  );
  return (
    <WindowWorld
      bg={DARK_BG}
      sky="dark"
      phase={3.3}
      hotel={hotel}
      flashes={[flash1, flash2]}
      ripple={Math.max(hum, buzz)}
      rattle={Math.max(hum, buzz)}
      kid={{ ...KID_AT_WINDOW, fingers, lean, blanket }}
      outside={
        <>
          <RimGlow hotel={hotel} y={120} strength={0.35} />
          <Flash at={flash1} from={S15_STRIKE_1.from} to={S15_STRIKE_1.to} />
          <Flash at={flash2} from={S15_STRIKE_2.from} to={S15_STRIKE_2.to} mirror />
          <Chase at={flash1} arrive={r1.arrive} from={S15_SOURCE_1} fromScale={0.36} count={r1.count} />
          <Chase at={flash2} arrive={r2.arrive} from={S15_SOURCE_2} fromScale={0.52} count={r2.count} />
          {atGlass1 || atGlass2 ? (
            <AtGlass
              d={D}
              emotion={boomEmotion}
              speaking={stage.speaking("boom")}
              look="camera"
              burstAt={atGlass2 ? r2.arrive : r1.arrive}
            />
          ) : null}
        </>
      }
      overlay={<Bubbles scene={scene} cast={{ boom: glassMark(D) }} text={S15_BUBBLES} at={placeAll(Object.keys(S15_BUBBLES), GLASS_RIGHT)} />}
    />
  );
};

// ---------------------------------------------------------------------------
// The hotel overhead (Scenes 16–17): its underside, and Cloudia's hatch
// ---------------------------------------------------------------------------

/**
 * **THE UNDERSIDE** — the hotel directly overhead, hanging in the top of the
 * glass: a soft ceiling of lumps (the plate's flat pale sky is the rest of
 * it). `depth` is how far down it hangs; `crackle` flickers the guests
 * rubbing shoulders upstairs.
 */
const Underside: React.FC<{ depth: number; crackle?: number }> = ({ depth, crackle = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const n = 13;
  const x0 = 120;
  const step = (1800 - x0) / n;
  const edge = (dy: number, amp: number, k: number): string => {
    let d = `M ${x0 - 40} -20 L ${x0 - 40} ${depth + dy}`;
    for (let i = 0; i < n; i++) {
      const a = x0 + i * step;
      const sway = Math.sin(t * 0.7 + i * 1.3 + k) * 6;
      d += ` Q ${(a + step / 2).toFixed(1)} ${(depth + dy + amp + sway + ((i * 37) % 3) * 12).toFixed(1)} ${(a + step).toFixed(1)} ${(depth + dy).toFixed(1)}`;
    }
    return d + ` L ${1840} -20 Z`;
  };
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      <path d={edge(26, 70, 0.6)} fill="#8f8aa8" />
      <path d={edge(8, 66, 2.1)} fill="#aaa5c0" />
      <path d={edge(-14, 56, 3.7)} fill="#c4c0d6" />
      {crackle > 0.01
        ? Array.from({ length: 7 }, (_, i) =>
            Math.sin(t * (10 + i) + i * 2.1) > 0.45 ? (
              <path
                key={i}
                d={`M ${220 + i * 230} ${depth * 0.45 + (i % 3) * 18} l 12 -16 l 10 14 l 12 -16`}
                stroke="#fff6b0"
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
                opacity={crackle}
              />
            ) : null,
          )
        : null}
    </svg>
  );
};

/** The lobby, directly overhead: a round hatch in the underside, Cloudia in it. */
const HATCH = { x: 1000, y: 215, r: 110 } as const;
const CLOUDIA_HATCH_SCALE = 0.46;
const CloudiaHatch: React.FC<{ open: number; emotion: EmotionInput; speaking: boolean; look?: LookDirection }> = ({
  open,
  emotion,
  speaking,
  look = "down",
}) => {
  if (open <= 0.01) return null;
  const r = HATCH.r * kidEase.easeOutBack(Math.min(1, open));
  return (
    <div
      style={{
        position: "absolute",
        left: HATCH.x - r,
        top: HATCH.y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        overflow: "hidden",
        background: "radial-gradient(circle at 50% 40%, #f2f1f6 0%, #d9d6e4 70%)",
        border: "10px solid #7f7a98",
        boxSizing: "border-box",
      }}
    >
      <Cloudia
        x={r}
        y={hover("cloudia", r + 26, CLOUDIA_HATCH_SCALE)}
        scale={CLOUDIA_HATCH_SCALE}
        phase={PHASE.cloudia}
        fill={0.55}
        emotion={emotion}
        speaking={speaking}
        look={look}
      />
    </div>
  );
};

/** Cloudia's bubble from the hatch: right of it, tail down-left at her face. */
const HATCH_BUBBLE: BubblePlacement = { x: 1390, y: 168, tail: "left", tailAt: HATCH.x };

/**
 * The hail beginning: ice falling on the lawn, frame left of the kid (nobody
 * under it — not the kid, not Boom up at the glass, not the mug).
 */
const HAIL_DROPS = [
  { x: 190, d: 0, r: 23 },
  { x: 520, d: 6, r: 21 },
  { x: 330, d: 11, r: 25 },
  { x: 450, d: 19, r: 22 },
  { x: 230, d: 24, r: 24 },
  { x: 580, d: 31, r: 21 },
  { x: 380, d: 38, r: 23 },
  { x: 290, d: 44, r: 22 },
  { x: 500, d: 52, r: 21 },
  { x: 170, d: 58, r: 22 },
] as const;
const HAIL_CYCLE = 64;

const HailBegins: React.FC<{ from: number; top: number }> = ({ from, top }) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  const cycles = Math.floor((frame - from) / HAIL_CYCLE) + 1;
  const stones: React.ReactNode[] = [];
  for (let c = 0; c < cycles; c++) {
    HAIL_DROPS.forEach((h, i) => {
      const start = from + c * HAIL_CYCLE + h.d;
      const f = frame - start;
      if (f < 0) return;
      const ground = 712 + ((i * 29 + c * 17) % 46);
      const x = h.x + ((c * 47) % 60) - 30;
      const fall = 16;
      let y: number;
      if (f < fall) y = top + (ground - top) * kidEase.gravity(f / fall);
      else {
        const b = f - fall;
        const hop = b < 12 ? Math.sin((b / 12) * Math.PI) * 54 : b < 20 ? Math.sin(((b - 12) / 8) * Math.PI) * 18 : 0;
        y = ground - hop;
      }
      stones.push(<HailBall key={`${c}-${i}`} x={x} y={y - h.r} r={h.r} phase={i * 0.7 + c} look={0} mood="happy" />);
    });
  }
  return <WideLayer>{stones}</WideLayer>;
};

// ---------------------------------------------------------------------------
// Scene 16 — Zero. The break
// ---------------------------------------------------------------------------

/** The overhead bolt: SIDEWAYS across the underside, ending beside Boom. */
const S16_STRIKE = { from: { x: 1500, y: 128 }, to: { x: 900, y: 170 } } as const;

/** The coastal wide for the volcano's one line: pushed in on him. */
const COAST_CAM: Cam = { x: 430, y: 430, zoom: 1.75 };

const S16_BUBBLES: Record<string, string> = {
  // a2_59 "Present." has NO bubble on purpose: the room is already looking
  // at him; there is nothing to announce (and nothing hangs in the break).
  a2_61_boom: "ON TIME SOUNDS LIKE THAT!",
  a2_62_boom: "She has gone again.",
  a2_65_cloudia: "THAT IS MY NOISE, DARLING.",
};

/** The coastal wide (lit from above, the storm over the house). */
const CoastWide: React.FC<{ from: number; speaking: boolean; volcanoFrom: number }> = ({ from, speaking, volcanoFrom }) => {
  const frame = useCurrentFrame();
  const cam: Cam = { ...COAST_CAM, zoom: (COAST_CAM.zoom ?? 1) + ramp(frame, [from, from + 140], [0, 0.08]) };
  // The mountain deciding to move: in the 48f gap his eyes come round to the
  // house, and only then does he speak.
  const look: LookDirection = frame >= volcanoFrom - 18 ? "camera" : "left";
  const face = volcanoFace({ x: VOLCANO_AT.x, base: GARDEN.horizon, scale: VOLCANO_AT.scale, awake: 1 });
  const mouth = project(cam, { x: face.mouthX, y: face.mouthY });
  return (
    <AbsoluteFill style={{ background: "#c9cbd8", fontFamily: kidTheme.fontFamily, lineHeight: "normal" }}>
      <Camera cam={cam}>
        <Plate bg={LIT_BG} seat={GARDEN.horizon} phase={2.4} />
        <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery }}>
          <Horizon light="dark" speaking={speaking} look={look} emotion="happy" />
        </div>
        <Lawn near={PLATES[LIT_BG].near} phase={1.2} />
      </Camera>
      <div style={{ position: "absolute", inset: 0, zIndex: Z.sky }}>
        <Underside depth={70} />
      </div>
      <AbsoluteFill style={{ zIndex: Z.overlay }}>
        <SpeechBubble
          x={clamp(mouth.x + 470, 400, 1520)}
          y={clamp(mouth.y - 190, 170, 800)}
          text="LOUDER THAN ME. WELL DONE."
          tail="left"
          tailAt={mouth.x}
          from={volcanoFrom}
          until={volcanoFrom + 71}
          maxWidth={520}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ZeroScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [, presentTo] = lineWindow(scene, "a2_59_boom");
  const [, notOneTo] = lineWindow(scene, "a2_60_narrator");
  const [runFrom, runTo] = lineWindow(scene, "a2_61_boom");
  const [goneFrom, goneTo] = lineWindow(scene, "a2_62_boom");
  // THE VOLCANO PAIR IS CUTTABLE: no a2_63 in the scene = no coastal wide.
  const [volFrom, volTo] = lineWindow(scene, "a2_63_volcano");
  const hasVolcano = volTo > volFrom;
  const [beamFrom, beamTo] = lineWindow(scene, "a2_64_narrator");
  const [noiseFrom, noiseTo] = lineWindow(scene, "a2_65_cloudia");
  const [hailFrom] = lineWindow(scene, "a2_66_narrator");

  // THE BREAK: from the end of "Present." to "I did not get to one." the
  // whole picture holds still. Everything below reads `f`, and the world is
  // wrapped in a Freeze so the rigs' own clocks stop too.
  const breakFrom = presentTo;
  const breakTo = notOneTo - 62; // a2_60's start
  const inBreak = frame >= breakFrom && frame < breakTo;
  const f = inBreak ? breakFrom : frame;

  const boomEmotion = useEmotion(
    scene,
    "boom",
    { a2_59_boom: "happy", a2_61_boom: "excited", a2_62_boom: "neutral", a2_64_narrator: "excited" },
    "happy",
    NO_LEAD,
  );
  const cloudiaEmotion = useEmotion(scene, "cloudia", { a2_65_cloudia: "proud" }, "proud", NO_LEAD);

  if (hasVolcano && frame >= goneTo && frame < beamFrom) {
    return <CoastWide from={goneTo} speaking={stage.speaking("volcano")} volcanoFrom={volFrom} />;
  }

  // The CRACK, in picture: the frame white for one frame, the glass rattles,
  // the mug rings — all over before the break begins.
  const white = f === 0 ? 0.92 : f === 1 ? 0.3 : f === 2 ? 0.1 : 0;
  const crack = ramp(f, [0, 2, 20], [1, 1, 0]);
  const ripple = ramp(f, [0, 3, 24, 60], [0, 1, 0.5, 0]);
  // He swells through the proud run-on and settles in the turn to her.
  const puff = ramp(f, [runFrom + 20, runFrom + 160, runTo, runTo + 30], [0, 1, 1, 0], kidEase.easeInOutSine);
  // Address 3: in the 45f after the run-on he turns to where she went.
  const lookAway = f >= runTo + 6 && f < goneTo + 10;
  const beaming = hasVolcano && f >= beamFrom - 2 && f < beamTo + 20;
  const boomLook: LookDirection = lookAway ? { x: 1, y: -0.7 } : f >= noiseFrom - 6 && f < noiseTo ? { x: 0.7, y: -0.6 } : "camera";
  const hatch = ramp(f, [noiseFrom - 18, noiseFrom - 2, noiseTo + 10, noiseTo + 26], [0, 1, 1, 0]);
  const flashOnly = f === 0;

  return (
    <Freeze frame={breakFrom} active={inBreak}>
      <WindowWorld
        bg={LIT_BG}
        sky="lit"
        phase={0.3}
        drift={2}
        ripple={ripple}
        rattle={crack}
        kid={{ ...KID_AT_WINDOW, fingers: 0, lean: 1, blanket: ramp(f, [0, 10], [0.75, 1]) }}
        outside={
          <>
            <Underside depth={170} crackle={0.25} />
            <CloudiaHatch open={hatch} emotion={cloudiaEmotion} speaking={stage.speaking("cloudia")} />
            <HailBegins from={hailFrom + 56} top={240} />
            {white > 0 ? <AbsoluteFill style={{ background: `rgba(244,249,255,${white})` }} /> : null}
            <AtGlass
              d={0}
              emotion={beaming ? "excited" : boomEmotion}
              speaking={stage.speaking("boom")}
              look={boomLook}
              puff={beaming ? 1 : puff}
            />
            {flashOnly ? <Flash at={0} from={S16_STRIKE.from} to={S16_STRIKE.to} weight={1.1} /> : null}
          </>
        }
        overlay={
          <Bubbles
            scene={scene}
            cast={{ boom: glassMark(0), cloudia: { x: HATCH.x, y: HATCH.y, who: "cloudia", scale: CLOUDIA_HATCH_SCALE } }}
            text={S16_BUBBLES}
            at={{ ...placeAll(["a2_61_boom", "a2_62_boom"], GLASS_RIGHT), a2_65_cloudia: HATCH_BUBBLE }}
          />
        }
      />
    </Freeze>
  );
};

// ---------------------------------------------------------------------------
// Scene 17 — The myth, and the Big Word THUNDER
// ---------------------------------------------------------------------------

/**
 * **THE MYTH STAMP** — the house device (ep 1 Sc 14, ep 3): thuds on at 3.2×,
 * cracks half a beat later along one jagged seam. Redrawn here (it lives in
 * scene files; promotion to the kit is the next episode's call).
 */
const MythStamp: React.FC<{ at: number; until: number; x: number; y: number; sub: string }> = ({ at, until, x, y, sub }) => {
  const frame = useCurrentFrame();
  const u = frame - at;
  if (u < 0) return null;
  const land = 3.2 + (1 - 3.2) * kidEase.easeOutCubic(Math.min(1, u / 9));
  const out = Math.max(0, Math.min(1, (frame - until) / 10));
  const opacity = Math.min(1, u / 3) * (1 - out);
  if (opacity <= 0.01) return null;
  const crack = Math.max(0, Math.min(1, (u - 16) / 22));
  const seam = "50% 0%, 43% 26%, 57% 52%, 45% 76%, 51% 100%";
  const halves: Array<{ clip: string; dx: number; rot: number }> = [
    { clip: `polygon(0% 0%, ${seam}, 0% 100%)`, dx: -crack * 24, rot: -crack * 3 },
    { clip: `polygon(100% 0%, ${seam}, 100% 100%)`, dx: crack * 24, rot: crack * 3 },
  ];
  const face = (
    <div
      style={{
        border: `14px solid ${kidTheme.tomato}`,
        borderRadius: kidRadius.card,
        padding: "8px 20px 16px",
        background: "rgba(255,253,247,0.94)",
        textAlign: "center",
        boxShadow: kidShadow(1.1),
      }}
    >
      <div style={{ border: `7px solid ${kidTheme.tomato}`, borderRadius: kidRadius.chip, padding: "8px 30px" }}>
        <div style={{ fontSize: 116, fontWeight: 900, color: kidTheme.tomato, lineHeight: 1 }}>MYTH</div>
        <div style={{ fontSize: 48, fontWeight: 900, color: kidTheme.tomato, letterSpacing: 3, whiteSpace: "nowrap" }}>{sub}</div>
      </div>
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${land}) rotate(-11deg)`,
        opacity,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      {halves.map((half, i) => (
        <div
          key={half.clip}
          style={{
            position: i === 0 ? "relative" : "absolute",
            inset: i === 0 ? undefined : 0,
            clipPath: half.clip,
            transform: `translateX(${half.dx}px) rotate(${half.rot}deg)`,
          }}
        >
          {face}
        </div>
      ))}
    </div>
  );
};

/** One of the two small clouds for the demonstration: a far, faceless-shy puff. */
const SmallCloud: React.FC<{ x: number; y: number; r: number; look: number; phase: number }> = ({ x, y, r, look, phase }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bob = Math.sin((frame / fps) * 1.3 + phase) * 2;
  const cy = y + bob;
  const body = "#f3f4fa";
  const edge = "#8a90a8";
  return (
    <g>
      <g fill={edge}>
        <circle cx={x - r * 0.7} cy={cy + r * 0.15} r={r * 0.66 + 3} />
        <circle cx={x} cy={cy - r * 0.15} r={r + 3} />
        <circle cx={x + r * 0.72} cy={cy + r * 0.18} r={r * 0.6 + 3} />
        <rect x={x - r * 1.3} y={cy} width={r * 2.6} height={r * 0.72 + 3} rx={r * 0.36} />
      </g>
      <g fill={body}>
        <circle cx={x - r * 0.7} cy={cy + r * 0.15} r={r * 0.66} />
        <circle cx={x} cy={cy - r * 0.15} r={r} />
        <circle cx={x + r * 0.72} cy={cy + r * 0.18} r={r * 0.6} />
        <rect x={x - r * 1.27} y={cy} width={r * 2.54} height={r * 0.7} rx={r * 0.34} />
      </g>
      {[-1, 1].map((s) => (
        <circle key={s} cx={x + s * r * 0.28 + look * r * 0.12} cy={cy - r * 0.08} r={r * 0.11} fill={kidTheme.ink} />
      ))}
      <path d={`M ${x - r * 0.16} ${cy + r * 0.22} Q ${x} ${cy + r * 0.34} ${x + r * 0.16} ${cy + r * 0.22}`} stroke={kidTheme.ink} strokeWidth={Math.max(2, r * 0.08)} strokeLinecap="round" fill="none" />
    </g>
  );
};

/** Beside the volcano, over the sea by the island: where the two meet. */
const MEET = { x: 591, y: 396, r: 21 } as const;

const S17_BUBBLES: Record<string, string> = {
  a2_68_cloudia: "WE DO NOT BUMP. WE MINGLE.",
  a2_70_cloudia: "TWO OF THEM MAKE NO SOUND.",
  a2_71_cloudia: "Nothing, darling.",
  a2_72_cloudia: "THE BANG IS HER.",
  a2_75_boom: "I AM THE JUMP.",
  a2_76_boom: "THE LOUD PART IS BEST!",
};

/** a2_70: "Two of them meeting make no sound at all." starts 5.31s in. */
const A2_70_TWO_S = 5.31;
/** a2_73: "That jump is him." 6.05s; "Same instant." 7.31s. */
const A2_73_JUMP_S = 6.05;
const A2_73_INSTANT_S = 7.31;
/** a2_74: "Thunder." 1.57s. */
const A2_74_WORD_S = 1.57;
/** a2_72: "That is the crackle." ~ the middle third. */

/** After "That jump is him." Boom hops down the glass, clear of the card. */
const S17_LOW_Y = 372;

const MythThunderScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage(scene);
  const [sayFrom] = lineWindow(scene, "a2_67_narrator");
  const [, mingleTo] = lineWindow(scene, "a2_68_cloudia");
  const [, bustedTo] = lineWindow(scene, "a2_69_narrator");
  const [twoFrom, twoTo] = lineWindow(scene, "a2_70_cloudia");
  const [crackleFrom, crackleTo] = lineWindow(scene, "a2_72_cloudia");
  const [airFrom] = lineWindow(scene, "a2_73_narrator");
  const [nameFrom] = lineWindow(scene, "a2_74_narrator");
  const [meFrom] = lineWindow(scene, "a2_75_boom");

  // THE MYTH STAMP: thuds on as "We mingle." finishes, cracks inside the 36f.
  const stampAt = mingleTo - 10;
  // The two small clouds drift together on "Two of them meeting…" and touch
  // as the line ends: the 36f after it is the nothing.
  const driftFrom = twoFrom + Math.round(A2_70_TWO_S * fps);
  const meet = ramp(frame, [driftFrom, twoTo], [0, 1], kidEase.easeInOutSine);
  const ax = MEET.x - MEET.r * 1.3 - 120 * (1 - meet);
  const bx = MEET.x + MEET.r * 1.3 + 130 * (1 - meet);
  // "That jump is him." — Boom hops (the jump) down the glass.
  const jumpAt = airFrom + Math.round(A2_73_JUMP_S * fps);
  const hop = ramp(frame, [jumpAt, jumpAt + 18], [0, 1], kidEase.easeInOutSine);
  const hopArc = Math.sin(hop * Math.PI) * 60;
  const boomY = BOOM_GLASS.y + (S17_LOW_Y - BOOM_GLASS.y) * hop - hopArc;
  // "Same instant. Same place." — she goes, and his rings burst on the SAME
  // frame (zero distance: one thing).
  const instantAt = airFrom + Math.round(A2_73_INSTANT_S * fps);
  const cardAt = nameFrom + Math.round(A2_74_WORD_S * fps);
  const hatch = ramp(frame, [sayFrom + 40, sayFrom + 58, crackleTo + 10, crackleTo + 26], [0, 1, 1, 0]);
  const crackle = ramp(frame, [crackleFrom + 70, crackleFrom + 90, crackleTo, crackleTo + 20], [0, 1, 1, 0]);

  const cloudiaEmotion = useEmotion(
    scene,
    "cloudia",
    { a2_68_cloudia: "skeptical", a2_70_cloudia: "proud", a2_71_cloudia: "happy", a2_72_cloudia: "proud" },
    "skeptical",
    NO_LEAD,
  );
  const boomEmotion = useEmotion(scene, "boom", { a2_75_boom: "proud", a2_76_boom: "excited" }, "happy", NO_LEAD);
  const R = boomRadius(0, GLASS_SCALE);
  const boomLow: BubblePlacement = { x: 1190, y: 322, tail: "left", tailAt: BOOM_GLASS.x + R * 0.6 };

  return (
    <WindowWorld
      bg={LIT_BG}
      sky="lit"
      phase={1.7}
      drift={2}
      flashes={[instantAt]}
      kid={{ ...KID_AT_WINDOW, fingers: 0, lean: ramp(frame, [0, 60], [1, 0.55]), blanket: 1 }}
      outside={
        <>
          <Underside depth={150} crackle={crackle} />
          <CloudiaHatch
            open={hatch}
            emotion={cloudiaEmotion}
            speaking={stage.speaking("cloudia")}
            look={frame >= driftFrom && frame < crackleFrom ? { x: -0.9, y: 0.8 } : "down"}
          />
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
            <SmallCloud x={ax} y={MEET.y} r={MEET.r} look={0.8} phase={0.4} />
            <SmallCloud x={bx} y={MEET.y + 4} r={MEET.r * 0.92} look={-0.8} phase={2.2} />
          </svg>
          <Flash at={instantAt} from={{ x: 1470, y: 196 }} to={{ x: 900, y: 238 }} />
          <AtGlass
            d={0}
            y={boomY}
            emotion={boomEmotion}
            speaking={stage.speaking("boom")}
            look={frame >= meFrom ? "camera" : frame >= driftFrom && frame < airFrom ? { x: -1, y: 0.9 } : "camera"}
            burstAt={instantAt}
            puff={frame >= meFrom ? 1 : 0}
          />
        </>
      }
      overlay={
        <>
          <MythStamp at={stampAt} until={bustedTo + 6} x={960} y={420} sub="CLOUDS DO NOT BUMP." />
          <WordCard text="THUNDER" from={cardAt} y={128} fontSize={130} bannerColor="#6d5c8f" sub="the sound of lightning" zIndex={35} />
          <Bubbles
            scene={scene}
            cast={{ cloudia: { x: HATCH.x, y: HATCH.y, who: "cloudia", scale: CLOUDIA_HATCH_SCALE } }}
            text={S17_BUBBLES}
            at={placeAll(["a2_68_cloudia", "a2_70_cloudia", "a2_71_cloudia", "a2_72_cloudia"], HATCH_BUBBLE)}
          />
          {/* Boom's two lines under the card: one line each (wide), the tail
              landing on his right edge, well clear of the kid's head. */}
          <Bubbles
            scene={scene}
            cast={{ boom: boomMark(BOOM_GLASS.x, S17_LOW_Y, GLASS_SCALE, 0, "left") }}
            text={S17_BUBBLES}
            at={{ a2_75_boom: boomLow, a2_76_boom: boomLow }}
            maxWidth={900}
          />
        </>
      }
    />
  );
};

export const ACT2_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s11_six: SixScene,
  s12_blue_three: BlueThreeScene,
  s13_ruler: RulerScene,
  s14_house_phone: HousePhoneScene,
  s15_two_one: TwoOneScene,
  s16_zero: ZeroScene,
  s17_myth_thunder: MythThunderScene,
};

