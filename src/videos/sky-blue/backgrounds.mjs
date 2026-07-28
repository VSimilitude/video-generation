// Painted backgrounds for "Ray and the Sky Nobody Painted" (kids ep 3).
//
// Read scripts/generate-backgrounds.mjs first; `npm run backgrounds -- --video
// sky-blue` turns this file into public/backgrounds/sky-blue/*.webp plus a
// generated backgroundManifest.ts. Nothing here is rendered directly.
//
// THE ANCHOR IS THE SHOW — but this episode's anchor is deliberately SHORTER
// than episode two's, and that is the one real change in this file.
//
//   Episode two's anchor named the weather: "sunny morning under a clear cyan
//   blue sky, soft rounded white cumulus clouds, fresh saturated yellow-greens".
//   That was right for an episode that never left a green hill on a bright day,
//   and it is exactly wrong for this one, which visits the surface of the Sun,
//   deep space, a sunset, a dusk and the Moon. An anchor that insists on a cyan
//   sky would fight five of the twelve plates, and flux resolves that fight by
//   painting a blue sky into the Moon shot.
//
//   So the anchor here carries only the *hand*: medium, brush, edge quality,
//   and the four never-draw-this rules. Every prompt names its own palette
//   explicitly instead — which is the ep-2 lesson ("naming the sky colour and
//   the greens explicitly is what fixed it") applied per key rather than once.
//   The plates still read as one episode because the medium is what the eye
//   matches on, and because six of the twelve are the same bright daylight and
//   carry the same words for it.
//
// WHAT A PROMPT HAS TO BUY, beyond a pretty picture (unchanged from ep 2):
//
//   1. A clean lower third. Characters stand, hover and cast contact shadows in
//      the bottom of the frame; painted detail there fights them and wins.
//   2. Open sky in the upper half. Speech bubbles live above a speaker's crown.
//   3. No characters, no text, no birds. Anything with a face competes with the
//      cast; anything with letters is a caption, and this series has none.
//   4. Nothing that is already SVG. The garden's red flowerbed, the yellow
//      duck, the paddling pool, the fence post, the raindrops, the seven colour
//      blobs, the volcano, the waves, the astronaut, the Earth and every arrow
//      and diagram in the episode are animated components drawn *on top* of
//      these plates. `garden_day` therefore has no flowers in the foreground:
//      Ray is the only white thing in Scene 7 and his whiteness has to read
//      against SVG colour we control, not against paint we cannot dim.
//
// A THIRTEENTH WORLD, FOR FREE. Scenes 1 and 30 (the crayon frame story) are on
// the hill from episode two and use `wind`'s own `hill_day` plate directly —
// see PLATES in scenes/common.tsx. Same painted world, no second generation, and
// the two episodes' hills cannot drift apart because there is only one of them.

