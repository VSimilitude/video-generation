# Continuity audit — path `pipe-float`

`intro` → **pipe** → `a-pipe` → `mid` → **float** → `d-float` → `ending`

Sources: `bible.md`, `tree.md`, `state-schema.md`, `audit-checklist.md`, and the
seeded segment files for this path (plus `b-wall.md` and `c-cut.md` for sibling
spot-checks, checklist E2).

**VERDICT: FAIL — 16 findings (4 blocker, 12 minor).**

The path's spine is sound: every clock/tide/Nan/Grumble value in the state docs
recomputes correctly, the ledger blocks are verbatim and correctly accumulated,
every ledger entry pays off downstream, P4 is paid at `ending` (E3) as `tree.md`
§7 requires, and the final doc closes with no open promises. The failures are
(a) two tide/geometry statements that contradict the formulas or a sibling
segment, (b) one shared-skeleton line in `ending.3` that only the `c-cut` branch
earns, and (c) a scatter of clock-gloss and state-doc hygiene slips.

---

## A. Bible conformance

**A-1 · BLOCKER — `d-float.2`, When/where header.**
Says *"tide at step six, then step **four** from eleven o'clock"*. At eleven
o'clock `tide_step = 11 − floor(180 ÷ 30) = 5`. The scene's own narration two
pages down gets it right (*"Eleven o'clock. Step five."*), and the sibling
`c-cut.2` header has *"step five from eleven o'clock"*. Breaks bible P-2 and W-3
("every scene records its time and its tide step, and both must agree with
P-2"). Should read *"then step five from eleven o'clock"*.

**A-2 · BLOCKER — `ending.2`, E6 continuation (L-D2), "A lot of rope".**
The insert says the tail runs *"past step one, past step two, down to the water
at **step three**"*. It is placed immediately after the knot is tied at five to
twelve, when the tide is at step four (`11 − floor(235 ÷ 30) = 4`) — and four
lines later the skeleton says *"the water went up one more step, and stopped…
Step three."* Two adjacent lines assert different tide steps for the same
moment. Breaks P-2 / W-3. Fix by moving the insert after the high-water lines,
or by saying step four.

**A-3 · BLOCKER — brick arithmetic: "seventeen bricks" vs "sixteen bricks"
between two shared-trunk segments.**
`mid.3` (shared skeleton, all four paths): *"From the doorstep to the jetty is
**seventeen** bricks."* `d-float.3`: *"Crumb had come **seventeen** bricks."*
But `b-wall.1` says *"**Sixteen** bricks to go"* from brick seventeen, and
`c-cut.1`/`c-cut.2` — trunk-adjacent text starting from the *same* Boat Shed
doorstep twenty minutes after `mid.3` — say *"A quarter to eleven. Step six.
**Sixteen** bricks to go"* and *"how you turn **sixteen** bricks into about
thirty"*. Brick one to brick seventeen is sixteen brick-lengths. Since `mid.3`
is shared skeleton, the contradiction sits inside the trunk and reaches all four
paths. Bible: the sea wall is "the ruler". Sixteen is the correct figure; `mid.3`
and `d-float.3` should be changed.
*(Not part of this finding: "seventeen bricks away east, the jetty is a thin dark
line" in `a-pipe.3`, `mid.1` and `d-float.1`. `c-cut.1`'s "Nan Prattle was twelve
bricks east / Old Barnaby was seventeen bricks east" establishes that idiom as
"at brick N", and it is used consistently.)*

**A-4 · minor — `a-pipe.1`, When/where header.**
*"The kittiwakes sang eight, badly, **three quarters of an hour** ago."* The
scene is at twenty to nine; eight o'clock was forty minutes ago. Three quarters
of an hour ago is five to eight, which is outside the story's morning (bible
"eight o'clock to noon"). Should be "forty minutes ago".

**A-5 · minor — `ending.1`, E3: Barnaby's "It comes out where I can see."**
`a-pipe.3` establishes that the Pipe's west mouth is *under the back wall* of the
Boat Shed, that somebody built the shed on top of it, and that "nobody in Salt
Pocket Cove ever goes round the back of the Boat Shed, because everything in the
Boat Shed is at the front" — i.e. the shed body stands between the mouth and the
cove. Bible P-3 lets Barnaby see the whole cove, but not behind a shed. The line
is the emotional peak of the pipe branch, so this needs an architect ruling
rather than a rewrite: either the mouth is visible from the jetty (and `a-pipe.3`
should stop insisting nobody goes there) or Barnaby's line should be about the
*place* ("brick one — I've looked at it for ninety years"), not the sight of it.

