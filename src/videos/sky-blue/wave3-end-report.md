# Ep 3 wave-END batch — s11 re-key, full gate, script.md fold (scene-builder, 2026-08-03)

Three jobs, in the order the brief specified so an interruption would lose the
least. All three landed. Nothing committed.

**Files changed (all paths absolute):**

- `/home/mike/projects/video_generation/src/videos/sky-blue/narration.mjs`
- `/home/mike/projects/video_generation/src/videos/sky-blue/narrationManifest.ts` (generated)
- `/home/mike/projects/video_generation/src/videos/sky-blue/Video.tsx`
- `/home/mike/projects/video_generation/src/videos/sky-blue/scenes/act1.tsx`
- `/home/mike/projects/video_generation/src/videos/sky-blue/scenes/act2.tsx`
- `/home/mike/projects/video_generation/src/videos/sky-blue/script.md`
- `/home/mike/projects/video_generation/public/narration/sky-blue/.cache.json`
- `/home/mike/projects/video_generation/public/narration/sky-blue/a1_45b_green.mp3` → `a1_48b_green.mp3` (git-renamed)
- `/home/mike/projects/video_generation/public/narration/sky-blue/a1_45c_blue.mp3` → `a1_48c_blue.mp3` (git-renamed)
- `/home/mike/projects/video_generation/public/narration/sky-blue/a1_45d_drip.mp3` → `a1_48d_drip.mp3` (git-renamed)
- this file

**Not touched:** `scenes/act3.tsx`, `scenes/s27b_start_line.tsx`,
`scenes/s28b2_two_walkers.tsx`, `scenes/common.tsx`, `scenes/recap.tsx`,
`scenes/coldOpen.tsx`, `src/lib/`, `src/site/`, `backgrounds.mjs`.

---

## 1 · The s11 re-key — cost **$0.00**, not two cents

`a1_45b_green` / `a1_45c_blue` / `a1_45d_drip` → `a1_48b_green` /
`a1_48c_blue` / `a1_48d_drip`, text and engine fields byte-identical, moved in
`narration.mjs` to sit between `a1_48_narrator` and `a1_49_drip`.

**The re-key was made free rather than paid, deliberately.** The generator's
cache is keyed by *line key* but its hash is computed from the spec only
(`clipHash` never sees the key), so renaming a key normally re-buys the clip. I
migrated instead: `git mv`'d the three mp3s to their new filenames and renamed
the three entries in `.cache.json` (hashes untouched). `npm run narration --
--video sky-blue` then reported **`Done. 0 clip(s) synthesized, rest served from
cache.`** on the first run and again on a second.

That is not just the ~2 cents. `a1_48b_green` is the **SOURCE recording of a
three-firing `sameAs` chain** that has already been ear-checked; a re-buy is a
second roll of the MiniMax dice on a take that is heard in three scenes.
Verified after the run:

```
adba4a64f42d5f991bedaee111185a7d  a1_48b_green.mp3
adba4a64f42d5f991bedaee111185a7d  a3_03b_green.mp3
adba4a64f42d5f991bedaee111185a7d  a3_14f_green.mp3
```

