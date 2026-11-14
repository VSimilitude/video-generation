# Drip's Big Adventure — REMASTER decision log (TOP-first; newest entry at the top)

Campaign: look-package, autonomous mode (Mike's rulings in docs/HANDOFF.md are
final). Every creative/technical call the showrunner made without Mike is
listed here so he can overturn from the list after judging the deployed tile.
Composition `DripWaterCycleRemaster`, slug `water-cycle-remaster`. The
original `DripWaterCycle` (src/videos/water-cycle) is untouched.

## 2026-11-14 — act 1 review (scratchpad/remaster/act1-review.md)

- **D25 Act 1 = ACCEPT WITH FIXES.** Fork: s01–s04, s10 PASS (7.5–7.6); s05–s09,
  s11 marginal/FAIL on V4/V3/V5/V8 — same Drip/Sunny, soft gouache, nothing
  ink-on-3D; bubbles and the Big Word card read. FIX-NOW before commit: F1
  roll exposes the frame edge (SetStack `bleed` 0.25–0.35 whenever the cam
  rolls — now a brief rule); F2 `ocean_far_morning` top edge reads as a city
  skyline (re-roll or feather the top 6–8%); F3 s08 `everywhere_puddle` insert
  is photoreal (re-roll with the anchor enforced; inspect lake/paddy/dogbowl);
  F4 s01 foam cape reads as a seashell; F5 s06 Sunny bloom too faint + smooth
  digital sky. LATER polish (after acts 2–3): L1–L7 in the review.
  **Bands bent (bible footnote):** day saturation-mean floor 0.32 for
  ocean/sky-dominated frames (0.38 stays for interiors/valley); p2 ≤ 0.30
  for sky-only frames; hue-bin ceiling 8 for gradient-sky frames; the shared
  BigWord highlight block's 0.58% white accepted for this episode; s02's
  high-key title card accepted.

## 2026-11-14 — act scheduling

- **D22 Act 3 builds in the MAIN tree beside act 1's uncommitted work.** Act 1
  added `horizons`/`bleed` to SetStack and `bright`/`sat` plate trims that act 3
  needs; a worktree off c82f560 would lack them. Act 2 is isolated in its own
  worktree (file-disjoint: act2.tsx only). Ownership stays strictly by file
  (act3.tsx/act3kit.tsx/its plate block vs act1.tsx/act1kit.tsx), so concurrent
  edits cannot collide; common.tsx is frozen until act 1 is committed.

## 2026-11-14 — skeleton build (Video.tsx, common.tsx, plates)

- **D17 Plane keying = flat key colour, keyed OFFLINE.** Every non-sky plane
  plate is prompted on a flat key colour and keyed by
  `src/videos/water-cycle-remaster/key-plates.mjs` (sharp, deterministic,
  free) into `public/backgrounds/water-cycle-remaster/keyed/<key>.webp` with
  real alpha; scenes load `plateManifest.ts` (generated) via `<Plate>` /
  `<SetStack>`. Key colour per plate: magenta #ff00ff (default), green #00ff00
  for the sunset "home" set (its purples sit near magenta), black = luma key
  for translucent layers (mist, rain, spray). The keyer measures K from the
  plate (brush-textured keys still key), ramps alpha by RGB distance, UNMIXES
  the edge colour (O = K + (C−K)/α) and despills, then BAKES the Step-2
  atmosphere by depth (far: sat ×0.7 + 1.5 px blur; mid ×0.9; fg brightness
  ×0.92 + 2.5 px blur, premultiplied) so `<Plane flat>` is exact with zero live
  filter cost. Rejected: a painted horizon cut (needs straight horizons —
  fails for the hotel bulk, reeds, headland rock) and a live SVG chroma
  filter (per-frame cost, the +30 s/10 s class the kit report banned).
- **D18 Post lives in Video.tsx, once per scene.** `<Post time={TIME[id]}
  skyRamp={SKY_RAMP.has(id)}>` wraps every scene (staged or placeholder), so
  bands can't drift per builder. Scenes never mount a second Post; key-light
  bloom is `<KeyBloom>` in common.tsx (Post's bloom maths, drawn inside the
  scene — it is graded with the scene, a ≤8% saturation difference).
