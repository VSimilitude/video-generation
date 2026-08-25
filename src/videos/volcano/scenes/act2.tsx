import React from "react";
import {
  AbsoluteFill,
  Bubbles,
  COAST,
  Camera,
  Cast,
  Ember,
  EMBER_COLOR,
  GlowDrop,
  KidBackdrop,
  MountainWorld,
  PHASE,
  PLATES,
  Plate,
  Rock,
  SpeechBubble,
  Sunny,
  VOLCANO_SEAT,
  Volcano,
  WIDE,
  WIDTH,
  WideLayer,
  WordCard,
  Z,
  crownOf,
  emotionAt,
  hover,
  interpolate,
  kidEase,
  kidInkOutline,
  kidTheme,
  lineWindow,
  mixHex,
  stand,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  volcanoBubble,
  NO_LEAD,
  type Cam,
  type Mark,
  type TimedScene,
} from "./common";

// ACT TWO — THE LOUD PART (scenes s10_eruption … s17_surge).
//
// **This file is the act-2 agent's, and nobody else edits it.** `Video.tsx`
// spreads `ACT2_SCENES` into its scene registry, so staging a scene is adding
// its component to the record at the bottom and nothing else. The timeline does
// not move by a frame when you do, because every scene's turns, gaps and holds
// are already laid out in `Video.tsx` from script.md — including the ones this
// act is built around.
//
// ---------------------------------------------------------------------------
// THE THREE PLACES THIS ACT HAPPENS IN, AND WHY THERE ARE THREE
//
//   THE VENT      Scenes 10 and 11. `MountainWorld` — the portrait framing act
//                 one opened for the wake — with the mountain turned DOWN to
//                 `ERUPT.scale`. That is the whole trick of the shot: the same
//                 seat, the same plate, the same silhouette, two thirds the
//                 size, and the four hundred pixels of sky it buys back are
//                 what the fountain rises through and what Ember flies in. He
//                 is not a smaller mountain; the camera stepped back.
//   THE SLOPE     Scenes 12 to 16, **one unmoving framing for eighty-seven
//                 seconds**, which is not laziness, it is the joke: the world's
//                 slowest traffic jam, staged in the world's most patient shot.
//                 What changes across it is the light — the flow arrives orange
//                 and hot, cools through Scenes 13 and 14 into a purple
//                 evening, and then Scene 15 sets the whole sky on fire from
//                 off frame. `lava_slope_day` is a plate with no topography in
//                 it at all, which is the only kind that can never disagree
//                 with a ground line.
//   THE SHORE     Scene 17. Night, `coast_night`, and the one shot in the
//                 episode that has the whole chain in one picture: the crater
//                 erupting on the horizon at frame left, the flow arriving in
//                 the near field, and the sea it is turning into ground.
//
// **He is not in the slope shots and he cannot be**: the camera is standing on
// him. That is the same sanctioned exemption act one takes underground, arrived
// at from the other side, and it is written down in `backgrounds.mjs`. He is
// back on the horizon for Scene 17 and stays there for the rest of the series.
//
// ---------------------------------------------------------------------------
// WHAT THIS ACT MUST NOT GET WRONG
//
//   THE CEREMONY     Scenes 15 and 16 are the spine of five episodes. The 180f
//                    after `a2_40_narrator` is the SERIES RECORD and nothing
//                    enters it — no line, no entrance, no emotion change, no
//                    camera move still in flight. Every ramp in `FuseScene`
//                    either finishes before the hold opens or does not start
//                    until it closes, and Sunny's stunned face lands on the
//                    word "today" with sixteen frames to spare. `NO_LEAD` on
//                    both scenes' emotion maps.
//   THE CHAIN        `a2_15` "Done!" / 24f / `a2_16` "Started." is the source
//                    firing of a four-firing chain. The 24f is Rock's identity
//                    gap and it is byte-identical at all four; nothing is
//                    staged inside it, in either of the two that live here.
//   THE VOLCANO      V3 (`a2_02`) and V4 (`a2_35`) each take a 48f approach —
//                    already in the timeline. His staging vocabulary is one
//                    sentence: *the mountain moved slightly and that is
//                    enormous.* No body walk. No gestures. Ever. What he does
//                    in this act is `erupt`, and `erupt` is the component's.
//   NO MOUNTAIN      grows or shrinks on screen (physics ledger). Named spans
//                    and jump cuts only. The two framings of him here are a
//                    scale CUT between scenes, never a ramp inside one.
//   THE TONE GATE    The eruption is CONSTRUCTION, never catastrophe, and it is
//                    carried by the picture as well as by the line: the crew
//                    that rides out of the crater in Scene 10 are act one's
//                    glow-drops, arcing gently out and landing on the flanks to
//                    stay. Nothing is thrown at anybody, nothing flees, and
//                    nothing in this act is ever harmed by anything.
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
// `mark`, the `at` override and the `maxWidth` for you. **Never type an x or a
// y for one of his bubbles.** Both of this act's firings pass `ERUPT` rather
// than `VOLCANO_SEAT` — same call, the seat this act actually stages him at, so
// the anchor follows the scale instead of being re-derived by hand, which is
// the exact mistake the helper exists to make impossible.
//
// ---------------------------------------------------------------------------
// THE BUBBLE-KIT GAP, AND WHERE IT BIT (carried from ep 4, still unfixed)
//
// `Bubbles` clamps `by` to ≥ 170 and `bx` to ±400 of frame, and a bubble's tail
// always leaves its BOTTOM edge. A speaker staged high in the frame therefore
// gets a bubble that cannot get above them and a tail that points at the floor.
// Three places in this act had to be solved around it and they are worth
// knowing about before anybody stages a fourth:
//
//   1. **Ember's flight** (Scene 11) is capped at `EMBER_APEX` = 340 rather
//      than going to the top of frame, because at y < 330 her clamped bubble's
//      tail lands above her crown and reads as narration. The cap is the
//      staging decision the kit forced, and the flight is better for it — she
//      hangs over the summit instead of leaving the picture.
//   2. **The Big Word cards go LOW** (`CARD_Y` = 880, over the empty water
//      band) instead of the kit's default 300. STYLE: a banner parked in a
//      speaker's headroom is not a stacking preference, it is the scene not
//      working — and in Scene 11 the sky IS Ember's headroom.
//   3. **Sunny's bubbles on the slope are hand-placed** (`SUNNY_BUBBLE`) and
//      aim with `tailAt`. He is at maximum altitude with 260px of sky over
//      him; there is no legal bubble above him, so his sits beside him and the
//      tail is an arrow rather than a straw. Same geometric limit the volcano
//      helper documents, same answer.
//   4. **The tail cannot stretch, so the OFFSET is the only real lever.**
//      `SpeechBubble`'s tail is a fixed 104×78 shape and `tailAt` only slides
//      it *within* the bubble (`tailPlacement` clamps it to the inset). A mark
//      with `offset: 380` therefore lands its tail ~340px from the speaker with
//      about a hundred pixels of vertical clearance, and the tip points at
//      whatever happens to be under it — which on this slope is the lava flow.
//      The one-word chain firings are the worst case, because a narrow bubble
//      keeps its tail near its own middle: the first pass had "Started." tailed
//      into the river. Every mark here is offset to put the bubble's near EDGE
//      over its speaker, and `aimTails` then pins the tail to that edge.
//
// ---------------------------------------------------------------------------
// Two Big Words live here: ERUPTION (`a2_01`) and LAVA (`a2_05`). LAVA is NOT a
// second card slam — script.md asks for it "staged side by side with the MAGMA
// card from Scene 5 and one arrow between them — same stuff, new name, as a
// picture", so it is `CardPair`, a different treatment, and the signature slam
// keeps meaning "learn this word". Its beats are MEASURED off the clip
// (`silencedetect`), not split evenly: "magma" lands at 0.32 of `a2_05` and
// "Lava." at 0.73, with two and a half seconds of sentence in between.

// ---------------------------------------------------------------------------
// Marks, seats and the two worlds this act builds
// ---------------------------------------------------------------------------

/** Her resting face for the whole act: gleeful, never whiny. */
const EMBER_RESTING = "excited";

/**
 * **Point every bubble's tail at the body that said it.**
 *
 * `Bubbles` places a bubble from its speaker's mark and then parks the tail at
 * a fixed inset from the bubble's edge, which is right only while the speaker
 * is roughly under that corner. On this slope nobody is: Rock has to sit well
 * left of his own bubble so it clears Ember, and Ember well left of hers so it
 * clears Sunny. `tailAt` is the kit's documented answer — it slides the tail to
 * the near edge — and this builds the whole `at` map from the marks the scene
 * already has, so the tails follow a body that moves (Ember rides the front)
 * and can never drift out of sync with it.
 *
 * A key with no body in the cast is skipped, so a scene can hand it the same
 * bubble map it hands `Bubbles` and let hand-placed speakers (Sunny, the
 * volcano) keep their own overrides.
 */
const aimTails = (
  text: Record<string, string>,
  cast: Cast,
): Record<string, { tailAt: number }> =>
  Object.fromEntries(
    Object.keys(text).flatMap((key) => {
      const mark = cast[key.slice(key.lastIndexOf("_") + 1) as keyof Cast];
      return mark ? [[key, { tailAt: mark.x }] as const] : [];
    }),
  );

/**
 * **The vent framing.** Same x, same base, same plate seat as `VOLCANO_SEAT`;
 * only the scale is turned down, so the cut from Scene 9's portrait to Scene
 * 10's is a step back rather than a different mountain (physics ledger: he
 * never grows or shrinks *on screen*).
 *
 * 2.4 is arithmetic rather than taste. At `VOLCANO_PORTRAIT` (5.6) his summit
 * is at y = 121 and there is no sky left: the fountain would leave frame on its
 * first frame and Ember would have nowhere to fly. At 2.4 the summit sits at
 * 467, the fountain peaks around 328, and the 340px above that is the act's
 * whole second scene.
 */
const ERUPT = { x: VOLCANO_SEAT.x, base: VOLCANO_SEAT.base, scale: 2.4 } as const;
/** Screen y of the crater lip at `ERUPT.scale` — where everything leaves from. */
const CRATER_Y = ERUPT.base - 108 * ERUPT.scale;

/**
 * Where a Big Word card sits in the vent framing: LOW, over the empty band of
 * painted water under him. See the bubble-kit note in the header — the sky in
 * these two scenes belongs to Ember and to her bubbles.
 */
const CARD_Y = 880;

/**
 * **The slope.** `seat` is where the plate's own far edge lands; `ground` is
 * where Rock sits. 400 is the highest this plate can be seated (`PLATES`
 * derives the scale from it) and every pixel of that was bought for Sunny.
 */
const SLOPE = { seat: 400, ground: 1010 } as const;

