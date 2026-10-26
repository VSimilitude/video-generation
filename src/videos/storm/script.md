# Boom and the One, Two, Three

**Series:** Little Big World (kids' educational), episode six
**Topic:** thunder and lightning — why thunder is always "late" (it is not; it is far)
**Audience:** six-year-olds — and the grown-up in the room
**Target:** the beats, not a number (runtime rule). Expect roughly fifteen to
eighteen minutes — about a minute of it is pure counting, on purpose.
**Shape:** cold open, three acts, recap. Twenty-six scenes. One hundred and
ninety-eight spoken lines plus fifty-two count firings (two hundred and fifty
line keys in all; one hundred and ninety-two recordings, of which ten are the
count numbers and two are cache-migrated; fifty-eight `sameAs` aliases, of
which forty-two are counts).

> **Ruling of record.** This script is the synthesis (`ep6-synthesis.md`)
> executed: Treatment B's act architecture (the count is the spine; the hero
> is counted before he has a face) with Treatment A's hotel grafted into act
> one wholesale. Where this file and either treatment disagree, the synthesis
> already ruled and this file follows it; where the synthesis is silent, B
> rules structure and A rules the hotel texture, and every invention is in
> the deviations ledger. Title per the synthesis. Hero name Boom, per the
> synthesis. Ep-7 tease: the moon, per the synthesis (TOP-logged for Mike).

The companion file `narration.mjs` will hold the exact text sent to the
text-to-speech model. Every line below is written to be quoted verbatim; if a
line changes, it changes in both files. No spoken line in this episode
contains a digit, an ellipsis, an em-dash, or a pause marker — numbers are
words, and every silence is a held beat between clips.

## Cast and voices

| Character | Engine | Voice | Speed | Who they are |
|---|---|---|---|---|
| **Narrator** | kokoro | `af_heart` | 1.0 | Warm storyteller, returning. House flat 0.92, deadpan floor 0.9. Owns the count (ten number clips on a thirty-frame grid), both roll-call middles, the flipped Blue button, the lesson said once, and "Different show. Same ___." Voice only — no body, ever. **She never says "Present." herself.** |
| **Boom** | minimax | **NEW voice — `BOOM_MINIMAX_VOICE`** (PROVISIONAL, auditioned by measurement first — must clear Rock's `Deep_Voice_Man` and the volcano's `Elegant_Man` −6 in timbre AND pace — Mike's ear second) | **1.0 on every line, forever** — sound has one speed, and so does he; the arc is carried by what he is proud of, never by tempo | Our hero. The thunder — the sound of the lightning, he/him, born in the lobby of the Cloud Hotel in the same instant as Flash, out of the same crackle. Enormous, soft-edged, the loudest thing in the sky and the gentlest character in the episode. Register: warm run-on sentences, commas not full stops, a very large friendly man who set off promptly and would like you to know it. Wants to be ON TIME. Has theories about why everyone else is early. Never sorry, never a verdict, never a pedant. Cast emotion `happy` on every line; **exactly two `auto` lines, both cited** — the break `a2_59` ("Present.") and the turn `a3_27` ("Count me."). **No caps in any Boom line text** — his loud is the mix and the bubble. **Audition trio:** `a1_48` (the chain source "Present!"), `a2_61` (his longest proud run-on, after the break), `a3_27` ("Count me." — must land warm, not defeated). |
| **Flash** | — | **NONE, EVER** | — | The lightning, she/her — the series' fourth silent constant. Blue-white zig, same body every time (Violet's same-blob law), on screen **≤6 frames per appearance**, gone before anyone finishes a sentence. Strikes the sea far out or goes across the sky; the overhead bolt goes SIDEWAYS; nothing on screen is ever struck. Introduced by name once (`a1_46`) while the LIGHTNING card holds. Boom addresses her six times; she replies **zero** times — the zero is the physics. |
| **Cloudia** | minimax | `Abbess` | 1.0 | Second lead (thirty lines, every one hotel management, every one mechanism). "darling" on **every composed line**; **ONE break** (`a1_45`, "Somebody has just left through the wall!" — no darling, bubble caps, clip lowercase), back one line later, strained. Owns the MYTH bust. Her ep-1 canon "Darling. There are no stairs." (`a1_03`) and "I love my guests. I hate gravity." (`a3_02`) re-fire **verbatim** as fresh Abbess recordings — quotes of her own canon, not chains (ep-1 Cloudia was kokoro; cross-engine migration is impossible). Default `auto`; no seasoning anywhere. |
| **Sunny** | kokoro | `am_puck` | 1.0 | The Sun, in his new steady state: PRECISION. Every claim individually true; the Narrator checks each one. His heat built the storm (true, and he says so); hidden behind the tower from the moment it goes vertical (Scene 5) until the storm passes (Scene 22), and loud about it. Kokoro means **no `emotion` field ever, no pause markers ever, no stretched vowels**; caps are legal and read as emphasis. Greeting+brag pair fired (six-for-six). "You're welcome! HA! HA!" ×4 (source `co_07` + three aliases; ceiling 8). |
| **Drip** | minimax | `Lively_Girl` | 1.0 | Returning (ep-1 hero). `emotion: "happy"` on every line (locked casting — "throughout"). Standing entrance, **fifth identical firing, cache-migrated** (`a1_09`). Rides the lift to the penthouse and FREEZES — for once in her life, big. Both roll calls are hers. The travel-sized variant is IN once (`a3_07`, CUTTABLE). |
| **Puff** | minimax | `Exuberant_Girl` | 1.0 | Returning (ep-2 hero). Default `auto`, zero seasoned lines. Two honest jobs: the LIFT (the updraft — "Going up." chain, source `a1_06` + two aliases) and the GUST FRONT (the break "Going down." `a2_02`, then his catch-phrase **exactly once, cache-migrated**, `a2_03`, as the cold wind arriving at the kid's window). "Different show" skipped — he cannot be pointed at. |
| **Blue** | minimax | `Decent_Boy` | 1.05 | One continuous window scene, three lines, `happy` (locked casting), **4f approach gap** (identity), ricochet law, apologises to things he hits. **THE BANKED ANTI-SUNNY PAYOFF FIRES** (`a2_21`): he is light, the flash is light, he arrives with her and is RIGHT for the first time in four episodes. Narrator button FLIPPED (`a2_26`). The series' second stunned beat, **90f**. "I just said that!" (capped) untouched. Healthy take band 0.31–0.36 s/word. |
| **The volcano** | minimax | `Elegant_Man`, **pitch −6** | 0.9 | AWAKE on the horizon with Ember's island beside him in every coastal wide, summit lit — the one steady light on the dark horizon in act three. **ONE line, CUTTABLE** (`a2_63`, at the overhead CRACK — the politest reaction in the world to a louder-than-him noise). `auto` forever, **48f approach gap**, no caps, no pause markers, bubble from the MOUTH, nobody replies (Boom beams). |
| **Violet** | — | — | — | NO VOICE, NOT EVER. One silent garnish firing (Scene 12): at the far frame edge, also with the flash, also first, noticed by nobody. Same body, amplitude blur. |
| **The kid** | — | silent, always | — | Silhouette. Sixth canon episode running. In the garden for the heavy morning; **at the WINDOW from the moment the sky darkens (Scene 2) to the end card**; counts on fingers with the Narrator — the first time in six shows the kid DOES the thing the audience can copy. Ten fingers is the kid's ruler; running out of them is act three's joke. |
| **The hail guests** | — | silent | — | Crowd-with-faces rule: the penthouse crowd, then the lawn. Roll-call bodies ×2. Stony is the same body both firings — the big one, the most trips up and down the tower. Bubbles only, if any. |

**Two engines.** The Narrator and Sunny stay on kokoro — free, local,
re-synthesized the moment a line is reworded, and deterministic, which is why
the ten number clips are a metronome and not a gamble. Everybody else with a
body and a line is MiniMax speech-2.8-hd (via Replicate). There are **no
pause markers in this episode** — every silence is a held beat between lines,
in `Video.tsx` — and emotion is seasoning: Boom, Drip and Blue carry locked
cast `happy`; Cloudia, Puff and the volcano are `auto`; the episode's only
departures from a cast emotion are Boom's two cited `auto` lines (`a2_59`,
`a3_27`). Nothing else in the cast carries a seasoned field. **All MiniMax
line text is lowercase inside sentences** — caps live in bubbles; the one
whole-shout one-word line ("Present!") is legal as a whole shout. The only
capital inside MiniMax clip text in the whole episode is the canon "FEEL" in
Puff's migrated catch-phrase — which is precisely why it is migrated, never
freshly drawn.

## The Big Words

| Word | Act | Line keys | Treatment |
|---|---|---|---|
| **STATIC** | One | `a1_33` | `WordCard`, in the tower cross-section, with Cloudia standing in it (her hair up). |
| **LIGHTNING** | One | `a1_46` | `WordCard`, over the white of the first flash — the card outlasts her; the Narrator names Flash while it holds. |
| **THUNDER** | Two | `a2_74` | `WordCard`, fired when he is finally UNDERSTOOD (after the MYTH), never at his first arrival — more than a minute after LIGHTNING. |

Rules are not words; they get **stamps**: **LIGHT IS FAST. SOUND IS SLOW.**
(`a2_38`, act two — the lesson said once, plainly, world rule 16) and
**THREE COUNTS = ONE KILOMETRE.** (`a3_26`, act three — the turn). The red
**MYTH stamp** (house device: thuds on, cracks, silence, "Big myth.
Busted.") reads **CLOUDS DO NOT BUMP.** (`a2_68`–`a2_69`). The optional
second MYTH ("same place twice") is OUT — one clean stamp.

## Line-key convention

`<act>_<number>_<speaker>`, in strict playback order, matching
`narration.mjs` exactly. Act prefixes: `co` cold open, `a1` the hotel goes
up, `a2` the count comes down, `a3` the count goes up, `rc` recap. The ten
count numbers are their own line keys — **"One." through "Nine." are
`co_15`–`co_23`** (the cold open is their earliest firing) and **"Ten." is
`a3_60`** (its earliest firing is Scene 23) — and every other count in the
episode is a `sameAs` alias of one of those ten. Aliases always state which
number they are.

## How to read the held beats

Same contract as episodes two through five. A stage direction that reads

> **HELD BEAT — 60f (2.0s) after `a2_59_boom`.**

means: that line's `gapFrames` in `Video.tsx` is **60**, the picture is alone
on screen, and **nothing** — no line, no entrance, no emotion change — starts
inside it. Thirty frames is one second. These numbers are the script's;
raising one is a note, lowering one is a change to the joke. Two identity
gaps are declared once here instead of per line: **the volcano's one line
takes a 48f approach gap** (the mountain deciding to move) and **every Blue
line takes a 4f approach gap** — both are the character, never escalated.
**Boom's arrival gap is NOT an identity gap.** It is the count, and it
changes with distance — nine, six, three, two, one, nothing, three, six,
nine, and finally longer than the kid has fingers. The script says so out
loud (`a2_40`). **The count grid is a METRONOME, not a silence:** each
number clip plus its gap totals exactly **30 frames**, so three counts on
screen are genuinely three seconds and the ruler is honest. That is a
production gate (see the count ledger), not a taste call. Held beats stay
empty where they are the spine — the counts, Blue's stunned beat, the break,
the turn, ten-and-nothing, the awe — and ensemble business is allowed
everywhere else (ep-3 retro rule). **No emotion lead on held-beat scenes**
(cut the staging kit's 8-frame `useEmotion` lead to 0 wherever a HELD BEAT
direction appears).

---

# COLD OPEN

*Roughly two and a half minutes. The hottest morning of the series, a hotel
that is bored of drizzle, a window, and nine seconds counted on a kid's
fingers before the hero has a face.*

---

### Scene 1 — The heaviest morning
**On stage:** Narrator (voice only), the kid (silhouette, silent), Sunny,
Cloudia (the hotel, small and grey, far out)
**Visual:** The coastal garden, the series' classic wide: the sea, the
volcano AWAKE on the measured horizon with his summit glowing gently in
daylight, Ember's island beside him (a kid will check — it is there). Heat
shimmer off the flagstones. The kid lies on the grass with bare feet in the
air, too hot to move. Sunny up, enormous.
**Lines:** `co_01_narrator`, `co_02_narrator`, `co_03_sunny`, `co_04_sunny`,
`co_05_sunny`, `co_06_narrator`, `co_07_sunny`, `co_08_narrator`,
`co_09_narrator`, `co_10_cloudia`, `co_11_cloudia`, `co_12_narrator`

> **NARRATOR:** This is a story about a noise. The biggest noise in the sky. Everybody says it is late. It has never been late in its life.
> **NARRATOR:** Here is a garden, on the hottest morning of the summer. Here is a kid, with bare feet in the air. Here is the sea, and the mountain, and the brand new island he made last show.

The horizon obligation named on screen in the first wide: awake, lit,
island present.

> **SUNNY:** GOOD MORNING, EVERYBODY!
> **SUNNY:** I invented mornings!

Series-constant greeting+brag pair, **six-for-six**, fired intact.

> **SUNNY:** Feel that ground? Every bit of that warm is me. Every bit.

TRUE (his heat on the ground is what builds today's storm). Bubble: EVERY
BIT OF THAT WARM IS ME.

> **NARRATOR:** It is. Hold on to that thought. By tonight, that warm will have built the biggest thing in the sky, and he is going to want it on the record.

0.92. The kids are told he will be right before he is.

> **SUNNY:** You're welcome! HA! HA!

**"You're welcome! HA! HA!" — SOURCE, FIRING 1 of 4** (ceiling 8, hard; the
phrase is its own standalone clip so the aliases stay byte-identical;
firings 2–4 are `sameAs` aliases at `a1_22`, `a3_06`, `rc_10`).

> **NARRATOR:** And out over the sea, somebody you have met before drifted in, small and grey, the way she has in every show she has been in.

A small flat grey cloud over the water — the Cloud Hotel exactly as it has
always been: drizzle-grey, full of drops hugging specks.

> **NARRATOR:** Different show. Same hotel.

**"Different show. Same ___." — the episode's ONE firing** ("Same hotel.",
fresh blank, 0.92 flat; series blanks now: sun, sky, rain, air, beam,
weather, rock, first, hotel). Drip's entrance carries itself; Puff cannot be
pointed at; "Same darling." and "Same guest." REJECTED by the synthesis.

> **CLOUDIA:** Six shows, darling. Six. Not one gala. Drizzle. I am known for drizzle.

Composed, bored to the bone. Bubble: SIX SHOWS. NOT ONE GALA.

> **CLOUDIA:** I was born for a gala, darling.

Her want, planted. Bubble: BORN FOR A GALA, DARLING.

> **NARRATOR:** Today she gets one. She does not know that yet.

0.92.

**Pedagogy:** The ground is hot and the heat is Sunny's — the first true
claim, checked. Nothing else yet; the cold open is promises.

---

### Scene 2 — The window rule, and the first count
**On stage:** Narrator, the kid (silhouette, silent)
**Visual:** Afternoon. The light has gone heavy and yellow. Out past the
volcano, over the sea, a cloud has STOOD UP — a tower, flat on top, far
away. The kid goes indoors and takes position at the window: mug, blanket,
cosy — this is a show, not a danger. The whole bay is framed in the glass;
the volcano's lit summit on the horizon behind the tower. The kid's hand
rests on the sill, fingers ready. **The kid is indoors from this frame to
the end card.** Sunny is not in this frame (the tower is between us).
**Lines:** `co_13_narrator`, `co_14_narrator`, `co_15_narrator`,
`co_16_narrator`, `co_17_narrator`, `co_18_narrator`, `co_19_narrator`,
`co_20_narrator`, `co_21_narrator`, `co_22_narrator`, `co_23_narrator`,
`co_24_narrator`, `co_25_narrator`, `co_26_narrator`, `co_27_narrator`

> **NARRATOR:** By the afternoon the light had gone heavy and yellow. And out past the mountain, a cloud stood up. A tower, with a flat top. The kid went indoors.
> **NARRATOR:** Storms are for watching from a window. That is the rule.

The single safety sentence, plain, once. Never fear.

**FLASH** — far out at sea, past the volcano: a blue-white zig, ≤6 frames,
the sky whites, gone. (She is not named yet; she is named at `a1_46`.) The
kid's fingers come up, out of habit, and the Narrator counts with them. A
soft grey ring is visible crossing the bay under the count — sound made
visible; the count is a chase, never a wait.

> **NARRATOR:** One.
> **NARRATOR:** Two.
> **NARRATOR:** Three.
> **NARRATOR:** Four.
> **NARRATOR:** Five.
> **NARRATOR:** Six.
> **NARRATOR:** Seven.
> **NARRATOR:** Eight.
> **NARRATOR:** Nine.

**THE COUNT — nine of the ten SOURCE recordings** (`co_15`–`co_23`; "Ten."
is `a3_60`). Kokoro, one number per clip, **each number clip + its gap =
30 frames exactly** (the production gate; see the count ledger). Nine
fingers up. Then — a low, far RUMBLE (sound design only; no "Present!" —
he has not been introduced, and at nine counts he is a rumble anyway).

> **NARRATOR:** There he is.

**HELD BEAT — 30f (1.0s) after `co_24_narrator`.** The first count lands
alone. (This clip is re-fired byte-identically at the act-one cut, `a1_59`
— the same seconds, the same sentence.)

> **NARRATOR:** Last time, somebody asked why thunder is always late.

**HELD BEAT — 30f (1.0s) after `co_25_narrator`.** The ep-5 card may ghost
briefly over the sky — print only.

> **NARRATOR:** Everyone says he is. Even the card said so. Let's go and ask him. He is up there.

0.92. The camera lifts toward the tower. **TITLE CARD** over the
thunderhead: *Boom and the One, Two, Three.*

> **NARRATOR:** This is the story of the noise that was never late.

**Pedagogy:** The count exists before the hero does — the series' deadpan
room in its purest form, the kid's habit before it is anyone's roll call.
If the nine-count proves long at manifest time, the fallback is SIX (B's
own fallback; the act-one cut then joins at "Four. Five. Six.").

---

# ACT ONE — THE HOTEL GOES UP

*Cloudia's gala: a lift at a hotel with no stairs, a penthouse in the
freezer, a crackle in the walls, a guest who leaves through the wall — and
the noise that is born beside her, exactly on time.*

---

### Scene 3 — Air in a hurry: a lift at a hotel with no stairs
**On stage:** Narrator, Cloudia, Puff (entrance), Sunny; the drops (silent)
**Visual:** Back to the small grey hotel at lunchtime — the lobby, flat,
grey, full of drops hugging specks. Heat shimmer rises off the sea under
it. Then the FLOOR starts to rise: Puff arrives from below, an invisible
lift at a hotel that never had one, and the first guests go up. Sunny is
still visible here — the hotel is not yet tall enough to hide him.
**Lines:** `a1_01_narrator`, `a1_02_narrator`, `a1_03_cloudia`, `a1_04_puff`,
`a1_05_cloudia`, `a1_06_puff`, `a1_07_sunny`, `a1_08_narrator`

> **NARRATOR:** That tower was a small grey hotel this morning. Here is how it got up there.

The glue line — act one is the afternoon REWOUND, so the act-one cut
(Scene 10) can rejoin the cold open's nine seconds. Deviations ledger.

> **NARRATOR:** The ground was hot. The air sitting on the ground got hot. And hot air does the thing it learned in show two. It goes up. Fast.

Cross-episode rhyme (ep-2 law redeployed), 0.92.

> **CLOUDIA:** Darling. There are no stairs.

**Ep-1 canon, VERBATIM, as a fresh Abbess recording** (a quote, not a
chain) — said to the first guest looking for the penthouse.

> **PUFF:** There is now a lift.

**HELD BEAT — 30f (1.0s) after `a1_04_puff`.** Cloudia takes this in.

> **CLOUDIA:** Darling.

A composed one-word line — the word holds, which is the joke.

> **PUFF:** Going up.

**"Going up." — CHAIN SOURCE, FIRING 1 of 3** (aliases `a1_12`, `a1_37`;
the break is "Going down." `a2_02`, fresh recording, plot-causal). Guests
rise. The lift IS the updraft; Puff is the chirpiest lift operator in the
sky.

> **SUNNY:** The hot is me. The hurry is his.

Precision — true in both halves. Bubble: THE HOT IS ME.

> **NARRATOR:** Correct. Both halves.

**Pedagogy (1):** hot ground → warm air in a hurry UP — said by the
character it belongs to, and carried by the character who IS it.

---

### Scene 4 — A guest checks in
**On stage:** Drip (entrance), Cloudia, Puff, Narrator
**Visual:** Drip rides up into the lobby on the lift — standing entrance,
arms wide.
**Lines:** `a1_09_drip`, `a1_10_cloudia`, `a1_11_drip`, `a1_12_puff`,
`a1_13_narrator`

> **DRIP:** Hi! It's me! I'm the weather!

**CACHE MIGRATION — Drip's standing entrance, FIFTH identical firing** (the
audibly identical take IS the joke; migration details in the table). No
"Different show" firing for her — her entrance carries itself (ep-5
ruling).

