import React from "react";
import { Easing } from "remotion";
import { SpeechBubble, keyDirTo, kidTheme, kidType, lookAt, type Emotion } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  ACT_COLOR,
  AbsoluteFill,
  BigWordBeat,
  Bubbles,
  CaptionCard,
  CutFlash,
  KeyBloom,
  LIGHT,
  LightPool,
  NIGHT_PAPER,
  NameArrow,
  PHASE,
  PaintedDrip,
  PaintedSunny,
  Plate,
  SETS,
  SetStack,
  SkyBlend,
  SteamWisps,
  Thermometer,
  WIDTH,
  afterLine,
  atLine,
  bigWordPush,
  burst,
  interpolate,
  kidPaintTheme,
  lineProgress,
  midOf,
  project,
  remasterCam,
  ribbon,
  stand,
  useCurrentFrame,
  useEmotion,
  useVideoConfig,
  withCam,
  type Cam,
  type Cast,
  type LightRig,
  type PlateKey,
  type Pt,
  type TimedScene,
} from "./common";
import { Crowd, FgSwell, MotionArcs, PaperWash, SunBeams, Svg, Zenith, rnd, secs, shake } from "./act1kit";

// Act one, re-pictured on the look package (shot-plan rows s03–s11 + the
// D12 rulings). The beats are ep 1's (src/videos/water-cycle/scenes/act1.tsx);
// the pictures are plate planes + lit painted cast + camera grammar. Every
// camera move is pinned to a line key; no move while a bubble is up except
// s09's FOLLOW (the plan's call: Drip is pinned on screen while the world
// falls away, so his bubble stays put relative to him).

const P = kidPaintTheme;

/** Light row with the key aimed at Sunny's disc from `from` (he IS the key on screen). */
const keyAt = (id: string, from: { x: number; y: number }, sun: { x: number; y: number }): LightRig => ({
  ...LIGHT[id],
  dir: keyDirTo(from, sun),
});

// ---------------------------------------------------------------------------
// Scene 3 — The ocean, wide; the crowd; the name arrow
// ---------------------------------------------------------------------------
// Plan: wide → medium, horizon upper third, high cam on the crowd. Two
// stepped pull-out BURSTs on a1_01 "Big. / Blue." (measured: 2.26 s, 2.66 s);
// BURST in on a1_03 (narrator) settled before the a1_04 bubble; HOLD through
// the roll-call; pull-out on a1_05 (narrator) to the ocean-sized crowd.

const S3_GROUND = 772;
const S3_SCALE = 0.42;
const S3_DRIP = { x: 760, y: stand("drip", S3_GROUND) };
const S3_FOCUS = { x: S3_DRIP.x, y: midOf("drip", S3_DRIP.y, S3_SCALE) };

/** Crowd rows by depth: y → scale (a high camera looking down on a flat sea). */
const crowdRows = (ys: number[], x = 960, spread = 3800) =>
  ys.map((y, i) => ({ y, s: 0.3 + ((y - 430) / 600) * 1.05, count: 12 + (i % 3) * 2, spread: spread + i * 120, x: x + (i % 2 ? 60 : -40) }));

const OceanWideScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const big = atLine(scene, "a1_01_narrator");
  const arrowAt = atLine(scene, "a1_03_narrator");
  const many = atLine(scene, "a1_05_narrator");
  const hiFrom = atLine(scene, "a1_04_drip");
  const cam = remasterCam(frame, {
    base: { ...S3_FOCUS, zoom: 1.5 },
    creep: { from: 0 },
    bursts: [
      { at: secs(big, 2.18), delta: { zoom: 1 / 1.22 } },
      { at: secs(big, 2.6), delta: { zoom: 1 / 1.23 } },
      { at: arrowAt + 6, delta: { zoom: 1.55 } },
      { at: many + 20, delta: { zoom: 0.46 }, frames: 14 },
    ],
  });
  const zoom = cam.zoom ?? 1;
  const dripScreen = project(cam, S3_FOCUS);
  // Tip just above his crown: body tip sits ~150 local units above his middle.
  const arrowTip = dripScreen.y - 150 * S3_SCALE * zoom - 14;
  // Head-turn per name on the roll-call: left / right / camera, every 22 f.
  const turn = frame >= hiFrom && frame < afterLine(scene, "a1_04_drip") ? Math.floor((frame - hiFrom) / 22) % 3 : 2;
  const look = turn === 0 ? "left" : turn === 1 ? "right" : "camera";
  const cast: Cast = { drip: { ...S3_DRIP, scale: S3_SCALE, who: "drip" } };
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.ocean.dawn}
        cam={cam}
        bleed={0.3}
        horizons={{ far: 330, mid: 404, near: 1010 }}
        sky={<LightPool x={1700} y={360} r={1200} ry={420} color="#ffc27a" opacity={0.55} />}
        mid={<Crowd id="s3m" rows={crowdRows([440, 470, 505], 960, 4600)} bob={3} litDir={1} />}
        stage={
          <>
            <Crowd id="s3s" rows={crowdRows([560, 640, 735, 860, 1000, 1160])} litDir={1} avoid={{ x: S3_DRIP.x, y: S3_GROUND - 60, r: 210 }} />
            <PaintedDrip
              id={scene.id}
              {...S3_DRIP}
              scale={S3_SCALE}
              emotion={useEmotion(scene, "drip", { a1_02_drip: "excited", a1_04_drip: "happy" }, "happy")}
              speaking={useSpeaking(scene, "drip")}
              phase={PHASE.drip}
              look={look}
              groundY={S3_GROUND}
              groundLum={0.25}
            />
          </>
        }
      />
      <NameArrow x={dripScreen.x} y={arrowTip} label="DRIP" from={arrowAt} dir="left" color={kidTheme.tomato} />
      <Bubbles
        scene={scene}
        cast={cast}
        text={{ a1_02_drip: "My home! My family!", a1_04_drip: "Hi! Hi! Hi! Hi!" }}
        at={{
          a1_02_drip: { x: Math.min(1500, dripScreen.x + 520), y: 220, tail: "left", tailAt: dripScreen.x + 50 },
          a1_04_drip: { x: Math.min(1500, dripScreen.x + 520), y: 220, tail: "left", tailAt: dripScreen.x + 50 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4 — Slosh: Monday / Tuesday / also Tuesday (two jump-cuts, D12 Q1)
// ---------------------------------------------------------------------------
// Plan: medium, horizon mid, eye; HOLD creep restarting on each identical
// card (same frames = the joke); the 2 jump cuts with CutFlash 0.55 are kept;
// BURST 14 px + roll to 3° at wantFrom − 12, inside the 44 f gap, settled as
// the a1_07 bubble pops.

const S4_GROUND = 900;
const S4_SCALE = 1.05;
const S4_DRIP = { x: 900, y: stand("drip", S4_GROUND) };
const SLOSH_CARDS = ["Monday", "Tuesday", "also Tuesday"];

const SloshScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wantFrom = atLine(scene, "a1_07_drip");
  const punchAt = Math.max(SLOSH_CARDS.length - 1, wantFrom - fps);
  const cuts = SLOSH_CARDS.map((_, i) => Math.round((punchAt * i) / Math.max(1, SLOSH_CARDS.length - 1)));
  const shotEnd = (i: number) => (i + 1 < cuts.length ? cuts[i + 1] : scene.durationInFrames);
  const shot = cuts.filter((c) => c <= frame).length - 1;
  const focus = { x: S4_DRIP.x, y: midOf("drip", S4_DRIP.y, S4_SCALE) };
  const cam = remasterCam(frame, {
    base: { ...focus },
    creep: { from: cuts[Math.max(0, shot)] },
    bursts: [{ at: wantFrom - 12, delta: { zoom: 1.05, rotate: 3 } }],
  });
  const cast: Cast = { drip: { ...S4_DRIP, scale: S4_SCALE, who: "drip" } };
  const dripScreen = project(cam, focus);
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.ocean.dawn}
        cam={cam}
        bleed={0.3}
        horizons={{ far: 500, mid: 570, near: 990 }}
        fg={<FgSwell top={1050} color="#1a1f48" deep="#11143a" ink="#14163a" />}
        sky={<LightPool x={1700} y={480} r={1200} ry={440} color="#ffc27a" opacity={0.55} />}
        stage={
          <PaintedDrip
            id={scene.id}
            {...S4_DRIP}
            scale={S4_SCALE}
            emotion={useEmotion(scene, "drip", { a1_06_drip: "grumpy", a1_07_drip: "excited" }, "grumpy", 2)}
            speaking={useSpeaking(scene, "drip")}
            phase={PHASE.drip}
            idle={0.5}
            look="camera"
            groundY={S4_GROUND}
            groundLum={0.25}
          />
        }
      />
      {SLOSH_CARDS.map((text, i) => (
        <React.Fragment key={text}>
          <CutFlash at={cuts[i]} strength={i === 0 ? 0 : 0.55} />
          <CaptionCard text={text} from={cuts[i]} until={i === cuts.length - 1 ? wantFrom + 36 : shotEnd(i) - 5} y={165} align="left"
            color={NIGHT_PAPER} />
        </React.Fragment>
      ))}
      <Bubbles
        scene={scene}
        cast={cast}
        text={{ a1_06_drip: "Slosh. Slosh. Slosh.", a1_07_drip: "I want an ADVENTURE!" }}
        at={{
          a1_06_drip: { x: 1440, y: 210, tail: "left", tailAt: dripScreen.x + 90 },
          a1_07_drip: { x: 1440, y: 210, tail: "left", tailAt: dripScreen.x + 90 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5 — Sunrise: something enormous rises; it has a face
// ---------------------------------------------------------------------------
// Plan: wide, horizon low third, low cam. HOLD creep; Sunny's rise is HIS
// move; BURST 14 px vertical shake on "GOOD MORNING" inside the 14 f gap
// before the bubble. Key brightens two steps over his entrance (pool + bloom).

const S5_SUN = { x: 1340, scale: 1.45 };
const S5_DRIP = { x: 330, ground: 930, scale: 0.3 };

const SunriseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const dawnEnd = afterLine(scene, "a1_08_narrator");
  const morningFrom = atLine(scene, "a1_09_sunny");
  const morningTo = afterLine(scene, "a1_09_sunny");
  const gold = interpolate(frame, [0, dawnEnd - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = interpolate(frame, [dawnEnd - 60, morningFrom + 6], [1600, 420], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const bright = interpolate(frame, [dawnEnd - 40, morningTo + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = remasterCam(frame, { deltas: [shake(frame, dawnEnd, 14)] });
  const dripAt = { x: S5_DRIP.x, y: stand("drip", S5_DRIP.ground) };
  const dripMid = { x: dripAt.x, y: midOf("drip", dripAt.y, S5_DRIP.scale) };
  const sunMid = { x: S5_SUN.x, y: midOf("sunny", rise, S5_SUN.scale) };
  const cast: Cast = { sunny: { x: S5_SUN.x, y: rise, scale: S5_SUN.scale, who: "sunny" } };
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.ocean.sunrise}
        cam={cam}
        hide={["sky"]}
        horizons={{ far: 720, mid: 880, near: 1010 }}
        fg={<FgSwell top={1000} />}
        sky={
          <>
            <SkyBlend from="ocean_sky_dawn" to="ocean_sky_sunrise" u={gold} />
            <Zenith opacity={0.55 + 0.25 * gold} />
            <LightPool x={S5_SUN.x} y={Math.min(760, sunMid.y)} r={900 + 300 * bright} ry={600} color="#ffcf78" opacity={0.25 + 0.45 * bright} />
            <PaintedSunny id={scene.id} x={S5_SUN.x} y={rise} scale={S5_SUN.scale} emotion="proud" speaking={useSpeaking(scene, "sunny")}
              phase={PHASE.sunny} shades={0} look={{ x: -0.3, y: 0.35 }} />
          </>
        }
        stage={
          <PaintedDrip
            id={scene.id}
            {...dripAt}
            scale={S5_DRIP.scale}
            emotion="amazed"
            phase={PHASE.drip}
            look={lookAt(dripMid, sunMid, 900)}
            light={keyAt(scene.id, dripMid, sunMid)}
            groundY={S5_DRIP.ground}
            groundLum={0.35}
          />
        }
      />
      <KeyBloom x={sunMid.x} y={sunMid.y} r={420} color="#ffe09a" opacity={0.2 + 0.35 * bright} />
      <Bubbles scene={scene} cast={cast} text={{ a1_09_sunny: "GOOD MORNING!" }}
        at={{ a1_09_sunny: { x: 560, y: 260, tail: "right", tailAt: sunMid.x - 260 } }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 6 — Sunny's hero shot; Drip a squinting dot
// ---------------------------------------------------------------------------
// Plan: wide, horizon at the bottom edge, LOW cam looking up at Sunny. HOLD
// creep (Sunny's rays/flares are prop motion); BURST 14 px toward Drip just
// before the a1_12 bubble; BURST back up just before a1_13 "I am the SUN".

const S6_SUN = { x: 1260, y: 440, scale: 1.7 };
const S6_DRIP = { x: 330, ground: 1010, scale: 0.3 };

const SunnyIntroScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bragFrom = atLine(scene, "a1_11_sunny");
  const bragTo = afterLine(scene, "a1_11_sunny");
  const dripLine = atLine(scene, "a1_12_drip");
  const sunLine = atLine(scene, "a1_13_sunny");
  const sunMid = { x: S6_SUN.x, y: midOf("sunny", S6_SUN.y, S6_SUN.scale) };
  const dripAt = { x: S6_DRIP.x, y: stand("drip", S6_DRIP.ground) };
  const dripMid = { x: dripAt.x, y: midOf("drip", dripAt.y, S6_DRIP.scale) };
  const cam = remasterCam(frame, {
    base: { x: 960, y: 540, zoom: 1.03 },
    bursts: [
      { at: dripLine - 10, delta: { dx: 70, dy: -46 }, frames: 10 },
      { at: sunLine - 10, delta: { dx: -70, dy: 46 }, frames: 10 },
    ],
  });
  const shades = interpolate(frame, [bragFrom + 6, bragTo], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t = frame / fps;
  const sunS = project(cam, sunMid);
  const dripS = project(cam, dripMid);
  const cast: Cast = {
    sunny: { ...S6_SUN, who: "sunny" },
    drip: { ...dripAt, scale: S6_DRIP.scale, who: "drip" },
  };
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.sky.morning}
        cam={cam}
        horizons={{ far: 300 }}
        fg={<FgSwell top={1048} amp={12} />}
        sky={
          <>
            <Zenith />
            {/* Sky-weight paper multiply: the high sky is otherwise a smooth digital gradient. */}
            <PaperWash opacity={0.32} />
            <LightPool x={sunMid.x} y={sunMid.y} r={1000} color="#ffd98a" opacity={0.45} />
          </>
        }
        stage={
          <>
            <PaintedSunny id={scene.id} x={S6_SUN.x} y={S6_SUN.y} scale={S6_SUN.scale} emotion="proud" speaking={useSpeaking(scene, "sunny")}
              phase={PHASE.sunny} shades={shades} raySpeed={0.3} look={lookAt(sunMid, dripMid, 1400)} />
            <PaintedDrip id={scene.id} {...dripAt} scale={S6_DRIP.scale}
              emotion={useEmotion(scene, "drip", { a1_12_drip: "amazed" }, "grumpy")}
              speaking={useSpeaking(scene, "drip")} phase={PHASE.drip} look={lookAt(dripMid, sunMid, 1400)}
              light={keyAt(scene.id, dripMid, sunMid)} groundY={S6_DRIP.ground} groundLum={0.35} />
          </>
        }
      />
      {/* Self-added lens flares, re-pictured as soft masked blooms down the key axis — never UI discs. */}
      {/* Self-added flares down the key axis: soft blooms (screen), sized to read at phone size. */}
      {[0.3, 0.48, 0.66, 0.84].map((u, i) => (
        <KeyBloom key={u} x={sunS.x + (dripS.x - sunS.x) * u * 0.9} y={sunS.y + (dripS.y - sunS.y) * u * 0.9}
          r={90 + i * 46} color={i % 2 ? "#ffe6a8" : "#ffd27a"} opacity={0.34 + 0.1 * Math.sin(t * 1.3 + i)} />
      ))}
      {/* Key bloom on the disc (PaintDemo iteration-2 numbers: r 420+, opacity 0.55, feathered). */}
      <KeyBloom x={sunS.x} y={sunS.y} r={560} color="#ffe09a" opacity={0.5} />
      <Bubbles
        scene={scene}
        cast={cast}
        text={{ a1_11_sunny: "I invented mornings!", a1_12_drip: "Whoa. Who are you?", a1_13_sunny: "I am the SUN!" }}
        at={{
          a1_11_sunny: { x: 620, y: 600, tail: "right", tailAt: sunS.x - 300 },
          a1_13_sunny: { x: 620, y: 600, tail: "right", tailAt: sunS.x - 300 },
          a1_12_drip: { x: 520, y: 760, tail: "left", tailAt: dripS.x + 20 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 7 — Warming: beam ropes, the thermometer, the water heats
// ---------------------------------------------------------------------------
// Plan: wide, horizon mid, eye; HOLD creep, no bursts (the heat climbs, the
// camera does not). Beam light pools on the water (screen).

const S7_SUN = { x: 1500, y: stand("sunny", 520), scale: 1.05 };
const S7_DRIP = { x: 820, ground: 920, scale: 0.75 };

const WarmingScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const jobFrom = atLine(scene, "a1_14_narrator");
  const watchFrom = atLine(scene, "a1_15_sunny");
  const warmerTo = afterLine(scene, "a1_16_narrator");
  const beams = interpolate(frame, [watchFrom, watchFrom + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heat = interpolate(frame, [watchFrom + 10, warmerTo], [0.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = remasterCam(frame);
  const sunMid = { x: S7_SUN.x, y: midOf("sunny", S7_SUN.y, S7_SUN.scale) };
  const dripAt = { x: S7_DRIP.x, y: stand("drip", S7_DRIP.ground) };
  const dripMid = { x: dripAt.x, y: midOf("drip", dripAt.y, S7_DRIP.scale) };
  const cast: Cast = { sunny: { ...S7_SUN, who: "sunny" } };
  const sunS = project(cam, sunMid);
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.ocean.morning}
        cam={cam}
        horizons={{ far: 600, mid: 770, near: 1000 }}
        fg={<FgSwell top={995} />}
        sky={<><Zenith /><LightPool x={sunMid.x} y={sunMid.y} r={900} color="#ffd98a" opacity={0.3} /></>}
        stage={
          <>
            <LightPool x={1100} y={900} r={900} ry={200} color="#ffcf78" opacity={0.15 + 0.35 * heat} />
            <SunBeams x={sunMid.x} y={sunMid.y} strength={beams} to={930} />
            <PaintedSunny id={scene.id} x={S7_SUN.x} y={S7_SUN.y} scale={S7_SUN.scale} emotion="proud"
              speaking={useSpeaking(scene, "sunny")} phase={PHASE.sunny} shades={1} look={{ x: -0.6, y: 0.5 }} />
            <PaintedDrip id={scene.id} {...dripAt} scale={S7_DRIP.scale} emotion={heat > 0.55 ? "excited" : "happy"}
              phase={PHASE.drip} look={lookAt(dripMid, sunMid, 1200)} light={keyAt(scene.id, dripMid, sunMid)}
              groundY={S7_DRIP.ground} groundLum={0.35} />
            {heat > 0.45 ? (
              <Svg style={{ opacity: (heat - 0.45) / 0.55 }}>
                <SteamWisps x={1080} y={930} count={3} scale={0.8} />
                <SteamWisps x={1420} y={960} count={2} scale={0.7} phase={0.4} />
                <SteamWisps x={480} y={950} count={2} scale={0.7} phase={0.7} />
              </Svg>
            ) : null}
          </>
        }
      />
      <KeyBloom x={sunS.x} y={sunS.y} r={380} color="#ffe09a" opacity={0.35} />
      <Thermometer x={150} y={640} level={0.1 + heat * 0.82} scale={0.9} label="WARM" />
      <Bubbles scene={scene} cast={cast} text={{ a1_15_sunny: "Watch this. Warming up!" }}
        at={{ a1_15_sunny: { x: 760, y: 210, tail: "right", tailAt: sunS.x - 200 } }} />
      {frame > jobFrom + 40 && frame < watchFrom ? (
        <CaptionCard text="a very big job" from={jobFrom + 40} until={watchFrom - 6} y={150} color={P.paper} />
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 8 — Everywhere: Drip blissful, then the whip tour (D12 Q2)
// ---------------------------------------------------------------------------
// Plan: close on Drip (HOLD creep) for a1_17–a1_18; then a1_19 as four
// screen-locked chunks in a top-right badge, each popping AFTER its move
// settles. a1_19 = "Every ocean! / Every lake! / Every puddle! / Every single
// day! HA! HA!" (chunk starts estimated by syllable from the measured speech
// span 0.28–3.93 s: 0.28, 1.09, 1.70, 2.51 s). Builder call (logged in the
// report): chunk 1 "Every ocean!" is ON the ocean, so its move is a BURST
// pull-out from the close-up; chunks 2–4 each get a 26 px whip BURST to the
// lake, the puddle and the dog bowl (the paddy plate is unused — four chunks,
// four moves, each insert matching its word).

const S8_GROUND = 1000;
const S8_SCALE = 1.5;
const S8_DRIP = { x: 1150, y: stand("drip", S8_GROUND) };
const S8_INSERTS: Array<{ k: PlateKey; label: string; steam: Array<[number, number]> }> = [
  { k: "everywhere_lake", label: "a lake", steam: [[860, 760], [1180, 800]] },
  { k: "everywhere_puddle", label: "a puddle", steam: [[900, 820]] },
  { k: "everywhere_dogbowl", label: "a dog bowl", steam: [[1020, 770], [1160, 780]] },
];
const S8_CHUNKS = ["Every ocean!", "Every lake!", "Every puddle!", "Every single day! HA!"];
const S8_CHUNK_AT = [0.28, 1.09, 1.7, 2.51];

const EverywhereScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const line = atLine(scene, "a1_19_sunny");
  const lineEnd = afterLine(scene, "a1_19_sunny");
  const chunkAt = S8_CHUNK_AT.map((s) => secs(line, s));
  const whips = [chunkAt[1] - 12, chunkAt[2] - 12, chunkAt[3] - 12];
  const pull = line - 12;
  // The strip of inserts slides by whole frames: three ease-out bursts of −1920 px.
  const stripX = whips.reduce((acc, at) => acc + (burst(frame, at, { dx: -WIDTH }).dx ?? 0), 0);
  const speed = Math.abs(whips.reduce((acc, at) => acc + (burst(frame, at, { dx: -WIDTH }).dx ?? 0) - (burst(frame - 1, at, { dx: -WIDTH }).dx ?? 0), 0));
  const focus = { x: S8_DRIP.x, y: midOf("drip", S8_DRIP.y, S8_SCALE) };
  const cam = remasterCam(frame, { base: { ...focus }, bursts: [{ at: pull, delta: { zoom: 0.62 } }] });
  const bliss = lineProgress(scene, "a1_17_drip", frame);
  const dripS = project(cam, focus);
  const cast: Cast = { drip: { ...S8_DRIP, scale: S8_SCALE, who: "drip" } };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${stripX}px)` }}>
        <AbsoluteFill>
          <SetStack
            set={SETS.ocean.morning}
            cam={cam}
            bleed={0.35}
            horizons={{ far: 470, mid: 660, near: 1010 }}
        fg={<FgSwell top={1010} />}
            sky={<><Zenith /><LightPool x={1700} y={150} r={900} color="#ffd98a" opacity={0.35} /></>}
            stage={
              <>
                <LightPool x={S8_DRIP.x} y={focus.y} r={520} ry={560} color="#ff8fb0" opacity={0.35 * bliss} />
                <Svg>
                  <SteamWisps x={S8_DRIP.x - 330} y={1010} count={2} scale={0.9} />
                  <SteamWisps x={S8_DRIP.x + 340} y={1030} count={3} scale={1} phase={0.5} />
                  <SteamWisps x={300} y={1000} count={3} scale={0.8} phase={0.2} />
                </Svg>
                <PaintedDrip id={scene.id} {...S8_DRIP} scale={S8_SCALE}
                  emotion={useEmotion(scene, "drip", { a1_17_drip: "excited", a1_18_drip: "amazed" }, "happy")}
                  speaking={useSpeaking(scene, "drip")} phase={PHASE.drip} idle={1.5} look="upRight"
                  groundY={S8_GROUND} groundLum={0.35} />
              </>
            }
          />
        </AbsoluteFill>
        {S8_INSERTS.map((ins, i) => (
          <InsertPanel key={ins.k} index={i + 1} k={ins.k} label={ins.label} steam={ins.steam} creepFrom={whips[i]} />
        ))}
      </AbsoluteFill>
      {speed > 6 ? <WhipStreaks strength={Math.min(1, speed / 300)} /> : null}
      <Bubbles scene={scene} cast={cast} text={{ a1_17_drip: "Ooh. Toasty. So BOUNCY!", a1_18_drip: "ALL the water?" }}
        at={{
          a1_17_drip: { x: 560, y: 220, tail: "right", tailAt: dripS.x - 120 },
          a1_18_drip: { x: 560, y: 220, tail: "right", tailAt: dripS.x - 120 },
        }} />
      {S8_CHUNKS.map((text, i) => (
        <SpeechBubble key={text} x={1450} y={170} text={text} tail="right" tailAt={1880}
          from={chunkAt[i]} until={i < 3 ? whips[i] : lineEnd} background={P.paper} />
      ))}
    </AbsoluteFill>
  );
};

/** One insert: a single vignette plate (D12 Q4) with a slow creep, steam and its label. */
const InsertPanel: React.FC<{ index: number; k: PlateKey; label: string; steam: Array<[number, number]>; creepFrom: number }> = ({
  index,
  k,
  label,
  steam,
  creepFrom,
}) => {
  const frame = useCurrentFrame();
  const z = remasterCam(frame, { creep: { from: creepFrom } }).zoom ?? 1;
  return (
    <AbsoluteFill style={{ left: index * WIDTH, width: WIDTH, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 60%" }}>
        <Plate k={k} />
        <Svg>
          {steam.map(([x, y], i) => (
            <SteamWisps key={i} x={x} y={y} count={3} scale={1} phase={i * 0.4} />
          ))}
        </Svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: kidTheme.fontFamily }}>
        <span style={{ background: P.paper, color: P.ink, borderRadius: 999, padding: "8px 34px", fontSize: kidType.label,
          fontWeight: 900, letterSpacing: 3 }}>
          {label}
        </span>
      </div>
    </AbsoluteFill>
  );
};

const WhipStreaks: React.FC<{ strength: number }> = ({ strength }) => (
  <Svg>
    {Array.from({ length: 14 }, (_, i) => {
      const y = 60 + i * 74 + rnd(i, 9) * 30;
      const pts: Pt[] = [[-100, y], [600, y + 2], [1300, y - 2], [2020, y]];
      return <path key={i} d={ribbon(pts, 5 + (i % 3) * 3, 1, 1200 + i, { jitter: 0.5 })} fill={P.paper} opacity={0.3 * strength} />;
    })}
  </Svg>
);

// ---------------------------------------------------------------------------
// Scene 9 — Liftoff
// ---------------------------------------------------------------------------
// Plan: close → medium; Drip vibrates (prop arcs); BURST 26 px + roll to 3°
// on the thwip (72% into a1_20, ep 1's beat); the 22 f gap after a1_21:
// camera STILL for the fear; FOLLOW Drip up through a1_22 (Drip pinned, the
// planes fall at their depth factors). Shadow detaches at the thwip and
// shrinks ×0.5 by 200 px altitude. Sunny's a1_23 from off-screen right.

const S9_X = 1100;
const S9_GROUND = 880;
const S9_SCALE = 1.05;

/** Drip's height above the water and the camera follow, shared with s10's frozen world. */
function liftoff(scene: TimedScene, frame: number) {
  const secretFrom = atLine(scene, "a1_20_narrator");
  const secretTo = afterLine(scene, "a1_20_narrator");
  const flyFrom = atLine(scene, "a1_22_drip");
  const liftAt = Math.round(secretFrom + (secretTo - secretFrom) * 0.72);
  const hop = interpolate(frame, [liftAt, liftAt + 40], [0, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const fly = Math.max(0, frame - flyFrom);
  const climb = fly * 3.1;
  return { liftAt, flyFrom, rise: hop + climb, follow: climb * 0.92 };
}

const LiftoffScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { liftAt, flyFrom, rise, follow } = liftoff(scene, frame);
  const feetFrom = atLine(scene, "a1_21_drip");
  const feetTo = afterLine(scene, "a1_21_drip");
  const shakeT = Math.max(0, Math.min(liftAt, frame)) / fps;
  const wobble = 2 * Math.PI * (3 * shakeT + 1.6 * shakeT * shakeT);
  const amp = interpolate(frame, [0, liftAt], [1.5, 11], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shakeX = frame < liftAt ? Math.sin(wobble) * amp : 0;
  const shakeY = frame < liftAt ? Math.cos(wobble * 1.7) * amp * 0.5 : 0;
  const since = frame - liftAt;
  const stretch = since >= 0 && since < 16 ? 1 + 0.4 * Math.sin((since / 16) * Math.PI) : 1;
  const y = stand("drip", S9_GROUND) - rise;
  const focus0 = { x: S9_X, y: midOf("drip", stand("drip", S9_GROUND), S9_SCALE) };
  const cam = remasterCam(frame, {
    base: { ...focus0 },
    bursts: [{ at: liftAt, delta: { zoom: 1.06, rotate: 3, dy: 30 } }],
    deltas: [{ dy: follow }],
  });
  let emotion: Emotion = frame < liftAt - 20 ? "happy" : "amazed";
  if (frame >= feetTo + 2 && frame < flyFrom - 8) emotion = "scared";
  else if (frame >= flyFrom - 8) emotion = "excited";
  const pose = frame >= feetFrom - 8 && frame < flyFrom - 8 ? "clutch" : undefined;
  const dripS = project(cam, { x: S9_X, y: midOf("drip", y, S9_SCALE) });
  const cast: Cast = {
    drip: { x: S9_X, y, scale: S9_SCALE, who: "drip" },
    sunny: { x: 2100, y: 200, scale: 0.6, who: "sunny" },
  };
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.ocean.morning}
        cam={cam}
        bleed={0.3}
        horizons={{ far: 520, mid: 700, near: 990 }}
        fg={<FgSwell top={995} />}
        sky={<><Zenith color="#1d4a92" mid="#5f86c4" reach={85} opacity={0.9} /><LightPool x={1750} y={120} r={900} color="#ffd98a" opacity={0.4} /></>}
        stage={
          <>
            <LightPool x={900} y={940} r={1000} ry={180} color="#ffcf78" opacity={0.45} />
            <Svg>
              <SteamWisps x={420} y={960} count={3} scale={1.1} />
              <SteamWisps x={1500} y={990} count={3} scale={1} phase={0.5} />
            </Svg>
            {frame > liftAt - 30 ? (
              <Crowd id="s9" bob={2} litDir={1} moodO={(i) => i % 3 === 0}
                rows={[0, 1, 2, 3, 4, 5].map((r) => ({ y: 1150 + r * 210, s: 0.45 + (r % 3) * 0.15, count: 7, spread: 2600, x: 960 + (r % 2) * 140 }))}
                rise={(f, i) => Math.max(0, f - (liftAt - 30) - (i % 7) * 10) * (2.6 + (i % 4) * 0.3)} />
            ) : null}
            {frame < liftAt + 10 ? (
              <MotionArcs x={S9_X + shakeX} y={midOf("drip", y + shakeY, S9_SCALE)} amount={amp / 11} />
            ) : null}
            <AbsoluteFill style={{ transformOrigin: `${S9_X}px ${S9_GROUND}px`, transform: `scale(${1 - (stretch - 1) * 0.25}, ${stretch})` }}>
              <PaintedDrip id={scene.id} x={S9_X + shakeX} y={y + shakeY} scale={S9_SCALE} emotion={emotion}
                speaking={useSpeaking(scene, "drip")} phase={PHASE.drip} idle={frame < liftAt ? 0.4 : 1.4} pose={pose}
                look={frame < liftAt ? "down" : "up"} groundY={S9_GROUND} altitude={rise} groundLum={0.35} />
            </AbsoluteFill>
          </>
        }
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={{ a1_21_drip: "My feet are LEAVING!", a1_22_drip: "Terri-wonderful!", a1_23_sunny: "You're welcome!" }}
        at={{
          a1_21_drip: { x: Math.max(420, dripS.x - 560), y: Math.max(200, dripS.y - 230), tail: "right", tailAt: dripS.x - 110 },
          a1_22_drip: { x: Math.max(420, dripS.x - 560), y: Math.max(200, dripS.y - 230), tail: "right", tailAt: dripS.x - 110 },
          a1_23_sunny: { x: 1500, y: 190, tail: "right", tailAt: 1890 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 10 — Big Word: EVAPORATION
// ---------------------------------------------------------------------------
// Plan: freeze the rising world; de-tilt 3° → 0° over the first 12 f (≥ 12 f
// before the slam); PUSH 1.00 → 1.06 over 24 f ending on the slam (84%
// through a1_24); HOLD (no creep) while the card is read; CutFlash on the
// slam (BigWordBeat's). Drip stays live under the card (face only).

const S10_DRIP = { x: 1300, y: 600, scale: 0.95 };

function s10Cam(frame: number, slam: number): Cam {
  return withCam({ x: 960, y: 540, rotate: 3 }, burst(frame, 0, { rotate: -3 }), bigWordPush(frame, slam));
}

const RisingWorld: React.FC<{ slam: number }> = ({ slam }) => {
  const frame = useCurrentFrame();
  const cam = s10Cam(frame, slam);
  return (
    <SetStack
      set={SETS.ocean.morning}
      cam={cam}
      bleed={0.3}
      hide={["near"]}
      horizons={{ far: 900, mid: 960 }}
      sky={<><Zenith color="#1d4a92" mid="#5f86c4" reach={85} opacity={0.9} /><LightPool x={1750} y={120} r={900} color="#ffd98a" opacity={0.4} /></>}
      stage={
        <>
          <Svg>
            <SteamWisps x={300} y={1060} count={3} scale={1.2} />
            <SteamWisps x={1600} y={1060} count={3} scale={1.1} phase={0.5} />
          </Svg>
          <Crowd id="s10" bob={2} litDir={1} moodO={(i) => i % 3 === 0}
            rows={[0, 1, 2, 3].map((r) => ({ y: 360 + r * 230, s: 0.45 + (r % 3) * 0.15, count: 7, spread: 2600, x: 960 + (r % 2) * 140 }))} />
        </>
      }
    />
  );
};

const BigWordEvaporationScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const slamAt = atLine(scene, "a1_24_narrator", 0.84);
  const cam = s10Cam(frame, slamAt);
  const at = project(cam, S10_DRIP);
  const z = cam.zoom ?? 1;
  return (
    <AbsoluteFill>
      <BigWordBeat
        scene={scene}
        word="EVAPORATION"
        syllables={["Ee", "vap", "oh", "RAY", "shun"]}
        chantKey="a1_25_drip"
        slamAt={slamAt}
        color={ACT_COLOR.evaporation}
        sub="water floats up"
        y={300}
        freeze={<RisingWorld slam={slamAt} />}
      >
        <AbsoluteFill style={{ transformOrigin: `${at.x}px ${at.y}px`, transform: `rotate(${cam.rotate ?? 0}deg)` }}>
          <PaintedDrip id={scene.id} x={at.x} y={at.y} scale={S10_DRIP.scale * z}
            emotion={frame > slamAt ? "proud" : "excited"} speaking={useSpeaking(scene, "drip")} phase={PHASE.drip}
            idle={0.45} look="upLeft" />
        </AbsoluteFill>
      </BigWordBeat>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 11 — Best at it (quietly)
// ---------------------------------------------------------------------------
// Plan: medium → wide → close; horizon off the bottom; low cam. HOLD creep
// on the pose (a1_27); two stepped pull-out BURSTs on a1_28 "exactly as
// well" (VO); a 14 px push-in BURST before the a1_29 bubble. Airborne: no
// ground shadow, cast shade + rim only. The crowd rises at one speed.

const S11_DRIP = { x: 960, y: 520 };

const BestAtItScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const everyoneFrom = atLine(scene, "a1_28_narrator");
  const everyoneTo = afterLine(scene, "a1_28_narrator");
  const quietFrom = atLine(scene, "a1_29_drip");
  const cam = remasterCam(frame, {
    base: { ...S11_DRIP, zoom: 1.5 },
    creep: { from: 0 },
    bursts: [
      { at: atLine(scene, "a1_28_narrator", 0.42), delta: { zoom: 1 / 1.6 } },
      { at: atLine(scene, "a1_28_narrator", 0.7), delta: { zoom: 1 / 1.55 } },
      { at: quietFrom - 12, delta: { zoom: 2.3 } },
    ],
  });
  const deflateAt = everyoneFrom + Math.round((everyoneTo - everyoneFrom) * 0.4);
  const emotion: Emotion = frame >= quietFrom - 8 ? "proud" : frame >= deflateAt ? "grumpy" : "proud";
  const sag = frame >= deflateAt && frame < quietFrom - 8 ? 1 : 0;
  const dripS = project(cam, S11_DRIP);
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.sky.morning}
        cam={cam}
        bleed={0.3}
        horizons={{ far: 260 }}
        sky={<><Zenith color="#1d4a92" mid="#5f86c4" reach={85} opacity={0.9} /><LightPool x={1750} y={60} r={1300} color="#ffcf78" opacity={0.75} /></>}
        mid={
          <Crowd id="s11m" bob={2} litDir={1}
            rows={[-300, -60, 180, 420, 660, 900, 1140, 1380].map((y, r) => ({ y, s: 0.34, count: 14, spread: 5200, x: 960 + (r % 2) * 120, tint: 0.4 }))}
            rise={(f) => (f * 0.9) % 240} />
        }
        stage={
          <>
            <Crowd id="s11s" bob={3} litDir={1}
              rows={[-560, -300, -40, 220, 480, 740, 1000, 1260, 1520].map((y, r) => ({ y, s: 0.6 + (r % 3) * 0.12, count: 15, spread: 5600, x: 960 + Math.sin(r * 2.1) * 140 }))}
              rise={(f) => (f * 1.4) % 260} />
            <PaintedDrip id={scene.id} x={S11_DRIP.x} y={S11_DRIP.y + sag * 16} scale={1 - sag * 0.05} emotion={emotion}
              speaking={useSpeaking(scene, "drip")} phase={PHASE.drip} idle={sag ? 0.5 : 1.2} look="camera"
              pose={emotion === "proud" && !sag ? "cheer" : undefined} />
          </>
        }
      />
      <Bubbles
        scene={scene}
        cast={{ drip: { ...S11_DRIP, who: "drip" } }}
        text={{ a1_27_drip: "I'm the BEST at it!", a1_29_drip: "Best at it QUIETLY." }}
        at={{
          a1_27_drip: { x: 1440, y: 260, tail: "left", tailAt: dripS.x + 120 },
          a1_29_drip: { x: 1440, y: 260, tail: "left", tailAt: dripS.x + 120 },
        }}
      />
    </AbsoluteFill>
  );
};

export const ACT1_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s03_ocean_wide: OceanWideScene,
  s04_slosh: SloshScene,
  s05_sunrise: SunriseScene,
  s06_sunny_intro: SunnyIntroScene,
  s07_warming: WarmingScene,
  s08_everywhere: EverywhereScene,
  s09_liftoff: LiftoffScene,
  s10_bigword_evaporation: BigWordEvaporationScene,
  s11_best_at_it: BestAtItScene,
};

