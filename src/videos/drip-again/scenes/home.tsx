import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BlobbyCrowd, Drip, KidBackdrop, Sunny, kidTheme, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
// Episode one's sibling mob, world map and journey ring (as DripChooses' ending).
import { CycleRing, SiblingMob, WorldMap } from "../../water-cycle/scenes/act3";
import {
  Bubbles,
  CutFlash,
  PHASE,
  WaterBand,
  WideLayer,
  lineWindow,
  midOf,
  stand,
  useEmotion,
  type Choices,
  type SceneProps,
} from "./common";
import { BEAVER } from "./beaver";
import { DROP_PATH, LAVA } from "./props";

// HOME — the shared ending. DripChooses' ending, restaged: the open sea and the
// sibling mob; Sunny's credits, where the variant clips honour every choice
// (`hm_04` in four flavours by branch + half-choice, `hm_05` by way out) and
// two icons show what the viewer picked (by `where` and `wayOut` only — brief
// ruling 3); then the ring, which goes round, and round AGAIN.

const SURFACE = 720;

// ---------------------------------------------------------------------------
// Scene 1 — home, again
// ---------------------------------------------------------------------------

const S1_DRIP = { x: 820, y: stand("drip", SURFACE + 170) };

const HomeScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [mobFrom] = lineWindow(scene, "hm_02_drip");
  const emotion = useEmotion(scene, "drip", { hm_02_drip: "excited" }, "happy");
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
        scale={1}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={1.1}
        pose={frame >= mobFrom ? "cheer" : undefined}
        look="camera"
      />
      <SiblingMob from={mobFrom - 10} anchor={{ x: S1_DRIP.x, y: midOf("drip", S1_DRIP.y, 1) }} />
      <Bubbles
        scene={scene}
        cast={{ drip: { ...S1_DRIP, scale: 1, who: "drip", side: "right" } }}
        text={{ hm_02_drip: "I am BACK! AGAIN!" }}
        at={{ hm_02_drip: { x: 1330, y: 250, tail: "left", tailAt: S1_DRIP.x + 80 } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — Sunny's credits
// ---------------------------------------------------------------------------

const S2_SUNNY = { x: 1540, y: stand("sunny", 560), scale: 1.2 };
const S2_DRIP = { x: 520, y: stand("drip", SURFACE + 230) };
const SLOTS = [
  { x: 380, y: 480 },
  { x: 700, y: 480 },
];

const CREDIT_BUBBLES: Record<string, string> = {
  hm_03_sunny: "Who did what today? ME.",
  hm_04a_sunny: "The beaver? I AM the daytime.",
  hm_04b_sunny: "Trees are made of sunshine. Me.",
  hm_04c_sunny: "The volcano? NOTHING to do with me.",
  hm_04d_sunny: "He LOST. To a rock.",
  hm_05a_sunny: "Downhill is still not a person.",
  hm_05b_sunny: "A house? I am too big.",
};

const CreditsScene: React.FC<SceneProps> = ({ scene, choices }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const turns = scene.turns ?? [];
  const at = [1, 2].map((i) => turns[i]?.from ?? 0);
  const pops = at.map((f) => spring({ frame: frame - f - 4, fps, config: { damping: 11, mass: 0.6 } }));
  const [verdictFrom] = lineWindow(scene, "hm_06_narrator");
  const icons: IconKind[] = [choices.where, choices.wayOut];
  const sunnyMid = { x: S2_SUNNY.x, y: midOf("sunny", S2_SUNNY.y, S2_SUNNY.scale) };
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
        emotion={useEmotion(scene, "sunny", { hm_03_sunny: "excited" }, "proud")}
        speaking={useSpeaking(scene, "sunny")}
        phase={PHASE.sunny}
        shades={1}
        look={{ x: -0.7, y: 0.3 }}
      />
      <Drip
        x={S2_DRIP.x}
        y={S2_DRIP.y}
        scale={0.8}
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
        at={Object.fromEntries(
          Object.keys(CREDIT_BUBBLES).map((k) => [k, { x: 960, y: 190, tail: "right" as const, tailAt: S2_SUNNY.x - 200 }]),
        )}
      />
    </AbsoluteFill>
  );
};

type IconKind = Choices["where"] | Choices["wayOut"];

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

const IconGlyph: React.FC<{ kind: IconKind }> = ({ kind }) => {
  const frame = useCurrentFrame();
  switch (kind) {
    case "valley":
      // The Beaver's face: ears, muzzle, the orange teeth.
      return (
        <g>
          {[-1, 1].map((s) => (
            <circle key={s} cx={s * 52} cy={-56} r={22} fill={BEAVER.fur} stroke={kidTheme.ink} strokeWidth={6} />
          ))}
          <circle cx={0} cy={4} r={74} fill={BEAVER.fur} stroke={kidTheme.ink} strokeWidth={7} />
          <ellipse cx={0} cy={30} rx={40} ry={26} fill={BEAVER.furLight} />
          {[-1, 1].map((s) => (
            <circle key={s} cx={s * 26} cy={-12} r={9} fill={kidTheme.ink} />
          ))}
          <ellipse cx={0} cy={16} rx={13} ry={8} fill={BEAVER.nose} />
          <rect x={-17} y={30} width={16} height={26} rx={4} fill={BEAVER.teeth} stroke={kidTheme.ink} strokeWidth={4} />
          <rect x={1} y={30} width={16} height={26} rx={4} fill={BEAVER.teeth} stroke={kidTheme.ink} strokeWidth={4} />
        </g>
      );
    case "mountain":
      // A black glossy slab, with a glint.
      return (
        <g>
          <path d="M -86 40 L -68 -10 L -26 -40 L 28 -34 L 74 -8 L 90 40 Z" fill="#16131c" stroke={kidTheme.ink} strokeWidth={7} strokeLinejoin="round" />
          <path d="M -54 -8 L -24 -26 L -12 -14 L -44 2 Z" fill="#ffffff" opacity={0.75} />
          <path
            transform={`translate(40 -18) scale(${0.8 + 0.25 * Math.sin(frame / 9)})`}
            d="M 0 -18 L 4 -4 L 18 0 L 4 4 L 0 18 L -4 4 L -18 0 L -4 -4 Z"
            fill="#ffffff"
          />
          <path d="M -90 60 Q 0 40 90 60" stroke={LAVA} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.6} />
        </g>
      );
    case "over":
      // A little waterfall over a wall.
      return (
        <g>
          <path d="M -90 70 L -60 -30 L 10 -30 L 30 70 Z" fill="#7a5232" stroke={kidTheme.ink} strokeWidth={6} strokeLinejoin="round" />
          <path d="M -40 -34 Q 30 -40 40 0 Q 50 40 60 76" stroke={kidTheme.waterDeep} strokeWidth={30} fill="none" strokeLinecap="round" />
          <path d="M -40 -34 Q 30 -40 40 0 Q 50 40 60 76" stroke={kidTheme.water} strokeWidth={18} fill="none" strokeLinecap="round" />
          <path transform={`translate(${44 + Math.sin(frame / 8) * 3} ${10 + ((frame * 2) % 60)}) scale(0.8)`} d={DROP_PATH} fill={kidTheme.waterLight} stroke={kidTheme.waterDeep} strokeWidth={4} />
        </g>
      );
    case "lodge":
      // A stick dome.
      return (
        <g>
          <path d="M -90 60 Q -90 -70 0 -70 Q 90 -70 90 60 Z" fill="#94683f" stroke={kidTheme.ink} strokeWidth={7} />
          {[-50, -10, 30, -30, 10, 50].map((dx, i) => (
            <path key={i} d={`M ${dx - 26} ${i < 3 ? 30 : -10} L ${dx + 26} ${i < 3 ? 6 : -34}`} stroke="#6f4322" strokeWidth={9} strokeLinecap="round" />
          ))}
          <path d="M -24 60 L -24 30 Q 0 6 24 30 L 24 60" fill="#1d1426" stroke={kidTheme.paper} strokeWidth={5} strokeDasharray="8 7" />
          <path d="M -110 60 L 110 60" stroke={kidTheme.water} strokeWidth={10} strokeLinecap="round" />
        </g>
      );
  }
};

