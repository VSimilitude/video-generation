# Tree — *Crumb and the Bell That Lost Its Rope*

Topology, causal design, ledger stubs and NPC timetable for the Phase-2 pilot.
Read `bible.md` first. Everything a branch writer is allowed to diverge on is in
this file; if it is not here, it is not licensed.

**Premise.** Today is the day Crumb, a hermit crab who has grown one size too
big for his shell, gets to ring the Tide Bell for the first time — the bell that
tells the *Sandhopper* the water is high enough to come home. At twenty to nine
the bell's old rope comes apart in his claws, and the only other rope in Salt
Pocket Cove is a mooring line on a peg in the Boat Shed, eighty minutes away at
the far end of the beach. High tide is at noon.

---

## 1 · Shape

```
                              intro   (8:00 – 8:40, jetty)
                                │
                        ┌── CHOICE 1 ──┐   "which road to the Boat Shed?"
                        │              │
                   A · a-pipe      B · b-wall     (8:40 – 10:00)
                        │              │
                        └──── merge ───┘
                                │
                              mid     (10:00 – 10:25, Boat Shed)
                                │
                        ┌── CHOICE 2 ──┐   "the line is too big for you"
                        │              │
                   C · c-cut      D · d-float     (10:25 – 11:45)
                        │              │
                        └──── merge ───┘
                                │
                             ending   (11:45 – 12:00, jetty)
```

Seven segments, **three scenes each**, four root-to-leaf paths:
`pipe-cut`, `pipe-float`, `wall-cut`, `wall-float`.

### Segment synopses (one line each)

| id | when / where | synopsis |
| --- | --- | --- |
| `intro` | 8:00–8:40 · Shell Shelf → jetty | Crumb wakes too big for his shell on the morning he is to ring the Tide Bell, runs the wall to the jetty, learns the Bosun's Loop from Barnaby — and the old bell rope perishes in his claws. |
| `a-pipe` | 8:40–10:00 · the Pipe | Crumb squeezes past a sleeping lobster into the dark and feels his way the whole length of the headland, coming out green, alone, and the only creature alive who knows where the Pipe goes. |
| `b-wall` | 8:40–10:00 · the sea wall | Crumb trots the long bright way west, past an empty rock and his own front door, and walks backwards for five minutes beside Nan Prattle, who gives him three things without being asked. |
| `mid` | 10:00–10:25 · Boat Shed | Crumb gets the sticking door open, finds the spare mooring line on its peg — and discovers it is four times longer and many times heavier than one hermit crab. |
| `c-cut` | 10:25–11:45 · Boat Shed → jetty | Crumb saws a bell-length off the only rope in the cove with an old oyster shell, and carries it east with a raw end and a knot in his stomach. |
| `d-float` | 10:25–11:45 · the water's edge | Crumb waits for the tide to reach the doorstep, then rides the whole coil the length of the cove, out of his depth for the first time in his life. |
| `ending` | 11:45–12:00 · jetty | The rope goes on with a Bosun's Loop, the kittiwakes sing twelve, Crumb rings three and a long one and comes clean out of his shell — and the *Sandhopper* crosses the bar. |

---

## 2 · Choice 1 — at the jetty, twenty to nine

**Prompt, as the viewer hears it** (Narrator, over the fork: the grating with
Grumble asleep in it on one side, the sea wall on the other):

> Two roads to the Boat Shed, and both take eighty minutes. Dark and short,
> bright and long, both the same. So — which one?
>
> **Through the Pipe** · or · **Along the sea wall**

**What the choice is really about:** doing a hard thing on your own in the dark,
versus taking the long way round where the people are. Nerve versus company.
Both are honourable; neither is the brave one (bible T-2). The viewer can *see*
the cost of the Pipe — Grumble is asleep in the grating, on screen, at the
moment of the choice.

**Foreseeable in kind:** go into a dark place nobody goes → you disturb whoever
lives there, and you find out something nobody knows. Go the long way where the
people are → you meet somebody and come away carrying what they gave you.

### Ledger stubs

`A · pipe`

