import React from "react";
import type { TimedScene } from "./common";
import {
  AbsoluteFill,
  Bubbles,
  CHAR_BOX,
  COAST,
  Cast,
  Drip,
  Ember,
  EMBER_COLOR,
  HEIGHT,
  KidBackdrop,
  Mark,
  PHASE,
  PLATES,
  Pip,
  PIP_BOX,
  PIP_COLOR,
  Plate,
  Puff,
  Rock,
  Shard,
  SpeechBubble,
  Sunny,
  Volcano,
  WIDE,
  WIDTH,
  WideLayer,
  WordCard,
  Z,
  blueRicochet,
  blueTrail,
  bubbleOver,
  crownOf,
  interpolate,
  kidEase,
  kidInkOutline,
  kidRadius,
  kidTheme,
  kidType,
  lineWindow,
  lookAt,
  mixHex,
  pipCrownLocal,
  pipFaceLocal,
  stand,
  hover,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  volcanoBubble,
  volcanoFace,
  NO_LEAD,
  type Body,
  type Box,
  type Cam,
  type Emotion,
  type LookDirection,
} from "./common";

// ACT THREE — THE NEWEST PLACE IN THE WORLD (scenes s18_rollcall … s26_break).
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
//
// ===========================================================================
// WHAT THE BUILD ACTUALLY DID, AND THE FIVE DECISIONS BEHIND IT
// ===========================================================================
//
// **1. THE ARCHIPELAGO IS DRAWN, NOT PAINTED.** The three act-3 plates buy sky,
// far water and one straight empty horizon and nothing else. The chain is SVG
// for four separate reasons, any one of which would be enough: the five
// islands get *named* one at a time and Ember's eyes have to land on the one
// she is naming; Scene 21 labels three of them as a diagram; Ember stands on
// the newest one; and the newest one is a different HEIGHT in each of Scene
// 19's four named spans. It is the volcano rule ("the mountain is never
// painted") applied one island further out, and it is the same rule.
//
// **2. THE HORIZON NEVER MOVES.** Every sea shot in this act seats its plate's
// own measured skyline on `COAST.horizon` (470) — the identical line the cold
// open and act one use — so the five plates act three cycles through
// (`island_chain_dusk`, `black_beach_night`, `sea_horizon_dawn`,
// `sea_horizon_day`, `meadow_day`) differ in the hour and in nothing else.
// That is what makes Scene 19's jump cuts read as *time passing* rather than as
// a camera that will not sit still: the light changes, the island is taller,
// and every other pixel of geometry is where it was.
//
// **3. THE ISLAND GROWS ONLY AT CUTS.** `BasaltShore` takes a `crest` and the
// scene feeds it a step function of the span index. Nothing interpolates. This
// is the physics ledger's "no mountain or island ever visibly shrinks or grows
// on screen", and it is also the Pip growth-state law: a state is a capability,
// not a tween.
//
// **4. PIP WAS PROMOTED, NOT REDRAWN.** `src/videos/plants/scenes/Pip.tsx` is
// now `src/lib/kid/characters/Pip.tsx`, re-exported from `src/lib/kid`, with
// ep 4's two importers re-pointed and *nothing else touched*. Proved with the
// frame grid (PROCESS §7): six `PipPlants` frames across her growth states,
// before and after — **zero differing pixels**, against a control run that was
// also zero. `PIP_STANDIN` in `common.tsx` is now dead code for this act.
//
// **5. THE HELD BEATS ARE EMPTY, AND THE CAMERA IS PARKED BEFORE THEM.** Three
// scenes here push in (the grain in 20, the pinch in 21, nothing else) and all
// three finish moving before the silence starts. `NO_LEAD` is on every emotion
// map in the file.
//
// ---------------------------------------------------------------------------
// FLAGGED FOR THE SHOWRUNNER (details in scratchpad/ep5/act3-report.md):
//   - `CHAR_BOX.pip` in `common.tsx` is 300 and `PIP_BOX` is 460. Scene 24
//     therefore places Pip and her bubbles from `PIP_BOX` directly rather than
//     through `stand`/`bubbleOver`. One-line fix in a file this act does not
//     own.
//   - Ember carries `crust: 0.5` from Scene 18 on (she skinned over in Scene
//     17). Act 2 owns the crust knob's debut; if it hands her over at a
//     different value, this is the number to reconcile.
//   - script.md asks for the EROSION card without buying a held beat for it,
//     exactly as it did for MAGMA. The card is landed inside `a3_42` (the
//     sentence that defines the word) and is out before `a3_43` starts.
//
// ---------------------------------------------------------------------------
// AND WHAT THE RESUME WAVE'S STILL LOOP CHANGED (141 stills, five passes,
// `scratchpad/ep5/a3v1…a3v5/`; full findings in act3-audit.md / act3-report.md)
//
// The staging above was structurally complete and had never been LOOKED at.
// Nine things were wrong in the picture and invisible in the diff, and the two
// biggest were both the same mistake: **a bubble that is not over its speaker
// points at whatever else is under it.** The roll call read as the island
// greeting itself; THE BREAK read as the volcano saying "Started." Both are
// fixed by `aimTails` plus moving two bubbles, and the general rules that came
// out of it — `BUBBLE_X_MAX`, `aimTails`, `plant`, `headTop`, `TwoBeatBubble` —
// are documented at their definitions above. Three bubbles were over the kit's
// six-word limit (nine, eight and the seven the salvage pass flagged); none is
// now, and no clip, line or firing count moved to get there.

// ---------------------------------------------------------------------------
// The act's world
// ---------------------------------------------------------------------------

/** Every sea shot in this act seats on the episode's one horizon. */
const SEAT = COAST.horizon;

/** Where the drawn near water takes over from the painted far water. */
const SEA_TOP = 596;

/** The top of the new island's black rock — the ground line for act three. */
const SHORE = 892;

/** Ember's resting face for the whole act. Gleeful, never whiny. */
const EMBER_RESTING: Emotion = "excited";

/**
 * **Ember, after the sea got to her.** She skinned over in Scene 17 ("Am I
 * rock? Already?") and act three is what a character looks like once the
 * spine gag has happened to her: a dark rind on her own outline, much less
 * heat coming off, and the glow turned down — but still lit inside, because
 * "the outside cools first, the inside stays hot for a long time" is the
 * physics the script states twice and it is also the whole of her arc.
 */
const EMBER_COOLED = { crust: 0.5, wisps: 0.32, glow: 0.62 } as const;

/**
 * **How far above its own box bottom each body is actually DRAWN**, in the
 * body's natural units — measured off the components, not guessed.
 *
 * `stand()` puts a body's *box* bottom on the ground line, and every kit body
 * scales about `50% 100%`, so the box bottom is on the ground at any scale.
 * What `stand` cannot know is that the drawing does not reach the bottom of its
 * own box: Ember's drop ends at local +102 in a ±160 box (`BALL_Y + BALL_R *
 * 0.9` in `Ember.tsx`), so she hangs **58 units above her own feet**.
 *
 * On act one's beach that hides in the sand. On act three's black shelf it is a
 * band of *sea* under a character who is supposed to be standing on the newest
 * rock in the world, and it read as floating in every first-pass still.
 * `plant()` closes it. Rock (his contact shadow reaches local +158 of ±170) and
 * Drip (feet at +170 of ±190) are inside the noise and are seated plainly.
 */
const DRAWN_SLACK: Partial<Record<Body, number>> = { ember: 58 };

/**
 * `stand()`, with the drawing's own slack taken out. Returns a mark's `y`.
 *
 * It makes contact exact, so the ad-hoc `SHORE + 22 / + 34 / + 40` fudges the
 * first pass carried on three of Ember's marks are gone: every shot in the act
 * now seats her the same way, on the same line, and the shelf curve (±20 either
 * side of `SHORE`) is the only variation left.
 */
function plant(who: Body, ground: number, scale = 1): number {
  return stand(who, ground + (DRAWN_SLACK[who] ?? 0) * scale);
}

/**
 * **The widest a bubble can be at a given x**, and the reason marks in this act
 * keep their bubbles left of ~1260.
 *
 * `SpeechBubble` is an absolutely-positioned div at `left: x`, so its available
 * width is `WIDTH − x` before `maxWidth` ever applies: a bubble centred past
 * 1260 **narrows instead of moving**. That is the ep-4 kit gap the weak-points
 * list predicted would bite act three, measured. First pass put Rock's bubble
 * at x 1520 and "Ohh yeah. That is the stuff." came out as a four-line column
 * 380px wide.
 *
 * Not a helper anybody calls — a number to stage against, and the reason
 * `S19_ROCK` and `S26_ROCK` put their bubbles on the *inside* of the frame.
 */
const BUBBLE_X_MAX = 1260;

/**
 * How far the outgoing bubble leaves ahead of the incoming one when one line
 * carries two bubbles. `SpeechBubble` shrinks out over seven frames; without a
 * head start the two share the frame and the swap reads as a stutter.
 */
const BUBBLE_HANDOVER = 5;

/**
 * **Point every bubble's tail at the body that said it.**
 *
 * `SpeechBubble`'s default parks the tail at a fixed 56px inset from one corner
 * of the bubble, which is correct when the bubble is roughly over its speaker
 * and wrong the moment it is not — and a *short* bubble is never over its
 * speaker, because it is only 200px wide and the mark's offset is 300. Still
 * `a3v1/s19i`: Rock's one-word "Rock." pointed at 240px of empty sea.
 *
 * `tailAt` is clamped to inside the bubble, so this can never produce a tail
 * floating in space — it moves the tip as far toward the speaker as the bubble
 * allows and stops. Speaker comes off the line key's own suffix, the same
 * convention `speakerOf` uses.
 */
function aimTails(
  text: Record<string, string>,
  marks: Record<string, Mark>,
): Record<string, { tailAt: number }> {
  const at: Record<string, { tailAt: number }> = {};
  for (const key of Object.keys(text)) {
    const mark = marks[key.slice(key.lastIndexOf("_") + 1)];
    if (mark) at[key] = { tailAt: mark.x };
  }
  return at;
}

/**
 * **One line, two bubbles.** The kit's limit is six words and it warns rather
 * than truncating; three lines in this act are over it, and a seven- or
 * nine-word bubble wraps into a column of words that a six-year-old reads as a
 * paragraph in the sky (still `a3v1/s23f`: four lines).
 *
 * The split is the kit's own advice — "split it into two beats" — and it is a
 * *staging* change only: the clip is untouched, and the swap lands in the
 * MEASURED silence between the take's two sentences (`silencedetect` on the
 * mp3, the same method `ROLLCALL_STARTS` uses), so no bubble ever changes while
 * a word is being said. `at` is a fraction of the take, not a frame, so a
 * re-roll of the clip re-times the swap for free.
 *
 * Placement is `Bubbles`' own derivation, kept in step with it deliberately:
 * side from the mark, offset from the mark, x clamped to the same 400 margins,
 * y from `bubbleOver`.
 */
const TwoBeatBubble: React.FC<{
  mark: Mark;
  from: number;
  until: number;
  /** Fraction of the take the second beat starts at. MEASURED, never guessed. */
  at: number;
  first: string;
  second: string;
}> = ({ mark, from, until, at, first, second }) => {
  const side = mark.side ?? (mark.x < WIDTH / 2 ? "right" : "left");
  const offset = mark.offset ?? 330;
  const x = Math.max(
    400,
    Math.min(BUBBLE_X_MAX, mark.x + (side === "right" ? offset : -offset)),
  );
  const y = Math.max(170, Math.min(HEIGHT - 280, bubbleOver(mark)));
  const tail = side === "right" ? "left" : "right";
  const swap = from + Math.round((until - from) * at);
  return (
    <>
      <SpeechBubble
        x={x}
        y={y}
        text={first}
        tail={tail}
        tailAt={mark.x}
        from={from}
        until={swap - BUBBLE_HANDOVER}
      />
      <SpeechBubble
        x={x}
        y={y}
        text={second}
        tail={tail}
        tailAt={mark.x}
        from={swap}
        until={until}
      />
    </>
  );
};

