import React from "react";
import {
  emotionAt,
  kidEase,
  kidOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  mixHex,
} from "../../../lib/kid";
import {
  ACT_COLOR,
  AbsoluteFill,
  AirBlob,
  BigWordBeat,
  Bubbles,
  Camera,
  CutFlash,
  PHASE,
  PaintRoller,
  PaintedSky,
  Puff,
  RAY_LIGHT,
  RAY_SPECTRUM,
  Ray,
  RayShard,
  SPECTRUM,
  SoftShade,
  Sunny,
  WideLayer,
  heldBeat,
  hover,
  interpolate,
  lineWindow,
  plateY,
  projectMark,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cam,
  type Cast,
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
};

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

      <CutFlash at={stampAt} strength={0.3} />
      {/* It leaves on the wipe. A stamp still sitting on the desert — and then
          on the grey bay — turns two counter-examples into one long caption. */}
      <MythStamp at={stampAt} until={desertFrom + 4} x={1096} y={412} />

      <Bubbles scene={scene} cast={{ ray: rayMark } as Cast} text={S15_BUBBLES} />
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

const S16_SUNNY: Mark = { x: 1352, y: hover("sunny", 372, 0.86), scale: 0.86, who: "sunny", side: "left" };
/**
 * Where the roller is working, and what the camera pushes in on.
 *
 * Close enough to Sunny that the handle end runs back into him: he has no arms
 * (he is a disc with rays), so the prop is *held* only by being in contact with
 * the body, exactly as the cold open holds it.
 */
const S16_ROLLER = { x: 1126, y: 566 } as const;
/** The fixed point of the push-in: between the sleeve and his face, so the
 *  beat frames the dry roller AND the man holding it. */
const S16_FOCUS = { x: 1180 } as const;

const S16_BUBBLES: Record<string, string> = {
  a2_10_sunny: "I am GOOD at painting!",
  a2_12_sunny: "I keep it somewhere else.",
};

/**
 * Scene 16 — a ladder in the sky, a dust sheet, and a roller that is completely
 * dry.
 *
 * The beat is the whole scene: forty-five frames of Sunny holding an empty
 * roller while nobody says anything. Three things are staged for it and nothing
 * else moves inside it — **the stroke stops** on the first frame of "Sunny.
 * Show us the paint" (everything stops, script.md), the camera pushes in on the
 * sleeve so the audience can see there is nothing on it, and his face does not
 * begin to fall until ten frames *into* the silence, which is the emotion-lead
 * rule made literal: a reaction that starts under the Narrator's question is
 * the joke being answered before it is asked.
 */
const MythPaintScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [strokeFrom] = lineWindow(scene, "a2_10_sunny");
  const [stopAt] = lineWindow(scene, "a2_11_narrator");
  const [beatFrom, beatTo] = heldBeat(scene, "a2_11_narrator");
  const [recoverFrom] = lineWindow(scene, "a2_12_sunny");

  // He paints a patch of sky that is already blue, up and down, until he is
  // told to stop. Frozen — not eased out — because "everything stops".
  const painting = frame >= strokeFrom && frame < stopAt;
  const strokeT = (Math.min(frame, stopAt) - strokeFrom) / fps;
  // Kept below his face: the handle runs back into his disc (that is what
  // "holding it" looks like on a character with no arms), but a stroke that
  // reached his eye line put a red grip across his face in the push-in.
  const strokeY = S16_ROLLER.y + Math.sin(strokeT * 3.1) * 84;
  const sheen = Math.max(0, Math.min(1, (frame - strokeFrom) / 60));

  // The push in on the sleeve. It lands inside the first third of the beat and
  // then holds absolutely still for a second — the shot has to be *stopped*,
  // not slowing down, or the stillness reads as a move that has not finished.
  const push = kidEase.easeInOutSine((frame - beatFrom) / 20);
  const cam: Cam = {
    x: S16_FOCUS.x,
    y: strokeY - 30,
    zoom: 1 + push * 0.5,
  };

  // His face goes in the silence, so there is no line to hang it on.
  const sunnyEmotion = emotionAt(
    frame,
    [
      { at: strokeFrom, emotion: "excited" },
      { at: beatFrom + 10, emotion: "neutral" },
      { at: recoverFrom, emotion: "proud" },
    ],
    "proud",
    9,
  );
  const stage = useStage(scene);
  const sunnyMark: Mark = { ...S16_SUNNY };

  return (
    <AbsoluteFill>
      <PaintedSky bg="sky_dome_day" phase={12.3} drift={9} />
      <Camera cam={cam}>
        <WideLayer zIndex={6}>
          {/* The dust sheet, over a cloud, because a professional protects the
              floor. There is no floor. */}
          <g opacity={0.5}>
            <ellipse cx={760} cy={906} rx={330} ry={116} fill={kidTheme.cloud} />
            <ellipse cx={1180} cy={926} rx={300} ry={100} fill={kidTheme.cloud} />
          </g>
          <g opacity={0.95}>
            <path
              d="M 470 880 q 150 -70 330 -30 q 190 44 360 -10 q 170 -54 330 10 l 30 300 l -1080 0 Z"
              fill={kidTheme.paper}
              stroke={kidTheme.cloudShade}
              strokeWidth={9}
              strokeLinejoin="round"
            />
            <path
              d="M 640 900 q 150 40 300 6 M 1000 934 q 160 34 300 -10"
              stroke={kidTheme.cloudShade}
              strokeWidth={7}
              fill="none"
              opacity={0.8}
            />
          </g>
          {/* The patch he has been working on: no paint on it anywhere, just a
              faint sheen where a dry sleeve has been over the same blue. */}
          <g opacity={sheen * 0.5}>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={890}
                y={330 + i * 74}
                width={300}
                height={54}
                rx={26}
                fill="#ffffff"
                opacity={0.35 - i * 0.05}
              />
            ))}
          </g>
        </WideLayer>

        {/* Ladder and tray to the left of the roller, Sunny to the right of it:
            three things at three x's, so the push-in frames all of them and
            none of them is standing on anybody. */}
        <Ladder x={1010} y={1088} />
        {/* The tray, on the ladder's top rung, and as empty as the roller. It
            has to be in the push-in frame: script.md says the tray is dry too,
            and a fact stated off screen is not staged. */}
        <PaintTray x={932} y={706} />

        <PaintRoller
          x={S16_ROLLER.x}
          y={strokeY}
          scale={1.05}
          rot={-96 + (painting ? Math.sin(strokeT * 3.1) * 5 : 0)}
          // **Zero, and it is the entire scene.** The roller is 1 exactly once
          // in the episode and that is the cold open, where the show lets him
          // appear to be right.
          wet={0}
          zIndex={22}
        />

        <Sunny
          x={S16_SUNNY.x}
          y={S16_SUNNY.y}
          scale={0.86}
          phase={PHASE.sunny}
          emotion={sunnyEmotion}
          speaking={stage.speaking("sunny")}
          look={frame >= beatFrom && frame < beatTo ? { x: -0.75, y: 0.5 } : { x: -0.6, y: 0.3 }}
          // Nothing moves in the beat. His breath drops to almost nothing and
          // his eyes stop wandering: deadpan is stillness.
          idle={frame >= beatFrom && frame < beatTo ? 0.35 : 1}
          eyeLife={frame >= beatFrom && frame < beatTo ? 0.35 : 1}
          raySpeed={frame >= beatFrom && frame < beatTo ? 0.04 : 0.16}
          zIndex={18}
        />
      </Camera>

      <Bubbles
        scene={scene}
        cast={{ sunny: projectMark(cam, sunnyMark) } as Cast}
        text={S16_BUBBLES}
        at={{
          a2_10_sunny: { x: 640, y: 210, tail: "right", tailAt: 1100 },
          a2_12_sunny: { x: 660, y: 210, tail: "right", tailAt: 1100 },
        }}
      />
    </AbsoluteFill>
  );
};

