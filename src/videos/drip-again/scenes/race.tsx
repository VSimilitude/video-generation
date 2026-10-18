import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Drip, KidBackdrop, kidTheme, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import { Splash } from "../../water-cycle/scenes/act3";
import { Beaver } from "./beaver";
import {
  Bubbles,
  Camera,
  CaptionCard,
  PHASE,
  WideLayer,
  clamp01,
  lineWindow,
  project,
  projectMark,
  stand,
  useEmotion,
  type Mark,
  type SceneProps,
} from "./common";
import { MOUNTAIN, MountainWorld, Routes, leftRoute, rightRoute } from "./mountain";
import { FloatDrops, POND_BEAVER, POND_DRIP } from "./pond";
import { LAVA, LAVA_HOT, ObsidianSlab, POND, PondWorld, SteamColumn } from "./props";

// RACE — after the mountain half-choice. Who is ahead is the variant (clips
// `rc_01`–`rc_03`, and the picture, by `choices.mountainWay`):
//
//   LEFT   Drip bounces straight down the steep side and gets there first.
//   RIGHT  Drip goes round and round, the lava goes straight down the
//          middle and gets there first; he splashes in as it meets the water.
//
// Then the set piece, identical on both: in profile at the pond's near shore
// (the same PondWorld the pond segment plays on), the lava front meets the
// water, a white column of steam goes straight up — no sunbeam, no Sunny
// anywhere in the shot — and the front goes from orange to black glass: the
// obsidian slab. The seam into `pond` is the settled wide.

const ease = Easing.inOut(Easing.quad);
const RACE_CAM = { x: 960, y: 560, zoom: 1.0 };
const RACE_SCALE = 0.4;
/** The pond at the foot, front-on, and its stick wall at the far (right) end. */
const FOOT_POND = { cx: 960, cy: 985, rx: 700, ry: 80 };

// ---------------------------------------------------------------------------
// Scene 1 — the race
// ---------------------------------------------------------------------------

const S1_BUBBLES: Record<string, string> = {
  rc_02a_drip: "I WON. I live here now.",
  rc_02b_drip: "I LOST. To a ROCK.",
};

const RaceScene: React.FC<SceneProps> = ({ scene, choices }) => {
  const frame = useCurrentFrame();
  const right = choices.mountainWay === "right";
  const turns = scene.turns ?? [];
  const runFrom = turns[0]?.from ?? 0;
  const runTo = runFrom + (turns[0]?.durationInFrames ?? 1);
  const span = runTo - runFrom;
  // LEFT: down by ~80% of the take; RIGHT: still on the last loop at its end.
  const t = interpolate(frame, [runFrom + 4, runFrom + span * (right ? 1.02 : 0.8)], [0, right ? 0.93 : 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: right ? Easing.linear : Easing.in(Easing.quad),
  });
  // The lava: slow and steady on LEFT, "not THAT slowly" on RIGHT — it is at
  // the bottom by three-quarters of the take, stopped just short of the water.
  const lava = interpolate(frame, [runFrom, runFrom + span * (right ? 0.75 : 1)], [0.8, right ? 0.985 : 0.93], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p = right ? rightRoute(t) : leftRoute(t);
  const arrived = !right && t >= 1;
  const arriveAt = runFrom + span * 0.8;
  // LEFT: once down, he hops into the pond and floats there.
  const into = clamp01((frame - arriveAt) / 14);
  const inPond = { x: leftRoute(1).x + 40, y: FOOT_POND.cy - 20 };
  const x = arrived ? interpolate(into, [0, 1], [p.x, inPond.x]) : p.x;
  const ground = arrived ? interpolate(into, [0, 1], [p.y, inPond.y]) - Math.sin(into * Math.PI) * 50 : p.y;
  const mark: Mark = { x, y: stand("drip", ground), scale: RACE_SCALE, who: "drip" };
  const emotion = useEmotion(scene, "drip", { rc_02a_drip: "proud", rc_02b_drip: "sad" }, "excited", 6);

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={RACE_CAM}>
        <WideLayer>
          <MountainWorld lava={lava} glow={1}>
            <Routes left={right ? 0.35 : 1} right={right ? 1 : 0.35} />
            <FootPond />
          </MountainWorld>
        </WideLayer>
        <Drip
          x={mark.x}
          y={mark.y}
          scale={RACE_SCALE}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          feet={!arrived}
          pose={!arrived && !right ? "cheer" : undefined}
          look={right ? { x: -0.8, y: 0.3 } : "camera"}
        />
        {arrived && frame < arriveAt + 40 ? <Splash x={inPond.x} y={inPond.y} from={Math.round(arriveAt + 12)} /> : null}
      </Camera>
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(RACE_CAM, mark) }}
        text={S1_BUBBLES}
        at={{
          rc_02a_drip: { x: 760, y: 560, tail: "left", tailAt: inPond.x + 20 },
          rc_02b_drip: { x: 1560, y: 660, tail: "left", tailAt: mark.x + 30 },
        }}
      />
    </AbsoluteFill>
  );
};

