import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Drip, KidBackdrop, kidTheme, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import { Beaver } from "./beaver";
import {
  Bubbles,
  PHASE,
  WideLayer,
  lineProgress,
  lineWindow,
  stand,
  useEmotion,
  useLookAtSpeaker,
  type Cast,
  type Mark,
  type SceneProps,
} from "./common";
import { DAM_STAND, DROP_PATH, ObsidianSlab, POND, PondWorld, WaySign } from "./props";

// POND — the shared trunk both first branches fold into: the beaver's pond, in
// profile, the same drawing (PondWorld) the dam and the race end on.
//
// The ONE picture that reads the path: on mountain paths the obsidian slab sits
// on the near (left) shore with its cooled lava trail and the volcano behind;
// on valley paths the shore is bare (brief ruling 3). The Beaver's first words
// are the clip-swap variant (`po_01a/b`), staged identically.
//
// Then the two ways out, drawn as signs before the card asks: OVER ↑ at the
// spill on top of the wall, THROUGH → at the lodge's underwater door.

/** Where Drip floats in every pond shot: mid-pond, right of the lodge. */
export const POND_DRIP: Mark = { x: 1090, y: stand("drip", POND.full + 64), scale: 0.6, who: "drip", side: "left" };
export const POND_BEAVER: Mark = { x: DAM_STAND.x, y: stand("beaver", DAM_STAND.y), scale: 0.62, who: "beaver", side: "left" };

/** The mountain paths' leftovers on the near shore: slab, trail, the volcano. */
export const MountainLeftovers: React.FC<{ on: boolean }> = ({ on }) =>
  on ? <ObsidianSlab x={POND.slab.x} y={POND.slab.y} cool={1} scale={0.9} /> : null;

// ---------------------------------------------------------------------------
// Scene 1 — the shore, and the Beaver, who is busy
// ---------------------------------------------------------------------------

const S1_BUBBLES: Record<string, string> = {
  po_01a_beaver: "You again. Busy.",
  po_01b_beaver: "Shiny. Mine.",
  po_03_drip: "Your wall is in the way.",
  po_04_beaver: "Busy.",
};

const ShoreScene: React.FC<SceneProps> = ({ scene, choices }) => {
  const frame = useCurrentFrame();
  const mountain = choices.where === "mountain";
  const turns = scene.turns ?? [];
  const helloFrom = turns[0]?.from ?? 0;
  const [busyFrom] = lineWindow(scene, "po_02_narrator");
  // He adds a stick during the narrator's list ("…very busy"), and is back on
  // his mark, still, for "Busy." — the button gets nothing.
  const stickU = lineProgress(scene, "po_02_narrator", frame);
  const working = frame >= busyFrom && stickU < 0.85;
  const cast: Cast = { drip: POND_DRIP, beaver: POND_BEAVER };
  const dripLook = useLookAtSpeaker(scene, cast, "drip", "right");
  const beaverTalking = useSpeaking(scene, "beaver");
  const beaverEmotion = useEmotion(scene, "beaver", {}, "neutral");
  // On the shiny line he looks at the slab; otherwise at whoever talks.
  const beaverLook = useLookAtSpeaker(scene, cast, "beaver", "left");
  const shiny = mountain && frame >= helloFrom - 6 && frame < busyFrom;
  const dripEmotion = useEmotion(scene, "drip", { po_03_drip: "happy" }, "happy");

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WideLayer>
        <PondWorld level={POND.full} lodge volcano={mountain ? 0.9 : 0} lavaTrail={mountain ? 1 : 0} extraStick={frame > busyFrom + 60 ? 2 : 1}>
          <MountainLeftovers on={mountain} />
          <FloatDrops />
        </PondWorld>
      </WideLayer>
      <Beaver
        x={POND_BEAVER.x}
        y={POND_BEAVER.y}
        scale={POND_BEAVER.scale}
        emotion={beaverEmotion}
        speaking={beaverTalking}
        phase={PHASE.beaver}
        stick={working}
        chew={false}
        look={shiny ? { x: -1, y: 0.25 } : beaverLook}
      />
      <Drip
        x={POND_DRIP.x + Math.sin(frame / 30) * 6}
        y={POND_DRIP.y + Math.sin(frame / 17) * 4}
        scale={POND_DRIP.scale}
        emotion={dripEmotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        feet={false}
        look={dripLook}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S1_BUBBLES}
        at={{
          po_01a_beaver: { x: 1460, y: 250, tail: "left", tailAt: POND_BEAVER.x - 10 },
          po_01b_beaver: { x: 1460, y: 250, tail: "left", tailAt: POND_BEAVER.x - 10 },
          po_04_beaver: { x: 1460, y: 250, tail: "left", tailAt: POND_BEAVER.x - 10 },
          po_03_drip: { x: 820, y: 300, tail: "right", tailAt: POND_DRIP.x - 10 },
        }}
      />
    </AbsoluteFill>
  );
};