| id | entry |
| --- | --- |
| **L-A1** | `chose pipe → Grumble is woken at twenty to nine, an hour early; his whole day runs an hour early, so his ninth complaint is done by half past ten and he is finished by a quarter to eleven with nothing left to do` |
| **L-A2** | `chose pipe → Crumb is green with pipe-slime from his back to his claw tips, and it will not come off today` |
| **L-A3** | `chose pipe → Crumb knows where the Pipe comes out, and is the only creature alive who does` |

`B · wall`

| id | entry |
| --- | --- |
| **L-B1** | `chose wall → Nan told Crumb the Boat Shed door has to be lifted, not pulled, so he knows it before he gets there` |
| **L-B2** | `chose wall → Crumb is carrying Nan's kelp washing-line, a claw's-length of dry cord, lent on the promise that he brings it back` |
| **L-B3** | `chose wall → Crumb owes Nan the end of the story, and Nan will be at brick seventeen at noon to collect it` |

L-B2 **opens a new promise** (return the cord) which the branch writer must add
to the state doc's path-scoped promise list. See §7.

---

## 3 · Choice 2 — at the Boat Shed, twenty-five past ten

**Prompt, as the viewer hears it** (Narrator; on one side the old oyster shell
from the door frame, on the other the water creeping up the slip toward the
doorstep):

> The line is too long and too heavy and the tide will not wait. Crumb could saw
> off just the piece the bell needs — but nobody in Salt Pocket Cove has ever cut
> the mooring line. Or he could wait for the water and float the whole thing
> home.
>
> **Cut the piece he needs** · or · **Float the whole line**

**What the choice is really about:** breaking a small rule so you can be certain,
versus keeping the rule and trusting something bigger than you to help. Taking
only what you need versus taking care of what is not yours. Again, neither is
correct: cutting is not naughty and floating is not noble (T-2).

**Foreseeable in kind:** touch the rope with a blade → the rope carries the mark
of it and somebody notices. Take it into the water → it comes out of the water
wet, and water things follow.

**Both options take exactly eighty minutes** (bible P-1): cutting is twenty
minutes at the doorstep — measuring, sawing and tidying up after himself — plus
sixty of dragging; floating is twenty-five minutes of waiting for the water to
reach the doorstep plus fifty-five of riding. Both arrive at the jetty at a
quarter to twelve with the tide at step four. Per P-1 the split is bookkeeping,
not a race: neither road is faster and no load makes one faster.

### Ledger stubs

`C · cut`

| id | entry |
| --- | --- |
| **L-C1** | `chose cut → Crumb carries a dry bell-length of the mooring line, sawn with the old oyster shell, with one raw end that will fray if it is not finished` |
| **L-C2** | `chose cut → what is left of the only rope in the cove hangs on its peg with a cut end, where anyone can see it` |
| **L-C3** | `chose cut → Crumb has done a thing nobody in Salt Pocket Cove has ever done, and has told nobody` |

`D · float`

| id | entry |
| --- | --- |
| **L-D1** | `chose float → Crumb waited for the water to reach the doorstep and rode the whole coil the length of the cove; he arrives wet to the eyes and the tide did the carrying` |
| **L-D2** | `chose float → the whole line is at the jetty, soaked and swollen; it will not go through the bell's eye until it is wrung out, and there is far more of it than the bell needs` |
| **L-D3** | `chose float → Crumb has been out of his depth and floated, and is not frightened of deep water any more` |

---

## 4 · The world-day timetable

**This runs identically on all four paths** unless a row says otherwise. Nan's
brick and Grumble's place are *computed*, never chosen (bible W-4).

### The tide — never interfered with, on any path

`tide_step = 11 − floor(minutes since 8:00 ÷ 30)`

| 8:00 | 8:30 | 9:00 | 9:30 | 10:00 | 10:30 | 11:00 | 11:30 | 12:00 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | **3 — high tide, the bell** |

The water reaches the Boat Shed doorstep at **ten to eleven**. It is over the bar
at noon and not before.

### Nan Prattle — never interfered with, on any path

