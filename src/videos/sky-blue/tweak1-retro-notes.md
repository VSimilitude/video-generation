# Ep-3 tweak-round retro inputs (showrunner, 2026-08-04)

Inputs preserved for the ep-3 retro (LEARNINGS/STYLE) and the BIBLE
first write-up — both owed at this campaign boundary. Nothing here is
tweak work.

## Family verdict on the wave-3 comedy rewrite: SUCCESS

**Mike, verbatim (2026-08-04, sent with tweak notes, explicitly "doesn't
factor into the re shoot, but want to preserve for later"):**

> "this rewrite really works. It's genuinely funny now. I laughed out
> loud at blue, he's hilarious and we're going to need him to do some
> cameos in the future for sure (maybe he's the anti sunny, always
> wrong about being "first" or whatever until he's finally right)."

Distilled:

1. **Wave-3 rewrite verdict = SUCCESS.** "Genuinely funny now" — the
   2026-08-02 screening failure ("still quite dry") is resolved. For
   LEARNINGS: the fix that worked was the full script-level rewrite
   (colors driving the humor, room to interact) — not the light
   punch-up wave 3 replaced. Confirms the standing lesson: when the
   verdict is "dry", rewrite the material, don't re-stage it.
2. **Blue = breakout character.** Laughed out loud, "hilarious",
   future cameos WANTED (Mike's "for sure"). BIBLE per-character
   canon: Blue's built identity — ricochets, never travels half a
   frame without changing direction, healthy take band 0.31–0.36
   s/word (Decent_Boy happy 1.05), Indigo as his delayed echo — is now
   validated audience-side and must carry into cameos unchanged.
3. **Candidate running gag, APPROVED FOR DEVELOPMENT (Mike's "maybe" =
   concept green, exact shape = showrunner latitude): Blue as the
   anti-Sunny.** Always confidently wrong about being "first" (or a
   similar superlative) episode after episode — until, one day, he is
   finally right. Series-ledger mechanics to design at BIBLE
   write-up: the long-arc payoff mirrors Sunny's inverted claim
   machinery (Sunny = claims credit for everything, is eventually
   right about one thing per the ep-5 bank; Blue = claims priority,
   wrong until the one day he isn't). Seed opportunities: ep-4 cameo
   (plants; light still travels — Blue "first to the leaf"?), ep-5
   (volcano). Do NOT fire the payoff early; it is a multi-episode
   plant like the volcano eye.

## Cross-references for the BIBLE write-up

- Ep-5 tease ledger change from this round: T10 cut the ep-3 end-of-
  episode wake tease (rc_17/rc_18/rc_18b); Sunny's wake-claim and the
  banked "That is not me." inversion (script.md:3011-3015) are unfired
  — available to ep-4's tease or ep-5's cold open. Remaining ep-3
  volcano seeds: s25 rest-attempt + warn-off, s28b2 eye-open beat.
- Catch-phrase ledger: "You're welcome! HA! HA!" ceiling raised 7→8 in
  ep-3 by Mike's note 8 (a3_31b_sunny, the ep1/ep2 "I invented
  mornings!" mirror). The greeting+brag pairing is now three-for-three
  across the series — treat as a series constant, not an option.
- New rig vocabulary from this round (if T2a lands): `skeptical` — the
  series' first one-brow/flat-mouth deadpan face; note in STYLE with
  its intended register (unimpressed, never grumpy/smug).
- NEW NAME CANON (T4 landed, Mike's pick Option B): the blue copies —
  **Bluington, Bluesworth, Bluey** (and the fourth greeting is
  "Hi... me!"). Record spellings in the BIBLE name table; these are
  prime cameo fodder for the Blue-anti-Sunny arc above.

## STYLE/LEARNINGS candidates from the tweak-round builds

- **No all-caps emphasis words on MiniMax lines, ever** — caps read
  letter-wise ("AIR" → "the A"); caps live in bubble text (print)
  only. Two shipped defects (a2_52, rc_14) had identical signature.
  The builder's sweep list of remaining all-caps MiniMax lines is in
  tweak1-worklist.md RUN 1 DONE — none flagged by ear in two
  screenings; treat as watch-list, not rework.
- **Phrase/voice fit is a real failure mode distinct from bad draws**
  (a3_22b "Nice drama." broke identically across draws; rewording to
  "Very dramatic." fixed it — rewrite the line when a re-roll repeats
  the same artifact).
- **Paint the value, not the hue**: on a blue-sky plate, blue paint is
  invisible — a payoff that adds color must change VALUE (pale primer
  → saturated). Found in the T6 re-shoot.
- **Scene-boundary continuity checklist** (the "everything jumps" bug
  class, three found in one cut): position/heading handoff for
  per-scene ricochet boxes, camera zoom continuity, emotion handoff,
  and no pop-in entrances — verify with boundary-frame still pairs.
- **Repetition-gag delays**: Mike asked for "slightly increasing
  delay" — +30f per firing landed; the count-answers-that-sum gag
  (1/7, 2/6 … 5/3) held up. Comedy-pacing rule re-confirmed.

## Kit backlog (accumulated this round, for a future kit pass)

- Re-export Freeze from scenes/common.tsx (recap.tsx imports straight
  from remotion) — pre-existing item.
- PaintedSky 10–15px plate shift at every hard cut (per-scene phase +
  clock restart) — series-wide; decide once at kit level.
- Bubbles bx clamp [400, W−400] / by clamp [170, H−280] is
  undocumented where scene authors look — two independent builders hit
  it (RUN 1 T9, RUN 2 T7b). Document at the Bubbles/common.tsx API.
- browAsym is single-sided (camera-right brow only) — document in the
  rig notes; `skeptical` uses the achievable side.