/** A few other drops floating in the pond, waiting — it is all drops. */
export const FloatDrops: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g>
      {[420, 560, 1200].map((x, i) => (
        <path
          key={x}
          transform={`translate(${x + Math.sin(frame / 26 + i) * 6} ${POND.full + 14 + Math.sin(frame / 15 + i * 2) * 3}) scale(1.1)`}
          d={DROP_PATH}
          fill={kidTheme.waterLight}
          stroke={kidTheme.waterDeep}
          strokeWidth={4}
          opacity={i === 0 || i === 1 ? 0 : 0.9}
        />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — two ways out, and the question
// ---------------------------------------------------------------------------

const S2_BUBBLES: Record<string, string> = {
  po_07_drip: "Over? Or through? I CANNOT PICK.",
};

const ExitsScene: React.FC<SceneProps> = ({ scene, choices }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mountain = choices.where === "mountain";
  const [waysFrom, waysTo] = lineWindow(scene, "po_06_narrator");
  const [pickFrom, pickTo] = lineWindow(scene, "po_07_drip");
  const [askFrom] = lineWindow(scene, "po_08_narrator");
  const [waitFrom, waitTo] = lineWindow(scene, "po_05_narrator");
  const span = waysTo - waysFrom;
  const overAt = Math.round(waysFrom + span * 0.04);
  const throughAt = Math.round(waysFrom + span * 0.42);
  const over = spring({ frame: frame - overAt, fps, config: { damping: 11, mass: 0.7 } });
  const through = spring({ frame: frame - throughAt, fps, config: { damping: 11, mass: 0.7 } });
  // "It makes the water WAIT": the pond is already full; a soft shimmer on the
  // surface, and on "a way out" the first trickle starts over the top.
  const spill = interpolate(frame, [waitFrom + (waitTo - waitFrom) * 0.6, overAt + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const door = interpolate(frame, [throughAt, throughAt + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = frame > askFrom ? 0.5 + 0.5 * Math.sin((frame - askFrom) / 11) : 0;

  const dripEyes =
    frame > askFrom - 10
      ? "camera"
      : frame >= pickFrom && frame < pickFrom + (pickTo - pickFrom) * 0.35
        ? ("upRight" as const)
        : frame >= pickFrom && frame < pickTo
          ? ({ x: -0.8, y: 0.6 } as const)
          : frame >= throughAt && frame < pickFrom
            ? ({ x: -0.8, y: 0.6 } as const)
            : frame >= overAt && frame < pickFrom
              ? ("upRight" as const)
              : ("camera" as const);
  const settleAt = askFrom - 6;
  const mapped = useEmotion(scene, "drip", { po_07_drip: "amazed" }, "happy", 4);
  const emotion: EmotionInput =
    frame >= settleAt ? { emotion: "happy", from: "amazed", at: settleAt, frames: 8 } : mapped;

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WideLayer>
        <PondWorld level={POND.full} lodge door={door} spill={spill} volcano={mountain ? 0.9 : 0} lavaTrail={mountain ? 1 : 0} extraStick={2}>
          <MountainLeftovers on={mountain} />
          <FloatDrops />
        </PondWorld>
      </WideLayer>
      <Beaver
        x={POND_BEAVER.x}
        y={POND_BEAVER.y}
        scale={POND_BEAVER.scale}
        emotion="neutral"
        phase={PHASE.beaver}
        look="left"
        eyeLife={0.4}
      />
      <Drip
        x={POND_DRIP.x + Math.sin(frame / 30) * 6}
        y={POND_DRIP.y + Math.sin(frame / 17) * 4}
        scale={POND_DRIP.scale}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        feet={false}
        look={dripEyes}
      />
      <WaySign x={1710} y={360} s={over} glow={glow} label="OVER" arrow="up" />
      <WaySign x={405} y={820} s={through} glow={glow} label="THROUGH" arrow="right" />
      <Bubbles
        scene={scene}
        cast={{ drip: POND_DRIP }}
        text={S2_BUBBLES}
        at={{ po_07_drip: { x: 980, y: 240, tail: "right", tailAt: POND_DRIP.x - 10 } }}
      />
    </AbsoluteFill>
  );
};

export const POND_SCENES: Record<string, React.FC<SceneProps>> = {
  po_shore: ShoreScene,
  po_exits: ExitsScene,
};
