import React from "react";
import type { TimedScene } from "./common";

// ACT TWO — THE LOUD PART (scenes s10_eruption … s16_ceremony_fuse).
//
// **This file is the act-2 agent's, and nobody else edits it.** `Video.tsx`
// spreads `ACT2_SCENES` into its scene registry, so staging a scene is adding
// its component to the record below and nothing else. The timeline does not
// move by a frame when you do, because every scene's turns, gaps and holds are
// already laid out in `Video.tsx` from script.md — including the ones this act
// is built around.
//
// ---------------------------------------------------------------------------
// WHAT THE SKELETON HANDS YOU
//
//   the world     `CoastWorld` (the beach wide, volcano on the painted
//                 horizon), `MountainWorld` (the portrait — his shot, and
//                 nothing else stands in it), `UnderWorld` (downstairs).
//                 Act 2 will want at least one new plate: the flow's slope.
//                 Add the key to `backgrounds.mjs`, add its measured row to
//                 `PLATES` in `common.tsx`, run the generator for that key.
//   the bodies    `Ember` (see the rig notes in `Ember.tsx` — **she has no
//                 arms**, `lean`/`squish`/`crust` are the whole vocabulary),
//                 `GlowDrop` (the crowd), `Volcano` (`awake`, `erupt`, `smoke`,
//                 `ashAt`, `look`, `speaking`), `Rock` and `Sunny` from the kit.
//   the crust     `Ember`'s `crust` prop, 0..1, already built: the spine gag's
//                 body. Scene 13 is where it goes on. It is drawn as a stroke
//                 on her own outline, so it grows from her edge inward, which
//                 is the physics `a2_17` says out loud.
//   the eruption  `Volcano`'s `erupt` prop, 0..1, already built as a fountain
//                 that arcs back into the crater. It is FIREWORKS, not a
//                 disaster — that is the episode's hard tone gate and the
//                 component is written to it.
//
// ---------------------------------------------------------------------------
// WHAT THIS ACT MUST NOT GET WRONG
//
//   THE CEREMONY     Scenes 15 and 16 are the spine of five episodes. The 180f
//                    after `a2_40_narrator` is the SERIES RECORD and nothing
//                    enters it — no line, no entrance, no emotion change, no
//                    camera move still in flight. Sunny hangs perfectly still
//                    (his stunned beat, the series' first) and Ember, for the
//                    only time in her life, does not speak. `NO_LEAD` on both
//                    scenes' emotion maps.
//   THE CHAIN        `a2_15` "Done!" / 24f / `a2_16` "Started." is the source
//                    firing of a four-firing chain. The 24f is Rock's identity
//                    gap and it is byte-identical at all four; do not stage
//                    anything inside it, in any of them.
//   THE VOLCANO      V3 (`a2_02`) and V4 (`a2_35`) each take a 48f approach —
//                    already in the timeline. His staging vocabulary is one
//                    sentence: *the mountain moved slightly and that is
//                    enormous.* No body walk. No gestures. Ever.
//   NO MOUNTAIN      grows or shrinks on screen (physics ledger). Named spans
//                    and jump cuts only.
//
//
// ---------------------------------------------------------------------------
// **THE MOUTH-ANCHOR RULE — every volcano bubble goes through `volcanoBubble`.**
//
// V1 and V2 shipped their first pass with a hand-typed bubble anchor and the
// tail landed on his EYE: the first words the scenery has ever spoken appeared
// to come out of his eyeball. His face is five hundred pixels across, so the
// tail is not just saying *who* is talking, it is saying *which part of him*.
//
// `volcanoBubble({ ...VOLCANO_SEAT, awake: 1 })` in `common.tsx` returns the
// `mark`, the `at` override and the `maxWidth` for you. It derives the anchor
// from the same constants the component draws the mouth with (`volcanoFace`),
// puts the bubble clear of the near eye so nothing is occluded during the
// eyelid rise, and drops the tail tip onto the mouth line. **Never type an x
// or a y for one of his bubbles.** Copy this, and nothing else:
//
//   const vb = volcanoBubble({ ...VOLCANO_SEAT, awake: 1 });
//   <Bubbles scene={scene} cast={{ volcano: vb.mark } as Cast}
//            text={{ <his key>: "…" }} at={{ <his key>: vb.at }}
//            maxWidth={vb.maxWidth} />
//
// Pass `side: "right"` if the shot needs the bubble on his other side; the
// clearance is computed from whichever eye is nearer.
//
// ---------------------------------------------------------------------------
// Two Big Words live here: ERUPTION (`a2_01`) and LAVA (`a2_05`, staged side by
// side with the MAGMA card from Scene 5 and one arrow between them — same
// stuff, new name, as a picture).

export const ACT2_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {};
