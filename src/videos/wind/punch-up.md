# Puff and the Kite That Wouldn't Fly — comedy punch-up

**Status: APPLIED, 2026-07-28.** All ten changes (C1–C10) are wired into
`narration.mjs`, `Video.tsx`, `scenes/act2.tsx`, `scenes/act3.tsx`,
`scenes/recap.tsx` and `script.md`. This file is kept as the reasoning behind
them — the density map in §1 in particular, which is the method rather than the
result. Where the built version departs from what is written below, `script.md`
is the source of truth and the departure is noted there. Two things did:
Sunny went back to kokoro `am_puck` in the same pass (see §3 — the recast this
document was written around was reversed, not completed), which shortened
thirteen existing lines and brought the measured delta to **+41s, 11:39 →
12:20** rather than the +51.4s estimated here; and Scene 16's Cloud Hotel had
to be re-planned around the rule stamp, which stays on screen and owns the top
third of the frame.
**Trigger:** first six-year-old watch of the finished cut (Claire, 2026-07-28).
Engaged at the start, loved the roll call, and: *"it didn't have enough funny
moments."* Engagement sagged.
**Budget:** ≤60s of added runtime. This proposal spends **+51.4s** (est.), with
three items marked droppable if it needs to come in lighter.
**Constraint:** every pedagogy beat survives. Facts may be re-housed in funnier
staging; nothing is cut.

---

## 1. Density map

Timestamps are computed from `narrationManifest.ts` + `Video.tsx` gaps and
tails (cumulative, ±5s against the delivered cut). "Laugh" is graded for the
six-year-old, not the grown-up — a beat that only a parent smirks at is marked
*(adult)*.

| # | Scene | Starts | Len | Laugh beats | Grade |
|---|---|---|---|---|---|
| 1 | s01_hill | 0:00 | 25.2 | the flop + "Hmm." | small, physical |
| 2 | s02_title | 0:25 | 9.3 | — | — |
| 3 | s03_grass | 0:35 | 17.1 | "Hello, everybody! It's me!" → "Sorry." | small |
| 4 | s04_beetle | 0:52 | 16.9 | **repetition gag, firing 1** | **LAUGH** |
| 5 | s05_leaf | 1:09 | 16.5 | **repetition gag, firing 2** | **BIG** |
| 6 | s06_nothing | 1:25 | 20.2 | — (deliberately sad) | — |
| 7 | s07_dandelion | 1:45 | 19.9 | Puff swelling comically round | small, visual |
| 8 | s08_your_hand | 2:05 | 16.5 | — (homework) | — |
| 9 | s09_balloon | 2:22 | 18.4 | Puff squashed balloon-shaped, "Oof. Oof!" | small–mid, visual |
| 10 | s10_bigword_air | 2:40 | 16.4 | — (chant) | — |
| 11 | s11_not_sorry | 2:56 | 10.7 | **"Not sorry." [beat] "Sorry."** | **LAUGH** |
| 12 | s12_sunny | 3:07 | 16.6 | Sunny's entrance; "He remembers himself constantly" *(adult)* | mid |
| 13 | s13_rock | 3:24 | 20.8 | **the rock, the moose-heir** | **LAUGH** |
| 14 | s14_ground_heats | 3:44 | 18.3 | "Puff does not have feet." | small, narrator deadpan |
| 15 | s15_up | 4:03 | 27.6 | **the roll call** (lands ~4:20) | **BIGGEST** |
| 16 | s16_rule | 4:30 | 12.3 | — | — |
| 17 | s17_big_empty | 4:43 | 15.4 | "Oops. Sorry about the hole." | tiny |
| 18 | s18_fwoosh | 4:58 | 13.1 | — (pure wonder) | — |
| 19 | s19_bigword_wind | 5:11 | 15.7 | — (chant) | — |
| 20 | s20_am_i_the_wind | 5:27 | 13.0 | "a hundred million friends" *(adult)* | — |
| 21 | s21_sunny_correct | 5:40 | 30.4 | Sunny's brag; "I checked. Then I checked again." *(adult)* | mid, **one laugh in 30s** |
| 22 | s22_not_sorry | 6:10 | 12.7 | callback shape only | tiny |
| 23 | s23_beach | 6:23 | 15.4 | "I have never been ANYWHERE!" | small |
| 24 | s24_hot_sand | 6:38 | 21.7 | "Ow. Ow ow ow." | small, physical |
| 25 | s25_beach_wind | 7:00 | 19.4 | "I know this bit!" (recognition, not a laugh) | — |
| 26 | s26_sea_breeze | 7:19 | 21.7 | **Sunny drive-by + "Him again."** | **LAUGH** |
| 27 | s27_sailboat | 7:41 | 16.7 | "I am a BOAT ENGINE!" (enthusiasm) | small |
| 28 | s28_turbines | 7:58 | 19.4 | "I MAKE LIGHTBULBS!" (enthusiasm) | small |
| 29 | s29_seeds | 8:17 | 20.5 | — (emotional) | — |
| 30 | s30_door_to_door | 8:38 | 22.5 | **Cloudia + Drip cameo** | **LAUGH** |
| 31 | s31_the_hill | 9:00 | 26.3 | — (payoff, correctly) | — |
| 32 | s32_can_see | 9:27 | 20.5 | firing 3 — satisfying, not funny | — |
| 33 | s33_chant | 9:47 | 27.7 | "That is also me!" | tiny |
| 34 | s34_all_four | 10:15 | 10.8 | — | — |
| 35 | s35_mind_blower | 10:26 | 22.2 | — (pure awe) | — |
| 36 | s36_tease | 10:48 | 20.1 | **"Sunny has a theory. It is wrong." / "Wait. What?"** | **LAUGH** |

### The three sags

