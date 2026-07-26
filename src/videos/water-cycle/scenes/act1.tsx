import React from "react";
import { Easing, Sequence } from "remotion";
import {
  Blobby,
  BlobbyCrowd,
  Drip,
  KidBackdrop,
  Sunny,
  kidOutline,
  kidTheme,
  kidType,
  lookAt,
  type Emotion,
} from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  ACT_COLOR,
  AbsoluteFill,
  BigWordBeat,
  Bubbles,
  CHAR_BOX,
  Camera,
  CaptionCard,
  CutFlash,
  NameArrow,
  PHASE,
  SkyBlend,
  SteamWisps,
  Thermometer,
  WaterBand,
  WideLayer,
  crownOf,
  interpolate,
  lineProgress,
  lineWindow,
  midOf,
  projectMark,
  stand,
  useCurrentFrame,
  useEmotion,
  useVideoConfig,
  type Cast,
  type Mark,
  type TimedScene,
} from "./common";

// ACT ONE — THE OCEAN. Scenes 3–11 of script.md: the ordinary world, the want,
// the inciting sunbeam, the liftoff, and Big Word One.
//
// The act is staged around one geography, kept consistent so the cuts read as
// the same ocean: sky above, `WaterBand` surface, drops on and under it. The
// water's `warmth` prop climbs from Scene 7 onward — that heating is the
// mechanism the act is about, so it is on screen, not implied.

const SURFACE = 700;

// ---------------------------------------------------------------------------
// Scene 3 — The ocean, wide
// ---------------------------------------------------------------------------

// `y` is a ground line minus half the character's box (see CHAR_BOX / stand()
// in ./common.tsx): CharacterFrame scales about the bottom of that box, so this
// is the one number that must not be eyeballed.
const S3_SCALE = 0.42;
const S3_DRIP = { x: 760, y: stand("drip", SURFACE + 150) };
const S3_MARK: Mark = { ...S3_DRIP, scale: S3_SCALE, who: "drip", side: "right" };

const S3_BUBBLES: Record<string, string> = {
  a1_02_drip: "My home! My family!",
  a1_04_drip: "Hi! Hi! Hi! Hi!",
};

const OceanWideScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, wideEnd] = lineWindow(scene, "a1_01_narrator");
  const [homeFrom] = lineWindow(scene, "a1_02_drip");
  const [arrowAt] = lineWindow(scene, "a1_03_narrator");
  const [manyFrom, manyTo] = lineWindow(scene, "a1_05_narrator");

  // Pull back over the wide-ocean line, comic-zoom onto the crowd when Drip
  // claims it, hold on him, then pull out on "every single one looks exactly
  // the same" — the gag is the reveal, so the camera has to do it.
  const zoom = interpolate(
    frame,
    [0, wideEnd - 10, homeFrom + 12, homeFrom + 52, manyFrom + 20, manyTo],
    [1.55, 1, 1, 2.4, 2.4, 0.72],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const cam = { x: S3_DRIP.x, y: midOf("drip", S3_DRIP.y, S3_SCALE), zoom };
  const cast: Cast = { drip: projectMark(cam, S3_MARK) };
  const arrowTip = crownOf("drip", projectMark(cam, S3_MARK).y, S3_SCALE * zoom) - 24;

  return (
    <AbsoluteFill>
      {/* Pre-dawn: the sun does not arrive until Scene 5. Sky stays outside the
          camera so a pull-out below 1× can never expose an edge. */}
      <SkyBlend from="night" to="day" u={0.45} clouds={3} stars={false} waves={false} />
      <Camera cam={cam}>
        <WaterBand top={SURFACE} />
        <WideLayer>
          {/* An ocean-sized crowd, every one drawn identically. Wide enough to
              survive the 0.72× pull-out this scene ends on. */}
          <BlobbyCrowd count={16} x={960} y={SURFACE + 40} spread={3600} scale={0.42} opacity={0.75} />
          <BlobbyCrowd count={18} x={860} y={SURFACE + 140} spread={3800} scale={0.55} opacity={0.88} />
          <BlobbyCrowd count={18} x={1010} y={SURFACE + 260} spread={3900} scale={0.72} />
          <BlobbyCrowd count={16} x={900} y={SURFACE + 410} spread={4000} scale={0.9} />
          <BlobbyCrowd count={14} x={1040} y={SURFACE + 580} spread={4100} scale={1.05} />
          <BlobbyCrowd count={14} x={880} y={SURFACE + 760} spread={4200} scale={1.15} />
        </WideLayer>
        <Drip
          {...S3_DRIP}
          scale={S3_SCALE}
          emotion={useEmotion(scene, "drip", { a1_02_drip: "excited", a1_04_drip: "happy" }, "happy")}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          look="camera"
        />
      </Camera>
      {/* The arrow lives outside the camera: it is a label on the frame, not a
          thing in the water, so it must not scale with the zoom. */}
      <NameArrow x={S3_DRIP.x} y={arrowTip} label="DRIP" from={arrowAt} dir="left" />
      <Bubbles scene={scene} cast={cast} text={S3_BUBBLES} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4 — Slosh
// ---------------------------------------------------------------------------

const S4_SCALE = 1.05;
const S4_DRIP = { x: 960, y: stand("drip", SURFACE + 40) };
const S4_MARK: Mark = { ...S4_DRIP, scale: S4_SCALE, who: "drip", side: "right" };

const S4_BUBBLES: Record<string, string> = {
  a1_06_drip: "Slosh. Slosh. Slosh.",
  a1_07_drip: "I want an ADVENTURE!",
};

const SLOSH_CARDS = ["Monday", "Tuesday", "also Tuesday"];

const SloshScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const { fps } = useVideoConfig();
  const [wantFrom] = lineWindow(scene, "a1_07_drip");

  // Three identical shots of the same wave, cut back to back. The <Sequence>
  // wrappers are what make them *identical* rather than merely similar: each
  // restarts the backdrop's clock, so every shot is the same frames again.
  //
  // The cadence is keyed to the dialogue, not to the scene length. "also
  // Tuesday" is the punchline of the gag, so its cut lands exactly one second
  // before Drip's outburst (a1_07) and it holds that second in silence — the
  // dead air is the gap after a1_06_drip in Video.tsx's SCRIPT table. Splitting
  // the scene into equal thirds used to put this card *on top of* the outburst,
  // which threw the joke away.
  const punchAt = Math.max(SLOSH_CARDS.length - 1, wantFrom - fps);
  const cuts = SLOSH_CARDS.map((_, i) =>
    Math.round((punchAt * i) / Math.max(1, SLOSH_CARDS.length - 1)),
  );
  const shotEnd = (i: number) => (i + 1 < cuts.length ? cuts[i + 1] : scene.durationInFrames);

  const cast: Cast = { drip: S4_MARK };
  return (
    <AbsoluteFill>
      {cuts.map((at, i) => (
        <Sequence key={at} from={at} durationInFrames={shotEnd(i) - at}>
          <SkyBlend from="night" to="day" u={0.5} clouds={3} stars={false} waves={false} />
          <WaterBand top={SURFACE - 30} />
        </Sequence>
      ))}
      {/* Drip does not cut: he is the one thing in the ocean that never
          changes, which is the joke. */}
      <Drip
        {...S4_DRIP}
        scale={S4_SCALE}
        // Lead 2, not the usual 8: the whole point of the silent beat is that
        // Drip is still doing his flat Monday face when the outburst hits, so
        // the excitement must not telegraph across the hold.
        emotion={useEmotion(scene, "drip", { a1_06_drip: "grumpy", a1_07_drip: "excited" }, "grumpy", 2)}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={0.5}
        look="camera"
      />
      {SLOSH_CARDS.map((text, i) => (
        <React.Fragment key={text}>
          <CutFlash at={cuts[i]} strength={i === 0 ? 0 : 0.55} />
          {/* Top-left: Drip's bubbles live top-right in this scene. The last
              card rides a little way into the outburst — it is the line Drip is
              shouting at. */}
          <CaptionCard
            text={text}
            from={cuts[i]}
            until={i === cuts.length - 1 ? wantFrom + 36 : shotEnd(i) - 5}
            y={165}
            align="left"
          />
        </React.Fragment>
      ))}
      <Bubbles scene={scene} cast={cast} text={S4_BUBBLES} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5 — Sunrise
// ---------------------------------------------------------------------------

const S5_SUNNY = { x: 1300, y: 380, scale: 1.45 };

const SunriseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, dawnEnd] = lineWindow(scene, "a1_08_narrator");
  const [morningFrom, morningTo] = lineWindow(scene, "a1_09_sunny");

  const gold = interpolate(frame, [0, dawnEnd - 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const day = interpolate(frame, [morningFrom, morningTo + 40], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Something enormous comes up over the water.
  const rise = interpolate(frame, [dawnEnd - 60, morningFrom + 6], [1700, S5_SUNNY.y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const cast: Cast = { sunny: { ...S5_SUNNY, y: rise, who: "sunny" } };
  const dripAt = { x: 330, y: stand("drip", SURFACE + 210) };

  return (
    <AbsoluteFill>
      <SkyBlend from="night" to="sunset" u={gold} clouds={3} stars={gold < 0.75} waves={false} />
      <AbsoluteFill style={{ opacity: day }}>
        <KidBackdrop variant="day" clouds={3} waves={false} />
      </AbsoluteFill>
      <Sunny
        x={S5_SUNNY.x}
        y={rise}
        scale={S5_SUNNY.scale}
        emotion="proud"
        speaking={useSpeaking(scene, "sunny")}
        phase={PHASE.sunny}
        shades={0}
        look={{ x: -0.3, y: 0.35 }}
      />
      <WaterBand top={SURFACE + 120} warmth={gold * 0.25} />
      <Drip
        {...dripAt}
        scale={0.3}
        emotion="amazed"
        phase={PHASE.drip}
        shadow={false}
        look={lookAt(
          { x: dripAt.x, y: midOf("drip", dripAt.y, 0.3) },
          { x: S5_SUNNY.x, y: midOf("sunny", rise, S5_SUNNY.scale) },
          900,
        )}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={{ a1_09_sunny: "GOOD MORNING!" }}
        // Sunny fills the top of the frame here, so his bubble goes beside him
        // rather than above: there is no "above" left that isn't his own rays.
        at={{ a1_09_sunny: { x: 600, y: 300, tail: "right" } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 6 — Sunny, introducing himself at length
// ---------------------------------------------------------------------------

const S6_SUNNY = { x: 1240, y: 470, scale: 1.7 };
const S6_DRIP = { x: 330, y: stand("drip", 940) };
const S6_DRIP_SCALE = 0.3;

const S6_BUBBLES: Record<string, string> = {
  a1_11_sunny: "I invented mornings!",
  a1_12_drip: "Whoa. Who are you?",
  a1_13_sunny: "I am the SUN!",
};

const SunnyIntroScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [bragFrom, bragTo] = lineWindow(scene, "a1_11_sunny");

  // The hero shot: a slow orbit he has clearly directed himself.
  const t = frame / fps;
  const sunnyMid = { x: S6_SUNNY.x, y: midOf("sunny", S6_SUNNY.y, S6_SUNNY.scale) };
  const dripMid = { x: S6_DRIP.x, y: midOf("drip", S6_DRIP.y, S6_DRIP_SCALE) };
  const cam = {
    ...sunnyMid,
    zoom: 1 + 0.05 * Math.sin(t * 0.24),
    rotate: Math.sin(t * 0.3) * 1.4,
  };
  // Shades lower over the brag, so he can look at you over the top of them.
  const shades = interpolate(frame, [bragFrom + 6, bragTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cast: Cast = {
    sunny: { ...S6_SUNNY, who: "sunny" },
    drip: { ...S6_DRIP, scale: S6_DRIP_SCALE, who: "drip", side: "right" },
  };

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={cam}>
        <LensFlares x={sunnyMid.x} y={sunnyMid.y} />
        <Sunny
          x={S6_SUNNY.x}
          y={S6_SUNNY.y}
          scale={S6_SUNNY.scale}
          emotion="proud"
          speaking={useSpeaking(scene, "sunny")}
          phase={PHASE.sunny}
          shades={shades}
          raySpeed={0.3}
          look={lookAt(sunnyMid, dripMid, 1400)}
        />
      </Camera>
      <WaterBand top={SURFACE + 210} warmth={0.2} />
      {/* Drip is a dot in the corner, squinting. `grumpy` is the squint. */}
      <Drip
        {...S6_DRIP}
        scale={S6_DRIP_SCALE}
        emotion={useEmotion(scene, "drip", { a1_12_drip: "amazed" }, "grumpy")}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        look={lookAt(dripMid, sunnyMid, 1400)}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S6_BUBBLES}
        at={{
          a1_11_sunny: { x: 590, y: 250, tail: "right" },
          a1_13_sunny: { x: 590, y: 250, tail: "right" },
        }}
      />
    </AbsoluteFill>
  );
};

/** Lens flares Sunny has added to his own hero shot. */
const LensFlares: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer>
      {[0.35, 0.55, 0.75, 0.92, 1.15].map((u, i) => (
        <circle
          key={u}
          cx={x + (400 - x) * u}
          cy={y + (940 - y) * u}
          r={26 + i * 22}
          fill={i % 2 ? kidTheme.sunLight : kidTheme.star}
          opacity={(0.16 + 0.08 * Math.sin(t * 1.3 + i)) * 1.2}
        />
      ))}
      <ellipse
        cx={x}
        cy={y}
        rx={520 + Math.sin(t * 0.9) * 24}
        ry={126}
        fill={kidTheme.sunLight}
        opacity={0.18}
        transform={`rotate(-24 ${x} ${y})`}
      />
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 7 — The warming
// ---------------------------------------------------------------------------

const S7_SUNNY = { x: 1460, y: stand("sunny", 553), scale: 1.1 };
const S7_DRIP = { x: 620, y: stand("drip", SURFACE + 180) };
const S7_DRIP_SCALE = 0.75;

const WarmingScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [jobFrom] = lineWindow(scene, "a1_14_narrator");
  const [watchFrom] = lineWindow(scene, "a1_15_sunny");
  const [, warmerTo] = lineWindow(scene, "a1_16_narrator");

  // Energy in: the beams arrive on "watch this", and the water and the
  // thermometer climb together for the rest of the scene. One number drives
  // both, because they are the same claim.
  const beams = interpolate(frame, [watchFrom, watchFrom + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heat = interpolate(frame, [watchFrom + 10, warmerTo], [0.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cast: Cast = { sunny: { ...S7_SUNNY, who: "sunny" } };
  const sunnyMid = { x: S7_SUNNY.x, y: midOf("sunny", S7_SUNNY.y, S7_SUNNY.scale) };
  const dripMid = { x: S7_DRIP.x, y: midOf("drip", S7_DRIP.y, S7_DRIP_SCALE) };

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={2} waves={false} />
      <SunBeams x={sunnyMid.x} y={sunnyMid.y} strength={beams} top={SURFACE + 60} />
      <Sunny
        x={S7_SUNNY.x}
        y={S7_SUNNY.y}
        scale={S7_SUNNY.scale}
        emotion="proud"
        speaking={useSpeaking(scene, "sunny")}
        phase={PHASE.sunny}
        shades={1}
        look={{ x: -0.6, y: 0.5 }}
      />
      <WaterBand top={SURFACE + 60} warmth={heat} />
      <Drip
        {...S7_DRIP}
        scale={S7_DRIP_SCALE}
        emotion={heat > 0.55 ? "excited" : "happy"}
        phase={PHASE.drip}
        shadow={false}
        look={lookAt(dripMid, sunnyMid, 1200)}
      />
      <WideLayer>
        {heat > 0.45 ? (
          <g opacity={(heat - 0.45) / 0.55}>
            <SteamWisps x={880} y={SURFACE + 90} count={3} scale={0.8} />
            <SteamWisps x={1180} y={SURFACE + 140} count={2} scale={0.7} phase={0.4} />
          </g>
        ) : null}
      </WideLayer>
      <Thermometer x={1790} y={640} level={0.1 + heat * 0.82} scale={0.9} label="WARM" />
      <Bubbles
        scene={scene}
        cast={cast}
        text={{ a1_15_sunny: "Watch this. Warming up!" }}
        at={{ a1_15_sunny: { x: 930, y: 205, tail: "right" } }}
      />
      {/* The narrator's "very big job" gets the frame it deserves. */}
      {frame > jobFrom + 40 && frame < watchFrom ? (
        <CaptionCard text="a very big job" from={jobFrom + 40} until={watchFrom - 6} y={150} />
      ) : null}
    </AbsoluteFill>
  );
};

/** Thick golden ropes of sunlight, pouring onto the water. */
const SunBeams: React.FC<{ x: number; y: number; strength: number; top: number }> = ({
  x,
  y,
  strength,
  top,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (strength <= 0.01) return null;
  return (
    <WideLayer>
      {Array.from({ length: 6 }, (_, i) => {
        const landing = 1780 - i * 330;
        const w = 54 + (i % 2) * 26;
        const shimmer = 0.5 + 0.5 * Math.sin(t * 1.6 + i * 1.1);
        const reach = top + 190;
        return (
          <path
            key={i}
            d={
              `M ${x - w * 0.5} ${y} L ${x + w * 0.5} ${y}` +
              ` L ${landing + w * 1.5} ${reach} L ${landing - w * 1.5} ${reach} Z`
            }
            fill={kidTheme.sunLight}
            opacity={strength * (0.13 + 0.11 * shimmer)}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 8 — All of it, everywhere
// ---------------------------------------------------------------------------

const S8_SCALE = 1.5;
const S8_DRIP = { x: 760, y: stand("drip", 900) };
const S8_MARK: Mark = { ...S8_DRIP, scale: S8_SCALE, who: "drip", side: "right" };
const S8_SUNNY = { x: 1720, y: stand("sunny", 290), scale: 0.6 };

const S8_BUBBLES: Record<string, string> = {
  a1_17_drip: "Ooh. Toasty. So BOUNCY!",
  a1_18_drip: "ALL the water?",
  a1_19_sunny: "Every puddle. Every day!",
};

/** The four places the whip-pan visits. Panel 0 is the ocean we are already in. */
const PANELS = ["the ocean", "a lake", "a rice paddy", "a puddle", "a dog bowl"];

const EverywhereScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  // The whip-pan is Sunny's line: "Every ocean! Every lake! Every puddle!"
  // Four hard shoves, each on a clause, resolved as fractions of the take.
  const u = lineProgress(scene, "a1_19_sunny", frame);
  const stops = [0, 0.08, 0.2, 0.3, 0.42, 0.52, 0.64, 0.74, 0.86, 1];
  const values = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
  const pos = interpolate(u, stops, values, { easing: Easing.inOut(Easing.cubic) });
  const prev = interpolate(
    lineProgress(scene, "a1_19_sunny", frame - 1),
    stops,
    values,
    { easing: Easing.inOut(Easing.cubic) },
  );
  const speed = pos - prev;

  const bliss = lineProgress(scene, "a1_17_drip", frame);
  const cast: Cast = { drip: S8_MARK, sunny: { ...S8_SUNNY, who: "sunny" } };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${-pos * 1920}px) skewX(${-speed * 5}deg)`,
        }}
      >
        {PANELS.map((label, i) => (
          <div
            key={label}
            style={{ position: "absolute", left: i * 1920, top: 0, width: 1920, height: 1080 }}
          >
            {i === 0 ? (
              <OceanPanel scene={scene} bliss={bliss} />
            ) : (
              <PlacePanel index={i} />
            )}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 64,
                textAlign: "center",
                fontSize: kidType.label,
                fontWeight: 900,
                letterSpacing: 3,
                color: kidTheme.ink,
                textShadow: kidOutline(4),
                fontFamily: kidTheme.fontFamily,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
      {/* Motion streaks while the frame is moving — the pan is a whip, not a
          slide. */}
      {Math.abs(speed) > 0.004 ? <WhipStreaks strength={Math.min(1, Math.abs(speed) * 14)} /> : null}
      {/* Sunny sits above the pan: the same sun over every one of these
          places, which is exactly the point of the montage. */}
      <Sunny
        x={S8_SUNNY.x}
        y={S8_SUNNY.y}
        scale={S8_SUNNY.scale}
        emotion="proud"
        speaking={useSpeaking(scene, "sunny")}
        phase={PHASE.sunny}
        shades={1}
        look={{ x: -0.6, y: 0.5 }}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S8_BUBBLES}
        at={{ a1_19_sunny: { x: 1130, y: 300, tail: "right" } }}
      />
    </AbsoluteFill>
  );
};

const OceanPanel: React.FC<{ scene: TimedScene; bliss: number }> = ({ scene, bliss }) => (
  <AbsoluteFill>
    <KidBackdrop variant="day" clouds={2} waves={false} />
    <WaterBand top={SURFACE + 130} warmth={0.85} />
    <WideLayer>
      <SteamWisps x={S8_DRIP.x - 250} y={SURFACE + 150} count={2} scale={0.9} />
      <SteamWisps x={S8_DRIP.x + 300} y={SURFACE + 190} count={3} scale={1} phase={0.5} />
    </WideLayer>
    {/* Going pink and blissful: the blush is the emotion, the tint is the
        temperature. */}
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 46% 52% at ${S8_DRIP.x}px ${midOf("drip", S8_DRIP.y, S8_SCALE)}px, rgba(255,111,165,${0.3 * bliss}) 0%, transparent 70%)`,
      }}
    />
    <Drip
      {...S8_DRIP}
      scale={S8_SCALE}
      emotion={useEmotion(scene, "drip", { a1_17_drip: "excited", a1_18_drip: "amazed" }, "happy")}
      speaking={useSpeaking(scene, "drip")}
      phase={PHASE.drip}
      shadow={false}
      idle={1.5}
      look="upRight"
    />
  </AbsoluteFill>
);

/** One iconic place, in four shapes and a wisp of steam. */
const PlacePanel: React.FC<{ index: number }> = ({ index }) => {
  const sky = <KidBackdrop variant="day" clouds={2} waves={false} ground={index !== 3} />;
  return (
    <AbsoluteFill>
      {sky}
      <WideLayer>
        {index === 1 ? (
          <g>
            <ellipse cx={960} cy={800} rx={620} ry={190} fill={kidTheme.waterDark} />
            <ellipse cx={960} cy={784} rx={600} ry={172} fill={kidTheme.water} />
            <ellipse cx={800} cy={742} rx={230} ry={54} fill={kidTheme.waterLight} opacity={0.6} />
            {[420, 1480, 1620].map((x, i) => (
              <g key={x} transform={`translate(${x} ${700 - i * 20})`}>
                <rect x={-16} y={0} width={32} height={120} rx={14} fill={kidTheme.earth} />
                <circle cx={0} cy={-30} r={92} fill={kidTheme.grassDark} />
                <circle cx={-38} cy={-62} r={64} fill={kidTheme.grass} />
              </g>
            ))}
            <SteamWisps x={860} y={720} count={3} scale={1.1} />
            <SteamWisps x={1180} y={760} count={2} scale={0.9} phase={0.4} />
          </g>
        ) : null}
        {index === 2 ? (
          <g>
            {[0, 1, 2, 3].map((r) => {
              const y = 620 + r * 118;
              return (
                <g key={r}>
                  <rect x={-60} y={y} width={2040} height={104} rx={26} fill={kidTheme.earth} />
                  <rect x={-40} y={y + 12} width={2000} height={74} rx={20} fill={kidTheme.water} opacity={0.92} />
                  {Array.from({ length: 13 }, (_, i) => (
                    <path
                      key={i}
                      d={`M ${60 + i * 150} ${y + 66} q 10 -40 -6 -66 M ${60 + i * 150} ${y + 66} q -12 -38 8 -60`}
                      stroke={kidTheme.grassDark}
                      strokeWidth={9}
                      strokeLinecap="round"
                      fill="none"
                    />
                  ))}
                </g>
              );
            })}
            <SteamWisps x={620} y={660} count={3} scale={1} />
            <SteamWisps x={1360} y={780} count={2} scale={0.9} phase={0.6} />
          </g>
        ) : null}
        {index === 3 ? (
          <g>
            <rect x={-60} y={640} width={2040} height={520} fill="#b9bec6" />
            <rect x={-60} y={640} width={2040} height={26} fill="#9aa1ab" />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={120 + i * 400} y={1000} width={210} height={26} rx={13} fill="#e6e9ee" />
            ))}
            <ellipse cx={900} cy={840} rx={400} ry={122} fill={kidTheme.waterDark} />
            <ellipse cx={900} cy={830} rx={380} ry={106} fill={kidTheme.water} />
            <ellipse cx={790} cy={800} rx={120} ry={30} fill={kidTheme.waterLight} opacity={0.7} />
            <SteamWisps x={880} y={790} count={3} scale={1} />
          </g>
        ) : null}
        {index === 4 ? (
          <g>
            <ellipse cx={960} cy={980} rx={520} ry={70} fill={kidTheme.grassDark} opacity={0.45} />
            <path
              d="M 560 700 L 1360 700 L 1250 980 A 300 60 0 0 1 670 980 Z"
              fill="#ff9f5c"
              stroke={kidTheme.ink}
              strokeWidth={12}
              strokeLinejoin="round"
            />
            <ellipse cx={960} cy={700} rx={400} ry={78} fill="#ffb87f" stroke={kidTheme.ink} strokeWidth={12} />
            <ellipse cx={960} cy={706} rx={350} ry={62} fill={kidTheme.water} />
            <ellipse cx={860} cy={692} rx={120} ry={22} fill={kidTheme.waterLight} opacity={0.7} />
            <g transform="translate(1460 900) rotate(-14)">
              <rect x={-120} y={-22} width={240} height={44} rx={22} fill="#f0e2c4" stroke={kidTheme.ink} strokeWidth={10} />
              <circle cx={-130} cy={-24} r={34} fill="#f0e2c4" stroke={kidTheme.ink} strokeWidth={10} />
              <circle cx={-130} cy={24} r={34} fill="#f0e2c4" stroke={kidTheme.ink} strokeWidth={10} />
              <circle cx={130} cy={-24} r={34} fill="#f0e2c4" stroke={kidTheme.ink} strokeWidth={10} />
              <circle cx={130} cy={24} r={34} fill="#f0e2c4" stroke={kidTheme.ink} strokeWidth={10} />
            </g>
            <SteamWisps x={940} y={660} count={3} scale={1} />
          </g>
        ) : null}
      </WideLayer>
    </AbsoluteFill>
  );
};

const WhipStreaks: React.FC<{ strength: number }> = ({ strength }) => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
  >
    {Array.from({ length: 16 }, (_, i) => (
      <rect
        key={i}
        x={-100}
        y={40 + i * 66}
        width={2120}
        height={5 + (i % 3) * 4}
        fill="#ffffff"
        opacity={0.24 * strength}
      />
    ))}
  </svg>
);

// ---------------------------------------------------------------------------
// Scene 9 — Liftoff
// ---------------------------------------------------------------------------

const S9_X = 860;
/** Where his feet are before the thwip, and where the water starts. */
const S9_GROUND = 820;
const S9_SCALE = 1.05;
const S9_SUNNY = { x: 1680, y: stand("sunny", 330), scale: 0.62 };

const S9_BUBBLES: Record<string, string> = {
  a1_21_drip: "My feet are LEAVING!",
  a1_22_drip: "Terri-wonderful!",
  a1_23_sunny: "You're welcome!",
};

const LiftoffScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [secretFrom, secretTo] = lineWindow(scene, "a1_20_narrator");
  const [feetFrom, feetTo] = lineWindow(scene, "a1_21_drip");
  const [flyFrom] = lineWindow(scene, "a1_22_drip");

  // Warm drops wiggle: the shake's *frequency* climbs, which is the mechanism
  // the narrator is describing. Phase is integrated, not multiplied, or the
  // wobble jumps every time the frequency changes.
  const liftAt = Math.round(secretFrom + (secretTo - secretFrom) * 0.72);
  const shakeT = Math.max(0, Math.min(liftAt, frame)) / fps;
  const freq = 3 + shakeT * 3.2;
  const wobblePhase = 2 * Math.PI * (3 * shakeT + (3.2 / 2) * shakeT * shakeT);
  const amp = interpolate(frame, [0, liftAt], [1.5, 11], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = frame < liftAt ? Math.sin(wobblePhase) * amp : 0;
  const shakeY = frame < liftAt ? Math.cos(wobblePhase * 1.7) * amp * 0.5 : 0;

  // Then his feet peel off the water with a stretchy thwip.
  const since = frame - liftAt;
  const stretch = since >= 0 && since < 16 ? 1 + 0.55 * Math.sin((since / 16) * Math.PI) : 1;
  // He climbs a little and the *ocean falls away* a lot. Keeping him framed
  // and moving the world is what lets a bubble stay above his head through a
  // 700px ascent — and it reads as rising far better than a character sliding
  // off the top of the frame does.
  const rise = interpolate(frame, [liftAt, liftAt + 110], [0, 190], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const fall = interpolate(frame, [liftAt, liftAt + 150], [0, 680], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const y = stand("drip", S9_GROUND) - rise;

  // The tone thesis of the episode, and the one emotional turn that has to be
  // hand-placed: `scared`'s wobble mouth hard-cuts to a talking mouth, so the
  // fear lands in the gap *between* Drip's two lines and he has settled into
  // `excited` 8 frames before he opens his mouth again.
  let emotion: Emotion = frame < liftAt - 20 ? "happy" : "amazed";
  if (frame >= feetTo + 2 && frame < flyFrom - 8) emotion = "scared";
  else if (frame >= flyFrom - 8) emotion = "excited";
  const pose = frame >= feetFrom - 8 && frame < flyFrom - 8 ? "clutch" : undefined;

  const cast: Cast = {
    drip: { x: S9_X, y, scale: S9_SCALE, who: "drip", side: "right" },
    sunny: { ...S9_SUNNY, who: "sunny" },
  };

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WaterBand top={S9_GROUND + 20 + fall} warmth={1} />
      <WideLayer>
        <SteamWisps x={420} y={S9_GROUND + 70 + fall} count={3} scale={1.1} />
        <SteamWisps x={1420} y={S9_GROUND + 100 + fall} count={3} scale={1} phase={0.5} />
        {/* Hundreds of other drops rising like slow bubbles — Drip is not
            special, which is Scene 11's joke and this scene's physics. They
            hang almost still relative to him, because they are going up at the
            same speed he is. */}
        {frame > liftAt - 30 ? <RisingDrops from={liftAt - 30} ground={S9_GROUND} fall={fall} /> : null}
      </WideLayer>
      {frame < liftAt + 10 ? (
        <MotionArcs
          x={S9_X + shakeX}
          y={midOf("drip", y + shakeY, S9_SCALE)}
          amount={amp / 11}
        />
      ) : null}
      {/* The thwip: a vertical stretch about his feet, so the stretch pulls him
          off the surface instead of sliding him through it. */}
      <Camera
        cam={{
          x: S9_X,
          y: y + CHAR_BOX.drip / 2,
          zoomY: stretch,
          zoom: 1 - (stretch - 1) * 0.25,
        }}
      >
        <Drip
          x={S9_X + shakeX}
          y={y + shakeY}
          scale={S9_SCALE}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          idle={frame < liftAt ? 0.4 : 1.4}
          pose={pose}
          look={frame < liftAt ? "down" : "up"}
        />
      </Camera>
      <Sunny
        x={S9_SUNNY.x}
        y={S9_SUNNY.y}
        scale={S9_SUNNY.scale}
        emotion="proud"
        speaking={useSpeaking(scene, "sunny")}
        phase={PHASE.sunny}
        shades={1}
        look={{ x: -0.7, y: 0.4 }}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S9_BUBBLES}
        at={{ a1_23_sunny: { x: 1130, y: 480, tail: "right" } }}
      />
    </AbsoluteFill>
  );
};

/** Motion arcs coming off a shaken drop, like a shaken jar of glitter. */
const MotionArcs: React.FC<{ x: number; y: number; amount: number }> = ({ x, y, amount }) => {
  const frame = useCurrentFrame();
  if (amount <= 0.05) return null;
  return (
    <svg
      style={{ position: "absolute", left: x, top: y, overflow: "visible" }}
      width={1}
      height={1}
    >
      {[-1, 1].map((s) =>
        [0, 1, 2].map((i) => {
          const r = 150 + i * 46;
          const spread = 0.5 + amount * 0.5;
          return (
            <path
              key={`${s}-${i}`}
              d={`M ${s * r} ${-70 * spread} Q ${s * (r + 30)} 0 ${s * r} ${70 * spread}`}
              stroke={kidTheme.waterLight}
              strokeWidth={11}
              strokeLinecap="round"
              fill="none"
              opacity={amount * (0.75 - i * 0.2) * (0.6 + 0.4 * Math.sin(frame * 0.8 + i))}
            />
          );
        }),
      )}
    </svg>
  );
};

/** The rest of the ocean, going up at exactly the same speed. */
const RisingDrops: React.FC<{ from: number; ground: number; fall?: number }> = ({
  from,
  ground,
  fall = 0,
}) => {
  const frame = useCurrentFrame();
  const u = Math.max(0, frame - from);
  return (
    <g>
      {Array.from({ length: 26 }, (_, i) => {
        const lane = ((i * 137) % 1900) + 20;
        // They start *in* the sea and climb into the sky, so the frame is empty
        // at the moment of liftoff and fills as the ocean drops away. Speeds
        // differ slightly per drop; nobody is going anywhere Drip isn't.
        const speed = 1.8 + (i % 5) * 0.55;
        const delay = (i % 7) * 14;
        const travel = Math.max(0, u - delay) * speed;
        const y = ground + 120 + ((i * 163) % 1000) + fall * 0.25 - travel;
        const sway = Math.sin((frame + i * 30) / 26) * 22;
        return (
          <Blobby
            key={i}
            x={lane + sway}
            y={y}
            scale={0.4 + (i % 4) * 0.12}
            phase={i * 1.31}
            mood={i % 3 === 0 ? "surprised" : "happy"}
            opacity={0.9}
          />
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 10 — Big Word One: EVAPORATION
// ---------------------------------------------------------------------------

const BigWordEvaporationScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [wordFrom, wordTo] = lineWindow(scene, "a1_24_narrator");
  // The freeze lands on the word itself: "…that is evaporation" is the last
  // clause of the take.
  const slamAt = Math.round(wordFrom + (wordTo - wordFrom) * 0.84);

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
        freeze={<RisingWorld />}
      >
        {/* Drip stays live under the card: he is the one saying the syllables,
            and a frozen mouth on a chant would be the one thing a six-year-old
            would notice. He does not move — only his face does. */}
        <Drip
          x={620}
          y={stand("drip", 940)}
          scale={1.15}
          emotion={frame > slamAt ? "proud" : "excited"}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          idle={0.45}
          look="upRight"
        />
      </BigWordBeat>
    </AbsoluteFill>
  );
};

/** The action the Big Word freezes: mid-rise, drops everywhere. */
const RisingWorld: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WaterBand top={1010} warmth={1} />
      <WideLayer>
        <RisingDrops from={0} ground={1010} />
        <SteamWisps x={300} y={1040} count={3} scale={1.2} />
        <SteamWisps x={1600} y={1040} count={3} scale={1.1} phase={0.5} />
      </WideLayer>
      <svg
        style={{ position: "absolute", left: 620, top: 700, overflow: "visible" }}
        width={1}
        height={1}
      >
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${-150 + i * 150} 300 q 30 -120 0 -240`}
            stroke={kidTheme.waterLight}
            strokeWidth={12}
            strokeLinecap="round"
            fill="none"
            opacity={0.5 * (0.6 + 0.4 * Math.sin(frame / 9 + i))}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 11 — Drip is the best at it
// ---------------------------------------------------------------------------

const S11_DRIP = { x: 960, y: 520 }; // scale 1 → `y` is also his middle

const S11_BUBBLES: Record<string, string> = {
  a1_27_drip: "I'm the BEST at it!",
  a1_29_drip: "Best at it QUIETLY.",
};

const BestAtItScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, boastTo] = lineWindow(scene, "a1_27_drip");
  const [everyoneFrom, everyoneTo] = lineWindow(scene, "a1_28_narrator");
  const [quietFrom] = lineWindow(scene, "a1_29_drip");

  // Pose, reveal, deflate, push back in on the face. The joke is entirely in
  // the pull-out: he is one of roughly nine million drops doing this.
  const zoom = interpolate(
    frame,
    [0, boastTo, everyoneFrom + 26, everyoneTo, quietFrom - 6],
    [1.5, 1.5, 0.55, 0.55, 1.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const deflateAt = everyoneFrom + Math.round((everyoneTo - everyoneFrom) * 0.4);
  const emotion: Emotion =
    frame >= quietFrom - 8 ? "proud" : frame >= deflateAt ? "grumpy" : "proud";
  const sag = frame >= deflateAt && frame < quietFrom - 8 ? 1 : 0;

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={4} waves={false} />
      <Camera cam={{ ...S11_DRIP, zoom }}>
        <RisingField />
        <Drip
          x={S11_DRIP.x}
          y={S11_DRIP.y + sag * 16}
          scale={1 - sag * 0.05}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          idle={sag ? 0.5 : 1.2}
          look="camera"
        />
      </Camera>
      <Bubbles
        scene={scene}
        cast={{ drip: S11_DRIP }}
        text={S11_BUBBLES}
        // He is centred and big in both close-ups, so there is no room above
        // his crown: the bubbles sit up and to his right instead, clear of the
        // face box either way.
        at={{
          a1_27_drip: { x: 1420, y: 285, tail: "left" },
          a1_29_drip: { x: 1420, y: 295, tail: "left" },
        }}
      />
    </AbsoluteFill>
  );
};

/** Roughly nine million drops, rising at exactly the same speed. */
const RisingField: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [-460, -240, -20, 200, 420, 640, 860, 1080, 1300, 1520];
  return (
    <WideLayer>
      {rows.map((base, r) => {
        const drift = (frame * (0.9 + (r % 3) * 0.2)) % 220;
        return (
          <BlobbyCrowd
            key={base}
            count={16}
            x={960 + Math.sin(r * 2.1) * 120}
            y={base - drift}
            spread={3900}
            scale={0.5 + (r % 4) * 0.12}
            jitter={44}
            opacity={0.92}
          />
        );
      })}
    </WideLayer>
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
