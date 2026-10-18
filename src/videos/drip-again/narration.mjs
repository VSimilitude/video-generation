// Narration script for "Drip Goes Up Again" — Little Big World, the second
// choose-your-own-adventure demo (docs/CYOA.md; src/videos/drip-again/brief.md
// is the design, and its line wording is final). Run
// `npm run narration -- --video drip-again` after editing; unchanged lines are
// served from cache.
//
// FORMAT — identical to DripChooses' (src/videos/drip-fork/narration.mjs).
// Every line is an object so each character keeps its own voice; the file-level
// `voice` / `speed` are the house default (the Narrator). All kokoro (brief
// ruling 4): free, deterministic, reworded at will.
//
//   Narrator  af_heart    1.0   warm storyteller, deadpan on the punchlines
//   Drip      af_bella    1.1   small, brave, dramatic — the speed is the
//                               character, not a fix
//   Sunny     am_puck     1.0   the Sun. Enormous ego, and entirely correct
//   Beaver    am_michael  1.05  brisk, plain, a foreman with a job on. Mike can
//                               overturn; the fallback is bm_george 1.0
//
// Cloudia does not speak: she is away on important business (that is the
// premise). Her sign is drawn text, read by the Narrator (`in_07`). The volcano
// never speaks either; it burps once, silently, as a smoke ring.
//
// THE TREE — two full choices plus a HALF-CHOICE inside each first branch
// (left/right; both options lead to the same next segment, which swaps a few
// lines and pictures). Foldback at the pond. Eight paths:
//
//   intro ─┬─ valley ──(left|right)── dam ───┐
//          └─ mountain ─(left|right)── race ─┴─ pond ─┬─ over ──┐
//                                                     └─ lodge ─┴─ home
//
// Keys are `<seg>_<nn>[a-d]_<speaker>`, and the prefix is the branch node:
// `in` intro, `va` valley, `da` dam, `mo` mountain, `rc` race, `po` pond,
// `ov` over, `lo` lodge, `hm` home. `ch` lines are the choice cards' own
// audio — played by the SITE player over the paused last frames of `in`,
// `va`, `mo` and `po`, never by a scene.
//
// VARIANT INSERTS — `a`/`b` keys are the same beat of a shared segment in two
// flavours, one per option of an earlier choice. Twenty clips, no more
// (brief ruling 3):
//   da_01a/b, da_02a/b, da_03a/b   the dam's opening     valleyWay    left / right
//   rc_01a/b, rc_02a/b, rc_03a/b   the race              mountainWay  left / right
//   po_01a/b                       the Beaver's hello    where        valley / mountain
//   hm_04a/b/c/d                   Sunny's credit 1      where + its half-choice
//                                  (valley-left, valley-right, mountain-left, mountain-right)
//   hm_05a/b                       Sunny's credit 2      wayOut       over / lodge
// Video.tsx (`VARIANTS`) picks the clip from the viewer's path.
//
// TEXT-TO-SPEECH RULES OBSERVED HERE (same set as episode one)
//   - No digits, no colons, percent signs or ampersands. Commas and full stops
//     carry the rhythm.
//   - Sound words are spelled as words: Wheee, Sploosh, HISSSS.
//   - CAPS mark shouted words.
//   - Roll calls get Drip at speed 1.0 instead of 1.1 so the names separate
//     (docs/STYLE.md, comedy pacing): `in_05`, `lo_02`, `hm_02`.
//
// WATCH-FORS — audition these before trusting them:
//   - `in_04_sunny` is five sentences at am_puck's shout register ("AGAIN?
//     Already? Fine. …"); check the short middle sentences are not rushed and
//     "UP you go! HA! HA!" still lands.
//   - `rc_04_narrator` opens on "HISSSS." — check kokoro hisses rather than
//     spelling letters or swallowing it.
//   - `da_05_beaver` / `da_07_beaver` are one-word clips ("Dam."). Check they
//     are not clipped at the head; same for every "Busy." (`po_04`, `ov_03`,
//     `lo_04`).
//   - `da_03b_narrator` "CRACK, went the tree" — check the shouted sound word
//     at the head of a long sentence is not clipped or flattened.
//   - `hm_07_drip` is the longest shout in the show, ending on "THE WATER
//     CYCLE! AGAIN!" — check the last CAPS phrase does not clip or flatten.
//   - The roll calls (`in_05`, `lo_02`, `hm_02`) — check the names separate.
//   - Each variant pair must feel like the SAME beat in two flavours; compare
//     them back to back for length and energy.
const NARRATOR = { voice: "af_heart", speed: 1.0 };
const DRIP = { voice: "af_bella", speed: 1.1 };
const SUNNY = { voice: "am_puck", speed: 1.0 };
const BEAVER = { voice: "am_michael", speed: 1.05 };
/** Drip, slowed for a roll call so the names separate. */
const DRIP_ROLLCALL = { voice: "af_bella", speed: 1.0 };

