# EP 4 — decision log (calls taken in Mike's stead, autonomous week)

One line per call: the call, the rejected alternative, reversal cost.
Mike's tweak round works from this list, top item first. Decisions already
in the bible / arc canon are not re-logged.

## TOP — needs Mike's ear/eye in tweak round

- **PIP VOICE CAST: MiniMax `Inspirational_girl`** (2026-08-08, shipped
  in-cut). 3-voice audition on her three hardest lines (stamp `co_17`,
  shouted order `a1_09`, admission `a3_53`), 9 clips ~$0.02, in
  `scratchpad/ep4_pip_audition/`. Rejected: `Lovely_Girl` (slowest,
  0.56–0.59 s/word, uniformly LOUD −19 LUFS — register says dry not loud),
  `Wise_Woman` (slow+quiet on the shout; reads mature, not six-year-old
  CEO). Winner was most clipped/brisk (0.40–0.48 s/word) at mid loudness
  (−22 to −23 LUFS). NOTE: writer-suggested Sweet_Girl_2/Abbess were
  disqualified before audition (Yellow's/Cloudia's voices —
  distinct-voice rule). Reversal: one constant + re-buy her ~60 clips,
  ~$1–2.
- **PIP BODY DESIGN — character sheet for Mike's eye:**
  `scratchpad/ep4_pip_sheet.png` (full sheet: growth states, emotions,
  lean, leaf-point, mirrored silhouettes; detail renders
  `scratchpad/ep4b1/sheet_growth.png`, `sheet_leafpoint.png`). Calls
  taken (2026-08-08, showrunner-reviewed on the sheet): five staged
  growth states (seed-in-air / planted / sprout / first-leaf / young
  plant) on script beats Sc 3/14/16/24 — capability unlocks, never a
  time-lapse; NO ARMS ever — the leaf-point + heliotropism lean ARE her
  gesture rig (`pipLean()` API, signed degrees, snap-back); the pappus
  ruff is KEPT after planting (silhouette identity survives the fluff
  folding); warm-oat seed palette (#f3ddb0, stem #5ccc63) chosen to dodge
  Sunny's gold; `skeptical` as her RESTING face (site-manager register —
  extends the ep-3 shared-rig face from reaction-only to a resting
  default, new use, flagged). Reversal: redesign + re-render, hours not
  dollars.

## Script-round calls (showrunner edit pass, 2026-08-08)

- **Accepted all 6 writer deviations** (see script.md deviations ledger),
  notably: "It is mostly him." = FIFTH firing of the series
  credit-allocation device (un-ceilinged in bible, count flagged);
  new final beat `rc_24` "Send it here. I will grade it."; greeting
  button "Good crew."
- **Split `a3_75`** "Annoyingly, / that is completely true." into two
  kokoro clips + 24f held beat (the ep-1 echo earns a real hang; comma
  read rejected). Reversal: free.
- **Cache migrations approved**: Drip entrance from sky-blue (REQUIRED,
  the identical-take joke), Puff catch-phrase from wind (RECOMMENDED,
  sidesteps the "FEEL" caps fresh-draw risk). Reversal: re-buy, cents.

## Story calls

- **Slug `plants`** over `photosynthesis`/`seed` — matches short-topic
  pattern (water-cycle, wind, sky-blue). Reversal after registration:
  annoying renames across Root/registry/manifests; effectively locked once
  narration generates.
- **Hero cannot move once planted** (quest conducted from one spot) over a
  travelling-seed quest — honest botany + fresh comedy shape vs three prior
  travelling heroes. Reversal cost before script: zero; after: structural
  rewrite.
- **Working hero name "Pip"** pending treatment round counter-proposals.
  Reversal before TTS: free.
- **Lean SAVE Sunny's banked wake-claim ("OH! That one is me as well!") for
  ep-5 cold open**; ep-4 volcano stir stays wordless unless a treatment
  argues it in. Final call at synthesis. Reversal: script edit + 1 kokoro
  line (free) any time before ep 5.

## B2 plate acceptance (showrunner reboot 2, 2026-08-08)

- **GOLDEN-HOUR PLATE CUT** after five failed rolls (value rung kept
  collapsing onto day's or sunset's, or the roll went photoreal / grew a
  farmhouse on the load-bearing bare horizon — autopsy comment sits at the
  `meadow_golden` slot in backgrounds.mjs). Scenes 22/23/28 use
  `meadow_day` + a comp-level warm grade (target meanLum ≈ 140; note in
  `PLATES`, scenes/common.tsx). Reversal: re-add the key, cents.
- **Old tree painted → SVG** (builder-flagged deviation from
  ep4-plate-design.md, showrunner ACCEPTED): design put the painted oak
  frame-left, but the volcano seats at x=336 frame-left, and Scene 20's
  camera push cannot survive a 1344-wide painted tree. The design's own
  fallback (drawn `OldTree` at x=1588 on bare-edge plates) is what shipped.
