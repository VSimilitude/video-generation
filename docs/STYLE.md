# Style guide

The house style for videos in this suite.

**Every rule here is provisional.** These are the conclusions we currently
believe, seeded from the hero_swap video and the scaffold's conventions —
not settled doctrine. After each video, the retro in `docs/LEARNINGS.md`
decides what changes; edit this file to match rather than accumulating
exceptions. If a rule keeps getting broken, it's the wrong rule.

## Format

- 1920×1080 @ 30 fps. Deviate only with a reason worth writing down.
- Compositions export `FPS`, `WIDTH`, `HEIGHT` and a `timeline()` helper;
  `src/Root.tsx` takes duration from `timeline()`, never a hardcoded number.

## Pacing

- **Pacing is audio-driven.** Scenes are declared in `buildTimeline()`
  (`src/lib/narration.ts`) and stretch to fit their narration clip plus a
  silent tail (`DEFAULT_TAIL_FRAMES` = 15). Never hand-time a scene to match
  the audio you just listened to — that breaks the moment the line is
  reworded.
- `minFrames` is a floor for scenes that would otherwise flash by (and the
  only length control for silent scenes). It is not a target.
- Raise `tailFrames` on cuts that feel rushed, especially the final scene
  (pipeline-demo uses 30 on `outro`).
- **Slow beats fast.** hero_swap's scenes ended up roughly 1.6× their
  original budgets before they were comfortably legible. When in doubt,
  give a beat more room; viewers forgive slow far more than they forgive
  missing what happened.
- Note the difference between *slow* and *thin*. "Slow beats fast" is about
  giving a beat enough time to be read; it is not a licence to stretch three
  ideas over four minutes. Length should come from **more mechanism**, not
  from longer holds on the same card — see the next section.

## Animation must mean something

The direction that produced bond-basics v2, from the reviewer, verbatim:
*"animation should be meaningful and engaging — graphs drawn dynamically (eg
to show the price vs yield relationship, making it more intuitive)"*, and
*"more depth, it can be longer"*.

- **The motion is the explanation, not the transition into it.** Ask of every
  animated element: what does a viewer understand *after* it moves that they
  didn't before? If the answer is "the same thing, but it arrived with a
  bounce", it's decoration.
- **Quantitative ideas get a drawn graph, not a card that pops in.** A curve
  that draws left-to-right while the narration says "as the yield rises, the
  price slides down" *is* the sentence. A card reading "price ↓ yield ↑" is a
  summary of a sentence the viewer already heard. Use
  `src/lib/components/graph/` (see **Graphs** below).
- **Show the mechanism, not just the result.** Bond-basics v1 asserted that
  price and yield move oppositely; v2 discounts each cash flow back to today
  and stacks the pieces into the price. Same claim, but one of them is an
  argument the viewer can follow.
- **Entrance springs are seasoning, not the meal.** Springs remain the right
  tool for an element arriving (docs below), but a scene whose entire
  animation budget is spent on entrances has no explanation in it. Continuous,
  value-carrying motion — a marker sliding along a curve, a number counting to
  its new value, a bar shrinking by its discount factor — uses `interpolate`.
- **Animate the value, never the label.** A readout changes because the number
  behind it changed and was re-formatted, not because two strings were
  cross-faded. That is what keeps a chart honest: `$973` appears on screen
  because `price(6%)` returned it.
- **Plot real functions.** Curve points come from a function in the video's own
  module (e.g. `src/videos/bond-basics/pricing.ts`), with checkpoints recorded
  next to it. Never hand-place points to make a shape look right.
- **Target 3–5 minutes for an educational explainer, at mechanism-level
  depth.** The old 2-minute instinct forces every idea down to an assertion.
  If a topic only fills two minutes, it is probably missing its "why".

## Graphs

Charts in this suite use `src/lib/components/graph/` (`AnimatedGraph` +
`GraphCurve` / `GraphMarker` / `GraphChip` / `GraphLegend`). House rules,
adapted from the dataviz skill's form/axis/mark guidance to a 1920×1080 frame —
our theme palette overrides its colors:

- **Axes draw in first, then the curve, then the marker.** One idea per graph.
- **Label the axes with units** and keep ticks few and round (4–7 per axis).
  No gridlines: at video size they are clutter, and the marker's dashed
  projections already carry "read this value off the axis".
