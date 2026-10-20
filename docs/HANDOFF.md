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

**Reset-boundary recalibration (2026-08-25, mid-flight kill + Mike's
ruling):** the real window anchors at the FIRST ACTION after the previous
reset; ccusage floors block starts to the hour, so its predicted reset can
run up to an hour early (observed: predicted 11:00 ET, real 11:50). A
showrunner + ACT2 builder were killed at 11:47 after a false "fresh
window" PROCEED at 11:04. check-quota now adds 60-min boundary slop to
the reset estimate (QUOTA_RESET_SLOP_MIN) and prints a SLOP ZONE warning
for readings taken just after a floored boundary — when the previous
window died at the session limit, trust the API kill message's reset time
over ccusage.

## 2026-10-19 — hub feedback round 3: ep-2 bug pass (IN FLIGHT)
Source: `npm run feedback` in kids-hub, 2026-10-19 00:48–01:22, all Math
(8): eight notes on `PuffWind` (bubble tails pointing wrong episode-wide,
dandelion seeds unanchored, birds drawn under background / static on the
beach, Puff jittering at Cloudia's first entrance, dandelion floating
before her second, Sunny's roll-call "Wait. What?" with no setup), one on
DripChooses' rain exit (`ra_02_drip`), one 🤩 pitch on DripAgain (Little
Ember → Little Obsidian; logged in BIBLE.md §5, unratified). Brief with the
verbatim notes: **src/videos/wind/bugpass-brief.md**. Showrunner spawned
by the orchestrator; reports + decision log land in
scratchpad/feedback-2026-10-19/. Orchestrator commits by explicit path on
landing, then deploys from a clean worktree and updates the hub if needed.

Campaign state (showrunner keeps this current):
- Showrunner booted; ruling on #8 = CUT `rc_16_sunny` + its beat (TOP of
  scratchpad/feedback-2026-10-19/decision-log.md). Two builders spawned
  on main in place, disjoint files: A = src/videos/wind (notes 1–8, brief
  scratchpad/feedback-2026-10-19/builder-A-brief.md), B = src/videos/drip-fork
  rain exit + Whisper gate (builder-B-brief.md). B DONE round 1: audio was the bug (Whisper 'Oh, no, we'); shipped 'Oh, no. Yippee!', gates green; round 2 (hover held through 'Oh, no.', bubble moved clear) DONE, gates green, showrunner still review ACCEPT. B's changed files: src/videos/drip-fork/{narration.mjs,narrationManifest.ts,scenes/rain.tsx}, public/narration/drip-fork/{ra_02_drip.mp3,.cache.json}. Reports land as
  ep2-bugpass-report.md / dripfork-rain-report.md in the same dir.
- A round 1 DONE: all eight notes fixed (report ep2-bugpass-report.md; 18
  bubbles re-placed, birds unclipped, Scene 16 sawtooth removed, gulls
  animated, hillside meadow pinned, rc_16 CUT — public/narration/wind/
  rc_16_sunny.mp3 DELETED by the generator, copy in the scratchpad dir).
  Showrunner gates run on A's tree: typecheck 0, lint:hooks 0 findings,
  `npm run site` exit 0. Showrunner still review ACCEPT except W1 →
  A round 2: Scene 16 Cloudia bubble hiding Puff (decision-log TOP).
- A round 2 (W1) DONE: Puff's Scene 16 ride mark moved to x 1560, bubbles
  re-placed; showrunner review ACCEPT; typecheck/lint green; `npm run
  site` re-run green on the final tree. Quarter-scale every-frame
  PuffWind render EXIT=0 (22353f). ROUND COMPLETE, awaiting orchestrator
  commit by explicit path (files listed in the showrunner's hand-back and
  in the two report files) + deploy + Mike's ear checks.

