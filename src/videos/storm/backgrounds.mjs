// Painted backgrounds for "Boom and the One, Two, Three" (kids ep 6, `storm`).
//
// Read scripts/generate-backgrounds.mjs first; `npm run backgrounds -- --video
// storm` turns this file into public/backgrounds/storm/*.webp plus a generated
// backgroundManifest.ts. Nothing here is rendered directly.
//
// ---------------------------------------------------------------------------
// THE RULES THIS SET EXISTS TO SERVE (carried from ep 5, verbatim in force)
//
// **THE MOUNTAIN IS NEVER PAINTED.** He is AWAKE on the horizon of every
// coastal wide in this episode with Ember's island beside him, summit lit — the
// one steady light on the dark horizon in act three — and he is the shared kit
// component `src/lib/kid/characters/Volcano.tsx`. So every sea horizon below is
// prompted EMPTY, and empty is DESCRIBED rather than negated (the ep-2 turbine
// lesson). The words for that kind of landform — and the word for the thing he
// is — appear in none of these prompts. The horizon is asked for STRAIGHT and
// LEVEL, because `GARDEN.horizon` in scenes/common.tsx is the line his feet
// seat on.
//
// **NO PAINTED SUN, NO PAINTED MOON** (ep-3/ep-4/ep-5 rule). Sunny is a
// character; the end card's moon is SVG because it is half-lit and a kid will
// check the phase. Naming a disc summons it, and a *lighting condition* (a
// glow, a haze "along the horizon") summons its source — ep 5 lost two rolls to
// that. Every sky here is an even colour with nowhere for a disc to go.
//
// **NOTHING THAT MOVES IS PAINTED.** The Cloud Hotel and its tower, Boom, Flash
// (the lightning — she is a character, ≤6 frames, SVG), the rings, the hail,
// the curtain, the mug, the window frame itself, every spark of the crackle,
// the lift and the floors: all SVG on top. These plates are sky, sea, lawn and
// the inside of a cloud.
//
// ---------------------------------------------------------------------------
// THE STYLE ANCHOR is episodes four and five's, VERBATIM — the series has to
// look like one show across separately generated sets, and the anchor is the
// only thing making that true. **Do not touch it when you add a key**: it is
// appended to every prompt and editing it re-rolls the whole set.
//
// The cold-open mood is HEAVY YELLOW afternoon light. The wind episode's first
// anchor said "warm morning light" and hazed five of nine plates to cream with
// no blue left in the sky; so the yellow is asked for as a NAMED COLOUR low in
// an otherwise blue sky, never as "light". The storm plates (act 2/3) are DARK
// SLATE, not black — "a friendly night, never black" is the ep-4 rule and a
// storm in this show is Cloudia's gala.
//
// ---------------------------------------------------------------------------
// SET (skeleton wave): the cold open and act one. **Act-2/3 keys, NAMED HERE,
// NOT GENERATED** — the owning act builder adds the prompt under exactly this
// key (never a new name) and runs `npm run backgrounds -- --video storm --only
// <key>`:
//
//   bay_through_window_dark   ACT2 — Scenes 11–15: the bay through the glass
//                             under the storm, dark slate sky, the lawn dim.
//                             Same skeleton as `bay_through_window_yellow`
//                             below (colour words only) so the horizon does
//                             not move when the light does.
//   bay_lit_from_above        ACT2 — Scenes 16–17: the hotel directly
//                             overhead; everything outside lit from above,
//                             the sky a flat pale underside. Same skeleton.
//   lawn_hail_dark            ACT3 — Scene 18/22: the lawn close-up the hail
//                             bounces on, dark wet green, seen from the house.
//   bay_dusk_clear            ACT3 — Scenes 23, 25, 26: dusk, the storm a far
//                             flicker, sky clearing; the half moon is SVG.
//                             Same skeleton as the window plates.

