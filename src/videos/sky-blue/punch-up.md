# Ray and the Sky Nobody Painted — comedy density audit

**Status: APPLIED, 2026-07-28.** All four changes (C1–C4) are wired into
`narration.mjs`, `Video.tsx`, `scenes/act1.tsx`, `scenes/act2.tsx`,
`scenes/act3.tsx`, `scenes/recap.tsx` and `script.md`. Measured delta **+19.3s
(11:58.6 → 12:17.9)** against the +18.4s estimated below. This file is kept as
the reasoning — the density map in §1 in particular, which is the method rather
than the result. Where the built version departs from what is written here,
`script.md` is the source of truth and the departure is noted there. Three
things did:

- **C1's letters are the *syllable blocks'*, not the `WordCard`'s.** RAINBOW's
  seven capitals are on screen for exactly twenty frames and are still springing
  in for most of them; the letters a child actually looks at for the other three
  hundred and thirty are "Rain" and "Bow", which spell R-a-i-n-B-o-w. The seven
  perch on those, one each, so the gag is on screen for the whole card instead
  of for two thirds of a second.
- **Ray's perch moved from over the "o" to over the "w"** (`BOW_BLOCK.x`
  1128 → 1230), which is what lets the change be exactly what §2 asks for:
  Violet arrives last and finds *Ray* on the W. It also means Ray keeps his own
  letter through the split rather than hopping to somebody else's.
- **C4 moved the Earth to the top left and Ray 150px left.** Sunny has to be on
  the side the light is coming from — the astronaut's shadow is hard-edged and
  lies to the left, and his existing wave already points up and to the right —
  and that corner was occupied.

§5's one free visual — **the puffs reaching for Red in Scene 18** — is in as
well, and it is Puff himself doing the reaching rather than the faceless
`AirBlob` crowd: the air in this show is drawn without faces on purpose
(`src/lib/kid/characters/AirBlob.tsx`, and script.md's *fourteen more faces
would turn the mechanism into a party*), so giving the crowd hands to reach with
was not the free option it looks like. Puff is already cast, already in the act
and already on screen a scene either side, and he still has no line here.

**Trigger:** none. This is the first audit in the series to run **before** the
six-year-old sees the episode, rather than after she says it is not funny
enough. The goal is that she never meets the sags.
**Measured cut:** 21,557 frames @ 30fps = **11:58.6**, thirty-five scenes,
one hundred and seventy-six lines. Every timestamp below is computed from
`narrationManifest.ts` + `Video.tsx`'s `gaps` and `tailFrames`, not estimated.
**Budget:** the episode is already at the top of its own stated target
(~10.5–12 min), so the budget is **as little as possible**. This proposal spends
**+18.4s** across four changes, one of which costs zero seconds. Episode two's
equivalent pass spent +41s across ten.
**Constraint:** every pedagogy beat survives. No fact is cut, moved out of its
act, or re-housed.

---

## 1. Density map

"Laugh" is graded for the **six-year-old**, not the grown-up — a beat only a
parent smirks at is marked *(adult)* and does not count toward the cadence.
Three other grades are used and they matter for what follows:

- **recognition** — a returning character's entrance or catchphrase. Warm, and
  it holds attention, but it is not a joke. Counted as a *small* beat, flagged.
- **awe** — the picture is the point. Not a beat.
- **enthusiasm** — a character being delighted. Ep 2's audit established this is
  not the same as funny and it is not counted.

