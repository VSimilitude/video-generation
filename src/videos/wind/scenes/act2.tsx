import React from "react";
import {
  Face,
  Puff,
  Sunny,
  kidEase,
  kidOutline,
  kidTheme,
  kidType,
  moveAlong,
  settleWave,
  useRig,
  type EmotionInput,
} from "../../../lib/kid";
import {
  ACT_COLOR,
  AbsoluteFill,
  AirArcs,
  BigWordBeat,
  Bubbles,
  Camera,
  CutFlash,
  GrassWorld,
  Hill,
  Kite,
  KidSilhouette,
  PHASE,
  PUFF_OPACITY,
  RuleStamp,
  SkyBlend,
  SoftShade,
  Thermometer,
  WideLayer,
  heldBeat,
  hover,
  interpolate,
  lineProgress,
  lineWindow,
  projectMark,
  spring,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cam,
  type Cast,
  type Mark,
  type SpeakerVisual,
  type TimedScene,
} from "./common";

// ACT TWO — THE BIG LIFT. Scenes 12–22 of script.md.
//
// The act is one continuous physical argument and the staging follows it in a
// straight line: the sun arrives, the *ground* gets hot, the air over it gets
// light and leaves, the hole it leaves is the point of the whole episode, and
// the air that rushes in sideways to fill that hole is the wind. Every scene
// below is one link of that chain and hands the next one its picture.
//
// Four things are enforced here rather than per scene:
//
//   Puff is at PUFF_OPACITY.afterAir (0.55) from Scene 12 to Scene 21 and
//   firms to .notSorry (0.7) across Scene 22's held beat. Those are the only
//   two numbers in the act; a scene that wants him more readable darkens what
//   is behind him (SoftShade), exactly as Act One does.
//
//   NO_LEAD on every scene carrying a held beat (13, 17, 18, 21, 22, and 19's
//   two twelve-frame Big Word beats). script.md treats the eight-frame default
//   as a leak: a face that turns before the silence spends the joke early.
//
//   Nothing starts inside a held beat. Camera moves finish before the silence
//   opens, entrances land before it, and the only things allowed to keep
//   moving inside one are the things the script names — the heat shimmer over
//   the rock (13), the cool air arriving (18).
//
//   Wind does not exist until Scene 18. The grass in Scenes 12–17 carries the
//   same near-zero sway Act One used; from the FWOOSH on, it is being blown.

const NO_LEAD = 0;

/** Act One's residual sway: not a photograph, not a breeze. */
const STILL_AIR = 0.05;

// ---------------------------------------------------------------------------
// Shared drawing — air, drawn
// ---------------------------------------------------------------------------

/**
 * A puff of air as a shape: the same lobed comma the character is built from
 * (`puffBlob` in lib/kid/characters/Puff.tsx), at any size, without a face.
 *
 * Act Two needs hundreds of these — the puffs rising beside Puff in Scene 15,
 * the cool air pouring in sideways in Scene 18, the whole hillside circuit in
 * Scene 20, and the Puff-shaped hole in Scene 17, which is this outline with
 * nothing inside it. Drawing them from one function is what makes the hole in
 * Scene 17 legibly *him* and the crowd in Scene 20 legibly the same stuff.
 */
function smoothClosed(pts: Array<[number, number]>): string {
  const n = pts.length;
  const mid = (a: [number, number], b: [number, number]): [number, number] => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];
  const f = (p: [number, number]): string => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M ${f(mid(pts[n - 1], pts[0]))}`;
  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    d += ` Q ${f(cur)} ${f(mid(cur, next))}`;
  }
  return `${d} Z`;
}

function blobPath(r: number, t: number, seed = 0, points = 22): string {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const wob =
      0.15 * Math.sin(3 * a + t * 0.9 + seed) +
      0.075 * Math.sin(5 * a - t * 0.62 + seed * 1.7) +
      0.04 * Math.sin(7 * a + t * 1.31 + seed * 0.7);
    // 1 at the far left, 0 at the far right — the wing that makes a puff a
    // comma travelling to the right rather than a pearl.
    const back = (0.5 - 0.5 * Math.cos(a)) ** 1.7;
    const rr = r * (1 + wob) * (1 + 0.22 * back);
    const sy = 0.9 * (1 - 0.26 * back);
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr * sy]);
  }
  return smoothClosed(pts);
}

/** One faceless puff, for drawing inside a `WideLayer` or any other `<svg>`. */
const AirBlob: React.FC<{
  x: number;
  y: number;
  r: number;
  t: number;
  seed?: number;
  fill?: string;
  edge?: string;
  opacity?: number;
  flip?: boolean;
  rotate?: number;
  points?: number;
}> = ({
  x,
  y,
  r,
  t,
  seed = 0,
  fill = kidTheme.air,
  edge = kidTheme.airEdge,
  opacity = 1,
  flip = false,
  rotate = 0,
  points = 18,
}) => {
  const d = blobPath(r, t, seed, points);
  return (
    <g
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotate.toFixed(1)}) ${flip ? "scale(-1 1)" : ""}`}
      opacity={opacity}
    >
      <path d={d} fill={fill} opacity={0.82} />
      <path
        d={d}
        fill="none"
        stroke={edge}
        strokeWidth={Math.max(3, r * 0.1)}
        strokeLinecap="round"
        strokeDasharray={`${r * 1.1} ${r * 0.26} ${r * 0.66} ${r * 0.22}`}
        strokeDashoffset={-t * 12}
        opacity={0.85}
      />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Shared drawing — the crayon diagram kit (Scenes 14 and 21)
// ---------------------------------------------------------------------------

/** Deterministic −1..1 from an integer-ish seed. No randomness anywhere. */
function jitter(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
}

/**
 * A straight line drawn with a crayon: seven samples with a little wander on
 * each, redrawn every six frames so the diagram *boils* the way a hand-drawn
 * one does. The boil is what stops a diagram scene reading as a slide.
 */
function crayonLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  amp: number,
  seed: number,
  tick: number,
): string {
  const N = 7;
  const nx = -(y2 - y1);
  const ny = x2 - x1;
  const len = Math.max(1, Math.sqrt(nx * nx + ny * ny));
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const w = i === 0 || i === N ? 0 : amp * jitter(seed * 31.7 + i * 5.3 + tick * 0.77);
    pts.push(
      `${(x1 + (x2 - x1) * u + (nx / len) * w).toFixed(1)} ${(y1 + (y2 - y1) * u + (ny / len) * w).toFixed(1)}`,
    );
  }
  return `M ${pts.join(" L ")}`;
}

/** A crayon arrow, drawn on from its tail. `reveal` 0..1. */
const CrayonArrow: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  width?: number;
  seed?: number;
  tick?: number;
  reveal?: number;
  head?: number;
  opacity?: number;
}> = ({ from, to, color, width = 12, seed = 1, tick = 0, reveal = 1, head = 34, opacity = 1 }) => {
  const u = Math.max(0, Math.min(1, reveal));
  if (u <= 0.01) return null;
  const tip = { x: from.x + (to.x - from.x) * u, y: from.y + (to.y - from.y) * u };
  const a = Math.atan2(to.y - from.y, to.x - from.x);
  const hs = Math.min(1, u * 5) * head;
  return (
    <g opacity={opacity}>
      <path
        d={crayonLine(from.x, from.y, tip.x, tip.y, 4, seed, tick)}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={
          `M ${tip.x} ${tip.y}` +
          ` L ${tip.x - Math.cos(a - 0.45) * hs} ${tip.y - Math.sin(a - 0.45) * hs}` +
          ` L ${tip.x - Math.cos(a + 0.45) * hs} ${tip.y - Math.sin(a + 0.45) * hs} Z`
        }
        fill={color}
        stroke={color}
        strokeWidth={width * 0.5}
        strokeLinejoin="round"
      />
    </g>
  );
};

/** A short wiggly arrow going *up* — heat leaving the ground. */
const HeatArrow: React.FC<{
  x: number;
  y: number;
  height: number;
  color: string;
  u: number;
  width?: number;
  amp?: number;
  seed?: number;
}> = ({ x, y, height, color, u, width = 10, amp = 16, seed = 0 }) => {
  const pts: Array<[number, number]> = [];
  const N = 9;
  for (let i = 0; i <= N; i++) {
    const p = i / N;
    const py = y - height * u * p;
    const px = x + Math.sin(p * Math.PI * 2.2 + seed) * amp * (1 - p * 0.4);
    pts.push([px, py]);
  }
  // The head sits on the *last point of the wiggle*, not above the arrow's
  // nominal x — a head that floats off the end of the line is the single
  // clearest tell that a diagram was assembled rather than drawn.
  const tip = pts[N];
  const prev = pts[N - 1];
  const a = Math.atan2(tip[1] - prev[1], tip[0] - prev[0]);
  const hs = 30;
  const fade = Math.sin(Math.max(0, Math.min(1, u)) * Math.PI);
  return (
    <g opacity={0.3 + 0.7 * fade}>
      <path
        d={`M ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")}`}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d={
          `M ${tip[0]} ${tip[1]}` +
          ` L ${tip[0] - Math.cos(a - 0.5) * hs} ${tip[1] - Math.sin(a - 0.5) * hs}` +
          ` L ${tip[0] - Math.cos(a + 0.5) * hs} ${tip[1] - Math.sin(a + 0.5) * hs} Z`
        }
        fill={color}
        stroke={color}
        strokeWidth={width * 0.5}
        strokeLinejoin="round"
      />
    </g>
  );
};

