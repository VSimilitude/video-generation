import React from "react";
import {
  SpeechBubble,
  emotionAt,
  kidEase,
  kidOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  lookAt,
  mixHex,
} from "../../../lib/kid";
import {
  ACT_COLOR,
  AbsoluteFill,
  AirBlob,
  BLUE_LEG,
  BigWordBeat,
  Bubbles,
  Camera,
  CutFlash,
  Face,
  INDIGO_LAG,
  PHASE,
  PaintRoller,
  PaintedSky,
  Puff,
  RAY_LIGHT,
  RAY_SPECTRUM,
  RED_SPEED,
  Ray,
  SHARD_BODY,
  SPECTRUM,
  Shard,
  SoftShade,
  Sunny,
  WideLayer,
  blueRicochet,
  blueTrail,
  heldBeat,
  hover,
  indigoEcho,
  interpolate,
  lineWindow,
  markCentre,
  orangeFollow,
  plateY,
  projectMark,
  redWalk,
  useCurrentFrame,
  useEmotion,
  useRig,
  useStage,
  useVideoConfig,
  type Box,
  type Cam,
  type Cast,
  type EmotionInput,
  type Mark,
  type TimedScene,
} from "./common";

// ACT TWO — THE AIR. Scenes 14–24 of script.md.
//
// The act that answers the cold open. Act One made the sky's blueness strange;
// this act spends eleven scenes making it mechanical, and the mechanism is a
// *difference in behaviour between two characters* rather than a property of
// light: Red is big and calm and goes straight through, Blue is jumpy and
// bounces off everything, and the bouncing arrives at your eye from every
// direction at once.
//
// Four act-wide rules, enforced here rather than per scene:
//
//   **Ray is `RAY_LIGHT.afterRainbow` until Scene 24**, where he steps to
//   `.full` and stays for the rest of the episode, and he wears
//   `RAY_SPECTRUM.afterRainbow` in every shot because Scene 13 turned it on.
//   Nothing in dialogue mentions either number, in this act or any other.
//
//   **Emotion lead 0 on every held-beat scene.** Nine of the episode's
//   forty-one beats are in this act and three of them (16, 23 twice) are the
//   joke itself. Where a face has to change *inside* a silence there is no line
//   to hang it on, so those use `emotionAt` — Scenes 16 and 23 are exactly the
//   case it was written for.
//
//   **THE PHYSICS HONESTY NOTE IS LAW** (script.md, Production notes). Blue is
//   never *smaller*, it is **jumpy** and **bouncy**; Red is **big and calm**.
//   Nothing is ever taken away from anybody: Scene 19's blue does not leave the
//   beam, it ricochets off the air into the rest of the frame, which is the
//   opposite of removal and is why the episode is not called "the Color Thief".
//   The one size difference on screen (Scene 19's Blue is a little smaller than
//   Scene 18's Red) is the script's own staging note — "Blue — small, quick,
//   already vibrating before it enters" — and it is deliberately kept small
//   enough to read as *quick* rather than as an explanation, with all the
//   contrast carried by the vibration and the ricochet.
//
//   **The comparison is the lesson, so Scene 18 has to be boring.** Red crosses
//   dead straight at a constant speed — `kidEase.linear`, the one place in the
//   act it is correct — and leaves a straight line behind him that is still on
//   screen while the Narrator says "Straight through". Half of scattering is
//   the colours that *don't*.

/** Every held-beat scene in this act cuts the emotion lead to zero. */
const NO_LEAD = 0;

/**
 * 0 → 1 → 0 across `[a, b)`, with `ramp` frames of ease at each end.
 *
 * Four of revision2's act-two additions are *visits* — a colour who is not on
 * stage for the whole scene arrives, says a thing and leaves again — and every
 * one of them is this shape. Written once here rather than four times inline;
 * act one has the same function for the same reason.
 */
function pulse(f: number, a: number, b: number, ramp = 6): number {
  if (f <= a || f >= b) return 0;
  return kidEase.easeInOutSine(Math.min(1, Math.min((f - a) / ramp, (b - f) / ramp)));
}

/**
 * **Every colour who visits a scene arrives from above and leaves upward**, and
 * the number is shared so the four of them read as one law rather than as four
 * entrances. It is the physics-honesty note applied to staging: a colour is
 * never *removed* from a frame, he bounces out of the top of it.
 */
const VISIT_LIFT = 320;

const W = 1920;
const H = 1080;

/**
 * Puff's opacity in this act, and the same shape episode two's `PUFF_OPACITY`
 * had: the number lives in one place, an act that invents a third value has
 * broken the arc, and a scene that needs him more readable darkens what is
 * behind him instead.
 *
 * He is a guest here, so the ramp is two values rather than four. Forty percent
 * from his entrance in Scene 17 ("at about forty percent opacity, waving"),
 * full in Scene 22 and only there — the interlock is the one beat where the air
 * is the thing being talked about rather than the thing being demonstrated.
 */
const PUFF_GHOST = 0.4;

// ---------------------------------------------------------------------------
// Scene 14 — So why is the sky only blue
// ---------------------------------------------------------------------------

/**
 * The cold open's tilt, to the frame.
 *
 * Scene 1 tilts up off the page over `heldBeat(co_05) * 0.72` = 45 × 0.72 = 32
 * frames, and script.md asks for "the exact framing of the cold open's tilt,
 * held for the same length". There is no held beat here to derive it from, so
 * the number is written down with its provenance instead of re-derived from a
 * different scene's gap.
 */
const TILT_FRAMES = 32;
const TILT_AT = 8;

const S14_RAY = { x: 1010, y: 520, scale: 0.9 };

const S14_BUBBLES: Record<string, string> = {
  a2_03_ray: "Why IS it only blue?",
};

const WhyOnlyBlueScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [ghostFrom, ghostTo] = lineWindow(scene, "a2_02_narrator");
  const [rayFrom] = lineWindow(scene, "a2_03_ray");

  // The world slides down and out of frame and the sky comes in over the top
  // of it, which is a camera tilting up. Same two stacked layers as Scene 1.
  const tilt = kidEase.easeInOutSine((frame - TILT_AT) / TILT_FRAMES);

  // The seven ghost across the sky under the act's question and are gone before
  // it ends: Act One's fact, still true, and no help at all with this one.
  const ghost = Math.max(
    0,
    Math.sin(Math.PI * Math.max(0, Math.min(1, (frame - ghostFrom) / Math.max(1, ghostTo - ghostFrom + 20)))),
  );

  const stage = useStage(scene);
  const rayMark: Mark = {
    x: S14_RAY.x,
    // He rises into the sky *with* the tilt, and starts completely below the
    // frame: a still mid-tilt with the top of his head coming over the bottom
    // edge reads as a character peeping, not as a camera moving.
    y: hover("ray", S14_RAY.y + (1 - tilt) * 1000, S14_RAY.scale),
    scale: S14_RAY.scale,
    who: "ray",
    side: "left",
  };

  return (
    <AbsoluteFill style={{ background: kidTheme.skyLow, overflow: "hidden" }}>
      {/* The sky, parked one frame-height above the garden and riding down. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: -H + tilt * H,
          width: W,
          height: H,
        }}
      >
        <PaintedSky bg="sky_dome_day" drift={10} phase={10.1} />
      </div>

      <div style={{ position: "absolute", inset: 0, transform: `translateY(${tilt * H}px)` }}>
        <PaintedSky bg="garden_day" drift={8} phase={10.1} vignette={0.2} />
        {/* The ground has to *end* somewhere as the camera leaves it, and a
            hard edge between two plates is a cut rather than a tilt. Same haze
            the cold open uses, same reason. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: -2,
            width: W,
            height: 200,
            background: `linear-gradient(to top, rgba(150,206,236,0) 0%, rgba(176,222,243,0.7) 55%, ${kidTheme.skyLow} 100%)`,
            opacity: tilt > 0 ? 1 : 0,
          }}
        />
      </div>

      <GhostSeven u={ghost} t={frame / fps} />

      <Ray
        x={rayMark.x}
        y={rayMark.y}
        scale={S14_RAY.scale}
        brightness={RAY_LIGHT.afterRainbow}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion="happy"
        speaking={stage.speaking("ray")}
        look={frame >= rayFrom ? "camera" : "up"}
        streak={0.3}
        zIndex={20}
      />

      <Bubbles scene={scene} cast={{ ray: rayMark } as Cast} text={S14_BUBBLES} />
    </AbsoluteFill>
  );
};

/**
 * The seven, ghosting across an empty sky and fading.
 *
 * **One ribbon, not seven bands.** The first pass drew seven separate wide
 * bands across the whole frame at low alpha, and a still of it is wallpaper:
 * red, orange and yellow at 17% over cyan are three shades of cyan, and with
 * the frame full of them there is no sky left to be stubbornly one colour. Kept
 * as a single seven-stop ribbon, drawn narrow and a little stronger, it reads
 * as what it is — Act One's fact drifting past and not helping.
 */
const GhostSeven: React.FC<{ u: number; t: number }> = ({ u, t }) => (
  <WideLayer zIndex={6} opacity={u}>
    <g transform={`translate(${((t * 34) % 900) - 450} 0)`}>
      {SPECTRUM.map((c, i) => {
        const y = 232 + i * 40 + Math.sin(t * 0.5 + i * 0.6) * 6;
        return (
          <path
            key={c.name}
            d={`M -420 ${y + 120} q 620 ${-190 - i * 4} 1240 ${-30} q 560 96 1180 ${44}`}
            stroke={c.fill}
            strokeWidth={38}
            strokeLinecap="round"
            fill="none"
            opacity={0.34}
          />
        );
      })}
    </g>
  </WideLayer>
);

// ---------------------------------------------------------------------------
// Scene 15 — Myth-bust one: it is not the sea
// ---------------------------------------------------------------------------

/**
 * **The two bays are not a matched pair, and the framing is the fix.**
 *
 * `bay_blue` and `bay_grey` were prompted as the same place in two weathers,
 * and they are not: the headland sits differently and the measured horizons are
 * 0.5339 and 0.4857 — 53 px apart on the plate, ~100 px in frame. Cut between
 * them raw and the reversal ("the sea copies the sky") reads as a different
 * beach, which is the one thing this scene cannot afford, because the whole
 * argument is that only the *weather* changed.
 *
 * So both plates are framed by the same rule: pan right and zoom until the
 * right-hand headland is off frame in both, and give each one the `dy` that
 * puts its own measured horizon on the same composition line. What is left in
 * frame is sea, horizon and sky — three things the two plates genuinely agree
 * about.
 */
const BAY = { drift: 10, dx: 470, zoom: 1.46 } as const;
const HORIZON_Y = 640;
const BAY_BLUE_FRAC = 0.5339;
const BAY_GREY_FRAC = 0.4857;

/** `dy` that lands a plate's measured horizon on `HORIZON_Y`. */
function bayDy(frac: number): number {
  return HORIZON_Y - plateY(frac, { drift: BAY.drift, dx: BAY.dx, zoom: BAY.zoom, dy: 0 });
}

const S15_RAY = { x: 470, y: 336, scale: 0.72 };

const S15_BUBBLES: Record<string, string> = {
  // A summary, not a transcript: the clip is "So the sea is not doing it."
  a2_07_ray: "Not the sea, then.",
  // --- Blue is IN the postcard (revision2) ----------------------------------
  // The character who *is* the sky's blue, meeting the thing that takes his
  // credit — and then being copied by the thing that copies him.
  a2_04b_blue: "You're blue! Twins!",
  a2_09b_blue: "Everybody copy me!",
  a2_09c_indigo: "Copy me.",
};

/**
 * **Blue's cupboard over the bay** — right of the arrows, right of the "?", and
 * well right of the MYTH stamp, which is the only other thing that is ever in
 * the top half of this frame.
 *
 * He is over the *water*, below the horizon at `HORIZON_Y`, because the joke is
 * that he is talking to the sea. Indigo runs the same box shifted down and left
 * — the kit's "behind and under Blue" — so the two of them are never one blob.
 */
const S15_BLUE_BOX: Box = { x: 1230, y: 700, w: 380, h: 210 };
const S15_BLUE_SCALE = 0.62;
const S15_INDIGO_OFF = { x: -170, y: 60 } as const;
const S15_INDIGO_SCALE = 0.44;

const MythSeaScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, mythTo] = lineWindow(scene, "a2_05_narrator");
  const [beatFrom] = heldBeat(scene, "a2_05_narrator");
  const [desertFrom] = lineWindow(scene, "a2_06_narrator");
  const [greyFrom] = lineWindow(scene, "a2_08_narrator");
  const [reverseFrom] = lineWindow(scene, "a2_09_narrator");

  // The stamp thuds on the last third of "Big myth. Busted." and cracks in the
  // silence the script bought for it.
  const stampAt = Math.round(mythTo - 14);
  // Wipe to the desert, left to right, on "The sky is blue over the desert".
  const wipe = kidEase.easeInOutSine((frame - desertFrom - 6) / 22);
  // And a dissolve — not a wipe — back to the bay in grey. A wipe says "another
  // place"; a dissolve over identical framing says "same place, worse day",
  // which is the sentence.
  const grey = kidEase.easeInOutSine((frame - greyFrom - 10) / 18);

  // The arrow the scene opens on (sea -> sky, with a question mark on it) is
  // redrawn the other way up on the last line. The correction is a picture
  // before it is a sentence.
  //
  // It goes as the stamp lands, which is both the tidier frame (the stamp has
  // to be alone in its beat) and the better sentence: the claim is stamped, and
  // then the claim is not there any more.
  const arrowUp =
    kidEase.easeOutCubic((frame - 12) / 26) *
    (1 - kidEase.easeInOutSine((frame - stampAt) / 10));
  const arrowDown = kidEase.easeOutCubic((frame - reverseFrom - 8) / 26);

  const stage = useStage(scene);
  const rayMark: Mark = {
    x: S15_RAY.x,
    y: hover("ray", S15_RAY.y, S15_RAY.scale),
    scale: S15_RAY.scale,
    who: "ray",
    side: "right",
    offset: 300,
  };

  // --- Blue in the postcard, twice (revision2) ------------------------------
  //
  // **He is not on stage for the myth-bust beat.** He arrives for "Twins!",
  // pings back out of the top of frame on his last word, and comes down again
  // for the Copy-me pair on the grey day — so the 30f stamp hold stays as empty
  // as it shipped, and the desert counter-example does not have a sky character
  // hovering over it.
  const [blueFrom, blueTo] = lineWindow(scene, "a2_04b_blue");
  const [copyFrom] = lineWindow(scene, "a2_09b_blue");
  const [echoFrom] = lineWindow(scene, "a2_09c_indigo");
  const [, pleasedTo] = heldBeat(scene, "a2_09c_indigo");
  const visit = Math.max(
    pulse(frame, blueFrom - 18, blueTo + 4, 14),
    pulse(frame, copyFrom - 20, pleasedTo + 10, 14),
  );
  const echo = pulse(frame, echoFrom - 14, pleasedTo + 10, 12);
  const blue = blueRicochet(frame, S15_BLUE_BOX, 21.7);
  const indigo = indigoEcho((f: number) => blueRicochet(f, S15_BLUE_BOX, 21.7), frame);
  const blueAt = { x: blue.x, y: blue.y - (1 - visit) * VISIT_LIFT };
  const indigoAt = {
    x: indigo.x + S15_INDIGO_OFF.x,
    y: indigo.y + S15_INDIGO_OFF.y - (1 - echo) * VISIT_LIFT,
  };
  const blueMark: Mark = {
    x: blueAt.x,
    y: hover("shard", blueAt.y, S15_BLUE_SCALE),
    scale: S15_BLUE_SCALE,
    who: "shard",
  };
  const indigoMark: Mark = {
    x: indigoAt.x,
    y: hover("shard", indigoAt.y, S15_INDIGO_SCALE),
    scale: S15_INDIGO_SCALE,
    who: "shard",
  };

  return (
    <AbsoluteFill style={{ background: kidTheme.skyLow, overflow: "hidden" }}>
      <PaintedSky
        bg="bay_blue"
        phase={11.2}
        drift={BAY.drift}
        dx={BAY.dx}
        dy={bayDy(BAY_BLUE_FRAC)}
        zoom={BAY.zoom}
      />
      {/* The grey day, dissolving in over identical framing. */}
      <div style={{ position: "absolute", inset: 0, opacity: Math.max(0, Math.min(1, grey)) }}>
        {/* A touch of contrast on the grey plate: framed this tightly it is a
            very low-contrast painting, and the horizon — the one line the shot
            is about — was disappearing into the overcast. */}
        <div style={{ position: "absolute", inset: 0, filter: "contrast(1.14)" }}>
          <PaintedSky
            bg="bay_grey"
            phase={11.2}
            drift={BAY.drift}
            dx={BAY.dx}
            dy={bayDy(BAY_GREY_FRAC)}
            zoom={BAY.zoom}
          />
        </div>
      </div>
      {/* The desert, wiping across and wiping back off under the grey day. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${Math.max(0, (1 - Math.max(0, Math.min(1, wipe))) * 100)}% 0 0)`,
          opacity: 1 - Math.max(0, Math.min(1, grey)),
        }}
      >
        <PaintedSky bg="desert_day" phase={11.9} drift={BAY.drift} dy={-40} zoom={1.12} />
      </div>

      <SeaArrows up={Math.max(0, Math.min(1, arrowUp))} down={Math.max(0, Math.min(1, arrowDown))} />

      <Ray
        x={rayMark.x}
        y={rayMark.y}
        scale={S15_RAY.scale}
        brightness={RAY_LIGHT.afterRainbow}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion="happy"
        speaking={stage.speaking("ray")}
        look={frame >= beatFrom ? { x: 0.55, y: 0.35 } : { x: 0.3, y: 0.6 }}
        // Nothing enters the myth-bust beat, and that includes him: he is on
        // screen for the whole scene, still, while the stamp does the work.
        idle={frame >= beatFrom && frame < desertFrom ? 0.5 : 1}
        streak={0.25}
        zIndex={20}
      />

      {/* Indigo under and behind Blue, arriving four frames late and leaving
          the same way. He is smaller and fainter for the Scene 19 reason: two
          adjacent hues at the same size are one lilac smudge with two faces. */}
      {echo > 0.01 ? (
        <Shard
          who="indigo"
          x={indigoMark.x}
          y={indigoMark.y}
          scale={S15_INDIGO_SCALE}
          heading={indigo.angle}
          emotion="happy"
          speaking={stage.speaking("indigo")}
          look={{ x: -0.4, y: -0.2 }}
          opacity={echo * 0.85}
          zIndex={21}
        />
      ) : null}
      {visit > 0.01 ? (
        <Shard
          who="blue"
          x={blueMark.x}
          y={blueMark.y}
          scale={S15_BLUE_SCALE}
          heading={blue.angle}
          emotion="excited"
          speaking={stage.speaking("blue")}
          // Down at the water for "Twins!", and round at the copy of himself for
          // the held beat after it — "Blue looks at Indigo. Blue decides to be
          // pleased."
          look={frame >= echoFrom ? { x: -0.7, y: 0.25 } : { x: -0.2, y: 0.7 }}
          opacity={visit}
          zIndex={22}
        />
      ) : null}

      <CutFlash at={stampAt} strength={0.3} />
      {/* It leaves on the wipe. A stamp still sitting on the desert — and then
          on the grey bay — turns two counter-examples into one long caption. */}
      <MythStamp at={stampAt} until={desertFrom + 4} x={1096} y={412} />

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark, blue: blueMark, indigo: indigoMark } as Cast}
        text={S15_BUBBLES}
        at={{
          // Both of Blue's go in the same place: he is in the same cupboard
          // saying the same kind of thing, twenty seconds apart.
          //
          // **High, and that is the pedagogy rather than a preference.** At
          // y=470 the bubble sat on the big "?" at (1108, 596) — the drawn half
          // of the myth this scene exists to bust (`RaySkyBlue_010930`, before).
          // The arrows and their question mark own the middle of this frame from
          // the first frame to the last, so a visiting character's bubble goes
          // above them or it is deleting the diagram.
          a2_04b_blue: { x: 1300, y: 300, tail: "left", tailAt: blueAt.x },
          a2_09b_blue: { x: 1300, y: 300, tail: "left", tailAt: blueAt.x },
          // Indigo's is lower — under Blue's and clear of the down arrow, which
          // runs the height of the frame at x≈940..1010.
          a2_09c_indigo: { x: 1330, y: 560, tail: "left", tailAt: indigoAt.x },
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * The two arrows, and the whole pedagogy of the scene in one shape.
 *
 * Up (with a question mark on it): the thing everybody believes — the sea
 * colours the sky. Down: what actually happens. They are the same arrow drawn
 * the other way round on purpose.
 */
const SeaArrows: React.FC<{ up: number; down: number }> = ({ up, down }) => (
  <>
    <WideLayer zIndex={14}>
      {up > 0.01 ? (
        <g opacity={up}>
          <path
            d="M 940 900 Q 1010 700 966 420"
            stroke={kidTheme.paper}
            strokeWidth={38}
            strokeLinecap="round"
            fill="none"
            opacity={0.85}
          />
          <path
            d={`M 940 900 Q 1010 700 966 ${420 + (1 - up) * 300}`}
            stroke={kidTheme.ink}
            strokeWidth={22}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M 966 ${396 + (1 - up) * 300} l -44 60 l 84 4 Z`}
            fill={kidTheme.ink}
          />
        </g>
      ) : null}
      {down > 0.01 ? (
        <g opacity={down}>
          <path
            d="M 966 380 Q 1010 640 940 878"
            stroke={kidTheme.paper}
            strokeWidth={38}
            strokeLinecap="round"
            fill="none"
            opacity={0.85}
          />
          <path
            d={`M 966 380 Q 1010 640 940 ${878 - (1 - down) * 300}`}
            stroke={kidTheme.ink}
            strokeWidth={22}
            strokeLinecap="round"
            fill="none"
          />
          <path d={`M 940 ${902 - (1 - down) * 300} l -46 -56 l 84 -10 Z`} fill={kidTheme.ink} />
        </g>
      ) : null}
    </WideLayer>
    {up > 0.2 ? (
      <div
        style={{
          position: "absolute",
          left: 1108,
          top: 596,
          transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * up}) rotate(${-8 + (1 - up) * 14}deg)`,
          fontFamily: kidTheme.fontFamily,
          fontSize: 150,
          fontWeight: 900,
          color: kidTheme.ink,
          textShadow: kidOutline(7),
          opacity: up,
          zIndex: 15,
        }}
      >
        ?
      </div>
    ) : null}
  </>
);

