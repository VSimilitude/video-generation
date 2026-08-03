# Ep 3 wave-3 — ACT THREE staging report (scene-builder, 2026-08-03)

The sunset race, staged. Contract: `revision2.md` §§ Scene 25, 27, 27b, 28,
28b, 28b2, 28c, 29. Script layer was already wired (169abe6); this batch is the
pictures.

**Gates:** `npm run typecheck` exit 0 · `npm run lint:hooks` 0 findings ·
every-frame `--scale=0.25` render of the whole act-3 span (frames
18,850–27,215 = s25 → s29, 8,366 frames), detached, artifact + log exit line
both verified. Logs and paths at the foot.

**Files changed (all paths absolute):**

- `/home/mike/projects/video_generation/src/videos/sky-blue/scenes/act3.tsx`
- `/home/mike/projects/video_generation/src/videos/sky-blue/scenes/s27b_start_line.tsx` (new)
- `/home/mike/projects/video_generation/src/videos/sky-blue/scenes/s28b2_two_walkers.tsx` (new)

**Not touched:** `common.tsx` (nothing was needed — every speaker, helper and
type the two new scenes use was already exported), `backgrounds.mjs` (no new
plate: the start line reuses `sky_dome_day` + Scene 28's warm wash so the hard
cut matches, and the two-walkers leg reuses `sea_sunset`), act1/act2/recap,
`src/lib`, `src/site`, narration.

---

## What was built, scene by scene

### s25 — Down at the sea, going orange

- **Green is already on the rock** from frame 0, sat, at a seat measured off
  the `Rock` prop rather than eyeballed (crest ≈ y 780, x 1427–1699 —
  arithmetic in the `S25_GREEN` doc comment). Bubbles for the four-line
  exchange (`a3_03b/c/d`, plus the shipped `a3_04`).
- **Blue's crash arrival**: he comes in over the water from up-left, hits the
  rock's left flank on the frame before his line opens, leaves a `PingRing` on
  it, and ricochets in a cupboard between Ray and the rock for the rest of the
  scene. Bubble `"First! Sorry, rock!"`.
- **Ray collects Green wordlessly on the exit** — played by Green (he unsticks
  and lifts after Ray) rather than by Ray, because there are only 14 frames of
  room. See CRAMPED #1.
- Ray's eye-line now runs through `faceAim` (a new local helper over
  `markCentre`) — Green for the exchange, Blue on the crash, Green again on the
  collect.

### s27 — The long way through

- Blue speaks (`speaking` wired) with two bubbles over his cupboard — "Done!
  First place!" / "Still counts!" — placed up-left, clear of Ray's.
- **Green added**, standing right of the observer, reading the course, with
  his own bubble; he sits the instant the long trip finishes arriving, which is
  his law applied to a diagram and costs one number.

### s27b — THE START LINE (new file, ~50s)

- Seven in spectrum order across the beam-head at 150px steps (red at the head,
  violet at the tail); **Sunny enormous at frame left with the beam coming out
  of his middle**; Ray ahead of the field.
- **Blue orbits Red** — two loops per line plus one inside the 16f approach gap
  — and **Indigo orbits a point one slot to his left, four frames late**.
- **Red walks straight through the assembled line without stopping**, 40px
  under it and drawn over the top, so he passes through the field with no frame
  where two bodies share a square. All seven are in frame in spectrum order at
  local ~555 (`w3_21222.png`), which is the picture the scene exists for.
- **Orange sets off after him from his own slot at exactly `RED_SPEED`** — not
  `orangeFollow`, deliberately: he starts 900px back and will never catch up,
  which is the want the finish line pays off.
- **Violet's warm-up**: toe-touches on a 26-frame cycle, the vibration stepping
  up through four discrete gears keyed to lines, both arms out for the 20f
  head-count beat, and no character ever looks at him. No bubble, no Speaker
  wiring, no line.
- **Green tries to sit** mid-air on his own line and finds nothing there.
- **Sunny sinks a notch and the beam tilts with him** before the gun; the field
  rides the tilt. On "SUNSET!" they launch — the file keeps its order and the
  gaps grow — then the 12f hold and the hard cut.

### s28 — leg one, high air (expanded)

