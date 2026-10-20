import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Cloudia, Drip, KidBackdrop, mixHex, kidTheme } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
// Episode one's check-out, waterslide and mountain, cross-imported unchanged.
import {
  CheckOutLever,
  DropStreaks,
  HotelCeiling,
  HotelFloor,
  MountainPeak,
  PlungeWorld,
  S22_FLOOR,
  S24_GROUND,
  Splash,
  TinyFlag,
} from "../../water-cycle/scenes/act3";
import {
  Bubbles,
  Camera,
  PHASE,
  WideLayer,
  lineProgress,
  lineWindow,
  midOf,
  stand,
  useEmotion,
  useLookAtSpeaker,
  type Cast,
  type SceneProps,
} from "./common";

// RAIN — the fast way down. Three scenes, all of them episode one's (Scenes
// 22–24), compressed: the floor goes, the best waterslide ever built (with one
// loop-the-loop), and the landing on the mountain he does not get to keep.
//
// Branch segments carry no variants (brief ruling 2): this plays identically
// whichever way Drip came up.

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------------------
// Scene 1 — everybody out
// ---------------------------------------------------------------------------

const S1_DRIP = { x: 700, y: stand("drip", S22_FLOOR) };
const S1_CLOUDIA = { x: 1380, y: stand("cloudia", S22_FLOOR) };
const S1_CLOUDIA_SCALE = 0.95;
const S1_LEVER = { x: 1660, y: S22_FLOOR };

/** Where in `ra_02_drip` ("Oh, no. Yippee!") the fall starts: just before "Yippee". */
const DROP_AT_PROGRESS = 0.53;

const S1_BUBBLES: Record<string, string> = {
  ra_01_cloudia: "Everybody OUT! There is no floor.",
  ra_02_drip: "Ohhh nooo. YIPPEE!",
};

const DropScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [outFrom, outTo] = lineWindow(scene, "ra_01_cloudia");
  // He hangs over the hole through "Oh, no." and drops on "Yippee": the take's
  // second word starts ~57% in, so the fall starts just ahead of it and the
  // delighted word lands while he is still in frame, mid-drop. Audio-driven —
  // a recut of ra_02 moves the drop with it.
  const [shoutFrom, shoutTo] = lineWindow(scene, "ra_02_drip");
  const dropAt = Math.round(shoutFrom + (shoutTo - shoutFrom) * DROP_AT_PROGRESS);

  // She hauls on "Mind the gap", and the floor goes on "There is no floor."
  const pull = clamp01((lineProgress(scene, "ra_01_cloudia", frame) - 0.3) / 0.4);
  const vanishAt = Math.round(outFrom + (outTo - outFrom) * 0.86);
  // Gravity, not a transition.
  const since = frame - dropAt;
  const fall = since > 0 ? 3.8 * since * since : 0;

  const cast: Cast = {
    drip: { ...S1_DRIP, y: S1_DRIP.y + fall, scale: 1, who: "drip", side: "right" },
    cloudia: { ...S1_CLOUDIA, scale: S1_CLOUDIA_SCALE, who: "cloudia", side: "left" },
  };
  const cloudiaLook = useLookAtSpeaker(scene, cast, "cloudia", "left");
  const dripEmotion = useEmotion(scene, "drip", { ra_02_drip: "excited" }, "happy");

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={4} waves={false} />
      <WideLayer>
        {/* The ground, an unreasonable distance below. */}
        <g opacity={0.55}>
          <path
            d="M -1200 1180 Q 200 990 900 1060 Q 1600 1130 3200 1010 L 3200 1700 L -1200 1700 Z"
            fill={mixHex(kidTheme.grass, kidTheme.skyLow, 0.55)}
          />
        </g>
        <HotelCeiling />
        <HotelFloor vanishAt={vanishAt} holeX={S1_DRIP.x} />
      </WideLayer>
      <CheckOutLever x={S1_LEVER.x} y={S1_LEVER.y} pull={pull} />
      {/* She leans into the lever: no arms, so the haul is her whole body. */}
      <Camera cam={{ x: S1_CLOUDIA.x, y: S22_FLOOR, rotate: pull * 9 }}>
        <Cloudia
          x={S1_CLOUDIA.x}
          y={S1_CLOUDIA.y}
          scale={S1_CLOUDIA_SCALE}
          emotion="proud"
          speaking={useSpeaking(scene, "cloudia")}
          phase={PHASE.cloudia}
          clipboard
          fill={0.75}
          look={cloudiaLook}
        />
      </Camera>
      <Drip
        x={S1_DRIP.x}
        y={S1_DRIP.y + fall}
        scale={1}
        emotion={dripEmotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={frame < vanishAt}
        idle={frame > vanishAt && frame < dropAt ? 0.25 : 1}
        look={frame > vanishAt && frame < dropAt ? "down" : "right"}
        exit={{ at: dropAt + 6, kind: "shrink" }}
      />
      {since > 0 && since < 26 ? <DropStreaks x={S1_DRIP.x} y={S1_DRIP.y + fall} from={dropAt} /> : null}
      <Bubbles
        scene={scene}
        cast={cast}
        text={S1_BUBBLES}
        // Shouted while he hangs over the hole, then on the way down: parked
        // up and to his right, clear of his head, tail aimed back at the hole.
        at={{ ra_02_drip: { x: 1150, y: 405, tail: "left", tailAt: S1_DRIP.x } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — the best waterslide ever built, with one loop
// ---------------------------------------------------------------------------

const S2_SCALE = 1.05;
const LOOP_LEN = 48;
const LOOP_R = 150;

/** Where he is on frame `f` of the fall: episode one's `plunge`, one loop. */
function tumble(f: number, loopAt: number): { x: number; y: number; rot: number } {
  let x = 960 + 300 * Math.sin(f / 43);
  let y = 640 + 46 * Math.sin(f / 26 + 1.2);
  let rot = 10 * Math.sin(f / 18);
  const u = (f - loopAt) / LOOP_LEN;
  if (u >= 0 && u <= 1) {
    const th = Easing.inOut(Easing.sin)(u) * Math.PI * 2;
    x += Math.sin(th) * LOOP_R;
    y -= (1 - Math.cos(th)) * LOOP_R;
    rot = (th * 180) / Math.PI;
  }
  return { x, y, rot };
}

const SlideScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [loopFrom] = lineWindow(scene, "ra_04_drip");
  // The loop starts on "I am doing a LOOP!" — the first clause of his line.
  const p = tumble(frame, loopFrom + 6);
  const mid = midOf("drip", p.y, S2_SCALE);

  return (
    <AbsoluteFill>
      <PlungeWorld />
      <Camera cam={{ x: p.x, y: mid, rotate: p.rot }}>
        <Drip
          x={p.x}
          y={p.y}
          scale={S2_SCALE}
          emotion="excited"
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          idle={1.6}
          pose="cheer"
          look="camera"
        />
      </Camera>
      <Bubbles
        scene={scene}
        cast={{ drip: { x: p.x, y: p.y, scale: S2_SCALE, who: "drip" } }}
        text={{ ra_04_drip: "I am doing a LOOP!" }}
        // He loops through his own line, so the bubble is parked, not pinned.
        at={{ ra_04_drip: { x: 1440, y: 220, tail: "left" } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — a mountain drop, for about four seconds
// ---------------------------------------------------------------------------

const S3_DRIP = { x: 880, y: stand("drip", S24_GROUND) };
const S3_SCALE = 0.95;

const S3_BUBBLES: Record<string, string> = {
  ra_06_drip: "I am a mountain drop now!",
};

const LandScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, splooshTo] = lineWindow(scene, "ra_05_narrator");
  const [claimFrom, claimTo] = lineWindow(scene, "ra_06_drip");

  // "Sploosh." is the last word of the take, so that is where he lands.
  const splooshAt = splooshTo - 12;
  const drop = interpolate(frame, [splooshAt - 26, splooshAt], [-980, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const land = frame >= splooshAt ? Math.max(0, 1 - (frame - splooshAt) / 16) : 0;
  const squash = Math.sin(land * Math.PI) * 0.9;

  // And then gravity, again. He starts to go in the silence after "I live
  // here", so the narrator's deadpan lands over a drop already sliding away —
  // down the right-hand face and out of frame, where the stream starts.
  const slideAt = claimTo + 10;
  const slide = interpolate(frame, [slideAt, slideAt + 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  // Along the peak's own right-hand face (MountainPeak's outline), so his
  // feet stay on the rock all the way down.
  const sx = S3_DRIP.x + slide * 1250;
  const ground = interpolate(sx, [880, 1110, 1180, 1520, 2100], [S24_GROUND, S24_GROUND + 10, 900, 1120, 1700], {
    extrapolateLeft: "clamp",
    extrapolateRight: "extend",
  });
  const sy = stand("drip", ground);

  const emotion = useEmotion(scene, "drip", { ra_06_drip: "proud" }, "excited");

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WideLayer>
        <MountainPeak winter={0} />
      </WideLayer>
      <TinyFlag x={S3_DRIP.x + 190} y={S24_GROUND + 6} from={claimFrom + 26} />
      <Camera cam={{ x: S3_DRIP.x, y: S24_GROUND, zoom: 1 + squash * 0.22, zoomY: 1 - squash * 0.26 }}>
        <Drip
          x={sx}
          y={sy + drop}
          scale={S3_SCALE}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={frame > splooshAt && slide < 0.05}
          idle={0.7}
          // He salutes his new home all the way off it.
          pose={frame > splooshAt ? "cheer" : undefined}
          look="camera"
        />
      </Camera>
      {frame >= splooshAt && frame < splooshAt + 34 ? (
        <Splash x={S3_DRIP.x} y={S24_GROUND} from={splooshAt} />
      ) : null}
      <Bubbles
        scene={scene}
        cast={{ drip: { ...S3_DRIP, scale: S3_SCALE, who: "drip", side: "left" } }}
        text={S3_BUBBLES}
      />
    </AbsoluteFill>
  );
};

export const RAIN_SCENES: Record<string, React.FC<SceneProps>> = {
  ra_drop: DropScene,
  ra_slide: SlideScene,
  ra_land: LandScene,
};