/**
 * The MYTH stamp — episode one's, second firing in the series, and the house
 * beat for a wrong answer being put down.
 *
 * It thuds on at 3× and cracks half a beat later: the crack is two copies of
 * the same card behind complementary jagged clip-paths, so the halves separate
 * along a line that was never drawn twice. Redrawn here rather than imported
 * because it lives in that episode's scene file; if a third episode wants it,
 * that is the point at which it is promoted to `src/lib/kid/`.
 */
const MythStamp: React.FC<{ at: number; until: number; x: number; y: number }> = ({
  at,
  until,
  x,
  y,
}) => {
  const frame = useCurrentFrame();
  const u = frame - at;
  if (u < 0) return null;
  const land = 3.2 + (1 - 3.2) * kidEase.easeOutCubic(u / 9);
  const out = kidEase.easeInOutSine((frame - until) / 10);
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
        background: "rgba(255,253,247,0.92)",
        textAlign: "center",
        boxShadow: kidShadow(1.1),
      }}
    >
      <div
        style={{
          border: `7px solid ${kidTheme.tomato}`,
          borderRadius: kidRadius.chip,
          padding: "8px 30px",
        }}
      >
        <div style={{ fontSize: 116, fontWeight: 900, color: kidTheme.tomato, lineHeight: 1 }}>
          MYTH
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, color: kidTheme.tomato, letterSpacing: 8 }}>
          BUSTED
        </div>
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
        zIndex: 55,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      {halves.map((half, i) => (
        <div
          key={half.clip}
          style={{
            // The first half is in flow and gives the wrapper its size; the
            // second is laid over it. Both are always mounted, so the crack is
            // two halves separating rather than a card being replaced.
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

// ---------------------------------------------------------------------------
// Scene 16 — Myth-bust two: show us the paint
// ---------------------------------------------------------------------------

/**
 * **NO PROPS AT ALL** (T3, Mike's tweak-round note 3, 2026-08-04).
 *
 * Mike: "the 'Sunny show us the paint' line seems weird that it shows us the
 * paint and then he says he keeps it somewhere else — let's just get rid of the
 * paint box from that scene (it's fine at the beginning though)."
 *
 * He is exactly right and the note is a structural one, not a dressing one:
 * **a man who shows you the tray has answered the question.** The scene then
 * spends its next line having him refuse to answer it, and a six-year-old has
 * no way to reconcile the two. Taking the tray out turns "I keep the paint
 * somewhere else." into what it was always written as — an unsupported claim,
 * a dodge, the joke — and there is nothing on screen arguing with it.
 *
 * So the scene is now **one character and one silence**. The 45f held beat is
 * unchanged in length and position; what carries it is his face (see
 * `MythPaintScene`). Deleted with the tray: `S16_TRAY`, the tip and back eases,
 * and the `PaintTray` component itself, which had no other call site. The
 * roller it contained went with it and is untouched everywhere else — the cold
 * open's wet one (coldOpen.tsx) and Scene 23's dry one both stand, which is
 * Mike's "it's fine at the beginning though".
 *
 * The previous version of this note is worth keeping in one line, because it is
 * still the rule: the revision cut this scene from five props and two ideas
 * down to one prop and one idea. T3 takes it to nought and one.
 */
const S16_SUNNY: Mark = { x: 1452, y: hover("sunny", 402, 0.92), scale: 0.92, who: "sunny", side: "left" };

/**
 * The look away, inside the beat.
 *
 * With the tray gone the 45 frames have exactly one thing in them, and it has
 * to be small enough not to become a second joke: twelve frames off to the
 * side, twelve frames back, ending well before `a2_12_sunny` so that the
 * excited -> neutral -> proud morph the scene already ran still does the
 * landing. It is the oldest tell there is — a man asked for evidence looks
 * somewhere else — and it costs one prop and no frames.
 */
const S16_LOOK_AWAY = { at: 14, out: 12, back: 12 } as const;

const S16_BUBBLES: Record<string, string> = {
  // A summary of "It was PAINT! Blue paint! I painted the whole sky!" — the
  // third claim, which is the one with the sky in it.
  a2_10_sunny: "I painted the whole sky!",
  a2_12_sunny: "I keep it somewhere else.",
};

/**
 * Scene 16 — an empty sky, one Sun, and nothing else at all.
 *
 * The beat is the whole scene: forty-five frames of a man who has been asked to
 * produce the paint, and does not. **Since T3 there is no tray** (see
 * `S16_SUNNY`), so the only thing staged inside the silence is his face — the
 * grin freezing on the request, a small look away and back, and then the
 * existing excited -> neutral -> proud morph riding into the line. His face does
 * not begin to fall until ten frames *into* the beat, which is the emotion-lead
 * rule made literal: a reaction that starts under the Narrator's question is the
 * joke being answered before it is asked.
 */
const MythPaintScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [proudFrom] = lineWindow(scene, "a2_10_sunny");
  const [beatFrom, beatTo] = heldBeat(scene, "a2_11_narrator");
  const [recoverFrom] = lineWindow(scene, "a2_12_sunny");

  // The look away, and back. 0 at both ends of it, so the beat opens and closes
  // on the same eye-line and nothing is left hanging. See `S16_LOOK_AWAY`.
  const awayFrom = beatFrom + S16_LOOK_AWAY.at;
  const away =
    frame < awayFrom
      ? 0
      : frame < awayFrom + S16_LOOK_AWAY.out
        ? kidEase.easeInOutSine((frame - awayFrom) / S16_LOOK_AWAY.out)
        : 1 -
          clamp01(
            kidEase.easeInOutSine(
              (frame - (awayFrom + S16_LOOK_AWAY.out)) / S16_LOOK_AWAY.back,
            ),
          );

  // His face goes in the silence, so there is no line to hang it on.
  const sunnyEmotion = emotionAt(
    frame,
    [
      { at: proudFrom, emotion: "excited" },
      { at: beatFrom + 10, emotion: "neutral" },
      { at: recoverFrom, emotion: "proud" },
    ],
    "proud",
    9,
  );
  const stage = useStage(scene);

  return (
    <AbsoluteFill>
      <PaintedSky bg="sky_dome_day" phase={12.3} drift={9} />

      <Sunny
        x={S16_SUNNY.x}
        y={S16_SUNNY.y}
        scale={0.92}
        phase={PHASE.sunny}
        emotion={sunnyEmotion}
        speaking={stage.speaking("sunny")}
        // Down the lens for the claim, and then **off to the side and back**
        // inside the beat: with the tray gone there is nothing in the frame for
        // him to look at, and a man looking at nothing while he is asked for
        // evidence is the whole picture. He is back on the lens before he
        // answers, which is what makes the answer brazen rather than shifty.
        look={{ x: -0.55 - 0.4 * away, y: 0.25 + 0.15 * away }}
        // Nothing else moves in the beat. His breath drops to almost nothing:
        // deadpan is stillness. `eyeLife` stays up, because the look away is
        // deliberate and a dead eye cannot perform it.
        idle={frame >= beatFrom && frame < beatTo ? 0.35 : 1}
        raySpeed={frame >= beatFrom && frame < beatTo ? 0.04 : 0.16}
        enter={{ at: 0, kind: "slideRight" }}
        zIndex={18}
      />

      <Bubbles
        scene={scene}
        cast={{ sunny: S16_SUNNY } as Cast}
        text={S16_BUBBLES}
        at={{
          a2_10_sunny: { x: 640, y: 226, tail: "right", tailAt: 1290 },
          a2_12_sunny: { x: 620, y: 226, tail: "right", tailAt: 1290 },
        }}
      />
    </AbsoluteFill>
  );
};

/** 0..1, the shape half this file's easings want around them. */
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

// `PaintTray` IS DELETED (T3, 2026-08-04). It lived here and was drawn in
// Scene 16 and nowhere else; Mike's note took the prop out of that scene, so
// the component went with it rather than sitting in the file as an unreferenced
// three hundred lines. The roller it used to hold is `PaintRoller`, which is
// alive and well: the cold open loads it wet and Scene 23 still holds it dry.

// ---------------------------------------------------------------------------
// Scene 17 — The sky is not empty
// ---------------------------------------------------------------------------

/**
 * The crowd, as a field of depths.
 *
 * Every blob has an angle, a distance from the middle of the frame and a depth,
 * and the dive scales the distance and the size by the depth — so a push in
 * turns one empty blue frame into a churning crowd packed the whole depth of
 * it, exactly as episode two's cloud interior resolved into drops. Fixed
 * length, sorted far-to-near once at module scope: a list that changes length
 * on a frame boundary is a hook-count change waiting to happen, and the sort
 * is what makes the crowd read as depth rather than as confetti.
 */
const CROWD_N = 120;
const CROWD = Array.from({ length: CROWD_N }, (_, i) => {
  // **A sunflower, not a modulo.** The first pass took the angle from
  // `(i * 41 * 137) % 628`, and a still of it showed the crowd standing in
  // radial chains: that expression only visits a handful of distinct angles, so
  // dozens of blobs shared a spoke and differed only in distance. The golden
  // angle with a sqrt radius fills a disc evenly by construction, and the
  // depths are still hashed so no two neighbours are the same size.
  const k = i * 37 + 11;
  return {
    angle: i * 2.39996,
    rho: Math.sqrt((i + 0.6) / CROWD_N) * (0.9 + ((k * 13) % 20) / 100),
    depth: 0.16 + ((k * 53) % 100) / 122,
    seed: ((k * 29) % 100) / 12,
  };
}).sort((a, b) => a.depth - b.depth);

const S17_RAY = { x: 1290, y: 456, scale: 0.78 };
const S17_PUFF = { x: 706, y: 616, scale: 1.06 };

const S17_BUBBLES: Record<string, string> = {
  a2_15_ray: "There is nothing up there.",
  // The catchphrase, and the one firing it gets in this episode.
  a2_17_puff: "But you can FEEL me!",
  a2_19_ray: "There are more of you?",
  a2_20_puff: "ZILLIONS of us!",
  // --- the race's fuse, lit ten scenes early (revision2) ---------------------
  a2_20b_blue: "I got here FIRST!",
  a2_20c_indigo: "Got here first.",
};

/**
 * **Blue comes out of the crowd, and "deep" is a scale rather than a position.**
 *
 * `AirCrowd` is a field of depths pushed out from the lens at (960, 540): the
 * far blobs are small and near the middle, the near ones are big and out at the
 * edges. So a character *inside* it is one who starts small at the middle and
 * gets bigger on his way out, which is what these two pairs of numbers are. He
 * has evidently been in there for some time — the crowd does not react, because
 * as far as the crowd is concerned nothing has happened.
 *
 * Indigo comes from **shallower**: a bigger start, a shorter trip. He is still
 * drawn smaller than Blue at the end of it, because he is still the faded copy
 * and that rule outranks the depth.
 */
const S17_LENS = { x: 960, y: 540 } as const;
const S17_BLUE_BOX: Box = { x: 860, y: 730, w: 420, h: 210 };
const S17_BLUE_DEEP = 0.1;
const S17_BLUE_SCALE = 0.72;
/**
 * Indigo's anchor, as an offset off Blue's own echoed path.
 *
 * Down and to the RIGHT, which is the one direction available: Puff owns
 * x 540..870 / y 436..796 at 40% opacity and a first pass at (−230, −110) put
 * Indigo in his lap (`RaySkyBlue_012955`, before). Under Blue is the canon
 * ("drawn behind and 26px under"); which side of him is the frame's call.
 */
const S17_INDIGO_OFF = { x: 180, y: 90 } as const;
const S17_INDIGO_DEEP = 0.26;
const S17_INDIGO_SCALE = 0.5;

const NotEmptyScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [diveFrom, diveTo] = lineWindow(scene, "a2_16_narrator");
  const [puffFrom] = lineWindow(scene, "a2_17_puff");

  // The dive *into* the empty air. It starts on "It is not empty" and lands on
  // "It is full of air", so the crowd is already there when the sentence ends.
  const dive = kidEase.easeInOutSine((frame - diveFrom) / Math.max(1, (diveTo - diveFrom) * 0.86));
  const t = frame / fps;

  const stage = useStage(scene);
  const rayEmotion = useEmotion(scene, "ray", { a2_19_ray: "amazed" }, "happy");
  const puffEmotion = useEmotion(scene, "puff", { a2_20_puff: "excited" }, "happy");

  // --- Blue's WANT, planted in the crowd he will spend the race bouncing off --
  const [blueFrom] = lineWindow(scene, "a2_20b_blue");
  const [echoFrom] = lineWindow(scene, "a2_20c_indigo");
  const [sumFrom, sumTo] = heldBeat(scene, "a2_20c_indigo");
  const blue = blueRicochet(frame, S17_BLUE_BOX, 44.3);
  const indigo = indigoEcho((f: number) => blueRicochet(f, S17_BLUE_BOX, 44.3), frame);
  // Out of the crowd on their own lines, and back into it under `a2_21` — the
  // Narrator's line closes over them exactly as if nothing had happened.
  const sinkAt = sumTo + 24;
  const outOf = (from: number, lead: number): number =>
    clamp01((frame - (from - lead)) / lead) * (1 - clamp01((frame - sinkAt) / 34));
  const blueOut = outOf(blueFrom, 26);
  const indigoOut = outOf(echoFrom, 20);
  const surface = (
    p: { x: number; y: number },
    u: number,
    off: { x: number; y: number },
  ): { x: number; y: number } => ({
    x: S17_LENS.x + (p.x + off.x - S17_LENS.x) * u,
    y: S17_LENS.y + (p.y + off.y - S17_LENS.y) * u,
  });
  const blueAt = surface(blue, blueOut, { x: 0, y: 0 });
  const indigoAt = surface(indigo, indigoOut, S17_INDIGO_OFF);
  const blueScale = S17_BLUE_DEEP + (S17_BLUE_SCALE - S17_BLUE_DEEP) * blueOut;
  const indigoScale = S17_INDIGO_DEEP + (S17_INDIGO_SCALE - S17_INDIGO_DEEP) * indigoOut;
  // **The 16f beat: he does the arithmetic on being copied, and lets it go.**
  // Nothing else enters it — the crowd churns because the crowd always churns.
  const blueFace = emotionAt(
    frame,
    [
      { at: sumFrom, emotion: "grumpy", frames: 6 },
      { at: sumFrom + 11, emotion: "happy", frames: 8 },
    ],
    "excited",
  );
  const blueMark: Mark = {
    x: blueAt.x,
    y: hover("shard", blueAt.y, blueScale),
    scale: blueScale,
    who: "shard",
  };
  const indigoMark: Mark = {
    x: indigoAt.x,
    y: hover("shard", indigoAt.y, indigoScale),
    scale: indigoScale,
    who: "shard",
  };

  const rayMark: Mark = {
    x: S17_RAY.x,
    y: hover("ray", S17_RAY.y, S17_RAY.scale),
    scale: S17_RAY.scale,
    who: "ray",
    side: "left",
  };
  const puffMark: Mark = {
    x: S17_PUFF.x,
    y: hover("puff", S17_PUFF.y, S17_PUFF.scale),
    scale: S17_PUFF.scale,
    who: "puff",
    side: "left",
  };

  return (
    <AbsoluteFill>
      {/* The plate pushes in with the dive, so the sky itself is what the shot
          is travelling into rather than a backdrop behind a growing crowd. */}
      <PaintedSky bg="sky_dome_day" phase={13.4} drift={10} zoom={1 + dive * 0.16} />
      <AirCrowd dive={dive} t={t} />

      {/* In front of the crowd and behind Puff and Ray, which is what "out of
          the crowd" means when the crowd is a depth field. */}
      {indigoOut > 0.02 ? (
        <Shard
          who="indigo"
          x={indigoMark.x}
          y={indigoMark.y}
          scale={indigoScale}
          heading={indigo.angle}
          emotion="happy"
          speaking={stage.speaking("indigo")}
          look={{ x: 0.4, y: -0.1 }}
          opacity={Math.min(1, indigoOut * 1.6) * 0.85}
          zIndex={19}
        />
      ) : null}
      {blueOut > 0.02 ? (
        <Shard
          who="blue"
          x={blueMark.x}
          y={blueMark.y}
          scale={blueScale}
          heading={blue.angle}
          emotion={blueFace}
          speaking={stage.speaking("blue")}
          // Round at the copy for the beat, and back to the crowd after it.
          look={frame >= echoFrom && frame < sumTo ? { x: 0.75, y: 0.4 } : "camera"}
          opacity={Math.min(1, blueOut * 1.6)}
          zIndex={20}
        />
      ) : null}

      <Puff
        x={S17_PUFF.x}
        y={puffMark.y}
        scale={S17_PUFF.scale}
        opacity={PUFF_GHOST * Math.max(0, Math.min(1, (frame - puffFrom + 16) / 14))}
        phase={PHASE.puff}
        emotion={puffEmotion}
        speaking={stage.speaking("puff")}
        look={{ x: 0.8, y: -0.15 }}
        pose={stage.speaking("puff") ? "wave" : "rest"}
        wave={0.85}
        zIndex={26}
      />

      <Ray
        x={S17_RAY.x}
        y={rayMark.y}
        scale={S17_RAY.scale}
        brightness={RAY_LIGHT.afterRainbow}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        look={frame >= puffFrom ? { x: -0.85, y: 0.25 } : { x: -0.2, y: -0.4 }}
        streak={0.3}
        zIndex={28}
      />

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark, puff: puffMark, blue: blueMark, indigo: indigoMark } as Cast}
        text={S17_BUBBLES}
        at={{
          a2_15_ray: { x: 1320, y: 190, tail: "left", tailAt: 1290 },
          a2_19_ray: { x: 1320, y: 190, tail: "left", tailAt: 1290 },
          a2_17_puff: { x: 620, y: 226, tail: "right", tailAt: 706 },
          a2_20_puff: { x: 620, y: 226, tail: "right", tailAt: 706 },
          // Top centre: the one strip of this frame that is neither Ray's
          // corner (his body runs y 285..628 at x 1165..1415) nor Puff's, and
          // the tail reaches down across the crowd to wherever Blue surfaced.
          a2_20b_blue: { x: 960, y: 230, tail: "left", tailAt: blueAt.x },
          // Indigo's sits under Ray's corner and over his own body, which is the
          // only strip of the right-hand side neither Ray nor Blue is using.
          a2_20c_indigo: { x: 1330, y: 700, tail: "left", tailAt: indigoAt.x },
        }}
      />
    </AbsoluteFill>
  );
};

/** The crowd of faint outlined puffs the empty sky turns out to be. */
const AirCrowd: React.FC<{ dive: number; t: number }> = ({ dive, t }) => (
  <WideLayer zIndex={12}>
    {CROWD.map((b, i) => {
      // Churn: every blob turns and breathes on its own clock, so the field is
      // never still and never a pattern.
      const a = b.angle + Math.sin(t * 0.32 + b.seed) * 0.12;
      const rho = b.rho * (1 + Math.sin(t * 0.44 + b.seed * 1.7) * 0.05);
      const x = 960 + Math.cos(a) * rho * (300 + 1280 * dive * b.depth);
      const y = 540 + Math.sin(a) * rho * (230 + 880 * dive * b.depth);
      // Size and alpha both ride the depth hard. Evenly sized blobs at even
      // alpha tile the frame like cracked ice; a real crowd is a few big ones
      // near the lens and a haze of small ones behind them.
      const r = (7 + 78 * b.depth ** 1.7) * (0.22 + 1.25 * dive);
      const o = Math.max(0, Math.min(1, dive * 1.7 - 0.12)) * (0.2 + 0.55 * b.depth ** 1.3);
      if (o <= 0.01) return null;
      return (
        <AirBlob
          key={i}
          x={x}
          y={y}
          r={r}
          t={t + b.seed}
          seed={b.seed}
          opacity={o}
          // Twenty samples, not fourteen. `airBlobPath`'s three lobe
          // frequencies add up to a ±26% wobble, and at fourteen samples a
          // small blob comes out as a torn-paper polygon — a still of the crowd
          // looked like broken ice rather than like vapour.
          points={20}
        />
      );
    })}
  </WideLayer>
);

// ---------------------------------------------------------------------------
// Scenes 18, 19 and 21 — the corridor
// ---------------------------------------------------------------------------

/**
 * The cross-section of the air, shared by three scenes.
 *
 * Scene 18 sends Red and Orange through it, Scene 19 sends Blue and Indigo
 * through the *same* corridor with the *same* puffs, and Scene 21 freezes it
 * behind the Big Word. That is the comparison, so it has to be one component
 * with one set of numbers: two hand-placed ball pits that differed by thirty
 * pixels would quietly turn a controlled experiment into two pictures.
 */
const CORRIDOR = { top: 236, bottom: 916, x0: -200, x1: 2120 } as const;

/**
 * **The box Blue ricochets in**, and the thing the ball pit is built out of.
 *
 * Inset from the corridor walls by about a body so a corner never lands with
 * half of him outside the diagram, and 1620×532 so that `blueRicochet`'s legs
 * come out at their full 150–330px (the kit clamps a leg to 85% of the box's
 * shorter side, and a tight box gives a Blue who twitches instead of
 * ricocheting — the note on `BLUE_LEG_PX` is about exactly this scene).
 */
const S19_BOX: Box = { x: 150, y: 310, w: 1620, h: 532 };

/**
 * **The seed, and it was chosen rather than typed.**
 *
 * `blueRicochet` is a real billiard rather than a scatter of points, which means
 * a seed can quite legitimately spend forty bounces in one third of the frame —
 * two of the seeds tried here did. Scene 19's whole picture is "the whole frame
 * criss-crossed", Scene 18 needs puffs across the full width for Red to plough
 * through, and Blue's three corner bubbles need him in three genuinely different
 * places on three named frames. So the seed was searched for, against those
 * three requirements, and it is written down with them:
 *
 *   coverage   every cell of a 6×3 grid over the box is visited inside sixty
 *              bounces (the only seed in a thousand that did);
 *   spread     on the three clause frames of `a2_28b_blue` he is at (1520,813),
 *              (1064,654) and (584,530) — bottom right, middle, upper left, a
 *              sweep across the frame rather than three pokes at one corner;
 *   legs       152..323px at nine frames each, so Indigo four frames behind is
 *              typically ~107px behind — visibly a follower rather than a
 *              second head on the same body.
 *
 * **If any Act Two clip before `a2_28b_blue` changes length, re-run that search**
 * (the three clause frames move with the audio) and re-check the corner
 * assignment below. The numbers in this paragraph are the acceptance test.
 */
const S19_SEED = 80.41;

/** Blue's path in the corridor, as a pure function of frames since he entered. */
function bluePath(age: number): { x: number; y: number; angle: number } {
  return blueRicochet(Math.max(0, age), S19_BOX, S19_SEED);
}

/** The k-th corner of that path: `blueRicochet` on a leg boundary *is* a corner. */
function blueCornerAt(k: number): { x: number; y: number } {
  return bluePath(k * BLUE_LEG);
}

/**
 * **The ball pit, and it is Blue's own corner list.**
 *
 * Every third corner of his path gets a puff on it, which makes "he hits puffs"
 * true by construction rather than by eye: the thing he bounces off is standing
 * where he bounces. Hand-placing them was the old way and it could not survive
 * Blue moving onto the kit's ricochet — the puffs and the path would have been
 * two independent drawings of the same event.
 *
 * Every third rather than every one because at every corner they merge into a
 * wall: the legs are 150–330px and the blobs are 34–60px, so a puff per corner
 * is a chain. Every third leaves air between them and still puts one at a
 * bounce three times a second.
 *
 * The eight fillers are pressed up under the two walls, where the path never
 * goes (the box is inset), so the corridor reads as full to its edges rather
 * than as a band of blobs with an empty margin.
 */
const PUFFS = [
  ...Array.from({ length: 34 }, (_, i) => {
    const p = blueCornerAt(1 + i * 3);
    return { x: p.x, y: p.y, r: 34 + ((i * 23) % 26), seed: i * 1.7 };
  }),
  ...Array.from({ length: 8 }, (_, i) => {
    const k = i * 43 + 11;
    return {
      x: -40 + ((k * 137) % 2020),
      y:
        i % 2 === 0
          ? CORRIDOR.top + 28 + ((k * 17) % 44)
          : CORRIDOR.bottom - 96 + ((k * 19) % 42),
      r: 28 + ((k * 23) % 20),
      seed: 3.1 + i * 2.3,
    };
  }),
];

const Corridor: React.FC<{
  t: number;
  puffDim?: number;
  /** Where Blue just hit, if he did. The puff nearest it gets knocked. */
  hit?: { x: number; y: number };
}> = ({ t, puffDim = 1, hit }) => (
  <>
    <WideLayer zIndex={4}>
      {/* The corridor walls, in crayon. Long, straight and unexciting: this is
          a cross-section of ordinary air and it is not the thing to look at. */}
      <path
        d={`M ${CORRIDOR.x0} ${CORRIDOR.top} L ${CORRIDOR.x1} ${CORRIDOR.top}`}
        stroke={kidTheme.airEdge}
        strokeWidth={12}
        strokeLinecap="round"
        opacity={0.75}
      />
      <path
        d={`M ${CORRIDOR.x0} ${CORRIDOR.bottom} L ${CORRIDOR.x1} ${CORRIDOR.bottom}`}
        stroke={kidTheme.airEdge}
        strokeWidth={12}
        strokeLinecap="round"
        opacity={0.75}
      />
      <rect
        x={CORRIDOR.x0}
        y={CORRIDOR.top}
        width={CORRIDOR.x1 - CORRIDOR.x0}
        height={CORRIDOR.bottom - CORRIDOR.top}
        fill={kidTheme.air}
        opacity={0.24}
      />
    </WideLayer>
    <WideLayer zIndex={8}>
      {PUFFS.map((p, i) => {
        // The crowd bats him about: whichever puff he just hit is shoved away
        // from the impact and swells. It is the only thing the ball pit does,
        // and it is what turns a field of decorations into participants.
        const d = hit ? Math.max(1, Math.hypot(p.x - hit.x, p.y - hit.y)) : 1e9;
        const k = Math.max(0, 1 - d / 160);
        const away = hit ? { x: (p.x - hit.x) / d, y: (p.y - hit.y) / d } : { x: 0, y: 0 };
        return (
          <AirBlob
            key={i}
            x={p.x + Math.sin(t * 0.5 + p.seed) * 7 + away.x * k * 18}
            y={p.y + Math.cos(t * 0.42 + p.seed * 1.3) * 6 + away.y * k * 18}
            r={p.r * (1 + k * 0.22)}
            t={t + p.seed}
            seed={p.seed}
            opacity={(0.5 + k * 0.3) * puffDim}
            points={20}
          />
        );
      })}
    </WideLayer>
  </>
);

/** The pale diagram bed all three corridor scenes sit on. */
const CorridorBed: React.FC<{ phase: number }> = ({ phase }) => (
  <div style={{ position: "absolute", inset: 0, opacity: 0.34, filter: "saturate(0.7)" }}>
    <PaintedSky bg="sky_dome_day" phase={phase} drift={7} />
  </div>
);

/**
 * **One leg of a ricochet, as TWO offset lines.**
 *
 * revision §11's third risk, in one function: *a motion trail on a round body
 * has to be two lines or it is a tadpole*. One stroke behind a blob is a tail
 * growing out of an animal; two strokes either side of where the blob went are
 * the marks a thing leaves in the air, and the gap between them is what says
 * "this was moving" rather than "this is attached".
 *
 * The offset is perpendicular to the leg, so the pair opens out along the
 * direction of travel and pinches to nothing at a corner — which is where Blue's
 * whole characterisation lives.
 */
function twinLeg(
  a: { x: number; y: number },
  b: { x: number; y: number },
  off: number,
): [string, string] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.max(1e-3, Math.hypot(dx, dy));
  const nx = (-dy / len) * off;
  const ny = (dx / len) * off;
  return [
    `M ${(a.x + nx).toFixed(1)} ${(a.y + ny).toFixed(1)} L ${(b.x + nx).toFixed(1)} ${(b.y + ny).toFixed(1)}`,
    `M ${(a.x - nx).toFixed(1)} ${(a.y - ny).toFixed(1)} L ${(b.x - nx).toFixed(1)} ${(b.y - ny).toFixed(1)}`,
  ];
}

