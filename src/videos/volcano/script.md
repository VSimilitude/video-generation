# Ember and the Mountain That Said Good Morning

**Series:** Little Big World (kids' educational), episode five
**Topic:** volcanoes and the rock cycle — the ground is not finished
**Audience:** six-year-olds — and the grown-up in the room
**Target:** the beats, not a number (runtime rule). Expect roughly fifteen to
eighteen minutes — fewer lines than episode four, far more held air.
**Shape:** cold open, three acts, recap. Thirty-one scenes, one hundred and
ninety spoken lines (one hundred and seventy-eight recordings; twelve
`sameAs` aliases; four cache-migrated clips). Line 190 is `a3_49b_narrator`,
added in the 2026-10-17 tweak (Scene 21; `ep5-decision-log.md`, top entry).

> **Ruling of record.** This script is the synthesis (`ep5-synthesis.md`)
> executed: Treatment B's act architecture with Treatment A's spine gag
> grafted on. Where this file and any treatment disagree, the synthesis
> already ruled and this file follows it; where the synthesis is silent, B
> rules structure and A rules the spine gag, and every invention is in the
> deviations ledger. Title per the synthesis. Hero name Ember, per the
> synthesis.

The companion file `narration.mjs` will hold the exact text sent to the
text-to-speech model. Every line below is written to be quoted verbatim; if a
line changes, it changes in both files.

## Cast and voices

| Character | Engine | Voice | Speed | Who they are |
|---|---|---|---|---|
| **Narrator** | kokoro | `af_heart` | 1.0 | Warm storyteller, returning. House flat 0.92, deadpan floor 0.9. Owns the fuse close, both roll-call middles, and "Different show. Same ___." Voice only — no body, ever. |
| **Ember** | minimax | **NEW voice — `EMBER_MINIMAX_VOICE`** (PROVISIONAL, overnight audition, Mike's ear pending) | **1.1** (suite's fastest — the speed is the want), **drops to 1.0 from her turn onward** (`a3_65` on; the arc is audible) | Our hero. A brand-new drop of lava, she/her, one minute old at her first line. Wants everything, immediately. Register target (synthesis, verbatim): small, bright, quick, GLEEFUL — indignation played inside delight, never whiny. Cast emotion `happy` on every line **except** her deadpan buttons and the break, which go `auto` per the STYLE deadpan rule (buttons stay unseasoned) — keys listed in the production notes. Seasoning budget 2: one `surprised` spent (`a3_03`, direction cited), one held in reserve. **No caps in any of her line text** — her emphasis is repetition and speed, never caps. Audition trio (hardest lines): `a1_08` (machine-gun opinion), `a2_12` (a flat "broken" verdict), `a3_87` (the break read — must land content, not defeated). |
| **The volcano** | minimax | `Elegant_Man`, **pitch −6** (reserved by Mike since ep 2, first use) | 0.9 | Co-lead by scarcity: **exactly 7 lines**, every one a tent pole (table in the production notes). Emotion `auto` forever — the butler read is the voice's job. **48f approach gap before every line** (new series record — the mountain deciding to move). No caps, no pause markers (his pauses are cut gaps), no body walk, no banter — staging vocabulary is "the mountain moved slightly and that is enormous." |
| **Rock** | minimax | `Deep_Voice_Man` | 0.85 | Returning (ep 2), promoted to mentor. `happy` on every line — locked casting, complete sincerity, zero irony. **24f fixed approach gap before every line** — identity, never escalated. Shortest sentences in the show. He was lava once: Ember is his childhood, he is her future. His ep-5 keys use `_rock` (ep-2's `_narrator` keying was legacy). |
| **Sunny** | kokoro | `am_puck` | 1.0 (0.9 on `a2_41`) | The Sun, returning at maximum altitude — four episodes of zero wrongness behind him. This is the ceremony episode: his first true wrongness, taken with the series' first stunned beat, recovered AS SUNNY. Kokoro means **no `emotion` field ever, no pause markers ever, no stretched vowels** — stops are words, slower `speed`, and his face. |
| **Drip** | minimax | `Lively_Girl` | 1.0 | Returning (ep-1 hero), demolition crew — rain is what crumbles mountains. `emotion: "happy"` on every line (locked casting). Entrance = her standing line, **fourth identical firing, cache-migrated**. |
| **Puff** | minimax | `Exuberant_Girl` | 1.0 | Returning (ep-2 hero), demolition crew — wind is the other half. Default `auto`; zero seasoned lines this episode. Entrance = his catch-phrase, **exactly once, cache-migrated** (the canon "FEEL" capital never gets a fresh draw). Also the loop's courier: he carries the first soil to the meadow and the first seed rides his wind back. |
| **Pip** | minimax | `Inspirational_girl` (PROVISIONAL per ep 4, Mike's ear pending) | 1.0 | One-scene cameo, rooted in the meadow exactly where ep 4 left her. **Zero emotion fields, zero pause markers, by design.** She grades the new island's first soil — the live order from ep 4, executed. "It will do." is a **cache migration** of `co_17_pip`, per the ep-5 budget. Plants take no steps; the seed that travels is Pipsqueak, silent. |
| **Blue** | minimax | `Decent_Boy` | 1.05 | One scene, two lines. `happy` (locked casting), 4f approach gap, ricochet law, apologises to things he hits. Claims "first" at the newest place in the world and is wrong twice — anti-Sunny seed watered, **payoff NOT fired**. |
| **Violet** | — | — | — | NO VOICE, NOT EVER. One silent garnish firing (Scene 22): already on an island that did not exist yesterday, noticed by nobody. Same body, amplitude blur. |
| **The kid** | — | silent, always | — | Silhouette. Fifth canon episode running (sixth counting drip-fork). Builds a sandcastle in the cold open — the silent builder-parallel runner — and holds the changed horizon on the end card. |
| **The magma crowd / the island chain** | — | silent | — | Crowd-with-faces rule: comedy cast that costs nothing. Bubbles only, if any. |

**Two engines.** The Narrator and Sunny stay on kokoro — free, local,
re-synthesized the moment a line is reworded. Everybody else with a body and
a line is MiniMax speech-2.8-hd (via Replicate). There are **no pause markers
in this episode** — every silence is a held beat between lines, in
`Video.tsx` — and emotion is seasoning: Ember, Rock, Drip and Blue carry
locked cast `happy`; the volcano is `auto` forever; Pip carries nothing; the
episode's ONE seasoned field is Ember's `surprised` at the skin-over
(`a3_03`), stage direction cited on the line.

## The Big Words

| Word | Act | Line keys | Treatment |
|---|---|---|---|
| **MAGMA** | One | `a1_02` | `WordCard`, in the cross-section descent. |
| **LAVA** | Two | `a2_05` | `WordCard`, slammed mid-flight, staged side by side with the MAGMA card and one arrow — same stuff, new name, as a picture. |
| **ERUPTION** | Two | `a2_01` | `WordCard`, as the doors open. |
| **EROSION** | Three | `a3_48` | `WordCard`, earned by the demolition crew. |

The dirt answer is a **STAMP on the returning ep-4 card** (Scene 28:
"CRUSHED MOUNTAIN + OLD LEAVES."), not a fifth Big Word.

## Line-key convention

`<act>_<number>_<speaker>`, in strict playback order, matching
`narration.mjs` exactly. Act prefixes: `co` cold open, `a1` downstairs,
`a2` the loud part, `a3` the newest place in the world, `rc` recap.

## How to read the held beats

Same contract as episodes two through four. A stage direction that reads

> **HELD BEAT — 45f (1.5s) after `a3_87_ember`.**

means: that line's `gapFrames` in `Video.tsx` is **45**, the picture is alone
on screen, and **nothing** — no line, no entrance, no emotion change — starts
inside it. Thirty frames is one second. These numbers are the script's;
raising one is a note, lowering one is a change to the joke. Two identity
gaps recur so often they are declared once here instead of per line: **every
volcano line takes a 48f approach gap** and **every Rock line takes a 24f
approach gap** — both are the character, not the gag, and are never
escalated. Held beats are the spine only — the wake, the ceremony, the
chain firings, the break — and ensemble business is allowed everywhere else
(ep-3 retro rule). **No emotion lead on held-beat scenes** (cut the staging
kit's 8-frame `useEmotion` lead to 0 wherever a HELD BEAT direction appears).

---

# COLD OPEN

*Roughly two minutes. A sandcastle, a knock, an unanswered claim, and the
end of the rules.*

---

### Scene 1 — The last quiet morning
**On stage:** Narrator (voice only), the kid (silhouette, silent), Sunny
**Visual:** The beach at dawn, the series' classic coastal wide. The volcano
sits on the measured horizon, unnamed and unlooked-at, exactly as it has for
four shows (the volcano rule holds through Scenes 1–2; nobody looks). The
kid kneels in the sand, building a sandcastle — towers, a wall, a moat.
**Lines:** `co_01_narrator`, `co_02_narrator`, `co_03_narrator`,
`co_04_sunny`, `co_05_sunny`, `co_06_sunny`, `co_07_sunny`, `co_08_narrator`

> **NARRATOR:** This is a story about the ground. The ground under your feet, the ground under this beach, the ground everywhere. Here is the secret about it. It is not finished.
> **NARRATOR:** Last time, somebody asked what dirt is actually made of. And somebody else said: send it here, I will grade it. That order is still open. Today it gets filled.

**The debt, named on screen** (synthesis: the cold open NAMES the ep-4
promise; act 3 and the recap pay it). The ep-4 card may ghost briefly over
the sky — print only.

> **NARRATOR:** Here is a beach. Here is a kid, building a sandcastle. Remember the sandcastle. It is doing something important.

**THE BUILDER PARALLEL — PLANTED, silent.** The runner is the kid patiently
stacking ground into a shape all episode at the frame edge; it pays off at
the mind-blowers (Scene 29). Zero lines, zero cost.

> **SUNNY:** GOOD MORNING, EVERYBODY!
> **SUNNY:** I invented mornings!

Series-constant greeting+brag pair, **five-for-five**, fired intact.

> **SUNNY:** That lovely warm sand is me! Enjoy the beach!
> **SUNNY:** You're welcome! HA! HA!

**"You're welcome! HA! HA!" — SOURCE, FIRING 1 of 4** (ceiling 8, hard; the
phrase is its own standalone clip so the aliases stay byte-identical;
firings 2–4 are `sameAs` aliases at `a3_47`, `a3_81`, `rc_14`).

> **NARRATOR:** The sand was warm. On top. Remember that as well.

**The half-claim, planted** — "on top" is the exact edge Sunny's precision
lands on in Scene 25. Deadpan, 0.92.

**Pedagogy:** Nothing yet — the cold open is promises: the dirt debt, the
sandcastle, the warm-on-top edge.

---

### Scene 2 — The knock
**On stage:** Narrator, Sunny, the kid (silent)
**Visual:** The same wide. A sound nobody in the series has ever heard:
enormous, deep, polite — ONCE. The sandcastle wobbles; the kid pats it back
together and keeps building. Nobody looks at the horizon (rule still holds —
this is the last scene it does).
**Lines:** `co_09_narrator`, `co_10_sunny`, `co_11_narrator`

> **NARRATOR:** And then the world knocked.

**HELD BEAT — 30f (1.0s) after `co_09_narrator`.** The wobble, the pat.
Then Sunny, instantly, at full wattage — the wake-claim, banked since
episode two, saved on purpose twice, fired at last **with its banked
direction: full confidence, no doubt anywhere in it.**

> **SUNNY:** OH, that one is me as well! HA! HA!

Banked verbatim, byte-exact. Not a "You're welcome!" firing — this is its
own phrase, its own single firing, the volcano thread's property.

> **NARRATOR:** Nobody had asked. He answered anyway.

**HELD BEAT — 36f (1.2s) after `co_11_narrator`.** No verdict, no doubt
cast — the claim just sits there, armed. The Narrator ALWAYS rules on him;
the withheld ruling is the fuse audibly hissing.

---

### Scene 3 — The rules end
**On stage:** Narrator
**Visual:** Thin smoke rises from the summit on the horizon. Still the
classic wide — the camera has not moved yet.
**Lines:** `co_12_narrator`, `co_13_narrator`

> **NARRATOR:** For four shows there has been a mountain on that horizon. Nobody looked at it. Nobody named it. Those were the rules.

**HELD BEAT — 30f (1.0s) after `co_12_narrator`.**

> **NARRATOR:** The rules are over.

**THE TURN.** The camera does the thing it has never done in five episodes:
it turns and faces the volcano head on, full frame. The licensed exception
begins; from this frame on, looking at him is legal forever.

---

### Scene 4 — Title, over the mountain
**On stage:** Narrator
**Visual:** The volcano, full frame, first time in series history. Thin
smoke curls. Title: **Ember and the Mountain That Said Good Morning.**
**Lines:** `co_14_narrator`

> **NARRATOR:** This is the story of the day the scenery woke up.

---

# ACT ONE — DOWNSTAIRS

*The world's basement, a newborn with opinions, and the first line the
scenery has ever spoken.*

---

### Scene 5 — The world's basement
**On stage:** Narrator, Sunny (muffled, CUTTABLE), the magma crowd (silent)
**Visual:** Cross-section descent from the beach: down through dirt, down
through rock, warmer, warmer — glow. The chamber: dozens of identical
glow-drops with faces (the episode's free crowd), perfectly content,
waiting. Drawn geometry WITH character beats inside it (diagram-sag rule).
**Lines:** `a1_01_narrator`, `a1_02_narrator`, `a1_03_narrator`,
`a1_04_narrator`, `a1_05_narrator`, `a1_06_sunny`, `a1_07_narrator`

> **NARRATOR:** The answer to the dirt question starts a long way down. Under the beach. Under the grass. Under the rock. Down where it glows.

**Big Word card: MAGMA.**

> **NARRATOR:** Deep down, the world is so hot that rock is melted. Melted rock has a name. Magma.
> **NARRATOR:** And here is the important part. That heat is the world's own. It is left over from the day the world was made. It has been down there the whole time.
> **NARRATOR:** It has nothing to do with the sun. Remember I said that.

**THE CEREMONY, PLANTED** (Act-1 plant, cashed at `a2_36`). The audience is
deputized a full act early — kids get to be ahead of the Sun. 0.92, plain.

> **NARRATOR:** The magma waits in the world's basement. Some of it has been waiting for ten thousand years. Nobody minds.

**LOAD-BEARING PAIR (`a1_06` + `a1_07` — showrunner edit-pass ruling:
promoted from CUTTABLE):** this pair is the cross-section stretch's only
spoken laugh beat; cutting it breaches the 45s ceiling (the writer's own
deviation 12). It stays, and any future cut must replace it with another
spoken beat inside the drawn geometry, not just remove it. From very far
above, through a kilometre of rock, muffled —

> **SUNNY:** If anyone down there needs light, I am available!

*Sunny interrupts a scene that is not about him* — one true firing (the
offer is genuine; he is available).

> **NARRATOR:** Nobody down there needed light.

**Pedagogy:** Magma named; the interior heat is primordial — the world's
own, not the Sun's (the ceremony's verdict, planted plainly).

---

### Scene 6 — Ember, mid-sentence
**On stage:** Narrator, Ember (first appearance), the magma crowd (silent)
**Visual:** One drop separates from the glow ALREADY TALKING — she enters
the series twelve words into a complaint, at maximum velocity, lapping the
chamber while the Narrator introduces her.
**Lines:** `a1_08_ember`, `a1_09_narrator`, `a1_10_ember`, `a1_11_ember`,
`a1_12_narrator`

> **EMBER:** and another thing. Nobody here has a schedule. I have been alive for one whole minute and nothing has happened.

Mid-sentence entrance — the clip starts lowercase on purpose. **Audition
line 1** (machine-gun opinion at 1.1).

> **NARRATOR:** This is Ember. She is one minute old. She has opinions.
> **EMBER:** Nothing down here moves. It is all broken.

**"___ is broken." — INSPECTOR RUNNER, FIRING 1 of 3** (fresh recordings,
pattern not chain; firings at `a1_10`, `a1_13`, `a2_12`; resolves at the
turn, Scene 23 — nobody ever corrects her, the world just holds still until
she re-grades it).

> **EMBER:** Hello? Big house? I would like to go outside now.

**HELD BEAT — 48f (1.6s) after `a1_11_ember`.** The volcano's identity gap,
fired as pure silence — she addresses the mountain and gets 48 frames of
nothing. The Ember↔volcano engine is asymmetric by design: many lines aimed
at him, two ever answered; the ratio is the joke.

> **NARRATOR:** The mountain heard her. The mountain answers everything. Eventually.

---

### Scene 7 — The broken door
**On stage:** Ember, Narrator, the magma crowd (silent)
**Visual:** The sealed vent. Ember inspects it like management, then tries
speed — and ricochets off. Tries again. The crowd's faces follow her with
mild wonder.
**Lines:** `a1_13_ember`, `a1_14_narrator`, `a1_15_ember`, `a1_16_narrator`

> **EMBER:** There is the door. The door is broken.

**Runner firing 2 of 3.**

> **NARRATOR:** It was not broken. It was closed. It had been closed for ten thousand years.
> **EMBER:** I tried it fast. Now I will try it fast again.
> **NARRATOR:** The magma crowd watched her with great interest. Nobody down there had ever been in a hurry before.

---

### Scene 8 — Warm things rise
**On stage:** Narrator, Ember
**Visual:** The whole chamber begins to move — UP. The crowd rises together,
serene; Ember rockets to the front of the queue.
**Lines:** `a1_17_narrator`, `a1_18_narrator`, `a1_19_ember`

> **NARRATOR:** Then the whole basement began to move. Up.
> **NARRATOR:** Warm things rise. You learned that in show two. It is also true downstairs.

Cross-episode rhyme, 0.92.

> **EMBER:** Now we are moving. Let's go, let's go, let's go.

Her speed rewarded exactly once — so the act break can take it away.

**Pedagogy:** Magma rises because warm things rise (ep-2 law, redeployed).

---

### Scene 9 — THE FIRST LINE (act-one climax; the series event)
**On stage:** The volcano (FIRST LINE EVER), Sunny, Narrator; the kid
(silent)
**Visual:** The summit puffs. CUT WIDE to the surface: Sunny mid-beam, the
kid mid-pat, everything frozen.
**Lines:** `a1_20_volcano`, `a1_21_volcano`, `a1_22_sunny`, `a1_23_sunny`,
`a1_24_narrator`

**HELD BEAT — 45f (1.5s) on the frozen wide, then the volcano's 48f
approach gap on top of it.** The world holds its breath, and then the
mountain decides to move. Ninety-three frames of stillness in front of the
series event — that is the point of five episodes of discipline.

> **VOLCANO:** Good morning. I appear to have overslept.

**V1 — the first line the scenery has ever spoken**, returning Sunny's
greeting four shows late. `Elegant_Man`, pitch −6, 0.9, `auto`.

**HELD BEAT — 60f (2.0s) after `a1_20_volcano`.** The world reels. Nothing
enters it.

> **VOLCANO:** Do pardon the ash.

**V2.** One small ash pop, ON the button — the butler register confirmed.

> **SUNNY:** GOOD MORNING?!

**HELD BEAT — 24f (0.8s) after `a1_22_sunny`.** Scenery has never greeted
him back.

> **SUNNY:** It said good morning. TO ME!
> **NARRATOR:** The mountain said good morning. It has excellent manners. Hold on to something.

**ACT BREAK.**

**Pedagogy / ledger:** The wake is a witnessed series event (synthesis: not
a reply to the hero downstairs). Sunny's rocked pair is kokoro — caps legal
there; the em-dash stammer of the treatment is carried by the cut between
two clips instead (deviations ledger).

---

# ACT TWO — THE LOUD PART

*The eruption as construction site, the world's slowest traffic jam, and the
ceremony four episodes in the making.*

---

### Scene 10 — The eruption begins
**On stage:** Narrator, the volcano
**Visual:** Fountains, glow, glory — staged as construction from the first
frame: nothing flees, nothing is harmed, the world leans in. **Big Word
card: ERUPTION.**
**Lines:** `a2_01_narrator`, `a2_02_volcano`, `a2_03_narrator`

> **NARRATOR:** The mountain opened its doors. All of them. At once.
> **VOLCANO:** Do excuse the noise. This is the loud part.

**V3** — over his own fireworks; the bigger the spectacle, the smaller his
apology.

> **NARRATOR:** He was not exploding. He was building. This is what a construction site sounds like, when the site is the whole world.

**Pedagogy / tone gate:** The eruption is BIRTH, never catastrophe — carried
by the character himself.

---

### Scene 11 — Ember out, and renamed mid-flight
**On stage:** Ember, Narrator
**Visual:** Ember rides the fountain into open sky — her best second ever.
The **LAVA** card slams mid-flight, staged side by side with the MAGMA card
and one arrow between them.
**Lines:** `a2_04_ember`, `a2_05_narrator`, `a2_06_ember`, `a2_07_narrator`

> **EMBER:** Outside! Sky! Everything! All at once!
> **NARRATOR:** Inside the mountain, melted rock is called magma. The moment it steps outside, it gets a new name. Lava. Same stuff. New name.
> **EMBER:** Nobody told me there was a name change. Was there paperwork? I was busy.
> **NARRATOR:** There was no paperwork. There never is.

**Pedagogy:** Magma/lava naming — the real convention, taught as a
bureaucracy complaint at terminal velocity. The rename gag IS the lesson.

---

### Scene 12 — The traffic jam
**On stage:** Narrator, Rock (returning), Ember
**Visual:** The flow pours down the slope… and slows. And thickens. And
STALLS — three seconds from the sea. Beside the flow, lit orange, warm at
last after centuries of sunshine: ROCK.
**Lines:** `a2_08_narrator`, `a2_09_narrator`, `a2_10_narrator`,
`a2_11_rock`, `a2_12_ember`, `a2_13_rock`

> **NARRATOR:** And then the fastest day of her life ran into the slowest traffic in the world.
> **NARRATOR:** Lava is slow traffic. The front of the flow grows a dark skin, and thickens, and stalls.

Physics-honest: flows skin over and stall.

> **NARRATOR:** Beside the flow, warm at last, sat somebody you have met before. Different show. Same rock.

**"Different show. Same ___." — firing 1 of 2** ("Same rock.", fresh blank,
0.92 flat; series blanks now: sun, sky, rain, air, beam, weather, rock).

> **ROCK:** Ohh yeah. That is the stuff.

**CACHE MIGRATION — Rock's catch-phrase, firing 1 of 2, ONE recording
forever:** the ep-2 take, copied from `wind/a2_08_narrator.mp3` (details in
the migration table). Same take, hotter cause: in ep 2 it was sunshine; now
it is a lava flow parking next to him.

> **EMBER:** This traffic is broken.

**Runner firing 3 of 3.** **Audition line 2** (the flat "broken" verdict).

> **ROCK:** It is resting.

24f approach gap (his identity — declared once, applies to every Rock line).

---

### Scene 13 — The crust (the spine gag debuts)
**On stage:** Narrator, Ember, Rock
**Visual:** Ember's edges go dark — she is growing a skin. She inspects
herself, files the verdict.
**Lines:** `a2_14_narrator`, `a2_15_ember`, `a2_16_rock`, `a2_17_narrator`,
`a2_18_ember`, `a2_19_rock`, `a2_20_rock`

> **NARRATOR:** And then Ember's edges went dark. She was growing a skin.
> **EMBER:** Done!

**"Done!" — CHAIN SOURCE, FIRING 1 of 4** (her crust). A verdict, not a
question: she declares things finished, prematurely, with delight. Fired at
escalating OBJECTS — her crust → the first black beach (`a3_10`) → the
growing island (`a3_22`) → the surfaced island (`a3_32`) — all `sameAs`
aliases of this key. The escalation is semantic, never temporal.

> **ROCK:** Started.

**"Started." — CHAIN SOURCE, FIRING 1 of 4** (aliases `a3_11`, `a3_23`,
`a3_33`). Byte-identical every time; his 24f approach gap is constant (the
gap is Rock's identity, not the gag's mechanism — synthesis ruling). The
clip text has no ellipsis; the dots the treatments wrote ARE the staged gap.

> **NARRATOR:** The dark skin is the lava turning back into rock. The outside cools first. The inside stays hot for a long time.

Physics-honest: the instant cooling is surface-only, and the show says so.

> **EMBER:** I decline. I have places to be.
> **ROCK:** You are not going somewhere.
> **ROCK:** You are becoming somewhere.

24f between his two sentences. **HELD BEAT — 30f (1.0s) after
`a2_20_rock`.** The episode's thesis as the driest possible correction;
nothing enters the hold.

**Pedagogy:** Cooling is hardening; hardening is rock; rock is new ground.

---

### Scene 14 — The unmoving countdown
**On stage:** Ember, Rock, Narrator
**Visual:** The two-hander proper: the fastest voice in the series parked
next to the slowest, both completely certain. Bus-stop staging.
**Lines:** `a2_21_ember`, `a2_22_rock`, `a2_23_ember`, `a2_24_rock`,
`a2_25_narrator`, `a2_26_rock`, `a2_27_ember`, `a2_28_rock`, `a2_29_ember`,
`a2_30_rock`, `a2_31_narrator`

> **EMBER:** How long until I am a mountain?
> **ROCK:** Ten thousand years.

**"Ten thousand years." — CHAIN SOURCE, FIRING 1 of 3** (aliases `a3_21`,
`a3_40`). Same number in both directions is the joke. Ember never repeats a
question — her verbal variety is her speed; the byte-identical repetition
sits on the mentor.

> **EMBER:** How long if I hurry?
> **ROCK:** No.
> **NARRATOR:** That was the whole negotiation.

0.92 flat.

> **ROCK:** I came out of there.
> **EMBER:** You were lava?
> **ROCK:** I was fast once.
> **EMBER:** How long have you been sitting here?
> **ROCK:** Since I stopped.

**HELD BEAT — 36f (1.2s) after `a2_30_rock`.**

> **NARRATOR:** Ember looked at Rock for a long time. Rock is what lava grows up to be. She was looking at her own future. It was very calm.

**Pedagogy:** The rock cycle as a family photograph — she is his childhood,
he is her future, sitting right there, content.

---

### Scene 15 — THE CEREMONY, part one: the claim
**On stage:** Sunny, Narrator, the volcano; Ember and Rock (on stage,
still); everyone
**Visual:** The eruption at full glory behind them — the whole sky lit, the
most undeniable picture the claim will ever get. Sunny at maximum altitude,
four episodes of a perfect record behind him.
**Lines:** `a2_32_narrator`, `a2_33_sunny`, `a2_34_narrator`,
`a2_35_volcano`, `a2_36_narrator`, `a2_37_narrator`

> **NARRATOR:** The eruption filled the whole sky. It was the biggest thing anybody had ever seen anybody do.
> **SUNNY:** I did that.

**Banked verbatim, reserved since episode two. Full confidence.**
**HELD BEAT — 60f (2.0s) after `a2_33_sunny`.** Nobody answers; the
eruption roars politely on.

> **NARRATOR:** No. He really didn't.

**Banked verbatim.** Gently. The verdict pair is spent here, exactly as
reserved.

> **VOLCANO:** If I may. The fire is mine. It came with the house.

**V4** — 48f approach gap; the politest correction in series history, and
the physics inside the butler register (synthesis: B's line wins).

> **NARRATOR:** He is right. Deep down, the world is still warm from the day it was made. I told you to remember. This is why.
> **NARRATOR:** That heat was never anybody's gift. It is the world's own. It is the one warm thing on this planet that was never his.

The Act-1 plant (`a1_03`/`a1_04`), cashed.

---

### Scene 16 — THE CEREMONY, part two: the fuse closes
**On stage:** Narrator, Sunny
**Visual:** The eruption glows on. Everyone still. This scene owns the
series' longest silence; nothing shares it.
**Lines:** `a2_38_narrator`, `a2_39_narrator`, `a2_40_narrator`,
`a2_41_sunny`, `a2_42_sunny`, `a2_43_sunny`, `a2_44_narrator`

> **NARRATOR:** A long time ago, I told you something.
> **NARRATOR:** One day Sunny will be wrong about something.

**THE FUSE — the ep-2 sentence re-spoken byte-identically** (kokoro is
deterministic: same text, same voice, same speed = the identical take,
free; the generator must copy ep-2 `a2_45`'s exact fields).

**HELD BEAT — 36f (1.2s) after `a2_39_narrator`. Byte-mirror of the ep-2
gap.**

> **NARRATOR:** It is today.

**THE SERIES' LONGEST-ARMED PAYOFF, closed.**

**HELD BEAT — 180f (6.0s) after `a2_40_narrator`. THE SERIES RECORD**
(previous 165f). The eruption glows; Sunny hangs perfectly still — his
stunned beat, the series' first; Ember, for the first time in her life,
does not speak. NOTHING enters it. **Fallback trim floor 168f — it must
stay the longest silence the series has ever held (>165f).**

> **SUNNY:** The fire is not mine.

0.9 — his quiet comes from words and speed only (kokoro). The recovery,
AS SUNNY, swelling back to full wattage on truths:

> **SUNNY:** But the sea that will cool it is warm because of me! The sky it is climbing through is bright because of me!
> **SUNNY:** The fire is one thing. I am all the other things! HA! HA!

Every claim in the recovery is individually true. Not a "You're welcome!"
firing.

> **NARRATOR:** Most other things. He is most other things.

Kind, 0.92. His infallibility is dead; his ego is visibly fine.

**ACT BREAK.**

**Tone guardrails, verified:** wrongness is not a comeuppance; nobody is
unkind; he does not crumble; the recovery is his own voice finding the
half-claim he legitimately keeps. Act 3 then demonstrates the recovery on
screen (Scenes 20, 25, 29).

---

# ACT THREE — THE NEWEST PLACE IN THE WORLD

*An island gets built, an old rock moves, the weather demolishes something
cheerfully, and the loop closes on a seed.*

---

### Scene 17 — The surge, the sea, and the skin
**On stage:** Narrator, Ember, Rock
**Visual:** Night. The crust on the stalled flow breaks; the flow SURGES.
Ember rides the front to the sea — steam everywhere. Rock rides the top of
the flow like freight.
**Lines:** `a3_01_narrator`, `a3_02_ember`, `a3_03_ember`, `a3_04_narrator`,
`a3_05_narrator`, `a3_06_narrator`, `a3_07_narrator`, `a3_08_rock`,
`a3_09_narrator`, `a3_10_ember`, `a3_11_rock`

> **NARRATOR:** In the night, the crust on the stalled flow broke. And the flow surged.

Physics-honest: stalled flows surge when the crust breaks.

> **EMBER:** Moving! We are moving! Sea! I am coming to the sea!
> **EMBER:** Wait. Am I rock? Already? That was fast.

**SEASONED — `surprised` (1 of her budget of 2).** Stage direction: **her
outside hardens mid-word** — the sea skins her in seconds; the one instant
thing in geology happens to the character who demanded instant.

> **NARRATOR:** Cooling is quick. Growing is the slow part.
> **NARRATOR:** All that steam is the lava's heat, moving into the sea. Under her feet, brand-new rock. Brand-new ground. The newest place in the world.

Physics-honest: the steam is the LAVA's heat — deliberately never claimed
by Sunny (landmine noted; no line touches it).

> **NARRATOR:** Ember blew on the next wave of lava, to help it hurry up and be ground. That helped. Nobody can measure how much. But it helped.

Honest-futility gag (blowing genuinely cools it, immeasurably) — an A
device grafted here; flagged in the deviations ledger.

> **NARRATOR:** And the surge had carried Rock all the way down the mountain, riding on top of the flow. Big rocks do not melt on the way. The flow is not hot enough for long enough. It just gives them a ride.

Physics-honest boulder rafting: Rock arrives unmelted, and nothing on
screen is harmed by anything.

> **ROCK:** I moved.

**HELD BEAT — 30f (1.0s) after `a3_08_rock`.** The hugest event of his
existence, the smallest sentence of the episode.

> **NARRATOR:** It was the biggest thing that had happened to him in ten thousand years. You can tell, because he mentioned it.
> **EMBER:** Done!

**Chain firing 2 of 4** (the first black beach) — `sameAs: a2_15_ember`.

> **ROCK:** Started.

`sameAs: a2_16_rock`.

**Pedagogy:** Lava cools into new rock = brand-new land; cooling is
surface-quick, growing is the slow part; even the ground travels.

---

### Scene 18 — Roll call, firing 1: the island chain (greeting)
**On stage:** Ember, Narrator; the island chain (silent bodies)
**Visual:** From her new black rock, Ember sees what the horizon has been
hiding all series: a queue of near-identical islands trailing away from the
volcano, newest to oldest — black, then sandy, then green — the last one
barely a sandbar.
**Lines:** `a3_12_narrator`, `a3_13_ember`, `a3_14_ember`, `a3_15_narrator`,
`a3_16_ember`

> **NARRATOR:** And from her brand-new rock, Ember saw what the horizon had been hiding all along.

**ROLL CALL — FIRING 1 (greeting).** Series signature, fixed shape:
cheerful naming → one flat Narrator line → unbothered, unseasoned button.
Nobody replies inside the naming. The picture is the one the act already
has — the archipelago is the volcano's CV. Ember's run at 1.0 (roll-call
speed rule — the items separate).

> **EMBER:** Hi, Island! Hi, Islet! Hi, other Island! Hi, Island the third!

**HELD BEAT — 24f (0.8s) after `a3_13_ember`** — the beat before the
sandbar; the naming run is split into two clips so the timeline makes the
pause (no pause markers).

> **EMBER:** Hi, Sandy.

Sandy is the sandbar — the erosion lesson inside the naming. (TTS fallback
for "Islet" pre-written in the production notes.)

> **NARRATOR:** Every island down that coast is one of his. He has done this before. Many times. They are all called Island.

0.92 flat — the roll-call middle, synthesis wording.

**HELD BEAT — 36f (1.2s) after `a3_15_narrator`.**

> **EMBER:** I am the new one.

Button — `auto` (buttons stay unseasoned; STYLE deadpan rule). Also the
arc's hinge: she has started identifying as the island, out loud, without
noticing.

---

### Scene 19 — The island grows
**On stage:** Narrator, Ember, Rock
**Visual:** Eruption by eruption, layer by layer, the island stacks under
her. **Time passes in NAMED SPANS, never a time-lapse** — jump cuts between
states, each stamped by the Narrator (the Pip growth-state law applied to
geography). No mountain ever visibly shrinks or grows on screen.
**Lines:** `a3_17_narrator`, `a3_18_ember`, `a3_19_narrator`, `a3_20_ember`,
`a3_21_rock`, `a3_22_ember`, `a3_23_rock`, `a3_24_rock`, `a3_25_rock`,
`a3_26_ember`, `a3_27_rock`, `a3_28_ember`, `a3_29_rock`, `a3_30_narrator`,
`a3_31_narrator`, `a3_32_ember`, `a3_33_rock`

> **NARRATOR:** The volcano built her island the way he does everything. Layer by layer. Eruption by eruption. Here is one year later.
> **EMBER:** Faster. You are building me wrong.
> **NARRATOR:** Here is a while later. A while, here, means more than your school will ever ask you to count.
> **EMBER:** How long until the island is finished?
> **ROCK:** Ten thousand years.

**Countdown firing 2 of 3** — `sameAs: a2_22_rock`; the optional third
firing, spent here (synthesis allows it). The countdown never counts down.

> **EMBER:** Done!

**Chain firing 3 of 4** (the growing island) — `sameAs: a2_15_ember`.

> **ROCK:** Started.

`sameAs: a2_16_rock`.

**Stage:** a LATER eruption (named span: "later that century" as a printed
stamp, not a line). Rock watches the fountain like a man at his old school —

> **ROCK:** Ohh yeah. That is the stuff.

**Catch-phrase firing 2 of 2** — `sameAs: a2_11_rock` (in-episode alias of
the ONE migrated recording). In ep 2 nothing happened between his two
firings; here an entire island happened. The identical take across a named
span IS the joke (constancy is the character). NOT at the break — the
reversal sits alone (synthesis ruling).

Bus-stop business — the namespace exchange (deliberate ep-2 roll-call echo,
logged):

> **ROCK:** You will change names one more time.
> **EMBER:** To what?
> **ROCK:** Rock.
> **EMBER:** That is your name.
> **ROCK:** It is a very popular name.

24f gaps on each Rock line, as ever. This plants the chant's "Rock." —
Scene 27 is this gag landing.

**OPTIONAL ASIDE (CUTTABLE — writer's-discretion slot the synthesis
demoted the fingernail fact into; inside a drawn-geometry stretch):**

> **NARRATOR:** While we wait. Your fingernails grow faster than a mountain rises. Look at your hand. It is winning.

True: fingernails ~centimetres a year, big mountains ~millimetres.

> **NARRATOR:** And one day, the steaming mound put its head above the water, and stayed. An island. Brand new. Next to a horizon that had looked the same for four whole shows.
> **EMBER:** Done!

**Chain firing 4 of 4, final** (the surfaced island) — `sameAs:
a2_15_ember`.

> **ROCK:** Started.

`sameAs: a2_16_rock`. Even a finished-looking island is mid-process — this
firing arms the break (Scene 26).

**Pedagogy:** Islands are built layer by layer, eruption by eruption; this
volcano has done it many times; named spans, jump-cut states.

---

### Scene 20 — The demolition crew
**On stage:** Drip (returning), Puff (returning), Ember, Rock, Narrator,
Sunny
**Visual:** Rain and wind arrive to take the OLD islands apart, cheerfully.
Hard hats. A big windup at the oldest green island's cliff.
**Lines:** `a3_34_narrator`, `a3_35_drip`, `a3_36_puff`, `a3_37_drip`,
`a3_38_narrator`, `a3_39_ember`, `a3_40_rock`, `a3_41_narrator`,
`a3_42_narrator`, `a3_43_narrator`, `a3_44_ember`, `a3_45_drip`,
`a3_46_sunny`, `a3_47_sunny`, `a3_48_narrator`

> **NARRATOR:** Then the weather arrived, to take the old islands apart.
> **DRIP:** Hi! It's me! I'm the weather!

**CACHE MIGRATION — Drip's standing entrance, FOURTH identical firing**
(the audibly identical take is the joke; migration details in the table).
No "Different show" firing for her — her entrance carries itself
(synthesis ruling).

> **PUFF:** You can't see me. But you can FEEL me.

**CACHE MIGRATION — Puff's catch-phrase, exactly once, AS his entrance**
(one per appearance; an invisible character cannot be pointed at, so his
"Different show" stays skipped — ep-4 ruling stands). Wind erosion has
never had a better slogan. The "FEEL" capital lives only in this approved
migrated take — never a fresh MiniMax draw.

> **DRIP:** We are taking this whole mountain down!

The windup. Then: **one grain pops off. Rolls. Stops.**

**HELD BEAT — 36f (1.2s)** on the grain.

> **NARRATOR:** That was the whole morning's work.
> **EMBER:** How long to break a mountain?
> **ROCK:** Ten thousand years.

**Countdown firing 3 of 3, final** — `sameAs: a2_22_rock`. Same number in
both directions: building and breaking run on the same clock. The chain is
now closed.

> **NARRATOR:** For once, Rock is being cheerful.
> **NARRATOR:** Rain, wind, and time break rock into smaller rock, then gravel, then sand. The whole mountain will take about a hundred million years.
> **NARRATOR:** That is ten thousand years, ten thousand times.

Physics-honest reconciliation of Rock's constant with the true number —
ten thousand times ten thousand is one hundred million, exactly. Rock's
answer becomes the UNIT (deviations ledger).

> **EMBER:** That is the worst number I have ever heard.
> **DRIP:** We know! We love it!

Her locked `happy` doing the mismatch: the crew AGREES with the timescale
and thinks it is wonderful.

> **SUNNY:** My rain! My wind! The demolition runs on me!
> **SUNNY:** You're welcome! HA! HA!

**Firing 2 of 4** — `sameAs: co_07_sunny`. **Sunny's precision, step 1:**
the recovered half-claim demonstrated on screen — every word of this claim
is true (his weather powers the crumbling).

> **NARRATOR:** Every word of that one is true.

**Big Word card: EROSION** (earned).

**Pedagogy:** Weathering and erosion: rain + wind + time → smaller rock →
gravel → sand. Honest rate; no mountain visibly shrinks — one grain on
screen, the number does the size.

---

### Scene 21 — What dirt is actually made of
**On stage:** Narrator, Drip, Puff, Ember
**Visual:** The island chain as the diagram, made of scenery the show
already owns: newest island black rock, older ones sandier, the older ones
GREEN (older volcanic islands are the lush ones), the oldest a beach.
**Lines:** `a3_49_narrator`, `a3_49b_narrator`, `a3_50_narrator`,
`a3_51_drip`, `a3_52_puff`, `a3_53_narrator`, `a3_54_ember`,
`a3_55_narrator`

> **NARRATOR:** Look down the chain of islands. It is the whole story, standing in a row.
> **NARRATOR:** Lots of islands, and one volcano. He made the newest one yesterday, and the oldest one long, long ago. So walking down the row is like watching one island grow up.

`a3_49b` — 2026-10-17 tweak (showrunner ruling, `ep5-decision-log.md` top
entry): a kids'-hub viewer (8) asked whether this was many islands or one
island at different times. The answer is both, and now the Narrator says
so. Speed 1.0, matching its neighbours. "Yesterday" plants
`a3_55`'s "So was the island. Yesterday." While it plays, a halo and
chevron point at the newest island, glide to the oldest, then walk the row
newest→oldest.

> **NARRATOR:** New islands are black rock. Older islands are sand. And the oldest islands are green. Because sand, mixed with old dead leaves, is soil.
> **DRIP:** We ground it!
> **PUFF:** I stirred in the leaves!

The recipe assembled by the two comedians who ARE the recipe (world rule
2), on a diagram made of islands — the drawn-geometry stretch has its
character beats inside it.

> **NARRATOR:** And in one crack of one brand-new island, the first pinch of it gathered. The newest island's first soil.
> **EMBER:** It is very small.

`auto` — flat inspector verdict (deadpan rule).

> **NARRATOR:** So was the island. Yesterday.

**HELD BEAT — 36f (1.2s) after `a3_55_narrator`.**

**Pedagogy:** Soil = crumbled rock + old dead leaves — the ep-4 riddle's
answer, on screen. The chant and the stamp formalize it in the recap.

---

### Scene 22 — Blue, first to the newest place in the world (+ Violet)
**On stage:** Blue (cameo), Ember, Narrator; Violet (silent, frame edge)
**Visual:** Blue ricochets ashore — fence-less island, so he apologises to
the rock he hits. **Violet is ALREADY THERE at the far frame edge**,
vibrating in place (amplitude blur, same body), noticed by nobody,
including Blue: on an island that did not exist yesterday, Violet has
somehow already been overlooked. He exits before the scene ends.
**Lines:** `a3_56_blue`, `a3_57_narrator`, `a3_58_ember`, `a3_59_blue`,
`a3_60_narrator`

> **BLUE:** First! Sorry, rock! I am first to the newest place in the world!

Bubble may shout "FIRST!" in caps; the clip stays lowercase (MiniMax caps
rule).

> **NARRATOR:** Different show. Same first.

**Firing 2 of 2** — fresh blank, 0.92; names the returning LAW rather than
the character (synthesis-accepted fresh construction; series blanks now
eight).

> **EMBER:** I live here. I was here before here was here.

`auto`, flat — the resident's trump, extended ep-4 echo (B's form,
synthesis-accepted). **HELD BEAT — 45f (1.5s) after `a3_58_ember`.** Blue
freezes mid-ricochet for the whole beat, recalculating — the ep-4 freeze,
rerun on a new resident.

> **BLUE:** Then I am first to visit! Visiting counts!
> **NARRATOR:** He was not first. He was very sure, though. Those are different things.

**Ledger:** Anti-Sunny seed watered — wrong by residency, wrong by Violet;
right about nothing; **the payoff is NOT fired** (its natural home is the
ep-6 storm — see the tease note). "I just said that!" not fired; the copies
not used.

---

### Scene 23 — The turn (held in silence)
**On stage:** Ember, the volcano, Narrator, Rock
**Visual:** Dusk. The eruption settles to a glow. Ember sits still —
voluntarily — for the first time in her life, and looks UP the slope at
the whole mountain.
**Lines:** `a3_61_narrator`, `a3_62_ember`, `a3_63_volcano`,
`a3_64_narrator`, `a3_65_ember`, `a3_66_ember`, `a3_67_rock`, `a3_68_rock`,
`a3_69_rock`, `a3_70_ember`

> **NARRATOR:** At dusk, the eruption settled down to a glow. And Ember sat still. On purpose. For the first time in her whole life.
> **EMBER:** When will I be as big as you?

Still 1.1 — the want, aimed at the mountain.

> **VOLCANO:** Presently.

**V5** — his only reply to Ember all episode (48f approach gap; the
asymmetric engine pays its one dividend).

> **NARRATOR:** Presently, from a volcano, means ten thousand years. He is the politest clock in the world.
> **EMBER:** Everything fast I ever did was over in a second.

**SPEED DROP — 1.0 from this line to the end of the episode** (not slower:
settling, not sedation; the arc is audible).

> **EMBER:** I used to be fast. Now I am ten thousand years long.

B's self-account, verbatim. **This is also the inspector runner's
resolution:** she inspects the slowest thing in the world — herself, now —
and files a different report. Nobody ever corrected her.

> **ROCK:** Fast things are small.
> **ROCK:** Slow things are big.
> **ROCK:** You are going to be enormous.

Three short sentences, 24f gaps between (A's turn staging).

> **EMBER:** Then I have already started.

A's turn wording, verbatim, at 1.0. **HELD BEAT — 45f (1.5s) after
`a3_70_ember`.** No moral is stated; she just changes what she is impatient
about.

---

### Scene 24 — The grading (the ep-4 order, executed)
**On stage:** Pip (cameo, rooted), Puff, Narrator
**Visual:** The meadow, one shot: Pip exactly where episode four left her —
rooted, permanent lean, skeptical resting face, pappus ruff. Puff arrives
on the wind carrying a pinch of the new island's first soil. Arrivals stoop
to her mark; she never rises.
**Lines:** `a3_71_narrator`, `a3_72_puff`, `a3_73_pip`, `a3_74_pip`,
`a3_75_pip`, `a3_76_pip`, `a3_77_pip`

> **NARRATOR:** Far away, in a meadow you know, a live order was still open.
> **PUFF:** Special delivery. From the newest place in the world.

**HELD BEAT — 30f (1.0s) after `a3_72_puff`.** Pip inspects the pinch the
way she inspects everything.

> **PIP:** Fresh mountain. Old leaves. Somebody is building something.
> **PIP:** It will do.

**CACHE MIGRATION — the stamp, re-fired ONCE, per the ep-5 budget:** the
approved `plants/co_17_pip` take (chain source), copied. **HELD BEAT — 45f
(1.5s) after `a3_74_pip`. The stamp lands NAKED** — the Narrator companion
chain ("It is the highest grade she gives.") is OFF this episode, by
synthesis ruling; nothing is said over or after the hold.

> **PIP:** Pipsqueak. You are up.

The dispatch — the loop close is CAUSAL: graded, then sent.

> **PIP:** Dirt is crushed mountain. So my feet are in a mountain.

**HELD BEAT — 30f (1.0s) after `a3_76_pip`.**

> **PIP:** Good.

Her ep-4 riddle ("It's where I keep my feet."), closed in her own register.
Deadpan floor 0.9 on `a3_74` and `a3_77`.

---

### Scene 25 — The garden is ready (the loop closes)
**On stage:** Sunny, Narrator, the volcano, Ember; Pipsqueak (silent seed)
**Visual:** First light on the new island. Sunny inspects the crack where
the glow still shows through the young rock.
**Lines:** `a3_78_narrator`, `a3_79_sunny`, `a3_80_sunny`, `a3_81_sunny`,
`a3_82_narrator`, `a3_83_volcano`, `a3_84_narrator`, `a3_85_ember`

> **NARRATOR:** In the morning, the sun came up over the newest place in the world, and had a good look at it.
> **SUNNY:** That is not me.

**THE BANKED INVERSION — SPENT.** Verbatim, once, at the glowing crack.
**Sunny's precision, step 2:** he does the thing four shows said he never
would — allocates, exactly, proudly. **The biggest single reversible call
in the episode: a one-line cut restores the bank** (top-logged for Mike).
**HELD BEAT — 24f (0.8s) after `a3_79_sunny`.**

> **SUNNY:** The warm on top is me.

The cold open's "on top" plant (`co_08`), cashed — the precise allocation
as his new steady state.

> **SUNNY:** You're welcome! HA! HA!

**Firing 3 of 4** — `sameAs: co_07_sunny`.

> **NARRATOR:** Exactly right, at last. It only took five shows.
> **VOLCANO:** I believe the garden is ready.

**V6** — 48f approach gap. And ON this line, riding Puff's wind, a single
pappus seed sails in — **Pipsqueak, a Pip sibling, silent, zero cost**
(Pip herself takes no steps, ever) — and settles into the pinch of first
soil in Ember's crack.

> **NARRATOR:** And a seed from the meadow landed in the first soil of the newest place in the world. New island. First soil. First seed.
> **EMBER:** Welcome. We are new.

At 1.0, small and unhurried (`auto` — quiet warmth carried by the words;
no seasoning spent).

**Pedagogy:** The loop: new island → first soil → first seed. The rock
cycle as the series' quiet thesis — everything travels, even the ground.

---

### Scene 26 — The break (the last beat of Act Three)
**On stage:** Rock, Ember
**Visual:** Two-shot, Ember's rock and Rock side by side, the island behind
them, dusk glow. Nothing else on stage; nothing moves.
**Lines:** `a3_86_rock`, `a3_87_ember`

> **ROCK:** Done?

**THE BREAK — the first question of Rock's life.** New recording (the
question mark IS the break; the chain's "Started." recordings are not
reused here). 24f approach gap, as ever.

**HELD — 24f (0.8s) after `a3_86_rock`:** Ember performs HIS gap — the
fastest character in the series, deliberately waiting Rock's silence
before answering.

> **EMBER:** Started.

**Her voice, new recording, at 1.0, `auto`** (the reversal is deadpan; the
read must land content, not defeated — **audition line 3**).

**HELD BEAT — 45f (1.5s) after `a3_87_ember`. NOTHING enters it** — no
line, no entrance, no music sting, no emotion change. The episode's biggest
constructed laugh, built from two one-word clips and fifteen minutes of
setup, held in silence.

**ACT OUT.**

---

# RECAP

*The chant, the stamped debt, two true things, a goodbye to a coastline,
and a mountain saying good night.*

---

### Scene 27 — The chant
**On stage:** Ember, Rock, Drip, Puff, Narrator
**Visual:** The ground's whole journey replayed as a relay down the island
chain — each traveller lit as their word lands. Card stack replays MAGMA /
LAVA / ERUPTION / EROSION.
**Lines:** `rc_01_narrator`, `rc_02_ember`, `rc_03_ember`, `rc_04_rock`,
`rc_05_drip`, `rc_06_puff`, `rc_07_narrator`

> **NARRATOR:** So. The ground's whole journey, one traveller at a time.
> **EMBER:** Magma!
> **EMBER:** Lava!
> **ROCK:** Rock.

Flat, no exclamation, and LATE — his 24f gap makes his own name arrive a
beat behind the relay. The Scene-19 namespace gag, landing.

> **DRIP:** Sand!
> **PUFF:** Soil!
> **NARRATOR:** And THAT is what dirt is actually made of.

Kokoro — the caps are legal there. One-word MiniMax clips are the
episode's highest TTS-risk class; **fallbacks pre-written in the
production notes** (respellings + a Narrator-led chant).

---

### Scene 28 — The debt stamped
**On stage:** Narrator
**Visual:** The ep-4 end card returns on screen — **WHAT IS DIRT ACTUALLY
MADE OF?** — and gets its answer STAMPED across it, print only:
**CRUSHED MOUNTAIN + OLD LEAVES.** Pip's stamp is SHOWN, not re-fired (her
one migrated firing was Scene 24).
**Lines:** `rc_08_narrator`

> **NARRATOR:** Asked last show. Answered this show. Graded by the management.

0.9. **HELD BEAT — 36f (1.2s) after `rc_08_narrator`** on the stamped card.

---

### Scene 29 — Two true things (the mind-blowers)
**On stage:** Narrator, Sunny; the kid (silhouette, silent)
**Visual:** Back to the beach from Scene 1. The kid's sandcastle still
stands; the kid pats a turret.
**Lines:** `rc_09_narrator`, `rc_10_narrator`, `rc_11_narrator`,
`rc_12_narrator`, `rc_13_sunny`, `rc_14_sunny`

> **NARRATOR:** Now hold still. Two true things.
> **NARRATOR:** Every grain of sand, on every beach in the world, used to be part of a mountain.
> **NARRATOR:** So that sandcastle is a castle made of ground-up mountains. The kid and the volcano have been in the same business all day.

**Mind-blower 1 (primary)** — pays off the silent builder runner planted
in Scene 1. **HELD BEAT — 45f (1.5s) after `rc_11_narrator`** on the kid
and the castle.

> **NARRATOR:** And the next island is already growing. Right now. Underwater. It has a name, and I am not saying it out loud. It starts with K. Look it up. It needs a few more ten-thousands of years.

**Mind-blower 2 (secondary, Math-bait)** — true and checkable
(Kamaʻehuakanaloa, off Hawaii); the Narrator declining to pronounce it is
the research hook.

> **SUNNY:** I warm the sea on top of it!
> **SUNNY:** You're welcome! HA! HA!

**Firing 4 of 4, final** — `sameAs: co_07_sunny`. **Sunny's precision,
step 3:** a true claim about an island even he cannot see — half-right
forever, ego fully recovered.

---

### Scene 30 — Roll call, firing 2: goodbye
**On stage:** Ember, Narrator
**Visual:** Dusk down the island chain, seen from Ember's island — the
whole CV in one warm light.
**Lines:** `rc_15_ember`, `rc_16_narrator`, `rc_17_ember`

> **EMBER:** Bye, Island. Bye, Islet. Bye, other Island. Bye, Island the third. Bye, Sandy.

Same five names, same order as the greeting (series law); one clip this
time — the Sandy beat already landed, and a goodbye run reads as one
breath. At 1.0.

> **NARRATOR:** None of them moved. Islands never do. It was still polite.

0.92 flat — the goodbye middle, A's wording per the synthesis.

**HELD BEAT — 36f (1.2s) after `rc_16_narrator`.**

> **EMBER:** See you in ten thousand years.

Button — `auto`, unbothered, at 1.0. The arc's receipt: she now schedules
in geological time, happily. (Her only re-use of the number — spoken in
her own voice, fresh recording, not an alias.)

---

### Scene 31 — End card, tease, good night
**On stage:** Narrator, the volcano; the kid (silhouette, silent)
**Visual:** The beach at dusk. The kid in silhouette — and the horizon the
kid has watched for five shows has CHANGED: a new island stands beside the
volcano. Card: **WHY IS THUNDER ALWAYS LATE?**
**Lines:** `rc_18_narrator`, `rc_19_volcano`, `rc_20_narrator`

> **NARRATOR:** Next time. Why is thunder always late?

0.9. **The ep-6 tease (TOP-LOGGED FOR MIKE — a tease is an audience
promise):** the storm episode — the most kid-checkable question the series
has teased (flash-to-boom counting); reunites the weather crew; Cloudia is
owed a storm; the natural (NOT promised) slot for Blue's banked payoff.
Moon logged as the alternate. The card promises only the question.

> **VOLCANO:** Good night.

**V7** — 48f approach gap; the mirror of V1. The scenery keeps its voice.

> **NARRATOR:** He is not going back to sleep. He is just being polite. He has ten thousand years of work to do.

**NEW CANON:** the volcano stays AWAKE into episode six's horizon. End on
the changed horizon, the kid watching, the summit glowing gently.

---

## Production notes

**Tone guardrails.** Unchanged. No sarcasm a six-year-old cannot parse; no
scary peril — the eruption is BIRTH and construction from its first frame
to its last: nothing flees, nothing is harmed, nothing is ever menaced by
lava. No potty humour. Nobody is unkind: Ember's "broken" verdicts are
never corrected (the world just holds still until she re-grades it), Blue's
corrections are gifts, and Sunny's wrongness is a ceremony, not a
comeuppance — he takes the verdict in the series' first stunned beat and
recovers AS SUNNY on claims that are individually true. His ego survives
the episode; only his infallibility dies.

**Comedy pacing is designed in.** Slower per-line speeds on every list and
deadpan (floor 0.9 on Pip's stamps, `rc_08` and `rc_18`; house flat 0.92 on
roll-call middles and both "Different show" firings; Ember's roll-call runs
at 1.0, below her 1.1 default, so the names separate). The spine holds are
the wake (45f + 60f), the ceremony (60f / 36f / **180f — the series
record, trim floor 168f, must stay >165f**), the chain firings, the stamp
(45f, naked), and the break (45f). **No emotion lead on held-beat scenes**
(kit's 8-frame `useEmotion` lead → 0 wherever a HELD BEAT direction
appears). Identity gaps: **volcano 48f before every line** (new series
record; Red 16f), **Rock 24f before every line, fixed, never escalated** —
both declared once in "How to read the held beats".

### The volcano — complete line list (7 lines; this table IS his character)

| # | Key | Scene | Line | Job |
|---|---|---|---|---|
| V1 | `a1_20` | 9 | "Good morning. I appear to have overslept." | FIRST LINE EVER — the series event; returns Sunny's greeting four shows late |
| V2 | `a1_21` | 9 | "Do pardon the ash." | The butler register, confirmed; the first ash pop |
| V3 | `a2_02` | 10 | "Do excuse the noise. This is the loud part." | The tone gate (construction, not catastrophe), carried by the character himself |
| V4 | `a2_35` | 15 | "If I may. The fire is mine. It came with the house." | The ceremony verdict's physics, in the politest correction in series history |
| V5 | `a3_63` | 23 | "Presently." | His only reply to Ember; the politest clock in the world |
| V6 | `a3_83` | 25 | "I believe the garden is ready." | Hands the episode to the loop-closer |
| V7 | `rc_19` | 31 | "Good night." | Mirrors V1; the scenery keeps its voice — and stays awake (new canon) |

`Elegant_Man`, pitch −6, speed 0.9, `auto` forever; no caps, no pause
markers, no body walk. A's "…Ah. There it is. I do like this part." is CUT
for scarcity and **BANKED** — the natural tweak-round add if Mike wants an
eighth line.

### Catch-phrase ledger — counts vs ceilings

| Phrase | Owner | This episode | Ceiling / rate | Keys |
|---|---|---|---|---|
| "You're welcome! HA! HA!" | Sunny | **4** (1 recording + 3 aliases) | **8, hard** — 4 of headroom unspent | `co_07` (SOURCE), `a3_47`, `a3_81`, `rc_14` |
| "OH, that one is me as well! HA! HA!" | Sunny | **1 — THE BANKED FIRING, CASHED** at the knock, with its banked direction (full confidence, no doubt anywhere in it) | banked since ep 2, saved twice; this firing belonged to the volcano thread | `co_10` |
| "I did that." / "No. He really didn't." | Sunny / Narrator | 1 each — the ceremony, banked verbatims | reserved since ep 2 — **SPENT** | `a2_33`, `a2_34` |
| The long fuse → "It is today." | Narrator | ep-2 sentence re-spoken byte-identically, 36f mirror gap, then the close | the series' longest-armed payoff — **CLOSED** | `a2_39` (byte-match of wind `a2_45`), `a2_40` |
| "That is not me." | Sunny | 1, verbatim — **SPENT** (the inversion as precision) | banked since ep 2; **one-line cut restores the bank — top-logged** | `a3_79` |
| "GOOD MORNING, EVERYBODY!" → "I invented mornings!" | Sunny | 1 pair | series constant, **five-for-five** | `co_04`, `co_05` |
| "Ohh yeah. That is the stuff." | Rock | 2 firings, **1 recording (cache-migrated from ep 2)** + 1 in-episode alias | mirrors ep-2's own two-firing shape — an island happens in between | `a2_11` (migrated), `a3_24` (`sameAs`) |
| "Hi! It's me! I'm the weather!" | Drip | 1 — **fourth identical firing**, cache-migrated | standing entrance | `a3_35` |
| "You can't see me. But you can FEEL me." | Puff | 1, AS his entrance, cache-migrated | one per appearance (series count 6, pending the owed recount) | `a3_36` |
| "It will do." | Pip | 1 — **the ep-5 budget, exactly** (cache-migrated; chain source `co_17_pip`) | ep-4 chain self-capped at 5; this is a migration, not a 6th chain firing | `a3_74` |
| "It is the highest grade she gives." | Narrator | **0 — OFF this episode** (synthesis: the stamp lands naked) | stays 2 series-wide | — |
| "Different show. Same ___." | Narrator | 2 — fresh blanks: **rock**, **first** (used before: sun, sky, rain, air, beam, weather) | one per returning entrance; Drip's entrance carries itself; Puff skip stands | `a2_10`, `a3_57` |
| Blue's "first" payoff | Blue | **0 — seed watered only** (wrong twice, right about nothing) | multi-episode plant — DO NOT fire | `a3_56`, `a3_59` |
| "I just said that!" | Blue | 0 | capped 4 (ep 3) | — |
| "I am NOT small! I am travel-sized!" | Drip | 0 | fan-service only | — |
| "Look up. That's me." | Ray | 0 (Ray absent) | — | — |
| "darling" | Cloudia | 0 (Cloudia OUT — owed the ep-6 storm) | — | — |

*Sunny interrupts a scene that is not about him*: **1 true firing**
(`a1_06`, the basement offer — he IS available), with its button `a1_07`;
pattern extension synthesis-accepted. LOAD-BEARING (edit-pass ruling —
Scene 5's only spoken beat; a cut requires a replacement beat).

### `sameAs` chains — sources marked (aliases resolve BACKWARDS; the source is the earliest firing, decided here, at draft time)

| Chain | SOURCE (earliest firing) | Aliases, in order | Notes |
|---|---|---|---|
| "Done!" | **`a2_15_ember`** | `a3_10_ember`, `a3_22_ember`, `a3_32_ember` | MiniMax, ONE paid recording, four firings at escalating objects. The audition must approve the source take before generation. |
| "Started." | **`a2_16_rock`** | `a3_11_rock`, `a3_23_rock`, `a3_33_rock` | MiniMax, ONE recording, byte-identical; the 24f gap is staged, never in the clip. |
| Break: "Done?" / "Started." | `a3_86_rock` / `a3_87_ember` | — (deliberately NOT aliased) | Two fresh recordings — the question mark and the voice-swap ARE the break (ep-4 "It will not do." precedent). |
| "Ten thousand years." | **`a2_22_rock`** | `a3_21_rock`, `a3_40_rock` | The unmoving countdown: 3 firings, closed. Ember's `rc_17` goodbye button re-uses the NUMBER, never the clip. |
| Rock catch-phrase | `a2_11_rock` (cache-migrated recording) | `a3_24_rock` | One recording forever (ep-2 take); in-episode alias only. |
| "You're welcome! HA! HA!" | **`co_07_sunny`** | `a3_47_sunny`, `a3_81_sunny`, `rc_14_sunny` | Kokoro (deterministic — aliases state intent and lock wording). Escalation is placement, never the read. |
| The fuse | `a2_39_narrator` | — | Byte-match of wind `a2_45` (same text, voice, speed — copy ep-2's exact fields so the deterministic take is identical). |

### Cache-migration flags (cross-episode identity = migration ONLY; copies, never moves; ear-check each once in the new mix)

| Target key | Source clip | Line | Why |
|---|---|---|---|
| `a2_11_rock` | `public/narration/wind/a2_08_narrator.mp3` | "Ohh yeah. That is the stuff." | Rock's catch-phrase, one recording forever (ep-2 keying was `_narrator` — legacy, deliberate). Copy the mp3 + seed the volcano cache with the same text hash BEFORE running the generator. |
| `a3_35_drip` | `public/narration/sky-blue/a1_31_drip.mp3` (the sky-blue-lineage take; identical bytes also live at `plants/a2_13_drip.mp3`) | "Hi! It's me! I'm the weather!" | Fourth identical firing — the audibly identical take IS the joke. |
| `a3_36_puff` | `public/narration/wind/a1_40_puff.mp3` | "You can't see me. But you can FEEL me." | One per appearance; the canon "FEEL" capital never gets a fresh MiniMax draw. |
| `a3_74_pip` | `public/narration/plants/co_17_pip.mp3` | "It will do." | The ep-5 budget: ONE re-fire of the chain source, exactly as the brief prescribed. |

### The roll call — two firings

Series signature, shape fixed both times: cheerful naming → one flat
Narrator line (0.92) → unbothered, unseasoned button; nobody replies inside
the naming. Variant: **the island chain** — the volcano's CV; the joke IS
the lesson (he has done this before, many times), and Sandy the sandbar
carries the erosion lesson inside the naming. Names, both firings, same
order: **Island, Islet, other Island, Island the third, Sandy.**
**Firing 1 (greeting):** Scene 18 — `a3_13` + `a3_14` (split for the
24f Sandy beat) / `a3_15` / button `a3_16` ("I am the new one."). **Firing
2 (goodbye):** Scene 30 — `rc_15` (one clip) / `rc_16` ("None of them
moved. Islands never do. It was still polite.") / button `rc_17` ("See you
in ten thousand years."). Greeting and goodbye are different sentences —
separate recordings by design, not a broken chain.

### Running-gag plan — planted and resolved

| Gag | Plant | Firings | Resolve |
|---|---|---|---|
| **"Done!" / "…Started." double chain** (the spine gag) | Sc 13 | 4 paired firings, both halves byte-identical (`a2_15`/`a2_16` + 3 aliases each), at escalating objects: crust → beach → growing island → surfaced island | **Sc 26 — THE BREAK, the last beat of Act 3:** Rock asks the first question of his life ("Done?"), Ember answers with his word and his gap, content, at 1.0. Held 45f; nothing enters it. |
| **The unmoving countdown** ("Ten thousand years.") | Sc 14 | 3 (mountain / island / break-a-mountain — same number in both directions) | The number becomes hers: `rc_17` "See you in ten thousand years." (fresh clip, her voice). |
| **"___ is broken."** (Ember's inspector verdicts) | Sc 6 | `a1_10`, `a1_13`, `a2_12` — fresh recordings, pattern not chain | Sc 23 — she inspects the slowest thing in the world (herself) and files a different report ("Now I am ten thousand years long."). Nobody ever corrects her. |
| **The builder parallel** (kid's sandcastle vs the volcano's island) | Sc 1, silent | wobble + pat (Sc 2), background presence through the recap | Sc 29 — sand IS ground-up mountain; the kid and the volcano were in the same business all day. Zero lines, zero cost. |
| **Sunny's precision** (the ceremony made permanent) | Sc 16 recovery | Sc 20 (the crew is his — true), Sc 25 ("That is not me." + "The warm on top is me."), Sc 29 (the sea above the hidden island) | Never fully resolved — the new steady state: half-right forever, ego intact, infallibility dead. |
| **The volcano's manners** | Sc 9 | V1–V7 | V7 "Good night." — the mirror close; he stays awake into ep 6 (new canon). |
| **The namespace gag** (all rock is named Rock) | Sc 19 | the five-line exchange | Sc 27 — Rock's flat, late "Rock." in the chant is the gag landing. |
| **The warm-on-top plant** | `co_08` | — | `a3_80` — Sunny's precise allocation uses the cold open's exact edge. |

### Ensemble engines — the reply budget (protect these; cuts come from texture, never engines)

| Engine | Colliding wants | Scenes | Replies in this draft |
|---|---|---|---|
| Ember ↔ Rock (central) | now vs ten thousand years | 12–14, 17, 19, 20, 23, 26, 27 | ~18 |
| Ember ↔ Volcano (asymmetric by design) | out, now, big vs the politest silence | 6, 23 | many addressed, **2 answered** (48f of nothing at `a1_11`; "Presently.") — the ratio is the joke |
| Sunny ↔ Narrator (the ceremony rail) | his claim on everything vs the one verdict | 1, 2, 15, 16, 20, 25, 29 | ~8 |
| Ember ↔ demolition crew | her new permanence vs their cheerful grinding | 20–21 | ~5 |
| Ember ↔ Blue | residency vs priority | 22 | 3 |
| Pip ↔ Puff (the delivery) | the live order vs the courier | 24 | 2 |

### Physics-honesty ledger (the gate — union of both treatments' ledgers, all guards held)

- Interior heat is primordial — "left over from the day the world was
  made", the sanctioned kid-level account; stated plainly in Act 1
  (`a1_03`/`a1_04`) and it IS the ceremony verdict (`a2_36`/`a2_37`). The
  one heat on the planet that is genuinely not Sunny's. TRUE.
- No outgassing, no plate tectonics named, no rock classes, zero
  destruction framing — out-of-scope list honoured; nothing and nobody is
  harmed anywhere; the eruption is fireworks and birth throughout. HELD.
- Magma (inside) / lava (outside) naming is exactly the real convention
  (`a2_05`). TRUE.
- Warm things rise — magma rises (`a1_18`, ep-2 law redeployed). TRUE.
- Lava flows slow, thicken, crust, stall ("slow traffic", `a2_09`);
  stalled flows surge when the crust breaks (`a3_01`). TRUE.
- Ember's instant cooling is SURFACE-honest and said so twice: "The
  outside cools first. The inside stays hot for a long time." (`a2_17`)
  and "Cooling is quick. Growing is the slow part." (`a3_04`). TRUE.
- Blowing on lava cools it — stated as unmeasurable (`a3_06`). TRUE.
- Steam where lava meets sea = the LAVA's heat (`a3_05`); deliberately
  never claimed by Sunny — no line touches it. SAFE.
- Boulders raft on flows unmelted — a flow is not hot enough for long
  enough to melt Rock (`a3_07`); nothing on screen is harmed. TRUE.
- Islands built layer by layer, eruption by eruption; chains age down
  their length; older volcanic islands are the green, lush ones
  (Sc 18–19, 21). TRUE.
- **No mountain or island ever visibly shrinks or grows on screen** —
  named spans, jump-cut states only (the Pip growth-state law applied to
  geography, Sc 19); erosion on screen is ONE grain (Sc 20). HELD.
- Erosion = rain + wind + time → smaller rock → gravel → sand; the whole
  mountain ~one hundred million years (`a3_42`), reconciled with Rock's
  constant honestly: "ten thousand years, ten thousand times" (`a3_43`) —
  the arithmetic is exact. TRUE.
- Soil = crumbled rock + old dead leaves (`a3_50`, the chant, the stamp) —
  the brief's model. TRUE.
- Every post-ceremony Sunny claim is individually true: the sea and sky
  truths (`a2_42`), the demolition crew (`a3_46` — his weather does the
  crumbling), warm-on-top (`a3_80`), the sea above the hidden island
  (`rc_13`). TRUE, each checked.
- Fingernails (~centimetres/year) vs mountain uplift (~millimetres/year)
  (`a3_30`, OPTIONAL). TRUE.
- The underwater next island (Kamaʻehuakanaloa), "a few more
  ten-thousands of years" (`rc_12`). TRUE.
- Every grain of beach sand used to be part of a mountain (`rc_10`) —
  brief-sanctioned mind-blower wording. TRUE at kid level.
- "Presently", from a volcano, means ten thousand years (`a3_64`) — the
  episode's number used as translation, consistent with V5's scale. HELD.
- The volcano does not go back to sleep (`rc_20`) — consistent with a
  shield volcano's active span; NEW CANON for ep 6's horizon.

### Laugh-gap self-map — CLAIMS ONLY

**This is a CLAIM for the showrunner to re-measure** (method rule: a
planning document's density self-score is not evidence — recompute from
the generated manifest with real timeline arithmetic; visual-only business
does not feed the laugh clock). Grades at age six, spoken lines only;
estimates assume ~2.8s/line plus written gaps. Audited first, per the
synthesis: Scene 5 (cross-section), Scenes 15–16 (ceremony block),
Scenes 24–25 (loop close).

| Stretch | Est. window | Spoken laugh beats claimed | Est. worst gap |
|---|---|---|---|
| Cold open (Sc 1–4) | 0:00–2:00 | warm-sand HA!-HA!; the wake-claim + "Nobody had asked."; "The rules are over." (event-laugh) | ~30s (co_01–co_03 intro run — the debt naming) |
| Act 1 Sc 5 | 2:00–3:10 | "Nobody minds."; Sunny's muffled offer + "Nobody down there needed light." | **~40s claimed — the MAGMA pedagogy run (`a1_01`–`a1_05`); the character beat inside the drawn geometry is the muffled-Sunny pair, now LOAD-BEARING (edit-pass ruling). Recompute at manifest time.** |
| Act 1 Sc 6–8 | 3:10–4:40 | "She has opinions."; "It is all broken."; the 48f no-reply; "answers everything. Eventually."; "closed for ten thousand years"; "fast again"; "never been in a hurry" | ~20s |
| Act 1 Sc 9 (the wake) | 4:40–5:40 | V1 (event-laugh, parents+kids); "Do pardon the ash." + pop; "TO ME!"; "Hold on to something." | ~25s incl. the 93f + 60f holds (deliberate) |
| Act 2 Sc 10–12 | 5:40–7:10 | "This is the loud part."; "paperwork"; "Same rock."; catch-phrase 1; "This traffic is broken." / "It is resting." | ~22s |
| Act 2 Sc 13–14 | 7:10–8:50 | chain debut; "You are becoming somewhere."; "the whole negotiation"; "I was fast once."; "Since I stopped." | ~20s |
| Act 2 Sc 15–16 (CEREMONY) | 8:50–10:50 | "I did that." / "No. He really didn't." (kid-graded: the flat contradiction); "If I may." (butler laugh); then **the deliberate solemn stretch: translation + fuse + 180f + "The fire is not mine." — est. 40–48s from "If I may." to the recovery aria ("I am all the other things! HA! HA!") — THE EPISODE'S WORST CLAIMED STRETCH, the spine hold, ends on the bounce-back laugh.** | **~45–48s (claimed; recompute FIRST; the tuning knob is `a2_36`/`a2_37` wording length, never the 180f)** |
| Act 3 Sc 17 | 10:50–12:10 | "That was fast."; the blowing beat; "I moved." + "he mentioned it"; chain 2 | ~22s |
| Act 3 Sc 18–19 | 12:10–14:10 | roll call + "Hi, Sandy."; "They are all called Island."; "building me wrong"; countdown 2; chain 3; catch-phrase 2; the namespace run; chain 4 | ~25s (fingernail aside is the insurance inside the growth spans) |
| Act 3 Sc 20–21 | 14:10–16:00 | Drip + Puff entrances; the one-grain windup + "whole morning's work"; countdown 3; "ten thousand times"; "worst number" / "We love it!"; HA!-HA! 2; "We ground it!" / "leaves!"; "So was the island. Yesterday." | ~20s |
| Act 3 Sc 22–23 | 16:00–17:40 | Blue triple + freeze; "Same first."; "Those are different things."; "Presently." + politest clock; then the turn's warm run (Rock's triple → "already started.") | ~35s (the turn — deliberate, ends held 45f) |
| Act 3 Sc 24–26 (loop close) | 17:40–19:20 | "Special delivery."; the naked stamp; "Pipsqueak. You are up."; "my feet are in a mountain." / "Good."; "That is not me." + warm-on-top + HA!-HA! 3; "It only took five shows."; V6; "Welcome. We are new." (warm); **THE BREAK** | ~30s claimed; the warm seed-landing run (`a3_82`–`a3_85`) is the stretch to watch — the break lands 15–20s after it and is the act's biggest laugh |
| Recap Sc 27–31 | 19:20–21:20 | the chant + Rock's late "Rock."; the stamp card; sandcastle mind-blower; "It starts with K."; HA!-HA! 4; goodbye roll call + button; "Good night." + "ten thousand years of work" | ~30s (mind-blower run, Sunny button inside it) |

Claimed cadence: a spoken kid-graded beat every ~20–30s; two stretches
flagged over 40s — the ceremony block (deliberate, the series' spine) and
Scene 5 if the CUTTABLE pair is cut (structural risk, named above).

### TTS-risk fallbacks (pre-written, per the ep-4 rule)

- **One-word MiniMax clips** (`a2_16`/aliases "Started.", `a2_24` "No.",
  `a3_27`/`rc_04` "Rock.", `a3_63` "Presently.", `a3_77` "Good.",
  `a3_86` "Done?", `a3_87` "Started.", chant `rc_02`–`rc_06`) are the
  episode's highest-risk class. First fix is diagnosis: measure
  seconds-per-word; a bad draw gets a cache-bust re-roll with identical
  text (cents), a phrase/voice mismatch gets the fallback below.
- **Chant respellings, if a word breaks:** "Magma!" → "Mag ma!"; "Lava!" →
  "Lah va!"; "Sand!" / "Soil!" survive as whole-shout lines; "Rock." →
  "Rock. Yes." is REFUSED (kills the flat) — his fallback is the
  Narrator-led chant below.
- **Narrator-led chant fallback (whole-unit swap):** Narrator: "Say the
  journey with me. Magma, to lava, to rock, to sand, to soil." — character
  bubbles carry the words in print; `rc_07` unchanged.
- **"Islet"** must read EYE-lit. Fallback respelling "Eye-lit" in the clip
  (bubble keeps "Islet"); if it still breaks, the name swaps to "little
  Island" IN BOTH FIRINGS (`a3_13` and `rc_15` — the two runs must match).
- **"Kamaʻehuakanaloa" is never spoken** — the Narrator refuses on
  purpose (`rc_12`); no TTS exposure.
- **The fuse byte-match** (`a2_39`): identical take requires identical
  fields — the generator must copy wind `a2_45`'s exact voice/speed, not
  the volcano file's defaults, or kokoro will produce a different read.

### Ear-check list (in order)

1. **Ember's voice itself** — `EMBER_MINIMAX_VOICE` is provisional; the
   overnight audition targets the trio `a1_08` (machine-gun opinion),
   `a2_12` (flat "broken" verdict), `a3_87` (the break — content, not
   defeated). `a2_15_ember` ("Done!") is the chain source: approve it
   before anything downstream is built.
2. **`a2_16_rock` ("Started.")** — the other chain source; four firings
   and the whole break hang off its flatness.
3. **The volcano's V1** (`a1_20`) at pitch −6, 0.9 — the butler read is
   the casting's job; if V1 lands, V2–V7 follow.
4. **The four migrated clips in this mix** (`a2_11`, `a3_35`, `a3_36`,
   `a3_74`) — approved in other episodes' mixes; listen once here.
5. **One-word clips** (list above) — s/word measurement pass.
6. **`a3_13`/`rc_15` roll-call runs** — five names; do they separate at
   1.0? "Islet" pronunciation check.
7. **`a2_41` Sunny at 0.9** ("The fire is not mine.") — the quiet must
   come from words and speed alone.
8. **`a3_03` Ember `surprised`** — the episode's only seasoned field; it
   must not leak ahead of the skin-over (no emotion lead).
9. **The chant one-worders** (`rc_02`–`rc_06`) against the pre-written
   fallbacks.

### Showrunner edit-pass rulings (2026-08-24, mandatory pass before TTS)

- **Scene 5's Sunny pair PROMOTED to load-bearing** (was CUTTABLE) —
  resolves deviation 12 structurally; the ledger row below is updated.
- **Line count 189 STANDS** — no trims taken; the ep-3 lesson is that
  structure, not count, decides the verdict, and every listed trim is
  texture the cadence map credits. The trim order stays recorded for the
  tweak round.
- **Chant stays five words in four voices** (deviation 10 accepted as
  scripted) — Ember owning both "Magma!" and "Lava!" IS the rename gag.
- **Deviations 2–9 and 11 ACCEPTED as drafted** (two-clip stammer;
  split roll-call greeting; blowing-on-lava graft; "ten thousand years,
  ten thousand times"; warm-on-top plant; `auto` deadpan buttons;
  Pip at 5 mandated lines; `_rock` keying; `a3_82` button tied to
  `a3_79`'s fate).
- Migration sources verified on disk (all four mp3s) and
  `REPLICATE_API_TOKEN` present — the migration table is executable as
  written.

### Deviations from the synthesis, flagged

1. **Line count: 189 spoken lines** vs the synthesis's "~160–175
   expected". Beats rule (no target), but the overage is flagged. The
   pre-agreed trim order if the showrunner wants it back under 175:
   `a3_30` (OPTIONAL aside), `a2_07`,
   `a2_25`, `a2_31`, `a3_09`, `a3_38`, `a3_41`, `a3_49`, `rc_09` — ten
   texture lines, no engine touched.
2. **Sunny's rocked wake line is two clips, no em-dash** (`a1_22`
   "GOOD MORNING?!" / 24f / `a1_23` "It said good morning. TO ME!") — the
   synthesis quoted B's "It — said good morning. TO ME!"; a mid-line
   em-dash is a TTS artifact risk (ep-4 ellipsis precedent), so the
   stammer is carried by the cut.
3. **The roll-call greeting is split into two clips** (`a3_13`/`a3_14`)
   so the beat before "Hi, Sandy." is a timeline gap, not a pause marker.
   The goodbye stays one clip.
4. **The blowing-on-lava beat** (`a3_06`) is an A device grafted into B's
   Scene 17 — not in B's structure; it satisfies the A-ledger honesty item
   and feeds the Scene-17 laugh clock. Cuttable.
5. **"Ten thousand years, ten thousand times." (`a3_43`)** — invention:
   reconciles the mandated countdown firing at break-a-mountain (B) with
   the mandated hundred-million-years honesty (A) in one exact arithmetic
   joke. Without it, the two rulings contradict on screen.
6. **The warm-on-top plant** (`co_08` "The sand was warm. On top.") —
   invention; arms `a3_80` so Sunny's precision pays off a cold-open
   sentence. Cuttable without breaking `a3_80`.
7. **Ember's deadpan buttons go `auto`** (`a3_16`, `a3_54`, `a3_58`,
   `a3_85`, `a3_87`, `rc_17`) despite her locked cast `happy` — per the
   STYLE hard rule "the button itself stays unseasoned". Every other Ember
   line carries cast `happy`; the one seasoned field is `a3_03`
   (`surprised`, direction cited on the line). Reserve seasoning: 1 of 2,
   unspent.
8. **Pip speaks 5 lines** (brief preferred a 1–3 line cameo) — the
   synthesis mandates the grade, the migrated stamp, the dispatch, and the
   two-clip feet-close; all five are that mandate, none is padding.
   Recast risk stays cents-sized.
9. **Rock's fresh keys use `_rock`** — ep-2's `_narrator` keying was
   legacy; only the migrated mp3 crosses under the old name (renamed by
   the migration, which is a copy).
10. **The chant is five words in four voices** (Ember carries both "Magma!"
    and "Lava!") — per the synthesis §7 list verbatim; its own
    accepted-deviations line says "five voices five words", so the
    discrepancy is flagged rather than silently resolved. If the
    showrunner wants a fifth voice, "Lava!" can move to no one naturally —
    Ember owning both names IS the rename gag — recommend keeping as
    scripted.
11. **`a3_82` ("Exactly right, at last. It only took five shows.")** —
    invented Narrator button after the inversion; it is the only line
    between the inversion pair and V6. Cuttable; if `a3_79` is ever cut to
    restore the bank, cut this with it.
12. **Scene 5's laugh-gap risk is structural** (self-map, flagged):
    RESOLVED by the edit pass — the Sunny pair is promoted to
    load-bearing; any future cut requires a replacement beat inside the
    cross-section.

**Sound-word spellings:** none of consequence — no WHOOSH, no stretched
vowels anywhere (nothing on kokoro needs one; MiniMax forbids them). The
knock, the rumbles, and the ash pop are staged sound design, never
narrated. The only capital inside MiniMax clip text in the whole episode
is the canon "FEEL" in Puff's migrated catch-phrase — which is precisely
why it is migrated, never freshly drawn. Every other MiniMax line is
sentence-case; shouts are drawn as caps in bubbles only (`a3_56` "FIRST!",
chant bubbles). All caps in Sunny's and the Narrator's lines are kokoro,
where they are legal and read as emphasis.

