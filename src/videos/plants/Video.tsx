import React from "react";
import { Series } from "remotion";
import { DialogueAudio, buildTimeline, type TimedScene } from "../../lib/narration";
import { FPS, HEIGHT, WIDTH, ScenePlaceholder, turnsOf } from "./scenes/common";
import { COLD_OPEN_SCENES } from "./scenes/coldOpen";

// "Pip and the Sunshine Kitchen" — Little Big World, episode four: what plants
// eat (nothing — they cook), and who the kitchen actually runs on.
//
// Structure, and where to add things (identical to episodes one through three,
// deliberately):
//
//   Video.tsx (this file)  the whole 29-scene timeline. Every scene's real
//                          dialogue turns live in SCRIPT below, keyed by
//                          script.md's line keys, so the episode's duration is
//                          real whether or not a scene has been staged.
//   scenes/common.tsx      the shared kit: turn plumbing, the speaker-staging
//                          API, the cast marks, the meadow, ScenePlaceholder.
//   scenes/Pip.tsx         the one new body, and her gesture rig.
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
// script.md carries **forty-four held beats with exact frame counts** and a
// reason each, and they become the `gaps` below verbatim. Its own words: "These
// numbers are the script's; raising one is a note, lowering one is a change to
// the joke." Every number in a `gaps` block traces to a `HELD BEAT` line in the
// screenplay; the comment quotes its reason.
//
// The spine holds are the five stamp-chain firings, the break (75f), the
// promotion (75f) and the Scene-26 resolution (75f). Held beats are
// **spine-only**: everywhere else, ensemble business is allowed in (the ep-3
// retro rule — wall-to-wall stillness starves the comedy it protects).
//
// Every scene that contains a held beat also uses `NO_LEAD` for its emotion
// cues (`scenes/common.tsx`), because the kit's default eight-frame lead lands
// a reaction inside the silence the joke is being held for.
//
// Tails are the builder's, with one shape the script fixes: a held beat that is
// *trailing* — the last line of Scenes 16, 22, 24 and 26 buys silence that runs
// to the cut — means those scenes carry a short tail rather than the house 30,
// because the beat already is the tail.
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
  /**
   * Silence *before* the scene's first line — a scripted held beat with no
   * line in front of it to hang a `gap` on. `buildTimeline` lays turns out
   * from frame 0, so this is applied in `timeline()` below by sliding the
   * scene's turns and lengthening it by the same amount: the scene still gets
   * exactly its audio plus its scripted silences, and nothing is hand-timed.
   */
  leadFrames?: number;
  minFrames?: number;
  tailFrames?: number;
};

