# Drip Goes Up Again — a second CYOA demo (phase 1.6)

**Status:** design FINAL (Fable, 2026-10-18; half-choices added the same evening, Mike's ask); build in progress.
**Why:** the family hub's second feedback round. Math (8) re-rated the
expanded "Drip Chooses the Way Up" 🙂 Fun! and then pitched a sequel, in two
notes (2026-10-18 20:19 / 20:21): at the current ending Drip should "go up
again with a new option"; Cloudia "will not be there because she has
important business", so Drip picks where to go, "either a dam from a beaver
or a mountain that is actually a volcano". Mike added (same evening): on the
volcano path Drip still reaches the beaver's dam, and **obsidian forms right
when the lava reaches the lake with the dam**.
**Mike's call:** a SEPARATE video, not a fourth choice bolted onto
DripChooses (which stays as shipped — its id and feedback history are
untouched). Fable's reasons: the pitch is a day-two story in its own right;
sixteen paths at seven minutes would undo the fix Math just approved; and
the hub gets its own feedback key for the sequel.
**Spec it answers to:** docs/CYOA.md. Precedent and kit: src/videos/drip-fork
(read its expansion-brief.md "Build calls" first — every ruling there holds
here unless this file says otherwise).

## Identity (never rename once shipped)

- Directory `src/videos/drip-again/`, composition id **`DripAgain`**, title
  **"Drip Goes Up Again"**, narration under `public/narration/drip-again/`.
- Registry: one entry after `DripChooses` in src/videos/registry.ts (minimal
  diff). Description: "Drip is home for about a minute, then wants to go up
  again. The Cloud Hotel is closed, so you decide where the wind takes him,
  and then how he gets out of a beaver's pond. A Little Big World
  choose-your-own-adventure."
- Hub (in ~/projects/kids-hub, NOT this repo — Fable does it after the
  build): new catalog item `vid-DripAgain`.

## The shape

Four choice points on every path: two full branches (`where`, `wayOut`) and
one HALF-CHOICE inside each first branch (`valleyWay` / `mountainWay`, left
or right — Mike, 2026-10-18). A half-choice is a real card (the player
pauses, the kid picks), but both options go to the SAME next segment, which
swaps a few lines and pictures: the consequence is local, the tree does not
double. Foldback at the pond. Eight paths, about 3¾ minutes a watch. Episode
one's cast on episode one's ocean, plus one new speaking cameo (the Beaver)
and one silent mountain.

```
intro ─┬─ valley ──(left|right)── dam ───┐
       └─ mountain ─(left|right)── race ─┴─ pond ─┬─ over ──┐
                                                  └─ lodge ─┴─ home
```

Layout order (one composition, seeks between segments exactly as drip-fork):
`intro, valley, dam, mountain, race, pond, over, lodge, home`.

| segment | next | ~len | pedagogy |
|---|---|---|---|
| intro | choice `where`: valley 🦫 / mountain 🏔️ | 55s | the cycle goes round again; a cloud is drops on specks, with or without a manager; wind decides where a cloud goes |
| valley | half-choice `valleyWay`: left ⬅️ / right ➡️ (both → dam) | 25s | a heavy cloud lets go; which side you fall off decides where you land |
| dam | jump → pond | 55s | river or tree (variant); a beaver cuts trees and builds a dam of sticks and mud with his teeth; water piles up behind it: a pond is water WAITING |
| mountain | half-choice `mountainWay`: left ⬅️ / right ➡️ (both → race) | 50s | some mountains are volcanoes; lava is melted rock and flows downhill like slow water; steep is fast, winding is slow |
| race | continue → pond | 45s | the race (variant: Drip wins on the steep side, loses on the long side); lava that cools SLOWLY makes rock, lava that cools FAST in water makes black glass: **obsidian**; the water it touched went up as steam, no Sun involved |
| pond | choice `wayOut`: over 🌊 / lodge 🏠 | 40s | a dam does not stop water, it makes it wait; two ways out |
| over | jump → home | 30s | the spillway: over the top, a little waterfall, downhill to the river |
| lodge | continue | 45s | a beaver's house has its front door UNDER the water; through the lodge and out the back, downstream |
| home | end | 55s | the sea; Sunny's credits honour every choice; it always goes round |

Choice ids and option ids, stable, recorded in localStorage: `where`
(`valley` / `mountain`), `valleyWay` (`left` / `right`), `mountainWay`
(`left` / `right`), `wayOut` (`over` / `lodge`). Segment ids equal option
ids where a segment is a branch; the half-choices' two options both name
the next segment (`dam`, `race`). Defaults outside the site, and the
player's auto-pick: `valley`, `left`, `left`, `over`. A half-choice that is
never reached on a path (mountainWay on valley paths, and vice versa) is
simply unmade; `choicesFrom` defaults it and nothing keyed on it plays.

## Rulings (deviations go in "Build calls" at the end of this file)

1. **A separate video, same kit.** `scenes/common.tsx` here is a thin
   rebinding (`clipOf`, `clipFrames`, `turnsOf`, `CHOICES`, `choicesFrom`,
   `SceneProps`, format constants) to THIS manifest, re-exporting from
   `../../drip-fork/scenes/common` and `../../water-cycle/scenes/common`
   whatever it needs (CloudPuff, birds, marks, emotions, SETTLE_FRAMES).
   drip-fork's own header says a third video wanting the kit is the signal
   to promote it to src/lib/kid. Noted, NOT done in this build: promotion is
   a separate cleanup, and this build must not touch drip-fork or
   water-cycle beyond adding `export` to declarations it restages from.
2. **The clock:** one world-day. Drip gets home at the end of DripChooses,
   this starts "about a minute" later, so it is the evening of that day for
   the intro and a fresh morning after a wild night's cloud ride (the cloud
   goes where the wind goes overnight; `in_09` says so). Everything from
   `valley` / `mountain` on is one daytime. No winter here.
