// Narration script for "Drip's Big Adventure" — Little Big World, episode one.
// Topic: the water cycle. Audience: six-year-olds. Run
// `npm run narration -- --video water-cycle` after editing; unchanged lines are
// served from cache.
//
// FORMAT
// Every line is an object so each character keeps its own voice. The file-level
// `voice` / `speed` are the house default (the Narrator); character lines
// override per line.
//
//   Narrator  af_heart  1.0   warm storyteller, occasional deadpan. Also
//                             cameo-voices the flower and the moose in Act Three
//   Drip      af_bella  1.1   small, brave, dramatic — the extra speed is the
//                             character, not a fix
//   Sunny     am_puck   1.0   the Sun. Enormous ego, and entirely correct
//   Cloudia   bf_emma   1.0   theatrical manager of the Cloud Hotel
//
// Keys are `<act>_<number>_<speaker>` in strict playback order:
// `co` cold open, `a1` ocean, `a2` sky, `a3` fall and ride home, `rc` recap.
// The screenplay in `script.md` lists which keys each of the thirty-six scenes
// consumes; the two files must be edited together.
//
// TEXT-TO-SPEECH RULES OBSERVED HERE
//   - No digits: "ninety three million", not a numeral.
//   - No percent signs, ampersands or other symbols.
//   - Sound words are spelled as words: WHOOSH, WHEEE, Sploosh, Slurp, Aaaah.
//   - Colons read as hard pauses, so there are none; commas and full stops carry
//     the rhythm instead. Exclamation marks are the main tool for energy, and
//     Cloudia's triple stack in `a2_25_cloudia` is deliberate.
//   - CAPS mark shouted words and survive the model fine.
//   - The syllable-ified Big Words are hyphenated on purpose
//     ("Ee-vap-oh-RAY-shun") so the model reads them one beat at a time. Do not
//     de-hyphenate them.
//   - Respelled for the model: "Ee-vap-oh-RAY-shun", "Con-den-SAY-shun",
//     "Pre-sip-ih-TAY-shun", "Coll-ECK-shun", "terri-wonderful". A plain "Brrr"
//     was replaced with "Ooh! Ooh!" in `a2_02_drip` rather than risk it.
//   - Audition Drip's "Aaaah! WHOOSH!" and both "WHEEE!" lines before building
//     visuals; long vowel runs are the likeliest thing here to need another pass.
const NARRATOR = { voice: "af_heart", speed: 1.0 };
const DRIP = { voice: "af_bella", speed: 1.1 };
const SUNNY = { voice: "am_puck", speed: 1.0 };
const CLOUDIA = { voice: "bf_emma", speed: 1.0 };

