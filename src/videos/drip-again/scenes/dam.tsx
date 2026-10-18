import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Drip, KidBackdrop, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import { Beaver } from "./beaver";
import {
  Bubbles,
  Camera,
  CutFlash,
  NameArrow,
  PHASE,
  SETTLE_FRAMES,
  WideLayer,
  clamp01,
  lineProgress,
  lineWindow,
  project,
  projectMark,
  stand,
  useEmotion,
  useLookAtSpeaker,
  type Cast,
  type Mark,
  type SceneProps,
} from "./common";
import { POND_BEAVER, POND_DRIP } from "./pond";
import { DAM_STAND, Log, POND, PondWorld, RainField, Tree, VALLEY, ValleyWorld, WildCloud } from "./props";

// DAM — after the valley half-choice. Two openings, by `choices.valleyWay`
// (the clips `da_01`–`da_03` swap, and so does the picture — brief ruling 3):
//
//   LEFT   rain off the cloud's left side into the little river, the river
//          runs into a wall of sticks, Drip pressed against it; the Beaver
//          pops up on top and adds a stick.
//   RIGHT  one drop onto the tall tree, down a leaf, down the trunk, onto the
//          Beaver's head; CRACK, the tree falls into the river with Drip on
//          it, and the Beaver pushes the log to the wall and wedges it in.
//
// From `da_04` the two are the same shot — the wall from the river side,
// Beaver on top, Drip at the wall (sitting on the log on RIGHT paths: the one
// path-read prop after the opening). Then the teeth, and the pond filling.
// The seam into `pond` is the settled, full pond — POND_DRIP, POND_BEAVER.

const ease = Easing.inOut(Easing.quad);
const lerp = (f: number, a: number, b: number, from: number, to: number, easing = ease) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** Where Drip waits at the wall, before the pond fills. */
const WALL_DRIP_X = 990;
/** The wedged log on RIGHT paths, and where Drip sits on it. */
const WEDGED = { x: 985, y: POND.low - 6, angle: -24, len: 320 };
const ON_LOG_GROUND = POND.low - 26;
const DRIP_SCALE = 0.6;

function wallDripY(right: boolean, level: number): number {
  return stand("drip", right ? Math.min(ON_LOG_GROUND, level + 64) : level + 64);
}

// ---------------------------------------------------------------------------
// Scene 1 — the arrival (two openings)
// ---------------------------------------------------------------------------

const S1_BUBBLES: Record<string, string> = {
  da_02a_drip: "A wall! I live here now.",
  da_02b_drip: "Hello! I am on your head!",
};

const ArriveScene: React.FC<SceneProps> = ({ scene, choices }) => {
  const right = choices.valleyWay === "right";
  // Both openings mount every hook they use, so the hook list is the same on
  // every path and every frame; the path only picks which picture draws.
  const frame = useCurrentFrame();
  const dripTalking = useSpeaking(scene, "drip");
  const leftEmotion = useEmotion(scene, "drip", { da_02a_drip: "proud" }, "excited");
  const rightEmotion = useEmotion(scene, "drip", { da_02b_drip: "excited" }, "excited");
  return right ? (
    <RightOpening scene={scene} frame={frame} talking={dripTalking} emotion={rightEmotion} />
  ) : (
    <LeftOpening scene={scene} frame={frame} talking={dripTalking} emotion={leftEmotion} />
  );
};

type OpeningProps = { scene: SceneProps["scene"]; frame: number; talking: boolean; emotion: EmotionInput };

