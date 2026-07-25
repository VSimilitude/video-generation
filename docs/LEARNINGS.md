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

## Next: bond-basics

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
