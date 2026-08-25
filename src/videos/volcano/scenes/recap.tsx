import React from "react";
import { CHAIN } from "./act3";
import {
  AbsoluteFill,
  Bubbles,
  COAST,
  Camera,
  CoastWorld,
  Drip,
  EMBER_COLOR,
  Ember,
  HEIGHT,
  KidBackdrop,
  KidSilhouette,
  NO_LEAD,
  PHASE,
  PIP_COLOR,
  PLATES,
  Plate,
  Puff,
  Rock,
  Sandcastle,
  SpeechBubble,
  Sunny,
  VOLCANO_AT,
  Volcano,
  WIDE,
  WIDTH,
  WideLayer,
  Z,
  bubbleOver,
  heldBeat,
  hover,
  interpolate,
  kidEase,
  kidInkOutline,
  kidRadius,
  kidTheme,
  kidType,
  lineWindow,
  lookAt,
  mixHex,
  spring,
  stand,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  volcanoBubble,
  type Body,
  type Cam,
  type Cast,
  type Emotion,
  type KidPlacement,
  type LookDirection,
  type Mark,
  type TimedScene,
} from "./common";

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
//
// ===========================================================================
// WHAT THE BUILD DID, AND THE SEVEN DECISIONS BEHIND IT
// ===========================================================================
//
// **1. V7 IS STAGED IN THE WIDE, AND THE CAMERA NEVER MOVES IN SCENE 31.** The
// obvious reading of "the mirror of V1" is a second portrait, i.e. a second
// vantage cut — and the skeleton wave flagged that the episode owns exactly one
// (s03→s04) and that a second needs paired stills to justify. It does not need
// one: V1's picture was *the mountain filling the screen*, and V7's picture is
// the opposite by design — the scenery back on the horizon where it has been
// for five shows, saying good night to a child on a beach. The mirror is in the
// words and in the 48f approach, not in the lens. Keeping the camera parked
// also keeps `volcanoBubble`'s derived anchor valid: it returns **composition**
// coordinates, and `Bubbles` renders in the `overlay` slot, which is OUTSIDE
// `Camera`. Under a moving camera an overlay bubble does not track the body it
// belongs to, so **any scene that pushes in must not have a bubble in it**.
// Scene 29 obeys the same rule from the other side: its push is over and its
// camera is back at identity (`zoom 1`, no `dx`/`dy`) before Sunny opens his
// mouth.
//
// **2. THE MIND-BLOWER FRAME HAS BOTH OF THEM IN IT.** "The kid and the volcano
// have been in the same business all day" is the episode's cheapest big beat
// and it only works if the audience can see the kid and the volcano at once.
// The first staging pushed in tight on the castle for the 45f hold, which put
// the mountain off frame left and left the hold sitting on half the sentence.
// The push is now 1.22 centred at (720, 700): visible x 130…1703, which holds
// the volcano (336), the castle (972) and the kid (1354) in one frame with the
// castle near the middle. A held beat is not the place to be missing the noun.
//
// **3. THE CHANT IS A RELAY DOWN THE REAL CHAIN, NOT A ROW OF HEADS.** Each
// traveller stands on the island whose material they are: Rock on the black
// rock (CHAIN[0]), Drip on the sand-bodied "other Island" (CHAIN[2]), Puff on
// the green-capped "Island the third" (CHAIN[3]), with Ember in the foreground
// on the newest rock in the world. The chain ages left to right, so the relay
// runs the same way the ground does, and the geology is doing the blocking.
//
// **4. THE CARD STACK IS A STACK, NOT FOUR MORE SLAMS.** STYLE is explicit that
// the Big Word card format means "learn this word" and that spending it on
// anything else devalues it (ep-2's rule stamp, act 3's `SpanStamp`). The recap
// is not teaching four new words, it is *listing* four earned ones — so they
// arrive as small chips stacking down the left of the frame, one per traveller
// word, and all four are still there under the Narrator's payoff line.
//
// **5. THE NEW ISLAND IS ON THE HORIZON IN SCENE 29 AS WELL AS SCENE 31.** The
// script hands Scene 31 "the horizon the kid has watched for five shows has
// CHANGED", and the temptation is to hold the island back so 31 has a reveal.
// It is the wrong call: act three built that island hours ago, both scenes are
// the same beach on the same day, and an island that pops into existence
// between two shots of one coastline is a continuity error an audit will find.
// The change is *against the first four episodes*, which is what the Narrator's
// line actually says; Scene 31 carries it with dusk, the kid standing up to
// look, and the summit still lit.
//
// **6. THE CHAIN WORLD IS A KNOWING DUPLICATE OF ACT 3's `SeaWorld`.** Scenes
// 27 and 30 stand on Ember's island and look down the archipelago, which is
// act 3's picture exactly; act 3 owns `SeaWorld`, `BasaltShore`, `NearSea` and
// `Island` as private components of its own file, and the ownership rule
// forbids editing that file to export them. `CHAIN` itself *is* exported and is
// imported here (act 3's own comment asks the recap to do that rather than
// retype the five names), so the names, the order, the x-positions and the
// colours cannot drift; the seating numbers below are act 3's, mirrored with a
// comment, and the geometry is verified in stills against `a3v5`. **Promotion
// proposed in the report**: `SeaWorld`/`BasaltShore`/`NearSea`/`Island` to
// `common.tsx`, which would delete ~180 lines from this file.
//
// **7. EVERY TAIL IS AIMED.** The act-2 and act-3 builders both found the same
// defect independently: `SpeechBubble` parks its tail at a fixed inset from one
// corner, so a bubble that is not directly over its speaker points at whatever
// else is under it (act 3's roll call read as the *island* greeting itself).
// `aimTails` below is act 3's helper, copied — not imported, because a scene
// file may not depend on another act's internals — and every bubble in this
// file goes through it or through an explicit `tailAt`. Every bubble is also
// six words or fewer: the recap's are one-word chants, five short goodbyes and
// two Sunny summaries, and the gate render log is clean of the kit's warning.

// ---------------------------------------------------------------------------
// The recap's world — act 3's numbers, mirrored (see decision 6)
// ---------------------------------------------------------------------------

/** Every sea shot in the series seats its plate's skyline on this line. */
const SEAT = COAST.horizon;