3. **Callback rule as beats:** every choice is honoured twice — the full
   branches once in the next shared segment and once in the credits; a
   half-choice once in its own next segment (that IS the consequence) and
   once in the credits. Branch segments carry no variants for choices made
   BEFORE their own branch. Variant clips, total: `dam` 6 (`da_01a/b`,
   `da_02a/b`, `da_03a/b` by valleyWay), `race` 6 (`rc_01a/b`, `rc_02a/b`,
   `rc_03a/b` by mountainWay), `pond` 2 (`po_01a/b` by where), `home` 6
   (`hm_04` FOUR flavours by where+way, `hm_05a/b` by wayOut). Twenty.
   `hm_04` needs the variant line to key on a PAIR of choices: generalise
   `VariantLine` minimally (e.g. a `pick(choices) => key` plus the list of
   all its keys for layout and preload); the slot is still sized for the
   longest clip. Path-read PICTURES that a clip swap cannot carry: the
   dam's arrival shot (river vs tree, by valleyWay), who is ahead in the
   race shot (by mountainWay), the obsidian slab on the pond shore
   (mountain paths only, and only in `pond` — `over` and `lodge` open past
   the shore), and the credit icons in `home` (by where and wayOut only).
4. **Voices stay kokoro.** Narrator af_heart 1.0, Drip af_bella 1.1, Sunny
   am_puck 1.0. Cloudia does not speak (she is away — that is the premise;
   her sign is drawn text read by the Narrator). **The Beaver: `am_michael`
   at 1.05** — brisk, plain, a foreman with a job on. Mike can overturn; if
   he does, `bm_george` 1.0 is the fallback. Roll calls (`lo_02`, `hm_02`)
   at Drip 1.0 per STYLE.md.
5. **This is a demo; series ledgers do not count it.** Sunny's "HA! HA!",
   the roll calls, the volcano — none of it updates BIBLE.md. BUT the
   series' banked volcano lines are off limits: never "That one is me as
   well", never "That is not me", never "I did that" / "He really didn't".
   The volcano here is an INLAND mountain in episode one's world, not the
   series' island volcano; it never gets a face or a voice (silent, like
   every volcano in the show). It burps once. That is its whole performance.
6. **Seams end on a held pose** (SETTLE_FRAMES + 6 silent lead on every
   segment's first scene; 45-frame tails on both choice scenes; the end card
   lands on a held ring).
