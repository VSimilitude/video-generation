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
// AND THE COLOURS — six of the seven, since the 2026-08-01 revision:
//
//   Red       minimax  Patient_Man      0.9   five lines, all `calm`. The calm
//                                             end of the spectrum, and the
//                                             owner of the sunset
//   Orange    minimax  Determined_Man   0.95  ONE line. Red's second. Agrees
//                                             with Red about everything
//                                             (pitch +2)
//   Yellow    minimax  Sweet_Girl_2     1.0   two lines. Cheerful about
//                                             literally everything, including
//                                             bad news
//   Green     minimax  Friendly_Person  0.95  one line. Content. Has no notes
//   Blue      minimax  Decent_Boy       1.05  four lines. The jittery end, and
//                                             the reason the sky is blue
//   Indigo    minimax  Decent_Boy       1.1   two lines. Blue's echo — same
//                                             casting, pitch +3, faster, and
//                                             his lines are the TAILS of
//                                             Blue's, arriving late
//   Violet    —        —                —     NEVER. See the block below
//
// Silent, and staying silent: the kid (silhouette, never speaks, three
// episodes running), the volcano (scenery — it has never had a line and does
// not get one when it opens an eye in Scene 28b), and **Violet, who is now the
// only colour without a voice**, which is what makes the joke load-bearing:
// five silent siblings did not mark his silence, six speaking ones do.
//
// PITCH is a MiniMax field and a new one in this repo (added with Indigo, who
// is the reason for it): whole semitones, -12..+12, passed straight through to
// the model. It is how a *second character* comes out of one casting — a
// shadow, an echo — rather than a knob for sweetening a read. Kokoro has no
// such field and the generator rejects it there rather than ignore it.
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
// words were written to carry it. The six colours are the exception that
// proves it: each one carries exactly ONE emotion for the whole episode and
// never changes it, because the emotion *is* the character. Red is `calm` in
// every frame he is in; a Red who plays a reaction has stopped being Red.
// Ray's fifty keys are twenty-one
// "auto", twenty-five seasoned and four `sameAs` aliases of one shared
// recording, and the seasoning is
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

// ---------------------------------------------------------------------------
// THE COLOURS — six voices, one silence
// ---------------------------------------------------------------------------
//
// The 2026-08-01 revision's largest change after the arc: the seven blobs stop
// being a crowd and become the ensemble, because **their temperaments are the
// physics**. Blue cannot cross a room without hitting something, so he ends up
// going in every direction, so he arrives at your eye from all of it. Red plows
// straight through two hundred miles of air without deviating, so at the end of
// the longest trip of the day he is the one still walking. Neither fact is ever
// stated as a property of light; both are staged as a temperament and then
// named by the Narrator in lines that already existed (`a2_23`, `a2_25`).
//
// LINE BUDGET, AND IT IS THE DISCIPLINE THE WHOLE THING RESTS ON. Blue and Red
// are the double act (four and five lines). Orange, Yellow, Green and Indigo
// get ONE OR TWO LINES EACH and every one of them is the character in a
// sentence — Orange only ever agrees with Red, Yellow is cheerful about
// anything including bad news, Green is content, Indigo repeats the tail of
// whatever Blue just said, late. Nobody gets a second personality trait and
// nobody gets a third line.
//
// ============================ VIOLET =======================================
// VIOLET HAS NO LINES. NOT ONE, NOT EVER, IN THIS EPISODE OR ANY OTHER.
//
// There is deliberately no `VIOLET` constant below to hang one on, and if you
// are here to add one: don't. Violet is the hardest-working object in every
// frame he is in — he out-scatters Blue, which is true physics, and the reason
// the sky is not violet is our eyes and not him — and the joke of three
// episodes is that nobody notices. Under the old cut all six of his siblings
// were silent too, which meant his silence was not marked. Now six of them speak,
// one of them (Yellow) even talks *to* him, and he still does not get a word.
// That is the same joke, load-bearing, for zero clips and zero seconds. The
// moment he speaks he is a twelfth voice and the gag is gone.
//
// He is greeted by name in Scene 10, half falls off the W in Scene 11, is
// apologised to in Scene 20, exits the race in silence in Scene 28 while
// everybody around him is shouting, and waves from the edge of the recap panel.
// Five firings, no clips.
// ===========================================================================
//
// CASTING, decided by Mike 2026-08-01. Each colour is behind its own constant
// with a kokoro stand-in, exactly as `RAY_ENGINE`/`PUFF_ENGINE`: a recast is one
// line and a free re-time. The two leads get their own engine toggle because
// they are the ones most likely to move; the supporting four share one.

