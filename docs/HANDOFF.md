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
- Cold open RESTAGED and accepted (root cause: z-order painted grass over
  every character; builder fixed + showrunner still-reviewed). Roll-call
  fixed to five sequential NAME bubbles timed to measured phrase
  boundaries (showrunner edit, ep-3 a2_32b precedent). A post-B1 builder
  eyeline fix (divisors 520/380 → 1000/400 in coldOpen.tsx, uncommitted)
  was showrunner still-reviewed at all five swap frames on reboot 2: the
  eyes walk the queue, PASS. Every-frame PipPlants validation re-run at
  the B2 boundary — see below.
- B1 committed 6d9dc3b. Pip sheet ready for Mike's eye:
  `scratchpad/ep4_pip_sheet.png` (decision-log TOP item has the calls);
  audition clips `scratchpad/ep4_pip_audition/` still pending his ear.

**B2 DONE pending commit (backgrounds, showrunner reboot 2 2026-08-08):**
13 plates accepted in public/backgrounds/plants/ (builder's set audited
and six keys re-rolled to acceptance across 3 rounds — the flagged
aerial/golden/sunrise/rain/dawn/grass_close). `meadow_golden` CUT after
five failed rolls: scenes 22/23/28 = `meadow_day` + comp warm grade
(autopsy in backgrounds.mjs, call in decision-log). Measured seating
table + per-plate grass palette = `PLATES` in scenes/common.tsx (skyline
fraction, seat scale, grass hex; volcano seats at MEADOW.horizon=604 in
every wide). Acceptance notes + value ladder at the bottom of
backgrounds.mjs. Every-frame PipPlants validation re-run at the B2
boundary: EXIT 0 (28085 frames, out/validate_pipplants_postB1.mp4).

