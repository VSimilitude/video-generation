# Pip and the Sunshine Kitchen

**Series:** Little Big World (kids' educational), episode four
**Topic:** photosynthesis — plants make their own food out of light, water and air
**Audience:** six-year-olds — and the grown-up in the room
**Target:** the beats, not a number (runtime rule). Expect roughly fifteen to
seventeen minutes — between episodes two and three.
**Shape:** cold open, three acts, recap. Twenty-nine scenes, two hundred and
thirty-eight spoken lines (two hundred and twenty-two recordings; sixteen
`sameAs` aliases).

> **Ruling of record.** This script is the synthesis (`ep4-synthesis.md`)
> executed: Treatment B's spine with Treatment A's devices grafted on. Where
> this file and any treatment disagree, the synthesis already ruled and this
> file follows it. Title per the synthesis. Hero name Pip, per the synthesis.

The companion file `narration.mjs` holds the exact text sent to the
text-to-speech model. Every line below quotes it verbatim; if you change a
line, change it in both files.

## Cast and voices

| Character | Engine | Voice | Speed | Who they are |
|---|---|---|---|---|
| **Narrator** | kokoro | `af_heart` | 1.0 | Warm storyteller, returning. Deadpans at Sunny for a living; owns the flat middle line of every roll call and "Different show. Same ___." Voice only — no body, ever. |
| **Pip** | minimax | **`Inspirational_girl`** (`PIP_MINIMAX_VOICE`; showrunner cast 2026-08-08 by 3-voice audition, Mike's ear pending — decision-log TOP item) | 1.0 | Our hero. A dandelion seed who will never take a single step and intends to build the biggest thing in the world anyway. **Register target for the audition (synthesis, verbatim): clipped, brisk, small-but-certain, DRY not loud, warm underneath — "a six-year-old CEO."** Hardest audition lines: `a1_09_pip` (a shouted work-order at the sky), `co_17_pip` (the flat two-word stamp — it is the chain source, so it must be right before anything else is built), `a3_52_pip`/`a3_53_pip` (the admission — warm, never defeated). Zero seasoned lines by design: her register IS the casting. |
| **Sunny** | kokoro | `am_puck` | 1.0 | The Sun, returning, at MAXIMUM. This is his peak episode: every claim he makes is fully, checkably true, and he is unbearable about it. Kokoro means **no `emotion` field ever, no pause markers ever, no stretched vowels** — his stops are words, slower `speed`, and his face. Series voice since episode one. |
| **Ray** | minimax | `Young_Knight` | 1.0 | Returning (ep-3 hero). The pedant. This episode every correction he files lands in Sunny's favor, which he finds structurally upsetting. New tic (synthesis-approved, logged for Mike): *"That is also true."* F2 body, no arms at rest; all his gestures are the ribbon. |
| **Drip** | minimax | `Lively_Girl` | 1.0 | Returning (ep-1 hero), ingredient WATER. `emotion: "happy"` on every line — that is her locked casting, not seasoning. Wants to be taken as big; gets logged as "one water". |
| **Puff** | minimax | `Exuberant_Girl` | 1.0 | Returning (ep-2 hero), ingredient AIR. Knows he is STUFF; no apology reflex, no invisibility crisis — his ep-2 arc is spent and stays spent. This episode someone finally wants a specific PART of him, which is the most stuff-like thing that has ever happened to him. |
| **Blue** | minimax | `Decent_Boy` | 1.05 | One cameo, dawn. `happy` (casting), 4f approach gap, ricochet law, apologises to things he hits. Claims "first" and is WRONG — anti-Sunny seed watered, payoff NOT fired. |
| **Cloudia** | minimax | `Abbess` | 1.0 | One scene, marked CUTTABLE. The Cloud Hotel at checkout time; "darling" on every composed line. No arc. |
| **Violet** | — | — | — | NO VOICE, NOT EVER. One silent garnish firing (Scene 8). Same body as ep 3, amplitude blur, noticed by nobody. |
| **The kid** | — | silent, always | — | Silhouette. Fifth episode running; opens and closes the show. The kid's breath launches Pip; a plant hands the breath back. |
| **The volcano** | — | scenery | — | On the measured horizon from the FIRST wide and continuously visible in every wide after. One wordless stir (Scene 13). Voice reserved (`Elegant_Man` −6) and NOT used. |

**Two engines.** The Narrator and Sunny stay on kokoro — free, local,
re-synthesized the moment a line is reworded. Everybody else with a body and a
line is MiniMax speech-2.8-hd (via Replicate), which is paid but can act: it
takes an `emotion` and honours pause markers. There are **no pause markers in
this episode** — every silence is a held beat between lines, in `Video.tsx` —
and emotions are seasoning: Drip and Blue carry their locked cast emotion
(`happy`) on every line, Puff carries nine seasoned lines that are his arc
(alarm → commerce), Ray carries exactly one (`happy`, the chant), and Pip and
Cloudia carry none at all.

## The Big Word

| Word | Act | Line keys | Treatment |
|---|---|---|---|
| **PHOTOSYNTHESIS** | Three | `a3_65`–`a3_69` (five-voice syllable chant), `a3_70`, reprised `rc_07`–`rc_11` (aliases) + `rc_12` | `WordCard`, assembled one syllable per hero: PHO (Drip) / TO (Puff) / SYN (Ray) / THE (Pip) / SIS (Sunny). One card in the whole episode — it is a five-syllable monster and that is the fun. |
| **A TREE IS MADE OF AIR** | Three | `a3_21`–`a3_25` | **Rule stamp, not a `WordCard`** (ep-2 "WARM AIR RISES" precedent). |

Carbon dioxide is named once in speech (`a3_11`) and never carded.
Chlorophyll is not named at all.

## Line-key convention

`<act>_<number>_<speaker>`, in strict playback order, matching `narration.mjs`
exactly. Act prefixes: `co` cold open, `a1` the light, `a2` the water, `a3`
the air and the kitchen, `rc` recap.

## How to read the held beats

Same contract as episodes two and three. A stage direction that reads

> **HELD BEAT — 45f (1.5s) after `co_17_pip`.**

means: that line's `gapFrames` in `Video.tsx` is **45**, the picture is alone
on screen for a second and a half, and **nothing** — no line, no entrance, no
emotion change — starts inside it. Thirty frames is one second. These numbers
are the script's; raising one is a note, lowering one is a change to the joke.
Held beats are the spine only — the stamp chain, the break, the admission,
the roll-call buttons. Everywhere else, ensemble business is allowed in
(ep-3 retro: wall-to-wall stillness starves the comedy it protects).

---

# COLD OPEN

*Roughly ninety seconds. A breath, a flight, a landing, and a thesis.*

---

### Scene 1 — One breath
**On stage:** Narrator (voice only), the kid (silhouette, silent)
**Visual:** A wide summer meadow, morning. **The volcano sits small on the
measured horizon from this very first wide** — scenery, unremarked, and
continuously visible in every wide from here to the end card (volcano rule).
A big old tree stands at the meadow's edge (it is load-bearing in Act Three —
establish it now). The kid kneels in the grass holding a dandelion clock,
huge and white and ready.
**Lines:** `co_01_narrator`, `co_02_narrator`, `co_03_narrator`,
`co_04_narrator`

> **NARRATOR:** This is a story about the biggest thing in the world.
> **NARRATOR:** And about an old question. What do plants eat? Keep hold of it. The answer is not what anybody thinks.
> **NARRATOR:** Here is a field. Here is a kid. And here is a dandelion clock, ready to fly.

**HELD BEAT — 45f (1.5s) after `co_03_narrator`.** The kid inhales — the
silhouette's chest visibly rises — and BLOWS. The seed head detonates into a
slow drifting galaxy across the whole frame, in silence. This is the show
letting a picture land, and it is also the ep-2 dandelion proof, returned as
a launch. Note the circle being planted: the episode opens with a child
giving a plant a breath, and closes with a plant giving one back (Scene 28).

> **NARRATOR:** One breath. Off they go.

**Pedagogy:** Seed dispersal by wind — Pip's one ride, free ep-2 callback.
The next-time question from episode three ("What do plants eat?") is
collected in the first twenty seconds and armed as the episode's riddle.

---

### Scene 2 — The ride, and the roll call
**On stage:** Narrator, Pip (first appearance), the drifting seed cloud
**Visual:** Mid-air among dozens of identical drifting seeds. Pip is one of
them — same fluff, same seed, but her eyes are already narrowed at the wind
like a site manager reviewing a subcontractor. She does not float so much as
supervise.
**Lines:** `co_05_pip`, `co_06_narrator`, `co_07_pip`, `co_08_narrator`,
`co_09_pip`

> **PIP:** Left. Left. I said left.
> **NARRATOR:** This is Pip. Pip is a seed. Pip has instructions for everybody.

**ROLL CALL — FIRING 1 (greeting).** Series signature, fixed shape: cheerful
naming → one flat Narrator line → unbothered, unseasoned button. Nobody
replies inside the naming. The picture is the one the scene already has —
the dispersal cloud IS the queue of near-identical strangers.

> **PIP:** Hi Pipsqueak! Hi Pipley! Hi other Pip! Hi Pippa! Hi Pip the third!
> **NARRATOR:** Every seed in that packet is called Pip.

**HELD BEAT — 36f (1.2s) after `co_08_narrator`.** The seeds drift on,
identically. Nothing reacts.

> **PIP:** Good crew.

**Pedagogy:** One flower, many seeds, and the wind scatters them — the
lesson is the picture. The joke is also the cast sheet: these exact five
names return, in this exact order, at the goodbye (Scene 29).

---

### Scene 3 — Planted
**On stage:** Narrator, Pip
**Visual:** The ride ends. Pip spirals down and lands on a small brown patch
of dirt in open grass. The fluff folds; she settles in like a very small
stakeholder taking possession. Wide: the volcano on the horizon, the old
tree at the field's edge.
**Lines:** `co_10_narrator`, `co_11_pip`, `co_12_pip`, `co_13_narrator`,
`co_14_pip`, `co_15_narrator`, `co_16_pip`, `co_17_pip`, `co_18_narrator`

> **NARRATOR:** The wind put her down in the grass, on a small brown spot of dirt.
> **PIP:** Right. One step, please.

**HELD BEAT — 45f (1.5s) after `co_11_pip`.** Nothing whatsoever happens.
Pip strains — the whole seed tips one degree, and settles back. That is the
entire locomotion budget of the rest of her life.

> **PIP:** Any step.

**HELD BEAT — 45f (1.5s) after `co_12_pip`.** Still nothing. She stops
trying, visibly files the result, and is already over it.

> **NARRATOR:** Plants do not take steps. Not one. Not ever. This spot was Pip's now. Forever.
> **PIP:** Good. Moving is for things that are too small to stay.

**HELD BEAT — 30f (1.0s) after `co_14_pip`.** The hero thesis (synthesis,
verbatim). Let it stand in the air. It is the whole stuck-in-one-spot law
reframed as a choice, and it is the last time the episode ever treats her
stillness as a limitation.

> **NARRATOR:** Pip was the size of a crumb. The field was the size of the world.
> **PIP:** Perfect. I am going to build the biggest thing in the world. Right here.

She surveys her square inch exactly like a chef inspecting an empty
restaurant: one slow pan of the eyes, left to right. Then the verdict.

> **PIP:** It will do.

**HELD BEAT — 45f (1.5s) after `co_17_pip`.** **STAMP CHAIN — SOURCE
RECORDING, FIRING 1 of 5** (grading the dirt). This exact clip fires again at
`a1_31` (the moonlight), `a2_27` (the water), `a3_16` (the air) and `a3_79`
(the Sun himself), all `sameAs` aliases of this key. It is her highest grade,
her only grade, and the episode's spine gag — the audition must land THIS
line before anything downstream is built, because a recast after generation
re-buys the whole chain.

> **NARRATOR:** The dirt did not answer. She took that as a yes.

**Pedagogy:** The premise: total ambition, zero legs. Every classic quest
beat from here is inverted — she does not go to anything; everything comes
to her, which is honestly what a plant does.

---

### Scene 4 — Title, over one small seed
**On stage:** Narrator
**Visual:** Pull up and back: the seed becomes a dot, the field becomes the
world, the volcano holds the horizon line. Title: **Pip and the Sunshine
Kitchen.** The card settles; the dot that is Pip does not move, because she
can't, which is the poster of the whole episode.
**Lines:** `co_19_narrator`

> **NARRATOR:** This is the story of how the whole sky came to her.

---

# ACT ONE — THE LIGHT

*Recruited at night, wasted by day. Sunny claims everything and is right
every single time, which is the problem.*

---

### Scene 5 — Sunrise, and the one non-fan
**On stage:** Narrator, Sunny, Pip
**Visual:** Sunrise over the meadow. Sunny comes up ENORMOUS and delighted.
Every flower in the field turns to him; every stem in frame leans his way in
one soft synchronized bow — except one small upright seed, dead centre,
facing exactly where she was already facing.
**Lines:** `a1_01_narrator`, `a1_02_sunny`, `a1_03_sunny`, `a1_04_narrator`,
`a1_05_narrator`, `a1_06_sunny`, `a1_07_narrator`, `a1_08_pip`

> **NARRATOR:** Morning came up over the field.
> **SUNNY:** GOOD MORNING, EVERYBODY!
> **SUNNY:** I invented mornings!

The series-constant greeting+brag pair, fourth episode running, fired intact.
(No "You're welcome!" here — his five HA!-HA! firings are placed and this is
not one of them.)

> **NARRATOR:** Every flower in the field turned to look at him. Every stem leaned.
> **NARRATOR:** Except one.

**HELD BEAT — 45f (1.5s) after `a1_05_narrator`.** The wide: a field of
bowed stems and one vertical seed. Nothing moves. This is the engine of the
episode in one picture.

> **SUNNY:** Speechless! They often are.

**THE LEAN — PLANTED.** Pip's stem drifts toward Sunny all by itself —
heliotropism, true botany, her body voting against her attitude — and she
snaps it back upright.

> **NARRATOR:** Pip's stem started to lean all by itself. She put it back.
> **PIP:** We will discuss that later.

**Pedagogy:** Heliotropism planted as a body gag (fires again Scenes 7, 12,
15 as wordless snap-backs, goes uncorrected Scene 22, permanent Scene 26).
Sunny cannot perceive non-admiration; that misread stays kind and is why the
admission can be a gift later.

---

### Scene 6 — The order
**On stage:** Pip, Narrator, Sunny
**Visual:** Pip opens the site. Three bubbles stack over her like a posted
work order: **LIGHT / WATER / AIR** (bubble text in caps — print, not
pronunciation). The sky is vast above the tiny dot shouting at it.
**Lines:** `a1_09_pip`, `a1_10_pip`, `a1_11_narrator`, `a1_12_sunny`,
`a1_13_sunny`, `a1_14_pip`, `a1_15_pip`, `a1_16_narrator`

> **PIP:** Attention, sky. This is a building site.
> **PIP:** I need three deliveries. Light. Water. Air.
> **NARRATOR:** The sky did not answer. Most of it.
> **SUNNY:** LIGHT! Did somebody order LIGHT? Light is MINE!
> **SUNNY:** You're welcome! HA! HA!

**"You're welcome! HA! HA!" — SOURCE, FIRING 1 of 5.** His five firings this
episode are deliberately flat-identical — one text, one clip (kokoro is
deterministic; firings 2–5 are `sameAs` aliases to state the intent). He has
a rubber stamp too; that is the symmetry with "It will do." and the
escalation lives in everyone else, never in his read.

> **PIP:** Noted. The delivery service is loud.

**THE JOB-TITLE RUNNER — PLANTED.** She addresses everyone by role, never
name: "the delivery service" (Sunny), "the light order" (Ray), "one water"
(Drip), "the air order" (Puff). It resolves at the promotion (Scene 23).

> **PIP:** And I will be sourcing my light independently.

**HELD BEAT — 45f (1.5s) after `a1_15_pip`.** Deadpan, slow, and held. This
is also the plant of the not-saying-it runner: the entire episode is now
visibly "how long can she avoid the obvious supplier."

> **NARRATOR:** Independent light. Nobody had ever heard of it. She was going to try anyway.

**Pedagogy:** The recipe, posted: light, water, air. Dirt is conspicuously
not on the order — the answer to the cold-open riddle is on screen eleven
minutes before anyone says it.

---

### Scene 7 — The moonlight workaround
**On stage:** Narrator, Pip, Ray
**Visual:** Night. Stars, a big bright Moon. Pip's spot lit pale silver. A
beam arrives DOWN the moonlight — Ray's F2 ribbon bending its whole length
to reach her mark (arrivals stoop; she never rises — staging guidance from
the synthesis). His Cheshire face catches up a beat late, as ever.
**Lines:** `a1_17_narrator`, `a1_18_pip`, `a1_19_narrator`, `a1_20_ray`,
`a1_21_narrator`, `a1_22_pip`, `a1_23_ray`, `a1_24_ray`, `a1_25_pip`,
`a1_26_ray`, `a1_27_narrator`, `a1_28_pip`, `a1_29_ray`, `a1_30_pip`,
`a1_31_pip`, `a1_32_ray`, `a1_33_pip`

> **NARRATOR:** That night, the sun went down, extremely pleased with himself.
> **PIP:** Night shift. Perfect. No commentary.
> **NARRATOR:** And a light arrived anyway. A quiet one.
> **RAY:** Look up. That's me.

**Catch-phrase, firing 1 of his 2 — pointed at the MOON.** The catch-phrase
is the lesson: a child who obeys it is looking at moonlight, and moonlight
is about to turn out to be him.

> **NARRATOR:** That is Ray. Different show. Same beam.

"Different show. Same ___.", firing 1 of 2 this episode, fresh blank, 0.92
flat as always.

> **PIP:** You. The light order. You work nights?
> **RAY:** Before I take this job, full disclosure.
> **RAY:** Moonlight is not the moon's light. It is his light. Bounced off the moon.

**HELD BEAT — 36f (1.2s) after `a1_24_ray`.** The disclosure lands. Ray
holds perfectly still — a pedant honouring his own compulsory honesty and
hating every second of where it points. (Ep-3's Moon control experiment,
redeployed as a plot point.)

> **PIP:** So the moon is a mirror. And the big loud one works night shifts as well.
> **RAY:** That is also true.

**"That is also true." — SOURCE RECORDING, FIRING 1 of 3** (then `a2_39`,
`a3_57`). Unseasoned, flat, `auto`: the upset is in his stillness, not the
read — and the same clip has to port to Scene 15 (still upset) and Scene 23
(at peace), so a neutral take is load-bearing. EAR-CHECK it against all
three contexts before locking. New tic, synthesis-approved, logged for
Mike's review as new Ray canon.

> **NARRATOR:** Somewhere under the horizon, fast asleep, Sunny was winning.
> **PIP:** You bounced. That makes you freelance.
> **RAY:** I do not think that is how light works.
> **PIP:** It is how hiring works. You are hired.
> **PIP:** It will do.

**STAMP CHAIN — FIRING 2 of 5** (grading the moonlight; `sameAs` of
`co_17_pip`). **HELD BEAT — 36f (1.2s) after `a1_31_pip`.**

> **RAY:** It is second-hand light.
> **PIP:** It is quiet light. That is worth more.

**THE LEAN — wordless firing.** As she says "quiet light," her stem drifts
toward the horizon where Sunny set. Snap back. Nobody comments.

**Pedagogy:** Moonlight is bounced sunlight. Vindication #1: Ray's first
correction of the episode lands in Sunny's favor while Sunny is literally
asleep — even unconscious, he wins.

---

### Scene 8 — First, at dawn (Blue cameo + Violet garnish)
**On stage:** Narrator, Blue, Ray, Pip; Violet (silent, frame edge)
**Visual:** Dawn. The first direct beam arrives as only Blue arrives:
ricocheting off the fence, a stone, the fence again — never more than half a
frame in one direction, 4f approach gap, direction-change blur. **Violet
stands at the far frame edge the whole scene**, vibrating in place
(amplitude blur, same body as ep 3), inspected by no one, greeted by no one.
He exits before the scene ends. No line, no reaction, no cost.
**Lines:** `a1_34_narrator`, `a1_35_blue`, `a1_36_ray`, `a1_37_blue`,
`a1_38_pip`, `a1_39_blue`, `a1_40_narrator`

> **NARRATOR:** At dawn, the first direct beam arrived. It arrived the way Blue arrives everywhere.
> **BLUE:** First! Sorry, dandelion! I am first!

Bubble may shout "I am FIRST!" in caps; the clip stays lowercase (MiniMax
caps rule). He has hit the dandelion he is apologising to.

> **RAY:** I arrived last night. Via the moon.
> **BLUE:** Then I am first today! Today counts! Sorry, fence!
> **PIP:** I live here.

**HELD BEAT — 45f (1.5s) after `a1_38_pip`.** The resident's trump, flat.
Blue freezes mid-ricochet for the whole beat, recalculating.

> **BLUE:** First to leave! I am first to leave!
> **NARRATOR:** He was not first. He was very fast, though. Those are different things.

**Pedagogy / ledger:** Anti-Sunny seed watered: Blue claims a superlative,
is wrong twice (Ray by arrival time, Pip by residency), is corrected as a
gift, stays certain, exits at speed. **The payoff is NOT fired and he is
right about nothing.** "I just said that!" not fired; the copies not used.

---

### Scene 9 — Not open for business
**On stage:** Narrator, Ray, Pip
**Visual:** Morning proper. Ray delivers beam after faithful beam to Pip's
square inch — and every one lands on bare dirt and bounces uselessly away in
a little glitter of nothing. Pip watches her deliveries ricochet off the
premises.
**Lines:** `a1_41_narrator`, `a1_42_ray`, `a1_43_pip`, `a1_44_ray`,
`a1_45_ray`, `a1_46_ray`, `a1_47_pip`, `a1_48_narrator`

> **NARRATOR:** All morning, Ray delivered light to Pip's square inch. Here is what the light did there.

**HELD BEAT — 45f (1.5s) after `a1_41_narrator`.** One beam arrives, hits
dirt, bounces off, gone. Silence. The failure is the picture.

> **RAY:** Delivery report. Light is arriving. Nothing is catching it.
> **PIP:** Catch it? You said you were the delivery.
> **RAY:** The customer is not open for business. Light has to be caught, and used, right away. You need a catcher. A leaf. A green one.
> **RAY:** I know green personally. He sits down a lot.

A gift for returning viewers; a plain fact for new ones. (Ray may reference
his colours; none of them appear.)

> **RAY:** And for the record, nobody is eating me. I checked before I took the job.

Collects his own end-of-episode-three terror ("Is it me??") and resolves it
with pedantry: light is not an ingredient that gets eaten — it is used, the
moment it lands. The full oven idea stays SEEDED only; the word "oven"
belongs to Scene 23 (synthesis ruling).

> **PIP:** Then I will grow one. Growing takes water. New order. Water.
> **NARRATOR:** So the biggest thing in the world was going to start with a drink.

**Pedagogy:** Light cannot be stockpiled; the green catcher must exist
first. Germination-before-photosynthesis is the honest botany and the
episode's structure (synthesis: light recruited in Act One, consumed in Act
Three).

