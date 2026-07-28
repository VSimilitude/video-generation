// Narration script for "Ray and the Sky Nobody Painted" — Little Big World,
// episode three. Topic: why the sky is blue (and why a sunset is not).
// Audience: six-year-olds. Run `npm run narration -- --video sky-blue` after
// editing; unchanged lines are served from cache.
//
// FORMAT
// Every line is an object so each character keeps its own voice. The file-level
// `voice` / `speed` are the house default (the Narrator); character lines
// override per line.
//
//   Narrator  kokoro   af_heart         1.0   warm storyteller, occasional
//                                             deadpan. Voice only — no body,
//                                             ever
//   Ray       minimax  Decent_Boy *     1.0   our hero. One sunbeam. Earnest,
//                                             literal, convinced he is the
//                                             boring one. * PLACEHOLDER — see
//                                             the RAY block below
//   Sunny     kokoro   am_puck          1.0   the Sun. Enormous ego. THIS is
//                                             the episode he is wrong. Series
//                                             voice since episode one; the
//                                             MiniMax audition was rejected
//   Drip      minimax  Lively_Girl      1.0   three lines. The rainbow is hers
//   Puff      minimax  Exuberant_Girl   1.0   five short lines. He is the air
//                                             that does the scattering
//
// Silent, and staying silent: the kid (silhouette, never speaks, three
// episodes running), the seven colour blobs (a crowd, not a cast — they bob,
// wave and bounce, and not one of them has a line, which is what keeps the
// show at five voices under the "a body with a face and a line gets its own
// voice" rule), and the volcano.
//
// TWO ENGINES. The Narrator stays on kokoro — free, local, and re-synthesized
// the instant a line is reworded, which is the whole reason narration text can
// be the source of truth. AND SO DOES SUNNY: `am_puck` is what he has sounded
// like for three episodes, the MiniMax `Imposing_Manner` read was auditioned
// here and rejected (it plays the ego as menace, and he is a show-off), and a
// returning character does not change voice for one episode. Everybody else
// with a body on screen is on MiniMax speech-2.8-hd (Replicate, ~$0.11/1000
// characters), which is paid but can *act*: it takes an `emotion` and honours
// inline pause markers. Neither reaches a kokoro line — the generator rejects
// a pause marker there outright, and `emotion` is simply not a field kokoro
// has, so no Sunny line carries one.
//
//   engine: "minimax", voiceId: "<id>", emotion: "<enum>"
//   emotions: auto happy sad angry fearful disgusted surprised calm fluent
//             neutral
//
// EMOTION IS SEASONING. A line only carries one when a stage direction in
// `script.md` asks for it, and the comment on the line names the direction.
// Everything else is "auto" — the model reading the words as written, and the
// words were written to carry it. Ray's forty-seven lines are twenty-one
// "auto", twenty-five seasoned and one shared recording, and the seasoning is
// his arc:
// two `sad` in Act One (the sulk, and nowhere else), `surprised` on the eight
// lines where a fact lands on him, `happy` from the rainbow onward, and one
// `calm` at the sunset. Drip and Puff are `happy` throughout, which is all they
// are. SUNNY HAS NONE — he is on kokoro, and the four moments he stops
// (`a2_12`, `a2_45`, `a2_50`, `rc_18`) are carried by the words, by a slower
// `speed`, and by the face, which is where Scene 23 was staging them anyway.
//
// PAUSE MARKERS (`<#0.3#>`) are seconds of silence *inside* a MiniMax line and
// are only allowed where `script.md` already asks for intra-line timing.
// THERE ARE NOW NONE IN THIS FILE. The one line that qualified was
// `a2_47_sunny`, whose script note (Scene 23) says the three halves of the brag
// must land separately — and Sunny went back to kokoro, which cannot take a
// marker at all (the generator errors rather than let the model read the
// punctuation out loud). Its separation is now bought with `speed`, exactly as
// the Narrator's two equivalents (`a2_27`, `a3_13`) have always bought theirs.
// Every other silence in the show is a held beat *between* lines and belongs to
// `gaps` in `Video.tsx`.
//
// RAY IS NOT CAST. `Decent_Boy` is a PLACEHOLDER, written in so the file runs
// and the episode can be timed — it was the runner-up in Puff's audition
// (docs/LEARNINGS.md, 2026-07-26) and it is a plausible young-boy read, which
// is not the same as being the right one. AUDITION BEFORE ANY VISUAL WORK.
// The four lines to audition on, because they ask four different things:
//   a1_26_ray  small, flat, sad           "White. Plain white. I'm the plain one."
//   a1_18_ray  delighted shout            "I'm HERE! I'm on a leaf! I'm on a DOG!"
//   a1_42_ray  the roll call, seven items in one breath
//   a2_39_ray  a chant with a split syllable in it ("Scat. Ter. SCATTER!")
//   npm run narration -- --audition sky-blue:a1_26_ray <dir> \
//     --engine minimax --voices Decent_Boy,Young_Knight,Sweet_Girl_2,Wise_Woman
// Recasting is ONE constant (`RAY_MINIMAX_VOICE`), exactly as `PUFF_ENGINE` was
// in episode two — but recasting is also a TEXT edit. Sweep his sound words
// (WHOOSH, the three chants) before assuming the clips are the same clips.
//
// Keys are `<act>_<number>_<speaker>` in strict playback order:
// `co` cold open, `a1` the rainbow, `a2` the air, `a3` the sunset, `rc` recap.
// The screenplay in `script.md` lists which keys each of the thirty-five scenes
// consumes; the two files must be edited together.
//
// TEXT-TO-SPEECH RULES OBSERVED HERE
//   - No digits: "ninety three million", not a numeral. "Eight minutes".
//   - No percent signs, ampersands or other symbols. No question-exclamation
//     stacks ("?!") — a shout is carried by CAPS instead.
//   - No colons; they read as hard pauses. No ellipses: a hesitation is a real
//     word ("Um.", "Wait.") or its own line with a gap after it.
//   - Sound words are spelled as words: WHOOSH (proven on both engines in
//     episodes one and two), Ping. Spellings are PER ENGINE — a stretched
//     vowel ("Oooh", "Whoaaa") is a kokoro instruction and a MiniMax
//     mispronounce, so there is not one stretched spelling on a character line
//     in this file, and the length comes from `emotion` instead. "Ping. Ping.
//     Ping." is a Narrator line and stays on kokoro.
//   - CAPS mark shouted words and survive the model fine.
//   - THE THREE CHANTS ARE THE HIGHEST TTS RISK IN THE EPISODE and none of
//     them has been heard. Two of the three are deliberately built out of real
//     words — "Rain. Bow." and "Sun. Set." are compounds pulled apart, which
//     any model can say — and that is a design choice, not a coincidence.
//     Episode two spelled its Big Words letter by letter ("A. I. R.");
//     RAINBOW and SCATTER are seven letters each and that treatment does not
//     scale, so the syllable-chant of episode one comes back. Fallbacks are
//     pre-written and known safe:
//       a1_47_ray  ->  "Rain! And bow! RAINBOW!"
//       a2_39_ray  ->  "Scatter! Scatter! SCATTER!"   (the only non-word
//                      syllable in the episode is the "Ter" in "Scat. Ter.")
//       a3_20_ray  ->  "Sun! And set! SUNSET!"
//
// COMEDY PACING — per-line speed overrides
// Episode one's audience test found the best-loved jokes were deadpan
// repetition gags that went past too fast, and episode two's answer (slower
// speeds on every list plus written-down held beats) transferred cleanly. Every
// list, roll call and repeated straight-line in this file therefore carries its
// own slower `speed`, with a comment saying why. The other half of the rule —
// a held beat of silence on the punchline — lives in `script.md`'s stage
// directions and becomes `gaps` in `Video.tsx`; the two halves only work
// together.
const NARRATOR = { voice: "af_heart", speed: 1.0 };

