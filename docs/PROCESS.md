# Production process

The repeatable loop for making a video. Refine this document whenever a step
proves awkward — that's half the point of the project.

## 1. Plan

- Pick the topic and the single takeaway a viewer should leave with.
- Draft the narration script first, as short numbered beats (one beat = one
  scene). Read it aloud; cut anything that runs long. Target lengths:
  short-form 60–90s, explainer 2–4 min.
- For each beat, note the visual in one sentence. If a beat has no obvious
  visual, the script probably needs rework.

## 2. Scaffold

- Copy an existing video directory under `src/videos/<slug>/` (use
  `pipeline-demo` as the minimal reference).
- Put the beats into `narration.mjs`, one line per scene.
- Register the composition in `src/Root.tsx`.

## 3. Narration first

- `npm run narration -- --video <slug>` and *listen to every clip* before
  building visuals. Fix mispronunciations by respelling (e.g. "U R",
  "kay-o-koh") — this is much cheaper before scenes exist.
- If unsure about the voice, `--audition <slug>:<lineKey> <dir>` and pick by
  ear.

## 4. Build scenes

- Define the scene list with `buildTimeline()` — narration clip + minFrames
  per scene; never hand-time to the audio.
- Iterate in `npm run studio`. Get layout/pacing right at low fidelity
  before polishing animation.

## 5. Review (deployed player first)

Review happens on the deployed web player — the reviewer is usually remote,
on a phone — not on a local mp4.

- Add the video to `src/site/registry.ts` (one entry: composition, title,
  one-line description).
- `npm run site`, then publish `dist-site/` to the `gh-pages` branch and send
  the link. The compositions play live via `@remotion/player`; narration
  audio ships alongside as `narration/<slug>/*.mp3`.
- Watch it end-to-end at full speed (not scrubbing), with sound. Check:
  caption readability at phone size, cuts that feel rushed (raise
  tailFrames), audio glitches, dead air (raise speed or trim text).
- Optional, local only: `npx remotion render <CompId> out/<CompId>.mp4` when
  a real file is needed (publishing elsewhere, frame-accurate inspection).

## 6. Retro (required)

- Add a dated entry to `docs/LEARNINGS.md`: what worked, what didn't, what
  to do differently next video.
- Promote any rule-worthy conclusions into `docs/STYLE.md`, and any
  twice-needed code into `src/lib/`.