/**
 * **Every leg Blue has flown, still on screen — the criss-cross.**
 *
 * `keep` is how many legs back the mesh reaches, and it is a *ramp* rather than
 * a constant: the scene opens it at three and walks it up to thirty-two across the
 * run-up and the sacred forty-five, so the frame is visibly filling for the
 * whole of the silence and is at its fullest on the beat's last frame. A fixed
 * window would have reached its steady state five seconds before the beat and
 * the silence would have had nothing to build.
 *
 * Older legs fade but never go while they are in the window, because the picture
 * the Big Word freezes is the whole mesh.
 */
const BlueMesh: React.FC<{ age: number; keep: number; opacity?: number }> = ({
  age,
  keep,
  opacity = 1,
}) => {
  const legIndex = Math.floor(Math.max(0, age) / BLUE_LEG);
  const first = Math.max(0, legIndex - keep);
  const now = bluePath(age);
  return (
    <WideLayer zIndex={12}>
      {Array.from({ length: legIndex - first + 1 }, (_, n) => {
        const i = first + n;
        const a = blueCornerAt(i);
        const b = i < legIndex ? blueCornerAt(i + 1) : now;
        const recency = keep <= 0 ? 1 : (i - first) / keep;
        const [one, two] = twinLeg(a, b, 6);
        return (
          <g key={i} opacity={(0.1 + 0.46 * recency) * opacity}>
            <path d={one} stroke={SPECTRUM[4].fill} strokeWidth={7} strokeLinecap="round" />
            <path d={two} stroke={SPECTRUM[4].fill} strokeWidth={7} strokeLinecap="round" />
          </g>
        );
      })}
    </WideLayer>
  );
};

/**
 * Blue arriving everywhere else — what every puff he touches sends off sideways.
 *
 * They are dots rather than characters on purpose: fifteen more faces would turn
 * the mechanism into a party. Each one **loops** off its own puff rather than
 * flying away once, so the frame keeps filling for as long as the silence lasts
 * instead of emptying two seconds in. **Nothing has been taken from Blue** — he
 * is still bouncing, and these are the copies of him arriving everywhere else.
 */
const SPRAY_LOOP = 2.4;

const SPRAY = Array.from({ length: 15 }, (_, i) => {
  const k = i * 37 + 5;
  return {
    from: (i * 7 + 3) % 34,
    angle: ((k * 97) % 628) / 100,
    speed: 640 + ((k * 53) % 420),
    born: 0.18 + ((k * 29) % 70) / 100,
    r: 13 + ((k * 17) % 9),
  };
});

const BlueSpray: React.FC<{ u: number; span: number }> = ({ u, span }) => (
  <WideLayer zIndex={13}>
    {SPRAY.map((s, i) => {
      const age = (u - s.born) * span;
      if (age <= 0) return null;
      const p = (age % SPRAY_LOOP) / SPRAY_LOOP;
      const from = PUFFS[s.from];
      const d = 50 + p * s.speed * SPRAY_LOOP * 0.6;
      const x = from.x + Math.cos(s.angle) * d;
      const y = from.y + Math.sin(s.angle) * d;
      const tail = Math.min(d, 190);
      const fade = Math.sin(Math.PI * Math.min(1, p * 1.25));
      const [one, two] = twinLeg(
        { x: x - Math.cos(s.angle) * tail, y: y - Math.sin(s.angle) * tail },
        { x, y },
        5,
      );
      return (
        <g key={i} opacity={0.85 * fade}>
          <path d={one} stroke={SPECTRUM[4].fill} strokeWidth={7} strokeLinecap="round" opacity={0.45} />
          <path d={two} stroke={SPECTRUM[4].fill} strokeWidth={7} strokeLinecap="round" opacity={0.45} />
          <circle cx={x} cy={y} r={s.r} fill={SPECTRUM[4].fill} />
          <circle cx={x - s.r * 0.3} cy={y - s.r * 0.35} r={s.r * 0.4} fill={SPECTRUM[4].light} />
        </g>
      );
    })}
  </WideLayer>
);

// ---------------------------------------------------------------------------
// Scene 18 — Red goes straight through
// ---------------------------------------------------------------------------

/**
 * Scene 18 — and it is staged **boring on purpose**.
 *
 * Red enters left, crosses the entire frame on one horizontal line at
 * `RED_SPEED` — the kit's one number for him, the same one he crosses the sunset
 * and the recap at — clips a dozen puffs without deviating by a pixel, and
 * leaves. Orange is one drawn body behind him the whole way and never overtakes.
 * There is no arc, no bank, no ease, no camera move and no acceleration, which
 * is what makes Scene 19 mean anything: a child who only ever sees the pinball
 * has watched a special effect instead of a comparison.
 *
 * **The scene is the crossing, and the arithmetic says so.** 108px/s across
 * ~2200px of frame-plus-margins is 620 frames, and the scene is 625: he is
 * walking on the first frame and still leaving on the last, and the five beats
 * in the middle are simply moments along one unvaried walk. Nothing in this
 * scene is timed to a beat — the beats happen to Red.
 */
const RED_Y = 612;

/**
 * Bigger than Scene 19's Blue (0.78), and that is the whole of "big and calm".
 * It is not a size *explanation* — the physics honesty note forbids that — it
 * is two bodies drawn at the sizes their temperaments read at.
 */
const S18_SHARD_SCALE = 1.1;

/**
 * Where Red is on frame zero: just off the left edge, already walking.
 *
 * "He is already walking" is his idle in the ensemble sheet, so he does not
 * *enter* on a cue — the scene opens on a corridor he is already crossing.
 */
const S18_RED_X0 = -160;

/**
 * **Orange's gap, and it is act three's rule rather than act three's number.**
 *
 * `s28c` follows Red at `SHARD_BODY * S28C_RED_SCALE`, where that scale is the
 * one the two bodies are *drawn* at — so the rule is "one drawn body-length",
 * and the 0.8 in that file is its scale, not a coefficient. Copying the 0.8
 * literally into a scene that draws them at 1.1 would put Orange 192px behind a
 * 264px body, i.e. overlapping him by a third, which is the two-headed-animal
 * still `SHARD_BODY`'s own doc warns about. The rule travels; the number does
 * not.
 */
const S18_FOLLOW = SHARD_BODY * S18_SHARD_SCALE;

/** Puff, down in the bottom of the corridor, on the mark Red walks over. */
const S18_PUFF = { x: 1334, y: 812, scale: 0.86 } as const;

const S18_BUBBLES: Record<string, string> = {
  a2_23b_red: "Straight through. Always have.",
  a2_24b_red: "Lovely air.",
  // --- the devotion engine gets its first two firings (revision2) ------------
  a2_23c_orange: "He does. I've seen him.",
  a2_24c_orange: "What Red said.",
  // …and the cheer format is planted on a DEPARTURE, ninety seconds before the
  // race fires it five times.
  a2_24d_yellow: "Great walking, Red!",
};

/**
 * **Yellow, at the frame edge, cheering a man who has already left.**
 *
 * `a2_24d_yellow` lands at local 709 and Red passes x=2392 at that frame — four
 * hundred pixels past the right edge, with Orange another body behind him. That
 * is not a staging problem to solve, it **is** the joke and it is the same one
 * act three's Yellow tells three more times: all of her cheers land on somebody
 * who has already gone. Red does not react. Obviously.
 *
 * She comes in from off the right edge under Orange's ladder firing and stays to
 * the cut, half out of frame, still waving.
 */
const S18_YELLOW = { x: 1840, y: 560, scale: 1, from: 2110 } as const;

const RedStraightScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = frame / fps;
  const redPath = (tt: number): { x: number; y: number; angle: number } =>
    redWalk(tt, { x: S18_RED_X0, y: RED_Y });
  const red = redPath(t);
  const orange = orangeFollow(redPath, t, S18_FOLLOW);

  // The frame Red's centre passes over Puff's, from Red's own speed rather than
  // from a beat: if a clip in front of this scene changes length the walk is
  // unchanged and so is the reach, because both are functions of the same
  // constant.
  const passAt = ((S18_PUFF.x - S18_RED_X0) / RED_SPEED) * fps;

  const stage = useStage(scene);

  const redMark: Mark = {
    x: red.x,
    y: hover("shard", RED_Y, S18_SHARD_SCALE),
    scale: S18_SHARD_SCALE,
    who: "shard",
  };
  const orangeMark: Mark = {
    x: orange.x,
    y: hover("shard", orange.y, S18_SHARD_SCALE),
    scale: S18_SHARD_SCALE,
    who: "shard",
  };

  // Orange looks at the man he is describing for the first of his two lines and
  // for nothing else — after that he is back to Red's own dead-ahead stare, one
  // body behind it. (Act three's s28b has him never once looking at Red; this is
  // the firing that earns that, so it gets the eye-line and the later ones do
  // not.)
  const [devoteFrom, devoteTo] = lineWindow(scene, "a2_23c_orange");
  const [cheerFrom] = lineWindow(scene, "a2_24d_yellow");
  const orangeLook =
    frame >= devoteFrom - 6 && frame < devoteTo + 8
      ? { x: 0.9, y: -0.1 }
      : { x: 0.7, y: 0 };

  // Yellow slides in from off the right edge and stays, waving.
  const arrive = clamp01((frame - (cheerFrom - 20)) / 20);
  const yellowMark: Mark = {
    x: S18_YELLOW.from + (S18_YELLOW.x - S18_YELLOW.from) * kidEase.easeOutCubic(arrive),
    y: hover("shard", S18_YELLOW.y, S18_YELLOW.scale),
    scale: S18_YELLOW.scale,
    who: "shard",
  };

  return (
    <AbsoluteFill style={{ background: "#eaf6ff" }}>
      <CorridorBed phase={14.5} />
      <Corridor t={t} />

      {/* The line he leaves behind him, and the reason it is still on screen
          under "Straight through. Barely touched the sides." — the evidence has
          to outlast the demonstration or the next scene has nothing to beat.

          **One line, and it stays one line.** Blue's trails are two offset
          strokes because a bouncing body needs the gap to read as motion; Red's
          is a single unbroken rule across the frame, and the difference between
          the two pictures is the difference between the two characters. */}
      <WideLayer zIndex={14}>
        <path
          d={`M ${S18_RED_X0} ${RED_Y} L ${red.x} ${RED_Y}`}
          stroke={SPECTRUM[0].fill}
          strokeWidth={13}
          strokeLinecap="round"
          opacity={0.4}
        />
      </WideLayer>

      <Shard
        who="red"
        x={red.x}
        y={redMark.y}
        scale={S18_SHARD_SCALE}
        heading={red.angle}
        emotion="happy"
        speaking={stage.speaking("red")}
        look={{ x: 0.7, y: 0 }}
        // He is not interested in any of this. `Shard` already damps his idle
        // to the table's 0.5; this is the scene asking for a little less again,
        // because he is crossing a frame with a joke happening under him.
        idle={0.42}
        eyeLife={0.5}
        zIndex={20}
      />

      {/* Orange, running Red's own path late. Not "behind him" as a
          subtraction — as a *delay*, so he matches the stride rather than the
          position, and on the frame Red stopped (he never does) Orange would
          keep walking for one body and then stop too. */}
      <Shard
        who="orange"
        x={orange.x}
        y={orangeMark.y}
        scale={S18_SHARD_SCALE}
        heading={orange.angle}
        emotion="happy"
        speaking={stage.speaking("orange")}
        look={orangeLook}
        idle={0.42}
        eyeLife={0.5}
        zIndex={19}
      />

      {/* Yellow, half out of the right-hand edge, waving after a Red who left
          the frame four hundred pixels ago. `<Shard>` puts her arm up without
          being asked — it is her whole characterisation. */}
      {arrive > 0.01 ? (
        <Shard
          who="yellow"
          x={yellowMark.x}
          y={yellowMark.y}
          scale={S18_YELLOW.scale}
          emotion="excited"
          speaking={stage.speaking("yellow")}
          // At the gap in the air where Red used to be.
          look={{ x: 0.9, y: -0.1 }}
          zIndex={21}
        />
      ) : null}

      {/* **The free visual from punch-up.md §5**, and the whole of it: Puff
          reaches for Red as he goes past, misses, and shrugs. No line, no
          bubble, no frame — the document's own answer to the soft spot at 5:24,
          taken as a picture rather than as a sixth Puff line.

          It runs INSIDE the thirty frames after `a2_23b_red` as continuous
          action already in progress: his arms are up before the silence opens
          and the shrug is still there when it closes. It does not fight the
          scene's boredom, it *is* the scene's boredom — the air offers Red a
          bounce and Red does not deviate by a pixel. */}
      <PuffMisses frame={frame} passAt={passAt} />

      <Bubbles
        scene={scene}
        cast={{ red: redMark, orange: orangeMark, yellow: yellowMark } as Cast}
        text={S18_BUBBLES}
        at={{
          // Both of Red's bubbles travel with him at his own speed, tail
          // included: he is mid-crossing for both of his lines and a bubble
          // pinned to where he *was* points at a gap in the air by the time he
          // finishes the sentence.
          a2_23b_red: { x: red.x - 300, y: 306, tail: "right", tailAt: red.x },
          a2_24b_red: { x: red.x - 320, y: 306, tail: "right", tailAt: red.x },
          // Orange's travel the same way and sit **lower** than Red's — one
          // body behind and one line under, which is the whole man. They are
          // never up at the same time as Red's, but they are never in the same
          // place either, so a paused frame says which of the two spoke.
          a2_23c_orange: { x: orange.x - 300, y: 430, tail: "right", tailAt: orange.x },
          a2_24c_orange: { x: orange.x - 300, y: 430, tail: "right", tailAt: orange.x },
          // **Yellow's tail clamps and that is unavoidable**: she is at x≈1840
          // and `Bubbles` will not place a bubble centre past 1520 (a bubble
          // that far out cannot be read). It stops at its own right-hand limit
          // pointing at her, she is the only body in the right third of the
          // frame, and her raised arm is doing most of the attribution anyway.
          a2_24d_yellow: { x: 1490, y: 300, tail: "left", tailAt: yellowMark.x },
        }}
      />
      {/* Nothing enters the twenty frames after "Straight through. Barely
          touched the sides." — Red is most of the way out of frame, Puff is
          still holding the shrug, and there is deliberately no code below this
          line: not one element in this scene has its visibility keyed to that
          window, and the two bodies moving through it have been moving at the
          same speed since frame zero. Deadpan is stillness, and the cheapest way
          to keep a beat empty is to have nothing that could fill it. */}
    </AbsoluteFill>
  );
};

/**
 * Puff, under the corridor, failing to interest Red in a bounce.
 *
 * `reach` is arms up over the twenty-three frames before Red arrives, held
 * while he goes straight past, and down again; `shrug` comes up after and
 * **never comes back down**, because the twenty-frame beat two lines later is
 * "Puff is still holding the shrug". He never moves off his mark and he never
 * says a word about it.
 */
const PuffMisses: React.FC<{ frame: number; passAt: number }> = ({ frame, passAt }) => {
  const since = frame - passAt;
  const reach =
    since < -40
      ? 0
      : since < -17
        ? (since + 40) / 23
        : since < 9
          ? 1
          : Math.max(0, 1 - (since - 9) / 17);
  const shrug = clamp01((since - 15) / 22);
  return (
    <Puff
      x={S18_PUFF.x}
      y={hover("puff", S18_PUFF.y - reach * 46 + shrug * 12, S18_PUFF.scale)}
      scale={S18_PUFF.scale}
      opacity={0.5}
      phase={PHASE.puff}
      // Hopeful, then not. Nothing else changes and nobody comments.
      emotion={reach > 0.35 ? "excited" : shrug > 0.3 ? "grumpy" : "happy"}
      look={reach > 0.2 ? { x: 0.1, y: -0.75 } : "camera"}
      arms
      // `brace` is the kit's arms-out-and-down pose and it is the only shrug
      // available; it is what he is still holding twenty frames later.
      pose={reach > 0.2 ? "cheer" : shrug > 0.35 ? "brace" : "rest"}
      wisps={0.3}
      idle={0.6}
      zIndex={18}
    />
  );
};

// ---------------------------------------------------------------------------
// Scene 19 — Blue goes everywhere
// ---------------------------------------------------------------------------

/** Blue and his shadow, drawn at the sizes that keep them two bodies. */
const S19_BLUE_SCALE = 0.78;
/**
 * Indigo is smaller and fainter, and both are load-bearing.
 *
 * He is Blue's own path four frames stale, which at 27px a frame puts him about
 * 107px behind — less than one drawn body — so two adjacent hues at the same
 * size and alpha would be one lilac smudge with two faces in it (the note act
 * three's pack shot carries). Drawn a third smaller and a fifth fainter he is
 * legibly *a faded copy arriving late*, which is also the physics: an adjacent
 * wavelength scatters slightly less.
 */
const S19_INDIGO_SCALE = 0.5;

/** Puff, standing on one of Blue's own bounce points, getting hit repeatedly. */
const S19_PUFF = { x: 805, y: 697, scale: 0.9 } as const;

/** Above the corridor, watching his own blue go everywhere. */
const S19_RAY = { x: 1616, y: 132, scale: 0.5 } as const;

const S19_BUBBLES: Record<string, string> = {
  // "Hi! Sorry! Sorry! Hi! Sorry!" — he is apologising to the air. The air does
  // not mind, and nobody acknowledges it, ever, in the whole episode.
  a2_25b_blue: "Sorry! Sorry! Sorry!",
  a2_26_puff: "Everybody bounce off Puff!",
  a2_28_ray: "Where did Blue GO?",
  // The tail of Blue's line, said late, from the corner Blue has already left.
  a2_28c_indigo: "And here.",
  // --- THE ECHO ARGUMENT (revision2) ----------------------------------------
  // The series' first colour-on-colour conflict, and Blue loses it by playing.
  a2_28d_blue: "I just said that!",
  a2_28e_indigo: "Said that.",
  a2_28f_blue: "Stop saying what I say!",
  a2_28g_indigo: "What I say.",
};

/**
 * **The argument, as bubble ping-pong.**
 *
 * Blue right, Indigo left, twice, dropping a row each exchange — so a paused
 * frame anywhere in the four lines says which of two adjacent blue-ish blobs is
 * talking, which is the whole gag and is not something a tail alone can carry
 * when both speakers are ricocheting through the same corridor.
 *
 * Blue's positions keep ricocheting under it (his law; the bubbles do not chase
 * him — the Scene 19 finding), and the descending rows are the argument losing
 * altitude, which is what it is doing.
 */
const S19_ARGUE = {
  blueX: 1330,
  indigoX: 520,
  hi: 214,
  lo: 400,
} as const;

/**
 * **The scene's one real ask** (revision §6.7): three bubbles, one per clause,
 * each from a different corner of the frame, each pointing at wherever Blue
 * actually is on that frame — and **each of them absolutely still while he is
 * not**. The answer to "where did Blue go" is "everywhere", said from
 * everywhere, and it only reads if the words hold still long enough to be read.
 *
 * They accumulate rather than replacing each other: by the last clause all three
 * are up at once in three corners, which is the whole mechanism in one frame.
 *
 * **The clause fractions are measured off the re-rolled take, not guessed.**
 * `a2_28b_blue` was re-synthesized on 2026-08-02 (the first draw came back slow
 * and low) and is now 3.06s. `silencedetect -30dB` on the delivered file gives
 * spoken runs at 0.177–0.984, 1.391–1.874 and 2.264–2.757 seconds, so the three
 * clause onsets are at 0.058, 0.455 and 0.740 of the clip. The brief's starting
 * point was `[0.05, 0.42, 0.74]`; the middle one was 3.5% early against this
 * take, which is a frame and a bit, and it is corrected here. **Never measure
 * this against a memory of the old 6.66s take.**
 */
const S19_CLAUSE = [0.058, 0.455, 0.74] as const;
const S19_CLAUSE_TEXT = ["Over here!", "And here!", "And HERE!"] as const;

/**
 * Three frames of lead, because a bubble that starts its pop on the syllable
 * finishes it a fifth of a second after the word has gone.
 */
const S19_POP_LEAD = 3;

/**
 * The three corners, and how far each bubble is allowed to lean out of its
 * corner toward Blue.
 *
 * The lean exists because of the tail. `SpeechBubble` clamps `tailAt` inside the
 * bubble's own width — the browser lays the bubble out, so CSS `clamp` is the
 * only thing that knows how wide it ended up — and a two-word bubble is about
 * 400px, so a tail asked to point 600px away just sits on the corner and points
 * at nothing, which reads as narration. Pulling the bubble 42% of the way toward
 * him keeps the tail *on* him while the bubble is still plainly in its corner.
 *
 * Bottom right, then top right, then top left: on the three clause frames Blue
 * is at (1520,813), (1064,654) and (584,530), so the bubbles sweep across the
 * frame in the same direction he does and every one of them is above him, which
 * is what the tail rule needs (it leaves the bubble's *bottom* edge).
 */
const S19_CORNER = [
  { x: 1440, y: 646 },
  { x: 1440, y: 208 },
  { x: 480, y: 208 },
] as const;
const S19_CORNER_PULL = 0.42;

const BlueEverywhereScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [blueFrom, blueLineTo] = lineWindow(scene, "a2_25_narrator");
  const [, beatTo] = heldBeat(scene, "a2_27_narrator");
  const [sayFrom, sayTo] = lineWindow(scene, "a2_28b_blue");

  // He does not wait to be finished introducing — the four-frame turn gap in
  // the timeline is the interruption, and this is the same joke in the picture:
  // he is already ricocheting under the last two words of "Blue is the bounciest
  // one there is."
  const startAt = blueFrom + Math.round((blueLineTo - blueFrom) * 0.83);
  const age = frame - startAt;
  const blue = bluePath(age);
  const indigo = indigoEcho(bluePath, age);
  const t = frame / fps;

  // The mesh opens at three legs and walks up to forty on the last frame of the
  // sacred forty-five. Nothing is said over that beat and nothing enters it; the
  // thing it is holding for is the frame *filling*.
  const keep = Math.round(
    interpolate(frame, [startAt, beatTo], [3, 32], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const spray = clamp01((frame - startAt - 20) / Math.max(1, beatTo - startAt - 20));

  // Where he is on the current leg, 0..1 — near 0 he has just hit something.
  const legU = (Math.max(0, age) / BLUE_LEG) % 1;
  const impact = Math.max(0, 1 - legU * 6);
  const corner = blueCornerAt(Math.floor(Math.max(0, age) / BLUE_LEG));
  const alive = clamp01((frame - startAt) / 8);

  const stage = useStage(scene);
  const rayEmotion = useEmotion(scene, "ray", { a2_28_ray: "amazed" }, "amazed", NO_LEAD);
  const puffEmotion = useEmotion(scene, "puff", { a2_26_puff: "excited" }, "happy", NO_LEAD);
  // **His FACE gives up mid-ricochet on the 20f hold, and nothing else does.**
  // He never stops moving — that is the law, and stopping him would be a second
  // event inside a beat the script says is empty. What enters the beat is one
  // expression, on a body that is already in the frame doing what it was doing.
  const [giveUpFrom] = heldBeat(scene, "a2_28g_indigo");
  const blueFace = emotionAt(
    frame,
    [{ at: giveUpFrom, emotion: "sad", frames: 14 }],
    "excited",
  );

  const puffMark: Mark = {
    x: S19_PUFF.x,
    y: hover("puff", S19_PUFF.y, S19_PUFF.scale),
    scale: S19_PUFF.scale,
    who: "puff",
    side: "left",
  };
  // Ray watches his own blue from *above* the cross-section — outside the
  // corridor walls, so he is looking into the diagram rather than standing in
  // it, and the ball pit stays legible under him.
  const rayMark: Mark = {
    x: S19_RAY.x,
    y: hover("ray", S19_RAY.y, S19_RAY.scale),
    scale: S19_RAY.scale,
    who: "ray",
    side: "left",
  };
  const blueMark: Mark = {
    x: blue.x,
    y: hover("shard", blue.y, S19_BLUE_SCALE),
    scale: S19_BLUE_SCALE,
    who: "shard",
  };
  const indigoMark: Mark = {
    x: indigo.x,
    y: hover("shard", indigo.y, S19_INDIGO_SCALE),
    scale: S19_INDIGO_SCALE,
    who: "shard",
  };

  return (
    <AbsoluteFill style={{ background: "#eaf6ff" }}>
      <CorridorBed phase={15.6} />
      <Corridor t={t} hit={age > 0 ? corner : undefined} />

      <BlueMesh age={age} keep={keep} opacity={alive} />
      <BlueSpray u={spray} span={(beatTo - startAt) / fps} />

      {/* The flash on the bounce he is closest to, so a turn reads as an
          impact rather than as a rendering fault. */}
      {age > 0 && impact > 0.02 ? (
        <WideLayer zIndex={11}>
          <circle
            cx={corner.x}
            cy={corner.y}
            r={78 * impact}
            fill={SPECTRUM[4].light}
            opacity={0.42 * impact}
          />
        </WideLayer>
      ) : null}

      <Puff
        x={S19_PUFF.x}
        y={puffMark.y}
        scale={S19_PUFF.scale}
        opacity={PUFF_GHOST}
        phase={PHASE.puff}
        emotion={puffEmotion}
        speaking={stage.speaking("puff")}
        look={{ x: 0.2, y: -0.3 }}
        pose={stage.speaking("puff") ? "cheer" : "rest"}
        arms
        zIndex={18}
      />

      {/* **Indigo, and he is under Blue rather than over him**: he is the copy,
          so on the frames they overlap it is Blue who is in front. His trail is
          Blue's own trail four frames stale, which means it has the same elbow
          in it and arrives at the corner Blue has just left — the drawing of
          "does everything Blue does, slightly worse, half a beat late". */}
      <Shard
        who="indigo"
        x={indigo.x}
        y={indigoMark.y}
        scale={S19_INDIGO_SCALE}
        heading={indigo.angle}
        trail={age > INDIGO_LAG + 4 ? blueTrail(age - INDIGO_LAG, S19_BOX, S19_SEED) : undefined}
        emotion="happy"
        speaking={stage.speaking("indigo")}
        look={{ x: 0.3, y: -0.1 }}
        opacity={alive * 0.82}
        zIndex={22}
      />

      <Shard
        who="blue"
        x={blue.x}
        y={blueMark.y}
        scale={S19_BLUE_SCALE * (1 + impact * 0.14)}
        heading={blue.angle}
        trail={age > 4 ? blueTrail(age, S19_BOX, S19_SEED) : undefined}
        emotion={blueFace}
        speaking={stage.speaking("blue")}
        look={{ x: 0.4, y: -0.2 }}
        opacity={alive}
        zIndex={24}
      />

      <Ray
        x={S19_RAY.x}
        y={rayMark.y}
        scale={S19_RAY.scale}
        brightness={RAY_LIGHT.afterRainbow}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        look={{ x: -0.2, y: 0.8 }}
        streak={0.2}
        zIndex={30}
      />

      <Bubbles
        scene={scene}
        cast={{ puff: puffMark, ray: rayMark, blue: blueMark, indigo: indigoMark } as Cast}
        text={S19_BUBBLES}
        at={{
          // Parked top left and dead still while he is not. He crosses half the
          // corridor during this line, so the tail is aimed at where he was on
          // the frame it popped and then stays there: a bubble that chased him
          // at 27px a frame is a bubble nobody can read.
          a2_25b_blue: { x: 520, y: 214, tail: "right", tailAt: bluePath(139 - startAt).x },
          a2_26_puff: { x: 700, y: 252, tail: "right", tailAt: S19_PUFF.x },
          a2_28_ray: { x: 1250, y: 176, tail: "right", tailAt: S19_RAY.x },
          // Low and left, in the corner Blue's third bubble has just vacated —
          // he is four frames behind a joke that has already finished.
          a2_28c_indigo: { x: 470, y: 340, tail: "right", tailAt: indigo.x },
          // The ping-pong. See `S19_ARGUE`.
          a2_28d_blue: {
            x: S19_ARGUE.blueX,
            y: S19_ARGUE.hi,
            tail: "left",
            tailAt: blue.x,
          },
          a2_28e_indigo: {
            x: S19_ARGUE.indigoX,
            y: S19_ARGUE.hi,
            tail: "right",
            tailAt: indigo.x,
          },
          a2_28f_blue: {
            x: S19_ARGUE.blueX,
            y: S19_ARGUE.lo,
            tail: "left",
            tailAt: blue.x,
          },
          a2_28g_indigo: {
            x: S19_ARGUE.indigoX,
            y: S19_ARGUE.lo,
            tail: "right",
            tailAt: indigo.x,
          },
        }}
      />

      <BlueCorners from={sayFrom} until={sayTo} length={sayTo - sayFrom} startAt={startAt} />
    </AbsoluteFill>
  );
};

/**
 * The three-corner answer. See `S19_CLAUSE` and `S19_CORNER` for every number in
 * it and where it was measured.
 */
const BlueCorners: React.FC<{
  from: number;
  until: number;
  length: number;
  startAt: number;
}> = ({ from, until, length, startAt }) => (
  <>
    {S19_CLAUSE_TEXT.map((text, i) => {
      const say = from + Math.round(S19_CLAUSE[i] * length);
      const where = bluePath(say - startAt);
      const anchor = S19_CORNER[i];
      const bx = anchor.x + (where.x - anchor.x) * S19_CORNER_PULL;
      return (
        <SpeechBubble
          key={text}
          x={bx}
          y={anchor.y}
          text={text}
          tail={where.x < bx ? "left" : "right"}
          tailAt={where.x}
          from={say - S19_POP_LEAD}
          until={until}
          background={mixHex(kidTheme.paper, SPECTRUM[4].light, 0.12)}
          outline={SPECTRUM[4].deep}
          zIndex={44}
        />
      );
    })}
  </>
);

// ---------------------------------------------------------------------------
// Scene 20 — Blue, from every direction
// ---------------------------------------------------------------------------

/**
 * Blue arriving at the lens from everywhere at once — **and every one of them
 * has Blue on the end of it** (revision §6.8).
 *
 * Not a cheat and not a repeated sprite gag: it is what scattered light *is*,
 * and it is the picture Scene 19's last line just promised. The same blob, in
 * two dozen copies, arriving from every direction — so the answer to "where did
 * Blue go" is standing in the frame two dozen times over.
 *
 * Twenty-four rather than the thirty the arrows-only version used. Each one is
 * now a body with a face instead of a dart, and thirty faces converging on the
 * middle of the frame is a swarm rather than a sky.
 */
const ARROW_N = 24;
const ARROWS = Array.from({ length: ARROW_N }, (_, i) => {
  const k = i * 47 + 3;
  return {
    angle: (i / ARROW_N) * Math.PI * 2 + ((k % 13) / 13) * 0.18,
    start: 0.62 + ((k * 31) % 60) / 100,
    at: ((k * 17) % 100) / 100,
    len: 150 + ((k * 29) % 130),
  };
});

const S20_RAY = { x: 1466, y: 686, scale: 0.56 };

const S20_BUBBLES: Record<string, string> = {
  a2_32_ray: "From ALL of the sky!",
  a2_34_ray: "Violet bounces even more!",
  // Two words, and the whole of the punch-up's C2. The clip says exactly this,
  // so for once the bubble is a transcript rather than a summary — there is
  // nothing to summarise.
  a2_36b_ray: "Sorry, Violet.",
  // Yellow's cheer is its own element (see `S20_YELLOW`); Blue's four "Hi!"s are
  // one clip and four bubbles, so they are `<BlueHellos>` rather than a map
  // entry — `Bubbles` draws one bubble per turn.
  a2_33b_yellow: "Look at Violet go!",
};

/**
 * **`a2_32b_blue` is ONE clip and FOUR bubbles** — Ray's roll-call bubble,
 * returned from everywhere at once, which is the mechanism delivered as a
 * greeting.
 *
 * The four fractions are measured off the delivered take rather than guessed,
 * and they are **fractions of the clip**, so a re-roll re-times all four for
 * free (the brief's explicit instruction — this clip may be re-rolled).
 *
 * Method, because this box has no ffmpeg and therefore no `silencedetect`: the
 * mp3's own MPEG-1 Layer III side info carries a `global_gain` per granule
 * (576 samples ≈ 18ms at this file's 32kHz), which tracks loudness closely
 * enough to find four hard onsets in a 2.77s clip. The four "Hi!"s begin at
 * 0.19 / 0.92 / 1.59 / 2.25 seconds — i.e. **0.069, 0.332, 0.574, 0.812** of the
 * clip, which is very nearly even and reads as a volley.
 *
 * They **accumulate** rather than replacing each other, exactly like Scene 19's
 * three corners: by the fourth all four are up at once, which is the sentence
 * "from ALL of the sky" drawn.
 */
const S20_HELLO_AT = [0.069, 0.332, 0.574, 0.812] as const;
/**
 * Four points around the dome, clockwise, so the volley visibly goes *around*
 * the frame rather than piling up in one place.
 *
 * **None of them is the bottom-right corner**, which is Ray's: his body runs
 * y 563..809 at x 1366..1566, and a first pass put a bubble at (1470, 470) whose
 * tail — clamped to ±60px, because "Hi!" is a 200px bubble — landed at 1410,
 * i.e. on Ray's forehead. Four blue bubbles with a tail pointing at Ray reads as
 * Ray saying them (`RaySkyBlue_015462`, before).
 *
 * Every tail points **straight down** out of its own bubble rather than at a
 * named arrival. That is not laziness: `arrowAt`'s radius sweeps 140..900px on
 * its own clock, so a tail aimed at arrival number N is aimed somewhere
 * different every time this clip is re-rolled — and there are twenty-four Blues
 * filling the frame, so straight down always has one under it.
 */
const S20_HELLO = [
  { x: 760, y: 180, tail: "left" as const },
  { x: 1430, y: 250, tail: "left" as const },
  { x: 900, y: 770, tail: "right" as const },
  { x: 500, y: 470, tail: "right" as const },
] as const;
/** Three frames of lead, so the pop finishes on the syllable. Scene 19's number. */
const S20_POP_LEAD = 3;

/**
 * **Yellow, pointing at Violet from the bottom of the frame, to a room that does
 * not look.**
 *
 * Down and left, below Violet's corner and clear of his 68px-wide smear
 * (x 223..377) — she is half out of the bottom edge, which is where the cheer
 * comes from. She arrives **on her own line** rather than before it, because the
 * thirty-six frames in front of it are the dome hold and nothing enters those;
 * and she is gone again well before the droop beat, which is protected
 * absolutely.
 */
const S20_YELLOW = { x: 470, y: 1010, scale: 0.85, from: 1210 } as const;

/**
 * **Violet, firing two — and he is on the kit now.**
 *
 * The delivered cut drew him here as a one-off: a hand-written Lissajous with an
 * `ax`/`ay`/`speed` of its own, bouncing around a 380×280 box in the corner. It
 * was a good gag and it was **the wrong body** — the ensemble sheet's Violet
 * "vibrates so hard his own outline blurs, in place; he is the fastest thing in
 * any frame he is in and he never goes anywhere", and a Violet who tours a box
 * in Act Two and fizzes on the spot in Act Three is two characters. So the
 * staging moves onto `<Shard who="violet">`, which applies `violetVibrate` and
 * the amplitude smear whether or not a scene remembers to ask, and there is no
 * raw Violet drawing left in this file.
 *
 * "Out-bouncing the entire frame" survives the move intact, and is in fact
 * *stronger*: the kit sizes his amplitude against Blue on purpose (see
 * `VIOLET_AMP`) so his peak speed is 57px a frame against Blue's 37 and his
 * smear is 68px wide against Blue's 37px step. He is the fastest object and the
 * widest blur in any frame containing both — without going anywhere, which is
 * the joke.
 *
 * Three things stay named here because they are the gag rather than the rig:
 *
 *   - **Bottom-left, clear of everything.** The eye owns the middle at (960,
 *     726) and Ray owns the right at x=1466, so the corner is the one place a
 *     body can work this hard without being *in the way* — which is the point:
 *     nobody looks at him because nobody has to.
 *   - **`wag` is the waving**, and it is a body wag rather than an arm flap.
 *     `<Shard>` puts `pose="wave"` on Yellow and only Yellow, so waving is not
 *     available to him through the kit (see the note in the report); act three
 *     solves the same problem the same way, by moving the whole body, and at
 *     8Hz of vibration an arm flap would be invisible underneath it anyway.
 *   - **`scale` is the findability lesson** (ep 2's backwards puff): a
 *     background gag has to be findable in a paused frame or it is not in the
 *     episode. He is drawn the same size as Ray, fully opaque, with his own
 *     face, on the pale inside of the dome.
 */
const S20_VIOLET = { x: 300, y: 720, scale: 0.88, wag: 26, wagHz: 1.15 } as const;

/**
 * **The comparator, and it is Blue now** (revision §6.8: "replace that dot with
 * Blue").
 *
 * A plain dot was the control in a two-object comparison and wanted no
 * personality at all. It is the wrong object now for the same reason the
 * hand-rolled Violet was: Blue is a character with three lines by this point in
 * the episode, and "violet really does bounce more than blue does" lands as a
 * *comparison between two people we know* rather than as a chart. He is here
 * doing his own signature — a real ricochet, on the kit — in a box small enough
 * that a paused frame shows him working visibly less hard than Violet is.
 *
 * Up and to the right of Violet's corner, and deliberately out of his lane: a
 * still with the two of them overlapping is not a comparison, it is a collision.
 */
const S20_BLUE_BOX: Box = { x: 520, y: 336, w: 240, h: 150 };
const S20_BLUE_SCALE = 0.6;

/**
 * Scene 20 — the step that turns a bouncing ball into a sky.
 *
 * Three pictures in one scene, and the middle one is the answer to the cold
 * open: arrows arriving at the viewer from every direction, then a pull back to
 * the whole glowing dome with **nothing over it for thirty-six frames**, then
 * the violet exchange — which is the episode's honesty tax and gets its own
 * small picture rather than a line of narration over the dome, because "our
 * eyes are not very good at violet" is a fact about an eye and there is an eye
 * available.
 *
 * **And then the punch-up's C2.** From `a2_34_ray` the violet dot is not a dot:
 * it is Violet, with his face on, out-bouncing every other object in the frame
 * and waving at the lens while two Narrator lines play over the top of him as
 * if he were not there. On the 20f beat after `a2_36_narrator` he stops and
 * droops — that is the only thing that enters the beat — and Ray, for the first
 * and only time, looks at him. The fact was always that our eyes are the reason
 * we do not see violet; this makes the fact have a victim, which is the version
 * a six-year-old keeps.
 */
const EveryDirectionScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [arrowFrom] = lineWindow(scene, "a2_30_narrator");
  const [domeFrom, domeTo] = lineWindow(scene, "a2_33_narrator");
  const [beatFrom, beatTo] = heldBeat(scene, "a2_33_narrator");
  // **Violet now comes up on YELLOW's line, not on Ray's** (revision2). She
  // points at him and says "Look at Violet go!", so he has to be in the frame
  // for her to point at — and Ray's "Hold on. Violet bounces even more than Blue
  // does." becomes a reaction to her rather than a discovery of his own, which
  // is the note's whole point ("Ray is now the only one who listened to Yellow,
  // which sharpens the pedant").
  const [violetFrom, violetLineTo] = lineWindow(scene, "a2_33b_yellow");
  const [eyeFrom] = lineWindow(scene, "a2_35_narrator");
  const [helloFrom, helloTo] = lineWindow(scene, "a2_32b_blue");
  const [blueEyeFrom] = lineWindow(scene, "a2_36_narrator");
  // The 20f the punch-up bought. Violet stops on its first frame and stays
  // stopped through the apology; nothing else in the scene moves either.
  const [droopFrom] = heldBeat(scene, "a2_36_narrator");
  const [sorryFrom, sorryTo] = lineWindow(scene, "a2_36b_ray");

  const t = frame / fps;
  const arrows = kidEase.easeInOutSine((frame - arrowFrom - 10) / 40);
  // **The dome is fully up well before the line ends**, and that is a change:
  // it used to land exactly as the silence opened, which left the face below
  // resolving out of a half-faded dome. The face is the last third of
  // `a2_33_narrator` and it needs something finished to resolve out of.
  const pull = kidEase.easeInOutSine((frame - domeFrom - 10) / 60);
  const glow = 0.5 + 0.5 * Math.sin((frame - domeTo) * 0.06);
  const violet = kidEase.easeInOutSine((frame - violetFrom) / 26);
  const eye = kidEase.easeOutBack(Math.max(0, Math.min(1, (frame - eyeFrom) / 22)), 1.2);
  const blueEye = kidEase.easeInOutSine((frame - blueEyeFrom - 6) / 20);

  // **The dome resolves into Blue's face, ON the line and never in the beat.**
  //
  // `a2_33_narrator` is "Blue is not a patch of the sky. Blue is the WHOLE
  // sky.", 4.08s, and `silencedetect` puts its last clause — the one with
  // "WHOLE sky" in it — at 2.406–3.561s, i.e. 0.59..0.87 of the clip. The face
  // fades up at 0.64, holds half a second across the word, and is gone by 0.93,
  // which is nine frames before the silence starts. **The 36f beat after this
  // line is the answer to the cold open and it does not get a gag in it**: the
  // full dome, glowing, with nothing over it, and this is the arithmetic that
  // guarantees the face is not still there.
  const domeLen = Math.max(1, domeTo - domeFrom);
  const faceIn = domeFrom + domeLen * 0.64;
  const faceOut = domeFrom + domeLen * 0.93;
  const domeFace =
    clamp01((frame - faceIn) / 9) * (1 - clamp01((frame - (faceOut - 10)) / 10));

  const stage = useStage(scene);
  const rayEmotion = useEmotion(scene, "ray", { a2_32_ray: "amazed", a2_34_ray: "happy" }, "happy", NO_LEAD);
  // He goes out on the first frame of the beat, not on the line — the droop is
  // what the silence is *for*, and a face that waits for "Sorry, Violet." is a
  // face reacting to an apology instead of earning one.
  const violetEmotion = emotionAt(
    frame,
    [{ at: droopFrom, emotion: "sad", frames: 14 }],
    "excited",
  );
  const droop = clamp01(kidEase.easeOutCubic((frame - droopFrom) / 26));

  const rayMark: Mark = {
    x: S20_RAY.x,
    y: hover("ray", S20_RAY.y, S20_RAY.scale),
    scale: S20_RAY.scale,
    who: "ray",
    side: "left",
  };
  // Violet's own mark, so Ray's one look at him is *computed* off his face
  // rather than eyeballed as a direction. `markCentre` is `faceOf`, which on a
  // shard is 77 local units above the middle of its box — aiming at `midOf`
  // would put Ray's eyes on the gap under his chin (the F2 note).
  const violetMark: Mark = {
    x: S20_VIOLET.x,
    y: hover("shard", S20_VIOLET.y + droop * 30, S20_VIOLET.scale),
    scale: S20_VIOLET.scale,
    who: "shard",
  };

  // Yellow rises into the bottom of frame on her own line and drops back out of
  // it under `a2_35_narrator`, so the droop beat and the button are hers to
  // stay out of.
  const yellowIn = pulse(frame, violetFrom, eyeFrom + 46, 16);
  const yellowMark: Mark = {
    x: S20_YELLOW.x,
    y: hover(
      "shard",
      S20_YELLOW.from + (S20_YELLOW.y - S20_YELLOW.from) * yellowIn,
      S20_YELLOW.scale,
    ),
    scale: S20_YELLOW.scale,
    who: "shard",
  };
  // **He bounces HARDER when cheered.** Nobody looks, and he goes up a gear.
  const cheered = clamp01((frame - (violetFrom + 10)) / 18) * (1 - droop);

  return (
    <AbsoluteFill style={{ background: kidTheme.skyLow }}>
      {/* Kid-height, on an ordinary street, because this is happening over the
          roof of the room the child is sitting in. */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - Math.max(0, Math.min(1, pull)) }}>
        <PaintedSky bg="street_day" phase={16.7} drift={9} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: Math.max(0, Math.min(1, pull)) }}>
        <PaintedSky bg="sky_dome_day" phase={16.9} drift={9} />
      </div>

      <ArrivingArrows u={clamp01(arrows) * (1 - clamp01(pull))} t={t} />
      <BlueDome u={clamp01(pull)} glow={glow} t={t} face={domeFace} />

      {/* The honesty tax: violet really does bounce more, and the reason the
          sky is not violet is in the eye. Two small pictures, two lines — and
          one of the two pictures has a face on it and gets apologised to. */}
      <VioletCase
        u={clamp01(violet)}
        frame={frame}
        t={t}
        droopFrom={droopFrom}
        droop={droop}
        cheered={cheered}
        emotion={violetEmotion}
      />

      {/* Yellow, from the bottom corner, pointing at him. `lookAt` off his own
          mark rather than a guessed direction, because that is what `markCentre`
          is for and because the one thing this cheer has to do is be visibly
          aimed at somebody nobody else is looking at. */}
      {yellowIn > 0.01 ? (
        <Shard
          who="yellow"
          x={yellowMark.x}
          y={yellowMark.y}
          scale={S20_YELLOW.scale}
          emotion="excited"
          speaking={stage.speaking("yellow")}
          look={lookAt(markCentre(yellowMark), markCentre(violetMark))}
          zIndex={22}
        />
      ) : null}
      <WatchingEye
        u={Math.max(0, Math.min(1, eye))}
        blue={Math.max(0, Math.min(1, blueEye))}
        t={t}
      />

      <Ray
        x={S20_RAY.x}
        y={rayMark.y}
        scale={S20_RAY.scale}
        brightness={RAY_LIGHT.afterRainbow}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        look={
          frame >= beatFrom && frame < beatTo
            ? "up"
            : // **The one look Violet gets in the whole episode**, and it is on
              // the apology rather than in the beat: the joke is that nobody
              // looked, so the eye-line is the punchline's second half and it
              // must not arrive early. Aimed with `markCentre`, i.e. at his
              // face, not at the middle of his box.
              frame >= sorryFrom && frame < sorryTo
              ? lookAt(markCentre(rayMark), markCentre(violetMark))
              : { x: -0.4, y: -0.5 }
        }
        // Nothing moves inside the dome beat, including him. Nor inside the
        // droop beat — deadpan is stillness, and this one has a body in it that
        // has just stopped.
        idle={
          (frame >= beatFrom && frame < beatTo) || (frame >= droopFrom && frame < sorryFrom)
            ? 0.4
            : 1
        }
        streak={0.25}
        zIndex={26}
      />

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark, yellow: yellowMark } as Cast}
        text={S20_BUBBLES}
        at={{
          a2_32_ray: { x: 1330, y: 264, tail: "right", tailAt: S20_RAY.x },
          a2_34_ray: { x: 1330, y: 264, tail: "right", tailAt: S20_RAY.x },
          // Lower and nearer him than the other two: this bubble is not a
          // caption on the dome, it is one character talking across the frame
          // to another, and it wants to be on the same line of sight.
          a2_36b_ray: { x: 1206, y: 470, tail: "right", tailAt: S20_RAY.x },
          // Above Yellow and to the right of Violet's smear, which reaches
          // x≈377. She is at the bottom edge, so the tail clamps sixty pixels
          // short of her — pointing down-left, at the only body down there.
          a2_33b_yellow: { x: 700, y: 800, tail: "right", tailAt: S20_YELLOW.x },
        }}
      />

      <BlueHellos from={helloFrom} until={helloTo} length={helloTo - helloFrom} />
    </AbsoluteFill>
  );
};

