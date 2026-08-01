import React from "react";
import { Series } from "remotion";
import { DialogueAudio, buildTimeline, type TimedScene } from "../../lib/narration";
import { FPS, HEIGHT, WIDTH, ScenePlaceholder, turnsOf } from "./scenes/common";
import { COLD_OPEN_SCENES } from "./scenes/coldOpen";
import { ACT1_SCENES } from "./scenes/act1";
import { ACT2_SCENES } from "./scenes/act2";
import { ACT3_SCENES } from "./scenes/act3";
import { RECAP_SCENES } from "./scenes/recap";

// "Puff and the Kite That Wouldn't Fly" — Little Big World, episode two: where
// wind comes from.
//
// Structure, and where to add things (identical to episode one, deliberately):
//
//   Video.tsx (this file)  the whole 36-scene timeline. Every scene's real
//                          dialogue turns live in SCRIPT below, keyed by
//                          script.md's line keys, so the episode's duration is
//                          real whether or not a scene has been staged.
//   scenes/common.tsx      the shared kit: turn plumbing, the speaker-staging
//                          API (bubbles/mouths/looks/`speakerVisual`), the Big
//                          Word signature, the rule stamp, the camera, the
//                          recurring props, ScenePlaceholder.
//   scenes/<act>.tsx       one file per act, each exporting a
//                          Record<sceneId, React.FC<{scene}>>. A scene with no
//                          entry still plays its dialogue, in the right voices,
//                          with the cast mouthing their lines.
//
// Staging an unbuilt scene is therefore: write the component in your act file
// and put it in that file's map. Nothing here changes, and the timeline does
// not move.
//
// ---------------------------------------------------------------------------
// THE GAPS ARE THE SCRIPT'S, NOT THE BUILDER'S.
//
// Episode two writes down every silence in it. script.md's stage directions
// carry forty-one held beats with exact frame counts and a reason each, and
// they become the `gaps` below verbatim. Its own words: "raising one is a note,
// lowering one is a change to the joke." Every number in a `gaps` block traces
// to a `HELD BEAT` line in the screenplay; the comment names it.
//
// Tails are the builder's, with two exceptions the script fixes (Scene 11: 45,
// Scene 26: 40). Three held beats are *trailing* — the last line of Scenes 29,
// 31 and 36 buys silence that runs to the cut — so those scenes carry a short
// tail rather than the house 30, because the beat already is the tail.
// ---------------------------------------------------------------------------

// Format constants live in scenes/common.tsx (every scene file needs them) and
// are re-exported here, because the registry reads them off the composition.
export { FPS, WIDTH, HEIGHT };

type SceneSpec = {
  id: string;
  /** script.md's line keys for this scene, in playback order. */
  lines: string[];
  /** Per-line silence *after* a line — every entry is a scripted held beat. */
  gaps?: Record<string, number>;
  minFrames?: number;
  tailFrames?: number;
};

