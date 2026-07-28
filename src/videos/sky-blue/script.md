# Ray and the Sky Nobody Painted

**Series:** Little Big World (kids' educational), episode three
**Topic:** why the sky is blue — and why a sunset is not
**Audience:** six-year-olds — and the grown-up in the room
**Target:** ~10.5–12 minutes of finished video
**Shape:** cold open, three acts, recap. Thirty-five scenes, one hundred and
eighty-two spoken lines, one thousand six hundred and forty spoken words.

> **Punch-up applied, 2026-07-28.** `punch-up.md` — the comedy density audit —
> is wired in: four changes, six new lines, **+19.3s (11:58.6 -> 12:17.9)**.
> They are Scene 11's seven blobs on the seven letters (visual only, zero
> seconds), Scene 20's "Sorry, Violet.", Scene 28's second firing of the roll
> call, and Sunny in the lunar sky in Scene 34. Every change is written into
> its scene below; the audit itself is kept as the reasoning, and where the two
> disagree this file wins.

> **Title note.** The brief's working title was *Ray and the Color Thief*, and
> it is the one thing here that is replaced rather than fleshed out. Two
> reasons, and the second is the real one. First, there is no thief and nobody
> takes anything: air does not steal blue out of the sunlight, it *bounces* it
> at you from every direction, which is the opposite of removal. Second — and
> this is a pedagogy bug, not a taste note — Act Three genuinely *is* about
> colours being taken away (the blue scatters out of the low sun before it
> reaches you), so a title that promises a thief hands a six-year-old exactly
> the wrong causal story to carry into the sunset, and they will carry it,
> because it was on the title card for ten minutes.
>
> *Ray and the Sky Nobody Painted* names the **promise** rather than the
> mechanism, which is what episodes one and two both did. It also makes Sunny's
> wrong theory a title-level joke, and it survives Act Three: nobody painted the
> orange one either. Alternates, if the orchestrator prefers:
> *Ray and the Blue Crayon* (names the cold open's prop, warmest of the three),
> *Ray and the Rainbow He Didn't Know He Had* (names Act One and undersells the
> sky), or *Who Coloured the Sky?* (drops the hero from the title, which breaks
> the series pattern).

The companion file `narration.mjs` holds the exact text sent to the
text-to-speech model. Every line below quotes it verbatim; if you change a line,
change it in both files.

## Cast and voices

| Character | Engine | Voice | Speed | Who they are |
|---|---|---|---|---|
| **Narrator** | kokoro | `af_heart` | 1.0 | Warm storyteller, returning. Voice only — no body, ever. Third episode of deadpanning at Sunny; first episode of contradicting him. |
| **Ray** | minimax | `Young_Knight` | 1.0 | **New hero.** One sunbeam, eight minutes old. Earnest, literal, and completely convinced he is the boring plain one. Cast 2026-07-27 (Mike, from the four-voice audition): youthful-earnest over cool-guy, and maximum timbre separation from Sunny. |
| **Sunny** | kokoro | `am_puck` | 1.0 | The Sun, returning, unchanged, insufferable — and the proud boss of a zillion sunbeams. This is the episode where *"that one is me as well!"* finally fails. **Back on his series voice**: `am_puck` since episode one, and the MiniMax `Imposing_Manner` read was auditioned here and rejected — it plays the ego as menace, and Sunny is a show-off, not a villain. No `emotion` on any of his lines (kokoro has none) and no pause markers. |
| **Drip** | minimax | `Lively_Girl` | 1.0 | Returning for three lines. The rainbow is **hers** — rain plus light — and she knows it. |
| **Puff** | minimax | `Exuberant_Girl` | 1.0 | Returning for five short lines, and doing real work: Puff is the air, and the air is what does the scattering. Catchphrase fires once. |

**Silent, and staying silent.** The kid (silhouette, never speaks, three
episodes running), the seven colour blobs, and the volcano. The blobs are a
**crowd, not a cast**: Red through Violet have faces, bob, wave, march and
ricochet, and not one of them has a line. That is deliberate under STYLE.md's
*a body with a face and a line gets its own voice* — seven speaking colours
would be seven auditions and twelve voices in the show. Giving them nothing to
say costs nothing, because everything they need to communicate is a direction
of travel.

**And silent is not the same as absent.** Since the 2026-07-28 punch-up they
carry a three-firing running gag with a name, an arc and a punchline (Violet,
Scenes 11 / 20 / 28) for **one two-word clip and 1.8 seconds of runtime**. A
crowd that has faces is a comedy cast that costs nothing, as long as nobody
gives it a line.

**Ray is cast: `Young_Knight`.** (The paragraph below is preserved as the
original casting note.) `Decent_Boy` was the placeholder, written in so the file
runs and the episode can be timed. It was the runner-up in Puff's audition
(`docs/LEARNINGS.md`, 2026-07-26) and it is a plausible young-earnest-boy read,
which is not the same as being the right one. **Audition before any visual work
happens** — see the ear-check list at the bottom. Recasting is one constant
(`RAY_MINIMAX_VOICE`), exactly the shape `PUFF_ENGINE` had in episode two, and
the `RAY_ENGINE` toggle back to kokoro is kept for the same reason it was there:
a free re-time that costs the acting and nothing else.

**Two engines.** The Narrator stays on Kokoro — free, local, and re-synthesized
the moment a line is reworded — **and so does Sunny**, who went back to
`am_puck` after the MiniMax read was rejected. Ray, Drip and Puff are on MiniMax
speech-2.8-hd (via Replicate), which is paid but takes an `emotion` per line and
honours inline pause markers. Fifty-four MiniMax lines, ~1,900 characters, about
twenty-one cents at current rates; Sunny's nineteen are free and re-time for
nothing whenever a word of his changes.

**Fifty-four MiniMax lines, and most of them are not seasoned.** Ray's
forty-seven are twenty-one `auto`, twenty-five seasoned and one shared
recording: two `sad` (the
sulk, and nowhere else in the episode), `surprised` on the eight lines where a
fact lands on him, `happy` from the rainbow onward, one `calm` at the sunset.
Drip and Puff are `happy` throughout, which is all they are. Every non-`auto`
line names its stage direction in a comment in `narration.mjs`.

**Sunny carries no seasoning at all**, because kokoro has none to give. The four
moments he stops (`a2_12`, `a2_45`, `a2_50`, `rc_18`) — which are the whole of
his arc this episode — are carried by the words, by a slower `speed`, and by his
face; Scene 23 was already staging the doubt with `emotionAt` in the silence
rather than under a line, so nothing there had to change.

## The three Big Words

Each Big Word is said plainly at least twice **and** gets one chant moment led
by Ray, who is not proud of himself the way Drip was and not astonished the way
Puff was — he is *relieved*, every time, because each word is another piece of
evidence that he was never the plain one.

| Word | Act | Line keys | Treatment |
|---|---|---|---|
| **RAINBOW** | One | `a1_46`, `a1_47`, `a1_48`, `rc_02`, `rc_05` | `WordCard`, chanted "Rain. Bow. RAINBOW!" |
| **SCATTER** | Two | `a2_37`, `a2_38`, `a2_39`, `a2_40`, `rc_03`, `rc_05` | `WordCard`, chanted "Scat. Ter. SCATTER!" |
| **SUNSET** | Three | `a3_19`, `a3_20`, `a3_23`, `rc_04`, `rc_05` | `WordCard`, chanted "Sun. Set. SUNSET!" |

**Chanted, not spelled — a deliberate departure from episode two.** Episode two
spelled its Big Words letter by letter ("A. I. R.", "W. I. N. D.") and flagged
both as the highest TTS risk in the file. RAINBOW and SCATTER are seven letters
each; that treatment does not scale, and seven letter-names in a row on an
unheard voice is not a bet worth taking on the hero's introduction. So episode
one's syllable chant comes back — and two of the three chants are built out of
**real words** on purpose. "Rain. Bow." and "Sun. Set." are compounds pulled
apart, which any model can say and which a six-year-old can hear the meaning
inside. Only SCATTER has a non-word in it ("Ter"), and that is the one to
ear-check. The *cards* are unchanged: letters still bounce in one at a time, so
the word is spelled on screen while it is chanted in the ear.

## Line-key convention

`<act>_<number>_<speaker>`, in strict playback order, matching `narration.mjs`
exactly. Act prefixes: `co` cold open, `a1` the rainbow, `a2` the air, `a3` the
sunset, `rc` recap.

## How to read the held beats

Unchanged from episode two, and the format absorbed a whole extra gag last time
without argument. A stage direction that reads

> **HELD BEAT — 45f (1.5s) after `a2_11_narrator`.**

means: that line's `gapFrames` in `Video.tsx` is **45**, the picture is alone on
screen for a second and a half, and **nothing** — no line, no entrance, no
emotion change — starts inside it. Thirty frames is one second. These numbers
are the script's, not the builder's; raising one is a note, lowering one is a
change to the joke. There are forty-four of them here.

---

# COLD OPEN

*Roughly forty seconds. A crayon, a question, and a theory that is wrong.*

---

### Scene 1 — A kid, a picture, and a box of crayons
**On stage:** Narrator (voice only)
**Visual:** Late afternoon grass, shot from above. A kid lies on their front —
silhouette and the backs of two hands, we never see a face and the kid never
speaks, all episode. In front of them, a half-coloured drawing of a house, a
tree and an empty white band across the top. Beside it, a crayon box with every
colour standing up in it. On "Watch which one they pick", the hand hovers over
the box.
**Lines:** `co_01_narrator`, `co_02_narrator`, `co_03_narrator`,
`co_04_narrator`, `co_05_narrator`, `co_06_narrator`, `co_07_narrator`

> **NARRATOR:** This is a story about a colour. The biggest colour there is.
> **NARRATOR:** Here is a kid. Here is a picture. And here is a box of crayons.
> **NARRATOR:** The kid needs to colour in the sky. Watch which one they pick.

**HELD BEAT — 60f (2.0s) after `co_03_narrator`.** The hand hovers, moves along
the row, takes the blue, and colours the empty band at the top of the page. In
silence, at real speed, with the scratch of the crayon as the only sound. This
is the first thing the audience sees the show do this episode, and it is a
question being asked without a single word — every child watching knows what
the hand is going to pick, and knowing it is the hook.

> **NARRATOR:** Blue. Every kid on this whole planet picks blue.
> **NARRATOR:** Now look up.