7. **Ep-1 / DripChooses callbacks are deliberate and worded identically:**
   "I live here." (×2), "about four seconds" → "about a minute", the sign's
   "Also Tuesday." (ep-1's Monday/Tuesday/also Tuesday caption gag, Claire's
   favourite), Kevin, "Hi Drop! Hi Droplet! Hi Dripley!", the moose's
   "rarely do" shape given to lava, and "I am counting it anyway" ONCE only
   (it is DripChooses' underground credit; here it belongs to the volcano).
8. **The "dam" exchange** (`va_05`–`va_08`) is a repetition gag, not a pun:
   the Beaver says the word flatly twice and the Narrator explains it. Play
   it straight. Mike can cut it to one "Dam." if it reads cheeky on screen.
9. **Mind-blowers are the eight-year-old's hook; both are true and
   checkable:** beaver teeth are orange because there is iron in the enamel;
   obsidian is volcanic glass and can hold an edge finer than a steel blade
   (surgeons have used obsidian scalpels). Keep them as stated. Also true,
   stated plainly: a beaver lodge's entrance is underwater.

## Lines (final wording — Fable. TTS rules as drip-fork's header: no digits,
## no colons, sound words as words, CAPS = shouted)

Keys `<seg>_<nn>[a|b]_<speaker>`: `in` intro, `va` valley, `da` dam, `mo`
mountain, `rc` race, `po` pond, `ov` over, `lo` lodge, `hm` home; `ch_*` are
the cards' audio.

### intro (shared; ends on choice 1)
- `in_01_narrator`: Drip went up, and across, and down, and all the way home. He had been home for about a minute.
- `in_02_drip`: I want to go AGAIN.
- `in_03_narrator`: The sea said nothing. The sea had heard this before.
- `in_04_sunny`: AGAIN? Already? Fine. I am in a good mood. I am always in a good mood. UP you go! HA! HA!
- `in_05_drip`: Wheee! Bye Drop! Bye Droplet! Bye Dripley! I will be back in about a minute!   *(Drip 1.0, roll-call speed)*
- `in_06_narrator`: Up he went, to the Cloud Hotel. The Cloud Hotel was closed.
- `in_07_narrator`: The sign said. Closed. Important business. Back Tuesday. Also Tuesday. Cloudia.   *(flat; a beat between each clause; the sign is on screen)*
- `in_08_drip`: No hotel. No rules. No Kevin.   *(gap after)*
- `in_09_narrator`: A cloud does not need a hotel. It only needs drops, and specks, and a hug. So Drip hugged a speck, and so did a zillion others, and that was a cloud. A cloud with no manager. Chaos. And a cloud with no manager goes wherever the wind goes.
- `in_10_narrator`: That night, two winds were blowing. One went to a green valley with a little river in it, and somebody busy. The other went to a big grey mountain, all by itself, with a hat of snow.
- `in_11_drip`: The valley. Or the mountain. Oh no. I CANNOT PICK.   *(gap after, as drip-fork `in_06`)*
- `in_12_narrator`: Where should the wind take Drip? You choose!
- cards: `ch_01_narrator` Where should the wind take Drip? You pick! · `ch_02_narrator` The beaver valley! · `ch_03_narrator` The big mountain!

### valley (branch; ends on half-choice `valleyWay`)
- `va_01_narrator`: In the morning the cloud with no manager was hanging over the green valley, and it was heavy, and grey, and nobody had told it what to do.
- `va_02_drip`: Everybody! I am in charge now! Nobody listen to me! Which side do we fall off?
- `va_03_narrator`: Under the left side of the cloud was the little river. Under the right side was a tree, a tall one, with a beaver at the bottom of it, chewing.
- `va_04_drip`: River. Or tree. Those are very different things. I CANNOT PICK.   *(gap after)*
- `va_05_narrator`: Which side should Drip fall off? You choose!
- cards: `ch_04_narrator` Which side should Drip fall off? You pick! · `ch_05_narrator` Left, into the river! · `ch_06_narrator` Right, onto the tree!

### dam (after the valley half-choice; `da_01`–`da_03` are its variants)
- `da_01a_narrator` (left): Off the left side went Drip, into the little river, and the little river went downhill, as rivers do, and then it stopped. It had hit a wall. The wall was made of sticks.
- `da_01b_narrator` (right): Off the right side went Drip, onto the top of the tree, and down a leaf, and down the trunk, and onto the head of a beaver, who was chewing it.
- `da_02a_drip` (left): WHEEE! I have hit a wall. I live here now.
- `da_02b_drip` (right): WHEEE! Hello! I am on your head! What are you doing to this tree?
- `da_03a_narrator` (left): On top of the wall was a beaver. He was adding a stick.
- `da_03b_narrator` (right): The beaver did not answer. CRACK, went the tree, and the tree fell into the river with Drip on it, and the beaver pushed it downhill to a wall made of sticks, and added it. Drip was now part of the wall.
- `da_04_drip`: Hello! I am Drip! What is this?
- `da_05_beaver`: Dam.
- `da_06_drip`: A what?
- `da_07_beaver`: Dam.
- `da_08_narrator`: A dam. It is a wall a beaver builds across a river, out of sticks and mud, with his teeth. His teeth are orange. That is because there is iron in them. A beaver has a little bit of metal in his mouth.   *(hold on the teeth)*
- `da_09_drip`: I have no teeth at all. I am extremely impressed.
- `da_10_narrator`: The river could not get past the wall, so it piled up behind it, higher, and wider, and stiller, until it was not a river any more. It was a pond. And Drip let go of the wall, and floated.

### mountain (branch; ends on half-choice `mountainWay`)
- `mo_01_narrator`: In the morning the wind let go, right over the mountain, and the cloud with no manager did what clouds do.
- `mo_02_drip`: Everybody out! I am in charge! Nobody listen to me! WHEEE!
- `mo_03_narrator`: Drip landed on the mountain, near the top. Sploosh. And the mountain was warm.
- `mo_04_drip`: This mountain is WARM. Mountains are not warm. Mountains are famous for it.
- `mo_05_narrator`: Then the mountain burped.   *(silence before; a smoke ring)*
- `mo_06_narrator`: This mountain was a volcano. Not a loud one. A polite one. Out of a crack near the top came a trickle of lava, which is rock, so hot it has melted, and it went downhill, because everything does.
- `mo_07_drip`: It is orange. It is glowing. It is going the same way as me. RACE YOU!
- `mo_08_narrator`: The lava did not answer. Lava rarely does. It went straight down the middle, and Drip could not. On the left, the mountain was steep, and straight, and bumpy. On the right, it went round, and round, gentle, and long, and lovely.
- `mo_09_drip`: Steep and bumpy. Or long and lovely. I CANNOT PICK. The lava is LEAVING.   *(gap after)*
- `mo_10_narrator`: Which side should Drip race down? You choose!
- cards: `ch_07_narrator` Which side should Drip race down? You pick! · `ch_08_narrator` Left, steep and bumpy! · `ch_09_narrator` Right, long and lovely!

### race (after the mountain half-choice; `rc_01`–`rc_03` are its variants)
- `rc_01a_narrator` (left): Down the left went Drip, bump, bump, bump, and the lava came down the middle, slowly, and at the bottom there was a pond, with a wall of sticks at the far end, and Drip got there first.
- `rc_01b_narrator` (right): Round and round went Drip, and it was lovely, and it was slow, and the lava came down the middle, slowly, but not THAT slowly, and at the bottom there was a pond, with a wall of sticks at the far end, and the lava got there first.
- `rc_02a_drip` (left): I WON. I am in a pond. I live here now.
- `rc_02b_drip` (right): I LOST. To a ROCK. A slow, hot, melted ROCK.
- `rc_03a_narrator` (left): Then the lava reached the water.   *(silence before)*
- `rc_03b_narrator` (right): And as Drip splashed in, the lava reached the water.   *(silence before)*
- `rc_04_narrator`: HISSSS. The water it touched boiled into steam and went straight up, with no help from anybody. And the lava stopped. When lava cools slowly, it turns into rock. When lava cools FAST, like when it hits a pond, it turns into glass. Black glass. Shiny. It is called obsidian.
- `rc_05_drip`: It made GLASS. The mountain made GLASS. Out of ITSELF.
- `rc_06_narrator`: Obsidian is so sharp that doctors have used it for knives. Sharper than steel. Do not touch it. Drip did not touch it. Drip has no hands.

### pond (shared; `po_01` is the choice-1 variant insert)
- `po_01a_beaver` (valley): You again. Busy.
- `po_01b_beaver` (mountain): Shiny. Mine.   *(he is looking at the obsidian)*
- `po_02_narrator`: The beaver had a dam, and a pond, and now a piece of glass, and he was very busy, and he did not care who knew it.
- `po_03_drip`: Excuse me, Beaver. I am trying to get home. Home is the sea. The sea is that way. Your wall is in the way.
- `po_04_beaver`: Busy.
- `po_05_narrator`: Here is the thing about a dam. It does not stop the water. It makes the water WAIT. And then the water finds a way out. There were two.
- `po_06_narrator`: Over the top, where the pond was spilling, like a bathtub somebody forgot about. Or through the beaver's house, which sat in the middle of the pond, and had its front door under the water.
- `po_07_drip`: Over the top. Or through the house. I CANNOT PICK.   *(gap after)*
- `po_08_narrator`: Which way should Drip get out? You choose!
- cards: `ch_10_narrator` Which way should Drip get out? You pick! · `ch_11_narrator` Over the top! · `ch_12_narrator` Through the beaver's house!

### over
- `ov_01_narrator`: Drip went over the top of the dam, like a drop going over the top of a dam. There is no better way to say it.
- `ov_02_drip`: WHEEEE! Bye Beaver! Your wall is very good! It did not work on me!
- `ov_03_beaver`: Busy.   *(tiny, from behind)*
- `ov_04_narrator`: Down a little waterfall, into the river again, and the river did what rivers do, which is go downhill until there is no more downhill left.
- `ov_05_drip`: I know this part! I have done this part! The sea is at the end of this part!

### lodge
- `lo_01_narrator`: Drip sank down, and found the front door, which was under the water, and went in, which means he went up, into a room made of sticks, which was dry.
- `lo_02_drip`: Hi Beaver! Hi Beaverly! Hi other Beaver! Hi Chip!   *(Drip 1.0)*
- `lo_03_narrator`: Every beaver in that house is called Beaver. Except Chip.
- `lo_04_beaver`: Busy.   *(the unbothered button; deadpan, nothing moves)*
- `lo_05_narrator`: A beaver's house is called a lodge. The door is under the water so nothing with teeth can walk in. This is true. Ask a beaver. He will say Busy. It is still true.
- `lo_06_drip`: I came in through the FLOOR. Which was the DOOR. I have never been so confused and so dry.
- `lo_07_narrator`: There was a back door. It was also under the water. Out he went, and under the dam, and into the river on the other side, which did what rivers do.

### home (shared; `hm_04` (four flavours) and `hm_05` are the credit inserts)
- `hm_01_narrator`: The sea. Wide, and blue, and salty, and home. Again.
- `hm_02_drip`: Hi Drop! Hi Droplet! Hi Dripley! I am BACK! AGAIN!   *(Drip 1.0)*
- `hm_03_sunny`: Everybody! EVERYBODY! Who did what today. It was me. Let us go over it anyway.
- `hm_04` is a FOUR-flavour insert, by `where` + that branch's half-choice:
  - `hm_04a_sunny` (valley, left): The beaver? Beavers work in the daytime. I AM the daytime. So, me.
  - `hm_04b_sunny` (valley, right): The tree? Trees are made of sunshine. Everybody knows that. Me.
  - `hm_04c_sunny` (mountain, left): The volcano? I would like it on the record that I had NOTHING to do with that. I am counting it anyway.
  - `hm_04d_sunny` (mountain, right): The race? He LOST. To a rock. I was watching. I am not counting that one.
- `hm_05a_sunny` (over): Over the top? That is downhill. Downhill is still not a person. Still me.
- `hm_05b_sunny` (lodge): The beaver's house? I have never been inside a house. I am too big. Also me.
- `hm_06_narrator`: Sunny was right about some of that.   *(flat; silence in front)*
- `hm_07_drip`: Wait. No hotel. No Cloudia. Somewhere I had never been. And I STILL got home. It does not just go round. It goes round AGAIN. THE WATER CYCLE! AGAIN!
- `hm_08_narrator`: You picked three things today. Drip has seven other trips in him, and he will take all of them, because he does not know how to stop.

## Staging notes (drip-fork's scenes are the reference; reuse its props)
- **intro:** DripChooses' `home` sea with the sibling mob (`en_02` staging);
  Sunny lifts Drip on a sunbeam (sunbeam kit, short); the Cloud Hotel
  exterior from `ho_fill`'s time-lapse shot with a drawn CLOSED sign on the
  door — the sign's five lines appear one per clause of `in_07` (the "Also
  Tuesday." line last, held); `in_09` is the wild cloud forming: CloudPuff
  grey, no windows, drops landing on specks every which way, one drop
  hugging two specks; `in_10` a night wide: the cloud centre, a drawn green
  valley with a stick wall lower left, a big grey mountain with a snow hat
  lower right, two wind streams drawn from the cloud to each. Choice hold on
  that wide, both destinations pulsing under the card.
- **valley:** morning; the raggedy cloud low over a drawn green valley:
  the little river under its left half, a tall tree under its right half
  with the Beaver at its foot, mid-chew (new rig: brown oval body, flat
  paddle tail, round ears, two big orange front teeth, a Character-style
  mouth so he can speak — no more detail than Drip has); LEFT ⬅️ / RIGHT ➡️
  drawn as screen furniture on the cloud's two sides during `va_03`, both
  pulsing under the card. Choice hold on that wide.
- **dam:** two openings, by `choices.valleyWay`: LEFT — rain from the cloud
  into the river (rain kit from `ra`), a top-down-ish stream like `st_fork`
  running into a wall of sticks, Drip pressed against the sticks on
  `da_02a`, the Beaver on top adding a stick on `da_03a`; RIGHT — one drop
  onto the tree top, down a leaf, down the trunk, onto the Beaver's head
  (Drip sitting on him for `da_02b`), then CRACK: the tree tips and falls
  into the river (one eased rotation), Drip riding the log, the Beaver
  pushing it to the wall and wedging it in on `da_03b`. From `da_04` the
  two openings are the same shot: the wall from the river side, Beaver on
  top, Drip at the wall (on the log on RIGHT paths — a path-read prop);
  the teeth get a drawn arrow label (like Kevin's) on `da_08`'s "orange";
  the water level rises through `da_10` until it is flat and wide — the
  pond — and Drip floats free. The seam into `pond` is the settled pond.
- **mountain:** the tall cloud over ep-1's mountain peak (rain landing
  kit), heat shimmer on the slope on `mo_03`–`mo_04`; ONE smoke ring from
  the summit on `mo_05` (nothing else moves); a crack and an orange glowing
  trickle on `mo_06`, running straight down the middle of the face;
  `mo_08` draws the two sides: a steep bumpy slope left, a long looping
  path right, LEFT ⬅️ / RIGHT ➡️ furniture lighting on their clauses, both
  pulsing under the card. Choice hold on that wide.
- **race:** the slope in profile, by `choices.mountainWay`: LEFT — Drip's
  stream bouncing straight down ahead of the lava, lava visibly slower;
  RIGHT — Drip looping round and round while the lava goes straight down
  and reaches the pond first. The pond at the foot with the dam wall at its
  far end. `rc_03`–`rc_04` is the set piece, identical on both: the lava
  front meets the water, a white steam column rises straight up (no
  sunbeam, no Sunny anywhere in the shot), and the front darkens from
  orange to black glossy with a highlight — the obsidian slab, held; on
  RIGHT paths Drip splashes in beside it as it forms. `rc_05` Drip's
  `amazed` face at it; `rc_06` a held wide with the slab, the pond, the
  dam. The seam into `pond` is that wide, settled.
- **pond:** opens on the dam shore from the pond side, the Beaver on the
  wall; on mountain paths the obsidian slab sits on the near shore (path-
  read picture via `choices.where`), on valley paths the shore is bare;
  `po_06` draws the two exits as the balcony/roof signs were in drip-fork:
  the spill at the top of the wall (a little OVER ↑ sign + a drawn trickle)
  and the lodge dome in the pond with a drawn dotted door under the
  waterline (THROUGH → sign). Choice hold on the wide.
- **over:** the spill, a small waterfall, Drip in it saluting (rain-slide
  energy, shorter); `ov_03` the Beaver small on the wall behind, dead still;
  river bend and the headland reveal from `ri_08` on `ov_05`.
- **lodge:** underwater: plum-dark like `ug`, Drip self-lit, a dotted door
  in the dome's base; cut to inside: a dry stick-walled room, four beavers
  (same rig, one with a drawn name tag CHIP), each springing up as named;
  `lo_04` nothing moves; `lo_07` back door, under the wall, the river on
  the other side.
- **home:** DripChooses' `home`/credits staging; two credit icons (valley =
  beaver face, mountain = black glossy slab with a glint; over = a little
  waterfall, lodge = stick dome); the ring on `hm_07`; held final frames.

