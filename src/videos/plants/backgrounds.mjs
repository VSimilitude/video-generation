// Painted backgrounds for "Pip and the Sunshine Kitchen" (kids ep 4).
//
// Read scripts/generate-backgrounds.mjs first; `npm run backgrounds -- --video
// plants` turns this file into public/backgrounds/plants/*.webp plus a
// generated backgroundManifest.ts. Nothing here is rendered directly.
//
// ONE WORLD, NINE TIMES OF DAY. This is the first episode whose plates are not
// thirteen *places* but one place lit thirteen ways, and that changes what the
// set has to buy. Episode three could let each key name its own palette because
// each key was a different world; here nine of the plates are the same field and
// the audience will be looking at it for fifteen minutes, so they have to agree
// about geography to the pixel band and disagree about light by a wide margin:
//
//   AGREE     one straight bare horizon just below the middle of the frame; the
//             field seen from slightly above filling the bottom half; the sky
//             open through the middle; clouds only in the corners. The nine
//             wides repeat ONE SKELETON, clause for clause, and only the colour
//             words move. That is the whole continuity mechanism.
//   DISAGREE  in VALUE, not hue (STYLE: "paint the value, not the hue"). Dawn,
//             day, golden, sunset, dusk and night are a light-to-dark ladder,
//             and a viewer who cannot see the rung has been shown nothing. The
//             delivered ladder is measured at the bottom of this file.
//
// THE BARE HORIZON IS THE LOAD-BEARING RULE. `SleepingVolcano` is SVG (it
// breathes and, in Scene 13, smokes) and it seats on `MEADOW.horizon` at
// `VOLCANO_AT.x = 336` — frame LEFT — in every wide of the episode. So the far
// horizon of every wide plate is prompted as empty, and empty is *described*
// rather than negated: the ep-2 turbine lesson ("no wind turbines" put two on
// the ridge) applies to summits too, so the word volcano appears nowhere below.
//
// NO PAINTED SUN, NO PAINTED MOON, ANYWHERE. Sunny is a character with a face,
// the moon is where Ray arrives from, and both are SVG with geometry that has to
// line up. Episode three learned that you cannot get rid of a disc by asking:
// naming it summons it, and forbidding the *bright spot* still leaves a sunset,
// which is a picture with a disc-shaped hole in it. The only thing that worked
// was removing the lighting condition — asking for a sky evenly coloured all the
// way across, with nowhere for a disc to go. Every warm key below is written
// that way, and the words "sun", "sunrise", "sunset" and "moonlight" appear in
// none of them.
//
// THE OLD TREE IS SVG, NOT PAINT — a deviation from the plate design, flagged
// rather than smuggled. The design asked for a painted oak at the LEFT edge of
// every wide. Left is where the volcano stands (x = 336), so a painted tree
// there is paint under the summit, which is the one thing the horizon rule
// forbids; `MeadowWorld` already draws `OldTree` at `MEADOW.tree.x = 1588`,
// frame RIGHT, and Scene 20 pushes the camera *into* that tree, which a
// 1344-wide plate cannot survive. The design's own fallback ("an SVG tree on a
// bare-edge plate — builder flags it") is therefore what shipped: these plates
// are bare-edge, the tree stays drawn, and "the same silhouette in every wide"
// is guaranteed by there being exactly one of it rather than by thirteen
// separately-generated paintings happening to agree.
//
// WHAT A PROMPT HAS TO BUY, beyond a pretty picture (unchanged from ep 2/3):
//
//   1. A clean lower third. Pip stands at `MEADOW.ground` (902 of 1080) for the
//      whole episode and never moves; painted detail down there fights a
//      character who cannot step out of the way. Flux paints a fringe of grass
//      blades along the bottom edge of any meadow at eye level, and six re-rolls
//      of `meadow_day` could not fully talk it out of one — what finally
//      *reduced* it was moving the camera ("seen from slightly above, looking
//      down across the field"), which turns the near field from a profile of
//      blades into a surface. What is left is soft, uniform and one value, and
//      it is also the band `MeadowWorld`'s drawn near field covers.
//   2. Open sky through the middle. Bubbles stack over Pip at x = 812. Clouds
//      are asked for in the corners, never the centre, and never low down near
//      the horizon where the summit reads.
//   3. No characters, no text, no birds.
//   4. Nothing that is already SVG: the volcano, the old tree, Sunny, the moon,
//      Ray's beam, the rain sheets, the seeds, the Cloud Hotel, the soil
//      cutaway's roots and straws, the sprout row and Pip's dirt patch are all
//      animated components drawn on top of these plates.

