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
//   Narrator  af_heart  1.0   warm storyteller, occasional deadpan. Also
//                             cameo-voices the beetle and the leaf in Act One
//                             and the rock in Act Two, so the show never grows
//                             past five actors
//   Puff      af_sky    1.05  PLACEHOLDER — see below
//   Sunny     am_puck   1.0   the Sun. Enormous ego, and entirely correct
//   Cloudia   bf_emma   1.0   one-scene cameo, delivered by wind
//   Drip      af_bella  1.1   one fan-service line, waving from inside Cloudia
//
// PUFF'S VOICE IS NOT FINAL. `af_sky` at 1.05 is a placeholder so the episode
// can be timed and watched end to end; the real pick comes from an audition
// before any scene is staged. Candidates, all worth hearing on `a1_04_puff`
// (small and apologetic), `a2_19_puff` (WHOOSH, delighted) and `a3_49_puff`
// (the big shout):
//     af_sky  af_nicole  bf_lily  am_liam
// Run `npm run narration -- --audition wind:a1_04_puff <dir>` and pick by ear.
// Whichever wins, keep the speed slightly above 1.0 — Puff talks in small
// quick breaths, the way Drip's 1.1 is character rather than fix. Changing the
// voice means changing PUFF below and nothing else.
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
//     FWOOSH, Poooof, Flop.
//   - CAPS mark shouted words and survive the model fine.
//   - The spelled-out Big Words are single letters with full stops
//     ("A. I. R.", "W. I. N. D.") so the model reads letter names and a kid can
//     chant along with the card. THESE TWO ARE THE FIRST THINGS TO AUDITION.
//     If the model says "one" for "I." or "uh" for "A.", swap in the phonetic
//     fallbacks, which are pre-written and known safe:
//       a1_38_puff  ->  "Ay. Eye. Arr. That spells AIR!"
//       a2_32_puff  ->  "Double you. Eye. Enn. Dee. WIND!"
//   - Also audition before building visuals: `a1_25_puff` ("Poooof!"),
//     `a2_19_puff` and `a3_49_puff` (long vowel runs), `a2_28_narrator`
//     ("FWOOSH." alone in a line) and `a3_19_sunny` (exclamation run).
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
const PUFF = { voice: "af_sky", speed: 1.05 }; // PLACEHOLDER — audition pending
const SUNNY = { voice: "am_puck", speed: 1.0 };
const CLOUDIA = { voice: "bf_emma", speed: 1.0 };
const DRIP = { voice: "af_bella", speed: 1.1 };

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
    a1_04_puff: {
      text: "Sorry. Sorry. I know you can't see me.",
      ...PUFF,
    },
    a1_05_narrator: {
      text: "Puff floated over to a beetle.",
      ...NARRATOR,
    },
    a1_06_puff: { text: "Good morning, beetle! I am Puff!", ...PUFF },
    // BEETLE (narrator cameo). First half of the episode's central repetition
    // gag. Deadpan, unhurried, and identical both times it fires — the joke is
    // the sameness, so a1_07 and a1_13 share text, voice and speed exactly.
    a1_07_narrator: {
      text: "Hello? Is somebody there?",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_08_puff: { text: "YES! Me! I am right here!", ...PUFF },
    a1_09_narrator: {
      text: "Huh. Must have been nothing.",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_10_puff: { text: "Sorry.", ...PUFF, speed: 0.95 },
    a1_11_narrator: {
      text: "Puff floated over to a leaf.",
      ...NARRATOR,
    },
    a1_12_puff: { text: "Good morning, leaf! I am Puff!", ...PUFF },
    // LEAF (narrator cameo). Second firing. Same words, same speed.
    a1_13_narrator: {
      text: "Hello? Is somebody there?",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_14_puff: {
      text: "It is ME. Puff. We do this every single day.",
      ...PUFF,
    },
    a1_15_narrator: {
      text: "Huh. Must have been nothing.",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_16_puff: { text: "Sorry. Sorry.", ...PUFF, speed: 0.95 },
    // Roll call of the people who cannot see him. Slowed so the three items
    // separate.
    a1_17_puff: {
      text: "Nobody ever SEES me. Not the beetles. Not the leaves. Nobody.",
      ...PUFF,
      speed: 0.95,
    },
    a1_18_puff: { text: "I think I might be nothing at all.", ...PUFF },
    a1_19_narrator: { text: "Puff. May I say something?", ...NARRATOR },
    a1_20_puff: { text: "Sorry. Yes. Sorry.", ...PUFF, speed: 0.95 },
    a1_21_narrator: {
      text: "You are not nothing. You are AIR. And air is real stuff.",
      ...NARRATOR,
    },
    a1_22_puff: { text: "Stuff? Me? I am STUFF?", ...PUFF },
    a1_23_narrator: {
      text: "Watch. Here is a dandelion, all full of fluffy seeds.",
      ...NARRATOR,
    },
    a1_24_narrator: {
      text: "Now. Take a big breath, and puff it out.",
      ...NARRATOR,
    },
    a1_25_puff: { text: "Okay. Here I go. Ready? Poooof!", ...PUFF },
    a1_26_narrator: {
      text: "Every single seed. Gone. Flying.",
      ...NARRATOR,
      speed: 0.95,
    },
    a1_27_puff: {
      text: "I did that? With my puff? I moved a whole flower?",
      ...PUFF,
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
    a1_31_puff: { text: "They can feel me. THEY CAN FEEL ME!", ...PUFF },
    a1_32_narrator: {
      text: "One more. Somebody blew up a balloon.",
      ...NARRATOR,
    },
    a1_33_puff: { text: "Oof. Oof! I am inside a balloon!", ...PUFF },
    a1_34_narrator: {
      text: "The balloon got fat and round. Something filled it up.",
      ...NARRATOR,
    },
    a1_35_puff: { text: "It is me. I FILLED it. I have a SHAPE!", ...PUFF },
    a1_36_narrator: {
      text: "Nothing cannot fill a balloon. Only stuff can fill a balloon.",
      ...NARRATOR,
    },
    a1_37_narrator: {
      text: "So here is our first big word. Air.",
      ...NARRATOR,
    },
    // SPELL MOMENT. Audition first. Fallback if the letters read wrong:
    // "Ay. Eye. Arr. That spells AIR!"
    a1_38_puff: { text: "A. I. R. That spells AIR!", ...PUFF, speed: 0.9 },
    a1_39_narrator: {
      text: "You cannot see air. You CAN feel air. Air is real STUFF.",
      ...NARRATOR,
    },
    a1_40_puff: {
      text: "You can't see me. But you can FEEL me.",
      ...PUFF,
    },
    a1_41_narrator: {
      text: "Puff felt taller. Which is tricky, when you are made of air.",
      ...NARRATOR,
    },
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
    a2_02_sunny: { text: "GOOD MORNING, EVERYBODY!", ...SUNNY },
    a2_03_puff: { text: "Oh no. Oh, he is enormous.", ...PUFF },
    a2_04_narrator: {
      text: "This is Sunny. You may remember him. He remembers himself constantly.",
      ...NARRATOR,
    },
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
    // ROCK (narrator cameo). One line, very slow, completely sincere.
    a2_08_narrator: {
      text: "Ohhh yeah. That is the stuff.",
      ...NARRATOR,
      speed: 0.85,
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
    a2_12_narrator: {
      text: "The sun warms the GROUND. And then the warm ground warms the air.",
      ...NARRATOR,
    },
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
    a2_16_puff: { text: "Wait. Wait wait wait. I am going UP!", ...PUFF },
    a2_17_puff: { text: "This happened to my friend Drip!", ...PUFF },
    a2_18_narrator: {
      text: "Different show. Same sun.",
      ...NARRATOR,
      speed: 0.92,
    },
    a2_19_puff: {
      text: "WHOOSH! I am flying! I am actually flying!",
      ...PUFF,
    },
    a2_20_narrator: {
      text: "Warm air rises. Say it with me. Warm air rises.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_21_puff: {
      text: "Warm air RISES! And I am the warm air!",
      ...PUFF,
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
    a2_25_puff: { text: "Oops. Sorry about the hole.", ...PUFF },
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
    a2_29_puff: { text: "Whoa! Who are all these guys?", ...PUFF },
    a2_30_narrator: {
      text: "Cool air. In a very big hurry.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_31_narrator: {
      text: "And that rushing, hurrying, sideways air has a name. Wind.",
      ...NARRATOR,
    },
    // SPELL MOMENT. Audition first. Fallback if the letters read wrong:
    // "Double you. Eye. Enn. Dee. WIND!"
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
    a2_39_sunny: { text: "EXCUSE ME. Who warmed the ground?", ...SUNNY },
    a2_40_puff: { text: "Um. You did.", ...PUFF },
    // Sunny's causal chain — this is the pedagogy and the punchline at once.
    // Slowed a touch so a six-year-old can follow all three links.
    a2_41_sunny: {
      text: "I warm the ground! The ground warms the air! The air goes UP!",
      ...SUNNY,
      speed: 0.95,
    },
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
    a2_46_puff: { text: "Sorry, everybody! I did not mean to.", ...PUFF },
    a2_47_puff: { text: "No. Wait. Not sorry.", ...PUFF, speed: 0.95 },
    a2_48_puff: {
      text: "I move flowers. I fill balloons. I am STUFF.",
      ...PUFF,
      speed: 0.95,
    },

    // ---------------------------------------------------------------
    // ACT THREE — AIR WITH A JOB. Big Word: SEA BREEZE
    // ---------------------------------------------------------------
    a3_01_narrator: {
      text: "Puff wanted to know what else a wind could do. So we went to the beach.",
      ...NARRATOR,
    },
    a3_02_puff: { text: "The beach! I have never been ANYWHERE!", ...PUFF },
    a3_03_narrator: {
      text: "And the beach has a secret. The beach makes its own wind. Every sunny day.",
      ...NARRATOR,
    },
    a3_04_puff: { text: "The beach MAKES wind? By itself?", ...PUFF },
    a3_05_narrator: {
      text: "Puff. Go and sit on the sand, and tell me how it feels.",
      ...NARRATOR,
    },
    a3_06_puff: { text: "Ow. Ow ow ow. That sand is HOT.", ...PUFF },
    a3_07_narrator: { text: "Now go and sit on the sea.", ...NARRATOR },
    a3_08_puff: { text: "Ooh. The sea is lovely and cool.", ...PUFF },
    // The comparison the whole sea-breeze idea rests on. Slowed.
    a3_09_narrator: {
      text: "Same sun. Same morning. Sand hot. Sea cool.",
      ...NARRATOR,
      speed: 0.9,
    },
    a3_10_narrator: {
      text: "Sand heats up fast. Water takes ages and ages and ages.",
      ...NARRATOR,
    },
    a3_11_narrator: {
      text: "So the air above the hot sand gets warm, and up it goes.",
      ...NARRATOR,
    },
    a3_12_puff: { text: "And that leaves a GAP! I know this bit!", ...PUFF },
    a3_13_narrator: {
      text: "It does. And the cool air over the sea comes rushing in to fill it.",
      ...NARRATOR,
    },
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
    a3_18_puff: {
      text: "Sea breeze! Sea BREEZE! That is me! I am a sea breeze!",
      ...PUFF,
    },
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
    a3_31_puff: { text: "I MAKE LIGHTBULBS!", ...PUFF },
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
    a3_38_cloudia: {
      text: "Puff, darling! Take me to the mountains! I am FULL of rain!",
      ...CLOUDIA,
    },
    a3_39_narrator: {
      text: "So Puff pushed a whole cloud, all the way across the sky.",
      ...NARRATOR,
    },
    a3_40_cloudia: {
      text: "Finally! Door to door service, darling!",
      ...CLOUDIA,
    },
    a3_41_drip: { text: "Hi! It's me! I'm the weather!", ...DRIP },
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
    a3_45_puff: { text: "Oh. Oh, that kite is not flying at all.", ...PUFF },
    a3_46_narrator: {
      text: "No. It is not. Do you know what that kite is missing, Puff?",
      ...NARRATOR,
    },
    a3_47_puff: { text: "Me. That kite is missing ME.", ...PUFF },
    a3_48_narrator: { text: "Go on then.", ...NARRATOR, speed: 0.9 },
    a3_49_puff: { text: "PUUUSH!", ...PUFF },
    a3_50_narrator: {
      text: "Up it went. Higher than the fence. Higher than the trees. Higher than the birds.",
      ...NARRATOR,
      speed: 0.95,
    },
    // BEETLE (narrator cameo). Third and final firing of the repetition gag,
    // word for word and speed for speed identical to a1_07 and a1_13. Do not
    // "improve" this line.
    a3_51_narrator: {
      text: "Hello? Is somebody there?",
      ...NARRATOR,
      speed: 0.92,
    },
    a3_52_puff: { text: "Yes. Yes, there is.", ...PUFF, speed: 0.95 },
    a3_53_narrator: {
      text: "Nobody on that hill could see Puff. Nobody ever will.",
      ...NARRATOR,
    },
    a3_54_puff: {
      text: "They still can't see me. But look what they CAN see.",
      ...PUFF,
    },

    // ---------------------------------------------------------------
    // RECAP — the chant, the mind-blower, the tease
    // ---------------------------------------------------------------
    rc_01_narrator: {
      text: "Let's say the big words together. Ready?",
      ...NARRATOR,
    },
    rc_02_puff: {
      text: "AIR! You cannot see it, you CAN feel it, and it is real stuff! That is me!",
      ...PUFF,
    },
    rc_03_sunny: {
      text: "WARM AIR RISES! Because I warm the ground! That is also me!",
      ...SUNNY,
    },
    rc_04_cloudia: {
      text: "WIND! Air in a hurry! It delivers me door to door, darling!",
      ...CLOUDIA,
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
    rc_11_puff: {
      text: "Sand. Across a whole OCEAN. In the sky.",
      ...PUFF,
      speed: 0.95,
    },
    rc_12_narrator: {
      text: "And the trees grow better because of it. That is the wind, doing a job.",
      ...NARRATOR,
    },
    rc_13_narrator: { text: "Next time. Why is the sky BLUE?", ...NARRATOR },
    rc_14_sunny: { text: "OH, that one is me as well! HA! HA!", ...SUNNY },
    rc_15_narrator: {
      text: "Sunny has a theory. It is wrong.",
      ...NARRATOR,
      speed: 0.9,
    },
    rc_16_sunny: { text: "Wait. What?", ...SUNNY },
    rc_17_puff: {
      text: "Bye! You can't see me. But you can FEEL me.",
      ...PUFF,
    },
  },
};