/** Where the drawn near water takes over from the painted far water. */
const SEA_TOP = 596;

/** The top of the new island's black rock — the ground line for the chain shots. */
const SHORE = 892;

/** Ember's resting face. Gleeful, never whiny — five scenes of it. */
const EMBER_RESTING: Emotion = "excited";

/**
 * **Ember, after the sea got to her.** Act 3 hands her over at these values
 * (she skinned over in Scene 17) and the recap does not un-cool her: the crust
 * is the spine gag's body and it does not come off.
 */
const EMBER_COOLED = { crust: 0.5, wisps: 0.32, glow: 0.62 } as const;

/**
 * How far above its own box bottom each body is actually DRAWN, in the body's
 * natural units — act 3's measurement, and the reason Ember does not float on
 * the black shelf. Her drop ends at local +102 in a ±160 box, so she hangs 58
 * units above her own feet.
 */
const DRAWN_SLACK: Partial<Record<Body, number>> = { ember: 58, drip: 20, rock: 12 };

/** `stand()`, with the drawing's own slack taken out. Returns a mark's `y`. */
function plant(who: Body, ground: number, scale = 1): number {
  return stand(who, ground + (DRAWN_SLACK[who] ?? 0) * scale);
}

/**
 * **Point every bubble's tail at the body that said it.** Act 3's helper,
 * copied rather than imported (a scene file may not reach into another act's
 * internals). `tailAt` is clamped to inside the bubble, so this can never
 * produce a tail floating in space: it moves the tip as far toward the speaker
 * as the bubble allows and stops.
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

/** `rgba()` for a hex, for the two soft warm washes this file paints. */
function rgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3 ? h.split("").map((c) => c + c).join("") : h,
    16,
  );
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Where an island's face is, for a look. Act 3's `chainCentre`. */
function chainCentre(i: (typeof CHAIN)[number]): { x: number; y: number } {
  return { x: i.x, y: SEAT - i.h * 0.55 };
}

/**
 * One island: a low dome standing on the waterline, hazed toward the sky.
 * Act 3's drawing, copied path for path — these are the same five islands the
 * audience met in Scene 18 and a second silhouette family would read as a
 * different coastline.
 */
