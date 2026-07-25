# Style guide

The house style for videos in this suite.

**Every rule here is provisional.** These are the conclusions we currently
believe, seeded from the hero_swap video and the scaffold's conventions —
not settled doctrine. After each video, the retro in `docs/LEARNINGS.md`
decides what changes; edit this file to match rather than accumulating
exceptions. If a rule keeps getting broken, it's the wrong rule.

## Format

- 1920×1080 @ 30 fps. Deviate only with a reason worth writing down.
- Compositions export `FPS`, `WIDTH`, `HEIGHT` and a `timeline()` helper;
  `src/Root.tsx` takes duration from `timeline()`, never a hardcoded number.

## Pacing

- **Pacing is audio-driven.** Scenes are declared in `buildTimeline()`
  (`src/lib/narration.ts`) and stretch to fit their narration clip plus a
  silent tail (`DEFAULT_TAIL_FRAMES` = 15). Never hand-time a scene to match
  the audio you just listened to — that breaks the moment the line is
  reworded.
- `minFrames` is a floor for scenes that would otherwise flash by (and the
  only length control for silent scenes). It is not a target.
- Raise `tailFrames` on cuts that feel rushed, especially the final scene
  (pipeline-demo uses 30 on `outro`).
- **Slow beats fast.** hero_swap's scenes ended up roughly 1.6× their
  original budgets before they were comfortably legible. When in doubt,
  give a beat more room; viewers forgive slow far more than they forgive
  missing what happened.

## Voice

- Default: `af_heart` at speed `1.0`.
- When a scene wants a different tone, audition rather than guess:
  `npm run narration -- --audition <slug>:<lineKey> <dir>`, then pick by ear.
  Model-card grades are not a ranking of what sounds right.
- Per-line overrides (`{ text, voice, speed }`) are the mechanism for a
  one-off tonal shift; don't fork a whole video's voice for one aside.
- **Spell out initialisms** so the voice reads letters, not a word: "U R",
  not "UR". Same for anything the model mangles — respell phonetically
  ("kay-o-koh"). Listen to every clip before building visuals; fixes are
  cheap before scenes exist and expensive after.
- Prefer generic, name-free narration lines where the content allows. Lines
  that don't name a specific subject can be reused across videos and
  re-cut without re-synthesis.

## Captions

- One caption per scene, in the bottom panel (`src/lib/components/Caption.tsx`).
  If a scene needs two, it's two scenes.
- Caption text mirrors or tightly summarizes that scene's narration line.
  It is not a second, competing script.
- Readability wins over snap: the caption fades and rises over ~20 frames.
  Don't shorten that to make a cut feel tighter.
- Keep captions to one or two lines at 42px within the 1440px panel; if it
  doesn't fit, the narration line is too long.
- **A captioned scene keeps all its content inside the caption-safe area.**
  The bottom `CAPTION_SAFE_BOTTOM` px of the frame (280px, derived in
  `src/lib/theme.ts` from `captionMetrics` — 64px offset + 166px two-line
  panel + 50px margin) belong to the caption and nothing else. Scenes that
  render a `Caption` wrap their content in `ContentArea`
  (`src/lib/components/ContentArea.tsx`), which fills the frame minus that
  strip — 800px of usable height on a 1080 frame — and centers what's inside.
  Never hand-pick a `paddingBottom` to approximate it: the number drifts from
  the panel's real height the moment either changes, which is exactly how
  pipeline-demo's first cut overlapped its diagram.
- Caption-less scenes (title cards, outros) use the full frame. Don't leave a
  bottom padding behind "just in case" — it reads as a mis-centered scene.

## Visuals

- Dark backdrop (`Backdrop`): slate gradient plus a soft center glow, from
  `src/lib/theme.ts`. Light text on top.
- Every text element over the backdrop gets `darkOutline()` — layered dark
  offsets plus a drop shadow — so it survives whatever is behind it.
- One accent per idea. `theme.accent` (blue) is the default;
  `theme.warm` / `theme.good` mark contrast or success states.
- **Springs for entrances**, `interpolate` for continuous motion (growth,
  progress, sweeps). Stagger multi-element entrances so each lands on its
  own beat, as `PipelineDiagram` does.
- Leave room for the caption panel with `ContentArea` / `CAPTION_SAFE_BOTTOM`,
  never a per-scene `paddingBottom` — see **Captions** above.
- **The composition must be self-contained in its typography.** `@remotion/player`
  does not reset inherited CSS, so anything the embedding page sets (line-height,
  font-size, letter-spacing) cascades into the video on the site while Studio
  and `remotion render` show the browser default. `Backdrop` pins
  `fontFamily`, `color` and `lineHeight`; add to that list rather than relying
  on a UA default that only holds in one of the three environments.

## Type

- System font stack (`theme.fontFamily`) for now. It is not embedded, so a
  render on another machine can drift; if that ever shows up, switch to
  `@remotion/google-fonts` for a font that ships with the render.
- Heavy weights for headline text (900 at 108px for titles, 64px for diagram
  labels); `theme.textMuted` for secondary detail.
