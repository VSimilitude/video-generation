# Ep 3 wave-3 — ACTS ONE & TWO + RECAP staging report (scene-builder, 2026-08-03)

The comedy rewrite's Acts One and Two, staged. Contract: `revision2.md`
§§ Scene 5, 9, 10, 11, 13, 15, 17, 18, 19, 20, 21, 22, 32. The script layer was
already wired (302 clips, 31,281 frames); this batch is the pictures.

**Files changed (all paths absolute):**

- `/home/mike/projects/video_generation/src/videos/sky-blue/scenes/act1.tsx`
- `/home/mike/projects/video_generation/src/videos/sky-blue/scenes/act2.tsx`
- `/home/mike/projects/video_generation/src/videos/sky-blue/scenes/recap.tsx`
- `/home/mike/projects/video_generation/src/videos/sky-blue/wave3-act12-report.md` (this file)

**Not touched:** `scenes/common.tsx` — the brief allowed additive wiring and
**none was needed**: every speaker, helper, law and type these thirteen scenes
use was already exported. `act3.tsx`, `s27b_start_line.tsx`,
`s28b2_two_walkers.tsx`, `Video.tsx`, `src/lib/`, `src/site/`, narration and
backgrounds are all zero-diff.

---

## What was built, scene by scene

### s5 — Are we there yet (the interrupted sixth firing)

- `a1_16c_ray` gets the bubble **"Are we—"** at `S5_BUBBLE_AT`, i.e. **the same
  five numbers the other five firings use** (same x, same y, same tail, same
  `tailAt`). Nothing else in the scene moves. The picture must not telegraph
  that this firing is different; the ear finds that out a fifth of a second
  later, and that is the joke's timing.
- Em-dash rather than an ellipsis, written into the file: an ellipsis is a
  sentence trailing off, this is a sentence being taken away from him.
- **The Narrator's "No." has no bubble and cannot get one** — she is off-stage
  with no mark, so `Bubbles` would skip the key anyway. Written down at the call
  site so the next reader does not "fix" it.
- The scene's two doc comments were corrected to the revision2 numbers
  (45/75/105/135, the 90f unanswered hold, the sixth firing inheriting the cut).

### s9 — Seven pieces (the victory lap + the identity dispute)

- **Blue laps the whole arc** on `arcPoint` with a lifted ellipse, both ends,
  and comes back onto his own slot exactly (`lapU` + `lapPoint`). Three legs
  with two corners in them — bolt to the violet end, cruise the long leg, pull
  up on his mark — because a lap drawn as one smooth curve is a float.
- The lap has a **drawn trail**, sampled off the lap path itself, so the elbow
  in the blur is a corner he actually turned. It is the one place in Act One a
  `blueTrail`-shaped blur is legible (the legs are hundreds of pixels).
- After the lap he **does not rejoin the line**: he parks up and left of his
  slot (`S9_BLUE_PERCH`) with the kit ricochet running, which is what leaves the
  hole **Indigo leans into** for "I was first." Indigo goes 62% of the way, not
  all of it, so the seven-body line-up does not grow a gap (the s27b lesson, in
  miniature).
- **The indignant pose** is a full `SHARD_LEAN` lean-back (heading −90°) plus a
  rise and a `grumpy` face; Blue reaches it four frames before his last line
  ends and **Indigo reaches it four frames after Blue does**, which puts the copy
  landing inside the trailing 16f beat. Both hold to the cut: the scene's last
  picture is two blobs wearing one grievance.
- Five bubbles, all summaries; Ray's answer uses **the same centre-top, tail-less
  placement his other two lines in this scene use**, because there is no one body
  to point at — there are seven.
- The 60f reveal hold, the fan, and the one-at-a-time wake-up stagger are
  byte-untouched.

### s10 — The roll call (the volley)

The sacred shape is intact: `a1_42_ray` at 0.88 with the seven silent movement
reactions, the 20f frozen-poses hold, then the volley, then the flat narrator
line → 24f → the unbothered button, with **nothing between `a1_43` and `a1_44`**.