**A-6 · minor — T-1, "speech bubbles six words maximum", exceeded in seven
single-sentence lines on this path.**
`a-pipe.1` "The shed is made of tar and wood." (8) · `d-float.1` "You could go a
bit quicker." (7) · `d-float.2` "I'm over the top of it!" (7) · `ending.1`
Grumble "There's still no rope on that bell." (7) · `ending.2` Crumb "I couldn't
leave it in the shed." (7) · `ending.3` Nan "Somebody's put a rope on that
bell!" (7) · `ending.3` Barnaby "You came out of that one pulling a bell." (9).
`intro` and `mid` hold the rule throughout, so the ceiling is clearly meant
literally. Each is a one-word trim.

---

## B. State-doc flow

**B-1 · BLOCKER — `ending.3`, shared skeleton: "The shell has been riding loose
on him since brick eleven."**
This is skeleton text (outside every insert), but "brick eleven" is established
only in `c-cut.2` — *"By brick eleven his back end was sticking further out of
his shell than it had ever stuck in his life"* — and only the `c-cut` state docs
carry it (`shell: "…the shell rides loose on him"`). The `d-float` `[pipe,
float]` doc's `shell` field reads *"one size too small; his back end sticks out
and he has to squeeze — and the bit that sticks out is the bit that got cold"*:
nothing about riding loose, and nothing at brick eleven, because on this path
Crumb spent bricks two to sixteen sitting on a floating coil. Breaks B1 (the
segment's input state must equal its parent's output) and C1 (the trunk quietly
inherits a `c-cut`-only detail). `mid.3` gives a path-neutral setup already —
*"his back end is sticking further out of his shell than it was this morning"* —
so the fix is to drop "since brick eleven".

**B-2 · minor — `ending` `[pipe, float]` doc, `protagonist.knows`: four facts
present in the parent `d-float` doc are silently dropped.**
Gone: "the coil is far heavier than he is…"; "on foot he would not have reached
the jetty today…"; "there is an old oyster shell out of the door frame propping
the Boat Shed door open, and one edge of it has gone rough… it is still there
(d-float.1)"; "the tide comes in eastward along the wall… since eight o'clock
(d-float.2)". Also "the spare mooring line is on a peg in the Boat Shed at brick
one" loses the peg and the brick. B2: "nothing the scenes established is missing
from it." The `[pipe, cut]` ending doc *does* retain the oyster-shell line, so
the two docs are inconsistent about the same object.

**B-3 · minor — `a-pipe` vs `b-wall` output docs: fields the schema requires to
be identical at the `mid` merge are not.**
Schema diff step 1 ("must be **identical** between siblings at a merge. No
exceptions, no licensing"):
- `weather`: a-pipe "flat calm; the high thin cloud burned off **at ten**; clear
  and sunny" / b-wall "flat calm; the high thin cloud burned off — clear and
  sunny".
- `derived.grumble_default`: a-pipe "…complaint two of nine (default day: wakes
  9:40, on the rock 9:46, complaints at 9:46 and 9:58)" / b-wall "…complaint two
  of nine (done at two minutes to ten; the third is due at ten past ten)".
- `stage.location`: a-pipe "outside the Boat Shed's front door, **on the slip**,
  brick 1" / b-wall "outside the Boat Shed's front door, brick 1".

Schema diff step 2 (a differing `everyone` row must name a ledger id or be the
protagonist): `Old Barnaby.doing` — a-pipe "watching the water climb the steps"
/ b-wall "watching the whole cove"; `Nan Prattle.doing` — b-wall appends "Talking
to Crumb at brick 7 changed nothing about where she is (bible P-4)". Neither
names a ledger id. Content is equivalent in every case, so this is wording
hygiene, not a world break — and `mid` normalises it correctly, which is why it
only shows up in the parents.

---

## C. Ledger discipline