const SCRIPT: SceneSpec[] = [
  // --- COLD OPEN ----------------------------------------------------------
  {
    id: "s01_hill",
    lines: [
      "co_01_narrator",
      "co_02_narrator",
      "co_03_narrator",
      "co_04_narrator",
      "co_05_narrator",
      "co_06_narrator",
    ],
    gaps: {
      // 60f — the run, the hopeful lift and the flop, in complete silence.
      // The first thing the audience sees the show do.
      co_04_narrator: 60,
      // 36f — hold on the kite in the grass. The kid's shoulders drop, once.
      co_05_narrator: 36,
    },
    tailFrames: 36,
  },
  { id: "s02_title", lines: ["co_07_narrator", "co_08_narrator"], tailFrames: 40 },

  // --- ACT ONE — YOU'RE REAL, PUFF ----------------------------------------
  {
    id: "s03_grass",
    lines: ["a1_01_narrator", "a1_02_puff", "a1_03_narrator", "a1_04_puff"],
    tailFrames: 30,
  },
  {
    id: "s04_beetle",
    lines: [
      "a1_05_narrator",
      "a1_06_puff",
      "a1_07_narrator",
      "a1_08_puff",
      "a1_09_narrator",
      "a1_10_puff",
    ],
    // 45f — the beetle goes back to beetling; the camera stays on Puff, who
    // does not move and does not react. The deflation is the picture.
    gaps: { a1_09_narrator: 45 },
    tailFrames: 30,
  },
  {
    id: "s05_leaf",
    lines: [
      "a1_11_narrator",
      "a1_12_puff",
      "a1_13_narrator",
      "a1_14_puff",
      "a1_15_narrator",
      "a1_16_puff",
    ],
    // 54f — nine frames longer than Scene 4's, on purpose: by the second firing
    // the audience is ahead of the joke and the laugh lands in the silence.
    gaps: { a1_15_narrator: 54 },
    tailFrames: 30,
  },
  {
    id: "s06_nothing",
    lines: [
      "a1_17_puff",
      "a1_18_puff",
      "a1_19_narrator",
      "a1_20_puff",
      "a1_21_narrator",
      "a1_22_puff",
    ],
    // 24f — short. Sad, not tragic. Just long enough for the sentence to be
    // true for a moment before somebody argues with it.
    gaps: { a1_18_puff: 24 },
    tailFrames: 30,
  },
  {
    id: "s07_dandelion",
    lines: ["a1_23_narrator", "a1_24_narrator", "a1_25_puff", "a1_26_narrator", "a1_27_puff"],
    // 45f — the seeds fly in silence. A voice underneath would make it a
    // demonstration instead of an event.
    gaps: { a1_25_puff: 45 },
    tailFrames: 30,
  },
  {
    id: "s08_your_hand",
    lines: ["a1_28_narrator", "a1_29_narrator", "a1_30_narrator", "a1_31_puff"],
    // 45f — homework, not a joke. A child needs a second and a half to get a
    // hand up and moving, and if the next line lands first they will not do it.
    gaps: { a1_29_narrator: 45 },
    tailFrames: 30,
  },
  {
    id: "s09_balloon",
    lines: ["a1_32_narrator", "a1_33_puff", "a1_34_narrator", "a1_35_puff", "a1_36_narrator"],
    tailFrames: 32,
  },
  {
    id: "s10_bigword_air",
    lines: ["a1_37_narrator", "a1_38_puff", "a1_39_narrator", "a1_40_puff"],
    // 12f + 12f — the house Big Word rhythm from episode one. Short, but they
    // are what make the card feel like a prompt to join in rather than a slide.
    gaps: { a1_37_narrator: 12, a1_38_puff: 12 },
    tailFrames: 36,
  },
  {
    id: "s11_not_sorry",
    lines: ["a1_41_narrator", "a1_42_puff", "a1_43_puff"],
    // 30f — Puff holds a confident pose for a full second, alone on screen,
    // with the audience waiting to see whether it sticks.
    gaps: { a1_42_puff: 30 },
    // Scripted: the last "Sorry." gets the act's final second to itself.
    tailFrames: 45,
  },

  // --- ACT TWO — THE BIG LIFT ---------------------------------------------
  {
    id: "s12_sunny",
    lines: ["a2_01_narrator", "a2_02_sunny", "a2_03_puff", "a2_04_narrator", "a2_05_sunny"],
    tailFrames: 30,
  },
  {
    id: "s13_rock",
    lines: ["a2_06_narrator", "a2_07_narrator", "a2_08_narrator", "a2_09_puff", "a2_10_narrator"],
    // 45f — the rock does nothing. A deadpan-stillness gag whose entire
    // mechanism is the length of the silence.
    gaps: { a2_08_narrator: 45 },
    tailFrames: 30,
  },
  {
    id: "s14_ground_heats",
    // C1 — Sunny brackets the fact, from inside the diagram. No gaps: the joke
    // is the interruption landing on the beat, and a silence here would fight
    // a2_14_narrator's existing button ("Puff does not have feet.").
    lines: [
      "a2_11_narrator",
      "a2_11b_sunny",
      "a2_12_narrator",
      "a2_12b_sunny",
      "a2_13_puff",
      "a2_14_narrator",
    ],
    tailFrames: 32,
  },
  {
    id: "s15_up",
    lines: [
      "a2_15_narrator",
      "a2_16_puff",
      "a2_17_puff",
      "a2_18_narrator",
      "a2_19_puff",
      "a2_19b_puff",
      "a2_19c_narrator",
      "a2_19d_puff",
    ],
    gaps: {
      // 20f — the roll call lands. Four greetings and four little waves, and
      // then Puff is still there beaming at nobody in particular while the
      // audience works out that all four answered to the same name.
      a2_19b_puff: 20,
      // 24f — the held beat the button is fired from. Nothing enters it: no
      // wave, no bubble, no emotion change. Deadpan is stillness, and the laugh
      // lives in the silence rather than in the read (see a2_19d's `auto`).
      a2_19c_narrator: 24,
    },
    tailFrames: 30,
  },
  {
    id: "s16_rule_warm_air_rises",
    // C2 — Cloudia's one Act Two appearance. The rise carries the frame up into
    // the cloud band and the Cloud Hotel slides down past a Puff who never
    // stops climbing; the hotel being FULL is a2_22_narrator's point made as a
    // picture.
    lines: [
      "a2_20_narrator",
      "a2_21_puff",
      "a2_21b_cloudia",
      "a2_21c_puff",
      "a2_21d_cloudia",
      "a2_22_narrator",
    ],
    // 24f — Cloudia watches him go up past the awning and looks at camera.
    // Nothing enters this beat: no bell, no clipboard, no emotion change.
    gaps: { a2_21c_puff: 24 },
    tailFrames: 32,
  },
  {
    id: "s17_big_empty",
    // C3 — Puff calls down at the hole; the hole declines to comment.
    lines: [
      "a2_23_narrator",
      "a2_24_narrator",
      "a2_25_puff",
      "a2_25b_narrator",
      "a2_26_narrator",
    ],
    gaps: {
      // 45f — the gap alone on screen, silent. A six-year-old needs time to see
      // an emptiness: it has no edges to catch the eye and no motion to follow.
      a2_23_narrator: 45,
      // 24f — the hole. Nothing happens. The grass leans in around its edge and
      // does not move. Nothing enters this beat.
      a2_25_puff: 24,
    },
    tailFrames: 32,
  },
  {
    id: "s18_fwoosh",
    // C4 — one of them came in backwards.
    lines: [
      "a2_27_narrator",
      "a2_28_narrator",
      "a2_29_puff",
      "a2_30_narrator",
      "a2_30b_narrator",
    ],
    gaps: {
      // 36f — the rush happens under the silence. The first time the audience
      // sees wind, and it should arrive as a physical event.
      a2_28_narrator: 36,
      // 24f — hold on the backwards puff, which does not fix itself.
      a2_30_narrator: 24,
    },
    tailFrames: 30,
  },
  {
    id: "s19_bigword_wind",
    lines: ["a2_31_narrator", "a2_32_puff", "a2_33_narrator", "a2_34_puff"],
    // House Big Word rhythm.
    gaps: { a2_31_narrator: 12, a2_32_puff: 12 },
    tailFrames: 36,
  },
  {
    id: "s20_am_i_the_wind",
    // C5 — the roll call fires a second time, on a wide shot that is already
    // hundreds of identical puffs. Two lines, no new staging.
    lines: [
      "a2_35_puff",
      "a2_36_narrator",
      "a2_37_puff",
      "a2_38_narrator",
      "a2_38b_puff",
      "a2_38c_narrator",
    ],
    gaps: {
      // 30f — Puff looks out across the whole turning circuit. Nothing else
      // moves in the foreground.
      a2_38_narrator: 30,
      // 30f — nothing enters this. No reaction, no bob, no emotion change; the
      // crowd keeps circulating behind him and he waits.
      a2_38b_puff: 30,
    },
    // Scripted: one flat word needs somewhere to land — same call as
    // a3_20_narrator ("Him again.").
    tailFrames: 40,
  },
  {
    id: "s21_sunny_correct",
    lines: [
      "a2_39_sunny",
      "a2_40_puff",
      "a2_41_sunny",
      // C6 — Puff sees the fourth brag coming. No gap: the anticipation only
      // works if a2_42 lands on top of it.
      "a2_41b_puff",
      "a2_42_sunny",
      "a2_43_sunny",
      "a2_44_narrator",
      "a2_45_narrator",
      "a2_45b_narrator",
    ],
    gaps: {
      // 45f — Sunny alone in frame, holding an enormous smug grin and saying
      // nothing. The grown-up laugh goes here. Emotion lead 0 on this scene.
      a2_44_narrator: 45,
      // 36f — the promise hangs, and THEN the refusal. This used to be one
      // sentence with a full stop in the middle of it and the second viewer
      // heard it as one breath; kokoro cannot pause inside a line, so the pause
      // is a real silence between two clips. Nothing enters it: Sunny is
      // already frozen at the top of his grin from the beat above, the camera
      // finished its push before that beat opened, and Puff left under a2_44.
      a2_45_narrator: 36,
    },
    tailFrames: 34,
  },
  {
    id: "s22_not_sorry",
    lines: ["a2_46_puff", "a2_47_puff", "a2_48_puff"],
    // 30f — Puff hangs there, hearing himself do it. The turn is in the
    // silence, not in the next line.
    gaps: { a2_46_puff: 30 },
    tailFrames: 34,
  },

  // --- ACT THREE — AIR WITH A JOB -----------------------------------------
  {
    id: "s23_beach",
    lines: ["a3_01_narrator", "a3_02_puff", "a3_03_narrator", "a3_04_puff"],
    tailFrames: 30,
  },
  {
    id: "s24_hot_sand_cool_sea",
    lines: [
      "a3_05_narrator",
      "a3_06_puff",
      "a3_07_narrator",
      "a3_08_puff",
      "a3_09_narrator",
      // C7 — "Same me!", leaning in over the seam of the split screen.
      "a3_09b_sunny",
      "a3_10_narrator",
    ],
    // 24f — both thermometers on screen, Sunny gone, nobody talking. The
    // comparison is the fact; let it be looked at. MOVED from a3_09_narrator to
    // the line C7 inserted after it, so the thermometers still get their
    // silence.
    gaps: { a3_09b_sunny: 24 },
    tailFrames: 30,
  },
  {
    id: "s25_beach_makes_wind",
    lines: ["a3_11_narrator", "a3_12_puff", "a3_13_narrator", "a3_14_puff", "a3_15_narrator"],
    tailFrames: 32,
  },
  {
    id: "s26_bigword_sea_breeze",
    lines: ["a3_16_narrator", "a3_17_narrator", "a3_18_puff", "a3_19_sunny", "a3_20_narrator"],
    // 30f — Sunny holding the pose, enormously pleased, over a card that is not
    // about him.
    gaps: { a3_19_sunny: 30 },
    // Scripted: two flat words need somewhere to land.
    tailFrames: 40,
  },
  {
    id: "s27_sailboat",
    // C8 — try-fail-succeed, built in front of the clip that already existed.
    // `a3_24_puff` is untouched; the polite push and the flat correction go in
    // ahead of it, and the small bubble is the same words as the big one.
    lines: [
      "a3_21_narrator",
      "a3_22_puff",
      "a3_23_narrator",
      "a3_23b_puff",
      "a3_23c_narrator",
      "a3_24_puff",
      "a3_25_narrator",
      "a3_26_puff",
    ],
    // 30f — the boat travels about an inch and stops. The sail hangs. Nothing
    // else happens. Nothing enters this beat.
    gaps: { a3_23b_puff: 30 },
    tailFrames: 30,
  },
  {
    id: "s28_turbines",
    lines: ["a3_27_narrator", "a3_28_narrator", "a3_29_puff", "a3_30_narrator", "a3_31_puff"],
    // 36f — hold on the night light in the dark bedroom, silent, while the
    // audience gets there on their own. Then the shout.
    gaps: { a3_30_narrator: 36 },
    tailFrames: 32,
  },
  {
    id: "s29_seeds",
    lines: ["a3_32_narrator", "a3_33_puff", "a3_34_narrator", "a3_35_puff", "a3_36_narrator"],
    // 60f, trailing — the hillside of dandelions, moving gently, with Puff not
    // even in frame. The emotional beat the ending is banked against.
    gaps: { a3_36_narrator: 60 },
    // Short, because the held beat above *is* this scene's tail.
    tailFrames: 14,
  },
  {
    id: "s30_door_to_door",
    lines: [
      "a3_37_narrator",
      "a3_38_cloudia",
      "a3_39_narrator",
      "a3_40_cloudia",
      "a3_41_drip",
      "a3_42_narrator",
    ],
    tailFrames: 32,
  },
  {
    id: "s31_the_hill",
    lines: [
      "a3_43_narrator",
      "a3_44_narrator",
      "a3_45_puff",
      "a3_46_narrator",
      "a3_47_puff",
      "a3_48_narrator",
      "a3_49_puff",
    ],
    gaps: {
      // 45f — Puff looks at the kite. The audience is a full beat ahead of him
      // and gets to sit in it.
      a3_46_narrator: 45,
      // 45f — Puff draws in the biggest breath of his life. Grass bends.
      a3_48_narrator: 45,
      // 75f, trailing — the longest silence in the episode and the payoff of
      // the whole thing. The kite climbs in silence. If any line lands inside
      // these seventy-five frames, the episode does not have an ending.
      a3_49_puff: 75,
    },
    tailFrames: 18,
  },
  {
    id: "s32_what_they_can_see",
    lines: ["a3_50_narrator", "a3_51_narrator", "a3_52_puff", "a3_53_narrator", "a3_54_puff"],
    gaps: {
      // 45f — third and final firing of the repetition gag. This time the
      // audience knows the answer before Puff does. Hold on Puff; he takes his
      // time. Emotion lead 0.
      a3_51_narrator: 45,
      // 45f — let it sit. This is the line the whole character was built to say.
      a3_52_puff: 45,
    },
    // 135f, up from 40 (2026-08-01): "look what they CAN see" now has a
    // demonstration. Puff turns, fills up, and flicks the beetle onto his
    // back — the one thing on that hill they CAN see happening — and the
    // flipped beetle then gets a beat of stunned stillness before the
    // "Meanwhile." cut. The choreography in act3.tsx keys off this tail.
    tailFrames: 135,
  },
  {
    // C9 — the cutaway. Scene 13's exact framing, five minutes later, re-lit
    // late afternoon: the rock has not moved a muscle. `a3_55_narrator` is not
    // a re-recording, it is the Scene 13 clip shared through `sameAs`, which is
    // what makes the repeat identical rather than merely similar.
    id: "s32b_the_rock_again",
    lines: ["a3_54b_narrator", "a3_55_narrator", "a3_56_narrator"],
    gaps: {
      // 18f — "Meanwhile." lands on the cut and then gets out of the way. The
      // scene is titled Meanwhile and now says so: without the marker the cut
      // reads as an answer to a3_54_puff ("look what they CAN see") instead of
      // as a deliberate non-sequitur.
      a3_54b_narrator: 18,
      // 45f — the rock does nothing. Same length as Scene 13's beat, same
      // reason: the length of the silence is the entire mechanism.
      a3_55_narrator: 45,
    },
    // Hold on the rock, then cut to the recap.
    tailFrames: 45,
  },

  // --- RECAP --------------------------------------------------------------
  {
    id: "s33_chant",
    lines: ["rc_01_narrator", "rc_02_puff", "rc_03_sunny", "rc_04_cloudia", "rc_05_narrator"],
    tailFrames: 32,
  },
  { id: "s34_all_four", lines: ["rc_06_narrator", "rc_07_narrator"], tailFrames: 44 },
  {
    id: "s35_mind_blower",
    // C10 — Puff does Cloudia. `rc_11_puff` is kept: the awe is the pedagogy,
    // and this is the flat button after it.
    lines: [
      "rc_08_narrator",
      "rc_09_narrator",
      "rc_10_narrator",
      "rc_11_puff",
      "rc_11b_puff",
      "rc_12_narrator",
    ],
    // 12f — short. Just enough for the awe to finish before the joke starts.
    gaps: { rc_11_puff: 12 },
    tailFrames: 36,
  },
  {
    id: "s36_tease",
    lines: ["rc_13_narrator", "rc_14_sunny", "rc_15_narrator", "rc_16_sunny", "rc_17_puff"],
    gaps: {
      // 45f — Sunny holds his pose while the sentence catches up with him.
      // Emotion lead 0: his face must not fall until the beat is nearly over.
      rc_15_narrator: 45,
      // 30f.
      rc_16_sunny: 30,
    },
    tailFrames: 60,
  },
];

export function timeline() {
  return buildTimeline(
    SCRIPT.map((spec) => ({
      id: spec.id,
      turns: turnsOf(spec.lines, { gaps: spec.gaps }),
      minFrames: spec.minFrames,
      tailFrames: spec.tailFrames ?? 30,
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

export const WindVideo: React.FC = () => {
  const { scenes } = timeline();
  return (
    <Series>
      {scenes.map((scene) => {
        const Scene = SCENES[scene.id];
        return (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
            {/* Every scene's audio is mounted here, staged or not, so a
                placeholder plays the real lines in the real voices. */}
            <DialogueAudio scene={scene} />
            {Scene ? <Scene scene={scene} /> : <ScenePlaceholder scene={scene} />}
          </Series.Sequence>
        );
      })}
    </Series>
  );
};
