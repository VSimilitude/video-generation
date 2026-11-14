import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { DialogueAudio, buildTimeline, type TimedScene } from "../../lib/narration";
import { Post, dissolve } from "../../lib/kid";
import { FPS, HEIGHT, WIDTH, SEAM, SKY_RAMP, ScenePlaceholder, TIME, turnsOf } from "./scenes/common";
import { COLD_OPEN_SCENES } from "./scenes/coldOpen";
import { ACT1_SCENES } from "./scenes/act1";
import { ACT2_SCENES } from "./scenes/act2";
import { ACT3_SCENES } from "./scenes/act3";
import { RECAP_SCENES } from "./scenes/recap";

// "Drip's Big Adventure" — REMASTER (`DripWaterCycleRemaster`): episode one
// re-pictured on the look package (docs/ANIMATION-ROADMAP.md Step 2; brief.md).
//
// Same architecture as src/videos/water-cycle/Video.tsx:
//
//   Video.tsx (this file)  the 36-scene timeline. SCRIPT below is ep 1's table
//                          VERBATIM (ids, line keys, gaps, tailFrames) so the
//                          remaster times identically line-for-line; only the
//                          clip durations differ where Drip/Cloudia were
//                          re-voiced (minimax), and those come from this slug's
//                          narrationManifest.
//   scenes/common.tsx      the shared remaster kit: speaker plumbing (ep 1's),
//                          LIGHT/TIME per scene, SETS (plate stacks), the camera
//                          grammar helper, painted cast wrappers, placeholder.
//   scenes/<act>.tsx       one file per act, Record<sceneId, React.FC<{scene}>>.
//
// What this file adds over ep 1 (an act builder never touches it):
//   - every scene is wrapped in ONE <Post time={TIME[id]} skyRamp=…> here, so
//     each scene lands in its LOOK-bible band whether staged or not. Scenes
//     never mount a second Post (key-light bloom: `KeyBloom` in common.tsx).
//   - seams: a scene listed in SEAM dissolves in over its first N frames
//     (6–8, Step 2 "seams = 6–8 f dissolve") over the previous scene, which
//     keeps rendering N frames past its own end underneath. Scene START frames
//     and all audio are exactly the Series timing — nothing moves.

export { FPS, WIDTH, HEIGHT };

type SceneSpec = {
  id: string;
  /** script.md's line keys for this scene, in playback order. */
  lines: string[];
  /** Per-line silence *after* a line, when a beat needs room. */
  gaps?: Record<string, number>;
  minFrames?: number;
  tailFrames?: number;
};

/**
 * The episode — copied verbatim from src/videos/water-cycle/Video.tsx. Edit
 * neither table without the other.
 */
