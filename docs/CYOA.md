# Choose-Your-Own-Adventure engine — design spec

Status: **approved design, pre-prototype** (Mike + Fable, 2026-07-26).
This document is self-sufficient: a fresh orchestrator should be able to
build the prototype from it plus the repo's existing docs (CLAUDE.md,
docs/STYLE.md, docs/PROCESS.md). The kids' series context lives in
docs/LEARNINGS.md (water-cycle and wind entries).

## Why (the failure modes we are fixing)

Typical CYOA shows branch, but cheaply. Mike's diagnosis, which this design
treats as the requirements list — the product must avoid all three:

1. **No memory.** Branches never refer back to choices you made (shared
   branch segments can't know your path).
2. **Random impact.** Consequences don't trace to the choice ("you chose to
   bring a friend, so... you happen to see a monkey").
3. **World inconsistency.** Facts differ across branches with no cause (the
   robot is at the factory in one branch, never left home in another).

Requirement (a): branches must genuinely diverge — no cosmetic forks.
Requirement (b): the three limitations above are handled *by construction*,
not by author vigilance.

**Root-cause claim**: all three are symptoms of generating branches from
local context with no shared world model and no causal bookkeeping. The fix
is state, not talent.

## Core design

Three documents flow through the story tree:

- **World bible** (invariant): characters, locations, starting positions,
  rules of the world, tone. Identical for every branch. Nothing may
  contradict it.
- **State doc** (per node): who is on stage, where everyone is, what the
  protagonist has/knows, time of day, open promises to the viewer
  (Chekhov ledger). Every branch node has exactly one.
- **Causal ledger** (per path): append-only list of consequences, written
  at each choice. `chose bring-Maya → Maya present; Maya's flashlight
  available`. Ledger entries are the ONLY licensed source of divergence.

**The default-consistency rule** (the heart of the design): everything not
causally touched by a choice happens identically in every branch. NPCs run
on their own schedules; the robot goes to the factory in all branches
unless a choice interferes. Branches are different routes through ONE
consistent world-day, not alternate realities. For a rewatching child this
is the payoff, not a constraint: choose differently and you discover *why*
the robot went — consistency across branches is what makes replay feel
like exploring a real place.

Two authoring rules on top:

- **Consequences foreseeable in kind, surprising in detail.** A viewer must
  be able to predict the *category* of outcome from the choice (bring a
  friend → the friend features), never the specifics. Kills failure mode 2
  and quietly teaches agency.
- **Every choice earns at least one explicit callback** in later scenes
  ("Good thing Maya brought her flashlight!"). Kills failure mode 1 and
  makes the choice feel honored.

## Tree shape and economics

Full binary trees explode (n choices → 2^n leaves of animated video).
Standard industry fix is foldback (branches re-merge), which *causes*
failure mode 1 — unless merges carry memory:

- **Merge rule**: two branches may re-merge only when their state docs
  reconcile — same location, time, cast on stage. Remaining differences
  must be expressible as ledger-driven **variant inserts**.
- **Variant inserts**: the merged trunk scene has one skeleton with small
  path-dependent variations — an extra line, a prop, a character present
  or absent. In this repo's pipeline these are cheap: an extra narration
  clip re-times its scene automatically (audio-driven timing, see
  CLAUDE.md), and character presence is a prop on the scene component.
- Practical shape for a ~10-min kids' episode: **2–3 choice points**,
  branches re-merging at act boundaries, 4–8 distinct paths, cost roughly
  **1.5–2× a linear episode**, not 4–8×.

## Spec amendments from the Phase-2 pilot (folded in 2026-10-17)

The text pilot (docs/cyoa-pilot/, verdict in `findings.md`) hit six places
where this spec was ambiguous, and every one of them mattered to an auditor.
These resolutions are now part of the spec; where they conflict with the
wording above, these win.

1. **Merges reconcile on the skeleton-critical cast, not on everyone.** "Same
   cast on stage" and "a character present or absent is a variant insert"
   cannot both be absolute. A merge requires identity of location, time (and
   every derived clock value), protagonist state, and every character whose
   presence the shared skeleton's *blocking depends on* — the
   **skeleton-critical cast**, named per merge in the tree plan. A
   ledger-licensed *extra* presence is a variant insert, and the skeleton must
   read correctly without it.
2. **Exhaustive choices get two tagged variants.** A shared skeleton has one
   baseline text (what runs when no ledger entry licenses anything else). When
   a choice is exhaustive — every path took A or B, so there is no unmarked
   default — the insert is written as **two tagged variants**, each carrying
   the id of the ledger entry that licenses it. Untagged divergence is a
   finding either way. This applies to *every* segment that plays under more
   than one history, including branch segments downstream of a second choice:
   the architect budgets variants (sized as **beats**, not lines) for each
   such segment, and a budget of zero is a ruling, not an omission.
3. **Ledger entries have ids.** `L-<choice><option><n>` (e.g. `L-A1`), full
   text written once in the tree plan, quoted verbatim downstream. Every
   variant insert and every state-doc difference cites one; the child's ledger
   is the parent's plus exactly the taken option's entries.
4. **Every tree publishes a computable clock.** At least one published
   timetable or formula (the pilot's tide `11 − ⌊min/30⌋`) so continuity is
   checked by recomputation rather than memory. The clock is per *tree*: a
   tree may deliberately bend it on one path, provided the bend is a ledger
   entry and the merge pays it with a variant insert (see the CYOA demo's
   `season: spring` on snow paths, src/videos/drip-fork/expansion-brief.md).
5. **Promise lists are path-scoped.** Promises opened by a ledger entry exist
   only on the paths whose ledger opened them, and state docs list them only
   there. Shared segments carry one state doc **per incoming path**, not one
   per segment.
6. **Open promises at the end are named, per path, in advance.** Exactly the
   promises the tree plan names may remain open in a final state doc, and only
   on the paths it names (the pilot's P4 on the two wall paths — the reason to
   watch again). Any other open promise at an ending is a finding.

Audit-process corollaries from the same pilot: run the full sibling-doc diff
at **every** merge, not only the first; keep seeding planted violations so the
auditors are known to be awake; re-audit after a fix round.

## Generation architecture

Maps onto the wave-and-review machinery proven on the two kids' episodes
(see docs/LEARNINGS.md); each layer is an agent role:

1. **Architect** (one agent, whole tree): writes the world bible, designs
   the topology (where choices land, what each choice MEANS thematically,
   where branches merge), the NPC background schedules, and the state-doc
   schema for this story. Output: tree plan + bible + per-choice intended
   consequences (ledger stubs).
2. **Branch writers** (parallel, one per branch segment): receive bible +
   parent state doc + the choice's ledger entries. Free in *how* events
   unfold; contracted on *what*: must output scenes AND the updated state
   doc. May only diverge from sibling branches via ledger entries.
3. **Continuity auditors** (adversarial, per root-to-leaf path): verify
   every fact against bible + state flow; every divergence traces to a
   ledger entry; every choice has ≥1 callback; merge nodes reconcile.
   Findings go back to writers; iterate until paths pass.
4. **Assembly**: existing episode pipeline per segment (script → TTS →
   scenes), plus the player's branching layer.

Orchestration note: this fans out naturally as a deterministic multi-agent
workflow (architect → parallel writers → parallel per-path auditors →
fix-round loop) with structured outputs carrying the state docs between
stages. Get Mike's explicit go-ahead before running large fan-outs.

## Player mechanics (independent of story work)

The web player (src/site/, @remotion/player) is a React app; branching is
an interaction-layer feature, no Remotion changes needed:

- Each branch segment is a composition (or one composition with segment
  offsets); at a choice point the player pauses and overlays a **choice
  card** (2 big tappable options, kid-sized, in the kids' theme; optional
  ~10s auto-default for pre-readers... prototype should test whether
  auto-default or wait-forever feels right).
- Selection appends to a path state (React state; persist to localStorage
  so a replay can show "your story so far" and offer "try a different
  way").
- Segment transition must be seamless: preload the next segment's assets
  during the current segment (audio is small; backgrounds are webp).
- Keep the standard player UX for linear videos untouched; CYOA entries
  get a `branching` flag in src/videos/registry.ts.

## Phased build plan

- **Phase 1 — player mechanic demo** (no new story): a ~90s Drip
  mini-adventure with ONE branch point built from existing ep-1 assets
  (cast, staging kit). Proves: choice card UX on a phone, seamless segment
  handoff, path state, replay flow. This is the riskiest unknown and the
  cheapest to test.
- **Phase 2 — engine pilot, text only**: run architect → writers →
  auditors on a miniature story (3 scenes/branch, 2 choices). No video.
  Deliverable: the state-doc schema that survived contact, an audit
  checklist that catches planted violations (seed some deliberately), and
  a readable tree transcript for Mike to review.
- **Phase 3 — pilot episode**: full CYOA kids' episode using phases 1+2.
  Only after Mike approves the phase-2 transcripts.

## Integration notes for this repo

- Narration: per-segment narration.mjs files (e.g.
  `src/videos/<slug>/branches/<nodeId>.mjs`) or one file with node-prefixed
  keys — decide in phase 1; the cache makes either cheap.
- Variant inserts are just extra keyed lines + conditional scene props.
- The every-frame validation gate (docs/PROCESS.md §5) applies per
  segment; the hook scanner (`npm run lint:hooks`) covers the choice-card
  UI too (it is React in the player, not in a composition).
- Backgrounds: segments within one location reuse the same plates —
  branching multiplies scenes, not necessarily worlds.

## Open questions (decide during prototyping)

1. ~~Auto-default at choice points (pre-readers) vs wait-forever.~~
   **Answered by the phase-1 demo: auto-default kept, 10s**, with a visible
   countdown on the first option (`AUTO_CHOICE_SECONDS` in
   src/site/BranchingPlayer.tsx).
2. ~~Choice-card narration: does a voice read the options aloud?~~
   **Answered: yes.** The prompt and each option are read aloud by the
   narrator voice when the card appears (`ch_*` clips, played by the site).
3. How much path state should surface visually ("story so far" recap map)?
   *Partly answered:* the end card lists every choice in story order and
   offers "Try a different way" (rewind to the first choice) and "Change my
   last choice" (rewind to the last choice on the viewer's path). A drawn
   recap map is still open.
4. Whether merged-trunk variant inserts need their own continuity audit
   pass (cheap; probably yes).
