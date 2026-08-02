import React from "react";
import {
  emotionAt,
  kidEase,
  kidTheme,
  mixHex,
  moveAlong,
  settleWave,
} from "../../../lib/kid";
import {
  ACT_COLOR,
  AbsoluteFill,
  BigWordBeat,
  Bubbles,
  Camera,
  CutFlash,
  Drip,
  INDIGO_LAG,
  KidContactShadow,
  PHASE,
  PaintedSky,
  RAY_LIGHT,
  RAY_SPECTRUM,
  Ray,
  RayShard,
  SEVEN,
  SHARD_BODY,
  SHARD_PHASE,
  SPECTRUM,
  Shard,
  SoftShade,
  Sunny,
  WideLayer,
  YELLOW_WAVE,
  arcPoint,
  blueRicochet,
  faceOf,
  greenSit,
  heldBeat,
  hover,
  interpolate,
  lineProgress,
  lineWindow,
  projectMark,
  shardPoint,
  spring,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Box,
  type Cam,
  type Cast,
  type Mark,
  type TimedScene,
} from "./common";

// ACT ONE — SEVEN ALL ALONG. Scenes 3–13 of script.md.
//
// Four worlds in eleven scenes, which is more than either previous act, and the
// reason is the journey: the Sun, deep space, a garden, and a rainbow standing
// in it. What holds the act together is not a geography, it is **Ray's
// brightness**. He starts at `RAY_LIGHT.actOne`, dips to `.lowest` in Scene 7
// where he says he is the plain one, and finishes Scene 13 at `.afterRainbow`
// with the seven colours in his outline for the rest of the episode. Nothing in
// dialogue ever mentions any of it.
//
// Two act-wide rules, enforced here rather than per scene:
//
//   **Emotion lead 0 on every held-beat scene.** Twelve of the episode's
//   forty-one beats are in this act, and the script is explicit: the default
//   eight-frame `useEmotion` lead lands a reaction inside the silence the joke
//   is being held for.
//
//   **Ray is white on bright plates, and that is a legibility problem the whole
//   act pays attention to.** His outline is `edge`-able to ink for the two
//   scenes staged against gold, `SoftShade` darkens the world behind him where
//   the lawn is at its brightest, and he takes a `KidContactShadow` wherever he
//   is near a surface. This is the Puff problem at the other end of the value
//   scale and it gets the same amount of care.

/** The act's held-beat scenes cut the emotion lead to zero (script.md). */
const NO_LEAD = 0;

const W = 1920;
const H = 1080;

/** Grey, for a thing the light has left. Scene 6's whole argument. */
const UNLIT = "#8d949c";

// ---------------------------------------------------------------------------
// Scene 3 — Ninety three million miles away
// ---------------------------------------------------------------------------

const S3_RAY = { x: 690, y: 688, scale: 0.44 };
const S3_SUNNY: Mark = { x: 1430, y: hover("sunny", 214, 1.45), scale: 1.45, who: "sunny", side: "left" };

const S3_BUBBLES: Record<string, string> = {
  a1_03_sunny: "GOOD MORNING, EVERYBODY!",
  a1_05_sunny: "I MADE all of you!",
  a1_07_ray: "I'm Ray! It's my first day!",
};

const SunScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [pushFrom] = lineWindow(scene, "a1_06_narrator");
  const [rayFrom] = lineWindow(scene, "a1_07_ray");

  // The whip out of the cold open's blue sky. Ten frames of the world arriving
  // sideways under a flash — light does not fade up and neither does this.
  const whip = kidEase.easeOutCubic(frame / 10);

  // Then a long push in on one beam near the back, starting under a1_06
  // ("There are more sunbeams than there are grains of sand. Here is one.").
  const zoom = interpolate(frame, [pushFrom, rayFrom + 12], [1, 2.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam: Cam = { x: S3_RAY.x, y: S3_RAY.y, zoom, dx: (1 - whip) * 980 };

  const rayMark: Mark = { ...S3_RAY, y: hover("ray", S3_RAY.y, S3_RAY.scale), who: "ray" };
  const emotion = useEmotion(scene, "ray", { a1_07_ray: "excited" }, "happy");
  const sunnyEmotion = useEmotion(
    scene,
    "sunny",
    { a1_03_sunny: "excited", a1_05_sunny: "proud" },
    "proud",
  );
  const stage = useStage(scene);

  return (
    <AbsoluteFill>
      <PaintedSky bg="sun_surface" phase={0.2} drift={9} />
      <Camera cam={cam}>
        {/* The launch rail: a bar of hard light running off both sides of
            frame, with the stadium of beams standing on it. */}
        <LaunchRail y={1006} />
        <BeamCrowd />
        <Ray
          x={S3_RAY.x}
          y={hover("ray", S3_RAY.y, S3_RAY.scale)}
          scale={S3_RAY.scale}
          brightness={RAY_LIGHT.actOne}
          spectrum={RAY_SPECTRUM.none}
          phase={PHASE.ray}
          emotion={emotion}
          speaking={stage.speaking("ray")}
          look={frame >= rayFrom ? "camera" : "upRight"}
          // Ink rather than amber: this is the one plate in the episode that is
          // the same hue as he is, and an amber outline on gold disappears.
          edge={kidTheme.ink}
          streak={0.35}
          pose={frame < rayFrom ? "wave" : "rest"}
          wave={0.6}
          zIndex={20}
        />
        <Sunny
          x={S3_SUNNY.x}
          y={S3_SUNNY.y}
          scale={1.45}
          phase={PHASE.sunny}
          emotion={sunnyEmotion}
          speaking={stage.speaking("sunny")}
          look={{ x: -0.4, y: 0.3 }}
          zIndex={10}
        />
      </Camera>
      <CutFlash at={0} strength={0.55} />
      <Bubbles
        scene={scene}
        cast={
          {
            sunny: projectMark(cam, S3_SUNNY),
            ray: projectMark(cam, rayMark),
          } as Cast
        }
        text={S3_BUBBLES}
        at={{
          a1_03_sunny: { x: 700, y: 250, tail: "right", tailAt: 1180 },
          a1_05_sunny: { x: 700, y: 250, tail: "right", tailAt: 1180 },
          a1_07_ray: { x: 980, y: 300, tail: "left", tailAt: 800 },
        }}
      />
    </AbsoluteFill>
  );
};

/** The rail every sunbeam on the Sun is queuing on. */
const LaunchRail: React.FC<{ y: number }> = ({ y }) => (
  <WideLayer>
    <rect x={-1600} y={y} width={5200} height={30} rx={15} fill={kidTheme.sunLight} opacity={0.85} />
    <rect x={-1600} y={y + 26} width={5200} height={54} fill={kidTheme.sunDeep} opacity={0.5} />
  </WideLayer>
);

/**
 * A zillion sunbeams, packed shoulder to shoulder like a stadium crowd.
 *
 * Cheap on purpose — eighty of them at four depths, each one a lozenge, two dot
 * eyes and a smile arc, bobbing on its own phase. **No rigs**: a crowd is a
 * texture, and eighty `useRig` calls to make eighty 40px faces blink is eighty
 * hooks spent on something nobody can see. The one beam that gets the hero
 * component is Ray, which is the whole point of the shot.
 *
 * They are drawn back-to-front and get bigger as they come forward, so the push
 * in has somewhere to go.
 */
const BeamCrowd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rows = [
    { y: 706, n: 27, r: 26, dim: 0.72 },
    { y: 790, n: 23, r: 34, dim: 0.82 },
    { y: 880, n: 19, r: 44, dim: 0.92 },
    { y: 976, n: 15, r: 56, dim: 1 },
  ];
  return (
    <WideLayer>
      {rows.map((row, ri) =>
        Array.from({ length: row.n }, (_, i) => {
          const k = ri * 31 + i * 17;
          const x = -260 + (2440 / (row.n - 1)) * i + ((k * 41) % 46) - 23;
          // Ray's own spot in the back row is left empty — he is drawn there
          // by the hero component, and a crowd beam under him would double.
          if (ri === 0 && Math.abs(x - S3_RAY.x) < 70) return null;
          const bob = Math.sin(t * 1.4 + k * 0.7) * (3 + row.r * 0.09);
          const rx = row.r;
          const ry = row.r * 0.72;
          return (
            <g key={`${ri}-${i}`} transform={`translate(${x} ${row.y + bob})`} opacity={row.dim}>
              <ellipse rx={rx * 1.5} ry={ry * 1.4} fill={kidTheme.sunLight} opacity={0.22} />
              <ellipse rx={rx} ry={ry} fill="#fffdf2" stroke={kidTheme.ink} strokeWidth={Math.max(2.5, rx * 0.11)} />
              <circle cx={-rx * 0.28} cy={-ry * 0.12} r={Math.max(2, rx * 0.11)} fill={kidTheme.ink} />
              <circle cx={rx * 0.28} cy={-ry * 0.12} r={Math.max(2, rx * 0.11)} fill={kidTheme.ink} />
              <path
                d={`M ${-rx * 0.3} ${ry * 0.3} q ${rx * 0.3} ${ry * 0.34} ${rx * 0.6} 0`}
                stroke={kidTheme.ink}
                strokeWidth={Math.max(2, rx * 0.09)}
                strokeLinecap="round"
                fill="none"
              />
            </g>
          );
        }),
      )}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 4 — Eight minutes
// ---------------------------------------------------------------------------

const S4_RAY = { x: 880, y: 512, scale: 0.85 };
/** His `y` prop, once, so the mark and the props cannot drift apart. */
const S4_RAY_Y = hover("ray", S4_RAY.y, S4_RAY.scale);
/**
 * **Where Ray actually is, vertically — and it is not the middle of his box.**
 *
 * F2 is a floating face over a wave ribbon with a deliberate gap between them,
 * and the centre of his box lands *in that gap*: 512 is the hole in the middle
 * of him. Two things in this scene were aimed at it and both were re-aimed here
 * (wave-2 staging items 2 and 3):
 *
 *   - the **whip streak**, a 52px band that ran clean through the gap and
 *     therefore appeared to be attached to neither half of him;
 *   - **Sunny's pinch**, whose two fingers closed on the same empty space, so
 *     the biggest character on screen was holding nothing.
 *
 * `faceOf` (the kit's per-body `faceOffset`, K4) is the fix and it is the only
 * honest one: it is the same number every other character's `look` now aims at,
 * so the fingers, the streak and Sunny's eyes agree about where Ray is. The
 * wave ribbon hangs below the grip, free, which is what a beam of light held by
 * the bright end should look like.
 */
const S4_FACE_Y = faceOf("ray", S4_RAY_Y, S4_RAY.scale);
/**
 * The **other** half of him: the wave ribbon's centreline, as a composition y.
 *
 * The kit declares the face (`FACE_OFFSET` in `scenes/common.tsx`, −68 local)
 * because that is what eyes aim at; nothing aims at the ribbon, so nothing
 * declares it. +72 is the same arithmetic run on `F_WAVE_Y` (66) through F2's
 * fit transform (`translate(0 20) scale(0.78)` and the brightness-driven
 * `0.9 + 0.18b`, which at `RAY_LIGHT.actOne` is 1.008). It is used for exactly
 * one thing — the second, fainter streak band — and if it ever needs a second
 * use it should be promoted next to `faceOffset` rather than copied.
 */
const S4_WAVE_Y = S4_RAY.y + 72 * S4_RAY.scale;

const S4_BUBBLES: Record<string, string> = {
  a1_09_sunny: "You are going to EARTH!",
  a1_10_ray: "How long does that take?",
  a1_11_sunny: "Eight minutes! HA! HA!",
  // The drawn word and the spoken word are allowed to disagree (STYLE.md): the
  // clip says "WHOOSH!", the bubble has an extra O, because on screen the
  // letters are a picture of a long loud noise. Do not "fix" one of them.
  a1_12_ray: "WHOOOSH! To EARTH!",
};

const FlickScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [, mathsTo] = lineWindow(scene, "a1_11_sunny");
  const [thinkFrom] = heldBeat(scene, "a1_11_sunny");
  const [goFrom, goTo] = lineWindow(scene, "a1_12_ray");
  const [whipFrom, whipTo] = heldBeat(scene, "a1_12_ray");

  // The flick lands on the last third of "WHOOSH! I am going to EARTH!" — the
  // fingers snap open and he is gone inside four frames, because light does not
  // accelerate.
  const flickAt = goFrom + Math.round((goTo - goFrom) * 0.34);
  const gone = kidEase.easeInQuad((frame - flickAt) / 5);
  const rayX = S4_RAY.x + gone * 2600;

  // Then the trailing beat: the shot follows him out, the Sun goes, and the
  // star field is already there when Scene 5 opens. script.md puts this silence
  // on a1_12's gapFrames and calls it "travel, in silence, in a shot where
  // nothing changes" — so the change happens at the *front* of it and the rest
  // is the shot Scene 5 continues.
  const whipU = kidEase.easeInOutSine((frame - whipFrom) / Math.max(1, (whipTo - whipFrom) * 0.42));

  // He does the arithmetic on his face, in the twenty frames the script bought.
  // Nothing enters it: no prop, no bubble, no counting fingers — the beat is
  // "on his face" and that is all it is.
  const emotion = emotionAt(
    frame,
    [
      { at: thinkFrom + 3, emotion: "neutral" },
      { at: goFrom, emotion: "excited" },
    ],
    "happy",
    NO_LEAD || 6,
  );
  const thinking = frame >= thinkFrom && frame < goFrom;
  const stage = useStage(scene);

  const rayMark: Mark = {
    x: rayX,
    y: S4_RAY_Y,
    scale: S4_RAY.scale,
    who: "ray",
  };
  const sunnyMark: Mark = { x: 1600, y: hover("sunny", 430, 1.3), scale: 1.3, who: "sunny", side: "left" };

  return (
    <AbsoluteFill>
      <PaintedSky bg="sun_surface" phase={1.3} drift={9} />
      {/* The star field the shot ends in, arriving over the top of the Sun. */}
      <div style={{ position: "absolute", inset: 0, opacity: whipU }}>
        <PaintedSky bg="space_stars" drift={0} />
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: 1 - whipU }}>
        <Sunny
          x={sunnyMark.x}
          y={sunnyMark.y}
          scale={1.3}
          phase={PHASE.sunny}
          emotion={useEmotion(scene, "sunny", { a1_09_sunny: "excited" }, "proud", NO_LEAD)}
          speaking={stage.speaking("sunny")}
          look={{ x: -0.7, y: 0.05 }}
          zIndex={6}
        />
        {/* Earth, ninety three million miles away and pointed at: one small
            blue dot with a bit of dark around it, and nothing else. */}
        <FarEarth x={196} y={318} r={17} halo />
        {/* The pinch. Two gold fingers, and Ray between them until he isn't.
            Below Sunny in z so the far ends of the fingers disappear into him
            rather than stopping in mid-air on top of his face. */}
        <SunnyPinch
          x={S4_RAY.x}
          // The face, not the box centre — see `S4_FACE_Y`. The fingers now
          // close on the bright disc that is the character; before this they
          // met in the gap between his face and his wave.
          y={S4_FACE_Y}
          open={gone}
          // They let go, then they go home. Without this the hand is still
          // hanging open in an empty frame twenty frames after Ray left, which
          // is what the trailing beat is actually looking at.
          retract={kidEase.easeInOutSine((frame - flickAt - 6) / 16)}
        />
      </div>

      <Ray
        x={rayX}
        y={S4_RAY_Y}
        scale={S4_RAY.scale * (1 - whipU * 0.55)}
        brightness={RAY_LIGHT.actOne}
        spectrum={RAY_SPECTRUM.none}
        phase={PHASE.ray}
        emotion={emotion}
        speaking={stage.speaking("ray")}
        look={thinking ? { x: -0.5, y: -0.8 } : { x: 0.6, y: -0.1 }}
        eyeLife={thinking ? 1.4 : 1}
        idle={thinking ? 0.45 : 1}
        edge={whipU > 0.5 ? kidTheme.sunDeep : kidTheme.ink}
        streak={gone > 0.05 ? 1 : 0.25}
        zIndex={20}
      />
      {/* The streak he leaves. Four frames long, and gone.
          **Two bands, aimed at the two halves of him** (staging item 2). One
          band on the box centre crossed the face/wave gap and read as a bar
          near Ray rather than as light coming off him. The bright one now runs
          on `S4_FACE_Y`; the fainter, thinner one runs on the wave ribbon, so
          what the frame says is "both of those things went that way". */}
      {gone > 0.02 && gone < 1 ? (
        <WideLayer zIndex={19}>
          <rect
            x={S4_RAY.x - 200}
            y={S4_FACE_Y - 26}
            width={Math.max(0, rayX - S4_RAY.x + 200)}
            height={52}
            rx={26}
            fill={kidTheme.sunLight}
            opacity={0.7 * (1 - gone)}
          />
          <rect
            x={S4_RAY.x - 160}
            y={S4_WAVE_Y - 16}
            width={Math.max(0, rayX - S4_RAY.x + 160)}
            height={32}
            rx={16}
            fill={kidTheme.sunLight}
            opacity={0.4 * (1 - gone)}
          />
        </WideLayer>
      ) : null}

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark, sunny: sunnyMark } as Cast}
        text={S4_BUBBLES}
        at={{
          a1_09_sunny: { x: 880, y: 200, tail: "right", tailAt: 1430 },
          a1_11_sunny: { x: 900, y: 200, tail: "right", tailAt: 1430 },
          a1_10_ray: { x: 620, y: 250, tail: "right", tailAt: 810 },
          a1_12_ray: { x: 620, y: 250, tail: "right", tailAt: 810 },
        }}
      />
      {/* A hair of extra frames of settle on the pinch when it opens. Centred
          where the fingers actually were, which is now the face. */}
      <FlickRing at={flickAt} x={S4_RAY.x} y={S4_FACE_Y} fps={fps} />
    </AbsoluteFill>
  );
};

