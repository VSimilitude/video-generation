// Narration script for "Boom and the One, Two, Three" — Little Big World,
// episode six (slug `storm`). Topic: thunder and lightning — why thunder is
// always "late" (it is not; it is far). Audience: six-year-olds. Run
// `npm run narration -- --video storm` after editing; unchanged lines are
// served from cache. Source of truth: `script.md` in this directory — every
// line below is quoted from it verbatim, keys exactly as the screenplay.
//
// FORMAT
// Every line is an object so each character keeps its own voice. The
// file-level `voice` / `speed` are the house default (the Narrator);
// character lines override per line.
//
//   Narrator  kokoro   af_heart         1.0   warm storyteller, returning.
//                                             House flat 0.92, deadpan floor
//                                             0.9. Owns the count (ten number
//                                             clips on a 30-frame grid). Voice
//                                             only — never says "Present."
//   Boom      minimax  * NEW VOICE *    1.0   our hero, the thunder. 1.0 on
//                                             EVERY line, forever — sound has
//                                             one speed. Cast `happy`; exactly
//                                             two cited `auto` lines (a2_59,
//                                             a3_27). See the BOOM block
//   Cloudia   minimax  Abbess           1.0   the hotel. `auto` throughout,
//                                             no seasoning anywhere. "darling"
//                                             on every composed line
//   Sunny     kokoro   am_puck          1.0   the Sun, PRECISION. No emotion,
//                                             no pause markers; caps legal
//   Drip      minimax  Lively_Girl      1.0   `happy` on every line (locked)
//   Puff      minimax  Exuberant_Girl   1.0   `auto`, zero seasoned lines (the
//                                             migrated a2_03 carries its
//                                             source take's `happy`)
//   Blue      minimax  Decent_Boy       1.05  three lines, `happy` (locked);
//                                             4f approach gap (identity)
//   The volcano
//             minimax  Elegant_Man      0.9   pitch -6, `auto` forever. ONE
//                                             line (a2_63, CUTTABLE); 48f
//                                             approach gap (identity)
//   Flash, Violet, the kid, the hail guests — silent, always.
//
// EMOTION IS SEASONING. Boom, Drip and Blue carry a locked CAST `happy` on
// every recording — casting, not seasoning. Cloudia, Puff and the volcano are
// `auto`. The episode's only departures from a cast emotion are Boom's two
// `auto` lines, each citing its stage direction: the break a2_59 "Present."
// and the turn a3_27 "Count me.".
//
// PAUSE MARKERS: NONE IN THIS FILE, ANYWHERE. Every silence is a held beat
// between clips and belongs to `gapFrames` in `Video.tsx` — the comments
// below repeat each HELD BEAT the script writes down. Identity gaps: the
// volcano 48f, every Blue line 4f. Boom's arrival gap is NOT identity: it is
// the count. THE COUNT GRID: each number clip + its gap = exactly 30 frames.
//
// SAMEAS DISCIPLINE (world rule 5). Aliases resolve BACKWARDS ONLY; every
// source is the earliest firing, decided in script.md:
//   "Present!"        SOURCE a1_48_boom -> a2_12, a2_25, a2_52, a2_57, a3_11,
//                     a3_21, a3_38, a3_64 (ten firings, ONE paid recording).
//                     The break a2_59 "Present." is a FRESH recording.
//   "Going up."       SOURCE a1_06_puff -> a1_12, a1_31. Break a2_02 "Going
//                     down." is fresh.
//   "You're welcome! HA! HA!"
//                     SOURCE co_07_sunny -> a1_22, a3_06, rc_10 (kokoro;
//                     aliases state intent, ceiling 8).
//   "There he is."    SOURCE co_24_narrator -> a1_59 (the same seconds).
//   "Both true."      SOURCE a2_31_narrator -> a3_67.
//   The count         SOURCES co_15..co_23 ("One." .. "Nine.") and a3_60
//                     ("Ten."); forty-two count aliases; a2_15 "Six." is
//                     dialogue aliased to co_20 for wording only (off-grid).
//
// CACHE MIGRATION — TWO CLIPS ARE NOT NEW PURCHASES (copies, never moves;
// mp3 copied + `.cache.json` seeded BEFORE the first generator run). Fields
// match the SOURCE take exactly, because the hash is [model, text, voiceId,
// emotion, speed]:
//   a1_09_drip  == sky-blue a1_37_drip ("Hi! It's me! I'm the weather!",
//               Lively_Girl, happy, 1.0). FIFTH identical firing.
//   a2_03_puff  == wind a1_35_puff ("You can't see me. But you can FEEL
//               me.", Exuberant_Girl, happy, 1.0). The canon "FEEL" is the
//               ONLY capital inside a MiniMax clip in the episode — it never
//               gets a fresh draw.
//
// 250 line keys = 198 spoken lines + 52 count firings: 192 recordings (two of
// them cache-migrated) + 58 `sameAs` aliases (42 of them counts).
//
// TEXT-TO-SPEECH RULES OBSERVED HERE
//   - No digits, no ellipses, no em-dashes, no stretched vowels, no sound
//     words. The CRACK, the rumbles, the gust and the hail are sound design.
//   - CAPS on KOKORO lines only (Sunny, the Narrator's "FAR"). MiniMax text
//     is sentence case; the whole-shout one-word "Present!" is legal.
//   - One-word clips are the highest-risk class; fallbacks are pre-written
//     in script.md "TTS-risk fallbacks" — never reword here without them.
const NARRATOR = { voice: "af_heart", speed: 1.0 };

// BOOM — PROVISIONAL, cast by measurement (see
// scratchpad/ep6_boom_audition/MEASUREMENTS.md; Mike's ear ratifies).
// Register target: big, warm, resonant, a little goofy — a friendly giant,
// not a boom-box. Must clear Rock (Deep_Voice_Man) and the volcano
// (Elegant_Man -6) by >=2 st AND read faster than both. Recast = this one
// constant + a re-buy of his 36 recordings.
// 2026-10-26 audition (14 ids probed, all live; scratchpad/ep6_boom_audition/
// MEASUREMENTS.md). First pick English_FriendlyPerson won the two audition
// run-ons (~122 Hz) but, generated across all 36 lines, its median f0 landed
// at 104.9 Hz — ON Rock (104.9) and the volcano (105.8); a hard-gate failure
// the long audition lines hid. Re-measured on 14 real Boom lines per voice:
// English_magnetic_voiced_man medians 128.3 Hz (+3.5 st Rock, +3.3 st the
// volcano), the tightest clip-to-clip spread (1.6 st) and 13.7 chars/s
// (Rock 7.7, volcano 13.1) — the only voice passing both gates on real lines.
// Cost: 1.4 st above Sunny's am_puck median (different engine and timbre).
// Runner-up English_Gentle-voiced_man (+6.6 st, but slower than the volcano).
const BOOM_MINIMAX_VOICE = "English_magnetic_voiced_man";
const BOOM = {
  engine: "minimax",
  voiceId: BOOM_MINIMAX_VOICE,
  emotion: "happy",
  speed: 1.0,
};

// CLOUDIA — ep-1 second lead, now MiniMax Abbess. `auto` throughout; her
// two ep-1 canon lines (a1_03, a3_02) are fresh Abbess recordings (ep-1
// Cloudia was kokoro — cross-engine migration is impossible).
const CLOUDIA = { engine: "minimax", voiceId: "Abbess", emotion: "auto", speed: 1.0 };

// SUNNY — kokoro am_puck, series voice since ep 1: no emotion, no pause
// markers, no stretched vowels. Caps legal and read as emphasis.
const SUNNY = { voice: "am_puck", speed: 1.0 };

// DRIP — `happy` on every recording, locked casting.
const DRIP = { engine: "minimax", voiceId: "Lively_Girl", emotion: "happy", speed: 1.0 };

