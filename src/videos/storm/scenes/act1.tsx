import React from "react";
import {
  AbsoluteFill,
  Blobby,
  Boom,
  Bubbles,
  COUNT_OF,
  COUNT_GRID,
  Cloudia,
  Drip,
  FLASH_BEFORE_COUNT,
  Flash,
  FrontDesk,
  HailBall,
  HAIL_NAMED,
  HailCrowd,
  Horizon,
  HotelWorld,
  KID_AT_WINDOW,
  LOBBY,
  PHASE,
  Plate,
  Puff,
  SEA_SEAT,
  SpeechBubble,
  StaticHair,
  Stony,
  Sunny,
  SunnyGlow,
  TowerSection,
  WideLayer,
  WindowWorld,
  WordCard,
  Z,
  boomMark,
  countRuns,
  fingersAt,
  floorY,
  hover,
  interpolate,
  kidEase,
  kidTheme,
  lineWindow,
  stand,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  NO_LEAD,
  projectMark,
  type Cam,
  type Cast,
  type Mark,
  type TimedScene,
  type TowerSpec,
} from "./common";
import { FAR_HOTEL, SoundRings } from "./coldOpen";

// ACT ONE — THE HOTEL GOES UP (s03_lift … s10_same_nine).
//
// "Cloudia's gala: a lift at a hotel with no stairs, a penthouse in the
// freezer, a crackle in the walls, a guest who leaves through the wall — and
// the noise that is born beside her, exactly on time."
//
// ---------------------------------------------------------------------------
// WHAT THIS ACT PLANTS (and therefore what acts two and three may assume)
//
//   THE LIFT      Puff IS the lift — an updraft under a round cloud platform,
//                 no car, no cable. "Going up." is a platform rising with
//                 guests on it; each firing is a coat of ice (Scene 8).
//   THE TOWER     Seen in section twice: from outside over the sea as it goes
//                 vertical and blocks Sunny (Scene 5), and from inside, floors
//                 stacked, the freezing line dashed, the penthouse icy above it
//                 (Scenes 7–8). The crackle is SPARKS in the walls; the charge
//                 is two glows — the top floor gold, the lobby blue.
//   SUNNY         Visible in the lobby's ceiling gap in Scene 3 (the hotel is
//                 not tall enough yet), his LAST visible frame is the tower
//                 passing him in Scene 5, and from there to Scene 22 he is
//                 `SunnyGlow` at the cloud's edge, his bubbles from the glow.
//   STONY         `Stony` from common.tsx — the big one with the frost crown.
//                 Scene 6 (the back of the penthouse), Scene 8 (up and down
//                 more than anybody). Acts three's step and lawn reuse him.
//   FLASH + BOOM  Born together in the lobby in Scene 9: Flash leaves through
//                 the LEFT wall (the hole stays), Boom is standing where the
//                 crackle was, small, tight and sharp (distance 0). His first
//                 "Present!" comes visibly out of his mouth, with a ring burst.
//
// THE BOUNDARY CHECKLIST (STYLE)
//   s02→s03  Time and place cut: the window afternoon → the lobby "this
//            morning" (a1_01 says so: the afternoon REWOUND). Nothing carries.
//   s03→s04  Same lobby, same marks, same desk; the lift that left in s03
//            comes back up with Drip on it — her entrance.
//   s04→s05  Inside → outside, the lift that left with Drip is the tower
//            growing. Cloudia goes from desk to the section's lobby floor.
//   s05→s06  Up the tower to the penthouse; Cloudia is already there (she rode
//            up on a1_24).
//   s06→s07  Penthouse → the whole section; Cloudia on floor 2.
//   s07→s08  Same section, same camera, same Cloudia mark (no jump).
//   s08→s09  Section → lobby. The lobby's crackle is the s08 hum, arrived.
//   s09→s10  HARD CUT (script) to the window, six fingers already up.
// ---------------------------------------------------------------------------

/** Cloudia behind the desk: the desk front hides everything below her face. */
const DESK_CLOUDIA: Mark = {
  x: LOBBY.deskX,
  y: hover("cloudia", 590, 0.62),
  scale: 0.62,
  who: "cloudia",
  side: "left",
  offset: 360,
};

/** Where the lift comes up through the lobby floor. */
const LIFT_X = 700;

/**
 * **The lobby camera.** The plate is a big empty room and the cast lives on
 * its floor, so every lobby shot pushes in 1.4× on the floor line: the desk,
 * Cloudia and the guests fill the frame instead of sitting in its bottom
 * third. Bubbles are outside the camera, so every lobby mark goes through
 * `projectMark(LOBBY_CAM, …)` before it reaches `Bubbles`.
 */
const LOBBY_CAM: Cam = { x: 1010, y: 860, zoom: 1.4 };
const onLobby = (cast: Cast): Cast =>
  Object.fromEntries(Object.entries(cast).map(([k, m]) => [k, m ? projectMark(LOBBY_CAM, m) : m])) as Cast;

/** The lift platform: a round cloud disc. `y` is its top surface. */
const LiftPlatform: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 300 }) => (
  <WideLayer>
    <ellipse cx={x} cy={y + 18} rx={w / 2} ry={30} fill="#9a97ad" />
    <ellipse cx={x} cy={y} rx={w / 2} ry={26} fill="#d9d6e4" />
    {[-1, 0, 1].map((k) => (
      <circle key={k} cx={x + k * w * 0.3} cy={y + 24} r={26} fill="#b9b6c9" />
    ))}
  </WideLayer>
);

/** The updraft under the platform: rising streak PAIRS (two lines, never one). */
const Updraft: React.FC<{ x: number; top: number; strength: number }> = ({ x, top, strength }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (strength <= 0.02) return null;
  return (
    <WideLayer>
      {Array.from({ length: 8 }, (_, i) => {
        const u = (t * 1.1 + i / 8) % 1;
        const y = 1120 - u * (1120 - top);
        const xx = x - 110 + ((i * 73) % 220);
        return (
          <g key={i} opacity={strength * 0.55 * Math.sin(u * Math.PI)} stroke={kidTheme.paper} strokeLinecap="round">
            <path d={`M ${xx} ${y.toFixed(0)} v -64`} strokeWidth={7} />
            <path d={`M ${xx + 16} ${(y + 20).toFixed(0)} v -52`} strokeWidth={5} opacity={0.7} />
          </g>
        );
      })}
    </WideLayer>
  );
};

