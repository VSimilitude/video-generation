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
| — | `drip-fork` | (CYOA demo) | ~90s | **Non-canon.** One-branch Drip mini-adventure built from ep-1 assets to prove the branching-player mechanic (`docs/CYOA.md`, phase 1). |

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
  breaks her own pattern exactly once ("No, Ray, not yet.").

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
  ("Rain and light! That is you and me!").

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
  scattering ("There are ZILLIONS of us. We are the whole sky.").

### Sunny
- **Casting, locked:** kokoro `am_puck`, speed 1.0 — series voice since
  ep 1. MiniMax was auditioned twice (ep 2 `Imposing_Manner`, again for
  ep 3) and rejected both times; Mike's ruling: mechanical is funnier, and
  a returning character does not get a new engine. Kokoro means **no
  `emotion` field ever, no pause markers ever, no stretched vowels** — his
  stops are carried by words, slower `speed`, and his face.
- **Personality + want:** the Sun. Colossal ego, the series' laugh engine;
  claims credit for everything and is always annoyingly at-least-half
  right. **No verdict on his claims until ep 5** (see ledger).
- **Catch-phrases:** see the ledger table for counts and ceilings. His
  four: "You're welcome! HA! HA!" (ceiling 8 in ep 3); the greeting+brag
  pair (three-for-three, a series constant); "OH! That one is me as
  well!" (banked, ledger); *Sunny interrupts a scene that is not about
  him* (ep 2, five firings, every one of them true).
- **Arc:** ep 1: powers the whole cycle, completely right ("annoyingly, he
  is completely right"). Ep 2: makes all the wind, right again; the long
  fuse is planted. Ep 3: his sky-paint theory fails **in half** — the light
  is his, the painting is the air's; he concedes nothing louder than
  "I DO have a point! I have LOADS of points!". He enters ep 4 at maximum
  ego (plants = his one fully-legitimate claim; see forward arc pointer).

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
  me"). The rig's `skeptical` face debuted on him (s10).

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
- **Approved-for-development arc — the anti-Sunny:** confidently wrong
  about being "first" (or a similar superlative) episode after episode
  until one day he is finally right. Mirrors Sunny's inverted claim
  machinery (Sunny claims credit and is at-least-half right until ep 5;
  Blue claims priority and is wrong until the one day he isn't).
  **Multi-episode plant — DO NOT fire the payoff early.** Seed slots:
  ep-4 cameo (light still travels), ep 5. Ep-3 "first" firings on record:
  `a1_40b`/`a1_40d`, `a2_20b`, `a3_05b`, `a3_08b`/`a3_08d`, `a3_11d`,
  `a3_13bb` ("I am winning UPWARDS!").
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
  panel edge.

### Rock
- **Casting, locked:** minimax `Deep_Voice_Man`, `happy`, speed 0.85.
  (His line keys end `_narrator` — legacy keying, deliberate.)
- **Identity:** one line, very slow, completely sincere — "Ohh yeah. That
  is the stuff." (ep 2: two firings, one recording via `sameAs`, eight
  minutes apart; the payoff is that nothing happened in between).
- **Forward:** **cast again in ep 5** — origin payoff: he was lava once
  (arc canon, `docs/roles/audience.md`). His voice is therefore reserved;
  do not hand `Deep_Voice_Man` to anyone else.

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

### Cameos + minor bodies

| Body | Episode(s) | Voice | Notes |
|---|---|---|---|
| The kid | 1, 2, 3 | silent, always | Silhouette; frames every cold open. Three episodes running; keeps the streak. |
| Beetle | 2 | minimax `Patient_Man`, `calm`, 0.92 | Genuinely cannot perceive Puff (not unkind). Two lines fired three times. |
| Leaf | 2 | minimax `Calm_Woman`, `calm`, 0.92 | Same two lines, one scene later; the different voice IS the joke. Beetle+Leaf were recast off the Narrator after the six-year-old caught the shared voice — origin of the distinct-voice rule. |
| Flower, Moose | 1 | Narrator cameo-voiced | Pre-dates the distinct-voice rule; if either returns with a line, it gets its own voice. |
| Kevin | 1 | none | A speck of dust, named by Drip. "Kevin is a lovely name for a speck of dust, darling." |
| The blue copies | 3 | none (bubbles off one Blue clip) | **Bluington, Bluesworth, Bluey**, fourth greeting "Hi... me!" — see Blue. |
| Identical raindrops | 1 | none | Roll-call names: Drop, Droplet, Dripley, other Drop, Droppy, Drop the third. |
| Identical puffs | 2 | none | Roll-call names: Puffy, Puffington, other Puff, Puff the third ("It is a very popular name."). |
| The volcano | 2, 3 (scenery) | **silent; voice RESERVED: `Elegant_Man`, pitch −6** | See ledger and world rules. Has never had a line; does not get one until it wakes. |
| Blobby / BlobbyCrowd, AirBlob | kit | none | Unrigged background bodies (`src/lib/kid/characters/`). Rule of thumb: if it has a line it's a Drip; if it's scenery it's a Blobby. |

---

## 3. Series ledger

### The volcano (sleep escalation — get this exactly right)

- **Ladder:** ep 2 asleep and unmentioned → **ep 3: one-eye beat + the
  Yellow rest-attempt/warn-off** → ep 4 small stir → ep 5 wakes.
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
- **Consequently UNFIRED and available** (ep-4 tease or ep-5 cold open):
  Sunny's reflexive wake-claim ("OH! That one is me as well! HA! HA!" —
  direction note banked with it: full confidence, no doubt anywhere in it)
  and the *"That is not me."* inversion.