- **Legibility floors:** nothing under 34px; tick labels 34, axis titles 40,
  readouts 42. Numbers use tabular lining figures so a readout doesn't jitter
  as it counts.
- **A single series gets no legend** — the caption names it. Two series get a
  legend *and* direct labels (our accent/good pair separates well for normal
  vision and for protan/deutan, but the tritan margin is thin, so identity is
  never carried by hue alone).
- **A graph that persists across a cut must not re-draw.** Mount it with
  `ALREADY_DRAWN` in the following scene so the picture is continuous and only
  the marker moves — re-drawing reads as a *different* chart.
- Check axis-title and readout geometry against `CAPTION_SAFE_BOTTOM` like any
  other captioned content; the graph's bottom margin is the part that gets
  close.
- **A readout chip replaces the scale it covers.** Chips declare their box and
  `AxisTicks` fades the tick labels that intersect it (plus a clearance band),
  so a chip never sits half on top of a number. Nothing per-video to do —
  but it means a chip parked on an axis will take a tick or two with it.

## Voice

*(This section is the narration pipeline and applies to both series.)*

- **Two engines, and a default.** `kokoro` (local, free, instant) is the
  default and is what a **narrator** uses — it re-synthesizes the moment a
  line is reworded, which is the whole reason narration text can stay the
  source of truth. `minimax` (MiniMax speech-2.8-hd via Replicate, ~$0.11 per
  1000 characters) is for **characters who act**: it takes an `emotion` and
  honours inline pause markers, neither of which kokoro has. Declare it
  per line — `{ text, engine: "minimax", voiceId, emotion, speed }`.
- A minimax clip costs money and takes ~12 s of paced API time; a kokoro clip
  costs neither. Cast on what a line needs, not on which model is newer.
- **Emotion is seasoning, not a setting.** A line carries an `emotion` only
  when a stage direction in the script asks for one, and the comment on the
  line names the direction it came from. When in doubt, `auto` — that is the
  model reading the words as written, and the words were written to carry it.
  A file where every line has an emotion has none.
- **Pause markers (`<#0.4#>`) are for intra-line timing the script already
  asked for**, and nothing else. Every other silence in a video is a held beat
  *between* lines and belongs to `gaps`/`gapFrames` in the composition, where
  it is visible to the timeline and to whoever is staging the scene. Markers
  are a MiniMax feature: the generator rejects one on a kokoro line, where the
  model would read the punctuation out loud.
- When a scene wants a different tone, audition rather than guess:
  `npm run narration -- --audition <slug>:<lineKey> <dir>`, then pick by ear —
  and for MiniMax candidates, `… <dir> --engine minimax --voices <id1,id2,…>
  [--emotion happy]`. Model-card grades are not a ranking of what sounds right.
- Audition on the *hardest* lines a character has, not the first one — a small
  apology, a delighted shout and a big push ask three different things of one
  voice.
- Per-line overrides (`{ text, voice, speed }`) are the mechanism for a
  one-off tonal shift; don't fork a whole video's voice for one aside.
- **A body with a face and a line gets its own voice.** The narrator may quote
  a character ("and the moose said…") but must not *be* one: a bit-part
  delivered in the narrator's voice reads as the storyteller doing a voice, and
  any joke that depends on somebody-other-than-the-narrator saying it collapses.
  The wind episode had its narrator cameo a beetle, a leaf and a rock to keep
  the cast at five; the six-year-old's first note was "the beetle and the leaf
  sound like the narrator", and recasting all three cost three cents. Voice
  count is not a budget worth defending.
- **Share the recording for a repetition gag; don't order it twice.** Kokoro is
  deterministic, so identical text in an identical voice gives an identical
  clip for free. A paid remote model does not: MiniMax returned the same
  sentence at 2.20s and then 2.84s, in the line whose entire job was to sound
  the same as it had five minutes earlier. Use
  `{ sameAs: "<earlier key>" }` — the generator copies the clip under the new
  key, so nothing downstream can tell, and it costs nothing.
- **Spell out initialisms** so the voice reads letters, not a word: "U R",
  not "UR". Same for anything the model mangles — respell phonetically
  ("kay-o-koh"). Listen to every clip before building visuals; fixes are
  cheap before scenes exist and expensive after.
