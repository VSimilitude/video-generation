import React from "react";
import { ScenePlaceholder, type TimedScene } from "./common";

// RECAP — Scenes 32–35 of script.md. Chant, mind-blower, tease.
//
// NOT STAGED YET. Every scene below plays its real dialogue, in the real
// voices, at the real length, with the cast mouthing their own lines — the
// timeline is finished and correct, only the direction is missing. Replace an
// entry in RECAP_SCENES with a real component and nothing in Video.tsx moves.
//
//   s32  THREE-way split screen, not four: there are three Big Words and three
//        characters, and the Narrator takes the summary instead of a word.
//        Panels are dressed from `ACT_COLOR` — and Ray's panel is the one place
//        in the episode that draws `SPECTRUM` literally, because "rainbow
//        spectrum" as a single banner colour is a smear (see the ACT_COLOR note
//        in common.tsx).
//   s33  a slow turning globe, then a push down through it to an ordinary
//        street under an ordinary blue sky. Plate: street_day. Hold long enough
//        for a parent to photograph the three words stacked in the corner.
//   s34  THE MIND-BLOWER, and the best picture in the episode: an astronaut in
//        blinding sunlight with a crisp black shadow, a bright grey landscape,
//        and a completely black starry sky above it. Plate: moon_surface, whose
//        top half is genuinely black — that is the whole fact. The astronaut,
//        their shadow and the blue-marble Earth are SVG over it. Keep it
//        wondrous: the astronaut waves, and nothing in the shot is frightening.
//   s35  the tease. Scene 26's exact framing at dusk (plate: sea_dusk), the
//        volcano still asleep, one smoke ring coming out **wobbling** and not
//        closing, a low rumble in the water. **Wondrous, not frightening** —
//        no dark chord, no red glow, no shaking camera. Then Sunny, half under
//        the horizon, declining a claim for the first time in three episodes.
//        Emotion lead 0 on `rc_18_sunny`.
//
// See the volcano rule at the top of act3.tsx before touching s35.

const placeholder =
  (title: string): React.FC<{ scene: TimedScene }> =>
  function Placeholder({ scene }) {
    return <ScenePlaceholder scene={scene} title={title} />;
  };

export const RECAP_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s32_chant: placeholder("32 · The chant"),
  s33_right_now: placeholder("33 · Right now, over everybody's house"),
  s34_mind_blower: placeholder("34 · The mind-blower"),
  s35_tease: placeholder("35 · Tease and sign-off"),
};