- **D23 s08 whip tour mapping (act-1 builder).** a1_19 is "Every ocean! /
  Every lake! / Every puddle! / Every single day! HA! HA!". Chunk 1 "Every
  ocean!" plays ON the ocean (its move = a BURST pull-out from the Drip
  close-up); chunks 2–4 each follow a 26 px whip BURST to the lake, the puddle
  and the dog bowl plates, so every insert matches its word. The paddy plate
  is unused. Four chunks, four moves, as D12 Q2 asked.
- **D24 Plate value trims (act-1 builder).** The flux plates are high-key
  (day stills measured lum 0.65–0.73, p2 0.3–0.4). Fixes are BAKED, not live:
  `bright`/`sat` fields in backgrounds.mjs (key-plates.mjs applies them, sky
  plates included), a multiply `Zenith` gradient in day skies, and a dark
  foreground swell (`FgSwell`, the 1.3 plane) for the scene's darkest value.
  The morning ocean drops its near plate (its foam keyed out brown with pink
  specks); `FgSwell` is the near/foreground there.
- **D19 Seams.** Video.tsx dissolves each scene in over `SEAM[id]` frames
  (6–8; 0 for s01 and the four Big Word freezes, which continue the previous
  frozen world) with the outgoing scene drawn N frames past its end
  underneath. Scene start frames and every DialogueAudio are exactly the
  Series timing of ep 1's SCRIPT — the timeline does not move.