/** A hand-lettered diagram tag. Not a caption — a label on a drawing. */
const DiagramTag: React.FC<{
  x: number;
  y: number;
  text: string;
  from?: number;
  size?: number;
  tilt?: number;
  color?: string;
}> = ({ x, y, text, from = 0, size = kidType.label, tilt = -3, color = kidTheme.ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - from, fps, config: { damping: 12, mass: 0.6 } });
  if (pop <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${pop}) rotate(${tilt}deg)`,
        fontFamily: kidTheme.fontFamily,
        fontSize: size,
        fontWeight: 900,
        letterSpacing: 2,
        color,
        textShadow: kidOutline(5),
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 42,
      }}
    >
      {text}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 12 — Sunny, again
// ---------------------------------------------------------------------------

/** How far the world drops as we tilt up off the grass and onto him. */
const S12_TILT = 360;
const S12_SUNNY = { x: 1090, y: -110, scale: 1.55 };
const S12_PUFF_X = 545;
const S12_PUFF_SCALE = 0.52;

const S12_BUBBLES: Record<string, string> = {
  a2_02_sunny: "GOOD MORNING, EVERYBODY!",
  a2_03_puff: "Oh no. He is enormous.",
  a2_05_sunny: "I invented mornings!",
};

const SunnyAgainScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [, goldTo] = lineWindow(scene, "a2_01_narrator");
  const [hiFrom, hiTo] = lineWindow(scene, "a2_02_sunny");

  // One sweep of light, and the camera goes up with it. The tilt starts under
  // the narrator's line and is over before Sunny opens his mouth: he arrives
  // into a shot that has already finished moving.
  const sweep = kidEase.easeInOutSine((frame - 8) / 62);
  const tilt = kidEase.easeInOutSine((frame - 20) / Math.max(1, goldTo - 6)) * S12_TILT;

  const cam: Cam = { x: 960, y: 620, dy: tilt };
  // Just above the grass before the tilt, and a speck at the bottom of frame
  // after it — one world position, no cheating with parallax.
  const puffY = hover("puff", 624, S12_PUFF_SCALE);
  const puffMark: Mark = {
    x: S12_PUFF_X,
    y: puffY,
    scale: S12_PUFF_SCALE,
    who: "puff",
    side: "right",
    offset: 300,
  };
  const cast: Cast = {
    puff: projectMark(cam, puffMark),
    // Sunny fills the sky; a bubble above his crown would be off the top of
    // frame, so his lines are placed by hand in the clear corner.
    sunny: { x: S12_SUNNY.x, y: S12_SUNNY.y, scale: S12_SUNNY.scale, who: "sunny" },
  };

  const sunnyEmotion = useEmotion(
    scene,
    "sunny",
    { a2_02_sunny: "excited", a2_05_sunny: "proud" },
    "proud",
  );
  const puffEmotion = useEmotion(scene, "puff", { a2_03_puff: "amazed" }, "happy");

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={2} />
      <Camera cam={cam}>
        <Hill wind={STILL_AIR} crest={640} />
        <Sunny
          x={S12_SUNNY.x}
          y={S12_SUNNY.y}
          scale={S12_SUNNY.scale}
          phase={PHASE.sunny}
          emotion={sunnyEmotion}
          speaking={stage.speaking("sunny")}
          look={{ x: -0.2, y: 0.35 }}
          // Lowered, so he can look at you over the top of them. Fast rays:
          // this is the most pleased with himself he has been in two episodes.
          shades={1}
          raySpeed={0.42}
          idle={1.1}
        />
        <Puff
          x={S12_PUFF_X}
          y={puffY}
          scale={S12_PUFF_SCALE}
          opacity={PUFF_OPACITY.afterAir}
          phase={PHASE.puff}
          emotion={puffEmotion}
          speaking={stage.speaking("puff")}
          // Almost straight up. He is a speck and Sunny is the sky.
          look={{ x: 0.25, y: -0.85 }}
          idle={0.8}
          wisps={2}
        />
      </Camera>
      {/* The light on the grass going gold, in one sweep left to right. Two
          overlays: the cool morning ahead of the front, the gold behind it. */}
      <GoldSweep u={sweep} />
      {/* Lens flares he has clearly added himself — they snap on at the end of
          his own hello, which is the joke. */}
      <SunFlares at={hiTo - 6} from={{ x: S12_SUNNY.x, y: S12_SUNNY.y + tilt }} live={frame >= hiFrom} />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S12_BUBBLES}
        at={{
          a2_02_sunny: { x: 470, y: 250, tail: "right" },
          a2_05_sunny: { x: 470, y: 250, tail: "right" },
        }}
      />
    </AbsoluteFill>
  );
};

/** Cool morning blue giving way to gold, as a single moving front. */
const GoldSweep: React.FC<{ u: number }> = ({ u }) => {
  const p = -24 + Math.max(0, Math.min(1, u)) * 154;
  // Both layers are masked towards the bottom of frame. Gold laid flat over a
  // blue sky turns it olive; the thing that actually goes gold is the *ground*,
  // so the warm layer is strongest on the grass and only tints the sky.
  const mask = "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.5) 44%, rgba(0,0,0,1) 72%)";
  return (
    <>
      <AbsoluteFill
        style={{
          background: `linear-gradient(102deg, rgba(30,74,132,0) ${p - 8}%, rgba(30,74,132,0.24) ${p + 12}%, rgba(30,74,132,0.24) 100%)`,
          WebkitMaskImage: mask,
          maskImage: mask,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(102deg, rgba(255,206,104,0.42) ${p - 20}%, rgba(255,236,176,0.42) ${p - 4}%, rgba(255,206,104,0) ${p + 8}%)`,
          WebkitMaskImage: mask,
          maskImage: mask,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

/**
 * Sunny's lens flares. Not the camera's — his. They pop on in a line away from
 * him with a spring each, hold, and breathe, which is exactly how a person who
 * added flares to his own photograph would have done it.
 */
const SunFlares: React.FC<{ at: number; from: { x: number; y: number }; live: boolean }> = ({
  at,
  from,
  live,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (!live) return null;
  const target = { x: 250, y: 1010 };
  const specs: Array<{ u: number; r: number; color: string; a: number }> = [
    { u: 0.26, r: 54, color: kidTheme.sunLight, a: 0.5 },
    { u: 0.42, r: 96, color: kidTheme.star, a: 0.36 },
    { u: 0.58, r: 38, color: kidTheme.pink, a: 0.3 },
    { u: 0.74, r: 126, color: kidTheme.sun, a: 0.26 },
    { u: 0.9, r: 62, color: kidTheme.mint, a: 0.28 },
    { u: 1.08, r: 40, color: kidTheme.sunLight, a: 0.34 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 20 }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" overflow="visible">
        {specs.map((s, i) => {
          const pop = spring({
            frame: frame - at - i * 2,
            fps,
            config: { damping: 11, mass: 0.5 },
          });
          const breathe = 1 + 0.05 * Math.sin(t * 1.7 + i);
          return (
            <circle
              key={i}
              cx={from.x + (target.x - from.x) * s.u}
              cy={from.y + (target.y - from.y) * s.u}
              r={s.r * pop * breathe}
              fill={s.color}
              opacity={s.a * pop}
            />
          );
        })}
        {/* One anamorphic streak across him, because of course there is one. */}
        <rect
          x={from.x - 1100}
          y={from.y - 7}
          width={2200}
          height={14}
          rx={7}
          fill={kidTheme.star}
          opacity={0.22 * spring({ frame: frame - at, fps, config: { damping: 12, mass: 0.6 } })}
        />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 13 — A rock, having a lovely time
// ---------------------------------------------------------------------------

const S13_GROUND = 800;
const S13_ROCK = { x: 1150, y: 700, scale: 1 };
const S13_PUFF_X = 640;
const S13_PUFF_SCALE = 0.62;

const S13_VISUAL: SpeakerVisual = { a2_08_narrator: "rock" };

const S13_BUBBLES: Record<string, string> = {
  a2_09_puff: "Is the rock okay?",
};

const RockScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene, S13_VISUAL);
  const [beamFrom, beamTo] = lineWindow(scene, "a2_06_narrator");
  const [warmFrom, warmTo] = lineWindow(scene, "a2_07_narrator");
  const [rockFrom] = lineWindow(scene, "a2_08_narrator");

  // The sunbeams arrive, the soil warms, and the camera walks in on the rock —
  // and every one of those finishes before the rock's line does, so the
  // forty-five frames after it have nothing in them but heat shimmer. That is
  // the whole gag: the joke is the length of the silence, and anything still
  // easing inside it is the joke leaking out.
  const beams = kidEase.easeOutCubic((frame - beamFrom - 6) / 34);
  const heat = kidEase.easeInOutSine((frame - beamTo) / Math.max(1, warmTo - beamTo));
  const push = interpolate(frame, [warmFrom + 10, rockFrom - 4], [1, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  const cam: Cam = { x: S13_ROCK.x, y: S13_ROCK.y, zoom: push };
  const puffY = hover("puff", 560, S13_PUFF_SCALE);
  const puffMark: Mark = {
    x: S13_PUFF_X,
    y: puffY,
    scale: S13_PUFF_SCALE,
    who: "puff",
    side: "left",
    offset: 250,
  };

  // Held-beat scene: no lead. The rock has no emotion at all — it is a plain
  // string, so the face cannot even morph.
  const puffEmotion = useEmotion(
    scene,
    "puff",
    { a2_09_puff: "amazed" },
    "happy",
    NO_LEAD,
    S13_VISUAL,
  );

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={1} />
      <Camera cam={cam}>
        <SunBeams strength={beams} />
        <SunnyGround ground={S13_GROUND} warm={heat} />
        <Thermometer x={180} y={520} level={0.12 + heat * 0.74} scale={0.78} />
        <Rock
          x={S13_ROCK.x}
          y={S13_ROCK.y}
          scale={S13_ROCK.scale}
          speaking={stage.speaking("rock")}
        />
        {/* The one thing on screen allowed to move after the line lands. */}
        <HeatShimmer x={S13_ROCK.x} y={S13_ROCK.y - 96} width={470} strength={0.35 + heat * 0.65} />
        <Puff
          x={S13_PUFF_X}
          y={puffY}
          scale={S13_PUFF_SCALE}
          opacity={PUFF_OPACITY.afterAir}
          phase={PHASE.puff}
          emotion={puffEmotion}
          speaking={stage.speaking("puff")}
          look={{ x: 0.9, y: 0.1 }}
          // Nearly still through the beat as well: the rock is the picture and
          // Puff is the one watching it.
          idle={0.35}
          eyeLife={0.4}
          wisps={2}
        />
      </Camera>
      {/* The rock gets no bubble. Its bubble would still be shrinking six
          frames into the silence, and after that line the rock is furniture. */}
      <Bubbles scene={scene} cast={{ puff: projectMark(cam, puffMark) }} text={S13_BUBBLES} />
    </AbsoluteFill>
  );
};

/**
 * The rock. Wide, flat, grey, eyes shut, and — for the whole scene — utterly
 * motionless: `idle={0}` kills the breath, `eyeLife={0}` the saccades, the
 * closed eyes are drawn rather than blinked, and the emotion is a bare string
 * so there is no morph and no head settle. The only thing wired to anything is
 * the mouth, and only while its own line plays.
 *
 * This is the moose's successor (episode one's best-loved gag) and the
 * mechanism is identical: restraint. Nothing here is animated on purpose.
 */
const Rock: React.FC<{ x: number; y: number; scale: number; speaking: boolean }> = ({
  x,
  y,
  scale,
  speaking,
}) => {
  const rig = useRig({
    x,
    y,
    emotion: "happy",
    speaking,
    phase: PHASE.rock,
    idle: 0,
    eyeLife: 0,
    look: "camera",
  });
  const grey = "#9aa3ad";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 620,
        height: 340,
        marginLeft: -310,
        marginTop: -170,
        transform: `scale(${scale})`,
        transformOrigin: "50% 100%",
      }}
    >
      <svg width={620} height={340} viewBox="-310 -170 620 340" overflow="visible">
        <ellipse cx={10} cy={132} rx={280} ry={26} fill={kidTheme.ink} opacity={0.16} />
        <path
          d="M -262 118 Q -286 24 -196 -34 Q -108 -96 22 -92 Q 168 -88 244 -28 Q 292 12 268 118 Z"
          fill={grey}
          stroke={kidTheme.ink}
          strokeWidth={11}
          strokeLinejoin="round"
        />
        {/* Two flat highlights, not a gradient — the lids are painted in body
            colour and a ramp cannot be matched (Character.tsx, `skin`). */}
        <path d="M -184 -28 Q -96 -70 8 -66 Q -78 -34 -142 4 Z" fill="#b6bec7" opacity={0.85} />
        <path d="M 96 -70 Q 190 -56 232 -14 Q 172 -40 92 -46 Z" fill="#b6bec7" opacity={0.55} />
        <path
          d="M -212 66 Q -80 44 96 62"
          stroke="#7c858f"
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />
        {/* Eyes shut, drawn as two content little arcs, so no blink can fire. */}
        {[-1, 1].map((s) => (
          <path
            key={s}
            d={`M ${s * 66 - 26} -18 q 26 26 52 0`}
            stroke={kidTheme.ink}
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
          />
        ))}
        <Face rig={rig} x={0} y={-14} size={1.28} eyes={false} skin={grey} blushColor="#ff9a86" blushStrength={1.5} />
      </svg>
    </div>
  );
};

