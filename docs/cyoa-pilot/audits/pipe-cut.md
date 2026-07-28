# Continuity audit — path `pipe-cut`

`intro` → **pipe** → `a-pipe` → `mid` → **cut** → `c-cut` → `ending`

Audited against `bible.md`, `tree.md`, `state-schema.md`, `audit-checklist.md`.
Sibling spot-checks (E2) against `b-wall.md` and `d-float.md`.

## Verdict

**FAIL — 23 findings (3 blockers, 20 minor).**

The spine holds: every tide step, every Nan brick, and the arrival/merge clocks
recompute correctly, and the Chekhov ledger closes cleanly. Two of the three
blockers are world-rule breaks in shared-trunk text (`mid.2`, `c-cut.3`); the
third is an arithmetic error carried into two final state docs.

---

## A. Bible conformance

**A1 · BLOCKER — `mid.md`, `mid.2`.** Text: *"Far away down the beach, Old
Barnaby leaned out from his post to watch the little door standing open, and
nodded to himself."* / *"Barnaby: (calling, all the way down the cove) Mind how
you lift it, lad!"*

Two separate breaches of bible **P-3** in three lines. (a) *"Barnaby cannot
move. Not a little, not ever. He is bolted on."* — "leaned out from his post"
and "nodded" are physical movement. (b) *"He speaks only when Crumb is on or at
the jetty — he does not shout across the cove in this story."* — Crumb is at
brick one, sixteen bricks west, inside a shed.

It also breaks three contracts at once: `mid`'s own header (*"On stage: Crumb,
alone"*), `tree.md` §9 (`mid` · on stage: *"Crumb alone (Narrator carries it)"*),
and both `mid` state docs (`stage.on_stage: [Crumb]`). It is skeleton text, so
it runs on all four paths untagged, which is also a C1 breach.