- **Spelling is per engine, so recasting a character is a text edit too.** A
  stretched vowel ("Poooof", "PUUUSH", "Ohhh") is a kokoro instruction — it
  reads the run as one long sound. MiniMax reads it as separated syllables and
  the word arrives broken. On a minimax line the length comes from the
  `emotion` instead (the wind episode's big shout is a plain "PUSH!" at
  `angry`, which that engine plays as effort and volume, not temper). Single
  letter runs — WHOOSH, FWOOSH — are fine on both. When a line moves engines,
  sweep its sound words before assuming the clip is the same clip.
- **The drawn word and the spoken word are allowed to disagree.** A speech
  bubble may keep "PUUUSH!" while the clip says "PUSH!": on screen the extra
  letters are a picture of a long loud noise, which is exactly what a
  pre-reader needs and exactly what the TTS model cannot parse. Say so in the
  script where it happens, or the next reader will "fix" one of them.
- Prefer generic, name-free narration lines where the content allows. Lines
  that don't name a specific subject can be reused across videos and
  re-cut without re-synthesis.

## Captions

- One caption per scene, in the bottom panel (`src/lib/components/Caption.tsx`).
  If a scene needs two, it's two scenes.
- Caption text mirrors or tightly summarizes that scene's narration line.
  It is not a second, competing script.
- Readability wins over snap: the caption fades and rises over ~20 frames.
  Don't shorten that to make a cut feel tighter.
- Keep captions to one or two lines at 42px within the 1440px panel; if it
  doesn't fit, the narration line is too long.
- **A captioned scene keeps all its content inside the caption-safe area.**
  The bottom `CAPTION_SAFE_BOTTOM` px of the frame (280px, derived in
  `src/lib/theme.ts` from `captionMetrics` — 64px offset + 166px two-line
  panel + 50px margin) belong to the caption and nothing else. Scenes that
  render a `Caption` wrap their content in `ContentArea`
  (`src/lib/components/ContentArea.tsx`), which fills the frame minus that
  strip — 800px of usable height on a 1080 frame — and centers what's inside.
  Never hand-pick a `paddingBottom` to approximate it: the number drifts from
  the panel's real height the moment either changes, which is exactly how
  pipeline-demo's first cut overlapped its diagram.
- Caption-less scenes (title cards, outros) use the full frame. Don't leave a
  bottom padding behind "just in case" — it reads as a mis-centered scene.

## Visuals

- Dark backdrop (`Backdrop`): slate gradient plus a soft center glow, from
  `src/lib/theme.ts`. Light text on top.
- Every text element over the backdrop gets `darkOutline()` — layered dark
  offsets plus a drop shadow — so it survives whatever is behind it.
- One accent per idea. `theme.accent` (blue) is the default;
  `theme.warm` / `theme.good` mark contrast or success states.