**HELD BEAT — 45f (1.5s) after `co_05_narrator`.** The camera tilts up off the
page and keeps going until the frame is nothing but sky, enormous and blue and
completely empty. Nobody talks over it. The picture has to get big before the
question is worth asking.

> **NARRATOR:** Nobody up there is holding a crayon.
> **NARRATOR:** So why is the sky blue? Let's go and find out.

**Pedagogy:** States the question as a thing the child has personally done —
they have coloured a sky blue, probably this week — and then makes it strange.
The whole episode is an answer to "who did that, then", and the frame story
comes back in Scene 30 with a different crayon.

---

### Scene 2 — Title, and a theory
**On stage:** Narrator (voice only), Sunny
**Visual:** The title paints itself on across the sky in wide brush strokes, in
sky-blue. Then Sunny leans in from the top corner holding a paint roller,
enormously pleased, and the last stroke of the title turns out to be his.
**Lines:** `co_08_sunny`, `co_09_narrator`

> **SUNNY:** I DID! It was ME! I painted it! You're welcome! HA! HA!

**HELD BEAT — 30f (1.0s) after `co_08_sunny`.** Sunny holding the roller aloft
over his own title card, beaming, saying nothing.

> **NARRATOR:** Sunny has a theory. Keep hold of it. We need it later.

**Pedagogy:** This is episode two's closing tease being collected in the first
forty seconds — *"OH, that one is me as well!" / "Sunny has a theory. It is
wrong."* — so a returning viewer gets paid immediately and a new one gets a
promise. Stating the wrong theory *before* the mechanism is deliberate: a
misconception the audience has been told to hold onto is one they will notice
being broken.

---

# ACT ONE — SEVEN ALL ALONG

*Ray is not white. Ray is every colour there is, and a raindrop proves it.*

---

### Scene 3 — Ninety three million miles away
**On stage:** Narrator, Sunny, Ray
**Visual:** Whip out from the blue sky to the surface of the Sun — churning
gold, flares, and a launch rail running off the bottom of frame with sunbeams on
it in their millions, packed shoulder to shoulder like a stadium crowd. Every
one of them is a small white lozenge with a face. Sunny presides, enormous,
mid-brag. Push in on one beam near the back: **Ray**, small, upright, waving at
nobody in particular.
**Lines:** `a1_01_narrator`, `a1_02_narrator`, `a1_03_sunny`, `a1_04_narrator`,
`a1_05_sunny`, `a1_06_narrator`, `a1_07_ray`, `a1_08_narrator`

> **NARRATOR:** Our story starts somewhere extremely bright. Ninety three million miles away.
> **NARRATOR:** This is the Sun. You have met him.
> **SUNNY:** GOOD MORNING, EVERYBODY!
> **NARRATOR:** And these are his sunbeams. All of them. Every single one.
> **SUNNY:** I MADE these! Every one of you! Off you go! Light something up!
> **NARRATOR:** There are more sunbeams than there are grains of sand. Here is one.
> **RAY:** Hello! I'm Ray! I'm a sunbeam! It's my first day!
> **NARRATOR:** This is Ray. Ray has never been anywhere.

**Pedagogy:** Establishes the unit the episode follows unbroken — *one beam of
sunlight* — and establishes it as one of unimaginably many, which is the
correction episodes one and two both had to make later and this one makes on
arrival. `a1_03_sunny` is also the source recording for `a3_31_sunny`; see
Scene 31 before rewording a syllable of it.

---

### Scene 4 — Eight minutes
**On stage:** Narrator, Sunny, Ray
**Visual:** Sunny picks Ray up between two fingers, points him at a tiny blue
dot in the black, and flicks. Ray goes off frame at absurd speed with a streak
behind him.
**Lines:** `a1_09_sunny`, `a1_10_ray`, `a1_11_sunny`, `a1_12_ray`

> **SUNNY:** RAY! You are going to EARTH! Ninety three million miles! GO!
> **RAY:** Ninety three million? How long does that take?
> **SUNNY:** Eight minutes! HA! HA!

**HELD BEAT — 20f (0.7s) after `a1_11_sunny`.** Ray does the arithmetic, on his
face, and does not get anywhere with it.

> **RAY:** WHOOSH! I am going to EARTH!