// RAY'S CASTING IS NOT DECIDED. This block is the whole of it, on purpose:
// one constant moves forty-seven clips, which is what `PUFF_ENGINE` bought us in
// episode two. "kokoro" | "minimax" — kokoro ignores `emotion` entirely, so
// flipping back gives a free re-time and costs the acting and nothing else.
const RAY_ENGINE = "minimax";
// PLACEHOLDER, UNHEARD. Runner-up in Puff's audition; picked here because a
// young, earnest, slightly literal boy is the brief and this is the closest
// description on the list. It has never been heard saying any of these words.
// Cast by Mike 2026-07-27 from the four-voice audition: Young_Knight's
// youthful-earnest read fits an eight-minute-old sunbeam; Decent_Boy's
// cooler, lower timbre both fought the earnestness and sat too close to
// Sunny (then on MiniMax Imposing_Manner) for adjacent-line clarity. Sunny has
// since gone back to kokoro `am_puck`, which puts even more air between the
// two of them — Young_Knight still stands, and the separation argument only
// got stronger.
const RAY_MINIMAX_VOICE = "Young_Knight";
const RAY =
  RAY_ENGINE === "minimax"
    ? { engine: "minimax", voiceId: RAY_MINIMAX_VOICE, speed: 1.0 }
    : { voice: "am_liam", speed: 1.0 }; // kokoro stand-in, for free re-timing

// Returning, unchanged, and finally wrong about something.
//
// BACK ON KOKORO, AND THIS IS THE SERIES VOICE. `am_puck` is what Sunny has
// sounded like since episode one (`water-cycle`, `drip-fork`); the MiniMax
// `Imposing_Manner` read was auditioned here and rejected by Mike — it plays
// the ego as *menace*, and Sunny is a show-off, not a villain. Three episodes
// of the same character cannot change voice for one of them, so he is back on
// the free, local, deterministic engine he has always been on. That means: no
// `emotion` on a single Sunny line (kokoro has none, and the generator rejects
// the field), no pause markers (see `a2_47_sunny`), and every Sunny line
// re-times for nothing the moment it is reworded.
const SUNNY = { voice: "am_puck", speed: 1.0 };
// Returning for three lines. The rainbow is hers and she knows it.
const DRIP = { engine: "minimax", voiceId: "Lively_Girl", speed: 1.0 };
// Returning for five short lines, and doing real work: Puff is the air, and
// the air is what scatters the blue. His catchphrase fires exactly once.
const PUFF = { engine: "minimax", voiceId: "Exuberant_Girl", speed: 1.0 };

