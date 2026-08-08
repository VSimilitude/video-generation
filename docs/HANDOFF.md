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
resume when he is reachable. Weekly fable pool reset 2026-08-07 (ample).

**The 5-hour window is per-ACCOUNT and shared with Mike's other sessions,
which can burn it fast while this one sits quiet.** On 2026-08-07 this
session read 38% from Mike, overrode a correct PAUSE on a bad diagnosis, and
was actually at 93%. check-quota is recalibrated (ceiling 450k → 1.2M output,
from a live 1.24M ↔ 93% reading) and now sums cache tokens when sanity-
checking. Gate between every batch; when a reading looks absurd, check the
cache fields and ask Mike rather than overriding.

## Live right now (https://vsimilitude.github.io/video-generation/)
- Financial series: BondBasics, SwapBasics (approved, dormant).
- Kids: DripWaterCycle (ep1), PuffWind (ep2 third cut, 12:29),
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

## Ep-3 boundary wave — DONE (2026-08-08)
Retro committed 3a5f6b8 (LEARNINGS + STYLE). **docs/kids/BIBLE.md is live**
("Little Big World — series bible": per-character canon incl. all seven
colours, series ledger, world rules, forward-arc pointer) and wired into
docs/roles/{showrunner,auditor,story-writer}.md — showrunner owns it and
updates it at every episode retro; cold-boot path for story work is now
bible + audience.md "Series arc canon", no episode scripts needed.
Known stale text the bible supersedes: sky-blue script.md :2071/:3345 still
say the volcano "stirs in Scene 35" (pre-T10) — the bible wins.

## IN FLIGHT: ep 4 — plants / photosynthesis
Order decided by Mike 2026-08-04; full arc rationale and guardrails live in
`docs/roles/audience.md` "Series arc canon" (seed-hero ingredients quest,
Sunny fully vindicated as the peak, soil bridge into ep 5, volcano sleep-gag
gets one more rep, ep-2 Rock cast in ep 5, outgassing ruled OUT of ep-5
scope). Ep 5 = the volcano wakes. Runtime rule: 10–30 min is fine, hit the
beats, never target a duration.
Campaign showrunner spawned 2026-08-08 (autonomous mode): brief → treatment
→ script → staging waves → deployed screenable cut, straight through, no
sign-off stops. Creative calls taken in Mike's stead are LOGGED per wave for
his tweak round. Story-work handoffs from the bible wave: Sunny enters at
maximum ego (wake-claim + "That is not me." unfired, available for tease);
Blue's anti-Sunny cameo seed slot open (payoff forbidden); roll-call variant
owed; soil stays an unexplained given.

**Wave A committed** (6db4202): brief, treatments, synthesis, script.md
(29 scenes; single source of truth), narration.mjs, decision log, wave-B
worklist. **Pip CAST: `Inspirational_girl`** (decision-log TOP — Mike's
ear pending; clips `scratchpad/ep4_pip_audition/`).

**Wave B, batch B1 (2026-08-08, reboot session after a lost one) — repair
+ verification COMPLETE except cold-open restage in flight:**
- TTS gates now fully green (auditor ran them): 239 keys / 223 recordings /
  16 sameAs aliases all byte-identical / both cache migrations
  byte-identical to source episodes / all generator hashes current.
- Promotions (shard kit + SleepingVolcano → `src/lib/kid/shards.tsx`,
  4 scene files collapsed to re-exports) VERIFIED per PROCESS §7:
  before/after/control grids 1489 frames each, all diffs at/under
  antialias noise, eyeballed; sign-off in
  `scratchpad/ep4b1_promotion_signoff.md`. tsc + lint:hooks clean.
  Every-frame validation renders for the four legacy comps running/done —
  see batch report. NOTE: `src/lib/kid/shards.tsx` is UNTRACKED and
  load-bearing for 3 episodes — must be in the B1 commit.
- Full audit of inherited B1: `scratchpad/ep4b1_audit.md` (24 CONFIRMED /
  3 MISSING / 2 WRONG). Both WRONGs fixed by showrunner: W1 a masked
  string-as-number cast crashed PipPlants frames 0–525 (one-token fix);
  W2 `NO_LEAD || 8` booby-trap tidied. Skeleton verified: 29 scenes,
  44/44 held beats exact vs script.md, comp `PipPlants` 28085 frames.
- IN FLIGHT: scene-builder restaging the cold open (built blind while
  frames crashed — kid+dandelion invisible, characters buried at the
  horizon band; systemic mark-Y fix + Scenes 1–4 restage + PipPlants
  every-frame validation is its exit gate).
- B2 design ready: `src/videos/plants/ep4-plate-design.md` (~13 plates).
- Pip sheet ready for Mike's eye: `scratchpad/ep4_pip_sheet.png`
  (decision-log TOP item has the calls).

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