---

### Scene 10 — The puddle that would not walk
**On stage:** Narrator, Pip, Ray, Sunny
**Visual:** One puddle in the whole field, shining, exactly one step away
from Pip's spot. The geography of the joke is the staging: the camera frames
seed, gap, puddle like a maths problem.
**Lines:** `a1_49_narrator`, `a1_50_pip`, `a1_51_pip`, `a1_52_ray`,
`a1_53_narrator`, `a1_54_pip`, `a1_55_ray`, `a1_56_sunny`, `a1_57_sunny`,
`a1_58_ray`, `a1_59_pip`, `a1_60_narrator`

> **NARRATOR:** There was one puddle in the whole field. It was one step away.
> **PIP:** You. Puddle. Come here.

**HELD BEAT — 45f (1.5s) after `a1_50_pip`.** The puddle declines by
existing. Nothing moves.

> **PIP:** I am not going to walk over there. Walking is off the menu.
> **RAY:** I can move water. Light moves water all the time. Watch.

Ray bends over the puddle and warms it — no arms, all ribbon. The puddle
shimmers, thins, and rises off the ground as a twist of mist, up and away.

> **NARRATOR:** The puddle went up.
> **PIP:** You sent my water away.

Bubble may read "AWAY"; the clip stays lowercase.

> **RAY:** Up is away, technically. It will come back down. As rain. Eventually. Somewhere.

