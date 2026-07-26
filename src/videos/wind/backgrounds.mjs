// Painted backgrounds for "Puff and the Kite That Wouldn't Fly" (kids ep 2).
//
// Read scripts/generate-backgrounds.mjs first; `npm run backgrounds -- --video
// wind` turns this file into public/backgrounds/wind/*.webp plus a generated
// backgroundManifest.ts. Nothing here is rendered directly.
//
// THE ANCHOR IS THE SHOW. `styleAnchor` is appended to every prompt and is the
// only reason nine separately-generated images look like one episode. Tune it
// once, for the whole episode, and re-run — never per key. It was written
// against the art direction Mike approved (tmp/style_gouache.webp).
//
// WHAT A PROMPT HAS TO BUY, beyond a pretty picture:
//
//   1. A clean lower third. Characters stand, hover and cast contact shadows
//      in the bottom of the frame; painted detail there fights them and wins.
//      Every prompt says so ("simple uncluttered foreground", "empty
//      foreground").
//   2. Open sky in the upper half. Speech bubbles live above a speaker's
//      crown, and a bubble over a busy cloud bank is unreadable at six.
//   3. No characters, no text, no birds. Anything with a face competes with
//      the cast; anything with letters is a caption, and this series has none.
//   4. Nothing that is already SVG. The grass blades, the waves, the turbine
//      rotors, the dandelions and the kite are all animated components drawn
//      *on top* of these plates — painting them twice double-draws the world.
//      That is why `headland_turbines` has no turbines in it and `grass_low`
//      has no grass in the foreground.

export default {
  // Attempt 2. Attempt 1 ("…warm morning light, gentle saturated colours…")
  // hazed every plate out to cream and white: five of nine came back with no
  // blue in the sky at all, which is the one thing the approved reference is
  // built on. Naming the sky colour and the greens explicitly is what fixed it.
  styleAnchor:
    "background art for a preschool animated series, soft gouache painting, " +
    "visible brush texture, sunny morning under a clear cyan blue sky, soft " +
    "rounded white cumulus clouds, fresh saturated yellow-greens, gentle " +
    "airbrushed shading, storybook, no characters, no people, no animals, " +
    "no text, no watermark",

  backgrounds: {
    // --- cold open + Scenes 31/32: the hill the whole episode brackets -----
    // Same geography as `hillY()` in scenes/common.tsx: one broad crest right
    // of centre, falling away to the left. The kid, the kite and (at the end)
    // Puff all stand on the SVG hill drawn over this, so the painted crest
    // only has to agree with it in *shape*, not in pixels.
    // Attempt 3. Attempts 1 and 2 both painted a big foreground hill, and the
    // SVG `Hill` (which the kid *stands* on, via `hillY()`) has a different
    // crest — two green ridges in one frame, unalignable by any pan, because
    // one is a parabola about x=1250 and the other is not. So this plate is
    // now sky plus the *far* hills only: it replaces the two distant hill
    // shapes `Hill` used to draw, and the near hill stays SVG because the
    // geometry is load-bearing. The lesson is general: where a painted shape
    // and a character's ground line disagree, the ground line wins and the
    // prompt gives up that band of the frame.
    hill_day: {
      prompt:
        "an enormous open blue summer sky filling the top four fifths of the " +
        "frame with a few soft white clouds, and along the very bottom edge a " +
        "low line of soft hazy distant green hills, seen from a high vantage " +
        "point, no foreground, no near hill, simple uncluttered composition",
    },

    // --- Act One: the grass world, at Puff's scale ------------------------
    // The SVG blades are green skyscrapers standing ON this. So the plate is
    // sky and a soft out-of-focus meadow band low down — anything sharper
    // reads as a second set of grass behind the first.
    grass_low: {
      prompt:
        "looking up from ground level in a meadow, the top four fifths of the " +
        "frame is a bright blue morning sky with soft white clouds, and across " +
        "the very bottom edge one narrow band of far-away green meadow painted " +
        "completely out of focus, blurred and hazy with no individual blades " +
        "of grass and no detail at all, empty uncluttered foreground",
    },

    // --- Act Two: Sunny's sky --------------------------------------------
    // Sunny (the sun, with a face) is staged high in these scenes, so the plate
    // must not contain a painted sun — and it is a *day* scene with warm light
    // in it, not a sunset. Attempt 1 came back as an orange sunset with
    // mountains, which is why both are ruled out in words here.
    sky_gold: {
      prompt:
        "a bright blue summer sky filling most of the frame with warm golden " +
        "sunlight spilling in from the upper left, soft white clouds tinted " +
        "gold along their tops, a low band of sunlit green meadow across the " +
        "bottom edge, no sun disc in the picture, not a sunset, no mountains, " +
        "wide open middle of frame, simple uncluttered composition",
    },

    // The lift. High above the meadow, looking out: clouds at eye level and
    // the ground reduced to soft patchwork a long way down.
    sky_high: {
      prompt:
        "high above the countryside looking out across the sky, soft rounded " +
        "clouds at eye level in the lower half, tiny soft green and yellow " +
        "patchwork fields far below through the haze, huge clear pale blue sky " +
        "in the upper half, airy and light, simple uncluttered composition",
    },

    // --- Act Three: the coast --------------------------------------------
    beach_wide: {
      prompt:
        "a wide empty sandy beach seen from low down, softly painted pale gold " +
        "sand with brush texture across the bottom third, no footprints, no " +
        "tracks, no shells, no seaweed, calm blue sea meeting the sky in a " +
        "straight horizon just below the middle of the frame, big open sky " +
        "above with a few soft clouds, simple uncluttered composition",
    },

    bay: {
      prompt:
        "a calm sunlit blue bay seen from the shore, gentle open water filling " +
        "the lower half with soft painted ripples, a low soft green headland " +
        "far away on the right horizon, no boats, big open sky above with a few " +
        "soft clouds, simple uncluttered composition",
    },

    // Scene 28's ridge — deliberately WITHOUT turbines: the turbines are SVG
    // so their rotors can turn.
    // Attempt 2. Attempt 1 said "no wind turbines" and got two painted ones on
    // the ridge — naming the thing summons it. The fix is to describe an empty
    // hilltop and never use the word at all.
    headland_turbines: {
      prompt:
        "a broad open green headland ridge above a calm blue sea, seen from " +
        "slightly below, a smooth empty grassy slope rising across the bottom " +
        "right, the open sea and a soft distant coastline on the left, the " +
        "hilltop completely bare with nothing standing on it, no buildings, " +
        "no poles, no masts, enormous open sky above, simple uncluttered " +
        "composition",
    },

    // Scene 29's countryside, under an SVG hillside of nodding dandelions.
    country_fields: {
      prompt:
        "rolling green summer countryside seen from a low hillside, soft " +
        "distant hedgerows and pale yellow fields receding to a far horizon in " +
        "the lower third, smooth empty green slope in the foreground, warm " +
        "hazy light, big open sky above with soft clouds, simple uncluttered " +
        "composition",
    },

    // --- Recap ------------------------------------------------------------
    // Behind split panels, a globe and a chant. Everything here is furniture
    // with hard edges, so the plate has to be the quietest image in the set.
    sky_recap: {
      prompt:
        "a plain soft blue summer sky filling the whole frame, a few small " +
        "gentle rounded clouds near the edges, completely empty through the " +
        "middle of the frame, no ground, no horizon, very simple and calm",
    },
  },
};