const SCRIPT: SceneSpec[] = [
  // --- COLD OPEN ----------------------------------------------------------
  {
    id: "s01_breath",
    lines: ["co_01_narrator", "co_02_narrator", "co_03_narrator", "co_04_narrator"],
    gaps: {
      // 45f — "The kid inhales — the silhouette's chest visibly rises — and
      // BLOWS. The seed head detonates into a slow drifting galaxy across the
      // whole frame, in silence. This is the show letting a picture land."
      co_03_narrator: 45,
    },
    tailFrames: 30,
  },
  {
    id: "s02_ride",
    lines: [
      "co_05_pip",
      "co_06_narrator",
      "co_07_pip",
      "co_08_narrator",
      "co_09_pip",
    ],
    gaps: {
      // 36f — ROLL CALL, FIRING 1, the unbothered button: "The seeds drift on,
      // identically. Nothing reacts." Nobody replies inside the naming and
      // nothing enters this beat.
      co_08_narrator: 36,
    },
    tailFrames: 30,
  },
  {
    id: "s03_planted",
    lines: [
      "co_10_narrator",
      "co_11_pip",
      "co_12_pip",
      "co_13_narrator",
      "co_14_pip",
      "co_15_narrator",
      "co_16_pip",
      "co_17_pip",
      "co_18_narrator",
    ],
    gaps: {
      // 45f — "Nothing whatsoever happens. Pip strains — the whole seed tips
      // one degree, and settles back. That is the entire locomotion budget of
      // the rest of her life."
      co_11_pip: 45,
      // 45f — "Still nothing. She stops trying, visibly files the result, and
      // is already over it."
      co_12_pip: 45,
      // 30f — the hero thesis. "Let it stand in the air… the last time the
      // episode ever treats her stillness as a limitation."
      co_14_pip: 30,
      // 45f — **STAMP CHAIN, SOURCE RECORDING, FIRING 1 of 5.** Grading the
      // dirt. The same clip fires at a1_31, a2_27, a3_16 and a3_79. Her
      // highest grade, her only grade, and the episode's spine gag.
      co_17_pip: 45,
    },
    tailFrames: 30,
  },
  { id: "s04_title", lines: ["co_19_narrator"], tailFrames: 45 },

  // --- ACT ONE — THE LIGHT --------------------------------------------------
  {
    id: "s05_sunrise",
    lines: [
      "a1_01_narrator",
      "a1_02_sunny",
      "a1_03_sunny",
      "a1_04_narrator",
      "a1_05_narrator",
      "a1_06_sunny",
      "a1_07_narrator",
      "a1_08_pip",
    ],
    gaps: {
      // 45f — "The wide: a field of bowed stems and one vertical seed. Nothing
      // moves. This is the engine of the episode in one picture."
      a1_05_narrator: 45,
    },
    tailFrames: 30,
  },
  {
    id: "s06_order",
    lines: [
      "a1_09_pip",
      "a1_10_pip",
      "a1_11_narrator",
      "a1_12_sunny",
      "a1_13_sunny",
      "a1_14_pip",
      "a1_15_pip",
      "a1_16_narrator",
    ],
    gaps: {
      // 45f — "Deadpan, slow, and held. This is also the plant of the
      // not-saying-it runner: the entire episode is now visibly 'how long can
      // she avoid the obvious supplier.'"
      a1_15_pip: 45,
    },
    tailFrames: 30,
  },
  {
    id: "s07_moonlight",
    lines: [
      "a1_17_narrator",
      "a1_18_pip",
      "a1_19_narrator",
      "a1_20_ray",
      "a1_21_narrator",
      "a1_22_pip",
      "a1_23_ray",
      "a1_24_ray",
      "a1_25_pip",
      "a1_26_ray",
      "a1_27_narrator",
      "a1_28_pip",
      "a1_29_ray",
      "a1_30_pip",
      "a1_31_pip",
      "a1_32_ray",
      "a1_33_pip",
    ],
    gaps: {
      // 36f — "The disclosure lands. Ray holds perfectly still — a pedant
      // honouring his own compulsory honesty and hating every second of where
      // it points."
      a1_24_ray: 36,
      // 36f — STAMP CHAIN, FIRING 2 of 5 (grading the moonlight).
      a1_31_pip: 36,
    },
    tailFrames: 30,
  },
  {
    id: "s08_dawn_first",
    lines: [
      "a1_34_narrator",
      "a1_35_blue",
      "a1_36_ray",
      "a1_37_blue",
      "a1_38_pip",
      "a1_39_blue",
      "a1_40_narrator",
    ],
    gaps: {
      // 45f — "The resident's trump, flat. Blue freezes mid-ricochet for the
      // whole beat, recalculating." The only frame in the series Blue holds
      // still, and the beat is the reason.
      a1_38_pip: 45,
    },
    tailFrames: 30,
  },
  {
    id: "s09_not_open",
    lines: [
      "a1_41_narrator",
      "a1_42_ray",
      "a1_43_pip",
      "a1_44_ray",
      "a1_45_ray",
      "a1_46_ray",
      "a1_47_pip",
      "a1_48_narrator",
    ],
    gaps: {
      // 45f — "One beam arrives, hits dirt, bounces off, gone. Silence. The
      // failure is the picture."
      a1_41_narrator: 45,
    },
    tailFrames: 30,
  },
  {
    id: "s10_puddle",
    lines: [
      "a1_49_narrator",
      "a1_50_pip",
      "a1_51_pip",
      "a1_52_ray",
      "a1_53_narrator",
      "a1_54_pip",
      "a1_55_ray",
      "a1_56_sunny",
      "a1_57_sunny",
      "a1_58_ray",
      "a1_59_pip",
      "a1_60_narrator",
    ],
    gaps: {
      // 45f — "The puddle declines by existing. Nothing moves."
      a1_50_pip: 45,
      // 30f — "A pedant's guarantee, hanging there in all its uselessness."
      a1_55_ray: 30,
    },
    tailFrames: 30,
  },

  // --- ACT TWO — THE WATER --------------------------------------------------
  { id: "s11_rain_campaign", lines: ["a2_01_pip", "a2_02_narrator", "a2_03_pip"], tailFrames: 30 },
  {
    // CUTTABLE (script.md, Scene 12): if this goes, `a2_12_narrator` follows
    // `a2_03_pip` cleanly and nothing else moves.
    id: "s12_cloud_hotel",
    lines: [
      "a2_04_cloudia",
      "a2_05_cloudia",
      "a2_06_pip",
      "a2_07_cloudia",
      "a2_08_cloudia",
      "a2_09_narrator",
      "a2_10_pip",
      "a2_11_cloudia",
    ],
    tailFrames: 30,
  },
  {
    id: "s13_weather",
    lines: [
      "a2_12_narrator",
      "a2_13_drip",
      "a2_14_narrator",
      "a2_15_pip",
      "a2_16_drip",
      "a2_17_pip",
      "a2_18_drip",
      "a2_19_pip",
      "a2_20_drip",
    ],
    gaps: {
      // 36f — "THE WEATHER versus a line on a clipboard. Drip decides,
      // visibly, whether to be outraged or flattered."
      a2_19_pip: 36,
    },
    // THE VOLCANO STIR lives inside this scene's rain wide: one thin curl of
    // steam off the summit as the rain sheet crosses it, ~60f, wordless,
    // unremarked. It is the episode's entire volcano budget and it does not
    // get a beat of its own — the rain just keeps falling.
    tailFrames: 30,
  },
  {
    id: "s14_straw",
    lines: [
      "a2_21_narrator",
      "a2_22_drip",
      "a2_23_drip",
      "a2_24_narrator",
      "a2_25_drip",
      "a2_26_pip",
      "a2_27_pip",
      "a2_28_drip",
      "a2_29_narrator",
      "a2_30_drip",
    ],
    gaps: {
      // 30f — STAMP CHAIN, FIRING 3 of 5 (grading the water).
      a2_27_pip: 30,
      // 36f — "Outrage, hanging."
      a2_28_drip: 36,
      // 45f — "It is the highest grade she gives." SOURCE RECORDING; re-fires
      // byte-identical at a3_80. Button unseasoned; deadpan is stillness.
      a2_29_narrator: 45,
    },
    tailFrames: 30,
  },
  {
    id: "s15_credit",
    lines: [
      "a2_31_drip",
      "a2_32_ray",
      "a2_33_drip",
      "a2_34_ray",
      "a2_35_pip",
      "a2_36_ray",
      "a2_37_sunny",
      "a2_38_sunny",
      "a2_39_ray",
      "a2_40_pip",
      "a2_41_ray",
      "a2_42_narrator",
    ],
    tailFrames: 30,
  },
  {
    id: "s16_leaf",
    lines: [
      "a2_43_drip",
      "a2_44_drip",
      "a2_45_pip",
      "a2_46_narrator",
      "a2_47_pip",
      "a2_48_narrator",
      "a2_49_pip",
      "a2_50_ray",
      "a2_51_drip",
      "a2_52_pip",
    ],
    gaps: {
      // 36f — "Flat, slow, final. The cold-open riddle gets its first
      // half-answer as chef's indignation."
      a2_45_pip: 36,
      // 45f, trailing — "Soil stays an unexplained given — that is her complete
      // account of it, the episode never says more, and the end card cashes it
      // in."
      a2_52_pip: 45,
    },
    // Short, because the held beat above *is* this scene's tail.
    tailFrames: 14,
  },
  {
    id: "s17_air_order",
    lines: ["a2_53_pip", "a2_54_pip", "a2_55_puff"],
    gaps: {
      // 45f — "Empty sky. Grass stirs, just barely." Then Puff's catch-phrase
      // arrives AS his entrance: an invisible character cannot be announced by
      // a narrator pointing at him.
      a2_54_pip: 45,
    },
    tailFrames: 30,
  },

  // --- ACT THREE — THE AIR, AND THE KITCHEN --------------------------------
  {
    id: "s18_guest",
    lines: [
      "a3_01_puff",
      "a3_02_pip",
      "a3_03_puff",
      "a3_04_narrator",
      "a3_05_pip",
      "a3_06_narrator",
    ],
    tailFrames: 30,
  },
  {
    id: "s19_first_breath",
    lines: [
      "a3_07_narrator",
      "a3_08_puff",
      "a3_09_pip",
      "a3_10_puff",
      "a3_11_narrator",
      "a3_12_pip",
      "a3_13_puff",
      "a3_14_narrator",
      "a3_15_puff",
      "a3_16_pip",
      "a3_17_puff",
    ],
    gaps: {
      // 30f — STAMP CHAIN, FIRING 4 of 5 (grading the air).
      a3_16_pip: 30,
    },
    tailFrames: 30,
  },
  {
    id: "s20_tree_of_air",
    lines: [
      "a3_18_narrator",
      "a3_19_drip",
      "a3_20_puff",
      "a3_21_narrator",
      "a3_22_narrator",
      "a3_23_puff",
      "a3_24_puff",
      "a3_25_ray",
      "a3_26_pip",
    ],
    gaps: {
      // 60f — "The mind-blower gets the long hold. The tree stands there,
      // enormous, being made of sky."
      a3_22_narrator: 60,
    },
    tailFrames: 30,
  },
  {
    id: "s21_crumb",
    lines: [
      "a3_27_narrator",
      "a3_28_narrator",
      "a3_29_narrator",
      "a3_30_pip",
      "a3_31_ray",
      "a3_32_ray",
      "a3_33_pip",
      "a3_34_ray",
      "a3_35_ray",
      "a3_36_ray",
      "a3_37_pip",
      "a3_38_narrator",
    ],
    gaps: {
      // 60f — "The crumb. The whole frame. Nothing else."
      a3_29_narrator: 60,
      // 45f — "The maths hangs. Everyone on stage can see where it points.
      // Nobody looks there."
      a3_35_ray: 45,
      // 60f — "It is mostly him." The series credit-allocation device in
      // signature form. Deadpan is stillness; nothing enters this beat.
      a3_36_ray: 60,
      // 75f — **THE BREAK.** "It will not do." — a new recording, deliberately
      // NOT aliased: the first time in her life her highest grade has failed.
      // The longest hold so far.
      a3_37_pip: 75,
    },
    tailFrames: 30,
  },
  {
    id: "s22_stall",
    lines: [
      "a3_39_narrator",
      "a3_40_drip",
      "a3_41_puff",
      "a3_42_ray",
      "a3_43_ray",
      "a3_44_narrator",
      "a3_45_pip",
    ],
    gaps: {
      // 24f — "He hears himself."
      a3_42_ray: 24,
      // 45f — THE LEAN, UNCORRECTED: "Pip's stem leaned. This time, she let
      // it." The runner's resolution begins here, silently — the body said it
      // first.
      a3_44_narrator: 45,
      // 45f, trailing — "One word, slow, and the act turns on it."
      a3_45_pip: 45,
    },
    // Short, because the held beat above *is* this scene's tail.
    tailFrames: 14,
  },
  {
    id: "s23_hire",
    lines: [
      "a3_46_narrator",
      "a3_47_pip",
      "a3_48_narrator",
      "a3_49_pip",
      "a3_50_pip",
      "a3_51_pip",
      "a3_52_pip",
      "a3_53_pip",
      "a3_54_sunny",
      "a3_55_sunny",
      "a3_56_sunny",
      "a3_57_ray",
      "a3_58_sunny",
      "a3_59_pip",
      "a3_60_narrator",
    ],
    gaps: {
      // 45f — "The fact everyone spent three acts not saying, said, flat,
      // complete."
      a3_50_pip: 45,
      // 75f — **THE PROMOTION.** "He is the oven." The episode's biggest held
      // beat, shared with two others. Nothing enters it. Her stem is leaning
      // the whole time and she is letting it.
      a3_52_pip: 75,
      // 60f — after "The job is yours. Shift starts at dawn."
      a3_53_pip: 60,
      // 45f — after "I know." His quietest line in four episodes.
      a3_54_sunny: 45,
      // 45f — HA! HA! firing 4 of 5, "the biggest one, by placement, not by
      // read: same flat-identical clip, detonated by the silence around it."
      a3_55_sunny: 45,
    },
    tailFrames: 30,
  },
  {
    id: "s24_full_power",
    lines: [
      "a3_61_narrator",
      "a3_62_sunny",
      "a3_63_pip",
      "a3_64_narrator",
      // THE BIG WORD — PHOTOSYNTHESIS, one syllable per hero, each slammed on
      // by its owner. Everyone cheers their syllable except Pip, who files
      // hers, which is the joke. **Measure the real clip midpoints
      // (`silencedetect`) for the card's `beats`; do not split evenly.**
      "a3_65_drip",
      "a3_66_puff",
      "a3_67_ray",
      "a3_68_pip",
      "a3_69_sunny",
      "a3_70_narrator",
      "a3_71_ray",
      "a3_72_narrator",
    ],
    gaps: {
      // 36f, trailing — "Ray stands there, having said it perfectly,
      // unclapped-for."
      a3_72_narrator: 36,
    },
    // Short, because the held beat above *is* this scene's tail.
    tailFrames: 14,
  },
  {
    id: "s25_stored_sunshine",
    lines: [
      "a3_73_narrator",
      "a3_74_sunny",
      "a3_75_narrator",
      "a3_75b_narrator",
      "a3_76_narrator",
      "a3_77_sunny",
    ],
    gaps: {
      // 24f — the showrunner's split clip: "Annoyingly." / hang / "That is
      // completely true." The ep-1 echo earns a real hang, and a full stop
      // cannot buy one.
      a3_75_narrator: 24,
      // 45f — "Mind-blower #3 gets its hold." You have been eating sunshine
      // your whole life.
      a3_76_narrator: 45,
    },
    tailFrames: 30,
  },
  {
    id: "s26_button",
    lines: ["a3_78_narrator", "a3_79_pip", "a3_80_narrator"],
    gaps: {
      // 75f — STAMP CHAIN, FIRING 5 of 5, THE RESOLUTION: her concession,
      // delivered as her highest grade, in the identical flat clip she graded
      // dirt with. Longest hold in the episode, shared with Scene 23's.
      a3_79_pip: 75,
      // 45f, trailing — "Sunny says nothing — his first silent beat in four
      // episodes. His glow swells about ten percent. Nothing else moves."
      a3_80_narrator: 45,
    },
    // Short, because the held beat above *is* this scene's tail.
    tailFrames: 14,
  },

  // --- RECAP ---------------------------------------------------------------
  {
    id: "s27_curtain_call",
    lines: [
      "rc_01_narrator",
      "rc_02_drip",
      "rc_03_puff",
      "rc_04_ray",
      "rc_05_sunny",
      "rc_06_sunny",
      // The reprise: the five chant syllables re-fire byte-identical as the
      // card's syllables light up in owner order.
      "rc_07_drip",
      "rc_08_puff",
      "rc_09_ray",
      "rc_10_pip",
      "rc_11_sunny",
      "rc_12_narrator",
      "rc_13_pip",
    ],
    tailFrames: 32,
  },
  {
    id: "s28_your_breath",
    lines: [
      "rc_14_narrator",
      "rc_15_narrator",
      "rc_16_narrator",
      "rc_17_puff",
      "rc_18_narrator",
    ],
    gaps: {
      // 45f — **This one is not a joke, it is homework.** "A child needs the
      // time to actually do it, and if the next line lands first they will
      // not." The kid's silhouette chest rises with the audience.
      rc_15_narrator: 45,
      // 45f — after "A plant breathed it out."
      rc_16_narrator: 45,
    },
    tailFrames: 30,
  },
  {
    id: "s29_goodnight",
    lines: [
      "rc_19_narrator",
      // ROLL CALL, FIRING 2 (goodbye) — same five siblings, same order, same
      // fixed shape as the cold open's.
      "rc_20_pip",
      "rc_21_narrator",
      "rc_22_pip",
      "rc_23_narrator",
      "rc_24_pip",
    ],
    gaps: {
      // 45f — "Nobody was going anywhere."
      rc_21_narrator: 45,
      // 45f — "See you tomorrow." Unseasoned button, deadpan stillness:
      // nothing enters this beat.
      rc_22_pip: 45,
    },
    tailFrames: 45,
  },
];

export function timeline() {
  const built = buildTimeline(
    SCRIPT.map((spec) => ({
      id: spec.id,
      turns: turnsOf(spec.lines, { gaps: spec.gaps }),
      minFrames: spec.minFrames,
      tailFrames: spec.tailFrames ?? 30,
    })),
    FPS,
  );
  // Silent opens (`leadFrames`), applied after the fact: slide a scene's turns
  // forward by its lead, add the same number of frames to the scene, and
  // re-flow every scene's `from` behind it. A scene with no lead comes through
  // byte-identical — the whole episode's timing is unchanged except where a
  // `leadFrames` is written down. (Nothing uses it yet; the mechanism is
  // episode three's and travels with the skeleton.)
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
};

export const PlantsVideo: React.FC = () => {
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
