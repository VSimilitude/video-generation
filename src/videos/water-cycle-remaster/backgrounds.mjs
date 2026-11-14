// Painted PLANE plates for "Drip's Big Adventure (Remaster)" (`water-cycle-remaster`).
//
// Read scripts/generate-backgrounds.mjs first; `npm run backgrounds -- --video
// water-cycle-remaster` turns this file into public/backgrounds/water-cycle-remaster/*.webp
// plus a generated backgroundManifest.ts. Then `node src/videos/water-cycle-remaster/key-plates.mjs`
// keys + bakes the atmosphere into public/backgrounds/water-cycle-remaster/keyed/*.webp and
// writes plateManifest.ts (what scenes/common.tsx actually loads). Nothing here is rendered directly.
//
// ---------------------------------------------------------------------------
// ONE PROMPT PER PLANE (brief §3; ROADMAP Step 2 gap 4). Keys are `<location>_<plane>[_<variant>]`:
//   plane = sky (∞) | far (0.15) | mid (0.4) | near (1.0) | fg (1.3)
//   variant = the time-of-day / weather version of that plane (painted light, not a live tint).
// Inserts (s08, s28, s35) and the s30 map are single full-frame vignette plates (D12 Q4): key
// `<location>_<stop>`, depth "sky", no keying.
//
// KEYING (decision log D17). Every non-sky plane is painted on a flat KEY COLOUR and keyed
// OFFLINE by key-plates.mjs (sharp, unmixing alpha from the key so soft painted edges survive,
// then despill), never by a live filter — live filters on planes cost +30 s / 10 s (kit report).
// Extra fields per entry, ignored by the generator (its hash is prompt + aspect only):
//   key:   what the prompt ASKS for — "magenta" (#ff00ff, default), "green" (#00ff00: clouds, whose
//          cream/lavender sat too close to flux's pink "magenta", and the sunset set) — or "black"
//          (luma key: mist, rain, spray — brightness becomes alpha). Flux never paints the key as
//          asked (magenta → pink, green → lime/olive), so the keyer MEASURES the key colour as the
//          plate's dominant colour and keys by distance from it; the word only steers the prompt.
//   fill:  "below" for horizon BAND plates (sea, hills, banks, shore): per column, everything below
//          the first solidly-keyed-out-to-opaque row is forced opaque (a horizon cut DERIVED from
//          the key), so a pale band that sits close to the key colour can't go see-through.
//   tint:  black-key plates only — the layer's colour (default paper cream #efe6d6); the plate's
//          brightness only shapes alpha + a light shading.
//   depth: the plane's depth; key-plates.mjs bakes the Step-2 atmosphere into the pixels
//          (far: saturation ×0.7 + 1.5 px blur; mid: ×0.9; fg: brightness ×0.92 + 2.5 px blur),
//          so <Plane flat> is exact at zero render cost. The haze veil stays live (cheap).
//
// RULES carried from the series: plates are scenery only — anything that moves, gets touched or
// lines up with a character's feet is SVG on top (the hotel door/sign/bell, the desk and lever,
// the flower, the moose, the ring). NO PAINTED SUN (Sunny is a character): skies are described
// by colour, never by "glow"/"light source"/"sun". Far planes are prompted soft, hazy, pale,
// low-contrast and slightly blurred — pre-blurred by prompt, never by live CSS blur.
//
// The STYLE ANCHOR is the series anchor, copied VERBATIM from src/videos/storm/backgrounds.mjs.
// Do not touch it when you add a key: it is appended to every prompt and editing it re-rolls the
// whole set.
//
// OWNERSHIP: the skeleton builder wrote every location's planes up front so the act builders do
// not collide here. An act builder re-rolls a plate with
//   npm run backgrounds -- --video water-cycle-remaster --only <key> --force
// and edits a prompt only inside its own act's block below.

const MAGENTA = "on a plain flat solid bright magenta (#ff00ff) background";
const GREEN = "on a plain flat solid bright green (#00ff00) background";
const BLACK = "on a plain flat solid pure black background";
const FAR = "very distant, soft, hazy, pale, low contrast, slightly blurred, atmospheric perspective";

