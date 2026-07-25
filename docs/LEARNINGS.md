# Learnings

One dated entry per finished video — written at step 6 of `docs/PROCESS.md`,
before starting the next one. Format: what worked, what didn't, what to do
differently next time. Keep it specific; "pacing felt off" is useless six
months later, "scene 3 needed 40 more frames because the diagram and the
caption arrived together" is not.

Conclusions that should bind future videos get promoted into
`docs/STYLE.md`; this file stays the raw log, including the things we tried
and abandoned. Newest entries at the top.

---

## 2026-07 — inherited from hero_swap

Not a video in this repo, but the source of the conventions the suite was
scaffolded with. Recorded here so the reasoning survives.

**What worked**

- **Build-time TTS beats runtime TTS, decisively.** Synthesizing narration
  in a script (`npm run narration`) instead of in the browser made output
  deterministic, made preview fast (no model load in studio), and — the big
  one — produced *exact clip durations*. Those durations are what make
  audio-driven scene timing possible at all; without them you're back to
  eyeballing frame counts.
- **Per-line caching.** Hash text+voice+speed; only changed lines
  re-synthesize, so the model is never loaded on a no-op run. Editing a
  script stayed a sub-second operation.
- **Auditioning by ear beats reading model cards.** `am_santa` won the
  cane-mode voice on the strength of a jolly, theatrical delivery, despite
  a lower grade on the model card than candidates it beat. Grades measure
  something, but not fit.
- **Generic, name-free narration lines maximize reuse.** Lines written
  without naming a specific hero/item could be recombined across variants
  and re-cut freely. Every proper noun in a line is a clip you can only use
  once.

**What didn't**

- **Initialisms.** "UR" was read as a word. Respelling to "U R" fixed it.
  Assume any all-caps token is wrong until heard.
- **Initial scene budgets were far too short.** Scenes ended up roughly
  1.6× the durations first estimated before they were legible — reading a
  caption, parsing a diagram, and hearing the line all have to fit, and the
  estimate only ever accounted for the line.

**Do differently**

- Estimate scene lengths, then assume they'll grow ~1.6×; plan the script
  length accordingly rather than discovering it at render time.
- Listen to every clip before any visual work (now step 3 of PROCESS.md).

---

## Next: pipeline-demo

_In progress — filled in as the deployed cut gets watched. Still to answer:
did the three-step diagram land on the narration beats, or did steps arrive
early/late? Were the `minFrames` floors ever the binding constraint (a sign
the script is too terse)? Did the 15-frame default tail feel like enough
between scenes?_

**What didn't**

- **The caption panel collided with the diagram content.** Watching the
  deployed cut, the bottom caption ran into the pipeline "bubbles". Two
  separate causes, both structural rather than per-scene:
  - *Root cause 1 — no shared safe area.* Every scene hand-picked
    `paddingBottom: 120` as its guess at how much room the caption needs.
    That number was never derived from `Caption.tsx` and nothing kept the two
    in sync, so it was wrong the moment the panel wrapped to two lines
    (64px offset + 166px panel = 230px occupied, against 120px reserved).
    Fixed with `CAPTION_SAFE_BOTTOM` (280px, derived in `src/lib/theme.ts`
    from a single `captionMetrics` object that `Caption` also renders from)
    and a `ContentArea` wrapper that captioned scenes use instead of their
    own padding. 1080 − 280 = 800px of usable height; the tallest stack
    (TimingDiagram, ~348px) now clears the caption by ~226px.
  - *Root cause 2 — the site leaked CSS into the video.* The player's
    letterbox `<div>` in `src/site/App.tsx` set `lineHeight: 0` to kill the
    inline baseline gap. `@remotion/player` does not reset inherited
    typography, so that cascaded into the composition: on the deployed site
    every text node without an explicit line-height collapsed to a
    zero-height line box and its glyphs spilled out of the panel they were
    supposed to sit in. Invisible in Studio and in `remotion render`, which
    both use the UA default. Fixed at both ends — `Backdrop` now pins
    `lineHeight: "normal"`, and the letterbox uses `display: flex`.

**Do differently**

- **Layout is not reviewable by reading the code.** Both of these were
  visible in one still frame and invisible in a diff, and cause 2 only
  reproduced in the deployed environment. Once headless-Chrome libs are
  installed, render a still per scene (and one through the actual site
  bundle, not just Studio) and look at them before calling a cut done — the
  same self-review step that catches a typo should catch a collision.
- Derive spacing constants from the component that owns the geometry.
  A magic number copied into four scenes is four bugs waiting for the
  component to change.

---

## 2026-07-25 — bond-basics v2 (rework)

Reviewer feedback on the v1 cut, verbatim: **"more depth, it can be longer"**
and **"animation should be meaningful and engaging — graphs drawn dynamically
(eg to show the price vs yield relationship, making it more intuitive)"**.

**What changed structurally**

- **7 scenes → 11**, and the one-line assertion "price and yield move in
  opposite directions" became four scenes that argue it: `discounting`
  (present value, built), `yield` (the rate that balances the equation),
  `curve` (the relationship drawn), `ratemove` + `duration` (the relationship
  used). Runtime 1:53 → 2:53.
- **A real pricing function** (`src/videos/bond-basics/pricing.ts`) now feeds
  every curve, marker and percentage on screen, with the narration's quoted
  numbers as checkpoints beside it. No point on any graph is hand-placed, and
  the readouts animate by re-formatting an interpolated *value*, never by
  cross-fading two strings.
- **New shared graph layer** — `src/lib/components/graph/` (`AnimatedGraph`,
  `GraphCurve`, `GraphMarker`, `GraphChip`, `GraphLegend`). Promoted to
  `src/lib/` on first use rather than after the second, deliberately: the
  financial series is a queue of videos that all want a drawn chart, and the
  API is video-agnostic (domains, ticks, units, draw-on windows — no bond
  vocabulary).
