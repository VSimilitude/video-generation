# State-doc schema — *Crumb and the Bell That Lost Its Rope*

One state doc per segment, describing the world **at the end of that segment**.
A branch writer receives their parent's doc, writes three scenes, and emits an
updated one. An auditor's main move is to put two sibling docs side by side and
diff them: every difference must name a ledger entry.

Format is a YAML-ish block in a fenced ` ```yaml ` fence at the bottom of the
segment file. Fill every field. **Write `none` rather than leaving a field
blank** — an empty field is indistinguishable from a forgotten one.

---

## Field reference

| block | field | rule |
| --- | --- | --- |
| — | `node` | segment id: `intro`, `a-pipe`, `b-wall`, `mid`, `c-cut`, `d-float`, `ending` |
| — | `scenes` | the three scene ids this doc is the output of |
| — | `path` | choice keys taken so far, in order: `[]`, `[pipe]`, `[pipe, cut]`, … |
| `clock` | `time` | 24-hour-free digits, e.g. `10:00`. Machine-comparable field. |
| | `spoken` | how a character would say it: `"ten o'clock"`. Narration uses this form (no digits — bible T-1). |
| `derived` | `tide_step`, `nan_brick`, `grumble_default` | **Computed, never chosen.** Formulas below. If a scene disagrees with these, the scene is wrong, not the formula. |
| `weather` | — | Fixed by the bible. Identical in every doc at the same time. Copy it forward. |
| `stage` | `location` | Named place + brick number. |
| | `on_stage` | Everyone in frame, including anyone asleep — mark them `(asleep)`. |
| `everyone` | one row per named character + the *Sandhopper* | `at:` place + brick, `doing:` a short phrase, `schedule:` `on-time` or `early by 1h (L-A1)`. **Off-stage characters are listed too** — that is what makes world inconsistency diffable. |
| `protagonist` | `shell` | Its state. P1 lives here. |
| | `carrying` | Everything in Crumb's shell-pocket or claws. Nothing appears here that a scene did not put here (audit B2). |
| | `condition` | Visible state of his body: green, wet, dry, nicked claw. |
| | `knows` | Facts Crumb has learned, one per line, each traceable to a scene or a ledger entry. |
| | `feeling` | One short phrase. Not a fact; still worth diffing. |
| `promises` | `open` / `paid` | Each is `id · promise · opened_at`. Path-scoped promises (P5–P7) appear only on the paths whose ledger opened them. |
| `ledger` | — | Append-only. Every entry ever added on this path, in order, with its id and full text from `tree.md`. Never edited, never reworded, never removed. |
| `next` | — | What happens after this doc: `choice 1`, `merge → mid`, `choice 2`, `merge → ending`, or `end of story`. |

### The three computed formulas

```
tide_step       = 11 − floor( (minutes since 8:00) ÷ 30 )     # 11 at 8:00, 3 at noon
nan_brick       = 1  + floor( (minutes since 8:00) ÷ 15 )     # b1 at 8:00, b17 at noon
grumble_default = look up clock.time in tree.md §4
```

`grumble_default` is written into every doc **even on `pipe` paths**, where his
actual position will differ. Then `everyone.Grumble.at` either equals
`derived.grumble_default` or names L-A1 as the reason it does not. Any third
possibility is a finding.

### How an auditor diffs two docs

1. `clock`, `derived`, `weather`, `stage.location` — must be **identical**
   between siblings at a merge. No exceptions, no licensing.
2. `everyone` — walk it row by row. A row that differs must name a ledger id in
   its `schedule` field or be the protagonist.
3. `protagonist.carrying` / `condition` / `knows` — every difference must map to
   a ledger entry listed in the doc's own `ledger` block.
4. `promises.open` — differences are allowed only for P4–P7 as scheduled in
   `tree.md` §7.
5. `ledger` — the child's ledger must be the parent's ledger plus exactly the
   entries of the option taken. Not one more, not one fewer, not reworded.

---

## ROOT — the state at the end of `intro`, before choice 1

This is the doc every choice-1 branch writer starts from. The `ledger` block is
empty by definition: ledger entries only exist after a choice has been made.

```yaml
node: intro
scenes: [intro.1, intro.2, intro.3]
path: []