- **D20 Post band per scene** (TIME in common.tsx): night = s01, s03, s04 (pre-dawn,
  dawn; s02's sunrise title card moved to day in act-1 build — it is a sunrise picture) and s33–s36 (evening/night recap); interior = s14–s23
  (cloud interior, grey hotel, rain overcast); day = the rest, incl. s13
  (exterior noon) and the sunset s29–s32. 8 scenes in the night band (bible:
  ≥ 3 below lum 0.40).

## 2026-11-14 — D13 re-gate (whisper-gate.md "Re-gate (D13)")

- **D21 Ship the four D13 clips as generated; ear calls go to Mike.** Both
  Big Words now arrive as the intended syllables (prompted Whisper: "Ee, vap,
  oh, ray, shun." / "Pre, sip, ih, tay, shun. Whee!"); the first-pass defects
  are gone. Open to the ear, with the lever named: a1_25 is 4.72 s and a3_08
  5.29 s (~0.6 s per isolated syllable) — if it reads as a spelling drill the
  lever is fewer markers (`Ee-vap <#0.2#> oh <#0.2#> RAY-shun!`) or `speed`,
  not wording; a3_04's "Whee!" was heard "Wait!" unprompted (rc_04's
  identical "Whee!" was perfect) — re-roll identical text before any
  reword; rc_04's fresh draw's "PRECIPITATION!" came back "Grecipitation" —
  listen to the plosive, re-roll if real.

## 2026-11-14 — kit gate PASSED

- **D16 Kit gate PASS (iteration 2).** Fork re-score: a 7.6, b 7.6, c 7.5;
  every V1–V8 at or above threshold; bands 9/9 IN; no regressions; rim
  direction confirmed correct (the first "inverted" call was an invisible
  rim). No kit-blocking fixes. KIT-minor carried into act 1's first task:
  Drip's arms and feet go through PaintFill + ribbon like the body. V5 = 6
  everywhere is the demo's centred framing — the shot plan fixes it. Ruling:
  proceed to acts; the painted medium is adopted for this episode. Adoption
  for ep 7+ (STYLE.md "Medium") waits for Mike's verdict on the tile.

## 2026-11-14 — kit gate (PaintDemo)

- **D15 Site shell.** `scripts/build-site.mjs` did not copy `public/kit/`;
  the orchestrator added the one-line copy (262f957).
- **D14 Kit gate = ITERATE, not STOP.** Fork scores (scratchpad/remaster/
  paintdemo-review.md): painted beats flat on all three stills (means
  a 4.9→7.5, b 4.8→7.6, c 4.9→7.3); b PASSES; a fails V3 (6) and c fails V8
  (7, mean 7.3) on light mechanisms only; numeric bands 9/9 IN. "Painted
  reads clearly better, not muddier; faces crisp at phone size." Builder 1
  resumed for five fixes (shade/rim visibility, ground-shadow alpha on dark
  grounds, c's wall slab + window daylight, b's sky dullness + uniform
  horizon strokes + bloom, a's hard glow disc + hero saturation). Not a Mike
  decision: painted is not worse than flat. Builder's spec deviations
  accepted: ink-only boil (1 octave, 3 px — full-group boil cost +25 s/10 s),
  cast-shade offset scaled to body size, rim stronger at low key, CSS
  grade/bloom layers, planes must use PRE-BLURRED plates (live plane blur
  +30 s/10 s). Cost 2.5× at scale 1 (at budget; bimodal box), 1.8× at 0.25.

## 2026-11-14 — Whisper gate (scratchpad/remaster/whisper-gate.md: 60 clips, 49 PASS, 11 CHECK)

- **D13 Four per-engine respellings in `narration.mjs` (script.md untouched):**
  a1_25 "Ee-vap-oh-RAY-shun!" → pause-marker syllables (Whisper heard "Uh,
  what oration?" — the Big Word must be intelligible); a3_08 likewise +
  "WHEEE!" → "Whee!"; a3_04 "Ohhhh nooooo. WHEEE!" → "Oh, no. <#0.4#> Whee!"
  (letter-stretch is kokoro-only per STYLE; the pause carries the drama);
  rc_04 "WHEEE!" → "Whee!" so all three Whee reads match. Cloudia 13/13
  PASS. No change for metric artefacts (co_04 I've, a1_06/07 slosh→slush,
  a2_14 slow, a3_06/rc_10 fast excited) nor a2_17 "dust speck"→"Dustbeck".
  **Ear-pending for Mike:** a2_02 "warm drop" (heard "warm giraffe"), a3_24
  "standing", a3_33 "Dripley", a2_17 "speck", a3_06/rc_10 pace. Spend:
  Whisper ≈ 6–10 cents, MiniMax ≈ 31 cents + 2 cents for the four re-rolls.

## 2026-11-14 — shot plan rulings

- **D12 Shot-plan open questions ruled** (full text at the end of
  `shot-plan.md`): s04 keeps its two jump-cuts (the cut is the gag — logged
  exception); s08 splits a1_19 into four screen-locked bubble chunks popping
  after each whip; s12 rises in three stepped bursts, not one continuous
  follow; s28/s35 inserts are single vignette plates with dissolves (s35
  ripple wipes); s29 gains a 1.3-plane near-headland plate for the reveal;
  s33 uses one shared evening key. Camera budget per the draft: holds ≈ 93%
  (≥ 70% rule), 5 dutch scenes (≤ 6), 4 Big Word push-ins, key switches
  camera-right → camera-left at s24 and Sunny re-enters left at s31.

## 2026-11-14 — engineering calls after the research memo (scratchpad/remaster/ref-method-memo.md)

- **D11 Verifier environment.** Pillow 12.2 is present (user site — run
  python3 WITHOUT -I), numpy is not (PEP 668). `verify.py` is written on
  Pillow + pure python (or node + sharp, the fork's `stats.mjs` seed); no venv.
  ffmpeg lives at node_modules/@remotion/compositor-linux-x64-gnu/ (no webp).
- **D10 Grain.** The reference measures no grain (it is 3D); gouache wants
  paper visible, so the LOOK bible keeps the paper plate at multiply 0.18 +
  soft-light 0.10 by day (memo's single multiply ~0.3 is the alternative if
  the fork says the paper is too faint at 1080p). No procedural grain.
- **D9 Boil and PaintDemo judgement scale.** Per-character SVG
  feTurbulence (2 octaves, bf 0.02) + feDisplacementMap, scale starting at
  5 px (memo) and tuned down toward the bible's 2.5 px if lines crawl too
  much; `color-interpolation-filters: sRGB`, padded userSpaceOnUse filter
  region; seed = floor(frame/3). Est. 1.3–2× render time. Still judgement
  of the medium happens at `--scale ≥ 0.5` only; 0.25 renders are for the
  every-frame gate, not for looking at the paint.
- **D8 Remotion primitives.** Stay on 4.0.498. `@remotion/effects`
  (4.0.537+) renders through WebGL/WebGPU shaders on an HTML-in-canvas path
  (Chrome ≥ 149 + flag, --gl=swangle here) that cannot run inside the
  `@remotion/player` gallery on iPhone — REJECTED for the medium. An upgrade
  to 4.0.543 is low-risk per the memo but has no payoff now; revisit only
  if a later need appears (re-test premount, Player audio tag, Chrome 158).
  Tapered strokes = `perfect-freehand` 1.2.3 (deterministic, 4.5 kB);
  `roughjs` 4.6.6 only for seeded hachure on props, if ever. Multi-plane =
  2D parallax planes (k 0.15 / 0.5 / 1.0 / 1.4, ~1.1–1.3× cost);
  `@remotion/three` ≈ 10–30× on this GPU-less WSL2 box — rejected.
  Reference camera numbers adopted into the bible: every hold creeps
  0.15–0.35 %/frame, glides 18–40 f, rolls ≤ 4–4.6°, 6–8 f crossfades,
  blink gap 0.5–2.3 s with a 4-frame half/shut/shut/half and a blink
  across every expression swap.

## 2026-11-14 — boot wave (A+B+C)

- **D7 Gallery tile.** Registered as a separate hidden-until-ready entry in
  `src/site/registry.ts` with the title "Drip's Big Adventure (Remaster)"; the
  original tile stays. Builders add the entry with a minimal diff at the end
  of wave D.
- **D6 Flower and moose: NOT recast.** Checked the ep-1 script: neither has a
  line of its own. The Narrator *quotes* them (a3_19 "A flower leaned over and
  drank a bit of him. Slurp.", a3_23 "The moose said, and I am quoting
  exactly, mmm. Nice water. I live here now."). The bible's cameo row says
  "if either RETURNS with a line, it gets its own voice" — a remaster is not a
  return and there is no line to recast. Splitting the quote out of the
  Narrator's clip would also break the byte-identical Narrator rule. So the
  Narrator keeps the cameos, exactly as in ep 1. (Correction to the campaign
  brief, which assumed the cameos were in Drip's voice: they were not.)
- **D5 Narrator + Sunny clips reused byte-identically** by seeding
  `public/narration/water-cycle-remaster/.cache.json` with the 65 original
  cache entries and copying the 65 mp3s (cmp-verified). The generator sees
  hash + file present and skips them; `sameAs` cannot cross slugs, so this is
  the supported route (per-line content hash is unchanged for kokoro lines).
- **D4 Casting.** Drip = minimax `Lively_Girl`, emotion `happy`, speed 1.0
  (bible, locked since ep 2). Cloudia = minimax `Abbess`, emotion `auto`,
  speed 1.0 (bible, locked since ep 2; `auto` as in ep 6). Sound-word audit
  for the engine switch (STYLE: letter-stretch is kokoro-only): Drip's
  "WHEEE!", "Aaaah! WHOOSH!" lines are the risk — Whisper-gated after
  generation; any failing clip gets a per-line respelling logged here, never a
  text change visible in script.md.
- **D3 Slug and id.** `water-cycle-remaster` / `DripWaterCycleRemaster`,
  title "Drip's Big Adventure (Remaster)". Reads as the remaster in the
  gallery, cannot collide with any existing id.
- **D2 Ep 1 has NO painted plates** (public/backgrounds has no water-cycle
  dir — the whole episode is vector). The remaster gets `backgrounds.mjs`
  plates generated as depth-separated planes (sky / far / mid / near-ground)
  per location so the multi-plane world (gap 4) is real parallax, not a flat
  plate. Plates are scenery only; anything touched stays SVG (STYLE rule).
- **D1 Art direction.** Soft gouache storybook stays (July 2026 ruling). The
  reference repo contributes METHOD only: measured bible, post chain, camera
  grammar, lighting that reaches the characters, scored verifier. No ink-on-3D
  look, no black outlines on 3D geometry, no saturated-primaries palette.