- **Two legible text blocks never share a spot — including mid-move.** When
  elements converge, merge or swap places, sequence it: fade the departing one
  out *before* anything arrives, then collapse the space. Geometry checks
  compare end states and will pass while the transition is an illegible smear
  (swap-basics' `hedge`, caught only by rendering stills across the beat).
  Derive text-block heights from font size × leading × line count rather than
  assuming one line, and re-render a few frames *inside* every animated beat.
- **Springs for entrances**, `interpolate` for continuous motion (growth,
  progress, sweeps). Stagger multi-element entrances so each lands on its
  own beat, as `PipelineDiagram` does. Entrances are the cheap half of the
  budget — see **Animation must mean something**.
- **Element entrances are fractions of the scene's clip, not frame numbers.**
  `beats(clip, fractions, fps)` in `src/lib/narration.ts` resolves them against
  the generated manifest, so a reworded line moves the stagger with the voice.
  Comment each fraction with the clause it targets.
- Leave room for the caption panel with `ContentArea` / `CAPTION_SAFE_BOTTOM`,
  never a per-scene `paddingBottom` — see **Captions** above.
- **The composition must be self-contained in its typography.** `@remotion/player`
  does not reset inherited CSS, so anything the embedding page sets (line-height,
  font-size, letter-spacing) cascades into the video on the site while Studio
  and `remotion render` show the browser default. `Backdrop` pins
  `fontFamily`, `color` and `lineHeight`; add to that list rather than relying
  on a UA default that only holds in one of the three environments.

## Type

- System font stack (`theme.fontFamily`) for now. It is not embedded, so a
  render on another machine can drift; if that ever shows up, switch to
  `@remotion/google-fonts` for a font that ships with the render.
- Heavy weights for headline text (900 at 108px for titles, 64px for diagram
  labels); `theme.textMuted` for secondary detail.

---

# Kids' series

**Everything above this line is the financial series and does not apply here;
everything below applies only to the kids' series.** The two share the format
rules (1920×1080 @ 30fps, `timeline()`-derived durations) and the audio-driven
pacing library (`src/lib/narration.ts`), and nothing else. The kids' toolkit
lives in `src/lib/kid/` and imports neither `src/lib/theme.ts` nor
`src/lib/components/`; keep it that way, so a kid scene can never half-inherit
slate-and-cyan. First audience: a six-year-old.

## Palette philosophy

- **Daylight, not darkness.** `kidTheme` (`src/lib/kid/theme.ts`) is built
  around bright saturated skies: `skyGradient("day" | "sunset" | "night" |
  "underwater")`. Sunset is the *calm beat* variant — use it where the
  financial series would slow down, not for variety.
- **Ink, never black.** Outlines, eyes and brows are `kidTheme.ink` (#243447).
  Pure black outlines are the single biggest tell of clip-art.
- **Bodies are flat-filled.** Not a stylistic preference: the eyelids are
  painted *over* the eyes in body colour (no clip paths, so any number of
  characters can share the document), and a gradient body cannot be matched by
  a lid — `objectBoundingBox` gives the lid its own copy of the ramp and
  `userSpaceOnUse` is resolved in the Face's transformed space. Both leave two
  flat rectangles on the character's face. Depth comes from separate flat
  highlight shapes kept clear of the face, plus the outline. Cloudia keeps a
  strictly vertical gradient and passes its colour *sampled at eye height* as
  `skin`; that is the only exception, and it exists because a white cloud with
  no ramp looks like paper.
- **Blush over a cold body needs opacity, not hue.** Pink at 40% over cyan is
  lavender. Drip carries `blushStrength={3}`; that number is a fix, not a taste.
- Round everything: radii come from `kidRadius`, never inline.

## Painted backgrounds (Tier 2)

Episode two's worlds are generated gouache plates (`backgrounds.mjs` →
`npm run backgrounds` → `public/backgrounds/<slug>/`) with the SVG cast and
props composited on top. Piloted on the wind episode; these are the rules that
came out of it.

- **One style anchor per episode, appended to every prompt.** It is the only
  reason separately-generated plates look like one show. Tune it once for the
  whole episode and regenerate; never per key. Name colours explicitly — the
  first wind anchor said "warm morning light" and hazed five of nine plates out
  to cream with no blue in the sky at all.
- **Every plate owes the frame two clean zones**: a low-detail lower third
  where characters stand and cast shadows, and open sky in the upper half where
  the bubbles go. Write both into the prompt ("simple uncluttered foreground",
  "plenty of open sky") and check each image by looking at it.
- **Anything that moves stays SVG.** Grass blades that bend, waves that roll,
  turbine rotors, dandelions, anything a character touches. A plate is scenery,
  and scenery is the part of the world that does nothing.
- **Never name a thing you don't want.** "no wind turbines" put two wind
  turbines on the ridge. Describe the empty version instead ("the hilltop
  completely bare, nothing standing on it").
- **Where a painted shape and a character's ground line disagree, the ground
  line wins.** `hillY()` is load-bearing (feet, a landing kite, a frame story
  five minutes wide) and a painted hill cannot be nudged into agreeing with a
  parabola. Give up that band of the frame in the prompt — paint the *far*
  hills and keep drawing the near one.
- **Delete the SVG the plate now draws.** Two ridges, one painted and one
  drawn, is the failure mode; scene 28's headland, scene 27's bay and scene
  29's hillside all lost their drawn ground entirely and kept only the parts
  that move.
- **SVG scenery that shares an edge with a plate matches the plate, not the
  theme.** `kidTheme.grass` is a blue-green; the plates average a yellow-green
  (#a6c013). Sample the image and keep the sampled set next to the scenery
  (`PAINTED_GREEN` in the wind kit). Characters keep the theme palette —
  scenery is what moves.
- **A plate is never dead still.** `KidPaintedBackdrop` drifts it a few px on a
  ~26s cycle with a hair of scale, and each scene passes its own `phase` so
  consecutive shots don't breathe in lockstep. `drift={0}` is allowed, but only
  as a staging decision: the wind cold open uses it because moving cloud would
  say there was wind.
- **Flat characters need a contact shadow over paint.** They did not over a
  gradient. `KidContactShadow` at the ground point, ~0.2 strength, green-shifted
  ink — and it fades out as a character lifts off, because a shadow that stays
  put under a rising character is worse than none.
- **The plate is 1344×768 and the frame is 1920×1080.** Everything is upscaled
  ~1.4×, which soft painting survives and hard edges would not. Don't put text,
  a logo or a fine grid in a prompt.

## Character-first staging

- **The characters are the content.** In the financial series a diagram
  explains and a caption narrates; here the *character* explains, and the
  backdrop is scenery. `KidBackdrop`'s clouds are at 0.58 alpha for that
  reason — a background cloud must never compete with Cloudia.
- **Faces must be huge.** A face is roughly 60–75% of the body's width. Both
  first passes at these characters failed for the same reason: the face was
  sized like an icon's, and everything below (limbs, props, colour) was
  wasted on a shape nobody could read.
- **Limbs read only outside the silhouette.** Arms are drawn *behind* the body
  so shoulders and hands never need a join, which means only the part outside
  the outline exists on screen. Short thin arms become antennae; short thick
  arms become fins. Reach far, or don't draw the limb.
- **Give every character on screen a different `phase`.** Breathing, blinking
  and mouth cycles are all driven from it; two characters sharing a phase bob
  in lockstep and instantly read as one puppet.
- **Look at the speaker.** `lookAt(from, to)` turns two staged positions into a
  pupil offset. A character listening while facing the camera looks absent.

## Motion craft

The rig (`src/lib/kid/rig.ts`) encodes the classic principles so a scene gets
them by default and cannot forget them. Everything here is a pure function of
`frame` + `phase`: no refs, no `Date`, no randomness. That is not fussiness —
Remotion hands frames to a *pool* of browser tabs, so anything that remembers
the previous frame renders differently every time.

- **Nothing starts at full speed.** Entrances anticipate: `bounce` hangs and
  stretches for ~5 frames before it drops, `pop` crouches small and wide before
  it springs. On by default for both (`Entrance.anticipate`, off for the slides
  — the character is still off frame during the anticipation, so there is
  nothing to see).
- **Nothing stops dead.** A `bounce` *accelerates* down (`kidEase.gravity`),
  compresses on the frame it lands, and rings out (`settleWave`). Anything
  hanging off a body — arms, a bow tie, rays — rides `rig.trail` (the same
  breath, four frames late) instead of `rig.squash`, so it arrives after the
  body does.
- **Emotion changes ease; they never snap.** Pass an `EmotionCue`
  (`{ emotion, from, at }`) rather than a bare name and the face *morphs* over
  ~8 frames (`EMOTION_EASE`) and settles with a degree or two of head
  follow-through. A bare `Emotion` string still works and still cuts — use it
  only where the cut is the point (a punchline landing under a `CutFlash`).
  The two mouths that cannot be lerped (amazed's O, scared's squiggle) flatten
  through a straight line at the midpoint rather than swapping.
  `useEmotion()` in a scene file returns cues already; when a scene places an
  emotion by hand, it knows the frame — pass it.
- **The rig cannot detect the change itself.** It only ever sees the current
  frame's props, so whoever *decides* the emotion has to hand over the frame it
  changed on. That is the whole reason `EmotionCue` exists.
- **Travel on arcs.** `moveAlong(from, to, u, { arc, bias, ease })` for anything
  crossing the frame; it returns the point *and* the heading, so a flyer can
  bank into its own path. A straight lerp between two marks is the clearest
  tell that a scene was positioned rather than animated.
- **Eyes are never still.** Micro-saccades run on every character
  (`eyeLife`); a character with no staged `look` also glances away
  occasionally. A staged `look`/`lookAt` is always authoritative — eye life is
  a couple of pixels added on top, never an override. `eyeLife={0}` for a
  deliberate stare.
- **No hand-rolled curves.** `kidEase` is the show's set (`easeInOutSine` is
  the default for anything that starts and stops, `gravity` for falls,
  `easeOutBack` to arrive, `easeInBack` to leave, `anticipate01` for a
  counter-move). There are no linear ramps left in the rig and there should be
  none in a scene.
- **Subtle is the target.** If a still looks the same at a glance but the video
  feels more alive, that is the win. Judge these in motion — render a short
  every-frame clip or a few stills two frames apart. A secondary action you can
  *notice* in a still is too big.

## Comedy pacing

- **Give gags room to land.** The first real audience test (age six, ep 1)
  confirmed the two best-loved jokes were both deadpan-repetition gags — and
  both "moved past rather quickly". Repetition and deadpan need *time*, not
  emphasis. This is a general rule for the series, not a one-episode fix:
  - A list/roll-call line gets a per-line `speed` override in `narration.mjs`
    (slower than the character's default) so the items separate.
  - A visual punchline (card, reaction, reveal) gets a **held beat of
    silence** — on screen alone for ~1s *before* the next line starts, via
    `gapFrames` on the preceding turn. Never let the next line begin under
    the punchline.
  - Don't telegraph: an emotion change that anticipates the punchline (the
    default 8-frame `useEmotion` lead) can leak the joke into the silent
    hold. Cut the lead down for held-beat scenes.
  - **Deadpan is stillness.** Nothing new enters the beat *or the button* — no
    bubble, no gesture, no entrance, no emotion change. A hand still waving
    under a flat line is the character selling the joke, and the button itself
    stays unseasoned (`emotion: "auto"`); the laugh is in the silence in front
    of it, not in the read.
- **The roll-call gag is a kids'-series signature — give every episode one.**
  Ep 1's most-quoted joke was Drip greeting a queue of identical raindrops by
  name; the six-year-old's request for ep 2 was literally "more Hi Drop, Hi
  Droppy". The shape: a character cheerfully naming near-identical strangers →
  one flat explanatory line from the narrator → an unbothered button from the
  character. Two things make it worth its runtime:
  - Build it out of a picture the scene **already** has (ep 2's was staged on
    the dozens of identical warm puffs that were rising alongside Puff anyway),
    so it costs four eye-lines and a wave rather than a new set.
  - Pick the one whose joke is also the lesson — four other Puffs is "this
    happens to *all* the warm air", made as a picture two scenes before the
    narration makes it as a sentence.

## Speech bubbles

- **Six words, maximum** (`MAX_BUBBLE_WORDS`; the component warns above it).
  A six-year-old reads a bubble by shape. Longer than that and it is a caption
  floating in the sky — and the kids' series has no captions.
- ≥44px is the floor for *any* kid text (`kidType.min`); bubbles default to
  60px. This is deliberately above the financial series' 34px.
- **The tail points at the speaker.** It leaves the bubble's bottom edge, so
  the bubble goes *above* whoever is talking, on their side. A bubble below the
  speaker has its tail aimed at the ground.
- Bubbles pop with a spring and grow *out of the tail* (`transformOrigin`), so
  the line looks like it came from the mouth. They never fade in like captions.

## Big Word cards

- One `WordCard` per vocabulary word the episode is actually teaching, and at
  most one a minute. Two in quick succession stop meaning "learn this".
- Letters bounce in one at a time so the word is *spelled*, not revealed.
- The starburst stays behind the banner. It is decoration, and because the card
  owns a z-index, anything that overflows the banner draws on top of the
  characters' faces.

## Mouth sync

- **A character's mouth moves if and only if its own clip is playing.**
  Dialogue scenes declare `turns: [{clip, speaker}]` in `buildTimeline`;
  `useSpeaking(scene, speaker)` (or `isSpeaking`) is what the `speaking` prop
  is wired to. Never hand-time a mouth against a take.
- The mouth amplitude is three detuned sines with forced closures
  (`mouthAmplitude`), not a metronome, and the resting shape is the emotion's
  own mouth — so a character who stops talking stops on a smile, not on a gap.
- `DialogueAudio` mounts each turn at its offset; a scene is either one clip or
  one exchange, never both.