/** Sunbeams as thick gold ropes coming down onto the ground. */
const SunBeams: React.FC<{ strength: number }> = ({ strength }) => {
  const s = Math.max(0, Math.min(1, strength));
  if (s <= 0.01) return null;
  return (
    <WideLayer opacity={s}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = -260 + i * 470;
        return (
          <path
            key={i}
            d={`M ${x} -640 L ${x + 118} -640 L ${x + 118 - 330} 1180 L ${x - 330} 1180 Z`}
            fill="#ffd873"
            opacity={0.62}
          />
        );
      })}
    </WideLayer>
  );
};

/** The ground at animal scale: soil, a warm dirt patch, tufts along the top. */
const SunnyGround: React.FC<{ ground: number; warm: number }> = ({ ground, warm }) => {
  const w = Math.max(0, Math.min(1, warm));
  return (
    <WideLayer>
      <rect x={-1200} y={ground} width={4400} height={1400} fill={kidTheme.grass} />
      <rect x={-1200} y={ground + 46} width={4400} height={1400} fill={kidTheme.earth} opacity={0.9} />
      {/* The dirt path the rock is lying on, going warm. */}
      <ellipse cx={1150} cy={ground + 26} rx={640} ry={86} fill="#c99a63" />
      <ellipse cx={1150} cy={ground + 26} rx={640} ry={86} fill={kidTheme.sunDark} opacity={0.42 * w} />
      {Array.from({ length: 34 }, (_, i) => {
        const x = -600 + i * 118 + ((i * 47) % 40);
        const h = 34 + ((i * 91) % 26);
        return (
          <path
            key={i}
            d={`M ${x} ${ground + 12} q 6 ${-h * 0.6} 2 ${-h}`}
            stroke={kidTheme.grassDark}
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
            opacity={0.5}
          />
        );
      })}
    </WideLayer>
  );
};

