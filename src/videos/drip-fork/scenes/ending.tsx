import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlobbyCrowd, Drip, KidBackdrop, Sunny, kidTheme, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
// Episode one's sibling mob, world map and journey ring.
import { CycleRing, SiblingMob, WorldMap } from "../../water-cycle/scenes/act3";
import {
  Bubbles,
  CutFlash,
  PHASE,
  SnowGlyph,
  WaterBand,
  WideLayer,
  lineWindow,
  midOf,
  stand,
  useEmotion,
  type Choices,
  type SceneProps,
} from "./common";

// ENDING — shared trunk 3. Every path arrives at the sea (round the headland on
// the river paths, off the beach on the underground ones); the shared skeleton
// is the open sea itself, so neither arrival is restaged here.
//
// Sunny's credits are the variant inserts: three slots, one per choice, each a
// two-tagged clip Video.tsx swaps in, and each with a small icon of the thing
// the viewer actually chose — the only place in the composition that reads
// `choices` to pick a picture. Every choice is now honoured twice: once in the
// next shared segment, once here (brief ruling 2).

const SURFACE = 720;

// ---------------------------------------------------------------------------
// Scene 1 — home, and the sibling mob
// ---------------------------------------------------------------------------

const S1_DRIP = { x: 820, y: stand("drip", SURFACE + 170) };
const S1_SCALE = 1;

const HomeScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [mobFrom] = lineWindow(scene, "en_02_drip");
  const mobAt = mobFrom - 10;
  const emotion = useEmotion(scene, "drip", { en_02_drip: "excited" }, "happy");

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WaterBand top={SURFACE} dx={-frame * 1.2} />
      <WideLayer>
        <BlobbyCrowd count={12} x={960} y={SURFACE + 120} spread={3400} scale={0.5} opacity={0.75} />
      </WideLayer>
      <Drip
        x={S1_DRIP.x}
        y={S1_DRIP.y}
        scale={S1_SCALE}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={1.1}
        pose={frame >= mobFrom ? "cheer" : undefined}
        look="camera"
      />
      <SiblingMob from={mobAt} anchor={{ x: S1_DRIP.x, y: midOf("drip", S1_DRIP.y, S1_SCALE) }} />
      <Bubbles
        scene={scene}
        cast={{ drip: { ...S1_DRIP, scale: S1_SCALE, who: "drip", side: "right" } }}
        text={{ en_02_drip: "Hi Drop! I am BACK!" }}
        at={{ en_02_drip: { x: 1330, y: 250, tail: "left", tailAt: S1_DRIP.x + 80 } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — Sunny's credits
// ---------------------------------------------------------------------------

const S2_SUNNY = { x: 1540, y: stand("sunny", 560), scale: 1.2 };
const S2_DRIP = { x: 520, y: stand("drip", SURFACE + 230) };
const S2_SCALE = 0.8;
/** Where the three credit icons land, left to right, in story order. */
const SLOTS = [
  { x: 300, y: 480 },
  { x: 580, y: 480 },
  { x: 860, y: 480 },
];

const CREDIT_BUBBLES: Record<string, string> = {
  en_03_sunny: "Who did what today? ME.",
  en_04a_sunny: "The sunbeam express? Me.",
  en_04b_sunny: "The slow float? Also me.",
  en_05a_sunny: "The rain? Me.",
  en_05b_sunny: "Who melted the snow? ME.",
  en_06a_sunny: "Downhill is not a person!",
  en_06b_sunny: "I am still counting it.",
};

const CreditsScene: React.FC<SceneProps> = ({ scene, choices }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Each icon lands as its credit starts — the turns are already the viewer's
  // own clips, so the second, third and fourth turns are the three credits.
  const turns = scene.turns ?? [];
  const at = [1, 2, 3].map((i) => turns[i]?.from ?? 0);
  const pops = at.map((f) => spring({ frame: frame - f - 4, fps, config: { damping: 11, mass: 0.6 } }));
  const [verdictFrom] = lineWindow(scene, "en_07_narrator");
  const icons: IconKind[] = [choices.wayUp, choices.wayDown, choices.whereTo];

  const sunnyMid = { x: S2_SUNNY.x, y: midOf("sunny", S2_SUNNY.y, S2_SUNNY.scale) };
  // Drip listens up at Sunny, and at the verdict looks at you: deadpan.
  const dripEmotion: EmotionInput =
    frame >= verdictFrom - 4 ? { emotion: "skeptical", from: "happy", at: verdictFrom - 4, frames: 8 } : "happy";

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={2} waves={false} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${sunnyMid.x}px ${sunnyMid.y}px, rgba(255,230,128,0.45) 0%, rgba(255,201,60,0.16) 30%, transparent 60%)`,
        }}
      />
      <WaterBand top={SURFACE + 60} dx={-frame * 1.2} />
      <WideLayer>
        <BlobbyCrowd count={10} x={760} y={SURFACE + 170} spread={1700} scale={0.5} opacity={0.9} />
      </WideLayer>
      <Sunny
        x={S2_SUNNY.x}
        y={S2_SUNNY.y}
        scale={S2_SUNNY.scale}
        emotion={useEmotion(scene, "sunny", { en_03_sunny: "excited" }, "proud")}
        speaking={useSpeaking(scene, "sunny")}
        phase={PHASE.sunny}
        shades={1}
        look={{ x: -0.7, y: 0.3 }}
      />
      <Drip
        x={S2_DRIP.x}
        y={S2_DRIP.y}
        scale={S2_SCALE}
        emotion={dripEmotion}
        phase={PHASE.drip}
        shadow={false}
        idle={0.9}
        look={frame >= verdictFrom - 4 ? "camera" : "upRight"}
      />
      {icons.map((kind, i) => (
        <CreditIcon key={i} x={SLOTS[i].x} y={SLOTS[i].y} s={pops[i]} kind={kind} />
      ))}
      <Bubbles
        scene={scene}
        cast={{ sunny: { ...S2_SUNNY, who: "sunny", side: "left" } }}
        text={CREDIT_BUBBLES}
        // Every credit in the same place, left of his face and above the icons'
        // row's right end, so the row reads as his list.
        at={Object.fromEntries(
          Object.keys(CREDIT_BUBBLES).map((k) => [k, { x: 1060, y: 190, tail: "right" as const, tailAt: S2_SUNNY.x - 170 }]),
        )}
      />
    </AbsoluteFill>
  );
};

type IconKind = Choices["wayUp"] | Choices["wayDown"] | Choices["whereTo"];

/** One credit: a paper card with a picture of what the viewer chose. */
const CreditIcon: React.FC<{ x: number; y: number; s: number; kind: IconKind }> = ({ x, y, s, kind }) => {
  if (s <= 0.01) return null;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", zIndex: 20 }} width={1} height={1}>
      <g transform={`scale(${s}) rotate(${(1 - s) * 10 - 3})`}>
        <rect x={-115} y={-115} width={230} height={230} rx={44} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={10} />
        <IconGlyph kind={kind} />
      </g>
    </svg>
  );
};

const DROP = "M 0 -26 C 6 -14 17 -6 17 6 A 17 17 0 0 1 -17 6 C -17 -6 -6 -14 0 -26 Z";

const IconGlyph: React.FC<{ kind: IconKind }> = ({ kind }) => {
  const frame = useCurrentFrame();
  switch (kind) {
    case "sunbeam":
      return (
        <g>
          {/* A fat beam from the sun to one drop, with speed lines. */}
          <path d="M 44 -92 L 96 -44 L -10 92 L -92 10 Z" fill={kidTheme.sunLight} opacity={0.85} />
          {[-30, 0, 30].map((o) => (
            <path key={o} d={`M ${40 + o} ${-40 + o} L ${-20 + o} ${20 + o}`} stroke="#ffffff" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
          ))}
          <circle cx={70} cy={-70} r={34} fill={kidTheme.sun} stroke={kidTheme.sunDeep} strokeWidth={6} />
          <path transform="translate(-48 48) scale(1.4)" d={DROP} fill={kidTheme.water} stroke={kidTheme.waterDeep} strokeWidth={5} />
        </g>
      );
    case "float":
      return (
        <g>
          <circle cx={-34} cy={-50} r={30} fill={kidTheme.cloud} stroke={kidTheme.cloudShade} strokeWidth={6} />
          <circle cx={10} cy={-64} r={38} fill={kidTheme.cloud} stroke={kidTheme.cloudShade} strokeWidth={6} />
          <circle cx={50} cy={-46} r={28} fill={kidTheme.cloud} stroke={kidTheme.cloudShade} strokeWidth={6} />
          {[0, 1, 2].map((i) => (
            <path key={i} transform={`translate(${-40 + i * 40} ${60 - i * 16 + Math.sin(frame / 14 + i) * 5}) scale(0.9)`} d={DROP} fill={kidTheme.waterLight} stroke={kidTheme.waterDeep} strokeWidth={5} />
          ))}
        </g>
      );
    case "rain":
      return (
        <g>
          {[[-46, -30], [10, -56], [52, 10], [-14, 40]].map(([dx, dy], i) => (
            <path key={i} transform={`translate(${dx} ${dy}) scale(1.4)`} d={DROP} fill={kidTheme.water} stroke={kidTheme.waterDeep} strokeWidth={4} />
          ))}
        </g>
      );
    case "snow":
      return <SnowGlyph r={78} />;
    case "river":
      return (
        <g>
          <path d="M -100 -40 C -40 -70 20 0 100 -20" stroke={kidTheme.waterDark} strokeWidth={46} fill="none" strokeLinecap="round" />
          <path d="M -100 -40 C -40 -70 20 0 100 -20" stroke={kidTheme.water} strokeWidth={28} fill="none" strokeLinecap="round" />
          {/* The flower on the bank, leaning over to drink. */}
          <path d="M 40 90 Q 30 40 -10 20" stroke={kidTheme.grassDark} strokeWidth={10} fill="none" strokeLinecap="round" />
          <g transform="translate(-14 16)">
            {Array.from({ length: 8 }, (_, k) => (
              <ellipse key={k} transform={`rotate(${k * 45}) translate(0 -26)`} rx={11} ry={18} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={4} />
            ))}
            <circle r={18} fill={kidTheme.sun} stroke={kidTheme.ink} strokeWidth={5} />
          </g>
        </g>
      );
    case "underground":
      return (
        <g>
          <rect x={-100} y={-20} width={200} height={110} rx={20} fill="#3a2d44" />
          <ellipse cx={0} cy={-6} rx={56} ry={18} fill="#140f1c" stroke={kidTheme.ink} strokeWidth={5} />
          <path d="M -16 -6 L -16 -62 Q 0 -90 16 -62 L 16 -6 Z" fill={kidTheme.pink} stroke={kidTheme.ink} strokeWidth={6} />
          {[-6, 6].map((dx) => (
            <circle key={dx} cx={dx} cy={-62} r={4} fill={kidTheme.ink} />
          ))}
          <path transform="translate(-60 50) scale(0.9)" d={DROP} fill={kidTheme.waterLight} stroke={kidTheme.waterDeep} strokeWidth={4} />
        </g>
      );
  }
};

// ---------------------------------------------------------------------------
// Scene 3 — it is a circle
// ---------------------------------------------------------------------------

const RING = { cx: 960, cy: 566, r: 336 };

const CircleScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [listFrom, listTo] = lineWindow(scene, "en_08_drip");
  const [inviteFrom] = lineWindow(scene, "en_09_narrator");
  const span = listTo - listFrom;
  // "I went UP. I went across the sky. I came DOWN. And I came all the way
  // home." draws the ring; "It is a CIRCLE." snaps it shut.
  const progress = interpolate(
    frame,
    [listFrom + span * 0.05, listFrom + span * 0.6, listFrom + span * 0.72],
    [0, 0.965, 0.965],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const snapAt = Math.round(listFrom + span * 0.76);
  const snapped = frame >= snapAt;
  const pulse = snapped ? Math.max(0, 1 - (frame - snapAt) / 26) : 0;
  // A glow *cycle* over the invitation: the end card lands on these frames,
  // so they must look like any other frame of the hold.
  const breathe = frame > inviteFrom ? 0.18 + 0.12 * Math.sin((frame - inviteFrom) / 14) : 0;

  const mapped = useEmotion(scene, "drip", { en_08_drip: "excited" }, "happy");
  const emotion: EmotionInput =
    frame >= snapAt - 4 && frame < listTo + 10
      ? "amazed"
      : frame >= listTo + 10
        ? { emotion: "happy", from: "amazed", at: listTo + 10, frames: 10 }
        : mapped;

  return (
    <AbsoluteFill>
      <WorldMap />
      <CycleRing
        cx={RING.cx}
        cy={RING.cy}
        r={RING.r}
        progress={snapped ? 1 : progress}
        glow={Math.max(pulse, breathe)}
        stations
      />
      {snapped && frame < snapAt + 30 ? <CutFlash at={snapAt} strength={0.55} /> : null}
      <Drip
        x={RING.cx}
        y={stand("drip", RING.cy + 150)}
        scale={0.78}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={1.1}
        look={snapped ? "camera" : "up"}
      />
      <Bubbles
        scene={scene}
        cast={{ drip: { x: RING.cx, y: stand("drip", RING.cy + 150), scale: 0.78, who: "drip" } }}
        text={{ en_08_drip: "THE WATER CYCLE!" }}
        // Top right, outside the ring: above him, tail down towards him.
        at={{ en_08_drip: { x: 1480, y: 170, tail: "left", tailAt: RING.cx + 90 } }}
      />
    </AbsoluteFill>
  );
};

export const ENDING_SCENES: Record<string, React.FC<SceneProps>> = {
  en_home: HomeScene,
  en_credits: CreditsScene,
  en_circle: CircleScene,
};