| # | Scene | Starts | Len | Laugh beats | Grade |
|---|---|---|---|---|---|
| 1 | s01_crayon | 0:00 | 29.7 | "Nobody up there is holding a crayon" *(adult)* | — (hook, correctly) |
| 2 | s02_title | 0:29 | 9.9 | Sunny claims the title card he is standing on | small–mid, sight gag |
| 3 | s03_sun | 0:39 | 31.7 | greeting *(recognition)*; "I MADE these! Off you go!" over a stadium of beams | small, visual |
| 4 | s04_flick | 1:11 | 14.9 | the flick + "Eight minutes! HA! HA!" + 20f of Ray doing the arithmetic | small–mid, physical |
| 5 | s05_journey | 1:26 | 11.7 | **"Are we there yet?" ×2** | **LAUGH** |
| 6 | s06_arrival | 1:37 | 21.9 | "I'm on a leaf! I'm on a puddle! I'm on a DOG!" | small–mid, list |
| 7 | s07_plain | 1:59 | 23.3 | "Hmm." *(adult)* | — (the sulk, deliberately) |
| 8 | s08_rain | 2:23 | 23.9 | **Drip cameo + "Different show. Same rain."** | **LAUGH** |
| 9 | s09_split | 2:47 | 25.0 | — | — (the reveal; awe + counting) |
| 10 | s10_rollcall | 3:12 | 18.1 | **the roll call + "I have never met me before."** | **BIGGEST** |
| 11 | s11_bigword_rainbow | 3:30 | 18.8 | — | — (chant) |
| 12 | s12_homework | 3:48 | 24.1 | — | — (homework) |
| 13 | s13_not_plain | 4:13 | 24.3 | "Technically, that one is mostly Drip." *(adult)* → 24f → **"WE ARE A TEAM! HA! HA!"** | **LAUGH** |
| 14 | s14_why_only_blue | 4:37 | 13.4 | — | — |
| 15 | s15_myth_sea | 4:50 | 24.3 | the MYTH stamp thuds and cracks | small, visual (house gag) |
| 16 | s16_myth_paint | 5:15 | 13.2 | **45f on a dry roller → "I keep the paint somewhere else."** | **LAUGH** |
| 17 | s17_not_empty | 5:28 | 29.2 | Puff's entrance + catchphrase *(recognition)*; "Different show. Same air." | small, flagged |
| 18 | s18_red_straight | 5:57 | 14.3 | "Barely touched the sides." *(adult)* | — (boring on purpose) |
| 19 | s19_blue_everywhere | 6:11 | 19.6 | "Everybody bounce off Puff!" + the crowd batting Blue about | small–mid, physical |
| 20 | s20_every_direction | 6:31 | **30.4** | "Our eyes are just not very good at violet." *(adult)* | — **longest gagless scene in Act Two** |
| 21 | s21_bigword_scatter | 7:01 | 23.2 | "The air scatters me! All day!" *(enthusiasm)* | — (chant) |
| 22 | s22_interlock | 7:24 | 11.5 | "I TOLD you I was real stuff!" | small, callback, flagged |
| 23 | s23_sunny_wrong | 7:36 | **41.1** | **"He is wrong." + 36f + the grin coming apart + "MY LIGHT!" + "He will only remember one of those."** *(the last one adult)* | **BIG — four beats** |
| 24 | s24_not_plain_anymore | 8:17 | 7.1 | — | — (arc payoff) |
| 25 | s25_sea_sunset | 8:24 | 20.4 | — | — |
| 26 | s26_volcano | 8:45 | 9.6 | **the volcano deadpan + 60f of nobody reacting** | **LAUGH** (adult-leaning) |
| 27 | s27_long_way | 8:54 | 19.3 | — | — (diagram) |
| 28 | s28_blue_runs_out | 9:13 | 25.4 | — | — (diagram) |
| 29 | s29_bigword_sunset | 9:39 | 24.1 | **"I do this bit ON PURPOSE! For the drama!"** | **LAUGH** (small–mid) |
| 30 | s30_crayon_back | 10:03 | 14.0 | — | — (the frame story closing; correctly silent) |
| 31 | s31_round_the_other_side | 10:17 | 18.6 | the identical "GOOD MORNING, EVERYBODY!" from over the far horizon | small–mid, recognition + repetition |
| 32 | s32_chant | 10:36 | 21.5 | — | — (chant) |
| 33 | s33_right_now | 10:57 | 11.2 | — | — |
| 34 | s34_mind_blower | 11:08 | **34.8** | — | — **longest scene in the episode, zero beats** |
| 35 | s35_tease | 11:43 | 15.0 | **"That is not me."** | **LAUGH** (the inverted running gag) |

### The number

**Ep 3 lands a kid-graded laugh roughly every 40 seconds**, against the ep-1
standard of every 22–25s. But the average is the wrong number for this episode,
because the distribution is not flat:

| Act | Span | Beats | Cadence | Longest gap |
|---|---|---|---|---|
| Cold open + Act One | 0:00–4:37 | 8 | one per **35s** | 64s |
| Act Two | 4:37–8:24 | 7 | one per **32s** | 66s |
| Act Three | 8:24–10:36 | 3 | one per **44s** | 61s |
| Recap | 10:36–11:58 | 1 | one per **82s** | 79s |

For comparison: ep 1 = one per 22–25s, never over ~45s. Ep 2 before its
punch-up = one per 50s, three stretches over 70s. **Ep 3 sits between them and
much closer to ep 1 — it is 25% denser than pre-punch-up ep 2 and its acts one
and two already run at a healthy 32–35s.** The pacing rules being written into
the script rather than retrofitted did most of the job.

The failure is not density, it is **max gap**, and it is concentrated in
exactly two places: the Act Three diagrams and the recap.

### The four sags

- **SAG A — 3:29 → 4:33 (64s).** From the roll call's button to "WE ARE A
  TEAM!". Big Word One (18.8s) and the rainbow homework (24.1s) back to back.
  **The softest of the four, and mostly not a problem**: it follows the biggest
  laugh in the episode, and both scenes are *participatory* — a child is
  chanting through one and physically turning round in the other. Two sacred
  scenes, and there is nothing to add that would not cost the thing they do.
  Fixed here for **zero seconds**, with a picture.