export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    // ---------------------------------------------------------------
    // COLD OPEN — the hook, the hero, the title
    // ---------------------------------------------------------------
    co_01_narrator: {
      text: "This is a story about a hero. A hero smaller than your pinky finger. Braver than a volcano. Wetter than a sneeze.",
      ...NARRATOR,
    },
    co_02_drip: { text: "That's me! Hello! I'm Drip!", ...DRIP },
    co_03_narrator: {
      text: "Drip is a drop of water. He is currently doing a dramatic pose.",
      ...NARRATOR,
    },
    co_04_drip: {
      text: "It's my adventure pose. I have been practicing.",
      ...DRIP,
    },
    co_05_narrator: { text: "He is very small.", ...NARRATOR },
    co_06_drip: { text: "I am NOT small! I am travel-sized!", ...DRIP },
    co_07_narrator: {
      text: "Today, Drip is going to travel all the way around the world, and come right back home. Let's go.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // ACT ONE — THE OCEAN. Big Word: EVAPORATION
    // ---------------------------------------------------------------
    a1_01_narrator: {
      text: "Our story starts in the ocean. Big. Blue. Extremely wet.",
      ...NARRATOR,
    },
    a1_02_drip: {
      text: "This is my home! And these are my brothers and sisters.",
      ...DRIP,
    },
    a1_03_narrator: {
      text: "Drip has a lot of brothers and sisters.",
      ...NARRATOR,
    },
    a1_04_drip: {
      text: "Hi Drop. Hi Droplet. Hi Dripley. Hi other Drop. Hi Droppy. Hi Drop the third.",
      ...DRIP,
    },
    a1_05_narrator: {
      text: "There are more of them than there are stars in the sky. Every single one looks exactly the same.",
      ...NARRATOR,
    },
    a1_06_drip: {
      text: "We do the same thing every day. Slosh. Then slosh. Then, for a change, slosh.",
      ...DRIP,
    },
    a1_07_drip: {
      text: "I want MORE than sloshing! I want to see the sky! I want an ADVENTURE!",
      ...DRIP,
    },
    a1_08_narrator: {
      text: "And right then, something enormous came up over the water.",
      ...NARRATOR,
    },
    a1_09_sunny: { text: "GOOD MORNING, EVERYBODY!", ...SUNNY },
    a1_10_narrator: {
      text: "This is Sunny. Sunny believes he invented mornings. He did not.",
      ...NARRATOR,
    },
    a1_11_sunny: {
      text: "I invented mornings! You're welcome! HA! HA!",
      ...SUNNY,
    },
    a1_12_drip: { text: "Whoa. Who are you?", ...DRIP },
    a1_13_sunny: {
      text: "I am the SUN! I am ninety three million miles away and you can STILL feel me! HA!",
      ...SUNNY,
    },
    a1_14_narrator: {
      text: "Sunny has a very big ego. Sunny also has a very big job.",
      ...NARRATOR,
    },
    a1_15_sunny: { text: "Watch this. I am going to warm you up.", ...SUNNY },
    a1_16_narrator: {
      text: "The sunshine poured down. And the water got warmer. And warmer.",
      ...NARRATOR,
    },
    a1_17_drip: {
      text: "Ooh. Ooh, that is toasty. I feel tingly. I feel BOUNCY!",
      ...DRIP,
    },
    a1_18_drip: {
      text: "Sunny, are you doing this to ALL the water?",
      ...DRIP,
    },
    a1_19_sunny: {
      text: "Every ocean! Every lake! Every puddle! Every single day! HA! HA!",
      ...SUNNY,
    },
    a1_20_narrator: {
      text: "Here is the secret. Warm water drops wiggle. And wiggly drops get light. So light that they float right up into the air.",
      ...NARRATOR,
    },
    a1_21_drip: {
      text: "Wait. Wait wait wait. My feet are leaving the ocean!",
      ...DRIP,
    },
    a1_22_drip: {
      text: "Aaaah! WHOOSH! I am FLYING! This is TERRIBLE! This is WONDERFUL! It is terri-wonderful!",
      ...DRIP,
    },
    a1_23_sunny: { text: "You're welcome! HA! HA!", ...SUNNY },
    a1_24_narrator: {
      text: "That has a name, and it is a big one. When the sun warms water until it floats up into the air, that is evaporation.",
      ...NARRATOR,
    },
    a1_25_drip: { text: "Ee-vap-oh-RAY-shun!", ...DRIP },
    a1_26_narrator: { text: "Evaporation. Say it with him.", ...NARRATOR },
    a1_27_drip: {
      text: "EE-VAP-OH-RAY-SHUN! I am doing evaporation! I am the best at it!",
      ...DRIP,
    },
    a1_28_narrator: {
      text: "He is doing exactly as well as every other drop.",
      ...NARRATOR,
    },
    a1_29_drip: { text: "I am the best at it QUIETLY.", ...DRIP },

    // ---------------------------------------------------------------
    // ACT TWO — THE SKY. Big Word: CONDENSATION
    // ---------------------------------------------------------------
    a2_01_narrator: {
      text: "Up went Drip. Past the birds. Past the airplanes. Up where the air is thin and cold.",
      ...NARRATOR,
    },
    a2_02_drip: {
      text: "Ooh! Ooh! Why is it so COLD up here? I am a warm drop! I have feelings!",
      ...DRIP,
    },
    a2_03_narrator: {
      text: "The higher you go, the colder it gets. And cold makes floating water want to be a drop again.",
      ...NARRATOR,
    },
    a2_04_drip: {
      text: "Ooh. I can feel myself getting droppy again.",
      ...DRIP,
    },
    a2_05_narrator: {
      text: "Then, out of the mist, a door. And a sign. And a lady with a very grand voice.",
      ...NARRATOR,
    },
    a2_06_cloudia: {
      text: "Welcome, darling, to the CLOUD HOTEL! I am Cloudia. I run this establishment.",
      ...CLOUDIA,
    },
    a2_07_drip: { text: "Whoa. Is this a giant fluffy pillow?", ...DRIP },
    a2_08_cloudia: {
      text: "A PILLOW? Darling. No. Absolutely not.",
      ...CLOUDIA,
    },
    a2_09_narrator: {
      text: "Big myth, busted. Clouds are not fluffy. Clouds are not soft. If you sat on one, you would go straight through.",
      ...NARRATOR,
    },
    a2_10_cloudia: {
      text: "A cloud is a zillion tiny water drops, floating together. That is all! No fluff! No feathers!",
      ...CLOUDIA,
    },
    a2_11_drip: { text: "So the hotel is made of the guests?", ...DRIP },
    a2_12_cloudia: {
      text: "Exactly, darling. You are the wallpaper. Check in, please.",
      ...CLOUDIA,
    },
    a2_13_cloudia: {
      text: "Now. Every guest must hug a speck of dust. House rules!",
      ...CLOUDIA,
    },
    a2_14_drip: { text: "Dust? Why dust?", ...DRIP },
    a2_15_narrator: {
      text: "This part is true, and it is wonderful. Every drop in every cloud is hugging a tiny speck of dust or salt.",
      ...NARRATOR,
    },
    a2_16_narrator: {
      text: "Without a speck to hug, the drop cannot form at all. No dust, no clouds. No clouds, no rain.",
      ...NARRATOR,
    },
    a2_17_drip: {
      text: "Hello, dust speck. I shall call you Kevin.",
      ...DRIP,
    },
    a2_18_cloudia: {
      text: "Kevin is a lovely name for a speck of dust, darling.",
      ...CLOUDIA,
    },
    a2_19_narrator: {
      text: "When cold air turns floating water back into drops, that is condensation.",
      ...NARRATOR,
    },
    a2_20_drip: { text: "Con-den-SAY-shun!", ...DRIP },
    a2_21_cloudia: {
      text: "Condensation, darling. It is how I get all of my guests.",
      ...CLOUDIA,
    },
    a2_22_narrator: { text: "And the guests kept coming.", ...NARRATOR },
    a2_23_cloudia: {
      text: "Room for one more! And one more. And, oh my.",
      ...CLOUDIA,
    },
    a2_24_narrator: {
      text: "More and more drops arrived. The hotel grew. The hotel got crowded.",
      ...NARRATOR,
    },
    a2_25_cloudia: {
      text: "Please stop arriving! We are at! Full!! Capacity!!!",
      ...CLOUDIA,
    },
    a2_26_drip: { text: "It is getting dark in here.", ...DRIP },
    a2_27_narrator: {
      text: "A crowded cloud turns grey. That is not magic. That is just too many drops for the sunlight to get through.",
      ...NARRATOR,
    },
    a2_28_sunny: { text: "Rude. I was shining SO nicely.", ...SUNNY },
    a2_29_cloudia: {
      text: "The hotel is heavy, darling. Very heavy. I love my guests. I hate gravity.",
      ...CLOUDIA,
    },
    a2_30_narrator: {
      text: "And a heavy hotel cannot stay in the sky.",
      ...NARRATOR,
    },

    // ---------------------------------------------------------------
    // ACT THREE — THE FALL AND THE RIDE HOME.
    // Big Words: PRECIPITATION, COLLECTION
    // ---------------------------------------------------------------
    a3_01_cloudia: { text: "Everybody OUT! It is check-out time!", ...CLOUDIA },
    a3_02_drip: { text: "Wait! How do I get down the stairs?", ...DRIP },
    a3_03_cloudia: { text: "Darling. There are no stairs.", ...CLOUDIA },
    a3_04_drip: { text: "Ohhhh nooooo. WHEEE!", ...DRIP },
    a3_05_narrator: {
      text: "Down he went. The best waterslide ever built, and it goes all the way from the sky to the ground.",
      ...NARRATOR,
    },
    a3_06_drip: {
      text: "This is the greatest thing I have EVER done!",
      ...DRIP,
    },
    a3_07_narrator: {
      text: "When drops fall out of a cloud, that is precipitation. Rain, snow, sleet, hail. All of it is precipitation.",
      ...NARRATOR,
    },
    a3_08_drip: { text: "Pre-sip-ih-TAY-shun! WHEEE!", ...DRIP },
    a3_09_narrator: { text: "Precipitation. The falling part.", ...NARRATOR },
    a3_10_narrator: {
      text: "Drip landed high on a mountain. Sploosh.",
      ...NARRATOR,
    },
    a3_11_drip: {
      text: "I have landed! I am a mountain drop now! I live here!",
      ...DRIP,
    },
    a3_12_narrator: {
      text: "In winter, drops like Drip land as snow instead, and wait on the mountain until spring.",
      ...NARRATOR,
    },
    a3_13_drip: {
      text: "I want to try that next time. I would look GREAT as a snowflake.",
      ...DRIP,
    },
    a3_14_drip: { text: "Hey. Why am I moving?", ...DRIP },
    a3_15_narrator: {
      text: "Because water always rolls downhill. Always. Every time.",
      ...NARRATOR,
    },
    a3_16_drip: { text: "Downhill it is!", ...DRIP },
    a3_17_narrator: {
      text: "A trickle became a stream. The stream met another stream. And the streams became a river.",
      ...NARRATOR,
    },
    a3_18_drip: {
      text: "There are so many of us! Hi! Hi! Hi! Where are we all going?",
      ...DRIP,
    },
    a3_19_narrator: {
      text: "Along the way, the river had visitors.",
      ...NARRATOR,
    },
    a3_20_narrator: {
      text: "A flower leaned over and drank a bit of him. Slurp.",
      ...NARRATOR,
    },
    a3_21_drip: { text: "Excuse me! That was my elbow!", ...DRIP },
    a3_22_narrator: {
      text: "Then a moose walked in and stood right in the middle of the river.",
      ...NARRATOR,
    },
    a3_23_narrator: {
      text: "The moose said, and I am quoting exactly, mmm. Nice water. I live here now.",
      ...NARRATOR,
    },
    a3_24_drip: {
      text: "Sir! SIR! You are standing on my family!",
      ...DRIP,
    },
    a3_25_narrator: {
      text: "The moose did not move. Moose rarely do.",
      ...NARRATOR,
    },
    a3_26_drip: { text: "Fine. FINE! We will go AROUND the moose.", ...DRIP },
    a3_27_narrator: {
      text: "They went around the moose.",
      ...NARRATOR,
    },
    a3_28_narrator: {
      text: "Farmers took some for their fields. A town took some for its taps. Somebody's bath. Somebody's teeth.",
      ...NARRATOR,
    },
    a3_29_drip: {
      text: "Everybody wants a bit of me! I am very popular!",
      ...DRIP,
    },
    a3_30_narrator: {
      text: "Then the river turned a corner. And the water got wide, and blue, and salty, and enormous.",
      ...NARRATOR,
    },
    a3_31_drip: { text: "I know this place.", ...DRIP },
    a3_32_narrator: {
      text: "When all the water gathers back into the streams, the rivers and the ocean, that is collection. The gathering-up part.",
      ...NARRATOR,
    },
    a3_32b_drip: { text: "Coll-ECK-shun! I have been collected!", ...DRIP },
    a3_33_drip: {
      text: "Hi Drop! Hi Droplet! Hi Dripley! I am BACK!",
      ...DRIP,
    },
    a3_34_drip: {
      text: "Wait. Wait a minute. I went UP. I went across the sky. I went down a mountain.",
      ...DRIP,
    },
    a3_35_drip: {
      text: "And I came all the way home. I ended up exactly where I started!",
      ...DRIP,
    },
    a3_36_narrator: {
      text: "You did. That is the twist, Drip. It is not a line. It is a circle.",
      ...NARRATOR,
    },
    a3_37_drip: {
      text: "A circle. A CYCLE! THE WATER CYCLE!",
      ...DRIP,
    },
    a3_38_sunny: {
      text: "AND I POWER THE WHOLE THING! You're welcome! HA! HA!",
      ...SUNNY,
    },
    a3_39_narrator: {
      text: "This time, annoyingly, he is completely right.",
      ...NARRATOR,
    },
    a3_40_narrator: {
      text: "And it never stops. Not once. Not ever.",
      ...NARRATOR,
    },
    a3_41_drip: {
      text: "So I get to do it all AGAIN? Sunny! Warm me up! I am ready!",
      ...DRIP,
    },
    a3_42_sunny: { text: "Say the magic words.", ...SUNNY },
    a3_43_drip: { text: "You're welcome?", ...DRIP },
    a3_44_sunny: { text: "HA! HA! Good drop.", ...SUNNY },

    // ---------------------------------------------------------------
    // RECAP — the chant, the mind-blower, the tease
    // ---------------------------------------------------------------
    rc_01_narrator: {
      text: "Let's say the four big words together. Ready?",
      ...NARRATOR,
    },
    rc_02_sunny: {
      text: "EVAPORATION! The sun warms the water and it floats up! That is me!",
      ...SUNNY,
    },
    rc_03_cloudia: {
      text: "CONDENSATION! It gets cold, the drops come back, and I get guests!",
      ...CLOUDIA,
    },
    rc_04_drip: {
      text: "PRECIPITATION! The best waterslide ever! WHEEE!",
      ...DRIP,
    },
    rc_05_narrator: {
      text: "COLLECTION. The water gathers in the streams, the rivers and the ocean, ready to go around again.",
      ...NARRATOR,
    },
    rc_06_narrator: {
      text: "Evaporation. Condensation. Precipitation. Collection. Around, and around, and around.",
      ...NARRATOR,
    },
    rc_07_narrator: {
      text: "Now here is the amazing part. Our planet has never made any new water. Not one single drop.",
      ...NARRATOR,
    },
    rc_08_narrator: {
      text: "It is the same water going around, and around, and around, for millions and millions of years.",
      ...NARRATOR,
    },
    rc_09_narrator: {
      text: "So the water in your bath tonight? It might once have been a dinosaur's puddle.",
      ...NARRATOR,
    },
    rc_10_drip: {
      text: "I might have been a dinosaur's puddle! That is the coolest thing anybody has ever said about me!",
      ...DRIP,
    },
    rc_11_narrator: {
      text: "Next time. Where does the WIND come from?",
      ...NARRATOR,
    },
    rc_12_sunny: {
      text: "OH, that one is me as well! HA! HA!",
      ...SUNNY,
    },
    rc_13_narrator: {
      text: "Sunny is already taking credit. See you next time.",
      ...NARRATOR,
    },
    rc_14_drip: { text: "Bye! I am Drip! I am travel-sized!", ...DRIP },
  },
};
