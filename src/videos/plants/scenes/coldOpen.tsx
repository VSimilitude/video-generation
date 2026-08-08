import React from "react";
import {
  AbsoluteFill,
  Bubbles,
  CHAR_BOX,
  Cast,
  KidSilhouette,
  MEADOW,
  MeadowWorld,
  NO_LEAD,
  PHASE,
  Pip,
  SpeechBubble,
  WideLayer,
  bubbleOver,
  emotionAt,
  heldBeat,
  interpolate,
  kidEase,
  kidInkOutline,
  kidTheme,
  kidType,
  kidHands,
  lineWindow,
  pipLean,
  spring,
  stand,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cam,
  type KidPlacement,
  type Mark,
  type TimedScene,
} from "./common";

// COLD OPEN — Scenes 1–4 of script.md. A breath, a flight, a landing, and a
// thesis. Roughly ninety seconds, and it has three jobs:
//
//   1. establish the world, INCLUDING the volcano on the horizon of the very
//      first wide (the volcano rule) and the old tree at the field's edge,
//      which Scene 20 is about and which only pays if the audience has been
//      looking at it for thirteen minutes;
//   2. introduce Pip as a seed, in the air, running the roll call — the
//      series-signature gag built out of a picture the scene already has;
//   3. plant her, permanently, and let her say the two lines the whole episode
//      hangs off: "Moving is for things that are too small to stay." and the
//      stamp.
//
// ---------------------------------------------------------------------------
// THE BOUNDARY CHECKLIST (STYLE, "A cut inside a continuous space")
//
// Three cuts, all inside one continuous fifteen seconds of a seed falling out
// of a dandelion clock, so all four checks apply to each:
//
//   1→2  position/heading — the detonation throws seeds up and to the RIGHT at
//        `DRIFT`, and Scene 2 opens with the same cloud travelling the same way
//        at the same rate. Scene 2 is the same shot from further up: `lift`
//        puts the meadow at the bottom of the frame instead of under our feet,
//        and the volcano is on the same horizon in both.
//   2→3  Pip is mid-air and descending at the end of Scene 2 (`S2_FALL`), and
//        Scene 3 opens with her still mid-air, at the same x, still descending,
//        and lands her during `co_10`. Nobody is teleported.
//        Emotion: she carries `skeptical` across both cuts and does not reset.
//   3→4  camera — Scene 3 ends pushed in at `S3_CLOSE_ZOOM` and Scene 4 opens
//        at exactly that number and pulls back from it. The title arrives on a
//        shot that was already moving.
//
// Paired stills for all three cuts are in `scratchpad/ep4b1/`.
// ---------------------------------------------------------------------------

/**
 * Where the wind is taking everybody, in px per second at scale 1.
 *
 * One constant, because it is the only thing joining four shots: the seeds
 * leave the kid's hands on it in Scene 1, they are still on it in Scene 2, Pip
 * arrives on it in Scene 3, and it is the reason her spot is *hers* rather
 * than chosen. It is also, quietly, the pedagogy — seed dispersal by wind is
 * the whole of her one ride.
 */
const DRIFT = { x: 96, y: -26 };

/** Pip's face for the whole cold open: unimpressed, and never grumpy. */
const PIP_RESTING = "skeptical";

// ---------------------------------------------------------------------------
// The dandelion clock, and the seeds that come off it
// ---------------------------------------------------------------------------

/**
 * How many seeds are on the clock.
 *
 * Ninety-two, which is a lot of SVG for one prop and is the point: the script's
 * word is "galaxy", and forty-four 70px parachutes spread over a 1920 frame is
 * a scatter of confetti. Density is the whole effect.
 */
const SEEDS = 92;

/**
 * The clock's own geometry, in its local units — a **prop, not botany**.
 *
 * The script asks for a dandelion clock "huge and white and ready", and the
 * first build drew a life-size one: a 160px head on a 300px child, which at
 * this camera is a smudge, and which detonated into a puff of dust near the
 * horizon instead of "a slow drifting galaxy across the whole frame". Both
 * numbers here are sized off the *frame* rather than off the kid — the head is
 * a quarter of the frame's width, and `speed` throws seeds far enough that at
 * `S1_CLOCK_SCALE` the cloud is wider than 1920.
 */
const CLOCK = {
  /** Radius of the sphere the seeds are parked on. */
  r: 70,
  /** How much that sphere is flattened by perspective. Near 1 = a ball. */
  squash: 0.88,
  /** Base scale a `FlyingSeed` is drawn at. Each seed varies about it. */
  seed: 0.46,
  /** Stem length below the head, which is what the kid's fist closes on. */
  stem: 182,
} as const;