`nan_brick = 1 + floor(minutes since 8:00 ÷ 15)` — one brick every quarter hour,
west to east, brick one at eight, brick seventeen at noon. She is walking to the
jetty to meet her grandsons' boat, as she does every morning of her life.

| 8:00 | 8:40 | 9:00 | 9:30 | 10:00 | 10:25 | 11:00 | 11:45 | 12:00 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| b1 | b3 | b5 | b7 | b9 | b10 | b13 | b16 | **b17** |

She is the story's second clock and its control case: **Crumb talks to her on
the `b-wall` path and it changes nothing about where she is** (bible P-4), which
is exactly the point the default-consistency rule is trying to prove. She
arrives at brick seventeen at noon on all four paths, in time for the bell.

### Grumble — the NPC a choice interferes with

Default day (paths `wall-cut`, `wall-float`):

| time | where / what |
| --- | --- |
| until 9:40 | asleep just inside the grating, brick seventeen |
| 9:40 | wakes when the sun clears the headland |
| 9:46 | on Grumble's Rock, brick fifteen |
| 9:46 → 11:22 | the nine complaints, twelve minutes apart (9:46, 9:58, 10:10, 10:22, 10:34, 10:46, 10:58, 11:10, 11:22) |
| 11:30 | list finished; leaves the rock |
| 11:45 | reaches the grating; **passes Crumb at the top of the steps and goes in** |
| 12:00 | inside the Pipe, grumbling at the bell through the grating |

**Interfered day (paths `pipe-cut`, `pipe-float`) — licensed by L-A1 only:**

| time | where / what |
| --- | --- |
| **8:40** | **woken by Crumb going past him into the Pipe** — one hour early |
| 8:46 | on Grumble's Rock, brick fifteen |
| 8:46 → 10:22 | the same nine complaints, same order, twelve minutes apart (8:46, 8:58, 9:10, 9:22, 9:34, 9:46, 9:58, 10:10, 10:22) |
| 10:30 | list finished; leaves the rock |
| 10:45 | reaches the grating — and it is only a quarter to eleven, there is nothing left to complain about, and there is still no rope on the bell post |
| 10:45 → 11:45 | sits at the top of the jetty steps getting crosser, complaining at Barnaby about the bell |
| 11:45 | **already on the jetty when Crumb arrives, and stays** |
| 12:00 | on the jetty for the bell |

The interference is a *hinge*, not a personality change: same nine complaints,
same order, same going-home time relative to the list. All that moves is the
hour. Nothing else about Grumble may differ between paths.

### Ambient, identical on every path

- **Kittiwake choir**: sings the hour from the cliff at eight, nine, ten, eleven
  and twelve. Four notes. Badly.
- **Weather**: flat calm; high thin cloud until about ten, then clear.
- **The *Sandhopper***: outside the bar from before dawn, waiting for the bell;
  crosses at noon.

---

## 5 · Merge contracts

### Merge at `mid` — Boat Shed front door, brick one, ten o'clock, tide step 7

Both `a-pipe` and `b-wall` **must end** with: Crumb standing outside the Boat
Shed's front door at brick one; ten o'clock; tide at step seven; Crumb alone on
stage; Grumble and Nan and Barnaby where the timetable puts them.

Reconciled differences, all ledger-traced:

| difference | licensed by |
| --- | --- |
| Crumb is green | L-A2 |
| Crumb knows where the Pipe comes out | L-A3 |
| Crumb knows to lift the door | L-B1 |
| Crumb is carrying Nan's kelp cord, and owes it back | L-B2 |
| Crumb owes Nan the end of the story | L-B3 |
| Grumble is an hour ahead of himself (off stage) | L-A1 |

### Merge at `ending` — top of the jetty steps, brick seventeen, quarter to twelve, tide step 4

Both `c-cut` and `d-float` **must end** with: Crumb at the top of the jetty
steps; a quarter to twelve; tide at step four; a rope of some kind with him;
Barnaby on his post; Grumble at brick seventeen (at the grating, or on the
jetty if L-A1 is on the path).