> **CLOUDIA:** You are a guest, darling. The weather is the management.

A manager who has heard this entrance before, filing it. Bubble: THE
WEATHER IS THE MANAGEMENT.

> **DRIP:** Then I would like the top floor.

Her want (to be taken as big), planted on "top floor".

> **PUFF:** Going up.

`sameAs: a1_06_puff` — **firing 2 of 3.**

> **NARRATOR:** The lift did not have a top floor yet. It made one.

---

### Scene 5 — The hotel goes vertical
**On stage:** Narrator, Cloudia, Sunny (blocked — his last visible frame
is the tower passing him); the drops (silent)
**Visual:** The tower CROSS-SECTION, with characters in it (diagram-sag
rule): the lift runs up the middle, floors stack as fast as guests arrive —
ten, twenty, a tower — until it wears a flat roof. The tower passes Sunny on
the way up and BLOCKS him; from here to Scene 22 he is a voice from behind
a cloud, with a glow at its edge.
**Lines:** `a1_14_narrator`, `a1_15_cloudia`, `a1_16_cloudia`,
`a1_17_narrator`, `a1_18_sunny`, `a1_19_narrator`, `a1_20_sunny`,
`a1_21_narrator`, `a1_22_sunny`, `a1_23_cloudia`, `a1_24_cloudia`

> **NARRATOR:** Floors stacked on floors. Ten. Twenty. More. The hotel went up faster than a hotel has any business going, until it wore a flat roof.
> **CLOUDIA:** I did not order a flat roof, darling.

**HELD BEAT — 30f (1.0s) after `a1_15_cloudia`.** She looks up at it.

> **CLOUDIA:** I shall keep it, darling.

(A's line with "darling" restored — every composed line carries the word.
Deviations ledger.)

> **NARRATOR:** Very tall clouds get a flat top. That is the shape of a thunderstorm. You can see one coming from a long way off.

The anvil's SHAPE named, its reason not (brief).

> **SUNNY:** Hey. HEY. Who put a hotel in front of me?

From behind the tower — *Sunny interrupts a scene not about him*, firing 1
(true: a hotel is in front of him). Bubble: A HOTEL? IN FRONT OF ME?

> **NARRATOR:** Cloudia. With your help.
> **SUNNY:** Then the hot is mine! And the up is mine! The up runs on the hot!

Instantly delighted, precise, every clause TRUE. Bubble: THE UP RUNS ON THE
HOT!

> **NARRATOR:** The hot is his. The up is his as well. The hotel is hers.

The check, 0.92.

> **SUNNY:** You're welcome! HA! HA!

**Firing 2 of 4** — `sameAs: co_07_sunny`.

> **CLOUDIA:** We have never had an up, darling.
> **CLOUDIA:** Penthouse. We have a penthouse. Darling, I could weep.

Her rapture at owning an up — the gala arriving. Bubble: WE HAVE A
PENTHOUSE, DARLING.

**Pedagogy (2):** the hotel goes vertical — a tower with a flat top; Sunny
allocates exactly his part through a wall of cloud.

---

### Scene 6 — The penthouse is a freezer; roll call, firing 1
**On stage:** Drip, Cloudia, Narrator; the hail guests (silent)
**Visual:** The top of the tower. Drip arrives at the penthouse and FREEZES
mid-sentence — she is ICE, and for the first time in her life she is BIG.
The top floor is a crowd of near-identical frozen guests bumping gently in
the updraft — the picture the scene already has. Stony, the big one, at the
back.
**Lines:** `a1_25_cloudia`, `a1_26_drip`, `a1_27_drip`, `a1_28_drip`,
`a1_29_narrator`, `a1_30_drip`

> **CLOUDIA:** The penthouse is above the freezing line, darling. I did not put it there. The lift did.

Bubble: THE PENTHOUSE IS A FREEZER, DARLING.

> **DRIP:** I am ice. Look at me. I have never been this big.

Her want, granted by physics. Bubble: I HAVE NEVER BEEN THIS BIG.

**ROLL CALL — FIRING 1 (greeting).** Series signature, fixed shape:
cheerful naming → one flat Narrator line → unbothered, unseasoned button.
Nobody replies inside the naming. Crowd fresh (used: raindrops, puffs,
colours/copies, seeds, islands). Names, same order both firings: **Hail,
Hailey, other Hail, Hail the third, Stony.**

> **DRIP:** Hi, Hail! Hi, Hailey! Hi, other Hail! Hi, Hail the third!

**HELD BEAT — 24f (0.8s) after `a1_27_drip`** — the beat before the big
one; the naming run is split into two clips so the timeline makes the pause
(no pause markers). Her locked `happy` IS the roll-call register.

> **DRIP:** Hi, Stony.
> **NARRATOR:** Every guest on the top floor is called Hail. They keep rubbing past each other. It builds up.

0.92 flat — the roll-call middle, with the STATIC mechanism INSIDE it, two
scenes before the card makes it a sentence. ("Rubbing past" rather than
"bumping", on purpose — the MYTH stamp will say clouds do not bump, and the
word belongs to it. Deviations ledger.)

**HELD BEAT — 36f (1.2s) after `a1_29_narrator`.**

> **DRIP:** I am one of them now.

Button — flat, nothing added (her cast `happy` is unchanged; the button is
the stillness in front of it).

**Pedagogy (2b, 3 plant):** the penthouse is above the freezing line;
guests up there are ice; the rubbing that builds the crackle is said as a
roll call before it is said as physics.

---

### Scene 7 — The crackle (Big Word: STATIC)
**On stage:** Cloudia, Narrator, Sunny (behind the tower); the hail guests
(silent)
**Visual:** Cloudia's cloud-wisps rise off her head and STAND UP. Then the
cross-section again, with Cloudia walking it like a manager reading a fault
report: little sparks in the walls wherever two icy guests rub past; the top
floor glowing one way, the lobby the other, the lift between them full of
crackle. **The STATIC card fires here, a full scene before LIGHTNING** —
the showrunner's edit-pass reorder (2026-10-26): the up-down-up scene and
the gala exchange now sit between this card and the flash, so the two
Big Word cards are ~a minute apart (manifest: 53.3s to the LIGHTNING
card's line start, plus card dwell; was 30.3s with the scenes the other way
round).
**Lines:** `a1_31_cloudia`, `a1_32_narrator`, `a1_33_narrator`,
`a1_34_cloudia`, `a1_35_sunny`, `a1_36_narrator`

> **CLOUDIA:** Darling, why is my hair doing that.

Full stop, not a question mark — composed to the end. Bubble: WHY IS MY
HAIR DOING THAT.

> **NARRATOR:** Every time two icy guests rub past each other, a little crackle rubs off. You have made this crackle yourself. Rub a balloon on your hair, in the dark, and pull it away. That tiny snap is this. That is lightning, tiny.

**The kid-check, stated plainly once** (balloon, hair, dark). No signs, no
electrons.

> **NARRATOR:** It has a name. Static.

**Big Word card: STATIC.**

> **CLOUDIA:** The top floor has gone one way, darling. The lobby has gone the other way. And the lift is full of crackle.

Honest charge separation at kid level — top one kind, basement the other,
no positive/negative. Bubble: THE LIFT IS FULL OF CRACKLE.

> **SUNNY:** The crackle is not mine. I would like that written down. I did the hot. The guests did the crackle.

*Sunny interrupts a scene not about him*, firing 2 — disclaiming, for the
record, with precision (the new steady state demonstrated in reverse;
TRUE: the collisions did it). Bubble: THE CRACKLE IS NOT MINE.

> **NARRATOR:** Written down.

0.92.

**Pedagogy (3):** icy guests rubbing → crackle; same as a balloon on hair;
two kinds, top and bottom. **STATIC.**

---

### Scene 8 — Up, down, up — and the gala
**On stage:** Puff, Drip, Cloudia, Narrator; the hail guests (silent)
**Visual:** Gravity wins a round: Drip drops a floor — Puff catches her and
she rides back up, and freezes another coat. Stony goes up and down in the
background more than anybody. The crackle in the walls keeps building under
all of it (sparks wherever guests pass); by the last line the whole tower
is humming.
**Lines:** `a1_37_puff`, `a1_38_drip`, `a1_39_cloudia`, `a1_40_narrator`,
`a1_41_cloudia`, `a1_42_drip`, `a1_43_cloudia`, `a1_44_cloudia`

> **PUFF:** Going up.

`sameAs: a1_06_puff` — **firing 3 of 3, final.** Each "Going up." is a
coat of ice.

> **DRIP:** I am bigger again!
> **CLOUDIA:** You have been up and down four times, darling. You are enormous.

Bubble: YOU ARE ENORMOUS, DARLING.

> **NARRATOR:** That is how hail grows. Up to the freezer, a coat of ice. Down. Up again, another coat. Stony has been up and down more than anybody.
> **CLOUDIA:** Up, darling. Down. Up. That is a hotel.

Surveying her building with pride. Bubble: UP. DOWN. UP. THAT IS A HOTEL.

> **DRIP:** Is this the gala?

From the penthouse, frozen, thrilled.

> **CLOUDIA:** Darling. I believe it is.