## 2026-10-18 — DripAgain, the sequel CYOA (SHIPPED: commit 87f9b37, deployed to gh-pages; hub tile live)
Source: the hub's second feedback round — Math (8) re-rated the expanded
DripChooses 🙂 Fun! and pitched a sequel (Drip goes up again; Cloudia away
on important business; a beaver's dam or a mountain that is really a
volcano); Mike added obsidian forming when the lava reaches the dam's lake,
asked for a SEPARATE video, and then for a "left or right" half-choice in
each first branch. Built as **`DripAgain` — "Drip Goes Up Again"**,
`src/videos/drip-again/`: nine segments, four choice points per watch
(`where`, `valleyWay`|`mountainWay`, `wayOut`), eight paths 5:11–5:55.
Design + every line + the builders' Build calls: `src/videos/drip-again/brief.md`.
New pattern: a **half-choice** is a real card whose two options both go to
the same next segment, which swaps variant lines/pictures (`VariantLine`
is now `{ keys, pick(choices) }`; `hm_04` keys on two choices). No
src/site changes. Gates green: typecheck, lint:hooks,
`node scripts/check-branching.mjs DripAgain`, full-scale render (one path)
+ quarter-scale renders, `npm run site`. Still review by forks: ACCEPT
WITH NOTES → fix pass (dam wide and low, lodge in water, valley scaled up
in the intro wide, CRACK clear) → re-check pass. Post-build copy change:
`da_03a` lengthened to fill its variant slot. Sign fix in dam.tsx: Drip
rides the falling trunk. Nits left for Mike: lava front reads as a crystal;
heat shimmer faint; "two specks" gag unfindable; path length well over
the brief's 3¾ min (copy cuts, mainly the intro, if wanted). NOTHING
HEARD YET (Beaver = kokoro am_michael 1.05; one-word "Dam."/"Busy." clips).
Mike said "push it" the same evening: committed by explicit path (87f9b37),
pushed, deployed from a clean worktree; kids-hub tile `vid-DripAgain`
committed (1c7f39e, local-only repo) and deployed. Awaiting the kids'
verdict via `npm run feedback` in kids-hub, and Mike's own pass on the
overturn list above. Note: the hub's `/videos` proxy serves GitHub Pages
through Cloudflare's cache, so a fresh gh-pages deploy can take ~10 min to
show at kthanks.com, and the proxied cache-control says max-age=14400.

## 2026-10-17 — the hub feedback round (COMMITTED 53a9bdc…d677f95, deployed 2026-10-18)
Source: the family hub's first feedback round (Math, 8). Retro entry at the
top of docs/LEARNINGS.md; bible world rules 15–16 added. Four changes,
all gated (typecheck, lint:hooks, site build, full every-frame renders),
committed and live; ear checks still pending:
- **Ep 4 chant** (src/videos/plants): the five hero syllable clips are
  replaced by five Narrator kokoro clips `a3_65`–`a3_69_narrator` (0.92),
  spaced by computed `chantGaps()`; recap `rc_07`–`rc_11` alias them;
  visual slams unchanged. Ten hero mp3s DELETED, ten Narrator mp3s added
  (stage the deletions). Ruling + Whisper table in ep4-decision-log.md TOP.
  Ear-pending: "The." alone transcribes as "thy"; chant feel at 0.78s/syllable.
