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

## 2026-07-25 — swap-basics (build notes)

_Financial series #2, and the first video built entirely on the machinery
bond-basics v2 left behind — so also the consolidation pass. Watch-side retro
gets filled in after review of the deployed cut._

**Shape:** 10 scenes, 3:07 (5,602 frames), 175.3s of speech + 11.4s of tails.
Two more scenes and 14s longer than bond-basics v2, at the same
mechanism-level depth the v2 retro made binding.

**The promotions went well, and the reason is worth keeping**

- **`CashflowTimeline` → `src/lib/components/`** on its second video, as
  planned in the v1 note. The move needed three generalizations, each forced by
  a real requirement rather than invented for the API:
  - *Layout moved out of the component.* It used to wrap itself in
    `ContentArea`, which made "two of these on one screen" impossible. It now
    renders a plain sized block and the caller wraps it. bond-basics' two call
    sites each gained one `<ContentArea paddingX={80}>` line.
  - *`maxAmount`*, because two timelines that get compared have to share one
    dollar scale — otherwise the fixed leg's flat $40,000 bars would be drawn
    at full height on their own row and the comparison would be a lie.
  - *`scale: "linear"`*, because the compressive default exists to keep a $50
    coupon visible next to $1,050, and it would flatten the 30/45/50 spread the
    floating leg exists to show. Default stays compressive.
  - `subLine` and `showTicks` are explicit props with bond-compatible defaults.
    `subLine` deliberately does *not* derive itself from the flows: bond-basics
    cuts between two timelines where only the first has a `sub`, and deriving
    it would silently shrink the second one's geometry and make the cut jump.
    Generalizing a component is mostly a hunt for the places where "obvious"
    inference would break an existing caller.
- **A second promotion fell out for free:** bond-basics' yield dial became
  `src/lib/components/Dial.tsx` (label / value / angle / colour), because the
  pricing scene turns the same gauge to find the fair swap rate. The caller
  keeps the judgement calls — which direction is "good" is a scene decision,
  not a component one — and `dialAngle(value, center, range)` is the only maths
  that moved.
- **Verified the promotions were render-neutral, not just plausible.** Rendered
  bond-basics through the SSR harness twice — once with `HEAD`'s `Video.tsx`,
  once with the rewritten one — at 121 frame-states across all 11 scenes and
  diffed the markup: byte-identical. That took ten minutes and is the only
  reason "must still serve bond-basics unchanged" is a fact rather than a hope.
  Recommend this whenever code is promoted under an existing caller.

**Did `beats()` and the graph API hold up? (both were on trial)**

- **`beats()`: yes, unchanged, across 10 more scenes.** Every entrance in the
  video is a fraction of its own clip with a comment naming the clause. The one
  place it strains is `value`, where the narration describes the picture
  ("plot the swap's value against rates") in its *last* clause while the
  drawing has to start in the first — so the visual leads the words by ~10s and
  the fractions encode that deliberately. Fractions assume clause proportions
  survive rewording; that assumption held for all 10 lines this time because
  none were reworded after synthesis.
- **Graph API: yes, with two additions.** `ALREADY_DRAWN` did a new job here —
  not cross-cut continuity but "this chart is an echo, not an argument" (the
  `bondlink` mini-graphs mount fully drawn inside cards that spring in). Added
  `X_TITLE_BASELINE` to the barrel export so a scene can check the graph's
  lowest ink against `CAPTION_SAFE_BOTTOM` arithmetically instead of
  re-deriving 130. Two local children (`ZeroLine`, `RateLine`, both ~15 lines
  on `useGraph()`) covered everything else; nothing in the library needed to
  learn about swaps.
- **Two mirrored series is the easiest two-series case there is.** The v2 retro
  worried about the thin tritan margin on accent/good; here the pair is
  accent/warm and, more usefully, the two lines are *geometric* mirrors — even
  with no colour at all, "the one going up" and "the one going down" are
  distinguishable. Legend + per-marker chips still carry identity.

**Other build-side notes**