export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    // ---------------------------------------------------------------
    // COLD OPEN — a crayon, a question, and a theory
    // ---------------------------------------------------------------
    co_01_narrator: {
      text: "This is a story about a colour. The biggest colour there is.",
      ...NARRATOR,
    },
    co_02_narrator: {
      text: "Here is a kid. Here is a picture. And here is a box of crayons.",
      ...NARRATOR,
    },
    // Three-item setup, and the audience has to have time to read the crayon
    // box before the hand moves. Slowed.
    co_03_narrator: {
      text: "The kid needs to colour in the sky. Watch which one they pick.",
      ...NARRATOR,
      speed: 0.95,
    },
    co_04_narrator: {
      text: "Blue. Every kid on this whole planet picks blue.",
      ...NARRATOR,
      speed: 0.95,
    },
    co_05_narrator: { text: "Now look up.", ...NARRATOR, speed: 0.9 },
    co_06_narrator: {
      text: "Nobody up there is holding a crayon.",
      ...NARRATOR,
    },
    co_07_narrator: {
      text: "So why is the sky blue? Let's go and find out.",
      ...NARRATOR,
    },
    // Scene 2: he arrives over the title card with a paint roller. This is
    // episode two's closing tease being collected in the first forty seconds —
    // "OH, that one is me as well!" — and it is the theory the episode breaks.
    co_08_sunny: {
      text: "I DID! It was ME! I painted it! You're welcome! HA! HA!",
      ...SUNNY,
    },
    co_09_narrator: {
      text: "Sunny has a theory. Keep hold of it. We need it later.",
      ...NARRATOR,
      speed: 0.95,
    },

    // ---------------------------------------------------------------
    // ACT ONE — THE RAINBOW. Big Word: RAINBOW
    // ---------------------------------------------------------------
    a1_01_narrator: {
      text: "Our story starts somewhere extremely bright. Ninety three million miles away.",
      ...NARRATOR,
    },
    a1_02_narrator: {
      text: "This is the Sun. You have met him.",
      ...NARRATOR,
    },
    // The series greeting, third episode running. It is also the source clip
    // for a3_31 — see the note there before rewording a single word of it.
    a1_03_sunny: {
      text: "GOOD MORNING, EVERYBODY!",
      ...SUNNY,
    },
    a1_04_narrator: {
      text: "And these are his sunbeams. All of them. Every single one.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Scene 3: he is standing over a launch rail with a zillion beams on it,
    // sending them off in handfuls. Boss, and delighted about it.
    a1_05_sunny: {
      text: "I MADE these! Every one of you! Off you go! Light something up!",
      ...SUNNY,
    },
    a1_06_narrator: {
      text: "There are more sunbeams than there are grains of sand. Here is one.",
      ...NARRATOR,
    },
    a1_07_ray: {
      text: "Hello! I'm Ray! I'm a sunbeam! It's my first day!",
      ...RAY,
      emotion: "happy",
    },
    a1_08_narrator: {
      text: "This is Ray. Ray has never been anywhere.",
      ...NARRATOR,
    },
    a1_09_sunny: {
      text: "RAY! You are going to EARTH! Ninety three million miles! GO!",
      ...SUNNY,
    },
    // Scene 4: the number lands on him. First of the seven facts that do.
    a1_10_ray: {
      text: "Ninety three million? How long does that take?",
      ...RAY,
      emotion: "surprised",
    },
    a1_11_sunny: { text: "Eight minutes! HA! HA!", ...SUNNY },
    // WHOOSH is the house sound word and the only one on a character line in
    // this episode. Single letter runs; verified on both engines in episodes
    // one and two. Still ear-check it on whoever ends up playing Ray.
    a1_12_ray: {
      text: "WHOOSH! I am going to EARTH!",
      ...RAY,
      emotion: "happy",
    },
    // Scene 5, the eight minutes. The gag is the identical question twice with
    // a flat almanac answer either side, and the second firing is not a
    // re-recording — see a1_15.
    a1_13_ray: { text: "Are we there yet?", ...RAY },
    a1_14_narrator: {
      text: "One minute down. Seven to go.",
      ...NARRATOR,
      speed: 0.92,
    },
    // SAME RECORDING, NOT A SECOND TAKE. Episode two learned this the
    // expensive way: MiniMax returned one repeated sentence at 2.20s and then
    // 2.84s, a thirty percent swing in the line whose entire job was to sound
    // the same. `sameAs` copies the clip under this key — no synthesis, no API
    // call, no dice roll. The text lives on a1_13; changing it there re-copies
    // here, and there is nothing to keep in step by hand.
    a1_15_ray: { sameAs: "a1_13_ray" },
    a1_16_narrator: {
      text: "Seven minutes down. One to go.",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_17_narrator: {
      text: "And then Ray arrived, all at once, the way light always does.",
      ...NARRATOR,
    },
    // Scene 6: he lands on four things in four different places in one line —
    // "the most delighted anybody is in Act One".
    a1_18_ray: {
      text: "I'm HERE! I'm on a leaf! I'm on a puddle! I'm on a DOG!",
      ...RAY,
      speed: 0.95,
      emotion: "happy",
    },
    a1_19_narrator: {
      text: "Everything Ray touched, you could suddenly see.",
      ...NARRATOR,
    },
    a1_20_ray: { text: "Is that my job? Do I make things see-able?", ...RAY },
    a1_21_narrator: {
      text: "That is exactly your job. Nothing has a colour in the dark.",
      ...NARRATOR,
    },
    a1_22_narrator: {
      text: "But then Ray looked around, and went very quiet.",
      ...NARRATOR,
    },
    // Scene 7, the sulk. Three-item list, slowed so each colour lands.
    a1_23_ray: {
      text: "Look at all this. Red flowers. Green grass. A yellow duck.",
      ...RAY,
      speed: 0.92,
    },
    // Scene 7: "the misconception, said out loud by the character who holds
    // it." Deflation, not despair — the same note episode two put on Puff.
    a1_24_ray: {
      text: "Everybody gets a colour. Everybody except me.",
      ...RAY,
      emotion: "sad",
    },
    a1_25_narrator: { text: "Ray. What colour do you think you are?", ...NARRATOR },
    // The running complaint, first firing. Small and flat — this is one of the
    // four audition lines and the hardest thing Ray does.
    a1_26_ray: {
      text: "White. Plain white. I'm the plain one.",
      ...RAY,
      speed: 0.95,
      emotion: "sad",
    },
    // Deadpan after a held beat, and the Narrator declining to argue yet.
    a1_27_narrator: { text: "Hmm.", ...NARRATOR, speed: 0.9 },
    a1_28_narrator: {
      text: "And right then, it started to rain. In the sunshine.",
      ...NARRATOR,
    },
    a1_29_ray: { text: "Rain? But the sun is still out.", ...RAY },
    a1_30_narrator: {
      text: "That is the best kind. Watch what happens.",
      ...NARRATOR,
    },
    // Fan service, verbatim from episode two, and the family catchphrase.
    a1_31_drip: {
      text: "Hi! It's me! I'm the weather!",
      ...DRIP,
      emotion: "happy",
    },
    // The deliberate rhyme with "Different show. Same sun." and "Same sky."
    // Flattest reading in the act; same 0.92 both previous times.
    a1_32_narrator: {
      text: "That is Drip. Different show. Same rain.",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_33_ray: { text: "You're a raindrop. Can I go through you?", ...RAY },
    a1_34_drip: {
      text: "Come and walk right through the middle of me. Go on.",
      ...DRIP,
      emotion: "happy",
    },
    a1_35_narrator: {
      text: "So Ray walked into the raindrop. And the raindrop bent him.",
      ...NARRATOR,
    },
    a1_36_narrator: {
      text: "And Ray came out the other side in SEVEN pieces.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Scene 9: no question mark on purpose — he is too stunned to ask properly,
    // and the flat full stops are the read. The 60f beat in front of it is
    // where the reveal lives.
    a1_37_ray: {
      text: "What. What just happened to me.",
      ...RAY,
      speed: 0.95,
      emotion: "surprised",
    },
    a1_38_narrator: {
      text: "Nothing happened to you, Ray. You were always seven.",
      ...NARRATOR,
    },
    a1_39_ray: { text: "I was always SEVEN?", ...RAY, emotion: "surprised" },
    // The lesson, plainly, once. Everything after this is it being enjoyed.
    a1_40_narrator: {
      text: "White light is not one colour. White light is every colour, travelling together.",
      ...NARRATOR,
      speed: 0.95,
    },
    a1_41_narrator: {
      text: "And now they were not travelling together at all.",
      ...NARRATOR,
    },
    // THE ROLL CALL — the kids' series signature, third episode running. Ep 1
    // was Drip greeting identical raindrops ("Hi Drop, Hi Droppy"), ep 2 was
    // Puff greeting four identical Puffs; the six-year-old asked for more of it
    // both times. The shape is fixed: a character cheerfully naming
    // near-identical strangers, one flat explanatory line from the Narrator, an
    // unbothered button from the character.
    //
    // It costs no new staging idea — Scene 9 has just fanned him into seven
    // colour blobs and they are standing right there. And it IS the lesson:
    // a child who has watched Ray say hello to seven versions of himself
    // cannot think white light is one thing.
    //
    // SEVEN items, so this is the slowest line in the episode at 0.88 — the
    // pacing rule wants a list to separate, and this is the longest list the
    // show has ever run.
    a1_42_ray: {
      text: "Hi Red. Hi Orange. Hi Yellow. Hi Green. Hi Blue. Hi Indigo. Hi Violet.",
      ...RAY,
      speed: 0.88,
      emotion: "happy",
    },
    // The straight line. Flat, slow, and the 24f held beat after it does the
    // work. Narrator, so it stays on kokoro and re-times for free.
    a1_43_narrator: {
      text: "Every single one of them was also Ray.",
      ...NARRATOR,
      speed: 0.92,
    },
    // The button, deliberately unseasoned. Deadpan is stillness and the laugh
    // is in the silence in front of it — `happy` would play it as a punchline
    // being sold. Same call as ep 2's "It is a very popular name."
    a1_44_ray: { text: "I have never met me before.", ...RAY, speed: 0.95 },
    a1_45_narrator: {
      text: "Seven colours, side by side, bending out of the rain.",
      ...NARRATOR,
    },
    a1_46_narrator: {
      text: "You already know its name. It is a rainbow.",
      ...NARRATOR,
    },
    // BIG WORD ONE — CHANT. Built out of two real words on purpose, so no
    // model has to guess at a syllable. EAR-CHECK; fallback pre-written above.
    a1_47_ray: {
      text: "Rain. Bow. RAINBOW!",
      ...RAY,
      speed: 0.9,
      emotion: "happy",
    },
    a1_48_narrator: {
      text: "Rain and light. That is all a rainbow is.",
      ...NARRATOR,
      speed: 0.95,
    },
    a1_49_drip: {
      text: "Rain and light! That is you and me!",
      ...DRIP,
      emotion: "happy",
    },
    a1_50_narrator: {
      text: "Here is one to try, next time it rains while the sun is out.",
      ...NARRATOR,
    },
    // Homework, not a joke. The 45f beat after this is a child getting up and
    // turning round, and the next line must not land on top of them.
    a1_51_narrator: {
      text: "Stand with the sun behind you. And then look at the rain.",
      ...NARRATOR,
      speed: 0.95,
    },
    a1_52_narrator: {
      text: "A rainbow is always on the opposite side from the sun. Always.",
      ...NARRATOR,
    },
    a1_53_ray: {
      text: "Because I go INTO the rain and come back OUT again.",
      ...RAY,
    },
    a1_54_narrator: {
      text: "Every rainbow you have seen was light coming back out of rain.",
      ...NARRATOR,
    },
    a1_55_ray: { text: "So I am not the plain one.", ...RAY },
    // Scene 13: the act's turn. Same fact as a1_26, opposite feeling.
    a1_56_ray: {
      text: "I am not white. I am ALL of them. At the same time.",
      ...RAY,
      speed: 0.95,
      emotion: "happy",
    },
    a1_57_narrator: {
      text: "He is. And so is every sunbeam Sunny has ever made.",
      ...NARRATOR,
    },
    a1_58_sunny: {
      text: "I MAKE RAINBOWS! You're welcome! HA! HA!",
      ...SUNNY,
    },
    // Grown-up smirk, and true — the bending is the raindrop's doing.
    a1_59_narrator: {
      text: "Technically, that one is mostly Drip.",
      ...NARRATOR,
      speed: 0.9,
    },
    a1_60_sunny: { text: "WE ARE A TEAM! HA! HA!", ...SUNNY },

    // ---------------------------------------------------------------
    // ACT TWO — THE AIR. Big Word: SCATTER
    // ---------------------------------------------------------------
    a2_01_narrator: {
      text: "But hold on. We came here to ask about the sky.",
      ...NARRATOR,
    },
    // The episode's real question, sharpened now that Act One has made it
    // strange. Slowed, because it is the sentence the whole act answers.
    a2_02_narrator: {
      text: "Ray is every colour there is. So why is the sky only blue?",
      ...NARRATOR,
      speed: 0.92,
    },
    a2_03_ray: { text: "That is a good question. Why IS it only blue?", ...RAY },
    a2_04_narrator: {
      text: "Lots of people think the sky is blue because the sea is blue.",
      ...NARRATOR,
    },
    // Episode one's MYTH stamp, back for its second firing in the series.
    a2_05_narrator: { text: "Big myth. Busted.", ...NARRATOR, speed: 0.9 },
    a2_06_narrator: {
      text: "The sky is blue over the desert. No sea for a thousand miles.",
      ...NARRATOR,
    },
    a2_07_ray: { text: "So the sea is not doing it.", ...RAY },
    a2_08_narrator: {
      text: "It is the other way round. On a grey day, the sea goes grey.",
      ...NARRATOR,
    },
    // The correction as one clean pair. Slowed so the two halves separate.
    a2_09_narrator: {
      text: "The sea copies the sky. The sky does not copy the sea.",
      ...NARRATOR,
      speed: 0.92,
    },
    a2_10_sunny: {
      text: "It was PAINT! I painted it! I am extremely good at painting!",
      ...SUNNY,
    },
    a2_11_narrator: { text: "Sunny. Show us the paint.", ...NARRATOR },
    // Scene 16's button, after 45f of him holding an empty roller. This is Sunny
    // being caught out and covering, which no seasoning on any engine plays
    // anyway — the words do it, and the silence in front of it does more.
    a2_12_sunny: { text: "I keep the paint somewhere else.", ...SUNNY, speed: 0.95 },
    a2_13_narrator: {
      text: "We will come back to Sunny.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_14_narrator: {
      text: "To find the real answer, look at the sky and see nothing.",
      ...NARRATOR,
    },
    a2_15_ray: { text: "There is nothing up there. It is empty.", ...RAY },
    a2_16_narrator: {
      text: "It is not empty. It is FULL. It is full of air.",
      ...NARRATOR,
      speed: 0.95,
    },
    // PUFF, returning. His catchphrase, fired exactly once in the episode, on
    // his entrance — it is the whole of episode two in seven words and it is
    // also the fact this act is built on.
    a2_17_puff: {
      text: "Ray! Up here! You can't see me. But you can FEEL me.",
      ...PUFF,
      emotion: "happy",
    },
    // The third firing of the series' cross-episode rhyme (a2_18 and a3_42 in
    // the wind episode). Same flat 0.92 all three times.
    a2_18_narrator: {
      text: "That is Puff. Different show. Same air.",
      ...NARRATOR,
      speed: 0.92,
    },
    a2_19_ray: { text: "There are more of you?", ...RAY, emotion: "surprised" },
    a2_20_puff: {
      text: "There are ZILLIONS of us. We are the whole sky.",
      ...PUFF,
      emotion: "happy",
    },
    a2_21_narrator: {
      text: "Air is real stuff, made of bits far too small to see.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_22_narrator: {
      text: "So watch what happens when Ray flies into all that air.",
      ...NARRATOR,
    },
    // Scene 18. The honest age-level physics: big and calm versus jumpy and
    // bouncy. NOT "smaller" — see script.md, Physics honesty.
    a2_23_narrator: {
      text: "Red goes first. Red is big and calm, and hardly bounces at all.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_24_narrator: {
      text: "Straight through. Barely touched the sides.",
      ...NARRATOR,
      speed: 0.92,
    },
    a2_25_narrator: {
      text: "Now Blue. Blue is jumpy. Blue is the bounciest one there is.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_26_puff: {
      text: "Bounce off me! Go on! Everybody bounce off Puff!",
      ...PUFF,
      emotion: "happy",
    },
    // Sound word, alone in its own clip, with the 45f ricochet beat after it.
    // Narrator, so it is kokoro and free to re-cut. EAR-CHECK.
    a2_27_narrator: {
      text: "Ping. Ping. Ping.",
      ...NARRATOR,
      speed: 0.9,
    },
    a2_28_ray: { text: "Whoa. Where did Blue GO?", ...RAY, emotion: "surprised" },
    a2_29_narrator: {
      text: "Everywhere. Blue went absolutely everywhere.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Three-directions list. Slowed so above, beside and behind separate — this
    // is the sentence that turns a bouncing ball into a whole sky.
    a2_30_narrator: {
      text: "Blue is bouncing off the air above you, and beside you, and behind you.",
      ...NARRATOR,
      speed: 0.92,
    },
    a2_31_narrator: {
      text: "So wherever you look, blue is bouncing into your eyes.",
      ...NARRATOR,
    },
    a2_32_ray: {
      text: "So the blue is coming from ALL of the sky.",
      ...RAY,
      emotion: "surprised",
    },
    a2_33_narrator: {
      text: "So blue is not a patch of the sky. Blue is the WHOLE sky.",
      ...NARRATOR,
    },
    a2_34_ray: { text: "Hold on. Violet bounces even more than Blue does.", ...RAY },
    // The honest answer, and a grown-up smirk. Our eyes are the reason, not the
    // light. Slowed — it is a correction and it goes past fast otherwise.
    a2_35_narrator: {
      text: "It does. Our eyes are just not very good at violet.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_36_narrator: {
      text: "They are extremely good at blue. So blue is what we see.",
      ...NARRATOR,
    },
    // Scene 20: two words, and they are the episode's honesty tax made
    // kid-legible. Violet really does scatter more and the reason we do not see
    // a violet sky is our own eyes — which is a grown-up fact until somebody
    // apologises to him for it. Third firing of Ray's pedantry (a2_34, a2_46)
    // and a callback to the roll call, where he met Violet by name.
    // Deliberately NOT seasoned: `happy` or `sad` would play it as a punchline
    // being sold. Same call as a1_44_ray. The laugh is the 20f in front of it.
    a2_36b_ray: { text: "Sorry, Violet.", ...RAY },
    a2_37_narrator: {
      text: "When light bounces off tiny things and goes everywhere, that is called scatter.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_38_narrator: {
      text: "Scatter. It means to go everywhere at once.",
      ...NARRATOR,
    },
    // BIG WORD TWO — CHANT, and the only non-word syllable in the episode
    // ("Ter"). EAR-CHECK FIRST; if it arrives as "tur" or gets swallowed, the
    // safe fallback is pre-written: "Scatter! Scatter! SCATTER!"
    a2_39_ray: {
      text: "Scat. Ter. SCATTER!",
      ...RAY,
      speed: 0.9,
      emotion: "happy",
    },
    // The episode's chantable definition, and the line the whole act exists to
    // earn. Slowed; this is the one a grown-up rewinds.
    a2_40_narrator: {
      text: "Blue light scatters off the air. Everywhere. That is why blue is the whole sky.",
      ...NARRATOR,
      speed: 0.92,
    },
    a2_41_ray: {
      text: "The air scatters me! All day! In every direction!",
      ...RAY,
      emotion: "happy",
    },
    a2_42_narrator: {
      text: "And here is the bit that joins the whole show together.",
      ...NARRATOR,
    },
    // THE INTERLOCK LINE, SAID ONCE IN THE EPISODE. It is episode two's Big
    // Word cashed in as an answer, and it is the slowest narration line in the
    // act. Do not repeat it anywhere else; a second firing spends it.
    a2_43_narrator: {
      text: "The sky is blue because air is real stuff.",
      ...NARRATOR,
      speed: 0.88,
    },
    a2_44_puff: {
      text: "I TOLD you I was real stuff!",
      ...PUFF,
      emotion: "happy",
    },
    a2_45_sunny: { text: "EXCUSE ME. Whose light is that?", ...SUNNY },
    a2_46_ray: { text: "Um. Yours.", ...RAY },
    // The brag, and the one line in the episode whose script note asks for
    // separation INSIDE the line (script.md, Scene 23): the three halves must
    // land separately, because Scene 23 builds one third of his diagram on each.
    //
    // IT USED TO CARRY THE FILE'S ONLY TWO PAUSE MARKERS (`<#0.3#>`). Sunny is
    // back on kokoro, which has no such feature — it would read the punctuation
    // out loud, and the generator rejects the line outright rather than let it
    // through. So the separation is bought the way the Narrator's two equivalent
    // lines (`a2_27`, `a3_13`) have always bought it: with `speed`. 0.92, the
    // house list speed, and the exclamation marks do the rest.
    //
    // EAR-CHECK. If the three halves still run together, the fix is `speed`
    // (0.88, as `a1_42` and `a2_43` use) — NOT rewriting the line, which is
    // approved script, and NOT splitting it into three clips, which would move
    // the beat into `gaps` and change what Scene 23's diagram is built on.
    a2_47_sunny: {
      text: "So I painted the sky! With my sky paint! Obviously!",
      ...SUNNY,
      speed: 0.92,
    },
    // Episode two's concession, verbatim as far as the full stop — and then it
    // goes the other way. Flattest possible delivery, both halves.
    a2_48_narrator: {
      text: "I checked. Then I checked again.",
      ...NARRATOR,
      speed: 0.9,
    },
    a2_49_narrator: { text: "He is wrong.", ...NARRATOR, speed: 0.85 },
    // THE MOMENT. Two episodes of being insufferably correct end here, and it
    // is the only line in the series where Sunny doubts himself twice in a row.
    // On kokoro there is no seasoning to give it — the three flat full stops are
    // the read, and Scene 23 stages the doubt on his face instead (the grin
    // comes apart in the 36f beat *before* this line). Slowed so the three
    // sentences separate. EAR-CHECK: this is the one Sunny line whose meaning
    // depends on the delivery.
    a2_50_sunny: {
      text: "Wrong. Me. I have never been wrong.",
      ...SUNNY,
      speed: 0.95,
    },
    a2_51_narrator: {
      text: "There is no paint. There never was. The air does all of it.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Scene 23: Ray hands him back the half he actually owns. Kind, not
    // consoling — nobody in this show is unkind and nobody is pitied either.
    a2_52_ray: { text: "But Sunny. Every bit of that blue is your light.", ...RAY },
    // And he is off again, at full volume, inside one second.
    a2_53_sunny: {
      text: "MY LIGHT! THE SKY IS MADE OF MY LIGHT! YOU'RE WELCOME! HA! HA!",
      ...SUNNY,
    },
    a2_54_narrator: {
      text: "He is wrong about the sky. He is right about the light.",
      ...NARRATOR,
      speed: 0.92,
    },
    // The button on four minutes of set-up, and the grown-up's biggest laugh in
    // the episode. Deadpan, unseasoned, 45f of silence after it.
    a2_55_narrator: {
      text: "He will only remember one of those.",
      ...NARRATOR,
      speed: 0.9,
    },
    a2_56_ray: { text: "I am not the plain one any more.", ...RAY },
    // THE CATCHPHRASE, first firing, over the whole blue sky. Three firings in
    // the episode and this is the one that earns the other two.
    a2_57_ray: {
      text: "Look up. That's me.",
      ...RAY,
      speed: 0.9,
      emotion: "happy",
    },

    // ---------------------------------------------------------------
    // ACT THREE — THE SUNSET. Big Word: SUNSET
    // ---------------------------------------------------------------
    a3_01_narrator: {
      text: "The day went on. Ray kept scattering, and the sky kept being blue.",
      ...NARRATOR,
    },
    a3_02_narrator: {
      text: "And then, slowly, the light started coming in sideways.",
      ...NARRATOR,
    },
    a3_03_narrator: {
      text: "So we went down to the sea to watch.",
      ...NARRATOR,
    },
    a3_04_ray: {
      text: "Why is it going orange? Did somebody change me?",
      ...RAY,
      emotion: "surprised",
    },
    a3_05_narrator: {
      text: "Nobody changed you. You are the same light you were this morning.",
      ...NARRATOR,
    },
    // THE VOLCANO. One line, once, in the whole episode. It is a running gag
    // with no punchline yet — planted with no dialogue at all in episode two
    // (scenes 23 and 24, snoring smoke rings, nobody mentioning it), and this
    // is the first time anybody acknowledges it. Nobody reacts, nobody else
    // mentions it, and it is NOT explained. Slowest deadpan in the episode.
    a3_06_narrator: {
      text: "The volcano is still asleep. It has been asleep a very long time. It is extremely good at it.",
      ...NARRATOR,
      speed: 0.88,
    },
    a3_07_narrator: {
      text: "Here is what changed, and it is not Ray.",
      ...NARRATOR,
    },
    a3_08_narrator: {
      text: "At lunchtime, Ray came straight down. A short trip through the air.",
      ...NARRATOR,
    },
    a3_09_narrator: {
      text: "Now the sun is low. So Ray comes in sideways, along the ground.",
      ...NARRATOR,
      speed: 0.95,
    },
    a3_10_ray: { text: "And how long is that trip?", ...RAY },
    a3_11_narrator: {
      text: "Hundreds of miles of air, instead of a few.",
      ...NARRATOR,
      speed: 0.92,
    },
    a3_12_narrator: {
      text: "And you know what blue does in air. Blue bounces.",
      ...NARRATOR,
    },
    // Three beats of the same word, and the 45f beat after it is blue pinging
    // out of the beam one colour at a time. Slowed so they are three bounces
    // and not one noise.
    a3_13_narrator: {
      text: "Bounce. Bounce. Bounce. All the way along.",
      ...NARRATOR,
      speed: 0.88,
    },
    a3_14_narrator: {
      text: "By the time that light reaches you, the blue has all bounced away.",
      ...NARRATOR,
    },
    // THE ROLL CALL, SECOND FIRING — the series signature, and the picture the
    // scene already draws. Three items rather than Scene 10's seven, so 0.9
    // rather than 0.88; they still have to separate or they are one noise.
    // The three named are exactly the three the scene's staging already loses
    // (script.md, Scene 28: "indigo and violet go with it"), which is what makes
    // a3_15_ray's "So who is left?" land as a question the audience can answer.
    a3_14b_ray: {
      text: "Bye Blue! Bye Indigo! Bye Violet!",
      ...RAY,
      speed: 0.9,
      emotion: "happy",
    },
    // The flat explanatory line the roll call's shape requires — and it is the
    // one place in the episode where the "nothing is taken away" rule
    // (Production notes, Physics honesty) is said in words rather than trusted
    // to the staging. Kokoro, so it re-times for free. 0.92, the house list
    // speed, so the two halves separate.
    a3_14c_narrator: {
      text: "They did not go anywhere. They went everywhere else.",
      ...NARRATOR,
      speed: 0.92,
    },
    // The unbothered button. Deliberately NOT seasoned — the exact call made on
    // a1_44_ray ("I have never met me before."), which this is the sequel to,
    // and the same 0.95. If it sounds like it is being sold, it is wrong: it is
    // a mild fact about parts of himself having somewhere to be.
    a3_14d_ray: { text: "I will see me later.", ...RAY, speed: 0.95 },
    a3_15_ray: { text: "So who is left?", ...RAY },
    a3_16_narrator: {
      text: "The ones that never bounced much. Red. And orange.",
      ...NARRATOR,
      speed: 0.92,
    },
    a3_17_ray: { text: "The calm ones.", ...RAY, speed: 0.95 },
    a3_18_narrator: {
      text: "The calm ones. Straight down the middle, all the way to your eyes.",
      ...NARRATOR,
    },
    a3_19_narrator: {
      text: "Red and orange, right across the sky. That is a sunset.",
      ...NARRATOR,
    },
    // BIG WORD THREE — CHANT. Two real words again, same design as a1_47.
    a3_20_ray: {
      text: "Sun. Set. SUNSET!",
      ...RAY,
      speed: 0.9,
      emotion: "happy",
    },
    // Four-item list and the thesis of the act. Slowed.
    a3_21_narrator: {
      text: "Same sun. Same air. Same Ray. Just a much longer way through.",
      ...NARRATOR,
      speed: 0.9,
    },
    // Fifth firing of "You're welcome", and he is taking credit for the drama
    // rather than the mechanism, which is the one kind of credit he has left.
    a3_22_sunny: {
      text: "I do this bit ON PURPOSE! For the drama! You're welcome!",
      ...SUNNY,
    },
    a3_23_narrator: {
      text: "A sunset is not different light. It is the same light, taking the long way.",
      ...NARRATOR,
      speed: 0.95,
    },
    a3_24_narrator: {
      text: "Back on the hill, the kid was still colouring.",
      ...NARRATOR,
    },
    a3_25_narrator: {
      text: "The blue crayon went back in the box.",
      ...NARRATOR,
      speed: 0.9,
    },
    // The frame story's closing line and the episode's thesis in nine words.
    a3_26_narrator: {
      text: "Some days you need a different crayon. Nothing else changed at all.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Second firing of the catchphrase, over an orange sky. Deliberately NOT
    // the same words as a2_57, so it is a fresh clip and a quieter read — the
    // one `calm` line Ray has.
    a3_27_ray: {
      text: "Look up. That's still me.",
      ...RAY,
      speed: 0.9,
      emotion: "calm",
    },
    a3_28_narrator: {
      text: "The last of the light slid off the sea, and went round the world.",
      ...NARRATOR,
      speed: 0.95,
    },
    a3_29_ray: { text: "Wait. Am I finished?", ...RAY },
    a3_30_narrator: {
      text: "No. Somewhere out there, it is already morning.",
      ...NARRATOR,
      speed: 0.95,
    },
    // SAME RECORDING as a1_03, heard faintly from over the far horizon — the
    // second and last `sameAs` in the file, and the better one. The joke only
    // works if it is audibly the identical take of the identical greeting.
    //
    // KEPT DELIBERATELY, NOW THAT SUNNY IS BACK ON KOKORO. Kokoro is
    // deterministic, so two keys with the same words in the same voice at the
    // same speed would come back byte-identical anyway — but `sameAs` is
    // engine-agnostic (it copies the source's bytes under this key's filename,
    // see scripts/generate-narration.mjs) and it *states* the intent, so nobody
    // can later reword one of the two greetings and quietly break the gag.
    // Do not reword a1_03.
    a3_31_sunny: { sameAs: "a1_03_sunny" },

    // ---------------------------------------------------------------
    // RECAP — the chant, the mind-blower, the tease
    // ---------------------------------------------------------------
    rc_01_narrator: {
      text: "Let's say the big words together. Ready?",
      ...NARRATOR,
    },
    // Scene 32: one lit panel per character, each taking a bow for their own
    // Big Word. Same note puts rc_03 and rc_04 on `happy`.
    rc_02_ray: {
      text: "RAINBOW! Rain and light! Seven colours, and every one of them is me!",
      ...RAY,
      emotion: "happy",
    },
    rc_03_puff: {
      text: "SCATTER! Blue bounces off us and goes EVERYWHERE! That is me!",
      ...PUFF,
      emotion: "happy",
    },
    rc_04_sunny: {
      text: "SUNSET! That is my light taking the long way! You're welcome!",
      ...SUNNY,
    },
    // The three-word summary. Slowest line in the recap, on purpose.
    rc_05_narrator: {
      text: "Rainbow. Scatter. Sunset.",
      ...NARRATOR,
      speed: 0.88,
    },
    rc_06_narrator: {
      text: "And the blue is happening right now. Over your house. Over everybody's house.",
      ...NARRATOR,
      speed: 0.95,
    },
    rc_07_narrator: {
      text: "It is not painted on. It is made every day, out of light and air.",
      ...NARRATOR,
    },
    rc_08_narrator: { text: "Now here is the amazing part.", ...NARRATOR },
    rc_09_narrator: {
      text: "Somebody is standing on the Moon. The sun is shining right on them.",
      ...NARRATOR,
    },
    // Scene 34: he claims the Moon one line before the Moon turns out not to
    // have a sky. The cold open's shape (state the wrong theory, then break it)
    // compressed into ten seconds, and his sixth claim of the episode.
    // NO "You're welcome!" here — the catchphrase already fires seven times and
    // an eighth is a tax on the three that matter.
    rc_09b_sunny: {
      text: "THAT IS ME! I am shining on the MOON as well!",
      ...SUNNY,
    },
    rc_10_narrator: {
      text: "It is the middle of the day. And the sky above them is BLACK.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Scene 34: the audience's question, asked for them, after a 60f hold on a
    // black sky full of stars in broad daylight.
    rc_11_ray: {
      text: "Black? In the daytime? Why?",
      ...RAY,
      speed: 0.95,
      emotion: "surprised",
    },
    // The objection, and it is the control experiment. He is not wrong and he
    // is not complaining — the sun really is visible in a black lunar sky,
    // which is the most counter-intuitive true thing in three episodes.
    // rc_12_narrator already answers him word for word, so this line costs the
    // scene nothing except the ten seconds it makes funny.
    // Slowed a touch: it is a genuine question, not a brag. Kokoro, so free and
    // free to reword. Deliberately NOT "EXCUSE ME" — that gag is at one firing
    // in this episode (a2_45) and a second eleven minutes later is a tic.
    rc_11b_sunny: { text: "So where is the sky? I am RIGHT HERE.", ...SUNNY, speed: 0.95 },
    rc_12_narrator: {
      text: "Because the Moon has no air. And no air means nothing to bounce blue off.",
      ...NARRATOR,
      speed: 0.95,
    },
    rc_13_narrator: {
      text: "The light is still there. There is nothing for it to scatter on.",
      ...NARRATOR,
    },
    rc_14_ray: {
      text: "So the blue sky is a thing the AIR does.",
      ...RAY,
      emotion: "happy",
    },
    rc_15_narrator: {
      text: "Air, and light, and nothing else. That is your whole blue sky.",
      ...NARRATOR,
      speed: 0.92,
    },
    rc_16_narrator: { text: "Next time.", ...NARRATOR, speed: 0.9 },
    // Scene 35: a wobbling smoke ring and a rumble under it. Kept wondrous, not
    // frightening — see the tone guardrail in script.md.
    rc_17_narrator: {
      text: "Something is waking up.",
      ...NARRATOR,
      speed: 0.9,
    },
    // THE RUNNING GAG, INVERTED. Three episodes of "that one is me as well!"
    // end on him squinting at the horizon and disclaiming it. Flat and slow —
    // he is not scared and he is not joking, he is just, for once, not sure it
    // is his. Nothing enters the 45f beat after it.
    rc_18_sunny: { text: "That is not me.", ...SUNNY, speed: 0.9 },
    // Third and last firing of the catchphrase, waving from the corner of the
    // episode four card.
    rc_19_ray: {
      text: "Bye! Look up. That's me.",
      ...RAY,
      emotion: "happy",
    },
  },
};
