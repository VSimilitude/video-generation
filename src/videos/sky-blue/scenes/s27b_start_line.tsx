import React from "react";
import {
  AbsoluteFill,
  AirBlob,
  Bubbles,
  PHASE,
  PaintedSky,
  RAY_LIGHT,
  RAY_SPECTRUM,
  Ray,
  SPECTRUM,
  Shard,
  Sunny,
  WIDTH,
  WideLayer,
  blueRicochet,
  greenSit,
  heldBeat,
  hover,
  indigoEcho,
  kidEase,
  kidTheme,
  lineWindow,
  markCentre,
  redWalk,
  useCurrentFrame,
  useEmotion,
  useLookAtSpeaker,
  useStage,
  useVideoConfig,
  type Box,
  type Cast,
  type Mark,
  type TimedScene,
} from "./common";

// ---------------------------------------------------------------------------
// Scene 27b — THE START LINE (new, revision2)
// ---------------------------------------------------------------------------
//
// The race gets a start, a field, a declared favourite and a starting gun, and
// it is the scene the whole of Act Three now hangs off. Everything in it is a
// picture the audience has been taught to read across twenty-six scenes:
//
//   - **The seven line up in spectrum order across the beam-head**, which is
//     the frequency ladder standing still and holding a pose — Scene 9's
//     picture, one last time, with the character each of them turned out to be
//     already on.
//   - **Sunny IS the start line.** He is enormous, behind them, half off the
//     left of frame, and the beam comes *out of him* — so the thing they are
//     lined up against is the sun, and nobody has to say so.
//   - **Red walks straight through it without stopping**, because he has not
//     stopped walking since Scene 27 and he is not going to start for a race
//     he has not been told about.
//   - **Violet runs a full wordless racer warm-up** and not one character in
//     the frame ever looks at him. It is his biggest scene and it is silent.
//
// ---------------------------------------------------------------------------
// THE ONE PLACE THIS SCENE COULD NOT DO WHAT THE PAGE ASKED, AND WHY.
//
// revision2 marks `a3_11u_red` "(half off frame)". It cannot be: Red is on
// screen from `a3_11f` (Blue orbits him, local frame 297) and that line lands
// at local 1388 — 1091 frames, 36 seconds, **3,927 px at `RED_SPEED`**, which
// is a little over two frame widths. There is no staging in which one body
// travelling at 108 px/s is on screen at both ends of that.
//
// `RED_SPEED` is not the thing that gives (it is the character; ruling R9 in
// act2.tsx cut a whole walk-through rather than raise it), and a camera that
// tracks him drags Sunny and the six off frame left. So the line lands the way
// `a3_13b_blue`'s already does in Scene 28: **a bubble at the right-hand edge
// with nobody under it, tail pointing off frame at wherever he has got to.**
// The gag is unharmed — it is the same gag, and it is now the third time this
// episode has told it — and Red's law is untouched. Flagged to the showrunner.
// ---------------------------------------------------------------------------

/** The beam-head. Same y as Scene 28's corridor, so the hard cut matches. */
const BEAM_Y = 596;

/**
 * **Sunny, enormous, and half off the left of frame.** He is a *place* in this
 * shot rather than a character on a mark: the beam leaves his middle, so his
 * centre is on the beam's own line and everything else is measured off it.
 *
 * 2.0 rather than the 3.0 a first arithmetic pass wanted: his rays reach
 * `202 · scale` px past his centre, and at 3.0 that is 666px of spinning
 * orange lying across the two colours at the tail of the line — the two whose
 * whole job in this scene is to be *findable* (Violet's warm-up, Indigo's
 * echo). At 2.0 the rays stop at x≈464 and the line starts at 400, so they
 * overlap the field by one body and no more.
 */
const SUNNY_AT = { x: 60, scale: 2.0 };
/** How far he settles when the gun is coming. The beam tilts with him. */
const SUNNY_SINK = 44;