- **The registry-driven Root landed.** `src/Root.tsx` and `src/site/registry.ts`
  each imported every video with aliased `FPS as X_FPS` blocks; at three videos
  that was four blocks and two lists to keep in step. Both now read
  `src/videos/registry.ts`, and Root maps over it. Adding video #4 is one entry.
- **Arithmetic geometry checks caught nothing this time**, which is the first
  time that's happened — because the checks were written *while* laying each
  scene out rather than after. Three layouts changed shape as a result: the
  `legs` rows lost their per-row tick band on the fixed leg (the two rows now
  share one set of year labels, which is also what the narration says: "on one
  timeline"), the `hedge` survivor row rises half a pitch instead of a full one
  (a full pitch parked it on top of the faded pair), and the `value` legend
  moved into the empty wedge *below* the crossing after a numeric sweep showed
  the top-right corner is where the payer line lives.
- **Everything on screen is a pricing function.** 20 checkpoints in
  `pricing.ts`, including two that assert the two-leg difference equals the
  closed form `(r − FIXED)·N·A(n,r)` — the leg PVs and the plotted line are
  then provably the same arithmetic. The SSR harness additionally greps the
  rendered markup for 20 specific strings ($1,000,000 / $45,000 / −$10,000 /
  $111,004 / +$27k / …) so "the number came from the function" is checked, not
  claimed.
- **The flat-curve simplification is the honest cost of the video.** One rate
  is both the expected future reset and the discount rate, which makes the fair
  swap rate come out exactly equal to the market rate. It is documented at the
  top of `pricing.ts`, including the consequence that the 3% / 4.5% / 5% path
  in `legs`/`netting` is what the resets *turned out* to be, not the curve the
  swap was priced off.
- **First cross-video import in the suite:** swap-basics' `bondlink` scene
  imports `price3y` from `../bond-basics/pricing`, because the scene's whole
  claim is "same engine" and duplicating the function would make that claim
  false in the code. Flagged rather than hidden: if a third video wants bond
  pricing, that is the signal to promote it to `src/lib/` instead of growing
  video-to-video edges.

**Watch for on review**

- **`bondlink` deviates from the brief on purpose.** The plan said the short
  card's marker slides down and the long card's up. On one shared price/yield
  curve with one shared rate move, both markers would move the same way — so
  each card instead shows *its own winning scenario* (short: rates up, price
  down; owner: rates down, price up), which keeps the two markers moving in
  opposite directions and stays true. If it reads as "two different rate
  moves = confusing", the fix is to plot position value instead of price, at
  the cost of the literal echo of bond-basics' chart.
- **The `legs` → `netting` cut re-frames rather than continues.** Netting
  redraws the same money at a different bar scale with a centre axis. It may
  want the `ALREADY_DRAWN` treatment in spirit — identical geometry, then the
  merge — if the cut reads as a new picture.
- **`problem` has the tightest layout** (66px clear of the caption strip) and a
  two-line tick label under every bar. Check it at phone size first.
- **`hedge` spends ~7s after its last big move** (the net box lands at 62%).
  Same shape of risk the `duration` scene had in v2; if it reads as static, add
  a beat rather than slowing the cancellation.
- **`pricing` shows two identical $111,004 stacks** once the dial lands, which
  is exactly the point but might read as a rendering bug. The dial and the
  counting readout are what make it legible — watch that the eye follows them.
- Still **no headless Chrome**, so no frame has been *looked at*. The SSR
  harness now renders every scene at four frames and fails on
  NaN/Infinity/undefined in the markup, which catches broken arithmetic but
  says nothing about whether two boxes overlap. That gap is now three videos
  old.

**Still review (2026-07-25, headless Chrome working) — what looking caught**

Four defects, none of which the arithmetic checks could have caught, and the
reason is the same in every case: **geometry checks test end states; the
picture is wrong in between.**

- **`hedge` was broken mid-animation, not mis-laid-out.** The build note above
  records tuning the survivor's rise "half a pitch instead of a full one (a
  full pitch parked it on top of the faded pair)" — a check on the *final*
  arrangement, which was correct. What no one checked was the 24 frames while
  the two floating rows converged: they slid into the same slot at full
  opacity and rendered two 52px strings over each other as an illegible smear,
  then stayed there ghosted at 16%. Every static arrangement in that scene was
  fine. The transition between them was the bug. Fixed by making the
  cancellation strictly sequential — strike in place, fade to nothing, *then*
  collapse the space — so at most one legible row is ever in a slot, and by
  writing that invariant into the scene comment as a property of the whole
  animation rather than of its last frame.
