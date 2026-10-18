import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Drip, KidBackdrop, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import { Beaver } from "./beaver";
import {
  Bubbles,
  Camera,
  PHASE,
  WideLayer,
  lineWindow,
  projectMark,
  stand,
  useEmotion,
  type Mark,
  type SceneProps,
} from "./common";
import { VALLEY, ValleyWorld, WaySign, WildCloud } from "./props";

// VALLEY — the first first-branch. Morning; the cloud with no manager hangs low
// and heavy over the green valley. Under its LEFT half, the little river; under
// its RIGHT half, a tall tree with the Beaver at its foot, mid-chew. Two sides
// to fall off, drawn as LEFT / RIGHT furniture on the cloud's two sides during
// `va_03`, both pulsing under the half-choice card.

const CLOUD = { x: 960, y: 360, w: 1300, h: 330 };
const DRIP: Mark = { x: 960, y: stand("drip", 356), scale: 0.5, who: "drip" };
const BEAVER_AT = { x: VALLEY.tree.x - 120, ground: VALLEY.tree.baseY, scale: 0.42 };

// ---------------------------------------------------------------------------
// Scene 1 — heavy, grey, and nobody had told it what to do
// ---------------------------------------------------------------------------

const S1_BUBBLES: Record<string, string> = {
  va_02_drip: "I am in charge now!",
};

const CloudScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [hangFrom, hangTo] = lineWindow(scene, "va_01_narrator");
  const [askFrom] = lineWindow(scene, "va_02_drip");
  // Open close on the cloud; pull back over "hanging over the green valley"
  // to the wide the half-choice will be asked on.
  const zoom = interpolate(frame, [hangFrom + 20, hangTo - 10], [1.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cam = { x: 960, y: interpolate(zoom, [1, 1.3], [540, 380]), zoom };
  const emotion = useEmotion(scene, "drip", { va_02_drip: "excited" }, "happy", 6);
  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={2} waves={false} />
      <Camera cam={cam}>
        <WideLayer>
          <ValleyWorld />
          <WildCloud x={CLOUD.x} y={CLOUD.y} w={CLOUD.w} h={CLOUD.h} grey={0.72} faces={16} />
        </WideLayer>
        <Beaver x={BEAVER_AT.x} y={stand("beaver", BEAVER_AT.ground)} scale={BEAVER_AT.scale} emotion="neutral" phase={PHASE.beaver} chew look="right" />
        <Drip
          x={DRIP.x}
          y={DRIP.y}
          scale={DRIP.scale ?? 1}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          pose={frame >= askFrom ? "cheer" : undefined}
          look={frame >= askFrom + 40 ? "down" : "camera"}
        />
      </Camera>
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(cam, DRIP) }}
        text={S1_BUBBLES}
        at={{ va_02_drip: { x: 1330, y: 130, tail: "left", tailAt: 1010 } }}
        maxWidth={680}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — river, or tree, and the half-choice
// ---------------------------------------------------------------------------

const S2_BUBBLES: Record<string, string> = {
  va_04_drip: "River? Or tree?",
};

const SidesScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [sideFrom, sideTo] = lineWindow(scene, "va_03_narrator");
  const [pickFrom, pickTo] = lineWindow(scene, "va_04_drip");
  const [askFrom] = lineWindow(scene, "va_05_narrator");
  const span = sideTo - sideFrom;
  // "Under the left side … the little river." / "Under the right side … a tree".
  const leftAt = Math.round(sideFrom + span * 0.04);
  const rightAt = Math.round(sideFrom + span * 0.36);
  const left = spring({ frame: frame - leftAt, fps, config: { damping: 11, mass: 0.7 } });
  const right = spring({ frame: frame - rightAt, fps, config: { damping: 11, mass: 0.7 } });
  const glow = frame > askFrom ? 0.5 + 0.5 * Math.sin((frame - askFrom) / 11) : 0;
  const eyes =
    frame > askFrom - 10
      ? ("camera" as const)
      : frame >= pickFrom && frame < pickFrom + (pickTo - pickFrom) * 0.25
        ? { x: -0.8, y: 0.7 }
        : frame >= pickFrom && frame < pickFrom + (pickTo - pickFrom) * 0.45
          ? { x: 0.8, y: 0.7 }
          : frame >= rightAt && frame < pickFrom
            ? { x: 0.8, y: 0.7 }
            : frame >= leftAt && frame < pickFrom
              ? { x: -0.8, y: 0.7 }
              : ("down" as const);
  const settleAt = askFrom - 6;
  const mapped = useEmotion(scene, "drip", { va_04_drip: "amazed" }, "happy", 4);
  const emotion: EmotionInput = frame >= settleAt ? { emotion: "happy", from: "amazed", at: settleAt, frames: 8 } : mapped;
  // The Beaver chews the whole time — he is busy — but stops dead for the
  // held frames under the card (nothing mid-move on a hold).
  const chewing = frame < askFrom;
  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={2} waves={false} />
      <WideLayer>
        <ValleyWorld />
        <WildCloud x={CLOUD.x} y={CLOUD.y} w={CLOUD.w} h={CLOUD.h} grey={0.72} faces={16} />
      </WideLayer>
      <Beaver x={BEAVER_AT.x} y={stand("beaver", BEAVER_AT.ground)} scale={BEAVER_AT.scale} emotion="neutral" phase={PHASE.beaver} chew={chewing} look="right" />
      <Drip
        x={DRIP.x}
        y={DRIP.y}
        scale={DRIP.scale ?? 1}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        look={eyes}
      />
      <WaySign x={250} y={340} s={left} glow={glow} label="LEFT" arrow="left" />
      <WaySign x={1670} y={340} s={right} glow={glow} label="RIGHT" arrow="right" />
      <Bubbles
        scene={scene}
        cast={{ drip: DRIP }}
        text={S2_BUBBLES}
        at={{ va_04_drip: { x: 1340, y: 120, tail: "left", tailAt: DRIP.x + 50 } }}
        maxWidth={680}
      />
    </AbsoluteFill>
  );
};

export const VALLEY_SCENES: Record<string, React.FC<SceneProps>> = {
  va_cloud: CloudScene,
  va_sides: SidesScene,
};