Reconciled differences, all ledger-traced:

| difference | licensed by |
| --- | --- |
| what Crumb carries: a dry bell-length with a raw end / the whole soaked coil | L-C1 / L-D1, L-D2 |
| Crumb is dry / wet through | L-C1 / L-D1 |
| Crumb is carrying a secret / has stopped being afraid of deep water | L-C3 / L-D3 |
| the rest of the line is on its peg with a cut end / is here at the jetty | L-C2 / L-D2 |

### The skeleton-critical cast rule

`docs/CYOA.md` asks for "same cast on stage" at a merge and, three lines later,
licenses "a character present or absent" as a variant insert. Those cannot both
be absolute. **The rule for this pilot:** a merge requires identity of location,
time, tide step, protagonist state, and every character whose presence the
shared skeleton's blocking depends on (**skeleton-critical cast**). Here that is
**Crumb, Barnaby, Nan and the *Sandhopper***. A ledger-licensed *extra* presence
— Grumble up on the jetty on `pipe-` paths — is a variant insert, and the
skeleton must read correctly without him.

### The baseline rule

A shared skeleton has one **baseline** text: what runs when no ledger entry
licenses anything else. A variant insert is a *deviation from the baseline* and
carries the id of the entry that licenses it. Where a choice is exhaustive (every
path took A or B, so there is no unmarked default), the insert is written as
**two tagged variants** and both carry entry ids. Untagged divergence is a
finding either way.

---

## 6 · Variant-insert budget

Hard budget, counted in **rows**. An insert is **one beat** — one thing that
happens — and its *size* is whatever its own budget row below says it is: a
single narration line, a visible prop, a character's presence, or, where the row
says so, a short scored exchange. A writer may not add a row and may not play a
row bigger than the row describes. If a writer wants more, the answer is no.

### `mid` — at most **three** inserts

| # | insert | licensed by |
| --- | --- | --- |
| M1 | *(two tagged variants)* Crumb arrives round the back of the shed, green, having just found out where the Pipe goes **/** Crumb arrives along the top of the wall, dry, still hearing Nan talking | L-A2, L-A3 **/** L-B1…B3 |
| M2 | *(two tagged variants)* Crumb pulls at the sticking door, pulls harder, falls over, and only then thinks to lift it **/** Crumb lifts it first go, because Nan said | *(baseline)* **/** L-B1 |
| M3 | Nan's kelp cord comes out of Crumb's shell-pocket to tie a haul-loop round the coil so he can pull instead of shove, and goes back in the pocket at the doorstep | L-B2 |

M2's baseline is the `pipe` version: with no entry telling him about the door,
he works it out himself. That is why M2 is the **choice-1 callback inside the
shared trunk** — the trunk remembers.

### `c-cut` — at most **one** insert

| # | insert | licensed by |
| --- | --- | --- |
| C-V1 | *(two tagged variants)* Grumble's Rock at brick fifteen at twenty-five past eleven: **empty**, because his day ran an hour early **/** **occupied**, the nine just done. Three or four lines either side; the lead-in and lead-out are shared | L-A1 **/** *(baseline)* |

### `d-float` — at most **one** insert

| # | insert | licensed by |
| --- | --- | --- |
| F1 | *(two tagged variants)* the one thing Nan Prattle says as Crumb floats past her at brick fifteen: the green **/** the ending she is still owed. Three lines either side | L-A2 **/** L-B2, L-B3 |

`c-cut` and `d-float` are shared skeletons too — each plays on both choice-1
histories — so each gets a budget row of its own. One two-sided variant each,
placed where the timetable forces it. Nothing else in either segment may differ
between the two choice-1 histories.

### `ending` — at most **six** inserts

