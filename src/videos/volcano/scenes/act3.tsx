import React from "react";
import type { TimedScene } from "./common";

// ACT THREE — THE NEWEST PLACE IN THE WORLD (scenes s17_surge … s26_break).
//
// **This file is the act-3 agent's, and nobody else edits it.** See the note at
// the top of `act2.tsx` for how the map works and what the skeleton hands you.
//
// ---------------------------------------------------------------------------
// THE FOUR THINGS THIS ACT OWES THE EPISODE
//
//   THE ROLL CALL    Scene 18, firing 1 (greeting) and Scene 30's goodbye — the
//                    series signature, one variant per episode, fired twice,
//                    shape fixed: cheerful naming → one flat Narrator line →
//                    unbothered unseasoned button, and **nobody replies inside
//                    the naming**. The variant is the island chain, newest to
//                    oldest, black → sandy → green → a sandbar called Sandy;
//                    build it out of the picture the act already has. The
//                    greeting is TWO clips (`a3_13`/`a3_14`) with a staged 24f
//                    between them, the goodbye is one — that is deliberate, not
//                    a broken chain. Five names, same order both times:
//                    **Island, Islet, other Island, Island the third, Sandy.**
//                    Ep 4's `RollCall` in `plants/scenes/coldOpen.tsx` is the
//                    reference: one clip, several `SpeechBubble`s replacing one
//                    another on MEASURED fractions of the take (this box has
//                    ffmpeg with `silencedetect` — use it, do not split evenly).
//   THE GROWTH       Scene 19. **Time passes in NAMED SPANS, never a
//                    time-lapse** — jump cuts between states, each stamped by
//                    the Narrator (the Pip growth-state law applied to
//                    geography). **No mountain or island ever visibly shrinks
//                    or grows on screen**, and erosion on screen is exactly ONE
//                    grain (Scene 20). Both are physics-ledger items, not
//                    staging preferences.
//   THE LOOP         Scenes 24 and 25: the ep-4 order filled. Pip is rooted
//                    exactly where episode four left her and **takes no steps,
//                    ever**; the seed that travels is Pipsqueak, silent.
//                    `a3_74` "It will do." is a cache-migrated take and its 45f
//                    hold lands **naked** — the Narrator companion chain is OFF
//                    this episode.
//                    *Pip has no body in this episode yet* — see `PIP_STANDIN`
//                    in `common.tsx`. Your first call on Scene 24 is promote
//                    ep 4's `Pip` to `src/lib/kid/characters/` (the ep-4 retro
//                    already leans that way; a promotion needs the frame-grid
//                    pixel diff, PROCESS §7) or draw a cameo-scale one here.
//   THE BREAK        Scene 26. Two one-word clips, fifteen minutes of setup,
//                    and 45 frames of silence after `a3_87`. **Nothing** enters
//                    it — no line, no entrance, no music sting, no emotion
//                    change. It is the episode's biggest constructed laugh and
//                    it is entirely in the hold.
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
// Blue's cameo (Scene 22) waters the anti-Sunny seed and **the payoff is NOT
// fired** — its home is the ep-6 storm. Violet is at the far frame edge of that
// scene, vibrating, noticed by nobody, and he never speaks (world rule 3;
// `speakerOf` throws if a key ever claims otherwise).
//
// One Big Word lives here: EROSION (`a3_48`), earned by the demolition crew.

export const ACT3_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {};
