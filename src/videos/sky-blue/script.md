# Ray and the Sky Nobody Painted

**Series:** Little Big World (kids' educational), episode three
**Topic:** why the sky is blue — and why a sunset is not
**Audience:** six-year-olds — and the grown-up in the room
**Target:** ~10.5–12 minutes of finished video
**Shape:** cold open, three acts, recap. Thirty-six scenes, two hundred and
eight spoken lines.

> **MAJOR REVISION APPLIED, 2026-08-01.** `revision.md` and its three addenda
> are wired in: the seven colours become the ensemble and six of them are cast;
> the wrongness ceremony moves out of this episode and into episode four; the
> journey gag fires five times; Scene 26 is cut; Scene 28's drain becomes **the
> sunset race**, run over three scenes, which absorbs the proposed Scene 28b and
> gives the volcano its first in-world acknowledgement (one eye, no dialogue).
> Where `revision.md` and this file disagree, **this file now wins** — that is
> the handover the revision document asked for. Where `revision.md`'s body and
> its addenda disagree, the addenda won, and the resolutions are noted in the
> scenes below.

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

## And the colours — six voices, one silence

Cast 2026-08-01 (Mike). The seven blobs stop being a crowd and become the
ensemble, because **their temperaments are the physics**: Blue cannot cross a
room without hitting something, so he ends up going in every direction, so he
arrives at your eye from all of it; Red plows straight through two hundred miles
of air without deviating, so at the end of the longest trip of the day he is the
one still walking. Neither fact is ever stated as a property of light. Both are
staged as a temperament and then named by the Narrator in lines that already
existed (`a2_23`, `a2_25`).

| Colour | Engine | Voice | Speed | Lines | Temperament, and the physical signature that must survive a paused frame |
|---|---|---|---|---|---|
| **Red** | minimax | `Patient_Man` `calm` | 0.9 | 5 | Big, slow, deep and entirely unbothered; has never hurried in his life and does not intend to start. **Walks.** Always the same speed, always a dead-straight line, never reacts to anything crossing his path. |
| **Orange** | minimax | `Determined_Man` `calm`, pitch **+2** | 0.95 | 1 | Red's second. Agrees with Red about everything, including the pace. **Matches Red's stride exactly**, one body-length behind, and never overtakes him. |
| **Yellow** | minimax | `Sweet_Girl_2` `happy` | 1.0 | 2 | Cheerful about literally everything, including bad news. **Waves.** At everyone, continuously, including at things that are leaving. |
| **Green** | minimax | `Friendly_Person` `calm` | 0.95 | 1 | The mellow one. Content. Has no notes. **Sits down** the instant anything on screen stops moving. |
| **Blue** | minimax | `Decent_Boy` `happy` | 1.05 | 4 | Fast, eager, permanently over-caffeinated, interrupts himself, apologises to everything he hits. **Ricochets.** Never travels more than half a frame without changing direction. |
| **Indigo** | minimax | `Decent_Boy` `happy`, pitch **+3** | 1.1 | 2 | Blue's shadow, vocally as well as physically — the same casting, thinner and faster. **Copies Blue's last move on a delay** and arrives after the joke. Every line he has is the *tail* of the Blue line before it. |
| **Violet** | — | **NONE, EVER** | — | **0** | Works harder than anybody on screen and is never once looked at. **Vibrates** so hard his own outline blurs — the fastest object in any frame he is in. |

**`speed: 1.05` and `speed: 1.1` are firsts for the suite.** No line in three
episodes had ever run above 1.0. Blue's does because the character is faster than
everybody else, which is the physics and the joke in one field, and Indigo's is
faster still because he is a copy hurrying to catch up. **`pitch` is a new
per-line field** added to the generator for Indigo (whole semitones, ±12,
MiniMax only, rejected on a kokoro line): it is how a second character comes out
of one casting rather than a knob for sweetening a read.

**Violet never speaks, and that is now load-bearing.** Under the delivered cut
he was the one nobody noticed among six silent siblings, which meant his silence
was not *marked*. Now five of the other six have lines, one of them (Yellow) even
talks *to* him, and he still does not get a word. He out-bounces the entire dome
in Scene 20 while Blue — who bounces less than he does — has four lines, and he
leaves the sunset race in complete silence while Blue is shouting and Indigo is
echoing. Same joke, better version, still **no clips and no runtime**. The moment
he speaks he is a twelfth voice and the gag is gone.

**The hard staging condition, now binding on all seven.** The old rule that
Violet must be the *same blob every time* — same seventh colour, same
`SHARD_PHASE[6]`, same silhouette, or he is four different accidents — **now
applies to each of the seven.** Each colour keeps one phase index for the whole
episode and one signature move. Seven bodies that bob identically are a diagram;
seven bodies that each move wrongly in their own way are a cast, and the
difference is a lookup table, not new art. Write it once in `scenes/common.tsx`
and read it from every act.

**The frequency ladder (addendum 3), and it is the drawing the whole cast rests
on.** The seven shards are an **ascending frequency ladder, made obvious**: Red
is one trough and one peak — a half-wave, the minimum possible wave, visibly
can't-be-bothered — and each colour up the ladder adds waviness stepwise (Orange
a touch more, … Blue tight, Indigo tighter, **Violet a fizzing blur**). One
shared wave *speed* across all seven, so frequency **is** temperament. The ladder
must read as ascending at a glance when the seven stand in spectrum order, which
turns the split reveal and the race into frequency diagrams wearing faces.
Ray's own body is round-2 candidate **F2** (pure Cheshire: features floating in a
feathered glow over an independent wave ribbon, no head disc, the face bobbing on
the wave's crest a beat late), carrying the round-2 report's mitigations —
feature/glow contrast bumped so blink and mouth-sync stay legible at 0.44 crowd
scale, the silhouette-test disc-flattening noted, and talking tests rendered
early.

**Blue's and Violet's blurs must be different kinds of blur.** Blue's signature
is a change of *direction*; Violet's is amplitude *in place*, visibly larger.
If the two read the same, the honesty tax in Scene 20 stops being a picture.

**Silent, and staying silent.** The kid (silhouette, never speaks, three
episodes running), the volcano — which does not get a line even in the one scene
where it opens an eye — and Violet.

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
`am_puck` after the MiniMax read was rejected. Ray, Drip, Puff and the six cast
colours are on MiniMax speech-2.8-hd (via Replicate), which is paid but takes an
`emotion` and a `pitch` per line and honours inline pause markers. **Sixty-nine
MiniMax lines, one hundred and thirty-four kokoro lines and five `sameAs`
aliases**; the aliases are copies rather than recordings and cost nothing at all.
Sunny's twenty are free and re-time for nothing whenever a word of his changes.

**Most MiniMax lines are not seasoned.** Ray's forty-seven are twenty-one `auto`,
twenty-five seasoned and one shared recording: two `sad` (the
sulk, and nowhere else in the episode), `surprised` on the eight lines where a
fact lands on him, `happy` from the rainbow onward, one `calm` at the sunset.
Drip and Puff are `happy` throughout, which is all they are. **The six colours
are the exception that proves the rule**: each one carries exactly *one* emotion
for the whole episode and never changes it, because the emotion is the character
— Red, Orange and Green are `calm` in every frame they appear in, Blue, Indigo
and Yellow are `happy` in every frame they appear in, and a Red who plays a
reaction has stopped being Red. Every non-`auto` line names its stage direction
in a comment in `narration.mjs`.

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
change to the joke. **There are forty-two of them here**, and `Video.tsx` carries
forty-eight `gaps` entries in total — the other six are the approach gaps below.

**And a third kind of number, new since 2026-08-01: the approach gaps.** Red
takes **16f** before every line he says and Blue takes **4f** — twice and half
the house eight — so their temperaments are in the timeline rather than in the
read, for a third of a second either way. Indigo takes **12f**, because he is
late on purpose. These are written into `Video.tsx`'s `gaps` on the *previous*
line, which is where a "gap before" has to live.

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
forty seconds — *"OH, that one is me as well!" / "Sunny has a theory. It is a
very Sunny theory."* — so a returning viewer gets paid immediately and a new one
gets a promise. **`co_09_narrator` is unchanged and it is careful:** it says
*keep hold of it*, not *it is wrong*. The episode collects the theory, undermines
it in Scene 16 and allocates the credit in Scene 23 — it never rules on it, which
is why ep 2's tease was reworded to stop promising a verdict this episode does
not deliver. Stating the theory *before* the mechanism is still deliberate: a
misconception the audience has been told to hold onto is one they will notice
being taken apart.

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
field, tiny, with Earth a blue dot that does not appear to get any closer. **The
shot never cuts, and nothing in it ever changes** — not the star field, not the
speed, not the size of the dot. That is the whole set and it must stay that
boring for twenty-five seconds.
**Lines:** `a1_13_ray`, `a1_14_narrator`, `a1_15_ray`, **`a1_15b_narrator`**,
**`a1_15c_ray`**, **`a1_15d_narrator`**, **`a1_15e_ray`**, `a1_16_narrator`,
**`a1_16b_ray`**

**HELD BEAT — 45f (1.5s) before `a1_13_ray`** (i.e. on `a1_12_ray`'s
`gapFrames`, in Scene 4). Unchanged.

> **RAY:** Are we there yet?
> **NARRATOR:** One minute down. Seven to go.

**HELD BEAT — 30f (1.0s) after `a1_14_narrator`.**

> **RAY:** Are we there yet?
> **NARRATOR:** Two minutes down. Six to go.

**HELD BEAT — 45f (1.5s) after `a1_15b_narrator`.**

> **RAY:** Are we there yet?
> **NARRATOR:** Four minutes down. Four to go.

