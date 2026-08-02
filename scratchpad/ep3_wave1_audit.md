# Ep 3 wave-1 audit — script layer vs `revision.md` (+ 3 addenda)

**Auditor pass, 2026-08-02.** Spec: `src/videos/sky-blue/revision.md` read end to
end including all three addenda; the AUTHORITATIVE CAST from the showrunner brief
(supersedes §8 placeholders and addendum 2's partial list) is the casting truth.
Predecessor's claim ("GATE_EXIT=0, full every-frame render passed") is treated as
unverified — nothing below rests on it.

Files audited: `src/videos/sky-blue/{script.md, narration.mjs,
narrationManifest.ts, Video.tsx}`, `scripts/generate-narration.mjs`,
`src/videos/wind/narration.mjs`, plus supporting cross-checks in
`src/videos/sky-blue/scenes/*.tsx`, `src/videos/registry.ts`,
`public/narration/sky-blue/`.

**Counts: CONFIRMED 41 · MISSING 1 · WRONG 9 (1 high-severity) · WAVE-2 expected-absent 6 · accepted deviations 3.**

---

## 1. CONFIRMED

### (a) ADDENDUM 1 — the sunset race — CONFIRMED, every named element

The race is encoded across **three** scenes in `Video.tsx` (`s28_blue_runs_out`,
`s28b_race_island`, `s28c_red_arrives`) and three matching screenplay sections in
`script.md` (lines 1441, 1540, 1591). Element by element:

| Spec element | Where it landed | Evidence |
|---|---|---|
| All seven start together | `a3_12b_narrator` (NEW) | narration.mjs:1131 `"All seven set off down it together. Watch who lasts."` speed 0.92 |
| Violet + Blue bounced out early, **UPWARD** | `a3_13b_blue`, Violet silent | narration.mjs:1149 `"Sorry! Sorry! I am going UP now! Bye!"`; script.md:1453-1458 "**THE RULE THAT GOVERNS EVERY EXIT** … stage each exit as a bounce **UP into the blue above**, never as falling, fading, dropping behind or vanishing" |
| Indigo four beats late | `a3_13c_indigo` + 12f gap | narration.mjs:1156 `"Going up now. Bye."` (tail of Blue's line, no new sentence); Video.tsx:551 `a3_13b_blue: 12` "Indigo's gap … he is late, not early" |
| Violet exits in pointed silence | 20f held beat, no key | Video.tsx:556 `a3_13c_indigo: 20` — "VIOLET'S EXIT GOES HERE, in silence"; script.md:1493-1498 |
| One of Yellow/Green rests on the volcano (spec leaned Yellow) | **Yellow** | narration.mjs:1225 `a3_14h_yellow: "A warm rock! I will have a little sit down!"` |
| Narrator warn-off line | `a3_14i_narrator` | narration.mjs:1241 `"That is not a rest stop."` speed 0.9 — verbatim one of the addendum's three register options; addressed to Yellow, never names the volcano |
| **Volcano opens ONE eye**, ~45f, no dialogue | 45f trailing beat | Video.tsx:586 `a3_14i_narrator: 45` — "**THE VOLCANO OPENS ONE EYE.** It holds, and it closes it. Nothing enters: no line, no bubble, no rumble"; script.md:1570-1584 |
| No rumble | chosen | script.md:1583 "Do not add a rumble here; the rumble belongs to Scene 35" (addendum allowed "at most a sub-verbal rumble" — declining it is inside the latitude) |
| The other one distracted (Green / sailboat) | **Green** | narration.mjs:1214 `a3_14f_green: "This is a nice spot."` emotion `calm`; script.md:1543-1545 "a **becalmed sailboat** sits dead still on a flat sea — and Green … settles on it" |
| Red + Orange finish, Orange one body-length behind | `s28c_red_arrives` | script.md:1597-1599; narration.mjs:1281 `a3_18e_orange: "What Red said."` |
| Flows into "Peace and quiet." | `a3_18d_red` | narration.mjs:1275; Video.tsx:616 `a3_18d_red: 45` (the act's silence) |
| Scene-28 landing-on-an-eye pedagogy beat survives at the finish line | kept | script.md:1593-1594 "the eye it lands on — the delivered cut's pedagogy beat, kept, at the race's finish line" |
| Held beats per pacing rules | 36 / 30 / 45 / 20 | Video.tsx:607-619 |
| Runtime delta flagged | yes | script.md:2350-2365 flags 13:36.1 with a costed cut-list |

Physics-honesty extras the builder added and that hold up: `a3_14g_narrator`
("Green bounced off as well. He just took longer.") gives the **middle** of the
spectrum, and the drop-out order (Blue/Indigo/Violet → Green → Yellow → Red+Orange)
is spectrum order — script.md:2114-2116.

### (b) Scene 5 — "Are we there yet?" ×5 — CONFIRMED

- **One recording, four aliases.** `a1_13_ray` is the only synthesis;
  `a1_15_ray`, `a1_15c_ray`, `a1_15e_ray`, `a1_16b_ray` are `sameAs: "a1_13_ray"`
  (narration.mjs:443/449/458/468). Verified byte-identical on disk —
  `md5sum` of all five = `bc304b69d584facc6362d1db5b5b9c98`.
- **Escalating gaps 30/45/60/75** — `Video.tsx:158-169`
  (`a1_14_narrator: 30`, `a1_15b_narrator: 45`, `a1_15d_narrator: 60`,
  `a1_16_narrator: 75`). Same numbers in script.md:372/377/382/387.
- **Fifth firing unanswered, scene tail 6f, hard cut** — `Video.tsx:174`
  `tailFrames: 6`; script.md:394-397.
- **Four answers, arithmetic skips** — One/Seven (a1_14), Two/Six (a1_15b),
  **Four/Four** (a1_15d), Seven/One (a1_16), all at `speed: 0.92`.

### (c) Scene 16 rebuild — CONFIRMED

- `a2_10_sunny` = `"It was PAINT! Blue paint! I painted the whole sky!"` (narration.mjs:726)
- `a2_13_narrator` = `"So we went looking for the paint."` speed 0.95 (narration.mjs:742)
- **One-prop staging in script.md** — script.md:824-831: "Sunny slides in holding
  **one paint tray** … **No ladder. No dust sheet. No painting.** … he **tips the
  tray toward camera.** It is empty."
- **45f beat intact** — `Video.tsx:325` `a2_11_narrator: 45`; script.md:840.

### (d) Scene 23 — CONFIRMED (one WRONG attached, see W1)

All six line texts verbatim per spec:
- `a2_49_narrator` = `"He has a point."` **speed 0.85** (narration.mjs:995)
- `a2_50_sunny` = `"I DO have a point! I have LOADS of points!"` (narration.mjs:1002)
- `a2_51_narrator` = `"The light is his. Every single bit of it."` (narration.mjs:1012)
- `a2_52_ray` = `"But the AIR did the painting."` (narration.mjs:1024)
- `a2_54_narrator` = `"It is his light. It is not his painting."` (narration.mjs:1035)
- `a2_55_narrator` = `"He will only remember one of those."` **unchanged** (narration.mjs:1042)
- **NO verdict language anywhere in the episode** — programmatic grep over all 208
  line texts for `/is wrong|He is wrong|never been wrong|That is not me/i` returns `[]`.
- **Grin GROWS through the 36f beat** — script.md:1212-1215: "**Same length,
  opposite content.** The grin does not come apart — it **grows**, slowly, across
  the whole beat". Also correct in the wave-2 worklist, script.md:2317.

### (e) Scene 26 CUT — CONFIRMED

- `a3_06_narrator` **absent from narration.mjs** (a documented deletion block sits
  where it was, narration.mjs:1081-1090), absent from `narrationManifest.ts`
  (a3_05 → a3_07 at lines 140-141), absent from the cache
  (`.cache.json` has 208 entries, `a3_06_narrator` not among them), and the mp3
  is gone from `public/narration/sky-blue/`.
- **Absent from `Video.tsx`** — programmatic check: the 208 keys referenced by
  `SCRIPT` exactly equal the 208 keys in `narration.mjs`, both directions empty.
  `s26_volcano` spec replaced by a comment block, Video.tsx:504-510.
- **`s26_volcano` scene spec gone from script.md** — script.md:1365-1401 is now a
  CUT notice plus the rewritten volcano rule, not a scene spec.
- **Scene ids NOT renumbered** — `s25_sea_sunset` is followed by `s27_long_way`;
  script.md:1369 "The scene id is not reused and nothing is renumbered."

### (f) Tease rework (Scene 35) — CONFIRMED

- `rc_18_sunny` = `"OH! That one is me as well! HA! HA!"` (narration.mjs:1494)
- `rc_18b_narrator` = `"Hmm. We will find out."` **speed 0.9**, NEW (narration.mjs:1500)
- `rc_19_ray` = `"Bye! Look up. That's me."` unchanged (narration.mjs:1503)
- Beats: `rc_16:45`, `rc_17:60`, `rc_18_sunny:45`, `rc_18b_narrator:30`
  (Video.tsx:730-744), matching script.md:1944-1967.

### (g) Six-voice cast block — CONFIRMED, exact match to the AUTHORITATIVE CAST

Extracted programmatically from the resolved spread objects (not from comments):

| Character | On disk | Brief | ✓ |
|---|---|---|---|
| Blue | minimax `Decent_Boy`, speed 1.05, `happy` | Decent_Boy happy 1.05 | ✓ |
| Red | minimax `Patient_Man`, speed 0.9, `calm` | Patient_Man calm 0.9 | ✓ |
| Orange | minimax `Determined_Man`, speed 0.95, **pitch 2**, `calm` | Determined_Man calm 0.95 pitch+2 | ✓ |
| Yellow | minimax `Sweet_Girl_2`, speed 1.0, `happy` | Sweet_Girl_2 happy 1.0 | ✓ |
| Green | minimax `Friendly_Person`, speed 0.95, `calm` | Friendly_Person calm 0.95 | ✓ |
| Indigo | minimax `Decent_Boy` (via `BLUE_MINIMAX_VOICE`), speed 1.1, **pitch 3**, `happy` | Decent_Boy happy 1.1 pitch+3 | ✓ |
| Violet | **no constant, no key, no clip** | never speaks | ✓ |
| Ray | minimax `Young_Knight` 1.0 | Young_Knight | ✓ |
| Sunny | kokoro `am_puck` 1.0 | kokoro am_puck 1.0 | ✓ |
| Narrator | kokoro `af_heart` 1.0 | kokoro af_heart 1.0 | ✓ |

- **Indigo pitch is +3 UP**, per HANDOFF, not addendum 2's "down ~2" — and the file
  says so explicitly and cites the reason: narration.mjs:307-308 "(Addendum 2
  sketched him pitched *down*; Mike's final call is up and thinner, which reads as
  a faded copy rather than as an older brother.)"
- **Middle four get 1–2 lines each, and the line IS the personality:**
  - Orange **1**: `a3_18e_orange` `"What Red said."` (addendum's own example, verbatim)
  - Yellow **2**: `a3_13d_yellow` `"Great bounce, Violet!"` (addendum's own example, verbatim) and `a3_14h_yellow` `"A warm rock! I will have a little sit down!"`
  - Green **1**: `a3_14f_green` `"This is a nice spot."` (addendum's own example, verbatim, said while dropping out)
  - Indigo **2**: `a2_28c_indigo` `"And here. And here."` and `a3_13c_indigo` `"Going up now. Bye."` — both are the **tail** of the Blue line immediately before
  - Blue **4**, Red **5** (the double act)
- **VIOLET HAS ZERO LINES ANYWHERE** — `Object.keys(lines).filter(/violet/i).length === 0`.
  Enforced by an explicit "there is deliberately no `VIOLET` constant" block,
  narration.mjs:219-236.
- Voice tally cross-checks script.md's claim: 69 minimax + 134 kokoro + 5 aliases = 208. ✓

### (h) Generator `pitch` field — CONFIRMED

`scripts/generate-narration.mjs`:
- **Passed to MiniMax** — line 384 `if (spec.pitch) input.pitch = spec.pitch;`
  (omitted at 0, so existing request bodies are unchanged).
- **Normalized** — line 490 `pitch: entry.pitch ?? 0` on minimax lines.
- **Validated** — lines 555-564: must be a whole number of semitones between
  `MINIMAX_PITCH_MIN`/`MAX` (±12).
- **Rejected on kokoro** — lines 541-546: "has a `pitch` on a kokoro line — kokoro
  has no pitch control and would ignore it silently".
- **Participates in the cache key** — `clipHash`, lines 583-590: minimax material is
  `[MODEL, text, voiceId, emotion, speed, pitch]` when pitch is set and
  `[MODEL, text, voiceId, emotion, speed]` when it is not. A pitch change (3→4, or
  3→removed) changes the material and therefore the hash → re-synthesis. Pitch 0 and
  absent-pitch hash identically, which is correct (0 = no shift) and is why adding
  the field re-bought nothing.
- CLI `--pitch` is wired for auditions (lines 846-873), including a pitch suffix in
  the audition filename so shifts do not overwrite each other.

### (i) Cache-complete runs — CONFIRMED, both zero

```
$ npm run narration -- --video sky-blue
  …
  rc_19_ray        (cached) 2.41s

Done. 0 clip(s) synthesized, rest served from cache.
```
```
$ npm run narration -- --video wind
  …
  rc_17_puff       (cached) 4.00s

Done. 0 clip(s) synthesized, rest served from cache.
```
Nothing was forced; both are pure cache checks. This proves the on-disk TTS matches
the current text/voice/speed/emotion/pitch of every line in both episodes.

### (j) `src/videos/wind/narration.mjs` — CONFIRMED

- `rc_15_narrator.text` is **exactly** `"Sunny has a theory. It is a very Sunny theory."`
  (wind/narration.mjs:1201), `...NARRATOR`, `speed: 0.9`.
- **No other wind line was touched by the ep-3 rebuild.** `git show 2b05cf0 --
  src/videos/wind/narration.mjs` is a single text change plus its comment block
  (12 lines added, 1 changed); the commit's whole wind footprint is
  `narration.mjs` + `narrationManifest.ts` (one duration) + `script.md` (notes).
- `rc_16_sunny` (`"Wait. What?"`) is untouched, as the spec requires.
- *Context, not a finding:* a **later, unrelated** commit `932ec7d` ("Puff's AIR
  pronunciation") changed `rc_02_puff` and `rc_04_cloudia` in the same file. That is
  ep-2 pronunciation work, not the ep-3 rebuild, and is outside this audit.

### (k) Cross-checks — CONFIRMED

- **Manifest in sync.** 208 keys in `narration.mjs`, 208 in `narrationManifest.ts`,
  set difference empty in both directions.
- **Aliases resolve to byte-identical audio.** Each alias gets its own path (correct
  `sameAs` semantics — the generator copies the source's bytes under the alias's
  filename); md5 verified identical for all four `a1_13_ray` aliases and for
  `a3_31_sunny` ↔ `a1_03_sunny` (`a005c527…`). Durations match to the millisecond
  in the manifest (1.188 ×5; 1.9 ×2).
- **`Video.tsx` references nothing missing or removed.** The 208 keys in `SCRIPT`
  exactly equal `narration.mjs`'s keys — no orphans, no dangling references. Timeline
  builds: 36 scenes, **24 482 frames = 13:36.1**, computed independently by bundling
  `Video.tsx` and calling `timeline()`. That matches script.md's own stated number
  exactly (script.md:2350).
- **Registry derives duration from `timeline()`** (`src/videos/registry.ts:234`), so
  no hardcoded duration can drift.
- **Running-gag ledger holds:**
  - `rc_18` has **no** "You're welcome" — the literal phrase appears on exactly 5
    lines: `co_08`, `a1_58`, `a2_53`, `a3_22`, `rc_04`.
  - Violet silent: 0 keys, 0 clips, 0 runtime; five staged firings documented
    (script.md:2069-2080).
  - Credit-allocation gag fires 3× with 3 speakers (`a1_59`, `a2_54`, `rc_04b`).
  - Goodbye roll call keeps its shape: `a3_14b`+`a3_14c`+`a3_14d`, and Blue/Indigo
    speak **before** it, never between `a3_14b` and `a3_14c` (script.md:1523-1530).
  - Greeting roll call: **see MISSING M1** — this is the one place the ledger and
    addendum 2 disagree.

### (l) Typecheck — CONFIRMED clean

```
$ npx tsc --noEmit
(no output)
```
Exit clean, zero diagnostics.

---

## 2. MISSING

**M1. The roll call's SIX REPLIES (addendum 2) were not written — the builder
deliberately declined the instruction.**

Addendum 2 (revision.md:1940-1943): *"Natural line homes: the race exits (each
color departs with their signature; Violet exits in pointed silence) and **the roll
call (seven hellos from Ray, six replies — hang the lantern)**."*

The race-exit half is delivered in full. The roll-call half is not. `script.md`
Scene 10 (line 603-607) instead writes down the opposite as a rule:

> **Nobody replies out loud.** Six of the seven have voices now and not one of them
> uses it here: the roll call's shape is fixed across three episodes … and a reply
> from one of the strangers breaks it. The replies are all movement.

Repeated in the production-notes ledger (script.md:2060-2064: "no spoken replies
from anybody even though six of them now have voices") and in the wave-2 worklist
(script.md:2310: "Seven reactions in character; **Red does not react**; nobody
replies out loud").

This is a **reasoned override, written down, not an oversight** — the craft argument
(the three-episode roll-call signature is *name → flat narrator line → unbothered
button*, and a reply breaks it) is coherent, and the lantern-hanging Mike asked for
is arguably relocated to `a3_13d_yellow` ("Great bounce, Violet!" — the only line in
three episodes that addresses Violet). But it is a direct decline of an explicit
instruction in an addendum that supersedes the main body, and only Mike can rule on
it. **It is the single substantive spec item not on disk.**

Note also: `a1_42_ray` is one 7.128s clip; adding six replies is not free — it needs
six new MiniMax clips and re-times Scene 10, currently 544 frames. Costed decision.

---

## 3. WRONG

**W1 — HIGH SEVERITY. `Video.tsx:469` still carries the DELETED wrongness
ceremony as its staging instruction for Scene 23's 36f beat.**

```js
// 36f — "Three words, and then nothing at all. Sunny's grin does not move
// for the first half of this beat and comes apart in the second."
a2_49_narrator: 36,
```

The frame count is right. The *comment is the delivered cut's ceremony* — the exact
thing revision.md §4 and §6.10 remove. `script.md:1212-1215` says the opposite
("the grin does not come apart — it **grows**"). `Video.tsx`'s own header (lines
35-41) states that every `gaps` comment "quotes its reason" from the screenplay, so
a staging agent working the wave-2 list from the timeline file will read this and
build the removed ceremony. This is the only WRONG in the set that would ship a
broken beat. Fix: replace the comment with script.md:1212-1215's text.

**W2. `Video.tsx:322` — Scene 16's 45f gap comment is the pre-rewrite staging.**
```js
// 45f — "Sunny holding a dry roller, alone in frame, saying nothing…"
```
The rewrite's whole point is **one prop**: an empty paint tray tipped toward camera
(script.md:824-831, revision.md §6.5). "Holding a dry roller" is the five-prop
version's beat. Same class of stale-comment risk as W1, lower stakes.

**W3. `script.md:2000` — tone guardrail still cites the dry roller.**
"the Narrator's deadpans are always *about* obvious behaviour (Sunny bragging,
Sunny holding a dry roller)". Should be the empty tray.

**W4. `script.md:94` and `script.md:2079` — "five of his six siblings speak".**
Violet has six siblings and **all six** now speak (Red, Orange, Yellow, Green, Blue,
Indigo). The correct count appears elsewhere in the same file
(script.md:603 "Six of the seven have voices now"; script.md:2060). The wrong count
undercuts the exact argument the gag now rests on ("six speaking siblings mark his
silence"). `narration.mjs:227-228` states it correctly ("Now six of them speak").

**W5. `narration.mjs:1276-1280` — Orange's comment claims "16f in front of it".**
The actual gap preceding `a3_18e_orange` is the **45f held beat** on `a3_18d_red`
(Video.tsx:616). Orange gets no 16f approach gap in the timeline. The comment also
correctly says the line "lands AFTER the 45f silence rather than inside it", so it
contradicts itself. The *timeline* is right and matches script.md:1626-1633; only
the comment is wrong.

**W6. `narration.mjs:1144-1147` — Blue's comment claims "the same 4f entrance gap"
for `a3_13b_blue`.** The actual preceding gap is the **45f race-start beat**
(Video.tsx:547). `script.md:1482-1485` documents this as the one deliberate
exception ("the one place in the episode where he does not get his 4-frame
interruption gap"). Again: timeline right, comment wrong.

**W7. `narration.mjs:81-83` and `script.md:152-155` — "Ray's forty-seven lines …
one shared recording".** Ray has **50** keys: 46 synthesized (21 `auto` + 25
seasoned — those two numbers are correct) plus **4** `sameAs` aliases, not one.

**W8. `script.md:150` — "Sunny's twenty are free".** Sunny has **19** keys
(18 synthesized + `a3_31_sunny`, the `sameAs` of `a1_03_sunny`).

**W9. `script.md:2024` — "Held beats … forty-two of them".** `Video.tsx` carries
**48** `gaps` entries, of which **7** are approach gaps (Red 16f ×2, Blue 4f ×3,
Indigo 12f ×2) rather than held beats → **41** held beats.
`scenes/common.tsx:205` says "forty-one", which is the right number. Cosmetic, but
these counts are quoted downstream.

*Common thread for W2–W9: all nine are documentation/comment drift, not behaviour.
Every frame count, line text, voice, speed, pitch and emotion I checked is correct.
W1 is the only one that would actively mislead a builder into shipping a removed beat.*

---

## 4. WAVE-2 (expected absent — staging, correctly deferred)

`script.md:2282-2328` carries an explicit, honest "Staging worklist — what the
revision left unbuilt (wave 2)" that names all of these. No scene file was touched;
every scene is mounting its **old** component against its **new** lines, which is
safe (`lineWindow`/`heldBeat` return `[0,0]` for an absent key — verified in
`src/lib/kid/lines.ts:27-30`) but visibly wrong until restaged.

1. **The seven personality tables / SHARD_PHASE staging.** `SHARD_PHASE` in
   `scenes/common.tsx:118` is still the seven bare phase offsets — no per-colour
   signature move, no idle. Named as worklist item 2 and as "the heaviest single
   item".
2. **The frequency ladder (addendum 3).** Not drawn. Named as worklist item 3 and in
   the cast section (script.md:110-117). *Ray's own F2 body IS built* —
   `src/lib/kid/characters/Ray.tsx` was rewritten (1 072 lines) in the same commit —
   so addendum 3 is half-delivered, and the delivered half is outside my scope.
3. **`Speaker` does not know the colours.** `scenes/common.tsx:84` is still
   `"narrator" | "ray" | "sunny" | "drip" | "puff"`, and `speakerOf()`
   (common.tsx:173-179) maps every unrecognised tail to `narrator` — so **all 16
   colour lines currently stage as narrator turns**: no mouth moves, no bubble.
   Correctly named as worklist item 1. ⚠ Note the stale comment at
   `common.tsx:88-93` which still asserts the shards "are a **crowd, not a cast** …
   not one of them ever takes a turn" — that sentence is now false and should go
   with the fix.
4. **The race scenes are placeholders.** `s28b_race_island` and `s28c_red_arrives`
   have no components in `ACT3_SCENES` (act3.tsx:2470-2477) and fall back to
   `ScenePlaceholder`; `s28_blue_runs_out` still mounts the old drain component.
   Named as worklist items, sized **large / large / medium**.
5. **`s26_volcano`'s dead component.** `act3.tsx:2471` still maps
   `s26_volcano: VolcanoScene`, and that component references the removed key
   `a3_06_narrator` at `act3.tsx:613`. It is unreachable (no scene with that id is in
   the timeline) so it cannot throw, and `Video.tsx:507-510` says deleting it is the
   staging wave's job. Worklist item, sized "trivial". *This is the only dangling
   line-key reference anywhere in the scene files — checked programmatically across
   all six.*
6. **Scene 23's diagram must stop stopping** (worklist row `s23_sunny_wrong`),
   Scene 35's "Sunny beams instead of squinting", Scene 16's negative work, etc.
   All listed with sizes.

---

## 5. Accepted deviations (spec-vs-disk, defensible, logged not faulted)

**D1. Scene ids: `s28b_race_island` + `s28c_red_arrives`, not `s28b_red_arrives`.**
revision.md §5 named one new scene `s28b_red_arrives`; addendum 1 then turned Scene
28 into a multi-leg race and absorbed 28b into it. The builder split it three ways
(high air / sea / finish line), which is the addendum's own "different terrain legs"
structure. Crucially, **`s28_blue_runs_out` keeps its id** (Video.tsx:525-527,
script.md:1443) and nothing else is renumbered, which honours the binding rule.
Episode is now **36 scenes**, not 35.

**D2. Red at speed 0.9, not the treatment's 0.85.** revision.md §3 wrote 0.85 with
0.9 as the "written-down fallback"; the showrunner brief's authoritative cast says
**0.9**. On disk: 0.9. Correct per the brief; noting only because §3 still says 0.85.

**D3. `a3_18e_narrator` → `a3_18f_narrator`.** The spec's key for "Red has waited all
day for this." was `a3_18e_narrator`; `a3_18e` is now Orange's line and the narrator
moved to `a3_18f`. Both are new keys, nothing downstream reads them, and the
manifest/Video.tsx/script.md all agree. Harmless.

---

## 6. Resulting worklist candidates

**Do first — one-line fixes, no re-synthesis, no re-render:**
1. **W1 — rewrite `Video.tsx:469`'s comment** to script.md:1212-1215's "the grin
   *grows*". This is the only finding that would ship a broken beat.
2. W2/W3 — replace the two "dry roller" references with the empty-tray staging
   (`Video.tsx:322`, `script.md:2000`).
3. W4 — "five of his six siblings" → "six" (`script.md:94`, `script.md:2079`).
4. W5/W6 — correct the two approach-gap claims in `narration.mjs` (Orange's 16f,
   Blue's 4f) to match the timeline and script.md.
5. W7/W8/W9 — Ray 47→50 keys / 4 aliases; Sunny 20→19; held beats 42→41.
6. Delete the now-false "crowd, not a cast" comment in `scenes/common.tsx:88-93`
   when worklist item 1 lands.

**Needs Mike's ruling:**
7. **M1 — the roll call's six replies.** Addendum 2 asked for it; the builder wrote
   down a reasoned decline. Either (a) accept the decline and strike the roll call
   from addendum 2's "natural line homes", or (b) commission six replies (6 new
   MiniMax clips, Scene 10 re-times, and the three-episode roll-call shape changes).
8. **Runtime: 13:36.1** (independently verified: 24 482 frames @ 30fps). The
   revision's own estimate was ~13:01.7 and the stated budget is ~12–13 min. This is
   **+35s over the revision's own projection** and 36s over budget. script.md:2358-2365
   already carries a costed cut-list in order of cheapness (`a3_18e_orange` ~3s;
   Scene 5's fifth firing + its 75f ~4s; `rc_03b_blue` ~4s; `a3_18b_narrator` + 36f
   ~4.8s; Scene 28b's Green pair ~6s) with "do not cut `a2_24b_red`, do not cut
   Scene 12" attached. Decide before the staging wave prices anything.

**Ear-checks the script layer flags and that no gate has covered:**
9. `a2_49_narrator` ("He has a point.") at 0.85 — the whole arc change rests on it
   landing flat, not apologetic. narration.mjs:992-994 says check this one *first*.
10. `a2_25b_blue` came back at **5.54s for five words** (1.11 s/word vs Ray's ~0.38
    and Blue's own 0.31 on `a3_13b`) — narration.mjs:828-835 diagnoses MiniMax
    inserting a long pause after every exclamation mark, which is the opposite of the
    character at speed 1.05. A pre-written fallback exists
    (`"Hi! Sorry! I did not mean to hit you!"`). **This is a paid clip that is
    probably wrong and nobody has heard it.**
11. `a2_24b_red` ("Lovely air.", 1.296s) and `a3_18d_red` ("Peace and quiet.",
    2.088s) — the shortest/slowest clips; `a3_18d` is the tone-guardrail call
    (contented, not tired).
12. Indigo at pitch +3, speed 1.1 — first use of the new `pitch` field in the suite;
    must read as a faded copy of Blue, not a seventh person.

**Wave-2 staging** — take `script.md:2282-2328` as written; it is accurate and
sized. Start with the three kit-level items (Speaker/colours, personality tables,
frequency ladder), because every scene row depends on them.
