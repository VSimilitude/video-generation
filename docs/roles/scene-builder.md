# Scene builder role

You implement scenes, characters, and staging in Remotion from the
showrunner's brief. The brief is your scope: touch only the files it owns.

Boot order: this file → the kids' section of `docs/STYLE.md` (painted plates
vs SVG rules, staging conventions, character rigs) → your brief. When the
brief names a quality bar ("read act1.tsx"), read that file before writing.

## Build conventions

- Per-act scene-map files export a `Record<sceneId, FC>`; `Video.tsx` merges
  with a placeholder fallback. Parallel act agents get zero merge conflicts
  by design — stay inside your act file.
- Pacing is audio-driven via `buildTimeline()` — never hand-time a scene to
  its audio.
- Painted backgrounds are scenery only; anything that moves, gets touched,
  or lines up with a character's feet stays SVG on top of the plate.
- **Visual self-review is mandatory and is the single biggest quality
  lever**: render stills of your own work, Read them, and iterate. Pick
  frames ~85–90% into each scene plus mid-animation frames wherever elements
  cross. Expect to run 50–170 stills in a wave.

## Verification stack (all mandatory before reporting done)

1. `npm run typecheck` + `npm run lint:hooks` (AST scanner; a hook in a
   ternary = React #300 = bricked player — it shipped once; the scanner has
   caught 2 more in flight).
2. Per-scene stills + mid-animation frames (layout bugs are visible in a
   frame and invisible in a diff).
3. **Full every-frame render** `npx remotion render <CompId> /tmp/validate.mp4
   --scale=0.25`, exit 0 — the ONLY gate that catches hook-count changes
   across frames; stills structurally cannot.
4. Promotions/refactors: frame-grid pixel diff vs a same-code control run
   (Chrome AA noise floor ~22/831 frames; PNG hashes are an invalid oracle).
   Harness: `scripts/frame-{grid,diff,crop}.mjs`; recipe in
   `docs/PROCESS.md` §7.

## Tooling gotchas

- `npx remotion still/render` need libnspr4/libnss3 (installed).
- Replicate rate limit is 6/min: pace 12s, retry per item, never lose paid
  work to a thrown batch. TTS/plates are cached per line/prompt — re-runs of
  unchanged content are free and safe.
- webp plates stay webp (Remotion's ffmpeg can't decode them; Chrome can).
- Audition output filenames must include the line key.
- You cannot commit. Report the exact paths you changed.

## Reporting

Write the full report (worklists, tables, flagged weak points, staging items
you noticed but didn't own) to a file; your final message to the showrunner
is a short summary + paths + gate results. Flag every weak point you found —
briefs to the next agent are built from these.
