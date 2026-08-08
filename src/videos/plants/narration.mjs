// Narration script for "Pip and the Sunshine Kitchen" — Little Big World,
// episode four. Topic: photosynthesis — plants make their own food out of
// light, water and air. Audience: six-year-olds. Run
// `npm run narration -- --video plants` after editing; unchanged lines are
// served from cache.
//
// FORMAT
// Every line is an object so each character keeps its own voice. The
// file-level `voice` / `speed` are the house default (the Narrator);
// character lines override per line.
//
//   Narrator  kokoro   af_heart         1.0   warm storyteller, returning.
//                                             Deadpans at Sunny for a living.
//                                             Voice only — no body, ever
//   Pip       minimax  * NEW VOICE *    1.0   our hero. A dandelion seed who
//                                             will never take a step. See the
//                                             PIP block — AUDITION-PENDING
//   Sunny     kokoro   am_puck          1.0   the Sun, at his PEAK. Every
//                                             claim this episode is fully
//                                             true. Series voice since ep 1
//   Ray       minimax  Young_Knight     1.0   returning ep-3 hero. The
//                                             pedant; ingredient LIGHT
//   Drip      minimax  Lively_Girl      1.0   returning ep-1 hero, `happy`
//                                             on every line (locked casting);
//                                             ingredient WATER
//   Puff      minimax  Exuberant_Girl   1.0   returning ep-2 hero;
//                                             ingredient AIR. His ep-2 arc is
//                                             spent: no apologies, no crisis
//   Blue      minimax  Decent_Boy       1.05  one cameo, `happy` (casting),
//                                             wrong about "first", right
//                                             about nothing (seed, no payoff)
//   Cloudia   minimax  Abbess           1.0   one CUTTABLE scene, "darling"
//                                             on every composed line
//   Violet    —        —                —     NEVER. One silent garnish
//                                             firing (script Scene 8); the
//                                             moment he speaks the gag dies
//
// Silent, and staying silent: the kid (silhouette, fifth episode running),
// the volcano (scenery; one wordless steam-curl stir in Scene 13 — its voice
// `Elegant_Man` pitch -6 stays RESERVED and unused), and Violet.
//
// TWO ENGINES. The Narrator and Sunny stay on kokoro — free, local,
// re-synthesized the instant a line is reworded. Kokoro means no `emotion`
// field ever (the generator has nowhere to put it), no pause markers ever
// (hard error), no stretched vowels needed (there are none in this file on
// either engine). Everybody else with a body and a line is MiniMax
// speech-2.8-hd (Replicate, ~$0.11/1000 characters), which is paid but can
// act: it takes an `emotion` and honours inline pause markers.
//
//   engine: "minimax", voiceId: "<id>", emotion: "<enum>"
//   emotions: auto happy sad angry fearful disgusted surprised calm fluent
//             neutral
//
// EMOTION IS SEASONING. A line only carries one when a stage direction in
// `script.md` asks for it, and the comment on the line names the direction.
// The stats of this file: Drip and Blue carry their locked cast emotion
// (`happy`) on every recording — that is casting, not seasoning, same
// contract as ep-3's colours. Puff carries ten seasoned lines and they are
// his arc (two `surprised` where the trade lands on him, `happy` from the
// flip onward — nine lines). Ray carries exactly ONE (`happy`, his chant
// syllable) out of
// thirty recordings — his deadpans and disclosures are all `auto`, because
// the pedantry is in the words. PIP CARRIES ZERO, deliberately: her register
// (clipped, dry, certain) IS the casting target, her stamps are deadpan
// buttons, and a seasoned deadpan is a sold one. Cloudia carries zero (grand
// is what `Abbess` does at rest).
//
// PAUSE MARKERS: THERE ARE NONE IN THIS FILE. Every silence in the episode
// is a held beat *between* lines and belongs to `gaps`/`gapFrames` in
// `Video.tsx`, where `script.md` writes each one down with a frame count.
// Where a punchline needs a beat between two sentences, the sentences are
// two clips (see a3_42/a3_43, a3_51/a3_52, co_11/co_12).
//
// PIP IS NOT CAST. `Lovely_Girl` is a PLACEHOLDER so the file parses and the
// episode can be timed — it has never been heard saying these words.
// AUDITION-PENDING — showrunner casts before generation. Register target
// (synthesis, verbatim): clipped, brisk, small-but-certain, DRY not loud,
// warm underneath — "a six-year-old CEO". The three hardest asks:
//   a1_09_pip  a shouted work-order at the sky  "Attention, sky. This is a
//              building site."
//   co_17_pip  the flat two-word stamp — THE CHAIN SOURCE. Five firings hang
//              off this single take; approve it before ANYTHING downstream
//   a3_52_pip / a3_53_pip  the admission — warm, never defeated
//   npm run narration -- --audition plants:co_17_pip <dir> \
//     --engine minimax --voices Lovely_Girl,Sweet_Girl_2,Wise_Woman,Abbess
// Recasting is ONE constant (`PIP_MINIMAX_VOICE`) — but a recast AFTER
// generation re-buys her sixty-odd clips including the chain source, so the
// audition comes first.
//
// SAMEAS DISCIPLINE (world rule 5). Aliases resolve BACKWARDS ONLY, so every
// chain's source is the EARLIEST firing, decided here at draft time:
//   "It will do."                 SOURCE co_17_pip   -> a1_31, a2_27, a3_16,
//                                                       a3_79 (5 firings)
//   "It will not do."             a3_37_pip — NOT aliased. The break in the
//                                 pattern is a separate recording on purpose
//   "That is also true."          SOURCE a1_26_ray   -> a2_39, a3_57
//   "You're welcome! HA! HA!"     SOURCE a1_13_sunny -> a1_57, a2_38, a3_55,
//                                 rc_06 (kokoro is deterministic — the
//                                 aliases state intent and lock the wording)
//   "It is the highest grade she gives."
//                                 SOURCE a2_29_narrator -> a3_80
//   The chant syllables           SOURCES a3_65..a3_69 -> rc_07..rc_11
//
// CACHE MIGRATION — TWO CLIPS ARE NOT NEW PURCHASES. Cross-video `sameAs`
// does not exist, so these are cache migrations (copy the mp3 + seed the
// cache entry BEFORE the first generator run; both are copies, not moves —
// the old episodes keep their files):
//   a2_13_drip  == sky-blue a1_31_drip  ("Hi! It's me! I'm the weather!",
//               Lively_Girl, happy, 1.0). REQUIRED — third identical firing
//               of her standing entrance; the joke is the identical take.
//               DO NOT RE-BUY.
//   a2_55_puff  == wind a1_40_puff ("You can't see me. But you can FEEL
//               me.", Exuberant_Girl, happy, 1.0). RECOMMENDED — the canon
//               capital "FEEL" inside a MiniMax sentence is a fresh-draw
//               risk (the "AIR" defect signature); the ep-2 take is
//               ear-approved. If re-bought instead, ear-check the capital.
//
// Keys are `<act>_<number>_<speaker>` in strict playback order:
// `co` cold open, `a1` the light, `a2` the water, `a3` the air and the
// kitchen, `rc` recap. The screenplay in `script.md` lists which keys each
// of the twenty-nine scenes consumes; the two files must be edited together.
//
// TEXT-TO-SPEECH RULES OBSERVED HERE
//   - No digits, no percent signs, no colons, no ellipses, no
//     question-exclamation stacks. A hesitation is a real word or its own
//     line with a gap after it.
//   - CAPS mark shouted words on KOKORO lines only (Sunny's aria, the
//     Narrator never shouts). NO all-caps emphasis inside MiniMax sentences
//     — the one exception is the canon "FEEL" in a2_55, which is a migrated
//     ear-approved clip (see above). Bubbles keep their caps; clips go
//     lowercase (a1_35 "I am first!", a1_54 "away", a3_15 "I traded with a
//     plant!" — the drawn bubbles shout, the clips do not).
//   - THE FIVE CHANT SYLLABLES (a3_65..a3_69) ARE THE HIGHEST TTS RISK IN
//     THE EPISODE: four are MiniMax one-syllable clips. Fallback respellings,
//     known-safe shapes, if a syllable reads wrong:
//       a3_65_drip  "Pho!"  ->  "Fo!"
//       a3_66_puff  "To!"   ->  "Toe!"
//       a3_67_ray   "Syn!"  ->  "Sin!"
//       a3_68_pip   "The."  ->  "Thuh."
//     And the Narrator-led fallback if the five-voice chant fights
//     production (synthesis-approved): ONE kokoro line replaces all five —
//       "Pho. To. Syn. The. Sis. PHOTOSYNTHESIS!"
//     with the cast on the reprise only.
//
// COMEDY PACING — per-line speed overrides. Every list, roll call and
// repeated straight-line carries a slower `speed` with a comment saying why.
// The deadpan floor in this file is 0.9 (Pip's stamps, the Narrator's
// "highest grade" line); the house flat read is 0.92 (roll-call middle
// lines, "Different show", every deadpan explainer). The other half of the
// rule — held silence on the punchline — lives in `script.md`'s stage
// directions and becomes `gaps` in `Video.tsx`; the halves only work
// together.
const NARRATOR = { voice: "af_heart", speed: 1.0 };

