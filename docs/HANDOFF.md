# HANDOFF — current status & plan (live file, updated continuously)

For a fresh orchestrator session: read docs/ORCHESTRATION.md first (how we
work), then this (where we are). Memory auto-loads the decision record.
Everything below is committed and pushed on `main` unless marked otherwise.
This file is CURRENT STATE, not a journal — git log holds the history.

## MODE: EP-6 CAMPAIGN — CUT SHIPPED 2026-10-26 (Mike AWAKE, "straight to a cut")

Mike's boot rulings 2026-10-26 (FINAL, do not re-ask): **ep 6 = the storm,
"WHY IS THUNDER ALWAYS LATE?"** (the ep-5 tease, ratified; the kids have
seen the card). **Mode = straight to a deployed cut**: no sign-off stops at
brief/treatment/script; every creative call logged in
`src/videos/<slug>/ep6-decision-log.md` TOP-first; Mike judges the deployed
episode and overturns from the list. Weekly fable at boot: 0%. Standing
rules: `node scripts/check-quota.mjs` before EVERY spawn, max 2 concurrent
builders, wind-down 18M/21M weighted. Hourly watchdog cron armed in the
orchestrator session (session-only; re-arm on a fresh boot).

Quota lore (keep): the 5-hour window is per-ACCOUNT, shared with Mike's
other sessions; the window anchors at the FIRST ACTION after the previous
reset and ccusage floors block starts to the hour, so check-quota adds
60-min slop and prints SLOP ZONE near boundaries; a session-limit kill
message's reset time beats ccusage. Never talk yourself out of a PAUSE.

## EP 6 — CUT COMPLETE, DEPLOYED (2026-10-26); retro + Mike's pass PENDING
"Boom and the One, Two, Three" (`BoomStorm`, src/videos/storm, 28,049f =
15:35), live on the gallery and the family hub (kids-hub 515d08e, tile
`vid-BoomStorm` + changelog). Commits 6841034 (story + narration) →
92a7c6f (skeleton) → 1632f1b (acts 2+3) → 13b1e90 (recap). script.md is
the source of truth; `ep6-decision-log.md` holds every call TOP-first.
Final gates on the shipped tree: typecheck 0, lint:hooks 0, authoritative
full --scale=0.25 render EXIT 0 with zero bubble warnings
(scratchpad/ep6/validate-final.log), site build 0, bible check PASS.
Audience-facing TOP items for Mike: S12 count honesty (Blue's line sits
between the flash and "One." — one-line reorder in Video.tsx if he rules),
ep-7 tease = THE MOON ("WHY DOES THE MOON CHANGE SHAPE?"), Blue's
anti-Sunny payoff FIRED, Boom casting PROVISIONAL
(`scratchpad/ep6_boom_audition/MEASUREMENTS.md` §8), half moon lit toward
the sunset, picture-only (NO sound pass — wave 4 unratified).
Phone drop DONE (out/BoomStorm_phone.mp4, 22.5MiB, 720p HEVC, delivered to
Mike 2026-10-26; master out/BoomStorm.mp4 233MB). Retro wave DONE,
committed f2c0ac9 (LEARNINGS ep-6 entry; STYLE
×4 rules: dry-run touches nothing, finger width < pitch, `volume` for
distance, onset grid; BIBLE ep-6 fold incl. Boom + Flash blocks, the hail
+ Stony, moon canon, ledger counts byte-exact, §5 ep-7 tease PROVISIONAL;
audience.md arc line; the kit-promotion backlog item below); then Mike's
tweak round from his notes (decision-log TOP-first).
Mode note: the showrunner's runs were cut by the harness around 15–25
tool calls each; resume via SendMessage worked every time.

## 2026-10-19 — hub feedback round 3: ep-2 bug pass (SHIPPED, RATIFIED 2026-10-21)
Math (8) filed eight notes on `PuffWind` and one on DripChooses' rain exit
via the hub. All fixed (commits 78ff475, fcc7218; brief with the verbatim
notes src/videos/wind/bugpass-brief.md; reports + decision log in
scratchpad/feedback-2026-10-19/), deployed and verified through the hub
proxy. **Mike's rulings 2026-10-21:** every clip call stands (`rc_16_sunny`
"Wait. What?" stays CUT; `ra_02_drip` = "Oh, no. Yippee!"); `sa_02_drip`'s
"Wheee" is fine as is, do not touch; Puff's Scene 16 ride mark is fine.
Still open, low priority: src/lib/kid bubble kit limits (y-clamp 170,
right-edge shrink-to-fit) caused most tail misses; hotel exits board says
"BALCONY ↓" for a vanishing-floor exit; STYLE.md should note af_bella does
not honour letter-stretch; ep-2 cosmetics W2–W6 in ep2-bugpass-report.md.
Little Ember → Little Obsidian pitch logged in BIBLE.md §5, unratified.

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
- Kids: DripWaterCycle (ep1), PuffWind (ep2), RaySkyBlue (ep3), PipPlants
  (ep4), EmberVolcano (ep5), BoomStorm (ep6), DripChooses + DripAgain (CYOA).

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

## EP 5 — SHIPPED (2026-08-25), canon fold PENDING
"Ember and the Mountain That Said Good Morning" (`EmberVolcano`,
src/videos/volcano, 25284f after the 2026-10-17 Scene-21 fix), live on the
gallery and the hub. script.md is the source of truth; ep5-decision-log.md
holds every call (TOP items PROVISIONAL: Ember=Playful_Girl casting,
rc_03 chant shout, a3_63 "Presently." pace, armless Ember; ep-6 tease
RATIFIED 2026-10-26). Mike's own tweak notes never arrived; the kids rated
it 🤩 via the hub. Ep-5 retro (LEARNINGS entry, STYLE adds, BIBLE fold:
volcano awake, new island, Island the third named, casting findings in
ep5-decision-log "Casting findings for the bible retro") is the ep-6
showrunner's first job. Phone drop out/EmberVolcano_phone.mp4 delivered.

## Backlog (owned, not started)
- **Ep-6 kit promotions earned (promote when the kit next opens; NOTHING
  moved yet):** `MythStamp` (now in 4 episodes' scene files);
  `perspectiveWalk`/`Chase` (act 2 — one world pace in perspective);
  `FarStorm`/`FrontHorizon` + `Hills`/`StepAndPath`/`Puddle` (act 3;
  recap.tsx carries ~90 lines of copies); `MistFloor`/`WallHole` (export
  from storm common.tsx — act 3's `FrontFloor`/`DuskHole` are near-copies);
  `HalfMoon` (lit side toward the Sun; sweep-flag reversal) and
  `NextTimeCard` (one string `NEXT_TIME`) for ep 7's end card;
  `aimTails`-default `Bubbles`, latest-turn-wins `useStage`, `HailBall`.
  (`volume` on turns and `Volcano` are already in lib.) Polish items, not
  done: a `still?: number` prop on `Horizon`/`WindowWorld`/`Mug`/
  `KidAtWindow` so held beats are literally motionless bar one body (S25
  awe, act-3 turn); S25 Sunny at scale 0.58 reads small on a phone (bigger
  hits the horizon or the curtain); the act-3 far storm is the kit tower
  dimmed + clipped at the horizon — a grey slab (real far-storm design only
  if Mike minds); an SFX layer (pure-node PCM WAVs → `public/sfx/` →
  `<Audio>`) if sound design is ever wanted; Flash's six-frame legibility
  for a six-year-old is untested.
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
