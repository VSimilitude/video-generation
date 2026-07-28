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

## 5. Self-review stills (before any deploy)

Render one still per scene and *look at them* — layout bugs are visible in
a frame and invisible in a diff, and mid-animation states can break even
when end-state geometry is checked (swap-basics hedge scene).

- `npx remotion still <CompId> out.png --frame N` — pick a frame ~85–90%
  into each scene (elements landed), plus mid-animation frames for any
  scene where elements move across each other.
- Fix what's broken, re-render, re-look.

### Mandatory pre-deploy gate: every-frame validation render

**An every-frame validation render must pass before any deploy:**

```
npx remotion render <CompId> /tmp/validate.mp4 --scale=0.25
```

It must exit 0. `--scale=0.25` keeps it cheap (a 10-minute episode is a few
minutes) — the point is not image quality, it is that *every frame is
rendered, in order, into one mounted React tree*.

Stills cannot catch this class of bug and never will. A still mounts the
component fresh for a single frame, so a component whose **hook count changes
between two adjacent frames** — a hook called inside a ternary or after an
early return, where the branch flips on a frame threshold — renders perfectly
as a still at *every* frame you sample, and throws React error #300
("Rendered fewer hooks than expected") the moment those frames are rendered
contiguously. Only contiguous rendering re-renders the same mounted component
across the threshold, which is the only thing that trips it.

This is not hypothetical: it shipped. See the water-cycle entry in
`docs/LEARNINGS.md` — SSR smoke tests and a full still sweep were both green,
and the deployed player bricked mid-episode for an actual child.

## 6. Review (deployed player first)

Review happens on the deployed web player — the reviewer is usually remote,
on a phone — not on a local mp4.

- Add the video to `src/site/registry.ts` (one entry: composition, title,
  one-line description).
- `npm run deploy` — builds `dist-site/` and pushes it to `gh-pages`. The
  suite is live at <https://vsimilitude.github.io/video-generation/>; the
  compositions play via `@remotion/player` with narration audio alongside.
- Watch it end-to-end at full speed (not scrubbing), with sound. Check:
  caption readability at phone size, cuts that feel rushed (raise
  tailFrames), audio glitches, dead air (raise speed or trim text).
- Optional, local only: `npx remotion render <CompId> out/<CompId>.mp4` when
  a real file is needed (publishing elsewhere, frame-accurate inspection).

## 7. Retro (required)

- Add a dated entry to `docs/LEARNINGS.md`: what worked, what didn't, what
  to do differently next video.
- Promote any rule-worthy conclusions into `docs/STYLE.md`, and any
  twice-needed code into `src/lib/`.

### Verifying a promotion (code moving under an existing caller)

A promotion is only safe if the videos that already used the code render
*unchanged*. Prove it, don't assume it:

1. Before touching anything, render a grid of frame-states of every affected
   composition (`node scripts/frame-grid.mjs scratchpad/before 50` — every 50th
   frame of both kids' episodes plus `DripChooses` is ~830 stills in four
   minutes, in one browser).
2. Do the promotion, keeping the moved names re-exported from wherever the
   callers already import them, so no scene file's imports change.
3. Render the same grid again and compare pixel by pixel
   (`node scripts/frame-diff.mjs scratchpad/before scratchpad/after`).

**Compare against a control, not against zero.** Chrome's rasterizer is not
bit-deterministic across runs, so PNG hashes report differences that are
nothing but antialiasing (22 frames in 831, rendering the *same* code twice).
Render the grid twice from the final tree to measure that noise floor, then
require every frame in the real comparison to sit at or below it — except the
frames you deliberately changed, which get looked at by eye
(`scripts/frame-crop.mjs` zooms a detail so it can be seen). Then the usual
gates: `npm run typecheck`, `npm run lint:hooks`, and the every-frame
validation render for each affected composition.