// ---------------------------------------------------------------------------
// Scene 3 — it goes round AGAIN
// ---------------------------------------------------------------------------

const RING = { cx: 960, cy: 566, r: 336 };

const CircleScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [listFrom, listTo] = lineWindow(scene, "hm_07_drip");
  const [inviteFrom] = lineWindow(scene, "hm_08_narrator");
  const span = listTo - listFrom;
  // "No hotel. No Cloudia. Somewhere I had never been. And I STILL got home."
  // draws the ring; "It does not just go round." snaps it; "It goes round
  // AGAIN." sends one bright lap round it; then the shout.
  const progress = interpolate(frame, [listFrom + span * 0.05, listFrom + span * 0.5], [0, 0.965], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const snapAt = Math.round(listFrom + span * 0.58);
  const snapped = frame >= snapAt;
  const lapFrom = Math.round(listFrom + span * 0.68);
  const lap = interpolate(frame, [lapFrom, lapFrom + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const pulse = snapped ? Math.max(0, 1 - (frame - snapAt) / 26) : 0;
  const breathe = frame > inviteFrom ? 0.18 + 0.12 * Math.sin((frame - inviteFrom) / 14) : 0;
  const mapped = useEmotion(scene, "drip", { hm_07_drip: "excited" }, "happy");
  const emotion: EmotionInput =
    frame >= snapAt - 4 && frame < listTo + 10
      ? "amazed"
      : frame >= listTo + 10
        ? { emotion: "happy", from: "amazed", at: listTo + 10, frames: 10 }
        : mapped;
  // The bright lap: a drop running once round the rim.
  const th = ((140 + lap * 360) * Math.PI) / 180;
  const lapOn = lap > 0 && lap < 1;
  return (
    <AbsoluteFill>
      <WorldMap />
      <CycleRing cx={RING.cx} cy={RING.cy} r={RING.r} progress={snapped ? 1 : progress} glow={Math.max(pulse, breathe, lapOn ? 0.5 : 0)} stations />
      {lapOn ? (
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          <circle cx={RING.cx + Math.cos(th) * RING.r} cy={RING.cy + Math.sin(th) * RING.r} r={34} fill={kidTheme.star} opacity={0.6} />
          <path
            transform={`translate(${RING.cx + Math.cos(th) * RING.r} ${RING.cy + Math.sin(th) * RING.r}) scale(1.3)`}
            d={DROP_PATH}
            fill={kidTheme.water}
            stroke={kidTheme.waterDeep}
            strokeWidth={4}
          />
        </svg>
      ) : null}
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
        text={{ hm_07_drip: "THE WATER CYCLE! AGAIN!" }}
        at={{ hm_07_drip: { x: 1480, y: 170, tail: "left", tailAt: RING.cx + 90 } }}
      />
    </AbsoluteFill>
  );
};

export const HOME_SCENES: Record<string, React.FC<SceneProps>> = {
  hm_home: HomeScene,
  hm_credits: CreditsScene,
  hm_circle: CircleScene,
};
