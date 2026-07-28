# Findings — what survived contact

The Phase 2 verdict in one line: **the architecture works — state, not
talent, is what holds a branching world together — but only after the pilot
forced six spec amendments, and one process rule matters more than all of
them: the audit layer is not optional.**

Run shape: 1 architect → 6 writers (3 waves: intro/a-pipe/b-wall → mid →
c-cut/d-float → ending) → 4 per-path auditors → 1 consolidated fix round.
All agents Opus, orchestrated per docs/CYOA.md's generation architecture.

## What worked, and is now proven rather than hoped

- **Computable clocks turn continuity into arithmetic.** The architect's
  best move was unprompted: the tide (`11 − ⌊min/30⌋`), Nan's brick
  (`1 + ⌊min/15⌋`) and Grumble's twelve-minute complaint list made W-3/W-4
  checkable by recomputation. Every planted timetable violation was caught
  *by formula*, not by memory. **Phase 3 rule: every episode's tree gets at
  least one published, computable clock.**
- **The ledger licensed exactly the right divergences.** All six choice-1/
  choice-2 entry sets paid off visibly; auditors could and did trace every
  branch difference to an id or flag it. The C2 "cosmetic choice" check
  correctly detonated when a callback was (deliberately) deleted.
- **The default-consistency rule produced the design's best moments for
  free**: Nan reaching brick seventeen at noon on all four paths meaning two
  different things; Grumble's hour-early day cascading from one woken nap.
- **Merges with memory work.** Both merges reconciled; variant inserts
  carried the differences; the trunk callback (M2, the door) lands on every
  path.
- **Seeded violations: 5/5 caught, each by the check designed for it**, and
  the one unplanted slip left in as a probe was caught twice independently.
  See `seeding.md`.
- **Writers corrected the orchestrator twice from the timetable alone**
  (d-float's rock-pass timing; c-cut's peg reconciliation) — the state docs
  gave them the authority to do it without asking.

## What broke, and what fixed it

- **~60 real findings nobody planted**, and the pattern is the spec's
  root-cause claim vindicated in the negative: almost every one was a fact
  that lived in TWO places (prose + doc, or two segments) with nothing
  forcing agreement. Sixteen-vs-seventeen bricks in four files; 40−11
  = "thirty"; a mnemonic garbled between segments; a gag inverted; knowledge
  lists silently thinning as they flowed downstream. None of these are
  talent failures — they are exactly what the audit layer exists for.
- **Shared segments need one state doc per incoming path.** The schema said
  "one doc per segment"; `mid`, the choice-2 branches and `ending` all
  needed per-path docs (2/2/2/4). Schema amended in practice; make it
  explicit in Phase 3's schema.
- **Choice-2 branches are themselves shared segments** (each plays under
  both choice-1 histories) and needed tagged variants the insert budget
  never anticipated. tree.md §6 now budgets them. Phase 3: the architect
  budgets variants for EVERY segment downstream of a second choice.
- **"An insert is one narration line" was fiction** — the emotional payoffs
  (E3, E5, E6) are multi-line beats and should be. Budget rows now size
  inserts as beats.
- **Six spec-level ambiguities** the architect flagged on day one (merge
  cast vs variant presence; baseline rule at exhaustive choices; ledger ids;
  time-rate enforceability; per-path promises; G1's escape hatch) all
  turned out to matter — auditors hit every one. The pilot's resolutions
  (skeleton-critical cast, two-tagged-variants, L-ids, published timetable,
  path-scoped promise lists, named-paths-only open promises) should be
  folded into docs/CYOA.md before Phase 3.

## Audit-layer calibration

- The checklist over-fired in two places, both now amended: C1 needed a
  "branch segments diverge wholesale" clarification, and G1 needed the
  choice-prop exemption (the oyster shell on float paths is paid by the
  choice card itself).
- The fix round found 7 defects all four auditors missed — mostly step-1
  doc diffs at the *second* merge (auditors only diffed the first). Phase 3
  checklist: run the five-step diff at EVERY merge, not the first one.
- Auditor cost: ~4 × 170k tokens; fix round ~280k. For a real episode this
  layer is the difference between "consistent by construction" and
  "consistent by hope" — keep it, and keep the seeding practice: it is the
  only way to know the auditors are awake.

## Architect rulings made during the fix round (now canonical in the docs)

R1 sixteen brick-lengths · R2 twenty-nine Crumbs · R3 one loop mnemonic ·
R4 the kittiwakes always get the same two notes wrong · R5 the ground
behind the Boat Shed is higher than the slip (Pipe gradient holds) ·
R6 every journey takes eighty minutes all-in, whatever the load ·
R7 insert budgets cover choice-2 branch segments, inserts sized as beats ·
R8 the six-word cap binds bubbles at video time, not spoken lines ·
R9 choice-visualization props are paid when the choice fires ·
R10 C1 governs shared segments; knows-lines trace to scenes or ledger ids ·
R11 sibling docs textually identical at merges except licensed rows ·
R12 knows-lists carry forward unless a scene removes a fact ·
**Post-fix ruling on pipe-float A-5:** Barnaby's "It comes out where I can
see" stands — he sees the shed, not the hidden mouth behind it; P4 is
intact, and the line being *almost* a contradiction is the point of the
beat.

## Status and what Phase 3 needs

- One fix round applied and re-verified by the fixing agent; a formal
  re-audit of all four paths has NOT been run. Before any Phase 3 build,
  re-run the four auditors on the fixed set (they should come back clean or
  near-clean; budget one more small round).
- Deliverables for review: `transcript.md` (read this), `bible.md` +
  `tree.md` + `state-schema.md` (the surviving schema), `audit-checklist.md`
  (as amended), `seeding.md` (the audit layer's report card), `audits/*`
  (raw findings).
- Phase 3 preflight, beyond the above: fold the spec amendments into
  docs/CYOA.md; decide whether *Crumb* is the Phase 3 episode or a fresh
  story reuses the machinery; wire the per-path state docs into the variant
  props/clips mechanism Phase 1 proved in the player.