/** Heat coming off a hot surface: the only motion in the held beat. */
const HeatShimmer: React.FC<{ x: number; y: number; width: number; strength: number }> = ({
  x,
  y,
  width,
  strength,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer>
      {Array.from({ length: 9 }, (_, i) => {
        const u = ((t * 0.34 + i / 9) % 1 + 1) % 1;
        const px = x - width / 2 + (i / 8) * width + Math.sin(t * 1.6 + i) * 12;
        const py = y - u * 210;
        const wob = Math.sin(t * 3.1 + i * 1.7) * 16;
        return (
          <path
            key={i}
            d={`M ${px} ${py} q ${wob} -34 ${-wob * 0.6} -68 q ${-wob} -30 ${wob * 0.5} -58`}
            stroke={kidTheme.paper}
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
            opacity={strength * 0.42 * Math.sin(u * Math.PI)}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 14 — The ground does the heating
// ---------------------------------------------------------------------------
//
// The one genuinely surprising fact in the episode, and the reason it gets a
// diagram of its own: sunlight mostly goes *straight through* the air. So the
// picture has to prove a negative — four sun arrows cross the whole air layer
// and the layer does not change by one shade, while the ground under them goes
// orange and then heats the air from below with its own wiggly arrows.
//
// Everything is drawn in screen coordinates: this is a diagram, not a place.

const S14_AIR_TOP = 300;
const S14_AIR_BOTTOM = 690;
const S14_GROUND_TOP = 742;
const S14_SUN = { x: 300, y: 168 };
const S14_PUFF = { x: 1656, y: 636, scale: 0.72 };

const S14_BUBBLES: Record<string, string> = {
  a2_13_puff: "Ooh. That is toasty.",
};

const GroundHeatsScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const tick = Math.floor(frame / 6);
  const [downFrom] = lineWindow(scene, "a2_11_narrator");
  const [warmFrom, warmTo] = lineWindow(scene, "a2_12_narrator");
  const [toastyFrom] = lineWindow(scene, "a2_13_puff");

  // "The sun does not warm the air very much" — the arrows draw down and
  // through, and nothing about the air layer changes.
  const rays = kidEase.easeOutCubic((frame - downFrom - 10) / 54);
  // "The sun warms the GROUND" — first half of the line.
  const glow = kidEase.easeInOutSine((frame - warmFrom - 4) / 56);
  // "…and then the warm ground warms the air" — second half, and the arrows
  // that carry the heat up only exist after the ground is hot.
  const rise = kidEase.easeInOutSine((frame - (warmFrom + (warmTo - warmFrom) * 0.5)) / 40);

  const puffEmotion = useEmotion(scene, "puff", { a2_13_puff: "excited" }, "happy");
  const puffY = hover("puff", S14_PUFF.y, S14_PUFF.scale);

  return (
    <AbsoluteFill style={{ background: kidTheme.skyLow }}>
      {/* Above the air layer: the empty top of the sky, and the sun in it. */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${kidTheme.skyTop} 0%, ${kidTheme.skyMid} 58%, ${kidTheme.skyLow} 100%)` }} />
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", left: 0, top: 0 }}
        overflow="visible"
      >
        {/* THE AIR LAYER. Drawn once, and its fill never changes: whatever the
            sun's arrows do on their way through, this band stays cool. */}
        <rect
          x={-40}
          y={S14_AIR_TOP}
          width={2000}
          height={S14_AIR_BOTTOM - S14_AIR_TOP}
          fill={kidTheme.airLight}
          opacity={0.72}
        />
        <path
          d={crayonLine(-40, S14_AIR_TOP, 1960, S14_AIR_TOP, 5, 3, tick)}
          stroke={kidTheme.airEdge}
          strokeWidth={7}
          strokeDasharray="34 26"
          fill="none"
          opacity={0.8}
        />
        <path
          d={crayonLine(-40, S14_AIR_BOTTOM, 1960, S14_AIR_BOTTOM, 5, 9, tick)}
          stroke={kidTheme.airEdge}
          strokeWidth={7}
          strokeDasharray="34 26"
          fill="none"
          opacity={0.8}
        />
        {/* The warmth the *ground* puts into the air, and the only thing that
            ever tints this band. It creeps up from the bottom edge. */}
        <defs>
          <linearGradient id="a2-warm-air" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={kidTheme.tomato} stopOpacity={0.3} />
            <stop offset="100%" stopColor={kidTheme.tomato} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect
          x={-40}
          y={S14_AIR_BOTTOM - (S14_AIR_BOTTOM - S14_AIR_TOP) * 0.66 * rise}
          width={2000}
          height={(S14_AIR_BOTTOM - S14_AIR_TOP) * 0.66 * rise}
          fill="url(#a2-warm-air)"
          opacity={rise}
        />

        {/* The sun's arrows: four long straight ones, crossing the whole air
            layer without touching it and landing on the soil. */}
        {[0, 1, 2, 3].map((i) => {
          const tx = 420 + i * 300;
          return (
            <CrayonArrow
              key={i}
              // Parallel, and steep. A fan of rays out of the sun's face reads
              // as a starburst; four parallel arrows read as sunlight.
              from={{ x: tx - 210, y: S14_AIR_TOP - 62 }}
              to={{ x: tx, y: S14_GROUND_TOP - 6 }}
              color={kidTheme.sunDark}
              width={15}
              seed={i * 3 + 1}
              tick={tick}
              reveal={Math.max(0, Math.min(1, rays * 1.3 - i * 0.12))}
              head={42}
            />
          );
        })}

        {/* The ground. It is the thing that gets hot. */}
        <rect x={-40} y={S14_GROUND_TOP} width={2000} height={420} fill={kidTheme.earth} />
        <rect
          x={-40}
          y={S14_GROUND_TOP}
          width={2000}
          height={420}
          fill={kidTheme.sunDeep}
          opacity={0.72 * glow}
        />
        <rect x={-40} y={S14_GROUND_TOP - 16} width={2000} height={26} fill={kidTheme.grassDark} opacity={0.9} />
        {/* Where each arrow lands, the soil goes hottest. */}
        {[0, 1, 2, 3].map((i) => (
          <ellipse
            key={i}
            cx={420 + i * 300}
            cy={S14_GROUND_TOP + 8}
            rx={165}
            ry={34}
            fill={kidTheme.sun}
            opacity={0.45 * glow}
          />
        ))}

        {/* And *then* the ground warms the air: short wiggly arrows going up
            out of the soil into the layer the sunlight ignored. */}
        {rise > 0.02
          ? [0, 1, 2, 3, 4, 5].map((i) => {
              const x = 270 + i * 296;
              const u = ((frame / 46 + i / 6) % 1 + 1) % 1;
              return (
                <HeatArrow
                  key={i}
                  x={x}
                  y={S14_GROUND_TOP - 14}
                  height={250 * rise}
                  color={kidTheme.tomato}
                  u={u}
                  width={15}
                  amp={13}
                  seed={i * 1.9}
                />
              );
            })
          : null}
      </svg>

      <DiagramTag x={168} y={(S14_AIR_TOP + S14_AIR_BOTTOM) / 2} text="AIR" from={16} />
      <DiagramTag x={210} y={S14_GROUND_TOP + 168} text="GROUND" from={warmFrom} />
      <CrayonSun x={S14_SUN.x} y={S14_SUN.y} tick={tick} />

      <Puff
        x={S14_PUFF.x}
        y={puffY}
        scale={S14_PUFF.scale}
        opacity={PUFF_OPACITY.afterAir}
        phase={PHASE.puff}
        emotion={puffEmotion}
        speaking={stage.speaking("puff")}
        look={frame >= toastyFrom ? "down" : { x: -0.7, y: 0.1 }}
        idle={0.9}
        wisps={2}
      />
      {/* Puff going pink at the edges on the warm ground. Drawn *over* him, so
          it is his outline that catches the colour — the sanctioned way to
          change how he reads without touching his opacity. */}
      <SoftShade
        x={S14_PUFF.x}
        y={S14_PUFF.y + 30}
        rx={210}
        ry={175}
        strength={0.26 * Math.max(glow, rise)}
        color="255,138,120"
      />
      <Bubbles
        scene={scene}
        cast={{
          puff: { x: S14_PUFF.x, y: puffY, scale: S14_PUFF.scale, who: "puff", side: "left", offset: 330 },
        }}
        text={S14_BUBBLES}
      />
    </AbsoluteFill>
  );
};

/** The sun as a child would draw it in the corner of a diagram. */
const CrayonSun: React.FC<{ x: number; y: number; tick: number }> = ({ x, y, tick }) => (
  <svg
    width={520}
    height={520}
    viewBox="-260 -260 520 520"
    style={{ position: "absolute", left: x - 260, top: y - 260 }}
    overflow="visible"
  >
    {Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return (
        <path
          key={i}
          d={crayonLine(
            Math.cos(a) * 106,
            Math.sin(a) * 106,
            Math.cos(a) * 168,
            Math.sin(a) * 168,
            4,
            i + 2,
            tick,
          )}
          stroke={kidTheme.sunDark}
          strokeWidth={15}
          strokeLinecap="round"
          fill="none"
        />
      );
    })}
    <circle cx={0} cy={0} r={96} fill={kidTheme.sun} stroke={kidTheme.sunDeep} strokeWidth={9} />
  </svg>
);

// ---------------------------------------------------------------------------
// Scenes 15 and 16 — the rising shot
// ---------------------------------------------------------------------------
//
// One continuous climb, shared by two scenes so the rule stamp in Scene 16
// really does thump onto a shot that is still going up. The world is built in
// layers that scroll down past the camera at their own rates: near grass fast,
// the fence post slower, the hill with the kid on it barely at all. Parallax is
// doing the pedagogy here — it is what says "high" rather than "moving".
//
// The other warm puffs do *not* scroll. They rise at exactly Puff's speed, so
// on screen they hold station around him, which is the picture the closing line
// of Scene 16 needs: this is happening to all the warm air at once.

const LIFT_AT = 108;
const RISE_SPEED = 6.4;
const RISE_ACCEL = 34;

/** Distance risen by local frame `f` of Scene 15. */
function riseAt(f: number): number {
  const t = Math.max(0, f - LIFT_AT);
  if (t < RISE_ACCEL) return (RISE_SPEED * t * t) / (2 * RISE_ACCEL);
  return RISE_SPEED * (t - RISE_ACCEL / 2);
}

/** Where Scene 15 leaves the climb, so Scene 16 can carry on from it. */
const S15_RISE_END = riseAt(520);

const WARM_PUFFS = 42;

const RisingWorld: React.FC<{
  rise: number;
  grassWind: number;
  showGrass: boolean;
  /** Screen x to keep the front grass layer off. */
  avoidX?: number;
}> = ({ rise, grassWind, showGrass, avoidX = 960 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <>
      {/* Far: the hill Puff has just left, with the kid and the flat kite on
          it. Tiny, far off, and still not flying. */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${rise * 0.16}px)` }}>
        <WideLayer>
          <path
            d="M -1200 900 Q 300 470 1000 690 Q 1700 900 3200 700 L 3200 1800 L -1200 1800 Z"
            fill="#8ddc8a"
            opacity={0.9}
          />
          <path
            d="M -1200 1010 Q 500 700 1300 880 Q 2200 1060 3200 900 L 3200 1800 L -1200 1800 Z"
            fill={kidTheme.grass}
          />
        </WideLayer>
        {/* Well clear of the lane Puff climbs through: a tiny red kite
            crossing his face was the first thing a still caught. */}
        <KidSilhouette x={352} y={604} scale={0.17} flip opacity={0.85} />
        <Kite x={455} y={662} scale={0.13} rot={96} flat life={0} />
      </div>
      {/* Mid: a fence post going by, which is the first thing that says we are
          climbing rather than the world sinking. */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${rise * 0.55}px)` }}>
        <WideLayer>
          {/* Seen from ant height, so it is enormous: the post is the thing
              that says we are climbing rather than the world sinking. */}
          <rect x={1500} y={120} width={240} height={1500} rx={22} fill="#a97b4e" stroke={kidTheme.ink} strokeWidth={10} />
          <rect x={1140} y={420} width={1000} height={120} rx={18} fill="#c08f5c" stroke={kidTheme.ink} strokeWidth={9} />
          <rect x={1140} y={820} width={1000} height={120} rx={18} fill="#c08f5c" stroke={kidTheme.ink} strokeWidth={9} />
          <path d="M 1500 120 q 120 -70 240 0" fill="#8f6538" stroke={kidTheme.ink} strokeWidth={10} />
          <path d="M 1560 240 l 0 1300 M 1660 300 l 0 1200" stroke="#8f6538" strokeWidth={9} opacity={0.7} />
        </WideLayer>
      </div>
      {/* Birds, higher up: we go past them too. */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${rise * 0.42}px)` }}>
        <WideLayer>
          {[0, 1, 2, 3].map((i) => {
            const x = 240 + i * 430 + Math.sin(t * 0.5 + i) * 40;
            const y = -520 - ((i * 137) % 200);
            const flap = Math.sin(t * 6 + i * 1.4) * 22;
            return (
              <path
                key={i}
                d={`M ${x - 46} ${y + flap} q 46 -34 46 0 q 0 -34 46 0`}
                stroke={kidTheme.ink}
                strokeWidth={7}
                fill="none"
                strokeLinecap="round"
                opacity={0.7}
              />
            );
          })}
        </WideLayer>
      </div>
      {/* Near: the grass he is leaving, bending down and away beneath him. */}
      {showGrass ? (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${rise}px)` }}>
          <GrassWorld ground={980} wind={grassWind} seed={4} />
          <GrassWorld
            layer="front"
            ground={980}
            wind={grassWind}
            seed={4}
            // He is the one thing on screen that cannot afford to be occluded
            // (GrassWorld's own note), and he is moving, so the hole in the
            // front layer moves with him.
            avoid={[{ x: avoidX, r: 560 }]}
          />
        </div>
      ) : null}
    </>
  );
};

/** Dozens of other warm puffs, holding station because they rise as fast as he does. */
const WarmCrowd: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer opacity={opacity}>
      {Array.from({ length: WARM_PUFFS }, (_, i) => {
        const x = -180 + ((i * 397) % 2260);
        const y = -220 + ((i * 617) % 1420);
        const r = 20 + ((i * 53) % 22);
        // Each wanders a little on its own circle: they are keeping pace, not
        // pinned to the glass.
        const wx = Math.sin(t * 0.7 + i * 1.3) * 26;
        const wy = Math.cos(t * 0.52 + i * 0.9) * 20;
        return (
          <AirBlob
            key={i}
            x={x + wx}
            y={y + wy}
            r={r}
            t={t + i}
            seed={i * 0.7}
            // Warm air, so they carry a little of the ground's heat in them.
            fill={i % 3 === 0 ? "#ffe2cb" : kidTheme.air}
            edge={i % 3 === 0 ? kidTheme.sunDark : kidTheme.airEdge}
            opacity={0.55}
            points={14}
          />
        );
      })}
    </WideLayer>
  );
};

const S15_BUBBLES: Record<string, string> = {
  a2_16_puff: "I am going UP!",
  a2_17_puff: "This happened to my friend Drip!",
  a2_19_puff: "I am actually flying!",
};

const UpScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [, upTo] = lineWindow(scene, "a2_16_puff");

  const rise = riseAt(frame);

  // Wobble, then bob, then off. The grass is blown down and away underneath
  // him on the way out, and settles once he is clear.
  const wobble = frame > 40 && frame < LIFT_AT ? Math.sin((frame - 40) * 0.42) * (frame - 40) * 0.5 : 0;
  const bob = frame >= 70 && frame < LIFT_AT ? kidEase.easeInOutSine((frame - 70) / 38) * 46 : 0;
  const lift = Math.max(0, frame - LIFT_AT);
  const grassWind = STILL_AIR + 0.85 * Math.max(0, 1 - Math.abs(lift - 6) / 34);

  // His own path through the frame: away up and to the right on an arc, then a
  // slow weave. `moveAlong` gives the heading as well, and the horizontal part
  // of that heading is what he banks into.
  const climb = moveAlong(
    { x: 900, y: 760 },
    { x: 1030, y: 430 },
    (frame - LIFT_AT) / 150,
    { arc: 0.22, ease: kidEase.easeOutSine },
  );
  const weave = Math.sin((frame - LIFT_AT) / 40) * 70;
  const px = frame < LIFT_AT ? 900 + wobble : climb.x + Math.max(0, frame - LIFT_AT - 150) * 0 + weave * 0.4;
  const py = frame < LIFT_AT ? 760 - bob : climb.y;
  const bank = frame < LIFT_AT ? wobble * 0.3 : (climb.angle + 90) * 0.4 + Math.sin((frame - LIFT_AT) / 40) * 5;

  // Frightened for a second, and then delighted for the rest of the episode.
  // The turn is staged in the *gaps*: `scared` lands while he is silent (the
  // rig's squiggle mouth hard-cuts the moment a line opens), and it has already
  // morphed away before his first line starts. The delight arrives between his
  // two lines, which is where script.md puts it.
  const emotion: EmotionInput =
    frame >= upTo + 2
      ? { emotion: "excited", from: "amazed", at: upTo + 2, frames: 8 }
      : frame >= LIFT_AT
        ? { emotion: "amazed", from: "scared", at: LIFT_AT, frames: 8 }
        : frame >= 74
          ? { emotion: "scared", from: "happy", at: 74, frames: 8 }
          : "happy";

  const scale = 1.05;
  const puffY = hover("puff", py, scale);
  const mark: Mark = { x: px, y: puffY, scale, who: "puff", side: px < 960 ? "right" : "left", offset: 360 };

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={3} />
      <RisingWorld rise={rise} grassWind={grassWind} showGrass={rise < 1400} avoidX={px} />
      <WarmCrowd opacity={Math.min(1, Math.max(0, (frame - LIFT_AT + 20) / 40))} />
      {/* The push of air that puts him up there. */}
      {lift > 0 && lift < 44 ? (
        <AirArcs
          x={px}
          y={puffY + 210}
          scale={0.85}
          rot={-90}
          strength={Math.sin((lift / 44) * Math.PI) * 0.55}
          count={3}
        />
      ) : null}
      <Puff
        x={px}
        y={puffY}
        scale={scale}
        opacity={PUFF_OPACITY.afterAir}
        phase={PHASE.puff}
        emotion={emotion}
        speaking={stage.speaking("puff")}
        look={frame < LIFT_AT ? "down" : { x: 0.1, y: -0.4 }}
        bank={bank}
        idle={frame < LIFT_AT ? 1.3 : 1}
        wisps={3}
        zIndex={20}
      />
      <Bubbles scene={scene} cast={{ puff: mark }} text={S15_BUBBLES} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 16 — The rule
// ---------------------------------------------------------------------------
//
// Deliberately *not* a WordCard: WARM AIR RISES is a rule, not a vocabulary
// word, and keeping the letter-bouncing signature for the three real words is
// what makes a card mean "learn this word" (script.md, Production notes). It
// gets a passport stamp with a climbing arrow behind it, and the shot carries
// on rising underneath.

const S16_BUBBLES: Record<string, string> = {
  a2_21_puff: "And I am the warm air!",
};

const RuleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [ruleFrom, ruleTo] = lineWindow(scene, "a2_20_narrator");

  // The stamp lands on the first "Warm air rises" of the line, so the "say it
  // with me" has the picture to sit against.
  const stampAt = Math.round(ruleFrom + (ruleTo - ruleFrom) * 0.28);
  const rise = S15_RISE_END + RISE_SPEED * frame;

  // He rides the arrow: the same 60-frame climb the stamp's own arrows run on,
  // hand-tuned against a still of the landed stamp.
  // He rides the shaft of the arrow *below* the banner, on the same
  // sixty-frame climb the stamp's own arrows run on. Hand-tuned against a
  // still: any higher and the banner is sitting across his face.
  const loop = ((frame / 60) % 1 + 1) % 1;
  const rideY = 760 - loop * 250;
  const rideFade = Math.sin(loop * Math.PI);
  const px = 952;
  const scale = 0.62;
  const puffY = hover("puff", frame >= stampAt ? rideY : 640, scale);

  const emotion = useEmotion(scene, "puff", { a2_21_puff: "excited" }, "excited");

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={3} />
      <RisingWorld rise={rise} grassWind={STILL_AIR} showGrass={false} />
      <WarmCrowd />
      <RuleStamp text="WARM AIR RISES" from={stampAt} y={330} tilt={-3.5} />
      <Puff
        x={px}
        y={puffY}
        scale={scale}
        opacity={PUFF_OPACITY.afterAir * (frame >= stampAt ? 0.72 + 0.28 * rideFade : 1)}
        phase={PHASE.puff}
        emotion={emotion}
        speaking={stage.speaking("puff")}
        look="camera"
        idle={1.1}
        wisps={2}
        zIndex={55}
      />
      <Bubbles
        scene={scene}
        cast={{ puff: { x: px, y: puffY, scale, who: "puff", side: "right" } }}
        text={S16_BUBBLES}
        at={{ a2_21_puff: { x: 1330, y: 810, tail: "left" } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scenes 17 and 18 — the Big Empty, and the FWOOSH that fills it
// ---------------------------------------------------------------------------
//
// The hinge of the episode. Wind is not air deciding to blow; it is air moving
// in to fill a space something else left. Both scenes are the same patch of
// grass, drawn by one component so the gap the cool air slams into in Scene 18
// is unmistakably the gap the audience spent forty-five silent frames looking
// at in Scene 17.

const GAP = { x: 900, y: 786 };
const GAP_R = 196;
const GAP_GROUND = 1010;

/**
 * The outline of the missing Puff: his body, plus the curl off the crown.
 *
 * The curl is the one part of his silhouette a child can name, and it is the
 * whole reason this shape reads as *him* rather than as a puddle — so it is
 * the same geometry the character draws (`curlTail` in
 * lib/kid/characters/Puff.tsx), at the hole's scale rather than redrawn by
 * eye. Frozen at one phase: an absence that wobbles is a thing.
 */
function holePath(r: number): string {
  const k = r / 96;
  const cx = -24 * k;
  const cy = -112 * k;
  const N = 24;
  const outer: string[] = [];
  const inner: string[] = [];
  const f = (v: number): string => v.toFixed(1);
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const a = 0.16 * Math.PI + u * 1.5 * Math.PI;
    const rad = (47 - 35 * u) * k;
    const w = ((22 * (1 - u) ** 0.85 + 2) / 2) * k;
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad;
    outer.push(`${f(px + Math.cos(a) * w)} ${f(py + Math.sin(a) * w)}`);
    inner.push(`${f(px - Math.cos(a) * w)} ${f(py - Math.sin(a) * w)}`);
  }
  inner.reverse();
  return (
    `${blobPath(r, 3.2, 0, 34)} ` +
    `M ${outer[0]} L ${outer.slice(1).join(" L ")} L ${inner.join(" L ")} Z`
  );
}

const GapWorld: React.FC<{
  /** 1 = the hole is wide open, 0 = filled and gone. */
  hole: number;
  /** 0..1 of the flattening wave arriving from both sides (Scene 18). */
  wave: number;
  wind: number;
  seed?: number;
}> = ({ hole, wave, wind, seed = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const w = Math.max(0, Math.min(1, wave));
  return (
    <>
      <GrassWorld ground={GAP_GROUND} wind={wind} seed={seed} />
      <WideLayer>
        {/* A near bank of grass across the bottom of the world. Without it the
            frame is a wall of vertical blades and the gap has to compete with
            fifteen of them; with it the gap has a clean field to sit in, which
            is the difference between an emptiness a six-year-old can find and
            one they cannot. */}
        <path
          d={`M -1200 1420 L -1200 ${GAP_GROUND - 74} Q 900 ${GAP_GROUND - 150} 3200 ${GAP_GROUND - 60} L 3200 1420 Z`}
          fill={kidTheme.grass}
        />
        <path
          d={`M -1200 1420 L -1200 ${GAP_GROUND - 10} Q 900 ${GAP_GROUND - 86} 3200 ${GAP_GROUND + 4} L 3200 1420 Z`}
          fill={kidTheme.grassDark}
          opacity={0.5}
        />
        {/* The grass immediately around the gap leans *in* towards it. That
            lean is the first thing on screen that says the empty space is
            doing something rather than merely being empty. */}
        {Array.from({ length: 18 }, (_, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const k = Math.floor(i / 2);
          const x = GAP.x + side * (GAP_R + 40 + k * 104);
          const h = 250 + ((i * 79) % 150);
          const inward = -side * (74 - k * 8) * hole;
          const flat = w * 150 * (i % 3 === 0 ? 1 : 0.8);
          const sway = wind * 18 * Math.sin(t * 1.5 + i);
          return (
            <path
              key={i}
              d={`M ${x} ${GAP_GROUND - 30} q ${inward * 0.5 + sway} ${-h * 0.6} ${inward + sway * 1.6 - side * flat} ${-h + flat * 0.5}`}
              stroke={i % 2 ? kidTheme.grassDark : "#2e8f3e"}
              strokeWidth={30}
              strokeLinecap="round"
              fill="none"
              opacity={0.95}
            />
          );
        })}
        {/* THE BIG EMPTY. A Puff-shaped absence: the same lobed silhouette the
            character is drawn from — wing, curl and all — darker than the world
            behind it, with a dashed rim so it reads as *his* edge with nothing
            inside it. */}
        {hole > 0.01 ? (
          <g transform={`translate(${GAP.x} ${GAP.y})`} opacity={hole}>
            {/* Kept light on purpose (orchestrator review): at 0.46/0.30 the
                stacked fills read as an ink blot, not an absence — a paused
                frame is what a held beat *is*, and this one holds 1.5s. */}
            <path d={holePath(GAP_R)} fill="#0e2c1c" opacity={0.24} />
            <path d={holePath(GAP_R * 0.8)} fill="#082013" opacity={0.14} />
            <path
              d={holePath(GAP_R)}
              fill="none"
              stroke={kidTheme.airDeep}
              strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray="104 26 62 22"
              opacity={0.8}
            />
          </g>
        ) : null}
      </WideLayer>
    </>
  );
};

const S17_BUBBLES: Record<string, string> = {
  a2_25_puff: "Oops. Sorry about the hole.",
};

const BigEmptyScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [gapFrom] = lineWindow(scene, "a2_24_narrator");

  // The camera is dead still for the whole beat. The most important image in
  // the episode is a picture of nothing, and nothing is hard to find: a push,
  // a drift or a settling anything would take the eye off it. The slow push
  // only starts once the Narrator names the gap.
  const push = interpolate(frame, [gapFrom, gapFrom + 150], [1, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam: Cam = { x: GAP.x, y: GAP.y - 54, zoom: 1.16 * push };

  // He arrives from above, well after the silence has done its work — nothing
  // enters inside a held beat.
  const dropIn = kidEase.easeOutCubic((frame - (gapFrom + 74)) / 34);
  const puffScale = 0.5;
  const puffY = hover("puff", -180 + dropIn * 420, puffScale);
  const puffMark: Mark = {
    x: 1580,
    y: puffY,
    scale: puffScale,
    who: "puff",
    side: "left",
    offset: 300,
  };

  const emotion = useEmotion(scene, "puff", { a2_25_puff: "sad" }, "happy", NO_LEAD);

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={2} />
      <Camera cam={cam}>
        <GapWorld hole={1} wave={0} wind={STILL_AIR} />
        {/* Blades close to the lens on either side, so the gap sits *inside*
            the grass rather than on a wall of it. */}
        <GrassWorld
          layer="front"
          ground={GAP_GROUND}
          wind={STILL_AIR}
          seed={6}
          avoid={[{ x: GAP.x, r: 620 }]}
        />
      </Camera>
      {/* The cut down from the rising shot. */}
      <CutFlash at={0} strength={0.35} />
      {/* The gap sits in a hollow of its own light: a hair of shade around it
          so an emptiness has somewhere to be. */}
      <SoftShade x={GAP.x} y={GAP.y - 40} rx={560} ry={460} strength={0.3} />
      <Puff
        x={puffMark.x}
        y={puffY}
        scale={puffScale}
        opacity={PUFF_OPACITY.afterAir}
        phase={PHASE.puff}
        emotion={emotion}
        speaking={stage.speaking("puff")}
        look={{ x: -0.65, y: 0.55 }}
        idle={0.8}
        wisps={2}
      />
      {/* The phrase stays on screen here — script.md's title note is explicit
          about it. It arrives with the line that names the gap, never inside
          the silence. */}
      {frame >= gapFrom ? (
        <>
          <svg
            width={1920}
            height={1080}
            viewBox="0 0 1920 1080"
            style={{ position: "absolute", left: 0, top: 0, zIndex: 41 }}
            overflow="visible"
          >
            <path
              d={crayonLine(452, 372, 700, 618, 5, 11, Math.floor(frame / 6))}
              stroke={kidTheme.ink}
              strokeWidth={7}
              strokeLinecap="round"
              fill="none"
              opacity={Math.min(1, (frame - gapFrom) / 12) * 0.8}
            />
          </svg>
          <DiagramTag x={400} y={336} text="the BIG EMPTY" from={gapFrom} size={68} tilt={-5} />
        </>
      ) : null}
      <Bubbles
        scene={scene}
        cast={{ puff: puffMark }}
        text={S17_BUBBLES}
        at={{ a2_25_puff: { x: 1060, y: Math.max(190, puffY - 130), tail: "right" } }}
      />
      {/* Nothing else is on screen between beatFrom and the next line. That is
          the point of the beat and it is enforced by everything above starting
          either before it or after it. */}
    </AbsoluteFill>
  );
};

const S18_BUBBLES: Record<string, string> = {
  a2_29_puff: "Who are all these guys?",
};

const COOL_PUFFS = 52;

const FwooshScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage(scene);
  const [, fwooshTo] = lineWindow(scene, "a2_28_narrator");
  const [, beatTo] = heldBeat(scene, "a2_28_narrator");

  // The rush starts on the word and runs through the whole silence the script
  // bought for it — the first wind in the episode arrives as a physical event
  // with no voice over it.
  const rushAt = fwooshTo - 14;
  const rushU = (frame - rushAt) / Math.max(1, beatTo - rushAt);
  // The grass goes down *after* the air arrives, not before it.
  const wave = kidEase.easeOutCubic((frame - rushAt - 12) / 34);
  const hole = 1 - kidEase.easeInOutSine((frame - rushAt - 6) / 30);
  const wind = frame < rushAt ? STILL_AIR : Math.min(0.75, 0.1 + (frame - rushAt) / 30);

  const puffScale = 0.5;
  const puffY = hover("puff", 250, puffScale);
  const puffMark: Mark = { x: 1490, y: puffY, scale: puffScale, who: "puff", side: "left", offset: 300 };

  const emotion = useEmotion(scene, "puff", { a2_29_puff: "amazed" }, "happy", NO_LEAD);

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={2} />
      <GapWorld hole={Math.max(0, hole)} wave={wave} wind={wind} />
      {/* Cool air, pouring in *sideways* from both sides of frame. Direction is
          the whole pedagogy of this scene: half a wind is the warm air going
          up, and the half you feel on your face is this. Nothing falls in. */}
      <CoolRush from={rushAt} frame={frame} fps={fps} />
      {/* One leaf, tumbling past under the silence. */}
      <TumblingLeaf at={rushAt + 8} />
      <Puff
        x={puffMark.x}
        y={puffY}
        scale={puffScale}
        opacity={PUFF_OPACITY.afterAir}
        phase={PHASE.puff}
        emotion={emotion}
        speaking={stage.speaking("puff")}
        look={{ x: -0.6, y: 0.6 }}
        idle={0.9}
        wisps={2}
        bank={Math.sin(frame / 22) * 4}
      />
      <Bubbles
        scene={scene}
        cast={{ puff: puffMark }}
        text={S18_BUBBLES}
        at={{ a2_29_puff: { x: 1064, y: 190, tail: "right" } }}
      />
      {/* A hair of speed on the frame as the wall of air goes through. */}
      {rushU > 0 && rushU < 1.4 ? (
        <AbsoluteFill
          style={{
            background: `linear-gradient(90deg, rgba(158,201,232,0.34) 0%, rgba(158,201,232,0) 34%, rgba(158,201,232,0) 66%, rgba(158,201,232,0.34) 100%)`,
            opacity: Math.max(0, 1 - rushU),
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * The cool air arriving. Every puff travels **horizontally** along the ground
 * from off frame to the gap; nothing drops in from above, ever. The arrivals
 * are staggered so the rush has a front rather than a start pistol, and once
 * they have filled the gap they keep streaming through it — the wind does not
 * stop when the hole is full.
 */
const CoolRush: React.FC<{
  /** Frame the front arrives on. */
  from: number;
  frame: number;
  fps: number;
  /**
   * After the first pass, the stream keeps coming round: wind does not stop
   * once the hole is full. Off for the very first arrival, on for everything
   * downstream of it (including the frozen still in Scene 19).
   */
  loop?: boolean;
}> = ({ from, frame, fps, loop = true }) => {
  const t = frame / fps;
  if (frame < from - 4) return null;
  const CYCLE = 3400;
  return (
    <WideLayer zIndex={22}>
      {Array.from({ length: COOL_PUFFS }, (_, i) => {
        // `side` is which edge it enters from; `dir` is the way it travels.
        const side = i % 2 === 0 ? -1 : 1;
        const dir = -side;
        const lane = Math.floor(i / 2);
        const y = 560 + ((lane * 211) % 380);
        // A front, not a start pistol: the first few are almost immediate and
        // the rest pile in behind them over about a second.
        const delay = (i % 5) * 3 + ((i * 13) % 34);
        const speed = 44 + ((i * 31) % 16);
        const raw = (frame - from - delay) * speed;
        if (raw <= 0) return null;
        // Every third one is a *filler*: it runs into the gap, stops dead and
        // folds into it. The rest stream straight past — which together is
        // what a gap being filled by a wind actually looks like.
        const filler = i % 3 === 0;
        const startX = side < 0 ? -300 : 2220;
        const travelled = loop && !filler ? raw % CYCLE : raw;
        const px = startX + dir * travelled;
        const stopAt = GAP.x + side * (GAP_R + 40);
        const reached = dir > 0 ? px >= stopAt : px <= stopAt;
        const x = filler && reached ? stopAt : px;
        const overshoot = filler && reached ? (px - stopAt) * dir : 0;
        // A filler holds in the gap and folds into it over about a second,
        // rather than blinking out the moment it arrives.
        const fade = filler ? Math.max(0, 1 - overshoot / 1100) : 1;
        if (fade <= 0.02) return null;
        if (x < -760 || x > 2680) return null;
        const r = 30 + ((i * 47) % 30);
        return (
          <g key={i} opacity={fade}>
            {/* Speed streaks behind each one — sideways, always sideways. */}
            <path
              d={`M ${x - dir * (r + 40)} ${y} l ${-dir * (150 + ((i * 37) % 120))} 0`}
              stroke={kidTheme.airDeep}
              strokeWidth={8}
              strokeLinecap="round"
              opacity={0.45}
            />
            <AirBlob
              x={x}
              y={y + Math.sin(t * 2.4 + i) * 8}
              r={r}
              t={t + i}
              seed={i * 1.3}
              fill={kidTheme.airCool}
              edge={kidTheme.airDeep}
              opacity={0.82}
              flip={dir < 0}
              points={14}
            />
          </g>
        );
      })}
    </WideLayer>
  );
};

const TumblingLeaf: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const u = (frame - at) / 74;
  if (u < 0 || u > 1) return null;
  const p = moveAlong({ x: -180, y: 720 }, { x: 2160, y: 560 }, u, {
    arc: 0.14,
    ease: kidEase.easeOutSine,
  });
  return (
    <WideLayer zIndex={24}>
      <g transform={`translate(${p.x} ${p.y}) rotate(${u * 900})`}>
        <path
          d="M 0 -46 C 34 -30 42 12 0 46 C -42 12 -34 -30 0 -46 Z"
          fill={kidTheme.grass}
          stroke={kidTheme.grassDark}
          strokeWidth={7}
        />
        <path d="M 0 -42 L 0 44" stroke={kidTheme.grassDark} strokeWidth={5} />
      </g>
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 19 — Big Word Two: WIND
// ---------------------------------------------------------------------------

const S19_CARD_Y = 300;

const BigWordWindScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [nameFrom, nameTo] = lineWindow(scene, "a2_31_narrator");
  const [chantFrom] = lineWindow(scene, "a2_32_puff");

  // The freeze lands on the word itself: "…sideways air has a name. Wind."
  const slamAt = Math.round(nameFrom + (nameTo - nameFrom) * 0.86);
  const splitAt = Math.max(slamAt + 20, chantFrom - 8);

  const emotion = useEmotion(
    scene,
    "puff",
    { a2_32_puff: "excited", a2_34_puff: "proud" },
    "amazed",
    // Two twelve-frame held beats in this scene.
    NO_LEAD,
  );

  const perch = { x: 1420, y: 600 };
  const scale = 0.5;

  return (
    <AbsoluteFill>
      <BigWordBeat
        scene={scene}
        word="WIND"
        syllables={["W", "I", "N", "D"]}
        chantKey="a2_32_puff"
        slamAt={slamAt}
        color={ACT_COLOR.wind}
        sub="air in a hurry"
        y={S19_CARD_Y}
        freeze={<RushStill />}
      >
        {/* Speed-lines streaming off the trailing D. */}
        <SpeedLines from={slamAt} y={S19_CARD_Y} split={splitAt} />
        <Puff
          x={perch.x}
          y={hover("puff", perch.y, scale)}
          scale={scale}
          opacity={PUFF_OPACITY.afterAir}
          phase={PHASE.puff}
          emotion={emotion}
          speaking={stage.speaking("puff")}
          look="camera"
          idle={0.9}
          wisps={3}
          bank={Math.sin(frame / 18) * 5}
          zIndex={55}
        />
      </BigWordBeat>
    </AbsoluteFill>
  );
};

/** The picture the Big Word freezes: Scene 18's rush, still going sideways. */
const RushStill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={2} />
      <GapWorld hole={0} wave={1} wind={0.7} />
      <CoolRush from={0} frame={frame + 300} fps={fps} />
    </AbsoluteFill>
  );
};

const SpeedLines: React.FC<{ from: number; y: number; split: number }> = ({ from, y, split }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - from;
  if (f < 0) return null;
  const grow = spring({ frame: f, fps, config: { damping: 13, mass: 0.5 } });
  // After the word breaks into blocks the lines move out with the D.
  const shift = frame >= split ? Math.min(1, (frame - split) / 10) * 90 : 0;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", left: 0, top: 0, zIndex: 52, pointerEvents: "none" }}
      overflow="visible"
    >
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const ly = y - 96 + i * 40;
        const len = (230 + ((i * 97) % 190)) * grow;
        const wobble = Math.sin(frame / 7 + i * 1.4) * 8;
        const x0 = 1210 + shift + ((i * 53) % 60);
        return (
          <path
            key={i}
            d={`M ${x0} ${ly + wobble} L ${x0 + len} ${ly + wobble * 0.4}`}
            stroke={i % 2 ? kidTheme.paper : ACT_COLOR.wind}
            strokeWidth={i % 2 ? 12 : 16}
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 20 — Am I the wind?
// ---------------------------------------------------------------------------
//
// The correction the story itself could have caused: wind is not a substance,
// it is a *behaviour* of one. So the picture stops being about Puff — the whole
// hillside turns over in one visible circuit, warm going up on the sunny slope,
// cool coming back along the ground, and we pull out until he is one dot in it.

const CIRCUIT_PUFFS = 168;
const CIRCUIT = { cx: 980, cy: 556, rx: 760, ry: 296 };

function circuitAt(u: number): { x: number; y: number; warm: number } {
  const th = u * Math.PI * 2;
  const x = CIRCUIT.cx + CIRCUIT.rx * Math.cos(th);
  const y = CIRCUIT.cy + CIRCUIT.ry * Math.sin(th);
  // Warm on the way up the left, cool on the way down the right and back along
  // the ground: 1 where the vertical motion is upward, 0 where it is not.
  const warm = Math.max(0, -Math.cos(th));
  return { x, y, warm };
}

const S20_BUBBLES: Record<string, string> = {
  a2_35_puff: "Am I the wind?",
  a2_37_puff: "Everybody gets wind. Because of me.",
};

const AmIWindScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage(scene);
  const t = frame / fps;
  const [outFrom] = lineWindow(scene, "a2_37_puff");

  // The pull-back: he does not move, the frame does. By the last line he is a
  // dot in a pattern that covers the hill, which is the honest scale.
  const zoom = interpolate(frame, [outFrom, outFrom + 200], [1.02, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam: Cam = { x: 960, y: 520, zoom };

  const puffScale = 1;
  const puffY = hover("puff", 470 + Math.sin(t * 0.9) * 12, puffScale);
  const puffMark: Mark = { x: 700, y: puffY, scale: puffScale, who: "puff", side: "right", offset: 360 };

  const emotion = useEmotion(
    scene,
    "puff",
    { a2_35_puff: "amazed", a2_37_puff: "excited" },
    "happy",
  );

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={1} />
      <Camera cam={cam}>
        <Hill wind={0.5} crest={880} />
        {/* The sunlit slope the warm air is coming off. Without it the circuit
            is a ring in the sky; with it, it is a thing the hill is doing. */}
        <SoftShade x={620} y={900} rx={760} ry={420} strength={0.3} color="255,206,120" />
        <Circuit t={t} />
        <Puff
          x={puffMark.x}
          y={puffY}
          scale={puffScale}
          opacity={PUFF_OPACITY.afterAir}
          phase={PHASE.puff}
          emotion={emotion}
          speaking={stage.speaking("puff")}
          look={frame < outFrom ? "up" : "camera"}
          idle={0.9}
          wisps={3}
          bank={Math.sin(t * 0.7) * 5}
          zIndex={20}
        />
      </Camera>
      <Bubbles scene={scene} cast={{ puff: projectMark(cam, puffMark) }} text={S20_BUBBLES} />
    </AbsoluteFill>
  );
};

/** Hundreds of puffs on one slow, visible circuit over the hillside. */
const Circuit: React.FC<{ t: number }> = ({ t }) => (
  <WideLayer>
    {Array.from({ length: CIRCUIT_PUFFS }, (_, i) => {
      // Three nested loops of slightly different size, so the circuit reads as
      // a body of air turning over rather than as beads on one wire.
      const ring = i % 3;
      const spread = 1 - ring * 0.19;
      const u = ((t * 0.055 + i / CIRCUIT_PUFFS + ring * 0.11) % 1 + 1) % 1;
      const p = circuitAt(u);
      const x = CIRCUIT.cx + (p.x - CIRCUIT.cx) * spread + Math.sin(t + i) * 10;
      const y = CIRCUIT.cy + (p.y - CIRCUIT.cy) * spread + Math.cos(t * 0.8 + i) * 8;
      const r = 27 + ((i * 37) % 20);
      const warm = p.warm;
      return (
        <AirBlob
          key={i}
          x={x}
          y={y}
          r={r}
          t={t + i}
          seed={i * 0.4}
          // Warm going up the sunny side, cool coming back along the ground:
          // one loop, two colours, and the colour *is* the explanation.
          fill={warm > 0.35 ? "#ffcfa6" : kidTheme.airCool}
          edge={warm > 0.35 ? kidTheme.sunDark : kidTheme.airDeep}
          opacity={0.5 + 0.32 * warm}
          points={12}
        />
      );
    })}
  </WideLayer>
);

// ---------------------------------------------------------------------------
// Scene 21 — Sunny, insufferably, correct
// ---------------------------------------------------------------------------

const S21_SUNNY = { x: 1450, y: 410, scale: 1.12 };
const S21_PUFF = { x: 250, y: 214, scale: 0.5 };
const S21_DIAGRAM = { left: 190, right: 1120, ground: 850 };
const GLOBE = { x: 700, y: 560, r: 250 };

const S21_BUBBLES: Record<string, string> = {
  a2_39_sunny: "Who warmed the ground?",
  a2_40_puff: "Um. You did.",
  a2_42_sunny: "I MAKE ALL THE WIND.",
};

const SunnyCorrectScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage(scene);
  const tick = Math.floor(frame / 6);
  const [chainFrom] = lineWindow(scene, "a2_41_sunny");
  const [planetFrom, planetTo] = lineWindow(scene, "a2_42_sunny");
  const [concedeFrom] = lineWindow(scene, "a2_44_narrator");
  const [beatFrom] = heldBeat(scene, "a2_44_narrator");

  // He slides in at maximum brightness, and the chain assembles from his beams
  // as he lists it: sun to ground, ground to air, air upward — one link per
  // clause of a2_41 — then cool air sideways as the last brag opens.
  const slide = kidEase.easeOutBack((frame - 4) / 26, 1.15);
  const sunnyX = 2420 + (S21_SUNNY.x - 2420) * Math.max(0, Math.min(1, slide));
  const chain = lineProgress(scene, "a2_41_sunny", frame);
  const link1 = chainFrom > 0 ? Math.max(0, Math.min(1, (chain - 0.02) / 0.24)) : 0;
  const link2 = Math.max(0, Math.min(1, (chain - 0.34) / 0.24));
  const link3 = Math.max(0, Math.min(1, (chain - 0.68) / 0.26));
  const link4 = kidEase.easeOutCubic((frame - planetFrom - 6) / 34);

  // Planetary on the last brag, and packed away again before the concession
  // ends: the held beat is Sunny alone in frame.
  const globe = kidEase.easeOutCubic((frame - (planetFrom + (planetTo - planetFrom) * 0.42)) / 40);
  const pack = kidEase.easeInOutSine((frame - concedeFrom - 10) / 46);
  const diagramAlpha = Math.max(0, 1 - Math.max(globe, pack));
  const globeAlpha = Math.max(0, globe - pack);

  // Puff leaves under the concession, so nothing exits inside the silence.
  // The push finishes eight frames before the silence opens: the beat itself
  // is motionless, and what it holds on is a face big enough to read.
  const closeIn = interpolate(frame, [concedeFrom + 12, beatFrom - 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const sunCam: Cam = {
    x: S21_SUNNY.x,
    y: S21_SUNNY.y,
    zoom: 1 + 0.44 * closeIn,
    dx: -300 * closeIn,
    dy: 70 * closeIn,
  };
  const puffOut = kidEase.easeInOutSine((frame - concedeFrom - 20) / 40);
  const puffY = hover("puff", S21_PUFF.y - puffOut * 520, S21_PUFF.scale);

  // **Emotion lead 0, by construction.** Sunny's face is `proud` for the whole
  // scene and only widens into the grin on the first frame of the held beat —
  // the Narrator's concession has finished, and the grown-up laugh goes into
  // the silence after it, not into the line.
  const sunnyEmotion: EmotionInput =
    frame >= beatFrom
      ? { emotion: "excited", from: "proud", at: beatFrom, frames: 10 }
      : "proud";
  const puffEmotion = useEmotion(scene, "puff", { a2_40_puff: "neutral" }, "happy", NO_LEAD);

  const puffMark: Mark = {
    x: S21_PUFF.x,
    y: puffY,
    scale: S21_PUFF.scale,
    who: "puff",
    side: "right",
    offset: 260,
  };

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={1} />
      {/* Maximum brightness: the whole frame is lit from his side. */}
      <AbsoluteFill
        style={{
          // Near-white rather than gold: saturated yellow laid over a blue sky
          // turns it olive, and what "maximum brightness" wants is glare.
          background: `radial-gradient(ellipse ${1300 * (1 + 0.44 * closeIn)}px ${1000 * (1 + 0.44 * closeIn)}px at ${sunnyX - 300 * closeIn}px ${S21_SUNNY.y + 70 * closeIn}px, rgba(255,250,232,0.6) 0%, rgba(255,244,206,0.26) 40%, rgba(255,240,190,0) 74%)`,
          pointerEvents: "none",
        }}
      />
      <ChainDiagram
        alpha={diagramAlpha}
        link1={link1}
        link2={link2}
        link3={link3}
        link4={link4}
        from={{ x: sunnyX - 190, y: S21_SUNNY.y + 150 }}
        tick={tick}
        frame={frame}
      />
      <Globe alpha={globeAlpha} lit={Math.max(0, Math.min(1, (frame - planetTo + 40) / 30))} frame={frame} />
      <Camera cam={sunCam}>
        <Sunny
          x={sunnyX}
          y={S21_SUNNY.y}
          scale={S21_SUNNY.scale}
          phase={PHASE.sunny}
          emotion={sunnyEmotion}
          speaking={stage.speaking("sunny")}
          look={{ x: -0.35, y: 0.2 }}
          shades={1}
          raySpeed={0.4}
          idle={1.1}
          zIndex={30}
        />
      </Camera>
      <Puff
        x={S21_PUFF.x}
        y={puffY}
        scale={S21_PUFF.scale}
        opacity={PUFF_OPACITY.afterAir}
        phase={PHASE.puff}
        emotion={puffEmotion}
        speaking={stage.speaking("puff")}
        look={{ x: 0.85, y: -0.2 }}
        idle={0.8}
        wisps={2}
      />
      <Bubbles
        scene={scene}
        cast={{ sunny: { x: sunnyX, y: S21_SUNNY.y, scale: S21_SUNNY.scale, who: "sunny" }, puff: puffMark }}
        text={S21_BUBBLES}
        at={{
          a2_39_sunny: { x: 900, y: 180, tail: "right" },
          a2_42_sunny: { x: 900, y: 180, tail: "right" },
          a2_40_puff: { x: 620, y: 210, tail: "left" },
        }}
      />
      {/* Frames 578–623 are his and nothing else's. */}
      {/* The spring in his rays as the grin lands — his only tell, and it is
          eleven frames after the Narrator stops talking. */}
      {frame >= beatFrom ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 1200px 900px at ${sunnyX - 300 * closeIn}px ${S21_SUNNY.y + 70 * closeIn}px, rgba(255,246,190,${0.3 * spring({ frame: frame - beatFrom, fps, config: { damping: 14, mass: 0.9 } })}) 0%, rgba(255,246,190,0) 70%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/** The causal chain, assembling out of Sunny's own beams as he lists it. */
const ChainDiagram: React.FC<{
  alpha: number;
  link1: number;
  link2: number;
  link3: number;
  link4: number;
  from: { x: number; y: number };
  tick: number;
  frame: number;
}> = ({ alpha, link1, link2, link3, link4, from, tick, frame }) => {
  if (alpha <= 0.01) return null;
  const g = S21_DIAGRAM.ground;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", left: 0, top: 0, zIndex: 12 }}
      opacity={alpha}
      overflow="visible"
    >
      {/* The ground, and how hot it is. */}
      <rect x={-80} y={g} width={2080} height={320} fill={kidTheme.earth} />
      <rect x={-80} y={g - 6} width={2080} height={30} fill={kidTheme.grassDark} />
      <rect x={-80} y={g} width={2080} height={320} fill={kidTheme.sunDeep} opacity={0.75 * link1} />
      {/* 1. sun to ground — the beam leaves *him*. */}
      <CrayonArrow
        from={from}
        to={{ x: 860, y: g - 12 }}
        color={kidTheme.sunDark}
        width={18}
        seed={2}
        tick={tick}
        reveal={link1}
        head={46}
      />
      {/* 2. ground to air, straight off the hot soil. */}
      {link2 > 0.02
        ? [0, 1, 2].map((i) => {
            const u = ((frame / 40 + i / 3) % 1 + 1) % 1;
            return (
              <HeatArrow
                key={i}
                x={420 + i * 210}
                y={g - 12}
                height={210 * link2}
                color={kidTheme.tomato}
                u={u}
                width={15}
                amp={13}
                seed={i * 2.1}
              />
            );
          })
        : null}
      {/* 3. air upward, out of the top of that column. */}
      <CrayonArrow
        from={{ x: 630, y: g - 250 }}
        to={{ x: 630, y: g - 250 - 300 * link3 }}
        color={kidTheme.pink}
        width={30}
        seed={7}
        tick={tick}
        reveal={link3 > 0 ? 1 : 0}
        head={70}
      />
      {/* 4. cool air sideways, along the ground, into the space it left — and
             once it is drawn, air keeps arriving along it. */}
      <CrayonArrow
        from={{ x: S21_DIAGRAM.left - 30, y: g - 58 }}
        to={{ x: 560, y: g - 58 }}
        color={ACT_COLOR.wind}
        width={24}
        seed={5}
        tick={tick}
        reveal={link4}
        head={60}
      />
      {link4 > 0.6
        ? [0, 1, 2].map((i) => {
            const u = ((frame / 52 + i / 3) % 1 + 1) % 1;
            return (
              <AirBlob
                key={i}
                x={S21_DIAGRAM.left - 30 + u * 560}
                y={g - 58}
                r={26}
                t={frame / 30 + i}
                seed={i}
                fill={kidTheme.airCool}
                edge={kidTheme.airDeep}
                opacity={0.5 * Math.sin(u * Math.PI)}
                points={12}
              />
            );
          })
        : null}
    </svg>
  );
};

/** The last brag: every wind arrow on Earth, lighting up at once. */
const Globe: React.FC<{ alpha: number; lit: number; frame: number }> = ({ alpha, lit, frame }) => {
  if (alpha <= 0.01) return null;
  const spin = frame * 0.22;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", left: 0, top: 0, zIndex: 14 }}
      opacity={alpha}
      overflow="visible"
    >
      <g transform={`translate(${GLOBE.x} ${GLOBE.y}) scale(${0.6 + 0.4 * Math.min(1, alpha * 1.6)})`}>
        <circle r={GLOBE.r} fill={kidTheme.skyMid} stroke={kidTheme.ink} strokeWidth={12} />
        <path
          d="M -170 -110 q 70 -60 140 -20 q 50 30 10 80 q -50 60 -120 30 q -60 -30 -30 -90 Z"
          fill={kidTheme.grass}
          stroke={kidTheme.grassDark}
          strokeWidth={8}
        />
        <path
          d="M 30 40 q 80 -40 130 20 q 30 60 -40 90 q -80 30 -110 -30 q -20 -50 20 -80 Z"
          fill={kidTheme.grass}
          stroke={kidTheme.grassDark}
          strokeWidth={8}
        />
        {/* Wind, everywhere, all at once. */}
        {Array.from({ length: 14 }, (_, i) => {
          const row = i % 7;
          const y = -200 + row * 66;
          const half = Math.sqrt(Math.max(0, GLOBE.r * GLOBE.r - y * y)) * 0.86;
          const dir = row % 2 === 0 ? 1 : -1;
          const phase = ((frame / 44 + i / 14) % 1 + 1) % 1;
          const x = -half + phase * half * 2;
          const on = Math.max(0, Math.min(1, lit * 1.4 - i * 0.02));
          return (
            <g key={i} opacity={0.35 + 0.65 * on}>
              <path
                d={`M ${x * dir - 40 * dir} ${y} l ${64 * dir} 0`}
                stroke={kidTheme.paper}
                strokeWidth={9}
                strokeLinecap="round"
              />
              <path
                d={`M ${x * dir + 24 * dir} ${y - 16} l ${20 * dir} 16 l ${-20 * dir} 16`}
                stroke={kidTheme.paper}
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          );
        })}
        <circle r={GLOBE.r} fill="none" stroke={kidTheme.paper} strokeWidth={4} opacity={0.35} transform={`rotate(${spin})`} strokeDasharray="40 900" />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 22 — Not sorry
// ---------------------------------------------------------------------------
//
// The arc's turning point, and the script stages it in one word: the shape of
// him firms up mid-apology. So it is staged simply — one character, open sky,
// nothing else on screen — and the only thing that changes across the silence
// is how solid he is. `PUFF_OPACITY.afterAir` to `.notSorry`, and no third
// number anywhere.

const S22_X = 960;
const S22_SCALE = 1.35;

const S22_BUBBLES: Record<string, string> = {
  // The gag's last-but-one firing, verbatim: the audience is counting these.
  a2_46_puff: "Sorry, everybody!",
  a2_47_puff: "No. Wait. Not sorry.",
  a2_48_puff: "I move flowers. I am STUFF.",
};

const NotSorryScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage(scene);
  const [beatFrom, beatTo] = heldBeat(scene, "a2_46_puff");
  const [notFrom] = lineWindow(scene, "a2_47_puff");
  const [boastFrom] = lineWindow(scene, "a2_48_puff");

  // The turn is in the silence. He hangs there hearing himself apologise, and
  // over thirty frames the shape of him gathers: he goes from the fifty-five
  // percent he has worn since the AIR card to seventy, draws himself up, and
  // stops drifting. His *face* does not move until the next line — emotion
  // lead 0 — because a face that turns inside the beat spends it early.
  const firm = kidEase.easeInOutSine((frame - beatFrom) / Math.max(1, beatTo - beatFrom));
  const opacity =
    PUFF_OPACITY.afterAir + (PUFF_OPACITY.notSorry - PUFF_OPACITY.afterAir) * firm;
  const drawUp = firm * 0.05 + (frame >= boastFrom ? kidEase.easeOutBack((frame - boastFrom) / 24, 1.2) * 0.05 : 0);
  const ring = frame >= notFrom ? settleWave((frame - notFrom) / (fps * 0.9), 1.2, 4) : 0;

  const emotion = useEmotion(
    scene,
    "puff",
    { a2_46_puff: "sad", a2_47_puff: "proud", a2_48_puff: "excited" },
    "sad",
    NO_LEAD,
  );

  const y = hover("puff", 520 - firm * 18, S22_SCALE);

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={3} />
      {/* Open sky, and a long way down: the hill he lifted off is a pale line
          at the bottom of frame and nothing else is in the shot. */}
      <WideLayer opacity={0.5}>
        <path
          d="M -1200 1120 Q 500 940 1400 1050 Q 2400 1160 3200 1040 L 3200 1800 L -1200 1800 Z"
          fill={kidTheme.grass}
        />
      </WideLayer>
      <Camera cam={{ x: S22_X, y: 900, zoom: 1 - drawUp * 0.4, zoomY: 1 + drawUp }}>
        <Puff
          x={S22_X}
          y={y}
          scale={S22_SCALE * (1 + ring * 0.04)}
          opacity={opacity}
          phase={PHASE.puff}
          emotion={emotion}
          speaking={stage.speaking("puff")}
          look={frame >= beatFrom && frame < notFrom ? "down" : "camera"}
          pose={frame < beatTo ? "hug" : frame >= boastFrom ? "cheer" : "rest"}
          idle={frame >= beatFrom ? 0.55 : 1}
          eyeLife={frame >= beatFrom && frame < notFrom ? 0.4 : 1}
          wisps={3}
        />
      </Camera>
      {/* The light agrees with him, a little, once he stops apologising. */}
      <SoftShade
        x={S22_X}
        y={480}
        rx={620}
        ry={480}
        strength={-0.001 + 0.18 * Math.max(0, firm)}
        color="255,246,205"
      />
      <Bubbles
        scene={scene}
        cast={{ puff: { x: S22_X, y, scale: S22_SCALE, who: "puff", side: "right", offset: 470 } }}
        text={S22_BUBBLES}
      />
    </AbsoluteFill>
  );
};

export const ACT2_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s12_sunny: SunnyAgainScene,
  s13_rock: RockScene,
  s14_ground_heats: GroundHeatsScene,
  s15_up: UpScene,
  s16_rule_warm_air_rises: RuleScene,
  s17_big_empty: BigEmptyScene,
  s18_fwoosh: FwooshScene,
  s19_bigword_wind: BigWordWindScene,
  s20_am_i_the_wind: AmIWindScene,
  s21_sunny_correct: SunnyCorrectScene,
  s22_not_sorry: NotSorryScene,
};
