import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Blobby, Drip, KidBackdrop, kidTheme, mixHex, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
// Episode one's Scene 25 (downhill), cross-imported unchanged.
import {
  RiverBand,
  RiverCrowd,
  Tributary,
  Valley,
  riverCentre,
} from "../../water-cycle/scenes/act3";
import {
  Bubbles,
  Camera,
  PHASE,
  SETTLE_FRAMES,
  WideLayer,
  lineWindow,
  projectMark,
  stand,
  useEmotion,
  type Mark,
  type SceneProps,
} from "./common";

// STREAM — shared trunk 2. Both ways down arrive here: the same mountain
// stream, the same crowd, Drip in it. On a snow path it is a spring morning
// after a whole winter; on a rain path it is four seconds after the landing.
// The picture is identical on both (the merge reconciles on place and cast,
// docs/CYOA.md amendment 1); the time gap is paid by ONE line, `st_02`, whose
// two tagged variants Video.tsx swaps in.
//
// Then the fork, drawn plainly — a river bending right, a dark sink-hole left —
// and the third question.

const S1_MERGE = 360;
const S1_SCALE = 0.85;
/** Where Drip sits on screen; the world slides under him (ep 1's trick). */
const S1_ANCHOR = { x: 830, y: 520 };

const S1_BUBBLES: Record<string, string> = {
  st_02a_drip: "Best waterslide of my LIFE!",
  st_02b_drip: "A WHOLE winter! I looked great.",
};

const DownhillScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [rollFrom, rollTo] = lineWindow(scene, "st_01_narrator");
  // "…A trickle met a trickle, and that was a stream." — the pull-back lands
  // on the merge, late in the take. Everything before it starts flat, so the
  // opening frames are a hold.
  const mergeAt = Math.round(rollFrom + (rollTo - rollFrom) * 0.72);
  const zoom = interpolate(frame, [SETTLE_FRAMES, mergeAt - 20, mergeAt + 40], [1.75, 1.75, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const worldX = interpolate(frame, [SETTLE_FRAMES, mergeAt + 40, scene.durationInFrames], [140, S1_MERGE + 120, 620], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const worldY = riverCentre(worldX);
  const cam = { x: worldX, y: worldY, zoom, dx: S1_ANCHOR.x - worldX, dy: S1_ANCHOR.y - worldY };
  const mark: Mark = { x: worldX, y: stand("drip", worldY + 30), scale: S1_SCALE, who: "drip", side: "right" };

  const emotion = useEmotion(scene, "drip", { st_02a_drip: "excited", st_02b_drip: "proud" }, "happy");

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={cam}>
        <WideLayer>
          <Valley />
          <RiverBand />
          <Tributary at={S1_MERGE} from={-380} />
          <RiverCrowd fromX={S1_MERGE + 40} toX={2600} rows={2} />
        </WideLayer>
        <Drip
          x={worldX}
          y={stand("drip", worldY + 30)}
          scale={S1_SCALE}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          idle={1.2}
          look="right"
        />
      </Camera>
      <Bubbles scene={scene} cast={{ drip: projectMark(cam, mark) }} text={S1_BUBBLES} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — the fork
// ---------------------------------------------------------------------------

/** The junction, in screen px: the stream comes in from the top and splits. */
const FORK = { x: 900, y: 640 };
const S2_SCALE = 0.95;
const S2_DRIP = { x: FORK.x, y: stand("drip", FORK.y + 70) };

/** The incoming stream and both ways out, as centre lines. */
const IN_PATH = `M 260 -80 C 420 200 760 360 ${FORK.x} ${FORK.y}`;
const RIVER_PATH = `M ${FORK.x} ${FORK.y} C 1120 760 1360 760 1560 700 S 1900 560 2140 600`;
const HOLE = { x: 470, y: 900 };
const HOLE_PATH = `M ${FORK.x} ${FORK.y} C 780 760 620 860 ${HOLE.x + 40} ${HOLE.y - 10}`;

const S2_BUBBLES: Record<string, string> = {
  st_04_drip: "Long way? Secret way?",
};

const ForkScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [forkFrom, forkTo] = lineWindow(scene, "st_03_narrator");
  const [pickFrom, pickTo] = lineWindow(scene, "st_04_drip");
  const [askFrom] = lineWindow(scene, "st_05_narrator");
  const span = forkTo - forkFrom;
  // "One way went along the ground, down to the river" lights the right-hand
  // way; "The other way went straight down, into the ground" the left. Both
  // stay lit for the rest of the scene: the card's options must be on screen.
  const riverOn = interpolate(frame, [forkFrom + span * 0.14, forkFrom + span * 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const holeOn = interpolate(frame, [forkFrom + span * 0.56, forkFrom + span * 0.72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = frame > askFrom ? 0.5 + 0.5 * Math.sin((frame - askFrom) / 11) : 0;

  const settleAt = askFrom - 6;
  const mapped = useEmotion(scene, "drip", { st_04_drip: "amazed" }, "happy", 4);
  const emotion: EmotionInput =
    frame >= settleAt ? { emotion: "happy", from: "amazed", at: settleAt, frames: 8 } : mapped;
  const half = pickFrom + (pickTo - pickFrom) * 0.45;
  const toHole = { x: -0.8, y: 0.55 };
  const look =
    frame > askFrom - 10
      ? "camera"
      : frame >= pickFrom && frame < half
        ? "right"
        : frame >= half && frame < pickTo
          ? toHole
          : frame >= forkFrom + span * 0.56
            ? toHole
            : frame >= forkFrom + span * 0.14
              ? "right"
              : "camera";

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WideLayer>
        {/* The valley floor, seen from above like episode one's downhill. */}
        <rect x={-1200} y={200} width={4400} height={1500} fill={kidTheme.grass} />
        <path d="M -1200 200 Q 400 120 1200 210 Q 2200 300 3200 180 L 3200 260 L -1200 300 Z" fill={kidTheme.grassDark} opacity={0.5} />
        {/* Trees along the river side: "past everybody" has somewhere to be. */}
        {[
          [1300, 520],
          [1720, 470],
          [1900, 820],
          [1240, 900],
        ].map(([x, y]) => (
          <g key={`${x},${y}`} transform={`translate(${x} ${y})`}>
            <rect x={-14} y={0} width={28} height={90} rx={13} fill={kidTheme.earth} />
            <circle cx={0} cy={-30} r={70} fill={kidTheme.grassDark} />
            <circle cx={-26} cy={-50} r={42} fill={kidTheme.grass} />
          </g>
        ))}
        {/* The sink-hole: dark, stony, and going down. */}
        <SinkHole x={HOLE.x} y={HOLE.y} glow={holeOn * (0.4 + 0.6 * glow)} />
        {/* The water: incoming stream, then both ways, the lit one brighter. */}
        <Channel d={IN_PATH} w={78} lit={1} />
        <Channel d={RIVER_PATH} w={96 + riverOn * 20} lit={riverOn} glow={riverOn * glow} />
        <Channel d={HOLE_PATH} w={64} lit={holeOn} glow={holeOn * glow} />
        {/* Drops already going each way, so both are clearly somewhere to go. */}
        <PathCrowd d="river" on={riverOn} frame={frame} />
        <PathCrowd d="hole" on={holeOn} frame={frame} />
      </WideLayer>
      <Drip
        x={S2_DRIP.x}
        y={S2_DRIP.y}
        scale={S2_SCALE}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={0.9}
        look={look}
      />
      <Bubbles
        scene={scene}
        cast={{ drip: { ...S2_DRIP, scale: S2_SCALE, who: "drip", side: "right" } }}
        text={S2_BUBBLES}
        at={{ st_04_drip: { x: 1300, y: 260, tail: "left", tailAt: S2_DRIP.x + 60 } }}
      />
    </AbsoluteFill>
  );
};

/** One channel of water along a centre line: bank, water, and current. */
const Channel: React.FC<{ d: string; w: number; lit: number; glow?: number }> = ({ d, w, lit, glow = 0 }) => {
  const frame = useCurrentFrame();
  const water = mixHex(mixHex(kidTheme.water, kidTheme.grass, 0.45), kidTheme.water, lit);
  return (
    <g>
      {glow > 0.01 ? (
        <path d={d} stroke={kidTheme.star} strokeWidth={w + 70} strokeLinecap="round" fill="none" opacity={0.25 * glow} />
      ) : null}
      <path d={d} stroke={kidTheme.waterDark} strokeWidth={w + 22} strokeLinecap="round" fill="none" />
      <path d={d} stroke={water} strokeWidth={w} strokeLinecap="round" fill="none" />
      <path
        d={d}
        stroke={kidTheme.waterLight}
        strokeWidth={w * 0.14}
        strokeLinecap="round"
        strokeDasharray="40 120"
        strokeDashoffset={-frame * 3}
        fill="none"
        opacity={0.8 * lit}
      />
    </g>
  );
};

/** The way into the ground: a dark mouth ringed with stones. */
const SinkHole: React.FC<{ x: number; y: number; glow: number }> = ({ x, y, glow }) => (
  <g>
    {glow > 0.01 ? <ellipse cx={x} cy={y} rx={260} ry={140} fill={kidTheme.star} opacity={0.22 * glow} /> : null}
    <ellipse cx={x} cy={y} rx={200} ry={104} fill={kidTheme.earth} stroke={kidTheme.ink} strokeWidth={10} />
    <ellipse cx={x} cy={y + 8} rx={160} ry={78} fill="#2b2233" />
    <ellipse cx={x} cy={y + 20} rx={110} ry={46} fill="#140f1c" />
    {[-170, -110, -30, 60, 140, 180].map((dx, i) => (
      <ellipse
        key={dx}
        cx={x + dx}
        cy={y - 78 + Math.abs(dx) * 0.33 + (i % 2) * 10}
        rx={30}
        ry={20}
        fill="#8c8a94"
        stroke={kidTheme.ink}
        strokeWidth={6}
      />
    ))}
  </g>
);

/** A few drops riding each way out, from the fork. */
const PathCrowd: React.FC<{ d: "river" | "hole"; on: number; frame: number }> = ({ d, on, frame }) => {
  if (on <= 0.02) return null;
  const n = d === "river" ? 5 : 3;
  return (
    <g opacity={on}>
      {Array.from({ length: n }, (_, i) => {
        const t = ((frame / (d === "river" ? 160 : 220) + i / n) % 1);
        // Hand-fitted to RIVER_PATH / HOLE_PATH.
        const x = d === "river" ? FORK.x + 120 + t * 1100 : FORK.x - 120 - t * 300;
        const y = d === "river" ? FORK.y + 90 + Math.sin(t * 3) * 30 - t * 60 : FORK.y + 120 + t * 160;
        return (
          <Blobby
            key={i}
            x={x}
            y={y}
            scale={0.4}
            phase={i * 1.7 + (d === "river" ? 0 : 3)}
            mood={d === "hole" ? "surprised" : "happy"}
            opacity={d === "hole" ? 1 - t * 0.8 : 1}
          />
        );
      })}
    </g>
  );
};

export const STREAM_SCENES: Record<string, React.FC<SceneProps>> = {
  st_downhill: DownhillScene,
  st_fork: ForkScene,
};