- **Corollary for the checks themselves:** an arithmetic check should assert
  over the animation's parameter range, not its endpoints. "Do rows i and j
  overlap?" is a question with a `collide ∈ [0,1]` in it. Where that is
  awkward, the cheap substitute is what found these: render 5–6 stills across
  each animated beat and look.
- The other three were plain occlusions that only exist on screen: the
  `pricing` right-hand title wrapping to two lines and disappearing behind its
  own bar stack (the title box reserved one line's height), the `problem`
  "wanted: steady $40,000" label struck through by its own dashed line (the
  label's height was assumed, not derived from its leading), and — in the
  shared graph lib, so in both videos — readout chips sitting on top of the
  tick labels they were supposed to replace. Two of the three are the same
  mistake: **a text block's height was a guess, and the guess was one line.**
  Both now derive height from font size × leading × lines.
- **The graph fix went in the library, once.** `GraphChip` declares the box it
  occupies; `AxisTicks` (now mounted after the graph's children so it can read
  what they declared) fades any tick label that intersects a chip, with a 20px
  clearance band and a 26px feather so a sliding chip dissolves labels rather
  than popping them. No per-video code, and the "chip replaces that stretch of
  the scale" intent the margins were written around is finally true.

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

---

## Next: water-cycle (Drip's Big Adventure — kids ep 1)

_Build-side notes (2026-07-25); watch-side retro pending the six-year-old's
verdict, which is the only review that counts._

- **Scale forced a new build shape**: 36 scenes / 125 clips / 9:33 was too
  big for one agent. Worked: skeleton-first (all scenes timed with real
  audio + placeholder staging → episode watchable end-to-end from day one),
  then acts staged in parallel by separate agents against a shared staging
  kit (scenes/common.tsx). The per-act scene-map merge meant zero
  conflicts.
- **Visual self-review scaled too**: agents rendered/inspected ~170 stills
  during builds; orchestrator did an independent 8-frame sampled pass and
  found one real bug the builders missed (Big Word freeze badges occluded
  by syllable blocks — fixed by measuring that no clear orbit existed).
- **Mid-build API-error recovery**: one act agent died on a server 500;
  SendMessage resume continued it losslessly. A completed agent could NOT
  be resumed later — plan fixes as fresh agents.
- **Dialogue infra** (multi-clip scenes, per-turn speaker windows driving
  mouths) worked first try and belongs in the permanent kit.
- Watch-fors on review: colon-free script still has risky exclamation runs
  (audition clips flagged); moose stillness + 5.7s "standing on nothing"
  hold are timing bets only playback settles; scene 29's ocean is the
  thinnest visual.

### The crash the six-year-old found (2026-07-25)

The verdict arrived as a bug report: the deployed player died at scene 14,
mid-episode, and stayed dead. React error #300 — "Rendered fewer hooks than
expected" — at frame 6286, the exact frame Drip drops through the cloud shelf.

One line, in `MythPillowScene` (`scenes/act2.tsx`):

```tsx
look={frame > S14_CONTACT ? "down" : useLookAtSpeaker(scene, cast, "cloudia", "left")}
```

A hook inside a ternary whose condition is a **frame threshold**. Before
`S14_CONTACT` the component calls N hooks; on the frame after, N−1. React
tears down on the transition. Fix was to hoist the call above the JSX and
leave the branch as a value pick — staging identical, hook count constant.

What this taught us:

- **Our entire QA pipeline was structurally blind to it.** SSR smoke tests
  and ~170 stills all sample *discrete* frames, and every discrete frame was
  correct in isolation — the component only ever renders once per still, so
  its hook count is never compared against anything. Hook-count bugs exist
  only *between* frames. Nothing that samples can see them; only contiguous
  re-rendering of one mounted tree can. We had no such check, so the first
  contiguous playback of scene 14 anywhere was on the child's screen.
- **"Hooks in JSX props" is where this hides.** The staging kit encourages
  `emotion={useEmotion(...)}` / `speaking={useSpeaking(...)}` inline, which is
  fine while unconditional — but it puts hook calls in exactly the place
  where adding a `cond ? a : b` looks like a pure presentational tweak. An
  AST sweep of all of `src/videos/*/scenes/` and `src/lib/kid/` found this
  was the only instance; the pattern is nonetheless a standing trap.
- **A crash is a content bug when the audience is six.** She could not
  reload, could not read the URL, and did not know the video had not simply
  ended. A blank page is indistinguishable from "it's over" — so the failure
  cost the whole rest of the episode, not just one scene.

Actions taken:

- `docs/PROCESS.md` §5 now gates deploys on an **every-frame validation
  render** (`remotion render <id> --scale=0.25`, must exit 0). Run for the
  whole suite; all three large compositions pass.
- **The player no longer bricks.** `src/site/App.tsx` wraps the Player in an
  error boundary *and* passes Remotion's `errorFallback`, so any composition
  throw becomes a "Something hiccuped — tap to retry" card with a button
  that remounts the player. Containment matters independently of the fix:
  the next bug of any kind should cost a tap, not the episode.

---

## Next: wind (Puff and the Kite That Wouldn't Fly — kids ep 2)

_Build-side notes (2026-07-26); watch-side retro pending._

**What worked (process maturity, ep 1 → ep 2)**

- **Comedy pacing as a design input**: the script shipped with 22 held
  beats (exact frame counts + reasons) and 40 per-line speed overrides
  already specified — zero pacing retrofits needed. The rule from ep 1's
  audience test transferred cleanly. (24 and 42 after the roll call went in;
  the *format* absorbed the addition without argument, which is the point.)
- **The hook-order gate worked in anger, twice**: lint:hooks caught two
  React #300 patterns in act3 while it was being written (one flagged
  across agents mid-flight), and the every-frame render confirmed clean.
  The ep-1 crash class did not recur.
- **Puff's weighted-alpha design** (fill p^1.25, edge p^0.5, face p^0.45)
  solved hero-legibility-at-25%-opacity; the opacity ramp as character arc
  survived staging. Candidate STYLE.md rule: translucent characters keep
  face alpha ~2x fill alpha.
- **Orchestrator review still adds a layer**: after ~100 agent-reviewed
  stills, the sampled pass still found one real judgment fix (the Big
  Empty read as an ink blot at 0.46 fill; lightened to 0.24 — "slightly
  darker" means slightly).
- **A running gag can be planted with no dialogue at all**: the sleeping
  volcano (scenes 23–24, snoring smoke rings, one four-frame Puff glance and
  nothing else) cost ~130 lines of SVG, no narration and no timeline change,
  and it is now a series asset that a later episode can wake up. Two things
  made it work and are the reusable part: it seats on the *measured* horizon
  (drawn `HORIZON` in 23, the painted plate's y=606 in 24, sampled off a still
  rather than guessed) so it never floats or cuts the sea; and it was cut from
  scene 26 because `WaveTrim` covers the whole horizon band from the Big Word
  slam onward — a background gag that vanishes mid-shot reads as a bug, so the
  test for "does it go in this scene" is *continuously visible for the whole
  shot*, not *visible at all*.

**Ep-3 cleanup list (before next build)**: promote to src/lib/kid/ —
BigWordBeat/Camera/Thermometer/CaptionCard/WideLayer (now written twice),
puffSilhouettePath, Rock + CHAR_BOX cameo bodies, Cloudia's hat, emotionAt()
helper for in-silence cues; fix kidHand() flip bug (common+coldOpen
together); Bubbles tailAt option.

**Watch-fors on review**: Puff is now cast (MiniMax `Exuberant_Girl`, see
below) and the whole cast is off placeholders, but nobody has watched the
episode end to end with his voice in it; the recast character lines all want an
ear, particularly
Cloudia's `angry` demand and Sunny's `surprised` "Wait. What?"; spelled
"A. I. R." / "W. I. N. D." clips need an ear; scene 30 is prop-crowded;
scene 35 map has place-name text (cut for pre-readers?); the 75f kite payoff
and the rock's stillness are timing bets pending playback.

### The six-year-old's two notes (2026-07-27)

First watch-side feedback on ep 2, and both notes were about the same thing:
who is talking, and how much room the joke gets. Both are now general rules.

**1. "The beetle and the leaf sound like the narrator."** They did — the
Narrator cameo-voiced all three on-screen bit-parts (beetle, leaf, rock) under
a self-imposed "never grow past five actors" guardrail. That guardrail was
cheap for the wrong thing. The beetle/leaf gag is *somebody else* failing to
notice Puff; delivered in the storyteller's voice it collapses into the
storyteller asking a rhetorical question, and the episode's central repetition
gag — three firings, five minutes apart, with the whole ending banked on the
third — was being carried by a voice the audience had already filed as "the
narration". Recast to `Patient_Man` / `Calm_Woman` / `Deep_Voice_Man`, ~$0.03.
**The rule that replaced the guardrail: a body with a face and a line gets its
own voice.** Voice count is not a budget worth defending; a MiniMax bit-part is
three cents.

Three things fell out of it that will happen again:

- **Recasting is a text edit.** The rock's "Ohhh yeah" was a Kokoro spelling.
  Moving the line to MiniMax, where a repeated letter reads as separate
  syllables, meant respelling it — exactly as Puff's "Poooof"/"PUUUSH" had to
  be when *he* was cast. Sweep a character's sound words whenever it changes
  engine; the rule was already in STYLE.md and still nearly got missed, because
  "the rock" did not feel like "a character being recast".
- **Keys are wiring, not casting.** The three cameos kept their `_narrator` line
  keys. Renaming would have touched `Video.tsx`, every `SPEAKER_VISUAL` map and
  every bubble map for zero gain — the staged speaker is a per-line override
  (`useStage`), which is precisely the indirection ep 2 built for these bodies.
  Worth remembering the next time a key looks wrong: check whether anything
  actually *reads* it.
- **Determinism is a feature you only notice when you lose it.** Kokoro gave
  identical clips for identical text for free, so "identical text, identical
  speed" was a sufficient production note for a repetition gag. MiniMax
  returned the beetle's one sentence at 2.20s and then 2.84s — a 30% swing in
  the line whose entire job is to sound the same. The generator grew
  `{ sameAs: "<earlier key>" }`, which copies a clip under a second key: no
  synthesis, no API call, no dice roll. **Any repetition gag on a paid remote
  model should share one recording rather than order two.**

**2. "More Hi Drop, Hi Droppy."** The single most-quoted joke from ep 1 was
Drip greeting a queue of identical raindrops by name. Ep 2 now has the same
shape in Scene 15 — Puff greeting four of the dozens of identical warm puffs
rising with him ("Hi Puffy. Hi Puffington. Hi other Puff. Hi Puff the third."),
a flat Narrator explanation, and an unbothered button. **This is a series
signature now; every episode should have one.** The shape: a character
cheerfully naming near-identical strangers → one flat explanatory line → an
unseasoned button from the character.

Two things made it cheap to add, and both are reusable:

- **It cost no new staging idea.** The scene already had the picture — dozens
  of identical puffs holding station around him. The gag needed four of them
  addressed individually (a wave, an eye-line, a bob back), not a new set. Look
  for the joke the shot can already tell.
- **It does pedagogy for free.** Four other Puffs is `a2_22_narrator`'s point —
  *this is happening to all the warm air, not to one special puff* — made as a
  picture two scenes before it is made as a sentence. The best gags in this
  series are the ones that are also the lesson.

Cost: 12.6s of runtime (ep 2 is 11:40 now, over the 10–11 min target — the
roll call is worth it, but that is a real trade). The rising shot needed a new
high-cloud parallax band to have anything left to climb past; **a shot that
gets longer needs its world checked, not just its timing** — the parallax
layers had all scrolled off the bottom by the old scene's end.

### Tier-2 graphics: painted backgrounds, piloted on this episode (2026-07-26)

Art direction picked by Mike from three candidates: **soft gouache**
(`tmp/style_gouache.webp`). Nine plates now sit under episode two's SVG cast,
generated by `scripts/generate-backgrounds.mjs` (Replicate / flux-schnell) and
committed like the narration audio.

**The pipeline is the TTS generator, again.** Per-video declaration file
(`backgrounds.mjs`), content-hash cache, generated TypeScript manifest, output
in `public/`, `--video` / `--only` / `--force` / `--dry-run`. Copying that
shape cost nothing and meant the retrofit could iterate on one prompt at a time
without re-spending on the other eight. Two things had to be added that the TTS
generator never needed:

- **Retries, because the API fails in the middle.** The first run lost six
  already-paid-for images when the seventh threw "Director: unexpected error
  handling prediction" and the exception took the unwritten cache with it. Now:
  three attempts per image, and a failed key leaves the other eight alone and
  fails the *run* at the end. Replicate also returned a bare 404 ("no adapter
  found for model") twice for a model that plainly exists — transient, retried
  clean. Any paid generator in this repo should assume this.
- **Pacing.** 6 requests/min on this account; one request every 12s never trips
  it.

**Prompting notes worth keeping** (17 images for nine keys, ~$0.05 all in:
one full pass, one full re-roll when the anchor changed, then one extra roll
each for `hill_day` and `headland_turbines`):

- Naming a thing to exclude summons it: "no wind turbines" returned a ridge
  with two turbines painted on it. The fix is to describe the empty version.
- The style anchor is where the palette lives. Attempt one ("warm morning
  light, gentle saturated colours") hazed five of nine plates to cream —
  no blue sky anywhere, which is the one thing the approved reference is built
  on. Naming the sky cyan and the greens yellow-green fixed all nine at once.
- At ~$0.003 an image the money is not the constraint; the 12s pacing and the
  API's flakiness are. Budget minutes, not dollars.

**The retrofit's actual lesson: geometry beats painting.** Three of the wind
episode's worlds had SVG ground that a plate could simply replace (the bay, the
headland, the dandelion hillside) — those scenes deleted their drawn ground and
look like a different, better show. But the *hill* could not: `hillY()` is a
parabola the kid stands on, the kite lands on and Scene 31 reuses, and no pan
or dy makes a painted crest agree with it (measured: 157px of residual after
the best-fit shift). So `hill_day` was re-prompted down to sky-plus-far-hills
and the near hill stayed drawn. Generalised into STYLE.md as "where a painted
shape and a character's ground line disagree, the ground line wins".

Same shape of decision on the beach: scenes 23–26 keep their whole SVG beach,
because the diagonal shoreline *is* the sea-breeze diagram, so those four
scenes only gain a painted sky above y=400. They are the weakest results in the
set and the honest place to say so.

**Two things the paint exposed that the gradient hid**: flat characters float
without a contact shadow, and `kidTheme.grass` is a blue-green that reads as a
different show's grass next to a plate. Both now have rules and a shared
`PAINTED_GREEN` sampled off the images.

**Ep 1 (water-cycle) is not retrofitted.** What it would take: ~10–12 plates
(day meadow, ocean surface, cloud-level sky, underwater, night sky, a puddle
close-up), the same `PaintedSky` wrapper in its own `scenes/common.tsx`, and —
the real work — `SkyBlendCrossfade` and `MorphBackdrop` there animate *between*
sky variants (day→sunset→night, above/below water), which a single still plate
cannot do. Either generate a plate per state and crossfade two
`KidPaintedBackdrop`s, or keep `KidBackdrop` for the transition scenes and
paint only the stable ones. Its ocean scene (flagged as the thinnest visual in
the ep-1 retro) is the single best argument for doing it.

### A second TTS engine: MiniMax for the characters (2026-07-26)

The Narrator stays on Kokoro. Sunny, Cloudia and Drip moved to **MiniMax
speech-2.8-hd via Replicate** (`engine: "minimax"`, 14 lines, 617 characters,
$0.07), cast by ear from auditions: Sunny → `Imposing_Manner`, Cloudia →
`Abbess`, Drip → `Lively_Girl`. Puff followed later the same day — MiniMax
`Exuberant_Girl` at 1.0, sixty lines, 1955 characters, $0.22 — and the
one-line `PUFF_ENGINE` toggle the recast was built behind did exactly what it
promised: one word changed, sixty clips moved. **Two things the toggle could
not carry, and both are now STYLE.md rules.** First, spelling is per engine: a
stretched vowel is a *kokoro instruction* (one long sound) and a MiniMax
mispronounce (separated syllables), so his two sound words were respelled on
the way over — "Poooof!" → "Poof!", "PUUUSH!" → "PUSH!" — and the length that
was in the letters is now in `emotion: "angry"`, which this engine plays as
effort rather than temper. The drawn speech bubbles keep the stretch on
purpose; the eye and the ear want different spellings. Second, the emotion map
had to be *written*, not inherited: sixty lines, twenty-six seasoned and
thirty-four `auto`, each non-`auto` one citing its stage direction — and the
restraint rule earned its keep on the apologies, where the three that are
comedy or reflex stay `auto` and only the six Act One ones are `sad`. His
narration got 11 s longer (567 s → 578 s) and nothing needed re-timing.

**The split is the point, not a migration.** Kokoro re-synthesizes a reworded
line instantly and free, which is exactly what a narrator whose text is the
source of truth needs. What it cannot do is *act*. MiniMax takes an `emotion`
and honours inline `<#0.4#>` pause markers, so it earns its ~$0.11/1000
characters only on lines where a character is playing a beat. Two rules came
straight out of doing it, and are now in STYLE.md:

- **Emotion is seasoning.** Every non-`auto` emotion cites the stage
  direction that justified it, in a comment on the line. Sunny is nine-tenths
  `happy` because bragging is his whole character; the two exceptions are the
  two moments he stops (his "EXCUSE ME" interruption stayed `auto` — nothing
  marked it as anger, and nobody in this show is unkind).
- **Pause markers only where the script already asked for intra-line timing.**
  Exactly one line qualified: `a2_41_sunny`, whose script note says the three
  causal links must "land separately". Every other silence in this episode is
  a held beat *between* lines and belongs to `gaps` in `Video.tsx`, where the
  timeline can see it. The generator now errors if a marker reaches a kokoro
  line, where the model would read the punctuation out loud.

**Build notes for the next engine, whenever it happens:**

- **The paid-generator shape transferred whole** from `generate-backgrounds.mjs`
  — `.env` token, `Prefer: wait` plus a real poll, 12 s pacing, 429 backoff,
  three retries per item, a failed item leaving its previous clip on disk and
  failing the *run* at the end. Nothing new had to be learned about Replicate.
- **The cache hash is per engine.** Kokoro's hash is byte-for-byte the old one
  (a full run of water-cycle reported "0 clip(s) synthesized"), and the minimax
  hash deliberately leaves out the local encoder mode — a machine that gains
  ffmpeg must not re-buy 75 lines.
- **Durations had to be measured, not estimated.** There is no ffmpeg on this
  box and `music-metadata` is not a dependency, so the generator walks the
  mp3's MPEG frame headers and sums each frame's own samples/rate (skipping the
  Xing header frame). Checked against Remotion's bundled ffprobe: 6.156 s vs
  6.16 s on a MiniMax clip, 6.336 s vs 6.34 s on a Kokoro one. Anything looser
  would drift every scene after it, because `buildTimeline` stretches scenes to
  these numbers.
- **MiniMax reads slower than Kokoro at the same nominal speed.** The same 14
  lines went from 33.7 s to 46.8 s (+39%), and the episode from 9:14 to 9:27 of
  narration. Nothing needed re-timing — audio-driven pacing absorbed all of it,
  which is the clearest payoff yet from never hand-timing a scene.
