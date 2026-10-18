import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Blobby, Cloudia, Drip, Sunny, kidTheme, mixHex, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import { CloudBlob } from "../../water-cycle/scenes/act2";
import { MountainPeak, S24_GROUND, Snowfall } from "../../water-cycle/scenes/act3";
import {
  Bird,
  Bubbles,
  PHASE,
  SkyBlend,
  WideLayer,
  lineWindow,
  midOf,
  stand,
  useEmotion,
  useLookAtSpeaker,
  type Cast,
  type Mark,
  type SceneProps,
} from "./common";

// SNOW — the slow way down, and the one place the clock bends (brief ruling 1).
// Snow does not roll downhill; it waits. So this branch takes a whole winter,
// and the stream that follows it is a spring morning: the merge reconciles on
// place and cast, and the time gap is carried by the ledger and paid by ONE
// variant line in `stream` (`st_02b`).
//
// Drip-as-a-snowflake is not a new rig: it is `Drip` with a drawn six-point
// frame behind him (`SnowFrame`), which grows on the roof, rides the whole
// winter, and melts off on "Aw. My corners."
//
// Branch segments carry no variants (brief ruling 2).

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * The snowflake Drip becomes: six arms with two pairs of branches each, drawn
 * behind him so his face stays his. `grow` 0..1 draws it out from his middle;
 * `melt` 0..1 shrinks it back and drips it away.
 */
const SnowFrame: React.FC<{ x: number; y: number; r: number; grow: number; melt?: number }> = ({
  x,
  y,
  r,
  grow,
  melt = 0,
}) => {
  const frame = useCurrentFrame();
  const g = clamp01(grow) * (1 - clamp01(melt) * 0.75);
  if (g <= 0.01) return null;
  const arm = r * g;
  const ice = mixHex("#ffffff", kidTheme.waterLight, 0.35 + melt * 0.4);
  const spin = Math.sin(frame / 50) * 4;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      <g transform={`rotate(${spin})`} opacity={1 - clamp01(melt) * 0.6}>
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 60})`}>
            {[true, false].map((outline) => (
              <g
                key={String(outline)}
                stroke={outline ? kidTheme.ink : ice}
                strokeWidth={outline ? 34 : 20}
                strokeLinecap="round"
                fill="none"
              >
                <path d={`M 0 0 L 0 ${-arm}`} />
                <path d={`M ${-arm * 0.28} ${-arm * 0.82} L 0 ${-arm * 0.6} L ${arm * 0.28} ${-arm * 0.82}`} />
                <path d={`M ${-arm * 0.22} ${-arm * 0.52} L 0 ${-arm * 0.36} L ${arm * 0.22} ${-arm * 0.52}`} />
              </g>
            ))}
            <circle cx={0} cy={-arm} r={14 * g} fill={ice} stroke={kidTheme.ink} strokeWidth={6} />
          </g>
        ))}
      </g>
      {/* Melt drips, falling off the tips. */}
      {melt > 0.05
        ? Array.from({ length: 6 }, (_, i) => {
            const a = ((i * 60 + 30) * Math.PI) / 180;
            const t = (melt * 3 + i * 0.17) % 1;
            return (
              <path
                key={i}
                transform={`translate(${Math.sin(a) * arm * 0.9} ${-Math.cos(a) * arm * 0.9 + t * 220}) scale(0.9)`}
                d="M 0 -26 C 6 -14 17 -6 17 6 A 17 17 0 0 1 -17 6 C -17 -6 -6 -14 0 -26 Z"
                fill={kidTheme.water}
                stroke={kidTheme.waterDeep}
                strokeWidth={5}
                opacity={(1 - t) * Math.min(1, (1 - melt) * 4)}
              />
            );
          })
        : null}
    </svg>
  );
};

/** Little snowflakes drifting down past him: he is one of a lot of them. */
const Flurry: React.FC<{ speed?: number; count?: number; opacity?: number }> = ({
  speed = 1.4,
  count = 26,
  opacity = 0.9,
}) => {
  const frame = useCurrentFrame();
  return (
    <WideLayer opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const x = ((i * 337) % 2200) - 140 + Math.sin(frame / 30 + i) * 40;
        const y = ((frame * speed * (0.7 + (i % 3) * 0.25) + i * 211) % 1400) - 160;
        const s = 0.5 + (i % 3) * 0.25;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${frame * 0.6 + i * 40}) scale(${s})`}>
            {Array.from({ length: 3 }, (_, k) => (
              <path
                key={k}
                transform={`rotate(${k * 60})`}
                d="M 0 -22 L 0 22"
                stroke="#ffffff"
                strokeWidth={7}
                strokeLinecap="round"
              />
            ))}
          </g>
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 1 — the roof, and the freeze
// ---------------------------------------------------------------------------