// CAST by the showrunner 2026-08-08 (autonomous week — Mike's ear reviews
// in the tweak round; measurements + clips in ep4-decision-log.md TOP item).
// 3-voice audition on co_17/a1_09/a3_53: Inspirational_girl was the most
// clipped/brisk on all three (0.40-0.48 s/word vs Lovely_Girl 0.56-0.59)
// at mid loudness (register: DRY not loud). Clips kept in
// scratchpad/ep4_pip_audition/.
const PIP_MINIMAX_VOICE = "Inspirational_girl";
const PIP = { engine: "minimax", voiceId: PIP_MINIMAX_VOICE, speed: 1.0 };

// Returning, unchanged, and at his absolute peak: this is the episode where
// everything really does run on him, and he is unbearable about it. Kokoro
// `am_puck` — series voice, four episodes running. No emotion field, no
// pause markers, no stretched vowels; his stops are words, speed, and face.
const SUNNY = { voice: "am_puck", speed: 1.0 };
// Returning ep-3 hero. Cast by Mike 2026-07-27 (four-voice audition);
// constant kept so a recast stays one line + a sound-word sweep.
const RAY_MINIMAX_VOICE = "Young_Knight";
const RAY = { engine: "minimax", voiceId: RAY_MINIMAX_VOICE, speed: 1.0 };
// Returning ep-1 hero. `happy` on every recording — locked casting since
// ep 2, not seasoning.
const DRIP = { engine: "minimax", voiceId: "Lively_Girl", speed: 1.0 };
// Returning ep-2 hero. Default `auto`; his ten seasoned lines are this
// episode's arc (alarm -> commerce), each citing its stage direction.
const PUFF = { engine: "minimax", voiceId: "Exuberant_Girl", speed: 1.0 };
// One cameo. The suite's first >1.0 speed is the character and the physics.
const BLUE = { engine: "minimax", voiceId: "Decent_Boy", speed: 1.05 };
// One CUTTABLE scene. Grand is what Abbess does at rest — zero seasoning.
const CLOUDIA = { engine: "minimax", voiceId: "Abbess", speed: 1.0 };