/** LEFT: rain into the river, the river into the wall. */
const LeftOpening: React.FC<OpeningProps> = ({ scene, frame, talking, emotion }) => {
  const [fallFrom, fallTo] = lineWindow(scene, "da_01a_narrator");
  const [, helloTo] = lineWindow(scene, "da_02a_drip");
  const [topFrom] = lineWindow(scene, "da_03a_narrator");
  const span = fallTo - fallFrom;
  // "…into the little river" — the rain shot; cut to the river on "and the
  // little river went downhill", wall hit on "It had hit a wall".
  const cutAt = Math.round(fallFrom + span * 0.3);
  const hitAt = Math.round(fallFrom + span * 0.7);
  const inRain = frame < cutAt;

  // Rain shot: he falls from the cloud's left side into the river.
  const fallY = lerp(frame, SETTLE_FRAMES + 6, cutAt - 4, 260, 760, Easing.in(Easing.quad));
  // River shot: he rides the trickle from the bank to the wall.
  const rideX = lerp(frame, cutAt, hitAt, 560, WALL_DRIP_X, Easing.in(Easing.quad));
  const squash = frame >= hitAt ? Math.max(0, 1 - (frame - hitAt) / 14) : 0;
  // The Beaver pops up on top on "On top of the wall was a beaver", and adds
  // his stick on "He was adding a stick".
  const stickAt = Math.round(topFrom + (lineWindow(scene, "da_03a_narrator")[1] - topFrom) * 0.6);
  // The LEFT path's `da_03a` is 8.6s shorter than its slot (sized for
  // `da_03b`). The Beaver fills it: he lifts the same top stick, looks at it,
  // and puts it back — again, and again. Busy. Placed for the last frames, so
  // the cut into `da_dam` matches.
  const fussT = frame - stickAt - 24;
  const fussing = fussT >= 0 && frame < scene.durationInFrames - 40;
  const lifting = fussing && fussT % 60 < 32;
  const placedThunk = fussing && fussT % 60 >= 32 && fussT % 60 < 40;
  // Push in on the wall after the hit, for the hello and the Beaver.
  const zoom = lerp(frame, hitAt + 4, helloTo, 1, 1.35);
  const cam = { x: 1180, y: 780, zoom };
  const dripMark: Mark = { x: rideX, y: stand("drip", POND.low + 64), scale: DRIP_SCALE, who: "drip" };

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={2} waves={false} />
      {inRain ? (
        <>
          <WideLayer>
            <ValleyWorld />
            <WildCloud x={760} y={150} w={1200} h={300} grey={0.7} />
            <RainField x0={260} x1={980} y0={260} y1={900} strength={1} count={34} />
          </WideLayer>
          <Drip
            x={470}
            y={fallY}
            scale={0.7}
            emotion="excited"
            phase={PHASE.drip}
            shadow={false}
            pose="cheer"
            look="camera"
          />
        </>
      ) : (
        <>
          <Camera cam={cam}>
            <WideLayer>
              <PondWorld level={POND.low} lodge extraStick={frame >= stickAt && !lifting ? 1 : 0} />
            </WideLayer>
            <Beaver
              x={POND_BEAVER.x}
              y={POND_BEAVER.y}
              scale={POND_BEAVER.scale}
              emotion="neutral"
              phase={PHASE.beaver}
              enter={{ at: topFrom + 4, kind: "pop" }}
              stick={(frame >= topFrom + 4 && frame < stickAt) || lifting}
              idle={placedThunk ? 2 : 0.6}
              look={lifting ? "down" : "left"}
            />
            <Camera cam={{ x: rideX + 70, y: POND.low + 40, zoom: 1 - squash * 0.12, zoomY: 1 + squash * 0.06 }}>
              <Drip
                x={rideX}
                y={dripMark.y}
                scale={DRIP_SCALE}
                emotion={emotion}
                speaking={talking}
                phase={PHASE.drip}
                shadow={false}
                feet={false}
                look={frame >= stickAt + 150 ? "camera" : frame >= topFrom ? "upRight" : "camera"}
              />
            </Camera>
          </Camera>
          <CutFlash at={cutAt} strength={0.45} />
        </>
      )}
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(cam, dripMark) }}
        text={S1_BUBBLES}
        at={{ da_02a_drip: { x: 760, y: 300, tail: "right", tailAt: project(cam, { x: WALL_DRIP_X, y: 0 }).x - 20 } }}
      />
    </AbsoluteFill>
  );
};

