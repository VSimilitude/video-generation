import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Drip, KidBackdrop, kidTheme } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import { HeadlandWorld } from "../../water-cycle/scenes/act3";
import { Beaver } from "./beaver";
import {
  Bubbles,
  Camera,
  CutFlash,
  PHASE,
  WideLayer,
  lineWindow,
  project,
  projectMark,
  stand,
  type Mark,
  type SceneProps,
} from "./common";
import { FloatDrops, POND_BEAVER, POND_DRIP } from "./pond";
import { POND, PondWorld } from "./props";

// OVER — over the top. The pond spills at the top of the wall; Drip rides the
// spill over, down a little waterfall, saluting all the way (rain-slide energy,
// shorter). The Beaver stays on the wall behind him, small and dead still, for
// his "Busy." Then the river, and the headland reveal (DripChooses' `ri_08`
// move) on "The sea is at the end of this part!".

const ease = Easing.inOut(Easing.quad);
const lerp = (f: number, a: number, b: number, from: number, to: number, easing = ease) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** The spill's path, in PondWorld: across the top, over, down the far face. */
function spillPoint(u: number): { x: number; ground: number } {
  const x0 = POND.damTop[1] - 10;
  const y0 = POND.damTopY - 4;
  if (u < 0.3) {
    const t = u / 0.3;
    // To the far end of the lip, past the Beaver, so he never covers a face.
    return { x: POND_DRIP.x + (x0 + 80 - POND_DRIP.x) * t, ground: POND.full + 64 - (POND.full + 64 - y0 - 24) * t };
  }
  const t = (u - 0.3) / 0.7;
  return { x: x0 + 80 + 40 * t, ground: y0 + 24 + (POND.downY + 20 - y0 - 24) * Easing.in(Easing.quad)(t) };
}

// ---------------------------------------------------------------------------
// Scene 1 — over the top, and "Busy."
// ---------------------------------------------------------------------------

const S1_BUBBLES: Record<string, string> = {
  ov_02_drip: "Bye Beaver! It did not work!",
  ov_03_beaver: "Busy.",
};

const SpillScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [goFrom, goTo] = lineWindow(scene, "ov_01_narrator");
  const [byeFrom, byeTo] = lineWindow(scene, "ov_02_drip");
  // To the lip during "over the top of the dam"; over and down on WHEEEE.
  const u = interpolate(frame, [goFrom + 10, goFrom + (goTo - goFrom) * 0.6, byeFrom, byeFrom + 34], [0, 0.3, 0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p = spillPoint(u);
  // Then he floats off downstream a little, and the camera finds the Beaver.
  const away = lerp(frame, byeFrom + 34, byeTo + 4, 0, 640, Easing.in(Easing.quad));
  const x = p.x + away;
  const cam = {
    x: lerp(frame, goFrom, goFrom + (goTo - goFrom) * 0.6, 960, 1300),
    y: lerp(frame, goFrom, goFrom + (goTo - goFrom) * 0.6, 540, 700),
    zoom: lerp(frame, goFrom, goFrom + (goTo - goFrom) * 0.6, 1, 1.3),
  };
  const mark: Mark = { x, y: stand("drip", p.ground), scale: 0.6, who: "drip" };
  const beaverMark: Mark = POND_BEAVER;
  const falling = u > 0.3;
  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={cam}>
        <WideLayer>
          <PondWorld level={POND.full} lodge spill={1} extraStick={2}>
            <FloatDrops />
          </PondWorld>
        </WideLayer>
        {/* Behind him, small, dead still — the deadpan is the stillness. */}
        <Beaver
          x={beaverMark.x}
          y={beaverMark.y}
          scale={beaverMark.scale}
          emotion="neutral"
          speaking={useSpeaking(scene, "beaver")}
          phase={PHASE.beaver}
          idle={frame >= byeTo ? 0 : 0.4}
          eyeLife={0}
          look="camera"
        />
        <Drip
          x={x}
          y={mark.y}
          scale={0.6}
          emotion={falling ? "excited" : "happy"}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          feet={false}
          pose={falling ? "cheer" : undefined}
          look={frame >= byeTo ? { x: -0.8, y: -0.5 } : "camera"}
          zIndex={5}
        />
      </Camera>
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(cam, mark), beaver: projectMark(cam, beaverMark) }}
        text={S1_BUBBLES}
        at={{
          ov_02_drip: { x: 760, y: 260, tail: "right", tailAt: project(cam, { x: beaverMark.x, y: 0 }).x - 90 },
          ov_03_beaver: { x: project(cam, { x: beaverMark.x, y: 0 }).x - 260, y: 250, tail: "right", tailAt: project(cam, { x: beaverMark.x, y: 0 }).x - 30 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — the river again, and the sea at the end of this part
// ---------------------------------------------------------------------------

const S2_ANCHOR = { x: 820, y: 600 };
const S2_SCALE = 0.9;

const RiverScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [knowFrom, knowTo] = lineWindow(scene, "ov_05_drip");
  // Along the river during ov_04; round the corner and the pull-out to the
  // open sea over ov_05 (ri_08's move), settled before the seam.
  const worldX = interpolate(frame, [knowFrom, knowTo + 20], [520, 1300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const worldY = interpolate(frame, [knowFrom, knowTo + 20], [1120, 800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const zoom = lerp(frame, knowFrom + (knowTo - knowFrom) * 0.4, knowTo + 20, 1.5, 0.62);
  const cam = { x: worldX, y: worldY, zoom, dx: S2_ANCHOR.x - worldX, dy: S2_ANCHOR.y - worldY };
  const mark: Mark = { x: worldX, y: stand("drip", worldY + 26), scale: S2_SCALE, who: "drip", side: "right" };
  const amazed = frame > knowTo - 6;
  const onRiver = frame < knowFrom - 4;
  // Hoisted: the Drip below is conditional, and a hook must not be.
  const talking = useSpeaking(scene, "drip");
  return (
    <AbsoluteFill>
      {onRiver ? <RiverRide scene={scene} /> : <HeadlandWorld cam={cam} />}
      {onRiver ? null : <CutFlash at={knowFrom - 4} strength={0.45} />}
      <Camera cam={cam}>
        {onRiver ? null : <Drip
          x={worldX}
          y={mark.y}
          scale={S2_SCALE}
          emotion={amazed ? { emotion: "amazed", from: "excited", at: knowTo - 6, frames: 8 } : frame >= knowFrom - 6 ? "excited" : "happy"}
          speaking={talking}
          phase={PHASE.drip}
          shadow={false}
          idle={1.2}
          pose={frame >= knowFrom && frame < knowTo ? "cheer" : undefined}
          look={amazed ? "right" : "camera"}
        />}
      </Camera>
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(cam, mark) }}
        text={{ ov_05_drip: "I know this part! The SEA!" }}
        at={{ ov_05_drip: { x: 1340, y: 230, tail: "left", tailAt: S2_ANCHOR.x + 80 } }}
      />
    </AbsoluteFill>
  );
};

/**
 * ov_04: "Down a little waterfall, into the river again, and the river did
 * what rivers do" — a top-down ride down a winding river through fields. Drip
 * stays put on screen; the world flows past him (ep 1's downhill trick).
 */
const RiverRide: React.FC<{ scene: SceneProps["scene"] }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [downFrom] = lineWindow(scene, "ov_04_narrator");
  const t = Math.max(0, frame - downFrom * 0);
  const scroll = t * 7;
  const bend = (y: number) => 760 + Math.sin((y + scroll) / 260) * 170;
  const pts = Array.from({ length: 30 }, (_, i) => -200 + i * 60);
  const d = pts.map((y, i) => `${i ? "L" : "M"} ${bend(y).toFixed(1)} ${y}`).join(" ");
  const dripX = bend(560);
  return (
    <AbsoluteFill style={{ background: kidTheme.grass }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 14 }, (_, i) => {
          const y = ((i * 211 - scroll) % 1400 + 1400) % 1400 - 160;
          const side = i % 2 ? -1 : 1;
          const x = bend(y) + side * (300 + (i % 3) * 120);
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r={54} fill={kidTheme.grassDark} stroke={kidTheme.ink} strokeWidth={7} />
              <circle cx={-14} cy={-12} r={20} fill="#8be08f" opacity={0.6} />
            </g>
          );
        })}
        <path d={d} stroke={kidTheme.waterDeep} strokeWidth={250} fill="none" strokeLinecap="round" />
        <path d={d} stroke={kidTheme.water} strokeWidth={220} fill="none" strokeLinecap="round" />
        <path d={d} stroke={kidTheme.waterLight} strokeWidth={12} strokeDasharray="40 70" strokeDashoffset={-scroll} fill="none" strokeLinecap="round" opacity={0.85} />
      </svg>
      <Drip x={dripX} y={stand("drip", 640)} scale={0.8} emotion="happy" phase={PHASE.drip} shadow={false} feet={false} look="camera" />
    </AbsoluteFill>
  );
};

export const OVER_SCENES: Record<string, React.FC<SceneProps>> = {
  ov_spill: SpillScene,
  ov_river: RiverScene,
};
