# Drip Chooses the Way Up — the expansion (CYOA phase 1.5)

**Status:** design FINAL (Fable, 2026-10-17); build pending.
**Why:** the family hub's first feedback round — Math (8) gave the demo the
round's only flat face: "I think it was too short and there should be more
choices." Mike's call (2026-10-17): expand the demo, not the full phase-3
pilot. Same composition id **`DripChooses`** — the hub's catalog item and
its feedback history key on it; never rename it.
**Spec it answers to:** docs/CYOA.md (fold docs/cyoa-pilot/findings.md's
six resolutions into it first — see "Preflight").

## The shape

The whole water-cycle day as one tree. Three choice points, foldback at
every act boundary, eight distinct paths, roughly 4½–5 minutes per watch.
Episode one's cast, on episode one's ocean, with episode one's kit
(cross-imported from water-cycle, as the demo already does).

```
intro ─┬─ sunbeam ─┐
       └─ float ───┴─ hotel ─┬─ rain ─┐
                             └─ snow ─┴─ stream ─┬─ river ──────┐
                                                 └─ underground ┴─ ending
```

Composition layout order (segments end to end, one composition, seeks
between them exactly as today):
`intro, sunbeam, float, hotel, rain, snow, stream, river, underground, ending`

| segment | next | ~len | pedagogy |
|---|---|---|---|
| intro | choice `wayUp`: sunbeam ☀️ / float ☁️ | 40s | (existing) |
| sunbeam | jump → hotel | 35s | evaporation, fast (existing) |
| float | continue | 35s | evaporation, gentle (existing) |
| hotel | choice `wayDown`: rain ☔ / snow ❄️ | 50s | condensation; a cloud IS its guests; heavy → check-out |
| rain | jump → stream | 40s | precipitation, fast |
| snow | continue | 60s | precipitation as snow; **storage** — snow waits, then melts |
| stream | choice `whereTo`: river 🏞️ / underground 🕳️ | 30s | downhill, always |
| river | jump → ending | 50s | collection, surface: flower, moose, taps |
| underground | continue | 50s | collection, hidden: groundwater → spring |
| ending | end | 55s | the circle; Sunny's credits honour every choice |

Path ids are stable and recorded in localStorage: keep `wayUp` with its
option ids `sunbeam`/`float`; new `wayDown` (`rain`/`snow`) and `whereTo`
(`river`/`underground`). Never rename an id once shipped.

## Rulings (log any deviation in a "Build calls" section at the end of this file)

1. **The clock bends once, on purpose.** docs/CYOA.md's one-world-day rule
   is for episodes. Here the `snow` path takes a whole winter (snow does
   not roll downhill; it waits — that is the storage lesson and the
   funniest branch). The merge at `stream` reconciles on location + cast;
   the time gap is carried by a ledger entry (`season: spring` on snow
   paths) and paid by ONE variant insert in `stream` (`st_02b`). The
   ending's sunset is the sunset of whatever day Drip gets home. Mike can
   overturn to rain-vs-hail (keeps the clock, loses the winter).
2. **Callback rule, budgeted as beats:** every choice is honoured at least
   twice — once in the next shared segment, once in the ending's credits.
   Branch segments carry NO variants for earlier choices (choice-2
   branches play under both choice-1 histories unchanged; choice-3 branches
   under all four). Variant clips, total: `hotel` 2 (existing greeting),
   `stream` 2, `ending` 6. Ten. No more.
3. **Voices stay kokoro, as the demo is** (Narrator af_heart, Drip af_bella
   1.1, Sunny am_puck, Cloudia bf_emma). The series recast Drip to MiniMax
   later; this is a demo with eighteen approved clips already in that
   voice, and every new line is free and deterministic. Mike can overturn.
4. **Series ledgers do not count this.** Sunny's "HA! HA!" and the one
   roll call (`ug_04`) are outside the bible's per-episode ceilings; the
   demo is not an episode. Do not update BIBLE.md counts from it.
5. **Seams end on a held pose** (SETTLE_FRAMES at every segment head, a
   generous tail on every choice segment — the card sits on those frames).
6. **Ep-1 callbacks are deliberate** (Kevin, the moose, "That was my
   elbow!", the sibling mob, "I would look GREAT as a snowflake" is the
   whole reason `snow` exists). They are re-recordings here (different
   video, no cross-video sameAs); keep the wording identical to ep 1 where
   the brief quotes it, so a kid who knows ep 1 hears the same line.