- **Yellow** waves at full amplitude again for her own line and **looks at
  Violet** from the frame she says his name.
- **Violet freezes** — his vibration drops to 0.14 for six frames, the only time
  in the episode it does anything but run flat out — and comes back at **double
  amplitude** with both arms up, decaying over `a1_43` so the shape's flat line
  closes on a flat frame. 0.14 rather than 0 because "no frame of this episode
  has Violet crisp" is a kit law; at a fourteenth of his amplitude the eye reads
  it as a stop anyway.
- **Green stands up to announce that he is going to sit down**, and sits on the
  back half of his own line. Both directions use `GREEN_SIT_FRAMES`.
- **Blue answers from the wrong side of frame** (`S10_BLUE_AWAY`, the far upper
  left) and is home again long before the button. His transit bows over the top
  of the line and his box shrinks 45% while he is over there — both forced by
  stills, see FIXES #2/#3.
- **Red's 16f non-reply is marked by an eye-line and nothing else**: Ray aims at
  Red for the whole gap and there is deliberately no code on Red's side.
- **Ray looks into the camera for the whole Orange exchange** and breaks back to
  the seven on "Ahem.", before `a1_43`. His face goes `neutral`, not `grumpy` —
  this show's deadpan is stillness, and an annoyed Ray would be the show taking a
  side against Orange, who is not being funny on purpose. Dropping the smile in
  front of a straight lens is the whole reaction.
- Ray's face moved from `useEmotion` to `emotionAt` because the change hangs on
  somebody else's line. Outside the new window it reproduces the shipped map
  exactly (`happy` → `excited` at `a1_42_ray`, nothing mapped to `a1_44`, 4-frame
  morphs).
- "Ahem." and "Red did not say anything." get **no bubbles** — off-stage voice is
  what makes them the room's commentary rather than a character's.

### s11 — Big Word One

See CRAMPED #1: the script layer puts all three new lines **before** the card
exists. Staged as the best available version, with both jokes kept:

- **Green says his chain firing sat on the arc**, where he has been sitting since
  Scene 10 — which also closes a continuity seam (this scene used to open with
  him standing one frame after Scene 10 ended with him sat). He is then hauled
  off to the "n" and sits again the instant he lands: shipped choreography
  untouched.
- **Blue leaves the arc early, flies at Drip and bounces off her twice on his own
  line** (`earlyBlue`), then ricochets in a cupboard beside her and is home
  before the general take-off finds him. The shipped R8 double-bounce still
  fires, so he hits her **four** times in the scene. Drip rings on all four.
- He is drawn at `S11_EARLY_SCALE` (0.42) up there rather than the arc's 0.9 —
  Drip's own drawn size, which is what makes the two of them a two-shot.
- Drip watches him through the exchange and turns to Ray, deadpan, on
  "He is very you."
- Perches, Violet on the W, card timing, chant and the two 12f beats: untouched.

### s13 — Not the plain one

- **Green is drawn separately from the other six** and joins the merge last.
  `SevenArc`'s `alpha(3)` returns 0; a standalone `<Shard who="green">` carries
  him. The merge itself is untouched — same start frame, same `mergeAt`, Ray
  still at full opacity before `a1_55_ray`.
- The lift is a **5-frame snap** (`GREEN_SIT_FRAMES`, the shared reflex constant,
  run backwards) and then a hold — the act-3 collect precedent. A slow lift reads
  as Green standing up, and the whole complaint is that he did not.
- He shrinks and fades into Ray six frames after his own line stops, which is
  the joke: he is the one being dragged.

### s15 — Myth-bust one

- **Blue is in the postcard**, in a cupboard over the water right of the arrows,
  for "Twins!" — and he **pings out of the top of frame on his last word**, so
  the 30f stamp hold and the desert counter-example are as empty as they shipped.
- He comes back down for the Copy-me pair on the grey day, with **Indigo under
  and behind him**, smaller and fainter.