type SeaPlate =
  | "island_chain_dusk"
  | "black_beach_night"
  | "sea_horizon_dawn"
  | "sea_horizon_day";

/**
 * **The island chain, as one table.**
 *
 * The naming order, the eye-lines, the roll-call bubbles and Scene 21's
 * diagram labels all read this array, so they cannot drift from one another —
 * ep 4's `SIBLINGS` doing the same job for the same gag. Scene 30's goodbye
 * (the recap agent's) greets the same five in the same order and should import
 * this rather than retyping it.
 *
 * `age` is only a comment: the colours are explicit, because the chain is a
 * *diagram* in Scene 21 and a ramp would put two of the five in between two
 * lesson colours. Newest to oldest: black rock → rock with a first sandy
 * crown → sand → green → and the oldest one has eroded to a bar of sand with
 * a name.
 */
export type ChainIsland = {
  name: string;
  x: number;
  /** Half-width at the waterline. */
  w: number;
  /** Height above the waterline. */
  h: number;
  body: string;
  /** The cap, if the island has aged into one. */
  cap?: string;
  /** Atmospheric perspective, 0..1 toward the sky. */
  haze: number;
};

export const CHAIN: ChainIsland[] = [
  { name: "Island", x: 838, w: 176, h: 108, body: "#3a3138", haze: 0.14 },
  { name: "Islet", x: 1136, w: 100, h: 64, body: "#4a4046", cap: "#dcc294", haze: 0.24 },
  { name: "other Island", x: 1364, w: 134, h: 78, body: "#cbad7e", cap: "#e3cea0", haze: 0.32 },
  { name: "Island the third", x: 1580, w: 98, h: 54, body: "#8a7f5e", cap: "#5aa845", haze: 0.4 },
  { name: "Sandy", x: 1758, w: 78, h: 13, body: "#e6d3a4", haze: 0.48 },
];

/** Where an island's face is, for a look. */
function chainCentre(i: ChainIsland): { x: number; y: number } {
  return { x: i.x, y: SEAT - i.h * 0.55 };
}

/**
 * One island: a low dome standing on the waterline, hazed toward the sky.
 *
 * Drawn as a single closed path rather than a half-ellipse — an ellipse gives
 * every island the identical profile and five identical domes read as a
 * repeating tile rather than as a chain. The two shoulder control points are
 * asymmetric by a fixed fraction of the width, so they are all the same
 * *family* and none of them is the same shape.
 */
const Island: React.FC<{ island: ChainIsland; haze: string }> = ({ island, haze }) => {
  const { x, w, h } = island;
  const body = mixHex(island.body, haze, island.haze);
  const dark = mixHex(body, kidTheme.ink, 0.22);
  const base = SEAT;
  // A sandbar is not a dome: it is a lozenge lying on the water with almost
  // nothing above it, and it is the erosion lesson hiding inside the naming.
  if (h < 20) {
    return (
      <g>
        <ellipse cx={x} cy={base - h * 0.4} rx={w} ry={h} fill={body} />
        <ellipse cx={x} cy={base - h * 0.4} rx={w * 0.6} ry={h * 0.5} fill={mixHex(body, kidTheme.paper, 0.3)} />
      </g>
    );
  }
  const d =
    `M ${x - w} ${base}` +
    ` C ${x - w * 0.82} ${base - h * 0.52} ${x - w * 0.42} ${base - h * 0.94} ${x - w * 0.08} ${base - h}` +
    ` C ${x + w * 0.3} ${base - h * 1.02} ${x + w * 0.76} ${base - h * 0.6} ${x + w} ${base}` +
    ` Z`;
  return (
    <g>
      <path d={d} fill={body} />
      {/* The cap: an older island's sand or its green, sitting on the crest
          rather than replacing the rock — the chain is a diagram of one
          process, so every island keeps the rock it started as underneath. */}
      {island.cap ? (
        <path
          d={
            `M ${x - w * 0.74} ${base - h * 0.44}` +
            ` C ${x - w * 0.5} ${base - h * 0.9} ${x + w * 0.2} ${base - h * 1.0} ${x + w * 0.66} ${base - h * 0.4}` +
            ` C ${x + w * 0.2} ${base - h * 0.62} ${x - w * 0.34} ${base - h * 0.66} ${x - w * 0.74} ${base - h * 0.44}` +
            ` Z`
          }
          fill={mixHex(island.cap, haze, island.haze)}
        />
      ) : null}
      {/* One flat shadow side, kept to the same side on every island: the light
          in this act comes from wherever the plate's warm edge is, and five
          islands lit from five directions is five accidents. */}
      <path
        d={
          `M ${x + w * 0.24} ${base - h * 0.86}` +
          ` C ${x + w * 0.64} ${base - h * 0.64} ${x + w * 0.86} ${base - h * 0.3} ${x + w} ${base}` +
          ` L ${x + w * 0.2} ${base} Z`
        }
        fill={dark}
        opacity={0.5}
      />
    </g>
  );
};

/** The whole chain, at the horizon. */
const IslandChain: React.FC<{ haze: string; from?: number }> = ({ haze, from = 0 }) => (
  <WideLayer zIndex={Z.scenery}>
    {CHAIN.slice(from).map((island) => (
      <Island key={island.name} island={island} haze={haze} />
    ))}
  </WideLayer>
);

/**
 * **The near water.** The plate paints the far sea and the horizon; this is the
 * band in front of it, and it exists for the ep-4 `NearField` reason: the four
 * plates this act cycles through put their own near colour at four different
 * depths, and a body standing on a rock at `SHORE` cannot be in the sea in one
 * shot and on the water in the next.
 *
 * Tinted from `PLATES[key].near` — the plate's own sampled water — so the seam
 * is the same colour by construction, feathered over three climbing ghost
 * copies, and carrying two slow swell strokes because a plate is never dead
 * still and anything that rolls stays SVG.
 */
const NearSea: React.FC<{ near: string; phase?: number; top?: number }> = ({
  near,
  phase = 0,
  top = SEA_TOP,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase;
  const deep = mixHex(near, kidTheme.ink, 0.34);
  const foam = mixHex(near, kidTheme.paper, 0.42);
  const swell = Math.sin(t * 0.62) * 6;
  const edge = (lift: number): string =>
    `M ${WIDE.x} ${WIDE.y + WIDE.h}` +
    ` L ${WIDE.x} ${(top - lift + swell).toFixed(1)}` +
    ` Q ${WIDTH * 0.28} ${(top - 22 - lift + swell).toFixed(1)} ${WIDTH * 0.6} ${(top - 6 - lift + swell).toFixed(1)}` +
    ` Q ${WIDTH * 0.88} ${(top + 10 - lift + swell).toFixed(1)} ${WIDE.x + WIDE.w} ${(top - 14 - lift + swell).toFixed(1)}` +
    ` L ${WIDE.x + WIDE.w} ${WIDE.y + WIDE.h} Z`;
  return (
    <WideLayer zIndex={Z.ground + 3}>
      {[46, 30, 15].map((lift, i) => (
        <path key={lift} d={edge(lift)} fill={near} opacity={0.22 + i * 0.2} />
      ))}
      <path d={edge(0)} fill={near} />
      {/* Two swell lines, well apart, moving at different rates. Never one:
          one line across a flat field of colour reads as a scratch. */}
      {[0, 1].map((i) => {
        const y = top + 96 + i * 132 + Math.sin(t * (0.5 + i * 0.17) + i) * 7;
        return (
          <path
            key={i}
            d={
              `M ${WIDE.x} ${y.toFixed(1)}` +
              ` Q ${WIDTH * 0.3} ${(y - 16).toFixed(1)} ${WIDTH * 0.62} ${(y - 2).toFixed(1)}` +
              ` Q ${WIDTH * 0.9} ${(y + 12).toFixed(1)} ${WIDE.x + WIDE.w} ${(y - 6).toFixed(1)}`
            }
            stroke={i === 0 ? foam : deep}
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
            opacity={0.3}
          />
        );
      })}
    </WideLayer>
  );
};

/**
 * **The newest place in the world**, and the ground every body in this act
 * stands on.
 *
 * Two pieces. The SHELF is the black rock at the bottom of frame, and its top
 * edge is `SHORE` — a real ground line, so `stand()` means what it means
 * everywhere else in the episode. The CREST is the hill rising behind it, and
 * it is a **step function of the scene's span index**: it changes at a cut and
 * never between two frames. That is the physics ledger, drawn.
 *
 * The cracks are warm because the rock is a day old. `soil` puts the first
 * pinch of dirt in one of them (Scene 21, and Scene 25's seed lands in it).
 */
const BasaltShore: React.FC<{
  crest?: number;
  near: string;
  glow?: number;
  soil?: number;
  seed?: number;
}> = ({ crest = 0, near, glow = 1, soil = 0, seed = 0 }) => {
  const rock = "#332b31";
  const lit = mixHex(rock, EMBER_COLOR.glow, 0.16);
  const surf = mixHex(near, kidTheme.paper, 0.55);
  const hillY = SHORE - crest;
  return (
    <WideLayer zIndex={Z.ground + 4}>
      {/* THE CREST, behind the shelf, so its foot is never drawn. */}
      {crest > 4 ? (
        <path
          d={
            `M -420 ${SHORE + 40}` +
            ` C ${180} ${SHORE - crest * 0.18} ${640} ${hillY + crest * 0.1} ${1010} ${hillY}` +
            ` C ${1360} ${hillY - crest * 0.06} ${1720} ${SHORE - crest * 0.34} ${2340} ${SHORE + 40}` +
            ` Z`
          }
          fill={mixHex(rock, kidTheme.ink, 0.18)}
        />
      ) : null}
      {/* THE RIM LIGHT ON THE RIDGE, and it is a STROKE of the silhouette
          rather than a filled shape.
          First pass filled a separate quad and closed it on a straight
          `L 900 …` — which at any crest over about 150 drew a flat grey slab
          lying across the black hill with a hard bottom edge, visible in eight
          of this act's nine scenes. Stroking the *same two cubics* the
          silhouette above is built from cannot come apart from it: the
          highlight is the ridge, by construction, at every crest height. */}
      {crest > 4 ? (
        <path
          d={
            `M -420 ${SHORE + 40}` +
            ` C ${180} ${SHORE - crest * 0.18} ${640} ${hillY + crest * 0.1} ${1010} ${hillY}` +
            ` C ${1360} ${hillY - crest * 0.06} ${1720} ${SHORE - crest * 0.34} ${2340} ${SHORE + 40}`
          }
          stroke={lit}
          strokeWidth={Math.max(9, crest * 0.045)}
          strokeLinecap="round"
          fill="none"
          opacity={0.4}
        />
      ) : null}

      {/* THE SHELF. */}
      <path
        d={
          `M ${WIDE.x} ${WIDE.y + WIDE.h}` +
          ` L ${WIDE.x} ${SHORE + 26}` +
          ` Q ${420} ${SHORE - 18} ${900} ${SHORE}` +
          ` Q ${1420} ${SHORE + 18} ${WIDE.x + WIDE.w} ${SHORE - 12}` +
          ` L ${WIDE.x + WIDE.w} ${WIDE.y + WIDE.h} Z`
        }
        fill={rock}
      />
      {/* The wet edge where the rock meets the water — the one line that says
          this is a shore and not a floor. */}
      <path
        d={
          `M ${WIDE.x} ${SHORE + 20}` +
          ` Q ${420} ${SHORE - 24} ${900} ${SHORE - 6}` +
          ` Q ${1420} ${SHORE + 12} ${WIDE.x + WIDE.w} ${SHORE - 18}`
        }
        stroke={surf}
        strokeWidth={9}
        strokeLinecap="round"
        fill="none"
        opacity={0.5}
      />
      {/* Warm cracks. A day-old rock still has the inside showing through, and
          this is where Scene 21's first pinch of soil gathers and where Scene
          25's seed lands. */}
      {[
        { x: 300, w: 190, y: 40 },
        { x: 760, w: 150, y: 74 },
        { x: 1240, w: 210, y: 52 },
        { x: 1660, w: 130, y: 92 },
      ].map((c) => (
        <path
          key={c.x}
          d={
            `M ${c.x} ${SHORE + c.y}` +
            ` q ${c.w * 0.4} ${-14} ${c.w * 0.68} ${6}` +
            ` q ${c.w * 0.2} ${16} ${c.w * 0.32} ${-4}`
          }
          stroke={EMBER_COLOR.hot}
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
          opacity={0.42 * glow}
        />
      ))}
      {/* THE PINCH. One crack, one crumb of soil, and the whole loop turns on
          it. It is deliberately tiny — "It is very small." is a line. */}
      {soil > 0.02 ? (
        <g opacity={soil}>
          <ellipse cx={SOIL_AT.x} cy={SOIL_AT.y} rx={38} ry={13} fill="#4b3a24" />
          <ellipse cx={SOIL_AT.x - 10} cy={SOIL_AT.y - 4} rx={17} ry={7} fill="#6b5233" />
          <ellipse cx={SOIL_AT.x + 15} cy={SOIL_AT.y - 2} rx={9} ry={5} fill="#3c8f36" opacity={0.8} />
        </g>
      ) : null}
      {seed > 0.02 ? (
        <g opacity={seed}>
          <ellipse cx={SOIL_AT.x + 4} cy={SOIL_AT.y - 12} rx={11} ry={8} fill={PIP_COLOR.seed} />
        </g>
      ) : null}
    </WideLayer>
  );
};

/** The crack the first soil gathers in. Scenes 21 and 25 both aim at it. */
const SOIL_AT = { x: 806, y: SHORE + 74 } as const;

/**
 * **A sea wide.** The plate, the chain, the mountain on the painted horizon,
 * the drawn near water, the drawn shore, and the cast in front of all of it.
 *
 * The plate is inside the camera, exactly as `CoastWorld`'s is: a shot that
 * pushes in has to push in on its own world, and because the seat is a
 * fraction of the plate rather than a screen position, a zoom keeps the
 * mountain on the painted horizon for free.
 */
const SeaWorld: React.FC<{
  bg: SeaPlate;
  phase?: number;
  cam?: Cam;
  drift?: number;
  chain?: boolean | number;
  crest?: number;
  glow?: number;
  soil?: number;
  seed?: number;
  volcano?: {
    x?: number;
    scale?: number;
    awake?: number;
    smoke?: number;
    rim?: number;
    speaking?: boolean;
    look?: LookDirection;
    emotion?: Emotion;
    erupt?: number;
    breath?: number;
    ashAt?: number;
  };
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({
  bg,
  phase = 0,
  cam,
  drift,
  chain = true,
  crest = 0,
  glow = 1,
  soil = 0,
  seed = 0,
  volcano,
  overlay,
  children,
}) => {
  const near = PLATES[bg].near;
  return (
    <KidBackdrop variant="day" clouds={0}>
      <AbsoluteFill style={{ background: mixHex(near, kidTheme.ink, 0.2) }} />
      <Camera cam={cam ?? { x: WIDTH / 2, y: HEIGHT / 2 }}>
        <Plate bg={bg} seat={SEAT} phase={phase} drift={drift} />
        {chain !== false ? (
          <IslandChain haze={mixHex(near, kidTheme.paper, 0.4)} from={chain === true ? 0 : chain} />
        ) : null}
        <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery + 1 }}>
          <Volcano
            x={volcano?.x ?? 316}
            base={SEAT}
            scale={volcano?.scale ?? 1.6}
            phase={PHASE.volcano}
            awake={volcano?.awake ?? 1}
            smoke={volcano?.smoke ?? 0.45}
            rim={volcano?.rim ?? 0}
            speaking={volcano?.speaking}
            look={volcano?.look}
            emotion={volcano?.emotion}
            erupt={volcano?.erupt}
            breath={volcano?.breath}
            ashAt={volcano?.ashAt}
          />
        </div>
        <NearSea near={near} phase={phase} />
        <BasaltShore crest={crest} near={near} glow={glow} soil={soil} seed={seed} />
        <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>{children}</div>
      </Camera>
      {overlay ? (
        <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>{overlay}</AbsoluteFill>
      ) : null}
    </KidBackdrop>
  );
};