- **SAG A — 4:28 → 5:40 (72s).** From the end of the roll call to Sunny's
  return. Six scenes (16–20 plus the tail of 15) carrying the rule, the Big
  Empty, the FWOOSH, the WIND card and the "Am I the wind?" correction, with
  exactly one joke in them: "Oops. Sorry about the hole." This is the
  mechanism's densest stretch and its funniest character (Sunny) is offstage
  for all of it and Cloudia has not appeared in the act at all.
- **SAG B — 7:35 → 8:45 (70s).** From Sunny's sea-breeze drive-by to Cloudia's
  entrance. The sailboat and the turbines are Puff being *enthusiastic*, which
  is not the same as funny, and the seeds are deliberately emotional.
- **SAG C — 8:53 → 10:48 (115s), the longest.** From Drip's cameo to the tease.
  Scenes 31, 32, 33, 34 and 35 run on payoff, chant and awe. Ep 1 has a laugh
  in exactly this slot (Scene 32, "Say the magic words." / "You're welcome?" /
  "HA! HA! Good drop.") and again in its mind-blower (Drip: *"That is the
  coolest thing anybody has ever said about me!"*). Ep 2 has neither.

### The number

Ep 1 (9:33) lands a laugh beat roughly **every 22–25s** and never goes more
than ~45s without one. Ep 2 (11:08) lands one roughly **every 50s** and has
three stretches over 70s. Claire's note is not a taste difference; it is a
measurable halving of gag density in a longer episode.

### Diagnosis — verified against the text, and refined

The brief's diagnosis holds and the text makes it sharper than "act 2 needs
jokes":

- **Ep 1's mechanism act is its *funniest* act.** Act Two of water-cycle —
  altitude, condensation nuclei, cloud albedo, mass vs buoyancy — contains the
  pillow myth-bust, "You are the wallpaper", **Kevin**, "We are at! Full!!
  Capacity!!!", "Rude. I was shining SO nicely." and "I love my guests. I hate
  gravity." Every one of those *is* a fact. Cloudia's hotel-management stress
  is literally condensation and cloud growth; she cannot be separated from the
  pedagogy.
- **Ep 2's mechanism act is its *least* funny.** Act Two of wind is carried by
  the Narrator explaining a (genuinely excellent) crayon diagram to an earnest
  Puff. The two comedians are absent: Cloudia never appears in Act Two at all,
  and Sunny is on screen for scene 12–13 and then vanishes until 21.
- **The specific failure mode is that Puff is a *reactor*, not a comedian.**
  His Act Two lines are "Ooh, that is toasty", "Wait, I am going UP!", "Whoa!
  Who are all these guys?", "Hold on. Am I the wind?" — all of them the
  audience's line said for them. That is good pedagogy and zero comedy. Ep 1
  gave Drip an *attitude* to the facts ("I am the best at it QUIETLY",
  "Everybody wants a bit of me! I am very popular!"); Puff mostly has awe.
- **Corollary:** the fix is not jokes on top. It is (a) put the two comedians
  back inside the mechanism scenes and let them *deliver the facts*, and (b)
  give Puff two or three attitudes instead of only wonder. Every change below
  is one of those two moves.

---

## 2. The punch-up

Ten changes, C1–C10. Each gives the slot, the lines in `script.md` format, the
`narration.mjs` entry shape (engine / emotion / speed), the held beats, the
runtime cost, and what it costs the builder.

Key naming follows the established convention: an insertion takes the
preceding key plus a letter (`a2_19b`, `a3_32b` precedent). **Cameo keys keep
the `_narrator` suffix** — per the 2026-07-27 note, that suffix means "not one
of the four principals" and the staged speaker is a `SPEAKER_VISUAL` /
`useStage` override, not something derived from the key.

---

### C1 — Sunny brackets the ground-heating fact (Scene 14)

**Slot:** inside `s14_ground_heats`, one line after `a2_11_narrator` and one
after `a2_12_narrator`.
**Why:** this is the episode's most surprising fact and its most
narrator-only scene, and the fact is *about Sunny*. Ep 1's trick, applied
exactly: the mechanism arrives through the funny character. It also
pre-plants Scene 21's causal chain, so the big brag lands as a callback.
**Staging note:** Scene 14 already draws a `CrayonSun` at `S14_SUN`. Sunny
speaks *from the diagram* — the crayon sun turns, opens an eye and objects.
That is a joke in itself and costs no new set.

> ### Scene 14 — The ground does the heating *(revised)*
> **On stage:** Narrator, Puff, Sunny (as the diagram's own crayon sun)
> **Visual:** unchanged — cross-section, arrows down, ground glowing, wiggly
> arrows up, Puff pink at the edges. **New:** on `a2_11b_sunny` the crayon
> sun in the corner rotates to face camera, grows a face and objects. It
> stays a crayon drawing throughout; it never becomes the real Sunny.
> **Lines:** `a2_11_narrator`, **`a2_11b_sunny`**, `a2_12_narrator`,
> **`a2_12b_sunny`**, `a2_13_puff`, `a2_14_narrator`
>
> > **NARRATOR:** Now here is the important bit. The sun does not warm the air very much.
> > **SUNNY:** EXCUSE ME. I warm EVERYTHING.
> > **NARRATOR:** The sun warms the GROUND. And then the warm ground warms the air.
> > **SUNNY:** So I DO warm everything! Through the GROUND! HA! HA!
> > **PUFF:** Ooh. Ooh, that is toasty. I can feel it on my feet.
> > **NARRATOR:** Puff does not have feet. Puff was enjoying himself.

**Bubbles:** Sunny `"I warm EVERYTHING!"` (3 words) and `"Through the GROUND!"`
(3 words).
**Held beats:** none new. Do **not** add one — the joke is the interruption
landing on the beat, and a gap here would fight `a2_14`'s existing button.
**narration.mjs:**

```js
// Scene 14: the fact is about him, so he gets to be wrong about it for one
// line and then right about it forever. "auto" for the interruption — the
// same call as a2_39_sunny; nothing marks it as anger and nobody in this show
// is unkind.
a2_11b_sunny: { text: "EXCUSE ME. I warm EVERYTHING.", ...SUNNY },
// The brag, and the causal chain in six words. Pre-plants a2_41.
a2_12b_sunny: {
  text: "So I DO warm everything! Through the GROUND! HA! HA!",
  ...SUNNY,
  emotion: "happy",
},
```

**Pedagogy:** strengthened, not preserved. "Sunlight passes through air, the
ground absorbs it, the ground heats the air" is now said twice — once as a
fact and once as a boast — and the boast is the version a six-year-old will
repeat. **Sunny is still never wrong**: he does warm everything, via the
ground, and he says so.
**Runtime:** +7.3s. **Staging:** light–medium.

---

### C2 — Cloudia in Act Two (Scene 16)

**Slot:** `s16_rule_warm_air_rises`, three lines between `a2_21_puff` and
`a2_22_narrator`.
**Why:** the brief's highest-value ask and the one this document most agrees
with. Cloudia is the series' proven mechanism-comedian and Scene 16's rising
shot is her sky. It also does three jobs at once:
1. It is the joke *and* the lesson — the hotel is **full** because all the
   warm air went up, which is precisely `a2_22_narrator`'s point ("every warm
   puff on that whole hill was going up with him") made as a picture.
2. It ties the two episodes' mechanisms together: this is *how Drip got to the
   Cloud Hotel*. "Warm air rises" is the missing first step of episode one.
3. It sets up Scene 30 — Puff goes *past* her at 4:35 and *pushes* her at
   8:40, so the favour reads as a friendship rather than a cameo.

Scene 16 is currently the thinnest scene in Act Two (12.3s, three lines, zero
gags) and its visual is already "the shot keeps rising behind" the stamp, so
there is a moving background for her to arrive in.

> ### Scene 16 — The rule *(revised)*
> **On stage:** Narrator, Puff, Cloudia
> **Visual:** Unchanged for the first two lines — the **WARM AIR RISES**
> stamp thumps on over a rising shot with a looping upward arrow, Puff riding
> it. Then the rise carries the frame up into the thin high cloud band, and
> the Cloud Hotel awning, brass bell and hand-lettered sign slide down past
> Puff. Cloudia is leaning out over the awning with her clipboard. She is
> *packed* — drop-faces jammed in every window behind her. Puff never stops
> rising: he goes past her, still climbing, and she is out of frame by the
> Narrator's last line. **The stamp stays on screen through all of it.**
> **Lines:** `a2_20_narrator`, `a2_21_puff`, **`a2_21b_cloudia`**,
> **`a2_21c_puff`**, **`a2_21d_cloudia`**, `a2_22_narrator`
>
> > **NARRATOR:** Warm air rises. Say it with me. Warm air rises.
> > **PUFF:** Warm air RISES! And I am the warm air!
> > **CLOUDIA:** No vacancies, darling! We are FULL!
> > **PUFF:** Cloudia! I am not staying! I am going PAST!
>
> **HELD BEAT — 24f (0.8s) after `a2_21c_puff`.** Cloudia watches him go up
> past the awning. She does not follow him with her head; she looks at the
> camera. **Nothing enters this beat** — no bell, no clipboard move, no
> emotion change. Deadpan is stillness.
>
> > **CLOUDIA:** They all say that, darling.
> > **NARRATOR:** Every warm puff on that whole hill was going up with him.

**Bubbles:** Cloudia `"No vacancies, darling!"` (3), Puff `"I am going PAST!"`
(4), Cloudia `"They all say that."` (4).
**narration.mjs:**

```js
// Scene 16: Cloudia's one Act Two appearance. The hotel is full *because*
// warm air rises, which is a2_22_narrator's point made as a picture — and it
// is the missing first step of episode one's Cloud Hotel.
// "auto" rather than the `angry` imperious read approved for a3_38: she is
// grand at a passing stranger, not making a demand. If it plays flat, `angry`
// is the alternate and the words already carry it.
a2_21b_cloudia: { text: "No vacancies, darling! We are FULL!", ...CLOUDIA },
// Mid-lift, still delighted — the same seasoning a2_19 and a2_21 carry.
a2_21c_puff: {
  text: "Cloudia! I am not staying! I am going PAST!",
  ...PUFF,
  emotion: "happy",
},
// The button, and deliberately NOT seasoned — same call as a2_19d_puff and
// a1_43_puff. The laugh is in the 24f of silence in front of it. Slowed
// slightly so the deadpan has weight.
a2_21d_cloudia: {
  text: "They all say that, darling.",
  ...CLOUDIA,
  speed: 0.95,
},
```

**Pedagogy:** untouched and extended. The rule is still stated, chanted and
generalised in that order; Cloudia's fullness is a second illustration of
"this is happening to *all* the warm air".
**Cast-table consequence:** Cloudia's row in `script.md` must change from
"Returning for one scene" to "two scenes" and the running-gag ledger gains a
`darling` entry.
**Runtime:** +9.8s. **Staging:** heavy (the only heavy item in this
document) — a Cloud Hotel silhouette that parallax-scrolls down through the
`HIGH_WISPS` band, plus Cloudia's body, plus a `SPEAKER_VISUAL` entry. The
hotel asset exists nowhere in this episode; Scene 30's Cloudia does. Budget
this as a scene rebuild, not a tweak. **The parallax lesson from the roll call
applies again: a shot that gets longer needs its world checked** — Scene 16's
rising band has to still have something in it at the new end.

---

### C3 — Puff apologises to the hole, and the hole declines to comment (Scene 17)

**Slot:** `s17_big_empty`. `a2_25_puff` is **replaced** (same key, new text);
one Narrator line inserted after it.
**Why:** the brief asked whether the "Sorry" arc could get one absurd
escalation, and whether he already apologises to the gap. He does not — the
current line is thrown over his shoulder to nobody ("Oops. Sorry about the
hole."). Making him address the hole *directly*, and then giving the Narrator
the ep-1 moose button ("The moose did not move. Moose rarely do."), is the
confirmed-hit gag type landing on the episode's most important image.

It is also, quietly, the misconception-buster: the whole scene exists to make
a six-year-old believe an empty space is a *thing*. A character talking to it
and a narrator treating it as a person who chose not to reply is that idea,
told as a joke.

> ### Scene 17 — The Big Empty *(revised lines only)*
> **Lines:** `a2_23_narrator`, `a2_24_narrator`, `a2_25_puff`,
> **`a2_25b_narrator`**, `a2_26_narrator`
>
> *(`a2_23_narrator` and its 45f held beat are unchanged — do not touch that
> beat, it is the one that makes the gap visible at all.)*
>
> > **NARRATOR:** Puff left a gap. An empty space, exactly Puff shaped.
>
> **New staging:** Puff, far above, turns round in mid-air and calls back
> *down* at the hole, both hands cupped. The hole is centre frame and fills
> most of it; he is a speck at the top.
>
> > **PUFF:** Sorry, hole! I did not mean to leave!
>
> **HELD BEAT — 24f (0.8s) after `a2_25_puff`.** The hole. Nothing happens.
> The grass leans in around its edge and does not move. **Nothing enters this
> beat.**
>
> > **NARRATOR:** The hole did not answer. Holes rarely do.
> > **NARRATOR:** And air does not like a gap. Not one bit.

**Bubble:** Puff `"Sorry, hole!"` (2 words).
**narration.mjs:**

```js
// TEXT CHANGED (was "Oops. Sorry about the hole."). Still "auto", still the
// second-to-last apology of the episode, still sheepish rather than sad — the
// `sad` run ended in Act One. He is now addressing the hole, which is the
// joke and also the scene's whole idea: an empty space is a thing.
a2_25_puff: { text: "Sorry, hole! I did not mean to leave!", ...PUFF },
// The button. Deliberate rhyme with episode one's moose ("The moose did not
// move. Moose rarely do.") — the narrator deadpanning about obvious behaviour
// is the only ironic register this show allows, and this is the same joke in
// the same words five months later. Slowed for the deadpan.
a2_25b_narrator: {
  text: "The hole did not answer. Holes rarely do.",
  ...NARRATOR,
  speed: 0.95,
},
```

**Apology ledger:** unchanged at Act One nine / Act Two two / Act Three zero.
`a2_25` is still one apology, just a funnier one.
**Runtime:** +5.1s (net of the 2.16s clip it replaces). **Staging:** light.
**Cost note:** `a2_25_puff` is a MiniMax re-synthesis (~$0.01).

---

### C4 — One of them came in backwards (Scene 18)

**Slot:** `s18_fwoosh`, one Narrator line after `a2_30_narrator`.
**Why:** the brief's ask for physical comedy inside the FWOOSH, done in a way
that *reinforces* the sideways pedagogy instead of diluting it. The rush is
currently 13.1s of pure wonder and it is the first time the audience sees
wind.
**Deliberately not done:** giving the cool puff a line. A ninth voice for one
gag is affordable but "Sorry!" belongs to Puff's arc and handing it to a
stranger dilutes the count that *is* the character development.

> ### Scene 18 — FWOOSH *(revised — one added line, one added visual)*
> **Visual addition:** during the existing **36f held beat** after
> `a2_28_narrator`, one of the fifty-odd cool puffs comes in **facing the
> wrong way** — back first, face pointing out of frame — overshoots the gap
> entirely, skids to a stop on the far side, and has to reverse back in. It
> arrives last, settles into the gap upside down, and *stays that way for the
> rest of the scene*. (A background gag that vanishes mid-shot reads as a bug
> — 2026-07-26 volcano note.)
> **Lines:** `a2_27_narrator`, `a2_28_narrator`, `a2_29_puff`,
> `a2_30_narrator`, **`a2_30b_narrator`**
>
> > **PUFF:** Whoa! Who are all these guys?
> > **NARRATOR:** Cool air. In a very big hurry.
>
> **HELD BEAT — 24f (0.8s) after `a2_30_narrator`.** Hold on the backwards
> puff, which does not fix itself.
>
> > **NARRATOR:** One of them came in backwards.

**narration.mjs:**

```js
// The button on the FWOOSH's one physical gag. Flat, slow, and about
// obviously silly behaviour — the permitted deadpan register. Kokoro, so it
// re-times for free if the line is reworded.
a2_30b_narrator: {
  text: "One of them came in backwards.",
  ...NARRATOR,
  speed: 0.9,
},
```

**Pedagogy:** unharmed. The overshoot is *horizontal* travel exaggerated —
the puff comes in sideways so fast it goes past. If anything it makes the
direction more legible.
**Runtime:** +3.2s. **Staging:** light–medium (the `COOL_PUFFS` crowd exists;
this needs one scripted individual with its own path and rotation).
**Droppable:** yes. The visual gag alone costs 0s; the line is what makes it
read as a joke rather than a rendering error, so drop them together or not at
all.

---

### C5 — The roll call fires a second time (Scene 20)

**Slot:** `s20_am_i_the_wind`, two lines after `a2_38_narrator`.
**Why:** Claire named the roll call as the thing she loved. It fires once. The
"Am I the wind?" scene is already the natural deadpan-button spot the brief
identified, it already ends on a scale line ("about a hundred million
friends"), and its visual is already *hundreds of identical puffs circulating*
— the exact picture the roll call was built on. This is the cheapest big laugh
available in the episode: two lines, no new staging, and it re-fires the
audience's favourite joke on a wide shot that is already on screen.

> ### Scene 20 — Am I the wind? *(revised — two added lines)*
> **Visual:** unchanged through `a2_38_narrator` — pull back until Puff is one
> dot in a pattern covering the whole hillside. **New:** on the held beat he
> turns his head slowly across the whole crowd, taking it in.
> **Lines:** `a2_35_puff`, `a2_36_narrator`, `a2_37_puff`, `a2_38_narrator`,
> **`a2_38b_puff`**, **`a2_38c_narrator`**
>
> > **PUFF:** So when I move, everybody gets wind. Because of me.
> > **NARRATOR:** Because of you. And about a hundred million friends.
>
> **HELD BEAT — 30f (1.0s) after `a2_38_narrator`.** Puff looks out across
> the whole turning circuit. Nothing else moves in the foreground.
>
> > **PUFF:** Are they all called Puff?
>
> **HELD BEAT — 30f (1.0s) after `a2_38b_puff`.** **Nothing enters this.**
> No reaction, no bob, no emotion change — the crowd keeps circulating behind
> him and he waits.
>
> > **NARRATOR:** Yes.
>
> **Scene tail: 40f** (was 32f). One flat word needs somewhere to land — same
> call as `a3_20_narrator` ("Him again.").

**Bubble:** Puff `"Are they all called Puff?"` (5 words).
**narration.mjs:**

```js
// Second firing of the roll call, five minutes after Scene 15's — the shape
// episode one proved (beetle/leaf/Scene 32) applied to the gag the audience
// actually asked for more of. Genuine question, so "auto"; slowed a touch so
// it reads as a thought rather than a punchline being set up.
a2_38b_puff: { text: "Are they all called Puff?", ...PUFF, speed: 0.95 },
// One word, flat, after a full second of silence. Kokoro. Do not add a
// second sentence to this line; the whole joke is that there is not one.
a2_38c_narrator: { text: "Yes.", ...NARRATOR, speed: 0.9 },
```

**Pedagogy:** unharmed and slightly helped — "all of them are Puffs" is the
same scale correction `a2_38_narrator` makes, restated as a picture.
**Runtime:** +5.0s. **Staging:** none-to-light.

---

### C6 — Puff sees it coming (Scene 21)

**Slot:** `s21_sunny_correct`, one line between `a2_41_sunny` and
`a2_42_sunny`.
**Why:** 30.4s — the longest scene in the episode — with one laugh in it, and
twelve of those seconds are Sunny reciting the causal chain while Puff stands
silent. Puff has now heard three brags. Letting him *predict* the fourth is
a kid-legible anticipation gag, and it makes `a2_42` ("SO I MAKE ALL THE
WIND") land as a payoff rather than as more shouting.

> ### Scene 21 — Sunny, insufferably, correct *(revised — one added line)*
> **Lines:** `a2_39_sunny`, `a2_40_puff`, `a2_41_sunny`, **`a2_41b_puff`**,
> `a2_42_sunny`, `a2_43_sunny`, `a2_44_narrator`, `a2_45_narrator`
>
> > **SUNNY:** I warm the ground! The ground warms the air! The air goes UP!
> > **PUFF:** Oh no. He is going to say it.
> > **SUNNY:** SO I MAKE ALL THE WIND. EVERYWHERE. ON THE ENTIRE PLANET.
>
> **Staging:** Puff says it to camera, small, at the bottom of frame, while
> Sunny's diagram assembles behind him. He does not look at Sunny. The
> existing 45f beat after `a2_44_narrator` is untouched.

**Bubble:** Puff `"He is going to say it."` (6 words — at the limit; if the
component warns, use `"He's going to say it."`).
**narration.mjs:**

```js
// Scene 21: Puff's only attitude line in Act Two, and an anticipation gag —
// the audience has heard three brags and is ahead of him. Deliberately NOT
// seasoned: he is reporting an inevitability, not performing dread.
a2_41b_puff: { text: "Oh no. He is going to say it.", ...PUFF },
```

**Tone check:** not unkind — Puff is not mocking Sunny, he is bracing. The
Narrator's two concessions still make Sunny right, twice.
**Runtime:** +3.4s. **Staging:** none (Puff is already in frame; one bubble).

---

### C7 — "Same me!" (Scene 24)

**Slot:** `s24_hot_sand_cool_sea`, one line after `a3_09_narrator`. The
existing 24f held beat **moves** from `a3_09_narrator` to `a3_09b_sunny` so
the thermometers still get their silence.
**Why:** the best ratio in this document — roughly 1.3 seconds for a real
laugh. And the joke is the lesson: the pedagogy of the scene is that *the sun
is the control variable* and the surfaces are what differ. "Same sun" is the
line that does that work, and handing Sunny a two-word interruption on it is
the ep-1 trick in its smallest possible form.

> ### Scene 24 — Hot sand, cool sea *(revised — one added line)*
> **Visual addition:** on `a3_09b_sunny`, Sunny leans in from the top of the
> split screen — *over the seam*, one half of his face in each panel, which
> is the visual argument — and is gone by the held beat.
> **Lines:** `a3_05_narrator`, `a3_06_puff`, `a3_07_narrator`, `a3_08_puff`,
> `a3_09_narrator`, **`a3_09b_sunny`**, `a3_10_narrator`
>
> > **NARRATOR:** Same sun. Same morning. Sand hot. Sea cool.
> > **SUNNY:** Same me!
>
> **HELD BEAT — 24f (0.8s) after `a3_09b_sunny`.** *(moved from
> `a3_09_narrator`.)* Both thermometers on screen, Sunny gone, nobody
> talking. The comparison is the fact; let it be looked at.
>
> > **NARRATOR:** Sand heats up fast. Water takes ages and ages and ages.

**Bubble:** Sunny `"Same me!"` (2 words).
**narration.mjs:**

```js
// Two words, and they are the scene's control variable. The sun is identical
// over both halves; the surfaces are not — which is the whole of differential
// heating. Fifth firing of the interrupt gag.
a3_09b_sunny: { text: "Same me!", ...SUNNY, emotion: "happy" },
```

**Runtime:** +1.3s. **Staging:** light (Sunny already leans into frame in
Scene 26; the pose is reusable).

---

### C8 — The boat does not move (Scene 27)

**Slot:** `s27_sailboat`, two lines before `a3_24_puff`. **`a3_24_puff`
survives unchanged** — this is a try-fail-succeed built *in front of* the
existing clip.
**Why:** the sailboat and the turbines are the flattest comedy stretch in Act
Three (SAG B), and this is physical comedy a six-year-old reads instantly. It
also does something structural for free: Puff's small push and then his big
push rehearse Scene 31's **PUSH!**, so the ending's biggest moment now has a
comic setup five minutes earlier using the same word.

> ### Scene 27 — The sailboat *(revised — two added lines, one held beat)*
> **Visual:** unchanged staging. **New:** on `a3_23b_puff` Puff gives the
> most polite little push imaginable — one hand, barely a nudge. The boat
> drifts about an inch. The sail does not so much as twitch. A gull on the
> mast does not wake up. *Then* the braced two-arm shove and the snap.
> **Lines:** `a3_21_narrator`, `a3_22_puff`, `a3_23_narrator`,
> **`a3_23b_puff`**, **`a3_23c_narrator`**, `a3_24_puff`, `a3_25_narrator`,
> `a3_26_puff`
>
> > **NARRATOR:** Push the boat, Puff.
> > **PUFF:** Okay, boat. Push.
>
> **HELD BEAT — 30f (1.0s) after `a3_23b_puff`.** The boat travels about an
> inch and stops. The sail hangs. Nothing else happens. **Nothing enters this
> beat.**
>
> > **NARRATOR:** Bigger, Puff.
> > **PUFF:** Okay, boat. PUSH!

**Bubbles:** Puff `"Okay, boat. Push."` (3 words) — deliberately the *same*
bubble text as `a3_24_puff`'s, drawn small, so the second one can be drawn
huge. That is the whole gag in the medium a pre-reader reads fastest.
**narration.mjs:**

```js
// The polite version. "auto", quiet, and short — this is the same sentence
// a3_24 says at full volume, which is the joke. Do NOT season it; a timid
// read sells the gag and a played one kills it.
a3_23b_puff: { text: "Okay, boat. Push.", ...PUFF },
// Two flat words from the Narrator. Kokoro.
a3_23c_narrator: { text: "Bigger, Puff.", ...NARRATOR, speed: 0.95 },
```

**Arc check:** no apology. The Act Three count stays at zero — Puff is not
sorry the small push failed, he just does a bigger one.
**Runtime:** +3.9s. **Staging:** light.

---

### C9 — The rock is still having the best day of its life (new Scene 32b)

**Slot:** a new micro-scene between `s32_what_they_can_see` and `s33_chant`.
**Why:** three reasons, and it is the change this document would fight hardest
for after C5.
1. **It fills SAG C**, the episode's longest gagless stretch (115s), at
   exactly the point ep 1 puts a laugh — Scene 32 of water-cycle ("Say the
   magic words." / "You're welcome?" / "HA! HA! Good drop.") sits in precisely
   this slot, between the emotional close and the recap.
2. **It is the confirmed-hit gag type.** The rock is the moose's heir and it
   fires once. Cutting away eight minutes later to check on a character who
   has done absolutely nothing in the interval is the purest deadpan-stillness
   gag the show has.
3. **The rock's line is free and, better, is the *same recording*.** `sameAs:
   "a2_08_narrator"` copies the clip under a new key: no synthesis, no API
   call, no dice roll — the exact mechanism the 2026-07-27 note built for
   repetition gags on a paid remote model. Identical delivery five minutes
   later is not a nice-to-have here, it is the joke.

> ### Scene 32b — Meanwhile *(new)*
> **On stage:** Rock (Narrator carries the button)
> **Visual:** Hard cut away from the kite hill to **the first hill** — Scene
> 13's exact framing, same angle, same distance, same rock. The light is late
> afternoon now, long and gold, and the heat shimmer is gone. The rock has
> not moved a muscle. One moth crosses the frame. Nothing else in the shot
> moves at all. Cut back out to the kite hill for the recap.
> **Lines:** **`a3_55_narrator`** (staged as the Rock), **`a3_56_narrator`**
>
> > **ROCK:** Ohh yeah. That is the stuff.
>
> **HELD BEAT — 45f (1.5s) after `a3_55_narrator`.** The rock does nothing.
> Its mouth may move on the line; after it, the rock is furniture. **Nothing
> enters this beat** — no moth, no shimmer, no emotion change. Same rule as
> Scene 13, same reason, and the length of the silence is the entire
> mechanism.
>
> > **NARRATOR:** The rock is still having the best day of its life.
>
> **Scene tail: 45f.** Hold on the rock. Then cut to the recap.

**No bubble.** The rock's Scene 13 bubble may be reused verbatim if it had
one; if not, none — the line is enough and the picture is the joke.
**narration.mjs:**

```js
// THE ROCK CALLBACK. Same clip, not a re-recording — `sameAs` shares the
// Scene 13 file byte for byte, which is the rule for any repetition gag on a
// paid remote model (see the beetle, a3_51_narrator). Costs nothing and is
// guaranteed identical, which is what makes it funny.
// Key keeps the `_narrator` suffix: it means "not one of the four
// principals", and the staged speaker is a SPEAKER_VISUAL override.
a3_55_narrator: { sameAs: "a2_08_narrator" },
// The button. a2_10_narrator was "The rock is having the best day of its
// life."; this is the same sentence plus one word, five minutes later —
// the beetle/leaf rule (identical text, identical speed) applied to the
// narrator's own line. Speed matches a2_10's 0.95 exactly.
a3_56_narrator: {
  text: "The rock is still having the best day of its life.",
  ...NARRATOR,
  speed: 0.95,
},
```

**Video.tsx:**

```js
{
  id: "s32b_the_rock_again",
  lines: ["a3_55_narrator", "a3_56_narrator"],
  gaps: { a3_55_narrator: 45 },
  tailFrames: 45,
},
```

**Runtime:** +11.0s (4.28s shared clip + 1.5s beat + ~3.7s button + 1.5s
tail). **Staging:** medium — Scene 13's hill, rock and camera reused with a
late-afternoon grade. `Rock` is a `src/lib/kid/characters` component, so the
work is the plate and the light, not the character.
**Cheaper variant if the budget is tight:** drop `a3_55_narrator` and open
cold on the rock with a 30f lead, narrator button only — about **+6s**, but
it loses the free shared clip, which is the best part.
**Zero-cost alternate placement** (if a new scene is unacceptable at all):
put the rock at the foot of the nearest turbine in Scene 28, lying in the
rotating shadow, blinking once per pass, no lines, continuously visible for
the whole shot. Free, but a much smaller laugh — a background sight gag rather
than a cutaway with a button.

---

### C10 — Puff does Cloudia (Scene 35)

**Slot:** `s35_mind_blower`, one line after `rc_11_puff`. `rc_11_puff` is
**kept** — the awe is the pedagogy and the audience's line said for them.
**Why:** ep 1's mind-blower gives Drip a *joke* on the dinosaur puddle ("That
is the coolest thing anybody has ever said about me!"); ep 2's gives Puff pure
awe and nothing else. This adds the joke without touching the fact, and it
does it by firing Cloudia's catchphrase a third time — out of Puff's mouth. A
six-year-old finds a small character doing a grand character's voice extremely
funny — and the timing is already perfect without moving anything: Cloudia
says "door to door" at `a3_40` (8:45) and again in the chant at `rc_04`
(~10:05), so by 10:40 the audience has heard it twice in the last two minutes
and Puff's third firing is the payoff of a plant the episode laid by accident.

> ### Scene 35 — The mind-blower *(revised — one added line)*
> **Lines:** `rc_08_narrator`, `rc_09_narrator`, `rc_10_narrator`,
> `rc_11_puff`, **`rc_11b_puff`**, `rc_12_narrator`
>
> > **NARRATOR:** It carries that sand all the way across an ocean, and sprinkles it on a rainforest.
> > **PUFF:** Sand. Across a whole OCEAN. In the sky.
>
> **HELD BEAT — 12f (0.4s) after `rc_11_puff`.** Short. Just enough for the
> awe to finish before the joke starts.
>
> > **PUFF:** Door to door, darling.
> > **NARRATOR:** And the trees grow better because of it. That is the wind, doing a job.
>
> **Staging:** on `rc_11b_puff` Puff does a very small version of Cloudia's
> grand two-handed presenting gesture — the one she makes in Scene 30. Nobody
> comments.

**Bubble:** Puff `"Door to door, darling."` (4 words).
**narration.mjs:**

```js
// Third firing of Cloudia's catchphrase, out of Puff's mouth. Deliberately
// NOT seasoned — rc_11 carries the `surprised` awe, and this is the flat
// button after it. If it is played, it is a kid doing an impression badly;
// unplayed, it is a kid doing one perfectly.
rc_11b_puff: { text: "Door to door, darling.", ...PUFF },
```

**Runtime:** +2.1s. **Staging:** none (one bubble, one gesture).
**Droppable:** yes, but it is 2.1 seconds.

---

## 3. Recast note (Sunny)

Sunny's voice is being recast in parallel; `Imposing_Manner` is out. This
proposal writes **four new Sunny lines** (`a2_11b`, `a2_12b`, `a3_09b`, plus
none in C6 — that one is Puff's) and touches scenes containing **six existing
Sunny clips**.

- **New lines are free of the recast.** They will simply be recorded in the
  new voice with everything else.
- **Existing Sunny lines were never going to survive the recast anyway** —
  all ten (`a2_02`, `a2_05`, `a2_39`, `a2_41`, `a2_42`, `a2_43`, `a3_19`,
  `rc_03`, `rc_14`, `rc_16`) regenerate regardless. So there is no reason to
  protect any of them, and if the new voice suggests a better line, take it.
- **Two things to re-check on the new voice**, both from the 2026-07-27 note:
  1. **Sound-word spellings are per engine and per voice.** "HA! HA!" has
     survived two voices; the new one gets an ear before `a2_12b_sunny`
     (which ends on it) is staged.
  2. **`a2_41_sunny` carries the episode's only pause markers** (`<#0.3#>`).
     If the new voice already separates the three links, drop them; if not,
     keep. C6 (`a2_41b_puff`) sits directly after that line and its comic
     timing depends on the three links having landed.
- **Timbre separation matters more now.** C1 puts Sunny two lines from the
  Narrator's crayon-diagram voiceover and C7 puts him one line from her; the
  ep-3 casting note ("timbre separation from Sunny matters for adjacent
  lines") applies to the Narrator here, not just to Ray.

---

## 4. Impact table

Runtime deltas are estimates from the measured per-speaker rates in
`narrationManifest.ts` (Narrator 0.364 s/word, Puff 0.428, Sunny 0.486,
Cloudia 0.460) plus the specified gaps and tail changes. Expect ±15% per line.

| # | Scene | Added | Replaced | Δ runtime | Staging | Existing clips lost |
|---|---|---|---|---|---|---|
| C1 | 14 `s14_ground_heats` | `a2_11b_sunny`, `a2_12b_sunny` | — | **+7.3s** | light–medium (crayon sun gets a face; 2 bubbles; `SPEAKER_VISUAL`) | none |
| C2 | 16 `s16_rule_warm_air_rises` | `a2_21b_cloudia`, `a2_21c_puff`, `a2_21d_cloudia` + 24f beat | — | **+9.8s** | **heavy** (Cloud Hotel in the rising band, Cloudia body, parallax re-check) | none |
| C3 | 17 `s17_big_empty` | `a2_25b_narrator` + 24f beat | `a2_25_puff` (text) | **+5.1s** | light (Puff turns and calls down) | `a2_25_puff` (~$0.01) |
| C4 | 18 `s18_fwoosh` | `a2_30b_narrator` + 24f beat | — | **+3.2s** | light–medium (one scripted backwards puff in the `COOL_PUFFS` crowd) | none |
| C5 | 20 `s20_am_i_the_wind` | `a2_38b_puff`, `a2_38c_narrator` + 30f/30f beats, tail 32→40 | — | **+5.0s** | none–light | none |
| C6 | 21 `s21_sunny_correct` | `a2_41b_puff` | — | **+3.4s** | none (one bubble) | none |
| C7 | 24 `s24_hot_sand_cool_sea` | `a3_09b_sunny`; 24f beat moves to it | — | **+1.3s** | light (Sunny leans over the split seam) | none |
| C8 | 27 `s27_sailboat` | `a3_23b_puff`, `a3_23c_narrator` + 30f beat | — | **+3.9s** | light (a one-inch drift, then the existing shove) | none |
| C9 | **new 32b** `s32b_the_rock_again` | `a3_55_narrator` (`sameAs`), `a3_56_narrator` + 45f beat + 45f tail | — | **+11.0s** | medium (Scene 13 hill re-lit; `Rock` is a lib component) | none — and `a3_55` costs $0 |
| C10 | 35 `s35_mind_blower` | `rc_11b_puff` + 12f beat | — | **+2.1s** | none (one bubble, one gesture) | none |
| | **TOTAL** | **15 new keys, 1 rewritten** | | **+51.4s** | | **1 clip** |

**Episode length:** ~11:08 measured here (docs say 11:40 for the delivered
cut) → **~12:00**. That is over the 10–11 minute target, which was already
knowingly exceeded for the roll call. If the number has to come down:

| Drop | Saves | Cost |
|---|---|---|
| C4 (backwards puff, line + visual together) | 3.2s | one physical gag in the wonder beat |
| C10 (`rc_11b_puff`) | 2.1s | the recap's only character joke |
| C9 → cheaper variant (no shared rock clip) | 5.0s | the best part of the best callback |
| C2 → two-line Cloudia (drop `a2_21d`) | 3.1s | **do not** — the button is the joke |

Dropping C4 + C10 and taking C9's cheaper variant brings it to **+41.1s** and
~11:50. Everything else is load-bearing.

**Other files each change touches** (for whoever wires it):
`narration.mjs` (15 entries + 1 rewrite), `Video.tsx` (`SCRIPT` lines arrays,
`gaps`, one new scene spec, `tailFrames` on s20), `scenes/act2.tsx` (C1–C6),
`scenes/act3.tsx` (C7–C9), `scenes/recap.tsx` (C10), each scene's
`SPEAKER_VISUAL` and bubble maps, and `script.md` itself (cast table:
Cloudia now two scenes; running-gag ledger: `darling` ×3, the interrupt gag
×5, the roll call ×2, the rock ×2, apology count unchanged).

---

## 5. Deliberately not touched

- **Scene 29, the dandelion hillside, and its 60f held beat.** Sacred. It is
  the emotional beat the ending is banked against and the only thing in the
  episode that pays off Act One's proof as a *consequence*. Nothing goes near
  it, including the two scenes either side.
- **Scene 31 and the 75f kite payoff.** Sacred, obviously. C8 is the only
  change that touches it at all, and it touches it *forward* — rehearsing the
  word PUSH five minutes early makes the payoff bigger, not smaller. No line
  lands inside the 75 frames.
- **Scene 32, the third firing of the beetle gag.** Untouched, including both
  45f beats and `a3_51_narrator`'s `sameAs`. C9 sits *after* it, so the
  emotional close still gets its full silence before the cutaway.
- **Scene 6 ("I think I might be nothing at all") and Scene 22 (the turn).**
  These are the arc, and the arc is not what Claire complained about. Adding
  comedy to either would cost the thing the episode is actually good at.
- **Scenes 7 and 8 (the dandelion proof and "wave your hand").** Scene 8 in
  particular is homework, not entertainment — the 45f beat exists so a child
  can physically get a hand moving. It is the only moment in the episode where
  the viewer verifies a claim personally and it is worth more than any gag.
- **All four Big Word cards and the recap chant.** The `WordCard` rhythm is
  the house signature and its 12f beats are calibrated for joining in. C10
  adds to the mind-blower, not to the chant.
- **The cold open.** Claire was engaged at the start. The flop works. The
  problem starts at 4:28, not at 0:00.
- **The volcano.** Still asleep. Nobody mentions it. Ever.
- **The apology arc's arithmetic.** Nine / two / zero, unchanged. C3 makes
  one of the two Act Two apologies funnier without adding one, and no change
  in Act Three lets Puff say sorry.