**HELD BEAT — 30f (1.0s) after `a1_55_ray`.** A pedant's guarantee,
hanging there in all its uselessness.

> **SUNNY:** Was that my water elevator? That WAS my water elevator! I lift ALL the water!
> **SUNNY:** You're welcome! HA! HA!

**HA! HA! — FIRING 2 of 5** (`sameAs`). Ep-1 canon, annoyingly true: his
warmth runs the evaporation that just stole her puddle.

> **RAY:** The elevator is his. I did the sums.
> **PIP:** Everything is his. It is exhausting.
> **NARRATOR:** It was not everything. It was nearly everything. Hold that thought.

**Pedagogy:** Evaporation, sun-powered (vindication #2). The act pivot: to
get water DOWN she must summon rain itself. And `a1_59_pip` is the first
click of her holdout counter — the episode measures her surrender in these:
"It is exhausting." → "Do not say it." (Scene 15) → "Fine." (Scene 22).

---

# ACT TWO — THE WATER

*The rain is summoned, the plumbing is thrilled, and the first swerves are
swerved.*

---

### Scene 11 — The rain campaign
**On stage:** Pip, Narrator
**Visual:** Pip glares at the sky like a dispatcher at an empty loading
dock. On the horizon, drifting grandly closer: the Cloud Hotel — ep-1's
skyscraper cloud, awnings and all. The volcano holds its spot on the
horizon, unremarked.
**Lines:** `a2_01_pip`, `a2_02_narrator`, `a2_03_pip`

> **PIP:** New problem. Rain does not take orders.
> **NARRATOR:** Rain comes from clouds. And clouds are full of guests.
> **PIP:** Then send me a cloud. A big one. With my water in it.

---

### Scene 12 — Checkout at the Cloud Hotel *(CUTTABLE — one scene, no arc)*
**On stage:** Cloudia, Pip, Narrator
**Visual:** The Cloud Hotel arrives overhead, low and magnificent. Cloudia
at her registry desk in the sky, gravity beneath her in every sense. Guests
(round happy drop-blobs) queue at the checkout ledge.
**Lines:** `a2_04_cloudia`, `a2_05_cloudia`, `a2_06_pip`, `a2_07_cloudia`,
`a2_08_cloudia`, `a2_09_narrator`, `a2_10_pip`, `a2_11_cloudia`

> **CLOUDIA:** Good afternoon, darling. The Cloud Hotel is at full capacity.
> **CLOUDIA:** Which means, darling, that it is checkout time.
> **PIP:** I ordered one water.
> **CLOUDIA:** One? Darling. Nobody leaves this hotel alone.
> **CLOUDIA:** Your delivery, darling. Signature required.
> **NARRATOR:** Pip had nothing to sign with. So she signed the only way she could. She leaned.

**THE LEAN — firing (scripted).** Her first voluntary lean, and it is a
signature, not an admission. Stem tips once, deliberately, and returns.

> **PIP:** Consider that a signature.
> **CLOUDIA:** Gorgeous penmanship, darling.

**Cut line:** if this scene goes, `a2_12_narrator` follows `a2_03_pip`
cleanly and nothing else moves. Costed as garnish, not spine (synthesis
keeps it, marked cuttable).

---

### Scene 13 — Here comes the weather (and the stir)
**On stage:** Narrator, Drip, Pip
**Visual:** RAIN — warm, silvery, everywhere. Drip rides the first fat drop
down, arms wide, entrance of a headliner. **THE VOLCANO STIR (the episode's
ENTIRE volcano budget, synthesis-ruled, wordless):** in the wide where the
rain crosses the whole horizon, at the moment the rain sheet crosses the
volcano's summit, **one thin curl of steam rises off the peak, holds about
two seconds (~60f), thins, and is gone.** Rain steaming off a mountain that
is warm now. Nobody looks at it, nobody names it, no music sting, the rain
just keeps falling. Ladder rep landed: ep-3 one-eye → ep-4 small stir →
ep-5 wakes.
**Lines:** `a2_12_narrator`, `a2_13_drip`, `a2_14_narrator`, `a2_15_pip`,
`a2_16_drip`, `a2_17_pip`, `a2_18_drip`, `a2_19_pip`, `a2_20_drip`

> **NARRATOR:** And down came the rain.
> **DRIP:** Hi! It's me! I'm the weather!

**Standing entrance, third identical firing** (ep 2 `a3_41`, ep 3 `a1_31`).
**PRODUCTION FLAG: reuse the ep-3 take by cache migration — do not
re-buy.** Same text, same fields (`Lively_Girl`, `happy`, 1.0); copy
`public/narration/sky-blue/a1_31_drip.mp3` to
`public/narration/plants/a2_13_drip.mp3` and seed the cache entry. Details
in Production notes.

> **NARRATOR:** That is Drip. Different show. Same weather.

"Different show. Same ___.", firing 2 of 2, fresh blank ("weather" — A's
blank, ruled in; it buttons her own entrance line). 0.92 flat.

> **PIP:** The water order. Confirmed. One water.
> **DRIP:** One water? I am the storm! I am the whole sky falling down!
> **PIP:** The order said one.
> **DRIP:** I brought a thousand cousins!
> **PIP:** Then the order is complete a thousand times. Well done, one water.

**HELD BEAT — 36f (1.2s) after `a2_19_pip`.** THE WEATHER versus a line on
a clipboard. Drip decides, visibly, whether to be outraged or flattered.

> **DRIP:** I will take it.

**Pedagogy:** The rain arrives as a character because the delivery IS the
water cycle — lifted in Act One (Scene 10), returned here, exactly as Ray
promised. Eventually. Somewhere.

---

### Scene 14 — The straw
**On stage:** Narrator, Drip, Pip
**Visual:** Cross-section: Pip's spot from the side, dirt below, seed at
the surface. Drip soaks into the ground — and gets pulled sideways-then-UP
into the root, riding the interior like a waterslide that goes the wrong
way. Character beat inside drawn geometry, per the diagram-sag rule: this
cutaway has a comedian IN it the whole time.
**Lines:** `a2_21_narrator`, `a2_22_drip`, `a2_23_drip`, `a2_24_narrator`,
`a2_25_drip`, `a2_26_pip`, `a2_27_pip`, `a2_28_drip`, `a2_29_narrator`,
`a2_30_drip`

> **NARRATOR:** Now. The front door of a plant is not on top. It is at the bottom.
> **DRIP:** The door is in the dirt? Fancy.
> **DRIP:** A waterslide! It goes up! An uphill waterslide!
> **NARRATOR:** Roots drink at the bottom. The water climbs the plant like a straw.
> **DRIP:** I am the plumbing! Of the biggest thing in the world!

On screen: **GERMINATION.** The seed case cracks, a green sprout pops up —
Pip gains her first height, a capability unlock, not a time-lapse (motion
law: her only travel is growth).

> **PIP:** Height. Finally. Put it on the building.
> **PIP:** It will do.

**STAMP CHAIN — FIRING 3 of 5** (grading the water; `sameAs`). **HELD BEAT —
30f (1.0s) after `a2_27_pip`.**

> **DRIP:** It will do? I am the best water there has ever been!

**HELD BEAT — 36f (1.2s) after `a2_28_drip`.** Outrage, hanging.

> **NARRATOR:** It is the highest grade she gives.

**SOURCE RECORDING** — this flat 0.9 line re-fires byte-identical at
`a3_80` (aimed at the Sun). Held: **HELD BEAT — 45f (1.5s) after
`a2_29_narrator`.** Button unseasoned; deadpan is stillness.

> **DRIP:** Oh. Then I accept.

**Pedagogy:** Water enters at the roots and climbs — Drip's want (to be
taken as big) collides with being the plumbing of the biggest thing in the
world, and the collision carries the mechanism.

