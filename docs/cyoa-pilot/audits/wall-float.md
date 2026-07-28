# Continuity audit — path `wall-float`

Segments audited, in order: `intro` → `b-wall` → `mid` → `d-float` → `ending`.
Sibling spot-checks (checklist E2): `a-pipe`, `c-cut`.

**VERDICT: FAIL — 18 findings (3 blockers, 15 minor).**

The path's spine is sound: every clock, tide step, Nan brick and Grumble
timetable entry in the *state docs* recomputes correctly, the ledger blocks are
verbatim and correctly accumulated, the merge contracts are met, and the
promise schedule (P4 open by design, P5/P6 paid, P7 absent) is exactly as
`tree.md` §7 requires. The failures are in the prose's stated numbers, in three
state-doc fields that assert things no scene on this path put there, and in one
shared-skeleton line that is only true on the sibling branch.

---

## A. Bible conformance

**A1 · blocker · `b-wall.3`, "Brick three" beat.**
Text: *"Narrator: Over, under, round, and through."*
Should be the mnemonic as taught: *"Round, under, through, and pull."*
`intro.2` establishes it twice (Barnaby: "Round the post. / Under itself. /
Through the loop. / Pull." and Crumb: "Round, under, through, and pull!") and
`ending.1` ("Round, under, through, and pull.") and `ending.2` (Crumb under his
breath, the four-line form) both use the established wording. This is P2's
ritual phrase (`tree.md` §7), and the same doc's `knows` cites this very beat
("it came out right first go in Nan's cord at brick three"). A six-year-old
tracking a repeated chant will hear the change. Checklist A1 / failure mode (3).

**A2 · minor · `b-wall.2` and `ending.3` (E4 and skeleton), Nan Prattle's
dialogue.**
Text: e.g. *"Don't stop, my love. I can't stop. Walk with me."* (10 words);
*"Course it was, my love. He wakes when the sun comes over the headland. Twenty
to ten. Every day of his life."* (23 words); `ending.3` *"Well, ring it, my
love. That's my boat out there."* (10 words).
Bible T-1 sets a hard ceiling: **speech bubbles six words maximum**. `intro`
holds that ceiling on every line of Crumb's and Barnaby's; Nan breaks it in
every scene she appears in. Either Nan's lines get broken into six-word beats
(which also serves T-6 — her stream is funnier chopped), or the bible needs an
explicit written exemption for her. Note back to the architect; do not let the
drift stand silently.

**A3 · minor · `mid.3` and `d-float.3`, spoken distances.**
Text: `mid.3` *"From the doorstep to the jetty is seventeen bricks."*;
`d-float.3` *"Crumb had come seventeen bricks."*
Should be **sixteen**. The Boat Shed is brick one and the jetty brick
seventeen (bible, the sea-wall table), so the span is sixteen brick-lengths —
which is what `b-wall.1` says from the same span ("Sixteen bricks to go"), what
`c-cut.1` says ("A quarter to eleven. Step six. Sixteen bricks to go"), what
`c-cut.2` is titled, and what `d-float`'s own writer's note computes with
("sixteen bricks in fifty-five minutes"). Note that the *staging* idiom
"seventeen bricks away east" (in `mid.1`, `d-float.1`, `a-pipe.3`, `c-cut.1`)
means "at brick seventeen" and is fine; these two are the narration lines that
assert a count and get it wrong.

**A4 · minor · `b-wall.2`, "The second thing given".**
Text: *"Nan starts unwinding the kelp washing-line off her shell without being
asked, **which takes her most of a brick**."*
A brick is a quarter of an hour (bible P-4, `tree.md` §4), but the whole
encounter runs 9:30 → 9:35 (the segment header, `b-wall.3`'s "walking backwards
for five minutes", and the state doc's 9:35 hand-off all agree). "Most of a
brick" is ten to fifteen minutes and does not fit. Should be a beat measure that
fits five minutes.

## B. State-doc flow

**B1 · blocker · `d-float`, output doc `path: [wall, float]`,
`protagonist.carrying`.**
Text: *"- a smooth green pebble from the Pipe, kept for luck"*.
Delete. Nothing on this path can have put it there: Crumb never entered the
Pipe (choice 1 = wall), no scene in `b-wall`, `mid` or `d-float` mentions a
pebble, and no ledger entry on this path (L-B1…B3, L-D1…D3) licenses it — it is
Pipe material, and even the sibling `[pipe, float]` doc does not carry it
(`a-pipe.3` uses "put it in his pocket … like a good stone" as a *metaphor*).
It then vanishes from the `ending` doc with no scene removing it. Audit B2
("nothing appears in the state doc that the scenes didn't put there"), schema
diff step 3 ("every difference must map to a ledger entry listed in the doc's
own `ledger` block"), and checklist C1. Failure mode (2)/(3).

**B2 · minor · `mid` output doc `[wall]` and `d-float` output doc
`[wall, float]`, `protagonist.carrying`.**
Text: *"used as a haul-loop round the coil and put back (mid.3)"*.
`mid.3`'s M3 insert shows the cord coming out of the shell-pocket, going twice
round the coil and being tied off — it never shows it coming off again, and the
segment ends with the coil out on the slip. The only support for "put back" is
downstream, in `d-float.3`'s F1 line ("in a hermit crab's shell, in the sea").
Either M3 gets a half-line untying it (it is inside the existing insert, so no
budget cost) or the citation is wrong. Audit B2.

**B3 · minor · `b-wall` output doc, `protagonist.knows` (carried verbatim into
`mid` `[wall]`, `d-float` `[wall, float]` and `ending` `[wall, float]`).**
Text: *"Grumble wakes when the sun comes over the headland at twenty to ten and
is up on his rock **a quarter of an hour later**, every day of his life"*.
The scene (`b-wall.2`) has Nan say *"He'll be up on his rock in a quarter of an
hour"* — spoken at half past nine, i.e. about a quarter to ten. The doc
re-anchors "a quarter of an hour" to the waking, which yields five to ten, and
`tree.md` §4 puts him on the rock at **9:46, six minutes after waking**. The doc
states a fact the scene did not state and that contradicts the computed
timetable (bible W-4). It is also the fact `tree.md` §8 plants for rewatchers,
so it has to be right in all four copies.

**B4 · minor · `ending` output doc `[wall, float]`, `protagonist.condition`.**
Text: *"wet through and drying in the sun, salt drying white on him (L-D1); dry
and clean underneath it — nothing on him but the sea; no shell on"*.
"Wet through" and "dry … underneath it" cannot both be true; the intent is
"no pipe-slime", which the sibling `c-cut` `[wall, cut]` doc states cleanly as
"dry and clean **of slime**". Same wording error is inherited from the
`d-float` `[wall, float]` doc's condition field. Audit B2.

**B5 · minor · `ending` output doc `[wall, float]`, `protagonist.knows`.**
Three facts carried in the parent `d-float` doc are dropped with nothing in
`ending` closing them: *"there is an old oyster shell out of the door frame
propping the Boat Shed door open …"*, *"the tide comes in eastward along the
wall … since eight o'clock (d-float.2)"*, and the on-foot-arithmetic line. B2
requires that "nothing the scenes established is missing from it"; `knows` is
append-and-update, not prune. (The oyster-shell one also has a world
consequence — see G1.)

## C. Ledger discipline

**C1 · minor · `ending.3`, E4 staging.**
Text: *"(Crumb goes over to his shell … and pulls out a claw's-length of **dry**
kelp cord.)"*
On this path the cord has been in his shell through a fifty-five-minute ride in
the sea; `d-float.3`'s F1 wall variant says so out loud ("Nan Prattle's washing
line went by underneath her, in a hermit crab's shell, in the sea") and the
`d-float` `[wall, float]` doc records it as "soaking (L-D1, d-float.3)". E4 is
shared between `wall-cut` (where "dry" is correct) and `wall-float` (where it is
not), so the adjective must go or be two-sided. L-D1. Bible T-7 covers the
outcome ("a wet rope dries"), so Nan's "It's been somewhere, that has" still
lands — better, in fact.

**C2 · minor · `ending.3`, skeleton (the long pull).**
Text: *"The shell has been riding loose on him **since brick eleven**."*
Nothing on this path establishes that. Brick eleven is `c-cut.2`'s beat
("Somewhere around brick eleven … the shell is riding high and loose on him";
"By brick eleven his back end was sticking further out of his shell than it had
ever stuck in his life"), and the `c-cut` docs carry it in `shell:`. On the
float path Crumb passes brick eleven sitting on a rope, and `d-float`'s `shell:`
says only "the bit that sticks out is the bit that got cold". P1's payoff line
therefore leans on the sibling branch's material with no tag — untagged
divergence, which `tree.md` §5's baseline rule and checklist C1 both call a
finding. Fix by making the skeleton line path-neutral ("had been riding loose
on him all morning") or by giving `d-float.3` the plant.

**C3 · minor · `b-wall`/`mid`/`d-float`/`ending` docs, `protagonist.knows`,
the two Grumble lines from `b-wall`.**
*"Grumble was asleep in the grating at twenty to nine, and his rock at brick
fifteen was still empty at ten to nine (b-wall.1)"* and the Grumble-timetable
line from Nan (b-wall.2). Both are real divergences from the sibling docs at
`mid` and at the `ending` merge, and neither maps to a ledger entry: L-B1 is the
door, L-B2 the cord, L-B3 the debt. Schema diff step 3 requires every
`knows` difference to name an entry in the doc's own `ledger` block. `tree.md`
§8 *mandates* Nan's timetable line as the plant for the pipe branch, so the gap
is in the tree, not the writer — this wants an L-B4 stub ("chose wall → Crumb
has heard Grumble's timetable from Nan and has seen his rock empty"). Note back
to the architect.

**C4 · minor · `d-float`, insert F1 (and, by the same reasoning, `c-cut`'s
C-V1).**
`tree.md` §6 budgets inserts for `mid` (three) and `ending` (six) only, but
`c-cut` and `d-float` are also shared skeletons — each plays on both choice-1
histories — and each has spent one two-sided variant. F1 is correctly written
(both sides tagged, one line each, per §5's exhaustive-choice rule), but it sits
outside the stated budget. Architect note, not a writer error.

*C2 (no cosmetic choices) passes:* L-B1 → `mid` M2 and `ending` E4 ("I lifted
the door! First go!"); L-B2 → `mid` M3, `d-float` F1, `ending` E4; L-B3 →
`d-float` F1, `ending` E4; L-D1 → the whole of `d-float`, `ending` E6; L-D2 →
E6's wringing and the long tail; L-D3 → `d-float.2` and E6's laugh. *C3
(foreseeable in kind) passes:* taking the road where the people are yields a
person's gifts; taking the rope into the water yields a wet rope and water
things.

## D. Callbacks

None. Choice 1 has a post-merge callback in shared territory at `mid` (M2, the
door — "Not me. Nan said.") and again at `ending` (E4), satisfying D1 and D2.
Choice 2 has E6 at `ending`, in shared-trunk territory, in three places. The
`tree.md` §8 "quiet" callback — Nan at brick seventeen at noon regardless — is
present and is explicitly narrated in `d-float.3` and `ending.3`.

## E. Default consistency

**E1 · blocker · `d-float.3`, after the pass at brick fifteen.**
Text: *"She would be at brick sixteen **in a quarter of an hour**, and brick
seventeen at noon."*
Spoken at twenty to twelve. `nan_brick = 1 + floor(minutes since 8:00 ÷ 15)`
puts her at brick sixteen from **11:45** — five minutes away — and brick
seventeen at noon. As written the two halves of the sentence are also mutually
impossible (b16 at 11:55 then b17 five minutes later), which breaks the
one-brick-per-quarter-hour rate the same paragraph has just asserted. Nan is the
story's second clock and its control case (`tree.md` §4, bible P-4, W-4);
getting her rate wrong out loud in the shared skeleton undoes the whole
default-consistency proof. Should be "at brick sixteen in five minutes, and
brick seventeen at noon."

**E2 · minor · `ending.1`, staging.**
Text: *"Behind, the sea wall going away west, seventeen bricks of it, and **a
long way back along it** something small and slow and talking."*
At a quarter to twelve Nan is at brick sixteen — adjacent. `ending.2`'s staging,
five minutes later, correctly says "one brick away", and `c-cut.3` says "Behind
him, one brick back, Nan Prattle came on." Recompute: `1 + floor(225 ÷ 15) =
16`.

**E3 · minor · sibling spot-check, `a-pipe.3` vs the rest of the corpus.**
Text: *"Above him, on the cliff, four notes. Ten o'clock, and **every one of
them wrong**."*
Every other segment has the choir getting two of the four right, and twice
insists the same two: `b-wall.1` ("The kittiwakes get about two of them"),
`b-wall.3` ("Two of them right"), `mid.1` ("got two of the four notes"),
`d-float.2`, `c-cut.2` and `ending.3` ("They got two. They always get the same
two"). The kittiwake choir is ambient and causally untouched by any choice, so
it must be identical on every path (checklist E2, bible P-11). `a-pipe` is the
odd one out — flagged here because it is a cross-path ambient fact, not because
it is on my path.

*Otherwise E1 passes:* Grumble's default day is recomputed correctly at every
node on this path — complaint two of nine at 10:00 (9:46, 9:58), complaint four
of nine at 10:25 (…10:10, 10:22; fifth due 10:34), ninth at 11:22, off the rock
at 11:30, at the grating at 11:45, inside it at noon — matching `tree.md` §4's
default table exactly, with `schedule: on-time` and no L-A1 anywhere on the
path. The tide recomputes correctly in every header and every `derived` block
(10 at 8:40, 9 at 9:00, 8 at 9:30, 7 at 10:00 and 10:25, 6 at 10:30, 5 at 11:00,
4 at 11:30 and 11:45, 3 at noon and 12:05). Nan's brick is right in every
`derived` block (3, 9, 10, 16, 17) and at every meeting (b7 at 9:30, b15 at
11:40, b17 at noon).

## F. Merge reconciliation

**F1 · minor · `d-float` output docs, `stage.on_stage`, at the `ending`
merge.**
`d-float` (both docs): `on_stage: [Crumb]`. Sibling `c-cut` `[wall, cut]`:
`[Crumb, Old Barnaby, "Grumble (just up to the grating from his rock, arriving
this minute)"]`. `tree.md` §5's ending-merge contract requires, at the merge,
"Crumb at the top of the jetty steps … Barnaby on his post; Grumble at brick
seventeen", and Barnaby is named skeleton-critical cast. Checklist F1 wants the
same cast on stage from both incoming branches. `d-float`'s writer's note
("cuts before he looks up") explains why Crumb has not *spoken* to anyone, but
Barnaby is bolted to the post in frame either way, and on wall paths Grumble
crosses the top of the steps at exactly 11:45 (`ending` E1 baseline). The two
docs must be reconciled — the `everyone` rows already agree, so only
`on_stage` is wrong.

*Merge at `mid` passes:* `b-wall` and `a-pipe` docs are identical in `clock`,
`derived` (values), `weather` and `stage.location`; every difference is tagged
(carrying → L-B2; condition → L-A2; Grumble's row → L-A1); the `shell:` wording
drift between the two parents was normalised at `mid` on purpose and recorded.
F2 passes at both merges: M1/M2/M3 and E1/E4/E6 are all tagged, and `mid` uses
three of three inserts, `ending` three of six on this path.

## G. Chekhov ledger

**G1 · minor · the oyster shell / the propped Boat Shed door.**
Planted in `mid.1` (falls out of the frame, props the door, "Thank you,
shell"), still in shot at the end of `mid.3` as the segment contract requires,
re-confirmed in `d-float.1` ("the shed door was still propped open behind him,
on an old oyster shell, exactly where he had put it") — and then never
mentioned again, with the fact dropped from the final state doc (see B5). On
the cut path the door is deliberately left open and that is the whole moral load
of the branch; on the float path it is simply abandoned, leaving the cove's only
shed propped open at the end of the story with no line acknowledging it. Not a
promise listed in `tree.md` §7, so this is not a G1 breach on the letter — but it
is a planted object left dangling, and at minimum the final doc should carry it.

*Otherwise G1 passes, exactly as designed:* P1 paid (`ending.3`, he comes clean
out of the shell and is sent home to the spiral one), P2 paid (`ending.2`, the
Bosun's Loop holds the bell — subject to A1), P3 paid (`ending.3`, the
*Sandhopper* crosses), P5 paid (E4, the cord dropped onto brick seventeen), P6
paid (E4, the ending shouted down). **P4 is the single remaining open promise**
in the final doc, flagged in the doc itself as deliberate per `tree.md` §7 G1 —
correct for `wall-float`. P7 never appears on this path, at any node, which is
correct: it is opened by L-C3 and L-C3 is not on this ledger.