/** Grey drizzle in the lobby: short falling dashes, deterministic. */
const Drizzle: React.FC<{ strength?: number }> = ({ strength = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer>
      {Array.from({ length: 26 }, (_, i) => {
        const u = (t * 0.45 + ((i * 0.37) % 1)) % 1;
        const x = 60 + ((i * 271) % 1800);
        const y = 120 + u * 760;
        return <path key={i} d={`M ${x} ${y.toFixed(0)} l -4 18`} stroke="#8b93a6" strokeWidth={4} strokeLinecap="round" opacity={0.4 * strength} />;
      })}
    </WideLayer>
  );
};

/**
 * The gap in the lobby's cloud ceiling, top right, with the sky and Sunny in
 * it — Scene 3's "Sunny is still visible here: the hotel is not yet tall
 * enough to hide him". Returns the mark his bubble aims at.
 */
const SUNNY_GAP = { x: 1700, y: 170, r: 150 } as const;
const SunnyInTheGap: React.FC<{ speaking: boolean; emotion: React.ComponentProps<typeof Sunny>["emotion"] }> = ({ speaking, emotion }) => (
  <div
    style={{
      position: "absolute",
      left: SUNNY_GAP.x - SUNNY_GAP.r,
      top: SUNNY_GAP.y - SUNNY_GAP.r,
      width: SUNNY_GAP.r * 2,
      height: SUNNY_GAP.r * 1.7,
      borderRadius: "50% 50% 46% 54% / 60% 60% 40% 40%",
      overflow: "hidden",
      background: "linear-gradient(#5fb8e8, #f3d77a)",
      border: "10px solid #c9c6d6",
    }}
  >
    <Sunny x={SUNNY_GAP.r + 10} y={hover("sunny", SUNNY_GAP.r * 0.95, 0.6)} scale={0.6} phase={PHASE.sunny} emotion={emotion} speaking={speaking} look="down" />
  </div>
);

// ---------------------------------------------------------------------------
// Scene 3 — Air in a hurry: a lift at a hotel with no stairs
// ---------------------------------------------------------------------------

/** The three guests who ride the first lift. */
const RIDERS = [
  { dx: -90, scale: 0.4, phase: 0.7 },
  { dx: 10, scale: 0.46, phase: 2.9 },
  { dx: 100, scale: 0.38, phase: 4.6 },
];

const S3_BUBBLES: Record<string, string> = {
  a1_03_cloudia: "Darling. There are no stairs.",
  a1_04_puff: "There is now a lift.",
  a1_05_cloudia: "Darling.",
  a1_06_puff: "Going up.",
  a1_07_sunny: "THE HOT IS ME.",
};

const LiftScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [hotFrom, hotTo] = lineWindow(scene, "a1_02_narrator");
  const [stairsFrom] = lineWindow(scene, "a1_03_cloudia");
  const [liftFrom] = lineWindow(scene, "a1_04_puff");
  const [upFrom] = lineWindow(scene, "a1_06_puff");

  // Heat rising under the hotel across a1_02 ("it goes up. Fast.").
  const heat = interpolate(frame, [hotFrom + 20, hotTo - 30, liftFrom + 40], [0, 1, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // PUFF ARRIVES FROM BELOW — his entrance is the lift: he and the platform
  // come up through the floor in the 20 frames before his line.
  const arrive = interpolate(frame, [liftFrom - 22, liftFrom], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutBack,
  });
  // "Going up." — and the first guests GO.
  const rise = interpolate(frame, [upFrom + 10, scene.durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInCubic,
  });
  const platY = LOBBY.floor - 40 + (1 - arrive) * 240 - rise * 900;
  const puff: Mark = { x: LIFT_X, y: hover("puff", platY + 120, 0.8), scale: 0.8, who: "puff", side: "right", offset: 300 };

  const cloudiaEmotion = useEmotion(
    scene,
    "cloudia",
    { a1_03_cloudia: "neutral", a1_05_cloudia: "skeptical" },
    "sad",
    NO_LEAD,
  );
  const cast: Cast = {
    cloudia: DESK_CLOUDIA,
    puff,
    sunny: { x: SUNNY_GAP.x, y: hover("sunny", SUNNY_GAP.y + 30, 0.6), scale: 0.6, who: "sunny", side: "left", offset: 360 },
  };
  // The first guest looking for the penthouse: she looks UP, then at Puff.
  const askerLook = frame < stairsFrom ? 0 : frame < liftFrom ? -0.6 : -0.9;

  return (
    <HotelWorld
      mode="lobby"
      phase={0.4}
      cam={LOBBY_CAM}
      overlay={
        <>
          <SunnyInTheGap speaking={stage.speaking("sunny")} emotion={stage.speaking("sunny") ? "excited" : "proud"} />
          <Bubbles scene={scene} cast={{ ...onLobby({ cloudia: cast.cloudia, puff: cast.puff }), sunny: cast.sunny }} text={S3_BUBBLES} />
        </>
      }
    >
      <Drizzle strength={1 - rise * 0.5} />
      <Updraft x={LIFT_X} top={platY} strength={Math.max(heat * 0.6, arrive)} />
      <Cloudia
        x={DESK_CLOUDIA.x}
        y={DESK_CLOUDIA.y}
        scale={DESK_CLOUDIA.scale}
        phase={PHASE.cloudia}
        fill={0.55}
        emotion={cloudiaEmotion}
        speaking={stage.speaking("cloudia")}
        look={frame >= liftFrom - 10 ? "left" : "camera"}
      />
      <FrontDesk />
      <WideLayer>
        <Blobby x={1150} y={LOBBY.floor - 60} scale={0.5} phase={1.1} look={askerLook} color={kidTheme.water} edge={kidTheme.waterDeep} />
      </WideLayer>
      {arrive > 0 ? (
        <>
          <Puff x={puff.x} y={puff.y} scale={0.8} opacity={0.55} phase={PHASE.puff} emotion="happy" speaking={stage.speaking("puff")} look="upRight" />
          <LiftPlatform x={LIFT_X} y={platY} />
          <WideLayer>
            {RIDERS.map((r, i) => (
              <Blobby key={i} x={LIFT_X + r.dx} y={platY - 46 * r.scale * 2} scale={r.scale} phase={r.phase} look={0} mood={rise > 0.02 ? "surprised" : "happy"} color={kidTheme.water} edge={kidTheme.waterDeep} />
            ))}
          </WideLayer>
        </>
      ) : null}
      <LobbyGuests rise={0} />
    </HotelWorld>
  );
};

