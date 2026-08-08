# EP 4 — painted-plate design (B2 input, showrunner, 2026-08-08)

Design source for `backgrounds.mjs`. The builder turns this into prompts +
the style anchor, renders, and self-reviews every image by eye against the
checklists below (STYLE "Painted backgrounds" rules apply in full).

## The one world

A single summer meadow, seen from one spot for the whole episode (the hero
cannot move; the WORLD is the set). Plates differ by time of day and
framing, never by geography. Continuity anchors that must read as the same
place in every wide:

- Rolling green meadow, generous open sky (bubble zone), simple uncluttered
  lower third (character zone) — both clean zones are owed by EVERY plate.
- A big old tree at the field's edge, one side of frame (load-bearing
  Scene 20 — establish in every wide from Scene 1 on, same side every time;
  pick frame-left so it never fights the bubble stack over Pip dead-centre).
- FAR HORIZON BAND KEPT BARE. The volcano is NOT painted — `SleepingVolcano`
  (SVG, freshly promoted to lib) sits on the measured horizon in every wide
  shot, because the Scene-13 steam curl is SVG and must anchor to the
  summit. Prompt the horizon as low, empty, hazy distant hills; nothing
  standing on it (describe the empty version — never "no volcano").
- The old tree: painted (scenery, nothing touches it until Scene 20's
  LOOK — and even then nobody touches it; the camera does). If the painted
  tree fights Scene 20's framing, the fallback is an SVG tree on a bare-edge
  plate — builder flags it rather than shipping a mismatch.

## Style anchor (tune once, regenerate all — name colours explicitly)

Draft to iterate from: "children's picture-book gouache, soft painterly
texture, a wide summer meadow of warm yellow-green grass under a clear
cerulean-blue sky, one big leafy old oak tree at the left edge of the
field, low bare hazy blue-green hills on the far horizon, simple
uncluttered foreground, plenty of open sky, no people, no animals, no
buildings". Time-of-day plates override the colour words per key, never
the texture words.

## Plate list (~13 keys)

| key | for scenes | prompt notes |
|---|---|---|
| `meadow_morning` | 1, 3(wide), title pull-back start | The establishing wide. Morning light, dew-fresh greens, blue sky. Tree left, bare horizon. |
| `meadow_aerial` | 4 (title) | Same meadow from high up — field becomes the world, horizon low. Bare horizon band (volcano SVG must still sit on it, per the volcano rule: the title wide shows it). |
| `sky_drift` | 2 | Sky only, mid-air: blue with soft drifting cumulus, morning. Seeds are SVG. Open centre. |
| `grass_close` | 3, 5(close), 6, 9, 10, 14/16 surface halves | Low, close grass world: grass blades painted soft at frame edges, small clear centre-ground where Pip's SVG dirt patch + mark sit. No horizon needed. |
| `meadow_sunrise` | 5 | Sunrise wide: warm pink-gold east sky, long shadows, greens still cool. Tree + bare horizon. Sunny is SVG — leave the sun OUT of the sky (describe glow, not a disc). |
| `meadow_day` | 6, 9, 10, 15, 20(wide), 21 | Full daylight wide, biggest bluest sky (the vast-sky-over-tiny-dot scenes). |
| `meadow_night` | 7 | Night: deep blue (not black), stars, pale silver ground light. Moon is SVG (Ray arrives down its light — geometry must line up); prompt moonGLOW sky, no moon disc. |
| `meadow_dawn` | 8, 24 | Dawn: first gold at the horizon, sky still half-cool. No sun disc (Sunny SVG). |
| `sky_cloud_level` | 11–12 | Up at cloud height for the Cloud Hotel: blue sky, cloud floor/banks below, afternoon warm. Hotel + Cloudia are SVG. |
| `meadow_rain` | 13 | Warm silvery overcast wide, rain-light on the greens. Rain sheets are SVG. Horizon must stay VISIBLE under the weather (the stir needs the summit line readable). |
| `soil_cutaway` | 14, 16 | OPTIONAL texture aid: soft brown soil cross-section band, low contrast, no structure (roots/straw/Drip are all SVG and must line up). If it fights the drawn cutaway, skip — drawn wins. |
| `meadow_golden` | 22, 23, 28 | Golden hour: huge warm gold sky (the stall + the hire + the breath). The "one enormous obvious supplier" is SVG Sunny. |
| `meadow_sunset` | 25(bg), 26 | Sunset: value-warm, sun low. Again no painted sun disc. |
| `meadow_dusk` | 29 | Dusk afterglow: sun gone, deep warm horizon fading up to first stars. Sprout-row silhouettes are SVG. Bare horizon (volcano SVG asleep on the end card). |

Scene 27 (recap panels) uses the drawn recap world — no plate.

## Builder checklists (self-review, every image, by eye)

1. Two clean zones present (lower-third character band, upper-half sky).
2. Horizon band bare + LOW enough that the SVG volcano reads on it at the
   measured horizon height; nothing painted where the summit will sit.
3. Tree: same side, same rough silhouette family across all wides.
4. No painted sun/moon disc anywhere (Sunny, moon, beams all SVG).
5. Value contrast between time-of-day plates, not just hue (STYLE: paint
   the value, not the hue — dawn vs day vs golden must differ in VALUE).
6. Nothing hard-edged, no text, no fine structure (1344×768 → 1.4× upscale).
7. Sample each plate's grass green and record the sampled set next to the
   episode scenery constants (ep-2 `PAINTED_GREEN` precedent).