**Pedagogy:** The distance-and-still-warm brag from episode one (*"I am ninety
three million miles away and you can STILL feel me"*) collected and made into
a journey. Eight minutes for ninety three million miles is the fastest thing in
the universe stated as a travel time, which is the only unit a six-year-old has
for it.

---

### Scene 5 — Are we there yet
**On stage:** Narrator, Ray
**Visual:** Deep space. Ray streaking left to right across an unchanging star
field, tiny, with Earth a blue dot that does not appear to get any closer for a
very long time. The shot never cuts.
**Lines:** `a1_13_ray`, `a1_14_narrator`, `a1_15_ray`, `a1_16_narrator`

**HELD BEAT — 45f (1.5s) before `a1_13_ray`** (i.e. on `a1_12_ray`'s
`gapFrames`). Travel, in silence, in a shot where nothing changes.

> **RAY:** Are we there yet?
> **NARRATOR:** One minute down. Seven to go.

**HELD BEAT — 60f (2.0s) after `a1_14_narrator`.** **This beat is the joke.**
Nothing happens in it: same star field, same speed, same distance to go. Six
minutes of story time pass inside two seconds of silence, and the audience is
allowed to get bored on purpose. Nothing enters — no bubble, no gesture, no
emotion change.

> **RAY:** Are we there yet?
> **NARRATOR:** Seven minutes down. One to go.

**Pedagogy:** None. It is the episode's first repetition gag and its first
grown-up smirk, and it buys the scale of the distance more cheaply than any
diagram would. `a1_15_ray` is **not a second take** — it is `a1_13_ray`'s
recording, shared through `sameAs`. See Production notes.

---

### Scene 6 — Arrival
**On stage:** Narrator, Ray
**Visual:** Hard cut from black space to a garden at full brightness, all at
once, with no ramp — light does not fade up. Ray ricochets around the frame in
four quick hops: a leaf goes green, a puddle goes silver, a flower goes red, a
dog goes brown and looks up. Then a two-frame dip to near-darkness on the
Narrator's last line, where every one of those colours drains to grey, and back.
**Lines:** `a1_17_narrator`, `a1_18_ray`, `a1_19_narrator`, `a1_20_ray`,
`a1_21_narrator`

> **NARRATOR:** And then Ray arrived, all at once, the way light always does.
> **RAY:** I'm HERE! I'm on a leaf! I'm on a puddle! I'm on a DOG!
> **NARRATOR:** Everything Ray touched, you could suddenly see.
> **RAY:** Is that my job? Do I make things see-able?
> **NARRATOR:** That is exactly your job. Nothing has a colour in the dark.

**Pedagogy:** The foundation the whole episode stands on and the one most
explainers skip — **colour is not a property of an object, it is what light
does with it**. The two-frame drain to grey is the argument; the sentence is
the caption. A child who has watched a red flower go grey when the light left
can be told, five minutes later, that the sky's blue is made of light, and it
will not sound like a trick.

---

### Scene 7 — The plain one
**On stage:** Narrator, Ray
**Visual:** Ray sits on a fence post in the middle of a garden that is
absolutely stuffed with colour — a red flower bed, green grass, a yellow
plastic duck in a paddling pool. Everything else in frame is saturated. He is
the only white thing on screen, and the staging should make that read as
*missing out* rather than as clean.
**Lines:** `a1_22_narrator`, `a1_23_ray`, `a1_24_ray`, `a1_25_narrator`,
`a1_26_ray`, `a1_27_narrator`

> **NARRATOR:** But then Ray looked around, and went very quiet.
> **RAY:** Look at all this. Red flowers. Green grass. A yellow duck.
> **RAY:** Everybody gets a colour. Everybody except me.
> **NARRATOR:** Ray. What colour do you think you are?
> **RAY:** White. Plain white. I'm the plain one.

**HELD BEAT — 24f (0.8s) after `a1_26_ray`.** Short. Sad, not tragic — this show
does not do despair. Just long enough for the sentence to be true for a moment
before somebody argues with it. **Cut the `useEmotion` lead to 0 here**: if the
Narrator's reaction leaks into the silence the beat is spent early.

> **NARRATOR:** Hmm.

**HELD BEAT — 36f (1.2s) after `a1_27_narrator`.** The Narrator declines to
argue, and the audience sits with the wrongest sentence in the episode.

**Pedagogy:** The misconception, said out loud by the character who holds it —
*white is a boring absence of colour*. It is the exact mirror of Puff's
*invisible means nothing*, and it is deliberately the same shape, because the
series has now proved twice that a six-year-old will follow a fact further if a
character is wrong about it first. `a1_23_ray` runs at 0.92 so its three items
separate (Comedy pacing).

---

### Scene 8 — Rain, in the sunshine
**On stage:** Narrator, Ray, Drip
**Visual:** Big fat sunlit raindrops start falling into the garden while the sun
is still blazing. One of them stops in mid-air in front of Ray, turns round, and
has a face on it. Drip, unchanged, waving with both arms.
**Lines:** `a1_28_narrator`, `a1_29_ray`, `a1_30_narrator`, `a1_31_drip`,
`a1_32_narrator`, `a1_33_ray`, `a1_34_drip`

> **NARRATOR:** And right then, it started to rain. In the sunshine.
> **RAY:** Rain? But the sun is still out.
> **NARRATOR:** That is the best kind. Watch what happens.
> **DRIP:** Hi! It's me! I'm the weather!
> **NARRATOR:** That is Drip. Different show. Same rain.
> **RAY:** You're a raindrop. Can I go through you?
> **DRIP:** Come and walk right through the middle of me. Go on.

**Pedagogy:** Sun-and-rain-at-once is the precondition for a rainbow and it is
being taught as a *setting* rather than as a rule, which is how a child will
actually recognise it out of a car window. `a1_32_narrator` is the third firing
of the series' cross-episode rhyme ("Different show. Same sun." / "Same sky.")
and runs at the same flat 0.92 as both previous ones.

---

### Scene 9 — Seven pieces
**On stage:** Narrator, Ray
**Visual:** Ray walks into the raindrop. Inside it, in slow motion, he *bends* —
and then fans apart into seven, in order, red on the outside through to violet.
They come out the far side spread across the garden as a full arc, each one a
small blob with Ray's face on it. Hold the wide.
**Lines:** `a1_35_narrator`, `a1_36_narrator`, `a1_37_ray`, `a1_38_narrator`,
`a1_39_ray`, `a1_40_narrator`

> **NARRATOR:** So Ray walked into the raindrop. And the raindrop bent him.
> **NARRATOR:** And Ray came out the other side in SEVEN pieces.

**HELD BEAT — 60f (2.0s) after `a1_36_narrator`.** **The reveal, and the second
longest silence in the episode.** The arc fans out and holds, with nothing over
it. A six-year-old needs to *count* — seven blobs, seven faces, all of them
his — and counting takes two seconds. If a line lands inside this beat, the
biggest picture in Act One becomes an illustration of a sentence.

> **RAY:** What. What just happened to me.
> **NARRATOR:** Nothing happened to you, Ray. You were always seven.
> **RAY:** I was always SEVEN?
> **NARRATOR:** White light is not one colour. White light is every colour, travelling together.

**Pedagogy:** The act's whole thesis in one sentence, said once, plainly, over
its own proof. Note the framing of `a1_38`: the raindrop did not *add* anything
and did not *change* him — it separated what was already there. That is the
difference between a child thinking rain makes colours and a child knowing
sunlight contains them, and it is the sentence Act Two needs to be true before
it can take the blue out of the beam.

---

### Scene 10 — The roll call
**On stage:** Narrator, Ray
**Visual:** No new staging: the seven blobs from Scene 9 are still standing
there in their arc. Ray floats along the line and greets them one at a time,
left to right, with an eye-line and a wave for each; each one he names bobs
back. His bubble is **"Hi! Hi! Hi! Hi!"**, a summary and not a transcript.
**Lines:** `a1_41_narrator`, `a1_42_ray`, `a1_43_narrator`, `a1_44_ray`

> **NARRATOR:** And now they were not travelling together at all.
> **RAY:** Hi Red. Hi Orange. Hi Yellow. Hi Green. Hi Blue. Hi Indigo. Hi Violet.

**HELD BEAT — 20f (0.7s) after `a1_42_ray`.** The greeting lands. He is still
beaming down the line while the audience works out what they just watched.

> **NARRATOR:** Every single one of them was also Ray.

**HELD BEAT — 24f (0.8s) after `a1_43_narrator`.** **Nothing enters this.** No
wave, no bubble, no entrance, no emotion change — Ray hangs there doing
absolutely nothing while the seven blobs hold their arc behind him. Deadpan is
stillness, and the laugh lives in the silence rather than in the read.

> **RAY:** I have never met me before.

**Pedagogy:** The kids'-series signature, third episode running — episode one's
"Hi Drop, Hi Droppy" was the six-year-old's most-quoted joke and her ep-2
request was literally "more of it". The shape is fixed: a character cheerfully
naming near-identical strangers, one flat explanatory line from the Narrator, an
unbothered button.

It earns its runtime twice over, which is the test. It costs **no new staging
idea** — the seven blobs are standing there anyway, so the gag is seven
eye-lines and a wave. And **the joke is the lesson**: a child who has watched
Ray say hello to seven versions of himself cannot leave this scene thinking
white light is one thing. `a1_42_ray` runs at **0.88, the slowest character line
in the episode** — seven items is the longest list the show has ever run and
they have to separate or they are one noise.

---

### Scene 11 — Big Word One
**On stage:** Narrator, Ray, Drip, **the seven** (silent)
**Visual:** Hard freeze on the arc. **RAINBOW** slams on in wet, rain-streaked
capitals, letters bouncing in one at a time so the word is spelled on screen
(`WordCard`, house signature, identical treatment to the seven cards before it).
The starburst stays behind the banner. Ray sits on the W; Drip
sits on the dot of nothing at all, because there isn't one, so she sits on the
B.

**Visual addition (punch-up C1 — no lines, no beats, no frames):** RAINBOW has
seven letters and Ray has seven colours. As the word lands, the seven blobs come
up **out of the frozen garden** and take one letter each, in spectrum order —
Red on the R, Orange on the a, and so on — one leaving every two and a half
frames, which is the card's own letter stagger, so each colour arrives on the
beat its letter does. **Violet arrives last, finds the W already occupied by
Ray, and spends the rest of the card squeezed onto the far arm of it, half off
the edge, holding on.** Nobody looks at him. Nobody mentions him. He is still
there when the card cuts.

The arc *empties* — the seven are drawn live and the freeze holds the garden
they left, so nothing is duplicated and nothing is added: they were always going
to be the rainbow, and now they are standing in the word for it.
**Lines:** `a1_45_narrator`, `a1_46_narrator`, `a1_47_ray`, `a1_48_narrator`,
`a1_49_drip`

> **NARRATOR:** Seven colours, side by side, bending out of the rain.
> **NARRATOR:** You already know its name. It is a rainbow.

**HELD BEATS — 12f (0.4s) after `a1_46_narrator` and 12f after `a1_47_ray`.**
The house Big Word rhythm, unchanged since episode one. Short, but they are what
make the card feel like a prompt to join in rather than a slide.

> **RAY:** Rain. Bow. RAINBOW!
> **NARRATOR:** Rain and light. That is all a rainbow is.
> **DRIP:** Rain and light! That is you and me!

**Pedagogy:** Big Word One — twice plain (`a1_46`, `a1_48`) plus a chant. The
chant is doing double duty: **rain + bow** is the word taken apart into the two
things that actually made it, so the pronunciation drill and the definition are
the same three seconds. Drip's line is the credit going where it belongs, and it
sets up Scene 13's smirk. C1 helps it for free: seven blobs on seven letters is
one more picture of *seven, all of them Ray*, laid over the word that names it.

**Violet, firing one.** This is the first of three (Scenes 11, 20, 28) and it is
the one that costs nothing at all. He must be the **same blob every time** —
seventh colour, seventh phase, same silhouette — or he is three different
accidents rather than one character.

---

### Scene 12 — One you can try
**On stage:** Narrator, Ray
**Visual:** Ray turns and looks *straight down the lens* — the only time in the
episode he addresses the audience directly. Behind him, the garden empties to a
simple diagram: a low sun on one side, a wall of falling rain on the other, a
small figure standing between them with the sun at their back and an arc
appearing in front of them.
**Lines:** `a1_50_narrator`, `a1_51_narrator`, `a1_52_narrator`, `a1_53_ray`,
`a1_54_narrator`

> **NARRATOR:** Here is one to try, next time it rains while the sun is out.
> **NARRATOR:** Stand with the sun behind you. And then look at the rain.

**HELD BEAT — 45f (1.5s) after `a1_51_narrator`.** **This one is not a joke, it
is homework.** A child needs a second and a half to picture themselves turning
round, and if the next line lands first they will not do it at all. The diagram
animates under the silence; nobody talks.

> **NARRATOR:** A rainbow is always on the opposite side from the sun. Always.
> **RAY:** Because I go INTO the rain and come back OUT again.
> **NARRATOR:** Every rainbow you have seen was light coming back out of rain.

**Pedagogy:** The one claim in this episode a child can personally check, and
it is both true and useful: rainbows are antisolar, which is why you never see
one while squinting at the sun. Ray's line is the *reason* stated by the
character it happened to, so the rule arrives with a mechanism attached rather
than as a fact to memorise.

---

### Scene 13 — Not the plain one
**On stage:** Narrator, Ray, Sunny
**Visual:** The seven blobs snap back together into one white Ray, who is
noticeably brighter than he was in Scene 7 — call it a warmer, fuller white,
with the seven colours faintly visible in his outline for the rest of the
episode. Nobody ever says a word about that. Sunny leans in over the top of
frame, uninvited, on his line.
**Lines:** `a1_55_ray`, `a1_56_ray`, `a1_57_narrator`, `a1_58_sunny`,
`a1_59_narrator`, `a1_60_sunny`

> **RAY:** So I am not the plain one.
> **RAY:** I am not white. I am ALL of them. At the same time.
> **NARRATOR:** He is. And so is every sunbeam Sunny has ever made.
> **SUNNY:** I MAKE RAINBOWS! You're welcome! HA! HA!
> **NARRATOR:** Technically, that one is mostly Drip.

**HELD BEAT — 24f (0.8s) after `a1_59_narrator`.** Sunny, alone in frame, taking
that in.

> **SUNNY:** WE ARE A TEAM! HA! HA!

**Scene tail: 45f.** The act's last laugh gets a second to itself.

**Pedagogy:** The act's turn — same fact as `a1_26`, opposite feeling, which is
the shape episode two used for Puff's catchphrase and the shape this series now
runs on. `a1_57` quietly generalises off the hero (this is true of *all*
sunlight, not of one special beam), and `a1_59` is the episode's first real
correction of Sunny — small, technical, and a warm-up for Act Two.

---

# ACT TWO — THE AIR

*Ray is every colour. The sky is one colour. The difference is what the air does
to him.*

---

### Scene 14 — So why is the sky only blue
**On stage:** Narrator, Ray
**Visual:** Pull straight up off the garden until the frame is all sky again —
the exact framing of the cold open's tilt, held for the same length. The seven
colours ghost faintly across it and fade.
**Lines:** `a2_01_narrator`, `a2_02_narrator`, `a2_03_ray`

> **NARRATOR:** But hold on. We came here to ask about the sky.
> **NARRATOR:** Ray is every colour there is. So why is the sky only blue?
> **RAY:** That is a good question. Why IS it only blue?

**Pedagogy:** The act's question, sharpened by the act that came before it. Act
One did not just teach the rainbow — it made the sky's blueness *strange*, which
is the only state in which a six-year-old will sit still for a mechanism.
`a2_02_narrator` runs at 0.92; it is the sentence the next four minutes answer.

---

### Scene 15 — Myth-bust one: it is not the sea
**On stage:** Narrator, Ray
**Visual:** A postcard-perfect bay, blue sea under blue sky, with a big
arrow drawn from the sea *up* to the sky and a question mark on it. Then a big
red **MYTH** stamp thuds onto the frame and cracks (episode one's stamp, second
firing in the series). Wipe to a desert — orange sand to every horizon, and the
same blue sky. Then a grey day at the same bay, where the sea is grey too.
**Lines:** `a2_04_narrator`, `a2_05_narrator`, `a2_06_narrator`, `a2_07_ray`,
`a2_08_narrator`, `a2_09_narrator`

> **NARRATOR:** Lots of people think the sky is blue because the sea is blue.
> **NARRATOR:** Big myth. Busted.

**HELD BEAT — 30f (1.0s) after `a2_05_narrator`.** The stamp alone on screen,
cracked, silent. The house myth-bust beat.

> **NARRATOR:** The sky is blue over the desert. No sea for a thousand miles.
> **RAY:** So the sea is not doing it.
> **NARRATOR:** It is the other way round. On a grey day, the sea goes grey.
> **NARRATOR:** The sea copies the sky. The sky does not copy the sea.

**Pedagogy:** The commonest wrong answer, and it gets *two* disproofs because
one is a counter-example and the other is a reversal — the desert kills the
claim, the grey day explains why anybody believed it. `a2_09_narrator` runs at
0.92 so the two halves separate; it is the whole correction in eleven words and
it is the one a grown-up will repeat.

---

### Scene 16 — Myth-bust two: show us the paint
**On stage:** Narrator, Sunny
**Visual:** Sunny arrives at speed with the cold open's paint roller, a ladder,
and a dust sheet, and starts confidently painting a patch of sky that is already
blue. On "Show us the paint", everything stops. Hold on the roller. It is
completely dry, and so is the tray.
**Lines:** `a2_10_sunny`, `a2_11_narrator`, `a2_12_sunny`, `a2_13_narrator`

> **SUNNY:** It was PAINT! I painted it! I am extremely good at painting!
> **NARRATOR:** Sunny. Show us the paint.

**HELD BEAT — 45f (1.5s) after `a2_11_narrator`.** Sunny holding a dry roller,
alone in frame, saying nothing, for a second and a half. **Emotion lead cut to
0** — his face must not start to fall before the Narrator has finished the
question, or the reaction pre-empts the joke. Nothing else moves.

> **SUNNY:** I keep the paint somewhere else.
> **NARRATOR:** We will come back to Sunny.

**Pedagogy:** The theory the cold open told the audience to hold onto is not
disproved here, it is only *undermined* — which is on purpose. Sunny does not
get to be wrong until the real answer exists to be wrong against; a myth busted
before its replacement arrives leaves a six-year-old with nothing. "We will come
back to Sunny" is the script promising to do it properly, seven scenes later.

---

### Scene 17 — The sky is not empty
**On stage:** Narrator, Ray, Puff
**Visual:** Ray floats in open blue with nothing anywhere. Then the shot dives
*into* the empty air and the emptiness resolves into a churning crowd of
faint outlined puffs — hundreds, then thousands, packed the whole depth of the
frame, exactly as episode two's cloud interior resolved into drops. Puff himself
bobs up front, at about forty percent opacity, waving.
**Lines:** `a2_14_narrator`, `a2_15_ray`, `a2_16_narrator`, `a2_17_puff`,
`a2_18_narrator`, `a2_19_ray`, `a2_20_puff`, `a2_21_narrator`

> **NARRATOR:** To find the real answer, look at the sky and see nothing.
> **RAY:** There is nothing up there. It is empty.
> **NARRATOR:** It is not empty. It is FULL. It is full of air.
> **PUFF:** Ray! Up here! You can't see me. But you can FEEL me.
> **NARRATOR:** That is Puff. Different show. Same air.
> **RAY:** There are more of you?
> **PUFF:** There are ZILLIONS of us. We are the whole sky.
> **NARRATOR:** Air is real stuff, made of bits far too small to see.

**Pedagogy:** Episode two's entire Big Word, cashed in as a *premise*. A viewer
who has seen it needs no argument; a viewer who has not gets the claim, the
character and the demonstration inside eight lines. Puff's catchphrase fires
**exactly once in this episode**, here, on his entrance, because it is
simultaneously fan service and the load-bearing fact of Act Two.

---

### Scene 18 — Red goes straight through
**On stage:** Narrator, **Puff** (silent)
**Visual:** A cross-section of the air as a wide corridor, drawn in the show's
crayon style, with the faint air-puffs scattered through it like a ball pit. Red
— big, round, unhurried — enters from the left, walks the whole width, clips one
or two puffs without changing direction at all, and exits right.

**Visual addition (punch-up §5, free):** Puff is down in the bottom of the
corridor, and as Red comes over him he **reaches up for a bounce, misses, and
shrugs**. No line, no bubble, no beat, no frame — the document's own answer to
the soft spot at 5:24, taken as a picture rather than as a sixth Puff line. Five
is his count and it stays five (`a2_20` and `a2_44` are the two to cut if that
is one too many, and adding a sixth argues the wrong way). It does not fight the
scene's deliberate boredom, it *is* the boredom: the air offers Red a bounce and
Red does not deviate by a pixel.
**Lines:** `a2_22_narrator`, `a2_23_narrator`, `a2_24_narrator`

> **NARRATOR:** So watch what happens when Ray flies into all that air.
> **NARRATOR:** Red goes first. Red is big and calm, and hardly bounces at all.

**HELD BEAT — 30f (1.0s) after `a2_23_narrator`.** Red crosses the whole frame
in silence, dead straight. The audience has to see *boring* before bouncy means
anything, and a line over the top would make it a demonstration instead of a
comparison.

> **NARRATOR:** Straight through. Barely touched the sides.

**Pedagogy:** The control case, staged first and staged plainly. Half of
scattering is the colours that *don't*, and a child who only ever sees the blue
pinball has watched a special effect rather than a comparison. See **Physics
honesty** in the Production notes for what this scene is and is not allowed to
say about why.

---

### Scene 19 — Blue goes everywhere
**On stage:** Narrator, Ray, Puff
**Visual:** Same corridor, same air-puffs, same entry point. Blue — small, quick,
already vibrating before it enters — hits the first puff and ricochets, then
hits another, then another, until the whole frame is criss-crossed with blue
trails going in every direction including backwards. Puff and the crowd are
delighted and bat him about like a beach ball.
**Lines:** `a2_25_narrator`, `a2_26_puff`, `a2_27_narrator`, `a2_28_ray`,
`a2_29_narrator`

> **NARRATOR:** Now Blue. Blue is jumpy. Blue is the bounciest one there is.
> **PUFF:** Bounce off me! Go on! Everybody bounce off Puff!
> **NARRATOR:** Ping. Ping. Ping.

**HELD BEAT — 45f (1.5s) after `a2_27_narrator`.** The pinballing runs on under
the silence, building until there is blue moving in every direction in frame.
This is the mechanism of the whole episode arriving as a physical event, and it
must not be narrated while it happens.

> **RAY:** Whoa. Where did Blue GO?
> **NARRATOR:** Everywhere. Blue went absolutely everywhere.

**Pedagogy:** Rayleigh scattering at six-year-old resolution, staged as a
difference in *behaviour* between two characters rather than as a property of
light. `a2_27_narrator` is a Narrator sound word alone in its own clip, at 0.9,
so the three pings are three pings.

---

### Scene 20 — Blue, from every direction
**On stage:** Narrator, Ray, **Violet** (silent)
**Visual:** Cut out of the diagram to a kid-height view of a real sky, and draw
blue arrows arriving at the viewer from above, from the left, from the right,
from behind — dozens of them, from everywhere at once, all converging on the
lens. Then pull back to the whole dome of the sky, glowing.

**Visual addition (punch-up C2):** from `a2_34_ray` onward, **Violet is in
frame**, in the bottom corner of the dome, ricocheting harder and faster than
anything else on screen and waving both arms at the lens. He is visibly working
the hardest of any object in the picture. Nobody looks at him, no arrow points
at him, and the Narrator's two lines play over the top of him as if he were not
there. The blue he is being compared with is still a plain dot, up and to the
right of him and barely moving — that asymmetry is the comparison.
**Lines:** `a2_30_narrator`, `a2_31_narrator`, `a2_32_ray`, `a2_33_narrator`,
`a2_34_ray`, `a2_35_narrator`, `a2_36_narrator`, **`a2_36b_ray`**

> **NARRATOR:** Blue is bouncing off the air above you, and beside you, and behind you.
> **NARRATOR:** So wherever you look, blue is bouncing into your eyes.
> **RAY:** So the blue is coming from ALL of the sky.
> **NARRATOR:** So blue is not a patch of the sky. Blue is the WHOLE sky.

**HELD BEAT — 36f (1.2s) after `a2_33_narrator`.** The full dome, glowing, with
nothing over it. The answer to the cold open's question is on screen for the
first time and it deserves a look.

> **RAY:** Hold on. Violet bounces even more than Blue does.
> **NARRATOR:** It does. Our eyes are just not very good at violet.
> **NARRATOR:** They are extremely good at blue. So blue is what we see.

**HELD BEAT — 20f (0.7s) after `a2_36_narrator`.** Violet stops bouncing and
droops. **Nothing else enters this beat** — no bubble, no arrow, no emotion
change on Ray. Deadpan is stillness.

> **RAY:** Sorry, Violet.

Ray looks at him on that line and on no other frame in the episode. The joke is
that nobody looked; the eye-line is the second half of it and must not arrive
early.

**Pedagogy:** The step that turns a bouncing ball into a sky — scattered light
arrives from *every direction*, so the colour is not in one place, it is
everywhere you look. `a2_30_narrator` runs at 0.92 so above, beside and behind
separate. The violet exchange is the episode's honesty tax and its best grown-up
fact: violet really does scatter more, and the reason the sky is not violet is
in the eye, not in the sky. It is two lines long and it is worth every frame,
because the alternative is a confident lie a curious child will catch later.
C2 makes it *kid*-legible as well: the claim is that the sky is not violet
because of **our eyes**, not because of the sky, and the staging now shows
violet doing the work and not being seen, which is the claim as a picture rather
than as a concession. Nobody is pitied — Ray apologises on behalf of everybody's
eyes, which is the same register as him handing Sunny back the half he owns.

---

### Scene 21 — Big Word Two
**On stage:** Narrator, Ray
**Visual:** Hard freeze on the pinballing blue. **SCATTER** slams on in capitals
that fly apart from the centre, letters bouncing in one at a time, each one
arriving from a different direction. `WordCard`, house signature. Blue trails
keep moving faintly behind the banner.
**Lines:** `a2_37_narrator`, `a2_38_narrator`, `a2_39_ray`, `a2_40_narrator`,
`a2_41_ray`

> **NARRATOR:** When light bounces off tiny things and goes everywhere, that is called scatter.
> **NARRATOR:** Scatter. It means to go everywhere at once.

**HELD BEATS — 12f (0.4s) after `a2_38_narrator` and 12f after `a2_39_ray`.**
House Big Word rhythm.

> **RAY:** Scat. Ter. SCATTER!
> **NARRATOR:** Blue light scatters off the air. Everywhere. That is why blue is the whole sky.
> **RAY:** The air scatters me! All day! In every direction!

**Pedagogy:** Big Word Two, and the episode's `EVAPORATION`-equivalent — the one
definition the whole show is built to make chantable. Twice plain (`a2_37`,
`a2_38`), chanted once, then `a2_40_narrator` at 0.92 states the answer to the
episode's title question in fourteen words. **`a2_39_ray` is the TTS risk in
this file**: "Ter" is the only non-word syllable in the episode. Ear-check
before anything is staged; the fallback is pre-written in `narration.mjs`.

---

### Scene 22 — The bit that joins the show together
**On stage:** Narrator, Puff
**Visual:** The three Big Words of episode two ghost up behind the sky —
**AIR**, faint, enormous — and the blue dome glows through it. Puff, at full
opacity now, standing in front of the whole thing with his arms folded.
**Lines:** `a2_42_narrator`, `a2_43_narrator`, `a2_44_puff`

> **NARRATOR:** And here is the bit that joins the whole show together.
> **NARRATOR:** The sky is blue because air is real stuff.

**HELD BEAT — 45f (1.5s) after `a2_43_narrator`.** The sentence alone on screen,
with the AIR ghost behind it. Nothing enters. This is the series interlock and
it is said **once in the episode**.

> **PUFF:** I TOLD you I was real stuff!

**Pedagogy:** Episode two spent ten minutes arguing that air is a material and
ended on a kite. This is the receipt. It is the first time the suite has cashed
one episode's Big Word as another episode's *mechanism* rather than as fan
service, and it is why `a2_43` gets a beat of its own and appears exactly once —
a second firing anywhere would spend it.

---

### Scene 23 — Sunny is wrong
**On stage:** Narrator, Ray, Sunny
**Visual:** Sunny slides into frame at maximum brightness, roller in hand, and a
diagram assembles itself out of his own beams as he brags — sun to sky, sky
goes blue — and then, on "He is wrong", the diagram simply stops, and the beams
holding it up droop. On his recovery it reassembles with the air drawn *in* it,
bigger and more accurate than the one he built.
**Lines:** `a2_45_sunny`, `a2_46_ray`, `a2_47_sunny`, `a2_48_narrator`,
`a2_49_narrator`, `a2_50_sunny`, `a2_51_narrator`, `a2_52_ray`, `a2_53_sunny`,
`a2_54_narrator`, `a2_55_narrator`

> **SUNNY:** EXCUSE ME. Whose light is that?
> **RAY:** Um. Yours.
> **SUNNY:** So I painted the sky! With my sky paint! Obviously!
> **NARRATOR:** I checked. Then I checked again.

**HELD BEAT — 45f (1.5s) after `a2_48_narrator`.** Sunny holding an enormous
smug grin, alone in frame, absolutely certain of what is coming next. Two
episodes have trained the audience to expect "He is right. Again." **Emotion
lead cut to 0** on the next line.

> **NARRATOR:** He is wrong.

**HELD BEAT — 36f (1.2s) after `a2_49_narrator`.** Three words, and then nothing
at all. Sunny's grin does not move for the first half of this beat and comes
apart in the second.

> **SUNNY:** Wrong. Me. I have never been wrong.
> **NARRATOR:** There is no paint. There never was. The air does all of it.
> **RAY:** But Sunny. Every bit of that blue is your light.

**HELD BEAT — 30f (1.0s) after `a2_52_ray`.** It lands on him. Nobody helps.

> **SUNNY:** MY LIGHT! THE SKY IS MADE OF MY LIGHT! YOU'RE WELCOME! HA! HA!
> **NARRATOR:** He is wrong about the sky. He is right about the light.

**HELD BEAT — 20f (0.7s) after `a2_54_narrator`.** Short — this is a comma, not
a full stop. Sunny is already re-inflating behind it.

> **NARRATOR:** He will only remember one of those.

**HELD BEAT — 45f (1.5s) after `a2_55_narrator`.** The grown-up laugh goes here.
Sunny, restored to full brightness, posing in front of a diagram that no longer
says what he thinks it says. Unseasoned button, no gesture, nothing enters.

**Pedagogy:** The mechanism said back by the character who is the first link,
and then corrected — sun to *air*, not sun to sky. Structurally this is episode
two's "I checked. Then I checked again. He is right. Again." escalated in the
only direction left: same two-beat concession, opposite verdict, and then a
second concession going the other way, because he *is* right about the source
and the show does not cheat to get its joke.

**`a2_47_sunny`'s three halves, and how they are now separated.** This scene
note asks for the three halves of the brag to land separately — Sunny builds one
third of his diagram on each. That used to be bought with the file's only two
pause markers (`<#0.3#>`, a MiniMax feature). Sunny is back on kokoro, which
cannot take a marker at all (the generator rejects the line rather than let the
model read the punctuation out loud), so the separation is bought with
**`speed: 0.92`** instead, exactly as the Narrator's two equivalents (`a2_27`,
`a3_13`) have always bought theirs. **There are now no pause markers anywhere in
the episode.** If the ear-check finds the three halves still running together,
the fix is a slower `speed` (0.88, as `a1_42` and `a2_43` use) — not a rewrite
of an approved line, and not three separate clips, which would move the timing
into `gaps` and change what the diagram is built on. Every other silence in the
episode is a held beat between lines and lives in `Video.tsx`.

