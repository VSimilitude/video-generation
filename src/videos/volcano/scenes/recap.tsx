import React from "react";
import type { TimedScene } from "./common";

// RECAP (scenes s27_chant … s31_end_card).
//
// **This file is the recap agent's, and nobody else edits it.** See the note at
// the top of `act2.tsx` for how the map works and what the skeleton hands you.
//
// ---------------------------------------------------------------------------
// FIVE SCENES, AND FOUR OF THEM ARE PAYOFFS
//
//   s27  THE CHANT. The ground's whole journey as a relay down the island
//        chain, each traveller lit as their word lands, and the card stack
//        replaying MAGMA / LAVA / ERUPTION / EROSION. Rock's "Rock." is FLAT,
//        no exclamation, and **LATE** — his 24f identity gap makes his own name
//        arrive a beat behind the relay, which is the Scene-19 namespace gag
//        landing. The gap is already in the timeline.
//   s28  THE DEBT STAMPED. Episode four's end card returns on screen — **WHAT
//        IS DIRT ACTUALLY MADE OF?** — and gets **CRUSHED MOUNTAIN + OLD
//        LEAVES.** stamped across it. Print only: Pip's stamp is SHOWN, not
//        re-fired. Held 36f on the stamped card.
//   s29  TWO TRUE THINGS. Back to the beach from Scene 1, and the sandcastle
//        still stands. Mind-blower 1 pays off the silent builder runner planted
//        in the cold open — the kid and the volcano have been in the same
//        business all day — and it gets 45f on the kid and the castle.
//        `Sandcastle` and `KidSilhouette` are in `common.tsx`; the cold open's
//        marks are `COAST.castle` and `COAST.kid`, and this scene must use
//        exactly those, because the payoff is that it is the same castle.
//   s30  ROLL CALL, firing 2: goodbye. Same five names, same order as Scene
//        18's greeting (series law) — read them out of act 3's own table rather
//        than retyping them, or the two firings will drift.
//   s31  END CARD, TEASE, GOOD NIGHT. **WHY IS THUNDER ALWAYS LATE?** Then V7,
//        "Good night.", on its 48f approach — the mirror of V1. Then the new
//        canon: he does not go back to sleep. End on the CHANGED horizon — a
//        new island standing beside him — with the kid watching and the summit
//        glowing gently. `Volcano`'s `awake` stays up and `smoke` stays lit.
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
// The cold open is staged in `coldOpen.tsx` and Scene 29's beach must match it:
// same plate (`coast_day`), same `COAST.ground`, same castle mark, same kid
// mark. Render the pair and look at them side by side (STYLE, the boundary
// checklist) — this is the longest-range continuity claim in the episode.

export const RECAP_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {};
