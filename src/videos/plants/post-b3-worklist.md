# EP 4 — post-B3 worklist (written at the B3 boundary, 2026-08-09)

Successor boot path: `docs/kids/BIBLE.md` → `ep4-decision-log.md` →
`script.md` → this file. B3 closed the staging wave: all 29 scenes staged,
audited, repaired, showrunner-accepted; full-episode every-frame validation
at the boundary (result in HANDOFF). Scratchpad audit/verify files are
disposable history; the decision log is the record.

## Immediate (orchestrator, no showrunner needed)

1. B3 boundary commit (list in the showrunner's boundary report) + push.
2. Deploy the screenable cut: site build from clean worktree of committed
   origin/main (recipe in CLAUDE.md). PipPlants is already registered in
   Root.tsx + src/site/registry.ts (B1).
3. Send Mike the link + the decision-log TOP list (voice + body sheet) +
   "calls to overturn" pointer at ep4-decision-log.md. His review runs the
   tweak round; nothing else is gated on him.

## Pending Mike (front-loaded, shipped already)

- Pip voice: `scratchpad/ep4_pip_audition/` (9 clips) — cast
  `Inspirational_girl` provisionally, in-cut.
- Pip body: `scratchpad/ep4_pip_sheet.png`.
- Ep-3 leftovers: 3 ear-check clips; ep-1 family verdict; ep-2 ear checks.

## Tweak-round candidates (showrunner, when Mike's notes arrive)

Work from `ep4-decision-log.md` top-down; everything there is reversible at
the stated cost.

## Deferred defects/polish (none block the cut)

- `leafAt` ignores `pipLean` — s23's screen angle loses the lean's 12.5°.
  Aim still reads (lean + eyes + lift). Fix only with POINT_CEILING at the
  rig's 61.1° so there's headroom. (Pointer builder weak point 2.)
- s24 ends pointer at 14°, s25 opens at 10° — 4° step across a legal time
  cut. One line if it ever shows.
- `young` growth state's pointer node sits 13 units under the pod
  (LEAF_NODES[4].u=0.84) — invisible at rest today, bites the first scene
  that raises the young-state pointer.
- "Raised toward, not pointing at": the rig's honest aim tops out at 61.1°
  and the chord reads ~30°. Real fixes (lower pointer node / leaf over
  pod) were rejected this episode — revisit only if Mike flags s23.

## Kit-cleanup additions from this wave (join the standing backlog)

- `goldenGrade`, `SunWash`, `NearCrest`/`NearField`, `OldTree`/`FieldTree`,
  sprout row: now duplicated across act3.tsx and recap.tsx → promote to
  plants scenes/common.tsx (or lib) at the cleanup pass.
- `Bubbles` y>=170 clamp + no per-bubble `maxWidth` (already in HANDOFF
  backlog) — bit twice this wave.
- OldTree cross-episode promotion (three copies, three palettes) — standing
  item, still deferred.

## Retro reminders (episode retro collects these; showrunner owns BIBLE)

- Bible counter updates owed: Puff catch-phrase count recount (see
  wave-b-worklist.md), "Different show. Same ___." now 6 blanks
  (+beam, +weather), credit-allocation device at 5 firings
  ("It is mostly him."), Ray's NEW vindication tic "That is also true."
  (3 sameAs firings) needs a bible entry + Mike's ear flag.
- Pip joins the bible: body/growth states, no-arms rule, leaf-point rig
  (POINT_HELD/POINT_CEILING semantics), skeptical resting face, voice.
- Volcano ladder advanced: ep-3 one eye → ep-4 wordless stir (s13) →
  ep-5 wakes. Sunny's banked wake-claim STILL banked for ep-5 cold open.
- Process learnings for LEARNINGS.md: the two-kill B3 recovery pattern
  (audit-not-trust on killed builders' work found real drift both times;
  repair-verification auditors after killed repair builders found 4+7 new
  items), quota gate before EVERY spawn + after every completion, max 2
  concurrent builders, wind-down thresholds (18M/21M), per-act checkpoint
  commits (act1+act2 landed d2841ef mid-wave and survived reboot risk).
- TTS cache/ffmpeg note + ep-2 tidy: carried in wave-b-worklist.md.