(A's house-phone exchange, grafted here. Deviations ledger.)

> **CLOUDIA:** The hotel cannot hold it, darling.

Composed, the word still holding under maximum stress — the act's last
composed line before the flash.

**Pedagogy (2b):** hail = drops carried up and down the tower, freezing
layer on layer — the lift chain IS the layering; and the crackle keeps
building until the hotel cannot hold it.

---

### Scene 9 — Somebody leaves through the wall (Big Word: LIGHTNING); Boom is born
**On stage:** Flash (first appearance, ≤6 frames), Cloudia, Narrator, Boom
(FIRST APPEARANCE)
**Visual:** The crackle JUMPS: a channel from the hotel down to the sea far
out — Flash, blue-white, same body, ≤6 frames, the whole frame whites, gone.
Nothing is hit but water. Then — same instant, same lobby, out of the same
crackle — something enormous, soft, round, grey-violet, with two offset
rings, is standing where the crackle was, delighted. **Boom's body is the
physics:** near the cloud he is small, tight and sharp; after a long count
he arrives huge and soft (sound spreads). The motion-trail law holds —
always two offset rings, never one.
**Lines:** `a1_45_cloudia`, `a1_46_narrator`, `a1_47_narrator`,
`a1_48_boom`, `a1_49_cloudia`, `a1_50_boom`, `a1_51_cloudia`, `a1_52_boom`,
`a1_53_boom`, `a1_54_boom`, `a1_55_cloudia`

> **CLOUDIA:** Somebody has just left through the wall!

**CLOUDIA'S BREAK — the ONE line without "darling"** (fresh wording per the
synthesis; ep 1's "capacity" is spent and does not appear in this episode).
Bubble in caps: SOMEBODY LEFT THROUGH THE WALL! — clip lowercase.

**Big Word card: LIGHTNING** (over the white; the card outlasts her by a
long way — she was on screen for six frames).

> **NARRATOR:** That was Flash. She is the lightning. She does not stay. She does not wait. She has never finished a sentence in her life, because she has never had time to start one.

Flash introduced by name, once, while the card holds.

> **NARRATOR:** And in the same instant, in the same lobby, out of the same crackle, there was somebody else.
> **BOOM:** Present!

**"Present!" — CHAIN SOURCE, FIRING 1 of 10** (`sameAs` aliases at `a2_12`,
`a2_25`, `a2_52`, `a2_57`, `a3_11`, `a3_21`, `a3_38`, `a3_64`; the break is
`a2_59` "Present.", fresh). **AUDITION LINE 1** — the one recording that
fires ten times; approve it before anything downstream is built. Fired
here at ZERO distance: inside the hotel he is exactly on time, and nobody
has told him yet that anywhere else he won't be. The lesson is played as
SOUND a full act before it is said in words. Whole-shout one-word MiniMax
line — legal. 1.0, `happy`.

> **CLOUDIA:** Darling. Who is making that noise?

Composure RETURNING one line after the break — because a noise is a thing
a manager can handle. Strained. Bubble: WHO IS MAKING THAT NOISE?

> **BOOM:** That is me. I am Boom. I am the noise. I was born about one second ago, right here, in your lobby, at the same time as her.

The first run-on. Bubble: I AM BOOM. I AM THE NOISE.

> **CLOUDIA:** She did not sign the register, darling. She did not even take a towel.

Bubble: SHE DID NOT SIGN THE REGISTER.

> **BOOM:** Where did she go? She was right here. We left at the same time.

**Boom ↔ Flash, address 1 of 6 — unanswered.** He looks for her through
the hole in the wall. **HELD BEAT — 45f (1.5s) after `a1_52_boom`.** The
first unanswered address; the zero is the physics.

> **BOOM:** She is quick.
> **BOOM:** I have to go. I left when she left. I always leave when she leaves. Lovely hotel. Bye.

He walks out through the wall she left through, at his one pace. Bubble:
I ALWAYS LEAVE WHEN SHE LEAVES.

> **CLOUDIA:** He did not check in, darling.

To an empty lobby. The hotel manager's paperwork instinct surviving a
thunderclap.

**Pedagogy (4, 5):** LIGHTNING — the crackle jumps; a channel to the sea;
over in a blink; nothing harmed. THUNDER is born in the same instant, in
the same place, out of the same crackle — and at zero distance he is on
time. **Simultaneity is STAGED here, not asserted** (physics-honesty
ledger).

---

### Scene 10 — The same nine seconds, from the window
**On stage:** Narrator, the kid (silhouette, silent)
**Visual:** HARD CUT to the kid at the window, fingers ALREADY up — six of
them — the Scene-2 picture exactly. The grey ring is crossing the bay.
**Lines:** `a1_56_narrator`, `a1_57_narrator`, `a1_58_narrator`,
`a1_59_narrator`, `a1_60_narrator`, `a1_61_narrator`

> **NARRATOR:** Seven.
> **NARRATOR:** Eight.
> **NARRATOR:** Nine.

`sameAs: co_21_narrator`, `co_22_narrator`, `co_23_narrator` — the
cold-open count, rejoined at seven, on the grid. Then the same low far
RUMBLE as the cold open (sound design only; at nine counts he is a rumble,
and we have only just met him — no "Present!" alias here; the cold-open
sound and this sound are the SAME sound).

> **NARRATOR:** There he is.

`sameAs: co_24_narrator` — kokoro, byte-identical: the same seconds, the
same sentence. **HELD BEAT — 30f (1.0s) after `a1_59_narrator`.**

> **NARRATOR:** Up there, he was on time. Down here, he was nine counts late. Those are the same seconds.

The cut IS the lesson; nobody explains it yet. This is the LAST time the
Narrator says "late" as if it were true.

**HELD BEAT — 30f (1.0s) after `a1_60_narrator`.**

> **NARRATOR:** Keep counting.

0.9. **ACT BREAK.**

**Pedagogy (6, played not said):** the audience has just watched both ends
of one nine-second gap.

---

# ACT TWO — THE COUNT COMES DOWN

*The mechanism act, written to be the funniest: a wind that arrives before
its storm, a six, a three with Blue finally right, the lesson said once,
a two, a one, and the one firing with nothing in front of it.*

---

### Scene 11 — The storm arrives before itself; six
**On stage:** Narrator, Puff, Boom (first arrival at the window), the kid
(silent)
**Visual:** Inside the hotel, the lift REVERSES — cold air pours out of the
bottom of the tower, runs across the sea, over the lawn, and in through the
open window: the curtain lifts, the kid's hair moves, the mug ripples. Puff
is at the glass. Then FLASH over the bay, nearer than the cold open. The
ring rolls in under a six-count, and Boom arrives at the window for the
first time — huge and soft — to a room that is already looking out to sea
at where Flash was.
**Lines:** `a2_01_narrator`, `a2_02_puff`, `a2_03_puff`, `a2_04_puff`,
`a2_05_narrator`, `a2_06_narrator`, `a2_07_narrator`, `a2_08_narrator`,
`a2_09_narrator`, `a2_10_narrator`, `a2_11_narrator`, `a2_12_boom`,
`a2_13_boom`, `a2_14_boom`, `a2_15_narrator`, `a2_16_boom`,
`a2_17_narrator`, `a2_18_boom`, `a2_19_narrator`, `a2_20_boom`

> **NARRATOR:** Inside the hotel, the lift changed its mind.
> **PUFF:** Going down.

**THE LIFT CHAIN'S BREAK** — fresh recording, plot-causal: the downdraft.
Cold air out of the bottom of the storm, running ahead along the ground.

> **PUFF:** You can't see me. But you can FEEL me.

**CACHE MIGRATION — Puff's catch-phrase, exactly once, AS the gust front
at the kid's window** — the series' best-ever fit for it: a physical event
at the audience's seat. (NOT his entrance this time — his entrance was the
lift; the bible's "his catch-phrase IS his entrance" was an ep-4 ruling,
not a law — synthesis ACCEPTED.) The "FEEL" capital lives only in this
approved migrated take.

> **PUFF:** I ran ahead. I always run ahead.
> **NARRATOR:** That is the storm, arriving before itself. Cold air falls out of the bottom of the hotel and runs along the ground in front. You can feel a storm before you can hear it.

**FLASH** over the bay (≤6f, same body). Fingers up. The ring rolls in.

> **NARRATOR:** One.
> **NARRATOR:** Two.
> **NARRATOR:** Three.
> **NARRATOR:** Four.
> **NARRATOR:** Five.
> **NARRATOR:** Six.

`sameAs: co_15`–`co_20`. Six fingers. On the grid. Boom arrives at the
glass, enormous, soft, to a room facing the other way:

> **BOOM:** Present!

`sameAs: a1_48_boom` — **firing 2 of 10.** Heard six counts after the same
word was heard instantly in the lobby.

> **BOOM:** Why is everybody looking over there? I am over here. I just got here.

The arrival to the wrong-facing room — the episode's repeatable
humiliation that never humiliates him. Bubble: I AM OVER HERE.

> **BOOM:** You could wait. Just once.

**Address 2 of 6 — unanswered.** To the empty sky where Flash was.

> **NARRATOR:** Six.

`sameAs: co_20_narrator` (kokoro, identical text — aliased to lock intent;
this one is dialogue, not a count, and sits off the grid).

> **BOOM:** Six whats?
> **NARRATOR:** Counts.
> **BOOM:** Counts of what?
> **NARRATOR:** You.

0.92. The Boom ↔ Narrator engine, opened.

> **BOOM:** I have a theory. Everybody down here is early. The whole planet. It is a very early planet, and I am the only one on it who is on time.

**THEORY 1 of 3** (fresh recordings — a PATTERN, not a chain; firings
`a2_20`, `a2_53`, `a3_12`; resolved at the turn, Scene 20). Bubble: IT IS A
VERY EARLY PLANET.

**Pedagogy (gust front; 8 begins):** the cold wind runs ahead of a storm;
the kid feels it before hearing it. The count has shrunk from nine to six
because the STORM moved.

---

### Scene 12 — Blue, first; three
**On stage:** Blue (cameo — THE PAYOFF), Narrator, Boom, the kid (silent);
Violet (silent, far frame edge)
**Visual:** FLASH over the sea — and with her, 4f behind, ricocheting off
the water, the light he is: BLUE. At the far frame edge, also with the
flash, also first, noticed by nobody: VIOLET (same body, amplitude blur,
zero cost — he was first too; he exits before the scene ends). Fingers.
Three. The ring arrives.
**Lines:** `a2_21_blue`, `a2_22_narrator`, `a2_23_narrator`,
`a2_24_narrator`, `a2_25_boom`, `a2_26_narrator`, `a2_27_narrator`,
`a2_28_boom`, `a2_29_blue`, `a2_30_boom`, `a2_31_narrator`, `a2_32_blue`

> **BLUE:** First! Sorry, sea! I am first!

4f approach gap. 1.05, `happy`. Bubble may shout FIRST! in caps; the clip
stays lowercase. **He is RIGHT** — light arrives before sound, every time.

> **NARRATOR:** One.
> **NARRATOR:** Two.
> **NARRATOR:** Three.

`sameAs: co_15`–`co_17`. Three fingers. On the grid.

> **BOOM:** Present!

`sameAs: a1_48_boom` — **firing 3 of 10.** Three counts: one kilometre.

> **NARRATOR:** He was first. He was also very fast. Today, those are the same thing.

**THE FORMAT, FLIPPED** — after three shows of "He was not first. He was
very ___, though. Those are different things." 0.92, kind.

**HELD BEAT — 90f (3.0s) after `a2_26_narrator`. BLUE'S STUNNED BEAT —
the series' second** (after Sunny's 180f in ep 5). The ricochet STOPS DEAD
for the first time in his life; one still frame of Blue is itself the joke.
NOTHING enters it.

> **NARRATOR:** He has never been right before. He does not have a line for it.
> **BOOM:** Hello. You are early. Everybody down here is early.

Warmly, to Blue. Bubble: YOU ARE EARLY.

> **BLUE:** I was first!

The only line he owns. 4f gap.

> **BOOM:** And I was on time. Good team.

Both of them got what they wanted from the same flash. Bubble: I WAS ON
TIME. GOOD TEAM.

> **NARRATOR:** Both true.

**"Both true." — SOURCE, FIRING 1 of 2** (kokoro alias at `a3_67`; aliased
to lock wording). 0.92.

> **BLUE:** First to go home! Sorry, curtain!

Gone, on a fresh first. Three Blue lines, one scene; "I just said that!"
(capped) untouched; Indigo OUT.

**Pedagogy (6, as sound):** Blue IS light — the flipped button is
physically true on every flash in history. **Physics guard:** even at count
zero light is first; Boom never claims "first", only "on time".

---

### Scene 13 — The ruler, said once
**On stage:** Narrator, Boom (inside the diagram), the kid (silent)
**Visual:** The flash-to-boom DIAGRAM, with a character standing in it (the
diagram-sag rule): the bay drawn as a ruler across the window, the hotel at
the far end, the window at the near end, one line between them. Flash's
track is drawn and she is already at the window before the pen reaches the
middle; Boom WALKS the line at his one speed and narrates his own diagram.
**Lines:** `a2_33_narrator`, `a2_34_boom`, `a2_35_narrator`, `a2_36_boom`,
`a2_37_narrator`, `a2_38_narrator`, `a2_39_narrator`, `a2_40_narrator`,
`a2_41_boom`, `a2_42_boom`

> **NARRATOR:** Here is the bay, as a ruler. Here is the hotel, out at the far end. Here is the window. When Flash goes, she is here before the pen has moved. Boom walks.
> **BOOM:** I am walking as fast as I can. It is quite fast. She is faster. She is faster than everything.

Inside the geometry. Bubble: SHE IS FASTER THAN EVERYTHING.

> **NARRATOR:** You were one kilometre away.
> **BOOM:** I am a kilometre?
> **NARRATOR:** You were. You are closer now.
> **NARRATOR:** Lightning and thunder happen at the same time, in the same place. You see the flash straight away, because light is fast. You hear the boom later, because sound is slow. The gap is not lateness. It is distance.

**THE LESSON, said ONCE, plainly (world rule 16).** **Rule stamp: LIGHT IS
FAST. SOUND IS SLOW.**

> **NARRATOR:** About three counts for every kilometre. Or, if you count in miles, about five seconds a mile.

The parent aside, ONCE, logged for Mike (units call in the decision log).
Honest to the word "about" (2.9 s/km; 4.7 s/mile).

> **NARRATOR:** Blue's gap is who he is. Boom's gap is how far away he is. It changes.

The synthesis's own wording (B's "four frames behind" REJECTED — frames are
not a word for a six-year-old). This is the script saying out loud that
Boom's gap is not an identity gap.

> **BOOM:** Distance.

**HELD BEAT — 30f (1.0s) after `a2_41_boom`.** He considers the word.

> **BOOM:** I have a lot of that.

**Pedagogy (6):** light is fast; sound is slow; the gap is distance; three
counts to a kilometre. **STAMP.**

---