Episode two's `a2_45_narrator` — *"One day Sunny will be wrong about something.
It is not today."* — is the promise this scene keeps. It was planted four
minutes before the end of that episode specifically so this one could collect
it, and a returning six-year-old should recognise the shape of the beat before
the verdict lands.

---

### Scene 24 — Not the plain one any more
**On stage:** Ray
**Visual:** Ray alone against the whole blue dome, at his brightest yet, the
seven colours just visible in his outline. Then pull back and *keep* pulling
back, until he is one speck in a sky that is entirely made of what he is doing.
**Lines:** `a2_56_ray`, `a2_57_ray`

> **RAY:** I am not the plain one any more.

**HELD BEAT — 30f (1.0s) after `a2_56_ray`.** He looks up at the sky he is
apparently the whole of.

> **RAY:** Look up. That's me.

**Scene tail: 45f.** The catchphrase's first firing gets the act's last second.

**Pedagogy:** The arc's turning point, timed to sit exactly between the
mechanism (Acts One and Two) and the consequence (Act Three), which is where
episode two put Puff's. The catchphrase is deliberately a *pointing* line rather
than a boast: a child watching can do what it says, immediately, and be right.

---

# ACT THREE — THE LONG WAY

*Same sun, same air, same Ray. A longer trip, and a different colour.*