const SCRIPT: SceneSpec[] = [
  // --- COLD OPEN ----------------------------------------------------------
  {
    id: "s01_dawn",
    lines: [
      "co_01_narrator",
      "co_02_drip",
      "co_03_narrator",
      "co_04_drip",
      "co_05_narrator",
      "co_06_drip",
    ],
    // The pose is held "a beat too long" — that beat is this gap.
    gaps: { co_04_drip: 16, co_05_narrator: 12 },
    tailFrames: 26,
  },
  { id: "s02_title", lines: ["co_07_narrator"], tailFrames: 40 },

  // --- ACT ONE — THE OCEAN ------------------------------------------------
  {
    id: "s03_ocean_wide",
    lines: [
      "a1_01_narrator",
      "a1_02_drip",
      "a1_03_narrator",
      "a1_04_drip",
      "a1_05_narrator",
    ],
    tailFrames: 26,
  },
  {
    id: "s04_slosh",
    lines: ["a1_06_drip", "a1_07_drip"],
    // The "Monday / Tuesday / also Tuesday" gag needs its punchline to land in
    // silence: the third card cuts in, Drip stares down the lens, *then* he
    // erupts. 44 frames is that dead air — the scene cuts to the third card one
    // second before a1_07 (see SloshScene in scenes/act1.tsx, which reads this
    // gap off the timeline rather than hard-coding it).
    gaps: { a1_06_drip: 44 },
    tailFrames: 30,
  },
  {
    id: "s05_sunrise",
    lines: ["a1_08_narrator", "a1_09_sunny", "a1_10_narrator"],
    gaps: { a1_08_narrator: 14 },
    tailFrames: 26,
  },
  { id: "s06_sunny_intro", lines: ["a1_11_sunny", "a1_12_drip", "a1_13_sunny"], tailFrames: 26 },
  { id: "s07_warming", lines: ["a1_14_narrator", "a1_15_sunny", "a1_16_narrator"], tailFrames: 30 },
  { id: "s08_everywhere", lines: ["a1_17_drip", "a1_18_drip", "a1_19_sunny"], tailFrames: 26 },
  {
    id: "s09_liftoff",
    lines: ["a1_20_narrator", "a1_21_drip", "a1_22_drip", "a1_23_sunny"],
    // The scared -> thrilled turn happens *between* Drip's two lines: the rig
    // hard-cuts a wobble mouth to a talking mouth, so the fear has to land in
    // silence. 22 frames is the beat it needs.
    gaps: { a1_21_drip: 22 },
    tailFrames: 26,
  },
  {
    id: "s10_bigword_evaporation",
    lines: ["a1_24_narrator", "a1_25_drip", "a1_26_narrator"],
    gaps: { a1_24_narrator: 12, a1_25_drip: 12 },
    tailFrames: 36,
  },
  { id: "s11_best_at_it", lines: ["a1_27_drip", "a1_28_narrator", "a1_29_drip"], tailFrames: 34 },

  // --- ACT TWO — THE SKY --------------------------------------------------
  {
    id: "s12_layers",
    lines: ["a2_01_narrator", "a2_02_drip", "a2_03_narrator", "a2_04_drip"],
    tailFrames: 26,
  },
  { id: "s13_cloud_hotel", lines: ["a2_05_narrator", "a2_06_cloudia"], tailFrames: 26 },
  { id: "s14_myth_pillow", lines: ["a2_07_drip", "a2_08_cloudia", "a2_09_narrator"], tailFrames: 30 },
  { id: "s15_what_a_cloud_is", lines: ["a2_10_cloudia", "a2_11_drip", "a2_12_cloudia"], tailFrames: 26 },
  {
    id: "s16_dust_rule",
    lines: ["a2_13_cloudia", "a2_14_drip", "a2_15_narrator", "a2_16_narrator"],
    tailFrames: 30,
  },
  { id: "s17_kevin", lines: ["a2_17_drip", "a2_18_cloudia"], tailFrames: 34 },
  {
    id: "s18_bigword_condensation",
    lines: ["a2_19_narrator", "a2_20_drip", "a2_21_cloudia"],
    gaps: { a2_19_narrator: 12, a2_20_drip: 12 },
    tailFrames: 36,
  },
  { id: "s19_hotel_fills", lines: ["a2_22_narrator", "a2_23_cloudia", "a2_24_narrator"], tailFrames: 26 },
  { id: "s20_full_capacity", lines: ["a2_25_cloudia", "a2_26_drip"], tailFrames: 30 },
  {
    id: "s21_grey_and_heavy",
    lines: ["a2_27_narrator", "a2_28_sunny", "a2_29_cloudia", "a2_30_narrator"],
    tailFrames: 32,
  },

  // --- ACT THREE — THE FALL AND THE RIDE HOME -----------------------------
  {
    id: "s22_checkout",
    lines: ["a3_01_cloudia", "a3_02_drip", "a3_03_cloudia", "a3_04_drip"],
    gaps: { a3_03_cloudia: 16 },
    tailFrames: 26,
  },
  {
    id: "s23_bigword_precipitation",
    lines: ["a3_05_narrator", "a3_06_drip", "a3_07_narrator", "a3_08_drip", "a3_09_narrator"],
    gaps: { a3_07_narrator: 12, a3_08_drip: 12 },
    tailFrames: 36,
  },
  { id: "s24_landing", lines: ["a3_10_narrator", "a3_11_drip", "a3_12_narrator", "a3_13_drip"], tailFrames: 30 },
  {
    id: "s25_downhill",
    lines: ["a3_14_drip", "a3_15_narrator", "a3_16_drip", "a3_17_narrator", "a3_18_drip"],
    tailFrames: 26,
  },
  { id: "s26_flower", lines: ["a3_19_narrator", "a3_20_narrator", "a3_21_drip"], tailFrames: 30 },
  {
    id: "s27_moose",
    lines: [
      "a3_22_narrator",
      "a3_23_narrator",
      "a3_24_drip",
      "a3_25_narrator",
      "a3_26_drip",
      "a3_27_narrator",
    ],
    tailFrames: 30,
  },
  { id: "s28_everybody_wants_a_bit", lines: ["a3_28_narrator", "a3_29_drip"], tailFrames: 26 },
  {
    id: "s29_bigword_collection",
    lines: ["a3_30_narrator", "a3_31_drip", "a3_32_narrator", "a3_32b_drip", "a3_33_drip"],
    gaps: { a3_32_narrator: 12, a3_32b_drip: 12 },
    tailFrames: 36,
  },
  { id: "s30_twist", lines: ["a3_34_drip", "a3_35_drip", "a3_36_narrator", "a3_37_drip"], tailFrames: 40 },
  { id: "s31_credit", lines: ["a3_38_sunny", "a3_39_narrator", "a3_40_narrator"], tailFrames: 30 },
  { id: "s32_round_again", lines: ["a3_41_drip", "a3_42_sunny", "a3_43_drip", "a3_44_sunny"], tailFrames: 34 },

  // --- RECAP --------------------------------------------------------------
  {
    id: "s33_chant",
    lines: ["rc_01_narrator", "rc_02_sunny", "rc_03_cloudia", "rc_04_drip", "rc_05_narrator"],
    gaps: { rc_01_narrator: 14 },
    tailFrames: 30,
  },
  { id: "s34_the_ring", lines: ["rc_06_narrator", "rc_07_narrator", "rc_08_narrator"], tailFrames: 40 },
  { id: "s35_mind_blower", lines: ["rc_09_narrator", "rc_10_drip"], tailFrames: 34 },
  {
    id: "s36_tease",
    lines: ["rc_11_narrator", "rc_12_sunny", "rc_13_narrator", "rc_14_drip"],
    tailFrames: 60,
  },
];