## Build plan (one Opus scene-builder, main tree, two waves, a checkpoint report after each)
- **Wave A — spine:** `narration.mjs` (header documents the cast, the tree,
  the six variants, the TTS rules and WATCH-FORS: `in_04` five sentences at
  Sunny's shout, `rc_04` "HISSSS", `da_05`/`da_07` one-word clips, `da_03b`
  "CRACK" — check
  they are not clipped at the head, `hm_07` long shout, the two roll calls);
  `npm run narration -- --video drip-again`; `narrationManifest.ts`;
  `scenes/common.tsx` per ruling 1; `Video.tsx` with the SCRIPT for all nine
  segments as placeholders so the tree PLAYS end to end; `branching()` and
  the NEXT map; registry entry; gates: `npm run typecheck`, `npm run
  lint:hooks`, `node scripts/check-branching.mjs DripAgain` (eight paths and
  their lengths printed), a full `--scale=0.25` render, `npm run site`.
  Report → scratchpad/drip-again/waveA-report.md (path lengths, clip
  counts, anything off-brief).
- **Wave B — scenes:** every segment staged per the notes above. Still
  self-review: 6 stills per segment into scratchpad/drip-again/stills/,
  checked for: speaker has the bubble, bubble tails point at the mouth,
  nothing over a face, a held pose at every seam head and both choice
  holds, the obsidian slab visible on mountain paths' `pond` and absent on
  valley paths', the dam's two openings and the race's two orders (render
  those scenes once per `path` flavour). Gates as wave A plus a full-scale render of the whole composition.
  Report → scratchpad/drip-again/waveB-report.md with an explicit changed-
  file list. No commits.