/** The flow's centre line and half-thickness, in composition px. */
const flowY = (x: number): number => 590 + (x / WIDTH) * 210;
const flowHalf = (x: number): number => 54 + (x / WIDTH) * 40;
/** The top surface of the flow — what a body standing on it stands on. */
const flowTop = (x: number): number => flowY(x) - flowHalf(x) * 0.5;

/** Where the front enters, and where it stops for good. */
const FLOW_IN = 120;
const FLOW_STALL = 1240;

const ROCK_SLOPE = { x: 880, scale: 0.9 } as const;
const ROCK_SLOPE_MARK: Mark = {
  x: ROCK_SLOPE.x,
  y: stand("rock", SLOPE.ground),
  scale: ROCK_SLOPE.scale,
  who: "rock",
  // LEFT, and it is not a preference: at `side: "right"` his bubble lands on
  // top of Ember, who is parked on the stalled front just up-slope of him.
  side: "left",
  // 220, not the kit's 330 and not the first pass's 380. The number is set by
  // the tail rather than by the layout: at 380 his widest bubble still cleared
  // Ember, but "Started." — a bubble barely three hundred pixels across — put
  // its tail nearly three hundred pixels from him, over the lava. At 220 the
  // bubble's right edge sits over his crown, `aimTails` pins the tail there,
  // and even his three-line "You are not going somewhere." stops 170px short of
  // Ember's left edge.
  offset: 220,
};

/** Where Ember ends up, and stays, for three whole scenes. */
const EMBER_PARK = 1200;
const EMBER_SLOPE_SCALE = 0.95;

/**
 * **Sunny, on the slope, from Scene 12.**
 *
 * He is in the shot for ninety seconds before he says a word, and that is the
 * point of putting him there: the Narrator says Rock is "warm at last after
 * centuries of sunshine" with the centuries of sunshine hanging in the top
 * right of the frame, silent, having failed at it the whole time. Free comedy,
 * no runtime, no line — the crowd rule applied to a principal. It also deletes
 * the pop-in Scene 15 would otherwise have: the biggest claim of his life is
 * made by somebody the audience has been looking at since the traffic jam.
 *
 * 262 rather than 180 is the bubble-kit gap again — see the header. His rays
 * cross the plate's far edge by about fifty pixels, which reads as depth.
 */
const SUNNY_SLOPE = { x: 1470, cy: 262, scale: 0.8 } as const;
const SUNNY_SLOPE_MARK: Mark = {
  x: SUNNY_SLOPE.x,
  y: hover("sunny", SUNNY_SLOPE.cy, SUNNY_SLOPE.scale),
  scale: SUNNY_SLOPE.scale,
  who: "sunny",
  side: "left",
  offset: 460,
};
/**
 * His bubbles, hand-placed. There is no legal position above him (the clamp is
 * at 170 and his crown is at 78), so the bubble sits beside him at his own
 * height and `tailAt` turns the tail into an arrow pointing his way. Same
 * limit, and the same answer, as the volcano's mouth anchor.
 */
const SUNNY_BUBBLE = { x: 900, y: 186, tail: "right" as const, tailAt: SUNNY_SLOPE.x };

/**
 * **The night shore.** A higher seat than the coast's 470 — see `PLATES` — and
 * a near field big enough to hold the newest place in the world.
 */
const NIGHT = { seat: 360, volcano: { x: 330, scale: 2.2 } } as const;
/** The waterline: level across the left of frame, then a bay opening at right. */
const shoreY = (x: number): number =>
  700 + 250 * Math.min(1, Math.max(0, (x - 980) / 720)) ** 1.4;
/** The night flow's centre line and half-thickness. */
const nightFlowY = (x: number): number => 840 - (x / WIDTH) * 40;
const nightFlowHalf = (x: number): number => 62 + (x / WIDTH) * 22;
const nightFlowTop = (x: number): number => nightFlowY(x) - nightFlowHalf(x) * 0.5;

// ---------------------------------------------------------------------------
// The worlds
// ---------------------------------------------------------------------------

/**
 * **The slope**, and it is deliberately the plainest world in the episode: a
 * flat dark plate, one drawn river of lava, and whatever the scene stands on
 * it. No camera, ever — Scenes 12 to 16 are one framing and the only thing that
 * moves in eighty-seven seconds is the front of the flow, and then the light.
 *
 * `wash` is the hour. It is a translucent full-frame gradient over everything
 * *including* the cast, because it is light rather than a filter: the same
 * evening that cools the plate cools Rock, and the same eruption that sets the
 * sky on fire in Scene 15 lands on Sunny. It sits under `Z.overlay` so bubbles
 * and cards never take a tint.
 */
const SlopeWorld: React.FC<{
  phase?: number;
  /** `[r,g,b]` and strength of the light lying over the shot. */
  wash?: { color: string; strength: number };
  flow?: React.ReactNode;
  sky?: React.ReactNode;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ phase = 0, wash, flow, sky, overlay, children }) => (
  <KidBackdrop variant="day" clouds={0}>
    <Plate bg="lava_slope_day" seat={SLOPE.seat} phase={phase} drift={4} />
    {sky}
    <div style={{ position: "absolute", inset: 0, zIndex: Z.ground }}>{flow}</div>
    <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>{children}</div>
    {wash ? (
      <AbsoluteFill
        style={{
          zIndex: Z.overlay - 5,
          pointerEvents: "none",
          background:
            `linear-gradient(to bottom, rgba(${wash.color},${(wash.strength * 1.15).toFixed(3)}) 0%,` +
            ` rgba(${wash.color},${(wash.strength * 0.72).toFixed(3)}) 38%,` +
            ` rgba(${wash.color},${(wash.strength * 0.95).toFixed(3)}) 100%)`,
        }}
      />
    ) : null}
    {overlay ? (
      <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>{overlay}</AbsoluteFill>
    ) : null}
  </KidBackdrop>
);

/**
 * **The night shore.** The volcano is back on a painted horizon here, erupting,
 * at frame left — the volcano rule resumed after two scenes of standing on him.
 *
 * The near band is DRAWN (`NightShore`) over the plate's painted shore, on the
 * ep-4 `NearField` mechanism act one already uses for the beach: nothing in
 * this series stands on painted ground.
 */
const NightWorld: React.FC<{
  phase?: number;
  volcano?: { erupt?: number; smoke?: number; rim?: number; breath?: number };
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ phase = 0, volcano, overlay, children }) => (
  <AbsoluteFill style={{ background: "#061428", fontFamily: kidTheme.fontFamily, lineHeight: "normal" }}>
    <Plate bg="coast_night" seat={NIGHT.seat} phase={phase} drift={4} />
    <NightShore />
    <div style={{ position: "absolute", inset: 0, zIndex: Z.scenery }}>
      <Volcano
        x={NIGHT.volcano.x}
        base={NIGHT.seat}
        scale={NIGHT.volcano.scale}
        phase={PHASE.volcano}
        awake={1}
        look="right"
        emotion="happy"
        // 0.9: the plate is the darkest in the episode and a flat
        // `VOLCANO_BODY` on it is a hole. The rim is also the honest physics —
        // the thing lighting him is coming out of his own crater.
        rim={volcano?.rim ?? 0.9}
        smoke={volcano?.smoke ?? 0.3}
        erupt={volcano?.erupt ?? 1}
        breath={volcano?.breath ?? 1.4}
      />
    </div>
    <div style={{ position: "absolute", inset: 0, zIndex: Z.cast }}>{children}</div>
    {overlay ? (
      <AbsoluteFill style={{ zIndex: Z.overlay, pointerEvents: "none" }}>{overlay}</AbsoluteFill>
    ) : null}
  </AbsoluteFill>
);

/**
 * The drawn shore: the newest ground in the world, over the plate's painted
 * one. Ep 4's `NearField` and act one's `Beach`, in a colder key — the fill is
 * `PLATES.coast_night.near` pushed toward ink, because new basalt is a shade
 * blacker than the beach it is building itself onto, the edge is feathered over
 * ~50px so the seam does not read, and the waterline is a soft curve with a
 * slow pale surf riding it (a plate is never dead still, and anything that
 * rolls stays SVG).
 */
