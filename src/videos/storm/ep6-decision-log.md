# EP 6 — decision log (calls taken in Mike's stead, "straight to a cut" campaign)

One line per call: the call, the rejected alternative, reversal cost.
Mike's pass works from this list, top item first. Mike's own rulings
(2026-10-26: ep 6 = the storm, tease ratified; mode = straight to a
deployed cut; quota gates) are standing decisions, not re-logged. Bible
canon from the ep-5 fold is in `docs/kids/BIBLE.md`, with PROVISIONAL
marks where he has not ruled.

## TOP — needs Mike's ear/eye after watching

- **NO SOUND DESIGN IN THE SKELETON — rumble, CRACK and gust are
  PICTURE-ONLY** (skeleton wave, 2026-10-26). The script calls for an SFX
  rumble at the nine-counts (`co_24`, `a1_59`, `a3_38`) and the loudest
  CRACK at the overhead break; the suite has no SFX layer and the box has
  no ffmpeg. Shipped: glass rattle + mug ripple on every arrival, the
  identical "Present!" at distance volume. Option logged for a sound pass
  after the acts: pure-node PCM WAVs (`scripts/gen-sfx.mjs` →
  `public/sfx/storm/`) played with `<Audio>`. Reversal: one builder wave,
  no re-records.
- **"Present!" VOLUME LADDER BY COUNT** (builder, ratified by the
  showrunner): 0–2 counts 1.0; 3 → 0.85; 6 → 0.6; 9 → 0.45. The script
  names only `a2_52` louder / `a3_21`, `a3_38` far; `a2_12` (six) sits
  with `a3_21`, `a2_25`/`a3_11` (three) at 0.85 so distance reads the
  same both halves. Reversal: one table in Video.tsx.
- **CLOUDIA IS THE HOTEL IN EXTERIORS; THE TOWER HAS NO FACE** (builder
  call 6, showrunner-ratified): in Scene 1 the small grey cloud over the
  sea is Cloudia's rig and she speaks from it; once the tower stands up
  (`HotelTower`) it is a building, and she is the manager INSIDE. Rejected:
  a face on the tower (two Cloudias on screen at the lobby cut). For
  Mike's eye on the deployed cut. Reversal: one face toggle.
- **THE HAIL ARE ROUND ICE (`HailBall`), NOT BLOBBIES** (builder call 7):
  Blobby is a drop; hail must read as balls. Stony = the biggest HailBall,
  greyer ice + frost crown, same body at the penthouse / on the step /
  last to melt. Reversal: swap the body component.
- **FINGERS RISE FROM THE CLIP'S FIRST FRAME, FULLY UP AT +13f** (the
  measured word onset) — the onset grid made visible; a snap on the clip
  start would be up 0.4s before the word. Reversal: one constant
  (`COUNT_VOICE_LEAD`).
- **TITLE ON TWO LINES** ("Boom and the / One, Two, Three"), 120px —
  one line clipped at the frame edges. Reversal: font size.
- **Interior tower section shows 4 floors, exterior 6** (builder call 9)
  so characters read inside; a kid may notice the floor count differs.
  Reversal: a constant.
- **BOOM CAST: `English_magnetic_voiced_man`, PROVISIONAL** (narration
  wave, measured). The by-ear audition winner `English_FriendlyPerson`
  (deepest, most "giant") measured 104.9 Hz across his 36 real lines — on
  top of Rock (104.9) and the volcano (105.8), who follows Boom directly in
  Scene 16; the pick measures 128.3 Hz, +3.5/+3.3 st clear, reads faster
  than both, but is brighter and less resonant than the brief wanted.
  FriendlyPerson's takes are kept on disk — a free restore if Mike prefers
  the giant and accepts the collision. **Ear shortlist with paths:
  `scratchpad/ep6_boom_audition/MEASUREMENTS.md` §8.** Reversal: one
  constant + 36 clips, cents.
- **Scenes 7 and 8 swapped after the cadence report** (STATIC card now a
  full scene before LIGHTNING; was 30.3s). Rejected: the card on the
  roll-call middle (kills the button); accepting 30s (STYLE: one card a
  minute). Reversal: swap two SCRIPT-table entries back; the renumbered
  keys stay.
- **The count is an ONSET grid with negative gaps** (kokoro pads each
  number with ~0.9s silence; clips 38–43f). Rejected: speed 1.4 on the
  numbers (rushes the word); accepting a ~1.3s count (a pedagogy bug —
  "three counts = one kilometre" would be false on screen). Reversal:
  none needed; a builder constant.