/**
 * The line-up. Red at the head (frame right, nearest the course) and Violet at
 * the tail, which is the order they are in for the whole race and the order
 * they leave in.
 *
 * 150px of step at 0.40 scale: a shard's *drawn* body is about 96px there
 * (`SHARD_BODY` is wider than its box), so the file has half a body of daylight
 * between neighbours and reads as seven separate characters in a paused frame,
 * which is the only test the ensemble sheet accepts.
 */
const LINE_HEAD = 1300;
const LINE_STEP = 150;
const LINE_SCALE = 0.4;
/** Slot `i` of the line, in composition x. `i` is the spectrum index. */
function slotX(i: number): number {
  return LINE_HEAD - i * LINE_STEP;
}

/**
 * **Where Red is at frame zero.** The scene picks his start and never his
 * speed: at `RED_SPEED` he crosses the whole field between local 194 (he
 * enters) and local 730 (he is gone), which puts him
 *
 *   - inside the line while Blue orbits him (`a3_11f`),
 *   - mid-file on "No." (`a3_11g`, local 416, x≈798),
 *   - clear of the head and walking away on "Start of what." (`a3_11k`,
 *     local 670, x≈1712 — the last frame of him anybody gets),
 *
 * which is every beat the page asks for in the order it asks for them.
 */
const RED_X0 = -700;
/**
 * He walks 40px **under** the line rather than through it, and is drawn over
 * the top. Same picture — he goes straight through the assembled field without
 * stopping — with no frame in which two bodies occupy one square.
 */
const RED_DY = 40;

/**
 * Blue's cupboard, hung on his own slot: he holds his place in the file the way
 * Blue holds a place in anything, which is not at all.
 *
 * **Indigo runs the same arithmetic four frames late and ONE SLOT LEFT**, which
 * is the one change this scene makes to the braid the pack uses. In Scene 28
 * Indigo is drawn 26px under Blue and shares his box, because a formation in
 * flight has no slots; here the whole picture is a *line-up in spectrum order*,
 * and a copy who stands on top of his original leaves a hole in it — a still of
 * the first pass had a six-body line with a gap where indigo should be. Offset
 * by exactly `LINE_STEP` he holds his own place, does everything Blue does a
 * beat late, and — when Blue orbits Red — orbits a point 150px to the left of
 * Red, four frames behind, which is the character in one picture.
 */
const BLUE_BOX: Box = { x: slotX(4) - 70, y: BEAM_Y - 76, w: 140, h: 152 };
/** How far out Blue orbits Red, and how many loops he gets per line. */
const ORBIT_R = 128;
const ORBIT_LOOPS = 3;

/** Ray, ahead of the field and off the beam, where he can see all of it. */
const RAY_AT = { x: 1640, y: 396, scale: 0.55 };

/**
 * Half the width of `SpeechBubble`'s tail box.
 *
 * `tailAt` places the tail box's **centre**; the point of the drawn tail is at
 * one end of it, so a tail aimed at a body 55px below it puts its point half a
 * box off to the side. Only matters when the bubble is close to the speaker
 * and the speaker has neighbours — which in this episode is exactly one line.
 * See `a3_11i_orange` below.
 */
const TAIL_TIP_DX = 52;

const S27B_BUBBLES: Record<string, string> = {
  a3_11d_blue: "I will WIN!",
  a3_11e_indigo: "The fastest one there is.",
  a3_11f_blue: "RACE you!",
  a3_11g_red: "No.",
  a3_11h_blue: "He means yes!",
  a3_11i_orange: "He said no.",
  a3_11j_blue: "It has not started yet!",
  a3_11k_red: "Start of what.",
  a3_11l_orange: "Red says good luck.",
  a3_11m_green: "Is there anywhere to sit?",
  a3_11o_green: "I will find something.",
  a3_11p_yellow: "Good luck, EVERYBODY!",
  a3_11s_ray: "Are we racing?",
  a3_11t_blue: "YES!",
  a3_11u_red: "No.",
  a3_11v_sunny: "READY! STEADY! SUNSET!",
};