/** The lobby's drizzle guests (drops hugging specks), minus the lift corner. */
const LobbyGuests: React.FC<{ rise?: number; look?: number }> = ({ look = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const spots = [
    { x: 200, y: LOBBY.floor - 30, s: 0.44 },
    { x: 360, y: LOBBY.floor - 70, s: 0.38 },
    { x: 1000, y: LOBBY.floor - 40, s: 0.42 },
    { x: 470, y: LOBBY.floor - 20, s: 0.46 },
  ];
  return (
    <WideLayer>
      {spots.map((g, i) => (
        <g key={i}>
          <Blobby x={g.x} y={g.y + Math.sin(t * 1.2 + i) * 3} scale={g.s} phase={i * 1.7} look={look} color={kidTheme.water} edge={kidTheme.waterDeep} />
          <circle cx={g.x + 62 * g.s} cy={g.y + 30 * g.s} r={16 * g.s} fill="#6b5a4a" />
        </g>
      ))}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 4 — A guest checks in
// ---------------------------------------------------------------------------

const S4_BUBBLES: Record<string, string> = {
  a1_09_drip: "Hi! It's me! I'm the weather!",
  a1_10_cloudia: "THE WEATHER IS THE MANAGEMENT.",
  a1_11_drip: "I would like the top floor.",
  a1_12_puff: "Going up.",
};

const CheckInScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [upFrom] = lineWindow(scene, "a1_12_puff");
  // DRIP'S STANDING ENTRANCE: up through the floor on the lift, arms wide,
  // landing on the first beat of her line.
  const arrive = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutBack,
  });
  const rise = interpolate(frame, [upFrom + 8, scene.durationInFrames - 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInCubic,
  });
  const platY = LOBBY.floor - 40 + (1 - arrive) * 300 - rise * 1000;
  const drip: Mark = { x: LIFT_X, y: stand("drip", platY + 4), scale: 0.62, who: "drip", side: "right", offset: 330 };
  const puff: Mark = { x: LIFT_X, y: hover("puff", platY + 120, 0.8), scale: 0.8, who: "puff", side: "right", offset: 300 };
  const cast: Cast = { cloudia: DESK_CLOUDIA, drip, puff };
  const dripEmotion = useEmotion(scene, "drip", { a1_09_drip: "excited", a1_11_drip: "proud" }, "happy");
  const cloudiaEmotion = useEmotion(scene, "cloudia", { a1_10_cloudia: "skeptical" }, "neutral");
  return (
    <HotelWorld mode="lobby" phase={0.4} cam={LOBBY_CAM} overlay={<Bubbles scene={scene} cast={onLobby(cast)} text={S4_BUBBLES} />}>
      <Drizzle strength={0.6} />
      <Updraft x={LIFT_X} top={platY} strength={1} />
      <Cloudia
        x={DESK_CLOUDIA.x}
        y={DESK_CLOUDIA.y}
        scale={DESK_CLOUDIA.scale}
        phase={PHASE.cloudia}
        fill={0.55}
        emotion={cloudiaEmotion}
        speaking={stage.speaking("cloudia")}
        look="left"
      />
      <FrontDesk />
      <Puff x={puff.x} y={puff.y} scale={0.8} opacity={0.55} phase={PHASE.puff} emotion="happy" speaking={stage.speaking("puff")} look="upRight" />
      <LiftPlatform x={LIFT_X} y={platY} />
      <Drip
        x={drip.x}
        y={drip.y}
        scale={0.62}
        phase={PHASE.drip}
        emotion={dripEmotion}
        pose="cheer"
        shadow={false}
        speaking={stage.speaking("drip")}
        look={stage.speaking("cloudia") ? "right" : "camera"}
      />
      <LobbyGuests look={0.4} />
    </HotelWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 5 — The hotel goes vertical
// ---------------------------------------------------------------------------

/** The tower in section over the sea. Wide enough to swallow Sunny whole. */
const S5_TOWER: TowerSpec = { x: 1040, base: 760, top: 110, width: 500, count: 6, freezeAt: 4.4 };
/** Sunny, up in the heavy sky exactly where the tower is going to go. */
const S5_SUNNY = { x: 1040, y: 260, scale: 0.64 } as const;
/** His glow once the tower is in front of him: the tower's right rim. */
const S5_GLOW = { x: S5_TOWER.x + S5_TOWER.width / 2 + 40, y: 230 } as const;

const S5_BUBBLES: Record<string, string> = {
  a1_15_cloudia: "I did not order this roof.",
  a1_16_cloudia: "I shall keep it, darling.",
  a1_18_sunny: "A HOTEL? IN FRONT OF ME?",
  a1_20_sunny: "THE UP RUNS ON THE HOT!",
  a1_22_sunny: "You're welcome! HA! HA!",
  a1_23_cloudia: "We have never had an up.",
  a1_24_cloudia: "WE HAVE A PENTHOUSE, DARLING.",
};

const VerticalScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [stackFrom, stackTo] = lineWindow(scene, "a1_14_narrator");
  const [roofFrom] = lineWindow(scene, "a1_15_cloudia");
  const [upFrom, upTo] = lineWindow(scene, "a1_24_cloudia");
  // FLOORS STACKED ON FLOORS. "Ten. Twenty. More." — the whole of a1_14.
  const floors = interpolate(frame, [stackFrom + 20, stackTo - 30], [1, S5_TOWER.count], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  // "…until it wore a flat roof." — the roof spreads on the last words.
  const roof = interpolate(frame, [stackTo - 40, roofFrom], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });
  const builtTop = S5_TOWER.base - (floors * (S5_TOWER.base - S5_TOWER.top)) / S5_TOWER.count;
  // Sunny is hidden once the build passes his top; the glow takes over.
  const hidden = builtTop < S5_SUNNY.y - 150;
  // Cloudia: on the lobby floor of the section, looking up at the roof on
  // a1_15, and riding the lift to the penthouse on a1_24.
  const ride = interpolate(frame, [upFrom + 10, upTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cGround = floorY(S5_TOWER, 0) + (floorY(S5_TOWER, 5) - floorY(S5_TOWER, 0)) * ride;
  const cloudia: Mark = { x: S5_TOWER.x - 130 + 90 * ride, y: stand("cloudia", cGround) + 34, scale: 0.44, who: "cloudia", side: "left", offset: 320 };
  const glow: Mark = { x: S5_GLOW.x, y: S5_GLOW.y + 120, scale: 1, who: "boom", lift: 0, side: "left", offset: 300 };
  const cast: Cast = { cloudia, sunny: glow };
  const sunnyEmotion = useEmotion(scene, "sunny", { a1_18_sunny: "grumpy", a1_20_sunny: "excited" }, "proud");
  const cloudiaEmotion = useEmotion(
    scene,
    "cloudia",
    { a1_15_cloudia: "skeptical", a1_16_cloudia: "proud", a1_23_cloudia: "amazed", a1_24_cloudia: "excited" },
    "neutral",
    NO_LEAD,
  );
  return (
    <AbsoluteFill style={{ background: "#e9c95a", fontFamily: kidTheme.fontFamily, lineHeight: "normal" }}>
      <Plate bg="sea_sky_heavy" seat={SEA_SEAT} phase={2.2} />
      <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery }}>
        <Horizon base={SEA_SEAT} x={300} light="heavy" />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: Z.sky }}>
        {hidden ? null : (
          <Sunny x={S5_SUNNY.x} y={hover("sunny", S5_SUNNY.y, S5_SUNNY.scale)} scale={S5_SUNNY.scale} phase={PHASE.sunny} emotion={sunnyEmotion} speaking={stage.speaking("sunny")} look="down" />
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>
        <TowerSection spec={S5_TOWER} floors={floors} roof={roof} lift={1} walls tone="heavy" />
        <RidersInShaft spec={S5_TOWER} top={builtTop} />
        <Cloudia
          x={cloudia.x}
          y={cloudia.y}
          scale={0.44}
          phase={PHASE.cloudia}
          fill={0.5}
          emotion={cloudiaEmotion}
          speaking={stage.speaking("cloudia")}
          look={frame >= roofFrom - 10 && frame < upFrom ? "up" : "camera"}
        />
        {hidden ? <SunnyGlow x={S5_GLOW.x} y={S5_GLOW.y} r={130} speaking={stage.speaking("sunny")} /> : null}
      </div>
      <AbsoluteFill style={{ zIndex: Z.overlay }}>
        <Bubbles scene={scene} cast={cast} text={S5_BUBBLES} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Little guests riding the shaft up — the lift working while it builds. */
const RidersInShaft: React.FC<{ spec: TowerSpec; top: number }> = ({ spec, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer>
      {[0, 1, 2].map((i) => {
        const u = (t * 0.22 + i / 3) % 1;
        const y = spec.base - 20 - u * (spec.base - top - 40);
        return <Blobby key={i} x={spec.x + (i - 1) * 6} y={y} scale={0.16} phase={i * 2} color={kidTheme.water} edge={kidTheme.waterDeep} mood="surprised" />;
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 6 — The penthouse is a freezer; ROLL CALL, firing 1
// ---------------------------------------------------------------------------

const S6_DRIP = { x: 820, ground: 900 } as const;
/**
 * The roll-call bubbles sit LOW and LEFT of Drip (repair R1): at y 250 the
 * kit tail stopped ~120px above her head among the hail faces and read as a
 * hail talking. Here its tip lands at her mouth level.
 */
const S6_NAME_Y = 470;
const S6_STONY = { x: 1060, y: 640 } as const;
const S6_CLOUDIA: Mark = { x: 1690, y: hover("cloudia", 420, 0.5), scale: 0.5, who: "cloudia", side: "left", offset: 330 };

/**
 * The roll call's name onsets inside `a1_27_drip`, MEASURED (ffmpeg
 * silencedetect −35dB): "Hi, Hail!" 0.17s, "Hi, Hailey!" 1.14s, "Hi, other
 * Hail!" 2.11s, "Hi, Hail the third!" 3.28s. Re-measure if the clip changes.
 */
const NAME_ONSETS_S = [0.17, 1.14, 2.11, 3.28];

/** Drip as ICE — bigger than she has ever been, in a faceted coat. */
const IceCoat: React.FC<{ x: number; y: number; scale: number; on: number }> = ({ x, y, scale, on }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (on <= 0.01) return null;
  // Drip's body centre in her own units is about local y 0 in a 380 box.
  const cy = y + 190 - 190 * scale;
  const rx = 150 * scale;
  const ry = 180 * scale;
  const pts = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
    const k = i % 2 ? 0.94 : 1.04;
    return `${(x + Math.cos(a) * rx * k).toFixed(1)},${(cy + 20 * scale + Math.sin(a) * ry * k).toFixed(1)}`;
  }).join(" ");
  const twinkle = (k: number) => 0.5 + 0.5 * Math.sin((frame / fps) * 3 + k);
  return (
    <WideLayer>
      <g opacity={on}>
        <polygon points={pts} fill="#e3f3ff" opacity={0.42} stroke="#8dbbe2" strokeWidth={8 * scale} strokeLinejoin="round" />
        <path d={`M ${x - rx * 0.5} ${cy - ry * 0.4} l ${rx * 0.25} ${-ry * 0.2}`} stroke="#ffffff" strokeWidth={12 * scale} strokeLinecap="round" opacity={0.8} />
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M ${x + (k - 1) * rx * 0.7} ${cy - ry * (0.8 - k * 0.2)} m -12 0 l 24 0 m -12 -12 l 0 24`}
            stroke="#ffffff"
            strokeWidth={5}
            strokeLinecap="round"
            opacity={twinkle(k * 2)}
          />
        ))}
      </g>
    </WideLayer>
  );
};

const PenthouseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage(scene);
  const [freezeFrom] = lineWindow(scene, "a1_26_drip");
  const [rollFrom, rollTo] = lineWindow(scene, "a1_27_drip");
  const [stonyFrom, stonyTo] = lineWindow(scene, "a1_28_drip");
  const [middleFrom, middleTo] = lineWindow(scene, "a1_29_narrator");

  // Drip arrives up the shaft during a1_25 and FREEZES on a1_26.
  const arrive = interpolate(frame, [30, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeOutBack });
  const ice = interpolate(frame, [freezeFrom - 6, freezeFrom + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeOutCubic });
  const scale = 0.6 + 0.3 * ice;
  const dripY = stand("drip", S6_DRIP.ground + (1 - arrive) * 420);
  const drip: Mark = { x: S6_DRIP.x, y: dripY, scale, who: "drip", side: "left", offset: 330 };

  // THE ROLL CALL'S EYE-LINES: she looks at each guest as she names them.
  const onsets = NAME_ONSETS_S.map((s) => rollFrom + Math.round(s * fps));
  const named = onsets.reduce((n, at, i) => (frame >= at ? i : n), -1);
  const target =
    frame >= stonyFrom - 6 && frame < middleFrom
      ? { x: S6_STONY.x, y: S6_STONY.y }
      : frame >= rollFrom && frame < rollTo + 10 && named >= 0
        ? { x: HAIL_NAMED[named].x, y: HAIL_NAMED[named].y }
        : null;
  const dripLook = target
    ? { x: Math.max(-1, Math.min(1, (target.x - S6_DRIP.x) / 500)), y: Math.max(-1, Math.min(1, (target.y - 620) / 400)) }
    : ("camera" as const);

  // "They keep rubbing past each other. It builds up." — the jostle, with the
  // first tiny sparks, under the roll call's flat middle. The picture of
  // STATIC, two scenes before the word.
  const rub = interpolate(frame, [middleFrom, middleFrom + 20, middleTo, middleTo + 30], [0, 1, 1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const t = frame / fps;
  const dripEmotion = useEmotion(scene, "drip", { a1_26_drip: "amazed", a1_27_drip: "happy", a1_30_drip: "happy" }, "happy", NO_LEAD);
  const cast: Cast = { drip, cloudia: S6_CLOUDIA };

  // The per-name bubbles: one short bubble per name, on its onset.
  const names = ["Hi, Hail!", "Hi, Hailey!", "Hi, other Hail!", "Hi, Hail the third!"];
  return (
    <HotelWorld
      mode="penthouse"
      phase={1.1}
      overlay={
        <>
          <Bubbles
            scene={scene}
            cast={cast}
            text={{
              a1_25_cloudia: "THE PENTHOUSE IS A FREEZER, DARLING.",
              a1_26_drip: "I HAVE NEVER BEEN THIS BIG.",
              a1_28_drip: "Hi, Stony.",
              a1_30_drip: "I am one of them now.",
            }}
            at={{
              a1_28_drip: { x: S6_DRIP.x - 330, y: S6_NAME_Y, tail: "right", tailAt: S6_DRIP.x },
              a1_30_drip: { x: S6_DRIP.x - 330, y: S6_NAME_Y, tail: "right", tailAt: S6_DRIP.x },
            }}
          />
          {names.map((text, i) => (
            <SpeechBubble
              key={text}
              x={S6_DRIP.x - 330}
              y={S6_NAME_Y}
              text={text}
              tail="right"
              tailAt={S6_DRIP.x}
              from={onsets[i]}
              until={i < 3 ? onsets[i + 1] : rollTo}
            />
          ))}
        </>
      }
    >
      <HailCrowd look={0} dy={0} mood="happy" extras={9} rub={rub} />
      <WideLayer>
        {rub > 0.05
          ? HAIL_NAMED.map((h, i) =>
              Math.sin(t * 11 + i * 2) > 0.3 ? (
                <path
                  key={h.name}
                  d={`M ${h.x + 70} ${h.y - 30} l 10 -14 l 8 12 l 10 -14`}
                  stroke="#fff3a0"
                  strokeWidth={5}
                  fill="none"
                  strokeLinecap="round"
                  opacity={rub}
                  transform={`translate(${(Math.sin(t * 4 + i) * 12 * rub).toFixed(1)} 0)`}
                />
              ) : null,
            )
          : null}
      </WideLayer>
      <Stony x={S6_STONY.x} y={S6_STONY.y} look={frame >= stonyFrom - 6 && frame < stonyTo + 30 ? -1 : 0} mood={frame >= stonyFrom && frame < stonyTo + 30 ? "surprised" : "calm"} />
      <Cloudia x={S6_CLOUDIA.x} y={S6_CLOUDIA.y} scale={0.5} phase={PHASE.cloudia} fill={0.5} emotion={stage.speaking("cloudia") ? "proud" : "happy"} speaking={stage.speaking("cloudia")} look="left" />
      <Drip x={drip.x} y={drip.y} scale={scale} phase={PHASE.drip} emotion={dripEmotion} pose={ice > 0.5 ? "cheer" : "rest"} shadow={false} speaking={stage.speaking("drip")} look={dripLook} />
      <IceCoat x={drip.x} y={drip.y} scale={scale} on={ice} />
    </HotelWorld>
  );
};

// ---------------------------------------------------------------------------
// Scenes 7 and 8 — inside the tower, the whole section
// ---------------------------------------------------------------------------

/** The section framed full: six floors, the freezing line, the roof. */
// Four floors rather than six: the section has to be readable as a diagram
// WITH CHARACTERS IN IT, and at six floors Cloudia was 160px tall.
const IN_TOWER: TowerSpec = { x: 960, base: 1040, top: 78, width: 1760, count: 4, freezeAt: 2.6 };
const S78_CLOUDIA_FLOOR = 1;
const S78_CLOUDIA_SCALE = 0.62;

/** Little icy guests on the top floors, jostling — where the crackle comes from. */
const IcyGuests: React.FC<{ rub?: number }> = ({ rub = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // The penthouse floor (3) and the freezing air above it.
  const spots = [
    { f: 3, x: 320, up: 0 }, { f: 3, x: 560, up: 0 }, { f: 3, x: 1360, up: 0 }, { f: 3, x: 1600, up: 0 },
    { f: 3, x: 230, up: 120 }, { f: 3, x: 700, up: 130 }, { f: 3, x: 1250, up: 120 }, { f: 3, x: 1700, up: 130 },
  ];
  return (
    <WideLayer>
      {spots.map((g, i) => {
        const dx = Math.sin(t * 2.4 + i * 1.3) * 26 * rub;
        return <HailBall key={i} x={g.x + dx} y={floorY(IN_TOWER, g.f) - 46 - g.up} r={g.up ? 34 : 42} phase={i * 0.8} look={dx > 0 ? 0.6 : -0.6} mood="happy" />;
      })}
    </WideLayer>
  );
};

/**
 * THE BALLOON KID-CHECK: a round inset, bottom right — a kid's silhouette
 * rubbing a balloon on their hair in the dark, and the tiny snap. On screen
 * under the balloon clause of a1_32 only.
 */
const BalloonInset: React.FC<{ on: number }> = ({ on }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (on <= 0.01) return null;
  const t = frame / fps;
  const rubDx = Math.sin(t * 9) * 16;
  const snap = Math.sin(t * 5) > 0.7;
  const cx = 1600;
  const cy = 740;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, opacity: on, transform: `scale(${(0.9 + 0.1 * on).toFixed(3)})`, transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={210} fill="#1d2440" stroke={kidTheme.paper} strokeWidth={10} />
      <g fill={kidTheme.ink} stroke="none">
        <circle cx={cx - 30} cy={cy + 10} r={58} fill="#3a4466" />
        <path d={`M ${cx - 130} ${cy + 210} Q ${cx - 30} ${cy + 60} ${cx + 70} ${cy + 210} Z`} fill="#3a4466" />
      </g>
      {/* The kid's hair, standing up off the balloon. */}
      {[-2, -1, 0, 1].map((k) => (
        <path key={k} d={`M ${cx - 30 + k * 18} ${cy - 44} l ${k * 8 + rubDx * 0.3} -42`} stroke="#3a4466" strokeWidth={10} strokeLinecap="round" />
      ))}
      <ellipse cx={cx + 50 + rubDx} cy={cy - 90} rx={64} ry={76} fill="#e8556a" />
      <path d={`M ${cx + 50 + rubDx} ${cy - 14} q -8 30 10 52`} stroke="#e8556a" strokeWidth={5} fill="none" />
      <ellipse cx={cx + 28 + rubDx} cy={cy - 118} rx={14} ry={22} fill="#ffffff" opacity={0.5} />
      {snap ? <path d={`M ${cx - 4} ${cy - 70} l 14 -16 l 8 14 l 14 -16`} stroke="#fff3a0" strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
    </svg>
  );
};

const S7_BUBBLES: Record<string, string> = {
  a1_31_cloudia: "WHY IS MY HAIR DOING THAT.",
  a1_34_cloudia: "THE LIFT IS FULL OF CRACKLE.",
  a1_35_sunny: "THE CRACKLE IS NOT MINE.",
};

/** Sunny's glow on the section's edge — top right, through the cloud wall. */
const IN_GLOW = { x: 1880, y: 70 } as const;

const StaticScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [balloonFrom, balloonTo] = lineWindow(scene, "a1_32_narrator");
  const [wordFrom, wordTo] = lineWindow(scene, "a1_33_narrator");
  const [faultFrom, faultTo] = lineWindow(scene, "a1_34_cloudia");
  const [writtenFrom] = lineWindow(scene, "a1_36_narrator");
  const hair = interpolate(frame, [4, 44], [0.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeOutBack });
  // The balloon clause: "Rub a balloon on your hair, in the dark, and pull it
  // away. That tiny snap is this." — about 35% to 85% of a1_32.
  const span = balloonTo - balloonFrom;
  const balloon = interpolate(
    frame,
    [balloonFrom + span * 0.33, balloonFrom + span * 0.38, balloonFrom + span * 0.9, balloonFrom + span * 0.95],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // STATIC lands on the word: "It has a name. Static." — the last ~40% of
  // a1_33, and holds a while (a card outlasts its sentence).
  const cardFrom = wordFrom + Math.round((wordTo - wordFrom) * 0.58);
  const charge = interpolate(frame, [faultFrom + 20, faultTo - 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine });
  const walk = interpolate(frame, [0, scene.durationInFrames], [0, 1], { easing: kidEase.easeInOutSine });
  const cloudia: Mark = {
    x: 360 + 300 * walk,
    y: stand("cloudia", floorY(IN_TOWER, S78_CLOUDIA_FLOOR)) + 50,
    scale: S78_CLOUDIA_SCALE,
    who: "cloudia",
    side: "right",
    offset: 360,
  };
  const glow: Mark = { x: IN_GLOW.x - 120, y: IN_GLOW.y + 160, scale: 1, who: "boom", lift: 0, side: "left", offset: 340 };
  const cloudiaEmotion = useEmotion(scene, "cloudia", { a1_31_cloudia: "amazed", a1_34_cloudia: "skeptical" }, "neutral");
  return (
    <HotelWorld
      mode="tower"
      phase={0}
      tower={{ spec: IN_TOWER, floors: IN_TOWER.count, roof: 1, lift: 0.6, crackle: 0.45 + 0.55 * charge, charge }}
      overlay={
        <>
          <BalloonInset on={balloon} />
          <WordCard text="STATIC" from={cardFrom} until={cardFrom + 120} y={250} bannerColor="#7b5cc4" sub="a little crackle" />
          <Bubbles scene={scene} cast={{ cloudia, sunny: glow }} text={S7_BUBBLES} />
        </>
      }
    >
      <IcyGuests rub={1} />
      <Cloudia
        x={cloudia.x}
        y={cloudia.y}
        scale={S78_CLOUDIA_SCALE}
        phase={PHASE.cloudia}
        fill={0.5}
        clipboard
        emotion={cloudiaEmotion}
        speaking={stage.speaking("cloudia")}
        look={frame >= writtenFrom ? "down" : frame >= faultFrom ? "upRight" : "up"}
      />
      <StaticHair x={cloudia.x} y={cloudia.y} scale={S78_CLOUDIA_SCALE} amount={hair} />
      <SunnyGlow x={IN_GLOW.x} y={IN_GLOW.y} r={150} speaking={stage.speaking("sunny")} />
    </HotelWorld>
  );
};

const S8_BUBBLES: Record<string, string> = {
  a1_37_puff: "Going up.",
  a1_38_drip: "I am bigger again!",
  a1_39_cloudia: "YOU ARE ENORMOUS, DARLING.",
  a1_41_cloudia: "UP. DOWN. UP. A HOTEL.",
  a1_42_drip: "Is this the gala?",
  a1_43_cloudia: "Darling. I believe it is.",
  a1_44_cloudia: "The hotel cannot hold it, darling.",
};

/** Stony's loop up and down the tower: rides up the lift, drops a floor or four. */
function stonyLoop(frame: number): number {
  const P = 150;
  const u = (frame % P) / P;
  const lo = floorY(IN_TOWER, 0) - 60;
  const hi = floorY(IN_TOWER, 3) - 60;
  // Up slowly on the updraft (65%), down fast under gravity (35%).
  return u < 0.65 ? lo + (hi - lo) * kidEase.easeInOutSine(u / 0.65) : hi + (lo - hi) * kidEase.gravity((u - 0.65) / 0.35);
}

const GalaScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [, biggerTo] = lineWindow(scene, "a1_38_drip");
  const [holdFrom] = lineWindow(scene, "a1_44_cloudia");
  // Drip has just dropped a floor as the scene opens; Puff catches her on
  // "Going up." and she rides back to the penthouse, a coat thicker.
  const drop = interpolate(frame, [-10, 0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ride = interpolate(frame, [4, biggerTo], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine });
  const dripGround = floorY(IN_TOWER, 2) + (floorY(IN_TOWER, 3) - floorY(IN_TOWER, 2)) * ride * drop;
  const dripScale = 0.5 + 0.08 * ride;
  const drip: Mark = { x: IN_TOWER.x, y: stand("drip", dripGround), scale: dripScale, who: "drip", side: "right", offset: 300 };
  const puff: Mark = { x: IN_TOWER.x, y: hover("puff", dripGround + 90, 0.62), scale: 0.62, who: "puff", side: "right", offset: 300 };
  const cloudia: Mark = {
    x: 660,
    y: stand("cloudia", floorY(IN_TOWER, S78_CLOUDIA_FLOOR)) + 50,
    scale: S78_CLOUDIA_SCALE,
    who: "cloudia",
    side: "left",
    offset: 330,
  };
  // THE HUM: the crackle builds the whole scene; on the last line the whole
  // tower trembles a few pixels.
  const crackle = interpolate(frame, [0, scene.durationInFrames], [0.55, 1]);
  const hum = frame >= holdFrom ? Math.sin(frame * 2.1) * 3 : 0;
  const cloudiaEmotion = useEmotion(
    scene,
    "cloudia",
    { a1_39_cloudia: "amazed", a1_41_cloudia: "proud", a1_43_cloudia: "happy", a1_44_cloudia: "skeptical" },
    "proud",
  );
  return (
    <HotelWorld
      mode="tower"
      phase={0}
      cam={{ x: 960, y: 540, dx: hum }}
      tower={{ spec: IN_TOWER, floors: IN_TOWER.count, roof: 1, lift: 1, crackle, charge: 0.6 + 0.4 * crackle }}
      overlay={<Bubbles scene={scene} cast={{ drip, cloudia, puff }} text={S8_BUBBLES} />}
    >
      <IcyGuests rub={1} />
      <Stony x={IN_TOWER.x + 430} y={stonyLoop(frame)} r={58} />
      <Puff x={puff.x} y={puff.y} scale={0.62} opacity={0.5} phase={PHASE.puff} emotion="happy" speaking={stage.speaking("puff")} look="up" />
      <Drip x={drip.x} y={drip.y} scale={dripScale} phase={PHASE.drip} emotion={stage.speaking("drip") ? "excited" : "happy"} pose="cheer" shadow={false} speaking={stage.speaking("drip")} look="left" />
      <IceCoat x={drip.x} y={drip.y} scale={dripScale} on={1} />
      <Cloudia x={cloudia.x} y={cloudia.y} scale={S78_CLOUDIA_SCALE} phase={PHASE.cloudia} fill={0.55} clipboard emotion={cloudiaEmotion} speaking={stage.speaking("cloudia")} look="upRight" />
      <StaticHair x={cloudia.x} y={cloudia.y} scale={S78_CLOUDIA_SCALE} amount={1} />
    </HotelWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 9 — Somebody leaves through the wall. LIGHTNING. Boom is born.
// ---------------------------------------------------------------------------

/**
 * Where the crackle was — and where Boom is standing from the flash on. World
 * coords under `LOBBY_CAM` (visible world: x 289–1660, y 246–1017).
 */
const BIRTH = { x: 860, y: 680 } as const;
/** The hole Flash leaves in the lobby's left wall (on screen at ~x 150). */
const HOLE = { x: 400, y: 600, rx: 110, ry: 150 } as const;

const WallHole: React.FC<{ on: number }> = ({ on }) => {
  if (on <= 0.01) return null;
  const pts = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const k = i % 2 ? 0.82 : 1.06;
    return `${(HOLE.x + Math.cos(a) * HOLE.rx * k).toFixed(1)},${(HOLE.y + Math.sin(a) * HOLE.ry * k).toFixed(1)}`;
  }).join(" ");
  return (
    <WideLayer>
      <defs>
        <clipPath id="storm-wall-hole">
          <polygon points={pts} />
        </clipPath>
      </defs>
      <polygon points={pts} fill="#8d8aa0" transform={`translate(10 10)`} />
      <g clipPath="url(#storm-wall-hole)" opacity={on}>
        <rect x={HOLE.x - 300} y={HOLE.y - 300} width={600} height={360} fill="#f0cf5e" />
        <rect x={HOLE.x - 300} y={HOLE.y + 60} width={600} height={300} fill="#1f6a72" />
      </g>
      <polygon points={pts} fill="none" stroke="#77748a" strokeWidth={12} strokeLinejoin="round" />
    </WideLayer>
  );
};

const S9_BUBBLES: Record<string, string> = {
  a1_45_cloudia: "SOMEBODY LEFT THROUGH THE WALL!",
  a1_48_boom: "PRESENT!",
  a1_49_cloudia: "WHO IS MAKING THAT NOISE?",
  a1_50_boom: "I AM BOOM. THE NOISE.",
  a1_51_cloudia: "SHE DID NOT SIGN THE REGISTER.",
  a1_52_boom: "Where did she go?",
  a1_53_boom: "She is quick.",
  a1_54_boom: "I ALWAYS LEAVE WHEN SHE LEAVES.",
  a1_55_cloudia: "He did not check in, darling.",
};

const FlashBoomScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const FLASH_AT = 0;
  const [cardFrom] = lineWindow(scene, "a1_46_narrator");
  const [instantFrom] = lineWindow(scene, "a1_47_narrator");
  const [presentFrom] = lineWindow(scene, "a1_48_boom");
  const [whereFrom] = lineWindow(scene, "a1_52_boom");
  const [byeFrom, byeTo] = lineWindow(scene, "a1_54_boom");
  const [emptyFrom] = lineWindow(scene, "a1_55_cloudia");

  // THE CRACKLE in the walls before the jump, on the very first frames, then
  // the jump itself: Flash from where the crackle gathered out through the
  // left wall (to the sea far out — we see her go; the hole stays).
  // BOOM: standing where the crackle was from the same instant, small, tight
  // and sharp (distance 0). He walks out through her hole on a1_54, at his
  // one pace.
  const walk = interpolate(frame, [byeFrom + 30, byeTo + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const boomX = BIRTH.x + (HOLE.x - BIRTH.x) * walk;
  const gone = frame >= byeTo + 40;
  const boomScale = 1;
  const appear = interpolate(frame, [FLASH_AT + 2, FLASH_AT + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeOutBack });
  const cast: Cast = { cloudia: DESK_CLOUDIA };
  const cloudiaEmotion = useEmotion(
    scene,
    "cloudia",
    { a1_45_cloudia: "amazed", a1_49_cloudia: "skeptical", a1_51_cloudia: "grumpy", a1_55_cloudia: "sad" },
    "neutral",
  );
  const boomEmotion = useEmotion(scene, "boom", { a1_48_boom: "excited", a1_50_boom: "happy", a1_52_boom: "amazed", a1_54_boom: "happy" }, "happy", NO_LEAD);
  const boomLook =
    frame >= whereFrom - 4 && frame < byeFrom
      ? ("left" as const)
      : stage.speaking("cloudia")
        ? ("right" as const)
        : ("camera" as const);
  return (
    <HotelWorld
      mode="lobby"
      phase={0.4}
      cam={LOBBY_CAM}
      flashes={[FLASH_AT]}
      overlay={
        <>
          <WordCard text="LIGHTNING" from={cardFrom + 6} until={instantFrom + 30} y={230} bannerColor="#2f6fd6" />
          <Bubbles
            scene={scene}
            cast={{
              ...onLobby({ cloudia: cast.cloudia }),
              // Boom's mark is built in SCREEN space (his `lift` comes from his
              // drawn radius, which a projection would not rescale).
              boom: boomMark(
                LOBBY_CAM.x + (boomX - LOBBY_CAM.x) * (LOBBY_CAM.zoom ?? 1),
                LOBBY_CAM.y + (BIRTH.y - LOBBY_CAM.y) * (LOBBY_CAM.zoom ?? 1),
                boomScale * (LOBBY_CAM.zoom ?? 1),
                0,
                "right",
                320,
              ),
            }}
            text={S9_BUBBLES}
          />
        </>
      }
    >
      <WallHole on={frame >= FLASH_AT ? 1 : 0} />
      <Cloudia
        x={DESK_CLOUDIA.x}
        y={DESK_CLOUDIA.y}
        scale={DESK_CLOUDIA.scale}
        phase={PHASE.cloudia}
        fill={0.55}
        emotion={cloudiaEmotion}
        speaking={stage.speaking("cloudia")}
        look={frame < 70 ? "left" : gone ? "left" : "left"}
      />
      <StaticHair x={DESK_CLOUDIA.x} y={DESK_CLOUDIA.y} scale={DESK_CLOUDIA.scale} amount={interpolate(frame, [0, 20, 200], [1, 1, 0.3], { extrapolateRight: "clamp" })} />
      <FrontDesk />
      <LobbyGuests look={-0.8} />
      {!gone ? (
        <Boom
          x={boomX}
          y={hover("boom", BIRTH.y, boomScale * appear)}
          scale={boomScale * Math.max(0.01, appear)}
          distance={0}
          phase={PHASE.boom}
          walking={walk > 0 && walk < 1 ? 1 : 0}
          heading={180}
          burstAt={presentFrom}
          emotion={boomEmotion}
          speaking={stage.speaking("boom")}
          look={boomLook}
          opacity={1 - interpolate(walk, [0.85, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      ) : null}
      <div style={{ position: "absolute", inset: 0 }}>
        <Flash at={FLASH_AT} from={{ x: BIRTH.x + 20, y: BIRTH.y - 260 }} to={{ x: HOLE.x - 30, y: HOLE.y + 10 }} weight={0.9} />
      </div>
    </HotelWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 10 — The same nine seconds, from the window
// ---------------------------------------------------------------------------

const SameNineScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [lateFrom] = lineWindow(scene, "a1_60_narrator");
  const run = countRuns(scene)[0];
  // HARD CUT, fingers ALREADY up: the number before the first one this scene
  // says. Indifferent to which numbers it rejoins at (the six-count fallback
  // re-aliases a1_56–a1_58 to "Four. Five. Six." and this still reads right).
  const firstN = COUNT_OF[run.keys[0]];
  const before = firstN - 1;
  const counted = fingersAt(scene, frame, { before });
  const down = interpolate(frame, [lateFrom + 20, lateFrom + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine });
  // The sound left with the flash `before` counts ago: the rings are already
  // that far across the bay.
  const virtualFlash = run.from - before * COUNT_GRID - FLASH_BEFORE_COUNT;
  const u = (frame - virtualFlash) / (run.arrive - virtualFlash);
  const hum = interpolate(frame, [run.arrive - 2, run.arrive + 6, run.arrive + 40], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <WindowWorld
      bg="bay_through_window_yellow"
      sky="yellow"
      phase={1.3}
      hotel={{ ...FAR_HOTEL, grow: 1, tone: "heavy", crackle: 0.4 }}
      outside={<SoundRings u={u} count={run.count} />}
      kid={{ ...KID_AT_WINDOW, fingers: counted * down }}
      ripple={hum}
      rattle={hum}
    />
  );
};

export const ACT1_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s03_lift: LiftScene,
  s04_check_in: CheckInScene,
  s05_vertical: VerticalScene,
  s06_penthouse: PenthouseScene,
  s07_static: StaticScene,
  s08_gala: GalaScene,
  s09_flash_boom: FlashBoomScene,
  s10_same_nine: SameNineScene,
};