---

### Scene 25 — Down at the sea, going orange
**On stage:** Narrator, Ray
**Visual:** A wide sea horizon, late. The blue is draining out of the top of the
frame and warm colours are creeping in along the waterline. Ray hangs low over
the water, and the light on him is coming in almost horizontally, throwing a
long shadow off a rock. Far out on the horizon, frame left, a small island
volcano is fast asleep, snoring smoke rings on a three-second loop — the same
volcano, the same place on the horizon, as episode two's beach.
**Lines:** `a3_01_narrator`, `a3_02_narrator`, `a3_03_narrator`, `a3_04_ray`,
`a3_05_narrator`

> **NARRATOR:** The day went on. Ray kept scattering, and the sky kept being blue.
> **NARRATOR:** And then, slowly, the light started coming in sideways.
> **NARRATOR:** So we went down to the sea to watch.
> **RAY:** Why is it going orange? Did somebody change me?
> **NARRATOR:** Nobody changed you. You are the same light you were this morning.

**Pedagogy:** The act's question, and its answer stated before its mechanism —
on purpose. The commonest wrong model of a sunset is that the light *changes*
colour at the end of the day, and the fastest way to kill it is to say plainly
that nothing about the light changed, then spend four scenes on what did.

---

### Scene 26 — The volcano
**On stage:** Narrator (voice only)
**Visual:** The camera drifts, apparently idly, across the horizon and settles
on the sleeping volcano for the whole scene. It does nothing. The smoke rings
puff on their loop. Ray is not in frame, nobody looks at it, and no bubble, no
arrow and no music sting acknowledges it in any way.
**Lines:** `a3_06_narrator`

> **NARRATOR:** The volcano is still asleep. It has been asleep a very long time. It is extremely good at it.

**HELD BEAT — 60f (2.0s) after `a3_06_narrator`.** Hold on the volcano. Nobody
reacts, nothing else happens, and then the episode simply carries on with the
sunset as though the last twelve seconds did not occur.

**Pedagogy:** None, deliberately. This is a **planted series running gag with no
punchline yet** — it was staged with no dialogue at all in episode two (scenes
23 and 24, on the same horizon, nobody mentioning it) and this is the first and
only time anybody acknowledges it in three episodes. **Do not explain it, do not
let a character talk to it, and do not give the Narrator a second line about
it anywhere in this episode.** The whole value of the beat is that the show
appears to think it is not important. It wakes up in Scene 35.

---

### Scene 27 — The long way through
**On stage:** Narrator, Ray
**Visual:** A cross-section of the Earth with the air drawn as a thin shell
around it. Two beams: a midday one coming straight down through a short slice of
that shell, and a sunset one coming in almost flat and travelling through a
very long slice of it. Draw both paths as measurable lines and let the sunset
one keep going, and going, across the whole width of the frame.
**Lines:** `a3_07_narrator`, `a3_08_narrator`, `a3_09_narrator`, `a3_10_ray`,
`a3_11_narrator`

> **NARRATOR:** Here is what changed, and it is not Ray.
> **NARRATOR:** At lunchtime, Ray came straight down. A short trip through the air.
> **NARRATOR:** Now the sun is low. So Ray comes in sideways, along the ground.
> **RAY:** And how long is that trip?
> **NARRATOR:** Hundreds of miles of air, instead of a few.

**Pedagogy:** The only new physics in Act Three, and it is a *geometry* fact
rather than a light fact — which is why it gets its own diagram. Everything the
sunset does follows from path length, and path length is the one part a
six-year-old can see with a ruler.

---

