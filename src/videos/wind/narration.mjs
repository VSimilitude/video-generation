// Narration script for "Puff and the Kite That Wouldn't Fly" — Little Big
// World, episode two. Topic: where wind comes from. Audience: six-year-olds.
// Run `npm run narration -- --video wind` after editing; unchanged lines are
// served from cache.
//
// FORMAT
// Every line is an object so each character keeps its own voice. The file-level
// `voice` / `speed` are the house default (the Narrator); character lines
// override per line.
//
//   Narrator  kokoro   af_heart         1.0   warm storyteller, occasional
//                                             deadpan. Voice only — no body,
//                                             ever
//   Puff      minimax  Exuberant_Girl   1.0   our hero. Small, apologetic,
//                                             then unstoppable
//   Sunny     kokoro   am_puck          1.0   the Sun. Enormous ego, and
//                                             entirely correct
//   Cloudia   minimax  Abbess           1.0   one-scene cameo, delivered by wind
//   Drip      minimax  Lively_Girl      1.0   one fan-service line, waving from
//                                             inside Cloudia
//   Beetle    minimax  Patient_Man      0.92  two lines, three firings
//   Leaf      minimax  Calm_Woman       0.92  two lines
//   Rock      minimax  Deep_Voice_Man   0.85  one line, no hurry at all
//
// THE THREE CAMEOS HAVE THEIR OWN VOICES NOW. They used to be the Narrator
// doing all three, on the theory that the show never grows past five actors.
// The first six-year-old to watch the cut said "the beetle and the leaf sound
// like the narrator" — which is the whole gag failing, because the joke needs
// the audience to hear somebody *else* fail to notice Puff. They are cast, and
// the show has eight voices.
//
// TWO ENGINES. The Narrator stays on kokoro — it is the storyteller voice the
// series was built on, it is free, and it re-synthesizes instantly when a line
// is reworded. Everybody else with a body on screen is cast on MiniMax
// speech-2.8-hd (Replicate, ~$0.11/1000 characters), which is paid but can
// *act*: it takes an `emotion` and honours inline pause markers. The
// principals were picked by ear from auditions (public/narration/auditions-mm,
// and auditions-mm-puff for Puff) and approved 2026-07-26; the three cameos
// were cast on description on 2026-07-27 and are unheard.
//
// SUNNY IS BACK ON KOKORO (`am_puck` @1.0), decided 2026-07-28. He was moved to
// MiniMax `Imposing_Manner` with the rest of the cast and it was the one recast
// that lost something: the ep-1 voice *is* the character — the brag reads as
// delight rather than as authority, "HA! HA!" is its own idiom on that voice,
// and the register is the one two episodes of the running gag were written for.
// Consequences, all of them deliberate:
//   - Every Sunny line here is kokoro, so all thirteen are free and re-time
//     instantly when a word changes. Nothing about him is a paid call any more.
//   - `emotion` is a MiniMax field and kokoro ignores it, so his lines carry
//     none. The seasoning that used to be `happy` is in the words and the
//     staging; his speed overrides survive because kokoro honours those.
//   - Pause markers are a MiniMax instruction and are ERRORS on a kokoro line
//     (the generator refuses the file). `a2_41_sunny` carried the episode's
//     only two; they are gone and the line is back at 0.95, which is the speed
//     it separated its three links at in the ep-1 register.
//
//   engine: "minimax", voiceId: "<id>", emotion: "<enum>"
//   emotions: auto happy sad angry fearful disgusted surprised calm fluent
//             neutral
//
// EMOTION IS SEASONING. A line only carries one when a stage direction in
// `script.md` asks for it, and the comment on the line names the direction.
// Everything else stays "auto", which is the model reading the words as
// written — the same instinct as not adding a `speed` override to a line that
// does not need one. Sunny's used to be nearly all `happy`, because bragging is
// his entire character; he went back to kokoro on 2026-07-28 and now carries
// none — the engine has no such field, and the brag is in am_puck's own read.
// Puff's sixty-two lines are thirty-five `auto` and twenty-seven seasoned, and
// the seasoning is the arc: six `sad` in Act One (every one of them a stage
// direction that says deflation or "sad, not tragic"), `surprised` on the six
// lines where a fact lands on him, `happy` from his first win onward, and one
// each of `calm` (sitting on the cool sea) and `angry` (the shout — see
// a3_49). His apologies are deliberately NOT all sad; see a1_43 and a2_46.
//
// PAUSE MARKERS (`<#0.3#>`) are seconds of silence *inside* a MiniMax line,
// and they are only allowed where `script.md` already marks an intra-line
// timing need. **There are none left in this episode.** The one line that had
// them (`a2_41_sunny`, two markers between the three links of the causal chain)
// went back to kokoro with the rest of Sunny, where a marker is an error rather
// than an instruction — the generator refuses the file, because the model would
// read the punctuation out loud. The separation that bought is bought instead
// by 0.95, which is what the line ran at before it was ever on MiniMax. Every
// other silence in the show is a held beat *between* lines and belongs to
// `gaps` in `Video.tsx`, not here.
//
// PUFF IS CAST: MiniMax `Exuberant_Girl`, approved 2026-07-26, the last actor
// off a placeholder. Auditioned on both engines and on the three lines that ask
// three different things of him — `a1_04_puff` (small and apologetic),
// `a2_19_puff` (WHOOSH, delighted) and `a3_49_puff` (the big shout): kokoro
// `af_sky` / `af_nicole` / `bf_lily` / `am_liam`, MiniMax `Sweet_Girl_2` /
// `Inspirational_girl` / `Decent_Boy` / `Lovely_Girl` / `Young_Knight` /
// `Exuberant_Girl` (public/narration/auditions-mm-puff), then a four-line
// screen test of the winner across his arc.
//   Kokoro:   npm run narration -- --audition wind:a1_04_puff <dir>
//   MiniMax:  npm run narration -- --audition wind:a1_04_puff <dir> \
//               --engine minimax --voices Exuberant_Girl [--emotion sad]
// His speed is the engine's own 1.0. The old kokoro 1.05 was compensation —
// `af_sky` needed pushing to sound like small quick breaths, and Exuberant_Girl
// brings that with her (the screen-test clips land within two tenths of a
// second of the kokoro ones they replace — this engine is normally ~40% slower
// than kokoro at the same nominal speed, and she is not).
//
// STRETCHED SPELLINGS DO NOT SURVIVE THE MOVE. "Poooof" and "PUUUSH" were
// kokoro spellings: kokoro reads a run of repeated letters as a long vowel,
// MiniMax reads it as separated syllables ("puh-uh-uh-sh"). On this engine the
// stretch has to come from the emotion, not the spelling — so his two sound
// words are plain ("Poof!", "PUSH!") and the shout carries `angry`, which is
// the approved read. WHOOSH came through the screen test intact and stays;
// FWOOSH is the same shape (no repeated letter) and rides on that. Anything
// new goes through --audition before it goes in.
// All sixty-two of his lines follow.
//
// Keys are `<act>_<number>_<speaker>` in strict playback order:
// `co` cold open, `a1` the grass, `a2` the lift, `a3` air with a job,
// `rc` recap. The screenplay in `script.md` lists which keys each of the
// thirty-six scenes consumes; the two files must be edited together.
//
// TEXT-TO-SPEECH RULES OBSERVED HERE
//   - No digits: "a hundred million", not a numeral.
//   - No percent signs, ampersands or other symbols. No question-exclamation
//     stacks ("?!") — the shout is carried by CAPS instead.
//   - No colons; they read as hard pauses. Commas and full stops carry the
//     rhythm. No ellipses either: a hesitation is written as a real word
//     ("Um.", "Wait.") or split onto its own line with a gap after it.
//   - Sound words are spelled as words: WHOOSH (proven in episode one),
//     FWOOSH, Poof, Flop. Spellings are per engine: a stretched vowel
//     ("Poooof", "PUUUSH", "Ohhh") is a kokoro instruction and a MiniMax
//     mispronounce, so a kokoro line may stretch and a minimax line may not.
//     The stretch on a minimax line is an `emotion`, not a spelling. The rock
//     lost its "Ohhh" when it was cast — see a2_08 — and the only stretched
//     spellings left in the file are on the Narrator's own kokoro lines.
//   - CAPS mark shouted words and survive the model fine.
//   - The spelled-out Big Words are single letters with full stops
//     ("A. I. R.", "W. I. N. D.") so the model reads letter names and a kid can
//     chant along with the card. THESE TWO ARE THE FIRST THINGS TO EAR-CHECK.
//     They changed engine with the rest of Puff and nobody has heard them on
//     MiniMax. If the model says "one" for "I." or "uh" for "A.", swap in the
//     phonetic fallbacks, which are pre-written and known safe:
//       a1_38_puff  ->  "Ay. Eye. Arr. That spells AIR!"
//       a2_32_puff  ->  "Double you. Eye. Enn. Dee. WIND!"
//   - Also ear-check before building anything on them: `a1_25_puff` ("Poof!",
//     plain now — it is the beat the dandelion detonates off), `a3_49_puff`
//     ("PUSH!" at `angry`), `a2_28_narrator` ("FWOOSH." alone in a line) and
//     `a3_19_sunny` (exclamation run).
//
// COMEDY PACING — per-line speed overrides
// Episode one's retro (docs/LEARNINGS.md, docs/STYLE.md "Comedy pacing") found
// the best-loved jokes were deadpan repetition gags that went past too fast.
// Every list, roll call and repeated straight-line in this file therefore
// carries its own slower `speed`, marked with a comment saying why. The other
// half of that rule — a held beat of silence on the punchline — lives in
// `script.md`'s stage directions and becomes `gaps` in `Video.tsx`; the two
// halves only work together.
const NARRATOR = { voice: "af_heart", speed: 1.0 };

