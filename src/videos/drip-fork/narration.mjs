// Narration script for "Drip Chooses the Way Up" — Little Big World, the
// choose-your-own-adventure demo (docs/CYOA.md, phase 1.5: the expansion —
// src/videos/drip-fork/expansion-brief.md is the design, and its line wording
// is final). Run `npm run narration -- --video drip-fork` after editing;
// unchanged lines are served from cache.
//
// FORMAT — identical to episode one's (src/videos/water-cycle/narration.mjs).
// Every line is an object so each character keeps its own voice; the file-level
// `voice` / `speed` are the house default (the Narrator). All kokoro, as the
// demo always was (brief ruling 3): free, deterministic, reworded at will.
//
//   Narrator  af_heart  1.0   warm storyteller, deadpan on the punchlines
//   Drip      af_bella  1.1   small, brave, dramatic — the speed is the
//                             character, not a fix
//   Sunny     am_puck   1.0   the Sun. Enormous ego, and entirely correct
//   Cloudia   bf_emma   1.0   theatrical manager of the Cloud Hotel
//
// THE TREE — three choices, foldback at every act boundary, eight paths:
//
//   intro ─┬─ sunbeam ─┐
//          └─ float ───┴─ hotel ─┬─ rain ─┐
//                                └─ snow ─┴─ stream ─┬─ river ──────┐
//                                                    └─ underground ┴─ ending
//
// Keys are `<seg>_<nn>[a|b]_<speaker>`, and the prefix is the branch node:
// `in` intro, `sa` sunbeam, `fl` float, `ho` hotel, `ra` rain, `sn` snow,
// `st` stream, `ri` river, `ug` underground, `en` ending. `ch` lines are the
// choice cards' own audio — played by the SITE player over the paused last
// frames of `in`, `ho` and `st`, never by a scene, so no scene references them.
//
// VARIANT INSERTS — `a`/`b` keys are the same beat of a shared segment in two
// flavours, one per option of an earlier choice (two tagged variants, docs/
// CYOA.md amendment 2). Ten clips, no more (brief ruling 2):
//   ho_01a/b   hotel greeting       wayUp    sunbeam / float
//   st_02a/b   stream hello         wayDown  rain / snow
//   en_04a/b   Sunny's credit 1     wayUp    sunbeam / float
//   en_05a/b   Sunny's credit 2     wayDown  rain / snow
//   en_06a/b   Sunny's credit 3     whereTo  river / underground
// The variant beats are mounted by the composition, which picks the clip from
// the viewer's path (Video.tsx, `VARIANTS`). `speakerOf` reads the LAST
// underscore token, so `01a` / `04b` numbering parses as the speaker fine.
//
// TEXT-TO-SPEECH RULES OBSERVED HERE (same set as episode one)
//   - No digits: "eleven", "nine", never a numeral.
//   - No colons, percent signs or ampersands — colons read as hard pauses.
//     Commas and full stops carry the rhythm.
//   - Sound words are spelled as words: WHOOSH, Wheee, Ooh, Sploosh, Slurp.
//   - CAPS mark shouted words and survive the model fine.
//   - Initialisms would be spelled out with spaces; there are none here.
//   - Roll calls get a per-line speed below the character's default so the
//     names separate (docs/STYLE.md, comedy pacing): `ug_04`, `en_02`.
//
// WATCH-FORS — audition these before trusting them:
//   - `sa_02_drip` stacks "WHOOSH!" and "Wheee!" in one line, both long vowel
//     runs in CAPS at Drip's 1.1 speed. Episode one's equivalents needed a
//     second pass; this is the likeliest line in the file to need one.
//   - `sa_01_sunny` is three exclamation marks in a row at am_puck's shout
//     register — check it does not clip or rush the last clause.
//   - `in_04_sunny` opens with "UP? Did somebody say UP?" — a question mark
//     immediately after a single shouted word sometimes flattens the rise.
//   - `fl_02_drip` uses "Ooh. Oh!" back to back; episode one replaced a "Brrr"
//     for exactly this kind of short vowel-only token.
//   - `sn_03_drip` stacks CAPS words in four short sentences ("LOOK",
//     "CORNERS") at 1.1 — check the second shout is not swallowed and the line
//     still reads as delight, not alarm.
//   - `en_08_drip` is the longest shout in the show, ending on "THE WATER
//     CYCLE!" — check the final CAPS phrase does not clip or flatten after
//     six sentences of build.
//   - `ho_06_cloudia` "And, oh my." — a two-syllable aside between commas;
//     check bf_emma gives it a beat rather than running it into "We are FULL".
//   - `ra_02_drip` was "Ohhhh nooooo. WHEEE!": kokoro af_bella does not
//     stretch, and every spelling of "whee" came out as a flat "we" (Whisper:
//     "Oh, no, we." — an 8-year-old heard "oh Noah, weE"). Recut 2026-10-19 as
//     "Oh, no. Yippee!", which transcribes clean; the bubble keeps the print
//     stretch. Old take: scratchpad/feedback-2026-10-19/ra_02_drip.OLD.mp3.
//   - Each variant pair (`ho_01a/b`, `st_02a/b`, `en_04a/b`, `en_05a/b`,
//     `en_06a/b`) must feel like the SAME beat in two flavours. They are heard
//     in the same slot on different watches, so compare them back to back for
//     length and energy, not just clarity.
//   - `ch_*` labels are short button reads; check none comes out clipped at
//     the head, since the site plays them the instant a card appears.
const NARRATOR = { voice: "af_heart", speed: 1.0 };
const DRIP = { voice: "af_bella", speed: 1.1 };
const SUNNY = { voice: "am_puck", speed: 1.0 };
const CLOUDIA = { voice: "bf_emma", speed: 1.0 };
/** Drip, slowed for a roll call so the names separate. */
const DRIP_ROLLCALL = { voice: "af_bella", speed: 1.0 };