/**
 * Where seed `i` sits on the head, before the blow.
 *
 * Parked at ONE radius (which is what the first build did) fifty-six seeds draw
 * a ring with a hole in the middle — a life belt, not a dandelion. Spread over
 * the inner two thirds as well and the head fills in, and the seeds nearest the
 * middle are the ones pointing at camera, which is exactly what a real clock
 * looks like from here.
 */
function seedOnHead(i: number): { x: number; y: number } {
  const { angle } = seedLaunch(i);
  // A DIFFERENT hash from `seedSize`, on purpose. Sharing one makes radius and
  // size the same number, so every big seed is on the rim and every small one
  // is in the middle — which draws a wreath with a pale hole in it rather than
  // a ball. `sqrt` spreads them evenly over the disc instead of bunching them
  // at the centre.
  const rad = Math.sqrt(((i * 3121) % 100) / 100);
  const r = CLOCK.r * (0.16 + 0.84 * rad);
  return { x: Math.cos(angle) * r, y: -Math.sin(angle) * r * CLOCK.squash };
}

/**
 * How big seed `i` is drawn — the SAME number on the head and in the air, so a
 * seed does not change size the moment it leaves. It is depth: the near ones
 * are big, the far ones are specks, and that is what turns a flat scatter into
 * a cloud with a front and a back.
 */
function seedSize(i: number): number {
  return CLOCK.seed * (0.5 + 0.9 * (((i * 5081) % 100) / 100));
}

/**
 * One seed's launch direction and speed, as a pure function of its index.
 *
 * Deterministic rather than random for the usual reason (Remotion renders
 * frames in a pool of tabs), and *spread* rather than uniform so the burst has
 * a shape: the fastest seeds are the ones nearest the top of the head, because
 * that is where the breath hits.
 */
function seedLaunch(i: number): { angle: number; speed: number; spin: number } {
  const u = (i * 2.399963) % (Math.PI * 2); // golden angle — an even sphere
  const tier = ((i * 7919) % 100) / 100;
  return {
    angle: u,
    speed: 210 + tier * 430,
    spin: ((i % 5) - 2) * 0.5,
  };
}

/**
 * A single flying seed — pod, stalk and an open parachute — drawn cheap.
 *
 * **No rig, no face.** Forty-four `useRig` calls to make forty-four 20px
 * parachutes blink is forty-four hooks spent on something nobody can see; the
 * one seed that gets the hero component is Pip, which is the whole point of
 * the shot. The five siblings in Scene 2 that DO get a face get two dots and
 * an arc, for the same reason.
 */
