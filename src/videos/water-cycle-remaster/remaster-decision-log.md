# Drip's Big Adventure — REMASTER decision log (TOP-first; newest entry at the top)

Campaign: look-package, autonomous mode (Mike's rulings in docs/HANDOFF.md are
final). Every creative/technical call the showrunner made without Mike is
listed here so he can overturn from the list after judging the deployed tile.
Composition `DripWaterCycleRemaster`, slug `water-cycle-remaster`. The
original `DripWaterCycle` (src/videos/water-cycle) is untouched.

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