export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    // ---------------------------------------------------------------
    // INTRO — the shared trunk, ending on choice 1 (`where`)
    // ---------------------------------------------------------------
    in_01_narrator: {
      text: "Drip went up, and across, and down, and all the way home. He had been home for about a minute.",
      ...NARRATOR,
    },
    in_02_drip: { text: "I want to go AGAIN.", ...DRIP },
    in_03_narrator: { text: "The sea said nothing. The sea had heard this before.", ...NARRATOR },
    in_04_sunny: {
      text: "AGAIN? Already? Fine. I am in a good mood. I am always in a good mood. UP you go! HA! HA!",
      ...SUNNY,
    },
    in_05_drip: {
      text: "Wheee! Bye Drop! Bye Droplet! Bye Dripley! I will be back in about a minute!",
      ...DRIP_ROLLCALL,
    },
    in_06_narrator: {
      text: "Up he went, to the Cloud Hotel. The Cloud Hotel was closed.",
      ...NARRATOR,
    },
    in_07_narrator: {
      text: "The sign said. Closed. Important business. Back Tuesday. Also Tuesday. Cloudia.",
      ...NARRATOR,
    },
    in_08_drip: { text: "No hotel. No rules. No Kevin.", ...DRIP },
    in_09_narrator: {
      text: "A cloud does not need a hotel. It only needs drops, and specks, and a hug. So Drip hugged a speck, and so did a zillion others, and that was a cloud. A cloud with no manager. Chaos. And a cloud with no manager goes wherever the wind goes.",
      ...NARRATOR,
    },
    in_10_narrator: {
      text: "That night, two winds were blowing. One went to a green valley with a little river in it, and somebody busy. The other went to a big grey mountain, all by itself, with a hat of snow.",
      ...NARRATOR,
    },
    in_11_drip: { text: "The valley. Or the mountain. Oh no. I CANNOT PICK.", ...DRIP },
    in_12_narrator: { text: "Where should the wind take Drip? You choose!", ...NARRATOR },

    // ---------------------------------------------------------------
    // VALLEY — branch; ends on the half-choice `valleyWay`
    // ---------------------------------------------------------------
    va_01_narrator: {
      text: "In the morning the cloud with no manager was hanging over the green valley, and it was heavy, and grey, and nobody had told it what to do.",
      ...NARRATOR,
    },
    va_02_drip: {
      text: "Everybody! I am in charge now! Nobody listen to me! Which side do we fall off?",
      ...DRIP,
    },
    va_03_narrator: {
      text: "Under the left side of the cloud was the little river. Under the right side was a tree, a tall one, with a beaver at the bottom of it, chewing.",
      ...NARRATOR,
    },
    va_04_drip: {
      text: "River. Or tree. Those are very different things. I CANNOT PICK.",
      ...DRIP,
    },
    va_05_narrator: { text: "Which side should Drip fall off? You choose!", ...NARRATOR },

    // ---------------------------------------------------------------
    // DAM — after the valley half-choice; da_01..03 a/b by valleyWay
    // ---------------------------------------------------------------
    da_01a_narrator: {
      text: "Off the left side went Drip, into the little river, and the little river went downhill, as rivers do, and then it stopped. It had hit a wall. The wall was made of sticks.",
      ...NARRATOR,
    },
    da_01b_narrator: {
      text: "Off the right side went Drip, onto the top of the tree, and down a leaf, and down the trunk, and onto the head of a beaver, who was chewing it.",
      ...NARRATOR,
    },
    da_02a_drip: { text: "WHEEE! I have hit a wall. I live here now.", ...DRIP },
    da_02b_drip: {
      text: "WHEEE! Hello! I am on your head! What are you doing to this tree?",
      ...DRIP,
    },
    da_03a_narrator: {
      // Lengthened post-build (Fable, 2026-10-18) to fill its slot: the
      // right-hand variant runs twelve seconds, and the scene already plays
      // the Beaver fussing the same stick three times under this line.
      text: "On top of the wall was a beaver. He was adding a stick. He picked up the stick. He looked at the stick. He put the stick down. He picked it up again. He put it somewhere else. He was very particular about his sticks.",
      ...NARRATOR,
    },
    da_03b_narrator: {
      text: "The beaver did not answer. CRACK, went the tree, and the tree fell into the river with Drip on it, and the beaver pushed it downhill to a wall made of sticks, and added it. Drip was now part of the wall.",
      ...NARRATOR,
    },
    da_04_drip: { text: "Hello! I am Drip! What is this?", ...DRIP },
    da_05_beaver: { text: "Dam.", ...BEAVER },
    da_06_drip: { text: "A what?", ...DRIP },
    da_07_beaver: { text: "Dam.", ...BEAVER },
    da_08_narrator: {
      text: "A dam. It is a wall a beaver builds across a river, out of sticks and mud, with his teeth. His teeth are orange. That is because there is iron in them. A beaver has a little bit of metal in his mouth.",
      ...NARRATOR,
    },
    da_09_drip: { text: "I have no teeth at all. I am extremely impressed.", ...DRIP },
    da_10_narrator: {
      text: "The river could not get past the wall, so it piled up behind it, higher, and wider, and stiller, until it was not a river any more. It was a pond. And Drip let go of the wall, and floated.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // MOUNTAIN — branch; ends on the half-choice `mountainWay`
    // ---------------------------------------------------------------
    mo_01_narrator: {
      text: "In the morning the wind let go, right over the mountain, and the cloud with no manager did what clouds do.",
      ...NARRATOR,
    },
    mo_02_drip: { text: "Everybody out! I am in charge! Nobody listen to me! WHEEE!", ...DRIP },
    mo_03_narrator: {
      text: "Drip landed on the mountain, near the top. Sploosh. And the mountain was warm.",
      ...NARRATOR,
    },
    mo_04_drip: {
      text: "This mountain is WARM. Mountains are not warm. Mountains are famous for it.",
      ...DRIP,
    },
    mo_05_narrator: { text: "Then the mountain burped.", ...NARRATOR },
    mo_06_narrator: {
      text: "This mountain was a volcano. Not a loud one. A polite one. Out of a crack near the top came a trickle of lava, which is rock, so hot it has melted, and it went downhill, because everything does.",
      ...NARRATOR,
    },
    mo_07_drip: {
      text: "It is orange. It is glowing. It is going the same way as me. RACE YOU!",
      ...DRIP,
    },
    mo_08_narrator: {
      text: "The lava did not answer. Lava rarely does. It went straight down the middle, and Drip could not. On the left, the mountain was steep, and straight, and bumpy. On the right, it went round, and round, gentle, and long, and lovely.",
      ...NARRATOR,
    },
    mo_09_drip: {
      text: "Steep and bumpy. Or long and lovely. I CANNOT PICK. The lava is LEAVING.",
      ...DRIP,
    },
    mo_10_narrator: { text: "Which side should Drip race down? You choose!", ...NARRATOR },

    // ---------------------------------------------------------------
    // RACE — after the mountain half-choice; rc_01..03 a/b by mountainWay
    // ---------------------------------------------------------------
    rc_01a_narrator: {
      text: "Down the left went Drip, bump, bump, bump, and the lava came down the middle, slowly, and at the bottom there was a pond, with a wall of sticks at the far end, and Drip got there first.",
      ...NARRATOR,
    },
    rc_01b_narrator: {
      text: "Round and round went Drip, and it was lovely, and it was slow, and the lava came down the middle, slowly, but not THAT slowly, and at the bottom there was a pond, with a wall of sticks at the far end, and the lava got there first.",
      ...NARRATOR,
    },
    rc_02a_drip: { text: "I WON. I am in a pond. I live here now.", ...DRIP },
    rc_02b_drip: { text: "I LOST. To a ROCK. A slow, hot, melted ROCK.", ...DRIP },
    rc_03a_narrator: { text: "Then the lava reached the water.", ...NARRATOR },
    rc_03b_narrator: { text: "And as Drip splashed in, the lava reached the water.", ...NARRATOR },
    rc_04_narrator: {
      text: "HISSSS. The water it touched boiled into steam and went straight up, with no help from anybody. And the lava stopped. When lava cools slowly, it turns into rock. When lava cools FAST, like when it hits a pond, it turns into glass. Black glass. Shiny. It is called obsidian.",
      ...NARRATOR,
    },
    rc_05_drip: { text: "It made GLASS. The mountain made GLASS. Out of ITSELF.", ...DRIP },
    rc_06_narrator: {
      text: "Obsidian is so sharp that doctors have used it for knives. Sharper than steel. Do not touch it. Drip did not touch it. Drip has no hands.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // POND — shared trunk; ends on choice 2 (`wayOut`)
    // ---------------------------------------------------------------
    po_01a_beaver: { text: "You again. Busy.", ...BEAVER },
    po_01b_beaver: { text: "Shiny. Mine.", ...BEAVER },
    po_02_narrator: {
      text: "The beaver had a dam, and a pond, and now a piece of glass, and he was very busy, and he did not care who knew it.",
      ...NARRATOR,
    },
    po_03_drip: {
      text: "Excuse me, Beaver. I am trying to get home. Home is the sea. The sea is that way. Your wall is in the way.",
      ...DRIP,
    },
    po_04_beaver: { text: "Busy.", ...BEAVER },
    po_05_narrator: {
      text: "Here is the thing about a dam. It does not stop the water. It makes the water WAIT. And then the water finds a way out. There were two.",
      ...NARRATOR,
    },
    po_06_narrator: {
      text: "Over the top, where the pond was spilling, like a bathtub somebody forgot about. Or through the beaver's house, which sat in the middle of the pond, and had its front door under the water.",
      ...NARRATOR,
    },
    po_07_drip: { text: "Over the top. Or through the house. I CANNOT PICK.", ...DRIP },
    po_08_narrator: { text: "Which way should Drip get out? You choose!", ...NARRATOR },

    // ---------------------------------------------------------------
    // OVER — over the top of the dam
    // ---------------------------------------------------------------
    ov_01_narrator: {
      text: "Drip went over the top of the dam, like a drop going over the top of a dam. There is no better way to say it.",
      ...NARRATOR,
    },
    ov_02_drip: {
      text: "WHEEEE! Bye Beaver! Your wall is very good! It did not work on me!",
      ...DRIP,
    },
    ov_03_beaver: { text: "Busy.", ...BEAVER },
    ov_04_narrator: {
      text: "Down a little waterfall, into the river again, and the river did what rivers do, which is go downhill until there is no more downhill left.",
      ...NARRATOR,
    },
    ov_05_drip: {
      text: "I know this part! I have done this part! The sea is at the end of this part!",
      ...DRIP,
    },

    // ---------------------------------------------------------------
    // LODGE — through the beaver's house
    // ---------------------------------------------------------------
    lo_01_narrator: {
      text: "Drip sank down, and found the front door, which was under the water, and went in, which means he went up, into a room made of sticks, which was dry.",
      ...NARRATOR,
    },
    lo_02_drip: {
      text: "Hi Beaver! Hi Beaverly! Hi other Beaver! Hi Chip!",
      ...DRIP_ROLLCALL,
    },
    lo_03_narrator: { text: "Every beaver in that house is called Beaver. Except Chip.", ...NARRATOR },
    lo_04_beaver: { text: "Busy.", ...BEAVER },
    lo_05_narrator: {
      text: "A beaver's house is called a lodge. The door is under the water so nothing with teeth can walk in. This is true. Ask a beaver. He will say Busy. It is still true.",
      ...NARRATOR,
    },
    lo_06_drip: {
      text: "I came in through the FLOOR. Which was the DOOR. I have never been so confused and so dry.",
      ...DRIP,
    },
    lo_07_narrator: {
      text: "There was a back door. It was also under the water. Out he went, and under the dam, and into the river on the other side, which did what rivers do.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // HOME — shared trunk; Sunny's credits honour both choices
    // ---------------------------------------------------------------
    hm_01_narrator: { text: "The sea. Wide, and blue, and salty, and home. Again.", ...NARRATOR },
    hm_02_drip: {
      text: "Hi Drop! Hi Droplet! Hi Dripley! I am BACK! AGAIN!",
      ...DRIP_ROLLCALL,
    },
    hm_03_sunny: {
      text: "Everybody! EVERYBODY! Who did what today. It was me. Let us go over it anyway.",
      ...SUNNY,
    },
    hm_04a_sunny: {
      text: "The beaver? Beavers work in the daytime. I AM the daytime. So, me.",
      ...SUNNY,
    },
    hm_04b_sunny: {
      text: "The tree? Trees are made of sunshine. Everybody knows that. Me.",
      ...SUNNY,
    },
    hm_04c_sunny: {
      text: "The volcano? I would like it on the record that I had NOTHING to do with that. I am counting it anyway.",
      ...SUNNY,
    },
    hm_04d_sunny: {
      text: "The race? He LOST. To a rock. I was watching. I am not counting that one.",
      ...SUNNY,
    },
    hm_05a_sunny: {
      text: "Over the top? That is downhill. Downhill is still not a person. Still me.",
      ...SUNNY,
    },
    hm_05b_sunny: {
      text: "The beaver's house? I have never been inside a house. I am too big. Also me.",
      ...SUNNY,
    },
    hm_06_narrator: { text: "Sunny was right about some of that.", ...NARRATOR },
    hm_07_drip: {
      text: "Wait. No hotel. No Cloudia. Somewhere I had never been. And I STILL got home. It does not just go round. It goes round AGAIN. THE WATER CYCLE! AGAIN!",
      ...DRIP,
    },
    hm_08_narrator: {
      text: "You picked three things today. Drip has seven other trips in him, and he will take all of them, because he does not know how to stop.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // CHOICE CARDS — played by the site player, not by any scene
    // ---------------------------------------------------------------
    // where — over the last frames of `intro`
    ch_01_narrator: { text: "Where should the wind take Drip? You pick!", ...NARRATOR },
    ch_02_narrator: { text: "The beaver valley!", ...NARRATOR },
    ch_03_narrator: { text: "The big mountain!", ...NARRATOR },
    // valleyWay (half-choice) — over the last frames of `valley`
    ch_04_narrator: { text: "Which side should Drip fall off? You pick!", ...NARRATOR },
    ch_05_narrator: { text: "Left, into the river!", ...NARRATOR },
    ch_06_narrator: { text: "Right, onto the tree!", ...NARRATOR },
    // mountainWay (half-choice) — over the last frames of `mountain`
    ch_07_narrator: { text: "Which side should Drip race down? You pick!", ...NARRATOR },
    ch_08_narrator: { text: "Left, steep and bumpy!", ...NARRATOR },
    ch_09_narrator: { text: "Right, long and lovely!", ...NARRATOR },
    // wayOut — over the last frames of `pond`
    ch_10_narrator: { text: "Which way should Drip get out? You pick!", ...NARRATOR },
    ch_11_narrator: { text: "Over the top!", ...NARRATOR },
    ch_12_narrator: { text: "Through the beaver's house!", ...NARRATOR },
  },
};