const Island: React.FC<{ island: (typeof CHAIN)[number]; haze: string }> = ({
  island,
  haze,
}) => {
  const { x, w, h } = island;
  const body = mixHex(island.body, haze, island.haze);
  const dark = mixHex(body, kidTheme.ink, 0.22);
  const base = SEAT;
  if (h < 20) {
    return (
      <g>
        <ellipse cx={x} cy={base - h * 0.4} rx={w} ry={h} fill={body} />
        <ellipse
          cx={x}
          cy={base - h * 0.4}
          rx={w * 0.6}
          ry={h * 0.5}
          fill={mixHex(body, kidTheme.paper, 0.3)}
        />
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
const IslandChain: React.FC<{ haze: string }> = ({ haze }) => (
  <WideLayer zIndex={Z.scenery}>
    {CHAIN.map((island) => (
      <Island key={island.name} island={island} haze={haze} />
    ))}
  </WideLayer>
);

/**
 * **The near water**, in front of the painted far sea. Act 3's `NearSea`: the
 * plate's own sampled water, feathered over three climbing ghost copies, with
 * two slow swell strokes because a plate is never dead still.
 */
const NearSea: React.FC<{ near: string; phase?: number }> = ({ near, phase = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase;
  const deep = mixHex(near, kidTheme.ink, 0.34);
  const foam = mixHex(near, kidTheme.paper, 0.42);
  const swell = Math.sin(t * 0.62) * 6;
  const top = SEA_TOP;
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

/** The crack the first soil gathered in (Scene 21), and where Scene 25's seed landed. */
const SOIL_AT = { x: 806, y: SHORE + 74 } as const;

/**
 * **The newest place in the world**, and the ground Ember stands on in both
 * chain shots. Act 3's `BasaltShore`, with the soil and the seed left ON: the
 * garden is planted by the time the recap gets here, and un-planting it between
 * Scene 25 and Scene 27 would undo the loop the episode just closed.
 */
const BasaltShore: React.FC<{ crest?: number; near: string; glow?: number }> = ({
  crest = 60,
  near,
  glow = 1,
}) => {
  const rock = "#332b31";
  const lit = mixHex(rock, EMBER_COLOR.glow, 0.16);
  const surf = mixHex(near, kidTheme.paper, 0.55);
  const hillY = SHORE - crest;
  const ridge =
    `M -420 ${SHORE + 40}` +
    ` C ${180} ${SHORE - crest * 0.18} ${640} ${hillY + crest * 0.1} ${1010} ${hillY}` +
    ` C ${1360} ${hillY - crest * 0.06} ${1720} ${SHORE - crest * 0.34} ${2340} ${SHORE + 40}`;
  return (
    <WideLayer zIndex={Z.ground + 4}>
      <path d={`${ridge} Z`} fill={mixHex(rock, kidTheme.ink, 0.18)} />
      {/* The ridge highlight is a STROKE of the same two cubics the silhouette
          is built from, so it cannot come apart from it at any crest height. */}
      <path
        d={ridge}
        stroke={lit}
        strokeWidth={Math.max(9, crest * 0.045)}
        strokeLinecap="round"
        fill="none"
        opacity={0.4}
      />
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
      {/* THE PINCH, and the seed in it. Deliberately tiny — "It is very small."
          is a line, and this is the whole garden. */}
      <g>
        <ellipse cx={SOIL_AT.x} cy={SOIL_AT.y} rx={38} ry={13} fill="#4b3a24" />
        <ellipse cx={SOIL_AT.x - 10} cy={SOIL_AT.y - 4} rx={17} ry={7} fill="#6b5233" />
        <ellipse
          cx={SOIL_AT.x + 15}
          cy={SOIL_AT.y - 2}
          rx={9}
          ry={5}
          fill="#3c8f36"
          opacity={0.8}
        />
        <ellipse
          cx={SOIL_AT.x + 4}
          cy={SOIL_AT.y - 12}
          rx={11}
          ry={8}
          fill={PIP_COLOR.seed}
        />
      </g>
    </WideLayer>
  );
};

/**
 * **A chain wide.** The plate, the five islands, the mountain on the painted
 * horizon, the drawn near water, the black shelf, and the cast in front of all
 * of it. The plate is inside the camera exactly as `CoastWorld`'s is.
 */
const ChainWorld: React.FC<{
  phase?: number;
  cam?: Cam;
  drift?: number;
  volcano?: {
    x?: number;
    scale?: number;
    smoke?: number;
    rim?: number;
    look?: LookDirection;
    speaking?: boolean;
    breath?: number;
  };
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ phase = 0, cam, drift, volcano, overlay, children }) => {
  const near = PLATES.island_chain_dusk.near;
  return (
    <KidBackdrop variant="day" clouds={0}>
      <AbsoluteFill style={{ background: mixHex(near, kidTheme.ink, 0.2) }} />
      <Camera cam={cam ?? { x: WIDTH / 2, y: HEIGHT / 2 }}>
        <Plate bg="island_chain_dusk" seat={SEAT} phase={phase} drift={drift} />
        <IslandChain haze={mixHex(near, kidTheme.paper, 0.4)} />
        <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery + 1 }}>
          <Volcano
            x={volcano?.x ?? 300}
            base={SEAT}
            scale={volcano?.scale ?? 1.72}
            phase={PHASE.volcano}
            awake={1}
            smoke={volcano?.smoke ?? 0.5}
            rim={volcano?.rim ?? 0.55}
            look={volcano?.look}
            speaking={volcano?.speaking}
            breath={volcano?.breath}
          />
        </div>
        <NearSea near={near} phase={phase} />
        <BasaltShore near={near} />
        <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>{children}</div>
      </Camera>
      {overlay ? (
        <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>
          {overlay}
        </AbsoluteFill>
      ) : null}
    </KidBackdrop>
  );
};

/**
 * **The new island, on the beach's horizon.** Drawn, never painted — the
 * volcano rule ("the mountain is never painted") applied one island further
 * out, exactly as act 3 applied it to the chain. It is the thing that has
 * changed about a horizon the kid has watched for five shows, and by Scene 31
 * the Narrator says so out loud.
 *
 * Small, black, and a shade warm along the crest: it is a day old, and act 3's
 * chain drew the newest island the same way.
 */
const NewIsland: React.FC<{
  x?: number;
  h?: number;
  w?: number;
  glow?: number;
  zIndex?: number;
}> = ({
  // 584, not 520: at 520 its left shoulder touched the mountain's right flank
  // and the two read as one lumpy landmass. It is a separate island and the
  // whole point of Scene 31 is that there are now TWO shapes out there.
  x = 584,
  h = 30,
  w = 62,
  glow = 1,
  zIndex = Z.scenery,
}) => {
  // Act 3's newest island is `#3a3138` — black rock, one day old. The first
  // pass warmed it 16% toward the sunset and it came out a mound of mud.
  const body = mixHex("#3a3138", kidTheme.sunsetLow, 0.05);
  const crest = mixHex(body, EMBER_COLOR.glow, 0.45);
  return (
    <WideLayer zIndex={zIndex}>
      <path
        d={
          `M ${x - w} ${SEAT}` +
          ` C ${x - w * 0.8} ${SEAT - h * 0.55} ${x - w * 0.4} ${SEAT - h * 0.95} ${x - w * 0.06} ${SEAT - h}` +
          ` C ${x + w * 0.32} ${SEAT - h * 1.02} ${x + w * 0.78} ${SEAT - h * 0.58} ${x + w} ${SEAT}` +
          ` Z`
        }
        fill={body}
      />
      <path
        d={
          `M ${x - w * 0.52} ${SEAT - h * 0.72}` +
          ` C ${x - w * 0.2} ${SEAT - h * 1.0} ${x + w * 0.28} ${SEAT - h * 0.94} ${x + w * 0.56} ${SEAT - h * 0.6}`
        }
        stroke={crest}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        opacity={0.55 * glow}
      />
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 27 — THE CHANT
// ---------------------------------------------------------------------------
//
// The ground's whole journey, one traveller at a time, staged as a relay down
// the chain: magma and lava in the foreground where the rock is one day old,
// then rock, then sand, then soil, further and further out into a coastline
// that is the same process at four older ages. Nobody moves except the traveller
// whose word it is — the relay is carried by light, which is also the only
// thing a chain of static islands can do.
//
// **Rock's "Rock." is LATE and that is the joke.** `Video.tsx` puts the 24f gap
// after `rc_03_ember`, so his word arrives a beat behind a relay that had a
// rhythm going. Nothing here has to *make* it late; what this scene must not do
// is fill the gap. It does not: between Ember's "Lava!" and Rock's "Rock." the
// only thing on screen is the light leaving Ember and nothing arriving yet.

const S27_EMBER = { x: 548, scale: 0.98 } as const;

/**
 * **Each traveller stands on the island they are made of.** Indices into
 * `CHAIN` (imported from act 3, never retyped): 0 is the black rock, 2 is the
 * sand-bodied one, 3 is the green-capped one. A body stands 8px into the
 * island's crest so its feet are in the rock rather than on top of it.
 */
const S27_TRAVELLERS = [
  { who: "rock" as const, island: 0, scale: 0.3 },
  { who: "drip" as const, island: 2, scale: 0.34 },
  { who: "puff" as const, island: 3, scale: 0.4 },
];

function islandGround(index: number): number {
  return SEAT - CHAIN[index].h + 6;
}

const S27_BUBBLES: Record<string, string> = {
  rc_02_ember: "Magma!",
  rc_03_ember: "Lava!",
  rc_04_rock: "Rock.",
  rc_05_drip: "Sand!",
  rc_06_puff: "Soil!",
};

/**
 * **The card stack.** Four chips, one per Big Word the episode actually taught,
 * arriving on the traveller word that earned it and staying up under the
 * Narrator's payoff. See decision 4 in the header for why these are chips and
 * not four more `WordCard` slams.
 */
const S27_CARDS = [
  { word: "MAGMA", on: "rc_02_ember", color: "#c0392b" },
  { word: "LAVA", on: "rc_03_ember", color: "#e8622a" },
  { word: "ERUPTION", on: "rc_04_rock", color: "#d9700f" },
  { word: "EROSION", on: "rc_05_drip", color: "#4a86b4" },
] as const;

const WordChip: React.FC<{ text: string; color: string; from: number; y: number }> = ({
  text,
  color,
  from,
  y,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - from, fps, config: { damping: 12, mass: 0.6 } });
  if (pop <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: y,
        padding: "12px 34px",
        borderRadius: kidRadius.chip,
        background: color,
        border: `5px solid ${kidTheme.paper}`,
        transform: `scale(${pop.toFixed(3)})`,
        transformOrigin: "0% 50%",
        fontFamily: kidTheme.fontFamily,
        fontSize: kidType.min,
        fontWeight: 900,
        letterSpacing: 3,
        color: kidTheme.paper,
        textShadow: kidInkOutline(2),
      }}
    >
      {text}
    </div>
  );
};

/**
 * **"Lit as their word lands", and the first version of it was invisible.**
 *
 * The obvious staging is a warm halo behind whoever is speaking. It does not
 * work here: three of the four travellers stand against a peach dusk sky, and a
 * warm glow on a warm sky is nothing at all — still `rc1/s27c` has Rock's
 * spotlight at full strength and there is no light in the frame. Ember's reads
 * only because she is the one standing over dark water.
 *
 * What reads on any background is a change in the BODY. Everyone not speaking
 * is dimmed and desaturated — dusk, which is what the hour is anyway — and the
 * traveller whose word it is comes up to full. The relay is then carried by
 * exactly one thing at a time, which is the picture the script asks for.
 *
 * `position: absolute; inset: 0` is load-bearing rather than tidiness:
 * `filter` makes an element a containing block for absolutely-positioned
 * descendants, and every kit body positions itself with `left`/`top`. A
 * *static* wrapper would silently re-seat the whole cast. This one is the same
 * box as the layer it sits in, so nothing moves.
 */
const Beam: React.FC<{ on: number; floor?: number; children: React.ReactNode }> = ({
  on,
  floor = 0.6,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      filter: `brightness(${(floor + (1.04 - floor) * on).toFixed(3)}) saturate(${(0.82 + 0.22 * on).toFixed(3)})`,
    }}
  >
    {children}
  </div>
);