- **Ep 5 Scene 21** (src/videos/volcano): new `a3_49b_narrator` ("Lots of
  islands, and one volcano...") + a travelling RowPointer highlight; episode
  24948→25284f. ep5-decision-log.md TOP. Ear-pending: "long, long ago".
- **DripChooses expansion** (src/videos/drip-fork, CYOA phase 1.5): three
  choices (wayUp/wayDown/whereTo), ten segments, eight paths 4:41–5:20.
  Design + Build calls in src/videos/drip-fork/expansion-brief.md. Player:
  `lastChoiceSegment` + "Change my last choice" end-card button;
  `npm run check:branching` self-check. docs/CYOA.md has the pilot's six
  resolutions folded in. 68 new kokoro mp3s, 4 deleted. NOTHING HEARD YET.
  Browser check at phone size: see scratchpad/feedback-2026-10-17/.
- **Player fix (src/site/ChoiceCard.tsx):** on a stage shorter than 360px
  (iPhone portrait, windowed) the choice/end cards now cover the viewport
  (`position: fixed`) instead of scrolling inside the 199px-tall player box
  where the second option and every end-card button were hidden. Found by
  the 2026-10-17 phone check (pre-existing since phase 1). Re-check log:
  scratchpad (session) fixcheck/log-390.txt.
- kids-hub catalog blurb for vid-DripChooses updated (that repo, uncommitted).
Reports + stills: scratchpad/feedback-2026-10-17/. Still reviews (forks):
ep-5 ACCEPT, ep-4 ACCEPT; pre-existing notes for Mike's passes: Puff's
bubble covers part of the island row (ep 5 s21); recap reprise block
colours differ from Scene 24's; the definition sub-line crosses Sunny's disc.
Commit plan: three commits by explicit path (plants / volcano / drip-fork+site+CYOA.md)
plus one docs commit; then deploy from a clean worktree per CLAUDE.md.

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
- NARRATION WAVE CLOSED + COMMITTED (orchestrator, 7634741; Ember
  ear shortlist delivered to Mike's phone, PROVISIONAL, no reply
  expected). SKELETON WAVE IN FLIGHT (opus builder, spawned
  2026-08-25 from scratchpad/ep5/skeleton-wave-worklist.md):
  Video.tsx + full timed 31-scene table + ScenePlaceholders + Ember
  rig + cold open + act 1 (incl. the volcano wake staging) +
  Root/registry entries + act-1 backgrounds; mandatory still
  self-review; gates typecheck + full --scale=0.25 render + site
  build; report → scratchpad/ep5/skeleton-wave-report.md. Wave
  landed, all gates green (24,948f = 13:52 registered, 31 scenes
  timed, all held beats machine-verified, Ember rig + volcano
  character + cold open + act 1 built, 7 plates, registry entry).
  Showrunner sampled review: ACCEPTED with one fix in flight
  (volcano portrait bubble tail re-anchored eye→mouth for V1/V2 +
  the inherited pattern; builder re-gating). Rulings logged in the
  decision log (no-arms Ember ratified, MAGMA 24f beat ratified,
  Pip promotion sanctioned for act 3, KidSilhouette promotion
  deferred). Act-waves worklist written:
  scratchpad/ep5/act-waves-worklist.md (ACT2+ACT3 parallel, RECAP
  after one lands; max 2 concurrent).
- SKELETON WAVE CLOSED (committed c0940bb by orchestrator; successor
  showrunner acceptance pass 2026-08-25 PASSED — fresh 16-still
  re-render from committed code, stills_accept/, zero repairs; ruling
  in the decision log). First ACT2+ACT3 builders and showrunner #3
  killed ~11:47 ET at the session limit (transcripts lost).
- ACT-WAVE SALVAGE (successor showrunner #4, 2026-08-25): the dead
  builders' WIP audited and KEPT — act2 (s10–s17) + act3 (s18–s26)
  structurally complete, 17/17 smoke stills render, sampled stills at
  bar. Repairs by hand: Pip re-exports added to scenes/common.tsx
  (typecheck now green), orphaned plates black_beach_night + meadow_day
  adopted into the background cache with reconstructed hashes (no
  re-roll; 12/12 cached, manifest regenerated). Rulings in
  ep5-decision-log.md "Act-wave salvage calls". COMMIT POINT handed to
  the orchestrator (salvage checkpoint, explicit paths in the report).
- ACT-RESUME WAVE CLOSED (2026-08-25): ACT2 + ACT3 resumed audit-first,
  21 repairs between them (bubble tails act-wide, over-limit bubbles,
  evening wash, crest slab, held-beat intrusions...), all gates green
  incl. full renders EXIT 0, showrunner sampled review ACCEPTED zero
  repairs. Rulings in ep5-decision-log.md "Act-resume-wave calls"
  (s23 crop kept, a3_62 summary ratified, dusty-rose ratified, tail-aim
  kit promotion → backlog). COMMIT POINT handed to the orchestrator
  (act2.tsx, act3.tsx, decision log, HANDOFF).
- RECAP WAVE CLOSED + EPISODE CUT COMPLETE (2026-08-25): all five recap
  scenes staged, 10 builder finds fixed, authoritative full-union gate
  render EXIT 0 with zero bubble warnings (scratchpad/ep5/
  recap-render.log), showrunner sampled review ACCEPTED zero repairs.
  Rulings + backlog adds (volcanoBubble seat gap, SeaWorld/aimTails
  promotions, mix-blend-mode STYLE line) in ep5-decision-log.md
  "Recap-wave calls". No site-registry diff needed (EmberVolcano
  already public via src/videos/registry.ts). COMMIT + DEPLOY POINT
  handed to the orchestrator: src/videos/volcano/scenes/recap.tsx,
  src/videos/volcano/ep5-decision-log.md, docs/HANDOFF.md.
- Phone drop DONE: out/EmberVolcano_phone.mp4 (25.2MiB, 720p HEVC hvc1
  CRF 29 +faststart, encoded via `npx remotion ffmpeg` — system ffmpeg
  is not installed). Full-scale master at out/EmberVolcano.mp4 (274MB,
  not for chat). Handed to the orchestrator for delivery to Mike.
- Remaining (post-deploy, next session if quota kills this one): Mike's
  FULL-CONTEXT ear/eye pass on the deployed episode (Ember casting
  PROVISIONAL, rc_03 chant shout, a3_63 "Presently." pace, armless
  Ember look), tweak round from his notes, then retro: LEARNINGS.md
  entry + STYLE.md adds + BIBLE fold (ep-5 canon: volcano awake, new
  island, Island the third named) + kit-cleanup backlog triage.
- Then: showrunner sampled still review, gates, site gallery entry
  (deferred to the deployable cut), deploy.

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
