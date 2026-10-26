# Little Big World — series bible

**What this is.** The canon reference for the kids' series: per-character
casting and identity, the running-gag ledger, banked material, and the
world rules that bind every episode. Current state only — provenance is at
most one parenthetical pointer per fact. **Boot rule: read this file
before any story work on the series** — it exists so an ep-4 showrunner
and story-writer can boot cold and stay on-canon without reading three
episode scripts.

**Who updates it.** The showrunner, at every episode retro, alongside
`docs/LEARNINGS.md` and `docs/STYLE.md`. Updates are edits to blocks and
tables, not rewrites. Casting fields and counts are byte-exact; anything
not verifiable in a script ledger is marked `(unverified)`.

Canon of record where this file is silent: each episode's `script.md`
(cast tables + production-notes/ledger sections; ep 3's ledger was
re-counted at the wave-3 fold and is authoritative) and `narration.mjs`
(exact engine/voice/emotion/speed/pitch fields). Ep-3 final = commit
`33fcafb`, 31,419 frames = 17:27.3, deployed 2026-08-05 — where any older
document disagrees with the tweak-round state, the tweak-round state wins.

---

## 1. The episodes so far

| # | Slug | Title | Runtime | Premise |
|---|---|---|---|---|
| 1 | `water-cycle` | Drip's Big Adventure | 9:33 | Drip the water drop rides the whole water cycle around the world and ends up exactly where she started. |
| 2 | `wind` | Puff and the Kite That Wouldn't Fly | ~12:29 | Puff the invisible air puff discovers he is real stuff — and where wind comes from. |
| 3 | `sky-blue` | Ray and the Sky Nobody Painted | 17:27.3 | Ray the sunbeam learns he was seven colours all along — why the sky is blue and a sunset is not. |
| 4 | `plants` | Pip and the Sunshine Kitchen | 15:36.2 | Pip the dandelion seed — total ambition, zero legs — builds "the biggest thing in the world" from one spot by ordering light, water and air: photosynthesis, at Sunny's absolute peak. |
| 5 | `volcano` | Ember and the Mountain That Said Good Morning | 14:02.8 (25284f) | Ember, a one-minute-old drop of lava who wants everything now, rides the eruption out of the mountain that has slept on the horizon for four shows — and learns rock time from Rock. The volcano speaks (seven lines), Sunny is wrong for the first time (the ceremony), a new island is born, and the ep-4 dirt debt is graded. |
| 6 | `storm` | Boom and the One, Two, Three | 15:35 (28049f) | Boom the thunder — born in the Cloud Hotel's lobby in the same instant as silent Flash — wants to be ON TIME and is counted at a window by a kid on ten fingers: six, three, two, one, zero (the break), then three, six, nine, ten-and-nothing. He is not late, he is FAR, and far is a ruler (three counts a kilometre). Cloudia's hotel goes vertical, Drip freezes big, Blue is finally first, the volcano says one line, and the end card hangs a half moon over the island. |
| — | `drip-fork` | DripChooses (CYOA, phase 1.5) | 4:41–5:20/path | **Non-canon.** Branching Drip mini-adventure built from ep-1 assets (`docs/CYOA.md`). |
| — | `drip-again` | DripAgain — Drip Goes Up Again | 5:11–5:55/path | **Non-canon.** Sequel CYOA pitched by the 8-year-old (beaver's dam, a mountain that is really a volcano, obsidian). |

**Ep-4 canon status.** Folded 2026-08-24 by the ep-5 showrunner (canon
only — the ep-4 taste/process retro runs with Mike's ep-4 tweak round;
extraction record: `scratchpad/ep5/ep4-canon-extract.md`). Anything below
marked **PROVISIONAL** was decided in Mike's stead
(`src/videos/plants/ep4-decision-log.md`, TOP items first) and may be
overturned by his tweak round. Ep-4 = 28085 frames, 238 spoken lines
(222 recordings), one Big Word card (PHOTOSYNTHESIS; the five-voice
syllable chant was replaced 2026-10-17 by one Narrator chant — world rule
15).

**Ep-5 canon status.** Folded 2026-10-26 by the ep-6 showrunner from
`src/videos/volcano/script.md` (source of truth) + `ep5-decision-log.md`.
Mike never sent ep-5 tweak notes; the kids rated it 🤩 via the hub (Math,
8: "Funny, Fun!"). So the ep-5 TOP items are **PROVISIONAL** until he
rules: Ember's casting (`Playful_Girl`), the "That is not me." inversion
SPENT, the ceremony's placement at the eruption's peak, the volcano's
seven lines + staying awake, Ember's armless rig, the `a3_63`
"Presently." pace and `rc_03` chant read. The **ep-6 tease (the storm) was
RATIFIED by Mike 2026-10-26** — the kids have seen the card. Ep-5 =
25284 frames, 190 spoken lines (178 recordings, 12 `sameAs` aliases, 4
cache-migrated clips), four Big Word cards (MAGMA, LAVA, ERUPTION,
EROSION) + the dirt answer as a STAMP on the returning ep-4 card.

**Ep-6 canon status.** Folded 2026-10-26 by the ep-6 showrunner the day
the cut shipped, from `src/videos/storm/script.md` (source of truth) +
`ep6-decision-log.md` + `narration.mjs`. **Straight-to-cut campaign:
nothing from ep 6 has Mike's sign-off yet** — every TOP item is
**PROVISIONAL** until his pass: Boom's casting
(`English_magnetic_voiced_man`), Blue's payoff FIRED, the ep-7 moon tease,
the half moon lit toward the sunset, the S12 count (Blue's line sits
between the flash and "One." — ~6s under a three-count), picture-only
sound design, the volcano's one line, Drip's travel-sized variant, Cloudia
as a faceless tower in exteriors. Ep 6 = 28,049 frames, 26 scenes, 198
spoken lines + 52 count firings (192 recordings incl. 10 count numbers +
2 cache migrations; 58 `sameAs` aliases), three Big Word cards (STATIC,
LIGHTNING, THUNDER) + the rule stamp LIGHT IS FAST. SOUND IS SLOW., one
MYTH stamp.

Series shape constants: cold open → title → three acts → recap (chant,
mind-blower, tease); Big Word cards; the next-time question on the end card.

---

## 2. Per-character canon

### Narrator
- **Casting, locked:** kokoro `af_heart`, speed 1.0. Voice only — no body,
  ever. All episodes.
- **Personality:** warm storyteller who deadpans at Sunny for a living.
  Three episodes of deadpanning at him; ep 3 was the first of contradicting
  him — and also of conceding to him ("He has a point.", `a2_49`).
- **Speech patterns:** short flat sentences; deadpans are always *about*
  obvious behaviour, never ironic reversals. Deadpan lines run slow
  (ep-3 floor: 0.8 on "No, Ray, not yet."; house flat read 0.92). She owns
  the flat middle line of every roll call, and the returning-character
  rhyme *"Different show. Same ___."* — four firings series-wide, all at
  0.92 flat (ep 2 `a2_18` sun / `a3_42` sky; ep 3 `a1_32` rain / `a2_18`
  air).
- **Arc:** ep 1 loves Drip (and cameo-voiced the flower and moose — a
  pattern the distinct-voice rule has since retired); ep 2 concedes twice
  to Sunny and plants the long fuse; ep 3 runs the almanac metronome and
  breaks her own pattern exactly once ("No, Ray, not yet."); ep 4
  concedes Sunny's peak on the record ("Annoyingly." / 24f / "That is
  completely true." — a split clip, the ep-1 echo) and owns the swerve's
  second firing ("Who makes the wind that stirs him? Moving on."). New
  ep-4 chain: *"It is the highest grade she gives."* (2 firings,
  byte-identical, 0.9 — travels with Pip's stamp chain; OFF in ep 5 by
  scarcity, still 2 series-wide). Ep 5: she closes the long fuse — the
  ep-2 sentence re-spoken byte-identically (`a2_39`, kokoro identical
  take), 36f mirror gap, *"It is today."* (`a2_40`), then the 180f series
  record silence; she rules "No. He really didn't." gently and buttons
  the recovery kindly ("Most other things. He is most other things."). She
  also fired the Blue button's second form ("He was not first. He was
  very sure, though. Those are different things.") and the translation
  joke "'Presently', from a volcano, means ten thousand years. He is the
  politest clock in the world." Ep 6: she owns THE COUNT — ten kokoro
  number clips ("One."–"Ten.") on a thirty-frame onset grid, 52 firings,
  counted with the kid's fingers; **she never says "Present." herself**;
  the lesson said once ("Three counts for every kilometre. You are the only
  thing in this show a kid can measure with their fingers."); "Different
  show. Same hotel." (`co_09`, the ninth firing); the Blue button FLIPPED
  (`a2_26`); "Both true." ×2 (`a2_31` source, `a3_67`); "There he is." ×2
  (`co_24`, `a1_59` — the same nine seconds twice).

### Drip
- **Casting, locked:** minimax `Lively_Girl`, emotion `happy` throughout,
  speed 1.0 (since ep 2; her ep-1 casting was kokoro `af_bella` 1.1 and is
  retired).
- **Personality + want:** curious, brave, slightly dramatic; wants to be
  taken as big. The rainbow is **hers** — rain plus light — and she knows it.
- **Catch-phrases:** *"I am NOT small! I am travel-sized!"* (ep 1 `co_06`,
  `rc_14`, plus the unreadable-speck sight gag). Entrance line *"Hi! It's
  me! I'm the weather!"* — identical text two episodes running (ep 2
  `a3_41`, ep 3 `a1_31`); treat as her standing entrance.
- **Arc:** ep 1 hero (the cycle is a circle; might have been a dinosaur's
  puddle). Ep 2: one-line fan-service cameo waving from inside Cloudia.
  Ep 3: returns for the rainbow scenes and takes rain's half of the credit
  ("Rain and light! That is you and me!"). Ep 4: ingredient WATER — "one
  water" vs THE WEATHER, "I am the plumbing! Of the biggest thing in the
  world!", "I have been mud. I was delicious." (`a2_44`), chant syllable
  "Pho!". Her entrance line's **third identical firing** was
  cache-migrated from sky-blue `a1_31_drip` (the audibly identical take
  IS the joke). Ep 5: demolition crew (rain is what crumbles mountains)
  with Puff — entrance = the standing line's **fourth identical firing**
  (`a3_35`, cache-migrated from sky-blue `a1_31_drip`); delighted at the
  hundred-million-years number ("We know! We love it!"); chant syllable
  "Sand!". Ep 6: rides Puff's lift to the penthouse and FREEZES — hail,
  for once in her life big (ice coat, scale 0.6 → 0.9); owns BOTH roll
  calls (the hail — see the ledger); standing entrance **fifth identical
  firing** (`a1_09`, cache-migrated from sky-blue `a1_31_drip`); melts
  back to a drop on the step — **"I am travel-sized again."** (`a3_07`,
  CUTTABLE, PROVISIONAL), the first travel-sized revival since ep 1.
  "Travel-sized": 1 variant in ep 6.

### Puff
- **Casting, locked:** minimax `Exuberant_Girl`, speed 1.0. Ep-3 cameo was
  `happy` throughout; the ep-2 hero arc carried seasoned emotions (sad →
  surprised → happy) that were arc-specific, not defaults.
- **Personality + want:** small, quick-breathed, once convinced he was
  invisible and therefore nothing; now knows he is STUFF. His ep-2 apology
  reflex counted down to zero across the episode — that arc is spent, do
  not restart it.
- **Catch-phrase:** *"You can't see me. But you can FEEL me."* — 4
  series-wide (3 in ep 2, once in ep 3); one per appearance is the rate.
- **Arc:** ep 2 hero (air is real; wind is air in a hurry). Ep 3: five
  short lines doing real work — Puff is the air, and the air does the
  scattering ("There are ZILLIONS of us. We are the whole sky."). Ep 4:
  ingredient AIR — alarm → commerce ("The leaf is eating me!" →
  "I traded with a plant!" → "I am going to be a tree."), quiet closer
  "A plant made that one. Pass it on." Catch-phrase fired once AS his
  entrance (`a2_55`, cache-migrated from wind `a1_40_puff`) — now 5
  series-wide (unverified; recount owed at ep-4 retro). His "Different
  show" firing was deliberately SKIPPED (ruled: an invisible character
  cannot be pointed at; his catch-phrase IS his entrance). Ep 5: the
  other half of the demolition crew (wind) and the loop's courier — he
  carries the new island's first soil to Pip's meadow and the first seed
  rides his wind back; entrance = the catch-phrase again, cache-migrated
  from wind `a1_40_puff` (series count now 6, unverified), zero seasoned
  lines; chant syllable "Soil!". Ep 6: two mechanism jobs — the LIFT (the
  updraft; his entrance IS the lift: "Going up." chain, `a1_06` source +
  `a1_12`, `a1_37`, each one a coat of ice on Drip) and the GUST FRONT (the
  break "Going down." `a2_02`, then the catch-phrase ONCE at the kid's
  window as the cold wind, `a2_03`, cache-migrated from wind `a1_40_puff`
  — series count 7, unverified). "Different show" skipped again (cannot be
  pointed at). The ep-4 "his catch-phrase IS his entrance" was a ruling,
  not a law (ep-6 decision log).