// A warm pool of light under each traveller was tried and CUT: a flat ellipse
// at any opacity that reads at all reads as a puddle of mud on the rock (still
// `rc4/s27a`, and worse on the pale islands). `Beam` plus Ember's own `glow`
// knob carry the whole effect, which is the cheaper answer as well.

const ChantScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const emberMark: Mark = {
    x: S27_EMBER.x,
    y: plant("ember", SHORE, S27_EMBER.scale),
    scale: S27_EMBER.scale,
    who: "ember",
    side: "right",
    offset: 340,
  };
  const marks: Record<string, Mark> = { ember: emberMark };
  for (const t of S27_TRAVELLERS) {
    const ground = islandGround(t.island);
    marks[t.who] = {
      x: CHAIN[t.island].x,
      y: t.who === "puff" ? hover(t.who, ground - 26, t.scale) : plant(t.who, ground, t.scale),
      scale: t.scale,
      who: t.who,
    };
  }

  // Each traveller's word window, for the light and for the little lift. A
  // body with no line this frame is dark, which is what makes the relay read as
  // a relay rather than as five characters standing in the same dusk.
  const litOf = (key: string): number => {
    const [from, to] = lineWindow(scene, key);
    return interpolate(frame, [from - 5, from + 4, to, to + 10], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeInOutSine,
    });
  };
  const emberLit = Math.max(litOf("rc_02_ember"), litOf("rc_03_ember"));
  const rockLit = litOf("rc_04_rock");
  const dripLit = litOf("rc_05_drip");
  const puffLit = litOf("rc_06_puff");

  // The bubbles sit directly over their own speaker rather than at the mark's
  // 340px offset: five one-word bubbles strung across a 1920px frame have to
  // say WHICH island is talking, and at the offset Rock's would have been over
  // the water between two islands. `aimTails` then pins each tail to its body.
  const bubbleAt: Record<string, { x: number; y: number; tail: "left" | "right" }> = {};
  for (const key of Object.keys(S27_BUBBLES)) {
    const who = key.slice(key.lastIndexOf("_") + 1);
    const mark = marks[who];
    bubbleAt[key] = {
      x: Math.max(400, Math.min(WIDTH - 400, mark.x)),
      y: Math.max(170, bubbleOver(mark)),
      tail: mark.x < WIDTH / 2 ? "left" : "right",
    };
  }
  const tails = aimTails(S27_BUBBLES, marks);

  return (
    <ChainWorld
      phase={1.4}
      volcano={{
        // He watches his own coastline being read out. It is the only thing he
        // can do and it is the whole of his vocabulary.
        look: { x: 0.72, y: 0.28 },
        smoke: 0.5,
        rim: 0.55,
      }}
      overlay={
        <>
          {S27_CARDS.map((card, i) => (
            <WordChip
              key={card.word}
              text={card.word}
              color={card.color}
              from={lineWindow(scene, card.on)[0]}
              y={596 + i * 92}
            />
          ))}
          <Bubbles
            scene={scene}
            cast={marks as Cast}
            text={S27_BUBBLES}
            at={Object.fromEntries(
              Object.keys(S27_BUBBLES).map((k) => [k, { ...bubbleAt[k], ...tails[k] }]),
            )}
          />
        </>
      }
    >
      <Beam on={emberLit} floor={0.9}>
        <Ember
          x={emberMark.x}
          y={emberMark.y - 10 * emberLit}
          scale={S27_EMBER.scale}
          phase={PHASE.ember}
          {...EMBER_COOLED}
          glow={EMBER_COOLED.glow + 0.3 * emberLit}
          // Her whole gesture rig is the lean, and here she is throwing her two
          // words down the coastline. Flat again the moment they are gone.
          lean={emberLit > 0.5 ? 8 : 2}
          squish={emberLit > 0.5 ? 0.1 : 0}
          emotion={useEmotion(scene, "ember", {}, EMBER_RESTING, NO_LEAD)}
          speaking={stage.speaking("ember")}
          look="right"
        />
      </Beam>
      <Beam on={rockLit}>
        <Rock
          x={marks.rock.x}
          y={marks.rock.y - 13 * rockLit}
          scale={S27_TRAVELLERS[0].scale}
          phase={PHASE.rock}
          speaking={stage.speaking("rock")}
        />
      </Beam>
      <Beam on={dripLit}>
        <Drip
          x={marks.drip.x}
          y={marks.drip.y - 14 * dripLit}
          scale={S27_TRAVELLERS[1].scale}
          phase={PHASE.drip}
          emotion="happy"
          speaking={stage.speaking("drip")}
          look="left"
        />
      </Beam>
      <Beam on={puffLit}>
        <Puff
          x={marks.puff.x}
          y={marks.puff.y - 15 * puffLit}
          scale={S27_TRAVELLERS[2].scale}
          phase={PHASE.puff}
          opacity={0.9}
          emotion="happy"
          speaking={stage.speaking("puff")}
          look="left"
        />
      </Beam>
    </ChainWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 28 — THE DEBT STAMPED
// ---------------------------------------------------------------------------
//
// Episode four's end card comes back and gets its answer stamped across it. The
// beats are MEASURED off the take rather than split evenly (`silencedetect`,
// -32dB / 0.10s, on `rc_08_narrator.mp3`, 4.625s): "Asked last show." runs
// 0.406–1.298, "Answered this show." 1.600–2.463, "Graded by the management."
// 2.805–4.155. The card arrives on the first, the stamp SLAMS on the second —
// the sentence that says an answer exists is the frame the answer lands on —
// and the third plays over a card that is already stamped.
//
// **Print only.** Pip's stamp is SHOWN, not re-fired: her one migrated firing
// was Scene 24 and a second would spend a catch-phrase the ledger has counted.
// Nothing on screen is hers except the mark she leaves.

/** Fractions of `rc_08`, measured. See the note above. */
const S28_CARD_AT = 0.088;
const S28_STAMP_AT = 0.346;

/** The stamp's red. Not `tomato` — a stamp is ink, and ink on paper is darker. */
const STAMP_INK = "#b8382e";

const DebtScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [from, to] = lineWindow(scene, "rc_08_narrator");
  const len = Math.max(1, to - from);
  const cardFrom = from + Math.round(len * S28_CARD_AT);
  const stampFrom = from + Math.round(len * S28_STAMP_AT);

  const card = spring({
    frame: frame - cardFrom,
    fps,
    config: { damping: 14, mass: 0.8 },
  });
  // The stamp is a SLAM, not an entrance: it arrives big and lands hard, which
  // is what a stamp does, and it is the only fast thing in the recap.
  const stamp = spring({
    frame: frame - stampFrom,
    fps,
    config: { damping: 11, mass: 0.5 },
  });
  // 1.32, not 1.9: a stamp comes down onto paper, it does not fly in from the
  // next county. The first pass overshot so far that the words were wider than
  // the frame on the landing frames and the question underneath was gone.
  const stampScale = 1 + (1 - stamp) * 0.32;

  const emberMark: Mark = {
    x: S27_EMBER.x,
    y: plant("ember", SHORE, S27_EMBER.scale),
    scale: S27_EMBER.scale,
    who: "ember",
  };

  return (
    <ChainWorld
      phase={1.9}
      volcano={{ look: "camera", smoke: 0.5, rim: 0.55 }}
      overlay={
        <>
          {/* The world goes quiet behind the card. Not a cut to black — the
              scene is still standing where Scene 27 stood, and the audience
              should be able to see that it never left. */}
          <AbsoluteFill
            style={{
              background: rgba(kidTheme.ink, 0.44 * Math.min(1, card * 1.2)),
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 330,
              display: "flex",
              justifyContent: "center",
              opacity: Math.min(1, card * 1.4),
              transform: `scale(${Math.max(0, card).toFixed(3)})`,
              pointerEvents: "none",
            }}
          >
            <div style={{ position: "relative" }}>
              {/* Episode four's card, word for word — the cold open ghosts the
                  same sentence over the sky in Scene 1, and the two have to be
                  the same sentence or the debt is not the debt. */}
              <div
                style={{
                  padding: "26px 60px",
                  borderRadius: kidRadius.banner,
                  border: `6px solid ${kidTheme.paper}`,
                  background: rgba(kidTheme.ink, 0.5),
                  fontFamily: kidTheme.fontFamily,
                  fontSize: 62,
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: kidTheme.paper,
                  textShadow: kidInkOutline(3),
                  whiteSpace: "nowrap",
                }}
              >
                WHAT IS DIRT ACTUALLY MADE OF?
              </div>
              {/* The stamp STRADDLES the question's bottom edge rather than
                  covering it: the joke is a debt being settled on the page it
                  was written on, so both sentences have to be readable at once.
                  Two lines, because one line of this at a legible size is
                  1500px wide and there is no way to rotate that through a
                  1920px frame and keep it inside the card it belongs to. */}
              {stamp > 0.001 ? (
                <div
                  style={{
                    position: "absolute",
                    left: "58%",
                    top: "140%",
                    transform: `translate(-50%, -50%) rotate(-8deg) scale(${stampScale.toFixed(3)})`,
                    padding: "12px 36px",
                    border: `8px solid ${STAMP_INK}`,
                    borderRadius: kidRadius.chip,
                    fontFamily: kidTheme.fontFamily,
                    fontSize: 50,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: 2,
                    textAlign: "center",
                    color: STAMP_INK,
                    background: rgba(kidTheme.paper, 0.9),
                    opacity: Math.min(1, stamp * 2),
                    whiteSpace: "nowrap",
                  }}
                >
                  CRUSHED MOUNTAIN
                  <br />+ OLD LEAVES.
                </div>
              ) : null}
            </div>
          </div>
        </>
      }
    >
      {/* She is still standing where the chant left her. Nobody cut away. */}
      <Ember
        x={emberMark.x}
        y={emberMark.y}
        scale={S27_EMBER.scale}
        phase={PHASE.ember}
        {...EMBER_COOLED}
        lean={2}
        emotion="proud"
        look="camera"
      />
    </ChainWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 29 — TWO TRUE THINGS
// ---------------------------------------------------------------------------
//
// **The longest-range continuity claim in the episode**: this is the Scene-1
// beach, and the castle is the same castle. Every number in this scene that
// describes where something is, is imported or copied verbatim from
// `coldOpen.tsx` — `COAST.castle.x`, `COAST.kid.x`, `COAST.ground`,
// `S1_BUILT_END`, the kid's kneel and flip, Sunny's mark. The only differences
// are the plate (`coast_day`, per the continuity rule: the cold open is dawn,
// this is the same beach later the same day) and a mountain who is awake now.
//
// The camera push and the 45f hold are decision 2 in the header. `rc_12`'s
// beats are measured off the take (12.225s): "…already growing." 0.358–2.211,
// "Right now." 2.747–3.313, "Underwater." 3.679–4.311 — so the pull-out runs
// under the first sentence and the shape under the sea arrives on the word
// "Underwater."

/** The castle at the end of Scene 1 — and for the rest of the episode. */
const S1_BUILT_END = 0.94;

/** The cold open's kid mark, verbatim. `flip` faces them at their own work. */
const S29_KID: KidPlacement = {
  x: COAST.kid.x,
  y: stand("kid", COAST.ground + 14),
  scale: 1.34,
  kneel: 1,
  flip: true,
};

const SUNNY_X = 1608;
const SUNNY_Y = 254;
const SUNNY_SCALE = 1.05;

/** Fraction of `rc_12` the word "Underwater." starts at. Measured. */
const S29_UNDERWATER_AT = 3.679 / 12.225;

/**
 * **The next island, under the sea.** Mind-blower 2 is a true, checkable claim
 * about a seamount off Hawaii, and the Narrator's refusal to pronounce its name
 * is the research hook — so the picture must not name it either. It is a shape
 * under the water and three bubbles, no label, no arrow, nothing to read.
 */
const Seamount: React.FC<{ on: number; near: string }> = ({ on, near }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (on <= 0.01) return null;
  const t = frame / fps;
  const x = 646;
  // 598, not 626: at 626 the dome's foot landed in the drawn beach's feathered
  // top edge and the seamount read as a hill sitting on the surf line instead
  // of a shape under the water.
  const base = 598;
  const body = mixHex(near, kidTheme.ink, 0.42);
  return (
    <WideLayer zIndex={Z.ground + 2}>
      <g opacity={0.42 * on}>
        <path
          d={
            `M ${x - 168} ${base}` +
            ` C ${x - 118} ${base - 44} ${x - 52} ${base - 74} ${x} ${base - 78}` +
            ` C ${x + 60} ${base - 74} ${x + 122} ${base - 40} ${x + 168} ${base} Z`
          }
          fill={body}
        />
        {[0, 1, 2].map((i) => {
          const u = ((t * 0.32 + i * 0.33) % 1);
          return (
            <circle
              key={i}
              cx={x - 22 + i * 26 + Math.sin(t * 1.3 + i) * 8}
              cy={base - 82 - u * 92}
              r={7 - i}
              fill={kidTheme.paper}
              opacity={(1 - u) * 0.5 * on}
            />
          );
        })}
      </g>
    </WideLayer>
  );
};

const S29_BUBBLES: Record<string, string> = {
  // "I warm the sea on top of it!" is eight words; the kit's limit is six and a
  // bubble is a summary, not a transcript.
  rc_13_sunny: "I warm that sea!",
  // Firing 4 of 4, and it is drawn exactly as the cold open drew firing 1.
  rc_14_sunny: "You're welcome! HA! HA!",
};

const TrueThingsScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const [pushFrom] = lineWindow(scene, "rc_10_narrator");
  const [, mindBlowerTo] = lineWindow(scene, "rc_11_narrator");
  const [holdFrom, holdTo] = heldBeat(scene, "rc_11_narrator");
  const [wideFrom, wideTo] = lineWindow(scene, "rc_12_narrator");

  // IN over `rc_10`, PARKED for the whole of `rc_11` and its 45f hold, OUT over
  // the first sentence of `rc_12`. `u` is 0 at the wide and 1 at the push.
  const u = interpolate(
    frame,
    [pushFrom, mindBlowerTo - 10, holdTo, wideFrom + 66],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );
  const cam: Cam = {
    x: WIDTH / 2 + (720 - WIDTH / 2) * u,
    y: HEIGHT / 2 + (700 - HEIGHT / 2) * u,
    zoom: 1 + 0.22 * u,
  };

  // The pat: the kid touches the castle once, under the sentence that says what
  // the castle is made of, and is still again well before the hold.
  const pat = interpolate(
    frame,
    [pushFrom + 20, pushFrom + 46, holdFrom - 30, holdFrom - 12],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );

  const seaLen = Math.max(1, wideTo - wideFrom);
  const seamount = interpolate(
    frame,
    [wideFrom + seaLen * S29_UNDERWATER_AT, wideFrom + seaLen * S29_UNDERWATER_AT + 22],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );

  const sunnyMark: Mark = {
    x: SUNNY_X,
    y: hover("sunny", SUNNY_Y, SUNNY_SCALE),
    scale: SUNNY_SCALE,
    who: "sunny",
    side: "left",
    offset: 360,
  };

  return (
    <CoastWorld
      bg="coast_day"
      phase={0.6}
      cam={cam}
      volcano={{
        // AWAKE, and he has been since Scene 9. The recap's whole job is that
        // the world it hands back is not the world it borrowed.
        awake: 1,
        smoke: 0.42,
        look: "right",
      }}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ sunny: sunnyMark } as Cast}
          text={S29_BUBBLES}
          at={aimTails(S29_BUBBLES, { sunny: sunnyMark })}
        />
      }
    >
      <NewIsland />
      <Seamount on={seamount} near={PLATES.coast_day.near} />
      <Sunny
        x={sunnyMark.x}
        y={sunnyMark.y}
        scale={SUNNY_SCALE}
        phase={PHASE.sunny}
        emotion="proud"
        speaking={stage.speaking("sunny")}
        look="left"
      />
      <Sandcastle
        x={COAST.castle.x}
        y={COAST.ground}
        scale={0.95}
        built={S1_BUILT_END}
        sand={PLATES.coast_day.near}
      />
      <KidSilhouette {...S29_KID} hold={pat} />
    </CoastWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 30 — ROLL CALL, firing 2: goodbye