- The 45f drain hold is now **empty of everybody's approach** (Blue's blend
  starts ON his line, not 10 frames early) and gains the field **stringing
  out** — `SPREAD_MAX` 1.10, ceilinged by arithmetic (any more and Violet is
  off the left of frame before his own exit).
- **Blue ricochets past Red backwards** under the file (36-frame sweep at
  ~19px/frame), Indigo does it four frames later automatically because the pass
  is folded into `blueLegs`, Orange answers the taunt for Red and looks at Red
  while doing it.
- **Blue's exit is now two stages**: a 96-frame bounce aimed at a SCREEN mark
  (`BLUE_TOP`), then an 86-frame climb out through the top. Both changes were
  forced by stills — see FIXES-FROM-STILLS #2 and #3.
- Indigo's climb runs 410 frames so he is **still rising through both of his
  own lines**; Violet exits in the 20f beat, silent, nothing else in it.
- `a3_13cc_blue` ("I just said that!", faint from high above) is a **second
  `<Bubbles>` at fontSize 34, top of frame, no tail, nobody under it** — see
  AUDIO note.
- Yellow looks up from Blue's exit onward and does not look back down; her
  three cheers all land on somebody who has already left.

### s28b — leg two, over the sea (expanded)

- Orange's play-by-play with two bubbles, mouth wired, never once looking at
  the man he is describing.
- Green's exit line "I found one." with his bubble re-placed **left of the
  boat** (it was sitting on top of him), the boat itself **re-anchored** so it
  is still in frame for his whole beat, and his settle staged as stillness
  (idle 0.25, `eyeLife` 0, eyes down) — see KIT GAP #1.
- **Yellow's descent re-timed to a 280-frame glide** (see CRAMPED #2), so she
  lands under her own line instead of nine seconds before it.
- The push-in is now keyed to Yellow instead of to frame 310, so the shot is
  still locked off for the whole eye beat.
- **The 45f volcano eye is untouched and verified**: `w3_24540.png` — one eye
  open, left eye's closed arc unmoved, nothing else in frame, Yellow waving on
  top, Green and the boat carried out of frame by the push before it starts.

### s28b2 — leg three, two walkers (new file, ~20s)

- Locked-off wide: Red and Orange crossing the frame at `RED_SPEED` one drawn
  body apart, Ray on the beam at frame right, **the decorated sky** (Blue,
  Indigo and Violet as streaks with small bodies at their heads), **Yellow
  rising out of the top with a tiny distant bubble**, **Green flat out on the
  boat below**, the island asleep on the horizon. Five of the seven in one
  frame and nothing taken away.
- The 45f hold sits on that picture with nothing entering it (`w3_25000.png`).
- Ray waves after a Yellow who has already left the frame — the same free joke
  as Scene 28's first goodbye.

### s28c — the finish (expanded, and this one grew a shot)

- **Three shots now.** Corridor+eye (unchanged) → *the finish, closer* (new) →
  the shipped wide landing block (unchanged: same `wideFrom`, same `walkFrom`,
  same path, same beam-end, same volcano, same four holds). The middle shot
  exists because the finish fits in neither of the other two — full arithmetic
  in the `S28C_FINISH_DISSOLVE` doc comment.
- In it: Red walks out of the end of the beam on "Red! You won!", "Won what."
  lands 16 frames later, Orange's climax comes from one body behind, and
  neither of them looks at the other. Ray watches from frame right.
- Red never speeds up, Orange never overtakes, and the landing block's
  36/30/45/20 holds are byte-identical to the shipped ones.

### s29 — Big Word Three

- `a3_22b_red` "Nice drama." on the existing walk-behind, dressed red, in the
  only clear air in the frame (left of the "Sun" block, above the waterline),
  tail reaching back at the piece of him showing between the two syllables.
  Placed at x=390 after a still caught the card eating it at x=470.

---

## Kit gaps hit, and the workaround used in each (no silent ones)

1. **No lid control on `<Shard>`.** revision2 asks for Green's "eyes closing"
   at `a3_14fb_green`. `lidBase` lives inside the rig's emotion record and
   nothing exposes it. Staged as stillness instead (sit + idle 0.25 +
   `eyeLife={0}` + eyes down). Wanted: `lids?: number` on `Shard`/`RayShard`.