- **EP-7 TEASE = "WHY DOES THE MOON CHANGE SHAPE?"** (synthesis §8,
  Treatment B's argument over the showrunner's own sea-salt lean: the
  end-card picture exists, the Earth's-shadow myth is rule-18 gold,
  thirty nightly home checks, ep-3/ep-4 plants, Sunny's precision two
  episodes clear of the ceremony). Mike rejected the moon at ep 5 for
  proximity to the ceremony — this call assumes two episodes is the
  distance that objection asked for. Rejected: sea salty (logged
  alternate; Drip + Rock, a tastable check — its one-line arm is NOT
  fired). **A tease is an audience promise — overturn EARLY.** Reversal:
  1 card + 2 kokoro lines, free until ep-7 work starts.
- **TITLE "Boom and the One, Two, Three"** (B) over A's "Boom and the
  Hotel With No Stairs". Reversal: free until art/registry.
- **THE BREAK IS QUIET**: at count zero Boom's voice is "Present." (full
  stop, `auto`, 0.95) after the loudest CRACK in the episode (sound
  design); Narrator "I did not get to one." Rejected: a loud/surprised
  break (A). Reversal: one fresh clip, cents.
- **Puff's catch-phrase moves off his entrance** to the gust front at the
  kid's window (both treatments); his entrance is the lift ("Going up."
  chain). The bible's "his catch-phrase IS his entrance" was an ep-4
  ruling, not a law. Reversal: re-key the migration to the lift scene,
  free.
- **The volcano speaks ONE line**: "…Louder than me. Well done." at the
  overhead crack, 48f, CUTTABLE. Reversal: one-line cut, free.
- **Drip's "travel-sized" callback is IN once** as she melts back to a
  drop ("I am travel-sized again.") — first firing since ep 1, Claire's
  channel. Rejected: OUT (B). Reversal: one-line cut.
- **Blue's payoff scene = three Blue lines + a 90f stunned beat** and a
  silent Violet garnish; "Both true." Reversal: trim to one line.
- **"Different show. Same hotel." fires once**; Drip and Blue carry their
  own entrances. Reversal: free (kokoro).
- **Two treatments ran; B's structure + A's hotel texture is the spine**
  (full argument: ep6-synthesis.md §1). Rejected: A's structure (hero's
  first line at ~minute 8).