### Scene 28 — Blue runs out
**On stage:** Narrator, Ray
**Visual:** Follow the sunset beam along its whole path, left to right, in one
continuous move. The seven colours travel together at the start. Blue pings out
sideways at the first air-puff, then another blue, then another, and the beam
visibly *loses* its blue as it goes — indigo and violet go with it — until what
arrives at the right-hand edge is red and orange and nothing else. Land on an
eye at the far end.
**Visual addition (punch-up C3):** the three blobs who leave the beam first are
**Blue, Indigo and Violet**, in that order — which they already were. Each one
now turns back on its way out and waves; Ray, riding the beam, waves back at
each, with an eye-line, exactly as he did along the arc in Scene 10. **Violet is
the last of the three to go and goes furthest.** Green and Yellow leave inside
the 45f drain beat and do **not** wave: nothing enters that beat.
**Lines:** `a3_12_narrator`, `a3_13_narrator`, `a3_14_narrator`,
**`a3_14b_ray`**, **`a3_14c_narrator`**, **`a3_14d_ray`**, `a3_15_ray`,
`a3_16_narrator`, `a3_17_ray`, `a3_18_narrator`

> **NARRATOR:** And you know what blue does in air. Blue bounces.
> **NARRATOR:** Bounce. Bounce. Bounce. All the way along.

**HELD BEAT — 45f (1.5s) after `a3_13_narrator`.** The blue drains out of the
beam in silence, one ping at a time, over most of the width of the frame. This
is Act Two's mechanism doing something *new*, and it needs to be watched rather
than described. Nothing enters.

> **NARRATOR:** By the time that light reaches you, the blue has all bounced away.
> **RAY:** Bye Blue! Bye Indigo! Bye Violet!

**HELD BEAT — 20f (0.7s) after `a3_14b_ray`.** The goodbye lands. Ray is still
waving after them while the audience works out who just left.

> **NARRATOR:** They did not go anywhere. They went everywhere else.

**HELD BEAT — 24f (0.8s) after `a3_14c_narrator`.** **Nothing enters this.** No
wave, no bubble, no entrance, no emotion change — Ray hangs there in a beam that
is now red and orange, doing absolutely nothing. Same beat, same length and same
reason as Scene 10's.

> **RAY:** I will see me later.
> **RAY:** So who is left?
> **NARRATOR:** The ones that never bounced much. Red. And orange.
> **RAY:** The calm ones.
> **NARRATOR:** The calm ones. Straight down the middle, all the way to your eyes.

**Pedagogy:** The payoff of Scene 18, which is the whole reason a boring red
crossing an empty corridor got its own thirty-frame beat five minutes ago. The
sunset is *the same mechanism as the blue sky*, run for longer — not a second
effect, not a different light, and emphatically not somebody taking the colours
away. `a3_13_narrator` runs at 0.88 so the three bounces are three bounces;
`a3_16` at 0.92 so red and orange land separately.

**The roll call, second firing** (punch-up C3), and it does four jobs. It is the
series signature fired twice in an episode for the first time. It costs no new
staging idea — the scene already loses Blue, Indigo and Violet in that order, so
the gag is three eye-lines and a wave. It gives Ray his only *attitude* in Act
Three instead of another question, and he is **not sad about it**, which is what
keeps the sunset from reading as the light dying (the Scene 31 guardrail, five
scenes early). And `a3_14c_narrator` is the one place in the episode where the
physics-honesty rule above — *nothing is taken away* — is said out loud rather
than trusted to the staging. Naming the three a beat before `a3_15` turns "So
who is left?" into a question the audience can answer.

---

### Scene 29 — Big Word Three
**On stage:** Narrator, Ray, Sunny
**Visual:** Freeze on the sea horizon at full sunset. **SUNSET** slams on in
capitals lit from below in red and orange, letters bouncing in one at a time.
Then Sunny, half sunk behind the sea, leans on the bottom of the card.
**Lines:** `a3_19_narrator`, `a3_20_ray`, `a3_21_narrator`, `a3_22_sunny`,
`a3_23_narrator`

> **NARRATOR:** Red and orange, right across the sky. That is a sunset.

**HELD BEATS — 12f (0.4s) after `a3_19_narrator` and 12f after `a3_20_ray`.**
House Big Word rhythm, third and last firing.

> **RAY:** Sun. Set. SUNSET!
> **NARRATOR:** Same sun. Same air. Same Ray. Just a much longer way through.
> **SUNNY:** I do this bit ON PURPOSE! For the drama! You're welcome!
> **NARRATOR:** A sunset is not different light. It is the same light, taking the long way.

**Pedagogy:** Big Word Three — plain twice (`a3_19`, `a3_23`) plus the chant,
with the act's thesis at 0.9 between them. `a3_21_narrator` is four two-word
clauses and it is the sentence a parent will use next time they are asked;
`a3_22_sunny` is the running gag's fifth firing and the only credit he has left,
which is that it looks nice.

---

### Scene 30 — The blue crayon goes back in the box
**On stage:** Narrator (voice only)
**Visual:** Return to the cold open's exact framing — the same overhead shot,
the same grass, the same kid, the same drawing with its blue band across the
top. The light on the page is orange now. The hand comes into frame holding the
blue crayon, hesitates, and puts it back in the box.
**Lines:** `a3_24_narrator`, `a3_25_narrator`, `a3_26_narrator`

> **NARRATOR:** Back on the hill, the kid was still colouring.

**HELD BEAT — 45f (1.5s) after `a3_24_narrator`.** The kid looks up at the
orange sky, then down at the page, then at the crayon in their hand. Silent.
The audience is a full beat ahead and gets to sit in it.

> **NARRATOR:** The blue crayon went back in the box.

**HELD BEAT — 36f (1.2s) after `a3_25_narrator`.** The hand searches the box,
finds the orange, and starts colouring over the top of the blue band. No
narration.

> **NARRATOR:** Some days you need a different crayon. Nothing else changed at all.

**Pedagogy:** The frame story closes on the child's own terms and without a
single word of physics: the sky they coloured in at the top of the show now
needs a different crayon, and they know exactly why. The last line is the
episode's thesis in nine words — nothing changed but the *route*. The kid never
speaks in this episode, and the crayon is the entire emotional readout.

---

### Scene 31 — Round the other side
**On stage:** Narrator, Ray, Sunny
**Visual:** The last sliver of sun goes under the sea. Pull back and *keep*
pulling back, off the coast, off the country, until the whole planet is in frame
turning slowly, with the line between day and night sliding across it. Ray is a
single glint on the retreating edge.
**Lines:** `a3_27_ray`, `a3_28_narrator`, `a3_29_ray`, `a3_30_narrator`,
`a3_31_sunny`

> **RAY:** Look up. That's still me.
> **NARRATOR:** The last of the light slid off the sea, and went round the world.
> **RAY:** Wait. Am I finished?
> **NARRATOR:** No. Somewhere out there, it is already morning.

**HELD BEAT — 30f (1.0s) after `a3_30_narrator`.** The terminator keeps sliding.
Nothing else.

> **SUNNY:** *(distant, from over the far horizon)* GOOD MORNING, EVERYBODY!

**HELD BEAT — 75f (2.5s) after `a3_31_sunny`.** **The longest silence in the
episode and the end of the story.** The planet turns, the daylight edge moves on
across an ocean, and a new blue sky comes up on the far side. No narration, no
dialogue, no music sting. If any line lands inside these seventy-five frames,
the episode does not have an ending.

**Pedagogy:** The sunset is not the light stopping, it is the light *moving on*
— which is the same "it never stops" beat episode one closed its cycle with, and
the one thing that keeps an ending about fading daylight from reading as sad.
`a3_31_sunny` is **the same recording as `a1_03_sunny`**, shared through
`sameAs`: the joke and the comfort both depend on it being audibly the identical
take of the identical greeting, eight minutes later and a world away.

---

# RECAP

*Roughly ninety seconds. Chant, mind-blower, tease.*

---

### Scene 32 — The chant
**On stage:** Narrator, Ray, Puff, Sunny
**Visual:** Three-way split screen, one character per panel, each panel lighting
up as it takes its word, exactly as episodes one and two did it. The word slams
in over each panel in that act's colour — rainbow spectrum, sky blue, sunset
orange.
**Lines:** `rc_01_narrator`, `rc_02_ray`, `rc_03_puff`, `rc_04_sunny`,
`rc_05_narrator`

> **NARRATOR:** Let's say the big words together. Ready?
> **RAY:** RAINBOW! Rain and light! Seven colours, and every one of them is me!
> **PUFF:** SCATTER! Blue bounces off us and goes EVERYWHERE! That is me!
> **SUNNY:** SUNSET! That is my light taking the long way! You're welcome!
> **NARRATOR:** Rainbow. Scatter. Sunset.

**Pedagogy:** Final pass on all three Big Words, each re-attached to the
character who embodied it — the same retrieval trick both previous episodes
used. Note that the Narrator does **not** take a word this time (there are three
words and three characters); he takes the summary instead, at 0.88, which is the
slowest line in the recap and the one a grown-up rewinds.

---

### Scene 33 — Right now, over everybody's house
**On stage:** Narrator (voice only)
**Visual:** A slow turning globe with the daylight side glowing blue, then a
push down through it to an ordinary street, an ordinary garden, an ordinary
window with an ordinary blue sky over it. Hold long enough for a parent to
photograph the three words stacked in the corner.
**Lines:** `rc_06_narrator`, `rc_07_narrator`

> **NARRATOR:** And the blue is happening right now. Over your house. Over everybody's house.
> **NARRATOR:** It is not painted on. It is made every day, out of light and air.

**Pedagogy:** The claim that makes the episode portable — this is not a thing
that happened to Ray, it is a thing happening over the roof of the room the
child is sitting in. "Not painted on" is also the last quiet kick at Sunny's
theory, and the title paying itself off.

---

### Scene 34 — The mind-blower
**On stage:** Narrator, Ray, **Sunny**
**Visual:** Cut to the Moon. An astronaut stands in blinding, obvious sunlight —
their suit lit hard, a crisp black shadow beside them, a bright grey landscape
running to a close horizon. And above all of it, filling three quarters of the
frame, a completely **black** sky full of stars. Keep it wondrous: the
astronaut waves, the Earth hangs in the black like a blue marble, and there is
nothing frightening anywhere in the shot.