export default {
  styleAnchor:
    "background art for a preschool animated series, soft gouache painting, " +
    "visible brush texture, saturated storybook colour, gentle airbrushed " +
    "shading, soft rounded shapes, simple uncluttered composition, " +
    "no characters, no people, no animals, no text, no watermark",

  backgrounds: {
    // --- Cold open: the page ------------------------------------------------
    // Scenes 1 and 30, looking straight down. The drawing, the crayon box and
    // the kid are all SVG on top, so this is nothing but ground: a lawn seen
    // from above, late afternoon, with a big empty middle for the page. Scene
    // 30 is the same plate under a warm dusk wash (the shot has to be
    // recognisably the same grass, so the change is a tint, not a re-roll).
    grass_overhead: {
      prompt:
        "looking straight down at a patch of summer lawn from directly above, " +
        "soft painted green grass filling the whole frame with gentle brush " +
        "texture and a few darker clover leaves near the edges, warm late " +
        "afternoon light, completely empty and open through the middle of the " +
        "frame, no objects, no path, no flowers",
    },

    // --- Act One: ninety three million miles away ---------------------------
    // Scenes 3 and 4. Stylised, NOT scary: churning gold, warm and inviting,
    // the surface of a friendly star. The launch rail, the stadium of sunbeams
    // and Sunny himself are all SVG over this, so the plate is texture and
    // depth only, and the bottom of the frame is kept quiet for the rail.
    // Attempt 2. Attempt 1 asked for "warm molten gold and amber and honey
    // yellow" and got exactly that and nothing else: one flat orange field with
    // paler bubbles on it, and no value range anywhere in the frame. Ray is a
    // warm *white* body with an amber outline, so a plate with no dark in it is
    // the one background he cannot be seen against. This one names the darks
    // (deep amber seams, a burnt-orange band low down) and asks for a strong
    // light-to-dark range in words, which is the only thing that fixed it.
    sun_surface: {
      prompt:
        "the churning surface of a friendly storybook sun seen up close, " +
        "painted in thick gouache with visible brush strokes, big soft rounded " +
        "convection cells of pale cream yellow and bright gold separated by " +
        "deep burnt amber seams, strong contrast between the bright cells and " +
        "the dark seams between them, a band of deep burnt orange across the " +
        "bottom quarter of the frame, two gentle looping flares curling up at " +
        "the far edges, warm and inviting and not frightening, no fire, no " +
        "smoke, flat simplified shapes, not photographic",
    },

    // Scene 5's eight-minute journey, and the deep-space bed under Scenes 27
    // and 31. Deliberately the emptiest plate in the set — the joke in Scene 5
    // is that nothing in it changes, so anything eye-catching in here would be
    // a thing to watch during a beat built on there being nothing to watch.
    space_stars: {
      prompt:
        "deep space, a smooth very dark navy blue to black painted field " +
        "filling the whole frame, scattered small soft white and pale blue " +
        "stars of different sizes, one faint dusty violet nebula wash low in " +
        "the corner, calm and quiet and empty through the middle, no planets, " +
        "no moons, no spacecraft, no bright light source",
    },

    // --- Act One: the garden ------------------------------------------------
    // Scenes 6-13, the busiest world in the episode and the most constrained.
    // The script wants a garden "absolutely stuffed with colour" that Ray reads
    // as left out of — but every saturated thing he is compared against is SVG
    // (the red flowerbed, the yellow duck, the paddling pool, the fence post,
    // the dog) so that Scene 6's two-frame drain can pull the colour out of all
    // of them at once. A painted flowerbed cannot go grey. So the plate is the
    // *setting*: green lawn, hedge, a warm sunlit far end, and a clean empty
    // lower third for the cast and the seven-blob arc.
    // Attempt 2, and the one plate in the set that had to be re-rolled for
    // *style* rather than for content. Attempt 1 came back photorealistic — a
    // rendered tree with individual leaves, a sharp clipped hedge, a smooth
    // 3D lawn — which is a different show from episode two's gouache, and the
    // style anchor alone did not hold it: a prompt made of realistic nouns
    // ("hedge", "tree", "lawn") pulls flux straight back to a photograph. The
    // fix is to say the medium again *inside* the prompt and to name the
    // shapes as simplified, which no other key in this set needed because no
    // other key is a real place at eye level.
    garden_day: {
      prompt:
        "a sunny back garden on a bright summer morning seen from lawn level, " +
        "painted in thick gouache with visible brush strokes and flat " +
        "simplified storybook shapes, a broad plain sunlit yellow-green lawn " +
        "across the bottom third with no detail in it at all, one soft rounded " +
        "green hedge shape and one simple round leafy tree crown in the middle " +
        "distance painted as flat blocks of green with no individual leaves, " +
        "warm sunlight from the left, a big clear cyan blue sky with two soft " +
        "rounded white clouds filling the upper half, empty uncluttered " +
        "foreground, no flowers, no pond, no fence, no furniture, not " +
        "photographic, not a 3d render",
    },

    // --- Act Two: the open sky ----------------------------------------------
    // The act's home plate: Scenes 14, 16, 17, 20-24, and the recap's split
    // panels. It is on screen longer than anything else in the episode and it
    // spends most of that time with a diagram, a word card or a split screen
    // over it, so it is the quietest plate in the set on purpose.
    sky_dome_day: {
      prompt:
        "an enormous clear summer sky filling the entire frame, deep cyan blue " +
        "at the top softening to pale warm blue near the bottom, three small " +
        "soft rounded white clouds low near the bottom edge, completely open " +
        "and empty through the whole middle of the frame, no ground, no " +
        "horizon, no sun, calm and airy",
    },

    // Scene 20's kid-height view, and Scene 33's ordinary street. One plate for
    // both, because they are the same claim twice: this is happening over the
    // roof of the room the child is sitting in.
    street_day: {
      prompt:
        "an ordinary quiet suburban street on a bright day seen from a child's " +
        "eye level, two simple soft painted houses with pitched roofs low in " +
        "the bottom third of the frame, a small front garden hedge, a big open " +
        "cyan blue sky with a few soft white clouds filling the top three " +
        "quarters, warm friendly light, empty road, no cars, no signs, no " +
        "lamp posts, no wires",
    },

    // --- Act Two: the two myth-busts ----------------------------------------
    // Scene 15 runs three plates in a row and the joke is that only one thing
    // changes between them. `bay_blue` and `bay_grey` are the SAME bay in
    // different weather, so their prompts are deliberately near-identical: the
    // second one changes the sky and the water and nothing else.
    bay_blue: {
      prompt:
        "a postcard-perfect sunlit bay seen from the shore, calm deep blue sea " +
        "filling the lower half with soft painted ripples, a low soft green " +
        "headland far away on the right horizon, a straight clear horizon line " +
        "just below the middle of the frame, brilliant cyan blue sky with a " +
        "few small white clouds above, no boats, empty foreground",
    },

    bay_grey: {
      prompt:
        "the same calm bay on an overcast grey day, flat grey-green sea " +
        "filling the lower half with soft painted ripples, a low soft green " +
        "headland far away on the right horizon, a straight clear horizon line " +
        "just below the middle of the frame, a low soft grey and white " +
        "overcast sky above with no blue in it at all, no boats, empty " +
        "foreground, muted desaturated palette",
    },

    // The counter-example: no sea for a thousand miles, same blue sky.
    desert_day: {
      prompt:
        "a wide empty desert of soft rolling orange and apricot sand dunes " +
        "under a brilliant cyan blue sky, the dunes across the bottom third " +
        "with smooth painted crests and long soft shadows, a flat empty " +
        "horizon, enormous clear blue sky filling the upper two thirds, no " +
        "plants, no rocks, no tracks, no buildings",
    },

    // --- Act Three: the sunset ----------------------------------------------
    // THE VOLCANO RULE (script.md, Production notes) makes the horizon in these
    // two plates load-bearing: the sleeping island volcano is SVG and sits on
    // the *measured* horizon, sampled off the plate, so the prompt asks for one
    // straight unambiguous waterline and nothing standing on it. A plate with a
    // hazy or broken horizon cannot be measured and the gag floats.
    //
    // MEASURED, so nobody has to guess (sharpest row-to-row transition down the
    // plate, as a fraction of its height — every plate is 1344×768):
    //
    //     sea_sunset   0.5391      bay_blue   0.5339
    //     sea_dusk     0.5130      bay_grey   0.4857
    //     moon_surface 0.4961
    //
    // `plateY(frac, …)` in scenes/common.tsx turns one of those into a
    // composition y for whatever `drift`/`dy`/`zoom` the scene passes to
    // `PaintedSky`. Use it; the cover-crop and the overscan are both real and
    // neither is guessable by eye.
    // Attempt 3, and the most stubborn key in the set. **Sunny is an SVG
    // character half sunk behind this horizon in Scenes 29 and 31**, so a
    // painted sun means two suns in frame and the episode's oldest running gag
    // lands on the wrong one.
    //
    // Attempts 1 and 2 both painted a large disc on the waterline anyway, and
    // they failed in the two different ways the ep-2 turbine lesson predicts.
    // Attempt 1 named the thing to exclude ("no sun disc is visible") and got
    // one. Attempt 2 stopped naming it but still described the *lighting* of a
    // sunset ("no bright spot anywhere in the sky"), and a model asked for a
    // sunset sky will paint the object that makes one. Attempt 3 stops asking
    // for a sunset at all: it asks for an evening sky that is uniformly
    // covered in warm cloud, which is a picture with nowhere for a disc to go.
    // Generalised: to lose an object, remove the *lighting condition* that
    // implies it, not just the noun.
    sea_sunset: {
      prompt:
        "a wide calm open sea seen from just above the water, painted in " +
        "gouache with visible brush strokes, one perfectly straight clear " +
        "horizon line across the middle of the frame with nothing on it, and " +
        "above it a sky completely covered edge to edge in soft flat " +
        "horizontal bands of warm coral and tangerine and deep orange cloud, " +
        "evenly coloured all the way across with no round shapes in it, the " +
        "water below reflecting the same warm colours in soft painted ripples, " +
        "empty foreground, no boats, no islands, no land",
    },

    // Scenes 31 and 35: later, darker, cooler, same geography and the same
    // measurable horizon.
    sea_dusk: {
      prompt:
        "a wide calm open sea at late dusk seen from just above the water, one " +
        "perfectly straight clear horizon line across the middle of the frame " +
        "with nothing standing on it, a deep indigo and plum sky above fading " +
        "to a low band of dim ember orange right along the horizon, the first " +
        "few faint stars high up, dark still water below with soft painted " +
        "ripples, empty foreground, no boats, no islands, no land, no moon",
    },

    // --- Recap: the mind-blower ---------------------------------------------
    // The single most counter-intuitive image in three episodes: hard bright
    // sunlight and a black sky in one frame. The astronaut, their shadow and
    // the blue-marble Earth are all SVG, so the plate has to leave the upper
    // half genuinely black (that is the whole fact) and the lower half a bright
    // lit grey landscape with a close horizon and room to stand on.
    moon_surface: {
      prompt:
        "the surface of the moon in blinding direct sunlight, a bright pale " +
        "grey dusty plain with soft shallow craters filling the bottom third " +
        "and running to a close curved horizon, and above it a completely " +
        "solid pitch black sky filling the top two thirds scattered with small " +
        "sharp white stars, hard bright light on the ground, wondrous and calm " +
        "and not frightening, empty foreground, no earth, no planets, no " +
        "spacecraft, no flag",
    },
  },
};
