# HANDOFF — current status & plan (live file, updated continuously)

For a fresh orchestrator session: read docs/ORCHESTRATION.md first (how we
work), then this (where we are). Memory auto-loads the decision record.
Everything below is committed and pushed on `main` unless marked otherwise.
This file is CURRENT STATE, not a journal — git log holds the history.

## MODE THIS WEEK: autonomous (Mike travelling, 2026-08-07 →)

Mike, verbatim 2026-08-07: "I'll be asleep, so get as much done as you can in
that session (and the one after before I wake up), I won't be around most of
this week, so I'd rather use as much as we can, even if we have to redo some
of it - it's easier for me to judge a so-so video than read a whole
brief/treatment, and we can revise then - note we just passed the weekly
reset so we have plenty of budget".

Operating rule while he is away: do NOT park a campaign at a sign-off gate.
Push each wave through to something screenable and deployed; take reasonable
creative calls in his stead within the standing decision record; LOG every
call taken so the tweak round can reverse it. Give him a link plus a short
list of calls to overturn, never documents to read. Normal sign-off gates
resume when he is reachable. Weekly fable pool reset 2026-08-07 (ample); the
5-hour window is SHARED with another of Mike's sessions — keep gating with
`node scripts/check-quota.mjs` between batches.

## Live right now (https://vsimilitude.github.io/video-generation/)
- Financial series: BondBasics, SwapBasics (approved, dormant).
- Kids: DripWaterCycle (ep1), PuffWind (ep2 third cut, 12:25),
  RaySkyBlue (ep3 FINAL cut, 17:27.3 — deployed 2026-08-05),
  DripChooses (CYOA branching demo).

## EP 3 — SHIPPED (campaign closed 2026-08-05)
"Ray and the Sky Nobody Painted", src/videos/sky-blue. Comedy rewrite
(wave 3) + the 10-note tweak round are complete, committed 33fcafb, deployed
and verified. 31,419 frames = 17:27.3. Canon is FINAL — do not reopen.
Record for anyone digging: script.md is the single source of truth for the
cut; tweak1-worklist.md holds every RUN 1/RUN 2 ruling; wave2-distillation.md
and wave3-end-report.md hold the wave-terminal notes; revision.md +
rewrite-brief.md are the historical specs.

Still open on ep 3 (non-blocking):
- **Ear checks, 3 clips** pending Mike's ear: a2_32b_blue (roll call),
  rc_14_ray, a3_22b_red "Very dramatic." All measure healthy and are
  shipped in the cut; re-rolls cost cents if he dislikes one.
- Ep-1 full-family watch verdict and ep-2 third-cut ear checks (list in
  wind/script.md) also still pending.

## IN FLIGHT: ep-3 boundary wave — retro + first SERIES BIBLE
Showrunner spawned 2026-08-07. Deliverables: (1) dated ep-3 retro entry in
docs/LEARNINGS.md + rules folded into docs/STYLE.md (seed:
sky-blue/tweak1-retro-notes.md, the worklists, wave reports,
scratchpad/ep3_comedy_audit.md); (2) `docs/kids/BIBLE.md` first write-up —
per-character canon (casting, personality, speech patterns, catch-phrase rep
counts, arc history eps 1–3) + series ledger (running gags and state, open
teases incl. the volcano eye, world rules), story-writer drafts, showrunner
edits. On landing, wire the bible into docs/roles/{showrunner,auditor,
story-writer}.md boot orders/checklists. Explicitly NOT starting ep 4.

## NEXT: ep 4 — plants / photosynthesis
Order decided by Mike 2026-08-04; full arc rationale and guardrails live in
`docs/roles/audience.md` "Series arc canon" (seed-hero ingredients quest,
Sunny fully vindicated as the peak, soil bridge into ep 5, volcano sleep-gag
gets one more rep, ep-2 Rock cast in ep 5, outgassing ruled OUT of ep-5
scope). Ep 5 = the volcano wakes. Runtime rule: 10–30 min is fine, hit the
beats, never target a duration.
Sequence once the bible lands: fresh showrunner → ep-4 brief → treatment →
script → staging waves → deploy a screenable cut. Under this week's
autonomous mode, run that straight through rather than stopping for sign-off.

## Backlog (owned, not started)
- **Kit cleanup pass** (accumulated through eps 2–3): re-export `Freeze`
  from sky-blue/scenes/common.tsx (recap.tsx imports it straight from
  remotion); promote `SleepingVolcano` to lib (duplicated in wind/act3 and
  sky-blue/act3); plate-shift helper; the per-batch cleanup-list entries in
  wave2-worklist.md.
- CYOA: phases 1–2 shipped; phase 3 (full branching episode) awaits Mike.
  Spec docs/CYOA.md; six spec amendments in docs/cyoa-pilot/findings.md to
  fold into CYOA.md first. Owned by the TECHNICAL session, as are player
  fullscreen/casting upgrades (see memory/web-player-delivery.md).
- Ep-1 catch-up round eventually (roll-call gag retrofit? cameo voices?
  the distinct-voice rule postdates it) — only after its family verdict.
- Reading-match question (bubble text vs spoken words, Claire) — open.

## Open loose ends in the tree
- The technical session may have uncommitted src/site/ work. NEVER
  `git add -A`; commit by explicit path; deploy via clean worktree (recipe
  in CLAUDE.md).
- scratchpad/ holds workbenches + stills (untracked, disposable);
  rayRedesign2.tsx is the F2/ladder source of truth if Ray.tsx needs
  reference.
