import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Blobby, BlobbyCrowd, Drip, KidBackdrop, Sunny, kidTheme, lookAt, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import { CloudHotel } from "../../water-cycle/scenes/act2";
import {
  Bubbles,
  CHAR_BOX,
  Camera,
  CutFlash,
  PHASE,
  SkyBlend,
  SpeedStreaks,
  WaterBand,
  WideLayer,
  clamp01,
  lineProgress,
  lineWindow,
  midOf,
  projectMark,
  stand,
  useEmotion,
  type Cast,
  type Mark,
  type SceneProps,
} from "./common";
import { DROP_PATH, POND, StickWall, Tree, Volcano, WildCloud } from "./props";
import { Beaver } from "./beaver";

// INTRO — the shared trunk. About a minute after DripChooses ends: the same
// evening, the same sea, the same sibling mob. Sunny sends him up again; the
// Cloud Hotel is closed (a drawn sign, read by the Narrator — Cloudia is away,
// that is the premise); a cloud forms anyway, with no manager; and that night
// two winds blow, one to a green valley, one to a big grey mountain.
//
// The choice scene ends on a held night wide: the cloud centre, the valley
// lower left, the mountain lower right, both wind streams pulsing.

const SURFACE = 720;
const ease = Easing.inOut(Easing.quad);

// ---------------------------------------------------------------------------
// Scene 1 — home for about a minute
// ---------------------------------------------------------------------------

const S1_DRIP = { x: 900, y: stand("drip", SURFACE + 170) };

const HomeScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [againFrom] = lineWindow(scene, "in_02_drip");
  const [seaFrom] = lineWindow(scene, "in_03_narrator");
  const emotion = useEmotion(scene, "drip", { in_02_drip: "proud" }, "happy", 6);
  // "The sea said nothing." — deadpan: nothing new moves; he holds his look at you.
  return (
    <AbsoluteFill>
      <KidBackdrop variant="sunset" clouds={3} waves={false} />
      <WaterBand top={SURFACE} dx={-frame * 0.8} warmth={0.5} />
      {/* He has been home a minute: the family is all round him, in the sea. */}
      <WideLayer>
        <BlobbyCrowd count={14} x={980} y={SURFACE + 90} spread={3400} scale={0.5} opacity={0.8} />
        <BlobbyCrowd count={12} x={860} y={SURFACE + 300} spread={3600} scale={0.75} />
      </WideLayer>
      <Drip
        x={S1_DRIP.x}
        y={S1_DRIP.y}
        scale={1}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={frame >= seaFrom ? 0.6 : 1.1}
        pose={frame >= againFrom && frame < seaFrom ? "cheer" : undefined}
        look={frame >= againFrom - 6 && frame < seaFrom ? "up" : "camera"}
      />
      <Bubbles
        scene={scene}
        cast={{ drip: { ...S1_DRIP, scale: 1, who: "drip" } }}
        text={{ in_02_drip: "I want to go AGAIN." }}
        at={{ in_02_drip: { x: 1380, y: 250, tail: "left", tailAt: S1_DRIP.x + 80 } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — Sunny: UP you go. Bye Drop! Bye Droplet! Bye Dripley!
// ---------------------------------------------------------------------------

const S2_X = 760;
const S2_GROUND = SURFACE + 60;
const S2_SCALE = 1.0;
const S2_SUNNY = { x: 1580, y: stand("sunny", 520), scale: 0.95 };

const S2_BUBBLES: Record<string, string> = {
  in_04_sunny: "AGAIN? Fine. UP you go!",
  in_05_drip: "Bye Drop! Bye Droplet! Bye Dripley!",
};

const LaunchScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [upFrom, upTo] = lineWindow(scene, "in_04_sunny");
  const [byeFrom] = lineWindow(scene, "in_05_drip");
  // "UP you go!" is the last clause before the laugh: ~78% into the take.
  const goAt = Math.round(upFrom + (upTo - upFrom) * 0.78);
  const beam = interpolate(frame, [upFrom + 10, goAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = interpolate(frame, [goAt, goAt + 40], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  // The sea (and the mob, waving) falls away slowly, so the roll call can be
  // shouted down at them while they are still on screen.
  const fall = interpolate(frame, [goAt, byeFrom + 90, scene.durationInFrames], [0, 160, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const speed = interpolate(frame, [goAt, goAt + 12, goAt + 70], [0, 0.8, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = stand("drip", S2_GROUND) - rise;
  const cast: Cast = {
    drip: { x: S2_X, y, scale: S2_SCALE, who: "drip", side: "right" },
    sunny: { ...S2_SUNNY, who: "sunny", side: "left" },
  };
  const sunnyMid = { x: S2_SUNNY.x, y: midOf("sunny", S2_SUNNY.y, S2_SUNNY.scale) };
  const emotion = useEmotion(scene, "drip", { in_05_drip: "excited" }, "happy", 6);
  return (
    <AbsoluteFill>
      <KidBackdrop variant="sunset" clouds={3} waves={false} />
      <WaterBand top={SURFACE + fall} warmth={0.6} />
      <WideLayer>
        <BlobbyCrowd count={12} x={980} y={SURFACE + 110 + fall} spread={3200} scale={0.5} opacity={0.8} />
        {/* Drop, Droplet and Dripley, waving him off. */}
        {[-260, -120, 40].map((dx, i) => (
          <g key={dx} transform={`translate(${S2_X + dx + 60} ${SURFACE + 150 + fall + Math.sin(frame / 6 + i) * 8})`}>
            <Blobby x={0} y={0} scale={0.7} phase={i * 1.3} mood="happy" look={0.6} />
          </g>
        ))}
      </WideLayer>
      <WideLayer opacity={beam}>
        {Array.from({ length: 3 }, (_, i) => {
          const w = 90 + i * 34;
          const foot = Math.min(S2_GROUND + 120, y + CHAR_BOX.drip / 2 + 30);
          return (
            <path
              key={i}
              d={`M ${sunnyMid.x - w * 0.5} ${sunnyMid.y} L ${sunnyMid.x + w * 0.5} ${sunnyMid.y} L ${S2_X + w * 1.7} ${foot} L ${S2_X - w * 1.7} ${foot} Z`}
              fill={kidTheme.sunLight}
              opacity={0.14 + i * 0.06}
            />
          );
        })}
      </WideLayer>
      <WideLayer>
        <SpeedStreaks strength={speed} frame={frame} />
      </WideLayer>
      <Drip
        x={S2_X}
        y={y}
        scale={S2_SCALE}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={frame < goAt ? 0.8 : 1.4}
        pose={frame >= goAt ? "cheer" : undefined}
        look={frame >= byeFrom ? "down" : lookAt({ x: S2_X, y: midOf("drip", y, S2_SCALE) }, sunnyMid, 1200)}
      />
      <Sunny
        x={S2_SUNNY.x}
        y={S2_SUNNY.y}
        scale={S2_SUNNY.scale}
        emotion={useEmotion(scene, "sunny", { in_04_sunny: "excited" }, "proud")}
        speaking={useSpeaking(scene, "sunny")}
        phase={PHASE.sunny}
        shades={1}
        look={{ x: -0.7, y: 0.4 }}
      />
      <CutFlash at={goAt} strength={0.5} />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S2_BUBBLES}
        at={{
          in_04_sunny: { x: 1100, y: 220, tail: "right", tailAt: S2_SUNNY.x - 150 },
          in_05_drip: { x: 400, y: 250, tail: "right", tailAt: S2_X - 100 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — the Cloud Hotel is closed
// ---------------------------------------------------------------------------

const S3_HOTEL = { x: 760, ground: 820, w: 900 };
const S3_DOOR = { x: S3_HOTEL.x, y: S3_HOTEL.ground - 70 };
const S3_DRIP = { x: 1420, ground: 900 };
const S3_SCALE = 0.8;
/** The sign's lines, one per clause of in_07 ("The sign said." first). */
const SIGN_LINES = ["CLOSED", "Important business", "Back Tuesday", "Also Tuesday", "Cloudia"];
const SIGN_AT = [0.2, 0.36, 0.56, 0.74, 0.9];

const ClosedScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [upFrom, upTo] = lineWindow(scene, "in_06_narrator");
  const [signFrom, signTo] = lineWindow(scene, "in_07_narrator");
  const [noFrom] = lineWindow(scene, "in_08_drip");
  // "Up he went, to the Cloud Hotel." — he rises into frame onto the terrace.
  const arrive = interpolate(frame, [upFrom, upFrom + (upTo - upFrom) * 0.5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  // Push in on the sign while it is read; back out for his line.
  const push = interpolate(frame, [signFrom - 4, signFrom + 30, signTo + 6, noFrom - 2], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const cam = { x: S3_DOOR.x, y: S3_DOOR.y + 20, zoom: 1 + push * 0.9 };
  const lines = SIGN_AT.map((u) => Math.round(signFrom + (signTo - signFrom) * u));
  const pops = lines.map((at) => spring({ frame: frame - at, fps, config: { damping: 12, mass: 0.6 } }));
  const dripY = stand("drip", S3_DRIP.ground) + arrive * 700;
  const mark: Mark = { x: S3_DRIP.x, y: dripY, scale: S3_SCALE, who: "drip" };
  const emotion = useEmotion(scene, "drip", { in_08_drip: "proud" }, "amazed", 6);
  // "Also Tuesday." gets a little held wobble of its own: it is the callback.
  const alsoWob = frame >= lines[3] ? Math.sin((frame - lines[3]) / 5) * 2.5 * Math.max(0, 1 - (frame - lines[3]) / 60) : 0;
  return (
    <AbsoluteFill>
      <SkyBlend from="sunset" to="night" u={0.35} clouds={2} waves={false} />
      <Camera cam={cam}>
        <WideLayer>
          <CloudHotel x={S3_HOTEL.x} groundY={S3_HOTEL.ground} w={S3_HOTEL.w} floors={2} grey={0.15} guests={0} />
          {/* The terrace he lands on. */}
          <ellipse cx={1100} cy={S3_DRIP.ground + 120} rx={1300} ry={160} fill={kidTheme.cloud} stroke="#7d93aa" strokeWidth={12} />
          <ClosedSign x={S3_DOOR.x} y={S3_DOOR.y + 40} pops={pops} wobble={alsoWob} />
        </WideLayer>
        <Drip
          x={mark.x}
          y={mark.y}
          scale={S3_SCALE}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={arrive < 0.05}
          look={frame >= noFrom - 4 ? "camera" : "left"}
          pose={frame >= noFrom ? "cheer" : undefined}
        />
      </Camera>
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(cam, mark) }}
        text={{ in_08_drip: "No hotel. No rules. No Kevin." }}
        at={{ in_08_drip: { x: 1380, y: 240, tail: "left", tailAt: S3_DRIP.x - 20 } }}
      />
    </AbsoluteFill>
  );
};

/** The sign on the hotel door: paper, string, five lines in Cloudia's hand. */
const ClosedSign: React.FC<{ x: number; y: number; pops: number[]; wobble: number }> = ({ x, y, pops, wobble }) => {
  const w = 360;
  const h = 250;
  return (
    <g transform={`translate(${x} ${y}) rotate(-3)`}>
      <path d={`M ${-w * 0.3} ${-h / 2} L 0 ${-h / 2 - 60} L ${w * 0.3} ${-h / 2}`} stroke={kidTheme.ink} strokeWidth={5} fill="none" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={7} />
      {SIGN_LINES.map((text, i) => {
        const s = pops[i] ?? 0;
        if (s <= 0.01) return null;
        const big = i === 0;
        const ty = -h / 2 + (big ? 56 : 66 + i * 42);
        return (
          <g key={text} transform={`translate(0 ${ty}) scale(${s}) rotate(${i === 3 ? wobble : 0})`}>
            <text
              textAnchor="middle"
              fontFamily={kidTheme.fontFamily}
              fontSize={big ? 52 : i === 4 ? 28 : 29}
              fontWeight={big ? 900 : 800}
              fontStyle={i === 4 ? "italic" : "normal"}
              letterSpacing={big ? 4 : 0}
              fill={big ? kidTheme.tomato : i === 4 ? kidTheme.purple : kidTheme.ink}
            >
              {i === 4 ? `— ${text}` : text}
            </text>
            {i === 3 ? <path d="M -100 10 Q 0 18 100 8" stroke={kidTheme.pink} strokeWidth={5} fill="none" strokeLinecap="round" /> : null}
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 4 — a cloud with no manager
// ---------------------------------------------------------------------------

const S4_DRIP = { x: 960, y: 560 };
const S4_SCALE = 0.62;

const CloudScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const p = lineProgress(scene, "in_09_narrator", frame);
  // Clause beats inside the one long take.
  const at = (u: number) => clamp01((p - u) / 0.05);
  const drops = at(0.12);
  const specks = at(0.2);
  const hug = at(0.32);
  const zillion = clamp01((p - 0.44) / 0.12);
  const cloud = at(0.58);
  const chaos = clamp01((p - 0.66) / 0.04) * (1 - clamp01((p - 0.86) / 0.06));
  const wind = clamp01((p - 0.84) / 0.16);
  const night = interpolate(p, [0, 1], [0.45, 0.85]);
  const shake = chaos * Math.sin(frame / 2.3) * 10;
  const drift = wind * 260;
  return (
    <AbsoluteFill>
      <SkyBlend from="sunset" to="night" u={night} clouds={1} waves={false} />
      <Camera cam={{ x: 960, y: 560, zoom: interpolate(cloud, [0, 1], [1.15, 0.9]), dx: drift, rotate: shake * 0.2 }}>
        <WideLayer>
          <g opacity={cloud}>
            <WildCloud x={960} y={600} w={1500} h={430} grey={0.55} faces={0} />
          </g>
          {/* A zillion others, each with a speck; one greedy one with two. */}
          {Array.from({ length: 22 }, (_, i) => {
            const a = i * 2.4;
            const r = 260 + (i % 5) * 70;
            const show = clamp01(zillion * 22 - i);
            if (show <= 0) return null;
            const x = 960 + Math.cos(a) * r * 1.5 + Math.sin(frame / 7 + i) * 8 * (1 + chaos * 3);
            const y = 580 + Math.sin(a) * r * 0.42 + Math.cos(frame / 9 + i) * 6 * (1 + chaos * 3);
            return (
              <g key={i} opacity={show}>
                <Blobby x={x} y={y} scale={0.55} phase={i} mood={chaos > 0.3 && i % 2 ? "surprised" : "happy"} look={Math.sin(i)} />
                <SpeckDot x={x + 34} y={y - 30} />
              </g>
            );
          })}
          {/* Loose drops and specks before the hug. */}
          {Array.from({ length: 6 }, (_, i) => (
            <g key={`d${i}`} opacity={drops * (1 - hug)}>
              <path transform={`translate(${620 + i * 130} ${420 + (i % 2) * 260 + Math.sin(frame / 10 + i) * 10}) scale(1.4)`} d={DROP_PATH} fill={kidTheme.water} stroke={kidTheme.waterDeep} strokeWidth={4} />
            </g>
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <g key={`s${i}`} opacity={specks * (1 - hug)}>
              <SpeckDot x={680 + i * 120} y={560 + (i % 2 ? -150 : 150) + Math.cos(frame / 12 + i) * 10} />
            </g>
          ))}
          <g opacity={zillion}>
            <Blobby x={1340} y={700} scale={0.6} phase={3} mood="happy" look={-0.4} />
            <SpeckDot x={1290} y={680} />
            <SpeckDot x={1392} y={680} />
          </g>
        </WideLayer>
        <Drip
          x={S4_DRIP.x}
          y={S4_DRIP.y}
          scale={S4_SCALE}
          emotion={hug > 0.5 ? "excited" : "happy"}
          phase={PHASE.drip}
          shadow={false}
          pose={hug > 0.5 ? "clutch" : undefined}
          look={chaos > 0.2 ? "camera" : hug > 0.5 ? "upRight" : "camera"}
        />
        {/* His speck, held up and hugged. */}
        <WideLayer opacity={specks}>
          <SpeckDot x={interpolate(hug, [0, 1], [1120, S4_DRIP.x + 48])} y={interpolate(hug, [0, 1], [380, S4_DRIP.y - 40])} r={16} />
        </WideLayer>
      </Camera>
      <WindLines u={wind} />
    </AbsoluteFill>
  );
};

/** A speck of dust (the ep-1 Speck's look, as plain SVG). */
const SpeckDot: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 12 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#9aa1ab" stroke={kidTheme.ink} strokeWidth={r * 0.22} />
    <circle cx={-r * 0.4} cy={-r * 0.3} r={r * 0.4} fill="#b3b9c2" />
  </g>
);

/** Wind: long curly strokes blowing across the frame. */
const WindLines: React.FC<{ u: number; glow?: number }> = ({ u }) => {
  const frame = useCurrentFrame();
  if (u <= 0.01) return null;
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {Array.from({ length: 6 }, (_, i) => {
        const x = ((frame * 14 + i * 400) % 2600) - 500;
        const y = 180 + i * 140;
        return (
          <path
            key={i}
            d={`M ${x} ${y} q 120 -30 240 0 q 60 16 40 -30 q -20 -30 -50 -6`}
            stroke="#ffffff"
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
            opacity={0.55 * u}
          />
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 5 — two winds, and the question
// ---------------------------------------------------------------------------

const S5_CLOUD = { x: 960, y: 250 };
const S5_DRIP: Mark = { x: 960, y: stand("drip", 240), scale: 0.42, who: "drip" };
// The two destinations are equal partners at phone width: the valley drawn
// big (VALLEY_K) with its wall and its busy beaver readable, the mountain set
// back and smaller than it was, so neither reads as the lesser choice.
const VALLEY_SPOT = { x: 500, y: 770 };
const VALLEY_K = 1.45;
const MOUNTAIN_SPOT = { x: 1490, y: 860 };
const MOUNTAIN = { h: 450, w: 740, baseY: MOUNTAIN_SPOT.y + 100 };
/** The vignette's stick wall, in vignette units (the Beaver stands on it). */
const VIG_WALL = { x: 70, y: 70, k: 0.32 };
const VIG_BEAVER = {
  x: VALLEY_SPOT.x + VIG_WALL.x * VALLEY_K,
  ground: VALLEY_SPOT.y + (VIG_WALL.y + (POND.damTopY - 4 - (POND.damTopY + POND.bed) / 2) * VIG_WALL.k) * VALLEY_K,
};

const S5_BUBBLES: Record<string, string> = {
  in_11_drip: "Valley? Or mountain? I CANNOT PICK.",
};

const WindsScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [windFrom, windTo] = lineWindow(scene, "in_10_narrator");
  const [pickFrom, pickTo] = lineWindow(scene, "in_11_drip");
  const [askFrom] = lineWindow(scene, "in_12_narrator");
  const span = windTo - windFrom;
  const valleyAt = Math.round(windFrom + span * 0.14);
  const mountainAt = Math.round(windFrom + span * 0.6);
  const valley = spring({ frame: frame - valleyAt, fps, config: { damping: 13, mass: 0.7 } });
  const mountain = spring({ frame: frame - mountainAt, fps, config: { damping: 13, mass: 0.7 } });
  const glow = frame > askFrom ? 0.5 + 0.5 * Math.sin((frame - askFrom) / 11) : 0;
  const eyes =
    frame > askFrom - 10
      ? ("camera" as const)
      : frame >= pickFrom && frame < pickFrom + (pickTo - pickFrom) * 0.3
        ? { x: -0.8, y: 0.7 }
        : frame >= pickFrom && frame < pickFrom + (pickTo - pickFrom) * 0.55
          ? { x: 0.8, y: 0.7 }
          : frame >= mountainAt && frame < pickFrom
            ? { x: 0.8, y: 0.7 }
            : frame >= valleyAt && frame < pickFrom
              ? { x: -0.8, y: 0.7 }
              : ("camera" as const);
  const settleAt = askFrom - 6;
  const mapped = useEmotion(scene, "drip", { in_11_drip: "amazed" }, "happy", 4);
  const emotion: EmotionInput = frame >= settleAt ? { emotion: "happy", from: "amazed", at: settleAt, frames: 8 } : mapped;
  return (
    <AbsoluteFill>
      <KidBackdrop variant="night" clouds={0} waves={false} />
      <WideLayer>
        {/* The land at night: a valley lower left, a mountain lower right. */}
        <path d="M -1200 900 Q 0 760 960 840 Q 1900 920 3200 800 L 3200 1700 L -1200 1700 Z" fill="#2f6b4a" />
        <g opacity={0.35 + 0.65 * valley}>
          <ValleyVignette x={VALLEY_SPOT.x} y={VALLEY_SPOT.y} />
        </g>
        <g opacity={0.35 + 0.65 * mountain}>
          <Volcano x={MOUNTAIN_SPOT.x} baseY={MOUNTAIN.baseY} h={MOUNTAIN.h} w={MOUNTAIN.w} />
        </g>
        <WindStream from={{ x: S5_CLOUD.x - 260, y: S5_CLOUD.y + 80 }} to={{ x: VALLEY_SPOT.x - 40, y: VALLEY_SPOT.y - 150 }} u={valley} glow={glow} />
        <WindStream from={{ x: S5_CLOUD.x + 260, y: S5_CLOUD.y + 80 }} to={{ x: MOUNTAIN_SPOT.x - 70, y: MOUNTAIN.baseY - MOUNTAIN.h - 30 }} u={mountain} glow={glow} />
        <WildCloud x={S5_CLOUD.x} y={S5_CLOUD.y + 40} w={720} h={210} grey={0.6} faces={8} />
      </WideLayer>
      {/* Somebody busy, on top of his wall, big enough to read on a phone. */}
      {valley > 0.5 ? (
        <Beaver x={VIG_BEAVER.x} y={stand("beaver", VIG_BEAVER.ground)} scale={0.42} emotion="neutral" phase={PHASE.beaver} chew look="left" shadow={false} />
      ) : null}
      <Drip
        x={S5_DRIP.x}
        y={S5_DRIP.y}
        scale={S5_DRIP.scale}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        look={eyes}
      />
      <Bubbles
        scene={scene}
        cast={{ drip: S5_DRIP }}
        text={S5_BUBBLES}
        at={{ in_11_drip: { x: 1440, y: 180, tail: "left", tailAt: S5_DRIP.x + 40 } }}
      />
    </AbsoluteFill>
  );
};

/** The valley, small: hills, the little river, a stick wall, somebody busy. */
const ValleyVignette: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y}) scale(${VALLEY_K})`}>
    <ellipse cx={0} cy={60} rx={380} ry={120} fill="#3f8f5a" stroke="#23523a" strokeWidth={8} />
    <path d="M -300 -10 C -180 30 -120 70 -40 70 C 60 70 140 110 280 150" stroke="#2c77ad" strokeWidth={40} fill="none" strokeLinecap="round" />
    <g transform="translate(-140 -10) scale(0.5)">
      <Tree x={0} baseY={0} h={300} />
    </g>
    <g transform={`translate(${VIG_WALL.x} ${VIG_WALL.y}) scale(${VIG_WALL.k}) translate(${-(POND.damBase[0] + POND.damBase[1]) / 2} ${-(POND.damTopY + POND.bed) / 2})`}>
      <StickWall />
    </g>
  </g>
);

/** A wind stream: a dashed, curling arrow from the cloud to a destination. */
const WindStream: React.FC<{ from: { x: number; y: number }; to: { x: number; y: number }; u: number; glow: number }> = ({
  from,
  to,
  u,
  glow,
}) => {
  const frame = useCurrentFrame();
  if (u <= 0.01) return null;
  const mx = (from.x + to.x) / 2;
  const d = `M ${from.x} ${from.y} Q ${mx} ${from.y + 40} ${to.x} ${to.y}`;
  const ang = Math.atan2(to.y - from.y - 40, to.x - mx) * (180 / Math.PI);
  return (
    <g opacity={Math.min(1, u)}>
      <path d={d} stroke={kidTheme.star} strokeWidth={34 + glow * 12} fill="none" strokeLinecap="round" opacity={0.18 + 0.3 * glow} />
      <path
        d={d}
        pathLength={1}
        stroke="#ffffff"
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${0.06} ${0.04}`}
        strokeDashoffset={-frame / 120}
      />
      <path transform={`translate(${to.x} ${to.y}) rotate(${ang})`} d="M 0 0 L -44 -24 L -36 0 L -44 24 Z" fill="#ffffff" stroke={kidTheme.ink} strokeWidth={4} />
    </g>
  );
};

export const INTRO_SCENES: Record<string, React.FC<SceneProps>> = {
  in_home: HomeScene,
  in_launch: LaunchScene,
  in_closed: ClosedScene,
  in_cloud: CloudScene,
  in_winds: WindsScene,
};