// Puff's casting, decided. "kokoro" | "minimax" — this one switch moves every
// Puff line at once, and it is kept (rather than inlined) because his emotions
// are inert on kokoro: a kokoro line ignores `emotion` entirely, so flipping
// back for a free re-time costs the acting and nothing else. The stretched
// sound-word spellings do NOT come back with it — see the note above.
const PUFF_ENGINE = "minimax";
// Only read when PUFF_ENGINE is "minimax". Won the audition on all three of his
// hard lines; the runners-up were Lovely_Girl and Decent_Boy.
const PUFF_MINIMAX_VOICE = "Exuberant_Girl";
const PUFF =
  PUFF_ENGINE === "minimax"
    ? { engine: "minimax", voiceId: PUFF_MINIMAX_VOICE, speed: 1.0 }
    : { voice: "af_sky", speed: 1.05 }; // the old placeholder, for re-timing

// SUNNY, back where he started. `am_puck` at 1.0 is episode one's Sunny, note
// for note — the MiniMax recast (`Imposing_Manner`) was reverted 2026-07-28
// because the imposing read made him an authority, and the joke is that he is a
// delighted show-off who happens to be right. Kokoro, so: no `emotion` on any
// of his lines (the field does not exist here), no pause markers (they are an
// error), and all thirteen clips are free and re-time instantly.
const SUNNY = { voice: "am_puck", speed: 1.0 };
const CLOUDIA = { engine: "minimax", voiceId: "Abbess", speed: 1.0 };
// Was af_bella @1.1 on kokoro, where the 1.1 bought the bounce. Lively_Girl
// comes with it, so her one line sits at the engine's own speed.
const DRIP = { engine: "minimax", voiceId: "Lively_Girl", speed: 1.0 };

// THE CAMEOS — and why their keys still say `_narrator`.
//
// The beetle, the leaf and the rock have bodies on screen and now have voices
// of their own, but their line keys are unchanged (`a1_07_narrator`,
// `a2_08_narrator`, …). That is deliberate and it is not laziness:
//
//   - The keys are wired into `Video.tsx`'s SCRIPT, `turnsOf`, every scene's
//     `SPEAKER_VISUAL` map, every bubble map and every `lineWindow` call in
//     `scenes/act1.tsx` and `scenes/act2.tsx`. Renaming them is a rename of
//     the episode, for no gain.
//   - Nothing downstream reads the key to decide who is *on stage* anyway.
//     `speakerOf()` derives a voice from the suffix, and every scene with a
//     cameo already overrides that per line with `useStage(scene, VISUAL)` —
//     API 2b in `scenes/common.tsx` exists precisely because these three
//     bodies had to mouth "narrator" turns. Mouths, bubbles, faces and eyes
//     all read the *staged* speaker, not the voiced one.
//
// So the suffix now means "not one of the four principals" rather than "the
// Narrator says this". The Narrator himself is every other `_narrator` key,
// and he still never has a body.
//
// None of the three was auditioned — they were cast on description, from the
// same MiniMax system voice list as the principals. EAR-CHECK ALL THREE.
//
// Deadpan, unhurried, and identical every time it fires: the beetle's two
// lines are the episode's central repetition gag and Scene 32's payoff, so
// all three firings share voice, emotion and speed exactly. 0.92 is the speed
// they were read at as Narrator lines and it is kept — the joke is the
// sameness, and the pacing rule wants a repeated straight-line slow.
const BEETLE = {
  engine: "minimax",
  voiceId: "Patient_Man",
  emotion: "calm",
  speed: 0.92,
};
// The leaf fires the same two lines one scene later. A different voice from
// the beetle, and as far from Puff's as the list allows: the gag is that they
// are two different people who both cannot see him.
const LEAF = {
  engine: "minimax",
  voiceId: "Calm_Woman",
  emotion: "calm",
  speed: 0.92,
};
// One line, very slow, completely sincere. `happy` because the rock is having
// the best day of its life (script.md, Scene 13) and the words alone read as a
// shrug; 0.85 stays exactly as it was, because the rock is in no hurry.
const ROCK = {
  engine: "minimax",
  voiceId: "Deep_Voice_Man",
  emotion: "happy",
  speed: 0.85,
};

