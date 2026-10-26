import React from "react";
import type { TimedScene } from "./common";

// RECAP (s24_chant, s25_amazing, s26_end_card). EMPTY: every scene falls back
// to `ScenePlaceholder` until staged.
//
// ===========================================================================
// THE RECAP BRIEF (skeleton wave, 2026-10-26) — read before writing a line
// ===========================================================================
//
// OWNERSHIP. You own THIS FILE ONLY; everything shared is FROZEN (report a
// "Shared-change requests" section instead). The recap REUSES plates
// (`bay_dusk_clear` from act 3 — wait for it; `garden_heavy_day` /
// `bay_through_window_yellow` are here now); it generates none.
//
// YOUR SCENES (current manifest frames):
//   s24_chant     25895  +380  card stack STATIC / LIGHTNING / THUNDER, one
//                              voice (rc_02–rc_04, three one-word clips);
//                              the visual slams in owner order: the
//                              penthouse hail slam STATIC; FLASH slams
//                              LIGHTNING and is on screen for SIX FRAMES of
//                              her own slam (that IS the joke); Boom slams
//                              THUNDER one beat BEHIND her, on purpose — he
//                              looks for her, she has gone (the staged
//                              seventh address; no clip). Then "Thunder is
//                              not late. Thunder is FAR."
//   s25_amazing   26275 +1426  the garden at dusk from the window; Sunny LOW
//                              and fully visible; the lightning-vs-Sun fact +
//                              THE AWE 60f after rc_07 (Sunny visibly hearing
//                              it); Maracaibo; Boom FAR, a voice from the
//                              horizon ("I know. I am busy."); the two small
//                              true things
//   s26_end_card  27701  +348  dusk clear; the volcano + island hold the
//                              horizon, summit lit; the HALF MOON (SVG — a
//                              phase a kid can check; it is never painted);
//                              card WHY DOES THE MOON CHANGE SHAPE? (Mike's
//                              overturnable tease: one card + two kokoro
//                              lines, stage it so a swap is one string);
//                              Sunny below the horizon (muffled — no body);
//                              the last picture rides the 120f tail: one more
//                              far, silent flash past the island, the kid's
//                              ten fingers up anyway — and a WAVE
//                              (`KidAtWindow` `raise` + `wave`)
//
// THE HELD BEAT YOU OWN: rc_07 60f THE AWE (`NO_LEAD` on s25). The 120f tail on
// s26 is the builder's number for the last picture (Video.tsx).
//
// HELPERS: WordCard (one per Big Word — the chant reprises the three, the
// recap does not invent a fourth), Flash (≤6f — her slam is six frames by
// construction), Boom (`burstAt` for his slam; `distance` 1 for "far"),
// WindowWorld / GardenWorld, Horizon (light "dusk"), KidAtWindow via `kid`,
// fingersAt is not needed here (no counts in the recap).
//
// WEAK POINTS: the one-word chant clips are the highest TTS-risk class (the
// fallbacks are in script.md); Boom's voice is PROVISIONAL; the moon must be
// HALF-lit and drawn, never a full disc.
// ===========================================================================

export const RECAP_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {};
