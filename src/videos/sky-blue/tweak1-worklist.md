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

## T2 — s10 Ahem verdict + s09/s10/s11 continuity jumps + bubble sweep (Mike note 2)

**Mike, verbatim (2026-08-04):** "for the first ensemble scene, the
narrator "Ahem" and Ray's look doesn't really fit Orange "He meant to"
line - let's let it sit with no reaction, unless we can easily switch
Ray's reaction to more of an eyebrow raise type reaction (currently it's
more a happy face) - also, this scene jumps around a few times, it looks
good until 3:49, then they all jump a bit when white Ray returns, which
feels awkward, then it jumps again at 4:28 after "I have never met me
before" when Ray jumps to the back with Drip, which again feels
cheap/awkward. Also the word bubbles are all in the wrong place after
the rainbow word learn"

**Timestamp map (deployed cut):** 3:49 = the s09_split→s10_rollcall cut
(f6903 = 3:50.1); 4:28 = the s10_rollcall→s11_bigword_rainbow cut
(f8014 = 4:27.1); "after the rainbow word learn" = s11 post-slam + s12
(+ s13 verify). Measured root causes are in the fact report distilled
below — all numbers verified against the timeline math.

### T2a — cut "Ahem.", Ray's reaction becomes an eyebrow raise

The "Ahem." cut-if-it-fails verdict has arrived: it failed. CUT
`a1_42h_narrator` (remove from narration.mjs AND from s10_rollcall's
clip list in Video.tsx). Never substitute "Hmm." (standing ruling,
script.md ear item 31 wording).

Ray's reaction: Mike's conditional — eyebrow raise if easy — is
satisfied: the rig already draws brows and has two wired-but-unused
affordances (`browAsym`, one-brow tilt, Character.tsx:405; `lidBase`
half-lids). So:

- NEW shared emotion **`skeptical`** in `src/lib/kid/rig.ts` EMOTIONS
  table (kit addition, series-wide deadpan vocabulary; no other scene
  uses the name, zero regression surface). Starting values, builder
  tunes on stills: `browAsym` ±10–14 (ONE brow up — pick the sign that
  raises the camera-left brow), `browRaise` 2, `lidBase` 0.12,
  `eyeScaleY` 0.94, `mouthCurve` 2 (near-flat — deliberately the first
  non-smiling non-frown mouth in the table), `mouthWidth` 48, no blush.
  Target read at hero scale: "one eyebrow up, unimpressed", NOT grumpy,
  NOT smug-villain.
- In RollCallScene: the `emotionAt` map's `neutral` window becomes
  `skeptical` (same camFrom = a1_42e start). Camera look UNCHANGED
  (take-to-camera is the right grammar; the failure was the smiling
  face + throat-clear, not the look).
- Re-key the window end: `camTo` was read off a1_42h (now gone) — both
  the eye-line break-back and the emotion restore re-key to
  `lineWindow(scene, "a1_43_narrator")` start. Ray holds the skeptical
  camera look through the post-"He meant to." silence and breaks back
  as a1_43 opens.
- "Let it sit": give `a1_42g_orange` `gapFrames: 40` in Video.tsx (was
  default 8) — a held deadpan beat where NOTHING happens (comedy-pacing
  rule). Net timing vs deployed: −48f (Ahem) −8f (its gap) +32f (gap
  8→40) = **−24f**.
- FALLBACK LADDER (showrunner still review picks): B1 skeptical across
  the whole exchange window → B2 skeptical only from `a1_42g_orange`
  onward → A = Mike's stated default, no reaction at all (delete the
  camera-look + emotion windows entirely; Ray keeps his volley
  eye-lines and stays happy). Builder stills B1 at minimum; if it reads
  wrong at review we step down the ladder, no re-ask of Mike.
- script.md: fold the cut + new reaction into the Scene 10 section;
  mark ear item 31 RESOLVED (cut executed).

### T2b — the 3:49 jump (s09→s10 cut, f6903)

Measured discontinuities at the cut (only these — Red, Orange, Yellow,
Green, Violet are pixel-identical across it):

- Blue: (1157.0, 429.1, lean −90°) → (1233.5, 701.3, −25.4°). ~283px +
  65° snap. Cause: s09 uses DRIFT_BOX seed 4, s10 uses S10_BLUE_BOX
  seed 9 — same `blueRicochet()`, no phase/position handoff.
- Indigo: (1320.9, 686.0, −90°) → (1333.5, 818.8, 0°). ~133px + 90°.
- Ray: opacity 0 (since s09 local f180!) → full pop-in at
  arcPointLifted(0.18) = (409.6, 610.6) scale 0.78 on the cut frame.

Fixes:

