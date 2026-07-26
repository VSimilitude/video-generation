import React from "react";
import {
  Puff,
  kidEase,
  kidTheme,
  moveAlong,
  settleWave,
} from "../../../lib/kid";
import {
  ACT_COLOR,
  AbsoluteFill,
  AirArcs,
  Beetle,
  BigWordBeat,
  Bubbles,
  Camera,
  CutFlash,
  GrassWorld,
  Leaf,
  PHASE,
  PUFF_OPACITY,
  SkyBlend,
  SoftShade,
  WideLayer,
  heldBeat,
  hover,
  interpolate,
  lineProgress,
  lineWindow,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cast,
  type Mark,
  type SpeakerVisual,
  type TimedScene,
} from "./common";

// ACT ONE — YOU'RE REAL, PUFF. Scenes 3–11 of script.md.
//
// One geography for the whole act: grass-blade height, blades like green
// skyscrapers, soil at GROUND, sky in the gaps between the blades. Every scene
// is a different spot in the same field, which is what lets Scene 6's shade and
// Scene 8's sky window read as places rather than as backdrops.
//
// Two things are true of the act and are enforced here rather than per scene:
//
//   Puff is at PUFF_OPACITY.actOne (0.4) throughout, dipping to .lowest (0.25)
//   in Scene 6 and finishing at .afterAir (0.55) once the AIR card has landed.
//   The ramp is the character arc; nothing in dialogue ever mentions it.
//
//   There is no wind. GrassWorld's `wind` stays at ACT_WIND — small enough
//   that nothing reads as blowing, large enough that the frame is not a
//   photograph. The one exception is Scene 7, where the only moving air in Act
//   One is Puff's own breath, and the grass says so.

const GROUND = 1140;
const ACT_WIND = 0.05;

/** The act's held-beat scenes cut the emotion lead to zero (script.md). */
const NO_LEAD = 0;

// ---------------------------------------------------------------------------
// Scene 3 — Down in the grass
// ---------------------------------------------------------------------------

const S3_SCALE = 1.15;
const S3_PUFF = { x: 790, y: hover("puff", 590, S3_SCALE) };
const S3_MARK: Mark = { ...S3_PUFF, scale: S3_SCALE, who: "puff", side: "right" };

const S3_BUBBLES: Record<string, string> = {
  a1_02_puff: "It's me! I'm here!",
  // The gag's first firing. Six words, and the apology is verbatim because it
  // is the thing the audience is being taught to count.
  a1_04_puff: "Sorry. You can't see me.",
};

const GrassScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, introTo] = lineWindow(scene, "a1_01_narrator");
  const [helloFrom] = lineWindow(scene, "a1_02_puff");

  // We fall the whole way down the hill into the grass. The world drops past
  // the camera rather than the camera diving, which keeps Puff framed the
  // instant we arrive.
  const drop = kidEase.easeOutCubic(frame / 34);
  const dy = (1 - drop) * -820;
  const zoom = 1.34 - 0.34 * drop;

  // He is mid-shout when we land, then remembers himself.
  const hop = frame >= helloFrom ? settleWave((frame - helloFrom) / 26, 1.2, 3.6) : 0;

  const emotion = useEmotion(
    scene,
    "puff",
    { a1_02_puff: "excited", a1_04_puff: "sad" },
    "sad",
  );

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={2} />
      <Camera cam={{ x: 960, y: 700, zoom, dy }}>
        <GrassWorld ground={GROUND} wind={ACT_WIND} />
        <Puff
          {...S3_PUFF}
          scale={S3_SCALE}
          opacity={PUFF_OPACITY.actOne}
          phase={PHASE.puff}
          emotion={emotion}
          speaking={useStage(scene).speaking("puff")}
          look={frame < introTo ? "down" : "camera"}
          pose={frame >= helloFrom && frame < helloFrom + 60 ? "wave" : "rest"}
          idle={frame < introTo ? 0.5 : 1.1}
          bank={hop * 6}
        />
        <GrassWorld
          layer="front"
          ground={GROUND}
          wind={ACT_WIND}
          avoid={[{ x: S3_PUFF.x, r: 330 }]}
        />
      </Camera>
      <Bubbles scene={scene} cast={{ puff: S3_MARK }} text={S3_BUBBLES} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scenes 4 and 5 — The beetle, and then the leaf
// ---------------------------------------------------------------------------

/**
 * One component, two scenes. script.md is explicit that Scene 5 is "identical
 * staging to Scene 4, one beat wider, with a leaf where the beetle was — same
 * framing, same distance, same everything", because the audience has to feel
 * the repeat before they hear it. Two hand-built scenes would drift apart in a
 * week; this cannot.
 *
 * The three things that differ are the three props: which creature, which line
 * keys, and how big Puff's wave is (smaller the second time — he is running out
 * of hope, not out of manners).
 */
const CREATURE_X = 1320;
const CREATURE_Y = 560;
const PUFF_X = 880;
const PUFF_SCALE = 1.05;
const PUFF_Y = hover("puff", 545, PUFF_SCALE);
const CREATURE_SCALE = { beetle: 1.4, leaf: 1.3 } as const;

