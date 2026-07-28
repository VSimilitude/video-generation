import React from "react";
import { ScenePlaceholder, type TimedScene } from "./common";

// ACT TWO — THE AIR. Scenes 14–24 of script.md.
//
// NOT STAGED YET. Every scene below plays its real dialogue, in the real
// voices, at the real length, with the cast mouthing their own lines — the
// timeline is finished and correct, only the direction is missing. Replace an
// entry in ACT2_SCENES with a real component and nothing in Video.tsx moves.
//
// What the act needs, in the order it needs it (script.md is the authority;
// this is a reading list, not a substitute):
//
//   s14  the exact framing of the cold open's tilt, held the same length, with
//        the seven colours ghosting across it and fading. Plate: sky_dome_day.
//   s15  MYTH-BUST ONE, three plates in a row and the joke is that only one
//        thing changes: bay_blue -> desert_day -> bay_grey. The red MYTH stamp
//        is episode one's, second firing in the series.
//   s16  Sunny, a ladder, a dust sheet, and a roller that is completely dry.
//        Emotion lead 0 — his face must not fall before the question lands.
//   s17  the dive *into* empty air until it resolves into a crowd of faint
//        outlined puffs, exactly as ep 2's cloud interior resolved into drops.
//        `AirBlob` is the kit's, and Puff enters at ~40% opacity.
//   s18  the corridor, and Red crossing it dead straight. Stage it BORING —
//        the comparison is the lesson, and half of scattering is the colours
//        that don't. `SPECTRUM[0]` and `RayShard`.
//   s19  the same corridor, and Blue pinballing off everything. `SPECTRUM[4]`.
//   s20  blue arrows arriving at the lens from every direction, then the dome.
//        Plate: sky_dome_day, and street_day for the kid-height view.
//   s21  BIG WORD TWO — SCATTER, letters arriving from different directions.
//        `ACT_COLOR.scatter`, syllables ["Scat", "Ter"].
//   s22  the series interlock. AIR ghosts up enormous behind the blue dome and
//        the sentence sits alone for 45 frames. Said once in the episode.
//   s23  Sunny is wrong, and the longest scene in the episode: five held beats,
//        a diagram that droops and reassembles, and emotion lead 0.
//   s24  Ray alone against the whole dome at `RAY_LIGHT.full`, then a pull-back
//        that keeps going until he is one speck. First firing of the
//        catchphrase.
//
// Two act-wide constants the act files agree on, and the reason they are here
// rather than in each scene: `RAY_LIGHT.afterRainbow` until Scene 24, where it
// steps to `.full` and stays; and `RAY_SPECTRUM.afterRainbow` on every shot of
// him, because Scene 13 turned it on for the rest of the episode.

const placeholder =
  (title: string): React.FC<{ scene: TimedScene }> =>
  function Placeholder({ scene }) {
    return <ScenePlaceholder scene={scene} title={title} />;
  };

export const ACT2_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s14_why_only_blue: placeholder("14 · So why is the sky only blue"),
  s15_myth_sea: placeholder("15 · Myth-bust one: it is not the sea"),
  s16_myth_paint: placeholder("16 · Myth-bust two: show us the paint"),
  s17_not_empty: placeholder("17 · The sky is not empty"),
  s18_red_straight: placeholder("18 · Red goes straight through"),
  s19_blue_everywhere: placeholder("19 · Blue goes everywhere"),
  s20_every_direction: placeholder("20 · Blue, from every direction"),
  s21_bigword_scatter: placeholder("21 · Big Word Two — SCATTER"),
  s22_interlock: placeholder("22 · The bit that joins the show together"),
  s23_sunny_wrong: placeholder("23 · Sunny is wrong"),
  s24_not_plain_anymore: placeholder("24 · Not the plain one any more"),
};