## Build calls
*(builder appends dated rulings here; Mike overturns from this list)*

### 2026-10-18 — wave A (spine)
- **Mid-build revision absorbed.** The half-choices arrived after the first
  narration pass (cut to the seven-segment version). Narration was regenerated
  from the revised line list; unchanged lines came from cache and the
  superseded `va_*`/`mo_*`/`hm_04b`/`ch_*` clips were replaced (94 clips on
  disk, 94 in the manifest). Nothing else had been built yet.
- **Paths run 5:10–5:55, not ~3¾ minutes.** The spoken audio alone exceeds the
  table's estimates (intro 66s of speech vs 55s planned; mountain 63s vs 50s).
  Gaps and tails are at drip-fork's values or shorter. Trimming means cutting
  lines, which is Fable's call.
- **`VariantLine` is `{ keys, pick(choices) }`.** One-choice variants are built
  by `v(by, {option: key})`; `hm_04` supplies its own pair `pick`. The slot is
  sized for the longest of all keys; every key is preloaded.
- **No src/site change.** The seam engine, the end card's picks list and
  check-branching all handle two options naming the same target.
- **Intro opens on the same 16-frame silent lead** as every other segment
  (ruling 6 applied to the first segment too; harmless at frame 0).
- **The Beaver is a speaker in this video's kit**: `common.tsx` rebinds
  `Speaker`, `speakerOf`, `CHAR_BOX` (beaver 380), the geometry, `Bubbles`,
  `useEmotion` and `useLookAtSpeaker` to a cast that includes him — copies of
  the water-cycle versions with a wider cast list. Nothing in water-cycle or
  drip-fork was touched.

