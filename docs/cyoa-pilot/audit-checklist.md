# Continuity audit checklist

Run once per root-to-leaf path, against: the world bible, the path's segment
files in order, and the ledger entries of the choices on the path. Every
finding cites the scene it occurs in and the rule it breaks. An auditor's
output is a findings list — including "none" per section — not a rewrite.

Each check below names the failure mode from `docs/CYOA.md` it exists to
catch: **(1) no memory**, **(2) random impact**, **(3) world inconsistency**.

## A. Bible conformance — catches (3)

- A1. Every stated fact (names, species, locations, relationships, rules of
  the world, tone) matches the bible. A fact the bible doesn't cover must not
  contradict anything it does cover.
- A2. No character is somewhere the bible's starting positions + the path's
  events cannot have put them.

## B. State-doc flow — catches (3)

- B1. Each segment's *input* state (who is on stage, where everyone is,
  inventory/knowledge, time of day) equals its parent segment's *output*
  state doc, plus exactly the chosen option's ledger entries.
- B2. The output state doc actually follows from the segment's scenes — no
  item appears in the state doc that the scenes didn't put there, and
  nothing the scenes established is missing from it.
- B3. Time only moves forward, and at a rate consistent across sibling
  branches (a branch may not consume an afternoon its sibling spends in ten
  minutes, unless a ledger entry says why).

## C. Ledger discipline — catches (2)

- C1. **Every** divergence between this path's version of a shared segment
  and its sibling's (extra line, prop, present character) traces to a
  specific ledger entry. Divergence with no entry = finding. C1 governs
  **shared segments and state docs**; branch segments diverge wholesale by
  definition, and a `knows` line is licensed by a scene citation **or** a
  ledger id, not only by a ledger id.
- C2. Every ledger entry of every choice on the path has a visible
  consequence somewhere downstream. An entry nothing uses = finding
  (the choice was cosmetic — requirement (a) in the spec).
- C3. Consequences are foreseeable in kind from the choice (the category of
  outcome follows from what was chosen), surprising only in detail.

## D. Callbacks — catches (1)

- D1. Every choice on the path has ≥1 explicit later callback (a line or
  visual that names or clearly references the earlier choice).
- D2. The callback appears *after* a merge, in shared-skeleton territory, at
  least once on the path — that's the "the trunk remembers" proof, not just
  the branch remembering itself.

## E. Default consistency — catches (2) and (3)

- E1. NPC background schedules run identically on this path as written in
  `tree.md`, except where a ledger entry licenses interference — and then
  the interference must be the entry's stated consequence, nothing more.
- E2. Events causally untouched by the path's choices (weather, ambient
  happenings, off-stage facts) match every sibling path. Spot-check against
  at least one sibling segment file.

## F. Merge reconciliation — catches (1) and (3)

- F1. At each merge node, both incoming branches end in reconcilable state:
  same location, same time (±one scene's worth), same cast on stage.
- F2. All remaining differences at the merge are expressed as variant
  inserts in the shared skeleton, each tagged with the ledger entry that
  licenses it.

## G. Chekhov ledger — catches (1)

- G1. Every open promise in the state docs (planted object, stated
  intention, foreshadowed event) is either paid off on this path or still
  open in the final state doc *by design* (bible/tree says it carries to a
  sequel). Silently dropped promise = finding. A prop planted to **visualize a
  choice's options** is paid the moment the choice fires; it owes nothing
  downstream on any path.
