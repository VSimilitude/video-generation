import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Drip, KidBackdrop, kidTheme } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import { Beaver, Stick } from "./beaver";
import {
  Bubbles,
  Camera,
  CaptionCard,
  CutFlash,
  PHASE,
  WideLayer,
  clamp01,
  lineWindow,

  stand,
  useEmotion,
  type Cast,
  type Mark,
  type SceneProps,
} from "./common";
import { POND_DRIP } from "./pond";
import { POND, PondWorld } from "./props";

// LODGE — through the beaver's house. Under the water it is plum-dark (like
// DripChooses' underground) and Drip carries his own soft glow; the lodge's
// front door is a dotted arch in the dome's base, under the waterline. Inside:
// a dry room of sticks, four beavers (one with a CHIP tag), each springing up
// as he is named; the "Busy." button with nothing moving. Out the back door,
// under the dam, into the river on the other side.

const ease = Easing.inOut(Easing.quad);
const lerp = (f: number, a: number, b: number, from: number, to: number, easing = ease) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const PLUM = "#2a1b3d";
const DOOR = { x: POND.lodge.x, y: POND.bed - 60 };
const BACK_DOOR = { x: POND.lodge.x + 150, y: POND.bed - 50 };

/** Plum-dark water below the surface, drawn in PondWorld coordinates. */
const Underwater: React.FC<{ level: number }> = ({ level }) => (
  // Bounded by the dam's upstream face, so the wall itself stays in daylight.
  <path
    d={`M -1200 ${level + 4} L 1322 ${level + 4} L 1290 700 L 1258 800 L 1236 900 L 1230 1700 L -1200 1700 Z`}
    fill={PLUM}
    opacity={0.62}
  />
);

/** A soft self-glow, so a blue drop reads on plum. */
const Glow: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <circle cx={x} cy={y} r={r} fill={kidTheme.waterLight} opacity={0.28} />
);

const DottedArch: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M -60 56 L -60 -16 Q 0 -86 60 -16 L 60 56"
    fill="#140c1e"
    fillOpacity={0.6}
    stroke={kidTheme.paper}
    strokeWidth={9}
    strokeDasharray="18 16"
    strokeLinecap="round"
  />
);

// ---------------------------------------------------------------------------
// Scene 1 — down, the front door, in (which is up)
// ---------------------------------------------------------------------------

const DoorScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [inFrom, inTo] = lineWindow(scene, "lo_01_narrator");
  const span = inTo - inFrom;
  // "sank down, and found the front door" ~35%; "and went in" ~52%;
  // "which means he went up, into a room made of sticks" — cut inside at 60%.
  const foundAt = Math.round(inFrom + span * 0.36);
  const inAt = Math.round(inFrom + span * 0.52);
  const cutAt = Math.round(inFrom + span * 0.6);
  const inside = frame >= cutAt;
  const sinkX = lerp(frame, inFrom, foundAt, POND_DRIP.x, DOOR.x + 150);
  const sinkG = lerp(frame, inFrom, foundAt, POND.full + 64, DOOR.y + 40);
  const enter = clamp01((frame - (inAt - 12)) / 12);
  const x = sinkX - enter * 150;
  const cam = {
    x: lerp(frame, 0, foundAt, 960, 900),
    y: lerp(frame, 0, foundAt, 540, 760),
    zoom: lerp(frame, 0, foundAt, 1, 1.6),
  };
  const mark: Mark = { x, y: stand("drip", sinkG), scale: 0.6, who: "drip" };
  return (
    <AbsoluteFill>
      {inside ? (
        <>
          <Room />
          <RoomBeavers named={[0, 0, 0, 0]} />
          <RisingDrip from={cutAt} />
          <CutFlash at={cutAt} strength={0.45} />
        </>
      ) : (
        <>
          <KidBackdrop variant="day" clouds={3} waves={false} />
          <Camera cam={cam}>
            <WideLayer>
              <PondWorld level={POND.full} lodge door={1} extraStick={2} />
              <Underwater level={POND.full} />
              <DottedArch x={DOOR.x} y={DOOR.y} />
              <Glow x={x} y={sinkG - 110} r={150} />
            </WideLayer>
            <Drip
              x={x}
              y={mark.y}
              scale={0.6 * (1 - enter * 0.6)}
              emotion={frame >= foundAt ? "amazed" : "happy"}
              phase={PHASE.drip}
              shadow={false}
              feet={false}
              look={frame >= foundAt - 20 ? "left" : "down"}
            />
          </Camera>
        </>
      )}
    </AbsoluteFill>
  );
};

