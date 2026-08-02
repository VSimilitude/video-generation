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

## IN FLIGHT: ep-3 rebuild campaign ("Ray and the Sky Nobody Painted")
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
  STYLE.md Ray section). Deliverable for Mike: scratchpad/ray_final_sheet.png
  (NOT yet sent to him — send it).
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

### Wave 2 — NOT STARTED: scene staging (the remaining work)
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
- Ep 4: the volcano wakes — Claire's lava-drop / rock-cycle episode. Brief
  seeds in memory/kids-series.md + ORCHESTRATION.md (Sunny finally wrong;
  hero arc ≠ wrong-about-self; volcano voice = Elegant_Man pitch −6).
  Ep-3's ending tease points at it.
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
