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

## Voice

- Default: `af_heart` at speed `1.0`.
- When a scene wants a different tone, audition rather than guess:
  `npm run narration -- --audition <slug>:<lineKey> <dir>`, then pick by ear.
  Model-card grades are not a ranking of what sounds right.
- Per-line overrides (`{ text, voice, speed }`) are the mechanism for a
  one-off tonal shift; don't fork a whole video's voice for one aside.
- **Spell out initialisms** so the voice reads letters, not a word: "U R",
  not "UR". Same for anything the model mangles — respell phonetically
  ("kay-o-koh"). Listen to every clip before building visuals; fixes are
  cheap before scenes exist and expensive after.
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
