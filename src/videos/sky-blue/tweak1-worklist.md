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

## T3 — s16_myth_paint: remove the tray (Mike note 3)

**Mike, verbatim:** "the "Sunny show us the paint" line seems weird that
it shows us the paint and then he says he keeps it somewhere else -
let's just get rid of the paint box from that scene (it's fine at the
beginning though)"

As-built: MythPaintScene (act2.tsx:751-821) — after "Sunny. Show us the
paint." (a2_11_narrator), 45f of Sunny tipping the never-used PaintTray
(act2.tsx:843-936, with the dry PaintRoller inside at :933) at the
lens, then "I keep the paint somewhere else." (a2_12_sunny).

Design: DELETE the PaintTray (and the roller inside it — it only exists
in-tray here) from Scene 16 entirely, incl. S16_TRAY constants and the
tip/back eases. The 45f held beat STAYS but is now carried by Sunny's
face alone: grin freezes on the request, a small look-away-and-back
(look prop, ~12f out ~12f back inside the beat), then the existing
excited→neutral→proud morph rides into the line. The dodge becomes
pure face + words — "I keep the paint somewhere else." now plays as an
unsupported claim, which is the joke Mike is asking for. NO other
timing/lines change. Untouched elsewhere (Mike: "fine at the
beginning"): cold-open wet roller (coldOpen.tsx:434), s23's dry roller
(that one is T6's call, see below). script.md Scene 16 section folds
the change. Cost $0.

## T4 — s20 Blue roll call replaces "Hi! Hi! Hi! Hi!" (Mike note 4) — NEEDS MIKE TEXT SIGN-OFF

**Mike, verbatim:** "I think the "roll call" with the colors intro
isn't a true roll call, let's do one instead when blue says "Hi Hi Hi",
and change that to "Hi bluington, Hi <other blues>, etc""

As-built: a2_32b_blue "Hi! Hi! Hi! Hi!" (MiniMax Decent_Boy happy) in
s20_every_direction — one clip, four "Hi!" bubbles popping from four
compass points at measured clip fractions (S20_HELLO_AT
0.069/0.332/0.574/0.812) while 24 Blue copies arrive at the lens.
Supersedes the a2_32b ear item (suspected slow take) — the clip is
being replaced outright.

Canon check: NO blue names exist anywhere in the repo ("Bluington" is
new, spelling as Mike typed). Structure kept: ONE new MiniMax clip,
FOUR bubbles, same four compass positions; each bubble now shows its
own greeting; fractions RE-MEASURED on the new clip (same gain/
silencedetect method). The gag: Blue holding a roll call of his own
identical copies — mirrors Ray's s10 roll call, and the fourth greeting
lands the point that they are all him.

Proposed line text (route to Mike, pick or amend):
- **Option A (preferred):** "Hi, Bluington! Hi, Blueberry! Hi, Bluella!
  Hi... me!"
- Option B: "Hi, Bluington! Hi, Bluesworth! Hi, Bluey! Hi... me!"
Fields unchanged (BLUE, emotion happy); small <#0.3#> pauses between
greetings if the natural read crowds the bubble pops (builder's call on
the measured take). Cost ~$0.01. NEW EAR ITEM (replaces the old a2_32b
one). Bubbles: four texts "Hi, Bluington!" etc. at the S20_HELLO marks
— builder verifies corner fit at stills (names are longer than "Hi!").
script.md s20 section + cast-note fold; if a name sticks it becomes
BIBLE material at retro.

BLOCKED until Mike picks the text; builder run 2.

## T5 — a2_52_ray caps fix: "the AIR" reads as "the A" (Mike note 5)

**Mike, verbatim:** "Ray says "But the air did the painting" but it
sounds like "but the A did the painting""

Diagnosis: narration.mjs:1239 text is "But the AIR did the painting."
— all-caps emphasis on a MiniMax line. Caps/letter-stretch is
kokoro-only grammar (STYLE rule: sound-word spellings are PER-ENGINE);
MiniMax is reading "AIR" letter-wise/clipped. Fix: text → "But the air
did the painting." (lowercase), same fields, re-synth Young_Knight
(~$0.01). NEW EAR ITEM. The s23 BUBBLE text ("The AIR did the
painting.") may keep its visual caps — bubbles are print, not
pronunciation. RETRO NOTE for STYLE.md: sweep rule — no all-caps
emphasis words on MiniMax lines, ever; caps survive only in bubble
text. Builder: grep all minimax lines for other all-caps emphasis words
and REPORT (don't change) any found — showrunner triages.

## T6 — s23_sunny_wrong visual re-shoot (Mike note 6) — NEEDS MIKE CONCEPT NOD

**Mike, verbatim:** "That same scene (around 10:00 to 10:20) is still
very awkward visually - I think the speech is fine, but I don't think a
kid will be able to understand the visual, let's re-shoot that whole
scene with some different visuals"

Scope: s23_sunny_wrong (17473–18636, 9:42–10:21). ALL ELEVEN CLIPS AND
EVERY GAP UNCHANGED — speech and timing are approved; this is a
picture-only re-shoot. The abstract WrongDiagram (sun→beam→sky→cloud
schematic + camera push + air-band rebuild) goes — that is the thing a
kid can't parse.

Proposed concept (route to Mike for a nod): **"Sunny poses, the air
paints."** Replace the diagram with the episode's own concrete
mechanism grammar, already proven parseable in s19/s20:
- Sunny right (existing S23_SUNNY mark), beaming ONE warm beam across
  the frame — unmistakably HIS light, from his body.
- The beam hits a small band of air puffs mid-frame (the AIR_BAND
  characters); Blue copies bounce OUT of the puffs in all directions
  and fill the sky band above with blue as they go — a pocket version
  of s20's every-direction dome, i.e. the painting happening ON SCREEN,
  done by air, out of Sunny's light.
- Sunny never does any painting: he holds the dry roller UP like a
  trophy and poses (the roller's seven-scene running gag gets its
  payoff shot). Grin still GROWS through the "He has a point." beat
  (standing ruling preserved). "LOADS of points" keeps the RayFan pun —
  it fires behind him exactly as now.
- Line-keyed beats: a2_51 "The light is his." → the beam pulses/warms
  from Sunny outward. a2_52 "But the air did the painting." → the puffs
  visibly do a painter's stroke: a wave of fresh blue sweeps the sky
  band, clearly starting AT the puffs, not at Sunny. a2_53 (MY LIGHT!)
  → Sunny poses harder while the air keeps painting behind him,
  ignoring him. a2_54 "his light... not his painting" → beam pulse,
  then sky-sweep pulse — the sentence drawn twice. a2_55 + 45f button
  beat: everything settles, nobody helps him.
- Ray stays bottom-left at his mark; his 30f "It lands on him" beat
  unchanged.
Kept from current build: marks, bubbles (texts/positions), emotion
tracks, held-beat structure, RedAcross stays OFF (R9 ruling). Deleted:
WrongDiagram, the 2.5x camera push (no camera moves — the mechanism
must stay whole-frame for the kid), rebuild choreography.
Cost $0 (visuals only). BLOCKED on Mike's concept nod; builder run 2.
Builder brief must include: read s19/s20 components first and reuse
their scatter/arrival idioms, not reinvent.

## T7 — a3_22b_red "Nice drama." re-roll (Mike note 7)

**Mike, verbatim:** "When someone says "Nice Drama" it has a weird
accent "Nice-eh Drama" which doesn't sound like any character (not sure
if it's supposed to be orange or red)"

It's Red (a3_22b_red, Patient_Man calm 0.9, narration.mjs:1790) —
MiniMax inserted an epenthetic vowel ("Nice-eh"). Same failure class as
the a2_28b_blue bad draw. Fix: cache-bust re-roll, SAME text/fields, up
to 3 draws, keep the take with clean "Nice" onset and s/word in Red's
healthy band; manifest retimes automatically. If all draws are
epenthetic, fallback text "Good drama." (flag as deviation). ~$0.01.
NEW EAR ITEM.

## T8 — Sunny's morning catch-phrase at the ending (Mike note 8)

**Mike, verbatim:** "When Sunny says "Good morning everybody" toward
the end, I think it's a good opportunity to do his "I made the
mornings, you're welcome haha" catch-phrase" + amendment: "for the
exact wording, it should mirror his same line in previous episodes"

Canon (verified in both priors): ep1 water-cycle:116 AND ep2 wind a2_05
pair "GOOD MORNING, EVERYBODY!" with **"I invented mornings! You're
welcome! HA! HA!"** — exact same text both episodes. Ep-3's a3_31_sunny
(the sameAs of a1_03, in s31_round_the_other_side at ~15:37) fires the
greeting WITHOUT the tag — this note restores a two-episode pattern.

Design:
- NEW `a3_31b_sunny`: text "I invented mornings! You're welcome! HA!
  HA!" — SUNNY (kokoro am_puck), $0. Exact canon spelling above, no
  variation.
- Video.tsx s31: insert after a3_31_sunny. a3_31_sunny's trailing gap
  75f → **18f** (a beat between greeting and brag); a3_31b_sunny takes
  the **75f** ending silence (the "longest silence / the episode does
  not have an ending without it" rule moves with the last line, length
  preserved — update the Video.tsx comment).
- act3.tsx s31: stage the line at Sunny's existing mark; bubble "I
  invented mornings!" (cap rule); emotion excited on the line. Nothing
  else moves; the 75f after it stays empty.
- RULING UPDATE (Mike's direction overrides): script.md:3008's "seven
  firings is the ceiling" becomes EIGHT with a3_31b listed, noting the
  8th was Mike's explicit call (note 8, 2026-08-04). rc_18 still does
  not use it.
- Runtime +~93f (clip ~2.5s + net gap change).

## T9 — rc_11b_sunny bubble placement (Mike note 9)

**Mike, verbatim:** "When Sunny says "I am right here" the word bubble
is in the wrong place"

As-built (recap.tsx:1163): bubble at (1250, 640) tail right, tailAt
1616 — but Sunny blazes at (1706, ~214) scale 1.22 in the s34 moon
shot. The bubble floats ~430px BELOW him over the moon world; the tail
aims at nobody at that height. Fix: move it up beside him — start at
(1290, 300), tail "right", tailAt S34_SUNNY.x − 90 (unchanged), and
verify by still that it clears the LunarBlaze rays and does not crowd
BlueMarble (286,196) or the astronaut sightline. Builder adjusts ±40px
on stills. $0.

## T10 — cut the "waking up" tease from s35 (Mike note 10)

**Mike, verbatim:** "I think we need to cut the "someone is waking up
bit" it doesn't make sense with the switch to plants in s4 [ep-4], just
cut straight from the moon to the next time what do plants eat"

As-built s35_tease: 45f silent stir open → rc_17_narrator "Something is
waking up." → rc_18_sunny "OH! That one is me as well! HA! HA!" →
rc_18b_narrator "Hmm. We will find out." → rc_19_ray "Bye! Look up.
That's me." (NextTimeCard pops at byeFrom) → rc_20_narrator "Next time.
What do plants eat?" → 30f wave-freeze → rc_21_ray "Is it me??" fear
flinch.

The "waking up bit" = the volcano-wake material: rc_17 + rc_18 +
rc_18b + the stir/rumble choreography. NOT rc_20 (the card line Mike
names as the keep) and NOT rc_21 ("Is it me??" is a PLANTS joke — Ray
fearing he's what plants eat — and stays as the button).

Design:
- CUT from narration.mjs + Video.tsx s35 lines: rc_17_narrator,
  rc_18_sunny, rc_18b_narrator (all kokoro, $0; their ear items die
  with them). rc_19, rc_20, rc_21 KEEP (rc_20/rc_21 stay on Mike's ear
  list).
- recap.tsx TeaseScene: remove the stir ramp, both rumbles, Sunny's
  claim/turn-to-camera choreography. The set may remain the sea-dusk
  shot but the volcano is FULLY ASLEEP (stir at its dormant baseline,
  zero wake tells — it is scenery again, the series' sleeping constant).
  Sunny may stay in frame passive for the goodbye; no beat touches him.
- New shape: leadFrames 45 → 20 (calm dusk establish, straight off the
  s34 moon cut) → rc_19 "Bye!" + card/banner pop (unchanged mechanics)
  → rc_20 over the card → 30f freeze → rc_21 flinch → 40f + tail 14.
  Freeze/fear windows re-key cleanly (their anchors rc_20/rc_21
  survive).
- Runtime ≈ −340f (−11.3s).
- **CONTINUITY (for BIBLE at retro):** ep-5 = volcano wakes, and this
  cut removes the ep-3 end-tease seed. Remaining in-episode seeds: s25
  Yellow's rest attempt + narrator warn-off, s28b2 the eye-open beat.
  The banked material — Sunny claiming the wake ("that one is me as
  well") and the "That is not me."-inversion (script.md:3011-3015) —
  is now UNFIRED and available to ep-5's cold open or ep-4's own tease.
  Record in BIBLE's open-teases ledger when it's written.
- script.md s35 section rewrite + ear list renumber + counts.

---

## Builder batching (green-lit 2026-08-04, quota 126k/450k)

- **RUN 1 (green-lit, spawn now):** T1, T2, T3, T5, T7, T8, T9, T10.
  Gates: typecheck 0, lint:hooks 0, narration regen (expected synth:
  T1 kokoro lines, T8 new kokoro line, T5 one minimax line ~$0.01, T7
  re-roll draws ~$0.01-0.03; REPLICATE token needed), scene-range
  every-frame renders (s04–s06, s09–s13, s16, s23 untouched in run 1,
  s31, s34–s35), boundary/bubble/face stills per T-item, and the T5
  caps-on-minimax report.
- **RUN 2 (after Mike's T4 text pick + T6 concept nod + fresh quota
  gate):** T4, T6. Then tweak-round close: FULL every-frame
  --scale=0.25 render exit 0, script.md counts, HANDOFF, deploy
  handoff.

## T5b — rc_14_ray caps fix (builder-found, showrunner-approved for RUN 2)

RUN 1's caps sweep found `rc_14_ray` carries the identical defect Mike
heard in note 5: "the AIR does" on a MiniMax line, in the recap. Fix in
RUN 2 exactly like T5: lowercase "air", same fields, re-synth
(~$0.01), ear item. The other 29 all-caps MiniMax lines in the
builder's DONE list are NOT changed this round — they go to the retro
as a STYLE watch-list (new rule: no all-caps emphasis on MiniMax lines;
caps live in bubble text only). Mike flagged none of them by ear across
two screenings; speculative re-rolls are not worth cents yet.

## T7b — a3_22b_red REWRITE (Mike ear verdict on the RUN 1 re-roll)

**Mike, verbatim (2026-08-05):** "22b red is still weird. Something
about that phrase and voice doesn't work. Maybe rewrite that one line.
The rest of the voice clips are good"

The re-roll didn't fix it — the phrase/voice combo is the problem (the
"Nice" onset broke identically across draws, and the clipped two-word
shape fights Patient_Man's slow calm). Showrunner rewrite: text →
**"Very dramatic."** — keeps the deadpan callback to Sunny's "For the
drama!", fits Red's patient register, drops the failing onset. Same
fields (RED, calm, 0.9). Bubble text (if any) follows the new words.
~$0.01. EAR ITEM (the only one left plus RUN 2's new takes).
script.md: fold text + note the phrase-level diagnosis.

## RUN 2 FINAL SCOPE (green-lit 2026-08-05, quota 0k/450k)

- **T4** with Mike's pick = **Option B**: "Hi, Bluington! Hi,
  Bluesworth! Hi, Bluey! Hi... me!" (exact text, spelling as written).
- **T6** concept **APPROVED as designed** ("Sunny poses, the air
  paints").
- **T5b** rc_14_ray caps fix.
- **T7b** a3_22b_red → "Very dramatic."
Ear-list state going in: FULLY CLEAR (all 6 other RUN 1 clips approved;
rc_20/rc_21 approved) — RUN 2's new takes are the only additions:
a2_32b_blue (new roll call), a2_52? no — just a2_32b, rc_14_ray,
a3_22b_red.
Round close after RUN 2: full every-frame --scale=0.25 render exit 0,
script.md counts/ear-list final sweep, HANDOFF, deploy handoff to
orchestrator, then retro + BIBLE (seed: tweak1-retro-notes.md).

## RUN 2 showrunner review (2026-08-05) — PASSED, no fix round. ROUND CLOSED.

Sampled T6_18500 (acceptance frame), T6_18910 (button), t4_15792 (four
greetings up). All accepted. Rulings on the builder's flags:
1. a2_53 bubble covering the band's top-right for 115f: ACCEPTED as-is
   — Sunny's brag physically covering part of the air's work is
   thematically right; no fix.
2. The pale-primer licence: ACCEPTED. It reads as a canvas-strip
   device, which is exactly the metaphor; legibility beats literalism
   here. Watch-item at the re-screening only.
3. "Paint the value, not the hue" → added to tweak1-retro-notes.md for
   STYLE.
4. Bubbles bx/by clamp under-documentation → kit backlog (with plate
   shift + Freeze re-export + browAsym single-side notes).
5. Note-4 interpretation stands: "let's do one INSTEAD when blue says
   Hi Hi Hi" — the true roll call lives in s20, s10 untouched. If Mike
   meant both, that's a cents-scale follow-up after re-screening.
6. Correct — HANDOFF is showrunner/orchestrator-owned.

ROUND-CLOSE STATE: full every-frame --scale=0.25 render exit 0
(31,419/31,419 frames = 17:27.3, 107MB) — DEPLOY-READY on commit.
EAR LIST (the only open items, all shipped-in-cut): a2_32b_blue
"Hi, Bluington!..." (0.326 s/syll, Blue's median), rc_14_ray (0.266
s/word), a3_22b_red "Very dramatic." (clean onset). Everything else
Mike-approved 2026-08-05.

## RUN 1 showrunner review (2026-08-04) — PASSED, no fix round

Sampled 13 stills (skeptical face hero+in-scene, T1 almost-ask
hang/deflate/wide, T2b cut pair, T2c cut frame + swoop + Drip land, T10
open + button, T3 look-away, T9 crop, T2d s13 a1_60). All accepted.
Rulings on the builder's flags:
1. Worklist handoff constants were wrong/stale (S9_END_INDIGO 18px
   lift; both S10_END_* invalidated by T2a's own -24f) — builder's
   probe-derived values ACCEPTED; code over design doc.
2. Builder-added scope ACCEPTED (verified in the boundary pair): s09→
   s10 camera-zoom continuity (the 4% everyone-pop was the rest of
   Mike's "they all jump") and the seven's emotion handoff across the
   cut.
3. T2d extra finds ACCEPTED (a1_55/a1_56 off Sunny's eye, a1_60 off
   Sunny's own eye — all four s13 bubbles now overridden).
4. rc_14_ray → T5b above.
5. T9 y-deviation to (1330,196) ACCEPTED (brief's y sliced Ray's head).
6. T7 acceptance judged on onset shape (Red's corpus band was wider
   than the brief's) — sound reasoning; Mike's ear decides, in packet.
7. skeptical uses the achievable brow side (browAsym is camera-right
   only) — face reads correctly; ACCEPTED. Kit note: browAsym is
   single-sided, record in STYLE at retro.
8. PaintedSky 10–15px plate shift at every hard cut: KIT BACKLOG (with
   the Freeze re-export item), not this round — series-wide design
   call, invisible next to the character jumps that are now fixed.

EAR PACKET for Mike (public/narration/sky-blue/): a2_52_ray.mp3 (air
fix), a3_22b_red.mp3 (re-roll), a1_16d_narrator.mp3 ("No, Ray, not
yet." at 0.8), a1_16b2_narrator.mp3 + a1_15d_narrator.mp3 +
a1_16_narrator.mp3 (count rewords), a3_31b_sunny.mp3 (catch-phrase).
Plus still: scratchpad tweak1_run1/T2a_SKEPTICAL_FACE_FOR_MIKE_hero.png.

## Round status

- Mike's notes 1–10 all received 2026-08-04 — THE TWEAK LIST IS
  COMPLETE. T1–T10 designed above.
- Builder RUN 1 (T1,T2,T3,T5,T7,T8,T9,T10) green-lit and in flight.
- T4 blocked on Mike's line-text pick (options in T4); T6 blocked on
  Mike's concept nod — both go in RUN 2 with a fresh quota gate.
- After RUN 2: full every-frame gate render → deploy handoff → retro +
  BIBLE first write-up (owed at this boundary).

- T1 designed (committed 7a84e82), awaiting quota green-light to spawn
  builder.
- T2 designed (Ahem cut + skeptical emotion + s09/s10/s11 continuity +
  bubble sweep); batches with T1 into ONE builder run.
- Further Mike notes: pending — append as T3, T4, … above this section.

---
---

# BUILDER RUN 1 — DONE (scene-builder, 2026-08-04)

Items implemented: **T1, T2, T3, T5, T7, T8, T9, T10**. T4 and T6 untouched.
All gates green. **New total: 31,375 frames = 17:25.8** (baseline 31,372 =
17:25.7; net **+3 frames** — T1 +285, T8 +101, T2a −24, T10 −359, plus small
clip-length deltas from the two re-synthesized MiniMax lines).

## Gate results

| Gate | Result |
|---|---|
| `npm run narration -- --video sky-blue` | **6 clips synthesized**, everything else cache. Second run: 0. |
| `npm run typecheck` | 0 errors |
| `npm run lint:hooks` | 0 findings |
| Scene-range every-frame renders (`--scale=0.25`) | **all exit 0** — see table below |
| Full every-frame render | **NOT RUN** — deferred to round close after RUN 2, per the brief |

**Exact synthesis list and cost.** Six clips, and no others:

| key | engine | why |
|---|---|---|
| `a1_15d_narrator` | kokoro | T1 text → "Three minutes down. Five to go." |
| `a1_16_narrator` | kokoro | T1 text → "Four minutes down. Four to go." |
| `a1_16b2_narrator` | kokoro | T1 NEW — "Five minutes down. Three to go." |
| `a1_16d_narrator` | kokoro | T1 text → "No, Ray, not yet." |
| `a3_31b_sunny` | kokoro | T8 NEW — "I invented mornings! You're welcome! HA! HA!" |
| `a2_52_ray` | **minimax** | T5 caps fix, 29 chars ≈ **$0.003** |
| `a3_22b_red` | **minimax** | T7 cache-bust re-roll ×2 draws, 11 chars each ≈ **$0.002** |

**Total spend ≈ $0.005.** `a1_13_ray` + its four `sameAs` aliases and
`a1_16c_ray` were cache hits and are byte-identical; no other paid clip was
touched. Retired (files deleted, cache entries dropped): `a1_42h_narrator`,
`rc_17_narrator`, `rc_18_sunny`, `rc_18b_narrator`.

**Scene-range renders, on the NEW timeline:**

| range | frames | exit |
|---|---|---|
| s04 → s06 | 2140–4729 | 0 |
| s09 → s13 | 6145–10653 | 0 |
| s16 | 12001–12377 | 0 |
| s31 | 27951–28618 | 0 |
| s34 → s35 | 29850–31374 | 0 |
| **s23** (extra) | 17752–18894 | 0 |

s23 was not on the render list, but T5's re-synthesis of `a2_52_ray` cut that
clip from **2.304s to 1.656s** (−19 frames — the old take really was spelling
"A-I-R"), which retimes the whole scene. Rendered as insurance; exit 0.

**Stills:** ~75 rendered and read, in
`/tmp/claude-1000/-home-mike-projects-video-generation/6d0bf85a-ed8c-47e4-95bd-f064f9bc68c7/scratchpad/tweak1_run1/`.
The two to look at first are `T2a_SKEPTICAL_FACE_FOR_MIKE_hero.png` (the new
face at 3× detail) and `T2a_skeptical_in_scene_0p78.png`.

## T1 — Scene 5 restructure — DONE

- `narration.mjs`: `a1_15d` → "Three minutes down. Five to go.",
  `a1_16` → "Four minutes down. Four to go.", NEW `a1_16b2_narrator`
  ("Five minutes down. Three to go.", NARRATOR 0.92), `a1_16d` → "No, Ray, not
  yet." at 0.8. All five answers sum to eight. Surrounding comments rewritten:
  the five-firings-one-recording law restated, the skipped-arithmetic note
  replaced with the metronome note, the "goes unanswered" note gone.
- `Video.tsx`: `a1_16b2_narrator` inserted between `a1_16b_ray` and
  `a1_16c_ray`. Gaps now 45 / 75 / 105 / 135 / **165**, the 90f override on
  `a1_16b_ray` removed (fifth firing answered at the house gap), `a1_16d` 90 →
  **210**. Tail 6f unchanged.
- `act1.tsx`: **the silent almost-ask**, `S5_ALMOST` (from 60, up 18, hang 50,
  down 15, peak 0.35) inside the 210f hold, keyed off
  `heldBeat(scene, "a1_16d_narrator")`. It is **the real `SpeechBubble`
  primitive** — same component, same `S5_BUBBLE_AT` x/y/tail/`tailAt`, the same
  text laid out in `color="transparent"` so the box is the identical shape —
  wrapped in a layer scaled about `S5_ALMOST_ROOT` (730, 415), the tail's own
  tip, measured off a still of a real firing. The inner bubble is pinned fully
  on (`from={0}`, no `until`) so its pop spring cannot fight the wind-up, and it
  is rendered every frame at `scale(0)` outside the window so the hook count
  never changes. **Nothing on the rig is touched**: no emotion, no look, no
  speaking mouth.
- Stills: `t1_2600 / 2780 / 2983 / 3217 / 3478` (the five answered firings —
  identical drawing, identical place, confirmed), `t1_3670` (the 165f silence,
  empty), `t1_3770` (sixth firing), `t1_3927 / 3961 / 3993 / 4008` +
  `crop_almost_hang / _deflate / _gone` (the 4-frame almost-ask strip:
  inflate-mid, full hang, mid-deflate, gone — face unchanged throughout).
- Comments updated: `Video.tsx` header + s05 gaps block, `narration.mjs` Scene-5
  block, `act1.tsx` `S5_BUBBLES` doc and the JourneyScene doc, script.md Scene 5
  (full REVISED 2026-08-04 fold with Mike's note verbatim).

## T2a — "Ahem." cut + `skeptical` — DONE

- `a1_42h_narrator` removed from `narration.mjs` and from s10's clip list; its
  mp3 and cache entry are gone. The never-substitute-"Hmm." ruling is restated
  where the clip used to be.
- `a1_42g_orange` gap 8 → **40** ("let it sit"). Net timing −24f, as designed.
- `src/lib/kid/rig.ts`: NEW `skeptical` in the `Emotion` union and the
  `EMOTIONS` table. **Tuned on stills over four passes**; shipped values
  `browRaise −8, browAngle −2, browAsym −16, eyeScaleX 0.99, eyeScaleY 0.94,
  lidBase 0.12, mouthWidth 48, mouthCurve 2, blush 0, tilt 4`.
- **DEVIATION (necessary, please note).** The brief says "pick the sign that
  raises the camera-left brow". `browAsym` is applied only when `side === -1`,
  which renders on the **camera RIGHT** (the character's own left) — there is no
  sign that moves the camera-left brow, so the choice was which *rotation* reads
  as raised. Negative lifts that brow's OUTER end (the arched-eyebrow read);
  positive lifts the inner end, which is *worried*. Negative it is.
- Two values went outside the brief's starting range and both were forced by
  stills: `browRaise −8` (at −3 the tilted brow's inner end sat on the eye and
  the side read as a squint) and `browAsym −16` (at −13 the asymmetry did not
  survive 0.78 scale). Everything else is the brief's number.
- `RollCallScene`: `emotionAt` map `neutral` → `skeptical`, same `camFrom`.
  `camTo` re-keyed from the dead `a1_42h_narrator` to `a1_43_narrator`, so Ray
  holds the sceptical camera look through the whole 40f. The eye-line
  break-back is now a **duration** (`S10_BREAK_BACK = 24`) rather than a window
  keyed to a clip that no longer exists.
- Ladder position: **B1 (skeptical across the whole exchange window)**. It reads
  as "one eyebrow up, unimpressed" at hero scale and at 0.78 in scene; not
  grumpy, not smug (no `mouthTilt`, lids no narrower than `proud`'s), not
  smiling (`mouthCurve: 2` is the first near-flat mouth in the table). No need
  to step down the ladder, but the hero still is saved for review.
- script.md: Scene 10 fold with Mike's note verbatim; the 40f beat written up as
  a held beat; ear item 31 ("Ahem.") **RESOLVED — cut executed** and struck from
  the list; the Ahem references in the line-length and grown-up-smirk ledgers
  updated.

## T2b — the 3:49 jump (s09 → s10) — DONE, and it was carrying FOUR faults

The fact report named two. Probe overlays rendered into frames 7205/7206 found
four. **All the constants below were re-derived on the new timeline** by
rendering `x`/`y`/`heading` into the frame from inside the components and
reading them off stills — I did not take the worklist's numbers on trust, and
one of them was wrong.

| what | s09 last frame | s10 frame 0 | worklist said |
|---|---|---|---|
| Blue | (1157.03, 429.06, −90) | (1233.51, 701.34, −25.38) | **matches** |
| Indigo | (1320.90, **667.96**, −90) | (1333.54, 818.78, 0.00) | y **685.97** — **WRONG by exactly 18px**, the indignant pose's lift, which the measurement had missed |

1. **Blue/Indigo settle.** `S9_END_BLUE` / `S9_END_INDIGO` baked with a loud
   re-derive-me comment, blended into the live pose over `S10_SETTLE = 30`
   frames (Indigo `+INDIGO_LAG`, so for four frames he is still standing exactly
   where Scene 9 left him while Blue has started drifting back).
2. **Ray enters instead of popping.** `S10_RAY_ENTER = 14` frames of opacity
   plus `S10_RAY_DROP = 20`px of drift down onto his own track. No streak, no
   flash; it sits under `a1_41_narrator`.
3. **NEW FINDING — the lens.** Scene 9 ends on its pull-back at **zoom 0.96**
   about (960, 700) and Scene 10 had no camera at all, so **all seven** popped
   4% bigger and up to 30px sideways on the cut. That is Mike's "they ALL jump a
   bit" and it is not in the fact report. Fixed: s10 now opens inside a `Camera`
   at `S9_END_ZOOM` easing to 1× over the same 30 frames. Bubbles stay outside
   and are projected through it (identity by the time the first one exists at
   local ~100).
4. **NEW FINDING — the faces.** Scene 9 hands its arc Ray's `amazed` and gives
   Blue/Indigo their own `grumpy`; Scene 10 drew the kit's default `happy` from
   frame one, so **seven mouths changed shape on the cut**. Fixed: each shard
   morphs out of its Scene-9 face over `S10_FACE_SETTLE = 14`.

Gate stills: `t2b_pre_7205/7206` (before), `t2b_7205/7206/7221/7236` (after).
The boundary pair is now near-identical — Blue, Indigo, the five others and the
lens all match; the only residual is the plate (see FLAGS).

## T2c — the 4:28 jump (s10 → s11) — DONE

**The worklist's `S10_END_*` numbers were measured on the deployed cut and were
stale**, because T2a shortened Scene 10 by 24 frames and those values are that
scene's ricochet evaluated at its own final frame. Re-derived by probe:

| what | worklist | **re-derived (new timeline)** |
|---|---|---|
| `S10_END_BLUE` | (1156.58, 665.24, 84.96) | **(1289.59, 739.90, 128.96)** |
| `S10_END_INDIGO` | (1221.47, 817.28, −54.68) | **(1448.75, 784.20, 128.96)** |
| s11 u=0 Blue / Indigo | (1233.5, 641.3) / (1463.5, 758.8) | **matches** |
| Ray s10 end | arcPointLifted(0.78) = (1453.30, 565.43) | **matches** |

- **Pre-slam continuity.** Ray is drawn at `S10_END_RAY` at scale 0.78 with the
  face he ended Scene 10 with, from frame 0 to `slamAt` (local 208). Drip is
  **not on stage** — she starts `S11_DRIP_DROP = 560`px above her mark, off the
  top of the frame, so no opacity trick is needed.
- **The card brings them.** At `slamAt` Ray swoops to the W-bar over
  `S11_SWOOP = 22` frames on a bowed path with the scale easing 0.78 → `PERCH`.
  Drip drops `S11_DRIP_LEAD = 10` frames after the slam over `S11_DRIP_FALL =
  18` under `kidEase.gravity`, with a landing squash folded into the existing
  `knock` (same shape as a bounce off Blue — from her point of view it is the
  same event). She lands at local 236; Blue's first contact is at 240, so the
  four-frame margin holds.
- **Formation settle.** Blue/Indigo eased off their Scene-10 end pose over
  `S11_SETTLE = 30` (Indigo `+INDIGO_LAG`), done long before the take-off at
  ~186.
- **Two more discontinuities found on the boundary pair and fixed:**
  Ray's **arms** popped up on the cut (`Ray` derives `cheer` from `excited`,
  and Scene 10 passes an explicit `rest`) — now `pose="rest"` until the slam;
  and **Violet's arms** dropped on the cut — now held until his own take-off.
- Ray's emotion in s11 was `useEmotion` resting `amazed` against Scene 10's
  `excited`; it is now `emotionAt` resting **`excited`**, → `amazed` at the slam
  (the card lands on him) → `excited` at the chant. Continuous *and* better
  staging.
- zIndex left as shipped (55/55): the stills show no wrong overlap during the
  swoop.
- Gate stills: `t2c_8292/8293` (boundary pair, near-identical),
  `t2c_8323` (mid pre-slam), `t2c_8504` (card in), `t2c_8512/8523` (swoop
  mid/end), `t2c_8520/8529` + `crop_drip_mid/_land` (drop mid/land),
  `t2c_8541` + `crop_8541`.

## T2d — bubble sweep, card slam → s13 — DONE

Every spoken line from `a1_47_ray` through s13 end was rendered at its midpoint
and looked at. Eleven bubbles; **four changed**, and two of the four are not on
the worklist's list.

| line | before | after | why |
|---|---|---|---|
| `a1_53_ray` (s12) | `tailAt: 430` | `tailAt: S12_RAY.x` (**360**) | 70px right of a character who is static at x=360 all scene. Keyed so it cannot drift again. |
| `a1_48c_blue` (s11) | `tailAt: dripContact(dripCentre).x` (static) | `tailAt: blueTailX` (live) | `blueAfterHit` split out of `blueVisit` so the bubble asks the renderer's own question. **In practice the tail is clamp-pinned at the bubble's right edge at the current bubble x, so this is correct-in-principle rather than visible** — it matters the moment the bubble moves. |
| `a1_55_ray`, `a1_56_ray` (s13) | *(no override — default placement)* | `{x: 760, y: 250, tail: "right", tailAt: projectMark(cam, rayMark).x}` | **NEW FINDING.** The default put both boxes across **Sunny's left eye**. |
| `a1_58_sunny` (s13) | *(no override)* | `{x: 760, y: 210, tail: "right", tailAt: projectMark(cam, S13_SUNNY).x}` | grazed his face |
| `a1_60_sunny` (s13) | *(no override)* | `{x: 700, y: 210, …}` | **NEW FINDING, and the worst of them: Sunny's own button covered Sunny's own eye** — the frame's only reaction shot, hidden by the thing reacting. |

Unchanged and verified good: `a1_48b_green`, `a1_48d_drip`, `a1_49_drip`,
`a1_49b_drip`, `a1_54b_green`. The four card bubbles all point at their
speaker's x and are attributed by the coloured dressing; their tails point
*down* because every speaker on the card is above their own bubble, which is the
documented kit gap (`SpeechBubble`'s tail leaves the bottom edge and nothing
else) and the reason the existing comments give for the placement.

## T3 — s16 tray removed — DONE

- `PaintTray` (component), `S16_TRAY`, the tip/back eases and the in-tray
  `PaintRoller` are deleted; the component had no other call site and is
  replaced in the file by a five-line note saying where the roller still lives.
- The 45f held beat is unchanged in length and position and is now carried by
  Sunny's face alone: grin freezes on the request, `S16_LOOK_AWAY` (14 in, 12
  out, 12 back — zero at both ends) drives a small look off to the side and
  back, and the existing excited → neutral → proud morph rides into the line.
  `eyeLife` no longer drops in the beat, because a dead eye cannot perform a
  deliberate look away.
- Untouched: the cold open's wet roller, Scene 23's dry roller (that one is T6).
- Stills `t3_12080 … 12290` + `t3_look_a/b`.

## T5 — `a2_52_ray` caps fix — DONE, **and there are 29 more**

Text → "But the air did the painting.", same fields, re-synthesized. The s23
bubble keeps its caps.

**REPORTED, NOT CHANGED — every MiniMax line still carrying an ALL-CAPS word.**
29 of them. The one that should be triaged first is **`rc_14_ray`, which
contains the *identical* word that just failed**:

```
rc_14_ray    RAY     AIR         "So the blue sky is a thing the AIR does."   <-- SAME BUG, LIVE
a2_03_ray    RAY     IS          "That is a good question. Why IS it only blue?"
a2_28_ray    RAY     GO          "Whoa. Where did Blue GO?"
a3_13b_blue  BLUE    UP          "Sorry! Sorry! I am going UP now! Bye!"
rc_03b_blue  BLUE    ME, ME      "SCATTER! That is ME bouncing! That is ME!"
a3_11t_blue  BLUE    YES         "YES!"
a1_53_ray    RAY     INTO, OUT   "Because I go INTO the rain and come back OUT again."
a1_56_ray    RAY     ALL         "I am not white. I am ALL of them. At the same time."
a2_32_ray    RAY     ALL         "So the blue is coming from ALL of the sky."
a1_12_ray    RAY     WHOOSH, EARTH
a1_18_ray    RAY     HERE, DOG
a1_39_ray    RAY     SEVEN
a1_47_ray    RAY     RAINBOW
a1_42b_yellow YELLOW GREAT
a1_48d_drip  DRIP    RAIN
a1_54b_green GREEN   JUST
a2_17_puff   PUFF    FEEL
a2_20_puff   PUFF    ZILLIONS
a2_20b_blue  BLUE    FIRST
a2_28b_blue  BLUE    HERE
a2_33b_yellow YELLOW LOOK
a2_39_ray    RAY     SCATTER
a2_44_puff   PUFF    TOLD
a3_05b_blue  BLUE    FIRST
a3_11f_blue  BLUE    RACE
a3_13bb_blue BLUE    UPWARDS
a3_20_ray    RAY     SUNSET
rc_02_ray    RAY     RAINBOW
rc_03_puff   PUFF    SCATTER, EVERYWHERE
```

The short ones are the dangerous ones (a two- or three-letter capitalised word
is what MiniMax reads as an initialism): **AIR, IS, GO, UP, ME, YES, ALL, OUT**.
The long ones (RAINBOW, SCATTER, ZILLIONS, WHOOSH) have never been reported as
mis-read and are probably safe. Showrunner triage; each fix is a lowercase edit
plus one cheap re-synthesis.

## T7 — `a3_22b_red` re-roll — DONE, 2 draws

Cache-busted by deleting the key from `public/narration/sky-blue/.cache.json`
and removing the mp3 (there is no `--force` flag on the narration generator);
text and fields **unchanged**.

| draw | manifest duration | source duration | speech run (thr 130) | onset |
|---|---|---|---|---|
| shipped (bad) | 1.512s | — | 0.180–0.252 **+** 0.270–1.404 | **detached 72ms blip, then a dip, then the word** — the epenthesis signature |
| draw 1 | 1.48s | 1.6s | 0.198–1.314 (single run) | clean |
| **draw 2 (KEPT)** | **1.48s** | **1.4s** | **0.234–1.278 (single run)** | **clean, and the tightest read** |

Stopped at two because both were clean; the tighter one is in. Measured with a
scratch MPEG-1 side-info `global_gain` probe (no ffmpeg on this box), the same
method the `S10_VIOLET_AT` note describes.

**DEVIATION / FLAG on the acceptance band.** The brief's "s/word in Red's
healthy band ~0.3–0.45" does not match this corpus: Red's ten lines run 0.42 to
1.04 s/word, and every one of his two-word lines is 0.65–0.76. I used
**onset-shape** as the acceptance test instead, because that is the actual
diagnostic for the reported defect, and total speech time as the tiebreak.
Please have Mike confirm by ear.

## T8 — Sunny's catch-phrase at the ending — DONE

- NEW `a3_31b_sunny`, kokoro `am_puck`, text byte-for-byte the canon:
  **"I invented mornings! You're welcome! HA! HA!"**
- `Video.tsx` s31: inserted after `a3_31_sunny`; that key's trailing gap 75 →
  **18**; `a3_31b_sunny` takes the **75f** ending silence, length preserved. The
  "the episode does not have an ending" comment moved with it.
- `act3.tsx`: bubble `"I invented mornings!"` at the *same* mark, size and tail
  as the greeting's; `payoffFrom` (which drives the dawn ramp) re-keyed to
  `a3_31b_sunny`; the bubble-out wrapper re-keyed to `bragTo` — keyed to the
  greeting it would have wiped the brag's bubble 18 frames before he said it.
- script.md: Scene 31 fold; **the "seven firings is the ceiling" ruling is now
  EIGHT**, with `a3_31b` listed and Mike's call noted as the reason, plus a
  "nothing may add a ninth" line.
- Stills `t8_28390/28480/28540/28600` — bubble in place, ending silence clean.

## T9 — `rc_11b_sunny` bubble — DONE

Moved from (1250, 640) to **(1330, 196)**, tail "right", `tailAt` unchanged at
`S34_SUNNY.x − 90`.

**DEVIATION on the y.** The brief starts it at (1290, 300) with ±40px of
latitude. At 300 the bubble's bottom edge **sliced the top off Ray's head** (he
is at (1210, 372) at 0.6) — one wrong bubble traded for one hidden character —
and 260 was still ~35px into him. 196 clears his crown with room. It does ride
across **Sunny's own rays**, which is the trade the original low placement was
avoiding; a bubble on its own speaker's rays is the acceptable half of that
trade and a bubble across another character's face is not. Verified clear of
`BlueMarble` (286, 196) and of the astronaut's sightline. `rc_09b_sunny` keeps
the low mark, correctly — that line is about the astronaut. Still `t9c_30490`.

## T10 — s35 tease cut — DONE

- `narration.mjs`: `rc_17_narrator`, `rc_18_sunny`, `rc_18b_narrator` cut, with
  a block noting what is **banked and unfired** for ep 5. The Sunny "four
  moments he stops" count in the file header corrected to three.
- `Video.tsx` s35: those three keys out of the clip list, their gaps gone,
  `leadFrames` 45 → **20**. `rc_20_narrator` 30f freeze and `rc_21_ray` 40f
  trailing beat and the 14f tail are unchanged and re-key cleanly.
- `recap.tsx` `TeaseScene`: stir ramp, both rumbles, Sunny's claim/turn-to-camera
  choreography, his bloom, his emotion morph and his bubble all removed. **The
  volcano is fully asleep — `stir` is not passed at all**, not a small number,
  and the comment says why. `WaterRumble` deleted (no other call site). Sunny
  stays in frame at resting `proud` looking out to sea; no beat touches him.
- script.md: Scene 35 rewritten (retitled **Sign-off**), with a CONTINUITY block
  for the BIBLE's open-teases ledger. Ear item 8 (`rc_18_sunny`/`rc_18b`) marked
  DEAD; the running-gag ledger's "That one is me as well!" entry now records
  that **the gag does not fire in this episode at all**.
- Stills `t10_31079` (first-frame calm dusk, ring closed, no rumble),
  `t10_31090/31130/31200/31245/31270/31300/31310/31350` (card in, banner,
  freeze, flinch).

## FLAGS for the showrunner

1. **The plate jumps at every hard cut, and it always has.** With everything
   above fixed, the residual difference across s09→s10 and s10→s11 is the
   *painted plate* moving 10–15px: each scene passes its own `phase` to
   `PaintedSky` and its clock restarts at 0, so the drift is at a different
   point in its cycle either side of a cut. This is **documented series design**
   (`common.tsx`: "Pass a different `phase` per scene… two consecutive scenes
   drifting in lockstep read as one long shot with a jump-cut in it"), so I did
   not touch it — but it is now the most visible thing left in Mike's "they all
   jump a bit", and it is a kit-level call, not a scene-level one.
2. **`rc_14_ray` has the same bug T5 just fixed** — "the AIR does" on a MiniMax
   line, in the recap, one of the most-repeated sentences in the episode. Worth
   fixing in RUN 2 for ~$0.003. Full list of 29 above.
3. **Two baked-constant families are now timing-fragile.** `S9_END_*` goes stale
   if Scene 9's clips or gaps change; `S10_END_*` goes stale if Scene 10's do —
   and T2a already invalidated the latter once. Both carry a loud comment with
   the re-derivation method (probe overlay + still), but a future retime will
   not notice on its own. If this pattern spreads, the kit wants a real
   scene-handoff mechanism.
4. **The `a1_48c_blue` tail is clamp-pinned.** The live `tailAt` is correct but
   invisible at the current bubble position; the underlying problem is that
   `SpeechBubble` can only grow a tail from its bottom edge, which forces every
   speaker on a Big Word card to sit *above* their own bubble. That kit gap is
   already reported in two places in `act1.tsx`; it is now reported a third
   time.
5. **T7's acceptance band** did not match Red's measured corpus — see the T7
   deviation note. The take needs a human ear.
6. **`skeptical` is a kit addition and no other scene uses it.** If it reads
   wrong at showrunner review the ladder is still available (B2, then A), but I
   would spend a still or two first: it is a subtle face by design and it does
   not photograph as strongly as it plays.

---
---

# BUILDER RUN 2 — DONE (scene-builder, 2026-08-05)

Items implemented: **T4, T6, T5b, T7b**, and the tweak round's closing gates.
Nothing outside those four was touched. **New total: 31,419 frames = 17:27.3**
(RUN 1 left 31,375 = 17:25.8; net **+44 frames**, all of it the new roll-call
clip — 4.212s against the retired "Hi! Hi! Hi! Hi!"'s 2.736s, minus three frames
from `rc_14_ray` and plus four from `a3_22b_red`).

## Gate results

| Gate | Result |
|---|---|
| `npm run narration -- --video sky-blue` | **3 clips synthesized**, exactly the three the brief authorised. Second run: **0**. |
| `npm run typecheck` | 0 errors |
| `npm run lint:hooks` | 0 findings |
| s20 range render, every frame, `--scale=0.25` (15308–16521) | **exit 0** |
| s23 range render, every frame, `--scale=0.25` (17796–18938) | **exit 0** |
| s29 range render, every frame, `--scale=0.25` (26791–27577) | **exit 0** |
| s34 range render, every frame, `--scale=0.25` (29898–31122) | **exit 0** |
| **FULL every-frame `--scale=0.25` render** | **exit 0** (hand-verified) — `Encoded 31419/31419`, 107 MB, 17:27.3 |

**FULL RENDER, hand-verified.** `npx remotion render src/index.ts RaySkyBlue
<out>.mp4 --scale=0.25`, every frame, no `--frames` window:

```
Encoded 31419/31419
FULL_EXIT=0
```

**31,419 frames = 17:27.3 at 30fps; 111,934,269 bytes (107 MB) at quarter
scale.** It ran after the last code change in this run, so it covers the final
tree — including the twenty always-mounted `Shard` bodies in Scene 23, which is
the only hook-count risk this run introduced and the only gate that can catch it.
(The four scene-range renders above were run before the roller-entrance fix and
are superseded by this one.)

**Synthesis, and there was nothing else.** MiniMax reported **105 characters
this run ≈ $0.01**. No clip was re-rolled: all three came back clean on the first
draw, measured before acceptance.

| key | engine | draws | duration | why |
|---|---|---|---|---|
| `a2_32b_blue` | minimax Decent_Boy/happy | 1 | 2.736 → **4.212s** | T4 — the new roll call |
| `rc_14_ray` | minimax Young_Knight/happy | 1 | 2.772 → **2.664s** | T5b — "the AIR does" → "the air does" |
| `a3_22b_red` | minimax Patient_Man/calm | 1 | 1.476 → **1.620s** | T7b — "Nice drama." → "Very dramatic." |

**Take measurements.** Method: the same MPEG-1 side-info `global_gain` probe RUN
1 used (no ffmpeg on this box, so no `silencedetect`); 576 samples/granule = 18ms
at these files' 32kHz. Thresholds quoted because the shape depends on them.

- **`a2_32b_blue`** — at threshold 120 the clip is **four clean runs**:
  0.198–1.098 / 1.242–2.142 / 2.304–3.042 / 3.204–4.086, i.e. one greeting each
  with 144–162ms between them, and at threshold 130 the fourth run splits at
  3.546–3.708 — **MiniMax read the ellipsis in "Hi... me!" as a real beat**. So
  the four bubble fractions are **0.047 / 0.295 / 0.547 / 0.761**, re-measured
  and written into `S20_HELLO_AT` with the method and the retired take's numbers
  beside them.
  **Quality verdict: KEEP, and it is not the draggy read.** Wall-clock is 0.53
  s/word, which is above the brief's 0.31–0.36 band — but the brief also says to
  judge the spoken portions, and this line has four deliberate silences plus an
  ellipsis in it. Speech-only it is **0.407 s/word and 0.326 s/syllable**, and
  0.326 is Blue's corpus median (his 38 MiniMax lines run 0.21–0.86 s/syllable,
  his eight-word lines 0.34–0.36). The names are the reason per-word is not the
  right meter here: "Bluington" is three syllables and "Hi" is one. The retired
  take was **0.684 s/word on four one-syllable words**, i.e. 0.684 s/syllable —
  twice this. No pause markers added; nothing needed fixing.
- **`rc_14_ray`** — 2.664s / 10 words = **0.266 s/word, 0.266 s/syllable**, which
  is the fast third of Ray's 57-line corpus and 0.011 faster than the old take.
  Four spoken runs at threshold 130, no detached onset. The old take was longer
  *because it was spelling a letter*.
- **`a3_22b_red`** — **single speech run 0.180–1.422s at threshold 130**, no
  detached pre-word blip. That matters: the shipped bad take was 0.180–0.252 then
  a dip then 0.270–1.404 — the epenthesis signature — and RUN 1's kept re-roll
  was 0.234–1.278. Accepted on onset shape, the same test RUN 1 used, because
  Red's corpus s/word band (0.42–1.04, two-word lines 0.65–0.76) is too wide to
  decide anything.

**Stills:** 40+ rendered and read, in
`/tmp/claude-1000/-home-mike-projects-video-generation/6d0bf85a-ed8c-47e4-95bd-f064f9bc68c7/scratchpad/tweak1_run2/`.
The ones to look at first are `T6_18500.png` (the painter's stroke, on Ray's
line — the acceptance-test frame), `T6_18910.png` (the button, sky finished) and
`t4_15792.png` (all four greetings up).

## T4 — s20 Blue roll call — DONE

- `narration.mjs`: `a2_32b_blue` → **"Hi, Bluington! Hi, Bluesworth! Hi, Bluey!
  Hi... me!"**, Mike's text and Mike's spelling, fields untouched (BLUE,
  `happy`, 1.05). The comment block now carries his note, the reason the fourth
  greeting is the joke, and the no-pause-markers decision with its evidence.
- `act2.tsx`: `S20_HELLO_AT` re-measured (see above, with the method and a
  do-not-use-the-old-numbers warning). `S20_HELLO` gains a `text` per mark, so
  the greeting and the place it stands are one object and a fifth greeting cannot
  be added without a place to put it. `BlueHellos` reads `corner.text`.
- **Marks unchanged.** All four boxes verified on frame with all four up: they
  occupy roughly x 482..1035 / 1185..1680 / 672..1122 / 312..690, and none of
  them touches another, the frame edge, Ray (whose bottom-right corner is still
  nobody's mark) or Violet. **No nudge was needed.** "Hi, Bluesworth!" wraps to
  two lines at the house `maxWidth` and is left wrapped — unwrapping it makes a
  ~720px box that comes within 60px of bubble one.
- Comments updated: `S20_BUBBLES`' "four Hi!s" note, the `S20_HELLO_AT` and
  `S20_HELLO` docs, the `BlueHellos` doc.
- `script.md`: Scene 20's PENDING block replaced by the fold (Mike's note 4
  verbatim, the new text, the new fractions with the retired ones marked
  unusable, the no-markers finding, the measured box extents). The old ear item
  is recorded as dead with its clip. Scene **10** gains a cross-reference:
  Mike is right that Ray's greeting is not a roll call, the scene is unchanged,
  and the real one is now in Scene 20.
- Stills: `t4_15682` (first pop), `t4_15716` (two), `t4_15748` (three),
  `t4_15776` / `t4_15792` (all four, accumulating, nothing colliding).

## T6 — s23 visual re-shoot — DONE

**Speech and timing are byte-identical.** `Video.tsx`'s `s23_sunny_wrong` entry
was not opened: eleven clips, five gaps, `tailFrames: 16`, all unchanged. The
scene is 1143 frames before and after.

**Deleted:** `WrongDiagram` (the whole component, ~150 lines), its `AIR_BAND`
constant, the 2.5× camera push and the `Camera`/`Cam`/`projectMark` imports that
existed only to serve it, and `rayVisible` (the fade that took Ray out of frame
for the two middle beats).

**Built, all of it line-keyed via `lineWindow`/`heldBeat`:**

| element | what it is |
|---|---|
| `S23_BEAM` + `SunnyBeam` | one warm beam from Sunny's body to (372, 671), tapering out just past the last puff so the light is *absorbed by the air*. Two pulses travel it — `a2_51` and inside `a2_54` — as a golden bulge, not a ball. |
| `S23_AIR` + `AirBand` | four puffs whose centres sit **exactly on the beam line** (y = 430 − 0.2203·(x − 1466)), plus a rolling spray of six short blue bounces per puff once the air is working. The `AIR_BAND` idiom at twenty times the size. |
| `S23_SKY` + `S23_STROKES` + `PaintedBand` | the upper-left sky, washed pale from the start, then painted by nine roller strokes that grow out of their own middles as a radial wavefront out of `S23_AIR_MID` reaches them — **bottom row first**, so the paint climbs away from the air. A second, brighter wave on the back half of `a2_54`. |
| `S23_COPIES` + `BluePaint` | twenty Blues, born round-robin at the four puffs, flying bowed paths with the Scene 20 `twinLeg` streak into a 5×4 grid over the sky, and staying. Nine of them go inside the first quarter of the window — the burst on Ray's line — and eleven trickle out behind Sunny while he takes the credit. |

**Four iterations, and what each still forced.** This is the part worth reading.

1. **First pass: the paint was invisible.** Nine vivid `SPECTRUM[4].fill` strokes
   over `sky_dome_day` read as a pale slab with a faint border, because the plate
   *is already a blue sky* and the paint was lighter than it. Blue on blue is a
   hue change, and a hue change at this size is not a change.
2. **Second pass: outlines helped, and the picture became a barcode.** A heavy
   `SPECTRUM[4].deep` outline made the strokes objects, but ±4° of tilt on
   ~1000px strokes drifts their ends by 70px and opened gaps the primer showed
   through. Tilt cut to ±1.4°.
3. **Third pass: the primer, and it is the fix.** The band is washed **pale**
   from the moment the air fades up and the paint restores the blue: **value, not
   hue**. A six-year-old reads pale→blue instantly. It is `kidTheme.skyLow` (the
   plate's own horizon colour), not `paper`, so it reads as haze and not as a
   cloud — there is a real cloud on the plate 200px below it to prove the
   difference.
4. **Fourth pass: three stacked ellipses drew three visible rims** and the
   washed patch read as a lens flare. Replaced with one `radialGradient`.

Also fixed on stills, and both were pre-existing: the **beam pulse was
invisible** (white-on-yellow; it is now a saturated `sunDark`/`sun`/`paper` bulge
rotated onto the beam's own angle), and **the roller did not slide in with the
man holding it** — `enter` is a prop on `Sunny` and the roller is a separate
element, so for the first twenty frames of the scene a paint roller sat alone in
the sky at his final mark. It now carries the same `slideRight` numbers
(damping 12, mass 0.7, 900px, `easeOutQuad(f/4)`), taken from
`entranceTransform` so the two cannot drift.

**Kept exactly as briefed:** Sunny at `S23_SUNNY`, Ray at `S23_RAY` with his 30f
"It lands on him" beat, the roller as a held prop (now raised trophy-style on the
brag, `zIndex` 23 → **25** because at the new mark his own spikes ate it), the
`RayFan` on "points" at 0.62 of `a2_50`, the grin growing through the `a2_49`
beat (`emotionAt` proud→excited untouched), all six `S23_BUBBLES` texts and
positions, and `S23_RED_WALK = false`.

**Two additions beyond the brief, both small and both defensible:** Sunny turns
to the **lens** from `a2_53` onward (he cannot be "ignoring the air" while
looking at it), and Ray's eye-line goes up-left to the sky he just credited from
his own line onward. Say the word and either comes out.

**Comments swept:** the `SunnyWrongScene` doc rewritten with the beat map, the
`S23_RAY` doc, the `S23_RED_WALK` argument (its arithmetic survives the
re-shoot; only its scenery nouns changed), `RedAcross`'s doc, Ray's bubble
placement note, and the `a2_52_ray` bubble note (which now records why the clip
is lowercase and the bubble is not). `script.md` Scene 23: REVISED banner with
Mike's note 6 verbatim, the staging spec replaced, a beat-map table added, the
held-beat table and **"THE RISK, WRITTEN DOWN"** untouched, and the four places
elsewhere in the file that still described the diagram (the 36f beat, the button
beat, the `a2_47` three-halves note twice, Scene 26's aside, the production
notes) corrected.

**Stills:** `T6_17800/17810/17825` (entrance + roller), `T6_18170` (the smug 45f
beat, alone in frame without a lens), `T6_18270` (grin grows), `T6_18360` (fan),
`T6_18401` (beam pulse), `T6_18500/18520/18545` (the stroke beginning, mid-sweep,
band full), `T6_18620` (poses harder), `T6_18700/18745` (beam pulse then
sky-sweep), `T6_18830/18910/18937` (settle, button, last frame), plus the
`t6a`–`t6h` iteration series.

## T5b — `rc_14_ray` — DONE

- Text → "So the blue sky is a thing the **air** does." Lowercase only; fields
  untouched. Re-synthesized.
- `recap.tsx`: the `rc_14_ray` bubble **keeps its capitals** ("The AIR does the
  blue!") — print, not pronunciation — and its comment, which quoted the clip
  with the old capitals and was therefore stale, now quotes the new text and
  records the rule.
- `script.md`: Scene 34 fold with the diagnosis and the pointer to the
  twenty-eight remaining all-caps MiniMax lines as a retro watch-list.

## T7b — `a3_22b_red` — DONE

- Text → **"Very dramatic."**, fields untouched (RED, `calm`, 0.9). One draw,
  clean onset (measured above). The comment records both failures and the ruling
  for a third: **re-cast, do not rewrite again.**
- `act3.tsx`: the bubble follows the words — and it carries **the episode's only
  deliberate line break**. `Bubbles` clamps `bx` to [400, WIDTH−400] and the
  SUNSET card's left edge is at x≈633; "Very dramatic." on one line is a ~575px
  box, i.e. 112..687, so the full stop landed under the "S" (verified on a
  still). Broken over two lines it is ~330px, 235..565, clear by 68px.
  `SpeechBubble` already lays out with `white-space: pre-wrap`. Moving it up
  instead does not work: `by` clamps at 170 and the bubble's bottom corner is
  still inside the card.
- `script.md`: Scene 29 fold with both of Mike's verdicts verbatim, the
  phrase-level diagnosis, and the bubble note.

## script.md final sweep

- **Counts:** header updated to **17:27.3 / 31,419 frames** with the arithmetic
  of every step from the delivered cut.
- **Ear list:** items 31–37 (the 2026-08-04 tweak-round additions) marked
  **CLEARED** on Mike's ear, with item 35 recorded as failed-and-rewritten and
  item 37 as covered by the two family screenings. **Three open items, and only
  three:** 38 `a2_32b_blue`, 39 `rc_14_ray`, 40 `a3_22b_red`, each with what to
  listen for and what to do if it fails.
- Scene sections folded: 10 (cross-reference), 20, 23, 29, 34.

## FLAGS for the showrunner

1. **The `a2_53_sunny` bubble sits on the painted sky.** "THE SKY IS MY LIGHT!"
   is at (880, 200) and the painted band runs x 70..1100, y 96..446, so the
   bubble covers its top-right quarter for 115 frames. I left it: the brief says
   keep the bubble positions unless a still shows a collision, the band's left
   half stays fully visible, and there is nowhere else for a bubble from a
   speaker who owns the right of the frame. If it bothers you at review, the
   cheapest fix is to shorten `S23_SKY.w` to ~900 rather than move the bubble.
2. **The primer is a licence, and you should look at it with that in mind.** For
   the twenty-one seconds before the paint arrives, the upper-left of the sky is
   visibly *paler than the rest of the sky*. It is the thing that makes the
   payoff legible and it is also, strictly, the episode saying a patch of real
   sky is not blue yet in a scene that is otherwise about a sky that already is.
   I judged the trade worth it because the alternative was an invisible payoff;
   it is the one deliberate untruth in the shot.
3. **`sky_dome_day` cannot show blue paint, and this will come up again.** Any
   future "the sky turns blue" beat on a blue plate needs either a primer like
   this one or a plate that is not already the answer. Worth a STYLE line at the
   retro: **paint the value, not the hue.**
4. **`Bubbles` clamps `bx` to [400, WIDTH−400] and `by` to [170, HEIGHT−280]**,
   which is not documented anywhere a scene author would look — I lost a still to
   it on T7b, and RUN 1's T9 note reads as though its author hit the same wall.
   Worth a sentence in the `Bubbles` doc comment. (I did not add it: `common.tsx`
   is not in my scope this run.)
5. **The s10 roll call is still not a roll call.** Mike's note 4 opened by saying
   so, and the fix he asked for was a *new* one in s20, which is what was built.
   If he meant s10 should change too, that is a fresh item and it is in act1.tsx.
6. **Twenty `Shard` bodies are mounted for all 1143 frames of s23** (opacity 0
   before they launch), because a varying element count is the one thing stills
   cannot catch. Cost is real but the full render is clean.