export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    // ---------------------------------------------------------------
    // COLD OPEN — a breath, a flight, a landing, a thesis
    // ---------------------------------------------------------------
    co_01_narrator: {
      text: "This is a story about the biggest thing in the world.",
      ...NARRATOR,
    },
    // Collects ep-3's end card ("Next time. What do plants eat?") in the
    // first twenty seconds — same grammar as ep-3 collecting ep-2's tease.
    co_02_narrator: {
      text: "And about an old question. What do plants eat? Keep hold of it. The answer is not what anybody thinks.",
      ...NARRATOR,
      speed: 0.95,
    },
    // The series' "Here is a hill. Here is a kid." rhyme, fourth firing of
    // the shape.
    co_03_narrator: {
      text: "Here is a field. Here is a kid. And here is a dandelion clock, ready to fly.",
      ...NARRATOR,
      speed: 0.95,
    },
    co_04_narrator: { text: "One breath. Off they go.", ...NARRATOR },
    // Her first line, mid-air, bossing the wind. The register arrives before
    // the character is even named.
    co_05_pip: { text: "Left. Left. I said left.", ...PIP, speed: 0.95 },
    co_06_narrator: {
      text: "This is Pip. Pip is a seed. Pip has instructions for everybody.",
      ...NARRATOR,
    },
    // ROLL CALL — FIRING 1 (greeting), series signature. Five names at the
    // roll-call slow-down so the items separate. Names and order are
    // synthesis-fixed and return identically at the goodbye (rc_20).
    co_07_pip: {
      text: "Hi Pipsqueak! Hi Pipley! Hi other Pip! Hi Pippa! Hi Pip the third!",
      ...PIP,
      speed: 0.92,
    },
    // The flat Narrator middle line, house 0.92.
    co_08_narrator: {
      text: "Every seed in that packet is called Pip.",
      ...NARRATOR,
      speed: 0.92,
    },
    // The unbothered button — unseasoned, slow, a mild fact. If it sounds
    // sold, it is wrong.
    co_09_pip: { text: "Good crew.", ...PIP, speed: 0.9 },
    co_10_narrator: {
      text: "The wind put her down in the grass, on a small brown spot of dirt.",
      ...NARRATOR,
    },
    // The two failed steps are two clips with held beats between them — the
    // beat is the joke and a full stop cannot buy it.
    co_11_pip: { text: "Right. One step, please.", ...PIP },
    co_12_pip: { text: "Any step.", ...PIP, speed: 0.95 },
    co_13_narrator: {
      text: "Plants do not take steps. Not one. Not ever. This spot was Pip's now. Forever.",
      ...NARRATOR,
      speed: 0.95,
    },
    // The hero thesis, synthesis-verbatim.
    co_14_pip: {
      text: "Good. Moving is for things that are too small to stay.",
      ...PIP,
      speed: 0.95,
    },
    co_15_narrator: {
      text: "Pip was the size of a crumb. The field was the size of the world.",
      ...NARRATOR,
      speed: 0.95,
    },
    co_16_pip: {
      text: "Perfect. I am going to build the biggest thing in the world. Right here.",
      ...PIP,
    },
    // **STAMP CHAIN — SOURCE RECORDING, FIRING 1 of 5** (grading the dirt).
    // Fires again byte-identical at a1_31 (moonlight), a2_27 (water), a3_16
    // (air), a3_79 (the Sun). ONE paid take carries all five — audition and
    // approve THIS clip before any visual work; a later re-roll replaces
    // five approved firings. Deadpan floor: 0.9, unseasoned, forever.
    co_17_pip: { text: "It will do.", ...PIP, speed: 0.9 },
    co_18_narrator: {
      text: "The dirt did not answer. She took that as a yes.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Title card.
    co_19_narrator: {
      text: "This is the story of how the whole sky came to her.",
      ...NARRATOR,
      speed: 0.95,
    },

    // ---------------------------------------------------------------
    // ACT ONE — THE LIGHT
    // ---------------------------------------------------------------
    a1_01_narrator: { text: "Morning came up over the field.", ...NARRATOR },
    // The series-constant greeting+brag pair, fourth episode running,
    // word-for-word. Kokoro is deterministic, so the greeting is free and
    // byte-identical to every previous firing by construction.
    a1_02_sunny: { text: "GOOD MORNING, EVERYBODY!", ...SUNNY },
    a1_03_sunny: { text: "I invented mornings!", ...SUNNY },
    a1_04_narrator: {
      text: "Every flower in the field turned to look at him. Every stem leaned.",
      ...NARRATOR,
      speed: 0.95,
    },
    // The engine of the episode in two words. Flat, then the 45f hold does
    // the rest.
    a1_05_narrator: { text: "Except one.", ...NARRATOR, speed: 0.92 },
    a1_06_sunny: { text: "Speechless! They often are.", ...SUNNY },
    a1_07_narrator: {
      text: "Pip's stem started to lean all by itself. She put it back.",
      ...NARRATOR,
      speed: 0.95,
    },
    // To her own stem. The lean runner is planted (script Scene 5).
    a1_08_pip: { text: "We will discuss that later.", ...PIP, speed: 0.95 },
    // Audition line: the shouted work-order at the sky. Command reads as
    // delight, not temper — no emotion; the register is the casting.
    a1_09_pip: { text: "Attention, sky. This is a building site.", ...PIP },
    // Three-item list at the list slow-down.
    a1_10_pip: {
      text: "I need three deliveries. Light. Water. Air.",
      ...PIP,
      speed: 0.92,
    },
    a1_11_narrator: {
      text: "The sky did not answer. Most of it.",
      ...NARRATOR,
      speed: 0.95,
    },
    a1_12_sunny: {
      text: "LIGHT! Did somebody order LIGHT? Light is MINE!",
      ...SUNNY,
    },
    // **"You're welcome! HA! HA!" — SOURCE, FIRING 1 of 5.** Flat-identical
    // by design across all five firings (synthesis: the escalation lives in
    // everyone else, never in his read). His rubber stamp, mirroring hers.
    a1_13_sunny: { text: "You're welcome! HA! HA!", ...SUNNY },
    // The job-title runner planted: everyone is a role, never a name.
    a1_14_pip: { text: "Noted. The delivery service is loud.", ...PIP },
    // The not-saying-it runner planted; deadpan slow, then the 45f hold.
    a1_15_pip: {
      text: "And I will be sourcing my light independently.",
      ...PIP,
      speed: 0.9,
    },
    a1_16_narrator: {
      text: "Independent light. Nobody had ever heard of it. She was going to try anyway.",
      ...NARRATOR,
      speed: 0.95,
    },
    a1_17_narrator: {
      text: "That night, the sun went down, extremely pleased with himself.",
      ...NARRATOR,
    },
    a1_18_pip: { text: "Night shift. Perfect. No commentary.", ...PIP, speed: 0.95 },
    a1_19_narrator: {
      text: "And a light arrived anyway. A quiet one.",
      ...NARRATOR,
      speed: 0.95,
    },
    // His catch-phrase as his entrance, firing 1 of his 2 — pointed at the
    // MOON, which is the lesson (moonlight is about to turn out to be him).
    a1_20_ray: { text: "Look up. That's me.", ...RAY },
    // "Different show. Same ___." firing 1 of 2 — fresh blank, 0.92 flat,
    // same shape as sun/sky/rain/air before it.
    a1_21_narrator: {
      text: "That is Ray. Different show. Same beam.",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_22_pip: { text: "You. The light order. You work nights?", ...PIP },
    a1_23_ray: { text: "Before I take this job, full disclosure.", ...RAY },
    a1_24_ray: {
      text: "Moonlight is not the moon's light. It is his light. Bounced off the moon.",
      ...RAY,
      speed: 0.95,
    },
    a1_25_pip: {
      text: "So the moon is a mirror. And the big loud one works night shifts as well.",
      ...PIP,
      speed: 0.95,
    },
    // **"That is also true." — SOURCE RECORDING, FIRING 1 of 3** (-> a2_39,
    // a3_57). New Ray tic, synthesis-approved, logged for Mike. Unseasoned
    // AND it must stay neutral: the same take plays upset here and at a2_39,
    // and at peace inside the aria at a3_57 — the context does the acting.
    // EAR-CHECK against all three contexts before locking.
    a1_26_ray: { text: "That is also true.", ...RAY },
    a1_27_narrator: {
      text: "Somewhere under the horizon, fast asleep, Sunny was winning.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Load-bearing punchline, treatment-B verbatim.
    a1_28_pip: { text: "You bounced. That makes you freelance.", ...PIP },
    a1_29_ray: { text: "I do not think that is how light works.", ...RAY },
    a1_30_pip: { text: "It is how hiring works. You are hired.", ...PIP },
    // STAMP CHAIN — FIRING 2 of 5 (grading the moonlight).
    a1_31_pip: { sameAs: "co_17_pip" },
    a1_32_ray: { text: "It is second-hand light.", ...RAY },
    a1_33_pip: { text: "It is quiet light. That is worth more.", ...PIP, speed: 0.95 },
    a1_34_narrator: {
      text: "At dawn, the first direct beam arrived. It arrived the way Blue arrives everywhere.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Blue's cameo: claims first, hits the thing he apologises to, is wrong
    // twice, right about nothing (anti-Sunny seed — payoff NOT fired).
    // Bubble shouts "I am FIRST!"; the clip stays lowercase (MiniMax caps
    // rule). `happy` is his locked casting.
    a1_35_blue: {
      text: "First! Sorry, dandelion! I am first!",
      ...BLUE,
      emotion: "happy",
    },
    a1_36_ray: { text: "I arrived last night. Via the moon.", ...RAY },
    a1_37_blue: {
      text: "Then I am first today! Today counts! Sorry, fence!",
      ...BLUE,
      emotion: "happy",
    },
    // The resident's trump. Deadpan floor, then the 45f hold on a frozen
    // mid-ricochet Blue.
    a1_38_pip: { text: "I live here.", ...PIP, speed: 0.9 },
    a1_39_blue: {
      text: "First to leave! I am first to leave!",
      ...BLUE,
      emotion: "happy",
    },
    // Correction as a gift; he exits unbothered and still certain.
    a1_40_narrator: {
      text: "He was not first. He was very fast, though. Those are different things.",
      ...NARRATOR,
      speed: 0.92,
    },
    a1_41_narrator: {
      text: "All morning, Ray delivered light to Pip's square inch. Here is what the light did there.",
      ...NARRATOR,
      speed: 0.95,
    },
    a1_42_ray: {
      text: "Delivery report. Light is arriving. Nothing is catching it.",
      ...RAY,
      speed: 0.95,
    },
    a1_43_pip: { text: "Catch it? You said you were the delivery.", ...PIP },
    // Treatment-B's "not open for business" plus the pedagogy: light cannot
    // be stockpiled; the catcher must exist first.
    a1_44_ray: {
      text: "The customer is not open for business. Light has to be caught, and used, right away. You need a catcher. A leaf. A green one.",
      ...RAY,
      speed: 0.95,
    },
    // A gift for returning viewers (his ep-3 colours); a plain fact for new
    // ones.
    a1_45_ray: { text: "I know green personally. He sits down a lot.", ...RAY },
    // Collects ep-3's final beat (rc_21 "Is it me??") and resolves it with
    // pedantry. The oven concept stays SEEDED only — the word "oven" is not
    // spoken before a3_52 (synthesis ruling).
    a1_46_ray: {
      text: "And for the record, nobody is eating me. I checked before I took the job.",
      ...RAY,
      speed: 0.95,
    },
    a1_47_pip: {
      text: "Then I will grow one. Growing takes water. New order. Water.",
      ...PIP,
      speed: 0.95,
    },
    a1_48_narrator: {
      text: "So the biggest thing in the world was going to start with a drink.",
      ...NARRATOR,
      speed: 0.95,
    },
    a1_49_narrator: {
      text: "There was one puddle in the whole field. It was one step away.",
      ...NARRATOR,
      speed: 0.95,
    },
    a1_50_pip: { text: "You. Puddle. Come here.", ...PIP, speed: 0.95 },
    a1_51_pip: {
      text: "I am not going to walk over there. Walking is off the menu.",
      ...PIP,
    },
    a1_52_ray: {
      text: "I can move water. Light moves water all the time. Watch.",
      ...RAY,
    },
    a1_53_narrator: { text: "The puddle went up.", ...NARRATOR, speed: 0.92 },
    // Bubble may read "AWAY"; clip lowercase (MiniMax caps rule).
    a1_54_pip: { text: "You sent my water away.", ...PIP, speed: 0.95 },
    // A pedant's guarantee, hanging in all its uselessness. The list of
    // hedges needs the slow-down to separate.
    a1_55_ray: {
      text: "Up is away, technically. It will come back down. As rain. Eventually. Somewhere.",
      ...RAY,
      speed: 0.95,
    },
    a1_56_sunny: {
      text: "Was that my water elevator? That WAS my water elevator! I lift ALL the water!",
      ...SUNNY,
    },
    // HA! HA! — FIRING 2 of 5.
    a1_57_sunny: { sameAs: "a1_13_sunny" },
    a1_58_ray: { text: "The elevator is his. I did the sums.", ...RAY },
    // First click of her holdout counter ("It is exhausting." -> "Do not
    // say it." -> "Fine.").
    a1_59_pip: { text: "Everything is his. It is exhausting.", ...PIP, speed: 0.9 },
    a1_60_narrator: {
      text: "It was not everything. It was nearly everything. Hold that thought.",
      ...NARRATOR,
      speed: 0.95,
    },

    // ---------------------------------------------------------------
    // ACT TWO — THE WATER
    // ---------------------------------------------------------------
    a2_01_pip: { text: "New problem. Rain does not take orders.", ...PIP },
    a2_02_narrator: {
      text: "Rain comes from clouds. And clouds are full of guests.",
      ...NARRATOR,
    },
    a2_03_pip: {
      text: "Then send me a cloud. A big one. With my water in it.",
      ...PIP,
      speed: 0.95,
    },
    // --- Scene 12 (CUTTABLE, whole scene: a2_04..a2_11). If cut, a2_12
    // follows a2_03 cleanly and nothing else moves. -----------------------
    a2_04_cloudia: {
      text: "Good afternoon, darling. The Cloud Hotel is at full capacity.",
      ...CLOUDIA,
    },
    a2_05_cloudia: {
      text: "Which means, darling, that it is checkout time.",
      ...CLOUDIA,
      speed: 0.95,
    },
    a2_06_pip: { text: "I ordered one water.", ...PIP },
    a2_07_cloudia: {
      text: "One? Darling. Nobody leaves this hotel alone.",
      ...CLOUDIA,
      speed: 0.95,
    },
    a2_08_cloudia: {
      text: "Your delivery, darling. Signature required.",
      ...CLOUDIA,
    },
    a2_09_narrator: {
      text: "Pip had nothing to sign with. So she signed the only way she could. She leaned.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_10_pip: { text: "Consider that a signature.", ...PIP, speed: 0.95 },
    a2_11_cloudia: { text: "Gorgeous penmanship, darling.", ...CLOUDIA },
    // ---------------------------------------------------------------------
    a2_12_narrator: { text: "And down came the rain.", ...NARRATOR },
    // **CACHE MIGRATION — DO NOT RE-BUY.** Third identical firing of her
    // standing entrance (ep 2 a3_41, ep 3 a1_31). Copy
    // public/narration/sky-blue/a1_31_drip.mp3 -> plants/a2_13_drip.mp3 and
    // seed the cache entry before the first generator run; the joke is that
    // it is audibly the identical take. Fields match the ep-3 source
    // exactly.
    a2_13_drip: {
      text: "Hi! It's me! I'm the weather!",
      ...DRIP,
      emotion: "happy",
    },
    // "Different show. Same ___." firing 2 of 2 — A's blank, ruled in by the
    // synthesis (it buttons her own entrance line). 0.92 flat, always.
    a2_14_narrator: {
      text: "That is Drip. Different show. Same weather.",
      ...NARRATOR,
      speed: 0.92,
    },
    // THE VOLCANO STIR happens on this wide (staging only — one curl of
    // steam off the summit, ~60f, wordless, nobody reacts; see script.md).
    a2_15_pip: { text: "The water order. Confirmed. One water.", ...PIP },
    a2_16_drip: {
      text: "One water? I am the storm! I am the whole sky falling down!",
      ...DRIP,
      emotion: "happy",
    },
    a2_17_pip: { text: "The order said one.", ...PIP, speed: 0.95 },
    a2_18_drip: {
      text: "I brought a thousand cousins!",
      ...DRIP,
      emotion: "happy",
    },
    a2_19_pip: {
      text: "Then the order is complete a thousand times. Well done, one water.",
      ...PIP,
      speed: 0.95,
    },
    a2_20_drip: { text: "I will take it.", ...DRIP, emotion: "happy" },
    a2_21_narrator: {
      text: "Now. The front door of a plant is not on top. It is at the bottom.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_22_drip: { text: "The door is in the dirt? Fancy.", ...DRIP, emotion: "happy" },
    a2_23_drip: {
      text: "A waterslide! It goes up! An uphill waterslide!",
      ...DRIP,
      emotion: "happy",
    },
    a2_24_narrator: {
      text: "Roots drink at the bottom. The water climbs the plant like a straw.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_25_drip: {
      text: "I am the plumbing! Of the biggest thing in the world!",
      ...DRIP,
      emotion: "happy",
    },
    a2_26_pip: { text: "Height. Finally. Put it on the building.", ...PIP },
    // STAMP CHAIN — FIRING 3 of 5 (grading the water).
    a2_27_pip: { sameAs: "co_17_pip" },
    a2_28_drip: {
      text: "It will do? I am the best water there has ever been!",
      ...DRIP,
      emotion: "happy",
    },
    // **SOURCE RECORDING** — re-fires byte-identical at a3_80, aimed at the
    // Sun. The flat button on the stamp gag; deadpan floor 0.9, held 45f.
    a2_29_narrator: {
      text: "It is the highest grade she gives.",
      ...NARRATOR,
      speed: 0.9,
    },
    a2_30_drip: { text: "Oh. Then I accept.", ...DRIP, emotion: "happy" },
    a2_31_drip: {
      text: "That sprout is mine, by the way. Water did that.",
      ...DRIP,
      emotion: "happy",
    },
    a2_32_ray: {
      text: "Half yours. The water fell down. Something lifted it up first.",
      ...RAY,
      speed: 0.95,
    },
    // THE SWERVE — ensemble firing 1. The sentence bends around the sun.
    // List of dodges at the slow-down so they separate.
    a2_33_drip: {
      text: "It was lifted by the sky. By upstairs. By a large warm colleague.",
      ...DRIP,
      emotion: "happy",
      speed: 0.95,
    },
    a2_34_ray: { text: "The lift is powered by somebody.", ...RAY, speed: 0.95 },
    // Holdout counter, click two.
    a2_35_pip: { text: "Do not say it.", ...PIP, speed: 0.9 },
    a2_36_ray: {
      text: "I was not going to say it. Everybody knows it. That is different from saying it.",
      ...RAY,
      speed: 0.95,
    },
    a2_37_sunny: { text: "The lift is ME! The lift is ALWAYS me!", ...SUNNY },
    // HA! HA! — FIRING 3 of 5.
    a2_38_sunny: { sameAs: "a1_13_sunny" },
    // "That is also true." — FIRING 2 of 3. Same neutral clip; still upset;
    // the context does the work.
    a2_39_ray: { sameAs: "a1_26_ray" },
    a2_40_pip: { text: "Stop confirming him.", ...PIP },
    a2_41_ray: { text: "I am contractually honest.", ...RAY },
    // The sprout row pops in the background here (staging) — the picture
    // the rc_20 goodbye needs, planted without naming (synthesis ruling:
    // the greeting already happened mid-air).
    a2_42_narrator: {
      text: "The rain had watered everybody, by the way. The whole packet came up.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_43_drip: {
      text: "Question from the plumbing. Is it lunchtime down here? Do you eat the dirt?",
      ...DRIP,
      emotion: "happy",
    },
    a2_44_drip: {
      text: "I have been mud. I was delicious.",
      ...DRIP,
      emotion: "happy",
      speed: 0.95,
    },
    // The cold-open riddle's first half-answer, flat, slow, final. Held 36f.
    a2_45_pip: { text: "Nobody eats dirt.", ...PIP, speed: 0.9 },
    a2_46_narrator: {
      text: "She is right. No plant has ever eaten dirt. Not once. Watch what they do instead.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_47_pip: { text: "A leaf. Excellent. Somewhere to cook.", ...PIP },
    a2_48_narrator: {
      text: "Her first leaf. Her first pointer, too.",
      ...NARRATOR,
      speed: 0.95,
    },
    a2_49_pip: { text: "You. Sky. Stand by for orders.", ...PIP },
    // Green = the light-catching stuff, physics-honest (the green you SEE is
    // the bounced bit), in his ep-3 mechanics register. Chlorophyll not
    // named, not carded.
    a2_50_ray: {
      text: "Good leaf. Green is the catching colour. The green you see is the bit it sends back to you.",
      ...RAY,
      speed: 0.95,
    },
    a2_51_drip: { text: "So what is dirt for, then?", ...DRIP, emotion: "happy" },
    // Her complete account of soil. The episode never says more (soil =
    // unexplained given; ep 5 pays off the origin). Held 45f.
    a2_52_pip: { text: "It's where I keep my feet.", ...PIP, speed: 0.95 },
    // Inventory list at the list slow-down.
    a2_53_pip: {
      text: "Inventory. Water, inside. Light, on retainer. One delivery left. Air.",
      ...PIP,
      speed: 0.95,
    },
    a2_54_pip: { text: "Where does one order air?", ...PIP, speed: 0.95 },
    // **His catch-phrase, exactly once, AS his entrance** (synthesis ruling;
    // his "Different show" line is deliberately skipped — an invisible
    // character cannot be announced by a narrator pointing at him).
    // **CACHE MIGRATION RECOMMENDED**: identical text and fields to wind
    // a1_40_puff (ear-approved take; also sidesteps re-rolling the canon
    // "FEEL" capital on MiniMax — the one caps exception in this file).
    a2_55_puff: {
      text: "You can't see me. But you can FEEL me.",
      ...PUFF,
      emotion: "happy",
    },

    // ---------------------------------------------------------------
    // ACT THREE — THE AIR, AND THE KITCHEN
    // ---------------------------------------------------------------
    a3_01_puff: {
      text: "Air! You ordered air! I am air! I have been here the whole time!",
      ...PUFF,
    },
    a3_02_pip: { text: "Since when?", ...PIP },
    // Treatment-B verbatim.
    a3_03_puff: {
      text: "Since always! I am the guest that lives at the party!",
      ...PUFF,
    },
    a3_04_narrator: {
      text: "The one delivery that arrives before you order it.",
      ...NARRATOR,
      speed: 0.92,
    },
    a3_05_pip: { text: "The air order. Early. Noted. Promoted.", ...PIP, speed: 0.95 },
    // THE SWERVE — firing 2, and it is the Narrator's own. Flat, and
    // straight on. (Rewritten from B's trailing-off shape — a dangling
    // "made by." is a TTS artifact risk; the self-interruption is carried
    // by "Moving on." instead. Flagged in script.md deviations.)
    a3_06_narrator: {
      text: "Who makes the wind that stirs him? Moving on.",
      ...NARRATOR,
      speed: 0.92,
    },
    a3_07_narrator: {
      text: "Ray put one beam on the new leaf. And the kitchen took its very first breath.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Stage direction (script Scene 19): alarm, played funny — a yelp, not a
    // fright. Seasoned per direction.
    a3_08_puff: { text: "The leaf is eating me!", ...PUFF, emotion: "surprised" },
    a3_09_pip: {
      text: "Only the tiny part. The fizzy bit. You will not miss it.",
      ...PIP,
      speed: 0.95,
    },
    // Stage direction: the fact lands on him — being made of parts is MORE
    // stuff, which is his favourite thing to be.
    a3_10_puff: {
      text: "There are parts of me? I have parts?",
      ...PUFF,
      emotion: "surprised",
    },
    // Carbon dioxide named once, lightly, never carded.
    a3_11_narrator: {
      text: "He does. The fizzy part has a long name. Carbon dioxide. A tiny, tiny piece of air.",
      ...NARRATOR,
      speed: 0.95,
    },
    a3_12_pip: {
      text: "The kitchen takes the fizzy bit. And look. It gives one back.",
      ...PIP,
      speed: 0.95,
    },
    // Stage direction: the trade-back delight — the flip from alarm to
    // commerce happens on this line.
    a3_13_puff: {
      text: "A part came back! A different part! A fresh one!",
      ...PUFF,
      emotion: "happy",
    },
    a3_14_narrator: {
      text: "Nothing stolen. A trade. Air in, fresh air out.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Stage direction: ecstatic commerce. Bubble may shout "I TRADED with a
    // PLANT!"; the clip stays lowercase.
    a3_15_puff: { text: "I traded with a plant!", ...PUFF, emotion: "happy" },
    // STAMP CHAIN — FIRING 4 of 5 (grading the air).
    a3_16_pip: { sameAs: "co_17_pip" },
    a3_17_puff: { text: "Did you hear that? The air will do!", ...PUFF },
    a3_18_narrator: {
      text: "Now look at the big old tree at the edge of the field. Here is a question. What is a tree made of?",
      ...NARRATOR,
      speed: 0.95,
    },
    a3_19_drip: { text: "Wood.", ...DRIP, emotion: "happy" },
    a3_20_puff: {
      text: "Wood is a good guess. I would have said wood.",
      ...PUFF,
      speed: 0.95,
    },
    a3_21_narrator: {
      text: "Wood, yes. But what is the wood made of? Not dirt. Dig under a tree. The dirt is all still there.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Mind-blower #1, the long 60f hold lives after this line.
    a3_22_narrator: {
      text: "A tree builds its whole body out of water. And air.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Stage direction: delighted horror arriving at pride — and it lands on
    // pride. Two clips so the second sentence gets its own beat.
    a3_23_puff: { text: "She is going to be made of me.", ...PUFF, emotion: "happy" },
    a3_24_puff: { text: "I am going to be a tree.", ...PUFF, emotion: "happy" },
    // The rule stamp (A TREE IS MADE OF AIR) slams between these lines.
    a3_25_ray: {
      text: "The card is correct. Mostly air and water. I checked it twice.",
      ...RAY,
      speed: 0.95,
    },
    a3_26_pip: { text: "Less admiring. More building.", ...PIP },
    a3_27_narrator: {
      text: "Water from below. The fizzy bit of air. One beam of light, on full.",
      ...NARRATOR,
      speed: 0.95,
    },
    a3_28_narrator: {
      text: "And out came the first food ever cooked in this field. Sugar.",
      ...NARRATOR,
      speed: 0.95,
    },
    a3_29_narrator: { text: "One crumb of it.", ...NARRATOR, speed: 0.92 },
    a3_30_pip: { text: "One crumb.", ...PIP, speed: 0.9 },
    a3_31_ray: {
      text: "Sugar is sunshine, stored. That crumb is light you can keep.",
      ...RAY,
      speed: 0.95,
    },
    // Catch-phrase VARIANT, firing 2 of his 2 (synthesis-approved mutation;
    // writer's placement: at the sugar). Stage direction: quiet — the
    // proudest and most begrudging thing he says all episode. Auto; the
    // quiet is speed and words.
    a3_32_ray: { text: "Look down. That is also me.", ...RAY, speed: 0.95 },
    a3_33_pip: {
      text: "How many crumbs to build the biggest thing in the world?",
      ...PIP,
    },
    a3_34_ray: {
      text: "One beam makes one crumb. You would need every beam the sun has. All day. Every day.",
      ...RAY,
      speed: 0.95,
    },
    a3_35_ray: {
      text: "That is not a delivery. That is the whole sun.",
      ...RAY,
      speed: 0.95,
    },
    // The series credit-allocation device in signature form (ep-3 closed on
    // Red's "It is mostly me."). Unseasoned, slow, and the 60f hold after it
    // is the beat — deadpan is stillness; nothing enters it.
    a3_36_ray: { text: "It is mostly him.", ...RAY, speed: 0.95 },
    // **THE BREAK — NEW RECORDING, DELIBERATELY NOT ALIASED** (synthesis
    // ruling). The first time in her life her highest grade has failed, and
    // the failure is what makes her look up. Same deadpan floor as the
    // chain; the 75f hold after it is the episode's biggest so far.
    a3_37_pip: { text: "It will not do.", ...PIP, speed: 0.9 },
    a3_38_narrator: {
      text: "It was the first time she had ever said it.",
      ...NARRATOR,
      speed: 0.92,
    },
    a3_39_narrator: {
      text: "Everyone knew what she had to do next. Nobody would say it out loud.",
      ...NARRATOR,
      speed: 0.95,
    },
    // THE SWERVE — firing 3, the escalating triple. Each dodge-list runs at
    // the list slow-down.
    a3_40_drip: {
      text: "You could ask. A cloud. Clouds are very powerful.",
      ...DRIP,
      emotion: "happy",
      speed: 0.95,
    },
    a3_41_puff: {
      text: "You could ask the sky. Or the sky's roommate. The big round one.",
      ...PUFF,
      speed: 0.95,
    },
    // Split clip: the swerve's punchline needs the beat between sentences —
    // he hears himself, 24f, then arrests the thought.
    a3_42_ray: {
      text: "You could ask the source of every beam in the sky.",
      ...RAY,
      speed: 0.95,
    },
    a3_43_ray: { text: "No. Forget I said that.", ...RAY, speed: 0.95 },
    // The lean, uncorrected — the resolution begins silently.
    a3_44_narrator: {
      text: "Pip's stem leaned. This time, she let it.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Holdout counter, final click. One word, slow, held 45f.
    a3_45_pip: { text: "Fine.", ...PIP, speed: 0.9 },
    a3_46_narrator: {
      text: "What happened next had never happened in this field, or any other.",
      ...NARRATOR,
      speed: 0.95,
    },
    a3_47_pip: { text: "You. The big one. Down here.", ...PIP, speed: 0.95 },
    // A laugh the six-year-old is licensed to get: four episodes of data say
    // he ALWAYS interrupts.
    a3_48_narrator: {
      text: "And for the first time in four whole shows, Sunny did not interrupt.",
      ...NARRATOR,
      speed: 0.92,
    },
    // The admission, in her register to the last word: a HIRE, never a
    // surrender. Slowed for weight, unseasoned throughout — warm is in the
    // words, not a field.
    a3_49_pip: {
      text: "I am building the biggest thing in the world. It cooks its own food. And the cooking runs on light. All day. Every day. Yours.",
      ...PIP,
      speed: 0.95,
    },
    a3_50_pip: {
      text: "Every leaf there has ever been. Every tree. Every apple. All of it ran on you.",
      ...PIP,
      speed: 0.95,
    },
    // THE PROMOTION — split clips; the 75f hold after a3_52 is the episode's
    // biggest held beat and nothing enters it.
    a3_51_pip: { text: "He was never the delivery service.", ...PIP, speed: 0.9 },
    a3_52_pip: { text: "He is the oven.", ...PIP, speed: 0.9 },
    a3_53_pip: { text: "The job is yours. Shift starts at dawn.", ...PIP, speed: 0.95 },
    // His quietest line in four episodes. Kokoro: the quiet is words and
    // 0.95, nothing else. 45f in front of the alias that follows.
    a3_54_sunny: { text: "I know.", ...SUNNY, speed: 0.95 },
    // HA! HA! — FIRING 4 of 5. The biggest one by PLACEMENT, not read: the
    // identical flat clip, detonated by the silence around it.
    a3_55_sunny: { sameAs: "a1_13_sunny" },
    // The aria — every word of it legitimate. Kokoro caps carry the shout.
    a3_56_sunny: {
      text: "Every forest! Every flower! Every salad EVER! All of it cooks on ME!",
      ...SUNNY,
    },
    // "That is also true." — FIRING 3 of 3, at peace: inside a fully true
    // aria there is nothing left to be upset about. Same neutral clip; the
    // context is the acting (synthesis ruling).
    a3_57_ray: { sameAs: "a1_26_ray" },
    a3_58_sunny: {
      text: "Every apple is MY apple! Every lettuce is MY lettuce!",
      ...SUNNY,
    },
    a3_59_pip: { text: "Do not make it weird. Dawn. Do not be late.", ...PIP, speed: 0.95 },
    a3_60_narrator: {
      text: "He was not late. He has never once been late.",
      ...NARRATOR,
      speed: 0.95,
    },
    a3_61_narrator: { text: "At dawn, the oven clocked in.", ...NARRATOR },
    a3_62_sunny: { text: "ONE WHOLE SUN! DELIVERED!", ...SUNNY },
    a3_63_pip: { text: "More leaves! More pans! Cook everything!", ...PIP },
    a3_64_narrator: {
      text: "And this whole trick has a name. It is a monster of a name. Ready?",
      ...NARRATOR,
      speed: 0.95,
    },
    // THE FIVE-VOICE CHANT (synthesis-approved; PHO Drip / TO Puff / SYN Ray
    // / THE Pip / SIS Sunny). HIGHEST TTS RISK IN THE EPISODE — fallback
    // respellings and the Narrator-led fallback are in the header. Each
    // syllable is a SOURCE for its rc reprise alias. Stage direction
    // (script Scene 24): everyone cheers their syllable — except Pip, who
    // files hers, which is the joke.
    a3_65_drip: { text: "Pho!", ...DRIP, emotion: "happy" },
    a3_66_puff: { text: "To!", ...PUFF, emotion: "happy" },
    // Ray's ONE seasoned line in the episode — the chant is a cheer.
    a3_67_ray: { text: "Syn!", ...RAY, emotion: "happy" },
    // Unseasoned and flat on purpose; hers is the only filed syllable.
    a3_68_pip: { text: "The.", ...PIP, speed: 0.95 },
    a3_69_sunny: { text: "SIS!", ...SUNNY },
    a3_70_narrator: {
      text: "Photosynthesis. Light, water and air, cooking food inside a leaf.",
      ...NARRATOR,
      speed: 0.95,
    },
    a3_71_ray: { text: "Photosynthesis. First try.", ...RAY },
    a3_72_narrator: {
      text: "Ray said it perfectly. Nobody clapped.",
      ...NARRATOR,
      speed: 0.92,
    },
    a3_73_narrator: {
      text: "And the sugar is the part you know. Sugar is sunshine you can keep.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Synthesis, verbatim — his most legitimate brag ever.
    a3_74_sunny: { text: "Sweetness is me, in a box.", ...SUNNY },
    // The ep-1 echo ("annoyingly, he is completely right"). Showrunner
    // edit pass: SPLIT CLIP — the echo earns a real hang, not a comma
    // (STYLE: if a joke needs a pause kokoro can't make, split the clip).
    // Held beat between the halves lives in Video.tsx (24f on a3_75).
    a3_75_narrator: {
      text: "Annoyingly.",
      ...NARRATOR,
      speed: 0.92,
    },
    a3_75b_narrator: {
      text: "That is completely true.",
      ...NARRATOR,
      speed: 0.92,
    },
    // Mind-blower #3, checkable: sugar is stored sunlight.
    a3_76_narrator: {
      text: "Every apple you have ever eaten was sunshine, saved up. You have been eating sunshine your whole life.",
      ...NARRATOR,
      speed: 0.95,
    },
    a3_77_sunny: { text: "Enjoy your lunch! It is me!", ...SUNNY },
    a3_78_narrator: {
      text: "The build went up all day. And at the end of it, Pip looked at her oven for a long time.",
      ...NARRATOR,
      speed: 0.95,
    },
    // STAMP CHAIN — FIRING 5 of 5, RESOLUTION: aimed at the Sun himself.
    // Her concession delivered as her highest grade, in the identical flat
    // clip she graded dirt with. 75f hold after; last Pip line before the
    // recap (synthesis ruling).
    a3_79_pip: { sameAs: "co_17_pip" },
    // Second firing, byte-identical — re-aimed at the one recipient who
    // will take it as five stars. Sunny's answer is staged silence (his
    // first in four episodes).
    a3_80_narrator: { sameAs: "a2_29_narrator" },

    // ---------------------------------------------------------------
    // RECAP — the chant, the mind-blower, the goodbye, the question
    // ---------------------------------------------------------------
    rc_01_narrator: {
      text: "Let's say the big words together. Ready?",
      ...NARRATOR,
    },
    // Bow panels — same note as ep 3's recap: each hero re-fires their
    // ingredient in register.
    rc_02_drip: {
      text: "Water! That was me! I took the uphill waterslide!",
      ...DRIP,
      emotion: "happy",
    },
    rc_03_puff: {
      text: "Air! That was me! I traded my fizzy bit! I am in the tree right now!",
      ...PUFF,
      emotion: "happy",
    },
    // His whole episode in six words. Deadpan bow, unseasoned.
    rc_04_ray: { text: "Light. Also me. Mostly him.", ...RAY, speed: 0.95 },
    rc_05_sunny: { text: "LIGHT! MINE! ALL OF IT!", ...SUNNY },
    // HA! HA! — FIRING 5 of 5 (recap placement per the synthesis). Ledger
    // closed at five; the three of headroom under the ceiling of eight
    // belong to the showrunner, not this file.
    rc_06_sunny: { sameAs: "a1_13_sunny" },
    // The reprise — five byte-identical aliases as the card syllables light
    // up in owner order.
    rc_07_drip: { sameAs: "a3_65_drip" },
    rc_08_puff: { sameAs: "a3_66_puff" },
    rc_09_ray: { sameAs: "a3_67_ray" },
    rc_10_pip: { sameAs: "a3_68_pip" },
    rc_11_sunny: { sameAs: "a3_69_sunny" },
    rc_12_narrator: {
      text: "Photosynthesis. Plants make their own food. Out of light, water and air.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Her recap bow, and the cold-open riddle formally closed.
    rc_13_pip: {
      text: "Three deliveries. One kitchen. No dirt was eaten.",
      ...PIP,
      speed: 0.95,
    },
    rc_14_narrator: { text: "Now here is the amazing part.", ...NARRATOR },
    // Homework beat (ep-2 hand-wave precedent): the 45f hold after this line
    // is where the child actually breathes. Do not start the next line
    // early.
    rc_15_narrator: {
      text: "Take a big breath. A real one. Go on.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Mind-blower #2, the closer.
    rc_16_narrator: {
      text: "The fresh part of that breath. The part that keeps you going. A plant breathed it out.",
      ...NARRATOR,
      speed: 0.95,
    },
    // Quiet, auto — the words carry it; the proudest small line he has.
    rc_17_puff: { text: "A plant made that one. Pass it on.", ...PUFF },
    // The cold-open circle closes: breath out, breath back.
    rc_18_narrator: {
      text: "And the tree at the edge of the field caught the fizzy part of it, and started cooking.",
      ...NARRATOR,
      speed: 0.95,
    },
    rc_19_narrator: {
      text: "The sun went down on the field. All the little Pips stood in their row.",
      ...NARRATOR,
      speed: 0.95,
    },
    // ROLL CALL — FIRING 2 (goodbye). Same five siblings, same order as
    // co_07, at the roll-call slow-down. A different sentence from the
    // greeting, so a separate recording BY DESIGN — not a broken chain.
    rc_20_pip: {
      text: "Bye Pipsqueak. Bye Pipley. Bye other Pip. Bye Pippa. Bye Pip the third.",
      ...PIP,
      speed: 0.92,
    },
    // The flat middle line, synthesis-verbatim. Held 45f.
    rc_21_narrator: {
      text: "Nobody was going anywhere.",
      ...NARRATOR,
      speed: 0.92,
    },
    // The unbothered button, synthesis-verbatim. Unseasoned, slow, held
    // 45f; deadpan is stillness and nothing enters this beat.
    rc_22_pip: { text: "See you tomorrow.", ...PIP, speed: 0.9 },
    // The end-card read, series grammar, at the sign-off slow-down. The
    // soil bridge armed for ep 5; the volcano promises nothing.
    rc_23_narrator: {
      text: "Next time. What is dirt actually made of?",
      ...NARRATOR,
      speed: 0.9,
    },
    // The episode's last line: her stamp machinery aimed at next time's
    // question. Register intact to the final syllable.
    rc_24_pip: { text: "Send it here. I will grade it.", ...PIP, speed: 0.95 },
  },
};
