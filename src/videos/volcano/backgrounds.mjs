// Painted backgrounds for "Ember and the Mountain That Said Good Morning"
// (kids ep 5).
//
// Read scripts/generate-backgrounds.mjs first; `npm run backgrounds -- --video
// volcano` turns this file into public/backgrounds/volcano/*.webp plus a
// generated backgroundManifest.ts. Nothing here is rendered directly.
//
// ---------------------------------------------------------------------------
// THE ONE RULE THIS EPISODE'S PLATES EXIST TO SERVE: **THE MOUNTAIN IS NEVER
// PAINTED.**
//
// He has stood on the horizon of every coastal wide since episode two as an SVG
// component, and in this episode he opens his eyes, speaks seven times, erupts,
// and is pushed in on until he fills the frame. Every one of those is a thing a
// painting cannot do. So:
//
//   - every sea horizon below is prompted EMPTY, and empty is *described*
//     rather than negated (the ep-2 turbine lesson: "no wind turbines" put two
//     on the ridge). The words "volcano", "mountain", "island", "peak",
//     "summit" and "hill" appear in none of these prompts.
//   - the horizon line is asked for STRAIGHT and level, because
//     `COAST.horizon` is the line his feet seat on in `scenes/common.tsx`, and
//     a painted horizon that slopes cannot be argued with.
//
// NO PAINTED SUN AND NO PAINTED MOON, anywhere (ep-3/ep-4 rule). Sunny is a
// character with a face. Naming a disc summons it and forbidding it still
// leaves a picture with a disc-shaped hole; the only thing that works is
// removing the lighting condition — an evenly-coloured sky with nowhere for a
// disc to go. The words "sun", "sunrise", "sunset" and "moon" appear in none of
// these prompts either.
//
// ---------------------------------------------------------------------------
// WHAT A PROMPT HAS TO BUY, beyond a pretty picture (unchanged, eps 2–4):
//
//   1. A clean lower third. The kid kneels at `COAST.ground` (940 of 1080) in
//      the cold open and the recap, and Ember is a small bright body low in
//      frame for most of act one; painted detail down there fights a character.
//      Every beach prompt asks for the sand "seen from slightly above" — the
//      move that finally beat flux's grass-fringe reflex in ep 4 — so the near
//      band is a surface rather than a profile.
//   2. Open sky through the middle and upper half. Bubbles stack there.
//      Clouds in the corners, never low near the horizon where he reads.
//   3. No characters, no text, no birds, no boats.
//   4. Nothing that is already SVG: the volcano, Sunny, Ember, the magma crowd,
//      the sandcastle, the vent, the lava, the sea's rolling edge, the smoke,
//      every card and every bubble.
//
// ---------------------------------------------------------------------------
// SET SO FAR: the cold open and act one (skeleton wave). Acts two and three add
// their own keys to `backgrounds` below and run the generator for just those —
// the cache is per key, so an added key costs one image and nothing else
// re-rolls. **Do not touch `styleAnchor` when you add one**: it is appended to
// every prompt in the episode and editing it re-rolls the whole set.
//
// Keys an act agent is expected to need (NOT generated yet, named here so two
// agents do not invent two names for one place):
//   act 2   `coast_day` is already here (Scene 9 reuses it); add
//           `lava_slope_day` (the flow's slope, bare dark ground) and
//           `coast_night` (Scene 17's sea meets lava).
//   act 3   `island_chain_dusk` (the archipelago wide — see the roll call),
//           `black_beach_night`, `meadow_day` (Scene 24, Pip's meadow — the
//           ep-4 field, re-prompted here because plates are per video).