/** A step ladder, standing in the sky, because he is a professional. */
const Ladder: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <WideLayer zIndex={10}>
    <g stroke="#b3762f" strokeWidth={22} strokeLinecap="round" fill="none">
      <path d={`M ${x - 96} ${y + 260} L ${x - 30} ${y - 560}`} />
      <path d={`M ${x + 96} ${y + 260} L ${x + 30} ${y - 560}`} />
    </g>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const t = i / 6;
      const ry = y + 240 - t * 780;
      const half = 92 - t * 62;
      return (
        <path
          key={i}
          d={`M ${x - half} ${ry} L ${x + half} ${ry}`}
          stroke="#d59544"
          strokeWidth={18}
          strokeLinecap="round"
        />
      );
    })}
  </WideLayer>
);

/** The tray. Bone dry, and the second half of the same joke. */
const PaintTray: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <WideLayer zIndex={12}>
    <g transform={`translate(${x} ${y}) rotate(-4)`}>
      <path
        d="M -110 -26 L 120 -26 L 96 54 L -86 54 Z"
        fill="#e8e2d4"
        stroke={kidTheme.ink}
        strokeWidth={9}
        strokeLinejoin="round"
      />
      {/* The well, with nothing in it. The highlight is the *tray*, not paint. */}
      <path d="M -70 12 L 84 12 L 74 42 L -60 42 Z" fill="#d5cec0" />
      <path d="M -96 -12 L 104 -12" stroke="#ffffff" strokeWidth={7} opacity={0.7} />
    </g>
  </WideLayer>
);

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
};

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
        cast={{ ray: rayMark, puff: puffMark } as Cast}
        text={S17_BUBBLES}
        at={{
          a2_15_ray: { x: 1320, y: 190, tail: "left", tailAt: 1290 },
          a2_19_ray: { x: 1320, y: 190, tail: "left", tailAt: 1290 },
          a2_17_puff: { x: 620, y: 226, tail: "right", tailAt: 706 },
          a2_20_puff: { x: 620, y: 226, tail: "right", tailAt: 706 },
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
 * Scene 18 sends Red through it, Scene 19 sends Blue through the *same*
 * corridor with the *same* puffs from the *same* entry point, and Scene 21
 * freezes it behind the Big Word. That is the comparison, so it has to be one
 * component with one set of numbers: two hand-placed ball pits that differed by
 * thirty pixels would quietly turn a controlled experiment into two pictures.
 */
const CORRIDOR = { top: 236, bottom: 916, x0: -200, x1: 2120 } as const;

/**
 * Where Blue bounces, in order, and therefore where the puffs are.
 *
 * Hand-placed rather than generated: the ricochet has to go *backwards* twice
 * (points 4 and 7) and end up leaving the corridor upwards, because "in every
 * direction including backwards" is the sentence the picture is making, and a
 * seeded random walk gives a drunkard's stagger that mostly still goes right.
 */
const BOUNCE = [
  { x: -190, y: 612 },
  { x: 336, y: 452 },
  { x: 548, y: 806 },
  { x: 286, y: 872 },
  { x: 792, y: 366 },
  { x: 1084, y: 704 },
  { x: 868, y: 296 },
  { x: 1338, y: 512 },
  { x: 1166, y: 862 },
  { x: 1604, y: 372 },
  { x: 1414, y: 726 },
  { x: 1806, y: 828 },
  { x: 1556, y: 262 },
  { x: 2140, y: 470 },
] as const;

/** The one Blue bounces off on Puff's own line. */
const PUFF_BOUNCE = 5;

/** Cumulative 0..1 time of each bounce, at a constant speed. */
const BOUNCE_AT = (() => {
  const d = [0];
  for (let i = 1; i < BOUNCE.length; i++) {
    const dx = BOUNCE[i].x - BOUNCE[i - 1].x;
    const dy = BOUNCE[i].y - BOUNCE[i - 1].y;
    d.push(d[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  const total = d[d.length - 1];
  return d.map((v) => v / total);
})();

/**
 * The ball pit: a puff on every bounce point, plus filler between them so the
 * corridor is full rather than dotted. Red clips one or two of these without
 * changing direction at all, which is the control case in one sentence.
 */
const PUFFS = [
  ...BOUNCE.slice(1, BOUNCE.length - 1).map((p, i) => ({
    x: p.x,
    y: p.y,
    r: 52 + ((i * 17) % 22),
    seed: i * 1.7,
  })),
  ...Array.from({ length: 16 }, (_, i) => {
    const k = i * 43 + 11;
    return {
      x: -60 + ((k * 137) % 2060),
      y: CORRIDOR.top + 70 + ((k * 89) % (CORRIDOR.bottom - CORRIDOR.top - 150)),
      r: 34 + ((k * 23) % 26),
      seed: 3.1 + i * 2.3,
    };
  }),
];

/** Where Blue is at `u` (0..1 through the pinball), and the trail behind him. */
function blueAt(u: number): { x: number; y: number; leg: number } {
  const t = Math.max(0, Math.min(1, u));
  for (let i = 1; i < BOUNCE.length; i++) {
    if (t <= BOUNCE_AT[i]) {
      const k = (t - BOUNCE_AT[i - 1]) / Math.max(1e-6, BOUNCE_AT[i] - BOUNCE_AT[i - 1]);
      return {
        // Light does not accelerate and it does not ease: the legs are linear
        // and the *turns* are what carry the energy.
        x: BOUNCE[i - 1].x + (BOUNCE[i].x - BOUNCE[i - 1].x) * k,
        y: BOUNCE[i - 1].y + (BOUNCE[i].y - BOUNCE[i - 1].y) * k,
        leg: i - 1 + k,
      };
    }
  }
  const last = BOUNCE[BOUNCE.length - 1];
  return { x: last.x, y: last.y, leg: BOUNCE.length - 1 };
}

const Corridor: React.FC<{ t: number; puffDim?: number }> = ({ t, puffDim = 1 }) => (
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
      {PUFFS.map((p, i) => (
        <AirBlob
          key={i}
          x={p.x + Math.sin(t * 0.5 + p.seed) * 7}
          y={p.y + Math.cos(t * 0.42 + p.seed * 1.3) * 6}
          r={p.r}
          t={t + p.seed}
          seed={p.seed}
          opacity={0.5 * puffDim}
          points={20}
        />
      ))}
    </WideLayer>
  </>
);

/** The pale diagram bed all three corridor scenes sit on. */
const CorridorBed: React.FC<{ phase: number }> = ({ phase }) => (
  <div style={{ position: "absolute", inset: 0, opacity: 0.34, filter: "saturate(0.7)" }}>
    <PaintedSky bg="sky_dome_day" phase={phase} drift={7} />
  </div>
);

// ---------------------------------------------------------------------------
// Scene 18 — Red goes straight through
// ---------------------------------------------------------------------------

/**
 * Scene 18 — and it is staged **boring on purpose**.
 *
 * Red enters left under his own line, crosses the entire frame at a constant
 * speed on one horizontal line, clips two puffs without deviating by a pixel,
 * and leaves. There is no arc, no bank, no ease and no camera move, which is
 * the only place in this act `kidEase.linear` is the right answer. The thirty
 * frames of silence in the middle are the crossing, and a child who only ever
 * sees Scene 19's pinball has watched a special effect instead of a comparison.
 */
const RED_Y = 612;

const RedStraightScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [redFrom, redLineTo] = lineWindow(scene, "a2_23_narrator");
  const [, beatTo] = heldBeat(scene, "a2_23_narrator");

  // He sets off on the second half of "Red goes first…" and is out of frame by
  // the last frame of the silence, so the beat *is* the crossing.
  const startAt = redFrom + Math.round((redLineTo - redFrom) * 0.45);
  const u = kidEase.linear((frame - startAt) / Math.max(1, beatTo - startAt));
  const x = CORRIDOR.x0 - 60 + u * (CORRIDOR.x1 - CORRIDOR.x0 + 200);

  return (
    <AbsoluteFill style={{ background: "#eaf6ff" }}>
      <CorridorBed phase={14.5} />
      <Corridor t={frame / fps} />

      {/* The line he leaves behind him, and the reason it is still on screen
          under "Straight through. Barely touched the sides." — the evidence has
          to outlast the demonstration or the next scene has nothing to beat. */}
      <WideLayer zIndex={14}>
        {u > 0 ? (
          <path
            d={`M ${CORRIDOR.x0 - 60} ${RED_Y} L ${x} ${RED_Y}`}
            stroke={SPECTRUM[0].fill}
            strokeWidth={13}
            strokeLinecap="round"
            opacity={0.4}
          />
        ) : null}
      </WideLayer>

      <RayShard
        color={0}
        x={x}
        y={hover("shard", RED_Y, 1.25)}
        // Big, and bigger than Scene 19's Blue: "big and calm" is the half of
        // the comparison this scene owns.
        scale={1.25}
        phase={0.7}
        emotion="happy"
        look={{ x: 0.7, y: 0 }}
        // No bank, no bob, no wobble. He is big and calm and he is not
        // interested in any of this.
        idle={0.45}
        eyeLife={0.5}
        zIndex={20}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 19 — Blue goes everywhere
// ---------------------------------------------------------------------------

const S19_PUFF = {
  x: BOUNCE[PUFF_BOUNCE].x,
  y: BOUNCE[PUFF_BOUNCE].y,
  scale: 0.92,
} as const;

/** Above the corridor, watching his own blue go everywhere. */
const S19_RAY = { x: 1616, y: 132, scale: 0.5 } as const;

const S19_BUBBLES: Record<string, string> = {
  a2_26_puff: "Everybody bounce off Puff!",
  a2_28_ray: "Where did Blue GO?",
};

/**
 * The secondary blues: what every puff Blue touches sends off sideways.
 *
 * They are dots rather than characters on purpose — the seven are a crowd and
 * not a cast, and fourteen more faces would turn the mechanism into a party.
 * Each one leaves the bounce it was born on, in its own direction, and keeps
 * going, so that by the end of the silence there is blue moving in every
 * direction in frame. **Nothing has been taken from Blue**: he is still
 * bouncing, and these are the copies of him arriving everywhere else.
 */
const SPRAY = Array.from({ length: 15 }, (_, i) => {
  const k = i * 37 + 5;
  return {
    from: 1 + (i % (BOUNCE.length - 3)),
    angle: ((k * 97) % 628) / 100,
    speed: 640 + ((k * 53) % 420),
    born: 0.18 + ((k * 29) % 70) / 100,
    r: 13 + ((k * 17) % 9),
  };
});

const BlueEverywhereScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [blueFrom, blueLineTo] = lineWindow(scene, "a2_25_narrator");
  const [, beatTo] = heldBeat(scene, "a2_27_narrator");
  const [goneFrom] = lineWindow(scene, "a2_28_ray");

  // The pinball runs from the second half of "Now Blue…" to the last frame of
  // the 45-frame silence — the beat is the build, and nothing is said over it.
  const startAt = blueFrom + Math.round((blueLineTo - blueFrom) * 0.5);
  const span = Math.max(1, beatTo - startAt);
  const u = Math.max(0, Math.min(1, (frame - startAt) / span));
  const blue = blueAt(u);
  const t = frame / fps;

  // He does not leave, and he is not removed: by the time Ray asks where Blue
  // went, blue is the trails and the spray, which is the honest answer to the
  // question and the one the next scene needs.
  const heroAlpha = 1 - kidEase.easeInOutSine((frame - goneFrom + 18) / 22);

  // Already vibrating before he enters, and harder every time he is hit.
  const jitter = 5 + 3.5 * Math.sin(t * 26);
  const hit = Math.max(0, 1 - (blue.leg % 1) * 5);

  const stage = useStage(scene);
  const rayEmotion = useEmotion(scene, "ray", { a2_28_ray: "amazed" }, "amazed", NO_LEAD);
  const puffEmotion = useEmotion(scene, "puff", { a2_26_puff: "excited" }, "happy", NO_LEAD);

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

  return (
    <AbsoluteFill style={{ background: "#eaf6ff" }}>
      <CorridorBed phase={15.6} />
      <Corridor t={t} />

      <BlueTrails u={u} now={blue} />
      <BlueSpray u={u} span={span / fps} />

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
        zIndex={18}
      />

      <RayShard
        color={4}
        x={blue.x + Math.sin(t * 31) * jitter}
        y={blue.y + Math.cos(t * 27) * jitter}
        // Small and quick (script.md's own staging note), and the difference
        // that actually reads is the shaking and the ricochet, not the size.
        scale={0.85 * (1 + hit * 0.16)}
        phase={1.6}
        emotion="excited"
        look={{ x: 0.4, y: -0.2 }}
        idle={1.6}
        opacity={Math.max(0, Math.min(1, heroAlpha))}
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
        cast={{ puff: puffMark, ray: rayMark } as Cast}
        text={S19_BUBBLES}
        at={{
          a2_26_puff: { x: 1130, y: 224, tail: "right", tailAt: S19_PUFF.x },
          a2_28_ray: { x: 1180, y: 148, tail: "right", tailAt: S19_RAY.x },
        }}
      />
    </AbsoluteFill>
  );
};

/** Every leg Blue has already flown, still on screen. */
const BlueTrails: React.FC<{ u: number; now: { x: number; y: number; leg: number } }> = ({
  u,
  now,
}) => (
  <WideLayer zIndex={12}>
    {BOUNCE.slice(0, -1).map((p, i) => {
      if (i > now.leg) return null;
      const to = i < now.leg ? BOUNCE[i + 1] : now;
      return (
        <path
          key={i}
          d={`M ${p.x} ${p.y} L ${to.x} ${to.y}`}
          stroke={SPECTRUM[4].fill}
          strokeWidth={12}
          strokeLinecap="round"
          fill="none"
          // The oldest legs fade a little but never go: the frame has to end up
          // criss-crossed, which is the picture the Big Word freezes.
          opacity={0.55 - Math.min(0.28, (now.leg - i) * 0.035)}
        />
      );
    })}
    {/* A flash on the bounce he is closest to, so a turn reads as an impact. */}
    {u > 0 && u < 1 ? (
      <circle
        cx={BOUNCE[Math.min(BOUNCE.length - 1, Math.round(now.leg))].x}
        cy={BOUNCE[Math.min(BOUNCE.length - 1, Math.round(now.leg))].y}
        r={70 * Math.max(0, 1 - Math.abs(now.leg - Math.round(now.leg)) * 6)}
        fill={SPECTRUM[4].light}
        opacity={0.4 * Math.max(0, 1 - Math.abs(now.leg - Math.round(now.leg)) * 6)}
      />
    ) : null}
  </WideLayer>
);

/**
 * Blue arriving everywhere else.
 *
 * Each one **loops** off its own bounce point rather than flying away once, so
 * the frame keeps filling for as long as the silence lasts instead of emptying
 * two seconds in. That is not decoration: blue bouncing off air is not an event
 * that happened, it is a thing that is happening, which is exactly what the
 * next scene ("wherever you look, blue is bouncing into your eyes") needs the
 * audience to have already seen.
 */
const SPRAY_LOOP = 2.4;

const BlueSpray: React.FC<{ u: number; span: number }> = ({ u, span }) => (
  <WideLayer zIndex={13}>
    {SPRAY.map((s, i) => {
      const age = (u - s.born) * span;
      if (age <= 0) return null;
      const p = (age % SPRAY_LOOP) / SPRAY_LOOP;
      const from = BOUNCE[s.from];
      const d = 50 + p * s.speed * SPRAY_LOOP * 0.6;
      const x = from.x + Math.cos(s.angle) * d;
      const y = from.y + Math.sin(s.angle) * d;
      const tail = Math.min(d, 190);
      const fade = Math.sin(Math.PI * Math.min(1, p * 1.25));
      return (
        <g key={i} opacity={0.85 * fade}>
          <path
            d={`M ${x - Math.cos(s.angle) * tail} ${y - Math.sin(s.angle) * tail} L ${x} ${y}`}
            stroke={SPECTRUM[4].fill}
            strokeWidth={9}
            strokeLinecap="round"
            opacity={0.45}
          />
          <circle cx={x} cy={y} r={s.r} fill={SPECTRUM[4].fill} />
          <circle cx={x - s.r * 0.3} cy={y - s.r * 0.35} r={s.r * 0.4} fill={SPECTRUM[4].light} />
        </g>
      );
    })}
  </WideLayer>
);

// ---------------------------------------------------------------------------
// Scene 20 — Blue, from every direction
// ---------------------------------------------------------------------------

/** Blue arriving at the lens from everywhere at once. */
const ARROWS = Array.from({ length: 30 }, (_, i) => {
  const k = i * 47 + 3;
  return {
    angle: (i / 30) * Math.PI * 2 + ((k % 13) / 13) * 0.18,
    start: 0.62 + ((k * 31) % 60) / 100,
    at: ((k * 17) % 100) / 100,
    len: 150 + ((k * 29) % 130),
  };
});

const S20_RAY = { x: 1466, y: 686, scale: 0.56 };

const S20_BUBBLES: Record<string, string> = {
  a2_32_ray: "From ALL of the sky!",
  a2_34_ray: "Violet bounces even more!",
};

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
 */
const EveryDirectionScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [arrowFrom] = lineWindow(scene, "a2_30_narrator");
  const [domeFrom, domeTo] = lineWindow(scene, "a2_33_narrator");
  const [beatFrom, beatTo] = heldBeat(scene, "a2_33_narrator");
  const [violetFrom] = lineWindow(scene, "a2_34_ray");
  const [eyeFrom] = lineWindow(scene, "a2_35_narrator");
  const [blueEyeFrom] = lineWindow(scene, "a2_36_narrator");

  const t = frame / fps;
  const arrows = kidEase.easeInOutSine((frame - arrowFrom - 10) / 40);
  // The pull back out to the dome, landing exactly as the silence opens.
  const pull = kidEase.easeInOutSine((frame - domeFrom - 20) / Math.max(1, beatFrom - domeFrom - 10));
  const glow = 0.5 + 0.5 * Math.sin((frame - domeTo) * 0.06);
  const violet = kidEase.easeInOutSine((frame - violetFrom) / 26);
  const eye = kidEase.easeOutBack(Math.max(0, Math.min(1, (frame - eyeFrom) / 22)), 1.2);
  const blueEye = kidEase.easeInOutSine((frame - blueEyeFrom - 6) / 20);

  const stage = useStage(scene);
  const rayEmotion = useEmotion(scene, "ray", { a2_32_ray: "amazed", a2_34_ray: "happy" }, "happy", NO_LEAD);

  const rayMark: Mark = {
    x: S20_RAY.x,
    y: hover("ray", S20_RAY.y, S20_RAY.scale),
    scale: S20_RAY.scale,
    who: "ray",
    side: "left",
  };

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

      <ArrivingArrows u={Math.max(0, Math.min(1, arrows)) * (1 - Math.max(0, Math.min(1, pull)))} t={t} />
      <BlueDome u={Math.max(0, Math.min(1, pull))} glow={glow} t={t} />

      {/* The honesty tax: violet really does bounce more, and the reason the
          sky is not violet is in the eye. Two small pictures, two lines. */}
      <VioletCase u={Math.max(0, Math.min(1, violet))} t={t} />
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
        look={frame >= beatFrom && frame < beatTo ? "up" : { x: -0.4, y: -0.5 }}
        // Nothing moves inside the dome beat, including him.
        idle={frame >= beatFrom && frame < beatTo ? 0.4 : 1}
        streak={0.25}
        zIndex={26}
      />

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark } as Cast}
        text={S20_BUBBLES}
        at={{
          a2_32_ray: { x: 1330, y: 264, tail: "right", tailAt: S20_RAY.x },
          a2_34_ray: { x: 1330, y: 264, tail: "right", tailAt: S20_RAY.x },
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Dozens of blue arrows, all of them pointed at you.
 *
 * They converge on a point a little below the middle of the frame — the lens,
 * i.e. the viewer standing in that street — and they keep arriving rather than
 * arriving once, because blue bouncing into your eyes is not an event that
 * happened, it is the condition you are standing in.
 *
 * Every one gets a paper underlay. The first pass drew them in `SPECTRUM[4]`
 * straight onto a painted street and they read as scratches on the plate: a
 * mid-blue line on a blue sky has almost no value contrast, which is the same
 * lesson Ray's outline is built on.
 */
const LENS = { x: 960, y: 610 } as const;

const ArrivingArrows: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  if (u <= 0.01) return null;
  return (
    <WideLayer zIndex={14} opacity={u}>
      {ARROWS.map((a, i) => {
        const p = ((t * 0.5 + a.at) % 1 + 1) % 1;
        const dist = 260 + a.start * (1 - p) * 1250;
        const cx = LENS.x + Math.cos(a.angle) * dist;
        const cy = LENS.y + Math.sin(a.angle) * dist * 0.86;
        const tx = LENS.x + Math.cos(a.angle) * Math.max(150, dist - a.len);
        const ty = LENS.y + Math.sin(a.angle) * Math.max(150, dist - a.len) * 0.86;
        const fade = Math.sin(Math.PI * Math.min(1, p * 1.3));
        const head = `M ${tx} ${ty} l ${Math.cos(a.angle + 2.55) * 52} ${Math.sin(a.angle + 2.55) * 52} l ${Math.cos(a.angle - 2.55) * 52 - Math.cos(a.angle + 2.55) * 52} ${Math.sin(a.angle - 2.55) * 52 - Math.sin(a.angle + 2.55) * 52} Z`;
        return (
          <g key={i} opacity={0.9 * fade}>
            <path
              d={`M ${cx} ${cy} L ${tx} ${ty}`}
              stroke={kidTheme.paper}
              strokeWidth={26}
              strokeLinecap="round"
              opacity={0.55}
            />
            <path d={head} fill={kidTheme.paper} opacity={0.55} />
            <path
              d={`M ${cx} ${cy} L ${tx} ${ty}`}
              stroke={SPECTRUM[4].fill}
              strokeWidth={15}
              strokeLinecap="round"
            />
            <path d={head} fill={SPECTRUM[4].fill} />
          </g>
        );
      })}
    </WideLayer>
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

const BlueDome: React.FC<{ u: number; glow: number; t: number }> = ({ u, glow, t }) => {
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
    </WideLayer>
  );
};

/**
 * Violet, bouncing harder than blue, in the left of the dome.
 *
 * Two dots and two trails, and the only thing being said is that the violet one
 * is the busier of the two — which is true, and is the setup for the honest
 * answer. No panel, no label: a bordered inset would read as a second diagram,
 * and this is a footnote.
 */
const VioletCase: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  if (u <= 0.01) return null;
  // Where each one is at time `tt`, so the same function draws the dot and the
  // few frames of path behind it. The trail is what makes "bounces even more"
  // legible in a single still rather than only in motion.
  const at = (
    tt: number,
    k: number,
    speed: number,
    amp: number,
    dy: number,
  ): { x: number; y: number } => ({
    x: 392 + Math.sin(tt * speed + k) * amp + Math.sin(tt * speed * 2.3 + k) * amp * 0.3,
    y: 452 + Math.cos(tt * speed * 1.37 + k * 2.1) * amp * 0.66 + dy,
  });
  const trail = (k: number, speed: number, amp: number, dy: number): string =>
    [0, 1, 2, 3, 4, 5]
      .map((i) => {
        const p = at(t - i * 0.055, k, speed, amp, dy);
        return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      })
      .join(" ");
  const v = at(t, 0, 4.6, 132, 0);
  const b = at(t, 2.4, 2, 58, 140);
  return (
    <WideLayer zIndex={18} opacity={u}>
      <path d={trail(0, 4.6, 132, 0)} stroke={SPECTRUM[6].fill} strokeWidth={11} fill="none" strokeLinecap="round" opacity={0.45} />
      <path d={trail(2.4, 2, 58, 140)} stroke={SPECTRUM[4].fill} strokeWidth={11} fill="none" strokeLinecap="round" opacity={0.45} />
      <circle cx={v.x} cy={v.y} r={34} fill={SPECTRUM[6].fill} />
      <circle cx={v.x - 10} cy={v.y - 11} r={13} fill={SPECTRUM[6].light} />
      <circle cx={b.x} cy={b.y} r={34} fill={SPECTRUM[4].fill} />
      <circle cx={b.x - 10} cy={b.y - 11} r={13} fill={SPECTRUM[4].light} />
    </WideLayer>
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
};

/**
 * Scene 21 — the house Big Word beat, third firing in the episode, unchanged.
 *
 * script.md asks for "letters bouncing in one at a time, each one arriving from
 * a different direction". The card's letters are the show's signature and are
 * identical in every firing (that is *why* a six-year-old joins in), so the
 * directions are staged as what the letters arrive **on**: seven blue streaks
 * converging on the banner from seven different angles, one per letter, on the
 * card's own stagger. The word is spelled the way it always is; the picture
 * says where it came from.
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
        <ScatterArrivals from={slamAt} letters={7} />
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
        cast={{ ray: rayMark } as Cast}
        text={S21_BUBBLES}
        at={{ a2_41_ray: { x: 760, y: 690, tail: "left", tailAt: 470 } }}
      />
    </AbsoluteFill>
  );
};

/** The action the Big Word freezes: Scene 19's corridor, at full criss-cross. */
const PinballStill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#eaf6ff" }}>
      <CorridorBed phase={15.6} />
      <Corridor t={frame / fps} />
      <BlueTrails u={1} now={{ ...BOUNCE[BOUNCE.length - 1], leg: BOUNCE.length - 1 }} />
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

/** One streak per letter, each arriving from its own direction, on the card's
 *  own stagger (`WordCard`'s default is 2.5 frames a letter). */
const ScatterArrivals: React.FC<{ from: number; letters: number }> = ({ from, letters }) => {
  const frame = useCurrentFrame();
  return (
    <WideLayer zIndex={44}>
      {Array.from({ length: letters }, (_, i) => {
        const u = (frame - from - i * 2.5) / 12;
        if (u < 0 || u > 1) return null;
        const angle = (i / letters) * Math.PI * 2 + 0.4;
        const d = (1 - kidEase.easeOutCubic(u)) * 900 + 40;
        const x = 960 + Math.cos(angle) * d;
        const y = 300 + Math.sin(angle) * d * 0.8;
        return (
          <path
            key={i}
            d={`M ${x + Math.cos(angle) * 210} ${y + Math.sin(angle) * 168} L ${x} ${y}`}
            stroke={SPECTRUM[4].fill}
            strokeWidth={16}
            strokeLinecap="round"
            opacity={0.75 * (1 - u)}
          />
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
};

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

      <Bubbles scene={scene} cast={{ puff: puffMark } as Cast} text={S22_BUBBLES} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 23 — Sunny is wrong
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
  a2_50_sunny: "I have NEVER been wrong.",
  a2_52_ray: "That blue is your light.",
  a2_53_sunny: "THE SKY IS MY LIGHT!",
};

/**
 * Scene 23 — the longest scene in the episode, five held beats, and the one the
 * whole series has been setting up.
 *
 * Episode two planted "One day Sunny will be wrong about something. It is not
 * today." four minutes before its end so that this scene could collect it. The
 * staging has three jobs and they are all timing:
 *
 *   **The diagram is built out of his own beams while he brags** — sun, beam,
 *   sky, blue — so the thing that is about to be corrected is visibly *his*.
 *   **It stops dead on "He is wrong"** and the beams holding it up droop. Not a
 *   fade: a fade is the picture leaving, and this picture has to stay on screen
 *   being wrong.
 *   **His grin comes apart inside the 36-frame beat, and not before.** The
 *   script is exact — "Sunny's grin does not move for the first half of this
 *   beat and comes apart in the second" — so the change is staged in the
 *   silence with `emotionAt`, at the beat's midpoint, which is precisely what
 *   that helper exists for. There is no line to hang it on and a `useEmotion`
 *   lead would put it under the Narrator's three words.
 *
 * Then the diagram reassembles with the air drawn *in* it, bigger and more
 * accurate than the one he built, and he poses in front of it for forty-five
 * frames not having noticed.
 */
const SunnyWrongScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [bragFrom, bragTo] = lineWindow(scene, "a2_47_sunny");
  const [checkFrom] = lineWindow(scene, "a2_48_narrator");
  const [grinFrom, grinTo] = heldBeat(scene, "a2_48_narrator");
  const [wrongFrom, wrongTo] = lineWindow(scene, "a2_49_narrator");
  const [apartFrom, apartTo] = heldBeat(scene, "a2_49_narrator");
  const [rebuildFrom, rebuildTo] = lineWindow(scene, "a2_51_narrator");
  const [landFrom, landTo] = heldBeat(scene, "a2_52_ray");
  const [backFrom] = lineWindow(scene, "a2_53_sunny");

  // He builds it as he brags, one element per third of the line — which is what
  // the two pause markers in `a2_47_sunny` bought.
  const build = kidEase.easeInOutSine((frame - bragFrom) / Math.max(1, (bragTo - bragFrom) * 0.94));
  // And it stops, and sags, on "He is wrong".
  const droop = kidEase.easeOutCubic((frame - wrongFrom - Math.round((wrongTo - wrongFrom) * 0.45)) / 22);
  // Then it comes back with the air in it, bigger than his.
  const air = kidEase.easeInOutSine((frame - rebuildFrom - 8) / Math.max(1, (rebuildTo - rebuildFrom) * 0.92));

  // The camera pushes onto Sunny for "I checked", so "alone in frame" is
  // literally true for both of the beats in the middle of the scene, and pulls
  // back for the rebuild.
  const inOn = interpolate(frame, [checkFrom, grinFrom - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const backOut = interpolate(frame, [rebuildFrom - 16, rebuildFrom + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const close = inOn * (1 - backOut);
  // **A real close-up, and the numbers are load-bearing.** At 1.5× the diagram
  // was still sitting in the corner of the frame, and the beat is "Sunny
  // holding an enormous smug grin, *alone in frame*". At 2.5×, with the frame
  // slid left so he is centred rather than parked on the right, the visible
  // world starts at x≈1080 — which is why the diagram is built to end at 1060.
  const cam: Cam = {
    x: S23_SUNNY.x,
    y: 400,
    zoom: 1 + close * 1.5,
    dx: -close * 500,
  };

  // **His brightness is the other half of the performance.** He arrives at
  // maximum, dims while he is being wrong, and is restored for the button —
  // done as a filter on the wrapper because his own component has no such prop
  // and inventing one for a joke would put it in every episode.
  const dim = Math.max(0, Math.min(1, droop)) * (1 - Math.max(0, Math.min(1, kidEase.easeInOutSine((frame - backFrom) / 20))));

  // Every face change in this scene happens in a silence, so all of them are
  // `emotionAt` and none of them are mapped to a line.
  const sunnyEmotion = emotionAt(
    frame,
    [
      { at: bragFrom, emotion: "excited" },
      // Held, absolutely still, through "I checked. Then I checked again."
      { at: checkFrom, emotion: "proud" },
      // The grin comes apart in the *second half* of the 36f beat.
      { at: apartFrom + Math.round((apartTo - apartFrom) * 0.5), emotion: "amazed", frames: 12 },
      { at: rebuildFrom, emotion: "sad" },
      { at: backFrom, emotion: "excited" },
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
  const rayVisible = 1 - Math.max(0, Math.min(1, (close - 0.25) / 0.35));

  return (
    <AbsoluteFill>
      <PaintedSky bg="sky_dome_day" phase={20} drift={9} />
      <Camera cam={cam}>
        <WrongDiagram
          build={Math.max(0, Math.min(1, build))}
          droop={Math.max(0, Math.min(1, droop))}
          air={Math.max(0, Math.min(1, air))}
          from={{ x: S23_SUNNY.x - 150, y: 420 }}
        />

        {/* Still holding it, seven scenes later, and still dry. `wet` is 1
            exactly once in the episode and that was the cold open. */}
        <PaintRoller x={1310} y={700} scale={0.82} rot={-96} wet={0} zIndex={20} />

        <div
          style={{
            position: "absolute",
            inset: 0,
            filter: `brightness(${1 - dim * 0.12}) saturate(${1 - dim * 0.24})`,
          }}
        >
          <Sunny
            x={S23_SUNNY.x}
            y={S23_SUNNY.y}
            scale={1}
            phase={PHASE.sunny}
            emotion={sunnyEmotion}
            speaking={stage.speaking("sunny")}
            look={
              frame >= apartFrom && frame < landTo
                ? { x: -0.2, y: 0.15 }
                : { x: -0.7, y: 0.25 }
            }
            // He is *held* in the smug beat and stopped dead in the one after
            // it. Both are stillness, and they are the two halves of the joke.
            idle={frame >= grinFrom && frame < apartTo ? 0.35 : 1}
            eyeLife={frame >= grinFrom && frame < apartTo ? 0.3 : 1}
            raySpeed={0.16 - dim * 0.13}
            enter={{ at: 0, kind: "slideRight" }}
            zIndex={24}
          />
        </div>

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
            sunny: projectMark(cam, S23_SUNNY),
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
 * The diagram Sunny builds out of his own beams, and the one that replaces it.
 *
 * `build` assembles his version — sun, beam, sky, and a roller on top of it,
 * because his claim is paint. `droop` stops it and lets the beams holding it up
 * sag. `air` rebuilds it with the air drawn *in*: the same sun and the same
 * beam, arriving at a band of air, and blue leaving that band in every
 * direction. Bigger than his, and it is the only thing in the frame that has
 * got bigger by being corrected.
 */
/** The three puffs the corrected diagram's beam actually arrives at. */
const AIR_BAND = [
  { x: 566, y: 448 },
  { x: 648, y: 508 },
  { x: 726, y: 452 },
] as const;

const WrongDiagram: React.FC<{
  build: number;
  droop: number;
  air: number;
  from: { x: number; y: number };
}> = ({ build, droop, air, from }) => {
  const step = (a: number, b: number): number => kidEase.easeInOutSine((build - a) / (b - a));
  const sun = step(-0.2, 0.3);
  const beam = step(0.28, 0.62);
  const sky = step(0.6, 0.95);
  const sag = 90 * droop;
  const grow = 1 + air * 0.14;
  // **Everything lives left of x = 1060**, which is what lets the close-up on
  // Sunny be a close-up on Sunny (see `cam` in the scene).
  const cx = 640;
  const cy = 540;

  return (
    <WideLayer zIndex={12}>
      <g transform={`translate(${cx} ${cy + sag * 0.3}) scale(${grow}) translate(${-cx} ${-cy})`}>
        {/* The construction beams: his light, holding his diagram up, and then
            not. */}
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
              d={`M ${from.x} ${from.y} Q ${(from.x + target.x) / 2} ${(from.y + target.y) / 2 + sag * (1 + i * 0.5)} ${target.x} ${target.y + sag * (0.6 + i * 0.3)}`}
              stroke={kidTheme.sunLight}
              strokeWidth={13}
              strokeLinecap="round"
              fill="none"
              opacity={0.42 * on * (1 - droop * 0.55)}
            />
          );
        })}

        {/* His sun. */}
        <g opacity={sun} transform={`translate(240 ${470 + sag * 0.6})`}>
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
            d={`M 344 ${482 + sag * 0.6} L ${344 + (560 - air * 260) * beam} ${492 + sag * 0.8}`}
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
                      strokeWidth={10}
                      strokeLinecap="round"
                      opacity={0.8}
                    />
                    <circle
                      cx={p.x + Math.cos(a) * d}
                      cy={p.y + Math.sin(a) * d}
                      r={12}
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
        <g opacity={sky} transform={`translate(0 ${sag * 0.9})`}>
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
              rather than as a screen. */}
          {sky > 0.5 ? (
            <g opacity={0.8}>
              <ellipse cx={866} cy={462} rx={52} ry={23} fill={kidTheme.cloud} />
              <ellipse cx={976} cy={522} rx={42} ry={19} fill={kidTheme.cloud} />
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
