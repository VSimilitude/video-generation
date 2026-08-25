# HANDOFF — current status & plan (live file, updated continuously)

For a fresh orchestrator session: read docs/ORCHESTRATION.md first (how we
work), then this (where we are). Memory auto-loads the decision record.
Everything below is committed and pushed on `main` unless marked otherwise.
This file is CURRENT STATE, not a journal — git log holds the history.

## MODE TONIGHT: Mike-ASLEEP (2026-08-24, back from trip; see
ORCHESTRATION.md "Operating modes")

Mike Mon night 2026-08-24: 0% weekly (resets Fri) + 0% session used — "plan
to use all or most of it for this project"; if he doesn't reply, move on
with best guesses and LOG decisions for later. Decisions taken at boot:
**start the ep-5 campaign overnight** (his pick); ep-4 phone render SKIPPED
(his pick). Hourly watchdog cron ARMED in this session (job 7918a398,
session-only — re-arm on any fresh autonomous boot). Do NOT park a campaign
at a sign-off gate while he sleeps; screenable + deployed + a short list of
calls to overturn beats documents to read. Normal gates resume when awake.

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

## EP 4 — SHIPPED (2026-08-09), PARKED for Mike's tweak round
"PipPlants" (plants/photosynthesis), src/videos/plants, 28085 frames,
live on the gallery. All waves committed through 0a23e9c (B3) — git log
6db4202→0a23e9c holds the campaign history. When Mike's tweak notes
arrive, the tweak round works from ep4-decision-log.md TOP-DOWN; episode
retro (LEARNINGS + BIBLE updates, list in post-b3-worklist.md "Retro
reminders") runs with the tweak round — though the ep-5 showrunner may
fold ep-4 CANON into the bible earlier for story work (log the call).
Pending Mike's eye/ear (non-blocking): Pip casting `Inspirational_girl`
(clips scratchpad/ep4_pip_audition/, sheet scratchpad/ep4_pip_sheet.png;
calls in decision-log TOP). Builder weak points for the retro are logged
at the end of the reboot-4 notes in git (d2841ef..0a23e9c messages) and
in post-b3-worklist.md.

## IN FLIGHT: ep 5 — the volcano wakes
Campaign showrunner spawned 2026-08-24 (Mike-asleep mode, fresh weekly
quota — his call: burn most of it here). Arc canon + guardrails:
docs/roles/audience.md "Series arc canon" (ep-2 Rock cast in ep 5,
outgassing OUT of scope, volcano sleep-gag had its final rep in ep 4,
soil bridge from ep 4). Runtime rule: 10–30 min, hit the beats, never
target a duration. Path: bible canon catch-up (showrunner's call) →
brief → treatments → script → staging waves → deployed screenable cut,
straight through, no sign-off stops; all creative calls LOGGED in an
ep5 decision log for Mike's tweak round. Standing spawn rules: quota
gate before EVERY spawn, max 2 concurrent builders, wind-down 18M/21M.

Campaign state (showrunner keeps this current):
- Slug `volcano`, dir src/videos/volcano/ live: ep5-decision-log.md
  (boot + brief calls logged), ep5-brief.md (FINAL for treatments).
- Ep-4 CANON folded into BIBLE.md (2026-08-24, canon only — PROVISIONAL
  markers on everything Mike hasn't ratified; extraction record
  scratchpad/ep5/ep4-canon-extract.md). Ep-4 taste/process retro still
  belongs to Mike's ep-4 tweak round.
- Treatment round DONE: ep5-treatment-A.md + ep5-treatment-B.md landed;
  showrunner synthesis ep5-synthesis.md is the rule of record (B's
  structure + A's spine gag; ceremony at the eruption; volcano speaks 7
  lines; title "Ember and the Mountain That Said Good Morning"; ep-6
  tease = thunder, TOP-logged for Mike).
- script.md LANDED (31 scenes, 189 lines) + showrunner edit pass DONE
  (rulings in script.md "Showrunner edit-pass rulings"; Scene-5 Sunny
  pair promoted to load-bearing; all 12 writer deviations accepted).
  script.md is the single source of truth for the cut.
- NARRATION WAVE (resumed 2026-08-25 by a fresh showrunner after the
  2026-08-24 ~22:24 connection drop killed the prior crew mid-wave):
  narration.mjs LANDED (dead opus builder, imports clean, UNAUDITED)
  → auditor pass DONE (spec-faithful; findings
  scratchpad/ep5/narration-audit.md) → repairs APPLIED (rc_04 aliased,
  wake-claim wording = recorded take, doc fixes; rulings in decision
  log) → 4 cache migrations SEEDED into public/narration/volcano/
  (hashes replayed MATCH; first gen run must show all four `(cached)`)
  → Ember audition DONE (16 voices measured; the dead builder's
  `Lovely_Girl` was unbacked and measured worst-fit; RATIFIED PICK
  `Playful_Girl`, no pitch construction — PROVISIONAL, Mike's ear
  pending, shortlist in scratchpad/ep5_ember_audition/MEASUREMENTS.md
  §8; constant set in narration.mjs; TOP-logged in decision log)
  → TTS GENERATION DONE, ALL GATES GREEN: 4/4 migrations `(cached)`
  both runs; 189 mp3s = 189 cache keys = 189 manifest entries; 13/13
  aliases byte-identical to sources; fuse a2_39 byte-identical to
  wind a2_45; typecheck clean; 172 fresh draws ≈ $0.25; 2 re-rolls
  (rc_03 "Lava!", a3_75 Pip — both improved, takes preserved);
  cadence recomputed from real durations, NO breaches (median laugh
  gap 6.0s, worst 44.0s = the ceremony hold under its 45–48s claim,
  Scene 5 39.5s under its 45s ceiling); 699.9s spoken / 13:22 wall
  before staged holds — in the 10–30 window, NO trims (never target
  a duration). Full detail scratchpad/ep5/narration-wave-report.md.
  Ear-pending flags (Mike, PROVISIONAL): Ember=Playful_Girl casting
  (shortlist MEASUREMENTS.md §8), rc_03 "Lava!" softest chant shout,
  a3_63 "Presently." pace.
- NARRATION WAVE CLOSED. Next: SKELETON WAVE — worklist written at
  scratchpad/ep5/skeleton-wave-worklist.md (Video.tsx + timed SCRIPT
  table + ScenePlaceholders + Ember rig + cold open + act 1 +
  Root/registry entries; held-beat staging list and carry-forward
  flags inside). Then act waves, still review, gates, deploy.
- COMMIT POINT for the orchestrator (explicit paths, never add -A):
  src/videos/volcano/narration.mjs, src/videos/volcano/script.md,
  src/videos/volcano/ep5-decision-log.md,
  src/videos/volcano/narrationManifest.ts,
  public/narration/volcano/ (whole dir, new), docs/kids/BIBLE.md,
  docs/HANDOFF.md.
- Then: skeleton wave (Video.tsx + timed placeholders + Root/registry),
  act waves, still review, gates, deploy.

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

## Phone delivery state
Offline phone versions of eps 1–3 delivered to Mike's chat (encodes in
out/*_phone.mp4). Ep-4 phone render: Mike ruled SKIP (2026-08-24) —
re-run only on ask (recipe in memory: phone-offline-delivery).

## Open loose ends in the tree
- The technical session may have uncommitted src/site/ work. NEVER
  `git add -A`; commit by explicit path; deploy via clean worktree (recipe
  in CLAUDE.md).
- scratchpad/ holds workbenches + stills (untracked, disposable);
  rayRedesign2.tsx is the F2/ladder source of truth if Ray.tsx needs
  reference.