- **Banked for ep 5:** the wrongness ceremony — *"I did that."* / *"No. He
  really didn't."* — Sunny's first true wrongness, reserved since ep 2.
- **Voice reserved:** `Elegant_Man` at pitch −6.
- **The volcano rule:** scenery; never named in a line; on the measured
  horizon; continuously visible in every shot it appears in (no blink-out
  once established in a world); nobody looks at it, points at it, or
  stings it musically.

### Catch-phrase ceilings and counts

| Phrase | Owner | State |
|---|---|---|
| "You're welcome! HA! HA!" | Sunny | Ep 1: 3 (+ Drip's `a3_43` return); ep 2: 6; ep 3: **8 — ceiling 8** (raised 7→8 by Mike for `a3_31b`, 2026-08-04). No ninth; ceilings are per episode and hard. |
| "GOOD MORNING, EVERYBODY!" → "I invented mornings!" | Sunny | Greeting+brag pairing, **three-for-three** (ep 1 `a1_09`/`a1_11`, ep 2 `a2_02`/`a2_05`, ep 3 `a1_03`+`a3_31` alias/`a3_31b`). Series constant, not an option. |
| "That one is me as well!" | Sunny | Ep-2 card: fired. Ep 3: **zero** (T10). Banked — next firing belongs to the volcano thread. |
| "You can't see me. But you can FEEL me." | Puff | 4 series-wide (3 + 1); one per appearance. |
| "I am NOT small! I am travel-sized!" | Drip | Ep-1 gag (2 + speck visuals); revive only as fan service. |
| "Look up. That's me." | Ray | 3 in ep 3 (incl. sunset form). His pointing line. |
| "darling" | Cloudia | Hers; lending it out is the joke (Puff, once). |
| "Different show. Same ___." | Narrator | 4 firings (sun, sky, rain, air), always 0.92 flat. One per returning-character entrance. |
| "What Red said." | Orange | 3 firings, one recording (ep 3). May be his whole vocabulary forever. |
| "This is a nice spot." | Green | 3 firings, one recording (ep 3). |
| "I just said that!" | Blue | 4 firings, one recording — **capped at 4** (ep 3). |
| "Great ___, ___!" | Yellow | 7 firings in ep 3, buttoned with "Great bounce, me!". |
| "Are we there yet?" | Ray | Ep-3 gag: 5 identical firings (one recording) + 1 truncated; escalating silences 45/75/105/135/165f. Spent. |

### The long fuse (ep-2 banked material — untouched)

`a2_45`/`a2_45b` (wind, Narrator): *"One day Sunny will be wrong about
something."* — 36f of real silence — *"It is not today."* Planted ep 2,
**deliberately not collected in ep 3** (a longer fuse, not a forgotten
one), still burning. It pays off with the wrongness ceremony in ep 5.

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
Bluey / "Hi... me!"** (`a2_32b`, one clip, four bubbles).

### Other running state

- **Credit allocation** (ep 3): four firings, four speakers, one joke —
  the last delivered by the character being cheated ("It is mostly me.").
  Available as a series device.
- **Orange translates Red's silences**: six paired firings in ep 3;
  travels with the pair.
- **Sunny is always right**: intact through three episodes; his ep-3
  concession is exactly half. **No verdict until ep 5.**
- **Blue anti-Sunny arc**: seeded, unfired — see Blue's block. DO NOT fire
  the payoff early.
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
4. **The silent constants:** the kid, the volcano, Violet. Never voiced.
5. **`sameAs` discipline.** Every repetition gag on MiniMax is ONE
   recording, aliased byte-identically — the generator resolves backwards,
   so the earliest firing must be the source. A re-record kills the joke.
6. **Catch-phrase ceilings are hard** (table above). Nothing adds a firing
   past a ceiling without Mike's explicit call.
7. **The volcano rule** (ledger, above) binds every coastal scene in every
   episode.
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

---

## 5. Forward arc

Do not restate it here: the series arc canon — **ep 4 = plants /
photosynthesis (Sunny's peak), ep 5 = volcano wakes (Claire's
commissioned episode)** — and its guardrails (hero-arc separation, the
soil bridge, Rock's return, the volcano voice) live in
`docs/roles/audience.md`, "Series arc canon". Read it with this file.