export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    // ---------------------------------------------------------------
    // COLD OPEN — the hill, the kite, the promise
    // ---------------------------------------------------------------
    co_01_narrator: {
      text: "This is a story about a hero you cannot see. Not once. Not ever. Not even a little bit.",
      ...NARRATOR,
    },
    co_02_narrator: {
      text: "Here is a hill. Here is a kid. And here is a brand new kite.",
      ...NARRATOR,
    },
    co_03_narrator: {
      text: "The kid is ready. The kite is ready. Everything is ready.",
      ...NARRATOR,
    },
    co_04_narrator: { text: "Watch.", ...NARRATOR },
    // Deadpan after a silent visual gag. Slowed so the "Hmm" and the two words
    // after it do not arrive on top of the flop.
    co_05_narrator: { text: "Hmm.", ...NARRATOR, speed: 0.9 },
    co_06_narrator: {
      text: "The kite went up. And then the kite went down. Flop.",
      ...NARRATOR,
      speed: 0.95,
    },
    co_07_narrator: {
      text: "Something is missing today. Something this story cannot show you.",
      ...NARRATOR,
    },
    co_08_narrator: {
      text: "Because the missing thing is invisible. Let's go and find it.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // ACT ONE — THE GRASS. Big Word: AIR
    // ---------------------------------------------------------------
    a1_01_narrator: {
      text: "Down at the bottom of that hill, in the grass, somebody was having a bad morning.",
      ...NARRATOR,
    },
    a1_02_puff: {
      text: "Hello? Hello, everybody! It's me! I'm here!",
      ...PUFF,
    },
    a1_03_narrator: {
      text: "This is Puff. Puff is a small puff of air.",
      ...NARRATOR,
    },
    // Scene 3: "somebody was having a bad morning", and the cast note's own
    // description of this line — "small and apologetic". His opening state.
    a1_04_puff: {
      text: "Sorry. Sorry. I know you can't see me.",
      ...PUFF,
      emotion: "sad",
    },
    a1_05_narrator: {
      text: "Puff floated over to a beetle.",
      ...NARRATOR,
    },
    a1_06_puff: { text: "Good morning, beetle! I am Puff!", ...PUFF },
    // BEETLE. First half of the episode's central repetition gag. Every firing
    // is word for word and read for read the same — a1_07 / a1_13 / a3_51 all
    // carry the identical text through the identical `BEETLE`/`LEAF` spread.
    a1_07_narrator: {
      text: "Hello? Is somebody there?",
      ...BEETLE,
    },
    a1_08_puff: { text: "YES! Me! I am right here!", ...PUFF },
    a1_09_narrator: {
      text: "Huh. Must have been nothing.",
      ...BEETLE,
    },
    // Scene 4, after the beetle looks through him: "the deflation is the
    // picture". The read matches the picture.
    a1_10_puff: { text: "Sorry.", ...PUFF, speed: 0.95, emotion: "sad" },
    a1_11_narrator: {
      text: "Puff floated over to a leaf.",
      ...NARRATOR,
    },
    a1_12_puff: { text: "Good morning, leaf! I am Puff!", ...PUFF },
    // LEAF. Second firing, a different creature, the same two sentences at the
    // same speed. Only the voice changes, which is the point of casting them.
    a1_13_narrator: {
      text: "Hello? Is somebody there?",
      ...LEAF,
    },
    a1_14_puff: {
      text: "It is ME. Puff. We do this every single day.",
      ...PUFF,
    },
    a1_15_narrator: {
      text: "Huh. Must have been nothing.",
      ...LEAF,
    },
    // Scene 5, second firing: same deflation, one beat longer ("Puff's wave is
    // smaller this time").
    a1_16_puff: { text: "Sorry. Sorry.", ...PUFF, speed: 0.95, emotion: "sad" },
    // Roll call of the people who cannot see him. Slowed so the three items
    // separate.
    // Scene 6: Puff "sinks down between two grass blades and goes very quiet
    // and very faint" — twenty-five percent opacity, the lowest he ever gets.
    a1_17_puff: {
      text: "Nobody ever SEES me. Not the beetles. Not the leaves. Nobody.",
      ...PUFF,
      speed: 0.95,
      emotion: "sad",
    },
    // Scene 6's held beat: "Sad, not tragic — this show does not do despair."
    // `sad` is the note; the 24f beat after it is the rest of the note.
    a1_18_puff: { text: "I think I might be nothing at all.", ...PUFF, emotion: "sad" },
    a1_19_narrator: { text: "Puff. May I say something?", ...NARRATOR },
    // Still Scene 6, still at his lowest — the reflex apology fires even as
    // somebody answers him for the first time all episode. Last `sad` of the
    // run; from the dandelion on, the apologies are a habit, not a mood.
    a1_20_puff: { text: "Sorry. Yes. Sorry.", ...PUFF, speed: 0.95, emotion: "sad" },
    a1_21_narrator: {
      text: "You are not nothing. You are AIR. And air is real stuff.",
      ...NARRATOR,
    },
    // The episode's misconception being argued with, on the character who holds
    // it. Script's Big Words note: Puff "is not proud of himself the way Drip
    // was — he is astonished".
    a1_22_puff: { text: "Stuff? Me? I am STUFF?", ...PUFF, emotion: "surprised" },
    a1_23_narrator: {
      text: "Watch. Here is a dandelion, all full of fluffy seeds.",
      ...NARRATOR,
    },
    a1_24_narrator: {
      text: "Now. Take a big breath, and puff it out.",
      ...NARRATOR,
    },
    // RESPELLED FOR MINIMAX: was "Poooof!", which this engine reads as three
    // syllables. The wind-up it used to carry is staged instead — Scene 7 swells
    // him through the whole line and detonates the seed head on the first frame
    // of the 45f beat after it, so the word only has to be the release.
    a1_25_puff: { text: "Okay. Here I go. Ready? Poof!", ...PUFF },
    a1_26_narrator: {
      text: "Every single seed. Gone. Flying.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Scene 7, proof one: "an invisible thing move a visible one", and the first
    // fact that lands on him. Three questions in a row, all of them real.
    a1_27_puff: {
      text: "I did that? With my puff? I moved a whole flower?",
      ...PUFF,
      emotion: "surprised",
    },
    a1_28_narrator: {
      text: "Here is one you can try right now, wherever you are.",
      ...NARRATOR,
    },
    a1_29_narrator: {
      text: "Wave your hand in front of your face. Go on. Wave it.",
      ...NARRATOR,
    },
    a1_30_narrator: {
      text: "Feel that? That little cool push on your cheek? That is air. That is Puff.",
      ...NARRATOR,
    },
    // Scene 8's pedagogy note: "It also gives Puff his first win." First `happy`
    // of the episode, and the arc turns here.
    a1_31_puff: {
      text: "They can feel me. THEY CAN FEEL ME!",
      ...PUFF,
      emotion: "happy",
    },
    a1_32_narrator: {
      text: "One more. Somebody blew up a balloon.",
      ...NARRATOR,
    },
    // "auto" on purpose: the Oofs are him being squashed, which is physical
    // comedy the words already do. The delight in Scene 9 ("thrilled about it")
    // is spent on a1_35, where he works out what it means.
    a1_33_puff: { text: "Oof. Oof! I am inside a balloon!", ...PUFF },
    a1_34_narrator: {
      text: "The balloon got fat and round. Something filled it up.",
      ...NARRATOR,
    },
    // Scene 9: inside the balloon he "is thrilled about it".
    a1_35_puff: {
      text: "It is me. I FILLED it. I have a SHAPE!",
      ...PUFF,
      emotion: "happy",
    },
    a1_36_narrator: {
      text: "Nothing cannot fill a balloon. Only stuff can fill a balloon.",
      ...NARRATOR,
    },
    a1_37_narrator: {
      text: "So here is our first big word. Air.",
      ...NARRATOR,
    },
    // SPELL MOMENT — EAR-CHECK FIRST, and unheard on this engine. Deliberately
    // "auto": an emotion is the likeliest thing to make a model slur four
    // letters together, and the card is already doing the celebrating.
    // Fallback if the letters read wrong: "Ay. Eye. Arr. That spells AIR!"
    a1_38_puff: { text: "A. I. R. That spells AIR!", ...PUFF, speed: 0.9 },
    a1_39_narrator: {
      text: "You cannot see air. You CAN feel air. Air is real STUFF.",
      ...NARRATOR,
    },
    // Scene 10: the catchphrase's first firing, and "deliberately the positive
    // version of his opening complaint — same fact, opposite feeling". The
    // feeling is the only thing distinguishing it from a1_04, so it is set.
    a1_40_puff: {
      text: "You can't see me. But you can FEEL me.",
      ...PUFF,
      emotion: "happy",
    },
    a1_41_narrator: {
      text: "Puff felt taller. Which is tricky, when you are made of air.",
      ...NARRATOR,
    },
    // Scene 11, the act's button. Both of these stay "auto" and it is a
    // decision, not an omission: a1_42 contains both halves of its own joke
    // (the reflex and the catching-himself) and no single emotion can play
    // both, and a1_43 is a deadpan — the gag is that the habit wins, and `sad`
    // would make the audience feel sorry for him at the exact moment the show
    // wants them to laugh. The 30f beat between them does the work.
    a1_42_puff: { text: "Sorry! I mean. Not sorry.", ...PUFF },
    a1_43_puff: { text: "Sorry.", ...PUFF, speed: 0.9 },

    // ---------------------------------------------------------------
    // ACT TWO — THE BIG LIFT.
    // Big Words: WARM AIR RISES, WIND
    // ---------------------------------------------------------------
    a2_01_narrator: {
      text: "And then the whole hill went gold.",
      ...NARRATOR,
    },
    // Scene 12: "Sunny fills the sky, mid-pose, lens flares he has clearly
    // added himself." An entrance he is delighted with.
    a2_02_sunny: { text: "GOOD MORNING, EVERYBODY!", ...SUNNY },
    a2_03_puff: { text: "Oh no. Oh, he is enormous.", ...PUFF },
    a2_04_narrator: {
      text: "This is Sunny. You may remember him. He remembers himself constantly.",
      ...NARRATOR,
    },
    // Scene 12, and the first firing of the "You're welcome! / HA! HA!" gag —
    // "He remembers himself constantly."
    a2_05_sunny: {
      text: "I invented mornings! You're welcome! HA! HA!",
      ...SUNNY,
    },
    a2_06_narrator: {
      text: "Sunny did what Sunny does. He poured sunshine all over the ground.",
      ...NARRATOR,
    },
    // Three-item list. Slowed so "and a rock" lands as its own beat.
    a2_07_narrator: {
      text: "The grass got warm. The path got warm. And a rock got extremely comfortable.",
      ...NARRATOR,
      speed: 0.95,
    },
    // ROCK. One line, very slow, completely sincere — and RESPELLED FOR THE
    // MOVE, exactly like Puff's two sound words were. "Ohhh" is a kokoro
    // instruction (one long sound); MiniMax reads a run of repeated letters as
    // separated syllables, and "oh-huh-huh yeah" is the deadpan floor of the
    // episode arriving broken. The length now comes from 0.85 and `happy`,
    // which is where a stretch lives on this engine.
    //
    // EAR-CHECK. "Ohh" is a two-letter run and this engine has never said it
    // here. If it still separates, the fully safe fallback is pre-written and
    // costs one word: "Oh yeah. That is the stuff." The rock has no speech
    // bubble, so there is no drawn spelling to keep in step.
    a2_08_narrator: {
      text: "Ohh yeah. That is the stuff.",
      ...ROCK,
    },
    a2_09_puff: { text: "Is the rock okay?", ...PUFF },
    a2_10_narrator: {
      text: "The rock is having the best day of its life.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_11_narrator: {
      text: "Now here is the important bit. The sun does not warm the air very much.",
      ...NARRATOR,
    },
    // C1. Scene 14: the fact is about him, so he gets to be wrong about it for
    // one line and then right about it forever. No seasoning — this is the same
    // call as a2_39_sunny; nothing marks it as anger and nobody in this show is
    // unkind. He speaks from the diagram: the crayon sun turns and objects.
    a2_11b_sunny: { text: "EXCUSE ME. I warm EVERYTHING.", ...SUNNY },
    a2_12_narrator: {
      text: "The sun warms the GROUND. And then the warm ground warms the air.",
      ...NARRATOR,
    },
    // C1, the brag — the causal chain in six words, and a plant for a2_41.
    // Ends on "HA! HA!", which is am_puck's own idiom from episode one.
    a2_12b_sunny: {
      text: "So I DO warm everything! Through the GROUND! HA! HA!",
      ...SUNNY,
    },
    // "auto" although the next narrator line says "Puff was enjoying himself":
    // that is a joke about his feet, not a direction for the read, and the line
    // is a contented mumble. `happy` here spends the lift-off's delight early.
    a2_13_puff: {
      text: "Ooh. Ooh, that is toasty. I can feel it on my feet.",
      ...PUFF,
    },
    a2_14_narrator: {
      text: "Puff does not have feet. Puff was enjoying himself.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_15_narrator: {
      text: "And warm air does something wonderful. Warm air gets light.",
      ...NARRATOR,
    },
    // Scene 15: he "starts to wobble, then bob, then lift off". The moment it
    // dawns on him, and the production note insists the lift is "played as
    // delight from the first frame" — so surprise here, delight from a2_19.
    a2_16_puff: {
      text: "Wait. Wait wait wait. I am going UP!",
      ...PUFF,
      emotion: "surprised",
    },
    a2_17_puff: { text: "This happened to my friend Drip!", ...PUFF },
    a2_18_narrator: {
      text: "Different show. Same sun.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Scene 15, and the audition line described as "delighted, airborne";
    // production note: "Puff's lift-off is played as delight from the first
    // frame". WHOOSH survives this engine — verified on the screen test.
    a2_19_puff: {
      text: "WHOOSH! I am flying! I am actually flying!",
      ...PUFF,
      emotion: "happy",
    },
    // THE ROLL CALL. Episode one's best-loved joke with a six-year-old was
    // Drip greeting a queue of identical raindrops by name ("Hi Drop, Hi
    // Droppy"), and the same six-year-old asked for more of it. This is the
    // episode-two variant, and it fits where it sits: Scene 15 already has
    // dozens of identical warm puffs rising alongside him, so the gag costs
    // three lines and no new staging idea.
    //
    // Slowed to 0.92 by the Comedy pacing rule (docs/STYLE.md): a roll call is
    // a list, and the four greetings have to separate or they are one noise.
    // `happy` is the same seasoning a2_19 carries — he is mid-delight and this
    // is him being delighted at somebody else.
    a2_19b_puff: {
      text: "Oh! Hello! Hi Puffy. Hi Puffington. Hi other Puff. Hi Puff the third.",
      ...PUFF,
      speed: 0.92,
      emotion: "happy",
    },
    // The straight line, and the other half of the pacing rule: flat, slow, and
    // with the 24f held beat after it doing the work. Narrator, so it stays on
    // kokoro and re-times for free.
    a2_19c_narrator: {
      text: "Every single one of them was also called Puff.",
      ...NARRATOR,
      speed: 0.92,
    },
    // The button, and deliberately NOT seasoned. The joke is that Puff reports
    // this as a mild fact about naming trends; `happy` would play it as a
    // punchline being sold, which is exactly what a deadpan is not. The laugh
    // is in the 24f of silence in front of it, not in the read — same call as
    // a1_43 ("Sorry.") and for the same reason. Speed stays at his own 1.0:
    // the roll call needed slowing because it was a list, and this is one short
    // sentence that wants to land and stop.
    a2_19d_puff: { text: "It is a very popular name.", ...PUFF },
    a2_20_narrator: {
      text: "Warm air rises. Say it with me. Warm air rises.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Scene 16: the rule chanted back while "Puff rides the arrow", still
    // airborne and still delighted.
    a2_21_puff: {
      text: "Warm air RISES! And I am the warm air!",
      ...PUFF,
      emotion: "happy",
    },
    // C2. Scene 16: Cloudia's one Act Two appearance. The hotel is full
    // *because* warm air rises, which is a2_22_narrator's point made as a
    // picture — and it is the missing first step of episode one's Cloud Hotel.
    // "auto" rather than the `angry` imperious read approved for a3_38: she is
    // grand at a passing stranger, not making a demand.
    a2_21b_cloudia: { text: "No vacancies, darling! We are FULL!", ...CLOUDIA },
    // Mid-lift, still delighted — the same seasoning a2_19 and a2_21 carry.
    a2_21c_puff: {
      text: "Cloudia! I am not staying! I am going PAST!",
      ...PUFF,
      emotion: "happy",
    },
    // The button, and deliberately NOT seasoned — same call as a2_19d_puff and
    // a1_43_puff. The laugh is in the 24f of silence in front of it. Slowed
    // slightly so the deadpan has weight.
    a2_21d_cloudia: {
      text: "They all say that, darling.",
      ...CLOUDIA,
      speed: 0.95,
    },
    a2_22_narrator: {
      text: "Every warm puff on that whole hill was going up with him.",
      ...NARRATOR,
    },
    a2_23_narrator: {
      text: "But look down at the grass. Look where Puff used to be.",
      ...NARRATOR,
    },
    a2_24_narrator: {
      text: "Puff left a gap. An empty space, exactly Puff shaped.",
      ...NARRATOR,
    },
    // C3 — TEXT CHANGED (was "Oops. Sorry about the hole."). Still "auto",
    // still the second-to-last apology of the episode, still sheepish rather
    // than sad — the `sad` run ended in Act One and putting one here
    // re-deflates him two scenes after he stopped being deflated. He is now
    // addressing the hole, which is the joke and also the scene's whole idea:
    // an empty space is a thing.
    a2_25_puff: { text: "Sorry, hole! I did not mean to leave!", ...PUFF },
    // C3's button. Deliberate rhyme with episode one's moose ("The moose did
    // not move. Moose rarely do.") — the narrator deadpanning about obvious
    // behaviour is the only ironic register this show allows, and this is the
    // same joke in the same words five months later. Slowed for the deadpan.
    a2_25b_narrator: {
      text: "The hole did not answer. Holes rarely do.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_26_narrator: {
      text: "And air does not like a gap. Not one bit.",
      ...NARRATOR,
    },
    a2_27_narrator: {
      text: "So all the cool air nearby came rushing in sideways to fill it.",
      ...NARRATOR,
    },
    // Sound word alone in its own clip, with a held beat after it. Audition.
    a2_28_narrator: { text: "FWOOSH.", ...NARRATOR },
    // Scene 18: the cool air "slams into the gap" from both sides — "the first
    // time the audience sees wind and it should arrive as a physical event".
    // It arrives on him, unannounced.
    a2_29_puff: {
      text: "Whoa! Who are all these guys?",
      ...PUFF,
      emotion: "surprised",
    },
    a2_30_narrator: {
      text: "Cool air. In a very big hurry.",
      ...NARRATOR,
      speed: 0.95,
    },
    // C4. The button on the FWOOSH's one physical gag — one cool puff arrives
    // backwards, overshoots, reverses in and stays upside down for the rest of
    // the scene. Flat, slow, and about obviously silly behaviour, which is the
    // permitted deadpan register. Kokoro, so it re-times for free.
    a2_30b_narrator: {
      text: "One of them came in backwards.",
      ...NARRATOR,
      speed: 0.9,
    },
    a2_31_narrator: {
      text: "And that rushing, hurrying, sideways air has a name. Wind.",
      ...NARRATOR,
    },
    // SPELL MOMENT — EAR-CHECK FIRST, and unheard on this engine. "auto" for
    // the same reason as a1_38: four letter names need clarity more than they
    // need a mood. Fallback: "Double you. Eye. Enn. Dee. WIND!"
    a2_32_puff: { text: "W. I. N. D. WIND!", ...PUFF, speed: 0.9 },
    a2_33_narrator: {
      text: "Wind is air in a hurry. Say it with us.",
      ...NARRATOR,
    },
    a2_34_puff: { text: "Wind is air in a HURRY!", ...PUFF },
    a2_35_puff: { text: "Hold on. Am I the wind?", ...PUFF },
    a2_36_narrator: {
      text: "You are air. Wind is what air DOES.",
      ...NARRATOR,
    },
    a2_37_puff: {
      text: "So when I move, everybody gets wind. Because of me.",
      ...PUFF,
    },
    a2_38_narrator: {
      text: "Because of you. And about a hundred million friends.",
      ...NARRATOR,
    },
    // C5. Second firing of the roll call, five minutes after Scene 15's — the
    // shape episode one proved (beetle/leaf/Scene 32) applied to the gag the
    // audience actually asked for more of. A genuine question, so unseasoned;
    // slowed a touch so it reads as a thought rather than a punchline being
    // set up.
    a2_38b_puff: { text: "Are they all called Puff?", ...PUFF, speed: 0.95 },
    // One word, flat, after a full second of silence. Kokoro. Do not add a
    // second sentence to this line; the whole joke is that there is not one.
    a2_38c_narrator: { text: "Yes.", ...NARRATOR, speed: 0.9 },
    // Deliberately unseasoned: nothing in Scene 21 marks this as anger, and the
    // tone guardrail is that nobody in this show is unkind. It is an
    // interruption, and the words carry it.
    a2_39_sunny: { text: "EXCUSE ME. Who warmed the ground?", ...SUNNY },
    a2_40_puff: { text: "Um. You did.", ...PUFF },
    // Sunny's causal chain — this is the pedagogy and the punchline at once.
    // Slowed so a six-year-old can follow all three links: script.md asks for
    // separation *inside* this line ("runs at 0.95 so all three links land
    // separately", Scene 21). It briefly carried the episode's only two pause
    // markers, which were a MiniMax instruction; back on kokoro they are an
    // error, and 0.95 plus am_puck's own cadence is what separated the links in
    // episode one. The diagram assembles out of his beams as he lists. The brag.
    a2_41_sunny: {
      text: "I warm the ground! The ground warms the air! The air goes UP!",
      ...SUNNY,
      speed: 0.95,
    },
    // C6. Puff's only attitude line in Act Two, and an anticipation gag — the
    // audience has heard three brags and is ahead of him. Deliberately NOT
    // seasoned: he is reporting an inevitability, not performing dread.
    a2_41b_puff: { text: "Oh no. He is going to say it.", ...PUFF },
    // Scene 21: "On the last brag the diagram goes planetary and every wind
    // arrow on Earth lights up at once."
    a2_42_sunny: {
      text: "SO I MAKE ALL THE WIND. EVERYWHERE. ON THE ENTIRE PLANET.",
      ...SUNNY,
    },
    a2_43_sunny: { text: "You're welcome! HA! HA!", ...SUNNY },
    // The sequel to episode one's "annoyingly, he is completely right".
    // Flattest possible delivery.
    a2_44_narrator: {
      text: "I checked. Then I checked again. He is right. Again.",
      ...NARRATOR,
      speed: 0.9,
    },
    a2_45_narrator: {
      text: "One day Sunny will be wrong about something. It is not today.",
      ...NARRATOR,
      speed: 0.95,
    },
    // No dash here on purpose. The interruption is staged, not punctuated —
    // Puff stops because the *scene* stops him, and the gap after this line
    // does the work an em dash would have done to the model.
    // Scene 22, the arc's turning point, and the two lines it turns on stay
    // "auto" on purpose. The direction is that he "starts the apology
    // automatically, as reflex, and then physically stops himself" — a2_46 is a
    // habit firing, not grief, and a2_47 is resolve, which is not on the
    // emotion list at all (`happy` would play it as a gag, `sad` as a relapse).
    // The turn is in the 30f beat between them and in the shape of him firming
    // up mid-line; the payoff — and the only emotion in the scene — is a2_48.
    a2_46_puff: { text: "Sorry, everybody! I did not mean to.", ...PUFF },
    a2_47_puff: { text: "No. Wait. Not sorry.", ...PUFF, speed: 0.95 },
    // Scene 22: "a two-item recap of Act One disguised as a boast."
    a2_48_puff: {
      text: "I move flowers. I fill balloons. I am STUFF.",
      ...PUFF,
      speed: 0.95,
      emotion: "happy",
    },

    // ---------------------------------------------------------------
    // ACT THREE — AIR WITH A JOB. Big Word: SEA BREEZE
    // ---------------------------------------------------------------
    a3_01_narrator: {
      text: "Puff wanted to know what else a wind could do. So we went to the beach.",
      ...NARRATOR,
    },
    // Scene 23: he "arrives from frame left at speed and skids to a stop" —
    // the first time he has travelled anywhere under his own power.
    a3_02_puff: {
      text: "The beach! I have never been ANYWHERE!",
      ...PUFF,
      emotion: "happy",
    },
    a3_03_narrator: {
      text: "And the beach has a secret. The beach makes its own wind. Every sunny day.",
      ...NARRATOR,
    },
    // Scene 23 "frames the sea breeze as a mystery" — the question is real.
    a3_04_puff: {
      text: "The beach MAKES wind? By itself?",
      ...PUFF,
      emotion: "surprised",
    },
    a3_05_narrator: {
      text: "Puff. Go and sit on the sand, and tell me how it feels.",
      ...NARRATOR,
    },
    // "auto": Scene 24 has him "tomato red, hopping", which is physical comedy
    // with no emotion on the list that fits it — `angry` and `fearful` would
    // both be wrong about a show where nothing hurts.
    a3_06_puff: { text: "Ow. Ow ow ow. That sand is HOT.", ...PUFF },
    a3_07_narrator: { text: "Now go and sit on the sea.", ...NARRATOR },
    // Scene 24, the matching half: he "goes cool blue, sighing". The one `calm`
    // in the episode, and it is there to make the sand line hotter.
    a3_08_puff: {
      text: "Ooh. The sea is lovely and cool.",
      ...PUFF,
      emotion: "calm",
    },
    // The comparison the whole sea-breeze idea rests on. Slowed.
    a3_09_narrator: {
      text: "Same sun. Same morning. Sand hot. Sea cool.",
      ...NARRATOR,
      speed: 0.9,
    },
    // C7. Two words, and they are the scene's control variable: the sun is
    // identical over both halves and the surfaces are not, which is the whole
    // of differential heating. Fifth firing of the interrupt gag. He leans in
    // over the seam of the split screen, one half of his face in each panel.
    a3_09b_sunny: { text: "Same me!", ...SUNNY },
    a3_10_narrator: {
      text: "Sand heats up fast. Water takes ages and ages and ages.",
      ...NARRATOR,
    },
    a3_11_narrator: {
      text: "So the air above the hot sand gets warm, and up it goes.",
      ...NARRATOR,
    },
    // Scene 25: "Puff recognises the shape of the diagram before the Narrator
    // finishes, and points." Getting there first is the whole beat.
    a3_12_puff: {
      text: "And that leaves a GAP! I know this bit!",
      ...PUFF,
      emotion: "happy",
    },
    a3_13_narrator: {
      text: "It does. And the cool air over the sea comes rushing in to fill it.",
      ...NARRATOR,
    },
    // FWOOSH is the Narrator's sound word from Scene 18 handed to Puff; single
    // letter runs, so it survives the engine change (same shape as WHOOSH).
    // "auto" — a3_12 already carried the recognition beat.
    a3_14_puff: { text: "FWOOSH! Off the sea! Onto the beach!", ...PUFF },
    a3_15_narrator: {
      text: "That is why the wind at the beach blows in off the water, nearly every sunny day.",
      ...NARRATOR,
    },
    a3_16_narrator: {
      text: "A gentle, friendly wind has a lovely name. A breeze.",
      ...NARRATOR,
    },
    a3_17_narrator: {
      text: "And a breeze that comes in off the sea is a sea breeze.",
      ...NARRATOR,
    },
    // Scene 26: the Big Word lands and it turns out to be his name for himself.
    a3_18_puff: {
      text: "Sea breeze! Sea BREEZE! That is me! I am a sea breeze!",
      ...PUFF,
      emotion: "happy",
    },
    // Scene 26: Sunny leans in over a card that is not about him, "enormously
    // pleased", and holds it through a one-second beat.
    a3_19_sunny: {
      text: "I make the beach windy AND I make the waves sparkle! You're welcome!",
      ...SUNNY,
    },
    a3_20_narrator: { text: "Him again.", ...NARRATOR, speed: 0.9 },
    a3_21_narrator: {
      text: "And then Puff found out what a wind can do for a living.",
      ...NARRATOR,
    },
    a3_22_puff: { text: "There is a boat. Should I push the boat?", ...PUFF },
    a3_23_narrator: { text: "Push the boat, Puff.", ...NARRATOR },
    // C8. The polite version, and a try-fail-succeed built in front of the
    // clip that already existed. Unseasoned, quiet, and short — this is the
    // same sentence a3_24 says at full volume, which is the joke. Do NOT
    // season it; a timid read sells the gag and a played one kills it.
    a3_23b_puff: { text: "Okay, boat. Push.", ...PUFF },
    // Two flat words from the Narrator. Kokoro.
    a3_23c_narrator: { text: "Bigger, Puff.", ...NARRATOR, speed: 0.95 },
    // "auto", and it is the smaller sibling of a3_49. The exertion read that
    // won the audition for the big shout (`angry`) reads as cross when it has
    // "Okay, boat." in front of it — the shove is Scene 27's staging, both arms
    // braced, and the sail snapping taut sells the force.
    a3_24_puff: { text: "Okay, boat. PUSH!", ...PUFF },
    a3_25_narrator: {
      text: "The sail went tight, and the boat went whizzing across the bay.",
      ...NARRATOR,
    },
    a3_26_puff: { text: "I am a BOAT ENGINE!", ...PUFF },
    a3_27_narrator: {
      text: "Next, three tall white towers, with long thin spinning arms.",
      ...NARRATOR,
    },
    a3_28_narrator: {
      text: "Spin them, Puff. When those arms spin, they make electricity.",
      ...NARRATOR,
    },
    a3_29_puff: { text: "Electricity? Like for LIGHTBULBS?", ...PUFF },
    // Three-item list, and the setup for the shout. Slowed.
    a3_30_narrator: {
      text: "Like for lightbulbs. And fridges. And somebody's night light.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Scene 28 stages this precisely: 36f of silence on a night light in a dark
    // bedroom, "while the audience gets there on their own. Then the shout."
    a3_31_puff: { text: "I MAKE LIGHTBULBS!", ...PUFF, emotion: "happy" },
    a3_32_narrator: {
      text: "Then Puff carried seeds. Thousands of them, across the fields.",
      ...NARRATOR,
    },
    a3_33_puff: {
      text: "Hey! I know these ones! These are the dandelion ones!",
      ...PUFF,
    },
    a3_34_narrator: {
      text: "Seeds cannot walk. So the wind takes them somewhere new to grow.",
      ...NARRATOR,
    },
    // "auto", and the most deliberate one in Act Three. Scene 29 is "the
    // emotional beat the ending is banked against" and it pays off in a 60f
    // silence over a hillside of dandelions — quiet, working it out. `happy`
    // would bounce it and spend the silence before it starts.
    a3_35_puff: {
      text: "So there are flowers. In places. Because of me.",
      ...PUFF,
      speed: 0.95,
    },
    a3_36_narrator: { text: "Yes, Puff. There are.", ...NARRATOR, speed: 0.9 },
    a3_37_narrator: {
      text: "And then, high above them, somebody needed a lift.",
      ...NARRATOR,
    },
    // Scene 30: Cloudia "sits stranded over a flat plain" and is FULL of rain.
    // Impatient grande dame, not hostile — this is the read approved in the
    // audition (auditions-mm/cloudia_abbess_angry). If it plays as cross
    // rather than imperious, drop it to "auto"; the words already demand.
    a3_38_cloudia: {
      text: "Puff, darling! Take me to the mountains! I am FULL of rain!",
      ...CLOUDIA,
      emotion: "angry",
    },
    a3_39_narrator: {
      text: "So Puff pushed a whole cloud, all the way across the sky.",
      ...NARRATOR,
    },
    // Cast note, script.md: she "gets delivered across the sky like a parcel
    // and could not be happier about it". Delivered, and delighted.
    a3_40_cloudia: {
      text: "Finally! Door to door service, darling!",
      ...CLOUDIA,
      emotion: "happy",
    },
    // Scene 30: Drip "pops out of a window halfway across and waves with both
    // arms". One line of pure fan service.
    a3_41_drip: { text: "Hi! It's me! I'm the weather!", ...DRIP, emotion: "happy" },
    a3_42_narrator: {
      text: "That is Drip. Different show. Same sky.",
      ...NARRATOR,
      speed: 0.92,
    },
    a3_43_narrator: {
      text: "Then Puff came over a hill he had never seen before.",
      ...NARRATOR,
    },
    a3_44_narrator: {
      text: "There was a kid. And a brand new kite. Lying flat on the grass.",
      ...NARRATOR,
    },
    // "auto": Scene 31 says "Puff stops dead", which is about the picture. The
    // line is recognition, and the audience is already a beat ahead of him.
    a3_45_puff: { text: "Oh. Oh, that kite is not flying at all.", ...PUFF },
    a3_46_narrator: {
      text: "No. It is not. Do you know what that kite is missing, Puff?",
      ...NARRATOR,
    },
    a3_47_puff: { text: "Me. That kite is missing ME.", ...PUFF },
    a3_48_narrator: { text: "Go on then.", ...NARRATOR, speed: 0.9 },
    // THE SHOUT. Respelled for MiniMax — "PUUUSH!" reads as separated syllables
    // here, where kokoro read it as one long vowel. The length now comes from
    // `angry`, which is the approved read: on this engine `angry` is effort and
    // volume, not temper (auditioned plain-vs-stretched and surprised-vs-angry,
    // public/narration/auditions-mm-puff/push_v2_plain_angry.mp3). Scene 31
    // gives it the biggest breath in the episode and 75f of silence after.
    a3_49_puff: { text: "PUSH!", ...PUFF, emotion: "angry" },
    a3_50_narrator: {
      text: "Up it went. Higher than the fence. Higher than the trees. Higher than the birds.",
      ...NARRATOR,
      speed: 0.95,
    },
    // BEETLE. Third and final firing of the repetition gag — and it is not a
    // re-recording of a1_07, it is a1_07. Do not "improve" this line.
    //
    // On kokoro this was free: the same text in the same voice produced a
    // byte-identical clip, which is why the production note could simply say
    // "identical text, identical speed". MiniMax is a remote model called once
    // per key, and the first two generations of this one sentence came back
    // 2.20s and 2.84s — a thirty percent difference in the sentence whose
    // entire job is to sound exactly like it did five minutes earlier. So the
    // recording is shared outright (`sameAs`, see the generator's header). The
    // text lives on a1_07; changing it there re-copies here.
    a3_51_narrator: { sameAs: "a1_07_narrator" },
    // "auto": "the line the whole character was built to say", and Scene 32
    // hands it a 45f beat on either side. Four quiet words that answer a gag
    // fired twice in Act One — the restraint is the point.
    a3_52_puff: { text: "Yes. Yes, there is.", ...PUFF, speed: 0.95 },
    a3_53_narrator: {
      text: "Nobody on that hill could see Puff. Nobody ever will.",
      ...NARRATOR,
    },
    // "auto": the catchphrase in "its grown-up form", over the kite. Scene 32's
    // thesis is that nothing about his visibility changed — the confidence is
    // in the sentence, and a bright read would make it a boast instead.
    a3_54_puff: {
      text: "They still can't see me. But look what they CAN see.",
      ...PUFF,
    },
    // C9 — THE ROCK CALLBACK, new Scene 32b. Same clip, not a re-recording:
    // `sameAs` shares the Scene 13 file byte for byte, which is the rule for
    // any repetition gag on a paid remote model (see the beetle, a3_51). Costs
    // nothing and is guaranteed identical, which is what makes it funny.
    // The key keeps the `_narrator` suffix: it means "not one of the four
    // principals", and the staged speaker is a SPEAKER_VISUAL override.
    a3_55_narrator: { sameAs: "a2_08_narrator" },
    // The button. a2_10_narrator was "The rock is having the best day of its
    // life."; this is the same sentence plus one word, five minutes later —
    // the beetle/leaf rule (identical text, identical speed) applied to the
    // narrator's own line. Speed matches a2_10's 0.95 exactly.
    a3_56_narrator: {
      text: "The rock is still having the best day of its life.",
      ...NARRATOR,
      speed: 0.95,
    },

    // ---------------------------------------------------------------
    // RECAP — the chant, the mind-blower, the tease
    // ---------------------------------------------------------------
    rc_01_narrator: {
      text: "Let's say the big words together. Ready?",
      ...NARRATOR,
    },
    // Scene 33: one lit panel per character, each taking a bow for their own Big
    // Word — same note that puts rc_03 and rc_04 on `happy`.
    rc_02_puff: {
      text: "AIR! You cannot see it, you CAN feel it, and it is real stuff! That is me!",
      ...PUFF,
      emotion: "happy",
    },
    // Scene 33: the chant, one lit panel per character. Both of these are the
    // character taking a bow for their own Big Word.
    rc_03_sunny: {
      text: "WARM AIR RISES! Because I warm the ground! That is also me!",
      ...SUNNY,
    },
    rc_04_cloudia: {
      text: "WIND! Air in a hurry! It delivers me door to door, darling!",
      ...CLOUDIA,
      emotion: "happy",
    },
    rc_05_narrator: {
      text: "SEA BREEZE. Hot sand, cool sea, and a wind off the water every sunny day.",
      ...NARRATOR,
    },
    // The four-word summary. Slowest line in the recap on purpose — this is
    // the one a grown-up rewinds.
    rc_06_narrator: {
      text: "Air. Warm air rises. Wind. Sea breeze.",
      ...NARRATOR,
      speed: 0.88,
    },
    rc_07_narrator: {
      text: "And wind is happening right now. Outside your window. All night. Everywhere.",
      ...NARRATOR,
      speed: 0.95,
    },
    rc_08_narrator: {
      text: "Now here is the amazing part.",
      ...NARRATOR,
    },
    rc_09_narrator: {
      text: "Right this minute, the wind is picking up sand from a desert called the Sahara.",
      ...NARRATOR,
    },
    rc_10_narrator: {
      text: "It carries that sand all the way across an ocean, and sprinkles it on a rainforest.",
      ...NARRATOR,
    },
    // Scene 35 is "the mind-blower" and this is the audience's line, said for
    // them. Slowed already; `surprised` is the last fact that lands on him.
    rc_11_puff: {
      text: "Sand. Across a whole OCEAN. In the sky.",
      ...PUFF,
      speed: 0.95,
      emotion: "surprised",
    },
    // C10. Third firing of Cloudia's catchphrase, out of Puff's mouth, over a
    // very small version of her grand two-handed presenting gesture. Nobody
    // comments. Deliberately NOT seasoned — rc_11 carries the `surprised` awe
    // and this is the flat button after it. If it is played, it is a kid doing
    // an impression badly; unplayed, it is a kid doing one perfectly.
    rc_11b_puff: { text: "Door to door, darling.", ...PUFF },
    rc_12_narrator: {
      text: "And the trees grow better because of it. That is the wind, doing a job.",
      ...NARRATOR,
    },
    rc_13_narrator: { text: "Next time. Why is the sky BLUE?", ...NARRATOR },
    // Scene 36: the running gag's last confident firing, twelve seconds before
    // it breaks.
    rc_14_sunny: { text: "OH, that one is me as well! HA! HA!", ...SUNNY },
    rc_15_narrator: {
      text: "Sunny has a theory. It is wrong.",
      ...NARRATOR,
      speed: 0.9,
    },
    // Scene 36: "Sunny holds his pose while the sentence catches up with him."
    // The whole joke is the delay and then the dawning — the one line in two
    // episodes where he is not sure of himself. Kokoro carries no emotion, so
    // the dawning is entirely the 45f beat in front of it and his face.
    rc_16_sunny: { text: "Wait. What?", ...SUNNY },
    // Scene 36: the catchphrase's third and last firing, waving from the corner
    // of the episode-three card. The sign-off, and he is at full opacity.
    rc_17_puff: {
      text: "Bye! You can't see me. But you can FEEL me.",
      ...PUFF,
      emotion: "happy",
    },
  },
};