**HELD BEAT — 60f (2.0s) after `a1_15d_narrator`.**

> **RAY:** Are we there yet?
> **NARRATOR:** Seven minutes down. One to go.

**HELD BEAT — 75f (2.5s) after `a1_16_narrator`.** **The longest silence in Act
One, and the peak of the gag.** Same star field, same speed, same distance to go.
Nothing enters it — no bubble, no gesture, no emotion change, and above all no
sign that anything is about to happen.

> **RAY:** Are we there yet?

**Scene tail: 6f.** *(Deliberately almost nothing.)* The fifth firing is **not
answered**. Scene 6 cuts hard to a garden at full brightness on the frame after
it, and `a1_17_narrator` — *"And then Ray arrived, all at once, the way light
always does"* — is the answer. The joke's button is a cut.

**The escalation, and why it is built this way.** Three tools are used and they
do different jobs:

- **The five firings are one recording.** `a1_13_ray` is the only synthesis; the
  other four are `sameAs` aliases of it. Not four takes — MiniMax returned
  episode two's one repeated sentence at 2.20s and then 2.84s, and this gag is
  *only* the sameness. Five identical clips also mean five identical mouth shapes
  and five identical bubbles, which is what makes the picture as flat as the
  sound.
- **The gaps escalate: 30 / 45 / 60 / 75.** The escalation is the *rhythm*, not
  an attempt to bore anybody. No single silence here is longer than the 75f the
  episode already spends on its ending, and the effect being bought is a child
  recognising a pattern and starting to say the line *with* Ray.
- **The answers stay flat and the arithmetic skips.** One/seven, two/six,
  **four/four**, seven/one. The skip from two to four is the grown-up smirk and
  it stops the four answers being a recitation. All four are the same shape, the
  same speed (0.92) and the same complete lack of interest.
- **The fifth is interrupted**, and that is the only thing in the scene that is
  not a repetition.

**Pedagogy:** none, still, and it now buys more of what it always bought — eight
minutes for ninety three million miles, stated as a travel time a child can be
bored by. The one substantive gain: the count to eight is audible four times
instead of twice, so "eight minutes" arrives as an arithmetic fact rather than as
a number Sunny shouted once.

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

**THE 60f BEAT IS UNCHANGED AND STILL EMPTY, and no personality enters it.** For
those sixty frames the seven are seven identical shapes in an arc, which is what
makes the count possible and also what makes the next five seconds work.

**The ensemble is born on `a1_37_ray`, not before.** From Ray's *"What. What just
happened to me."* onward, the seven come alive **one at a time, in spectrum
order, left to right, roughly one every eight frames**, so a child's eye is walked
along the arc a second time — and the second walk is the one where they are all
different:

- **Red** does not come alive, because he never stopped being alive. He has been
  standing exactly like that since the frame he arrived, and he does not move
  again until Act Two.
- **Orange** settles a body-length from Red and matches his stance.
- **Yellow** starts waving and does not stop for the rest of the scene.
- **Green** sits down.
- **Blue** is already vibrating hard enough to blur his own outline and drifts a
  few pixels out of formation, twice.
- **Indigo** copies whatever Blue did about four frames later.
- **Violet** vibrates hardest of all, at the far end of the arc, where the framing
  puts him half out of the shot.

**Stagger, do not swarm.** Seven simultaneous personalities is noise; seven
sequential ones is a cast list. Use `beats(clip, fractions, fps)` against
`a1_37_ray` so the stagger rides the voice. Green sitting and Red standing dead
still are the two that read instantly in a paused frame.

**Pedagogy:** The act's whole thesis in one sentence, said once, plainly, over
its own proof. Note the framing of `a1_38`: the raindrop did not *add* anything
and did not *change* him — it separated what was already there. That is the
difference between a child thinking rain makes colours and a child knowing
sunlight contains them, and it is the sentence Act Two needs to be true before
it can take the blue out of the beam. It is a stronger sentence over seven things
that are visibly *different from each other* than over seven things that are
visibly the same: the child has just been shown that the seven were in there all
along with their own personalities and were never one thing.

---

### Scene 10 — The roll call
**On stage:** Narrator, Ray
**Visual:** No new staging: the seven blobs from Scene 9 are still standing
there in their arc. Ray floats along the line and greets them one at a time,
left to right, with an eye-line and a wave for each; **each one he names responds
in character, and Red does not respond at all.** His bubble is
**"Hi! Hi! Hi! Hi!"**, a summary and not a transcript.
**Lines:** `a1_41_narrator`, `a1_42_ray`, `a1_43_narrator`, `a1_44_ray`

**No line changes and no beat changes.** `a1_42_ray` stays at 0.88 and stays the
slowest character line in the episode. This is the biggest laugh in the cut and
nothing in it is being touched except what the seven do while it happens.

> **NARRATOR:** And now they were not travelling together at all.
> **RAY:** Hi Red. Hi Orange. Hi Yellow. Hi Green. Hi Blue. Hi Indigo. Hi Violet.

- **"Hi Red."** — nothing. Red does not turn, does not bob, does not blink. Ray
  waits half a beat and moves on. *This is the scene's new best moment and it
  costs zero frames*, because 0.88 already leaves a gap between the items.
- **"Hi Orange."** — Orange nods, once, and glances at Red to check that was
  allowed.
- **"Hi Yellow."** — Yellow was already waving. He waves harder.
- **"Hi Green."** — Green stands up, waves, and sits back down.
- **"Hi Blue."** — Blue is not where Ray is looking. He waves from somewhere else
  in frame, a beat late, and apologises with his hands.
- **"Hi Indigo."** — Indigo does Blue's wave, four frames later, from the place
  Blue just left.
- **"Hi Violet."** — Violet, last, vibrating, waves with both arms. Ray has
  already turned back to camera. *(Violet, firing zero — the plant.)*

**Nobody replies out loud.** Six of the seven have voices now and not one of them
uses it here: the roll call's shape is fixed across three episodes — *a character
cheerfully naming near-identical strangers → one flat explanatory line from the
Narrator → an unbothered button* — and a reply from one of the strangers breaks
it. The replies are all movement, which is what the scene has always been.

**HELD BEAT — 20f (0.7s) after `a1_42_ray`.** The greeting lands. **Nothing enters
it**, and specifically nobody keeps waving — the seven freeze in whatever pose the
greeting left them in, which is seven different poses, which is the picture.

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
one leaving every two and a half frames, which is the card's own letter stagger,
so each colour arrives on the beat its letter does. **And since 2026-08-01 they
take them in character:**

- **Red** arrives on the R **on time and at his own pace** — he starts moving
  before the letter does and gets there exactly when it lands. He does not hurry
  and he is not late. Nobody else manages this.
- **Orange** is a body-length behind him and takes the "a".
- **Yellow** waves at the audience from the "i".
- **Green** sits down on the "n" and stays sat.
- **Blue** overshoots the "B", comes back, overshoots it again, and settles.
- **Indigo** does Blue's overshoot four frames later, on the "o".
- **Violet arrives last, finds the W already occupied by Ray, and spends the rest
  of the card squeezed onto the far arm of it, half off the edge, holding on.**
  Nobody looks at him. Nobody mentions him. He is still there when the card cuts.

**Drip keeps the B, and Blue bounces off her.** The delivered cut has Drip on the
B because there is no dot on an i to sit on; Blue now arrives on the same letter.
**Decided: she stays, and Blue ricochets off her twice before settling somewhere
else entirely** — which is funnier than moving either of them and is exactly his
signature. Written down here so the next reader does not "fix" it.

The perches are **the syllable blocks'** letters (`syllableBlock()`), not the
`WordCard`'s capitals, which are on screen for twenty frames (2026-07-28
finding). Nothing about the card's timing changes.

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
**Visual:** Open sky, empty. Nothing in the frame but blue. Sunny slides in
holding **one paint tray**, tilted toward himself so we cannot see into it, and a
roller resting in it. **No ladder. No dust sheet. No painting.** He is not caught
mid-job; he has simply turned up holding the evidence, extremely pleased with it.
On `a2_11_narrator` he stops. Then, slowly, he **tips the tray toward camera.**
It is empty. It is not merely dry — it is clean, white and unused, and it has
plainly never had paint in it. Hold on the tray, dead centre, filling a third of
the frame.
**Lines:** `a2_10_sunny`, `a2_11_narrator`, `a2_12_sunny`, `a2_13_narrator`

> **SUNNY:** It was PAINT! Blue paint! I painted the whole sky!

**HELD BEAT — none here.** He does not pause; he never does.

> **NARRATOR:** Sunny. Show us the paint.

**HELD BEAT — 45f (1.5s) after `a2_11_narrator`.** Unchanged, and it is now the
whole scene: Sunny tips the tray, the tray is empty, and nobody says anything for
a second and a half. **Emotion lead cut to 0** — his face must not start to fall
before the Narrator has finished the question. **Nothing else moves in the frame,
and there is nothing else in the frame to move.**

> **SUNNY:** I keep the paint somewhere else.
> **NARRATOR:** So we went looking for the paint.

**What changed, 2026-08-01, and why.** The note was *"visually very messy and the
narration is kind of unclear"*, and both had the same cause: five props and two
ideas. The rewrite has **one prop and one idea.**

- **One prop.** An empty tray is a thing a six-year-old reads in a single frame;
  a dry roller is a thing a grown-up infers. The roller stays only as the thing
  lying in the tray.
- **No painting.** Sunny painting an already-blue sky asked the audience to
  notice that the sky *was already that colour* — a two-step inference on a
  moving background. Cut entirely.