C2 and C3 pass in full. Every entry on this path has a visible downstream
consequence: L-A1 → `a-pipe.1` (woken on screen, complaint one heard off stage)
and E1; L-A2 → M1 pipe variant, F1 pipe variant, E2; L-A3 → `a-pipe.3` and E3;
L-D1 → the whole of `d-float` and E6's wringing; L-D2 → E6 (the eye, the
thirty-Crumb tail); L-D3 → `d-float.2` and E6's laugh in `ending.3`. Every
consequence is foreseeable in kind from the choice prompt ("you disturb whoever
lives there / you find out something nobody knows"; "take it into the water →
water things follow").

**C-1 · minor — `d-float`'s F1 insert sits in a segment `tree.md` §6 gives no
budget for.**
§6 is written as a hard budget and allocates inserts only to `mid` (three) and
`ending` (six). But `d-float` is a shared skeleton across `[pipe, float]` and
`[wall, float]`, and it carries a two-sided tagged variant (F1, Nan at brick
fifteen). `c-cut` does the same thing with C-V1. Both are correctly tagged per
§5, both are genuinely forced by the timetable, and both are minimal — this is a
gap in §6 rather than a writer overreach, but it is unlicensed as written and
needs an architect ruling (a `c-*`/`d-*` row added to §6, one insert each).

---

## D. Callbacks

None. D1 and D2 are both satisfied, and both in shared-skeleton territory:

- Choice 1 → M2 baseline in `mid.1` (pull, pull harder, fall over, reason it out
  from the floor) — post-merge, in the trunk, `tree.md` §8's designated
  choice-1-remembered-by-the-trunk beat. Then E1, E2, E3 in `ending.1`.
- Choice 2 → E6, in three placements in `ending.2` and `ending.3`.
- The quiet one lands: Nan arrives at brick seventeen at noon, and on this path
  Crumb "just waves" (`ending.3`), exactly as §8 specifies.

---

## E. Default consistency

**E-1 · minor — `ending.1`, E1 pipe variant: Grumble's "ever since".**
*"Grumble had finished all nine of his complaints at twenty-two minutes past
ten… He had been sitting at the top of these steps **ever since**."* Per
`tree.md` §4's interfered day he leaves the rock at half past ten and reaches the
grating at a quarter to eleven; the insert's own stage direction says *"He has
been sitting there for an hour"* (10:45 → 11:45), and the `[pipe, float]` state
doc says *"sitting where he has sat since a quarter to eleven"*. "Ever since" is
wrong by twenty-three minutes and contradicts its own staging. Should be "and by
a quarter to eleven he was sitting at the top of these steps".

**E-2 · minor (sibling spot-check) — the kittiwakes get two notes everywhere
except `a-pipe.3`.**
`mid.1` "got two of the four notes" · `b-wall.1` "get about two of them" ·
`c-cut.2` "They got two. They always get the same two." · `d-float.2` "Four
notes. They got two." · `ending.3` "They got two… They always get the same two."
`a-pipe.3` has *"four notes. Ten o'clock, and **every one of them wrong**."*
Ambient, causally untouched by any choice, so E2 requires it to match — and the
`ending` skeleton's "they always get the same two" makes it a running gag the
pipe path breaks.

**E-3 · minor (sibling spot-check) — the `wall`-side state docs mis-state
Grumble's default timetable.**
`b-wall`, `mid` `[wall]`, `d-float` `[wall, float]` and `ending` `[wall, *]` all
carry the `knows` line *"Grumble wakes when the sun comes over the headland at
twenty to ten and is up on his rock **a quarter of an hour later**"*. `tree.md`
§4 says wakes 9:40, on the rock 9:46 — six minutes. Nan's spoken line in
`b-wall.2` is correct (*"He'll be up on his rock in a quarter of an hour"*, said
at about half past nine → 9:46); the state-doc gloss silently reinterprets "a
quarter of an hour from now" as "a quarter of an hour after waking" and lands on
9:55. Not on my path, but it is the plant `tree.md` §8 asks `b-wall` to lay for
the pipe branch, so it should be right before it is copied forward four times.

**E-4 · minor (sibling spot-check) — `b-wall.3` garbles the Bosun's Loop.**
*"At brick three Crumb took Nan's cord out and tied a Bosun's Loop in it… **Over,
under, round, and through.**"* `intro.2` teaches it as "Round the post. Under
itself. Through the loop. Pull." and `ending.2` says it back the same way. P2 is
a Chekhov promise; its mnemonic should not change wording or order mid-story.

Otherwise E1 passes. Grumble's interfered day is exactly L-A1's stated
consequence and nothing more — same nine complaints, same order, same twelve-
minute spacing, 8:46 → 10:22, off the rock at half past ten, at the grating at a
quarter to eleven, on the jetty from then to noon. I recomputed the whole row
against `tree.md` §4 at 10:00, 10:25, 11:45 and 12:05 and every state doc's
`everyone.Grumble` and `derived.grumble_default` pair is right, including the
worked case in `state-schema.md` (complaint seven vs default complaint two at ten
o'clock). Nan's row and the tide are correct at every checkpoint: 8:40 b3/s10 ·
10:00 b9/s7 · 10:25 b10/s7 · 11:40 b15 · 11:45 b16/s4 · 12:00 b17/s3 · 12:05
b17/s3. The waiting-and-riding split (25 + 55 = 80) and the arrival at a quarter
to twelve hold P-1 exactly.

---

## F. Merge reconciliation

**F-1 · minor — `stage.on_stage` disagrees between the two branches feeding the
`ending` merge.**
`c-cut` `[pipe, cut]` lists `[Crumb, Old Barnaby, "Grumble (at the top of the
steps since a quarter to eleven — L-A1…)"]`. `d-float` `[pipe, float]` lists
`[Crumb]` alone, with the comment *"the segment cuts on the haul-out, before he
looks up"* — but `c-cut.3`'s own note says the same thing (*"the segment stops on
the arrival, before anybody speaks or Crumb looks up"*) and lists them anyway.
Checklist F1 wants "same cast on stage" at a merge; the two docs describe the
identical frame with different casts, and nothing licenses the difference. Pick
one convention (listing everyone physically at brick seventeen seems right, since
`everyone` already puts Barnaby and Grumble there in both docs).

**F-2 · minor — `mid.md` labels M1's pipe side a baseline.**
The in-place tag reads `[M1 · variant, **baseline** (pipe paths) — L-A2, L-A3]`.
Choice 1 is exhaustive, so per `tree.md` §5 there is no unmarked default at M1
and both sides are simply tagged variants — which is what `mid.md`'s own header
table says ("*two tagged variants*"). Only M2 has a baseline (the pipe version,
untagged). Labelling only; the ids are present and correct.

Otherwise F1/F2 pass. At `mid`: both parents land at brick one, ten o'clock, step
seven, Crumb alone, and every reconciled difference in `tree.md` §5's table is
carried by a tagged insert (M1/M2/M3) or by a ledger-cited state-doc field. At
`ending`: both parents land at the top of the jetty steps, brick seventeen, a
quarter to twelve, step four, with a rope; Grumble's extra presence is
ledger-licensed (L-A1) and confined to E1, and the skeleton reads correctly
without him. Insert budgets are respected: `mid` uses three of three, `ending`
six of six (this path draws E1+E2+E3+E6).

---

## G. Chekhov ledger

None.

- **P1** paid at `ending.3` — he comes clean out of the shell on the long pull
  and Barnaby sends him home to the spiral one. Touched-not-paid at brick
  fourteen in `d-float.3` ("Not today.") and correctly recorded as such.
- **P2** paid at `ending.2` — the Bosun's Loop puts the new rope on the bell and
  holds his whole weight. (Its wording is stable on this path; see E-4 for the
  `b-wall` slip.)
- **P3** paid at `ending.3` — bell at noon, step three, the *Sandhopper* crosses.
- **P4** paid at `ending.1` via E3, as `tree.md` §7 requires on `pipe` paths.
  `a-pipe.3` deliberately holds it ("put it in his pocket for later, like a good
  stone") and the intervening docs correctly keep it open.
- P5–P7 are not on this path and correctly appear in no doc on it.
- Final doc `promises.open: none` — correct: G1 permits a surviving open promise
  only for P4 on `wall-cut` and `wall-float`.
- No promise is opened and dropped anywhere on the path; `d-float`'s writer's
  note is right that the float branch opens none.