export default {
  // Tuned on `meadow_day` alone before the other twelve were spent — the anchor
  // is appended to every prompt, so every word here costs thirteen images.
  //
  // It is episode three's anchor with two words added ("no buildings, no
  // fences") and one clause ("not photographic"), and that near-identity is the
  // point rather than laziness: episodes two, three and four have to look like
  // one show, and the anchor is the only thing making that true across three
  // separately-generated sets.
  //
  // Two richer anchors were tried first and both were worse. Naming the medium
  // harder ("painted in thick gouache with visible brush strokes and paper
  // texture", "not a smooth vector illustration") did not produce more brush
  // texture — flux-schnell's answer to every one of these prompts is the same
  // smooth flat cartoon landscape, which is also what episodes two and three
  // actually shipped. Fighting for a texture the model will not give costs the
  // words that are doing real work.
  styleAnchor:
    "background art for a preschool animated series, soft gouache painting, " +
    "visible brush texture, saturated storybook colour, gentle airbrushed " +
    "shading, soft rounded shapes, simple uncluttered composition, no " +
    "characters, no people, no animals, no buildings, no fences, no text, " +
    "no watermark, not photographic",

  backgrounds: {
    // --- THE WIDES ---------------------------------------------------------
    //
    // Nine plates, one skeleton. Read any two of these prompts side by side and
    // the only differences are colour words and the sky clause — that is what
    // makes them the same field rather than nine fields. Do not "improve" one
    // of them alone; a wide that stops matching the skeleton stops matching the
    // place, and the episode never cuts away from it long enough to hide that.

    // Scenes 1, 3 (wide) and the start of the title pull-back — the first frame
    // of the episode, and the one that teaches the audience the place. Cooler
    // and dewier than `meadow_day`, and a value step below it.
    meadow_morning: {
      prompt:
        "a wide gently rolling summer meadow early on a fresh clear morning " +
        "seen from slightly above, looking down across the field, painted as " +
        "flat simplified storybook shapes, the bottom half of the frame a broad " +
        "plain sweep of dewy fresh grass green faintly warmed with " +
        "yellow-green, seen from above as one smooth flat surface of colour " +
        "with no individual blades of grass, no tufts, no seed heads, no wheat " +
        "and no detail in it at all, staying completely plain and smooth right " +
        "down to the bottom edge of the frame, one straight simple horizon line " +
        "placed just below the middle of the frame with the sky filling the " +
        "whole top half of the picture, and along that horizon a low line of " +
        "hazy blue-green distant hills, the horizon an unbroken smooth empty " +
        "line with nothing standing anywhere along it and nothing breaking its " +
        "outline, a clear cerulean blue sky above, pale and cool near the " +
        "horizon, with two big soft rounded white clouds high up in the left " +
        "and right corners, the middle of the sky open and empty, empty " +
        "uncluttered foreground, an empty open field with nothing growing above " +
        "the grass",
    },

    // Scene 4, the title. The pull-back's end state: the field becomes the
    // world. Same geography from high enough that the horizon drops and the sky
    // takes three quarters of the frame — which is also `MeadowWorld`'s `lift`
    // convention (rising pushes the ground DOWN the frame).
    meadow_aerial: {
      prompt:
        "a wide green summer countryside at midday seen from very high in the " +
        "air looking out towards the far horizon, painted as flat simplified " +
        "storybook shapes, an enormous brilliant cyan blue sky filling " +
        "almost the whole picture from the top edge down to a horizon line " +
        "near the bottom of the frame, three big soft rounded white clouds " +
        "in the left and right corners, the middle of the sky open and " +
        "empty, and across the very bottom of the frame a simple narrow " +
        "band of land, one enormous continuous sweep of plain green meadow " +
        "painted as smooth flat masses of grass green and yellow-green with " +
        "no hedges, no roads, no farms, no trees and no detail in it at " +
        "all, all one single open grassland, the horizon an unbroken smooth " +
        "empty line with a thin line of hazy blue-green distant hills and " +
        "nothing standing anywhere along it, airy and light, an empty open " +
        "landscape with nothing growing above the fields",
    },

    // Scene 5. The word "sunrise" is not in this prompt: the model paints the
    // disc that makes one. An evenly washed early sky has nowhere to put it,
    // and cool greens under a warm sky are what sells the hour instead.
    meadow_sunrise: {
      prompt:
        "a wide gently rolling summer meadow very early in the day seen from " +
        "slightly above, looking down across the field, painted as flat " +
        "simplified storybook shapes, the bottom half of the frame a broad " +
        "plain sweep of soft muted grass green still in cool shadow, a plain " +
        "green field, seen from above as one smooth flat surface of colour with " +
        "no individual blades of grass, no tufts, no seed heads, no wheat and " +
        "no detail in it at all, staying completely plain and smooth right down " +
        "to the bottom edge of the frame, one straight simple horizon line " +
        "placed just below the middle of the frame with the sky filling the " +
        "whole top half of the picture, and along that horizon a low line of " +
        "hazy violet-blue distant hills, the horizon an unbroken smooth empty " +
        "line with nothing standing anywhere along it and nothing breaking its " +
        "outline, the whole sky above washed evenly from soft rose pink and " +
        "warm peach near the horizon up into pale periwinkle blue at the top, " +
        "coloured the same all the way across from the left edge of the frame " +
        "to the right edge with no round shapes and no bright patch in it, two " +
        "thin flat pink cloud bands high in the corners, empty uncluttered " +
        "foreground, an empty open field with nothing growing above the grass",
    },

    // Scenes 6, 9, 10, 15, 20 (wide) and 21 — the episode's home plate and the
    // brightest, bluest thing in the set. Six re-rolls; the tuning key. Two
    // things it taught the other eight: put the camera slightly above the field
    // (a profile of grass grows a blade fringe, a surface does not), and ask
    // for BIG rounded clouds in the corners (small ones came back as specks
    // and the house style is soft and round).
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

    // Scene 7. Deep blue, never black — this is a friendly night, and Ray
    // arrives down an SVG moonbeam whose source must not already be painted.
    // "Moonlight" is not in the prompt for the same reason "sunset" is not in
    // the warm ones: it is the lighting condition that implies the disc.
    meadow_night: {
      prompt:
        "a wide gently rolling summer meadow at night seen from slightly above, " +
        "looking down across the field, painted as flat simplified storybook " +
        "shapes, the bottom half of the frame a broad plain sweep of dark " +
        "blue-green grass with pale silver along its top, seen from above as " +
        "one smooth flat surface of colour with no individual blades of grass, " +
        "no tufts, no seed heads, no wheat and no detail in it at all, staying " +
        "completely plain and smooth right down to the bottom edge of the " +
        "frame, one straight simple horizon line placed just below the middle " +
        "of the frame with the sky filling the whole top half of the picture, " +
        "and along that horizon a low line of dark indigo distant hills, the " +
        "horizon an unbroken smooth empty line with nothing standing anywhere " +
        "along it and nothing breaking its outline, a deep navy blue night sky " +
        "above evenly scattered with small soft white and pale blue stars of " +
        "different sizes, the same deep blue all the way across from edge to " +
        "edge with no bright patch in it, calm and friendly and not " +
        "frightening, empty uncluttered foreground, an empty open field with " +
        "nothing growing above the grass",
    },

    // Scenes 8 and 24. The rung between night and sunrise: a warm band along
    // the WHOLE horizon, edge to edge and therefore with nowhere for a disc,
    // under a sky that is still mostly night.
    meadow_dawn: {
      prompt:
        "a wide gently rolling summer meadow in the first light of the morning " +
        "seen from slightly above, looking down across the field, painted as " +
        "flat simplified storybook shapes, the bottom half of the frame a " +
        "broad plain sweep of dark blue-green grass with pale silver along " +
        "its top, seen from above as one smooth flat surface of colour with " +
        "no individual blades of grass, no tufts, no seed heads, no wheat " +
        "and no detail in it at all, staying completely plain and smooth " +
        "right down to the bottom edge of the frame, one straight simple " +
        "horizon line placed just below the middle of the frame with the sky " +
        "filling the whole top half of the picture, and along that horizon a " +
        "low line of dark blue-grey distant hills, the horizon an unbroken " +
        "smooth empty line with nothing standing anywhere along it and " +
        "nothing breaking its outline, above it a broad flat band of warm gold " +
        "running evenly along the entire length of the horizon from the left " +
        "edge of the frame to the right edge, fading up through pale apricot " +
        "into deep blue-grey at the top of the frame, no round shapes and no " +
        "bright patch anywhere in the sky, two faint stars high up, empty " +
        "uncluttered foreground, an empty open field with nothing growing above " +
        "the grass",
    },

    // Scenes 22, 23 and 28 (golden hour) have NO painted plate — a showrunner
    // cut after five failed rolls. Flux would not hold a golden-hour value
    // rung: every attempt either matched `meadow_day`'s luminance exactly
    // (round 1: 177 vs 178.5; round 5: monochrome yellow at 178.4), collapsed
    // onto `meadow_sunset`'s rung (round 3: 100.7 vs 100.4), went photoreal
    // wheat prairie (round 4), or grew a farmhouse on the load-bearing bare
    // horizon (round 3). Golden hour is instead `meadow_day` + a comp-level
    // warm grade (B3): a deterministic dim-and-warm the episode can tune in
    // numbers rather than re-rolls — and the hour's light source in those
    // scenes is SVG Sunny himself anyway. Reversal: re-add the key, cents.

    // Scenes 25 and 26. Warmer and a value step darker: the sky is now the
    // brightest thing in the frame and the field has gone to shadow. Written as
    // flat horizontal cloud bands covering the sky edge to edge, which is the
    // ep-3 `sea_sunset` construction and the only one that never painted a disc.
    meadow_sunset: {
      prompt:
        "a wide gently rolling summer meadow in the evening seen from slightly " +
        "above, looking down across the field, painted as flat simplified " +
        "storybook shapes, the bottom third of the frame a broad plain sweep " +
        "of short mown deep olive-green grass in shadow, seen from above as " +
        "one smooth flat surface of colour with no individual blades of " +
        "grass, no tufts, no seed heads, no wheat and no detail in it at " +
        "all, staying completely plain and smooth right down to the bottom " +
        "edge of the frame, one straight simple horizon line low in the " +
        "picture with the sky filling the whole top two thirds of the " +
        "picture, and along " +
        "that horizon a low line of dusky purple distant hills, the horizon an " +
        "unbroken smooth empty line with nothing standing anywhere along it and " +
        "nothing breaking its outline, and above it a sky completely covered " +
        "edge to edge in soft flat horizontal bands of warm coral and tangerine " +
        "and rose, evenly coloured all the way across with no round shapes in " +
        "it, empty uncluttered foreground, an empty open field with nothing " +
        "growing above the grass",
    },

    // Scene 29, the end card. Afterglow: the warm is nearly gone and the top of
    // the sky is reading as night. The sprout-row silhouettes that make the
    // shot are SVG, so this is the darkest wide except `meadow_night` — and it
    // has to stay lighter than it in the same breath.
    meadow_dusk: {
      prompt:
        "a wide gently rolling summer meadow at late dusk seen from slightly " +
        "above, looking down across the field, painted as flat simplified " +
        "storybook shapes, the bottom half of the frame a broad plain sweep of " +
        "very dark blue-green grass, seen from above as one smooth flat surface " +
        "of colour with no individual blades of grass, no tufts, no seed heads, " +
        "no wheat and no detail in it at all, staying completely plain and " +
        "smooth right down to the bottom edge of the frame, one straight simple " +
        "horizon line placed just below the middle of the frame with the sky " +
        "filling the whole top half of the picture, and along that horizon a " +
        "low line of near-black indigo distant hills, the horizon an unbroken " +
        "smooth empty line with nothing standing anywhere along it and nothing " +
        "breaking its outline, a wide glowing band of warm ember orange and " +
        "deep rose lying evenly along the whole length of the horizon and " +
        "taking up the lower third of the sky, the brightest thing in the " +
        "picture, fading up through dusty violet into deep midnight blue at the " +
        "top of the frame with the first few small faint stars, coloured the " +
        "same all the way across with no round shapes in it, calm and warm, " +
        "empty uncluttered foreground, an empty open field with nothing growing " +
        "above the grass",
    },

    // Scene 13. The one weather plate, and its horizon is load-bearing twice
    // over: the rain sheets are SVG *and* the volcano's stir has to read
    // against a summit line the audience can still find. So the overcast is
    // asked to stay OFF the horizon — a low grey sky that swallows the far
    // hills is the failure mode, not a mood.
    meadow_rain: {
      prompt:
        "a wide gently rolling summer meadow under a warm overcast sky seen " +
        "from slightly above, looking down across the field, painted as flat " +
        "simplified storybook shapes, the bottom half of the frame a broad " +
        "plain sweep of rain-darkened green grass, seen from above as one " +
        "smooth flat surface of colour with no individual blades of grass, " +
        "no tufts, no seed heads, no wheat and no detail in it at all, " +
        "staying completely plain and smooth right down to the bottom edge " +
        "of the frame, one straight simple horizon line placed just below " +
        "the middle of the frame with the sky filling the whole top half of " +
        "the picture, " +
        "and along that horizon a low line of cool blue-grey distant hills, " +
        "clearly darker and bluer than the pale sky behind them so the line " +
        "where they meet the sky is easy to see, the horizon an unbroken smooth " +
        "empty line with nothing standing anywhere along it and nothing " +
        "breaking its outline, an even soft silver-grey and warm cream overcast " +
        "sky above with no blue in it and no dark storm clouds, gentle and " +
        "calm, muted low contrast palette, no rain, no puddles, empty " +
        "uncluttered foreground, an empty open field with nothing growing above " +
        "the grass",
    },

    // --- OFF THE GROUND ----------------------------------------------------

    // Scene 2, the seeds' ride. Sky only, mid-air. The seeds are SVG and they
    // cross the middle of the frame, so the middle is the part that has to be
    // nothing.
    sky_drift: {
      prompt:
        "a bright morning summer sky filling the entire frame, clear cyan blue " +
        "deepening towards the top and paling towards the bottom edge, three " +
        "big soft rounded white cumulus clouds tucked into the corners of the " +
        "frame, each partly cut off by the edge of the frame, the whole " +
        "middle and centre of the picture completely open empty clear blue " +
        "with nothing in it, no ground, no horizon, airy and light and calm",
    },

    // Scenes 11-12, the Cloud Hotel. Up at cloud height: a soft cloud floor low
    // in the frame for the SVG hotel to sit on, warm afternoon light, and an
    // open middle because Cloudia and the hotel both live there.
    sky_cloud_level: {
      prompt:
        "high up at cloud height on a warm afternoon, a soft rolling floor of " +
        "thick rounded white and cream cloud banks across the bottom third of " +
        "the frame painted as flat simple shapes with warm gold along their " +
        "tops and soft blue-grey in their hollows, a huge clear warm blue sky " +
        "above filling the top two thirds with a few small clouds far away " +
        "near the edges, completely open and empty through the middle of the " +
        "frame, no ground, no horizon, bright and airy",
    },

    // --- DOWN AT PIP'S SCALE -----------------------------------------------

    // Scenes 3, 5 (close), 6, 9, 10 and the surface halves of 14/16. Pip's dirt
    // patch, her mark and every root are SVG and land in the middle of this, so
    // the middle is a plain open patch and the grass is a soft out-of-focus
    // wall around the outside — the ep-2 `grass_low` rule (the blades that
    // matter are drawn, and painting them twice double-draws the world), turned
    // inwards.
    grass_close: {
      prompt:
        "a children's picture-book illustration of a small bare patch of " +
        "earth in a meadow, painted in matte gouache as flat simplified " +
        "storybook shapes in big soft masses of muted low-saturation colour, " +
        "gentle even light, no shiny highlights, tall simple soft green " +
        "grass painted as plain flat overlapping masses rising along the " +
        "whole left edge and the whole right edge of the picture and meeting " +
        "across the top of the picture, with no individual outlined blades " +
        "and no fine detail, and in the middle and bottom of the picture a " +
        "large plain open patch of dull medium-dark cocoa brown earth, a " +
        "muted chocolate brown painted as a single smooth flat even mass of " +
        "colour with absolutely nothing on it, no horizon, no sky, no small " +
        "plants, no stones, no pebbles, no twigs, not a photograph, not " +
        "photorealistic, not a 3d render, no depth of field, no blur",
    },

    // Scenes 14 and 16, and OPTIONAL by design: the roots, the straws, the
    // water and Drip are all drawn and all have to line up, so if this ever
    // fights the drawn cutaway the drawn one wins and this key goes unused. It
    // is therefore the flattest, quietest image in the set on purpose — a
    // texture, not a picture.
    soil_cutaway: {
      prompt:
        "a plain flat band of dark chocolate brown garden earth filling the " +
        "whole frame, seen straight on as a smooth cross-section, painted as " +
        "one even field of soft dark brown and warm umber brush strokes with " +
        "very gentle darker and lighter patches, all one single colour with no " +
        "bands and no stripes and no lighter or darker zones across the frame, " +
        "no stones, no roots, no plants, no worms, completely empty and " +
        "uniform, very low contrast, calm and warm",
    },
  },
};

