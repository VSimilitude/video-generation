// Narration script for "Drip Chooses the Way Up" — Little Big World, the
// choose-your-own-adventure demo (docs/CYOA.md, phase 1). Run
// `npm run narration -- --video drip-fork` after editing; unchanged lines are
// served from cache.
//
// FORMAT — identical to episode one's (src/videos/water-cycle/narration.mjs).
// Every line is an object so each character keeps its own voice; the file-level
// `voice` / `speed` are the house default (the Narrator).
//
//   Narrator  af_heart  1.0   warm storyteller, deadpan on the punchlines
//   Drip      af_bella  1.1   small, brave, dramatic — the speed is the
//                             character, not a fix
//   Sunny     am_puck   1.0   the Sun. Enormous ego, and entirely correct
//   Cloudia   bf_emma   1.0   theatrical manager of the Cloud Hotel
//
// Keys are `<seg>_<number>_<speaker>`, and the segment prefix is the branch
// node: `in` intro (shared trunk), `sa` the sunbeam branch, `fl` the float
// branch, `en` the merged ending. `ch` lines are the choice card's own audio —
// they are played by the SITE player over the paused last frame of `in`, never
// by a scene, so no scene references them.
//
// VARIANT INSERT — `en_01a_cloudia` / `en_01b_cloudia` are the same beat of the
// merged trunk in two flavours: `a` on path sunbeam, `b` on path float. The
// greeting scene carries no turns; the composition mounts whichever clip the
// viewer's path selected (see scenes/ending.tsx). `speakerOf` reads the LAST
// underscore token, so the `01a` / `01b` numbering parses as `cloudia` fine.
//
// TEXT-TO-SPEECH RULES OBSERVED HERE (same set as episode one)
//   - No digits: "eleven", "nine", never a numeral.
//   - No colons, percent signs or ampersands — colons read as hard pauses.
//     Commas and full stops carry the rhythm.
//   - Sound words are spelled as words: WHOOSH, Wheee, Ooh.
//   - CAPS mark shouted words and survive the model fine.
//   - Initialisms would be spelled out with spaces; there are none here.
//
// WATCH-FORS — audition these before trusting them (nobody has heard them yet):
//   - `sa_02_drip` stacks "WHOOSH!" and "Wheee!" in one line, both long vowel
//     runs in CAPS at Drip's 1.1 speed. Episode one's equivalents needed a
//     second pass; this is the likeliest line in the file to need one.
//   - `sa_01_sunny` is three exclamation marks in a row at am_puck's shout
//     register — check it does not clip or rush the last clause.
//   - `in_04_sunny` opens with "UP? Did somebody say UP?" — a question mark
//     immediately after a single shouted word sometimes flattens the rise.
//   - `fl_02_drip` uses "Ooh. Oh!" back to back; episode one replaced a "Brrr"
//     for exactly this kind of short vowel-only token.
//   - `en_01a_cloudia` / `en_01b_cloudia` must feel like the SAME greeting in
//     two flavours. They are heard in the same slot on different watches, so
//     compare them back to back for length and energy, not just clarity.
//   - `ch_02_narrator` / `ch_03_narrator` are two-word button labels read by
//     the narrator voice; check they don't come out clipped at the head, since
//     the site plays them the instant a card appears.
const NARRATOR = { voice: "af_heart", speed: 1.0 };
const DRIP = { voice: "af_bella", speed: 1.1 };
const SUNNY = { voice: "am_puck", speed: 1.0 };
const CLOUDIA = { voice: "bf_emma", speed: 1.0 };

export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    // ---------------------------------------------------------------
    // INTRO — the shared trunk, ending on the question
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
    // SUNBEAM — the fast way
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
    // FLOAT — the slow way
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
    // ENDING — the merged trunk. `01a` and `01b` are the variant insert.
    // ---------------------------------------------------------------
    en_01a_cloudia: {
      text: "DRIP! You came up on a sunbeam! Sunny has not stopped talking about it!",
      ...CLOUDIA,
    },
    en_01b_cloudia: {
      text: "DRIP! You floated up the gentle way! You saw every single bird!",
      ...CLOUDIA,
    },
    en_02_drip: {
      text: "I did it! I went all the way up! I am extremely tall now!",
      ...DRIP,
    },
    en_03_narrator: {
      text: "And that is how Drip got to the Cloud Hotel. One way, out of two.",
      ...NARRATOR,
    },
    en_04_narrator: {
      text: "Come back and send him the other way. It is a completely different trip.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // CHOICE CARD — played by the site player, not by any scene
    // ---------------------------------------------------------------
    ch_01_narrator: { text: "How should Drip go up? You pick!", ...NARRATOR },
    ch_02_narrator: { text: "Zoom with Sunny!", ...NARRATOR },
    ch_03_narrator: { text: "Float up slow!", ...NARRATOR },
  },
};