- **`beats()` promoted to `src/lib/narration.ts`.** It survived the rework
  intact across 11 scenes, which was the bar set in the v1 note.
- **The discounting scene is the "mechanism" bet.** Each payment detaches from
  its year, slides back to today shrinking by exactly its discount factor
  (label counting $50 → $47.62), and slots into a column whose height is the
  literal sum of the pieces. Heights are strictly linear in dollars —
  `CashflowTimeline`'s compressive scale would have made the parts *not* add
  up, which is the one thing this scene exists to show. The honest consequence
  is that the redemption is ~91% of the column and the two coupon slivers are
  ~19px each, so their numbers live in a receipt on the right instead of on
  the pieces.

**What worked (build side)**

- **`ALREADY_DRAWN`.** Scenes 8–10 are three `Series.Sequence`s mounting the
  same graph; 9 and 10 mount it already-drawn so the cut lands on an unchanged
  picture and only the marker moves. Without it every cut re-draws the axes and
  the continuity — which is the whole argument — evaporates.
- **`pathLength={1}` for draw-on.** Normalizes stroke-dash units to the path's
  own length, so no DOM measurement and every frame is deterministic. Gotcha
  found while wiring the 10-year curve: a section clipped away outside the y
  domain still owns its share of the path length, so the visible curve appears
  to start late. Fixed with a `range` prop that limits what gets plotted.
- **Both bonds are at par at 5%**, so the two markers in `duration` start on
  the same point and separate as the yield rises. That coincidence does more
  explanatory work than the −2.7% / −7.4% chips do.
- **Arithmetic geometry checks caught the two collisions again**, both in the
  graph's bottom margin: the x-axis readout chip reaches plot + 82px and the
  axis title's glyph tops were at plot + 89 (7px clear) — the gap is now 52px
  of margin, giving 16px. Same class of bug as v1's year-tick labels; the fix
  is the same discipline (derive the margin from the type scale, in one place).

**What to watch on review**

- **Runtime came in at 2:53 against a 3:30–4:00 target.** The approved script
  is 162s of speech; the remaining 11s is tails. Closing the gap needs more
  *script*, not longer holds — flagged rather than padded, because ~40s of
  added silence would undo the depth the rework was for.
- The `duration` scene has ~4.5s of narration after its last big move (the par
  line + drop bars land at 76%). If it reads as static, the fix is another
  beat, not a faster marker.
- **The 9→10 cut resets the marker** from 4% (where `ratemove` leaves it) back
  to 5%, and repaints it from the warm "readout" colour to the accent series
  colour, because scene 10 has two series and they have to be told apart by
  hue. Two deliberate discontinuities on a cut whose whole point is continuity
  — watch whether the "One more idea" line covers them.
- The dataviz validator rates our accent/good pair fine for normal vision and
  protan/deutan (ΔE ≈ 20) but thin under tritan (6.1), so the two-curve scene
  leans on the legend and per-marker chips for identity. The palette also
  fails the skill's lightness band, which targets a *chart surface*; our marks
  sit on a near-black backdrop with outlines and pass the contrast check.
  Worth revisiting if a video ever needs three series at once.
- Still no headless Chrome, so nothing here has been looked at as a rendered
  frame — the same gap flagged in the pipeline-demo retro, and it now covers
  five new scenes' worth of layout.

---

## Next: bond-basics (v1 build notes)

_Build-side notes recorded at ship time (2026-07-24); the watch-side retro
gets filled in after review of the deployed cut._

**Build-side, what worked**

- **Fraction-based beats.** Element entrances are resolved as fractions of
  the scene's own clip length (`beats(clip, fractions)` in `Video.tsx`),
  not literal frame numbers — reword a line, re-run narration, and the
  stagger moves with the voice. Candidate for promotion to
  `src/lib/narration.ts` if it survives the swap video. Caveats: assumes
  clause proportions are stable under rewording, and each fraction needs a
  comment naming its target clause.
- **Derived geometry caught a real bug again** (year-tick labels 3.6px into
  the price bar). Generalization: any component stacking absolute bands
  should sum its bands into its own declared height (`TIMELINE_H`) so the
  arithmetic is checkable in one place.
- `CashflowTimeline` is deliberately vocabulary-free (`t`/`amount`/`label`)
  and used twice on identical geometry — promote to `src/lib/` when the
  swap video needs it. Bar heights use a compressive scale
  (`(|a|/max)^0.45`) so a $50 coupon stays visible next to a $1,050
  redemption.

**Watch for on review**

- Springs that drive layout are clamped (`min(1, spring)`) so bars can't
  overshoot the reserved region — costs bounce on the key diagram. Decide:
  should the safe area carry an ~8% overshoot allowance?
- The `example` scene has a ~3.5s stretch between the −$1,000 arrow and the
  first coupon (the clause naming coupon/maturity). If it reads as dead
  air, add a beat for the year ticks, not earlier coupons.
- Colons in narration lines ("The face value: …") render as pauses in
  Kokoro — check they read as lead-ins, not hard stops.

### bond-basics — watch-side retro (2026-07-25)

v1 verdict from review: too shallow, animation decorative ("I'd like more
depth, it can be longer... animation to be meaningful and engaging...
graphs that are drawn dynamically"). v2 (mechanism depth + drawn graphs)
verdict: "definitely better." Conclusions now binding (in STYLE.md):
mechanism-level depth over definition-level; drawn graphs with moving
markers for quantitative relationships; motion carries the explanation.
Length: 2:53 accepted without complaint; depth-per-second matters more
than hitting a duration target.