/**
 * Two enormous gold fingers, holding one sunbeam. `open` 0..1 lets go;
 * `retract` 0..1 takes the hand back afterwards.
 *
 * Each finger is **two round-capped strokes** — a fat `sunDeep` one with a
 * slightly thinner `sun` one over it — rather than a filled outline. Two
 * reasons, and both came off a still. A filled path needs a closed far end, and
 * the far end here is inside Sunny, so it drew a flat vertical edge across his
 * face the moment the fingers spread; and a 120px-deep flat fill with a corner
 * on it reads as a slab rather than a digit. A stroke has round caps at both
 * ends for free and it tapers by being a stroke.
 *
 * They run back past Sunny's edge and are drawn *under* him, which is what
 * makes them his hand rather than two objects near him.
 */
const SunnyPinch: React.FC<{
  x: number;
  y: number;
  open: number;
  retract: number;
}> = ({ x, y, open, retract }) => {
  // Anticipation: they *squeeze* a touch before they let go.
  const squeeze = open > 0 && open < 0.5 ? Math.sin(open * 2 * Math.PI) * 10 : 0;
  const spread = kidEase.easeOutQuad(open) * 120;
  const back = Math.max(0, Math.min(1, retract));
  const finger = (s: number): string =>
    `M ${x + 760} ${y + s * 116} Q ${x + 330} ${y + s * 118} ${x + 76} ${y + s * 62}`;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        pointerEvents: "none",
        zIndex: 4,
        opacity: 1 - back,
        transform: `translateX(${back * 420}px)`,
      }}
    >
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(0 ${s * (spread + squeeze)})`}>
          <path
            d={finger(s)}
            stroke={kidTheme.sunDeep}
            strokeWidth={96}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={finger(s)}
            stroke={kidTheme.sun}
            strokeWidth={74}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ))}
    </svg>
  );
};

/** The impact ring the flick leaves behind. */
const FlickRing: React.FC<{ at: number; x: number; y: number; fps: number }> = ({
  at,
  x,
  y,
  fps,
}) => {
  const frame = useCurrentFrame();
  const u = (frame - at) / (fps * 0.5);
  if (u < 0 || u > 1) return null;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    >
      <ellipse
        cx={x}
        cy={y}
        rx={60 + u * 340}
        ry={44 + u * 250}
        fill="none"
        stroke={kidTheme.sunLight}
        strokeWidth={16 * (1 - u)}
        opacity={0.8 * (1 - u)}
      />
    </svg>
  );
};

/** Earth, from a very long way away: a blue dot, and that is all it ever is. */
const FarEarth: React.FC<{ x: number; y: number; r: number; halo?: boolean }> = ({
  x,
  y,
  r,
  halo = false,
}) => (
  <svg
    width={W}
    height={H}
    viewBox={`0 0 ${W} ${H}`}
    style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
  >
    {/* A window on the dark, not a hole punched in the sun. One 50%-opaque
        navy disc over a gold plate is a grey coin sitting on the frame — it was
        the first thing a still of this scene showed. Four rings at falling
        alpha put a soft edge on it, which is what depth looks like. */}
    {halo
      ? [4.6, 3.5, 2.6, 1.9].map((k, i) => (
          <circle
            key={k}
            cx={x}
            cy={y}
            r={r * k}
            fill="#12294d"
            opacity={0.07 + i * 0.055}
          />
        ))
      : null}
    <circle cx={x} cy={y} r={r * 2.1} fill="#7ec8ff" opacity={0.28} />
    <circle cx={x} cy={y} r={r} fill="#3f8fe0" />
    <path d={`M ${x - r * 0.5} ${y - r * 0.3} q ${r * 0.5} ${-r * 0.4} ${r} ${r * 0.1}`} stroke="#63c97a" strokeWidth={r * 0.5} strokeLinecap="round" fill="none" opacity={0.9} />
  </svg>
);

// ---------------------------------------------------------------------------
// Scene 5 — Are we there yet
// ---------------------------------------------------------------------------

/**
 * **Five firings, one bubble, written out five times.**
 *
 * `a1_13_ray` is the only synthesis in the scene; the other four are `sameAs`
 * aliases of that exact recording, so the audio is five identical clips, the
 * mouth is five identical shapes — and the bubble has to be the fifth identical
 * thing or the picture is less flat than the sound. Same text, same override
 * below (same `x`, same `y`, same tail, same `tailAt`), so the five are the
 * same drawing at the same place on the screen five times.
 *
 * Do not "vary" one of them. The sameness *is* the joke, and the only thing in
 * the scene that is not a repetition is the fifth one going unanswered.
 */
const S5_BUBBLE = "Are we there yet?";
const S5_BUBBLES: Record<string, string> = {
  a1_13_ray: S5_BUBBLE,
  a1_15_ray: S5_BUBBLE,
  a1_15c_ray: S5_BUBBLE,
  a1_15e_ray: S5_BUBBLE,
  a1_16b_ray: S5_BUBBLE,
};

/**
 * One override, reused five times, so the five bubbles cannot drift apart.
 *
 * `tailAt` sits **just to the right of the furthest right Ray ever gets** (he
 * ends the scene at x≈753). A tail is read as a direction rather than as a
 * point, and a fixed tail left of him on the fifth firing pointed *past* him —
 * the one firing the whole gag is built to land. Right of him on all five, it
 * leans back down at him every time, and the bubble is still the same drawing
 * in the same place.
 */
const S5_BUBBLE_AT = { x: 980, y: 268, tail: "left" as const, tailAt: 782 };

/**
 * Scene 5 — twenty-five and a half seconds, and the whole scene is one staging
 * decision.
 *
 * The shot never cuts, and **nothing in it changes**: Ray travels left to right
 * and gets nowhere, so the star field slides past him at a constant rate and
 * the blue dot on the right stays exactly the size it was. Five identical
 * firings of "Are we there yet?", four flat almanac answers, and silences that
 * grow 30 / 45 / 60 / 75 — the escalation is in the *gaps*, which live in
 * `Video.tsx`, and this file's entire job is to make sure the picture adds
 * nothing to them.
 *
 * The one thing that does move is Ray's own x, by two hundred pixels across the
 * entire scene. It is far too slow to see and it is the reason the shot does
 * not read as a loop: he *is* travelling, he is just not arriving.
 *
 * **Nothing may telegraph the cut.** The fifth firing is not answered: the
 * scene has a 6-frame tail and Scene 6 hard-cuts to a garden at full brightness
 * on the frame after it, and that cut is the joke's button. So there is no
 * brightening, no lean into it, no emotion change, no acceleration and no
 * change in the star drift anywhere in the last silence — the last seventy-five
 * frames are drawn by exactly the same expressions as the first thirty. The
 * things that do move (the constant star drift, the slow ±2.5° roll, his
 * two-hundred-pixel crawl) have all been doing it since frame one at a constant
 * rate, which is why none of them is a signal.
 *
 * The list of props deliberately *not* driven by anything in this scene:
 * `brightness`, `emotion`, `look`, `streak`, `scale`. A single mapped emotion or
 * a bright-up in the last beat would spend the button before the cut lands.
 */
const JourneyScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const x = 560 + (frame / Math.max(1, scene.durationInFrames)) * 200;
  const y = 528;
  const stage = useStage(scene);

  return (
    <AbsoluteFill>
      {/* `drift={0}`, and it is the joke in one prop: a sky that breathes is a
          thing changing, and nothing in this shot may change. */}
      <PaintedSky bg="space_stars" drift={0} />
      <StarDrift t={t} />
      <FarEarth x={1662} y={432} r={13} />
      <Ray
        x={x}
        y={hover("ray", y, 0.62)}
        scale={0.62}
        brightness={RAY_LIGHT.actOne}
        spectrum={RAY_SPECTRUM.none}
        phase={PHASE.ray}
        // No mapped emotions at all, in any of the five firings. Nothing enters
        // the beats, including a face.
        emotion="happy"
        speaking={stage.speaking("ray")}
        look={{ x: 0.55, y: -0.05 }}
        // A nine-second roll he has been doing since the first frame. Periodic
        // and unchanging, so it is texture rather than a change — and without
        // it a beam of light crossing space reads as a parked sprite.
        bank={Math.sin(t * 0.7) * 2.5}
        streak={1}
        zIndex={20}
      />
      <Bubbles
        scene={scene}
        cast={{ ray: { x, y: hover("ray", y, 0.62), scale: 0.62, who: "ray", side: "right" } } as Cast}
        text={S5_BUBBLES}
        // The same five numbers five times — see `S5_BUBBLE_AT`. A `tailAt`
        // that followed his crawl would make five *slightly* different pictures,
        // which is the one thing this scene cannot afford.
        at={{
          a1_13_ray: S5_BUBBLE_AT,
          a1_15_ray: S5_BUBBLE_AT,
          a1_15c_ray: S5_BUBBLE_AT,
          a1_15e_ray: S5_BUBBLE_AT,
          a1_16b_ray: S5_BUBBLE_AT,
        }}
      />
    </AbsoluteFill>
  );
};

/** Two layers of stars sliding past at different rates. The only motion. */
const StarDrift: React.FC<{ t: number }> = ({ t }) => (
  <WideLayer>
    {[
      { n: 46, speed: 26, r: 3.2, o: 0.55 },
      { n: 26, speed: 54, r: 5, o: 0.85 },
    ].map((layer, li) =>
      Array.from({ length: layer.n }, (_, i) => {
        const k = li * 71 + i * 13;
        const span = 2600;
        const x0 = ((k * 137) % span) - 340;
        const x = ((x0 - t * layer.speed) % span + span) % span - 340;
        const y = ((k * 211) % 1000) + 40;
        return <circle key={`${li}-${i}`} cx={x} cy={y} r={layer.r} fill="#ffffff" opacity={layer.o} />;
      }),
    )}
  </WideLayer>
);

// ---------------------------------------------------------------------------
// Scene 6 — Arrival
// ---------------------------------------------------------------------------

/** The four things Ray touches, and the order he touches them in. */
const TOUCH = [
  { at: 0.3, x: 424, y: 640 },
  { at: 0.52, x: 772, y: 902 },
  { at: 0.69, x: 1176, y: 762 },
  { at: 0.86, x: 1512, y: 838 },
] as const;

const S6_BUBBLES: Record<string, string> = {
  a1_18_ray: "I'm on a DOG!",
  a1_20_ray: "Do I make things see-able?",
};

const ArrivalScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [hopFrom, hopTo] = lineWindow(scene, "a1_18_ray");
  const [darkFrom, darkTo] = lineWindow(scene, "a1_21_narrator");

  // Where he is, hop by hop. Four ricochets on four arcs — he does not fly a
  // route, he bounces, which is the difference between a bee and a beam.
  const path = ricochet(frame, hopFrom, hopTo);

  /**
   * The drain.
   *
   * script.md: "a two-frame dip to near-darkness on the Narrator's last line,
   * where every one of those colours drains to grey, and back." The *two
   * frames* is the transition speed and it is load-bearing — light does not
   * fade, so neither does this — but two frames of darkness is 1/15th of a
   * second and a six-year-old cannot read a colour leaving inside it. So: two
   * frames down, fourteen frames held in the grey where the argument actually
   * lands, three frames back. The number the script cares about is the edge,
   * and the edge is hard.
   */
  const drainAt = darkFrom + Math.round((darkTo - darkFrom) * 0.6);
  const d = frame - drainAt;
  const dark =
    d < 0 ? 0 : d < 2 ? d / 2 : d < 16 ? 1 : d < 19 ? 1 - (d - 16) / 3 : 0;
  const lit = 1 - dark;

  const emotion = useEmotion(
    scene,
    "ray",
    { a1_18_ray: "excited", a1_20_ray: "amazed" },
    "excited",
  );
  const stage = useStage(scene);

  return (
    <AbsoluteFill style={{ background: "#0a1018" }}>
      {/* The plate loses its colour with everything else. A painted garden that
          stayed green while the flower went grey would be the argument being
          made and contradicted in the same frame. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: `saturate(${lit}) brightness(${0.18 + 0.82 * lit})`,
        }}
      >
        <PaintedSky bg="garden_day" phase={2.4} vignette={0.25} />
      </div>

      <GardenTouchables
        lit={[
          lit * touched(frame, hopFrom, hopTo, 0),
          lit * touched(frame, hopFrom, hopTo, 1),
          lit * touched(frame, hopFrom, hopTo, 2),
          lit * touched(frame, hopFrom, hopTo, 3),
        ]}
      />

      <Ray
        x={path.x}
        y={hover("ray", path.y, 0.72)}
        scale={0.72}
        brightness={RAY_LIGHT.actOne * lit}
        spectrum={RAY_SPECTRUM.none}
        phase={PHASE.ray}
        emotion={emotion}
        speaking={stage.speaking("ray")}
        look={{ x: 0.2, y: 0.15 }}
        bank={path.angle * 0.28}
        streak={0.9}
        opacity={0.1 + 0.9 * lit}
        zIndex={22}
      />

      <Bubbles
        scene={scene}
        cast={
          {
            ray: { x: path.x, y: hover("ray", path.y, 0.72), scale: 0.72, who: "ray" },
          } as Cast
        }
        text={S6_BUBBLES}
        at={{
          a1_18_ray: { x: 1240, y: 250, tail: "right", tailAt: path.x },
          a1_20_ray: { x: 820, y: 280, tail: "left", tailAt: path.x },
        }}
      />
    </AbsoluteFill>
  );
};

/** 0 before this thing has been touched, 1 after — with a snap, not a fade. */
function touched(frame: number, from: number, to: number, i: number): number {
  const at = from + (to - from) * TOUCH[i].at;
  return kidEase.easeOutQuad((frame - at) / 3);
}

/** Ray's four hops across the garden, on four arcs. */
function ricochet(
  frame: number,
  from: number,
  to: number,
): { x: number; y: number; angle: number } {
  const span = Math.max(1, to - from);
  const u = (frame - from) / span;
  const start = { x: -240, y: 420 };
  const marks = TOUCH.map((m) => ({ x: m.x, y: m.y - 92 }));
  const stops = [start, ...marks];
  const times = [0, ...TOUCH.map((m) => m.at)];
  if (u <= 0) return { ...start, angle: 0 };
  for (let i = 1; i < stops.length; i++) {
    if (u < times[i]) {
      const t = (u - times[i - 1]) / (times[i] - times[i - 1]);
      // Each hop bows the *other* way from the last, which is what a ricochet
      // looks like and a flight path does not.
      return moveAlong(stops[i - 1], stops[i], t, {
        arc: i % 2 === 0 ? 0.3 : -0.3,
        ease: kidEase.easeOutQuad,
      });
    }
  }
  const last = stops[stops.length - 1];
  const t = Math.min(1, (u - times[times.length - 1]) / 0.16);
  return moveAlong(last, { x: last.x + 120, y: last.y - 130 }, t, { arc: 0.2 });
}

/**
 * The four things the light lands on: a leaf, a puddle, a flower and a dog.
 *
 * All four are SVG and all four take a `lit` — which is the whole reason they
 * are not in the painted plate. **Colour is not a property of an object, it is
 * what light does with it**, and the only way to say that to a six-year-old is
 * to let them watch a red flower go grey when the light leaves. Paint cannot go
 * grey; these can.
 */
const GardenTouchables: React.FC<{ lit: number[] }> = ({ lit }) => {
  const frame = useCurrentFrame();
  const c = (hex: string, i: number): string => mixHex(UNLIT, hex, Math.max(0, Math.min(1, lit[i])));
  // The dog looks up, once, a beat after the light hits him.
  const look = kidEase.easeOutBack(Math.max(0, lit[3]) * 1.1, 1.4);
  return (
    <WideLayer zIndex={12}>
      {/* Leaf, on the hedge line. */}
      <g transform={`translate(${TOUCH[0].x} ${TOUCH[0].y}) rotate(-16)`}>
        <path
          d="M 0 -74 C 56 -50 68 20 0 76 C -68 20 -56 -50 0 -74 Z"
          fill={c("#4cbe58", 0)}
          stroke={c("#2a8134", 0)}
          strokeWidth={8}
        />
        <path d="M 0 -68 L 0 70" stroke={c("#2a8134", 0)} strokeWidth={7} opacity={0.8} />
      </g>

      {/* Puddle, on the lawn, with a hard silver highlight when it is lit. */}
      <g transform={`translate(${TOUCH[1].x} ${TOUCH[1].y})`}>
        <ellipse rx={150} ry={54} fill={c("#7fb7d8", 1)} stroke={c("#3c7ea3", 1)} strokeWidth={8} />
        <ellipse cx={-38} cy={-14} rx={54} ry={15} fill="#ffffff" opacity={0.75 * Math.max(0, lit[1])} transform="rotate(-8)" />
      </g>

      {/* Flower. */}
      <g transform={`translate(${TOUCH[2].x} ${TOUCH[2].y})`}>
        <path d="M 0 130 L 0 20" stroke={c("#2a8134", 2)} strokeWidth={16} strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <ellipse
            key={k}
            cx={Math.cos((k / 6) * Math.PI * 2) * 46}
            cy={Math.sin((k / 6) * Math.PI * 2) * 46}
            rx={34}
            ry={28}
            fill={c("#ea4b3c", 2)}
            stroke={c("#b2291c", 2)}
            strokeWidth={6}
          />
        ))}
        <circle r={26} fill={c("#ffd23c", 2)} stroke={c("#c19206", 2)} strokeWidth={6} />
      </g>

      {/* Dog, in profile, who looks up. */}
      <g transform={`translate(${TOUCH[3].x} ${TOUCH[3].y})`}>
        <ellipse cx={0} cy={30} rx={128} ry={72} fill={c("#a3714a", 3)} stroke={c("#6f4726", 3)} strokeWidth={9} />
        {[-70, -20, 44, 92].map((lx, i) => (
          <path
            key={lx}
            d={`M ${lx} 76 L ${lx + (i % 2 ? 8 : -8)} 152`}
            stroke={c("#6f4726", 3)}
            strokeWidth={22}
            strokeLinecap="round"
          />
        ))}
        <path d={`M 118 6 q 74 ${-30 - Math.sin(frame / 6) * 18} 96 -62`} stroke={c("#6f4726", 3)} strokeWidth={18} strokeLinecap="round" fill="none" />
        <g transform={`translate(-118 -18) rotate(${-look * 26})`}>
          <ellipse rx={66} ry={54} fill={c("#a3714a", 3)} stroke={c("#6f4726", 3)} strokeWidth={9} />
          <ellipse cx={-44} cy={16} rx={30} ry={22} fill={c("#c9976c", 3)} />
          <circle cx={-64} cy={12} r={11} fill={c("#3b4453", 3)} />
          <circle cx={-14} cy={-14} r={9} fill={c("#3b4453", 3)} />
          <path d={`M 34 -34 q 30 -12 24 34`} stroke={c("#6f4726", 3)} strokeWidth={20} strokeLinecap="round" fill="none" />
        </g>
      </g>
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 7 — The plain one
// ---------------------------------------------------------------------------

const S7_POST = { x: 600, y: 706 };
const S7_RAY = { x: 600, y: 604, scale: 0.95 };

const S7_BUBBLES: Record<string, string> = {
  a1_23_ray: "Red flowers. A yellow duck.",
  a1_24_ray: "Everybody except me.",
  a1_26_ray: "I'm the plain one.",
};

const PlainOneScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [lookFrom, lookTo] = lineWindow(scene, "a1_23_ray");
  const [dimFrom] = lineWindow(scene, "a1_24_ray");
  const [, dimTo] = lineWindow(scene, "a1_26_ray");

  // His lowest point in the episode, and it is drawn rather than said. Never
  // mentioned by anybody, in this scene or any other.
  const brightness = interpolate(frame, [dimFrom, dimTo], [RAY_LIGHT.actOne, RAY_LIGHT.lowest], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  // On "Red flowers. Green grass. A yellow duck." his eyes go to each of them
  // in turn — the comparison is the scene, so it has to happen on his face
  // before it happens in the sentence.
  const sweep = lineProgress(scene, "a1_23_ray", frame);
  const looking = frame >= lookFrom && frame < lookTo;
  const gaze = looking
    ? sweep < 0.36
      ? { x: 0.85, y: 0.2 }
      : sweep < 0.66
        ? { x: 0.2, y: 0.85 }
        : { x: 0.95, y: 0.45 }
    : frame >= dimFrom
      ? ({ x: 0, y: 0.6 } as const)
      : ("camera" as const);

  const emotion = useEmotion(
    scene,
    "ray",
    { a1_24_ray: "sad", a1_26_ray: "sad" },
    "happy",
    // Two held beats in this scene, and the script says so in words: "Cut the
    // useEmotion lead to 0 here — if the Narrator's reaction leaks into the
    // silence the beat is spent early."
    NO_LEAD,
  );
  const stage = useStage(scene);

  return (
    <AbsoluteFill>
      <PaintedSky bg="garden_day" phase={3.5} vignette={0.2} />
      {/* Everything else in frame is saturated, and all of it is SVG so that
          it can be. He is the only white thing on screen and the staging has to
          read as *missing out* rather than as clean. */}
      <GardenRiot />
      {/* The sanctioned legibility fix, and here it is doing double duty: it
          keeps a near-white body readable against a very bright lawn, and it
          reads in-fiction as the one patch of the garden with no colour in it. */}
      <SoftShade x={S7_RAY.x} y={560} rx={520} ry={430} strength={0.3} color="26,54,86" />
      <FencePost x={S7_POST.x} y={S7_POST.y} />
      <KidContactShadow x={S7_POST.x} y={S7_POST.y + 22} rx={92} ry={18} strength={0.22} />
      <Ray
        x={S7_RAY.x}
        y={hover("ray", S7_RAY.y, S7_RAY.scale)}
        scale={S7_RAY.scale}
        brightness={brightness}
        spectrum={RAY_SPECTRUM.none}
        phase={PHASE.ray}
        emotion={emotion}
        speaking={stage.speaking("ray")}
        look={gaze}
        // He is sitting still on a post, so there is nothing streaming off him.
        streak={frame >= dimFrom ? 0 : 0.25}
        idle={frame >= dimFrom ? 0.5 : 1}
        pose={frame >= dimFrom ? "hug" : "rest"}
        zIndex={20}
      />
      <Bubbles
        scene={scene}
        cast={
          {
            ray: {
              x: S7_RAY.x,
              y: hover("ray", S7_RAY.y, S7_RAY.scale),
              scale: S7_RAY.scale,
              who: "ray",
              side: "right",
              offset: 380,
            },
          } as Cast
        }
        text={S7_BUBBLES}
      />
    </AbsoluteFill>
  );
};

/** The fence post he sits on. */
const FencePost: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <WideLayer zIndex={10}>
    <path
      d={`M ${x - 44} ${y + 8} L ${x - 36} ${y + 330} L ${x + 36} ${y + 330} L ${x + 44} ${y + 8} Z`}
      fill="#c79b62"
      stroke="#8a6134"
      strokeWidth={9}
      strokeLinejoin="round"
    />
    <path
      d={`M ${x - 52} ${y - 16} q 52 -22 104 0 l -8 26 q -44 -18 -88 0 Z`}
      fill="#d8b98a"
      stroke="#8a6134"
      strokeWidth={9}
      strokeLinejoin="round"
    />
    <path d={`M ${x - 12} ${y + 40} L ${x - 8} ${y + 300}`} stroke="#8a6134" strokeWidth={5} opacity={0.5} />
  </WideLayer>
);

/**
 * A garden absolutely stuffed with colour: a red flower bed, a yellow plastic
 * duck in a blue paddling pool, and grass in front of all of it.
 *
 * SVG rather than paint for the reason `backgrounds.mjs` gives — Ray's
 * whiteness has to read against colour the composition controls, and Scene 6
 * needed to be able to drain it.
 */
const GardenRiot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer zIndex={8}>
      {/* Flower bed, right of frame, twenty-two flowers deep. */}
      {Array.from({ length: 22 }, (_, i) => {
        const x = 1030 + (i % 11) * 82 + ((i * 37) % 26);
        const y = 720 + Math.floor(i / 11) * 96 + ((i * 53) % 22);
        const nod = Math.sin(t * 1.1 + i * 0.8) * 4;
        const hue = i % 3 === 0 ? "#ff7fb0" : i % 3 === 1 ? "#ea4b3c" : "#ff9227";
        return (
          <g key={i} transform={`translate(${x + nod} ${y})`}>
            <path d={`M 0 92 q ${-nod} -46 0 -70`} stroke="#2a8134" strokeWidth={11} strokeLinecap="round" fill="none" />
            {[0, 1, 2, 3, 4].map((k) => (
              <circle
                key={k}
                cx={Math.cos((k / 5) * Math.PI * 2) * 25}
                cy={-70 + Math.sin((k / 5) * Math.PI * 2) * 25}
                r={17}
                fill={hue}
                stroke={mixHex(hue, kidTheme.ink, 0.35)}
                strokeWidth={4}
              />
            ))}
            <circle cy={-70} r={13} fill="#ffd23c" />
          </g>
        );
      })}

      {/* Paddling pool and the duck. */}
      <g transform="translate(1150 968)">
        <ellipse rx={296} ry={104} fill="#2f8fdc" stroke="#175f97" strokeWidth={12} />
        <ellipse rx={252} ry={74} fill="#63b5ee" />
        <ellipse cx={-90} cy={-18} rx={70} ry={18} fill="#ffffff" opacity={0.5} />
      </g>
      <g transform={`translate(1204 ${900 + Math.sin(t * 1.5) * 7})`}>
        <ellipse rx={92} ry={64} fill="#ffd23c" stroke="#c19206" strokeWidth={10} />
        <ellipse cx={-58} cy={-56} rx={50} ry={46} fill="#ffd23c" stroke="#c19206" strokeWidth={10} />
        <path d="M -104 -46 q -32 6 -30 22 q 26 8 34 -6 Z" fill="#ff9227" stroke="#c26206" strokeWidth={8} strokeLinejoin="round" />
        <circle cx={-72} cy={-64} r={8} fill={kidTheme.ink} />
      </g>

      {/* Grass in front of everything, so the cast is standing *in* a garden. */}
      {Array.from({ length: 40 }, (_, i) => {
        const x = -180 + i * 56 + ((i * 61) % 34);
        const h = 74 + ((i * 97) % 60);
        const lean = Math.sin(t * 0.9 + i * 0.6) * 5;
        return (
          <path
            key={i}
            d={`M ${x} 1112 q ${6 + lean} ${-h * 0.6} ${2 + lean * 1.8} ${-h}`}
            stroke={i % 3 === 0 ? "#2a8134" : "#4cbe58"}
            strokeWidth={13}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 8 — Rain, in the sunshine
// ---------------------------------------------------------------------------

const S8_RAY = { x: 660, y: 566, scale: 0.95 };
const S8_DRIP = { x: 1216, y: 560 };
const DROP_COUNT = 15;
/** The one drop that stops. */
const HERO_DROP = 6;

const S8_BUBBLES: Record<string, string> = {
  a1_29_ray: "But the sun is still out.",
  a1_31_drip: "Hi! It's me!",
  a1_33_ray: "Can I go through you?",
  a1_34_drip: "Walk right through me!",
};

const RainScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [stopFrom] = lineWindow(scene, "a1_30_narrator");
  const [revealFrom] = lineWindow(scene, "a1_31_drip");

  // The hero drop decelerates into its mark under "Watch what happens", turns
  // round, and has a face on it.
  const stopped = kidEase.easeOutCubic((frame - stopFrom) / 26);
  const reveal = kidEase.easeInOutSine((frame - revealFrom + 10) / 16);
  const spin = (1 - reveal) * 200;

  const stage = useStage(scene);
  const dripMark: Mark = { ...S8_DRIP, y: hover("drip", S8_DRIP.y, 0.9), scale: 0.9, who: "drip", side: "left" };
  const rayMark: Mark = {
    x: S8_RAY.x,
    y: hover("ray", S8_RAY.y, S8_RAY.scale),
    scale: S8_RAY.scale,
    who: "ray",
    side: "right",
  };

  return (
    <AbsoluteFill>
      <PaintedSky bg="garden_day" phase={4.6} vignette={0.2} />
      {/* Big fat raindrops falling while the sun is still blazing. The warm rim
          on every one of them is the whole setting: sun *and* rain at once is
          the precondition for a rainbow, and it is being taught as a place
          rather than as a rule. */}
      <SunlitRain t={frame / fps} skip={HERO_DROP} />
      <SoftShade x={S8_RAY.x} y={560} rx={480} ry={400} strength={0.26} color="26,54,86" />

      {/* The hero drop, and Drip inside it. Both are always mounted and
          cross-faded rather than swapped, so no component's hooks appear or
          disappear on a frame boundary (PROCESS.md §5). */}
      <div style={{ opacity: 1 - reveal }}>
        <PlainDrop
          x={S8_DRIP.x}
          y={-300 + (S8_DRIP.y + 300) * Math.min(1, stopped)}
          scale={1.15}
          rot={spin * 0.4}
        />
      </div>
      <div style={{ opacity: reveal }}>
        <Drip
          x={S8_DRIP.x}
          y={dripMark.y}
          scale={0.9}
          phase={PHASE.drip}
          emotion={useEmotion(scene, "drip", { a1_31_drip: "excited" }, "happy")}
          speaking={stage.speaking("drip")}
          look={{ x: -0.75, y: 0 }}
          pose={stage.speaking("drip") ? "cheer" : "rest"}
          shadow={false}
          feet={false}
          zIndex={18}
        />
      </div>

      <Ray
        x={S8_RAY.x}
        y={rayMark.y}
        scale={S8_RAY.scale}
        brightness={RAY_LIGHT.actOne}
        spectrum={RAY_SPECTRUM.none}
        phase={PHASE.ray}
        emotion={useEmotion(scene, "ray", { a1_29_ray: "amazed", a1_33_ray: "excited" }, "happy")}
        speaking={stage.speaking("ray")}
        look={{ x: 0.8, y: 0 }}
        streak={0.3}
        zIndex={20}
      />

      <Bubbles scene={scene} cast={{ ray: rayMark, drip: dripMark } as Cast} text={S8_BUBBLES} />
    </AbsoluteFill>
  );
};

/** A plain raindrop with no face on it. */
const PlainDrop: React.FC<{ x: number; y: number; scale?: number; rot?: number }> = ({
  x,
  y,
  scale = 1,
  rot = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`,
      pointerEvents: "none",
      zIndex: 17,
    }}
  >
    <svg width={260} height={330} viewBox="-130 -170 260 330" overflow="visible">
      <path
        d="M 0 -132 C 30 -76 96 -30 96 34 A 96 96 0 0 1 -96 34 C -96 -30 -30 -76 0 -132 Z"
        fill={kidTheme.water}
        stroke={kidTheme.waterDeep}
        strokeWidth={8}
        opacity={0.92}
      />
      <ellipse cx={-26} cy={-38} rx={14} ry={28} fill="#ffffff" opacity={0.55} transform="rotate(-16 -26 -38)" />
      {/* The warm rim: this drop is falling through sunshine. */}
      <path d="M 62 -18 A 96 96 0 0 1 62 82" stroke={kidTheme.sunLight} strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.8} />
    </svg>
  </div>
);