- **BLUE'S BANKED ANTI-SUNNY PAYOFF FIRES IN EP 6** (showrunner call,
  brief §4; Mike gave the slot as "natural but NOT promised"). Mechanism:
  Blue is light, the flash is light, he arrives WITH Flash — "First!" —
  and for the first time in four episodes he is right; the Narrator's
  button FLIPS its format ("He was first. He was also very fast. Today,
  those are the same thing."). Why now: light-before-sound is the one
  mechanism in the series where "first" is literally the lesson; a later
  slot would be weaker and the gag has had three episodes of wrongness
  (Sunny's took four). Rejected: another watering (wrong a 6th/7th time)
  — saves the bank but spends the audience's patience; and Blue OUT
  entirely (loses the first-vs-late engine). Reversal: cut the flipped
  button + Blue's reaction and re-word his line to a wrong claim; one
  scene, cents.
- **HERO = BOOM, THE THUNDER, he/him, new voice; FLASH (the lightning)
  is a SILENT she/her constant.** Want: to be on time; turn: he is not
  late, he is far — and far is a ruler. Rejected: a Flash/Boom talking
  two-hander (fast-vs-slow is ep 5's engine), a lightning hero (speed
  = Ember), a hail/drop hero inside the hotel (Cloudia carries the hotel
  already). Reversal before script: free; after TTS: a recast is one
  constant + re-buy; a re-conception is a rewrite.
- **MIND-BLOWER (rule 17) = lightning is ~5× hotter than the Sun's
  SURFACE, landing on Sunny, who keeps the inside (core ~15 million °C,
  true); secondary = Lake Maracaibo, 100+ storm nights a year.**
  Rejected as primary: strikes-per-second (~44/s — fine but no Sunny
  beat); the Empire State strike count (parent-grade). Reversal: recap
  lines, kokoro, free.
- **MYTH (rule 18) = "thunder is clouds bumping" — busted by Cloudia
  ("We do not bump, darling. We mingle.").** Optional second: "never
  strikes twice". Rejected: "lightning never strikes twice" as the
  mandatory one (it is a parent myth more than a kid one; the kid belief
  is bumping clouds). Reversal: stamp text + 2–3 lines.
- **UNITS: kilometres and three-seconds-per-kilometre; a single
  parent-aside "about five seconds a mile" allowed once.** Mike may want
  miles-first for the kids; reversal is a few kokoro lines + bubble/stamp
  text, free.
- **SAFETY STAGING: the kid watches from a window from the first dark
  sky; one plain Narrator sentence at most, never fear.** Rejected: a
  spoken safety beat per act (lecture; tone rule). Reversal: free.
- **The volcano gets DEFAULT ZERO lines, treatments may argue ONE**;
  awake + Ember's island visible in every coastal wide (continuity
  obligation from the ep-5 fold). Rejected: a 2–3 line cameo (scarcity
  is his character). Reversal: cents.
- **Working slug `storm`, composition id `BoomStorm` (series pattern
  `<Hero><Topic>`), title by treatment round.** Locked once narration
  generates.
- **EP-7 TEASE: showrunner lean "WHY IS THE SEA SALTY?"; synthesis will
  rule after the treatments propose.** Alternates logged in brief §5. A
  tease is an audience promise — Mike should overturn EARLY, before the
  kids see the ep-6 end card.

## Narration-wave calls (2026-10-26)

- **Re-key after the kill done by the showrunner, not a fresh builder**
  (both the showrunner and the narration builder died at the 09:54 ET
  session limit before the follow-up started; on-disk state was a clean
  first pass). Renames + cache-entry renames = zero re-buys (run 4: 249
  cached, 1 synthesized). Rejected: a fresh opus builder (~250k tokens for
  eleven renames).
- **Blue `a2_32` take 1 KEPT** over the re-roll (2.196s vs 2.38s — the
  shorter read is nearer his band); take 2 archived in
  `scratchpad/ep6/rerolls/`. Ear-check item stands.
- **STATIC → LIGHTNING at 53.3s ACCEPTED** as "about a minute" (card dwell
  adds on screen). Rejected: a second reorder.
- Two Boom one-word/short re-rolls by the builder (`a2_28` take 2 kept;
  `a3_40` same shape twice = the phrase, kept). Cents.

## Script-round calls (showrunner edit pass, 2026-10-26)

- **Script accepted at 198 spoken lines + 52 count firings** (26 scenes;
  192 recordings incl. 10 count numbers + 2 migrations; 58 aliases). No
  trims; writer's trim order recorded in script.md deviation 1. Rulings in
  script.md "Showrunner edit-pass rulings".
- **One wording fix** (`co_02`, island canon). All 22 writer deviations
  accepted — the biggest: "She has gone again." stays cast `happy` (two
  `auto` lines only); Drip's buttons stay `happy`; the arithmetic fix
  "four and a half kids".
- **Narration wave spawned as ONE opus builder** (narration.mjs → Boom
  audition by measurement → generate → gates → cadence), brief
  `scratchpad/ep6/narration-wave-brief.md`. Rejected: separate audition
  and narration agents (the audition reads line text from narration.mjs,
  so one agent owns the file end to end).

## Fold + process calls (2026-10-26, boot)

- **Ep-5 canon folded into BIBLE.md before story work**, from script.md +
  ep5-decision-log.md; every ep-5 TOP item marked PROVISIONAL (Ember
  casting, "That is not me." spent, ceremony placement, volcano awake +
  7 lines, armless Ember). The 25284f runtime = 14:02.8 (the script's
  "15–18 min" estimate was pre-Playful_Girl). Little Ember → Little
  Obsidian pitch left unratified, not built. New bible section "Casting
  constraints" (bright-girl band full, pitch is a re-render, working voice
  ids). Volcano rule rewritten (awake, visible, island, speech rare).
- **Ep-5 retro entry written in LEARNINGS.md** (process lessons: files-
  not-transcripts recovery, measure-first casting, mouth-tail, sampled-
  review ratio, identity gaps + hold floors, the un-cashed ear-check gap);
  STYLE gained two rules (measure-before-listen casting; tail-aim /
  mouth-anchor + mix-blend-mode). Kept tight; canon first.
- **audience.md "Series arc canon" gained a dated "Fired (history)"
  paragraph** so writers booting from it know eps 4–5 are history and the
  spent hero arcs by name.
- **Two treatment writers run IN PARALLEL** (disjoint files
  `ep6-treatment-A.md` / `ep6-treatment-B.md`; quota PROCEED at 377k/24M;
  max-2 rule respected). Rejected: sequential (no file collision risk
  exists for text-only writers; wall-clock halves).
- **Cloudia carries the MYTH and the hotel set piece; Puff = updraft +
  gust front; Drip = a guest who freezes (hail) and is finally big; Sunny
  = the energy source, hidden behind the tower for an act, keeps the
  inside at the mind-blower.** All four are mechanism jobs, not waves
  (reply budget). Reversal: treatment edit, free.
- **Big Words: STATIC / LIGHTNING / THUNDER (+ rule stamp "LIGHT IS FAST.
  SOUND IS SLOW.")** — three cards, one a minute apart at most; THUNDER
  fires when Boom is understood, not on arrival. Reversal: free.
- **Hero attitude guardrails**: not apologetic (Puff spent), not a
  verdict-giver (Ember spent), not a pedant (Ray). Arrival chain
  candidate "Present!" — the writers may beat it.
