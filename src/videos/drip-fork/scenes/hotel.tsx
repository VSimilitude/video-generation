import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Cloudia,
  Drip,
  KidBackdrop,
  kidTheme,
  lookAt,
  type EmotionInput,
} from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
// Episode one's hotel, cross-imported like the rest of the kit (see common.tsx
// for why this demo does that rather than keep a copy).
import {
  ArrivingColumn,
  CloudBlob,
  CloudHotel,
  DropSwarm,
  GuestList,
  Pedestal,
  PreDrips,
  Speck,
} from "../../water-cycle/scenes/act2";
import { NameArrow } from "../../water-cycle/scenes/common";
import {
  Bubbles,
  Camera,
  CloudPuff,
  CutFlash,
  HotelSign,
  PHASE,
  SETTLE_FRAMES,
  SkyBlend,
  SnowGlyph,
  Vignette,
  WideLayer,
  lineProgress,
  lineWindow,
  midOf,
  stand,
  useEmotion,
  useLookAtSpeaker,
  type Cast,
  type Mark,
  type SceneProps,
} from "./common";

// HOTEL — shared trunk 1. Both ways up arrive here, at the same place, at the
// same time, with the same cast on stage: that is the merge rule from
// docs/CYOA.md, and it is what licenses the foldback at all.
//
// The one thing that differs is Cloudia's greeting (`ho_01a` / `ho_01b`), and
// it differs for a reason that traces straight to the viewer's first choice —
// the variant insert. Video.tsx swaps the chosen clip into the scene's turns
// before this file sees it, so the greeting is staged like any other line.
//
// After it, episode one's Scenes 13–22 compressed into three: the house rules
// and Kevin, the hotel filling until it greys, and the two ways out — which
// are drawn as signs *before* the card asks, so the card's options are
// already on screen when it lands.

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const GROUND = 950;
// She stands clear of the building's white bulk, against open sky: a white
// cloud manager in front of a white cloud hotel has no silhouette at all.
const CLOUDIA_MARK: Mark = {
  x: 1480,
  y: stand("cloudia", GROUND),
  scale: 1.05,
  who: "cloudia",
  side: "left",
};
const DRIP_MARK: Mark = {
  x: 620,
  y: stand("drip", GROUND + 40),
  scale: 1.1,
  who: "drip",
  side: "right",
};

/** The hotel, the terrace it stands on, and the sky behind both. */
const Terrace: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    <KidBackdrop variant="day" clouds={2} waves={false} />
    <WideLayer>
      {/* The building stays the only pure-white thing in the frame; its
          neighbours and the shelf carry a little grey, which is what gives
          Cloudia (white) and the hotel itself an edge to read against. */}
      <CloudPuff x={780} y={470} w={1150} h={400} seed={3} windows={4} />
      <CloudPuff x={190} y={640} w={760} h={250} seed={7} grey={0.14} opacity={0.96} />
      <CloudPuff x={900} y={GROUND + 150} w={2600} h={360} seed={5} grey={0.1} />
      <HotelSign x={1330} y={175 + Math.sin(frame / 40) * 6} />
    </WideLayer>
  </>
);

// ---------------------------------------------------------------------------
// Scene 1 — the greeting (variant insert) and Drip's boast
// ---------------------------------------------------------------------------

const GREETING_BUBBLES: Record<string, string> = {
  ho_01a_cloudia: "You came up on a SUNBEAM!",
  ho_01b_cloudia: "You saw every single bird!",
  ho_02_drip: "I am extremely tall now!",
};

const GreetingScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const cast: Cast = { drip: DRIP_MARK, cloudia: CLOUDIA_MARK };
  const dripMid = { x: DRIP_MARK.x, y: midOf("drip", DRIP_MARK.y, DRIP_MARK.scale) };
  const cloudiaMid = {
    x: CLOUDIA_MARK.x,
    y: midOf("cloudia", CLOUDIA_MARK.y, CLOUDIA_MARK.scale),
  };
  const [boastFrom, boastTo] = lineWindow(scene, "ho_02_drip");
  // Ends on a plain smile: the next scene cuts in on it, and `proud`'s
  // half-lidded smirk is not a face to cut away from.
  const dripEmotion = useEmotion(scene, "drip", { ho_02_drip: "proud" }, "excited", 6);
  const emotion: EmotionInput =
    frame >= boastTo ? { emotion: "happy", from: "proud", at: boastTo, frames: 8 } : dripEmotion;

  return (
    <AbsoluteFill>
      <Terrace frame={frame} />
      <Drip
        x={DRIP_MARK.x}
        y={DRIP_MARK.y}
        scale={DRIP_MARK.scale ?? 1}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={1.1}
        // Arms up for the boast, then back down.
        pose={frame >= boastFrom - 4 && frame < boastTo ? "cheer" : undefined}
        look={lookAt(dripMid, cloudiaMid, 1200)}
      />
      <Cloudia
        x={CLOUDIA_MARK.x}
        y={CLOUDIA_MARK.y}
        scale={CLOUDIA_MARK.scale ?? 1}
        fill={0}
        clipboard
        emotion="excited"
        speaking={useSpeaking(scene, "cloudia")}
        phase={PHASE.cloudia}
        // Nothing enters before the settle: the player can overshoot the
        // segment boundary and put these first frames on screen.
        enter={{ at: SETTLE_FRAMES, kind: "slideLeft" }}
        look={lookAt(cloudiaMid, dripMid, 1200)}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={GREETING_BUBBLES}
        // The greeting's bubble sits between them, as phase 1 had it.
        at={{
          ho_01a_cloudia: { x: 1000, y: 370, tail: "right" },
          ho_01b_cloudia: { x: 1000, y: 370, tail: "right" },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — house rules, and Kevin
// ---------------------------------------------------------------------------

const S2_GROUND = 990;
const S2_DRIP = { x: 430, y: stand("drip", S2_GROUND) };
const S2_DRIP_SCALE = 1.05;
const S2_BOWL = { x: 930, y: 700 };
const S2_CLOUDIA: Mark = {
  x: 1470,
  y: stand("cloudia", S2_GROUND),
  scale: 1,
  who: "cloudia",
  side: "left",
};
/**
 * Kevin, at arm's length: the `cheer` hand is ±142·scale out and 262·scale up
 * from the ground line (HAND_AT in characters/Drip). Held at the outer hand
 * he is clear of Drip's own silhouette, which is what "held out" needs.
 */
const S2_HAND = { x: S2_DRIP.x + 142 * S2_DRIP_SCALE + 26, y: S2_GROUND - 262 * S2_DRIP_SCALE - 30 };

const S2_BUBBLES: Record<string, string> = {
  ho_03_cloudia: "Every guest hugs a speck!",
  ho_04_drip: "I shall call you Kevin.",
};

const RulesScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [rulesFrom, rulesTo] = lineWindow(scene, "ho_03_cloudia");
  const [nameFrom, nameTo] = lineWindow(scene, "ho_04_drip");

  // He takes one on "…hugs a speck of dust" — the last clause of her line —
  // and holds it out to look at it. The name lands at the end of his take.
  const pickAt = Math.round(rulesFrom + (rulesTo - rulesFrom) * 0.74);
  const holdAt = pickAt + 26;
  const arrowAt = Math.round(nameFrom + (nameTo - nameFrom) * 0.7);
  const u = interpolate(frame, [pickAt, holdAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const speckX = interpolate(u, [0, 1], [S2_BOWL.x - 40, S2_HAND.x]);
  const speckY = interpolate(u, [0, 1], [S2_BOWL.y - 40, S2_HAND.y]) - Math.sin(u * Math.PI) * 110;

  const cast: Cast = {
    drip: { ...S2_DRIP, scale: S2_DRIP_SCALE, who: "drip", side: "right" },
    cloudia: S2_CLOUDIA,
  };
  const dripLook = useLookAtSpeaker(scene, cast, "drip", "right");
  const cloudiaLook = useLookAtSpeaker(scene, cast, "cloudia", "left");
  const dripEmotion = useEmotion(scene, "drip", { ho_04_drip: "amazed" }, "happy", 6);
  const cloudiaEmotion = useEmotion(scene, "cloudia", { ho_03_cloudia: "proud" }, "happy");

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={0.18} clouds={2} waves={false} />
      <WideLayer>
        {/* The lobby: a wall of guests behind, a cloud floor underfoot. */}
        <g opacity={0.36}>
          <DropSwarm cx={960} cy={430} halfW={1300} halfH={330} spacing={128} scale={0.7} churn={0.5} />
        </g>
        <CloudBlob x={860} y={S2_GROUND + 190} w={2600} h={420} seed={5} />
        <Pedestal x={S2_BOWL.x} groundY={S2_GROUND} bowlY={S2_BOWL.y} />
      </WideLayer>

      <Drip
        x={S2_DRIP.x}
        y={S2_DRIP.y}
        scale={S2_DRIP_SCALE}
        emotion={dripEmotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        pose={frame >= pickAt ? "cheer" : undefined}
        idle={frame >= holdAt ? 0.5 : 1}
        // Once he has it, he only has eyes for Kevin.
        look={frame >= holdAt - 6 ? "upRight" : dripLook}
      />
      {frame >= pickAt - 2 ? <Speck x={speckX} y={speckY} r={30} glow={u * 0.5} /> : null}
      {/* Episode one's name arrow, pointed at a speck of dust. The callback is
          the joke. */}
      <NameArrow x={S2_HAND.x + 26} y={S2_HAND.y - 24} label="KEVIN" from={arrowAt} dir="right" />

      <Cloudia
        x={S2_CLOUDIA.x}
        y={S2_CLOUDIA.y}
        scale={S2_CLOUDIA.scale}
        fill={0.06}
        clipboard
        emotion={cloudiaEmotion}
        speaking={useSpeaking(scene, "cloudia")}
        phase={PHASE.cloudia}
        look={cloudiaLook}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S2_BUBBLES}
        // Up and right of him, clear of the speck and the arrow's label.
        at={{ ho_04_drip: { x: 860, y: 250, tail: "left", tailAt: S2_DRIP.x + 60 } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — wallpaper, then the hotel fills and greys
// ---------------------------------------------------------------------------

const S3_HOTEL = { x: 860, ground: 820, w: 900 };
const S3_CLOUDIA: Mark = {
  x: 1620,
  y: stand("cloudia", 1010),
  scale: 0.95,
  who: "cloudia",
  side: "left",
};

const FillScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const dur = scene.durationInFrames;
  const [wallFrom, wallTo] = lineWindow(scene, "ho_05_narrator");
  const [roomFrom, roomTo] = lineWindow(scene, "ho_06_cloudia");
  const [greyFrom, greyTo] = lineWindow(scene, "ho_07_narrator");
  const outsideAt = roomFrom - 8;
  const inside = frame < outsideAt;

  // Inside: start close on Drip-and-Kevin and pull back until he is one tile
  // of the pattern — "Drip was now wallpaper" lands on the widest frame.
  const zoom = interpolate(frame, [wallFrom + 10, wallTo - 6], [1.7, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Outside: one climbing number for floors, guests, grey and Cloudia's fill,
  // keyed to her "one more / one more / oh my / FULL".
  const p = lineProgress(scene, "ho_06_cloudia", frame);
  const floorAt = [0.2, 0.42, 0.66].map((f) => Math.round(roomFrom + (roomTo - roomFrom) * f));
  const floors = 1 + floorAt.filter((f) => frame >= f).length;
  const full = frame < greyFrom ? 0.15 + p * 0.65 : 0.8 + 0.2 * clamp01((frame - greyFrom) / 40);
  // "…goes grey, and heavy" — grey on the first clause, droop on the second.
  const grey = interpolate(frame, [roomFrom, roomTo, greyFrom + 10, greyFrom + 70], [0.05, 0.4, 0.4, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heavy = interpolate(frame, [greyFrom + 50, greyTo - 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const cloudiaEmotion = useEmotion(scene, "cloudia", { ho_06_cloudia: "excited" }, "happy");
  const cloudiaTalking = useSpeaking(scene, "cloudia");
  const cast: Cast = { cloudia: S3_CLOUDIA };

  return (
    <AbsoluteFill>
      {inside ? (
        <>
          <SkyBlend from="day" to="night" u={0.2} clouds={0} waves={false} />
          <Camera cam={{ x: 960, y: 560, zoom }}>
            <WideLayer>
              <DropSwarm cx={960} cy={560} halfW={1700} halfH={950} spacing={136} scale={0.66} churn={0.8} />
            </WideLayer>
            {/* Drip, the same size as everybody, holding up a speck like they
                all are. The only face in the pattern that is looking at you. */}
            <Drip
              x={960}
              y={stand("drip", 560 + 80)}
              scale={0.4}
              emotion="happy"
              phase={PHASE.drip}
              shadow={false}
              pose="cheer"
              idle={0.6}
              look="camera"
            />
            <Speck x={960 + 64} y={560 - 30} r={14} />
          </Camera>
        </>
      ) : (
        <>
          <SkyBlend from="day" to="night" u={0.12 + grey * 0.22} clouds={0} waves={false} />
          <WideLayer>
            {/* Time-lapse: the sky is running fast. */}
            {[0, 1, 2, 3].map((i) => (
              <CloudBlob
                key={i}
                x={((frame * (7 + i * 3) + i * 900) % 3400) - 700}
                y={140 + i * 130}
                w={420 + i * 90}
                h={120 + i * 24}
                opacity={0.4}
                seed={i * 3}
                stroke={0}
              />
            ))}
          </WideLayer>
          <Camera cam={{ x: S3_HOTEL.x, y: S3_HOTEL.ground, zoom: 1 + full * 0.12 }}>
            <WideLayer>
              <g transform={`translate(0 ${heavy * 40})`}>
                <ArrivingColumn x={S3_HOTEL.x} topY={S3_HOTEL.ground - 40} />
                <CloudHotel
                  x={S3_HOTEL.x}
                  groundY={S3_HOTEL.ground}
                  w={S3_HOTEL.w}
                  floors={floors}
                  floorAt={floorAt}
                  grey={grey}
                  droop={heavy}
                  guests={full}
                />
                <PreDrips x={S3_HOTEL.x} y={S3_HOTEL.ground + 20} w={S3_HOTEL.w} u={heavy} />
              </g>
            </WideLayer>
          </Camera>
          <GuestList x={250} y={760} ticks={Math.floor(full * 11)} />
          <Cloudia
            x={S3_CLOUDIA.x}
            y={S3_CLOUDIA.y + heavy * 24}
            scale={S3_CLOUDIA.scale}
            fill={Math.min(1, grey * 0.9)}
            clipboard
            emotion={cloudiaEmotion}
            speaking={cloudiaTalking}
            phase={PHASE.cloudia}
            look={{ x: -0.7, y: -0.2 }}
          />
          <Vignette strength={0.26 * grey} />
          <CutFlash at={outsideAt} strength={0.5} />
        </>
      )}
      <Bubbles
        scene={scene}
        cast={cast}
        text={{ ho_06_cloudia: "One more! One more! FULL!" }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4 — two ways down, and the question
// ---------------------------------------------------------------------------

const S4_HOTEL = { x: 900, ground: 700, w: 940 };
const S4_SHELF = 1000;
const S4_DRIP = { x: 760, y: stand("drip", S4_SHELF + 20) };
const S4_DRIP_SCALE = 0.9;
const S4_CLOUDIA: Mark = {
  x: 1560,
  y: stand("cloudia", S4_SHELF),
  scale: 0.9,
  who: "cloudia",
  side: "left",
};
/** Where the two signs stand: the balcony low on the left, the roof up top. */
const S4_BALCONY = { x: 300, y: 560 };
const S4_ROOF = { x: 1500, y: 170 };

const S4_BUBBLES: Record<string, string> = {
  ho_08_cloudia: "Two ways down, darling.",
  ho_09_drip: "A waterslide? Or a SNOWFLAKE?",
};

const ExitsScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [waysFrom, waysTo] = lineWindow(scene, "ho_08_cloudia");
  const [askFrom] = lineWindow(scene, "ho_10_narrator");
  const span = waysTo - waysFrom;
  // "The waterslide, straight off the balcony." / "Or the roof." — each sign
  // springs up on the clause that names it, and both then stay.
  const balconyAt = Math.round(waysFrom + span * 0.16);
  const roofAt = Math.round(waysFrom + span * 0.42);
  const balcony = spring({ frame: frame - balconyAt, fps, config: { damping: 11, mass: 0.7 } });
  const roof = spring({ frame: frame - roofAt, fps, config: { damping: 11, mass: 0.7 } });
  // The slide draws itself down from the balcony as she says it.
  const slide = interpolate(frame, [balconyAt, balconyAt + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  // A *cycle* while the question is asked, so the held frames under the card
  // look like any other frame of the hold.
  const glow = frame > askFrom ? 0.5 + 0.5 * Math.sin((frame - askFrom) / 11) : 0;

  const cast: Cast = {
    drip: { ...S4_DRIP, scale: S4_DRIP_SCALE, who: "drip", side: "right" },
    cloudia: S4_CLOUDIA,
  };
  const dripLook = useLookAtSpeaker(scene, cast, "drip");
  const [pickFrom, pickTo] = lineWindow(scene, "ho_09_drip");
  // He looks at each way as he names it, then back to you for the question.
  const dripEyes =
    frame > askFrom - 10
      ? "camera"
      : frame >= pickFrom && frame < pickFrom + (pickTo - pickFrom) * 0.4
        ? ("left" as const)
        : frame >= pickFrom && frame < pickTo
          ? ("upRight" as const)
          : dripLook;
  const settleAt = askFrom - 6;
  const mapped = useEmotion(scene, "drip", { ho_09_drip: "amazed" }, "happy", 4);
  const emotion: EmotionInput =
    frame >= settleAt ? { emotion: "happy", from: "amazed", at: settleAt, frames: 8 } : mapped;

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={0.3} clouds={2} waves={false} />
      <WideLayer>
        <CloudHotel x={S4_HOTEL.x} groundY={S4_HOTEL.ground} w={S4_HOTEL.w} floors={3} grey={0.85} droop={0.8} guests={1} />
        {/* The waterslide off the balcony: a blue chute curling down and out
            of the bottom-left of frame. */}
        <BalconySlide x={S4_HOTEL.x - S4_HOTEL.w * 0.42} y={S4_HOTEL.ground - 60} u={slide} />
        {/* The terrace they are standing on, in front of everything. */}
        <CloudBlob x={1120} y={S4_SHELF + 140} w={2200} h={340} grey={0.55} seed={4} />
      </WideLayer>
      <ExitSign
        x={S4_BALCONY.x}
        y={S4_BALCONY.y}
        s={balcony}
        glow={glow}
        label="BALCONY"
        arrow="down"
        icon="slide"
      />
      <ExitSign x={S4_ROOF.x} y={S4_ROOF.y} s={roof} glow={glow} label="ROOF" arrow="up" icon="snow" />

      <Drip
        x={S4_DRIP.x}
        y={S4_DRIP.y}
        scale={S4_DRIP_SCALE}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={0.9}
        look={dripEyes}
      />
      <Cloudia
        x={S4_CLOUDIA.x}
        y={S4_CLOUDIA.y}
        scale={S4_CLOUDIA.scale}
        fill={0.85}
        clipboard
        emotion={useEmotion(scene, "cloudia", { ho_08_cloudia: "proud" }, "happy")}
        speaking={useSpeaking(scene, "cloudia")}
        phase={PHASE.cloudia}
        look={useLookAtSpeaker(scene, cast, "cloudia", "left")}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S4_BUBBLES}
        // Hers sits under the roof sign and over the hotel's shoulder, clear of
        // both signs; his goes centre, above his own head.
        at={{
          ho_08_cloudia: { x: 1280, y: 480, tail: "right", tailAt: S4_CLOUDIA.x - 40 },
          ho_09_drip: { x: 980, y: 520, tail: "left", tailAt: S4_DRIP.x + 40 },
        }}
      />
    </AbsoluteFill>
  );
};

/** The balcony slide: a lip off the hotel's side and a chute curling away. */
const BalconySlide: React.FC<{ x: number; y: number; u: number }> = ({ x, y, u }) => {
  const frame = useCurrentFrame();
  if (u <= 0.01) return null;
  const d = `M ${x} ${y} C ${x - 260} ${y + 40} ${x - 140} ${y + 300} ${x - 420} ${y + 420} S ${x - 700} ${y + 600} ${x - 900} ${y + 760}`;
  return (
    <g>
      <rect x={x - 90} y={y - 26} width={180} height={34} rx={14} fill={kidTheme.cloudGreyShade} stroke={kidTheme.ink} strokeWidth={8} />
      <path d={d} pathLength={1} strokeDasharray={`${u} 1`} stroke={kidTheme.ink} strokeWidth={70} fill="none" strokeLinecap="round" />
      <path d={d} pathLength={1} strokeDasharray={`${u} 1`} stroke={kidTheme.waterDark} strokeWidth={54} fill="none" strokeLinecap="round" />
      <path d={d} pathLength={1} strokeDasharray={`${u} 1`} stroke={kidTheme.water} strokeWidth={30} fill="none" strokeLinecap="round" />
      {/* Water running down it. */}
      {u > 0.98
        ? Array.from({ length: 5 }, (_, i) => {
            const t = ((frame / 40 + i / 5) % 1);
            return (
              <circle
                key={i}
                cx={x - 900 * t + Math.sin(t * 9) * 30}
                cy={y + 760 * t}
                r={9}
                fill={kidTheme.waterLight}
                opacity={0.9}
              />
            );
          })
        : null}
    </g>
  );
};

/** A hotel exit sign: label, an arrow, and what you leave as. */
const ExitSign: React.FC<{
  x: number;
  y: number;
  s: number;
  glow: number;
  label: string;
  arrow: "up" | "down";
  icon: "slide" | "snow";
}> = ({ x, y, s, glow, label, arrow, icon }) => {
  if (s <= 0.01) return null;
  const w = 540;
  const h = 150;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", zIndex: 30 }} width={1} height={1}>
      <g transform={`scale(${s}) rotate(${arrow === "up" ? 2 : -2})`}>
        {glow > 0 ? (
          <rect x={-w / 2 - 22} y={-h / 2 - 22} width={w + 44} height={h + 44} rx={52} fill={kidTheme.star} opacity={0.18 + 0.3 * glow} />
        ) : null}
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={10} />
        <text
          x={-w / 2 + 34}
          y={18}
          fontFamily={kidTheme.fontFamily}
          fontSize={52}
          fontWeight={900}
          letterSpacing={2}
          fill={kidTheme.ink}
        >
          {label}
        </text>
        {/* The arrow. */}
        <g transform={`translate(${w / 2 - 120} 0) rotate(${arrow === "up" ? 0 : 180})`}>
          <path d="M 0 -46 L 30 -6 L 12 -6 L 12 44 L -12 44 L -12 -6 L -30 -6 Z" fill={kidTheme.tomato} stroke={kidTheme.ink} strokeWidth={6} strokeLinejoin="round" />
        </g>
        {/* What you leave as. */}
        <g transform={`translate(${w / 2 - 52} 0)`}>
          {icon === "snow" ? (
            <SnowGlyph r={34} />
          ) : (
            <path
              d="M 0 -30 C 6 -16 20 -7 20 7 A 20 20 0 0 1 -20 7 C -20 -7 -6 -16 0 -30 Z"
              fill={kidTheme.water}
              stroke={kidTheme.waterDeep}
              strokeWidth={6}
            />
          )}
        </g>
      </g>
    </svg>
  );
};

export const HOTEL_SCENES: Record<string, React.FC<SceneProps>> = {
  ho_greeting: GreetingScene,
  ho_rules: RulesScene,
  ho_fill: FillScene,
  ho_exits: ExitsScene,
};