export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    // ---------------------------------------------------------------
    // INTRO — the shared trunk, ending on the first question
    // ---------------------------------------------------------------
    in_01_narrator: {
      text: "This is Drip. He is a drop of water, and he is smaller than your thumb.",
      ...NARRATOR,
    },
    in_02_drip: { text: "I am not small. I am TRAVEL-SIZED.", ...DRIP },
    in_03_drip: {
      text: "And today I am going all the way up to the Cloud Hotel, to visit my friend Cloudia!",
      ...DRIP,
    },

    in_04_sunny: {
      text: "UP? Did somebody say UP? Take the sunbeam express! Straight to the top! HA! HA!",
      ...SUNNY,
    },
    in_05_narrator: {
      text: "Or Drip can warm up slowly, and float. It is gentle. It is slow. There are birds.",
      ...NARRATOR,
    },
    in_06_drip: { text: "Ooh. Zoomy way. Floaty way. I cannot pick!", ...DRIP },
    in_07_narrator: {
      text: "Which way should Drip go? You choose!",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // SUNBEAM — the fast way up
    // ---------------------------------------------------------------
    sa_01_sunny: {
      text: "HOLD ON TO YOUR FACE! Sunbeam express, now boarding!",
      ...SUNNY,
    },
    sa_02_drip: { text: "WHOOSH! My feet are LEAVING! Wheee!", ...DRIP },
    sa_03_narrator: {
      text: "Drip went up so fast that the ocean forgot he had ever been in it.",
      ...NARRATOR,
    },
    sa_04_sunny: {
      text: "That was ALL me. Every single bit of that was me. You are welcome!",
      ...SUNNY,
    },
    sa_05_drip: {
      text: "I think I saw a bird. It was a stripe.",
      ...DRIP,
    },

    // ---------------------------------------------------------------
    // FLOAT — the slow way up
    // ---------------------------------------------------------------
    fl_01_narrator: {
      text: "The gentle way starts with almost nothing at all. The sun warms the water, and Drip gets lighter.",
      ...NARRATOR,
    },
    fl_02_drip: {
      text: "Ooh. Oh! I am going up. I am going up VERY politely.",
      ...DRIP,
    },
    fl_03_narrator: {
      text: "On the way he passed a boat, eleven birds, and one extremely surprised seagull.",
      ...NARRATOR,
    },
    fl_04_drip: {
      text: "Hello boat! Hello birds! Hello surprised bird!",
      ...DRIP,
    },
    // Deadpan tag. It lands in silence — see the gap on fl_04 in Video.tsx.
    fl_05_narrator: { text: "It took a while. Nobody minded.", ...NARRATOR },

    // ---------------------------------------------------------------
    // HOTEL — shared trunk 1. `01a`/`01b` are the choice-1 variant insert.
    // ---------------------------------------------------------------
    ho_01a_cloudia: {
      text: "DRIP! You came up on a sunbeam! Sunny has not stopped talking about it!",
      ...CLOUDIA,
    },
    ho_01b_cloudia: {
      text: "DRIP! You floated up the gentle way! You saw every single bird!",
      ...CLOUDIA,
    },
    ho_02_drip: {
      text: "I did it! I went all the way up! I am extremely tall now!",
      ...DRIP,
    },
    ho_03_cloudia: {
      text: "Welcome, darling, to the Cloud Hotel. House rules. Every guest hugs a speck of dust.",
      ...CLOUDIA,
    },
    ho_04_drip: { text: "Hello, speck. I shall call you Kevin.", ...DRIP },
    ho_05_narrator: {
      text: "A cloud is a zillion tiny drops, each one hugging a speck. Drip was now wallpaper.",
      ...NARRATOR,
    },
    ho_06_cloudia: {
      text: "Room for one more. And one more. And, oh my. We are FULL.",
      ...CLOUDIA,
    },
    ho_07_narrator: {
      text: "A crowded cloud goes grey, and heavy, and a heavy hotel cannot stay in the sky. It was check-out time.",
      ...NARRATOR,
    },
    ho_08_cloudia: {
      text: "Two ways down, darling. The waterslide, straight off the balcony. Or the roof. It is very cold on the roof. Guests who leave from the roof leave as snowflakes.",
      ...CLOUDIA,
    },
    ho_09_drip: { text: "A waterslide. Or a SNOWFLAKE. I cannot pick!", ...DRIP },
    ho_10_narrator: {
      text: "Which way should Drip come down? You choose!",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // RAIN — the fast way down
    // ---------------------------------------------------------------
    ra_01_cloudia: {
      text: "Everybody OUT! Mind the gap, darling. There is no floor.",
      ...CLOUDIA,
    },
    ra_02_drip: { text: "Oh, no. Yippee!", ...DRIP },
    ra_03_narrator: {
      text: "Down he went. Rain is the fast way. The best waterslide ever built, and it goes all the way from the sky to the ground.",
      ...NARRATOR,
    },
    ra_04_drip: {
      text: "I am doing a LOOP! Raindrops do not do loops! I am doing one ANYWAY!",
      ...DRIP,
    },
    ra_05_narrator: { text: "Drip landed high on a mountain. Sploosh.", ...NARRATOR },
    ra_06_drip: {
      text: "I have landed. I am a mountain drop now. I live here.",
      ...DRIP,
    },
    // Deadpan tag. It lands in silence — see the gap on ra_06 in Video.tsx.
    ra_07_narrator: { text: "He lived there for about four seconds.", ...NARRATOR },

    // ---------------------------------------------------------------
    // SNOW — the slow way down, and the whole winter (brief ruling 1)
    // ---------------------------------------------------------------
    sn_01_cloudia: {
      text: "Up to the roof, darling. It is very cold. Mind your edges.",
      ...CLOUDIA,
    },
    sn_02_narrator: {
      text: "On the roof the air was so cold that Drip froze into a snowflake. Six points. Very fancy.",
      ...NARRATOR,
    },
    sn_03_drip: {
      text: "Look at me. LOOK at me. I am a snowflake. I have CORNERS.",
      ...DRIP,
    },
    sn_04_narrator: {
      text: "Snow is the slow way. Drip drifted down for a very long time, and landed on the mountain without a sound.",
      ...NARRATOR,
    },
    sn_05_drip: {
      text: "I have landed. I am a mountain snowflake now. I live here.",
      ...DRIP,
    },
    sn_06_narrator: {
      text: "And he did live there. All winter. Snow does not roll downhill. Snow waits.",
      ...NARRATOR,
    },
    // Long hold before and after — the winter passes on screen (Video.tsx gaps).
    sn_07_drip: { text: "Still waiting. Still fancy.", ...DRIP },
    sn_08_narrator: {
      text: "Then spring came, and Sunny came with it, and the mountain snow melted into mountain water, one drop at a time.",
      ...NARRATOR,
    },
    sn_09_sunny: {
      text: "Good MORNING, snowflakes! Time to be water again! HA! HA!",
      ...SUNNY,
    },
    sn_10_drip: { text: "Aw. My corners.", ...DRIP },

    // ---------------------------------------------------------------
    // STREAM — shared trunk 2. `02a`/`02b` are the choice-2 variant insert.
    // ---------------------------------------------------------------
    st_01_narrator: {
      text: "Water always rolls downhill. Always. Every time. A trickle met a trickle, and that was a stream.",
      ...NARRATOR,
    },
    st_02a_drip: {
      text: "That was the greatest waterslide of my LIFE. Hi! Hi! Hi! Who are all of you?",
      ...DRIP,
    },
    st_02b_drip: {
      text: "I was a snowflake for a WHOLE winter. I looked great. Hi! Hi! Hi! Who are all of you?",
      ...DRIP,
    },
    st_03_narrator: {
      text: "The stream came to a fork. One way went along the ground, down to the river, past everybody. The other way went straight down, into the ground, where it was dark.",
      ...NARRATOR,
    },
    st_04_drip: {
      text: "The long way round. Or the secret way. I CANNOT PICK.",
      ...DRIP,
    },
    st_05_narrator: {
      text: "Which way should Drip go home? You choose!",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // RIVER — home the long way round
    // ---------------------------------------------------------------
    ri_01_narrator: {
      text: "The stream met another stream, and the streams became a river, and the river had visitors.",
      ...NARRATOR,
    },
    ri_02_narrator: {
      text: "A flower leaned over and drank a bit of him. Slurp.",
      ...NARRATOR,
    },
    ri_03_drip: { text: "Excuse me! That was my elbow!", ...DRIP },
    ri_04_narrator: {
      text: "Then a moose walked in and stood right in the middle of the river. The moose did not move. Moose rarely do.",
      ...NARRATOR,
    },
    ri_05_drip: {
      text: "Sir! SIR! Fine. FINE. We will go AROUND the moose.",
      ...DRIP,
    },
    ri_06_narrator: {
      text: "Farmers took some. A town took some. Somebody's bath. Somebody's teeth.",
      ...NARRATOR,
    },
    ri_07_drip: {
      text: "Everybody wants a bit of me! I am very popular!",
      ...DRIP,
    },
    ri_08_narrator: {
      text: "Then the river turned a corner, and the water got wide, and blue, and salty, and enormous.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // UNDERGROUND — home the secret way
    // ---------------------------------------------------------------
    ug_01_narrator: {
      text: "Drip sank into the ground, between the stones, and everything went dark.",
      ...NARRATOR,
    },
    ug_02_drip: {
      text: "I cannot see anything. I am an underground drop now. This is fine. I live here.",
      ...DRIP,
    },
    ug_03_narrator: {
      text: "This part is true, and most people forget it. A huge amount of the world's water is under the ground, moving very slowly, in the dark.",
      ...NARRATOR,
    },
    // The roll call. Slower than Drip's 1.1 so the four names separate.
    ug_04_drip: {
      text: "Hi Worm! Hi Wormy! Hi other Worm! Hi Worm the third!",
      ...DRIP_ROLLCALL,
    },
    ug_05_narrator: { text: "Every worm down there is called Worm.", ...NARRATOR },
    ug_06_drip: { text: "They did not say hi back. Worms are busy.", ...DRIP },
    ug_07_narrator: {
      text: "Underground water goes downhill too. Slowly. Sideways. Towards the sea. And one day, it comes out.",
      ...NARRATOR,
    },
    ug_08_narrator: {
      text: "Drip came out of a hole in a cliff, as a little spring, straight onto a beach, which surprised a crab.",
      ...NARRATOR,
    },
    ug_09_drip: {
      text: "SUNLIGHT! Hello crab! I came from UNDER you! And there is the sea!",
      ...DRIP,
    },

    // ---------------------------------------------------------------
    // ENDING — shared trunk 3. `04`/`05`/`06` a/b are the three credit inserts.
    // ---------------------------------------------------------------
    en_01_narrator: {
      text: "The sea. Wide, and blue, and salty, and home.",
      ...NARRATOR,
    },
    // The sibling roll call (ep 1). Slowed for the same reason as ug_04.
    en_02_drip: {
      text: "Hi Drop! Hi Droplet! Hi Dripley! I am BACK!",
      ...DRIP_ROLLCALL,
    },
    en_03_sunny: {
      text: "Everybody! EVERYBODY! Let us go over who did what today. It was me. But let us go over it.",
      ...SUNNY,
    },
    en_04a_sunny: { text: "The sunbeam express? Me. Obviously.", ...SUNNY },
    en_04b_sunny: {
      text: "The slow float? Also me. I was just being gentle.",
      ...SUNNY,
    },
    en_05a_sunny: {
      text: "The rain? Me. I filled that hotel until it fell over.",
      ...SUNNY,
    },
    en_05b_sunny: {
      text: "The snow? That was the cold. But who melted it? ME.",
      ...SUNNY,
    },
    en_06a_sunny: {
      text: "The river? That was downhill. Fine. But downhill is not a person. So, me.",
      ...SUNNY,
    },
    en_06b_sunny: {
      text: "The underground? I have never been underground. I am still counting it.",
      ...SUNNY,
    },
    en_07_narrator: {
      text: "Sunny was right about most of that. Which, for Sunny, is normal.",
      ...NARRATOR,
    },
    en_08_drip: {
      text: "Wait. I went UP. I went across the sky. I came DOWN. And I came all the way home. It is not a line. It is a CIRCLE. THE WATER CYCLE!",
      ...DRIP,
    },
    en_09_narrator: {
      text: "You picked three things today. Drip has seven other trips in him. Come back and pick differently. It is a completely different adventure, in exactly the same world.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // CHOICE CARDS — played by the site player, not by any scene
    // ---------------------------------------------------------------
    // wayUp — over the last frames of `intro`
    ch_01_narrator: { text: "How should Drip go up? You pick!", ...NARRATOR },
    ch_02_narrator: { text: "Zoom with Sunny!", ...NARRATOR },
    ch_03_narrator: { text: "Float up slow!", ...NARRATOR },
    // wayDown — over the last frames of `hotel`
    ch_04_narrator: { text: "How should Drip come down? You pick!", ...NARRATOR },
    ch_05_narrator: { text: "Rain down fast!", ...NARRATOR },
    ch_06_narrator: { text: "Snow down slow!", ...NARRATOR },
    // whereTo — over the last frames of `stream`
    ch_07_narrator: { text: "Which way should Drip go home? You pick!", ...NARRATOR },
    ch_08_narrator: { text: "Down the river!", ...NARRATOR },
    ch_09_narrator: { text: "Under the ground!", ...NARRATOR },
  },
};
