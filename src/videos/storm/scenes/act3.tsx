import React from "react";
import type { TimedScene } from "./common";

// ACT THREE — THE COUNT GOES UP (s18_checkout … s23_ten_nothing). EMPTY:
// every scene falls back to `ScenePlaceholder` until staged.
//
// ===========================================================================
// THE ACT-3 BRIEF (skeleton wave, 2026-10-26) — read before writing a line
// ===========================================================================
//
// OWNERSHIP. You own THIS FILE ONLY. Video.tsx, common.tsx, Boom.tsx,
// Flash.tsx, Kid.tsx, coldOpen.tsx, act1.tsx and the existing plates are
// FROZEN; needed shared changes go in your report ("Shared-change requests").
// Two plates are YOURS, under the names declared in backgrounds.mjs (prompt
// under exactly that key; no volcano / mountain / island / peak / summit /
// hill / sun / moon word):
//   lawn_hail_dark    Scenes 18 and 22 — the lawn the hail bounces on, dark
//                     wet green, seen from the house
//   bay_dusk_clear    Scenes 23 (and the recap's 25–26) — dusk, the storm a
//                     far flicker, the sky clearing; the HALF MOON is SVG
//                     (recap's), never painted. Same skeleton as the window
//                     plates so the horizon does not move.
// Run `npm run backgrounds -- --video storm --only <key>`; measure; report
// the PLATES row.
//
// YOUR SCENES (current manifest frames):
//   s18_checkout     19703  +900  the grandest check-out: hail + rain onto the
//                                 lawn, bouncing, NOBODY under it; Stony
//                                 bounces ONCE and sits on the step; Drip
//                                 lands on the sill as a drop (a3_07,
//                                 CUTTABLE — one-line cut leaves it whole)
//   s19_three_again  20603  +625  FLASH behind the house over the hills;
//                                 THREE; "Present!" (0.85); theory 3
//   s20_six_turn     21228 +1417  SIX; the first FAR "Present!" (0.6 — the
//                                 same clip, quieter); THE TURN "Count me."
//                                 + 60f; stamp THREE COUNTS = ONE KILOMETRE.
//   s21_nine_rumble  22645 +1225  dusk coming; NINE (audit this stretch
//                                 first: the hand is the picture, the rings
//                                 visibly crossing the hills the whole way);
//                                 "Present!" at 0.45 inside the rumble; a3_44
//                                 CUTTABLE
//   s22_goodbye      23870  +666  Sunny back at last (low, gold — his FACE
//                                 again); roll call firing 2: Hail, Hailey,
//                                 other Hail, Hail the third, Stony — same
//                                 order, melting; Stony last to melt
//   s23_ten_nothing  24536 +1359  TEN — all the fingers; 120f of nothing; the
//                                 hotel cut: FLASH and instantly "Present!"
//                                 (full, zero distance, in the lobby — Boom
//                                 small, tight, sharp, as at his birth);
//                                 back to the window; "Both true."
//
// THE HELD BEATS YOU OWN (script.md's numbers; nothing enters):
//   a3_13 24f "Didn't I?" · a3_24 36f address 5 · a3_27 60f THE TURN ·
//   a3_48 36f the goodbye middle · a3_61 120f TEN-AND-NOTHING · a3_62 30f ·
//   a3_66 30f · a3_67 30f. `NO_LEAD` on every one of these scenes.
//   Counts: s19 three (a3_08–10), s20 six (a3_15–20), s21 nine (a3_29–37),
//   s23 ten (a3_51–59 + the "Ten." source a3_60). Computed grid — never touch.
//   Volumes: a3_11 0.85, a3_21 0.6, a3_38 0.45, a3_64 1.0.
//
// THE SHARED HELPERS (./common; see act2.tsx's brief for the full list):
//   WindowWorld (sky "dark" → "dusk"), KidAtWindow via `kid` (fingers to 10;
//   `raise` + `wave` for the end), fingersAt / countRuns / flashFor, Boom
//   (`distance` = distanceForCount(n); far = huge and soft), Flash (≤6f; the
//   sea far out or sideways — far PAST the volcano by Scene 23), SoundRings,
//   HailCrowd / HailBall / HAIL_NAMED / Stony (THE SAME BODY: `Stony` with
//   its frost crown; `melt` 0..1 for Scene 22), HotelWorld("lobby") +
//   FrontDesk + Cloudia for the s23 hotel cut, Horizon (the volcano's summit
//   is the ONE STEADY LIGHT on the dark horizon in act three — `light`
//   "dark"/"dusk"), SunnyGlow (Scenes 18–21: behind the thinning tower).
//
// WEAK POINTS CARRIED:
//   - The ten-count Flash must read as FAR (tiny, past the volcano): a
//     ten-count flash is three kilometres and audible, so the silent one is
//     the "more than fifteen kilometres" one the Narrator names (a3_62).
//   - Stony must be the same body at the penthouse (Scene 6 — done), on the
//     step (Scene 18) and last to melt (Scene 22).
//   - Hail bounces on GRASS with nobody under it; the kid behind the glass,
//     mug up. Nothing struck.
//   - a3_07 (travel-sized) and a3_44 (rumble tie-back) are Mike's
//     overturnables: one-line cuts must leave the scenes whole.
//   - Two long counts (s21, s23) back to back: the cadence report's worst
//     gap is here (~30s). Ensemble business around the counts matters most.
//   - Boom's voice is PROVISIONAL.
// ===========================================================================

export const ACT3_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {};
