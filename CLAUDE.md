# video_generation

A growing suite of (mostly educational) videos built with Remotion + Kokoro
TTS. Beyond producing each video, the explicit goal is to refine the
production process itself: after every video, capture what worked and what to
change in `docs/LEARNINGS.md`, and fold style conclusions into
`docs/STYLE.md`.

## Layout

- `src/videos/<slug>/` — one directory per video:
  - `narration.mjs` — the narration script (text lines + voice/speed)
  - `narrationManifest.ts` — GENERATED clip paths + exact durations
  - `backgrounds.mjs` — painted-background prompts + the episode's style
    anchor (kids' series; optional)
  - `backgroundManifest.ts` — GENERATED image paths
  - `Video.tsx` — the composition (exports the component, a `timeline()`
    helper, and FPS/WIDTH/HEIGHT)
- `src/lib/` — shared code that has earned its way in (theme, audio-driven
  timing, Backdrop/Caption/TitleCard). Promote per-video code here only after
  it's needed twice.
- `src/Root.tsx` — registers one `<Composition>` per video; durations come
  from each video's `timeline()`.
- `src/site/` — the static web player (a `@remotion/player` gallery of the
  suite, built to `dist-site/` and deployed to GitHub Pages for review on a
  phone); `src/site/registry.ts` lists the videos, one entry each.
- `scripts/generate-narration.mjs` — build-time Kokoro TTS for all videos,
  with per-line caching (only changed lines re-synthesize).
- `scripts/generate-backgrounds.mjs` — build-time painted backdrops via
  Replicate (flux-schnell), same shape as the TTS generator: per-prompt
  caching, generated manifest, output committed. Needs `REPLICATE_API_TOKEN`
  in `.env` only when a prompt actually changes.
- `site/index.html` + `scripts/build-site.mjs` — static shell and asset copy
  for `npm run site` (bundle, index.html, `narration/`, `backgrounds/`,
  `.nojekyll`).
- `public/narration/<slug>/` — generated audio (referenced via `staticFile`).
- `public/backgrounds/<slug>/` — generated painted backdrops, `<key>.webp`
  (also via `staticFile`). Committed, like the audio: a checkout renders
  identically without an API key. Never converted — Remotion's ffmpeg has no
  webp decoder; Chrome decodes them natively for both studio and render.
- `out/` — rendered videos.
- `docs/` — PROCESS.md (workflow), STYLE.md (style guide), LEARNINGS.md
  (per-video retro log).

## Commands

```bash
npm run narration                    # (re)generate TTS for all videos
npm run narration -- --video <slug>  # just one video
npm run narration -- --audition <slug>:<lineKey> <outDir>  # voice audition
npm run backgrounds                     # (re)generate changed background art
npm run backgrounds -- --video <slug>   # just one video
npm run backgrounds -- --video <slug> --only <key> --force   # re-roll one plate
npm run backgrounds -- --video <slug> --dry-run              # print prompts only
npm run studio                       # Remotion studio (preview)
npm run site                         # build the web player into dist-site/
npm run deploy                       # build + push dist-site to gh-pages
                                     #   -> https://vsimilitude.github.io/video-generation/
npx remotion render <CompId> out/<CompId>.mp4
npm run typecheck
```

## Core conventions

- 1920×1080 @ 30 fps unless a video has a reason not to.
- Pacing is audio-driven: scenes are defined via `buildTimeline()` in
  `src/lib/narration.ts` and stretch to fit their narration clip + a silent
  tail (default 15 frames). Never hand-tune a scene length to match audio.
- Narration text is the source of truth; after editing `narration.mjs`,
  re-run `npm run narration` (cached, fast) — durations flow into the
  composition automatically.
- Spell out initialisms in narration text ("U R", not "UR") so the voice
  reads them as letters.
- Painted backgrounds are scenery only. Anything that moves, gets touched, or
  has to line up with a character's feet stays SVG on top of the plate — see
  the kids' section of `docs/STYLE.md`.
- After finishing a video: add a dated entry to `docs/LEARNINGS.md` and
  update `docs/STYLE.md` with anything that should become a rule.
