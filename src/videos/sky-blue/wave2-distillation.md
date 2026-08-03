# Ep 3 wave-2 terminal distillation — showrunner, 2026-08-02

Written at the batch-(c) checkpoint. Two audiences: the orchestrator (deploy
readiness, below) and the retro/bible writers (inputs, bottom). The staging
worklist (`wave2-worklist.md`) stays the authority on what was built and why;
this file is the exit summary.

## Deploy-readiness note

**Verdict: GO.** Wave 2 is complete and verified; the episode is ready for
the orchestrator's commit + clean-worktree deploy (CLAUDE.md recipe — never
`git add -A`), then the deployed link goes to Mike for the full-context
family screening. Full gates on the final tree, 2026-08-02: typecheck 0,
lint:hooks 0 findings, both caches 0-to-synthesize, full every-frame
--scale=0.25 render RENDER_EXIT=0 hand-verified against log + mp4 artifact
(24,374 frames = 13:32.5).

- Wave 1: verified green (audit 2026-08-02, full render exit 0).
- Batch (a): committed 4418f7e, gates green, showrunner-reviewed.
- Batch (b): committed 8d7dc08, gates green, showrunner-reviewed.
- Batch (c): inherited uncommitted from a quota-killed builder; auditor pass +
  showrunner review + full gates run by the successor session (this one).
- Post-B12 totals: **24,374 frames = 13:32.5** (runtime flag R2 stands; Mike:
  no cuts now; cut-list at script.md:2358-2365).
- Showrunner C3 sampled review, committed regions (2026-08-02, this session,
  stills in `scratchpad/w2c3sr/`): **all pass, zero fix items** —
  - s28 pack crossing 17500–17610: ladder legible, Blue/Indigo cross Green's
    slot without face occlusion; the faint expanding ring is the DESIGNED exit
    ping (`pingAt`, act3.tsx), not an artifact.
  - s28b race exits mid-animation: in-character, bounced UP, Green sailboat
    beat correct with correctly-tailed bubble.
  - One-eye 45f beat: right eye opens, left never moves, nothing enters,
    Yellow bounces off apologetically and exits upward; eye closed by the
    beat's end.
  - s28c eye→volcano dissolve (the flagged murkiest 48f): clean; scanned for
    stray bodies, none.
  - s28c empty orange frame: Red leads, Orange one body-length behind through
    all three held beats; contented, not elegiac; volcano continuous.
  - s19 three-corner bubbles: pop per clause, still, correctly tailed; the 45f
    pinball beat is empty of bubbles.

**After deploy (standing plan, from HANDOFF):** send Mike the deployed link +
ray_final_sheet.png for the full-context family screening; expect a tweak
round (cents, hours).

## Screening watch-items (relay with the deployed link)

- Ray F2 "a little alien-y" (Mike) — kids' reaction decides.
- R1 roll call reply-free — Mike may override; costs six MiniMax clips + a
  Scene 10 re-time.
- Runtime 13:32.5 — cut-list priced if it must come down.
- R4 Red stands ~350f in s28 during the goodbye (act3.tsx documents the
  re-time as the fix if a viewer calls it).
- Scene 20 comparator-Blue keeps ricocheting through the droop beat; Scene 19
  Blue/Indigo mid-leg touching at 4f lag; Indigo hero-scale braid.

## Retro inputs → LEARNINGS.md

- **Quota-kill recovery is now a rehearsed pattern and it works**: boot from
  repo, inventory tree vs last commit, auditor pass on inherited diff before
  trusting anything. Yields across the wave: 12 (wave-1 audit) + 5 (batch-(a)
  recovery) + batch-(c) recovery finds (see worklist DONE section). The
  audit-not-trust rule has paid every single time it was applied.
- **The wave survived three session deaths** (batch-(a) builder, batch-(c)
  builder + showrunner) with zero lost paid artifacts and zero re-derived
  context — because worklist DONE sections, HANDOFF in-flight updates, and
  per-batch commits were kept current. The "a wave isn't done until the next
  worklist is written" rule generalizes to "a batch isn't safe until its DONE
  section is written": batch (c) had no DONE section and cost a full audit.
- **Builder stills can be stale**: the dead batch-(c) builder's last code edit
  postdated all but 4 of its 169 stills. Verify still mtime > code mtime
  before trusting a dead agent's visual evidence.
- **B12 pattern (bad MiniMax draw)**: diagnose by s/word against the same
  voice's other clips before touching fields; cache-bust re-roll fixed it for
  ~$0.01; downstream scene re-timed automatically (audio-driven pacing paid
  off exactly as designed).
- **Front-loading Mike's ear latency worked**: B12 re-roll pulled ahead of
  batch (b); his approval landed while builders were mid-batch. No serialized
  wait anywhere in the wave.