// BLUE. Fast, eager, breathless, interrupts himself, apologises to the air.
// `Decent_Boy` was Ray's runner-up and the declared risk was timbre separation
// from Ray — but Blue is literally a piece of Ray, so a family resemblance is
// true, and Ray went to `Young_Knight` in the end. `speed: 1.05` is the first
// line in three episodes to run above 1.0 and it is deliberate: the character
// is faster than everybody else, which is the physics and the joke in one
// field. EAR-CHECK Blue against Ray back to back (`a2_28b` -> `a2_32_ray`) —
// if they sound like one person, the split reveal is damaged.
const BLUE_ENGINE = "minimax";
const BLUE_MINIMAX_VOICE = "Decent_Boy";
const BLUE =
  BLUE_ENGINE === "minimax"
    ? { engine: "minimax", voiceId: BLUE_MINIMAX_VOICE, speed: 1.05 }
    : { voice: "af_sky", speed: 1.05 }; // kokoro stand-in, for free re-timing

// RED. Slow, low, and genuinely unbothered. The failure mode is not "too deep",
// it is SLEEPY: a tired Red makes the sunset read as the light dying, which is
// the one thing the tone guardrail forbids. `Patient_Man` is proven on this
// pipeline and *patient* is exactly the note. `Deep_Voice_Man` was excluded (it
// is ep 2's rock) and `Elegant_Man` at pitch -6 is reserved for the volcano.
// 0.9 rather than the treatment's 0.85: nothing in this repo has run a MiniMax
// character line that slow and 0.9 was the written-down fallback.
const RED_ENGINE = "minimax";
const RED_MINIMAX_VOICE = "Patient_Man";
const RED =
  RED_ENGINE === "minimax"
    ? { engine: "minimax", voiceId: RED_MINIMAX_VOICE, speed: 0.9 }
    : { voice: "am_onyx", speed: 0.9 }; // kokoro stand-in, for free re-timing

// The supporting four. One toggle, four voices, one line each except Yellow.
const COLOUR_ENGINE = "minimax";

// ORANGE. Red's second: matches his stride, one body-length behind, never
// overtakes, and agrees with him about everything including the pace. `pitch: 2`
// puts him just off `Determined_Man`'s natural placement so he reads as a
// smaller Red rather than a second authority — he is not a rival, he is an echo
// with better manners.
const ORANGE =
  COLOUR_ENGINE === "minimax"
    ? { engine: "minimax", voiceId: "Determined_Man", speed: 0.95, pitch: 2 }
    : { voice: "bm_george", speed: 0.95 }; // kokoro stand-in (no pitch there)

// YELLOW. Waves at everyone, continuously, including at things that are
// leaving — which is why he is the only character in three episodes who ever
// addresses Violet. Cheerful about literally everything, including being told
// off by a narrator on top of a volcano.
const YELLOW =
  COLOUR_ENGINE === "minimax"
    ? { engine: "minimax", voiceId: "Sweet_Girl_2", speed: 1.0 }
    : { voice: "bf_lily", speed: 1.0 }; // kokoro stand-in, for free re-timing

// GREEN. Sits down the instant anything on screen stops moving. Content. Has no
// notes. One line, and he says it while dropping out of the race.
const GREEN =
  COLOUR_ENGINE === "minimax"
    ? { engine: "minimax", voiceId: "Friendly_Person", speed: 0.95 }
    : { voice: "am_michael", speed: 0.95 }; // kokoro stand-in