Worst of all it retro-breaks the segment that follows it on this path:
`c-cut.1` rests the whole cut on *"Old Barnaby was seventeen bricks east... What
Barnaby could see was a speck. A speck is not the same as a claw."* If Barnaby
can see a propped door at brick one and call advice through it, he can see a
crab sawing on the doorstep, and E5 ("Barnaby has to find the sawn end, not have
watched it happen", per `c-cut`'s own writer's note) collapses. **Cut the whole
Barnaby beat from `mid.2`.**

**A2 · minor — brick-count, `a-pipe.3`, `mid.1`, `mid.3`, `c-cut.1`.** The wall
is the ruler (bible, *"seventeen bricks, brick one at the west end, brick
seventeen at the east end"*), so brick one to brick seventeen is **sixteen**
brick-lengths. Four places on this path say seventeen:
- `a-pipe.3`: *"Down at the far end of the wall, seventeen bricks away…"*
- `mid.1` staging: *"Seventeen bricks away east, the jetty is a thin dark line"*
- `mid.3`: *"From the doorstep to the jetty is seventeen bricks."*
- `c-cut.1`: *"Old Barnaby was seventeen bricks east"*

`c-cut` itself says the right number twice — *"A quarter to eleven. Step six.
**Sixteen** bricks to go"* and the scene title *"Sixteen bricks"* — as does
`b-wall.1` (*"Sixteen bricks to go. Eighty minutes."*). `c-cut.1` therefore uses
both conventions eleven lines apart. Should be **sixteen** throughout.
(`d-float.1`/`.3` carry the same error on the sibling path.)

**A3 · minor — `a-pipe.1` header.** *"The kittiwakes sang eight, badly, three
quarters of an hour ago."* The scene is at twenty to nine; the kittiwakes sang
eight at eight o'clock. That is **forty minutes ago**, not three quarters of an
hour. Bible W-3: stated times must agree with the clock.

**A4 · minor — `a-pipe.3`.** *"Above him, on the cliff, four notes. Ten o'clock,
and every one of them wrong."* Everywhere else the running gag is that they get
exactly two right and always the same two: `mid.1` (*"got two of the four
notes"*), `c-cut.2` (*"They got two. They always get the same two."*),
`ending.3` (same, verbatim), and on the siblings `b-wall.1` and `d-float.2`.
Checklist E2 — ambient events causally untouched by the choice must match every
sibling. Should be "two of them, the same two as always".

**A5 · minor — `intro.2`/`intro.3`.** The old bell rope is established as
*"Grey. Furry. Older than the jetty"* in `intro.2`, then perishes into *"a small
orange cloud"* in `intro.3`. Grey rope, orange dust. One or the other.

**A6 · minor — throughout, worst in `ending.2` (E5).** Bible T-1: *"Speech
bubbles six words maximum."* Character lines routinely run two to three times
that: *"Crumb: I have to get to the Boat Shed."* (9, `a-pipe.1`); *"Crumb: The
shed is made of tar and wood."* (8, `a-pipe.3`); *"Barnaby: Now. That fuzzy end
goes in a claw all day for the rest of its life."* (17, `ending.2`); *"Barnaby:
That's not a bad thing or a good thing. That's a rope."* (13); *"Crumb: I left
the shed door propped open so anybody could see."* (11). If T-1 is meant as a
render-format rule rather than a script rule the bible should say so; as written
this is a bible breach on every segment of the path.

**A7 · minor — `a-pipe.2` vs `a-pipe.3`.** `a-pipe.2` makes the Pipe's gradient
load-bearing: *"The floor is round and slippy and slopes up towards the west"*,
and Crumb navigates by walking **against** an eastward trickle (*"Water goes down
to the sea. So I go up the water."*). `a-pipe.3` then reveals the west mouth is
*"at the back of the Boat Shed. Right under the back wall"* — brick one, on the
slip, at an elevation the sea reaches at ten to eleven (`mid.3`, `tree.md` §4)
and covers by roughly three more steps at noon. The east mouth, the grating, is
*beside the top of the jetty steps*, which is still above the water at step
three. So the revealed west end sits **below** the east end and the drain would
run west, not east — and would flood daily. Either the shed's Pipe mouth needs
to be explicitly high and dry under the headland behind the shed, or the trickle
runs the other way and Crumb's navigation reverses.

## B. State-doc flow

**B1 · BLOCKER — `c-cut.1` and three state docs: the rope arithmetic.** The line
is established as **forty Crumbs** (`mid.2`, four times the bell's ten). Crumb
cuts **eleven** (`c-cut.1`: *"Eleven. Eleven's safe."*). Forty minus eleven is
**twenty-nine**. The text says thirty, four times:
- `c-cut.1`: *"Thirty Crumbs of the only rope in Salt Pocket Cove. On its peg."*
- `c-cut.1`: *"there was a quarter less of it"* (a quarter of forty is ten, not
  eleven)
- `c-cut.md` state doc `[pipe, cut]`, `knows`: *"what is left of the line —
  thirty Crumbs — hangs on its peg"*
- `ending.md` state doc `[pipe, cut]`, `knows`: same string, carried forward

Should be **twenty-nine** in all four places (and in the `[wall, cut]` docs,
which repeat it). Note the float side gets it right — `ending.2` E6: *"Ten
Crumbs of it was the bell's. The other thirty…"* — because nothing was cut
there; that is the arithmetic that makes the cut-side error visible.

**B2 · minor — `mid.md`, both state docs.** `stage.on_stage: [Crumb]` and
`everyone.Old Barnaby.at: "the last jetty post, brick 17"` do not follow from
`mid.2`'s scenes, in which Barnaby leans out, watches and speaks. Checklist B2:
the output doc must follow from the scenes. Resolved by fixing A1.

**B3 · minor — `c-cut.md` state doc `[pipe, cut]`, `knows`.** Three facts
established in `mid` and present in the `mid` doc are silently dropped rather
than superseded: *"the coil is far heavier than he is and he can shift it about
a claw's width at a shove (mid.2, mid.3)"*, *"at that rate he would not reach
the jetty today… (mid.3)"*, and *"the water will be at the Boat Shed doorstep at
ten to eleven (mid.3)"*. The sibling `d-float` doc keeps all three, so this is a
one-sided loss of established knowledge (checklist B2, *"nothing the scenes
established is missing from it"*).

**B4 · minor — `a-pipe.md` vs `b-wall.md` docs at the `mid` merge.**
`state-schema.md` diff step 1: `clock`, `derived`, `weather`, `stage.location`
*"must be **identical** between siblings at a merge. No exceptions, no
licensing."* Three fields are not:
- `weather`: `"…the high thin cloud burned off at ten; clear and sunny"` vs
  `"…the high thin cloud burned off — clear and sunny"`
- `derived.grumble_default`: `"…complaint two of nine (default day: wakes 9:40,
  on the rock 9:46, complaints at 9:46 and 9:58)"` vs `"…complaint two of nine
  (done at two minutes to ten; the third is due at ten past ten)"`
- `stage.location`: `"outside the Boat Shed's front door, on the slip, brick 1"`
  vs `"outside the Boat Shed's front door, brick 1"`

And diff step 2 (a differing `everyone` row must name a ledger id): `Old
Barnaby.doing` is *"watching the water climb the steps"* on `a-pipe` and
*"watching the whole cove"* on `b-wall`, with no ledger id. Content is the same
in every case; the schema asks for identity, so normalise the strings.

**B5 · minor — `c-cut.1`.** *"Nan Prattle was twelve bricks east, going away,
talking."* The line lands seconds after the door comes down, i.e. about
twenty-five past ten. `nan_brick = 1 + floor(145 ÷ 15) = 10`. She does not reach
brick twelve until a quarter to eleven, and the segment's own writer's note
repeats the wrong figure. Should be **brick ten** (bible W-4: computed, never
chosen).

**B6 · minor — `a-pipe.1` staging.** *"Barnaby is on his post, off to the side,
saying nothing."* `tree.md` §9 contracts `a-pipe`'s cast as *"Crumb; Grumble in
sc.1 only"*, and the segment's own header says *"On stage: Crumb throughout;
Grumble in scene one only."* Barnaby is unavoidably physically present at brick
seventeen (P-3), so the fix is to say so in the header and the doc rather than
to leave the cast list contradicting the staging.

**B7 · minor — `c-cut.md` state doc, `everyone.Old Barnaby`.** At a quarter to
twelve the tide is at step four and Barnaby is bolted *"at about the height of
step five"* (bible), so he is under water — `ending.1` builds a whole beat on
it (*"The sea had come up over Old Barnaby"*) and `ending.md`'s writer's note
says it is *"over him in `c-cut` and `d-float` too, unremarked"*. The `c-cut`
doc still reads *"on his post; the water is at step four"*. Add the submersion
so the merge input matches the merge output.

**B8 · minor — `c-cut` timing (checklist B3, time at a consistent rate).** Three
slips inside the eighty-minute budget, which has no slack (`tree.md` §3: twenty
sawing + sixty dragging):
- `c-cut.1` counts the saw out loud to the minute — *"That was five minutes…
  That was ten minutes… Fifteen minutes. Twenty."* — which lands on a quarter to
  eleven. Then *"Crumb did the tidying, and the tidying was the slow bit"* (lift
  the door, shove twenty-nine Crumbs of rope back inside, climb the crab pots,
  hang it, come back down, re-prop the door), and then *"A quarter to eleven."*
  The slow bit takes zero minutes.
- `c-cut.3`: *"Crumb had been pulling for half an hour and he was out of puff."*
  Spoken at twenty-five past eleven; he started hauling at a quarter to eleven —
  **forty minutes**.
- `c-cut.2`/`.3` pace: brick one to brick six in fifteen minutes, then brick six
  to brick fourteen in twenty — he speeds up from three minutes a brick to two
  and a half exactly through the stretch where he twice *"walked all the way back
  along his own rope and hauled it up again"* and is getting tired. The writer's
  note's own summary ("thirteen bricks in thirty-five minutes") is right; the
  brick-six-at-eleven-o'clock waypoint is what does not fit.

## C. Ledger discipline

**C1 · minor — `ending.3`, skeleton.** *"The shell has been riding loose on him
since brick eleven."* That fact is established only in `c-cut.2` (*"By brick
eleven his back end was sticking further out of his shell than it had ever stuck
in his life"*). On the float paths Crumb never walks brick eleven — he rides
past it at water level — and `d-float` establishes nothing of the kind. So a
shared-skeleton line carries cut-path history untagged. Checklist C1 / `tree.md`
§5 baseline rule: it needs to be either de-specified ("riding loose on him for
the last hour") or split into two tagged variants. It is *correct* on this path;
it is the tagging that fails.

**C2 · minor — `mid.md`, M1.** The insert is labelled *"[M1 · variant, baseline
(pipe paths) — L-A2, L-A3]"*. `tree.md` §6 lists M1 as *two tagged variants*
with ledger ids on both sides, and §5 is explicit that where a choice is
exhaustive *"there is no unmarked default"*. Calling one side the baseline while
also giving it ids is contradictory labelling (M2 is the row that legitimately
has a baseline, and `mid` tags that one correctly). Drop the word "baseline"
from M1.

*C2 (every entry has a downstream consequence) and C3 (foreseeable in kind):
none.* All six entries on this path land: L-A1 → `mid` doc Grumble row, C-V1,
E1; L-A2 → M1, E2, `condition` in every doc; L-A3 → M1, E3, P4 paid; L-C1 → E5
and `carrying`; L-C2 → the peg with the fuzzy end at looking height, cited in
E5; L-C3 → P7, opened `c-cut.1`, paid at E5.

## D. Callbacks

**None.** Choice 1 gets M2 in `mid` (the pull-fall-over-think baseline, in
post-merge shared trunk — D2 satisfied) plus E1, E2 and E3 in `ending`. Choice 2
gets E5 in `ending`, which is also post-merge. Both choices clear D1 and D2.

## E. Default consistency

**E1 · BLOCKER — `c-cut.3`, insert C-V1.** The variant tagged for this path is
factually inverted. Text as written:

> **[C-V1 · variant, L-A1 (pipe paths)]**
> Narrator: Grumble was up on it, mid-complaint, and did not look up.
> …
> Narrator: Grumble did not answer. Complaint six takes as long as it takes.

The scene is at twenty-five past eleven. On this path L-A1 is on the ledger, so
`tree.md` §4's **interfered** timetable applies: ninth complaint at 10:22, off
the rock at 10:30, at the grating at 10:45, and sitting at the top of the jetty
steps from 10:45 to 11:45. **Grumble's Rock is empty**, and has been for nearly
an hour. The variant that says "empty" is the one tagged *(baseline)* for the
wall paths — where, per the default timetable, Grumble is in fact still on the
rock with the nine just done at 11:22. **The two variants are swapped.**

Compounding it: "complaint six" fits neither timetable at 11:25 (default
complaint six is 10:46; interfered is 9:46), which breaks bible P-5's fixed
twelve-minute order as well.

The rest of the file already knows the right answer, which is what makes this
unambiguous: `c-cut.md`'s own insert table (*"empty, because his day ran an hour
early / occupied, list just finished"*), its writer's note (*"on `pipe` paths
Grumble left the rock at half past ten and the rock is empty for the whole of
Crumb's drag"*), its `[pipe, cut]` state doc (`Grumble.at: "the top of the jetty
steps, brick 17"`, and `knows: "Grumble's Rock was empty at twenty-five past
eleven, because Grumble's whole day ran an hour early (L-A1, c-cut.3)"`), and
`ending.1` E1. Only the scene text is wrong. Swap the two variant bodies.

**E2 · minor — `ending.1`, insert E1 (pipe variant).** *"Grumble had finished all
nine of his complaints at twenty-two minutes past ten… He had been sitting at
the top of these steps ever since."* Per `tree.md` §4 interfered timetable he
leaves the rock at 10:30 and reaches the grating at **10:45**; `c-cut`'s state
doc and `ending`'s own insert-table row both say "since a quarter to eleven",
and the hour of complaining at Barnaby (10:45–11:45) only works from 10:45.
"Ever since" over-claims by twenty-three minutes. E1 also requires *"the
interference must be the entry's stated consequence, nothing more"*.

**E3 · minor — sibling spot-check, `b-wall.3`.** The Bosun's Loop mnemonic is
established in `intro.2` (shared trunk, opened as P2) as *"Round the post. Under
itself. Through the loop. Pull."* → *"Round, under, through, and pull!"*, and
`ending.2` pays it in exactly those words on all four paths. `b-wall.3` renders
it *"Over, under, round, and through."* — wrong words, wrong order, and no
"pull". A wall-path fix, but flagged here because the source is trunk material
this path also depends on.

*Otherwise the ambient layer checks out against both siblings:* the tide, Nan's
brick, the kittiwake hours, the *Sandhopper* row and the weather content are
identical on `b-wall`, `c-cut` and `d-float` at every shared timestamp. The
exceptions already listed are A4 (kittiwake accuracy) and B4 (weather wording).

## F. Merge reconciliation

**F1 · minor — `c-cut` vs `d-float` state docs at the `ending` merge.**
`stage.on_stage` is `[Crumb, Old Barnaby, "Grumble (…)"]` on `c-cut` and
`[Crumb]` on `d-float` — yet both segments carry the *same* note that they cut
on the arrival before Crumb looks up, both end at brick seventeen at a quarter
to twelve, and both have Barnaby bolted in frame and Grumble at brick seventeen.
Checklist F1 wants the same cast on stage at a merge; here two docs describe the
same instant with different casts and no ledger id for the difference. Pick one
convention (`d-float`'s is the cleaner: Crumb alone, with the others carried in
`everyone`, and E1 deciding what is seen).

**F2 · minor — insert size, `ending.2` (E5) and `ending.1` (E3).** `tree.md` §6:
*"Hard budget. An insert is **one narration line, or one visible prop, or one
character's presence** — not a rewritten scene. If a writer wants more, the
answer is no."* On this path E3 runs about twenty lines and E5 about thirty-five
— they are scenes, not inserts. The row *count* is within budget (four of six
used: E1, E2, E3, E5) and §6's own prose descriptions of E3 and E5 invite
multi-beat writing, so this is as much a defect in the tree as in the segment —
but as written the two documents contradict each other and an auditor cannot
pass both.

**F3 · minor — `ending.2`, cut paths.** The skeleton states the job — *"Get one
end of a rope up a post. Put it through a hole. Tie the knot."* — then hands to
the variant slot, then resumes at *"And then Crumb tied the knot"* with a close
on his claws *at the eye of the bell*. On float paths E6 shows the climb and the
threading. On cut paths E5 ends on the finished whipping down at the top of the
steps, and **the rope is never shown getting up the post or through the eye**;
the next thing we see is the knot already at the eye. `ending.md`'s writer's note
claims *"neither side re-narrates the climb or the knot"*, but the skeleton
never narrates them either, so on this path they simply do not happen. One
skeleton line between the slot and the knot ("So he took the neat end up the
post and put it through the eye") closes it for both sides.

## G. Chekhov ledger

**None.** Every promise opened on this path is paid, and the final doc's
`promises.open: none` is correct per `tree.md` §7 G1 (P4 may remain open only on
`wall-cut` and `wall-float`):

| id | opened | paid | checked |
| --- | --- | --- | --- |
| P1 | `intro.1` | `ending.3` — out of the shell on the long pull; sent home to the spiral one | ✓ |
| P2 | `intro.2` | `ending.2` — the Bosun's Loop holds the bell, and his whole weight | ✓ |
| P3 | `intro.2` | `ending.3` — bell at noon, step three, *Sandhopper* crosses | ✓ |
| P4 | `intro.3` | `ending.1` (E3) — he tells Barnaby: back of the Boat Shed, brick one | ✓ |
| P7 | `c-cut.1` (L-C3) | `ending.2` (E5) — Barnaby sees the raw end; Crumb owns up | ✓ |

P5 and P6 correctly do not appear (wall-only, L-B2/L-B3). The `ledger` block at
every node is its parent's plus exactly the entries of the option taken,
verbatim, in order — diff step 5 passes at `a-pipe`, `mid`, `c-cut` and
`ending`.

---

### Computed values — recomputed, all correct unless noted

`tide_step = 11 − floor(min since 8:00 ÷ 30)` · `nan_brick = 1 + floor(min since 8:00 ÷ 15)`

| node | time | tide (doc / recomputed) | Nan (doc / recomputed) | Grumble (doc / `tree.md` §4) |
| --- | --- | --- | --- | --- |
| `intro` | 8:40 | 10 / 10 ✓ | 3 / 3 ✓ | asleep, wakes 9:40 ✓ |
| `a-pipe` | 10:00 | 7 / 7 ✓ | 9 / 9 ✓ | default "complaint two" ✓; actual "complaint seven" (8:46+6×12 = 9:58) ✓ L-A1 |
| `mid` | 10:25 | 7 / 7 ✓ (6 at 10:30 ✓) | 10 / 10 ✓ | default "four of nine, 10:22" ✓; actual "nine of nine, 10:22" ✓ L-A1 |
| `c-cut` | 11:45 | 4 / 4 ✓ | 16 / 16 ✓ | default "reaching the grating" ✓; actual "on the jetty since 10:45" ✓ L-A1 |
| `ending` | 12:05 | 3 / 3 ✓ | 17 / 17 ✓ | default "inside the Pipe" ✓; actual "on the jetty, stays" ✓ L-A1 |

In-scene clock checks that pass: `intro.2` 8:15 step 11; `intro.3` 8:30 step 10;
`a-pipe.2` 9:00 step 9 and "twenty minutes gone / sixty to go"; `a-pipe.3` 9:30
step 8 → 10:00 step 7; `mid.3` "at the doorstep at ten to eleven" and "leave now,
at the jetty at a quarter to twelve"; `c-cut.1` step 7 → 6 at 10:30; `c-cut.2`
Nan overtaken at brick fourteen at 11:20 (= `1 + floor(200 ÷ 15)`); `c-cut.3`
step 4 from 11:30, Nan one brick back at brick fifteen at 11:30; `ending.1`
"fourteen left" at 11:46; `ending.3` Nan at brick seventeen at noon. Failing
in-scene clock claims are A3, B5, B8 and E2 above.