---

### Scene 15 — Credit, and the first swerves
**On stage:** Drip, Ray, Pip, Sunny, Narrator
**Visual:** The new sprout, proud and green. Drip's face visible in the stem
cross-section (she lives here now). Ray angles in overhead. Mid-scene, in
the background of the wide: **the rain has sprouted the whole packet — five
identical little sprouts pop up in a row across the field, one-two-three-
four-five.** Nobody names them (the greeting already happened mid-air; this
is the picture the Scene-29 goodbye needs, planted quietly).
**Lines:** `a2_31_drip`, `a2_32_ray`, `a2_33_drip`, `a2_34_ray`, `a2_35_pip`,
`a2_36_ray`, `a2_37_sunny`, `a2_38_sunny`, `a2_39_ray`, `a2_40_pip`,
`a2_41_ray`, `a2_42_narrator`

> **DRIP:** That sprout is mine, by the way. Water did that.
> **RAY:** Half yours. The water fell down. Something lifted it up first.
> **DRIP:** It was lifted by the sky. By upstairs. By a large warm colleague.

**THE SWERVE — ensemble firing 1.** The sentence bends around the sun like
water around a rock. (Runner planted at `a1_15`; fires again Scene 18
(Narrator) and Scene 22 (the triple); resolves Scene 23, when the one
character who never claps is the one who finally says it.)

> **RAY:** The lift is powered by somebody.
> **PIP:** Do not say it.
> **RAY:** I was not going to say it. Everybody knows it. That is different from saying it.
> **SUNNY:** The lift is ME! The lift is ALWAYS me!
> **SUNNY:** You're welcome! HA! HA!

**HA! HA! — FIRING 3 of 5** (`sameAs`). He heard everything. He always
hears everything.

> **RAY:** That is also true.

**"That is also true." — FIRING 2 of 3** (`sameAs`). Still structurally
upset; same neutral clip, the context does the work. **THE LEAN — wordless
firing:** Pip's stem drifts sunward under the HA! HA!; snap back.

> **PIP:** Stop confirming him.
> **RAY:** I am contractually honest.
> **NARRATOR:** The rain had watered everybody, by the way. The whole packet came up.

**Pedagogy:** The series' credit-allocation device warming up (it fires in
signature form at `a3_36`), and every ingredient so far traces to the same
supplier. The ensemble's faces do the maths and refuse to publish.

---

### Scene 16 — Nobody eats dirt (and the leaf)
**On stage:** Drip, Pip, Narrator, Ray
**Visual:** Cross-section again, cosier: Drip in the stem, the sprout above,
dirt all around. On `a2_46` the audience's wrong model gets corrected by a
character, not a lecture. Then THE FIRST LEAF unfurls in real time — bright,
green, and immediately pointed at things. Her first pointer: before this she
could only lean at the world; now she has an arm.
**Lines:** `a2_43_drip`, `a2_44_drip`, `a2_45_pip`, `a2_46_narrator`,
`a2_47_pip`, `a2_48_narrator`, `a2_49_pip`, `a2_50_ray`, `a2_51_drip`,
`a2_52_pip`

> **DRIP:** Question from the plumbing. Is it lunchtime down here? Do you eat the dirt?
> **DRIP:** I have been mud. I was delicious.
> **PIP:** Nobody eats dirt.

**HELD BEAT — 36f (1.2s) after `a2_45_pip`.** Flat, slow, final. The
cold-open riddle gets its first half-answer as chef's indignation.

> **NARRATOR:** She is right. No plant has ever eaten dirt. Not once. Watch what they do instead.

THE LEAF UNFURLS.

> **PIP:** A leaf. Excellent. Somewhere to cook.
> **NARRATOR:** Her first leaf. Her first pointer, too.
> **PIP:** You. Sky. Stand by for orders.

She points the new leaf at the sky on the line — the unlock demonstrated
the instant it exists.

> **RAY:** Good leaf. Green is the catching colour. The green you see is the bit it sends back to you.
> **DRIP:** So what is dirt for, then?
> **PIP:** It's where I keep my feet.

**HELD BEAT — 45f (1.5s) after `a2_52_pip`.** Soil stays an unexplained
given — that is her complete account of it, the episode never says more,
and the end card cashes it in. (Ep 5 pays off the origin.)

**Pedagogy:** Plants make their own food (stated by the Narrator inside
Drip's mud joke); green is the light-catching stuff, in Ray's register
(the green you SEE is the bounced bit — physics-honest); soil = held
mystery, by design.

---

### Scene 17 — The air order
**On stage:** Pip, Puff
**Visual:** The sprout-with-a-leaf stands ready. Pip runs inventory like a
site foreman at a whiteboard (bubbles tick: WATER ✓ LIGHT ✓). Then the
question with no obvious supplier — and the answer arrives from everywhere
and nowhere, because it was always here.
**Lines:** `a2_53_pip`, `a2_54_pip`, `a2_55_puff`

> **PIP:** Inventory. Water, inside. Light, on retainer. One delivery left. Air.
> **PIP:** Where does one order air?

**HELD BEAT — 45f (1.5s) after `a2_54_pip`.** Empty sky. Grass stirs,
just barely.

> **PUFF:** You can't see me. But you can FEEL me.

**Puff's catch-phrase, exactly once, AS his entrance** (synthesis ruling —
and B's reasoning for skipping his "Different show" line: an invisible
character cannot be announced by a narrator pointing at him). The grass
flattens in a soft ring as he says it. **PRODUCTION NOTE:** identical text
and fields to ep-2 `a1_40_puff` (`Exuberant_Girl`, `happy`, 1.0) — the
ear-approved take can be cache-migrated instead of re-bought, which also
sidesteps re-rolling the canon "FEEL" capital on MiniMax. See Production
notes.

---

# ACT THREE — THE AIR, AND THE KITCHEN

*The trade, the tree, the crumb that breaks the stamp, and the hire.*

---

### Scene 18 — The guest that lives at the party
**On stage:** Puff, Pip, Narrator
**Visual:** Puff pops visible (his courtesy) beside the sprout — small,
quick, delighted. The meadow's grass ripples wherever he gestures.
**Lines:** `a3_01_puff`, `a3_02_pip`, `a3_03_puff`, `a3_04_narrator`,
`a3_05_pip`, `a3_06_narrator`