const NightShore: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const near = mixHex(PLATES.coast_night.near, kidTheme.ink, 0.42);
  const wet = mixHex(near, "#0c2b46", 0.5);
  const foam = mixHex(PLATES.coast_night.near, kidTheme.paper, 0.5);
  const tide = Math.sin(t * 0.62) * 5;
  const edge = (lift: number): string => {
    const pts: string[] = [];
    for (let x = WIDE.x; x <= WIDE.x + WIDE.w; x += 120) {
      pts.push(`${x} ${(shoreY(Math.min(WIDTH, Math.max(0, x))) - lift + tide).toFixed(1)}`);
    }
    return (
      `M ${WIDE.x} ${WIDE.y + WIDE.h} L ` +
      pts.join(" L ") +
      ` L ${WIDE.x + WIDE.w} ${WIDE.y + WIDE.h} Z`
    );
  };
  return (
    <WideLayer zIndex={Z.ground}>
      <path d={edge(-30)} fill={wet} opacity={0.9} />
      <path
        d={
          `M ${WIDE.x} ${(shoreY(0) - 26 + tide).toFixed(1)}` +
          ` Q ${WIDTH * 0.3} ${(shoreY(WIDTH * 0.3) - 52 + tide).toFixed(1)} ${WIDTH * 0.62} ${(shoreY(WIDTH * 0.62) - 30 + tide).toFixed(1)}` +
          ` Q ${WIDTH * 0.88} ${(shoreY(WIDTH * 0.88) - 14 + tide).toFixed(1)} ${WIDE.x + WIDE.w} ${(shoreY(WIDTH) - 34 + tide).toFixed(1)}`
        }
        stroke={foam}
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
        opacity={0.4 + 0.14 * Math.sin(t * 0.8)}
      />
      {[44, 28, 14].map((lift, i) => (
        <path key={lift} d={edge(lift)} fill={near} opacity={0.24 + i * 0.18} />
      ))}
      <path d={edge(0)} fill={near} />
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// The vent: what leaves the crater
// ---------------------------------------------------------------------------

/**
 * **THE CREW.** Act one's magma crowd, riding out of the vent they spent the
 * whole act waiting under, arcing gently over and landing on the flanks to
 * stay.
 *
 * This is the tone gate as a picture rather than as a line. "He was not
 * exploding. He was building" is a sentence a six-year-old can hear and still
 * watch a disaster; what settles it is that the things coming out of the
 * mountain are the same smiling drops who were sitting patiently downstairs
 * three scenes ago, that nothing is thrown AT anything, and that every one of
 * them lands somewhere and is fine. It is also the pedagogy: the eruption is
 * the queue moving.
 *
 * Deterministic from the index and the frame, never random — Remotion renders
 * frames in a pool of tabs — and drawn as pure geometry with no rig and no
 * hooks, exactly like the crowd in act one.
 */
const CrewFountain: React.FC<{ t: number; strength: number }> = ({ t, strength }) => {
  if (strength <= 0.01) return null;
  const n = 13;
  return (
    <WideLayer>
      {/* **THE SPRAY.** The rig's own `Fountain` is drawn in the volcano's local
          units and tops out around 58 of them — at this act's 2.4 that is 139px
          of fountain under 460px of sky the framing bought specifically for it,
          and on its own it reads as a sparkler rather than as the doors opening.
          These are the fine stuff going up with the crew: two dozen specks on
          the same deterministic ladder, thrown three times as high as the rig's
          and falling back into the crater. Nothing is thrown outward — the tone
          gate is that this is a fountain, not an explosion. */}
      {Array.from({ length: 24 }, (_, i) => {
        const u = ((t * 0.34 + (i * 5) / 24) % 1);
        const spread = ((i * 37) % 13) - 6;
        const lift = (240 + ((i * 53) % 190)) * strength;
        return (
          <circle
            key={`spark-${i}`}
            cx={ERUPT.x + spread * 11 * (0.4 + u)}
            cy={CRATER_Y - Math.sin(u * Math.PI) * lift}
            r={(3 + (i % 3) * 2.2) * (0.7 + 0.5 * strength)}
            fill={i % 4 === 0 ? "#ffd86a" : EMBER_COLOR.hot}
            opacity={0.85 * strength * Math.sin(u * Math.PI) ** 0.35}
          />
        );
      })}
      {Array.from({ length: n }, (_, i) => {
        // Two coprime strides so the crew does not leave on a metronome.
        const u = ((t * 0.19 + (i * 7) / n) % 1);
        const live = Math.min(1, u * 12) * Math.min(1, (1 - u) * 3.2);
        if (live <= 0.01) return null;
        const side = i % 2 === 0 ? -1 : 1;
        // Where this one comes down: a point on his flank, in his own local
        // units, so the landings sit ON the silhouette at any scale.
        const f = 0.34 + ((i * 13) % 7) / 24;
        const landX = ERUPT.x + side * (88 - 70 * f) * ERUPT.scale;
        const landY = ERUPT.base - f * 108 * ERUPT.scale;
        const x = ERUPT.x + (landX - ERUPT.x) * u;
        // A real arc, not a lerp: up hard, over, and down onto the flank.
        const arc = 210 + ((i * 29) % 90);
        const y = CRATER_Y + (landY - CRATER_Y) * u - Math.sin(u * Math.PI) * arc;
        return (
          <GlowDrop
            key={i}
            x={x}
            y={y}
            scale={0.34 * strength}
            phase={i * 1.7}
            t={t}
            look={side * 0.6}
            opacity={0.92 * live}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// The flow
// ---------------------------------------------------------------------------

/**
 * **THE FLOW**, and it is drawn for all three of STYLE's reasons at once: it
 * moves, Ember stands on it, and Rock is lit by it.
 *
 * `front` is the leading edge in composition x, so a scene animates one number
 * and the picture, the crust, the glow on Rock and Ember's mark all follow.
 * `crust` is the dark skin, drawn as a stroke ON the band's own outline — the
 * identical mechanism as Ember's rind, and for the identical reason: the
 * outside is what cools, and a fill would say the whole river had gone cold.
 * `heat` is the hour, and it is what carries Scenes 13 and 14: nothing in the
 * frame moves for a minute and a half, and the flow gets quietly darker the
 * entire time.
 */
const LavaFlow: React.FC<{
  t: number;
  front: number;
  crust: number;
  heat: number;
}> = ({ t, front, crust, heat }) => {
  const nose = Math.min(front, WIDTH + 200);
  const step = 40;
  const top: string[] = [];
  const bottom: string[] = [];
  for (let x = WIDE.x; x <= nose; x += step) {
    const cx = Math.min(WIDTH, Math.max(0, x));
    // The band thins into its own nose over the last 90px, so the front reads
    // as something that has run out of push rather than as a cut-off pipe.
    const taper = Math.min(1, (nose - x) / 90);
    const h = flowHalf(cx) * (0.25 + 0.75 * taper);
    top.push(`${x.toFixed(0)} ${(flowY(cx) - h).toFixed(1)}`);
    bottom.unshift(`${x.toFixed(0)} ${(flowY(cx) + h).toFixed(1)}`);
  }
  const band = `M ${top.join(" L ")} L ${bottom.join(" L ")} Z`;
  const hot = mixHex(EMBER_COLOR.hot, EMBER_COLOR.crust, 1 - heat);
  const body = mixHex(EMBER_COLOR.body, EMBER_COLOR.crust, 1 - heat);
  const rind = EMBER_COLOR.crust;
  return (
    <WideLayer zIndex={Z.ground}>
      {/* The light it casts on the ground either side. A river of lava on a
          dark plain is the only light source in five scenes, and without this
          the plate reads as a flat backdrop with a sticker on it. */}
      <path
        d={band}
        fill="none"
        stroke={EMBER_COLOR.glow}
        strokeWidth={170}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.17 * heat}
      />
      <path
        d={band}
        fill="none"
        stroke={EMBER_COLOR.glow}
        strokeWidth={78}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.2 * heat}
      />
      <path d={band} fill={body} stroke={rind} strokeWidth={7} strokeLinejoin="round" />
      {/* THE CRUST, as a stroke on the band's own outline. */}
      {crust > 0.01 ? (
        <path
          d={band}
          fill="none"
          stroke={rind}
          strokeWidth={8 + crust * 40}
          strokeLinejoin="round"
          opacity={0.9}
        />
      ) : null}
      {/* The hot centre: a thinner stroke down the middle of the river, which
          is where a skinning flow keeps its heat longest. */}
      <path
        d={`M ${top.join(" L ")}`}
        fill="none"
        stroke="none"
      />
      <path
        d={
          `M ${WIDE.x} ${flowY(0).toFixed(1)} L ` +
          Array.from({ length: 24 }, (_, i) => {
            const x = WIDE.x + ((nose - WIDE.x) * i) / 23;
            const cx = Math.min(WIDTH, Math.max(0, x));
            return `${x.toFixed(0)} ${flowY(cx).toFixed(1)}`;
          }).join(" L ")
        }
        fill="none"
        stroke={hot}
        strokeWidth={Math.max(4, 40 * heat * (1 - crust * 0.75))}
        strokeLinecap="round"
        opacity={0.85}
      />
      {/* The skin, as plates: dark slabs drifting very slowly downstream. Ten
          of them, deterministic, and they are the only thing in Scenes 13 and
          14 that moves at all. */}
      {Array.from({ length: 10 }, (_, i) => {
        const u = ((t * 0.012 + i / 10) % 1);
        const x = WIDE.x + (nose - WIDE.x) * u;
        if (x < -200 || x > nose - 40) return null;
        const cx = Math.min(WIDTH, Math.max(0, x));
        const h = flowHalf(cx);
        const w = 90 + ((i * 53) % 120);
        return (
          <ellipse
            key={i}
            cx={x}
            cy={flowY(cx) + (((i * 31) % 7) - 3) * h * 0.12}
            rx={w * 0.5}
            ry={h * (0.3 + ((i * 17) % 5) / 16)}
            fill={rind}
            opacity={(0.2 + 0.6 * crust) * (1 - heat * 0.35)}
          />
        );
      })}
    </WideLayer>
  );
};

/**
 * The warm light the flow lays on whatever is sitting next to it. Separate from
 * `LavaFlow` because it goes in FRONT of the cast — Rock is warmed *by* it, and
 * a glow drawn behind him would light the ground and leave him grey.
 */
const FlowGlow: React.FC<{ x: number; y: number; strength: number }> = ({
  x,
  y,
  strength,
}) => {
  if (strength <= 0.01) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background:
          `radial-gradient(ellipse 620px 340px at ${x}px ${y}px,` +
          ` rgba(255,150,50,${(0.4 * strength).toFixed(3)}) 0%,` +
          ` rgba(255,120,30,${(0.16 * strength).toFixed(3)}) 46%, transparent 76%)`,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// The sky: the eruption seen from its own flank
// ---------------------------------------------------------------------------

/**
 * **The ceremony's sky.** Scenes 15 and 16 need "the eruption at full glory
 * behind them — the whole sky lit, the most undeliable picture the claim will
 * ever get", and the camera is standing on the mountain, so the eruption is
 * off frame up-slope to the left. What is on screen is its light: a warm bloom
 * out of the top left corner, an ash column leaning away from it, and embers
 * riding up through the whole frame.
 *
 * Every one of those is drawn rather than washed, because the ep-3 rule is that
 * a payoff which adds colour over a plate of the same hue is invisible — the
 * bloom is a *value* change against a dusty blue sky, not a hue one.
 */
const EruptionSky: React.FC<{ t: number; strength: number }> = ({ t, strength }) => {
  const s = Math.max(0, Math.min(1, strength));
  if (s <= 0.01) return null;
  return (
    <>
      <AbsoluteFill
        style={{
          zIndex: Z.ground,
          pointerEvents: "none",
          background:
            `radial-gradient(ellipse 1500px 900px at -120px -180px,` +
            ` rgba(255,178,60,${(0.72 * s).toFixed(3)}) 0%,` +
            ` rgba(255,120,40,${(0.4 * s).toFixed(3)}) 38%,` +
            ` rgba(220,90,50,${(0.12 * s).toFixed(3)}) 66%, transparent 88%)`,
        }}
      />
      <WideLayer zIndex={Z.ground}>
        {/* The column, leaning out of the top left corner. Soft puffs on one
            deterministic ladder, exactly like the summit plume — a column of
            detached blobs with clear air under them is smoke coming from
            nothing, so the youngest is always newborn and always in the
            corner. */}
        {Array.from({ length: 12 }, (_, i) => {
          const u = ((t * 0.055 + i / 12) % 1);
          const r = (58 + u * 210) * (0.5 + 0.5 * s);
          return (
            <ellipse
              key={i}
              cx={-190 + u * 780 + Math.sin(u * 3.4 + i) * 40}
              cy={-150 + u * 300 - u * u * 90}
              rx={r}
              ry={r * 0.82}
              fill={mixHex("#7a6a72", kidTheme.paper, 0.4)}
              opacity={0.34 * s * Math.min(1, u * 8) * (1 - u) ** 1.2}
            />
          );
        })}
        {/* Embers, rising. Two dozen, tiny, and the only motion allowed inside
            the series record — they were already running when it opened and
            they are ambient rather than a beat. */}
        {Array.from({ length: 26 }, (_, i) => {
          const u = ((t * 0.08 + (i * 11) / 26) % 1);
          const x = -80 + ((i * 397) % 2100) + Math.sin(u * 6.2 + i) * 34;
          const y = 1120 - u * 1180;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2.6 + (i % 3) * 1.6}
              fill={i % 3 === 0 ? "#ffd86a" : EMBER_COLOR.hot}
              opacity={0.7 * s * Math.sin(u * Math.PI) ** 0.6}
            />
          );
        })}
      </WideLayer>
    </>
  );
};

/**
 * **The ceremony's light, carried into the portrait.**
 *
 * Scene 15 cuts away to him for V4 and back, and the first pass cut from an
 * orange sky at full glory to the untinted blue-day plate and out again: two
 * seconds of cheerful noon in the middle of the biggest scene in five episodes,
 * on the most important line the scenery has ever spoken.
 *
 * This is the slope's own wash — the same `255,126,40` on the same three stops
 * — plus the ceremony's embers, so the cut carries the hour AND its motion
 * across. It goes in the `children` layer, in FRONT of him: it is light lying
 * on the mountain, not a filter behind him.
 *
 * The strength is 0.54 where the slope runs 0.36, and the extra is arithmetic
 * rather than taste: the slope lies on a plate that is already dark and brown,
 * and this one lies on the bluest, most saturated plate in the episode, where
 * the same alpha desaturates the sea instead of warming the sky. Matched by
 * eye against `a2r2/s15c.png`, which is the frame the audience sees eight
 * seconds earlier.
 */
const CeremonyLight: React.FC<{ t: number; strength?: number }> = ({ t, strength = 0.54 }) => (
  <>
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background:
          `linear-gradient(to bottom, rgba(255,126,40,${(strength * 1.15).toFixed(3)}) 0%,` +
          ` rgba(255,126,40,${(strength * 0.72).toFixed(3)}) 38%,` +
          ` rgba(255,126,40,${(strength * 0.95).toFixed(3)}) 100%)`,
      }}
    />
    <WideLayer>
      {Array.from({ length: 26 }, (_, i) => {
        const u = ((t * 0.08 + (i * 11) / 26) % 1);
        return (
          <circle
            key={i}
            cx={-80 + ((i * 397) % 2100) + Math.sin(u * 6.2 + i) * 34}
            cy={1120 - u * 1180}
            r={2.6 + (i % 3) * 1.6}
            fill={i % 3 === 0 ? "#ffd86a" : EMBER_COLOR.hot}
            opacity={0.7 * Math.sin(u * Math.PI) ** 0.6}
          />
        );
      })}
    </WideLayer>
  </>
);

/**
 * Steam where the lava meets the sea. Soft, pale and slow — "all that
 * steam is the lava's heat, moving into the sea", which is the one fact in this
 * episode nobody is allowed to claim credit for.
 */
const SteamPlumes: React.FC<{ t: number; x: number; y: number; strength: number }> = ({
  t,
  x,
  y,
  strength,
}) => {
  const s = Math.max(0, Math.min(1, strength));
  if (s <= 0.01) return null;
  const fill = mixHex("#cfe6ee", kidTheme.paper, 0.35);
  return (
    <WideLayer>
      {/* MORE, SMALLER, FAINTER — and each puff is three offset discs rather
          than one. The first pass drew fourteen big ellipses at 0.42 on the
          darkest plate in the episode, and a hard-edged pale disc at that size
          reads as an OBJECT: six-year-olds were being shown grey balls rolling
          out of the sea. Steam is a texture, so it is built out of overlapping
          parts that never resolve into a shape, none of them opaque enough to
          own an outline. */}
      {Array.from({ length: 22 }, (_, i) => {
        const u = ((t * 0.16 + (i * 7) / 22) % 1);
        const r = (26 + u * 96) * (0.6 + 0.45 * s);
        const drift = (((i * 37) % 11) - 5) * 24;
        const cx = x + drift * (0.4 + u) + Math.sin(u * 3.1 + i) * 22;
        const cy = y - u * 470;
        const alpha = 0.17 * s * Math.min(1, u * 7) * (1 - u) ** 1.2;
        return (
          <g key={i} opacity={alpha}>
            <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.86} fill={fill} />
            <ellipse
              cx={cx - r * 0.52}
              cy={cy + r * 0.3}
              rx={r * 0.72}
              ry={r * 0.62}
              fill={fill}
            />
            <ellipse
              cx={cx + r * 0.46}
              cy={cy + r * 0.36}
              rx={r * 0.64}
              ry={r * 0.55}
              fill={fill}
            />
          </g>
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// The Big Words
// ---------------------------------------------------------------------------

/**
 * **MAGMA → LAVA, as a picture.** Not a second `WordCard` slam: script.md asks
 * for the LAVA card "staged side by side with the MAGMA card from Scene 5 and
 * one arrow between them — same stuff, new name", and STYLE is explicit that
 * two slams inside a minute stop meaning "learn this word". So the signature
 * fires once in this act (ERUPTION) and this is a different object: two named
 * boxes and an arrow, which is a *comparison* rather than a vocabulary event,
 * and which is also the entire lesson in one frame.
 *
 * The left card is drawn in the same ember body colour Scene 5's MAGMA card
 * used, deliberately: it is the same card, three minutes older.
 */
const CardPair: React.FC<{
  magmaFrom: number;
  arrowFrom: number;
  lavaFrom: number;
  until: number;
  y: number;
}> = ({ magmaFrom, arrowFrom, lavaFrom, until, y }) => {
  const frame = useCurrentFrame();
  const gone = Math.max(0, Math.min(1, (frame - until) / 10));
  if (frame < magmaFrom || gone >= 1) return null;
  const pop = (at: number): number =>
    Math.max(0, Math.min(1, (frame - at) / 9)) ** 0.6 * (1 - gone);
  const card = (label: string, sub: string, dx: number, at: number, fill: string) => {
    const p = pop(at);
    if (p <= 0.01) return null;
    return (
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 + dx,
          top: y,
          transform: `translate(-50%, -50%) scale(${(0.86 + 0.14 * p).toFixed(3)})`,
          opacity: p,
          padding: "14px 42px",
          borderRadius: 26,
          background: fill,
          border: `7px solid ${kidTheme.ink}`,
          textAlign: "center",
          fontFamily: kidTheme.fontFamily,
        }}
      >
        <div
          style={{
            fontSize: 74,
            fontWeight: 900,
            letterSpacing: 3,
            lineHeight: 1.02,
            color: kidTheme.paper,
            textShadow: kidInkOutline(4),
          }}
        >
          {label}
        </div>
        <div
          style={{
            marginTop: 2,
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: 1,
            color: kidTheme.ink,
          }}
        >
          {sub}
        </div>
      </div>
    );
  };
  const arrow = pop(arrowFrom);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none" }}>
      {card("MAGMA", "inside", -330, magmaFrom, EMBER_COLOR.body)}
      {arrow > 0.01 ? (
        <svg
          width={320}
          height={120}
          viewBox="-160 -60 320 120"
          style={{
            position: "absolute",
            left: WIDTH / 2 - 160,
            top: y - 60,
            overflow: "visible",
            opacity: arrow,
          }}
        >
          <path
            d={`M -96 0 L ${(-96 + 150 * arrow).toFixed(1)} 0`}
            stroke={kidTheme.paper}
            strokeWidth={13}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${(54 * arrow - 30).toFixed(1)} -26 L ${(54 * arrow + 12).toFixed(1)} 0 L ${(54 * arrow - 30).toFixed(1)} 26`}
            stroke={kidTheme.paper}
            strokeWidth={13}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={arrow > 0.7 ? 1 : 0}
          />
        </svg>
      ) : null}
      {card("LAVA", "outside", 330, lavaFrom, "#e0451f")}
      {/* The whole lesson, under the arrow, in three words. */}
      {arrow > 0.6 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: y + 92,
            textAlign: "center",
            fontFamily: kidTheme.fontFamily,
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: 2,
            color: kidTheme.paper,
            textShadow: kidInkOutline(3),
            opacity: Math.min(1, (arrow - 0.6) * 3) * (1 - gone),
          }}
        >
          same stuff
        </div>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 10 — The eruption begins
// ---------------------------------------------------------------------------

const EruptionScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [, doorsTo] = lineWindow(scene, "a2_01_narrator");
  const [buildFrom] = lineWindow(scene, "a2_03_narrator");

  // THE DOORS OPEN. "All of them. At once." — so the fountain does not creep
  // up, it arrives: `easeOutCubic` over the line, at full by the last word, and
  // it never comes down again in this act.
  const erupt = interpolate(frame, [0, doorsTo - 10], [0.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });
  // The plume gives way to the fire. Ten thousand years of quiet venting is
  // over and the thing that replaces it is brighter, so the smoke drops rather
  // than stacking on top.
  const smoke = interpolate(frame, [0, doorsTo], [0.95, 0.34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  // THE BIG WORD. `WordCard` rather than `BigWordBeat` for act one's reason: a
  // chant needs a character to chant it and the only voice here is the
  // Narrator's. It lands ON "At once." — measured at 0.74 of the clip with
  // `silencedetect`, not guessed — and holds alone into his approach gap, which
  // is STYLE's "a visual punchline gets a held beat of silence" paid out of
  // silence that was already bought.
  const cardFrom = doorsTo - 24;
  const cardUntil = doorsTo + 26;

  // THE CREW, clocking on. **They ride out with the doors, not with the third
  // line.** The first pass held them back to `buildFrom`, which left the first
  // seven and a half seconds of the eruption — the doors opening, the Big Word,
  // the mountain's apology — playing over the rig's bare fountain; script.md
  // asks for "fountains, glow, glory, staged as construction FROM THE FIRST
  // FRAME", and the crew *is* the construction. So they come up with `erupt`
  // and then thicken under "He was not exploding. He was building.", which is
  // the line that names what the audience has been watching for six seconds.
  const crew =
    interpolate(frame, [8, doorsTo], [0, 0.68], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeOutCubic,
    }) +
    interpolate(frame, [buildFrom - 24, buildFrom + 70], [0, 0.32], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeInOutSine,
    });

  // **NEVER TYPE AN X OR A Y FOR ONE OF HIS BUBBLES.** Computed at this act's
  // seat rather than at `VOLCANO_SEAT`, so the anchor follows the framing.
  const vb = volcanoBubble({ ...ERUPT, awake: 1 });

  return (
    <MountainWorld
      bg="sea_horizon_day"
      phase={4.2}
      drift={2}
      volcano={{
        scale: ERUPT.scale,
        awake: 1,
        erupt,
        smoke,
        speaking: stage.speaking("volcano"),
        // Straight down the lens, apologising. The bigger the spectacle, the
        // smaller the apology — and he is looking right at you while he makes
        // it, which is the whole butler register.
        look: "camera",
        emotion: "happy",
        // A shade of his own firelight on him. Kept low: at full strength the
        // kit's rim glow out-measures the mountain and becomes fog.
        rim: 0.24,
        // The one thing his body is allowed to do. A mountain with an open vent
        // breathes deeper, and that is the entire performance.
        breath: 1 + 1.1 * erupt,
      }}
      overlay={
        <>
          <WordCard
            text="ERUPTION"
            from={cardFrom}
            until={cardUntil}
            y={CARD_Y}
            bannerColor="#e0451f"
            sub="the doors opening"
          />
          <Bubbles
            scene={scene}
            cast={{ volcano: vb.mark } as Cast}
            text={{ a2_02_volcano: "This is the loud part." }}
            at={{ a2_02_volcano: vb.at }}
            maxWidth={vb.maxWidth}
          />
        </>
      }
    >
      <CrewFountain t={t} strength={crew} />
      {/* The vent's own light on the sky around it, up as the fountain does. */}
      <VentGlow strength={erupt} />
    </MountainWorld>
  );
};

/** The bloom the open vent lays on the sky behind it. */
const VentGlow: React.FC<{ strength: number }> = ({ strength }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        `radial-gradient(ellipse 760px 520px at ${ERUPT.x}px ${(CRATER_Y - 40).toFixed(0)}px,` +
        ` rgba(255,170,60,${(0.34 * strength).toFixed(3)}) 0%,` +
        ` rgba(255,120,40,${(0.14 * strength).toFixed(3)}) 44%, transparent 74%)`,
    }}
  />
);

// ---------------------------------------------------------------------------
// Scene 11 — Ember out, and renamed mid-flight
// ---------------------------------------------------------------------------

/**
 * How high she gets, and it is the bubble-kit gap wearing a staging hat.
 *
 * Above about y = 330 her bubble clamps to 170 and its tail — which always
 * leaves the bubble's bottom edge — lands above her crown, pointing at nothing.
 * 340 is the highest she can go and still be talked about by a bubble that
 * points at her. It is also, once you look at it, the better flight: she hangs
 * a hundred and thirty pixels over the summit instead of leaving the picture.
 */
const EMBER_APEX = 340;

const S11_BUBBLES: Record<string, string> = {
  a2_04_ember: "Outside! Sky! Everything!",
  a2_06_ember: "Was there paperwork?",
};

const LavaScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [, outTo] = lineWindow(scene, "a2_04_ember");
  const [nameFrom, nameTo] = lineWindow(scene, "a2_05_narrator");
  const [, formTo] = lineWindow(scene, "a2_06_ember");
  const [paperFrom] = lineWindow(scene, "a2_07_narrator");

  // HER BEST SECOND EVER, in three moves: out of the vent hard, a long hang
  // over the summit while she is renamed without being consulted, and then the
  // long fall down the flank towards the slope Scene 12 opens on.
  const rise = interpolate(frame, [0, outTo + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });
  const drift = interpolate(frame, [outTo + 8, formTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const fall = interpolate(frame, [paperFrom - 6, scene.durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInCubic,
  });
  // She leaves the picture, and she leaves it COMPLETELY. The first pass ended
  // the dive with her clipped by the right edge on the last frame of the scene,
  // which reads as a crop rather than as an exit. 620/520 puts her whole body
  // past the corner about twenty frames early, so the Narrator's driest line in
  // the act — "There was no paperwork. There never is." — buttons out over an
  // empty sky and a mountain, which is where that joke belongs.
  const x = ERUPT.x + 250 * rise + 310 * drift + 620 * fall;
  const y = CRATER_Y + (EMBER_APEX - CRATER_Y) * rise + 280 * drift + 520 * fall;
  const scale = 0.72 + 0.14 * fall;
  // She banks into her own path — a drop of lava at speed leans, and it is the
  // only pointing finger she has. Stretched on the launch, stretched again in
  // the dive, relaxed in between.
  const lean = 18 * rise - 12 * drift + 34 * fall;
  const squish = 0.5 * rise - 0.34 * drift + 0.42 * fall;

  const mark: Mark = {
    x,
    y: stand("ember", y + (320 * scale) / 2),
    scale,
    who: "ember",
    side: "left",
    offset: 400,
  };

  // THE RENAME, AS A PICTURE. Beats measured off `a2_05` with `silencedetect`
  // rather than split evenly: "…is called magma." ends at 3.10s of 8.95,
  // "Lava." is spoken at 6.42–6.88, and the sentence in between is where the
  // arrow draws. A card that lands a beat off the read is worse than no card.
  const at = (frac: number): number => nameFrom + Math.round((nameTo - nameFrom) * frac);

  return (
    <MountainWorld
      bg="sea_horizon_day"
      phase={4.9}
      drift={2}
      volcano={{
        scale: ERUPT.scale,
        awake: 1,
        erupt: 1,
        smoke: 0.3,
        look: "camera",
        emotion: "happy",
        rim: 0.24,
        breath: 2.1,
      }}
      overlay={
        <>
          <CardPair
            magmaFrom={at(0.32)}
            arrowFrom={at(0.56)}
            lavaFrom={at(0.73)}
            until={nameTo + 22}
            y={CARD_Y}
          />
          <Bubbles scene={scene} cast={{ ember: mark } as Cast} text={S11_BUBBLES} />
        </>
      }
    >
      <CrewFountain t={t} strength={1} />
      <VentGlow strength={1} />
      <Ember
        x={x}
        y={mark.y}
        scale={scale}
        phase={PHASE.ember}
        lean={lean}
        squish={squish}
        wisps={1}
        glow={1}
        shadow={false}
        emotion={useEmotion(
          scene,
          "ember",
          { a2_04_ember: EMBER_RESTING, a2_06_ember: "grumpy" },
          EMBER_RESTING,
        )}
        speaking={stage.speaking("ember")}
        // She looks where she is going, except while she is filing a
        // complaint, when she looks at whoever is supposed to be listening.
        look={frame >= nameTo ? "camera" : { x: 0.6, y: -0.5 }}
      />
    </MountainWorld>
  );
};

// ---------------------------------------------------------------------------
// Scenes 12–16 — the slope
// ---------------------------------------------------------------------------

/**
 * The slope's cast, staged once and shared by five scenes, because five scenes
 * of one framing means five scenes of one set of marks. A scene passes what has
 * changed — how far the front has got, how crusted she is, how warm the light
 * is — and nothing else moves, ever.
 */
const SlopeCast: React.FC<{
  scene: TimedScene;
  front: number;
  emberEmotion: Parameters<typeof Ember>[0]["emotion"];
  emberLook: Parameters<typeof Ember>[0]["look"];
  emberCrust: number;
  emberSquish: number;
  emberLean: number;
  sunnyEmotion: Parameters<typeof Sunny>[0]["emotion"];
  sunnyLook: Parameters<typeof Sunny>[0]["look"];
  sunnyScale: number;
  speaking: (who: "ember" | "rock" | "sunny") => boolean;
}> = ({
  front,
  emberEmotion,
  emberLook,
  emberCrust,
  emberSquish,
  emberLean,
  sunnyEmotion,
  sunnyLook,
  sunnyScale,
  speaking,
}) => {
  // She rides the front and stops when it does — one number drives both, so
  // the picture can never disagree with itself about where the traffic is.
  const ex = Math.min(EMBER_PARK, front - 40);
  return (
    <>
      <Sunny
        x={SUNNY_SLOPE.x}
        y={hover("sunny", SUNNY_SLOPE.cy, sunnyScale)}
        scale={sunnyScale}
        phase={PHASE.sunny}
        emotion={sunnyEmotion}
        speaking={speaking("sunny")}
        look={sunnyLook}
      />
      <Ember
        x={ex}
        y={stand("ember", flowTop(Math.min(WIDTH, Math.max(0, ex))))}
        scale={EMBER_SLOPE_SCALE}
        phase={PHASE.ember}
        lean={emberLean}
        squish={emberSquish}
        crust={emberCrust}
        wisps={Math.max(0, 0.9 - emberCrust)}
        glow={Math.max(0.15, 1 - emberCrust * 0.8)}
        shadow={false}
        emotion={emberEmotion}
        speaking={speaking("ember")}
        look={emberLook}
      />
      <Rock
        x={ROCK_SLOPE.x}
        y={ROCK_SLOPE_MARK.y}
        scale={ROCK_SLOPE.scale}
        phase={PHASE.rock}
        speaking={speaking("rock")}
      />
      {/* The flow's light lands on Rock's shoulder rather than being drawn
          behind him — see `FlowGlow`. It takes no `t`: the glow is a position,
          not an animation, and the only thing that changes it is how close the
          front has got. */}
      <FlowGlow x={ROCK_SLOPE.x + 40} y={SLOPE.ground - 150} strength={Math.min(1, Math.max(0, (front - 700) / 450))} />
    </>
  );
};

/** Ember's mark on the parked front — the one every bubble in 13–16 uses. */
const emberSlopeMark = (front: number): Mark => {
  const ex = Math.min(EMBER_PARK, front - 40);
  return {
    x: ex,
    y: stand("ember", flowTop(Math.min(WIDTH, Math.max(0, ex)))),
    scale: EMBER_SLOPE_SCALE,
    who: "ember",
    side: "left",
    // 260 is the far end of the same argument as Rock's 220: it is the biggest
    // offset whose tail still lands on her, and the smallest whose widest
    // bubble still stops short of Sunny's outermost ray at 1286.
    offset: 260,
  };
};

// ---------------------------------------------------------------------------
// Scene 12 — The traffic jam
// ---------------------------------------------------------------------------

const S12_BUBBLES: Record<string, string> = {
  a2_11_rock: "Ohh yeah. That is the stuff.",
  a2_12_ember: "This traffic is broken.",
  a2_13_rock: "It is resting.",
};

const TrafficScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [, fastTo] = lineWindow(scene, "a2_08_narrator");
  const [slowFrom, slowTo] = lineWindow(scene, "a2_09_narrator");
  const [besideFrom, besideTo] = lineWindow(scene, "a2_10_narrator");

  // THE FRONT, AND IT IS THE WHOLE SCENE. Three ramps, each keyed to the
  // sentence that describes it, and every other number in the shot is derived
  // from this one: where Ember is, how crusted the nose is, how warm Rock is.
  //
  // `a2_09`'s clauses are measured (`silencedetect`): "Lava is slow traffic."
  // 0.37–1.79, "the front … grows a dark skin," 2.28–4.04, "and thickens, and
  // stalls." 4.27–5.58. The deceleration is laid on those, so the word "stalls"
  // and the last pixel of travel arrive together.
  const front =
    interpolate(frame, [0, fastTo], [FLOW_IN, 560], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeOutSine,
    }) +
    interpolate(frame, [slowFrom, slowTo], [0, 440], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeOutCubic,
    }) +
    interpolate(frame, [besideFrom, besideFrom + Math.round((besideTo - besideFrom) * 0.7)], [0, FLOW_STALL - 1000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeOutCubic,
    });

  // The dark skin, on the FRONT only. Physics-honest and it is the plant: the
  // same thing happens to Ember one scene later, by the same mechanism, drawn
  // the same way.
  const crust = interpolate(
    frame,
    [slowFrom + (slowTo - slowFrom) * 0.38, slowFrom + (slowTo - slowFrom) * 0.92],
    [0, 0.42],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );

  // She arrives at speed and stalls with the traffic. Negative squish is her
  // whole vocabulary for stopping — she flattens against the jam.
  const speed = Math.max(0, Math.min(1, (front - FLOW_IN) / 900));
  const moving = interpolate(frame, [slowFrom, slowTo], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });

  const cast = {
    ember: emberSlopeMark(front),
    rock: ROCK_SLOPE_MARK,
    sunny: SUNNY_SLOPE_MARK,
  } as Cast;

  return (
    <SlopeWorld
      phase={5.4}
      flow={<LavaFlow t={t} front={front} crust={crust} heat={1} />}
      overlay={
        <Bubbles
          scene={scene}
          cast={cast}
          text={S12_BUBBLES}
          at={aimTails(S12_BUBBLES, cast)}
        />
      }
    >
      <SlopeCast
        scene={scene}
        front={front}
        emberEmotion={useEmotion(
          scene,
          "ember",
          { a2_12_ember: "grumpy" },
          EMBER_RESTING,
        )}
        emberLook={moving > 0.4 ? { x: 1, y: 0.1 } : { x: -0.5, y: 0.6 }}
        emberCrust={0}
        emberSquish={0.42 * moving * speed - 0.34 * (1 - moving)}
        emberLean={22 * moving}
        // **THE SILENT GAG.** "Beside the flow, warm at last, sat somebody you
        // have met before" — and the centuries of sunshine that failed to do it
        // are hanging in the top right of the frame watching. `skeptical` is the
        // series' deadpan face: unimpressed, never sulky, and it costs a line
        // of code and no runtime.
        sunnyEmotion={emotionAt(
          frame,
          [{ at: besideFrom + Math.round((besideTo - besideFrom) * 0.55), emotion: "skeptical" }],
          "proud",
        )}
        sunnyLook={frame >= besideFrom ? { x: -0.8, y: 0.7 } : { x: -0.5, y: 0.5 }}
        sunnyScale={SUNNY_SLOPE.scale}
        speaking={stage.speaking}
      />
    </SlopeWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 13 — The crust (the spine gag debuts)
// ---------------------------------------------------------------------------

const S13_BUBBLES: Record<string, string> = {
  a2_15_ember: "Done!",
  a2_16_rock: "Started.",
  a2_18_ember: "I have places to be.",
  a2_19_rock: "You are not going somewhere.",
  a2_20_rock: "You are becoming somewhere.",
};

const CrustScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [, darkTo] = lineWindow(scene, "a2_14_narrator");
  const [doneFrom] = lineWindow(scene, "a2_15_ember");
  const [skinFrom, skinTo] = lineWindow(scene, "a2_17_narrator");
  const [declineFrom, declineTo] = lineWindow(scene, "a2_18_ember");

  // **THE SPINE GAG'S BODY.** `crust` is a stroke on her own outline, so the
  // rind grows from her edge inward and half of it is genuinely outside her —
  // which is the physics `a2_17` states twice ("The outside cools first. The
  // inside stays hot"). It goes on in two moves: the edges go dark under
  // `a2_14`, and the Narrator's explanation finishes the job.
  const crust =
    interpolate(frame, [0, darkTo], [0, 0.5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeInOutSine,
    }) +
    interpolate(frame, [skinFrom, skinTo], [0, 0.42], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeInOutSine,
    });

  // THE LURCH, and it is the gag: "I decline. I have places to be." She winds
  // up, she strains, and she does not move by one pixel. A body of liquid that
  // has grown a shell is the only character in the series who can perform going
  // somewhere without going.
  const lurch = interpolate(
    frame,
    [declineFrom + 10, declineTo - 4, declineTo + 14],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );

  // The hour turns over while nobody moves. The flow is visibly cooler at the
  // end of this scene than at the start, and nothing says so.
  const heat = interpolate(frame, [0, scene.durationInFrames], [1, 0.78], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cast = {
    ember: emberSlopeMark(FLOW_STALL),
    rock: ROCK_SLOPE_MARK,
    sunny: SUNNY_SLOPE_MARK,
  } as Cast;

  return (
    <SlopeWorld
      phase={6.1}
      wash={{ color: "72,44,104", strength: 0.1 * (1 - heat) * 5 }}
      flow={<LavaFlow t={t} front={FLOW_STALL} crust={0.42 + 0.3 * (1 - heat) * 4} heat={heat} />}
      overlay={
        <Bubbles
          scene={scene}
          cast={cast}
          text={S13_BUBBLES}
          at={aimTails(S13_BUBBLES, cast)}
        />
      }
    >
      <SlopeCast
        scene={scene}
        front={FLOW_STALL}
        // NO_LEAD: this scene owns a trailing held beat and the chain's own
        // 24f, and the kit's eight-frame lead would put her reaction to
        // "Started." inside the silence in front of it.
        emberEmotion={useEmotion(
          scene,
          "ember",
          { a2_15_ember: "proud", a2_18_ember: "grumpy" },
          EMBER_RESTING,
          NO_LEAD,
        )}
        // She inspects herself, files the verdict, and then spends the rest of
        // the scene refusing to look at the rock who is right.
        emberLook={
          frame >= doneFrom - 14 && frame < skinTo ? { x: -0.2, y: 0.9 } : { x: 1, y: 0.1 }
        }
        emberCrust={crust}
        emberSquish={-0.2 + 0.55 * lurch}
        emberLean={16 * lurch}
        sunnyEmotion="skeptical"
        sunnyLook={{ x: -0.8, y: 0.7 }}
        sunnyScale={SUNNY_SLOPE.scale}
        speaking={stage.speaking}
      />
    </SlopeWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 14 — The unmoving countdown
// ---------------------------------------------------------------------------

/**
 * **All three of her questions open with "How long", and that is the scene.**
 * The countdown is one joke told three times at a body who will not move, so
 * the bubbles have to rhyme on the page the way the clips rhyme in the ear.
 *
 * Two of them are summaries rather than transcripts, because the clips are
 * seven words and the kit's limit is six (it warns, and the first pass shipped
 * the warning): `a2_21`'s "How long until I am a mountain?" draws as "How long
 * to be a mountain?", and `a2_29`'s "How long have you been sitting here?" as
 * "How long have you sat here?". Both keep the opening two words, the object,
 * and the question mark — which is everything a six-year-old reads off a
 * bubble — and neither touches the recorded line.
 */
const S14_BUBBLES: Record<string, string> = {
  a2_21_ember: "How long to be a mountain?",
  a2_22_rock: "Ten thousand years.",
  a2_23_ember: "How long if I hurry?",
  a2_24_rock: "No.",
  a2_26_rock: "I came out of there.",
  a2_27_ember: "You were lava?",
  a2_28_rock: "I was fast once.",
  a2_29_ember: "How long have you sat here?",
  a2_30_rock: "Since I stopped.",
};

const CountdownScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [tenFrom] = lineWindow(scene, "a2_22_rock");
  const [lookFrom, lookTo] = lineWindow(scene, "a2_31_narrator");

  // **BUS-STOP STAGING, AND IT IS THE JOKE.** The fastest voice in the series
  // parked next to the slowest, both completely certain, and for thirty-four
  // seconds the only things that move in this frame are two mouths, the skin
  // plates drifting down the river at one pixel a second, and the light going
  // out of the day. Anything else staged in here would be the scene apologising
  // for its own premise.
  //
  // Her one physical beat is a flinch on the number: `a2_22` is "Ten thousand
  // years." and she flattens, which is `squish` doing what the rig note says it
  // is for — "landing, stalling, hearing a number".
  const number = interpolate(frame, [tenFrom + 24, tenFrom + 40, tenFrom + 130], [0, 1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });

  const heat = interpolate(frame, [0, scene.durationInFrames], [0.78, 0.56], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // THE FAMILY PHOTOGRAPH. "Ember looked at Rock for a long time … She was
  // looking at her own future. It was very calm." Measured off the clip: the
  // sentence about her own future runs 0.60–0.79 of it, so the face settles to
  // `neutral` under the first clause and simply stays there — the calmest thing
  // this character has ever been asked to do, and the last frame of it is the
  // one the act break cuts away from.
  const looking = frame >= lookFrom;

  const cast = {
    ember: emberSlopeMark(FLOW_STALL),
    rock: ROCK_SLOPE_MARK,
    sunny: SUNNY_SLOPE_MARK,
  } as Cast;

  return (
    <SlopeWorld
      phase={6.8}
      // **THE HOUR, NOT A CURTAIN.** The first pass ran this to 0.94, which the
      // gradient's own 1.15 top stop turns into an opaque purple sheet over the
      // plate AND the cast: at the act's quietest moment Ember lost her colour,
      // Rock went flat grey and the sun desaturated. Evening is a *value* change
      // — 0.14 → 0.30 picks up exactly where Scene 13's ramp left off (0.11) and
      // hands Scene 15 a sky the eruption can then set on fire.
      wash={{ color: "72,44,104", strength: 0.14 + (0.78 - heat) * 0.73 }}
      flow={<LavaFlow t={t} front={FLOW_STALL} crust={0.74} heat={heat} />}
      overlay={
        <Bubbles
          scene={scene}
          cast={cast}
          text={S14_BUBBLES}
          at={aimTails(S14_BUBBLES, cast)}
        />
      }
    >
      <SlopeCast
        scene={scene}
        front={FLOW_STALL}
        emberEmotion={useEmotion(
          scene,
          "ember",
          {
            a2_21_ember: EMBER_RESTING,
            a2_23_ember: EMBER_RESTING,
            a2_27_ember: "amazed",
            a2_29_ember: "neutral",
          },
          EMBER_RESTING,
          NO_LEAD,
        )}
        // She looks at Rock from the moment she asks him a question and never
        // looks away again. He never looks at her — four episodes of that is
        // who he is, and his eyes are drawn shut.
        emberLook={looking && frame < lookTo ? { x: -0.75, y: 0.55 } : { x: -0.6, y: 0.4 }}
        emberCrust={0.92}
        emberSquish={-0.16 - 0.34 * number}
        emberLean={-6}
        sunnyEmotion="skeptical"
        sunnyLook={{ x: -0.8, y: 0.7 }}
        sunnyScale={SUNNY_SLOPE.scale}
        speaking={stage.speaking}
      />
    </SlopeWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 15 — THE CEREMONY, part one: the claim
// ---------------------------------------------------------------------------

const CeremonyClaimScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [skyFrom, skyTo] = lineWindow(scene, "a2_32_narrator");
  const [claimFrom] = lineWindow(scene, "a2_33_sunny");
  const [v4From, v4To] = lineWindow(scene, "a2_35_volcano");

  // **HOISTED ON PURPOSE.** This scene returns two completely different trees —
  // the slope, and the portrait during V4 — and `useEmotion` is a hook. Called
  // inline in the slope's JSX it would run on the slope's frames and not on the
  // portrait's, changing this component's hook count mid-composition: React
  // #300, a bricked player, and a bug stills structurally cannot see. Act one's
  // Scene 9 carries the same note for the same reason.
  const emberEmotion = useEmotion(scene, "ember", {}, "neutral", NO_LEAD);

  // The sky goes up as the eruption reaches full glory, and it is FINISHED
  // before Sunny opens his mouth: nothing may still be in flight under the 60f
  // that follows "I did that.", and a wash still ramping is a camera move by
  // another name.
  const glory = interpolate(frame, [0, claimFrom - 20], [0.18, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  // He inflates. Four episodes of a perfect record, and the biggest picture any
  // claim of his will ever get behind it. The swell also lands entirely inside
  // `a2_32`, for the same reason the wash does.
  const swell = interpolate(frame, [skyFrom + 40, skyTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutBack,
  });

  const vb = volcanoBubble({ ...ERUPT, awake: 1 });

  // --- V4: the politest correction in series history ------------------------
  //
  // The cut lands on his first frame, exactly as the wake's did: the 48f
  // approach is played out on the slope, in silence, and then the picture
  // changes. Cutting INTO the approach would spend the gap on a camera move,
  // and the gap is the mountain deciding to speak.
  if (frame >= v4From && frame < v4To) {
    return (
      <MountainWorld
        bg="sea_horizon_day"
        phase={7.4}
        drift={2}
        volcano={{
          scale: ERUPT.scale,
          awake: 1,
          erupt: 1,
          smoke: 0.3,
          speaking: stage.speaking("volcano"),
          look: "camera",
          emotion: "happy",
          rim: 0.24,
          breath: 2.1,
        }}
        overlay={
          <Bubbles
            scene={scene}
            cast={{ volcano: vb.mark } as Cast}
            text={{ a2_35_volcano: "It came with the house." }}
            at={{ a2_35_volcano: vb.at }}
            maxWidth={vb.maxWidth}
          />
        }
      >
        <CrewFountain t={t} strength={1} />
        <VentGlow strength={1} />
        <CeremonyLight t={t} />
      </MountainWorld>
    );
  }

  return (
    <SlopeWorld
      phase={7.1}
      wash={{ color: "255,126,40", strength: 0.16 + 0.2 * glory }}
      sky={<EruptionSky t={t} strength={glory} />}
      flow={<LavaFlow t={t} front={FLOW_STALL} crust={0.74} heat={0.62} />}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ sunny: SUNNY_SLOPE_MARK } as Cast}
          text={{ a2_33_sunny: "I did that." }}
          at={{ a2_33_sunny: SUNNY_BUBBLE }}
        />
      }
    >
      <SlopeCast
        scene={scene}
        front={FLOW_STALL}
        emberEmotion={emberEmotion}
        // Nobody answers. She does not look at him, she does not react, and
        // that is what makes the sixty frames land — the world simply carries
        // on being a lava flow.
        emberLook={{ x: -0.6, y: 0.4 }}
        emberCrust={0.92}
        emberSquish={-0.16}
        emberLean={-6}
        // `proud`, unchanged, all the way through the hold. The claim is made
        // at full confidence and the silence after it changes nothing on his
        // face — that is the fuse hissing, not the fuse going off.
        sunnyEmotion="proud"
        // He turns to the lens WHILE he claims it, not after. `lookOffset` has
        // no easing — a look change is a one-frame pupil cut — and the sixty
        // frames after "I did that." are a hold whose entire content is that
        // nobody moves. Landing the turn on the second word of his own line
        // spends it where it reads as swagger; landing it on `claimTo` would
        // put the only moving thing in the frame inside the silence.
        sunnyLook={frame >= claimFrom + 12 ? "camera" : { x: -0.9, y: -0.4 }}
        sunnyScale={SUNNY_SLOPE.scale + 0.08 * swell}
        speaking={stage.speaking}
      />
    </SlopeWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 16 — THE CEREMONY, part two: the fuse closes
// ---------------------------------------------------------------------------

const FuseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [todayFrom, todayTo] = lineWindow(scene, "a2_40_narrator");
  const [notMineFrom] = lineWindow(scene, "a2_41_sunny");
  const [seaFrom, seaTo] = lineWindow(scene, "a2_42_sunny");
  const [allFrom] = lineWindow(scene, "a2_43_sunny");

  // ---------------------------------------------------------------------------
  // **THE SERIES RECORD — 180 frames after `a2_40_narrator`, and NOTHING
  // ENTERS IT.**
  //
  // The hold runs `[todayTo, notMineFrom)`. Every number in this scene is
  // written so that it is either finished before `todayTo` or does not begin
  // until `notMineFrom`:
  //
  //   the stunned face   lands at 0.62 of "It is today." — on the word — and
  //                      its four-frame morph is done sixteen frames before the
  //                      silence opens. `emotionAt` rather than `useEmotion`,
  //                      because the beat hangs on a NARRATOR line and
  //                      `useEmotion` can only key off the body's own turns.
  //   the swell          starts at `seaFrom`, which is inside the recovery.
  //   the sky            is a constant. No ramp, no drift, no camera.
  //
  // What is left moving is the eruption glowing and the embers rising, both of
  // which were already running when the silence opened and neither of which is
  // a beat. Sunny hangs perfectly still; Ember, for the first time in her life,
  // does not speak.
  // ---------------------------------------------------------------------------
  const stunAt = todayFrom + Math.round((todayTo - todayFrom) * 0.62);
  const sunnyEmotion = emotionAt(
    frame,
    [
      { at: stunAt, emotion: "amazed" },
      { at: seaFrom, emotion: "excited" },
      { at: allFrom, emotion: "proud" },
    ],
    "proud",
    // Four frames, not the kit's eight: the change has to be over before the
    // hold opens, and a face that is still moving into the silence is a face
    // reacting inside it.
    4,
  );

  // THE RECOVERY, AS SIZE. He comes back up to full wattage on truths, and
  // every claim in the swell is individually true — so the picture is allowed
  // to agree with him. It starts on `a2_42` and not one frame earlier.
  const back = interpolate(frame, [seaFrom, allFrom], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutBack,
  });

  // The two halves of `a2_42`, measured (`silencedetect`): "…warm because of
  // me!" is 0.28–2.96 of 6.84 and "…bright because of me!" is 3.19–5.94. One
  // clip, two bubbles, on the ep-4 roll-call pattern — and they are pictures of
  // loudness rather than transcripts, which the bubble doc explicitly allows.
  const half = seaFrom + Math.round((seaTo - seaFrom) * 0.45);

  return (
    <SlopeWorld
      phase={7.9}
      wash={{ color: "255,126,40", strength: 0.36 }}
      sky={<EruptionSky t={t} strength={1} />}
      flow={<LavaFlow t={t} front={FLOW_STALL} crust={0.74} heat={0.62} />}
      overlay={
        <>
          <Bubbles
            scene={scene}
            cast={{ sunny: SUNNY_SLOPE_MARK } as Cast}
            text={{
              a2_41_sunny: "The fire is not mine.",
              a2_43_sunny: "I am all the other things!",
            }}
            at={{ a2_41_sunny: SUNNY_BUBBLE, a2_43_sunny: SUNNY_BUBBLE }}
          />
          <SpeechBubble
            x={SUNNY_BUBBLE.x}
            y={SUNNY_BUBBLE.y}
            text="The sea is warm! Me!"
            tail="right"
            tailAt={SUNNY_SLOPE.x}
            from={seaFrom}
            until={half}
          />
          <SpeechBubble
            x={SUNNY_BUBBLE.x}
            y={SUNNY_BUBBLE.y}
            text="The sky is bright! Me!"
            tail="right"
            tailAt={SUNNY_SLOPE.x}
            from={half}
            until={seaTo}
          />
        </>
      }
    >
      <SlopeCast
        scene={scene}
        front={FLOW_STALL}
        // Held. Her face at the act break is the one Scene 14 left on it, and
        // it does not move once in this scene — including for the record.
        emberEmotion="neutral"
        emberLook={{ x: -0.6, y: 0.4 }}
        emberCrust={0.92}
        emberSquish={-0.16}
        emberLean={-6}
        sunnyEmotion={sunnyEmotion}
        sunnyLook={frame >= notMineFrom ? "camera" : { x: -0.9, y: -0.4 }}
        sunnyScale={SUNNY_SLOPE.scale + 0.08 + 0.06 * back}
        speaking={stage.speaking}
      />
    </SlopeWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 17 — The surge, the sea, and the skin
// ---------------------------------------------------------------------------

const S17_BUBBLES: Record<string, string> = {
  a3_02_ember: "I am coming to the sea!",
  a3_03_ember: "Am I rock? Already?",
  a3_08_rock: "I moved.",
  a3_10_ember: "Done!",
  a3_11_rock: "Started.",
};

const SurgeScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [brokeFrom, brokeTo] = lineWindow(scene, "a3_01_narrator");
  const [movingFrom, movingTo] = lineWindow(scene, "a3_02_ember");
  const [waitFrom, waitTo] = lineWindow(scene, "a3_03_ember");
  const [steamFrom] = lineWindow(scene, "a3_05_narrator");
  const [blowFrom, blowTo] = lineWindow(scene, "a3_06_narrator");
  const [rideFrom, rideTo] = lineWindow(scene, "a3_07_narrator");
  const [doneFrom] = lineWindow(scene, "a3_10_ember");

  // THE SURGE. "In the night, the crust on the stalled flow broke. And the flow
  // surged." — so the crust goes first (it cracks under the first clause) and
  // the front lets go under the second, hard, and runs to the sea.
  const cracked = interpolate(frame, [brokeFrom + 30, brokeTo - 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const front = interpolate(frame, [brokeTo - 24, movingTo + 10], [420, 1420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  // **HER OUTSIDE HARDENS MID-WORD** (script.md's own stage direction, and the
  // episode's only seasoned MiniMax field is on this line). The sea skins her
  // in about a second: the one instant thing in geology, happening to the
  // character who has spent the whole episode demanding instant.
  const crust = interpolate(frame, [waitFrom + 6, waitFrom + 40], [0.15, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });

  const steam = interpolate(frame, [movingTo, steamFrom + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  // THE HONEST-FUTILITY GAG. "Ember blew on the next wave of lava, to help it
  // hurry up and be ground. That helped. Nobody can measure how much. But it
  // helped." She has no arms, so blowing is the only help she is physically
  // capable of offering, and the picture has to be *almost* nothing: one small
  // puff, and one speck of the flow going dark under it and staying dark.
  const blow = interpolate(
    frame,
    [blowFrom + 20, blowFrom + 40, blowFrom + 74, blowFrom + 96],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );
  const helped = interpolate(frame, [blowFrom + 46, blowTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutSine,
  });

  // ROCK, RAFTING. Measured off `a3_07`: "the surge had carried Rock all the
  // way down the mountain," runs 0.03–0.27 of the clip and "riding on top of
  // the flow." 0.29–0.41, so he enters under the first clause and is parked by
  // the end of the second. Big rocks do not melt on the way — the flow is not
  // hot enough for long enough — so he arrives whole, and nothing on screen is
  // harmed by anything.
  const ride = interpolate(
    frame,
    [rideFrom + Math.round((rideTo - rideFrom) * 0.03), rideFrom + Math.round((rideTo - rideFrom) * 0.42)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeOutCubic },
  );
  const rockX = -420 + (620 - -420) * ride;

  const ex = Math.min(1300, front - 120);
  const emberY = stand("ember", nightFlowTop(Math.min(WIDTH, Math.max(0, ex))));
  // Offsets on the slope's argument, mirrored: hers left because the sea is
  // that way and the steam column is not, his right because he arrives from
  // off frame left. See the tail note in the header — at 380 the chain's
  // "Started." tailed into open water.
  const emberMark: Mark = {
    x: ex,
    y: emberY,
    scale: 0.95,
    who: "ember",
    side: "left",
    offset: 260,
  };
  const rockMark: Mark = {
    x: rockX,
    y: stand("rock", nightFlowTop(Math.min(WIDTH, Math.max(0, rockX))) + 26),
    scale: 0.9,
    who: "rock",
    side: "right",
    offset: 220,
  };
  const cast = { ember: emberMark, rock: rockMark } as Cast;
  // Her first line rides the surge from x≈570 to x≈1300, and a bubble on her
  // LEFT for that whole trip starts out parked across the volcano's face at
  // frame left — the one shot in the episode that has the whole chain in one
  // picture, with his eye behind a speech bubble. So this one line, and only
  // this one, sits on her sea side. The side is pinned rather than left to the
  // kit's `x < WIDTH/2` default because she crosses the midline *inside* the
  // line: the default would teleport the bubble across her mid-sentence.
  //
  // The `x` is capped at 1300 for the other half of the same problem: pushed
  // past about 1400 the bubble stops moving and starts SHRINKING (the kit gap
  // in the header — an absolutely-positioned box runs out of room before its
  // `maxWidth`), and six words re-wrapped into four lines is a different
  // bubble. Capped, it walks out with her and then waits for her to catch up,
  // which is where she ends the line anyway.
  const at = aimTails(S17_BUBBLES, cast);
  const s17At = {
    ...at,
    a3_02_ember: { tailAt: ex, side: "right" as const, x: Math.min(1300, ex + 260) },
  };

  return (
    <NightWorld
      phase={8.6}
      volcano={{ erupt: 1, smoke: 0.32, rim: 0.9, breath: 2.1 }}
      overlay={
        <Bubbles
          scene={scene}
          cast={cast}
          text={S17_BUBBLES}
          at={s17At}
        />
      }
    >
      {/* The flow, at night, on the newest ground in the world. Its crust is
          what broke, so it runs at a crust that DROPS as the surge lets go —
          the one place in the episode where that number goes down. */}
      <LavaFlowNight t={t} front={front} crust={0.8 - 0.55 * cracked} helped={helped} />
      <SteamPlumes t={t} x={Math.min(1460, front + 30)} y={shoreY(Math.min(WIDTH, front)) - 10} strength={steam} />
      <Ember
        x={ex}
        y={emberY}
        scale={0.95}
        phase={PHASE.ember}
        lean={18 * Math.max(0, Math.min(1, (front - 500) / 700)) * (frame < waitFrom ? 1 : 0)}
        squish={frame < waitFrom ? 0.34 : -0.22}
        crust={crust}
        wisps={Math.max(0, 0.9 - crust)}
        glow={Math.max(0.2, 1 - crust * 0.75)}
        shadow={false}
        emotion={useEmotion(
          scene,
          "ember",
          { a3_02_ember: EMBER_RESTING, a3_03_ember: "amazed", a3_10_ember: "proud" },
          EMBER_RESTING,
          NO_LEAD,
        )}
        speaking={stage.speaking("ember")}
        look={
          frame >= doneFrom - 14
            ? { x: -0.2, y: 0.9 }
            : frame >= waitFrom
              ? { x: -0.2, y: 0.8 }
              : { x: 1, y: 0 }
        }
      />
      {/* The puff lands ON the lava, not in the sky. Drawn at her own height it
          floats over open water at night and reads as a seagull; put on the
          flow's surface just downstream of her it reads as what it is — the
          only help a character with no arms can offer, aimed at the one speck
          of ground she is personally responsible for. */}
      {blow > 0.02 ? (
        <Blow
          x={ex + 90}
          y={nightFlowTop(Math.min(WIDTH, Math.max(0, ex + 150))) - 24}
          strength={blow}
        />
      ) : null}
      <Rock
        x={rockX}
        y={rockMark.y}
        scale={0.9}
        phase={PHASE.rock}
        speaking={stage.speaking("rock")}
      />
    </NightWorld>
  );
};

/**
 * The night flow: the same river, cooler, with the steam end of it and the one
 * speck of ground Ember is personally responsible for.
 *
 * A separate component rather than a prop on `LavaFlow` because almost nothing
 * is shared — different centre line, different palette, a nose that ends in
 * water rather than in a stall, and a crust that is coming OFF.
 */
const LavaFlowNight: React.FC<{
  t: number;
  front: number;
  crust: number;
  helped: number;
}> = ({ t, front, crust, helped }) => {
  const nose = front;
  const top: string[] = [];
  const bottom: string[] = [];
  for (let x = WIDE.x; x <= nose; x += 40) {
    const cx = Math.min(WIDTH, Math.max(0, x));
    const taper = Math.min(1, (nose - x) / 110);
    const h = nightFlowHalf(cx) * (0.22 + 0.78 * taper);
    top.push(`${x.toFixed(0)} ${(nightFlowY(cx) - h).toFixed(1)}`);
    bottom.unshift(`${x.toFixed(0)} ${(nightFlowY(cx) + h).toFixed(1)}`);
  }
  const band = `M ${top.join(" L ")} L ${bottom.join(" L ")} Z`;
  return (
    <WideLayer>
      <path
        d={band}
        fill="none"
        stroke={EMBER_COLOR.glow}
        strokeWidth={210}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.16}
      />
      <path d={band} fill={EMBER_COLOR.body} stroke={EMBER_COLOR.crust} strokeWidth={7} strokeLinejoin="round" />
      <path
        d={band}
        fill="none"
        stroke={EMBER_COLOR.crust}
        strokeWidth={8 + crust * 34}
        strokeLinejoin="round"
        opacity={0.88}
      />
      <path
        d={
          `M ` +
          Array.from({ length: 22 }, (_, i) => {
            const x = WIDE.x + ((nose - WIDE.x) * i) / 21;
            const cx = Math.min(WIDTH, Math.max(0, x));
            return `${x.toFixed(0)} ${nightFlowY(cx).toFixed(1)}`;
          }).join(" L ")
        }
        fill="none"
        stroke={EMBER_COLOR.hot}
        strokeWidth={Math.max(5, 34 * (1 - crust * 0.6))}
        strokeLinecap="round"
        opacity={0.9}
      />
      {/* The skin, breaking up: plates riding downstream, faster than the
          daytime flow's because this one has let go. */}
      {Array.from({ length: 9 }, (_, i) => {
        const u = ((t * 0.05 + i / 9) % 1);
        const x = WIDE.x + (nose - WIDE.x) * u;
        if (x < -200 || x > nose - 60) return null;
        const cx = Math.min(WIDTH, Math.max(0, x));
        const h = nightFlowHalf(cx);
        return (
          <ellipse
            key={i}
            cx={x}
            cy={nightFlowY(cx) + (((i * 31) % 7) - 3) * h * 0.11}
            rx={50 + ((i * 47) % 90) * 0.5}
            ry={h * 0.34}
            fill={EMBER_COLOR.crust}
            opacity={0.28 + 0.5 * crust}
          />
        );
      })}
      {/* **THE ONE SPECK SHE COOLED.** "That helped. Nobody can measure how
          much. But it helped." So it is measurable to exactly one person: it is
          forty pixels across on a river a thousand pixels long, it never grows,
          and nothing points at it. */}
      {helped > 0.02 ? (
        <ellipse
          cx={Math.min(WIDTH, Math.max(0, 1150))}
          cy={nightFlowY(1150)}
          rx={22}
          ry={11}
          fill={EMBER_COLOR.crust}
          opacity={0.9 * helped}
        />
      ) : null}
    </WideLayer>
  );
};

/**
 * Her breath, blown at a river of lava. Three small paper-coloured arcs leaving
 * her and gone — the comics device, detached from her body so it can never read
 * as anatomy, and small enough that the gag is the size of it.
 */
const Blow: React.FC<{ x: number; y: number; strength: number }> = ({ x, y, strength }) => (
  <WideLayer>
    {[0, 1, 2].map((i) => {
      const u = Math.max(0, Math.min(1, strength * 1.2 - i * 0.16));
      if (u <= 0.02) return null;
      return (
        <path
          key={i}
          d={
            `M ${(x + 20 + i * 46).toFixed(0)} ${(y - 12 + i * 9).toFixed(0)}` +
            ` q 34 ${(-10 - i * 5).toFixed(0)} 68 ${(4 + i * 3).toFixed(0)}`
          }
          stroke={kidTheme.paper}
          strokeWidth={7 - i}
          strokeLinecap="round"
          fill="none"
          opacity={0.6 * Math.sin(u * Math.PI) ** 0.5}
        />
      );
    })}
  </WideLayer>
);

export const ACT2_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s10_eruption: EruptionScene,
  s11_lava: LavaScene,
  s12_traffic: TrafficScene,
  s13_crust: CrustScene,
  s14_countdown: CountdownScene,
  s15_ceremony_claim: CeremonyClaimScene,
  s16_ceremony_fuse: FuseScene,
  // **SCENE 17 IS ACT TWO'S — SETTLED, NOT A COLLISION.**
  // The two act briefs disagreed at this boundary (the worklist gives act 2
  // "scenes 10–17"; the header of `act3.tsx` opened at "s17_surge"), and the
  // showrunner ruled it: act 3's map correctly excludes `s17_surge`, so the
  // staging below is the one that plays and there is nothing here to
  // de-duplicate. The ruling is on the record in `ep5-decision-log.md`,
  // "Act-wave salvage calls". Scene 17 opens act three in script.md and is
  // built here, which is only odd on paper: it is the last shot of the flow
  // this file has been staging since Scene 12, and the two frames of it that
  // matter — the chain's second firing and Rock's "I moved." — are the ones
  // Scene 13 planted. Whoever splits the acts differently next time should
  // move the whole shot, not the map entry.
  s17_surge: SurgeScene,
};