**Visual addition (punch-up C4):** something is already lighting this shot — the
shadow is hard-edged and lies to the left — so the **sun is in the top right
from the first frame**, a white blaze with the stars visible right up against
it, because there is no air to smear it across a sky. On `rc_09b_sunny` it opens
an eye: he is blazing, enormous, unmistakably Sunny, and he is **surrounded by
stars, in the middle of the day**, which is the whole lesson. The astronaut's
existing wave already points at him. Keep it wondrous, not lonely — nobody is
alone in this shot, and Sunny in it is warmer than the astronaut on his own.
(Two consequences: the Earth moved to the top **left**, and Ray shifted left to
x=1210. Both are noted in `scenes/recap.tsx`.)
**Lines:** `rc_08_narrator`, `rc_09_narrator`, **`rc_09b_sunny`**,
`rc_10_narrator`, `rc_11_ray`, **`rc_11b_sunny`**, `rc_12_narrator`,
`rc_13_narrator`, `rc_14_ray`, `rc_15_narrator`

> **NARRATOR:** Now here is the amazing part.
> **NARRATOR:** Somebody is standing on the Moon. The sun is shining right on them.
> **SUNNY:** THAT IS ME! I am shining on the MOON as well!
> **NARRATOR:** It is the middle of the day. And the sky above them is BLACK.

**HELD BEAT — 60f (2.0s) after `rc_10_narrator`.** The impossible picture, alone
on screen, for two full seconds. Bright sunlight and a black sky in the same
frame is the single most counter-intuitive image in three episodes and the
audience needs time to disbelieve it before anybody explains. **Nothing enters
it, including Sunny** — he is in the picture, blazing, and he does not move,
react or change expression for the whole two seconds. His rays do not spin at
all in this scene: nothing shimmers where there is no air.

> **RAY:** Black? In the daytime? Why?
> **SUNNY:** So where is the sky? I am RIGHT HERE.
> **NARRATOR:** Because the Moon has no air. And no air means nothing to bounce blue off.
> **NARRATOR:** The light is still there. There is nothing for it to scatter on.
> **RAY:** So the blue sky is a thing the AIR does.
> **NARRATOR:** Air, and light, and nothing else. That is your whole blue sky.

**Pedagogy:** The fact the child repeats at dinner, and — unusually for a
mind-blower — it is also **the proof**. Everything before this was a mechanism
the audience was asked to accept; the Moon is the controlled experiment with the
air taken out, and the result is the one the mechanism predicts. It only lands
because Act Two spent seven scenes insisting the sky is full rather than empty.
Since C4 the control experiment is **stated by the constant in it**: Sunny
claims the Moon one line before the Moon turns out not to have a sky (the cold
open's shape — state the wrong theory, then break it — compressed into ten
seconds), and `rc_12`/`rc_13` are unchanged but now play as answers to a
question rather than as narration over a picture. He is baffled, not upset, and
he is not wrong: the sun really is visible in a black lunar sky.

**Does this spend `rc_18_sunny` ("That is not me.")?** No — it sharpens it. Here
he demands to be acknowledged; a minute later, offered a free claim on the
biggest thing on the horizon, he declines it. Two firings of "that one is me as
well" close together make the inversion read as a change in the character rather
than as a one-off line. Neither new line uses "You're welcome!" (seven firings is
the ceiling) and neither uses "EXCUSE ME" (`a2_45` is its only firing).

---

### Scene 35 — Tease and sign-off
**On stage:** Narrator, Sunny, Ray
**Visual:** Back to the sea horizon at dusk, the exact framing of Scene 26. The
volcano, still asleep. Then one smoke ring comes out **wobbling**, and does not
close. A low rumble moves the water. Sunny, half under the horizon, stops
mid-pose and squints at it. Then the episode four title card, with Ray waving
from the corner.
**Lines:** `rc_16_narrator`, `rc_17_narrator`, `rc_18_sunny`, `rc_19_ray`

> **NARRATOR:** Next time.

**HELD BEAT — 45f (1.5s) after `rc_16_narrator`.** The wobbling smoke ring,
alone, in silence.

> **NARRATOR:** Something is waking up.

**HELD BEAT — 60f (2.0s) after `rc_17_narrator`.** The rumble, felt in the water
and in the smoke, with nothing said over it. **Keep this wondrous, not
frightening** — no dark chord, no red glow, no shaking camera. Something large
is stirring in a friendly world.

> **SUNNY:** That is not me.

**HELD BEAT — 45f (1.5s) after `rc_18_sunny`.** Sunny still squinting at the
horizon, unusually quiet. **Emotion lead cut to 0**; he is not playing a
reaction, he is genuinely not sure. Nothing enters.

> **RAY:** Bye! Look up. That's me.