- **Plate seating table is canon** (`PLATES` in scenes/common.tsx): per-key
  skyline fraction + seat scale; sunset (21% h-crop) and rain (11%) crop
  safely — band skies, nothing composed in their corners.
- **Accepted with notes** (full list at the bottom of backgrounds.mjs):
  morning measures a value step ABOVE day (design said below; reads right
  on screen); morning's third cloud sits high left-of-centre near the
  bubble zone; dusk's field darker than night's (end-card silhouette
  scene); aerial is an elevated wide (~55% sky) not the three-quarter-sky
  extreme aerial — `MeadowWorld` lift sells the title altitude; dawn has a
  ~10px horizon speck at x≈0.46 (volcano stands at x=336); grass_close is
  crisper vector than the soft wides (close-scale grammar; cream top =
  clean bubble zone). Reversal for any: prompt edit + re-roll, cents.
- **Re-rolled to acceptance** (vs the set the dead reviewer flagged):
  aerial (yellow crop checkerboard → continuous green meadow), rain (fence
  + farm rolls rejected; misty silver take accepted), dawn (flat-vector
  and wrong-palette rolls rejected; gold-band/blue-hills take accepted),
  grass_close (orange 3D-render → matte flat cocoa brown), sunrise's
  second roll accepted as-is, sunset accepted on seat-by-crop.

## B3 audit rulings (showrunner reboot 3 after mid-batch kill, 2026-08-08)

