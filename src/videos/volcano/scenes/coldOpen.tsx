import React from "react";
import {
  AbsoluteFill,
  Bubbles,
  COAST,
  CoastWorld,
  Cast,
  KidSilhouette,
  MountainWorld,
  PHASE,
  PLATES,
  Sandcastle,
  Sunny,
  VOLCANO_AT,
  VOLCANO_SEAT,
  WideLayer,
  heldBeat,
  hover,
  interpolate,
  kidEase,
  kidInkOutline,
  kidRadius,
  kidTheme,
  lineWindow,
  mixHex,
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

// COLD OPEN — Scenes 1–4 of script.md. A sandcastle, a knock, an unanswered
// claim, and the end of the rules. Its four jobs:
//
//   1. establish the coast, INCLUDING the volcano on the horizon of the very
//      first wide, unnamed and unlooked-at, exactly as he has been for four
//      shows (the volcano rule holds through Scenes 1–2 and nowhere else);
//   2. plant the sandcastle — the silent builder-parallel runner, zero lines,
//      zero cost, cashed in Scene 29 when sand turns out to be ground-up
//      mountain and the kid and the volcano turn out to have been in the same
//      business all day;
//   3. fire the banked wake-claim ("OH, that one is me as well! HA! HA!" —
//      saved on purpose twice since ep 2) and then *withhold the Narrator's
//      ruling*, which is the fuse audibly hissing;
//   4. **END THE RULES.** The camera does the thing it has never done in five
//      episodes: it turns and faces the mountain. From that frame on, looking
//      at him is legal forever.
//
// ---------------------------------------------------------------------------
// THE BOUNDARY CHECKLIST (STYLE, "A cut inside a continuous space")
//
//   1→2  Same wide, same hour, continuous. The castle is at `COAST.castle` and
//        `built = S1_BUILT_END` on both sides of the cut; the kid is on the same
//        mark, kneeling, mid-pat. Sunny is up at his mark in both and does not
//        move. The volcano's plume is at `SMOKE.quiet` in both.
//   2→3  Same wide again, camera still parked at 1.0 in both. What changes is
//        the plume: Scene 3 ramps it from `SMOKE.quiet` to `SMOKE.rising` over
//        `co_12`, which is the script's "thin smoke rises from the summit" and
//        the only thing on screen that has changed since the knock.
//   3→4  **A vantage cut, and the only one in the episode.** Scene 3's push
//        ends on the mountain 384px tall with his base just below the frame's
//        middle, framed from the beach; Scene 4 opens on him from out on the
//        water at 464px on the same part of the frame, and keeps pushing
//        (a 5.5% creep across the scene), so the camera was already moving and
//        it does not stop. The size jump across it is the change of vantage — beach to
//        water — and is deliberate. The two things that DO carry are his
//        x-position (frame centre-ish in both) and the fact that he is asleep
//        in both: `awake` is 0 through the whole cold open. He does not open
//        his eyes until Scene 9, and the face panel is a crag until then.
// ---------------------------------------------------------------------------

/**
 * **The plume, as three values, because it is the cold open's only plot.**
 *
 * Nothing else on screen changes across four scenes: the mountain does not
 * move, nobody looks at him, and the sandcastle is the same castle. The smoke
 * is the whole escalation — a quiet vent the audience has been trained not to
 * notice for three episodes, thickening on the exact line that says the rules
 * are over.
 */
const SMOKE = { quiet: 0.2, rising: 0.72, turn: 0.95 } as const;

/** Sunny's side of the frame. Frame right, high, and he never leaves it. */
const SUNNY_X = 1608;
const SUNNY_Y = 254;
const SUNNY_SCALE = 1.05;

/** Where he comes up from: the disc centre, below the sea horizon at dawn. */
const SUNNY_RISE_FROM = 660;

/** The castle at the end of Scene 1 — and for the rest of the episode. */
const S1_BUILT_END = 0.94;

const S1_KID: KidPlacement = {
  x: COAST.kid.x,
  y: stand("kid", COAST.ground + 14),
  scale: 1.34,
  kneel: 1,
  // Facing frame-left, towards their own work. The castle is at `COAST.castle`
  // (972) and the kid at `COAST.kid` (1354), so an unflipped silhouette has its
  // working hands pointing AWAY from the thing it is building, which reads as a
  // child ignoring it. The 382px between the two marks is also a fix: at 266
  // the kid's knee was inside the castle and the two read as one shape.
  flip: true,
};

const S1_BUBBLES: Record<string, string> = {
  co_04_sunny: "GOOD MORNING, EVERYBODY!",
  co_05_sunny: "I invented mornings!",
  co_06_sunny: "That warm sand is me!",
  co_07_sunny: "You're welcome! HA! HA!",
};

// ---------------------------------------------------------------------------
// Scene 1 — The last quiet morning
// ---------------------------------------------------------------------------

const SandcastleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  // Sunny comes up over the sea across the three Narrator lines and is at his
  // mark before he says anything — the greeting is a greeting, not an entrance,
  // and it is five-for-five. Below the horizon he is genuinely below it: this
  // is the one shot in the series where a body crossing that line is correct,
  // because the line is water and the body is the sun coming out of it.
  const [greetFrom] = lineWindow(scene, "co_04_sunny");
  const risen = kidEase.easeOutSine(interpolate(frame, [0, greetFrom - 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const sunnyCentre = SUNNY_RISE_FROM + (SUNNY_Y - SUNNY_RISE_FROM) * risen;

  // The kid is building the whole scene: the castle gains its last third while
  // the Narrator says "Remember the sandcastle." Slow — a child's afternoon,
  // not a construction montage.
  const [rememberFrom, rememberTo] = lineWindow(scene, "co_03_narrator");
  const built = interpolate(frame, [0, rememberTo], [0.7, S1_BUILT_END], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  // The pat: hands up on the beat the Narrator points at the castle.
  const pat = Math.max(
    0,
    Math.sin(interpolate(frame, [rememberFrom, rememberTo], [0, Math.PI * 2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })),
  );

  const sunnyMark: Mark = {
    x: SUNNY_X,
    y: hover("sunny", sunnyCentre, SUNNY_SCALE),
    scale: SUNNY_SCALE,
    who: "sunny",
    side: "left",
    offset: 360,
  };

  // THE DEBT, NAMED ON SCREEN. script.md: "The ep-4 card may ghost briefly over
  // the sky — print only." It is a *ghost*, so it never reaches full opacity
  // and nothing points at it; the line under it is doing the naming.
  const [debtFrom, debtTo] = lineWindow(scene, "co_02_narrator");

  return (
    <CoastWorld
      bg="coast_dawn"
      phase={0.2}
      volcano={{ smoke: SMOKE.quiet }}
      overlay={
        <>
          <GhostCard
            text="WHAT IS DIRT ACTUALLY MADE OF?"
            from={debtFrom + 24}
            until={debtTo - 6}
          />
          <Bubbles scene={scene} cast={{ sunny: sunnyMark } as Cast} text={S1_BUBBLES} />
        </>
      }
    >
      <Sunny
        x={sunnyMark.x}
        y={sunnyMark.y}
        scale={SUNNY_SCALE}
        phase={PHASE.sunny}
        emotion={useEmotion(scene, "sunny", { co_04_sunny: "excited" }, "proud")}
        speaking={stage.speaking("sunny")}
        look={risen < 0.98 ? "up" : "left"}
      />
      <Sandcastle
        x={COAST.castle.x}
        y={COAST.ground}
        scale={0.95}
        built={built}
        sand={PLATES.coast_dawn.near}
      />
      <KidSilhouette {...S1_KID} hold={pat * 0.8} />
    </CoastWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — The knock
// ---------------------------------------------------------------------------

const KnockScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  // THE KNOCK. "A sound nobody in the series has ever heard: enormous, deep,
  // polite — ONCE." It is staged sound design, never narrated, so what is on
  // screen is only what the sound DID: one low ring off the mountain, the
  // castle wobbling, and a child patting it back together.
  //
  // It lands inside the scripted 30f hold after `co_09_narrator`, not on the
  // line — "And then the world knocked" is the announcement and the knock is
  // the beat after it.
  const [knockFrom, knockTo] = heldBeat(scene, "co_09_narrator");
  const since = frame - (knockFrom + 3);
  const beat = Math.max(1, knockTo - knockFrom);

  // The castle: a hard wobble, a slump on the left turret, and then the kid
  // pats it back. The pat finishes inside the hold, so Sunny's claim lands on a
  // frame in which everything is already fine.
  const wobble = Math.max(0, 1 - Math.abs(since - 4) / 14);
  const slump = interpolate(
    since,
    [4, 12, beat * 0.62, beat * 0.86],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );
  const pat = interpolate(
    since,
    [beat * 0.5, beat * 0.66, beat * 0.86, beat],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );

  const sunnyMark: Mark = {
    x: SUNNY_X,
    y: hover("sunny", SUNNY_Y, SUNNY_SCALE),
    scale: SUNNY_SCALE,
    who: "sunny",
    side: "left",
    offset: 360,
  };

  return (
    <CoastWorld
      bg="coast_dawn"
      phase={1.1}
      volcano={{
        smoke: SMOKE.quiet,
        // The mountain does not move. He breathes a little deeper for a second
        // and that is the entire performance — "the mountain moved slightly and
        // that is enormous". Nobody looks; the rule still holds.
        breath: 1 + 2.4 * Math.max(0, 1 - Math.abs(since - 6) / 22),
      }}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ sunny: sunnyMark } as Cast}
          text={{ co_10_sunny: "OH, that one is me!" }}
        />
      }
    >
      <KnockRing since={since} />
      <Sunny
        x={sunnyMark.x}
        y={sunnyMark.y}
        scale={SUNNY_SCALE}
        phase={PHASE.sunny}
        // Full wattage, no doubt anywhere in it — the banked direction, fired.
        // `NO_LEAD` is not needed here: `proud` is his resting face, so nothing
        // changes inside the held beat at all.
        emotion="proud"
        speaking={stage.speaking("sunny")}
        look="left"
      />
      <Sandcastle
        x={COAST.castle.x}
        y={COAST.ground}
        scale={0.95}
        built={S1_BUILT_END}
        wobble={wobble}
        slump={slump * 0.9}
        sand={PLATES.coast_dawn.near}
      />
      <KidSilhouette {...S1_KID} hold={pat} />
    </CoastWorld>
  );
};

/**
 * The knock, as a picture: one low ring leaving the mountain and crossing the
 * frame, once.
 *
 * Deliberately NOT a camera shake. A shake says "danger" to a six-year-old and
 * this episode's hard tone gate is that nothing is ever menaced by anything —
 * the knock is *polite*. A single wide ring that passes through and is gone is
 * the sound made visible, and it leaves the frame composed.
 */
const KnockRing: React.FC<{ since: number }> = ({ since }) => {
  if (since < 0 || since > 46) return null;
  const u = since / 46;
  const r = kidEase.easeOutCubic(u) * 2300;
  return (
    <WideLayer>
      {[0, 1].map((i) => {
        const rr = r - i * 90;
        if (rr <= 0) return null;
        const cx = VOLCANO_AT.x;
        const cy = COAST.horizon - 40;
        const ry = rr * 0.34;
        // **The near half only.** A full ellipse put half the ring up in the
        // sky, where it read as a scratch on the lens rather than as a sound
        // crossing the water — a ring in the air is a shockwave, and a
        // shockwave is peril. This is the pressure running along the sea and
        // the beach towards camera, which is the only half a listener on the
        // sand would be inside.
        return (
          <path
            key={i}
            d={`M ${(cx - rr).toFixed(0)} ${cy} A ${rr.toFixed(0)} ${ry.toFixed(0)} 0 0 0 ${(cx + rr).toFixed(0)} ${cy}`}
            fill="none"
            stroke={mixHex(kidTheme.paper, kidTheme.sunLight, 0.4)}
            strokeWidth={9 - i * 3}
            strokeLinecap="round"
            opacity={(1 - u) ** 1.6 * (0.5 - i * 0.18)}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — The rules end
// ---------------------------------------------------------------------------

/**
 * **THE TURN.** Where the push ends, and the two numbers that make it legal.
 *
 * `S3_ZOOM` is 2.6 rather than the 3.4 that would match Scene 4's apparent size
 * exactly: the coastal plate is a 1344-wide painting seated at 1.43×, so 2.6 is
 * already a 3.7× enlargement of the original and soft gouache stops holding up
 * past about there. The remaining size step is carried by the cut.
 *
 * `S3_PAN` is how far the world slides left so the mountain ends up near frame
 * centre. It cannot simply be `960 − VOLCANO_AT.x`: the camera's origin is on
 * the mountain, so at 2.6× the plate's left edge has already travelled to
 * −590, and panning the full 624 would drag it to +34 and show a strip of bare
 * backdrop down the side of the frame. 460 is the largest pan the plate can
 * cover, and it lands him at x ≈ 796 — off centre, looking into the frame,
 * which is a better composition than dead centre anyway.
 */
const S3_ZOOM = 3.1;
const S3_PAN = 624;
/**
 * How far the world slides DOWN as the push lands.
 *
 * Without it the mountain finishes in the upper third with five hundred pixels
 * of empty sea under it — a push-in that arrives somewhere nobody was looking.
 * 170 puts his base a little below the frame's middle and leaves clear sky over
 * the summit, which is the composition Scene 4 opens on: the two shots then
 * match within eighty pixels of summit height across the cut.
 */
const S3_DY = 170;

const RulesEndScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();

  const [rulesFrom] = lineWindow(scene, "co_12_narrator");
  const [turnFrom, turnTo] = lineWindow(scene, "co_13_narrator");

  // The plume thickens across the first line — the only thing in the cold open
  // that visibly changes, and it changes under the sentence that says nobody
  // has ever looked at it.
  const smoke = interpolate(
    frame,
    [rulesFrom, turnFrom, turnTo],
    [SMOKE.quiet, SMOKE.rising, SMOKE.turn],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );

  // THE TURN. It starts under "The rules are over." and finishes inside the
  // scene's 60f tail, in silence, with nothing else on screen — which is why
  // that tail is the longest in the episode.
  const u = interpolate(frame, [turnFrom + 6, turnTo + 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam: Cam = {
    x: VOLCANO_AT.x,
    y: COAST.horizon - 40,
    zoom: 1 + (S3_ZOOM - 1) * u,
    dx: S3_PAN * u,
    dy: S3_DY * u,
  };

  return (
    <CoastWorld
      bg="coast_dawn"
      phase={2.4}
      cam={cam}
      // Dead still. A drifting plate under a camera move is two moves, and this
      // one has to read as a single deliberate decision.
      drift={0}
      volcano={{
        smoke,
        // A little warmth arrives WITH the decision: the rim comes up on the
        // same curve as the push, so the mountain the camera commits to is a
        // shade warmer than the one it has been ignoring. Small — 0.22 — because
        // on a bright plate the kit's rim is meant to be off entirely, and this
        // is the one shot in the cold open that is not a background.
        rim: 0.22 * u,
      }}
    >
      {/* The kid and the castle stay in the shot until the push takes them out
          of it — the runner does not stop existing because the camera left. */}
      <Sandcastle
        x={COAST.castle.x}
        y={COAST.ground}
        scale={0.95}
        built={S1_BUILT_END}
        sand={PLATES.coast_dawn.near}
      />
      <KidSilhouette {...S1_KID} />
    </CoastWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 4 — Title, over the mountain
// ---------------------------------------------------------------------------

/**
 * The title framing's mountain scale.
 *
 * Smaller than `VOLCANO_SEAT.scale` (5.6, which Scene 9 uses for the wake) and
 * that is the dramaturgy: this shot *introduces* him and the wake shot is the
 * event, so the biggest he ever is, is the frame he speaks in. 4.0 also leaves
 * 294px of clear sky over the summit, which is exactly what a two-line title
 * needs at `S4_TITLE_SIZE`.
 */
const S4_SCALE = 4.3;
const S4_TITLE_SIZE = 88;
/**
 * A little warmth on him, and it is the reason he is a mountain rather than a
 * grey triangle here: the dawn plate's horizon band is a bright peach and a
 * flat `VOLCANO_BODY` silhouette in front of it reads as a hole in the picture.
 * `rim` mixes the body toward `sunDeep`, lights the crest, and lays a soft warm
 * glow behind him — kept low, because at full strength the glow out-measures
 * the mountain and becomes fog (the ep-3 lesson, logged in the kit).
 */
const S4_RIM = 0.35;

const TitleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The camera was already moving at the cut and it keeps moving. Half a
  // percent a second, under the threshold of noticing.
  const cam: Cam = {
    x: VOLCANO_SEAT.x,
    y: VOLCANO_SEAT.base - 160,
    zoom: interpolate(frame, [0, scene.durationInFrames], [1, 1.055], {
      extrapolateRight: "clamp",
    }),
  };

  const pop = spring({ frame: frame - 26, fps, config: { damping: 13, mass: 0.7 } });

  return (
    <MountainWorld
      bg="sea_horizon_dawn"
      phase={3.6}
      cam={cam}
      volcano={{ scale: S4_SCALE, smoke: SMOKE.turn, awake: 0, rim: S4_RIM }}
      // OUTSIDE the camera. Inside it the push is applied to the title as well,
      // so a card that is supposed to arrive over a moving world moves with it.
      overlay={
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 34,
              textAlign: "center",
              fontFamily: kidTheme.fontFamily,
              transform: `scale(${pop.toFixed(3)}) rotate(${((1 - pop) * -3).toFixed(2)}deg)`,
              opacity: Math.min(1, pop * 1.4),
            }}
          >
            <div
              style={{
                fontSize: S4_TITLE_SIZE,
                fontWeight: 900,
                letterSpacing: -1,
                lineHeight: 1.04,
                color: kidTheme.paper,
                // Never `-webkit-text-stroke`: it outlines each glyph contour
                // separately and an iPhone shows every bar an "A" is assembled
                // from. `kidInkOutline` casts the ring off the finished glyph.
                textShadow: kidInkOutline(6),
              }}
            >
              Ember and the Mountain
              <br />
              That Said Good Morning
            </div>
          </div>
        </AbsoluteFill>
      }
    />
  );
};

// ---------------------------------------------------------------------------
// The ep-4 debt, ghosted
// ---------------------------------------------------------------------------

/**
 * Episode four's end card, drifting across the sky under the line that names
 * the debt. Print only, low alpha, and nothing on screen acknowledges it — it
 * is a memory, not a graphic. The recap stamps the answer across the same words
 * (Scene 28), so the two have to be the same sentence.
 */
const GhostCard: React.FC<{ text: string; from: number; until: number }> = ({
  text,
  from,
  until,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= until) return null;
  const span = Math.max(1, until - from);
  const u = (frame - from) / span;
  const fade = Math.min(1, u * 5) * Math.min(1, (1 - u) * 5);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 176,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: fade * 0.34,
      }}
    >
      <div
        style={{
          padding: "18px 48px",
          borderRadius: kidRadius.banner,
          border: `5px solid ${kidTheme.paper}`,
          fontFamily: kidTheme.fontFamily,
          fontSize: 52,
          fontWeight: 900,
          letterSpacing: 2,
          color: kidTheme.paper,
          textShadow: kidInkOutline(3),
          transform: `translateY(${(-8 * u).toFixed(1)}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const COLD_OPEN_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s01_sandcastle: SandcastleScene,
  s02_knock: KnockScene,
  s03_rules_end: RulesEndScene,
  s04_title: TitleScene,
};