### 2026-10-18 — wave B (scenes)
- **One pond, drawn once, in profile** (`scenes/props.tsx` `PondWorld`): the
  dam's arrival, the dam exchange, the pond filling, the race's set piece and
  wide, `pond`, `over` and `lodge` all play on the same drawing, so both
  first branches fold into the same picture. Water flows left to right in
  every shot of the video (upstream/the mountain left, the sea right).
- **The race is front-on, not in profile.** The brief says "the slope in
  profile"; the two routes (steep bumpy chute left, winding path right) and
  the lava down the middle can only all be seen front-on, and "who is ahead"
  reads as height on the face. The set piece (`rc_hiss`) then cuts to the pond
  in profile, as briefed, and the seam into `pond` is that profile wide.
- **The volcano shows behind the pond on mountain paths only**, with its
  cooled lava trail, as part of the same path-read picture as the slab
  (`choices.where`). Valley paths see the bare shore and no mountain.
- **The lodge is in every pond shot**, including the low-water river shots on
  valley paths, so it never pops in at a seam. It is drawn low, wide, lumpy
  and lighter than the dam so the two mounds do not read as twins.
- **The Beaver's top course of sticks** is one count across the seam (one
  extra stick from the dam onward, a second added during `po_02`), so the
  wall does not change between `da_pond`/`rc_wide` and `po_shore`.