**B3 IN FLIGHT — reboot 3 (2026-08-08, session-limit kill took all four
parallel act builders mid-batch; audit-not-trust recovery running):**
The four act files (act1 s05–s10, act2 s11–s16, act3 s17–s26, recap
s27–s29) were left substantially complete and UNCOMMITTED: all scene
records full, tsc + lint:hooks clean, every-frame renders of all four
ranges exit 0 (act3's re-run by the showrunner post-kill). New operating
rules after two same-day kills: MAX 2 concurrent builders, quota gate
(rewritten check-quota.mjs, weighted tokens, 24M ceiling) before EVERY
spawn, checkpoint report to orchestrator after each accepted act.
State: act1+act2 AUDITED (`scratchpad/ep4b3_audit_act12.md`, 85 confirmed
/ 5 missing / 25 wrong — P0s: Ray −62° bank park in act2 s15/s16, Sunny
staged frame-LEFT breaking the lean runner, act2 held beats unfrozen);
repair builder running off `scratchpad/ep4b3_repair12_brief.md`
(showrunner rulings logged in ep4-decision-log.md). act3+recap AUDITED
(`scratchpad/ep4b3_audit_act3recap.md`, 74 confirmed / 8 missing / 26
wrong — P0s: WaterLine over Pip through the break, emotion changes inside
five held beats incl. s26's resolution, rule stamp over a bubble, recap's
golden hour cooler than act3's, sprout-row continuity); second repair
builder running off `scratchpad/ep4b3_repair3r_brief.md`. DEFERRED
follow-up batch after both land: Pip.tsx pointer articulation
(POINT_CEILING 14° doesn't read; audit M-A5) + targeted re-stills incl.
act2 s16. Then: showrunner sampled still review per act, full-episode
every-frame render, B3 commit boundary.

**Reboot 4 (2026-08-09, second B3 kill took both repair builders
mid-flight; fix state was unknown):** tree found tsc + lint:hooks CLEAN.
Scene 13 CloudHotel negative-width bug VERIFIED FIXED (unmount at local
frame 62, width still ~793 there; stills at globals 11090/11200/11600 show
zero SVG-attribute errors; stir beat reads — showrunner eyeballed
`scratchpad/ep4b3_s13_stir_f11090.png`). Repair verification DONE both halves:
`scratchpad/ep4b3_verify_act12.md` (26/27 tasked items fixed, 0
regressions, 4 new findings) + `ep4b3_verify_act3recap.md` (35 fixed /
2 unfixed / 2 partial, 0 regressions, 7 new [C]s). Showrunner rulings
logged in decision-log: s13 in-hold Drip decision STANDS (scripted),
s16 Ray-over-cutaway RATIFIED (still f15060). Sampled still review
act1+act2 PASS (6 stills, scratchpad/ep4b3_sr_f*.png — f13300 confirms
both P0 fixes on screen). **ACT1 + ACT2 ACCEPTED (2026-08-09):** fixup builder landed N-01 (Ray
mark 268→360 + bubble re-placed, arc 0.16→0.09 flagged+accepted; W-A2-12
re-ratified at the lower mark on still f15300) and N-04 (act1 landing
bank blended via BANK_CLAMP construction); both range renders exit 0
(out/validate_fixup_s07.mp4, _s16.mp4); stills
scratchpad/ep4b3_fixups/. Showrunner closed the s06 close-framing
order-card tail (act1.tsx board() grew a tailSide param; verified on
f3900 re-still). act1.tsx + act2.tsx COMMITTED d2841ef, pushed. **POINTER BATCH LANDED + ACCEPTED (2026-08-09):** Pip.tsx elbow morph
(byte-identical <=14°, cmp-proven on 10 frames; rig aim limit now
61.1°), act3 POINT_CEILING→56 with new POINT_HELD=14, all folded-in
remainders closed (N-3 board exit, W-R1 SunWash — s28 measures warm
R>G matching act3, N-1/2/5/6, W-23.2, N-7); both range renders exit 0.
All 7 flagged deviations ratified (decision-log). Showrunner sampled
review act3+recap PASS: s16 unlock + s23 aim stills, M-R1 closed on
full-res f26209/26800/27282/27283 (scratchpad/ep4b3_recap_f*.png).
Builder weak points logged for retro: leafAt ignores lean (aim reads
anyway), s24|s25 4° step (legal time cut), young-state pointer node
under pod (invisible today), golden/tree/sprout helpers now duplicated
act3+recap → kit-cleanup backlog. Wind-down rule that session:
18M weighted = no new builder spawns, 21M = wrap to a clean checkpoint.

**B3 CLOSED + DEPLOYED (2026-08-09, orchestrator).** Full-episode
every-frame validation render completed at full duration
(out/validate_pipplants_postB3.mp4, 936.21s = 28085 frames, matches the
post-B1 baseline exactly). B3 boundary committed 0a23e9c (act3, recap,
Pip.tsx pointer articulation, docs, post-b3-worklist.md), pushed.
Site DEPLOYED from clean origin/main worktree — PipPlants is LIVE on the
gallery. **CAMPAIGN PARKED PENDING MIKE** — the tweak round works from
ep4-decision-log.md top-down when his notes arrive; nothing else is gated
on him, no crew should be running. Watchdog: do NOT respawn a showrunner
for ep 4 until Mike's tweak notes arrive. Episode retro (LEARNINGS +
BIBLE updates, list in post-b3-worklist.md "Retro reminders") runs with
the tweak round.

## Backlog (owned, not started)
- **Bubbles kit gap (ep-4 B3 builder find):** the y>=170 centre clamp in
  `Bubbles` (plants scenes/common.tsx) plus absolute-`left` shrink-to-fit
  means any cutaway framing with a speaker above the midline couples
  bubble WIDTH to x-position — no per-bubble `maxWidth` lever exists.
  Worth adding when the kit next opens.
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

## Session shutdown note (2026-08-09)

Mike powered down after the ep-4 ship. The orchestrator session's
3h-recurring QUOTA WATCHDOG cron (auto-respawns a dead crew) was
SESSION-ONLY and died with the shutdown — re-arm it in the new session if
autonomous multi-wave work resumes. Offline phone versions of eps 1-3
were delivered to Mike's chat (encodes remain in out/*_phone.mp4); the
ep-4 phone render was killed mid-run at his request — re-run on ask
(recipe in memory: phone-offline-delivery). Weighted quota gate
(scripts/check-quota.mjs, 24M ceiling) + max-2-builders + wind-down at
18M/21M are the standing spawn rules.

## Open loose ends in the tree
- The technical session may have uncommitted src/site/ work. NEVER
  `git add -A`; commit by explicit path; deploy via clean worktree (recipe
  in CLAUDE.md).
- scratchpad/ holds workbenches + stills (untracked, disposable);
  rayRedesign2.tsx is the F2/ladder source of truth if Ray.tsx needs
  reference.
