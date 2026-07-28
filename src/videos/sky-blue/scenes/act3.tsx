import React from "react";
import { ScenePlaceholder, type TimedScene } from "./common";

// ACT THREE — THE LONG WAY. Scenes 25–31 of script.md.
//
// NOT STAGED YET. Every scene below plays its real dialogue, in the real
// voices, at the real length, with the cast mouthing their own lines — the
// timeline is finished and correct, only the direction is missing. Replace an
// entry in ACT3_SCENES with a real component and nothing in Video.tsx moves.
//
//   s25  the sea, late, blue draining out of the top of frame. Ray hangs low
//        with the light coming in almost horizontally and throwing a long
//        shadow off a rock (`Rock` is the kit's). Plate: sea_sunset.
//   s26  THE VOLCANO. One line, then 60 frames of nothing.
//   s27  the cross-section: a short slice of air at midday against a very long
//        one at sunset. The only new physics in the act, and it is geometry.
//   s28  follow the beam along its whole path and watch the blue ping out of
//        it sideways, one at a time, in silence. Payoff of Scene 18.
//   s29  BIG WORD THREE — SUNSET, lit from below. `ACT_COLOR.sunset`,
//        syllables ["Sun", "Set"]. Sunny leans on the bottom of the card.
//   s30  the crayon goes back in the box. **Scene 1's exact framing**, so it
//        reuses `PAGE` and `CRAYONS` from coldOpen.tsx rather than re-picking
//        marks — the frame story closes by the audience recognising a picture.
//        Plate: hill_day's grass, under a warm dusk wash.
//   s31  the world turns. Pull back off the coast, off the country, until the
//        planet is in frame with the terminator sliding across it, and then 75
//        frames of silence — the longest in the episode and the end of the
//        story. Plate: space_stars.
//
// ---------------------------------------------------------------------------
// THE VOLCANO RULE (script.md, Production notes) — read this before staging
// anything on a coastal horizon.
//
//   - It sits on the **measured** horizon, exactly as it did in episode two:
//     sample the plate or read the drawn horizon, never guess, or it floats.
//   - It must be **continuously visible for the whole shot** it appears in. A
//     background gag that vanishes mid-scene reads as a bug — that is why
//     episode two cut it from its own Scene 26.
//   - It gets one line (Scene 26) and one wobble (Scene 35) in three episodes,
//     and **nothing else in this episode may look at it, point at it, or
//     explain it**. No bubble, no arrow, no music sting, no second narrator
//     line anywhere. The whole value of the beat is that the show appears to
//     think it is not important.
//
// `sea_sunset` and `sea_dusk` were both prompted for one straight unambiguous
// waterline so that it can be measured; `sea_sunset` cost three rolls to get a
// horizon with nothing sitting on it (see backgrounds.mjs).
// ---------------------------------------------------------------------------

const placeholder =
  (title: string): React.FC<{ scene: TimedScene }> =>
  function Placeholder({ scene }) {
    return <ScenePlaceholder scene={scene} title={title} />;
  };

export const ACT3_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s25_sea_sunset: placeholder("25 · Down at the sea, going orange"),
  s26_volcano: placeholder("26 · The volcano"),
  s27_long_way: placeholder("27 · The long way through"),
  s28_blue_runs_out: placeholder("28 · Blue runs out"),
  s29_bigword_sunset: placeholder("29 · Big Word Three — SUNSET"),
  s30_crayon_back: placeholder("30 · The blue crayon goes back in the box"),
  s31_round_the_other_side: placeholder("31 · Round the other side"),
};