- **RIGHT valley path's log** is wedged into the wall and fades as the
  filling pond closes over it ("part of the wall now"); `pond` does not draw
  it (the brief's only `pond` path-read is the slab).
- **Every "Busy." has a bubble** (as drip-fork's `sn_07` ruling): the
  checklist requires the speaker's bubble; the stillness is kept everywhere
  else (no emotion change, `eyeLife` 0, breath off; on `lo_04` the whole room
  freezes, Drip included).
- **The CLOSED sign's five lines appear on their clauses in spoken order**
  (CLOSED / Important business / Back Tuesday / Also Tuesday / — Cloudia).
  The brief asks for "Also Tuesday" last and held; "Cloudia." is the last
  clause read, so instead "Also Tuesday" gets its own underline and a small
  held wobble. Mike can overturn to drop the signature line.
- **The Cloud Hotel's windows stay lit** while it is closed: ep 1's
  `CloudHotel` always lights them (a dark one reads as a storm cloud) and this
  build does not touch water-cycle.
- **Teeth label**: ep 1's name arrow reads "ORANGE" on "orange" and turns to
  "IRON INSIDE" on "iron". Teeth shot is a portrait on plain grass.
- **Learning cards added** (CaptionCard, no new audio): "cools slowly = ROCK" /
  "cools FAST = GLASS" over `rc_04`, and "a beaver's house = a LODGE" over
  `lo_05`. Cut them if they crowd the read.
- **`ov_04` is a new top-down river ride** (the world scrolls past Drip), then
  a cut to DripChooses' headland pull-out on `ov_05`. The headland world at
  river level reads as open sea, so it is kept for the reveal only.
- **Home credits show two icons**, by `where` and `wayOut` only (beaver face /
  obsidian slab; waterfall over a wall / stick dome), as briefed; `hm_04`'s
  four flavours are carried by the clip alone.
- **The ring's "AGAIN"**: the ring draws over the list, snaps on "It does not
  just go round", and one bright drop runs a lap of it on "It goes round
  AGAIN"; the end card lands on a held ring with a slow glow cycle.
- **New props drawn in this video** (all in `scenes/props.tsx` / `beaver.tsx`):
  the Beaver rig, sticks, logs, the dam, the lodge, the pond world, the
  valley, a tree, the volcano, the smoke ring, the obsidian slab, the steam
  column, the wild cloud, rain, direction signs, the CLOSED sign, wind
  streams, five credit icons. Nothing promoted to src/lib/kid; nothing in
  drip-fork or water-cycle was modified (no `export` was needed — everything
  restaged was already exported).
- **Variant slots leave dead air, worst on valley-LEFT.** A variant's slot is
  sized for its longest clip, so the shorter flavour leaves silence:
  `da_03a` 3.65s in a 12.28s slot = **8.6s** of silence on valley-left paths
  (staged as the Beaver lifting the same top stick, eyeing it, and putting it
  back, three times — busy — so it reads as a sight gag, not a stall).
  Smaller ones: `da_01b` +2.5s, `rc_01a` +2.5s, `hm_04a/b/d` up to +2.3s,
  `rc_03a` +1.3s, `da_02a` +1.1s. The real fix is copy: a ~8s LEFT-only
  sentence in `da_03a` (or a shorter `da_03b`). Fable's call; not changed.
- **Fix pass (2026-10-18), three staging notes from the still review.**
  1. *Dam vs lodge* (`props.tsx`, `dam.tsx`, `pond.tsx`): the dam is now a
     long low wall, not a tower — `POND.damBase` [1020, 1590], `damTop`
     [1210, 1500] (top height unchanged, so `full` and every seam number
     hold; far-face slope unchanged, so the spill and `over`'s path are the
     same), near-straight faces, a flat top, sticks laid lengthways in
     horizontal courses. The top course is still three sticks + `extraStick`
     (1, then 2 from `po_02`), so the count matches across the seam. The
     lodge is smaller and set left (`x` 735, `w` 330, `top` 588) and stands
     IN the river: `POND.low` raised 884 → 852, and `PondWorld` draws a thin
     water veil in front of the lodge at every level (0.42 opacity at low,
     0.30 full), so before the pond fills it reads as a house in the water.
     Knock-ons: `WALL_DRIP_X` 1150 → 990, `WEDGED.x` 1150 → 985, the dam
     cameras 60 px left, `POND_DRIP.x` 1110 → 1090, and pond's THROUGH sign
     x 500 → 405 so it no longer covers the moved lodge door. Still one
     `PondWorld` for dam, race, pond, over and lodge; flow left to right.
  2. *Intro night wide* (`intro.tsx`): the valley vignette is scaled ×1.45
     (centre 500, 770), its stick wall (the new wall, ×0.32) carries the
     Beaver ON TOP of it at scale 0.42 (was 0.16 beside it); the mountain is
     set back and smaller (h 560 → 450, w 900 → 740); the wind arrows retarget
     to the bigger valley and the lower peak. The hold is the same settled
     pose with both arrows.
  3. *The CRACK* (`dam.tsx`, RIGHT opening): the burst moves to the open
     grass right of the trunk (T.x + 190, baseY − 85), clear of the trunk,
     the Beaver and Drip, opens at full size and holds before fading; the
     tree lurches −14° in the first four frames of "CRACK" and then falls.