const FlyingSeed: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rot?: number;
  opacity?: number;
  /** Two dots and a smile — the roll call's near-identical strangers. */
  face?: boolean;
}> = ({ x, y, scale = 1, rot = 0, opacity = 1, face = false }) => (
  <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${scale})`} opacity={opacity}>
    {/* The crown, as six strokes and a soft head: at this size the filaments
        are the silhouette and the fluff is the value. */}
    <circle cx={0} cy={-34} r={26} fill={kidTheme.paper} opacity={0.4} />
    {[-64, -38, -13, 13, 38, 64].map((a) => (
      <path
        key={a}
        d={`M 0 -6 L ${Math.sin((a * Math.PI) / 180) * 34} ${-6 - Math.cos((a * Math.PI) / 180) * 34}`}
        stroke="#e2d7bf"
        strokeWidth={3.4}
        strokeLinecap="round"
      />
    ))}
    {[-64, -38, -13, 13, 38, 64].map((a) => (
      <circle
        key={`t${a}`}
        cx={Math.sin((a * Math.PI) / 180) * 34}
        cy={-6 - Math.cos((a * Math.PI) / 180) * 34}
        r={7}
        fill={kidTheme.paper}
        opacity={0.95}
      />
    ))}
    <ellipse cx={0} cy={4} rx={11} ry={9} fill="#f3ddb0" stroke={kidTheme.ink} strokeWidth={3.2} />
    {face ? (
      <>
        <circle cx={-4} cy={2} r={2.1} fill={kidTheme.ink} />
        <circle cx={4} cy={2} r={2.1} fill={kidTheme.ink} />
        <path d="M -3.4 7 q 3.4 3 6.8 0" stroke={kidTheme.ink} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      </>
    ) : null}
  </g>
);

/**
 * The clock in the kid's hands: a stem and a sphere of seeds, which comes
 * apart.
 *
 * `released` is 0 (whole and ready) to 1 (every seed gone), and it is not a
 * fade — each seed is the SAME object before and after, standing on the head
 * and then flying off it, because a head that dissolves while a separate cloud
 * appears is two pictures of one event.
 */
const DandelionClock: React.FC<{
  /** Where the kid's fist is. The stem's BOTTOM lands here. */
  x: number;
  y: number;
  scale?: number;
  /** Frames since the blow; negative before it. */
  since: number;
  t: number;
}> = ({ x, y, scale = 1, since, t }) => {
  // The stem springs back once it is not carrying a head any more, and keeps a
  // slow nod afterwards. It is two frames of secondary action and it is the
  // difference between "the seeds left" and "something happened here".
  const whip = kidEase.easeOutCubic((since - 4) / 14) * (1 - kidEase.easeInOutSine((since - 22) / 40) * 0.55);
  return (
  // Translated so the head sits a whole stem ABOVE the hands. Drawn at the
  // hands (which is what the first build did) the clock is a ball resting in a
  // kneeling child's lap, and the picture the script asks for — a kid holding a
  // seed head up in front of their face — never appears.
  <g transform={`translate(${x} ${(y - CLOCK.stem * scale).toFixed(1)}) scale(${scale})`}>
    {/* The stem, held. It springs back a little once the head is gone. */}
    <path
      d={
        `M 0 ${CLOCK.stem}` +
        ` Q ${(-6 + Math.sin(t * 0.9) * 3 - whip * 22).toFixed(1)} ${CLOCK.stem * 0.54}` +
        ` ${(-3 - whip * 34).toFixed(1)} ${(12 + whip * 16).toFixed(1)}`
      }
      stroke={kidTheme.grassDark}
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
    {/* The soft mass under the seeds. At any size this is what says "white",
        and it is what keeps the head from being a wire frame. It goes with the
        seeds, so it is gone by the time the cloud has left. */}
    {since < 40 ? (
      <ellipse
        cx={0}
        cy={0}
        rx={CLOCK.r * 1.06}
        ry={CLOCK.r * CLOCK.squash * 1.06}
        fill={kidTheme.paper}
        opacity={0.94 * Math.max(0, 1 - Math.max(0, since) / 16)}
      />
    ) : null}
    {Array.from({ length: SEEDS }, (_, i) => {
      const { angle, speed, spin } = seedLaunch(i);
      // Each seed leaves on its own frame across ~10 frames, so the head comes
      // apart in a wave from the top rather than exploding as one object.
      const age = (since - (i % 11)) / 30;
      if (age <= 0) {
        // On the head: parked through a near-sphere, standing up off the centre.
        const seat = seedOnHead(i);
        return (
          <FlyingSeed
            key={i}
            x={seat.x}
            y={seat.y}
            scale={seedSize(i)}
            rot={Math.cos(angle) * 26}
            opacity={0.95}
          />
        );
      }
      // Off it: an arc, out along its launch heading and then bending onto the
      // wind, which is what a real one does and what makes fifty-six of them
      // read as a drift rather than as a firework.
      //
      // `age * 0.55` rather than `age * 1.6`: the script's word is **slow**, so
      // the cloud takes ~1.8s to reach its full spread and is still opening
      // when the Narrator comes back in over it.
      const out = kidEase.easeOutCubic(Math.min(1, age * 0.55));
      const px = Math.cos(angle) * speed * out + DRIFT.x * age + Math.sin(t * 0.6 + i) * 13;
      const py =
        -Math.sin(angle) * speed * 0.74 * out +
        DRIFT.y * age * 1.6 +
        Math.cos(t * 0.5 + i * 1.3) * 11;
      return (
        <FlyingSeed
          key={i}
          x={px}
          y={py}
          scale={seedSize(i)}
          rot={spin * age * 40 + Math.sin(t * 1.4 + i) * 6}
          // Barely fades inside this scene: the same cloud has to still be in
          // the air at the cut, because Scene 2 is the same cloud from higher up.
          opacity={Math.max(0, 1 - Math.max(0, age - 3.2) * 0.3)}
        />
      );
    })}
  </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 1 — One breath
// ---------------------------------------------------------------------------

/**
 * The kid, kneeling in the near field.
 *
 * `1.46` rather than `1.02`, and that is the fix rather than a taste call: at
 * 1.02 the silhouette is 300px in a 1080 frame and shares it with a tree twice
 * its height, so the shot reads as an empty meadow with a smudge in it. At 1.46
 * they are 450px of flat ink low in frame — a shape a six-year-old recognises
 * as themselves — with the whole upper half still open sky and the volcano and
 * the tree untouched on the horizon either side of them.
 */
const S1_KID: KidPlacement = {
  x: 648,
  y: stand("kid", MEADOW.ground + 18),
  scale: 1.46,
  kneel: 1,
  hold: 1,
};

/** See `CLOCK`. Sized so the head is about a quarter of the frame across. */
const S1_CLOCK_SCALE = 1.5;

const BreathScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [holdFrom, holdTo] = heldBeat(scene, "co_03_narrator");

  // THE BEAT, scripted at 45f: "The kid inhales — the silhouette's chest
  // visibly rises — and BLOWS. The seed head detonates into a slow drifting
  // galaxy across the whole frame, in silence."
  //
  // Its three phases are fractions of the beat rather than frame numbers, so
  // raising the gap in Video.tsx stretches the breath instead of leaving a
  // blown clock sitting in silence: inhale for the first 40%, blow on the next
  // 8%, and spend the rest watching. `heldBeat` is what makes that possible —
  // the length of the silence is the script's number, read out of the timeline.
  const beat = Math.max(1, holdTo - holdFrom);
  const u = (frame - holdFrom) / beat;
  const inhale = kidEase.easeInOutSine(u / 0.4);
  const blow = kidEase.easeInQuad((u - 0.4) / 0.08);
  const breath = inhale - blow * 1.9;
  const blowAt = holdFrom + beat * 0.44;

  const kid: KidPlacement = { ...S1_KID, breath: frame < holdFrom ? 0 : breath };
  const hands = kidHands(kid);

  // A very slow push in across the whole scene — half a percent a second. It is
  // under the threshold of noticing, which is the point: the frame is closing
  // on the thing that is about to happen without announcing that anything is.
  //
  // The focus point is a CONSTANT, not `hands`. `hands` rides the breath, and a
  // camera whose transform-origin moves while it is zoomed slides the entire
  // world sideways on the inhale — the one frame of the scene that has to be
  // still.
  const cam: Cam = {
    x: S1_KID.x,
    y: MEADOW.ground - 180,
    zoom: interpolate(frame, [0, scene.durationInFrames], [1, 1.075], {
      extrapolateRight: "clamp",
    }),
  };

  return (
    <MeadowWorld phase={0.2} cam={cam}>
      <KidSilhouette {...kid} />
      {/* A `WideLayer` rather than a frame-sized `<svg>`: the detonation throws
          seeds a thousand pixels past the frame edge and an svg viewport clips
          them, which is most of why the first build's "galaxy" was a handful of
          specks in the middle of the picture. */}
      <WideLayer>
        <DandelionClock
          x={hands.x}
          y={hands.y}
          scale={S1_CLOCK_SCALE}
          since={frame - blowAt}
          t={frame / fps}
        />
      </WideLayer>
    </MeadowWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — The ride, and the roll call
// ---------------------------------------------------------------------------

/** How far the meadow drops for an aerial shot. See `MeadowWorld`'s `lift`. */
const S2_LIFT = 286;

/**
 * Pip, in the air. She is bigger than the crowd because she is nearer the
 * camera, not because she is a bigger seed — the joke of the roll call is that
 * she is indistinguishable from the five she is naming.
 */
const S2_PIP = { x: 690, y: 498, scale: 0.62 };

/**
 * The five siblings, by name, in the order the script fixes — **and it is the
 * same order at the goodbye in Scene 29**, which is most of what makes the
 * second firing land. They are spread across the frame at four depths so the
 * eye can count them.
 */
const SIBLINGS = [
  { name: "Pipsqueak", x: 1214, y: 298, scale: 1.35 },
  { name: "Pipley", x: 1498, y: 574, scale: 1.6 },
  { name: "other Pip", x: 1046, y: 742, scale: 1.15 },
  { name: "Pippa", x: 1690, y: 258, scale: 0.95 },
  { name: "Pip the third", x: 1300, y: 880, scale: 1.85 },
] as const;

/**
 * Thirty-four more, faceless, for depth. Deterministic, never random.
 *
 * The scale range is the fix here as much as the count: at 0.16–0.36 a
 * `FlyingSeed` is a ten-pixel speck, and Pip — 285px of hero — was not "one of
 * dozens of identical drifting seeds", she was a face alone in an empty sky
 * with dust around it. The crowd now runs from a third of her to two thirds.
 */
const CROWD = Array.from({ length: 34 }, (_, i) => ({
  // Two coprime strides plus a quadratic jitter. One stride alone lays the
  // cloud out on a lattice and the eye reads the diagonal rows immediately.
  x: 40 + ((i * 613) % 1860) + (((i * i * 37) % 209) - 104),
  y: 90 + ((i * 947) % 920) + (((i * i * 53) % 157) - 78),
  scale: 0.34 + ((i * 37) % 26) / 20,
  phase: (i * 1.7) % 6.28,
}));

/**
 * **THE ROLL CALL: one clip, five bubbles, and the NAMES are the joke.**
 *
 * The first build summarised `co_07_pip` as "Hi! Hi! Hi! Hi! Hi!" on the
 * six-word rule. That rule is about *length*, and applying it here threw the
 * gag away: the series signature is a hero cheerfully naming five
 * near-identical strangers, and "Hi!" five times is a hero waving. The names
 * are the content and they are the most-quoted thing in episode one
 * (showrunner ruling). Every bubble below is four words or fewer, so the
 * six-word law is kept as well as the joke.
 *
 * Five real `SpeechBubble`s that replace one another, not one bubble whose
 * text is swapped: a text swap inside a mounted bubble is a hard cut with a
 * width jump and no pop, and the pop is what makes a name land. Precedent is
 * ep-3's `a2_32b_blue` — one clip, four bubbles.
 *
 * **The swaps are measured, not split evenly.** `npx remotion ffmpeg -af
 * silencedetect=noise=-32dB:d=0.10` on `co_07_pip.mp3` (7.416s) — and note
 * for the next builder, because ep-3's kit says the opposite: **this box does
 * have ffmpeg**, the one Remotion ships, with `silencedetect` compiled in.
 *
 * The clip has eight silences. Four are phrase boundaries (0.39–0.41s) and
 * three are inside phrases (0.10–0.13s, the beat between "other" and "Pip");
 * taking all seven would have swapped the bubble mid-name. Phrase onsets are
 * 0.140 / 1.648 / 3.011 / 4.579 / 5.830s; the numbers below are the **middles
 * of the four boundary gaps** rather than the onsets, so every swap happens
 * while nobody is talking. Fractions rather than frames, so a re-roll of the
 * clip re-times all five for free.
 */
const ROLLCALL_STARTS = [0, 0.196, 0.379, 0.59, 0.759] as const;

/**
 * How far the outgoing bubble leaves ahead of the incoming one, in frames.
 *
 * `SpeechBubble` shrinks out over seven frames, so without a head start the two
 * bubbles share the same square of sky for a quarter of a second and the swap
 * reads as a stutter rather than as the next name.
 */
const ROLLCALL_HANDOVER = 5;

const S2_BUBBLES: Record<string, string> = {
  co_05_pip: "Left. Left. I said left.",
  co_09_pip: "Good crew.",
};

const RideScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [nameFrom, nameTo] = lineWindow(scene, "co_07_pip");

  // Everyone drifts on the wind, together — the shot is a *tracking* shot, so
  // the crowd's motion is the small differences rather than the drift itself.
  const drift = (i: number): { dx: number; dy: number } => ({
    dx: Math.sin(t * 0.5 + i * 0.9) * 16,
    dy: Math.cos(t * 0.42 + i * 1.3) * 12 - t * 3,
  });

  // THE ROLL CALL: her eyes go down the queue, one sibling per fifth of the
  // line. Nothing else in the frame reacts — nobody replies inside the naming
  // and the button lands on a picture in which nothing has changed.
  const naming = frame >= nameFrom && frame < nameTo;
  // The five swap frames, once, off the measured fractions. Her eyes and all
  // five bubbles read THIS array, so the bubble saying a name and the eyes
  // finding that seed are the same instant by construction — an even fifth
  // drifts most of a second off the delivered take by the fourth name, which
  // is a hero looking at the wrong sibling while she says its name.
  const nameLen = Math.max(1, nameTo - nameFrom);
  const sayAt = ROLLCALL_STARTS.map((f) => nameFrom + Math.round(f * nameLen));
  let which = 0;
  for (let i = 0; i < sayAt.length; i += 1) if (frame >= sayAt[i]) which = i;
  const target = SIBLINGS[which];
  const look = naming
    ? {
        x: Math.max(-1, Math.min(1, (target.x - S2_PIP.x) / 520)),
        y: Math.max(-1, Math.min(1, (target.y - S2_PIP.y) / 380)),
      }
    : ("camera" as const);

  const emotion = useEmotion(
    scene,
    "pip",
    { co_07_pip: "happy", co_09_pip: PIP_RESTING },
    PIP_RESTING,
    NO_LEAD,
  );

  // Her bubbles sit to her LEFT, into the empty half of the frame. The five
  // siblings are all to her right and the roll call only works if you can see
  // them being named — a bubble parked on the default side covers two of them.
  const pipMark: Mark = {
    x: S2_PIP.x,
    y: S2_PIP.y,
    scale: S2_PIP.scale,
    who: "pip",
    state: "seed",
    side: "left",
    offset: 290,
  };

  return (
    <MeadowWorld
      phase={1.4}
      lift={S2_LIFT}
      overlay={
        <>
          <Bubbles scene={scene} cast={{ pip: pipMark } as Cast} text={S2_BUBBLES} />
          {/* The roll call is the one bubble `Bubbles` cannot draw: five of
              them on one turn. It sits on the same mark, so the stack is
              exactly where her other two bubbles are. */}
          <RollCall
            at={sayAt}
            until={nameTo}
            x={Math.max(400, S2_PIP.x - (pipMark.offset ?? 330))}
            y={bubbleOver(pipMark)}
            tailAt={S2_PIP.x}
          />
        </>
      }
    >
      <WideLayer>
        {CROWD.map((c, i) => {
          const d = drift(i);
          return (
            <FlyingSeed
              key={`c${i}`}
              x={c.x + d.dx}
              y={c.y + d.dy}
              scale={c.scale}
              rot={Math.sin(t * 0.8 + c.phase) * 10}
              opacity={0.55 + c.scale}
            />
          );
        })}
        {SIBLINGS.map((s, i) => {
          const d = drift(i + 40);
          return (
            <FlyingSeed
              key={s.name}
              x={s.x + d.dx}
              y={s.y + d.dy}
              scale={s.scale}
              rot={Math.sin(t * 0.7 + i) * 8}
              face
            />
          );
        })}
      </WideLayer>
      <Pip
        x={S2_PIP.x}
        y={S2_PIP.y}
        scale={S2_PIP.scale}
        state="seed"
        shadow={false}
        phase={PHASE.pip}
        emotion={emotion}
        speaking={stage.speaking("pip")}
        look={look}
      />
    </MeadowWorld>
  );
};

/**
 * **The roll call**: one clip, five greetings, one square of sky.
 *
 * The names come out of `SIBLINGS`, so the naming order, the eyeline and the
 * bubbles are one table and cannot drift — and the goodbye in Scene 29, which
 * has to greet the same five in the same order, reads the same table and gets
 * it for free.
 *
 * All five are mounted for the whole scene and windowed by `from`/`until`, the
 * same shape `Bubbles` uses. That is deliberate: a `.filter()` on the current
 * frame would change how many `SpeechBubble`s exist between one frame and the
 * next, and `SpeechBubble` calls hooks.
 *
 * The tail is aimed at Pip on every one of them. She is the only body on
 * screen with a mouth, and a bubble whose tail points at nobody reads as
 * narration — which, in a scene whose joke is that nobody answers, would hand
 * the naming to the Narrator.
 */
const RollCall: React.FC<{
  /** The five measured swap frames, scene-local. */
  at: number[];
  /** Frame the last bubble goes out on — the end of the clip. */
  until: number;
  x: number;
  y: number;
  tailAt: number;
}> = ({ at, until, x, y, tailAt }) => (
  <>
    {SIBLINGS.map((sibling, i) => (
      <SpeechBubble
        key={sibling.name}
        x={x}
        y={y}
        text={`Hi ${sibling.name}!`}
        tail="right"
        tailAt={tailAt}
        from={at[i]}
        until={i + 1 < at.length ? at[i + 1] - ROLLCALL_HANDOVER : until}
        zIndex={44}
      />
    ))}
  </>
);

// ---------------------------------------------------------------------------
// Scene 3 — Planted
// ---------------------------------------------------------------------------

/** Her mark. She is on it for the rest of the episode and the rest of her life. */
const S3_PIP = { x: MEADOW.pip.x, scale: 0.72 };
const S3_PIP_Y = stand("pip", MEADOW.ground);

/**
 * Where she comes in from — the same drift she has been on for two scenes, and
 * **on screen at the cut**. Starting her above the frame line (the first build
 * used `y: -120`) means the first thing Scene 3 shows is an empty meadow, which
 * breaks the one continuity rule this cut has: she was mid-air and descending
 * at the end of Scene 2 and she is still mid-air and descending here.
 */
// Scene 2 leaves her at (690, 498) with the horizon at 890 — 392px of air under
// her. Scene 3's horizon is back at 604, so 236 is the same seed a little
// LOWER in the same sky, which is the only reading of the cut that is not a
// teleport upwards.
const S3_FROM = { x: 686, y: 236 };

/** Scene 3 ends here, and Scene 4 opens on exactly this number. */
export const S3_CLOSE_ZOOM = 1.95;

/**
 * How close the camera gets for the strain.
 *
 * "The whole seed tips one degree" is a joke about how small the move is, and a
 * joke you cannot see is not one: at the wide the tip is a single pixel of a
 * 121px character. The push happens **during `co_11_pip`** and is parked before
 * the held beat opens — a camera still moving inside a held beat is exactly the
 * leak the script's rule forbids.
 */
const S3_STRAIN_ZOOM = 1.62;

const S3_BUBBLES: Record<string, string> = {
  co_11_pip: "Right. One step, please.",
  co_12_pip: "Any step.",
  co_14_pip: "Moving is for the small.",
  co_16_pip: "The biggest thing. Right here.",
  co_17_pip: "It will do.",
};

const PlantedScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  // --- the landing --------------------------------------------------------
  // She arrives during the Narrator's line and is down by 84% of it: "The wind
  // put her down in the grass, on a small brown spot of dirt." The word "down"
  // is the middle of the line and she is still in the air for it.
  const [landFrom, landTo] = lineWindow(scene, "co_10_narrator");
  const landAt = landFrom + (landTo - landFrom) * 0.84;
  const fall = kidEase.easeInOutSine((frame - landFrom) / Math.max(1, landAt - landFrom));
  // A spiral rather than a drop: two thirds of a turn on the way down, which is
  // what a pappus does and is the only travel this character will ever get.
  const spiral = (1 - fall) * 2.1;
  const px = S3_FROM.x + (S3_PIP.x - S3_FROM.x) * fall + Math.sin(spiral * Math.PI * 2) * 74 * (1 - fall);
  const py = S3_FROM.y + (S3_PIP_Y - S3_FROM.y) * fall;
  // The fluff folds as she settles — the seed state morphing into the planted
  // one, over the second after she touches down. This is the first capability
  // change in the episode and it is a LOSS: she has landed, so the parachute
  // is over.
  const settled = kidEase.easeInOutSine((frame - landAt) / 34);

  // --- the strain ---------------------------------------------------------
  // "Nothing whatsoever happens. Pip strains — the whole seed tips one degree,
  // and settles back. That is the entire locomotion budget of the rest of her
  // life." One degree, and the script means one degree.
  const [strainFrom, strainTo] = heldBeat(scene, "co_11_pip");
  const [giveUpFrom] = heldBeat(scene, "co_12_pip");
  const strainBeat = Math.max(1, strainTo - strainFrom);
  const lean = pipLean(frame, [
    { at: strainFrom + 6, to: 3.4, snapAt: strainFrom + Math.round(strainBeat * 0.62), drift: 20 },
  ]);
  const tremble = interpolate(
    frame,
    [strainFrom + 4, strainFrom + 10, strainFrom + Math.round(strainBeat * 0.6), strainFrom + Math.round(strainBeat * 0.66)],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- the face -----------------------------------------------------------
  // Placed in the SILENCE rather than on the lines, which is what `emotionAt`
  // is for: she gives up inside the second held beat ("She stops trying,
  // visibly files the result, and is already over it"), and the give-up is a
  // beat of `sad` that lasts under a second before she is over it. These cues
  // are absolute frames, so the held-beat NO_LEAD rule is satisfied by
  // placement itself — there is no lead parameter here; `emotionAt`'s fourth
  // argument is the morph DURATION, left at the kit default.
  const emotion = emotionAt(
    frame,
    [
      { at: strainFrom + 8, emotion: "grumpy" },
      { at: giveUpFrom + 10, emotion: "sad", frames: 10 },
      { at: giveUpFrom + 30, emotion: PIP_RESTING },
    ],
    PIP_RESTING,
  );

  // --- the camera ---------------------------------------------------------
  // Four moves, and every one of them finishes before the held beat it leads
  // into: in on her own line for the strain, out on "Pip was the size of a
  // crumb. The field was the size of the world." — the one line in the scene
  // whose content is scale, and the volcano's wide — and hard back in over
  // "Right here.", so her flat little face is the biggest thing on screen when
  // she grades the dirt and NOTHING moves inside the stamp's 45 frames.
  const [strainLineFrom, strainLineTo] = lineWindow(scene, "co_11_pip");
  const [wideFrom] = lineWindow(scene, "co_15_narrator");
  const [inFrom, planTo] = lineWindow(scene, "co_16_pip");
  const zoom = interpolate(
    frame,
    [0, strainLineFrom, strainLineTo, wideFrom, wideFrom + 44, inFrom, inFrom + 60],
    [1.0, 1.0, S3_STRAIN_ZOOM, S3_STRAIN_ZOOM, 0.8, 0.8, S3_CLOSE_ZOOM],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );
  const cam: Cam = { x: S3_PIP.x, y: MEADOW.ground - 90, zoom };

  // The survey: "one slow pan of the eyes, left to right". The script buys no
  // held beat for it, so it runs across the tail of her own line and the eight
  // frames after it, and it is finished before the verdict starts — a pan
  // squeezed into the default gap alone is nine frames, which is a flick.
  const [stampFrom] = lineWindow(scene, "co_17_pip");
  const surveyFrom = planTo - 36;
  const pan = interpolate(frame, [surveyFrom, stampFrom - 3], [-1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const surveying = frame >= surveyFrom && frame < stampFrom;

  const mark: Mark = {
    x: S3_PIP.x,
    y: S3_PIP_Y,
    scale: S3_PIP.scale,
    who: "pip",
    state: frame < landAt ? "seed" : "planted",
    morph: frame < landAt ? 1 : settled,
  };

  return (
    <MeadowWorld
      phase={2.6}
      cam={cam}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ pip: projectPip(cam, mark) } as Cast}
          text={S3_BUBBLES}
        />
      }
    >
      <DirtPatch x={S3_PIP.x} y={MEADOW.ground} />
      <Pip
        x={frame < landAt ? px : S3_PIP.x}
        y={frame < landAt ? py : S3_PIP_Y}
        scale={S3_PIP.scale}
        state={frame < landAt ? "seed" : "planted"}
        morph={frame < landAt ? 1 : settled}
        lean={lean}
        tremble={tremble}
        shadow={frame >= landAt}
        phase={PHASE.pip}
        emotion={emotion}
        speaking={stage.speaking("pip")}
        look={surveying ? { x: pan, y: 0.55 } : "camera"}
        eyeLife={surveying ? 0 : 1}
      />
    </MeadowWorld>
  );
};

/**
 * Her square inch: a small brown spot of dirt in open grass.
 *
 * It is drawn rather than painted and it always will be — she stands on it,
 * grows out of it, and Scene 16 makes a joke about it ("It's where I keep my
 * feet"), which is three of the reasons STYLE gives for something staying SVG.
 */
const DirtPatch: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <WideLayer>
    <ellipse cx={x} cy={y + 4} rx={104} ry={26} fill={kidTheme.earth} />
    <ellipse cx={x - 22} cy={y - 2} rx={44} ry={12} fill={kidTheme.earth} opacity={0.7} />
    <ellipse
      cx={x}
      cy={y + 4}
      rx={104}
      ry={26}
      fill="none"
      stroke={kidTheme.ink}
      strokeWidth={5}
      opacity={0.45}
    />
  </WideLayer>
);

/**
 * A Pip mark as it appears under a camera move — the kit's `projectMark` with
 * her growth state carried through, so a bubble placed on it clears the crown
 * she actually has.
 *
 * Bubbles live outside the camera (a zoomed bubble is unreadable), which is
 * why this exists at all.
 */
function projectPip(cam: Cam, m: Mark): Mark {
  const z = cam.zoom ?? 1;
  const half = CHAR_BOX.pip / 2;
  const ground = m.y + half;
  const gy = cam.y + (ground - cam.y) * z + (cam.dy ?? 0);
  const gx = cam.x + (m.x - cam.x) * z + (cam.dx ?? 0);
  return { ...m, x: gx, y: gy - half, scale: (m.scale ?? 1) * z };
}

// ---------------------------------------------------------------------------
// Scene 4 — Title, over one small seed
// ---------------------------------------------------------------------------

const TitleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Pull up and back: the seed becomes a dot, the field becomes the world,
  // the volcano holds the horizon." It starts at Scene 3's closing zoom, which
  // is the whole of the boundary check for this cut: the camera was already
  // moving and it keeps moving.
  const zoom = interpolate(frame, [0, 96], [S3_CLOSE_ZOOM, 0.46], {
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam: Cam = {
    x: S3_PIP.x,
    y: MEADOW.ground - 90,
    zoom,
    dy: interpolate(frame, [0, 96], [0, 96], {
      extrapolateRight: "clamp",
      easing: kidEase.easeInOutSine,
    }),
  };

  // The card lands after the pull-back has done most of its work, so the world
  // is already small when the title arrives on top of it.
  const pop = spring({ frame: frame - 70, fps, config: { damping: 13, mass: 0.7 } });

  return (
    <MeadowWorld
      phase={3.7}
      cam={cam}
      // OUTSIDE the camera. Inside it — which is where the first build put it —
      // the pull-back to 0.46× is applied to the title as well, so the card
      // that is supposed to arrive over a shrinking world shrinks with it.
      overlay={
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              transform: `scale(${pop}) rotate(${(1 - pop) * -4}deg)`,
              opacity: Math.min(1, pop * 1.4),
              textAlign: "center",
              fontFamily: kidTheme.fontFamily,
              marginTop: -150,
            }}
          >
            <div
              style={{
                fontSize: kidType.title,
                fontWeight: 900,
                letterSpacing: -1,
                lineHeight: 1.02,
                color: kidTheme.paper,
                // Never `-webkit-text-stroke`: it outlines each glyph contour
                // separately and an iPhone shows every bar an "A" is assembled
                // from. `kidInkOutline` casts the ring off the finished glyph.
                textShadow: kidInkOutline(7),
              }}
            >
              Pip and the
              <br />
              Sunshine Kitchen
            </div>
          </div>
        </AbsoluteFill>
      }
    >
      <DirtPatch x={S3_PIP.x} y={MEADOW.ground} />
      <Pip
        x={S3_PIP.x}
        y={S3_PIP_Y}
        scale={S3_PIP.scale}
        state="planted"
        phase={PHASE.pip}
        emotion={PIP_RESTING}
        look="camera"
        eyeLife={0.4}
      />
    </MeadowWorld>
  );
};

export const COLD_OPEN_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s01_breath: BreathScene,
  s02_ride: RideScene,
  s03_planted: PlantedScene,
  s04_title: TitleScene,
};