**Pedagogy:** Series continuity, and the payoff of the show's oldest running
gag. Sunny claimed everything in episodes one and two ("OH, that one is me as
well!"), was told in episode two that he would one day be wrong, was wrong in
Scene 23 — and now, offered a free claim on the biggest thing on the horizon,
**declines it**. Three words, and they plant the whole of episode four: whatever
that is, it is not the Sun's.

---

## Production notes

**Tone guardrails.** Unchanged from episodes one and two. No sarcasm a
six-year-old cannot parse — the Narrator's deadpans are always *about* obvious
behaviour (Sunny bragging, Sunny holding a dry roller), never an ironic
reversal. No scary peril: the volcano tease is stirring, not threatening, and
the sunset must never read as the light dying — Scene 31 exists to make it a
journey. No potty humour. Nobody is unkind: Ray corrects Sunny by *giving* him
the half he actually owns, and Sunny's wrongness is played as a man
enthusiastically rebuilding his own diagram rather than as a comeuppance.

**Line length.** Almost every line sits between five and fifteen words. Exactly
one line in the episode exceeds fifteen: `a3_06_narrator`, the volcano, at
nineteen — three short sentences, and it is long because it is a deadpan that
has to keep going for slightly too long. Nothing anywhere near twenty-five.

**Comedy pacing is designed in, not added later.** Both halves of the STYLE.md
rule are already written down here:

- **Slower per-line speeds** for every list, roll call, sound word and repeated
  straight-line, set in `narration.mjs` with a comment saying why.
  Seventy-three lines carry an override. The deadpan floor is `a2_49_narrator` ("He is wrong.")
  at 0.85; the slowest character line is the seven-name roll call at 0.88, tied
  with `a3_06` (the volcano), `a3_13` ("Bounce. Bounce. Bounce."), `a2_43` (the
  interlock) and `rc_05` (the summary).
- **Held beats of silence**, forty-four of them, each written above with its
  exact frame count and its reason. They become `gaps` in `Video.tsx`. The
  longest is the world turning (75f), and six two-second holds carry the
  episode's biggest pictures: the crayon choice, the middle of the eight-minute
  journey, the seven-piece reveal, the volcano, the black lunar sky and the
  rumble under the tease.
- **No emotion lead on held-beat scenes.** The staging kit's default eight-frame
  `useEmotion` lead will leak a punchline into the silence in front of it.
  Scenes 7, 16, 23 and 35 say so explicitly; treat it as the rule for every held
  beat.

**Running gags, and where they fire.**
- *"Look up. That's me."* — `a2_57`, `a3_27` (in its sunset form, "That's
  still me"), `rc_19`. Ray's catchphrase, and deliberately a *pointing* line: a
  child can obey it and be right. Its negative version, *"I'm the plain one"*,
  fires at `a1_24`/`a1_26` and is answered at `a1_55`/`a2_56` — same fact,
  opposite feeling, which is the shape Puff's catchphrase established.
- *"Are we there yet?"* — `a1_13`, `a1_15`. Two firings, identical text,
  **identical recording** (`sameAs`). The flat almanac answers either side are
  the joke.
- *"You're welcome!" / "HA! HA!"* — `co_08`, `a1_11`, `a1_58`, `a1_60`, `a2_53`,
  `a3_22`, `rc_04`.
- *"That one is me as well!"* — collected in `co_08` (the paint theory), broken
  in `a2_49`–`a2_55`, and finally **inverted** in `rc_18` ("That is not me."),
  which is the first time in three episodes Sunny has declined a claim.
- *"Different show. Same sun / sky / rain / air."* — `a1_32` (Drip), `a2_18`
  (Puff). Both at 0.92, the same flat read as episode two's two firings.
- *"You can't see me. But you can FEEL me."* — `a2_17`, once, on Puff's
  entrance.
- *The roll call* — **twice**. `a1_42`+`a1_43`+`a1_44` in Scene 10 (a greeting)
  and `a3_14b`+`a3_14c`+`a3_14d` in Scene 28 (a goodbye). The series signature,
  third episode running, and the first episode to fire it twice — episode two's
  punch-up found that re-firing it was the cheapest big laugh available, and the
  finding transferred. Same fixed shape both times: a character cheerfully
  naming near-identical strangers, one flat explanatory line from the Narrator,
  an unbothered and deliberately unseasoned button.
- *Nobody ever notices Violet* — **three firings, no lines, no clips, no
  runtime**, carried entirely by a character who never speaks. Scene 10 plants
  it (Ray greets him by name, last in the list of seven); Scene 11 fires it
  (he gets to the RAINBOW card last and ends up half off the W); Scene 20 pays
  it off (he out-bounces the entire frame, is ignored, droops — "Sorry,
  Violet."); Scene 28 buttons it (last of the three to leave the sunset beam,
  and goes furthest). **He must be the same blob every time** — same seventh
  colour, same `SHARD_PHASE[6]`, same silhouette — or he is four different
  accidents. He does not get a line, ever: the moment he speaks he is a sixth
  voice, an audition and a cast-table row, and the joke stops being that nobody
  notices him.
- *The volcano is asleep.* — Scene 26 (`a3_06`, the only line anybody ever gives
  it) and Scene 35 (it stirs). Everywhere else on a coastal horizon it is
  scenery and nobody mentions it. See below.

**The volcano rule, for whoever stages Act Three.** It sits on the *measured*
horizon, exactly as it did in episode two — sample the plate or read the drawn
`HORIZON`, never guess, or it floats. It must be **continuously visible for the
whole shot** it appears in; a background gag that vanishes mid-scene reads as a
bug (that is why episode two cut it from its Scene 26). It gets one line in
Scene 26 and one wobble in Scene 35, and nothing else in the episode may look at
it, point at it, or explain it.

**Big Word cards.** Three `WordCard`s, at roughly minute four, minute seven and
minute nine — comfortably inside STYLE.md's one-a-minute ceiling and evenly
spread across the three acts. All three use the house treatment (hard freeze,
capitals, letters bouncing in one at a time, starburst behind the banner). The
*voice* treatment is episode one's syllable chant rather than episode two's
letter-spelling; see **The three Big Words** above for why, and note that this
means there is no spelled-letter line in the episode at all — which removes what
episode two's own ear-check list called "the highest risk in the episode".

**Physics honesty, and the two things this script may not say.**
- **Blue is never "smaller".** Wavelength is not available at this age and the
  half-memory a child would take away ("blue light is small") is worse than no
  memory at all. The script says **jumpy** and **bouncy** for blue and **big and
  calm** for red, which is a behaviour a six-year-old can see in the staging and
  which does not have to be unlearned later. No numbers, no nanometres, no
  spectrum diagram with units.
- **Nothing is taken away.** Scattering is bouncing, not theft — see the title
  note. Act Three is the one place where a colour genuinely does go missing from
  a beam, and it is staged as blue *bouncing off sideways*, visibly, into the
  rest of the sky, rather than as blue being removed.
- **The violet answer is honest** (`a2_34`–`a2_36`): violet scatters more, and
  the reason we do not see a violet sky is our own eyes. That is the true
  first-order answer and it costs two lines.
- **The sea myth-bust is the true direction** (`a2_08`, `a2_09`): the apparent
  colour of the sea tracks the sky, not the other way round, which is why a grey
  day has a grey sea.
- **The Moon is the control experiment**, and it is stated as one: same
  sunlight, no air, no blue.

**Sound-word spellings** are locked to the exact strings in `narration.mjs` —
WHOOSH, Ping, and the three chants. Do not "correct" them. **And the shaping is
per engine.** There is not one stretched vowel on a character line in this file:
Ray, Drip and Puff are on MiniMax, which reads a repeated letter as separate
syllables, so where episode two would have written "Ohhh" or "Whoaaa" the length
comes from `emotion` and `speed` instead. "Ping. Ping. Ping." survives because
it is a Narrator line and stays on kokoro. **Sunny is now on kokoro too**, so a
stretched vowel would in fact work on his lines — he does not have one, and he
should not grow one, because he has not had one in three episodes and a
character who suddenly starts saying "HAAA" is a different character.
**If Ray is recast, sweep his
sound words before assuming the clips are the same clips** — that is a rule
episode two learned twice, once on Puff and once on a rock.

The *drawn* words are allowed to disagree with the spoken ones, as ever: a
speech bubble may read "WHOOOSH!" while the clip says "WHOOSH!". Say so in the
scene file where it happens, or the next reader will "fix" one of them.

**The two shared recordings.** `a1_15_ray` is `a1_13_ray` and `a3_31_sunny` is
`a1_03_sunny`, both through the generator's `sameAs`. Neither is a
re-recording, and neither may become one: MiniMax returned episode two's one
repeated sentence at 2.20s and then 2.84s, a thirty percent swing in the line
whose entire job was to sound identical. `a3_31_sunny` is **kept on `sameAs`
even though Sunny is back on kokoro**, where two identical specs would come back
byte-identical anyway — `sameAs` is engine-agnostic (it copies the source's
bytes) and it *states* the intent, so nobody can reword one of the two greetings
without the other following. Both gags here are *only* the sameness
— a second take of "Are we there yet?" is not the joke, and a second take of
"GOOD MORNING, EVERYBODY!" from over the far horizon is not the ending. Reword
either source line and the alias re-copies automatically; there is nothing to
keep in step by hand.

**Audition list — do this before any visual work.** Ray is on a placeholder and
has never been heard. Audition on the four lines that ask four different things
of one voice, not on the first one he says:

1. **`a1_26_ray`** — "White. Plain white. I'm the plain one." Small, flat, `sad`,
   and the hardest thing he does. If this one is cloying, nothing else matters.
2. **`a1_18_ray`** — "I'm HERE! I'm on a leaf! I'm on a puddle! I'm on a DOG!"
   The delighted shout, and the widest he ever opens up.
3. **`a1_42_ray`** — the seven-name roll call at 0.88. The test is whether seven
   items separate without sounding like a register being taken.
4. **`a2_39_ray`** — "Scat. Ter. SCATTER!" The chant with the only non-word
   syllable in the episode.

```
npm run narration -- --audition sky-blue:a1_26_ray <dir> \
  --engine minimax --voices Decent_Boy,Young_Knight,Sweet_Girl_2,Lovely_Girl \
  --emotion sad
```

**Ear-check list, once everything is generated**, in this order:

1. **Ray's voice itself**, across the four audition lines above, then a
   screen-test run of his arc (`a1_07` → `a1_26` → `a1_44` → `a2_57` → `a3_27`).
2. **The three chants** (`a1_47`, `a2_39`, `a3_20`) — the highest TTS risk in the
   file and all three unheard. Fallbacks are pre-written in `narration.mjs`.
   `a2_39` is the likeliest to need one.
3. **`a1_42_ray`, the roll call, as a run**, then `a1_43_narrator` flat, then
   `a1_44_ray` unseasoned. If the button sounds like it is being sold, it is
   wrong; it is a mild fact about having met himself.
4. **`a2_27_narrator`** ("Ping. Ping. Ping.") — a sound word alone in a clip, on
   kokoro, so it is free to re-cut but it has never been said.
5. **`a2_47_sunny`** — the only line whose internal timing is not a `gap`, and
   the one the pause markers used to buy. On kokoro at 0.92, listen for **three
   halves, not one sentence**: "So I painted the sky!" / "With my sky paint!" /
   "Obviously!" Scene 23 builds a third of his diagram on each, so if they run
   together the diagram assembles as one move. Fix is `speed` (0.88), never the
   text.
6. **Sunny's concession run** (`a2_48` → `a2_49` → `a2_50` → `a2_53`). Listen
   for two things: that `a2_49` ("He is wrong.") at 0.85 is flat rather than
   sad, and that `a2_50` at 0.95 — **now unseasoned, on kokoro** — reads as a
   man discovering a new sensation rather than as hurt. The three flat full
   stops are the whole read; the doubt is on his face, in the 36f beat in front
   of it.
7. **The six punch-up lines**, which are the only clips in the file nobody has
   heard in context. Three of them are the ones that fail by being *sold*:
   `a2_36b_ray` ("Sorry, Violet.") and `a3_14d_ray` ("I will see me later.") are
   both unseasoned on purpose — same call as `a1_44_ray` — and if either sounds
   like a punchline being delivered it is wrong. The third is
   `a3_14b_ray` ("Bye Blue! Bye Indigo! Bye Violet!") at 0.9: three items, and
   they have to separate or they are one noise. Sunny's two (`rc_09b`, `rc_11b`)
   are free to reword on kokoro; listen for `rc_11b` reading as a genuine
   question rather than as a brag.
8. **`rc_18_sunny`** ("That is not me.") — three words carrying the last beat of
   the episode and the whole of episode four's premise. Flat and slow; if it
   plays as frightened, the tease has gone the wrong way.
9. **The whole of Sunny, once**, now that he is back on `am_puck`: the greeting
   (`a1_03`), a brag at full volume (`co_08`, `a2_53`) and the four moments he
   stops. Episodes one and two are the reference — he should sound like the same
   character, not a quieter one. Then **Sunny against Ray back to back**
   (`a2_45` → `a2_46`, `a2_52` → `a2_53`): two engines in one exchange, and the
   thing to listen for is a level or timbre mismatch at the cut.
10. **Ray's two `sad` lines** (`a1_24`, `a1_26`) back to back. Two is the whole
   sulk, and the failure mode is a hero who sounds miserable rather than small.

**Grown-up smirks.** `co_04` ("Every kid on this whole planet picks blue"),
`a1_14`/`a1_16` (the two almanac answers around "Are we there yet?"), `a1_59`
("Technically, that one is mostly Drip"), `a2_12` ("I keep the paint somewhere
else"), `a2_35` ("Our eyes are just not very good at violet"), `a2_55` ("He will
only remember one of those"), `a3_06` (the volcano), `a3_26` ("Some days you
need a different crayon"), `rc_18` ("That is not me"). Nine, against a brief of
four.

**Where this deviates from the brief, and why.**
- **The title** is replaced rather than kept — see the title note at the top.
  This is the largest deviation and it is a pedagogy argument, not a taste one.
- **The cold open is a crayon, not a dawn silhouette.** The brief offered "or
  your better hook". A kid colouring a sky blue is a thing every six-year-old
  in the audience has personally done, it makes the question theirs rather than
  the show's, it hands Sunny's paint theory a physical prop, and — the reason it
  won — it gives Act Three a wordless payoff (the blue crayon going back in the
  box) that a dawn silhouette could not.
- **The Big Words are chanted in syllables, not spelled in letters.** Seven
  letters twice, on an uncast voice, against episode two's own note that its
  two spelled words were "the highest risk in the episode". Documented above; if
  the orchestrator wants a spelled card back, RAINBOW is the one to spell,
  because a six-year-old already knows it.
- **Puff has five lines, not one or two.** Act Two's mechanism needs a *body* to
  bounce off — the scattering is staged as Blue ricocheting off a crowd with
  faces, and that crowd needed a foreground character with a voice or it is
  wallpaper. He also takes a recap panel, because there are three Big Words and
  three characters. If five is too many, `a2_20` and `a2_44` are the two to cut
  and nothing downstream moves.
- **Thirty-five scenes, one hundred and eighty-two lines, one thousand six
  hundred and forty words** — over the top of the brief's range rather than at
  the middle, and knowingly: the delivered cut is **12:17.9**, eighteen seconds
  past the stated ~10.5–12 min target. Six of those seconds and six of those
  lines are the 2026-07-28 punch-up, which was a conscious trade (episode two
  ran to 12:20 for the same reason). Act
  Two is the long act (eleven scenes) because it carries both myth-busts, the
  mechanism, the interlock and Sunny's concession. If the cut needs to lose
  ninety seconds, the honest place is Scene 12 (the rainbow homework, five
  lines) — it is the only scene in the episode whose removal does not break a
  later one.
- **Ray's arc is the same shape as Puff's** (a character wrong about himself,
  corrected by the mechanism, catchphrase inverted). That is deliberate
  repetition of a structure the audience has now responded to twice, not an
  accident — but it is worth the orchestrator's eye, because a third episode of
  "the hero thinks they are nothing" is the point at which a shape becomes a
  formula. The counter-argument in this script's favour: Ray is wrong about
  being *plain*, not about being *real*, and Act One resolves his arc at the
  four-minute mark rather than at the end, which leaves Acts Two and Three free
  to be about the sky instead of about him.