| # | insert | licensed by |
| --- | --- | --- |
| E1 | *(two tagged variants)* Grumble is already up on the jetty and has been complaining at Barnaby for an hour **/** Grumble meets Crumb at the grating, says one flat thing, and goes in | L-A1 **/** *(baseline)* |
| E2 | Barnaby, first look: "You're green. You went through the Pipe." | L-A2 |
| E3 | Crumb tells Barnaby where the Pipe comes out — the answer to a question Barnaby has had for ninety years and cannot go and check. **A multi-line beat**: it costs a minute of Crumb's fifteen and the scene says so | L-A3 |
| E4 | Crumb shouts the end of the story down to Nan at brick seventeen, and gives the kelp cord back | L-B2, L-B3 |
| E5 | Barnaby sees the raw sawn end before Crumb can hide it; Crumb owns up on his own; Barnaby shows him how to finish an end so it will not fray, and says a cut rope can be spliced this afternoon; then the finished end goes up the post and through the eye. **A multi-line beat** — the whole rope-preparation slot on `cut` paths, contiguous | L-C1, L-C2, L-C3 |
| E6 | The soaked line will not thread the bell's eye and has to be wrung out against the last minutes; the too-long tail then hangs to the low step, where a smaller creature could reach it; and when Crumb pops out of his shell he laughs instead of yelping, because he has been out of his depth already today. **A multi-line beat in three placements** — the wringing must precede the eye, the tail can only be seen after the knot, the laugh belongs to the shell coming off | L-D1, L-D2, L-D3 |

Every ledger entry in §2 and §3 appears at least once in a budget row. That is
the check that no choice was cosmetic (audit C2).

---

## 7 · Chekhov promises

Opened in `intro`, shared by all four paths:

| id | promise | opened | paid |
| --- | --- | --- | --- |
| **P1** | Crumb's shell is one size too small and his back end sticks out; the big spiral shell sits at the end of the row on the Shell Shelf, and he has been told he is not big enough for it yet | `intro` sc.1 | `ending` — he comes clean out of his shell on the long pull, and Barnaby sends him home to the spiral one |
| **P2** | Barnaby teaches Crumb the Bosun's Loop, "you'll want it one day" | `intro` sc.2 | `ending` — it is how the new rope goes on the bell |
| **P3** | High tide at noon, step three, and the *Sandhopper* waiting outside the bar for the bell | `intro` sc.2–3 | `ending` — the bell rings and she crosses |
| **P4** | Nobody knows where the Pipe comes out, and Barnaby has watched that grating for ninety years wondering | `intro` sc.3 | **`pipe` paths only**, at `ending` (E3) |

Path-scoped promises, opened by a ledger entry:

| id | promise | opened by | paid |
| --- | --- | --- | --- |
| **P5** | Crumb will bring Nan's kelp cord back | L-B2 | `ending` (E4) |
| **P6** | Crumb will tell Nan how the story ended | L-B3 | `ending` (E4) |
| **P7** | Somebody is going to find that cut end | L-C3 | `ending` (E5) |

**Closing rule for auditors (G1).** Exactly one promise may still be open in a
final state doc, and only on the paths named here: **P4, open on `wall-cut` and
`wall-float`.** That is deliberate — the child who took the wall never finds out
where the Pipe goes, and that is the reason to watch it again. Any other open
promise at the end is a finding.

---

## 8 · Where the callbacks land

Audit D1 wants ≥1 explicit callback per choice; D2 wants at least one of them
*after* a merge, in shared-skeleton territory. Both choices clear this on every
path.

