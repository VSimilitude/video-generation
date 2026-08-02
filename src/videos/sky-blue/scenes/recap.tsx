import React from "react";
import { kidInkOutline, mixHex } from "../../../lib/kid";
import {
  ACT_COLOR,
  AbsoluteFill,
  Bubbles,
  Camera,
  HEIGHT,
  PHASE,
  PaintedSky,
  Puff,
  RAY_LIGHT,
  RAY_SPECTRUM,
  Ray,
  SPECTRUM,
  SoftShade,
  Sunny,
  WIDTH,
  WideLayer,
  heldBeat,
  hover,
  interpolate,
  kidEase,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  lineWindow,
  plateY,
  spring,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cam,
  type Cast,
  type Mark,
  type PlateKey,
  type Stage,
  type TimedScene,
} from "./common";
import {
  Globe,
  NO_LEAD,
  SEA_DRIFT,
  SEA_DUSK_FRAC,
  SleepingVolcano,
  VOLCANO_AT,
  clamp01,
} from "./act3";

// RECAP — Scenes 32–35 of script.md. Chant, mind-blower, tease.
//
//   s32  THREE-way split screen, not four: there are three Big Words and three
//        characters, and the Narrator takes the summary instead of a word.
//        Panels are dressed from `ACT_COLOR` — and Ray's panel is the one place
//        in the episode that draws `SPECTRUM` literally, because "rainbow
//        spectrum" as a single banner colour is a smear (see the ACT_COLOR note
//        in common.tsx).
//   s33  a slow turning globe, then a push down through it to an ordinary
//        street under an ordinary blue sky. Plate: street_day. Hold long enough
//        for a parent to photograph the three words stacked in the corner.
//   s34  THE MIND-BLOWER, and the best picture in the episode: an astronaut in
//        blinding sunlight with a crisp black shadow, a bright grey landscape,
//        and a completely black starry sky above it. Plate: moon_surface, whose
//        top half is genuinely black — that is the whole fact. The astronaut,
//        their shadow and the blue-marble Earth are SVG over it. Keep it
//        wondrous: the astronaut waves, and nothing in the shot is frightening.
//   s35  the tease. Scene 26's exact framing at dusk (plate: sea_dusk), the
//        volcano still asleep, one smoke ring coming out **wobbling** and not
//        closing, a low rumble in the water. **Wondrous, not frightening** —
//        no dark chord, no red glow, no shaking camera. Then Sunny, half under
//        the horizon, claiming the volcano — the gag's standard firing, not the
//        inversion the delivered cut had (that is banked for ep 4). Emotion
//        lead 0 on `rc_18_sunny`, and a new Narrator line after him.
//
// See the volcano rule at the top of act3.tsx before touching s35.

const W = WIDTH;
const H = HEIGHT;

// ---------------------------------------------------------------------------
// Scene 32 — The chant
// ---------------------------------------------------------------------------
//
// Three panels, one per Big Word, one per character — and the Narrator, who has
// three words and three characters to fit and therefore takes the summary
// instead of a word. Each panel lights as its character takes theirs and stays
// lit, so the last line plays over all three at once, which is the shape of the
// recap: the episode, reassembled, in one frame.

const PANEL_W = W / 3;

type Panel = {
  key: Extract<Stage, "ray" | "puff" | "sunny">;
  line: string;
  word: string;
  color: string;
  plate: PlateKey;
};

const PANELS: Panel[] = [
  { key: "ray", line: "rc_02_ray", word: "RAINBOW", color: ACT_COLOR.rainbow, plate: "garden_day" },
  { key: "puff", line: "rc_03_puff", word: "SCATTER", color: ACT_COLOR.scatter, plate: "sky_dome_day" },
  { key: "sunny", line: "rc_04_sunny", word: "SUNSET", color: ACT_COLOR.sunset, plate: "sea_sunset" },
];

const ChantScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const windows = {
    ray: lineWindow(scene, "rc_02_ray"),
    puff: lineWindow(scene, "rc_03_puff"),
    sunny: lineWindow(scene, "rc_04_sunny"),
  };

  return (
    <AbsoluteFill style={{ background: kidTheme.ink }}>
      {PANELS.map((p, i) => {
        const [from] = windows[p.key];
        // A panel lights as its character takes the word and **stays lit**: by
        // the Narrator's summary all three are up, which is the sentence
        // "Rainbow. Scatter. Sunset." drawn.
        const live = frame >= from - 8;
        return (
          <ChantPanel
            key={p.key}
            panel={p}
            index={i}
            live={live}
            slam={from + 4}
            speaking={stage.speaking(p.key)}
          />
        );
      })}
      {/* Grid lines, so three pictures read as one split screen. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          boxShadow: `inset 0 0 0 10px ${kidTheme.ink}`,
        }}
      />
      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: PANEL_W * i - 5,
            top: 0,
            width: 10,
            height: H,
            background: kidTheme.ink,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const ChantPanel: React.FC<{
  panel: Panel;
  index: number;
  live: boolean;
  slam: number;
  speaking: boolean;
}> = ({ panel, index, live, slam, speaking }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordIn = spring({ frame: frame - slam, fps, config: { damping: 11, mass: 0.7 } });
  const flash = live ? Math.max(0, 1 - (frame - slam) / 10) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: index * PANEL_W,
        top: 0,
        width: PANEL_W,
        height: H,
        overflow: "hidden",
      }}
    >
      <PaintedSky bg={panel.plate} drift={7} phase={index * 2.3} />
      <PanelCast who={panel.key} speaking={speaking} live={live} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(36,52,71,${live ? 0 : 0.55})`,
          pointerEvents: "none",
        }}
      />
      {live ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: `inset 0 0 0 12px ${panel.color}`,
            pointerEvents: "none",
          }}
        />
      ) : null}
      {live && wordIn > 0.002 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 44,
            display: "flex",
            justifyContent: "center",
            fontFamily: kidTheme.fontFamily,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: panel.color,
              border: `9px solid ${kidTheme.ink}`,
              borderRadius: kidRadius.banner,
              padding: "8px 26px",
              fontSize: 66,
              fontWeight: 900,
              letterSpacing: -1,
              color: kidTheme.paper,
              textShadow: kidInkOutline(2),
              whiteSpace: "nowrap",
              boxShadow: kidShadow(1.1),
              transform: `scale(${0.5 + 0.5 * wordIn}) rotate(${-1.5 + (1 - wordIn) * 6}deg)`,
            }}
          >
            {panel.word}
          </div>
        </div>
      ) : null}
      {flash > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, background: "#ffffff", opacity: flash * 0.7 }} />
      ) : null}
    </div>
  );
};

/**
 * One character inside a 640×1080 panel.
 *
 * Ray's panel is **the one place in the episode that draws `SPECTRUM`
 * literally** (common.tsx's `ACT_COLOR` note): his banner colour is an indigo,
 * because seven stops behind seven white letters is a smear, so the rainbow
 * reading has to come from what he is standing in front of.
 */
const PanelCast: React.FC<{ who: Panel["key"]; speaking: boolean; live: boolean }> = ({
  who,
  speaking,
  live,
}) => {
  const frame = useCurrentFrame();
  const cx = PANEL_W / 2;
  const bob = Math.sin(frame / 14 + (who === "puff" ? 1.4 : who === "sunny" ? 3.4 : 0)) * 8;
  return (
    <>
      {who === "ray" ? <PanelRainbow cx={cx} /> : null}
      {who === "ray" ? (
        <Ray
          x={cx}
          y={hover("ray", 520 + bob, 1.25)}
          scale={1.25}
          brightness={RAY_LIGHT.full}
          spectrum={RAY_SPECTRUM.afterRainbow}
          phase={PHASE.ray}
          emotion={live ? "excited" : "happy"}
          speaking={speaking}
          look="camera"
          pose={speaking ? "cheer" : "rest"}
          streak={0.2}
          zIndex={20}
        />
      ) : null}
      {who === "puff" ? (
        <Puff
          x={cx}
          y={hover("puff", 540 + bob, 1.5)}
          scale={1.5}
          opacity={0.9}
          phase={PHASE.puff}
          emotion={live ? "excited" : "happy"}
          speaking={speaking}
          look="camera"
          pose={speaking ? "cheer" : "rest"}
          wisps={2}
          zIndex={20}
        />
      ) : null}
      {who === "sunny" ? (
        <Sunny
          x={cx}
          y={hover("sunny", 520 + bob, 1.2)}
          scale={1.2}
          phase={PHASE.sunny}
          emotion={live ? "proud" : "happy"}
          speaking={speaking}
          look="camera"
          raySpeed={live ? 0.3 : 0.12}
          zIndex={20}
        />
      ) : null}
    </>
  );
};

/** Seven arcs behind Ray, red on the outside — the spectrum, literally. */
const PanelRainbow: React.FC<{ cx: number }> = ({ cx }) => (
  <svg
    width={PANEL_W}
    height={H}
    viewBox={`0 0 ${PANEL_W} ${H}`}
    style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
  >
    {SPECTRUM.map((c, i) => {
      const r = 330 - i * 30;
      return (
        <path
          key={c.name}
          d={`M ${cx - r} 760 A ${r} ${r * 0.96} 0 0 1 ${cx + r} 760`}
          stroke={c.fill}
          strokeWidth={26}
          fill="none"
          strokeLinecap="round"
          opacity={0.92}
        />
      );
    })}
  </svg>
);

// ---------------------------------------------------------------------------
// Scene 33 — Right now, over everybody's house
// ---------------------------------------------------------------------------
//
// The claim that makes the episode portable, and the one shot in it built for a
// **parent with a phone**: the three words stack in the corner and stay there,
// unmoving, for the whole back half of the scene and the whole tail.

const S33_WORDS = [
  { text: "RAINBOW", color: ACT_COLOR.rainbow },
  { text: "SCATTER", color: ACT_COLOR.scatter },
  { text: "SUNSET", color: ACT_COLOR.sunset },
] as const;

const RightNowScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [, globeTo] = lineWindow(scene, "rc_06_narrator");
  const [wordsFrom] = lineWindow(scene, "rc_07_narrator");

  // Down through the daylight side: the globe races towards the camera and the
  // street is already there behind it. A push rather than a cut, because the
  // sentence is "over YOUR house" and a cut would make it two places.
  const dive = kidEase.easeInOutSine((frame - globeTo + 34) / 56);
  const spin = (frame / fps) * 0.05;

  return (
    <AbsoluteFill style={{ background: "#0a1430" }}>
      {/* Same star field Scene 31 ended in, so this is the same planet two
          scenes later rather than a diagram of one. */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp01((dive - 0.3) / 0.3) }}>
        <PaintedSky bg="space_stars" drift={0} phase={4.8} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: clamp01((dive - 0.42) / 0.34) }}>
        <PaintedSky bg="street_day" drift={9} phase={3.1} />
      </div>

      {/* The planet, coming at us. Its blue edge is the same shell of air Scene
          31 pulled back to look at — and it grows until the frame is inside it,
          which is what "over everybody's house" means geometrically. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - clamp01((dive - 0.5) / 0.3),
        }}
      >
        <Globe
          cx={960}
          cy={540 + dive * 240}
          r={330 + kidEase.easeInQuad(dive) * 5200}
          spin={spin}
          // Almost fully lit and facing us: this is the *daylight* side, which
          // is the only side the line is about.
          phase={0.88}
          dawn={1}
        />
      </div>

      <ThreeWords from={wordsFrom} />
    </AbsoluteFill>
  );
};

/** The three Big Words, stacked in the corner, still enough to photograph. */
const ThreeWords: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 86,
        top: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 20,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      {S33_WORDS.map((w, i) => {
        const s = spring({ frame: frame - from - i * 9, fps, config: { damping: 12, mass: 0.7 } });
        return (
          <div
            key={w.text}
            style={{
              background: w.color,
              border: `9px solid ${kidTheme.ink}`,
              borderRadius: kidRadius.banner,
              padding: "10px 34px",
              fontSize: 84,
              fontWeight: 900,
              letterSpacing: 1,
              color: kidTheme.paper,
              textShadow: kidInkOutline(2.5),
              boxShadow: kidShadow(1.2),
              transform: `scale(${Math.max(0, s)}) rotate(${-2 + (1 - s) * 8}deg)`,
              transformOrigin: "0% 50%",
            }}
          >
            {w.text}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 34 — The mind-blower
// ---------------------------------------------------------------------------
//
// The best picture in the episode and the episode's **proof**: same sunlight,
// no air, no blue. Everything in the shot is doing one of two jobs — saying
// "this is bright daylight" (the hard light on the suit, the crisp shadow, the
// blazing grey ground) or saying "the sky is black" (three quarters of the
// frame, and the plate does it for free).
//
// It also has to be *wondrous*. The astronaut waves, the Earth hangs there like
// a marble, nothing is in shadow that does not have to be, and there is not one
// element in the frame a six-year-old could read as danger.

const S34_ASTRO = { x: 660, ground: 892, scale: 1 };

/**
 * **Sunny, in a black sky, in the middle of the day** — the punch-up's C4.
 *
 * He costs no new set, and that is the whole argument for him: the astronaut is
 * lit hard from frame right with a crisp black shadow lying to the left, so
 * something is already doing the lighting and the frame's top-right corner is
 * where it has to be. The existing wave — the right arm, going up and to the
 * right, inside the two-second hold — was already pointing at this mark before
 * anybody put a face on it.
 *
 * Two consequences the picture had to absorb, both noted here because a later
 * reader will otherwise "fix" them:
 *
 *   - **The Earth moved to the top *left*.** It was at (1682, 202), which is
 *     inside Sunny. The marble is unchanged in every other way and the black is
 *     as empty on one side as the other; what the swap buys is the two round
 *     objects on opposite sides of the frame instead of stacked in one corner.
 *   - **Ray shifted left**, from x=1360 to x=1210, for the same reason and by
 *     the smallest amount that clears Sunny's rays.
 */
const S34_SUNNY = { x: 1706, y: 214, scale: 1.22 } as const;

const S34_BUBBLES: Record<string, string> = {
  rc_11_ray: "Black? In the daytime? Why?",
  // A summary, not a transcript: the clip is "So the blue sky is a thing the
  // AIR does." Six words is the ceiling and this is five.
  rc_14_ray: "The AIR does the blue!",
  rc_09b_sunny: "That is ME!",
  rc_11b_sunny: "I am RIGHT HERE!",
};

const MindBlowerScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, blackTo] = lineWindow(scene, "rc_10_narrator");
  const [beatFrom, beatTo] = heldBeat(scene, "rc_10_narrator");

  // NOTE: nothing is drawn on the plate's horizon and nothing should be. The
  // hard line between blazing grey ground and solid black *is* the scene's
  // fact, and the one thing a still caught arguing with the narration was a
  // faint haze band laid along it: `moon_surface`'s horizon is a curve and a
  // straight band across it reads as a seam. `MOON_FRAC` is measured in
  // act3.tsx if a later pass ever needs to seat something on it.

  // The wave. It happens *inside* the two-second hold, because the hold is two
  // seconds of an impossible photograph and the one friendly thing in it should
  // be the thing that moves.
  const waveU = clamp01((frame - beatFrom - 8) / Math.max(1, (beatTo - beatFrom) * 0.8));
  const wave = waveU > 0 && waveU < 1 ? Math.sin(waveU * Math.PI * 3.4) : 0;

  // A very slow push in across the whole scene: fifteen seconds on one picture
  // otherwise reads as a photograph with a voice over it.
  const zoom = interpolate(frame, [0, scene.durationInFrames], [1, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam: Cam = { x: S34_ASTRO.x + 220, y: 640, zoom };

  const stage = useStage(scene);
  const emotion = useEmotion(
    scene,
    "ray",
    { rc_11_ray: "amazed", rc_14_ray: "excited" },
    "happy",
    // 60f held beat in this scene.
    NO_LEAD,
  );

  // --- Sunny in the lunar sky (punch-up C4) --------------------------------
  const [claimFrom, claimTo] = lineWindow(scene, "rc_09b_sunny");
  const [whereFrom, whereTo] = lineWindow(scene, "rc_11b_sunny");
  // The blaze is on from the first frame; the *face* arrives on his line, which
  // is the ep-2 crayon-sun trick — the thing already lighting the shot turns out
  // to be somebody.
  const faceUp = kidEase.easeInOutSine((frame - claimFrom) / 18);
  // **The 60f hold is sacred and he is in it.** He blazes and he does not move,
  // react or change expression for two full seconds — so his idle is ramped to
  // nothing across the beat rather than switched, and his rays do not spin at
  // all in this scene (nothing shimmers where there is no air).
  const holdStill =
    kidEase.easeInOutSine((frame - beatFrom) / 12) *
    (1 - kidEase.easeInOutSine((frame - beatTo) / 12));
  const sunnyEmotion = useEmotion(
    scene,
    "sunny",
    // Nothing changes inside [beatFrom, beatTo): the claim lands 130 frames
    // before it and the objection 100 frames after.
    { rc_09b_sunny: "proud", rc_11b_sunny: "amazed" },
    "proud",
    NO_LEAD,
  );

  const rayMark: Mark = {
    x: 1210,
    y: hover("ray", 372, 0.6),
    scale: 0.6,
    who: "ray",
    side: "left",
  };
  const sunnyMark: Mark = {
    x: S34_SUNNY.x,
    y: hover("sunny", S34_SUNNY.y, S34_SUNNY.scale),
    scale: S34_SUNNY.scale,
    who: "sunny",
    side: "left",
  };

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <PaintedSky bg="moon_surface" drift={7} phase={5.5} zoom={zoom} />
      <Camera cam={cam}>
        <MoonWorld
          x={S34_ASTRO.x}
          ground={S34_ASTRO.ground}
          scale={S34_ASTRO.scale}
          wave={wave}
        />
      </Camera>

      {/* Earth, out in the black. Small, and the one warm blue thing up there —
          which is the joke: the blue is over *there*, because that is where the
          air is. **Top left since C4**; see `S34_SUNNY`. */}
      <BlueMarble x={286} y={196} r={104} />

      {/* The thing that has been lighting this shot all along. The blaze is on
          from frame one; Sunny fades up inside it on his own line. Both live
          outside the `Camera`, like Ray and the marble, so the slow push-in does
          not drag the sky about. */}
      <LunarBlaze x={S34_SUNNY.x} y={S34_SUNNY.y + 40} />
      <div style={{ position: "absolute", inset: 0, opacity: clamp01(faceUp) }}>
        <Sunny
          x={sunnyMark.x}
          y={sunnyMark.y}
          scale={S34_SUNNY.scale}
          phase={PHASE.sunny}
          emotion={sunnyEmotion}
          speaking={stage.speaking("sunny")}
          look={
            frame >= claimFrom && frame < claimTo
              ? // Down at the astronaut he has just claimed.
                { x: -0.55, y: 0.5 }
              : frame >= whereFrom && frame < whereTo
                ? { x: -0.3, y: 0.35 }
                : "camera"
          }
          // No spin: there is no air here and nothing in this frame shimmers.
          raySpeed={0}
          idle={1 - 0.9 * holdStill}
          eyeLife={1 - holdStill}
          zIndex={20}
        />
      </div>

      {/* He is a warm white body on a black sky, which is the one background in
          the episode he is easy to see against — so no `SoftShade` here, and
          the shade goes under the *astronaut* instead, where the ground is at
          its brightest. */}
      <Ray
        x={rayMark.x}
        y={rayMark.y}
        scale={0.6}
        brightness={RAY_LIGHT.full}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={emotion}
        speaking={stage.speaking("ray")}
        look={frame < blackTo ? { x: -0.2, y: 0.6 } : { x: -0.4, y: 0.2 }}
        streak={0.35}
        bank={-4}
        zIndex={30}
      />

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark, sunny: sunnyMark } as Cast}
        text={S34_BUBBLES}
        at={{
          rc_11_ray: { x: 1000, y: 190, tail: "right", tailAt: rayMark.x },
          rc_14_ray: { x: 1000, y: 190, tail: "right", tailAt: rayMark.x },
          // Under him rather than above: his crown is off the top of the frame,
          // and a bubble clamped to y=170 would sit across his own rays.
          rc_09b_sunny: { x: 1250, y: 640, tail: "right", tailAt: S34_SUNNY.x - 90 },
          rc_11b_sunny: { x: 1250, y: 640, tail: "right", tailAt: S34_SUNNY.x - 90 },
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * The astronaut, their shadow, and the ground they are standing on.
 *
 * The shadow is the piece of direction that matters. On Earth a shadow has a
 * soft edge because the *sky* is a second light source — which is the whole
 * mechanism this episode has spent nine minutes on. There is no sky here, so
 * the shadow is a hard-edged black polygon with no penumbra at all, and it is
 * the same fact as the black sky said a second way.
 */
const MoonWorld: React.FC<{
  x: number;
  ground: number;
  scale: number;
  wave: number;
}> = ({ x, ground, scale, wave }) => (
  <WideLayer zIndex={12}>
    {/* Hard light from frame right, so the shadow lies to the left. */}
    <path
      d={
        `M ${x - 60} ${ground + 6} L ${x - 760} ${ground + 92}` +
        ` L ${x - 700} ${ground + 128} L ${x + 70} ${ground + 30} Z`
      }
      fill="#0b0d12"
      opacity={0.88}
    />
    <ellipse cx={x} cy={ground + 12} rx={92 * scale} ry={18 * scale} fill="#0b0d12" opacity={0.5} />

    <g transform={`translate(${x} ${ground}) scale(${scale})`}>
      {/* Legs and boots. */}
      <path d="M -34 -132 L -46 -14 M 34 -132 L 48 -14" stroke="#e9edf2" strokeWidth={52} strokeLinecap="round" />
      <path d="M -34 -132 L -46 -14 M 34 -132 L 48 -14" stroke={kidTheme.ink} strokeWidth={58} strokeLinecap="round" opacity={0.12} />
      <rect x={-78} y={-22} width={64} height={26} rx={12} fill="#c9d3dd" stroke={kidTheme.ink} strokeWidth={6} />
      <rect x={22} y={-22} width={64} height={26} rx={12} fill="#c9d3dd" stroke={kidTheme.ink} strokeWidth={6} />

      {/* Life-support pack, behind. */}
      <rect x={-96} y={-320} width={54} height={150} rx={20} fill="#b9c4d0" stroke={kidTheme.ink} strokeWidth={7} />

      {/* Body. */}
      <rect x={-70} y={-336} width={140} height={214} rx={54} fill="#f2f5f8" stroke={kidTheme.ink} strokeWidth={8} />
      {/* Chest control box, one friendly detail. */}
      <rect x={-38} y={-268} width={76} height={52} rx={14} fill="#c9d3dd" stroke={kidTheme.ink} strokeWidth={6} />
      <circle cx={-16} cy={-242} r={8} fill={kidTheme.mint} />
      <circle cx={12} cy={-242} r={8} fill={kidTheme.sun} />

      {/* Arms. The right one waves; the left hangs. */}
      <path d="M -66 -300 q -66 40 -74 108" stroke="#f2f5f8" strokeWidth={44} strokeLinecap="round" fill="none" />
      <path
        d={`M 66 -300 q ${74 + wave * 16} ${-38 + wave * 26} ${96 + wave * 22} ${-96 + wave * 34}`}
        stroke="#f2f5f8"
        strokeWidth={44}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={166 + wave * 24} cy={-398 + wave * 36} r={27} fill="#f2f5f8" stroke={kidTheme.ink} strokeWidth={7} />

      {/* Helmet: a clear dome, a gold visor, and the sun in it. */}
      <circle cx={0} cy={-398} r={92} fill="#eef3f8" stroke={kidTheme.ink} strokeWidth={9} />
      <path
        d="M -68 -404 a 68 62 0 0 1 136 0 a 68 62 0 0 1 -136 0 Z"
        fill={mixHex(kidTheme.sun, kidTheme.ink, 0.35)}
        stroke={kidTheme.ink}
        strokeWidth={6}
      />
      <ellipse cx={-28} cy={-424} rx={22} ry={13} fill="#ffffff" opacity={0.75} transform="rotate(-16 -28 -424)" />
      {/* The hard sun-side rim on the helmet and the shoulder. */}
      <path d="M 62 -452 a 92 92 0 0 1 14 96" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.9} />
    </g>

    {/* Two small rocks and a footprint trail, so the ground has a scale. */}
    {[
      [x + 470, ground + 76, 46],
      [x - 300, ground + 150, 30],
    ].map(([rx, ry, rr]) => (
      <g key={rx}>
        <ellipse cx={rx - rr * 1.5} cy={ry + rr * 0.32} rx={rr * 1.5} ry={rr * 0.3} fill="#0b0d12" opacity={0.8} />
        <path
          d={`M ${rx - rr} ${ry + rr * 0.3} q ${rr * 0.2} ${-rr * 1.1} ${rr} ${-rr * 0.95} q ${rr * 0.9} ${rr * 0.1} ${rr} ${rr * 0.95} Z`}
          fill="#cfd6dd"
          stroke={kidTheme.ink}
          strokeWidth={5}
        />
      </g>
    ))}
    {/* Footprints, trailing away to the **right** — i.e. the opposite side from
        the shadow. They started on the shadow's side, and at full resolution a
        row of pale grey ovals lying inside a hard black shadow reads as holes
        in it rather than as prints in the dust. */}
    {Array.from({ length: 6 }, (_, i) => (
      <ellipse
        key={i}
        cx={x + 176 + i * 104}
        cy={ground + 58 + i * 26}
        rx={26}
        ry={10}
        fill="#9aa4ae"
        opacity={0.42}
        transform={`rotate(6 ${x + 176 + i * 104} ${ground + 58 + i * 26})`}
      />
    ))}
  </WideLayer>
);

/**
 * The sun, from the Moon: a hard white disc with no sky around it.
 *
 * On Earth the sun is a smear, because the air scatters its light across the
 * whole dome — which is the episode. Here there is nothing to scatter on, so
 * the glow stops dead a little way out and the black starts, and the stars are
 * still visible right up against it. That contradiction is the scene's fact
 * drawn a third way, after the black sky and the hard-edged shadow.
 */
const LunarBlaze: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle 460px at ${x}px ${y}px, rgba(255,244,214,0.95) 0%, rgba(255,224,138,0.55) 22%, rgba(255,196,80,0.22) 40%, rgba(255,180,60,0.07) 58%, rgba(255,180,60,0) 72%)`,
      pointerEvents: "none",
      zIndex: 6,
    }}
  />
);

/** Earth from the Moon: the blue marble, and where all the air went. */
const BlueMarble: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 8 }}
    >
      <circle cx={x} cy={y} r={r * 1.16} fill={kidTheme.skyMid} opacity={0.22} />
      <circle cx={x} cy={y} r={r} fill="#2f7fd0" />
      <g opacity={0.9}>
        <ellipse cx={x - r * 0.3} cy={y - r * 0.28} rx={r * 0.34} ry={r * 0.22} fill="#5cb765" transform={`rotate(${-14 + Math.sin(t * 0.2) * 2} ${x - r * 0.3} ${y - r * 0.28})`} />
        <ellipse cx={x + r * 0.28} cy={y + r * 0.18} rx={r * 0.26} ry={r * 0.3} fill="#5cb765" />
        <ellipse cx={x - r * 0.1} cy={y + r * 0.6} rx={r * 0.4} ry={r * 0.16} fill="#eef4fa" opacity={0.7} />
        <ellipse cx={x + r * 0.34} cy={y - r * 0.56} rx={r * 0.3} ry={r * 0.13} fill="#eef4fa" opacity={0.6} />
      </g>
      {/* The shell of air, edge on, one more time. */}
      <circle cx={x} cy={y} r={r + 5} fill="none" stroke={kidTheme.skyMid} strokeWidth={7} opacity={0.5} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 35 — Tease and sign-off
// ---------------------------------------------------------------------------
//
// **Scene 26's exact framing, at dusk**, which is why the camera arithmetic
// below is Scene 26's with `settle` pinned at 1: the audience has seen this
// shot before, ten minutes ago, and the whole tease is that it is the same shot
// and something in it is different.
//
// Three rules, and all three are about restraint:
//
//   - **Wondrous, not frightening.** No dark chord, no red glow, no shaking
//     camera. The rumble is in the water and in the smoke; the lens does not
//     move a pixel. `sea_dusk` is a very dark plate, so the island carries a
//     warm rim light (`rim`) — a black shape on a near-black sea reads as a
//     hole in the picture, and a hole in the picture is the one thing that
//     would make this scary.
//   - **The ring is the payoff of three episodes.** It comes out wobbling and
//     it does not close. Nothing else about the island changes: same place,
//     same size, same face, still asleep.
//   - **`rc_18_sunny` has no emotion lead, and nothing to lead.** REWRITTEN
//     2026-08-02 (revision §6.17, wave-2 A5): the line was "That is not me."
//     and the staging under it was a man working something out — neutral face,
//     narrowed eyes, a stare held at the island. **That is withdrawn and
//     banked for episode four.** The line is now the gag's standard firing
//     ("OH! That one is me as well! HA! HA!") and the staging is its exact
//     opposite: ONE emotion for the whole scene, `proud`, never morphed, never
//     interrupted. He beams, at full brightness, and claims a volcano without
//     a second's hesitation.
//
//     Three things follow from that and all three are restrictions:
//
//       1. **He turns to CAMERA on his own line**, not on the beat after it,
//          so that when the 45f silence opens he is already grinning down the
//          lens and *nothing changes for forty-five frames*. A turn on the
//          beat's first frame would be a reaction, and the beat is the one
//          place in the scene that is not allowed to contain one.
//       2. **The second rumble happens behind him.** He is facing us; he does
//          not look round, does not blink at it, does not dim. The joke is
//          entirely that he is wrong and does not know it, and the audience
//          does.
//       3. **`rc_18b_narrator` ("Hmm. We will find out.") stages as nothing.**
//          She declines to rule, so the picture declines to illustrate: no
//          cutaway, no emphasis, no look. The volcano rumbles, Sunny beams,
//          and the only new information in the shot is her tone.

const S35_BUBBLES: Record<string, string> = {
  // The series wording this gag has had since ep 2's `rc_14_sunny` — literally
  // the same five words in `wind/scenes/recap.tsx`, because a returning viewer
  // recognising the *sentence* is most of the joke. (The clip is the fuller
  // "OH! That one is me as well! HA! HA!"; a bubble is a summary, house rule
  // six words.)
  rc_18_sunny: "That one is me as well!",
  rc_19_ray: "Bye! Look up. That's me.",
};

const TeaseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [, nextTo] = lineWindow(scene, "rc_16_narrator");
  const [wakeFrom] = lineWindow(scene, "rc_17_narrator");
  const [rumbleFrom] = heldBeat(scene, "rc_17_narrator");
  const [sunnyFrom, sunnyTo] = lineWindow(scene, "rc_18_sunny");
  const [byeFrom] = lineWindow(scene, "rc_19_ray");

  // Scene 26's framing, settled: same island, same place, same size, same
  // distance. Only the hour has changed.
  const zoom = 1.1;
  const horizon = plateY(SEA_DUSK_FRAC, { drift: SEA_DRIFT, zoom });
  const cam: Cam = {
    x: VOLCANO_AT.x,
    y: horizon,
    zoom: 1.9,
    dx: 960 - VOLCANO_AT.x,
  };

  // It starts stirring under "Next time" and is at full strength before the
  // 45-frame beat opens, because that beat **is** the wobbling ring: a ring
  // that is still easing into its wobble halfway through the silence is a
  // silence about nothing. It never becomes more than stirring.
  const stir =
    clamp01((frame - (nextTo - 26)) / 30) * 0.55 + clamp01((frame - wakeFrom) / 40) * 0.45;

  // THE RUMBLE, and there are two of them.
  //
  // The first is the 60f beat's whole content — felt in the water and in the
  // smoke, never in the lens. The second lands under `rc_18_sunny`'s 45f beat
  // and is the thing Sunny does not notice; it is a *swell*, not a bigger
  // event, because the escalation this episode is allowed is one eyelid and
  // one ring that will not close. Between them the water settles part of the
  // way back, so the second one is something happening rather than something
  // continuing.
  const rumbleOne =
    clamp01((frame - rumbleFrom + 10) / 34) *
    (1 - 0.42 * clamp01((frame - (rumbleFrom + 74)) / 56));
  const rumbleTwo = 0.62 * clamp01((frame - (sunnyTo - 10)) / 30);
  const rumble = clamp01(rumbleOne + rumbleTwo);

  const stage = useStage(scene);
  // **Two faces, one change, and the change is ON the line.** `proud` (his
  // resting face, all three episodes) until he claims it, `excited` from his
  // own first frame of speech — the series' own claiming face, the one
  // `a1_03`, `a1_09` and `co_08` all use, with the eyes wide open rather than
  // the smug half-lid. **Lead 0**: nothing arrives early, the morph is over
  // four frames after he starts talking, and by the time the 45f silence opens
  // the face has finished moving and does not move again. No dawning, no
  // doubt, no reaction of any kind — there is no `emotionAt` sequence here
  // because there is no sequence.
  const sunnyEmotion = useEmotion(scene, "sunny", { rc_18_sunny: "excited" }, "proud", NO_LEAD);
  const rayEmotion = useEmotion(scene, "ray", { rc_19_ray: "excited" }, "happy", NO_LEAD);

  // He looks at the island while he claims it and then **turns to camera,
  // inside his own line**, so the beat after it opens on a face that has
  // already finished changing. 45% through: after "OH! That one is me as
  // well!" and before the laugh.
  const toCamera = sunnyFrom + Math.round((sunnyTo - sunnyFrom) * 0.45);
  const sunnyLook: { x: number; y: number } =
    frame >= toCamera
      ? { x: 0, y: 0 }
      : frame >= wakeFrom
        ? { x: -0.85, y: 0.1 }
        : { x: -0.3, y: 0 };
  // Full brightness, arriving with the claim and then held flat: a bloom that
  // was still growing inside the 45f beat would be something entering it.
  const beam = clamp01((frame - sunnyFrom) / 26);

  const sunnyMark: Mark = {
    x: 1560,
    // Further under than Scene 29 — it is later, and he is going. His face
    // still has to be above the line, because he has the last word but one.
    y: hover("sunny", horizon - 44, 0.86),
    scale: 0.86,
    who: "sunny",
    side: "left",
  };
  const rayMark: Mark = {
    x: 300,
    y: hover("ray", 828, 0.72),
    scale: 0.72,
    who: "ray",
    side: "right",
  };

  // **The sign-off starts ON Ray's line and not one frame before it.** The
  // leads here were +16 and +26, which put the poster spring and the whole
  // "LITTLE BIG WORLD" banner *inside the 30-frame held beat* after
  // `rc_18b_narrator` — a beat whose entire content is "the volcano, the
  // rumble, Sunny still beaming. Nothing enters." A still of it had the banner
  // fully on screen with twenty frames of the silence still to run. The card
  // now lands with "Bye!", which is also where the script puts it, and the
  // banner follows it eight frames later so the two do not pop as one object.
  const poster = spring({ frame: frame - byeFrom, fps, config: { damping: 14, mass: 0.9 } });
  const button = spring({ frame: frame - byeFrom - 8, fps, config: { damping: 13, mass: 0.8 } });

  return (
    <AbsoluteFill style={{ background: "#0d1830", overflow: "hidden" }}>
      <PaintedSky bg="sea_dusk" phase={8.6} drift={SEA_DRIFT} zoom={zoom} />

      {/* The rumble, felt in the water. Rings on the surface and nothing else —
          the camera does not move, because a shaking camera is fear and this is
          wonder. */}
      <WaterRumble horizon={horizon} strength={rumble} />

      <Camera cam={cam}>
        <SleepingVolcano
          x={VOLCANO_AT.x}
          base={horizon}
          scale={VOLCANO_AT.scale}
          // **0.49, and it is arithmetic, not a taste.** A ring leaves the
          // crater at local frame 90·(k − phase); at the 0.2 this shot used
          // for one pass that put the emissions at 72 and 162, so the first
          // twenty frames of the 45-frame "the wobbling smoke ring, alone, in
          // silence" beat (52..97) had no ring in them at all. At 0.49 a ring
          // leaves at 46 — six frames before the beat opens — and the extended
          // stirring ring life keeps one on screen from there to the cut.
          phase={0.49}
          rim={0.95}
          stir={stir}
        />
      </Camera>

      {/* Sunny, half under the horizon, claiming a volcano. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 0 ${Math.max(0, H - horizon)}px 0)`,
        }}
      >
        <SoftShade x={sunnyMark.x} y={horizon - 90} rx={420} ry={300} strength={0.3} color="10,18,44" />
        {/* FULL BRIGHTNESS, and it is the only lighting change in the shot.
            `Sunny` has no brightness knob and no arms — his arms are his rays —
            so "beaming, at full brightness, with his arms out" is a warm bloom
            behind him plus `idle` up, which flares the rays (they ride the
            breath's trail, `Sunny.tsx`). It arrives with the claim and is flat
            by the time the 45f beat opens. It is warm, not red, and it is on
            *him*: the island gets no glow of any kind. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle 420px at ${sunnyMark.x}px ${horizon - 70}px, rgba(255,226,150,${0.3 * beam}) 0%, rgba(255,196,90,${0.15 * beam}) 40%, rgba(255,180,60,0) 74%)`,
            pointerEvents: "none",
          }}
        />
        <Sunny
          x={sunnyMark.x}
          y={sunnyMark.y}
          scale={0.86}
          phase={PHASE.sunny}
          emotion={sunnyEmotion}
          speaking={stage.speaking("sunny")}
          look={sunnyLook}
          // Nothing held, nothing narrowed: the eyes stay alive all the way
          // through the beat he is wrong in.
          eyeLife={1}
          // Bouncier from the claim on, which is what puts the rays out.
          idle={1 + 0.3 * beam}
          raySpeed={0.16}
          zIndex={20}
        />
      </div>

      {/* The sign-off: episode four's card, and Ray waving out of the corner. */}
      <NextTimeCard scale={Math.max(0, poster)} />
      <Ray
        x={rayMark.x}
        y={rayMark.y}
        scale={0.72}
        brightness={RAY_LIGHT.full}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        look="camera"
        pose={frame >= byeFrom ? "wave" : "rest"}
        wave={0.85}
        streak={0.2}
        opacity={clamp01((frame - byeFrom) / 16)}
        zIndex={40}
      />
      {/* He is over water, not on ground: a contact shadow under a hovering
          beam is a shadow with nothing casting it. What a light leaves on water
          is a pool of light. */}
      <WideLayer zIndex={38}>
        <ellipse
          cx={rayMark.x}
          cy={960}
          rx={190}
          ry={20}
          fill={kidTheme.sunLight}
          opacity={0.22 * clamp01((frame - byeFrom) / 16)}
        />
      </WideLayer>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 56,
          textAlign: "center",
          fontFamily: kidTheme.fontFamily,
          transform: `scale(${Math.max(0, button)})`,
          zIndex: 44,
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: kidTheme.paper,
            border: `7px solid ${kidTheme.ink}`,
            borderRadius: kidRadius.pill,
            padding: "10px 44px",
            fontSize: kidType.min,
            fontWeight: 900,
            letterSpacing: 6,
            color: kidTheme.ink,
            boxShadow: kidShadow(1),
          }}
        >
          LITTLE BIG WORLD · SEE YOU NEXT TIME
        </span>
      </div>

      {/* Sunny's three words have to be **off screen before their beat opens**:
          `SpeechBubble` springs out over the frames after its `until`, and his
          `until` is the first frame of the 45-frame silence the script says
          nothing enters. Taken out over the last eight frames of the line
          instead. (Ray's sign-off runs to the cut, so it is unaffected.) */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp01((frame - (sunnyTo - 8)) / 8) }}>
        <Bubbles
          scene={scene}
          cast={{ sunny: sunnyMark } as Cast}
          text={S35_BUBBLES}
          at={{
            rc_18_sunny: { x: 1470, y: 252, tail: "right", tailAt: sunnyMark.x },
          }}
        />
      </div>
      <Bubbles
        scene={scene}
        cast={{ ray: rayMark } as Cast}
        text={S35_BUBBLES}
        at={{
          rc_19_ray: { x: 430, y: 500, tail: "left", tailAt: rayMark.x },
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * The rumble, in the water. Rings spreading from under the island, and a slow
 * swell in the near water — felt, never heard, and never in the lens.
 */
const WaterRumble: React.FC<{ horizon: number; strength: number }> = ({
  horizon,
  strength,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (strength <= 0.01) return null;
  return (
    <WideLayer zIndex={6}>
      {[0, 1, 2, 3].map((i) => {
        const u = ((t * 0.34 + i * 0.25) % 1 + 1) % 1;
        const rx = 180 + u * 1500;
        return (
          <ellipse
            key={i}
            cx={960}
            cy={horizon + 60 + u * 300}
            rx={rx}
            ry={rx * 0.12}
            fill="none"
            stroke={kidTheme.skyMid}
            strokeWidth={7 * (1 - u * 0.6)}
            opacity={strength * 0.34 * Math.min(1, u * 5) * (1 - u)}
          />
        );
      })}
      {/* A slow swell in the near water: the surface itself moving, drawn as
          three long soft crests rather than a filter on the plate. */}
      {[0, 1, 2].map((i) => (
        <path
          key={`s${i}`}
          d={
            `M -400 ${horizon + 220 + i * 150 + Math.sin(t * 1.3 + i) * 6 * strength}` +
            ` q 600 ${-26 * strength} 1160 0 q 560 ${26 * strength} 1160 0`
          }
          stroke={kidTheme.skyMid}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
          opacity={strength * 0.18}
        />
      ))}
    </WideLayer>
  );
};

/**
 * Episode four's card.
 *
 * It deliberately does **not** name the episode or ask a question. Episodes one
 * and two both put next time's question on this card ("WHY IS THE SKY BLUE?"),
 * and the honest position here is that this script does not have episode four's
 * question in it — it has three words of Sunny's and a smoke ring. Naming it
 * would be this file inventing series canon. Leave the shape of the card, put
 * the ring on it, and let whoever writes episode four fill in the line.
 */
const NextTimeCard: React.FC<{ scale: number }> = ({ scale }) => {
  const frame = useCurrentFrame();
  if (scale <= 0.002) return null;
  const t = frame / 30;
  return (
    <div
      style={{
        position: "absolute",
        left: 1010,
        top: 470,
        width: 560,
        height: 460,
        marginLeft: -280,
        marginTop: -230,
        transform: `scale(${scale}) rotate(${-3 + (1 - scale) * 8}deg)`,
        transformOrigin: "50% 100%",
        background: `linear-gradient(180deg, #2a2350 0%, #55365e 100%)`,
        border: `12px solid ${kidTheme.ink}`,
        borderRadius: kidRadius.card,
        boxShadow: kidShadow(1.4),
        fontFamily: kidTheme.fontFamily,
        zIndex: 42,
        overflow: "hidden",
      }}
    >
      {/* The ring, still not closing, on the poster. */}
      <svg width={560} height={460} viewBox="0 0 560 460" style={{ position: "absolute", left: 0, top: 0 }}>
        <ellipse cx={280} cy={196} rx={104} ry={44} fill="none" stroke={kidTheme.sunLight} strokeWidth={14} strokeLinecap="round" strokeDasharray="470 130" transform={`rotate(${Math.sin(t) * 4} 280 196)`} opacity={0.85} />
        <ellipse cx={280} cy={252} rx={72} ry={30} fill="none" stroke={kidTheme.sunLight} strokeWidth={11} strokeLinecap="round" strokeDasharray="300 100" opacity={0.5} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 30,
          textAlign: "center",
          fontSize: kidType.min,
          fontWeight: 900,
          letterSpacing: 6,
          color: kidTheme.paper,
          opacity: 0.85,
        }}
      >
        NEXT TIME
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 44,
          padding: "0 20px",
          textAlign: "center",
          fontSize: 60,
          fontWeight: 900,
          lineHeight: 1.02,
          letterSpacing: 2,
          color: kidTheme.sun,
          textShadow: kidInkOutline(3),
        }}
      >
        EPISODE FOUR
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------

export const RECAP_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s32_chant: ChantScene,
  s33_right_now: RightNowScene,
  s34_mind_blower: MindBlowerScene,
  s35_tease: TeaseScene,
};
