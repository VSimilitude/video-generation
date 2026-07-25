# Learnings

One dated entry per finished video — written at step 6 of `docs/PROCESS.md`,
before starting the next one. Format: what worked, what didn't, what to do
differently next time. Keep it specific; "pacing felt off" is useless six
months later, "scene 3 needed 40 more frames because the diagram and the
caption arrived together" is not.

Conclusions that should bind future videos get promoted into
`docs/STYLE.md`; this file stays the raw log, including the things we tried
and abandoned. Newest entries at the top.

---

## 2026-07 — inherited from hero_swap

Not a video in this repo, but the source of the conventions the suite was
scaffolded with. Recorded here so the reasoning survives.

**What worked**

- **Build-time TTS beats runtime TTS, decisively.** Synthesizing narration
  in a script (`npm run narration`) instead of in the browser made output
  deterministic, made preview fast (no model load in studio), and — the big
  one — produced *exact clip durations*. Those durations are what make
  audio-driven scene timing possible at all; without them you're back to
  eyeballing frame counts.
- **Per-line caching.** Hash text+voice+speed; only changed lines
  re-synthesize, so the model is never loaded on a no-op run. Editing a
  script stayed a sub-second operation.
- **Auditioning by ear beats reading model cards.** `am_santa` won the
  cane-mode voice on the strength of a jolly, theatrical delivery, despite
  a lower grade on the model card than candidates it beat. Grades measure
  something, but not fit.
- **Generic, name-free narration lines maximize reuse.** Lines written
  without naming a specific hero/item could be recombined across variants
  and re-cut freely. Every proper noun in a line is a clip you can only use
  once.

**What didn't**

- **Initialisms.** "UR" was read as a word. Respelling to "U R" fixed it.
  Assume any all-caps token is wrong until heard.
- **Initial scene budgets were far too short.** Scenes ended up roughly
  1.6× the durations first estimated before they were legible — reading a
  caption, parsing a diagram, and hearing the line all have to fit, and the
  estimate only ever accounted for the line.

**Do differently**

- Estimate scene lengths, then assume they'll grow ~1.6×; plan the script
  length accordingly rather than discovering it at render time.
- Listen to every clip before any visual work (now step 3 of PROCESS.md).

---

## Next: pipeline-demo

_Placeholder — fill in after the first render of `pipeline-demo` is watched
end to end. Questions to answer: did the three-step diagram land on the
narration beats, or did steps arrive early/late? Were the `minFrames`
floors ever the binding constraint (a sign the script is too terse)? Did
the 15-frame default tail feel like enough between scenes?_
