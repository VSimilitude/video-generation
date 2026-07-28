# CYOA engine pilot — Phase 2 (text only)

The engine dry-run specced in `docs/CYOA.md` ("Phase 2 — engine pilot, text
only"): architect → branch writers → continuity auditors on a miniature
story, no video. The point is to battle-test three things before an episode
depends on them: the **state-doc schema**, the **audit checklist** (including
whether it catches violations planted on purpose), and whether the resulting
tree reads as one consistent world.

## Shape of the pilot story

- 2 choice points, foldback after each: `intro ─C1→ (A | B) → mid ─C2→
  (C | D) → ending` — 7 segments, 3 scenes each, 4 root-to-leaf paths.
- Merges carry memory: `mid` and `ending` are shared skeletons with
  ledger-driven variant inserts.

## How to read this directory

| File | What it is |
| --- | --- |
| `bible.md` | World bible (invariant across all branches) |
| `tree.md` | Topology, what each choice means, ledger stubs, NPC schedules |
| `state-schema.md` | The per-node state-doc schema + root instance |
| `segments/<id>.md` | Each segment: scenes + its output state doc |
| `audit-checklist.md` | The checklist the auditors ran |
| `audits/<path>.md` | Per-path audit findings |
| `seeding.md` | The violations planted deliberately, and which were caught |
| `transcript.md` | **Start here** — all four paths, readable end to end |
| `findings.md` | What survived contact; recommendations for Phase 3 |
