import React from "react";
import { Series } from "remotion";
import { DialogueAudio, buildTimeline, type TimedScene } from "../../lib/narration";
import { FPS, HEIGHT, WIDTH, ScenePlaceholder, turnsOf } from "./scenes/common";
import { COLD_OPEN_SCENES } from "./scenes/coldOpen";
import { ACT1_SCENES } from "./scenes/act1";
import { ACT2_SCENES } from "./scenes/act2";
import { ACT3_SCENES } from "./scenes/act3";
import { RECAP_SCENES } from "./scenes/recap";

// "Ember and the Mountain That Said Good Morning" — Little Big World, episode
// five: volcanoes and the rock cycle, and the fact that the ground is not
// finished.
//
// Structure, and where to add things (identical to episodes one through four,
// deliberately):
//
//   Video.tsx (this file)  the whole 31-scene timeline. Every scene's real
//                          dialogue turns live in SCRIPT below, keyed by
//                          script.md's line keys, so the episode's duration is
//                          real whether or not a scene has been staged.
//   scenes/common.tsx      the shared kit: turn plumbing, the speaker-staging
//                          API, the cast marks, the two worlds, the plates,
//                          the kid, the sandcastle, ScenePlaceholder.
//   scenes/Ember.tsx       the hero's body and the magma crowd.
//   scenes/Volcano.tsx     four episodes of scenery, with a face.
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
// script.md carries held beats with exact frame counts and a reason each, and
// they become the `gaps` below verbatim. Its own words: "These numbers are the
// script's; raising one is a note, lowering one is a change to the joke."
//
// **Two of them are identity rather than comedy, and they are declared once in
// the script instead of per line** — which means most of the numbers below are
// them:
//
//   THE VOLCANO'S 48f   before EVERY one of his seven lines. A new series
//                       record (Red's was 16f), and it is the mountain
//                       deciding to move. In this kit a gap sits *after* a
//                       line, so his approach is a 48 on whatever precedes him
//                       — or, when he opens a scene, that scene's
//                       `leadFrames`.
//   ROCK'S 24f          before every one of his, fixed, never escalated. It is
//                       the character, not the gag's mechanism (synthesis
//                       ruling), so it is the same 24 in front of a punchline
//                       and in front of "No."
//
// The spine holds are the wake (45f + 48f lead, then 60f), the ceremony
// (60f / 36f / **180f — the series record**), the four chain firings, the
// naked stamp (45f) and the break (45f). Held beats are **spine-only**:
// everywhere else, ensemble business is allowed in (the ep-3 retro rule —
// wall-to-wall stillness starves the comedy it protects).
//
// Every scene that contains a held beat also uses `NO_LEAD` for its emotion
// cues (`scenes/common.tsx`), because the kit's default eight-frame lead lands
// a reaction inside the silence the joke is being held for.
//
// Tails are the builder's, with one shape the script fixes: a *trailing* held
// beat — the last line of Scenes 2, 13, 21, 23, 26, 28 buys silence that runs
// to the cut — means those scenes carry a short tail rather than the house 30,
// because the beat already is the tail.
//
// **ONE GAP BELOW IS NOT THE SCRIPT'S AND IS FLAGGED AS SUCH**: the 24f after
// `a1_02_narrator`, so the MAGMA card lands alone. STYLE is explicit that a
// visual punchline — "card, reaction, reveal" — gets a held beat and that the
// next line never begins under it, and the script's Big Word table asks for a
// `WordCard` there without buying one. Showrunner note at handback: cut it to
// 0 and the card plays under `a1_03`.
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
   * line in front of it to hang a `gap` on. `buildTimeline` lays turns out from
   * frame 0, so this is applied in `timeline()` below by sliding the scene's
   * turns and lengthening it by the same amount: the scene still gets exactly
   * its audio plus its scripted silences, and nothing is hand-timed.
   *
   * This episode is the first to really use it — three of the four are a
   * volcano or Rock approach gap landing on a scene's first line.
   */
  leadFrames?: number;
  minFrames?: number;
  tailFrames?: number;
};