// --- THE DELIVERED SET, MEASURED (showrunner acceptance, 2026-08-08) --------
//
// Sampled off the committed webps (scratchpad/ep4b2/measure.mjs + skyline.mjs).
// `meanLum` is whole-frame mean luminance out of 255 — the VALUE ladder the
// times of day are supposed to differ on. `skyline` is the sky→land row as a
// fraction of plate height, measured inside an eyeball-verified window (a
// naive global max-jump detector finds field-band boundaries instead).
//
// SEATING RULE (B3): the volcano sits at MEADOW.horizon = 604/1080 = 0.559.
// A plate is drawn at `scale` (below) with its top cropped so its skyline row
// lands on 604; a skyline ABOVE 0.545 cannot reach 604 at the minimum 1.43×
// fit, so those plates scale up and crop horizontally. Every crop below is
// harmless: the two big-crop plates (sunset 21%, rain 11%) are edge-to-edge
// band skies with nothing composed in their corners. Numbers live in
// `PLATES` in scenes/common.tsx — that table is the one the acts consume.
//
//   key              meanLum  skyline  seat scale  h-crop
//   meadow_night        43.8    0.510      1.54       7%
//   meadow_dusk         60.0    0.594      1.43       0%
//   meadow_sunset      100.4    0.435      1.81      21%
//   meadow_dawn        111.5    0.520      1.51       6%
//   meadow_rain        168.7    0.492      1.60      11%
//   meadow_day         178.5    0.533      1.48       3%
//   meadow_aerial      179.0    0.592      1.43       0%
//   meadow_sunrise     192.1    0.617      1.43       0%
//   meadow_morning     193.7    0.543      1.45       1%
//   (no-skyline keys: sky_drift 159.7, sky_cloud_level 194.8 — cloud floor
//   top edge ≈ 0.557, the Hotel's seat line; grass_close 155.4;
//   soil_cutaway 55.0)
//
// The delivered value ladder, dark to light: night 44 < dusk 60 < sunset 100
// < dawn 112 < rain 169 < day 178.5 < sunrise 192 ≈ morning 194. Golden hour
// is meadow_day graded down-and-warm in comp (target ≈ 140, between day and
// rain) — see the cut note at the meadow_golden slot above.
//
// Accepted deviations, logged in ep4-decision-log.md: morning measures a step
// ABOVE day rather than below (soft pale-haze morning vs saturated deep-blue
// day — reads right on screen, numbers inverted); morning's third cloud sits
// left-of-centre high (bubble stack is at x=812 — watch it in review);
// dusk's field is darker than night's (end-card silhouette scene, the ember
// band carries the value identity); aerial reads as a high elevated wide
// (sky ≈ 55%) rather than the design's three-quarter-sky extreme aerial —
// two rolls would not go lower, and the title pull-back's altitude is sold
// by `MeadowWorld`'s lift, not the plate; dawn has one ~10px speck on the
// horizon at x≈0.46 (reads as a distant bush; volcano sits at x=336);
// grass_close is crisper-edged vector than the soft wides — accepted as
// close-scale grammar, its cream top is a clean bubble zone.