Full audit of the four dead builders' act files: `scratchpad/
ep4b3_audit_act12.md` (+ act3/recap counterpart). Calls taken on its
escalations:

- **s10|s11 boundary: Sunny stays in s11's sky** (ambient, his act-1 mark,
  no lines) — a daylight sky may not lose its sun at a hard cut; Ray may
  vanish (time-cut film grammar, script-faithful cast). Reversal: trivial.
- **s06 order board persists through the close** — a posted work order
  stays posted; the dead builder had it vanish for 242 frames. Reversal:
  trivial.
- **"Sorry, fence!" gets a keyed fence bounce** inside `a1_37`'s window
  (audit found the gag left to chance). Ray's late-catching Cheshire face
  staged once on the s07 arrival (scripted tic, was unstaged). Reversal:
  trivial.
- **Ratified in place:** s11 on `meadow_day` (the plate-design table's
  `sky_cloud_level` row is wrong, not the code); s12a no-volcano (no-horizon
  shot exemption); Sunny ambient in s09; act1's dawn-plate flip; Drip's
  stem-face substitution (s15). All flagged in-code by the builders/audit.
- **OldTree promotion DEFERRED to the kit-cleanup pass** (three copies,
  three palettes — mid-wave shared-file surgery declined); act1/act2
  palettes aligned to one rule now.
- P0 defects fixed per audit prescription (Ray −62° parked bank → clamped
  travel bank + RAY_STOOP landing; Sunny restored frame-right in s15 +
  lean sign flipped; act2's five unfrozen held beats frozen to act1's
  `held` pattern).

Act3/recap audit rulings (same session, `scratchpad/
ep4b3_audit_act3recap.md` + repair brief `ep4b3_repair3r_brief.md`):

- **Golden hour: act3's filter-chain grade is canon** (measures the target
  ~140 warm); recap s28's cool blend-layer version replaced with it. The
  script treats 22/23/28 as one hour. Reversal: re-grade, free.
- **s28|s29 is a motivated time cut, not continuous** — Pip's two scales
  both kept (s29 crown-into-ember justification stands); header claim
  rewritten. Reversal: free.
- **Held-beat purity enforced everywhere** (audit found emotion/look/lean
  changes starting inside five holds incl. the break and the s26
  resolution): reactions land ON the boundary frame, then dead still.
  "The realisation is the beat" staging rejected in favour of the script's
  own words ("nothing starts inside it").
- **Sprout-row canon = act2 Scene 15's marks** (plants cannot move): recap
  s29's drifted row moved back onto them; row ADDED to s24/s26/s28 wides
  (script sells the growth spurt and "taller than the sprout row" against
  it; it was missing from all three).
- **s20 push reframed** (~1.35 not 1.66): the mind-blower's picture is the
  enormous tree, not the cast sliced at the neck and the volcano off frame.
- **Drawn-caps additions sanctioned** (five bubbles beyond the script's
  three enumerated drawn/spoken disagreements — emphasis-consistent, kept,
  logged). Two 7-word bubbles trimmed to <=6.
- **Ratified as staged:** s21 grass_close cutaway (plate-design table row
  stale, annotated); s27 Pip off-mark (recap-world licence, ep-3
  precedent); panel bow order; Sunny frame-right in act3.
- **Pip pointer rig DEFERRED to a follow-up batch**: `POINT_CEILING` 14°
  means the leaf-point barely reads (s23's "turns her leaf up at the Sun"
  is effectively invisible — audit M-A5). Fix belongs in Pip.tsx (shared),
  so it waits until both repair builders land, then one small batch +
  targeted re-stills (incl. act2 s16's point). Until then all points ramp
  within 14°.
- **Repair verification rulings (reboot 4, 2026-08-09,
  `scratchpad/ep4b3_verify_act12.md`):** (a) s13's two in-hold Drip
  emotion changes STAND — script.md Scene 13 itself stages "Drip decides,
  visibly" inside the 36f beat; the act3/recap purity ruling bars
  unscripted business only, so acts 2 and 3 agree once the exception is
  read as scripted (N-03). (b) s16 Ray's arc over the cutaway RATIFIED —
  still f15060 shows him in the clear cream gap between the giant grass
  clumps; close-grass scale sells him as distant (W-A2-12). Reversal:
  restage, trivial.
- **Pointer fix design (reboot 4, 2026-08-09): elbow morph above 14°**
  (brief `scratchpad/ep4b3_pointer_brief.md`) — two-segment leaf that
  clears the pod rim laterally then rises, engaging only past the old
  ceiling so every already-staged pose in the ≤14° band stays
  byte-identical by construction; act3 POINT_CEILING → 56 so s23's Sun aim
  reads. Rejected: drawing the pointer OVER the pod (leaf across the face
  on a face-dominant body); lowering the node with a longer straight leaf
  (changes rest silhouette in every staged scene). Reversal: revert
  Pip.tsx + ceiling, free.
- **Pointer batch LANDED + ratified (2026-08-09):** all 7 builder
  deviations accepted — POINT_HELD=14 decoupled from POINT_CEILING=56
  (prevents silent re-posing of s17/19/21/24), elbow joint below the pod
  (measured better than the brief's lateral-clearance sketch: tip rise
  107 vs 78), bent blade slimmed 30%, raised pointer over the cotyledons
  when bent, SunWash `spread` prop, s16's 78° saturating at the rig's
  honest 61.1° limit. s16 unlock + s23 Sun-aim verified on stills — the
  aim reads via lean + eyes + lift. Rig limit "raised toward, not
  pointing at" ACCEPTED for this cut (real fixes = lower pointer node or
  leaf-over-pod, both rejected above); leafAt ignoring lean noted for
  retro. Recap M-R1 closed: full-res f26209/26800/27282/27283 all pass
  (chant cards, warm s28 grade matching act3, motivated s28|s29 dusk
  cut).

## Wave-B staging calls (showrunner reboot session, 2026-08-08)

- **Plate design** (`ep4-plate-design.md`, ~13 keys): old tree painted,
  frame-LEFT in every wide (keeps bubble stack over centre-Pip clear);
  volcano NOT painted — bare painted horizon + promoted `SleepingVolcano`
  SVG on the measured horizon (Scene-13 steam curl must anchor to the
  summit, flux can't place a summit repeatably); no painted sun/moon
  discs anywhere (Sunny, moon, beams are SVG geometry). Reversal: prompt
  edits + re-roll, cents.

## Synthesis calls (2026-08-08, treatments A+B → ep4-synthesis.md)

- **B's structure is the spine** (light hired in Act 1 but only usable
  after water→germination→leaf) over A's cook-per-act — A sprouted the
  seed before any water arrived, a botany bug. Reversal: full re-outline.
- **Title "Pip and the Sunshine Kitchen"** over A's "World's Biggest
  Kitchen" / B's "Biggest Thing in the World". Reversal: free until art.
- **Grafted A's "It will do." stamp chain** as the spine gag, re-aimed:
  break line "It will not do." at the one-crumb-of-sugar scene (plot-
  causal — the failed grade forces the Sunny hire), resolution firing
  aimed at the Sun as the button. Alternative rejected: A's silent empty
  fifth slot. Reversal: script edit + 1 clip.
- **Admission = B's hire staging + A's "he is the oven" promotion; A's
  "...Thank you." cut** (the S25 stamp is the thank-you; register stays
  unbroken). Reversal: 1-2 lines.
- **NEW CANON, needs Mike's ear: Ray's vindication tic "That is also
  true."** (3-firing sameAs chain) — new construction for an existing
  character. Reversal: cut 3 aliased firings, cents.
- **Volcano stir = B's staging** (steam curl where rain crosses the
  summit, ~2s, wordless) over A's silhouette-swell + smoke. All banked
  Sunny volcano claims stay banked. Reversal: staging edit, free.
- **Roll-call greeting in the cold open mid-air** (A) — fills B's thin
  Act 1; **goodbye = B's** "Nobody was going anywhere." / "See you
  tomorrow." B's Act-2 greeting placement rejected. Names merged:
  Pipsqueak, Pipley, other Pip, Pippa, Pip the third.
- **"Different show" fires twice** (beam/weather), Puff skip ruled in (his
  catch-phrase IS his entrance; an invisible character can't be pointed
  at). A's third firing rejected.
- **Cloudia one-scene checkout cameo kept** (marked cuttable). Blue's
  copies NOT used this episode (reply budget spent on central engines).
- **Five-voice PHOTOSYNTHESIS syllable chant approved** (one syllable per
  hero) with Narrator-led fallback if production fights it.