// ---------------------------------------------------------------------------
//
// The series signature, fired the second time, and the shape is fixed: cheerful
// naming → one flat Narrator line → unbothered unseasoned button, with **nobody
// replying inside the naming**. Same five names, same order as Scene 18's
// greeting — read straight out of `CHAIN`, which is why this file imports act
// 3's table instead of retyping it.
//
// The greeting was two clips with a staged 24f between them; the goodbye is one
// clip, deliberately, because the Sandy beat already landed and a goodbye run
// reads as one breath. So the five names are five bubbles inside ONE take, and
// their swap points are MEASURED, not divided: `silencedetect` on
// `rc_15_ember.mp3` (6.264s) finds the four phrase boundaries at 0.990–1.254,
// 1.998–2.409, 3.381–3.659 and 4.850–5.215 (the 0.113s at 4.402 is inside
// "Island the third" and would have swapped the bubble mid-name). The fractions
// below are the middles of those four gaps, so no bubble ever changes while a
// word is being said, and a re-roll of the clip re-times all five for free.

const GOODBYE_STARTS = [0, 0.179, 0.352, 0.562, 0.803] as const;

/** The square of sky the roll call happens in — Scene 18's, so the two rhyme. */
const ROLLCALL_AT = { x: 800, y: 268 } as const;

