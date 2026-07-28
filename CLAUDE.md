# video_generation

A growing suite of (mostly educational) videos built with Remotion + TTS
(Kokoro locally, MiniMax via Replicate for character voices). Beyond producing
each video, the explicit goal is to refine the production process itself:
after every video, capture what worked and what to change in
`docs/LEARNINGS.md`, and fold style conclusions into `docs/STYLE.md`.

## Layout

- `src/videos/<slug>/` — one directory per video:
  - `narration.mjs` — the narration script (text lines + engine/voice/speed)
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
- `scripts/generate-narration.mjs` — build-time TTS for all videos, with
  per-line caching (only changed lines re-synthesize). Two engines: `kokoro`
  (local, free, the default and the narrators') and `minimax` (MiniMax
  speech-2.8-hd via Replicate — paid, takes an `emotion` and inline `<#0.4#>`
  pause markers, used for character acting). A minimax line adds
  `engine: "minimax", voiceId, emotion` and needs `REPLICATE_API_TOKEN` in
  `.env` only when that line actually changes.
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
npm run narration -- --audition <slug>:<lineKey> <outDir>  # kokoro audition
npm run narration -- --audition <slug>:<lineKey> <outDir> \
    --engine minimax --voices <id1,id2,...> [--emotion happy] [--speed 1.0]
                                     # same line in candidate MiniMax voices
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
- Narrators stay on kokoro (free, instant, reworded at will); characters that
  need acting go to minimax, with `emotion` used sparingly and `<#0.4#>` pause
  markers only where the script asks for timing *inside* a line — see the
  Voice section of `docs/STYLE.md`.
- Painted backgrounds are scenery only. Anything that moves, gets touched, or
  has to line up with a character's feet stays SVG on top of the plate — see
  the kids' section of `docs/STYLE.md`.
- After finishing a video: add a dated entry to `docs/LEARNINGS.md` and
  update `docs/STYLE.md` with anything that should become a rule.

## Multi-session etiquette

Multiple Claude sessions may work in this tree concurrently (e.g. episode
production vs. player/site engineering). Rules that keep them from colliding:

- Ownership: `src/videos/` + `src/lib/kid/` belong to the production session;
  `src/site/` + the branching player belong to the technical session. Registries
  are shared — add entries with minimal diffs, never reorganize concurrently.
- Commit selectively (never `git add -A` while another session has uncommitted
  work) and PUSH after committing — a local-only commit is invisible to the
  other session's deploys.
- To deploy while the tree contains another session's WIP: build from a clean
  worktree of committed main —
  `git worktree add --detach <tmp> origin/main && ln -s $(pwd)/node_modules
  <tmp>/node_modules && (cd <tmp> && npm run deploy)` — then remove the
  worktree (from OUTSIDE it).