// `Camera` is re-exported through common; pulled out here so `SeaWorld` reads.
import { Camera } from "./common";

/**
 * **The named-span stamp**, and it is deliberately NOT a `WordCard`.
 *
 * STYLE is explicit that the Big Word card's format is a signature a six-year
 * old learns and shouts along with, and that spending it on something that is
 * not a vocabulary word stops it meaning "learn this" — episode two's rule
 * stamp got its own treatment for the same reason. So a span gets a small,
 * quiet, lower-left plate: no starburst, no banner colour, no letter hop. It
 * lands ON the jump cut and it is gone before the next line.
 *
 * It is also the only thing that makes the physics ledger's "time passes in
 * NAMED SPANS, never a time-lapse" legible: the cut says something changed and
 * the stamp says what, in words, which is what "named" means.
 */
const SpanStamp: React.FC<{ text: string; from: number; hold?: number }> = ({
  text,
  from,
  hold = 62,
}) => {
  const frame = useCurrentFrame();
  if (frame < from - 2 || frame > from + hold + 12) return null;
  const inU = interpolate(frame, [from, from + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutBack,
  });
  const outU = interpolate(frame, [from + hold, from + hold + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const u = Math.min(inU, outU);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        bottom: 84,
        padding: "18px 40px",
        borderRadius: kidRadius.chip,
        background: "rgba(36,52,71,0.72)",
        opacity: u,
        transform: `scale(${(0.86 + u * 0.14).toFixed(3)})`,
        transformOrigin: "0% 50%",
        fontFamily: kidTheme.fontFamily,
        fontSize: kidType.min,
        fontWeight: 900,
        letterSpacing: 4,
        color: kidTheme.paper,
        textShadow: kidInkOutline(2),
      }}
    >
      {text}
    </div>
  );
};

/** A hard hat, for a demolition crew that is genuinely a demolition crew. */
const HardHat: React.FC<{ x: number; y: number; scale?: number; tilt?: number }> = ({
  x,
  y,
  scale = 1,
  tilt = 0,
}) => (
  <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${tilt}) scale(${scale})`}>
    <path
      d="M -62 6 Q -60 -46 0 -48 Q 60 -46 62 6 Z"
      fill={kidTheme.sun}
      stroke={kidTheme.sunDeep}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <rect x={-78} y={2} width={156} height={16} rx={8} fill={kidTheme.sun} stroke={kidTheme.sunDeep} strokeWidth={6} />
    <path d="M -3 -46 L -3 4" stroke={kidTheme.sunDeep} strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** One pappus seed: Pipsqueak, and every sibling she has. Silent, always. */
const PappusSeed: React.FC<{ x: number; y: number; scale?: number; rot?: number; opacity?: number }> = ({
  x,
  y,
  scale = 1,
  rot = 0,
  opacity = 1,
}) => (
  <g
    transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${scale})`}
    opacity={opacity}
  >
    {/* Each spoke is drawn twice: a soft ink underlay, then the fluff on top.
        A pale pappus against a pale dawn sky (Scene 25) or a bright meadow
        (Scene 24) had nothing to read against — and this seed is the loop
        closing, not set dressing. */}
    {Array.from({ length: 9 }, (_, i) => {
      const a = -Math.PI / 2 + (i - 4) * 0.3;
      const d = `M 0 -14 L ${(Math.cos(a) * 46).toFixed(1)} ${(Math.sin(a) * 46 - 14).toFixed(1)}`;
      return (
        <g key={i}>
          <path d={d} stroke={kidTheme.ink} strokeWidth={9} strokeLinecap="round" opacity={0.16} />
          <path d={d} stroke={PIP_COLOR.fluff} strokeWidth={5} strokeLinecap="round" opacity={0.95} />
        </g>
      );
    })}
    <ellipse cx={0} cy={4} rx={12} ry={9} fill={PIP_COLOR.seed} stroke={PIP_COLOR.seedDeep} strokeWidth={3} />
  </g>
);

// ---------------------------------------------------------------------------
// Scene 18 — ROLL CALL, firing 1: the island chain
// ---------------------------------------------------------------------------
//
// The series signature, and the picture is one the act already has: the
// horizon has been hiding an archipelago for four whole shows, and it is the
// volcano's CV. Nobody replies inside the naming, so the ONLY things that move
// during `a3_13` are Ember's eyes and the bubble in the square of sky above
// her.
//
// **The four swaps are MEASURED.** `npx remotion ffmpeg -af
// silencedetect=noise=-32dB:d=0.10` on `a3_13_ember.mp3` (4.320s) finds six
// silences: three of them are the phrase boundaries (0.777–1.044, 1.544–1.865,
// 2.672–2.966) and the rest are inside phrases — the 0.11s between "Island the"
// and "third" would have swapped the bubble mid-name. The fractions below are
// the MIDDLES of the three boundary gaps, so every swap happens while nobody is
// talking, and they are fractions rather than frames so a re-roll of the clip
// re-times all four for free.

const ROLLCALL_STARTS = [0, 0.211, 0.394, 0.653] as const;

/**
 * **The square of sky the greeting happens in.** Every name lands here.
 *
 * x is 800 and not 940, and the 140px matter: a bubble's tail is clamped to
 * inside its own bubble, so at 940 the tip landed at x≈700 — **on the black
 * island's slope** (island 0 spans 662–1014), and stills `a3v1/s18b`/`s18e`
 * read as the island greeting itself rather than as Ember greeting it. At 800
 * the widest name still clamps its tail to a tip inside her silhouette, and the
 * square of sky is still clear of the chain.
 */
const ROLLCALL_AT = { x: 800, y: 268 } as const;

const S18_EMBER = { x: 548, scale: 0.98 } as const;

const RollCall: React.FC<{ at: number[]; until: number; tailAt: number }> = ({
  at,
  until,
  tailAt,
}) => (
  <>
    {CHAIN.slice(0, 4).map((island, i) => (
      <SpeechBubble
        key={island.name}
        x={ROLLCALL_AT.x}
        y={ROLLCALL_AT.y}
        text={`Hi, ${island.name}!`}
        tail="left"
        tailAt={tailAt}
        from={at[i]}
        until={i + 1 < at.length ? at[i + 1] - BUBBLE_HANDOVER : until}
        zIndex={44}
      />
    ))}
  </>
);

const RollCallScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const [nameFrom, nameTo] = lineWindow(scene, "a3_13_ember");
  const [sandyFrom, sandyTo] = lineWindow(scene, "a3_14_ember");
  const [everyFrom, everyTo] = lineWindow(scene, "a3_15_narrator");
  const [newOneFrom] = lineWindow(scene, "a3_16_ember");

  const mark: Mark = {
    x: S18_EMBER.x,
    y: plant("ember", SHORE, S18_EMBER.scale),
    scale: S18_EMBER.scale,
    who: "ember",
    side: "right",
    offset: 340,
  };

  // HER EYES WALK THE LINE. One island per measured phrase, so the bubble
  // saying a name and the eyes finding that island are the same instant by
  // construction. An even quarter drifts most of a second off the delivered
  // take by the fourth name — a hero looking at the wrong island while she
  // names it, which is the one thing this gag cannot survive.
  const nameLen = Math.max(1, nameTo - nameFrom);
  const sayAt = ROLLCALL_STARTS.map((f) => nameFrom + Math.round(f * nameLen));
  let which = -1;
  for (let i = 0; i < sayAt.length; i += 1) if (frame >= sayAt[i]) which = i;
  if (frame >= sandyFrom) which = 4;
  const centre = { x: mark.x, y: mark.y };
  const look: LookDirection =
    frame >= nameFrom && frame < everyTo && which >= 0
      ? lookAt(centre, chainCentre(CHAIN[Math.min(which, 4)]))
      : "camera";

  // **THE MOUNTAIN READS HIS OWN CV.** During the Narrator's flat middle —
  // "Every island down that coast is one of his" — his eyes travel down the
  // chain and back. It is the only thing in the scene that moves besides her,
  // it is not a reply (nobody replies inside a roll call, and this is after
  // it), and it is the entire staging vocabulary he has: "the mountain moved
  // slightly and that is enormous."
  const cvU = interpolate(frame, [everyFrom + 20, everyTo - 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  // **AND HE DOES NOT SNAP BACK.** First pass returned his look to `"camera"`
  // at `everyTo` — which is the FIRST FRAME of the scripted 36f hold, so a pair
  // of five-hundred-pixel pupils hard-cut inside the silence. `look` is a
  // direction, not a spring; there is no morph to hide it. He keeps his eyes at
  // the far end of his own coastline for the rest of the scene, which is also
  // the better read: Ember's button lands on a mountain still looking at the
  // last island he made.
  const volcanoLook: LookDirection =
    frame >= everyFrom ? { x: 0.15 + cvU * 0.85, y: 0.25 } : "camera";

  return (
    <SeaWorld
      bg="island_chain_dusk"
      phase={1.4}
      crest={60}
      volcano={{ x: 300, scale: 1.72, smoke: 0.5, rim: 0.55, look: volcanoLook }}
      overlay={
        <>
          <RollCall at={sayAt} until={nameTo} tailAt={mark.x} />
          <Bubbles
            scene={scene}
            cast={{ ember: mark } as Cast}
            text={{
              a3_14_ember: "Hi, Sandy.",
              a3_16_ember: "I am the new one.",
            }}
            at={{
              a3_14_ember: { ...ROLLCALL_AT, tail: "left", tailAt: mark.x },
              a3_16_ember: { ...ROLLCALL_AT, tail: "left", tailAt: mark.x },
            }}
          />
        </>
      }
    >
      <Ember
        x={mark.x}
        y={mark.y}
        scale={S18_EMBER.scale}
        phase={PHASE.ember}
        {...EMBER_COOLED}
        // Her whole gesture rig is the lean, and here it is a hero leaning out
        // along a coastline she has just been told is a queue. It parks flat
        // for the button, because a button is stillness.
        lean={frame >= newOneFrom ? 0 : frame >= nameFrom && frame < everyTo ? 7 : 3}
        squish={frame >= sandyFrom && frame < sandyTo ? -0.1 : 0}
        emotion={useEmotion(scene, "ember", {}, EMBER_RESTING, NO_LEAD)}
        speaking={stage.speaking("ember")}
        look={look}
      />
    </SeaWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 19 — the island grows
// ---------------------------------------------------------------------------
//
// **FIVE STATES, FOUR CUTS, AND NOTHING TWEENS.** The camera does not move
// once in sixty-six seconds, Ember and Rock never leave their marks, and the
// only two things that change are the hour (a different plate, seated on the
// same horizon) and how high the island stands behind them. That is the
// physics ledger's rule drawn rather than described: an island that grew on
// screen would be a lie a six-year-old can see, and a time-lapse would be the
// same lie faster.
//
// The three stamps are the "named" half of "named spans". The fourth cut has
// no stamp because the Narrator is naming it out loud in the same breath —
// "an island. Brand new."

type Span = { plate: SeaPlate; crest: number; erupt: number; stamp?: string };

const S19_SPANS: Span[] = [
  { plate: "island_chain_dusk", crest: 60, erupt: 0.45 },
  { plate: "black_beach_night", crest: 158, erupt: 0.62, stamp: "ONE YEAR LATER" },
  { plate: "sea_horizon_dawn", crest: 256, erupt: 0.4, stamp: "A WHILE LATER" },
  { plate: "island_chain_dusk", crest: 354, erupt: 0.95, stamp: "LATER THAT CENTURY" },
  { plate: "sea_horizon_day", crest: 470, erupt: 0.22 },
];

const S19_EMBER = { x: 472, scale: 0.98 } as const;
const S19_ROCK = { x: 1180, scale: 0.62 } as const;

const S19_BUBBLES: Record<string, string> = {
  a3_18_ember: "You are building me wrong.",
  a3_20_ember: "How long until it is finished?",
  a3_21_rock: "Ten thousand years.",
  a3_22_ember: "Done!",
  a3_23_rock: "Started.",
  a3_24_rock: "Ohh yeah. That is the stuff.",
  a3_25_rock: "You will change names once more.",
  a3_26_ember: "To what?",
  a3_27_rock: "Rock.",
  a3_28_ember: "That is your name.",
  a3_29_rock: "It is a very popular name.",
  a3_32_ember: "Done!",
  a3_33_rock: "Started.",
};

const IslandGrowsScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const [, yearTo] = lineWindow(scene, "a3_17_narrator");
  const [, whileTo] = lineWindow(scene, "a3_19_narrator");
  const [centuryAt] = lineWindow(scene, "a3_24_rock");
  const [surfaceFrom, surfaceTo] = lineWindow(scene, "a3_31_narrator");

  // **THE CENTURY CUT LANDS ON ROCK'S LINE, NOT IN FRONT OF IT.** Every slot
  // near it is one of his 24-frame identity gaps, and those are byte-identical
  // and nothing is staged inside them. A cut on the first frame of `a3_24` is
  // the only place left, and it turns out to be the better joke anyway: a
  // whole century goes past and the very next thing that happens is Rock
  // saying the identical sentence he said in act two.
  const cuts = [
    yearTo,
    whileTo,
    centuryAt,
    surfaceFrom + Math.round((surfaceTo - surfaceFrom) * 0.42),
  ];
  let span = 0;
  for (let i = 0; i < cuts.length; i += 1) if (frame >= cuts[i]) span = i + 1;
  const state = S19_SPANS[span];

  const emberMark: Mark = {
    x: S19_EMBER.x,
    y: plant("ember", SHORE, S19_EMBER.scale),
    scale: S19_EMBER.scale,
    who: "ember",
    // 260, not 330: this scene's shortest bubbles are one word ("Done!"), and
    // a 200px bubble at 330 leaves its tail a fifth of the frame from her even
    // after `aimTails` pushes it as far over as the bubble allows.
    side: "right",
    offset: 260,
  };
  // **ROCK'S BUBBLE OPENS INWARD**, and that is `BUBBLE_X_MAX`, not taste. On
  // his right it landed at x 1520 with 400px of frame left to be wide in, and
  // "Ohh yeah. That is the stuff." came out as a four-line column (still
  // `a3v1/s19g`). On his left it has the whole middle of the frame, and the
  // tail still leaves from the edge nearest him.
  const rockMark: Mark = {
    x: S19_ROCK.x,
    y: stand("rock", SHORE + 8),
    scale: S19_ROCK.scale,
    who: "rock",
    side: "left",
    offset: 240,
  };

  // She is impatient with a mountain; her lean is aimed at it, and it drops to
  // nothing on "Done!" because a verdict is delivered flat.
  const done = frame >= lineWindow(scene, "a3_22_ember")[0];
  const emberLook: LookDirection =
    stage.current === "rock" ? lookAt(emberMark, rockMark) : { x: -0.7, y: -0.3 };

  return (
    <SeaWorld
      bg={state.plate}
      phase={2.1}
      crest={state.crest}
      chain={span >= 3 ? 2 : true}
      glow={span >= 3 ? 0.7 : 1}
      volcano={{
        x: 296,
        scale: 1.72,
        smoke: 0.4,
        erupt: state.erupt,
        rim: state.plate === "black_beach_night" ? 0.9 : 0.4,
        look: "camera",
      }}
      overlay={
        <>
          {S19_SPANS.map((s, i) =>
            s.stamp ? <SpanStamp key={s.stamp} text={s.stamp} from={cuts[i - 1]} /> : null,
          )}
          <Bubbles
            scene={scene}
            cast={{ ember: emberMark, rock: rockMark } as Cast}
            text={S19_BUBBLES}
            at={aimTails(S19_BUBBLES, { ember: emberMark, rock: rockMark })}
          />
        </>
      }
    >
      <Ember
        x={emberMark.x}
        y={emberMark.y}
        scale={S19_EMBER.scale}
        phase={PHASE.ember}
        {...EMBER_COOLED}
        lean={done ? 0 : -8}
        emotion={useEmotion(
          scene,
          "ember",
          { a3_18_ember: "grumpy", a3_20_ember: EMBER_RESTING, a3_22_ember: "proud" },
          EMBER_RESTING,
          NO_LEAD,
        )}
        speaking={stage.speaking("ember")}
        look={emberLook}
      />
      {/* Rock does not look at anybody. Four episodes of that is who he is. */}
      <Rock
        x={rockMark.x}
        y={rockMark.y}
        scale={S19_ROCK.scale}
        phase={PHASE.rock}
        speaking={stage.speaking("rock")}
      />
    </SeaWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 20 — the demolition crew
// ---------------------------------------------------------------------------
//
// Rain and wind arrive to take the OLD islands apart, **cheerfully** — the
// scope rule holds all the way through act three, and this is the scene most
// likely to break it. Nothing is menaced. The crew is delighted, they wear
// hard hats, and the entire morning's work is one grain of sand.
//
// The windup and the payoff are the scene: `a3_37` is Drip announcing that the
// whole mountain is coming down, and 36 frames of silence later exactly one
// grain has popped off, rolled, and stopped. **The camera is parked before the
// grain leaves the cliff** — a push still moving inside a held beat is the leak
// the script's rule exists to stop.

const S20_CLIFF = { x: 1450, top: 372, foot: 830 } as const;

const S20_BUBBLES: Record<string, string> = {
  a3_35_drip: "Hi! It's me! I'm the weather!",
  // `a3_36_puff` is NOT here: his catch-phrase is nine words, and it is staged
  // as two beats below. The migrated take's "FEEL" capital survives the split —
  // it is the approved recording's own emphasis, drawn.
  a3_37_drip: "We are taking this mountain down!",
  a3_39_ember: "How long to break a mountain?",
  a3_40_rock: "Ten thousand years.",
  a3_44_ember: "The worst number I ever heard.",
  a3_45_drip: "We know! We love it!",
  a3_46_sunny: "My rain! My wind!",
  a3_47_sunny: "You're welcome! HA! HA!",
};

/**
 * **The old green island's cliff.** Drawn, because a grain comes off it and a
 * character lines up with it — and because the whole lesson is that this used
 * to be the shape the newest island is now.
 */
const Cliff: React.FC<{ haze: string }> = ({ haze }) => {
  const rock = mixHex("#7b6f57", haze, 0.16);
  const face = mixHex(rock, kidTheme.ink, 0.24);
  const green = mixHex("#5aa845", haze, 0.12);
  const { x, top, foot } = S20_CLIFF;
  return (
    <WideLayer zIndex={Z.ground + 5}>
      <path
        d={
          `M ${x - 90} ${foot + 60}` +
          ` L ${x - 40} ${top + 40}` +
          ` Q ${x - 10} ${top} ${x + 70} ${top - 4}` +
          ` L 2340 ${top - 40} L 2340 ${foot + 60} Z`
        }
        fill={rock}
      />
      <path
        d={`M ${x - 40} ${top + 40} L ${x - 90} ${foot + 60} L ${x + 60} ${foot + 60} L ${x + 30} ${top + 24} Z`}
        fill={face}
        opacity={0.6}
      />
      {/* The green cap: this island is old enough to be the lush one. */}
      <path
        d={`M ${x - 42} ${top + 40} Q ${x - 12} ${top - 8} ${x + 74} ${top - 12} L 2340 ${top - 48} L 2340 ${top + 6} Q ${x + 40} ${top + 22} ${x - 30} ${top + 62} Z`}
        fill={green}
      />
      {/* Strata: the layers the volcano built it out of, a chain older than the
          one on the horizon. Two flat lines, not a texture. */}
      {[0.34, 0.6].map((f) => (
        <path
          key={f}
          d={`M ${x - 62 - f * 40} ${top + 40 + (foot - top) * f} L 2340 ${top + (foot - top) * f}`}
          stroke={face}
          strokeWidth={7}
          opacity={0.4}
        />
      ))}
    </WideLayer>
  );
};

/** Rain and wind, cheerful, and both of them are characters' bodies at work. */
const Weather: React.FC<{ strength: number; t: number }> = ({ strength, t }) => {
  if (strength <= 0.02) return null;
  return (
    <WideLayer zIndex={Z.cast - 1}>
      {/* The rain band starts at 620, not 1080. Drip announces "I'm the
          weather" standing at 900, and the first pass left the whole left half
          of frame — and Drip himself — dry. */}
      {Array.from({ length: 22 }, (_, i) => {
        const u = ((t * 1.25 + i / 22) % 1);
        const x = 620 + ((i * 331) % 1330) - u * 90;
        const y = 120 + u * 760;
        return (
          <path
            key={`r${i}`}
            d={`M ${x.toFixed(0)} ${y.toFixed(0)} l -22 56`}
            stroke={kidTheme.waterLight}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={strength * 0.5 * Math.sin(u * Math.PI)}
          />
        );
      })}
      {Array.from({ length: 5 }, (_, i) => {
        const u = ((t * 0.5 + i / 5) % 1);
        const y = 300 + i * 96 + Math.sin(t + i) * 12;
        const x = 600 + u * 1500;
        return (
          <g key={`w${i}`} opacity={strength * 0.45 * Math.sin(u * Math.PI)}>
            <path
              d={`M ${x.toFixed(0)} ${y.toFixed(0)} q 90 -14 170 2`}
              stroke={kidTheme.air}
              strokeWidth={7}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M ${(x + 40).toFixed(0)} ${(y + 26).toFixed(0)} q 70 -10 130 2`}
              stroke={kidTheme.air}
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
              opacity={0.7}
            />
          </g>
        );
      })}
    </WideLayer>
  );
};

const DemolitionScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [dripFrom] = lineWindow(scene, "a3_35_drip");
  const [windupFrom, windupTo] = lineWindow(scene, "a3_37_drip");
  const [workFrom] = lineWindow(scene, "a3_38_narrator");
  const [breakFrom, breakTo] = lineWindow(scene, "a3_42_narrator");
  const [sunnyFrom] = lineWindow(scene, "a3_46_sunny");
  const [feelFrom, feelTo] = lineWindow(scene, "a3_36_puff");

  const emberMark: Mark = { x: 300, y: plant("ember", SHORE, 0.74), scale: 0.74, who: "ember", side: "right", offset: 300 };
  const rockMark: Mark = { x: 620, y: stand("rock", SHORE + 6), scale: 0.5, who: "rock", side: "right", offset: 300 };
  const dripMark: Mark = { x: 900, y: stand("drip", SHORE - 4), scale: 0.72, who: "drip", side: "left", offset: 330 };
  const puffMark: Mark = { x: 1170, y: hover("puff", 560, 0.86), scale: 0.86, who: "puff", side: "left", offset: 330 };
  // 240 rather than 208: at 208 his box top is above the frame and the rays on
  // his crown are sliced off by the top edge.
  const sunnyMark: Mark = { x: 1596, y: hover("sunny", 240, 0.98), scale: 0.98, who: "sunny", side: "left", offset: 360 };

  // THE PUSH, AND WHERE IT STOPS. It runs under the windup and is parked six
  // frames before the line ends, so the grain leaves the cliff into a still
  // frame and the 36f of silence has nothing moving in it at all.
  const zoom = interpolate(frame, [windupFrom + 10, windupTo - 6], [1, 1.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const pushed = frame >= windupFrom + 10 && frame < workFrom;
  const cam: Cam = pushed
    ? { x: S20_CLIFF.x + 40, y: S20_CLIFF.top + 60, zoom }
    : { x: WIDTH / 2, y: HEIGHT / 2 };

  // THE GRAIN. Pops off on the last frame of the windup, arcs, rolls, stops —
  // and then does absolutely nothing for the rest of the beat.
  const grainAge = frame - windupTo;
  const grain = (() => {
    if (grainAge < 0 || frame >= workFrom) return null;
    const fall = kidEase.gravity(Math.min(1, grainAge / 18));
    const roll = interpolate(grainAge, [18, 34], [0, 62], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeOutCubic,
    });
    return {
      x: S20_CLIFF.x - 34 - roll,
      y: S20_CLIFF.top + 8 + fall * 96,
      spin: Math.min(1, grainAge / 34) * 220,
    };
  })();

  const rain = interpolate(frame, [dripFrom, dripFrom + 30, windupTo + 6, windupTo + 40], [0, 1, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  const haze = mixHex(PLATES.sea_horizon_day.near, kidTheme.paper, 0.4);

  return (
    <KidBackdrop variant="day" clouds={0}>
      <AbsoluteFill style={{ background: mixHex(PLATES.sea_horizon_day.near, kidTheme.ink, 0.2) }} />
      <Camera cam={cam}>
        <Plate bg="sea_horizon_day" seat={SEAT} phase={3.3} />
        <IslandChain haze={haze} from={3} />
        <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery + 1 }}>
          <Volcano x={230} base={SEAT} scale={1.2} phase={PHASE.volcano} awake={1} smoke={0.34} look="camera" />
        </div>
        <NearSea near={PLATES.sea_horizon_day.near} phase={3.3} />
        <Cliff haze={haze} />
        <BasaltShore crest={470} near={PLATES.sea_horizon_day.near} glow={0.5} />
        <Weather strength={rain} t={t} />
        <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>
          <Ember
            x={emberMark.x}
            y={emberMark.y}
            scale={0.74}
            phase={PHASE.ember}
            {...EMBER_COOLED}
            lean={4}
            emotion={useEmotion(scene, "ember", { a3_44_ember: "amazed" }, EMBER_RESTING, NO_LEAD)}
            speaking={stage.speaking("ember")}
            look={{ x: 0.8, y: -0.2 }}
          />
          <Rock x={rockMark.x} y={rockMark.y} scale={0.5} phase={PHASE.rock} speaking={stage.speaking("rock")} />
          <Drip
            x={dripMark.x}
            y={dripMark.y}
            scale={0.72}
            phase={PHASE.drip}
            emotion="happy"
            speaking={stage.speaking("drip")}
            look={{ x: 0.7, y: -0.4 }}
          />
          <Puff
            x={puffMark.x}
            y={puffMark.y}
            scale={0.86}
            opacity={0.66}
            phase={PHASE.puff}
            emotion="happy"
            speaking={stage.speaking("puff")}
            look={{ x: 0.6, y: -0.3 }}
          />
          {/* THE HARD HATS. The one prop in the episode that says "this is a
              job" — and the joke is that a demolition crew this equipped
              produces one grain of sand before lunch. Puff's floats, because
              there is nothing under it to hold it up. */}
          <WideLayer zIndex={Z.cast + 2}>
            <HardHat x={dripMark.x} y={headTop(dripMark, "drip") + 10} scale={0.56} tilt={-6} />
            <HardHat x={puffMark.x + 6} y={headTop(puffMark, "puff") - 4} scale={0.5} tilt={7} />
          </WideLayer>
          {frame >= sunnyFrom ? (
            <Sunny
              x={sunnyMark.x}
              y={sunnyMark.y}
              scale={0.98}
              phase={PHASE.sunny}
              emotion="proud"
              speaking={stage.speaking("sunny")}
              look={{ x: -0.4, y: 0.5 }}
            />
          ) : null}
          {/* ONE GRAIN. It is the whole morning's work, and it is drawn at the
              size that makes the number funny. */}
          {grain ? (
            <WideLayer zIndex={Z.cast + 3}>
              {/* 13×10 with a 4px outline, not 9×7 with 3: this is the payoff
                  of the scene's biggest windup and at the 1.42 push it was six
                  pixels of pale yellow on a pale cliff. Still small enough that
                  the number is the joke. */}
              <g transform={`translate(${grain.x.toFixed(1)} ${grain.y.toFixed(1)}) rotate(${grain.spin.toFixed(0)})`}>
                <ellipse cx={0} cy={0} rx={13} ry={10} fill="#f0e0b4" stroke="#6f5a33" strokeWidth={4} />
              </g>
            </WideLayer>
          ) : null}
        </div>
      </Camera>
      <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>
        {/* THE BIG WORD. `WordCard` rather than `BigWordBeat` for act one's
            reason: a chant needs a character to chant it, and this word is
            earned by a Narrator sentence with nobody available to shout along.
            It lands inside `a3_42` — the sentence that defines it — and is out
            before `a3_43` begins, because script.md asks for this card without
            buying a held beat for it (the MAGMA finding, again). */}
        <WordCard
          text="EROSION"
          from={breakFrom + Math.round((breakTo - breakFrom) * 0.5)}
          until={breakTo - 4}
          y={252}
          bannerColor={kidTheme.waterDark}
          sub="rain and wind, winning"
        />
        <Bubbles
          scene={scene}
          cast={
            {
              ember: projected(cam, emberMark, pushed),
              rock: projected(cam, rockMark, pushed),
              drip: projected(cam, dripMark, pushed),
              puff: projected(cam, puffMark, pushed),
              sunny: projected(cam, sunnyMark, pushed),
            } as Cast
          }
          text={S20_BUBBLES}
          at={aimTails(S20_BUBBLES, {
            ember: projected(cam, emberMark, pushed),
            rock: projected(cam, rockMark, pushed),
            drip: projected(cam, dripMark, pushed),
            puff: projected(cam, puffMark, pushed),
            sunny: projected(cam, sunnyMark, pushed),
          })}
        />
        {/* PUFF'S CATCH-PHRASE, IN TWO BEATS. Nine words in one bubble is a
            paragraph in the sky; the swap sits in the 0.83s the take itself
            leaves between its two sentences (silencedetect: 0.816→1.644 of
            2.916), so it lands in real silence. The line, the clip and the
            firing count are untouched. */}
        <TwoBeatBubble
          mark={projected(cam, puffMark, pushed)}
          from={feelFrom}
          until={feelTo}
          at={0.422}
          first="You can't see me."
          second="But you can FEEL me."
        />
      </AbsoluteFill>
    </KidBackdrop>
  );
};

/**
 * **How far below the top of its scaled BOX each of these two is actually
 * drawn**, in natural units, measured off the components: Drip's tip is local
 * −140 in a ±190 box, Puff's body radius is 96 in a ±170 box.
 *
 * The first pass hung the hats off half-box constants and never scaled the
 * offset, so both floated 100–220px clear of the crew's heads (stills
 * `a3v1/s20b`, `s20j`) — the one prop in the episode, in mid-air.
 */
const CROWN_SLACK = { drip: 50, puff: 74 } as const;

/** The screen y a body's DRAWING starts at, for anything worn on its head. */
function headTop(mark: Mark, who: keyof typeof CROWN_SLACK): number {
  const scale = mark.scale ?? 1;
  return crownOf(who, mark.y, scale) + CROWN_SLACK[who] * scale;
}

/**
 * A mark as the bubble layer sees it. Bubbles live OUTSIDE the camera (a
 * zoomed bubble is unreadable at 44px, which is the floor), so a bubble on a
 * body inside one is placed through `project`.
 */
function projected(cam: Cam, mark: Mark, active: boolean): Mark {
  if (!active) return mark;
  const z = cam.zoom ?? 1;
  return {
    ...mark,
    x: cam.x + (mark.x - cam.x) * z,
    y: cam.y + (mark.y - cam.y) * z,
    scale: (mark.scale ?? 1) * z,
  };
}

// ---------------------------------------------------------------------------
// Scene 21 — what dirt is actually made of
// ---------------------------------------------------------------------------
//
// **THE CHAIN IS THE DIAGRAM, AND THE DIAGRAM IS MADE OF SCENERY THE SHOW
// ALREADY OWNS.** Three labels, on three islands, in the order the Narrator
// says them — black rock, sand, green — and the fourth island is the sandbar
// that shows where the row is going. STYLE's drawn-geometry rule says a
// stretch like this needs character beats inside it, and it has three: Drip
// and Puff claiming the recipe they *are*, and Ember's flat verdict on a
// crumb.

/**
 * Which island each word labels, by index into `CHAIN` — so a label cannot
 * drift off its island the day one of them moves, and so the label's HEIGHT
 * comes from the island's own height.
 */
const S21_LABELS = [
  { text: "BLACK ROCK", at: 0.16, island: 0 },
  { text: "SAND", at: 0.42, island: 2 },
  { text: "GREEN", at: 0.66, island: 3 },
] as const;

/**
 * A diagram label, sitting **above** its island.
 *
 * First pass parked every label at `SEAT + 34` — 34px *below* the waterline the
 * islands stand on — so "SAND" floated on the open sea under its island and
 * across Puff (still `a3v1/s21c`). A label under the water is not labelling
 * anything. The chain is a diagram in this scene; the labels sit on it.
 */
const ChainLabel: React.FC<{
  island: ChainIsland;
  text: string;
  from: number;
  until: number;
}> = ({ island, text, from, until }) => {
  const frame = useCurrentFrame();
  const x = island.x;
  const top = SEAT - island.h - 64;
  if (frame < from || frame > until) return null;
  const u = interpolate(frame, [from, from + 7, until - 7, until], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutBack,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top,
        transform: `translateX(-50%) scale(${(0.8 + u * 0.2).toFixed(3)})`,
        opacity: u,
        padding: "8px 20px",
        borderRadius: kidRadius.chip,
        background: "rgba(255,253,247,0.9)",
        fontFamily: kidTheme.fontFamily,
        fontSize: kidType.min,
        fontWeight: 900,
        letterSpacing: 2,
        color: kidTheme.ink,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

const S21_BUBBLES: Record<string, string> = {
  a3_51_drip: "We ground it!",
  a3_52_puff: "I stirred in the leaves!",
  a3_54_ember: "It is very small.",
};

const DirtScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const [rowFrom, rowTo] = lineWindow(scene, "a3_50_narrator");
  const [pinchFrom, pinchTo] = lineWindow(scene, "a3_53_narrator");
  const [smallFrom] = lineWindow(scene, "a3_54_ember");

  // THE PUSH ONTO THE PINCH. It runs under the Narrator's line naming it and
  // is parked before Ember's verdict, so her line, the correction after it and
  // the 36 frames of silence all play on a frame that is not moving.
  const zoom = interpolate(frame, [pinchFrom + 14, pinchTo - 10], [1, 1.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const pushed = frame >= pinchFrom + 14;
  // The push holds BOTH the pinch and the inspector. Centred on the crumb
  // itself (806) Ember was sliced in half by the left edge at 1.85 — a flat
  // verdict delivered by half a face (still `a3v1/s21h`). 700 keeps her whole
  // and still lands the crumb comfortably inside the frame.
  const cam: Cam = pushed
    ? { x: 700, y: SOIL_AT.y - 40, zoom }
    : { x: WIDTH / 2, y: HEIGHT / 2 };

  const emberMark: Mark = { x: 470, y: plant("ember", SHORE, 0.9), scale: 0.9, who: "ember", side: "right", offset: 320 };
  const dripMark: Mark = { x: 1030, y: stand("drip", SHORE - 2), scale: 0.6, who: "drip", side: "left", offset: 320 };
  const puffMark: Mark = { x: 1290, y: hover("puff", 640, 0.7), scale: 0.7, who: "puff", side: "left", offset: 320 };

  const soil = interpolate(frame, [pinchFrom + 24, pinchFrom + 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  return (
    <KidBackdrop variant="day" clouds={0}>
      <AbsoluteFill style={{ background: mixHex(PLATES.sea_horizon_day.near, kidTheme.ink, 0.2) }} />
      <Camera cam={cam}>
        <Plate bg="sea_horizon_day" seat={SEAT} phase={4.2} />
        <IslandChain haze={mixHex(PLATES.sea_horizon_day.near, kidTheme.paper, 0.4)} />
        <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery + 1 }}>
          <Volcano x={286} base={SEAT} scale={1.5} phase={PHASE.volcano} awake={1} smoke={0.4} look="camera" />
        </div>
        <NearSea near={PLATES.sea_horizon_day.near} phase={4.2} />
        <BasaltShore crest={92} near={PLATES.sea_horizon_day.near} soil={soil} />
        <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>
          <Ember
            x={emberMark.x}
            y={emberMark.y}
            scale={0.9}
            phase={PHASE.ember}
            {...EMBER_COOLED}
            lean={frame >= smallFrom ? 0 : 5}
            emotion={useEmotion(scene, "ember", {}, EMBER_RESTING, NO_LEAD)}
            speaking={stage.speaking("ember")}
            look={frame >= pinchFrom ? { x: 0.55, y: 0.85 } : { x: 0.9, y: 0 }}
          />
          <Drip
            x={dripMark.x}
            y={dripMark.y}
            scale={0.6}
            phase={PHASE.drip}
            emotion="happy"
            speaking={stage.speaking("drip")}
            look="camera"
          />
          <Puff
            x={puffMark.x}
            y={puffMark.y}
            scale={0.7}
            opacity={0.6}
            phase={PHASE.puff}
            emotion="happy"
            speaking={stage.speaking("puff")}
            look="camera"
          />
        </div>
      </Camera>
      <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>
        {!pushed
          ? S21_LABELS.map((l, i) => (
              <ChainLabel
                key={l.text}
                text={l.text}
                island={CHAIN[l.island]}
                from={rowFrom + Math.round((rowTo - rowFrom) * l.at)}
                until={i + 1 < S21_LABELS.length ? rowFrom + Math.round((rowTo - rowFrom) * S21_LABELS[i + 1].at) - 4 : rowTo + 20}
              />
            ))
          : null}
        <Bubbles
          scene={scene}
          cast={
            {
              ember: projected(cam, emberMark, pushed),
              drip: projected(cam, dripMark, pushed),
              puff: projected(cam, puffMark, pushed),
            } as Cast
          }
          text={S21_BUBBLES}
          at={aimTails(S21_BUBBLES, {
            ember: projected(cam, emberMark, pushed),
            drip: projected(cam, dripMark, pushed),
            puff: projected(cam, puffMark, pushed),
          })}
        />
      </AbsoluteFill>
    </KidBackdrop>
  );
};

// ---------------------------------------------------------------------------
// Scene 22 — Blue, first to the newest place in the world (+ Violet)
// ---------------------------------------------------------------------------
//
// The anti-Sunny seed, watered and **not** paid off (its home is the ep-6
// storm). Blue is wrong twice — wrong by residency and wrong by Violet — and
// right about nothing, and nobody is unkind about either.
//
// **THE FREEZE.** After "I was here before here was here", Blue stops dead
// mid-ricochet for the whole 45 frames and recalculates. It is ep 4's beat
// rerun on a new resident, and it works because he is the only thing in the
// series that never stops: `blueRicochet` is a pure function of the frame, so
// freezing him is clamping the frame he is computed from — no state, no hooks
// added or removed, and the every-frame render stays honest.
//
// Violet is at the far frame edge, vibrating, and the joke is that on an
// island that did not exist yesterday he has already been overlooked. He never
// speaks, in this episode or any other.

const BLUE_BOX: Box = { x: 520, y: 470, w: 900, h: 330 };

const S22_BUBBLES: Record<string, string> = {
  a3_56_blue: "FIRST! Sorry, rock!",
  a3_58_ember: "I live here.",
  a3_59_blue: "Then I am first to visit!",
};

const BlueScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [, liveTo] = lineWindow(scene, "a3_58_ember");
  const [visitFrom] = lineWindow(scene, "a3_59_blue");
  const [outFrom] = lineWindow(scene, "a3_60_narrator");

  // The freeze: he is computed from a clamped frame, so he holds the exact
  // pose and heading he was in when she said it.
  const blueFrame = frame >= liveTo && frame < visitFrom ? liveTo : frame;
  const p = blueRicochet(blueFrame, BLUE_BOX, 5);
  const frozen = blueFrame !== frame;

  const emberMark: Mark = { x: 486, y: plant("ember", SHORE, 0.98), scale: 0.98, who: "ember", side: "right", offset: 330 };
  // 300, so that a bubble on the right of a shard at the middle of his box
  // still centres inside `BUBBLE_X_MAX` and keeps its full width.
  const blueMark: Mark = { x: p.x, y: p.y, scale: 0.66, who: "shard", side: p.x > WIDTH / 2 ? "left" : "right", offset: 300 };

  // Violet exits before the scene ends, in total silence, noticed by nobody.
  const violetOut = interpolate(frame, [outFrom, outFrom + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInBack,
  });

  return (
    <SeaWorld
      bg="sea_horizon_day"
      phase={5.1}
      crest={116}
      volcano={{ x: 286, scale: 1.5, smoke: 0.38, look: "camera" }}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ ember: emberMark, blue: blueMark } as Cast}
          text={S22_BUBBLES}
          at={aimTails(S22_BUBBLES, { ember: emberMark, blue: blueMark })}
        />
      }
    >
      <Ember
        x={emberMark.x}
        y={emberMark.y}
        scale={0.98}
        phase={PHASE.ember}
        {...EMBER_COOLED}
        lean={0}
        emotion={useEmotion(scene, "ember", {}, EMBER_RESTING, NO_LEAD)}
        speaking={stage.speaking("ember")}
        look={lookAt(emberMark, { x: p.x, y: p.y })}
      />
      <Shard
        who="blue"
        x={p.x}
        y={p.y}
        scale={0.66}
        heading={p.angle}
        trail={frozen ? undefined : blueTrail(blueFrame, BLUE_BOX, 5)}
        speaking={stage.speaking("blue")}
        // He is recalculating, and the only way a shard can show that is by
        // holding perfectly still with his eyes on the resident.
        eyeLife={frozen ? 0 : 1}
        idle={frozen ? 0 : 1}
        look={lookAt({ x: p.x, y: p.y }, emberMark)}
      />
      {/* VIOLET. Far frame edge, vibrating, and nobody — including Blue, who
          has just claimed to be the first thing here — ever looks at him. */}
      {violetOut < 0.98 ? (
        <Shard
          who="violet"
          // 1790, not 1836: "far frame edge" is the direction, half out of
          // frame is an accident. He is fully drawn until he leaves.
          x={1790 + violetOut * 306}
          y={604 - violetOut * 120 + Math.sin(t * 0.7) * 8}
          scale={0.46}
          opacity={1 - violetOut}
          look="camera"
        />
      ) : null}
    </SeaWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 23 — the turn, held in silence
// ---------------------------------------------------------------------------
//
// The fastest character in the series sits still, on purpose, for the first
// time in her life, and looks up at a mountain. The staging is one shot,
// no camera, nobody entering, and the mountain at four times the size the
// series has been ignoring him at — because we have walked up his own slope
// to sit next to her.
//
// V5 is his only reply to Ember all episode; the 48f in front of it is the
// asymmetric engine paying its single dividend, and it is silence with a
// mountain in it.

const S23_VOLCANO = { x: 916, base: SEAT, scale: 4.05 } as const;

const S23_BUBBLES: Record<string, string> = {
  // A summary, not a transcript, and six words rather than eight: she is at his
  // foot with her eyes up his slope, so "that big" IS the mountain — the shot
  // is doing the comparison the four cut words were doing.
  a3_62_ember: "When will I be that big?",
  a3_65_ember: "Everything fast was over fast.",
  // `a3_66_ember` is NOT here — seven words, staged as two beats below.
  a3_67_rock: "Fast things are small.",
  a3_68_rock: "Slow things are big.",
  a3_69_rock: "You are going to be enormous.",
  a3_70_ember: "Then I have already started.",
};

const TurnScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const [askFrom] = lineWindow(scene, "a3_62_ember");
  const [, v5To] = lineWindow(scene, "a3_63_volcano");
  const [longFrom, longTo] = lineWindow(scene, "a3_66_ember");

  const vb = volcanoBubble({ ...S23_VOLCANO, awake: 1, side: "left" });
  const face = volcanoFace({ ...S23_VOLCANO, awake: 1 });

  const emberMark: Mark = { x: 372, y: plant("ember", SHORE, 1.02), scale: 1.02, who: "ember", side: "right", offset: 300 };
  const rockMark: Mark = { x: 1516, y: stand("rock", SHORE + 20), scale: 0.6, who: "rock", side: "left", offset: 330 };

  return (
    <SeaWorld
      bg="island_chain_dusk"
      phase={6.4}
      crest={0}
      chain={4}
      glow={0.6}
      volcano={{
        x: S23_VOLCANO.x,
        scale: S23_VOLCANO.scale,
        smoke: 0.42,
        rim: 0.55,
        erupt: 0.12,
        // He is answering somebody smaller than one of his own boulders, and
        // the whole of his acting budget is that he looks at her while he does
        // it. He goes back to the sea afterwards.
        look: frame >= askFrom && frame < v5To + 40 ? { x: -0.85, y: 0.55 } : "camera",
        speaking: stage.speaking("volcano"),
        breath: 1.15,
      }}
      overlay={
        <>
          {/* **TWO `Bubbles`, NOT ONE, AND THIS IS A RULE.** `maxWidth` is a
              component-level prop, so passing the volcano's helper number
              (520 — sized for the clearance beside his eye) through one shared
              `Bubbles` squeezed every OTHER bubble in the scene to 520 as well.
              That, plus the word count, is what turned Ember's line into a
              four-line column in the first pass. His bubbles get their own
              instance; everybody else keeps the kit's 660. */}
          <Bubbles
            scene={scene}
            cast={{ ember: emberMark, rock: rockMark } as Cast}
            text={S23_BUBBLES}
            at={aimTails(S23_BUBBLES, { ember: emberMark, rock: rockMark })}
          />
          <Bubbles
            scene={scene}
            cast={{ volcano: vb.mark } as Cast}
            text={{ a3_63_volcano: "Presently." }}
            at={{ a3_63_volcano: vb.at }}
            maxWidth={vb.maxWidth}
          />
          {/* THE SELF-ACCOUNT, IN TWO BEATS. Seven words in one bubble wrapped
              to four lines. The clip is one sentence about being fast and one
              about being long, and the swap lands in the 0.44s the take leaves
              between them (silencedetect: 1.338→1.783 of 4.068) — so the
              second half of the arc's most important line arrives on its own,
              which is what the beat wanted anyway. */}
          <TwoBeatBubble
            mark={emberMark}
            from={longFrom}
            until={longTo}
            at={0.384}
            first="I used to be fast."
            second="Ten thousand years long."
          />
        </>
      }
    >
      <Ember
        x={emberMark.x}
        y={emberMark.y}
        scale={1.02}
        phase={PHASE.ember}
        {...EMBER_COOLED}
        // SHE IS SITTING STILL, ON PURPOSE. `squish` slightly negative is a
        // drop of lava that has settled onto something rather than one about to
        // leave, and the lean is a fraction of what act one gave her. Both are
        // the arc, in the only vocabulary she has.
        lean={2}
        squish={-0.12}
        crust={0.58}
        wisps={0.22}
        glow={0.6}
        emotion={useEmotion(scene, "ember", { a3_65_ember: "neutral", a3_70_ember: "happy" }, EMBER_RESTING, NO_LEAD)}
        speaking={stage.speaking("ember")}
        look={lookAt(emberMark, { x: face.x, y: face.eyeY })}
      />
      <Rock x={rockMark.x} y={rockMark.y} scale={0.6} phase={PHASE.rock} speaking={stage.speaking("rock")} />
    </SeaWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 24 — the grading
// ---------------------------------------------------------------------------
//
// Episode four's live order, filled. Pip is exactly where that episode left
// her — rooted, permanent lean, `skeptical` resting face, pappus ruff kept —
// and she **takes no steps**: the arrival stoops to her mark, the seed she
// dispatches does the travelling, and she never rises. This is the plant
// motion law, and it is the reason she is worth promoting rather than
// re-drawing: the law is in the component.
//
// The volcano is on this horizon too, awake and smoking, which is ep 4's own
// wide with five episodes of consequences in it — a plant grading a pinch of
// the mountain that is visibly standing behind her.
//
// `a3_74` "It will do." is the cache-migrated `plants/co_17_pip` take and its
// 45 frames land NAKED: the Narrator companion chain is off this episode, and
// nothing at all enters the hold.

const MEADOW = { horizon: 604, ground: 902, pip: { x: 812 } } as const;

const S24_PIP = { x: MEADOW.pip.x, scale: 0.82, state: "young" as const };

/** Pip is placed from `PIP_BOX`, not from `CHAR_BOX.pip` — see the flag above. */
const PIP_Y = MEADOW.ground - PIP_BOX / 2;

/** Screen y of a local-from-centre value on Pip's drawing. */
function pipAt(local: number, scale: number): number {
  return MEADOW.ground - (PIP_BOX / 2 - local) * scale;
}

const S24_BUBBLES: Record<string, string> = {
  a3_72_puff: "Special delivery.",
  a3_73_pip: "Fresh mountain. Old leaves.",
  a3_74_pip: "It will do.",
  a3_75_pip: "Pipsqueak. You are up.",
  a3_76_pip: "Dirt is crushed mountain.",
  a3_77_pip: "Good.",
};

const GradingScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [puffFrom, puffTo] = lineWindow(scene, "a3_72_puff");
  const [dispatchFrom, dispatchTo] = lineWindow(scene, "a3_75_pip");

  const grass = PLATES.meadow_day.near;

  // PUFF ARRIVES ON THE WIND AND STOOPS TO HER MARK. He comes in from frame
  // right, high, and comes DOWN to her — "arrivals stoop to her mark; she
  // never rises" is a staging law with an episode of setup behind it.
  const arrive = interpolate(frame, [puffFrom - 44, puffFrom + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });
  const puffX = 2020 + (1128 - 2020) * arrive;
  const puffY = 300 + (688 - 300) * arrive + Math.sin(t * 1.1) * 8;

  // The pinch rides in front of him and is set down at her foot; from the end
  // of his line it is on the ground and it is hers.
  const drop = interpolate(frame, [puffTo - 20, puffTo + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.gravity,
  });
  // 168 in front of him, not 78: his drawn body radius is 96 at scale 0.8, and
  // at 78 the pinch spent his whole line *behind* him — the parcel in a
  // delivery scene, invisible (still `a3v2/s24b`). Bodies are `Z.cast`, the
  // ground layer he carries it in is not, so clearance has to be geometric.
  const pinch = {
    x: puffX - 168 + (MEADOW.pip.x + 128 - (puffX - 168)) * drop,
    y: puffY + 34 + (MEADOW.ground - 16 - (puffY + 34)) * drop,
  };

  // PIPSQUEAK. Dispatched on "You are up.", silent, and she is the only thing
  // in this scene that travels — which is the whole point of the law.
  const launch = interpolate(frame, [dispatchTo - 8, dispatchTo + 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInCubic,
  });
  const seedX = MEADOW.pip.x - 190 + launch * 1120;
  const seedY = MEADOW.ground - 60 - launch * 540 + Math.sin(t * 1.6) * 14;

  const puffMark: Mark = { x: puffX, y: puffY, scale: 0.8, who: "puff", side: "left", offset: 340 };
  const pipMark: Mark = {
    x: S24_PIP.x,
    y: PIP_Y,
    scale: S24_PIP.scale,
    who: "pip",
    side: "left",
    offset: 330,
    // `bubbleOver` reads `CHAR_BOX.pip` (300) and her real box is 460, so the
    // mark carries an explicit lift measured off her own crown instead.
    lift: PIP_Y - (pipAt(pipCrownLocal("young"), S24_PIP.scale) - 156),
  };

  const pipFaceY = pipAt(pipFaceLocal("young"), S24_PIP.scale);

  return (
    <KidBackdrop variant="day" clouds={0}>
      <AbsoluteFill style={{ background: mixHex(grass, kidTheme.ink, 0.18) }} />
      <Plate bg="meadow_day" seat={MEADOW.horizon} phase={7.2} />
      {/* The volcano on the meadow horizon, exactly where ep 4 put him — and
          awake, which is what five episodes of nobody looking at him bought. */}
      <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery }}>
        <Volcano x={336} base={MEADOW.horizon} scale={0.92} phase={PHASE.volcano} awake={1} smoke={0.42} look="camera" />
      </div>
      {/* The drawn near field, over the plate's own blade fringe: the ground
          line wins wherever it disagrees with a painting. */}
      <WideLayer zIndex={Z.ground}>
        <path
          d={
            `M ${WIDE.x} ${WIDE.y + WIDE.h} L ${WIDE.x} ${MEADOW.ground - 74}` +
            ` Q ${520} ${MEADOW.ground - 116} ${1080} ${MEADOW.ground - 86}` +
            ` Q ${1560} ${MEADOW.ground - 62} ${WIDE.x + WIDE.w} ${MEADOW.ground - 96}` +
            ` L ${WIDE.x + WIDE.w} ${WIDE.y + WIDE.h} Z`
          }
          fill={mixHex(grass, kidTheme.grass, 0.24)}
        />
        <path
          d={
            `M ${WIDE.x} ${MEADOW.ground - 70}` +
            ` Q ${520} ${MEADOW.ground - 112} ${1080} ${MEADOW.ground - 82}` +
            ` Q ${1560} ${MEADOW.ground - 58} ${WIDE.x + WIDE.w} ${MEADOW.ground - 92}`
          }
          stroke={mixHex(grass, kidTheme.paper, 0.32)}
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
        />
        {/* Her dirt patch. She has not moved off it in two episodes. */}
        <ellipse cx={MEADOW.pip.x} cy={MEADOW.ground + 6} rx={188} ry={34} fill={kidTheme.earth} opacity={0.85} />
        <ellipse cx={MEADOW.pip.x} cy={MEADOW.ground} rx={150} ry={24} fill={mixHex(kidTheme.earth, kidTheme.ink, 0.3)} opacity={0.5} />
        {/* THE PINCH, and it is the same crumb that was in Ember's crack. */}
        <g opacity={drop > 0.02 ? 1 : arrive > 0.2 ? 1 : 0}>
          <ellipse cx={pinch.x} cy={pinch.y} rx={26} ry={11} fill="#4b3a24" />
          <ellipse cx={pinch.x - 7} cy={pinch.y - 3} rx={12} ry={5} fill="#6b5233" />
          <ellipse cx={pinch.x + 10} cy={pinch.y - 2} rx={7} ry={4} fill="#3c8f36" opacity={0.8} />
        </g>
      </WideLayer>
      <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>
        <Pip
          x={S24_PIP.x}
          y={PIP_Y}
          scale={S24_PIP.scale}
          state="young"
          phase={PHASE.pip}
          // **THE LEAN IS PERMANENT.** Episode four's longest runner resolved
          // by her leaving it there, and a scene that straightened her would
          // un-resolve it. A constant, never `pipLean` — there is no firing
          // here, there is a plant that has stopped correcting itself.
          lean={-12}
          emotion={useEmotion(scene, "pip", {}, "skeptical", NO_LEAD)}
          speaking={stage.speaking("pip")}
          look={
            stage.current === "puff"
              ? lookAt({ x: S24_PIP.x, y: pipFaceY }, { x: puffX, y: puffY })
              : frame >= dispatchFrom
                ? { x: -0.7, y: 0.4 }
                : { x: 0.2, y: 0.7 }
          }
        />
        <Puff
          x={puffX}
          y={puffY}
          scale={0.8}
          opacity={0.62}
          phase={PHASE.puff}
          emotion="happy"
          speaking={stage.speaking("puff")}
          look={lookAt({ x: puffX, y: puffY }, { x: S24_PIP.x, y: pipFaceY })}
        />
        {launch > 0.01 && launch < 0.99 ? (
          <WideLayer zIndex={Z.cast + 2}>
            <PappusSeed x={seedX} y={seedY} scale={0.9} rot={Math.sin(t * 1.2) * 12} opacity={1 - launch * 0.3} />
          </WideLayer>
        ) : null}
      </div>
      <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>
        <Bubbles
          scene={scene}
          cast={{ pip: pipMark, puff: puffMark } as Cast}
          text={S24_BUBBLES}
          at={aimTails(S24_BUBBLES, { pip: pipMark, puff: puffMark })}
        />
      </AbsoluteFill>
    </KidBackdrop>
  );
};

// ---------------------------------------------------------------------------
// Scene 25 — the garden is ready
// ---------------------------------------------------------------------------
//
// First light on the newest place in the world, and the two biggest bankable
// things in the series both come due in thirty seconds: Sunny says "That is
// not me" out loud, precisely and proudly, and the volcano hands the episode
// to a seed.
//
// **THE SEED RIDES IN ON V6.** It is not staged after his line and it is not
// staged under the Narrator's — it arrives while the mountain is saying "I
// believe the garden is ready", so the sentence and the thing it is about are
// the same event.

const S25_VOLCANO = { x: 372, base: SEAT, scale: 2.2 } as const;

const S25_BUBBLES: Record<string, string> = {
  a3_79_sunny: "That is not me.",
  a3_80_sunny: "The warm on top is me.",
  a3_81_sunny: "You're welcome! HA! HA!",
  a3_85_ember: "Welcome. We are new.",
};

const GardenScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [notMeFrom] = lineWindow(scene, "a3_79_sunny");
  const [v6From, v6To] = lineWindow(scene, "a3_83_volcano");

  const vb = volcanoBubble({ ...S25_VOLCANO, awake: 1, side: "right" });

  const emberMark: Mark = { x: 476, y: plant("ember", SHORE, 0.94), scale: 0.94, who: "ember", side: "right", offset: 320 };
  const sunnyMark: Mark = { x: 1404, y: hover("sunny", 238, 1.0), scale: 1.0, who: "sunny", side: "left", offset: 360 };

  // Pipsqueak sails in ON his line — from `v6From`, not six frames before it.
  // The six frames were inside V6's staged 48f approach gap, which is a held
  // beat like any other: nothing enters it, including a seed.
  const ride = interpolate(frame, [v6From, v6To + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const seedX = 1980 + (SOIL_AT.x - 1980) * ride;
  const seedY = 210 + (SOIL_AT.y - 34 - 210) * kidEase.easeInCubic(ride) + Math.sin(t * 1.4) * 12;
  const landed = ride > 0.985 ? 1 : 0;

  return (
    <SeaWorld
      bg="sea_horizon_dawn"
      phase={8.1}
      crest={470}
      chain={3}
      soil={1}
      seed={landed}
      volcano={{
        x: S25_VOLCANO.x,
        scale: S25_VOLCANO.scale,
        smoke: 0.4,
        rim: 0.3,
        speaking: stage.speaking("volcano"),
        look: "camera",
      }}
      overlay={
        <>
          {/* His own `Bubbles`, for the `maxWidth` reason in Scene 23. */}
          <Bubbles
            scene={scene}
            cast={{ ember: emberMark, sunny: sunnyMark } as Cast}
            text={S25_BUBBLES}
            at={aimTails(S25_BUBBLES, { ember: emberMark, sunny: sunnyMark })}
          />
          <Bubbles
            scene={scene}
            cast={{ volcano: vb.mark } as Cast}
            text={{ a3_83_volcano: "I believe the garden is ready." }}
            at={{ a3_83_volcano: vb.at }}
            maxWidth={vb.maxWidth}
          />
        </>
      }
    >
      <Ember
        x={emberMark.x}
        y={emberMark.y}
        scale={0.94}
        phase={PHASE.ember}
        {...EMBER_COOLED}
        crust={0.58}
        wisps={0.2}
        lean={0}
        emotion={useEmotion(scene, "ember", { a3_85_ember: "happy" }, EMBER_RESTING, NO_LEAD)}
        speaking={stage.speaking("ember")}
        look={ride > 0.2 ? lookAt(emberMark, { x: seedX, y: seedY }) : "camera"}
      />
      <Sunny
        x={sunnyMark.x}
        y={sunnyMark.y}
        scale={1.0}
        phase={PHASE.sunny}
        emotion={useEmotion(scene, "sunny", { a3_79_sunny: "neutral", a3_80_sunny: "proud" }, "proud", NO_LEAD)}
        speaking={stage.speaking("sunny")}
        // He inspects the crack. **He is looking at the one warm thing on this
        // planet that is not his**, and he says so, which is four episodes of
        // infallibility ending in three words.
        look={frame >= notMeFrom ? { x: -0.75, y: 0.7 } : { x: -0.4, y: 0.4 }}
      />
      {ride > 0.01 && landed === 0 ? (
        <WideLayer zIndex={Z.cast + 2}>
          <PappusSeed x={seedX} y={seedY} scale={0.86} rot={-18 + ride * 26} />
        </WideLayer>
      ) : null}
    </SeaWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 26 — THE BREAK
// ---------------------------------------------------------------------------
//
// Two one-word clips, fifteen minutes of setup, and forty-five frames of
// silence. Rock asks the first question of his life; Ember answers with his
// word, at his speed, after his gap.
//
// **NOTHING ENTERS THE HOLD.** No line, no entrance, no music sting, no
// emotion change, no camera, no new element. The scene is a two-shot that is
// already composed when it starts and does not change while it runs — the only
// motion in it is breath, the sea, and one drop of lava with a rind on her.
// Every knob below is a constant on purpose; there is no `interpolate` in this
// component and there must never be one.

const S26_EMBER = { x: 690, scale: 1.24 } as const;
const S26_ROCK = { x: 1244, scale: 0.82 } as const;

/** Two words. Fifteen minutes of setup behind them. */
const S26_BUBBLES: Record<string, string> = {
  a3_86_rock: "Done?",
  a3_87_ember: "Started.",
};

const BreakScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const stage = useStage(scene);

  // **HER BUBBLE OPENS TO HER RIGHT, INTO THE GAP BETWEEN THE TWO OF THEM.**
  //
  // This is the fix the salvage pass asked for, and it is the whole beat. On
  // her LEFT the bubble's x came out at 360, clamped to the 400 margin, and the
  // tail — clamped to inside its own bubble — pointed down-left at x≈500, over
  // open water, with the bubble body sitting **on the distant volcano's face**
  // (still `a3v1/s26d`). The single most important word in the episode read as
  // the mountain saying it.
  //
  // Right, at 300, puts it in the empty sky between her and Rock, inside
  // `BUBBLE_X_MAX`, and `tailAt` drops the tip inside her own silhouette. Rock
  // keeps the other side of the frame, so the two one-word bubbles land in two
  // different places and the swap of who-says-what is legible at a glance.
  const emberMark: Mark = {
    x: S26_EMBER.x,
    y: plant("ember", SHORE, S26_EMBER.scale),
    scale: S26_EMBER.scale,
    who: "ember",
    side: "right",
    offset: 300,
  };
  const rockMark: Mark = {
    x: S26_ROCK.x,
    y: stand("rock", SHORE + 52),
    scale: S26_ROCK.scale,
    who: "rock",
    side: "right",
    offset: 330,
  };

  return (
    <SeaWorld
      bg="island_chain_dusk"
      phase={9.3}
      crest={470}
      chain={4}
      glow={0.75}
      drift={0}
      volcano={{ x: 236, scale: 1.4, smoke: 0.32, rim: 0.5, look: "camera" }}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ ember: emberMark, rock: rockMark } as Cast}
          text={S26_BUBBLES}
          // Both tails aimed at their own speaker rather than parked at a
          // corner. A one-word bubble is small, so the default corner inset is
          // most of its width away from the body that said it — and in a
          // two-hander built entirely out of who-said-which-word, the tail is
          // the whole of the staging.
          at={aimTails(S26_BUBBLES, { ember: emberMark, rock: rockMark })}
        />
      }
    >
      <Ember
        x={emberMark.x}
        y={emberMark.y}
        scale={S26_EMBER.scale}
        phase={PHASE.ember}
        crust={0.6}
        wisps={0.18}
        glow={0.55}
        lean={0}
        squish={-0.1}
        // A bare emotion string, held for the whole scene. `useEmotion` would
        // be correct and would also be a lever somebody could pull later; the
        // one thing this beat cannot survive is a face that changes inside the
        // forty-five frames.
        emotion="happy"
        speaking={stage.speaking("ember")}
        look="camera"
      />
      <Rock x={rockMark.x} y={rockMark.y} scale={S26_ROCK.scale} phase={PHASE.rock} speaking={stage.speaking("rock")} />
    </SeaWorld>
  );
};

export const ACT3_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s18_rollcall: RollCallScene,
  s19_island_grows: IslandGrowsScene,
  s20_demolition: DemolitionScene,
  s21_dirt: DirtScene,
  s22_blue: BlueScene,
  s23_turn: TurnScene,
  s24_grading: GradingScene,
  s25_garden: GardenScene,
  s26_break: BreakScene,
};
