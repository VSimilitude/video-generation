// Narration script for "Ember and the Mountain That Said Good Morning" —
// Little Big World, episode five. Topic: volcanoes and the rock cycle — the
// ground is not finished. Audience: six-year-olds. Run
// `npm run narration -- --video volcano` after editing; unchanged lines are
// served from cache.
//
// FORMAT
// Every line is an object so each character keeps its own voice. The
// file-level `voice` / `speed` are the house default (the Narrator);
// character lines override per line.
//
//   Narrator  kokoro   af_heart         1.0   warm storyteller, returning.
//                                             House flat 0.92, deadpan floor
//                                             0.9. Voice only — no body, ever
//   Ember     minimax  * NEW VOICE *    1.1   our hero. A brand-new drop of
//                                             lava, one minute old at her
//                                             first line. Drops to 1.0 from
//                                             a3_65 on — the arc is audible.
//                                             See the EMBER block
//   The volcano
//             minimax  Elegant_Man      0.9   pitch -6. Reserved by Mike
//                                             since ep 2, FIRST USE. Exactly
//                                             seven lines, every one a tent
//                                             pole. `auto` forever — the
//                                             butler read is the voice's job
//   Rock      minimax  Deep_Voice_Man   0.85  returning ep-2 one-liner,
//                                             promoted to mentor. `happy` on
//                                             every line (locked casting).
//                                             Ep-2 keying was `_narrator`
//                                             (legacy); ep-5 keys use `_rock`
//   Sunny     kokoro   am_puck          1.0   the Sun, returning at maximum
//                                             altitude — and this is the
//                                             episode he is finally wrong.
//                                             0.9 on a2_41, the stunned line
//   Drip      minimax  Lively_Girl      1.0   returning ep-1 hero, `happy`
//                                             on every line (locked casting);
//                                             demolition crew
//   Puff      minimax  Exuberant_Girl   1.0   returning ep-2 hero; the other
//                                             half of the weather, and the
//                                             loop's courier. Default `auto`,
//                                             zero seasoned lines
//   Pip       minimax  Inspirational_girl 1.0 one-scene cameo, rooted in the
//                                             meadow exactly where ep 4 left
//                                             her. ZERO emotion fields, zero
//                                             pause markers, by design
//   Blue      minimax  Decent_Boy       1.05  one scene, two lines, `happy`
//                                             (locked casting). Wrong about
//                                             "first" twice; payoff NOT fired
//   Violet    —        —                —     NEVER. One silent garnish
//                                             firing (script Scene 22)
//
// Silent, and staying silent: the kid (silhouette, fifth canon episode
// running), Violet, Pipsqueak (the seed that travels), the magma crowd and
// the island chain (crowd-with-faces rule — comedy cast that costs nothing).
//
// TWO ENGINES. The Narrator and Sunny stay on kokoro — free, local,
// re-synthesized the instant a line is reworded. Kokoro means no `emotion`
// field ever (the generator has nowhere to put it), no pause markers ever
// (hard error), no stretched vowels. Everybody else with a body and a line is
// MiniMax speech-2.8-hd (Replicate, ~$0.11/1000 characters), which is paid but
// can act: it takes an `emotion`, a `pitch`, and honours pause markers.
//
//   engine: "minimax", voiceId: "<id>", emotion: "<enum>"
//   emotions: auto happy sad angry fearful disgusted surprised calm fluent
//             neutral
//
// EMOTION IS SEASONING. Ember, Rock, Drip and Blue carry a locked CAST
// emotion (`happy`) on every recording — that is casting, not seasoning. The
// volcano is `auto` forever. Pip carries nothing, deliberately (a seasoned
// deadpan is a sold one). The episode's ONE seasoned field is Ember's
// `surprised` at the skin-over (a3_03), stage direction cited on the line;
// her seasoning budget was 2 and one is left unspent. Ember's deadpan buttons
// (a3_16, a3_54, a3_58, a3_85, a3_87, rc_17) drop to `auto` despite her cast
// `happy` — the STYLE hard rule: the button itself stays unseasoned.
//
// PAUSE MARKERS: THERE ARE NONE IN THIS FILE, ANYWHERE. Every silence in the
// episode is a held beat *between* lines and belongs to `gaps`/`gapFrames` in
// `Video.tsx`, where `script.md` writes each one down with a frame count —
// including the two identity gaps (volcano 48f before EVERY line, a new
// series record; Rock 24f before every line, fixed, never escalated) and the
// series-record 180f hold after a2_40. Where a punchline needs a beat between
// two sentences, the sentences are two clips (a1_22/a1_23, a3_13/a3_14,
// a3_76/a3_77).
//
// EMBER IS PROVISIONALLY CAST. `EMBER_MINIMAX_VOICE` was picked by
// measurement in an overnight audition (see the EMBER block); Mike's ear
// ratifies in the tweak round. Recasting is ONE constant — but a recast after
// generation re-buys her 38 recordings including the chain source "Done!", so the
// audition came first.
//
// SAMEAS DISCIPLINE (world rule 5). Aliases resolve BACKWARDS ONLY, so every
// chain's source is the EARLIEST firing, decided at draft time in script.md:
//   "Done!"                 SOURCE a2_15_ember -> a3_10, a3_22, a3_32
//                           (4 firings at escalating OBJECTS: her crust ->
//                           the first black beach -> the growing island ->
//                           the surfaced island. Semantic, never temporal)
//   "Started."              SOURCE a2_16_rock  -> a3_11, a3_23, a3_33
//                           (byte-identical every time; the dots the
//                           treatments wrote ARE the staged 24f gap)
//   "Ten thousand years."   SOURCE a2_22_rock  -> a3_21, a3_40
//                           (the unmoving countdown; same number in both
//                           directions, building and breaking)
//   Rock's catch-phrase     SOURCE a2_11_rock (a CACHE MIGRATION) -> a3_24
//   "You're welcome! HA! HA!"
//                           SOURCE co_07_sunny -> a3_47, a3_81, rc_14
//                           (kokoro is deterministic — the aliases state
//                           intent and lock the wording; ceiling 8, hard)
// NOT aliased, on purpose: the break (a3_86_rock "Done?" / a3_87_ember
// "Started.") — the question mark and the voice-swap ARE the joke, so both
// are fresh recordings (ep-4 "It will not do." precedent).
//
// CACHE MIGRATION — FOUR CLIPS ARE NOT NEW PURCHASES. Cross-video `sameAs`
// does not exist, so these are cache migrations (copy the mp3 + seed the
// cache entry BEFORE the first generator run; all four are copies, not moves
// — the old episodes keep their files). The fields below are written to match
// the SOURCE line's fields exactly, because the cache hash is
// [model, text, voiceId, emotion, speed(, pitch)] — an "improved" field here
// silently re-buys the take and loses the joke:
//   a2_11_rock  == wind a2_08_narrator  ("Ohh yeah. That is the stuff.",
//               Deep_Voice_Man, happy, 0.85). ONE recording forever. Same
//               take, hotter cause: in ep 2 it was sunshine, here it is a
//               lava flow parking next to him.
//   a3_35_drip  == sky-blue a1_31_drip  ("Hi! It's me! I'm the weather!",
//               Lively_Girl, happy, 1.0). FOURTH identical firing of her
//               standing entrance; the audibly identical take IS the joke.
//   a3_36_puff  == wind a1_40_puff ("You can't see me. But you can FEEL
//               me.", Exuberant_Girl, happy, 1.0). One per appearance. The
//               canon "FEEL" capital is the ONLY capital inside a MiniMax
//               clip in this whole episode — which is precisely why it is
//               migrated and never freshly drawn. (`happy` here is the
//               source take's field, not seasoning: Puff has zero seasoned
//               lines this episode.)
//   a3_74_pip   == plants co_17_pip ("It will do.", Inspirational_girl,
//               auto, 0.9). The ep-5 budget, exactly one re-fire of the ep-4
//               chain source.
//
// Keys are `<act>_<number>_<speaker>` in strict playback order: `co` cold
// open, `a1` downstairs, `a2` the loud part, `a3` the newest place in the
// world, `rc` recap. The screenplay in `script.md` lists which keys each of
// the thirty-one scenes consumes; the two files must be edited together.
// 190 spoken lines: 178 recordings, 12 `sameAs` aliases, 4 of the recordings
// cache-migrated. (a3_49b_narrator added 2026-10-17, the island tweak.)
//
// TEXT-TO-SPEECH RULES OBSERVED HERE
//   - No digits, no percent signs, no ellipses, no stretched vowels, no
//     sound-words. The knock, the rumbles and the ash pop are staged sound
//     design, never narrated.
//   - CAPS mark shouted words on KOKORO lines only (Sunny's greeting, his
//     rocked wake pair, his recovery aria, the Narrator's one "THAT"). NO
//     all-caps emphasis inside MiniMax sentences — the single exception in
//     the episode is the canon "FEEL" in the migrated a3_36. Bubbles keep
//     their caps; clips go lowercase (a3_56 "FIRST!" is drawn, not spoken in
//     caps; the chant bubbles shout, the clips do not).
//   - Ember's emphasis is repetition and speed, never caps. Not one capital
//     in any of her thirty-eight clips.
//   - ONE-WORD MINIMAX CLIPS ARE THIS EPISODE'S HIGHEST TTS RISK: a2_16
//     "Started." (+3 aliases), a2_24 "No.", a3_27 "Rock.", a3_63
//     "Presently.", a3_77 "Good.", a3_86 "Done?", a3_87 "Started.", and the
//     chant rc_02..rc_06. First fix is diagnosis (measure seconds-per-word);
//     a bad draw gets a cache-bust re-roll with identical text. Fallback
//     respellings, only if a word actually breaks:
//       rc_02 "Magma!" -> "Mag ma!"      rc_03 "Lava!" -> "Lah va!"
//       rc_05 "Sand!" / rc_06 "Soil!" survive as whole-shout lines
//       rc_04 "Rock." -> "Rock. Yes." is REFUSED (it kills the flat); his
//       fallback is the Narrator-led chant, whole-unit swap:
//         "Say the journey with me. Magma, to lava, to rock, to sand, to
//          soil." with the bubbles carrying the words in print.
//   - "Islet" must read EYE-lit (a3_13 and rc_15). Fallback respelling
//     "Eye-lit" in the clip (the bubble keeps "Islet"); if it still breaks,
//     the name swaps to "little Island" IN BOTH RUNS — the greeting and the
//     goodbye have to match.
//   - "Kamaehuakanaloa" is NEVER spoken: the Narrator refuses on purpose in
//     rc_12 ("It starts with K. Look it up."), which is also the research
//     hook. Zero TTS exposure, by design.
//   - a2_39 is a BYTE-MATCH of wind a2_45_narrator: kokoro is deterministic,
//     so the same text in the same voice at the same speed is the identical
//     take, for free. Its fields are written out literally below rather than
//     spread from NARRATOR, so nobody "tidies" the 0.95 away and silently
//     re-reads the series' longest-armed fuse.
//
// COMEDY PACING — per-line speed overrides. Every list, roll call and
// deadpan carries a slower `speed` with a comment saying why. The deadpan
// floor in this file is 0.9 (Pip's two stamps, rc_08, rc_18, and Sunny's
// stunned a2_41); the house flat read is 0.92 (both roll-call middles, both
// "Different show. Same ___." firings, every deadpan explainer). Ember's two
// roll-call runs drop from 1.1 to 1.0 so the five names separate, and she
// stays at 1.0 from a3_65 to the end of the episode — settling, not sedation.
// The other half of the rule — held silence on the punchline — lives in
// `script.md`'s stage directions and becomes `gaps` in `Video.tsx`; the
// halves only work together.
const NARRATOR = { voice: "af_heart", speed: 1.0 };

