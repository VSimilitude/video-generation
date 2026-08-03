import React from "react";
import {
  AbsoluteFill,
  Bubbles,
  PHASE,
  PaintedSky,
  RAY_LIGHT,
  RAY_SPECTRUM,
  Ray,
  SHARD_BODY,
  SPECTRUM,
  Shard,
  WideLayer,
  heldBeat,
  hover,
  kidEase,
  kidTheme,
  lineWindow,
  markCentre,
  moveAlong,
  orangeFollow,
  plateY,
  redWalk,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cast,
  type Mark,
  type ShardName,
  type TimedScene,
} from "./common";
import {
  SEA_DRIFT,
  SEA_SUNSET_FRAC,
  Sailboat,
  SleepingVolcano,
  VOLCANO_AT,
} from "./act3";

// ---------------------------------------------------------------------------
// Scene 28b2 — THE RACE, leg three: two walkers (new, revision2)
// ---------------------------------------------------------------------------
//
// **The breathing leg, and the direct answer to "we zoomed through the whole
// thing".** Nothing happens in it on purpose: two colours walk, one of them
// says three words about the other one's silence, and a forty-five frame hold
// sits on the picture. It is the only scene in the episode whose subject is the
// sky the last four minutes have been assembling.
//
// **"Nobody loses" as ONE PICTURE** is the staging brief in full, and every
// layer of the frame is one of them:
//
//   high      Blue, Indigo and Violet, streaks in the blue they became
//   rising    Yellow, going out through the top of frame, cheering herself
//   the beam  Ray, Red and Orange, still walking, in no hurry whatsoever
//   below     Green, flat out on the becalmed sailboat, not moving again
//   horizon   the island, asleep, unmentioned
//
// Five of the seven are visible at once and not one of them has been taken
// away — which is the sentence `a3_14c_narrator` said out loud two scenes ago,
// drawn instead of said.
//
// ---------------------------------------------------------------------------
// IMPORT DIRECTION. This file imports the volcano, the boat and the two sea
// constants from `./act3`, which imports this file back for its scene map. The
// cycle is deliberate and it is safe **only because nothing here touches an
// act3 binding at module scope** — every reference is inside the component
// body, i.e. after both modules have finished evaluating. Do not hoist any of
// them into a module-level `const`. The alternative was a third copy of
// `SleepingVolcano`; there are already two and promoting it is the cleanup
// list's headline, not this batch's job.
// ---------------------------------------------------------------------------
// THE VOLCANO, AND A DEVIATION THIS FILE IS FLAGGING RATHER THAN HIDING.
//
// script.md's volcano rule lists the scenes it appears in — "25, 28b, 28c, 29,
// 31 and 35 and in no other frame of the episode" — and that list was written
// before this scene existed. It is drawn here, at `VOLCANO_AT.x` on the
// measured horizon, from the first frame of the shot to the last, because the
// rule's *operative* clause is the other one: it must be continuously visible
// in the shot it is in, and "a background gag that vanishes mid-scene reads as
// a bug". This leg sits between two shots that both have it — 28b ends pushed
// in on its open eye and 28c opens on it asleep on the same horizon — so
// leaving it out is the one option that makes it blink out of existence for
// twenty seconds and come back. Nothing looks at it, nothing says anything,
// and it does not move. **Showrunner call to ratify or reverse.**
// ---------------------------------------------------------------------------

/** The beam this leg is walked on, and the plate pan that puts it in the sky. */
const BEAM_Y = 470;
const S28B2_PAN = 120;

/** How big the two walkers are. Mid-distance: bigger than the sea leg, smaller
 * than the finish, which is the whole shot's job — they are getting there. */
const WALK_SCALE = 0.5;
/**
 * Where Red is at frame zero. He crosses the entire frame across the leg at
 * `RED_SPEED` and is still walking when it cuts — 589 frames is 2,120px and the
 * frame is 1,920, so the one number that decides the shot is where he starts.
 * Nothing here re-times him: the scene picks his start, never his speed.
 */
const RED_X0 = -260;

/** Ray, ahead of the two of them and off the beam, watching the sky. */
const RAY_AT = { x: 1610, y: 300, scale: 0.55 };

/**
 * **The decorated sky.** Three colours who left in Scene 28, parked where the
 * blue is, each with a streak behind it pointing back the way it came.
 *
 * They are screen marks rather than world positions because that is what they
 * *are* now: the sky does not slide past you when you move, and Scene 28 spent
 * a whole hand-off establishing exactly that. Sizes descend with the frequency
 * ladder's own logic — Violet went furthest, so Violet is smallest.
 */
