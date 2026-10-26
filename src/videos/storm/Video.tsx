import React from "react";
import { Series } from "remotion";
import { DialogueAudio, buildTimeline, type TimedScene } from "../../lib/narration";
import {
  COUNT_FIRINGS,
  COUNT_GRID,
  FPS,
  HEIGHT,
  WIDTH,
  ScenePlaceholder,
  clipFrames,
  countGaps,
  isCountKey,
  turnsOf,
} from "./scenes/common";
import { COLD_OPEN_SCENES } from "./scenes/coldOpen";
import { ACT1_SCENES } from "./scenes/act1";
import { ACT2_SCENES } from "./scenes/act2";
import { ACT3_SCENES } from "./scenes/act3";
import { RECAP_SCENES } from "./scenes/recap";

// "Boom and the One, Two, Three" — Little Big World, episode six: thunder and
// lightning, and why thunder is always "late" (it is not; it is far).
//
// Structure (identical to episodes one through five, deliberately):
//
//   Video.tsx (this file)  the whole 26-scene timeline. Every scene's real
//                          dialogue turns live in SCRIPT below, keyed by
//                          script.md's line keys (all 250, in playback order),
//                          so the episode's duration is real whether or not a
//                          scene has been staged.
//   scenes/common.tsx      the kit: turn plumbing, THE COUNT GRID, staging API,
//                          the three worlds, the hotel, ScenePlaceholder.
//   scenes/Boom.tsx        the hero. scenes/Flash.tsx the lightning (≤6f).
//   scenes/Kid.tsx         the kid's two new poses and the countable fingers.
//   scenes/<act>.tsx       one file per act, each a Record<sceneId, FC>.
//
// ---------------------------------------------------------------------------
// THE GAPS ARE THE SCRIPT'S, NOT THE BUILDER'S — with one class computed.
//
// Every HELD BEAT in script.md is a `gaps` entry below, verbatim, with the
// script's reason. "Raising one is a note, lowering one is a change to the
// joke."
//
// **THE COUNT GRID IS A PRODUCTION GATE** and its 52 gaps are NOT in the
// tables below: `timeline()` merges `countGaps(lines)` into every scene, so
// every count firing gets `gap = 30 − clipFrames` from the manifest at module
// load and can never be hand-typed (an explicit gap on a count key throws).
// The gaps are negative (−9 to −13): kokoro pads each number with ~0.9s of
// silence, so the grid is an ONSET grid — each number STARTS exactly 30f after
// the one before (edit-pass ruling, ep6-decision-log TOP). The assertion block
// under SCRIPT checks all 52 at load: clip + gap = 30, or the module throws.
// The last number of a run takes the grid gap too, so the arrival (Boom's
// "Present!", "There he is.") lands on the next beat of the metronome.
//
// Identity gaps (declared once in the script): the volcano's 48f before his
// one line (`a2_62_boom`: 48) and Blue's 4f before each of his three
// (`leadFrames: 4` on Scene 12, which he opens; `a2_28_boom`: 4;
// `a2_31_narrator`: 4). Boom's arrival gap is NOT identity — it is the count.
//
// Held-beat scenes use `NO_LEAD` for emotion cues (scenes/common.tsx).
//
// No number below is the builder's. (Checked rather than assumed: Scene 16's
// overhead flash needs no lead in front of "Present." — `a2_59_boom` opens on
// 3f of silence (measured), so Flash on the scene's frame 0 is in the frame
// before his voice and still shares a frame with him, which is exactly the
// script's picture. Scene 9's flash on frame 0 likewise lands inside
// `a1_45_cloudia`'s 5f lead.)
// ---------------------------------------------------------------------------

export { FPS, WIDTH, HEIGHT };

type SceneSpec = {
  id: string;
  /** script.md's line keys for this scene, in playback order. */
  lines: string[];
  /** Per-line silence AFTER a line — every entry is a scripted held beat. */
  gaps?: Record<string, number>;
  /**
   * Per-key instance volume (`TimedTurn.volume`, default 1). The far
   * "Present!" firings are the SAME clip, quieter — world rule 5: no filtered
   * copy, no re-record.
   */
  volumes?: Record<string, number>;
  /** Silence before the scene's first line (a held beat with no line to hang on). */
  leadFrames?: number;
  minFrames?: number;
  tailFrames?: number;
};