export const StartLineScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const [orbitFrom] = lineWindow(scene, "a3_11f_blue");
  const [, orbitTo] = lineWindow(scene, "a3_11g_red");
  const [sitAskFrom, sitAskTo] = lineWindow(scene, "a3_11m_green");
  const [wishFrom, wishTo] = lineWindow(scene, "a3_11p_yellow");
  const [countFrom, countTo] = heldBeat(scene, "a3_11q_narrator");
  const [, redLastTo] = lineWindow(scene, "a3_11u_red");
  const [gunFrom, gunTo] = lineWindow(scene, "a3_11v_sunny");

  // --- SUNNY, sinking a notch, and the beam tilting with him ----------------
  const sink = SUNNY_SINK * kidEase.easeInOutSine(clamp01((frame - redLastTo) / 24));
  const sunnyY = BEAM_Y + sink;
  /** The beam's own line: it leaves Sunny's middle and runs flat out to sea. */
  const beamY = (x: number): number =>
    sunnyY + (BEAM_Y - sunnyY) * clamp01((x - SUNNY_AT.x) / (2400 - SUNNY_AT.x));

  // --- THE GUN, and the eighteen frames of race that follow it -------------
  //
  // "READY! STEADY! SUNSET!" — they go on the last word, which lands at 88% of
  // the clip, and the scene has the 12f hold plus its 6f tail to string them
  // out in before the hard cut. Blue is first off because Blue would be.
  const launchAt = gunFrom + (gunTo - gunFrom) * 0.88;
  /**
   * How far colour `i` has got since the gun.
   *
   * **The file keeps its order and the gaps grow**, which is not the same thing
   * as "the fast ones go first" and is the version the next scene needs: Scene
   * 28 opens on a pack still in spectrum order with Red at its head, and Blue
   * leaves it by *ricocheting out sideways*, not by winning a drag race off the
   * line. So the head of the file covers the most ground and nobody overtakes
   * anybody — the picture is a line stretching, which is what "strung out down
   * the beam" means and what a first pass (Blue fastest) turned into three
   * bodies in one place.
   */
  const launch = (i: number): number => {
    const u = clamp01((frame - launchAt - (6 - i) * 1.5) / 22);
    // Setting off is an acceleration, never a jump cut to full speed.
    return kidEase.easeInQuad(u) * (130 + (6 - i) * 26);
  };

  // --- RED, who has not stopped walking since Scene 27 ----------------------
  const red = redWalk(t, { x: RED_X0, y: BEAM_Y + RED_DY });
  const redOn = red.x > -160 && red.x < WIDTH + 160;

  // --- ORANGE, who sets off after him at exactly Red's speed ---------------
  //
  // Not `orangeFollow` here, and that is the point of the beat: he does not get
  // to start one body behind, he starts from his own slot in the line nine
  // hundred pixels back and walks at exactly Red's speed for the rest of the
  // episode — so he is *permanently* second by construction, which is the want
  // the finish line pays off.
  const [orangeOff] = lineWindow(scene, "a3_11l_orange");
  const orange = redWalk(Math.max(0, frame - orangeOff) / fps, {
    x: slotX(1),
    y: BEAM_Y + RED_DY,
  });

  // --- BLUE, orbiting Red, then back in his cupboard -----------------------
  //
  // Two full loops of Red per line and another inside the 16f approach gap,
  // and the orbit follows Red rather than a point in space, because Red does
  // not stop walking to be orbited.
  const orbitU = clamp01((frame - orbitFrom) / Math.max(1, orbitTo - orbitFrom));
  const orbiting = frame >= orbitFrom - 8 && frame < orbitTo + 20;
  const orbitA = orbitU * Math.PI * 2 * ORBIT_LOOPS - Math.PI / 2;
  // Eased in and out so he arrives on the orbit and leaves it, rather than
  // teleporting onto a circle.
  const orbitOn =
    clamp01((frame - (orbitFrom - 8)) / 10) - clamp01((frame - orbitTo) / 20);
  const blueBox = blueRicochet(frame, BLUE_BOX, 3);
  const blueOrbit = {
    x: red.x + Math.cos(orbitA) * ORBIT_R,
    y: red.y - RED_DY + Math.sin(orbitA) * ORBIT_R * 0.62,
    angle: (orbitA * 180) / Math.PI + 90,
  };
  const blueP = {
    x: blueBox.x + (blueOrbit.x - blueBox.x) * orbitOn + launch(4),
    y: blueBox.y + (blueOrbit.y - blueBox.y) * orbitOn,
    angle: orbiting ? blueOrbit.angle : blueBox.angle,
  };
  // Indigo is the same arithmetic, four frames ago — including the orbit, so
  // when Blue circles Red there are two of them going round him and one is
  // always a quarter of a second behind.
  const blueAt = (f: number): { x: number; y: number; angle: number } => {
    const u = clamp01((f - orbitFrom) / Math.max(1, orbitTo - orbitFrom));
    const a = u * Math.PI * 2 * ORBIT_LOOPS - Math.PI / 2;
    const on = clamp01((f - (orbitFrom - 8)) / 10) - clamp01((f - orbitTo) / 20);
    const bx = blueRicochet(f, BLUE_BOX, 3);
    const r = redWalk(f / fps, { x: RED_X0, y: BEAM_Y });
    return {
      x: bx.x + (r.x + Math.cos(a) * ORBIT_R - bx.x) * on,
      y: bx.y + (r.y + Math.sin(a) * ORBIT_R * 0.62 - bx.y) * on,
      angle: on > 0.5 ? (a * 180) / Math.PI + 90 : bx.angle,
    };
  };
  const indigoP = indigoEcho(blueAt, frame);

  // --- GREEN, who has nowhere to sit ---------------------------------------
  //
  // His line is the joke and the staging is the setup: he *tries*, mid-air,
  // finds two hundred miles of nothing under him, and comes back up. The dip
  // is `greenSit`'s own drop, so it is the same movement his sit always is.
  const trySit =
    clamp01((frame - sitAskFrom - 10) / 8) - clamp01((frame - sitAskTo + 4) / 10);

  // --- VIOLET'S WARM-UP, and nobody watches it ------------------------------
  //
  // The most professional athlete on the line, in four movements, all of them
  // amplitude — which is the only vocabulary he has and the only one he needs:
  //
  //   toe-touches   a deep, slow, entirely serious bob, arms down (a *raised*
  //                 arm is Yellow's, and it is Yellow's in every episode)
  //   the gears     the vibration steps up in four discrete stages across the
  //                 scene, each one held, so a child can see him changing gear
  //                 rather than merely fizzing
  //   the peak      under Yellow's good-lucks and the Narrator's head-count
  //   both arms     the 20f beat after "Six racers.", which is the one thing
  //                 in the beat and the reason the Narrator corrects himself
  //
  // The gears are a step function of the frame and the steps are placed on
  // *lines*, so a re-timed clip moves them with it.
  const gear =
    0.55 +
    0.25 * (frame >= orbitFrom ? 1 : 0) +
    0.3 * (frame >= sitAskFrom ? 1 : 0) +
    0.4 * (frame >= wishFrom ? 1 : 0) +
    0.5 * (frame >= countFrom ? 1 : 0);
  // The toe-touch: one every 26 frames, deep, and it never once stops.
  const toeTouch = Math.max(0, Math.sin((frame / 26) * Math.PI * 2)) ** 1.6 * 34;
  // Both arms out for the head-count beat, and for four frames either side of
  // it so the gesture has an edge rather than a switch.
  const violetArms = frame >= countFrom - 4 && frame < countTo + 8;

  const stage = useStage(scene);
  const rayEmotion = useEmotion(
    scene,
    "ray",
    { a3_11s_ray: "amazed" },
    "happy",
    // 20f and 12f held beats in this scene.
    0,
  );
  const sunnyEmotion = useEmotion(scene, "sunny", { a3_11v_sunny: "excited" }, "proud", 0);

  // --- the marks ------------------------------------------------------------
  const markOf = (x: number, y: number): Mark => ({
    x,
    y: hover("shard", y, LINE_SCALE),
    scale: LINE_SCALE,
    who: "shard",
    side: x < WIDTH / 2 ? "right" : "left",
  });
  const standing = (i: number): Mark => markOf(slotX(i) + launch(i), beamY(slotX(i)));
  const redMark = markOf(red.x, red.y);
  const orangeMark = frame >= orangeOff ? markOf(orange.x, orange.y) : standing(1);
  const yellowMark = standing(2);
  const greenMark = standing(3);
  const blueMark = markOf(blueP.x, blueP.y);
  const indigoMark = markOf(indigoP.x - LINE_STEP, indigoP.y + 26);
  const violetMark = markOf(slotX(6) + launch(6), beamY(slotX(6)) + toeTouch);
  const rayMark: Mark = {
    x: RAY_AT.x,
    y: hover("ray", RAY_AT.y, RAY_AT.scale),
    scale: RAY_AT.scale,
    who: "ray",
    side: "left",
  };
  const sunnyMark: Mark = {
    x: SUNNY_AT.x,
    y: hover("sunny", sunnyY, SUNNY_AT.scale),
    scale: SUNNY_AT.scale,
    who: "sunny",
    side: "right",
  };

  const cast: Cast = {
    ray: rayMark,
    sunny: sunnyMark,
    red: redMark,
    orange: orangeMark,
    yellow: yellowMark,
    green: greenMark,
    blue: blueMark,
    indigo: indigoMark,
  };

  // Ray watches whoever is talking — through `markCentre`, so every aim in the
  // scene lands on a face rather than on the middle of a box.
  const rayLook = useLookAtSpeaker(scene, cast, "ray", { x: -0.6, y: 0.2 });

  // **Yellow's good-lucks are three separate looks**, because they are three
  // separate names: Blue, Green, and then Violet — the only character who ever
  // addresses him, ninety seconds before "Great bounce, Violet!" pays it off.
  const wish = clamp01((frame - wishFrom) / Math.max(1, wishTo - wishFrom));
  const yellowLook = ((): { x: number; y: number } => {
    if (frame < wishFrom || frame > wishTo + 10) return { x: 0.35, y: -0.1 };
    if (wish > 0.66) return faceAim(yellowMark, violetMark);
    if (wish > 0.33) return faceAim(yellowMark, greenMark);
    return faceAim(yellowMark, blueMark);
  })();

  return (
    <AbsoluteFill>
      <PaintedSky bg="sky_dome_day" phase={7.3} drift={8} />
      {/* The same warm wash Scene 28 opens on, so the hard cut at the end of
          this scene is a cut in the *action* and not a cut to a new world.
          There is no blue band up top yet: the sky the leavers become has not
          been made, because nobody has left. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(255,138,60,0.62) 0%, rgba(255,167,64,0.7) 46%, rgba(255,201,60,0.62) 100%)",
          pointerEvents: "none",
        }}
      />

      <StartAir t={t} y={BEAM_Y} />

      {/* SUNNY. Behind the field, half off frame, and the beam comes out of
          him — he is not starting the race, he *is* the start line. */}
      <Sunny
        x={sunnyMark.x}
        y={sunnyMark.y}
        scale={SUNNY_AT.scale}
        phase={PHASE.sunny}
        emotion={sunnyEmotion}
        speaking={stage.speaking("sunny")}
        look={{ x: 0.6, y: -0.1 }}
        raySpeed={0.09}
        zIndex={6}
      />

      {/* THE BEAM, leaving him. Two hundred miles of sideways air, drawn as the
          one straight line in the frame — and it tilts when he sinks. */}
      <WideLayer zIndex={10}>
        <path
          d={
            `M ${SUNNY_AT.x} ${sunnyY - 34} L 2600 ${BEAM_Y - 34}` +
            ` L 2600 ${BEAM_Y + 34} L ${SUNNY_AT.x} ${sunnyY + 34} Z`
          }
          fill={SPECTRUM[0].fill}
          opacity={0.5}
        />
        <path
          d={
            `M ${SUNNY_AT.x} ${sunnyY - 13} L 2600 ${BEAM_Y - 13}` +
            ` L 2600 ${BEAM_Y + 13} L ${SUNNY_AT.x} ${sunnyY + 13} Z`
          }
          fill={kidTheme.sunLight}
          opacity={0.62}
        />
      </WideLayer>

      {/* THE FIELD, in spectrum order. Seven bodies, always mounted, always in
          the same order — the frequency ladder holding a pose. */}
      <Shard
        who="violet"
        x={violetMark.x}
        y={violetMark.y}
        scale={LINE_SCALE}
        vibrate={gear}
        arms={violetArms}
        look={{ x: 0.4, y: 0 }}
        zIndex={20}
      />
      {/* Indigo is drawn behind Blue and sits 26px lower, in the file and out
          of it: he is the faded copy and a copy belongs behind its original. */}
      <Shard
        who="indigo"
        x={indigoMark.x}
        y={indigoMark.y}
        scale={LINE_SCALE}
        heading={indigoP.angle}
        look={{ x: 0.4, y: 0 }}
        speaking={stage.speaking("indigo")}
        zIndex={21}
      />
      <Shard
        who="blue"
        x={blueMark.x}
        y={blueMark.y}
        scale={LINE_SCALE}
        heading={blueP.angle}
        look={orbiting ? { x: -0.5, y: 0.1 } : { x: 0.5, y: 0 }}
        speaking={stage.speaking("blue")}
        zIndex={23}
      />
      <Shard
        who="green"
        x={greenMark.x}
        y={greenMark.y}
        scale={LINE_SCALE}
        sit={greenSit(frame, sitAskFrom, true) * trySit}
        look={{ x: 0.45, y: 0.15 }}
        speaking={stage.speaking("green")}
        zIndex={22}
      />
      <Shard
        who="yellow"
        x={yellowMark.x}
        y={yellowMark.y}
        scale={LINE_SCALE}
        look={yellowLook}
        speaking={stage.speaking("yellow")}
        zIndex={22}
      />
      <Shard
        who="orange"
        x={orangeMark.x}
        y={orangeMark.y}
        scale={LINE_SCALE}
        heading={frame >= orangeOff ? orange.angle : 0}
        look={{ x: 0.55, y: 0 }}
        speaking={stage.speaking("orange")}
        zIndex={24}
      />
      {/* RED, walking through all of it. Drawn over the field because he goes
          *through* the line rather than round it, and 40px under it so no two
          bodies ever share a square. */}
      {redOn ? (
        <Shard
          who="red"
          x={redMark.x}
          y={redMark.y}
          scale={LINE_SCALE}
          heading={red.angle}
          look={{ x: 0.6, y: 0 }}
          speaking={stage.speaking("red")}
          zIndex={30}
        />
      ) : null}

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
        streak={0.4}
        bank={-3}
        zIndex={34}
      />

      <Bubbles
        scene={scene}
        cast={cast}
        text={S27B_BUBBLES}
        at={{
          // Sunny is a wall of sun at frame left, so his goes in the clear sky
          // over the head of the field with its tail reaching back at him.
          a3_11v_sunny: { x: 900, y: 214, tail: "left", tailAt: SUNNY_AT.x },
          // Ray sits above the head of the line; his bubble goes left of him
          // rather than off the right-hand edge.
          a3_11s_ray: { x: 1240, y: 214, tail: "right", tailAt: RAY_AT.x },
          // **Red is gone by his second "No."** — see the banner at the top of
          // this file. The bubble parks at the right-hand edge with its tail
          // pointing off frame after him, which is the same device Scene 28
          // uses for `a3_13b_blue` and the same joke: the answer arrives from
          // wherever he has got to, and nobody goes and looks.
          a3_11u_red: { x: 1500, y: 300, tail: "right", tailAt: WIDTH + 200 },
          // Blue moves through every line he has; the bubbles park in the sky
          // over the field and the tails follow him.
          a3_11d_blue: { x: 760, y: 240, tail: "right", tailAt: blueP.x },
          a3_11f_blue: { x: 760, y: 240, tail: "right", tailAt: blueP.x },
          a3_11h_blue: { x: 760, y: 240, tail: "right", tailAt: blueP.x },
          a3_11j_blue: { x: 760, y: 240, tail: "right", tailAt: blueP.x },
          a3_11t_blue: { x: 760, y: 240, tail: "right", tailAt: blueP.x },
          // Indigo's tail arrives four beats after Blue's line and has to be
          // visibly *his*, so it goes on the other side and lower — the same
          // separation the pack uses.
          a3_11e_indigo: { x: 520, y: 396, tail: "right", tailAt: indigoMark.x },
          // **Orange's correction, re-aimed (showrunner fix, 2026-08-03).** It
          // had no override at all, so it took the default: bubble at
          // `orange.x − 330` = 820 with the tail parked at its own right-hand
          // corner, which is x≈1000 — i.e. **on Yellow**, two slots up the line
          // from the man speaking, with Green under the other end of it. In a
          // seven-body line-up at 150px of step, a tail is the only attribution
          // there is and it has to land on the right body.
          //
          // Pushed right to 1000 so the tail's clamped travel (±(half the
          // bubble) − 40px ≈ 812…1188) *contains* Orange's slot at
          // `slotX(1)` = 1150 instead of stopping 150px short of it, and aimed
          // at `orangeMark.x` — the mark, which is where his face is, rather
          // than the middle of anybody's box. `y` stays the default
          // `bubbleAbove`, so the bubble sits at the same height as every other
          // one in the scene and the tail still clears the field's crowns.
          //
          // **Minus `TAIL_TIP_DX`, and it is not a fudge.** `tailAt` positions
          // the *centre* of the tail's own 104px box; a right-hand tail is
          // mirrored, so its point ends up half a box to the right of the
          // anchor. Everywhere else in the act that does not matter — the
          // bubble is three or four hundred pixels above its speaker and the
          // eye reads the tail's direction. Here it hangs 55px over a line-up
          // whose bodies are 150px apart, so an uncorrected tail lands its
          // point in the daylight between Orange and Red, i.e. back to pointing
          // at nobody. Corrected, the point is on Orange's face.
          a3_11i_orange: { x: 1000, tail: "right", tailAt: orangeMark.x - TAIL_TIP_DX },
        }}
      />
    </AbsoluteFill>
  );
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

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
 * The air the race is about to be run through, thick around the beam-head and
 * thinning out with distance. Drawn here rather than shared with Scene 28's
 * `AirCorridor` on purpose: this file must not import act3.tsx, which imports
 * it back (see the note on the scene map), and a fixed-length list of blobs is
 * six lines.
 */
const StartAir: React.FC<{ t: number; y: number }> = ({ t, y }) => (
  <WideLayer zIndex={8}>
    {Array.from({ length: 34 }, (_, i) => {
      const k = i * 37;
      const x = -200 + i * 92 + ((k * 41) % 70);
      const by = y - 250 + ((k * 97) % 470);
      return <AirBlob key={i} x={x} y={by} r={24 + ((k * 13) % 24)} t={t} seed={i} opacity={0.38} />;
    })}
  </WideLayer>
);