// EMBER — PROVISIONAL, cast by measurement in the overnight audition
// (scratchpad/ep5_ember_audition/MEASUREMENTS.md; Mike's ear ratifies).
// Register target (synthesis, verbatim): small, bright, quick, GLEEFUL —
// indignation played inside delight, never whiny. 1.1 is the suite's fastest
// default and the speed IS the want.
// 2026-08-25 audition (16 voices measured, scratchpad/ep5_ember_audition/
// MEASUREMENTS.md): Playful_Girl wins every axis of the register target —
// fastest real voice (17.9 chars/s at 1.1), 270 Hz (small, and +4.1 st clear
// of the Drip/Puff/Pip 320-380 Hz wall), 6.55 st of glee-to-settled range
// where the prior unaudited pick (Lovely_Girl) measured 0.17 st. Runner-up:
// English_radiant_girl (breathy "Started." risk, flagged).
const EMBER_MINIMAX_VOICE = "Playful_Girl";
const EMBER = {
  engine: "minimax",
  voiceId: EMBER_MINIMAX_VOICE,
  emotion: "happy",
  speed: 1.1,
};

// THE VOLCANO — first use of the voice Mike reserved in episode two, held
// silent for three whole episodes so that this one line could land. Exactly
// seven lines all episode; `auto` forever, because the butler register is
// what this casting does at rest. Every line takes a 48f approach gap in
// `Video.tsx` — the mountain deciding to move.
const VOLCANO = {
  engine: "minimax",
  voiceId: "Elegant_Man",
  emotion: "auto",
  pitch: -6,
  speed: 0.9,
};

// ROCK — returning from ep 2 and promoted to mentor. Fields byte-identical
// to wind's ROCK (the migrated catch-phrase depends on it). `happy` on every
// line: complete sincerity, zero irony. Shortest sentences in the show.
const ROCK = {
  engine: "minimax",
  voiceId: "Deep_Voice_Man",
  emotion: "happy",
  speed: 0.85,
};

// SUNNY — returning at maximum altitude, four episodes of zero wrongness
// behind him, and this is the ceremony episode. Kokoro `am_puck`, series
// voice since ep 1: no emotion field, no pause markers, no stretched vowels.
// His stops are words, slower speed, and his face.
const SUNNY = { voice: "am_puck", speed: 1.0 };