// INDIGO. Blue's shadow, and now vocally as well as physically: the SAME
// casting as Blue, shifted `pitch: 3` and run faster, so he is audibly a copy
// rather than a seventh person — physics-true, because an adjacent wavelength
// is a faded version of its neighbour and not a new colour. **Every Indigo line
// in the file is the TAIL of the Blue line before it**, arriving late, from the
// place Blue has just left. Write them that way or he is just another voice.
// (Addendum 2 sketched him pitched *down*; Mike's final call is up and thinner,
// which reads as a faded copy rather than as an older brother.)
const INDIGO =
  COLOUR_ENGINE === "minimax"
    ? { engine: "minimax", voiceId: BLUE_MINIMAX_VOICE, speed: 1.1, pitch: 3 }
    : { voice: "am_liam", speed: 1.1 }; // kokoro stand-in (no pitch there)

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
    // Scene 5, the eight minutes. FIVE FIRINGS OF ONE QUESTION, with a flat
    // almanac answer after four of them and nothing at all after the fifth.
    //
    // THE FIVE FIRINGS ARE ONE RECORDING. a1_13_ray is the only synthesis; the
    // other four are aliases of it. Not four takes — MiniMax returned episode
    // two's one repeated sentence at 2.20s and then 2.84s, a thirty percent
    // swing in the line whose entire job was to sound the same — and this gag
    // is *only* the sameness. Five identical clips also mean five identical
    // mouth shapes and five identical bubbles, which is what makes the picture
    // as flat as the sound. The text lives on a1_13; changing it there
    // re-copies all four, and there is nothing to keep in step by hand.
    //
    // The escalation lives in `Video.tsx` (30 / 45 / 60 / 75), not here. The
    // clips must not vary at all: it is the gaps that grow.
    a1_13_ray: { text: "Are we there yet?", ...RAY },
    a1_14_narrator: {
      text: "One minute down. Seven to go.",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_15_ray: { sameAs: "a1_13_ray" },
    a1_15b_narrator: {
      text: "Two minutes down. Six to go.",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_15c_ray: { sameAs: "a1_13_ray" },
    // THE ARITHMETIC SKIPS HERE — two to four — and that is the grown-up smirk
    // and the thing that stops four answers being a recitation. Same shape,
    // same speed, same complete lack of interest as the other three.
    a1_15d_narrator: {
      text: "Four minutes down. Four to go.",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_15e_ray: { sameAs: "a1_13_ray" },
    a1_16_narrator: {
      text: "Seven minutes down. One to go.",
      ...NARRATOR,
      speed: 0.92,
    },
    // FIRING FIVE, AND IT IS NOT ANSWERED. Scene 6 cuts hard to a garden at
    // full brightness on the frame after it, and a1_17_narrator ("And then Ray
    // arrived, all at once, the way light always does") is the answer. The
    // button of the whole gag is a cut, which is why Scene 5's tail is 6f.
    a1_16b_ray: { sameAs: "a1_13_ray" },
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
    // TEXT CHANGED 2026-08-01 (was "It was PAINT! I painted it! I am extremely
    // good at painting!"). Three claims that now ESCALATE, and the middle one
    // names the colour the episode is about. The old middle claim had no
    // antecedent on screen once the scene stopped showing him paint, and the
    // third was not about the sky at all.
    a2_10_sunny: {
      text: "It was PAINT! Blue paint! I painted the whole sky!",
      ...SUNNY,
    },
    a2_11_narrator: { text: "Sunny. Show us the paint.", ...NARRATOR },
    // Scene 16's button, after 45f of him tipping an empty tray at the camera.
    // This is Sunny being caught out and covering, which no seasoning on any
    // engine plays anyway — the words do it, and the silence in front of it
    // does more.
    a2_12_sunny: { text: "I keep the paint somewhere else.", ...SUNNY, speed: 0.95 },
    // TEXT CHANGED 2026-08-01 (was "We will come back to Sunny."), because the
    // episode no longer comes back to declare him wrong — the wrongness
    // ceremony moved to episode four. This turns Act Two into a SEARCH, which
    // motivates the next seven scenes; it chains straight into a2_14_narrator
    // ("To find the real answer, look at the sky and see nothing"); and it
    // plants Scene 23's new payoff exactly — the paint turns out to be real,
    // and it turns out to be his light.
    a2_13_narrator: {
      text: "So we went looking for the paint.",
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
    // RED'S FIRST LINE, after eight minutes on screen without one — which is
    // what makes it land: the audience has watched him not react to anything,
    // including being greeted by name, and the first thing he says is a flat
    // confirmation of the thing they had already noticed. It agrees with
    // a2_23_narrator word for word, which is the joke: he is not boasting, he
    // is confirming, and "Always have" is the only attitude in it.
    // DELIBERATELY NOT AN ABSOLUTE — the Narrator's "hardly bounces at all" is
    // the accurate claim and this does not contradict it (Physics honesty: red
    // light does scatter, just not much, and no character says otherwise).
    // 16f of approach in front of it, in Video.tsx: every Red line takes twice
    // the house turn gap, so the character is in the timeline and not the read.
    a2_23b_red: { text: "I go straight through. Always have.", ...RED, emotion: "calm" },
    a2_24_narrator: {
      text: "Straight through. Barely touched the sides.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Two words after 20f of silence, and the warmest thing anybody says in Act
    // Two — which is the note that keeps Red from reading as cold. A complete
    // two-character joke with a silent participant: Puff offered him a bounce
    // (the free visual in Scene 18), Red declined without noticing, and now he
    // compliments the air on his way out. EAR-CHECK: two words at 0.9 is the
    // shortest and slowest clip in the file; listen for clipping. Fallback if
    // it clips: "Lovely air, that."
    a2_24b_red: { text: "Lovely air.", ...RED, emotion: "calm" },
    a2_25_narrator: {
      text: "Now Blue. Blue is jumpy. Blue is the bounciest one there is.",
      ...NARRATOR,
      speed: 0.95,
    },
    // BLUE'S FIRST LINE, and he does not wait to be finished introducing — 4f
    // in front of it, half the house gap, so the interruption is in the
    // timeline. He is apologising to the air. The air does not mind, and nobody
    // acknowledges it, ever, in the whole episode.
    // EAR-CHECK, AND THIS IS THE FIRST ONE TO LISTEN TO. Repeated one-word
    // exclamations read differently on MiniMax than on kokoro and this is five
    // of them — it came back at **5.54s for five words** (1.11 s/word), against
    // Ray's ~0.38 and Blue's own 0.31 on a3_13b. The model is putting a long
    // pause after every exclamation mark, which is the exact opposite of the
    // character: at 1.05 he is supposed to be the fastest thing in the show.
    // Fallback, pre-written and safer, if it plays slow:
    //   "Hi! Sorry! I did not mean to hit you!"
    a2_25b_blue: { text: "Hi! Sorry! Sorry! Hi! Sorry!", ...BLUE, emotion: "happy" },
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
    // THE MECHANISM, SAID BY THE MECHANISM, and the answer arrives from the
    // character rather than the Narrator. Three bubbles, one per clause, each
    // from a different corner of the frame — see script.md, Scene 19, for the
    // `beats()` fractions and the `tailAt` note. 4f in front of it, like every
    // Blue entrance. Came back at **6.66s**, which is long for eight words but
    // is the one place that helps — three bubbles need the room. Re-measure the
    // fractions against the clip before staging, and again if it is reworded.
    a2_28b_blue: { text: "I am over here! And here! And HERE!", ...BLUE, emotion: "happy" },
    // INDIGO'S FIRST LINE AND THE RULE HE ESTABLISHES: it is the TAIL of the
    // line above, said late, from the corner Blue has already left. He is not
    // making a point and he is not joining in — he is four frames behind a joke
    // that has finished. Same casting as Blue, pitch +3, faster: audibly a copy.
    a2_28c_indigo: { text: "And here. And here.", ...INDIGO, emotion: "happy" },
    // Now a CONFIRMATION rather than an announcement, which is strictly better:
    // the audience got the answer from Blue and the Narrator agrees with them.
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
    // TEXT CHANGED 2026-08-01 (was "He is wrong."). SAME SLOT, SAME 0.85 DEADPAN
    // FLOOR, SAME THREE FLAT WORDS, NO VERDICT. Two episodes trained the
    // audience to expect "He is right. Again."; this episode's cold open
    // trained them to expect the opposite. They get a third thing, and the
    // third thing is a joke rather than a ruling. The wrongness ceremony — and
    // "That is not me." with it — is banked for episode four.
    // EAR-CHECK THIS ONE FIRST, before anything else in the revision is built:
    // it has to be FLAT, not amused and not apologetic. The whole arc change
    // rests on this clip landing as a surprise rather than as a dodge.
    a2_49_narrator: { text: "He has a point.", ...NARRATOR, speed: 0.85 },
    // TEXT CHANGED 2026-08-01 (was "Wrong. Me. I have never been wrong."). His
    // moment of doubt becomes his moment of triumph, which is what "undefeated"
    // means, and it is a joke where there used to be a pause. The pun is
    // VISUAL — he fans his rays on "points" and he is drawn covered in them.
    // EAR-CHECK: does the pun read on am_puck? Free to reword, kokoro.
    // Fallback: "Of course I do. I always do."
    a2_50_sunny: {
      text: "I DO have a point! I have LOADS of points!",
      ...SUNNY,
      speed: 0.95,
    },
    // TEXT CHANGED 2026-08-01 (was "There is no paint. There never was. The air
    // does all of it."). The denial goes and the concession arrives FIRST,
    // which is what turns Ray's next line into a correction rather than a
    // consolation. It is also true in a way the old line was not: the blue is
    // made of his light and nothing else.
    a2_51_narrator: {
      text: "The light is his. Every single bit of it.",
      ...NARRATOR,
      speed: 0.95,
    },
    // TEXT CHANGED 2026-08-01 (was "But Sunny. Every bit of that blue is your
    // light.") — the Narrator now says that one line earlier, so this would be
    // a repeat. Ray's register changes with it and improves: he is no longer
    // consoling a defeated Sun, he is being a PEDANT, which the density audit
    // named as his one genuinely funny characterisation and which fires twice
    // elsewhere (a2_34, a2_36b). Same generosity, opposite direction — he hands
    // Sunny his half in a2_46 and takes the other half back here.
    a2_52_ray: { text: "But the AIR did the painting.", ...RAY },
    // And he is off again, at full volume, inside one second.
    a2_53_sunny: {
      text: "MY LIGHT! THE SKY IS MADE OF MY LIGHT! YOU'RE WELCOME! HA! HA!",
      ...SUNNY,
    },
    // TEXT CHANGED 2026-08-01 (was "He is wrong about the sky. He is right
    // about the light."). Same two-item shape a2_55 needs, with the verdict
    // taken out of both halves — and it is the title of the episode said out
    // loud, once, for the only time in it. a2_55 IS UNCHANGED, and the biggest
    // grown-up laugh in the show still fires off a two-item list.
    a2_54_narrator: {
      text: "It is his light. It is not his painting.",
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
    // a3_06_narrator IS DELETED (2026-08-01), and Scene 26 with it. The volcano
    // gag's entire value is that the show appears not to think it is important,
    // and the delivered cut stopped the episode, pointed a camera at it for
    // twelve seconds and said a sentence about it. It is scenery again: on the
    // measured horizon, snoring, continuously visible, acknowledged by nobody.
    // Its one in-episode touchpoint is now IN-WORLD and has no line about it at
    // all — Yellow lands on it during the race, the Narrator warns him off
    // (a3_14i, which is addressed to Yellow and not to the volcano), and it
    // opens one eye in silence. The clip stays on disk; re-adding the key is
    // free if this is ever reversed.
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
    // ---------------------------------------------------------------
    // THE SUNSET RACE (Scenes 28 / 28b / 28c) — the 2026-08-01 addendum.
    //
    // The old "Blue runs out" drain becomes a RACE: all seven set off down two
    // hundred miles of sideways air, and they drop out one at a time, IN
    // CHARACTER, until the two calm ones walk out the far end. It is the
    // mechanism staged as ensemble comedy, and it is the same physics the
    // delivered cut drew as a diagram.
    //
    // THE RULE THAT GOVERNS EVERY EXIT: nobody loses and nothing is taken away.
    // Each colour is BOUNCED OUT SIDEWAYS and goes and decorates the sky — the
    // exits are staged as bounces UP into the blue, never as falling, fading or
    // vanishing. a3_14c_narrator ("They did not go anywhere. They went
    // everywhere else.") is the sentence that says so and it is unchanged.
    a3_12_narrator: {
      text: "And you know what blue does in air. Blue bounces.",
      ...NARRATOR,
    },
    // NEW. Starts the race and tells the audience what to watch, without
    // promising a winner — the survivors are not better, they are just the ones
    // that did not bounce. Slowed; it is a setup line for a ninety-second gag.
    a3_12b_narrator: {
      text: "All seven set off down it together. Watch who lasts.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Three beats of the same word, and the 45f beat after it is the race
    // starting — blue pinging out of the beam one colour at a time. Slowed so
    // they are three bounces and not one noise.
    a3_13_narrator: {
      text: "Bounce. Bounce. Bounce. All the way along.",
      ...NARRATOR,
      speed: 0.88,
    },
    // BLUE IS OUT FIRST, and he goes UP, cheerfully, apologising to the air on
    // his way — the same joke as a2_25b, landing after the 45f race-start beat:
    // the one place in the episode he does NOT get his 4f interruption gap
    // (see script.md, Scene 28 — the race start is held, not interrupted). He is not
    // losing a race, he is becoming the sky, which is what the whole episode
    // has been about for four minutes.
    a3_13b_blue: {
      text: "Sorry! Sorry! I am going UP now! Bye!",
      ...BLUE,
      emotion: "happy",
    },
    // INDIGO, four beats late, from the place Blue has just left, saying the
    // TAIL of Blue's line and nothing of his own. Second and last firing of the
    // rule established at a2_28c. Do not give him a new sentence here.
    a3_13c_indigo: { text: "Going up now. Bye.", ...INDIGO, emotion: "happy" },
    // ============================ VIOLET ===================================
    // VIOLET EXITS HERE AND HE DOES NOT SAY ANYTHING. He goes last of the
    // three, highest and furthest, out-bouncing both of them — and while Blue
    // is shouting and Indigo is echoing, he leaves in complete silence. That
    // contrast IS the gag, and it is the only place in the episode where his
    // silence is heard rather than seen. No line, no clip, no key.
    // =======================================================================
    // YELLOW, waving at somebody who is leaving, which is his entire character
    // — and he is the ONLY character in three episodes who addresses Violet by
    // name and expects nothing back. Nobody else looks up. Violet does not
    // answer, because Violet never answers.
    a3_13d_yellow: { text: "Great bounce, Violet!", ...YELLOW, emotion: "happy" },
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

    // --- Scene 28b: the race, second leg — out over the sea ----------------
    // NEW. Four of the seven left, and the count is said out loud because a
    // six-year-old is counting anyway. The deadpan arithmetic is the grown-up's
    // half of it. 0.92 so the two halves separate.
    a3_14e_narrator: {
      text: "Out over the sea now. And then there were four.",
      ...NARRATOR,
      speed: 0.92,
    },
    // GREEN'S ONE LINE, and it is his entire character: he sits down the
    // instant anything stops moving, and out here that is a becalmed sailboat.
    // He is not giving up and he is not sad — he has simply arrived somewhere
    // nice and has no further notes. `calm`, and he never carries anything else.
    a3_14f_green: { text: "This is a nice spot.", ...GREEN, emotion: "calm" },
    // Physics honesty, said plainly, because green scattering less than blue
    // and more than red is the actual shape of the thing and this is the one
    // place the episode can show a MIDDLE of the spectrum. Not "Green gave up".
    a3_14g_narrator: {
      text: "Green bounced off as well. He just took longer.",
      ...NARRATOR,
      speed: 0.92,
    },
    // YELLOW'S SECOND LINE. He has spotted a warm rock in the middle of the sea
    // and is delighted with it. He does not know what it is. Nobody tells him.
    a3_14h_yellow: {
      text: "A warm rock! I will have a little sit down!",
      ...YELLOW,
      emotion: "happy",
    },
    // THE WARN-OFF, and it is the ONLY line anybody says anywhere near the
    // volcano in this episode. It is addressed to Yellow, not to the volcano;
    // it does not name it, explain it or acknowledge that it is anything other
    // than a rock. Flat and quick, the way you would move a child off a hob.
    //
    // Then a 45f held beat in which THE VOLCANO OPENS ONE EYE, holds, and
    // closes it. No line, no bubble, no rumble on the soundtrack, no reaction
    // from anybody — the first time in three episodes it has shown it is aware,
    // and the whole value of it is that the show does not comment. (ep 2: asleep
    // and unmentioned -> ep 3: one eye -> ep 4: awake.) Yellow bounces off
    // apologetically and goes up after the others, in silence.
    a3_14i_narrator: {
      text: "That is not a rest stop.",
      ...NARRATOR,
      speed: 0.9,
    },

    // --- Scene 28c: the race, finish line ----------------------------------
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
    // RED'S MOMENT — the payoff of five scenes of being boring on purpose, and
    // the only place in the episode where the sunset is allowed to be lovely
    // without being explained. NEW establishing line; 36f after it in which he
    // simply walks, with Orange one body-length behind.
    a3_18b_narrator: {
      text: "At the end of all that air, one colour is still walking.",
      ...NARRATOR,
      speed: 0.95,
    },
    // The direct answer to the goodbye roll call ninety seconds earlier, and he
    // is not sorry about it in the slightest. `calm`, like every Red line.
    a3_18c_red: { text: "Everybody bounced off.", ...RED, emotion: "calm" },
    // THE LINE THE SCENE EXISTS FOR, and the most fragile clip in the file. It
    // has to be CONTENTED, not tired — the sunset must never read as the light
    // dying, and this is the clip where that call gets made. 45f of silence
    // after it, and nothing enters. EAR-CHECK before any of Act Three is staged.
    a3_18d_red: { text: "Peace and quiet.", ...RED, emotion: "calm" },
    // ORANGE'S ONE LINE IN THE EPISODE, and possibly his entire vocabulary for
    // the series: he agrees with Red, about everything, including this. It
    // lands AFTER the 45f silence rather than inside it, one body-length
    // behind, which is where he has been all episode.
    a3_18e_orange: { text: "What Red said.", ...ORANGE, emotion: "calm" },
    // About anticipation, not loss. The tone guardrail lives in this line.
    a3_18f_narrator: {
      text: "Red has waited all day for this.",
      ...NARRATOR,
      speed: 0.92,
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
    // NEW. Blue shoves into Puff's panel and claims the word off him. Neither
    // of them concedes and NEITHER OF THEM IS WRONG — scattering takes light
    // AND air, and two characters squabbling over one word is the mechanism
    // staged as an argument. Nobody adjudicates and the panel light just moves
    // on. 4f in front of it, like every Blue entrance in the episode.
    rc_03b_blue: {
      text: "SCATTER! That is ME bouncing! That is ME!",
      ...BLUE,
      emotion: "happy",
    },
    rc_04_sunny: {
      text: "SUNSET! That is my light taking the long way! You're welcome!",
      ...SUNNY,
    },
    // NEW. Fourth firing of the series' credit-allocation joke ("Technically,
    // that one is mostly Drip", a1_59) and the FIRST one delivered by the
    // character being cheated rather than by the Narrator. Red walks into
    // Sunny's panel from the side and out of the far edge of it; Sunny does not
    // hear it, does not look at him, and takes his bow anyway. 16f in front
    // (Red's house gap) and 20f of stillness after — nothing enters that beat.
    // It is the last word on Sunny before the Moon and the tease, and it leaves
    // the audience knowing something he does not, which is exactly the state
    // the episode wants them in.
    rc_04b_red: { text: "It is mostly me.", ...RED, emotion: "calm" },
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
    // TEXT CHANGED 2026-08-01 (was "That is not me."). THE INVERSION IS
    // WITHDRAWN AND BANKED FOR EPISODE FOUR, where it can land *after* the
    // wrongness ceremony instead of instead of it. What fires here is the gag's
    // STANDARD firing, in the wording it has had since ep 2's rc_14_sunny:
    // reflexive, instant, completely unearned. Three episodes of a character
    // claiming everything end with him claiming one more thing, which is the
    // honest ending for a character who has not been corrected.
    // EAR-CHECK at 1.0: full confidence, no doubt anywhere in it. If it plays
    // as unsure the tease has gone the wrong way and taken episode four with it.
    rc_18_sunny: { text: "OH! That one is me as well! HA! HA!", ...SUNNY },
    // NEW. The doubt, planted without a verdict. "Hmm." is the Narrator's own
    // established deadpan (a1_27_narrator, where she declines to argue with Ray
    // about being plain), so a returning viewer already knows exactly what it
    // means when she says it and exactly how much she is not saying. Flat and
    // slow. Nothing enters the 30f after it.
    rc_18b_narrator: { text: "Hmm. We will find out.", ...NARRATOR, speed: 0.9 },
    // Third and last firing of the catchphrase, waving from the corner of the
    // episode four card.
    rc_19_ray: {
      text: "Bye! Look up. That's me.",
      ...RAY,
      emotion: "happy",
    },
  },
};