| choice | callbacks, post-merge | segment |
| --- | --- | --- |
| Choice 1 | M2 (the door — he knew, or he worked it out) | `mid` |
| Choice 1 | E1 (Grumble on the jetty), E2 (green), E3 (where the Pipe goes), E4 (Nan's story and her cord) | `ending` |
| Choice 2 | E5 (the cut end and owning up) **or** E6 (wringing out, the low pull, laughing) | `ending` |

The strongest one is the quietest: **Nan reaches brick seventeen at noon on all
four paths.** On the `wall` paths Crumb owes her the ending and shouts it down to
her; on the `pipe` paths she arrives exactly the same, at exactly the same brick,
at exactly the same moment, and he just waves. Same world event, different
meaning — that is the replay payoff the default-consistency rule promises, and
it costs one narration line.

There is a second one for rewatchers: on the `wall` paths **Nan says Grumble's
timetable out loud** ("he'll be up on his rock in a quarter of an hour, like
always"). A child who then watches a `pipe` path sees Grumble out an hour early
and knows exactly whose fault it is. `b-wall`'s writer must include that line —
it is the plant for the other branch.

---

## 9 · Segment contracts

Everything a segment writer is *contracted* on. How it unfolds is theirs.

| id | starts | ends | on stage | must be true by the end |
| --- | --- | --- | --- | --- |
| `intro` | 8:00, Shell Shelf b14, step 11 | 8:40, top of the jetty steps b17, step 10 | Crumb, Barnaby (Grumble asleep in the grating, on screen, from sc.3) | P1, P2, P3, P4 opened; Crumb knows the spare line is on a peg in the Boat Shed and that nobody has ever cut it; the two roads and the eighty-minute saying are stated; Grumble is visibly asleep in the grating at the moment of the choice |
| `a-pipe` | 8:40, grating b17, step 10 | 10:00, Boat Shed door b1, step 7 | Crumb; Grumble in sc.1 only (Barnaby is unavoidably in frame at b17 in sc.1, silent — he is bolted there, P-3) | Grumble woken on screen; the dark and the green; Crumb finds out where the Pipe comes out and knows nobody else does |
| `b-wall` | 8:40, jetty gate b17, step 10 | 10:00, Boat Shed door b1, step 7 | Crumb; Nan from ~9:30 | passes Grumble's empty rock (b15, ~8:50) and his own Shell Shelf (b14, ~8:55); meets Nan at **brick seven at half past nine**, walking backwards beside her; Nan gives the door tip, the kelp cord and the promise; **Nan says Grumble's timetable aloud** |
| `mid` | 10:00, Boat Shed b1, step 7 | 10:25, Boat Shed b1, step 7 (step 6 at 10:30) | Crumb alone (Narrator carries it; Crumb thinks out loud and apologises to the rope) | the door is open by lifting; the spare line is found on its peg; it is established as four times too long and far too heavy for him; **the old oyster shell is planted in sc.1 and still on screen in sc.3**; the water is visibly climbing the slip |
| `c-cut` | 10:25, Boat Shed b1, step 7 | 11:45, top of jetty steps b17, step 4 | Crumb alone for the whole of the cut; then the wall's own traffic passes him and does not stop — Nan overtaken at b14 at 11:20, Grumble on his rock at b15 at 11:25 on `wall` paths | twenty minutes of sawing **and tidying**, sixty of dragging; the raw end; nobody sees him do it |
| `d-float` | 10:25, Boat Shed b1, step 7 | 11:45, top of jetty steps b17, step 4 | Crumb alone; Nan passed at b15 at 11:40, from the water, and she does not stop | twenty-five minutes waiting for the water to reach the doorstep at ten to eleven, fifty-five riding; he goes out of his depth and it is wonderful, not frightening (bible P-10, T-4) |
| `ending` | 11:45, jetty b17, step 4 | 12:00+, jetty b17, step 3 | Crumb, Barnaby, Grumble, Nan (arrives b17 at noon), the *Sandhopper* | the rope goes on with the Bosun's Loop (P2); the kittiwakes sing twelve; three pulls and a long one; Crumb comes clean out of his shell (P1); the *Sandhopper* crosses the bar (P3); Barnaby sends him home to the spiral shell; the path's inserts from §6 |

---

## 10 · Things the tree deliberately forbids

So a writer cannot reach for them:

- Nobody carries Crumb, and nobody fetches the rope for him (bible T-5, P-3).
- No second rope is found anywhere (P-6). No rope is made out of kelp, hair,
  seaweed or anything else.
- Nan is never late, early, stationary or reversed (P-4). Grumble never does a
  tenth complaint or skips one (P-5).
- The tide never pauses, hurries or turns (P-2), and no road is ever faster or
  slower than eighty minutes (P-1).
- No path arrives at the jetty before a quarter to twelve or after it.
- Grumble does not become nice, and does not have a change of heart. On the
  `pipe` paths he is simply, silently there when the bell rings.