> **PUFF:** Air! You ordered air! I am air! I have been here the whole time!
> **PIP:** Since when?
> **PUFF:** Since always! I am the guest that lives at the party!
> **NARRATOR:** The one delivery that arrives before you order it.
> **PIP:** The air order. Early. Noted. Promoted.
> **NARRATOR:** Who makes the wind that stirs him? Moving on.

**THE SWERVE — firing 2**, and it is the Narrator's: even the storyteller
declines to finish that sentence. 0.92, flat, and straight on.

---

### Scene 19 — The kitchen takes its first breath
**On stage:** Narrator, Puff, Pip
**Visual:** Ray lays one beam on the new leaf. The leaf glows faintly — and
INHALES: a tiny sparkling mote is drawn out of Puff and into the leaf.
Puff watches a piece of himself join a recipe. Played funny, never scary:
the mote is a glitter-crumb, the leaf is warm, nothing is grabbed.
**Lines:** `a3_07_narrator`, `a3_08_puff`, `a3_09_pip`, `a3_10_puff`,
`a3_11_narrator`, `a3_12_pip`, `a3_13_puff`, `a3_14_narrator`, `a3_15_puff`,
`a3_16_pip`, `a3_17_puff`

> **NARRATOR:** Ray put one beam on the new leaf. And the kitchen took its very first breath.
> **PUFF:** The leaf is eating me!

`emotion: "surprised"` — stage direction: alarm, played funny, a yelp not a
fright (tone guardrail: no peril).

> **PIP:** Only the tiny part. The fizzy bit. You will not miss it.
> **PUFF:** There are parts of me? I have parts?

`emotion: "surprised"` — the fact lands on him, ep-2 grammar: being made of
parts is more STUFF, which is his favourite thing to be.

> **NARRATOR:** He does. The fizzy part has a long name. Carbon dioxide. A tiny, tiny piece of air.
> **PIP:** The kitchen takes the fizzy bit. And look. It gives one back.

The leaf breathes OUT: a different, brighter mote drifts back to Puff.

> **PUFF:** A part came back! A different part! A fresh one!

`emotion: "happy"` — the trade-back delight; the flip from alarm to
commerce happens on this line.

> **NARRATOR:** Nothing stolen. A trade. Air in, fresh air out.
> **PUFF:** I traded with a plant!

`emotion: "happy"` — stage direction: ecstatic commerce. Bubble may read
"I TRADED with a PLANT!"; the clip stays lowercase.

> **PIP:** It will do.

**STAMP CHAIN — FIRING 4 of 5** (grading the air; `sameAs`). **HELD BEAT —
30f (1.0s) after `a3_16_pip`.**

> **PUFF:** Did you hear that? The air will do!

**Pedagogy:** Gas exchange as a trade negotiation: the plant takes carbon
dioxide (named once, lightly), gives back the fresh part, nothing stolen —
Puff's alarm-to-delight arc IS the mechanism.

---

### Scene 20 — The tree made of air
**On stage:** Narrator, Drip, Puff, Ray, Pip
**Visual:** The camera lifts to the big old tree at the meadow's edge —
established since the first frame, now finally looked at. Under it, the
ground: ordinary, undisturbed, completely full of dirt.
**Lines:** `a3_18_narrator`, `a3_19_drip`, `a3_20_puff`, `a3_21_narrator`,
`a3_22_narrator`, `a3_23_puff`, `a3_24_puff`, `a3_25_ray`, `a3_26_pip`

> **NARRATOR:** Now look at the big old tree at the edge of the field. Here is a question. What is a tree made of?
> **DRIP:** Wood.
> **PUFF:** Wood is a good guess. I would have said wood.
> **NARRATOR:** Wood, yes. But what is the wood made of? Not dirt. Dig under a tree. The dirt is all still there.
> **NARRATOR:** A tree builds its whole body out of water. And air.

**HELD BEAT — 60f (2.0s) after `a3_22_narrator`.** The mind-blower gets the
long hold. The tree stands there, enormous, being made of sky.

> **PUFF:** She is going to be made of me.
> **PUFF:** I am going to be a tree.

Both `emotion: "happy"` — stage direction: delighted horror arriving at
pride, and it lands on pride. **RULE STAMP slams on: A TREE IS MADE OF
AIR** (arrow-stamp banner, ep-2 "WARM AIR RISES" treatment, not a
`WordCard`).

> **RAY:** The card is correct. Mostly air and water. I checked it twice.
> **PIP:** Less admiring. More building.

**Pedagogy:** Mind-blower #1 (Math-bait, true, checkable): a tree's mass
comes from CO2 + water, not soil — the dirt barely loses weight. Carried by
Puff at his proudest: he is a building material.

---

### Scene 21 — One crumb of sugar
**On stage:** Narrator, Pip, Ray
**Visual:** Full assembly, staged on the sprout: water line climbing (Drip
visible in it), the fizzy mote arriving, one beam on the leaf. The leaf
glows... and produces, with great ceremony, ONE gleaming crumb of sugar,
centre frame, absurdly small. The frame is huge around it on purpose — it
rhymes with `co_15` ("Pip was the size of a crumb").
**Lines:** `a3_27_narrator`, `a3_28_narrator`, `a3_29_narrator`, `a3_30_pip`,
`a3_31_ray`, `a3_32_ray`, `a3_33_pip`, `a3_34_ray`, `a3_35_ray`, `a3_36_ray`,
`a3_37_pip`, `a3_38_narrator`

> **NARRATOR:** Water from below. The fizzy bit of air. One beam of light, on full.
> **NARRATOR:** And out came the first food ever cooked in this field. Sugar.
> **NARRATOR:** One crumb of it.

**HELD BEAT — 60f (2.0s) after `a3_29_narrator`.** The crumb. The whole
frame. Nothing else.

> **PIP:** One crumb.
> **RAY:** Sugar is sunshine, stored. That crumb is light you can keep.
> **RAY:** Look down. That is also me.