export default {
  // Episode four's anchor, verbatim. That identity is the point rather than
  // laziness: episodes two through five have to look like one show, and the
  // anchor is the only thing making that true across four separately-generated
  // sets. It was tuned on a single plate in ep 4 before twelve more were spent
  // and two richer variants were tried and were worse — flux-schnell answers
  // every one of these prompts with the same smooth flat cartoon landscape, and
  // words spent fighting for a texture it will not give are words taken off the
  // ones doing real work.
  styleAnchor:
    "background art for a preschool animated series, soft gouache painting, " +
    "visible brush texture, saturated storybook colour, gentle airbrushed " +
    "shading, soft rounded shapes, simple uncluttered composition, no " +
    "characters, no people, no animals, no buildings, no fences, no text, " +
    "no watermark, not photographic",

  backgrounds: {
    // --- THE COAST ---------------------------------------------------------
    //
    // Two plates, ONE SKELETON: read them side by side and the only differences
    // are colour words. That is what makes them the same beach at two hours
    // rather than two beaches — and the episode opens on one and closes on the
    // other, with the audience holding the picture in between.
    //
    // Both are written for `COAST.horizon` (560 of 1080 = 0.519): "one straight
    // level horizon a little above the middle of the frame". The measured
    // skyline goes in `PLATES` in scenes/common.tsx and the seat is derived
    // from it, so the number here only has to be close.

    /** Scenes 1–3: the first frame of the episode. The last quiet morning. */
    coast_dawn: {
      prompt:
        "a wide calm empty seashore very early on a still clear morning seen " +
        "from slightly above looking down across the beach, painted as flat " +
        "simplified storybook shapes, the bottom third of the frame a broad " +
        "plain sweep of pale warm sand seen from above as one smooth flat " +
        "surface of colour with no pebbles, no shells, no seaweed, no " +
        "footprints, no ripples and no detail in it at all, staying completely " +
        "plain and smooth right down to the bottom edge of the frame, above it " +
        "a wide calm band of soft pale teal water, one straight level horizon " +
        "line placed a little above the middle of the frame with a completely " +
        "bare empty sea horizon that has nothing standing on it anywhere along " +
        "its whole length, and the sky filling the top half evenly coloured " +
        "all the way across in soft pale peach fading up into gentle cool blue, " +
        "the same brightness everywhere with no bright spot and no glare, two " +
        "or three small soft clouds only in the top corners",
    },

    /** Scene 9's cut-wide and the recap's beach. The same beach, hours on. */
    coast_day: {
      prompt:
        "a wide calm empty seashore in bright late morning seen from slightly " +
        "above looking down across the beach, painted as flat simplified " +
        "storybook shapes, the bottom third of the frame a broad plain sweep " +
        "of warm golden sand seen from above as one smooth flat surface of " +
        "colour with no pebbles, no shells, no seaweed, no footprints, no " +
        "ripples and no detail in it at all, staying completely plain and " +
        "smooth right down to the bottom edge of the frame, above it a wide " +
        "band of deep saturated turquoise water, one straight level horizon " +
        "line placed a little above the middle of the frame with a completely " +
        "bare empty sea horizon that has nothing standing on it anywhere along " +
        "its whole length, and the sky filling the top half evenly coloured " +
        "all the way across in deep clear blue, the same brightness everywhere " +
        "with no bright spot and no glare, two or three small soft white " +
        "clouds only in the top corners",
    },

    // --- OPEN WATER: the two plates the mountain is a PORTRAIT against ------
    //
    // Scene 4 (the title, the first time the series has ever looked straight at
    // him) and Scene 9 (V1, the first line the scenery has ever spoken) both
    // frame him head on across open water. He is drawn over the middle of these
    // at hero scale, so the horizon sits LOW — a third of the way up — and
    // everything above it is the empty sky he stands into.
    //
    // The bottom band is water rather than sand: this framing is out at sea,
    // looking back at him, which is the whole reason it reads as a different
    // shot rather than a zoom.

    /** Scene 4 — the title, over the mountain, at dawn. */
    sea_horizon_dawn: {
      prompt:
        "a wide expanse of completely calm open water under an enormous open " +
        "early morning sky, painted as flat simplified storybook shapes, the " +
        "bottom third of the frame one smooth plain band of soft dark teal " +
        "water with no waves, no foam, no boats and no detail in it at all, " +
        "one straight level horizon line placed low, about a third of the way " +
        "up the frame, completely bare and empty along its whole length with " +
        "nothing standing on it anywhere, and above it the sky filling the " +
        "entire upper two thirds of the picture, evenly coloured all the way " +
        "across in soft peach and rose low down fading up into deep cool blue, " +
        "the same brightness everywhere with no bright spot and no glare, " +
        "completely empty and open through the middle, a few small soft clouds " +
        "only in the very top corners",
    },

    /** Scene 9 — the wake. The same water, full daylight. */
    sea_horizon_day: {
      prompt:
        "a wide expanse of calm open water under an enormous open bright " +
        "midday sky, painted as flat simplified storybook shapes, the bottom " +
        "third of the frame one smooth plain band of deep saturated turquoise " +
        "water with no waves, no foam, no boats and no detail in it at all, " +
        "one straight level horizon line placed low, about a third of the way " +
        "up the frame, completely bare and empty along its whole length with " +
        "nothing standing on it anywhere, and above it the sky filling the " +
        "entire upper two thirds of the picture, evenly coloured all the way " +
        "across in clear saturated blue, the same brightness everywhere with " +
        "no bright spot and no glare, completely empty and open through the " +
        "middle, a few small soft white clouds only in the very top corners",
    },

    // --- DOWNSTAIRS --------------------------------------------------------
    //
    // Act one's world, and the first time the series has been underground. The
    // rule that governs all three is the same one the coast plates have: what
    // MOVES is drawn. The glow-drops, Ember, the vent, the rising column and
    // every crack of light are SVG on top; these three are the room.
    //
    // They are also the episode's laugh-clock risk (script.md's self-map flags
    // Scene 5), so they are prompted as WARM and inviting rather than as a
    // cave. Nothing in this episode is ever scary: downstairs is a basement
    // somebody has been comfortable in for ten thousand years.

    /**
     * Scene 5's descent — "down through dirt, down through rock, warmer,
     * warmer". A tall column of strata the camera slides DOWN, so it is
     * prompted as horizontal bands with no composition in them: the shot
     * travels through it and any feature would read as a landmark going by
     * twice.
     */
    strata_column: {
      // FIRST ROLL WAS WRONG AND THIS IS THE FIX, LOGGED. Asking for "wide calm
      // horizontal bands stacked one above another" got a handsome set of
      // *diagonal* wavy strata climbing to frame right — beautiful, and useless
      // for a shot that slides straight down through it, because a sloping band
      // reads as a hillside going past rather than as ground you are descending
      // through. The words that fixed it are "perfectly level", "parallel",
      // "edge to edge" and "like a striped flag lying on its side" — a simile
      // rather than an adjective, because "horizontal" alone did not survive
      // the model's landscape reflex.
      prompt:
        "a flat straight-on diagram of layers of ground seen in cross-section, " +
        "painted as flat simplified storybook shapes, filling the whole frame " +
        "with perfectly level parallel horizontal stripes of colour running " +
        "straight from the left edge to the right edge like a striped flag " +
        "lying on its side, every stripe dead level with no slope and no curve " +
        "anywhere, dark chocolate brown at the top, then dusty mauve, then warm " +
        "grey, then deep ember red at the very bottom, each stripe one even " +
        "soft colour with very gentle brush texture and nothing inside it, no " +
        "stones, no roots, no cracks, no fossils, no plants, no tunnels, no " +
        "hills, no landscape, completely flat and uniform, very low contrast, " +
        "calm and warm",
    },

    /**
     * Scenes 5–7 — the world's basement. The chamber the magma crowd waits in,
     * and Ember's whole life until the doors open.
     *
     * The floor glow is painted (it is the room's light and it does not move)
     * and everything standing in it is drawn. The middle is asked for open and
     * plain twice, because it carries dozens of SVG glow-drops with faces plus
     * the hero plus her bubbles.
     */
    magma_chamber: {
      prompt:
        "the inside of an enormous warm rounded underground chamber seen " +
        "straight on, painted as flat simplified storybook shapes, a high " +
        "smooth arched ceiling of soft dark plum and warm brown stone across " +
        "the top of the frame and smooth rounded stone walls curving down the " +
        "left and right edges, the whole middle of the frame left completely " +
        "open and plain and empty, the bottom third one broad flat pool of " +
        "glowing molten orange and deep gold light lying perfectly level and " +
        "still with no detail, no bubbles, no splashes and no ripples in it, " +
        "a soft warm amber glow washing gently up the walls, cosy and inviting " +
        "rather than frightening, very low contrast, no cracks, no stalactites, " +
        "no crystals, no machinery",
    },

    /**
     * Scene 8 — "the whole basement began to move. Up." A vertical shaft, so
     * this one's bands run UP the frame rather than across it: the rise is sold
     * by drawn things climbing past drawn walls, and the plate only has to be a
     * warm chimney that is plainly not the chamber.
     */
    magma_shaft: {
      prompt:
        "the inside of a tall narrow vertical rock chimney seen straight on " +
        "from within, painted as flat simplified storybook shapes, smooth " +
        "rounded walls of warm dark brown and plum stone running vertically up " +
        "both sides of the frame, a wide plain open column of soft glowing " +
        "amber and deep orange light filling the whole middle of the frame " +
        "from top to bottom with nothing in it at all, no sparks, no bubbles, " +
        "no rubble, no ledges, no detail, evenly lit all the way up with no " +
        "bright spot, very low contrast, calm and warm",
    },
  },
};

// --- THE DELIVERED SET, MEASURED -------------------------------------------
//
// Filled in by the skeleton builder after the first run; `PLATES` in
// scenes/common.tsx is the table the acts consume, and its `skyline` numbers
// are what seat the volcano on the painted horizon. See the measurement note
// at the bottom of src/videos/plants/backgrounds.mjs for the method
// (scratchpad/ep4b2/measure.mjs + skyline.mjs).
//
//   key                meanLum  skyline  notes
//   coast_dawn            —       —      Scenes 1–3
//   coast_day             —       —      Scene 9 wide, recap
//   sea_horizon_dawn      —       —      Scene 4 portrait
//   sea_horizon_day       —       —      Scene 9 portrait
//   strata_column         —      null    no horizon: a travelling cross-section
//   magma_chamber         —      null    no horizon
//   magma_shaft           —      null    no horizon