type CreatureKeys = {
  /** Puff: "Good morning, …! I am Puff!" */
  greet: string;
  /** Creature: "Hello? Is somebody there?" */
  ask: string;
  /** Puff, louder. */
  insist: string;
  /** Creature: "Huh. Must have been nothing." */
  dismiss: string;
  /** Puff: "Sorry." */
  sorry: string;
};

const CreatureBeat: React.FC<{
  scene: TimedScene;
  creature: "beetle" | "leaf";
  keys: CreatureKeys;
  /** 1 in Scene 4, smaller in Scene 5. */
  wave: number;
  bubbles: Record<string, string>;
}> = ({ scene, creature, keys, wave, bubbles }) => {
  const frame = useCurrentFrame();

  // The cameo mapping: two NARRATOR-voiced turns come out of this body.
  const visual: SpeakerVisual = { [keys.ask]: creature, [keys.dismiss]: creature };
  const stage = useStage(scene, visual);

  const [askFrom, askTo] = lineWindow(scene, keys.ask);
  const [, dismissTo] = lineWindow(scene, keys.dismiss);
  const [beatFrom, beatTo] = heldBeat(scene, keys.dismiss);
  const [greetFrom] = lineWindow(scene, keys.greet);
  const [sorryFrom] = lineWindow(scene, keys.sorry);

  const scale = CREATURE_SCALE[creature];
  const creatureMark: Mark = {
    x: CREATURE_X,
    y: CREATURE_Y,
    scale,
    who: creature,
    side: "right",
    lift: 250,
  };
  const puffMark: Mark = {
    x: PUFF_X,
    y: PUFF_Y,
    scale: PUFF_SCALE,
    who: "puff",
    side: "left",
  };
  const cast: Cast = { puff: puffMark, [creature]: creatureMark };

  // --- the gag, staged.
  //
  // The pupils sweep steadily across the whole width of the eye during "Hello?
  // Is somebody there?", *passing through* the bearing Puff is standing on and
  // carrying on to the middle distance. They never stop on him and they never
  // come back. That crossing is the joke; a creature that simply looked the
  // other way would read as rude, and script.md is clear that nobody in this
  // world is unkind to Puff.
  const scan = kidEase.easeInOutSine(lineProgress(scene, keys.ask, frame));
  const looking = frame >= askFrom && frame < dismissTo;
  // Two legs: right-to-left across the whole eye (crossing Puff's bearing at
  // about two thirds), then a drift *up* to the horizon behind him. The second
  // leg is what makes it "past Puff to the middle distance" rather than "at
  // Puff and then away" — there is nowhere further left to look.
  const cross = Math.min(1, scan / 0.7);
  const beyond = Math.max(0, (scan - 0.7) / 0.3);
  const creatureLook = looking
    ? {
        x: 0.55 - cross * 1.5 + beyond * 0.3,
        y: 0.16 - cross * 0.12 - beyond * 0.5,
      }
    : { x: 0.4, y: -0.34 };

  // --- Puff, and the deflation.
  //
  // He waves through his own two lines and keeps his arms up afterwards; the
  // wave *amplitude* dies over ten frames as the held beat opens, so the arms
  // are still raised and no longer moving. Stillness is the deflation — his
  // face must not do it, which is why the emotion lead is 0 and "Sorry." is the
  // first frame anything on him changes.
  const waving = frame >= greetFrom && frame < sorryFrom;
  const waveAmt = wave * (1 - kidEase.easeOutQuad((frame - beatFrom) / 10));
  const puffEmotion = useEmotion(
    scene,
    "puff",
    { [keys.greet]: "excited", [keys.insist]: "excited", [keys.sorry]: "sad" },
    "happy",
    NO_LEAD,
    visual,
  );

  // A very slow push towards Puff. It *starts* under the dismissal, not inside
  // the beat: script.md forbids anything beginning in the silence.
  const zoom = interpolate(frame, [askTo, beatTo], [1, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam = { x: PUFF_X, y: 560, zoom };

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={2} />
      <Camera cam={cam}>
        <GrassWorld ground={GROUND} wind={ACT_WIND} seed={creature === "leaf" ? 3 : 1} />
        {/* The stem the creature is sitting on. */}
        <WideLayer>
          <path
            d={`M ${CREATURE_X + 46} ${GROUND + 60} Q ${CREATURE_X + 130} ${CREATURE_Y + 340} ${CREATURE_X + 10} ${CREATURE_Y + 120}`}
            stroke={kidTheme.grassDark}
            strokeWidth={54}
            strokeLinecap="round"
            fill="none"
          />
        </WideLayer>
        {creature === "beetle" ? (
          <Beetle
            x={CREATURE_X}
            y={CREATURE_Y}
            scale={scale}
            phase={PHASE.beetle}
            speaking={stage.speaking("beetle")}
            look={creatureLook}
            emotion="neutral"
            eyeLife={0.3}
            idle={0.45}
          />
        ) : (
          <Leaf
            x={CREATURE_X}
            y={CREATURE_Y}
            scale={scale}
            phase={PHASE.leaf}
            speaking={stage.speaking("leaf")}
            look={creatureLook}
            emotion="neutral"
            eyeLife={0.3}
            idle={0.45}
          />
        )}
        <Puff
          x={PUFF_X}
          y={PUFF_Y}
          scale={PUFF_SCALE}
          opacity={PUFF_OPACITY.actOne}
          phase={PHASE.puff}
          emotion={puffEmotion}
          speaking={stage.speaking("puff")}
          look={{ x: 0.85, y: -0.1 }}
          pose={waving ? "wave" : "rest"}
          wave={Math.max(0, waveAmt)}
          idle={frame >= beatFrom && frame < beatTo ? 0.2 : 0.9}
        />
        <GrassWorld
          layer="front"
          ground={GROUND}
          wind={ACT_WIND}
          seed={creature === "leaf" ? 3 : 1}
          avoid={[
            { x: PUFF_X, r: 360 },
            { x: CREATURE_X, r: 360 },
          ]}
        />
      </Camera>
      <Bubbles scene={scene} cast={cast} text={bubbles} visual={visual} />
    </AbsoluteFill>
  );
};

const BeetleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => (
  <CreatureBeat
    scene={scene}
    creature="beetle"
    wave={1}
    keys={{
      greet: "a1_06_puff",
      ask: "a1_07_narrator",
      insist: "a1_08_puff",
      dismiss: "a1_09_narrator",
      sorry: "a1_10_puff",
    }}
    bubbles={{
      a1_06_puff: "Good morning, beetle!",
      a1_07_narrator: "Hello? Is somebody there?",
      a1_08_puff: "YES! I am right here!",
      a1_09_narrator: "Must have been nothing.",
      // One word. Verbatim, because it is the whole gag.
      a1_10_puff: "Sorry.",
    }}
  />
);

const LeafScene: React.FC<{ scene: TimedScene }> = ({ scene }) => (
  <CreatureBeat
    scene={scene}
    creature="leaf"
    // Smaller the second time. He has not given up; he has stopped expecting.
    wave={0.5}
    keys={{
      greet: "a1_12_puff",
      ask: "a1_13_narrator",
      insist: "a1_14_puff",
      dismiss: "a1_15_narrator",
      sorry: "a1_16_puff",
    }}
    bubbles={{
      a1_12_puff: "Good morning, leaf!",
      a1_13_narrator: "Hello? Is somebody there?",
      a1_14_puff: "We do this every day.",
      a1_15_narrator: "Must have been nothing.",
      a1_16_puff: "Sorry. Sorry.",
    }}
  />
);

// ---------------------------------------------------------------------------
// Scene 6 — Nothing at all
// ---------------------------------------------------------------------------

const S6_SCALE = 1.1;
const S6_X = 940;
/** Lower than the act's GROUND: this is a hollow, and we can see the bottom. */
const S6_GROUND = 980;

const S6_BUBBLES: Record<string, string> = {
  a1_17_puff: "Nobody ever sees me.",
  a1_18_puff: "Maybe I am nothing.",
  a1_20_puff: "Sorry. Yes. Sorry.",
  a1_22_puff: "Stuff? Me? I am STUFF?",
};

const NothingScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [rollFrom] = lineWindow(scene, "a1_17_puff");
  const [, nothingTo] = lineWindow(scene, "a1_18_puff");
  const [askFrom] = lineWindow(scene, "a1_19_narrator");
  const [stuffFrom, stuffTo] = lineWindow(scene, "a1_21_narrator");

  // He sinks while he says it, and comes back up when somebody argues.
  const sink = kidEase.easeInOutSine((frame - rollFrom) / Math.max(1, nothingTo - rollFrom));
  const rise = kidEase.easeOutBack((frame - askFrom) / 26, 1.1);
  const y = hover("puff", 470 + sink * 220 - rise * 70, S6_SCALE);

  // His lowest point in the episode, and back to the act's forty percent once
  // he has been told he is real. Never mentioned; only drawn.
  const opacity =
    PUFF_OPACITY.actOne +
    (PUFF_OPACITY.lowest - PUFF_OPACITY.actOne) * sink +
    (PUFF_OPACITY.actOne - PUFF_OPACITY.lowest) *
      kidEase.easeInOutSine((frame - stuffFrom) / Math.max(1, stuffTo - stuffFrom));

  const emotion = useEmotion(
    scene,
    "puff",
    {
      a1_17_puff: "sad",
      a1_18_puff: "sad",
      a1_20_puff: "sad",
      a1_22_puff: "amazed",
    },
    "sad",
    // Held beat in this scene: no lead, or his face turns hopeful before the
    // Narrator has finished offering.
    NO_LEAD,
  );

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={1} />
      <Camera cam={{ x: S6_X, y: 620, zoom: 1.06 }}>
        <GrassWorld ground={S6_GROUND} wind={ACT_WIND} seed={5} />
        {/* Two blades close on either side, and the deep shade between them.
            The shade is what keeps him legible at twenty-five percent — the
            sanctioned fix, and the reason `opacity` above is free to go as low
            as the script asks. */}
        <WideLayer>
          {[-1, 1].map((s) => (
            <path
              key={s}
              d={
                `M ${S6_X + s * 250 - 140} ${S6_GROUND + 60}` +
                ` Q ${S6_X + s * 240} 240 ${S6_X + s * 330} -320` +
                ` Q ${S6_X + s * 470} 240 ${S6_X + s * 250 + 140} ${S6_GROUND + 60} Z`
              }
              fill={s < 0 ? kidTheme.grassDark : "#2e8f3e"}
            />
          ))}
        </WideLayer>
      </Camera>
      {/* The fix the script sanctions: darken the world behind him rather than
          brightening him. Sold in-fiction as the shade at the bottom of a
          hollow, and it is the only reason twenty-five percent is legible. */}
      <SoftShade x={S6_X} y={520 + sink * 200} rx={560} ry={470} strength={0.5} />
      <Camera cam={{ x: S6_X, y: 620, zoom: 1.06 }}>
        <Puff
          x={S6_X}
          y={y}
          scale={S6_SCALE}
          opacity={opacity}
          phase={PHASE.puff}
          emotion={emotion}
          speaking={useStage(scene).speaking("puff")}
          // The first time all episode anybody has answered him.
          look={frame >= askFrom ? "up" : "down"}
          eyeLife={0.6}
          idle={frame >= askFrom ? 1 : 0.4}
          wisps={frame >= askFrom ? 3 : 1}
        />
      </Camera>
      <Bubbles
        scene={scene}
        cast={{ puff: { x: S6_X, y, scale: S6_SCALE, who: "puff", side: "right", offset: 430 } }}
        text={S6_BUBBLES}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 7 — Proof one, the dandelion
// ---------------------------------------------------------------------------

const S7_CLOCK = { x: 1240, y: 470 };
const S7_SCALE = 1.15;
const S7_X = 560;
const S7_Y = hover("puff", 520, S7_SCALE);
const SEED_COUNT = 132;

const S7_BUBBLES: Record<string, string> = {
  a1_25_puff: "Ready? Poooof!",
  a1_27_puff: "I moved a whole flower?",
};

const DandelionScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [breathFrom, breathTo] = lineWindow(scene, "a1_24_narrator");
  const [burstFrom] = heldBeat(scene, "a1_25_puff");

  // He fills up over "take a big breath", holds it through his own line, and
  // lets go on the last word — the burst is the first frame of the silence the
  // script bought for it.
  const swell =
    kidEase.easeInOutSine((frame - breathFrom) / Math.max(1, breathTo - breathFrom)) *
    (frame < burstFrom ? 1 : Math.max(0, 1 - (frame - burstFrom) / 8));
  const blow = frame - burstFrom;

  const emotion = useEmotion(
    scene,
    "puff",
    { a1_25_puff: "excited", a1_27_puff: "amazed" },
    "happy",
    // Held beat in this scene.
    NO_LEAD,
  );

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={2} />
      {/* The one place in Act One where the grass moves: it is being blown, by
          him, which is the entire proof. */}
      <GrassWorld
        ground={GROUND}
        wind={blow > 0 ? Math.min(0.9, ACT_WIND + blow / 40) : ACT_WIND}
        seed={2}
      />
      <Dandelion x={S7_CLOCK.x} y={S7_CLOCK.y} blow={blow} />
      <Puff
        x={S7_X}
        y={S7_Y}
        scale={S7_SCALE}
        opacity={PUFF_OPACITY.actOne}
        phase={PHASE.puff}
        emotion={emotion}
        speaking={useStage(scene).speaking("puff")}
        swell={swell}
        look={{ x: 0.9, y: -0.15 }}
        pose={swell > 0.5 ? "brace" : "rest"}
        idle={swell > 0.5 ? 0.3 : 1}
      />
      {/* The push itself: a burst of air leaving him, drawn because he cannot
          be. Slow-mo, like everything else in the beat. */}
      {blow >= 0 && blow < 42 ? (
        <AirArcs
          x={S7_X + 180 + blow * 9}
          y={520}
          scale={1 + blow / 40}
          strength={Math.max(0, 1 - blow / 42)}
          count={4}
        />
      ) : null}
      <GrassWorld
        layer="front"
        ground={GROUND}
        wind={ACT_WIND}
        seed={2}
        avoid={[
          { x: S7_X, r: 330 },
          { x: S7_CLOCK.x, r: 360 },
        ]}
      />
      <Bubbles
        scene={scene}
        cast={{ puff: { x: S7_X, y: S7_Y, scale: S7_SCALE, who: "puff", side: "right" } }}
        text={S7_BUBBLES}
        at={{ a1_27_puff: { x: 700, y: 210, tail: "left" } }}
      />
      {/* A whisper of slow motion: the frame dims a hair as the seeds leave, so
          the beat reads as an event rather than as the next shot. */}
      {blow >= 0 && blow < fps * 1.5 ? (
        <AbsoluteFill
          style={{
            background: "#ffffff",
            opacity: 0.1 * Math.max(0, 1 - blow / 14),
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * A dandelion clock with every seed on it, and then not.
 *
 * Each seed is a real object with a stalk and a parachute: it sits on the head
 * at its own angle until `blow` goes positive, then leaves along its own arc
 * (`moveAlong`) at its own speed, spinning. Seeds nearest the blast go first.
 * Nothing here is a particle system — the whole point is that a child can watch
 * one seed all the way across the screen.
 */
const Dandelion: React.FC<{ x: number; y: number; blow: number }> = ({ x, y, blow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const headR = 190;
  return (
    <WideLayer>
      {/* Stem and leaves. */}
      <path
        d={`M ${x - 10} ${GROUND + 40} Q ${x + 60} ${y + 400} ${x} ${y + headR - 20}`}
        stroke={kidTheme.grassDark}
        strokeWidth={26}
        strokeLinecap="round"
        fill="none"
      />
      {/* The receptacle the seeds sit on. */}
      <circle cx={x} cy={y} r={34} fill="#c8b98e" stroke={kidTheme.ink} strokeWidth={7} />
      {Array.from({ length: SEED_COUNT }, (_, i) => {
        // A Fibonacci-ish spread, so the head is evenly covered without a grid.
        const a = i * 2.39996;
        const rr = headR * Math.sqrt((i + 0.6) / SEED_COUNT);
        const home = { x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr };
        // Seeds on the windward (left) side leave first.
        const lead = (1 + Math.cos(a)) * 15 + (i % 5) * 3.5;
        const u = Math.max(0, (blow - lead) / (fps * 3.1));
        if (u <= 0) {
          return <Seed key={i} x={home.x} y={home.y} angle={(a * 180) / Math.PI + 90} sway={Math.sin(t * 1.4 + i) * 2} />;
        }
        // Away to the right and up, on a bowed path, at its own pace.
        const away = {
          x: home.x + 2600 + ((i * 137) % 700),
          y: home.y - 520 + ((i * 211) % 900),
        };
        const p = moveAlong(home, away, Math.min(1, u), {
          arc: 0.1 + (i % 7) * 0.035,
          bias: 0.85,
          ease: kidEase.easeOutSine,
        });
        return (
          <Seed
            key={i}
            x={p.x}
            y={p.y}
            angle={p.angle + 90 + Math.sin(t * 3 + i) * 18}
            sway={Math.sin(t * 2.2 + i) * 5}
            opacity={Math.max(0, 1 - Math.max(0, u - 0.8) * 5)}
          />
        );
      })}
    </WideLayer>
  );
};

const Seed: React.FC<{
  x: number;
  y: number;
  angle: number;
  sway: number;
  opacity?: number;
}> = ({ x, y, angle, sway, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle + sway})`} opacity={opacity}>
    <path d="M 0 0 L 0 26" stroke="#b9a97d" strokeWidth={3} />
    {[-42, -21, 0, 21, 42].map((d) => (
      <path
        key={d}
        d={`M 0 0 L ${Math.sin((d * Math.PI) / 180) * 26} ${-Math.cos((d * Math.PI) / 180) * 26}`}
        stroke={kidTheme.paper}
        strokeWidth={3.4}
        strokeLinecap="round"
        opacity={0.95}
      />
    ))}
    <circle cx={0} cy={26} r={3.4} fill="#8f7f57" />
  </g>
);

// ---------------------------------------------------------------------------
// Scene 8 — Proof two, your own hand
// ---------------------------------------------------------------------------

const S8_WINDOW = { x: 960, y: 470 };
const S8_SCALE = 1.2;

const S8_BUBBLES: Record<string, string> = {
  a1_31_puff: "THEY CAN FEEL ME!",
};

const YourHandScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [waveFrom] = lineWindow(scene, "a1_29_narrator");
  const [beatFrom, beatTo] = heldBeat(scene, "a1_29_narrator");
  const [feelFrom] = lineWindow(scene, "a1_30_narrator");

  // He drops out of the window as the beat opens and comes back for the payoff.
  // script.md: the held beat holds on the *empty* sky window, with nothing
  // animating except the motion arcs — because the thing the child is being
  // asked to look at for a second and a half is their own hand, not him.
  const out = kidEase.easeInOutSine((frame - beatFrom) / 12);
  const back = kidEase.easeOutBack((frame - feelFrom + 10) / 20, 1.2);
  const y = hover("puff", 470 + out * 840 - back * 840, S8_SCALE);

  const emotion = useEmotion(
    scene,
    "puff",
    { a1_31_puff: "excited" },
    "happy",
    // Held beat in this scene.
    NO_LEAD,
  );

  // The wave: a hand-sized swirl crossing the window at the speed of a real
  // one, about three quarters of a second each way, alternating direction.
  const sweeping = frame >= waveFrom && frame < beatTo + 10;
  const cycle = fps * 0.78;
  const k = (frame - waveFrom) / cycle;
  const leg = Math.floor(k);
  const u = k - leg;
  const dir = leg % 2 === 0 ? 1 : -1;
  const armX = S8_WINDOW.x + dir * (u - 0.5) * 900;
  const armStrength = Math.sin(u * Math.PI);

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={2} />
      {/* The window: two towering blades left and right and nothing between
          them but sky. */}
      <WideLayer>
        {[-1, 1].map((s) => (
          <g key={s}>
            <path
              d={
                `M ${S8_WINDOW.x + s * 620 - 150} ${GROUND + 40}` +
                ` Q ${S8_WINDOW.x + s * 520} 260 ${S8_WINDOW.x + s * 700} -420` +
                ` Q ${S8_WINDOW.x + s * 860} 260 ${S8_WINDOW.x + s * 620 + 150} ${GROUND + 40} Z`
              }
              fill={s < 0 ? kidTheme.grassDark : "#2e8f3e"}
            />
          </g>
        ))}
        {/* The floor of the window. He drops behind it for the beat, so what
            the child is looking at while they wave their own hand is an empty
            piece of sky. */}
        <path
          d={`M -1200 ${GROUND - 210} Q 960 ${GROUND - 360} 3200 ${GROUND - 210} L 3200 1800 L -1200 1800 Z`}
          fill={kidTheme.grass}
        />
        <path
          d={`M -1200 ${GROUND - 150} Q 960 ${GROUND - 300} 3200 ${GROUND - 150} L 3200 1800 L -1200 1800 Z`}
          fill={kidTheme.grassDark}
          opacity={0.45}
        />
      </WideLayer>
      {sweeping ? (
        <AirArcs
          x={armX}
          y={S8_WINDOW.y + 40}
          scale={1.5}
          rot={dir > 0 ? 0 : 180}
          strength={armStrength}
          count={4}
        />
      ) : null}
      <Puff
        x={S8_WINDOW.x}
        y={y}
        scale={S8_SCALE}
        opacity={PUFF_OPACITY.actOne}
        phase={PHASE.puff}
        emotion={emotion}
        speaking={useStage(scene).speaking("puff")}
        // The only time in the episode he addresses the audience directly.
        look="camera"
        eyeLife={0.45}
        idle={0.85}
      />
      <Bubbles
        scene={scene}
        cast={{
          puff: { x: S8_WINDOW.x, y, scale: S8_SCALE, who: "puff", side: "right", offset: 430 },
        }}
        text={S8_BUBBLES}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 9 — Proof three, the balloon
// ---------------------------------------------------------------------------

const S9_BALLOON = { x: 960, y: 520 };

const S9_BUBBLES: Record<string, string> = {
  a1_33_puff: "I am inside a balloon!",
  a1_35_puff: "I FILLED it! I have a SHAPE!",
};

const BalloonScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [oofFrom, oofTo] = lineWindow(scene, "a1_33_puff");
  const [fatFrom] = lineWindow(scene, "a1_34_narrator");
  const [shapeFrom] = lineWindow(scene, "a1_35_puff");

  // Three big pulses across Puff's "Oof. Oof!", each one a step up with a
  // settle on top — a balloon does not inflate smoothly, it goes in breaths.
  const pulses = 3;
  const per = Math.max(1, (oofTo - oofFrom) / pulses);
  const step = Math.max(0, Math.min(pulses, Math.floor((frame - oofFrom) / per) + 1));
  const intoStep = ((frame - oofFrom) % per) / per;
  const ring = frame >= oofFrom && frame < oofTo ? settleWave(intoStep, 1.1, 4) : 0;
  const inflate =
    frame < oofFrom
      ? 0.22
      : Math.min(1, 0.22 + (step / pulses) * 0.78) * (1 + ring * 0.07);

  // Then a cut to it sitting fat and taut on the grass, holding its own shape.
  const cutAt = fatFrom + 10;
  const sitting = frame >= cutAt;

  const emotion = useEmotion(
    scene,
    "puff",
    { a1_33_puff: "excited", a1_35_puff: "proud" },
    "happy",
  );

  const balloonY = sitting ? 640 : S9_BALLOON.y;
  const balloonScale = sitting ? 0.86 : inflate * 0.86;

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={2} />
      <GrassWorld ground={GROUND} wind={ACT_WIND} seed={7} />
      <Balloon x={S9_BALLOON.x} y={balloonY} scale={balloonScale} taut={sitting} />
      {/* Puff inside, squashed to the balloon's shape. The camera does the
          squash rather than a scale prop, so his face stays the right way up
          and only his body takes the pressure. */}
      <Camera
        cam={{
          x: S9_BALLOON.x,
          y: balloonY,
          zoom: (sitting ? 1.02 : inflate) * 0.74,
          zoomY: (sitting ? 1.24 : inflate) * 0.92,
        }}
      >
        <Puff
          x={S9_BALLOON.x}
          y={hover("puff", balloonY - 10, 1.05)}
          scale={1.05}
          opacity={PUFF_OPACITY.actOne}
          phase={PHASE.puff}
          emotion={emotion}
          speaking={useStage(scene).speaking("puff")}
          look={frame >= shapeFrom ? "camera" : "upLeft"}
          // No wisps inside a balloon: there is nowhere for them to stream to,
          // and that is exactly the gag — he has a shape now.
          wisps={0}
          arms={!sitting}
          idle={sitting ? 0.35 : 1.3}
        />
      </Camera>
      {sitting ? <CutFlash at={cutAt} strength={0.5} /> : null}
      <GrassWorld
        layer="front"
        ground={GROUND}
        wind={ACT_WIND}
        seed={7}
        avoid={[{ x: S9_BALLOON.x, r: 420 }]}
      />
      <Bubbles
        scene={scene}
        cast={{
          puff: {
            x: S9_BALLOON.x,
            y: hover("puff", balloonY - 10, 1.05),
            scale: 1.05,
            who: "puff",
            side: "right",
            offset: 480,
          },
        }}
        text={S9_BUBBLES}
        at={{ a1_35_puff: { x: 1400, y: 250, tail: "left" } }}
      />
    </AbsoluteFill>
  );
};

/** A yellow party balloon. `taut` gives it the hard-filled look and a knot. */
const Balloon: React.FC<{ x: number; y: number; scale: number; taut: boolean }> = ({
  x,
  y,
  scale,
  taut,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wobble = taut ? 0 : Math.sin((frame / fps) * 3.2) * 0.02;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale * (1 + wobble)}, ${scale * (1 - wobble)})`,
      }}
    >
      <svg width={620} height={760} viewBox="-310 -400 620 760" overflow="visible">
        <path
          d="M 0 -330 C 210 -330 260 -150 260 -20 C 260 150 140 274 0 274 C -140 274 -260 150 -260 -20 C -260 -150 -210 -330 0 -330 Z"
          fill={kidTheme.sun}
          stroke={kidTheme.ink}
          strokeWidth={12}
          strokeLinejoin="round"
        />
        <path
          d="M -150 -186 C -104 -262 -34 -282 6 -276"
          stroke={kidTheme.sunLight}
          strokeWidth={30}
          strokeLinecap="round"
          fill="none"
          opacity={0.9}
        />
        {/* Knot. */}
        <path
          d="M -34 274 L 0 330 L 34 274 Z"
          fill={kidTheme.sunDark}
          stroke={kidTheme.ink}
          strokeWidth={10}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 10 — Big Word One: AIR
// ---------------------------------------------------------------------------

const CARD_Y = 300;
/**
 * Where Puff perches, hand-tuned against a still of the card at 1920×1080.
 *
 * `A_CROSSBAR` is the crossbar of the A in the `WordCard`'s "AIR"; `A_BLOCK` is
 * the top of the A block once the word breaks apart for the chant. He hops
 * from one to the other as the letters split under him, which is the only bit
 * of business in the beat and is worth the two magic numbers.
 */
const A_CROSSBAR = { x: 872, y: 224 };
const A_BLOCK = { x: 787, y: 176 };
/** Small enough to perch on a letter and still be a character. */
const PERCH_SCALE = 0.46;

const BigWordAirScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [wordFrom, wordTo] = lineWindow(scene, "a1_37_narrator");
  const [chantFrom] = lineWindow(scene, "a1_38_puff");
  const [feelFrom, feelTo] = lineWindow(scene, "a1_40_puff");
  // The freeze lands on the word itself — "…our first big word. Air."
  const slamAt = Math.round(wordFrom + (wordTo - wordFrom) * 0.84);
  const splitAt = Math.max(slamAt + 20, chantFrom - 8);

  // He rides the letters apart: a hop from the crossbar to the top of the A
  // block, on an arc, landing with a settle.
  const hopU = (frame - splitAt + 6) / 16;
  const perch = moveAlong(A_CROSSBAR, A_BLOCK, hopU, {
    arc: 0.3,
    ease: kidEase.easeInOutSine,
  });
  const land = hopU > 1 ? settleWave((hopU - 1) / 2.2, 1.3, 4.4) : 0;

  // The catchphrase is where the AIR card pays off, so it is also where the
  // opacity ramp steps: forty percent to fifty-five, across the line itself.
  const opacity = interpolate(
    frame,
    [feelFrom, feelTo],
    [PUFF_OPACITY.actOne, PUFF_OPACITY.afterAir],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const emotion = useEmotion(
    scene,
    "puff",
    { a1_38_puff: "excited", a1_40_puff: "proud" },
    "amazed",
    // Two 12-frame held beats in this scene.
    NO_LEAD,
  );

  return (
    <AbsoluteFill>
      <BigWordBeat
        scene={scene}
        word="AIR"
        syllables={["A", "I", "R"]}
        chantKey="a1_38_puff"
        slamAt={slamAt}
        color={ACT_COLOR.air}
        sub="you can feel it"
        y={CARD_Y}
        freeze={<BalloonStill />}
      >
        <Puff
          x={perch.x}
          y={hover("puff", perch.y + land * 8, PERCH_SCALE)}
          scale={PERCH_SCALE * (1 + land * 0.1)}
          opacity={opacity}
          phase={PHASE.puff}
          emotion={emotion}
          speaking={useStage(scene).speaking("puff")}
          look="camera"
          zIndex={55}
          idle={0.6}
          wisps={2}
        />
      </BigWordBeat>
    </AbsoluteFill>
  );
};

/**
 * The action the Big Word freezes: Scene 9's last shot, rebuilt from the same
 * numbers so the freeze reads as the picture we were just watching.
 */
const BalloonStill: React.FC = () => (
  <AbsoluteFill>
    <SkyBlend from="day" to="day" u={0} clouds={2} />
    <GrassWorld ground={GROUND} wind={ACT_WIND} seed={7} />
    <Balloon x={S9_BALLOON.x} y={640} scale={0.86} taut />
    <Camera cam={{ x: S9_BALLOON.x, y: 640, zoom: 0.755, zoomY: 1.14 }}>
      <Puff
        x={S9_BALLOON.x}
        y={hover("puff", 630, 1.05)}
        scale={1.05}
        opacity={PUFF_OPACITY.actOne}
        phase={PHASE.puff}
        emotion="proud"
        look="camera"
        wisps={0}
        arms={false}
        idle={0.35}
      />
    </Camera>
    <GrassWorld
      layer="front"
      ground={GROUND}
      wind={ACT_WIND}
      seed={7}
      avoid={[{ x: S9_BALLOON.x, r: 420 }]}
    />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Scene 11 — Not sorry. Sorry.
// ---------------------------------------------------------------------------

const S11_X = 900;
const S11_SCALE = 1.35;

const S11_BUBBLES: Record<string, string> = {
  a1_42_puff: "Sorry! I mean. Not sorry.",
  a1_43_puff: "Sorry.",
};

const NotSorryScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [tallFrom, tallTo] = lineWindow(scene, "a1_41_narrator");
  const [notFrom, notTo] = lineWindow(scene, "a1_42_puff");
  const [beatFrom] = heldBeat(scene, "a1_42_puff");
  const [sorryFrom] = lineWindow(scene, "a1_43_puff");

  // Three moves, and they are the whole act's arc in nine seconds:
  //   1. he draws himself up as tall as a puff of air can  (a1_41)
  //   2. he catches himself apologising, and stops         (mid a1_42)
  //   3. he catches himself catching himself               (a1_43)
  const grow = kidEase.easeOutBack((frame - tallFrom - 12) / 26, 1.3);
  // The apology reflex, and the correction, inside one line: "Sorry!" folds him
  // down, "Not sorry" pushes him back up further than before.
  const inLine = lineProgress(scene, "a1_42_puff", frame);
  const fold = frame >= notFrom && frame < notTo ? Math.max(0, 1 - Math.abs(inLine - 0.2) / 0.24) : 0;
  const proud = frame >= notFrom + (notTo - notFrom) * 0.5 ? 1 : 0;
  // And then the button.
  const shrink = kidEase.easeOutQuad((frame - sorryFrom) / 12);

  const tall = grow * 0.16 + proud * 0.06 - fold * 0.14 - shrink * 0.2;
  const wide = -tall * 0.55;

  const emotion = useEmotion(
    scene,
    "puff",
    { a1_42_puff: "proud", a1_43_puff: "sad" },
    "happy",
    // 30f held beat in this scene: his confidence must not crack before the
    // last "Sorry." starts, because the crack *is* the last "Sorry.".
    NO_LEAD,
  );

  const y = hover("puff", 590, S11_SCALE);

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={3} />
      <GrassWorld ground={GROUND} wind={ACT_WIND} seed={9} />
      {/* A hair of glow behind him as he draws up. Not a halo — the light in
          the grass, agreeing with him for a second. */}
      <SoftShade
        x={S11_X}
        y={560}
        rx={560}
        ry={430}
        strength={-0.001 + 0.16 * Math.max(0, grow - shrink)}
        color="255,246,200"
      />
      <Camera cam={{ x: S11_X, y: 760, zoom: 1 + wide, zoomY: 1 + tall }}>
        <Puff
          x={S11_X}
          y={y}
          scale={S11_SCALE}
          opacity={PUFF_OPACITY.afterAir}
          phase={PHASE.puff}
          emotion={emotion}
          speaking={useStage(scene).speaking("puff")}
          look={frame >= beatFrom && frame < sorryFrom ? "camera" : "upRight"}
          pose={frame >= sorryFrom ? "hug" : "rest"}
          idle={frame >= beatFrom && frame < sorryFrom ? 0.45 : 1}
          eyeLife={frame >= beatFrom && frame < sorryFrom ? 0.4 : 1}
        />
      </Camera>
      <GrassWorld
        layer="front"
        ground={GROUND}
        wind={ACT_WIND}
        seed={9}
        avoid={[{ x: S11_X, r: 380 }]}
      />
      <Bubbles
        scene={scene}
        cast={{ puff: { x: S11_X, y, scale: S11_SCALE, who: "puff", side: "right", offset: 470 } }}
        text={S11_BUBBLES}
      />
      {/* Nothing else is on screen for the last second and a half. That is the
          scene tail in Video.tsx, and it belongs to the last "Sorry." */}
      <TallHint at={tallTo} />
    </AbsoluteFill>
  );
};

/** A couple of motion arcs leaving him as he stretches. Two frames of business. */
const TallHint: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const u = (frame - at) / 22;
  if (u < 0 || u > 1) return null;
  return (
    <AirArcs
      x={S11_X - 40}
      y={430 - u * 90}
      scale={0.8}
      rot={-96}
      strength={Math.sin(u * Math.PI) * 0.8}
      count={3}
    />
  );
};

export const ACT1_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s03_grass: GrassScene,
  s04_beetle: BeetleScene,
  s05_leaf: LeafScene,
  s06_nothing: NothingScene,
  s07_dandelion: DandelionScene,
  s08_your_hand: YourHandScene,
  s09_balloon: BalloonScene,
  s10_bigword_air: BigWordAirScene,
  s11_not_sorry: NotSorryScene,
};