export default {
  // Episodes four and five's anchor, verbatim. See the header.
  styleAnchor:
    "background art for a preschool animated series, soft gouache painting, " +
    "visible brush texture, saturated storybook colour, gentle airbrushed " +
    "shading, soft rounded shapes, simple uncluttered composition, no " +
    "characters, no people, no animals, no buildings, no fences, no text, " +
    "no watermark, not photographic",

  backgrounds: {
    // ACT2-PROMPTS-ANCHOR: the act-2 builder adds its two prompt entries
    // (bay_through_window_dark, bay_lit_from_above) directly below this line.

    /**
     * ACT2, Scenes 11–15 — the bay through the glass under the storm. The
     * yellow window plate's skeleton, colour words only, so the horizon (and
     * the volcano on it) does not move when the light does. Dark SLATE, never
     * black (ep-4 rule: a friendly night). The sky is asked LIGHTER than the
     * water so the sky→sea step is still the strongest luminance drop the
     * skyline measure looks for.
     */
    bay_through_window_dark: {
      prompt:
        "a wide calm empty seaside lawn on a dark stormy summer afternoon seen " +
        "from slightly above looking down across the grass towards the sea, " +
        "painted as flat simplified storybook shapes, the bottom third of the " +
        "frame a broad plain sweep of short dim dark green grass seen from " +
        "above as one smooth flat surface of colour with no individual " +
        "blades, no flowers, no paths, no stones and no detail in it at all, " +
        "staying completely plain and smooth right down to the bottom edge of " +
        "the frame, above it a wide calm band of very deep dark navy teal " +
        "water, one straight level horizon line placed a little above the " +
        "middle of the frame with a completely bare empty sea horizon that " +
        "has nothing standing on it anywhere along its whole length, and the " +
        "sky filling the top half evenly coloured all the way across in soft " +
        "dark slate blue grey with a faint dusty violet tint, a little lighter " +
        "than the water, the same brightness everywhere with no bright spot " +
        "and no glare, completely empty and open through the middle, two or " +
        "three soft darker grey clouds only in the top corners",
    },

    /**
     * ACT2, Scenes 16–17 — the hotel DIRECTLY OVERHEAD: the sky through the
     * glass is the cloud's flat pale underside, and the lawn and the sea are
     * lit evenly from above. Same skeleton again. The underside's shapes (and
     * Flash across it) are SVG on top; this plate is only a flat pale ceiling
     * of sky.
     */
    bay_lit_from_above: {
      prompt:
        "a wide calm empty seaside lawn under a low flat ceiling of pale grey " +
        "cloud on a stormy summer afternoon seen from slightly above looking " +
        "down across the grass towards the sea, painted as flat simplified " +
        "storybook shapes, the bottom third of the frame a broad plain sweep " +
        "of short cool dark green grass seen from above as one smooth flat " +
        "surface of colour with no individual blades, no flowers, no paths, " +
        "no stones and no detail in it at all, staying completely plain and " +
        "smooth right down to the bottom edge of the frame, above it a wide " +
        "calm band of deep dark slate teal water, one straight level horizon " +
        "line placed a little above the middle of the frame with a completely " +
        "bare empty sea horizon that has nothing standing on it anywhere " +
        "along its whole length, and the sky filling the top half one flat " +
        "even pale silvery lavender grey all the way across like the smooth " +
        "underside of a cloud, lit evenly from above, the same brightness " +
        "everywhere with no bright spot and no glare, completely plain and " +
        "open",
    },
    // ACT3-PROMPTS-ANCHOR: the act-3 builder adds its two prompt entries
    // (lawn_hail_dark, bay_dusk_clear) directly below this line.

    /**
     * ACT3 — Scenes 18 and 22: the lawn the hail bounces on, through the
     * window. `bay_through_window_yellow`'s skeleton word for word (colour
     * words only) so the horizon seats on the same line; the hail, the rain,
     * the path, the step and the puddles are SVG.
     */
    lawn_hail_dark: {
      prompt:
        "a wide calm empty seaside lawn under a dark stormy afternoon sky seen " +
        "from slightly above looking down across the grass towards the sea, " +
        "painted as flat simplified storybook shapes, the bottom third of the " +
        "frame a broad plain sweep of short dark wet deep green grass seen " +
        "from above as one smooth flat surface of colour with no individual " +
        "blades, no flowers, no paths, no stones and no detail in it at all, " +
        "staying completely plain and smooth right down to the bottom edge of " +
        "the frame, above it a wide calm band of dark slate grey teal water, " +
        "one straight level horizon line placed a little above the middle of " +
        "the frame with a completely bare empty sea horizon that has nothing " +
        "standing on it anywhere along its whole length, and the sky filling " +
        "the top half evenly coloured all the way across in deep dark slate " +
        "blue grey, the same brightness everywhere with no bright spot and no " +
        "glare, completely empty and open through the middle, a few soft dark " +
        "grey clouds only in the top corners",
    },

    /**
     * ACT3 — Scene 23 (and the recap's 25–26): dusk, the storm gone far, the
     * sky clearing. Same skeleton as the window plates so the horizon does
     * not move. The far storm flicker, the half moon and every light are SVG.
     */
    bay_dusk_clear: {
      prompt:
        "a wide calm empty seaside lawn on a clear still evening at dusk seen " +
        "from slightly above looking down across the grass towards the sea, " +
        "painted as flat simplified storybook shapes, the bottom third of the " +
        "frame a broad plain sweep of short dark blue green grass seen from " +
        "above as one smooth flat surface of colour with no individual " +
        "blades, no flowers, no paths, no stones and no detail in it at all, " +
        "staying completely plain and smooth right down to the bottom edge of " +
        "the frame, above it a wide calm band of deep dusky violet blue water, " +
        "one straight level horizon line placed a little above the middle of " +
        "the frame with a completely bare empty sea horizon that has nothing " +
        "standing on it anywhere along its whole length, and the sky filling " +
        "the top half evenly coloured all the way across in soft dusky rose " +
        "and lilac low down fading up into deep clear indigo blue, the same " +
        "brightness everywhere with no bright spot and no glare, completely " +
        "empty and open through the middle, two or three small soft violet " +
        "clouds only in the top corners",
    },
    // --- THE GARDEN AND THE BAY -------------------------------------------
    //
    // ONE SKELETON in two framings, read them side by side: ep 5's
    // `coast_day` with the sand swapped for lawn. The horizon is "a little
    // above the middle" so the measured skyline seats on GARDEN.horizon (470,
    // ep 5's COAST.horizon — the same mountain, the same line) at ~1.45×.

    /** Scene 1 — the coastal garden wide on the hottest morning. */
    garden_heavy_day: {
      prompt:
        "a wide calm empty seaside lawn on a very hot still summer morning " +
        "seen from slightly above looking down across the grass towards the " +
        "sea, painted as flat simplified storybook shapes, the bottom third of " +
        "the frame a broad plain sweep of short warm green and golden green " +
        "grass seen from above as one smooth flat surface of colour with no " +
        "individual blades, no flowers, no paths, no stones and no detail in " +
        "it at all, staying completely plain and smooth right down to the " +
        "bottom edge of the frame, above it a wide calm band of deep saturated " +
        "turquoise water, one straight level horizon line placed a little " +
        "above the middle of the frame with a completely bare empty sea " +
        "horizon that has nothing standing on it anywhere along its whole " +
        "length, and the sky filling the top half evenly coloured all the way " +
        "across in deep clear blue with a soft warm yellow tint low down, the " +
        "same brightness everywhere with no bright spot and no glare, two or " +
        "three small soft white clouds only in the top corners",
    },

    /**
     * Scenes 2 and 10 — the bay framed in the window, the afternoon gone heavy
     * and yellow. The window frame, the sill, the curtain, the mug and the kid
     * are SVG; this is only what is outside the glass. The lawn band at the
     * bottom is mostly behind the sill and wall, which is why it is asked for
     * plain rather than designed.
     */
    bay_through_window_yellow: {
      prompt:
        "a wide calm empty seaside lawn on a heavy hot summer afternoon seen " +
        "from slightly above looking down across the grass towards the sea, " +
        "painted as flat simplified storybook shapes, the bottom third of the " +
        "frame a broad plain sweep of short deep olive green grass seen from " +
        "above as one smooth flat surface of colour with no individual " +
        "blades, no flowers, no paths, no stones and no detail in it at all, " +
        "staying completely plain and smooth right down to the bottom edge of " +
        "the frame, above it a wide calm band of deep dark teal water, one " +
        "straight level horizon line placed a little above the middle of the " +
        "frame with a completely bare empty sea horizon that has nothing " +
        "standing on it anywhere along its whole length, and the sky filling " +
        "the top half evenly coloured all the way across in heavy warm mustard " +
        "yellow low down fading up into deep dusty teal blue, the same " +
        "brightness everywhere with no bright spot and no glare, completely " +
        "empty and open through the middle, two or three small soft clouds " +
        "only in the top corners",
    },

    /**
     * Scene 5 — out at sea beside the hotel, the afternoon heavy: the tower
     * goes up out of this sea into this sky and blocks Sunny. Horizon LOW (a
     * third of the way up, ep 5's `sea_horizon_*` skeleton) because everything
     * above it is room for a tower to grow into.
     */
    sea_sky_heavy: {
      prompt:
        "a wide expanse of completely calm open water under an enormous open " +
        "sky on a heavy hot summer afternoon, painted as flat simplified " +
        "storybook shapes, the bottom third of the frame one smooth plain band " +
        "of deep dark teal water with no waves, no foam, no boats and no " +
        "detail in it at all, one straight level horizon line placed low, " +
        "about a third of the way up the frame, completely bare and empty " +
        "along its whole length with nothing standing on it anywhere, and " +
        "above it the sky filling the entire upper two thirds of the picture, " +
        "evenly coloured all the way across in heavy warm mustard yellow low " +
        "down fading up into deep dusty teal blue, the same brightness " +
        "everywhere with no bright spot and no glare, completely empty and " +
        "open through the middle, a few small soft clouds only in the very " +
        "top corners",
    },

    // --- THE CLOUD HOTEL ----------------------------------------------------
    //
    // The inside of a cloud, three ways. No horizon in any of them — the
    // sanctioned way to be in this episode without the volcano in the shot
    // (ep 5's UnderWorld licence: a shot with no horizon cannot see him).
    // Everything that stands, rides, rubs, sparks or freezes in these rooms is
    // drawn: the drops hugging their specks, the lift, the floors, the hail,
    // Cloudia's front desk.

    /** Scenes 3, 4 and 9 — the lobby: flat, grey, drizzle, the ep-1 hotel. */
    hotel_lobby_grey: {
      prompt:
        "the inside of a huge soft rounded room made entirely of soft cloud, " +
        "seen straight on, painted as flat simplified storybook shapes, soft " +
        "billowy pale grey and lavender grey walls curving round the left and " +
        "right edges of the frame and a soft rounded billowy ceiling across " +
        "the top, the whole middle of the frame left completely open and plain " +
        "and empty, the bottom third one broad flat level floor of smooth pale " +
        "grey mist with no detail in it at all, soft even grey light " +
        "everywhere with no bright spot, very low contrast, calm and quiet and " +
        "cosy",
    },

    /**
     * Scenes 7 and 8 — inside the tower, the cross-section the lift runs up.
     * A vertical room (ep 5's `magma_shaft` skeleton): the floors, the shaft
     * and every spark are drawn on top of a plain tall column.
     */
    tower_interior: {
      prompt:
        "the inside of an enormously tall narrow space made entirely of soft " +
        "cloud, seen straight on from within, painted as flat simplified " +
        "storybook shapes, soft billowy walls of pale grey and dusty lavender " +
        "running vertically up both sides of the frame, a wide plain open " +
        "column of soft evenly lit pale grey violet mist filling the whole " +
        "middle of the frame from top to bottom with nothing in it at all, no " +
        "ledges, no shapes and no detail, evenly lit all the way up with no " +
        "bright spot, very low contrast, calm",
    },

    /** Scene 6 — the penthouse, above the freezing line: icy, cold, bright. */
    penthouse_freezer: {
      prompt:
        "the inside of a wide soft rounded room made entirely of frosty cloud " +
        "high up in very cold air, seen straight on, painted as flat " +
        "simplified storybook shapes, soft billowy walls of icy pale blue and " +
        "white curving round the left and right edges of the frame and a soft " +
        "rounded billowy ceiling across the top, the whole middle of the frame " +
        "left completely open and plain and empty, the bottom third one broad " +
        "flat level floor of smooth pale icy blue mist with no detail in it at " +
        "all, a few tiny soft white frost sparkles only near the edges, cool " +
        "even light everywhere with no bright spot, very low contrast, calm",
    },
  },
};

// --- THE DELIVERED SET, MEASURED -------------------------------------------
//
// Filled in by the skeleton builder after the first run (sharp, the ep-5
// measure-act2 method: strongest 6-row luminance step = skyline; rows 78–94%
// mean = near). `PLATES` in scenes/common.tsx is the table the acts consume.
// See the skeleton-wave report for the numbers and the re-roll log.