/** The rest of the rain: big, fat, sunlit, and falling. */
const SunlitRain: React.FC<{ t: number; skip: number }> = ({ t, skip }) => (
  <WideLayer zIndex={16}>
    {Array.from({ length: DROP_COUNT }, (_, i) => {
      if (i === skip) return null;
      const k = i * 29;
      const x = -80 + i * 138 + ((k * 41) % 70);
      const speed = 320 + ((k * 17) % 130);
      const span = 1560;
      const y = (((t * speed + ((k * 211) % span)) % span) + span) % span - 300;
      const s = 0.38 + ((k * 13) % 26) / 60;
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity={0.9}>
          <path
            d="M 0 -132 C 30 -76 96 -30 96 34 A 96 96 0 0 1 -96 34 C -96 -30 -30 -76 0 -132 Z"
            fill={kidTheme.water}
            stroke={kidTheme.waterDeep}
            strokeWidth={9}
            opacity={0.8}
          />
          <path d="M 62 -18 A 96 96 0 0 1 62 82" stroke={kidTheme.sunLight} strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.85} />
        </g>
      );
    })}
  </WideLayer>
);

// ---------------------------------------------------------------------------
// The ensemble, as Act One stages it (Scenes 9, 10 and 11)
// ---------------------------------------------------------------------------
//
// **Who each of the seven is lives in `SEVEN` (scenes/common.tsx, API 6) and
// nowhere else.** What lives here is the one thing the table deliberately does
// not carry: *when* a colour is allowed to be himself.
//
// Act One is the only place in the episode where that question has an answer
// other than "always". Scene 9's sixty-frame reveal beat is a **count** — seven
// blobs, seven faces, all of them his — and the revision is explicit that no
// personality may enter it: for those sixty frames they are seven identical
// shapes in an arc, and the ensemble is born on `a1_37_ray`, one colour every
// eight frames, in spectrum order. So every shard on the arc goes through
// `ArcShard`, which takes an `alive` and hands the kit a body that is either one
// of seven identical shapes (0) or itself (1).
//
// Red's `alive` is 1 from the first frame he exists, and that is not an
// exception — it is the joke stated in code. He does not come alive because he
// never stopped: the state the other six wake *out of* is Red's, so waking him
// is a no-op and the audience sees six things change around one that does not.

