# HANDOFF — current status & plan (live file, updated continuously)

For the fresh orchestrator session: read docs/ORCHESTRATION.md first (how we
work), then this (where we are). Memory auto-loads the decision record.
Everything below is committed and pushed on `main` unless marked otherwise.

## 2026-08-02: orchestration v2 adopted
Role split per Mike: orchestrator = pure relay/logistics; creative direction
(incl. all still review) = `showrunner` fable agent; see ORCHESTRATION.md +
docs/roles/ + .claude/agents/. This file is now updated continuously (small
edits per event), never as a terminal mega-write. ray_final_sheet.png sent
to Mike 2026-08-02. Wave-1 audit delegated to a showrunner agent (in
flight); wave-2 staging follows per its worklist.
Ray F2 APPROVED by Mike 2026-08-02 (verbatim: "it looks a little alien-y,
so we'll ultimately have to see how the kids respond to it") — no rework
now; watch Claire/Math's reaction at the family screening before any
redesign talk.

## Live right now (https://vsimilitude.github.io/video-generation/)
- Financial series: BondBasics, SwapBasics (approved, dormant).
- Kids: DripWaterCycle (ep1), PuffWind (ep2 THIRD cut — punch-up + Sunny
  am_puck + Math's six fixes, 12:25), RaySkyBlue (ep3 OLD cut — the rebuild
  below is NOT deployed), DripChooses (CYOA branching demo).
- Ep-1 full-family watch verdict still pending (Claire liked it; crash
  fixed since). Ep-2 third-cut ear-checks pending (list in wind/script.md).

## IN FLIGHT: ep-3 COMEDY REWRITE (wave 3) — screening verdict received

**2026-08-02, family screening verdict (Mike, verbatim):** "I don't think we
accomplished what we wanted with the rewrite. We didn't change much to be
honest. It's still quite dry most of the episode. The colors need to drive
the humor much more. Give them more personality, let them shine. Make room
for them to have fun interactions (even if it stretches the episode longer).
Rewrite as much as necessary to get some real humor and fun in the episode
from the moment the colors are introduced to the end. Even the race felt
very dry, they barely interacted, and we zoomed through the whole thing."
Mandate: script-level rewrite, Scene 9 → end. NO implementation until Mike
signs off the revision. Runtime ceiling lifted; R1 (reply-free roll call)
overridden in substance; R2 superseded.

**Showrunner session (this one, talking to Mike directly) progress:**
- Design brief written: `src/videos/sky-blue/rewrite-brief.md` (diagnosis +
  pillars P1–P6 + hard constraints; authoritative for the rewrite).
- Measured comedy audit: `scratchpad/ep3_comedy_audit.md` (max laugh gap
  92.9s, four gaps >50s; colors = 4.5% of spoken time, zero colour-to-colour
  dialogue; race 50% narrator, three exits in one 5s window).
- Two treatments DONE: `scratchpad/ep3_treatment_A.md` (sitcom ensemble —
  wins acts 1–2) and `ep3_treatment_B.md` (race centerpiece — wins act 3).
- Showrunner synthesis DONE: `scratchpad/ep3_synthesis.md` (binding rulings
  G1–G8 + scene-by-scene; spine = B's act 3 + A's acts 1–2; target ~16:30–
  17:00 with trim menu; new scenes s27b start line + s28b2 two walkers).
- revision2.md drafted (story-writer, recovered from one session-limit kill
  via SendMessage resume), showrunner edit pass done, committed 6c9c55e.
- **MIKE SIGNED OFF 2026-08-03** with two amendments, both folded in and
  committed (240724b): Scene 5 stretched gaps 45/75/105/135 + interrupted
  sixth firing ("Are we—" / unamused "No." at 0.8); s10 Ray unamused look +
  Narrator "Ahem." (cut-if-it-fails, never "Hmm."). New target ~17:05.
- **NO ORCHESTRATOR THIS RUN** (Mike): this showrunner session also owns
  committing (explicit paths, push immediately) and usage checking
  (check-quota between batches; Mike reported 10% at green-light, reset
  ~4:50h later; weekly-fable % ask still open).
- **IMPLEMENTATION IN FLIGHT — batch plan (staging SERIALIZED: batch-1
  builder alone consumed ~300k of the ~450k window, so one builder at a
  time; check-quota before each):**
  (1) script layer: DONE + committed 169acbe — 88 clips synthesized $0.19,
  caches 0-to-synthesize, typecheck 0, 3 scene-range smoke renders exit 0,
  measured 31,225f = 17:20.8 (race s27b→s28c = 3:12 vs ~3:55 booked —
  showrunner assesses breathing room at still review, may re-time gaps).
  NOTE: sameAs chains FLIPPED to earliest-firing sources (generator rejects
  forward aliases) → a3_18e_orange "What Red said." and a3_14f_green "This
  is a nice spot." are NEW takes replacing approved clips — in Mike's ear
  packet. a2_32b_blue "Hi! Hi! Hi! Hi!" suspect (0.68 s/word, MiniMax
  exclamation padding pattern) — Mike's ear decides re-roll. Ear packet +
  9 clips SENT to Mike 2026-08-03.
  (2a) act-3 race staging DONE + committed add62f7 (builder + showrunner
  still review + fix round: 2 bubble aims, faint-protest staging, s28c
  dissolve→hard cut incl. a real stacking-context leak fix, beam
  legibility; re-times RT-1 s25 tail 40f / RT-2 s28b2 hold 75f — recorded
  in wave3-act3-report.md). 31,281 frames. Standing rulings from review:
  a3_11u off-frame bubble approved; volcano in s28b2 approved (update the
  volcano rule's scene list at the wave-end fold); Ray in finish shot
  approved; s28c cut-to-empty-39f approved (deadpan).
  (2b) acts 1–2 + recap staging DONE + committed e3d4a06 (builder +
  showrunner still review, all pass, no fix round). Its flags: s11 lines
  keyed ~9s pre-card (→ batch 3 re-key), s21 "(mid-throw)" ruled a
  post-card boast, s18 off-edge speakers accepted (inherited grammar).
  (3) wave-end DONE + committed 84f737b: s11 re-keyed to on-card perches
  ($0 cache migration, ear-checked chain byte-identical), s21 throw ruling
  applied, script.md FOLDED IN FULL (single source of truth again), full
  every-frame --scale=0.25 render exit 0 (31,281f = 17:23).
  **WAVE 3 COMPLETE — DEPLOYED 2026-08-04 (clean worktree, page + new
  audio verified 200).** Re-screening link sent to Mike.
  AWAITING MIKE: (a) family re-screening verdict → expect a tweak round
  (cents); (b) ear-check verdicts (9 clips — esp. a2_32b_blue re-roll
  call + the two replacement takes); (c) weekly fable %. Ear items
  shipped-in-cut with unexercised fallbacks (full list in
  wave3-end-report.md): "Ahem.", "Are we" truncation, a3_11v at 1.0,
  faint-protest at full level, six trim-optional lines all in, a1_40f
  single-take. Trim menu −18.5s if runtime drags.
  AFTER the screening verdict: retro → LEARNINGS/STYLE + BIBLE first
  write-up (owed at this boundary per wave-2 distillation).
  **S35 RE-TEASE DONE + DEPLOYED 2026-08-04** (committed 2523cac; clean
  worktree deploy; page + both new clips verified 200): stir untethered
  (rc_16 cut, 45f silent open), card = "NEXT TIME / WHAT DO PLANTS EAT?",
  NEW rc_21_ray "Is it me??" fearful button (wave freeze via <Freeze> +
  hug flinch; showrunner still review passed), ep4-volcano comment refs
  swept to ep5, script.md counts + ear list updated (item 31). New total
  31,372f = 17:25.7. EAR ITEMS added for Mike: rc_21 (fast take, 0.324
  s/word — listen for clipping; re-roll = cents) + rc_20 (kokoro, free).
  Cleanup note for a future kit pass: re-export Freeze from
  scenes/common.tsx (recap.tsx imports it straight from remotion).
  **TWEAK ROUND OPEN 2026-08-04 (re-screening notes arriving from Mike;
  showrunner tweak session).** Worklist + binding designs:
  `src/videos/sky-blue/tweak1-worklist.md`. T1 = Scene 5 restructure
  (Mike note 1, verbatim in the worklist): five answered firings counting
  1–5 minutes (answers still sum to eight), gaps 45/75/105/135/165,
  unanswered-fifth beat removed, interruption becomes "No, Ray, not yet."
  (kokoro 0.8), then a 210f hold with a silent almost-ask (empty bubble
  winds up and withdraws, no face change), same hard cut to arrival.
  $0 synthesis (kokoro-only changes; MiniMax clips must stay cache hits).
  Full every-frame render deferred to tweak-round close; scene-range
  render per batch. T1 designed (committed 7a84e82). T2 designed (Mike
  note 2): "Ahem." CUT (cut-if-it-fails verdict arrived; never "Hmm."),
  Ray's reaction → NEW shared `skeptical` emotion (rig.ts EMOTIONS —
  browAsym one-brow raise + half-lids + first flat mouth; fallback
  ladder down to no-reaction recorded in the worklist), s09→s10 jump
  fixed via baked Blue/Indigo handoff poses + 30f settle + Ray 14f
  ease-in entrance, s10→s11 fixed by pre-slam Ray continuity at his s10
  mark + card-slam swoop to perch + Drip drop-in entrance + formation
  settle, bubble sweep card-slam→s13 (known: a1_53_ray tailAt 430→360,
  a1_48c_blue tail goes live with his bounce; then stills-verified
  sweep of every line). $0 synthesis total. T1+T2 batch into ONE
  builder — NOT yet spawned, awaiting quota green-light. More notes
  expected (T3+ append to the worklist).

## Prior campaign record: ep-3 rebuild ("Ray and the Sky Nobody Painted")
Full spec: src/videos/sky-blue/revision.md — READ END TO END INCLUDING THE
THREE ADDENDA at the bottom (race supersedes §6.13/6.14; six-voice cast;
Ray=F2 + frequency ladder). ⚠-banners mark superseded sections.

**All user decisions are FINAL** (do not re-ask): treatment + sunset race
approved (final judgment = full-context on deploy). Cast: Blue=Decent_Boy
happy 1.05 · Red=Patient_Man calm 0.9 · Orange=Determined_Man calm 0.95
pitch+2 · Yellow=Sweet_Girl_2 happy 1.0 · Green=Friendly_Person calm 0.95 ·
Indigo=Decent_Boy happy 1.1 pitch+3 (echo of Blue, lines = tails of Blue's)
· Violet NEVER speaks · Ray=Young_Knight · Sunny=kokoro am_puck 1.0 ·
Narrator=af_heart. Ray's body = round-2 candidate F2; shards = ascending
frequency ladder (Red single trough+peak → Violet fizz, shared wave speed).

### Wave 1 — DONE, committed (commit "Ep3 rebuild wave 1", 2026-08-01)
- **Ray F2 swap** (src/lib/kid/characters/Ray.tsx): complete, gates green,
  full every-frame render passed. Agent's report highlights: FIT=0.78
  scaling; blink solved with wide flat oval lid-cover; talking passes at
  0.44/0.62; ladder numbers Red 1.0 cycle → Violet 7.2 (table in the
  STYLE.md Ray section). Deliverable scratchpad/ray_final_sheet.png SENT to
  Mike 2026-08-02 (F2 approved — see top of file).
  **Three staging items it reported, NOT yet fixed** (wave-2 work):
  1. staging.tsx midOf/markCentre aim at box centre = the gap between F2's
     face and wave — other characters' `look` at Ray aims low; add a
     per-body faceOffset kit-wide.
  2. act1.tsx:359-367 scene-4 whip streak band crosses the same gap.
  3. Scene 4 Sunny's pinch arms converge on the gap.
  Also: Ray has NO arms at pose="rest" by design.
- **Script layer** (script.md/narration.mjs/Video.tsx + TTS): **AUDITED
  2026-08-02** (showrunner + opus auditor; full audit:
  `scratchpad/ep3_wave1_audit.md`). Verdict: substantively correct —
  CONFIRMED 41 / MISSING 1 / WRONG 9 / wave-2 expected-absent 6. All named
  checks passed: race scenes per addendum 1 (as s28 + NEW s28b_race_island +
  s28c_red_arrives — 36 scenes now, nothing renumbered), 5× aliases with
  gaps 30/45/60/75 + unanswered fifth, scene 16/23/26/35 changes verbatim,
  cast block exact (incl. Indigo pitch+3 UP), generator `pitch` field in
  cache key, both caches 0-to-synthesize, wind rc_15 exact. All 9 WRONGs
  were doc/comment drift and are FIXED (worst: Video.tsx's scene-23 beat
  comment still described the deleted wrongness ceremony — a wave-2 landmine,
  now says the grin GROWS). Showrunner rulings: roll call stays reply-free
  (builder's reasoned decline of addendum 2's line-home ACCEPTED — lantern
  hung by Yellow's "Great bounce, Violet!"; Mike may override at screening
  for cents); runtime **13:36.1** flagged per addendum 1's "flag the final
  number", no cuts now (cut-list at script.md:2358-2365). **Ear-check packet
  DONE 2026-08-02** — Mike: "all are good except I think blue in 28b sounds
  weirdly slow and low while in 25b blue sounds fine." Everything approved
  incl. `a2_25b_blue` as-is (fallback withdrawn); the one fail is
  **`a2_28b_blue`** — diagnosed as a bad MiniMax draw (0.83 s/word vs Blue's
  0.31–0.36 on identical fields), fix = cache-bust re-roll, same text/fields,
  ~$0.01, wave-2 batch (b) item B12 in the worklist; scene-19 bubble beats
  (B7) blocked on it, and the Blue→Indigo echo pairing must be re-heard
  against the new take. Gates re-run post-fixes: typecheck 0, lint:hooks 0
  findings,
  caches still complete; full every-frame --scale=0.25 render re-run:
  **exit 0** (24,482 frames, 81MB, 2026-08-02). Wave 1 is verified green.

### Wave 2 — IN FLIGHT (showrunner spawned 2026-08-02): scene staging
**Progress (showrunner session, 2026-08-02):**
- **B12 DONE early** (pulled ahead of batch (b) to parallelize Mike's ear
  latency): `a2_28b_blue` re-rolled, 3 draws (3.67 / 3.64 / **3.06s KEPT** —
  0.38 s/word, in Blue's healthy band; text/fields unchanged). Manifest at
  3.06s; scene 19 retimes automatically. **APPROVED BY MIKE 2026-08-02**
  (verbatim: "Blue and indigo are good to go") — new take + Blue→Indigo echo
  pairing both confirmed. B7 is unblocked and measures its bubble beats
  against the NEW 3.06s clip. No ear items pending anywhere.
- **Kit K1–K4 DONE + showrunner-reviewed** (stills pass at hero + 0.44 crowd
  scale; typecheck/lint/full render green). Files (uncommitted, ride with the
  batch-(a) checkpoint): scenes/common.tsx ("API 6": SEVEN table + motion
  laws + <Shard heading>), src/lib/kid/staging.tsx (faceOffset/faceOf),
  src/lib/kid/characters/Ray.tsx (shard pose/wave + smear), src/lib/kid/
  index.ts. Rulings: new RayShard props APPROVED; Indigo hero-scale braid
  accepted (screening watch-item); raw RayShard call sites migrate per batch.
- **Batch (a) DONE + showrunner-reviewed 2026-08-02** (first builder
  quota-killed mid-run; recovery builder audited the inherited act3 work
  per-constraint — 5 real finds fixed — and built A5). All A1–A7 landed:
  race world s28/s28b/s28c, s27 delta, s35 tease restage (incl. stale
  "That is not me." bubble fixed), volcano continuity on measured horizons,
  dead s26 refs gone. Gates on final tree: typecheck 0, lint:hooks 0, full
  every-frame --scale=0.25 render exit 0 (twice). Showrunner sampled 8
  riskiest-beat stills (scratchpad/w2a2/) — accepted, no fix round.
  New rulings R4–R7 + carry-forward notes recorded in wave2-worklist.md's
  "Batch (a) — DONE" section. Committed 4418f7e (kit + batch (a) + B12).
- **Batch (b) DONE + showrunner-reviewed 2026-08-02** (successor showrunner
  session; boot spot-check on 4418f7e green). Two parallel builders:
  act1 (B1–B4 + B11) and act2 (B5–B10 + VioletCase→kit migration; B7
  fractions measured against the NEW 3.06s a2_28b_blue via silencedetect =
  [0.058, 0.455, 0.740]). Rulings R8 (Drip stays on the B, Blue ricochets
  off her twice) and R9-AMENDED-OUT (Scene 23 Red walk-across rejected on
  the builder's frame arithmetic — evidence in scratchpad/w2b2/) recorded
  in wave2-worklist.md with the full DONE sections, accepted deviations,
  and reported kit gaps (cleanup-list). Showrunner sampled 18 stills
  across w2b1/ + w2b2/; one fix (Scene 23 roller anchored to Sunny's
  spikes, showrunner-applied + re-stilled). Gates per builder: typecheck 0,
  lint:hooks 0, every-frame scene-range renders exit 0 (2140–3355,
  5426–7284, 9869–15845). Committed 8d7dc08; six preview stills to Mike
  (no decision pending).
- **Batch (c) IN FLIGHT** (2026-08-02): one builder on C1 (s32 chant
  panels, recap.tsx + recap-wide stale-bubble sweep), C2 (s29 Red/Orange
  walk-behind delta, act3.tsx — the one unbuilt REVISE row batch (a) did
  not cover), C3-fix (a1_49_drip bubble tail). Stills → scratchpad/w2c/.
  Builder runs the FULL gate stack incl. every-frame --scale=0.25 render.
  Then: showrunner C3 sampled review (batch-(c) work + the act3 race
  beats flagged in the worklist: one-eye 45f, s28c eye→volcano dissolve,
  s28 pack crossing 17500–17610), checkpoint report, and the
  wave-terminal distillation (deploy-readiness note + retro inputs).
  Deploy = orchestrator, after showrunner sign-off.
  **2026-08-02, successor showrunner — batch (c) RECOVERED + CLOSED:**
  predecessor session AND its builder were quota-killed with batch (c)
  uncommitted (no gate results, no DONE section). Recovery: auditor pass
  on the inherited diff (C1/C2/C3-fix CONFIRMED; one real WRONG resolved
  by ruling R10, one by accepted deviation D-a1_49; all post-audit edits
  comment-only) + showrunner C3 sampled review on fresh stills
  (scratchpad/w2c3sr/, all pass — incl. the flagged one-eye 45f, s28c
  dissolve, s28 pack crossing). Full DONE section + R10 + ratifications in
  wave2-worklist.md; wave-terminal distillation at
  src/videos/sky-blue/wave2-distillation.md. Post-B12 total 24,374 frames
  = 13:32.5. Gates on final tree ALL GREEN: typecheck 0, lint:hooks 0,
  both caches 0-to-synthesize, full every-frame --scale=0.25 render
  RENDER_EXIT=0 hand-verified (log + 85.6MB mp4). **WAVE 2 COMPLETE —
  committed (a9d1750) and DEPLOYED 2026-08-03 (clean worktree, URL
  verified 200)**. Screening link + watch-items + distillation sent to
  Mike; campaign now awaits the family screening → tweak round, then the
  wave-3 boundary items (retro, bible, kit cleanup — see distillation at
  src/videos/sky-blue/wave2-distillation.md).

**The staging worklist is now authoritative:
`src/videos/sky-blue/wave2-worklist.md`** (showrunner, 2026-08-02 — merges
the audit, script.md's builder worklist, and this section; adds a
kit-prerequisite layer K1–K4: Speaker/colour support — all 16 colour lines
currently stage as narrator turns —, seven personality tables, the frequency
ladder, per-body faceOffset). Batch structure below is kept. Original
sketch, from revision.md, for context:
- THE SUNSET RACE (addendum 1; act3): multi-leg race world; per-color
  in-character exits (bounced UP into the sky, never eliminated); Yellow's
  volcano rest attempt + narrator warn-off + THE VOLCANO OPENS ONE EYE
  (~45f beat, nothing enters, no dialogue); Green distracted (becalmed
  sailboat); Red+Orange finish into "Peace and quiet" (Orange one
  body-length behind). Reuse SleepingVolcano (exists in BOTH wind/act3 and
  sky-blue/act3 — promotion to lib is on the cleanup list).
- Scene 5 journey: five firings, escalating gaps, fifth unanswered into the
  arrival cut.
- Scene 16 rebuild (one prop: the empty tray; "So we went looking for the
  paint.").
- Scene 23 restage: diagram never stops; grin GROWS through the beat;
  "LOADS of points" ray-fan visual pun.
- Ensemble touches through acts 1–3 + recap per revision.md REVISE deltas
  (roll call reactions, split-reveal personalities, chant panels) + the
  three Ray staging items above + scene 35 tease (Sunny reflexively claims
  the stirring volcano; "Hmm. We will find out.").
Suggested batches (commit after each): (a) act3 race + tease; (b) acts 1–2
revisions + Ray staging fixes; (c) recap + orchestrator sampled review +
full gates + clean-worktree deploy.

### After deploy
- Send Mike: ray_final_sheet.png + the deployed link for the full-context
  family screening (his standing judgment mode). Expect a tweak round
  (cents, hours).
- Retro → LEARNINGS + STYLE per PROCESS §7.

## Backlog (owned, not started)
- SERIES BIBLE (approved by Mike 2026-08-02): docs/kids/BIBLE.md — per-
  character canon (locked casting, personality, speech patterns, arc
  history) + series ledger (running gags + state, open teases like the
  volcano eye, world rules). Owner: showrunner; mandatory update at each
  episode retro alongside LEARNINGS/STYLE. First write-up = story-writer
  distills eps 1–3 + decision record, showrunner reviews — schedule at the
  ep-3 wave-3 boundary (after ep-3 canon is final). When it lands: add
  bible to showrunner boot order, bible-check to auditor checklist, and
  character excerpts to story-writer briefs.
- **Episode order DECIDED (Mike, direct showrunner session 2026-08-04):
  ep 4 = PLANTS/photosynthesis, ep 5 = volcano wakes.** Full arc rationale
  + guardrails recorded in docs/roles/audience.md "Series arc canon"
  (seed-hero ingredients quest, Sunny fully-vindicated peak, soil bridge,
  volcano sleep-gag extra rep, ep-2 Rock cast in ep 5, outgassing tie-in
  ruled OUT of ep 5 scope — scope is lava → rock formation → inside the
  Earth → volcano/island formation). Runtime rule: 10–30 min ok, hit
  beats, never target a duration. NO ep-4 work yet: weekly fable at 86%
  AND family travels ~2 weeks from 2026-08-04. On return/reset, order of
  operations: ep-3 re-screening verdict + tweak round → retro + BIBLE
  first write-up → ep-4 brief + treatments.
- Ep-1 catch-up round eventually (roll-call gag retrofit? cameo voices?
  distinct-voice rule postdates it) — only after its family verdict.
- CYOA: phases 1–2 shipped; phase 3 (full branching episode) awaits Mike;
  spec docs/CYOA.md; six spec amendments in docs/cyoa-pilot/findings.md to
  fold into CYOA.md first. Owned by the TECHNICAL session, as are player
  fullscreen/casting upgrades (iPhone/Apple TV notes in
  memory/web-player-delivery.md).
- Reading-match question (bubble text vs spoken words, Claire) — open.
- Ep-2/ep-3 ear-check lists (in each script.md) — pending Mike.

## Open loose ends in the tree
- The technical session may have uncommitted src/site/src/lib work (e.g.
  narration.ts pauseWhenBuffering was theirs). NEVER `git add -A`; commit
  by explicit path; deploy via clean worktree (recipe in CLAUDE.md).
- scratchpad/ holds workbenches + stills (untracked, disposable, but
  rayRedesign2.tsx is the F2/ladder source of truth if Ray.tsx needs
  reference).
- Tasks #4–#10 in the task list mirror this file; #8 is the campaign.