// PUFF — default `auto`, zero seasoned lines. (a2_03 carries `happy`
// because that is the field the migrated ep-2 take was drawn with.)
const PUFF = { engine: "minimax", voiceId: "Exuberant_Girl", emotion: "auto", speed: 1.0 };

// BLUE — `happy` (locked), 1.05 — the character and the physics.
const BLUE = { engine: "minimax", voiceId: "Decent_Boy", emotion: "happy", speed: 1.05 };

// THE VOLCANO — one line, `auto` forever, pitch -6, 0.9, 48f approach gap.
const VOLCANO = {
  engine: "minimax",
  voiceId: "Elegant_Man",
  emotion: "auto",
  pitch: -6,
  speed: 0.9,
};

export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {

    // Scene 1 — The heaviest morning
    co_01_narrator: {
      text: "This is a story about a noise. The biggest noise in the sky. Everybody says it is late. It has never been late in its life.",
      ...NARRATOR,
    },
    // The horizon obligation named on screen in the first wide: awake,
    // lit, island present.
    co_02_narrator: {
      text: "Here is a garden, on the hottest morning of the summer. Here is a kid, with bare feet in the air. Here is the sea, and the mountain, and the brand new island he made last show.",
      ...NARRATOR,
    },
    co_03_sunny: { text: "GOOD MORNING, EVERYBODY!", ...SUNNY },
    // Series-constant greeting+brag pair, six-for-six, fired intact.
    co_04_sunny: { text: "I invented mornings!", ...SUNNY },
    // TRUE (his heat on the ground is what builds today's storm).
    // Bubble: EVERY BIT OF THAT WARM IS ME.
    co_05_sunny: { text: "Feel that ground? Every bit of that warm is me. Every bit.", ...SUNNY },
    // 0.92. The kids are told he will be right before he is.
    co_06_narrator: {
      text: "It is. Hold on to that thought. By tonight, that warm will have built the biggest thing in the sky, and he is going to want it on the record.",
      ...NARRATOR,
      speed: 0.92,
    },
    // "You're welcome! HA! HA!" — SOURCE, FIRING 1 of 4 (ceiling 8,
    // hard; the phrase is its own standalone clip so the aliases stay
    // byte-identical; firings 2–4 are `sameAs` aliases at `a1_22`,
    // `a3_06`, `rc_10`).
    co_07_sunny: { text: "You're welcome! HA! HA!", ...SUNNY },
    // A small flat grey cloud over the water — the Cloud Hotel exactly
    // as it has always been: drizzle-grey, full of drops hugging
    // specks.
    co_08_narrator: {
      text: "And out over the sea, somebody you have met before drifted in, small and grey, the way she has in every show she has been in.",
      ...NARRATOR,
    },
    // "Different show. Same ___." — the episode's ONE firing ("Same
    // hotel.", fresh blank, 0.92 flat; series blanks now: sun, sky,
    // rain, air, beam, weather, rock, first, hotel). Drip's entrance
    // carries itself; Puff cannot be pointed at; "Same darling." and
    // "Same guest." REJECTED by the synthesis.
    co_09_narrator: { text: "Different show. Same hotel.", ...NARRATOR, speed: 0.92 },
    // Composed, bored to the bone. Bubble: SIX SHOWS. NOT ONE GALA.
    co_10_cloudia: {
      text: "Six shows, darling. Six. Not one gala. Drizzle. I am known for drizzle.",
      ...CLOUDIA,
    },
    // Her want, planted. Bubble: BORN FOR A GALA, DARLING.
    co_11_cloudia: { text: "I was born for a gala, darling.", ...CLOUDIA },
    // 0.92.
    co_12_narrator: {
      text: "Today she gets one. She does not know that yet.",
      ...NARRATOR,
      speed: 0.92,
    },

    // Scene 2 — The window rule, and the first count
    co_13_narrator: {
      text: "By the afternoon the light had gone heavy and yellow. And out past the mountain, a cloud stood up. A tower, with a flat top. The kid went indoors.",
      ...NARRATOR,
    },
    // The single safety sentence, plain, once. Never fear. FLASH — far
    // out at sea, past the volcano: a blue-white zig, ≤6 frames, the
    // sky whites, gone. (She is not named yet; she is named at
    // `a1_46`.) The kid's fingers come up, out of habit, and the
    // Narrator counts with them. A soft grey ring is visible crossing
    // the bay under the count — sound made visible; the count is a
    // chase, never a wait.
    co_14_narrator: {
      text: "Storms are for watching from a window. That is the rule.",
      ...NARRATOR,
    },
    // COUNT SOURCE "One." — the earliest firing; kokoro 1.0; clip + gap
    // = 30f exactly (the production gate).
    co_15_narrator: { text: "One.", ...NARRATOR },
    // COUNT SOURCE "Two." — the earliest firing; kokoro 1.0; clip + gap
    // = 30f exactly (the production gate).
    co_16_narrator: { text: "Two.", ...NARRATOR },
    // COUNT SOURCE "Three." — the earliest firing; kokoro 1.0; clip +
    // gap = 30f exactly (the production gate).
    co_17_narrator: { text: "Three.", ...NARRATOR },
    // COUNT SOURCE "Four." — the earliest firing; kokoro 1.0; clip +
    // gap = 30f exactly (the production gate).
    co_18_narrator: { text: "Four.", ...NARRATOR },
    // COUNT SOURCE "Five." — the earliest firing; kokoro 1.0; clip +
    // gap = 30f exactly (the production gate).
    co_19_narrator: { text: "Five.", ...NARRATOR },
    // COUNT SOURCE "Six." — the earliest firing; kokoro 1.0; clip + gap
    // = 30f exactly (the production gate).
    co_20_narrator: { text: "Six.", ...NARRATOR },
    // COUNT SOURCE "Seven." — the earliest firing; kokoro 1.0; clip +
    // gap = 30f exactly (the production gate).
    co_21_narrator: { text: "Seven.", ...NARRATOR },
    // COUNT SOURCE "Eight." — the earliest firing; kokoro 1.0; clip +
    // gap = 30f exactly (the production gate).
    co_22_narrator: { text: "Eight.", ...NARRATOR },
    // COUNT SOURCE "Nine." — the earliest firing; kokoro 1.0; clip +
    // gap = 30f exactly (the production gate).
    co_23_narrator: { text: "Nine.", ...NARRATOR },
    // HELD BEAT — 30f (1.0s) after `co_24_narrator`. The first count
    // lands alone. (This clip is re-fired byte-identically at the act-
    // one cut, `a1_59` — the same seconds, the same sentence.)
    co_24_narrator: { text: "There he is.", ...NARRATOR },
    // HELD BEAT — 30f (1.0s) after `co_25_narrator`. The ep-5 card may
    // ghost briefly over the sky — print only.
    co_25_narrator: { text: "Last time, somebody asked why thunder is always late.", ...NARRATOR },
    // 0.92. The camera lifts toward the tower. TITLE CARD over the
    // thunderhead: *Boom and the One, Two, Three.*
    co_26_narrator: {
      text: "Everyone says he is. Even the card said so. Let's go and ask him. He is up there.",
      ...NARRATOR,
      speed: 0.92,
    },
    co_27_narrator: { text: "This is the story of the noise that was never late.", ...NARRATOR },

    // Scene 3 — Air in a hurry: a lift at a hotel with no stairs
    // The glue line — act one is the afternoon REWOUND, so the act-one
    // cut (Scene 10) can rejoin the cold open's nine seconds.
    // Deviations ledger.
    a1_01_narrator: {
      text: "That tower was a small grey hotel this morning. Here is how it got up there.",
      ...NARRATOR,
    },
    // Cross-episode rhyme (ep-2 law redeployed), 0.92.
    a1_02_narrator: {
      text: "The ground was hot. The air sitting on the ground got hot. And hot air does the thing it learned in show two. It goes up. Fast.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Ep-1 canon, VERBATIM, as a fresh Abbess recording (a quote, not a
    // chain) — said to the first guest looking for the penthouse.
    a1_03_cloudia: { text: "Darling. There are no stairs.", ...CLOUDIA },
    // HELD BEAT — 30f (1.0s) after `a1_04_puff`. Cloudia takes this in.
    a1_04_puff: { text: "There is now a lift.", ...PUFF },
    // A composed one-word line — the word holds, which is the joke.
    a1_05_cloudia: { text: "Darling.", ...CLOUDIA },
    // "Going up." — CHAIN SOURCE, FIRING 1 of 3 (aliases `a1_12`,
    // `a1_31`; the break is "Going down." `a2_02`, fresh recording,
    // plot-causal). Guests rise. The lift IS the updraft; Puff is the
    // chirpiest lift operator in the sky.
    a1_06_puff: { text: "Going up.", ...PUFF },
    // Precision — true in both halves. Bubble: THE HOT IS ME.
    a1_07_sunny: { text: "The hot is me. The hurry is his.", ...SUNNY },
    a1_08_narrator: { text: "Correct. Both halves.", ...NARRATOR, speed: 0.92 },

    // Scene 4 — A guest checks in
    // CACHE MIGRATION — Drip's standing entrance, FIFTH identical
    // firing (the audibly identical take IS the joke; migration details
    // in the table). No "Different show" firing for her — her entrance
    // carries itself (ep-5 ruling).
    a1_09_drip: { text: "Hi! It's me! I'm the weather!", ...DRIP, emotion: "happy" },
    // A manager who has heard this entrance before, filing it. Bubble:
    // THE WEATHER IS THE MANAGEMENT.
    a1_10_cloudia: { text: "You are a guest, darling. The weather is the management.", ...CLOUDIA },
    // Her want (to be taken as big), planted on "top floor".
    a1_11_drip: { text: "Then I would like the top floor.", ...DRIP },
    // "Going up." — sameAs a1_06_puff
    a1_12_puff: { sameAs: "a1_06_puff" },
    // ---
    a1_13_narrator: { text: "The lift did not have a top floor yet. It made one.", ...NARRATOR },

    // Scene 5 — The hotel goes vertical
    a1_14_narrator: {
      text: "Floors stacked on floors. Ten. Twenty. More. The hotel went up faster than a hotel has any business going, until it wore a flat roof.",
      ...NARRATOR,
    },
    // HELD BEAT — 30f (1.0s) after `a1_15_cloudia`. She looks up at it.
    a1_15_cloudia: { text: "I did not order a flat roof, darling.", ...CLOUDIA },
    // (A's line with "darling" restored — every composed line carries
    // the word. Deviations ledger.)
    a1_16_cloudia: { text: "I shall keep it, darling.", ...CLOUDIA },
    // The anvil's SHAPE named, its reason not (brief).
    a1_17_narrator: {
      text: "Very tall clouds get a flat top. That is the shape of a thunderstorm. You can see one coming from a long way off.",
      ...NARRATOR,
    },
    // From behind the tower — *Sunny interrupts a scene not about him*,
    // firing 1 (true: a hotel is in front of him). Bubble: A HOTEL? IN
    // FRONT OF ME?
    a1_18_sunny: { text: "Hey. HEY. Who put a hotel in front of me?", ...SUNNY },
    a1_19_narrator: { text: "Cloudia. With your help.", ...NARRATOR },
    // Instantly delighted, precise, every clause TRUE. Bubble: THE UP
    // RUNS ON THE HOT!
    a1_20_sunny: {
      text: "Then the hot is mine! And the up is mine! The up runs on the hot!",
      ...SUNNY,
    },
    // The check, 0.92.
    a1_21_narrator: {
      text: "The hot is his. The up is his as well. The hotel is hers.",
      ...NARRATOR,
      speed: 0.92,
    },
    // "You're welcome! HA! HA!" — sameAs co_07_sunny (kokoro alias
    // where kokoro; states intent, locks wording)
    a1_22_sunny: { sameAs: "co_07_sunny" },
    a1_23_cloudia: { text: "We have never had an up, darling.", ...CLOUDIA },
    // Her rapture at owning an up — the gala arriving. Bubble: WE HAVE
    // A PENTHOUSE, DARLING.
    a1_24_cloudia: { text: "Penthouse. We have a penthouse. Darling, I could weep.", ...CLOUDIA },

    // Scene 6 — The penthouse is a freezer; roll call, firing 1
    // Bubble: THE PENTHOUSE IS A FREEZER, DARLING.
    a1_25_cloudia: {
      text: "The penthouse is above the freezing line, darling. I did not put it there. The lift did.",
      ...CLOUDIA,
    },
    // Her want, granted by physics. Bubble: I HAVE NEVER BEEN THIS BIG.
    // ROLL CALL — FIRING 1 (greeting). Series signature, fixed shape:
    // cheerful naming → one flat Narrator line → unbothered, unseasoned
    // button. Nobody replies inside the naming. Crowd fresh (used:
    // raindrops, puffs, colours/copies, seeds, islands). Names, same
    // order both firings: Hail, Hailey, other Hail, Hail the third,
    // Stony.
    a1_26_drip: { text: "I am ice. Look at me. I have never been this big.", ...DRIP },
    // HELD BEAT — 24f (0.8s) after `a1_27_drip` — the beat before the
    // big one; the naming run is split into two clips so the timeline
    // makes the pause (no pause markers). Her locked `happy` IS the
    // roll-call register.
    a1_27_drip: { text: "Hi, Hail! Hi, Hailey! Hi, other Hail! Hi, Hail the third!", ...DRIP },
    a1_28_drip: { text: "Hi, Stony.", ...DRIP },
    // 0.92 flat — the roll-call middle, with the STATIC mechanism
    // INSIDE it, two scenes before the card makes it a sentence.
    // ("Rubbing past" rather than "bumping", on purpose — the MYTH
    // stamp will say clouds do not bump, and the word belongs to it.
    // Deviations ledger.) HELD BEAT — 36f (1.2s) after
    // `a1_29_narrator`.
    a1_29_narrator: {
      text: "Every guest on the top floor is called Hail. They keep rubbing past each other. It builds up.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Button — flat, nothing added (her cast `happy` is unchanged; the
    // button is the stillness in front of it).
    a1_30_drip: { text: "I am one of them now.", ...DRIP },

    // Scene 7 — The crackle (Big Word: STATIC)
    // Full stop, not a question mark — composed to the end. Bubble: WHY
    // IS MY HAIR DOING THAT.
    a1_31_cloudia: { text: "Darling, why is my hair doing that.", ...CLOUDIA },
    // The kid-check, stated plainly once (balloon, hair, dark). No
    // signs, no electrons.
    a1_32_narrator: {
      text: "Every time two icy guests rub past each other, a little crackle rubs off. You have made this crackle yourself. Rub a balloon on your hair, in the dark, and pull it away. That tiny snap is this. That is lightning, tiny.",
      ...NARRATOR,
    },
    // Big Word card: STATIC.
    a1_33_narrator: { text: "It has a name. Static.", ...NARRATOR },
    // Honest charge separation at kid level — top one kind, basement
    // the other, no positive/negative. Bubble: THE LIFT IS FULL OF
    // CRACKLE.
    a1_34_cloudia: {
      text: "The top floor has gone one way, darling. The lobby has gone the other way. And the lift is full of crackle.",
      ...CLOUDIA,
    },
    // *Sunny interrupts a scene not about him*, firing 2 — disclaiming,
    // for the record, with precision (the new steady state demonstrated
    // in reverse; TRUE: the collisions did it). Bubble: THE CRACKLE IS
    // NOT MINE.
    a1_35_sunny: {
      text: "The crackle is not mine. I would like that written down. I did the hot. The guests did the crackle.",
      ...SUNNY,
    },
    // 0.92.
    a1_36_narrator: { text: "Written down.", ...NARRATOR, speed: 0.92 },
    // Scene 8 — Up, down, up — and the gala (reordered after the narration wave: the STATIC card now sits a full scene before LIGHTNING; keys renumbered, clips re-keyed by cache migration)
    // "Going up." — sameAs a1_06_puff
    a1_37_puff: { sameAs: "a1_06_puff" },
    a1_38_drip: { text: "I am bigger again!", ...DRIP },
    // Bubble: YOU ARE ENORMOUS, DARLING.
    a1_39_cloudia: {
      text: "You have been up and down four times, darling. You are enormous.",
      ...CLOUDIA,
    },
    a1_40_narrator: {
      text: "That is how hail grows. Up to the freezer, a coat of ice. Down. Up again, another coat. Stony has been up and down more than anybody.",
      ...NARRATOR,
    },
    // Surveying her building with pride. Bubble: UP. DOWN. UP. THAT IS
    // A HOTEL.
    a1_41_cloudia: { text: "Up, darling. Down. Up. That is a hotel.", ...CLOUDIA },

    // From the penthouse, frozen, thrilled.
    a1_42_drip: { text: "Is this the gala?", ...DRIP },
    // (A's house-phone exchange, grafted here.
    // Deviations ledger.)
    a1_43_cloudia: { text: "Darling. I believe it is.", ...CLOUDIA },
    // Composed, the word still holding under maximum stress — the act's
    // last composed line.
    a1_44_cloudia: { text: "The hotel cannot hold it, darling.", ...CLOUDIA },

    // Scene 9 — Somebody leaves through the wall (Big Word:
    // LIGHTNING); Boom is born
    // CLOUDIA'S BREAK — the ONE line without "darling" (fresh wording
    // per the synthesis; ep 1's "capacity" is spent and does not appear
    // in this episode). Bubble in caps: SOMEBODY LEFT THROUGH THE WALL!
    // — clip lowercase. Big Word card: LIGHTNING (over the white; the
    // card outlasts her by a long way — she was on screen for six
    // frames).
    a1_45_cloudia: { text: "Somebody has just left through the wall!", ...CLOUDIA },
    // Flash introduced by name, once, while the card holds.
    a1_46_narrator: {
      text: "That was Flash. She is the lightning. She does not stay. She does not wait. She has never finished a sentence in her life, because she has never had time to start one.",
      ...NARRATOR,
    },
    a1_47_narrator: {
      text: "And in the same instant, in the same lobby, out of the same crackle, there was somebody else.",
      ...NARRATOR,
    },
    // "Present!" — CHAIN SOURCE, FIRING 1 of 10 (`sameAs` aliases at
    // `a2_12`, `a2_25`, `a2_52`, `a2_57`, `a3_11`, `a3_21`, `a3_38`,
    // `a3_64`; the break is `a2_59` "Present.", fresh). AUDITION LINE 1
    // — the one recording that fires ten times; approve it before
    // anything downstream is built. Fired here at ZERO distance: inside
    // the hotel he is exactly on time, and nobody has told him yet that
    // anywhere else he won't be. The …
    a1_48_boom: { text: "Present!", ...BOOM },
    // Composure RETURNING one line after the break — because a noise is
    // a thing a manager can handle. Strained. Bubble: WHO IS MAKING
    // THAT NOISE?
    a1_49_cloudia: { text: "Darling. Who is making that noise?", ...CLOUDIA },
    // The first run-on. Bubble: I AM BOOM. I AM THE NOISE.
    a1_50_boom: {
      text: "That is me. I am Boom. I am the noise. I was born about one second ago, right here, in your lobby, at the same time as her.",
      ...BOOM,
    },
    // Bubble: SHE DID NOT SIGN THE REGISTER.
    a1_51_cloudia: {
      text: "She did not sign the register, darling. She did not even take a towel.",
      ...CLOUDIA,
    },
    // Boom ↔ Flash, address 1 of 6 — unanswered. He looks for her
    // through the hole in the wall. HELD BEAT — 45f (1.5s) after
    // `a1_52_boom`. The first unanswered address; the zero is the
    // physics.
    a1_52_boom: {
      text: "Where did she go? She was right here. We left at the same time.",
      ...BOOM,
    },
    a1_53_boom: { text: "She is quick.", ...BOOM },
    // He walks out through the wall she left through, at his one pace.
    // Bubble: I ALWAYS LEAVE WHEN SHE LEAVES.
    a1_54_boom: {
      text: "I have to go. I left when she left. I always leave when she leaves. Lovely hotel. Bye.",
      ...BOOM,
    },
    // To an empty lobby. The hotel manager's paperwork instinct
    // surviving a thunderclap.
    a1_55_cloudia: { text: "He did not check in, darling.", ...CLOUDIA },

    // Scene 10 — The same nine seconds, from the window
    // "Seven." — count alias of co_21_narrator (on the 30f grid: clip +
    // gap = 30f)
    a1_56_narrator: { sameAs: "co_21_narrator" },
    // "Eight." — count alias of co_22_narrator (on the 30f grid: clip +
    // gap = 30f)
    a1_57_narrator: { sameAs: "co_22_narrator" },
    // "Nine." — count alias of co_23_narrator (on the 30f grid: clip +
    // gap = 30f)
    a1_58_narrator: { sameAs: "co_23_narrator" },
    // "There he is." — sameAs co_24_narrator (kokoro alias where
    // kokoro; states intent, locks wording). HELD BEAT 30f after this
    // line.
    a1_59_narrator: { sameAs: "co_24_narrator" },
    // The cut IS the lesson; nobody explains it yet. This is the LAST
    // time the Narrator says "late" as if it were true. HELD BEAT — 30f
    // (1.0s) after `a1_60_narrator`.
    a1_60_narrator: {
      text: "Up there, he was on time. Down here, he was nine counts late. Those are the same seconds.",
      ...NARRATOR,
    },
    // 0.9. ACT BREAK.
    a1_61_narrator: { text: "Keep counting.", ...NARRATOR, speed: 0.9 },

    // Scene 11 — The storm arrives before itself; six
    a2_01_narrator: { text: "Inside the hotel, the lift changed its mind.", ...NARRATOR },
    // THE LIFT CHAIN'S BREAK — fresh recording, plot-causal: the
    // downdraft. Cold air out of the bottom of the storm, running ahead
    // along the ground.
    a2_02_puff: { text: "Going down.", ...PUFF },
    // CACHE MIGRATION — Puff's catch-phrase, exactly once, AS the gust
    // front at the kid's window — the series' best-ever fit for it: a
    // physical event at the audience's seat. (NOT his entrance this
    // time — his entrance was the lift; the bible's "his catch-phrase
    // IS his entrance" was an ep-4 ruling, not a law — synthesis
    // ACCEPTED.) The "FEEL" capital lives only in this approved
    // migrated take.
    a2_03_puff: { text: "You can't see me. But you can FEEL me.", ...PUFF, emotion: "happy" },
    a2_04_puff: { text: "I ran ahead. I always run ahead.", ...PUFF },
    // FLASH over the bay (≤6f, same body). Fingers up. The ring rolls
    // in.
    a2_05_narrator: {
      text: "That is the storm, arriving before itself. Cold air falls out of the bottom of the hotel and runs along the ground in front. You can feel a storm before you can hear it.",
      ...NARRATOR,
    },
    // "One." — count alias of co_15_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_06_narrator: { sameAs: "co_15_narrator" },
    // "Two." — count alias of co_16_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_07_narrator: { sameAs: "co_16_narrator" },
    // "Three." — count alias of co_17_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_08_narrator: { sameAs: "co_17_narrator" },
    // "Four." — count alias of co_18_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_09_narrator: { sameAs: "co_18_narrator" },
    // "Five." — count alias of co_19_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_10_narrator: { sameAs: "co_19_narrator" },
    // "Six." — count alias of co_20_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_11_narrator: { sameAs: "co_20_narrator" },
    // "Present!" — sameAs a1_48_boom, firing 2 of 10 (one recording;
    // volume on the instance only)
    a2_12_boom: { sameAs: "a1_48_boom" },
    // The arrival to the wrong-facing room — the episode's repeatable
    // humiliation that never humiliates him. Bubble: I AM OVER HERE.
    a2_13_boom: {
      text: "Why is everybody looking over there? I am over here. I just got here.",
      ...BOOM,
    },
    // Address 2 of 6 — unanswered. To the empty sky where Flash was.
    a2_14_boom: { text: "You could wait. Just once.", ...BOOM },
    // "Six." — count alias of co_20_narrator (dialogue, OFF the grid;
    // wording lock only)
    a2_15_narrator: { sameAs: "co_20_narrator" },
    a2_16_boom: { text: "Six whats?", ...BOOM },
    a2_17_narrator: { text: "Counts.", ...NARRATOR },
    a2_18_boom: { text: "Counts of what?", ...BOOM },
    // 0.92. The Boom ↔ Narrator engine, opened.
    a2_19_narrator: { text: "You.", ...NARRATOR, speed: 0.92 },
    // THEORY 1 of 3 (fresh recordings — a PATTERN, not a chain; firings
    // `a2_20`, `a2_53`, `a3_12`; resolved at the turn, Scene 20).
    // Bubble: IT IS A VERY EARLY PLANET.
    a2_20_boom: {
      text: "I have a theory. Everybody down here is early. The whole planet. It is a very early planet, and I am the only one on it who is on time.",
      ...BOOM,
    },

    // Scene 12 — Blue, first; three
    // 4f approach gap. 1.05, `happy`. Bubble may shout FIRST! in caps;
    // the clip stays lowercase. He is RIGHT — light arrives before
    // sound, every time.
    a2_21_blue: { text: "First! Sorry, sea! I am first!", ...BLUE },
    // "One." — count alias of co_15_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_22_narrator: { sameAs: "co_15_narrator" },
    // "Two." — count alias of co_16_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_23_narrator: { sameAs: "co_16_narrator" },
    // "Three." — count alias of co_17_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_24_narrator: { sameAs: "co_17_narrator" },
    // "Present!" — sameAs a1_48_boom, firing 3 of 10 (one recording;
    // volume on the instance only)
    a2_25_boom: { sameAs: "a1_48_boom" },
    // THE FORMAT, FLIPPED — after three shows of "He was not first. He
    // was very ___, though. Those are different things." 0.92, kind.
    // HELD BEAT — 90f (3.0s) after `a2_26_narrator`. BLUE'S STUNNED
    // BEAT — the series' second (after Sunny's 180f in ep 5). The
    // ricochet STOPS DEAD for the first time in his life; one still
    // frame of Blue is itself the joke. NOTHING enters it.
    a2_26_narrator: {
      text: "He was first. He was also very fast. Today, those are the same thing.",
      ...NARRATOR,
      speed: 0.92,
    },
    a2_27_narrator: {
      text: "He has never been right before. He does not have a line for it.",
      ...NARRATOR,
    },
    // Warmly, to Blue. Bubble: YOU ARE EARLY.
    a2_28_boom: { text: "Hello. You are early. Everybody down here is early.", ...BOOM },
    // The only line he owns. 4f gap.
    a2_29_blue: { text: "I was first!", ...BLUE },
    // Both of them got what they wanted from the same flash. Bubble: I
    // WAS ON TIME. GOOD TEAM.
    a2_30_boom: { text: "And I was on time. Good team.", ...BOOM },
    // "Both true." — SOURCE, FIRING 1 of 2 (kokoro alias at `a3_67`;
    // aliased to lock wording). 0.92.
    a2_31_narrator: { text: "Both true.", ...NARRATOR, speed: 0.92 },
    // Gone, on a fresh first. Three Blue lines, one scene; "I just said
    // that!" (capped) untouched; Indigo OUT.
    a2_32_blue: { text: "First to go home! Sorry, curtain!", ...BLUE },

    // Scene 13 — The ruler, said once
    a2_33_narrator: {
      text: "Here is the bay, as a ruler. Here is the hotel, out at the far end. Here is the window. When Flash goes, she is here before the pen has moved. Boom walks.",
      ...NARRATOR,
    },
    // Inside the geometry. Bubble: SHE IS FASTER THAN EVERYTHING.
    a2_34_boom: {
      text: "I am walking as fast as I can. It is quite fast. She is faster. She is faster than everything.",
      ...BOOM,
    },
    a2_35_narrator: { text: "You were one kilometre away.", ...NARRATOR },
    a2_36_boom: { text: "I am a kilometre?", ...BOOM },
    a2_37_narrator: { text: "You were. You are closer now.", ...NARRATOR },
    // THE LESSON, said ONCE, plainly (world rule 16). Rule stamp: LIGHT
    // IS FAST. SOUND IS SLOW.
    a2_38_narrator: {
      text: "Lightning and thunder happen at the same time, in the same place. You see the flash straight away, because light is fast. You hear the boom later, because sound is slow. The gap is not lateness. It is distance.",
      ...NARRATOR,
    },
    // The parent aside, ONCE, logged for Mike (units call in the
    // decision log). Honest to the word "about" (2.9 s/km; 4.7 s/mile).
    a2_39_narrator: {
      text: "About three counts for every kilometre. Or, if you count in miles, about five seconds a mile.",
      ...NARRATOR,
    },
    // The synthesis's own wording (B's "four frames behind" REJECTED —
    // frames are not a word for a six-year-old). This is the script
    // saying out loud that Boom's gap is not an identity gap.
    a2_40_narrator: {
      text: "Blue's gap is who he is. Boom's gap is how far away he is. It changes.",
      ...NARRATOR,
    },
    // HELD BEAT — 30f (1.0s) after `a2_41_boom`. He considers the word.
    a2_41_boom: { text: "Distance.", ...BOOM },
    a2_42_boom: { text: "I have a lot of that.", ...BOOM },

    // Scene 14 — The house phone (two frames)
    a2_43_boom: { text: "Everybody keeps counting at me.", ...BOOM },
    // Bubble: HE WAS BORN IN IT, DARLING.
    a2_44_cloudia: {
      text: "He has never once been late to my hotel, darling. He was born in it.",
      ...CLOUDIA,
    },
    a2_45_narrator: { text: "From the window, he is three counts behind.", ...NARRATOR },
    // A's best line — the two frames of reference meeting over a house
    // phone; Cloudia right without noticing. Bubble: THEN THE WINDOW IS
    // FAR, DARLING. HELD BEAT — 36f (1.2s) after `a2_46_cloudia`. The
    // Narrator has to think about it.
    a2_46_cloudia: { text: "Then the window is far, darling.", ...CLOUDIA },
    // 0.9. (A wrote "...Yes." — the dots are the held beat; the clip
    // has none.)
    a2_47_narrator: { text: "Yes.", ...NARRATOR, speed: 0.9 },
    // *Sunny interrupts a scene not about him*, firing 3 — true in
    // every clause, from behind a cloud he built. Kokoro — caps legal.
    // Bubble: THE CLOUD IS IN THE WAY!
    a2_48_sunny: {
      text: "I AM STILL UP HERE! THE CLOUD IS IN THE WAY! THE HEAT THAT BUILT THE CLOUD IS MINE!",
      ...SUNNY,
    },
    a2_49_narrator: { text: "All true. He is behind a cloud he built.", ...NARRATOR },

    // Scene 15 — Two. One.
    // "One." — count alias of co_15_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_50_narrator: { sameAs: "co_15_narrator" },
    // "Two." — count alias of co_16_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_51_narrator: { sameAs: "co_16_narrator" },
    // "Present!" — sameAs a1_48_boom, firing 4 of 10 (one recording;
    // volume on the instance only)
    a2_52_boom: { sameAs: "a1_48_boom" },
    // THEORY 2 of 3 — half right. Bubble: THE GROUND IS MOVING.
    a2_53_boom: {
      text: "Two! I am catching up! My theory is this. The ground is moving.",
      ...BOOM,
    },
    // 0.92. Physics guard: the count shrinks because the STORM moves,
    // never because Boom speeds up — he is never allowed to be the
    // thing that changed.
    a2_54_narrator: {
      text: "Half right. The hotel is moving. You are coming with it.",
      ...NARRATOR,
      speed: 0.92,
    },
    // FLASH across the sky. One finger.
    a2_55_boom: { text: "I will take it.", ...BOOM },
    // "One." — count alias of co_15_narrator (on the 30f grid: clip +
    // gap = 30f)
    a2_56_narrator: { sameAs: "co_15_narrator" },
    // "Present!" — sameAs a1_48_boom, firing 5 of 10 (one recording;
    // volume on the instance only)
    a2_57_boom: { sameAs: "a1_48_boom" },
    // Bubble: ONE IS NEARLY NONE.
    a2_58_boom: { text: "One is nearly none. Nearly none. I am nearly there.", ...BOOM },

    // Scene 16 — Zero. The break
    // THE BREAK — fresh recording, full stop, no shout. `auto`, 1.0
    // (the synthesis's §4 ruling — sound has one speed — overrides the
    // §2 "0.95"; deviations ledger). `auto` is seasoning departure 1 of
    // 2 — stage direction: for the first time in his life the room is
    // already looking at him; there is nothing to announce. The loudest
    // character in the sky, at his quietest, one frame after the
    // loudest noise in the episode. HELD …
    a2_59_boom: { text: "Present.", ...BOOM, emotion: "auto" },
    // 0.9 — the Narrator's flattest line in the episode. She never says
    // "together"; she says this. HELD BEAT — 30f (1.0s) after
    // `a2_60_narrator`.
    a2_60_narrator: { text: "I did not get to one.", ...NARRATOR, speed: 0.9 },
    // His longest proud run-on — AUDITION LINE 2. 1.0, `happy`,
    // swelling. Bubble: THAT IS WHAT ON TIME SOUNDS LIKE (six words).
    // He turns to her — HELD BEAT — 45f (1.5s) after `a2_61_boom`.
    // Address 3 of 6 — unanswered: the turn to her IS the address; she
    // has already left. The one time he sees her arrive, and she still
    // goes first.
    a2_61_boom: {
      text: "You did not need to! Did you see that? She went and I went and there was no counting at all, not even a one, and nobody looked over there first, because there was no over there, there was only here, and that is on time. That is what it sounds like.",
      ...BOOM,
    },
    // Flat, from the words and the hold (cast `happy` — the two `auto`
    // lines are the break and the turn; see deviations ledger). CUT to
    // the coastal wide: the volcano on the horizon, summit lit, the
    // island beside him, the storm over the house in the distance. 48f
    // approach gap (identity — the mountain deciding to move). Bubble
    // from the MOUTH.
    a2_62_boom: { text: "She has gone again.", ...BOOM },
    // THE VOLCANO'S ONE LINE — CUTTABLE. `Elegant_Man`, −6, 0.9,
    // `auto`. The clip text has no leading ellipsis; the 48f approach
    // gap IS the dots (B's words, A's placement). Boom BEAMS — no clip,
    // no bubble; the volcano is never answered into banter.
    a2_63_volcano: { text: "Louder than me. Well done.", ...VOLCANO },
    // The translation — CUTTABLE as a pair with `a2_63`.
    a2_64_narrator: { text: "Well done, from a volcano, is enormous.", ...NARRATOR },
    // From the lobby directly overhead — the hotel's pride. Bubble:
    // THAT IS MY NOISE, DARLING.
    a2_65_cloudia: { text: "That is my noise, darling. He was born in my lobby.", ...CLOUDIA },
    // Hail begins to fall on the lawn, seen from the window — big,
    // bouncing on grass, nobody under it. The grandest check-out proper
    // is Scene 18.
    a2_66_narrator: {
      text: "And up in the penthouse, the ice remembered gravity. The check-out had begun.",
      ...NARRATOR,
    },

    // Scene 17 — The myth, and the Big Word THUNDER
    a2_67_narrator: {
      text: "Some people say thunder is the sound of clouds bumping into each other.",
      ...NARRATOR,
    },
    // Composed, wounded. Bubble: WE DO NOT BUMP. WE MINGLE. (Caps in
    // the bubble only; clip lowercase.) The red MYTH stamp thuds on —
    // CLOUDS DO NOT BUMP. — and cracks. HELD BEAT — 36f (1.2s) on the
    // cracked stamp (house device: thud, crack, silence).
    a2_68_cloudia: { text: "Darling. We do not bump. We mingle.", ...CLOUDIA },
    a2_69_narrator: { text: "Big myth. Busted.", ...NARRATOR },
    // Her ep-1 canon ("a zillion tiny water drops, floating together")
    // inside the defence. Bubble: TWO OF THEM MAKE NO SOUND. The two
    // small clouds on the horizon drift together and touch. HELD BEAT —
    // 36f (1.2s) after `a2_70_cloudia`. Nothing.
    a2_70_cloudia: {
      text: "A cloud is a zillion tiny water drops, floating together, darling. Two of them meeting make no sound at all. None. I have listened for years.",
      ...CLOUDIA,
    },
    a2_71_cloudia: { text: "Nothing, darling.", ...CLOUDIA },
    // The honest mechanism inside the defence. Bubble: THE BANG IS HER.
    a2_72_cloudia: {
      text: "Upstairs, yes, the guests rub shoulders, darling. That is the crackle. But the bang is her.",
      ...CLOUDIA,
    },
    a2_73_narrator: {
      text: "The lightning makes the air around it so hot, so fast, that the air jumps out of the way all at once. That jump is him. Same instant. Same place. One thing. You see her. You hear him.",
      ...NARRATOR,
    },
    // Big Word card: THUNDER — fired now that he is understood, more
    // than a minute after LIGHTNING.
    a2_74_narrator: { text: "He has a name too. Thunder.", ...NARRATOR },
    a2_75_boom: { text: "That is me. I am the jump.", ...BOOM },
    // An ECHO of the volcano's ep-5 "This is the loud part." — not a
    // quote; he has his own sentence. Bubble: THE LOUD PART IS THE BEST
    // PART (six). ACT BREAK.
    a2_76_boom: { text: "The loud part is the best part.", ...BOOM },

    // Scene 18 — The grandest check-out
    // 0.92 — the no-stairs joke paid a second time (A's Narrator line).
    a3_01_narrator: {
      text: "Every guest on the top floor checked out at the same time. Through the floor. There are no stairs.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Ep-1 canon, VERBATIM, as a fresh Abbess recording — the one
    // composed line without "darling" that is NOT a break: it is a
    // quote of her own canon, unaltered (A's variant REJECTED). In her
    // glory and her grief.
    a3_02_cloudia: { text: "I love my guests. I hate gravity.", ...CLOUDIA },
    // Bubble: THE GRANDEST CHECK-OUT IN HISTORY.
    a3_03_cloudia: {
      text: "Thousands, darling. All at once. All downward. The grandest check-out in the history of the trade.",
      ...CLOUDIA,
    },
    // *Sunny interrupts a scene not about him*, firing 4 — TRUE (the
    // rain is water his heat evaporated that morning). Bubble: THAT
    // RAIN IS MY WATER!
    a3_04_sunny: { text: "THAT RAIN IS MY WATER! I LIFTED IT THIS MORNING!", ...SUNNY },
    a3_05_narrator: { text: "He did.", ...NARRATOR },
    // "You're welcome! HA! HA!" — sameAs co_07_sunny (kokoro alias
    // where kokoro; states intent, locks wording)
    a3_06_sunny: { sameAs: "co_07_sunny" },
    // THE TRAVEL-SIZED VARIANT — IN once, CUTTABLE (synthesis: A over
    // B; Claire's channel, a five-show callback). Honest: small hail
    // melts on the way down; she lands as a drop. Fan service in her
    // shape. One-line cut.
    a3_07_drip: { text: "I am travel-sized again.", ...DRIP },

    // Scene 19 — Three again
    // "One." — count alias of co_15_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_08_narrator: { sameAs: "co_15_narrator" },
    // "Two." — count alias of co_16_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_09_narrator: { sameAs: "co_16_narrator" },
    // "Three." — count alias of co_17_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_10_narrator: { sameAs: "co_17_narrator" },
    // "Present!" — sameAs a1_48_boom, firing 6 of 10 (one recording;
    // volume on the instance only)
    a3_11_boom: { sameAs: "a1_48_boom" },
    // THEORY 3 of 3 — "I have not changed one thing" (true — the hotel
    // has). Dismay played as comedy inside delight, never hurt. Bubble:
    // I HAVE NOT CHANGED ONE THING.
    a3_12_boom: {
      text: "Three! I was at none a minute ago. I have not done anything differently. I have not changed one thing. I left exactly when she left. I always leave exactly when she leaves.",
      ...BOOM,
    },
    // Address 4 of 6 — unanswered. To the sky where she was. (B's em-
    // dash tail is a split clip — deviations ledger.) HELD BEAT — 24f
    // (0.8s) after `a3_13_boom`.
    a3_13_boom: { text: "Didn't I?", ...BOOM },
    // Kind, 0.92.
    a3_14_narrator: { text: "You did.", ...NARRATOR, speed: 0.92 },

    // Scene 20 — Six. The turn
    // "One." — count alias of co_15_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_15_narrator: { sameAs: "co_15_narrator" },
    // "Two." — count alias of co_16_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_16_narrator: { sameAs: "co_16_narrator" },
    // "Three." — count alias of co_17_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_17_narrator: { sameAs: "co_17_narrator" },
    // "Four." — count alias of co_18_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_18_narrator: { sameAs: "co_18_narrator" },
    // "Five." — count alias of co_19_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_19_narrator: { sameAs: "co_19_narrator" },
    // "Six." — count alias of co_20_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_20_narrator: { sameAs: "co_20_narrator" },
    // "Present!" — sameAs a1_48_boom, firing 7 of 10 (one recording;
    // volume on the instance only)
    a3_21_boom: { sameAs: "a1_48_boom" },
    a3_22_narrator: {
      text: "Six. Two kilometres. You have not changed. The hotel is leaving, and you are getting far.",
      ...NARRATOR,
    },
    // His working-out, in his own register — a run-on, not a lesson
    // voice (B's wording with A's "Nobody has ever counted how far I am
    // before." folded in, per the synthesis). Bubble: I WAS NEVER LATE.
    // I WAS FAR. (six)
    a3_23_boom: {
      text: "So it was never late. Not once. Not one time in my whole life. I was far. Far is a completely different thing. Far is a number. Nobody has ever counted how far I am before.",
      ...BOOM,
    },
    // Address 5 of 6 — unanswered. HELD BEAT — 36f (1.2s) after
    // `a3_24_boom`. She has gone, as ever.
    a3_24_boom: { text: "Flash. Far is a number. Did you hear that?", ...BOOM },
    // A's line, landing once, at the turn — the sweetness made
    // explicit. Cast `happy`: fond, not sad. Bubble: I TELL HER
    // EVERYTHING ANYWAY.
    a3_25_boom: { text: "She is always gone. I tell her everything anyway.", ...BOOM },
    // Rule stamp: THREE COUNTS = ONE KILOMETRE.
    a3_26_narrator: {
      text: "Three counts for every kilometre. You are the only thing in this show a kid can measure with their fingers.",
      ...NARRATOR,
    },
    // THE TURN — AUDITION LINE 3. The same word he has shouted all
    // episode, said softly, now means where he is. Fresh recording,
    // `auto` (seasoning departure 2 of 2 — stage direction: said to the
    // kid, warm; an instruction, not a concession), 1.0 (the §4 ruling:
    // sound has one speed). Must land warm, not defeated. HELD BEAT —
    // 60f (2.0s) after `a3_27_boom`. The turn. Nothing enters.
    a3_27_boom: { text: "Count me.", ...BOOM, emotion: "auto" },
    // 0.92. No moral is stated by anyone; he just changes what he is
    // proud of, and his pride is louder than before.
    a3_28_narrator: { text: "We will.", ...NARRATOR, speed: 0.92 },

    // Scene 21 — Nine. The rumble
    // "One." — count alias of co_15_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_29_narrator: { sameAs: "co_15_narrator" },
    // "Two." — count alias of co_16_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_30_narrator: { sameAs: "co_16_narrator" },
    // "Three." — count alias of co_17_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_31_narrator: { sameAs: "co_17_narrator" },
    // "Four." — count alias of co_18_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_32_narrator: { sameAs: "co_18_narrator" },
    // "Five." — count alias of co_19_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_33_narrator: { sameAs: "co_19_narrator" },
    // "Six." — count alias of co_20_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_34_narrator: { sameAs: "co_20_narrator" },
    // "Seven." — count alias of co_21_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_35_narrator: { sameAs: "co_21_narrator" },
    // "Eight." — count alias of co_22_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_36_narrator: { sameAs: "co_22_narrator" },
    // "Nine." — count alias of co_23_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_37_narrator: { sameAs: "co_23_narrator" },
    // "Present!" — sameAs a1_48_boom, firing 8 of 10 (one recording;
    // volume on the instance only)
    a3_38_boom: { sameAs: "a1_48_boom" },
    a3_39_narrator: {
      text: "That is still him. All of him. He is kilometres long, and the near end of him gets here before the far end does. The hills hand him back as well. One bang arrives as a long grumble.",
      ...NARRATOR,
    },
    // Proud. From the distance.
    a3_40_boom: { text: "I am very long.", ...BOOM },
    a3_41_boom: { text: "I like the hills. They let me arrive twice.", ...BOOM },
    // Address 6 of 6 — unanswered. To a sky she left nine seconds ago.
    a3_42_boom: { text: "Did you see that one? That was a good one.", ...BOOM },
    // "Rumble" used as the pedagogy, once — his distance, not his name.
    a3_43_narrator: { text: "From here, he is a rumble. He is still all Boom.", ...NARRATOR },
    // CUTTABLE — ties the cold-open SFX rumble to him retroactively (an
    // invention; deviations ledger).
    a3_44_narrator: {
      text: "He was a rumble this afternoon as well, on the very first count. You had not met him yet.",
      ...NARRATOR,
    },

    // Scene 22 — Roll call, firing 2: goodbye on the lawn
    // *Sunny interrupts a scene not about him*, firing 5 — true in
    // every clause. Bubble: I NEVER LEFT!
    a3_45_sunny: { text: "I am back! I never left! Something was in front of me!", ...SUNNY },
    // ROLL CALL — FIRING 2 (goodbye). Same five names, same order as
    // the greeting (series law); one clip this time — the Stony beat
    // already landed in act one, and a goodbye run reads as one breath
    // (ep-5 precedent). At 1.0.
    a3_46_narrator: { text: "All true.", ...NARRATOR },
    a3_47_drip: {
      text: "Bye, Hail. Bye, Hailey. Bye, other Hail. Bye, Hail the third. Bye, Stony.",
      ...DRIP,
    },
    // 0.92 flat — the goodbye middle, with the second lesson inside it
    // (hail is frozen rain, and rain is Drip). HELD BEAT — 36f (1.2s)
    // after `a3_48_narrator`.
    a3_48_narrator: {
      text: "They are all melting. By morning, every one of them will be called Puddle.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Button — flat, nothing added; B's wording per the synthesis.
    a3_49_drip: { text: "I was big for an hour. It was lovely.", ...DRIP },

    // Scene 23 — Ten fingers, and nothing
    // FLASH, far past the volcano. Fingers.
    a3_50_narrator: {
      text: "The storm walked on for a long time. Here is the last one.",
      ...NARRATOR,
    },
    // "One." — count alias of co_15_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_51_narrator: { sameAs: "co_15_narrator" },
    // "Two." — count alias of co_16_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_52_narrator: { sameAs: "co_16_narrator" },
    // "Three." — count alias of co_17_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_53_narrator: { sameAs: "co_17_narrator" },
    // "Four." — count alias of co_18_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_54_narrator: { sameAs: "co_18_narrator" },
    // "Five." — count alias of co_19_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_55_narrator: { sameAs: "co_19_narrator" },
    // "Six." — count alias of co_20_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_56_narrator: { sameAs: "co_20_narrator" },
    // "Seven." — count alias of co_21_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_57_narrator: { sameAs: "co_21_narrator" },
    // "Eight." — count alias of co_22_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_58_narrator: { sameAs: "co_22_narrator" },
    // "Nine." — count alias of co_23_narrator (on the 30f grid: clip +
    // gap = 30f)
    a3_59_narrator: { sameAs: "co_23_narrator" },
    // COUNT SOURCE "Ten." — the earliest firing; kokoro 1.0; clip + gap
    // = 30f exactly (the production gate). `a3_51`–`a3_59` `sameAs:
    // co_15`–`co_23`; `a3_60` "Ten." is the TENTH SOURCE recording (its
    // earliest firing). Ten fingers, all up. On the grid.
    a3_60_narrator: { text: "Ten.", ...NARRATOR },
    // HELD BEAT — 120f (4.0s) after `a3_61_narrator`. The kid holds ten
    // fingers at a window. Nothing enters. Nothing arrives. The lit
    // summit, the island, the wet lawn.
    a3_61_narrator: { text: "That is all the fingers.", ...NARRATOR },
    // 0.9. Physics guard (B): a ten-count flash is NEVER silent (that
    // is three kilometres and audible) — the no-boom flash is the more-
    // than-fifteen- kilometres one, and the Narrator says so. HELD BEAT
    // — 30f (1.0s) after `a3_62_narrator`.
    a3_62_narrator: {
      text: "Nothing. He is too far to hear now. More than fifteen kilometres. That is forty-five counts.",
      ...NARRATOR,
      speed: 0.9,
    },
    // Forty-five fingers is four and a half kids — the arithmetic is
    // exact (the synthesis's "four and a half MORE kids" would be
    // fifty-five fingers; fixed — deviations ledger). CUT to the hotel,
    // far away, grey-gold. FLASH — and instantly:
    a3_63_narrator: { text: "You would need four and a half kids.", ...NARRATOR },
    // "Present!" — sameAs a1_48_boom, firing 9 of 10 (one recording;
    // volume on the instance only)
    a3_64_boom: { sameAs: "a1_48_boom" },
    // Bubble: MARK HIM PRESENT, DARLING. Back at the window —
    a3_65_cloudia: { text: "Mark him present, darling.", ...CLOUDIA },
    // HELD BEAT — 30f (1.0s) after `a3_66_narrator`.
    a3_66_narrator: {
      text: "At the hotel, he is on time. From here, he is too far to hear.",
      ...NARRATOR,
    },
    // "Both true." — sameAs a2_31_narrator (kokoro alias where kokoro;
    // states intent, locks wording). HELD BEAT 30f after this line.
    a3_67_narrator: { sameAs: "a2_31_narrator" },
    // 0.9. ACT OUT.
    a3_68_narrator: { text: "That is the whole thing.", ...NARRATOR, speed: 0.9 },

    // Scene 24 — The chant
    rc_01_narrator: { text: "So. Three words, in the order they happened.", ...NARRATOR },
    rc_02_narrator: { text: "Static!", ...NARRATOR },
    rc_03_narrator: { text: "Lightning!", ...NARRATOR },
    // Three one-word kokoro clips, one voice (rule 15) — written as
    // three clips so the slams can be timed to the words and Boom's
    // slam can sit a beat behind the last one (deviations ledger). One-
    // word clips are the episode's highest TTS-risk class; fallbacks
    // pre-written in the production notes.
    rc_04_narrator: { text: "Thunder!", ...NARRATOR },
    // Kokoro — the caps are legal there. The single takeaway, said
    // once. ---
    rc_05_narrator: { text: "Thunder is not late. Thunder is FAR.", ...NARRATOR },

    // Scene 25 — The amazing part
    // House opener (eps 2, 3).
    rc_06_narrator: { text: "Now here is the amazing part.", ...NARRATOR },
    // Mind-blower 1 (PRIMARY, world rule 17) — true, checkable, world-
    // scale (about thirty thousand degrees against about five and a
    // half thousand). HELD BEAT — 60f (2.0s) after `rc_07_narrator`.
    // Awe, in silence, BEFORE any button — Sunny visibly hearing it.
    rc_07_narrator: {
      text: "A lightning bolt is about five times hotter than the surface of the Sun.",
      ...NARRATOR,
    },
    // Precision intact — both claims TRUE. Kokoro; caps legal. Bubble:
    // ONLY THE SURFACE.
    rc_08_sunny: { text: "The surface. Only the surface. Inside, I am MUCH hotter.", ...SUNNY },
    // The Narrator checks; it holds (the Sun's core is about fifteen
    // million degrees).
    rc_09_narrator: {
      text: "I checked. Fifteen million degrees, in the middle. It holds.",
      ...NARRATOR,
    },
    // "You're welcome! HA! HA!" — sameAs co_07_sunny (kokoro alias
    // where kokoro; states intent, locks wording)
    rc_10_sunny: { sameAs: "co_07_sunny" },
    // Mind-blower 2 (SECONDARY, Math-bait — the look-it-up slot).
    // Catatumbo lightning; pronounceable; true.
    rc_11_narrator: {
      text: "There is a lake in Venezuela, called Lake Maracaibo, where there is a thunderstorm more than a hundred nights a year. The lightning capital of the world.",
      ...NARRATOR,
    },
    // From far. B's button.
    rc_12_boom: { text: "I know. I am busy.", ...BOOM },
    rc_13_narrator: {
      text: "And two small ones, about you. You have never heard a thunder that was not already over.",
      ...NARRATOR,
    },
    // The quietest mind-blower in the series, in the hero's own words
    // (A, per the synthesis). Bubble: I HAVE ALREADY HAPPENED.
    rc_14_boom: { text: "By the time you hear me, I have already happened.", ...BOOM },
    // The second viewer fact (B's wording). Neither viewer fact
    // discharges the rule alone; the Sun does. ---
    rc_15_narrator: {
      text: "And the crackle on your balloon is him, tiny. Count that one. You will not need any fingers.",
      ...NARRATOR,
    },

    // Scene 26 — End card: the moon
    // 0.9. The ep-7 tease (TOP-LOGGED FOR MIKE — a tease is an audience
    // promise): the moon, per the synthesis — the picture already
    // exists; the Earth's-shadow misconception is rule-18 gold; thirty
    // nightly checks; two canon plants (ep 3's control experiment, ep
    // 4's "Look up. That's me."). Sea salt is the logged alternate; B's
    // one-line salt arm is NOT fired. Mike overturns EARLY if he
    // prefers salt: one card + two kokoro …
    rc_16_narrator: { text: "Next time. Why does the moon change shape?", ...NARRATOR, speed: 0.9 },
    // From below the horizon, muffled — TRUE (the light on the moon is
    // his; the shape is where you are standing). Kokoro; caps legal.
    rc_17_sunny: { text: "I CAN ANSWER THAT ONE!", ...SUNNY },
    // 0.92. The episode's last spoken line. Last picture: one more far,
    // silent flash out past the island. The kid at the window holds up
    // ten fingers anyway — and waves. The lit summit, the island, the
    // half moon. ---
    rc_18_narrator: { text: "He can. He will.", ...NARRATOR, speed: 0.92 },
  },
};
