# Drip's Big Adventure — REMASTER brief (`DripWaterCycleRemaster`, slug `water-cycle-remaster`)

Status 2026-11-14: Wave 1 (A+B+C) — this brief, the decision log, narration.
Owner: showrunner (autonomous mode). Decisions: `remaster-decision-log.md`
(TOP-first). Look-package spec and the numeric LOOK bible + verifier rubric:
`docs/ANIMATION-ROADMAP.md` Step 2 — this brief does NOT repeat the numbers;
builders read Step 2 first, then this file, then `docs/roles/scene-builder.md`.

## 1. What this is

A from-scratch re-animation of episode 1 (`DripWaterCycle`,
src/videos/water-cycle, 36 scenes, 125 clips) as a NEW composition, built
on the look package, deployed as a separate gallery tile so Mike can judge
the look against the original. Script text is verbatim (`script.md` of ep 1
is the screenplay; this dir's `narration.mjs` is the same 125 lines). The
story, gags, timing-by-audio and scene order do not change. What changes is
every PICTURE: medium, camera, light, depth, and a measured bar.

Non-goals: no new jokes, no copy changes, no sound pass, no touching
episodes 1–6 or the CYOAs, no change to how `src/lib/kid/` renders for them
(kit additions are additive and opt-in).

## 2. Voices (done, Wave 1)

| Speaker | Ep 1 | Remaster | Clips |
|---|---|---|---|
| Narrator | kokoro af_heart 1.0 | SAME FILES | 52 byte-copied + cache-seeded |
| Sunny | kokoro am_puck 1.0 | SAME FILES | 13 byte-copied + cache-seeded |
| Drip | kokoro af_bella 1.1 | minimax `Lively_Girl` happy 1.0 | re-synthesised |
| Cloudia | kokoro bf_emma 1.0 | minimax `Abbess` auto 1.0 | re-synthesised |
| Flower, Moose | Narrator quotes them | unchanged (D6) | in the Narrator's clips |

Whisper gate report: `scratchpad/remaster/whisper-gate.md`. Any respelling
is per-engine and logged in the decision log; `script.md` text never changes.

## 3. The world, in planes

Ep 1 was 100% vector on gradient skies. The remaster builds every location
as a multi-plane set: committed gouache plates (`backgrounds.mjs`, flux-schnell,
one prompt per PLANE, with the series style anchor) stacked as depth layers
the camera parallaxes, plus SVG set-pieces on the planes that need to be
touched (hotel balcony, riverbank, flower, moose). Plane recipe per location:

| Location (scenes) | sky plane (∞) | far plane (0.15) | mid plane (0.4) | near/ground (1.0) | foreground (1.3) |
|---|---|---|---|---|---|
| Open ocean (1,3,4,5,7,8,9) | dawn→morning sky | distant swell line, haze | wave band (SVG WaterBand on a painted base) | foreground wave crests | spray flecks |
| Sunny's sky (6,11) | sky gradient plane | thin cloud streaks | — | Sunny's disc is a character, not a plane | — |
| Up through the layers (12) | sky darkening with altitude | wisps | wisps | Drip | — |
| Cloud Hotel exterior/interior (13–21) | sky above the cloud deck | other clouds | hotel bulk (plate) | balcony/desk SVG where touched | mist wisps |
| The slide + fall (22,23) | rain sky | rain curtain far | rain curtain mid | Drip | rain streaks near |
| River valley (24–28) | afternoon sky | hills + treeline | riverbank + the moose's reeds | river surface, flower, moose | grass blades |
| Home / sea again (29–32) | sunset sky | headland | sea | shore foam | near headland rock (s29 reveal, D12) |
| Inserts (28 montage, 35 stops) | per stop sky | — | — | single vignette ground plate | — |
| Recap (33–36) | paper card | — | — | ring diagram SVG | — |

Rules: plates are scenery only (STYLE); the camera is the ONLY thing that
moves a plane (parallax factor = the number in the header); far planes get
atmospheric lift + desaturation per the LOOK bible; characters sit on the
near/ground plane and cast a ground shadow onto it.

## 4. Light script (time of day drives key direction, colour and contrast)

Sunny IS the key light whenever he is on screen: the key vector points from
his disc; when he is off screen the key still comes from where he last was.

| Scenes | Time | Key (dir, colour) | Shadow colour | Contrast | Notes |
|---|---|---|---|---|---|
| 1 | pre-dawn | low horizon camera-right, rose | indigo | low | rim light only on Drip; sky holds the hue; stars fading |
| 2 | — | card | — | — | paper card, grain visible |
| 3–4 | dawn | low right, gold | violet-blue | medium | long shadows on the wave band |
| 5–8 | sunrise→morning | rising right → 45°, warm yellow | cool blue | medium-high | Sunny enters: key brightens 2 steps over his entrance |
| 9–11 | morning | high right, warm | blue | high | liftoff: Drip's shadow detaches from the water and shrinks |
| 12 | climb | overhead, cooling | grey-blue | falling | atmosphere thickens with altitude |
| 13–17 | noon above the cloud deck | top soft key from the window + amber lamp pools | cool violet room | low (cloud = giant softbox) | room reads dusk-violet (D26); window shows the noon sky |
| 18 | Big Word | card | — | — | |
| 19–20 | filling | top, dimming | grey | lower | palette cools one band per scene |
| 21 | grey and heavy | diffuse, nearly none | blue-grey | lowest | the only near-shadowless scene; the darkest scene |
| 22–23 | rain | backlit from above, cool | slate | medium | wet rim highlights, rain streak layer |
| 24–25 | after rain | breaking sun, left | soft blue | rising | the sun switches sides (we have travelled) — log in the shot plan |
| 26–28 | late afternoon | low left, gold | long blue | high | longest shadows in the episode; the moose's shadow covers Drip |
| 29–32 | sunset | low left, orange | purple | high → medium | Sunny re-enters low; the warmest palette |
| 33–36 | evening → night | card / moonlit blue | — | low | recap ring on paper; mind-blower in night-blue; tease card |

## 5. Shot plan (camera grammar per scene)

See `shot-plan.md` in this dir (one row per scene: framing, camera verb —
HOLD+creep / PUSH / BURST / FOLLOW / DISSOLVE — with the LOOK-bible numbers,
dutch angle if any, planes in frame, light row, speaking/acting notes, bubble
placement, verifier dimension most at risk). Drafted by a text agent from
`script.md` + §3 + §4 of this file; reviewed by the showrunner before Build.

## 6. Build process (Wave D)

1. **Kit first** (one builder, main tree): new modules under `src/lib/kid/`
   per ROADMAP Step 2 §Mechanisms, additive and opt-in — nothing that changes
   a frame of episodes 1–6 (`git diff` of their stills must be empty: render
   one still each of `BoomStorm` and `PipPlants` before and after, `cmp`).
2. **PaintDemo gate**: hidden composition `PaintDemo` rendering three stills
   twice (flat vs painted): Drip on the ocean, Sunny intro, a Cloud Hotel
   interior with Cloudia. A fork scores the painted side against the verifier
   rubric; ≥ pass threshold on every dimension or the kit iterates. Then a
   10 s render-cost measurement at 1080p (`--scale=1`) and at `--scale=0.25`;
   budget in Step 2 §Cost.
3. **Scenes in acts** (max 2 builders, worktrees): cold open + act 1
   (s01–s11) → act 2 (s12–s21) → act 3 (s22–s32) → recap (s33–s36). Each act:
   builder self-review stills → fork still-review against the rubric → fixes →
   hand back for commit.
4. **Gates**: `npm run typecheck`, `npm run lint:hooks`, full every-frame
   `npx remotion render DripWaterCycleRemaster --scale=0.25` EXIT 0 with zero
   bubble warnings, full-scale render `out/DripWaterCycleRemaster.mp4`, phone
   cut `out/DripWaterCycleRemaster_phone.mp4` (720p HEVC hvc1, CRF 28–31,
   faststart, <30 MiB), `src/site/registry.ts` entry (minimal diff), `npm run
   site` green.
5. **Verifier**: `scratchpad/remaster/verify.py` (spec in Step 2) runs on
   the act stills and on a frame strip of the full render; its numbers go in
   the act review file. The fork still-review gives the 0–10 scores.

## 7. Scope guards for builders

- Own only `src/videos/water-cycle-remaster/**`, `public/backgrounds/
  water-cycle-remaster/**`, and NEW files under `src/lib/kid/` (plus one
  export block appended to `src/lib/kid/index.ts`). Never edit
  `src/videos/water-cycle/**`, `public/narration/**`, or existing kit files
  except to add an optional prop whose default reproduces today's output.
- `narration.mjs` text is frozen; durations come from the manifest.
- Every scene is a pure function of frame; no `useState`/effects (lint:hooks).
- Render + Read your own stills (contact sheet, strip, 3 crops) every scene;
  run `verify.py` on them before declaring an act done.