export function timeline() {
  return buildTimeline(
    SCRIPT.map((spec) => ({
      id: spec.id,
      turns: turnsOf(spec.lines, { gaps: spec.gaps }),
      minFrames: spec.minFrames,
      tailFrames: spec.tailFrames ?? 24,
    })),
    FPS,
  );
}

/** Every staged scene in the episode. Unlisted ids fall back to a placeholder. */
const SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  ...COLD_OPEN_SCENES,
  ...ACT1_SCENES,
  ...ACT2_SCENES,
  ...ACT3_SCENES,
  ...RECAP_SCENES,
};

/** One scene's picture inside its Post band, faded in over `seam` frames. */
const ScenePicture: React.FC<{ scene: TimedScene; seam: number }> = ({ scene, seam }) => {
  const frame = useCurrentFrame();
  const Scene = SCENES[scene.id];
  const opacity = seam > 0 ? dissolve(frame, 0, seam) : 1;
  return (
    <AbsoluteFill style={{ opacity }}>
      <Post time={TIME[scene.id] ?? "day"} skyRamp={SKY_RAMP.has(scene.id)}>
        {Scene ? <Scene scene={scene} /> : <ScenePlaceholder scene={scene} />}
      </Post>
    </AbsoluteFill>
  );
};

export const WaterCycleRemasterVideo: React.FC = () => {
  const { scenes } = timeline();
  let start = 0;
  const placed = scenes.map((scene, i) => {
    const from = start;
    start += scene.durationInFrames;
    const next = scenes[i + 1];
    // Keep drawing under the next scene while it dissolves in.
    const overlap = next ? SEAM[next.id] ?? 0 : 0;
    return { scene, from, overlap, seam: i === 0 ? 0 : SEAM[scene.id] ?? 0 };
  });
  return (
    <AbsoluteFill style={{ background: "#1d1c26" }}>
      {placed.map(({ scene, from, overlap, seam }) => (
        <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames + overlap} name={scene.id}>
          <ScenePicture scene={scene} seam={seam} />
        </Sequence>
      ))}
      {/* Audio: exactly the Series timing, one DialogueAudio per scene, staged or not. */}
      {placed.map(({ scene, from }) => (
        <Sequence key={`a-${scene.id}`} from={from} durationInFrames={scene.durationInFrames} name={`audio ${scene.id}`}>
          <DialogueAudio scene={scene} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