/** The pond at the mountain's foot, front-on, with a wall of sticks at its far end. */
const FootPond: React.FC = () => (
  <g>
    <ellipse cx={FOOT_POND.cx} cy={FOOT_POND.cy} rx={FOOT_POND.rx} ry={FOOT_POND.ry} fill={kidTheme.water} stroke={kidTheme.waterDeep} strokeWidth={10} />
    <ellipse cx={FOOT_POND.cx - 60} cy={FOOT_POND.cy - 18} rx={FOOT_POND.rx * 0.7} ry={FOOT_POND.ry * 0.4} fill={kidTheme.waterLight} opacity={0.4} />
    {/* The far end's wall: a short stick bar across the pond's right tip. */}
    <g transform={`translate(${FOOT_POND.cx + FOOT_POND.rx - 60} ${FOOT_POND.cy - 6})`}>
      <path d="M -90 50 Q -100 -40 -20 -56 Q 60 -64 90 40 Z" fill="#7a5232" stroke={kidTheme.ink} strokeWidth={8} strokeLinejoin="round" />
      {[-50, -10, 30].map((dx, i) => (
        <path key={dx} d={`M ${dx - 34} ${-20 + i * 18} L ${dx + 34} ${-30 + i * 22}`} stroke="#a46a3a" strokeWidth={12} strokeLinecap="round" />
      ))}
    </g>
  </g>
);

// ---------------------------------------------------------------------------
// Scene 2 — HISSSS: steam, and black glass
// ---------------------------------------------------------------------------

const S2_CAM = { x: 300, y: 600, zoom: 1.7 };
/** The hot lava's path down the near bank, ending at the water's edge. */
const LAVA_PATH = `M -400 ${POND.bankTop - 260} Q 0 ${POND.bankTop - 120} 160 ${POND.bankTop - 6} Q 240 ${POND.bankTop + 6} ${POND.slab.x - 10} ${POND.slab.y - 10}`;
/** Where Drip floats beside the slab for the reaction. */
const BESIDE = { x: 520, ground: POND.full + 64 };

const S2_BUBBLES: Record<string, string> = {
  rc_05_drip: "It made GLASS. Out of ITSELF.",
};