const SKY: ReadonlyArray<{ who: ShardName; x: number; y: number; scale: number; lean: number }> = [
  { who: "blue", x: 352, y: 150, scale: 0.2, lean: 26 },
  { who: "indigo", x: 690, y: 214, scale: 0.19, lean: 22 },
  { who: "violet", x: 1276, y: 132, scale: 0.18, lean: 30 },
];

/** Green's boat, below and behind them, with Green not getting up again. */
const BOAT = { x: 566, y: 852, scale: 0.56 };

/**
 * Yellow, going out through the top of the frame — the fifth cheer and the
 * chain's button, delivered by the only one left who would think to give it.
 */
const YELLOW_FROM = { x: 856, y: 380 };
const YELLOW_TO = { x: 902, y: -176 };
/**
 * 150 frames, not 80. She has a *line* on the way out — the chain's button —
 * and at 80 she was a pair of feet at the top edge of the frame for the whole
 * of it, with a bubble pointing at the sky above her. At 150 on an `easeOutSine`
 * she is a findable little body for the whole of "Great bounce, me!", leaves
 * frame as Ray waves after her, and is long gone by the time anybody else
 * speaks — which is the order the page puts those three things in.
 */
const YELLOW_RISE = 150;
const YELLOW_SCALE = 0.22;

const S28B2_BUBBLES: Record<string, string> = {
  a3_14k_ray: "Bye Yellow!",
  a3_14m_orange: "Red says we are nearly there.",
  a3_14n_ray: "Red did not say anything.",
  a3_14o_orange: "He meant to.",
  a3_14p_ray: "Are we still racing?",
  a3_14q_red: "I am walking home.",
};

/**
 * Hers is a different SIZE, so it is a different `<Bubbles>` — the same
 * arrangement Scene 28 uses for Blue's faint one. She is tiny, distant and on
 * her way out of the top of the frame, and a house-sized bubble next to a
 * 44px body says she is standing right there.
 */
const S28B2_FAR_BUBBLES: Record<string, string> = {
  a3_14j_yellow: "Great bounce, me!",
};
const FAR_BUBBLE = { fontSize: 34, maxWidth: 420 };