- **Design-ruling arithmetic beats taste debates**: R9 (Scene 23 Red
  walk-across) was rejected on the builder's frame arithmetic, recorded with
  evidence stills, and never re-opened. Write the argument on the constant.

## Retro inputs → STYLE.md candidates

- The exit-ping ring (a faint expanding circle at a leaver's last position)
  reads as physics, not artifact — candidate house style for "someone left
  the formation".
- Per-body `faceOffset` (K4) is now the law for look/aim targets; box-centre
  aiming is a bug on any body whose face is not at its centroid.
- The frequency-ladder staging rule held: one shared wave speed, identity =
  frequency; signatures must survive a paused frame; Blue's blur = direction
  change, Violet's = amplitude in place.
- Bubble y-clamp 170: any speaker above y≈340 gets STILL-checked, not
  diff-checked.
- Kit gaps deferred to cleanup (NOT wave 2): <Shard> pose hardcoded
  (Yellow-only arms — "a raised arm is Yellow's" is de-facto law until the
  kit learns otherwise); no syllableBlock() geometry export; SpeechBubble
  dressing not exported (bubbleDressOf(who) wanted); bottom-edge-only tails;
  beats() not re-exported by common.tsx; blueTrail unusable at formation
  scale over painted plates; SleepingVolcano exists twice with divergent
  behaviour (promotion to src/lib is the cleanup-list headline).

## Retro inputs → series bible (docs/kids/BIBLE.md, first write-up at wave-3 boundary)

- Volcano escalation ledger: ep 2 asleep/unmentioned → **ep 3 one eye (s28b)
  + stirring tease (s35, Sunny claims it, narrator "Hmm. We will find out.")**
  → ep 4 awake. The one-eye beat is now canon: it acknowledged awareness
  exactly once, silently.
- Violet: NEVER speaks (five firings this ep incl. recap panel); the only
  character who addresses him is Yellow ("Great bounce, Violet!").
- Orange's entire vocabulary may be "What Red said." — this episode and every
  future one.
- Red's laws: one speed, dead straight, never reacts, 16f approach gaps,
  `calm` on every line forever. Blue's: 4f gaps, never travels half a frame
  without changing direction, apologises to things he hits.
- Indigo = Blue's echo: same voice pitched +3, four frames/beats late,
  repeats the tails of Blue's lines. Drawn behind and 26px under Blue.
- Banked for ep 4: the wrongness ceremony ("I did that." / "No. He really
  didn't."), "That is not me.", ep-2's long fuse (a2_45/a2_45b untouched).
  Sunny enters ep 4 having claimed the volcano on the record.
- Running-gag state: "You're welcome!" at seven firings; credit-allocation
  joke at three firings/three speakers; roll-call shape (name → flat narrator
  line → unbothered button) is a series signature — reply-free is a RULING
  (R1), revisit only on Mike's screening override.

## Batch (c) — recovered and closed at checkpoint

- Inherited uncommitted from a quota-killed builder; auditor pass CONFIRMED
  C1/C2/C3-fix (24 CONFIRMED / 2 MISSING / 2 WRONG / 7 SUSPECT — full
  disposition in wave2-worklist.md's Batch (c) DONE section).
- Showrunner still review on fresh renders (scratchpad/w2c3sr/): C1 chant
  panels, C2 s29 walk-behind, C3-fix all pass. New ruling **R10** (Red /
  Blue / Violet continue their laws through the 20f deadpan beat; Sunny's
  frozen clock carries the stillness) written into recap.tsx. Accepted
  deviation **D-a1_49** (Drip bubble down-tail; proper fix = SpeechBubble
  top-edge tail, cleanup list).
- All post-audit edits were comment/doc-only — render-identical, so the
  full gate render covers the final tree.

## Additional retro input (batch-c recovery)

- **Verify auditor citations against the tree before editing**: the audit's
  interim summary carried a wrong key name, wrong line numbers, and one
  find (a debug block) that did not exist in the diff; the full report was
  careful and correct. Same rule as builders: reports are leads, the tree
  is the evidence.
- Panel/split-screen scenes: a clip wrapper creates a stacking context and
  silently reorders characters vs panel dressing — audit z-order whenever a
  body gets wrapped. (Here it landed as an improvement and was ratified.)
- **Gate renders: trust the artifact, not the exit signal.** Two traps hit
  in one evening: (1) a backgrounded `render | tail` was silently killed by
  the harness's default 120s timeout and still reported "completed, exit
  0" — empty log, no mp4; (2) a completion watch grepping a remotion log
  mis-fired because progress lines are \r-separated (one giant physical
  line can contain "Rendered N/M" for every N). House procedure now:
  detach long renders (`nohup … > log`), normalize `\r` before grepping,
  and the gate is "the mp4 exists at the declared path AND the log's own
  exit line is 0" — never a notification alone.
