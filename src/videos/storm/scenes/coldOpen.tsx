import React from "react";
import {
  Boom,
  Bubbles,
  Cloudia,
  Flash,
  GARDEN,
  GardenWorld,
  KID_AT_WINDOW,
  KidLying,
  PHASE,
  Sunny,
  WindowWorld,
  countRuns,
  fingersAt,
  flashFor,
  hover,
  interpolate,
  kidEase,
  kidInkOutline,
  kidTheme,
  lineWindow,
  rgba,
  spring,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cam,
  type Cast,
  type Mark,
  type TimedScene,
} from "./common";

// COLD OPEN (s01_heavy_morning, s02_window_count).
//
// "The hottest morning of the series, a hotel that is bored of drizzle, a
// window, and nine seconds counted on a kid's fingers before the hero has a
// face."
//
// ---------------------------------------------------------------------------
// WHAT THIS FILE PLANTS (and what a later act may assume)
//
//   THE HORIZON   The volcano AWAKE, summit lit, Ember's island beside him —
//                 named on screen in the first wide (co_02) and never blinking
//                 out: `Horizon` in common.tsx, inside every coastal world.
//   THE HOTEL     Small and grey far out over the sea in Scene 1 (Cloudia
//                 herself, at cloud scale — she speaks there); a TOWER with a
//                 flat top out past the volcano in Scene 2 (`HotelTower`).
//   THE WINDOW    From co_13 to the end card the kid is indoors and every
//                 outdoor event is seen through the glass (`WindowWorld`).
//   THE COUNT     The fingers climb on the onset grid (`fingersAt`), Flash
//                 goes past for six frames before "One." (`flashFor`), and the
//                 sound crosses the bay as two rings with no face — he has not
//                 been introduced, and at nine counts he is a rumble.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Scene 1 — The heaviest morning
// ---------------------------------------------------------------------------

/** Sunny, up and enormous, top right — over the sea, clear of the horizon. */
const S1_SUNNY: Mark = { x: 1500, y: hover("sunny", 300, 1.05), scale: 1.05, who: "sunny", side: "left", offset: 400 };

/**
 * Cloudia, the small grey hotel, drifting in from the right over the water
 * on co_08 ("drifted in, small and grey"). At cloud scale she IS the hotel —
 * the manager and the building are one cloud in the exteriors of every show
 * so far, and she has two lines here.
 */
const S1_CLOUDIA_SCALE = 0.34;
const S1_CLOUDIA_Y = 360;

const S1_BUBBLES: Record<string, string> = {
  co_03_sunny: "GOOD MORNING, EVERYBODY!",
  co_04_sunny: "I invented mornings!",
  co_05_sunny: "ALL THAT WARM IS ME.",
  co_07_sunny: "You're welcome! HA! HA!",
  co_10_cloudia: "SIX SHOWS. NOT ONE GALA.",
  co_11_cloudia: "BORN FOR A GALA, DARLING.",
};

const HeavyMorningScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [driftFrom] = lineWindow(scene, "co_08_narrator");
  const [cloudiaFrom] = lineWindow(scene, "co_10_cloudia");

  // The hotel drifts in across co_08 and settles before she speaks.
  const drift = interpolate(frame, [driftFrom, cloudiaFrom - 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cloudiaX = 2120 - 980 * drift;
  const cloudia: Mark = {
    x: cloudiaX,
    y: hover("cloudia", S1_CLOUDIA_Y, S1_CLOUDIA_SCALE),
    scale: S1_CLOUDIA_SCALE,
    who: "cloudia",
    side: "left",
    offset: 300,
  };

  // A slow push the length of the scene, under the threshold of noticing.
  const cam: Cam = {
    x: 760,
    y: 640,
    zoom: interpolate(frame, [0, scene.durationInFrames], [1, 1.04]),
  };

  const sunnyEmotion = useEmotion(
    scene,
    "sunny",
    { co_03_sunny: "excited", co_04_sunny: "proud", co_05_sunny: "proud", co_07_sunny: "excited" },
    "proud",
  );
  const cloudiaEmotion = useEmotion(scene, "cloudia", { co_10_cloudia: "skeptical", co_11_cloudia: "sad" }, "neutral");

  const cast: Cast = { sunny: S1_SUNNY, cloudia };
  // Sunny watches Cloudia when she talks; otherwise he beams at the camera.
  const sunnyLook = stage.speaking("cloudia") ? ("left" as const) : ("camera" as const);

  return (
    <GardenWorld
      bg="garden_heavy_day"
      phase={0.6}
      cam={cam}
      light="heavy"
      shimmer={1}
      sky={
        <>
          <Sunny
            x={S1_SUNNY.x}
            y={S1_SUNNY.y}
            scale={S1_SUNNY.scale}
            phase={PHASE.sunny}
            emotion={sunnyEmotion}
            speaking={stage.speaking("sunny")}
            look={sunnyLook}
          />
          {drift > 0 ? (
            <Cloudia
              x={cloudia.x}
              y={cloudia.y}
              scale={S1_CLOUDIA_SCALE}
              phase={PHASE.cloudia}
              fill={0.62}
              clipboard={false}
              emotion={cloudiaEmotion}
              speaking={stage.speaking("cloudia")}
              look={stage.speaking("sunny") ? "upRight" : "camera"}
            />
          ) : null}
        </>
      }
      overlay={<Bubbles scene={scene} cast={cast} text={S1_BUBBLES} />}
    >
      {/* The kid, flat on the grass, bare feet in the air. */}
      <KidLying x={420} y={GARDEN.ground + 20} scale={1.3} />
    </GardenWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — The window rule, and the first count
// ---------------------------------------------------------------------------

/** The hotel out past the volcano: far, flat-topped, on the window horizon. */
export const FAR_HOTEL = { x: 1320, base: GARDEN.horizon - 24 } as const;

/**
 * Where the sound starts (the hotel's base, where Flash leaves from) and where
 * it arrives (just outside the glass, frame-left of the kid's head).
 */
export const SOUND_FROM = { x: FAR_HOTEL.x - 20, y: GARDEN.horizon - 20 } as const;
export const SOUND_TO = { x: 640, y: 430 } as const;

/** Flash's strike for a far count: from the hotel's base down to the sea. */
/**
 * It ends on the sea just in front of the horizon and RIGHT of the kid's head
 * (head spans x ~868–1052 at the window): a bolt that ends behind the kid
 * reads as the kid being struck — "nothing on screen is ever struck".
 */
export const FAR_STRIKE = {
  from: { x: FAR_HOTEL.x - 90, y: FAR_HOTEL.base - 200 },
  to: { x: FAR_HOTEL.x - 200, y: GARDEN.horizon + 14 },
} as const;

/**
 * **The sound crossing the bay** — Boom with no face and no body, just his two
 * rings, from the hotel to the glass over the count. `u` 0 = the flash, 1 = the
 * arrival. The rings grow as they come (sound spreads); at the glass they are
 * huge and pale. Exported: Scene 10 rejoins the same nine seconds at u = 6/9.
 */
export const SoundRings: React.FC<{ u: number; count: number }> = ({ u, count }) => {
  const k = Math.max(0, Math.min(1, u));
  if (k <= 0 || k >= 1.0) return null;
  const e = kidEase.easeInOutSine(k);
  const x = SOUND_FROM.x + (SOUND_TO.x - SOUND_FROM.x) * e;
  const cy = SOUND_FROM.y + (SOUND_TO.y - SOUND_FROM.y) * e;
  const scale = 0.25 + 0.75 * e;
  return (
    <Boom
      x={x}
      y={hover("boom", cy, scale)}
      scale={scale}
      distance={(count / 9) * e}
      phase={PHASE.boom}
      heading={200}
      ringsOnly
      rings={1}
      opacity={Math.min(1, k * 6) * Math.min(1, (1 - k) * 8)}
    />
  );
};

const TITLE = ["Boom and the", "One, Two, Three"] as const;

const WindowCountScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [, towerTo] = lineWindow(scene, "co_13_narrator");
  const [ruleFrom] = lineWindow(scene, "co_14_narrator");
  const [lateFrom, lateTo] = lineWindow(scene, "co_25_narrator");
  const [askFrom, askTo] = lineWindow(scene, "co_26_narrator");
  const [titleFrom] = lineWindow(scene, "co_27_narrator");
  const run = countRuns(scene)[0];
  const flashAt = flashFor(run);

  // The tower STANDS UP across co_13 ("a cloud stood up. A tower, with a flat
  // top"), finishing as the kid goes indoors.
  const grow = interpolate(frame, [20, towerTo - 70], [0.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  // "The kid went indoors" — the last words of co_13 — and takes position:
  // the kid rises into the window from below the frame.
  const kidIn = interpolate(frame, [towerTo - 60, ruleFrom - 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });

  // THE COUNT. Fingers on the onset grid; they hold at nine through "There
  // he is." and come down on co_25.
  const counted = fingersAt(scene, frame);
  const down = interpolate(frame, [lateFrom, lateFrom + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const fingers = counted * down;
  const u = (frame - flashAt) / (run.arrive - flashAt);

  // THE RUMBLE (sound design is not in this episode's toolkit; the picture
  // carries it): the glass hums and the mug ripples for a second on arrival.
  const hum = interpolate(frame, [run.arrive - 2, run.arrive + 6, run.arrive + 40], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "The camera lifts toward the tower" across co_26, and the title lands on
  // co_27 over the thunderhead.
  const lift = interpolate(frame, [askFrom + 40, askTo + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const titlePop = spring({ frame: frame - (titleFrom + 6), fps, config: { damping: 13, mass: 0.7 } });

  // The ep-5 card, ghosted over the sky under co_25 — print only, low alpha,
  // nothing on screen acknowledges it.
  const ghost = interpolate(frame, [lateFrom + 10, lateFrom + 30, lateTo + 20, lateTo + 40], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const world = (
    <WindowWorld
      bg="bay_through_window_yellow"
      sky="yellow"
      phase={1.3}
      hotel={{ ...FAR_HOTEL, grow, tone: "heavy" }}
      flashes={[flashAt]}
      outside={
        <>
          <Flash at={flashAt} from={FAR_STRIKE.from} to={FAR_STRIKE.to} weight={1} />
          <SoundRings u={u} count={run.count} />
        </>
      }
      kid={{ ...KID_AT_WINDOW, fingers, sill: KID_AT_WINDOW.sill + (1 - kidIn) * 420 }}
      ripple={hum}
      rattle={hum}
    />
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${FAR_HOTEL.x}px ${FAR_HOTEL.base - 200}px`,
          transform: `scale(${(1 + 0.32 * lift).toFixed(4)}) translateY(${(lift * 60).toFixed(1)}px)`,
        }}
      >
        {world}
      </div>
      {ghost > 0.01 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", opacity: 0.38 * ghost }}>
          <div
            style={{
              padding: "20px 50px",
              borderRadius: 40,
              border: `6px solid ${kidTheme.paper}`,
              background: rgba(kidTheme.ink, 0.7),
              fontFamily: kidTheme.fontFamily,
              fontSize: 56,
              fontWeight: 900,
              color: kidTheme.paper,
              whiteSpace: "nowrap",
            }}
          >
            WHY IS THUNDER ALWAYS LATE?
          </div>
        </div>
      ) : null}
      {titlePop > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 60,
            textAlign: "center",
            fontFamily: kidTheme.fontFamily,
            transform: `scale(${titlePop.toFixed(3)}) rotate(${((1 - titlePop) * -3).toFixed(2)}deg)`,
            opacity: Math.min(1, titlePop * 1.4),
          }}
        >
          <div style={{ fontSize: 120, fontWeight: 900, letterSpacing: -1, lineHeight: 1.04, color: kidTheme.paper, textShadow: kidInkOutline(6) }}>
            {TITLE[0]}
            <br />
            {TITLE[1]}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const COLD_OPEN_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s01_heavy_morning: HeavyMorningScene,
  s02_window_count: WindowCountScene,
};
