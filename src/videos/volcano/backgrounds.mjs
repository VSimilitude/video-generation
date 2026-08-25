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

    // --- ACT 3 PLATES ------------------------------------------------------
    //
    // Act three happens out at the island chain, and **the chain is DRAWN, not
    // painted** — which is the volcano rule applied one step further out. The
    // five islands get named in the roll call, they are eye-lined one at a
    // time, Ember stands on the newest one, and the newest one is a different
    // HEIGHT in each of Scene 19's four named spans. Every one of those is a
    // thing a painting cannot do, so these three plates buy sky, far water and
    // one straight empty horizon, exactly as the two `sea_horizon_*` plates do,
    // and the archipelago is SVG on top of them.
    //
    // The two sea plates below are **one skeleton in two lights** — read them
    // side by side and only the colour words differ — for the same reason the
    // coast pair is: Scene 19 jump-cuts between named spans and the horizon
    // must not move when the light does. `plateFit` seats each plate's own
    // measured skyline on the scene's seat line, so a span change is a change
    // of hour and nothing else.

    /**
     * Scene 18 (the roll call), Scene 19's second span, Scene 23 (the turn) and
     * Scene 26 (the break). The hour act three mostly lives in.
     *
     * The horizon sits a little ABOVE the middle rather than a third of the way
     * up like the portraits: the chain recedes across the near water and the
     * lower half of the frame is where it is drawn.
     */
    island_chain_dusk: {
      prompt:
        "a wide expanse of completely calm open water late in the day under a " +
        "big open sky, painted as flat simplified storybook shapes, the lower " +
        "half of the frame one smooth plain band of deep dusky teal and slate " +
        "blue water with no waves, no foam, no boats and no detail in it at " +
        "all, staying completely plain and smooth right down to the bottom " +
        "edge of the frame, one straight level horizon line placed a little " +
        "above the middle of the frame, completely bare and empty along its " +
        "whole length with nothing standing on it anywhere, and above it the " +
        "sky evenly coloured all the way across in warm apricot and soft rose " +
        "low down fading up into deep dusky blue, the same brightness " +
        "everywhere with no bright spot and no glare, completely empty and " +
        "open through the middle, a few small soft clouds only in the very " +
        "top corners",
    },

    /**
     * Scene 19's first span — "here is one year later", at night, with the
     * fountain going. The one plate in the episode whose near band is BLACK
     * SAND, which is what the newest island is made of; every drawn ground in
     * act three tints from its `near` colour.
     *
     * "A friendly night, never black" is ep 4's meadow-night rule and it holds
     * here: deep indigo, and the only warm light in the shot is the drawn
     * fountain, because this episode's eruption is a birth from its first
     * frame to its last.
     *
     * **RE-ROLLED ONCE, and the lesson is the painted-disc one again.** Round
     * one asked for "a faint warm amber glow lying low along the horizon" to
     * light the shore. It came back as a small bright warm spot in the dead
     * centre of the horizon with a glare path under it — a setting sun by any
     * other name, in an episode whose plates may not contain one, and directly
     * against the "same brightness everywhere, no bright spot" rule. **A glow
     * is a lighting condition, and asking for one summons its source** exactly
     * as "sunset" does. The fix was not to negate it (naming it again would
     * paint it again) but to *describe the even version*: "the same deep
     * indigo blue from edge to edge, the horizon line the same brightness
     * along its whole length". The light in this shot is SVG, like everything
     * else that matters in this episode.
     */
    black_beach_night: {
      prompt:
        "a wide calm empty seashore of dark volcanic sand at night seen from " +
        "slightly above looking down across the shore, painted as flat " +
        "simplified storybook shapes, the bottom third of the frame a broad " +
        "plain sweep of very dark charcoal grey sand seen from above as one " +
        "smooth flat surface of colour with no pebbles, no shells, no " +
        "seaweed, no footprints and no detail in it at all, staying completely " +
        "plain and smooth right down to the bottom edge of the frame, above " +
        "it a wide calm band of deep midnight teal water, one straight level " +
        "horizon line placed a little above the middle of the frame with a " +
        "completely bare empty sea horizon that has nothing standing on it " +
        "anywhere along its whole length, and the sky filling the top half " +
        "the same deep friendly indigo blue from edge to edge, the horizon " +
        "line the same brightness along its whole length, the same brightness " +
        "everywhere with no bright spot and no glare, a calm friendly night, " +
        "deep blue and never black",
    },

    /**
     * Scene 24 — the meadow, and it is **episode four's meadow**, which is why
     * this prompt is ep 4's `meadow_day` almost verbatim (plates are per video,
     * so the same field has to be asked for twice). Pip is rooted exactly where
     * that episode left her and the volcano is on this horizon too — awake now,
     * and smoking, behind a plant grading a pinch of him.
     */
    meadow_day: {
      prompt:
        "a wide gently rolling summer meadow at midday seen from slightly " +
        "above, looking down across the field, painted as flat simplified " +
        "storybook shapes, the bottom half of the frame a broad plain sweep of " +
        "short mown fresh grass green and yellow-green, seen from above as one " +
        "smooth flat surface of colour with no individual blades of grass, no " +
        "tufts, no seed heads, no wheat and no detail in it at all, staying " +
        "completely plain and smooth right down to the bottom edge of the " +
        "frame, one straight simple horizon line placed just below the middle " +
        "of the frame with the sky filling the whole top half of the picture, " +
        "and along that horizon a low line of hazy blue-green distant hills, " +
        "the horizon an unbroken smooth empty line with nothing standing " +
        "anywhere along it and nothing breaking its outline, an enormous " +
        "brilliant cyan blue sky above with three big soft rounded white clouds " +
        "high up in the left and right corners, the middle of the sky open and " +
        "empty, empty uncluttered foreground, an empty open field with nothing " +
        "growing above the grass",
    },

    // --- ACT 2 PLATES ------------------------------------------------------
    //
    // Act two leaves the two established vantages (the beach, and the water
    // looking back at him) exactly twice, and both times for the same reason:
    // **the traffic jam and the ceremony happen ON the mountain**, on his own
    // flank, half a mile below a crater that is busy. From there he is the
    // ground under the shot rather than a shape on the horizon — which is the
    // same sanctioned exemption act one takes underground, arrived at from the
    // other side. Neither plate below has him in it and neither can: he is the
    // thing the camera is standing on. Everything that erupts, flows, cools,
    // crusts, steams or sits is SVG on top.

    /**
     * Scenes 12–16 — the flow's slope. The world's slowest traffic jam, the
     * unmoving countdown, and the ceremony, all in one unmoving framing.
     *
     * Prompted DARK and prompted EMPTY, and both are load-bearing. Dark,
     * because everything that matters in these five scenes is a bright orange
     * body on it — the flow, Ember, the glow that reaches Rock — and a warm
     * plate would swallow all three. Empty, because the shot never moves for
     * eighty-seven seconds and any painted feature would be a thing the eye
     * finds on frame two and is bored of by frame two hundred.
     *
     * The sky is the whole top half rather than a strip: Scene 15 puts Sunny at
     * maximum altitude in it, four episodes of a perfect record behind him, and
     * he is 460 units tall.
     *
     * **FIRST ROLL WAS WRONG AND THIS IS THE FIX, LOGGED — and it is the
     * `strata_column` lesson a second time, from a new angle.** Asking for a
     * "bare dark hillside seen from the side" whose top edge "slopes very
     * gently downhill … like a low dune lying across the picture" came back as
     * a warm tan DESERT: four separate dunes, a range of blue hills on the
     * horizon, and pebbles scattered over the near field that the prompt had
     * forbidden by name. The simile was the problem this time — "dune" is a
     * landform, and naming any landform hands flux a landscape to compose.
     *
     * What fixed it in one roll was giving up the slope in the *painting*
     * altogether and re-using the skeleton that already works in this episode:
     * `coast_dawn`'s, with the sea deleted and the colour words swapped. The
     * ground is now asked for **perfectly level** ("like a dark tabletop seen
     * from the far side"), which is the one shape that cannot grow a hill, and
     * the slope is carried entirely by the drawn flow running downhill across
     * it. That is also the honest division of labour: STYLE says where a
     * painted shape and a ground line disagree the ground line wins, so a plate
     * with no topography in it is a plate that can never disagree.
     *
     * Dark, and it is load-bearing: everything that matters in these five
     * scenes is a bright orange body on it — the flow, Ember, the glow that
     * finally reaches Rock — and the first roll's warm tan swallowed all three.
     */
    lava_slope_day: {
      prompt:
        "a wide completely flat empty plain of dark cooled volcanic ground " +
        "under a big open sky, painted as flat simplified storybook shapes, " +
        "the bottom half of the frame one broad plain sweep of very dark " +
        "plum-grey and charcoal ground seen from slightly above looking down " +
        "across it as one smooth flat surface of colour, perfectly level and " +
        "even all the way across from the left edge to the right edge like a " +
        "dark tabletop seen from the far side, with no pebbles, no stones, no " +
        "boulders, no cracks, no plants, no paths and no detail in it at all, " +
        "staying completely plain and smooth right down to the bottom edge of " +
        "the frame, one straight level line a little above the middle of the " +
        "frame where the dark ground meets the sky, completely bare and empty " +
        "along its whole length with nothing standing on it anywhere, and " +
        "above it the sky filling the whole top half evenly coloured all the " +
        "way across in warm hazy amber low down fading up into soft dusty " +
        "blue, the same brightness everywhere with no bright spot and no " +
        "glare, completely empty and open through the middle, two or three " +
        "small soft clouds only in the top corners",
    },

    /**
     * Scene 17 — the surge, and the night the sea meets the lava.
     *
     * This one DOES carry a sea horizon and the volcano DOES stand on it: the
     * camera has come down off the flank onto the newest ground in the world
     * and is looking back along the coast, so the erupting summit is up-coast
     * at frame left and the flow arriving in the near field is his. It is the
     * one shot in the episode where the whole chain — crater, slope, sea — is
     * in one picture, and it is the reason the plate is written as a sibling
     * of `coast_dawn`/`coast_day` rather than as a new place: same skeleton,
     * colour words changed, so the horizon does not move when the hour does.
     *
     * "A friendly night, never black" is ep 4's meadow-night rule, and it is
     * doubly right here — the thing making the light is a volcano building an
     * island, and this eruption is a birth from its first frame to its last.
     * The near band is drawn over (`NightShore` in `act2.tsx`) on the ep-4
     * `NearField` mechanism, so nothing stands on painted ground.
     *
     * **FIRST ROLL WAS WRONG AND THIS IS THE FIX, LOGGED.** The prompt asked
     * for "a faint warm amber glow lying low along the horizon" and got a
     * bright yellow LENS FLARE sitting on the horizon at frame centre — the
     * ep-3/ep-4 disc rule firing on a new noun: a *lighting condition* summons
     * a source, and a source is a disc. Deleting the glow was the whole fix,
     * and it is the more honest picture anyway: in this shot the warm light is
     * coming out of an erupting mountain that is SVG, so painting any of it
     * would have been the plate doing a character's job. The sky is now asked
     * for as one flat colour edge to edge, which is the only instruction that
     * has ever beaten this failure.
     */
    coast_night: {
      prompt:
        "a wide calm empty seashore of dark volcanic ground after dark, seen " +
        "from slightly above looking down across the shore, painted as flat " +
        "simplified storybook shapes, the bottom third of the frame a broad " +
        "plain sweep of dark blue-grey charcoal ground seen from above as one " +
        "smooth flat surface of colour with no pebbles, no stones, no shells, " +
        "no seaweed, no footprints and no detail in it at all, staying " +
        "completely plain and smooth right down to the bottom edge of the " +
        "frame, above it a wide calm band of deep midnight teal water with no " +
        "waves, no foam and no boats, one straight level horizon line placed " +
        "a little above the middle of the frame with a completely bare empty " +
        "sea horizon that has nothing standing on it anywhere along its whole " +
        "length, and the sky filling the top half evenly coloured all the way " +
        "across in deep friendly indigo blue, exactly the same colour and the " +
        "same brightness everywhere from the left edge to the right edge, " +
        "completely empty and open with nothing in it at all, a calm friendly " +
        "night, deep blue and never black",
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