/** RIGHT: the tree, the Beaver's head, CRACK, the log to the wall. */
const RightOpening: React.FC<OpeningProps> = ({ scene, frame, talking, emotion }) => {
  const [fallFrom, fallTo] = lineWindow(scene, "da_01b_narrator");
  const [crackFrom, crackTo] = lineWindow(scene, "da_03b_narrator");
  const s1 = fallTo - fallFrom;
  const s3 = crackTo - crackFrom;
  const T = VALLEY.tree;
  const treeTop = T.baseY - T.h;
  const crownR = T.h * 0.3;
  const beaver = { x: T.x - 120, ground: T.baseY, scale: 0.62 };
  const beaverY = stand("beaver", beaver.ground);
  const headY = beaver.ground - 380 * beaver.scale - 8;

  // The clauses of da_01b: tree top, down a leaf, down the trunk, onto a head.
  const k = [0.05, 0.24, 0.42, 0.62, 0.78].map((u) => Math.round(fallFrom + s1 * u));
  const px = interpolate(frame, k, [T.x - 20, T.x, T.x + crownR * 1.05, T.x + 50, beaver.x], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const groundAt = interpolate(frame, k, [-400, treeTop + 30, treeTop + crownR * 1.55, T.baseY - 160, headY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "CRACK, went the tree" — early in da_03b, after "The beaver did not answer."
  const crackAt = Math.round(crackFrom + s3 * 0.17);
  const cutAt = Math.round(crackFrom + s3 * 0.4);
  const wedgeAt = Math.round(crackFrom + s3 * 0.72);
  // On "CRACK" the tree lurches: a visible tip on the sound word itself, then
  // it accelerates the rest of the way down.
  const fall =
    frame < crackAt + 4
      ? lerp(frame, crackAt - 1, crackAt + 4, 0, -14, Easing.out(Easing.quad))
      : lerp(frame, crackAt + 4, crackAt + 28, -14, -84, Easing.in(Easing.cubic));
  const inTree = frame < cutAt;
  // He hops from the head onto the trunk as it goes, and rides it down.
  const hop = clamp01((frame - crackAt) / 10);
  const rideR = 170;
  const rad = (fall * Math.PI) / 180;
  const onTrunk = { x: T.x + Math.sin(rad) * rideR, y: T.baseY - Math.cos(rad) * rideR };
  const treeDripX = frame < crackAt ? px : interpolate(hop, [0, 1], [beaver.x, onTrunk.x]);
  const treeDripG = frame < crackAt ? groundAt : interpolate(hop, [0, 1], [headY, onTrunk.y]) - Math.sin(hop * Math.PI) * 60;

  // The log shot: floats in from the left, Beaver pushing, wedged at the wall.
  const logX = lerp(frame, cutAt, wedgeAt, 300, WEDGED.x);
  const wedgeU = clamp01((frame - wedgeAt) / 16);
  const logAngle = interpolate(wedgeU, [0, 1], [0, WEDGED.angle]);
  const logY = interpolate(wedgeU, [0, 1], [POND.low + 6, WEDGED.y]);
  const climbAt = wedgeAt + 30;
  const beaverOnTop = frame >= climbAt;
  const swimX = logX - 260;

  const cam = inTree ? { x: T.x - 60, y: 690, zoom: 1.45 } : { x: 1100, y: 760, zoom: 1.15 };
  const dripG = inTree ? treeDripG : ON_LOG_GROUND + interpolate(wedgeU, [0, 1], [24, 0]);
  const dripX = inTree ? treeDripX : logX - 10;
  const dripMark: Mark = { x: dripX, y: stand("drip", dripG), scale: inTree ? 0.45 : DRIP_SCALE, who: "drip" };
  const onHead = frame >= k[4] && frame < crackAt;

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={2} waves={false} />
      {inTree ? (
        <Camera cam={cam}>
          <WideLayer>
            <ValleyWorld tree={false} />
            <g transform={`rotate(${fall} ${T.x} ${T.baseY})`}>
              <Tree x={T.x} baseY={T.baseY} h={T.h} chewed={interpolate(frame, [fallFrom, crackAt], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            </g>
          </WideLayer>
          <Beaver
            x={beaver.x}
            y={beaverY}
            scale={beaver.scale}
            emotion="neutral"
            phase={PHASE.beaver}
            chew={frame < crackAt}
            look={frame >= crackAt ? "right" : "camera"}
            eyeLife={0.3}
          />
          <Drip
            x={dripMark.x}
            y={dripMark.y}
            scale={0.45}
            emotion={emotion}
            speaking={talking}
            phase={PHASE.drip}
            shadow={false}
            pose={onHead ? "cheer" : undefined}
            look={onHead ? "camera" : "down"}
            zIndex={5}
          />
          {frame >= crackAt && frame < crackAt + 22 ? <CrackBurst x={T.x + 190} y={T.baseY - 85} from={crackAt} /> : null}
        </Camera>
      ) : (
        <>
          <Camera cam={cam}>
            <WideLayer>
              <PondWorld level={POND.low} lodge />
            </WideLayer>
            {beaverOnTop ? (
              <Beaver x={POND_BEAVER.x} y={POND_BEAVER.y} scale={POND_BEAVER.scale} emotion="neutral" phase={PHASE.beaver} look="left" enter={{ at: climbAt, kind: "pop" }} />
            ) : (
              <Beaver
                x={Math.min(swimX, WEDGED.x - 230)}
                y={stand("beaver", POND.low + 120)}
                scale={0.55}
                emotion="neutral"
                phase={PHASE.beaver}
                shadow={false}
                look="right"
              />
            )}
            <WideLayer>
              <Log x={logX} y={logY} len={WEDGED.len} angle={logAngle} />
            </WideLayer>
            <Drip
              x={dripMark.x}
              y={dripMark.y}
              scale={DRIP_SCALE}
              emotion="excited"
              phase={PHASE.drip}
              shadow={false}
              feet={false}
              pose="cheer"
              look="camera"
            />
          </Camera>
          <CutFlash at={cutAt} strength={0.45} />
        </>
      )}
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(cam, dripMark) }}
        text={S1_BUBBLES}
        at={{ da_02b_drip: { x: 1180, y: 200, tail: "left", tailAt: project(cam, { x: beaver.x, y: 0 }).x + 10 } }}
      />
    </AbsoluteFill>
  );
};

/** CRACK: a starburst of splinters at the notch. */
const CrackBurst: React.FC<{ x: number; y: number; from: number }> = ({ x, y, from }) => {
  const frame = useCurrentFrame();
  const u = clamp01((frame - from) / 22);
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", zIndex: 8 }} width={1} height={1}>
      <g opacity={1 - clamp01((u - 0.6) / 0.4)} transform={`scale(${0.95 + u * 0.35})`}>
        <path d="M 0 -90 L 22 -30 L 86 -40 L 36 6 L 70 64 L 4 34 L -50 80 L -34 16 L -96 -10 L -30 -30 Z" fill="#fff4b8" stroke="#243447" strokeWidth={8} strokeLinejoin="round" />
        <text x={0} y={14} textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight={900} fontSize={40} fill="#243447">
          CRACK
        </text>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — "What is this?" "Dam." "A what?" "Dam."
// ---------------------------------------------------------------------------

const S2_BUBBLES: Record<string, string> = {
  da_04_drip: "Hello! What is this?",
  da_05_beaver: "Dam.",
  da_06_drip: "A what?",
  da_07_beaver: "Dam.",
};

const S2_CAM = { x: 1190, y: 760, zoom: 1.35 };

const DamScene: React.FC<SceneProps> = ({ scene, choices }) => {
  const frame = useCurrentFrame();
  const right = choices.valleyWay === "right";
  const dripMark: Mark = { x: WALL_DRIP_X, y: wallDripY(right, POND.low), scale: DRIP_SCALE, who: "drip" };
  const beaverMark: Mark = POND_BEAVER;
  const cast: Cast = { drip: dripMark, beaver: beaverMark };
  const dripLook = useLookAtSpeaker(scene, cast, "drip", "upRight");
  // Ruling 8: played straight. The Beaver does not move — no emotion change,
  // no gesture; only his mouth, on his own word. Drip is the one who reacts.
  const dripEmotion = useEmotion(scene, "drip", { da_04_drip: "happy", da_06_drip: "skeptical" }, "happy", 4);
  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={2} waves={false} />
      <Camera cam={S2_CAM}>
        <WideLayer>
          <PondWorld level={POND.low} lodge extraStick={1}>
            {right ? <Log x={WEDGED.x} y={WEDGED.y} len={WEDGED.len} angle={WEDGED.angle} /> : null}
          </PondWorld>
        </WideLayer>
        <Beaver
          x={beaverMark.x}
          y={beaverMark.y}
          scale={beaverMark.scale}
          emotion="neutral"
          speaking={useSpeaking(scene, "beaver")}
          phase={PHASE.beaver}
          look="left"
          eyeLife={0}
          idle={0.4}
        />
        <Drip
          x={dripMark.x}
          y={dripMark.y + (right ? 0 : Math.sin(frame / 17) * 3)}
          scale={DRIP_SCALE}
          emotion={dripEmotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          feet={right}
          look={dripLook}
        />
      </Camera>
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(S2_CAM, dripMark), beaver: projectMark(S2_CAM, beaverMark) }}
        text={S2_BUBBLES}
        at={{
          da_04_drip: { x: 700, y: 330, tail: "right", tailAt: project(S2_CAM, { x: WALL_DRIP_X, y: 0 }).x - 30 },
          da_06_drip: { x: 760, y: 330, tail: "right", tailAt: project(S2_CAM, { x: WALL_DRIP_X, y: 0 }).x - 30 },
          da_05_beaver: { x: 1640, y: 200, tail: "left", tailAt: project(S2_CAM, { x: beaverMark.x, y: 0 }).x + 60 },
          da_07_beaver: { x: 1640, y: 200, tail: "left", tailAt: project(S2_CAM, { x: beaverMark.x, y: 0 }).x + 60 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — the teeth
// ---------------------------------------------------------------------------

const S3_BEAVER = { x: 1270, ground: 1010, scale: 1.55 };
const S3_DRIP: Mark = { x: 420, y: stand("drip", 1000), scale: 0.95, who: "drip", side: "right" };

const TeethScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [factFrom, factTo] = lineWindow(scene, "da_08_narrator");
  const span = factTo - factFrom;
  // "His teeth are orange." lands ~38% into the take; "iron" ~55%.
  const orangeAt = Math.round(factFrom + span * 0.38);
  const ironAt = Math.round(factFrom + span * 0.56);
  const by = stand("beaver", S3_BEAVER.ground);
  // Teeth in composition space: MOUTH_Y (-6) + ~20, scaled about the feet.
  const teethY = S3_BEAVER.ground - (190 - (-6 + 22)) * S3_BEAVER.scale;
  const dripEmotion = useEmotion(scene, "drip", { da_09_drip: "amazed" }, "happy", 6);
  const p = lineProgress(scene, "da_08_narrator", frame);
  return (
    <AbsoluteFill>
      {/* A portrait: plain sky and grass, nothing behind his face. */}
      <KidBackdrop variant="day" clouds={3} ground waves={false} />
      <Beaver
        x={S3_BEAVER.x}
        y={by}
        scale={S3_BEAVER.scale}
        emotion="neutral"
        phase={PHASE.beaver}
        look="camera"
        stick={p < 0.3}
        shadow
      />
      <NameArrow x={S3_BEAVER.x - 60} y={teethY + 30} label={frame < ironAt ? "ORANGE" : "IRON INSIDE"} from={orangeAt} dir="left" />
      <Drip
        x={S3_DRIP.x}
        y={S3_DRIP.y}
        scale={S3_DRIP.scale ?? 1}
        emotion={dripEmotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow
        look={frame >= orangeAt ? "right" : "camera"}
      />
      <Bubbles
        scene={scene}
        cast={{ drip: S3_DRIP }}
        text={{ da_09_drip: "No teeth. EXTREMELY impressed." }}
        at={{ da_09_drip: { x: 640, y: 300, tail: "left", tailAt: S3_DRIP.x + 40 } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4 — the river waits, and it is a pond
// ---------------------------------------------------------------------------

const PondScene: React.FC<SceneProps> = ({ scene, choices }) => {
  const frame = useCurrentFrame();
  const right = choices.valleyWay === "right";
  const [riseFrom, riseTo] = lineWindow(scene, "da_10_narrator");
  const span = riseTo - riseFrom;
  // "higher, and wider, and stiller" fills it; "It was a pond." is full;
  // "And Drip let go of the wall, and floated." floats him to his pond mark.
  const fullAt = Math.round(riseFrom + span * 0.62);
  const letGoAt = Math.round(riseFrom + span * 0.8);
  const level = lerp(frame, riseFrom + span * 0.12, fullAt, POND.low, POND.full);
  const zoom = lerp(frame, SETTLE_FRAMES + 6, fullAt, 1.35, 1);
  const camEased = { zoom, x: lerp(frame, riseFrom, fullAt, 1190, 960), y: lerp(frame, riseFrom, fullAt, 760, 540) };
  const float = clamp01((frame - letGoAt) / 40);
  const atWall = { x: WALL_DRIP_X, y: wallDripY(right, level) };
  const dripX = interpolate(Easing.inOut(Easing.quad)(float), [0, 1], [atWall.x, POND_DRIP.x]);
  const dripY = interpolate(Easing.inOut(Easing.quad)(float), [0, 1], [atWall.y, POND_DRIP.y]);
  // The log stays wedged: it is part of the wall now, and the water rises past it.
  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={camEased}>
        <WideLayer>
          <PondWorld level={level} lodge extraStick={1}>
            {/* Part of the wall now: the rising pond closes over it. */}
            {right ? (
              <g opacity={1 - clamp01((POND.low - 30 - level) / 90)}>
                <Log x={WEDGED.x} y={WEDGED.y} len={WEDGED.len} angle={WEDGED.angle} />
              </g>
            ) : null}
          </PondWorld>
        </WideLayer>
        <Beaver x={POND_BEAVER.x} y={POND_BEAVER.y} scale={POND_BEAVER.scale} emotion="neutral" phase={PHASE.beaver} look="left" />
        <Drip
          x={dripX + Math.sin(frame / 30) * 6 * float}
          y={dripY + Math.sin(frame / 17) * 4 * float}
          scale={DRIP_SCALE}
          emotion={frame > letGoAt ? "happy" : "amazed"}
          phase={PHASE.drip}
          shadow={false}
          feet={false}
          look={frame > letGoAt ? "camera" : "up"}
        />
      </Camera>
    </AbsoluteFill>
  );
};

export const DAM_SCENES: Record<string, React.FC<SceneProps>> = {
  da_arrive: ArriveScene,
  da_dam: DamScene,
  da_teeth: TeethScene,
  da_pond: PondScene,
};

export { DAM_STAND };