### Sunny
- **Casting, locked:** kokoro `am_puck`, speed 1.0 — series voice since
  ep 1. MiniMax was auditioned twice (ep 2 `Imposing_Manner`, again for
  ep 3) and rejected both times; Mike's ruling: mechanical is funnier, and
  a returning character does not get a new engine. Kokoro means **no
  `emotion` field ever, no pause markers ever, no stretched vowels** — his
  stops are carried by words, slower `speed`, and his face.
- **Personality + want:** the Sun. Colossal ego, the series' laugh engine;
  claims credit for everything and is always annoyingly at-least-half
  right. **The verdict fired in ep 5** (see ledger): his infallibility is
  dead, his ego is fine. **New steady state from ep 5 on — PRECISION:**
  half-right forever, allocating exactly which part is his ("The warm on
  top is me."); every post-ceremony claim he makes is individually TRUE
  and the Narrator checks each one. Write him that way: he no longer
  claims the whole thing, he claims his part loudly.
- **Catch-phrases:** see the ledger table for counts and ceilings. His
  four: "You're welcome! HA! HA!" (ceiling 8 in ep 3); the greeting+brag
  pair (three-for-three, a series constant); "OH! That one is me as
  well!" (banked, ledger); *Sunny interrupts a scene that is not about
  him* (ep 2, five firings, every one of them true).
- **Arc:** ep 1: powers the whole cycle, completely right ("annoyingly, he
  is completely right"). Ep 2: makes all the wind, right again; the long
  fuse is planted. Ep 3: his sky-paint theory fails **in half** — the light
  is his, the painting is the air's; he concedes nothing louder than
  "I DO have a point! I have LOADS of points!". Ep 4: **his peak — every
  claim fully true, zero wrongness fired**; Pip's admission arrives as a
  promotion ("He was never the delivery service." / "He is the oven."),
  the Narrator concedes on the record ("Annoyingly." / 24f / "That is
  completely true."), and his peak-ego lines are on file ("Every apple is
  MY apple!", "Sweetness is me, in a box."). Ep-4 firsts: he does NOT
  interrupt Sc 23 ("for the first time in four whole shows"), quietest
  line in four episodes ("I know.", 0.95), first silent beat (Sc 26).
  He exited ep 4 at maximum altitude. **Ep 5: THE CEREMONY (fired,
  spent).** Cold open: the banked wake-claim "OH, that one is me as well!
  HA! HA!" cashed at the knock (`co_10`, full confidence; "Nobody had
  asked. He answered anyway."). At the eruption's peak: "I did that." /
  Narrator "No. He really didn't." / volcano "If I may. The fire is mine.
  It came with the house." — the heat is the world's own, left over from
  the day it was made, the one warm thing on the planet that was never
  his — then the fuse closes and the **180f series-record silence** is
  his stunned beat, the series' first. Quietest line ever: "The fire is
  not mine." (0.9). Recovery AS SUNNY on truths: "But the sea that will
  cool it is warm because of me! The sky it is climbing through is bright
  because of me!" / "The fire is one thing. I am all the other things!
  HA! HA!" Act 3 demonstrates the new precision: the demolition crew is
  his weather (true), **"That is not me." / "The warm on top is me."**
  (`a3_79`/`a3_80` — the banked inversion SPENT as precision, pays the
  cold-open plant "The sand was warm. On top."; Narrator: "Exactly right,
  at last. It only took five shows."), "I warm the sea on top of it!"
  about the island he cannot see. "You're welcome! HA! HA!" ×4 (ceiling 8
  untouched). Interrupted a scene not about him once, truthfully ("If
  anyone down there needs light, I am available!"). **Ep 6: precision
  throughout** — his heat built the storm (true, and he says so); hidden
  behind the tower from Scene 5 to Scene 22 and loud about it
  (`SunnyGlow`); interrupts ×5, every one true; greeting+brag
  **six-for-six** (`co_03`/`co_04`); "You're welcome! HA! HA!" ×4 (`co_07`
  source + `a1_22`, `a3_06`, `rc_10`; ceiling 8 untouched); at the
  mind-blower he keeps the inside — "The surface. Only the surface.
  Inside, I am MUCH hotter." / Narrator "I checked. Fifteen million
  degrees, in the middle. It holds." (`rc_08`/`rc_09`); end card, from
  below the horizon: "I CAN ANSWER THAT ONE!" (`rc_17`, true — the light on
  the moon is his).

### Ray
- **Casting, locked:** minimax `Young_Knight`, speed 1.0 (Mike,
  2026-07-27, four-voice audition; constant `RAY_MINIMAX_VOICE`). Emotion
  default `auto`; ep-3 seasoning was the arc: `sad` only in the sulk (two
  lines), `surprised` when a fact lands, `happy` from the rainbow on, one
  `calm` at the sunset, first `fearful` at `rc_21` ("Is it me??").
- **Personality + want:** hero of ep 3 only so far. One sunbeam, eight
  minutes old, earnest and literal — **a pedant** ("Red did not say
  anything.", "It was mostly Blue."). Corrects people by *giving* them the
  half they own. Wanted to not be the plain one; answered.
- **Body (identity):** candidate **F2** — Cheshire face in a feathered
  glow over an independent wave ribbon, no head disc, face a beat late on
  the crest. **No arms at rest, by design.** His seven shards are an
  **ascending frequency ladder** at one shared wave speed (Red 1.0 cycles
  → Violet 7.2). Watch item, not rework: Mike finds him "a little alien-y,
  we'll see how the kids respond".
- **Catch-phrase:** *"Look up. That's me."* — a pointing line a child can
  obey and be right (3 firings, ep 3, incl. sunset form "That's still
  me"; ep 4: 1 firing pointed at the MOON + approved variant "Look down.
  That is also me." at the sugar). The rig's `skeptical` face debuted on
  him (s10).
- **Ep 4 (ingredient LIGHT):** every correction he files lands in Sunny's
  favor, which he finds structurally upsetting; resolved at peace inside
  the aria. Collects his ep-3 terror: "And for the record, nobody is
  eating me. I checked before I took the job." Deadpan bow: "Light. Also
  me. Mostly him." **NEW tic, PROVISIONAL (needs Mike's ear):** *"That is
  also true."* — 3 firings, 1 recording, capped at 3 (`a1_26` source);
  one neutral take, three contexts — the context does the acting. His
  `a3_36` "It is mostly him." is the credit-allocation device's 5th
  firing (see ledger).

### Pip

- **Casting, PROVISIONAL (decision-log TOP, Mike's ear pending):**
  minimax `Inspirational_girl`, speed 1.0 (`PIP_MINIMAX_VOICE`). **Zero
  emotion fields, zero pause markers, by design** — her register IS the
  casting: clipped, brisk, small-but-certain, DRY not loud, warm
  underneath — "a six-year-old CEO." Deadpan floor 0.9 on her stamps.
  Audition clips `scratchpad/ep4_pip_audition/` (rejected `Lovely_Girl`,
  `Wise_Woman`).
- **Personality + want:** hero of ep 4. Dandelion-seed site-manager/chef;
  addresses everyone by job title, never name (the delivery service /
  the light order / one water / the air order); wants to build the
  biggest thing in the world, right here, without taking a single step
  ("Good. Moving is for things that are too small to stay.").
- **Body (PROVISIONAL with the sheet, `scratchpad/ep4_pip_sheet.png`):**
  NO ARMS ever — leaf-point + heliotropism lean ARE her gesture rig
  (`pipLean()` signed degrees + snap-back; pointer POINT_HELD=14 /
  POINT_CEILING=56, honest aim tops out 61.1°); five staged growth
  states (seed-in-air / planted / sprout / first-leaf / young plant) as
  capability unlocks, never a time-lapse; pappus ruff kept after
  planting; warm-oat palette (#f3ddb0, stem #5ccc63) dodging Sunny's
  gold; `skeptical` as her RESTING face (extends the ep-3 shared face —
  new use, flagged).
- **Motion law (hard):** plants take no steps, not one, not ever — her
  only travel is growth. Arrivals stoop to her mark; she never rises.
- **Catch-phrases:** *"It will do."* — 5 firings, 1 recording
  (`co_17` source), self-capped at 5 + the break *"It will not do."*
  (separate recording ON PURPOSE, plot-causal) — her only grade, her
  highest grade. Episode's last line: "Send it here. I will grade it."
  (PROVISIONAL writer deviation).
- **Arc (ep 4):** posts LIGHT/WATER/AIR (dirt conspicuously absent),
  builds the kitchen, breaks at one crumb of sugar, hires the Sun ("He
  was never the delivery service." / "He is the oven." / "The job is
  yours. Shift starts at dawn."), stamps the Sun himself. Her lean goes
  from corrected → voluntary → uncorrected → **permanent** (the
  resolution IS the admission). Soil canon she owns: "Nobody eats
  dirt." and "It's where I keep my feet." — the episode's complete
  account of dirt (ep 5 paid off the origin).
- **Ep 5 (one scene, five lines, rooted in the meadow exactly where ep 4
  left her):** the live order "Send it here. I will grade it." was
  executed — Puff delivers the new island's first soil ("Special
  delivery."), she grades it ("Fresh mountain. Old leaves. Somebody is
  building something." → **"It will do."**, cache-migrated from
  `co_17_pip`, the ep-5 budget exactly; chain stays at 5 firings + 1
  migration) and dispatches a sibling ("Pipsqueak. You are up."). Her
  feet-close: "Dirt is crushed mountain. So my feet are in a mountain." /
  beat / "Good." The Narrator's "highest grade" companion chain stayed OFF.
  Pipsqueak (silent pappus seed) is the first seed on the new island.

### The seven colours

Shared law (ep 3, binding wherever they appear): each colour keeps **one
phase index, one signature move, one emotion, and exactly one want,
forever**. Their temperaments ARE the physics and are never stated as a
property of light. Line counts below are the ep-3 revision-2 cast table
(firings, `sameAs` included).

#### Red
- **Casting, locked:** minimax `Patient_Man`, `calm` on every line forever,
  speed 0.9. (`Deep_Voice_Man` excluded — he is ep-2's Rock;
  `Elegant_Man` −6 reserved — he is the volcano.)
- **Want:** peace and quiet. 11 ep-3 lines.
- **Motion/staging laws:** walks; always the same speed, always a dead
  straight line, never reacts to anything; **16f approach gap** before
  every line. Wave signature: one trough, one peak.
- **Speech:** shortest possible flat sentences, full stops even where a
  question would go ("Start of what.", "Won what.", "No.", "I am walking
  home.", "Very dramatic."). Failure mode is SLEEPY: contented, never
  tired — a tired Red reads as the light dying.
- **Arc (ep 3):** owner of the sunset; wins the race without ever finding
  out it was one.

#### Orange
- **Casting, locked:** minimax `Determined_Man`, `calm`, speed 0.95,
  **pitch +2** (a smaller Red, not a second authority).
- **Want:** to be Red. 14 ep-3 lines — devotion IS the character, and his
  vocabulary may be essentially *"What Red said."* forever (3-firing
  `sameAs` chain, ep 3).
- **Motion/staging laws:** matches Red's stride exactly, one body-length
  behind, never overtakes; 8f approach gap.
- **Signature construction:** translates Red's silences ("Red says he
  noticed.", "He meant to." — 6 paired firings in ep 3), and never once
  looks at Red while doing it (earned at s18).
- **Arc (ep 3):** finishes second, right behind Red — a want announced as
  a victory.

#### Yellow
- **Casting, locked:** minimax `Sweet_Girl_2`, `happy`, speed 1.0. She/her
  in every document.
- **Want:** everyone to have a wonderful time. 10 ep-3 lines.
- **Motion/staging laws:** waves at everyone, continuously, including at
  things that are leaving.
- **Signature construction:** the cheer format *"Great ___, ___!"* —
  seven ep-3 firings, always cheering somebody who is leaving or gone;
  button: *"Great bounce, me!"*. **She is the only character in the series
  who ever addresses Violet** ("Great bounce, Violet!").
- **Arc (ep 3):** tried to rest on the volcano and was warned off; bounced
  away apologetically during the one-eye beat.

#### Green
- **Casting, locked:** minimax `Friendly_Person`, `calm`, speed 0.95.
- **Want:** to sit down. 10 ep-3 lines. Content; has no notes — opinions
  ONLY about spots.
- **Motion/staging laws:** sits down the instant anything on screen stops
  moving.
- **Signature construction:** *"This is a nice spot."* — 3-firing `sameAs`
  chain (ep 3), one recording.
- **Arc (ep 3):** left the race for a becalmed sailboat and did not get up
  ("I found one."); physics-honest exit ("Green bounced off as well. He
  just took longer.").

#### Blue — **breakout character**
- **Casting, locked:** minimax `Decent_Boy`, `happy`, speed **1.05** (the
  suite's first >1.0 — the speed is the character and the physics).
  Healthy take band **0.31–0.36 s/word**; an outlier is a bad draw, not a
  recast.
- **Want:** to be first (and liked). 29 ep-3 lines.
- **Motion/staging laws:** ricochets; **never travels more than half a
  frame without changing direction**; **4f approach gap**; **apologises to
  things he hits** ("First! Sorry, rock! I am FIRST!"). His blur is a
  change of *direction* (Violet's is amplitude — they must read as
  different kinds of blur).
- **Status:** Mike laughed out loud, "hilarious", cameos wanted "for sure"
  (2026-08-04). His built identity is audience-validated and **carries
  into cameos unchanged**.
- **The anti-Sunny arc — FIRED in ep 6, now history:** confidently wrong
  about being "first" (or a similar superlative) episode after episode
  until one day he is finally right. Mirrors Sunny's inverted claim
  machinery (Sunny claims credit and is at-least-half right until ep 5;
  Blue claims priority and is wrong until the one day he isn't).
  **Multi-episode plant — DO NOT fire the payoff early.** Seed slots:
  ep-4 cameo (light still travels), ep 5. Ep-3 "first" firings on record:
  `a1_40b`/`a1_40d`, `a2_20b`, `a3_05b`, `a3_08b`/`a3_08d`, `a3_11d`,
  `a3_13bb` ("I am winning UPWARDS!"). **Ep-4 seed watered** (one dawn
  cameo, Scene 8): "First! Sorry, dandelion! I am first!" / "Then I am
  first today! Today counts! Sorry, fence!" / "First to leave! I am first
  to leave!" — wrong twice (Ray arrived the night before via the moon;
  Pip lives there), corrected as gifts, right about nothing; Narrator
  button: "He was not first. He was very fast, though. Those are
  different things." **Ep-5 seed watered again** (Scene 22, two lines):
  "First! Sorry, rock! I am first to the newest place in the world!" →
  Ember, flat: "I live here. I was here before here was here." → 45f
  freeze → "Then I am first to visit! Visiting counts!" → Narrator:
  "He was not first. He was very sure, though. Those are different
  things." Wrong-count: ep 3 origin, ep 4 twice, ep 5 twice. **THE PAYOFF
  FIRED IN EP 6 (Scene 12; PROVISIONAL — showrunner call, Mike gave the
  slot as "natural but NOT promised"; reversal: cut the flipped button +
  his reaction and re-word `a2_21` to a wrong claim, one scene, cents):**
  he is light, the flash is light, he arrives WITH Flash — "First! Sorry,
  sea! I am first!" (`a2_21`) — and is RIGHT for the first time in four
  episodes; the Narrator's FORMAT flips once and closes: "He was first. He
  was also very fast. Today, those are the same thing." (`a2_26`); "He has
  never been right before. He does not have a line for it." → the series'
  second stunned beat, **90f**, a `<Freeze>`; "I was first!" / Boom "And I
  was on time. Good team." / "Both true."; exit "First to go home! Sorry,
  curtain!". **The arc is SPENT and the format is CLOSED** — from ep 7
  Blue is a cameo who was right once; do not re-arm the wrongness.
- **Signature construction:** *"I just said that!"* — 4-firing `sameAs`
  chain, **capped at 4** (ep 3).
- **The blue copies (name canon, Mike's pick, T4):** **Bluington,
  Bluesworth, Bluey** — and the fourth greeting is **"Hi... me!"**
  (`a2_32b`: "Hi, Bluington! Hi, Bluesworth! Hi, Bluey! Hi... me!").
  Exact spellings. Bubbles only — the copies have no voices of their own;
  prime cameo fodder for the anti-Sunny arc.

#### Indigo
- **Casting, locked:** minimax `Decent_Boy` (same casting as Blue),
  `happy`, speed **1.1**, **pitch +3** — UP and thinner, a faded copy, not
  an older brother (Mike's call; `pitch` is a whole-semitone MiniMax-only
  field invented for him).
- **Want:** to be Blue. 12 ep-3 lines.
- **Motion/staging laws:** copies Blue's last move **four frames/beats
  late**, from the place Blue just left; 12f approach gap (late on
  purpose); **drawn behind and 26px under Blue**.
- **Speech pattern (hard rule):** every line he has is the **tail of the
  Blue line before it**. Write him that way or he is just another voice.

#### Violet
- **Casting, locked:** **NONE, EVER.** No voice, no lines, no `VIOLET`
  constant to hang one on. **Not one line, not ever, in any episode.** The
  moment he speaks, the gag is dead.
- **Want:** to be noticed — and never is. The want is **staged, never
  voiced**. The only character who addresses him is Yellow.
- **Motion/staging laws:** vibrates so hard his outline blurs — 7.2-cycle
  fizz at the top of the frequency ladder, blur = **amplitude in place**
  (vs Blue's direction blur); the fastest, hardest-working object in any
  frame he is in. **Same blob every time**: same seventh colour, same
  `SHARD_PHASE[6]`, same silhouette.
- **Gag state:** *nobody ever notices Violet* — **seven firings in ep 3**
  (5→7 at the wave-3 fold; ep-3 script ledger is the authoritative tally —
  `narration.mjs`'s header comment counts nine by a finer breakdown), zero
  clips, zero runtime. Plant s10, fire s11, pay off s20 ("Sorry,
  Violet."), escalate s27b ("Six racers." / "Make that seven."), button
  s28 (exits highest, furthest, in total silence), wave from the recap
  panel edge. Ep 4: one silent garnish firing (Scene 8 — far frame edge,
  amplitude blur, same body, noticed by nobody, exits before scene end;
  not in the recap — his ep-3 panel wave was his). Ep 5: one silent
  garnish firing (Scene 22 — already on an island that did not exist
  yesterday, noticed by nobody, same body, amplitude blur). Ep 6: one silent garnish firing
  (Scene 12 — far frame edge, also with the flash, also first, noticed by
  nobody). Series total: 7 (ep 3) + 1 (ep 4) + 1 (ep 5) + 1 (ep 6), zero
  clips.

### Rock
- **Casting, locked:** minimax `Deep_Voice_Man`, `happy`, speed 0.85.
  (His line keys end `_narrator` — legacy keying, deliberate.)
- **Identity:** one line, very slow, completely sincere — "Ohh yeah. That
  is the stuff." (ep 2: two firings, one recording via `sameAs`, eight
  minutes apart; the payoff is that nothing happened in between).
- **Ep 5 — promoted to mentor** (origin payoff: he was lava once; Ember is
  his childhood, he is her future). Ep-5 keys use `_rock` (the `_narrator`
  keying was legacy). **24f fixed approach gap before every line** —
  identity, never escalated. Shortest sentences in the show, geological
  calm, zero irony. His lines on record: "It is resting." / "I was fast
  once." / "Since I stopped." / "I moved." (rafting on a flow — the hugest
  event, the smallest sentence) / the thesis "…You are not going
  somewhere." / "You are becoming somewhere." / the turn triple "Fast
  things are small." / "Slow things are big." / "You are going to be
  enormous." / the namespace exchange "…You will change names one more
  time." / "…Rock." / "That is your name." / "…It is a very popular name."
  Catch-phrase: 2 firings, ONE recording (cache-migrated from wind
  `a2_08_narrator` + one in-episode alias) — nothing happens in between,
  again. His half of the spine gag: **"Started."** (`a2_16_rock` source,
  4 firings) and the break — his first question ever, "Done?" (fresh
  recording). Chant: "Rock." flat, late, his own name.
- **Voice reserved forever:** do not hand `Deep_Voice_Man` to anyone else.
  Casting is not the only collision to avoid: any new deep male voice
  must also clear the volcano (`Elegant_Man` −6).

### Cloudia
- **Casting, locked:** minimax `Abbess`, speed 1.0 (since ep 2; ep-1
  kokoro `bf_emma` is retired).
- **Personality + want:** grand, theatrical manager of the Cloud Hotel;
  adores her guests, despises gravity. Verbal tic: *"darling"* on every
  composed line — dropping it marks lost composure ("We are at! Full!!
  Capacity!!!").
- **Arc:** ep 1: the hotel fills, condensation is her stress. Ep 2: two
  scenes, delivered across the sky like a parcel and could not be happier;
  Puff steals "darling" for an impression (`rc_11b`). Ep 3: absent.
  Ep 4: one scene (rain delivery, "Gorgeous penmanship, darling." —
  "darling" ×5, every composed line), marked CUTTABLE and kept
  (PROVISIONAL). Ep 5: absent, **owed the storm** — ep 6 is hers to
  carry (the Cloud Hotel has only ever been drizzle-grey; a thunderhead
  is the hotel gone vertical). Her ep-1 body of canon: "A cloud is a
  zillion tiny water drops, floating together. That is all! No fluff! No
  feathers!"; house rule "Every guest must hug a speck of dust"; "I love
  my guests. I hate gravity."; "Darling. There are no stairs."; the
  MYTH-stamp "clouds are not pillows" was hers to bust. **Ep 6: the storm
  paid — second lead,** thirty lines, every one hotel management and every
  one mechanism (a thunderhead is the Cloud Hotel gone vertical: a lift
  with no stairs, a penthouse freezer, guests rubbing past each other,
  somebody leaving through the wall). "darling" on 28 composed lines;
  dropped on exactly ONE — the break `a1_45` "Somebody has just left
  through the wall!" — back one line later, strained; "Mark him present,
  darling." closes it. Two ep-1 canon lines re-fired VERBATIM as fresh
  Abbess recordings (quotes, not chains — ep-1 Cloudia was kokoro):
  "Darling. There are no stairs." (`a1_03`) and "I love my guests. I hate
  gravity." (`a3_02`). **Owns the ep-6 MYTH bust:** "Darling. We do not
  bump. We mingle." (the zillion-drops canon re-stated inside the defence,
  `a2_70`). The gala gag: "born for a gala" → "Darling, I could weep." →
  "Is this the gala?" / "Darling. I believe it is." → the grandest
  check-out in the history of the trade, through the wall and the floor.
  Staging canon (PROVISIONAL, builder call for Mike's eye): in exteriors
  the small grey cloud IS her rig and she speaks from it; once the tower
  stands it is a building with no face and she is the manager inside.

### Ember
- **Casting, PROVISIONAL (ep-5 decision-log TOP, Mike's ear pending):**
  minimax `Playful_Girl`, speed **1.1** (the suite's fastest — the speed
  is the want), dropping to **1.0 from her turn onward** (`a3_65` on; the
  arc is audible). Cast emotion `happy` on every line except her deadpan
  buttons and the break (`auto`); one seasoned field all episode
  (`surprised` at the skin-over, `a3_03`). **No caps in any of her line
  text.** Measured 270 Hz — +4.1 st clear of the Drip/Puff/Pip 320–380 Hz
  band (`scratchpad/ep5_ember_audition/MEASUREMENTS.md`). Constant
  `EMBER_MINIMAX_VOICE`; a recast re-buys 38 clips (cents).
- **Personality + want:** hero of ep 5. A drop of lava, she/her, one
  minute old at her first line; wants everything, immediately; small,
  bright, quick, GLEEFUL — indignation played inside delight, never
  whiny. Inspector attitude: everything slow is "broken" ("Nothing down
  here moves. It is all broken." / "This traffic is broken."), and nobody
  ever corrects her — the world just holds still until she re-grades it.
  Enters the series mid-sentence ("and another thing. Nobody here has a
  schedule…").
- **Body (ratified by the ep-5 showrunner, PROVISIONAL for Mike's eye):**
  **NO ARMS** — orange bars at her size read as fins; her gesture rig is
  lean/squish/travel/staging. Speed is the characterisation.
- **Catch-phrases / chains (ep 5, all SPENT):** **"Done!"** (`a2_15`
  source, 4 firings at escalating objects: crust → beach → island →
  surfaced island), answered every time by Rock's **"Started."** — the
  double chain; **THE BREAK** = role reversal, Rock "Done?" / Ember, with
  his 24f gap, at 1.0: "Started." held 45f. Her turn: "I used to be fast.
  Now I am ten thousand years long." / "Then I have already started." Her
  residency line to Blue: "I live here. I was here before here was here."
  Goodbye button: "See you in ten thousand years." Chant: "Magma!" /
  "Lava!" (she owns both names — the rename gag).
- **Arc (ep 5):** born in the magma chamber, out in the eruption, renamed
  mid-flight, crusts over, becomes the first black beach, then the newest
  island in the world; sits still on purpose for the first time at dusk,
  asks the volcano "When will I be as big as you?" — "Presently." — and
  discovers slow is what big feels like from inside. **End state:** she IS
  the new island beside the volcano (visible on the horizon in every
  coastal wide from ep 6 on), happily scheduling in geological time;
  Pipsqueak is planted in her first soil. Not a travelling character any
  more — a cameo from her is a line from the island.

### The volcano — now a character
- **Casting, locked (Mike's reservation since ep 2, first used ep 5):**
  minimax `Elegant_Man`, **pitch −6**, speed 0.9, emotion `auto` forever
  (the butler read is the voice's job). No caps, no pause markers (his
  pauses are cut gaps), no body walk — he is the mountain; staging
  vocabulary is "the mountain moved slightly and that is enormous".
  **48f approach gap before every line** (series record; the mountain
  deciding to move). Portrait bubbles are hand-placed and tail from his
  MOUTH, never his eye.
- **Personality:** enormous, courteous, unhurried, faintly apologetic
  about the ash — the mountain that finally roared speaks like a butler.
  **Scarcity IS the character: seven lines in ep 5, every one a tent
  pole.** Complete list: V1 "Good morning. I appear to have overslept."
  (first line in series history; returns Sunny's greeting four shows
  late) / V2 "Do pardon the ash." / V3 "Do excuse the noise. This is the
  loud part." / V4 "If I may. The fire is mine. It came with the house."
  / V5 "Presently." (his only reply to Ember — "'Presently', from a
  volcano, means ten thousand years") / V6 "I believe the garden is
  ready." / V7 "Good night." Banked, unfired: "…Ah. There it is. I do
  like this part." Future episodes keep him RARE — single digits, ideally
  one or two lines, never banter. **Ep 6: ONE line** — "Louder than me.
  Well done." (`a2_63`, at the overhead CRACK, 48f gap, CUTTABLE,
  PROVISIONAL; nobody replies, Boom beams). Boom's "The loud part is the
  best part." (`a2_76`) is an ECHO of V3, not a quote. Series total 8. His
  lit summit was the one steady light on ep 6's dark horizon.
- **End state (NEW CANON, ep 5, PROVISIONAL):** **AWAKE.** "He is not
  going back to sleep. He is just being polite. He has ten thousand years
  of work to do." Summit glowing gently, thin smoke, the new island
  (Ember) beside him. The sleep ladder is complete and closed. Looking at
  him, naming him, and talking to him are LEGAL from ep 5's Scene 3 on
  ("The rules are over.") — see the ledger for the current volcano rule.

### Boom
- **Casting, PROVISIONAL (ep-6 decision-log TOP, Mike's ear pending):**
  minimax `English_magnetic_voiced_man`, speed **1.0 on every line,
  forever** (sound has one speed, so does he; the arc is what he is proud
  of, never tempo), cast emotion `happy`; exactly two `auto` lines, both
  cited — the break `a2_59` "Present." and the turn `a3_27` "Count me.".
  **No caps in any line text** — his loud is the mix and the bubble.
  Measured 128.3 Hz: +3.5 st clear of Rock (104.9) and +3.3 st of the
  volcano (105.8), who follows him directly in Scene 16; within 1.4 st of
  Sunny — keep them spatially distinct when adjacent. The by-ear winner
  `English_FriendlyPerson` (deepest, most "giant") landed ON Rock across
  his 36 real lines; its takes are kept on disk — a free restore if Mike
  prefers the giant and accepts the collision. Shortlist with paths:
  `scratchpad/ep6_boom_audition/MEASUREMENTS.md` §8. Constant
  `BOOM_MINIMAX_VOICE`; a recast re-buys 36 clips (cents) and re-times
  every Boom scene.
- **Personality + want:** hero of ep 6. The thunder — the sound of the
  lightning, he/him, born in the lobby of the Cloud Hotel in the same
  instant as Flash, out of the same crackle. Enormous, soft-edged, the
  loudest thing in the sky and the gentlest character in the episode: a
  very large friendly man who set off promptly and would like you to know
  it. Wants to be ON TIME; has theories about why everyone else is early.
  Never sorry (Puff's), never a verdict-giver (Ember's), never a pedant
  (Ray's). Register: warm run-on sentences, commas not full stops.
- **Body (PROVISIONAL for Mike's eye, `src/videos/storm/scenes/Boom.tsx`):**
  **size IS distance** — `distance` 0..1: plum-sized, crisp, ink-outlined
  at zero; huge with three feathered halos at nine counts
  (`distanceForCount(n)`); two offset rings sit behind his travel; a
  fixed-cadence walk (1.5 steps/s) that is on or off and NEVER faster;
  `burstAt` ring burst on "Present!"; **no arms**. He cannot be
  sharp-and-far or soft-and-near. Far firings are the identical clip at
  `volume` 0.85 (three counts) / 0.6 (six) / 0.45 (nine).
- **Catch-phrase / chain — "Present!" (the episode's spine; SPENT as a
  spine, reusable as his word):** 1 recording (`a1_48_boom`, his birth at
  zero distance) + 8 `sameAs` aliases (`a2_12`, `a2_25`, `a2_52`, `a2_57`,
  `a3_11`, `a3_21`, `a3_38`, `a3_64`) = **9 firings of "Present!"**, plus
  THE BREAK **"Present."** (`a2_59`, fresh recording, full stop, `auto`) at
  count zero with Flash still in the frame — ten spoken arrivals in all
  (the script's "ten firings" counts the break); the eleventh arrival is
  nothing: ten fingers, 120f of silence, then the lobby cut and the final
  alias. Pattern, not chain: his theories ("a very early planet" `a2_20`,
  "the ground is moving" `a2_53`, "I have not changed one thing" `a3_12`),
  resolved at the turn — "Far is a number." He addresses Flash six times;
  she replies zero.
- **Arc (ep 6):** born loud at zero distance → counted at six, three, two,
  one by a kid at a window → the break at zero ("Present." / Narrator "I
  did not get to one.") → the turn at six, going away: he is not late, he
  is FAR, and far is a ruler ("Count me.") → nine, the rumble → ten and
  nothing → present in the lobby, instantly ("Both true." / "That is the
  whole thing."). **End state:** on the far horizon with the storm, a
  voice from the distance ("I know. I am busy." / "By the time you hear
  me, I have already happened."), still following Flash ("I always leave
  when she leaves."; "I tell her everything anyway."). Not spent as a
  character — a cameo from him is a count and a far "Present!" (one alias,
  volume only).

### Flash
- **Casting, locked: NONE, EVER.** The lightning, she/her — **a silent
  constant** (world rule 4). Blue-white zig, the same body every time
  (Violet's same-blob law), on screen **≤6 frames per appearance**, gone
  before anyone finishes a sentence. Introduced by name once (`a1_46`,
  under the LIGHTNING card): "She does not stay. She does not wait. She
  has never finished a sentence in her life, because she has never had
  time to start one."
- **Laws:** strikes the sea far out or goes ACROSS the sky; the overhead
  bolt goes SIDEWAYS; **nothing on screen is ever struck**. Boom addresses
  her six times (`a1_52`, `a2_14`, `a2_61`/`a2_62`, `a3_13`, `a3_24`,
  `a3_42`); she replies **zero** — the zero is the physics. Her light
  arrives WITH Blue (Scene 12): the mechanism of his payoff. Her own
  six-frame slam is the THUNDER chant's reprise; she exits every chase
  frame-left with Boom looking after her.
- **Weak point on record:** googly eyes at the first kink read as
  "somebody" at full size; whether a six-year-old registers a character in
  six frames is untested (skeleton report).

### Cameos + minor bodies

| Body | Episode(s) | Voice | Notes |
|---|---|---|---|
| The kid | 1–6 | silent, always | Silhouette; frames every cold open. Six canon episodes running (eight counting the CYOAs); keeps the streak. Ep 4: opens (breath launches Pip) and closes (a plant hands the breath back). Ep 5: builds a sandcastle all episode (the silent builder parallel — sand is ground-up mountain) and watches the changed horizon on the end card. **Ep 6: the kid DOES the thing** — at the window from the first dark sky to the end card, counting on fingers with the Narrator (the first time in six shows the kid performs what the audience can copy); ten fingers is the kid's ruler and running out of them is act three's joke; one finger on "Count that one."; ten fingers and a wave at a flash they cannot hear, on the last picture. Hand rig (`scenes/Kid.tsx`): finger width 18·s under a ~23.5·s pitch so counts separate at phone size; fingers rise from the clip's first frame, fully up at the measured +13f onset. |
| Beetle | 2 | minimax `Patient_Man`, `calm`, 0.92 | Genuinely cannot perceive Puff (not unkind). Two lines fired three times. |
| Leaf | 2 | minimax `Calm_Woman`, `calm`, 0.92 | Same two lines, one scene later; the different voice IS the joke. Beetle+Leaf were recast off the Narrator after the six-year-old caught the shared voice — origin of the distinct-voice rule. |
| Flower, Moose | 1 | Narrator cameo-voiced | Pre-dates the distinct-voice rule; if either returns with a line, it gets its own voice. |
| Kevin | 1 | none | A speck of dust, named by Drip. "Kevin is a lovely name for a speck of dust, darling." |
| The blue copies | 3 | none (bubbles off one Blue clip) | **Bluington, Bluesworth, Bluey**, fourth greeting "Hi... me!" — see Blue. |
| Identical raindrops | 1 | none | Roll-call names: Drop, Droplet, Dripley, other Drop, Droppy, Drop the third. |
| Identical puffs | 2 | none | Roll-call names: Puffy, Puffington, other Puff, Puff the third ("It is a very popular name."). |
| The Pip siblings | 4, 5 | none | Roll-call names: Pipsqueak, Pipley, other Pip, Pippa, Pip the third — same order both firings. Sprout row on Scene-15 marks is staging canon (plants cannot move). Ep 5: **Pipsqueak** is dispatched by Pip and is the first seed on the new island (silent pappus seed). |
| The island chain | 5 | none | Roll-call names: **Island, Islet, other Island, Island the third, Sandy** (the sandbar — erosion inside the naming). Same order both firings. The chain is the volcano's CV: newest black at the front (Ember), oldest green at the back; **lots of islands AND one island ageing — both true, said out loud** (`a3_49b`). |
| The magma crowd | 5 | none | Crowd-with-faces, downstairs; bubbles only. |
| The hail guests | 6 | none | Crowd-with-faces (`HailBall` — round ice, never Blobbies: Blobby is a drop). Roll-call names, both firings, same order: **Hail, Hailey, other Hail, Hail the third, Stony.** The penthouse is a freezer; the rubbing that builds the crackle is said as a roll call two scenes before the STATIC card; by morning every one of them is called Puddle. |
| Stony | 6 | none | The big hailstone — the same body both firings (biggest `HailBall`, greyer ice, frost crown); the most trips up and down the tower (how hail grows: a coat of ice per trip); bounces once and sits on the step at the check-out; the last to melt, crownless, at Scene 22's end. Zero lines, zero cost — the Violet pattern on a weather crowd. |
| The volcano | 2–4 (scenery), 5–6 (speaks) | `Elegant_Man` −6 | **Graduated to a character in ep 5** — see his block in §2. Horizon obligations in the ledger. |
| Blobby / BlobbyCrowd, AirBlob | kit | none | Unrigged background bodies (`src/lib/kid/characters/`). Rule of thumb: if it has a line it's a Drip; if it's scenery it's a Blobby. |

---

## 3. Series ledger

### The volcano (ladder COMPLETE — he is awake; the rule has changed)

- **Current state (ep 5 end, PROVISIONAL until Mike's ep-5 pass):**
  AWAKE, polite, working. Summit glowing gently, thin smoke, **Ember's
  new island beside him** on the horizon. He said good night, not
  goodbye.
- **THE VOLCANO RULE, from ep 6 on:** he and the new island hold the
  measured horizon of every coastal wide, **continuously visible, never
  blinking out once established, summit lit, island present** — the
  continuity obligation is now stronger, not weaker (a kid will check
  the island is still there). Looking at him, pointing at him and naming
  him are legal. He may SPEAK, at the reservation casting, but scarcity
  is his character: default ZERO lines in an episode that is not about
  him; one or two tent-pole lines if a scene earns them; never banter;
  48f approach gap, `auto`, 0.9, pitch −6, bubble from the mouth.
- **Ladder (history):** ep 2 asleep and unmentioned → **ep 3: one-eye beat
  + the Yellow rest-attempt/warn-off** → **ep 4 small stir (FIRED,
  spent)** → **ep 5 WAKES (fired: knock → "The rules are over." camera
  turn → V1 "Good morning. I appear to have overslept.")**.
- **Ep-4 state (shipped cut):** the stir was the episode's ENTIRE
  volcano budget — Scene 13, wordless: as the rain sheet crosses the
  summit, one thin curl of steam rises off the peak, holds ~60f, thins,
  and is gone (physics-honest thermal tell, fully deniable). Nobody
  looks, points, names, or stings it. Established on the horizon from
  the first wide; continuously visible in every wide to the end card
  (one ratified no-horizon exemption, s12a). End state ep 5 picks up
  from: "The volcano holds the horizon, asleep, promising nothing." —
  stir spent, unacknowledged; no character in-world knows anything.
  Ep-4's end card arms ep 5: **"WHAT IS DIRT ACTUALLY MADE OF?"**
  ("Next time. What is dirt actually made of?" / Pip: "Send it here.
  I will grade it.").
- **Ep-3 state (final cut):** the volcano's whole presence is two beats in
  the sunset race's sea leg (script scene 28b): Yellow lands for a sit-down
  and the Narrator warns *her* off ("That is not a rest stop." — addressed
  to Yellow, never naming the volcano), then **THE VOLCANO OPENS ONE EYE**
  for 45f and closes it — no dialogue, nothing enters, nobody reacts.
- **The ep-3 end-of-episode wake tease was CUT (T10, Mike's call):**
  `rc_17`/`rc_18`/`rc_18b` are gone with every wake tell. **The volcano is
  fully asleep at ep 3's close and promises nothing.** (Known stale text:
  sky-blue `script.md` :2071 and :3345 still say it "stirs in Scene 35" —
  pre-T10 leftovers. This file wins; don't "fix" the bible from them.)
- **Ep-5 firings of the banked volcano-thread material (all SPENT):**
  Sunny's wake-claim "OH, that one is me as well! HA! HA!" (`co_10`, the
  RECORDED ep-1/ep-2 wording, comma not "OH!"); the ceremony *"I did
  that."* / *"No. He really didn't."* (`a2_33`/`a2_34`); the *"That is not
  me."* inversion (`a3_79`, PROVISIONAL — a one-line cut restores the
  bank). The bank for this thread is EMPTY; the volcano owns no more
  banked Sunny material.
- **The OLD volcano rule** (scenery; never named; nobody looks) governed
  eps 2–5 Scene 2 and is retired. Pre-wake episodes are not retrofitted.

### Catch-phrase ceilings and counts

| Phrase | Owner | State |
|---|---|---|
| "You're welcome! HA! HA!" | Sunny | Ep 1: 3 (+ Drip's `a3_43` return); ep 2: 6; ep 3: **8 — ceiling 8** (raised 7→8 by Mike for `a3_31b`, 2026-08-04); ep 4: 5; ep 5: 4 (`co_07` source + 3 aliases); ep 6: 4 (`co_07` source + `a1_22`, `a3_06`, `rc_10`). No firing past 8; ceilings are per episode and hard. |
| "GOOD MORNING, EVERYBODY!" → "I invented mornings!" | Sunny | Greeting+brag pairing, **six-for-six** (ep 1 `a1_09`/`a1_11`, ep 2 `a2_02`/`a2_05`, ep 3 `a1_03`+`a3_31` alias/`a3_31b`, ep 4 `a1_02`/`a1_03`, ep 5 `co_04`/`co_05`, ep 6 `co_03`/`co_04`). Series constant, not an option. |
| "OH, that one is me as well! HA! HA!" | Sunny | Ep-2 card: fired. Eps 3–4: zero (saved twice). **Ep 5: CASHED** at the knock (`co_10`). Bank empty — any future firing is a fresh choice, not a payoff. |
| "I did that." / "No. He really didn't." | Sunny / Narrator | **SPENT, ep 5** (`a2_33`/`a2_34`) — the ceremony. Never again as those words. |
| "That is not me." / "The warm on top is me." | Sunny | **SPENT, ep 5** (`a3_79`/`a3_80`, PROVISIONAL — one-line cut restores the bank). The precision device it founded is reusable: Sunny names exactly which part is his. |
| "You can't see me. But you can FEEL me." | Puff | 7 series-wide (unverified — recount owed); one per appearance. Ep 6: 1 (`a2_03`, AS the gust front at the kid's window — not his entrance; the lift was). Ep-4, ep-5 and ep-6 firings cache-migrated from wind `a1_40_puff` — the canon "FEEL" capital never gets a fresh draw. Quoted from memory by the 8-year-old (hub, 2026-10-17) — it has stuck. |
| "I am NOT small! I am travel-sized!" | Drip | Ep-1 gag (2 + speck visuals); revive only as fan service. Eps 2–5: 0. **Ep 6: 1 VARIANT** — "I am travel-sized again." (`a3_07`, as she melts back to a drop; CUTTABLE, PROVISIONAL). |
| "Look up. That's me." | Ray | 3 in ep 3 (incl. sunset form); ep 4: 1 at the moon + approved variant "Look down. That is also me." Ep 5: 0 (absent). His pointing line. |
| "darling" | Cloudia | Hers; lending it out is the joke (Puff, once). Ep 4: ×5, every composed line. Ep 5: absent. Ep 6: 28 composed lines carry it, dropped on exactly ONE (the break `a1_45`) — the barometer worked. |
| "Different show. Same ___." | Narrator | 9 firings (sun, sky, rain, air, beam, weather, rock, first, **hotel** — ep 6 `co_09`), always 0.92 flat. One per returning-character entrance; skip is legal when the character cannot be pointed at (Puff) or when the entrance line carries itself (Drip, eps 5–6). "Same first." names a returning LAW, not a character — approved blank construction. |
| "It will do." | Pip | Ep 4: 5 firings, 1 recording, self-capped at 5 + the break "It will not do." (separate recording, plot-causal). Ep 5: 1 cache-migrated re-fire (`a3_74`), not a 6th chain firing. Companion Narrator chain "It is the highest grade she gives." ×2 series-wide (OFF in ep 5). |
| "That is also true." | Ray | Ep 4: 3 firings, 1 recording, capped 3. **PROVISIONAL** — new canon pending Mike's ear. |
| "Hi! It's me! I'm the weather!" | Drip | Standing entrance, **fourth identical firing** in ep 5 (cache-migrated take — audibly identical is the joke). |
| "Done!" / "Started." | Ember / Rock | Ep 5: 4 paired firings (1 recording each) + the break "Done?" / "Started." (two fresh recordings, role-reversed). **SPENT** — the double chain was ep 5's spine; do not re-fire. |
| "Ten thousand years." | Rock | Ep 5: 3 firings, 1 recording (same number in both directions). The NUMBER is series canon for rock time; the clip is spent. |
| "___ is broken." | Ember | Ep 5: 3 fresh recordings (pattern, not chain); resolved at her turn. Her inspector register; available if she speaks again. |
| "Presently." | The volcano | Ep 5: 1. "'Presently', from a volcano, means ten thousand years." Reusable as his only answer to any when-question. |
| "What Red said." | Orange | 3 firings, one recording (ep 3). May be his whole vocabulary forever. |
| "This is a nice spot." | Green | 3 firings, one recording (ep 3). |
| "I just said that!" | Blue | 4 firings, one recording — **capped at 4** (ep 3). |
| "Great ___, ___!" | Yellow | 7 firings in ep 3, buttoned with "Great bounce, me!". |
| "Are we there yet?" | Ray | Ep-3 gag: 5 identical firings (one recording) + 1 truncated; escalating silences 45/75/105/135/165f. Spent. Named by the 8-year-old as ep 3's funny part (hub, 2026-10-17). |
| "Present!" / the break "Present." | Boom | **Ep 6: 9 firings, 1 recording** (`a1_48` source + 8 aliases) + the break "Present." (`a2_59`, fresh, full stop, `auto`) — the spine; ten spoken arrivals, the eleventh is silence. Reusable as his word at any far arrival (one alias, `volume` only). |
| "Going up." / "Going down." | Puff | Ep 6: 3 firings, 1 recording (`a1_06` source + `a1_12`, `a1_37`) + the break "Going down." (`a2_02`, fresh, plot-causal — the downdraft that becomes the gust front). The lift IS his entrance. |
| "First! Sorry, ___! I am first!" / the flipped button | Blue / Narrator | **SPENT, ep 6** (`a2_21` / `a2_26` "He was first. He was also very fast. Today, those are the same thing."; PROVISIONAL). The format "He was not first. He was very ___, though. Those are different things." is CLOSED — do not re-arm. |
| "Both true." | Narrator | Ep 6: 2 (`a2_31` source, `a3_67` kokoro alias) — the episode's verdict word; reusable. |
| "There he is." | Narrator | Ep 6: 2 (`co_24`, `a1_59` — the same nine seconds twice, cold open and act 1). Spent with that mirror. |
| Boom's theories ("I have a theory…") | Boom | Ep 6: 3 fresh run-ons (`a2_20`, `a2_53`, `a3_12`) — pattern, not chain; resolved at the turn ("Far is a number."). Available if he theorises again. |

### The long fuse — CLOSED (ep 5)

`a2_45`/`a2_45b` (wind, Narrator): *"One day Sunny will be wrong about
something."* — 36f of real silence — *"It is not today."* Planted ep 2,
saved through eps 3–4, **paid in ep 5 Scene 16**: the sentence re-spoken
byte-identically (`a2_39`), the 36f mirror gap, *"It is today."* (`a2_40`),
then **180f of silence — the series record** (trim floor 168f; must stay
>165f). The shape ("A long time ago, I told you something.") is the
series' template for closing a long-armed plant. The second long fuse
still burning is **Blue's** (see Blue).

### Roll call — series signature

One fresh variant per episode, fired **twice** (a greeting and a
goodbye). Shape, fixed: a character cheerfully naming near-identical
strangers → one flat explanatory line from the Narrator → an unbothered,
unseasoned button. Nobody replies inside the naming. Variants so far —
ep 1: Drip and the raindrop queue ("Hi Drop, Hi Droppy" — the
six-year-old's most-quoted joke); ep 2: the identical puffs ("Are they
all called Puff?" / "Probably."); ep 3: Ray's seven-name greeting
(movement replies only) and the race goodbye — plus the T4
true-roll-call: Blue greeting his own copies, **Bluington / Bluesworth /
Bluey / "Hi... me!"** (`a2_32b`, one clip, four bubbles); ep 4: the Pip
siblings (greeting mid-air "Hi Pipsqueak! Hi Pipley! Hi other Pip! Hi
Pippa! Hi Pip the third!" / "Every seed in that packet is called Pip." /
"Good crew."; goodbye at the recap with "Nobody was going anywhere." /
"See you tomorrow." — two recordings by design, different sentences);
ep 5: the island chain (Ember, at 1.0: "Hi, Island! Hi, Islet! Hi, other
Island! Hi, Island the third!" / beat / "...Hi, Sandy." / "Every island
down that coast is one of his. He has done this before. Many times. They
are all called Island." / "I am the new one."; goodbye "Bye, Island. Bye,
Islet. Bye, other Island. Bye, Island the third. Bye, Sandy." / "None of
them moved. Islands never do. It was still polite." / "See you in ten
thousand years."); ep 6: the penthouse hail (Drip, `happy`: "Hi, Hail!
Hi, Hailey! Hi, other Hail! Hi, Hail the third!" / 24f / "Hi, Stony." /
"Every guest on the top floor is called Hail. They keep rubbing past each
other. It builds up." / "I am one of them now."; goodbye on the lawn
"Bye, Hail. Bye, Hailey. Bye, other Hail. Bye, Hail the third. Bye,
Stony." / "They are all melting. By morning, every one of them will be
called Puddle." / "I was big for an hour. It was lovely." — the joke IS
the lesson: the rubbing that builds the crackle, said two scenes before
the STATIC card). Used crowds so far: raindrops, puffs, colours/copies,
seeds, islands, hail — ep 7 needs a fresh crowd.

### Other running state

- **Credit allocation**: five firings series-wide — four in ep 3 (four
  speakers, one joke, the last delivered by the character being cheated:
  "It is mostly me.") + Ray's `a3_36` "It is mostly him." in ep 4
  (un-ceilinged; count flagged at the ep-4 fold). Available as a series
  device.
- **Orange translates Red's silences**: six paired firings in ep 3;
  travels with the pair.
- **Sunny is always right — ENDED in ep 5.** Four episodes intact, the
  verdict fired at the eruption's peak. New state: PRECISION (his block).
  The Narrator still checks every claim; from ep 6 on each one he makes
  must be individually true, and the comedy is how exactly he allocates.
- **Sunny interrupts a scene not about him**: ep 2 ×5, ep 4 ×3, ep 5 ×1,
  ep 6 ×5 (`a1_18`, `a1_35`, `a2_48`, `a3_04`, `a3_45`) — every firing
  true. Ep-4 first: he does NOT interrupt Sc 23.
- **Blue anti-Sunny arc — FIRED, ep 6 (PROVISIONAL)**: seeded ep 3,
  watered eps 4–5, paid in ep-6 Scene 12 with Flash — see Blue's block.
  The second long fuse is closed; **no long fuse is burning after ep 6.**
- **The island chain is a timeline** (ep 5, canon): the volcano has built
  many islands, one at a time; newest is black rock at the front (Ember),
  oldest is green at the back, so the row reads as one island ageing.
  Stated out loud by the Narrator in Scene 21 (`a3_49b`, 2026-10-17
  tweak) after the 8-year-old asked which it was. Both answers are true
  and the line says so.
- **Rock time = "ten thousand years"** is the series' number for anything
  geological; "Presently." is the volcano's word for it. Erosion of a
  whole mountain = "ten thousand years, ten thousand times" (a hundred
  million years — the arithmetic is exact).
- **Ep-5 soil canon, closed:** dirt = crushed mountain + old leaves
  (stamped on the ep-4 card); the first seed on the new island is
  Pipsqueak.
- **Storm canon (ep 6):** light is fast, sound is slow (rule stamp LIGHT
  IS FAST. SOUND IS SLOW.); **three counts for every kilometre** (one
  parent-aside "about five seconds a mile", once); a thunderhead is the
  Cloud Hotel gone vertical — a lift (the updraft) with no stairs, a
  penthouse freezer where hail grows a coat per trip, static from guests
  rubbing past each other, lightning leaving through the wall and thunder
  born in the same instant; nothing on screen is ever struck; the kid
  watches from a window from the first dark sky (one plain safety
  sentence, never fear). Boom's ten arrivals and the kid's ten fingers
  are the series' first count the audience can copy.
- **Moon canon (ep 6 end card, PROVISIONAL — recap builder call 1, which
  corrected the showrunner's brief):** the Moon's lit half ALWAYS faces
  the Sun, so an evening half moon is a first-quarter moon lit on the
  SUNSET side (terminator tilted to the true angle toward Sunny's set
  point); it stands ~90° from the setting Sun — frame-left above the
  island when Sunny sets frame-right. The light on the moon is Sunny's
  (true, `rc_17`); the shape is where you are standing. Ep 7 builds on
  this; a kid can check it the same week.
- **Ep-6 fun fact + myth (rules 17/18):** a lightning bolt is about five
  times hotter than the SURFACE of the Sun (~30,000 °C against ~5,500;
  the core ~15 million — Sunny keeps the inside, the Narrator checks);
  Lake Maracaibo, Venezuela — a thunderstorm more than a hundred nights a
  year, "the lightning capital of the world" (Catatumbo); viewer facts:
  "You have never heard a thunder that was not already over." / the
  crackle on your balloon is him, tiny ("You will not need any
  fingers."). MYTH: "thunder is clouds bumping" — busted by Cloudia,
  "Darling. We do not bump. We mingle." The optional second ("never
  strikes twice") was NOT fired and is available.

### Casting constraints (measured, ep-5 audition — binding for new voices)

- **The bright-girl band is FULL.** Drip (`Lively_Girl`), Puff
  (`Exuberant_Girl`) and Pip (`Inspirational_girl`) all sit at 320–380 Hz
  median f0. Ember was cast from BELOW the wall (`Playful_Girl`, ~270 Hz).
  **Ep 6 and later cannot cast another bright girl**: a new child/girl
  voice must measure clear of that band (below ~300 Hz or otherwise
  ≥3 st from all three), or one of the three retires. Audition by
  measurement first (median f0, IQR, chars/s, centroid against committed
  neighbour clips), then by ear.
- **The low male band is full too** (ep-6 audition, 2026-10-26): Rock
  (`Deep_Voice_Man`) ~105 Hz, the volcano (`Elegant_Man` −6) ~106 Hz,
  Sunny (`am_puck`) ~119 Hz, Boom (`English_magnetic_voiced_man`,
  PROVISIONAL) ~128 Hz. A new deep male voice must measure clear of all
  four. **Measure pitch gates on ORDINARY lines, not audition run-ons** —
  excited run-ons pushed every candidate's f0 up and the audition winner
  (`English_FriendlyPerson`) landed exactly on Rock across his real lines.
- **MiniMax `pitch` is a re-render, not a transform**: +3 measured +4.33 st
  on one voice and +1.88 st on another and changes delivery rate
  unpredictably. The Indigo = `Decent_Boy`+3 precedent is a result, not a
  rule of thumb — measure any construction.
- **Working system voice ids on speech-2.8-hd (confirmed 2026-08-25):**
  `Lovely_Girl`, `Wise_Woman`, `Sweet_Girl_2`, `Exuberant_Girl`,
  `Lively_Girl`, `Cute_Elf`, `Sweet_Girl`, `Lovely_Lady`, `Playful_Girl`,
  `Cute_Girl`, plus the live `English_*` pool (`English_PlayfulGirl`,
  `English_WhimsicalGirl`, `English_radiant_girl`, `English_LovelyGirl`,
  `English_AnimeCharacter`, `English_Kind-heartedGirl` confirmed; more
  exist — probe before relying). Dead ids: `Sassy_Girl`, `Little_Girl`,
  `Naughty_Girl`, `Determined_Girl`, `Chirpy_Girl`, `Bright_Girl`.
  Male ids in use: `Deep_Voice_Man` (Rock, reserved), `Elegant_Man` −6
  (volcano, reserved), `Patient_Man` (Red; Beetle at 0.92), `Determined_Man`
  +2 (Orange), `Friendly_Person` (Green), `Decent_Boy` (Blue; +3 Indigo),
  `Young_Knight` (Ray). `Imposing_Manner` was auditioned for Sunny and
  rejected — free for someone else.
- **Open ear items** (shipped in-cut, pending Mike's ear; fallbacks in
  `src/videos/sky-blue/tweak1-worklist.md`): `a2_32b_blue` (the Bluington
  roll call), `rc_14_ray` ("air" lowercase re-take), `a3_22b_red` ("Very
  dramatic."). Open — nothing more.

---

## 4. World rules

The standing laws that bind every episode. Mechanics live in
`docs/STYLE.md` (kids' sections) and `docs/roles/audience.md`; this list is
what a script may not break.

1. **Physics honesty.** Nothing is ever taken away (scattering is
   bouncing, not theft); blue is never "smaller" (jumpy/bouncy vs big/calm
   only); no colour bounces "never"; the violet answer is honest (violet
   scatters more — our eyes are the reason the sky is not violet); the
   Moon is the control experiment. A wrong causal model on screen is a
   pedagogy bug, not a taste note.
2. **Characters carry the mechanism.** The pedagogy rides inside the
   comedy, never alongside it (Cloudia's stress IS condensation; Blue's
   ricochet IS scattering). A hero who only reacts is not a comedian —
   heroes have attitudes (Ray is a pedant).
3. **Distinct-voice rule.** Anything with a face and a line gets its own
   voice. Corollary: a silent character who speaks becomes another voice,
   another audition, another cast row — which is why Violet never speaks.
4. **The silent constants:** the kid, Violet, and from ep 6 **Flash** (the
   lightning: ≤6 frames per appearance, same body, zero replies to Boom's
   six addresses). The volcano was one until ep 5 and now speaks, rarely.
   Never voiced.
5. **`sameAs` discipline.** Every repetition gag on MiniMax is ONE
   recording, aliased byte-identically — the generator resolves backwards,
   so the earliest firing must be the source. A re-record kills the joke.
   Cross-video `sameAs` does not exist: the identical-take device across
   episodes is a **cache migration** (copy the approved mp3 + seed the
   cache — copies, never moves; ear-check migrated clips once in the new
   mix; used twice in ep 4). Kokoro chains still write aliases to state
   intent and lock wording, even though the engine is deterministic.
6. **Catch-phrase ceilings are hard** (table above). Nothing adds a firing
   past a ceiling without Mike's explicit call.
7. **The volcano rule** (ledger, above) binds every coastal scene in every
   episode — since ep 5: awake, continuously visible, summit lit, Ember's
   island beside him; speech rare and at the reservation casting only.
8. **One roll-call variant per episode, fired twice** (series signature;
   shape is fixed).
9. **Measured comedy standard** (`docs/roles/audience.md`): a kid-graded
   laugh every ≤25–30s; track the MAX gap (≤50s), on spoken lines, against
   the shipped cut; any stretch carried by drawn geometry needs a
   character beat inside it; an ensemble counts replies, not lines — every
   ensemble member has a WANT expressible inside its one cast emotion
   (the colours: hard cap of one want each, forever).
10. **Comedy pacing:** repetition/deadpan gags get room — slower per-line
    `speed`, punchlines held in silence; deadpan is stillness, buttons
    stay unseasoned. Approach gaps are identity (Red 16f, Indigo 12f,
    Orange 8f, Blue 4f).
11. **Tone guardrails:** no sarcasm a six-year-old cannot parse; no scary
    peril (a sunset is never the light dying); no potty humour; nobody is
    unkind — corrections are gifts, wrongness is never a comeuppance.
12. **Voice-engine rules:** narrators and Sunny on kokoro (no emotion, no
    pause markers, stretched vowels allowed); characters on MiniMax
    (emotion is seasoning — cite the stage direction; pause markers only
    for scripted intra-line timing). **No all-caps emphasis words on
    MiniMax lines, ever** ("AIR" reads "the A") — caps live in bubble
    text only. Sound-word spellings are per-engine; recasting a character
    is a text edit as well as a voice edit.
13. **`skeptical`** is shared rig vocabulary (born ep 3): the one-brow
    deadpan — register *unimpressed*, never grumpy or smug, for reaction
    beats under another character's claim.
14. **Runtime rule** (Mike, 2026-08-04): 10–30 minutes is all fine — hit
    the right beats, never target a duration.
15. **One voice chants a Big Word.** The syllable chant is the Narrator's
    (kokoro, one clip); the ensemble owns the visual slams — one block per
    hero, in owner order — never the syllables. Five timbres a second
    apart cannot assemble a word (ep-4 chant, the 8-year-old's "something
    broke", 2026-10-17).
16. **Say the lesson once, plainly.** When the diagram is the lesson, the
    Narrator states it in one sentence of plain words; an implied
    conclusion ("It is the whole story, standing in a row.") is a riddle
    to an attentive 8-year-old, not a lesson (ep-5 Scene 21, 2026-10-17).
17. **The fun fact is mandatory** (Math via Mike, 2026-10-18). Every canon
    episode's recap keeps the mind-blower slot, and that slot must hold at
    least one true, checkable, real-world fact at the Sahara→Amazon standard
    (ep 2 Sc 35): about the world outside the room, big in scale, something
    the kid can go and look up. The Narrator states it plainly; awe is held
    in silence before any button. A fact about the viewer ("your bath",
    "your next breath") is a fine second beat but does not discharge the
    rule on its own. House opener: "Now here is the amazing part." (eps 2,
    3). CYOA shorts are exempt. Ledger: ep 1 dinosaur puddle; ep 2
    Sahara→Amazon; ep 3 black midday sky on the Moon; ep 4 oxygen in your
    next breath + tree mass from air; ep 5 ground-up mountains + the K
    island; ep 6 lightning ≈5× hotter than the Sun's surface + Lake
    Maracaibo. All six comply — no retrofit.
18. **Aim for one myth-bust per episode** (Math via Mike, 2026-10-18). The
    MYTH stamp (born ep 1 Sc 14 "clouds are not pillows"; fired twice in
    ep 3 Sc 15–16 "it is not the sea" / "show us the paint") is a house
    device the 8-year-old asked for more of. Eps 2, 4 and 5 have none; ep 6 busts "thunder is clouds
    bumping" (Cloudia, "We do not bump. We mingle.") — the first bust
    since the rule.
    Every episode brief names the real kid misconception its subject
    invites and busts it on the stamp — a genuine misconception, never a
    straw man, and the correction stays a gift (rule 11). Forward-only:
    shipped episodes are not retrofitted.

---

## 5. Forward arc

The series arc canon through ep 5 — **ep 4 = plants / photosynthesis
(Sunny's peak), ep 5 = volcano wakes (Claire's commissioned episode)** —
and its guardrails live in `docs/roles/audience.md`, "Series arc canon";
both are now HISTORY (fired). Read it with this file.

**Ep 6 = THE STORM — "WHY IS THUNDER ALWAYS LATE?" — SHIPPED 2026-10-26
(history).** "Boom and the One, Two, Three" (`BoomStorm`, 15:35). Design
of record: `src/videos/storm/script.md` + `ep6-decision-log.md` (every
TOP item PROVISIONAL until Mike's pass). Guardrails honoured: Cloudia got
the storm; Sunny played precision; the volcano stayed awake on the horizon
with the island and spoke once; Blue's payoff FIRED (PROVISIONAL).
**Hero arcs now SPENT, do not reuse:** the circle (Drip), I-am-real-stuff
(Puff), wrong-about-self (Ray), ambition-from-one-spot (Pip),
impatience-vs-slow (Ember), **on-time-vs-far / "far is a ruler" (Boom)**;
nor a talking hero with a silent partner (Boom/Flash spent it).

**Ep 7 tease = "WHY DOES THE MOON CHANGE SHAPE?" — PROVISIONAL (showrunner
call, decision-log TOP; Mike has NOT ruled).** The ep-6 end card already
shows it, so the kids may have seen it — a tease is an audience promise;
Mike overturns EARLY (reversal: one card + two kokoro lines,
`NextTimeCard`/`NEXT_TIME` + `rc_16`, free until ep-7 work starts). Why
the moon: the end-card picture exists (half moon over the island), the
Earth's-shadow misconception is rule-18 gold, thirty nightly home checks,
canon plants (ep 3's Moon as control experiment, ep 4's "Look up. That's
me." at the moon, ep 6's moon canon in the ledger), and it sits two
episodes clear of the ceremony — Mike rejected the moon at ep 5 for
proximity to it; this call assumes two episodes is the distance he asked
for. Logged alternate: "WHY IS THE SEA SALTY?" (Drip + Rock, a tastable
check; its one-line arm is NOT fired). Ep 7 has no arc canon beyond the
tease.

**Kid pitch, unratified (Math, 8, via the hub, 2026-10-19), on
DripAgain's race:** "the lava drip races should be a new character that
looks like [Ember], but is a bit smaller … the name is a little [Ember] and
then little [Ember] will turn into little obsidian." The dictation said
"Amber"; Ember is ep 5's hero (canon folded above, 2026-10-26).
Pitch, not canon: a Little Ember who becomes Little Obsidian when the lava
hits the pond. Mike has not ruled; do not build it unasked.
