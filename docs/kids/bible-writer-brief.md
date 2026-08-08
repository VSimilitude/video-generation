# Story-writer brief — SERIES BIBLE first write-up (showrunner, 2026-08-07)

You are drafting `docs/kids/BIBLE.md`, the kids'-series canon reference.
Approved by Mike 2026-08-02; scope as he set it. Write the draft directly to
`/home/mike/projects/video_generation/docs/kids/BIBLE.md`; the showrunner
reviews and edits it in place. Text only — no code, no scene work, no ep-4
story invention.

## What the bible is

A reference document an agent can boot from: the per-character canon and the
series ledger, dense, CURRENT-STATE ONLY. It is not a journal, not a retro,
not a history of how decisions were made — where a fact needs provenance,
one parenthetical pointer (file:line or "Mike, date") is the maximum. Target
of roughly 250–400 lines. It will be updated by the showrunner at every
episode retro, so structure it so an update is an edit, not a rewrite
(tables and per-character blocks, no prose essays).

## Structure (use this)

1. **Header** — what this file is, who updates it (showrunner, at every
   episode retro, alongside LEARNINGS/STYLE), and the boot rule: read this
   before any story work on the series.
2. **The episodes so far** — one line each: slug, title, runtime, one-clause
   premise. Eps: water-cycle (ep 1, Drip), wind (ep 2, Puff), sky-blue
   (ep 3, Ray). Plus drip-fork (CYOA demo, non-canon).
3. **Per-character canon** — one block per character (see below).
4. **Series ledger** — running gags and their current state (rep counts,
   ceilings, who may fire them), open teases, banked material.
5. **World rules** — the standing laws that bind every episode.
6. **Forward arc** — do NOT duplicate: one line pointing at
   `docs/roles/audience.md` "Series arc canon" (ep 4 = plants/photosynthesis,
   ep 5 = volcano wakes, and the guardrails live THERE).

## Per-character canon — required fields per block

- **Casting, locked**: engine, voiceId, emotion default, speed, pitch shift
  if any. Copy from the cast blocks in each episode's `narration.mjs` /
  `script.md` cast table — these are FINAL, Mike-approved, and byte-exact
  spellings matter.
- **Personality + wants** (the comedy engine — one or two lines).
- **Speech patterns**: sentence shape, healthy s/word band where recorded
  (Blue 0.31–0.36), signature constructions.
- **Catch-phrases with rep counts**: current series-wide firing totals and
  any ceiling.
- **Motion/staging laws** where they are identity (Red 16f approach gaps,
  one speed, dead straight; Blue 4f, never travels half a frame without a
  direction change, apologises to things he hits; Indigo = Blue pitched +3,
  four frames/beats late, repeats the tails of Blue's lines, drawn behind
  and 26px under; Violet 7.2-cycle fizz, amplitude blur).
- **Arc history eps 1–3**: one or two lines per episode the character
  appears in — what happened TO them, what the audience now knows.

Characters to cover: Narrator (kokoro af_heart), Drip, Puff, Cloudia, Sunny,
Ray, the seven colours (Red, Orange, Yellow, Green, Blue, Indigo, Violet —
each its own block, however short), Rock (ep 2; cast again in ep 5 per the
arc canon), and a "cameos + minor bodies" table (Blobby, the beetle/leaf
recasts, the blue copies, etc.).

## Canon items that MUST land correctly (decision record, all final)

- **Blue = breakout character** (Mike, 2026-08-04: laughed out loud,
  "hilarious", cameos wanted "for sure"). Approved-for-development running
  arc: **the anti-Sunny** — confidently wrong about being "first" (or a
  similar superlative) episode after episode until one day he is finally
  right; mirrors Sunny's inverted claim machinery (Sunny claims credit for
  everything and is annoyingly at-least-half right; his one true wrongness
  is reserved for ep 5). Multi-episode plant — the ledger must say DO NOT
  fire the payoff early. Seed slots: ep-4 cameo, ep 5.
- **Name canon for the blue copies** (Mike's pick, tweak T4): **Bluington,
  Bluesworth, Bluey**, and the fourth greeting is "Hi... me!". Exact
  spellings.
- **Sunny's catch-phrase** "You're welcome! HA! HA!" — ceiling raised 7→8 in
  ep 3 by Mike's direction (a3_31b, the ep1/ep2 "I invented mornings!"
  mirror). The greeting+brag pairing is three-for-three across the series —
  a series constant now, not an option.
- **Violet NEVER speaks.** Not one line, not ever. Yellow is the only
  character who addresses him ("Great bounce, Violet!"). His want (to be
  noticed) is staged, never voiced. Firing count is in ep 3's script.md
  running-gag ledger (5→7 in the wave-3 fold).
- **Orange**'s vocabulary may be essentially "What Red said." forever —
  devotion to Red is the character.