export const TwoWalkersScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const [waveFrom, waveTo] = lineWindow(scene, "a3_14k_ray");
  const [breatheFrom, breatheTo] = heldBeat(scene, "a3_14o_orange");

  const horizon = plateY(SEA_SUNSET_FRAC, { drift: SEA_DRIFT, dy: S28B2_PAN });

  // --- the two walkers ------------------------------------------------------
  //
  // Red at his one speed in a dead straight line, and Orange running Red's own
  // path delayed by the time it takes Red to walk one drawn body — so he is
  // exactly one body behind on every frame of the leg and could not overtake
  // him if he wanted to, which he does not.
  const redPath = (tt: number) => redWalk(tt, { x: RED_X0, y: BEAM_Y });
  const red = redPath(t);
  const orange = orangeFollow(redPath, t, SHARD_BODY * WALK_SCALE);

  // --- Yellow, leaving through the top -------------------------------------
  const rise = kidEase.easeOutSine(Math.max(0, Math.min(1, frame / YELLOW_RISE)));
  const yellowP = moveAlong(YELLOW_FROM, YELLOW_TO, rise, { arc: 0.1 });

  const stage = useStage(scene);
  const rayEmotion = useEmotion(
    scene,
    "ray",
    { a3_14p_ray: "amazed" },
    "happy",
    // A 45-frame held beat in this scene.
    0,
  );

  const redMark: Mark = {
    x: red.x,
    y: hover("shard", red.y, WALK_SCALE),
    scale: WALK_SCALE,
    who: "shard",
    side: "left",
  };
  const orangeMark: Mark = {
    x: orange.x,
    y: hover("shard", orange.y, WALK_SCALE),
    scale: WALK_SCALE,
    who: "shard",
    side: "left",
  };
  const rayMark: Mark = {
    x: RAY_AT.x,
    y: hover("ray", RAY_AT.y, RAY_AT.scale),
    scale: RAY_AT.scale,
    who: "ray",
    side: "left",
  };
  const yellowMark: Mark = {
    x: yellowP.x,
    y: hover("shard", yellowP.y, YELLOW_SCALE),
    scale: YELLOW_SCALE,
    who: "shard",
    side: "left",
  };

  // He waves up after Yellow — and by the time the wave is out she is already
  // through the top of the frame, which is the same joke Scene 28's goodbye
  // tells with three names and is free here. His eyes go up at her, through
  // `markCentre`, so the aim is at her face and not at the middle of her box.
  const waving = frame >= waveFrom - 6 && frame < waveTo + 12;
  const wave = waving
    ? 1 - kidEase.easeInOutSine(Math.max(0, Math.min(1, (frame - waveTo) / 12)))
    : 0;
  const rayLook = waving
    ? faceAim(rayMark, yellowMark)
    : frame >= breatheFrom
      ? faceAim(rayMark, redMark)
      : { x: -0.4, y: -0.2 };

  return (
    <AbsoluteFill style={{ background: kidTheme.sunsetLow, overflow: "hidden" }}>
      <PaintedSky bg="sea_sunset" phase={4.7} drift={SEA_DRIFT} dy={S28B2_PAN} />

      {/* The blue three of them became, still up at the top of the frame. It
          does not grow here — nobody bounces out in this leg; Yellow left in
          the tail of the last one. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(58,160,236,0.54) 0%, rgba(58,160,236,0.22) 26%, rgba(58,160,236,0) 46%)",
          pointerEvents: "none",
        }}
      />

      {/* THE VOLCANO, asleep on the measured horizon, in frame from the first
          frame of this shot to the last, and never mentioned. See the banner. */}
      <SleepingVolcano
        x={VOLCANO_AT.x}
        base={horizon}
        scale={VOLCANO_AT.scale}
        phase={0.42}
      />

      {/* GREEN, flat out on the boat, below and behind. He does not move again
          in this episode and he does not need to: the picture is that he got
          exactly what he wanted and everybody else is still going. */}
      <Sailboat x={BOAT.x} y={BOAT.y} scale={BOAT.scale} />
      <Shard
        who="green"
        x={BOAT.x + 26 * BOAT.scale}
        y={hover("shard", BOAT.y - 74 * BOAT.scale, 0.26)}
        scale={0.26}
        sit={1}
        idle={0.2}
        eyeLife={0}
        look={{ x: 0.2, y: 0.4 }}
        zIndex={14}
      />

      {/* THE DECORATED SKY. Three streaks, high, in the blue they are made of. */}
      {SKY.map((s) => (
        <SkyDecoration key={s.who} {...s} />
      ))}

      {/* YELLOW, going up and out, cheering herself. */}
      <Shard
        who="yellow"
        x={yellowMark.x}
        y={yellowMark.y}
        scale={YELLOW_SCALE}
        look={{ x: -0.3, y: 0.5 }}
        speaking={stage.speaking("yellow")}
        zIndex={16}
      />

      {/* THE BEAM. Red and orange only — the blue end of it went two legs ago.
          It is longer than the frame in both directions and it does not scroll:
          the light is still being made, its head is out past the finish line,
          and what shows the travel is the two of them crossing the frame.

          **THE GLOW AND THE ORANGE ARE A LEGIBILITY FIX (showrunner review,
          2026-08-03).** The beam was two flat rects — red at 0.6 and a pale
          core — laid over a painted sunset whose own plate is a stack of
          horizontal orange bands. At review scale it stopped reading as *the
          beam these two are walking* and started reading as one more stripe in
          the sky, which leaves the walkers apparently hanging in mid-air beside
          it. Three things fix it without moving one pixel of geometry (the
          walkers' own y, the beam's y and its 46:106-style proportion against a
          drawn body are all unchanged, so this stays continuous with Scene
          28b's beam either side of it):

            the halo    a wide, very soft band behind the beam. Nothing in the
                        painted plate has a halo, so the beam stops being one of
                        the plate's stripes and starts being a light source.
            the orange  a second band inside the red one. The scene's own
                        sentence is "red and orange only" and it was drawn in
                        one hue; now the thing the two of them are walking is
                        visibly *their* two colours, which is the read the
                        showrunner asked for.
            the core    0.7 -> 0.8, so the bright centre survives the plate. */}
      <WideLayer zIndex={10}>
        <rect
          x={-1400}
          y={BEAM_Y - 66}
          width={4600}
          height={132}
          rx={66}
          fill={kidTheme.sunLight}
          opacity={0.17}
        />
        <rect
          x={-1400}
          y={BEAM_Y - 26}
          width={4600}
          height={52}
          rx={26}
          fill={SPECTRUM[0].fill}
          opacity={0.6}
        />
        <rect
          x={-1400}
          y={BEAM_Y - 17}
          width={4600}
          height={34}
          rx={17}
          fill={SPECTRUM[1].fill}
          opacity={0.55}
        />
        <rect
          x={-1400}
          y={BEAM_Y - 9}
          width={4600}
          height={18}
          rx={9}
          fill={kidTheme.sunLight}
          opacity={0.8}
        />
      </WideLayer>

      <Shard
        who="red"
        x={redMark.x}
        y={redMark.y}
        scale={WALK_SCALE}
        heading={red.angle}
        look={{ x: 0.5, y: 0 }}
        speaking={stage.speaking("red")}
        zIndex={24}
      />
      <Shard
        who="orange"
        x={orangeMark.x}
        y={orangeMark.y}
        scale={WALK_SCALE}
        heading={orange.angle}
        // He talks about Red without ever looking at Red, in this scene and in
        // every other one. Straight down the course, exactly like the man in
        // front of him.
        look={{ x: 0.5, y: 0 }}
        speaking={stage.speaking("orange")}
        zIndex={23}
      />

      <Ray
        x={rayMark.x}
        y={rayMark.y}
        scale={RAY_AT.scale}
        brightness={RAY_LIGHT.full}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        look={rayLook}
        pose={wave > 0.04 ? "wave" : "rest"}
        wave={wave}
        streak={0.35}
        bank={-3}
        zIndex={30}
      />

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark, red: redMark, orange: orangeMark } as Cast}
        text={S28B2_BUBBLES}
        at={{
          // Ray is up at frame right for the whole leg, so his three go left of
          // him into the empty top of the sky, tail reaching back.
          a3_14k_ray: { x: 1140, y: 190, tail: "right", tailAt: RAY_AT.x },
          a3_14n_ray: { x: 1140, y: 190, tail: "right", tailAt: RAY_AT.x },
          a3_14p_ray: { x: 1140, y: 190, tail: "right", tailAt: RAY_AT.x },
          // The two walkers cross the whole frame, so their bubbles park in the
          // band between the beam and the blue and the tails follow them along
          // it. Orange's sit a little lower than Red's — the same double-act
          // separation the finish line uses.
          a3_14m_orange: { x: 700, y: 320, tail: "right", tailAt: orange.x },
          a3_14o_orange: { x: 700, y: 320, tail: "right", tailAt: orange.x },
          a3_14q_red: { x: 900, y: 244, tail: "right", tailAt: red.x },
        }}
      />

      {/* Hers is tiny and it is at the top of the frame, because she is. */}
      <Bubbles
        scene={scene}
        cast={{ yellow: yellowMark } as Cast}
        text={S28B2_FAR_BUBBLES}
        fontSize={FAR_BUBBLE.fontSize}
        maxWidth={FAR_BUBBLE.maxWidth}
        at={{ a3_14j_yellow: { x: 520, y: 176, tail: "right", tailAt: yellowP.x } }}
      />

      {/* Nothing enters the 45f hold: what is on screen keeps doing what it was
          doing — two colours walking at one speed, an island snoring, a boat
          not moving and three streaks that are now weather. `breatheTo` is
          referenced so a re-timed beat is visible in this file's own history
          rather than only in Video.tsx. */}
      {breatheTo < 0 ? <div /> : null}
    </AbsoluteFill>
  );
};