1. **Handoff constants + settle-in**: bake `S9_END_BLUE = {x: 1157.03,
   y: 429.06, heading: -90}` and `S9_END_INDIGO = {x: 1320.92,
   y: 685.97, heading: -90}` (deterministic s09 final-frame values; add
   a comment that they are derived from s09's last local frame 1060 and
   must be re-derived if s09's clip list ever changes). In
   RollCallScene, for the first ~30f (Indigo +INDIGO_LAG), render
   Blue/Indigo at these poses eased (kidEase) into their live s10
   positions/headings. Reads as Blue settling grudgingly back toward
   the line — in character.
2. **Ray enters instead of popping**: over s10 local f0–14, Ray eases
   in — opacity ramp 0→1 with a small drift down from (409.6, 590) to
   his track start (409.6, 610.6). No streak, no flash; the first clip
   is a narrator line (`a1_41_narrator`, opens at local 0) so the
   entrance sits under narration, not under a Ray line.
3. GATE for this item: render the exact boundary stills f6902 vs f6903
   (and f6903+30) and eyeball-diff — residual jump must be
   imperceptible (only Ray's 0→0.05 opacity onset may differ at the
   cut frame).

### T2c — the 4:28 jump (s10→s11 cut, f8014)

Measured: BigWordBeat renders its `children` (Ray + Drip) UNGATED from
s11 frame 0 (BigWord.tsx:88-95) — Ray snaps from (1453.3, 565.4) scale
0.78 to the W-bar perch (1272, 258) scale 0.36, and Drip (not on stage
AT ALL in s10) materialises at (990, 274), both floating over an empty
garden for ~302 frames until the card slams (slamAt ≈ 86% through
a1_46_narrator, abs ≈f8316). Plus formation snaps: Blue (1156.6, 665.2)
→ (1233.5, 641.3) and Indigo (1221.5, 817.3) → (1463.5, 758.8).

Fixes (all inside act1.tsx s11; do NOT gate BigWord.tsx's children
generally without checking its other call sites — prefer gating in the
children we pass):

1. **Pre-slam continuity**: from s11 local 0 → slamAt, render Ray at
   his exact s10 end pose — arcPointLifted(0.78) = (1453.30, 565.43),
   scale 0.78, same look/emotion he ended s10 with (nothing mapped to
   a1_44 = the face he said the button on). Zero jump across the cut.
   Drip is NOT rendered pre-slam (she was never on stage in s10).
2. **The card brings them**: at slamAt, Ray swoops from his s10 pose to
   the W-bar perch (1272, 258) over ~22f with scale ease 0.78→0.36
   (PERCH) — a visible travel, motion-is-the-explanation, arriving just
   after the card lands. Drip ENTERS: drops from above the frame to
   B_TOP (990, 274) scale 0.3, starting ~10f after the slam, ~18f fall
   with a small landing squash (she is a water drop; dropping in is her
   grammar). Keep zIndex as-shipped (tie 55/55, Drip painted after Ray)
   unless stills show a wrong overlap during the swoop — then Ray 55 /
   Drip 56.
3. **Formation settle**: same handoff treatment as T2b — bake
   `S10_END_BLUE = {x: 1156.58, y: 665.24, heading: 84.96}` and
   `S10_END_INDIGO = {x: 1221.47, y: 817.28, heading: -54.68}`, ease
   into SevenOnTheWord's u=0 marks over ~30f (Indigo +INDIGO_LAG).
4. GATE: boundary stills f8013 vs f8014 (must be near-identical), plus
   a 6-still strip of the slam window (card in, Ray swoop mid/end, Drip
   drop mid/land).

### T2d — bubble sweep, card slam → s13

Known wrong (fix outright):

- `a1_53_ray` (s12, act1.tsx:3595): `tailAt: 430` but Ray is static at
  x=360 all scene. Set `tailAt: 360` (or key it to S12_RAY.x so it
  can't drift).
- `a1_48c_blue` (s11, act1.tsx:3215): `tailAt` pinned to the static
  contact point while Blue's bounce swings his rendered x by +100/−65px
  across the exact line window. Make `tailAt` live: contact.x +
  bounceOff(frame).x (overrides are computed per-frame; dripContact
  already does this pattern).

Then the sweep — Mike said "ALL in the wrong place", which is stronger
than these two, so verify by eye, not by code-reading: for EVERY spoken
line from the card slam (`a1_47_ray`) through s13 end, render a still
at the line's midpoint and check (a) tail points at the speaker's
rendered body, (b) bubble does not cover the RAINBOW card word or
another character's face, (c) no-override lines whose speakers are tiny
(0.3–0.36 perch scale) or clamped (by floor 170 / bx clamp) don't park
the tail at the corner-inset default aiming at nobody — any miss gets
an explicit `at` override with a live `tailAt`. List every change made
in the DONE section with before/after coords.

### T2 gates (rides with the T1 builder batch)

- typecheck 0, lint:hooks 0.
- Narration regen: `a1_42h_narrator` cache entry retired; ZERO new
  synthesis (the cut is kokoro; nothing else changes text). Still zero
  minimax synthesis across T1+T2.
- Scene-range every-frame render s09→s13 (f5842–f10000ish on the NEW
  timeline — recompute after T1 shifts frames), exit 0.
- Boundary still pairs per T2b/T2c + the T2d bubble strip + skeptical
  face stills (hero scale + in-scene at 0.78).
- Timing note: T1 (+~285f) and T2a (−24f) both shift everything after
  s05; all T2 timestamps above are DEPLOYED-cut references — builders
  re-derive local frames from line keys, never from absolute frames.

---

## Round status

- T1 designed (committed 7a84e82), awaiting quota green-light to spawn
  builder.
- T2 designed (Ahem cut + skeptical emotion + s09/s10/s11 continuity +
  bubble sweep); batches with T1 into ONE builder run.
- Further Mike notes: pending — append as T3, T4, … above this section.