- The 20f trailing beat is Blue looking at the copy of himself and deciding to be
  pleased. MYTH stamp, crack, arrows and both plates untouched.
- Every visiting colour in Act Two arrives from above and leaves upward through
  one shared constant (`VISIT_LIFT`) — the physics-honesty note applied to
  staging: a colour is never removed from a frame.

### s17 — The sky is not empty

- **"Deep in the crowd" is a scale, not a position.** `AirCrowd` is a depth field
  pushed out from the lens, so a character inside it starts small at the middle
  and gets bigger on his way out. Blue surfaces from `S17_BLUE_DEEP` 0.10 to
  0.72; **Indigo from shallower** (0.26 → 0.50), a bigger start and a shorter
  trip, still drawn smaller because the faded-copy rule outranks the depth.
- Both are drawn **in front of the crowd and behind Puff and Ray**, which is what
  "out of the crowd" means when the crowd is a depth field.
- The 16f beat is one expression: Blue goes `grumpy` on its first frame and back
  to `happy` eleven frames later. Nothing else enters; the crowd churns because
  the crowd always churns.
- They sink back into it under `a2_21_narrator` — the Narrator's line closes over
  them as if nothing had happened.

### s18 — Red goes straight through

- **Orange's two bubbles travel with him at `RED_SPEED` and sit lower than
  Red's** (y 430 against 306) — one body behind and one line under, which is the
  whole man. They are never up at the same time as Red's and never in the same
  place, so a paused frame says which of the two spoke.
- He **looks at the man he is describing** for the first firing only, and for
  nothing else. Act three's s28b has him never once looking at Red; this is the
  firing that earns that.
- **Yellow arrives at the right frame edge, half out of it, waving after a Red
  who left four hundred pixels ago.** That is not a staging problem, it is the
  joke and the same one act three tells three more times. Red does not react.
- Puff's reach-miss-shrug, the 30f walk beat and the 20f deadpan hold: untouched,
  and there is still no code keyed to that window.

### s19 — Blue goes everywhere

- The echo argument is **bubble ping-pong**: Blue right, Indigo left, twice,
  dropping a row each exchange (`S19_ARGUE`). A tail alone cannot carry
  attribution when both speakers are ricocheting through the same corridor; the
  fixed sides plus the coloured dressing can.
- **His FACE gives up on the 20f hold and nothing else does.** He keeps
  ricocheting — the law, and stopping him would be a second event inside a beat
  the script says is empty. What enters is one expression on a body already in
  the frame doing what it was doing.
- The 45f pinball hold, the three-corner bubbles on `a2_28b_blue`, the mesh ramp
  and the spray: untouched.

### s20 — Blue, from every direction

- **`a2_32b_blue` is one clip and four bubbles**, popping in sequence around the
  frame at **0.069 / 0.332 / 0.574 / 0.812 of the clip** — measured, not guessed
  (see MEASUREMENT below), and expressed as fractions so a re-roll re-times all
  four for free. They accumulate, so by the fourth all four are up at once, which
  is "from ALL of the sky" drawn.
- **Violet now comes up on Yellow's line, not on Ray's.** She points at him, so
  he has to be in the frame to be pointed at — and Ray's "Hold on…" becomes a
  reaction to her rather than a discovery, which is exactly what the revision
  says it is for ("Ray is now the only one who listened to Yellow").
- **He bounces 45% harder while cheered**, and nobody looks.
- Yellow arrives **on her own line** (the 36f dome hold in front of it is empty
  and stays empty) and is gone before the droop beat.
- The droop, the eye-line rule, "Sorry, Violet." and the fact that nothing
  follows it: untouched. Verified on `RaySkyBlue_016130`.

### s21 — Big Word Two

- Bubbles for the claim, the copy and the pedant's correction, in the band
  between the card (which owns y 190..410 at z-index 50) and the ricochet box.
