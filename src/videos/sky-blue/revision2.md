# Ep 3 comedy rewrite — REVISION 2 (full dialogue draft)

**Story-writer draft · 2026-08-03 · for Mike's sign-off — no implementation
until he approves.** Sources, in authority order: `scratchpad/ep3_synthesis.md`
(binding), `src/videos/sky-blue/rewrite-brief.md`, treatments A and B,
`script.md` (format authority), `scratchpad/ep3_comedy_audit.md` (baseline).

## The mandate (Mike, verbatim, after the family screening)

> "I don't think we accomplished what we wanted with the rewrite. We didn't
> change much to be honest. It's still quite dry most of the episode. The
> colors need to drive the humor much more. Give them more personality, let
> them shine. Make room for them to have fun interactions (even if it
> stretches the episode longer). Rewrite as much as necessary to get some real
> humor and fun in the episode from the moment the colors are introduced to
> the end. Even the race felt very dry, they barely interacted, and we zoomed
> through the whole thing."

## The thesis of the fix

The seven are a family from the frame they exist, and every one of them now
wants something: Blue wants to be first, Indigo wants to be Blue, Red wants
peace and quiet, Orange wants to be Red, Yellow wants everyone to have a
wonderful time, Green wants to sit down, and Violet wants to be noticed and
never is. Acts One and Two plant those wants as two-hander engines inside the
existing scenes (Treatment A's fabric); Act Three cashes all of them in a
five-leg, ~four-minute sunset race with a start line, a declared favourite who
is bounced out first in maximum denial, and a winner who never finds out it
was a race (Treatment B's centerpiece). The physics does not move an inch —
the wants ARE the physics, which was always the design; now they are audible.

## Runtime

| Block | Shipped | Delta | New |
|---|---|---|---|
| Cold open + Act One pre-split (s1–s8) | 3:01 | 0 | 3:01 (out of scope) |
| Act One from the split (s9–s13) | 1:50 | **+33s** | 2:23 |
| Act Two (s14–s24) | 3:59 | **+34s** | 4:33 |
| Act Three (s25–s31) | 3:04 | **+129s** | 5:13 |
| Recap (s32–s35) | 1:38 | **+3s** | 1:41 |
| **Total** | **13:32.5** | **+199s** | **≈ 16:51** (range 16:35–17:05 pending clip lengths) |

Inside the synthesis target of 16:30–17:00 (ruling G1). The race proper —
start line to finish — runs **≈ 3:55 across five legs** (was 82.3s across
three). A priced trim menu is in §6; the race and its exits are not on it.

## Headline structural changes

1. **Two NEW scenes**: `s27b_start_line` (~48s — the seven line up, Blue
   declares, Red walks through the start line without stopping, Sunny is the
   starting gun) and `s28b2_two_walkers` (~28s — the breathing leg: Red and
   Orange walking under a sky the other five are decorating; the direct answer
   to "we zoomed through the whole thing").
2. **The race becomes five legs at ~4 minutes**: start line → high air →
   over the sea → two walkers → the finish. Every exit is a scene with a
   reaction, not a line.
3. **The ensemble speaks from birth.** ~73 new colour/Ray/guest lines from
   Scene 9 onward, all in existing casting, one fixed emotion per colour, all
   ≤15 words. Four sameAs repetition ladders run the length of the episode:
   "I just said that!" (×4), "What Red said." (×3), "This is a nice spot."
   (×3), "He meant to." (×2) — plus Red's "No." fired twice byte-identical.
4. **The roll call gets replies** (the R1 override Mike's note authorizes) —
   in the middle of the shape only; the flat narrator line and the unbothered
   button stay exactly as shipped.
5. **One existing line retired**: `a3_12b_narrator` ("All seven set off down
   it together. Watch who lasts.") — its substance moves to the start line's
   sportscast open (`a3_11c_narrator`). Kokoro, so the retirement is free.

**Two cover-note flags for Mike (rulings G5, G7):**

- **Yellow is "she"** — the voice is `Sweet_Girl_2` and always was;
  `script.md` says "he" in places and gets a consistency sweep at
  implementation. All new material writes her as she.
- **Blue now speaks in Act One**, before his formal mechanism introduction.
  `a2_25_narrator` ("Now Blue. Blue is jumpy…") still works — it now confirms
  what the audience has been living with for five minutes instead of
  introducing a stranger, which is the better version of the line.

---

# SCENE BY SCENE, 9 → END

Engine defaults for every new colour line, from the cast table and never
varied: **Red** `minimax Patient_Man` `calm` 0.9 (+16f approach) · **Orange**
`minimax Determined_Man` `calm` pitch +2, 0.95 · **Yellow** `minimax
Sweet_Girl_2` `happy` 1.0 · **Green** `minimax Friendly_Person` `calm` 0.95 ·
**Blue** `minimax Decent_Boy` `happy` 1.05 (+4f approach) · **Indigo**
`minimax Decent_Boy` `happy` pitch +3, 1.1 (+12f approach, tails only) ·
**Ray** `minimax Young_Knight` `auto` 1.0 · **Narrator** `kokoro af_heart`
(flat lines at 0.92) · **Sunny** `kokoro am_puck` (no emotion field exists).
No pause markers anywhere. No stretched vowels on any MiniMax line — emphasis
is all-caps only. Every repeated-text gag is a `sameAs` alias of one
recording. Keys follow the house convention: insertions letter-suffix off the
preceding key; **nothing is renumbered**. Where an insertion must land between
two already-lettered keys (leg one only), the suffix goes to two letters
(`a3_13a` → `a3_13aa` → `a3_13ab` → `a3_13b`), which preserves strict lexical
= playback order; flagged again at the ledger.

---

### Scene 9 — Seven pieces · **REVISE** (+9.5s)

**On stage:** Narrator, Ray, the seven
**Staging:** Everything shipped stays: the walk into the raindrop, the fan to
seven, **the 60f reveal hold, empty and sacred**, the one-at-a-time wake-up
stagger on `a1_37_ray`. The new material is the scene's button, after
`a1_40_narrator`'s thesis: Blue does a full lap of the arc — the first thing
any colour ever does is a victory lap — and the ensemble's first words are an
identity dispute that plants the race AND births the echo engine in one beat.

> **NARRATOR:** White light is not one colour. White light is every colour, travelling together. *(`a1_40_narrator`, unchanged)*
>
> *(Blue breaks formation and laps the whole arc. **GAP — 4f.**)*
>
> **BLUE:** I came out first! I am the fastest me! *(`a1_40b_blue` — minimax `Decent_Boy` `happy` 1.05; the audience just watched them come out together; bubble: `"I was FIRST!"`)*
>
> **RAY:** We came out at the same time. *(`a1_40c_ray` — minimax `Young_Knight` `auto` 1.0; the pedant)*
>
> **BLUE** *(4f)*: Yes! And I was first! *(`a1_40d_blue` — minimax `Decent_Boy` `happy` 1.05; unfalsifiable kid logic)*
>
> **INDIGO** *(12f, from the spot in the arc Blue just left)*: I was first. *(`a1_40e_indigo` — minimax `Decent_Boy` `happy` pitch +3, 1.1; strict tail of Blue's line)*
>
> **BLUE** *(4f)*: I just said that! *(`a1_40f_blue` — minimax `Decent_Boy` `happy` 1.05; **SOURCE recording** for the series button — aliased at s19, s28 and s32, four firings total, capped per ruling G2)*

**HELD BEAT — 16f (0.5s) after `a1_40f_blue`.** Indigo does Blue's indignant
pose, four frames late. Nothing else enters. Hard into Scene 10.

**Why:** the audit's finding #3 in one beat — a colour finally wants
something, and collides with another colour over it, twenty seconds after the
ensemble exists. The thesis line now lands over seven visibly-different
siblings one pair of whom is already having an identity dispute, which IS the
thesis.

---

### Scene 10 — The roll call · **REVISE** (+13s) — *the R1 override, and this episode's fresh roll-call variant*

**On stage:** Narrator, Ray, the seven
**Staging:** The sacred shape survives exactly: `a1_42_ray` stays ONE clip at
0.88 with the seven silent movement reactions riding `beats()` as shipped —
including Red's non-reply — then its 20f frozen-poses hold, untouched. The
replies arrive **after** the hold, as an escalating pile-up in the middle of
the shape; then the shape closes as shipped: flat narrator line → 24f empty →
unbothered button. Nothing lands between `a1_43` and `a1_44`, ever.

> **RAY:** Hi Red. Hi Orange. Hi Yellow. Hi Green. Hi Blue. Hi Indigo. Hi Violet. *(`a1_42_ray`, unchanged, movement gags unchanged)*
>
> **HELD BEAT — 20f (unchanged).** Then the volley:
>
> **YELLOW:** Hi! Hello! Hi! And Violet — GREAT waving! *(`a1_42b_yellow` — minimax `Sweet_Girl_2` `happy` 1.0; bubble: `"GREAT waving, Violet!"`. Violet freezes mid-wave, both arms up, vibrating double: the first time in three episodes anyone has noticed him. Nobody else looks. Wordless chain, new firing.)*
>
> **GREEN:** Hello. I am going to sit down now. *(`a1_42c_green` — minimax `Friendly_Person` `calm` 0.95; he sits)*
>
> **BLUE** *(4f, to Ray, who is made of him)*: Hi! Are you new? I'm Blue! *(`a1_42d_blue` — minimax `Decent_Boy` `happy` 1.05)*
>
> *(Ray looks at Red. **GAP — 16f.** Red does nothing. The non-reply, on screen, marked.)*
>
> **ORANGE:** What Red said. *(`a1_42e_orange` — **sameAs `a3_18e_orange`**, byte-identical; ladder firing #1, and Red said NOTHING — the devotion engine's thesis)*
>
> **NARRATOR** *(flat, 0.92)*: Red did not say anything. *(`a1_42f_narrator` — kokoro `af_heart`)*
>
> **ORANGE:** He meant to. *(`a1_42g_orange` — minimax `Determined_Man` `calm` pitch +2, 0.95; **SOURCE recording** — fires again byte-identical in s28b2, ruling G4)*
>
> **NARRATOR:** Every single one of them was also Ray. *(`a1_43_narrator`, unchanged)*
>
> **HELD BEAT — 24f (unchanged, empty).**
>
> **RAY:** I have never met me before. *(`a1_44_ray`, unchanged — and it lands harder now, because one of him just asked if he was new)*

**Why:** the volley is this episode's fresh roll-call variant (series
signature); the button still lands flat and alone. "What Red said." answering
a silence converts the finish line's existing firing into a catchphrase payoff
instead of a one-off.

---

### Scene 11 — Big Word One · **REVISE** (+8s)

**On stage:** Narrator, Ray, Drip, the seven
**Staging:** Card timing, chant, 12f house beats, letter-perches in character,
Violet squeezed onto the W: all unchanged. The letters get sound as they are
taken — Green's chain is born, and the funniest visual in the act (Blue
ricocheting off Drip on the B) stops being silent.

> **NARRATOR:** Seven colours, side by side, bending out of the rain. *(`a1_45_narrator`, unchanged)*
>
> **GREEN** *(landing seated on the "n")*: This is a nice spot. *(`a1_45b_green` — **sameAs `a3_14f_green`**, byte-identical; chain firing #1 of three — the race firing becomes deadpan repetition)*
>
> **BLUE** *(4f, mid-second-ricochet off Drip on the B)*: Hi! Sorry! Are you a letter? *(`a1_45c_blue` — minimax `Decent_Boy` `happy` 1.05)*
>
> **DRIP:** I'm the RAIN! I made this whole word! *(`a1_45d_drip` — minimax `Lively_Girl` `happy` 1.0; the rainbow is hers and she knows it)*
>
> *(`a1_46` → 12f → `a1_47` chant → 12f → `a1_48` — all unchanged)*
>
> **DRIP:** Rain and light! That is you and me! *(`a1_49_drip`, unchanged; Blue ricochets off her once more on it)*
>
> **DRIP** *(to Ray, deadpan, watching Blue go)*: He is very you. *(`a1_49b_drip` — minimax `Lively_Girl` `happy` 1.0; **OPTIONAL — trim menu, −3s**)*

**Why:** Green's chain must be planted before the race for the s28b firing to
read as repetition (the audit graded it WEAK cold); Blue-off-Drip was audit
finding #7 (inaudible stage jokes).

---

### Scene 12 — One you can try · **KEEP** (+0s)

Untouched — audit-protected homework; the ~30s candidate-free stretch across
it is accepted and deliberate, bounded by s11's and s13's laughs.

---

### Scene 13 — Not the plain one · **REVISE** (+2.5s)

**On stage:** Narrator, Ray, Sunny, Green
**Staging:** Everything existing unchanged — both Sunny beats, the 24f hold,
the 45f tail. One addition at the top, as the seven snap back into one Ray:
Green is pulled off the "n" mid-sit.

> **GREEN** *(calm, zero rancour, mid-snap)*: I had JUST sat down. *(`a1_54b_green` — minimax `Friendly_Person` `calm` 0.95; caps emphasis only, no stretch; plays at the top of Scene 13, keyed off s12's closing line)*
>
> *(`a1_55_ray` onward exactly as written)*

**Why:** breaks audit gap #3's back half; B's "One more bounce!" is dropped
per the synthesis — Blue is already everywhere, Green needs the second
flavour.

---

### Scene 14 — So why is the sky only blue · **KEEP** (+0s)

Untouched — 13.4s question pivot; the gap it sat in is broken on both sides.

---

### Scene 15 — Myth-bust one: the sea · **REVISE** (+6.5s)

**On stage:** Narrator, Ray, Blue, Indigo
**Staging:** Narrator spine, MYTH stamp and its 30f hold, desert and grey-day
lines: all unchanged. Blue is now IN the postcard — the character who is the
sky's blue, meeting the thing that takes his credit — and the reveal that the
sea copies the sky is carried by the character it is about.

> **NARRATOR:** Lots of people think the sky is blue because the sea is blue. *(`a2_04_narrator`, unchanged)*
>
> **BLUE** *(4f, hovering over the bay, delighted, to the sea)*: Hi! You're blue! I'm Blue! Twins! *(`a2_04b_blue` — minimax `Decent_Boy` `happy` 1.05)*
>
> *(`a2_05` "Big myth. Busted." + stamp + 30f hold, `a2_06`–`a2_09` — all unchanged)*
>
> **BLUE** *(4f, on "The sea copies the sky.")*: Copy me! Everybody copy me! *(`a2_09b_blue` — minimax `Decent_Boy` `happy` 1.05; **OPTIONAL pair — trim menu, −5s**)*
>
> **INDIGO** *(12f)*: Copy me. *(`a2_09c_indigo` — minimax `Decent_Boy` `happy` pitch +3, 1.1; the copy, demanding copies; tail rule intact)*
>
> **HELD BEAT — 20f (0.7s) after `a2_09c_indigo`.** Blue looks at Indigo.
> Nothing enters. Blue decides to be pleased.

**Why:** kills Treatment B's own worst residual gap (~48s across the myth
stretch); the mechanism is carried by its character.

---

### Scene 16 — Show us the paint · **KEEP** (+0s)

Untouched — `a2_12` is Act Two's best-built joke and is not crowded.

---

### Scene 17 — The sky is not empty · **REVISE** (+4.5s)

**On stage:** Narrator, Ray, Puff, Blue, Indigo
**Staging:** Puff's five-line count untouched. Blue's WANT — to be everywhere
first — is planted here, in the crowd he will spend the race bouncing off:
the race's fuse, lit ten scenes early.

> **PUFF:** There are ZILLIONS of us. We are the whole sky. *(`a2_20_puff`, unchanged)*
>
> **BLUE** *(4f, popping out from deep inside the puff crowd, where he has evidently been for some time)*: I know! I met them! I got here FIRST! *(`a2_20b_blue` — minimax `Decent_Boy` `happy` 1.05; bubble: `"I got here FIRST!"`)*
>
> **INDIGO** *(12f, from shallower in the crowd)*: Got here first. *(`a2_20c_indigo` — minimax `Decent_Boy` `happy` pitch +3, 1.1; tail)*
>
> **HELD BEAT — 16f (0.5s) after `a2_20c_indigo`.** Blue's face does the
> arithmetic on being copied. He lets it go. Nothing else enters.
>
> **NARRATOR:** Air is real stuff, made of bits far too small to see. *(`a2_21_narrator`, unchanged)*

**Why:** "first" must be an established want before s25/s27b spend it.

---

### Scene 18 — Red goes straight through · **REVISE** (+5.5s)

**On stage:** Narrator, Red, Orange, Yellow (frame edge), Puff (silent)
**Staging:** The designed boredom stays — it IS the control case — but
Orange's devotion now scores it, and Yellow plants the cheer format on a
departure, which is the race's exact shape. Red's lines, Puff's missed
bounce, the moved 30f beat, the 20f deadpan hold: all untouched.

> **RED:** I go straight through. Always have. *(`a2_23b_red`, unchanged)*
>
> **ORANGE** *(8f)*: He does. I've seen him. *(`a2_23c_orange` — minimax `Determined_Man` `calm` pitch +2, 0.95)*
>
> *(30f walk beat, `a2_24_narrator`, 20f hold — unchanged, nothing enters)*
>
> **RED:** Lovely air. *(`a2_24b_red`, unchanged)*
>
> **GAP — 12f.**
>
> **ORANGE:** What Red said. *(`a2_24c_orange` — **sameAs `a3_18e_orange`**; ladder firing #2 — and it retroactively marks "Lovely air." as a joke for the first-watch kid)*
>
> *(Scene tail 40f: Red exits at his one speed, Orange one body-length behind. From the frame edge, waving:)*
>
> **YELLOW:** Great walking, Red! *(`a2_24d_yellow` — minimax `Sweet_Girl_2` `happy` 1.0; cheer-format plant — cheering a DEPARTURE. Red does not react. Obviously.)*

**Why:** Red's introduction no longer lives inside a dry stretch (audit gap
#4), and the "Great ___, ___!" format is now planted twice before the race
fires it five times.

---

### Scene 19 — Blue goes everywhere · **REVISE** (+6.5s)

**On stage:** Narrator, Ray, Blue, Indigo, Puff
**Staging:** The scene is already the funniest colour scene and nothing
existing moves — including the sacred 45f pinball hold and the three-corner
bubble on `a2_28b_blue`. Addition: after Indigo's echo, Blue acknowledges
Indigo for the first time in the series — the extended echo argument, which
Blue loses by playing.

> **BLUE:** I am over here! And here! And HERE! *(`a2_28b_blue`, unchanged, three-corner bubbles unchanged)*
>
> **INDIGO** *(12f)*: And here. And here. *(`a2_28c_indigo`, unchanged)*
>
> **BLUE** *(4f)*: I just said that! *(`a2_28d_blue` — **sameAs `a1_40f_blue`**, byte-identical; G2 firing #2)*
>
> **INDIGO** *(12f)*: Said that. *(`a2_28e_indigo` — minimax `Decent_Boy` `happy` pitch +3, 1.1; the echo eats the objection; tail rule intact)*
>
> **BLUE** *(4f)*: Stop saying what I say! *(`a2_28f_blue` — minimax `Decent_Boy` `happy` 1.05)*
>
> **INDIGO** *(12f)*: What I say. *(`a2_28g_indigo` — minimax `Decent_Boy` `happy` pitch +3, 1.1; tail; the argument loses by playing)*
>
> **HELD BEAT — 20f (0.7s) after `a2_28g_indigo`.** Blue keeps ricocheting —
> he never stops moving — but his FACE gives up mid-ricochet. Nothing enters.
>
> **NARRATOR:** Everywhere. Blue went absolutely everywhere. *(`a2_29_narrator`, unchanged — the deadpan now also closes an argument nobody won)*

**Why:** the series' first colour-on-colour conflict (audit MISSING #1),
built entirely from the two-hander the staging already runs.

---

### Scene 20 — Blue, from every direction · **REVISE** (+5s)

**On stage:** Narrator, Ray, Blue, Yellow, Violet (silent)
**Staging:** DELIBERATE OVERRIDE of script.md's "this scene does not get a
Blue line" — per the brief (P6 names s20) and the measured 36s hole. The
"Sorry, Violet." punchline is protected absolutely: its 20f droop, its
eye-line rule, and NOTHING after it. New material lands in the first half
only, clear of the button.

> **RAY:** So the blue is coming from ALL of the sky. *(`a2_32_ray`, unchanged)*
>
> **BLUE** *(4f — ONE clip, FOUR bubbles popping from four corners of the dome: Ray's roll-call bubble, returned from everywhere at once; the mechanism as a greeting)*: Hi! Hi! Hi! Hi! *(`a2_32b_blue` — minimax `Decent_Boy` `happy` 1.05)*
>
> *(`a2_33_narrator` + 36f dome hold — unchanged, empty)*
>
> **YELLOW** *(from the bottom corner, pointing at Violet, to a room that does not look)*: Look at Violet go! LOOK at him! *(`a2_33b_yellow` — minimax `Sweet_Girl_2` `happy` 1.0; Violet bounces HARDER when cheered. Nobody looks. Wordless chain, next firing.)*
>
> **RAY:** Hold on. Violet bounces even more than Blue does. *(`a2_34_ray`, unchanged — Ray is now the only one who listened to Yellow, which sharpens the pedant)*
>
> *(`a2_35`, `a2_36`, 20f droop, `a2_36b_ray` "Sorry, Violet." — all untouched, nothing follows the button)*

**Why:** audit gap #8 closed; the honesty-tax picture gains a witness.

---

### Scene 21 — Big Word Two · **REVISE** (+5.5s)

**On stage:** Narrator, Ray, Blue, Indigo
**Staging:** Card timing, chant, 12f house beats: untouched. The
letter-throwing gag (Blue throws them; Indigo throws one late and misses)
gets un-muted, and the series' credit-allocation gag gets its fourth speaker.

> **RAY:** The air scatters me! All day! In every direction! *(`a2_41_ray`, unchanged)*
>
> **BLUE** *(4f, mid-throw)*: I threw those letters! That was me! *(`a2_41b_blue` — minimax `Decent_Boy` `happy` 1.05; bubble: `"That was me!"`)*
>
> **INDIGO** *(12f — his letter missed)*: That was me. *(`a2_41c_indigo` — minimax `Decent_Boy` `happy` pitch +3, 1.1; claiming credit for the letter he missed; tail)*
>
> **GAP — 12f.**
>
> **RAY:** It was mostly Blue. *(`a2_41d_ray` — minimax `Young_Knight` `auto` 1.0; "Technically, that one is mostly Drip," now in the pedant's mouth — credit-allocation series gag, fourth speaker)*

**Why:** audit gap #5; the funniest visual in Act Two stops being silent.

---

### Scene 22 — The interlock · **REVISE** (+1.6s)

**On stage:** Narrator, Puff, Blue
**Staging:** The 45f interlock hold on `a2_43` is untouched. One tag after
Puff, which also plants the recap's SCATTER squabble.

> **PUFF:** I TOLD you I was real stuff! *(`a2_44_puff`, unchanged)*
>
> **BLUE** *(4f)*: And I do the bouncing part! *(`a2_44b_blue` — minimax `Decent_Boy` `happy` 1.05; **OPTIONAL — trim menu, −2s**)*

**Why:** cheapest possible bridge across the interlock into s23.

---

### Scene 23 — Sunny has a point · **KEEP** (+0s)

Untouched end to end — every hold, "He has a point.", the growing grin,
Red's free walk across the diagram. The episode's spine; the ensemble does
not play here.

### Scene 24 — Not the plain one any more · **KEEP** (+0s)

7.1s, correctly silent — the arc payoff.

---

### Scene 25 — Down at the sea, going orange · **REVISE** (+10s)

**On stage:** Narrator, Ray, Green, Blue
**Staging:** The break-up of audit gap #2 starts here, and the race venue
starts filling. Green — who sits at load-bearing moments — turns out to be
already on the rock Ray's shadow falls off (the same convention that puts Red
on Sunny's diagram in s23; the narrator never explains it). Then Blue arrives
the way Blue arrives.

> **NARRATOR:** So we went down to the sea to watch. *(`a3_03_narrator`, unchanged)*
>
> **GREEN** *(already on the rock, calm, as if this were the plan)*: This is a nice spot. *(`a3_03b_green` — **sameAs `a3_14f_green`**; chain firing #2 — by now Claire says it with him)*
>
> **RAY:** Green? How long have you been down here? *(`a3_03c_ray` — minimax `Young_Knight` `auto` 1.0)*
>
> **GREEN** *(8f)*: Don't know. It is a good rock. *(`a3_03d_green` — minimax `Friendly_Person` `calm` 0.95; opinions ONLY about spots)*
>
> **RAY:** Why is it going orange? Did somebody change me? *(`a3_04_ray`, unchanged)*
>
> **NARRATOR:** Nobody changed you. You are the same light you were this morning. *(`a3_05_narrator`, unchanged)*
>
> **BLUE** *(4f, crashing into the rock beside Ray)*: First! Sorry, rock! I am FIRST! *(`a3_05b_blue` — minimax `Decent_Boy` `happy` 1.05; plants "first" at the sunset location)*
>
> **RAY:** First at what? *(`a3_05c_ray` — minimax `Young_Knight` `auto` 1.0)*
>
> **HELD BEAT — 12f (0.4s) after `a3_05c_ray`.** Nobody answers. The next
> three scenes are the answer.

**Staging note, no line:** Ray collects Green wordlessly on the way out —
Green is back in the beam for s27b and no one mentions it.

**Why:** both treatments' s25 material, per the synthesis; the race's
favourite and its most easily-distracted entrant both reach the venue early.

---

### Scene 27 — The long way through · **REVISE** (+7s)

**On stage:** Narrator, Ray, Blue, Red (on the beams), Green
**Staging:** The two-path geometry diagram stays exactly as drawn — it is the
setup; the race is the payoff. The two characters already ON the beams
(existing visual delta) now speak: Blue's short trip is over instantly and he
declares victory over an empty finish line; Green appraises the course. A's
"Race you!" block MOVES to s27b — no double declaration.

> **NARRATOR:** At lunchtime, Ray came straight down. A short trip through the air. *(`a3_08_narrator`, unchanged)*
>
> **BLUE** *(4f, arriving off the short midday beam instantly)*: Done! First place! *(`a3_08b_blue` — minimax `Decent_Boy` `happy` 1.05)*
>
> **NARRATOR** *(flat, 0.92)*: He was the only one there. *(`a3_08c_narrator` — kokoro `af_heart`)*
>
> **BLUE** *(4f)*: Still counts! *(`a3_08d_blue` — minimax `Decent_Boy` `happy` 1.05)*
>
> *(`a3_09`, `a3_10` unchanged)*
>
> **NARRATOR:** Hundreds of miles of air, instead of a few. *(`a3_11_narrator`, unchanged)*
>
> **GREEN** *(studying the long beam, approvingly)*: A long way past a lot of nice spots. *(`a3_11b_green` — minimax `Friendly_Person` `calm` 0.95; spot-hunting aimed down the course; **OPTIONAL — trim menu, −5s**)*

**Why:** the geometry stretch gets character beats inside it (the audience
doc's diagram rule) without spending the start line's declaration.

---

### Scene 27b — THE START LINE · **NEW SCENE** (~48s)

*Scene id `s27b_start_line`. Keys continue letter-suffixes off `a3_11` so
nothing is renumbered (`a3_11c`–`a3_11v`; the letters stay valid even if
`a3_11b` is trimmed). `a3_12b_narrator` is retired — its substance opens this
scene.*

**On stage:** Narrator, Ray, all seven, Sunny
**Staging:** The seven line up across the beam-head in spectrum order, Ray on
the beam, Sunny enormous behind them — he IS the start line, the beam comes
out of him. Violet, at the far end, runs a full wordless racer warm-up:
toe-touches, vibrating up through the gears, the most professional athlete on
the line. Nobody watches.

> **NARRATOR** *(flat sportscast, 0.92)*: Seven colours. Two hundred miles of sideways air. Watch who lasts. *(`a3_11c_narrator` — kokoro `af_heart`; evolves the retired `a3_12b`, keeps its substance)*
>
> **BLUE** *(4f)*: I will win! I am the fastest one there is! *(`a3_11d_blue` — minimax `Decent_Boy` `happy` 1.05; bubble: `"I will WIN!"`)*
>
> **INDIGO** *(12f)*: The fastest one there is. *(`a3_11e_indigo` — minimax `Decent_Boy` `happy` pitch +3, 1.1; tail — and it goes UNANSWERED per ruling G2: Blue is busy declaring, and the chain stays capped at four)*
>
> **BLUE** *(4f, orbiting Red — two full loops of him per line)*: Red! Race you to the sunset! Red! RACE you! *(`a3_11f_blue` — minimax `Decent_Boy` `happy` 1.05; bubble: `"RACE you!"`)*
>
> **GAP — 16f.** *(Red's approach. Blue completes another orbit inside it.)*
>
> **RED:** No. *(`a3_11g_red` — minimax `Patient_Man` `calm` 0.9; **SOURCE recording**, ruling G3 — fires again byte-identical below; the shortest clip in the file, ear-check first)*
>
> **BLUE** *(4f)*: He means yes! See you there! *(`a3_11h_blue` — minimax `Decent_Boy` `happy` 1.05)*
>
> **ORANGE** *(8f, flat, to nobody)*: He said no. *(`a3_11i_orange` — minimax `Determined_Man` `calm` pitch +2, 0.95)*
>
> *(Red walks straight through the assembled start line without stopping and heads out of frame right. He has not stopped walking since Scene 27.)*
>
> **BLUE** *(4f)*: Red! Wait! It has not started yet! *(`a3_11j_blue` — minimax `Decent_Boy` `happy` 1.05)*
>
> **GAP — 16f.**
>
> **RED:** Start of what. *(`a3_11k_red` — minimax `Patient_Man` `calm` 0.9; the engine line — he will never find out; full stop, not a question mark, and the read must match)*
>
> **ORANGE** *(8f, setting off after him at exactly Red's speed)*: Red says good luck, everybody. *(`a3_11l_orange` — minimax `Determined_Man` `calm` pitch +2, 0.95; the audience heard what Red said)*
>
> **GREEN:** Is there anywhere to sit? *(`a3_11m_green` — minimax `Friendly_Person` `calm` 0.95)*
>
> **NARRATOR:** It is two hundred miles of air. *(`a3_11n_narrator` — kokoro `af_heart`, 0.92)*
>
> **GAP — 12f.**
>
> **GREEN:** I will find something. *(`a3_11o_green` — minimax `Friendly_Person` `calm` 0.95; a want, declared; paid off at the sailboat)*
>
> **YELLOW:** Good luck, Blue! Good luck, Green! Good luck, Violet! *(`a3_11p_yellow` — minimax `Sweet_Girl_2` `happy` 1.0; bubble: `"Good luck, EVERYBODY!"`; cheering the whole field, both sides — her entire person, and she properly arms "Great bounce, Violet!" ninety seconds early)*
>
> *(Violet's warm-up peaks. Nobody watches.)*
>
> **NARRATOR** *(flat, 0.92)*: Six racers. *(`a3_11q_narrator` — kokoro `af_heart`; ear-check: nobody-notices, never mean)*
>
> **HELD BEAT — 20f (0.7s) after `a3_11q_narrator`.** Violet waves both arms.
>
> **NARRATOR:** Make that seven. *(`a3_11r_narrator` — kokoro `af_heart`, 0.92; the wordless chain grows — no line, no look)*
>
> **RAY:** Wait. Are we racing? *(`a3_11s_ray` — minimax `Young_Knight` `auto` 1.0)*
>
> **BLUE** *(4f)*: YES! *(`a3_11t_blue` — minimax `Decent_Boy` `happy` 1.05)*
>
> **GAP — 16f.**
>
> **RED** *(half off frame)*: No. *(`a3_11u_red` — **sameAs `a3_11g_red`**, byte-identical; ruling G3's second firing — both approach gaps in one exchange, and both of them are right)*
>
> *(Sunny sinks a notch. The beam tilts.)*
>
> **SUNNY:** READY! STEADY! SUNSET! *(`a3_11v_sunny` — kokoro `am_puck` 1.0; ruling G6 — no "You're welcome!", no "HA! HA!", the seven-firing ceiling untouched; his only race appearance, then he is scenery sinking behind the field)*
>
> **HELD BEAT — 12f (0.4s) after `a3_11v_sunny`** — seven bodies strung out
> down the beam — then HARD CUT to leg one.

**Why:** the race now has a start, stakes, a declared favourite, a field with
wants, and a starter — everything §4 of the audit measured as absent. The
word "race" is finally spoken by a racer.

---

### Scene 28 — The race, leg one: high air · **REVISE, EXPANDED** (35.7s → ~55s, +19s)

*(Scene id stays `s28_blue_runs_out` — wiring. `a3_12b` has moved to the
start line as `a3_11c`; `a3_12` chains straight into `a3_13`.)*

**On stage:** Narrator, Ray, Blue, Indigo, Yellow, Orange, Red, Violet (silent)
**Staging:** Sacred and untouched: the 45f drain hold after `a3_13`, exit
order = spectrum order, every exit bounces UP into the blue, Violet's silent
exit beat, and the entire goodbye roll call with nothing landing inside its
shape. What is new: mid-leg banter before the exits, and Blue's and Indigo's
exits staged as scenes. **Key note:** insertions between the already-lettered
`a3_13`/`a3_13b`/`a3_13c` take two-letter suffixes, preserving lexical =
playback order.

> **NARRATOR:** And you know what blue does in air. Blue bounces. *(`a3_12_narrator`, unchanged)*
>
> **NARRATOR:** Bounce. Bounce. Bounce. All the way along. *(`a3_13_narrator`, unchanged, 0.88)*
>
> **HELD BEAT — 45f (unchanged, sacred).** The blue drains out of the beam in
> silence — and it is now also the field stringing out. Nothing enters.
>
> **BLUE** *(4f, ricocheting past Red BACKWARDS)*: Too slow, Red! Sorry! You are too slow! *(`a3_13a_blue` — minimax `Decent_Boy` `happy` 1.05; a taunt with an apology inside it — nobody unkind; bubble: `"Too slow! Sorry!"`)*
>
> **GAP — 16f.** *(Red keeps walking. Nothing.)*
>
> **ORANGE:** Red is going the right speed. *(`a3_13aa_orange` — minimax `Determined_Man` `calm` pitch +2, 0.95; devotion, escalating)*
>
> **INDIGO** *(12f, arriving at the puff Blue just left, to a Red who has already been taunted)*: Too slow. Sorry. *(`a3_13ab_indigo` — minimax `Decent_Boy` `happy` pitch +3, 1.1; tail)*
>
> *(The big puff. Ping, ping, UP:)*
>
> **BLUE:** Sorry! Sorry! I am going UP now! Bye! *(`a3_13b_blue`, unchanged — the drain hold is no longer his approach; the banter is, and he is mid-air on the line as before)*
>
> **BLUE** *(4f, rising, delighted, in total denial)*: I am still winning! I am winning UPWARDS! *(`a3_13bb_blue` — minimax `Decent_Boy` `happy` 1.05; bubble: `"Winning UPWARDS!"`; physics-honest denial — he really is going up, nothing is taken away; the s9 claim detonates)*
>
> **YELLOW:** Great winning, Blue! *(`a3_13bc_yellow` — minimax `Sweet_Girl_2` `happy` 1.0; cheer #1 of 5)*
>
> **NARRATOR** *(flat, 0.92)*: He does win the sky. *(`a3_13bd_narrator` — kokoro `af_heart`; physics honesty as validation — the exit is a victory)*
>
> **INDIGO** *(12f)*: Going up now. Bye. *(`a3_13c_indigo`, unchanged — KEPT per the synthesis, not replaced)*
>
> **INDIGO** *(12f, rising after him)*: Winning upwards. *(`a3_13cb_indigo` — minimax `Decent_Boy` `happy` pitch +3, 1.1; tail of Blue's denial — the credit-claim, final form)*
>
> **BLUE** *(faint, from high above)*: I just said that! *(`a3_13cc_blue` — **sameAs `a1_40f_blue`**, byte-identical; G2 firing #3. Staging note: "faint" is the MIX and the picture — tiny bubble at the top of frame, clip attenuated at build if the pipeline allows per-clip gain; if it does not, play it at level with the tiny-bubble staging — the sameness is the gag, not the distance.)*
>
> **YELLOW:** Great echo, Indigo! *(`a3_13cd_yellow` — minimax `Sweet_Girl_2` `happy` 1.0; cheer #2; **OPTIONAL — trim menu, −2s**)*
>
> **HELD BEAT — 20f (0.7s) after `a3_13cd_yellow`.** **VIOLET EXITS HERE, AND
> HE DOES NOT SAY ANYTHING.** Last of the three, highest and furthest,
> out-bouncing both of them, in complete silence. The beat is unchanged in
> content and stays empty — it has moved down the scene with the exits.
>
> **YELLOW:** Great bounce, Violet! *(`a3_13d_yellow`, unchanged — cheer #3, and the format is now established instead of fragile)*
>
> *(`a3_14` → `a3_14b` "Bye Blue! Bye Indigo! Bye Violet!" → 20f → `a3_14c`
> "They did not go anywhere. They went everywhere else." → 24f → `a3_14d`
> "I will see me later." — the goodbye roll call, second firing, untouched,
> nothing inside its shape)*

**Why:** the old 5-second triple-exit window becomes ~20 seconds with a scene
per exit; the declared winner is out FIRST, in denial, and three other
characters react — the race finally has an incident.

---

### Scene 28b — The race, leg two: out over the sea · **REVISE, EXPANDED** (17.4s → ~25s, +8s)

**On stage:** Narrator, Green, Yellow, Orange, Red, the volcano (silent, and
it stays silent)
**Staging:** Sacred and untouched: the 45f volcano eye (empty, unmentioned,
`a3_14i` addressed to Yellow), Green's mid-spectrum physics line `a3_14g`
verbatim, Yellow's warm rock, the 14f tail with her apologetic bounce-off
inside it. Yellow's self-cheer is CUT FROM THIS SCENE (it opens s28b2 —
protects the eye hold absolutely). New: Orange's play-by-play, and Green's
exit as a want achieved.

> **NARRATOR:** Out over the sea now. And then there were four. *(`a3_14e_narrator`, unchanged)*
>
> **ORANGE** *(8f, one body-length behind Red, walking pace)*: Blue went up. Indigo went up. Violet went up. *(`a3_14eb_orange` — minimax `Determined_Man` `calm` pitch +2, 0.95; a flat recap of events Red personally attended; bubble: `"Everybody went up."`)*
>
> **GAP — 16f.** *(Red walks.)*
>
> **ORANGE:** Red says he noticed. *(`a3_14ec_orange` — minimax `Determined_Man` `calm` pitch +2, 0.95; translating a silence)*
>
> **GREEN** *(drifting off the beam toward the becalmed sailboat)*: This is a nice spot. *(`a3_14f_green`, unchanged — the **SOURCE recording** of the chain, now heard as its third firing; deadpan repetition, which is what this line always wanted to be)*
>
> **HELD BEAT — 20f (unchanged).** He sits.
>
> **GREEN** *(settling, eyes closing)*: I found one. *(`a3_14fb_green` — minimax `Friendly_Person` `calm` 0.95; the start-line promise, kept)*
>
> **YELLOW** *(8f)*: Great sitting, Green! *(`a3_14fc_yellow` — minimax `Sweet_Girl_2` `happy` 1.0; cheer #4 — waving, walking, winning, echoing, now sitting: she cheers exits as achievements)*
>
> **NARRATOR:** Green bounced off as well. He just took longer. *(`a3_14g_narrator`, unchanged — the mid-spectrum line, verbatim)*
>
> **YELLOW:** A warm rock! I will have a little sit down! *(`a3_14h_yellow`, unchanged)*
>
> **GAP — house 8f.**
>
> **NARRATOR:** That is not a rest stop. *(`a3_14i_narrator`, unchanged — addressed to Yellow, never to the thing she is sitting on)*
>
> **HELD BEAT — 45f, trailing to the cut, SACRED AND EMPTY.** The volcano
> opens one eye. It holds. It closes it. Nothing else happens and nothing
> else enters — no line, no bubble, no sting. Yellow bounces off
> apologetically inside the 14f tail, in silence, exactly as shipped.

**Why:** Orange's devotion gets its walking-pace showcase, Green's exit pays
a declared want, and the volcano beat keeps its absolute protection.

---

### Scene 28b2 — The race, leg three: two walkers · **NEW SCENE** (~28s)

*Scene id `s28b2_two_walkers`. Keys continue off `a3_14i` (`a3_14j`–`a3_14q`),
ahead of s28c's `a3_15`. Nothing is renumbered.*

**On stage:** Narrator, Ray, Red, Orange; the decorated sky
**Staging:** The breathing leg — the anti-zoom. Red and Orange walking, Ray
on the beam, warm light, sea below. Above them the whole sky is now
decorated: Blue, Indigo and Violet streaks high in the blue, Yellow rising,
Green flat out on his boat. "Nobody loses," as one picture.

> **YELLOW** *(tiny, distant, rising past the top of frame)*: Great bounce, me! *(`a3_14j_yellow` — minimax `Sweet_Girl_2` `happy` 1.0; cheer #5 and the chain's button — the only one left who would think to cheer her is her. Safely clear of the volcano hold, one scene later.)*
>
> **RAY** *(waving up)*: Bye Yellow! *(`a3_14k_ray` — minimax `Young_Knight` `auto` 1.0; NO cheer format — Ray inheriting it is cut per the synthesis, one cheer is enough here)*
>
> **NARRATOR** *(flat, 0.92)*: Two colours left. Neither of them is hurrying. *(`a3_14l_narrator` — kokoro `af_heart`)*
>
> **ORANGE** *(8f)*: Red says we are nearly there. *(`a3_14m_orange` — minimax `Determined_Man` `calm` pitch +2, 0.95)*
>
> **RAY:** Red did not say anything. *(`a3_14n_ray` — minimax `Young_Knight` `auto` 1.0; the pedant, inheriting the Narrator's s10 line)*
>
> **GAP — 12f.**
>
> **ORANGE:** He meant to. *(`a3_14o_orange` — **sameAs `a1_42g_orange`**, byte-identical; ruling G4's second firing — the devotion thesis, in three words)*
>
> **HELD BEAT — 45f (1.5s) after `a3_14o_orange`.** The two walkers, the
> decorated sky, the sea. The race breathes. Nothing enters. *(This hold is
> the direct answer to "we zoomed through the whole thing"; trim menu lists a
> 45f→30f option and nothing more.)*
>
> **RAY:** Are we still racing? *(`a3_14p_ray` — minimax `Young_Knight` `auto` 1.0)*
>
> **GAP — 16f.**
>
> **RED:** I am walking home. *(`a3_14q_red` — minimax `Patient_Man` `calm` 0.9; the whole engine in four words)*

**Why:** the leg where the mandate's "make room" is spent as room — two
walkers, one alias, one held beat, and the episode's calmest joke.

---

### Scene 28c — The race, the finish line · **REVISE, EXPANDED** (29.2s → ~39s, +10s)

**On stage:** Narrator, Ray, Red, Orange
**Staging:** B's order — comedy first, then the earned quiet. Kept pedagogy
open; then Red walks out of the end of the beam at the speed he has walked at
all episode and the finish happens TO him; then Orange's climax; then the
kept landing block verbatim with every hold intact. Red never speeds up,
Orange never overtakes, neither looks at the other.

> **RAY:** So who is left? *(`a3_15_ray`, unchanged)*
>
> **NARRATOR:** The ones that never bounced much. Red. And orange. *(`a3_16_narrator`, unchanged)*
>
> **RAY:** The calm ones. *(`a3_17_ray`, unchanged)*
>
> **NARRATOR:** The calm ones. Straight down the middle, all the way to your eyes. *(`a3_18_narrator`, unchanged)*
>
> *(Red walks out of the beam-end.)*
>
> **RAY:** Red! You won! *(`a3_18a_ray` — minimax `Young_Knight` `auto` 1.0)*
>
> **GAP — 16f.** *(He takes his time. He always takes his time.)*
>
> **RED:** Won what. *(`a3_18ab_red` — minimax `Patient_Man` `calm` 0.9; the bookend of "Start of what." — full stop, dead straight)*
>
> **ORANGE** *(8f)*: Second! I came second! *(`a3_18ac_orange` — minimax `Determined_Man` `calm` pitch +2, 0.95; must read thrilled — see ear-check)*
>
> **GAP — 12f.**
>
> **ORANGE:** Second is right behind Red! *(`a3_18ad_orange` — minimax `Determined_Man` `calm` pitch +2, 0.95; the want, named: second place is where he LIVES, and nobody corrects him)*
>
> **NARRATOR** *(flat, 0.92)*: That is the happiest anyone has been all day. *(`a3_18ae_narrator` — kokoro `af_heart`)*
>
> **NARRATOR:** At the end of all that air, one colour is still walking. *(`a3_18b_narrator`, unchanged, **+36f hold**)*
>
> **RED:** Everybody bounced off. *(`a3_18c_red`, unchanged, **+30f hold**)*
>
> **RED:** Peace and quiet. *(`a3_18d_red`, unchanged, **+45f hold — the act's silence, untouched; now the punchline of a four-minute structure**)*
>
> **ORANGE:** What Red said. *(`a3_18e_orange`, unchanged — the ladder's **SOURCE recording**, heard here as firing #3, **+20f hold**)*
>
> **NARRATOR:** Red has waited all day for this. *(`a3_18f_narrator`, unchanged — and "this" now also means: not the trophy)*

**Why:** Red wins without noticing, after "Peace and quiet." has had its 45
frames — mood payoff first, structure payoff buttons it. A's play-by-play
here is dropped (it lives in s28b, per the synthesis).

---

### Scene 29 — Big Word Three · **REVISE** (+1.5s)

**On stage:** Narrator, Ray, Sunny, Red, Orange
**Staging:** Card, chant, Sunny's `a3_22`, the Red-and-Orange walk-behind:
all kept. One line of sound ON the walk-behind (inaudible stage jokes were
audit finding #7).

> **SUNNY:** I do this bit ON PURPOSE! For the drama! You're welcome! *(`a3_22_sunny`, unchanged — existing ceiling firing)*
>
> **GAP — 16f.** *(Red's house gap, crossing behind the card.)*
>
> **RED** *(passing, not stopping, not looking)*: Nice drama. *(`a3_22b_red` — minimax `Patient_Man` `calm` 0.9; the "Lovely air." shape — the actual sunset reviews the show about him; feeds `rc_04b`. A's "It is mostly Red." is dropped — it pre-spends `rc_04b`, per A's own flag.)*
>
> **NARRATOR:** A sunset is not different light. It is the same light, taking the long way. *(`a3_23_narrator`, unchanged)*

**Why:** breaks the 38s stretch into the crayon close by exactly one deadpan.

---

### Scene 30 — The crayon goes back · **KEEP** (+0s)

Untouched and protected — the frame story's emotional close, correctly silent.

### Scene 31 — Round the other side · **KEEP** (+0s)

Untouched — the 75f world-turn hold is sacred; the `sameAs` GOOD MORNING is
the ending.

---

### Scene 32 — The chant · **REVISE** (+3s)

**On stage:** Narrator, Ray, Puff, Blue, Indigo, Sunny, Red
**Staging:** Panels, Violet's edge-of-frame wave, `rc_04`/`rc_04b`/20f: all
unchanged. The SCATTER panel's argument gains its third claimant — the echo
engine's final firing, at maximum: the copy claims the mechanism itself.

> **PUFF:** SCATTER! Blue bounces off us and goes EVERYWHERE! That is me! *(`rc_03_puff`, unchanged)*
>
> **BLUE** *(4f)*: SCATTER! That is ME bouncing! That is ME! *(`rc_03b_blue`, unchanged)*
>
> **INDIGO** *(12f)*: That is me. *(`rc_03c_indigo` — minimax `Decent_Boy` `happy` pitch +3, 1.1; tail)*
>
> **BLUE** *(4f)*: I just said that! *(`rc_03d_blue` — **sameAs `a1_40f_blue`**, byte-identical; **G2's FOURTH AND FINAL firing.** Nobody adjudicates; the panel light moves on; three claimants stand unresolved, and all three are right, which is the mechanism.)*
>
> *(`rc_04` Sunny → 16f → `rc_04b` Red → 20f → `rc_05` — unchanged)*

**Why:** the echo argument ends the way it began — unresolved, with Blue's
identical protest — and the chant panel teaches scattering as a three-way
credit dispute in which everyone is correct.

---

### Scene 33 — Right now · **KEEP** (+0s)

Untouched.

### Scene 34 — The mind-blower · **KEEP** (+0s)

Untouched — 60f lunar-sky hold sacred; Sunny carries the scene; the Moon
control experiment is not a comedy venue.

### Scene 35 — Tease and sign-off · **KEEP** (+0s)

Untouched — the ep-4 bank (the claim, "Hmm. We will find out.", every hold)
is series canon and out of bounds.

---

# PRODUCTION LEDGER

## New clips — recordings

All colour lines carry that colour's single fixed emotion (the emotion IS the
character; no per-line seasoning anywhere below). No pause markers. No
stretched vowels on MiniMax; emphasis is all-caps only. Est. seconds are
planning numbers; durations flow from the manifest after `npm run narration`.

**MiniMax (paid), 73 recordings:**

| Key | Speaker | Text | Engine fields | Est. s |
|---|---|---|---|---|
| `a1_40b_blue` | Blue | I came out first! I am the fastest me! | `Decent_Boy` happy 1.05 | 2.4 |
| `a1_40c_ray` | Ray | We came out at the same time. | `Young_Knight` auto 1.0 | 1.8 |
| `a1_40d_blue` | Blue | Yes! And I was first! | `Decent_Boy` happy 1.05 | 1.5 |
| `a1_40e_indigo` | Indigo | I was first. | `Decent_Boy` happy +3 1.1 | 1.0 |
| `a1_40f_blue` | Blue | I just said that! | `Decent_Boy` happy 1.05 — **chain SOURCE** | 1.3 |
| `a1_42b_yellow` | Yellow | Hi! Hello! Hi! And Violet — GREAT waving! | `Sweet_Girl_2` happy 1.0 | 2.8 |
| `a1_42c_green` | Green | Hello. I am going to sit down now. | `Friendly_Person` calm 0.95 | 2.2 |
| `a1_42d_blue` | Blue | Hi! Are you new? I'm Blue! | `Decent_Boy` happy 1.05 | 2.0 |
| `a1_42g_orange` | Orange | He meant to. | `Determined_Man` calm +2 0.95 — **G4 SOURCE** | 1.0 |
| `a1_45c_blue` | Blue | Hi! Sorry! Are you a letter? | `Decent_Boy` happy 1.05 | 1.8 |
| `a1_45d_drip` | Drip | I'm the RAIN! I made this whole word! | `Lively_Girl` happy 1.0 | 2.2 |
| `a1_49b_drip` | Drip | He is very you. | `Lively_Girl` happy 1.0 — trim-optional | 1.2 |
| `a1_54b_green` | Green | I had JUST sat down. | `Friendly_Person` calm 0.95 | 1.8 |
| `a2_04b_blue` | Blue | Hi! You're blue! I'm Blue! Twins! | `Decent_Boy` happy 1.05 | 2.2 |
| `a2_09b_blue` | Blue | Copy me! Everybody copy me! | `Decent_Boy` happy 1.05 — trim-optional | 1.8 |
| `a2_09c_indigo` | Indigo | Copy me. | `Decent_Boy` happy +3 1.1 — trim-optional | 0.9 |
| `a2_20b_blue` | Blue | I know! I met them! I got here FIRST! | `Decent_Boy` happy 1.05 | 2.2 |
| `a2_20c_indigo` | Indigo | Got here first. | `Decent_Boy` happy +3 1.1 | 1.1 |
| `a2_23c_orange` | Orange | He does. I've seen him. | `Determined_Man` calm +2 0.95 | 1.6 |
| `a2_24d_yellow` | Yellow | Great walking, Red! | `Sweet_Girl_2` happy 1.0 | 1.5 |
| `a2_28e_indigo` | Indigo | Said that. | `Decent_Boy` happy +3 1.1 | 0.9 |
| `a2_28f_blue` | Blue | Stop saying what I say! | `Decent_Boy` happy 1.05 | 1.6 |
| `a2_28g_indigo` | Indigo | What I say. | `Decent_Boy` happy +3 1.1 | 1.0 |
| `a2_32b_blue` | Blue | Hi! Hi! Hi! Hi! | `Decent_Boy` happy 1.05 — one clip, four bubbles | 1.6 |
| `a2_33b_yellow` | Yellow | Look at Violet go! LOOK at him! | `Sweet_Girl_2` happy 1.0 | 2.0 |
| `a2_41b_blue` | Blue | I threw those letters! That was me! | `Decent_Boy` happy 1.05 | 2.0 |
| `a2_41c_indigo` | Indigo | That was me. | `Decent_Boy` happy +3 1.1 | 1.0 |
| `a2_41d_ray` | Ray | It was mostly Blue. | `Young_Knight` auto 1.0 | 1.4 |
| `a2_44b_blue` | Blue | And I do the bouncing part! | `Decent_Boy` happy 1.05 — trim-optional | 1.5 |
| `a3_03c_ray` | Ray | Green? How long have you been down here? | `Young_Knight` auto 1.0 | 2.0 |
| `a3_03d_green` | Green | Don't know. It is a good rock. | `Friendly_Person` calm 0.95 | 1.9 |
| `a3_05b_blue` | Blue | First! Sorry, rock! I am FIRST! | `Decent_Boy` happy 1.05 | 2.2 |
| `a3_05c_ray` | Ray | First at what? | `Young_Knight` auto 1.0 | 1.1 |
| `a3_08b_blue` | Blue | Done! First place! | `Decent_Boy` happy 1.05 | 1.3 |
| `a3_08d_blue` | Blue | Still counts! | `Decent_Boy` happy 1.05 | 1.0 |
| `a3_11b_green` | Green | A long way past a lot of nice spots. | `Friendly_Person` calm 0.95 — trim-optional | 2.4 |
| `a3_11d_blue` | Blue | I will win! I am the fastest one there is! | `Decent_Boy` happy 1.05 | 2.4 |
| `a3_11e_indigo` | Indigo | The fastest one there is. | `Decent_Boy` happy +3 1.1 | 1.4 |
| `a3_11f_blue` | Blue | Red! Race you to the sunset! Red! RACE you! | `Decent_Boy` happy 1.05 | 2.6 |
| `a3_11g_red` | Red | No. | `Patient_Man` calm 0.9 — **G3 SOURCE**, shortest clip in the file | 0.7 |
| `a3_11h_blue` | Blue | He means yes! See you there! | `Decent_Boy` happy 1.05 | 1.8 |
| `a3_11i_orange` | Orange | He said no. | `Determined_Man` calm +2 0.95 | 1.1 |
| `a3_11j_blue` | Blue | Red! Wait! It has not started yet! | `Decent_Boy` happy 1.05 | 2.0 |
| `a3_11k_red` | Red | Start of what. | `Patient_Man` calm 0.9 | 1.2 |
| `a3_11l_orange` | Orange | Red says good luck, everybody. | `Determined_Man` calm +2 0.95 | 1.9 |
| `a3_11m_green` | Green | Is there anywhere to sit? | `Friendly_Person` calm 0.95 | 1.5 |
| `a3_11o_green` | Green | I will find something. | `Friendly_Person` calm 0.95 | 1.4 |
| `a3_11p_yellow` | Yellow | Good luck, Blue! Good luck, Green! Good luck, Violet! | `Sweet_Girl_2` happy 1.0 | 2.8 |
| `a3_11s_ray` | Ray | Wait. Are we racing? | `Young_Knight` auto 1.0 | 1.4 |
| `a3_11t_blue` | Blue | YES! | `Decent_Boy` happy 1.05 | 0.6 |
| `a3_13a_blue` | Blue | Too slow, Red! Sorry! You are too slow! | `Decent_Boy` happy 1.05 | 2.3 |
| `a3_13aa_orange` | Orange | Red is going the right speed. | `Determined_Man` calm +2 0.95 | 1.6 |
| `a3_13ab_indigo` | Indigo | Too slow. Sorry. | `Decent_Boy` happy +3 1.1 | 1.2 |
| `a3_13bb_blue` | Blue | I am still winning! I am winning UPWARDS! | `Decent_Boy` happy 1.05 | 2.4 |
| `a3_13bc_yellow` | Yellow | Great winning, Blue! | `Sweet_Girl_2` happy 1.0 | 1.4 |
| `a3_13cb_indigo` | Indigo | Winning upwards. | `Decent_Boy` happy +3 1.1 | 1.1 |
| `a3_13cd_yellow` | Yellow | Great echo, Indigo! | `Sweet_Girl_2` happy 1.0 — trim-optional | 1.4 |
| `a3_14eb_orange` | Orange | Blue went up. Indigo went up. Violet went up. | `Determined_Man` calm +2 0.95 | 2.6 |
| `a3_14ec_orange` | Orange | Red says he noticed. | `Determined_Man` calm +2 0.95 | 1.3 |
| `a3_14fb_green` | Green | I found one. | `Friendly_Person` calm 0.95 | 1.0 |
| `a3_14fc_yellow` | Yellow | Great sitting, Green! | `Sweet_Girl_2` happy 1.0 | 1.5 |
| `a3_14j_yellow` | Yellow | Great bounce, me! | `Sweet_Girl_2` happy 1.0 | 1.2 |
| `a3_14k_ray` | Ray | Bye Yellow! | `Young_Knight` auto 1.0 | 1.0 |
| `a3_14m_orange` | Orange | Red says we are nearly there. | `Determined_Man` calm +2 0.95 | 1.9 |
| `a3_14n_ray` | Ray | Red did not say anything. | `Young_Knight` auto 1.0 | 1.5 |
| `a3_14p_ray` | Ray | Are we still racing? | `Young_Knight` auto 1.0 | 1.3 |
| `a3_14q_red` | Red | I am walking home. | `Patient_Man` calm 0.9 | 1.7 |
| `a3_18a_ray` | Ray | Red! You won! | `Young_Knight` auto 1.0 | 1.4 |
| `a3_18ab_red` | Red | Won what. | `Patient_Man` calm 0.9 | 0.9 |
| `a3_18ac_orange` | Orange | Second! I came second! | `Determined_Man` calm +2 0.95 | 1.6 |
| `a3_18ad_orange` | Orange | Second is right behind Red! | `Determined_Man` calm +2 0.95 | 1.5 |
| `a3_22b_red` | Red | Nice drama. | `Patient_Man` calm 0.9 | 1.0 |
| `rc_03c_indigo` | Indigo | That is me. | `Decent_Boy` happy +3 1.1 | 0.9 |

**Kokoro (free), 10 recordings — all `af_heart` 0.92 flat unless noted:**

| Key | Speaker | Text |
|---|---|---|
| `a1_42f_narrator` | Narrator | Red did not say anything. |
| `a3_08c_narrator` | Narrator | He was the only one there. |
| `a3_11c_narrator` | Narrator | Seven colours. Two hundred miles of sideways air. Watch who lasts. |
| `a3_11n_narrator` | Narrator | It is two hundred miles of air. |
| `a3_11q_narrator` | Narrator | Six racers. |
| `a3_11r_narrator` | Narrator | Make that seven. |
| `a3_11v_sunny` | Sunny | READY! STEADY! SUNSET! *(`am_puck` 1.0; slow to 0.92 if the three items run together)* |
| `a3_13bd_narrator` | Narrator | He does win the sky. |
| `a3_14l_narrator` | Narrator | Two colours left. Neither of them is hurrying. |
| `a3_18ae_narrator` | Narrator | That is the happiest anyone has been all day. |

**Retired:** `a3_12b_narrator` ("All seven set off down it together. Watch
who lasts.") — kokoro, substance absorbed by `a3_11c_narrator`; deletion is
free and nothing downstream references it after restaging.

## sameAs chains — 9 new aliases, zero cost

| Source recording | Text | Aliases (playback order) | Firings total |
|---|---|---|---|
| `a1_40f_blue` (NEW, s9) | "I just said that!" | `a2_28d_blue` (s19), `a3_13cc_blue` (s28, faint), `rc_03d_blue` (s32) | 4 — capped per G2; the s27b tail goes unanswered |
| `a3_18e_orange` (EXISTS, s28c) | "What Red said." | `a1_42e_orange` (s10), `a2_24c_orange` (s18) | 3 |
| `a3_14f_green` (EXISTS, s28b) | "This is a nice spot." | `a1_45b_green` (s11), `a3_03b_green` (s25) | 3 |
| `a1_42g_orange` (NEW, s10) | "He meant to." | `a3_14o_orange` (s28b2) | 2 — per G4 |
| `a3_11g_red` (NEW, s27b) | "No." | `a3_11u_red` (s27b) | 2 — per G3, same flatness |

**Aliasing-direction ruling (the "What Red said." question from Treatment A's
ledger):** the pre-existing recordings **stay the sources** — `a3_18e_orange`
and `a3_14f_green` are on disk, already paid for, and `sameAs` is a key-based
byte copy (engine-agnostic, per script.md's shared-recordings note), so an
alias earlier in playback order than its source key is legal: the generator
copies bytes by key, not by position. The new s10/s18/s11/s25 keys alias
BACKWARD to the existing clips. Fallback if implementation finds the
generator resolves aliases file-order-forward only: flip direction — make the
earliest firing the source and re-alias the existing key to it (one re-copy
for `a3_14f`; one ~cents re-record for `a3_18e`) — the ruling either way is
ONE recording per chain, byte-identical everywhere. **`a2_25b_blue` is NOT
used as a source**: Treatment B's s11 re-fire of "Hi! Sorry! Sorry! Hi!
Sorry!" was dropped in the merge in favour of the Blue-off-Drip exchange, so
that clip keeps its single existing firing.

## Cost

73 new MiniMax recordings ≈ 2,150 characters ≈ **$0.24** at ~$0.11/1k chars,
plus 10 free kokoro clips and 9 zero-cost aliases. One retired kokoro line.
Episode clip count: 208 → **299 entries** (289 recordings + 10 existing
aliases + the 9 new ones, net of the retirement). No budget argument exists.

---

# EAR-CHECK ADDITIONS

Appended to script.md's existing list; these come before anything is staged.
Items 1–4 are the synthesis memo's list; 5–10 are this draft's own.

1. **Red's race quartet** — `a3_11g` "No.", `a3_11k` "Start of what.",
   `a3_18ab` "Won what.", `a3_14q` "I am walking home." All the same
   fragility class as `a3_18d`: **contented, never tired** — a tired Red
   turns the race into the light dying. "No." is the new shortest clip in the
   file; listen for clipping at both ends (the `a2_24b` note). Fallbacks,
   pre-written: "No. Thank you." / "The start of what." / "Won what,
   exactly." / "I am just walking home."
2. **Orange's climax** (`a3_18ac`/`a3_18ad`) — must read **thrilled inside
   `calm`**, never deflated; the emotion field does not move (one emotion per
   colour is hard). Fallback is textual, not tonal: "I came second! Right
   behind Red!" as one line if the two-clip build reads flat.
3. **Narrator "Six racers." / "Make that seven."** (`a3_11q`/`a3_11r`) —
   must read as nobody-notices-Violet, never as the show being mean. Kokoro,
   free to re-take; fallback softens the second line to "And that makes
   seven."
4. **Yellow "Great bounce, me!"** (`a3_14j`) — tiny and delighted; the mix
   does the "distant", not the read. Fallback: "Great bounce, Yellow!" —
   cheering herself in the third person, which may test funnier anyway.
5. **`a1_40f_blue` "I just said that!"** — the source for three aliases in
   three contexts (birth, argument, faint-from-the-sky, recap). It must be
   indignant-but-flat enough to survive all four placements; if the s9 take
   is too sold, the s28 faint firing will read as a scream. Audition two
   takes before locking.
6. **`a3_13cc_blue` faint firing** — byte-identical clip; "faint" is bought
   by the mix and the tiny top-of-frame bubble. If the pipeline has no
   per-clip gain, play it at level — the sameness is the gag; do NOT order a
   quiet re-record (that kills the byte-identity the joke runs on).
7. **`a3_13a_blue` "Too slow, Red! Sorry! You are too slow!"** — the taunt
   must carry its own apology; nobody unkind. If `happy` at 1.05 reads
   jeering, fallback: "You are too slow! Sorry!"
8. **`a1_42b_yellow`** — caps "GREAT" on MiniMax: check emphasis, not shout
   distortion; fallback drops the caps.
9. **`a3_11v_sunny` "READY! STEADY! SUNSET!"** — kokoro; the three items
   must separate (the `a2_47` three-halves test). Fix is `speed` 0.92, never
   the text.
10. **The backward aliases in situ** — `a1_42e`/`a2_24c` ("What Red said.")
    and `a1_45b`/`a3_03b` ("This is a nice spot.") were recorded for their
    Act Three contexts; play each in its new scene against its neighbours.
    Both are flat `calm` reads and should port; if one audibly does not, flip
    the chain per the ledger's fallback (cents).

---

# GAP SELF-SCORE

Audit method exactly: laugh candidates are **spoken, kid-graded lines**;
visual-only business excluded from cadence; times are the audit's measured
timeline plus cumulative insertion shifts (±5s). Every previously-failing gap
(>50s ceiling) at or after Scene 9, and its new value:

| Audit gap | Was | Now (est.) | Fixed by |
|---|---|---|---|
| #1 pre-s9 → s10 | 92.9s | **~75s residual — FLAGGED, out of scope** | s9's new button lands its first STRONG at ~3:22; the remainder lies entirely in Scenes 6–8, which the mandate excludes ("from the moment the colors are introduced") |
| #3 s10 → s13 | 66.8s | **~30s** (across protected s12) | s10 volley, s11 Green/Blue/Drip, s13 Green opener |
| #6 s13 → s16 | 48.1s | ~22s | s15 "Twins!" + Copy-me pair |
| #4 s16 → s19 | 60.3s | ~20s | s17 first-plant, s18 Orange pair + Yellow cheer |
| #5 + #8 s19 → s23 | 53.7s / 36.0s | ~18s | s19 echo argument, s20 Blue + Yellow, s21 exchange, s22 tag |
| #2 s23 → race | 71.9s | ~24s | s25 Green-rock pair + Blue crash, s27 midday gag, s27b dense |
| Race internal (audit §4 + #11) | 27.9s; longest silence 1.97s | **never >20s without a candidate; two deliberate holds (45f breathing beat, the sacred beats)** | five legs, banter, exits as scenes; racers now out-talk the narrator |
| #7 s29 → s31 | 38.0s | **~33s** (across protected s30) | s29 "Nice drama."; the crayon close stays silent by design — FLAGGED, accepted |
| #10 s34 | 28.2s | 28.2s | under ceiling, untouched |

**Self-scored max in-scope gap: ~33s** (across the protected crayon close);
next worst ~30s (across the protected homework). All four mandated >50s gaps
at/after Scene 9 are fixed; density target (a candidate every 25–30s, max
≤50s) met everywhere in scope. **New kid-graded STRONG candidates added:
~30.**

**My own worst remaining gaps, flagged:** (1) the ~75s pre-s9 residual —
unfixable without touching out-of-scope Scenes 6–8; (2) ~33s across s30 —
protected on purpose; (3) ~30s across s12 — protected on purpose; (4) the
s28b2 breathing hold is a deliberate 1.5s of nothing inside the race — it is
the mandate's "room", not a sag, but it is the one place a six-year-old could
feel slow (Treatment B flagged the same and the synthesis kept it).

---

# TRIM MENU

Priced, least damage first (the synthesis memo's list, carried):

| Cut | Where | Saves |
|---|---|---|
| Drip "He is very you." (`a1_49b`) | s11 | −3s |
| Blue interlock tag (`a2_44b`) | s22 | −2s |
| "Great echo, Indigo!" (`a3_13cd`) | s28 | −2s |
| Copy-me pair (`a2_09b`/`a2_09c` + 20f) | s15 | −5s |
| Green course appraisal (`a3_11b`) | s27 | −5s |
| s28b2 breathing hold 45f → 30f | s28b2 | −0.5s |
| **Total available** | | **−17.5s** |

**Non-trimmable, stated plainly:** the start line (s27b), every exit scene
(s28/s28b additions), and s28b2 as a whole — they are the mandate. Also not
on the menu, from the shipped cut's own list: `a2_24b_red` and Scene 12.

---

# CONSTRAINT COMPLIANCE CHECKLIST

Verified line by line against THIS draft (Treatment B's form; rulings G8).

- **Violet: zero lines, zero clips, forever.** All new firings are wordless —
  the s10 mid-wave freeze, s20 bouncing-harder-when-cheered, the s27b racer
  warm-up and "Six racers./Make that seven." head-count, the sacred silent
  race exit, the recap wave. No `Speaker` wiring, no bubble, ever. ✓
- **One emotion per colour, existing casting only.** Every new Red/Orange/
  Green line is `calm`; every Blue/Indigo/Yellow line is `happy`; pitches
  +2/+3 unchanged; speeds 0.9/0.95/1.0/0.95/1.05/1.1 unchanged; Ray `auto`
  on all new lines (no stage direction asks for seasoning); Drip `happy`.
  No new voice, no new emotion, anywhere. ✓
- **Physics honesty.** No "smaller", no "never bounces" in any new line.
  Exit order = spectrum order unchanged: Blue → Indigo → Violet (leg one) →
  Green → Yellow (leg two) → Red + Orange finish. Every exit bounces **UP**
  and is framed as a win ("I am winning UPWARDS!", "He does win the sky.",
  the decorated-sky picture in s28b2) — nothing taken away. `a3_14g`
  mid-spectrum line verbatim; honest violet answer (s20) untouched; Moon
  control (s34) untouched. ✓
- **Sunny: no verdict; ceilings intact.** s23 untouched; ep-4 bank
  untouched; his one new line (`a3_11v`, ruling G6) uses no "You're
  welcome!"/"HA! HA!" (ceiling stays at seven firings) and no "EXCUSE ME";
  he is the start line, then scenery. ✓
- **Volcano rule.** No line about it anywhere; the s28b 45f one-eye beat is
  empty exactly as shipped (Yellow's self-cheer moved a full scene away);
  `a3_14i` still addressed to Yellow; the s35 stir untouched. ✓
- **Six sacred holds, all empty:** s1 crayon choice, s9 seven-reveal 60f,
  s23 "He has a point." 45f/36f, s28b volcano eye 45f, s31 world-turn 75f,
  s34 lunar sky 60f. Nothing new lands inside any of them. ✓
- **Roll-call shape, both firings.** s10: names (one 0.88 clip, movement
  replies as shipped) → volley in the MIDDLE → flat narrator line → 24f →
  unbothered button, nothing between `a1_43` and `a1_44`. s28 goodbye:
  untouched, all new lines land before `a3_14`, nothing inside
  `a3_14b`→`a3_14d`. The volley is this episode's fresh variant. ✓
- **Line length ≤15 words.** Longest new line is 10 ("I will win! I am the
  fastest one there is!"). Bubbles ≤6 words; every line over six words that
  needs one carries a summary bubble, noted inline. ✓
- **Tail rule, every Indigo line** (all eleven, old and new): "I was first."
  / "Copy me." / "Got here first." / "And here. And here." / "Said that." /
  "What I say." / "That was me." / "The fastest one there is." / "Too slow.
  Sorry." / "Going up now. Bye." / "Winning upwards." / "That is me." —
  each is the tail of the Blue line before it; he never gets a sentence of
  his own. ✓
- **sameAs discipline.** Every repeated-text gag is one recording:
  "I just said that!" ×4, "What Red said." ×3, "This is a nice spot." ×3,
  "He meant to." ×2, "No." ×2 — plus the five pre-existing shared
  recordings, untouched. No repetition gag is ordered twice. ✓
- **Yellow is "she"** (ruling G5) — throughout this document; script.md's
  stray "he"s get the consistency sweep at implementation. ✓
- **Per-engine sound words.** No stretched vowels on any MiniMax line;
  emphasis all-caps only; no pause markers anywhere in the episode (still
  true); kokoro sound-words unchanged. ✓
- **Tone.** Blue's taunt carries its own apology; every exit is a triumph;
  nobody mocked, no peril; the sunset never reads as the light dying (Red is
  delighted, in his flat way, and still walking). ✓
- **Out of scope respected.** Scenes 1–8 untouched; cast, pedagogy lines and
  all protected scenes (s12, s16, s23, s24, s30, s31, s33–s35) untouched. ✓

---

# SUMMARY

- **Runtime:** ≈ 16:51 (1,011s; range 16:35–17:05), inside the G1 target;
  race proper ≈ 3:55 over five legs. Trim menu holds −17.5s if needed.
- **Max in-scope gap:** ~33s (protected crayon close); all mandated >50s
  gaps fixed.
- **New material:** 73 paid MiniMax recordings + 10 free kokoro + 9 sameAs
  aliases ≈ **$0.24**; one kokoro line retired (`a3_12b`).
- **Locked jokes, verbatim as ordered:** "I am winning UPWARDS!", "Start of
  what.", "He meant to.", "Great bounce, me!".

**Deviations from the synthesis memo, flagged:**

1. **`a3_11j_blue` "Red! Wait! It has not started yet!" is retained** from
   Treatment B's s27b even though the synthesis beat list does not name it —
   "Start of what." needs its prompt to parse, and the memo's own rule is
   "where silent, prefer the treatment named for that act" (B for act 3).
2. **`a3_12b_narrator` is retired outright** rather than reworded in place:
   the synthesis says the s27b open "evolves `a3_12b`", and moving the key
   itself into s27b would break the file's strict key-order convention, so
   the substance moves into the new key `a3_11c` and the old key is deleted
   (kokoro — free).
3. **Two-letter key suffixes in leg one** (`a3_13aa`, `a3_13ab`, `a3_13bb`…)
   — the only place an insertion falls between two already-lettered keys;
   lexical order still equals playback order, and nothing is renumbered.
4. **s28b2 booked at ~28s** against the memo's ~32s — same beats, tighter
   clip estimates; the difference is measurement, not a cut.