- **Volcano ledger** (get this exactly right): sleep escalation is ep 2
  unmentioned → **ep 3 one-eye beat (s28b2, 45f, nothing enters, no
  dialogue) + s25 rest-attempt/warn-off** → ep 4 small stir → ep 5 wakes.
  **The ep-3 end-of-episode wake tease was CUT in the tweak round (T10)**:
  rc_17/rc_18/rc_18b are gone, the volcano is fully asleep at ep 3's close.
  Consequence: Sunny's reflexive wake-claim and the banked "That is not
  me." inversion are UNFIRED — available to ep-4's tease or ep-5's cold
  open. The wrongness ceremony ("I did that." / "No. He really didn't.") is
  banked for ep 5. Volcano voice reserved: Elegant_Man at pitch −6
  (audience.md). The volcano rule: scenery, never named in a line, no
  blink-out once established in a world.
- **Roll-call gag = series signature**: one fresh variant per episode, fired
  twice (greeting + goodbye), shape = cheerful naming → one flat narrator
  line → unbothered button. Ep-3's variants: Ray's "Hi Red. Hi Orange…"
  and the T4 Bluington/Bluesworth/Bluey/me call.
- **Ep-2 banked material**: the "long fuse" (a2_45/a2_45b) is untouched —
  check `src/videos/wind/script.md` for what it is and record it as banked.
- **`skeptical`** is a new shared rig emotion born in ep 3 (one-brow
  deadpan; register: unimpressed, never grumpy/smug) — note under whichever
  character(s) use it and in world rules as available vocabulary.
- **Ray**: hero of ep 3 only so far; body = F2 (Mike: "a little alien-y,
  we'll see how the kids respond" — watch item, not rework); a pedant;
  shards = ascending frequency ladder. No arms at rest, by design.
- **Sunny**: kokoro am_puck ("mechanical is funnier" — a returning
  character does not get a new engine); the series' laugh engine; no
  verdict on his claims until ep 5.

## Sources (read these; do not re-derive from renders)

Scripts (the canon of record for lines, counts, cast tables — each has a
production-notes/ledger section near the bottom; ep 3's was re-counted at
the wave-3 fold and is authoritative):
- `/home/mike/projects/video_generation/src/videos/water-cycle/script.md`
- `/home/mike/projects/video_generation/src/videos/wind/script.md`
- `/home/mike/projects/video_generation/src/videos/sky-blue/script.md`
  (3,400 lines — the cast table, THE VOLCANO RULE, "Running gags", and
  held-beats/production-notes sections matter most; trust its tables over
  your own recounts)
- `narration.mjs` in each of the three video dirs (exact casting fields).

Decision record (state + rulings):
- `/home/mike/projects/video_generation/src/videos/sky-blue/tweak1-retro-notes.md`
  (the explicit bible seed — Blue arc, name canon, T10 tease cut, ceilings)
- `/home/mike/projects/video_generation/src/videos/sky-blue/wave2-distillation.md`
  ("Retro inputs → series bible" section: per-colour laws, volcano ledger)
- `/home/mike/projects/video_generation/docs/roles/audience.md` (forward
  arc — POINT at it, don't copy it)
- `/home/mike/projects/video_generation/docs/STYLE.md` kids' sections (world
  rules live there — the bible cites, it does not restate style rules)
- `/home/mike/projects/video_generation/docs/LEARNINGS.md` 2026-08-07 entry
  (the ep-3 retro, for arc-history accuracy).

Where tweak1-retro-notes.md and older files disagree (e.g. catch-phrase
ceiling 7 vs 8, tease cut vs present), **the tweak-round state wins** — ep 3
final cut is commit 33fcafb, 31,419 frames = 17:27.3, deployed 2026-08-05.

## World rules section — what belongs there

The laws that bind story work (cite STYLE/audience.md rather than
restating mechanics): physics honesty (nothing taken away, no "smaller",
honest violet answer, Moon as control); characters carry the mechanism;
distinct-voice rule (a body with a face and a line gets its own voice);
sameAs discipline for repetition gags; catch-phrase ceilings; the volcano
rule; Violet's silence; one roll-call variant per episode; measured comedy
standard (laugh ≤25–30s, max gap ≤50s, ensemble = wants + replies);
runtime rule (10–30 min, hit beats, never target a duration).

## Format rules

- Markdown, dense tables where the data is tabular (casting, rep counts).
- Absolute fidelity on: voice IDs, speeds, pitches, rep counts, key names,
  name spellings. If a count cannot be verified in a script ledger, mark it
  `(unverified)` rather than guessing.
- No forward-looking story invention. Recording an approved arc's mechanics
  is in scope; pitching new beats for it is not.
- Open ear items (a2_32b_blue, rc_14_ray, a3_22b_red — pending Mike's ear,
  shipped in-cut) get one line in the ledger as "open", nothing more.