## Preflight (before scenes)

- Fold docs/cyoa-pilot/findings.md "Six spec-level ambiguities" resolutions
  into docs/CYOA.md (skeleton-critical cast at merges; two-tagged variants
  for segments under two histories; ledger ids; a published clock per
  episode; path-scoped promise lists; named-paths-only open promises) and
  mark the Phase-1 open questions answered where the demo answered them
  (auto-default 10s kept; options ARE read aloud).
- Player: the end card gains **"Change my last choice"** (rewind to the
  LAST choice segment on the viewer's path, truncating the path after it)
  next to the existing **"Try a different way"** (first choice) and the
  replay counter. `branchingEngine.ts` gets `lastChoiceSegment(spec, path)`
  — pure, tested like `firstChoiceSegment`. End card still lists every
  choice in story order (it already does).
- Hub blurb (in ~/projects/kids-hub, NOT this repo — leave it; Fable does
  it): "You decide how Drip gets up, how he comes down, and which way he
  goes home."

## Lines (final wording — Fable; TTS rules as the file header: no digits,
## no colons, sound words as words, CAPS = shouted)

Keys `<seg>_<nn>[a|b]_<speaker>`. Existing `in_*`, `sa_*`, `fl_*`, `ch_01`–`ch_03`
unchanged. The old `ending` segment becomes `hotel`: rename `en_01a/b` →
`ho_01a/b`, `en_02` → `ho_02`; drop old `en_03`/`en_04`.

### hotel (shared; greeting is the choice-1 variant insert)
- `ho_01a_cloudia` (sunbeam): DRIP! You came up on a sunbeam! Sunny has not stopped talking about it!
- `ho_01b_cloudia` (float): DRIP! You floated up the gentle way! You saw every single bird!
- `ho_02_drip`: I did it! I went all the way up! I am extremely tall now!
- `ho_03_cloudia`: Welcome, darling, to the Cloud Hotel. House rules. Every guest hugs a speck of dust.
- `ho_04_drip`: Hello, speck. I shall call you Kevin.
- `ho_05_narrator`: A cloud is a zillion tiny drops, each one hugging a speck. Drip was now wallpaper.
- `ho_06_cloudia`: Room for one more. And one more. And, oh my. We are FULL.
- `ho_07_narrator`: A crowded cloud goes grey, and heavy, and a heavy hotel cannot stay in the sky. It was check-out time.
- `ho_08_cloudia`: Two ways down, darling. The waterslide, straight off the balcony. Or the roof. It is very cold on the roof. Guests who leave from the roof leave as snowflakes.
- `ho_09_drip`: A waterslide. Or a SNOWFLAKE. I cannot pick!   *(gap after, as `in_06`)*
- `ho_10_narrator`: Which way should Drip come down? You choose!
- card: `ch_04_narrator` How should Drip come down? You pick! · `ch_05_narrator` Rain down fast! · `ch_06_narrator` Snow down slow!

### rain
- `ra_01_cloudia`: Everybody OUT! Mind the gap, darling. There is no floor.
- `ra_02_drip`: Ohhhh nooooo. WHEEE!
- `ra_03_narrator`: Down he went. Rain is the fast way. The best waterslide ever built, and it goes all the way from the sky to the ground.
- `ra_04_drip`: I am doing a LOOP! Raindrops do not do loops! I am doing one ANYWAY!
- `ra_05_narrator`: Drip landed high on a mountain. Sploosh.
- `ra_06_drip`: I have landed. I am a mountain drop now. I live here.
- `ra_07_narrator`: He lived there for about four seconds.   *(deadpan: silence in front of it)*

### snow
- `sn_01_cloudia`: Up to the roof, darling. It is very cold. Mind your edges.
- `sn_02_narrator`: On the roof the air was so cold that Drip froze into a snowflake. Six points. Very fancy.
- `sn_03_drip`: Look at me. LOOK at me. I am a snowflake. I have CORNERS.
- `sn_04_narrator`: Snow is the slow way. Drip drifted down for a very long time, and landed on the mountain without a sound.
- `sn_05_drip`: I have landed. I am a mountain snowflake now. I live here.
- `sn_06_narrator`: And he did live there. All winter. Snow does not roll downhill. Snow waits.
- `sn_07_drip`: Still waiting. Still fancy.   *(long hold before and after; the winter passes on screen)*
- `sn_08_narrator`: Then spring came, and Sunny came with it, and the mountain snow melted into mountain water, one drop at a time.
- `sn_09_sunny`: Good MORNING, snowflakes! Time to be water again! HA! HA!
- `sn_10_drip`: Aw. My corners.

### stream (shared; `st_02` is the choice-2 variant insert)
- `st_01_narrator`: Water always rolls downhill. Always. Every time. A trickle met a trickle, and that was a stream.
- `st_02a_drip` (rain): That was the greatest waterslide of my LIFE. Hi! Hi! Hi! Who are all of you?
- `st_02b_drip` (snow): I was a snowflake for a WHOLE winter. I looked great. Hi! Hi! Hi! Who are all of you?
- `st_03_narrator`: The stream came to a fork. One way went along the ground, down to the river, past everybody. The other way went straight down, into the ground, where it was dark.
- `st_04_drip`: The long way round. Or the secret way. I CANNOT PICK.
- `st_05_narrator`: Which way should Drip go home? You choose!
- card: `ch_07_narrator` Which way should Drip go home? You pick! · `ch_08_narrator` Down the river! · `ch_09_narrator` Under the ground!

### river
- `ri_01_narrator`: The stream met another stream, and the streams became a river, and the river had visitors.
- `ri_02_narrator`: A flower leaned over and drank a bit of him. Slurp.
- `ri_03_drip`: Excuse me! That was my elbow!
- `ri_04_narrator`: Then a moose walked in and stood right in the middle of the river. The moose did not move. Moose rarely do.
- `ri_05_drip`: Sir! SIR! Fine. FINE. We will go AROUND the moose.
- `ri_06_narrator`: Farmers took some. A town took some. Somebody's bath. Somebody's teeth.
- `ri_07_drip`: Everybody wants a bit of me! I am very popular!
- `ri_08_narrator`: Then the river turned a corner, and the water got wide, and blue, and salty, and enormous.

### underground
- `ug_01_narrator`: Drip sank into the ground, between the stones, and everything went dark.
- `ug_02_drip`: I cannot see anything. I am an underground drop now. This is fine. I live here.
- `ug_03_narrator`: This part is true, and most people forget it. A huge amount of the world's water is under the ground, moving very slowly, in the dark.
- `ug_04_drip`: Hi Worm! Hi Wormy! Hi other Worm! Hi Worm the third!
- `ug_05_narrator`: Every worm down there is called Worm.
- `ug_06_drip`: They did not say hi back. Worms are busy.
- `ug_07_narrator`: Underground water goes downhill too. Slowly. Sideways. Towards the sea. And one day, it comes out.
- `ug_08_narrator`: Drip came out of a hole in a cliff, as a little spring, straight onto a beach, which surprised a crab.
- `ug_09_drip`: SUNLIGHT! Hello crab! I came from UNDER you! And there is the sea!

### ending (shared; `en_04`/`en_05`/`en_06` are the three credit inserts)
- `en_01_narrator`: The sea. Wide, and blue, and salty, and home.
- `en_02_drip`: Hi Drop! Hi Droplet! Hi Dripley! I am BACK!
- `en_03_sunny`: Everybody! EVERYBODY! Let us go over who did what today. It was me. But let us go over it.
- `en_04a_sunny` (sunbeam): The sunbeam express? Me. Obviously.
- `en_04b_sunny` (float): The slow float? Also me. I was just being gentle.
- `en_05a_sunny` (rain): The rain? Me. I filled that hotel until it fell over.
- `en_05b_sunny` (snow): The snow? That was the cold. But who melted it? ME.
- `en_06a_sunny` (river): The river? That was downhill. Fine. But downhill is not a person. So, me.
- `en_06b_sunny` (underground): The underground? I have never been underground. I am still counting it.
- `en_07_narrator`: Sunny was right about most of that. Which, for Sunny, is normal.
- `en_08_drip`: Wait. I went UP. I went across the sky. I came DOWN. And I came all the way home. It is not a line. It is a CIRCLE. THE WATER CYCLE!
- `en_09_narrator`: You picked three things today. Drip has seven other trips in him. Come back and pick differently. It is a completely different adventure, in exactly the same world.

## Staging notes (per segment; the ep-1 script's matching scenes are the reference)
- **hotel:** ep-1 Scenes 13–22 compressed. Doorway + Cloudia + clipboard;
  the dust-speck bowl (Kevin held at arm's length); time-lapse fill; the
  light dims; the two exits drawn as signs (BALCONY ↓ with a slide, ROOF ↑
  with a snowflake) during `ho_08`, so the card's options are already on
  screen. Choice hold on a wide with both signs visible.
- **rain:** the ep-1 waterslide (Scene 23 staging), one loop-the-loop on
  `ra_04`, mountain landing with the flag (Scene 24). `ra_07` over Drip
  already sliding off his rock.
- **snow:** rooftop, Drip grows a six-point frame (a `Drip` with a drawn
  snowflake outline, not a new rig); slow drift with the birds from `fl`;
  winter passes as a cross-fade day→night→day with snow depth rising on
  `sn_06`–`sn_07`; Sunny enters on `sn_08`; the frame melts off on `sn_10`.
- **stream:** Scene 25 staging; the fork drawn plainly (a river bending
  right, a dark sink-hole left) during `st_03`; choice hold on the fork.
- **river:** Scenes 26–29 compressed; the moose is a narrator cameo as in
  ep 1 (no new voice); headland reveal on `ri_08`.
- **underground:** dark fill, stone edges, Drip self-lit; worm faces for
  the roll call (bubbles only); slow sideways travel on `ug_07`; a cliff
  spring + beach + one crab on `ug_08`; the sea revealed on `ug_09`.
- **ending:** Scene 29/30 staging; the sibling mob; Sunny large in the sky
  for the credits, each credit paired with a small icon of the chosen
  thing; the glowing ring on `en_08`; end card from the player.

## Build plan (one Opus builder, worktree, waves with a checkpoint report after each)
- **Wave A — spine:** preflight above; narration.mjs rewrite (all keys,
  header updated, WATCH-FORS for the new risky clips: `sn_03` CAPS stack,
  `en_08` long shout, `ho_06` "oh my"); `npm run narration -- --video
  drip-fork`; Video.tsx SCRIPT for all ten segments with placeholder
  scenes (caption + cast marks) so the whole tree PLAYS; `branching()`
  with the new NEXT map; player end-card change; registry description
  updated ("...and how he comes back down, and which way he goes home");
  gates: typecheck, lint:hooks, a branching-spec self-check script
  (every jump target exists, every segment reachable from `intro`, each
  of the eight paths' total seconds printed), full `--scale=0.25` render,
  site build. Report → scratchpad/feedback-2026-10-17/dripfork-waveA-report.md.
- **Wave B — scenes:** the six new segments' scenes per the staging notes,
  cross-importing water-cycle kit (add exports there with minimal diffs;
  do not reorganise). Still self-review: 6 stills per new segment into
  scratchpad/feedback-2026-10-17/stills/dripfork/, checked for: speaker
  has the bubble, bubble tails, nothing over faces, held pose at every
  seam head and every choice hold. Gates as wave A plus a full render.
  Report → dripfork-waveB-report.md. No commits; explicit file list.

## Build calls
*(builder appends dated rulings here; Mike overturns from this list)*

### 2026-10-17 — wave A (spine)
- **Variant slots are sized for the longer clip.** The composition's frame
  layout must be the same on every path (the player seeks by offsets computed
  once), so each variant line's slot is the longer of its two clips; the
  shorter one plays from the same frame and leaves the difference as silence
  before the next line (worst case `en_04a` vs `en_04b`, 25 frames). Mouths,
  bubbles and `lineWindow` follow the clip actually playing (`resolveScene`).
- **The variant mechanism is generic.** Phase 1's special-cased greeting scene
  (its own `<Audio>`, `greetingMinFrames`) is replaced by `VARIANTS` lines in
  Video.tsx's SCRIPT; all ten variant clips go through it.
- **Segment-head silence.** Every new segment's first scene has a `lead` of
  `SETTLE_FRAMES + 6` silent frames before its first line (ruling 5 extended to
  audio: a seam overshoot must not clip a first word). The hotel greeting keeps
  phase 1's 30-frame lead. The three phase-1 segments are untouched.
- **The old ending folds into the hotel.** `scenes/ending.tsx` became
  `scenes/hotel.tsx`; `ho_02`'s boast now plays in the greeting scene (it used to
  open the wrap scene), and the phase-1 wrap and its "try the other way" card
  are gone. A new `scenes/ending.tsx` holds the new ending segment.
- **Roll calls are slowed.** `ug_04` (worms) and `en_02` (siblings) use Drip's
  voice at speed 1.0 instead of 1.1, per the STYLE.md roll-call rule.
- **Defaults outside the site** (Studio, `remotion render`) are each choice's
  first option: sunbeam / rain / river.
- **Card prompts** (the on-card text, not the voice): "How should Drip come
  down?" and "Which way should Drip go home?". Labels and emoji as briefed.
- **"Change my last choice" is shown only when it differs from "Try a
  different way"** (on a one-choice spec both would rewind to the same card),
  in the kids' pink. It clears the last choice and everything after it.
- **No replay counter was added.** The brief puts the new button "next to …
  the replay counter", but the counter only exists in localStorage (`runs`);
  the end card has never displayed it. Left as is — say if you want it shown.
- **Path lengths come out 4:41–5:20**, a little over the brief's 4½–5 minutes
  on the snow paths (the hotel runs 60s against the planned 50 because
  `ho_08` is a 9.7s line, and snow's winter holds are 2.2s each).
- **Engine tests live in the self-check.** The repo has no test runner, so
  `lastChoiceSegment` / `firstChoiceSegment` are tested inside
  `scripts/check-branching.mjs` (`npm run check:branching`), which also
  checks targets, reachability, tiling, and `seamAction` at every seam.
- **Water-cycle exports.** `act2.tsx` and `act3.tsx` gained `export` on the
  declarations this demo restages from (no other changes), plus one comment
  line in act3's header saying why.

### 2026-10-17 — wave B (scenes)
- **Hotel `ho_fill` is two shots in one scene**: inside the swarm for `ho_05`
  (a pull-back until Drip is one tile of the pattern — "wallpaper"), then a
  cut to ep 1's exterior time-lapse for `ho_06`/`ho_07` (floors on "one more /
  one more / oh my", grey and droop on "grey, and heavy").
- **Kevin is held out at the cheer hand** (arm's length, clear of Drip's
  silhouette), and ep 1's name arrow labels him — a deliberate callback.
- **Exit signs are drawn screen furniture** (BALCONY ↓ with a drop, ROOF ↑ with
  a snowflake), springing in on the clauses of `ho_08` that name them; the
  balcony also grows a drawn slide. Both stay up and pulse under the card.
- **The rain landing slides Drip down the peak's own right-hand face** and out
  of frame before the segment ends, so the seam into `stream` is a held empty
  peak with the flag. He keeps saluting the whole way down.
- **`sn_07` ("Still waiting. Still fancy.") has a bubble**, against the STYLE.md
  "deadpan = nothing enters" rule. The brief's still checklist asks for the
  speaker to have the bubble, and it is his line, not a narrator tag; the
  stillness is kept everywhere else (no gesture, a 4-frame emotion lead).
- **The snow pile is capped at foot height** (it was up to his face on the
  first pass); the winter is three day/night cycles over the two holds.
- **Snow paths show the same stream picture**: the spring morning is carried
  only by `st_02b`, as ruled. No snowmelt dressing in `stream`.
- **The fork is top-down, like ep 1's downhill**: the river bends right past
  trees, a stony sink-hole sits left, each lights on its clause of `st_03`.
- **River `ri_06` panels**: ep 1's farm and water-tower panels, the bath, and
  a new "somebody's teeth" panel (ep 1's tap plus a drawn toothbrush). `ri_07`
  ("I am very popular!") plays back on the river rather than on a panel,
  leading into the headland pull-back on `ri_08`. ep 1's "Slurp." card is kept
  word for word.
- **The moose walks in** (one eased slide, then dead still), since the line
  says he "walked in"; after that he is ep 1's moose, unchanged.
- **Worms are drawn, never voiced** ("bubbles only" read as: Drip's bubble
  carries the roll call; the worms only have faces). Four identical worms on
  one shared phase, each springing up as it is named. No name tags.
- **The underground is plum, not black**, and Drip carries a soft self-glow in
  every dark shot.
- **New props, drawn in this demo**: the snowflake frame, the worms, the crab,
  the cliff spring and beach, the sink-hole, the exit signs, and six credit
  icons (sunbeam, float, rain, snow, river = river + daisy, underground =
  worm in a hole). Nothing was promoted to src/lib/kid.
- **The ending opens on the open sea**, not on either arrival (headland or
  beach), so the shared skeleton belongs to both underground and river paths.
- **Credit icons are the only path-read pictures** (`choices` in
  `CreditsScene`); everything else that varies is the clip swap.
- **`en_07`'s verdict gets Drip's `skeptical` face at the camera.** It is a
  narrator line, so Drip has no bubble.
- **The final frames are a held ring with a slow glow cycle**, no spin: the
  site's end card lands on them.