/**
 * The idle the seven share before any of them is anybody — Red's, because Red
 * is what "not yet a personality" looks like in this cast. A dead idle would
 * read as a frozen sprite (a mistake this kit has made before); 0.5 reads as
 * seven calm identical shapes, which is exactly what the count needs.
 */
const ASLEEP_IDLE = SEVEN[0].idleScale;

/**
 * Yellow's resting wave, and the reason it is not 1.
 *
 * He waves continuously from the moment he wakes and never stops, so the *only*
 * headroom the roll call has for "he waves harder" is amplitude. 0.82 is his
 * normal; 1.0 is him being greeted. `wave` also runs down to a whisker above
 * zero in a held beat, where the arms stay up and stop moving — which is the
 * deflation-by-stillness the series runs on, and is why it is 0.1 and not 0:
 * `ShardArms` drops the arms entirely below 0.01.
 */
const YELLOW_REST = YELLOW_WAVE * 0.82;
/** Arms up, flap off. What "nobody keeps waving" looks like on the one who does. */
const YELLOW_FROZEN = 0.1;

/**
 * **One of the seven, on the arc, with a birthday.**
 *
 * A thin wrapper over the kit's `<Shard>` — the identity (phase, lean, blur,
 * Yellow's arm, Violet's vibration, Green's sit) is all the kit's, and all this
 * adds is the `alive` fade between "one of seven identical shapes" and "himself":
 *
 *   - the **idle** runs from `ASLEEP_IDLE` to the colour's own,
 *   - the **lean** is scaled by it, so nothing banks before it is anybody,
 *   - **Yellow's arms** come out on it and **Violet's vibration** ramps up on it.
 *
 * Pass `alive={1}` in any scene that opens with them already awake (Scenes 10
 * and 11 do), and the wrapper costs nothing.
 */
const ArcShard: React.FC<{
  i: number;
  x: number;
  y: number;
  scale?: number;
  /** 0 = one of seven identical shapes; 1 = himself. */
  alive?: number;
  /** Green only: 0..1 from `greenSit`. */
  sit?: number;
  /** Yellow only: overrides `YELLOW_REST`. */
  wave?: number;
  /** Violet only: overrides his full vibration. */
  vibrate?: number;
  /**
   * A scene-wide damping on the identity idle, 0..1. For a shot where all seven
   * are 40px tall and the letters behind them are the thing to read — it scales
   * every colour's idle by the same amount, so the *differences* between them
   * survive. Not a way to give one colour somebody else's idle.
   */
  calm?: number;
  /** A heading from a travel helper — `Shard` turns it into a lean. */
  heading?: number;
  arms?: boolean;
  trail?: { x: number; y: number }[];
  opacity?: number;
  emotion?: Parameters<typeof RayShard>[0]["emotion"];
  speaking?: boolean;
  look?: Parameters<typeof RayShard>[0]["look"];
  eyeLife?: number;
  zIndex?: number;
}> = ({
  i,
  x,
  y,
  scale = 1,
  alive = 1,
  sit = 0,
  wave,
  vibrate,
  calm = 1,
  heading = 0,
  arms,
  trail,
  opacity = 1,
  emotion,
  speaking,
  look,
  eyeLife,
  zIndex,
}) => {
  const id = SEVEN[i];
  const a = Math.max(0, Math.min(1, alive));
  return (
    <Shard
      who={id.who}
      x={x}
      y={y}
      scale={scale}
      heading={heading * a}
      sit={sit}
      wave={a * (wave ?? YELLOW_REST)}
      vibrate={a * (vibrate ?? 1)}
      // Yellow's arm is his signature and it arrives *with* him. Everyone else
      // takes whatever the scene asked for (Violet holding on to a letter).
      arms={id.who === "yellow" ? a > 0.2 : arms}
      trail={trail}
      // `Shard`'s own idle default would give each colour its identity from the
      // first frame, which is the thing the reveal beat may not have. Green's
      // sit still damps it, because a sat body with a standing body's breathing
      // is two statements about the same character.
      idle={
        (ASLEEP_IDLE + (id.idleScale - ASLEEP_IDLE) * a) *
        calm *
        (id.who === "green" ? 1 - 0.85 * sit : 1)
      }
      opacity={opacity}
      emotion={emotion}
      speaking={speaking}
      look={look}
      eyeLife={eyeLife}
      zIndex={zIndex}
    />
  );
};

/**
 * **The stagger the ensemble is born on**, as fractions of `a1_37_ray`.
 *
 * `beats()`' own arithmetic (fractions of the clip, so the stagger rides the
 * voice rather than the frame rate) run against the line window, because
 * `beats` is not one of the things `scenes/common.tsx` re-exports and an act
 * file's imports are `./common` plus the character kit. Against the 77-frame
 * clip these land on 0, 8, 16, 24, 32, 40, 48 — one colour every eight frames,
 * spectrum order, left to right, finishing well before the line does.
 *
 * Seven simultaneous personalities is noise; seven sequential ones is a cast
 * list. Never collapse this.
 */
const BIRTH_AT = [0, 0.104, 0.208, 0.312, 0.416, 0.52, 0.624] as const;
/** How long one colour takes to become himself. Six frames — a wake, not a cut. */
const BIRTH_FRAMES = 6;

/**
 * Blue's box when he is only *drifting out of formation* rather than crossing a
 * room: small, centred on wherever the scene put him, so `blueRicochet`'s legs
 * come out at 47–88px and there is a hard corner in every eighteen frames. The
 * kit clamps leg length to the box, which is the whole reason a small box gives
 * a small ricochet instead of a twitch.
 */
const DRIFT_BOX: Box = { x: -78, y: -56, w: 156, h: 112 };

/**
 * 1 inside one of `windows`, 0 outside, with a short ease at each edge.
 *
 * This is what makes Blue's drift happen a countable number of times rather
 * than continuously: the ricochet underneath is running always (it is a pure
 * function of the frame), and the envelope decides when any of it reaches the
 * screen. `blueRicochet`'s own start is the box centre, so an envelope of 0 puts
 * him exactly back in formation with nothing to blend.
 */