/**
 * Blue's one clip, said four times, from four directions. See `S20_HELLO_AT` for
 * where the four fractions came from and `S20_HELLO` for why they are compass
 * points rather than corners.
 *
 * Each tail is aimed at the arriving Blue coming from that direction, **frozen
 * at the frame the bubble pops**: the arrivals are travelling at a couple of
 * hundred pixels a second and a tail that tracked one would swing across the
 * frame while a six-year-old was still reading the word.
 */
const BlueHellos: React.FC<{ from: number; until: number; length: number }> = ({
  from,
  until,
  length,
}) => (
  <>
    {S20_HELLO.map((corner, i) => {
      const say = from + Math.round(S20_HELLO_AT[i] * length);
      return (
        <SpeechBubble
          key={`${corner.x}-${corner.y}`}
          x={corner.x}
          y={corner.y}
          text="Hi!"
          tail={corner.tail}
          tailAt={corner.x}
          from={say - S20_POP_LEAD}
          until={until}
          background={mixHex(kidTheme.paper, SPECTRUM[4].light, 0.12)}
          outline={SPECTRUM[4].deep}
          zIndex={44}
        />
      );
    })}
  </>
);

/**
 * Dozens of Blues, all of them arriving at you.
 *
 * They converge on a point a little below the middle of the frame — the lens,
 * i.e. the viewer standing in that street — and they keep arriving rather than
 * arriving once, because blue bouncing into your eyes is not an event that
 * happened, it is the condition you are standing in.
 *
 * **The dart on the end is Blue himself**, not an arrowhead: same body, same
 * phase, same face, two dozen copies. What is left of the arrow is the *streak*
 * behind him, which is his own two-line ricochet trail borrowed from the
 * corridor — a body arriving with its motion drawn behind it rather than a
 * symbol pointing at you.
 *
 * Every streak keeps its paper underlay. The first pass drew them in
 * `SPECTRUM[4]` straight onto a painted street and they read as scratches on the
 * plate: a mid-blue line on a blue sky has almost no value contrast, which is
 * the same lesson Ray's outline is built on.
 *
 * The bodies cannot live inside the `WideLayer` — that is an `<svg>` and a
 * character is a `<div>` — so the streaks and the Blues are two passes over the
 * same list. Both are pure functions of `t`, so they cannot drift.
 */
const LENS = { x: 960, y: 610 } as const;

/** Where the i-th arriving Blue is at time `t`, and how big he reads. */
function arrowAt(
  a: (typeof ARROWS)[number],
  t: number,
): { x: number; y: number; tx: number; ty: number; fade: number; scale: number } {
  const p = (((t * 0.5 + a.at) % 1) + 1) % 1;
  // **The radius is bounded by the frame, not by the maths.** The first pass
  // sent them out to 1500px around a lens at (960,610), which put two thirds of
  // them off the plate at any given moment: a still of the beat showed three
  // blue specks in the corners and an empty street. They now start just outside
  // the frame and arrive, which is the sentence — you are standing in this.
  const dist = 240 + a.start * (1 - p) * 780;
  const near = Math.max(140, dist - a.len);
  return {
    x: LENS.x + Math.cos(a.angle) * dist,
    y: LENS.y + Math.sin(a.angle) * dist * 0.86,
    tx: LENS.x + Math.cos(a.angle) * near,
    ty: LENS.y + Math.sin(a.angle) * near * 0.86,
    // On for most of the flight and off only at the two ends: a sine over the
    // whole trip spends most of every arrival being nearly transparent.
    fade: 0.42 + 0.58 * Math.min(1, p * 3.2) * Math.min(1, (1 - p) * 5),
    // Nearer the lens is nearer the viewer, so he gets bigger as he arrives.
    // The far ones stay small enough to be a sky rather than a swarm.
    scale: 0.3 + 0.32 * (1 - Math.min(1, near / 900)),
  };
}

const ArrivingArrows: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  if (u <= 0.01) return null;
  return (
    <>
      <WideLayer zIndex={14} opacity={u}>
        {ARROWS.map((a, i) => {
          const p = arrowAt(a, t);
          const [one, two] = twinLeg({ x: p.x, y: p.y }, { x: p.tx, y: p.ty }, 6);
          return (
            <g key={i} opacity={0.9 * p.fade}>
              <path
                d={`M ${p.x} ${p.y} L ${p.tx} ${p.ty}`}
                stroke={kidTheme.paper}
                strokeWidth={38}
                strokeLinecap="round"
                opacity={0.6}
              />
              <path d={one} stroke={SPECTRUM[4].fill} strokeWidth={15} strokeLinecap="round" />
              <path d={two} stroke={SPECTRUM[4].fill} strokeWidth={15} strokeLinecap="round" />
            </g>
          );
        })}
      </WideLayer>
      {ARROWS.map((a, i) => {
        const p = arrowAt(a, t);
        return (
          <Shard
            key={i}
            who="blue"
            x={p.tx}
            y={hover("shard", p.ty, p.scale)}
            scale={p.scale}
            heading={(a.angle * 180) / Math.PI}
            emotion="excited"
            look="camera"
            opacity={u * p.fade}
            zIndex={15}
          />
        );
      })}
    </>
  );
};

/**
 * The whole dome of the sky, glowing — the answer to the cold open's question,
 * on screen for the first time.
 *
 * A dome rather than a rectangle of blue: the claim is that the colour is not
 * in one place, so the picture has to be the *shape of everywhere*, with a very
 * small street underneath it for scale.
 */
const DOME = { cx: 960, cy: 902, r: 830 } as const;

const BlueDome: React.FC<{ u: number; glow: number; t: number; face?: number }> = ({
  u,
  glow,
  t,
  face = 0,
}) => {
  if (u <= 0.01) return null;
  // **The whole dome, in frame, with air around it.** The first pass parked the
  // centre 300px below the frame and drew a 1550px radius, so what a still of
  // the held beat showed was three pale arcs crossing the top corners — a
  // gradient, not an object. A hemisphere that fits, standing on a ground line
  // with a tiny street under it, is the picture the line asks for: blue is not
  // a patch of the sky, blue is the *whole* sky, and a whole needs an edge.
  const r = DOME.r * (0.72 + 0.28 * u);
  const arc = (k: number, closed: boolean): string =>
    `M ${DOME.cx - r * k} ${DOME.cy} A ${r * k} ${r * k * 0.86} 0 0 1 ${DOME.cx + r * k} ${DOME.cy}${closed ? " Z" : ""}`;
  return (
    <WideLayer zIndex={10} opacity={u}>
      {/* The glow, outside the rim. */}
      {[1.1, 1.05].map((k, i) => (
        <path
          key={k}
          d={arc(k, true)}
          fill={kidTheme.skyMid}
          opacity={(0.14 - i * 0.05) + glow * 0.08}
        />
      ))}
      {/* The dome itself: deeper at the crown, paler at the horizon, which is
          what a real sky does and what the plate under it is already doing. */}
      <path d={arc(1, true)} fill={kidTheme.skyTop} opacity={0.5} />
      <path d={arc(0.82, true)} fill={kidTheme.skyMid} opacity={0.3} />
      <path d={arc(0.6, true)} fill={kidTheme.skyLow} opacity={0.26} />
      <path
        d={arc(1, false)}
        stroke={kidTheme.skyTop}
        strokeWidth={15 + glow * 9}
        fill="none"
        opacity={0.85}
      />
      {/* **No arrows on the dome.** The first pass drew blue arriving at the
          rim and a still showed why not: mid-blue darts on a blue dome are
          invisible except as pale spokes, which read as light coming *out* of
          it — the opposite sentence. The arrows have already been shown; the
          script asks for the dome "with nothing over it", and it means it. */}
      {/* The ground it stands on, from a long way back: a soft rise and two
          roofs, running off the bottom of the frame so it is the world rather
          than a green bar. */}
      <g opacity={0.95}>
        {/* Wider than the frame on both sides: a ground that stops at x=160
            draws two vertical edges and reads as a green rectangle. */}
        <path
          d={`M -700 1300 L -700 ${DOME.cy + 26} q 1660 -74 3320 0 L 2620 1300 Z`}
          fill={kidTheme.grassDark}
          opacity={0.5}
        />
        <path d="M 866 900 l 56 -54 l 56 54 Z" fill={kidTheme.earth} />
        <rect x={880} y={898} width={84} height={40} fill={kidTheme.paper} opacity={0.92} />
        <path d="M 1002 908 l 46 -44 l 46 44 Z" fill={kidTheme.earth} />
        <rect x={1012} y={906} width={72} height={34} fill={kidTheme.paper} opacity={0.92} />
      </g>
      {face > 0.01 ? <DomeFace u={face} /> : null}
    </WideLayer>
  );
};

/**
 * **The dome, for about half a second, turning out to be Blue.**
 *
 * The line is "Blue is not a patch of the sky. Blue is the WHOLE sky.", and this
 * is that sentence with the argument taken out of it: the thing filling the
 * frame opens its eyes and it is him. It is on the line and it is gone before
 * the silence — the beat after it is the answer to the cold open and it does not
 * get a gag in it (see `domeFace` in the scene).
 *
 * **The opaque field is not optional.** `Face` paints an eyelid as a
 * `skin`-coloured *rectangle* over the eye, so drawn straight onto a
 * half-transparent dome a blink flashes a pale rectangle on the sky — the
 * Cheshire-face rule out of Ray's redesign, and the same fix: a wide flat oval
 * of genuinely solid colour, feathered at its edge, with the features on top of
 * it. The oval's colour is the dome's own crown mixed to opacity, so what
 * resolves is the sky's face rather than a disc pasted on the sky.
 */
const DomeFace: React.FC<{ u: number }> = ({ u }) => {
  const rig = useRig({ x: 0, y: 0, emotion: "excited", phase: PHASE.blue, idle: 0.6 });
  const skin = mixHex(kidTheme.skyMid, SPECTRUM[4].light, 0.34);
  return (
    <g opacity={u}>
      <ellipse
        cx={DOME.cx}
        cy={520}
        rx={430 * (0.94 + 0.06 * u)}
        ry={270 * (0.94 + 0.06 * u)}
        fill={skin}
        opacity={0.96}
      />
      {/* Feathered edge: three widening rings at falling alpha, so the field has
          no rim of its own and the face reads as *the sky* rather than as a
          badge on it. */}
      {[1.06, 1.13, 1.2].map((k, i) => (
        <ellipse
          key={k}
          cx={DOME.cx}
          cy={520}
          rx={430 * k}
          ry={270 * k}
          fill={skin}
          opacity={0.3 - i * 0.09}
        />
      ))}
      <Face rig={rig} x={DOME.cx} y={508} size={5.4} skin={skin} eyeSpread={1.2} eyeScale={0.98} />
    </g>
  );
};

/**
 * **Violet, and Blue, in the bottom-left of the dome — the honesty tax as a
 * picture.**
 *
 * Both of them are `<Shard>` now, which is the whole of this rewrite. Violet was
 * a bespoke Lissajous and Blue was a plain dot; they are the ensemble's own
 * bodies running the ensemble's own laws, so "violet bounces even more than blue
 * does" is not a claim the scene makes with two hand-tuned amplitudes — it falls
 * out of the table. `violetVibrate` is applied by `<Shard>` itself, so there is
 * no frame of this episode in which Violet holds still and no way for a scene to
 * forget; `blueRicochet` gives Blue real corners in a small box, which is the
 * *same* signature he does at full size in the corridor, visibly turned down.
 *
 * Two kinds of blur, and it matters here more than anywhere else in the episode
 * because this is the one frame that contains both: **Violet's is amplitude in
 * place** (three copies of a body spanning a vibration it never leaves) and
 * **Blue's is a change of direction** (a bent trail behind a body leaning into a
 * new leg). Two bodies wearing the same generic speed-smear would say the two
 * are the same kind of fast, and the physics of the whole episode is that they
 * are not.
 *
 * No panel, no label, no arrow: a bordered inset would read as a second diagram,
 * and this is a footnote that waves.
 *
 * The stop is all *subtraction*: the vibration goes to zero, the arms fall, the
 * body sags, the face goes. The beat is silent and the only thing allowed to
 * happen in it is somebody giving up.
 */
const VioletCase: React.FC<{
  u: number;
  frame: number;
  t: number;
  droopFrom: number;
  droop: number;
  /** 0..1 — how much harder he is going because somebody cheered. */
  cheered: number;
  emotion: EmotionInput;
}> = ({ u, frame, t, droopFrom, droop, cheered, emotion }) => {
  if (u <= 0.01) return null;
  const V = S20_VIOLET;
  // The wave, and it is a body wag rather than an arm flap — see the note on
  // `S20_VIOLET`. It unwinds to nothing as he droops, and it is deliberately
  // slow: at 8Hz of vibration the only motion the eye can still separate is one
  // an order of magnitude below it.
  const wag = Math.sin(t * Math.PI * 2 * V.wagHz) * V.wag * (1 - droop);
  // Blue's clock is the scene's; the box is small, so his corners are ~70..130px
  // apart against Violet's 68px-wide smear at eight times the frequency.
  const age = Math.max(0, frame - droopFrom + 400);
  const blue = blueRicochet(age, S20_BLUE_BOX, 5.5);
  return (
    <>
      <Shard
        who="blue"
        x={blue.x}
        y={hover("shard", blue.y, S20_BLUE_SCALE)}
        scale={S20_BLUE_SCALE}
        heading={blue.angle}
        trail={blueTrail(age, S20_BLUE_BOX, 5.5)}
        emotion="happy"
        look="camera"
        opacity={u}
        zIndex={18}
      />
      <Shard
        who="violet"
        x={V.x + wag}
        y={hover("shard", V.y + droop * 30, V.scale * (1 - droop * 0.06))}
        scale={V.scale * (1 - droop * 0.06)}
        // **Harder when cheered**, and zero on the beat: the fastest body in the
        // episode goes up a gear because one person noticed, and then stops
        // dead, which is the only thing that enters those twenty frames.
        vibrate={(1 - droop) * (1 + 0.45 * cheered)}
        emotion={emotion}
        // Both arms out, at the lens, for as long as anybody might look — and
        // then down.
        arms={droop < 0.5}
        look={droop > 0.5 ? "down" : "camera"}
        idle={1 - droop}
        eyeLife={1 - droop * 0.8}
        opacity={u}
        zIndex={19}
      />
    </>
  );
};

/**
 * An eye, and the true first-order answer to why the sky is not violet.
 *
 * It does nothing at all when violet arrives and lights up when blue does,
 * which is the entire fact: the reason is in the eye, not in the sky.
 */
const WatchingEye: React.FC<{ u: number; blue: number; t: number }> = ({ u, blue, t }) => {
  if (u <= 0.01) return null;
  const spark = blue * (0.75 + 0.25 * Math.sin(t * 4));
  return (
    <WideLayer zIndex={20} opacity={u}>
      <g transform={`translate(960 726) scale(${0.7 + 0.3 * u})`}>
        {/* Violet arriving, and nothing happening. */}
        <path
          d="M -300 -150 L -120 -40"
          stroke={SPECTRUM[6].fill}
          strokeWidth={13}
          strokeLinecap="round"
          opacity={0.85}
        />
        <path d="M -122 -38 l -46 6 l 22 -42 Z" fill={SPECTRUM[6].fill} opacity={0.85} />
        {/* Blue arriving, and the eye lighting up. */}
        <path
          d="M 300 -150 L 120 -40"
          stroke={SPECTRUM[4].fill}
          strokeWidth={13}
          strokeLinecap="round"
          opacity={0.3 + 0.7 * blue}
        />
        <path d="M 122 -38 l 46 6 l -22 -42 Z" fill={SPECTRUM[4].fill} opacity={0.3 + 0.7 * blue} />

        <ellipse rx={128} ry={78} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={10} />
        <circle r={46} fill={mixHex(kidTheme.inkSoft, SPECTRUM[4].fill, spark)} />
        <circle r={20} fill={kidTheme.ink} />
        <circle cx={-16} cy={-16} r={13} fill="#ffffff" opacity={0.9} />
        <path
          d={`M -128 0 a 128 78 0 0 1 256 0`}
          stroke={kidTheme.ink}
          strokeWidth={10}
          fill="none"
        />
        {/* The spark, when blue lands. */}
        {spark > 0.05
          ? [0, 1, 2, 3, 4, 5].map((i) => (
              <path
                key={i}
                transform={`rotate(${i * 60})`}
                d={`M 0 ${-96 - spark * 18} l 0 ${-34 * spark}`}
                stroke={SPECTRUM[4].light}
                strokeWidth={11}
                strokeLinecap="round"
                opacity={spark}
              />
            ))
          : null}
      </g>
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 21 — Big Word Two: SCATTER
// ---------------------------------------------------------------------------

const S21_RAY = { x: 386, y: 838, scale: 0.72 };

const S21_BUBBLES: Record<string, string> = {
  a2_41_ray: "The air scatters me!",
  // --- the letter-throwing gag stops being silent (revision2) ---------------
  a2_41b_blue: "That was me!",
  a2_41c_indigo: "That was me.",
  a2_41d_ray: "It was mostly Blue.",
};

/**
 * **The box Blue throws from**, and Indigo four frames behind him.
 *
 * Under the banner and clear of Ray's corner: the card owns the top of the frame
 * for the whole scene, which — per the bubble rule about persistent graphics —
 * fixes where anybody underneath it is allowed to be before a single body is
 * staged.
 */
const S21_BLUE_BOX: Box = { x: 640, y: 616, w: 1040, h: 300 };
const S21_SEED = 12.4;

/**
 * Scene 21 — the house Big Word beat, third firing, and **the letters have a
 * cause now** (revision §6.9).
 *
 * Everything about the card is untouched: five lines, both 12-frame beats, the
 * `WordCard`, the freeze, the chant, the syllable blocks. What changes is that
 * the letters no longer arrive by themselves — **Blue throws them**, one per
 * ricochet, from wherever he happens to be on that frame, and Indigo throws one
 * four frames late and misses.
 *
 * **On perching this, and a kit gap.** The brief asks for the business to be
 * perched on `syllableBlock()` letters and never on composition coordinates.
 * There is no such function: `WordCard` lays its letters out as DOM flex
 * children whose widths are the browser's answer to a font, and `SyllableBlocks`
 * does the same — the kit exports no per-letter or per-block geometry, and the
 * kit is frozen for this batch. So the throws are perched on the two things the
 * card *does* guarantee by construction, both of which survive a font change and
 * a reword: the banner is centred (`left:0; right:0; justify-content:center` at
 * `top:y`), and the letters land on the card's own `stagger`, which is 2.5
 * frames and is `WordCard`'s default. Guessing per-letter x offsets from a font
 * size would have been exactly the 2026-07-28 mistake this instruction exists to
 * prevent. Flagged to the showrunner rather than fixed here.
 */
const BigWordScatterScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [wordFrom, wordTo] = lineWindow(scene, "a2_37_narrator");
  // The freeze lands on the word itself — "…that is called scatter."
  const slamAt = Math.round(wordFrom + (wordTo - wordFrom) * 0.88);

  const stage = useStage(scene);
  const rayEmotion = useEmotion(
    scene,
    "ray",
    { a2_39_ray: "excited", a2_41_ray: "excited" },
    "happy",
    // Two 12-frame held beats in this scene.
    NO_LEAD,
  );

  const rayMark: Mark = {
    x: S21_RAY.x,
    y: hover("ray", S21_RAY.y, S21_RAY.scale),
    scale: S21_RAY.scale,
    who: "ray",
    side: "right",
    offset: 340,
  };

  const throwerAt = (f: number): { x: number; y: number; angle: number } =>
    blueRicochet(Math.max(0, f), S21_BLUE_BOX, S21_SEED);
  const blue = throwerAt(frame);
  const indigo = indigoEcho(throwerAt, frame);

  // **"(mid-throw)" is RULED a post-card boast (showrunner, wave-3 fold) — do
  // not add a throw here.**
  //
  // The shipped throws all land with the card, seventeen seconds before
  // `a2_41b_blue`: `ScatterThrows` is keyed to `slamAt` and the claim sits at
  // the very end of the scene. The first build answered that with one extra
  // letter hurled on the line; the ruling reverses it. The line plays as
  // **retrospective credit-claiming** — Blue taking the credit for a word that
  // has been finished for half a minute, which is the same joke as "I got here
  // FIRST!" and is funnier than a man throwing a letter at a completed word.
  // Ray's "It was mostly Blue." then adjudicates a dispute about the past.
  //
  // So the picture on the claim is Blue ricocheting and nothing else changing.

  return (
    <AbsoluteFill style={{ background: "#eaf6ff" }}>
      <BigWordBeat
        scene={scene}
        word="SCATTER"
        syllables={["Scat", "Ter"]}
        chantKey="a2_39_ray"
        slamAt={slamAt}
        color={ACT_COLOR.scatter}
        sub="everywhere at once"
        y={300}
        freeze={<PinballStill />}
      >
        {/* Blue trails keep moving faintly behind the banner: the mechanism does
            not stop for the vocabulary. */}
        <BlueDrift t={frame / fps} />
        <ScatterThrows from={slamAt} letters={7} at={throwerAt} />
        <Shard
          who="indigo"
          x={indigo.x}
          y={hover("shard", indigo.y, 0.5)}
          scale={0.5}
          heading={indigo.angle}
          trail={blueTrail(Math.max(0, frame - INDIGO_LAG), S21_BLUE_BOX, S21_SEED)}
          emotion="happy"
          speaking={stage.speaking("indigo")}
          look="camera"
          opacity={0.82}
          zIndex={40}
        />
        <Shard
          who="blue"
          x={blue.x}
          y={hover("shard", blue.y, 0.68)}
          scale={0.68}
          heading={blue.angle}
          trail={blueTrail(frame, S21_BLUE_BOX, S21_SEED)}
          emotion="excited"
          speaking={stage.speaking("blue")}
          look="camera"
          zIndex={42}
        />
        <Ray
          x={S21_RAY.x}
          y={rayMark.y}
          scale={S21_RAY.scale}
          brightness={RAY_LIGHT.afterRainbow}
          spectrum={RAY_SPECTRUM.afterRainbow}
          phase={PHASE.ray}
          emotion={rayEmotion}
          speaking={stage.speaking("ray")}
          look="camera"
          streak={0.3}
          zIndex={55}
        />
      </BigWordBeat>
      <Bubbles
        scene={scene}
        cast={
          {
            ray: rayMark,
            blue: { x: blue.x, y: hover("shard", blue.y, 0.68), scale: 0.68, who: "shard" },
            indigo: {
              x: indigo.x,
              y: hover("shard", indigo.y, 0.5),
              scale: 0.5,
              who: "shard",
            },
          } as Cast
        }
        text={S21_BUBBLES}
        at={{
          a2_41_ray: { x: 760, y: 690, tail: "left", tailAt: 470 },
          // The pedant's correction goes in the pedant's own spot.
          a2_41d_ray: { x: 760, y: 690, tail: "left", tailAt: 470 },
          // The two claimants sit in the band between the card (which owns
          // y 190..410 and z-index 50, so a bubble up there is a bubble behind
          // a block) and the ricochet box (y 616 down).
          a2_41b_blue: { x: 1300, y: 480, tail: "left", tailAt: blue.x },
          a2_41c_indigo: { x: 760, y: 480, tail: "right", tailAt: indigo.x },
        }}
      />
    </AbsoluteFill>
  );
};

/** The action the Big Word freezes: Scene 19's corridor, at full criss-cross. */
const S21_FREEZE_AGE = 700;

const PinballStill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#eaf6ff" }}>
      <CorridorBed phase={15.6} />
      <Corridor t={frame / fps} />
      <BlueMesh age={S21_FREEZE_AGE} keep={32} />
      <BlueSpray u={1} span={SPRAY_LOOP} />
    </AbsoluteFill>
  );
};

