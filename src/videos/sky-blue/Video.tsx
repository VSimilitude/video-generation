import React from "react";
import { Series } from "remotion";
import { DialogueAudio, buildTimeline, type TimedScene } from "../../lib/narration";
import { FPS, HEIGHT, WIDTH, ScenePlaceholder, turnsOf } from "./scenes/common";
import { COLD_OPEN_SCENES } from "./scenes/coldOpen";
import { ACT1_SCENES } from "./scenes/act1";
import { ACT2_SCENES } from "./scenes/act2";
import { ACT3_SCENES } from "./scenes/act3";
import { RECAP_SCENES } from "./scenes/recap";

// "Ray and the Sky Nobody Painted" — Little Big World, episode three: why the
// sky is blue, and why a sunset is not.
//
// Structure, and where to add things (identical to episodes one and two,
// deliberately):
//
//   Video.tsx (this file)  the whole 35-scene timeline. Every scene's real
//                          dialogue turns live in SCRIPT below, keyed by
//                          script.md's line keys, so the episode's duration is
//                          real whether or not a scene has been staged.
//   scenes/common.tsx      the shared kit: turn plumbing, the speaker-staging
//                          API (`useStage`/`SpeakerVisual`), the painted-plate
//                          wrapper, the cast marks, the act colours, Ray's
//                          brightness ramp, ScenePlaceholder.
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
// script.md carries its held beats with exact frame counts and a reason each,
// and they become the `gaps` below verbatim. Its own words: "These numbers are
// the script's, not the builder's; raising one is a note, lowering one is a
// change to the joke." Every number in a `gaps` block traces to a `HELD BEAT`
// line in the screenplay; the comment quotes its reason.
//
// Tails are the builder's, with three exceptions the script fixes (Scene 13:
// 45, Scene 24: 45, and Scene 5's 6, which is deliberately almost nothing
// because the fifth "Are we there yet?" is buttoned by a *cut*). Held beats
// that are *trailing* — the last line of Scenes 4, 7, 23, 28b and 31 buys
// silence that runs to the cut — mean those scenes carry a short tail rather
// than the house 30, because the beat already is the tail.
//
// A THIRD KIND OF NUMBER LIVES HERE SINCE 2026-08-01: the two cast colours'
// approach gaps. Red takes **16f** before every line he says (a2_23_narrator,
// rc_04_sunny) and Blue takes **4f** before every line he says (a2_25_narrator,
// a2_28_ray, rc_03_puff) — twice and half the house eight. That is temperament
// encoded in the timeline instead of in the read, and it costs a third of a
// second either way. Indigo takes **12f**, because he is late on purpose.
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
    id: "s01_crayon",
    lines: [
      "co_01_narrator",
      "co_02_narrator",
      "co_03_narrator",
      "co_04_narrator",
      "co_05_narrator",
      "co_06_narrator",
      "co_07_narrator",
    ],
    gaps: {
      // 60f — "The hand hovers, moves along the row, takes the blue, and
      // colours the empty band at the top of the page. In silence, at real
      // speed… a question being asked without a single word."
      co_03_narrator: 60,
      // 45f — "The camera tilts up off the page and keeps going until the frame
      // is nothing but sky… The picture has to get big before the question is
      // worth asking."
      co_05_narrator: 45,
    },
    tailFrames: 36,
  },
  {
    id: "s02_title",
    lines: ["co_08_sunny", "co_09_narrator"],
    // 30f — "Sunny holding the roller aloft over his own title card, beaming,
    // saying nothing."
    gaps: { co_08_sunny: 30 },
    tailFrames: 40,
  },

  // --- ACT ONE — SEVEN ALL ALONG ------------------------------------------
  {
    id: "s03_sun",
    lines: [
      "a1_01_narrator",
      "a1_02_narrator",
      "a1_03_sunny",
      "a1_04_narrator",
      "a1_05_sunny",
      "a1_06_narrator",
      "a1_07_ray",
      "a1_08_narrator",
    ],
    tailFrames: 30,
  },
  {
    id: "s04_flick",
    lines: ["a1_09_sunny", "a1_10_ray", "a1_11_sunny", "a1_12_ray"],
    gaps: {
      // 20f — "Ray does the arithmetic, on his face, and does not get anywhere
      // with it."
      a1_11_sunny: 20,
      // 45f, trailing, and the script places it here explicitly: "HELD BEAT —
      // 45f (1.5s) **before** `a1_13_ray` (i.e. on `a1_12_ray`'s `gapFrames`).
      // Travel, in silence, in a shot where nothing changes." So this scene
      // ends by following the streak out into the star field, and Scene 5 opens
      // already there — which is also why Scene 5's shot "never cuts".
      a1_12_ray: 45,
    },
    // Short, because the held beat above *is* this scene's tail.
    tailFrames: 14,
  },
  {
    id: "s05_journey",
    lines: [
      "a1_13_ray",
      "a1_14_narrator",
      "a1_15_ray",
      "a1_15b_narrator",
      "a1_15c_ray",
      "a1_15d_narrator",
      "a1_15e_ray",
      "a1_16_narrator",
      "a1_16b_ray",
    ],
    gaps: {
      // THE ESCALATION — 30 / 45 / 60 / 75, and it is the whole architecture of
      // the gag. Five identical firings of one recording, four flat almanac
      // answers, and a silence that grows by half a second every time.
      //
      // 30f — "**HELD BEAT — 30f (1.0s) after `a1_14_narrator`.**" The first
      // one is short: the pattern has to be established before it can stretch.
      a1_14_narrator: 30,
      // 45f — the second. Same star field, same speed, same distance to go.
      a1_15b_narrator: 45,
      // 60f — the third, and the length the delivered cut used for its only
      // hold here. "Six minutes of story time pass inside two seconds."
      a1_15d_narrator: 60,
      // 75f — "**The longest silence in Act One, and the peak of the gag.**
      // Nothing enters it — no bubble, no gesture, no emotion change, and above
      // all no sign that anything is about to happen." Equal to the episode's
      // own ending hold, and the script is explicit that no single silence here
      // goes past it.
      a1_16_narrator: 75,
    },
    // 6f — "Scene tail: 6f. *(Deliberately almost nothing.)* The fifth firing
    // is **not answered**. Scene 6 cuts hard to a garden at full brightness on
    // the frame after it… The joke's button is a cut."
    tailFrames: 6,
  },
  {
    id: "s06_arrival",
    lines: [
      "a1_17_narrator",
      "a1_18_ray",
      "a1_19_narrator",
      "a1_20_ray",
      "a1_21_narrator",
    ],
    tailFrames: 30,
  },
  {
    id: "s07_plain",
    lines: [
      "a1_22_narrator",
      "a1_23_ray",
      "a1_24_ray",
      "a1_25_narrator",
      "a1_26_ray",
      "a1_27_narrator",
    ],
    gaps: {
      // 24f — "Short. Sad, not tragic — this show does not do despair. Just
      // long enough for the sentence to be true for a moment before somebody
      // argues with it." Emotion lead 0 in this scene.
      a1_26_ray: 24,
      // 36f, trailing — "The Narrator declines to argue, and the audience sits
      // with the wrongest sentence in the episode."
      a1_27_narrator: 36,
    },
    tailFrames: 14,
  },
  {
    id: "s08_rain",
    lines: [
      "a1_28_narrator",
      "a1_29_ray",
      "a1_30_narrator",
      "a1_31_drip",
      "a1_32_narrator",
      "a1_33_ray",
      "a1_34_drip",
    ],
    tailFrames: 30,
  },
  {
    id: "s09_split",
    lines: [
      "a1_35_narrator",
      "a1_36_narrator",
      "a1_37_ray",
      "a1_38_narrator",
      "a1_39_ray",
      "a1_40_narrator",
    ],
    // 60f — "**The reveal, and the second longest silence in the episode.** The
    // arc fans out and holds, with nothing over it. A six-year-old needs to
    // *count* — seven blobs, seven faces, all of them his — and counting takes
    // two seconds."
    gaps: { a1_36_narrator: 60 },
    tailFrames: 30,
  },
  {
    id: "s10_rollcall",
    lines: ["a1_41_narrator", "a1_42_ray", "a1_43_narrator", "a1_44_ray"],
    gaps: {
      // 20f — "The greeting lands. He is still beaming down the line while the
      // audience works out what they just watched."
      a1_42_ray: 20,
      // 24f — "**Nothing enters this.** No wave, no bubble, no entrance, no
      // emotion change… Deadpan is stillness, and the laugh lives in the
      // silence rather than in the read."
      a1_43_narrator: 24,
    },
    tailFrames: 30,
  },
  {
    id: "s11_bigword_rainbow",
    lines: [
      "a1_45_narrator",
      "a1_46_narrator",
      "a1_47_ray",
      "a1_48_narrator",
      "a1_49_drip",
    ],
    // 12f + 12f — "The house Big Word rhythm, unchanged since episode one.
    // Short, but they are what make the card feel like a prompt to join in
    // rather than a slide."
    gaps: { a1_46_narrator: 12, a1_47_ray: 12 },
    tailFrames: 36,
  },
  {
    id: "s12_homework",
    lines: [
      "a1_50_narrator",
      "a1_51_narrator",
      "a1_52_narrator",
      "a1_53_ray",
      "a1_54_narrator",
    ],
    // 45f — "**This one is not a joke, it is homework.** A child needs a second
    // and a half to picture themselves turning round, and if the next line
    // lands first they will not do it at all."
    gaps: { a1_51_narrator: 45 },
    tailFrames: 30,
  },
  {
    id: "s13_not_plain",
    lines: [
      "a1_55_ray",
      "a1_56_ray",
      "a1_57_narrator",
      "a1_58_sunny",
      "a1_59_narrator",
      "a1_60_sunny",
    ],
    // 24f — "Sunny, alone in frame, taking that in."
    gaps: { a1_59_narrator: 24 },
    // Scripted: "The act's last laugh gets a second to itself."
    tailFrames: 45,
  },

  // --- ACT TWO — THE AIR ---------------------------------------------------
  {
    id: "s14_why_only_blue",
    lines: ["a2_01_narrator", "a2_02_narrator", "a2_03_ray"],
    tailFrames: 32,
  },
  {
    id: "s15_myth_sea",
    lines: [
      "a2_04_narrator",
      "a2_05_narrator",
      "a2_06_narrator",
      "a2_07_ray",
      "a2_08_narrator",
      "a2_09_narrator",
    ],
    // 30f — "The stamp alone on screen, cracked, silent. The house myth-bust
    // beat."
    gaps: { a2_05_narrator: 30 },
    tailFrames: 30,
  },
  {
    id: "s16_myth_paint",
    lines: ["a2_10_sunny", "a2_11_narrator", "a2_12_sunny", "a2_13_narrator"],
    // 45f — "Sunny holding a dry roller, alone in frame, saying nothing, for a
    // second and a half. **Emotion lead cut to 0** — his face must not start to
    // fall before the Narrator has finished the question."
    gaps: { a2_11_narrator: 45 },
    tailFrames: 30,
  },
  {
    id: "s17_not_empty",
    lines: [
      "a2_14_narrator",
      "a2_15_ray",
      "a2_16_narrator",
      "a2_17_puff",
      "a2_18_narrator",
      "a2_19_ray",
      "a2_20_puff",
      "a2_21_narrator",
    ],
    tailFrames: 30,
  },
  {
    id: "s18_red_straight",
    lines: [
      "a2_22_narrator",
      "a2_23_narrator",
      "a2_23b_red",
      "a2_24_narrator",
      "a2_24b_red",
    ],
    gaps: {
      // 16f — "*(New, and short.)* Red takes his time about answering. **Every
      // Red line in the episode has a longer approach gap than the house eight
      // frames**; that is the character encoded in the timeline rather than in
      // the read."
      a2_23_narrator: 16,
      // 30f — moved here from `a2_23_narrator`, same length: "Red crosses the
      // whole frame in silence, dead straight, with Orange behind him… The
      // audience has to see *boring* before bouncy means anything."
      a2_23b_red: 30,
      // 20f — "**Nothing enters this.** Red is most of the way out of frame.
      // Puff is still holding the shrug. Deadpan is stillness."
      a2_24_narrator: 20,
    },
    // 40f — "Red exits during it, at exactly the same speed, and Puff watches
    // him go."
    tailFrames: 40,
  },
  {
    id: "s19_blue_everywhere",
    lines: [
      "a2_25_narrator",
      "a2_25b_blue",
      "a2_26_puff",
      "a2_27_narrator",
      "a2_28_ray",
      "a2_28b_blue",
      "a2_28c_indigo",
      "a2_29_narrator",
    ],
    gaps: {
      // 4f — "*(Half the house turn gap.)* Blue does not wait to be finished
      // introducing. **Every Blue entrance in the episode takes a 4-frame gap
      // instead of the default eight** — the opposite of Red's 16 — so the
      // interruption is in the timeline rather than in the read."
      a2_25_narrator: 4,
      // 45f — "**Unchanged and sacred.** The pinballing runs on under the
      // silence… This is the mechanism of the whole episode arriving as a
      // physical event and it must not be narrated while it happens. **Nothing
      // enters it — including Blue's bubbles.**"
      a2_27_narrator: 45,
      // 4f — Blue's house gap again; he answers Ray before Ray has stopped.
      a2_28_ray: 4,
      // 12f — Indigo's gap, and the only one of its kind: he is LATE, not
      // early. Longer than the house eight so the echo arrives after the joke
      // has finished rather than inside it.
      a2_28b_blue: 12,
    },
    tailFrames: 30,
  },
  {
    id: "s20_every_direction",
    lines: [
      "a2_30_narrator",
      "a2_31_narrator",
      "a2_32_ray",
      "a2_33_narrator",
      "a2_34_ray",
      "a2_35_narrator",
      "a2_36_narrator",
      "a2_36b_ray",
    ],
    gaps: {
      // 36f — "The full dome, glowing, with nothing over it. The answer to the
      // cold open's question is on screen for the first time and it deserves a
      // look."
      a2_33_narrator: 36,
      // 20f — "Violet stops bouncing and droops. **Nothing else enters this
      // beat** — no bubble, no arrow, no emotion change on Ray. Deadpan is
      // stillness."
      a2_36_narrator: 20,
    },
    tailFrames: 30,
  },
  {
    id: "s21_bigword_scatter",
    lines: [
      "a2_37_narrator",
      "a2_38_narrator",
      "a2_39_ray",
      "a2_40_narrator",
      "a2_41_ray",
    ],
    // 12f + 12f — house Big Word rhythm.
    gaps: { a2_38_narrator: 12, a2_39_ray: 12 },
    tailFrames: 36,
  },
  {
    id: "s22_interlock",
    lines: ["a2_42_narrator", "a2_43_narrator", "a2_44_puff"],
    // 45f — "The sentence alone on screen, with the AIR ghost behind it.
    // Nothing enters. This is the series interlock and it is said **once in the
    // episode**."
    gaps: { a2_43_narrator: 45 },
    tailFrames: 32,
  },
  {
    id: "s23_sunny_wrong",
    lines: [
      "a2_45_sunny",
      "a2_46_ray",
      "a2_47_sunny",
      "a2_48_narrator",
      "a2_49_narrator",
      "a2_50_sunny",
      "a2_51_narrator",
      "a2_52_ray",
      "a2_53_sunny",
      "a2_54_narrator",
      "a2_55_narrator",
    ],
    gaps: {
      // 45f — "Sunny holding an enormous smug grin, alone in frame, absolutely
      // certain of what is coming next. Two episodes have trained the audience
      // to expect 'He is right. Again.' **Emotion lead cut to 0** on the next
      // line."
      a2_48_narrator: 45,
      // 36f — "Three words, and then nothing at all. Sunny's grin does not move
      // for the first half of this beat and comes apart in the second."
      a2_49_narrator: 36,
      // 30f — "It lands on him. Nobody helps."
      a2_52_ray: 30,
      // 20f — "Short — this is a comma, not a full stop. Sunny is already
      // re-inflating behind it."
      a2_54_narrator: 20,
      // 45f, trailing — "The grown-up laugh goes here. Sunny, restored to full
      // brightness, posing in front of a diagram that no longer says what he
      // thinks it says. Unseasoned button, no gesture, nothing enters."
      a2_55_narrator: 45,
    },
    tailFrames: 16,
  },
  {
    id: "s24_not_plain_anymore",
    lines: ["a2_56_ray", "a2_57_ray"],
    // 30f — "He looks up at the sky he is apparently the whole of."
    gaps: { a2_56_ray: 30 },
    // Scripted: "The catchphrase's first firing gets the act's last second."
    tailFrames: 45,
  },

  // --- ACT THREE — THE LONG WAY -------------------------------------------
  {
    id: "s25_sea_sunset",
    lines: [
      "a3_01_narrator",
      "a3_02_narrator",
      "a3_03_narrator",
      "a3_04_ray",
      "a3_05_narrator",
    ],
    tailFrames: 30,
  },
  // `s26_volcano` IS CUT (2026-08-01). Its one line and its 60f hold are gone
  // and the scene ceases to exist: the volcano gag's entire value is that the
  // show appears not to think it is important, and the delivered cut stopped
  // the episode and said a sentence about it. −9.6s. Its component is still in
  // ACT3_SCENES and is now simply unreferenced — deleting it is the staging
  // wave's job, not the timeline's. The volcano keeps its horizon in Scenes 25,
  // 28b, 29, 31 and 35 and nobody looks at it until it opens an eye in 28b.
  {
    id: "s27_long_way",
    lines: [
      "a3_07_narrator",
      "a3_08_narrator",
      "a3_09_narrator",
      "a3_10_ray",
      "a3_11_narrator",
    ],
    tailFrames: 30,
  },
  // --- THE SUNSET RACE — three legs, three scenes -------------------------
  // The 2026-08-01 addendum turns Scene 28's drain into a race down two hundred
  // miles of sideways air and absorbs the proposed Scene 28b into its finish
  // line. The scene id `s28_blue_runs_out` is KEPT — it is wiring, read by the
  // act file and by every bubble map, and the note on the ep-2 cameo keys
  // applies: check whether anything actually reads a name before changing it.
  {
    id: "s28_blue_runs_out",
    lines: [
      "a3_12_narrator",
      "a3_12b_narrator",
      "a3_13_narrator",
      "a3_13b_blue",
      "a3_13c_indigo",
      "a3_13d_yellow",
      "a3_14_narrator",
      "a3_14b_ray",
      "a3_14c_narrator",
      "a3_14d_ray",
    ],
    gaps: {
      // 45f — "The blue drains out of the beam in silence, one ping at a time,
      // over most of the width of the frame. This is Act Two's mechanism doing
      // something *new*, and it needs to be watched rather than described."
      // It is now also the start of the race: seven colours set off inside it.
      a3_13_narrator: 45,
      // 12f — Indigo's gap, the same one he takes in Scene 19: he is four beats
      // behind Blue, always, and the echo has to arrive after the line rather
      // than under it.
      a3_13b_blue: 12,
      // 20f — VIOLET'S EXIT GOES HERE, in silence, between Indigo's echo and
      // Yellow shouting after him. He goes last, highest and furthest, and he
      // is the only one who does not say anything on his way out. Nothing else
      // enters this beat: the silence *is* the joke and a bubble would spend it.
      a3_13c_indigo: 20,
      // 20f — "The goodbye lands. Ray is still waving after them while the
      // audience works out who just left." Unchanged.
      a3_14b_ray: 20,
      // 24f — "**Nothing enters this.** No wave, no bubble, no entrance, no
      // emotion change — Ray hangs there in a beam that is now red and orange,
      // doing absolutely nothing. Same beat, same length and same reason as
      // Scene 10's." Unchanged.
      a3_14c_narrator: 24,
    },
    tailFrames: 30,
  },
  {
    id: "s28b_race_island",
    lines: [
      "a3_14e_narrator",
      "a3_14f_green",
      "a3_14g_narrator",
      "a3_14h_yellow",
      "a3_14i_narrator",
    ],
    gaps: {
      // 20f — Green sits down on a becalmed sailboat and stays sat. The beat is
      // him not getting up again, which is the whole character.
      a3_14f_green: 20,
      // 45f, trailing — **THE VOLCANO OPENS ONE EYE.** It holds, and it closes
      // it. Nothing enters: no line, no bubble, no rumble, no reaction from
      // anybody, and no music sting. Three episodes of a sleeping gag escalate
      // by exactly one eyelid, and the value of it is entirely that the show
      // declines to comment. Yellow bounces off apologetically inside the tail.
      a3_14i_narrator: 45,
    },
    // Short, because the held beat above *is* this scene's tail.
    tailFrames: 14,
  },
  {
    id: "s28c_red_arrives",
    lines: [
      "a3_15_ray",
      "a3_16_narrator",
      "a3_17_ray",
      "a3_18_narrator",
      "a3_18b_narrator",
      "a3_18c_red",
      "a3_18d_red",
      "a3_18e_orange",
      "a3_18f_narrator",
    ],
    gaps: {
      // 36f — "Red walks. Orange walks. The sky is entirely his colour and
      // there is nobody else in it. **Nothing enters this beat.**"
      a3_18b_narrator: 36,
      // 30f — "He does not speed up. He has not sped up once in twelve minutes
      // and he does not start now. **Nothing enters.**"
      a3_18c_red: 30,
      // 45f — "**The act's silence, and Red's whole scene.** The frame is
      // orange, empty, and quiet, and the character who owns it is strolling
      // across it having outlasted everybody. Nothing enters — no bubble, no
      // gesture, no emotion change. Orange keeps his distance and does not
      // overtake."
      a3_18d_red: 45,
      // 20f — Orange has agreed, one body-length behind, and neither of them
      // says anything else. Deadpan is stillness.
      a3_18e_orange: 20,
    },
    tailFrames: 30,
  },
  {
    id: "s29_bigword_sunset",
    lines: [
      "a3_19_narrator",
      "a3_20_ray",
      "a3_21_narrator",
      "a3_22_sunny",
      "a3_23_narrator",
    ],
    // 12f + 12f — house Big Word rhythm, third and last firing.
    gaps: { a3_19_narrator: 12, a3_20_ray: 12 },
    tailFrames: 36,
  },
  {
    id: "s30_crayon_back",
    lines: ["a3_24_narrator", "a3_25_narrator", "a3_26_narrator"],
    gaps: {
      // 45f — "The kid looks up at the orange sky, then down at the page, then
      // at the crayon in their hand. Silent. The audience is a full beat ahead
      // and gets to sit in it."
      a3_24_narrator: 45,
      // 36f — "The hand searches the box, finds the orange, and starts
      // colouring over the top of the blue band. No narration."
      a3_25_narrator: 36,
    },
    tailFrames: 36,
  },
  {
    id: "s31_round_the_other_side",
    lines: [
      "a3_27_ray",
      "a3_28_narrator",
      "a3_29_ray",
      "a3_30_narrator",
      "a3_31_sunny",
    ],
    gaps: {
      // 30f — "The terminator keeps sliding. Nothing else."
      a3_30_narrator: 30,
      // 75f, trailing — "**The longest silence in the episode and the end of
      // the story.** … If any line lands inside these seventy-five frames, the
      // episode does not have an ending."
      a3_31_sunny: 75,
    },
    tailFrames: 18,
  },

  // --- RECAP ---------------------------------------------------------------
  {
    id: "s32_chant",
    lines: [
      "rc_01_narrator",
      "rc_02_ray",
      "rc_03_puff",
      "rc_03b_blue",
      "rc_04_sunny",
      "rc_04b_red",
      "rc_05_narrator",
    ],
    gaps: {
      // 4f — Blue's house gap. He shoves into Puff's panel before Puff has
      // finished claiming the word, and neither of them concedes.
      rc_03_puff: 4,
      // 16f — Red's house gap. He takes his time, then walks into Sunny's panel
      // from the side and out of the far edge of it.
      rc_04_sunny: 16,
      // 20f — "**Nothing enters this.** Sunny does not react. He does not hear
      // it, he does not look at Red, and the panel light moves on to the
      // Narrator while Red is still walking out of the far side of the frame.
      // Deadpan is stillness."
      rc_04b_red: 20,
    },
    tailFrames: 32,
  },
  { id: "s33_right_now", lines: ["rc_06_narrator", "rc_07_narrator"], tailFrames: 44 },
  {
    id: "s34_mind_blower",
    lines: [
      "rc_08_narrator",
      "rc_09_narrator",
      "rc_09b_sunny",
      "rc_10_narrator",
      "rc_11_ray",
      "rc_11b_sunny",
      "rc_12_narrator",
      "rc_13_narrator",
      "rc_14_ray",
      "rc_15_narrator",
    ],
    // 60f — "The impossible picture, alone on screen, for two full seconds.
    // Bright sunlight and a black sky in the same frame is the single most
    // counter-intuitive image in three episodes and the audience needs time to
    // disbelieve it before anybody explains."
    gaps: { rc_10_narrator: 60 },
    tailFrames: 36,
  },
  {
    id: "s35_tease",
    lines: [
      "rc_16_narrator",
      "rc_17_narrator",
      "rc_18_sunny",
      "rc_18b_narrator",
      "rc_19_ray",
    ],
    gaps: {
      // 45f — "The wobbling smoke ring, alone, in silence." Unchanged.
      rc_16_narrator: 45,
      // 60f — "The rumble, felt in the water and in the smoke, with nothing
      // said over it. **Keep this wondrous, not frightening** — no dark chord,
      // no red glow, no shaking camera." Unchanged and sacred.
      rc_17_narrator: 60,
      // 45f — **Same length, opposite content from the delivered cut.** Sunny
      // is not unsure and he is not squinting: he is BEAMING, at full
      // brightness, arms out, having claimed a volcano without a second's
      // hesitation. The volcano rumbles again behind him and he does not
      // notice. **Nothing enters this beat** and **emotion lead cut to 0** — no
      // dawning, no doubt, no reaction of any kind. The joke is entirely that
      // he is wrong and does not know it, and the audience does.
      rc_18_sunny: 45,
      // 30f — "The volcano, the rumble, Sunny still beaming. Nothing enters."
      rc_18b_narrator: 30,
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

export const SkyBlueVideo: React.FC = () => {
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