**Aliases re-resolved and still resolve.** `a3_03b_green` and `a3_14f_green`
now point at `a1_48b_green`; their own hashes changed (an alias hashes its
source's key + hash), so the generator re-copied the bytes for free. The
generator's backwards-only ordering check (`specProblems`) passes — the source
is still earlier in the file than both aliases. `narrationManifest.ts` has no
`a1_45b/c/d` and three new `a1_48b/c/d` rows at the same durations
(1.44 / 2.412 / 2.736 s).

**Timeline is unchanged: 31,281 frames.** The move swaps which lines carry the
default inter-line gap but not how many there are, and the 4f gap travelled with
Green's line, so `s11_bigword_rainbow` is still 849 frames (8014–8863) and the
episode total is byte-for-byte the number the wave-3 fix round left behind.

### The staging, restaged to the intended perches

Both of the revision's perches are now literal, and both are `syllableBlock()`
letters — no `WordCard` capital anywhere.

- **Green delivers his chain firing sat on the "n"**, where he has been since he
  landed on it. His bubble cast mark moved from the arc slot (`shardPoint(3)`)
  to `onBlock(blocks[0], LETTER_AT[3].dx, PERCH_DY)`, so it rides the block
  rather than a composition coordinate.
- **Blue goes BACK at Drip on the B for the exchange.** `earlyBlue` (the
  pre-card trip) is gone; `blueVisit` replaces it — he leaves the seat he
  settled into after the R8 bounce, hits Drip four frames before "Hi! Sorry! Are
  you a letter?", runs the **same `bounceOff` pair the shipped R8 landing uses**,
  and the second bounce sits under the middle of his line, which is the
  revision's "mid-second-ricochet". Drip replies from the B.
- **Deleted with it:** `S11_EARLY_SCALE` (0.42) and the whole `earlyUp` scale
  envelope, and `earlyContact`'s 100px offset. He is at `SHARD_PERCH` for the
  entire trip now, so all four contacts in the scene use one function,
  `dripContact()`, at the reviewed 42px. Fewer numbers, and they cannot disagree.
- **Four contacts, all on the B**, and Drip rings on all four (`knock` sums both
  hit times as before).

### Fixes the stills forced (three iterations)

1. **The bounce landed in the wrong place inside the line.** At `HIT_LEAD = 8`
   Blue was at the *first* bounce's apex — up in the cloud above "Bow" — on the
   frame his line opened, which reads as "Blue is over there", not
   "mid-ricochet". `HIT_LEAD` is now **4**: he is *on* her four frames before
   "Hi! Sorry!", so the apology is for a contact the audience just watched.
2. **The cupboard was in the hedge.** Carried over from the pre-card staging it
   sat 300px down-left, and `RaySkyBlue_08600` (first pass) read as a character
   who had wandered off mid-conversation. `S11_VISIT_BOX` is now a tight
   160×130 box immediately left of Drip and below the letter row — he stays in
   the two-shot for the whole of her reply. Its top edge clears Green's seat and
   its right edge stops short of Drip.
3. **Blue was drawn on top of his own bubble.** Shards are z-index 53 and
   bubbles are 40, so the first cupboard placement put him over his own text.
   The box and the bubble are now horizontally disjoint by measurement, not by
   eye.

### Bubbles — and the one thing worth arguing about

All three go **under the card** with their tails at their own speaker's x:
`a1_48b_green` (760, 560), `a1_48c_blue` (500, 470), `a1_48d_drip` (1300, 470).
Blue's and Drip's are on opposite sides of the two-shot, which is what makes a
paused frame say which of them spoke.

**This is the D-a1_49 call, taken three more times, and it is the kit's biggest
tax in this episode.** Everything on this card speaks from *above* its bubble:
the seven straddle the blocks' top edge at y≈140..250, the y-clamp is 170, the
card owns z-index 50 and eats anything drawn into it, and `SpeechBubble`'s tail
leaves the **bottom** edge and nothing else. There is no placement above any of
these three speakers, so each tail points at floor and the coloured dressing
carries attribution. **The top-edge tail on the cleanup list would fix five
bubbles in this one scene.**

### s21 "(mid-throw)" — ruling applied

`act2.tsx` staged a literal extra throw (`<ScatterThrows from={claimAt}
letters={1} …>` plus the `claimAt`/`blueLineTo` arithmetic). **Removed.** The
line now plays as retrospective credit-claiming with Blue simply ricocheting;
the shipped seven throws and Indigo's late miss are untouched. The doc comment
at the call site records the ruling so the next reader does not re-add it.
Verified on `RaySkyBlue_16925` — no letter in flight.

---

## 2 · THE FULL GATE RENDER — exit 0

```
nohup setsid npx remotion render RaySkyBlue /tmp/w3_full_gate.mp4 --scale=0.25
```

- **Frames: 31,281** (recounted after the re-key — unchanged, as predicted).
- **Artifact:** `/tmp/w3_full_gate.mp4`, **110,997,884 bytes**, mtime 23:02.
- **Log:** `/tmp/w3_full_gate.log`.
- **How exit was verified:** `tr '\r' '\n' < /tmp/w3_full_gate.log` (progress
  lines are `\r`-separated, so a plain `tail`/`grep` sees one giant line) then
  grepped for the wrapper's own `RENDER_EXIT=` line, which reads **`RENDER_EXIT=0`**.
  The log's own final lines are `Rendered 31280/31281` → `Encoded 31281/31281`
  → `+ /tmp/w3_full_gate.mp4 111 MB`. Both the artifact **and** the log's exit
  line, never a notification — the house rule after the wave-2 traps.
- **Provenance:** every source file's mtime predates the render's launch
  (act1.tsx 22:45, act2.tsx 22:47, launch 22:49). `script.md` was edited during
  the render; it is documentation and is not compiled into the composition.

Other gates:

| gate | result |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm run lint:hooks` | `--- 0 finding(s) ---` |
| `npm run narration -- --video sky-blue` | `0 clip(s) synthesized` |
| `npm run backgrounds -- --video sky-blue` | `0 image(s) generated` |

---

## 3 · script.md wave-end fold

`script.md` is the single source of truth again. The banner now reads **REVISION
2 APPLIED IN FULL** and states that where it and `revision2.md` disagree, *this
file wins*.

### Sections rewritten to as-built

| Scene | What changed in the file |
|---|---|
| Header + banner | target/runtime → **17:23 (31,281 f)**; banner rewritten; three as-built decisions named |
| Cast table notes | 74 (not 76) new MiniMax; 302 entries = 288 recordings + 14 aliases; Ray's line breakdown 60 = 31 auto / 25 seasoned / 4 alias |
| **9** | Blue's lap + the identity dispute, five lines, gaps 4/4/12/4, 16f button, lap-lift geometry, `a1_40f` named as chain source |
| **10** | volley folded in after the 20f hold, all seven replies, the non-reply gap, Ray's look down the lens, "Ahem." — and the "nobody replies out loud" paragraph rewritten to "not *inside the greeting*" |
| **11** | three lines re-keyed + moved, both perches, the four contacts, the bubble reasoning, an explicit RE-KEYED AND MOVED note |
| **13** | `a1_54b_green` opener + the separate-shard/5-frame-snap build |
| **15** | Blue in the postcard, the Copy-me pair + 20f, the shared visit-lift rule |
| **17** | Blue/Indigo out of the crowd, 16f beat, "deep is a SCALE not a position" |
| **18** | Orange's two firings, Yellow's cheer plant, the travelling-bubble rule, the off-frame-edge flag |
| **19** | the echo argument (4 lines), the 20f face-gives-up beat, bubble ping-pong, tail rule generalised to all eleven Indigo lines |
| **20** | the "no Blue line" rule **struck and overridden**; four bubbles at measured fractions; Yellow's cheer; D1 (Violet enters on Yellow's line) written in as ratified |
| **21** | claim/copy/pedant exchange; **"(mid-throw)" ruled a post-card boast**, with the reasoning |
| **22** | `a2_44b_blue` tag, trim-optional, "not one frame earlier" |
| **25** | Green on the rock, Blue's crash, the 12f unanswered beat, RT-1 tail 14→40 with its snap-lift flag |
| **27** | Blue's empty finish line, `a3_08c` deadpan, Green's course appraisal |
| **27b** | **NEW SECTION** (after Scene 27) — full 20-line scene, Violet's warm-up, D1 (`a3_11u` bubble with nobody under it) ratified in place |
| **28** | banter before the exits, two-stage exit, the faint tiny bubble + its `tail:"none"` argument, cheers #1–3, Violet's beat moved down the scene, retired `a3_12b` |
| **28b** | Orange's play-by-play, Green's "I found one." + stillness-not-lids, cheer #4, Yellow's 280-frame glide flagged |
| **28b2** | **NEW SECTION** (after Scene 28b) — full scene, decorated sky, RT-2 hold 45→**75f**, trim entry restated as 75→30 |
| **28c** | three shots, **hard cut** (not dissolve) + its 39-empty-frames consequence, the finish exchange, Orange's climax |
| **29** | `a3_22b_red` "Nice drama." on the walk-behind + its bubble placement |
| **32** | Indigo's shove, the fourth "I just said that!", the z-order/stacking-context note, three-right-claimants pedagogy |

### Production-notes sections rewritten

- **THE VOLCANO RULE** — scene list now `25, 28b, **28b2**, 28c, 29, 31, 35`,
  with the reason (the rule predates the scene; omitting it would blink the
  volcano out for twenty seconds, which the rule's other clause forbids).
- **Running gags** — new **four repetition ladders** table (source, text,
  firings in playback order, totals) plus the *aliasing-direction* ruling as
  built (generator resolves backwards only, so `a1_42e`/`a1_48b` are the sources
  and the Act Three keys are the aliases — the reverse of the draft's plan);
  Yellow's **"Great ___, ___!"** format with all seven firings and its
  self-cheer button; Blue's *wants to be first* chain; Orange's
  *translates Red's silences* chain; the "Start of what." / "Won what." bookend;
  credit-allocation 3→**4** firings; **Violet 5→7 firings**.
- **Held beats** — recounted from `Video.tsx`: **50** at ≥20f, **66** approach
  gaps under 20f, **one 0f gap** (the Scene 5 interruption); longest silence is
  now the **135f** in Scene 5, not the 75f world turn.
- **Line length** — new short buttons listed; longest new line is 10 words,
  longest in the episode still `co_02_narrator` at 15.
- **Deadpan floor** — `a1_16d_narrator` "No." at **0.8** (was `a2_49` at 0.85).
- **Big Word cards** — minute four / nine / fifteen of a 17:23 cut.
- **Shared recordings** — five → **fourteen**.
- **Ear-check list** — items **20–32 appended** (revision 2's thirteen: Red's
  race quartet, Orange's climax, `a1_40f` across four placements, Six racers /
  Make that seven, Great bounce me, the taunt, GREAT on MiniMax, READY STEADY
  SUNSET, the backward aliases in situ, "Are we", "No." at 0.8, "Ahem.", and the
  four-minute race as a run).
- **Grown-up smirks** — ten added, total **14 → 24**.
- **Staging worklist (wave 2)** — marked **CLOSED**; kept as reasoning, flagged
  as history rather than a worklist.

### Yellow's pronoun sweep (G5)

Two stray "he"s for Yellow found and fixed: Scene 10's `"Hi Yellow." — Yellow
was already waving. He waves harder.` → **She**, and the volcano rule's
`never names the thing he is sitting on` → **she**. A note was added to Scene 9's
ensemble list stating she is **she** throughout (`Sweet_Girl_2`, and always was),
and the running-gag ledger repeats it. Everything else in the file already
said she or used her name.

---

## Could NOT be reconciled with the as-built tree — listed, not guessed

These are places where `revision2.md` and the delivered tree genuinely differ.
None is a bug; each is a call the showrunner may want to re-open.

1. **Runtime: 17:23, against revision2's booked ≈17:05 (range 16:50–17:20).**
   +18s over the top of the stated range. The overrun is not one thing: RT-1
   (+26f) and RT-2 (+30f) alone are +1.9s, and the rest is delivered clip
   lengths running above the ledger's planning estimates. **The trim menu
   (−17.5s, now −18.5s with RT-2's 75→30 entry) would put it back inside the
   range exactly**, which is presumably why it exists. Not actioned — that is a
   taste call.
2. **`a3_11b_green` is booked in the trim menu at −5s but its clip is 2.4s.**
   The menu's totals are planning numbers; the real menu is worth re-pricing
   against the manifest before anyone spends it.
3. **`a3_13cc_blue`'s "faint" was never mixed.** The revision asks for per-clip
   attenuation "if the pipeline allows"; it does not, and the fallback it names
   (play at level, sell it with the tiny bubble) is what shipped. So the clip is
   at full level. If the family screening hears it as a shout, the fix is a
   pipeline feature, not a re-record — the byte-identity is the gag.
4. **`a3_11v_sunny` shipped at 1.0**, not the ledger's conditional 0.92. The
   condition ("slow to 0.92 if the three items run together") is an ear call
   that has not been made.
5. **`a1_42h_narrator` "Ahem." shipped**, and the ear-check's CUT fallback has
   not been exercised. Same for `a1_16c_ray`'s truncation. Both are on the
   ear-check list and both are in the cut right now.
6. **Trim-optional lines are all still in**: `a1_49b_drip`, `a2_09b`/`a2_09c`,
   `a2_44b_blue`, `a3_11b_green`, `a3_13cd_yellow`. Folded into script.md as
   TRIM-OPTIONAL rather than cut.
7. **`a1_40f_blue` was never auditioned in two takes** (ear-check item 5 of the
   revision's own list) even though it is the source for four firings. It sounds
   fine in place; the audition was simply never run.
8. **The revision's own gap self-score has not been re-measured against the
   delivered clip lengths.** Its numbers are estimates with ±5s stated. The fold
   copies none of them into script.md, deliberately.

## Weak points I found and did not own

- **`SpeechBubble` has no top-edge tail.** This is now the single most expensive
  gap in the kit for this episode: it costs five bubbles in Scene 11 alone, plus
  the ones act 3 already filed. Every character who speaks from a Big Word card
  or from the top of frame pays it.
- **`tailAt` positions the centre of a 104px tail box, not the point.** Act 3
  worked around it with a local `TAIL_TIP_DX = 52`. It should mean "put the
  point here", which would delete that constant.
- **`Bubbles` takes one `fontSize` per element**, so any bubble at a different
  size is a second `<Bubbles>` with its own cast. Done three times across the
  wave.
- **Scene 11's three bubbles are 300–450px from their speakers** with
  floor-pointing tails. It is the best available answer under the two gaps
  above, and it is the one place in this batch where a still still looks like a
  compromise.
- **Blue and Indigo touch at the 4f lag** in Scene 21's ricochet box
  (`RaySkyBlue_16925`) — inherited wave-2 watch item, unchanged, still two
  different sizes and hues.
- **`script.md` is 3,400 lines.** It has absorbed a punch-up, a major revision
  and now a full comedy rewrite, and the Production notes are the part most at
  risk of drifting out of date next time — the counts in particular
  (held beats, firings, smirks) are all hand-maintained and all just went stale
  by one wave before this fold.

## Stills

22 stills in `/home/mike/projects/video_generation/scratchpad/w3end/`, at
`--scale=0.5`, every one rendered **after** the last code edit (earliest mtime
22:48:13, last code edit 22:47:01). Crops from `scripts/frame-crop.mjs` alongside
them where a card-level read was needed.

The ones worth looking at:

| still | why |
|---|---|
| `/home/mike/projects/video_generation/scratchpad/w3end/RaySkyBlue_8486.png` | Green delivering the chain firing **sat on the "n"** — the perch the revision asked for, now literal |
| `…/RaySkyBlue_8508.png` | Blue's contact on the B, four frames before his line |
| `…/RaySkyBlue_8524.png` | the second ricochet, under the middle of "Are you a letter?" |
| `…/RaySkyBlue_8570.png` | Blue in the cupboard, still in the two-shot, his bubble clear of him |
| `…/RaySkyBlue_8640.png` | Drip's reply from the B, bubbles on opposite sides of the pair |
| `…/RaySkyBlue_8700.png` | back on his seat for `a1_49_drip` — the shipped end state, unchanged |
| `…/RaySkyBlue_8254.png` | the shipped R8 contact, for comparison: the visit uses the identical move |
| `…/RaySkyBlue_16925.png` | s21 — **no letter in flight** on the claim; the ruling applied |