// The room: a dry dome of sticks, a mud floor, a round hole in it (the door).
const ROOM_FLOOR = 880;
const HOLE = { x: 960, y: ROOM_FLOOR + 20 };
const BEAVERS = [
  { x: 330, scale: 0.75, tag: undefined as string | undefined },
  { x: 640, scale: 0.68, tag: undefined },
  { x: 1290, scale: 0.7, tag: undefined },
  { x: 1600, scale: 0.6, tag: "CHIP" },
];

const Room: React.FC = () => (
  <AbsoluteFill style={{ background: "#3b2a1e" }}>
    <WideLayer>
      <path d="M -200 1100 L -200 700 Q 960 -260 2120 700 L 2120 1100 Z" fill="#6f4a2c" />
      {Array.from({ length: 34 }, (_, i) => {
        const a = Math.PI * (0.05 + (i / 33) * 0.9);
        const r = 820 + (i % 3) * 90;
        return (
          <Stick
            key={i}
            x={960 - Math.cos(a) * r * 1.25}
            y={980 - Math.sin(a) * r}
            len={240}
            angle={(-Math.cos(a) * 60 + (i % 2 ? 20 : -20))}
            tone={i}
          />
        );
      })}
      <path d={`M -200 ${ROOM_FLOOR} Q 960 ${ROOM_FLOOR - 40} 2120 ${ROOM_FLOOR} L 2120 1300 L -200 1300 Z`} fill="#8a6440" stroke={kidTheme.ink} strokeWidth={10} />
      <ellipse cx={HOLE.x} cy={HOLE.y} rx={170} ry={44} fill={kidTheme.waterDark} stroke={kidTheme.ink} strokeWidth={9} />
      <ellipse cx={HOLE.x} cy={HOLE.y - 6} rx={120} ry={22} fill={kidTheme.water} opacity={0.7} />
    </WideLayer>
  </AbsoluteFill>
);

/** Drip bobbing up out of the floor hole into the room. */
const RisingDrip: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const u = clamp01((frame - from - 6) / 22);
  const ground = HOLE.y + 10 - Easing.out(Easing.back(1.6))(u) * 40;
  return (
    <Drip
      x={HOLE.x}
      y={stand("drip", ground) + (1 - u) * 160}
      scale={0.8}
      emotion="amazed"
      phase={PHASE.drip}
      shadow={false}
      feet={false}
      look="camera"
    />
  );
};

const RoomBeavers: React.FC<{ named: number[]; speaking?: boolean; still?: boolean }> = ({ named, speaking = false, still = false }) => (
  <>
    {BEAVERS.map((b, i) => (
      <Beaver
        key={i}
        x={b.x}
        y={stand("beaver", ROOM_FLOOR + 4) + (1 - named[i]) * 40}
        scale={b.scale * (0.82 + 0.18 * named[i])}
        emotion="neutral"
        speaking={i === 0 && speaking}
        phase={PHASE.beaver + i * 1.7}
        tag={b.tag}
        idle={still ? 0 : 0.5}
        eyeLife={still ? 0 : 0.6}
        look={b.x < 960 ? "right" : "left"}
        flip={i === 2}
      />
    ))}
  </>
);

// ---------------------------------------------------------------------------
// Scene 2 — Hi Beaver! Hi Beaverly! Hi other Beaver! Hi Chip! / Busy.
// ---------------------------------------------------------------------------

const ROOM_DRIP: Mark = { x: HOLE.x, y: stand("drip", HOLE.y - 30), scale: 0.8, who: "drip" };

const S2_BUBBLES: Record<string, string> = {
  lo_02_drip: "Hi Beaver! Hi Beaverly! Hi Chip!",
  lo_04_beaver: "Busy.",
  lo_06_drip: "In through the FLOOR. So DRY.",
};

const RoomScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [callFrom, callTo] = lineWindow(scene, "lo_02_drip");
  const [busyFrom, busyTo] = lineWindow(scene, "lo_04_beaver");
  const [factFrom] = lineWindow(scene, "lo_05_narrator");
  const span = callTo - callFrom;
  // Each springs up on his name.
  const nameAt = [0.04, 0.26, 0.5, 0.8].map((u) => Math.round(callFrom + span * u));
  const named = nameAt.map((at) => spring({ frame: frame - at, fps, config: { damping: 9, mass: 0.6 } }));
  // "Busy.": nothing moves — not him, not the others, not Drip.
  const still = frame >= busyFrom - 20 && frame < busyTo + 20;
  const cast: Cast = {
    drip: ROOM_DRIP,
    beaver: { x: BEAVERS[0].x, y: stand("beaver", ROOM_FLOOR + 4), scale: BEAVERS[0].scale, who: "beaver" },
  };
  const emotion = useEmotion(scene, "drip", { lo_02_drip: "excited", lo_06_drip: "amazed" }, "happy", 6);
  const dripLook =
    frame >= callFrom && frame < callTo
      ? frame < nameAt[1]
        ? ("left" as const)
        : frame < nameAt[2]
          ? { x: -0.5, y: 0 }
          : frame < nameAt[3]
            ? { x: 0.5, y: 0 }
            : ("right" as const)
      : frame >= busyFrom - 20 && frame < busyTo + 20
        ? ("left" as const)
        : ("camera" as const);
  return (
    <AbsoluteFill>
      <Room />
      <RoomBeavers named={named} speaking={useSpeaking(scene, "beaver")} still={still} />
      <Drip
        x={ROOM_DRIP.x}
        y={ROOM_DRIP.y}
        scale={0.8}
        emotion={still ? "happy" : emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        feet={false}
        idle={still ? 0 : 1}
        eyeLife={still ? 0 : 1}
        pose={frame >= callFrom && frame < callTo ? "cheer" : undefined}
        look={dripLook}
      />
      <CaptionCard text="a beaver's house = a LODGE" from={factFrom + 4} until={factFrom + 150} y={150} />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S2_BUBBLES}
        at={{
          lo_02_drip: { x: 960, y: 330, tail: "left", tailAt: ROOM_DRIP.x + 20 },
          lo_04_beaver: { x: 560, y: 380, tail: "left", tailAt: BEAVERS[0].x + 30 },
          lo_06_drip: { x: 960, y: 330, tail: "left", tailAt: ROOM_DRIP.x + 20 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — out the back door, under the dam, into the river
// ---------------------------------------------------------------------------

const TUNNEL = { x: (POND.damBase[0] + POND.damBase[1]) / 2, y: POND.bed - 24 };

const OutScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [outFrom, outTo] = lineWindow(scene, "lo_07_narrator");
  const span = outTo - outFrom;
  // "There was a back door." ~10%; "Out he went" ~45%; "under the dam" ~60%;
  // "into the river on the other side" ~75%.
  const doorAt = Math.round(outFrom + span * 0.1);
  const outAt = Math.round(outFrom + span * 0.42);
  const underAt = Math.round(outFrom + span * 0.6);
  const riverAt = Math.round(outFrom + span * 0.78);
  const x = interpolate(frame, [outAt, underAt, riverAt], [BACK_DOOR.x + 40, TUNNEL.x, POND.damBase[1] + 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const ground = interpolate(frame, [outAt, underAt, riverAt], [BACK_DOOR.y + 50, TUNNEL.y + 40, POND.downY + 36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const visible = frame >= outAt - 8;
  // A pan: the followed point is held at frame centre.
  const px = lerp(frame, outAt, riverAt, BACK_DOOR.x + 120, POND.damBase[1] + 60);
  const cam = { x: px, y: 780, zoom: 1.45, dx: 960 - px };
  const pop = clamp01((frame - (outAt - 8)) / 10);
  const mark: Mark = { x, y: stand("drip", ground), scale: 0.5, who: "drip" };
  const inRiver = frame >= riverAt;
  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={cam}>
        <WideLayer>
          <PondWorld level={POND.full} lodge extraStick={2} />
          <Underwater level={POND.full} />
          <g opacity={clamp01((frame - doorAt) / 12)}>
            <DottedArch x={BACK_DOOR.x} y={BACK_DOOR.y} s={0.8} />
          </g>
          {/* The way under the wall: a dark gap at the dam's foot. */}
          <path d={`M ${TUNNEL.x - 170} ${POND.bed + 4} Q ${TUNNEL.x} ${POND.bed - 70} ${TUNNEL.x + 170} ${POND.bed + 4} Z`} fill="#140c1e" stroke={kidTheme.paper} strokeWidth={7} strokeDasharray="16 14" />
          {visible && !inRiver ? <Glow x={x} y={ground - 90} r={120} /> : null}
        </WideLayer>
        {visible ? (
          <Drip
            x={x}
            y={mark.y}
            scale={0.5 * (0.4 + 0.6 * pop)}
            emotion="excited"
            phase={PHASE.drip}
            shadow={false}
            feet={false}
            pose={inRiver ? "cheer" : undefined}
            look={inRiver ? "camera" : "right"}
          />
        ) : null}
      </Camera>
    </AbsoluteFill>
  );
};

export const LODGE_SCENES: Record<string, React.FC<SceneProps>> = {
  lo_door: DoorScene,
  lo_room: RoomScene,
  lo_out: OutScene,
};