const HissScene: React.FC<SceneProps> = ({ scene, choices }) => {
  const frame = useCurrentFrame();
  const right = choices.mountainWay === "right";
  const turns = scene.turns ?? [];
  const meetFrom = turns[0]?.from ?? 0;
  const meetTo = meetFrom + (turns[0]?.durationInFrames ?? 1);
  const [hissFrom, hissTo] = lineWindow(scene, "rc_04_narrator");
  const hspan = hissTo - hissFrom;
  const [wowFrom] = lineWindow(scene, "rc_05_drip");
  // The front creeps the last stretch and touches the water at the end of
  // "…the lava reached the water."
  const splashAt = Math.round(meetFrom + (meetTo - meetFrom) * 0.42);
  // RIGHT: "as Drip splashed in, the lava reached the water" — the same frame.
  const touchAt = right ? splashAt + 2 : meetTo - 6;
  const front = interpolate(frame, [0, touchAt], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  // HISSSS: the steam goes up on the word and dies back as "the lava stopped".
  const steam = interpolate(frame, [hissFrom - 2, hissFrom + 8, hissFrom + hspan * 0.3, hissFrom + hspan * 0.42], [0, 1, 1, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // "When lava cools FAST … glass. Black glass. Shiny." — the front blackens.
  const slowAt = Math.round(hissFrom + hspan * 0.43);
  const fastAt = Math.round(hissFrom + hspan * 0.6);
  const cool = interpolate(frame, [fastAt, hissFrom + hspan * 0.82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const trailCool = interpolate(frame, [hissFrom, hissTo], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slabS = interpolate(frame, [touchAt, touchAt + 30], [0.5, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });

  // Drip: LEFT — already in the pond, watching. RIGHT — slides down the bank
  // and splashes in beside it "as Drip splashed in" (mid rc_03b).
  const slide = clamp01((frame - (splashAt - 26)) / 26);
  const rightX = interpolate(slide, [0, 1], [60, BESIDE.x], { easing: Easing.in(Easing.quad) });
  const rightGround = slide < 1 ? Math.min(POND.full + 64, Math.max(POND.bankTop, 0) + (POND.full + 64 - POND.bankTop) * slide * slide) : POND.full + 64;
  const dripX = right ? (frame < splashAt - 26 ? -200 : rightX) : BESIDE.x;
  const dripGround = right ? rightGround : BESIDE.ground;
  const mark: Mark = { x: dripX, y: stand("drip", dripGround), scale: 0.6, who: "drip" };
  const mapped = useEmotion(scene, "drip", { rc_05_drip: "amazed" }, "happy", 6);
  const emotion: EmotionInput = frame >= hissFrom && frame < wowFrom - 6 ? "amazed" : mapped;
  const bob = Math.sin(frame / 17) * 3;

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={S2_CAM}>
        <WideLayer>
          <PondWorld level={POND.full} lodge volcano={0.9} extraStick={1}>
            <path d={LAVA_PATH} stroke={LAVA_HOT} strokeWidth={50} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${front} 1`} opacity={0.5 * (1 - trailCool)} />
            <path
              d={LAVA_PATH}
              stroke={trailCool > 0.5 ? "#4a3b3f" : LAVA}
              strokeWidth={30}
              fill="none"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={`${front} 1`}
              opacity={1}
            />
            {front >= 0.999 ? <ObsidianSlab x={POND.slab.x} y={POND.slab.y} cool={cool} scale={slabS} /> : null}
            <SteamColumn x={POND.slab.x + 10} y={POND.slab.y - 40} u={steam} />
            <FloatDrops />
          </PondWorld>
        </WideLayer>
        <Beaver x={POND_BEAVER.x} y={POND_BEAVER.y} scale={POND_BEAVER.scale} emotion="neutral" phase={PHASE.beaver} look="left" />
        <Drip
          x={mark.x}
          y={mark.y + (dripGround >= POND.full + 64 ? bob : 0)}
          scale={0.6}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          feet={false}
          look={{ x: -1, y: 0.3 }}
        />
        {right && frame >= splashAt && frame < splashAt + 34 ? <Splash x={BESIDE.x} y={POND.full} from={splashAt} /> : null}
      </Camera>
      <CaptionCard text="cools slowly = ROCK" from={slowAt} until={fastAt - 4} y={170} align="right" />
      <CaptionCard text="cools FAST = GLASS" from={fastAt} until={wowFrom - 10} y={170} align="right" color={kidTheme.star} />
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(S2_CAM, mark) }}
        text={S2_BUBBLES}
        at={{ rc_05_drip: { x: 1300, y: 280, tail: "left", tailAt: project(S2_CAM, { x: BESIDE.x, y: 0 }).x + 30 } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — the wide: slab, pond, dam. The seam into `pond`.
// ---------------------------------------------------------------------------

const WideScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [factFrom, factTo] = lineWindow(scene, "rc_06_narrator");
  const span = factTo - factFrom;
  const handsAt = Math.round(factFrom + span * 0.82);
  // Pull out from the shore close-up to the pond wide, and float Drip to his
  // pond mark, all settled well before the seam.
  const u = interpolate(frame, [factFrom + 6, factFrom + span * 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const cam = {
    x: interpolate(u, [0, 1], [S2_CAM.x, 960]),
    y: interpolate(u, [0, 1], [S2_CAM.y, 540]),
    zoom: interpolate(u, [0, 1], [S2_CAM.zoom, 1]),
  };
  const drift = interpolate(frame, [factFrom + span * 0.2, factFrom + span * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const x = interpolate(drift, [0, 1], [BESIDE.x, POND_DRIP.x]);
  // "Drip has no hands." — he looks at his own arms, then back at you.
  const hands = frame >= handsAt && frame < handsAt + 40;
  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={cam}>
        <WideLayer>
          <PondWorld level={POND.full} lodge volcano={0.9} lavaTrail={1} extraStick={1}>
            <ObsidianSlab x={POND.slab.x} y={POND.slab.y} cool={1} scale={0.9} />
            <FloatDrops />
          </PondWorld>
        </WideLayer>
        <Beaver x={POND_BEAVER.x} y={POND_BEAVER.y} scale={POND_BEAVER.scale} emotion="neutral" phase={PHASE.beaver} look="left" />
        <Drip
          x={x + Math.sin(frame / 30) * 6 * drift}
          y={POND_DRIP.y + Math.sin(frame / 17) * 4}
          scale={0.6}
          emotion={hands ? "skeptical" : "happy"}
          phase={PHASE.drip}
          shadow={false}
          feet={false}
          look={hands ? "down" : drift < 1 ? { x: -1, y: 0.2 } : "camera"}
        />
      </Camera>
    </AbsoluteFill>
  );
};

export const RACE_SCENES: Record<string, React.FC<SceneProps>> = {
  rc_race: RaceScene,
  rc_hiss: HissScene,
  rc_wide: WideScene,
};

export { MOUNTAIN };