### Scene 14 — The house phone (two frames)
**On stage:** Boom, Cloudia (by the hotel's house phone, cut to the lobby),
Narrator, Sunny (behind the tower)
**Visual:** The kid holds up three fingers at the hotel. Boom looks at them.
Cut to the lobby a kilometre out: Cloudia at the house phone, hotel
management, accidentally the whole physics.
**Lines:** `a2_43_boom`, `a2_44_cloudia`, `a2_45_narrator`, `a2_46_cloudia`,
`a2_47_narrator`, `a2_48_sunny`, `a2_49_narrator`

> **BOOM:** Everybody keeps counting at me.
> **CLOUDIA:** He has never once been late to my hotel, darling. He was born in it.

Bubble: HE WAS BORN IN IT, DARLING.

> **NARRATOR:** From the window, he is three counts behind.
> **CLOUDIA:** Then the window is far, darling.

A's best line — the two frames of reference meeting over a house phone;
Cloudia right without noticing. Bubble: THEN THE WINDOW IS FAR, DARLING.

**HELD BEAT — 36f (1.2s) after `a2_46_cloudia`.** The Narrator has to
think about it.

> **NARRATOR:** Yes.

0.9. (A wrote "...Yes." — the dots are the held beat; the clip has none.)

> **SUNNY:** I AM STILL UP HERE! THE CLOUD IS IN THE WAY! THE HEAT THAT BUILT THE CLOUD IS MINE!

*Sunny interrupts a scene not about him*, firing 3 — true in every clause,
from behind a cloud he built. Kokoro — caps legal. Bubble: THE CLOUD IS IN
THE WAY!

> **NARRATOR:** All true. He is behind a cloud he built.

**Pedagogy (6, both frames):** at the source, flash and boom are together;
at a distance they are not; the difference is the distance. Neither frame
is wrong.

---

### Scene 15 — Two. One.
**On stage:** Narrator, Boom, the kid (silent)
**Visual:** FLASH, over the near water. Two fingers. The ring, nearer and
sharper. Then FLASH across the sky (she goes sideways; most of the time she
does not touch the ground). One finger. The hotel is over the hill behind
the house now; the garden is dark; the volcano's lit summit is the one
steady light on the sea horizon. The window glass hums. The kid leans IN.
**Lines:** `a2_50_narrator`, `a2_51_narrator`, `a2_52_boom`, `a2_53_boom`,
`a2_54_narrator`, `a2_55_boom`, `a2_56_narrator`, `a2_57_boom`, `a2_58_boom`

> **NARRATOR:** One.
> **NARRATOR:** Two.

`sameAs: co_15`, `co_16`. On the grid.

> **BOOM:** Present!

`sameAs: a1_48_boom` — **firing 4 of 10.** Louder in the mix (volume on
the instance; the clip is identical).

> **BOOM:** Two! I am catching up! My theory is this. The ground is moving.

**THEORY 2 of 3** — half right. Bubble: THE GROUND IS MOVING.

> **NARRATOR:** Half right. The hotel is moving. You are coming with it.

0.92. **Physics guard:** the count shrinks because the STORM moves, never
because Boom speeds up — he is never allowed to be the thing that changed.

> **BOOM:** I will take it.

**FLASH** across the sky. One finger.

> **NARRATOR:** One.

`sameAs: co_15`.

> **BOOM:** Present!

`sameAs: a1_48_boom` — **firing 5 of 10.** The glass buzzes.

> **BOOM:** One is nearly none. Nearly none. I am nearly there.

Bubble: ONE IS NEARLY NONE.

**Pedagogy (8):** the count shrinks as the storm comes closer: two, one.

---

### Scene 16 — Zero. The break
**On stage:** Boom, Flash (ONE FRAME beside him — the only time they share a
frame), Narrator, the volcano (ONE LINE, CUTTABLE), Cloudia (lobby, directly
overhead), the kid (silent)
**Visual:** The hotel is DIRECTLY OVERHEAD; everything outside is lit from
above. FLASH — across the underside of the cloud, over the house, SIDEWAYS
on purpose, the whole sky white for a frame — and in the SAME frame, for the
only time in the episode, Boom is already there, right outside the glass,
with Flash visible beside him for one frame and gone the next. The CRACK is
sound design — **the loudest noise in the episode**; the window rattles; the
mug ripples; nothing is hit; nobody is frightened — the kid leans IN,
blanket up, cosy. The Narrator's count never starts: she gets as far as an
inhale. The kid's finger does not come up.
**Lines:** `a2_59_boom`, `a2_60_narrator`, `a2_61_boom`, `a2_62_boom`,
`a2_63_volcano`, `a2_64_narrator`, `a2_65_cloudia`, `a2_66_narrator`

> **BOOM:** Present.

**THE BREAK — fresh recording, full stop, no shout.** `auto`, **1.0** (the
synthesis's §4 ruling — sound has one speed — overrides the §2 "0.95";
deviations ledger). `auto` is seasoning departure 1 of 2 — stage direction:
for the first time in his life the room is already looking at him; there is
nothing to announce. The loudest character in the sky, at his quietest, one
frame after the loudest noise in the episode.

**HELD BEAT — 60f (2.0s) after `a2_59_boom`.** The break lands alone.

> **NARRATOR:** I did not get to one.

0.9 — the Narrator's flattest line in the episode. She never says
"together"; she says this. **HELD BEAT — 30f (1.0s) after `a2_60_narrator`.**

> **BOOM:** You did not need to! Did you see that? She went and I went and there was no counting at all, not even a one, and nobody looked over there first, because there was no over there, there was only here, and that is on time. That is what it sounds like.

**His longest proud run-on — AUDITION LINE 2.** 1.0, `happy`, swelling.
Bubble: THAT IS WHAT ON TIME SOUNDS LIKE (six words). He turns to her —

**HELD BEAT — 45f (1.5s) after `a2_61_boom`.** **Address 3 of 6 —
unanswered**: the turn to her IS the address; she has already left. The
one time he sees her arrive, and she still goes first.

> **BOOM:** She has gone again.

Flat, from the words and the hold (cast `happy` — the two `auto` lines are
the break and the turn; see deviations ledger).

CUT to the coastal wide: the volcano on the horizon, summit lit, the
island beside him, the storm over the house in the distance. **48f approach
gap** (identity — the mountain deciding to move). Bubble from the MOUTH.

> **VOLCANO:** Louder than me. Well done.

**THE VOLCANO'S ONE LINE — CUTTABLE.** `Elegant_Man`, −6, 0.9, `auto`. The
clip text has no leading ellipsis; the 48f approach gap IS the dots (B's
words, A's placement). Boom BEAMS — no clip, no bubble; the volcano is
never answered into banter.

> **NARRATOR:** Well done, from a volcano, is enormous.

The translation — CUTTABLE as a pair with `a2_63`.

> **CLOUDIA:** That is my noise, darling. He was born in my lobby.

From the lobby directly overhead — the hotel's pride. Bubble: THAT IS MY
NOISE, DARLING.

> **NARRATOR:** And up in the penthouse, the ice remembered gravity. The check-out had begun.

Hail begins to fall on the lawn, seen from the window — big, bouncing on
grass, nobody under it. The grandest check-out proper is Scene 18.

**Pedagogy (8, zero):** right under the cloud, flash and boom are
together — to a count. **Physics guard:** even here light is first (she
goes first in the frame); the Narrator says "I did not get to one", never
"together".

---

### Scene 17 — The myth, and the Big Word THUNDER
**On stage:** Narrator, Cloudia (directly overhead), Boom
**Visual:** The hotel's underside fills the window. Cloudia, personally
offended, carries the bust. For the demonstration, two small clouds drift
together on the far horizon (beside the volcano) and touch. Nothing.
**Lines:** `a2_67_narrator`, `a2_68_cloudia`, `a2_69_narrator`,
`a2_70_cloudia`, `a2_71_cloudia`, `a2_72_cloudia`, `a2_73_narrator`,
`a2_74_narrator`, `a2_75_boom`, `a2_76_boom`

> **NARRATOR:** Some people say thunder is the sound of clouds bumping into each other.
> **CLOUDIA:** Darling. We do not bump. We mingle.

Composed, wounded. Bubble: WE DO NOT BUMP. WE MINGLE. (Caps in the bubble
only; clip lowercase.)

**The red MYTH stamp thuds on — CLOUDS DO NOT BUMP. — and cracks.** **HELD
BEAT — 36f (1.2s) on the cracked stamp** (house device: thud, crack,
silence).

> **NARRATOR:** Big myth. Busted.
> **CLOUDIA:** A cloud is a zillion tiny water drops, floating together, darling. Two of them meeting make no sound at all. None. I have listened for years.

Her ep-1 canon ("a zillion tiny water drops, floating together") inside
the defence. Bubble: TWO OF THEM MAKE NO SOUND. The two small clouds on
the horizon drift together and touch. **HELD BEAT — 36f (1.2s) after
`a2_70_cloudia`.** Nothing.

> **CLOUDIA:** Nothing, darling.
> **CLOUDIA:** Upstairs, yes, the guests rub shoulders, darling. That is the crackle. But the bang is her.

The honest mechanism inside the defence. Bubble: THE BANG IS HER.

> **NARRATOR:** The lightning makes the air around it so hot, so fast, that the air jumps out of the way all at once. That jump is him. Same instant. Same place. One thing. You see her. You hear him.
> **NARRATOR:** He has a name too. Thunder.

**Big Word card: THUNDER** — fired now that he is understood, more than a
minute after LIGHTNING.

> **BOOM:** That is me. I am the jump.
> **BOOM:** The loud part is the best part.

An ECHO of the volcano's ep-5 "This is the loud part." — not a quote; he
has his own sentence. Bubble: THE LOUD PART IS THE BEST PART (six).

**ACT BREAK.**

**Pedagogy (5) + MYTH (rule 18):** thunder is the lightning's heat making
the air jump — same instant, same place, one event; clouds are a zillion
tiny drops and two of them meeting make no sound. **THUNDER.** **CLOUDS DO
NOT BUMP.**

---

# ACT THREE — THE COUNT GOES UP

*The grandest check-out in hotel history, a three, a six that turns the
hero, a nine that rumbles, a goodbye on the lawn, and ten fingers at a
flash nobody can hear.*

---

### Scene 18 — The grandest check-out
**On stage:** Narrator, Cloudia, Sunny (behind the thinning tower), Drip
(falling, then a drop on the sill), the kid (silent); the hail guests
(silent, on the lawn)
**Visual:** Rain and hail pour off the hotel onto the lawn and the sea.
Hail bounces on the grass and the path, pea-sized, nothing struck but the
ground; Stony bounces once and sits down on the step. The kid watches from
behind the glass, mug up. Small hail melts on the way down; Drip lands on
the windowsill as a drop.
**Lines:** `a3_01_narrator`, `a3_02_cloudia`, `a3_03_cloudia`, `a3_04_sunny`,
`a3_05_narrator`, `a3_06_sunny`, `a3_07_drip`

> **NARRATOR:** Every guest on the top floor checked out at the same time. Through the floor. There are no stairs.

0.92 — the no-stairs joke paid a second time (A's Narrator line).

> **CLOUDIA:** I love my guests. I hate gravity.

**Ep-1 canon, VERBATIM, as a fresh Abbess recording** — the one composed
line without "darling" that is NOT a break: it is a quote of her own canon,
unaltered (A's variant REJECTED). In her glory and her grief.

> **CLOUDIA:** Thousands, darling. All at once. All downward. The grandest check-out in the history of the trade.

Bubble: THE GRANDEST CHECK-OUT IN HISTORY.

> **SUNNY:** THAT RAIN IS MY WATER! I LIFTED IT THIS MORNING!

*Sunny interrupts a scene not about him*, firing 4 — TRUE (the rain is
water his heat evaporated that morning). Bubble: THAT RAIN IS MY WATER!

> **NARRATOR:** He did.
> **SUNNY:** You're welcome! HA! HA!

**Firing 3 of 4** — `sameAs: co_07_sunny`.

> **DRIP:** I am travel-sized again.

**THE TRAVEL-SIZED VARIANT — IN once, CUTTABLE** (synthesis: A over B;
Claire's channel, a five-show callback). Honest: small hail melts on the
way down; she lands as a drop. Fan service in her shape. One-line cut.

**Pedagogy (hail falls):** gravity wins the penthouse; hail falls on grass
with nobody under it; the small ones melt.

---

### Scene 19 — Three again
**On stage:** Narrator, Boom, the kid (silent)
**Visual:** The hotel walks on over the house and out the other side. FLASH,
now BEHIND the house, over the hills. Three fingers.
**Lines:** `a3_08_narrator`, `a3_09_narrator`, `a3_10_narrator`, `a3_11_boom`,
`a3_12_boom`, `a3_13_boom`, `a3_14_narrator`

> **NARRATOR:** One.
> **NARRATOR:** Two.
> **NARRATOR:** Three.

`sameAs: co_15`–`co_17`. On the grid.

> **BOOM:** Present!

`sameAs: a1_48_boom` — **firing 6 of 10.**

> **BOOM:** Three! I was at none a minute ago. I have not done anything differently. I have not changed one thing. I left exactly when she left. I always leave exactly when she leaves.

**THEORY 3 of 3** — "I have not changed one thing" (true — the hotel has).
Dismay played as comedy inside delight, never hurt. Bubble: I HAVE NOT
CHANGED ONE THING.

> **BOOM:** Didn't I?

**Address 4 of 6 — unanswered.** To the sky where she was. (B's em-dash
tail is a split clip — deviations ledger.) **HELD BEAT — 24f (0.8s) after
`a3_13_boom`.**

> **NARRATOR:** You did.

Kind, 0.92.

**Pedagogy (8):** the count grows again as the storm leaves — and the hero
has done nothing differently. The set-up for the turn.

---

### Scene 20 — Six. The turn
**On stage:** Narrator, Boom, the kid (silent)
**Visual:** FLASH, farther, out over the hills. Six fingers. The ring
arrives rounder and softer than before — the identical clip, lower in the
mix. Boom watches the fingers at the window — six of them.
**Lines:** `a3_15_narrator`, `a3_16_narrator`, `a3_17_narrator`,
`a3_18_narrator`, `a3_19_narrator`, `a3_20_narrator`, `a3_21_boom`,
`a3_22_narrator`, `a3_23_boom`, `a3_24_boom`, `a3_25_boom`, `a3_26_narrator`,
`a3_27_boom`, `a3_28_narrator`

> **NARRATOR:** One.
> **NARRATOR:** Two.
> **NARRATOR:** Three.
> **NARRATOR:** Four.
> **NARRATOR:** Five.
> **NARRATOR:** Six.

`sameAs: co_15`–`co_20`. On the grid.

> **BOOM:** Present!

`sameAs: a1_48_boom` — **firing 7 of 10** — the first "far" firing: the
SAME clip, **volume only** on the Remotion instance (no filtered copy, no
re-record; the synthesis REJECTED B's low-pass ask).

> **NARRATOR:** Six. Two kilometres. You have not changed. The hotel is leaving, and you are getting far.
> **BOOM:** So it was never late. Not once. Not one time in my whole life. I was far. Far is a completely different thing. Far is a number. Nobody has ever counted how far I am before.

His working-out, in his own register — a run-on, not a lesson voice (B's
wording with A's "Nobody has ever counted how far I am before." folded in,
per the synthesis). Bubble: I WAS NEVER LATE. I WAS FAR. (six)

> **BOOM:** Flash. Far is a number. Did you hear that?

**Address 5 of 6 — unanswered.** **HELD BEAT — 36f (1.2s) after
`a3_24_boom`.** She has gone, as ever.

> **BOOM:** She is always gone. I tell her everything anyway.

A's line, landing once, at the turn — the sweetness made explicit. Cast
`happy`: fond, not sad. Bubble: I TELL HER EVERYTHING ANYWAY.

> **NARRATOR:** Three counts for every kilometre. You are the only thing in this show a kid can measure with their fingers.

**Rule stamp: THREE COUNTS = ONE KILOMETRE.**

> **BOOM:** Count me.

**THE TURN — AUDITION LINE 3.** The same word he has shouted all episode,
said softly, now means where he is. Fresh recording, `auto` (seasoning
departure 2 of 2 — stage direction: said to the kid, warm; an instruction,
not a concession), **1.0** (the §4 ruling: sound has one speed). Must land
warm, not defeated.

**HELD BEAT — 60f (2.0s) after `a3_27_boom`.** The turn. Nothing enters.

> **NARRATOR:** We will.

0.92. No moral is stated by anyone; he just changes what he is proud of,
and his pride is louder than before.

**Pedagogy (6, 8 — the arc IS the lesson):** three counts to a kilometre;
the count was never lateness, it was distance; far is a number you can
count. **STAMP.**

---

### Scene 21 — Nine. The rumble
**On stage:** Narrator, Boom (from the distance), the kid (silent)
**Visual:** Dusk coming. FLASH, far, past the volcano now (the lit summit
steady on the horizon under the departing storm). Nine fingers. What
arrives is long and low and rolls on after it should have stopped —
sound design: the rumble, from several directions, the hills handing him
back. The identical "Present!" sits low inside it.
**Lines:** `a3_29_narrator`, `a3_30_narrator`, `a3_31_narrator`,
`a3_32_narrator`, `a3_33_narrator`, `a3_34_narrator`, `a3_35_narrator`,
`a3_36_narrator`, `a3_37_narrator`, `a3_38_boom`, `a3_39_narrator`,
`a3_40_boom`, `a3_41_boom`, `a3_42_boom`, `a3_43_narrator`, `a3_44_narrator`

> **NARRATOR:** One.
> **NARRATOR:** Two.
> **NARRATOR:** Three.
> **NARRATOR:** Four.
> **NARRATOR:** Five.
> **NARRATOR:** Six.
> **NARRATOR:** Seven.
> **NARRATOR:** Eight.
> **NARRATOR:** Nine.

`sameAs: co_15`–`co_23`. Nine fingers. On the grid — the second of the two
long counts in act three (audit this stretch first; the kid's hand is the
picture and the ring is visible crossing the hills the whole way).

> **BOOM:** Present!

`sameAs: a1_48_boom` — **firing 8 of 10** — far, volume only, inside the
rumble SFX.

> **NARRATOR:** That is still him. All of him. He is kilometres long, and the near end of him gets here before the far end does. The hills hand him back as well. One bang arrives as a long grumble.
> **BOOM:** I am very long.

Proud. From the distance.

> **BOOM:** I like the hills. They let me arrive twice.
> **BOOM:** Did you see that one? That was a good one.

**Address 6 of 6 — unanswered.** To a sky she left nine seconds ago.

> **NARRATOR:** From here, he is a rumble. He is still all Boom.

"Rumble" used as the pedagogy, once — his distance, not his name.

> **NARRATOR:** He was a rumble this afternoon as well, on the very first count. You had not met him yet.

CUTTABLE — ties the cold-open SFX rumble to him retroactively (an
invention; deviations ledger).

**Pedagogy (7):** a bolt is kilometres long; the near end's sound arrives
first; hills send it back; one bang arrives as a long grumble. No new
mechanism invented.

---

### Scene 22 — Roll call, firing 2: goodbye on the lawn
**On stage:** Sunny (visible again, low and gold), Narrator, Drip (a drop
on the lawn among the melting hail); the hail guests (silent, melting)
**Visual:** The storm is a grey wall out past the volcano. The garden gets
its light back — Sunny, low, gold, out from behind the tower at last. On the
lawn the hailstones are melting into the grass; Stony on the step is the
last to go. Drip, drop-sized, among them.
**Lines:** `a3_45_sunny`, `a3_46_narrator`, `a3_47_drip`, `a3_48_narrator`,
`a3_49_drip`

> **SUNNY:** I am back! I never left! Something was in front of me!

*Sunny interrupts a scene not about him*, firing 5 — true in every clause.
Bubble: I NEVER LEFT!

> **NARRATOR:** All true.

**ROLL CALL — FIRING 2 (goodbye).** Same five names, same order as the
greeting (series law); one clip this time — the Stony beat already landed
in act one, and a goodbye run reads as one breath (ep-5 precedent). At 1.0.

> **DRIP:** Bye, Hail. Bye, Hailey. Bye, other Hail. Bye, Hail the third. Bye, Stony.
> **NARRATOR:** They are all melting. By morning, every one of them will be called Puddle.

0.92 flat — the goodbye middle, with the second lesson inside it (hail is
frozen rain, and rain is Drip).

**HELD BEAT — 36f (1.2s) after `a3_48_narrator`.**

> **DRIP:** I was big for an hour. It was lovely.

Button — flat, nothing added; B's wording per the synthesis.

**Pedagogy (hail melts):** hail melts to puddles by morning; rain IS her.

---

### Scene 23 — Ten fingers, and nothing
**On stage:** Narrator, the kid (silhouette, silent), Boom (at the hotel
cut), Cloudia (at the hotel cut)
**Visual:** Dusk. The storm is far, far past the volcano — a flicker on the
horizon. FLASH, tiny, out there. The kid's fingers: all ten. The Narrator
stops. The kid holds ten fingers at a window. Nothing. Then CUT to the
hotel, far away, grey-gold in the last light — FLASH — and in the lobby,
instantly, at zero distance:
**Lines:** `a3_50_narrator`, `a3_51_narrator`, `a3_52_narrator`,
`a3_53_narrator`, `a3_54_narrator`, `a3_55_narrator`, `a3_56_narrator`,
`a3_57_narrator`, `a3_58_narrator`, `a3_59_narrator`, `a3_60_narrator`,
`a3_61_narrator`, `a3_62_narrator`, `a3_63_narrator`, `a3_64_boom`,
`a3_65_cloudia`, `a3_66_narrator`, `a3_67_narrator`, `a3_68_narrator`

> **NARRATOR:** The storm walked on for a long time. Here is the last one.

**FLASH**, far past the volcano. Fingers.

> **NARRATOR:** One.
> **NARRATOR:** Two.
> **NARRATOR:** Three.
> **NARRATOR:** Four.
> **NARRATOR:** Five.
> **NARRATOR:** Six.
> **NARRATOR:** Seven.
> **NARRATOR:** Eight.
> **NARRATOR:** Nine.
> **NARRATOR:** Ten.

`a3_51`–`a3_59` `sameAs: co_15`–`co_23`; **`a3_60` "Ten." is the TENTH
SOURCE recording** (its earliest firing). Ten fingers, all up. On the grid.

> **NARRATOR:** That is all the fingers.

**HELD BEAT — 120f (4.0s) after `a3_61_narrator`.** The kid holds ten
fingers at a window. Nothing enters. Nothing arrives. The lit summit, the
island, the wet lawn.

> **NARRATOR:** Nothing. He is too far to hear now. More than fifteen kilometres. That is forty-five counts.

0.9. **Physics guard (B):** a ten-count flash is NEVER silent (that is
three kilometres and audible) — the no-boom flash is the more-than-fifteen-
kilometres one, and the Narrator says so. **HELD BEAT — 30f (1.0s) after
`a3_62_narrator`.**

> **NARRATOR:** You would need four and a half kids.

Forty-five fingers is four and a half kids — the arithmetic is exact (the
synthesis's "four and a half MORE kids" would be fifty-five fingers; fixed
— deviations ledger).

**CUT to the hotel**, far away, grey-gold. FLASH — and instantly:

> **BOOM:** Present!

`sameAs: a1_48_boom` — **firing 10 of 10, FINAL** — the alias fired at the
hotel after the ten-fingers-and-nothing beat (A's bookend): zero distance,
on time, as always, at the hotel. The chain opens and closes in the lobby.
**The Narrator does NOT say "Present." for him — ever** (B's quote is OUT;
the hotel cut does the job, and it is physics).

> **CLOUDIA:** Mark him present, darling.

Bubble: MARK HIM PRESENT, DARLING.

Back at the window —

> **NARRATOR:** At the hotel, he is on time. From here, he is too far to hear.

**HELD BEAT — 30f (1.0s) after `a3_66_narrator`.**

> **NARRATOR:** Both true.

`sameAs: a2_31_narrator` — **firing 2 of 2** (kokoro; aliased to lock
wording). **HELD BEAT — 30f (1.0s) after `a3_67_narrator`.**

> **NARRATOR:** That is the whole thing.

0.9. **ACT OUT.**

**Pedagogy (8, the goodbye):** the count grows until the flash arrives with
no boom at all — too far to hear (thunder is rarely heard beyond about
fifteen kilometres). Both frames are true and the Narrator says so.

---

# RECAP

*The chant, the amazing part, two small true things about you, and a moon.*

---

### Scene 24 — The chant
**On stage:** Narrator; the hail guests, Flash, Boom (visual slams)
**Visual:** Card stack replays STATIC / LIGHTNING / THUNDER — one voice
chants (world rule 15), the ensemble owns the visual slams in owner order:
the penthouse hail slam STATIC; Flash slams LIGHTNING and is on screen for
six frames of her own slam, gone for the rest (that IS the joke — the body
has been seen ten times by now); Boom slams THUNDER **one beat behind her,
on purpose** — he looks for her, she has gone (the staged seventh address;
not a clip, not counted).
**Lines:** `rc_01_narrator`, `rc_02_narrator`, `rc_03_narrator`,
`rc_04_narrator`, `rc_05_narrator`

> **NARRATOR:** So. Three words, in the order they happened.
> **NARRATOR:** Static!
> **NARRATOR:** Lightning!
> **NARRATOR:** Thunder!

Three one-word kokoro clips, one voice (rule 15) — written as three clips
so the slams can be timed to the words and Boom's slam can sit a beat
behind the last one (deviations ledger). One-word clips are the episode's
highest TTS-risk class; **fallbacks pre-written in the production notes**.

> **NARRATOR:** Thunder is not late. Thunder is FAR.

Kokoro — the caps are legal there. The single takeaway, said once.

---

### Scene 25 — The amazing part
**On stage:** Narrator, Sunny (low, gold, fully visible), Boom (far — a
voice from the horizon)
**Visual:** The garden at dusk from the window; the storm a flicker far out;
the volcano's summit lit; Sunny low over the sea.
**Lines:** `rc_06_narrator`, `rc_07_narrator`, `rc_08_sunny`, `rc_09_narrator`,
`rc_10_sunny`, `rc_11_narrator`, `rc_12_boom`, `rc_13_narrator`, `rc_14_boom`,
`rc_15_narrator`

> **NARRATOR:** Now here is the amazing part.

House opener (eps 2, 3).

> **NARRATOR:** A lightning bolt is about five times hotter than the surface of the Sun.

**Mind-blower 1 (PRIMARY, world rule 17)** — true, checkable, world-scale
(about thirty thousand degrees against about five and a half thousand).
**HELD BEAT — 60f (2.0s) after `rc_07_narrator`.** Awe, in silence, BEFORE
any button — Sunny visibly hearing it.

> **SUNNY:** The surface. Only the surface. Inside, I am MUCH hotter.

Precision intact — both claims TRUE. Kokoro; caps legal. Bubble: ONLY THE
SURFACE.

> **NARRATOR:** I checked. Fifteen million degrees, in the middle. It holds.

The Narrator checks; it holds (the Sun's core is about fifteen million
degrees).

> **SUNNY:** You're welcome! HA! HA!

**Firing 4 of 4, final** — `sameAs: co_07_sunny`. Ceiling 8 untouched.

> **NARRATOR:** There is a lake in Venezuela, called Lake Maracaibo, where there is a thunderstorm more than a hundred nights a year. The lightning capital of the world.

**Mind-blower 2 (SECONDARY, Math-bait — the look-it-up slot).** Catatumbo
lightning; pronounceable; true.

> **BOOM:** I know. I am busy.

From far. B's button.

> **NARRATOR:** And two small ones, about you. You have never heard a thunder that was not already over.
> **BOOM:** By the time you hear me, I have already happened.

The quietest mind-blower in the series, in the hero's own words (A, per
the synthesis). Bubble: I HAVE ALREADY HAPPENED.

> **NARRATOR:** And the crackle on your balloon is him, tiny. Count that one. You will not need any fingers.

The second viewer fact (B's wording). Neither viewer fact discharges the
rule alone; the Sun does.

---

### Scene 26 — End card: the moon
**On stage:** Narrator, Sunny (below the horizon), the kid (silhouette,
silent)
**Visual:** The sky over the house has cleared at dusk. The storm is a
flicker on the far horizon. The volcano and the island hold the horizon,
summit lit — and above them, the MOON is out: half of it (a phase a kid can
check this week). Card: **WHY DOES THE MOON CHANGE SHAPE?**
**Lines:** `rc_16_narrator`, `rc_17_sunny`, `rc_18_narrator`

> **NARRATOR:** Next time. Why does the moon change shape?

0.9. **The ep-7 tease (TOP-LOGGED FOR MIKE — a tease is an audience
promise):** the moon, per the synthesis — the picture already exists; the
Earth's-shadow misconception is rule-18 gold; thirty nightly checks; two
canon plants (ep 3's control experiment, ep 4's "Look up. That's me."). Sea
salt is the logged alternate; B's one-line salt arm is NOT fired. Mike
overturns EARLY if he prefers salt: one card + two kokoro lines.

> **SUNNY:** I CAN ANSWER THAT ONE!

From below the horizon, muffled — TRUE (the light on the moon is his; the
shape is where you are standing). Kokoro; caps legal.

> **NARRATOR:** He can. He will.

0.92. The episode's last spoken line.

**Last picture:** one more far, silent flash out past the island. The kid
at the window holds up ten fingers anyway — and waves. The lit summit, the
island, the half moon.

---

## Production notes

**Tone guardrails.** Unchanged. No sarcasm a six-year-old cannot parse; **no
scary peril — the storm is Cloudia's GALA, the lightning is fireworks,
nothing on screen is ever struck** (Flash strikes the sea far out or goes
across the sky; the overhead bolt goes sideways on purpose), nobody is
frightened (a character may be STARTLED by Boom — Cloudia's break — which is
funny, never scared; the kid leans IN at the loudest moment, cosy under a
blanket). The kid is indoors from the first dark sky (Scene 2) to the end
card. One plain safety sentence (`co_14`), never fear. No potty humour.
Nobody is unkind: Blue being right is a GIFT, not a comeuppance for anyone;
Boom being "far" is not a flaw — he never learns a moral, he changes what he
is proud of; Sunny's precision is checked and holds every time; Cloudia's
break is composure, not panic. Hail bounces on grass with nobody under it.

**Comedy pacing is designed in.** Slower per-line speeds on every list and
deadpan (house flat 0.92 on both roll-call middles, "Same hotel.", the
flipped Blue button, "You.", "Half right.", "We will.", "He can. He will.",
"Correct. Both halves.", "Written down."; deadpan floor 0.9 on "Keep
counting.", "Yes.", "I did not get to one.", "Nothing. He is too far…",
"That is the whole thing.", "Next time…"). Drip's roll-call runs at her
1.0 — the names separate at her natural pace (ep-5 found 1.0 is the
roll-call speed). The spine holds are Blue's stunned beat (**90f**), the
break (**60f + 30f**), the turn (**60f**), ten-and-nothing (**120f**), the
awe (**60f**), the volcano's identity gap (**48f**), and the count grid
(**30f per number — a METRONOME, not a silence**). Everything else gets
ensemble business. **No emotion lead on held-beat scenes** (kit's 8-frame
`useEmotion` lead → 0 wherever a HELD BEAT direction appears). Identity gaps
declared once in "How to read the held beats": volcano 48f, Blue 4f; Boom's
gap is the count and is NOT identity.

### The "Present!" chain — the episode's spine (one recording, ten firings, one break)

The source is **his birth in the hotel lobby at zero distance** (both
treatments; the lesson is played as sound before it is said). Aliases at
every counted arrival; the break at zero; the final alias at the hotel cut
after ten-and-nothing. Far firings are **the identical clip, volume only**
(Remotion `volume` on the instance) — no filtered copies, no re-record
(world rule 5; the box has no ffmpeg). The arrival gap is the count and
changes with distance — it is never an identity gap.

| Firing | Key | Scene | Heard at | Count before him | Recording |
|---|---|---|---|---|---|
| **1 — SOURCE** | **`a1_48_boom`** | 9 | the hotel lobby | none — instant | **fresh (chain source; AUDITION LINE 1)** |
| 2 | `a2_12_boom` | 11 | the window | 6 | `sameAs: a1_48` |
| 3 | `a2_25_boom` | 12 | the window (Blue's scene) | 3 | alias |
| 4 | `a2_52_boom` | 15 | the window | 2 | alias (louder — volume) |
| 5 | `a2_57_boom` | 15 | the window | 1 | alias |
| **BREAK** | **`a2_59_boom`** | 16 | the window, overhead | **0 — she is still in the frame** | **fresh: "Present." — full stop, `auto`, 1.0** |
| 6 | `a3_11_boom` | 19 | the window | 3 | alias |
| 7 | `a3_21_boom` | 20 | the window | 6 | alias (far — volume only) |
| 8 | `a3_38_boom` | 21 | the window | 9 | alias (far — volume only, inside the rumble SFX) |
| — | — | 23 | the window | **10 — nothing** | no clip; 120f of silence |
| **10 — FINAL** | `a3_64_boom` | 23 | the hotel lobby (cut) | none — instant | alias |

The two SFX rumbles (`co_24` and `a1_59` — the same nine seconds) carry no
"Present!" — the audience has not met him (cold open) / has only just met
him (the cut), and at nine counts he is a rumble; `a3_44` (CUTTABLE) ties
them to him afterwards. **"Present!" vs "On time!" (brief's alternative,
logged):** "On time!" makes him ARGUE every arrival; "Present!" makes him
ANSWER — and what he is answering is a count that is really a measurement.
"On time" is his thesis and lives in his run-ons.

### The count ledger — ten kokoro recordings, fifty-two firings, one grid

**The ten recordings:** `co_15`–`co_23` ("One." … "Nine.") and `a3_60`
("Ten."). Every other count in the episode is a `sameAs` alias (kokoro is
deterministic — the aliases state intent and lock wording).

| Count | Scene | Keys | Length | Meaning |
|---|---|---|---|---|
| 9 | 2 (cold open) | `co_15`–`co_23` (SOURCES) | nine | the kid's habit — before the hero exists; SFX rumble |
| 7–9 (the cut) | 10 | `a1_56`–`a1_58` → `co_21`–`co_23` | three | the same nine seconds rejoined; SFX rumble |
| 6 | 11 | `a2_06`–`a2_11` → `co_15`–`co_20` | six | the first counted arrival (two kilometres) |
| 3 | 12 | `a2_22`–`a2_24` → `co_15`–`co_17` | three | Blue's payoff; one kilometre |
| 2 | 15 | `a2_50`–`a2_51` → `co_15`–`co_16` | two | shrinking |
| 1 | 15 | `a2_56` → `co_15` | one | nearly none |
| 0 | 16 | — | none | THE BREAK — the count never starts |
| 3 | 19 | `a3_08`–`a3_10` → `co_15`–`co_17` | three | growing again |
| 6 | 20 | `a3_15`–`a3_20` → `co_15`–`co_20` | six | THE TURN; two kilometres |
| 9 | 21 | `a3_29`–`a3_37` → `co_15`–`co_23` | nine | the rumble; three kilometres |
| 10 + nothing | 23 | `a3_51`–`a3_59` → `co_15`–`co_23`; **`a3_60` "Ten." SOURCE** | ten | all the fingers; more than fifteen kilometres = forty-five counts |

(`a2_15_narrator` "Six." is dialogue, aliased to `co_20` for wording only;
it sits OFF the grid.)

**PRODUCTION GATE — the 30-frame grid.** Each number clip + its `gapFrames`
= **exactly 30 frames**, so three counts on screen are three seconds and
"three counts = one kilometre" is true on screen. A faster count is a
pedagogy bug, not a pacing choice; the script may not shorten it. Measure
the ten clips in the manifest (`One.` through `Ten.` will land ~12–18
frames each) and set each alias's gap to `30 − clipFrames`. During every
count Boom is VISIBLE rolling across the bay (a chase, never a wait) and
the kid's fingers are the only prop. If the cold-open nine proves long at
manifest time, the fallback is SIX (the cut then joins at "Four. Five.
Six." — `a1_56`–`a1_58` re-alias to `co_18`–`co_20`).

### Catch-phrase ledger — counts vs ceilings

| Phrase | Owner | This episode | Ceiling / rate | Keys |
|---|---|---|---|---|
| "You're welcome! HA! HA!" | Sunny | **4** (1 recording + 3 aliases) | **8, hard** — 4 of headroom unspent | `co_07` (SOURCE), `a1_22`, `a3_06`, `rc_10` |
| "GOOD MORNING, EVERYBODY!" → "I invented mornings!" | Sunny | 1 pair | series constant, **six-for-six** | `co_03`, `co_04` |
| *Sunny interrupts a scene not about him* | Sunny | **5 firings, every one TRUE** — behind the tower (`a1_18`), the crackle disclaimer (`a1_35`), still up here (`a2_48`), the rain is my water (`a3_04`), I never left (`a3_45`) | pattern, un-ceilinged | — |
| "Hi! It's me! I'm the weather!" | Drip | 1 — **fifth identical firing**, cache-migrated | standing entrance | `a1_09` |
| "I am NOT small! I am travel-sized!" | Drip | **1 VARIANT** — "I am travel-sized again." (IN once, CUTTABLE; synthesis A over B) | fan service; first revival since ep 1 | `a3_07` |
| "You can't see me. But you can FEEL me." | Puff | 1, AS the gust front at the window (not his entrance — ACCEPTED deviation), cache-migrated | one per appearance; series count 7 (unverified, recount owed) | `a2_03` |
| "Different show. Same ___." | Narrator | **1** — "Same **hotel**." (used before: sun, sky, rain, air, beam, weather, rock, first); "Same darling." / "Same guest." REJECTED | one per returning entrance; Drip carries herself; Puff cannot be pointed at | `co_09` |
| "darling" | Cloudia | **28 composed lines carry it**; dropped on exactly ONE line (the break `a1_45`) + one verbatim canon quote without it (`a3_02`) | barometer, not a ceiling | — |
| "Darling. There are no stairs." | Cloudia | 1 — ep-1 canon VERBATIM, fresh Abbess recording (a quote, not a chain) | canon line; the lift's set-up | `a1_03` |
| "I love my guests. I hate gravity." | Cloudia | 1 — ep-1 canon VERBATIM, fresh Abbess recording (A's variant REJECTED) | canon line; the check-out | `a3_02` |
| "A cloud is a zillion tiny water drops, floating together" | Cloudia | 1, inside the MYTH defence | ep-1 canon; brief-named | `a2_70` |
| Blue's "First! Sorry, ___! I am first!" | Blue | 1 — **RIGHT, for the first time in four episodes** — THE PAYOFF FIRES | arc complete, kind | `a2_21` (+ `a2_29`, `a2_32`) |
| "He was not first. He was very ___, though. Those are different things." | Narrator | **FLIPPED, once:** "He was first. He was also very fast. Today, those are the same thing." | the format's payoff form; format closed | `a2_26` |
| "I just said that!" | Blue | 0 | capped 4 (ep 3) — untouched | — |
| "Present!" | Boom (NEW) | 10 firings, 1 recording + the break "Present." | NEW chain — this episode's spine | table above |
| "Going up." / "Going down." | Puff (NEW) | 3 firings, 1 recording + the break | NEW chain | `a1_06` (SOURCE), `a1_12`, `a1_37`; break `a2_02` |
| Boom's theories ("I have a theory…") | Boom | 3 fresh run-ons — pattern, not chain | resolved at the turn | `a2_20`, `a2_53`, `a3_12` |
| "Both true." | Narrator | 2 (source + kokoro alias) | A14, accepted | `a2_31` (SOURCE), `a3_67` |
| "There he is." | Narrator | 2 (source + kokoro alias — the same seconds) | intent-locked | `co_24` (SOURCE), `a1_59` |
| "This is the loud part." | the volcano | 0 — Boom's "The loud part is the best part." is an ECHO, not a quote | — | `a2_76` |
| the volcano's lines | the volcano | **1** ("Louder than me. Well done.", CUTTABLE) | scarcity is the character; 1 ≪ 7 | `a2_63` |
| "Probably." | Narrator | 0 | Math's word — not needed this episode | — |

### `sameAs` chains — sources marked (aliases resolve BACKWARDS; the source is the earliest firing, decided here, at draft time)

| Chain | SOURCE (earliest firing) | Aliases, in order | Notes |
|---|---|---|---|
| "Present!" | **`a1_48_boom`** | `a2_12`, `a2_25`, `a2_52`, `a2_57`, `a3_11`, `a3_21`, `a3_38`, `a3_64` | MiniMax, ONE paid recording, ten firings — the spine. Far firings: volume on the instance only. The audition must approve the source take before generation. |
| Break: "Present." | `a2_59_boom` | — (deliberately NOT aliased) | Fresh recording; the full stop and the `auto` ARE the break. |
| "Going up." | **`a1_06_puff`** | `a1_12`, `a1_37` | MiniMax, ONE recording, three firings — each one a coat of ice. |
| Break: "Going down." | `a2_02_puff` | — | Fresh recording, plot-causal — the downdraft that becomes the gust front. |
| "You're welcome! HA! HA!" | **`co_07_sunny`** | `a1_22`, `a3_06`, `rc_10` | Kokoro (deterministic — aliases state intent and lock wording). |
| "There he is." | **`co_24_narrator`** | `a1_59` | Kokoro; the same seconds, the same sentence. |
| "Both true." | **`a2_31_narrator`** | `a3_67` | Kokoro; A14. |
| The count "One."–"Nine." | **`co_15`–`co_23`** | forty-one aliases (count ledger) | Kokoro; grid-gated. |
| The count "Ten." | **`a3_60_narrator`** | — | Kokoro; the tenth recording; fired once. |
| "Six." (dialogue) | `co_20_narrator` | `a2_15` | Kokoro; off-grid; wording lock only. |

### Cache-migration flags (cross-episode identity = migration ONLY; copies, never moves; ear-check each once in the new mix)

| Target key | Source clip | Line | Fields | Why |
|---|---|---|---|---|
| `a1_09_drip` | `public/narration/sky-blue/a1_31_drip.mp3` (verified on disk) | "Hi! It's me! I'm the weather!" | `Lively_Girl`, `happy`, 1.0 | Drip's standing entrance — **FIFTH identical firing**; the audibly identical take IS the joke. Copy the mp3 + seed the storm cache with the same text hash BEFORE running the generator. |
| `a2_03_puff` | `public/narration/wind/a1_40_puff.mp3` (verified on disk) | "You can't see me. But you can FEEL me." | `Exuberant_Girl`, `happy`, 1.0 | One per appearance; the canon "FEEL" capital never gets a fresh MiniMax draw. Fired as the gust front at the window, not as his entrance (ACCEPTED). |

No other cross-episode identity is claimed. Cloudia's two canon lines are
fresh Abbess recordings (ep-1 Cloudia was kokoro `bf_emma`, retired —
cross-engine migration is impossible; they are quotes, not chains).

### The roll call — two firings

Series signature, shape fixed both times: cheerful naming → one flat
Narrator line (0.92) → unbothered, unseasoned button; nobody replies inside
the naming. Variant: **the penthouse hail** — a fresh crowd (used before:
raindrops, puffs, colours/copies, seeds, islands), built on the picture act
one already has (the frozen top floor), and the joke IS the lesson: the
rubbing that builds the crackle is said as a roll call two scenes before
the card. Names, both firings, same order: **Hail, Hailey, other Hail,
Hail the third, Stony** (Stony is the big one — the most trips up and down
the tower; the same body both firings; bounces once and sits on the step).
**Firing 1 (greeting):** Scene 6 — `a1_27` + `a1_28` (split for the 24f
Stony beat) / `a1_29` ("Every guest on the top floor is called Hail. They
keep rubbing past each other. It builds up.") / button `a1_30` ("I am one
of them now."). **Firing 2 (goodbye):** Scene 22 — `a3_47` (one clip) /
`a3_48` ("They are all melting. By morning, every one of them will be
called Puddle.") / button `a3_49` ("I was big for an hour. It was
lovely."). Greeting and goodbye are different sentences — separate
recordings by design, not a broken chain. Drip's buttons carry her locked
cast `happy` (she is `happy` throughout by casting); "unseasoned" here
means nothing is ADDED — no gesture, no entrance, no emotion change
(deviations ledger).

### Running-gag plan — planted and resolved

| Gag | Plant | Firings | Resolve |
|---|---|---|---|
| **The count** (the spine) | Sc 2 — before the hero exists (nine, SFX) | Sc 10 (7–9), 11 (6), 12 (3), 15 (2, 1), 16 (none), 19 (3), 20 (6), 21 (9), 23 (10 + nothing) | Sc 23 — ten fingers, nothing; the cut to the hotel where he is instantly present; "Both true." / "That is the whole thing." |
| **"Present!"** (attendance) | Sc 9 (source, zero distance) | 10 firings + the break (table) | Sc 20 "Count me." — the same word said softly now means where he is; Sc 23 the final alias at the hotel. |
| **Boom's theories** (pattern) | Sc 11 "a very early planet" | Sc 15 "the ground is moving" (half right), Sc 19 "I have not changed one thing" (true) | Sc 20 "Far is a number." — he stops theorising about everyone else. Nobody corrects a theory unkindly; the count outgrows them. |
| **Boom ↔ Flash, zero replies** | Sc 9 | 6 spoken addresses (`a1_52`, `a2_14`, the turn-to-her at `a2_61`/`a2_62`, `a3_13`, `a3_24`, `a3_42`) + the chant slam (staged) | Never — the zero IS the physics; Sc 20 makes the sweetness explicit ("I tell her everything anyway."). |
| **Cloudia's "darling" barometer** | Sc 1 | holds Sc 1–8 (×17), BREAKS at Sc 9 (`a1_45`), back one line later strained (`a1_49`), holds to the end | Sc 23 "Mark him present, darling." — composure as hospitality. |
| **The gala** | Sc 1 "born for a gala, darling" | Sc 5 "Darling, I could weep."; Sc 8 "Is this the gala?" / "Darling. I believe it is." | Sc 18 — the grandest check-out in the history of the trade; she got her gala and it left through the wall. |
| **"There are no stairs."** | Sc 3 (canon verbatim) | Sc 3 (the lift arrives) | Sc 18 (`a3_01` — the check-out "through the floor"); the hotel's two exits are the two vertical halves of a storm. |
| **The lift chain** ("Going up.") | Sc 3 | Sc 4, Sc 8 — each one a coat of ice | Sc 11 "Going down." — the downdraft that becomes the gust front; the whole vertical physics of a storm in four words. |
| **Blue's "First!"** | ep 3 | Sc 12 — RIGHT, once, for good | Sc 12 — the button flipped; the 90f stunned beat; the arc complete and kind. |
| **Sunny's precision** | Sc 1 ("Every bit of that warm is me.") | Sc 3 (hot/hurry), Sc 5 (hot + up), Sc 7 (disclaims the crackle), Sc 14 (still up here), Sc 18 (the rain is his water), Sc 22 (never left), Sc 25 (surface vs inside), Sc 26 (the moon) | Never — the steady state: every claim true, the Narrator checks each, his ego is fine. |
| **The kid's fingers** | Sc 2 | every count | Sc 23 (ten, nothing) and Sc 26 (ten fingers at a flash they cannot hear — and a wave). |
| **The volcano's lit summit** | Sc 1 | every coastal wide; the dark act three especially | Sc 16 "Louder than me. Well done." — the horizon speaks once; Sc 26 the storm leaves and he is still there, with a moon over him. |
| **Stony** | Sc 6 (the big one at the back) | Sc 8 (the most trips), Sc 18 (bounces once, sits on the step) | Sc 22 — the last to melt. Zero lines, zero cost. |

### Ensemble engines — the reply budget (protect these; cuts come from texture, never engines)

| Engine | Colliding wants | Scenes | Replies in this draft |
|---|---|---|---|
| Boom ↔ Narrator (central — the count) | on time vs the number | 11, 12, 13, 15, 16, 19, 20, 21, 25 | ~20 |
| Boom ↔ Flash (asymmetric by design) | he talks, she has left | 9, 11, 16, 19, 20, 21 | 6 addressed, **0 answered** — the zero is the physics |
| Cloudia ↔ Puff / Drip (the tower) | a composed hotel vs a building going vertical | 3, 4, 5, 6, 7, 8 | ~10 |
| Cloudia ↔ Boom (whose noise is this) | the register vs a newborn with a schedule | 9, 14 (via the Narrator), 16, 23 | ~5 |
| Boom ↔ Blue (first vs on time) | first vs punctual — both right | 12 | 3 |
| Sunny ↔ Narrator (the precision rail) | his part, loudly, vs the check | 1, 3, 5, 8, 14, 18, 22, 25, 26 | ~10 |
| Cloudia ↔ Narrator (the two frames) | hotel time vs window time | 14, 23 | 3 |

### Physics-honesty ledger (the gate — union of A §7 and B §6 plus the synthesis guards; all held)

- **Simultaneity is STAGED, not asserted.** Boom is born beside Cloudia
  and she hears him INSTANTLY (`a1_48`, zero distance); the same recording
  arrives at the window six counts later (`a2_12`) and three counts later
  (`a2_25`). The lesson is played as sound a full act before it is said
  (`a2_38`). HELD.
- Flash and Boom leave the cloud in the same instant, from the same
  crackle (`a1_47`, `a2_73`). "Late" is asserted as true by the Narrator
  for the last time at `a1_60`; from `a2_38` on, every gap is named as
  distance. HELD.
- **Even at count zero, light is first.** At the overhead strike she is in
  the frame one frame before he speaks; Boom never claims "first", only
  "on time" (`a2_30`); the Narrator never says "together", she says "I did
  not get to one." (`a2_60`). HELD.
- **The count shrinks because the STORM moves, never because Boom speeds
  up.** His "catching up" theory is corrected as half-right — the hotel is
  moving (`a2_54`); the Narrator names the hotel as the thing that moved
  (`a2_37`, `a3_22`). Boom's speed is 1.0 on every line. HELD.
- **Three counts to a kilometre is honest to the word "about"** (sound ≈
  343 m/s → 2.9 s/km, `a2_39`); the parent aside "about five seconds a
  mile" is also honest (4.7 s). TRUE.
- **The count IS seconds:** each number clip + gap = 30f (production gate).
  "How far the hotel is" is the kid-level phrasing; the bolt leaves the
  hotel, so the distance is the hotel's to within the storm's own size —
  honest at this scale. GATED.
- **The no-boom flash is honest ONLY because the storm is far:** thunder is
  rarely heard beyond ~15 km, so the Narrator says "more than fifteen
  kilometres, that is forty-five counts" (`a3_62`). **A ten-count flash
  (3.3 km) is never silent** — the script does not let one go silent. The
  arithmetic "four and a half kids" (forty-five fingers) is exact (`a3_63`).
  TRUE.
- Hot ground → warm air rises fast (`a1_02`, `a1_07`) — the ep-2 law
  redeployed; the updraft (Puff's lift) carries drops up. TRUE.
- Tall convective clouds flatten on top (`a1_17`) — the SHAPE named, the
  reason not (no tropopause). HELD.
- The top of a thunderhead is above the freezing line; drops carried up
  freeze; **hail = drops carried up and down the tower, freezing layer on
  layer** (`a1_25`, `a1_40`; the lift chain IS the layering; Stony has the
  most trips). TRUE.
- **Charge separation at kid level:** icy guests rubbing past each other
  build a crackle; "the top floor has gone one way, the lobby the other"
  (`a1_33`–`a1_34`); no positive/negative, no electrons, no plasma. The
  balloon-on-hair crackle is the SAME phenomenon at kid level and the
  Narrator says "tiny" (`a1_32`). TRUE.
- **LIGHTNING:** the crackle jumps — a channel to the sea or across the
  sky; over in a blink; "most of the time she does not touch the ground"
  is implied by the sideways bolts (Sc 15, 16); nothing on screen is
  struck — no tree, house, creature, rod, drill. HELD.
- **THUNDER:** the bolt heats the air so fast it jumps out of the way all
  at once — same instant, same place, one event (`a2_73`). TRUE.
- **The MYTH:** clouds are a zillion tiny drops floating together; two of
  them meeting make no sound at all (`a2_70`–`a2_71`, demonstrated); the
  icy guests upstairs DO rub shoulders and that IS the crackle, but the
  BANG is the lightning's heat (`a2_72`). Stamp CLOUDS DO NOT BUMP. TRUE.
- **The gust front** (`a2_02`–`a2_05`): cold air falls out of the storm's
  base and runs ahead along the ground; the kid feels the storm before
  hearing it. Honest and in storm order (after the first lightning, before
  overhead). TRUE.
- **The rumble:** a channel is kilometres long, so its sound arrives over a
  span; hills reflect it (`a3_39`). Overhead thunder is a sharp CRACK;
  distant thunder is a low RUMBLE — the sound design follows this; Boom's
  far "Present!" firings are the same recording at lower volume, never
  re-performed. TRUE.
- **Sound spreads and quietens with distance** — Boom's rig grows and
  softens as he travels; the tight small sharp Boom is the near one. HELD.
- **Hail falls at the storm's peak** (Sc 16, 18) on grass, nobody under it;
  small hail melts on the way down (Drip lands as a drop, `a3_07`); the
  rest melts to puddles by morning (`a3_48`). Rain and hail ARE Drip. TRUE.
- **Every Sunny claim is individually true:** the ground's warmth is his
  (`co_05`); "the hot is me, the hurry is his" (`a1_07`); the hot and the
  up are his, the hotel is hers (`a1_20`); the crackle is NOT his — the
  collisions did it (`a1_35`); he is still shining above the cloud and his
  heat built it (`a2_48`); the rain is water he lifted that morning
  (`a3_04`); he was behind the storm, never gone (`a3_45`); his surface is
  about five and a half thousand degrees, his core about fifteen million
  (`rc_08`–`rc_09`); he can explain the moon's phases (`rc_17`). **He never
  claims the bolt's heat** — the one thing in the sky hotter than his
  surface, and he concedes the surface. TRUE, each checked on screen.
- **Blue is light** — he arrives with Flash because light arrives with
  light; the flipped button is physically true on every flash in history
  (`a2_26`). TRUE.
- **Cloudia's two frames are both true** and the Narrator says so twice
  (`a2_47` "Yes."; `a3_66`–`a3_67`): at the source, flash and boom are
  together; at a distance, they are not; the difference is the distance.
  No frame is wrong. HELD.
- Lightning ≈ 30,000 °C vs the Sun's surface ≈ 5,500 °C — "about five
  times hotter than the surface" (`rc_07`); the Sun's core ≈ 15 million °C
  (`rc_09`). TRUE.
- Lake Maracaibo, Venezuela — Catatumbo lightning, storms on well over a
  hundred nights a year (`rc_11`). TRUE.
- "You have never heard a thunder that was not already over" (`rc_13`–
  `rc_14`); the balloon crackle is lightning, tiny (`rc_15`). TRUE.
- The moon at Sc 26 is half-lit — a phase a kid can check that week. TRUE.
- **The volcano rule:** awake, lit, island present, continuously visible in
  every coastal wide; his lit summit is the one steady light on the dark
  horizon in act three (continuity obligation turned into staging value).
  One line, 48f, `auto`, −6, 0.9, bubble from the mouth. HELD.
- **Out of scope stays out:** no charge signs, electrons, plasma, anvil
  mechanism, sprites, ball lightning, rods, strikes on anything,
  storm-safety drills beyond the window rule, tornadoes, hurricanes. The
  optional "never strikes twice" stamp is NOT fired. HELD.

### Laugh-gap self-map — CLAIMS ONLY

**This is a CLAIM for the showrunner to re-measure** (method rule: a
planning document's density self-score is not evidence — recompute from the
generated manifest with real timeline arithmetic; visual-only business does
not feed the laugh clock; the counts are metronome, not laughs, though the
kid's hand keeps them from reading as air). Grades at age six, spoken lines
only; estimates assume ~2.8s/line plus written gaps and 30f per count.
Audited FIRST, per the synthesis: the cold-open nine-count (Sc 2), the
diagram + lesson stretch (Sc 13–14), the rumble + ten-and-nothing stretch
(Sc 21–23 — two long counts back to back).

| Stretch | Est. window | Spoken laugh beats claimed | Est. worst gap |
|---|---|---|---|
| Cold open Sc 1 | 0:00–1:10 | "I invented mornings!"; "Every bit."; HA!-HA! 1; "Same hotel."; "I am known for drizzle."; "She does not know that yet." | ~15s |
| Cold open Sc 2 | 1:10–2:30 | **the nine-count itself (deadpan room) → "There he is."**; "Even the card said so." | **~25s claimed — the window-rule sentence + nine seconds of count before the first spoken beat; the kid's fingers are the picture. Recompute; fallback = a six-count.** |
| Act 1 Sc 3–4 | 2:30–3:50 | "There are no stairs." / "There is now a lift." / "Darling."; "The hurry is his."; Drip's entrance (5th); "The weather is the management."; "It made one." | ~15s |
| Act 1 Sc 5 | 3:50–5:00 | "I shall keep it, darling."; "Who put a hotel in front of me?"; "The up runs on the hot!"; HA!-HA! 2; "Darling, I could weep." | ~20s (the flat-top sentence is the only pedagogy run) |
| Act 1 Sc 6–7 | 5:00–6:20 | "I have never been this big."; roll call + "Hi, Stony."; "Every guest on the top floor is called Hail."; "I am one of them now."; "why is my hair doing that."; the balloon kid-check; "full of crackle"; "I would like that written down." / "Written down." | ~22s (the balloon line is long; the STATIC card sits inside it) |
| Act 1 Sc 8 | 6:20–7:30 | "I am bigger again!"; "You are enormous."; "Up, darling. Down. Up. That is a hotel."; "Is this the gala?" / "I believe it is."; "The hotel cannot hold it, darling." | ~18s |
| Act 1 Sc 9–10 | 7:30–9:10 | the BREAK line; Flash intro; **"Present!"** (source); "Who is making that noise?"; "did not even take a towel"; the 45f no-reply + "She is quick."; "Lovely hotel. Bye."; "He did not check in."; the cut + "Keep counting." | ~20s |
| Act 2 Sc 11 | 9:10–10:40 | "Going down."; catch-phrase; "I always run ahead."; six-count → "Present!" 2; "I am over here."; "Six whats?" / "Counts." / "Counts of what?" / "You."; theory 1 | ~20s (the count is the only unspoken stretch) |
| Act 2 Sc 12 | 10:40–11:50 | "Sorry, sea!"; "Present!" 3; the flipped button; **90f stunned**; "He does not have a line for it."; "Good team."; "Sorry, curtain!" | ~15s (the 90f is the laugh) |
| Act 2 Sc 13–14 | 11:50–13:30 | "faster than everything"; "I am a kilometre?"; **the lesson run (`a2_38`–`a2_40`) is the diagram stretch — three Narrator sentences back to back, Boom standing in it**; "Distance." / "I have a lot of that."; "Everybody keeps counting at me."; "Then the window is far, darling." / "Yes."; Sunny through the cloud | **~30s claimed (`a2_38`–`a2_40`) — the episode's one pedagogy run; the character inside it is Boom's "Distance." button. Recompute FIRST.** |
| Act 2 Sc 15–16 | 13:30–15:10 | "Present!" 4; "The ground is moving." / "Half right."; "I will take it."; "Present!" 5; "nearly none"; **THE BREAK** + "I did not get to one."; the run-on; "She has gone again."; "Well done." + translation; "That is my noise, darling." | ~20s incl. the 60f + 45f holds (deliberate) |
| Act 2 Sc 17 | 15:10–16:30 | "We do not bump. We mingle."; the stamp + "Big myth. Busted."; "I have listened for years." / "Nothing, darling."; "The bang is her."; THUNDER card; "I am the jump." / "The loud part is the best part." | ~20s |
| Act 3 Sc 18–19 | 16:30–17:50 | "There are no stairs."; "I hate gravity."; "the history of the trade"; "MY WATER!" + HA!-HA! 3; "travel-sized again."; "Present!" 6; "I have not changed one thing." / "Didn't I?" / "You did." | ~18s |
| Act 3 Sc 20 | 17:50–19:10 | six-count → "Present!" 7; the working-out; "Did you hear that?" / "I tell her everything anyway."; stamp; **"Count me."** + 60f + "We will." | ~25s (the turn — deliberate; warm, not a sag) |
| Act 3 Sc 21–23 | 19:10–21:30 | **nine-count → "Present!" 8 (rumble)**; "I am very long."; "They let me arrive twice."; "That was a good one."; "He is still all Boom."; "I never left!" / "All true."; goodbye roll call + "called Puddle."; "big for an hour"; **ten-count + 120f** → "four and a half kids."; the hotel cut "Present!" 10 + "Mark him present, darling."; "Both true." / "That is the whole thing." | **~30s claimed at the ten-and-nothing (count + hold + the nothing line) — the two long counts are ~15s apart in spoken beats; the kid's hand is the picture through both. Recompute FIRST.** |
| Recap Sc 24–26 | 21:30–23:00 | the chant + Boom's late slam; "Thunder is FAR."; the Sun fact + 60f + "Only the surface." + HA!-HA! 4; Maracaibo + "I am busy."; "I have already happened."; "You will not need any fingers."; "I CAN ANSWER THAT ONE!" / "He can. He will." | ~20s (the awe hold is deliberate) |

Claimed cadence: a spoken kid-graded beat every ~18–25s; three stretches
flagged near or over 25s — the cold-open nine (structural, with a named
fallback), the lesson run (the one pedagogy stretch, Boom inside it), and
the ten-and-nothing (the spine). None claimed over 35s; all three to be
recomputed from the manifest before belief.

### TTS-risk fallbacks (pre-written, per the ep-4 rule)

- **One-word clips are the episode's highest-risk class:** the ten count
  numbers (kokoro), "Present!" (`a1_48`, MiniMax — fires ten times),
  "Present." (`a2_59`), the chant (`rc_02`–`rc_04`, kokoro), Boom's
  "Distance." (`a2_41`), Cloudia's "Darling." (`a1_05`), the Narrator's
  "Six." / "Counts." / "You." / "Yes." First fix is diagnosis: measure
  seconds-per-word; a bad draw gets a cache-bust re-roll with identical
  text (cents); a phrase/voice mismatch gets the fallback below.
- **The count numbers (kokoro, deterministic):** if a number clips or
  reads oddly, respell in the clip only (the kid's fingers carry the
  number on screen; no bubble): "One." → "Wun."; "Two." → "Too."; "Four."
  → "For."; "Eight." → "Ate."; "Ten." → "Tenn." Re-measure the grid after
  any respelling — the gate is clip + gap = 30f, and a respelled clip is a
  different length.
- **"Present!" (the chain source):** (1) cache-bust re-roll on s/word; (2)
  respell "Prez-ent!" in the clip (bubble keeps PRESENT!); (3) if the word
  itself breaks on the cast voice on every draw, the chain word changes to
  **"Here!"** for ALL ten firings (one recording; the break becomes "Here."
  and `a3_65` becomes "Mark him here, darling."). The Narrator-led
  fallback is REFUSED for this chain — she never says his word.
- **"Present." (the break):** must be audibly the same word as the source
  at a different temperature; if `auto` reads it as a question, the
  fallback is the same text at cast `happy` with the 60f hold doing the
  quiet (the hold, not the read, is the joke).
- **Chant respellings, if a word breaks:** "Static!" → "Stat ick!";
  "Lightning!" → "Light ning!"; "Thunder!" → "Thun der!". **Narrator-led
  chant fallback (whole-unit swap):** one clip — "Say it with me. Static,
  then lightning, then thunder." — the cards carry the words in print;
  `rc_05` unchanged.
- **"Hailey"** must read HAY-lee (not "Haley" as "HAL-ee"); fallback
  respelling "Hay-lee" in both runs (`a1_27` and `a3_47` — the two runs
  must match; bubbles keep "Hailey").
- **"Maracaibo"** — the Narrator says it (kokoro); if it mangles, respell
  "Mara-kye-bo" in the clip. Never dropped — it is the look-it-up slot.
- **"Didn't I?"** (`a3_13`) — a two-word MiniMax question; if it reads
  flat, the fallback is "Did I not?" (same beat).
- **Boom's run-ons** (`a1_50`, `a2_20`, `a2_61`, `a3_12`, `a3_23`) — long
  MiniMax lines at 1.0; if the engine inserts breaths that break the
  run-on, split at a comma into two clips with a 6f gap (never a pause
  marker). The audition should include `a2_61` for exactly this reason.
- **The kokoro aliases** (`a1_59`, `a2_15`, `a3_67`, the counts) are
  byte-identical by engine; the generator must copy the SOURCE's exact
  voice/speed fields or a different read results.

### Ear-check list (in order)

1. **Boom's audition trio FIRST** — `BOOM_MINIMAX_VOICE` is provisional;
   measure (median f0, IQR, chars/s, centroid) against Rock's and the
   volcano's committed clips and against every neighbour in this episode,
   then listen to: **`a1_48` "Present!"** (the chain source — approve it
   before anything downstream is built), **`a2_61`** (his longest run-on,
   after the break — swelling, happy, never a boom-box), **`a3_27` "Count
   me."** (warm, not defeated). A voice that passes all three is cast.
2. **`a2_59` "Present."** — the break; the same word at a different
   temperature, one frame after the loudest noise in the episode.
3. **`a1_45` Cloudia's break** ("Somebody has just left through the
   wall!") and **`a1_49`** ("Darling. Who is making that noise?") — the
   drop and the strained return, back to back.
4. **The ten count clips** — s/word pass AND the grid measurement (clip +
   gap = 30f, every alias). This is the gate.
5. **The two migrated clips in this mix** (`a1_09`, `a2_03`) — approved in
   other episodes' mixes; listen once here.
6. **Blue's three** (`a2_21`, `a2_29`, `a2_32`) at 1.05 — healthy band
   0.31–0.36 s/word; an outlier is a bad draw, not a recast.
7. **`a2_63` the volcano** at −6, 0.9 — the butler read; the leading dots
   are the 48f gap, not the clip.
8. **`a1_27`/`a3_47` roll-call runs** — five names; do they separate at
   1.0? "Hailey" pronunciation check.
9. **`a1_06` "Going up."** and **`a2_02` "Going down."** — the lift chain
   source and its break.
10. **The chant one-worders** (`rc_02`–`rc_04`) against the pre-written
    fallbacks; and `rc_05`'s "FAR" at kokoro emphasis.
11. **Narrator 0.9 lines** (`a1_61`, `a2_47`, `a2_60`, `a3_62`, `a3_68`,
    `rc_16`) — the quiet must come from words and speed alone.
12. **Sunny's shouted interruptions** (`a2_48`, `a3_04`) — kokoro caps
    read as emphasis, not as letters.

### Showrunner edit-pass rulings (2026-10-26, mandatory pass before TTS)

- **Script ACCEPTED at 198 spoken lines + 52 count firings** — no trims
  taken (ep-3/ep-5 lesson: structure, not count, decides the verdict; every
  listed trim is texture the cadence map credits). The trim order in
  deviation 1 stays recorded for Mike's pass.
- **`co_02` reworded**: "the island that was not there last show" → "the
  brand new island he made last show" (canon: Ember's island was BORN in
  ep 5 — it was there; the kid saw it on the ep-5 end card).
- **All 22 deviations ACCEPTED as drafted**, notably: the afternoon-rewound
  glue line (2); "rubbing past" in the roll-call middle so "bump" belongs
  to the MYTH stamp (4); `a2_62` on cast `happy` — the two-`auto` budget
  wins (6); 1.0 on the break and "Count me." — sound has one speed (7);
  "Ten." keyed at its earliest firing (8); "All true." for three claims
  (11); the four-and-a-half-kids arithmetic fix (12 — the synthesis was
  wrong; Math would have caught it); three one-word kokoro chant clips
  (17); Drip's buttons on her locked `happy` (19 — her casting is "happy
  throughout"; unseasoned = nothing added); `a3_44` tie-back kept, CUTTABLE
  (16).
- **Cold-open nine-count STANDS** pending the manifest; the six-count
  fallback is pre-wired. STATIC→LIGHTNING spacing and the three flagged
  stretches are recomputed from the manifest by the narration wave
  (cadence report), not believed from this file.
- **Sunny's long all-caps kokoro lines (`a2_48`, `a3_04`)** stay as
  written — kokoro reads caps as emphasis (five episodes of precedent) —
  but they are ear-check item 12 and the fallback is sentence case with one
  capped word per clause.
- Migration sources verified on disk by the writer; the narration wave
  re-verifies and seeds the cache before the first run.

- **SCENES 7 AND 8 REORDERED (edit pass, after the narration wave's cadence
  report):** the crackle + STATIC card (old Scene 8, first six lines) now
  plays BEFORE the up-down-up hail beat and the gala exchange, so the STATIC
  and LIGHTNING cards sit ~a minute apart (manifest: 53.3s after the
  reorder, 30.3s before; STYLE: at most one card a minute). Keys renumbered to keep
  strict playback order (old `a1_36`–`a1_41` → `a1_31`–`a1_36`; old
  `a1_31`–`a1_35` → `a1_37`–`a1_41`; `a1_42`–`a1_44` unchanged); the
  narration wave re-keys the clips by cache migration (renames, zero
  re-buys). Rejected: the writer's fallback of moving the card onto the
  roll-call middle `a1_29` (a card entering between a roll call's middle
  and its button kills the button).
- **The count grid is an ONSET grid.** Kokoro pads each number clip with
  ~0.43s of leading and ~0.52s of trailing silence (clips measure 38–43f;
  the spoken word is 12–15f), so `gap = 30 − clipFrames` goes NEGATIVE
  (−9 to −13f) and consecutive number clips overlap in silence. That is
  the implementation: each number STARTS exactly 30f after the last. The
  script's speed-override fallback is WITHDRAWN (the silence shrinks with
  speed too; fitting 30f needs ~1.4 and rushes the word). Staging must
  tolerate overlapping same-speaker turns (the Narrator has no body).
- **Boom cast PROVISIONALLY as `English_magnetic_voiced_man`** (the
  narration wave's measured recast after the audition winner
  `English_FriendlyPerson` measured 104.9 Hz across his 36 real lines —
  dead on Rock 104.9 and the volcano 105.8; the pick sits at 128.3 Hz,
  +3.5 st / +3.3 st clear, +1.4 st from Sunny). Cost: brighter and less
  resonant than the brief asked for. FriendlyPerson's takes are kept on
  disk for a free restore if Mike prefers the giant — but `a2_63` (the
  volcano) follows Boom's `a2_62` directly. Mike's ear rules; shortlist in
  `scratchpad/ep6_boom_audition/MEASUREMENTS.md` §8.
- `a1_08` "Correct. Both halves." confirmed at 0.92 (the production notes
  were right; the stage direction omitted it). Blue's `a2_32` measured
  0.486 s/word (band 0.31–0.36) → one cache-bust re-roll, keep the better
  measured take.

### Deviations from the synthesis, flagged

1. **Line count: 198 spoken lines** (plus 52 count firings) vs the
   synthesis's "~160–175 expected". Beats rule (no target), but the overage
   is flagged. Boom carries 44 firings (36 recordings) against the
   treatments' ~36/28 — the mechanism act was written to be the funniest,
   and most of the extra is his. The pre-agreed trim order if the
   showrunner wants it under 180, texture only, no engine touched: `a3_44`
   (CUTTABLE tie-back), `a2_64` + `a2_63` (the volcano pair), `a3_07`
   (travel-sized), `co_27`, `a1_13`, `a1_40`, `a2_01`, `a2_33`, `a2_43`,
   `a2_66`, `a3_50`, `rc_01`, `a1_02`, `a2_05`, `a3_05`, `a1_42`+`a1_43`
   (the gala exchange — but see deviation 14), `a2_34`, `a3_41`, `a3_42`.
2. **Act one is the afternoon REWOUND** — `a1_01` ("That tower was a small
   grey hotel this morning. Here is how it got up there.") is invented
   glue so the cold-open tower (B's S2) and A's hotel-goes-up act one can
   both exist, and the act-one cut (Scene 10) can rejoin the cold open's
   nine seconds. Neither treatment states the time-frame; the synthesis is
   silent. Cuttable only if the showrunner prefers the jump unexplained.
3. **The drizzle hotel sits in the cold open** (Scene 1, A's S2 shape) and
   "Different show. Same hotel." fires there — the synthesis places the
   firing "at the drizzle hotel's entrance" without saying which act; B's
   lobby-first act one would have put it after the title.
4. **Roll-call middle verb is "rubbing past each other" (A), not B's
   "bumping into each other"** — so the word "bump" belongs to the MYTH
   stamp alone (CLOUDS DO NOT BUMP.) and a six-year-old is not handed
   "bumping builds the crackle" one act before "we do not bump".
5. **"I shall keep it, darling."** — A's "I shall keep it." gains the word,
   because every composed Cloudia line carries it and this one is composed
   (the only darling-less lines are the break and the verbatim canon
   quote).
6. **"She has gone again." (`a2_62`) carries cast `happy`, not `auto`.**
   The synthesis §2 asks for `auto` on it AND limits Boom to exactly two
   `auto` lines (the break, "Count me."); the brief's two-line budget wins.
   The flatness comes from the words and the 45f hold in front of it. If
   the showrunner wants it `auto`, the budget becomes three — a one-field
   change.
7. **The break and "Count me." are at 1.0, not 0.95.** The synthesis §2
   and §4 quote B's 0.95 on both while §4 rules "1.0 on every line
   forever" (A). The 1.0 ruling is the character (sound has one speed);
   the quiet is `auto` + the holds. Flagged because the synthesis says
   both.
8. **"Ten." is keyed `a3_60`, not in the cold-open block.** The nine
   cold-open numbers are the earliest firings of "One."–"Nine."; "Ten."
   first fires in Scene 23, so by the earliest-firing rule its recording
   lives there. The ten recordings are therefore `co_15`–`co_23` + `a3_60`.
9. **"There he is." at the act-one cut is a kokoro alias** of the cold
   open's (`a1_59` → `co_24`) — intent-locked: the same seconds, the same
   sentence. Not in either treatment.
10. **B's hail-start line for Drip ("Going down. I am going down big.") is
    DROPPED** — "Going down." is Puff's break and must stay one voice. The
    hail starts on a Narrator line instead (`a2_66`).
11. **"Both true." fires twice**, `a2_31` (source) and `a3_67` (alias) —
    A14 accepted; Sunny's three-clause return gets a fresh "All true."
    (`a3_46`) because "Both" would be false arithmetic over three claims.
    The synthesis's "A's 'Both true.' as the episode's last line is KEPT"
    is read as the last line of ACT THREE (`a3_67`, then `a3_68` "That is
    the whole thing."); the end card's last spoken line is "He can. He
    will." per the same ruling.
12. **"You would need four and a half kids." (`a3_63`)** — the synthesis's
    "four and a half MORE kids" is wrong arithmetic (forty-five fingers is
    four and a half kids in total; "more" would make fifty-five). Math (8)
    would catch it. Fixed to the exact count.
13. **The Narrator's "Yes." (`a2_47`) and Boom's "She has gone again."
    (`a2_62`) and "Didn't I?" (`a3_13`)** are split clips with held beats
    in front of them — the treatments' leading ellipses and em-dash are
    the gaps, never in the clip text (ep-5 precedent).
14. **A's "Is this the gala?" / "Darling. I believe it is." (`a1_42`–
    `a1_43`) is grafted into Scene 8** (post-reorder: after the up-down-up beat) as texture between the STATIC
    card and the LIGHTNING card — the two cards would otherwise sit a few
    sentences apart. If the manifest shows a full minute between them
    without it, it is cuttable; if not, it is load-bearing.
15. **Boom's "I am walking as fast as I can…" (`a2_34`)** is an A device
    (the hero narrating his own diagram) grafted into B's lesson scene —
    the diagram-sag rule wants a character beat inside the drawn
    geometry, and A's is the better one. Cuttable.
16. **`a3_44` ("He was a rumble this afternoon as well, on the very first
    count. You had not met him yet.")** is an invention that makes the
    cold-open SFX rumble retroactively his — honest, and it closes a loop
    an attentive eight-year-old will otherwise open. CUTTABLE.
17. **The chant is three one-word kokoro clips** (`rc_02`–`rc_04`), not one
    clip — one voice (rule 15) either way; three clips let the three slams
    land on the words and Boom's slam sit a beat behind the last without
    measuring `beats`. If the showrunner prefers one clip, the fallback
    one-liner in the TTS notes is the shape.
18. **The goodbye roll call is one clip** (`a3_47`), the greeting two
    (`a1_27`/`a1_28`) — the ep-5 precedent (the Stony beat lands once; a
    goodbye reads as one breath). B split both.
19. **Drip's buttons stay on her locked cast `happy`** (`a1_30`, `a3_49`),
    not `auto` — her casting is "`happy` throughout" (bible), unlike
    Ember's, whose buttons went `auto` in ep 5. "Unseasoned" is honoured as
    nothing-added staging. Flagged because the STYLE deadpan rule says
    "buttons stay unseasoned (`auto`)"; a two-field change if the
    showrunner rules the other way.
20. **The volcano's translation line (`a2_64`) is kept with his line as a
    CUTTABLE pair** — the synthesis says the Narrator "may" translate;
    written in, flagged, cut together or not at all.
21. **Boom's "Nobody has ever counted how far I am before." is folded into
    the working-out run-on (`a3_23`)** rather than its own clip — the
    synthesis says "may be folded in"; folded, to keep the turn's shape
    tight before "Count me.".
22. **STATIC → LIGHTNING spacing is a manifest check, not a certainty:**
    the card fires at `a1_33` and LIGHTNING at `a1_46`, with Cloudia's
    fault report, Sunny's disclaimer, the gala exchange and "cannot hold
    it" between them (~55–65s claimed). If it measures under a minute, the
    fix is to move the STATIC card EARLIER — onto the roll-call middle
    `a1_29` ("It builds up.") — not to delay LIGHTNING, which belongs on
    the flash.

**Sound-word spellings:** none of consequence — no WHOOSH, no stretched
vowels anywhere (nothing on kokoro needs one; MiniMax forbids them). The
thunder's CRACK, the rumbles, the gust at the window and the hail on the
lawn are staged sound design, never narrated — **the Narrator says "Boom"
only as his name**, and no MiniMax line carries a "BOOOOM". The only capital
inside MiniMax clip text in the whole episode is the canon "FEEL" in Puff's
migrated catch-phrase — which is precisely why it is migrated, never freshly
drawn. Every other MiniMax line is sentence-case; shouts are drawn as caps in
bubbles only (`a1_45` SOMEBODY LEFT THROUGH THE WALL!, `a2_21` FIRST!,
`a2_68` WE DO NOT BUMP. WE MINGLE., the chant cards). All caps in Sunny's and
the Narrator's lines are kokoro, where they are legal and read as emphasis.