function driftEnvelope(f: number, windows: ReadonlyArray<readonly [number, number]>): number {
  for (const [a, b] of windows) {
    if (f >= a && f < b) {
      const inU = Math.min(1, (f - a) / 5);
      const outU = Math.min(1, (b - f) / 6);
      return kidEase.easeInOutSine(Math.min(inU, outU));
    }
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Scene 9 — Seven pieces. THE SPLIT.
// ---------------------------------------------------------------------------

const S9_DRIP = { x: 900, y: 528, scale: 2.05 };
/** Where the seven come out of the far side of the raindrop. */
const EMERGE = { x: S9_DRIP.x + 210, y: S9_DRIP.y + 40 };

const S9_BUBBLES: Record<string, string> = {
  a1_37_ray: "What just happened?",
  a1_39_ray: "I was always SEVEN?",
};

/**
 * Scene 9 — the biggest picture in Act One, and the one beat in the episode
 * that most rewards being staged slowly.
 *
 * Ray walks into the raindrop, **bends** inside it, and comes out the far side
 * in seven pieces which fan into a full arc across the garden. Then sixty
 * frames with nothing over it, because a six-year-old has to be able to
 * *count* — seven blobs, seven faces, all of them his — and counting takes two
 * seconds.
 *
 * Three things are deliberate:
 *
 *   - **The seven fade up as Ray fades down**, both over the same twelve
 *     frames, so nothing is ever added or removed: he does not disappear and
 *     they do not appear, he *becomes* them. Nothing was taken away and nothing
 *     was given (script.md, Physics honesty).
 *   - **Red leaves first**, then orange, and so on down the line, staggered
 *     four frames apart. A rainbow that fans out all at once is a transition;
 *     one that peels apart in order is the sentence "in order, red on the
 *     outside through to violet".
 *   - **It decelerates into the hold.** One long `easeOutCubic` across the
 *     whole move, so the arc is still very slightly settling as the silence
 *     opens and then is completely still inside it.
 */
const SplitScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [walkFrom, walkTo] = lineWindow(scene, "a1_35_narrator");
  const [sevenFrom, sevenTo] = lineWindow(scene, "a1_36_narrator");
  const [beatFrom] = heldBeat(scene, "a1_36_narrator");
  // The ensemble's birthday, one colour at a time, riding Ray's own line.
  const [aliveFrom, aliveTo] = lineWindow(scene, "a1_37_ray");
  const bornAt = (i: number): number =>
    aliveFrom + Math.round(BIRTH_AT[i] * (aliveTo - aliveFrom));

  // Into the drop, bending, and out the far side.
  const enterAt = walkFrom + Math.round((walkTo - walkFrom) * 0.26);
  const emergeAt = sevenFrom + Math.round((sevenTo - sevenFrom) * 0.34);
  // **The fan finishes eight frames into the silence, not halfway through it.**
  // It used to land on `beatFrom + 30`, which meant the first second of a beat
  // bought for *counting* still had the picture moving in it. The script asks
  // for the arc to be "still very slightly settling as the silence opens and
  // then completely still inside it", and eight frames of an `easeOutCubic`
  // tail is exactly that. The beat's own length is untouched — it is a
  // `gapFrames` in Video.tsx and none of this may change it.
  const arcAt = beatFrom + 8;

  const walk = kidEase.easeInOutSine((frame - enterAt) / Math.max(1, emergeAt - enterAt));
  // Inside the drop he bends — the path curves down and the body leans with it,
  // which is refraction at six-year-old resolution and is the only physics in
  // the shot.
  const inside = frame >= enterAt && frame < emergeAt;
  const ray = moveAlong({ x: -160, y: 520 }, EMERGE, walk, {
    arc: -0.26,
    ease: kidEase.easeInOutSine,
  });

  // The fan.
  const split = kidEase.easeOutCubic((frame - emergeAt) / Math.max(1, arcAt - emergeAt));
  const rayAlpha = 1 - kidEase.easeInOutSine((frame - emergeAt) / 12);

  // **The drop leaves.** It is 780 pixels tall and parked on the middle of the
  // frame, and the arc's apex is directly behind its face — a still of the
  // reveal beat had Green and Yellow sitting on Drip's eye, which is the one
  // shot in Act One the script says must be held wide and counted. So once the
  // seven are out of it the raindrop does what a raindrop does and falls on
  // through, shrinking as it goes, and the middle of the picture is the arc.
  const fall = kidEase.easeInQuad((frame - emergeAt - 5) / 30);

  const stage = useStage(scene);
  const emotion = useEmotion(
    scene,
    "ray",
    { a1_37_ray: "amazed", a1_39_ray: "amazed" },
    "excited",
    // 60f held beat in this scene.
    NO_LEAD,
  );

  // A slow pull back over the beat, so the whole arc is in frame with air
  // around it by the time the audience starts counting.
  const zoom = interpolate(frame, [emergeAt, arcAt], [1.08, 0.96], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam: Cam = { x: 960, y: 700, zoom };

  return (
    <AbsoluteFill>
      <PaintedSky bg="garden_day" phase={5.7} vignette={0.2} />
      <Camera cam={cam}>
        {/* The raindrop, big and glassy, with Ray somewhere inside it. */}
        <div style={{ opacity: 0.86 * (1 - fall) }}>
          <Drip
            x={S9_DRIP.x}
            y={hover("drip", S9_DRIP.y + fall * 760, S9_DRIP.scale * (1 - fall * 0.4))}
            scale={S9_DRIP.scale * (1 - fall * 0.4)}
            phase={PHASE.drip}
            emotion="happy"
            look={{ x: -0.3, y: 0.2 }}
            shadow={false}
            feet={false}
            arms={false}
            zIndex={8}
          />
        </div>

        <Ray
          x={ray.x}
          y={hover("ray", ray.y, 0.8)}
          scale={0.8 * (inside ? 1.06 : 1)}
          brightness={RAY_LIGHT.actOne}
          spectrum={RAY_SPECTRUM.none}
          phase={PHASE.ray}
          emotion="excited"
          look={{ x: 0.6, y: 0 }}
          bank={ray.angle * 0.5}
          streak={0.8}
          opacity={Math.max(0, Math.min(1, rayAlpha))}
          zIndex={12}
        />

        <SevenBorn
          u={split}
          from={EMERGE}
          bornAt={bornAt}
          speaking={stage.speaking("ray")}
          emotion={emotion}
          look={split > 0.9 ? "camera" : { x: 0.3, y: -0.2 }}
        />
      </Camera>

      <Bubbles
        scene={scene}
        cast={
          {
            ray: {
              ...projectMark(cam, { x: 960, y: hover("shard", 600, 0.9), scale: 0.9, who: "shard" }),
              side: "right",
            },
          } as Cast
        }
        text={S9_BUBBLES}
        at={{
          a1_37_ray: { x: 960, y: 236, tail: "none" },
          a1_39_ray: { x: 960, y: 236, tail: "none" },
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * The seven, travelling from one point out onto the arc.
 *
 * `u` 0..1 is the fan. Each shard runs its own stagger (red first) and its own
 * bowed path, so what the audience watches is seven things peeling apart rather
 * than one thing scaling up.
 *
 * Always seven, always mounted, always in the same order — a fixed-length list,
 * which is what keeps the hook count identical on every frame of the episode.
 */
const SevenArc: React.FC<{
  u: number;
  from: { x: number; y: number };
  speaking?: boolean;
  emotion?: Parameters<typeof RayShard>[0]["emotion"];
  look?: Parameters<typeof RayShard>[0]["look"];
  /** Per-shard extra bob, for the roll call. */
  bob?: (i: number) => number;
  scale?: number;
  /** 0..1 per shard, for the merge in Scene 13. */
  alpha?: (i: number) => number;
}> = ({ u, from, speaking, emotion, look, bob, scale = 0.9, alpha }) => (
  <>
    {SPECTRUM.map((c, i) => {
      const to = shardPoint(i);
      const stagger = i * 0.055;
      const t = Math.max(0, Math.min(1, (u - stagger) / (1 - stagger * 0.9)));
      const p = moveAlong(from, to, t, {
        // Fanning: the outer ones bow further than the inner ones, so the seven
        // open like a hand rather than like a spray.
        arc: -0.1 - (SPECTRUM.length - 1 - i) * 0.045,
        ease: kidEase.easeOutCubic,
      });
      const hop = bob ? bob(i) : 0;
      return (
        <RayShard
          key={c.name}
          color={i}
          x={p.x}
          y={p.y - hop * 34}
          scale={scale * (1 + hop * 0.08)}
          phase={SHARD_PHASE[i]}
          emotion={emotion}
          speaking={speaking}
          look={look}
          bank={p.angle * 0.25}
          opacity={(alpha ? alpha(i) : 1) * Math.max(0, Math.min(1, (t - 0.02) * 14))}
          zIndex={14 + i}
        />
      );
    })}
  </>
);

/** The scale the seven are staged at on the arc, in Scenes 9 and 10. */
const ARC_SCALE = 0.9;

/**
 * Orange's two marks: where he lands in the fan, and where he settles once he
 * is himself.
 *
 * His law is "matches Red's stride exactly, one body-length behind", and on a
 * still the readable half of that is the **gap**: exactly `SHARD_BODY` of it,
 * measured along the chord to Red. The arc's own spacing puts him at about 230
 * against a body of 216 at this scale, which is a fourteen-pixel correction —
 * invisible. So the *fan* drops him thirty pixels wide of where he belongs and
 * the settle closes forty-odd, which is a fifth of a body and reads as a man
 * taking up his position next to somebody.
 */
const ORANGE_MARKS = (() => {
  const red = shardPoint(0);
  const slot = shardPoint(1);
  const d = Math.max(1, Math.hypot(slot.x - red.x, slot.y - red.y));
  const u = { x: (slot.x - red.x) / d, y: (slot.y - red.y) / d };
  const gap = SHARD_BODY * ARC_SCALE;
  return {
    loose: { x: red.x + u.x * (gap + 44), y: red.y + u.y * (gap + 44) },
    home: { x: red.x + u.x * gap, y: red.y + u.y * gap },
  };
})();

/**
 * The two windows Blue leaves formation in, in frames after he wakes, and they
 * are two on purpose: revision §6.2 says he "drifts a few pixels out of
 * formation, **twice**". Eighteen usable frames each is two `BLUE_LEG`s, so
 * there is a hard corner inside both of them — a Blue who drifts out and back
 * on one smooth arc is a float, and the corner is the entire character.
 */
const S9_BLUE_OUT = [
  [0, 20],
  [28, 50],
] as const;

/**
 * **Scene 9's seven: the fan, and then the birth.**
 *
 * One component for both halves rather than two swapped at the beat, because
 * two components is two hook counts and Remotion renders frames in a pool of
 * tabs (PROCESS.md §5). The fan is `SevenArc`'s geometry unchanged; everything
 * after it is `alive`.
 *
 * What each colour does with its birthday, from `SEVEN`:
 *
 *   Red     nothing. He is born alive and stays exactly as he was — the frame
 *           where six things change around one that does not.
 *   Orange  closes on Red and levels off (`ORANGE_MARKS`).
 *   Yellow  arms out, and he never puts them down again.
 *   Green   sits, in five frames, and stays sat.
 *   Blue    two drifts out of formation with a corner in each, trailing the
 *           kit's bent-line blur.
 *   Indigo  the same drift, four frames stale, from his own slot.
 *   Violet  vibrates, hardest of the seven, in place, at the far end.
 */
const SevenBorn: React.FC<{
  u: number;
  from: { x: number; y: number };
  bornAt: (i: number) => number;
  speaking?: boolean;
  emotion?: Parameters<typeof RayShard>[0]["emotion"];
  look?: Parameters<typeof RayShard>[0]["look"];
}> = ({ u, from, bornAt, speaking, emotion, look }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Blue's drift, and Indigo's copy of it, are both read off Blue's clock.
  const blueF = frame - bornAt(4);
  const drift = (f: number): { dx: number; dy: number; angle: number; env: number } => {
    const env = driftEnvelope(f, S9_BLUE_OUT);
    const p = blueRicochet(Math.max(0, f), DRIFT_BOX, 4);
    return { dx: p.x * env, dy: p.y * env, angle: p.angle, env };
  };
  return (
    <>
      {SPECTRUM.map((c, i) => {
        // --- the fan, exactly as it was -------------------------------------
        const slot =
          i === 1 ? ORANGE_MARKS.loose : shardPoint(i);
        const stagger = i * 0.055;
        const t = Math.max(0, Math.min(1, (u - stagger) / (1 - stagger * 0.9)));
        const p = moveAlong(from, slot, t, {
          arc: -0.1 - (SPECTRUM.length - 1 - i) * 0.045,
          ease: kidEase.easeOutCubic,
        });

        // --- the birth -------------------------------------------------------
        // Red is 1 from the first frame: he never stopped being alive, so the
        // state the other six wake out of is his and waking him is a no-op.
        const since = frame - bornAt(i);
        const alive =
          i === 0 ? 1 : kidEase.easeOutQuad(Math.max(0, Math.min(1, since / BIRTH_FRAMES)));

        // Orange closes the gap with a settle on the way in.
        const close = i === 1 ? alive : 0;
        const bounce =
          i === 1 && since >= 0
            ? // `phase = -π/2` so the ring starts at rest and overshoots — a
              // settle, not an impact that is already compressed on frame one.
              settleWave(since / (fps * 0.6), 1.25, 4.2, -Math.PI / 2) * 0.18
            : 0;
        const home = {
          x: p.x + (ORANGE_MARKS.home.x - ORANGE_MARKS.loose.x) * (close + bounce),
          y: p.y + (ORANGE_MARKS.home.y - ORANGE_MARKS.loose.y) * (close + bounce),
        };

        // Blue drifts; Indigo drifts four frames late.
        const d = i === 4 ? drift(blueF) : i === 5 ? drift(blueF - INDIGO_LAG) : null;
        const x = (i === 1 ? home.x : p.x) + (d ? d.dx * alive : 0);
        const y = (i === 1 ? home.y : p.y) + (d ? d.dy * alive : 0);

        const sit = i === 3 ? greenSit(frame, bornAt(3), true) : 0;
        return (
          <ArcShard
            key={c.name}
            i={i}
            x={x}
            y={y}
            scale={ARC_SCALE}
            alive={alive}
            sit={sit}
            heading={d ? d.angle : p.angle}
            // **No trail on the drift, and that is a measurement rather than a
            // taste call.** `blueTrail`'s two-leg window is as long as the legs
            // it is made of, and a drift small enough to be "a few pixels out of
            // formation" makes legs of fifty pixels against a body two hundred
            // wide — so the whole trail hides behind Blue and the only part that
            // pokes out is a stub, which reads as a bead stuck to his neck. It
            // is the exact failure the kit's own note on `blueTrail` describes.
            // At this amplitude the *corner in the path* and the lean into the
            // new leg are the blur; the drawn trail arrives in Scene 10, where
            // his box is big enough to out-measure him.
            emotion={emotion}
            speaking={speaking}
            look={look}
            opacity={Math.max(0, Math.min(1, (t - 0.02) * 14))}
            zIndex={14 + i}
          />
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// Scene 10 — The roll call
// ---------------------------------------------------------------------------

const S10_BUBBLES: Record<string, string> = {
  // A summary, not a transcript — script.md says so in as many words. The clip
  // names all seven; the bubble is four cheerful hellos.
  a1_42_ray: "Hi! Hi! Hi! Hi!",
  a1_44_ray: "Never met me before.",
};

/**
 * Scene 10 — the kids'-series signature, third episode running, and it costs
 * **no new staging idea**: the seven are standing there anyway, so the whole
 * gag is seven eye-lines and a wave.
 *
 * The button is the part that has to be got right. script.md: "Nothing enters
 * this. No wave, no bubble, no entrance, no emotion change — Ray hangs there
 * doing absolutely nothing while the seven blobs hold their arc behind him.
 * Deadpan is stillness, and the laugh lives in the silence rather than in the
 * read." So inside the 24-frame beat his pose drops to rest, his wave has
 * already died, his idle drops, and **no emotion is mapped to a1_44 at all** —
 * the face he ends the roll call with is the face he says the button on.
 */
const RollCallScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [greetFrom, greetTo] = lineWindow(scene, "a1_42_ray");
  const [landFrom] = heldBeat(scene, "a1_42_ray");
  const [stillFrom, stillTo] = heldBeat(scene, "a1_43_narrator");

  const greeting = frame >= greetFrom && frame < greetTo;
  // He walks the line left to right across his own line, one greeting per
  // seventh of it — but he **runs out of line one name early**. His walk tops
  // out over Indigo and his eyes go back to camera as Violet's turn opens, so
  // that the seventh greeting is delivered to a blob Ray has already stopped
  // looking at. That is Violet's firing zero, and it is the plant that makes
  // Scene 11's W and Scene 20's dome land; it costs no frames and no line.
  const slot = Math.max(1, greetTo - greetFrom) / SPECTRUM.length;
  const violetFrom = greetFrom + 6 * slot;
  const along = Math.max(0, Math.min(1, (frame - greetFrom) / (6 * slot)));
  // **He walks the middle of the bow, not the ends of it.** The lifted ellipse
  // clears the shards handsomely at the apex and barely at all where the bow
  // turns down — a still of the first frame of this scene had Ray materialising
  // on top of Red, which is a bad cut and, worse, the wrong first picture for
  // the one character whose whole moment is that nothing happens to him. So the
  // walk runs 0.18 → 0.78 of the arc: he hovers up and to the right of Red for
  // the first greeting and stops over Indigo for the last, which is also where
  // "he has already turned away" comes from.
  const track = arcPointLifted(0.18 + along * 0.6);
  const lookingAtTheLine = greeting && frame < violetFrom + 4;

  // **The eye-line is the scene.** script.md: "the gag is seven eye-lines and a
  // wave." A fixed downward look was fine when he walked the whole bow; now that
  // he walks the middle of it, the same look points at the lawn on the first two
  // names. So he aims at *the mark of whoever he is naming*, one seventh of the
  // line at a time.
  //
  // He aims at Blue's **slot**, not at Blue, and that is the joke rather than a
  // bug: the answer comes back from wherever Blue has got to, and Ray never
  // finds out.
  const naming = Math.max(0, Math.min(6, Math.floor((frame - greetFrom) / slot)));
  const at = naming === 1 ? ORANGE_MARKS.home : shardPoint(naming);
  const gaze = aimAt(track, at);

  // The wave dies over ten frames as the first beat opens: the arms stay up and
  // stop moving, which is the deflation-by-stillness the series runs on.
  const wave = Math.max(0, 1 - kidEase.easeOutQuad((frame - landFrom) / 10));
  const inButtonBeat = frame >= stillFrom && frame < stillTo;

  const stage = useStage(scene);
  const emotion = useEmotion(
    scene,
    "ray",
    // a1_44 is deliberately not in this map.
    { a1_42_ray: "excited" },
    "happy",
    NO_LEAD,
  );

  return (
    <AbsoluteFill>
      <PaintedSky bg="garden_day" phase={6.8} vignette={0.2} />
      <SevenGreeted greetFrom={greetFrom} greetTo={greetTo} />
      {/* Bigger than the seven he is greeting, not smaller: he is the one doing
          the greeting and the joke is that they are all him. At 0.62 he read as
          an eighth blob a row behind them. */}
      <Ray
        x={track.x}
        y={hover("ray", track.y, 0.78)}
        scale={0.78}
        brightness={RAY_LIGHT.actOne}
        spectrum={RAY_SPECTRUM.none}
        phase={PHASE.ray}
        emotion={emotion}
        speaking={stage.speaking("ray")}
        look={lookingAtTheLine ? gaze : "camera"}
        bank={track.angle * 0.3}
        pose={inButtonBeat || wave <= 0.02 ? "rest" : "wave"}
        wave={wave}
        idle={inButtonBeat ? 0.55 : 1}
        streak={0.4}
        zIndex={30}
      />
      <Bubbles
        scene={scene}
        cast={
          {
            ray: { x: track.x, y: hover("ray", track.y, 0.78), scale: 0.78, who: "ray" },
          } as Cast
        }
        text={S10_BUBBLES}
        at={{
          a1_42_ray: { x: 960, y: 226, tail: "left", tailAt: track.x },
          a1_44_ray: { x: 960, y: 226, tail: "left", tailAt: track.x },
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * A `look` direction from one mark to another: the unit vector between them,
 * pushed a little past unit so a near-vertical glance actually reaches the
 * bottom of the eye rather than stopping halfway, then clamped.
 */
function aimAt(from: { x: number; y: number }, to: { x: number; y: number }): {
  x: number;
  y: number;
} {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const m = Math.max(1, Math.hypot(dx, dy));
  const k = 1.35;
  return {
    x: Math.max(-1, Math.min(1, (dx / m) * k)),
    y: Math.max(-1, Math.min(1, (dy / m) * k)),
  };
}

/** 0 → 1 → 0 across `[a, b)`, with `ramp` frames of ease at each end. */
function pulse(f: number, a: number, b: number, ramp = 5): number {
  if (f <= a || f >= b) return 0;
  return kidEase.easeInOutSine(Math.min(1, Math.min((f - a) / ramp, (b - f) / ramp)));
}

/**
 * The box Blue is *not where Ray is looking* inside. Placed on his own slot on
 * the arc, and big enough that he is reliably a hundred-odd pixels off it —
 * which is the whole of his moment: Ray greets the spot, and the answer comes
 * from somewhere else in frame.
 *
 * It is **biased downward** (−120 up, +170 down) because Ray walks the arc
 * *above* the seven, and a box centred on the slot put Blue through him — a
 * still had Ray's wave ribbon crossing Blue's face on the frame Ray was
 * greeting somebody else. It is otherwise as big as the arc will tolerate: the
 * legs `blueRicochet` cuts are 45–85% of the box's short side, so a tight box
 * gives a Blue who twitches instead of one who changes his mind.
 */
const S10_BLUE_BOX: Box = { x: -180, y: -70, w: 360, h: 260 };
/**
 * Indigo runs Blue's identical path, four frames late — but anchored a body and
 * a half to the LEFT of his own slot.
 *
 * The lag is the character and it is untouched; the anchor is staging. Blue's
 * box is as wide as the arc will take, and Indigo's slot is the second from the
 * right, so the same box hung on his own mark walked him straight through
 * Violet — a still had the two of them sharing one square of lawn while Ray was
 * greeting somebody else. Two of the seven in the same place is not a joke, it
 * is a bug, and Violet is the one character in the episode whose entire gag
 * depends on being findable.
 */
const INDIGO_NUDGE = { x: -130, y: 0 } as const;
/** How late Blue is. Twenty-six frames into his own thirty-frame slot. */
const BLUE_LATE = 26;

/**
 * **Scene 10's seven: one greeting each, and seven different answers.**
 *
 * `a1_42_ray` runs at 0.88 — the slowest character line in the episode — and
 * leaves a clear gap between items, so each colour gets its own thirtieth of a
 * second-and-a-bit to answer in. Nobody answers *out loud* (ruling R1): six of
 * them have voices by Act Two and not one of them uses it here, because the
 * roll call's three-episode shape is name → flat narrator line → unbothered
 * button, and a spoken reply breaks it. Every reply is a movement.
 *
 *   Red     **nothing. Zero frames.** He does not turn, does not bob, does not
 *           lean, and his eyes never leave the middle distance — he is the only
 *           one of the seven who is still looking straight ahead at the end of
 *           the scene. This is the scene's best moment and it is made entirely
 *           of the absence of code.
 *   Orange  one nod, then a glance at Red to check that was allowed.
 *   Yellow  was already waving; waves harder (`YELLOW_REST` → 1).
 *   Green   stands up, wags, and sits straight back down.
 *   Blue    is not where Ray is looking. He answers twenty-six frames late,
 *           from somewhere else in frame, and dips at the end of it — the
 *           nearest thing to "apologises with his hands" the shard rig has,
 *           because a raised arm belongs to Yellow and to nobody else.
 *   Indigo  does Blue's answer four frames later, from the place Blue just
 *           left — literally: his position is `blueRicochet` four frames stale,
 *           so the wag and the spot are both second-hand.
 *   Violet  last, both arms out, waving with the only thing he has — amplitude.
 *           Ray has already turned back to camera.
 *
 * **The freeze.** Every reaction below is a function of `held`, which stops at
 * the end of the greeting: through the 20f beat, the 24f beat and the button
 * the seven hold whatever pose the greeting left them in — Yellow's arms up and
 * still, Green sat, Blue stopped somewhere he should not be, Indigo stopped
 * where Blue was. Nobody keeps waving and nothing enters.
 *
 * The one thing that does not stop is Violet's vibration, and that is correct:
 * the kit applies it unconditionally (`<Shard who="violet">`) because there is
 * no frame of this episode in which Violet holds still. It is his resting
 * state, not a gesture — the rule the beat enforces is that no *gesture*
 * outlives the line.
 */
const SevenGreeted: React.FC<{ greetFrom: number; greetTo: number }> = ({
  greetFrom,
  greetTo,
}) => {
  const frame = useCurrentFrame();
  const slot = Math.max(1, greetTo - greetFrom) / SPECTRUM.length;
  // Everything below reads this clock, and it stops when the greeting does.
  const held = Math.min(frame, greetTo);
  const since = (i: number): number => held - (greetFrom + i * slot);
  // Six frames of the greeting ending, and the only thing it drives is Yellow's
  // arms: they stay exactly where they are and stop moving. Everybody else is
  // already frozen by `held`, but a flap is not a position — `ShardArms` reads
  // the wall clock — so his is the one gesture that has to be told to stop.
  const stilling = Math.max(0, Math.min(1, (frame - greetTo) / 6));

  // Blue's whole scene, and Indigo's four frames behind it. It runs from the
  // first frame rather than from the greeting: Scene 9 left Blue alive, and
  // `blueRicochet(0)` is the centre of its own box, so he starts exactly on the
  // slot Scene 9 put him on and leaves it on his own.
  const blue = blueRicochet(held, S10_BLUE_BOX, 9);
  const indigo = blueRicochet(held - INDIGO_LAG, S10_BLUE_BOX, 9);
  // The wag: a heading swung between straight up and straight down, which
  // `Shard` reads as a lean either way. A wag is what a body with no arms has.
  const wagAt = (f: number): number => Math.sin(f * 0.85) * 90;
  const blueWave = pulse(since(4), BLUE_LATE, BLUE_LATE + 22, 4);
  const indigoWave = pulse(since(4) - INDIGO_LAG, BLUE_LATE, BLUE_LATE + 22, 4);
  const blueSorry = pulse(since(4), BLUE_LATE + 18, BLUE_LATE + 34, 6);

  return (
    <>
      {SPECTRUM.map((c, i) => {
        const p = shardPoint(i);
        const home = i === 1 ? ORANGE_MARKS.home : p;
        const f = since(i);
        // Nobody turns to Ray until Ray gets to them, so the eye-line walks the
        // arc a third time. Red never turns at all.
        let look: { x: number; y: number } =
          i === 0 || f < -6 ? { x: 0.1, y: -0.15 } : { x: 0, y: -0.55 };

        let x = home.x;
        let y = home.y;
        let heading = 0;
        let sit = 0;
        let wave: number | undefined;
        let vibrate: number | undefined;
        let arms: boolean | undefined;

        if (i === 1) {
          // One nod — and then the sideways check. He does not look back up
          // afterwards, so the pose the freeze catches him in is a man still
          // waiting to hear whether that was allowed.
          y += pulse(f, 0, 15, 6) * 18;
          if (f >= 12) look = { x: -0.8, y: 0.15 };
        } else if (i === 2) {
          const loud = YELLOW_REST + (1 - YELLOW_REST) * pulse(f, 0, 26, 6);
          wave = loud + (YELLOW_FROZEN - loud) * stilling;
          y -= pulse(f, 0, 26, 6) * 10;
        } else if (i === 3) {
          // Sat since Scene 9. He gets up, wags, and is sitting again before
          // Ray has finished the next name.
          const up = pulse(f, 3, 26, 5);
          sit = 1 - up;
          heading = wagAt(f) * pulse(f, 8, 22, 4);
        } else if (i === 4) {
          x += blue.x;
          y += blue.y;
          heading = blue.angle + (wagAt(held) - blue.angle) * blueWave;
          y += blueSorry * 16;
        } else if (i === 5) {
          x += indigo.x + INDIGO_NUDGE.x;
          y += indigo.y + INDIGO_NUDGE.y;
          heading = indigo.angle + (wagAt(held - INDIGO_LAG) - indigo.angle) * indigoWave;
        } else if (i === 6) {
          // His wave is amplitude, because amplitude is all he is. It is also
          // the only wave in the scene nobody sees.
          vibrate = 1 + pulse(f, 0, 30, 6) * 0.7;
          arms = f >= -4;
        }

        return (
          <ArcShard
            key={c.name}
            i={i}
            x={x}
            y={y}
            scale={ARC_SCALE}
            sit={sit}
            wave={wave}
            vibrate={vibrate}
            arms={arms}
            heading={heading}
            // **No drawn trail here either — and this one was rendered three
            // ways before it was dropped.** `blueTrail`'s two-leg window is as
            // long as the legs it is made of, and any box small enough to keep
            // Blue inside the arc gives legs about as long as a shard is wide.
            // The near half of the trail therefore sits *behind* him and only
            // the oldest band shows — a thin 12%-alpha hook, detached, hanging
            // off his side, which over `garden_day`'s lawn is neither blue nor a
            // blur but a grey J. It reads as a rendering fault, which is the
            // exact failure revision §11 warns about by name.
            //
            // What carries his signature instead is what a paused frame can
            // actually see: he is the only one of the seven **off formation**,
            // he is leaning a full `SHARD_LEAN` into whichever leg he is on
            // (`lean: 1`, the joint highest in the table), and the path he is on
            // has hard corners in it rather than curves. Indigo is the same
            // picture four frames stale. Violet, next to them, is a smear of
            // ghosts around a point he never leaves — still two visibly
            // different kinds of blur, which is the requirement.
            look={look}
            zIndex={14 + i}
          />
        );
      })}
    </>
  );
};

/**
 * The path Ray walks: the arc, lifted clear of the shards standing on it.
 *
 * **Outward, not upward.** A constant vertical lift clears the apex and clears
 * nothing at the ends, where the bow is steep — a still had him sitting on top
 * of Indigo while saying he had never met himself. A slightly larger ellipse
 * through the same angles offsets every point along the arc's own outward
 * normal, so the gap to the shard below him is the same all the way along.
 */
function arcPointLifted(u: number): { x: number; y: number; angle: number } {
  return arcPoint(u, { rx: 790, ry: 710 });
}

// ---------------------------------------------------------------------------
// Scene 11 — Big Word One: RAINBOW
// ---------------------------------------------------------------------------

const CARD_Y = 300;
/**
 * Where Ray and Drip perch, hand-tuned against a still of the card at
 * 1920×1080 — the same two magic numbers episode two spent on the A of AIR, and
 * worth it for the same reason: it is the only piece of business in the beat.
 *
 * `W_BAR` is the crossbar of the W in the `WordCard`'s "RAINBOW"; `B_TOP` is
 * Drip's mark on the B. Ray hops from the W of RAINBOW to the w of "Bow" as the
 * letters split under him — a short hop, because since C1 he is **staying on
 * his own letter** rather than moving to somebody else's, and because the
 * letter he is sitting on is the one the seventh colour needs.
 *
 * `B_TOP` moved left and down (was 1010, 250) when Blue was going to take the
 * top of the B and Drip standing on it too put her head inside him. Under
 * ruling R8 Blue does *not* get the B — he bounces off her and ends up under
 * "Rain" — but the mark stays where the still put it, because that is where it
 * looks right: she reads as standing at the shoulder of the B, which is her
 * letter, and Blue arrives at her rather than at a seat.
 *
 * **Both are card-phase marks only.** Once the word breaks into blocks, Ray and
 * Drip perch on `syllableBlock()` letters like the seven do (`wSeat`,
 * `DRIP_ON_B`) — a character nailed to a composition coordinate slides off its
 * own letter the moment the block hops.
 */
const W_BAR = { x: 1272, y: 258 };
const B_TOP = { x: 990, y: 274 };
const PERCH = 0.36;

const S11_BUBBLES: Record<string, string> = {
  a1_49_drip: "That is you and me!",
};

// --- the seven, on the word (punch-up C1) ----------------------------------
//
// **RAINBOW has seven letters and Ray has seven colours.** The card is already
// staged as a place characters sit (Ray on the W, Drip on the B), so the whole
// change is that the other seven come up out of the frozen garden and take one
// letter each, in spectrum order, and one of them does not get a seat.
//
// It costs nothing: no line, no clip, no held beat, not one frame of runtime.
// It is the first firing of a **silent running gag** that Scenes 20 and 28 both
// cash in, and Violet has to be the same blob every time — same seventh colour,
// same seventh phase, same recognisable silhouette — or he is three different
// accidents rather than one character.
//
// The geometry is measured off a still of the settled card at 1920×1080, in the
// same spirit as `W_BAR`/`B_TOP` above, and expressed **relative to the two
// syllable blocks** rather than as absolute marks: the blocks spring in, hop one
// at a time through the chant, and sit at a two-degree tilt, and a blob nailed
// to a composition coordinate would slide off its own letter the moment its
// block bounced. `syllableBlock()` below is `SyllableBlocks`' own arithmetic
// (src/lib/kid/BigWord.tsx), reproduced because a perch has to agree with the
// thing it is perched on.

/** Centre x of the "Rain" and "Bow" blocks, and the row's centre y. */
const BLOCK_X = [768, 1160] as const;
/** Which block each of the seven letters is in, and its x from that centre. */
const LETTER_AT: ReadonlyArray<{ block: 0 | 1; dx: number }> = [
  { block: 0, dx: -100 }, // R  — Red
  { block: 0, dx: -27 }, //  a  — Orange
  { block: 0, dx: 24 }, //   i  — Yellow
  { block: 0, dx: 82 }, //   n  — Green
  { block: 1, dx: -94 }, //  B  — Blue
  { block: 1, dx: -21 }, //  o  — Indigo
  { block: 1, dx: 69 }, //   w  — Violet, who does not get it
];
/** A perched blob straddles the top edge of its block. */
const PERCH_DY = -86;
/**
 * Where Violet ends up: past the right-hand end of the "Bow" block, lower than
 * a seat, tipped over, holding on. Nobody looks at him and nobody mentions him,
 * and he is still there when the card cuts.
 */
const VIOLET_CLING = { dx: 182, dy: -48, bank: 26 } as const;
const SHARD_PERCH = 0.36;

/** Frames one of the seven spends in the air on its way to its letter. */
const FLIGHT = 44;
/** The card's own letter stagger, and therefore theirs. */
const RISE_STAGGER = 2.5;
/**
 * How early Red sets off.
 *
 * His law is one unvaried speed and a dead-straight line, and the only way to
 * obey it *and* land on the beat his letter does is to leave before everybody
 * else and take longer over it — which is the whole of him. (`RED_SPEED`, the
 * 108 px/s the rest of the episode walks him at, is not available here: the R is
 * eight hundred pixels from the arc and 108 px/s would need two hundred frames.
 * What survives at card scale is the *shape* of the law — constant speed, no
 * arc, no ease, no anticipation — and that is what is drawn. He is the only one
 * of the seven on a straight line, in motion and in a paused frame.)
 */
const RED_EARLY = 14;
/**
 * Orange's lag: the frames Red takes to cover one body length on the way in
 * (`SHARD_BODY` at the perch scale, over Red's own px-per-frame). Specified as a
 * *delay*, not as a subtraction — so when Red arrives, Orange is exactly one
 * body behind him on his own line, and never overtakes.
 */
const ORANGE_LAG = 6;

/**
 * **Drip's mark, on the B, expressed on the block rather than in composition
 * coordinates** (the 2026-07-28 finding, now applied to her as well as to the
 * seven): the blocks spring in, hop through the chant and sit at a two-degree
 * tilt, and a character nailed to a fixed point slides off her letter the
 * moment her block bounces. These two numbers reproduce the mark that was
 * hand-tuned against a still, and now they ride the letter.
 */
const DRIP_ON_B = { dx: -170, dy: -26 } as const;

/**
 * **RULING R8 (showrunner, 2026-08-02) — DECIDED, DO NOT "FIX" THIS.**
 *
 * Blue's letter is the B and Drip is already sitting on it. The revision (§6.4)
 * offered two ways out — move Drip to the second "n", or leave her where she is
 * and let Blue bounce off her — and the ruling takes the second: **Drip stays on
 * the B, and Blue ricochets off her twice before settling somewhere else
 * entirely.** It is funnier than moving either of them and it is one more free
 * firing of the only signature Blue has.
 *
 * So this is where Blue actually ends up: underneath the far side of "Rain",
 * across the word from the letter he was aiming at, hanging off the bottom edge.
 * Nobody moves him back and nobody mentions it.
 */
const BLUE_SETTLE = { block: 0 as const, dx: 46, dy: 88 };
/**
 * The two bounces, as unit directions and distances. Two *different* directions
 * rather than one repeated: a change of direction is Blue's entire blur, and two
 * identical hops off the same point read as a bobble.
 */
const BOUNCE = [
  { x: 0.64, y: -0.77, px: 156 },
  { x: -0.58, y: 0.81, px: 112 },
] as const;
/** Frames per bounce: out on the first eight, back on the second eight. */
const BOUNCE_LEG = 8;
/** Frames Blue spends leaving for `BLUE_SETTLE` once he gives up on the B. */
const BLUE_DEPART = 16;

/** A triangle: 0 at both ends, 1 in the middle of `[0, len]`. Hard corner at the top. */
function tri(f: number, len: number): number {
  if (f <= 0 || f >= len) return 0;
  const h = len / 2;
  return f < h ? f / h : 2 - f / h;
}

/**
 * **Blue's two bounces off Drip, as a displacement from the letter he wanted.**
 *
 * `f` is frames since he first reaches her. Linear on every leg with a hard
 * corner at each end of it — no ease anywhere, because a ricochet that
 * decelerates into its own bounce is a float. Returns `{x: 0, y: 0}` before the
 * first contact and after the second bounce is spent, so a caller can add it to
 * a mark and get "he is on the mark" for free.
 *
 * Indigo runs this same function four frames late against his own letter, which
 * is what "does Blue's overshoot four frames later, on the o" means when it is
 * written down rather than eyeballed.
 */
function bounceOff(f: number): { x: number; y: number } {
  const a = tri(f, BOUNCE_LEG * 2);
  const b = tri(f - BOUNCE_LEG * 2, BOUNCE_LEG * 2);
  return {
    x: BOUNCE[0].x * BOUNCE[0].px * a + BOUNCE[1].x * BOUNCE[1].px * b,
    y: BOUNCE[0].y * BOUNCE[0].px * a + BOUNCE[1].y * BOUNCE[1].px * b,
  };
}

/** The last `span` frames of a path, oldest first — a trail with its corners in. */
function sampleTrail(
  path: (f: number) => { x: number; y: number },
  frame: number,
  span = 18,
  n = 14,
): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let s = 0; s <= n; s++) out.push(path(frame - span + (span * s) / n));
  return out;
}

const BigWordRainbowScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [wordFrom, wordTo] = lineWindow(scene, "a1_46_narrator");
  const [chantFrom, chantTo] = lineWindow(scene, "a1_47_ray");
  // The freeze lands on the word itself — "…It is a rainbow."
  const slamAt = Math.round(wordFrom + (wordTo - wordFrom) * 0.86);
  const splitAt = Math.max(slamAt + 20, chantFrom - 8);
  const chantLen = Math.max(1, chantTo - chantFrom);

  // **The two syllable blocks, live.** Everything that perches perches on one of
  // these — Ray, Drip and all seven — rather than on a composition coordinate.
  const blocks = BLOCK_X.map((_, j) =>
    syllableBlock(j, frame, fps, splitAt, chantFrom, chantLen),
  );

  // He rides the letters apart: a hop from the W's crossbar on the card to the
  // **w of "Bow"**, which is the same letter after the word splits — Ray staying
  // put rather than moving to somebody else's. It is also the seat the seventh
  // colour is about to need, which is the whole of C1's punchline.
  const wSeat = onBlock(blocks[1], LETTER_AT[6].dx, PERCH_DY);
  const hopU = (frame - splitAt + 6) / 16;
  const perch = moveAlong(W_BAR, wSeat, hopU, { arc: 0.34, ease: kidEase.easeInOutSine });
  const land = hopU > 1 ? settleWave((hopU - 1) / 2.2, 1.3, 4.4) : 0;

  // Drip crosses from the WordCard's B to the block's B as the word breaks up.
  const bSeat = onBlock(blocks[1], DRIP_ON_B.dx, DRIP_ON_B.dy);
  const cross = Math.max(0, Math.min(1, (frame - splitAt) / 12));
  const dripCentre = {
    x: B_TOP.x + (bSeat.x - B_TOP.x) * cross,
    y: B_TOP.y + (bSeat.y - B_TOP.y) * cross,
  };

  const stage = useStage(scene);
  const emotion = useEmotion(
    scene,
    "ray",
    { a1_47_ray: "excited" },
    "amazed",
    // Two 12-frame held beats in this scene.
    NO_LEAD,
  );

  // **She gets hit. Twice.** (R8.) Blue reaches her `FLIGHT` frames after his
  // own take-off and bounces off her again sixteen frames later, and each
  // contact rings through her — because a Drip who does not move is a Drip he
  // went past rather than a Drip he hit.
  const riseAt = slamAt - 22;
  const hitAt = riseAt + 4 * RISE_STAGGER + FLIGHT;
  const knock =
    settleWave((frame - hitAt) / 22, 1.6, 5, -Math.PI / 2) +
    settleWave((frame - hitAt - BOUNCE_LEG * 2) / 22, 1.6, 5, -Math.PI / 2) * 0.7;

  const dripMark: Mark = {
    x: dripCentre.x,
    y: hover("drip", dripCentre.y + knock * 7, 0.3),
    scale: 0.3,
    who: "drip",
    side: "left",
  };

  return (
    <AbsoluteFill>
      <BigWordBeat
        scene={scene}
        word="RAINBOW"
        syllables={["Rain", "Bow"]}
        chantKey="a1_47_ray"
        slamAt={slamAt}
        color={ACT_COLOR.rainbow}
        sub="rain and light"
        y={CARD_Y}
        freeze={<ArcStill />}
      >
        {/* The seven are drawn **live**, not inside the freeze, because they
            leave: the frozen plate is the garden they came out of, and what a
            child watches is the arc emptying into the word. They start at
            exactly the positions `ArcStill` used to hold, so nothing changes
            until they move. */}
        <SevenOnTheWord riseAt={riseAt} blocks={blocks} dripAt={dripCentre} />
        <Ray
          x={perch.x}
          y={hover("ray", perch.y + land * 8, PERCH)}
          scale={PERCH * (1 + land * 0.1)}
          brightness={RAY_LIGHT.actOne}
          spectrum={RAY_SPECTRUM.none}
          phase={PHASE.ray}
          emotion={emotion}
          speaking={stage.speaking("ray")}
          look="camera"
          streak={0.3}
          idle={0.6}
          zIndex={55}
        />
        <Drip
          x={dripMark.x}
          y={dripMark.y}
          scale={0.3 * (1 + knock * 0.1)}
          phase={PHASE.drip}
          emotion={useEmotion(scene, "drip", { a1_49_drip: "excited" }, "happy", NO_LEAD)}
          speaking={stage.speaking("drip")}
          look="camera"
          shadow={false}
          zIndex={55}
        />
      </BigWordBeat>
      {/* Wet, rain-streaked capitals: the card has just come out of the rain,
          so a few streaks run down over the banner and one or two bead on the
          bottom edge. Drawn *over* the card (which owns zIndex 50) and kept
          faint — the letters have to stay the most legible thing on screen. */}
      <RainStreaks from={slamAt} />
      <Bubbles
        scene={scene}
        cast={{ drip: dripMark } as Cast}
        text={S11_BUBBLES}
        at={{ a1_49_drip: { x: 640, y: 620, tail: "right", tailAt: dripCentre.x } }}
      />
    </AbsoluteFill>
  );
};

/**
 * The action the Big Word freezes: Scene 10's garden.
 *
 * **The seven are not in here any more.** They used to be — the freeze was the
 * whole picture — but C1 has them climb out of the arc and onto the letters, so
 * they moved to the live layer and this holds the world they left. Freezing
 * them here as well would draw fourteen blobs.
 */
const ArcStill: React.FC = () => (
  <AbsoluteFill>
    <PaintedSky bg="garden_day" phase={6.8} vignette={0.2} />
  </AbsoluteFill>
);

/** One syllable block's live transform — `SyllableBlocks`' own arithmetic. */
function syllableBlock(
  j: number,
  frame: number,
  fps: number,
  splitAt: number,
  chantFrom: number,
  chantLen: number,
): { cx: number; cy: number; scale: number; rot: number } {
  const land = spring({ frame: frame - splitAt - j * 3, fps, config: { damping: 11, mass: 0.6 } });
  const per = chantLen / BLOCK_X.length;
  const u = (frame - (chantFrom + j * per)) / per;
  const hop = u >= 0 && u <= 1 ? Math.sin(u * Math.PI) : 0;
  return {
    cx: BLOCK_X[j],
    cy: CARD_Y - hop * 56 + (1 - land) * -90,
    scale: (0.4 + 0.6 * land) * (1 + hop * 0.14),
    rot: ((1 - land) * 12 - 2 + hop * 3) * (Math.PI / 180),
  };
}

/** A point at `(dx, dy)` from a block's centre, in composition coordinates. */
function onBlock(
  b: { cx: number; cy: number; scale: number; rot: number },
  dx: number,
  dy: number,
): { x: number; y: number } {
  const c = Math.cos(b.rot);
  const s = Math.sin(b.rot);
  return {
    x: b.cx + (dx * c - dy * s) * b.scale,
    y: b.cy + (dx * s + dy * c) * b.scale,
  };
}

/**
 * **C1 — the seven take a letter each, and one of them does not get one.**
 *
 * Spectrum order, one leaving every two and a half frames, which is the card's
 * own letter stagger: each colour arrives on the beat its letter does. Red goes
 * first and Violet goes last, and by the time Violet gets to the W, Ray is
 * sitting on it — so he slides on to the far end of the block, half off the
 * edge, and holds on there for the rest of the scene.
 *
 * Nothing looks at him, nothing points at him, and nobody says a word about it.
 * That is the gag, and it is also the rule the ep-2 volcano note left behind: a
 * background gag has to be **findable in a paused frame** and it has to be
 * **continuously visible for the whole shot**, or it reads as a bug.
 */
const SevenOnTheWord: React.FC<{
  riseAt: number;
  blocks: ReadonlyArray<{ cx: number; cy: number; scale: number; rot: number }>;
  /** Drip's live centre on the B — the thing Blue keeps hitting. */
  dripAt: { x: number; y: number };
}> = ({ riseAt, blocks, dripAt }) => {
  const frame = useCurrentFrame();
  // Violet finds the W taken eight frames after he lands on it, and is squeezed
  // off the end over the next sixteen.
  const squeeze = kidEase.easeInOutSine(
    (frame - (riseAt + 6 * RISE_STAGGER + FLIGHT + 8)) / 16,
  );
  // Blue aims at Drip's shoulder, because Drip is on the letter he wants.
  const hitAt = riseAt + 4 * RISE_STAGGER + FLIGHT;
  const contact = { x: dripAt.x - 42, y: dripAt.y - 8 };

  return (
    <>
      {SPECTRUM.map((c, i) => {
        const seat = LETTER_AT[i];
        const b = blocks[seat.block];
        const seatAt = onBlock(b, seat.dx, PERCH_DY);
        const clingAt = onBlock(b, VIOLET_CLING.dx, VIOLET_CLING.dy);
        const centre =
          i === 6
            ? {
                x: seatAt.x + (clingAt.x - seatAt.x) * squeeze,
                y: seatAt.y + (clingAt.y - seatAt.y) * squeeze,
              }
            : i === 4
              ? contact
              : seatAt;
        // `onBlock` gives the blob's **centre**; `RayShard`'s `y` is the top of
        // its box, which is what `shardPoint` is already in. Mixing the two is
        // the classic 64-pixel error (`hover` exists for exactly this).
        const target = { x: centre.x, y: hover("shard", centre.y, SHARD_PERCH) };
        const from = shardPoint(i);

        // --- take-off, in character ------------------------------------------
        // Red leaves early and travels at one speed on a dead-straight line;
        // Orange runs the same law one body-length behind him; the other five
        // get the card's stagger and a bowed, eased flight.
        const leaveAt =
          i === 0 ? riseAt - RED_EARLY : i === 1 ? riseAt - RED_EARLY + ORANGE_LAG : riseAt + i * RISE_STAGGER;
        const span = i <= 1 ? FLIGHT + RED_EARLY : FLIGHT;
        const u = Math.max(0, Math.min(1, (frame - leaveAt) / span));
        const p =
          i <= 1
            ? moveAlong(from, target, u, { arc: 0, ease: (v) => v })
            : moveAlong(from, target, kidEase.easeInOutSine(u), {
                arc: -0.3,
                ease: kidEase.easeInOutSine,
              });

        // --- what happens once they get there --------------------------------
        // Blue bounces off Drip twice (R8) and then leaves the word entirely;
        // Indigo does the identical bounce four frames later against his own
        // letter and stays on it. Both trails are sampled off the path itself,
        // so the corner in the blur is the corner they actually turned.
        const bluePath = (f: number): { x: number; y: number } => {
          const away = Math.max(0, Math.min(1, (f - BOUNCE_LEG * 4) / BLUE_DEPART));
          const off = bounceOff(f);
          const gone = onBlock(blocks[BLUE_SETTLE.block], BLUE_SETTLE.dx, BLUE_SETTLE.dy);
          const at = { x: target.x + off.x, y: target.y + off.y };
          return {
            x: at.x + (gone.x - at.x) * away,
            y: at.y + (hover("shard", gone.y, SHARD_PERCH) - at.y) * away,
          };
        };
        const indigoPath = (f: number): { x: number; y: number } => {
          const off = bounceOff(f - INDIGO_LAG);
          return { x: target.x + off.x, y: target.y + off.y };
        };

        const landed = frame >= leaveAt + span;
        const path = i === 4 ? bluePath : i === 5 ? indigoPath : null;
        const here = path && landed ? path(frame - hitAt) : { x: p.x, y: p.y };

        // Settles onto the letter, then sits still: a blob that keeps bobbing
        // on a Big Word card is competing with the letters for the eye. Green
        // does not settle, he sits — five frames, and he stays sat.
        const settle =
          u >= 1 && !path ? settleWave((frame - leaveAt - span) / 26, 1, 4.2) : 0;
        const sit = i === 3 ? greenSit(frame, leaveAt + span, true) : 0;
        // **Everything before take-off has to be the arc, exactly.** Scene 10
        // ends on the arc at 0.9 with its own tangent for a lean and its own
        // look, and Scene 11 opens on the same frame — so scale, lean and look
        // all start at those values and only then become the perch's. Getting
        // this wrong is a visible jump on the cut.
        const off = Math.min(1, Math.max(0, u * 2.5));
        return (
          <ArcShard
            key={c.name}
            i={i}
            x={here.x}
            y={here.y - settle * 9}
            scale={(0.9 + (SHARD_PERCH - 0.9) * u) * (1 + settle * 0.08)}
            sit={sit}
            // Yellow waves at the audience from the "i" the whole time he is on
            // it, which for him is not a reaction — it is the resting state.
            wave={YELLOW_REST}
            // Everything on this card is 40px tall and the letters are what the
            // shot is for, so the whole ensemble breathes at half strength once
            // it has landed. Relative, so Blue is still the twitchy one.
            calm={u >= 1 ? 0.45 : 1}
            heading={
              path && landed
                ? headingOf(path, frame - hitAt)
                : from.angle * (1 - off) + p.angle * off
            }
            // The blur is only there while there is a direction change in it.
            // A trail behind a body that has stopped collapses to a point and
            // draws as a bead.
            trail={
              path && landed && frame - hitAt < BOUNCE_LEG * 4 + BLUE_DEPART + 8
                ? sampleTrail((f) => path(f), frame - hitAt, BOUNCE_LEG * 2)
                : undefined
            }
            look={off > 0.5 ? "camera" : { x: 0.1, y: -0.15 }}
            // Violet holds on to the end of the block with both of them. Six
            // seated blobs with arms is six pairs of arms on a word card.
            arms={i === 6 ? squeeze > 0.2 : undefined}
            zIndex={53}
          />
        );
      })}
    </>
  );
};

/** The heading of a sampled path right now, in degrees. */
function headingOf(path: (f: number) => { x: number; y: number }, f: number): number {
  const a = path(f - 1.5);
  const b = path(f + 1.5);
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

/** Rain running down the front of the card. */
const RainStreaks: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - from;
  if (f < 0) return null;
  const t = f / fps;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", left: 0, top: 0, zIndex: 52, pointerEvents: "none" }}
    >
      {Array.from({ length: 14 }, (_, i) => {
        const x = 520 + i * 66 + ((i * 47) % 30);
        const speed = 60 + ((i * 31) % 50);
        const y0 = 160 + (((t * speed + i * 90) % 330));
        return (
          <g key={i} opacity={0.34}>
            <path
              d={`M ${x} ${y0} l ${2 + (i % 3)} 46`}
              stroke="#ffffff"
              strokeWidth={5}
              strokeLinecap="round"
            />
            <circle cx={x + 2 + (i % 3)} cy={y0 + 50} r={5} fill="#ffffff" />
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 12 — One you can try
// ---------------------------------------------------------------------------

/**
 * Bottom-left foreground, and **clear of the diagram's sun**.
 *
 * He was at (430, 760), which is on top of it — and a still of that is a plain
 * yellow disc with Ray's face sitting in the middle of it, i.e. Sunny. The one
 * scene in the episode where Ray talks to camera is not the scene to make him
 * look like the other character.
 */
const S12_RAY = { x: 360, y: 906, scale: 0.95 };

const S12_BUBBLES: Record<string, string> = {
  a1_53_ray: "In the rain, and out!",
};

/**
 * Scene 12 — the one claim in the episode a child can personally check, and the
 * held beat in the middle of it **is not a joke, it is homework**.
 *
 * The diagram assembles itself entirely inside those forty-five frames of
 * silence: the sun, then the rain, then the figure turning round, then the arc.
 * Nobody talks over any of it, because a child needs a second and a half to
 * picture themselves turning round and if the next line lands first they will
 * not do it at all.
 */
const HomeworkScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [beatFrom, beatTo] = heldBeat(scene, "a1_51_narrator");
  const span = Math.max(1, beatTo - beatFrom);
  const u = (frame - beatFrom) / span;

  const stage = useStage(scene);
  const emotion = useEmotion(scene, "ray", { a1_53_ray: "excited" }, "happy", NO_LEAD);

  return (
    <AbsoluteFill style={{ background: "#eef7ff" }}>
      {/* The garden empties to a diagram: the plate is still there, drained to
          a wash, so the shot reads as the same place drawn simply rather than
          as a cut to a whiteboard. */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.3, filter: "saturate(0.5)" }}>
        <PaintedSky bg="garden_day" phase={7.9} />
      </div>
      <AntisolarDiagram u={u} />
      <Ray
        x={S12_RAY.x}
        y={hover("ray", S12_RAY.y, S12_RAY.scale)}
        scale={S12_RAY.scale}
        brightness={RAY_LIGHT.actOne}
        spectrum={RAY_SPECTRUM.none}
        phase={PHASE.ray}
        emotion={emotion}
        speaking={stage.speaking("ray")}
        // The only time in the episode he addresses the audience directly.
        look="camera"
        eyeLife={0.5}
        streak={0.25}
        zIndex={30}
      />
      <Bubbles
        scene={scene}
        cast={
          {
            ray: {
              x: S12_RAY.x,
              y: hover("ray", S12_RAY.y, S12_RAY.scale),
              scale: S12_RAY.scale,
              who: "ray",
              side: "right",
              offset: 400,
            },
          } as Cast
        }
        text={S12_BUBBLES}
        // Up in the empty sky rather than above his crown: he is a foreground
        // element in the bottom corner now, and a bubble stacked on him would
        // sit across the middle of the diagram he is standing in front of.
        at={{ a1_53_ray: { x: 700, y: 250, tail: "left", tailAt: 430 } }}
      />
    </AbsoluteFill>
  );
};

/**
 * The rainbow-is-always-opposite-the-sun diagram, drawn in the show's crayon
 * style, assembling in four steps across the held beat.
 */
const AntisolarDiagram: React.FC<{ u: number }> = ({ u }) => {
  const step = (a: number, b: number): number => kidEase.easeInOutSine((u - a) / (b - a));
  const sun = step(-0.5, 0.12);
  const rain = step(0.1, 0.34);
  const turn = step(0.32, 0.58);
  const arc = step(0.56, 0.92);
  return (
    <WideLayer zIndex={12}>
      {/* The low sun, behind you. */}
      <g opacity={sun} transform="translate(300 700)">
        <circle r={92 * sun} fill={kidTheme.sun} stroke={kidTheme.sunDeep} strokeWidth={10} />
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={i}
            transform={`rotate(${i * 36})`}
            d={`M -14 -104 L 0 ${-150 * sun} L 14 -104 Z`}
            fill={kidTheme.sunDark}
          />
        ))}
      </g>

      {/* The wall of rain, in front of you. */}
      <g opacity={rain}>
        {Array.from({ length: 24 }, (_, i) => {
          const x = 1310 + (i % 6) * 84;
          const y = 300 + Math.floor(i / 6) * 170 + ((i * 37) % 60);
          return (
            <path
              key={i}
              d={`M ${x} ${y} l -14 ${58 * rain}`}
              stroke={kidTheme.water}
              strokeWidth={13}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}
      </g>

      {/* You, in the middle, turning round to put the sun at your back. */}
      <g transform={`translate(880 792)`}>
        <ellipse cx={0} cy={166} rx={104} ry={22} fill="rgba(26,50,36,0.2)" />
        <g transform={`scale(${1 - turn * 0.0} 1) rotate(${turn * 4})`}>
          <path d="M 0 40 L -30 168 M 0 40 L 30 168" stroke={kidTheme.ink} strokeWidth={30} strokeLinecap="round" />
          <path d="M -46 -66 Q 0 -92 46 -66 L 38 52 L -38 52 Z" fill={kidTheme.ink} />
          {/* The arm points where they are looking, and it swings across as
              they turn: away from the sun, towards the rain. */}
          <path
            d={`M ${-40 + turn * 80} -46 L ${-150 + turn * 300} ${-16 - turn * 20}`}
            stroke={kidTheme.ink}
            strokeWidth={26}
            strokeLinecap="round"
          />
          <circle cx={0} cy={-120} r={54} fill={kidTheme.ink} />
          <path d="M -50 -148 q 28 -34 62 -22 q 30 10 40 30" stroke={kidTheme.ink} strokeWidth={26} strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* The arc, appearing in the rain in front of them.
          **Concentric, from a shared centre.** The first pass drew seven arcs
          between the *same two endpoints* with falling radii, and an SVG arc
          whose radius is too small for its chord is silently scaled up to fit —
          so all seven landed on top of each other and the picture was a single
          violet band, violet being the one drawn last. Seven semicircles about
          one centre, red on the outside, is the shape the act just spent five
          scenes earning. */}
      <g opacity={Math.min(1, arc * 1.2)}>
        {SPECTRUM.map((c, i) => {
          const r = 330 - i * 26;
          return (
            <path
              key={c.name}
              d={`M ${1570 - r} 900 A ${r} ${r * 0.92} 0 0 1 ${1570 + r} 900`}
              stroke={c.fill}
              strokeWidth={22}
              fill="none"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - arc}
            />
          );
        })}
      </g>

      {/* And the rule the picture is making: sun behind, rainbow in front. */}
      <g opacity={Math.max(0, (arc - 0.4) / 0.6)}>
        <path
          d="M 430 660 Q 880 560 1400 700"
          stroke={kidTheme.ink}
          strokeWidth={9}
          strokeDasharray="26 20"
          fill="none"
          opacity={0.55}
        />
        <path d="M 1400 700 l -46 -24 l 6 44 Z" fill={kidTheme.ink} opacity={0.55} />
      </g>
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 13 — Not the plain one
// ---------------------------------------------------------------------------

const S13_RAY = { x: 830, y: 596, scale: 1.05 };
const S13_SUNNY: Mark = { x: 1470, y: hover("sunny", 214, 1.15), scale: 1.15, who: "sunny", side: "left" };

const S13_BUBBLES: Record<string, string> = {
  a1_55_ray: "Not the plain one!",
  a1_56_ray: "I am ALL of them!",
  a1_58_sunny: "I MAKE RAINBOWS!",
  a1_60_sunny: "WE ARE A TEAM!",
};

/**
 * Scene 13 — the act's turn, and the frame Ray wears for the rest of the
 * episode.
 *
 * The seven snap back together into one white Ray who is **noticeably brighter
 * than he was in Scene 7** — a warmer, fuller white with the seven colours
 * faintly visible in his outline from here to the end of the show. Nobody ever
 * says a word about it, which is exactly why both numbers ramp across the merge
 * rather than switching: a change nobody mentions has to be something the
 * audience *notices*, and a cut is not noticing, it is a continuity error.
 */
const NotPlainScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [, mergeEnd] = lineWindow(scene, "a1_55_ray");
  const [sunnyFrom] = lineWindow(scene, "a1_58_sunny");
  const [takeFrom, takeTo] = heldBeat(scene, "a1_59_narrator");
  const [teamFrom] = lineWindow(scene, "a1_60_sunny");

  // The merge: the seven accelerate inwards and are gone, and he is there.
  // `easeInQuad` rather than an ease-out — they are being pulled back together,
  // not arriving somewhere.
  const mergeAt = Math.max(18, Math.round(mergeEnd * 0.3));
  const merge = kidEase.easeInQuad((frame - 4) / mergeAt);
  const landed = frame - (4 + mergeAt);
  const pop = landed >= 0 ? settleWave(landed / (fps * 0.8), 1.3, 4) : 0;

  const brightness = RAY_LIGHT.actOne + (RAY_LIGHT.afterRainbow - RAY_LIGHT.actOne) * merge;
  const spectrum = RAY_SPECTRUM.afterRainbow * kidEase.easeOutQuad((frame - 4 - mergeAt * 0.6) / 22);

  // The camera drifts to Sunny for the last beat, so "Sunny, alone in frame,
  // taking that in" is literally true. Ray slides out low left with it.
  const toSunny = interpolate(frame, [takeFrom - 14, takeFrom + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam: Cam = {
    x: 1300,
    y: 380,
    zoom: 1 + toSunny * 0.22,
    dx: -toSunny * 190,
    dy: toSunny * 130,
  };

  const stage = useStage(scene);
  const rayEmotion = useEmotion(
    scene,
    "ray",
    { a1_55_ray: "proud", a1_56_ray: "excited" },
    "amazed",
    NO_LEAD,
  );
  // Sunny's face turns *inside* the held beat, which means it cannot come from
  // a line: `emotionAt` is the kit's answer to a change staged in the silence.
  const sunnyEmotion = emotionAt(
    frame,
    [
      { at: sunnyFrom, emotion: "excited" },
      { at: takeFrom + 7, emotion: "neutral" },
      { at: teamFrom, emotion: "excited" },
    ],
    "proud",
    7,
  );

  // **He leaves properly.** The script's last beat here is "Sunny, alone in
  // frame, taking that in", and a 260px slide under a 1.22× push left Ray cut
  // in half by the bottom-left corner for the whole of it — which reads as a
  // character stuck behind the frame edge, not as an exit. He goes further and
  // fades on his way out, so "alone in frame" is literally true.
  const rayOut = kidEase.easeInQuad((toSunny - 0.35) / 0.5);
  const rayMark: Mark = {
    x: S13_RAY.x - toSunny * 560,
    y: hover("ray", S13_RAY.y + toSunny * 190, S13_RAY.scale),
    scale: S13_RAY.scale,
    who: "ray",
    side: "right",
  };

  return (
    <AbsoluteFill>
      <PaintedSky bg="garden_day" phase={9} vignette={0.2} />
      <SoftShade x={S13_RAY.x} y={560} rx={560} ry={450} strength={0.24} color="26,54,86" />
      <Camera cam={cam}>
        {/* The seven, coming home. They travel *to* Ray's mark, so the merge is
            the split run backwards and the audience reads it as the same event
            in reverse rather than as a new one. */}
        <SevenArc
          u={1}
          from={EMERGE}
          scale={0.9 * (1 - merge * 0.45)}
          alpha={() => Math.max(0, 1 - merge * 1.35)}
          bob={() => 0}
          look={{ x: -0.2, y: 0.4 }}
        />
        <MergeTrails u={merge} to={{ x: S13_RAY.x, y: S13_RAY.y }} />
        <Ray
          x={rayMark.x}
          y={hover("ray", S13_RAY.y + toSunny * 190 + pop * 10, S13_RAY.scale)}
          scale={S13_RAY.scale * (1 + pop * 0.12)}
          brightness={brightness}
          spectrum={spectrum}
          phase={PHASE.ray}
          emotion={rayEmotion}
          speaking={stage.speaking("ray")}
          look={frame >= sunnyFrom ? { x: 0.8, y: -0.6 } : "camera"}
          opacity={
            Math.max(0, Math.min(1, (merge - 0.55) * 3.4)) *
            (1 - Math.max(0, Math.min(1, rayOut)))
          }
          streak={0.3}
          zIndex={22}
        />
        <Sunny
          x={S13_SUNNY.x}
          y={S13_SUNNY.y}
          scale={1.15}
          phase={PHASE.sunny}
          emotion={sunnyEmotion}
          speaking={stage.speaking("sunny")}
          look={{ x: -0.5, y: 0.45 }}
          zIndex={12}
        />
      </Camera>
      <CutFlash at={4 + mergeAt} strength={0.42} />
      <Bubbles
        scene={scene}
        cast={
          {
            ray: projectMark(cam, rayMark),
            sunny: projectMark(cam, S13_SUNNY),
          } as Cast
        }
        text={S13_BUBBLES}
      />
    </AbsoluteFill>
  );
};

/** Seven streaks of colour converging on one point. */
const MergeTrails: React.FC<{ u: number; to: { x: number; y: number } }> = ({ u, to }) => {
  if (u <= 0.02 || u >= 1) return null;
  return (
    <WideLayer zIndex={20}>
      {SPECTRUM.map((c, i) => {
        const from = shardPoint(i);
        const p = moveAlong(from, to, kidEase.easeInQuad(u), { arc: 0.14 });
        return (
          <path
            key={c.name}
            d={`M ${from.x} ${from.y} Q ${(from.x + p.x) / 2} ${(from.y + p.y) / 2 - 60} ${p.x} ${p.y}`}
            stroke={c.fill}
            strokeWidth={16}
            strokeLinecap="round"
            fill="none"
            opacity={0.5 * (1 - u)}
          />
        );
      })}
    </WideLayer>
  );
};

export const ACT1_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s03_sun: SunScene,
  s04_flick: FlickScene,
  s05_journey: JourneyScene,
  s06_arrival: ArrivalScene,
  s07_plain: PlainOneScene,
  s08_rain: RainScene,
  s09_split: SplitScene,
  s10_rollcall: RollCallScene,
  s11_bigword_rainbow: BigWordRainbowScene,
  s12_homework: HomeworkScene,
  s13_not_plain: NotPlainScene,
};