/**
 * **THE "PRESENT!" VOLUMES — size by distance, as sound.** Boom's body grows
 * and softens with the count (Boom.tsx); his voice does the same thing, with
 * one clip at ten volumes. The ladder is the count before him:
 *
 *   0 counts (the lobby, a1_48 / a3_64)   1.0 — no entry, the default
 *   1 and 2 (a2_57, a2_52)                1.0 — a2_52 "louder in the mix"
 *                                         (script) is louder than the 3 before
 *   3 (a2_25, a3_11)                      0.85
 *   6 (a2_12, a3_21)                      0.6  — a3_21 "the first far firing"
 *   9 (a3_38)                             0.45 — far, inside the rumble
 *
 * a2_12 at 0.6 is a builder call (the script only names a2_52, a3_21, a3_38):
 * six counts is the same two kilometres in act two as in act three, and the
 * episode's whole argument is that the gap is distance. Reversal: one number.
 */
const PRESENT_VOLUME = { near: 1, three: 0.85, six: 0.6, nine: 0.45 } as const;

const SCRIPT: SceneSpec[] = [
  // --- COLD OPEN ----------------------------------------------------------
  {
    // Scene 1 — The heaviest morning. The garden wide, the volcano awake with
    // the island beside him, Sunny six-for-six, the hotel small and grey.
    id: "s01_heavy_morning",
    lines: [
      "co_01_narrator", "co_02_narrator", "co_03_sunny", "co_04_sunny",
      "co_05_sunny", "co_06_narrator", "co_07_sunny", "co_08_narrator",
      "co_09_narrator", "co_10_cloudia", "co_11_cloudia", "co_12_narrator",
    ],
    tailFrames: 30,
  },
  {
    // Scene 2 — The window rule, and the first count. Nine numbers on the
    // grid (co_15–co_23, the sources), "There he is.", the title card.
    id: "s02_window_count",
    lines: [
      "co_13_narrator", "co_14_narrator", "co_15_narrator", "co_16_narrator",
      "co_17_narrator", "co_18_narrator", "co_19_narrator", "co_20_narrator",
      "co_21_narrator", "co_22_narrator", "co_23_narrator", "co_24_narrator",
      "co_25_narrator", "co_26_narrator", "co_27_narrator",
    ],
    gaps: {
      // 30f — "The first count lands alone."
      co_24_narrator: 30,
      // 30f — after "Last time, somebody asked why thunder is always late."
      // The ep-5 card may ghost over the sky — print only.
      co_25_narrator: 30,
    },
    // 60: the TITLE CARD holds over the thunderhead after the last line.
    tailFrames: 60,
  },

  // --- ACT ONE — THE HOTEL GOES UP ------------------------------------------
  {
    // Scene 3 — Air in a hurry: a lift at a hotel with no stairs.
    id: "s03_lift",
    lines: [
      "a1_01_narrator", "a1_02_narrator", "a1_03_cloudia", "a1_04_puff",
      "a1_05_cloudia", "a1_06_puff", "a1_07_sunny", "a1_08_narrator",
    ],
    gaps: {
      // 30f — "Cloudia takes this in." (after "There is now a lift.")
      a1_04_puff: 30,
    },
    tailFrames: 30,
  },
  {
    // Scene 4 — A guest checks in. Drip's standing entrance, fifth firing.
    id: "s04_check_in",
    lines: [
      "a1_09_drip", "a1_10_cloudia", "a1_11_drip", "a1_12_puff",
      "a1_13_narrator",
    ],
    tailFrames: 30,
  },
  {
    // Scene 5 — The hotel goes vertical. The tower passes Sunny and blocks him.
    id: "s05_vertical",
    lines: [
      "a1_14_narrator", "a1_15_cloudia", "a1_16_cloudia", "a1_17_narrator",
      "a1_18_sunny", "a1_19_narrator", "a1_20_sunny", "a1_21_narrator",
      "a1_22_sunny", "a1_23_cloudia", "a1_24_cloudia",
    ],
    gaps: {
      // 30f — "She looks up at it." (after "I did not order a flat roof.")
      a1_15_cloudia: 30,
    },
    tailFrames: 30,
  },
  {
    // Scene 6 — The penthouse is a freezer; ROLL CALL, firing 1 (greeting).
    id: "s06_penthouse",
    lines: [
      "a1_25_cloudia", "a1_26_drip", "a1_27_drip", "a1_28_drip",
      "a1_29_narrator", "a1_30_drip",
    ],
    gaps: {
      // 24f — "the beat before the big one; the naming run is split into two
      // clips so the timeline makes the pause."
      a1_27_drip: 24,
      // 36f — after the roll call's flat Narrator middle.
      a1_29_narrator: 36,
    },
    tailFrames: 30,
  },
  {
    // Scene 7 — The crackle. STATIC (a full scene before LIGHTNING — the
    // edit-pass reorder; 53.3s apart on the manifest).
    id: "s07_static",
    lines: [
      "a1_31_cloudia", "a1_32_narrator", "a1_33_narrator", "a1_34_cloudia",
      "a1_35_sunny", "a1_36_narrator",
    ],
    tailFrames: 30,
  },
  {
    // Scene 8 — Up, down, up — and the gala.
    id: "s08_gala",
    lines: [
      "a1_37_puff", "a1_38_drip", "a1_39_cloudia", "a1_40_narrator",
      "a1_41_cloudia", "a1_42_drip", "a1_43_cloudia", "a1_44_cloudia",
    ],
    tailFrames: 30,
  },
  {
    // Scene 9 — Somebody leaves through the wall. LIGHTNING. Boom is born —
    // the "Present!" chain source, at zero distance, in the lobby.
    id: "s09_flash_boom",
    lines: [
      "a1_45_cloudia", "a1_46_narrator", "a1_47_narrator", "a1_48_boom",
      "a1_49_cloudia", "a1_50_boom", "a1_51_cloudia", "a1_52_boom",
      "a1_53_boom", "a1_54_boom", "a1_55_cloudia",
    ],
    gaps: {
      // 45f — "The first unanswered address; the zero is the physics."
      a1_52_boom: 45,
    },
    tailFrames: 30,
  },
  {
    // Scene 10 — The same nine seconds, from the window. HARD CUT, six fingers
    // already up; the count rejoins at "Seven." on the grid.
    id: "s10_same_nine",
    lines: [
      "a1_56_narrator", "a1_57_narrator", "a1_58_narrator", "a1_59_narrator",
      "a1_60_narrator", "a1_61_narrator",
    ],
    gaps: {
      // 30f — after "There he is." (the same seconds, the same sentence).
      a1_59_narrator: 30,
      // 30f — after "Those are the same seconds."
      a1_60_narrator: 30,
    },
    // ACT BREAK.
    tailFrames: 30,
  },

  // --- ACT TWO — THE COUNT COMES DOWN ---------------------------------------
  {
    // Scene 11 — The storm arrives before itself; six.
    id: "s11_six",
    lines: [
      "a2_01_narrator", "a2_02_puff", "a2_03_puff", "a2_04_puff",
      "a2_05_narrator", "a2_06_narrator", "a2_07_narrator", "a2_08_narrator",
      "a2_09_narrator", "a2_10_narrator", "a2_11_narrator", "a2_12_boom",
      "a2_13_boom", "a2_14_boom", "a2_15_narrator", "a2_16_boom",
      "a2_17_narrator", "a2_18_boom", "a2_19_narrator", "a2_20_boom",
    ],
    volumes: { a2_12_boom: PRESENT_VOLUME.six },
    tailFrames: 30,
  },
  {
    // Scene 12 — Blue, first; three. THE BANKED PAYOFF FIRES.
    id: "s12_blue_three",
    // 4f — Blue's identity approach gap, on the scene's first line.
    leadFrames: 4,
    lines: [
      "a2_21_blue", "a2_22_narrator", "a2_23_narrator", "a2_24_narrator",
      "a2_25_boom", "a2_26_narrator", "a2_27_narrator", "a2_28_boom",
      "a2_29_blue", "a2_30_boom", "a2_31_narrator", "a2_32_blue",
    ],
    gaps: {
      // 90f — BLUE'S STUNNED BEAT, the series' second. "The ricochet STOPS
      // DEAD for the first time in his life… NOTHING enters it."
      a2_26_narrator: 90,
      // 4f — Blue's approach, before "I was first!"
      a2_28_boom: 4,
      // 4f — Blue's approach, before "First to go home! Sorry, curtain!"
      a2_31_narrator: 4,
    },
    volumes: { a2_25_boom: PRESENT_VOLUME.three },
    tailFrames: 30,
  },
  {
    // Scene 13 — The ruler, said once. LIGHT IS FAST. SOUND IS SLOW.
    id: "s13_ruler",
    lines: [
      "a2_33_narrator", "a2_34_boom", "a2_35_narrator", "a2_36_boom",
      "a2_37_narrator", "a2_38_narrator", "a2_39_narrator", "a2_40_narrator",
      "a2_41_boom", "a2_42_boom",
    ],
    gaps: {
      // 30f — "He considers the word." (after "Distance.")
      a2_41_boom: 30,
    },
    tailFrames: 30,
  },
  {
    // Scene 14 — The house phone (two frames of reference).
    id: "s14_house_phone",
    lines: [
      "a2_43_boom", "a2_44_cloudia", "a2_45_narrator", "a2_46_cloudia",
      "a2_47_narrator", "a2_48_sunny", "a2_49_narrator",
    ],
    gaps: {
      // 36f — "The Narrator has to think about it." (before "Yes.")
      a2_46_cloudia: 36,
    },
    tailFrames: 30,
  },
  {
    // Scene 15 — Two. One. (Two count runs.)
    id: "s15_two_one",
    lines: [
      "a2_50_narrator", "a2_51_narrator", "a2_52_boom", "a2_53_boom",
      "a2_54_narrator", "a2_55_boom", "a2_56_narrator", "a2_57_boom",
      "a2_58_boom",
    ],
    // a2_52: "Louder in the mix (volume on the instance)." Full, against the
    // 0.85 three-count before it. a2_57 (one count) full as well.
    volumes: { a2_52_boom: PRESENT_VOLUME.near, a2_57_boom: PRESENT_VOLUME.near },
    tailFrames: 30,
  },
  {
    // Scene 16 — Zero. THE BREAK.
    id: "s16_zero",
    lines: [
      "a2_59_boom", "a2_60_narrator", "a2_61_boom", "a2_62_boom",
      "a2_63_volcano", "a2_64_narrator", "a2_65_cloudia", "a2_66_narrator",
    ],
    gaps: {
      // 60f — "The break lands alone."
      a2_59_boom: 60,
      // 30f — after "I did not get to one."
      a2_60_narrator: 30,
      // 45f — "Address 3 of 6 — unanswered: the turn to her IS the address."
      a2_61_boom: 45,
      // 48f — THE VOLCANO'S IDENTITY GAP before his one line ("the mountain
      // deciding to move"). CUTTABLE with a2_63 + a2_64 as a pair.
      a2_62_boom: 48,
    },
    tailFrames: 30,
  },
  {
    // Scene 17 — The myth (CLOUDS DO NOT BUMP.), and THUNDER.
    id: "s17_myth_thunder",
    lines: [
      "a2_67_narrator", "a2_68_cloudia", "a2_69_narrator", "a2_70_cloudia",
      "a2_71_cloudia", "a2_72_cloudia", "a2_73_narrator", "a2_74_narrator",
      "a2_75_boom", "a2_76_boom",
    ],
    gaps: {
      // 36f — the MYTH stamp: "thuds on, cracks, silence" — the hold on the
      // cracked stamp, before "Big myth. Busted."
      a2_68_cloudia: 36,
      // 36f — the two small clouds drift together and touch. Nothing.
      a2_70_cloudia: 36,
    },
    // ACT BREAK.
    tailFrames: 30,
  },

  // --- ACT THREE — THE COUNT GOES UP ----------------------------------------
  {
    // Scene 18 — The grandest check-out.
    id: "s18_checkout",
    lines: [
      "a3_01_narrator", "a3_02_cloudia", "a3_03_cloudia", "a3_04_sunny",
      "a3_05_narrator", "a3_06_sunny", "a3_07_drip",
    ],
    tailFrames: 30,
  },
  {
    // Scene 19 — Three again.
    id: "s19_three_again",
    lines: [
      "a3_08_narrator", "a3_09_narrator", "a3_10_narrator", "a3_11_boom",
      "a3_12_boom", "a3_13_boom", "a3_14_narrator",
    ],
    gaps: {
      // 24f — after "Didn't I?" (address 4 of 6, unanswered).
      a3_13_boom: 24,
    },
    volumes: { a3_11_boom: PRESENT_VOLUME.three },
    tailFrames: 30,
  },
  {
    // Scene 20 — Six. THE TURN.
    id: "s20_six_turn",
    lines: [
      "a3_15_narrator", "a3_16_narrator", "a3_17_narrator", "a3_18_narrator",
      "a3_19_narrator", "a3_20_narrator", "a3_21_boom", "a3_22_narrator",
      "a3_23_boom", "a3_24_boom", "a3_25_boom", "a3_26_narrator", "a3_27_boom",
      "a3_28_narrator",
    ],
    gaps: {
      // 36f — "She has gone, as ever." (address 5 of 6)
      a3_24_boom: 36,
      // 60f — THE TURN. "Nothing enters." (after "Count me.")
      a3_27_boom: 60,
    },
    // "The first 'far' firing: the SAME clip, volume only."
    volumes: { a3_21_boom: PRESENT_VOLUME.six },
    tailFrames: 30,
  },
  {
    // Scene 21 — Nine. The rumble.
    id: "s21_nine_rumble",
    lines: [
      "a3_29_narrator", "a3_30_narrator", "a3_31_narrator", "a3_32_narrator",
      "a3_33_narrator", "a3_34_narrator", "a3_35_narrator", "a3_36_narrator",
      "a3_37_narrator", "a3_38_boom", "a3_39_narrator", "a3_40_boom",
      "a3_41_boom", "a3_42_boom", "a3_43_narrator", "a3_44_narrator",
    ],
    // "Far, volume only, inside the rumble SFX."
    volumes: { a3_38_boom: PRESENT_VOLUME.nine },
    tailFrames: 30,
  },
  {
    // Scene 22 — ROLL CALL, firing 2: goodbye on the lawn.
    id: "s22_goodbye",
    lines: [
      "a3_45_sunny", "a3_46_narrator", "a3_47_drip", "a3_48_narrator",
      "a3_49_drip",
    ],
    gaps: {
      // 36f — after the goodbye middle ("…called Puddle.")
      a3_48_narrator: 36,
    },
    tailFrames: 30,
  },
  {
    // Scene 23 — Ten fingers, and nothing.
    id: "s23_ten_nothing",
    lines: [
      "a3_50_narrator", "a3_51_narrator", "a3_52_narrator", "a3_53_narrator",
      "a3_54_narrator", "a3_55_narrator", "a3_56_narrator", "a3_57_narrator",
      "a3_58_narrator", "a3_59_narrator", "a3_60_narrator", "a3_61_narrator",
      "a3_62_narrator", "a3_63_narrator", "a3_64_boom", "a3_65_cloudia",
      "a3_66_narrator", "a3_67_narrator", "a3_68_narrator",
    ],
    gaps: {
      // 120f — TEN-AND-NOTHING. "The kid holds ten fingers at a window.
      // Nothing enters. Nothing arrives."
      a3_61_narrator: 120,
      // 30f — after "…That is forty-five counts."
      a3_62_narrator: 30,
      // 30f — after "From here, he is too far to hear."
      a3_66_narrator: 30,
      // 30f — after "Both true."
      a3_67_narrator: 30,
    },
    // a3_64 is the FINAL "Present!" — at the hotel, zero distance: full.
    tailFrames: 30,
  },

  // --- RECAP ----------------------------------------------------------------
  {
    // Scene 24 — The chant. Boom slams THUNDER a beat behind (staged).
    id: "s24_chant",
    lines: [
      "rc_01_narrator", "rc_02_narrator", "rc_03_narrator", "rc_04_narrator",
      "rc_05_narrator",
    ],
    tailFrames: 30,
  },
  {
    // Scene 25 — The amazing part.
    id: "s25_amazing",
    lines: [
      "rc_06_narrator", "rc_07_narrator", "rc_08_sunny", "rc_09_narrator",
      "rc_10_sunny", "rc_11_narrator", "rc_12_boom", "rc_13_narrator",
      "rc_14_boom", "rc_15_narrator",
    ],
    gaps: {
      // 60f — THE AWE. "Awe, in silence, BEFORE any button."
      rc_07_narrator: 60,
    },
    tailFrames: 30,
  },
  {
    // Scene 26 — End card: the moon.
    id: "s26_end_card",
    lines: ["rc_16_narrator", "rc_17_sunny", "rc_18_narrator"],
    // 120: the last picture — one more far, silent flash; ten fingers anyway,
    // and a wave; the lit summit, the island, the half moon. (Builder's
    // number; the script gives the picture, not its length.)
    tailFrames: 120,
  },
];