**Catch-phrase variant, firing 2 of his 2** (synthesis-approved mutation of
"Look up. That's me.", writer's placement: at the sugar). Stage direction:
quiet — the proudest and most begrudging thing he says all episode, because
it is one more point for Sunny.

> **PIP:** How many crumbs to build the biggest thing in the world?
> **RAY:** One beam makes one crumb. You would need every beam the sun has. All day. Every day.
> **RAY:** That is not a delivery. That is the whole sun.

**HELD BEAT — 45f (1.5s) after `a3_35_ray`.** The maths hangs. Everyone on
stage can see where it points. Nobody looks there.

> **RAY:** It is mostly him.

**The series credit-allocation device, in signature form** (fourth-ever
firing; ep-3 closed on Red's "It is mostly me."). Unseasoned, 0.95, and
held: **HELD BEAT — 60f (2.0s) after `a3_36_ray`.** Deadpan is stillness;
nothing enters this beat.

> **PIP:** It will not do.

**THE BREAK — NEW RECORDING, NOT ALIASED** (synthesis ruling: replaces A's
silent empty slot and is plot-causal — the crumb forces the hire). The first
time in her life her highest grade has failed. Slow, flat, enormous.
**HELD BEAT — 75f (2.5s) after `a3_37_pip`.** The longest hold so far.

> **NARRATOR:** It was the first time she had ever said it.

**Pedagogy:** Sugar = stored sunlight (mind-blower #3 seeded here in Ray's
register; Sunny collects it in Scene 25). Scale honesty: one beam, one
crumb; a tree needs the whole sun.

---

### Scene 22 — The stall
**On stage:** Narrator, Drip, Puff, Ray, Pip
**Visual:** The whole crew around the sprout, all carefully looking at
things that are not the sun. The sky is huge and golden behind them, with
one enormous obvious supplier in it.
**Lines:** `a3_39_narrator`, `a3_40_drip`, `a3_41_puff`, `a3_42_ray`,
`a3_43_ray`, `a3_44_narrator`, `a3_45_pip`

> **NARRATOR:** Everyone knew what she had to do next. Nobody would say it out loud.
> **DRIP:** You could ask. A cloud. Clouds are very powerful.
> **PUFF:** You could ask the sky. Or the sky's roommate. The big round one.
> **RAY:** You could ask the source of every beam in the sky.

**HELD BEAT — 24f (0.8s) after `a3_42_ray`.** He hears himself.

> **RAY:** No. Forget I said that.

**THE SWERVE — firing 3, the escalating triple**, resolved next scene by
the one character the mechanism can corner.

> **NARRATOR:** Pip's stem leaned. This time, she let it.

**THE LEAN — UNCORRECTED.** The runner's resolution begins here, silently:
the body said it first. **HELD BEAT — 45f (1.5s) after `a3_44_narrator`.**

> **PIP:** Fine.

**HELD BEAT — 45f (1.5s) after `a3_45_pip`.** One word, slow, and the act
turns on it.

---

### Scene 23 — The hire
**On stage:** Pip, Narrator, Sunny, Ray
**Visual:** Pip turns her leaf — her pointer — up at the Sun, and addresses
him directly for the first time in the episode. Wide and warm: tiny sprout,
enormous sun, the whole field listening. **Direction that rules the scene:
this is a HIRE, not a surrender. She keeps her register to the last word.
And Sunny — for the only time in four episodes — does not interrupt. He
lets her finish. That is his one gift back, and it is what keeps the scene
warm and the admission a promotion instead of a comeuppance.**
**Lines:** `a3_46_narrator`, `a3_47_pip`, `a3_48_narrator`, `a3_49_pip`,
`a3_50_pip`, `a3_51_pip`, `a3_52_pip`, `a3_53_pip`, `a3_54_sunny`,
`a3_55_sunny`, `a3_56_sunny`, `a3_57_ray`, `a3_58_sunny`, `a3_59_pip`,
`a3_60_narrator`

> **NARRATOR:** What happened next had never happened in this field, or any other.
> **PIP:** You. The big one. Down here.
> **NARRATOR:** And for the first time in four whole shows, Sunny did not interrupt.
> **PIP:** I am building the biggest thing in the world. It cooks its own food. And the cooking runs on light. All day. Every day. Yours.
> **PIP:** Every leaf there has ever been. Every tree. Every apple. All of it ran on you.

**HELD BEAT — 45f (1.5s) after `a3_50_pip`.** The fact everyone spent three
acts not saying, said, flat, complete.

> **PIP:** He was never the delivery service.
> **PIP:** He is the oven.

**THE PROMOTION** (A's language, synthesis-ruled into B's staging; resolves
the job-title runner). **HELD BEAT — 75f (2.5s) after `a3_52_pip`** — the
episode's biggest held beat. Nothing enters it. Her stem is leaning the
whole time and she is letting it.

> **PIP:** The job is yours. Shift starts at dawn.

**HELD BEAT — 60f (2.0s) after `a3_53_pip`.**

> **SUNNY:** I know.

His quietest line in four episodes — kokoro, so the quiet is words and 0.95,
nothing else. **HELD BEAT — 45f (1.5s) after `a3_54_sunny`.**

> **SUNNY:** You're welcome! HA! HA!

**HA! HA! — FIRING 4 of 5** (`sameAs`) — the biggest one, by placement, not
by read: same flat-identical clip, detonated by the silence around it.
**HELD BEAT — 45f (1.5s) after `a3_55_sunny`.** Then the aria, at full
unbearable wattage, every word of it legitimate:

> **SUNNY:** Every forest! Every flower! Every salad EVER! All of it cooks on ME!
> **RAY:** That is also true.

**"That is also true." — FIRING 3 of 3** (`sameAs`) — the same neutral clip,
finally at peace: inside a fully true aria there is nothing left to be upset
about. Chain resolved by context, per the synthesis.

> **SUNNY:** Every apple is MY apple! Every lettuce is MY lettuce!
> **PIP:** Do not make it weird. Dawn. Do not be late.
> **NARRATOR:** He was not late. He has never once been late.

**Pedagogy / arc:** Sunny's peak — his one fully-legitimate claim, conceded
by the only character who never clapped, with zero wrongness fired anywhere.
He exits the episode at maximum altitude for the ep-5 drop. No thank-you
(synthesis: the thank-you is the Scene-26 stamp instead).

---

### Scene 24 — Full power, and the Big Word
**On stage:** Narrator, Sunny, Pip, Drip, Puff, Ray
**Visual:** DAWN. The sun comes up like an appliance switching on. Light
floods the field; the sprout surges — leaves unrolling, stem thickening, a
visible growth spurt past the sprout row (growth = her only travel, spent
lavishly). The kitchen at full roar.
**Lines:** `a3_61_narrator`, `a3_62_sunny`, `a3_63_pip`, `a3_64_narrator`,
`a3_65_drip`, `a3_66_puff`, `a3_67_ray`, `a3_68_pip`, `a3_69_sunny`,
`a3_70_narrator`, `a3_71_ray`, `a3_72_narrator`

> **NARRATOR:** At dawn, the oven clocked in.
> **SUNNY:** ONE WHOLE SUN! DELIVERED!
> **PIP:** More leaves! More pans! Cook everything!
> **NARRATOR:** And this whole trick has a name. It is a monster of a name. Ready?

**BIG WORD — PHOTOSYNTHESIS.** The `WordCard` assembles one syllable at a
time, each syllable slammed on by its owner (five clips + card sync;
synthesis-approved, Narrator-led fallback pre-written in `narration.mjs` if
production fights it). Everyone cheers their syllable — except Pip, who
files hers, which is the joke:

> **DRIP:** Pho!
> **PUFF:** To!
> **RAY:** Syn!
> **PIP:** The.
> **SUNNY:** SIS!
> **NARRATOR:** Photosynthesis. Light, water and air, cooking food inside a leaf.
> **RAY:** Photosynthesis. First try.
> **NARRATOR:** Ray said it perfectly. Nobody clapped.

**HELD BEAT — 36f (1.2s) after `a3_72_narrator`.** Ray stands there, having
said it perfectly, unclapped-for.

**Pedagogy:** The Big Word, planted at the moment the mechanism is on
screen at full power. The chant order is the reunion engine made audible —
one hero per syllable, the boss on the last one.

---

### Scene 25 — Sweetness is stored sunshine
**On stage:** Narrator, Sunny
**Visual:** Close on the leaf production line: crumbs of sugar accumulating
now, beat by beat, into a little gleaming hoard. Over it, an apple fades in
— then a strawberry, then a slice of bread — each one briefly glowing
sun-gold from inside.
**Lines:** `a3_73_narrator`, `a3_74_sunny`, `a3_75_narrator`,
`a3_75b_narrator`, `a3_76_narrator`, `a3_77_sunny`

> **NARRATOR:** And the sugar is the part you know. Sugar is sunshine you can keep.
> **SUNNY:** Sweetness is me, in a box.

Synthesis, verbatim — his most legitimate brag ever.

> **NARRATOR:** Annoyingly.

**HELD BEAT — 24f (0.8s) after `a3_75_narrator`.** Showrunner edit pass:
split clip — the ep-1 echo earns a real hang (STYLE: a beat a full stop
cannot buy gets two clips and a gap).

> **NARRATOR:** That is completely true.

The ep-1 echo ("annoyingly, he is completely right"), 0.92 flat, both
halves (`a3_75` / `a3_75b`).

> **NARRATOR:** Every apple you have ever eaten was sunshine, saved up. You have been eating sunshine your whole life.

**HELD BEAT — 45f (1.5s) after `a3_76_narrator`.** Mind-blower #3 gets its
hold.

> **SUNNY:** Enjoy your lunch! It is me!

**Pedagogy:** Sugar = stored sunlight, eating an apple is eating sunshine —
true, checkable (Math's channel), and delivered as the peak of Sunny's ego
with the Narrator conceding on the record.

---

### Scene 26 — The button
**On stage:** Narrator, Pip
**Visual:** End of the day. The build is visibly a young plant now — taller
than the sprout row, leaves everywhere. Pip regards the setting sun for a
long moment. **Her stem is leaning toward him, fully, and she leaves it
there. Permanent.** (The lean runner resolves silently; the resolution IS
the admission, made visible.)
**Lines:** `a3_78_narrator`, `a3_79_pip`, `a3_80_narrator`

> **NARRATOR:** The build went up all day. And at the end of it, Pip looked at her oven for a long time.
> **PIP:** It will do.

**STAMP CHAIN — FIRING 5 of 5, RESOLUTION** (`sameAs`; aimed at the Sun
himself). Her concession, delivered as her highest grade, in the identical
flat clip she graded dirt with. **HELD BEAT — 75f (2.5s) after
`a3_79_pip`.** Longest hold in the episode, shared with Scene 23's.

> **NARRATOR:** It is the highest grade she gives.

**Second firing, byte-identical** (`sameAs` of `a2_29_narrator`) — the flat
explanation, re-aimed at the one recipient who will take it as five stars.
**HELD BEAT — 45f (1.5s) after `a3_80_narrator`.** Sunny says nothing — his
first silent beat in four episodes. His glow swells about ten percent.
Nothing else moves. Last Pip line before the recap, per the synthesis.

---

# RECAP

*The chant, the mind-blower, the goodbye, the question.*

---

### Scene 27 — The curtain call
**On stage:** Narrator, Drip, Puff, Ray, Sunny, Pip
**Visual:** The recap's lit panels, one per hero, each taking a bow for
their ingredient. Violet does not appear (his ep-3 panel wave was his; this
is not his episode). The PHOTOSYNTHESIS card returns for the reprise and
the syllables light up in owner order.
**Lines:** `rc_01_narrator`, `rc_02_drip`, `rc_03_puff`, `rc_04_ray`,
`rc_05_sunny`, `rc_06_sunny`, `rc_07_drip`, `rc_08_puff`, `rc_09_ray`,
`rc_10_pip`, `rc_11_sunny`, `rc_12_narrator`, `rc_13_pip`

> **NARRATOR:** Let's say the big words together. Ready?
> **DRIP:** Water! That was me! I took the uphill waterslide!
> **PUFF:** Air! That was me! I traded my fizzy bit! I am in the tree right now!
> **RAY:** Light. Also me. Mostly him.

Deadpan bow — his whole episode in six words. Unseasoned, 0.95.

> **SUNNY:** LIGHT! MINE! ALL OF IT!
> **SUNNY:** You're welcome! HA! HA!

**HA! HA! — FIRING 5 of 5** (`sameAs`; the recap placement, per the
synthesis). Ledger closed at five; the three of headroom under the ceiling
of eight belong to the showrunner.

**The reprise** — the five chant syllables re-fire byte-identical
(`rc_07`–`rc_11`, all `sameAs` of the Scene-24 clips) as the card's
syllables light up in turn:

> **DRIP:** Pho!
> **PUFF:** To!
> **RAY:** Syn!
> **PIP:** The.
> **SUNNY:** SIS!
> **NARRATOR:** Photosynthesis. Plants make their own food. Out of light, water and air.
> **PIP:** Three deliveries. One kitchen. No dirt was eaten.

**Pedagogy:** The chant reprise plus the one-sentence version of the whole
episode, and the cold-open riddle formally closed: what do plants eat?
Nothing. They cook.

---

### Scene 28 — Your next breath
**On stage:** Narrator, Puff, the kid (silhouette, silent)
**Visual:** The meadow at golden hour. The kid is back, standing where the
dandelion clock used to be — beside a young plant that was not there this
morning. The circle closes: the kid gave a plant a breath in Scene 1; a
plant gives one back now.
**Lines:** `rc_14_narrator`, `rc_15_narrator`, `rc_16_narrator`,
`rc_17_puff`, `rc_18_narrator`

> **NARRATOR:** Now here is the amazing part.
> **NARRATOR:** Take a big breath. A real one. Go on.

**HELD BEAT — 45f (1.5s) after `rc_15_narrator`.** Homework beat, ep-2
hand-wave precedent: a child needs the time to actually do it, and if the
next line lands first they will not. The kid's silhouette chest rises with
the audience.

> **NARRATOR:** The fresh part of that breath. The part that keeps you going. A plant breathed it out.

**HELD BEAT — 45f (1.5s) after `rc_16_narrator`.**

> **PUFF:** A plant made that one. Pass it on.

Quiet, `auto` — the words carry it; the proudest small line he has.

> **NARRATOR:** And the tree at the edge of the field caught the fizzy part of it, and started cooking.

**Pedagogy:** Mind-blower #2, the closer: the oxygen in your next breath
was breathed out by a plant. True, checkable, and staged on the one body in
the show the audience can be.

---

### Scene 29 — Goodnight, everybody called Pip
**On stage:** Narrator, Pip
**Visual:** Dusk. The sprout row across the field, five little silhouettes
in the last light, Pip's young plant tallest among them. The volcano holds
the horizon, asleep, promising nothing. Then the end card.
**Lines:** `rc_19_narrator`, `rc_20_pip`, `rc_21_narrator`, `rc_22_pip`,
`rc_23_narrator`, `rc_24_pip`

> **NARRATOR:** The sun went down on the field. All the little Pips stood in their row.

**ROLL CALL — FIRING 2 (goodbye).** Same five siblings, same order, same
fixed shape. The joke is also the lesson: a farewell between neighbours who
are all planted forever.

> **PIP:** Bye Pipsqueak. Bye Pipley. Bye other Pip. Bye Pippa. Bye Pip the third.
> **NARRATOR:** Nobody was going anywhere.

Kept verbatim per the synthesis. 0.92 flat. **HELD BEAT — 45f (1.5s) after
`rc_21_narrator`.**

> **PIP:** See you tomorrow.

Kept verbatim per the synthesis. Unseasoned button, deadpan stillness —
nothing enters this beat. **HELD BEAT — 45f (1.5s) after `rc_22_pip`.**

**END CARD:** *WHAT IS DIRT ACTUALLY MADE OF?*

> **NARRATOR:** Next time. What is dirt actually made of?
> **PIP:** Send it here. I will grade it.

The last line of the episode: the soil bridge armed (ep 5 pays off dirt's
origin), her register intact to the final syllable, and no promises made by
anyone — the volcano is scenery on a dusk horizon, and stays that way.

---

## Production notes

**Tone guardrails.** Unchanged from episodes one through three. No sarcasm a
six-year-old cannot parse; Pip's deadpans are always about obvious behaviour
(Sunny bragging, a puddle not walking), never ironic reversals. No scary
peril: the leaf "eating" Puff is a yelp and a glitter-crumb, resolved into a
trade within four lines; the volcano stir is a curl of steam nobody sees. No
potty humour. Nobody is unkind: Blue's corrections are gifts, Sunny is never
told he is wrong (he is not), and the admission is a promotion, not a
surrender — she concedes the mechanism, never her dignity.

**Comedy pacing is designed in.** Slower per-line speeds on every list,
roll call and deadpan (the floor is 0.9 on Pip's stamps and the Narrator's
"It is the highest grade she gives."; house flat 0.92 on every roll-call
middle line and "Different show" firing). Held beats: forty-four of them
written above with exact frame counts; the spine holds are the stamp chain
firings, the break (75f), the promotion (75f), and the Scene-26 resolution
(75f). **No emotion lead on held-beat scenes** — the staging kit's default
8-frame `useEmotion` lead leaks punchlines into the silence in front of
them; cut it to 0 wherever a HELD BEAT direction appears. Held beats are
spine-only; ensemble business is allowed everywhere else (ep-3 retro rule).

### Catch-phrase ledger — counts vs ceilings

| Phrase | Owner | This episode | Ceiling / rate | Keys |
|---|---|---|---|---|
| "You're welcome! HA! HA!" | Sunny | **5** (flat-identical: 1 recording + 4 aliases) | **8, hard** — the 3 of headroom belong to the showrunner's edit pass, not this script | `a1_13` (source), `a1_57`, `a2_38`, `a3_55`, `rc_06` |
| "GOOD MORNING, EVERYBODY!" → "I invented mornings!" | Sunny | 1 pair | series constant, fourth episode running | `a1_02`, `a1_03` |
| "Hi! It's me! I'm the weather!" | Drip | 1 (third identical firing) | standing entrance | `a2_13` — **cache-migrate from ep 3** |
| "You can't see me. But you can FEEL me." | Puff | 1, AS his entrance | one per appearance (now 5 series-wide) | `a2_55` — migration option from ep 2 |
| "Look up. That's me." | Ray | 1 + 1 variant ("Look down. That is also me.") | ~2–3 per episode | `a1_20`, `a3_32` |
| "Different show. Same ___." | Narrator | 2 — fresh blanks: **beam**, **weather** (used before: sun, sky, rain, air) | one per returning entrance; Puff skip ruled in | `a1_21`, `a2_14` |
| "It will do." | Pip (NEW) | 5 firings, 1 recording + 4 aliases; + 1 break variant "It will not do." (new recording) | new chain, self-capped at 5 + break | `co_17` (SOURCE), `a1_31`, `a2_27`, `a3_16`, `a3_79`; break `a3_37` |
| "That is also true." | Ray (NEW — logged for Mike) | 3 firings, 1 recording + 2 aliases | new chain, capped at 3 | `a1_26` (SOURCE), `a2_39`, `a3_57` |
| "It is the highest grade she gives." | Narrator | 2 firings, byte-identical | new; travels with the stamp chain | `a2_29` (SOURCE), `a3_80` |
| "darling" | Cloudia | 5, every composed line | hers | `a2_04`, `a2_05`, `a2_07`, `a2_08`, `a2_11` |
| "OH! That one is me as well!" | Sunny | **0 — BANKED** (volcano thread, ep 5) | — | — |
| "That is not me." | Sunny | **0 — BANKED** | — | — |
| The long fuse ("One day Sunny will be wrong…") | Narrator | **0 — still burning, untouched** | pays off ep 5 | — |
| Blue's "first" payoff | Blue | **0 — seed watered only** (`a1_35`–`a1_39`, wrong twice, right about nothing) | multi-episode plant | — |
| "I just said that!" | Blue | 0 | capped 4 (ep 3) | — |
| "I am NOT small! I am travel-sized!" | Drip | 0 | fan-service only | — |
| "Are we there yet?" | Ray | 0 | spent (ep 3) | — |

*Sunny interrupts a scene that is not about him* (ep-2 pattern, no ceiling):
three firings — `a1_12`, `a1_56`, `a2_37` — every one of them true.

### `sameAs` chains — sources marked (aliases resolve BACKWARDS; the source is the earliest firing, decided here, at draft time)

| Chain | SOURCE (earliest firing) | Aliases, in order | Notes |
|---|---|---|---|
| "It will do." | **`co_17_pip`** | `a1_31_pip`, `a2_27_pip`, `a3_16_pip`, `a3_79_pip` | MiniMax, ONE paid recording, five firings. The audition must approve the source take before generation — re-rolling it later replaces five approved firings. |
| "It will not do." | `a3_37_pip` | — (deliberately NOT aliased) | The break. A separate recording is the point. |
| "That is also true." | **`a1_26_ray`** | `a2_39_ray`, `a3_57_ray` | One neutral take, three contexts (upset → upset → at peace); the context does the acting. |
| "You're welcome! HA! HA!" | **`a1_13_sunny`** | `a1_57_sunny`, `a2_38_sunny`, `a3_55_sunny`, `rc_06_sunny` | Kokoro (deterministic — the aliases state intent and lock the wording). Flat-identical by design; the escalation is placement, never the read. |
| "It is the highest grade she gives." | **`a2_29_narrator`** | `a3_80_narrator` | Kokoro; same reasoning. |
| Chant reprise | **`a3_65_drip`**, **`a3_66_puff`**, **`a3_67_ray`**, **`a3_68_pip`**, **`a3_69_sunny`** | `rc_07_drip`, `rc_08_puff`, `rc_09_ray`, `rc_10_pip`, `rc_11_sunny` | Five one-syllable clips, each reprised once, byte-identical. |

### The roll call — two firings

Series signature, shape fixed both times: cheerful naming → one flat
Narrator line (0.92) → unbothered, unseasoned button; nobody replies inside
the naming. **Firing 1 (greeting):** Scene 2, mid-air, built on the
dispersal picture the cold open already has — `co_07` / `co_08` / `co_09`
("Good crew."). **Firing 2 (goodbye):** Scene 29, the sprout row at dusk —
`rc_20` / `rc_21` ("Nobody was going anywhere.") / `rc_22` ("See you
tomorrow."). Names, both firings, same order (synthesis-fixed): **Pipsqueak,
Pipley, other Pip, Pippa, Pip the third.** The goodbye's picture (the
sprouted row) is planted in Scene 15 without naming, per the synthesis. The
two name lists are different sentences (greeting vs goodbye), so they are
two recordings by design — not a broken chain.

### The volcano stir — staging note

Scene 13, inside the rain wide, and it is the episode's ENTIRE volcano
budget (synthesis-ruled): as the rain sheet crosses the volcano's summit on
the measured horizon, **one thin curl of steam rises off the peak, holds
~60f (2s), thins, and is gone.** Physics-honest thermal tell — rain steaming
off a mountain that is warm now — and fully deniable. Wordless. Nobody
looks at it, points at it, names it, or stings it musically. The volcano is
established on the horizon in the FIRST wide of Scene 1 and stays
continuously visible in every wide thereafter (volcano rule); it is asleep
on the end card and promises nothing. Sunny's banked wake-claim and "That
is not me." are NOT spent.

### Cache-migration flags (do not re-buy approved takes)

- **`a2_13_drip` — REQUIRED:** identical text and fields to sky-blue's
  `a1_31_drip` ("Hi! It's me! I'm the weather!", `Lively_Girl`, `happy`,
  1.0). Cross-video `sameAs` does not exist, so this is a cache migration:
  copy `public/narration/sky-blue/a1_31_drip.mp3` to
  `public/narration/plants/a2_13_drip.mp3` and seed the plants cache entry
  with the same text hash BEFORE running the generator. Ep 3 keeps its own
  copy — this is a copy, not a `git mv`. The joke is that it is audibly the
  identical take, third episode running.
- **`a2_55_puff` — RECOMMENDED:** identical text and fields to wind's
  `a1_40_puff` ("You can't see me. But you can FEEL me.",
  `Exuberant_Girl`, `happy`, 1.0). Same procedure. Bonus: the canon "FEEL"
  capital inside a MiniMax sentence is a known engine risk on a fresh draw
  (the "AIR" defect signature); the ep-2 take is ear-approved and
  sidesteps it entirely. If the showrunner prefers a fresh draw, ear-check
  the capital first.

### Ensemble engines — the reply budget (protect these; cuts come from texture, never engines)

| Engine | Colliding wants | Scenes | Replies in this draft |
|---|---|---|---|
| Pip ↔ Sunny (central) | his claim on everything vs her refusal to clap | 5, 6, 10, 15, 23, 25–26 | ~11 |
| Pip ↔ Ray (the contractor) | her workaround vs his compulsory disclosures | 7, 9, 10, 21 | ~14 |
| Pip ↔ Drip (the size dispute) | "one water" vs THE WEATHER | 13, 14, 16 | ~9 |
| Pip ↔ Puff (the trade) | her intake vs his alarm-then-delight | 17–19 | ~8 |
| Ray ↔ Drip (credit allocation) | her whole-show claim vs his exact halves | 15, 20 | ~4 |
| Ray ↔ Blue (cameo) | first-claim vs the pedant's clock | 8 | 3 |
| Ensemble stall (multi-hander) | everyone vs the unsayable sentence | 22 | 5 in one scene |

### Laugh-gap self-map — CLAIMS ONLY

**The showrunner recomputes this from the generated manifest with real
timeline arithmetic before believing any number below** (ep-3 method rule:
a planning document's density self-score is a claim, not evidence; visual-
only business does not feed the laugh clock). Estimates assume ~2.8s/line
plus written gaps.

| Stretch | Est. window | Spoken laugh beats claimed | Est. worst gap |
|---|---|---|---|
| Cold open (Sc 1–4) | 0:00–1:35 | roll call + button; "Any step."; "It will do." + "took that as a yes" | ~30s (co_01–co_05, intro run) |
| Act 1 Sc 5–6 | 1:35–3:10 | "Except one."; "Speechless!"; "We will discuss that later."; HA!-HA! 1; "sourcing my light independently" | ~20s |
| Act 1 Sc 7 (moonlight) | 3:10–4:50 | "No commentary."; "That is also true."; "Sunny was winning."; "freelance"; stamp 2; "quiet light" | ~25s |
| Act 1 Sc 8–10 | 4:50–7:20 | Blue triple; "I live here."; "first to leave"; "not open for business"; "nobody is eating me"; puddle beat; "You sent my water away."; HA!-HA! 2; "It is exhausting." | ~28s |
| Act 2 Sc 11–14 | 7:20–9:50 | "Nobody leaves this hotel alone."; "Gorgeous penmanship"; "one water" run; "uphill waterslide"; stamp 3 + "highest grade" + "I accept" | ~30s (a2_21–a2_25 straw pedagogy, carried by Drip) |
| Act 2 Sc 15–17 | 9:50–11:40 | swerve 1; "different from saying it"; HA!-HA! 3; "contractually honest"; "I was delicious."; "Nobody eats dirt."; "where I keep my feet"; Puff entrance | ~22s |
| Act 3 Sc 18–19 | 11:40–13:10 | "guest that lives at the party"; "Moving on."; "eating me" yelp; "I have parts?"; "I traded with a plant!"; stamp 4 | ~20s |
| Act 3 Sc 20–21 | 13:10–14:50 | "Wood." / "I would have said wood."; "I am going to be a tree."; "One crumb."; "Look down."; "It is mostly him."; THE BREAK | ~32s (a3_27–a3_32, the cook + crumb — deliberate awe-then-laugh) |
| Act 3 Sc 22–23 | 14:50–16:40 | the triple swerve; "Forget I said that."; "Fine."; then **the admission build: a3_46–a3_53 is warm, not funny — est. 40–48s from "Fine." to "I know." — THE EPISODE'S WORST CLAIMED STRETCH, deliberate spine hold, ends on the biggest laugh** ("I know." + held HA!-HA! + aria + "That is also true."); "Do not make it weird." | **~45s (claimed; recompute)** |
| Act 3 Sc 24–26 | 16:40–18:10 | chant + "The."; "Nobody clapped."; "Sweetness is me, in a box."; "Enjoy your lunch!"; stamp 5 + "highest grade" re-fire | ~25s |
| Recap Sc 27–29 | 18:10–19:40 | "Mostly him."; HA!-HA! 5; "No dirt was eaten."; breath beat (warm, ~35s, mind-blower slot); goodbye roll call; "Send it here. I will grade it." | ~35s (the breath closer — precedented held-awe slot) |

Claimed cadence: a spoken kid-graded beat every ~20–28s; two stretches over
40s, both deliberate (the admission build; the breath closer). If the
manifest math says the admission build breaches 50s, the tuning knob is the
held-beat frame counts in Scene 23, not new jokes inside it.

### Ear-check list (in order)

1. **Pip's voice itself** — `PIP_MINIMAX_VOICE` is a placeholder; the
   audition targets are in the cast table. `co_17_pip` (the stamp SOURCE)
   is the single most load-bearing clip in the episode: five firings hang
   off one take.
2. **The five chant syllables** (`a3_65`–`a3_69`) — one-syllable MiniMax
   clips are the episode's highest TTS risk ("Pho" may read as a word,
   "The" may read "thee" instead of "thuh"). Fallbacks pre-written in
   `narration.mjs` (phonetic respellings + the Narrator-led chant).
3. **"That is also true."** (`a1_26_ray`) against all three contexts.
4. **Pip's roll-call runs** (`co_07`, `rc_20`) — five names at 0.92; do
   they separate? Buttons must not be sold.
5. **`rc_04_ray`** ("Light. Also me. Mostly him.") — three fragments,
   deadpan; risk of a choppy read.
6. **`a3_37_pip`** ("It will not do.") — must sound like the same voice
   breaking pattern, not a different mood.
7. The two migrated clips in context (`a2_13_drip`, `a2_55_puff`) — cache
   migration means they were approved in ANOTHER episode's mix; listen once
   in this one.
8. Sunny's `a3_54` ("I know.") at 0.95 — the quiet must come from words
   and speed alone.

### Deviations from the synthesis, flagged

1. **"Annoyingly, that is completely true."** (`a3_75`) — the synthesis
   wrote an ellipsis; TTS rules forbid it. RESOLVED by the showrunner's
   edit pass: split clip, `a3_75` "Annoyingly." / 24f held beat /
   `a3_75b` "That is completely true."
2. **Ray's oven seed** (`a1_46`) — the synthesis allows a seed of the oven
   concept before Scene 23 at the writer's call. The seed here is "light
   is used, the moment it lands" plus "nobody is eating me" (which also
   collects ep-3's `rc_21` "Is it me??"); the word "oven" is spoken nowhere
   before `a3_52`.
3. **"It is mostly him."** (`a3_36`) is given to Ray — a fifth firing of
   the series credit-allocation device (ep-3 closed it at four). The bible
   lists the device as "available as a series device," not ceilinged;
   flagging the count anyway.
4. **The Narrator's swerve** ("Who makes the wind that stirs him? Moving
   on.", `a3_06`) rewords B's trailing-off construction — a dangling "made
   by. Well." is a TTS artifact risk; the self-interruption is carried by
   "Moving on." instead.
5. **Scene-2 roll-call button is "Good crew."** — the synthesis fixes the
   goodbye button verbatim but leaves the greeting button open; "Good
   crew." is the site-manager register doing the unbothered-button job.
6. **`rc_24_pip`** ("Send it here. I will grade it.") — a new final beat
   after the end-card read, not in either treatment. It is her register
   aimed at ep-5's question, promises nothing, and gives the episode a
   character button (ep-3 precedent: Ray's "Is it me??"). Cut clean if
   unwanted.

**Sound-word spellings:** none of consequence — no WHOOSH, no stretched
vowels anywhere (nothing on kokoro needs one; MiniMax forbids them). The
only capitals inside MiniMax clip text are the canon "FEEL" in Puff's
migrated catch-phrase; every other MiniMax line is sentence-case, with
shouts drawn as caps in bubbles only (`a1_35` "I am FIRST!", `a1_54`
"AWAY", `a3_15` "I TRADED with a PLANT!").
