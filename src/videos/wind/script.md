# Puff and the Kite That Wouldn't Fly

**Series:** Little Big World (kids' educational), episode two
**Topic:** where wind comes from
**Audience:** six-year-olds — and the grown-up in the room
**Target:** ~10–11 minutes of finished video
**Shape:** cold open, three acts, recap. Thirty-six scenes, one hundred and
seventy-three spoken lines.

> **Title note.** The brief's working title was *Puff and the Big Empty*. "The
> Big Empty" is the best phrase in this script and it is also the one idea a
> six-year-old cannot picture before watching — an empty space is exactly what
> a child does not yet believe is a thing. *Puff and the Kite That Wouldn't
> Fly* names the promise instead of the mechanism, which is what episode one's
> title did too. Alternates, if the orchestrator prefers: *Puff Pushes the
> World*, or *Puff and the Gap* if we want the mechanism in the title after
> all. The gap keeps its name inside the episode either way — Act Two, Scene
> 17 is still "the Big Empty" on screen.

The companion file `narration.mjs` holds the exact text sent to the
text-to-speech model. Every line below quotes it verbatim; if you change a line,
change it in both files.

## Cast and voices

| Character | Engine | Voice | Speed | Who they are |
|---|---|---|---|---|
| **Narrator** | kokoro | `af_heart` | 1.0 | Warm storyteller, returning. Deadpans at Sunny for a living. Voice only — no body, ever. |
| **Puff** | minimax | `Exuberant_Girl` | 1.0 | Our hero. One small puff of air. Convinced he is invisible and therefore *nothing*. Apologises constantly at the start and not once after Act Two. Emerging catchphrase: *"You can't see me. But you can FEEL me."* Cast 2026-07-26 — **pending a full-context ear check**. |
| **Sunny** | minimax | `Imposing_Manner` | 1.0 | The Sun, returning, unchanged, insufferable. This is the episode where *"that one is me as well!"* turns out to be literally true for everything on screen. |
| **Cloudia** | minimax | `Abbess` | 1.0 | Returning for one scene. Gets delivered across the sky like a parcel and could not be happier about it. |
| **Drip** | minimax | `Lively_Girl` | 1.0 | Returning for exactly one line, waving from inside Cloudia. Fan service, deliberately. |
| **Beetle** | minimax | `Patient_Man` | 0.92 | Two lines, fired three times across the episode. Calm, unhurried, and genuinely unable to perceive Puff. |
| **Leaf** | minimax | `Calm_Woman` | 0.92 | The same two lines one scene later, in a different voice. That difference is the whole point of casting her. |
| **Rock** | minimax | `Deep_Voice_Man` | 0.85 | One line, very slow, completely sincere. |

**The three cameos have their own voices** (2026-07-27). They were the Narrator
doing all three, on the theory that the show never grows past five actors — and
the first six-year-old to watch it said *"the beetle and the leaf sound like the
narrator"*, which is the gag failing. The joke needs the audience to hear
somebody **else** fail to notice Puff; in the Narrator's voice it reads as the
storyteller asking a rhetorical question. The show has eight voices now, and
the guardrail it replaces is a better one: **anything with a face and a line
gets its own voice.** None of the three was auditioned — they were cast on
description from the same MiniMax system-voice list — so all three are on the
ear-check list below.

Their line keys still end `_narrator` (`a1_07_narrator`, `a2_08_narrator`, …).
That is deliberate: the keys are wired into `Video.tsx`, every `SPEAKER_VISUAL`
map and every bubble map, nothing downstream derives the *staged* speaker from
the key anyway (that is `useStage`'s per-line override, API 2b), and renaming
them would be a rename of the episode for no gain. The suffix now means "not
one of the four principals".

**Two engines.** The Narrator stays on Kokoro — free, local, and re-synthesized
the moment a line is reworded. Everybody with a body on screen is cast on
MiniMax speech-2.8-hd (via Replicate), which is paid but takes an `emotion` per
line and honours inline pause markers. Emotions are set in `narration.mjs`, one
comment per line naming the stage direction below that justified it, and every
unmarked line stays `auto`. The only pause markers in the episode are the two
in `a2_41_sunny` — see Scene 21.

**Puff is cast: MiniMax `Exuberant_Girl` at 1.0**, the last actor off a
placeholder (2026-07-26). Auditioned on both engines on the three lines that
ask for three different things — `a1_04_puff` (small, apologetic), `a2_19_puff`
(delighted, airborne) and `a3_49_puff` (the big shout): kokoro `af_sky`,
`af_nicole`, `bf_lily`, `am_liam`; MiniMax `Sweet_Girl_2`,
`Inspirational_girl`, `Decent_Boy`, `Lovely_Girl`, `Young_Knight`,
`Exuberant_Girl`. The old kokoro 1.05 was compensation for `af_sky`; this voice
brings the small quick breaths herself. **Still pending a full-context ear
check** — nobody has yet watched the episode through with him in it, and the
two spelled Big Words (below) have never been heard on this engine at all.

**Sixty-two lines, twenty-seven of them seasoned.** Puff's `emotion`s are the arc:
six `sad` in Act One where the directions say deflation, `surprised` where a
fact lands on him, `happy` from his first win onward, one `calm` (the cool sea)
and one `angry` — the big shout, where on this engine `angry` is effort and
volume rather than temper. Every non-`auto` line names its stage direction in a
comment. The apologies are deliberately *not* all sad: Scene 11's button and
Scene 22's reflex are comedy and habit respectively, and playing them sad kills
both.

## The four Big Words

Each Big Word is said plainly at least twice **and** gets one chant-or-spell
moment led by Puff, who is not proud of himself the way Drip was — he is
astonished.

| Word | Act | Line keys | Treatment |
|---|---|---|---|
| **AIR** | One | `a1_21`, `a1_37`, `a1_38`, `a1_39`, `rc_02`, `rc_06` | `WordCard`, spelled A. I. R. |
| **WARM AIR RISES** | Two | `a2_20` (twice in the line), `a2_21`, `rc_03`, `rc_06` | **Rule stamp, not a `WordCard`** — see Production notes |
| **WIND** | Two | `a2_31`, `a2_32`, `a2_33`, `a2_34`, `rc_04`, `rc_06` | `WordCard`, spelled W. I. N. D., chant "Wind is air in a HURRY!" |
| **SEA BREEZE** | Three | `a3_16`, `a3_17`, `a3_18`, `rc_05`, `rc_06` | `WordCard` |

## Line-key convention

`<act>_<number>_<speaker>`, in strict playback order, matching `narration.mjs`
exactly. Act prefixes: `co` cold open, `a1` the grass, `a2` the lift, `a3` air
with a job, `rc` recap.

## How to read the held beats

Every silence in this episode is written down, because episode one's audience
test said the jokes needed room and "give it room" is not a note anyone can act
on twice the same way. A stage direction that reads

> **HELD BEAT — 45f (1.5s) after `a1_09_narrator`.**

means: that line's `gapFrames` in `Video.tsx` is **45**, the picture is alone on
screen for a second and a half, and **nothing** — no line, no entrance, no
emotion change — starts inside it. Thirty frames is one second. These numbers
are the script's, not the builder's; raising one is a note, lowering one is a
change to the joke.

---

# COLD OPEN

*Roughly thirty seconds. The problem, and the promise.*

---

### Scene 1 — A hill, a kid, a kite, and no wind at all
**On stage:** Narrator (voice only)
**Visual:** A green hill against a flat blue sky. On the crest, a kid in
silhouette — we never see a face, and the kid never speaks, all episode. A
brand new kite, red, held up hopefully. Every blade of grass is perfectly,
unnaturally still. On "Watch." the kid runs. The kite lifts about as high as a
shoulder, hangs, and drops. It lands on the grass with an audible little
*flump* and does not move again.
**Lines:** `co_01_narrator`, `co_02_narrator`, `co_03_narrator`,
`co_04_narrator`, `co_05_narrator`, `co_06_narrator`

> **NARRATOR:** This is a story about a hero you cannot see. Not once. Not ever. Not even a little bit.
> **NARRATOR:** Here is a hill. Here is a kid. And here is a brand new kite.
> **NARRATOR:** The kid is ready. The kite is ready. Everything is ready.
> **NARRATOR:** Watch.

**HELD BEAT — 60f (2.0s) after `co_04_narrator`.** The whole run, the hopeful
lift and the flop happen in complete silence. This is the first thing the
audience sees the show do, and it teaches them that this show lets things land.
No music sting on the flop; the flump is the only sound.

> **NARRATOR:** Hmm.

**HELD BEAT — 36f (1.2s) after `co_05_narrator`.** Hold on the kite lying in the
grass. The kid's shoulders drop, once. Nothing else moves.

> **NARRATOR:** The kite went up. And then the kite went down. Flop.

**Pedagogy:** States the absence. The whole episode is now an answer to a
question the child can see with their own eyes — *why won't it fly today?* —
and the answer is a thing that is missing rather than a thing that is wrong.

---

### Scene 2 — Title, over a still hill
**On stage:** Narrator (voice only)
**Visual:** Pull back off the hill. The title blows on from the right in
letters that arrive on a wind we cannot see — and then everything settles,
completely still, because there is no wind here yet. Kite still flat in the
grass at the bottom of frame for the whole card.
**Lines:** `co_07_narrator`, `co_08_narrator`

> **NARRATOR:** Something is missing today. Something this story cannot show you.
> **NARRATOR:** Because the missing thing is invisible. Let's go and find it.

**Pedagogy:** The show's promise, and an unusual one — we are going to spend ten
minutes on something that is never on screen. Saying so out loud turns the
invisibility from a production problem into the hook.

---

# ACT ONE — YOU'RE REAL, PUFF

*Air is stuff. Proved three ways, two of which a child can do at home before
bedtime.*

---

### Scene 3 — Down in the grass
**On stage:** Narrator, Puff
**Visual:** Drop all the way down the hill to grass-blade height, blades like
green skyscrapers. Puff is a small soft swirl — a curl of pale outline with a
face, barely there. **Puff is drawn at about forty percent opacity for the
whole of Act One**, and gets more solid as the episode goes on; by the recap
he is at full strength. Nobody says a word about it.
**Lines:** `a1_01_narrator`, `a1_02_puff`, `a1_03_narrator`, `a1_04_puff`

> **NARRATOR:** Down at the bottom of that hill, in the grass, somebody was having a bad morning.
> **PUFF:** Hello? Hello, everybody! It's me! I'm here!
> **NARRATOR:** This is Puff. Puff is a small puff of air.
> **PUFF:** Sorry. Sorry. I know you can't see me.

**Pedagogy:** Hero established at the scale where wind actually starts — ground
level, in the grass, not in the sky. The opacity ramp is the arc drawn instead
of stated.

---

### Scene 4 — The beetle
**On stage:** Beetle, Puff (Narrator opens the scene)
**Visual:** A round, shiny, extremely calm beetle on a stem. Puff bobs right up
in front of its face and waves both little arms. The beetle looks straight
through him — the pupils track past Puff to the middle distance, which is the
whole gag and must be staged, not implied.
**Lines:** `a1_05_narrator`, `a1_06_puff`, `a1_07_narrator`, `a1_08_puff`,
`a1_09_narrator`, `a1_10_puff`

> **NARRATOR:** Puff floated over to a beetle.
> **PUFF:** Good morning, beetle! I am Puff!
> **BEETLE:** Hello? Is somebody there?
> **PUFF:** YES! Me! I am right here!
> **BEETLE:** Huh. Must have been nothing.

**HELD BEAT — 45f (1.5s) after `a1_09_narrator`.** The beetle goes back to
beetling. Camera stays on Puff, who does not move and does not react — the
deflation is the picture. **Cut the `useEmotion` lead to 0 on this scene**: if
Puff's face falls before the beetle finishes the line, the beat is spent early
(STYLE.md, Comedy pacing).

> **PUFF:** Sorry.

**Pedagogy:** None. This is the character's problem, dramatised. It also sets a
shape the audience will recognise twice more — which is the only way the payoff
in Scene 32 can work.

---

### Scene 5 — The leaf
**On stage:** Leaf, Puff (Narrator opens the scene)
**Visual:** Identical staging to Scene 4, one beat wider, with a leaf where the
beetle was. Same framing, same distance, same everything — the audience should
feel the repeat before they hear it. Puff's wave is smaller this time.
**Lines:** `a1_11_narrator`, `a1_12_puff`, `a1_13_narrator`, `a1_14_puff`,
`a1_15_narrator`, `a1_16_puff`

> **NARRATOR:** Puff floated over to a leaf.
> **PUFF:** Good morning, leaf! I am Puff!
> **LEAF:** Hello? Is somebody there?
> **PUFF:** It is ME. Puff. We do this every single day.
> **LEAF:** Huh. Must have been nothing.

**HELD BEAT — 54f (1.8s) after `a1_15_narrator`.** *Longer than Scene 4's, on
purpose.* By the second firing the audience is ahead of the joke and the laugh
arrives during the silence rather than after it; the extra nine frames are
where that laugh goes. Same rule: no emotion lead, no early cut.

> **PUFF:** Sorry. Sorry.

**Pedagogy:** Still none, still load-bearing. Two identical failures make the
third instance — five minutes away, at the top of the hill — a punchline
instead of a line.

---

### Scene 6 — Nothing at all
**On stage:** Narrator, Puff
**Visual:** Puff sinks down between two grass blades and goes very quiet and
very faint — drop him to about twenty-five percent opacity here, the lowest he
ever gets. The Narrator's line arrives from nowhere, and Puff looks up, which
is the first time all episode anybody has answered him.
**Lines:** `a1_17_puff`, `a1_18_puff`, `a1_19_narrator`, `a1_20_puff`,
`a1_21_narrator`, `a1_22_puff`

> **PUFF:** Nobody ever SEES me. Not the beetles. Not the leaves. Nobody.
> **PUFF:** I think I might be nothing at all.

**HELD BEAT — 24f (0.8s) after `a1_18_puff`.** Short. Sad, not tragic — this
show does not do peril and it does not do despair either. Just enough for the
sentence to be true for a moment before somebody argues with it.

> **NARRATOR:** Puff. May I say something?
> **PUFF:** Sorry. Yes. Sorry.
> **NARRATOR:** You are not nothing. You are AIR. And air is real stuff.
> **PUFF:** Stuff? Me? I am STUFF?

**Pedagogy:** The episode's actual misconception, said by the character who
holds it — *invisible means nothing*. Almost every six-year-old believes some
version of this, and it is why "wind is moving air" lands as a definition
rather than an explanation. Act One exists to break it before Act Two needs it
broken. `a1_17_puff` is the roll-call line and carries a 0.95 speed override in
`narration.mjs` so its three items separate.

---

### Scene 7 — Proof one, the dandelion
**On stage:** Narrator, Puff
**Visual:** A dandelion clock, huge in frame, every seed rendered. Puff swells
up — cheeks out, comically round, the most solid he has looked so far — and
holds it. On "Poof!" the seed head detonates into a slow-motion galaxy of
seeds crossing the whole screen.
**Lines:** `a1_23_narrator`, `a1_24_narrator`, `a1_25_puff`, `a1_26_narrator`,
`a1_27_puff`

> **NARRATOR:** Watch. Here is a dandelion, all full of fluffy seeds.
> **NARRATOR:** Now. Take a big breath, and puff it out.
> **PUFF:** Okay. Here I go. Ready? Poof!

**HELD BEAT — 45f (1.5s) after `a1_25_puff`.** The seeds fly in silence. No
narration over the proof — the point is that the audience sees an invisible
thing move a visible one, and a voice underneath it would make it a
demonstration instead of an event.

> **NARRATOR:** Every single seed. Gone. Flying.
> **PUFF:** I did that? With my puff? I moved a whole flower?

**Pedagogy:** Proof one of three that air is stuff, and the one every child has
personally done. Seeds also plant Act Three's payoff, five minutes early and
without a signpost.

---

### Scene 8 — Proof two, your own hand
**On stage:** Narrator, Puff
**Visual:** Puff turns and looks *straight down the lens* — the only time in the
episode he addresses the audience directly. Behind him the grass frames a
window of open sky. On the wave line, a hand-sized swirl of Puff-coloured
motion arcs sweeps across frame, at the speed of a real wave.
**Lines:** `a1_28_narrator`, `a1_29_narrator`, `a1_30_narrator`, `a1_31_puff`

> **NARRATOR:** Here is one you can try right now, wherever you are.
> **NARRATOR:** Wave your hand in front of your face. Go on. Wave it.

**HELD BEAT — 45f (1.5s) after `a1_29_narrator`.** This one is not a joke, it is
homework. A child needs a second and a half to get a hand up and moving, and if
the next line lands first they will not do it at all. Screen holds on the empty
sky window; nothing animates except the motion arcs.

> **NARRATOR:** Feel that? That little cool push on your cheek? That is air. That is Puff.
> **PUFF:** They can feel me. THEY CAN FEEL ME!

**Pedagogy:** Proof two, and the only moment in the episode where the viewer
personally verifies a claim. That is worth a beat of dead air more than any gag
in the script. It also gives Puff his first win.

---

### Scene 9 — Proof three, the balloon
**On stage:** Narrator, Puff
**Visual:** A yellow balloon inflating in three big pulses. Inside it, visible
only to us, Puff is being squashed into a balloon shape and is thrilled about
it. Cut to the balloon sitting fat and taut on the grass, holding its own
shape, with Puff's outline faintly filling every corner of it.
**Lines:** `a1_32_narrator`, `a1_33_puff`, `a1_34_narrator`, `a1_35_puff`,
`a1_36_narrator`

> **NARRATOR:** One more. Somebody blew up a balloon.
> **PUFF:** Oof. Oof! I am inside a balloon!
> **NARRATOR:** The balloon got fat and round. Something filled it up.
> **PUFF:** It is me. I FILLED it. I have a SHAPE!
> **NARRATOR:** Nothing cannot fill a balloon. Only stuff can fill a balloon.

**Pedagogy:** Proof three, and the strongest one: air takes up *space*. The
closing line is the whole argument of Act One in nine words, and it is phrased
as a logical squeeze rather than an assertion — a child who accepts that a
balloon is full has already accepted that air is a material.

---

### Scene 10 — Big Word One
**On stage:** Narrator, Puff
**Visual:** Hard freeze. **AIR** slams on in big soft cloud-edged capitals, the
letters bouncing in one at a time so the word is spelled rather than revealed
(`WordCard`, house signature, identical treatment to episode one's four). The
starburst stays behind the banner. Puff sits on the crossbar of the A.
**Lines:** `a1_37_narrator`, `a1_38_puff`, `a1_39_narrator`, `a1_40_puff`

> **NARRATOR:** So here is our first big word. Air.
> **PUFF:** A. I. R. That spells AIR!
> **NARRATOR:** You cannot see air. You CAN feel air. Air is real STUFF.
> **PUFF:** You can't see me. But you can FEEL me.

**HELD BEATS — 12f (0.4s) after `a1_37_narrator` and 12f after `a1_38_puff`.**
The house Big Word rhythm from episode one. Short, but they are what make the
card feel like a prompt to join in rather than a slide.

**Pedagogy:** Big Word One, twice plain plus a spelled chant. `a1_40_puff` is
the first firing of Puff's catchphrase, and it is deliberately the *positive*
version of his opening complaint from Scene 3 — same fact, opposite feeling.
**Audition `a1_38_puff` before anything is staged**; if the model reads the
single letters wrong, the pre-written fallback is in `narration.mjs`.

---

### Scene 11 — Not sorry. Sorry.
**On stage:** Narrator, Puff
**Visual:** Puff, noticeably more solid now (call it fifty-five percent), draws
himself up as tall as a puff of air can. Then catches himself. Then catches
himself catching himself.
**Lines:** `a1_41_narrator`, `a1_42_puff`, `a1_43_puff`

> **NARRATOR:** Puff felt taller. Which is tricky, when you are made of air.
> **PUFF:** Sorry! I mean. Not sorry.

**HELD BEAT — 30f (1.0s) after `a1_42_puff`.** Puff holds a confident pose for a
full second, alone on screen, with the audience waiting to see whether it
sticks.

> **PUFF:** Sorry.

**Scene tail: 45f.** The last "Sorry." gets the act's final second to itself.

**Pedagogy:** None — it is the act's button, and it is also the arc's
measuring stick. The apology count from here is Act One nine, Act Two two, Act
Three zero. That drop is the character development, and it is entirely audible.

---

# ACT TWO — THE BIG LIFT

*Warm air rises, Puff leaves a hole, and the hole is the whole answer.*

---

### Scene 12 — Sunny, again
**On stage:** Narrator, Puff, Sunny
**Visual:** The light on the grass goes from cool morning blue to gold in one
sweep. Tilt up. Sunny fills the sky, mid-pose, lens flares he has clearly added
himself. Puff is a speck at the bottom of frame, looking almost straight up.
**Lines:** `a2_01_narrator`, `a2_02_sunny`, `a2_03_puff`, `a2_04_narrator`,
`a2_05_sunny`

> **NARRATOR:** And then the whole hill went gold.
> **SUNNY:** GOOD MORNING, EVERYBODY!
> **PUFF:** Oh no. Oh, he is enormous.
> **NARRATOR:** This is Sunny. You may remember him. He remembers himself constantly.
> **SUNNY:** I invented mornings! You're welcome! HA! HA!

**Pedagogy:** Re-introduces the series' energy source for anyone starting here,
in five lines, without a recap of episode one. "He remembers himself
constantly" is the grown-up's first smirk of the act.

---

### Scene 13 — A rock, having a lovely time
**On stage:** Rock, Puff (Narrator carries the rest of the scene)
**Visual:** Sunbeams come down as thick gold ropes onto the ground. A cartoon
thermometer stuck in the soil climbs. Then a wide, flat, extremely pleased grey
rock, lying in full sun with its eyes shut. It has a face. It does not move a
muscle for the entire scene — not on its line, not after it. Only the heat
shimmer above it moves.
**Lines:** `a2_06_narrator`, `a2_07_narrator`, `a2_08_narrator`,
`a2_09_puff`, `a2_10_narrator`

> **NARRATOR:** Sunny did what Sunny does. He poured sunshine all over the ground.
> **NARRATOR:** The grass got warm. The path got warm. And a rock got extremely comfortable.
> **ROCK:** Ohhh yeah. That is the stuff.

**HELD BEAT — 45f (1.5s) after `a2_08_narrator`.** The rock does nothing. This
is a deadpan-stillness gag of exactly the kind episode one's audience liked
best (the moose), and its entire mechanism is the length of the silence. Rock's
mouth may move on the line; after it, the rock is furniture.

> **PUFF:** Is the rock okay?
> **NARRATOR:** The rock is having the best day of its life.

**Pedagogy:** The ground absorbs the sun's energy and gets *hot* — the step
everyone skips when they say "the sun heats the air". Played as a character
having a nice lie-down, so the fact arrives as a joke and stays as an image.
`a2_07_narrator` runs at 0.95 so its three items separate; `a2_08_narrator` at
0.85, because the rock is in no hurry whatsoever. That line lost its stretched
spelling when the rock was cast — "Ohhh yeah" was a Kokoro instruction and this
engine reads a repeated letter as separate syllables, so it is "Ohh yeah" now
and the length comes from 0.85 and `happy` instead. See Sound-word spellings.

---

### Scene 14 — The ground does the heating
**On stage:** Narrator, Puff
**Visual:** A cross-section diagram in the show's crayon style — sun, arrows
down to the ground, the ground glowing orange, and *then* short wiggly arrows
going up from the ground into the air. The sun's arrows pass straight through
the air layer without lighting it. Puff sits on the warm ground going pink at
the edges.
**Lines:** `a2_11_narrator`, `a2_12_narrator`, `a2_13_puff`, `a2_14_narrator`

> **NARRATOR:** Now here is the important bit. The sun does not warm the air very much.
> **NARRATOR:** The sun warms the GROUND. And then the warm ground warms the air.
> **PUFF:** Ooh. Ooh, that is toasty. I can feel it on my feet.
> **NARRATOR:** Puff does not have feet. Puff was enjoying himself.

**Pedagogy:** The real mechanism, and the one genuinely surprising fact of the
episode for most adults in the room. Sunlight mostly passes through air; the
ground absorbs it and heats the air from below. Everything after this — the
lift, the gap, the sea breeze — depends on it, which is why it gets a diagram
of its own instead of a line inside another scene.

---

### Scene 15 — Up
**On stage:** Narrator, Puff
**Visual:** Puff starts to wobble, then bob, then lift off the grass with the
blades bending down and away beneath him. One continuous rising shot: grass,
fence post, the kid on the hill (tiny, far off, kite still down), birds, and
then a band of thin high cloud he keeps climbing up through. Other warm puffs
rise all around him, dozens of them, all at the same speed.
**Lines:** `a2_15_narrator`, `a2_16_puff`, `a2_17_puff`, `a2_18_narrator`,
`a2_19_puff`, `a2_19b_puff`, `a2_19c_narrator`, `a2_19d_puff`

> **NARRATOR:** And warm air does something wonderful. Warm air gets light.
> **PUFF:** Wait. Wait wait wait. I am going UP!
> **PUFF:** This happened to my friend Drip!
> **NARRATOR:** Different show. Same sun.
> **PUFF:** WHOOSH! I am flying! I am actually flying!

*Then he notices the company.* Puff turns and waves at four of the puffs rising
beside him, one at a time, left to right — the same crowd that has been there
since the lift-off, nobody new arrives. Each one he greets bobs back. His
bubble is **"Hi! Hi! Hi! Hi!"**, a summary and not a transcript.

> **PUFF:** Oh! Hello! Hi Puffy. Hi Puffington. Hi other Puff. Hi Puff the third.

**HELD BEAT — 20f (0.7s) after `a2_19b_puff`.** The greeting lands. He is still
beaming at nobody in particular while the audience works out that all four
answered to the same name.

> **NARRATOR:** Every single one of them was also called Puff.

**HELD BEAT — 24f (0.8s) after `a2_19c_narrator`.** **Nothing enters this.** No
wave, no bubble, no emotion change, no entrance — Puff hangs there doing
absolutely nothing while the shot keeps climbing behind him. Deadpan is
stillness, and the laugh lives in the silence rather than in the read.

> **PUFF:** It is a very popular name.

**Pedagogy:** Warm air is less dense and rises — at six-year-old resolution,
"warm air gets light". The Drip callback is doing real pedagogical work as well
as fan service: it tells a returning viewer that the same sun drives both
episodes, which is exactly the connection the series is built on. "Different
show. Same sun." runs at 0.92 and needs to be the flattest reading in the
episode.

The roll call earns its twelve and a half seconds twice over: it is the
episode's biggest laugh, and it is also `a2_22_narrator`'s point made as a
picture two scenes early — *this is happening to all the warm air at once, not
to one special puff*. A child who has just met four other Puffs cannot think
the lift is about the hero. The roll call runs at 0.92 so the four names
separate (Comedy pacing), and the button is deliberately unseasoned: Puff
reports it as a mild fact about naming trends, which is the joke.

---

### Scene 16 — The rule
**On stage:** Narrator, Puff
**Visual:** *Not* a `WordCard`. A rule stamp: a wide banner with a big fat
upward arrow behind it, thumping onto the frame like a passport stamp and
staying there while the shot keeps rising behind it. **WARM AIR RISES**. The
arrow animates upward on a loop. Puff rides the arrow.
**Lines:** `a2_20_narrator`, `a2_21_puff`, `a2_22_narrator`

> **NARRATOR:** Warm air rises. Say it with me. Warm air rises.
> **PUFF:** Warm air RISES! And I am the warm air!
> **NARRATOR:** Every warm puff on that whole hill was going up with him.

**Pedagogy:** The episode's central rule, said twice inside one line so the
"say it with me" has something to sit between, then chanted back. The
deliberately different card treatment is explained in Production notes. The
closing line matters more than it looks: this is happening to *all* the warm
air at once, not to one special puff — the same correction episode one made
with its whip-pan of puddles.

---

### Scene 17 — The Big Empty
**On stage:** Narrator, Puff
**Visual:** Cut from the rising shot straight back down to the grass. The
patch Puff left is drawn as a genuine hole in the world — a Puff-shaped
absence, outlined, slightly darker, with the grass leaning in around its edges.
Hold on it. It is the most important image in the episode and it is a picture
of nothing.
**Lines:** `a2_23_narrator`, `a2_24_narrator`, `a2_25_puff`, `a2_26_narrator`

> **NARRATOR:** But look down at the grass. Look where Puff used to be.

**HELD BEAT — 45f (1.5s) after `a2_23_narrator`.** The gap alone on screen,
silent. A six-year-old needs time to see an emptiness; it has no edges to catch
the eye and no motion to follow. If this beat is cut, the next three scenes
explain a thing the audience never actually looked at.

> **NARRATOR:** Puff left a gap. An empty space, exactly Puff shaped.
> **PUFF:** Oops. Sorry about the hole.
> **NARRATOR:** And air does not like a gap. Not one bit.

**Pedagogy:** The hinge of the whole episode. Wind is not "air deciding to
blow" — it is air moving in to fill a space that something else left. Giving
the gap a shape, a colour and a second and a half of screen time is the
difference between a child repeating "wind is moving air" and a child knowing
*why* it moves. Note Puff's apology here is the second-to-last of the episode,
and it is about a hole he made by existing, which is very much his whole
problem.

---

### Scene 18 — FWOOSH
**On stage:** Narrator, Puff
**Visual:** From both sides of frame, cool blue-tinted puffs pour in *sideways*
along the ground and slam into the gap, filling it. Grass flattens in a wave as
they arrive. Direction is everything here: they travel horizontally, they do
not fall in from above.
**Lines:** `a2_27_narrator`, `a2_28_narrator`, `a2_29_puff`, `a2_30_narrator`

> **NARRATOR:** So all the cool air nearby came rushing in sideways to fill it.
> **NARRATOR:** FWOOSH.

**HELD BEAT — 36f (1.2s) after `a2_28_narrator`.** The rush happens under the
silence — grass flattening, seeds and one leaf tumbling past, no voice. This is
the first time in the episode the audience sees wind and it should arrive as a
physical event, not as an illustration of a sentence.

> **PUFF:** Whoa! Who are all these guys?
> **NARRATOR:** Cool air. In a very big hurry.

**Pedagogy:** The sideways-ness is the point. Warm air going up is only half a
wind; the half you feel on your face is the cool air coming in at ground level
to replace it. Staging it horizontally is not a style choice.

---

### Scene 19 — Big Word Two
**On stage:** Narrator, Puff
**Visual:** Hard freeze on the rushing air. **WIND** slams on, letters bouncing
in one at a time, with speed-lines streaming off the trailing D. `WordCard`,
house signature.
**Lines:** `a2_31_narrator`, `a2_32_puff`, `a2_33_narrator`, `a2_34_puff`

> **NARRATOR:** And that rushing, hurrying, sideways air has a name. Wind.
> **PUFF:** W. I. N. D. WIND!
> **NARRATOR:** Wind is air in a hurry. Say it with us.
> **PUFF:** Wind is air in a HURRY!

**HELD BEATS — 12f (0.4s) after `a2_31_narrator` and 12f after `a2_32_puff`.**
House Big Word rhythm.

**Pedagogy:** The episode's `EVAPORATION`-equivalent, and the definition the
whole show is built to make chantable: **wind is air in a hurry**. Twice plain
(`a2_31`, `a2_33`), spelled once, chanted once. **Audition `a2_32_puff` first**;
fallback spelling is pre-written in `narration.mjs`.

---

### Scene 20 — Am I the wind?
**On stage:** Narrator, Puff
**Visual:** Puff hangs in mid-air, thinking, while the sky behind him fills with
hundreds of other puffs all doing the same rise-and-rush in a slow visible
circuit. Pull back until Puff is one dot in a pattern that covers the whole
hillside.
**Lines:** `a2_35_puff`, `a2_36_narrator`, `a2_37_puff`, `a2_38_narrator`

> **PUFF:** Hold on. Am I the wind?
> **NARRATOR:** You are air. Wind is what air DOES.
> **PUFF:** So when I move, everybody gets wind. Because of me.
> **NARRATOR:** Because of you. And about a hundred million friends.

**Pedagogy:** Corrects a misconception the story itself could easily have
created — wind is not a substance, it is a behaviour of one. "Wind is what air
does" is the most precise sentence in the script and it is six words long. The
last line keeps the scale honest without deflating the hero.

---

### Scene 21 — Sunny, insufferably, correct
**On stage:** Narrator, Puff, Sunny
**Visual:** Sunny slides into frame at maximum brightness. Behind him a
diagram assembles itself from his beams as he lists the chain — sun to ground,
ground to air, air upward, cool air sideways — until the whole circuit is
turning, visibly driven from his side of the frame. On the last brag the
diagram goes planetary and every wind arrow on Earth lights up at once.
**Lines:** `a2_39_sunny`, `a2_40_puff`, `a2_41_sunny`, `a2_42_sunny`,
`a2_43_sunny`, `a2_44_narrator`, `a2_45_narrator`

> **SUNNY:** EXCUSE ME. Who warmed the ground?
> **PUFF:** Um. You did.
> **SUNNY:** I warm the ground! The ground warms the air! The air goes UP!
> **SUNNY:** SO I MAKE ALL THE WIND. EVERYWHERE. ON THE ENTIRE PLANET.
> **SUNNY:** You're welcome! HA! HA!
> **NARRATOR:** I checked. Then I checked again. He is right. Again.

**HELD BEAT — 45f (1.5s) after `a2_44_narrator`.** Sunny, alone in frame,
holding an enormous smug grin and not saying anything. The grown-up laugh goes
here. **Emotion lead cut to 0** — Sunny must not start grinning before the
Narrator finishes conceding.

> **NARRATOR:** One day Sunny will be wrong about something. It is not today.

**Pedagogy:** The causal chain, said in one breath by the character who is the
first link — sun, ground, air, up. `a2_41_sunny` runs at 0.95 so all three links
land separately, and — since Sunny is a MiniMax voice — carries the episode's
only two pause markers, `<#0.3#>` between the links, for the same reason. That
is intra-line timing the script asked for; every other silence in this episode
is a held beat between lines and lives in `Video.tsx`. This is episode one's "annoyingly, he is completely right"
grown up: it concedes twice, deadpans the concession, and then plants the
series' next joke, because `a2_45` is a promise the recap pays off and episode
three collects.

---

### Scene 22 — Not sorry
**On stage:** Puff
**Visual:** Puff alone against open sky, at seventy percent opacity — the most
solid he has been. He starts the apology automatically, as reflex, and then
physically stops himself: the shape of him firms up mid-line.
**Lines:** `a2_46_puff`, `a2_47_puff`, `a2_48_puff`

> **PUFF:** Sorry, everybody! I did not mean to.

**HELD BEAT — 30f (1.0s) after `a2_46_puff`.** Puff hangs there, hearing himself
do it. Nothing else on screen. The turn is in the silence, not in the next
line.

> **PUFF:** No. Wait. Not sorry.
> **PUFF:** I move flowers. I fill balloons. I am STUFF.

**Pedagogy:** The arc's turning point, timed to sit exactly between the
mechanism (Acts One and Two) and the consequences (Act Three). He has one more
apology in him and never uses it. The closing line is a two-item recap of Act
One disguised as a boast.

---

# ACT THREE — AIR WITH A JOB

*The beach makes its own wind, and then Puff goes to work.*

---

### Scene 23 — The beach
**On stage:** Narrator, Puff
**Visual:** Wipe to a wide beach — pale sand, blue-green sea, a few gulls
hanging motionless. Puff arrives from frame left at speed and skids to a stop,
scattering a little sand. First time we have seen him travel any distance under
his own power. Far out on the sea horizon, frame left, a small island volcano
is fast asleep — Puff gives it one four-frame glance as he settles and then
forgets about it. Nobody says a word.
**Lines:** `a3_01_narrator`, `a3_02_puff`, `a3_03_narrator`, `a3_04_puff`

> **NARRATOR:** Puff wanted to know what else a wind could do. So we went to the beach.
> **PUFF:** The beach! I have never been ANYWHERE!
> **NARRATOR:** And the beach has a secret. The beach makes its own wind. Every sunny day.
> **PUFF:** The beach MAKES wind? By itself?

**Pedagogy:** Frames the sea breeze as a mystery with a promise attached
("every sunny day") — a claim the child can check next time they are at a
beach, which is the best kind of fact this show can hand out.

---

### Scene 24 — Hot sand, cool sea
**On stage:** Narrator, Puff
**Visual:** Two matched shots, cut side by side. Puff sits on the sand and
turns tomato red, hopping. Puff sits on the sea and goes cool blue, sighing.
Then a split screen with a thermometer in each half — sand's climbing fast,
sea's barely moving — and the same sun over both. The sleeping volcano is out
on the horizon of the sea shot, same spot and same size as Scene 23, still
asleep, still unmentioned.
**Lines:** `a3_05_narrator`, `a3_06_puff`, `a3_07_narrator`, `a3_08_puff`,
`a3_09_narrator`, `a3_10_narrator`

> **NARRATOR:** Puff. Go and sit on the sand, and tell me how it feels.
> **PUFF:** Ow. Ow ow ow. That sand is HOT.
> **NARRATOR:** Now go and sit on the sea.
> **PUFF:** Ooh. The sea is lovely and cool.
> **NARRATOR:** Same sun. Same morning. Sand hot. Sea cool.

**HELD BEAT — 24f (0.8s) after `a3_09_narrator`.** Both thermometers on screen,
nobody talking. The comparison is the fact; let it be looked at.

> **NARRATOR:** Sand heats up fast. Water takes ages and ages and ages.

**Pedagogy:** Differential heating, which is the only genuinely new physics in
Act Three. Every child who has ever burnt their feet running to the water has
already collected this data — the scene just tells them what it was for.
`a3_09_narrator` runs at 0.9, the slowest narrator line outside the recap,
because four two-word clauses at speed are a blur.

---

### Scene 25 — The beach makes its own wind
**On stage:** Narrator, Puff
**Visual:** The Act Two gap diagram, rebuilt on the beach and colour-matched to
it: warm orange air rising off the sand, a familiar outlined gap opening
underneath, and then cool blue air sweeping in off the sea to fill it. Puff
recognises the shape of the diagram before the Narrator finishes, and points.
**Lines:** `a3_11_narrator`, `a3_12_puff`, `a3_13_narrator`, `a3_14_puff`,
`a3_15_narrator`

> **NARRATOR:** So the air above the hot sand gets warm, and up it goes.
> **PUFF:** And that leaves a GAP! I know this bit!
> **NARRATOR:** It does. And the cool air over the sea comes rushing in to fill it.
> **PUFF:** FWOOSH! Off the sea! Onto the beach!
> **NARRATOR:** That is why the wind at the beach blows in off the water, nearly every sunny day.

**Pedagogy:** The same mechanism, second instance, in a new setting — which is
how a rule stops being a story about one puff and becomes a thing that
explains places. Puff getting there first is the show checking the audience's
comprehension out loud without ever asking a test question.

---

### Scene 26 — Big Word Three
**On stage:** Narrator, Puff, Sunny
**Visual:** Freeze on the incoming wind. **SEA BREEZE** slams on in wave-edged
capitals, letters bouncing in one at a time. Then Sunny leans in from the top
corner of frame, uninvited, over the card.
**Lines:** `a3_16_narrator`, `a3_17_narrator`, `a3_18_puff`, `a3_19_sunny`,
`a3_20_narrator`

> **NARRATOR:** A gentle, friendly wind has a lovely name. A breeze.
> **NARRATOR:** And a breeze that comes in off the sea is a sea breeze.
> **PUFF:** Sea breeze! Sea BREEZE! That is me! I am a sea breeze!
> **SUNNY:** I make the beach windy AND I make the waves sparkle! You're welcome!

**HELD BEAT — 30f (1.0s) after `a3_19_sunny`.** Sunny holding the pose,
enormously pleased, over a card that is not about him.

> **NARRATOR:** Him again.

**Scene tail: 40f.** Two flat words need somewhere to land.

**Pedagogy:** Big Word Three, plus the useful smaller word *breeze* handed over
first so "sea breeze" is built from parts rather than memorised whole. Sunny's
interruption is the running gag's fourth firing and is, once again, true.

---

### Scene 27 — The sailboat
**On stage:** Narrator, Puff
**Visual:** A little boat sits dead flat on a glassy bay with its sail hanging
slack — visually rhyming the flopped kite from the cold open, which is the
point. Puff braces both arms. The sail snaps taut with a *whump*, heels over,
and the boat goes carving off across the water throwing spray.
**Lines:** `a3_21_narrator`, `a3_22_puff`, `a3_23_narrator`, `a3_24_puff`,
`a3_25_narrator`, `a3_26_puff`

> **NARRATOR:** And then Puff found out what a wind can do for a living.
> **PUFF:** There is a boat. Should I push the boat?
> **NARRATOR:** Push the boat, Puff.
> **PUFF:** Okay, boat. PUSH!
> **NARRATOR:** The sail went tight, and the boat went whizzing across the bay.
> **PUFF:** I am a BOAT ENGINE!

**Pedagogy:** First job. A sail is the most legible machine humans have ever
built for catching air, and the slack-to-taut moment shows a child that the
invisible thing has *force*, not just presence. The visual rhyme with the kite
is also a quiet promise that the cold open is coming back.

---

### Scene 28 — The turbines
**On stage:** Narrator, Puff
**Visual:** Three white turbines on a headland, still. Puff shoves the first
blade; all three start turning. Follow a glowing pulse down the tower, along a
cable, under a field, up into a house — and a night light clicks on in a
child's bedroom. Land on that shot.
**Lines:** `a3_27_narrator`, `a3_28_narrator`, `a3_29_puff`, `a3_30_narrator`,
`a3_31_puff`

> **NARRATOR:** Next, three tall white towers, with long thin spinning arms.
> **NARRATOR:** Spin them, Puff. When those arms spin, they make electricity.
> **PUFF:** Electricity? Like for LIGHTBULBS?
> **NARRATOR:** Like for lightbulbs. And fridges. And somebody's night light.

**HELD BEAT — 36f (1.2s) after `a3_30_narrator`.** Hold on the night light in
the dark bedroom, silent, while the audience gets there on their own. Then the
shout.

> **PUFF:** I MAKE LIGHTBULBS!

**Pedagogy:** Second job, and the one that connects the sky to the child's own
bedroom — the same bridge episode one built with the bathtub. `a3_30_narrator`
runs at 0.92 so the three items separate and the night light lands last.

---

### Scene 29 — The seeds
**On stage:** Narrator, Puff
**Visual:** Puff sweeps across open country carrying a slow blizzard of seeds —
dandelion clocks, sycamore helicopters, thistledown. He recognises a dandelion
seed and goes cross-eyed looking at it. Then a long slow push across a whole
hillside gone yellow with dandelions, all of them descended from Scene 7.
**Lines:** `a3_32_narrator`, `a3_33_puff`, `a3_34_narrator`, `a3_35_puff`,
`a3_36_narrator`

> **NARRATOR:** Then Puff carried seeds. Thousands of them, across the fields.
> **PUFF:** Hey! I know these ones! These are the dandelion ones!
> **NARRATOR:** Seeds cannot walk. So the wind takes them somewhere new to grow.
> **PUFF:** So there are flowers. In places. Because of me.
> **NARRATOR:** Yes, Puff. There are.

**HELD BEAT — 60f (2.0s) after `a3_36_narrator`.** The longest silence in the
episode so far, on the hillside of dandelions moving gently. Nobody speaks;
Puff is not even in frame. This is the emotional beat the ending is banked
against, and it is worth two full seconds of a ten-minute show.

**Pedagogy:** Third job, and the callback lands the Act One proof as a
*consequence* five minutes later. It also quietly teaches seed dispersal, which
is not this episode's topic and is free.

---

### Scene 30 — Door to door
**On stage:** Narrator, Puff, Cloudia, Drip
**Visual:** Up into the sky. Cloudia — grand, enormous, faintly grey underneath
— sits stranded over a flat plain with her awning and her brass bell. Puff gets
behind her and pushes; she glides off across the sky with her hat streaming.
Mountains slide into frame beneath her. Drip pops out of a window halfway
across and waves with both arms.
**Lines:** `a3_37_narrator`, `a3_38_cloudia`, `a3_39_narrator`,
`a3_40_cloudia`, `a3_41_drip`, `a3_42_narrator`

> **NARRATOR:** And then, high above them, somebody needed a lift.
> **CLOUDIA:** Puff, darling! Take me to the mountains! I am FULL of rain!
> **NARRATOR:** So Puff pushed a whole cloud, all the way across the sky.
> **CLOUDIA:** Finally! Door to door service, darling!
> **DRIP:** Hi! It's me! I'm the weather!
> **NARRATOR:** That is Drip. Different show. Same sky.

**Pedagogy:** Fourth job, and the biggest one — wind is what moves weather
around the planet. For a returning viewer it also closes a loop episode one
left open: clouds did not drift over the mountains by themselves. "Different
show. Same sky." is the deliberate rhyme with `a2_18_narrator`; both run at
0.92.

---

### Scene 31 — The hill
**On stage:** Narrator, Puff
**Visual:** Puff crests a hill and the cold open's exact framing returns — same
angle, same kid in silhouette, same red kite lying flat in the grass. Nothing
has moved. Puff stops dead. On "Go on then", he swells up bigger than he has
been all episode, the grass bowing away from him in a widening ring.
**Lines:** `a3_43_narrator`, `a3_44_narrator`, `a3_45_puff`, `a3_46_narrator`,
`a3_47_puff`, `a3_48_narrator`, `a3_49_puff`

> **NARRATOR:** Then Puff came over a hill he had never seen before.
> **NARRATOR:** There was a kid. And a brand new kite. Lying flat on the grass.
> **PUFF:** Oh. Oh, that kite is not flying at all.
> **NARRATOR:** No. It is not. Do you know what that kite is missing, Puff?

**HELD BEAT — 45f (1.5s) after `a3_46_narrator`.** Puff looks at the kite. The
audience is a full beat ahead of him and gets to sit in it.

> **PUFF:** Me. That kite is missing ME.
> **NARRATOR:** Go on then.

**HELD BEAT — 45f (1.5s) after `a3_48_narrator`.** Puff draws in the biggest
breath of his life. Grass bends. Nobody speaks.

> **PUFF:** PUSH!

**HELD BEAT — 75f (2.5s) after `a3_49_puff`.** **The longest silence in the
episode, and the payoff of the whole thing.** The kite snaps off the grass, the
line goes tight, and it climbs — and it climbs in silence, with only the sound
of the wind and the line thrumming. The kid's silhouette leans back, both arms
up. No narration, no music sting, no dialogue. If any line lands inside these
seventy-five frames, the episode does not have an ending.

**Pedagogy:** The frame story closes on the child's own terms: a thing they
watched fail in the first thirty seconds now works, and they know exactly why.
The kid never speaks in this episode. The kite is the entire emotional
readout, and it is legible from across a room.

---

### Scene 32 — Look what they CAN see
**On stage:** Beetle, Puff (Narrator carries the rest of the scene)
**Visual:** Wide on the hill — kid, kite high in the blue, and Puff at full
opacity for the first time, sitting on the grass at the edge of frame looking
up. A beetle wanders into the bottom of the shot. **Same beetle staging as
Scene 4**, same size in frame, same everything.
**Lines:** `a3_50_narrator`, `a3_51_narrator`, `a3_52_puff`, `a3_53_narrator`,
`a3_54_puff`

> **NARRATOR:** Up it went. Higher than the fence. Higher than the trees. Higher than the birds.
> **BEETLE:** Hello? Is somebody there?

**HELD BEAT — 45f (1.5s) after `a3_51_narrator`.** Third and final firing of the
repetition gag, word for word and speed for speed identical to Scenes 4 and 5 —
and this time the audience knows the answer before Puff does. Hold on Puff, who
takes his time.

> **PUFF:** Yes. Yes, there is.

**HELD BEAT — 45f (1.5s) after `a3_52_puff`.** Let it sit. This is the line the
whole character was built to say.

> **NARRATOR:** Nobody on that hill could see Puff. Nobody ever will.
> **PUFF:** They still can't see me. But look what they CAN see.

**Pedagogy:** The arc's thesis, and the honest version of it — nothing has
changed about Puff's visibility and the story does not pretend otherwise. What
changed is what he knows he can do. That is a better ending for an invisible
hero than being seen, and it is the one a six-year-old who feels small can
actually use.

---

# RECAP

*Roughly seventy seconds. Chant, mind-blower, tease.*

---

### Scene 33 — The chant
**On stage:** Narrator, Puff, Sunny, Cloudia
**Visual:** Four-way split screen, one character per panel, each panel lighting
up as it takes its word, exactly as episode one did it. The word slams in over
each panel in that act's colour — grass green, gold, sky blue, sea green.
**Lines:** `rc_01_narrator`, `rc_02_puff`, `rc_03_sunny`, `rc_04_cloudia`,
`rc_05_narrator`

> **NARRATOR:** Let's say the big words together. Ready?
> **PUFF:** AIR! You cannot see it, you CAN feel it, and it is real stuff! That is me!
> **SUNNY:** WARM AIR RISES! Because I warm the ground! That is also me!
> **CLOUDIA:** WIND! Air in a hurry! It delivers me door to door, darling!
> **NARRATOR:** SEA BREEZE. Hot sand, cool sea, and a wind off the water every sunny day.

**Pedagogy:** Final pass on all four Big Words, each re-attached to the
character who embodied it — the same retrieval trick as episode one, and the
reason the Narrator takes the fourth word both times.

---

### Scene 34 — All four, and everywhere
**On stage:** Narrator
**Visual:** The panels collapse into one card with all four words stacked, then
the card sits over a slow turning globe with wind arrows sweeping across every
ocean and continent. Hold long enough for a parent to photograph it. Then a
night-time window with a curtain moving.
**Lines:** `rc_06_narrator`, `rc_07_narrator`

> **NARRATOR:** Air. Warm air rises. Wind. Sea breeze.
> **NARRATOR:** And wind is happening right now. Outside your window. All night. Everywhere.

**Pedagogy:** The single summary image of the episode, plus the claim that makes
it portable — this is not a thing that happened to Puff, it is a thing
happening outside the room the child is sitting in. `rc_06_narrator` runs at
0.88, the slowest line in the script; it is four whole ideas in seven words.

---

### Scene 35 — The mind-blower
**On stage:** Narrator, Puff
**Visual:** A satellite-style view: a vast pale plume of dust lifting off the
Sahara, streaming west across the Atlantic over several days of time-lapse, and
settling as a fine golden haze over the Amazon. Finish on one green leaf with a
few grains of desert sand on it.
**Lines:** `rc_08_narrator`, `rc_09_narrator`, `rc_10_narrator`, `rc_11_puff`,
`rc_12_narrator`

> **NARRATOR:** Now here is the amazing part.
> **NARRATOR:** Right this minute, the wind is picking up sand from a desert called the Sahara.
> **NARRATOR:** It carries that sand all the way across an ocean, and sprinkles it on a rainforest.
> **PUFF:** Sand. Across a whole OCEAN. In the sky.
> **NARRATOR:** And the trees grow better because of it. That is the wind, doing a job.

**Pedagogy:** The fact the child repeats at dinner, and it is true and
checkable: Saharan dust crosses the Atlantic every year in enormous quantities
and fertilises the Amazon basin, carrying the phosphorus its soils lack. It
only works as a payoff because Act Three spent four scenes establishing that
carrying things is what wind *does for a living*.

---

### Scene 36 — Tease and sign-off
**On stage:** Narrator, Sunny, Puff
**Visual:** The sky above the kite deepens to its most saturated blue and fills
the frame. Sunny is already posing for the next episode's poster. Then the
title card for episode three, and Puff waving from the corner — visible to us,
invisible to everyone in the picture.
**Lines:** `rc_13_narrator`, `rc_14_sunny`, `rc_15_narrator`, `rc_16_sunny`,
`rc_17_puff`

> **NARRATOR:** Next time. Why is the sky BLUE?
> **SUNNY:** OH, that one is me as well! HA! HA!
> **NARRATOR:** Sunny has a theory. It is wrong.

**HELD BEAT — 45f (1.5s) after `rc_15_narrator`.** Sunny holds his pose while
the sentence catches up with him. **Emotion lead cut to 0**: his face must not
fall until the beat is nearly over, or the reaction pre-empts the joke.

> **SUNNY:** Wait. What?

**HELD BEAT — 30f (1.0s) after `rc_16_sunny`.**

> **PUFF:** Bye! You can't see me. But you can FEEL me.

**Pedagogy:** Series continuity, and the evolution of the show's oldest running
gag. Sunny has been right about everything in two episodes; episode three is
built on him finally not being, and `a2_45_narrator` planted that four minutes
earlier so the tease reads as a promise being kept rather than a swerve.

---

## Production notes

**Tone guardrails.** Unchanged from episode one. No sarcasm a six-year-old
cannot parse — the Narrator's deadpans are always *about* obvious behaviour
(Sunny bragging, a rock sunbathing), never an ironic reversal. No scary peril:
Puff's lift-off is played as delight from the first frame and there is no storm
anywhere in this episode. No potty humour. Nobody is unkind to Puff — the
beetle and the leaf genuinely cannot perceive him, which is sadder and funnier
than rudeness and keeps the show's world friendly.

**Line length.** Almost every line sits between five and fifteen words, and
nothing exceeds twenty. Longest lines are `a3_15_narrator` and `rc_10_narrator`
at sixteen words, both explanatory, both allowed to breathe.

**Comedy pacing is designed in, not added later.** Episode one's audience test
found the two best-loved jokes were deadpan repetition gags that "moved past
rather quickly". This script answers that in two places at once, and both are
already written down:

- **Slower per-line speeds** for every list, roll call and repeated
  straight-line, set in `narration.mjs` with a comment on each. Forty-two lines
  carry an override, the newest two being Scene 15's roll call. The deadpan floor is `a2_08_narrator` (the rock) at 0.85;
  the slowest narration is `rc_06_narrator` at 0.88.
- **Held beats of silence**, twenty-four of them, each written above with its
  exact frame count and its reason. They become `gaps` in `Video.tsx`. The
  three longest are the kite soaring (75f), the dandelion hillside (60f) and
  the cold open flop (60f) — the episode's payoff, its heart and its hook.
- **No emotion lead on held-beat scenes.** The staging kit's default eight-frame
  `useEmotion` lead will leak a punchline into the silence before it. Scenes 4,
  5, 21 and 36 say so explicitly; treat it as the rule for every held beat.

**Running gags, and where they fire.**
- *"Sorry."* — `a1_04`, `a1_10`, `a1_16`, `a1_20`, `a1_42`, `a1_43`, `a2_25`,
  `a2_46`. Nine apologies in Act One, two in Act Two, none in Act Three. The
  gag is the count going to zero, and it is the arc.
- *"You can't see me. But you can FEEL me."* — `a1_40`, `a3_54` (in its grown-up
  form), `rc_17`. Three firings, one per act after it is earned.
- *"Hello? Is somebody there?" / "Huh. Must have been nothing."* — `a1_07`+`a1_09`,
  `a1_13`+`a1_15`, `a3_51`. Identical text, identical 0.92 speed, identical
  staging all three times. The third has no partner line, because Puff answers
  it. **Do not vary these.** `a3_51` is not even a re-recording of `a1_07`: it
  is the same clip, shared through the generator's `sameAs`. Kokoro gave that
  away for free (same text, same voice, byte-identical file); MiniMax returned
  the sentence 2.20s the first time and 2.84s the second, which is a thirty
  percent difference in the one line whose whole job is to sound exactly like it
  did five minutes earlier.
- *The roll call* — `a2_19b`+`a2_19c`+`a2_19d`, Scene 15. The series signature
  now, not a one-off: episode one had Drip greeting a queue of identical
  raindrops ("Hi Drop, Hi Droppy") and it was the six-year-old's favourite joke
  in the show, so episode two greets four identical Puffs. The shape is fixed —
  a character cheerfully naming near-identical strangers, a flat one-line
  explanation from the Narrator, and an unbothered button from the character.
  Episode three should have one.
- *"You're welcome!" / "HA! HA!"* — `a2_05`, `a2_43`, `a3_19`, `rc_03`, `rc_14`.
- *"That one is me as well!"* — `rc_14`, paid off across the whole episode and
  finally broken in the last twelve seconds.
- *"Different show. Same sun." / "Same sky."* — `a2_18`, `a3_42`.
- **Sunny is always right.** `a2_41`, `a2_42`, `a2_44` ("I checked. Then I
  checked again."), `a2_45`, `a3_19`. Episode three's premise is planted in
  `a2_45`.
- *The volcano is asleep.* Scenes 23 and 24, on the sea horizon, snoring smoke
  rings on a three-second loop. **Nobody mentions it** — no line, no bubble, no
  narration, and the only acknowledgement in the episode is one four-frame flick
  of Puff's eyes in Scene 23. This is a series gag with no punchline yet: it is
  meant to be asleep in the background of every coastal scene the show ever
  stages, and to wake up in a later episode. The rule for anyone staging a beach
  from here on is that it is scenery until it isn't — put it on the horizon,
  never let a character talk to it.

**Big Word cards, and a deliberate deviation.** STYLE.md allows at most one
`WordCard` a minute. This episode teaches four things but only three of them
are vocabulary: **WARM AIR RISES** is a rule, not a word, and gets a different
treatment — an arrow-stamp banner in Scene 16 — rather than the letter-bouncing
`WordCard`. That keeps the `WordCard` signature meaning "learn this word" and
spaces the three real cards roughly three minutes apart (Scenes 10, 19, 26). If
the orchestrator would rather have four identical cards, Scene 16 is the one to
change and nothing else moves.

**Puff's opacity is the arc.** Forty percent in Act One (twenty-five at his
lowest, Scene 6), fifty-five after the AIR card, seventy in Scene 22, full
opacity from Scene 32. Never commented on in dialogue. This is the one piece of
staging the script insists on, because it is the character development rendered
in the medium the character is made of.

**Sound-word spellings** are locked to the exact strings in `narration.mjs` —
WHOOSH, FWOOSH, Poof, PUSH, Flop, Oof, Ohh. Do not "correct" them; they are
shaped for the text-to-speech model, not for a copy editor. **And the shaping
is per engine.** A stretched vowel is a kokoro instruction: it reads "Ohhh" as
one long sound, and MiniMax reads it as separated syllables. Every stretch in
this episode has now lost that argument, because everything with a body is on
MiniMax: Puff's two went when he was cast (`a1_25_puff` "Poooof!" → "Poof!",
`a3_49_puff` "PUUUSH!" → "PUSH!" with `emotion: "angry"`, which is where the
length went), and the rock's went when it was (`a2_08_narrator` "Ohhh yeah" →
"Ohh yeah" at 0.85 and `happy`). WHOOSH and FWOOSH are single-letter runs and
survive both engines. **Casting a character is a text edit as well as a voice
edit** — sweep its sound words before assuming the clip is the same clip.

The *drawn* words keep their stretch: the speech bubbles in
`scenes/act1.tsx` and `scenes/act3.tsx` still read "Poooof!" and "PUUUSH!",
because on screen the extra letters are a picture of a long loud noise and a
pre-reader gets that instantly. Spelling for the ear and spelling for the eye
are now two different jobs; this is the only place they disagree.

**Ear-check list.** ~~Audition~~ done — every voice is cast and every clip is
generated. What is left is listening, in this order:
1. ~~Puff's voice itself~~ — cast, `Exuberant_Girl`. The remaining check is the
   whole episode with him in it, which is a watch, not an audition.
2. **The three cameos, all unheard** (`Patient_Man` beetle, `Calm_Woman` leaf,
   `Deep_Voice_Man` rock). Cast on description, not by ear, which is a rule
   broken knowingly. Listen for three things: that the beetle and the leaf are
   audibly *different people* (that is the entire reason they were recast), that
   neither is unkind — they cannot perceive Puff, they are not ignoring him —
   and that the rock at 0.85 reads as relaxed rather than as a fault. Any of
   them can be re-cast for the price of one line.
3. `a2_08_narrator` — the rock's respelled "Ohh yeah". If the engine still
   separates the two h's, the fully safe fallback is written into
   `narration.mjs`: "Oh yeah. That is the stuff."
4. `a1_38_puff` ("A. I. R.") and `a2_32_puff` ("W. I. N. D.") — the spelled Big
   Words, and **the highest risk in the episode**: they moved to MiniMax with
   the rest of Puff and nobody has heard single letters on this engine.
   Phonetic fallbacks are pre-written in `narration.mjs`.
5. `a3_49_puff` ("PUSH!" at `angry`) and `a1_25_puff` ("Poof!") — respelled for
   the engine, so what was verified in the audition was the *word*, not this
   exact clip. `a2_28_narrator` ("FWOOSH." alone in a clip) is unchanged.
6. The roll call as a run — `a2_19b_puff` (four names at 0.92; do they
   separate?), then `a2_19c_narrator` flat, then `a2_19d_puff` unseasoned. If
   the button sounds like it is being sold, it is wrong; it is a mild fact.
7. Puff's six `sad` lines as a run (`a1_04`, `a1_10`, `a1_16`, `a1_17`, `a1_18`,
   `a1_20`) — six in one act is the most concentrated seasoning in the file, and
   the failure mode is a hero who sounds miserable rather than small.
8. `a3_19_sunny`, the longest exclamation run in the script.