- **One extra throw, on the line**: a victory hurl at a word that is already
  finished, with Indigo's late miss landing on the first frame of Indigo's own
  line fourteen frames behind it — which is arithmetic `ScatterThrows` already
  does. See CRAMPED #2 for why "mid-throw" could not be literal.
- Card, freeze, chant, both 12f beats and the shipped seven throws: untouched.

### s22 — The interlock

- Blue arrives **on his own 4f gap and not one frame earlier**, so the 45f
  interlock hold — the series sentence said once per episode — is untouched.
- One bubble, moved to x=1240 after a still (see FIXES #6).

### s32 — The chant

- **Indigo shoves into the SCATTER panel too**, on his own 12f gap rather than
  Blue's 4 — the difference between the two of them, in the timeline. He runs
  Blue's own box four frames stale, sits `S32_ECHO_OFF` off it, and never looks
  at anybody.
- Blue's fourth and final "I just said that!" goes in **the same place as his
  first bubble**, because it is the same man making the same objection from the
  same cupboard.
- Indigo's bubble is a **third `<Bubbles>` at fontSize 44** — the act-3 idiom for
  a bubble that must read as a smaller version of the one before it. It says
  "copy" without a word of dialogue doing it.
- **Z-ORDER AUDIT (the brief's explicit ask): clean, and the fix is a Fragment.**
  `ChantPanel`'s root is `position:absolute` + `overflow:hidden`, and `overflow`
  does **not** create a stacking context — so every z-index a panel child carries
  competes in the scene's root context. Wrapping the two intruders in a `<div>`
  would have created one and landed them either both in front of Puff or both
  behind the panel dressing. They go in as a bare Fragment, and the ordering is
  16 Indigo / 18 Blue / 20 Puff, with the dim veil, the border and the word
  banner drawn after the cast in DOM order at `z-index: auto`. Verified on
  `RaySkyBlue_028770` and `_028800`.
- Red, Sunny, Violet's edge-of-frame wave, `rc_04`/`rc_04b` and the 20f
  stillness: untouched (`RaySkyBlue_029020`).

---

## Measurement note — how the clip fractions were obtained

The brief asks for `a2_32b_blue`'s four pops as **fractions of the real clip**,
and `beats()` is not exported. This box has **no ffmpeg**, so `silencedetect` —
the method every previous wave used — was not available.

Instead the onsets were read out of the mp3's own **MPEG-1 Layer III side info**:
each granule (576 samples, ~18ms at this file's 32kHz) carries a `global_gain`
that tracks loudness closely enough to find hard onsets in a short clip. The
parser is ~110 lines and lives in the session scratchpad
(`…/scratchpad/gain.mjs`); it is not committed and nothing in the tree depends
on it.

Two clips were measured:

| clip | duration | onsets (s) | fractions used |
|---|---|---|---|
| `a2_32b_blue` "Hi! Hi! Hi! Hi!" | 2.772 | 0.19 / 0.92 / 1.59 / 2.25 | `S20_HELLO_AT` = 0.069, 0.332, 0.574, 0.812 |
| `a1_42b_yellow` "Hi! Hello! Hi! And Violet — GREAT waving!" | 5.04 | speech 0.29–1.22, pause, "And Violet" from 1.84 | `S10_VIOLET_AT` = 0.365 |

**Both are fractions, not frame counts**, so a re-roll of either clip re-times
its beat for nothing. If a future session has ffmpeg, `silencedetect -30dB` is
still the house method and should agree with these to a frame or two.

---

## Kit gaps hit, and the workaround used in each (no silent ones)

1. **`beats()` is not exported** (the brief says so). Used `lineWindow` /
   `heldBeat` / measured fractions of the real clip everywhere, which is what
   the act files already do.
2. **Bottom-edge-only tails.** Hit five times, and it is now the single most
   expensive gap in the kit for this episode. Every bubble whose speaker is
   *above* it points its tail at the floor, so a speaker high in frame either
   loses the tail or loses the bubble. Worked around by always placing above and
   to one side; unavoidable at `a1_45c_blue` (Blue is at y≈270, the bubble
   y-clamp is 170, and his own body reaches 186), and inherited at
   `a1_49_drip`/`a1_49b_drip` (accepted deviation D-a1_49, unchanged).
   Wanted: the `SpeechBubble` top-edge tail already on the cleanup list.
3. **Bubble y-clamp 170 / x-clamp 400..1520.** Three speakers this batch sit
   outside what the clamps can reach: Blue at the top of frame in s11, Yellow at
   x≈1840 in s18, Orange off frame right in s18. Each was STILL-checked rather
   than diff-checked, per the wave-2 rule, and each is documented at its call
   site with what the tail does instead.
4. **`SpeechBubble`'s width is the frame minus its own `left`.** The recap found
   this with Red's four words; it bit again at s22 (a five-word bubble at x=1420
   wrapped to three lines and its bottom edge landed on Blue's crown). Wanted:
   the component to measure rather than inherit its available width — or at
   minimum a doc line, since this is now three sessions in a row.
5. **`tailAt` clamp is ±(bubbleWidth/2 − 40).** On a two-character bubble
   ("Hi!") that is ±60px of travel, which makes aiming at a named body
   impossible. s20's four bubbles therefore point **straight down** rather than
   at a chosen arrival — with twenty-four Blues filling the frame that always
   has one under it, and it is re-roll-proof, but the general problem stands.
   (Act three's `TAIL_TIP_DX` note is the other half of this.)
6. **`<Shard>` pose is hardcoded** — a raised arm is Yellow's. Blue's, Indigo's
   and Violet's reactions this batch are therefore all lean, amplitude and
   vertical bob. That is the right answer three times out of three here (the
   indignant lean in s9, Violet's freeze-and-double in s10) and is noted only
   because a `pose="shrug"` would have been better than a bob for Blue's
   arithmetic beat in s17.
7. **`blueTrail` samples `blueRicochet` directly**, so it is unusable for any
   scene whose Blue is on a blended or bespoke path. Written around with the
   act-1 `sampleTrail(path, frame, span)` helper (already in the file) for the
   s9 lap and the s11 early trip. Wanted: `blueTrail(pathFn, frame)` — the same
   ask act three filed.
8. **`SevenBorn` / `SevenGreeted` / `SevenOnTheWord` had no per-shard
   `speaking`.** They took a single boolean (Ray's) because until revision2 the
   only voice on the arc was his. All three now take `(i) => boolean`. This is
   an act-1-local fix; if act three ever draws the arc it will want the same
   shape.

---

## Spec deviations / calls the showrunner may want to reverse

- **D1 · s20 Violet enters on Yellow's line, not on `a2_34_ray`.** revision2
  stages Yellow pointing at him and him bouncing harder when cheered, which is
  impossible if he is not drawn yet — his `VioletCase` fade was keyed to Ray's
  line, one clip later. Keyed to Yellow's instead. The consequence is that Ray's
  "Hold on. Violet bounces even more than Blue does." is now a reaction rather
  than a discovery, which the revision itself describes as the point. The 36f
  dome hold in front of it is still empty; verified.
- **D2 · s11's two new visual beats do not happen on the letters.** See
  CRAMPED #1. Green delivers his chain firing sat on the arc and Blue bounces
  off Drip in mid-air where the B is going to be. Both jokes land; neither is
  the picture the revision describes. Ratify, or move the three clips.
- **D3 · s21's "(mid-throw)" is a second throw rather than the first.** See
  CRAMPED #2.
- **D4 · s9 Blue does not rejoin the line after his lap.** He parks off
  formation for the rest of the scene, which is what makes room for Indigo's
  "from the spot in the arc Blue just left". He is nowhere near his slot at the
  cut into Scene 10 — but Scene 10 opens with him off formation anyway (his box
  is centred on the slot and biased downward), so the cut is not a jump. Flagged
  because it is a continuity decision rather than a staging one.

---

## Cramped timing — for the showrunner, not fixed here

1. **s11: `a1_45b`/`a1_45c`/`a1_45d` play nine seconds before the card exists.**
   `slamAt` is keyed to `a1_46_narrator` (local 428) and the three new lines run
   local 127..339. So "landing seated on the 'n'" and "mid-second-ricochet off
   Drip on the B" cannot be literal. Ask: move the three clips to between
   `a1_48_narrator` and `a1_49_drip`, where the blocks exist and are being sat
   on. Cost: a re-time of one scene, no new audio.
2. **s21: `a2_41b_blue` "(mid-throw)" lands seventeen seconds after the throws.**
   `ScatterThrows` is keyed to `slamAt` (local 136) and the claim is at local
   663. Staged as one extra throw on the line — a victory hurl at a finished
   word — with Indigo's miss on Indigo's line. To make it literal the claim wants
   to move to right after `a2_37_narrator`.
3. **s18: the last three lines of the scene all play with their speakers off the
   right-hand edge.** This is inherited, not new — Red is already at x≈2040 for
   the shipped `a2_24b_red` "Lovely air." — but revision2 adds two more lines
   behind him, so `a2_24c_orange` comes from a body at x≈2038 with only a bubble
   at the clamp edge to say so. Yellow's arrival at the edge is what gives the
   last beat a body at all. If it should read better, the fix is a re-time (the
   scene is 799 frames and Red crosses in 620) rather than a staging change:
   `RED_SPEED` is not the thing that gives.
4. **s9's `a1_40b_blue` is 2.9s and the lap is ~3,100px.** It plays fine and the
   trail sells it, but he is moving at about 1,000 px/s — the fastest travel in
   Act One by a distance. If it reads as frantic rather than as a victory lap,
   the line wants ~0.5s more, not the lap slower (a slow lap is a float).
5. **s10's volley is 2.5s of Yellow, then 2.5s of Green, then 3s of Blue, then a
   16f silence, in a static wide.** It is the densest stretch of Act One and the
   camera never moves. Nothing is wrong with it; it is simply the one place in
   this batch where a shot change would have helped and none was available.

---

## Fixes the stills caught (kept for the retro)

1. **s9:** the lap's "lift" was a bigger ellipse, which lifts along the arc's
   *outward normal* — straight up at the apex and very nearly **sideways** at the
   two ends. Blue flew through Violet at the violet end and through Red at the
   red end. Fixed with a second term: a plain vertical raise weighted by `|cos|`
   of the arc angle, strongest exactly where the normal has stopped being
   vertical.
2. **s10:** Blue's transit to the far corner passed ~150px from Green and a still
   had him drawn on top of him. The transit now bows over the top of the line
   (`S10_BLUE_LIFT`), zero at both ends.
3. **s10:** at full size Blue's ricochet box over there reached from under his own
   bubble down onto Orange, and there is no vertical placement between the two.
   His box now shrinks 45% while he is away — which is also the ensemble sheet
   ("Blue at rest is Blue in a cupboard").
4. **s9:** the argument perch at (−170, −160) left Blue 157px from Green, and two
   180px-wide bodies at 157px are touching. Moved to (−140, −200): 207px.
5. **s11:** Blue's flight to Drip bowed the wrong way — `moveAlong` bows to the
   *left of travel*, and the trip is up-and-left, so a negative arc took him
   straight through Ray on the W. Sign flipped.
6. **s11:** the R8 contact offset (42px) is a touch at `SHARD_PERCH` 0.36 and
   draws Blue *inside* Drip at the early trip's 0.42. The early contact is its
   own function at 100px — one drawn half-body each.
7. **s15:** Blue's bubble at y=470 sat on the big "?" at (1108, 596), which is the
   drawn half of the myth the scene exists to bust. Both of his bubbles moved to
   y=300; Indigo's moved clear of the down arrow.
8. **s17:** Indigo's anchor at (−230, −110) put him in Puff's lap. Moved to
   (+180, +90) — under Blue either way, which is the canon; which side is the
   frame's call.
9. **s20:** the four "Hi!" bubbles were laid out as corners, and the bottom-right
   corner is Ray's: a tail clamped to ±60px landed on his forehead, so four blue
   bubbles read as Ray saying them. Re-laid as four points that avoid him, tails
   straight down.
10. **s22:** a five-word bubble at x=1420 could only be 500px wide (see kit gap
    #4), wrapped to three lines, and its bottom edge landed on Blue's crown.
    Moved to x=1240 and Blue's box down 50px.

---

## Watch-items inherited and left alone

- **s19 Blue/Indigo touching at the 4f lag** (wave-2 screening watch-item) is
  unchanged and is visible in the new argument frames; they are still two
  different sizes and two different hues.
- **s10's no-drawn-trail argument** (the file carries a measured paragraph about
  why Blue has no `blueTrail` on the arc) is unchanged. The new excursion has
  long legs and *would* support one, but adding a trail for one window and not
  the others would contradict the written argument for no gain.
- **D-a1_49** (Drip's bubble under the card with a floor-pointing tail) is
  unchanged and `a1_49b_drip` deliberately inherits the same placement — same
  speaker, same seat, second half of one joke.

---

## Stills

`scratchpad/w3act12/` was emptied and re-shot **after the last code edit**, at
`--scale=0.5`, named `RaySkyBlue_<absolute frame>.png`. Every still's mtime
postdates every source file it depends on.

The riskiest ten:

| still | why |
|---|---|
| `/home/mike/projects/video_generation/scratchpad/w3act12/RaySkyBlue_003600.png` | the interrupted sixth firing, in the identical place as the other five |
| `…/RaySkyBlue_006587.png` | Blue's lap at the violet end — the frame that used to draw him through Violet |
| `…/RaySkyBlue_006890.png` | the s9 button: two identical indignant poses, four frames apart, held to the cut |
| `…/RaySkyBlue_007294.png` | Violet frozen crisp — the only frame in the episode he is not blurred |
| `…/RaySkyBlue_007500.png` | Blue answering from the wrong side of frame, clear of Green and Orange |
| `…/RaySkyBlue_007600.png` | Ray's unamused look down the lens across the Orange exchange |
| `…/RaySkyBlue_008195.png` | Blue and Drip as a two-shot, mid-second-bounce, nine seconds before the card |
| `…/RaySkyBlue_015462.png` | all four "Hi!" bubbles up at once, none of them on Ray |
| `…/RaySkyBlue_015620.png` | the 36f dome hold, still completely empty |
| `…/RaySkyBlue_016130.png` | the protected button: droop, eye-line, "Sorry, Violet.", nothing after it |
| `…/RaySkyBlue_028800.png` | the s32 z-order: Indigo behind Blue behind Puff, panel dressing intact |

---

## Gate results

- `npm run typecheck` — exit 0.
- `npm run lint:hooks` — `--- 0 finding(s) ---`.
- Three detached every-frame `--scale=0.25` renders, each verified by the mp4
  artifact **and** the log's own `RENDER_EXIT=` line, never by a notification
  (house rule after the wave-2 traps):

| span | frames | artifact | log |
|---|---|---|---|
| s05 → s13 | 2588–10374 (7,787) | `/tmp/w3a12_s05_s13.mp4` | `/tmp/w3a12_gate2.log` |
| s15 → s23 boundary | 10778–17600 (6,823) | `/tmp/w3a12_s15_s23.mp4` | `/tmp/w3a12_gate3.log` |
| s32 | 28252–29145 (894) | `/tmp/w3a12_s32.mp4` | `/tmp/w3a12_gate.log` |

An earlier full pass of all three spans (`/tmp/w3a12_gate.log`) also returned
`RENDER_EXIT=0` three times; spans 1 and 2 were re-run afterwards because
`act1.tsx` and `act2.tsx` each took one more staging fix after that pass started,
and a gate render is only evidence for the tree it rendered.
