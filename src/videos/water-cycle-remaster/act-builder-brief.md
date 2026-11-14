# Act-builder brief — `DripWaterCycleRemaster` (read AFTER docs/roles/scene-builder.md)

Read, in order: docs/roles/scene-builder.md → docs/ANIMATION-ROADMAP.md
"Step 2 — the LOOK PACKAGE" (spec + LOOK bible + rubric) → brief.md (§3
planes, §4 light script, §7 scope guards) → shot-plan.md (YOUR act's rows +
the rulings at the end) → remaster-decision-log.md TOP section →
scratchpad/remaster/kit-report.md (the kit's real export names, both
iterations, the cost findings) → scratchpad/remaster/paintdemo-review.md
(what the fork saw; the ACT notes at the end are yours to apply) → the ep-1
originals for your act in src/videos/water-cycle/scenes/<act>.tsx (the beats
you re-picture; copy nothing that renders flat).

## Structure (mirror ep 1's layout in the new dir)

- `Video.tsx` — the 36-scene SCRIPT table copied from ep 1 (same ids, same
  line keys, same tailFrames; the remaster must time identically), wrapped in
  `<Post time={…}>` per scene's time-of-day band; exports `DripWaterCycleRemaster`
  component, `timeline()`, FPS/WIDTH/HEIGHT. The skeleton builder writes it;
  act builders only touch their own `scenes/<act>.tsx`.
- `scenes/common.tsx` — the shared remaster kit: speaker plumbing (copy from
  ep 1), `LightRig` per scene from brief §4 as a table `LIGHT[sceneId]`,
  the `World`/`Plane` stack per location from brief §3 as `SETS[location]`,
  `Bubbles` (reuse ep 1's; obey the shot plan's bubble column — never over a
  sign, a face or the key light).
- `scenes/{coldOpen,act1,act2,act3,recap}.tsx` — one file per act, exporting
  `Record<sceneId, React.FC<{scene}>>`. Zero merge conflicts by design: a
  builder owns exactly one act file (+ its plates in backgrounds.mjs under a
  commented block headed with the act name).
- `backgrounds.mjs` — one prompt PER PLANE (`<location>_<plane>` keys), the
  series gouache style anchor (copy from src/videos/storm/backgrounds.mjs),
  far planes prompted soft/hazy (planes are PRE-BLURRED by prompt — live
  plane blur costs +30 s/10 s and is banned; `Plane flat`). Generate with
  `npm run backgrounds -- --video water-cycle-remaster` (needs the token,
  cents). Non-sky planes: prompt a flat-key-colour background and key it, or
  paint a horizon cut that the plane above covers. Commit the webp.

## Kit usage (names from kit-report.md)

Characters: `<Drip paint={…} />`, `<Sunny paint={…} />`, `<Cloudia paint={…} />`
with `PaintOpts { light: LightRig, boilKey, ground?… }` — never the flat
path in this episode. `CastShade`/`GroundShadow`/`LightPool` from `light/`;
`World`/`Plane` from `world/`; `holdCreep`/`burst` from `camera/grammar`
composed onto ep 1's `Cam`; `Post time="day"|"interior"|"night"` once per
scene; `ribbon()` for any new prop outline (uniform `stroke=` only < 2 px);
`PaintFill` for any new prop fill — no gradients, no specular shines, no
#fff (paper cream #f3ead8 is the ceiling). Faces stay outside filters (the
paint path does this for you; keep it that way for new props with text).

## Per-scene checklist (the fork scores V1–V8 on your stills)

1. Light row applied (`LIGHT[id]`); ground shadow under every standing body
   (absent only in s21); shadow detaches/shrinks when hovering.
2. ≥ 3 planes read; far plane lifted + soft; characters on depth 1.0.
3. Camera verb from the shot plan, pinned to the line key/word given; holds
   creep; no move while a bubble is up; dutch only where the plan says.
4. Big Words: `BigWordBeat`/`CutFlash` as ep 1, push-in 1.00→1.06 over 24 f,
   tilt 0°.
5. Run `python3 scratchpad/remaster/verify.py --band <day|interior|night>`
   on each scene still; every row IN before you call the scene done.
6. Render + Read your own stills (contact sheet, strip, 3 crops at 100%) at
   `--scale=0.5` or 1 — never judge paint at 0.25.

## Gates per act (before hand-back)

`npm run typecheck`; `npm run lint:hooks`; your act's scenes rendered every
frame at `--scale=0.25` (`--frames=<start>-<end>`) EXIT 0 with zero bubble
warnings; verify.py table in your act report `scratchpad/remaster/<act>-report.md`
with the still paths for the fork review; list every changed path. No commits.

## ACT notes from the kit-gate fork (apply everywhere)

1. Light pools carry the interiors: a lamp or Sunny pool in every hotel
   scene, tinting Drip inside it.
2. Every SVG set-piece gets PaintFill + ribbon — never a plain fill or a
   uniform stroke (the only AI-cheap tells left were on props).
3. Real PRE-BLURRED plates per plane (never live plane blur), far planes
   lifted and desaturated, so three planes read — the biggest remaining
   score gain (V4 7 → 8–9). Centred eye-level framing scored V5 = 6: use the
   shot plan's creeps, bursts and tilts.
4. Act 1's first task (KIT-minor): route Drip's arm and foot paths through
   PaintFill + ribbon like the body (edit `paint/PaintedCast.tsx` only).