const S1_ROOF = 900;
const S1_DRIP = { x: 760, y: stand("drip", S1_ROOF) };
const S1_SCALE = 1.05;
const S1_CLOUDIA: Mark = {
  x: 1480,
  y: stand("cloudia", S1_ROOF),
  scale: 1,
  who: "cloudia",
  side: "left",
};

const S1_BUBBLES: Record<string, string> = {
  sn_01_cloudia: "Mind your edges, darling.",
  sn_03_drip: "I have CORNERS!",
};

const RoofScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [freezeFrom, freezeTo] = lineWindow(scene, "sn_02_narrator");
  // "…froze into a snowflake" grows the frame; "Six points." pops the tips.
  const growAt = Math.round(freezeFrom + (freezeTo - freezeFrom) * 0.42);
  const grow = interpolate(frame, [growAt, growAt + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.6)),
  });
  // The cold: frost creeping in at the edges as the scene goes on.
  const cold = interpolate(frame, [0, freezeFrom + 40], [0.35, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cast: Cast = {
    drip: { ...S1_DRIP, scale: S1_SCALE, who: "drip", side: "right" },
    cloudia: S1_CLOUDIA,
  };
  const dripLook = useLookAtSpeaker(scene, cast, "drip", "camera");
  const mapped = useEmotion(scene, "drip", { sn_03_drip: "proud" }, "happy");
  // Amazed as the frame grows round him — set by hand, because it lands in a
  // narrator line, not one of his.
  const emotion: EmotionInput =
    frame >= growAt - 4 && frame < freezeTo + 6
      ? { emotion: "amazed", from: "happy", at: growAt - 4, frames: 8 }
      : mapped;
  const dripMid = midOf("drip", S1_DRIP.y, S1_SCALE);

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={cold} clouds={2} waves={false} />
      <WideLayer>
        {/* The hotel's roof: the top of the cloud, grey, and very high up. */}
        <CloudBlob x={960} y={S1_ROOF + 170} w={2600} h={420} grey={0.6} seed={2} />
        {/* A chimney with a weathervane, so a roof reads as a roof. */}
        <rect x={1720} y={S1_ROOF - 230} width={90} height={250} rx={18} fill={kidTheme.cloudGreyShade} stroke={kidTheme.ink} strokeWidth={9} />
      </WideLayer>
      <Flurry speed={0.9} count={18} opacity={0.6} />
      <SnowFrame x={S1_DRIP.x} y={dripMid} r={250} grow={grow} />
      <Drip
        x={S1_DRIP.x}
        y={S1_DRIP.y}
        scale={S1_SCALE}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={frame > growAt ? 0.5 : 1}
        pose={frame >= freezeTo ? "cheer" : undefined}
        look={frame >= growAt && frame < freezeTo ? "down" : dripLook}
      />
      <Cloudia
        x={S1_CLOUDIA.x}
        y={S1_CLOUDIA.y}
        scale={S1_CLOUDIA.scale}
        fill={0.6}
        clipboard
        emotion={useEmotion(scene, "cloudia", { sn_01_cloudia: "proud" }, "happy")}
        speaking={useSpeaking(scene, "cloudia")}
        phase={PHASE.cloudia}
        look={useLookAtSpeaker(scene, cast, "cloudia", "left")}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S1_BUBBLES}
        // His bubble rides above the frame's top arm, not inside it.
        at={{ sn_03_drip: { x: 1120, y: 230, tail: "left", tailAt: S1_DRIP.x + 120 } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — the slow drift down, and a silent landing
// ---------------------------------------------------------------------------

const S2_DRIP = { x: 880, y: stand("drip", S24_GROUND) };
const S2_SCALE = 0.95;

const DRIFT_BIRDS = [
  { x: 120, y: 1300, scale: 0.85, speed: 1.1 },
  { x: 1500, y: 1600, scale: 0.75, speed: 1.3 },
  { x: 700, y: 2100, scale: 0.95, speed: 0.9 },
];

const DriftScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [slowFrom, slowTo] = lineWindow(scene, "sn_04_narrator");
  // "…and landed on the mountain without a sound." — the mountain comes up to
  // meet him over the last clause, and nothing happens when it does.
  const landAt = slowTo - 10;
  const rise = interpolate(frame, [landAt - 90, landAt], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const mountainDy = rise * 1100;
  // Falling leaf: side to side, slower as he lands.
  const sway = Math.sin(frame / 26) * 70 * rise;
  const tilt = Math.sin(frame / 26 + 0.6) * 12 * rise;
  const x = S2_DRIP.x + sway;
  const y = S2_DRIP.y - rise * 40;
  const mid = midOf("drip", y, S2_SCALE);

  const emotion = useEmotion(scene, "drip", { sn_05_drip: "proud" }, "happy");
  const birdsIn = interpolate(frame, [slowFrom, slowFrom + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={0.28} clouds={3} waves={false} />
      <WideLayer opacity={birdsIn * rise}>
        {/* The birds from the float, passing upward: he is the one moving. */}
        {DRIFT_BIRDS.map((b, i) => (
          <Bird
            key={i}
            x={((b.x + frame * 2.2) % 2400) - 240}
            y={b.y - frame * b.speed * 2.6}
            scale={b.scale}
            phase={i * 1.7}
            frame={frame}
          />
        ))}
      </WideLayer>
      <Flurry speed={-0.6} count={22} opacity={0.75} />
      <WideLayer>
        <g transform={`translate(0 ${mountainDy})`}>
          <MountainPeak winter={1} />
        </g>
      </WideLayer>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${tilt}deg)`, transformOrigin: `${x}px ${mid}px` }}>
        <SnowFrame x={x} y={mid} r={230} grow={1} />
        <Drip
          x={x}
          y={y}
          scale={S2_SCALE}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          idle={0.6}
          look={rise > 0.2 ? "down" : "camera"}
        />
      </div>
      <Bubbles
        scene={scene}
        cast={{ drip: { x, y, scale: S2_SCALE, who: "drip", side: "right" } }}
        text={{ sn_05_drip: "I am a mountain snowflake!" }}
        at={{ sn_05_drip: { x: 1300, y: 230, tail: "left", tailAt: S2_DRIP.x + 120 } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — all winter, then spring, then no corners
// ---------------------------------------------------------------------------

const S3_SUNNY = { x: 1560, y: stand("sunny", 430), scale: 0.85 };

const WinterScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [waitFrom] = lineWindow(scene, "sn_06_narrator");
  const [springFrom, springTo] = lineWindow(scene, "sn_08_narrator");
  const [cornersFrom, cornersTo] = lineWindow(scene, "sn_10_drip");

  // The winter passes on screen: days and nights cross-fade, the snow piles
  // up round him, from "All winter" to the end of the second hold.
  const winterFrom = waitFrom + 40;
  const winterTo = springFrom;
  const w = clamp01((frame - winterFrom) / Math.max(1, winterTo - winterFrom));
  const nights = 3;
  const night = frame > winterFrom && frame < winterTo ? 0.5 - 0.5 * Math.cos(w * nights * Math.PI * 2) : 0;
  // Spring: the snow goes back down and the peak thaws from white to moss.
  const thaw = interpolate(frame, [springFrom + 50, springTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const depth = Math.min(1, w * 1.1) * (1 - thaw);
  const sunnyAt = Math.round(springFrom + (springTo - springFrom) * 0.3);
  const melt = interpolate(frame, [cornersFrom - 4, cornersTo + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mid = midOf("drip", S2_DRIP.y, S2_SCALE);
  const sunnyMid = { x: S3_SUNNY.x, y: midOf("sunny", S3_SUNNY.y, S3_SUNNY.scale) };
  const cast: Cast = {
    drip: { ...S2_DRIP, scale: S2_SCALE, who: "drip", side: "right" },
    sunny: { ...S3_SUNNY, who: "sunny", side: "left" },
  };
  const mapped = useEmotion(
    scene,
    "drip",
    { sn_07_drip: "proud", sn_10_drip: "sad" },
    "happy",
    // Deadpan: no lead into "Still waiting" — the face must not leak the line.
    4,
  );
  const emotion: EmotionInput =
    frame >= cornersTo + 14 ? { emotion: "happy", from: "sad", at: cornersTo + 14, frames: 10 } : mapped;

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={0.28 + night * 0.68 * (1 - thaw)} clouds={3} waves={false} />
      <WideLayer>
        <MountainPeak winter={1} />
      </WideLayer>
      <AbsoluteFill style={{ opacity: thaw }}>
        <WideLayer>
          <MountainPeak winter={0} />
        </WideLayer>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: frame > winterFrom && frame < springFrom + 30 ? 1 - thaw : 0 }}>
        <Snowfall />
      </AbsoluteFill>
      {/* Meltwater running off the peak once the thaw starts: the snow is
          becoming the stream. */}
      <WideLayer opacity={thaw}>
        {Array.from({ length: 8 }, (_, i) => {
          const t = ((frame / 70 + i / 8) % 1);
          return (
            <Blobby
              key={i}
              x={1120 + t * 420 + (i % 3) * 30}
              y={900 + t * 260 + (i % 2) * 20}
              scale={0.32}
              phase={i * 1.4}
              opacity={Math.sin(t * Math.PI)}
            />
          );
        })}
      </WideLayer>
      <SnowFrame x={S2_DRIP.x} y={mid} r={230} grow={1} melt={melt} />
      <Drip
        x={S2_DRIP.x}
        y={S2_DRIP.y}
        scale={S2_SCALE}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        // Very still for the winter: this is the waiting.
        idle={frame > winterFrom && frame < springFrom ? 0.3 : 0.8}
        look={frame > sunnyAt && frame < cornersFrom ? "upRight" : frame >= cornersFrom ? "down" : "camera"}
      />
      {/* The snow piling up round him: drawn over his feet, never his face. */}
      <WideLayer>
        <path
          d={`M 560 ${S24_GROUND + 40} Q 700 ${S24_GROUND - 80 * depth} 880 ${S24_GROUND - 105 * depth} Q 1060 ${S24_GROUND - 80 * depth} 1200 ${S24_GROUND + 40} Z`}
          fill="#ffffff"
          stroke={mixHex("#c3d4e6", kidTheme.ink, 0.2)}
          strokeWidth={depth > 0.05 ? 8 : 0}
          opacity={depth > 0.02 ? 1 : 0}
        />
      </WideLayer>
      <Sunny
        x={S3_SUNNY.x}
        y={S3_SUNNY.y}
        scale={S3_SUNNY.scale}
        emotion="proud"
        speaking={useSpeaking(scene, "sunny")}
        phase={PHASE.sunny}
        shades={1}
        enter={{ at: sunnyAt, kind: "slideLeft" }}
        look={{ x: (S2_DRIP.x - sunnyMid.x) / 1200, y: 0.4 }}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={{
          sn_07_drip: "Still waiting. Still fancy.",
          sn_09_sunny: "Good MORNING, snowflakes!",
          sn_10_drip: "Aw. My corners.",
        }}
        at={{
          sn_07_drip: { x: 1240, y: 300, tail: "left", tailAt: S2_DRIP.x + 120 },
          sn_09_sunny: { x: 1060, y: 240, tail: "right", tailAt: S3_SUNNY.x - 150 },
          // Left of him: Sunny owns the top right by now.
          sn_10_drip: { x: 520, y: 330, tail: "right", tailAt: S2_DRIP.x - 60 },
        }}
      />
    </AbsoluteFill>
  );
};

export const SNOW_SCENES: Record<string, React.FC<SceneProps>> = {
  sn_roof: RoofScene,
  sn_drift: DriftScene,
  sn_winter: WinterScene,
};