const SCRIPT: SceneSpec[] = [
  // --- COLD OPEN ----------------------------------------------------------
  {
    // Scene 1 — the last quiet morning. The volcano is on the horizon and
    // nobody looks at him; the kid builds; Sunny is five-for-five.
    id: "s01_sandcastle",
    lines: [
      "co_01_narrator",
      "co_02_narrator",
      "co_03_narrator",
      "co_04_sunny",
      "co_05_sunny",
      "co_06_sunny",
      "co_07_sunny",
      "co_08_narrator",
    ],
    tailFrames: 30,
  },
  {
    // Scene 2 — the knock.
    id: "s02_knock",
    lines: ["co_09_narrator", "co_10_sunny", "co_11_narrator"],
    gaps: {
      // 30f — "The wobble, the pat." Then Sunny, instantly, at full wattage:
      // the wake-claim, banked since episode two and saved on purpose twice.
      co_09_narrator: 30,
      // 36f, trailing — "No verdict, no doubt cast — the claim just sits there,
      // armed. The Narrator ALWAYS rules on him; the withheld ruling is the
      // fuse audibly hissing."
      co_11_narrator: 36,
    },
    // Short, because the held beat above *is* this scene's tail.
    tailFrames: 14,
  },
  {
    // Scene 3 — the rules end, and the camera turns.
    id: "s03_rules_end",
    lines: ["co_12_narrator", "co_13_narrator"],
    gaps: {
      // 30f — after "Those were the rules."
      co_12_narrator: 30,
    },
    // 60, and it is the longest tail in the episode on purpose: THE TURN lives
    // in it. "The camera does the thing it has never done in five episodes."
    // The move needs to finish before the cut, in silence, with nothing else
    // on screen.
    tailFrames: 60,
  },
  { id: "s04_title", lines: ["co_14_narrator"], tailFrames: 45 },

  // --- ACT ONE — DOWNSTAIRS -------------------------------------------------
  {
    // Scene 5 — the world's basement. MAGMA.
    id: "s05_basement",
    lines: [
      "a1_01_narrator",
      "a1_02_narrator",
      "a1_03_narrator",
      "a1_04_narrator",
      "a1_05_narrator",
      "a1_06_sunny",
      "a1_07_narrator",
    ],
    gaps: {
      // 24f — **BUILDER'S, NOT THE SCRIPT'S** (see the header note): the MAGMA
      // card lands on the last word of this line and STYLE will not let the
      // next one start underneath it.
      a1_02_narrator: 24,
    },
    tailFrames: 30,
  },
  {
    // Scene 6 — Ember, mid-sentence.
    id: "s06_ember",
    lines: [
      "a1_08_ember",
      "a1_09_narrator",
      "a1_10_ember",
      "a1_11_ember",
      "a1_12_narrator",
    ],
    gaps: {
      // 48f — THE VOLCANO'S IDENTITY GAP, FIRED AS PURE SILENCE. "She addresses
      // the mountain and gets 48 frames of nothing. The Ember↔volcano engine is
      // asymmetric by design: many lines aimed at him, two ever answered; the
      // ratio is the joke."
      a1_11_ember: 48,
    },
    tailFrames: 30,
  },
  {
    // Scene 7 — the broken door.
    id: "s07_broken_door",
    lines: ["a1_13_ember", "a1_14_narrator", "a1_15_ember", "a1_16_narrator"],
    tailFrames: 30,
  },
  {
    // Scene 8 — warm things rise.
    id: "s08_warm_rise",
    lines: ["a1_17_narrator", "a1_18_narrator", "a1_19_ember"],
    tailFrames: 30,
  },
  {
    // Scene 9 — THE FIRST LINE. The act-one climax and the series event.
    id: "s09_first_line",
    lines: [
      "a1_20_volcano",
      "a1_21_volcano",
      "a1_22_sunny",
      "a1_23_sunny",
      "a1_24_narrator",
    ],
    // 93 = the scripted 45f on the frozen wide + the volcano's 48f approach on
    // top of it. "Ninety-three frames of stillness in front of the series
    // event — that is the point of five episodes of discipline."
    leadFrames: 93,
    gaps: {
      // 60f — "The world reels. Nothing enters it." This also *contains* V2's
      // 48f approach gap, which is why there is no separate 48 here: the
      // identity gap is a floor, and the scripted beat is longer.
      a1_20_volcano: 60,
      // 24f — "Scenery has never greeted him back."
      a1_22_sunny: 24,
    },
    tailFrames: 30,
  },

  // --- ACT TWO — THE LOUD PART ----------------------------------------------
  {
    // Scene 10 — the eruption begins. ERUPTION.
    id: "s10_eruption",
    lines: ["a2_01_narrator", "a2_02_volcano", "a2_03_narrator"],
    gaps: {
      // 48f — V3's approach gap.
      a2_01_narrator: 48,
    },
    tailFrames: 30,
  },
  {
    // Scene 11 — Ember out, and renamed mid-flight. LAVA.
    id: "s11_lava",
    lines: ["a2_04_ember", "a2_05_narrator", "a2_06_ember", "a2_07_narrator"],
    tailFrames: 30,
  },
  {
    // Scene 12 — the traffic jam. Rock returns.
    id: "s12_traffic",
    lines: [
      "a2_08_narrator",
      "a2_09_narrator",
      "a2_10_narrator",
      "a2_11_rock",
      "a2_12_ember",
      "a2_13_rock",
    ],
    gaps: {
      // 24f — Rock's approach, before the migrated catch-phrase.
      a2_10_narrator: 24,
      // 24f — Rock's approach, before "It is resting."
      a2_12_ember: 24,
    },
    tailFrames: 30,
  },
  {
    // Scene 13 — the crust. THE SPINE GAG DEBUTS.
    id: "s13_crust",
    lines: [
      "a2_14_narrator",
      "a2_15_ember",
      "a2_16_rock",
      "a2_17_narrator",
      "a2_18_ember",
      "a2_19_rock",
      "a2_20_rock",
    ],
    gaps: {
      // 24f — **THE CHAIN'S STAGED GAP.** "The clip text has no ellipsis; the
      // dots the treatments wrote ARE the staged gap." It is Rock's identity
      // 24 and it is byte-identical at all four firings.
      a2_15_ember: 24,
      // 24f — Rock's approach.
      a2_18_ember: 24,
      // 24f — "between his two sentences".
      a2_19_rock: 24,
      // 30f, trailing — "The episode's thesis as the driest possible
      // correction; nothing enters the hold."
      a2_20_rock: 30,
    },
    tailFrames: 14,
  },
  {
    // Scene 14 — the unmoving countdown.
    id: "s14_countdown",
    lines: [
      "a2_21_ember",
      "a2_22_rock",
      "a2_23_ember",
      "a2_24_rock",
      "a2_25_narrator",
      "a2_26_rock",
      "a2_27_ember",
      "a2_28_rock",
      "a2_29_ember",
      "a2_30_rock",
      "a2_31_narrator",
    ],
    gaps: {
      a2_21_ember: 24,
      a2_23_ember: 24,
      a2_25_narrator: 24,
      a2_27_ember: 24,
      a2_29_ember: 24,
      // 36f — after "Since I stopped."
      a2_30_rock: 36,
    },
    tailFrames: 30,
  },
  {
    // Scene 15 — THE CEREMONY, part one: the claim.
    id: "s15_ceremony_claim",
    lines: [
      "a2_32_narrator",
      "a2_33_sunny",
      "a2_34_narrator",
      "a2_35_volcano",
      "a2_36_narrator",
      "a2_37_narrator",
    ],
    gaps: {
      // 60f — "Nobody answers; the eruption roars politely on."
      a2_33_sunny: 60,
      // 48f — V4's approach, before the politest correction in series history.
      a2_34_narrator: 48,
    },
    tailFrames: 30,
  },
  {
    // Scene 16 — THE CEREMONY, part two: the fuse closes. The series record.
    id: "s16_ceremony_fuse",
    lines: [
      "a2_38_narrator",
      "a2_39_narrator",
      "a2_40_narrator",
      "a2_41_sunny",
      "a2_42_sunny",
      "a2_43_sunny",
      "a2_44_narrator",
    ],
    gaps: {
      // 36f — "Byte-mirror of the ep-2 gap." The fuse, re-spoken.
      a2_39_narrator: 36,
      // **180f. THE SERIES RECORD** (previous 165f). "The eruption glows; Sunny
      // hangs perfectly still — his stunned beat, the series' first; Ember, for
      // the first time in her life, does not speak. NOTHING enters it."
      // Fallback trim floor 168f — it must stay the longest silence the series
      // has ever held (>165f).
      a2_40_narrator: 180,
    },
    tailFrames: 30,
  },

  // --- ACT THREE — THE NEWEST PLACE IN THE WORLD ----------------------------
  {
    // Scene 17 — the surge, the sea, and the skin.
    id: "s17_surge",
    lines: [
      "a3_01_narrator",
      "a3_02_ember",
      "a3_03_ember",
      "a3_04_narrator",
      "a3_05_narrator",
      "a3_06_narrator",
      "a3_07_narrator",
      "a3_08_rock",
      "a3_09_narrator",
      "a3_10_ember",
      "a3_11_rock",
    ],
    gaps: {
      // 24f — Rock's approach, before "I moved."
      a3_07_narrator: 24,
      // 30f — "The hugest event of his existence, the smallest sentence of the
      // episode."
      a3_08_rock: 30,
      // 24f — the chain's staged gap, firing 2 of 4.
      a3_10_ember: 24,
    },
    tailFrames: 30,
  },
  {
    // Scene 18 — ROLL CALL, firing 1: the island chain (greeting).
    id: "s18_rollcall",
    lines: [
      "a3_12_narrator",
      "a3_13_ember",
      "a3_14_ember",
      "a3_15_narrator",
      "a3_16_ember",
    ],
    gaps: {
      // 24f — "the beat before the sandbar; the naming run is split into two
      // clips so the timeline makes the pause (no pause markers)."
      a3_13_ember: 24,
      // 36f — after the roll call's flat Narrator middle.
      a3_15_narrator: 36,
    },
    tailFrames: 30,
  },
  {
    // Scene 19 — the island grows. Named spans, jump-cut states.
    id: "s19_island_grows",
    lines: [
      "a3_17_narrator",
      "a3_18_ember",
      "a3_19_narrator",
      "a3_20_ember",
      "a3_21_rock",
      "a3_22_ember",
      "a3_23_rock",
      "a3_24_rock",
      "a3_25_rock",
      "a3_26_ember",
      "a3_27_rock",
      "a3_28_ember",
      "a3_29_rock",
      "a3_30_narrator",
      "a3_31_narrator",
      "a3_32_ember",
      "a3_33_rock",
    ],
    gaps: {
      a3_20_ember: 24,
      // The chain's staged gap, firing 3 of 4.
      a3_22_ember: 24,
      // Rock to Rock: the gap is his identity, so it is there even when the
      // line before his is also his.
      a3_23_rock: 24,
      a3_24_rock: 24,
      a3_26_ember: 24,
      a3_28_ember: 24,
      // The chain's staged gap, firing 4 of 4 — this one arms the break.
      a3_32_ember: 24,
    },
    tailFrames: 30,
  },
  {
    // Scene 20 — the demolition crew. EROSION.
    id: "s20_demolition",
    lines: [
      "a3_34_narrator",
      "a3_35_drip",
      "a3_36_puff",
      "a3_37_drip",
      "a3_38_narrator",
      "a3_39_ember",
      "a3_40_rock",
      "a3_41_narrator",
      "a3_42_narrator",
      "a3_43_narrator",
      "a3_44_ember",
      "a3_45_drip",
      "a3_46_sunny",
      "a3_47_sunny",
      "a3_48_narrator",
    ],
    gaps: {
      // 36f — THE WINDUP'S PAYOFF: "one grain pops off. Rolls. Stops." Held on
      // the grain, and it is the whole morning's work.
      a3_37_drip: 36,
      // 24f — Rock's approach, countdown firing 3 of 3.
      a3_39_ember: 24,
    },
    tailFrames: 30,
  },
  {
    // Scene 21 — what dirt is actually made of.
    id: "s21_dirt",
    lines: [
      "a3_49_narrator",
      "a3_50_narrator",
      "a3_51_drip",
      "a3_52_puff",
      "a3_53_narrator",
      "a3_54_ember",
      "a3_55_narrator",
    ],
    gaps: {
      // 36f, trailing — after "So was the island. Yesterday."
      a3_55_narrator: 36,
    },
    tailFrames: 14,
  },
  {
    // Scene 22 — Blue, first to the newest place in the world (+ Violet).
    id: "s22_blue",
    lines: [
      "a3_56_blue",
      "a3_57_narrator",
      "a3_58_ember",
      "a3_59_blue",
      "a3_60_narrator",
    ],
    // Blue's 4f approach gap (world rule 10), landing on the scene's first
    // line. It is the shortest identity gap in the series and it is his.
    leadFrames: 4,
    gaps: {
      // 45f — "Blue freezes mid-ricochet for the whole beat, recalculating."
      // The ep-4 freeze, rerun on a new resident. This also contains his own
      // 4f approach, which is a floor rather than an addition.
      a3_58_ember: 45,
    },
    tailFrames: 30,
  },
  {
    // Scene 23 — the turn, held in silence.
    id: "s23_turn",
    lines: [
      "a3_61_narrator",
      "a3_62_ember",
      "a3_63_volcano",
      "a3_64_narrator",
      "a3_65_ember",
      "a3_66_ember",
      "a3_67_rock",
      "a3_68_rock",
      "a3_69_rock",
      "a3_70_ember",
    ],
    gaps: {
      // 48f — V5's approach. His only reply to Ember all episode; the
      // asymmetric engine pays its one dividend.
      a3_62_ember: 48,
      a3_66_ember: 24,
      // "Three short sentences, 24f gaps between."
      a3_67_rock: 24,
      a3_68_rock: 24,
      // 45f, trailing — "No moral is stated; she just changes what she is
      // impatient about."
      a3_70_ember: 45,
    },
    tailFrames: 14,
  },
  {
    // Scene 24 — the grading. The ep-4 order, executed.
    id: "s24_grading",
    lines: [
      "a3_71_narrator",
      "a3_72_puff",
      "a3_73_pip",
      "a3_74_pip",
      "a3_75_pip",
      "a3_76_pip",
      "a3_77_pip",
    ],
    gaps: {
      // 30f — "Pip inspects the pinch the way she inspects everything."
      a3_72_puff: 30,
      // 45f — **THE STAMP LANDS NAKED.** The Narrator companion chain ("It is
      // the highest grade she gives.") is OFF this episode by synthesis ruling;
      // nothing is said over or after the hold.
      a3_74_pip: 45,
      // 30f — after "Dirt is crushed mountain. So my feet are in a mountain."
      a3_76_pip: 30,
    },
    tailFrames: 30,
  },
  {
    // Scene 25 — the garden is ready. The loop closes.
    id: "s25_garden",
    lines: [
      "a3_78_narrator",
      "a3_79_sunny",
      "a3_80_sunny",
      "a3_81_sunny",
      "a3_82_narrator",
      "a3_83_volcano",
      "a3_84_narrator",
      "a3_85_ember",
    ],
    gaps: {
      // 24f — after THE BANKED INVERSION, "That is not me."
      a3_79_sunny: 24,
      // 48f — V6's approach. The seed rides in ON his line.
      a3_82_narrator: 48,
    },
    tailFrames: 30,
  },
  {
    // Scene 26 — THE BREAK. The last beat of act three.
    id: "s26_break",
    // Rock's 24f approach, landing on the scene's first line — the first
    // question of his life gets exactly the gap every other line of his does.
    leadFrames: 24,
    lines: ["a3_86_rock", "a3_87_ember"],
    gaps: {
      // 24f — "Ember performs HIS gap: the fastest character in the series,
      // deliberately waiting Rock's silence before answering."
      a3_86_rock: 24,
      // 45f, trailing — "NOTHING enters it: no line, no entrance, no music
      // sting, no emotion change. The episode's biggest constructed laugh,
      // built from two one-word clips and fifteen minutes of setup, held in
      // silence."
      a3_87_ember: 45,
    },
    tailFrames: 14,
  },

  // --- RECAP ----------------------------------------------------------------
  {
    // Scene 27 — the chant.
    id: "s27_chant",
    lines: [
      "rc_01_narrator",
      "rc_02_ember",
      "rc_03_ember",
      "rc_04_rock",
      "rc_05_drip",
      "rc_06_puff",
      "rc_07_narrator",
    ],
    gaps: {
      // 24f — "his 24f gap makes his own name arrive a beat behind the relay.
      // The Scene-19 namespace gag, landing."
      rc_03_ember: 24,
    },
    tailFrames: 30,
  },
  {
    // Scene 28 — the debt stamped.
    id: "s28_debt",
    lines: ["rc_08_narrator"],
    gaps: {
      // 36f, trailing — on the stamped card.
      rc_08_narrator: 36,
    },
    tailFrames: 14,
  },
  {
    // Scene 29 — two true things. The mind-blowers, and the sandcastle pays.
    id: "s29_true_things",
    lines: [
      "rc_09_narrator",
      "rc_10_narrator",
      "rc_11_narrator",
      "rc_12_narrator",
      "rc_13_sunny",
      "rc_14_sunny",
    ],
    gaps: {
      // 45f — on the kid and the castle. The silent builder runner, planted in
      // Scene 1, cashed.
      rc_11_narrator: 45,
    },
    tailFrames: 30,
  },
  {
    // Scene 30 — ROLL CALL, firing 2: goodbye.
    id: "s30_goodbye",
    lines: ["rc_15_ember", "rc_16_narrator", "rc_17_ember"],
    gaps: {
      // 36f — after the goodbye middle.
      rc_16_narrator: 36,
    },
    tailFrames: 45,
  },
  {
    // Scene 31 — end card, tease, good night.
    id: "s31_end_card",
    lines: ["rc_18_narrator", "rc_19_volcano", "rc_20_narrator"],
    gaps: {
      // 48f — V7's approach, the mirror of V1.
      rc_18_narrator: 48,
    },
    // 60: the episode ends on the changed horizon, the kid watching, the summit
    // glowing gently. He does not go back to sleep (new canon), so the last
    // thing the audience sees is a mountain still awake.
    tailFrames: 60,
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
  // `leadFrames` is written down. (The mechanism is episode three's and travels
  // with the skeleton; this is the first episode that genuinely needs it.)
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

export const VolcanoVideo: React.FC = () => {
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
