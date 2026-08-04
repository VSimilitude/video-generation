# Ep-3 TWEAK ROUND worklist (post-wave-3 re-screening, 2026-08-04)

Showrunner design doc for the tweak round. Baseline = commit 2523cac
(31,372f = 17:25.7, deployed). Mike's notes are DIRECTION, FINAL — items
here are designed, not up for re-litigation. One builder at a time;
orchestrator runs the quota gate before each spawn. More notes are
expected; new T-items get appended here as they arrive.

Cost profile of T1: $0.00 synthesis (every changed line is kokoro; the
paid MiniMax clips — `a1_13_ray` + its 4 aliases and `a1_16c_ray` "Are
we" — are untouched and must stay byte-identical cache hits).

---

## T1 — Scene 5 "Are we there yet" restructure (Mike note 1)

**Mike, verbatim (2026-08-04):** "Start with the are we there yet scene. I
think a slightly increasing delay between each are we there yet would be
good. And let's redo the narrator lines a bit, I think we have 1min,
2,4,7, nothing, interruption. Let's switch to 1,2,3,4,5, interruption.
For the interruption, let's switch narrator to "No, Ray, not yet", then
an extra long wait with Ray looking a little like he's going to ask again
but doesn't say anything and then arrives"

**Reconciliation vs as-built:** his recollection is exact. As-built =
four answered firings (1/2/4/7 minutes) at gaps 45/75/105/135, fifth
firing unanswered into a 90f dead hold, truncated sixth "Are we—" cut off
at 0f by "No." (0.8), 90f hold, 6f tail, hard cut to arrival.

**New structure (design, binding):** five answered firings counting
straight up — every answer still sums to eight ("One minute down. Seven
to go." … "Five minutes down. Three to go."), so the pedagogy stays
honest — then the longest silence yet, then the truncated sixth firing
interrupted by "No, Ray, not yet.", then the longest hold in the episode
containing a silent almost-ask, then the same hard cut to arrival. The
unanswered-fifth beat is REMOVED (that job moves to the almost-ask). The
"arithmetic skips two-to-four" gag is deliberately gone — Mike's call.

### T1a — narration.mjs (all kokoro, $0; NO minimax resynthesis)

| key | change |
|---|---|
| `a1_14_narrator` | KEEP "One minute down. Seven to go." |
| `a1_15b_narrator` | KEEP "Two minutes down. Six to go." |
| `a1_15d_narrator` | text → "Three minutes down. Five to go." |
| `a1_16_narrator` | text → "Four minutes down. Four to go." |
| `a1_16b2_narrator` | NEW: "Five minutes down. Three to go.", NARRATOR, speed 0.92 (same fields as the other four answers) |
| `a1_16d_narrator` | text → "No, Ray, not yet." — keep speed 0.8 (the deadpan floor). Tone unchanged: bored, not cross, drawn out. If 0.8 audibly distorts on the longer sentence, 0.85 and let the hold do the dragging (same fallback rule as before). |
| all Ray keys | UNTOUCHED — `a1_13_ray` + 4 `sameAs` aliases + `a1_16c_ray` "Are we" (paid MiniMax; must be cache hits, 0 to synthesize) |

Update the surrounding comments: the five-firings-one-recording block
stays true; the "arithmetic skips" comment is replaced (straight count is
now the point — the Narrator is a metronome, and the interruption is the
first and only time she deviates); a1_16b's "goes unanswered" comment
goes away.

### T1b — Video.tsx s05_journey timeline

Clip list: insert `a1_16b2_narrator` between `a1_16b_ray` and
`a1_16c_ray`.

Gaps (the escalation, +30f per step, now five steps — "slightly
increasing delay between each are we there yet"):

| after | gapFrames | was |
|---|---|---|
| `a1_14_narrator` | 45 | 45 |
| `a1_15b_narrator` | 75 | 75 |
| `a1_15d_narrator` | 105 | 105 |
| `a1_16_narrator` | 135 | 135 |
| `a1_16b_ray` | default tail (remove the 90 override — the fifth firing is now answered at the same rhythm as the other four) | 90 |
| `a1_16b2_narrator` | 165 (the new longest pre-firing silence, right where the pattern peaks) | — |
| `a1_16c_ray` | 0 (the interruption, unchanged) | 0 |
| `a1_16d_narrator` | 210 ("an extra long wait" — the longest hold in the episode; the almost-ask lives inside it, see T1c) | 90 |

Scene tail 6f and the hard cut into Scene 6 are UNCHANGED — the cut is
still the button, it now buttons "No, Ray, not yet." + the almost-ask.
Update the Video.tsx header comments that cite 45/75/105/135 and the 90f
holds.

Expected duration delta ≈ +9s (holds 540f → 735f, one new ~2s clip,
longer "No" line). New total ≈ 17:35. Fine per the runtime rule.

### T1c — act1.tsx JourneyScene: the silent almost-ask

Inside the 210f hold after `a1_16d_narrator` (frames below relative to
the start of that hold): Ray winds up to ask again and doesn't. The tell
is the bubble, because at 0.62 scale the bubble IS his voice:

- ~f60: an EMPTY speech bubble begins to inflate from the same anchor
  geometry as `S5_BUBBLE_AT` (same tail direction, scaled about its
  tail-root so it visibly grows *from him*), reaching ~35% of the normal
  firing bubble over ~18f. NO text, ever — he doesn't say anything.
- hang ~50f at ~35%.
- deflate back into him over ~15f, gone by ~f145.
- ~f145–210: pure unchanged travel. The no-telegraph law holds: the
  wind-up bubble is the ONLY new thing in the scene and it must be fully
  gone well before the cut so the cut stays unannounced.

Face/rig: NOTHING changes — no emotion, no look, no speaking mouth (a
moving mouth with no audio breaks the rig grammar; the bubble alone
carries "he's about to ask"). The scene's deliberately-not-driven prop
list (brightness, emotion, look, streak, scale) still applies.

Implementation: `Bubbles` is clip-keyed and the almost-ask has no clip,
so this is a frame-window-driven bubble drawn with the same art (stroke,
fill, tail) as the real ones — builder picks the cleanest mechanism, but
a wind-up that doesn't match the bubble art exactly will read as an
error, so reuse the primitive rather than redrawing it. Builder MUST
still this beat (inflate mid-point, full hang, mid-deflate, and a frame
after it's gone) and self-review before gates.

Also update the big JourneyScene doc comment (five answers now, no
unanswered firing; the "No. never gets a bubble" note becomes the
"No, Ray, not yet." note — the Narrator still never gets a bubble).

### T1d — script.md fold

Scene 5 section: REVISED 2026-08-04 banner with Mike's note verbatim,
new lines list (incl. `a1_16b2_narrator`), new held-beat table
(45/75/105/135/165 + 210), the almost-ask beat prose, and replace the
"escalation, and why" explainer's skipped-arithmetic paragraph (straight
count, answers sum to eight, the interruption is the Narrator's only
deviation). Ear-check list: ADD `a1_16d_narrator` "No, Ray, not yet." at
0.8 (kokoro, free re-take; listen for drag/distortion) — the existing
`a1_16c_ray` truncation item stays. Update frame totals after gates.

### T1 gates (this batch)

- `npm run narration -- --video sky-blue`: expect exactly the changed
  kokoro lines to synthesize, ZERO minimax lines (no REPLICATE token
  needed; if the run wants one, STOP — a paid clip got touched).
- typecheck 0, lint:hooks 0 findings.
- Scene-range every-frame render covering s04 tail → s06 open, exit 0.
- Stills: the almost-ask sequence + one still per answered firing's
  bubble (sameness check) + the 165f silence.
- The FULL every-frame --scale=0.25 render runs ONCE at tweak-round
  close (before deploy), not per batch — more notes are incoming.

---

## Round status

- T1 designed (this file), awaiting quota green-light to spawn builder.
- Further Mike notes: pending — append as T2, T3, … above this section.