// DRIP — ep-1 hero, demolition crew. `happy` on every recording, locked
// casting since ep 2.
const DRIP = { engine: "minimax", voiceId: "Lively_Girl", speed: 1.0 };

// PUFF — ep-2 hero, the other half of the weather and the loop's courier.
// Default `auto`; zero seasoned lines this episode. (His migrated entrance
// carries `happy` because that is the field the ep-2 take was drawn with.)
const PUFF = { engine: "minimax", voiceId: "Exuberant_Girl", speed: 1.0 };

// PIP — ep-4 hero, one-scene cameo, rooted exactly where ep 4 left her.
// Zero emotion fields by design; deadpan floor 0.9 on her stamps.
const PIP = { engine: "minimax", voiceId: "Inspirational_girl", speed: 1.0 };

// BLUE — one scene, two lines. The suite's first >1.0 speed: it is the
// character and the physics.
const BLUE = {
  engine: "minimax",
  voiceId: "Decent_Boy",
  emotion: "happy",
  speed: 1.05,
};

export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    // ---------------------------------------------------------------
    // COLD OPEN — a sandcastle, a knock, an unanswered claim, and the
    // end of the rules
    // ---------------------------------------------------------------

    // Scene 1 — the last quiet morning. The classic coastal wide, the
    // volcano unnamed and unlooked-at for the fourth show running.
    co_01_narrator: {
      text: "This is a story about the ground. The ground under your feet, the ground under this beach, the ground everywhere. Here is the secret about it. It is not finished.",
      ...NARRATOR,
    },
    // The ep-4 debt, NAMED on screen in the first minute: act 3 and the
    // recap pay it. Same grammar as ep 4 collecting ep 3's tease.
    co_02_narrator: {
      text: "Last time, somebody asked what dirt is actually made of. And somebody else said: send it here, I will grade it. That order is still open. Today it gets filled.",
      ...NARRATOR,
    },
    // THE BUILDER PARALLEL, planted — silent, zero cost, pays off at rc_11.
    co_03_narrator: {
      text: "Here is a beach. Here is a kid, building a sandcastle. Remember the sandcastle. It is doing something important.",
      ...NARRATOR,
    },
    // Series-constant greeting+brag pair, five-for-five, fired intact.
    co_04_sunny: { text: "GOOD MORNING, EVERYBODY!", ...SUNNY },
    co_05_sunny: { text: "I invented mornings!", ...SUNNY },
    co_06_sunny: { text: "That lovely warm sand is me! Enjoy the beach!", ...SUNNY },
    // "You're welcome! HA! HA!" — SOURCE, firing 1 of 4 (ceiling 8, hard).
    // Its own standalone clip so the three aliases stay byte-identical.
    co_07_sunny: { text: "You're welcome! HA! HA!", ...SUNNY },
    // The half-claim, planted: "on top" is the exact edge Sunny's precision
    // lands on in Scene 25 (a3_80). House flat 0.92.
    co_08_narrator: {
      text: "The sand was warm. On top. Remember that as well.",
      ...NARRATOR,
      speed: 0.92,
    },

    // Scene 2 — the knock. 30f hold after this line: the wobble, the pat.
    co_09_narrator: { text: "And then the world knocked.", ...NARRATOR },
    // THE BANKED WAKE-CLAIM, CASHED. Banked verbatim since ep 2, saved on
    // purpose twice, and it belonged to the volcano thread all along. Its
    // banked direction: full confidence, no doubt anywhere in it. Not a
    // "You're welcome!" firing — its own phrase, its own single firing.
    // "OH," with the comma — matching the RECORDED ep-1/ep-2 takes byte-for-
    // byte (water-cycle rc_12, wind rc_14), not the bible's "OH!" transcription
    // (fixed there too). Kokoro is deterministic: identical text + fields =
    // the audience hears the exact take that has been banked since ep 2.
    co_10_sunny: { text: "OH, that one is me as well! HA! HA!", ...SUNNY },
    // No verdict, no doubt cast — the claim just sits there, armed, for 36f.
    // The Narrator ALWAYS rules on him; the withheld ruling is the fuse
    // audibly hissing, and it closes at a2_40.
    co_11_narrator: { text: "Nobody had asked. He answered anyway.", ...NARRATOR },

    // Scene 3 — the rules end.
    co_12_narrator: {
      text: "For four shows there has been a mountain on that horizon. Nobody looked at it. Nobody named it. Those were the rules.",
      ...NARRATOR,
    },
    // THE TURN — the camera faces the volcano head on for the first time in
    // five episodes. Flat and short on purpose; the picture does the work.
    co_13_narrator: { text: "The rules are over.", ...NARRATOR, speed: 0.92 },

    // Scene 4 — title, over the mountain.
    co_14_narrator: {
      text: "This is the story of the day the scenery woke up.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // ACT ONE — DOWNSTAIRS. The world's basement, a newborn with
    // opinions, and the first line the scenery has ever spoken.
    // ---------------------------------------------------------------

    // Scene 5 — the world's basement. Cross-section descent; drawn geometry
    // WITH character beats inside it (diagram-sag rule).
    a1_01_narrator: {
      text: "The answer to the dirt question starts a long way down. Under the beach. Under the grass. Under the rock. Down where it glows.",
      ...NARRATOR,
    },
    // Big Word card: MAGMA.
    a1_02_narrator: {
      text: "Deep down, the world is so hot that rock is melted. Melted rock has a name. Magma.",
      ...NARRATOR,
    },
    a1_03_narrator: {
      text: "And here is the important part. That heat is the world's own. It is left over from the day the world was made. It has been down there the whole time.",
      ...NARRATOR,
    },
    // THE CEREMONY, PLANTED — cashed a full act later at a2_36/a2_37. The
    // audience is deputized early on purpose: kids get to be ahead of the
    // Sun. Plain and flat, 0.92.
    a1_04_narrator: {
      text: "It has nothing to do with the sun. Remember I said that.",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_05_narrator: {
      text: "The magma waits in the world's basement. Some of it has been waiting for ten thousand years. Nobody minds.",
      ...NARRATOR,
    },
    // LOAD-BEARING PAIR (showrunner edit-pass ruling, promoted from
    // CUTTABLE): a1_06 + a1_07 are the cross-section stretch's only spoken
    // laugh beat. *Sunny interrupts a scene that is not about him* — one
    // true firing, from a kilometre above, muffled. The offer is genuine.
    a1_06_sunny: { text: "If anyone down there needs light, I am available!", ...SUNNY },
    a1_07_narrator: { text: "Nobody down there needed light.", ...NARRATOR, speed: 0.92 },

    // Scene 6 — Ember, mid-sentence. She enters the series twelve words into
    // a complaint, at maximum velocity. The clip starts lowercase ON PURPOSE.
    a1_08_ember: {
      text: "and another thing. Nobody here has a schedule. I have been alive for one whole minute and nothing has happened.",
      ...EMBER,
    },
    a1_09_narrator: {
      text: "This is Ember. She is one minute old. She has opinions.",
      ...NARRATOR,
    },
    // "___ is broken." — INSPECTOR RUNNER, firing 1 of 3 (a1_10, a1_13,
    // a2_12). Fresh recordings, a pattern not a chain: the words change, the
    // verdict does not. Nobody ever corrects her; the world just holds still
    // until she re-grades it at a3_66.
    a1_10_ember: { text: "Nothing down here moves. It is all broken.", ...EMBER },
    // 48f of nothing after this — the volcano's identity gap fired as pure
    // silence. The Ember/volcano engine is asymmetric by design: many lines
    // aimed at him, two ever answered. The ratio is the joke.
    a1_11_ember: { text: "Hello? Big house? I would like to go outside now.", ...EMBER },
    a1_12_narrator: {
      text: "The mountain heard her. The mountain answers everything. Eventually.",
      ...NARRATOR,
    },

    // Scene 7 — the broken door.
    a1_13_ember: { text: "There is the door. The door is broken.", ...EMBER },
    a1_14_narrator: {
      text: "It was not broken. It was closed. It had been closed for ten thousand years.",
      ...NARRATOR,
    },
    a1_15_ember: { text: "I tried it fast. Now I will try it fast again.", ...EMBER },
    a1_16_narrator: {
      text: "The magma crowd watched her with great interest. Nobody down there had ever been in a hurry before.",
      ...NARRATOR,
    },

    // Scene 8 — warm things rise.
    a1_17_narrator: { text: "Then the whole basement began to move. Up.", ...NARRATOR },
    // Cross-episode rhyme (the ep-2 law, redeployed downstairs), 0.92.
    a1_18_narrator: {
      text: "Warm things rise. You learned that in show two. It is also true downstairs.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Her speed rewarded exactly once, so the act break can take it away.
    a1_19_ember: { text: "Now we are moving. Let's go, let's go, let's go.", ...EMBER },

    // Scene 9 — THE FIRST LINE. Act-one climax and the series event: 45f on
    // the frozen wide, then the volcano's 48f approach gap on top of it.
    // Ninety-three frames of stillness in front of it — that is the point of
    // five episodes of discipline.
    //
    // V1 — the first line the scenery has ever spoken, returning Sunny's
    // greeting four shows late.
    a1_20_volcano: { text: "Good morning. I appear to have overslept.", ...VOLCANO },
    // V2 — one small ash pop ON the button; the butler register confirmed.
    a1_21_volcano: { text: "Do pardon the ash.", ...VOLCANO },
    // The rocked pair. Kokoro, so caps are legal; the em-dash stammer the
    // treatment wrote is carried by the CUT between these two clips instead
    // (a mid-line em-dash is a TTS artifact risk — ep-4 ellipsis precedent).
    a1_22_sunny: { text: "GOOD MORNING?!", ...SUNNY },
    a1_23_sunny: { text: "It said good morning. TO ME!", ...SUNNY },
    a1_24_narrator: {
      text: "The mountain said good morning. It has excellent manners. Hold on to something.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // ACT TWO — THE LOUD PART. The eruption as construction site, the
    // world's slowest traffic jam, and the ceremony four episodes in
    // the making.
    // ---------------------------------------------------------------

    // Scene 10 — the eruption begins. Big Word card: ERUPTION.
    a2_01_narrator: {
      text: "The mountain opened its doors. All of them. At once.",
      ...NARRATOR,
    },
    // V3 — over his own fireworks. The bigger the spectacle, the smaller his
    // apology. This line IS the tone gate: construction, never catastrophe.
    a2_02_volcano: { text: "Do excuse the noise. This is the loud part.", ...VOLCANO },
    a2_03_narrator: {
      text: "He was not exploding. He was building. This is what a construction site sounds like, when the site is the whole world.",
      ...NARRATOR,
    },

    // Scene 11 — Ember out, and renamed mid-flight. The LAVA card slams
    // beside the MAGMA card with one arrow between them.
    a2_04_ember: { text: "Outside! Sky! Everything! All at once!", ...EMBER },
    a2_05_narrator: {
      text: "Inside the mountain, melted rock is called magma. The moment it steps outside, it gets a new name. Lava. Same stuff. New name.",
      ...NARRATOR,
    },
    // The rename gag IS the lesson: the real naming convention, taught as a
    // bureaucracy complaint at terminal velocity.
    a2_06_ember: {
      text: "Nobody told me there was a name change. Was there paperwork? I was busy.",
      ...EMBER,
    },
    a2_07_narrator: {
      text: "There was no paperwork. There never is.",
      ...NARRATOR,
      speed: 0.92,
    },

    // Scene 12 — the traffic jam.
    a2_08_narrator: {
      text: "And then the fastest day of her life ran into the slowest traffic in the world.",
      ...NARRATOR,
    },
    // Physics-honest: flows grow a dark skin, thicken, and stall.
    a2_09_narrator: {
      text: "Lava is slow traffic. The front of the flow grows a dark skin, and thickens, and stalls.",
      ...NARRATOR,
    },
    // "Different show. Same ___." — firing 1 of 2, fresh blank ("rock").
    // Series blanks now: sun, sky, rain, air, beam, weather, rock. 0.92 flat,
    // always.
    a2_10_narrator: {
      text: "Beside the flow, warm at last, sat somebody you have met before. Different show. Same rock.",
      ...NARRATOR,
      speed: 0.92,
    },
    // CACHE MIGRATION — Rock's catch-phrase, ONE recording forever, copied
    // from wind/a2_08_narrator.mp3. Fields must stay byte-identical to
    // wind's ROCK or the generator re-buys the take and the joke dies.
    a2_11_rock: { text: "Ohh yeah. That is the stuff.", ...ROCK },
    // Inspector runner, firing 3 of 3 — the flat "broken" verdict.
    a2_12_ember: { text: "This traffic is broken.", ...EMBER },
    a2_13_rock: { text: "It is resting.", ...ROCK },

    // Scene 13 — the crust; the spine gag debuts.
    a2_14_narrator: {
      text: "And then Ember's edges went dark. She was growing a skin.",
      ...NARRATOR,
    },
    // "Done!" — CHAIN SOURCE, firing 1 of 4. A verdict, not a question: she
    // declares things finished, prematurely, with delight. The three aliases
    // fire at escalating OBJECTS, never at escalating readings.
    a2_15_ember: { text: "Done!", ...EMBER },
    // "Started." — CHAIN SOURCE, firing 1 of 4. Byte-identical every time;
    // the 24f approach gap in front of it is Rock's identity, not the gag's
    // mechanism, so it never escalates either. NO ellipsis in the text: the
    // dots the treatments wrote ARE that staged gap.
    a2_16_rock: { text: "Started.", ...ROCK },
    // Physics-honest: the instant cooling is surface-only, and the show says
    // so out loud (again at a3_04).
    a2_17_narrator: {
      text: "The dark skin is the lava turning back into rock. The outside cools first. The inside stays hot for a long time.",
      ...NARRATOR,
    },
    a2_18_ember: { text: "I decline. I have places to be.", ...EMBER },
    // The episode's thesis as the driest possible correction. 24f between
    // his two sentences; 30f hold after, and nothing enters it.
    a2_19_rock: { text: "You are not going somewhere.", ...ROCK },
    a2_20_rock: { text: "You are becoming somewhere.", ...ROCK },

    // Scene 14 — the unmoving countdown. The fastest voice in the series
    // parked next to the slowest, both completely certain. Bus-stop staging.
    a2_21_ember: { text: "How long until I am a mountain?", ...EMBER },
    // "Ten thousand years." — CHAIN SOURCE, firing 1 of 3 (a3_21, a3_40).
    // Ember never repeats a question — her variety is her speed — so the
    // byte-identical repetition sits on the mentor.
    a2_22_rock: { text: "Ten thousand years.", ...ROCK },
    a2_23_ember: { text: "How long if I hurry?", ...EMBER },
    a2_24_rock: { text: "No.", ...ROCK },
    a2_25_narrator: { text: "That was the whole negotiation.", ...NARRATOR, speed: 0.92 },
    a2_26_rock: { text: "I came out of there.", ...ROCK },
    a2_27_ember: { text: "You were lava?", ...EMBER },
    a2_28_rock: { text: "I was fast once.", ...ROCK },
    a2_29_ember: { text: "How long have you been sitting here?", ...EMBER },
    a2_30_rock: { text: "Since I stopped.", ...ROCK },
    // The rock cycle as a family photograph: she is his childhood, he is her
    // future, sitting right there, content.
    a2_31_narrator: {
      text: "Ember looked at Rock for a long time. Rock is what lava grows up to be. She was looking at her own future. It was very calm.",
      ...NARRATOR,
    },

    // Scene 15 — THE CEREMONY, part one: the claim. The eruption at full
    // glory behind him — the most undeniable picture the claim will ever get.
    a2_32_narrator: {
      text: "The eruption filled the whole sky. It was the biggest thing anybody had ever seen anybody do.",
      ...NARRATOR,
    },
    // Banked verbatim, reserved since episode two. Full confidence. 60f hold
    // after: nobody answers, and the eruption roars politely on.
    a2_33_sunny: { text: "I did that.", ...SUNNY },
    // Banked verbatim. Gently. The verdict pair is spent here, exactly as
    // reserved. 0.92 — it has to land and stop.
    a2_34_narrator: { text: "No. He really didn't.", ...NARRATOR, speed: 0.92 },
    // V4 — the politest correction in series history, with the physics
    // inside the butler register. 48f approach gap, as ever.
    a2_35_volcano: { text: "If I may. The fire is mine. It came with the house.", ...VOLCANO },
    // The Act-1 plant (a1_03/a1_04), cashed.
    a2_36_narrator: {
      text: "He is right. Deep down, the world is still warm from the day it was made. I told you to remember. This is why.",
      ...NARRATOR,
    },
    a2_37_narrator: {
      text: "That heat was never anybody's gift. It is the world's own. It is the one warm thing on this planet that was never his.",
      ...NARRATOR,
    },

    // Scene 16 — THE CEREMONY, part two: the fuse closes. This scene owns
    // the series' longest silence and nothing shares it.
    a2_38_narrator: { text: "A long time ago, I told you something.", ...NARRATOR },
    // THE FUSE — the ep-2 sentence re-spoken BYTE-IDENTICALLY. Kokoro is
    // deterministic, so same text + same voice + same speed = the identical
    // take, for free. These fields are copied literally from wind
    // a2_45_narrator (af_heart, 0.95) and are NOT spread from NARRATOR: at
    // 1.0 this would be a different read of the longest-armed payoff in the
    // series. 36f hold after it — a byte-mirror of the ep-2 gap.
    a2_39_narrator: {
      text: "One day Sunny will be wrong about something.",
      voice: "af_heart",
      speed: 0.95,
    },
    // THE PAYOFF, CLOSED. Then 180f — THE SERIES RECORD (previous 165f).
    // Sunny hangs perfectly still in his stunned beat, the series' first;
    // Ember, for the first time in her life, does not speak. NOTHING enters
    // it. Fallback trim floor 168f: it must stay the longest silence the
    // series has ever held.
    a2_40_narrator: { text: "It is today.", ...NARRATOR, speed: 0.92 },
    // 0.9 — his quiet comes from words and speed only. Kokoro has no other
    // knob, and that is the point: this is Sunny, quiet, not a different Sun.
    a2_41_sunny: { text: "The fire is not mine.", ...SUNNY, speed: 0.9 },
    // The recovery, AS SUNNY, swelling back to full wattage on truths. Every
    // claim in it is individually true. Not a "You're welcome!" firing.
    a2_42_sunny: {
      text: "But the sea that will cool it is warm because of me! The sky it is climbing through is bright because of me!",
      ...SUNNY,
    },
    a2_43_sunny: { text: "The fire is one thing. I am all the other things! HA! HA!", ...SUNNY },
    // Kind, 0.92. His infallibility is dead; his ego is visibly fine.
    a2_44_narrator: { text: "Most other things. He is most other things.", ...NARRATOR, speed: 0.92 },

    // ---------------------------------------------------------------
    // ACT THREE — THE NEWEST PLACE IN THE WORLD. An island gets built,
    // an old rock moves, the weather demolishes something cheerfully,
    // and the loop closes on a seed.
    // ---------------------------------------------------------------

    // Scene 17 — the surge, the sea, and the skin.
    // Physics-honest: stalled flows surge when the crust breaks.
    a3_01_narrator: {
      text: "In the night, the crust on the stalled flow broke. And the flow surged.",
      ...NARRATOR,
    },
    a3_02_ember: { text: "Moving! We are moving! Sea! I am coming to the sea!", ...EMBER },
    // THE EPISODE'S ONE SEASONED FIELD. Stage direction (script.md, Scene
    // 17): *her outside hardens mid-word* — the sea skins her in seconds,
    // and the one instant thing in geology happens to the character who
    // demanded instant. `surprised`, 1 of her budget of 2; the second is
    // held in reserve, unspent. No emotion lead on this scene.
    a3_03_ember: { text: "Wait. Am I rock? Already? That was fast.", ...EMBER, emotion: "surprised" },
    a3_04_narrator: { text: "Cooling is quick. Growing is the slow part.", ...NARRATOR },
    // Physics-honest: the steam is the LAVA's heat. Deliberately never
    // claimed by Sunny — no line in the episode touches it.
    a3_05_narrator: {
      text: "All that steam is the lava's heat, moving into the sea. Under her feet, brand-new rock. Brand-new ground. The newest place in the world.",
      ...NARRATOR,
    },
    // Honest-futility gag: blowing on lava genuinely cools it, immeasurably.
    a3_06_narrator: {
      text: "Ember blew on the next wave of lava, to help it hurry up and be ground. That helped. Nobody can measure how much. But it helped.",
      ...NARRATOR,
    },
    // Physics-honest boulder rafting: a flow is not hot enough for long
    // enough to melt Rock, so he arrives unmelted. Nothing on screen is
    // harmed by anything, anywhere in this episode.
    a3_07_narrator: {
      text: "And the surge had carried Rock all the way down the mountain, riding on top of the flow. Big rocks do not melt on the way. The flow is not hot enough for long enough. It just gives them a ride.",
      ...NARRATOR,
    },
    // The hugest event of his existence, the smallest sentence of the
    // episode. 30f hold after it.
    a3_08_rock: { text: "I moved.", ...ROCK },
    a3_09_narrator: {
      text: "It was the biggest thing that had happened to him in ten thousand years. You can tell, because he mentioned it.",
      ...NARRATOR,
    },
    // Chain firing 2 of 4 — the object escalates (the first black beach),
    // the recording does not.
    a3_10_ember: { sameAs: "a2_15_ember" },
    a3_11_rock: { sameAs: "a2_16_rock" },

    // Scene 18 — ROLL CALL, firing 1 (greeting). Series signature, fixed
    // shape: cheerful naming -> one flat Narrator line -> unbothered,
    // unseasoned button. Nobody replies inside the naming. The variant is
    // the island chain: the archipelago is the volcano's CV, so the joke IS
    // the lesson.
    a3_12_narrator: {
      text: "And from her brand-new rock, Ember saw what the horizon had been hiding all along.",
      ...NARRATOR,
    },
    // Roll-call speed rule: 1.0, below her 1.1 default, so the names
    // separate. Split into two clips so the beat before "Hi, Sandy." is a
    // 24f timeline gap and not a pause marker. "Islet" must read EYE-lit —
    // fallback respelling in the header, and it swaps in BOTH runs or
    // neither.
    a3_13_ember: {
      text: "Hi, Island! Hi, Islet! Hi, other Island! Hi, Island the third!",
      ...EMBER,
      speed: 1.0,
    },
    // Sandy is the sandbar — the erosion lesson hiding inside the naming.
    a3_14_ember: { text: "Hi, Sandy.", ...EMBER, speed: 1.0 },
    // The roll-call middle: one flat Narrator line, 0.92, always.
    a3_15_narrator: {
      text: "Every island down that coast is one of his. He has done this before. Many times. They are all called Island.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Button — `auto`, because buttons stay unseasoned (STYLE deadpan rule).
    // Also the arc's hinge: she has started identifying as the island, out
    // loud, without noticing.
    a3_16_ember: { text: "I am the new one.", ...EMBER, emotion: "auto" },

    // Scene 19 — the island grows. Time passes in NAMED SPANS, never a
    // time-lapse: jump cuts between states, each stamped by the Narrator
    // (the Pip growth-state law, applied to geography).
    a3_17_narrator: {
      text: "The volcano built her island the way he does everything. Layer by layer. Eruption by eruption. Here is one year later.",
      ...NARRATOR,
    },
    a3_18_ember: { text: "Faster. You are building me wrong.", ...EMBER },
    a3_19_narrator: {
      text: "Here is a while later. A while, here, means more than your school will ever ask you to count.",
      ...NARRATOR,
    },
    a3_20_ember: { text: "How long until the island is finished?", ...EMBER },
    // Countdown firing 2 of 3. The countdown never counts down.
    a3_21_rock: { sameAs: "a2_22_rock" },
    // Chain firing 3 of 4 — the growing island.
    a3_22_ember: { sameAs: "a2_15_ember" },
    a3_23_rock: { sameAs: "a2_16_rock" },
    // Catch-phrase firing 2 of 2, an in-episode alias of the ONE migrated
    // recording. In ep 2 nothing happened between his two firings; here an
    // entire island happened. The identical take across a named span IS the
    // joke — constancy is the character.
    a3_24_rock: { sameAs: "a2_11_rock" },
    // The namespace exchange (a deliberate ep-2 roll-call echo). This plants
    // the chant's flat, late "Rock." at rc_04 — Scene 27 is this gag landing.
    a3_25_rock: { text: "You will change names one more time.", ...ROCK },
    a3_26_ember: { text: "To what?", ...EMBER },
    a3_27_rock: { text: "Rock.", ...ROCK },
    a3_28_ember: { text: "That is your name.", ...EMBER },
    a3_29_rock: { text: "It is a very popular name.", ...ROCK },
    // OPTIONAL ASIDE (cuttable, writer's-discretion slot) — the insurance
    // laugh inside the growth spans. True: fingernails grow centimetres a
    // year, big mountains rise millimetres a year.
    a3_30_narrator: {
      text: "While we wait. Your fingernails grow faster than a mountain rises. Look at your hand. It is winning.",
      ...NARRATOR,
    },
    a3_31_narrator: {
      text: "And one day, the steaming mound put its head above the water, and stayed. An island. Brand new. Next to a horizon that had looked the same for four whole shows.",
      ...NARRATOR,
    },
    // Chain firing 4 of 4, final — the surfaced island. Even a
    // finished-looking island is mid-process, which is what arms the break.
    a3_32_ember: { sameAs: "a2_15_ember" },
    a3_33_rock: { sameAs: "a2_16_rock" },

    // Scene 20 — the demolition crew. Rain and wind arrive to take the OLD
    // islands apart, cheerfully. Hard hats.
    a3_34_narrator: {
      text: "Then the weather arrived, to take the old islands apart.",
      ...NARRATOR,
    },
    // CACHE MIGRATION — Drip's standing entrance, FOURTH identical firing,
    // copied from sky-blue/a1_31_drip.mp3. The audibly identical take IS the
    // joke. No "Different show" firing for her: her entrance carries itself.
    a3_35_drip: { text: "Hi! It's me! I'm the weather!", ...DRIP, emotion: "happy" },
    // CACHE MIGRATION — Puff's catch-phrase, exactly once, AS his entrance,
    // copied from wind/a1_40_puff.mp3. An invisible character cannot be
    // pointed at, so his "Different show" stays skipped (ep-4 ruling). The
    // "FEEL" capital lives ONLY in this approved migrated take and never
    // gets a fresh MiniMax draw — the field below is the source take's, not
    // seasoning.
    a3_36_puff: { text: "You can't see me. But you can FEEL me.", ...PUFF, emotion: "happy" },
    // The windup. Then one grain pops off, rolls, stops, and is held 36f.
    a3_37_drip: { text: "We are taking this whole mountain down!", ...DRIP, emotion: "happy" },
    a3_38_narrator: { text: "That was the whole morning's work.", ...NARRATOR, speed: 0.92 },
    a3_39_ember: { text: "How long to break a mountain?", ...EMBER },
    // Countdown firing 3 of 3, final. Same number in both directions:
    // building and breaking run on the same clock. The chain is now closed.
    a3_40_rock: { sameAs: "a2_22_rock" },
    a3_41_narrator: { text: "For once, Rock is being cheerful.", ...NARRATOR, speed: 0.92 },
    a3_42_narrator: {
      text: "Rain, wind, and time break rock into smaller rock, then gravel, then sand. The whole mountain will take about a hundred million years.",
      ...NARRATOR,
    },
    // Physics-honest reconciliation of Rock's constant with the true number.
    // Ten thousand times ten thousand is one hundred million, exactly —
    // Rock's answer becomes the UNIT.
    a3_43_narrator: {
      text: "That is ten thousand years, ten thousand times.",
      ...NARRATOR,
      speed: 0.92,
    },
    a3_44_ember: { text: "That is the worst number I have ever heard.", ...EMBER },
    // Her locked `happy` doing the mismatch: the crew AGREES with the
    // timescale and thinks it is wonderful.
    a3_45_drip: { text: "We know! We love it!", ...DRIP, emotion: "happy" },
    // SUNNY'S PRECISION, step 1 — the recovered half-claim demonstrated on
    // screen. Every word of this one is true: his weather does the crumbling.
    a3_46_sunny: { text: "My rain! My wind! The demolition runs on me!", ...SUNNY },
    a3_47_sunny: { sameAs: "co_07_sunny" },
    a3_48_narrator: { text: "Every word of that one is true.", ...NARRATOR, speed: 0.92 },

    // Scene 21 — what dirt is actually made of. The island chain AS the
    // diagram, made of scenery the show already owns. Big Word card:
    // EROSION, earned.
    a3_49_narrator: {
      text: "Look down the chain of islands. It is the whole story, standing in a row.",
      ...NARRATOR,
    },
    // 2026-10-17 tweak, showrunner ruling (Fable; ep5-decision-log.md, top
    // entry). Kids' hub feedback: Math (8) asked "Are there multiple islands
    // or just one island going through different times" — the honest answer
    // is BOTH, and the cut only implied it. Wording final. Speed 1.0, not the
    // 0.92 flat: both neighbours (a3_49, a3_50) run at the house 1.0, so it
    // matches them. "Yesterday" is deliberate — it sets up a3_55.
    a3_49b_narrator: {
      text: "Lots of islands, and one volcano. He made the newest one yesterday, and the oldest one long, long ago. So walking down the row is like watching one island grow up.",
      ...NARRATOR,
    },
    a3_50_narrator: {
      text: "New islands are black rock. Older islands are sand. And the oldest islands are green. Because sand, mixed with old dead leaves, is soil.",
      ...NARRATOR,
    },
    // The recipe assembled by the two comedians who ARE the recipe — the
    // drawn-geometry stretch keeps its character beats inside it.
    a3_51_drip: { text: "We ground it!", ...DRIP, emotion: "happy" },
    a3_52_puff: { text: "I stirred in the leaves!", ...PUFF },
    a3_53_narrator: {
      text: "And in one crack of one brand-new island, the first pinch of it gathered. The newest island's first soil.",
      ...NARRATOR,
    },
    // `auto` — flat inspector verdict, and a button (deadpan rule).
    a3_54_ember: { text: "It is very small.", ...EMBER, emotion: "auto" },
    a3_55_narrator: { text: "So was the island. Yesterday.", ...NARRATOR, speed: 0.92 },

    // Scene 22 — Blue, first to the newest place in the world (+ Violet,
    // silent at the far frame edge, overlooked on an island that did not
    // exist yesterday).
    // The bubble may shout "FIRST!" in caps; the clip stays lowercase.
    a3_56_blue: { text: "First! Sorry, rock! I am first to the newest place in the world!", ...BLUE },
    // "Different show. Same ___." firing 2 of 2 — fresh blank, and it names
    // the returning LAW rather than the character. Series blanks now eight.
    a3_57_narrator: { text: "Different show. Same first.", ...NARRATOR, speed: 0.92 },
    // `auto`, flat — the resident's trump. 45f hold after it, with Blue
    // frozen mid-ricochet for the whole beat, recalculating.
    a3_58_ember: { text: "I live here. I was here before here was here.", ...EMBER, emotion: "auto" },
    a3_59_blue: { text: "Then I am first to visit! Visiting counts!", ...BLUE },
    // Anti-Sunny seed watered — wrong by residency, wrong by Violet, right
    // about nothing. The payoff is NOT fired: its home is the ep-6 storm.
    a3_60_narrator: {
      text: "He was not first. He was very sure, though. Those are different things.",
      ...NARRATOR,
    },

    // Scene 23 — the turn, held in silence. Ember sits still, voluntarily,
    // for the first time in her life.
    a3_61_narrator: {
      text: "At dusk, the eruption settled down to a glow. And Ember sat still. On purpose. For the first time in her whole life.",
      ...NARRATOR,
    },
    // Still 1.1 — the want, aimed at the mountain, one last time.
    a3_62_ember: { text: "When will I be as big as you?", ...EMBER },
    // V5 — his only reply to Ember all episode. The asymmetric engine pays
    // its one dividend, in one word, after a 48f approach gap.
    a3_63_volcano: { text: "Presently.", ...VOLCANO },
    a3_64_narrator: {
      text: "Presently, from a volcano, means ten thousand years. He is the politest clock in the world.",
      ...NARRATOR,
    },
    // SPEED DROP — 1.0 from this line to the end of the episode. Not slower:
    // settling, not sedation. The arc is audible.
    a3_65_ember: { text: "Everything fast I ever did was over in a second.", ...EMBER, speed: 1.0 },
    // The inspector runner's RESOLUTION: she inspects the slowest thing in
    // the world — herself, now — and files a different report. Nobody ever
    // corrected her.
    a3_66_ember: { text: "I used to be fast. Now I am ten thousand years long.", ...EMBER, speed: 1.0 },
    // Three short sentences, 24f gaps between them, as ever.
    a3_67_rock: { text: "Fast things are small.", ...ROCK },
    a3_68_rock: { text: "Slow things are big.", ...ROCK },
    a3_69_rock: { text: "You are going to be enormous.", ...ROCK },
    // 45f hold after. No moral is stated; she just changes what she is
    // impatient about.
    a3_70_ember: { text: "Then I have already started.", ...EMBER, speed: 1.0 },

    // Scene 24 — the grading. The ep-4 live order, executed. Arrivals stoop
    // to Pip's mark; she never rises, and she takes no steps, ever.
    a3_71_narrator: {
      text: "Far away, in a meadow you know, a live order was still open.",
      ...NARRATOR,
    },
    // 30f hold after: Pip inspects the pinch the way she inspects everything.
    a3_72_puff: { text: "Special delivery. From the newest place in the world.", ...PUFF },
    a3_73_pip: { text: "Fresh mountain. Old leaves. Somebody is building something.", ...PIP },
    // CACHE MIGRATION — the stamp, re-fired ONCE, exactly as the ep-5 budget
    // prescribed: the approved plants/co_17_pip take, copied. Fields match
    // that line (Inspirational_girl, auto, 0.9) or the hash misses and the
    // chain source gets re-rolled. 45f hold after, and THE STAMP LANDS
    // NAKED: the Narrator companion ("It is the highest grade she gives.")
    // is OFF this episode by synthesis ruling. Nothing is said over it.
    a3_74_pip: { text: "It will do.", ...PIP, speed: 0.9 },
    // The dispatch. The loop close is CAUSAL: graded, then sent.
    a3_75_pip: { text: "Pipsqueak. You are up.", ...PIP },
    a3_76_pip: { text: "Dirt is crushed mountain. So my feet are in a mountain.", ...PIP },
    // Her ep-4 riddle ("It's where I keep my feet."), closed in her own
    // register, after a 30f hold. Deadpan floor 0.9.
    a3_77_pip: { text: "Good.", ...PIP, speed: 0.9 },

    // Scene 25 — the garden is ready; the loop closes.
    a3_78_narrator: {
      text: "In the morning, the sun came up over the newest place in the world, and had a good look at it.",
      ...NARRATOR,
    },
    // THE BANKED INVERSION — SPENT. Verbatim, once, at the glowing crack.
    // Sunny's precision, step 2: he does the thing four shows said he never
    // would, and allocates, exactly, proudly. The biggest single reversible
    // call in the episode — a one-line cut restores the bank (and takes
    // a3_82 with it).
    a3_79_sunny: { text: "That is not me.", ...SUNNY },
    // The cold open's "on top" plant (co_08), cashed — the precise
    // allocation as his new steady state.
    a3_80_sunny: { text: "The warm on top is me.", ...SUNNY },
    a3_81_sunny: { sameAs: "co_07_sunny" },
    a3_82_narrator: {
      text: "Exactly right, at last. It only took five shows.",
      ...NARRATOR,
      speed: 0.92,
    },
    // V6 — hands the episode to the loop-closer. ON this line, riding Puff's
    // wind, a single silent pappus seed sails in and settles into the pinch
    // of first soil in Ember's crack.
    a3_83_volcano: { text: "I believe the garden is ready.", ...VOLCANO },
    a3_84_narrator: {
      text: "And a seed from the meadow landed in the first soil of the newest place in the world. New island. First soil. First seed.",
      ...NARRATOR,
    },
    // At 1.0, small and unhurried. `auto` — the quiet warmth is carried by
    // the words; no seasoning spent.
    a3_85_ember: { text: "Welcome. We are new.", ...EMBER, emotion: "auto", speed: 1.0 },

    // Scene 26 — THE BREAK, the last beat of Act Three. Two one-word clips
    // and fifteen minutes of setup.
    // The first question of Rock's life. A NEW recording, not a chain alias:
    // the question mark IS the break. 24f approach gap, as ever, and 24f
    // held after it while Ember performs HIS gap.
    a3_86_rock: { text: "Done?", ...ROCK },
    // Her voice, new recording, `auto`, at 1.0. The reversal is deadpan and
    // the read must land CONTENT, not defeated. 45f hold after it and
    // NOTHING enters that hold — no line, no entrance, no sting.
    a3_87_ember: { text: "Started.", ...EMBER, emotion: "auto", speed: 1.0 },

    // ---------------------------------------------------------------
    // RECAP — the chant, the stamped debt, two true things, a goodbye
    // to a coastline, and a mountain saying good night
    // ---------------------------------------------------------------

    // Scene 27 — the chant, as a relay down the island chain. Five words in
    // four voices: Ember owning both "Magma!" and "Lava!" IS the rename gag.
    rc_01_narrator: {
      text: "So. The ground's whole journey, one traveller at a time.",
      ...NARRATOR,
    },
    rc_02_ember: { text: "Magma!", ...EMBER, speed: 1.0 },
    rc_03_ember: { text: "Lava!", ...EMBER, speed: 1.0 },
    // Flat, no exclamation, and LATE — his 24f gap makes his own name arrive
    // a beat behind the relay. The Scene-19 namespace gag, landing.
    // sameAs a3_27 (showrunner repair, 2026-08-25 audit A3/W1): the Scene-19
    // namespace gag LANDING is the same flat take arriving a beat late — one
    // recording, and one fewer draw from the one-word highest-risk class.
    rc_04_rock: { sameAs: "a3_27_rock" },
    rc_05_drip: { text: "Sand!", ...DRIP, emotion: "happy" },
    rc_06_puff: { text: "Soil!", ...PUFF },
    // Kokoro — the caps are legal here.
    rc_07_narrator: { text: "And THAT is what dirt is actually made of.", ...NARRATOR },

    // Scene 28 — the debt stamped. The ep-4 end card returns and gets its
    // answer stamped across it, print only; Pip's stamp is SHOWN, not
    // re-fired. 0.9, then 36f on the stamped card.
    rc_08_narrator: {
      text: "Asked last show. Answered this show. Graded by the management.",
      ...NARRATOR,
      speed: 0.9,
    },

    // Scene 29 — two true things (the mind-blowers), back on the Scene-1
    // beach with the sandcastle still standing.
    rc_09_narrator: { text: "Now hold still. Two true things.", ...NARRATOR },
    rc_10_narrator: {
      text: "Every grain of sand, on every beach in the world, used to be part of a mountain.",
      ...NARRATOR,
    },
    // MIND-BLOWER 1 — pays off the silent builder runner planted in Scene 1.
    // 45f hold after it, on the kid and the castle.
    rc_11_narrator: {
      text: "So that sandcastle is a castle made of ground-up mountains. The kid and the volcano have been in the same business all day.",
      ...NARRATOR,
    },
    // MIND-BLOWER 2 (Math-bait) — true and checkable. The Narrator declining
    // to pronounce the name IS the research hook, and it keeps the word off
    // the TTS entirely.
    rc_12_narrator: {
      text: "And the next island is already growing. Right now. Underwater. It has a name, and I am not saying it out loud. It starts with K. Look it up. It needs a few more ten-thousands of years.",
      ...NARRATOR,
    },
    // SUNNY'S PRECISION, step 3: a true claim about an island even he cannot
    // see. Half-right forever, ego fully recovered.
    rc_13_sunny: { text: "I warm the sea on top of it!", ...SUNNY },
    rc_14_sunny: { sameAs: "co_07_sunny" },

    // Scene 30 — ROLL CALL, firing 2 (goodbye). Same five names, same order
    // (series law); one clip this time — the Sandy beat already landed, and
    // a goodbye run reads as one breath. At 1.0 so the names separate.
    rc_15_ember: {
      text: "Bye, Island. Bye, Islet. Bye, other Island. Bye, Island the third. Bye, Sandy.",
      ...EMBER,
      speed: 1.0,
    },
    // The goodbye middle: one flat Narrator line, 0.92, then 36f.
    rc_16_narrator: {
      text: "None of them moved. Islands never do. It was still polite.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Button — `auto`, unbothered, at 1.0. The arc's receipt: she now
    // schedules in geological time, happily. Her only re-use of the NUMBER,
    // in her own voice — a fresh recording, never the countdown clip.
    rc_17_ember: { text: "See you in ten thousand years.", ...EMBER, emotion: "auto", speed: 1.0 },

    // Scene 31 — end card, tease, good night.
    // The ep-6 tease: the storm episode, the most kid-checkable question the
    // series has asked (flash-to-boom counting). 0.9.
    rc_18_narrator: { text: "Next time. Why is thunder always late?", ...NARRATOR, speed: 0.9 },
    // V7 — the mirror of V1, 48f approach gap. The scenery keeps its voice.
    rc_19_volcano: { text: "Good night.", ...VOLCANO },
    // NEW CANON: the volcano stays AWAKE into episode six's horizon.
    rc_20_narrator: {
      text: "He is not going back to sleep. He is just being polite. He has ten thousand years of work to do.",
      ...NARRATOR,
    },
  },
};
