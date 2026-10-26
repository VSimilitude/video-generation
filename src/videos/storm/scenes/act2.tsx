import React from "react";
import type { TimedScene } from "./common";

// ACT TWO — THE COUNT COMES DOWN (s11_six … s17_myth_thunder). EMPTY: every
// scene here falls back to `ScenePlaceholder` (the real lines, the window, the
// fingers climbing, Flash on every count, Boom rolling in) until staged.
//
// ===========================================================================
// THE ACT-2 BRIEF (skeleton wave, 2026-10-26) — read before writing a line
// ===========================================================================
//
// OWNERSHIP. You own THIS FILE ONLY. `Video.tsx`, `common.tsx`, `Boom.tsx`,
// `Flash.tsx`, `Kid.tsx`, `coldOpen.tsx`, `act1.tsx`, `backgrounds.mjs`'s
// existing keys and the plates are FROZEN for the act wave; a change you need
// in them goes in your report under "Shared-change requests". Two plates are
// YOURS to generate, under the names already declared in backgrounds.mjs
// (add the prompt under exactly that key, same skeleton as
// `bay_through_window_yellow`, colour words only; no volcano / mountain /
// island / peak / summit / hill / sun / moon word in any prompt):
//   bay_through_window_dark   Scenes 11–15 (the storm, dark SLATE, not black)
//   bay_lit_from_above        Scenes 16–17 (the hotel overhead, flat pale
//                             underside lighting everything from above)
// then `npm run backgrounds -- --video storm --only <key>`, measure the
// skyline (scratchpad/ep5/measure-act2.mjs) and put the row in your report
// for the showrunner to add to `PLATES` (until then: `WindowWorld`'s `tint`
// over the yellow plate is a legal stand-in).
//
// YOUR SCENES (frames are the current manifest; they move if a clip does):
//   s11_six            11029 +1668  gust front + Puff's catch-phrase AT the
//                                   window (curtain lifts, hair, mug), FLASH,
//                                   the SIX count, Boom's first window arrival
//                                   (huge, soft) to a room looking the wrong way
//   s12_blue_three     12697 +1002  Blue first (and RIGHT), Violet garnish at
//                                   the far frame edge (silent, exits before
//                                   scene end), the THREE count, the flipped
//                                   button, BLUE'S 90f STUNNED BEAT
//   s13_ruler          13699 +1632  the bay as a ruler; Boom walks it; the
//                                   lesson said ONCE + stamp LIGHT IS FAST.
//                                   SOUND IS SLOW. (a2_38) — the one pedagogy
//                                   run: Boom stays IN the diagram
//   s14_house_phone    15331  +787  three fingers held up at the hotel; cut to
//                                   Cloudia at the house phone in the lobby;
//                                   Sunny through the cloud (`SunnyGlow`)
//   s15_two_one        16118  +658  TWO runs: TWO (Flash over near water) and
//                                   ONE (Flash ACROSS the sky, sideways)
//   s16_zero           16776 +1258  THE BREAK: overhead flash SIDEWAYS on frame
//                                   0, Boom already at the glass, the ONE frame
//                                   they share; the volcano's one line (cut to
//                                   the coastal wide); hail starts on the lawn
//   s17_myth_thunder   18034 +1669  MYTH stamp CLOUDS DO NOT BUMP. (thud, crack,
//                                   36f); two small clouds meet on the horizon
//                                   beside the volcano: nothing; THUNDER card
//
// THE HELD BEATS YOU OWN (Video.tsx; script.md's numbers — nothing enters):
//   a2_26 90f Blue's stunned beat · a2_41 30f "Distance." · a2_46 36f before
//   "Yes." · a2_59 60f THE BREAK · a2_60 30f · a2_61 45f (address 3, the turn
//   to her) · a2_62 48f the volcano's identity gap · a2_68 36f the cracked
//   MYTH stamp · a2_70 36f the two clouds touch, nothing. Identity: Blue 4f
//   (s12 leadFrames 4; a2_28, a2_31). Every scene with a hold: `NO_LEAD`.
//   Counts: s11 six (a2_06–11), s12 three (a2_22–24), s15 two (a2_50–51) and
//   one (a2_56) — the grid is computed (`countGap`), never touch it.
//   Volumes (Video.tsx): a2_12 0.6 (six counts), a2_25 0.85, a2_52 1.0
//   ("louder"), a2_57 1.0.
//
// THE SHARED HELPERS (all from ./common):
//   WindowWorld        your stage. `sky` ("dark" | "lit"), `hotel` (pass a
//                      HotelTower: x, base, grow, tone "storm", crackle),
//                      `outside` (Boom, Flash, rings), `flashes` (the sky
//                      whites with each), `kid` (KidAtWindow props: fingers,
//                      lean, blanket, wind, raise), `curtain`, `ripple`,
//                      `rattle`, `volcano` (his one line: speaking/look).
//                      The glass is x 150–1770, y 64–790; the kid owns the
//                      band x 640–1280 below y ~560. Boom at the glass:
//                      `BOOM_AT_GLASS` (frame-left of the kid).
//   fingersAt(scene, frame, {before?, from?})  the onset-grid finger float;
//                      climbs on its own; HOLDS after the last number — lower
//                      it yourself. `countRuns(scene)` gives each run's
//                      `from` / `arrive` / `count`; `flashFor(run)` is where
//                      Flash goes (8f before "One." begins).
//   Boom (Boom.tsx)    `distance` IS the physics (distanceForCount(n));
//                      `scale` is framing; `walking` (fixed cadence, cannot
//                      hurry); `heading` (rings trail behind); `burstAt` (the
//                      "Present!" ring burst); `face`; `ringsOnly`. NO ARMS.
//                      `boomMark(x, centreY, scale, distance)` for bubbles.
//                      Size ladder: six counts = big + soft; three = mid; two,
//                      one = smaller, tighter; ZERO (s16) = smallest, sharpest,
//                      one frame after the loudest CRACK.
//   Flash (Flash.tsx)  ≤6 frames by construction; `from`/`to` = the sea far
//                      out or SIDEWAYS across the sky; NEVER ends on, behind
//                      or near the kid, the house, a tree, anybody (the
//                      cold-open bolt was moved for exactly this).
//   SoundRings (coldOpen.tsx)  the faceless rings crossing the bay over a count.
//   HotelTower / TowerSection / HotelWorld("lobby") / FrontDesk / SunnyGlow /
//   StaticHair / Horizon / GardenWorld / Bubbles (tails auto-aim) /
//   volcanoBubble (his MOUTH, `side: "right"` at the wide seat) / WordCard.
//
// WEAK POINTS CARRIED (worklist + skeleton):
//   - Boom's voice is PROVISIONAL; build nothing on his exact clip lengths.
//   - The volcano pair (a2_63 + a2_64) is CUTTABLE: stage s16 so cutting both
//     leaves the scene whole (the 48f gap goes with them).
//   - Sunny is behind the tower from Scene 5 to Scene 22: a glow + a voice,
//     never his face. His f0 is within 1.4 st of Boom's (narration report):
//     keep them spatially apart in s14.
//   - Bubbles ≤6 words — script.md gives the summaries for long lines.
//   - The window is the stage: everything outdoors is through the glass;
//     Boom "arrives at the window from the sea" frame-left; a tail to a body
//     outside the glass must still land on him (`boomMark`).
//   - The count is a CHASE: Boom (or his rings) visibly crossing the bay the
//     whole count, the kid's hand the picture. Never a wait.
//   - Nothing struck; the kid leans IN at the loudest moment, blanket up.
// ===========================================================================

export const ACT2_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {};