// ---------------------------------------------------------------------------
// THE GATES, AT MODULE LOAD. A failing one throws, so typecheck-clean code that
// breaks the script cannot render a single frame.
// ---------------------------------------------------------------------------

const ALL_KEYS = SCRIPT.flatMap((s) => s.lines);
if (ALL_KEYS.length !== 250 || new Set(ALL_KEYS).size !== 250) {
  throw new Error(`[storm] SCRIPT must hold the 250 keys exactly once (has ${ALL_KEYS.length})`);
}
const COUNT_KEYS = ALL_KEYS.filter(isCountKey);
if (COUNT_KEYS.length !== COUNT_FIRINGS) {
  throw new Error(`[storm] count grid: expected ${COUNT_FIRINGS} firings, found ${COUNT_KEYS.length}`);
}
for (const spec of SCRIPT) {
  for (const key of Object.keys(spec.gaps ?? {})) {
    if (isCountKey(key)) throw new Error(`[storm] ${key}: count gaps are computed, never typed`);
    if (!spec.lines.includes(key)) throw new Error(`[storm] gap on ${key}, which is not in ${spec.id}`);
  }
  for (const [key, gap] of Object.entries(countGaps(spec.lines))) {
    if (clipFrames(key) + gap !== COUNT_GRID) throw new Error(`[storm] ${key}: clip + gap != ${COUNT_GRID}`);
  }
}