export default {
  styleAnchor:
    "background art for a preschool animated series, soft gouache painting, " +
    "visible brush texture, saturated storybook colour, gentle airbrushed " +
    "shading, soft rounded shapes, simple uncluttered composition, no " +
    "characters, no people, no animals, no buildings, no fences, no text, " +
    "no watermark, not photographic",

  backgrounds: {
    // =====================================================================
    // COLD OPEN + ACT ONE — the open ocean (s01–s05, s07–s09), Sunny's sky (s06, s11)
    // =====================================================================
    ocean_sky_predawn: {
      depth: "sky",
      prompt:
        "an empty clear sky just before dawn, deep indigo blue at the top fading through dusky " +
        "violet to a soft rose pink band along the very bottom edge, smooth even colour, no clouds",
    },
    ocean_sky_dawn: {
      depth: "sky",
      prompt:
        "an empty clear sky at dawn, deep violet blue at the top fading to lilac and then a soft " +
        "warm gold band along the bottom edge, two thin lilac cloud streaks, smooth even colour",
    },
    ocean_sky_sunrise: {
      depth: "sky",
      prompt:
        "an open sky in the early morning, clear blue at the top fading to warm golden yellow and " +
        "peach along the bottom edge, a few small soft cream clouds, even colour",
    },
    ocean_sky_morning: {
      depth: "sky",
      prompt:
        "an open clear morning sky, cornflower blue at the top easing to a pale warm blue near the " +
        "bottom edge, a few soft cream puffy clouds, even colour",
    },
    ocean_far_dawn: {
      depth: 0.15,
      fill: "below",
      key: "magenta",
      prompt:
        "a distant calm sea seen from water level: a flat strip of pale violet blue ocean with faint " +
        `soft swell lines filling only the bottom half of the frame, its top edge a straight level horizon, ${FAR}, ` +
        `everything above the horizon ${MAGENTA}`,
    },
    ocean_far_morning: {
      depth: 0.15,
      fill: "below",
      key: "magenta",
      prompt:
        "a distant calm sea seen from water level: a flat strip of pale teal blue ocean with faint " +
        `soft swell lines and tiny sparkles filling only the bottom half of the frame, its top edge a straight level horizon, ${FAR}, ` +
        `everything above the horizon ${MAGENTA}`,
    },
    ocean_mid_dawn: {
      depth: 0.4,
      fill: "below",
      key: "magenta",
      prompt:
        "a band of gently rolling deep blue ocean swells with violet shading and soft gold " +
        "highlights on the wave tops, filling the bottom 40 percent of the frame, a softly wavy top " +
        `edge, above the waves ${MAGENTA}`,
    },
    ocean_mid_morning: {
      depth: 0.4,
      fill: "below",
      key: "magenta",
      prompt:
        "a band of gently rolling turquoise blue ocean swells with cream foam caps and darker teal " +
        "troughs, filling the bottom 40 percent of the frame, a softly wavy top edge, above the waves " +
        MAGENTA,
    },
    ocean_near_dawn: {
      depth: 1.0,
      fill: "below",
      key: "magenta",
      prompt:
        "close foreground ocean wave crests: big rounded dark navy blue wave shapes across the " +
        "bottom quarter of the frame with lacy cream foam edges and violet shading, above the waves " +
        MAGENTA,
    },
    ocean_near_morning: {
      depth: 1.0,
      fill: "below",
      key: "magenta",
      prompt:
        "close foreground ocean wave crests: big rounded deep teal blue wave shapes across the " +
        "bottom quarter of the frame with lacy cream foam edges, above the waves " + MAGENTA,
    },
    ocean_fg_spray: {
      depth: 1.3,
      key: "black",
      prompt:
        "scattered soft cream sea spray droplets and small foam flecks in the bottom left and bottom " +
        `right corners only, the middle empty, ${BLACK}`,
    },
    sky_sky_high: {
      depth: "sky",
      prompt:
        "an open clear high sky with no ground and no horizon, rich cornflower blue at the top " +
        "easing to a lighter warm blue at the bottom, smooth even colour",
    },
    sky_far_streaks: {
      depth: 0.15,
      key: "green",
      prompt:
        "four long soft cream white cloud streaks clearly visible, drifting horizontally across the frame with " +
        `warm peach undersides, soft edges, ${GREEN}`,
    },

    // =====================================================================
    // ACT TWO — the climb (s12), Cloud Hotel exterior (s13, s21) and interior (s14–s20, s22)
    // =====================================================================
    layers_sky: {
      depth: "sky",
      aspectRatio: "9:16",
      prompt:
        "a tall vertical sky with no ground: pale warm blue at the bottom rising through clear " +
        "blue to deep cool blue and dark navy blue at the very top, smooth even gradient, no clouds",
    },
    layers_far_wisps: {
      depth: 0.15,
      key: "green",
      prompt:
        "five small cream cloud wisps with soft lavender shading, clearly visible, scattered across the frame " +
        `with wide gaps between them, soft edges, ${GREEN}`,
    },
    layers_mid_wisps: {
      depth: 0.4,
      key: "green",
      prompt:
        "four soft puffy cream cloud wisps with pale blue shading scattered across the frame, gaps " +
        `between them, ${GREEN}`,
    },
    hotel_sky: {
      depth: "sky",
      prompt:
        "a noon sky high above a sea of clouds, rich deep clear blue at the top easing to soft " +
        "warm cream near the bottom, the bottom fifth of the frame a soft rolling cream and lavender " +
        "cloud deck stretching to the horizon",
    },
    hotel_sky_grey: {
      depth: "sky",
      prompt:
        "a muted heavy overcast sky high above a sea of clouds, dull grey blue at the top, the " +
        "bottom fifth a heavy dark grey cloud deck stretching to the horizon, dim and gloomy",
    },
    hotel_far: {
      depth: 0.15,
      key: "green",
      prompt:
        "a row of distant puffy cream cumulus clouds of different sizes floating along the middle of " +
        `the frame, lavender undersides, ${FAR}, ${GREEN}`,
    },
    hotel_far_grey: {
      depth: 0.15,
      key: "magenta",
      prompt:
        "a row of distant heavy grey rain clouds of different sizes floating along the middle of the frame, " +
        `dark slate undersides, soft and hazy, ${MAGENTA}`,
    },
    hotel_mid_bulk: {
      depth: 0.4,
      key: "green",
      prompt:
        "one huge towering soft puffy cream cumulus cloud, wide at the base and rising in rounded cloud bumps that " +
        "suggest grand towers and balconies, made only of cloud, no windows, no doors, centred and filling the middle " +
        "of the frame from the bottom edge to near the top, warm cream lit from above, soft lavender shading underneath, " + GREEN,
    },
    hotel_mid_bulk_grey: {
      depth: 0.4,
      key: "green",
      prompt:
        "one huge towering heavy puffy dark grey storm cloud, wide at the base and rising in rounded cloud bumps that " +
        "suggest grand towers and balconies, made only of cloud, no windows, no doors, centred and filling the middle " +
        "of the frame from the bottom edge to near the top, charcoal grey and slate blue, darker underneath, " + GREEN,
    },
    hotel_fg_mist: {
      depth: 1.3,
      key: "black",
      prompt:
        "soft drifting cream white mist wisps across the bottom of the frame and up the lower left " +
        `and lower right corners, the centre clear, ${BLACK}`,
    },
    hotel_sky_lobby: {
      depth: "sky",
      prompt:
        "the inside of a cosy grand lobby made entirely of soft cloud, empty: puffy cream and " +
        "lavender cloud walls curving into a soft arched back wall, a warm honey coloured haze rising " +
        "from below the floor line, the bottom fifth a soft cream cloud floor, no furniture",
    },
    hotel_sky_lobby_dim: {
      depth: "sky",
      prompt:
        "the inside of a cosy grand lobby made entirely of soft cloud, empty and dim: puffy grey " +
        "lavender cloud walls curving into a soft arched back wall in cool shadowy light, the bottom " +
        "fifth a soft grey cloud floor, no furniture",
    },
    hotel_mid_columns: {
      depth: 0.4,
      key: "green",
      prompt:
        "two soft puffy cream cloud columns with lavender shading, one at the far left edge and one " +
        `at the far right edge of the frame, joined by a soft cloud arch along the top, the centre empty, ${GREEN}`,
    },

    // =====================================================================
    // ACT THREE — rain (s22–s23), river valley (s24–s28), home sea at sunset (s29–s32)
    // =====================================================================
    rain_sky: {
      depth: "sky",
      prompt:
        "a deep slate blue grey rain sky, lighter silvery grey at the top, darker slate blue at the " +
        "bottom, soft falling rain haze, even and moody, no ground",
    },
    rain_far_curtain: {
      depth: 0.15,
      key: "black",
      tint: "#c8d4e2",
      prompt:
        "a faint soft curtain of fine pale grey rain streaks falling slightly diagonally across the " +
        `whole frame, ${FAR}, ${BLACK}`,
    },
    rain_mid_curtain: {
      depth: 0.4,
      key: "black",
      tint: "#d6e0ec",
      prompt:
        "medium density long pale blue white rain streaks falling slightly diagonally across the " +
        `whole frame, ${BLACK}`,
    },
    rain_fg_streaks: {
      depth: 1.3,
      key: "black",
      tint: "#dfe8f2",
      prompt:
        "a few large soft blurred pale rain streaks and drops very close to the camera, mostly at " +
        `the left and right edges, ${BLACK}`,
    },
    valley_sky_afterrain: {
      depth: "sky",
      prompt:
        "an afternoon sky just after rain, soft clear blue with breaking cream clouds, the left side " +
        "of the sky warmer pale yellow, the right side cooler blue, even colour",
    },
    valley_sky_late: {
      depth: "sky",
      prompt:
        "a late afternoon sky, warm golden yellow low on the left fading to soft blue at the top " +
        "right, a few long peach cloud streaks, even colour",
    },
    valley_sky_winter: {
      depth: "sky",
      prompt: "a pale winter sky, cool white grey blue, soft and even, a few pale grey clouds",
    },
    valley_far_hills: {
      depth: 0.15,
      fill: "below",
      key: "magenta",
      prompt:
        "distant rolling green hills with a soft dark green treeline along their tops, filling the " +
        `lower half of the frame, bluish green, ${FAR}, above the hills ${MAGENTA}`,
    },
    valley_far_hills_late: {
      depth: 0.15,
      fill: "below",
      key: "magenta",
      prompt:
        "distant rolling green hills with a soft treeline along their tops lit warm gold from the " +
        `left with long soft blue shadows, filling the lower half of the frame, ${FAR}, above the hills ${MAGENTA}`,
    },
    valley_far_hills_snow: {
      depth: 0.15,
      fill: "below",
      key: "magenta",
      prompt:
        "distant rolling hills covered in soft white snow with a frosted dark green treeline along their tops, " +
        `filling only the lower half of the frame, cool blue shadows, soft and hazy, the whole top half of the frame ${MAGENTA}`,
    },
    valley_mid_bank: {
      depth: 0.4,
      key: "magenta",
      prompt:
        "a grassy green riverbank of dry land sloping gently across the lower half of the frame, no water, " +
        `clumps of tall reeds and cattails at the left and right, the grass reaching the bottom edge, above the bank ${MAGENTA}`,
    },
    valley_mid_bank_late: {
      depth: 0.4,
      key: "magenta",
      prompt:
        "a grassy green riverbank of dry land sloping gently across the lower half of the frame, no water, " +
        `clumps of tall reeds and cattails at the left and right, lit warm gold from the left with long blue shadows, the grass reaching the bottom edge, above the bank ${MAGENTA}`,
    },
    valley_mid_rock: {
      depth: 0.4,
      key: "magenta",
      prompt:
        "a big rounded mossy grey boulder sitting on a grassy green hilltop, the boulder right of " +
        `centre, the hilltop across the bottom third, above them ${MAGENTA}`,
    },
    valley_near_river: {
      depth: 1.0,
      key: "green",
      prompt:
        "the surface of a calm clear blue river seen from water level, deep blue water reflecting a blue sky, " +
        "gentle ripples, the water filling the whole bottom third of the frame down to the bottom edge, " +
        `the top two thirds of the frame ${GREEN}`,
    },
    valley_near_river_late: {
      depth: 1.0,
      key: "magenta",
      prompt:
        "the surface of a calm clear blue river seen from water level across the bottom third of the " +
        `frame, gentle ripples with warm gold sparkles, long soft blue shadows, above the water ${MAGENTA}`,
    },
    valley_fg_grass: {
      depth: 1.3,
      key: "magenta",
      prompt:
        "tall green grass blades and a few reeds very close to the camera rising from the bottom left " +
        `and bottom right corners, the centre empty, ${MAGENTA}`,
    },
    home_sky_sunset: {
      depth: "sky",
      prompt:
        "a warm sunset sky over the sea, deep orange and coral low on the left, rose pink and soft " +
        "purple higher up, violet at the top right, a few peach cloud streaks, even colour",
    },
    home_sky_evening: {
      depth: "sky",
      prompt:
        "an early evening sky over the sea, dusky blue violet with a fading apricot band low on the " +
        "left, a few faint first stars at the top, even colour",
    },
    home_far_headland: {
      depth: 0.15,
      key: "green",
      prompt:
        "a distant rocky headland sloping down into a calm sea on the right side of the frame, a soft " +
        `dusky purple silhouette with an orange rim on its left edge, lower half of the frame only, ${FAR}, ${GREEN}`,
    },
    home_far_headland_evening: {
      depth: 0.15,
      key: "green",
      prompt:
        "a distant rocky headland sloping down into a calm sea on the right side of the frame, a soft " +
        `dark indigo silhouette, lower half of the frame only, ${FAR}, ${GREEN}`,
    },
    home_mid_sea: {
      depth: 0.4,
      key: "green",
      prompt:
        "a wide calm sea band seen from the shore, deep violet blue water with broad stripes of warm orange and rose " +
        "colour on the gentle swells, filling the bottom half of the frame, a straight level top edge, nothing in the sky, " +
        `the whole top half of the frame ${GREEN}`,
    },
    home_near_shore: {
      depth: 1.0,
      key: "green",
      prompt:
        "a smooth sandy shoreline with lacy cream foam along the water's edge across the bottom quarter " +
        `of the frame, warm orange sunset tones and purple shadows, above the shore ${GREEN}`,
    },
    home_fg_rock: {
      depth: 1.3,
      key: "green",
      prompt:
        "a large dark near rock headland very close to the camera filling the left two thirds of the " +
        `frame from top to bottom, dark purple brown with a warm orange rim on its right edge, ${GREEN} on the right`,
    },

    // ---------------------------------------------------------------------
    // INSERTS (single vignette plates, D12 Q4) and the s30 map — no keying
    // ---------------------------------------------------------------------
    everywhere_lake: {
      depth: "sky",
      prompt: "a calm mountain lake on a bright morning, pine trees along the far shore, still blue water in the foreground",
    },
    everywhere_paddy: {
      depth: "sky",
      prompt: "flooded green rice paddy terraces on a bright morning, mirror still water reflecting the blue sky",
    },
    everywhere_puddle: {
      depth: "sky",
      prompt: "a single shallow rain puddle on a grey stone pavement corner seen from low down, bright morning",
    },
    everywhere_dogbowl: {
      depth: "sky",
      prompt: "a round blue pet water bowl full of water on a warm tiled kitchen floor, close and low, bright morning",
    },
    wants_channel: {
      depth: "sky",
      prompt: "a straight irrigation channel of water running between rows of green crop fields, late afternoon gold light from the left",
    },
    wants_tower: {
      depth: "sky",
      prompt: "a round water tower tank on tall legs standing over green fields, late afternoon gold light from the left",
    },
    wants_tap: {
      depth: "sky",
      prompt: "a kitchen sink with a curved metal tap, close up, warm late afternoon window light from the left",
    },
    wants_kettle: {
      depth: "sky",
      prompt: "a rounded kettle on a stove top in a cosy kitchen, close up, warm late afternoon light from the left",
    },
    wants_bathtub: {
      depth: "sky",
      prompt: "a white bathtub full of water and bubbles in a cosy bathroom, a small yellow rubber toy duck floating, warm light",
    },
    mind_bathtub: {
      depth: "sky",
      prompt: "a bathtub full of still water in a dim bathroom at night, cool moonlit blue light through a small window",
    },
    mind_street: {
      depth: "sky",
      prompt: "a narrow old cobbled street at night with old gas lamp posts, wet shiny cobbles, cool moonlit blue",
    },
    mind_jungle: {
      depth: "sky",
      prompt: "a lush jungle at night with giant leaves and hanging vines, cool moonlit blue, soft and calm",
    },
    mind_footprint: {
      depth: "sky",
      prompt: "a wide flat muddy clearing among giant prehistoric ferns at night, cool moonlit blue, low view across the mud",
    },
    map_paper: {
      depth: "sky",
      prompt:
        "a simple hand painted world map on warm cream paper, soft rounded continents in muted green " +
        "and ochre, pale blue oceans, no text, no labels, no lines",
    },
  },
};