- **`a2_10_sunny` reworded** (was *"It was PAINT! I painted it! I am extremely
  good at painting!"*) — three claims that now escalate, with the middle one
  naming the colour the episode is about.
- **`a2_13_narrator` reworded** (was *"We will come back to Sunny."*), because
  the episode no longer comes back to declare him wrong. *"So we went looking for
  the paint"* turns Act Two into a **search**, chains straight into `a2_14`, and
  plants Scene 23's payoff exactly: the paint turns out to be real, and it turns
  out to be his light.

**Pedagogy:** unchanged in substance and clearer in form. The theory is
*undermined*, not disproved — the show still does not get to say what the sky is
made of until it has something to replace it with. The difference is that the
undermining is now a single picture (a man with an empty tray) instead of a
tableau.

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
**On stage:** Narrator, **Red**, **Orange** (silent), **Puff** (silent)
**Visual:** A cross-section of the air as a wide corridor, drawn in the show's
crayon style, with the faint air-puffs scattered through it like a ball pit. Red
— big, round, and moving at a speed he will not vary by a single pixel for the
rest of the episode — enters from the left. **Orange enters a body-length behind
him** and matches him exactly. They walk the whole width, clip one or two puffs
without changing direction at all, and exit right.

**Visual addition (punch-up §5, free):** Puff is down in the bottom of the
corridor, and as Red comes over him he **reaches up for a bounce, misses, and
shrugs**. No line, no bubble, no beat, no frame — the document's own answer to
the soft spot at 5:24, taken as a picture rather than as a sixth Puff line. Five
is his count and it stays five (`a2_20` and `a2_44` are the two to cut if that
is one too many, and adding a sixth argues the wrong way). It does not fight the
scene's deliberate boredom, it *is* the boredom: the air offers Red a bounce and
Red does not deviate by a pixel.
**Lines:** `a2_22_narrator`, `a2_23_narrator`, **`a2_23b_red`**,
`a2_24_narrator`, **`a2_24b_red`**

> **NARRATOR:** So watch what happens when Ray flies into all that air.
> **NARRATOR:** Red goes first. Red is big and calm, and hardly bounces at all.

**HELD BEAT — 16f (0.5s) after `a2_23_narrator`.** *(New, and short.)* Red takes
his time about answering. **Every Red line in the episode has a longer approach
gap than the house eight frames**; that is the character encoded in the timeline
rather than in the read.

> **RED:** I go straight through. Always have.

**HELD BEAT — 30f (1.0s) after `a2_23b_red`.** *(Was on `a2_23_narrator`; it
moves here and keeps its length.)* Red crosses the whole frame in silence, dead
straight, with Orange behind him. Puff reaches, misses and shrugs inside this
beat — that is continuous action already in progress, not an entrance, and it is
the only thing that moves besides the two of them. The audience has to see
*boring* before bouncy means anything.

> **NARRATOR:** Straight through. Barely touched the sides.

**HELD BEAT — 20f (0.7s) after `a2_24_narrator`.** **Nothing enters this.** Red
is most of the way out of frame. Puff is still holding the shrug. Deadpan is
stillness.

> **RED:** Lovely air.

**Scene tail: 40f.** Red exits during it, at exactly the same speed, and Puff
watches him go.

**Why Red speaks here and not earlier.** He has been on screen since Scene 9 and
silent for eight minutes, which is what makes his first line land: the audience
has watched him not react to anything, including being greeted by name, and the
first thing he says is a flat confirmation of the thing they had already noticed.
It is also the correct *pedagogical* moment — the scene's job is the control
case, and the control case is now delivered by the control.

- **`a2_23b_red`** agrees with the Narrator's line word for word, which is the
  joke: he is not boasting, he is confirming, and "Always have" is the only
  attitude in it. Deliberately **not** an absolute — *"hardly bounces at all"* is
  the accurate claim and Red's line does not contradict it, which matters,
  because red light does scatter, just not much.
- **`a2_24b_red`** is two words after a second of silence and a complete
  two-character joke with a silent participant: Puff offered him a bounce, Red
  declined without noticing, and then compliments his air on the way out. It is
  the warmest thing anybody says in Act Two, which is the note that keeps Red
  from reading as cold.

**Pedagogy:** The control case, staged first and staged plainly. Half of
scattering is the colours that *don't*, and a child who only ever sees the blue
pinball has watched a special effect rather than a comparison. It is just no
longer *empty*: the 2026-07-28 audit found this scene inside a 58-second soft
spot, and the beat that fixes it is the physics. See **Physics honesty** in the
Production notes for what this scene is and is not allowed to say about why.

---

### Scene 19 — Blue goes everywhere
**On stage:** Narrator, Ray, **Blue**, **Indigo**, Puff
**Visual:** Same corridor, same air-puffs, same entry point. Blue — small, quick,
already vibrating before he enters — hits the first puff and ricochets, then
hits another, then another, until the whole frame is criss-crossed with blue
trails going in every direction including backwards. **Indigo follows him in and
copies every ricochet four frames late, which means Indigo is permanently hitting
the puff Blue has just left.** Puff and the crowd are delighted and bat Blue
about like a beach ball.
**Lines:** `a2_25_narrator`, **`a2_25b_blue`**, `a2_26_puff`, `a2_27_narrator`,
`a2_28_ray`, **`a2_28b_blue`**, **`a2_28c_indigo`**, `a2_29_narrator`

> **NARRATOR:** Now Blue. Blue is jumpy. Blue is the bounciest one there is.

**GAP — 4f.** *(Half the house turn gap.)* Blue does not wait to be finished
introducing. **Every Blue entrance in the episode takes a 4-frame gap instead of
the default eight** — the opposite of Red's 16 — so the interruption is in the
timeline rather than in the read.

> **BLUE:** Hi! Sorry! Sorry! Hi! Sorry!

**Bubble:** `"Sorry! Sorry! Sorry!"` (3 words). He is apologising to the air. The
air does not mind. Nobody acknowledges it, ever, in the whole episode.

> **PUFF:** Bounce off me! Go on! Everybody bounce off Puff!
> **NARRATOR:** Ping. Ping. Ping.

**HELD BEAT — 45f (1.5s) after `a2_27_narrator`.** **Unchanged and sacred.** The
pinballing runs on under the silence, building until there is blue moving in
every direction in frame. This is the mechanism of the whole episode arriving as
a physical event and it must not be narrated while it happens. **Nothing enters
it — including Blue's bubbles.** He is moving; he is not talking.

> **RAY:** Whoa. Where did Blue GO?

**GAP — 4f.**

> **BLUE:** I am over here! And here! And HERE!

**Staging — this is the scene's one real ask.** Three bubbles, not one: pop one
per clause at `beats(clip, [0.05, 0.42, 0.74])` (measure against the delivered
clip, which came back at **6.66s**, and re-measure if the line is ever reworded),
each from a **different corner of the frame**, each with `tailAt` pointing at
wherever Blue actually is on that frame. Each bubble is two words
(`"Over here!"` / `"And here!"` / `"And HERE!"`), so all three fit and none of
them is a caption. **This is the whole mechanism in one gag** — the answer to
"where did Blue go" is "everywhere", said from everywhere. **Blue's bubbles are
still even when Blue is not.**

**GAP — 12f.** *(Indigo's gap, and the only one of its kind: he is late, not
early.)*

> **INDIGO:** And here. And here.

Indigo says the **tail** of Blue's line, from the corner Blue has already left,
after the joke has finished. He is not joining in and he is not making a point.
This is the rule his whole part runs on and it fires exactly twice in the episode
(here and `a3_13c`) — do not give him a sentence of his own in either place.

> **NARRATOR:** Everywhere. Blue went absolutely everywhere.

`a2_29_narrator` is now a **confirmation** rather than an announcement, which is
strictly better: the audience got the answer from the character and the Narrator
agrees with them.

**Pedagogy:** Rayleigh scattering at six-year-old resolution, staged as a
difference in *behaviour* between two characters — and it is now a difference in
behaviour between two characters who have both told you what they are like.
`a2_27_narrator` is a Narrator sound word alone in its own clip, at 0.9, so the
three pings are three pings.

---

### Scene 20 — Blue, from every direction
**On stage:** Narrator, Ray, **Violet** (silent)
**Visual:** Cut out of the diagram to a kid-height view of a real sky, and draw
blue arrows arriving at the viewer from above, from the left, from the right,
from behind — dozens of them, from everywhere at once, all converging on the
lens. Then pull back to the whole dome of the sky, glowing.

**Visual delta (2026-08-01, visual only, +0.0s): the arrows are Blue.** Every one
of those dozens of arrows now has **Blue on the end of it** — the same blob,
arriving from every direction at once, in dozens of copies. That is not a cheat;
it is what scattered light *is*, and it is the picture Scene 19's last line just
promised. On `a2_33_narrator` the dome resolves, for about half a second, into
**Blue's face**, and then is just sky again — on the line, never in the beat.

**Visual addition (punch-up C2, sharpened):** from `a2_34_ray` onward, **Violet
is in frame**, in the bottom corner of the dome, ricocheting harder and faster
than anything else on screen and waving both arms at the lens. He is visibly
working the hardest of any object in the picture. Nobody looks at him, no arrow
points at him, and the Narrator's two lines play over the top of him as if he
were not there. **The blue he is being compared with is now Blue himself** —
a character with four lines and a personality, up and to the right of him and
visibly working *less* hard. That is the honesty tax as a picture: violet really
does scatter more, and the reason the sky is not violet is in the eye, not in the
sky.

**This scene does not get a Blue line.** It is 32.8 seconds and the temptation is
obvious; the answer is no, because it already has a punchline ("Sorry, Violet.")
and a second one would spend it.
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

**Visual delta (2026-08-01, visual only, +0.0s):** the letters do not arrive by
themselves. **Blue throws them**, one per ricochet, from wherever he happens to
be on that frame — which is what the card's existing treatment already looks like
and now has a cause. **Indigo throws one too, four frames late, and misses.**
Nothing about the card's timing, the chant or the 12f beats changes; perch
anything block-relative (`syllableBlock()`), never on composition coordinates.
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

### Scene 23 — Sunny has a point

*(Scene id stays `s23_sunny_wrong` — it is wiring, read by `Video.tsx`, the act
file and the bubble maps. Only the title changed.)*

**On stage:** Narrator, Ray, Sunny
**Visual:** Sunny slides into frame at maximum brightness, roller in hand, and a
diagram assembles itself out of his own beams as he brags — sun to sky, sky goes
blue. **The diagram never stops.** *(This is the single biggest staging change in
the scene: the delivered cut had it halt and the beams droop on "He is wrong",
and that ceremony is removed.)* Instead, on `a2_51_narrator` the diagram
**rebuilds around him** with the air drawn *into* it, bigger and more accurate
than the one he made, while he poses in front of it. **Free visual, droppable:**
Red walks across the finished diagram, left to right, at his usual speed, and out
the far side, without looking at it. He does this **on `a2_51_narrator`, never
inside a held beat.**
**Lines:** `a2_45_sunny`, `a2_46_ray`, `a2_47_sunny`, `a2_48_narrator`,
`a2_49_narrator`, `a2_50_sunny`, `a2_51_narrator`, `a2_52_ray`, `a2_53_sunny`,
`a2_54_narrator`, `a2_55_narrator`

> **SUNNY:** EXCUSE ME. Whose light is that?
> **RAY:** Um. Yours.
> **SUNNY:** So I painted the sky! With my sky paint! Obviously!
> **NARRATOR:** I checked. Then I checked again.

**HELD BEAT — 45f (1.5s) after `a2_48_narrator`.** **Unchanged.** Sunny holding
an enormous smug grin, alone in frame, absolutely certain of what is coming next.
Two episodes have trained the audience to expect *"He is right. Again."*; this
episode's cold open has trained them to expect the opposite. **Emotion lead cut
to 0** on the next line.

> **NARRATOR:** He has a point.

**HELD BEAT — 36f (1.2s) after `a2_49_narrator`.** **Same length, opposite
content.** The grin does not come apart — it **grows**, slowly, across the whole
beat, and the diagram behind him keeps assembling. Nothing else enters. The laugh
is that the audience braced for a verdict and got a concession.

> **SUNNY:** I DO have a point! I have LOADS of points!

*(He fans his rays on "points". The pun is visual and a six-year-old gets it
instantly — he is drawn covered in them. Bubble: `"I have LOADS of points!"`,
five words. **Ear-check**: if the pun does not land in the read, the line is free
to reword on kokoro; the fallback is `"Of course I do. I always do."`)*

> **NARRATOR:** The light is his. Every single bit of it.
> **RAY:** But the AIR did the painting.

**HELD BEAT — 30f (1.0s) after `a2_52_ray`.** **Unchanged.** It lands on him.
Nobody helps.

> **SUNNY:** MY LIGHT! THE SKY IS MADE OF MY LIGHT! YOU'RE WELCOME! HA! HA!
> **NARRATOR:** It is his light. It is not his painting.

**HELD BEAT — 20f (0.7s) after `a2_54_narrator`.** Short — this is a comma, not
a full stop. Sunny is already re-inflating behind it.

> **NARRATOR:** He will only remember one of those.

**HELD BEAT — 45f (1.5s) after `a2_55_narrator`.** The grown-up laugh goes here.
Sunny, restored to full brightness, posing in front of a diagram that no longer
says what he thinks it says. Unseasoned button, no gesture, nothing enters.

**THE FOUR REWORDED LINES, 2026-08-01, and what each one is doing.**

| Key | Was | Is | Why |
|---|---|---|---|
| `a2_49_narrator` | "He is wrong." | **"He has a point."** | Same slot, same 0.85 deadpan floor, same three flat words, no verdict. It is the third thing after two episodes of two possibilities. |
| `a2_50_sunny` | "Wrong. Me. I have never been wrong." | **"I DO have a point! I have LOADS of points!"** | The character's moment of doubt becomes his moment of triumph, which is what "undefeated" means. And it is a joke where there used to be a pause. |
| `a2_51_narrator` | "There is no paint. There never was. The air does all of it." | **"The light is his. Every single bit of it."** | The denial goes; the concession arrives first, which is what makes Ray's line a correction rather than a consolation. |
| `a2_54_narrator` | "He is wrong about the sky. He is right about the light." | **"It is his light. It is not his painting."** | Same two-item shape `a2_55` needs, with the verdict taken out of both halves. It is also the title, said out loud, for the only time in the episode. |

**And one reworded Ray line.** `a2_52_ray` was *"But Sunny. Every bit of that blue
is your light."* — which the Narrator now says one line earlier, so it would be a
repeat. It becomes **"But the AIR did the painting."** His register changes with
it and improves: he is no longer consoling a defeated Sun, he is being a
**pedant**, which the 2026-07-28 audit identified as his one genuinely funny
characterisation and which fires twice elsewhere (`a2_34`, `a2_36b`). Same
generosity, opposite direction — he hands Sunny his half in `a2_46` and takes the
other half back here.

**Pedagogy:** The mechanism said back by the character who is the first link, and
then corrected — sun to *air*, not sun to sky. What has gone is a verdict the
script could not fully defend; what has arrived is a **credit allocation** the
script can defend completely — the blue really is made of his light and nothing
else, and the air really is what turns it blue. Telling a six-year-old "he is
wrong" and then immediately conceding "he is right about the light" was a script
arguing with itself for a punchline, and the punchline was available without the
argument. **`a2_55_narrator` survives verbatim**, still fires off a two-item list,
and still gets its 45f: the biggest grown-up laugh in the episode is untouched,
and it now converts a non-verdict into a punchline.

**THE RISK, WRITTEN DOWN.** The cold open told the audience to hold onto Sunny's
theory; episode two told them he would one day be wrong; the Narrator checks, and
checks again, across a silence built specifically to make a ruling land — **and
then the ruling does not come.** If `a2_49` plays as a *dodge* instead of as a
*surprise*, the episode has spent twelve minutes on an anticlimax. The whole load
sits on that clip landing **flat rather than apologetic**. Ear-check it first,
before anything else in the revision is staged; and if it cannot be made to work,
the fix is to make the concession *more* precise, **not** to restore the verdict.

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

**ON NOT COLLECTING EPISODE TWO'S PROMISE.** *"One day Sunny will be wrong about
something. It is not today."* (`wind`'s `a2_45`/`a2_45b`) was planted four
minutes from the end of that episode. **This episode declines to collect it, and
that is deliberate.** A returning six-year-old will recognise the *shape* of this
beat — the two-sentence check, the held silence, the three-word ruling — and get
a different word out of it, which is a better use of a plant than spending it on
schedule. It was a long fuse and it is now a longer one.

**What is banked for episode four:** the verdict itself, the ceremony that
carries it (*"I did that." / "No. He really didn't."*), and **"That is not me."**
— the inversion of the show's oldest running gag, withdrawn from `rc_18` and
saved so it can land *after* the wrongness ceremony rather than instead of it.
Episode four inherits a character who has claimed a volcano out loud, on the
record, in the last twenty seconds of this one, which is the strongest possible
opening position for a verdict that is finally payable.

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

### Scene 26 — The volcano — **CUT, 2026-08-01**

**Deleted entirely.** `a3_06_narrator` is removed from `narration.mjs` and from
`Video.tsx`, the `s26_volcano` scene spec is gone, and the 60f hold goes with it.
**−9.6s.** The scene id is not reused and nothing is renumbered.

**Why.** The volcano gag's entire value is that *the show appears not to think it
is important*, and the delivered cut stopped the episode, pointed a camera at it
for twelve seconds, and said a sentence about it. That is the one thing the gag
cannot survive. Episode two planted it correctly — snoring smoke rings on a
horizon, one four-frame glance, no dialogue, nobody mentioning it — and it worked
because nothing acknowledged it.

**What replaces it** is one in-world beat inside the sunset race (Scene 28b):
Yellow lands on the island to have a sit down, the Narrator warns *Yellow* off,
and **the volcano opens one eye** for 45 frames and closes it. No line about it,
no explanation, no reaction from anybody. That is the sleeping gag's next
escalation and it costs no scene of its own: ep 2 asleep and unmentioned → ep 3
one eye → ep 4 awake.

**Cost of the cut:** the density map loses one adult-leaning LAUGH beat at 8:45
and one grown-up smirk. That is the right trade — an eight-second deadpan the
show has to stop for is expensive, and the beat it created is replaced four times
over by Red and Blue in the same act.

**THE VOLCANO RULE, REWRITTEN, and it is binding on whoever stages Act Three.**

> The volcano is **scenery** and no line in this episode is about it. It sits on
> the *measured* horizon (sample the plate or read the drawn `HORIZON`, never
> guess), it snores smoke rings on its three-second loop, and it must be
> **continuously visible for the whole of every shot it appears in** — a
> background gag that vanishes mid-scene reads as a bug. It appears in Scenes 25,
> 28b, 28c, 29, 31 and 35 and in no other frame of the episode. Nobody looks at
> it, nobody points at it, no arrow marks it, no music sting acknowledges it, and
> **the Narrator has no line about it anywhere in this episode** — `a3_14i` is
> addressed to Yellow and never names the thing he is sitting on. It opens one
> eye in Scene 28b, in silence, and it wakes up in Scene 35.

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

**Visual delta (2026-08-01, visual only, +0.0s):** the two beams are not
abstractions. **The midday beam has Blue on it and the sunset beam has Red on
it** — walking, at their own speeds, the length of their own paths, for the whole
scene. Blue's short trip is over almost immediately and he spends the rest of the
scene ricocheting around having arrived; Red's is still going when the scene ends,
and he is still going when Scene 28 starts. It costs nothing: the beams are drawn
anyway, and now they have somebody on them.

**This scene is the SETUP; the race is the payoff.** The simple two-path diagram
stays exactly as it is — the geometry has to be stated plainly once before it can
be played for comedy over three scenes.

**Pedagogy:** The only new physics in Act Three, and it is a *geometry* fact
rather than a light fact — which is why it gets its own diagram. Everything the
sunset does follows from path length, and path length is the one part a
six-year-old can see with a ruler. It is also far easier to *feel* as "one of
them is still walking" than to read off two drawn lines.

---

### Scene 28 — The sunset race: high air

*(Scene id stays `s28_blue_runs_out` — it is wiring. Only the title and the
staging changed.)*

**THE SUNSET RACE, and what it replaces.** The delivered cut drained the blue out
of the sunset beam as a diagram effect. Since 2026-08-01 it is a **race**: all
seven colours set off together down two hundred miles of sideways air, and they
drop out one at a time, in character, across three scenes and three kinds of
terrain — high air, out over the sea, and the finish line at somebody's eye. It
is the mechanism staged as ensemble comedy, and it is the same physics.

**THE RULE THAT GOVERNS EVERY EXIT, and it is not negotiable.** *Nobody loses and
nothing is taken away.* Every colour that leaves is **bounced out sideways** and
goes and decorates the sky: stage each exit as a bounce **UP into the blue
above**, never as falling, fading, dropping behind or vanishing. The sunset's red
is not what survived a cull, it is what was left going straight. `a3_14c_narrator`
is the sentence that says so out loud and it is unchanged.

**On stage:** Narrator, Ray, **Blue**, **Indigo**, **Yellow**, **Violet**
(silent), the rest of the seven
**Visual:** Follow the sunset beam along its whole path, left to right, in one
continuous move, high up where the air is thick with puffs. The seven travel
together at the start, in spectrum order. Blue pings out sideways at the first
air-puff, then again, then again, and goes **up**; Indigo follows him out four
frames late, hitting the puff Blue has just left; **Violet goes last, highest and
furthest, in complete silence.** Ray rides the beam. The beam visibly loses its
blue end as it goes.
**Lines:** `a3_12_narrator`, **`a3_12b_narrator`**, `a3_13_narrator`,
**`a3_13b_blue`**, **`a3_13c_indigo`**, **`a3_13d_yellow`**, `a3_14_narrator`,
**`a3_14b_ray`**, **`a3_14c_narrator`**, **`a3_14d_ray`**

> **NARRATOR:** And you know what blue does in air. Blue bounces.
> **NARRATOR:** All seven set off down it together. Watch who lasts.
> **NARRATOR:** Bounce. Bounce. Bounce. All the way along.

**HELD BEAT — 45f (1.5s) after `a3_13_narrator`.** **Unchanged.** The blue drains
out of the beam in silence, one ping at a time, over most of the width of the
frame — and it is now also the race starting. This is Act Two's mechanism doing
something *new*, and it needs to be watched rather than described. Nothing enters.

*(This 45f beat **is** Blue's approach here — the one place in the episode where
he does not get his 4-frame interruption gap, because he is busy being bounced
out of a race and the picture has to be watched first. He is already gone by the
time he says it.)*

> **BLUE:** Sorry! Sorry! I am going UP now! Bye!

**GAP — 12f.** *(Indigo's gap: he is late, not early.)*

> **INDIGO:** Going up now. Bye.

**HELD BEAT — 20f (0.7s) after `a3_13c_indigo`.** **VIOLET EXITS HERE, AND HE
DOES NOT SAY ANYTHING.** He goes last of the three, highest and furthest,
out-bouncing both of them, and while Blue is shouting and Indigo is echoing he
leaves without a word. **Nothing else enters this beat** — no bubble, no
narration, no reaction. This is the one place in the episode where his silence is
*heard* rather than seen, and a bubble would spend it.

> **YELLOW:** Great bounce, Violet!

*(Yellow waves at somebody who is leaving, which is his entire character — and he
is the only character in three episodes who addresses Violet by name and expects
nothing back. Nobody else looks up. Violet does not answer, because Violet never
answers.)*

> **NARRATOR:** By the time that light reaches you, the blue has all bounced away.
> **RAY:** Bye Blue! Bye Indigo! Bye Violet!

**HELD BEAT — 20f (0.7s) after `a3_14b_ray`.** **Unchanged.** The goodbye lands.
Ray is still waving after them while the audience works out who just left — and he
is waving at an empty space, because all three have already gone.

> **NARRATOR:** They did not go anywhere. They went everywhere else.

**HELD BEAT — 24f (0.8s) after `a3_14c_narrator`.** **Unchanged. Nothing enters
this.** No wave, no bubble, no entrance, no emotion change — Ray hangs there in a
beam that is now warm, doing absolutely nothing. Same beat, same length and same
reason as Scene 10's.

> **RAY:** I will see me later.

**The roll call, second firing, and its shape is fixed.** *A character cheerfully
naming near-identical strangers → one flat explanatory line from the Narrator →
an unbothered button.* Blue and Indigo speak **before** it, never inside it: a
reply landing between `a3_14b` and `a3_14c` breaks the signature. Ray is **not sad
about it**, which is what keeps the sunset from reading as the light dying (the
Scene 31 guardrail, five scenes early). And `a3_14c_narrator` is the one place in
the episode where *nothing is taken away* is said out loud rather than trusted to
the staging.

**Pedagogy:** The payoff of Scene 18, which is the whole reason a boring red
crossing an empty corridor got its own thirty-frame beat five minutes ago. The
sunset is *the same mechanism as the blue sky*, run for longer — not a second
effect, not a different light, and emphatically not somebody taking the colours
away. `a3_13_narrator` runs at 0.88 so the three bounces are three bounces.

---

### Scene 28b — The sunset race: out over the sea **(NEW)**
**On stage:** Narrator, **Green**, **Yellow**, **the volcano** (silent, and it
stays silent)
**Visual:** The beam runs on, lower and warmer, out over open water. Far below,
a **becalmed sailboat** sits dead still on a flat sea — and Green, who sits down
the instant anything stops moving, drifts off the beam and settles on it. Later,
the sleeping island volcano comes up on the horizon exactly where it has been all
act, and **Yellow lands on it**, delighted, to have a sit down on the warm rock.
**Lines:** **`a3_14e_narrator`**, **`a3_14f_green`**, **`a3_14g_narrator`**,
**`a3_14h_yellow`**, **`a3_14i_narrator`**

> **NARRATOR:** Out over the sea now. And then there were four.
> **GREEN:** This is a nice spot.

**HELD BEAT — 20f (0.7s) after `a3_14f_green`.** Green sits, and does not get up
again. That is the beat: he has not given up and he is not sad, he has arrived
somewhere nice and has no further notes.

> **NARRATOR:** Green bounced off as well. He just took longer.

*(Physics honesty, and this is the only place in the episode that shows a MIDDLE
of the spectrum: green scatters less than blue and more than red, which is why
it lasts longer and still does not finish. Not "Green gave up".)*

> **YELLOW:** A warm rock! I will have a little sit down!

**GAP — house 8f.**

> **NARRATOR:** That is not a rest stop.

**HELD BEAT — 45f (1.5s) after `a3_14i_narrator`, trailing to the cut.**
**THE VOLCANO OPENS ONE EYE.** It holds. It closes it. **Nothing else happens and
nothing else enters** — no line, no bubble, no rumble on the soundtrack, no music
sting, no reaction from Yellow, from the Narrator or from anybody else. Yellow
bounces off apologetically inside the tail and goes up after the others, in
silence.

**Scene tail: 14f**, because the held beat above *is* this scene's tail.

**This is the volcano's first acknowledgement in three episodes, and the show
must not notice it.** `a3_14i_narrator` is addressed to **Yellow**, not to the
volcano; it does not name it, does not explain it, and does not concede that it
is anything other than a warm rock. The escalation is exactly one eyelid: ep 2
asleep and unmentioned → **ep 3 one eye** → ep 4 awake. Do not add a rumble here;
the rumble belongs to Scene 35 and firing it twice spends it.

**Pedagogy:** none new, and one thing restated as a picture — the colours do not
drop out at a single threshold, they drop out *in order*, which is the spectrum.

---

### Scene 28c — The sunset race: the finish line **(NEW)**
**On stage:** Narrator, Ray, **Red**, **Orange** (silent until the last line)
**Visual:** The far end of the beam, where it comes out of two hundred miles of
air, and then the eye it lands on — the delivered cut's pedagogy beat, kept, at
the race's finish line. Then a wide, warm, almost empty frame: sea horizon low,
sky orange, the volcano asleep on the horizon, unmentioned. **Nothing else is in
the shot.** Red walks out of the end of the beam at exactly the speed he has
walked at all episode, and keeps walking, left to right, for the whole scene.
Orange is a body-length behind him and matches him, and never overtakes.
**Lines:** `a3_15_ray`, `a3_16_narrator`, `a3_17_ray`, `a3_18_narrator`,
**`a3_18b_narrator`**, **`a3_18c_red`**, **`a3_18d_red`**, **`a3_18e_orange`**,
**`a3_18f_narrator`**

> **RAY:** So who is left?
> **NARRATOR:** The ones that never bounced much. Red. And orange.
> **RAY:** The calm ones.
> **NARRATOR:** The calm ones. Straight down the middle, all the way to your eyes.

*(`a3_16` runs at 0.92 so red and orange land separately. Naming the two a beat
before the picture turns "So who is left?" into a question the audience can
answer — they have just watched the other five leave, one at a time, by name.)*

> **NARRATOR:** At the end of all that air, one colour is still walking.

**HELD BEAT — 36f (1.2s) after `a3_18b_narrator`.** Red walks. Orange walks. The
sky is entirely his colour and there is nobody else in it. **Nothing enters this
beat.**

> **RED:** Everybody bounced off.

**HELD BEAT — 30f (1.0s) after `a3_18c_red`.** He does not speed up. He has not
sped up once in twelve minutes and he does not start now. **Nothing enters.**

> **RED:** Peace and quiet.

**HELD BEAT — 45f (1.5s) after `a3_18d_red`.** **The act's silence, and Red's
whole scene.** The frame is orange, empty and quiet, and the character who owns
it is strolling across it having outlasted everybody. Nothing enters — no bubble,
no gesture, no emotion change. Orange keeps his distance and does not overtake.

> **ORANGE:** What Red said.

**HELD BEAT — 20f (0.7s) after `a3_18e_orange`.** Neither of them says anything
else and neither of them looks at the other. Deadpan is stillness.

> **NARRATOR:** Red has waited all day for this.

**Why this scene exists.** Three reasons, in order of size.

1. **The sunset had no owner.** Act Three explained the sunset beautifully and
   nobody in it was *pleased about the sunset*. The revision's whole thesis is
   that the colours' temperaments are the mechanism, and the calmest character in
   the show ending up alone in a sky made of himself is that thesis paying out.
2. **It is the payoff of five scenes of set-up.** Red's stroll in Scene 18 was
   staged as boring on purpose. Now the boredom has an ending: *"Everybody
   bounced off."* is a direct answer to the goodbye roll call the audience
   watched ninety seconds earlier, and it is funny because he is not sorry about
   it in the slightest.
3. **It is the only place in the episode where the sunset is allowed to be lovely
   without being explained.** Scene 30's crayon is the emotional close of the
   frame story; this is the emotional close of the *mechanism*, and it needs to
   sit before the SUNSET card rather than after it.

**Orange's one line lands after the silence, not inside it.** He agrees with
"Peace and quiet" — thereby ending it — one body-length behind, which is where he
has been all episode, and it hangs his entire character in three words. If the
episode ever needs to lose three seconds, this is a cheaper cut than anything
around it, but it is also the funniest thing in Act Three.

**TONE CHECK, and this is the scene most at risk of breaking the guardrail:**
*the sunset must never read as the light dying.* It does not, and the reason is
that Red is **delighted**, in his own flat way, and he is still walking. Nobody
is alone (Orange is right there), nothing is ending, and the Narrator's last line
is about anticipation rather than loss. The `calm` emotion on both Red lines is
doing that work, which is why Red must not be cast — or performed — on a sleepy
read.

**Pedagogy:** none new, and one thing restated as a picture: the sunset is *what
is left* after the long trip, not something that arrived. "Everybody bounced off."
is `a3_14c_narrator`'s *"They did not go anywhere. They went everywhere else"*
said from the other end of the beam, by the colour that stayed.

---

### Scene 29 — Big Word Three
**On stage:** Narrator, Ray, Sunny
**Visual:** Freeze on the sea horizon at full sunset. **SUNSET** slams on in
capitals lit from below in red and orange, letters bouncing in one at a time.
Then Sunny, half sunk behind the sea, leans on the bottom of the card.

**Visual delta (2026-08-01, visual only, +0.0s):** **Red walks behind the card**
and out the far side while Sunny brags about the drama, at exactly his usual
speed, without looking at either of them. **Orange follows.** Neither the card nor
Sunny acknowledges it. This is the episode's last free joke and it is a
credit-allocation gag: the character who actually *is* the sunset walks past the
man taking credit for it, on his way somewhere else. It sets up `rc_04b_red`,
which is the same joke with a line on it.
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
**On stage:** Narrator, Ray, Puff, **Blue**, Sunny, **Red**
**Visual:** Three-way split screen, one Big Word per panel, each panel lighting
up as it takes its word, exactly as episodes one and two did it — **unchanged.**
The word slams in over each panel in that act's colour — rainbow spectrum, sky
blue, sunset orange. What is new is that two of the three panels get **argued
with from inside**: Blue shoves into Puff's panel, and Red walks into Sunny's
from the side and out of the far edge of it.
**Lines:** `rc_01_narrator`, `rc_02_ray`, `rc_03_puff`, **`rc_03b_blue`**,
`rc_04_sunny`, **`rc_04b_red`**, `rc_05_narrator`

> **NARRATOR:** Let's say the big words together. Ready?
> **RAY:** RAINBOW! Rain and light! Seven colours, and every one of them is me!

*(Free visual: Violet is in the RAINBOW panel, half out of the edge of frame,
waving. Nobody re-frames to include him. **Violet, firing five.**)*

> **PUFF:** SCATTER! Blue bounces off us and goes EVERYWHERE! That is me!

**GAP — 4f.** *(Blue's house gap.)*

> **BLUE:** SCATTER! That is ME bouncing! That is ME!

**HELD BEAT — none.** Neither of them concedes and neither of them is wrong,
which is the point: scattering takes light *and* air, and the two of them
squabbling over one word is the mechanism as an argument. Nobody adjudicates.

> **SUNNY:** SUNSET! That is my light taking the long way! You're welcome!

**GAP — 16f.** *(Red's house gap. He takes his time.)*

> **RED:** It is mostly me.

**HELD BEAT — 20f (0.7s) after `rc_04b_red`.** **Nothing enters this.** Sunny does
not react. He does not hear it, he does not look at Red, and the panel light moves
on to the Narrator while Red is still walking out of the far side of the frame.
Deadpan is stillness.

> **NARRATOR:** Rainbow. Scatter. Sunset.

**Why these two and not more.** Three Big Words, three characters, and the
retrieval trick is unchanged — each word is still re-attached to the character who
embodied it. What is added is a *second* claimant on two of them, and both are
true:

- **Blue on SCATTER** is the mechanism's other half. Puff says "blue bounces off
  us"; Blue says "that is me bouncing". Both are right, and the child now has both
  halves of the sentence attached to a body.
- **Red on SUNSET** is the fourth firing of the series' credit-allocation joke
  (*"Technically, that one is mostly Drip"*, `a1_59`) and the first delivered by
  the character being cheated rather than by the Narrator. It is the last word on
  Sunny in the episode before the Moon and the tease, and it lets the audience
  know something Sunny does not.

**And Sunny still wins.** He does not hear Red, he is not corrected, and he takes
his bow — undefeated and insufferable, on the record, thirty seconds before he
claims a volcano.

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

**Does this crowd `rc_18_sunny` a minute later?** No — since 2026-08-01 the two
of them are the same joke fired twice, and that is now the point. `rc_09b` and
`rc_11b` are him claiming the Moon and then demanding to know where its sky went;
`rc_18` is him claiming a volcano. Three claims in ninety seconds, none of them
corrected, from a character the episode has declined to declare wrong — which is
exactly the state episode four wants to inherit him in. **The inversion that used
to live at `rc_18` is gone**, so these two lines no longer have to set anything
up: they are an unbroken gag rather than a ramp. Neither uses "You're welcome!"
(seven firings is the ceiling) and neither uses "EXCUSE ME" (`a2_45` is its only
firing).

---

### Scene 35 — Tease and sign-off
**On stage:** Narrator, Sunny, Ray
**Visual:** Back to the sea horizon at dusk. The volcano, asleep, exactly where it
has been in every sea shot this act and with nothing having drawn attention to it
since it closed its eye in Scene 28b. Then one smoke ring comes out **wobbling**,
and does not close. A low rumble moves the water. Sunny, half under the horizon,
stops mid-pose and looks at it. Then the episode four title card, with Ray waving
from the corner.
**Lines:** `rc_16_narrator`, `rc_17_narrator`, `rc_18_sunny`,
**`rc_18b_narrator`**, `rc_19_ray`

> **NARRATOR:** Next time.

**HELD BEAT — 45f (1.5s) after `rc_16_narrator`.** The wobbling smoke ring,
alone, in silence.

> **NARRATOR:** Something is waking up.

**HELD BEAT — 60f (2.0s) after `rc_17_narrator`.** The rumble, felt in the water
and in the smoke, with nothing said over it. **Keep this wondrous, not
frightening** — no dark chord, no red glow, no shaking camera. Something large
is stirring in a friendly world.

> **SUNNY:** OH! That one is me as well! HA! HA!

**HELD BEAT — 45f (1.5s) after `rc_18_sunny`.** **Same length, opposite content
from the delivered cut.** Sunny is not unsure and he is not squinting — he is
**beaming**, at full brightness, with his arms out, having claimed a volcano
without a second's hesitation. The volcano rumbles again behind him and he does
not notice. **Nothing enters this beat** and **emotion lead cut to 0**: no
dawning, no doubt, no reaction of any kind. The joke is entirely that he is wrong
and does not know it, and the audience does.

> **NARRATOR:** Hmm. We will find out.

**HELD BEAT — 30f (1.0s) after `rc_18b_narrator`.** The volcano, the rumble,
Sunny still beaming. Nothing enters.

> **RAY:** Bye! Look up. That's me.

**What changed, 2026-08-01.**

- **`rc_18_sunny` was "That is not me."** — the inversion of the show's oldest
  running gag, and it is **withdrawn and banked for episode four**, where it can
  land *after* the wrongness ceremony rather than instead of it. In its place, the
  gag's **standard firing**, in the series wording it has had since ep 2's
  `rc_14_sunny`: reflexive, instant, completely unearned. Three episodes of a
  character claiming everything end with him claiming one more thing, which is the
  honest ending for a character who has not been corrected.
- **`rc_18b_narrator` is new: "Hmm. We will find out."** — the doubt, planted
  without a verdict. **"Hmm."** is the Narrator's own established deadpan
  (`a1_27_narrator`, where she declines to argue with Ray about being plain), so a
  returning viewer already knows exactly what it means and exactly how much she is
  not saying.
- **`rc_19_ray` is unchanged.**

**Pedagogy:** none, and the series continuity is now *forward*-facing rather than
backward. The delivered cut's tease was a payoff (he declines a claim); this one
is a **setup** (he makes one, and the show quietly disagrees). Episode four
inherits a character who has claimed the volcano out loud, on the record, in the
last twenty seconds of the previous episode — which is the strongest possible
opening position for *"I did that." / "No. He really didn't."*

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

**Line length.** Every line sits between two and fifteen words. Since
`a3_06_narrator` was cut there is **no line in the episode over fifteen words**.
The short end is all deliberate deadpan buttons — "Lovely air.", "Peace and
quiet.", "What Red said.", "Sorry, Violet." — and every one of them is bought by
a held beat rather than by length.

**Comedy pacing is designed in, not added later.** Both halves of the STYLE.md
rule are already written down here:

- **Slower per-line speeds** for every list, roll call, sound word and repeated
  straight-line, set in `narration.mjs` with a comment saying why.
  The deadpan floor is `a2_49_narrator` ("He has a point.")
  at 0.85; the slowest character line is the seven-name roll call at 0.88, tied
  with `a3_13` ("Bounce. Bounce. Bounce."), `a2_43` (the
  interlock) and `rc_05` (the summary). **Two lines now run *above* 1.0** for the
  first time in the series — Blue at 1.05 and Indigo at 1.1 — because being
  faster than everybody else is the character and the physics at once.
- **Held beats of silence**, forty-two of them, each written above with its
  exact frame count and its reason. They become `gaps` in `Video.tsx`. The
  longest are the world turning and the fifth "Are we there yet?" (75f each), and
  the two-second holds carry the episode's biggest pictures: the crayon choice,
  the middle of the eight-minute journey, the seven-piece reveal, the black lunar
  sky and the rumble under the tease.
- **The approach gaps are the third kind of number.** Red 16f, Blue 4f, Indigo
  12f, before every line each of them says. See "How to read the held beats".
- **No emotion lead on held-beat scenes.** The staging kit's default eight-frame
  `useEmotion` lead will leak a punchline into the silence in front of it.
  Scenes 7, 16, 23 and 35 say so explicitly; treat it as the rule for every held
  beat.

**Running gags, and where they fire.**
- *"Look up. That's me."* — `a2_57`, `a3_27` (in its sunset form, "That's
  still me"), `rc_19`. Ray's catchphrase, and deliberately a *pointing* line: a
  child can obey it and be right. Its negative version, *"I'm the plain one"*,
  fires at `a1_24`/`a1_26` and is answered at `a1_55`/`a2_56`.
- *"Are we there yet?"* — **five firings**, identical text, **one recording**
  (`a1_13_ray`, aliased at `a1_15`, `a1_15c`, `a1_15e`, `a1_16b`). The flat
  almanac answers and the escalating silences (30/45/60/75) are the joke, and
  the fifth is **unanswered** — its button is a cut.
- *"You're welcome!" / "HA! HA!"* — `co_08`, `a1_11`, `a1_58`, `a1_60`, `a2_53`,
  `a3_22`, `rc_04`. **Seven firings is the ceiling** and no new line uses it,
  including `rc_18`.
- *"That one is me as well!"* — collected in `co_08` (the paint theory),
  conceded in half at `a2_49`–`a2_55`, and fired **straight, unbroken, at
  `rc_18`**. **The inversion is not in this episode.** It is banked for episode
  four, where it can land after the wrongness ceremony rather than instead of it.
- *"Different show. Same sun / sky / rain / air."* — `a1_32` (Drip), `a2_18`
  (Puff). Both at 0.92, the same flat read as episode two's two firings.
- *"You can't see me. But you can FEEL me."* — `a2_17`, once, on Puff's
  entrance.
- *The roll call* — **twice**, and the shape is fixed both times: a character
  cheerfully naming near-identical strangers, one flat explanatory line from the
  Narrator, an unbothered and deliberately unseasoned button. `a1_42`+`a1_43`+
  `a1_44` in Scene 10 (a greeting, seven names, **no spoken replies from anybody
  even though six of them now have voices**) and `a3_14b`+`a3_14c`+`a3_14d` in
  Scene 28 (a goodbye, three names, and they have all already gone). **Nobody
  replies inside either one.** Blue and Indigo speak *before* the Scene 28 firing,
  never between `a3_14b` and `a3_14c`.
- *Credit allocation* — `a1_59` ("Technically, that one is mostly Drip"),
  `a2_54` ("It is his light. It is not his painting."), `rc_04b` ("It is mostly
  me."). Three firings, three different speakers, one joke — and the third is the
  first delivered by the character being cheated.
- *Nobody ever notices Violet* — **five firings, no lines, no clips, no
  runtime**, carried entirely by the one character in the show who never speaks.
  Scene 10 plants it (Ray greets him by name, last of seven); Scene 11 fires it
  (he gets to the RAINBOW card last and ends up half off the W); Scene 20 pays it
  off (he out-bounces the entire frame, is ignored, droops — "Sorry, Violet.");
  **Scene 28 buttons it** (he leaves the race last, highest and furthest, in
  total silence, while Blue is shouting and Indigo is echoing, and Yellow shouts
  "Great bounce, Violet!" after him and gets nothing back); and he waves from the
  edge of the recap panel. **He must be the same blob every time** — same seventh
  colour, same `SHARD_PHASE[6]`, same silhouette — or he is five different
  accidents. **He does not get a line, ever.** Since 2026-08-01 five of his six
  siblings speak, which is what makes his silence a joke rather than a fact.
- *The volcano is asleep.* — **no line about it, anywhere in the episode.**
  Scenery on the horizon in Scenes 25, 28b, 28c, 29 and 31; it opens one eye in
  Scene 28b (in silence, nobody reacting) and it stirs in Scene 35. See the
  volcano rule under Scene 26.

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
- **No colour ever bounces "never".** Red's own line is *"I go straight through.
  Always have"* precisely so it does not contradict `a2_23_narrator`'s accurate
  *"hardly bounces at all"*. Red light does scatter; it just does not scatter
  much, and no character in the episode says otherwise.
- **Nothing is taken away.** Scattering is bouncing, not theft — see the title
  note. Act Three is the one place where a colour genuinely does go missing from
  a beam, and it is staged as blue *bouncing off sideways*, visibly, into the
  rest of the sky, rather than as blue being removed. **The sunset race makes
  this a hard staging rule:** every colour that leaves is bounced **UP into the
  blue above**, never falling, fading, dropping behind or vanishing, and
  `a3_14g_narrator` says out loud that Green *bounced off as well, he just took
  longer* — which is the middle of the spectrum, said once, plainly.
- **The colours drop out in spectrum order, and that order is the lesson.**
  Blue, Indigo and Violet first (high air), then Green, then Yellow, then Red and
  Orange finish. A child who has watched that cannot think scattering is a switch.
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

**The five shared recordings.** `a1_15_ray`, `a1_15c_ray`, `a1_15e_ray` and
`a1_16b_ray` are all `a1_13_ray` — the five firings of "Are we there yet?" are
**one recording played five times**, which is the entire gag — and `a3_31_sunny`
is `a1_03_sunny`. What follows was written when there were two and applies
unchanged to all five.

`a1_15_ray` is `a1_13_ray` and `a3_31_sunny` is
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
6. **Sunny's concession run** (`a2_48` → `a2_49` → `a2_50` → `a2_53`), and
   **`a2_49` is the single most important clip in the revision**. "He has a
   point." at 0.85 must be **flat, not amused and not apologetic** — the whole
   arc change rests on it landing as a surprise rather than as a dodge. Then
   `a2_50` ("I DO have a point! I have LOADS of points!") must read as triumph
   rather than as a shrug, and the "points" pun must survive `am_puck`; it is
   free to reword, and the fallback is "Of course I do. I always do."
7. **The six punch-up lines**, which are the only clips in the file nobody has
   heard in context. Three of them are the ones that fail by being *sold*:
   `a2_36b_ray` ("Sorry, Violet.") and `a3_14d_ray` ("I will see me later.") are
   both unseasoned on purpose — same call as `a1_44_ray` — and if either sounds
   like a punchline being delivered it is wrong. The third is
   `a3_14b_ray` ("Bye Blue! Bye Indigo! Bye Violet!") at 0.9: three items, and
   they have to separate or they are one noise. Sunny's two (`rc_09b`, `rc_11b`)
   are free to reword on kokoro; listen for `rc_11b` reading as a genuine
   question rather than as a brag.
8. **`rc_18_sunny`** ("OH! That one is me as well! HA! HA!") at 1.0 — **full
   confidence, no doubt anywhere in it.** If it plays as unsure, the tease has
   gone the wrong way and taken episode four with it. Then `rc_18b_narrator`
   ("Hmm. We will find out.") flat, and definitely not arch.
9. **The whole of Sunny, once**, now that he is back on `am_puck`: the greeting
   (`a1_03`), a brag at full volume (`co_08`, `a2_53`) and the four moments he
   stops. Episodes one and two are the reference — he should sound like the same
   character, not a quieter one. Then **Sunny against Ray back to back**
   (`a2_45` → `a2_46`, `a2_52` → `a2_53`): two engines in one exchange, and the
   thing to listen for is a level or timbre mismatch at the cut.
10. **Ray's two `sad` lines** (`a1_24`, `a1_26`) back to back. Two is the whole
   sulk, and the failure mode is a hero who sounds miserable rather than small.

**Ear-check list — the 2026-08-01 additions**, and these come *before* any of
Act Two or Act Three is staged, because six voices were cast without an audition
and every one of them is unheard in context:

11. **`a3_18d_red`** ("Peace and quiet.") — **the most fragile clip in the
   file.** `Patient_Man` at 0.9, two words, 45f of silence after it, and it has
   to be **contented, not tired**. A tired Red turns Scene 28c from the sunset's
   payoff into the light dying, which is the one thing the tone guardrail
   forbids. If it is sleepy, the fix is the *casting*, not the speed.
12. **`a2_24b_red`** ("Lovely air.") — two words at 0.9, the shortest and slowest
   clip in the episode. Listen for clipping at either end. Fallback pre-written:
   "Lovely air, that."
13. **`a2_25b_blue`** ("Hi! Sorry! Sorry! Hi! Sorry!") — five repeated
   exclamations on a paid engine, and it came back at **5.54s**, which is long
   for five words. If MiniMax is padding the exclamations into a list, the
   pre-written fallback is "Hi! Sorry! I did not mean to hit you!"
14. **`a2_28b_blue`** ("I am over here! And here! And HERE!") at **6.66s** — the
   three-bubble line. Re-measure the `beats()` fractions against the delivered
   clip before staging it, and check that the three clauses actually separate at
   1.05 rather than running as one shout.
15. **Blue against Ray, back to back** (`a2_28b_blue` → `a2_29_narrator` →
   `a2_32_ray`). `Decent_Boy` was Ray's runner-up and Ray went elsewhere; the two
   of them share scenes and Blue is literally a piece of Ray. **If they sound
   like the same person, the split reveal's whole point is damaged** and Blue is
   the one that moves.
16. **Indigo against Blue** (`a2_28b_blue` → `a2_28c_indigo`, then
   `a3_13b_blue` → `a3_13c_indigo`). Same casting at pitch +3 and speed 1.1: he
   has to read as a *faded copy of Blue*, not as a seventh person and not as a
   chipmunk. If the pitch shift reads as comic rather than as thin, drop it to +2.
17. **`a3_18e_orange`** ("What Red said.") at pitch +2, straight after
   `a3_18d_red`. The joke only works if he is audibly *adjacent* to Red — a
   smaller Red, not a second authority.
18. **The five "Are we there yet?" firings as a run**, with the four answers, to
   check the rhythm reads as a pattern rather than as a fault — and that the
   skipped arithmetic (two → four) is heard.
19. **The race as a run** (`a3_12` → `a3_18f`), which is ninety seconds and six
   voices. Listen for whether the exits read as *departures* or as *casualties*;
   if anybody sounds sad about leaving, that is the one failure mode Act Three
   cannot carry.

**Grown-up smirks.** `co_04` ("Every kid on this whole planet picks blue"),
the almanac answers around "Are we there yet?" and especially `a1_15d` (the
**skipped arithmetic**, two to four — new), `a1_59` ("Technically, that one is
mostly Drip"), `a2_12` ("I keep the paint somewhere else"), `a2_24b` (Red
complimenting the air that failed to bounce him — new), `a2_35` ("Our eyes are
just not very good at violet"), `a2_55` ("He will only remember one of those"),
`a3_14e` ("And then there were four" — new), `a3_14i` ("That is not a rest stop."
over a volcano nobody names — new), `a3_18e` ("What Red said." — new), `a3_26`
("Some days you need a different crayon"), `rc_04b` ("It is mostly me." — new)
and `rc_18b` ("Hmm." — new). **Fourteen, against a brief of four**, and `a3_06`'s
volcano deadpan is the only one lost.

## Staging worklist — what the revision left unbuilt (wave 2)

The 2026-08-01 revision is a **script-layer** change: `narration.mjs`,
`Video.tsx` and this file are done, all 208 clips exist, the timeline is valid
and the episode renders end to end. **No scene file was touched.** Every scene
below is currently mounting its *old* component against its *new* lines, which
is safe — `lineWindow`/`heldBeat` return an empty window for a line key that is
not in the scene — but visibly wrong until it is restaged.

**Before anything else, three kit-level items**, because every scene below
depends on them:

1. **`Speaker` in `scenes/common.tsx` does not know the colours.** `speakerOf()`
   maps any unrecognised key tail to `narrator`, so all sixteen colour lines
   currently stage as narrator turns — no mouth moves and no bubble appears.
   Add `red | orange | yellow | green | blue | indigo` to `Speaker`, give each a
   `PHASE`, and wire `CHAR_BOX`. Violet is **not** added: he has no lines and
   must never have a body wired to a clip.
2. **The seven personality tables.** One `SHARD_PHASE` index, one signature move
   and one idle per colour, written once and read by every act. This is the
   heaviest single item in the revision and it is not a set.
3. **The frequency ladder** (see the cast section): Red a half-wave, each colour
   up the ladder visibly wavier, Violet a fizzing blur, one shared wave speed.

| Scene | What it needs | Size |
|---|---|---|
| `s05_journey` | Five identical firings against a shot that never changes; escalating silences already in the timeline. Nothing new to draw. | small |
| `s09_split` | The seven come alive sequentially on `a1_37_ray`, one every ~8f, in character. 60f beat stays empty. | medium |
| `s10_rollcall` | Seven reactions in character; **Red does not react**; nobody replies out loud. | medium |
| `s11_bigword_rainbow` | Seven letters taken in character; Blue ricochets off Drip on the B. | small |
| `s16_myth_paint` | **Negative work** — delete the ladder, the dust sheet and the painting animation. One tray, tipped to camera, empty. | small (removal) |
| `s18_red_straight` | Red + Orange walking; two new Red lines with bubbles; the moved 30f beat. | medium |
| `s19_blue_everywhere` | Blue's ricochet path, Indigo four frames behind, and the **three-corner bubble** on `a2_28b_blue` (6.66s — re-measure the `beats()` fractions). | **large** |
| `s20_every_direction` | Arrows become Blue; the dome resolves to Blue's face for ~½s on the line; Violet compared with Blue rather than a dot. | medium |
| `s21_bigword_scatter` | Blue throws the letters; Indigo throws one late and misses. | small |
| `s23_sunny_wrong` | **The diagram must no longer stop or droop.** The grin *grows* across the 36f beat; the diagram rebuilds on `a2_51`; Red walks through on that line. | medium |
| `s26_volcano` | Component now unreferenced — delete it and its imports. | trivial |
| `s27_long_way` | Blue on the midday beam, Red on the sunset beam, walking their own path lengths. | small |
| `s28_blue_runs_out` | **Rebuild as the race's first leg**: seven set off, Blue/Indigo/Violet bounce **up** and out, Yellow shouts after Violet, then the goodbye roll call against empty space. | **large** |
| `s28b_race_island` | **NEW, placeholder today.** Sea leg, becalmed sailboat, Green sits; the island; Yellow lands; **the volcano opens one eye** for 45f and closes it. | **large** |
| `s28c_red_arrives` | **NEW, placeholder today.** Finish line landing on an eye, then a wide empty orange frame with Red walking and Orange one body-length behind. | medium |
| `s29_bigword_sunset` | Red and Orange walk behind the card and out the far side. | small |
| `s32_chant` | Blue shoves into Puff's panel; Red crosses Sunny's; Sunny does not react. | medium |
| `s35_tease` | **Sunny beams instead of squinting** — the opposite reaction to the delivered cut — and a new Narrator line after him. | small |

Untouched and still correct: Scenes 1, 2, 3, 4, 6, 7, 8, 12, 13, 14, 15, 17, 22,
24, 25, 30, 31, 33, 34.

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
- **Thirty-six scenes and two hundred and eight lines, running 13:36.1** — well
  over the brief's ~10.5–12 min range, and knowingly. The delivered cut was
  **12:17.9**; the 2026-08-01 revision spends **+78.2s** and buys back 9.6 of
  them by cutting Scene 26. Where it went: the sunset race over three scenes
  (~+45s, including Red's moment, which the note asked for by name), the journey
  gag's five firings (+13.9s), Red's and Blue's lines in Scenes 18 and 19 (+12s),
  the chant's two extra claimants and the rebuilt tease. **The addendum approved
  the growth implicitly by the scope of the request; this is the flagged final
  number.** If it has to come under thirteen minutes, in order of what costs
  least: `a3_18e_orange` ("What Red said.", ~3s), the fifth "Are we there yet?"
  and its 75f (~4s), `rc_03b_blue` (~4s, and Red's is the better half of that
  beat), `a3_18b_narrator` and its 36f (~4.8s, opening Scene 28c cold on Red
  walking), and Scene 28b's Green pair (~6s, which costs the middle of the
  spectrum). **Do not** cut `a2_24b_red`, and **do not** cut Scene 12, the
  rainbow homework — both previous audits recommended against it and so does
  this one.
- **Ray's arc is the same shape as Puff's** (a character wrong about himself,
  corrected by the mechanism, catchphrase inverted). That is deliberate
  repetition of a structure the audience has now responded to twice, not an
  accident — but it is worth the orchestrator's eye, because a third episode of
  "the hero thinks they are nothing" is the point at which a shape becomes a
  formula. The counter-argument in this script's favour: Ray is wrong about
  being *plain*, not about being *real*, and Act One resolves his arc at the
  four-minute mark rather than at the end, which leaves Acts Two and Three free
  to be about the sky instead of about him.