/** The 52 firings' grid rows, for the report and for anyone auditing the gate. */
export function countGridTable(): Array<{ key: string; clipFrames: number; gap: number; total: number }> {
  return COUNT_KEYS.map((key) => {
    const gap = COUNT_GRID - clipFrames(key);
    return { key, clipFrames: clipFrames(key), gap, total: clipFrames(key) + gap };
  });
}

export function timeline() {
  const built = buildTimeline(
    SCRIPT.map((spec) => ({
      id: spec.id,
      turns: turnsOf(spec.lines, {
        gaps: { ...spec.gaps, ...countGaps(spec.lines) },
        volumes: spec.volumes,
      }),
      minFrames: spec.minFrames,
      tailFrames: spec.tailFrames ?? 30,
    })),
    FPS,
  );
  // Silent opens (`leadFrames`): slide a scene's turns forward by its lead and
  // lengthen it by the same amount; scenes without one come through unchanged.
  let from = 0;
  const scenes = built.scenes.map((scene, i) => {
    const lead = SCRIPT[i].leadFrames ?? 0;
    const shifted: TimedScene = {
      ...scene,
      from,
      durationInFrames: scene.durationInFrames + lead,
      turns: scene.turns?.map((turn) => ({ ...turn, from: turn.from + lead })),
    };
    from += shifted.durationInFrames;
    return shifted;
  });
  return { scenes, durationInFrames: Math.max(1, from) };
}

/** Every staged scene in the episode. Unlisted ids fall back to a placeholder. */
const SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  ...COLD_OPEN_SCENES,
  ...ACT1_SCENES,
  ...ACT2_SCENES,
  ...ACT3_SCENES,
  ...RECAP_SCENES,
};

export const StormVideo: React.FC = () => {
  const { scenes } = timeline();
  return (
    <Series>
      {scenes.map((scene) => {
        const Scene = SCENES[scene.id];
        return (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
            {/* Every scene's audio is mounted here, staged or not. */}
            <DialogueAudio scene={scene} />
            {Scene ? <Scene scene={scene} /> : <ScenePlaceholder scene={scene} />}
          </Series.Sequence>
        );
      })}
    </Series>
  );
};