2. **`Bubbles` takes one `fontSize` for the whole map**, so a bubble at a
   different size is a second `<Bubbles>` element with its own cast. Done twice
   this batch (Blue's faint line, Yellow's distant one). Wanted: per-line
   `size` in the `at` override.
3. **Bottom-edge-only tails.** Every bubble whose speaker is *above* it points
   its tail at the floor. Worked around by always placing the bubble above and
   to one side of the speaker; it is unavoidable for Blue's `a3_13bb` (he
   climbs past his own bubble mid-line) and for Yellow's `a3_14j`. Wanted: the
   `SpeechBubble` top-edge tail already on the cleanup list (D-a1_49).
4. **`<Shard>` pose is hardcoded** (`wave` only for Yellow). Violet's warm-up
   is therefore all amplitude + vertical bobs + `arms` — which is the right
   answer here (a raised arm is Yellow's) and is the act1 Scene 10 precedent,
   but a `pose="crouch"` would have made the racer's-set read better.
5. **`blueTrail` samples `blueRicochet` directly**, so a scene that blends
   another path into Blue's motion gets a trail that is not on the path he is
   on. Written around with a local `blueTrailAt` that samples the scene's own
   `blueLegs`. Wanted: `blueTrail(pathFn, frame)`.
6. **`SleepingVolcano`/`Sailboat` live in act3.tsx**, so the new
   `s28b2_two_walkers.tsx` imports them from an act file that imports it back —
   a deliberate ES-module cycle, safe only because nothing in the new file
   touches an act3 binding at module scope. Documented in both files. The
   promotion to `src/lib/kid/props.tsx` remains the cleanup list's headline and
   would delete the cycle.
7. **`beats()` does not exist** (the brief names it). Used `lineWindow` /
   `heldBeat` / fractions of the real clip everywhere instead, which is what
   the act files already do.

## Spec deviations — showrunner calls needed

- **D1 · `a3_11u_red` "(half off frame)" is a bubble with nobody under it.**
  Red is on screen from local 297 (Blue orbits him) and the line lands at local
  1388: 36 seconds, 3,927px at `RED_SPEED`, a little over two frame widths.
  There is no staging that keeps one 108px/s body on screen at both ends, and a
  camera that tracks him drags Sunny and the six off frame left. `RED_SPEED` is
  not the thing that gives (ruling R9 cut a whole walk-through rather than raise
  it), so the line lands the way `a3_13b_blue`'s already does: bubble at the
  right-hand edge, tail pointing off frame after him. Same gag, third firing
  this episode. Argument is written on the constant in `s27b_start_line.tsx`.
- **D2 · the volcano appears in s28b2**, which is not on script.md's list
  ("25, 28b, 28c, 29, 31 and 35 and in no other frame") — a list written before
  this scene existed. It is drawn at `VOLCANO_AT.x` on the measured horizon,
  continuous, unmentioned. The alternative makes it blink out for twenty
  seconds between two shots that both have it, which is the exact failure the
  rule's *other* clause forbids. Ratify or reverse.
- **D3 · s28c is three shots, not two.** The shipped landing block is
  unchanged; the new middle shot carries the finish. Rationale above and in the
  file. The one visible consequence: Red is further along in the closer shot
  than in the wider one it dissolves to — which is what a dissolve to a wider
  vantage means, and the two framings are unmistakably different sizes.
- **D4 · Ray is in the s28c finish shot.** He speaks in it, so he has to be.
  He is *not* in the landing block, which is unchanged.

## Cramped timing — for the showrunner, not fixed here

1. **s25 `a3_05c_ray` trailing gap (12f + 14f tail = 26 frames).** "Ray
   collects Green wordlessly on the way out" has to happen inside it, and the
   first 12 are a deadpan hold that nothing may enter. Green's lift therefore
   gets 14 frames. At ~45 it would read as *collected*; at 14 it reads as
   "Green got up". Ask: +30f on that trailing gap.
2. **s28b Yellow's landing.** Everybody on that beam walks at `RED_SPEED` and
   leaves frame right around local 400; `a3_14h_yellow` lands at 599. Solved
   by giving her a 280-frame glide off the beam (it looks good — she is the
   only thing still moving in an emptying frame), but it is a workaround for a
   leg that is now 28s long with a 11s-wide frame. If the showrunner wants her
   *on the beam* until she peels off, the scene needs a scrolling world like
   Scene 28's tracking camera, which is a re-build rather than a tweak.
3. **`a3_14eb_orange` is 4.50s (135f)** — the longest colour line in the
   episode and it is a flat three-clause recap over a walk. It plays fine but
   it is the one line in the act where the picture has nothing new in it for
   four and a half seconds. Flagged as the brief asked; no change made.
4. **`a3_11c_narrator` is 5.03s (151f)** over a static line-up. Covered by
   Violet's warm-up starting under it and Red walking in at local 194, but the
   first 190 frames are the six of them holding a pose.
5. **s28 `a3_13bb_blue` (3.03s)** outlives Blue's exit from the top of frame by
   ~37 frames by construction; he is visible for the first two thirds. Kept
   deliberately (the bubble with nobody under it is the shape of the joke), but
   if it should be fully "on him", the line wants to be ~2s or the climb wants
   another 40 frames.

## Fixes the stills caught (kept for the retro)

1. s25: Green's collect lift walked him into Blue's ricochet box — two of the
   seven in one square. Lift re-aimed up rather than across.
2. s28: Blue's exit arc was solved in *world* space inside a tracking camera,
   so he left through the **left edge** under a bubble that says he is going
   UP, and was gone before he said it. Now aimed at a screen mark, like the
   other two leavers.
3. s28: with him visible, the shipped `a3_13b_blue` bubble at (560, 180) then
   sat **on top of him**. Fixed by lowering the top of his bounce to (330,
   286) — under the bubble's tail — rather than by moving a placement that
   three waves have already reviewed.
4. s28: Blue's backwards taunt originally ran along the top of the beam, which
   is Ray's lane: a still had Blue on Ray's face with the taunt's tail pointing
   at the pair of them, i.e. the frame read as *Ray* calling Red slow. Moved
   under the file.
5. s28: the taunt's blend started 10 frames early, i.e. inside the sacred 45f
   drain hold. Now starts on the line.
6. s28b: the boat had scrolled off frame before Green's new second line —
   "I found one." over empty water with the tail pointing at nothing.
7. s28b: Green's bubbles were centred on the boat, hiding the character behind
   his own line, twice.
8. s29: the SUNSET card (zIndex 50) ate the right third of "Nice drama."
   (bubbles are 40).
9. s28b2: Yellow was a pair of feet at the top edge for the whole of her only
   line; the rise is now 150 frames.
10. s27b: Indigo braided onto Blue left a hole in the line-up where indigo
    should be — a six-body "line of seven". He now holds his own slot and does
    Blue's moves from it.

## Watch-items inherited and left alone

- **R4** (act3.tsx): the pack's `travel` saturates at `a3_14_narrator`, so Red
  stands ~350f during the goodbye. Unchanged by this batch and the documented
  fix is still a re-time.
- Violet's exit arc passes within ~64px of Indigo's parked sky mark for a few
  frames around local 1057. Both are identifiable (different hue, different
  size); noted rather than nudged, because both marks were placed against Ray's
  bubble box in wave 2.

## Stills

103 stills, all rendered from the final tree **after** the last code edit
(`scratchpad/w3act3/` was emptied first, so nothing in it is stale), at
`--scale=0.5`, prefix `w3_<absolute frame>`.

The riskiest ten:

| still | why |
|---|---|
| `/home/mike/projects/video_generation/scratchpad/w3act3/w3_21222.png` | all seven in spectrum order, Red walking through the line-up |
| `…/w3_22440.png` | Blue's backwards taunt under the file, Ray clear, tail correct |
| `…/w3_22740.png` | Blue mid-bounce directly under his own bubble's tail |
| `…/w3_22800.png` | Blue climbing out of the top on "Winning UPWARDS!" |
| `…/w3_23090.png` | the faint tiny bubble, top of frame, nobody under it |
| `…/w3_23180.png` | Violet's silent exit beat — empty of everything else |
| `…/w3_24540.png` | the 45f volcano eye, open, alone |
| `…/w3_25000.png` | the s28b2 45f hold: "nobody loses" as one picture |
| `…/w3_25545.png` | Red walking out of the beam-end on "Red! You won!" |
| `…/w3_25930.png` | the finish→landing-block dissolve (two framings crossing) |

## Gate results

- `npm run typecheck` — exit 0.
- `node scripts/hookscan.mjs` — `--- 0 finding(s) ---`.
- `npx remotion render RaySkyBlue /tmp/w3act3_validate.mp4 --scale=0.25
  --frames=18850-27215` — detached under `nohup`, log at
  `/tmp/w3act3_render.log`, artifact at `/tmp/w3act3_validate.mp4`. Verified by
  the artifact existing **and** the log's own `RENDER_EXIT=` line, never by a
  notification (house rule after the two traps in the wave-2 retro).

---

# APPENDIX — showrunner fix round (2026-08-03)

A second scene-builder pass, scoped to exactly five staging fixes and two
showrunner-authorised re-times. Nothing else was restaged, refactored or
"improved"; the files touched are the same three scene files, `Video.tsx` (the
two script numbers only) and this appendix.

**Gates:** `npm run typecheck` exit 0 · `npm run lint:hooks` `--- 0 finding(s) ---`
· two detached every-frame `--scale=0.25` renders, both verified by the mp4
artifact **and** the log's own `RENDER_EXIT=` line. Details at the foot.

**New total: 31,281 frames** (was 31,225; +56 = RT-1's +26 and RT-2's +30).
Every absolute frame number from s27 onwards has moved +26, and everything
after `a3_14o_orange` in s28b2 a further +30. The wave-3 stills in
`scratchpad/w3act3/` are therefore stale as *frame numbers*; the fresh ones are
in `scratchpad/w3act3fix/`, named by their new absolute frame.

## The five fixes

### 1 · s28 `a3_13a_blue` "Too slow! Sorry!" — bubble moved 1180 → 600

The tail was aimed at Blue already; the bubble was the problem. On the right it
ran 860…1500, so `SpeechBubble`'s tail clamp could only travel 900…1460 — and
Blue spends all but the first second of that line at x < 700 (first sweeping
backwards through the file, then ricocheting in his box at screen 290…610). The
tail therefore sat pinned at its own left-hand stop for the whole line with
**Ray's glow at (1050, 420) the nearest bright thing under it**, which is the
exact misread the first pass at y≈240 was moved up to avoid. Raising it could
not fix a horizontal clamp; moving it could.

At x=600 the bubble runs 280…920 and the tail travels 320…880, which *contains*
Blue's whole ricochet box and most of his backwards sweep. The aim is his own
body x (his face rides his body — there is no offset to add at this scale), and
Ray is now 450px away on the other side of the frame. The one stretch where the
tail still clamps is the first ~20 frames, while Blue is out at 1160 finishing
the pass — and it clamps *towards* him, with his own trail streak making him the
most findable thing in the frame. `RaySkyBlue_022455/022470/022490/022520/022545`.

### 2 · s28 `a3_13cc_blue` "I just said that!" — tiny, and out of the middle

`FAR_BUBBLE` 34/420 → **24/250**, and the placement moved from (960, 176) — dead
centre at the top of frame, i.e. where a *title* goes — to `blueNow.x` at y=172,
which is **Blue's own exit column**, jammed against the top edge beside the
small parked body up there. It is now unmistakably a different order of object
rather than a normal bubble parked somewhere odd.

**It keeps `tail: "none"`, and that is a deliberate refusal of the brief's
"an imperfect tail beats detached placement".** The kit's tail leaves the
bubble's *bottom* edge (D-a1_49). The only body anywhere near the top-left
corner on that frame is **INDIGO**, parked on his sky mark at (300, 300) and
still climbing — Blue is hundreds of pixels above the picture. A tail would
point down at Indigo, so the frame would read as Indigo saying Blue's
catchphrase: not an imperfect tail, the wrong speaker, in the one scene built on
two adjacent blues saying the same words four frames apart. Size and position do
the attaching. `RaySkyBlue_023100/023116/023128`.

**Flag for the showrunner:** the small body beside the bubble is Indigo, not
Blue. If the adjacency is being read as attribution, the alternative is to move
the bubble to the top-RIGHT corner (nobody there, but it stops pointing the way
he went), and the real fix is the top-edge tail on the cleanup list.

### 3 · s28b2 — NOT REPRODUCIBLE AS DESCRIBED; see below

The brief reads: "Red and Orange walk in mid-air ~350px right of where the beam
trail ends (see w3_22440… w3_25000.png)". **That is not what s28b2 draws, on
w3_25000 or on any other frame of the scene.** Evidence, all measured rather
than eyeballed:

- The beam is one `WideLayer` rect pair from x=−1400 to x=3200 at `BEAM_Y`=470.
  It has no end anywhere near the frame: it runs edge to edge on every frame of
  the shot. A 9× crop of `w3_25000` at both frame edges shows continuous beam.
- The two walkers straddle it correctly on every frame: `hover()` puts their
  middles on `BEAM_Y`, and their bodies are drawn over the band. Checked at
  local 0/109/219/329/439/549/586 (a fresh sweep of the whole shot) plus the
  three archive stills.
- Also checked at `--scale=0.25`, the review render's own scale, in case the
  beam was disappearing at review size. It does not.

**What does match the description exactly is s28c's landing block** —
`w3_25930` and `w3_26100`, where the two walkers are at frame right with a
red-orange beam stub ending far to their left. And in those frames there were
**two** beam stubs and a Ray who is not supposed to be in the shot at all,
because of a real bug found while doing fix 4 (see below). Best guess: the note
was written against one of those and filed under the wrong scene.

**What was done anyway, because the order's goal is legible on its own terms**
("make the two walkers read as walking the beam's remaining red-orange end"):
the s28b2 beam was two flat rects — red at 0.6 and a pale core — over a painted
sunset whose plate is itself a stack of horizontal orange bands, so it read as
one more stripe in the sky rather than as the thing they are walking. It now
gets a wide soft halo (nothing in the plate has a halo, so it stops being one of
the plate's stripes and becomes a light source), a second **orange** band inside
the red one (the scene's own sentence is "red and orange only" and it was drawn
in one hue), and a core at 0.8. **No geometry moved** — the walkers' y, the
beam's y and its band-to-body proportion are identical, so it stays continuous
with 28b's beam on one side and the corridor on the other.
`RaySkyBlue_024700/024810/024900/024990/025010/025040/025070/025120/025180/025213`.

**Open for the showrunner:** if the note really was about s28b2 geometry, the
change being asked for is a *travelling beam head* (Scene 28's `BeamTrail`
idiom, `x1 = packX + 90`). It costs the first ~70 frames of the shot their beam
entirely — Red starts at x=−260, so the head starts off frame left — and it
contradicts 28b, which draws the same beam edge to edge one scene earlier. Not
done unilaterally.

### 4 · s28c — the finish → wide join is now a HARD CUT

`wideEase` is `frame >= wideFrom ? 1 : 0`; `S28C_LAST_DISSOLVE` is deleted. The
corridor → finish dissolve is untouched (those two framings agree about where
Red is; the wide one does not, which is what made the cross-fade slide him
backwards). All three shots are otherwise exactly as built — same `wideFrom`,
same `walkFrom`, same paths, same beam-end, same volcano, same 36/30/45/20
holds. `RaySkyBlue_025955/025963/025964/025970/026000`.

**BUG FOUND AND FIXED IN THE SAME PLACE — and it was in the shipped landing
block.** Each of the three shots is a `<div style={{opacity}}>`, and **`opacity:
1` does not create a stacking context** (only a value below 1 does). So the
moment a shot's fade completed, its children's z-indices escaped into the
scene's root context and competed with the next shot's. `w3_26100` caught it:
the wide, empty, deliberately Ray-less landing block was carrying **the finish
shot's beam** (`zIndex 9`, a second red-orange stub ending 300px from the real
one) **and the finish shot's Ray** (`zIndex 40`, at `S28C_FINISH_RAY`) painted
on top of its plate. Fixed with `isolation: "isolate"` on all three shot
wrappers, which keeps every z-index local to the shot that owns it and leaves
the ordering between shots to DOM order. Nothing about the dissolves changes — a
shot mid-fade was already its own stacking context. Before/after:
`scratchpad/w3act3/w3_26100.png` vs `scratchpad/w3act3fix/RaySkyBlue_026126.png`.

**Consequence of the cut, for the showrunner's eye:** the wide shot's Red enters
at x=−140 and takes ~39 frames to walk into frame, so the cut now lands on ~39
frames of empty orange sky, volcano and beam-end under "At the end of all that
air…" before he walks out of the beam. The dissolve used to cover that with the
outgoing finish shot. It reads as the shot the wide is described as; it is a
change the cut caused and it was not separately authorised.

### 5 · s27b `a3_11i_orange` "He said no." — confirmed misaimed, fixed

It had **no `at` override at all**, so it took the default: bubble at
`orange.x − 330` = 820, tail parked at its own right-hand corner ≈ x=1000 — i.e.
**on Yellow**, two slots up the line from the man speaking, with Green under the
other end of it. In a seven-body line-up at 150px of step the tail is the only
attribution there is.

Bubble pushed to x=1000 so the tail's clamped travel (≈812…1188) *contains*
Orange's slot at `slotX(1)`=1150 instead of stopping 150px short, aimed at
`orangeMark.x`, `y` left at the default `bubbleAbove`. Measured after: the tail
point lands at composition x≈1150 against Orange's face at 1148, with Yellow
(1007) and Red (1257) both clear. `RaySkyBlue_021225/021238/021248`.

**New shared constant, `TAIL_TIP_DX` = 52 (s27b file, local).** `tailAt`
positions the *centre* of `SpeechBubble`'s 104px tail box and the drawn point is
at one end of it, so a right-hand tail lands its point half a box to the right
of the anchor. Everywhere else in the act the bubble is 300–400px above its
speaker and the eye reads the tail's direction, so it does not matter; here the
bubble hangs 55px over a line-up whose bodies are 150px apart, and uncorrected
the point landed in the daylight between Orange and Red. **Kit gap:** `tailAt`
should mean "put the point here", which would delete this constant.

## Showrunner re-times

### RT-1 · s25 `tailFrames` 14 → 40

For the wordless Green collect (CRAMPED #1). `Video.tsx` only.
`RaySkyBlue_019795/019810/019825/019842`.

**Flag, and it needs a call.** The lift itself is `clamp01((frame -
collectFrom) / GREEN_SIT_FRAMES)` and **`GREEN_SIT_FRAMES` is 5** — the shared
reflex constant every sit in the episode uses. So the beat is now 12f deadpan
hold + **5f snap-lift** + 35f hold on the collected picture, not a 40-frame
collect. It does buy the thing the note was after (the scene no longer cuts on
the frame he moves; Ray and Green now hold together over the water while Ray
drifts and Blue ricochets), but if what was wanted is a *slower lift* — "at ~45
it would read as collected" — that is a second change: a scene-local
`COLLECT_FRAMES` in act3.tsx replacing `GREEN_SIT_FRAMES` at that one call site.
Not done; it is staging, and it was not in the fix list.

### RT-2 · s28b2 `a3_14o_orange` gap 45 → 75

The breathing leg's held beat. `Video.tsx` only. Nothing enters it: two colours
walking at one speed, an island snoring, a boat not moving and three streaks
that are now weather. `RaySkyBlue_025010/025040/025070`. The trim menu's
"45f → 30f here" entry is now a 75f → 30f entry and is the first place to look
if the episode ever needs a second back.

## Gate results (fix round)

- `npm run typecheck` — exit 0.
- `npm run lint:hooks` — `--- 0 finding(s) ---`.
- **s25 alone**, frames 18850–19843 (994):
  `npx remotion render RaySkyBlue /tmp/w3fix_s25.mp4 --scale=0.25
  --frames=18850-19843`, detached under `nohup`. Log `/tmp/w3fix_s25.log`,
  `RENDER_EXIT=0`, artifact `/tmp/w3fix_s25.mp4` (2.8 MB).
- **s27b → s28c**, frames 20693–26487 (5,795):
  `npx remotion render RaySkyBlue /tmp/w3fix_s27b_s28c.mp4 --scale=0.25
  --frames=20693-26487`, detached under `nohup`. Log
  `/tmp/w3fix_s27b_s28c.log`, `RENDER_EXIT=0`, artifact
  `/tmp/w3fix_s27b_s28c.mp4`.
- 32 fresh stills in `scratchpad/w3act3fix/`, every one of them with an mtime
  later than the mtime of every file it depends on (the three s27b frames were
  re-shot after the `TAIL_TIP_DX` edit). Named `RaySkyBlue_<new absolute
  frame>.png`.