const S30_EMBER = { x: 548, scale: 0.98 } as const;

const GoodbyeRun: React.FC<{ at: number[]; until: number; tailAt: number }> = ({
  at,
  until,
  tailAt,
}) => (
  <>
    {CHAIN.map((island, i) => (
      <SpeechBubble
        key={island.name}
        x={ROLLCALL_AT.x}
        y={ROLLCALL_AT.y}
        text={`Bye, ${island.name}.`}
        tail="left"
        tailAt={tailAt}
        from={at[i]}
        until={i + 1 < at.length ? at[i + 1] - 5 : until}
        zIndex={44}
      />
    ))}
  </>
);

const GoodbyeScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const [byeFrom, byeTo] = lineWindow(scene, "rc_15_ember");
  const [middleFrom, middleTo] = lineWindow(scene, "rc_16_narrator");
  const [buttonFrom] = lineWindow(scene, "rc_17_ember");

  const mark: Mark = {
    x: S30_EMBER.x,
    y: plant("ember", SHORE, S30_EMBER.scale),
    scale: S30_EMBER.scale,
    who: "ember",
    side: "right",
    offset: 340,
  };

  const byeLen = Math.max(1, byeTo - byeFrom);
  const sayAt = GOODBYE_STARTS.map((f) => byeFrom + Math.round(f * byeLen));
  let which = -1;
  for (let i = 0; i < sayAt.length; i += 1) if (frame >= sayAt[i]) which = i;

  // HER EYES WALK THE LINE, one island per measured phrase, so the bubble
  // saying a name and the eyes finding that island are the same instant by
  // construction. She holds on Sandy — the far end of a coastline she has just
  // said goodbye to — rather than snapping back to camera inside the hold.
  //
  // **Use `lookAt`, do not hand-build the vector.** `LookDirection`'s numeric
  // form is −1…1 with **positive y meaning DOWN**, and the first pass typed
  // `{ x: …, y: 0.24 }` by analogy with the volcano's — who is up on a summit
  // looking down his own coastline. Ember is on a shelf 320px BELOW the
  // horizon, so the same number pointed her at the sea in front of her feet
  // while she said goodbye to five islands above her (still `rc5/s30c`).
  // `lookAt` gets the sign, the reach and the clamp right by construction.
  const lookIndex = Math.max(0, Math.min(4, which));
  const centre = { x: mark.x, y: mark.y };
  const look: LookDirection =
    frame >= byeFrom ? lookAt(centre, chainCentre(CHAIN[lookIndex])) : "camera";

  // The mountain watches his own coastline being said goodbye to, and moves
  // once: a slow deepening breath under the Narrator's flat middle. That is the
  // entire vocabulary he has, and it is the reason it reads at all.
  const breath = interpolate(
    frame,
    [middleFrom, middleFrom + 30, middleTo, middleTo + 40],
    [1, 2.2, 2.2, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );

  return (
    <ChainWorld
      phase={2.6}
      volcano={{
        // The whole CV in one warm light: the rim comes up for the goodbye.
        rim: 0.7,
        smoke: 0.42,
        breath,
        look: { x: 0.82, y: 0.26 },
      }}
      overlay={
        <>
          <GoodbyeRun at={sayAt} until={byeTo} tailAt={mark.x} />
          <Bubbles
            scene={scene}
            cast={{ ember: mark } as Cast}
            text={{ rc_17_ember: "See you in ten thousand years." }}
            at={{ rc_17_ember: { ...ROLLCALL_AT, tail: "left", tailAt: mark.x } }}
          />
        </>
      }
    >
      <Ember
        x={mark.x}
        y={mark.y}
        scale={S30_EMBER.scale}
        phase={PHASE.ember}
        {...EMBER_COOLED}
        // Leaning out along the coastline through the naming, and dead flat for
        // the button — a button is stillness, and this one is the arc's receipt.
        lean={frame >= buttonFrom ? 0 : frame >= byeFrom && frame < middleTo ? 7 : 3}
        emotion={useEmotion(scene, "ember", {}, EMBER_RESTING, NO_LEAD)}
        speaking={stage.speaking("ember")}
        look={look}
      />
    </ChainWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 31 — END CARD, TEASE, GOOD NIGHT
// ---------------------------------------------------------------------------
//
// The Scene-1 beach at dusk, the castle still standing, the kid on their feet
// looking out — and a horizon with two shapes on it. The plate is `coast_dawn`,
// the one the episode opened on, with a warm dusk wash over it: the same beach,
// the far end of the same day, and the loop drawn rather than stated.
//
// **V7 goes through `volcanoBubble` like every other line of his**, seated at
// the wide's own `VOLCANO_AT` (x 336, scale 1.15) rather than at the portrait
// seat, so the anchor is derived from the mountain that is actually on screen.
// The camera never moves in this scene — see decision 1 in the header.
//
// The last thing the audience sees is a mountain who is still awake. That is
// new canon and it is load-bearing for episode six.

const S31_KID: KidPlacement = {
  x: COAST.kid.x,
  y: stand("kid", COAST.ground + 14),
  scale: 1.34,
  // STANDING, not kneeling — the one difference from every other shot of them
  // in this episode, and the whole of the kid's performance: they built a thing
  // out of a mountain all day and now they are looking at the mountain.
  kneel: 0,
  flip: true,
};

/**
 * **The dusk wash.** `coast_dawn` is the plate the episode opened on, and the
 * loop closes by ending on the same beach at the far end of the same day — so
 * the hour is done in light rather than by generating a sixth coastal plate.
 *
 * **NO `mix-blend-mode`, and that is a hard-won line.** Two passes were spent
 * on blend modes and both failed for the same structural reason: `CoastWorld`
 * renders `overlay` inside an `AbsoluteFill` with a `zIndex`, and **an element
 * that creates a stacking context isolates its descendants' blending** — so a
 * `multiply` layer in the overlay slot has nothing but transparency behind it
 * and composites as NORMAL. A pale gradient painted normally LIGHTENS what is
 * under it, which is why still `rc2/s31b` has a black kid silhouette with a
 * glowing peach head and `rc3/s31c` still has a tan one. The same isolation
 * applies to the `children` slot (`Z.cast`), so there is no place inside this
 * world where a blend mode works at all.
 *
 * What works is plain compositing with a rule attached: **the wash may only
 * contain dark colours, and it goes BEHIND the cast rather than over it.** It
 * is rendered as the first child of the world, so it dusks the plate, the sea,
 * the sand, the mountain and the new island, and the three things in front of
 * it carry their own hour — the castle is tinted 22% toward ink where it is
 * built, and the kid is pure ink already, because a silhouette at dusk is a
 * silhouette. The warm band at 43% is a *dark* warm (#964a22 at 0.34), which
 * over a pale sky reads as the last of the sun and over anything dark does
 * almost nothing.
 */
const DuskWash: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(to bottom," +
        " rgba(28,22,66,0.62) 0%," +
        " rgba(74,44,86,0.50) 30%," +
        " rgba(150,74,34,0.34) 43%," +
        " rgba(52,38,86,0.48) 56%," +
        " rgba(24,18,50,0.60) 100%)",
      pointerEvents: "none",
    }}
  />
);

const EndCardScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage(scene);

  const [teaseFrom, teaseTo] = lineWindow(scene, "rc_18_narrator");
  const [goodNightFrom] = lineWindow(scene, "rc_19_volcano");
  const [lastFrom] = lineWindow(scene, "rc_20_narrator");

  // The card arrives on the tease and leaves as the last line starts, so the
  // episode's final image — the changed horizon, the kid, the lit summit — is
  // the only thing in the frame for the whole of `rc_20` and its 60f tail.
  const cardIn = spring({
    frame: frame - (teaseFrom + 8),
    fps,
    config: { damping: 14, mass: 0.8 },
  });
  const cardOut = interpolate(frame, [lastFrom - 14, lastFrom], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const card = Math.max(0, cardIn) * cardOut;

  // The summit warms across his line and stays warm: he is not going back to
  // sleep, and the light is how the last shot says so without a caption.
  const glow = interpolate(frame, [teaseTo, goodNightFrom, lastFrom], [0.32, 0.62, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  // **`side: "right"`, and it is the helper's own lever rather than a typed
  // number.** `volcanoBubble` clears his near eye by half a 520-wide bubble
  // plus 24px — a clearance that is scale-independent while his face is not, so
  // at the wide seat (1.15, against the portrait's 5.6) the default left-hand
  // bubble came back clamped to x 400 and sat squarely on top of his summit
  // with the tail through his face (still `rc1/s31b`). On his right there is
  // nothing but open sea, and the tail still aims at his mouth. The clearance
  // term wanting to be a multiple of `eyeRx` rather than of `maxWidth` is a
  // real kit finding and it is in the report.
  const vb = volcanoBubble({
    x: VOLCANO_AT.x,
    base: COAST.horizon,
    scale: VOLCANO_AT.scale,
    awake: 1,
    side: "right",
  });

  return (
    <CoastWorld
      bg="coast_dawn"
      phase={3.1}
      drift={2}
      volcano={{
        awake: 1,
        smoke: 0.52,
        rim: glow,
        speaking: stage.speaking("volcano"),
        look: "right",
      }}
      overlay={
        <>
          {card > 0.001 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                // 64, not 132: `volcanoBubble` puts V7's bubble at y 299 with
                // its top edge at ~244, and at 132 the card's bottom border was
                // touching it (still `rc4/s31b`). Two things stacked in the sky
                // need air between them or they read as one graphic.
                top: 64,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
                opacity: Math.min(1, card * 1.4),
                transform: `scale(${Math.min(1, card).toFixed(3)})`,
              }}
            >
              <div
                style={{
                  padding: "24px 58px",
                  borderRadius: kidRadius.banner,
                  border: `6px solid ${kidTheme.paper}`,
                  background: rgba(kidTheme.ink, 0.86),
                  fontFamily: kidTheme.fontFamily,
                  fontSize: 62,
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: kidTheme.paper,
                  textShadow: kidInkOutline(3),
                  whiteSpace: "nowrap",
                }}
              >
                WHY IS THUNDER ALWAYS LATE?
              </div>
            </div>
          ) : null}
          <Bubbles
            scene={scene}
            cast={{ volcano: vb.mark } as Cast}
            text={{ rc_19_volcano: "Good night." }}
            at={{ rc_19_volcano: vb.at }}
            maxWidth={vb.maxWidth}
          />
        </>
      }
    >
      {/* z 0 rather than `Z.scenery`: it has to paint UNDER the dusk wash,
          and a positive z-index would put it over every z-auto sibling. */}
      <NewIsland glow={1} zIndex={0} />
      <DuskWash />
      <Sandcastle
        x={COAST.castle.x}
        y={COAST.ground}
        scale={0.95}
        built={S1_BUILT_END}
        sand={mixHex(PLATES.coast_dawn.near, kidTheme.ink, 0.44)}
      />
      <KidSilhouette {...S31_KID} />
    </CoastWorld>
  );
};

export const RECAP_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s27_chant: ChantScene,
  s28_debt: DebtScene,
  s29_true_things: TrueThingsScene,
  s30_goodbye: GoodbyeScene,
  s31_end_card: EndCardScene,
};