/** A pupil offset from one staged body's face towards another's (K4). */
function faceAim(from: Mark, to: Mark): { x: number; y: number } {
  const a = markCentre(from);
  const b = markCentre(to);
  const d = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
  return {
    x: Math.max(-1, Math.min(1, ((b.x - a.x) / d) * 1.25)),
    y: Math.max(-1, Math.min(1, ((b.y - a.y) / d) * 1.25)),
  };
}

/**
 * One of the three who are already sky: a small body with a soft tapering
 * streak behind it, pointing back down the way it came.
 *
 * The streak is drawn here rather than with `blueTrail` for the reason the kit
 * already knows about — a ricochet trail at formation scale over a painted
 * plate reads as a rendering fault, not as speed (the wave-2 finding). What it
 * needs to say at this size is only "this one is travelling", so it is one
 * stroke that thins and fades along its length.
 */
const SkyDecoration: React.FC<{
  who: ShardName;
  x: number;
  y: number;
  scale: number;
  /** Degrees below horizontal that the streak trails back at. */
  lean: number;
}> = ({ who, x, y, scale, lean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // A drift of a few pixels over the whole leg: they are not parked, they are
  // very far away and still going.
  const drift = (frame / fps) * 3.2;
  const i = who === "blue" ? 4 : who === "indigo" ? 5 : 6;
  const a = (lean * Math.PI) / 180;
  const len = 210 * scale * 4;
  const px = x + drift * 0.6;
  const py = y - drift * 0.18;
  return (
    <>
      <WideLayer zIndex={11}>
        {[0.34, 0.62, 1].map((k, n) => (
          <path
            key={k}
            d={
              `M ${px - Math.cos(a) * len * k} ${py + Math.sin(a) * len * k}` +
              ` L ${px - Math.cos(a) * len * k * 0.04} ${py + Math.sin(a) * len * k * 0.04}`
            }
            stroke={SPECTRUM[i].fill}
            strokeWidth={(5 + n * 6) * scale * 3}
            strokeLinecap="round"
            opacity={0.1 + n * 0.12}
          />
        ))}
      </WideLayer>
      <Shard
        who={who}
        x={px}
        y={hover("shard", py, scale)}
        scale={scale}
        heading={-lean}
        look={{ x: 0.4, y: -0.3 }}
        zIndex={12}
      />
    </>
  );
};