/** Faint blue still going everywhere, behind the card. */
const BlueDrift: React.FC<{ t: number }> = ({ t }) => (
  <WideLayer zIndex={30} opacity={0.28}>
    {SPRAY.map((s, i) => {
      const d = ((t * 260 + i * 190) % 2400) - 200;
      const x = 960 + Math.cos(s.angle) * d;
      const y = 560 + Math.sin(s.angle) * d * 0.72;
      return (
        <g key={i}>
          <path
            d={`M ${x - Math.cos(s.angle) * 150} ${y - Math.sin(s.angle) * 108} L ${x} ${y}`}
            stroke={SPECTRUM[4].fill}
            strokeWidth={8}
            strokeLinecap="round"
            opacity={0.5}
          />
          <circle cx={x} cy={y} r={11} fill={SPECTRUM[4].fill} />
        </g>
      );
    })}
  </WideLayer>
);

/**
 * **Blue throwing the letters in, one per ricochet.**
 *
 * One throw per letter, launched from wherever Blue is twelve frames before that
 * letter is due — so a still of any throw shows the streak leaving the body that
 * threw it, which is the only thing that makes "Blue throws them" a picture
 * rather than a caption. The arrival frames are the card's own stagger
 * (`WordCard`'s `stagger`, 2.5 frames) counted off the slam, so the throws land
 * with the letters however long the narrator's clip turns out to be.
 *
 * **And Indigo throws one, four frames late, and misses.** Same launch, same
 * arc, `INDIGO_LAG` behind it and aimed past the banner's bottom-right corner —
 * he arrives after the joke has finished and hits nothing, which is the whole of
 * him. It is the only throw in the scene that does not stop at the card.
 */
const S21_THROW_LEAD = 12;
const S21_MISS = { i: 4, dx: 330, dy: 250 } as const;

