# Continuity audit — path `wall-cut`

`intro` → **wall** → `b-wall` → `mid` → **cut** → `c-cut` → `ending`

**VERDICT: FAIL — 21 findings (5 blockers, 16 minor).**

The blockers share one root cause: **the rope-preparation variant slot in
`ending.2` is empty — insert E5 does not exist in the text.** Everything
downstream of that (choice 2's only post-merge callback, L-C1/L-C2/L-C3's
payoff, and promise P7) fails with it, and the final `[wall, cut]` state doc
has quietly deleted P7 rather than reporting it open. Choice 2 is currently
**cosmetic after the merge** on this path: a child who cuts the only rope in
Salt Pocket Cove never hears about it again.

Everything else is minor: arithmetic slips, one contradicted knot recitation,
one NPC-timetable paraphrase that is six minutes wrong and propagates through
four documents, and a prop (Nan's cord) whose location between `mid.3` and
`ending.3` is asserted by state docs but never staged.

Scope note: `mid`, `c-cut` and `ending` were audited on the baseline plus the
inserts tagged for this path (M1-wall, M2-`L-B1`, M3, C-V1 baseline, E1
baseline, E4, E5). `a-pipe` and `d-float` were read for the E2 sibling
spot-check only.

---

## A · Bible conformance

**A1 · minor · `b-wall.3`, brick three — the Bosun's Loop is recited in the
wrong words.**
Text: *"Crumb took Nan's cord out and tied a Bosun's Loop in it, the way Barnaby
showed him. / Over, under, round, and through."*
Barnaby taught it in `intro.2` as **"Round the post. Under itself. Through the
loop. Pull."**, Crumb repeats it there as *"Round, under, through, and pull!"*,
and `ending.1` and `ending.2` both use that same four-beat form (`ending.2` is
even titled *Round, under, through, and pull*). `b-wall.3` is the only place in
the path that reorders it and drops "pull". Checklist A1 (every stated fact
matches); this is the wording of promise **P2**, which is a repeated ritual
line, so it must be word-stable.

**A2 · minor · `c-cut.1` — "Nobody ever comes to brick one" contradicts Nan.**
Text: *"Nobody comes to brick one. Nobody ever comes to brick one."*
Nan Prattle starts from brick one at eight o'clock **every morning of her life**
(bible P-4; `tree.md` §4 timetable, `nan_brick = 1` at 8:00) — and `c-cut.2`,
one scene later, says so out loud: *"Nan Prattle left brick one at eight o'clock
this morning."* The beat wants "nobody is here **now**", which is true and is
already carried by the two lines above it about Nan being twelve bricks east.

**A3 · minor · `mid.3` (and sibling `d-float.3`) — the cove is sixteen bricks
wide, not seventeen.**
`mid.3`: *"From the doorstep to the jetty is seventeen bricks."*
Brick one to brick seventeen is **sixteen** brick-lengths. This is load-bearing:
`b-wall` walks it at exactly five minutes a brick (8:40 b17 → 8:50 b15 → 8:55
b14 → 9:00 b13 → 9:30 b7 → 10:00 b1), and 16 × 5 = the eighty minutes of bible
P-1. `b-wall.1` ("Sixteen bricks to go"), `c-cut.1` ("Sixteen bricks to go") and
`c-cut.2` (titled *Sixteen bricks*) all have it right. Note the file's other
"seventeen bricks east" phrasings (`mid.1`, `c-cut.1` staging) are the *"at
brick seventeen"* idiom and are fine — only the two distance statements are
wrong (the sibling one is `d-float.3`, *"Crumb had come seventeen bricks"*).

**A4 · minor · `c-cut.2`–`c-cut.3` — the laden drag is faster than the unladen
walk.**
`c-cut` covers brick one to brick seventeen in **sixty minutes** (10:45 → 11:45;
the writer's note breaks it down as thirteen bricks in thirty-five minutes, then
three in twenty-five), and `c-cut.2` adds *"which is how you turn sixteen bricks
into about thirty"* — so Crumb, dragging eleven crab-lengths of mooring line,
averages under four minutes a brick and walks roughly thirty bricks in an hour,
against the five minutes a brick he managed empty-clawed in `b-wall`. Bible P-1
says jetty to Boat Shed **by any road, in either direction, takes eighty
minutes**, and §10 forbids any road being faster. The segment is complying with
`tree.md` §3, which itself splits the cut option as "twenty minutes of sawing
plus sixty of dragging" — so this is a **note back to the architect**, not a
writer's invention, but as written the path breaks P-1 and needs either a
different split (e.g. sawing off-clock before 10:25) or an explicit line
licensing a shorter laden traverse.

**A5 · minor · `c-cut` writer's notes — Grumble put at brick fourteen.**
Text: *"Grumble is fourteen bricks east on either timetable."*
Grumble's Rock is **brick fifteen** (bible, place table; `tree.md` §4), which is
what `c-cut.3` itself stages. Writer's-note-only, but it is a stated fact about
an NPC position and W-4 says those are computed, never chosen.

---

## B · State-doc flow

**B1 · blocker · `ending`, `[wall, cut]` doc, `protagonist.knows` — the record
that choice 2 happened is deleted.**
The parent (`c-cut`, `[wall, cut]`) carries *"he is the first creature in Salt
Pocket Cove ever to cut the mooring line, and he has told nobody (L-C3,
c-cut.1)"*. The final `[wall, cut]` doc drops that line **and adds nothing in
its place**. Its sibling, the `[pipe, cut]` doc, replaces it with three E5 lines
(*"…and he told Barnaby himself, before Barnaby could ask (L-C3, E5,
ending.2)"*, *"how to finish a raw end…"*, *"a cut rope can be spliced…"*).
Both docs carry the identical L-C1/L-C2/L-C3 ledger, so per the schema's diff
step 3 every `knows` difference must map to a ledger entry — none does. After
this doc, nothing in the world state remembers the cut except the peg fact
(L-C2). See F1 for the cause.

**B2 · minor · `c-cut.1` — "Thirty Crumbs" left on the peg; it is twenty-nine.**
`mid.2` establishes the line as **forty Crumbs**; `c-cut.1` cuts at **eleven**
(*"Eleven. Eleven's safe."*). 40 − 11 = **29**. `c-cut.1` narrates *"Thirty
Crumbs of the only rope in Salt Pocket Cove. On its peg."*, and the figure is
then copied into all four cut-path state docs (`c-cut` ×2, `ending` ×2:
*"what is left of the line — thirty Crumbs —"*). The story counts rope precisely
everywhere else (ten / eleven / forty / "four bells"), so this is an error, not a
child-friendly rounding. (`ending.2`'s float insert uses "thirty" correctly:
there ten Crumbs go on the bell out of forty.)

**B3 · minor · `c-cut.1` — twenty minutes of sawing does not fit inside a
twenty-minute scene.**
The scene is headed *"twenty-five past ten to a quarter to eleven"* = 20 minutes,
and the sawing is counted out on screen to the full twenty (*"That was five
minutes… That was ten minutes… Fifteen minutes. Twenty."*). That leaves zero
minutes for (a) walking out ten Crumbs, changing his mind and re-marking at
eleven, hauling the shell out from under the door, and laying the rope over the
step, and (b) the tidying afterwards — which the narration explicitly calls
**"the slow bit"** and which includes lifting the door, shoving twenty-nine
Crumbs of rope back inside, climbing the crab pots, re-hanging it and re-propping
the door. `tree.md` §3 budgets exactly twenty + sixty = eighty. Either the sawing
count or the scene boundary has to give.

**B4 · minor · `c-cut.3` — "half an hour" of pulling should be forty minutes.**
Text (at brick fifteen, twenty-five past eleven): *"Crumb had been pulling for
half an hour and he was out of puff."* He took hold of the neat end at a quarter
to eleven (`c-cut.1`), so it is **forty minutes**. W-3.

**B5 · minor · `mid.3` → `c-cut.1` — Nan's kelp cord is tracked only in the
state docs, and the staging works against it.**
`mid.3` (M3) puts the cord *"twice round the coil, and tied off in the loop"*.
The `mid` `[wall]` doc then asserts *"used as a haul-loop round the coil **and
put back** (mid.3)"* — no scene shows it coming off or going back, which is
audit B2 ("no item appears in the state doc that the scenes didn't put there").
`c-cut.1` then has Crumb shove *"the big rope back inside"* and hang it on its
peg with no mention of the cord; if the cord were still on the coil, **Nan's
washing line goes back on the peg in the Boat Shed at a quarter to eleven** and
P5 cannot be paid. The `c-cut` `[wall, cut]` doc simply declares it *"in his
shell-pocket"*. `ending.3` (E4) then needs it out of the shell. One staged line
in `mid.3` or `c-cut.1` closes this; as written the prop teleports.

**B6 · minor · `mid` `[wall]` → `c-cut` `[wall, cut]` — `knows` entries dropped
with no ledger cause.**
Four items present in the `mid` doc are absent from the `c-cut` doc: *"there is
an old oyster shell out of the door frame propping the door open, and one edge of
it has gone rough"*, *"the coil is far heavier than he is…"*, *"at that rate he
would not reach the jetty today…"*, and *"the water will be at the Boat Shed
doorstep at ten to eleven"*. Knowledge is not unlearned; schema diff step 3 says
every `knows` difference must map to a ledger entry in the doc's own ledger, and
none of these do. (The last one is the sharpest: the sibling `d-float` docs keep
it, so the two choice-2 children disagree about what Crumb knew at ten
twenty-five, which is *before* the choice.)

*Otherwise B1/B2/B3 pass:* every hand-off on the path is clean —
`intro` (8:40, b17, step 10, nothing carried) → `b-wall` → `mid` (10:00, b1,
step 7, cord carried, door-lift known) → `c-cut` (10:25, b1, step 7, coil on the
slip, oyster shell propping the door) → `ending` (11:45, b17, step 4, head down,
not looked up — `ending.1` opens on exactly that). Time is monotonic and every
recomputed value in every `derived` block on the path is correct:
`tide_step` 10 / 7 / 7 / 4 / 3 and `nan_brick` 3 / 9 / 10 / 16 / 17 all match the
formulas at 8:40, 10:00, 10:25, 11:45 and 12:05, and `grumble_default` matches
`tree.md` §4 at each of those times.

---

## C · Ledger discipline

**C1 · blocker · `ending` — L-C1, L-C2 and L-C3 have no consequence anywhere in
the shared trunk on this path (audit C2).**
`tree.md` §6 gives choice 2 exactly one budget row in `ending`, **E5**, licensed
by all three entries; §8 names E5 as choice 2's post-merge callback. E5 is not in
the text (see F1). Search the `ending` skeleton and the inserts that run on
`wall-cut`: the words *cut*, *sawn*, *raw*, *fray* and *splice* do not appear
once. `ending.2`'s staging even goes out of its way to stay agnostic — *"The
rope, whatever rope it is"*. So all three L-C entries die inside `c-cut`, which
is the branch remembering itself; the trunk does not. `tree.md` §6 closes with
"Every ledger entry in §2 and §3 appears at least once in a budget row. That is
the check that no choice was cosmetic" — the budget row exists, the insert does
not.

**C2 · minor · `mid.3` — the M3 insert is inert.**
M3 gives Crumb *"something his size to pull on"*, and the very next skeleton
lines — unchanged from the baseline — are *"He shoved, and it went the width of a
claw. / He shoved again…"* He never pulls on the loop, and `c-cut`'s writer's
note confirms it is never used again (*"the haul is bare-clawed on both paths"*).
L-B2 does have real consequences elsewhere (E4, P5), so this is not a C2 failure,
but as staged the insert changes nothing it claims to change and the wall child
sees no difference in the shove.

**C3 · minor · `c-cut` (and sibling `d-float`) — inserts and speaking cast that
`tree.md` licenses nowhere.**
`tree.md` §9 contracts `c-cut` with **"on stage: Crumb alone"**. As written, Nan
Prattle gets four speaking lines in `c-cut.2` and Grumble gets one in `c-cut.3`'s
baseline (this path's variant). Separately, `tree.md` §6's "hard budget" covers
only `mid` (three) and `ending` (six) — it budgets no inserts for `c-cut` or
`d-float`, yet both self-declare one (C-V1, F1). C1 is satisfied (C-V1 carries
`L-A1` / baseline tags correctly, and the baseline is the right side per §5), and
the NPCs are exactly where the timetable puts them, so nothing here is *wrong* in
the world — but the segment contract and the insert budget both need amending in
`tree.md`, or the cast needs cutting. Foreseeability (C3) is otherwise clean:
"touch the rope with a blade → the rope carries the mark of it and somebody
notices" is precisely what `c-cut` delivers (right up to the point where nobody
notices — C1).

---

## D · Callbacks

**D1 · blocker · choice 2 has zero explicit callbacks after its merge — D1 and
D2 both fail.**
`tree.md` §8 places choice 2's callback at **E5** in `ending`, and E5 is missing
(F1). The only later references to the cut are inside `c-cut` itself
(`c-cut.3`'s *"He'll see it."*), which is the branch remembering itself — exactly
what checklist D2 exists to reject. Note that `c-cut.3`'s own note to the
assembler points forward to it — *"what is said about the sawn end… is `ending`
(E1, E2, E5)"* — so the segment writer expected it to land and it does not. This
is the finding that matters most: on `wall-cut` the second choice currently has
no memory at all.

*Choice 1 passes cleanly, with room to spare.* Post-merge callbacks on this
path: **M2** in `mid` (*"Lift. Not pull." / "Not me. Nan said."*, the trunk
remembering — D2 satisfied), **M1** (arriving dry, still hearing Nan), **M3**
(the cord), and **E4** in `ending` (the ending shouted down to Nan and the cord
dropped onto brick seventeen). `b-wall.2` also carries the cross-branch plant
`tree.md` §8 requires, verbatim: *"He'll be up on his rock in a quarter of an
hour. Like always."*

---

## E · Default consistency

**E1 · minor · `b-wall` state doc (propagated to `mid`, `c-cut`, `ending`) —
Grumble's timetable paraphrased six minutes wrong.**
Doc text: *"Grumble wakes when the sun comes over the headland at twenty to ten
and is up on his rock **a quarter of an hour later**, every day of his life."*
`tree.md` §4 default day: wakes **9:40**, on the rock **9:46** — six minutes, not
fifteen; a quarter of an hour later would be 9:55, and his first complaint is at
9:46. Nan's spoken line is correct (*"He'll be up on his rock in a quarter of an
hour"* said at about half past nine ≈ 9:45); the doc mis-anchors it to the waking
rather than to the moment of speaking. It is copied verbatim into the `mid`,
`c-cut` and `ending` `[wall, …]` docs, so it is now the recorded timetable on two
of the four paths. Bible W-4.

**E2 · minor · sibling spot-check (`a-pipe.3` vs this path) — the kittiwakes
sing differently on the two branches.**
`b-wall.3`, ten o'clock: *"The kittiwakes sang ten o'clock. Four notes. Two of
them right."* `a-pipe.3`, the same ten o'clock: *"four notes. Ten o'clock, and
**every one of them wrong**."* The shared trunk makes it an invariant — `c-cut.2`:
*"They got two. **They always get the same two.**"*; `d-float.2`: *"Four notes.
They got two."* The choir is ambient, identical on every path (`tree.md` §4), and
no ledger entry touches it. `a-pipe` is the outlier. Checklist E2.

**E3 · minor · sibling spot-check — when Grumble's Rock goes under.**
`c-cut.3` at twenty-five past eleven has Grumble *"sitting on it"* at brick
fifteen; `d-float.3`'s staging from about twenty past eleven has *"the tide pools
have gone under"*, and at twenty to twelve *"Grumble's Rock had gone under the
water."* The tide is identical on both paths (step five until half past eleven,
then step four), so the pools cannot be dry on one branch and submerged on the
other in the same fifteen minutes. Defensible — `tree.md` §4 keeps Grumble on the
rock until 11:30 and `c-cut.3` calls the rock "shining" — but the two segments
should agree on how far under the pools are by eleven twenty.

*Otherwise E1 passes.* Grumble runs the unmodified default day on this path —
asleep in the grating at 8:40 (`intro.3`, `b-wall.1`), rock empty at ten to nine
(`b-wall.1`), on his rock with complaint four done at 10:22 (`mid` doc, matching
`derived.grumble_default`), all nine used up at 11:25 (`c-cut.3`), ninth
complaint at 11:22 and in through the grating at 11:45 (`ending.1`, E1 baseline),
`schedule: on-time` in every doc — and no `L-A1` anywhere on the path. Nan is the
control case and holds perfectly: brick 7 at 9:30, brick 9 at 10:00, brick 10 at
10:25, overtaken at brick 14 at 11:20, brick 16 at 11:45, brick 17 at noon, all
matching `1 + floor(minutes ÷ 15)`, with `b-wall.3` and `ending.3` both saying out
loud that Crumb changed nothing about it (P-4).

---

## F · Merge reconciliation

**F1 · blocker · `ending.2` — the rope-preparation variant slot is empty; insert
E5 does not exist.**
The scene reads:

> Narrator: That is all Crumb had left to do, and he had ten minutes to do it in,
> and it was not going to take ten minutes.
> `[beat]`
> **Narrator: Except for one thing.**
> `[beat]`
> *(blank)*
> `[beat]`
> Narrator: And then Crumb tied the knot.

"Except for one thing" is set up and then never paid — on **all four paths**. On
`cut` paths the missing block is **E5** (`tree.md` §6: *Barnaby sees the raw sawn
end before Crumb can hide it; Crumb owns up on his own; Barnaby shows him how to
finish an end so it will not fray, and says a cut rope can be spliced this
afternoon* — licensed by L-C1, L-C2, L-C3). On `float` paths the missing block is
E6's first limb (the wringing out before the eye — L-D1/L-D2); E6's other two
limbs *are* present, after the knot and in `ending.3`. So the slot is empty for
every path, and this is the only place in the whole trunk where choice 2 was ever
going to show.

Everything around it asserts E5 is there: the segment header table (*"E5 · …
`ending.2`"*), the writer's notes (*"E5's owning-up is warm and Barnaby is
delighted… the confession gets 'that's not a bad thing or a good thing, that's a
rope'"* — a line that appears nowhere in the file), the claim *"Insert budget:
six used, six allowed"*, `c-cut.3`'s note to the assembler, the `[pipe, cut]`
state doc's three E5 `knows` entries, and both cut docs' promise ledgers.
Checklist F2 (every remaining difference at the merge expressed as a tagged
variant insert in the skeleton) fails, and C1, D1 and G1 fail with it.

**F2 · minor · `mid` merge — sibling docs differ on fields the schema says must
be identical.**
Schema diff step 1: `clock`, `derived`, `weather`, `stage.location` must be
**identical** between siblings, "no exceptions, no licensing". At `mid`:
`weather` is *"flat calm; the high thin cloud burned off at ten; clear and
sunny"* (`a-pipe`) against *"flat calm; the high thin cloud burned off — clear
and sunny"* (`b-wall`); `stage.location` is *"outside the Boat Shed's front door,
on the slip, brick 1"* against *"outside the Boat Shed's front door, brick 1"*.
Same meaning, different strings — which is exactly the class of drift the "copy
it forward" rule exists to stop. (`mid` then normalises both, correctly.)

*Otherwise F1 passes.* Both branches deliver `mid`'s contract — brick one, ten
o'clock, step seven, Crumb alone outside a shut door — and both deliver
`ending`'s: top of the jetty steps, brick seventeen, a quarter to twelve, step
four, a rope, Barnaby on his post, Grumble at brick seventeen (at the grating on
this path, correctly, since L-A1 is not present). The reconciled-difference
tables in `tree.md` §5 are honoured item by item on this path: dry (L-C1), a
bell-length with a raw end (L-C1), the rest on its peg cut (L-C2), the untold
secret (L-C3) — the last of which then evaporates, per C1.

---

## G · Chekhov ledger

**G1 · blocker · `ending`, `[wall, cut]` doc — P7 vanishes; it is neither open
nor paid.**
The parent `c-cut` `[wall, cut]` doc lists *"P7 · somebody is going to find that
cut end · opened by L-C3 · c-cut.1"* under `promises.open`. In the final
`[wall, cut]` doc, `promises.open` contains **only P4**, and `promises.paid`
contains P1, P2, P3, P5, P6. **P7 appears in neither list.** It has been deleted,
not resolved — the exact failure checklist G1 names ("silently dropped promise =
finding") and the schema's diff step 4. Two separate breaches:
1. The doc is malformed: a promise may not leave `open` without appearing in
   `paid`.
2. Even a correctly formatted doc could not pay it — E5 is missing (F1), so
   nothing in `ending` finds the cut end. `tree.md` §7's closing rule allows
   **exactly one** promise still open in a final doc on this path, **P4**; P7
   open at the end would be a second, and is a finding either way. The fix is
   E5, not a doc edit.
Note the sibling `[pipe, cut]` doc pays P7 correctly at *"ending.2 (E5)"* — so
the two cut paths, carrying identical choice-2 ledgers, disagree about whether
E5 happened.

*The rest of the promise walk is clean:*
- **P1** — opened `intro.1` (too-small shell, big spiral one at the end of the
  row, "Barnaby says not yet"), touched at `b-wall.1` b14 and `c-cut.2` b14
  ("Not yet."), tension built in `mid.3` and `c-cut.2` (the shell riding loose
  from brick eleven), **paid** `ending.3` — he comes clean out of it on the long
  pull and Barnaby sends him to the big one. ✓
- **P2** — opened `intro.2`, rehearsed `b-wall.3` (see A1), **paid** `ending.2`,
  and paid twice over: it is how the rope goes on, and `c-cut.1` spends it a
  second time (*"Loops eat rope." / "Eleven's safe."*) — the reason he cut eleven
  rather than ten. ✓
- **P3** — opened `intro.2`, **paid** `ending.3`: bell at noon, step three, the
  *Sandhopper* crosses. ✓
- **P4** — opened `intro.3`, **still open by design**, correctly flagged in the
  final doc with the `tree.md` §7 G1 citation. ✓
- **P5** — opened by L-B2 at `b-wall.2` (*"And bring it back." / "I'll bring it
  back. I promise."*), **paid** `ending.3` (E4), the cord dropped onto brick
  seventeen in front of her. ✓ (Prop-tracking caveat at B5.)
- **P6** — opened by L-B3 at `b-wall.2`, **paid** `ending.3` (E4), and the
  timing is right: he could not have paid it at half past nine because there was
  no ending yet, and Nan does not stop for it. ✓