- **SAG B — 6:27 → 7:33 (66s).** Scenes 20–22: the every-direction dome, the
  SCATTER card, the interlock. The mechanism's densest stretch, with exactly one
  adult beat in it (the violet answer). Scene 20 alone is 30.4s.
- **SAG C — 8:55 → 9:56 (61s).** Scenes 27–28: the path-length cross-section and
  the beam losing its blue. Two diagrams, back to back, forty-five seconds of
  Narrator over drawn geometry, zero characters doing anything.
- **SAG D — 10:33 → 11:52 (79s), the longest.** From the distant greeting to
  "That is not me." The crayon returning, the chant, "right now over everybody's
  house", and then the mind-blower — **the longest scene in the episode at 34.8s
  with not one beat in it.** This is ep 2's SAG C in the same slot, and the
  answer to the brief's question is: **no, the Moon's awe does not carry it.**
  Ep 1 put a joke in its mind-blower (Drip: "That is the coolest thing anybody
  has ever said about me!") and ep 2's punch-up had to add one.

**Two soft spots, named but not counted as sags.** If the orchestrator grades
*recognition* beats as non-laughs — Puff's entrance at 5:39 and "I TOLD you I
was real stuff!" at 7:33 — then 5:24 → 6:22 (58s) and 6:27 → 7:52 (85s) appear.
C2 below fixes the second one on either grading. The first gets a free visual
answer in §5.

### Diagnosis

The script did the thing STYLE.md asks for and it shows in the map:

- **The mechanism act is not the sag.** Act Two contains the dry roller, the
  pinball, and Sunny being wrong for the first time in three episodes — a
  41-second scene with four beats in it. The rule "the mechanism act should be
  the funniest act" was followed at the writing stage. **The sag migrated to
  whichever act is carried by diagrams, and in this episode that is Act
  Three.** Scenes 27 and 28 are Act Three's crayon-diagram equivalent of ep 2's
  Act Two, and they fail the same way for the same reason: two comedians on the
  payroll (Sunny, Puff) and neither is on screen.
- **Ray's attitudes are real and they stop at the interval.** Act One gives him
  four (the sulk, "Is that my job?", "I have never met me before", "So I am not
  the plain one"). Act Two gives him **two** — "Um. Yours." and, better,
  `a2_34_ray` "Hold on. Violet bounces even more than Blue does", which is Ray
  catching the *Narrator* out and is the only glimpse in the episode of a
  genuinely funny characterisation: **Ray is a pedant.** Act Three and the recap
  give him **zero**: "And how long is that trip?", "So who is left?", "Wait. Am
  I finished?", "Black? In the daytime? Why?" — every one of them the audience's
  line said for them. The brief's suspicion is confirmed, and the fix is the
  cheapest kind, because the attitude already exists in the script and only has
  to fire twice more.
- **The seven colour blobs are an entire unused comedy cast.** They are silent
  by design and that is right — seven speaking colours would be seven auditions.
  But silent is not the same as absent: they have faces, they bob, they wave,
  they march and they ricochet, and **a sight gag costs zero runtime, zero
  synthesis and zero voices**. The episode currently uses them for one joke
  (Scene 10) and then treats them as diagram elements. Three of the four changes
  below are built on them.
- **Scene 5, the deliberate boredom bet, pays — but not for the reason it was
  written.** Graded as a six-year-old: "Are we there yet?" is the single most
  kid-legible line in the episode, because it is *their* line. It reads as a
  repetition gag, not as a boredom gag — the 60f hold is two seconds, which is
  nowhere near long enough to actually bore anybody. **The bet wins and needs no
  change**; the honest note is that the grown-up description of it ("the
  audience is allowed to get bored on purpose") is not what happens, and nobody
  should lengthen the beat trying to make it true.

**The corollary, and every change below is one of these:** put the two
comedians who are already on the payroll inside the two diagram stretches, and
give Ray back the pedantry he had in Act Two.

---

## 2. The punch-up

Four changes, C1–C4. Key naming follows the established convention: an
insertion takes the preceding key plus a letter. All four keys carry their real
speaker in the suffix — this episode has no narrator-voiced cameos, so
`speakerOf(key)` resolves correctly with no `SPEAKER_VISUAL` override needed.

---

### C1 — Violet, who nobody ever notices (Scene 11, and everywhere)

**Slot:** `s11_bigword_rainbow`. **No lines. No beats. No frame count changes.**
**Cost: +0.0s.**
**Why:** SAG A is 64 seconds long and sits across the two scenes in the episode
it would be most damaging to touch — a Big Word card and the only homework in
the show. So it gets the one kind of fix that costs nothing: a picture.

RAINBOW has seven letters. Ray has seven colours. The script already puts Ray on
the crossbar of the W and Drip on the B, so the card is already staged as a
place characters sit.

> ### Scene 11 — Big Word One *(visual addition only)*
> **Visual addition:** as the letters bounce in one at a time, the seven blobs
> from Scene 9 arrive and take one letter each, **in spectrum order** — Red on
> the R, Orange on the A, and so on. Violet arrives **last**, finds the W
> already occupied by Ray, and spends the rest of the card squeezed onto the
> far arm of it, half off the edge, holding on. Nobody looks at him. Nobody
> mentions him. He is still there when the card cuts.

**Why this one and not any other sight gag:** it is the first firing of a
**silent running gag** that C2 and C3 both cash in. See §3 — this is the change
that makes the two cheapest items in the document work, and it is free.

**Pedagogy:** untouched, and marginally helped: seven blobs on seven letters is
one more picture of "seven, all of them Ray" laid over the word that names it.
**Runtime:** **+0.0s** — nothing enters a held beat, no `gaps` change, no
`tailFrames` change, no clip.
**Staging:** light. The blob body already exists (Scene 9/10 draw seven of
them) and the card already has two characters sitting on it.

---

### C2 — "Sorry, Violet." (Scene 20)

**Slot:** `s20_every_direction`, one Ray line after `a2_36_narrator`, plus a
20f held beat in front of it.
**Why:** the best ratio in this document — under two seconds for a real laugh,
inside the episode's longest gagless mechanism scene, and **the joke is the
honesty tax**. The violet exchange (`a2_34`–`a2_36`) is the script's proudest
piece of pedagogy and it currently lands as a grown-up footnote: violet
scatters more, our eyes are bad at it, moving on. Give the fact a *victim* and
a six-year-old has it forever.

It also fires Ray's pedantry a second time, three lines after `a2_34` set it up,
and it is a callback to the roll call — he **met** Violet, by name, at 3:23.

> ### Scene 20 — Blue, from every direction *(revised — one added line)*
> **Visual addition:** from `a2_34_ray` onward, **Violet is in frame**, in the
> bottom corner of the dome shot, ricocheting harder and faster than anything
> else on screen, waving both arms at the lens. He is visibly working the
> hardest of any object in the frame. Nobody looks at him, no arrow points at
> him, and the Narrator's two lines play over the top of him as if he were not
> there. On the held beat he **stops**, and droops.
> **Lines:** `a2_30_narrator` … `a2_34_ray`, `a2_35_narrator`,
> `a2_36_narrator`, **`a2_36b_ray`**
>
> > **RAY:** Hold on. Violet bounces even more than Blue does.
> > **NARRATOR:** It does. Our eyes are just not very good at violet.
> > **NARRATOR:** They are extremely good at blue. So blue is what we see.
>
> **HELD BEAT — 20f (0.7s) after `a2_36_narrator`.** Violet stops bouncing and
> droops. **Nothing else enters this beat** — no bubble, no arrow, no emotion
> change on Ray. Deadpan is stillness.
>
> > **RAY:** Sorry, Violet.

**Bubble:** Ray `"Sorry, Violet."` (2 words).
**narration.mjs:**

```js
// Scene 20: two words, and they are the episode's honesty tax made
// kid-legible. Violet really does scatter more and the reason we do not see a
// violet sky is our own eyes — which is a grown-up fact until somebody
// apologises to him for it. Third firing of Ray's pedantry (a2_34, a2_46) and
// a callback to the roll call, where he met Violet by name.
// Deliberately NOT seasoned: `happy` or `sad` would play it as a punchline
// being sold. Same call as a1_44_ray. The laugh is the 20f in front of it.
a2_36b_ray: { text: "Sorry, Violet.", ...RAY },
```

**Pedagogy:** strengthened. The scene's claim is *the sky is not violet because
of our eyes, not because of the sky* — and the staging now shows violet doing
the work and not being seen, which is the claim as a picture rather than as a
concession. The fact is unchanged and no line is cut.
**Tone check:** not unkind and nobody is pitied — Ray apologises *on behalf of
everybody's eyes*, which is the show's register exactly (he corrects Sunny by
giving him the half he owns).
**Runtime:** **+1.9s** (1.2s clip + 20f beat). **Staging:** light — one existing
blob body on a ricochet path in the corner of an existing shot, one bubble.
**Cost:** MiniMax, 2 words, ~$0.001.

---

### C3 — The roll call fires a second time, as a goodbye (Scene 28)

**Slot:** `s28_blue_runs_out`, three lines and two held beats after
`a3_14_narrator`. `a3_15_ray` and everything after it survive unchanged.
**Why:** this is the change this document would fight hardest for, and it does
four jobs at once.

1. **It fills SAG C**, the Act Three diagram stretch, at its midpoint.
2. **It is the series signature's second firing.** STYLE.md: every episode gets
   a roll call, and the six-year-old asked for more of it after both previous
   episodes. Ep 3 fires it once, at 3:15. Ep 2's punch-up found that re-firing
   it was "the cheapest big laugh available in the episode" and that finding
   transfers exactly.
3. **It costs no new staging idea.** Scene 28's visual is already *blue pinging
   out sideways, then another, then another, and indigo and violet going with
   it*. The gag is three eye-lines and a wave — the same trade Scene 10 made.
4. **The joke is the lesson, and it defends a physics rule the script currently
   protects with staging alone.** Production notes: *"Nothing is taken away…
   Act Three is the one place where a colour genuinely does go missing from a
   beam, and it is staged as blue bouncing off sideways, visibly, into the rest
   of the sky, rather than as blue being removed."* Right now that correction
   exists only in the picture. `a3_14c_narrator` says it out loud, in the flat
   explanatory slot the roll call needs anyway.

And it is the one place in Act Three where Ray gets an attitude instead of a
question — he is waving goodbye to parts of himself, which is the whole arc
being played rather than stated.

> ### Scene 28 — Blue runs out *(revised — three added lines)*
> **Visual:** unchanged through `a3_14_narrator`, including the **45f drain
> beat, which is not touched**. **New:** as the beam travels, the three blobs
> who leave it — **Blue, Indigo and Violet** — each turn and wave on their way
> out sideways, in order. Ray, riding the beam, waves back at each one, with an
> eye-line, exactly as he did along the arc in Scene 10. Violet is the last to
> go and goes furthest.
> **Lines:** `a3_12_narrator`, `a3_13_narrator`, `a3_14_narrator`,
> **`a3_14b_ray`**, **`a3_14c_narrator`**, **`a3_14d_ray`**, `a3_15_ray`,
> `a3_16_narrator`, `a3_17_ray`, `a3_18_narrator`
>
> > **NARRATOR:** Bounce. Bounce. Bounce. All the way along.
>
> *(45f drain beat — unchanged, and nothing enters it.)*
>
> > **NARRATOR:** By the time that light reaches you, the blue has all bounced away.
> > **RAY:** Bye Blue! Bye Indigo! Bye Violet!
>
> **HELD BEAT — 20f (0.7s) after `a3_14b_ray`.** The goodbye lands. Ray is
> still waving after them while the audience works out who just left.
>
> > **NARRATOR:** They did not go anywhere. They went everywhere else.
>
> **HELD BEAT — 24f (0.8s) after `a3_14c_narrator`.** **Nothing enters this.**
> No wave, no bubble, no entrance, no emotion change — Ray hangs there in a beam
> that is now red and orange, doing absolutely nothing. Same beat, same length
> and same reason as Scene 10's.
>
> > **RAY:** I will see me later.
> > **RAY:** So who is left?

**Bubbles:** Ray `"Bye! Bye! Bye!"` (3 words — a summary, not a transcript,
exactly as Scene 10's bubble is `"Hi! Hi! Hi! Hi!"` against a seven-name line),
then Ray `"I will see me later."` (5 words).
**narration.mjs:**

```js
// THE ROLL CALL, SECOND FIRING — the series signature, and the picture the
// scene already draws. Three items rather than Scene 10's seven, so 0.9
// rather than 0.88; they still have to separate or they are one noise.
// The three named are exactly the three the scene's staging already loses
// (script.md, Scene 28: "indigo and violet go with it"), which is what makes
// a3_15_ray's "So who is left?" land as a question the audience can answer.
a3_14b_ray: {
  text: "Bye Blue! Bye Indigo! Bye Violet!",
  ...RAY,
  speed: 0.9,
  emotion: "happy",
},
// The flat explanatory line the roll call's shape requires — and it is the one
// place in the episode where the "nothing is taken away" rule (Production
// notes, Physics honesty) is said in words rather than trusted to the staging.
// Kokoro, so it re-times for free. 0.92, the house list speed, so the two
// halves separate.
a3_14c_narrator: {
  text: "They did not go anywhere. They went everywhere else.",
  ...NARRATOR,
  speed: 0.92,
},
// The unbothered button. Deliberately NOT seasoned — the exact call made on
// a1_44_ray ("I have never met me before."), which this is the sequel to, and
// the same 0.95. If it sounds like it is being sold, it is wrong: it is a mild
// fact about parts of himself having somewhere to be.
a3_14d_ray: { text: "I will see me later.", ...RAY, speed: 0.95 },
```

**Video.tsx:**

```js
gaps: {
  a3_13_narrator: 45,   // unchanged
  a3_14b_ray: 20,       // "the goodbye lands"
  a3_14c_narrator: 24,  // "nothing enters this"
},
```

**Pedagogy:** strengthened twice. The scene's mechanism is unchanged and its
45f drain beat is untouched; what is added is (a) the misconception-guard said
out loud, and (b) three colours named individually a beat before the Narrator
asks who is left, which converts `a3_15`–`a3_16` from a statement into a
question the audience already knows the answer to.
**Arc check:** this is Ray's first attitude in Act Three and it is the right
one — he is not sad about it, which is what keeps the sunset from reading as
the light dying (the Scene 31 guardrail, five scenes early).
**Runtime:** **+9.9s** — the largest item here, and the only one over four
seconds. **Staging:** medium. Three named blobs on scripted exit paths with a
wave and an eye-line each, Ray waving back, two bubbles. The blob body,
the beam and the pings all exist; this is choreography, not a new set.
**Cost:** MiniMax ×2 (~11 words, ~$0.005); the Narrator line is free.

---

### C4 — Sunny is right there and nobody made him a sky (Scene 34)

**Slot:** `s34_mind_blower`, one Sunny line after `rc_09_narrator` and one after
`rc_11_ray`. **The 60f black-sky hold after `rc_10_narrator` is not touched and
nothing enters it.**
**Why:** the mind-blower is the longest scene in the episode (34.8s) and it has
no beat in it. Ep 1's mind-blower has one, ep 2's had to have one added, and
this episode has the best one of the three sitting unused in front of it:

**On the Moon the Sun is a blinding disc in a black sky.** That is physically
correct, it is the single most counter-intuitive part of an already
counter-intuitive picture, and it is the control experiment stated as a
character being personally offended. Sunny is *already in that frame* — the
astronaut is lit hard with a crisp black shadow, so something is doing the
lighting. Putting his face on it costs no new set.

It also does the setup/reveal properly: he claims the Moon a beat **before** the
sky turns out to be black, which is the shape the cold open used (state the
wrong theory, then break it) compressed into ten seconds.

> ### Scene 34 — The mind-blower *(revised — two added lines)*
> **On stage:** Narrator, Ray, **Sunny**
> **Visual:** unchanged — the astronaut, the crisp shadow, the black sky full of
> stars, the Earth hanging in it. **New:** on `rc_09b_sunny` the sun in the
> lunar sky opens an eye. He is blazing, enormous, unmistakably Sunny, and he is
> **surrounded by stars**, in the middle of the day, which is the whole lesson.
> The astronaut waves at him. Keep it wondrous, not lonely.
> **Lines:** `rc_08_narrator`, `rc_09_narrator`, **`rc_09b_sunny`**,
> `rc_10_narrator`, `rc_11_ray`, **`rc_11b_sunny`**, `rc_12_narrator`,
> `rc_13_narrator`, `rc_14_ray`, `rc_15_narrator`
>
> > **NARRATOR:** Somebody is standing on the Moon. The sun is shining right on them.
> > **SUNNY:** THAT IS ME! I am shining on the MOON as well!
> > **NARRATOR:** It is the middle of the day. And the sky above them is BLACK.
>
> **HELD BEAT — 60f (2.0s) after `rc_10_narrator`.** *(Unchanged. Sacred.
> Nothing enters it, including Sunny — he is in the picture, blazing, and he
> does not move, react or change expression for two full seconds.)*
>
> > **RAY:** Black? In the daytime? Why?
> > **SUNNY:** So where is the sky? I am RIGHT HERE.
> > **NARRATOR:** Because the Moon has no air. And no air means nothing to bounce blue off.

**Bubbles:** Sunny `"That is ME!"` (3 words) and `"I am RIGHT HERE!"` (4 words).
**narration.mjs:**

```js
// Scene 34: he claims the Moon one line before the Moon turns out not to have
// a sky. The cold open's shape (state the wrong theory, then break it)
// compressed into ten seconds, and his sixth claim of the episode.
// NO "You're welcome!" here — the catchphrase already fires seven times and an
// eighth is a tax on the three that matter.
rc_09b_sunny: { text: "THAT IS ME! I am shining on the MOON as well!", ...SUNNY },
// The objection, and it is the control experiment. He is not wrong and he is
// not complaining — the sun really is visible in a black lunar sky, which is
// the most counter-intuitive true thing in three episodes. rc_12_narrator
// already answers him word for word, so this line costs the scene nothing
// except the ten seconds it makes funny.
// Slowed a touch: it is a genuine question, not a brag. Kokoro, so free and
// free to reword.
rc_11b_sunny: { text: "So where is the sky? I am RIGHT HERE.", ...SUNNY, speed: 0.95 },
```

**Does this spend `rc_18_sunny` ("That is not me.")?** No — it sharpens it. Here
he *demands* to be acknowledged; four minutes later, offered a free claim on the
biggest thing on the horizon, he declines it. Two firings of "that one is me as
well" ten seconds apart make the inversion at the end of the episode land as a
change in the character rather than as a one-off line.
**Tone check:** the scene guardrail is *keep it wondrous, nothing frightening*.
Sunny blazing in a black sky with an astronaut waving at him is warmer than the
astronaut alone, not colder. He is baffled, not upset, and nobody is alone in
the shot.
**Pedagogy:** strengthened. "Same sunlight, no air, no blue" is the episode's
control experiment (Production notes), and it is now stated by the constant in
the experiment. `rc_12` and `rc_13` are unchanged and now play as answers to a
question rather than as narration over a picture.
**Runtime:** **+6.6s** (3.4s + 3.2s, no new held beats). **Staging:** light —
Sunny's body in the top of an existing frame, two bubbles, no
`SPEAKER_VISUAL`.
**Cost:** **$0.00.** Both lines are Sunny, Sunny is kokoro, and they re-time for
free if a word changes.

---

## 3. Violet, and why three of these are nearly free

The seven colour blobs are the episode's largest untapped resource and the
reason this pass costs a fifth of ep 2's. They are **silent by design and that
design is right** — seven speaking colours would be seven auditions and twelve
voices in a show that holds at five. But the rule they were written under is *a
body with a face and a **line** gets its own voice*, and a sight gag has no
line.

C1, C2 and C3 are one running gag with three firings, carried entirely by a
character who never speaks:

| Firing | Scene | What happens | Cost |
|---|---|---|---|
| 0 (exists) | 10, 3:23 | Ray greets Violet by name, last in the list | — |
| 1 | 11, ~3:38 | Violet gets to the RAINBOW card last, ends up half off the W | **0.0s** |
| 2 | 20, ~7:01 | Violet out-bounces the entire frame, is ignored, droops → "Sorry, Violet." | **1.9s** |
| 3 | 28, ~9:29 | Violet is the last to leave the sunset beam and goes furthest | *(inside C3)* |

Total added runtime for a three-firing running gag with a name, an arc and a
punchline: **1.9 seconds and one two-word MiniMax clip.** It needs no audition,
no voice, no engine decision and no cast-table row, because Violet is not cast —
he is drawn.

**The general rule this is worth writing down as:** a crowd that has faces is a
comedy cast that costs nothing, as long as nobody gives it a line. Ep 2 found
that a background gag has to be *findable in a paused frame*; the corollary is
that a findable background gag is a joke you did not have to pay for. Violet
must be **the same blob every time** — same position in the arc, same
recognisable silhouette — or he is three different accidents.

**Deliberately not done: giving Violet a line.** He is funnier as the one who
never gets to say anything. The moment he speaks he is a sixth voice, an
audition, and a cast-table row, and the joke stops being that nobody notices
him.

---

## 4. Impact

Runtime deltas are estimated from this episode's own measured per-speaker rates
(Narrator 0.362 s/word, Sunny 0.348, Ray 0.433, Puff 0.354, Drip 0.325) plus
the specified held beats, with short-line overhead taken from comparable clips
in the manifest. Expect ±15% per line.

| # | Scene | Added | Δ runtime | Staging | Synthesis cost |
|---|---|---|---|---|---|
| C1 | 11 `s11_bigword_rainbow` | — (visual only) | **+0.0s** | light (seven existing blobs on seven letters) | **$0.00** |
| C2 | 20 `s20_every_direction` | `a2_36b_ray` + 20f beat | **+1.9s** | light (one blob ricocheting in-corner; 1 bubble) | ~$0.001 |
| C3 | 28 `s28_blue_runs_out` | `a3_14b_ray`, `a3_14c_narrator`, `a3_14d_ray` + 20f/24f beats | **+9.9s** | medium (three scripted blob exits + Ray's eye-lines; 2 bubbles) | ~$0.005 |
| C4 | 34 `s34_mind_blower` | `rc_09b_sunny`, `rc_11b_sunny` | **+6.6s** | light (Sunny's body in an existing frame; 2 bubbles) | **$0.00** |
| | **TOTAL** | **6 new keys, 0 rewritten** | **+18.4s** | | **under one cent** |

**Episode length: 11:58.6 → ~12:17.** That is 17 seconds over the top of the
script's own stated target (~10.5–12 min), and it should be a conscious choice
rather than a rounding error. Ep 2 knowingly ran to 12:20 for the roll call and
the punch-up; this lands in the same place for a fifth of the spend. If it has
to come in under twelve minutes, the episode is 18 seconds over *before* this
document exists, and the honest lever is the one the script names itself
(Scene 12, the rainbow homework) — which this document recommends against.

**Post-change cadence:** one kid-graded beat every **~32s**, longest gap **64s**
(SAG A, accepted). Act Three goes from one per 44s to one per 33s; the recap
goes from one per 82s to one per 30s. That is not ep 1's 22–25s and this
document does not chase it — chasing the *average* in an episode already at the
top of its runtime would mean inventing ten more beats. **The max-gap rule is
what the audit is for, and after these four changes nothing over 45s remains
outside SAG A.**

| Drop | Saves | Cost |
|---|---|---|
| C4 → `rc_09b_sunny` only (drop the objection) | 3.2s | the better of the two lines; the claim alone still splits SAG D at 11:27 |
| C4 → `rc_11b_sunny` only (drop the claim) | 3.4s | the setup; the objection alone lands at 11:37 and leaves a 54s gap behind it |
| C3 → drop `a3_14d_ray` (the button) | 1.8s | **do not** — without a button it is a list, not a roll call |
| C2 | 1.9s | **do not** — best ratio in the document |
| C1 | 0.0s | nothing to save; it is free |

Dropping one half of C4 brings it to **+15.0s** and ~12:14. There is nothing
else to give: C1 is free, C2 is under two seconds, and C3 is the series
signature.

**Other files each change touches** (for whoever wires it): `narration.mjs`
(6 entries), `Video.tsx` (`SCRIPT` lines arrays for s20/s28/s34, `gaps` for s20
and s28), `scenes/act2.tsx` (C2), `scenes/act3.tsx` (C3), `scenes/act1.tsx`
(C1), `scenes/recap.tsx` (C4), the bubble maps in each, and `script.md` itself —
the held-beat count goes from **forty-one to forty-four**, the running-gag
ledger gains *the roll call ×2* and *Violet ×3*, the line count goes from one
hundred and seventy-six to one hundred and eighty-two, and Sunny's cast row
gains Scene 34.

---

## 5. Deliberately not touched

- **The crayon cold open and Scene 30's return.** Sacred, and the map agrees:
  Scene 30 is the only fourteen seconds in the episode where silence is the
  payoff. Nothing goes near either, including the two 45f/36f beats.
- **Scene 5, the space journey.** Graded and **passed** — see §1's diagnosis. It
  is a working repetition gag, not a failing boredom gag, and the 60f beat
  stays exactly 60f. Do not lengthen it trying to make the boredom real.
- **Scene 6's grey-drain, Scene 9's split reveal and its 60f count-beat, Scene
  12's homework beat, the 75f world-turning ending, all three Big Word cards,
  the recap chant, Scenes 26 and 35's volcano beats, and Scene 23 entire.**
  Sacred by brief, and the map independently agrees with every one of them:
  Scene 23 is the funniest thing in the episode (four beats in 41 seconds) and
  needs nothing, and the volcano is the only gag in the show whose entire value
  is that the show appears not to think it is important.
- **The volcano, specifically.** Nothing is added, nothing looks at it, and no
  character mentions it. C4 puts Sunny in the recap two scenes before `rc_18`
  and he does not so much as glance at the horizon until the tease.
- **The 60f black-sky hold in Scene 34.** C4 adds a body to that picture and
  that body does **nothing** for the whole two seconds. The hold is the
  mind-blower.
- **Cloudia.** She could be added — Scene 20's dome and Scene 33's ordinary
  window are both her sky. **Declined.** Every sag here has a cheaper fix from a
  body already on screen, she would be a sixth voice in an episode that has
  deliberately held at five, and ep 2's Cloud Hotel insert was the single
  heaviest staging item in that document. Cast bloat for a gag that the seven
  blobs give away free is a bad trade.
- **Puff's line count stays at five.** Scene 18's control case is the one place
  a sixth Puff line was tempting (the crowd inviting Red to bounce and Red
  ignoring them). **Take it as a visual only, for free**: the puffs reach for
  Red, miss, and shrug, with no line. That is the answer to the 5:24 → 6:22 soft
  spot and it costs zero seconds and zero dollars. If it needs a line, drop the
  idea instead — `a2_20` and `a2_44` are already flagged in `script.md` as the
  two Puff lines to cut if five is too many, and adding a sixth argues the wrong
  way.
- **"You're welcome!" stays at seven firings.** C4's Sunny lines deliberately
  do not use it. Seven in twelve minutes is at the ceiling; an eighth devalues
  `co_08` and `rc_04`.
- **"EXCUSE ME" stays at one firing** (`a2_45`). `rc_11b_sunny` was written to
  avoid it — the interrupt gag is at five across the series and a second
  in-episode firing eleven minutes apart is not a callback, it is a tic.
- **Ray's "plain one" arithmetic.** Fires at `a1_24`/`a1_26`, answered at
  `a1_55`/`a2_56`. Untouched. C2 and C3 give him attitudes, not another
  self-assessment, and neither adds an eighth "I am the plain one"-shaped line.
- **The three chants, the two `sameAs` recordings, and every existing held
  beat.** No frame count in `Video.tsx` is lowered by anything in this document;
  three are added and none is changed.