const ScatterThrows: React.FC<{
  from: number;
  letters: number;
  at: (f: number) => { x: number; y: number };
}> = ({ from, letters, at }) => {
  const frame = useCurrentFrame();
  // The banner's centre, which is the one point on the card whose position is
  // guaranteed by the card's own layout rather than by a measurement. See the
  // kit-gap note on the scene.
  const cardX = W / 2;
  const cardY = 300;
  return (
    <WideLayer zIndex={44}>
      {Array.from({ length: letters + 1 }, (_, n) => {
        const miss = n === letters;
        const i = miss ? S21_MISS.i : n;
        const land = from + i * 2.5 + (miss ? INDIGO_LAG : 0);
        const launch = land - S21_THROW_LEAD;
        const u = (frame - launch) / (miss ? S21_THROW_LEAD * 1.9 : S21_THROW_LEAD);
        if (u < 0 || u > 1) return null;
        const src = at(launch);
        const dst = miss
          ? { x: cardX + S21_MISS.dx, y: cardY + S21_MISS.dy }
          : { x: cardX, y: cardY };
        const k = kidEase.easeOutCubic(Math.min(1, u));
        const head = { x: src.x + (dst.x - src.x) * k, y: src.y + (dst.y - src.y) * k };
        const back = Math.min(0.34, k);
        const tail = {
          x: head.x - (dst.x - src.x) * back,
          y: head.y - (dst.y - src.y) * back,
        };
        const [one, two] = twinLeg(tail, head, 6);
        const hue = miss ? SPECTRUM[5] : SPECTRUM[4];
        return (
          <g key={n} opacity={(miss ? 0.6 : 0.8) * (1 - Math.max(0, (u - 0.7) / 0.3))}>
            <path d={one} stroke={hue.fill} strokeWidth={13} strokeLinecap="round" />
            <path d={two} stroke={hue.fill} strokeWidth={13} strokeLinecap="round" />
            <circle cx={head.x} cy={head.y} r={miss ? 15 : 19} fill={hue.fill} />
          </g>
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 22 — The bit that joins the show together
// ---------------------------------------------------------------------------

const S22_PUFF = { x: 700, y: 690, scale: 1.4 } as const;

const S22_BUBBLES: Record<string, string> = {
  a2_44_puff: "I TOLD you!",
  // The cheapest possible bridge into Scene 23 — and the plant for the recap's
  // SCATTER squabble, where he claims the whole mechanism off Puff again.
  a2_44b_blue: "I do the bouncing part!",
};

/**
 * Blue's cupboard for the tag, inside the dome and clear of Puff — who is at
 * 1.4 here, the biggest he is drawn all episode, and owns x 470..930.
 */
const S22_BLUE_BOX: Box = { x: 1180, y: 470, w: 340, h: 220 };
const S22_BLUE_SCALE = 0.6;

/**
 * Scene 22 — the series interlock, and the only place in the episode Puff is at
 * full opacity.
 *
 * Episode two spent ten minutes arguing that air is a material and ended on a
 * kite; this is the receipt. `a2_43_narrator` is said **once in the episode**
 * and gets forty-five frames alone with the picture: the enormous ghost of
 * episode two's Big Word behind the dome, and nothing else. Nothing enters —
 * Puff is already standing there with his arms folded when the silence opens,
 * which is why his one line comes *after* it.
 */
const InterlockScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [ghostFrom] = lineWindow(scene, "a2_42_narrator");
  const [beatFrom, beatTo] = heldBeat(scene, "a2_43_narrator");
  const [toldFrom] = lineWindow(scene, "a2_44_puff");

  const t = frame / fps;
  const ghost = kidEase.easeInOutSine((frame - ghostFrom - 20) / 40);
  const glow = 0.5 + 0.5 * Math.sin(t * 0.9);

  const stage = useStage(scene);
  const puffEmotion = useEmotion(scene, "puff", { a2_44_puff: "excited" }, "proud", NO_LEAD);

  const puffMark: Mark = {
    x: S22_PUFF.x,
    y: hover("puff", S22_PUFF.y, S22_PUFF.scale),
    scale: S22_PUFF.scale,
    who: "puff",
    side: "right",
    offset: 420,
  };

  // **Blue arrives on his own 4f gap, and not one frame earlier.** The 45-frame
  // interlock hold in front of it is the series' one-per-episode sentence and
  // nothing enters it, so his blend starts on `a2_44_puff`'s tail rather than
  // under the silence — the act-three drain-hold finding, applied here.
  const [blueFrom] = lineWindow(scene, "a2_44b_blue");
  const arrive = pulse(frame, blueFrom - 10, scene.durationInFrames + 40, 12);
  const blue = blueRicochet(frame, S22_BLUE_BOX, 63.1);
  const blueAt = { x: blue.x, y: blue.y - (1 - arrive) * VISIT_LIFT };
  const blueMark: Mark = {
    x: blueAt.x,
    y: hover("shard", blueAt.y, S22_BLUE_SCALE),
    scale: S22_BLUE_SCALE,
    who: "shard",
  };

  return (
    <AbsoluteFill>
      <PaintedSky bg="sky_dome_day" phase={18.9} drift={9} />
      <BlueDome u={1} glow={glow} t={t} />

      {/* AIR, faint and enormous, with the blue dome glowing through it. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 430,
          textAlign: "center",
          transform: `translateY(-50%) scale(${0.9 + 0.1 * Math.max(0, Math.min(1, ghost))})`,
          fontFamily: kidTheme.fontFamily,
          fontSize: 420,
          fontWeight: 900,
          letterSpacing: 40,
          color: kidTheme.paper,
          // *Behind* the dome: the script's picture is the word ghosting up
          // behind the sky with the blue glowing through it.
          opacity: 0.34 * Math.max(0, Math.min(1, ghost)),
          zIndex: 8,
          pointerEvents: "none",
        }}
      >
        AIR
      </div>

      <SoftShade x={S22_PUFF.x} y={640} rx={520} ry={430} strength={0.2} color="26,54,86" />
      <Puff
        x={S22_PUFF.x}
        y={puffMark.y}
        scale={S22_PUFF.scale}
        // Full, and only here. He is the thing the sentence is about.
        opacity={1}
        phase={PHASE.puff}
        emotion={puffEmotion}
        speaking={stage.speaking("puff")}
        look="camera"
        // The kit has no "arms folded"; `hug` is the pose whose hands come back
        // in across the body, which at this size is the told-you-so stance.
        pose={frame >= toldFrom ? "cheer" : "hug"}
        // Nothing enters the beat, and he does not fidget inside it either.
        idle={frame >= beatFrom && frame < beatTo ? 0.5 : 1}
        eyeLife={frame >= beatFrom && frame < beatTo ? 0.45 : 1}
        wisps={2}
        zIndex={30}
      />

      {arrive > 0.01 ? (
        <Shard
          who="blue"
          x={blueMark.x}
          y={blueMark.y}
          scale={S22_BLUE_SCALE}
          heading={blue.angle}
          trail={blueTrail(frame, S22_BLUE_BOX, 63.1)}
          emotion="excited"
          speaking={stage.speaking("blue")}
          // Across at Puff, who has just claimed the whole thing.
          look={{ x: -0.85, y: 0.15 }}
          opacity={arrive}
          zIndex={32}
        />
      ) : null}

      <Bubbles
        scene={scene}
        cast={{ puff: puffMark, blue: blueMark } as Cast}
        text={S22_BUBBLES}
        // **x=1240, not 1420, and the reason is `SpeechBubble`'s own layout.**
        // It is an absolutely-positioned shrink-to-fit box, so the width it is
        // *allowed* is the frame minus its own `left`: at 1420 this five-word
        // bubble could only be 500px wide, wrapped to three lines, and its
        // bottom edge landed on Blue's crown (`RaySkyBlue_017390`, before). The
        // same trap the recap hit with Red's four words.
        at={{ a2_44b_blue: { x: 1240, y: 250, tail: "left", tailAt: blueAt.x } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 23 — Sunny has a point
// ---------------------------------------------------------------------------

const S23_SUNNY: Mark = { x: 1466, y: hover("sunny", 396, 1), scale: 1, who: "sunny", side: "left" };
/**
 * Bottom left, and **under** the diagram rather than in it.
 *
 * The diagram runs sun (300) → beam → air (760) → sky (1010–1300) and stops
 * there; Sunny owns everything right of 1300. Ray was at the same height as the
 * diagram's sun in the first pass, which put a small white beam with a face on
 * it directly under a big yellow disc with a face on it — three suns in one
 * frame, one of them the hero.
 */
const S23_RAY = { x: 306, y: 892, scale: 0.62 };

const S23_BUBBLES: Record<string, string> = {
  a2_45_sunny: "Whose light is that?",
  a2_46_ray: "Um. Yours.",
  a2_47_sunny: "I painted it! Obviously!",
  // The line is "I DO have a point! I have LOADS of points!" — the pun is the
  // scene's one joke and the bubble is the half with the pun in it. (The old
  // bubble here still said "I have NEVER been wrong.", which is the line this
  // one replaced: the revision turned his moment of doubt into his moment of
  // triumph and the bubble had not followed.)
  a2_50_sunny: "I have LOADS of points!",
  // Likewise: `a2_52_ray` is now "But the AIR did the painting." — the old
  // bubble was the sentence the Narrator says one line *earlier*.
  a2_52_ray: "The AIR did the painting.",
  a2_53_sunny: "THE SKY IS MY LIGHT!",
};

/**
 * **R9 — Red walks across the finished diagram.** The revision offers this as a
 * free, droppable visual on `a2_51_narrator`, never inside a held beat; the
 * showrunner ruled it IN unless the builder's own stills showed it crowding the
 * frame.
 *
 * **It is OUT, and the reason is arithmetic before it is taste.** `a2_51` is 93
 * frames and the beat after `a2_52_ray` opens 78 frames later, so Red has 171
 * frames — 5.7 seconds — in which to be on screen. At `RED_SPEED` (108px/s, the
 * one number the whole character is, and one a scene is explicitly forbidden to
 * raise to make an entrance land) that is 615px: a quarter of the crossing. He
 * cannot get in and out. Every staging of it therefore ends the same way — Red
 * still walking, in shot, through "It lands on him. Nobody helps.", which is a
 * thirty-frame silence whose entire content is that nobody moves.
 *
 * The stills confirmed the second half of it independently: at the only place
 * he fits — the band under the rebuilt diagram — he arrives on top of Ray, who
 * is staged at (306, 892) and who is *speaking* through that stretch.
 *
 * Kept as a constant with its own argument rather than deleted, because "should
 * Red walk through here?" is a question this scene will be asked again.
 */
const S23_RED_WALK = false;

/**
 * Scene 23 — the longest scene in the episode, five held beats, and the one the
 * whole series has been setting up.
 *
 * Episode two planted "One day Sunny will be wrong about something. It is not
 * today." four minutes before its end. **This episode declines to collect it**,
 * and that decision is the whole of this rewrite: the Narrator's verdict became
 * a concession ("He has a point."), so every piece of staging that used to
 * perform *being wrong* has gone with it.
 *
 *   **The diagram never stops.** The delivered cut halted it on "He is wrong"
 *   and let the beams holding it up droop. That ceremony is deleted — not
 *   softened, deleted. It assembles from his first brag straight through to the
 *   rebuild without a single frame of hesitation, which is what makes the
 *   correction feel like *more* rather than like a collapse.
 *
 *   **The grin GROWS.** Same 36-frame beat, opposite content: it does not come
 *   apart, it swells slowly across the whole silence while the diagram keeps
 *   assembling behind him. `emotionAt` morphs proud → excited over exactly the
 *   beat's own length, so the change is spread across it rather than landing in
 *   it; there is no line to hang it on and a `useEmotion` lead would put it
 *   under the Narrator's three words.
 *
 *   **He is not dimmed and never was wrong.** The old staging desaturated him
 *   while the verdict landed. He now runs at full brightness for the entire
 *   scene, which is what "undefeated" looks like.
 *
 * The camera pushes in for "I checked" so that the 45-frame beat is a man alone
 * in frame with an enormous smug grin, and pulls back out **on `a2_49`** — on
 * the line, not in the beat — so that the 36 frames after it have the diagram
 * visibly still building behind him, which is what the revision asks for and
 * what the close-up would otherwise have hidden.
 */
const SunnyWrongScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [bragFrom] = lineWindow(scene, "a2_47_sunny");
  const [checkFrom] = lineWindow(scene, "a2_48_narrator");
  const [grinFrom] = heldBeat(scene, "a2_48_narrator");
  const [wrongFrom, wrongTo] = lineWindow(scene, "a2_49_narrator");
  const [growFrom, growTo] = heldBeat(scene, "a2_49_narrator");
  const [pointsFrom, pointsTo] = lineWindow(scene, "a2_50_sunny");
  const [rebuildFrom, rebuildTo] = lineWindow(scene, "a2_51_narrator");
  const [landFrom, landTo] = heldBeat(scene, "a2_52_ray");

  // **One continuous assembly, from his first brag to the rebuild.** It used to
  // finish inside `a2_47` and then sit there; spread across the whole stretch it
  // is still visibly adding pieces through the 36-frame beat, which is the one
  // thing that beat asks for besides the grin.
  const build = clamp01(
    kidEase.easeInOutSine((frame - bragFrom) / Math.max(1, rebuildFrom - bragFrom)),
  );
  // Then it comes back with the air in it, bigger than his, around him.
  const air = clamp01(
    kidEase.easeInOutSine((frame - rebuildFrom - 6) / Math.max(1, (rebuildTo - rebuildFrom) * 0.9)),
  );

  // The camera pushes onto Sunny for "I checked", so "alone in frame" is
  // literally true for the 45-frame beat, and comes back out **on `a2_49`** so
  // that the beat after it has the diagram in shot. No camera move begins or
  // ends inside either beat.
  const inOn = interpolate(frame, [checkFrom, grinFrom - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const backOut = interpolate(frame, [wrongFrom, wrongTo - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const close = inOn * (1 - backOut);
  // **A real close-up, and the numbers are load-bearing.** At 1.5× the diagram
  // was still sitting in the corner of the frame, and the beat is "Sunny
  // holding an enormous smug grin, *alone in frame*". At 2.5×, with the frame
  // slid left so he is centred rather than parked on the right, the visible
  // world starts at x≈1080 — which is why his half of the diagram is built to
  // end at 1060.
  const cam: Cam = {
    x: S23_SUNNY.x,
    y: 400,
    zoom: 1 + close * 1.5,
    dx: -close * 500,
  };

  // **The grin, growing across the whole beat.** Nothing else in the scene is
  // allowed into those 36 frames, so it is one morph the length of the silence
  // plus a slow swell in the body underneath it — a face that reaches its new
  // pose in eight frames and then holds for twenty-eight has landed a cut in the
  // middle of a beat, which is the thing the revision reversed.
  const grow = clamp01((frame - growFrom) / Math.max(1, growTo - growFrom));
  // And the ray-fan, on the word. `a2_50_sunny` is "I DO have a point! I have
  // LOADS of points!", 2.93s; `silencedetect` puts its three spoken runs at
  // 0.27–0.99, 1.09–1.74 and 1.81–2.28s, so the last one — "of points!" — starts
  // at 0.62 of the clip. He fans on it and stays fanned: the pun is that he is
  // covered in points, and a fan that retracts is a man taking it back.
  const fan = clamp01((frame - (pointsFrom + (pointsTo - pointsFrom) * 0.62)) / 15);

  // Every face change in this scene happens in a silence, so all of them are
  // `emotionAt` and none of them are mapped to a line.
  const sunnyEmotion = emotionAt(
    frame,
    [
      { at: bragFrom, emotion: "excited" },
      // Held, absolutely still, through "I checked. Then I checked again."
      { at: checkFrom, emotion: "proud" },
      // The grin grows across the *whole* 36f beat, at the beat's own length.
      { at: growFrom, emotion: "excited", frames: Math.max(8, growTo - growFrom) },
    ],
    "proud",
    9,
  );
  const stage = useStage(scene);
  const rayEmotion = useEmotion(
    scene,
    "ray",
    { a2_46_ray: "neutral", a2_52_ray: "happy" },
    "happy",
    NO_LEAD,
  );

  const rayMark: Mark = {
    x: S23_RAY.x,
    y: hover("ray", S23_RAY.y, S23_RAY.scale),
    scale: S23_RAY.scale,
    who: "ray",
    side: "right",
    offset: 320,
  };
  // He is out of frame for the two beats in the middle; he does not creep back
  // in behind them either, so his bubble mark travels with him.
  const rayVisible = 1 - clamp01((close - 0.25) / 0.35);
  const sunnyScale = 1 + grow * 0.05;
  const sunnyMark: Mark = { ...S23_SUNNY, y: hover("sunny", 396, sunnyScale), scale: sunnyScale };

  return (
    <AbsoluteFill>
      <PaintedSky bg="sky_dome_day" phase={20} drift={9} />
      <Camera cam={cam}>
        <WrongDiagram build={build} air={air} from={{ x: S23_SUNNY.x - 150, y: 420 }} />

        {/* Still holding it, seven scenes later, and still dry. `wet` is 1
            exactly once in the episode and that was the cold open.
            Anchored to Sunny's own mark — tucked against his lower-left spike
            tips (radius ~250 of a ~246px spike reach) and riding his hover bob
            — because a roller at fixed world coordinates floated beside him,
            visibly detached, once the ray fan enlarged his silhouette
            (showrunner still review, batch (b)). z 23 keeps it in FRONT of the
            fan (z 22): held prop, not a thing lost among the points. */}
        <PaintRoller
          x={S23_SUNNY.x - 88}
          y={sunnyMark.y + 235}
          scale={0.82}
          rot={-96}
          wet={0}
          zIndex={23}
        />

        {/* **The pun, drawn.** Extra rays, behind the disc, fanning out on the
            word "points" — twenty-four of them on top of the twelve his own
            component spins, so a six-year-old who has just heard "LOADS of
            points" is looking at loads of points. Behind him rather than over
            him: the fan is his silhouette getting bigger, not a graphic. */}
        <RayFan x={S23_SUNNY.x} y={sunnyMark.y} scale={sunnyScale} fan={fan} />

        <Sunny
          x={S23_SUNNY.x}
          y={sunnyMark.y}
          scale={sunnyScale}
          phase={PHASE.sunny}
          emotion={sunnyEmotion}
          speaking={stage.speaking("sunny")}
          look={frame >= growFrom && frame < landTo ? { x: -0.2, y: 0.15 } : { x: -0.7, y: 0.25 }}
          // He is *held* in the smug beat and he swells in the one after it.
          // Both are stillness of a kind, and they are the two halves of the
          // joke: certainty, then vindication.
          idle={frame >= grinFrom && frame < growTo ? 0.35 : 1}
          eyeLife={frame >= grinFrom && frame < growTo ? 0.3 : 1}
          raySpeed={0.16}
          enter={{ at: 0, kind: "slideRight" }}
          zIndex={24}
        />

        {S23_RED_WALK ? <RedAcross from={rebuildFrom} frame={frame} fps={fps} /> : null}

        <div style={{ position: "absolute", inset: 0, opacity: rayVisible }}>
          <Ray
            x={S23_RAY.x}
            y={rayMark.y}
            scale={S23_RAY.scale}
            brightness={RAY_LIGHT.afterRainbow}
            spectrum={RAY_SPECTRUM.afterRainbow}
            phase={PHASE.ray}
            emotion={rayEmotion}
            speaking={stage.speaking("ray")}
            look={{ x: 0.85, y: -0.35 }}
            // "It lands on him. Nobody helps." — Ray is there, and does
            // nothing, for the whole thirty frames.
            idle={frame >= landFrom && frame < landTo ? 0.5 : 1}
            streak={0.25}
            zIndex={26}
          />
        </div>
      </Camera>

      <Bubbles
        scene={scene}
        cast={
          {
            sunny: projectMark(cam, sunnyMark),
            ray: projectMark(cam, rayMark),
          } as Cast
        }
        text={S23_BUBBLES}
        at={{
          a2_45_sunny: { x: 900, y: 200, tail: "right", tailAt: 1300 },
          a2_47_sunny: { x: 900, y: 200, tail: "right", tailAt: 1300 },
          a2_50_sunny: { x: 900, y: 210, tail: "right", tailAt: 1400 },
          a2_53_sunny: { x: 880, y: 200, tail: "right", tailAt: 1300 },
          // Ray talks from the bottom left corner and his bubble stays down
          // there with him: placed over his crown it sat straight across the
          // diagram, which is the thing both his lines are about.
          a2_46_ray: { x: 700, y: 800, tail: "left", tailAt: 430 },
          a2_52_ray: { x: 700, y: 800, tail: "left", tailAt: 430 },
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * The extra points. Twenty-four spikes behind Sunny's disc, growing out of it on
 * the word and staying out.
 *
 * Drawn here rather than added to the `Sunny` component on purpose: fanning is
 * not something the character does, it is something he does *once*, in one
 * scene, for one pun, and a `fan` prop on the kit's sun would be a joke living
 * in every episode forever.
 */
const RAY_FAN_N = 24;

const RayFan: React.FC<{ x: number; y: number; scale: number; fan: number }> = ({
  x,
  y,
  scale,
  fan,
}) => {
  if (fan <= 0.01) return null;
  const eased = kidEase.easeOutBack(fan, 1.6);
  return (
    <WideLayer zIndex={22}>
      <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={Math.min(1, fan * 2)}>
        {Array.from({ length: RAY_FAN_N }, (_, i) => {
          const long = i % 3 === 0;
          const len = (long ? 236 : 188) * eased;
          const half = long ? 20 : 15;
          return (
            <path
              key={i}
              transform={`rotate(${(360 / RAY_FAN_N) * i + 7.5})`}
              d={`M ${-half} -108 L 0 ${-108 - len} L ${half} -108 Z`}
              fill={kidTheme.sunDark}
              stroke={kidTheme.sunDeep}
              strokeWidth={7}
              strokeLinejoin="round"
            />
          );
        })}
      </g>
    </WideLayer>
  );
};

/**
 * Red, walking across the finished diagram at his one speed. Kept behind
 * `S23_RED_WALK`, which is off — see the argument on that constant.
 */
const RedAcross: React.FC<{ from: number; frame: number; fps: number }> = ({
  from,
  frame,
  fps,
}) => {
  const p = redWalk(Math.max(0, frame - from) / fps, { x: -220, y: 706 });
  return (
    <Shard
      who="red"
      x={p.x}
      y={hover("shard", p.y, 0.5)}
      scale={0.5}
      heading={p.angle}
      emotion="happy"
      look={{ x: 0.7, y: 0 }}
      idle={0.42}
      eyeLife={0.5}
      zIndex={14}
    />
  );
};

/**
 * The diagram Sunny builds out of his own beams, and the one that grows out of
 * it.
 *
 * `build` assembles his version — sun, beam, sky, and a roller on top of it,
 * because his claim is paint — and **never unbuilds it**: there is no `droop`
 * parameter any more and there is not supposed to be. `air` then rebuilds it
 * around him with the air drawn *in*: the same sun and the same beam, arriving
 * at a band of air, and blue leaving that band in every direction. Bigger than
 * his, shifted toward him so that he ends up standing inside it, and the only
 * thing in the frame that has got bigger by being corrected.
 */
/** The three puffs the corrected diagram's beam actually arrives at. */
const AIR_BAND = [
  { x: 566, y: 448 },
  { x: 648, y: 508 },
  { x: 726, y: 452 },
] as const;

const WrongDiagram: React.FC<{
  build: number;
  air: number;
  from: { x: number; y: number };
}> = ({ build, air, from }) => {
  const step = (a: number, b: number): number => kidEase.easeInOutSine((build - a) / (b - a));
  const sun = step(-0.2, 0.22);
  const beam = step(0.2, 0.48);
  const sky = step(0.46, 0.78);
  const clouds = step(0.76, 1);
  // **It rebuilds AROUND him**: bigger, and slid toward the man it is about, so
  // that on the button he is posing *inside* the corrected picture rather than
  // next to it. His own half is built to end at x = 1060 so the close-up can be
  // a close-up; grown and shifted, the corrected one reaches past 1400 and he is
  // standing in it.
  const grow = 1 + air * 0.28;
  const shift = air * 240;
  const cx = 640;
  const cy = 540;

  return (
    <WideLayer zIndex={12}>
      <g transform={`translate(${cx + shift} ${cy}) scale(${grow}) translate(${-cx} ${-cy})`}>
        {/* The construction beams: his light, holding his diagram up, and they
            never let go of it. */}
        {[0, 1, 2].map((i) => {
          const target = [
            { x: 240, y: 470 },
            { x: 640, y: 470 },
            { x: 900, y: 500 },
          ][i];
          const on = [sun, beam, sky][i];
          if (on <= 0.02) return null;
          return (
            <path
              key={i}
              d={`M ${from.x - shift} ${from.y} Q ${(from.x - shift + target.x) / 2} ${(from.y + target.y) / 2} ${target.x} ${target.y}`}
              stroke={kidTheme.sunLight}
              strokeWidth={13}
              strokeLinecap="round"
              fill="none"
              opacity={0.42 * on}
            />
          );
        })}

        {/* His sun. */}
        <g opacity={sun} transform="translate(240 470)">
          <circle r={86 * sun} fill={kidTheme.sun} stroke={kidTheme.sunDeep} strokeWidth={10} />
          {Array.from({ length: 10 }, (_, i) => (
            <path
              key={i}
              transform={`rotate(${i * 36})`}
              d={`M -13 -98 L 0 ${-140 * sun} L 13 -98 Z`}
              fill={kidTheme.sunDark}
            />
          ))}
        </g>

        {/* The beam, from the sun to the sky. On the rebuild it stops at the
            air instead of running all the way to the sky — which is the whole
            correction, drawn: sun to *air*, not sun to sky. */}
        <g opacity={beam}>
          <path
            d={`M 344 482 L ${344 + (560 - air * 260) * beam} 492`}
            stroke={kidTheme.sunLight}
            strokeWidth={26}
            strokeLinecap="round"
          />
        </g>

        {/* The air the beam actually arrives at — drawn in only on the rebuild,
            and the reason the second diagram is the true one. */}
        {air > 0.02 ? (
          <g opacity={air}>
            {/* A soft white behind the air band: `AirBlob` is pale by design
                (it is vapour), and pale-on-pale is the one thing the rebuilt
                diagram cannot afford — the air is the correction. */}
            <ellipse cx={648} cy={478} rx={200} ry={130} fill="#ffffff" opacity={0.45} />
            {AIR_BAND.map((p, i) => (
              <AirBlob
                key={i}
                x={p.x}
                y={p.y}
                r={50}
                t={i * 1.6}
                seed={i * 2.1}
                opacity={0.85}
                points={20}
              />
            ))}
            {/* Blue, leaving in every direction — **out of each puff**, not out
                of one hub. Twelve spokes from a single point is a starburst,
                which is a picture of an explosion; four out of each of three
                puffs is a picture of bouncing off things. */}
            {AIR_BAND.map((p, i) =>
              [0, 1, 2, 3].map((k) => {
                const a = (k / 4) * Math.PI * 2 + i * 0.5;
                const d = 74 + air * 120;
                return (
                  <g key={`${i}-${k}`}>
                    <path
                      d={`M ${p.x} ${p.y} L ${p.x + Math.cos(a) * d} ${p.y + Math.sin(a) * d}`}
                      stroke={SPECTRUM[4].fill}
                      strokeWidth={13}
                      strokeLinecap="round"
                      opacity={0.9}
                    />
                    <circle
                      cx={p.x + Math.cos(a) * d}
                      cy={p.y + Math.sin(a) * d}
                      r={15}
                      fill={SPECTRUM[4].fill}
                    />
                  </g>
                );
              }),
            )}
          </g>
        ) : null}

        {/* The sky his version says goes blue, with his roller on it. On the
            rebuild the roller goes and the sky is filled by the blue arriving
            from the air instead. */}
        <g opacity={sky}>
          <rect
            x={780}
            y={392}
            width={280 * sky}
            height={206}
            rx={40}
            fill={mixHex(kidTheme.skyLow, kidTheme.skyTop, 0.35 + 0.5 * sky)}
            stroke={kidTheme.ink}
            strokeWidth={9}
            opacity={0.95}
          />
          {/* Two clouds in it, so a blue rounded rectangle reads as a sky
              rather than as a screen — and they are the last thing to arrive,
              which is what keeps the diagram visibly assembling through the
              thirty-six frames after "He has a point." */}
          {clouds > 0.02 ? (
            <g opacity={0.8 * clouds}>
              <ellipse cx={866} cy={462} rx={52 * clouds} ry={23 * clouds} fill={kidTheme.cloud} />
              <ellipse cx={976} cy={522} rx={42 * clouds} ry={19 * clouds} fill={kidTheme.cloud} />
            </g>
          ) : null}
        </g>
      </g>
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 24 — Not the plain one any more
// ---------------------------------------------------------------------------

const S24_BUBBLES: Record<string, string> = {
  a2_56_ray: "Not the plain one any more.",
  // The catchphrase, first firing, and the act's last second.
  a2_57_ray: "Look up. That's me.",
};

/**
 * Scene 24 — the arc's turning point, and the shot the act has been walking
 * towards.
 *
 * Two numbers change here and neither is ever mentioned: he steps to
 * `RAY_LIGHT.full` and stays there for the rest of the episode. Then the camera
 * pulls back, and **keeps pulling back**, until he is one speck in a sky that
 * is entirely made of what he is doing — which is the same fact as Scene 20's
 * dome said about him instead of about the sky.
 */
const NotPlainAnymoreScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [brightFrom] = lineWindow(scene, "a2_56_ray");
  const [beatFrom, beatTo] = heldBeat(scene, "a2_56_ray");
  const [lookFrom] = lineWindow(scene, "a2_57_ray");

  // The last step of the ramp, ridden across his own line rather than cut, for
  // the reason Scene 13 gives: a change nobody mentions has to be something the
  // audience *notices*, and a cut is not noticing.
  const brightness = interpolate(frame, [brightFrom, beatFrom], [RAY_LIGHT.afterRainbow, RAY_LIGHT.full], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  // The pull back. It starts on the catchphrase and does not stop before the
  // cut: the last thing in the act is a speck, and the sky it is in is his.
  const pull = kidEase.easeInQuad(
    (frame - lookFrom + 6) / Math.max(1, scene.durationInFrames - lookFrom + 6),
  );
  const scale = 1.12 * (1 - pull * 0.94);
  const y = 512 - pull * 40;
  const t = frame / fps;

  const stage = useStage(scene);
  const rayEmotion = useEmotion(scene, "ray", { a2_56_ray: "proud", a2_57_ray: "excited" }, "happy", NO_LEAD);

  const rayMark: Mark = { x: 960, y: hover("ray", y, scale), scale, who: "ray", side: "right" };

  return (
    <AbsoluteFill>
      {/* The plate can only give back its own overscan — a `zoom` under ~0.99
          shows the edge of the painting — so it does the first inch of the pull
          and everything drawn in front of it does the rest. */}
      <PaintedSky bg="sky_dome_day" phase={21.1} drift={10} zoom={1.06 - pull * 0.06} />
      {/* Clouds sliding outward past the frame edges: the pull-back is carried
          by everything in front of the plate getting further away. */}
      <WideLayer zIndex={6}>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2 + 0.6;
          const d = 420 + pull * 1800;
          const cx = 960 + Math.cos(a) * d * 1.35;
          const cy = 620 + Math.sin(a) * d * 0.7 + Math.sin(t * 0.4 + i) * 8;
          const k = 1 - pull * 0.35;
          // Three lobes, not one lozenge: a single flat ellipse behind the hero
          // reads as a smudge on the lens, which is what the first pass looked
          // like in a still.
          return (
            <g key={i} opacity={0.34}>
              <ellipse cx={cx} cy={cy} rx={168 * k} ry={54 * k} fill="#ffffff" />
              <ellipse cx={cx - 62 * k} cy={cy - 26 * k} rx={78 * k} ry={52 * k} fill="#ffffff" />
              <ellipse cx={cx + 54 * k} cy={cy - 20 * k} rx={62 * k} ry={44 * k} fill="#ffffff" />
            </g>
          );
        })}
      </WideLayer>

      <Ray
        x={960}
        y={rayMark.y}
        scale={scale}
        brightness={brightness}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        // He looks up at the sky he is apparently the whole of, for the whole
        // of the thirty frames, and then tells the audience to do the same.
        look={frame >= beatFrom && frame < beatTo ? "up" : frame >= lookFrom ? "up" : "camera"}
        pose={frame >= lookFrom ? "cheer" : "rest"}
        idle={frame >= beatFrom && frame < beatTo ? 0.6 : 1}
        streak={0.35}
        zIndex={22}
      />

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark } as Cast}
        text={S24_BUBBLES}
        at={{
          a2_56_ray: { x: 960, y: 214, tail: "none" },
          a2_57_ray: { x: 960, y: 214, tail: "none" },
        }}
      />
    </AbsoluteFill>
  );
};

export const ACT2_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s14_why_only_blue: WhyOnlyBlueScene,
  s15_myth_sea: MythSeaScene,
  s16_myth_paint: MythPaintScene,
  s17_not_empty: NotEmptyScene,
  s18_red_straight: RedStraightScene,
  s19_blue_everywhere: BlueEverywhereScene,
  s20_every_direction: EveryDirectionScene,
  s21_bigword_scatter: BigWordScatterScene,
  s22_interlock: InterlockScene,
  s23_sunny_wrong: SunnyWrongScene,
  s24_not_plain_anymore: NotPlainAnymoreScene,
};