clock:
  time: "8:40"
  spoken: "twenty to nine"

derived:                       # computed; do not hand-set
  tide_step: 10                # 11 − floor(40 ÷ 30)
  nan_brick: 3                 # 1 + floor(40 ÷ 15)
  grumble_default: "asleep just inside the grating (brick 17); wakes at twenty to ten"
  last_kittiwake_hour: "eight"

weather: "flat calm; high thin cloud, not burned off yet"

stage:
  location: "the top of the jetty steps, brick 17"
  on_stage: [Crumb, Old Barnaby, "Grumble (asleep, in the grating)"]

everyone:
  Crumb:
    at: "top of the jetty steps, brick 17"
    doing: "holding the two perished ends of the old bell rope, deciding which road to take"
    schedule: n/a
  Old Barnaby:
    at: "the last jetty post, brick 17, at about the height of step 5"
    doing: "watching, as he has for ninety years; cannot move"
    schedule: n/a
  Nan Prattle:
    at: "sea wall, brick 3"
    doing: "creeping east, talking; on her way to meet the Sandhopper at noon"
    schedule: on-time
  Grumble:
    at: "just inside the grating, brick 17"
    doing: "asleep"
    schedule: on-time
  Sandhopper:
    at: "outside the bar"
    doing: "waiting for the bell, with the Prattle boys aboard"
    schedule: on-time

protagonist:
  shell: "one size too small; his back end sticks out and he has to squeeze"
  carrying: none
  condition: "dry, clean, out of breath from running the wall"
  knows:
    - "he is to ring the Tide Bell at noon, three pulls and a long one"
    - "the Bosun's Loop, taught to him this morning by Barnaby"
    - "high tide is noon, at step three, and the Sandhopper cannot cross the bar before it"
    - "the old bell rope is perished and has come apart in his claws"
    - "the spare mooring line is on a peg in the Boat Shed at brick one, and it is the only rope in Salt Pocket Cove, and nobody has ever cut it"
    - "the cove is eighty minutes wide either road: dark and short, bright and long, both the same"
    - "Grumble is asleep in the grating"
  feeling: "very small, and in a hurry"

promises:
  open:
    - "P1 · Crumb's shell is a size too small, and the big spiral shell is waiting at the end of the row on the Shell Shelf · intro.1"
    - "P2 · the Bosun's Loop — you'll want it one day · intro.2"
    - "P3 · high tide at noon, step three, and the Sandhopper waiting outside the bar · intro.2"
    - "P4 · nobody knows where the Pipe comes out, and Barnaby has watched that grating for ninety years wondering · intro.3"
  paid: none

ledger: []                     # empty at the root, by definition

next: "choice 1 — through the Pipe, or along the sea wall"
```

---

## Worked fragment — what a post-choice `ledger` block looks like

Copied verbatim from `tree.md`; ids and wording are not the writer's to change.

```yaml
path: [pipe]
ledger:
  - id: L-A1
    at: "choice 1"
    entry: "chose pipe → Grumble is woken at twenty to nine, an hour early; his whole day runs an hour early, so his ninth complaint is done by half past ten and he is finished by a quarter to eleven with nothing left to do"
  - id: L-A2
    at: "choice 1"
    entry: "chose pipe → Crumb is green with pipe-slime from his back to his claw tips, and it will not come off today"
  - id: L-A3
    at: "choice 1"
    entry: "chose pipe → Crumb knows where the Pipe comes out, and is the only creature alive who does"
```

and the `everyone.Grumble` row that must accompany it, at ten o'clock:

```yaml
  Grumble:
    at: "Grumble's Rock, brick 15"
    doing: "complaint seven of nine"
    schedule: "early by 1h (L-A1)"      # derived.grumble_default says 'complaint two of nine'
```
