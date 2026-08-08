import React from "react";
import {
  Rock,
  VOLCANO_BODY,
  VOLCANO_SHAPE as VOLCANO,
  mixHex,
} from "../../../lib/kid";
import {
  ACT_COLOR,
  AbsoluteFill,
  AirBlob,
  BigWordBeat,
  Bubbles,
  Camera,
  GREEN_SIT_DROP,
  GREEN_SIT_FRAMES,
  HEIGHT,
  INDIGO_LAG,
  PHASE,
  PaintedSky,
  RAY_LIGHT,
  RAY_SPECTRUM,
  RED_SPEED,
  Ray,
  SHARD_BODY,
  SPECTRUM,
  Shard,
  SleepingVolcano,
  SoftShade,
  Sunny,
  WIDTH,
  WideLayer,
  blueRicochet,
  blueTrail,
  greenSit,
  heldBeat,
  hover,
  indigoEcho,
  interpolate,
  kidEase,
  kidTheme,
  kidType,
  lineWindow,
  markCentre,
  moveAlong,
  orangeFollow,
  plateY,
  redWalk,
  settleWave,
  spring,
  stand,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Box,
  type Cam,
  type Cast,
  type Mark,
  type ShardName,
  type TimedScene,
} from "./common";
import { StartLineScene } from "./s27b_start_line";
import { TwoWalkersScene } from "./s28b2_two_walkers";
import {
  BLUE_CRAYON,
  CRAYONS,
  CRAYON_BOX,
  CrayonDrawing,
  ORANGE_CRAYON,
  PAGE,
  SKY_BAND,
  crayonAt,
} from "./coldOpen";

// ACT THREE — THE LONG WAY. Scenes 25–31 of script.md.
//
//   s25  the sea, late, blue draining out of the top of frame. Ray hangs low
//        with the light coming in almost horizontally and throwing a long
//        shadow off a rock (`Rock` is the kit's). Plate: sea_sunset.
//   s26  CUT (2026-08-01) and, as of this wave, gone from the file. See A7 in
//        the wave-2 worklist: the scene, its component and its one line key
//        were the last dangling reference in the tree.
//   s27  the cross-section: a short slice of air at midday against a very long
//        one at sunset. The only new physics in the act, and it is geometry —
//        with **Blue on the midday beam and Red on the sunset beam**, so the
//        two lengths are two characters rather than two drawn lines.
//   s28  THE SUNSET RACE, leg one: high air. Seven set off together, Blue
//        ricochets out and goes UP, Indigo follows four frames late, Violet
//        last, highest and furthest, in silence. Payoff of Scene 18.
//   s28b THE SUNSET RACE, leg two: out over the sea. Green settles on a
//        becalmed sailboat, Yellow lands on the sleeping volcano, and the
//        volcano opens ONE EYE for forty-five frames.
//   s28c THE SUNSET RACE, the finish line: the eye the beam lands in, and then
//        a wide empty orange sky with Red still walking across it.
//   s29  BIG WORD THREE — SUNSET, lit from below. `ACT_COLOR.sunset`,
//        syllables ["Sun", "Set"]. Sunny leans on the bottom of the card.
//   s30  the crayon goes back in the box. **Scene 1's exact framing**, so it
//        reuses `PAGE` and `CRAYONS` from coldOpen.tsx rather than re-picking
//        marks — the frame story closes by the audience recognising a picture.
//        Plate: hill_day's grass, under a warm dusk wash.
//   s31  the world turns. Pull back off the coast, off the country, until the
//        planet is in frame with the terminator sliding across it, and then 75
//        frames of silence — the longest in the episode and the end of the
//        story. Plate: space_stars.
//
// ---------------------------------------------------------------------------
// THE RULE THAT GOVERNS EVERY EXIT IN THE RACE, and it is not negotiable
// (script.md, Scene 28; revision addendum "THE SUNSET RACE"):
//
//   *Nobody loses and nothing is taken away.* Every colour that leaves is
//   **bounced out sideways and upward**, into the blue above, and visibly
//   becomes part of the sky. Never falling, never fading to nothing in the
//   beam, never dropping behind, never simply not being drawn on the next
//   frame. The sunset's red is not what survived a cull, it is what was left
//   going straight, and `a3_14c_narrator` says so out loud.
//
// **How many leave in Scene 28, and the spec conflict behind it.** Three:
// Blue, Indigo, Violet. revision §6.13 (which the race addendum supersedes in
// its own banner) says Green and Yellow leave inside the 45f drain beat, and
// the wave-2 worklist carries that sentence forward — but §6.13 predates the
// race, and the newer layers all disagree with it: `a3_14e_narrator` counts
// **"and then there were four"** at the top of Scene 28b, Green and Yellow
// both have *lines* in 28b, and script.md's Scene 28 visual lists exactly
// "Blue … Indigo … Violet". The arithmetic is decisive, so the count wins:
// seven set off, three leave here, four go out over the sea.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// THE VOLCANO RULE (script.md, Production notes) — read this before staging
// anything on a coastal horizon.
//
//   - It sits on the **measured** horizon, exactly as it did in episode two:
//     sample the plate or read the drawn horizon, never guess, or it floats.
//     `SEA_SUNSET_FRAC` / `SEA_DUSK_FRAC` below are those measurements and
//     `plateY` turns them into a composition y for the scene's own pan/zoom.
//   - It must be **continuously visible for the whole shot** it appears in. A
//     background gag that vanishes mid-scene reads as a bug — that is why
//     episode two cut it from its own Scene 26. It appears in Scenes **25,
//     28b, 28c, 29, 31 and 35 and in no other frame of the episode**, and in
//     each of those it is on screen from the shot's first frame to its last.
//     (script.md's rewritten rule names 28b and 28c; the wave-2 worklist's
//     shorter list is revision §6.11's, written before the race split Scene 28b
//     into two scenes, and 28c's own Visual asks for it in as many words.
//     Scene 28c is two shots either side of one dissolve — the corridor and
//     then the wide sea — and the island is continuous through the whole of
//     the shot it is in.)
//   - It gets **no line in this episode at all**. `a3_14i_narrator` ("That is
//     not a rest stop.") is addressed to *Yellow*, does not name it and does
//     not concede it is anything but a warm rock, and it is the only line
//     anybody says anywhere near it. Nothing looks at it, points at it, or
//     explains it. No bubble, no arrow, no music sting.
//   - **The escalation is exactly one eyelid.** It opens ONE eye inside Scene
//     28b's 45-frame held beat, holds, closes it, and the show declines to
//     comment (`eye` below). ep 2 asleep and unmentioned -> ep 3 one eye ->
//     ep 5 awake (the volcano episode; ep 4 is plants — Mike 2026-08-04).
//     There is **no rumble here**: the rumble belongs to Scene 35
//     and firing it twice spends it.
//
// `sea_sunset` and `sea_dusk` were both prompted for one straight unambiguous
// waterline so that it can be measured; `sea_sunset` cost three rolls to get a
// horizon with nothing sitting on it (see backgrounds.mjs).
// ---------------------------------------------------------------------------

/** The act's held-beat scenes cut the emotion lead to zero (script.md). */
const NO_LEAD = 0;

const W = WIDTH;
const H = HEIGHT;

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------------------
// The measured horizons
// ---------------------------------------------------------------------------
//
// Sharpest row-to-row transition down each plate, as a fraction of its height
// (backgrounds.mjs). Never eyeballed: two real transforms sit between the plate
// and the frame — `objectFit: cover` on a 1.75 plate inside a 1.778 frame, then
// `KidPaintedBackdrop`'s overscan — and `plateY` models both.

const SEA_SUNSET_FRAC = 0.5391;
const SEA_DUSK_FRAC = 0.513;
const MOON_FRAC = 0.4961;

/** Every sea shot in the act breathes at the same rate, so it is one place. */
const SEA_DRIFT = 10;

// ---------------------------------------------------------------------------
// The sleeping volcano
// ---------------------------------------------------------------------------
//
// **PROMOTED, 2026-08-08.** It was episode two's component written out a second
// time here (with a rim light, a stir and an eyelid added); episode four is the
// third to need it, so the component, its geometry, its palette, its snore
// period and `wobbleRing` all moved to `src/lib/kid/props.tsx`
// (`makeSleepingVolcano`). The two copies had drifted in exactly one place —
// how the smoke ring is coloured — and that is now the factory's one parameter:
// this episode binds `SNORE_RING_WARM` in `scenes/common.tsx`, because every
// horizon in this act plays against orange or indigo and episode two's ring
// colour is invisible on them.
//
// It is re-exported below rather than imported at each use, because
// `recap.tsx` and `s28b2_two_walkers.tsx` import it *from this file* and a
// promotion that rewrites three files' imports is a promotion that will not be
// verified.
export { SleepingVolcano };


/**
 * Where it is: the same island in the same place on the same horizon, in every
 * shot of the series that can see it. Frame left, over open water, and small.
 */
export const VOLCANO_AT = { x: 300, scale: 1.15 } as const;

// ---------------------------------------------------------------------------
// Scene 25 — Down at the sea, going orange
// ---------------------------------------------------------------------------

const S25_RAY = { x: 940, y: 748, scale: 1.05 };
/** Rock front-right, so the sideways light throws its shadow across frame. */
const S25_ROCK = { x: 1548, ground: 942, scale: 0.62 };

/**
 * **Green is already on the rock when the scene opens** (revision2), and the
 * show never explains how — the same convention that puts Red on Sunny's
 * diagram in Scene 23. He is the chain's second firing of "This is a nice
 * spot." and the joke is entirely that he got here first.
 *
 * The seat is measured off `Rock`, not eyeballed. The prop is a 620×340 box
 * drawn about its own bottom edge (`transformOrigin: 50% 100%`) at
 * `S25_ROCK.ground`, and its crest sits at local y ≈ −92 in that box, i.e.
 * `ground − (170 + 92) · scale` = 942 − 162 ≈ **780**, spanning roughly
 * x 1427..1699. He sits left of the crown so the rock still reads as a rock and
 * not as a plinth.
 */
const S25_GREEN = { x: 1508, seat: 782, scale: 0.46 };

/**
 * Where Blue hits, and the cupboard he ricochets in afterwards.
 *
 * He comes in over the water from up and left and **hits the rock's left
 * flank**, which is the one thing in frame he can apologise to. The box is
 * between Ray and the rock, clear of Green's seat: two of the seven sharing one
 * square of a still is a bug, and Green's whole beat is that he was there
 * first and is not moving.
 */
const S25_BLUE_HIT = { x: 1406, y: 798 };
const S25_BLUE_BOX: Box = { x: 1046, y: 552, w: 292, h: 192 };

const S25_BUBBLES: Record<string, string> = {
  a3_03b_green: "This is a nice spot.",
  a3_03c_ray: "How long have you been here?",
  a3_03d_green: "It is a good rock.",
  a3_04_ray: "Why is it going orange?",
  a3_05b_blue: "First! Sorry, rock!",
  a3_05c_ray: "First at what?",
};

/**
 * Scene 25 — the act's question, asked on a horizon that has already answered
 * it, and the one shot in the episode that has to *drain*.
 *
 * `sea_sunset` is warm from the top edge to the bottom edge, which is the right
 * plate for the end of the scene and the wrong one for the start: the script
 * opens on "the blue draining out of the top of the frame". So the blue is a
 * wash **over** the plate that retreats upward and thins out across the first
 * two lines, and the warm band along the waterline comes up as it goes. Nothing
 * about the plate changes; what changes is how much day is left on top of it.
 */
const SeaSunsetScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [, drainFrom] = lineWindow(scene, "a3_01_narrator");
  const [, drainTo] = lineWindow(scene, "a3_02_narrator");
  const [greenFrom] = lineWindow(scene, "a3_03b_green");
  const [, greenTo] = lineWindow(scene, "a3_03d_green");
  const [blueFrom] = lineWindow(scene, "a3_05b_blue");
  const [, lastTo] = lineWindow(scene, "a3_05c_ray");

  const horizon = plateY(SEA_SUNSET_FRAC, { drift: SEA_DRIFT });

  // The day going. Eased, and slow enough that no single second of it is an
  // event — the Narrator's word is "slowly".
  const drain = interpolate(frame, [drainFrom - 40, drainTo + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  const stage = useStage(scene);
  const emotion = useEmotion(scene, "ray", { a3_04_ray: "amazed" }, "happy");

  // --- THE COLLECTION, and it is the tightest beat in the act ---------------
  //
  // "Ray collects Green wordlessly on the way out — Green is back in the beam
  // for s27b and no one mentions it" (revision2, staging note, no line). The
  // scripted 12f hold after `a3_05c_ray` is *deadpan*, so nothing moves inside
  // it; what is left is the 14-frame tail, which is all the room there is. So
  // the collection is played by GREEN rather than by Ray: Ray only turns his
  // head, and Green unsticks himself from the rock and drifts up after him —
  // a reflex, at `GREEN_SIT_FRAMES` speed, which is the one gesture this
  // character owns that is fast enough to land in half a second.
  //
  // **Flagged to the showrunner as cramped**: at ~45 frames it would read as
  // "collected"; at 14 it reads as "Green got up". The fix is a longer trailing
  // gap on `a3_05c_ray`, which is a script number and not the builder's.
  const collectFrom = lastTo + 12;
  const collect = clamp01((frame - collectFrom) / GREEN_SIT_FRAMES);

  // He drifts a little further out over the water across the shot; a hero
  // parked on one x for twenty seconds is a sticker.
  const rayX = S25_RAY.x + Math.sin(frame / 90) * 26 - (frame / scene.durationInFrames) * 40;
  const rayMark: Mark = {
    x: rayX,
    y: hover("ray", S25_RAY.y, S25_RAY.scale),
    scale: S25_RAY.scale,
    who: "ray",
    side: "right",
  };

  // --- GREEN, on the rock, and then off it ---------------------------------
  const greenP = {
    // Up and only a little across: Blue is ricocheting in a cupboard between
    // Ray and the rock, and a lift that carried Green sideways put the two of
    // them in the same square of a still.
    x: S25_GREEN.x - collect * 56,
    // Off the rock and up into the beam's height, in one small lift.
    y: stand("shard", S25_GREEN.seat) - collect * 130,
  };
  const greenMark: Mark = {
    x: greenP.x,
    y: greenP.y,
    scale: S25_GREEN.scale,
    who: "shard",
    side: "left",
  };
  // Sat before the episode got here, and up only on the way out. `greenSit`
  // wants a frame the world changed at; his sit has no beginning inside this
  // scene, so it is 1 until the collection and then it is a reflex.
  const greenSat = 1 - collect;

  // --- BLUE, arriving the way Blue arrives ---------------------------------
  //
  // His 4-frame gap is spent in the air: he crosses the frame, hits the rock on
  // the frame before his line opens, apologises to it, and then cannot hold
  // still. The ricochet clock starts at the impact, so `blueRicochet(0)` — the
  // centre of the box — is where the bounce throws him.
  const hitAt = blueFrom - 2;
  const blueIn = clamp01((frame - (hitAt - 18)) / 18);
  const blueBox = blueRicochet(Math.max(0, frame - hitAt), S25_BLUE_BOX);
  const blueFly = moveAlong({ x: 470, y: 214 }, S25_BLUE_HIT, blueIn, {
    arc: 0.16,
    ease: kidEase.easeInQuad,
  });
  const blueP = frame < hitAt ? blueFly : blueBox;
  const blueMark: Mark = {
    x: blueP.x,
    y: hover("shard", blueP.y, 0.4),
    scale: 0.4,
    who: "shard",
    side: "left",
  };

  // His eyes are the scene's other pointer: down at Green for the exchange, at
  // the thing that just hit the rock, and out at the water otherwise. Aimed at
  // FACES (`markCentre`), not at box centres — Ray's box centre is the gap
  // between his face and his ribbon.
  const rayLook = ((): { x: number; y: number } => {
    if (frame >= collectFrom) return faceAim(rayMark, greenMark);
    if (frame >= hitAt) return faceAim(rayMark, blueMark);
    if (frame >= greenFrom - 6 && frame < greenTo + 10) return faceAim(rayMark, greenMark);
    return frame > drainTo ? { x: 0.15, y: -0.5 } : { x: 0.7, y: -0.15 };
  })();

  return (
    <AbsoluteFill>
      <PaintedSky bg="sea_sunset" phase={1.1} drift={SEA_DRIFT} />

      {/* The blue, leaving. Top of frame down, retreating upward and thinning
          — and gone before the Narrator gets to "sideways". */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, rgba(42,159,224,${0.82 * (1 - drain)}) 0%, rgba(126,208,245,${0.6 * (1 - drain)}) ${28 - drain * 20}%, rgba(205,239,255,${0.24 * (1 - drain)}) ${46 - drain * 34}%, rgba(205,239,255,0) ${62 - drain * 44}%)`,
          pointerEvents: "none",
        }}
      />
      {/* …and the warm coming in along the waterline as it goes. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: horizon - 150,
          height: 300,
          background: `linear-gradient(to bottom, rgba(255,201,60,0) 0%, rgba(255,167,64,${0.26 * drain}) 46%, rgba(255,138,90,${0.34 * drain}) 52%, rgba(255,167,64,0) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* THE VOLCANO. On the measured horizon, in frame from the first frame of
          the scene to the last, and never mentioned. */}
      <SleepingVolcano
        x={VOLCANO_AT.x}
        base={horizon}
        scale={VOLCANO_AT.scale}
        phase={0.15}
      />

      {/* The light, coming in almost horizontally: long flat bars off the
          right-hand edge, low and warm, lying on the water rather than over it. */}
      <SideLight horizon={horizon} strength={0.35 + 0.35 * drain} />

      {/* The rock, and the long shadow the sideways light throws off it. The
          shadow is the scene's one piece of evidence: a sun this low makes
          shadows that do not fit in the frame. */}
      <LongShadow
        x={S25_ROCK.x}
        y={S25_ROCK.ground}
        reach={1180 + drain * 220}
        strength={0.34 + 0.2 * drain}
      />
      <Rock x={S25_ROCK.x} y={S25_ROCK.ground - 170} scale={S25_ROCK.scale} speaking={false} />

      {/* GREEN, who was already here. Sat, on the rock, from the first frame of
          the scene — the audience meets him mid-decision, which is the whole
          gag, and Ray's question is the only acknowledgement it ever gets. */}
      <Shard
        who="green"
        x={greenMark.x}
        y={greenMark.y}
        scale={S25_GREEN.scale}
        sit={greenSat}
        look={collect > 0 ? { x: -0.55, y: -0.25 } : { x: -0.4, y: 0.05 }}
        speaking={stage.speaking("green")}
        zIndex={22}
      />

      {/* He is warm-white over warm water, which is the Ray legibility problem
          in its mildest form. Shade behind him rather than a brighter Ray. */}
      <SoftShade x={rayX} y={S25_RAY.y - 30} rx={520} ry={380} strength={0.24} color="60,32,64" />
      <Ray
        x={rayX}
        y={rayMark.y}
        scale={S25_RAY.scale}
        brightness={RAY_LIGHT.full}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={emotion}
        speaking={stage.speaking("ray")}
        look={rayLook}
        streak={0.3}
        bank={-3}
        zIndex={20}
      />

      {/* BLUE. Off the top-left of frame, into the rock, and then a pinball in
          a cupboard between Ray and it — "First!" is planted at the sunset
          location, twenty seconds before there is anything to be first at. */}
      {frame >= hitAt - 18 ? (
        <Shard
          who="blue"
          x={blueMark.x}
          y={blueMark.y}
          scale={0.4}
          heading={frame < hitAt ? blueFly.angle : blueBox.angle}
          look={{ x: -0.4, y: 0 }}
          speaking={stage.speaking("blue")}
          zIndex={26}
        />
      ) : null}
      {/* The mark he leaves on the thing he apologises to. */}
      <PingRing at={hitAt} frame={frame} fps={fps} p={S25_BLUE_HIT} size={0.6} />
      {/* The water under him takes the light back. */}
      <WideLayer zIndex={12}>
        <ellipse
          cx={rayX}
          cy={S25_RAY.y + 190}
          rx={210}
          ry={22}
          fill={kidTheme.sunLight}
          opacity={0.3}
        />
      </WideLayer>

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark, green: greenMark, blue: blueMark } as Cast}
        text={S25_BUBBLES}
        at={{
          // Green is against the right-hand edge on a rock, so both of his go
          // out over the water on his left, tail reaching back at him.
          a3_03b_green: { x: 1150, y: 452, tail: "right", tailAt: S25_GREEN.x },
          a3_03d_green: { x: 1150, y: 452, tail: "right", tailAt: S25_GREEN.x },
          // Ray's two questions share one place — the clear band of sky above
          // the water between him and the rock.
          a3_03c_ray: { x: 700, y: 300, tail: "left", tailAt: rayX },
          a3_05c_ray: { x: 700, y: 300, tail: "left", tailAt: rayX },
          // Blue is mid-ricochet through his own line, so the bubble parks and
          // the tail follows him. Left of the rock, clear of Green's.
          a3_05b_blue: { x: 1000, y: 226, tail: "right", tailAt: blueP.x },
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * **A pupil offset from one staged body's FACE to another's** — the only
 * sanctioned way to aim a look in this episode (K4).
 *
 * `markCentre` routes through each body's own `faceOffset`, so an aim at Ray
 * lands on Ray's eyes rather than on the gap between his face and his ribbon,
 * and an aim at a shard lands 77 units up from its box centre. Aiming at raw
 * marks is the bug this replaces.
 */
function faceAim(from: Mark, to: Mark): { x: number; y: number } {
  return aim(markCentre(from), markCentre(to));
}

/**
 * Long flat bars of light lying *along* the water, coming in from the right.
 *
 * Every bar runs off both edges of the frame and fades out along its own
 * length. The first pass drew them as plain rectangles a little wider than they
 * needed to be, and a still caught what a description never would: a hard
 * vertical end on a bar of light is a UI stripe, not a reflection. Nothing that
 * is made of light in this show is allowed to have a corner on it.
 */
const SideLight: React.FC<{ horizon: number; strength: number }> = ({
  horizon,
  strength,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer zIndex={8}>
      <defs>
        <linearGradient id="a3-sidelight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={kidTheme.sunLight} stopOpacity={0} />
          <stop offset="0.42" stopColor={kidTheme.sunLight} stopOpacity={0.55} />
          <stop offset="1" stopColor={kidTheme.sunLight} stopOpacity={1} />
        </linearGradient>
      </defs>
      {Array.from({ length: 7 }, (_, i) => {
        const y = horizon + 26 + i * i * 13 + Math.sin(t * 0.4 + i) * 3;
        return (
          <rect
            key={i}
            x={-500 + Math.sin(t * 0.3 + i * 1.7) * 26 + i * 90}
            y={y}
            width={W + 700}
            height={7 + i * 2.4}
            rx={6}
            fill="url(#a3-sidelight)"
            opacity={strength * (0.5 - i * 0.05)}
          />
        );
      })}
    </WideLayer>
  );
};

/**
 * The shadow a very low sun throws: a long tapering wedge running away from the
 * light, not an ellipse under the object. `reach` is how far it goes, which is
 * the whole point — it goes further than the frame is wide, and that is the
 * scene's one piece of evidence that the sun is on the floor.
 *
 * Blurred and gradient-faded, both for the same reason as `SideLight` above: a
 * flat-filled quad at this size reads as a grey bar lying on the sea. A still
 * of the first pass is the only thing that said so.
 */
const LongShadow: React.FC<{
  x: number;
  y: number;
  reach: number;
  strength: number;
}> = ({ x, y, reach, strength }) => (
  <WideLayer zIndex={10}>
    <defs>
      <linearGradient id="a3-longshadow" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor="#2f2a5c" stopOpacity={1} />
        <stop offset="0.4" stopColor="#2f2a5c" stopOpacity={0.55} />
        <stop offset="1" stopColor="#2f2a5c" stopOpacity={0} />
      </linearGradient>
      <filter id="a3-shadowblur" x="-20%" y="-300%" width="140%" height="700%">
        <feGaussianBlur stdDeviation="13" />
      </filter>
    </defs>
    <path
      d={
        `M ${x + 130} ${y + 30} Q ${x - reach * 0.45} ${y + 4} ${x - reach} ${y - 12}` +
        ` Q ${x - reach * 0.45} ${y + 34} ${x + 130} ${y + 76} Z`
      }
      fill="url(#a3-longshadow)"
      opacity={strength}
      filter="url(#a3-shadowblur)"
    />
  </WideLayer>
);

// ---------------------------------------------------------------------------
// Scene 26 — deleted (A7)
// ---------------------------------------------------------------------------
//
// The scene was cut on 2026-08-01 and its component outlived it by a wave:
// `VolcanoScene` sat in `ACT3_SCENES` under a `s26_volcano` key no timeline
// entry ever asked for, holding the tree's only reference to the deleted line
// key `a3_06_narrator`. Both are gone. What replaced the scene is one eyelid
// inside Scene 28b — see THE VOLCANO RULE above.

// ---------------------------------------------------------------------------
// The race — shared motion
// ---------------------------------------------------------------------------

/**
 * **A cruise: a short ramp up to speed, then a constant one.**
 *
 * `kidEase` has no ease-in-only curve that is also flat afterwards, and the
 * race needs exactly that. `easeInOutSine` across a thirty-five-second track
 * nearly stops in the middle, and a beam of light that slows down in the
 * middle of two hundred miles of air is the one thing this act cannot draw.
 *
 * It is the *velocity* that is eased, not the position: linear ramp on speed
 * over the first `ramp` of the trip, constant after, normalised so `cruise(1)`
 * is still 1. So the pack sets off (nothing starts at full speed, STYLE.md)
 * and then holds one speed for the rest of the leg, with no corner in the
 * position curve where the two meet.
 */
function cruise(u: number, ramp = 0.08): number {
  const c = clamp01(u);
  const raw = c <= ramp ? (c * c) / (2 * ramp) : c - ramp / 2;
  return raw / (1 - ramp / 2);
}

/**
 * **A colour leaving the race**, as a fraction of its exit arc: 0 the frame it
 * bounces, 1 the frame it has finished becoming sky.
 *
 * `reach` is how far up and out that colour gets — the ensemble sheet as
 * geometry. Blue gets 1 and is gone; Indigo, who is Blue faded, gets less and
 * parks in the blue band; Violet goes furthest, which is the running gag drawn
 * as a distance.
 */
type Exit = {
  out: number;
  frames: number;
  runTo: { x: number; y: number };
  /**
   * How much the arc bows. **`moveAlong`'s bow is a fraction of the whole
   * chord**, so the number that reads as a bounce on Blue's 1100px hop off the
   * beam throws Violet's 2400px climb two hundred pixels off the top of the
   * frame — which is where a first pass put both of the two colours who still
   * have to be on screen for the goodbye. Short exits bow; long ones barely.
   */
  arc: number;
};

/**
 * A leaver's world position: the arc off the beam, `easeOutQuad` so it leaves
 * hard and arrives soft, bowed by `moveAlong` so it is a bounce rather than a
 * ramp. Past `frames` it stays exactly where it finished — light that has gone
 * somewhere else does not come back, and it does not evaporate either.
 */
function exitAt(frame: number, from: { x: number; y: number }, e: Exit): {
  x: number;
  y: number;
  angle: number;
  u: number;
} {
  const u = clamp01((frame - e.out) / e.frames);
  const p = moveAlong(from, e.runTo, u, { arc: e.arc, ease: kidEase.easeOutQuad });
  return { x: p.x, y: p.y, angle: p.angle, u };
}

/** A pupil offset from one staged point towards another. Negative y is up. */
function aim(from: { x: number; y: number }, to: { x: number; y: number }): {
  x: number;
  y: number;
} {
  const d = Math.max(1, Math.hypot(to.x - from.x, to.y - from.y));
  return {
    x: Math.max(-1, Math.min(1, ((to.x - from.x) / d) * 1.25)),
    y: Math.max(-1, Math.min(1, ((to.y - from.y) / d) * 1.25)),
  };
}

/**
 * **A leaver turning back to wave, and it is a whole-body wag rather than an
 * arm.** Returns a position offset and a size pulse, in composition px at
 * scale 1.
 *
 * Two reasons it is not `arms`. At the scale these three are staged at, a
 * shard's arm is about nine pixels of amber and reads as nothing; and
 * **raising an arm belongs to Yellow** — `SEVEN` gives him "waves at everyone,
 * continuously, including at things that are leaving" as his entire
 * characterisation, and the moment a second colour does it he has none. A body
 * rocking side to side at two and a half hertz is unmistakably a wave and is
 * nobody else's signature.
 */
function waveBack(age: number, span: number): { dx: number; dy: number; grow: number } {
  const a = 1 - kidEase.easeInOutSine(clamp01(age / span));
  return {
    dx: Math.sin(age * 0.52) * 26 * a,
    dy: -Math.abs(Math.sin(age * 0.52)) * 8 * a,
    grow: 1 + 0.14 * a,
  };
}

// ---------------------------------------------------------------------------
// Scene 27 — The long way through
// ---------------------------------------------------------------------------
//
// The act's only new physics, and it is *geometry* — which is why it gets a
// diagram rather than a place, and why the diagram is built out of two lengths
// a six-year-old could measure with a piece of string.
//
// The numbers below are one circle and one shell thickness, and everything else
// is derived from them, because the whole claim is that the two paths are the
// same picture at two angles. Earth centre is far below frame with a very large
// radius, so the surface is a gentle curve across the bottom of the frame and
// the shell above it is near-constant thickness — a *thin shell*, as scripted,
// rather than the fat halo a small circle would need to be legible.

// Tuned against a still. The first pass put the observer at x=1600 (the whole
// diagram jammed into the right third, the long path running off the left edge
// with its measuring bar out of frame) and gave the shell 260px, which is not
// "thin" and which shortened the grazing chord to something you could not call
// long. 150px of air and an observer at 1260 puts the entry point at x≈154 —
// just inside the frame — and makes the two trips 150px and 1106px, a ratio of
// seven to one that a six-year-old can see without being told it.
const EARTH = { cx: 1260, cy: 4600, r: 4000, air: 150 };

/** Surface y under a composition x. */
function groundY(x: number): number {
  const dx = x - EARTH.cx;
  return EARTH.cy - Math.sqrt(Math.max(0, EARTH.r * EARTH.r - dx * dx));
}
/** Top-of-the-air y over a composition x. */
function airTopY(x: number): number {
  const dx = x - EARTH.cx;
  const ro = EARTH.r + EARTH.air;
  return EARTH.cy - Math.sqrt(Math.max(0, ro * ro - dx * dx));
}

/** Where the observer stands: the top of the arc, and both trips end here. */
const OBSERVER = { x: EARTH.cx, y: groundY(EARTH.cx) };
/**
 * The sunset trip is the ray that grazes the ground at the observer, so its
 * chord through the shell is the longest one there is — 1465px of it, most of
 * the width of the frame, which is the fact the scene is selling.
 */
const GRAZE_X = EARTH.cx - Math.sqrt((EARTH.r + EARTH.air) ** 2 - EARTH.r ** 2);
/** The midday trip: straight down onto the same spot. */
const NOON_TOP = airTopY(EARTH.cx);

const S27_BUBBLES: Record<string, string> = {
  a3_10_ray: "How long is that trip?",
  // Blue, who arrived ages ago, over a finish line with nobody on it.
  a3_08b_blue: "Done! First place!",
  a3_08d_blue: "Still counts!",
  // Green, appraising two hundred miles of course for the only thing he has
  // ever wanted out of any of it.
  a3_11b_green: "Lots of nice spots.",
};

/**
 * **Green, appraising the course** (revision2's optional trim-menu line, staged
 * as if it stays — a scene that only works when a line is present is a scene
 * that breaks when the trim lands, so he is on stage from the first frame and
 * the line is the only thing that would go).
 *
 * He stands to the right of the observer, clear of both trips, and looks back
 * down the long one. He is the third character on the diagram and the last one
 * it will take: Blue is bouncing in the shell, Red is walking the chord, and
 * a fourth body would put the geometry behind a crowd.
 */
const S27_GREEN = { x: 1568, ground: 606, scale: 0.4 };

/**
 * **The two beams are not abstractions** (revision §6.12, visual only).
 *
 * The midday beam has Blue on it and the sunset beam has Red on it, walking
 * their own path lengths at their own speeds for the whole scene. It costs
 * nothing — the beams are drawn anyway — and it turns the act's one geometry
 * fact into something a six-year-old can *feel*: one of them arrived ages ago
 * and is bouncing around with nothing to do, and the other one is still going.
 *
 * **RAY COMES OFF THE BEAMS TO PAY FOR IT, and that is the delta's real cost.**
 * The delivered cut had him ride the short trip down, fade, and restart the
 * long one — he was the demonstrator of both. He cannot be that *and* share a
 * 150px-thick air shell with two colours who are now doing exactly that job:
 * a still of the first pass had Ray, Red and a ricocheting Blue stacked in one
 * 130px-wide heap at the end of the long path, with the observer's head behind
 * them. So he watches from beside the diagram instead, at the mark below,
 * looking at whichever trip is live. The scene still says "Ray comes in
 * sideways" over a picture of a colour coming in sideways; what it no longer
 * does is claim that a diagram of two beams needs three characters on it.
 *
 * The box Blue ricochets in is a tight one around where he *landed* — the air
 * shell is only `EARTH.air` thick, and "arrived, with nothing to do" is a
 * pinball in a cupboard rather than a pinball on tour.
 */
const S27_BLUE_BOX: Box = { x: 1140, y: 452, w: 240, h: 146 };
/**
 * Where Red sets off: off the left of the drawn beam entirely.
 *
 * **The scene picks his start, never his speed.** `RED_SPEED` is a constant
 * because it is the joke, and at 108 px/s the 1106px chord takes 307 frames of
 * the 336 the scene has left after the line — which would land him on the
 * observer's toes four frames before the cut. Starting 520px further out he
 * walks into frame under `a3_09`, stays 300px behind the beam's own leading
 * edge, and is still going when the shot cuts and when Scene 28 opens.
 */
const S27_RED_X0 = GRAZE_X - 520;
/** Where Ray watches the diagram from. Clear of both trips and the observer. */
const S27_RAY = { x: 1600, y: 258, scale: 0.6 };

const LongWayScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [noonFrom, noonTo] = lineWindow(scene, "a3_08_narrator");
  const [lowFrom] = lineWindow(scene, "a3_09_narrator");

  // The midday trip: down, fast, over in a second, and its path stays drawn.
  const noon = clamp01((frame - noonFrom - 14) / Math.max(1, (noonTo - noonFrom) * 0.62));
  const noonDrawn = clamp01((frame - noonFrom - 12) / 18);

  // The sunset trip: begins on "So Ray comes in sideways" and is **still
  // going** when the scene cuts. script.md: "let the sunset one keep going, and
  // going, across the whole width of the frame."
  const low = clamp01(
    (frame - lowFrom - 10) / Math.max(1, (scene.durationInFrames - lowFrom - 10) * 1.09),
  );

  // RED, walking the long trip at the one speed he has. The beam's leading
  // edge gets there first and Red — the colour that stays — is still walking,
  // which is the sentence the whole of Act Three ends on.
  const red = redWalk(Math.max(0, frame - lowFrom) / fps, { x: S27_RED_X0, y: OBSERVER.y });

  // BLUE, on the midday trip: down the short beam in eight frames — it is a
  // hundred and fifty pixels and he is the fastest thing in the episode — and
  // then ricocheting around the shell for the remaining twelve seconds, having
  // arrived. The contrast *is* the scene.
  const blueFrom = noonFrom + 14;
  const blueAge = frame - blueFrom;
  const blueBox = blueRicochet(Math.max(0, blueAge - 8), S27_BLUE_BOX);
  const blueDrop = moveAlong(
    { x: EARTH.cx, y: NOON_TOP - 250 },
    { x: blueBox.x, y: blueBox.y },
    clamp01(blueAge / 8),
    { arc: 0.08, ease: kidEase.easeInQuad },
  );
  const blueP = blueAge < 8 ? blueDrop : blueBox;
  const blueOn = clamp01((blueAge + 2) / 6);

  const onNoon = frame < lowFrom - 6;

  // GREEN. He stands for as long as the diagram is still being drawn and sits
  // the instant the long trip finishes arriving, which is his law applied to a
  // *diagram* — the joke costs one number and no new staging.
  const greenSits = lowFrom + 10 + Math.round((scene.durationInFrames - lowFrom - 10) / 1.09);
  const greenMark: Mark = {
    x: S27_GREEN.x,
    y: stand("shard", S27_GREEN.ground),
    scale: S27_GREEN.scale,
    who: "shard",
    side: "left",
  };

  const stage = useStage(scene);
  const emotion = useEmotion(scene, "ray", { a3_10_ray: "amazed" }, "happy");

  const rayMark: Mark = {
    x: S27_RAY.x,
    y: hover("ray", S27_RAY.y, S27_RAY.scale),
    scale: S27_RAY.scale,
    who: "ray",
    side: "left",
  };
  // His eyes are the scene's pointer: down at the short trip while it is being
  // drawn, then off left along the long one, which is the only "arrow" a scene
  // with no captions is allowed.
  const rayLook = onNoon
    ? aim({ x: S27_RAY.x, y: S27_RAY.y }, { x: EARTH.cx, y: (NOON_TOP + OBSERVER.y) / 2 })
    : aim({ x: S27_RAY.x, y: S27_RAY.y }, { x: red.x, y: red.y });

  return (
    <AbsoluteFill style={{ background: "#fdefe0" }}>
      {/* The world, drained to a wash: the same sea the act is standing in,
          drawn simply rather than cut to a whiteboard. */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.26, filter: "saturate(0.55)" }}>
        <PaintedSky bg="sea_sunset" phase={3.9} drift={0} />
      </div>

      <CrossSection noon={noonDrawn} low={low} />

      {/* BLUE, arrived, with nothing to do. His trail is two legs long so a
          paused frame always has a corner in it — the change of direction is
          the whole of him, and it is what makes him legible next to a red who
          never changes direction at all. */}
      {blueAge > -1 ? (
        <Shard
          who="blue"
          x={blueP.x}
          y={hover("shard", blueP.y, 0.34)}
          scale={0.34}
          heading={blueAge < 8 ? blueDrop.angle : blueBox.angle}
          trail={blueAge > 14 ? blueTrail(blueAge - 8, S27_BLUE_BOX) : undefined}
          opacity={blueOn}
          look={{ x: 0.2, y: 0 }}
          speaking={stage.speaking("blue")}
          zIndex={22}
        />
      ) : null}

      {/* GREEN, off to the side of the diagram, reading the course. */}
      <Shard
        who="green"
        x={greenMark.x}
        y={greenMark.y}
        scale={S27_GREEN.scale}
        sit={greenSit(frame, greenSits, frame >= greenSits)}
        look={{ x: -0.75, y: 0.1 }}
        speaking={stage.speaking("green")}
        zIndex={20}
      />

      {/* RED, still walking. Dead level, one speed, no lean — `Shard` refuses
          to bank him however enthusiastic the heading it is handed, which is
          the table doing its job. */}
      {frame >= lowFrom ? (
        <Shard
          who="red"
          x={red.x}
          y={hover("shard", red.y, 0.4)}
          scale={0.4}
          heading={red.angle}
          look={{ x: 0.5, y: 0 }}
          zIndex={24}
        />
      ) : null}

      <Ray
        x={rayMark.x}
        y={rayMark.y}
        scale={S27_RAY.scale}
        brightness={RAY_LIGHT.full}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={emotion}
        speaking={stage.speaking("ray")}
        look={rayLook}
        bank={-2}
        streak={0.25}
        edge={kidTheme.ink}
        zIndex={30}
      />

      <Bubbles
        scene={scene}
        cast={
          {
            ray: rayMark,
            green: greenMark,
            blue: { x: blueP.x, y: hover("shard", blueP.y, 0.34), scale: 0.34, who: "shard" },
          } as Cast
        }
        text={S27_BUBBLES}
        at={{
          a3_10_ray: { x: 1060, y: 214, tail: "right", tailAt: S27_RAY.x },
          // Blue is in a 240px cupboard in the middle of the shell, so his two
          // go up and left into the empty half of the frame, tail following
          // him. Both are clear of Ray's, which lands between them.
          a3_08b_blue: { x: 700, y: 208, tail: "right", tailAt: blueP.x },
          a3_08d_blue: { x: 700, y: 208, tail: "right", tailAt: blueP.x },
          // Green is bottom-right under Ray; his bubble goes left along the
          // course he is appraising, well under Ray's own.
          a3_11b_green: { x: 1150, y: 424, tail: "right", tailAt: S27_GREEN.x },
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * The cross-section: Earth, a thin shell of air, and the two trips through it.
 *
 * Both paths are drawn as **measured lines** — a rule of ticks under each one,
 * countable air puffs strung along each one, and an end-stopped bar. There is
 * no text anywhere in it (the kids' series has no captions, and the Narrator is
 * saying the numbers); what a six-year-old can do with this picture is *count*,
 * which is the same trick Scene 9 uses on the seven.
 */
const CrossSection: React.FC<{ noon: number; low: number }> = ({ noon, low }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const groundPath =
    `M ${-1600} ${groundY(-1600)} ` +
    Array.from({ length: 40 }, (_, i) => {
      const x = -1600 + ((W + 3200) / 39) * i;
      return `L ${x.toFixed(0)} ${groundY(x).toFixed(1)}`;
    }).join(" ") +
    ` L ${W + 1600} ${H + 900} L -1600 ${H + 900} Z`;
  const airPath =
    `M ${-1600} ${airTopY(-1600)} ` +
    Array.from({ length: 40 }, (_, i) => {
      const x = -1600 + ((W + 3200) / 39) * i;
      return `L ${x.toFixed(0)} ${airTopY(x).toFixed(1)}`;
    }).join(" ") +
    ` L ${W + 1600} ${H + 900} L -1600 ${H + 900} Z`;

  const lowX = GRAZE_X + (OBSERVER.x - GRAZE_X) * low;

  return (
    <WideLayer zIndex={12}>
      {/* The air: a thin shell, drawn as a band rather than as a glow, because
          the scene is about how far through it a thing has to go. */}
      <path d={airPath} fill={kidTheme.skyMid} opacity={0.34} />
      <path
        d={airPath.split(" L " + (W + 1600))[0]}
        fill="none"
        stroke={kidTheme.skyTop}
        strokeWidth={5}
        strokeDasharray="22 16"
        opacity={0.65}
      />
      {/* The ground. */}
      <path d={groundPath} fill="#7fc06a" stroke="#2a8134" strokeWidth={9} />

      {/* Air, as countable puffs, strung along both trips. Two on the short
          one, fourteen on the long one, and that ratio is the lesson. */}
      {Array.from({ length: 2 }, (_, i) => (
        <AirBlob
          key={`n${i}`}
          x={EARTH.cx + (i % 2 ? 48 : -50)}
          y={NOON_TOP + 42 + i * 68}
          r={26}
          t={t}
          seed={i * 3}
          opacity={0.5}
        />
      ))}
      {Array.from({ length: 14 }, (_, i) => {
        const u = (i + 0.5) / 14;
        return (
          <AirBlob
            key={`l${i}`}
            x={GRAZE_X + (OBSERVER.x - GRAZE_X) * u}
            y={OBSERVER.y - 44 - ((i * 37) % 62)}
            r={26}
            t={t}
            seed={i}
            opacity={0.5}
          />
        );
      })}

      {/* THE SHORT TRIP. Straight down, through a slice of air you can measure
          with two fingers. */}
      <g opacity={noon}>
        <path
          d={`M ${EARTH.cx} ${NOON_TOP - 300} L ${EARTH.cx} ${OBSERVER.y}`}
          stroke={kidTheme.sunLight}
          strokeWidth={26}
          strokeLinecap="round"
          opacity={0.55}
        />
        <path
          d={`M ${EARTH.cx} ${NOON_TOP} L ${EARTH.cx} ${OBSERVER.y}`}
          stroke={kidTheme.sunDeep}
          strokeWidth={11}
          strokeLinecap="round"
        />
        <MeasureBar
          from={{ x: EARTH.cx - 104, y: NOON_TOP }}
          to={{ x: EARTH.cx - 104, y: OBSERVER.y }}
          ticks={2}
          color={kidTheme.sunDeep}
        />
      </g>

      {/* THE LONG TRIP. In almost flat, and it keeps going, and going. */}
      <g>
        <path
          d={`M ${GRAZE_X - 320} ${OBSERVER.y} L ${lowX} ${OBSERVER.y}`}
          stroke={kidTheme.sunLight}
          strokeWidth={30}
          strokeLinecap="round"
          opacity={0.55}
        />
        <path
          d={`M ${GRAZE_X - 320} ${OBSERVER.y} L ${lowX} ${OBSERVER.y}`}
          stroke={kidTheme.sunDeep}
          strokeWidth={11}
          strokeLinecap="round"
        />
        <MeasureBar
          from={{ x: GRAZE_X, y: OBSERVER.y + 74 }}
          to={{ x: lowX, y: OBSERVER.y + 74 }}
          ticks={Math.max(1, Math.round(14 * low))}
          color={kidTheme.sunDeep}
        />
      </g>

      {/* The observer both trips arrive at: the same drawn child Act One's
          homework diagram used, standing **beside** the landing point rather
          than on it. A still of the first pass had them standing exactly where
          the midday beam comes down, which hid the entire short path behind a
          silhouette — i.e. hid one of the two things the scene is comparing. */}
      <g transform={`translate(${OBSERVER.x + 122} ${OBSERVER.y})`}>
        <ellipse cx={0} cy={4} rx={54} ry={12} fill="rgba(26,50,36,0.28)" />
        <path d="M 0 -46 L -18 2 M 0 -46 L 18 2" stroke={kidTheme.ink} strokeWidth={18} strokeLinecap="round" />
        <path d="M -28 -122 Q 0 -140 28 -122 L 22 -40 L -22 -40 Z" fill={kidTheme.ink} />
        <circle cx={0} cy={-160} r={32} fill={kidTheme.ink} />
        <path d="M -30 -178 q 16 -20 36 -13 q 18 6 24 18" stroke={kidTheme.ink} strokeWidth={16} strokeLinecap="round" fill="none" />
      </g>
    </WideLayer>
  );
};

/**
 * A length, drawn so it can be read as a length: a bar with hard end stops and
 * a row of ticks along it. Two of these side by side is the whole of Scene 27's
 * argument, and neither of them needs a word on it.
 */
const MeasureBar: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  ticks: number;
  color: string;
}> = ({ from, to, ticks, color }) => {
  const vertical = Math.abs(to.y - from.y) > Math.abs(to.x - from.x);
  const cap = 15;
  return (
    <g opacity={0.9}>
      <path
        d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {[from, to].map((p, i) => (
        <path
          key={i}
          d={
            vertical
              ? `M ${p.x - cap} ${p.y} L ${p.x + cap} ${p.y}`
              : `M ${p.x} ${p.y - cap} L ${p.x} ${p.y + cap}`
          }
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
        />
      ))}
      {Array.from({ length: Math.max(0, ticks - 1) }, (_, i) => {
        const u = (i + 1) / ticks;
        const x = from.x + (to.x - from.x) * u;
        const y = from.y + (to.y - from.y) * u;
        return (
          <path
            key={i}
            d={
              vertical ? `M ${x - 8} ${y} L ${x + 8} ${y}` : `M ${x} ${y - 8} L ${x} ${y + 8}`
            }
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.8}
          />
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 28 — THE SUNSET RACE, leg one: high air
// ---------------------------------------------------------------------------
//
// The payoff of Scene 18, and **the one scene in the episode where a colour
// genuinely goes missing from a beam** — so it is also the scene where the
// script's physics-honesty rule bites hardest. See the exit rule in the file
// header: nobody loses, nothing is taken away, every exit is a bounce UP.
//
// So no shard ever fades out on the beam. Each one hits an air puff, **ricochets
// off sideways and upward**, keeps flying, and the blue it takes with it turns
// into the blue wash across the top of the corridor — the rest of the sky, being
// made, out of the exact material that left. A six-year-old can follow one blob
// from the beam to the sky with their finger.
//
// **The one hand-off in the scene, and why it exists.** A leaver's arc is drawn
// in world coordinates, inside the tracking camera, so the audience watches it
// come off the beam. The camera is chasing a beam of light, though, so anything
// world-fixed is swept out of the left of frame within a couple of seconds —
// and Indigo and Violet have to still be there at `a3_14b_ray`, ninety and
// forty frames later, for the goodbye to have anybody in it. So the moment a
// leaver's arc completes it is handed to a fixed SCREEN mark up in the blue
// band, and stays there. That is not a cheat, it is the statement: they are not
// objects in the corridor any more, **they are the sky**, and the sky does not
// slide past you when you move. The hand-off is exact — the arc's world
// endpoint is computed so that its screen position on the hand-off frame *is*
// the sky mark — so there is no frame on which anybody jumps.

/**
 * The corridor, in world coordinates. The camera rides along it.
 *
 * **Everything here has to live inside `WIDE`** (-1600..3600 in x), because a
 * `WideLayer` is an `<svg>` and an `<svg>` clips to its own viewBox. The first
 * pass put the eye at x=4200 and the shot arrived, at the end of the scene's
 * whole journey, at an empty frame: red and orange hanging in the air with
 * nothing to land on, because the thing they were landing on was outside the
 * layer's box and had never been drawn. Nothing in a `WideLayer` is allowed to
 * be somewhere the box is not.
 */
const BEAM = { x0: -1150, x1: 2600, y: 596 };
/** Where the head of the pack sits on screen while the camera tracks it. */
const TRACK_X = 900;

const S28_BUBBLES: Record<string, string> = {
  // A summary, not a transcript — exactly as Scene 10's seven-name roll call
  // gets "Hi! Hi! Hi! Hi!". Three names, three goodbyes.
  a3_14b_ray: "Bye! Bye! Bye!",
  a3_14d_ray: "I will see me later.",
  a3_13b_blue: "Sorry! I am going UP!",
  a3_13c_indigo: "Going up now. Bye.",
  a3_13d_yellow: "Great bounce, Violet!",
  // --- the mid-leg banter (revision2) --------------------------------------
  a3_13a_blue: "Too slow! Sorry!",
  a3_13aa_orange: "Red is the right speed.",
  a3_13ab_indigo: "Too slow. Sorry.",
  a3_13bb_blue: "Winning UPWARDS!",
  a3_13bc_yellow: "Great winning, Blue!",
  a3_13cb_indigo: "Winning upwards.",
  a3_13cd_yellow: "Great echo, Indigo!",
};

/**
 * **The faint one, and it is a separate bubble map because it is a separate
 * SIZE.**
 *
 * `a3_13cc_blue` is "I just said that!" — the chain's third firing, `sameAs`
 * `a1_40f_blue`, delivered from somewhere above the top of the frame. The page
 * asks for it *faint*, and faint is a mix note: **the audio pipeline has no
 * per-clip gain** (`DialogueAudio` mounts each turn's `<Audio>` straight off
 * the manifest; `narration.mjs` has `speed` and `emotion` and nothing that
 * attenuates), and re-rolling the clip is forbidden — it is a byte-identical
 * alias and the sameness *is* the gag. So it plays at level and the PICTURE
 * carries "faint": a tiny bubble, top of frame, no tail, nobody under it.
 *
 * `Bubbles` takes one `fontSize` for all of its lines, so a bubble at a
 * different size is a second `<Bubbles>`. That is the whole reason this map
 * exists and it is two entries away from being a kit feature.
 */
const S28_FAR_BUBBLES: Record<string, string> = {
  a3_13cc_blue: "I just said that!",
};
/**
 * **Small enough to read as distance, big enough to read at all — and 34 was
 * not small enough** (showrunner fix, 2026-08-03).
 *
 * At 34 on a 420px box the bubble is two thirds the size of everybody else's
 * and it sat dead centre at the top of the frame, which is where a *title*
 * goes: it read as a full-size bubble that had been parked somewhere odd
 * rather than as a voice a long way off. 24 on a 250px box is unmistakably a
 * different order of thing — about the size of one of the sky's parked bodies
 * — and it is placed in Blue's own exit column rather than in the middle of
 * the sky. **Size and position are what carry "faint" here**, because the
 * audio cannot: the clip is a byte-identical alias of `a1_40f_blue` and the
 * pipeline has no per-clip gain.
 */
const FAR_BUBBLE = { fontSize: 24, maxWidth: 250 };

/**
 * **The pack, and the box each colour is allowed to be in while it is in it.**
 *
 * Pack-local coordinates: the file runs backwards from the pack's own x, red at
 * the head and violet at the tail, which is the order they leave in and the
 * order `a3_14b_ray` names them in.
 */
// 112, not the 46 the delivered cut used. A shard's *drawn* body at 0.44 is
// about 106px of frame (`SHARD_BODY` is 240 and it is wider than its own box),
// so at 46 the seven were a single seven-headed animal and the frequency ladder
// — the thing the file exists to show — was unreadable in a paused frame.
const PACK_STEP = 112;
function packSlot(i: number, spread = 1): { x: number; y: number } {
  return { x: -i * PACK_STEP * spread, y: ((i % 2) - 0.5) * 26 };
}
/**
 * **How far the file has strung out**, 1 at the start line and `SPREAD_MAX` by
 * the end of the drain hold.
 *
 * revision2 adds one sentence to the 45f beat after `a3_13_narrator`: it is
 * still the blue draining out of the beam in silence, "and it is now also the
 * field stringing out". Nothing *enters* the beat — the seven who are already
 * in it simply stop being a rank and start being a race, which is the one
 * thing a held beat is allowed to contain.
 *
 * **1.10, and the ceiling is arithmetic rather than taste**: the pack head sits
 * at `TRACK_X` = 900 and Violet is six steps behind it, so every percent of
 * spread costs him 6.7px of screen. At 1.10 he is at x≈161 with his own exit
 * still eight seconds away and Yellow's bubble still pointing at somebody; at
 * the 1.42 a first pass used he is at −54, i.e. the character whose entire gag
 * is being findable has been pushed off the left of the frame.
 */
const SPREAD_MAX = 1.1;
const SPREAD_FRAMES = 90;

/**
 * Frames Blue spends leaving the top of the frame after his bounce has topped
 * out, and frames Indigo spends on the whole climb. Both are set by *lines*
 * rather than by taste — see the two exits in the scene below.
 */
const BLUE_CLIMB = 86;
const INDIGO_CLIMB = 410;
/** How far the climb takes him past the top of his own bounce. */
const BLUE_OUT_DY = 700;
/**
 * Frames Blue's backwards pass takes — **36, not the whole line**.
 *
 * A sweep that lasted all 99 frames of `a3_13a_blue` moved him at 9px a frame,
 * a quarter of the speed of his own slowest ricochet leg, which draws a Blue
 * *drifting* past Red while calling him too slow. He crosses the file in a
 * second and a quarter and spends the rest of the line ricocheting behind it,
 * which is both the character and the joke.
 */
const PASS_FRAMES = 36;
/**
 * Where Blue is **on screen** when his bounce tops out. He is the one leaver
 * with no sky mark — he does not park, he keeps going — but his arc still has
 * to be aimed in screen space or the tracking camera takes him out of the side
 * of the picture (see `exitOf`).
 *
 * **It is under `a3_13b_blue`'s bubble rather than in it, and that is the whole
 * choice.** That bubble has sat at (560, 180) since wave 2, where it was placed
 * for a Blue who had already gone; now that revision2 has him still climbing on
 * the line, a bounce that topped out at (520, 126) put the character *behind
 * his own speech bubble* for the whole of it — invisible, in the one shot where
 * "he really is going up" is the joke. Topping out at (330, 286) puts him just
 * under the bubble's tail, which is where a tail is supposed to point, and the
 * shipped placement does not move.
 */
const BLUE_TOP = { x: 330, y: 286 };
/**
 * The box Blue ricochets in **relative to the pack** — so his corners come out
 * of `blueRicochet` in one fixed frame of reference and the whole thing travels
 * with the light. His trail is offset by the pack's *current* position for the
 * same reason: the camera is tracking the pack, so pack-local is what the
 * viewer's eye is holding still, and a trail laid out in world coordinates
 * would smear a second, false, camera-shaped tail behind him.
 *
 * **He does not hold a slot in the file, and that is the point of him**: the
 * box is centred on where his slot *would* be and is wide enough that he keeps
 * crossing his neighbours' places in the line. Five colours travelling in
 * formation and one that cannot hold a position for nine frames together is
 * the whole of Act Two restated in one picture.
 */
const S28_BLUE_BOX: Box = { x: -610, y: -124, w: 320, h: 248 };

/**
 * Where a leaver ends up, once it is sky: a fixed SCREEN mark in the blue band
 * across the top of the frame.
 *
 * **Z-ORDER AND OFFSET FOR THE BLUE/INDIGO PAIR, decided here and on purpose**
 * (the kit's known watch-item: Indigo at four frames' lag sits about half a
 * body behind Blue and overlaps him). In the pack, Indigo is drawn **behind**
 * Blue — lower `zIndex` — and sits 26px lower, because he is the faded copy and
 * a copy belongs behind and under its original. In the sky they are not near
 * each other at all: Blue has gone, and Indigo is alone up at frame left.
 *
 *   blue    no mark. He goes furthest UP rather than furthest out and leaves
 *           through the top of frame while the wash steps up — he *is* the
 *           blue at the top of the picture from that frame on, which is the
 *           only honest way to draw "the sky is what left the beam".
 *   indigo  frame left, low in the band, still a findable body. Ray's second
 *           wave lands on him and he waves back four frames late, because he
 *           is late at everything.
 *   violet  higher, further, smaller — the running gag as geometry — and he
 *           turns back and waves from further away than either of them.
 *
 * All three go out through the same corner, which is where they bounced from,
 * and the two who stay are **offset diagonally and by size** so they never
 * become one lilac smudge: Indigo is 62px of body at (300, 300) and Violet is
 * 58px at (140, 124).
 *
 * Both marks are also clear of Ray's bubble box, which is 660px wide about
 * x=700 — a still of the button had Indigo entirely behind the left third of
 * "I will see me later.", i.e. the goodbye covering one of the two people it
 * was addressed to.
 */
const SKY_MARK: Partial<Record<ShardName, { x: number; y: number; scale: number }>> = {
  indigo: { x: 300, y: 300, scale: 0.26 },
  violet: { x: 140, y: 124, scale: 0.24 },
};

/** Frames a leaver spends turned back, waving, before it faces its own path. */
const WAVE_FOR = 30;
/** How long Ray's own wave gesture lasts, per name. */
const RAY_WAVE_FOR = 34;

const BlueRunsOutScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const [travelFrom] = lineWindow(scene, "a3_12_narrator");
  const [bounceFrom, bounceTo] = lineWindow(scene, "a3_13_narrator");
  const [beatFrom, beatTo] = heldBeat(scene, "a3_13_narrator");
  const [, arriveTo] = lineWindow(scene, "a3_14_narrator");
  const [tauntFrom, tauntTo] = lineWindow(scene, "a3_13a_blue");
  const [blueGoFrom, blueGoTo] = lineWindow(scene, "a3_13b_blue");
  const [, blueUpTo] = lineWindow(scene, "a3_13bb_blue");
  const [indigoGoFrom] = lineWindow(scene, "a3_13c_indigo");
  const [, indigoEchoTo] = lineWindow(scene, "a3_13cb_indigo");
  const [, cheerTo] = lineWindow(scene, "a3_13cd_yellow");

  // --- who leaves, and when -------------------------------------------------
  //
  // THREE colours leave this leg, and the count is load-bearing — Scene 28b
  // opens on "and then there were four". See the file header for the spec
  // conflict this resolves.
  //
  // **revision2 moved all three down the scene**, and that is the whole shape
  // change: the leg used to be 36 seconds with a five-second triple exit at the
  // end of it and is now 52 with a scene per exit. The 45f drain hold is no
  // longer anybody's approach — the mid-leg banter is — so what is left in the
  // hold is the picture it was always described as: blue draining out of the
  // beam, in silence, with the field stringing out down it (`SPREAD_MAX`).
  //
  //   blue    twelve frames before `a3_13b_blue`, so he is **mid-air on the
  //           line as before** — the phrase is revision2's. He bounces off the
  //           big puff, says it going up, and detonates the s9 claim on the way
  //           ("I am winning UPWARDS!") while he is still visibly climbing.
  //   indigo  `INDIGO_LAG` frames later. Four. It is the law and it does not
  //           bend for a re-time — what bends is how long he takes over it: his
  //           arc runs `INDIGO_CLIMB` frames against Blue's, so he is *still
  //           rising* through both of his own lines, which is what "rising
  //           after him" means and is also why an adjacent wavelength being a
  //           faded, slower copy is drawn rather than asserted.
  //   violet  in the 20f beat after `a3_13cd_yellow`, last, highest, furthest,
  //           and he does not say anything. The silence *is* the joke and the
  //           beat stays empty of everything else.
  const bounceSpan = Math.max(1, bounceTo - bounceFrom);
  const blueOut = blueGoFrom - 12;
  const indigoOut = blueOut + INDIGO_LAG;
  const violetOut = cheerTo + 4;

  /**
   * The field stringing out inside the drain hold — see `SPREAD_MAX`. It is a
   * pure function of the frame and it is applied at every call site of
   * `packSlot` in this scene, so no two of them can disagree about where the
   * tail of the file is.
   */
  const spreadAt = (f: number): number =>
    1 + (SPREAD_MAX - 1) * kidEase.easeInOutSine(clamp01((f - beatFrom) / SPREAD_FRAMES));
  const slotAt = (i: number, f: number) => packSlot(i, spreadAt(f));

  // The three pings Blue leaves on the air on "Bounce. Bounce. Bounce." — the
  // line runs at 0.88 so that they are three bounces and not one noise. He is
  // still in the pack for all three; the fourth ping is him leaving.
  const pingAt = [
    bounceFrom + bounceSpan * 0.24,
    bounceFrom + bounceSpan * 0.56,
    bounceFrom + bounceSpan * 0.88,
    blueOut,
    indigoOut,
    violetOut,
  ];

  // Where the light is. One continuous move, left to right, high up in air
  // thick with puffs — a `cruise`, so it sets off and then holds one speed
  // rather than easing to a halt in the middle of two hundred miles of air.
  // The camera stops tracking once the pack has crossed, and the last third of
  // the scene is the goodbye on a locked-off shot: deadpan is stillness.
  //
  // **OPEN DECISION, left as it was found (wave 2, batch (a) audit).** `travel`
  // saturates at `arriveTo`, so from there to the cut — about 350 frames — the
  // pack is stationary in world space as well as on screen, which means RED
  // STOPS WALKING for eleven seconds in the middle of the episode that spends
  // five scenes establishing that he never does. The two readings pull against
  // each other and both are in the spec: "the goodbye lands … deadpan is
  // stillness" (script.md's 20f and 24f beats) against Red's one law. It was
  // left alone because the alternative costs more than it buys — keeping the
  // pack cruising runs `packX` to ~4520, outside `WIDE`'s box, and re-timing
  // the cruise to land at `BEAM.x1` on the last frame moves every exit arc,
  // every ping and both sky hand-offs. Nothing in the frame reports the stop
  // (the puffs are world-fixed too, so the whole picture holds together), and
  // Red is walking again three seconds later in 28b. **If a viewer ever calls
  // it, the fix is the re-time, not a nudge.**
  const travel = cruise(clamp01((frame - travelFrom) / Math.max(1, arriveTo - travelFrom)));
  const packX = BEAM.x0 + (BEAM.x1 - BEAM.x0) * travel;
  const packY = BEAM.y + Math.sin(travel * 5.2) * 14;
  const packAt = (f: number): { x: number; y: number } => {
    const u = cruise(clamp01((f - travelFrom) / Math.max(1, arriveTo - travelFrom)));
    return { x: BEAM.x0 + (BEAM.x1 - BEAM.x0) * u, y: BEAM.y + Math.sin(u * 5.2) * 14 };
  };
  const camDxAt = (f: number): number => Math.max(-(BEAM.x1 - TRACK_X), -(packAt(f).x - TRACK_X));
  const dx = camDxAt(frame);
  const cam: Cam = { x: 0, y: 540, dx };

  // --- the three exits ------------------------------------------------------
  //
  // Each arc's world endpoint is solved from its SKY mark, so the hand-off from
  // world space to sky space happens on a frame where the two agree exactly.
  // Blue has no mark: he goes out through the top of frame as the wash steps
  // up, which is him becoming the blue at the top of the picture.
  // Blue's ricochet, in pack-local coordinates. `blueRicochet` is fed a
  // scene-local frame so his corner sequence is a pure function of the frame,
  // exactly like everything else in the kit — and Indigo is literally the same
  // function, `INDIGO_LAG` frames ago, so he inherits Blue's corners with the
  // same elbow in them four frames stale.
  //
  // **THE TAUNT IS A LEG OF THE RICOCHET, NOT A DETOUR FROM IT.** revision2
  // stages `a3_13a_blue` as Blue "ricocheting past Red BACKWARDS" — so the pass
  // is folded into the same function everything else reads, and Indigo
  // therefore does it four frames late without being told to, which is how he
  // ends up saying "Too slow. Sorry." *at the puff Blue has just left*. It runs
  // right to left across the whole file at a heading of 180°, which is the one
  // direction nothing else in this scene ever travels, and it clears the top of
  // Red's box by about thirty pixels: a near miss reads as a taunt, and an
  // overlap reads as a bug.
  //
  // **The blend starts ON the line, not before it.** A ten-frame anticipation
  // is the house default and it is wrong here: `a3_13a_blue` opens the frame
  // after the 45f drain hold ends, so an early ramp puts a blue streak across
  // the pack *inside* a beat whose entire content is that nothing enters it.
  const passOn = (f: number): number =>
    clamp01((f - tauntFrom) / 6) - clamp01((f - (tauntFrom + PASS_FRAMES)) / 14);
  const passAt = (f: number): { x: number; y: number } => {
    const u = clamp01((f - tauntFrom) / PASS_FRAMES);
    // **UNDER the file, not over it.** A first pass ran him along the top of
    // the beam at pack-local y = −86, which is Ray's lane: a still had Blue
    // sitting on Ray's face with the taunt's tail pointing at the pair of them,
    // i.e. the frame read as *Ray* calling Red slow. Ray hangs 148px above the
    // beam and Red's box reaches 31 below it, so the only clear lane in the
    // shot is beneath them both.
    return { x: 260 - 690 * u, y: 96 + Math.sin(u * Math.PI) * 26 };
  };
  const blueLegs = (f: number): { x: number; y: number; angle: number } => {
    const b = blueRicochet(Math.max(0, f - travelFrom), S28_BLUE_BOX);
    const on = passOn(f);
    if (on <= 0) return b;
    const p = passAt(f);
    return {
      x: b.x + (p.x - b.x) * on,
      y: b.y + (p.y - b.y) * on,
      angle: on > 0.5 ? 180 : b.angle,
    };
  };
  /**
   * His blur, sampled off `blueLegs` rather than off `blueRicochet` — two legs
   * long, so a paused frame always has a corner in it, and so the taunt drags a
   * straight backwards streak behind him instead of a ricochet he is not on.
   */
  const blueTrailAt = (f: number): { x: number; y: number }[] => {
    const span = 18;
    return Array.from({ length: 15 }, (_, s) => {
      const p = blueLegs(f - span + (span * s) / 14);
      return { x: p.x, y: p.y };
    });
  };
  const blueLocal = blueLegs(frame);
  const indigoLocal = indigoEcho(blueLegs, frame);
  /** Where a roamer actually is in the world on an arbitrary frame. */
  const roamAt = (f: number, lag: number, dy: number): { x: number; y: number } => {
    const l = blueLegs(f - lag);
    const p = packAt(f);
    return { x: p.x + l.x, y: p.y + l.y + dy };
  };

  const exitOf = (
    who: ShardName,
    out: number,
    frames: number,
    from: { x: number; y: number },
    arc: number,
  ): Exit => {
    const m = SKY_MARK[who];
    const end = out + frames;
    return {
      out,
      frames,
      arc,
      runTo: m
        ? { x: m.x - camDxAt(end), y: m.y }
        : // Blue: up and back the way he came, which is what a bounce off an
          // air puff actually is — but **solved from a SCREEN mark, exactly
          // like the other two**, and that is a fix rather than a flourish.
          // The camera is chasing the beam at ~3px a frame, so an arc whose
          // endpoint is picked in world space is dragged left by ~300px over
          // its own length: a still of the first pass had Blue leaving through
          // the *left-hand edge* of frame under a bubble that says he is going
          // UP, and gone entirely by the time he says so. `BLUE_TOP` is where
          // he is on screen when the bounce tops out; `BLUE_CLIMB` takes him
          // out through the top from there.
          { x: BLUE_TOP.x - camDxAt(end), y: BLUE_TOP.y },
    };
  };
  const blueFrom = roamAt(blueOut, 0, 0);
  const indigoFrom = roamAt(indigoOut, INDIGO_LAG, 26);
  const violetFrom = {
    x: packAt(violetOut).x + slotAt(6, violetOut).x,
    y: packAt(violetOut).y + slotAt(6, violetOut).y,
  };
  // **Blue's exit is two stages, and the second one exists because of a line.**
  // The bounce is 96 frames and stops him just under the top of the frame; then
  // he climbs out of it over `BLUE_CLIMB` more. A single 132-frame arc to
  // y = −524 (the shipped one) puts him off the top of the picture at local
  // frame ~537, which was fine when his only line up there landed after he had
  // gone and is wrong now that revision2 gives him `a3_13bb_blue` — "I am
  // winning UPWARDS!" — to say **while he is still visibly going up**. He is on
  // screen for the first two thirds of that line and out of frame for the last
  // third, which is the exact shape of the joke.
  const blueExit = exitOf("blue", blueOut, 96, blueFrom, 0.2);
  const blueClimb = clamp01((frame - (blueOut + blueExit.frames)) / BLUE_CLIMB);
  // Indigo takes **four times as long** over the same job and does not get as
  // far: an adjacent wavelength is a faded copy, and a faded copy is slower. It
  // is also what keeps him *still rising* through both of his own lines
  // (`a3_13c` and `a3_13cb`), which is what revision2's "rising after him"
  // asks for and what puts a findable body under each of his bubbles.
  const indigoExit = exitOf("indigo", indigoOut, INDIGO_CLIMB, indigoFrom, 0.09);
  // Violet goes last, highest and furthest, and takes the longest doing it —
  // he is the fastest thing in any frame he is in and he still arrives last.
  // 210 frames from the 20f beat lands him on his sky mark seven frames before
  // the goodbye names him, which is the last possible moment and the right one.
  const violetExit = exitOf("violet", violetOut, 210, violetFrom, 0.09);

  /**
   * Where a leaver is on screen right now — mid-arc, or parked in the sky.
   * Bubbles live outside the camera, so they need the screen answer and not
   * the world one, and the two colours who speak on their way out both do it
   * while they are still moving.
   */
  const leaverNow = (
    who: ShardName,
    exit: Exit,
    from: { x: number; y: number },
  ): { x: number; y: number } => {
    const m = SKY_MARK[who];
    if (frame <= exit.out) return { x: from.x + dx, y: from.y };
    if (frame <= exit.out + exit.frames) {
      const p = exitAt(frame, from, exit);
      return { x: p.x + dx, y: p.y };
    }
    return m
      ? { x: m.x, y: m.y }
      : // Blue, past the top of his bounce: still climbing, and still the thing
        // his own bubble has to point at.
        { x: exit.runTo.x + dx, y: exit.runTo.y - kidEase.easeInQuad(blueClimb) * BLUE_OUT_DY };
  };
  const indigoNow = leaverNow("indigo", indigoExit, indigoFrom);
  const blueNow = leaverNow("blue", blueExit, blueFrom);

  // How much of the blue has gone up into the sky. Drives the wash at the top
  // of frame: what left the beam is what the sky is now made of, and the step
  // that lands as Blue leaves the top of frame is Blue — which is why his term
  // runs over the bounce *and* the climb rather than saturating at the top of
  // the arc, where he is still very much in the picture.
  const gone =
    (clamp01((frame - blueOut) / (blueExit.frames + BLUE_CLIMB)) +
      clamp01((frame - indigoOut) / indigoExit.frames) +
      clamp01((frame - violetOut) / violetExit.frames)) /
    3;

  const stage = useStage(scene);
  const emotion = useEmotion(
    scene,
    "ray",
    // `a3_14d_ray` ("I will see me later.") is deliberately **not** in this map,
    // exactly as `a1_44_ray` is not in Scene 10's: the face he ends the goodbye
    // with is the face he says the button on, and the deflation is staged as
    // stillness below rather than as an expression.
    { a3_14b_ray: "excited" },
    "happy",
    // 45f, 20f and 24f held beats in this scene.
    NO_LEAD,
  );

  // --- the goodbye ----------------------------------------------------------
  //
  // Three names, three waves, evenly through the line — and **the first one
  // hits nothing**. Blue bounced out four hundred frames ago and there is a
  // hole in the file where he was, so the gesture is identical each time and
  // only two of the three land. Ray does not notice, and nothing in the scene
  // points it out: that is the joke and it is free.
  const [byeFrom, byeTo] = lineWindow(scene, "a3_14b_ray");
  const [stillFrom, stillTo] = heldBeat(scene, "a3_14c_narrator");
  const bySpan = Math.max(1, byeTo - byeFrom);
  const nameAt = [byeFrom + bySpan * 0.1, byeFrom + bySpan * 0.44, byeFrom + bySpan * 0.76];
  const wave = nameAt.reduce((best, at) => {
    const age = frame - at;
    if (age < 0) return best;
    return Math.max(best, 1 - kidEase.easeInOutSine(age / RAY_WAVE_FOR));
  }, 0);
  // **Nothing enters the 24f after `a3_14c`.** He hangs there in a beam that is
  // now red and orange, doing absolutely nothing — same beat, same length and
  // same reason as Scene 10's.
  const inButtonBeat = frame >= stillFrom && frame < stillTo;

  const rayMark: Mark = {
    x: packX + 150,
    y: hover("ray", packY - 148, 0.62),
    scale: 0.62,
    who: "ray",
  };

  // His eye-line, name by name: **at the empty piece of beam Blue used to
  // ricochet over**, then up at Indigo, then up at Violet. Three aims, one
  // gesture, and only two of them have anybody on the end.
  const rayEye = { x: rayMark.x + dx, y: rayMark.y };
  const blueHole = { x: packX + dx + (S28_BLUE_BOX.x + S28_BLUE_BOX.w / 2), y: packY };
  const rayLook = ((): { x: number; y: number } => {
    if (inButtonBeat) return { x: -0.5, y: 0.35 };
    if (frame >= nameAt[2]) return aim(rayEye, SKY_MARK.violet ?? blueHole);
    if (frame >= nameAt[1]) return aim(rayEye, SKY_MARK.indigo ?? blueHole);
    if (frame >= nameAt[0]) return aim(rayEye, blueHole);
    return { x: -0.5, y: 0.35 };
  })();

  return (
    <AbsoluteFill>
      <PaintedSky bg="sky_dome_day" phase={4.4} drift={8} />
      {/* Sunset light in the corridor. `tint` on the plate is a soft-light wash
          and soft-light orange over a cyan sky barely moves it — the still was
          a bright blue midday sky, in the scene about the sun being on the
          floor. A plain warm wash on top does what the plate's own knob would
          not, and it also **clears the blue out of the picture**, which this
          scene needs: the blue that arrives at the top of the frame has to be
          the blue that left the beam, and it cannot be if the sky was already
          that colour. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(255,138,60,0.62) 0%, rgba(255,167,64,0.7) 46%, rgba(255,201,60,0.62) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* The rest of the sky, filling up with what bounced out of the beam. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, rgba(58,160,236,${0.86 * gone}) 0%, rgba(58,160,236,${0.44 * gone}) 32%, rgba(58,160,236,0) 60%)`,
          pointerEvents: "none",
        }}
      />

      <Camera cam={cam}>
        <AirCorridor t={t} />
        <BeamTrail x0={BEAM.x0 - 420} x1={packX + 90} y={BEAM.y} gone={gone} />

        {/* THE PACK. Always seven mounted, always in the same order — what
            changes is where each one is. Red at the head of the file and violet
            at the tail, so the two that never bounce are the two at the front
            and the order of the file is the order they leave in. */}
        <PackShard who="red" pack={{ x: packX, y: packY }} i={0} spread={spreadAt(frame)} look={{ x: 0.6, y: 0 }} />
        {/* Orange, one place behind Red and answering a taunt that was not
            addressed to him. He does not look at Blue while he does it — he
            looks at Red, which is the whole of the character. */}
        <PackShard
          who="orange"
          pack={{ x: packX, y: packY }}
          i={1}
          spread={spreadAt(frame)}
          look={{ x: 0.85, y: 0 }}
          speaking={stage.speaking("orange")}
        />
        <PackShard
          who="yellow"
          pack={{ x: packX, y: packY }}
          i={2}
          spread={spreadAt(frame)}
          // He waves at somebody who is leaving, which is his entire character,
          // and he is the only one who ever addresses Violet by name. His look
          // goes up after Violet from `a3_13d` on; nobody else looks up.
          //
          // Up and **LEFT**: Violet is four pack slots (448px) behind Yellow in
          // the file and his exit arc goes further left again, to a sky mark at
          // x=140. A first pass aimed this up-right, i.e. had the one character
          // who ever addresses Violet by name waving at the opposite corner of
          // the sky from him.
          //
          // **From Blue's exit onward she is looking up, and she does not look
          // back down.** revision2 gives her three cheers in this leg — winning,
          // echoing, bouncing — and every one of them is aimed at somebody who
          // has already left, so the eye-line is one decision rather than three.
          look={frame >= blueOut ? { x: -0.5, y: -0.8 } : { x: 0.6, y: 0 }}
          speaking={stage.speaking("yellow")}
        />
        <PackShard who="green" pack={{ x: packX, y: packY }} i={3} spread={spreadAt(frame)} look={{ x: 0.6, y: 0 }} />

        {/* BLUE, ricocheting inside the pack until he ricochets out of it. His
            trail is two legs long, so a paused frame always has a corner in it
            — the corner is the whole of him. */}
        {frame < blueOut ? (
          <Shard
            who="blue"
            x={packX + blueLocal.x}
            y={hover("shard", packY + blueLocal.y, 0.44)}
            scale={0.44}
            heading={blueLocal.angle}
            trail={blueTrailAt(frame).map((p) => ({ x: p.x + packX, y: p.y + packY }))}
            look={{ x: 0.5, y: 0 }}
            speaking={stage.speaking("blue")}
            zIndex={30}
          />
        ) : null}
        {/* INDIGO. Blue's own corners, four frames stale, drawn BEHIND him and
            26px lower — see the note on `SKY_MARK`. */}
        {frame < indigoOut ? (
          <Shard
            who="indigo"
            x={packX + indigoLocal.x}
            y={hover("shard", packY + indigoLocal.y + 26, 0.42)}
            scale={0.42}
            heading={indigoLocal.angle}
            trail={blueTrailAt(frame - INDIGO_LAG).map((p) => ({
              x: p.x + packX,
              y: p.y + packY + 26,
            }))}
            look={{ x: 0.5, y: 0 }}
            speaking={stage.speaking("indigo")}
            zIndex={28}
          />
        ) : null}
        {/* VIOLET, in the file, fizzing. `Shard` vibrates him whether or not the
            scene asks, so there is no frame of this episode in which he is
            still. */}
        {frame < violetOut ? (
          <PackShard
            who="violet"
            pack={{ x: packX, y: packY }}
            i={6}
            spread={spreadAt(frame)}
            look={{ x: 0.6, y: 0 }}
          />
        ) : null}

        {/* The ping each bounce leaves on the air it bounced off — the first
            three on "Bounce. Bounce. Bounce.", then one per departure. Each is
            drawn where the bouncer actually was on that frame. */}
        {pingAt.map((at, i) => (
          <PingRing
            key={i}
            at={at}
            frame={frame}
            fps={fps}
            p={i === 5 ? violetFrom : roamAt(at, i === 4 ? INDIGO_LAG : 0, i === 4 ? 26 : 0)}
            color={i === 5 ? 6 : i === 4 ? 5 : 4}
          />
        ))}

        {/* The leavers, mid-arc: off the beam, up, and still going. Drawn in
            world space only while the arc runs; after that they are sky (see
            the header note) and are drawn outside the camera below. */}
        <Leaver
          who="blue"
          exit={blueExit}
          from={blueFrom}
          frame={frame}
          scale={0.44}
          climb={{ frames: BLUE_CLIMB, dy: BLUE_OUT_DY }}
        />
        <Leaver who="indigo" exit={indigoExit} from={indigoFrom} frame={frame} scale={0.42} />
        <Leaver who="violet" exit={violetExit} from={violetFrom} frame={frame} scale={0.42} />

        <Ray
          x={rayMark.x}
          y={rayMark.y}
          scale={0.62}
          brightness={RAY_LIGHT.full}
          spectrum={RAY_SPECTRUM.afterRainbow}
          phase={PHASE.ray}
          emotion={emotion}
          speaking={stage.speaking("ray")}
          look={rayLook}
          pose={wave > 0.04 && !inButtonBeat ? "wave" : "rest"}
          wave={wave}
          // Deadpan is stillness: inside the 24f button beat his idle drops and
          // the wave is already dead.
          idle={inButtonBeat ? 0.55 : 1}
          bank={-3}
          streak={0.85}
          zIndex={40}
        />
      </Camera>

      {/* THE SKY, which is now partly made of three named characters. Outside
          the camera, because that is the point of them. */}
      <SkyLeaver
        who="indigo"
        exit={indigoExit}
        frame={frame}
        // Four frames late at everything, including at waving back. This is the
        // wave `a3_14b_ray`'s second name actually lands on.
        waveAt={nameAt[1] + INDIGO_LAG}
      />
      <SkyLeaver
        who="violet"
        exit={violetExit}
        frame={frame}
        // **Violet, firing three.** He turns back and waves from further away
        // than either of them, and nobody but Yellow has ever looked at him.
        waveAt={nameAt[2]}
      />

      <Bubbles
        scene={scene}
        cast={
          {
            ray: { ...rayMark, x: rayMark.x + dx },
            // The colours' bubbles hang where the colours actually are — Blue
            // and Indigo are up in the sky by the time they speak, which is
            // the whole of "he is already gone by the time he says it", and a
            // tail pointing at the beam they left would undo it.
            // Blue has no position left to hang a bubble off — he is out
            // through the top of frame — so this mark exists only to make him
            // a member of the cast. Every coordinate that matters is in the
            // `at` override below.
            blue: { x: blueNow.x, y: blueNow.y, scale: 0.3, who: "shard" },
            indigo: { x: indigoNow.x, y: indigoNow.y, scale: 0.3, who: "shard" },
            yellow: {
              x: packX + slotAt(2, frame).x + dx,
              y: hover("shard", packY + slotAt(2, frame).y, 0.44),
              scale: 0.44,
              who: "shard",
            },
            orange: {
              x: packX + slotAt(1, frame).x + dx,
              y: hover("shard", packY + slotAt(1, frame).y, 0.44),
              scale: 0.44,
              who: "shard",
            },
          } as Cast
        }
        text={S28_BUBBLES}
        at={{
          a3_14b_ray: { x: 700, y: 232, tail: "left", tailAt: rayMark.x + dx },
          a3_14d_ray: { x: 700, y: 232, tail: "left", tailAt: rayMark.x + dx },
          // --- the mid-leg banter ------------------------------------------
          //
          // Blue crosses the whole file backwards through his own line, so the
          // bubble parks in the sky over it and the tail follows him across.
          //
          // **MOVED FROM x=1180 TO x=600 (showrunner fix, 2026-08-03), and the
          // reason is the tail's clamp.** On the right the bubble ran 860…1500,
          // so the tail could only travel 900…1460 — and Blue spends all but
          // the first second of this line at x < 700, first sweeping backwards
          // through the file and then ricocheting in his box (screen 290…610).
          // The tail was therefore pinned at its own left-hand stop for the
          // whole line, 400px above and 200px left of nothing, with **Ray's
          // glow (1050, 420) the nearest bright object under it** — so the
          // frame read as Ray calling Red slow, which is the exact failure the
          // first pass at y≈240 was moved to avoid. Moving the bubble does what
          // raising it could not.
          //
          // At x=600 the bubble runs 280…920 and the tail's travel is 320…880,
          // which *contains* Blue's whole ricochet box and most of his
          // backwards sweep: the tail is on him, on his own body's x (his face
          // rides his body here — there is no offset to add), for ~90% of the
          // line, and it is 450px clear of Ray on the other side of the frame.
          // The first ~20 frames, while he is still out at 1160 finishing the
          // pass, are the one stretch where it clamps — and it clamps *towards*
          // him rather than away from him.
          a3_13a_blue: { x: 600, y: 190, tail: "left", tailAt: packX + blueLocal.x + dx },
          // Orange answers from the head of the file. Left and low, because Ray
          // is parked at (1050, ~390) for the whole tracked stretch and a
          // bubble on that side reads as his.
          a3_13aa_orange: { x: 620, y: 268, tail: "right", tailAt: packX + slotAt(1, frame).x + dx },
          // Indigo's tail arrives four beats later and has to read as HIS, so it
          // lands in a different place from Blue's rather than in the same one.
          a3_13ab_indigo: { x: 560, y: 420, tail: "right", tailAt: packX + indigoLocal.x + dx },
          // Still climbing, top left, tail following him up: the denial is the
          // one line in the episode that is *physically true*, and the picture
          // has to show him genuinely going up while he says it.
          a3_13bb_blue: { x: 660, y: 176, tail: "left", tailAt: blueNow.x },
          // Yellow cheers from the file at somebody who has already left. Far
          // right and high, out of the corridor the two climbers are in.
          a3_13bc_yellow: { x: 1340, y: 300, tail: "left", tailAt: packX + slotAt(2, frame).x + dx },
          a3_13cd_yellow: { x: 1340, y: 300, tail: "left", tailAt: packX + slotAt(2, frame).x + dx },
          // Indigo's credit-claim, said while still rising, from the same place
          // his first one came from — one voice, one corner of the sky.
          a3_13cb_indigo: { x: 700, y: 176, tail: "left", tailAt: indigoNow.x },
          // **Blue is off the frame entirely when this lands** — up and out
          // through the top-left corner — so this is a bubble with nobody
          // under it, which is the joke (script.md: "He is already gone by the
          // time he says it"). It goes **up in the top-left corner, pointing
          // the way he went**.
          //
          // It was on the right at x=1330 for one pass and a still killed it:
          // the tail's clamped corner landed 70px above Ray's face, so the
          // frame read as *Ray* saying "Sorry! I am going UP!" — a bubble with
          // nobody under it only works if there is nobody under it.
          //
          // **What changed in revision2:** the drain hold is no longer his
          // approach, so he is now bounced and CLIMBING when this lands rather
          // than gone. The bubble stays exactly where it was — top left, the
          // way he went — and the tail now has a body on the end of it, which
          // is a strictly better version of the same frame.
          a3_13b_blue: { x: 560, y: 180, tail: "left", tailAt: blueNow.x },
          // Over on the far side of him, tail reaching back: he is still
          // climbing when this lands, and a bubble centred over a body that is
          // 300px up the frame sits on top of it.
          a3_13c_indigo: { x: 700, y: 176, tail: "left", tailAt: indigoNow.x },
          // Far right, clear of Ray's glow: the upper-left quadrant belongs to
          // the two who are still climbing through it, and Ray sits at a fixed
          // 1050 for the whole tracked stretch.
          a3_13d_yellow: {
            x: 520,
            y: 400,
            tail: "right",
            tailAt: packX + slotAt(2, frame).x + dx,
          },
        }}
      />

      {/* THE FAINT ONE. A different size, so a different `<Bubbles>` — see
          `S28_FAR_BUBBLES` and `FAR_BUBBLE`. Blue is hundreds of pixels above
          the picture by now and the joke is that the line is *identical*, not
          that it is far away.

          **It no longer floats in the middle of the sky** (showrunner fix,
          2026-08-03). It is tiny, it is jammed against the top edge of the
          frame, and it is in **Blue's own exit column** — `blueNow.x`, i.e.
          wherever the tracking camera has left the piece of sky he climbed out
          through — so it sits beside the small parked body at the top of the
          frame instead of dead centre above everybody.

          **Still `tail: "none"`, and that is a deliberate refusal.** The kit's
          tail leaves the bubble's *bottom* edge (cleanup item D-a1_49), and the
          only body anywhere near the top-left corner at this moment is INDIGO,
          parked on his sky mark at (300, 300) and still climbing. A tail would
          therefore point down at Indigo and the frame would read as Indigo
          saying Blue's catchphrase — which is not an imperfect tail, it is the
          wrong speaker, in the one scene built on two adjacent blues saying the
          same words four frames apart. Position does the attaching until the
          kit grows a top-edge tail. */}
      <Bubbles
        scene={scene}
        cast={{ blue: { x: blueNow.x, y: blueNow.y, scale: 0.2, who: "shard" } } as Cast}
        text={S28_FAR_BUBBLES}
        fontSize={FAR_BUBBLE.fontSize}
        maxWidth={FAR_BUBBLE.maxWidth}
        at={{ a3_13cc_blue: { x: blueNow.x, y: 172, tail: "none" } }}
      />
    </AbsoluteFill>
  );
};

/**
 * One of the seven, in the file, at the pack's own position. A three-line
 * wrapper so a scene with seven of them reads as seven marks rather than as
 * seven copies of the same arithmetic — and so the file's spacing lives in
 * `packSlot` and cannot drift between them.
 */
const PackShard: React.FC<{
  who: ShardName;
  pack: { x: number; y: number };
  i: number;
  /** How far the file has strung out — 1 at the start line. `SPREAD_MAX`. */
  spread?: number;
  look?: Parameters<typeof Shard>[0]["look"];
  speaking?: boolean;
  scale?: number;
}> = ({ who, pack, i, spread = 1, look, speaking, scale = 0.44 }) => {
  const slot = packSlot(i, spread);
  return (
    <Shard
      who={who}
      x={pack.x + slot.x}
      y={hover("shard", pack.y + slot.y, scale)}
      scale={scale}
      look={look}
      speaking={speaking}
      zIndex={24 + i}
    />
  );
};

/**
 * A colour on its way out of the race, in world space, for exactly as long as
 * its arc lasts.
 *
 * It never fades and it never shrinks to nothing: it gets *smaller with
 * distance* down to two thirds, and then it is somewhere else. Blue is the one
 * exception and it is not a fade either — his arc ends above the top of the
 * frame at the same moment the blue wash finishes stepping up, so what the
 * audience sees is one thing turning into the other.
 */
const Leaver: React.FC<{
  who: ShardName;
  exit: Exit;
  from: { x: number; y: number };
  frame: number;
  scale: number;
  /**
   * **Blue only: the second stage of his exit.** The bounce stops him just
   * under the top of the frame and this carries him out of it, so that he is
   * still visibly climbing while he says he is winning upwards. Nothing fades
   * and nothing is deleted — he goes off the top of the picture at the same
   * moment the blue wash finishes stepping up, which is one thing turning into
   * the other.
   */
  climb?: { frames: number; dy: number };
}> = ({ who, exit, from, frame, scale, climb }) => {
  const held = climb ? climb.frames : 0;
  if (frame < exit.out || frame > exit.out + exit.frames + held) return null;
  const p = exitAt(Math.min(frame, exit.out + exit.frames), from, exit);
  const up = climb
    ? kidEase.easeInQuad(
        Math.max(0, Math.min(1, (frame - (exit.out + exit.frames)) / climb.frames)),
      ) * climb.dy
    : 0;
  return (
    <Shard
      who={who}
      x={p.x}
      y={hover("shard", p.y - up, scale * (1 - p.u * 0.34))}
      scale={scale * (1 - p.u * 0.34)}
      heading={p.angle}
      emotion="excited"
      look={{ x: 0.2, y: -0.7 }}
      zIndex={34}
    />
  );
};

/**
 * A colour that has finished becoming sky: parked at its screen mark, up in
 * the blue band, for the rest of the scene.
 *
 * `waveAt` is the frame it turns back and waves — a whole-body wag rather than
 * an arm, because a raised arm is Yellow's and nobody else's (`waveBack`).
 */
const SkyLeaver: React.FC<{
  who: ShardName;
  exit: Exit;
  frame: number;
  waveAt: number;
}> = ({ who, exit, frame, waveAt }) => {
  const m = SKY_MARK[who];
  if (!m || frame < exit.out + exit.frames) return null;
  const wag = frame >= waveAt ? waveBack(frame - waveAt, WAVE_FOR) : { dx: 0, dy: 0, grow: 1 };
  const s = m.scale * wag.grow;
  return (
    <Shard
      who={who}
      x={m.x + wag.dx}
      y={hover("shard", m.y + wag.dy, s)}
      scale={s}
      emotion="excited"
      // Turned back at Ray while waving, then away up its own path again.
      look={frame >= waveAt && frame < waveAt + WAVE_FOR ? { x: -0.5, y: 0.7 } : { x: 0.3, y: -0.5 }}
      zIndex={18}
    />
  );
};

/** The air the beam is crossing: hundreds of miles of it, drawn as a crowd. */
const AirCorridor: React.FC<{ t: number; density?: number; y?: number }> = ({
  t,
  density = 1,
  y: yMid = BEAM.y,
}) => (
  <WideLayer zIndex={10}>
    {Array.from({ length: Math.round(54 * density) }, (_, i) => {
      const k = i * 37;
      const x = BEAM.x0 - 300 + i * (86 / density) + ((k * 41) % 60);
      const y = yMid - 220 + ((k * 97) % 430);
      const r = 26 + ((k * 13) % 22);
      return (
        <AirBlob key={i} x={x} y={y} r={r} t={t} seed={i} opacity={0.42} />
      );
    })}
  </WideLayer>
);

/**
 * The beam behind the pack: a warm corridor of light that **loses its blue as
 * it goes**. Ahead of the pack there is nothing yet; behind it the trail is red
 * and orange only, and the further left you look the more blue it still has.
 */
const BeamTrail: React.FC<{ x0: number; x1: number; y: number; gone: number }> = ({
  x0,
  x1,
  y,
  gone,
}) => (
  <WideLayer zIndex={8}>
    <defs>
      <linearGradient id="a3-beam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={SPECTRUM[4].fill} stopOpacity={0.75} />
        <stop offset={String(0.18 + gone * 0.3)} stopColor={SPECTRUM[2].fill} stopOpacity={0.7} />
        <stop offset="1" stopColor={SPECTRUM[0].fill} stopOpacity={0.85} />
      </linearGradient>
    </defs>
    <rect x={x0} y={y - 34} width={Math.max(0, x1 - x0)} height={68} rx={34} fill="url(#a3-beam)" />
    <rect
      x={x0}
      y={y - 13}
      width={Math.max(0, x1 - x0)}
      height={26}
      rx={13}
      fill={kidTheme.sunLight}
      opacity={0.55}
    />
  </WideLayer>
);

/** The ring a bounce leaves on the puff it bounced off. */
const PingRing: React.FC<{
  at: number;
  frame: number;
  fps: number;
  p: { x: number; y: number };
  /**
   * Whose bounce it is. Defaults to blue, which is whose it usually is — but a
   * ring is a colour leaving a mark on the air it hit, so it wears that
   * colour, and a blue hoop round a yellow bounce says the wrong thing.
   */
  color?: number;
  /**
   * How big, 1 being the corridor's own size. Scenes inside a camera push
   * scale this **down**: at Scene 28b's 1.95× a default ring is a 450px hoop
   * lying across the volcano, which a still caught being read as a prop.
   */
  size?: number;
}> = ({ at, frame, fps, p, color = 4, size = 1 }) => {
  const u = (frame - at) / (fps * 0.7);
  if (u < 0 || u > 1) return null;
  return (
    <WideLayer zIndex={30}>
      <circle
        cx={p.x}
        cy={p.y}
        r={(40 + u * 190) * size}
        fill="none"
        stroke={SPECTRUM[color].light}
        strokeWidth={12 * (1 - u) * size}
        opacity={0.75 * (1 - u)}
      />
    </WideLayer>
  );
};

/**
 * The far end of the trip: an eye, and what actually gets there.
 *
 * Drawn friendly and large — this is the "you" the Narrator has been saying for
 * five minutes, and the last thing the beam does in the episode is arrive in
 * it. It warms as red and orange land, which is the sunset happening *in the
 * audience's own eye* rather than in the sky.
 */
const TheEye: React.FC<{ x: number; y: number; arrive: number }> = ({ x, y, arrive }) => {
  const frame = useCurrentFrame();
  const blink = Math.max(0, Math.sin(frame / 42) - 0.985) * 66;
  const open = 1 - Math.min(1, blink);
  return (
    <WideLayer zIndex={26}>
      <g transform={`translate(${x} ${y})`}>
        {/* The warm arriving in it. */}
        <ellipse rx={340} ry={240} fill={kidTheme.sunDark} opacity={0.17 * arrive} />
        <g transform={`scale(1 ${0.18 + 0.82 * open})`}>
          <path
            d="M -230 0 Q 0 -170 230 0 Q 0 170 -230 0 Z"
            fill={kidTheme.paper}
            stroke={kidTheme.ink}
            strokeWidth={12}
            strokeLinejoin="round"
          />
          <circle cx={0} cy={0} r={92} // Still a blue eye when the warm light lands in it: mixed any
            // further and the iris goes grey, which is the one colour the
            // scene is not allowed to end on.
            fill={mixHex("#2f7fd0", kidTheme.sunDark, 0.22 * arrive)} />
          <circle cx={0} cy={0} r={44} fill={kidTheme.ink} />
          <circle cx={-26} cy={-28} r={20} fill={kidTheme.paper} opacity={0.9} />
        </g>
        {/* Brow and two lashes, so it is somebody's eye and not an eyeball. */}
        <path
          d="M -220 -108 Q 0 -196 220 -108"
          stroke={kidTheme.ink}
          strokeWidth={16}
          strokeLinecap="round"
          fill="none"
        />
        <path d="M -196 -44 l -54 -34 M 196 -44 l 54 -34" stroke={kidTheme.ink} strokeWidth={13} strokeLinecap="round" />
      </g>
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 28b — THE SUNSET RACE, leg two: out over the sea
// ---------------------------------------------------------------------------
//
// Four left. The beam runs on, lower and warmer, out over open water — high
// air behind us, the last of the country sliding out of frame left, then
// nothing but sea. Green settles on a becalmed sailboat and Yellow lands on
// the sleeping volcano, and **the volcano opens one eye**.
//
// **The shot, and why it is built out of a scroll rather than a `Camera`.**
// Everything here is a distance: the puffs the beam is crossing are near, the
// sailboat is a way down, the coast is far, the island is on the horizon. A
// single camera transform gives all four the same parallax, which flattens a
// scene whose entire subject is how far away things are — and it makes it
// impossible to *guarantee* the island is in frame on every frame, which THE
// VOLCANO RULE requires. So the shot is one `scroll` number and a depth per
// layer, and the island's screen x is arithmetic I can read off rather than a
// transform I have to hope about.
//
// The scroll `cruise`s to a stop before the push-in starts, so the push has a
// fixed centre and nothing slides under it. Both are finished by the warn-off,
// and **the 45-frame held beat is on a completely locked-off frame**.

/** The beam, over the sea: low, warm, and above the waterline. */
const S28B_BEAM_Y = 424;
/** Where the four of them ride while the world scrolls past underneath. */
const S28B_PACK_X = 690;
/** Screen x of the island at the top of the shot, and where it settles. */
const S28B_ISLAND_X0 = 1616;
const S28B_ISLAND_X1 = 880;
/** How far the near world travels. Fixes the island's parallax at 0.30. */
const S28B_ISLAND_DEPTH = 0.3;
const S28B_SCROLL = (S28B_ISLAND_X0 - S28B_ISLAND_X1) / S28B_ISLAND_DEPTH;
/** Frames the world spends scrolling. */
const S28B_SCROLL_TO = 300;
/**
 * **The push is keyed to Yellow, not to a frame number.**
 *
 * It used to be frames 310→400, which was right for the leg as delivered and is
 * wrong now: revision2 adds Orange's play-by-play and Green's exit line ahead
 * of it and the scene is 314 frames longer, so a fixed 310 pushed the shot in
 * to 1.95× *during Green's sailboat beat* and left the frame at maximum zoom
 * for fourteen seconds. Hung off `yellowOut` it stays where it always was
 * relative to the picture — it starts as Yellow leaves the beam for the island
 * and is finished long before the warn-off, so the 45-frame eye beat is still
 * on a completely locked-off frame, which is the only thing that beat requires.
 */
const S28B_PUSH_LEAD = 20;
const S28B_PUSH_FRAMES = 90;

/**
 * **Where the becalmed sailboat ends up, and why it is 3266 rather than 1490.**
 *
 * The boat rides the deepest parallax layer in the shot (0.72), so the scroll
 * carries it 1,766px left — which is exactly right for a boat the beam passes
 * *over*, and which put it off the left of the frame by local frame 250. That
 * was fine when Green's whole beat was over by then; revision2 gives him a
 * second line and Yellow a cheer, so his beat now runs to local 476, and a
 * still had "I found one." landing on an empty sea with the tail pointing at
 * nothing. Started at 3266 it settles at **x ≈ 1500** when the scroll stops —
 * ahead of Green rather than behind him, so he peels off the beam *forwards*
 * onto it — and the push-in later carries it off the right of frame, which is
 * the camera leaving him behind rather than the character being deleted.
 */
const S28B_BOAT_X0 = 3266;
/**
 * **Yellow's glide, and the arithmetic that forces it.**
 *
 * Everybody on this beam walks at `RED_SPEED`, so a body that stays on it
 * leaves the right-hand edge about eleven seconds in (local frame ~400). Red
 * and Orange are supposed to (they walk off ahead, one body apart, having said
 * their piece by 305) — but revision2 keeps Yellow in the scene until local
 * 707, and her landing has to happen ON her line. So she leaves the beam before
 * the edge takes her and takes **280 frames** getting down to the island: a
 * long, lazy, waving drift across an emptying frame that lands under "A warm
 * rock!". It is the same descent it always was, played nine seconds slower,
 * and it is the only thing in the leg that is still moving while it happens.
 */
const YELLOW_GLIDE = 280;
/**
 * How hard the shot pushes in for the eye.
 *
 * The island is a *place*, so it stays at `VOLCANO_AT.scale` and the shot
 * moves instead — the rule Scenes 26 and 35 were built on. At 1.95× the
 * eyelid is about fifty pixels of frame, which is what it takes for "it opened
 * one eye" to be a thing a six-year-old sees rather than a thing they are told.
 */
const S28B_PUSH = 0.95;

const S28B_BUBBLES: Record<string, string> = {
  a3_14f_green: "This is a nice spot.",
  a3_14h_yellow: "A warm rock! A sit down!",
  // Orange's play-by-play: a flat recap, at walking pace, of events Red
  // personally attended.
  a3_14eb_orange: "Everybody went up.",
  a3_14ec_orange: "Red says he noticed.",
  // The start-line promise, kept.
  a3_14fb_green: "I found one.",
  a3_14fc_yellow: "Great sitting, Green!",
};

const RaceIslandScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const [seaFrom] = lineWindow(scene, "a3_14e_narrator");
  const [greenFrom] = lineWindow(scene, "a3_14f_green");
  const [sitFrom, sitTo] = heldBeat(scene, "a3_14f_green");
  const [settleFrom] = lineWindow(scene, "a3_14fb_green");
  const [yellowFrom] = lineWindow(scene, "a3_14h_yellow");
  const [warnFrom] = lineWindow(scene, "a3_14i_narrator");
  const [eyeFrom, eyeTo] = heldBeat(scene, "a3_14i_narrator");

  // --- the shot -------------------------------------------------------------
  const scroll = S28B_SCROLL * cruise(clamp01((frame - seaFrom) / Math.max(1, S28B_SCROLL_TO - seaFrom)));
  const at = (depth: number, x: number): number => x - scroll * depth;
  const islandX = at(S28B_ISLAND_DEPTH, S28B_ISLAND_X0);

  // Yellow leaves the beam 34 frames before her line, and the push starts 20
  // frames before that — see `S28B_PUSH_LEAD`.
  const pushFrom = yellowFrom - S28B_PUSH_LEAD - 70;
  const push = kidEase.easeInOutSine(clamp01((frame - pushFrom) / S28B_PUSH_FRAMES));
  // **The plate is never inside the camera** (the Scene 26 lesson): a `Camera`
  // translate slides an `AbsoluteFill` bodily and walks the painting off its
  // own edge. The plate does its own, much smaller, push and the horizon is
  // recomputed from the plate's live numbers, so the island's baseline stays
  // welded to the waterline through the whole move.
  const plateZoom = 1 + push * 0.1;
  const horizon = plateY(SEA_SUNSET_FRAC, { drift: SEA_DRIFT, zoom: plateZoom });
  const cam: Cam = {
    x: S28B_ISLAND_X1,
    y: horizon,
    zoom: 1 + push * S28B_PUSH,
    dx: (960 - S28B_ISLAND_X1) * push,
  };

  // --- the four of them, travelling ----------------------------------------
  //
  // They cross the sea leg without once changing direction, at Red's one speed,
  // and Red and Orange leave frame right — which is the whole point of them:
  // Red's law is one speed and a dead-straight line, and a scene that parks him
  // to keep him in shot has deleted the character. Orange is `orangeFollow` —
  // Red's own path, delayed by the time it takes Red to walk one body — so he
  // never overtakes. Green and Yellow ride the same file until they peel off,
  // so a still taken before either of them leaves shows four colours on a beam
  // rather than two travelling and two parked.
  const redPath = (tt: number) =>
    redWalk(tt, { x: S28B_PACK_X + packSlot(0).x, y: S28B_BEAM_Y });
  const secs = (f: number) => Math.max(0, f - seaFrom) / fps;
  const onBeam = (i: number, f: number): { x: number; y: number } => ({
    x: redPath(secs(f)).x + packSlot(i).x,
    y: S28B_BEAM_Y,
  });
  const red = redPath(secs(frame));
  const orange = orangeFollow(redPath, secs(frame), SHARD_BODY * 0.44);

  // --- THE EYE --------------------------------------------------------------
  //
  // Open over nine frames, hold, close, and a clear frame or two before Yellow
  // moves. **Nothing else enters this beat** — no line, no bubble, no rumble,
  // no music sting, no reaction from Yellow, from the Narrator or from anybody
  // else — so the eyelid is the only thing in the episode that is doing
  // anything different between the warn-off and the cut.
  //
  // `heldBeat` gives 59 frames here rather than the scripted 45, and that is
  // correct: `a3_14i_narrator` is the scene's LAST line, so its gap and the
  // scene's 14-frame tail are one continuous silence and `heldBeat` reports
  // both. The eye takes the first 78% of it and Yellow bounces off inside the
  // rest, which is script.md's shape ("the held beat above *is* this scene's
  // tail") expressed as a fraction so that a change to either number in
  // Video.tsx moves the staging with it instead of stranding it.
  const eyeSpan = Math.max(1, eyeTo - eyeFrom);
  const offAt = eyeFrom + Math.round(eyeSpan * 0.78);
  const eye =
    kidEase.easeInOutSine(clamp01((frame - eyeFrom) / 9)) -
    kidEase.easeInOutSine(clamp01((frame - (offAt - 12)) / 9));

  // --- GREEN, who sits down the instant anything stops moving ---------------
  //
  // The becalmed sailboat is the only thing in the episode that has already
  // stopped, so he is off the beam before the Narrator has finished the
  // sentence. The bounce arcs UP out of the beam first and comes down onto the
  // boom — he is not dropping out, he scattered like everybody else and just
  // took longer, which is what `a3_14g_narrator` says out loud.
  const boatX = at(0.72, S28B_BOAT_X0);
  const boatY = horizon + 168;
  const greenOut = greenFrom - 26;
  const greenU = clamp01((frame - greenOut) / 34);
  const greenBeam = onBeam(3, greenOut);
  const greenP =
    frame < greenOut
      ? { ...onBeam(3, frame), angle: 0 }
      : moveAlong(greenBeam, { x: boatX + 46, y: boatY - 48 }, greenU, {
          arc: -0.42,
          ease: kidEase.easeOutQuad,
        });
  // A held beat is automatically a Green joke — and this one is the beat that
  // *is* him: he sits, and he does not get up again.
  const sit = greenSit(frame, sitFrom, frame >= sitFrom);

  // --- YELLOW, who has spotted a warm rock ---------------------------------
  const craterY = horizon - VOLCANO.h * VOLCANO_AT.scale;
  const yellowOut = yellowFrom - YELLOW_GLIDE;
  const yellowU = kidEase.easeInOutSine(clamp01((frame - yellowOut) / YELLOW_GLIDE));
  const yellowBeam = onBeam(2, yellowOut);
  const yellowSeat = { x: islandX + 30, y: craterY - 2 };
  const yellowDown =
    frame < yellowOut
      ? { ...onBeam(2, frame), angle: 0 }
      : moveAlong(yellowBeam, yellowSeat, yellowU, {
          arc: -0.3,
          ease: kidEase.easeOutQuad,
        });
  // …and the apologetic bounce off, **inside the tail**, in silence: a crouch
  // and a spring, up after the others. Six frames of anticipation is what makes
  // it read as a bounce rather than as a character being deleted.
  const offAge = frame - offAt;
  const offU = clamp01(offAge / Math.max(1, scene.durationInFrames - offAt));
  // 180 world px, which at this shot's 1.95× is 350 of frame — a bounce, not a
  // launch. A first pass used the 620 that reads right in an un-pushed shot and
  // put him through the top of frame in four frames flat, i.e. deleted him.
  // `easeOutQuad`, because a bounce is fast at the bottom and slowing at the
  // top; `easeInQuad` is what a rocket does.
  const yellowUp = moveAlong(yellowSeat, { x: yellowSeat.x + 54, y: yellowSeat.y - 180 }, offU, {
    arc: 0.2,
    ease: kidEase.easeOutQuad,
  });
  const crouch = offAge >= 0 && offAge < 6 ? kidEase.easeOutQuad(offAge / 6) * 16 : 0;
  const yellowP =
    offAge < 0
      ? yellowDown
      : offAge < 6
        ? { x: yellowSeat.x, y: yellowSeat.y + crouch, angle: 0 }
        : yellowUp;

  const stage = useStage(scene);

  // --- ORANGE, translating a silence at walking pace -----------------------
  //
  // He is one body behind Red for the whole leg and he never once looks at the
  // person he is talking about — `orangeFollow` is doing the characterisation
  // and the only thing this adds is a mouth and two bubbles.
  const orangeMark: Mark = {
    x: orange.x,
    y: hover("shard", orange.y, 0.44),
    scale: 0.44,
    who: "shard",
    side: "left",
  };

  const greenMark: Mark = {
    x: greenP.x,
    y: hover("shard", greenP.y, 0.4),
    scale: 0.4,
    who: "shard",
    side: "left",
  };
  const yellowMark: Mark = {
    x: yellowP.x,
    y: hover("shard", yellowP.y, 0.34),
    scale: 0.34,
    who: "shard",
    side: "right",
  };

  return (
    <AbsoluteFill style={{ background: kidTheme.sunsetLow, overflow: "hidden" }}>
      <PaintedSky bg="sea_sunset" phase={2.7} drift={SEA_DRIFT} zoom={plateZoom} />

      {/* The blue three colours have already become, still up at the top of the
          frame where they left it in Scene 28. It does not grow here: nobody
          bounces UP in this scene until Yellow does, inside the tail. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(58,160,236,0.5) 0%, rgba(58,160,236,0.2) 26%, rgba(58,160,236,0) 48%)",
          pointerEvents: "none",
        }}
      />

      <Camera cam={cam}>
        {/* THE LAST OF THE COUNTRY, going. A backlit headland on the waterline
            that is out of frame inside three seconds — the leg change, drawn,
            with nothing said about it. */}
        <Coast x={at(0.45, 300)} horizon={horizon} />

        {/* THE VOLCANO. On the measured horizon, in frame from the first frame
            of the scene to the last, and never named. */}
        <SleepingVolcano
          x={islandX}
          base={horizon}
          scale={VOLCANO_AT.scale}
          phase={0.55}
          eye={eye}
        />

        <Sailboat x={boatX} y={boatY} />

        {/* The air, thinning out over the water. */}
        <AirCorridor t={t + scroll * 0.0004} density={0.55} y={S28B_BEAM_Y} />
        <WideLayer zIndex={12}>
          {/* The beam itself. It is longer than the frame in both directions,
              so it is drawn once and does not scroll — what shows the travel is
              the air going past it. */}
          <rect
            x={-1400}
            y={S28B_BEAM_Y - 23}
            width={4600}
            height={46}
            rx={23}
            fill={SPECTRUM[0].fill}
            opacity={0.62}
          />
          <rect
            x={-1400}
            y={S28B_BEAM_Y - 8}
            width={4600}
            height={16}
            rx={8}
            fill={kidTheme.sunLight}
            opacity={0.72}
          />
        </WideLayer>

        <Shard
          who="red"
          x={red.x}
          y={hover("shard", red.y, 0.44)}
          scale={0.44}
          heading={red.angle}
          look={{ x: 0.6, y: 0 }}
          zIndex={24}
        />
        <Shard
          who="orange"
          x={orange.x}
          y={hover("shard", orange.y, 0.44)}
          scale={0.44}
          heading={orange.angle}
          // Straight down the course, exactly like the man in front of him.
          // He is describing Red without looking at Red, which is the joke.
          look={{ x: 0.6, y: 0 }}
          speaking={stage.speaking("orange")}
          zIndex={25}
        />
        <Shard
          who="green"
          x={greenP.x}
          y={hover("shard", greenP.y, 0.4)}
          scale={0.4}
          heading={greenU < 1 ? greenP.angle : 0}
          sit={sit}
          // **"Eyes closing" is staged as stillness, because the kit has no
          // lid control on `<Shard>`** — `lidBase` lives inside the rig's
          // emotion record and nothing exposes it (kit gap, reported). What is
          // available is everything else that says *settled*: the sit, the idle
          // damped to a quarter, the saccades switched off (`eyeLife={0}`) and
          // the eyes down at the boat rather than out at the course. From
          // `a3_14fb_green` — "I found one." — he does not move again.
          look={greenU < 1 ? { x: 0.2, y: 0.6 } : { x: 0.25, y: 0.45 }}
          idle={frame >= settleFrom ? 0.25 : undefined}
          eyeLife={frame >= settleFrom ? 0 : undefined}
          speaking={stage.speaking("green")}
          zIndex={26}
        />
        <Shard
          who="yellow"
          x={yellowP.x}
          y={hover("shard", yellowP.y, 0.34)}
          scale={0.34}
          heading={yellowP.angle}
          // He is still waving through the whole beat, and that is not
          // something entering it — it is the one thing about him that is true
          // on every frame he has ever been in. A Yellow who stopped waving to
          // watch an eyelid would be a reaction, which is the one thing the
          // beat is not allowed to contain.
          look={{ x: -0.3, y: 0.1 }}
          speaking={stage.speaking("yellow")}
          zIndex={27}
        />
        {/* The ping Green's bounce and Yellow's bounce leave on the air. */}
        <PingRing at={greenOut} frame={frame} fps={fps} p={greenBeam} color={3} size={0.72} />
        <PingRing at={yellowOut} frame={frame} fps={fps} p={yellowBeam} color={2} size={0.72} />
        <PingRing at={offAt + 6} frame={frame} fps={fps} p={yellowSeat} color={2} size={0.34} />
      </Camera>

      <Bubbles
        scene={scene}
        cast={
          {
            green: {
              ...greenMark,
              x: (greenMark.x - cam.x) * (cam.zoom ?? 1) + cam.x + (cam.dx ?? 0),
              y: (greenMark.y - cam.y) * (cam.zoom ?? 1) + cam.y,
            },
            yellow: {
              ...yellowMark,
              x: (yellowMark.x - cam.x) * (cam.zoom ?? 1) + cam.x + (cam.dx ?? 0),
              y: (yellowMark.y - cam.y) * (cam.zoom ?? 1) + cam.y,
            },
            orange: {
              ...orangeMark,
              x: (orangeMark.x - cam.x) * (cam.zoom ?? 1) + cam.x + (cam.dx ?? 0),
              y: (orangeMark.y - cam.y) * (cam.zoom ?? 1) + cam.y,
            },
          } as Cast
        }
        text={S28B_BUBBLES}
        at={{
          // Orange walks left to right under a beam that fills the top third,
          // so both of his go up into the clear sky above it with the tail
          // following him along. They land before the push, so the camera is
          // still at 1× and the two coordinate systems agree.
          a3_14eb_orange: {
            x: 700,
            y: 214,
            tail: "right",
            tailAt: (orangeMark.x - cam.x) * (cam.zoom ?? 1) + cam.x + (cam.dx ?? 0),
          },
          a3_14ec_orange: {
            x: 700,
            y: 214,
            tail: "right",
            tailAt: (orangeMark.x - cam.x) * (cam.zoom ?? 1) + cam.x + (cam.dx ?? 0),
          },
          // Green's second line comes from the same place as his first — he has
          // sat down and he is not getting up, so the bubble does not move
          // either. Yellow cheers his sitting from up on the beam.
          a3_14fb_green: { x: 880, y: 700, tail: "right", tailAt: boatX },
          // High and left of her glide, so the tail reaches down-right at a
          // body that is still drifting — and so the box never crosses the
          // island, which has to stay unobstructed as well as continuous.
          a3_14fc_yellow: {
            x: 560,
            y: 176,
            tail: "right",
            tailAt: (yellowMark.x - cam.x) * (cam.zoom ?? 1) + cam.x + (cam.dx ?? 0),
          },
          // **Left of the boat, not over it.** The boat now settles at x≈1500
          // (see `S28B_BOAT_X0`), and a bubble centred on 1330 sat on top of
          // the character it belonged to — Green invisible behind his own line,
          // twice. From 880 the tail reaches right at him across clear water,
          // and the box stays clear of the island above it.
          a3_14f_green: { x: 880, y: 700, tail: "right", tailAt: boatX },
          a3_14h_yellow: {
            x: 620,
            y: 250,
            tail: "left",
            tailAt: (yellowSeat.x - cam.x) * (cam.zoom ?? 1) + cam.x + (cam.dx ?? 0),
          },
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * The last of the country: a low backlit headland lying on the waterline, with
 * three fields on it that are barely more than a value change.
 *
 * Drawn rather than painted, because it has to *move* — it is the leg change,
 * and a plate cannot slide out of its own frame. It is dark and warm rather
 * than green for the same reason the island is: everything on this horizon is
 * between the audience and a sun that is on the floor.
 */
const Coast: React.FC<{ x: number; horizon: number }> = ({ x, horizon }) => (
  <WideLayer zIndex={7}>
    <g transform={`translate(${x} ${horizon})`} opacity={0.9}>
      <path
        d={
          "M -1900 0 L -1900 -34 Q -1500 -66 -1120 -48 Q -820 -34 -560 -62" +
          " Q -300 -88 -120 -52 Q -40 -36 0 -8 Z"
        }
        fill={mixHex(VOLCANO_BODY, kidTheme.sunDeep, 0.1)}
      />
      <path
        d="M -1900 -34 Q -1500 -66 -1120 -48 Q -820 -34 -560 -62 Q -300 -88 -120 -52"
        fill="none"
        stroke={kidTheme.sunLight}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.5}
      />
      <ellipse cx={-300} cy={2} rx={1600} ry={7} fill={kidTheme.ink} opacity={0.14} />
    </g>
  </WideLayer>
);

/**
 * A becalmed sailboat: dead still on flat water, with the sail hanging off the
 * boom because there is no wind in it at all.
 *
 * It is SVG rather than paint because Green sits on it — anything a character
 * touches stays drawn (STYLE.md). It does not bob: the entire reason it is in
 * the episode is that it is the one thing that has stopped moving, which is
 * what makes Green sit down.
 */
export const Sailboat: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  // 1 in Scene 28b, where it is drawn at the distance it was designed for.
  // Scene 28b2 is further along the leg and looking back at it, so it takes
  // the same boat smaller rather than a second drawing of one.
  scale = 1,
}) => (
  <WideLayer zIndex={11}>
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={16} rx={112} ry={11} fill={kidTheme.ink} opacity={0.16} />
      {/* Hull. */}
      <path
        d="M -86 -2 L 86 -2 Q 62 26 0 30 Q -62 26 -86 -2 Z"
        fill={mixHex(kidTheme.ink, kidTheme.sunDeep, 0.34)}
        stroke={kidTheme.ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      {/* Mast and boom. */}
      <path d="M -6 -4 L -6 -126" stroke={kidTheme.ink} strokeWidth={8} strokeLinecap="round" />
      <path d="M -14 -34 L 74 -30" stroke={kidTheme.ink} strokeWidth={7} strokeLinecap="round" />
      {/* The sail, hanging. Slack, folded twice, and going nowhere. */}
      <path
        d="M -2 -122 Q 26 -96 22 -62 Q 18 -40 34 -32 L -2 -34 Z"
        fill={mixHex(kidTheme.paper, kidTheme.sunLight, 0.4)}
        stroke={kidTheme.ink}
        strokeWidth={4}
        strokeLinejoin="round"
        opacity={0.92}
      />
    </g>
  </WideLayer>
);

// ---------------------------------------------------------------------------
// Scene 28c — THE SUNSET RACE, the finish line
// ---------------------------------------------------------------------------
//
// Two shots and one dissolve between them.
//
//   the corridor  the far end of the beam and the eye it lands in — the
//                 delivered cut's pedagogy beat, kept, at the race's finish
//                 line — with Red and Orange, the only two left, walking it.
//   the wide      a warm, almost empty frame: sea horizon low, sky orange, the
//                 volcano asleep on it, and **nothing else in the shot**. Red
//                 walks out of the end of the beam at exactly the speed he has
//                 walked at all episode and keeps walking, left to right, for
//                 the rest of the scene.
//
// **THE TONE GUARDRAIL LIVES IN THIS SCENE, and it is the one this episode is
// most at risk of breaking:** *the sunset must never read as the light dying.*
// So there is nothing here that fades, dims, cools or closes. The sky does not
// darken across the shot — it gets a shade *warmer* under `a3_18f_narrator`,
// because the Narrator's last line is about anticipation. There is no
// vignette, no dusk wash, no music, and Red never slows down. He is delighted,
// in his own flat way, he is not alone (Orange is right there), and he is
// still walking when the scene cuts.
//
// Four held beats — 36/30/45/20 — and **nothing enters any of them**. What is
// already on screen keeps doing what it was doing: two colours walking at one
// speed and an island snoring on the horizon. That is not something entering a
// beat, it is the beat.

/** Where the beam ends and Red comes out of it, in the wide shot. */
const S28C_BEAM_END = 150;
/**
 * **THREE SHOTS NOW, AND THE MIDDLE ONE IS WHY.**
 *
 * The delivered scene was two shots either side of one 48-frame dissolve: the
 * corridor and its eye, then the wide, empty, orange frame that carries the
 * landing block. revision2 inserts nine seconds of comedy between them — the
 * finish happening TO Red — and it cannot go in either of them:
 *
 *   in the corridor  Red walks into the eye. He crosses x=1160 (its left lash)
 *                    about 130 frames after `a3_18_narrator` ends and would
 *                    spend Orange's whole climax standing in somebody's pupil.
 *   in the wide      the landing block needs him entering at the beam-end and
 *                    still on screen 500 frames later. At `RED_SPEED` that is
 *                    1,800px and the frame is 1,920, so the block *exactly*
 *                    fills the shot — there is no room in front of it for
 *                    another 390 frames of walking, which is 1,400px more.
 *
 * So the finish gets its own framing: a **closer** wide, dissolved to on the
 * last pedagogy line, where Red walks out of the end of the beam under "Red!
 * You won!" and Orange has his climax one body behind him. The landing block
 * then **hard-cuts** to the shipped wide, which is otherwise completely
 * unchanged — same `wideFrom`, same `walkFrom`, same path, same beam-end, same
 * volcano — and the pull-back reads as exactly what the Narrator says over it:
 * "At the end of all that air…".
 *
 * **The second transition is a CUT and the first one is a dissolve, and the
 * difference is what each one has to claim** (showrunner call, 2026-08-03).
 * Red is further along the beam in the closer shot than in the wider one that
 * follows it. A dissolve asserts spatial continuity between its two framings,
 * so a 30-frame cross-fade drew Red visibly sliding *backwards* through the
 * mix — the one thing the shot cannot afford, in the scene whose whole subject
 * is that he never stops and never changes speed. A cut asserts nothing: two
 * framings, no claim about where the second one's camera was standing, and the
 * audience simply accepts the wider vantage. The corridor -> finish dissolve
 * stays, because those two agree about where he is.
 */
const S28C_FINISH_DISSOLVE = 20;
/** The finish shot: closer plate, lower beam, bigger Red. `pan` is the wide
 * shot's own pan plus 40 — see `S28C_PAN`, declared below it. */
const S28C_FINISH = { panExtra: 40, zoom: 1.2, beamY: 560, beamEnd: 460, scale: 0.9 };
/** Where Ray watches the finish from. Frame right, high, out of Red's lane. */
const S28C_FINISH_RAY = { x: 1500, y: 214, scale: 0.5 };
/** The dissolve out of the corridor, keyed to `a3_18b_narrator`. */
const S28C_DISSOLVE = 48;
/** How much of the frame Red is. Big: it is his scene and the sky is empty. */
const S28C_RED_SCALE = 0.8;
/** The wide shot's plate pan, which puts the horizon low and the sky huge. */
const S28C_PAN = 176;

const S28C_BUBBLES: Record<string, string> = {
  a3_15_ray: "So who is left?",
  a3_17_ray: "The calm ones.",
  a3_18c_red: "Everybody bounced off.",
  a3_18d_red: "Peace and quiet.",
  a3_18e_orange: "What Red said.",
  // --- the finish (revision2) ---------------------------------------------
  a3_18a_ray: "Red! You won!",
  // The bookend of "Start of what." — a full stop, not a question mark, in the
  // read and on the drawn word.
  a3_18ab_red: "Won what.",
  a3_18ac_orange: "I came second!",
  a3_18ad_orange: "Second is right behind Red!",
};

const RedArrivesScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const [, landTo] = lineWindow(scene, "a3_18_narrator");
  const [finishFrom] = lineWindow(scene, "a3_18a_ray");
  const [wideFrom] = lineWindow(scene, "a3_18b_narrator");
  const [warmFrom] = lineWindow(scene, "a3_18f_narrator");

  // --- shot one: the corridor, locked off ----------------------------------
  //
  // We have arrived: the camera does not track here, the last of the light
  // does. Red walks in from frame left at his own speed and Orange comes out
  // of the air one body-length later, which is what `a3_16_narrator` at 0.92
  // buys — "red and orange land separately".
  const eyeX = 1500;
  const nearRedPath = (tt: number) => redWalk(tt, { x: -420, y: 566 });
  const nearRed = nearRedPath(t);
  const nearOrange = orangeFollow(nearRedPath, t, SHARD_BODY * 0.62);
  const arrive = clamp01((frame - landTo + 62) / 44);

  // --- the dissolve, and the cut --------------------------------------------
  //
  // Corridor -> finish DISSOLVES on the last pedagogy line; finish -> the
  // shipped wide is a HARD CUT on the first frame of `a3_18b_narrator`. See
  // `S28C_FINISH_DISSOLVE` for why there are three shots in this scene and why
  // only the first join is a mix.
  const finishEase = kidEase.easeInOutSine(clamp01((frame - landTo) / S28C_FINISH_DISSOLVE));
  const wideEase = frame >= wideFrom ? 1 : 0;

  // --- shot two: the finish, closer ----------------------------------------
  //
  // Red walks out of the end of the beam at the speed he has walked at all
  // episode, and the finish happens *to* him. The arithmetic picks his start,
  // as ever: he crosses the beam's tip on the middle frame of "Red! You won!"
  // and is still walking, on screen, when the shot dissolves away 380 frames
  // later. Orange is `orangeFollow` at this shot's scale, so he is one drawn
  // body behind and cannot overtake.
  const finishHorizon = plateY(SEA_SUNSET_FRAC, {
    drift: SEA_DRIFT,
    dy: S28C_PAN + S28C_FINISH.panExtra,
    zoom: S28C_FINISH.zoom,
  });
  const finishPath = (tt: number) => redWalk(tt, { x: -100, y: S28C_FINISH.beamY });
  const finishWalkFrom =
    finishFrom + 30 - ((S28C_FINISH.beamEnd + 100) / RED_SPEED) * fps;
  const finishT = Math.max(0, frame - finishWalkFrom) / fps;
  const finishRed = finishPath(finishT);
  const finishOrange = orangeFollow(finishPath, finishT, SHARD_BODY * S28C_FINISH.scale);

  // --- shot two: the wide, empty, orange one --------------------------------
  const horizon = plateY(SEA_SUNSET_FRAC, { drift: SEA_DRIFT, dy: S28C_PAN });
  const walkFrom = wideFrom + 8;
  const widePath = (tt: number) => redWalk(tt, { x: S28C_BEAM_END - 290, y: 430 });
  const wideT = Math.max(0, frame - walkFrom) / fps;
  const red = widePath(wideT);
  const orange = orangeFollow(widePath, wideT, SHARD_BODY * S28C_RED_SCALE);
  // The Narrator's last line is about anticipation, not loss, so the frame
  // gets *warmer* under it. The one direction this shot is allowed to move.
  const warm = clamp01((frame - warmFrom) / 40);

  const stage = useStage(scene);
  const rayEmotion = useEmotion(scene, "ray", { a3_15_ray: "amazed" }, "happy", NO_LEAD);

  // 392, not 340. His bubbles are clamped to y>=170 by `Bubbles`, so at 340 the
  // tail spike came off the bubble's underside and ended *inside his own glow* —
  // a black spike through the speaker's face. 52px of clearance is enough for
  // the tail to read as a tail, and he is still well above the beam at y=534.
  const rayMark: Mark = { x: 470, y: hover("ray", 392, 0.62), scale: 0.62, who: "ray", side: "right" };
  const redMark: Mark = {
    x: red.x,
    y: hover("shard", red.y, S28C_RED_SCALE),
    scale: S28C_RED_SCALE,
    who: "shard",
    side: "right",
  };
  const orangeMark: Mark = {
    x: orange.x,
    y: hover("shard", orange.y, S28C_RED_SCALE),
    scale: S28C_RED_SCALE,
    who: "shard",
    side: "right",
  };

  return (
    <AbsoluteFill style={{ background: kidTheme.sunsetLow, overflow: "hidden" }}>
      {/* --- shot one ------------------------------------------------------ */}
      {/* `isolation: "isolate"` on all three shots, and it is a BUG FIX rather
          than tidiness. `opacity: 1` does **not** create a stacking context (only
          a value below 1 does), so the moment a shot's cross-fade completed, its
          own children's z-indices escaped into the scene's root context and
          competed with the *next* shot's. A still of the landing block caught
          exactly that: the finish shot's beam (`zIndex 9`) and the finish
          shot's RAY (`zIndex 40`) were both painted on top of the wide shot's
          plate — a second red-orange beam stub at frame left ending 300px away
          from the real one, and a character who is deliberately not in the
          landing block at all. Isolating each shot keeps every z-index local to
          the shot that owns it and leaves the ordering between shots to DOM
          order, which is what the three-shot structure always meant. Nothing
          about the dissolves changes: a shot mid-fade was already its own
          stacking context. */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - finishEase, isolation: "isolate" }}>
        <PaintedSky bg="sky_dome_day" phase={6.1} drift={8} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(255,120,54,0.66) 0%, rgba(255,158,60,0.72) 46%, rgba(255,196,64,0.66) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* The blue that left, still up there. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(58,160,236,0.52) 0%, rgba(58,160,236,0.22) 26%, rgba(58,160,236,0) 48%)",
            pointerEvents: "none",
          }}
        />
        <AirCorridor t={t} density={0.4} y={566} />
        <WideLayer zIndex={12}>
          {/* The last of the beam, running out of the air and into the eye. Red
              and orange only: the blue end of it went two scenes ago. */}
          <rect x={-1400} y={534} width={1500 + eyeX - 300} height={64} rx={32} fill={SPECTRUM[0].fill} opacity={0.55} />
          <rect x={-1400} y={554} width={1500 + eyeX - 300} height={24} rx={12} fill={kidTheme.sunLight} opacity={0.55} />
        </WideLayer>
        <TheEye x={eyeX} y={566} arrive={arrive} />
        <Shard
          who="red"
          x={nearRed.x}
          y={hover("shard", nearRed.y, 0.62)}
          scale={0.62}
          heading={nearRed.angle}
          look={{ x: 0.6, y: 0 }}
          zIndex={30}
        />
        <Shard
          who="orange"
          x={nearOrange.x}
          y={hover("shard", nearOrange.y, 0.62)}
          scale={0.62}
          heading={nearOrange.angle}
          look={{ x: 0.6, y: 0 }}
          zIndex={29}
        />
        <Ray
          x={rayMark.x}
          y={rayMark.y}
          scale={0.62}
          brightness={RAY_LIGHT.full}
          spectrum={RAY_SPECTRUM.afterRainbow}
          phase={PHASE.ray}
          emotion={rayEmotion}
          speaking={stage.speaking("ray")}
          look={{ x: 0.3, y: 0.55 }}
          streak={0.5}
          bank={-3}
          zIndex={40}
        />
      </div>

      {/* --- shot two: THE FINISH ------------------------------------------ */}
      <div style={{ position: "absolute", inset: 0, opacity: finishEase, isolation: "isolate" }}>
        <PaintedSky
          bg="sea_sunset"
          phase={7.8}
          drift={SEA_DRIFT}
          dy={S28C_PAN + S28C_FINISH.panExtra}
          zoom={S28C_FINISH.zoom}
        />
        {/* The blue that left, still up there. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(58,160,236,0.5) 0%, rgba(58,160,236,0.2) 24%, rgba(58,160,236,0) 44%)",
            pointerEvents: "none",
          }}
        />
        {/* THE VOLCANO, asleep on this shot's own measured horizon, in frame
            from the first frame of the shot to the last, and unmentioned. It is
            a place: same x, same scale, only the horizon changes. */}
        <SleepingVolcano
          x={VOLCANO_AT.x}
          base={finishHorizon}
          scale={VOLCANO_AT.scale}
          phase={0.62}
        />
        <SideLight horizon={finishHorizon} strength={0.44} />
        {/* The end of the beam. Red walks out of it. */}
        <WideLayer zIndex={9}>
          <rect
            x={-900}
            y={S28C_FINISH.beamY - 58}
            width={900 + S28C_FINISH.beamEnd}
            height={116}
            rx={58}
            fill="url(#a3-beamend)"
          />
          <rect
            x={-900}
            y={S28C_FINISH.beamY - 19}
            width={900 + S28C_FINISH.beamEnd}
            height={38}
            rx={19}
            fill="url(#a3-beamendcore)"
          />
        </WideLayer>
        <SoftShade
          x={finishRed.x}
          y={finishRed.y}
          rx={520}
          ry={330}
          strength={0.13}
          color="92,38,42"
        />
        <Shard
          who="red"
          x={finishRed.x}
          y={hover("shard", finishRed.y, S28C_FINISH.scale)}
          scale={S28C_FINISH.scale}
          heading={finishRed.angle}
          // He does not look at the person telling him he won, and he does not
          // look back at the two hundred miles of air either.
          look={{ x: 0.45, y: 0 }}
          speaking={stage.speaking("red")}
          zIndex={30}
        />
        <Shard
          who="orange"
          x={finishOrange.x}
          y={hover("shard", finishOrange.y, S28C_FINISH.scale)}
          scale={S28C_FINISH.scale}
          heading={finishOrange.angle}
          // Thrilled, and still not looking at him. Second place is where he
          // lives and nobody corrects him.
          look={{ x: 0.45, y: 0 }}
          speaking={stage.speaking("orange")}
          zIndex={29}
        />
        <Ray
          x={S28C_FINISH_RAY.x}
          y={hover("ray", S28C_FINISH_RAY.y, S28C_FINISH_RAY.scale)}
          scale={S28C_FINISH_RAY.scale}
          brightness={RAY_LIGHT.full}
          spectrum={RAY_SPECTRUM.afterRainbow}
          phase={PHASE.ray}
          emotion={rayEmotion}
          speaking={stage.speaking("ray")}
          look={{ x: -0.5, y: 0.6 }}
          streak={0.4}
          bank={-3}
          zIndex={40}
        />
      </div>

      {/* --- shot three: the wide, empty, orange one ----------------------- */}
      <div style={{ position: "absolute", inset: 0, opacity: wideEase, isolation: "isolate" }}>
        <PaintedSky bg="sea_sunset" phase={9.4} drift={SEA_DRIFT} dy={S28C_PAN} />
        {/* Warmer, not darker. See the tone guardrail above. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, rgba(255,176,72,${0.1 + 0.1 * warm}) 0%, rgba(255,152,64,${0.06 + 0.1 * warm}) 60%, rgba(255,196,96,${0.04 + 0.08 * warm}) 100%)`,
            pointerEvents: "none",
          }}
        />
        {/* THE VOLCANO, asleep on the measured horizon, in frame from the first
            frame of this shot to the last, and unmentioned. */}
        <SleepingVolcano x={VOLCANO_AT.x} base={horizon} scale={VOLCANO_AT.scale} phase={0.7} />
        <SideLight horizon={horizon} strength={0.5} />
        {/* The end of the beam, at frame left: two hundred miles of air, and
            this is where it stops. Red walks out of it. */}
        <WideLayer zIndex={9}>
          {/* The gradient runs opaque for most of its length and feathers only
              the last fifth. A first pass ramped it from the left-hand edge, so
              the only part of it that was ever on screen was the tail end at
              ten per cent alpha — red on orange, invisible, and the shot lost
              the thing Red is walking out of. */}
          <defs>
            <linearGradient id="a3-beamend" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={SPECTRUM[0].fill} stopOpacity={0.88} />
              <stop offset="0.9" stopColor={SPECTRUM[0].fill} stopOpacity={0.84} />
              <stop offset="1" stopColor={SPECTRUM[0].fill} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="a3-beamendcore" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={kidTheme.sunLight} stopOpacity={0.85} />
              <stop offset="0.88" stopColor={kidTheme.sunLight} stopOpacity={0.8} />
              <stop offset="1" stopColor={kidTheme.sunLight} stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect x={-900} y={430 - 52} width={900 + S28C_BEAM_END} height={104} rx={52} fill="url(#a3-beamend)" />
          <rect x={-900} y={430 - 17} width={900 + S28C_BEAM_END} height={34} rx={17} fill="url(#a3-beamendcore)" />
        </WideLayer>
        {/* Red is warm-on-warm, which is the Ray legibility problem wearing a
            different hue. Shade behind him rather than a different Red.
            **0.13, not the 0.2 the first pass used**: this shot is a wide,
            clean, empty orange frame and at 0.2 a 1040×660 shade travelling
            across it reads as a stain on the sky rather than as air. Red's own
            pale edge is carrying most of the legibility; this is the last few
            per cent of it. */}
        <SoftShade x={red.x} y={red.y} rx={520} ry={330} strength={0.13} color="92,38,42" />
        <Shard
          who="red"
          x={red.x}
          y={hover("shard", red.y, S28C_RED_SCALE)}
          scale={S28C_RED_SCALE}
          heading={red.angle}
          look={{ x: 0.45, y: 0 }}
          speaking={stage.speaking("red")}
          zIndex={30}
        />
        <Shard
          who="orange"
          x={orange.x}
          y={hover("shard", orange.y, S28C_RED_SCALE)}
          scale={S28C_RED_SCALE}
          heading={orange.angle}
          // He never looks at Red and Red never looks at him. Deadpan is
          // stillness, and two characters checking each other's faces after the
          // funniest line in the act would be selling it.
          look={{ x: 0.45, y: 0 }}
          speaking={stage.speaking("orange")}
          zIndex={29}
        />
      </div>

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark, red: redMark, orange: orangeMark } as Cast}
        text={S28C_BUBBLES}
        at={{
          a3_15_ray: { x: 520, y: 176, tail: "left", tailAt: rayMark.x },
          a3_17_ray: { x: 520, y: 176, tail: "left", tailAt: rayMark.x },
          // --- the finish, in shot two --------------------------------------
          //
          // Every one of these is placed against the FINISH shot's geometry
          // rather than the cast marks above, which are the wide shot's: Ray is
          // up at frame right there, Red is walking out of a beam whose tip is
          // at 460, and Orange is one drawn body behind him. `Bubbles` takes
          // one mark per speaker, so a scene with two framings places the
          // second one's bubbles by hand.
          a3_18a_ray: { x: 1060, y: 214, tail: "right", tailAt: S28C_FINISH_RAY.x },
          a3_18ab_red: { x: 1000, y: 214, tail: "left", tailAt: finishRed.x },
          a3_18ac_orange: { x: 520, y: 348, tail: "right", tailAt: finishOrange.x },
          a3_18ad_orange: { x: 520, y: 348, tail: "right", tailAt: finishOrange.x },
          a3_18c_red: { y: 214, tail: "left", tailAt: red.x },
          a3_18d_red: { y: 214, tail: "left", tailAt: red.x },
          // Over on his own side, above him, and the same height as Red's — the
          // double act says the same thing from the same place, one body-length
          // and one beat apart. A first pass hung it BELOW them, which points a
          // tail at the sea.
          a3_18e_orange: { x: orange.x - 340, y: 214, tail: "right", tailAt: orange.x },
        }}
      />
    </AbsoluteFill>
  );
};
// ---------------------------------------------------------------------------
// Scene 29 — Big Word Three: SUNSET
// ---------------------------------------------------------------------------

// Higher than the house 300. Three things want the middle of this frame — the
// card, Sunny's bubble and Sunny's own rays — and the script says which of them
// wins where: "Sunny, half sunk behind the sea, leans on the bottom of the
// card." So the card goes up until its bottom edge is where his rays reach, and
// the strip between it and the waterline is left free for the bubble.
const S29_CARD_Y = 250;
/** Perches on the card, hand-tuned against a still at 1920×1080. */
// Measured off a still of the split, not guessed: the two blocks land at
// roughly x=795 and x=1135 with their top edge at y≈241, and `y` here is Ray's
// *middle*, so it is that edge minus his own half-height at `S29_PERCH`. The
// first pass had him sunk to the waist in the "Set" block.
const S29_SUN_BLOCK = { x: 795, y: 120 };
const S29_SET_BLOCK = { x: 1135, y: 116 };
const S29_PERCH = 0.34;

const S29_BUBBLES: Record<string, string> = {
  a3_22_sunny: "I do this ON PURPOSE!",
  // **The episode's one line of sound on the walk-behind** (revision2, audit
  // finding #7: an inaudible stage joke is not a joke). The actual sunset
  // reviews the show about him, passing, not stopping, not looking — and it is
  // the "Lovely air." shape, which feeds `rc_04b_red` in the recap.
  //
  // **REWRITTEN 2026-08-05 (T7b).** It was "Nice drama." and Mike's ear killed
  // it twice — first for an epenthetic "Nice-eh drama" (T7, re-rolled, same
  // break), then on the re-roll: *"22b red is still weird. Something about that
  // phrase and voice doesn't work. Maybe rewrite that one line."* The fault was
  // the phrase, not the draw. Same joke, an onset Patient_Man can start on.
  //
  // **The line break is deliberate**, and it is the only one in the episode.
  // `SpeechBubble` lays out with `white-space: pre-wrap`, so this renders as two
  // stacked words in a ~330px box instead of one ~575px box — see the placement
  // note below for why 575 does not fit.
  a3_22b_red: "Very\ndramatic.",
};

/**
 * **The episode's last free joke** (revision §6.15, wave-2 C2): Red walks
 * *behind* the SUNSET card and out the far side of it while Sunny takes credit
 * for the sunset, at exactly his one speed, without looking at either of them.
 * Orange follows one drawn body-length behind. Neither the card nor Sunny
 * acknowledges it, and nothing else in the scene moves for them.
 *
 * It is a credit-allocation gag — the character who actually *is* the sunset
 * walking past the man taking the bow — and it is the setup for `rc_04b_red`
 * in the recap, which is the same joke with a line on it.
 *
 * Three staging facts, all of them load-bearing:
 *
 *   - **He walks at the card's own height.** `BigWordBeat` draws the card at
 *     zIndex 50 and everything it is handed as `children` underneath, so a body
 *     at the banner's y is *occluded by the word* for the whole middle of its
 *     crossing and comes out the far side. That is the joke's picture, and it
 *     costs one number (`S29_WALK_Y`) rather than a mask.
 *   - **He sets off inside `a3_21_narrator`, never inside a held beat.** The
 *     scene's two 12f beats are both over by then; he is fully behind the card
 *     across Sunny's brag and emerges under `a3_23_narrator`. He is still
 *     walking at the cut, because he always is.
 *   - **`RED_SPEED` is not negotiable and neither is the follow gap.** Orange
 *     lags by the time Red takes to cover one *drawn* body length at this
 *     shot's scale (batch (b)'s ruling on Scene 18: the rule travels, the
 *     number does not).
 */
const S29_WALK_Y = 254;
const S29_WALK_SCALE = 0.6;
/** One body clear of frame left when he sets off. */
const S29_WALK_FROM = { x: -170, y: S29_WALK_Y };

/**
 * Scene 29 — Big Word Three, and the only one of the three lit from below.
 *
 * The freeze is the sea horizon at full sunset **with the island still on it**.
 * That is not the volcano being acknowledged: it is the volcano being scenery,
 * which is the rule. It is drawn live over the frozen plate rather than inside
 * the freeze, so it keeps snoring through the beat and nothing in the shot ever
 * stops except the water.
 *
 * Sunny is half sunk behind the sea. He is clipped at the measured waterline
 * rather than having paint drawn over him — the plate is behind him, so the
 * only honest way to put water in front of a character is to cut him off at the
 * line the plate says the water is at.
 */
const BigWordSunsetScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [wordFrom, wordTo] = lineWindow(scene, "a3_19_narrator");
  const [chantFrom] = lineWindow(scene, "a3_20_ray");
  const [thesisFrom] = lineWindow(scene, "a3_21_narrator");
  const [sunnyFrom] = lineWindow(scene, "a3_22_sunny");

  const horizon = plateY(SEA_SUNSET_FRAC, { drift: SEA_DRIFT });
  // The freeze lands on the word itself — "…That is a sunset."
  const slamAt = Math.round(wordFrom + (wordTo - wordFrom) * 0.88);
  const splitAt = Math.max(slamAt + 20, chantFrom - 8);

  // He rides the letters apart, Sun to Set, on an arc with a settle.
  const hopU = (frame - splitAt + 6) / 16;
  const perch = moveAlong(S29_SUN_BLOCK, S29_SET_BLOCK, hopU, {
    arc: 0.3,
    ease: kidEase.easeInOutSine,
  });
  // …and he flies up to the card from over the water as it slams, rather than
  // being parked in mid-air for four seconds waiting for it.
  const rise = moveAlong({ x: 1000, y: horizon - 230 }, S29_SUN_BLOCK, (frame - slamAt + 22) / 26, {
    arc: 0.24,
    ease: kidEase.easeInOutSine,
  });
  const at = frame < splitAt ? rise : perch;
  const land = hopU > 1 ? settleWave((hopU - 1) / 2.2, 1.3, 4.4) : 0;

  // Red and Orange, going somewhere else. See `S29_WALK_Y` above.
  const walkT = Math.max(0, frame - thesisFrom) / fps;
  const redPath = (tt: number) => redWalk(tt, S29_WALK_FROM);
  const redAt = redPath(walkT);
  const orangeAt = orangeFollow(redPath, walkT, SHARD_BODY * S29_WALK_SCALE);
  const walking = frame >= thesisFrom;

  const stage = useStage(scene);
  const emotion = useEmotion(
    scene,
    "ray",
    { a3_20_ray: "excited" },
    "amazed",
    // Two 12-frame held beats in this scene.
    NO_LEAD,
  );
  const sunnyEmotion = useEmotion(
    scene,
    "sunny",
    { a3_22_sunny: "proud" },
    "happy",
    NO_LEAD,
  );

  const sunnyMark: Mark = {
    x: 1462,
    // Half sunk — but his *mouth* has to be above the water, because he has a
    // line. A still with his middle on the waterline cut him off at the eyes,
    // which is a character talking with no mouth on screen.
    y: hover("sunny", horizon - 58, 1.0),
    scale: 1,
    who: "sunny",
    side: "left",
  };

  return (
    <AbsoluteFill>
      <BigWordBeat
        scene={scene}
        word="SUNSET"
        syllables={["Sun", "Set"]}
        chantKey="a3_20_ray"
        slamAt={slamAt}
        color={ACT_COLOR.sunset}
        sub="the long way"
        y={S29_CARD_Y}
        freeze={<SunsetStill horizon={horizon} />}
      >
        {/* Live over the frozen water: the island keeps snoring, and Sunny
            keeps talking. */}
        <SleepingVolcano
          x={VOLCANO_AT.x}
          base={horizon}
          scale={VOLCANO_AT.scale}
          phase={0.85}
        />
        {/* Lit from below, in red and orange: a warm glow standing up off the
            waterline and under the card. */}
        <UpLight y={horizon} strength={0.85} />
        {/* Red and Orange, crossing behind the word. Under zIndex 50, so the
            card takes them for the middle of the crossing; over the frozen
            water, because they are the only thing in the shot still happening.
            Nobody looks, nobody stops, and neither of them looks back. */}
        {walking ? (
          <>
            <Shard
              who="red"
              x={redAt.x}
              y={hover("shard", redAt.y, S29_WALK_SCALE)}
              scale={S29_WALK_SCALE}
              heading={redAt.angle}
              look={{ x: 0.7, y: 0 }}
              zIndex={26}
            />
            <Shard
              who="orange"
              x={orangeAt.x}
              y={hover("shard", orangeAt.y, S29_WALK_SCALE)}
              scale={S29_WALK_SCALE}
              heading={orangeAt.angle}
              look={{ x: 0.7, y: 0 }}
              zIndex={25}
            />
          </>
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            // The sea in front of him. Clipped at the measured horizon, which
            // is the only number in the shot that must not be eyeballed.
            clipPath: `inset(0 0 ${Math.max(0, H - horizon)}px 0)`,
          }}
        >
          <Sunny
            x={sunnyMark.x}
            y={sunnyMark.y}
            scale={1}
            phase={PHASE.sunny}
            emotion={sunnyEmotion}
            speaking={stage.speaking("sunny")}
            look={{ x: -0.35, y: -0.5 }}
            raySpeed={0.1}
            zIndex={30}
          />
        </div>
        {/* Where he meets the water, so he is *in* the sea rather than cut off
            by an invisible ruler. */}
        <WideLayer zIndex={31}>
          <ellipse
            cx={sunnyMark.x}
            cy={horizon + 4}
            rx={230}
            ry={14}
            fill={kidTheme.sunLight}
            opacity={0.5}
          />
        </WideLayer>
        <Ray
          x={at.x}
          y={hover("ray", at.y + land * 8, S29_PERCH)}
          scale={S29_PERCH * (1 + land * 0.1)}
          brightness={RAY_LIGHT.full}
          spectrum={RAY_SPECTRUM.afterRainbow}
          phase={PHASE.ray}
          emotion={emotion}
          speaking={stage.speaking("ray")}
          look="camera"
          streak={0.25}
          idle={0.6}
          zIndex={55}
        />
      </BigWordBeat>

      <Bubbles
        scene={scene}
        cast={
          {
            sunny: sunnyMark,
            red: {
              x: redAt.x,
              y: hover("shard", redAt.y, S29_WALK_SCALE),
              scale: S29_WALK_SCALE,
              who: "shard",
              side: "left",
            },
          } as Cast
        }
        text={S29_BUBBLES}
        // Above him and to the left, in the gap between the card and the
        // waterline: a bubble under its speaker points its tail at the floor,
        // and this frame has a Big Word card sitting in the only other place it
        // could go. One line, so it fits in that gap.
        at={{
          a3_22_sunny: {
            x: 880,
            y: Math.max(430, horizon - 132),
            tail: "right",
            tailAt: sunnyMark.x,
          },
          // **He is entirely behind the word when this lands**, which is the
          // picture: the sunset reviews the show about the sunset from behind
          // the card, without stopping. So the bubble goes in the only clear
          // air there is — left of the "Sun" block, above the waterline, clear
          // of Sunny's rays and of his own bubble's place — and the tail
          // reaches back at whatever piece of him is showing between the two
          // syllables. It is up for 46 frames and he emerges under the next
          // line, so nobody is left wondering who said it.
          // `BigWordBeat` draws the card at zIndex 50 and a bubble is 40, so
          // the "Sun" block ate the right-hand third of this one at x=470 — the
          // joke's only line, half behind the word it is about. It goes in the
          // only clear air there is: left of the card, above the waterline,
          // clear of Sunny's rays, with the tail reaching back at whatever piece
          // of Red is showing between the two syllables.
          //
          // **`x` cannot go further left than this and that is why the text
          // carries a line break** (T7b). `Bubbles` clamps `bx` to
          // [400, WIDTH−400], so 390 is 400 and 330 would be 400 as well; the
          // card's left edge is at x≈633, and "Very dramatic." on one line is a
          // ~575px box, i.e. 112..687 — the full stop lands under the "S". Broken
          // over two lines it is ~330px, 235..565, and clear by 68px. Moving it
          // up instead does not work either: `by` clamps at 170, which still
          // leaves the bubble's bottom corner inside the card.
          a3_22b_red: { x: 400, y: 200, tail: "right", tailAt: redAt.x },
        }}
        maxWidth={780}
      />
      {/* Nothing after the card may draw over Sunny's own line, so the glow
          the freeze is standing in is behind everything. */}
      <FrameLight from={sunnyFrom} />
    </AbsoluteFill>
  );
};

/** What the Big Word freezes: the sea horizon at full sunset. */
const SunsetStill: React.FC<{ horizon: number }> = ({ horizon }) => (
  <AbsoluteFill>
    <PaintedSky bg="sea_sunset" phase={5.2} drift={SEA_DRIFT} />
    <SideLight horizon={horizon} strength={0.6} />
  </AbsoluteFill>
);

/** Red and orange standing up off the waterline — the card's light source. */
const UpLight: React.FC<{ y: number; strength: number }> = ({ y, strength }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y - 620,
      height: 700,
      background: `radial-gradient(ellipse 62% 100% at 50% 100%, rgba(255,138,60,${0.5 * strength}) 0%, rgba(255,106,92,${0.24 * strength}) 46%, rgba(255,106,92,0) 74%)`,
      pointerEvents: "none",
      zIndex: 6,
    }}
  />
);

/** A last warm lift under Sunny's line, so the button is the brightest beat. */
const FrameLight: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const u = clamp01((frame - from) / 26);
  if (u <= 0.01) return null;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(255,201,60,0.22) 0%, rgba(255,201,60,0) 70%)",
        opacity: u,
        pointerEvents: "none",
        zIndex: 4,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Scene 30 — The blue crayon goes back in the box
// ---------------------------------------------------------------------------
//
// **Scene 1's frame, five minutes later, with a different crayon**, and the
// whole emotional payoff of Act Three is that the audience recognises a
// picture. So the geography (`PAGE`, `CRAYON_BOX`, `CRAYONS`, `SKY_BAND`,
// `crayonAt`) and the drawing itself (`CrayonDrawing`) are **imported from
// coldOpen.tsx**, not re-picked. Those two shots cannot drift apart, because
// there is only one set of numbers.
//
// BLOCKER, and it is the honest note on this scene: the cold open's four
// *drawings* — the page shadow, the box, the overhead kid and the hand — are
// module-private in `coldOpen.tsx`, and this wave may only edit act3.tsx and
// recap.tsx. They are therefore reproduced below, character for character,
// including `palmFor` and `CRAYON_REACH` (the wave-1 bug fix: `Hand` draws the
// crayon 186px down a shaft rotated a further 28°, so anything the tip has to
// touch is a **tip target** converted back to a palm position — putting the palm
// on the band draws on the tree). **The fix is one word:** export `PageShadow`,
// `CrayonBox`, `OverheadKid`, `Hand`, `palmFor`, `CRAYON_REACH` and
// `COLOUR_TILT` from coldOpen.tsx and delete every copy below. Until that
// happens these two shots are one careless edit apart from disagreeing, which is
// exactly the failure the cold open's own header warns about.

/** The crayon's angle in the hand while colouring, in degrees. */
const COLOUR_TILT = 14;
const CRAYON_REACH = 186;

/** The palm position that puts the crayon's tip at `tip`. */
function palmFor(tip: { x: number; y: number }, tiltDeg: number): { x: number; y: number } {
  const th = ((tiltDeg + 28) * Math.PI) / 180;
  return {
    x: tip.x + CRAYON_REACH * Math.sin(th),
    y: tip.y - CRAYON_REACH * Math.cos(th),
  };
}

/** The zoom the cold open's push-in ended on. Same shot means same number. */
const S30_ZOOM = 1.07;

const CrayonBackScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();

  const [, stillTo] = lineWindow(scene, "a3_24_narrator");
  const [lookFrom, lookTo] = heldBeat(scene, "a3_24_narrator");
  const [putFrom, putTo] = lineWindow(scene, "a3_25_narrator");
  const [searchFrom, searchTo] = heldBeat(scene, "a3_25_narrator");

  const hand = handAt(frame, {
    stillTo,
    lookFrom,
    lookTo,
    putFrom,
    putTo,
    searchFrom,
    searchTo,
    end: scene.durationInFrames,
  });

  // The head comes up off the page and goes back down — the kid looking at the
  // orange sky, with no face and not a word, three episodes running.
  const lift = kidEase.easeInOutSine((frame - lookFrom) / 22) - kidEase.easeInOutSine((frame - lookFrom - 34) / 20);

  return (
    <AbsoluteFill style={{ background: "#c08a4e", overflow: "hidden" }}>
      {/* Same lawn, same page, same kid, five minutes later — and the *only*
          thing about the shot that is different is the light on it. The plate's
          own `tint` is a soft-light wash and a still of it was still a bright
          midday lawn, so the evening is a wash of its own on top: violet in the
          shadow corner, gold coming in low from the right. It has to be
          unmistakable, because the Narrator never says the word "orange" and
          the audience has to get there first. */}
      <div style={{ position: "absolute", inset: 0, filter: "saturate(0.92) brightness(0.9)" }}>
        <PaintedSky bg="grass_overhead" drift={6} phase={7.3} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(108deg, rgba(74,36,88,0.46) 0%, rgba(150,68,86,0.28) 30%, rgba(255,142,52,0.34) 70%, rgba(255,196,92,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${PAGE.x}px ${PAGE.y}px`,
          transform: `scale(${S30_ZOOM})`,
        }}
      >
        <PageShadow />
        <CrayonDrawing blue={1} orange={hand.inked} />
        {/* A second pass with the orange, and the reason for it is the same
            reason a child presses harder the second time round: `CrayonBand`
            lays wax at ~65% alpha, and 65% orange over a full blue band is
            brown. The picture the episode ends on is an orange sky, so the band
            gets the second pass — clipped a little short of the leading edge,
            so the ragged crayon front underneath is still the front. */}
        <SecondCoat progress={hand.inked * 0.96} />
        <CrayonBox lifted={hand.carrying === "blue" ? BLUE_CRAYON : hand.carrying === "orange" ? ORANGE_CRAYON : -1} />
        <OverheadKid lift={lift} />
        <Hand
          x={hand.x}
          y={hand.y}
          press={hand.press}
          carrying={
            hand.carrying === "blue"
              ? CRAYONS[BLUE_CRAYON]
              : hand.carrying === "orange"
                ? CRAYONS[ORANGE_CRAYON]
                : null
          }
          tiltDeg={hand.tilt}
        />
      </div>
    </AbsoluteFill>
  );
};

/**
 * The orange, gone over twice. Same page transform, same band, same ragged-row
 * trick as `CrayonBand` so the two passes agree at the edges.
 */
const SecondCoat: React.FC<{ progress: number }> = ({ progress }) => {
  const p = clamp01(progress);
  if (p <= 0.002) return null;
  const left = PAGE.x - PAGE.w / 2;
  const top = PAGE.y - PAGE.h / 2;
  const rows = 8;
  const h = (SKY_BAND.y1 - SKY_BAND.y0) / rows;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: PAGE.w,
        height: PAGE.h,
        transform: `rotate(${PAGE.tilt}deg)`,
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <svg width={PAGE.w} height={PAGE.h} viewBox={`0 0 ${PAGE.w} ${PAGE.h}`}>
        <g opacity={0.86}>
          {Array.from({ length: rows }, (_, i) => {
            const lead = ((i * 37 + 159) % 11) / 11;
            const t = clamp01(p * 1.16 - lead * 0.16);
            if (t <= 0) return null;
            return (
              <rect
                key={i}
                x={SKY_BAND.x0 - left}
                y={SKY_BAND.y0 - top + i * h - h * 0.34}
                width={(SKY_BAND.x1 - SKY_BAND.x0) * t}
                height={h * 1.68}
                fill={CRAYONS[ORANGE_CRAYON].fill}
                opacity={0.6 + ((i * 29) % 4) * 0.03}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

type HandState = {
  x: number;
  y: number;
  press: number;
  carrying: "blue" | "orange" | null;
  tilt: number;
  /** How much of the sky band is orange. */
  inked: number;
};

/**
 * The whole scene, as one function of the frame — and every phase of it is
 * bounded by a scripted beat rather than by a number, so if a gap in Video.tsx
 * moves, the business moves with it.
 *
 *   a3_24 + before   still colouring, the way the cold open left them
 *   45f beat         stop. Look up. Look at the page. Look at the crayon.
 *   a3_25            carry the blue back and put it in the box
 *   36f beat         search the row, find the orange, take it, start colouring
 *   a3_26 + tail     colour over the top of the blue band
 */
function handAt(
  frame: number,
  b: {
    stillTo: number;
    lookFrom: number;
    lookTo: number;
    putFrom: number;
    putTo: number;
    searchFrom: number;
    searchTo: number;
    end: number;
  },
): HandState {
  const bandY = (SKY_BAND.y0 + SKY_BAND.y1) / 2;
  const bandLeft = palmFor({ x: SKY_BAND.x0 + 44, y: bandY }, COLOUR_TILT);
  const bandRight = palmFor({ x: SKY_BAND.x1 - 44, y: bandY }, COLOUR_TILT);
  const bandMid = { x: (bandLeft.x + bandRight.x) * 0.56, y: bandLeft.y };
  const overBlue = { x: crayonAt(BLUE_CRAYON).x, y: CRAYON_BOX.y - 210 };
  const atBlue = { x: crayonAt(BLUE_CRAYON).x, y: CRAYON_BOX.y - 96 };
  const overRow = { x: crayonAt(6).x, y: CRAYON_BOX.y - 200 };
  const overOrange = { x: crayonAt(ORANGE_CRAYON).x, y: CRAYON_BOX.y - 210 };
  const atOrange = { x: crayonAt(ORANGE_CRAYON).x, y: CRAYON_BOX.y - 96 };

  const lerp = (a: { x: number; y: number }, c: { x: number; y: number }, t: number) => ({
    x: a.x + (c.x - a.x) * t,
    y: a.y + (c.y - a.y) * t,
  });

  // 1. Still colouring — small, idle passes over a band that is already blue.
  if (frame < b.lookFrom) {
    const u = frame / Math.max(1, b.stillTo);
    const p = lerp(bandMid, bandRight, kidEase.easeInOutSine(Math.sin(u * Math.PI * 1.6) * 0.5 + 0.5));
    return { x: p.x, y: p.y + Math.sin(frame / 7) * 6, press: 1, carrying: "blue", tilt: COLOUR_TILT, inked: 0 };
  }

  // 2. The beat. Lift off the page, hold, and turn the crayon over — the shot
  //    is an overhead of a child working out that they need a different one,
  //    and the crayon is the entire emotional readout.
  if (frame < b.putFrom) {
    const span = Math.max(1, b.lookTo - b.lookFrom);
    const u = (frame - b.lookFrom) / span;
    const rise = kidEase.easeOutCubic(u / 0.34);
    const p = lerp(bandRight, { x: bandRight.x + 40, y: bandRight.y + 130 }, rise);
    // …and it turns towards them at the end of the beat.
    const turn = kidEase.easeInOutSine((u - 0.6) / 0.4);
    return {
      x: p.x,
      y: p.y,
      press: 1 - rise,
      carrying: "blue",
      tilt: COLOUR_TILT + turn * 52,
      inked: 0,
    };
  }

  // 3. "The blue crayon went back in the box."
  if (frame < b.searchFrom) {
    const span = Math.max(1, b.putTo - b.putFrom);
    const u = (frame - b.putFrom) / span;
    const carry = kidEase.easeInOutSine(u / 0.62);
    const drop = kidEase.easeInOutSine((u - 0.62) / 0.24);
    const p = lerp(lerp({ x: bandRight.x + 40, y: bandRight.y + 130 }, overBlue, carry), atBlue, drop);
    return {
      x: p.x,
      y: p.y,
      press: 0,
      // It is in the box from the moment the hand reaches the slot, which is
      // the frame the line is about.
      carrying: drop > 0.72 ? null : "blue",
      tilt: COLOUR_TILT + 52 - carry * 62,
      inked: 0,
    };
  }

  // 4. The 36-frame beat: search the row, find the orange, and start.
  const searchSpan = Math.max(1, b.searchTo - b.searchFrom);
  const s = (frame - b.searchFrom) / searchSpan;
  if (s < 1) {
    if (s < 0.32) {
      const p = lerp(overBlue, overRow, kidEase.easeInOutSine(s / 0.32));
      return { x: p.x, y: p.y, press: 0, carrying: null, tilt: -14, inked: 0 };
    }
    if (s < 0.62) {
      const p = lerp(overRow, overOrange, kidEase.easeInOutSine((s - 0.32) / 0.3));
      return { x: p.x, y: p.y, press: 0, carrying: null, tilt: -14, inked: 0 };
    }
    if (s < 0.78) {
      const t = (s - 0.62) / 0.16;
      const p = lerp(overOrange, atOrange, Math.sin(t * Math.PI));
      return { x: p.x, y: p.y, press: 0, carrying: t > 0.5 ? "orange" : null, tilt: -10, inked: 0 };
    }
    const t = kidEase.easeInOutSine((s - 0.78) / 0.22);
    const p = lerp(overOrange, bandLeft, t);
    return { x: p.x, y: p.y, press: 0, carrying: "orange", tilt: -10 + t * (COLOUR_TILT + 10), inked: 0 };
  }

  // 5. Colouring over the top of the blue, left to right, two passes, and it
  //    finishes inside the tail rather than on the last word.
  const u = clamp01((frame - b.searchTo) / Math.max(1, (b.end - 20 - b.searchTo)));
  const p = lerp(bandLeft, bandRight, scribbleSweep(u));
  return {
    x: p.x,
    y: p.y + Math.sin(u * Math.PI * 7) * 9,
    press: 1,
    carrying: "orange",
    tilt: COLOUR_TILT,
    inked: inkedTo(u),
  };
}

/** Two passes across the band — a child colouring, not a fill animation. */
function scribbleSweep(t: number): number {
  if (t < 0.4) return 0.66 * kidEase.easeInOutSine(t / 0.4);
  if (t < 0.55) return 0.66 - 0.42 * kidEase.easeInOutSine((t - 0.4) / 0.15);
  return 0.24 + 0.76 * kidEase.easeInOutSine((t - 0.55) / 0.45);
}

/** The high-water mark: ink does not come off the paper on the way back. */
function inkedTo(t: number): number {
  return Math.max(scribbleSweep(t), 0.66 * kidEase.easeInOutSine(t / 0.4));
}

// --- the four drawings, copied from coldOpen.tsx (see the BLOCKER above) ----

/** The paper, and the soft shadow that stops it floating over painted grass. */
const PageShadow: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: PAGE.x - PAGE.w / 2,
      top: PAGE.y - PAGE.h / 2,
      width: PAGE.w,
      height: PAGE.h,
      transform: `rotate(${PAGE.tilt}deg)`,
      borderRadius: 6,
      // Longer and softer than the cold open's: the sun is on the horizon now,
      // and it is the same evidence Scene 25 puts under the rock.
      boxShadow: "-40px 30px 54px rgba(52,28,22,0.4)",
      background: "#fffdf6",
    }}
  />
);

/** The open box, seen from above, with every colour standing up in it. */
const CrayonBox: React.FC<{ lifted: number }> = ({ lifted }) => (
  <div
    style={{
      position: "absolute",
      left: CRAYON_BOX.x - CRAYON_BOX.w / 2 - 26,
      top: CRAYON_BOX.y - CRAYON_BOX.h / 2 - 26,
      width: CRAYON_BOX.w + 52,
      height: CRAYON_BOX.h + 52,
      transform: "rotate(4deg)",
    }}
  >
    <svg
      width={CRAYON_BOX.w + 52}
      height={CRAYON_BOX.h + 52}
      viewBox={`0 0 ${CRAYON_BOX.w + 52} ${CRAYON_BOX.h + 52}`}
      overflow="visible"
    >
      <rect x={4} y={4} width={CRAYON_BOX.w + 44} height={CRAYON_BOX.h + 44} rx={22} fill="#d8b98a" stroke="#8a6134" strokeWidth={10} />
      <rect x={22} y={22} width={CRAYON_BOX.w + 8} height={CRAYON_BOX.h + 8} rx={14} fill="#c19d68" />
      {CRAYONS.map((c, i) => {
        const gap = CRAYON_BOX.w / CRAYONS.length;
        const x = 26 + gap * (i + 0.5) - 11;
        if (i === lifted) return null;
        return (
          <g key={c.name}>
            <rect x={x} y={70 + ((i * 17) % 14)} width={23} height={CRAYON_BOX.h - 78} rx={11} fill={c.fill} stroke={c.deep} strokeWidth={5} />
            <rect x={x + 1} y={132 + ((i * 17) % 14)} width={21} height={CRAYON_BOX.h - 214} fill="#fffdf6" opacity={0.55} />
          </g>
        );
      })}
    </svg>
  </div>
);

/**
 * The kid, from above, lying on their front — never a face, three episodes
 * running. `lift` (0..1) raises the head off the page: the one thing this shot
 * has to say that the cold open's did not is "they looked up at the sky", and
 * they have to say it with the back of their head.
 */
const OverheadKid: React.FC<{ lift: number }> = ({ lift }) => {
  const l = clamp01(lift);
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    >
      <g opacity={0.94}>
        <path d="M 590 1140 Q 620 900 760 852 L 1120 846 Q 1276 894 1300 1140 Z" fill={kidTheme.ink} />
        <g transform={`translate(0 ${-l * 26}) scale(1 ${1 + l * 0.06})`} style={{ transformOrigin: "942px 900px" }}>
          <ellipse cx={942} cy={806} rx={104} ry={92 - l * 8} fill={kidTheme.ink} />
          <path
            d="M 852 786 q 44 -52 100 -40 q 62 12 84 54"
            stroke={kidTheme.ink}
            strokeWidth={30}
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <path d="M 782 902 Q 640 900 512 866" stroke={kidTheme.ink} strokeWidth={60} strokeLinecap="round" fill="none" />
        <ellipse cx={486} cy={856} rx={54} ry={42} fill={kidTheme.ink} transform="rotate(-14 486 856)" />
      </g>
    </svg>
  );
};

/** The right hand and forearm — the only thing in this shot that acts. */
const Hand: React.FC<{
  x: number;
  y: number;
  press: number;
  carrying: (typeof CRAYONS)[number] | null;
  tiltDeg: number;
}> = ({ x, y, press, carrying, tiltDeg }) => {
  const shoulder = { x: 1178, y: 962 };
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    >
      <path
        d={`M ${shoulder.x} ${shoulder.y} Q ${(shoulder.x + x) / 2 + 40} ${(shoulder.y + y) / 2} ${x} ${y}`}
        stroke={kidTheme.ink}
        strokeWidth={58}
        strokeLinecap="round"
        fill="none"
        opacity={0.94}
      />
      <g transform={`translate(${x} ${y}) rotate(${tiltDeg})`} opacity={0.96}>
        {carrying ? (
          <g transform="rotate(28)">
            <rect x={-17} y={-10} width={34} height={176} rx={15} fill={carrying.fill} stroke={carrying.deep} strokeWidth={7} />
            <rect x={-15} y={22} width={30} height={86} fill="#fffdf6" opacity={0.62} />
            <path d={`M -17 ${156 + press * 8} L 0 ${186 + press * 10} L 17 ${156 + press * 8} Z`} fill={carrying.deep} />
          </g>
        ) : null}
        <ellipse cx={0} cy={0} rx={62 + press * 5} ry={52 - press * 4} fill={kidTheme.ink} />
        {[-34, -12, 11, 33].map((fx, i) => (
          <rect key={fx} x={fx - 11} y={-4} width={22} height={62 - Math.abs(i - 1.5) * 8} rx={11} fill={kidTheme.ink} />
        ))}
        <ellipse cx={-52} cy={12} rx={20} ry={30} fill={kidTheme.ink} transform="rotate(-28 -52 12)" />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 31 — Round the other side
// ---------------------------------------------------------------------------
//
// The end of the story, and the beat the whole ending rests on is a **75-frame
// silence with nothing in it but a planet turning**. script.md: "If any line
// lands inside these seventy-five frames, the episode does not have an ending."
//
// **The line the seventy-five frames button changed on 2026-08-04 (T8).** It
// used to be the greeting; it is now the catch-phrase that has followed the
// greeting in both previous episodes — "I invented mornings! You're welcome!
// HA! HA!" — which Mike's note restores. The beat is the same length, in the
// same place relative to the last line, and nothing else in the scene moves for
// it: Sunny is already up on the far limb by the time he says it, and he does
// not leave, because something leaving inside the payoff is something happening
// inside it.
//
// So the payoff is built out of things that are *already on screen and already
// moving* — the terminator keeps sliding, and a blue rim comes up on the far
// limb as the new morning arrives. Nothing enters, nothing pops, nothing lands.
// The only new thing in the last three seconds of the story is more daylight.

/** The pull-back, in one number: 0 is the sea, 1 is the whole planet. */
const S31_GLOBE = { r0: 26000, r1: 372 };

const S31_BUBBLES: Record<string, string> = {
  a3_27_ray: "Look up. That's still me.",
  a3_29_ray: "Wait. Am I finished?",
  // The identical text of a1_03, on the identical recording (`sameAs`), eight
  // minutes later and a world away. The sameness is the joke *and* the comfort;
  // it is staged small and far rather than processed.
  a3_31_sunny: "GOOD MORNING, EVERYBODY!",
  // **THE CATCH-PHRASE, RESTORED** (T8, Mike's note 8, 2026-08-04). The clip is
  // the series-canon "I invented mornings! You're welcome! HA! HA!", word for
  // word what he says in both previous episodes; the bubble is the first half,
  // because six words is the ceiling and the brag is the half with the claim in
  // it. Two episodes of viewers get the rest from the read.
  a3_31b_sunny: "I invented mornings!",
};

const RoundTheOtherSideScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [rayFrom] = lineWindow(scene, "a3_27_ray");
  const [pullFrom] = lineWindow(scene, "a3_28_narrator");
  const [morningFrom] = lineWindow(scene, "a3_30_narrator");
  const [sunnyFrom, sunnyTo] = lineWindow(scene, "a3_31_sunny");
  // **The last line of the episode is `a3_31b_sunny` since T8**, so the payoff —
  // the 75-frame silence the whole ending rests on — is keyed to *it*, not to
  // the greeting. `a3_31_sunny` now buys an 18-frame beat between the two
  // halves of one thought, and everything that used to hang on "the silence
  // after the greeting" hangs here instead.
  const [, bragTo] = lineWindow(scene, "a3_31b_sunny");
  const [payoffFrom] = heldBeat(scene, "a3_31b_sunny");

  const horizon = plateY(SEA_SUNSET_FRAC, { drift: SEA_DRIFT });

  // The sliver goes under the sea on Ray's line, and the pull-back starts on
  // the Narrator's. One long ease all the way out: it is a retreat, not a cut.
  const sink = kidEase.easeInOutSine((frame - rayFrom - 26) / 70);
  const pull = kidEase.easeInOutSine(
    (frame - pullFrom + 10) / Math.max(1, (morningFrom - pullFrom) * 1.24),
  );

  // The planet. Enormous and just under the horizon at the start (its limb *is*
  // the sea's horizon), then smaller and smaller until the whole thing is in
  // frame and turning.
  const e = kidEase.easeInOutSine(pull);
  const r = S31_GLOBE.r0 + (S31_GLOBE.r1 - S31_GLOBE.r0) * e;
  // **The pull-back is parametrised by the top of the globe, not by its
  // centre.** Interpolating the centre gives a shrinking radius that outruns a
  // rising centre, and halfway through the move the camera ends up *inside* the
  // planet: a still at pull≈0.5 was a completely flat blue frame. What a
  // retreat actually looks like is the limb staying in view and getting
  // flatter, so the limb is what the numbers describe. It also hangs back until
  // the sea has finished dissolving, so the waterline and the planet's edge are
  // in the same place while both are on screen.
  const lift = kidEase.easeInOutSine(clamp01((pull - 0.2) / 0.8));
  const top = horizon + (540 - S31_GLOBE.r1 - horizon) * lift;
  const cy = top + r;

  // It never stops turning, and the terminator never stops sliding — including
  // through the whole of the 75-frame payoff, which is the only thing moving.
  //
  // `phase` is the terminator's own position, in cosine space, driven **linear
  // in time and never allowed near ±1**: at +1 the planet is fully lit and at
  // -1 it is fully dark, and a first pass that ran a real cosine round a
  // twelve-second cycle produced a still of a planet in complete daylight with
  // no terminator on it at all. This ramp crosses zero (the exact half-lit
  // disc) at about fourteen seconds, which puts the terminator sliding through
  // the middle of the world for the whole of the payoff.
  const spin = (frame / fps) * 0.078;
  const phase = 0.42 - (frame / fps) * 0.03;
  // The new day coming up on the far limb. Starts under the Narrator's
  // "somewhere out there it is already morning" and finishes inside the payoff.
  const dawn = clamp01((frame - morningFrom) / Math.max(1, (payoffFrom + 62) - morningFrom));

  const stage = useStage(scene);
  const rayEmotion = useEmotion(
    scene,
    "ray",
    { a3_27_ray: "happy", a3_29_ray: "amazed" },
    "happy",
    // Two held beats in this scene, one of them the longest in the episode.
    NO_LEAD,
  );

  // Ray: a body over the water while there is still a sea, and one glint on the
  // retreating edge once there is a planet. He crosses over as the pull-back
  // takes him — the same character, at two distances.
  //
  // Both of them aim at the globe's **final** geometry rather than its current
  // one. A point on a 26000px limb is thousands of pixels off frame, so a Ray
  // interpolating towards "wherever the limb is now" simply leaves the picture
  // for six seconds in the middle of the pull-back — which a still of frame
  // 19300 showed as a bubble with nobody under it. He crosses the daylight side
  // and *arrives* on the edge exactly as the planet arrives at its size.
  const rayNear = { x: 1080, y: 726 };
  const glint = limbPoint(960, 540, S31_GLOBE.r1, 0.62 + spin * 0.3);
  const rayX = rayNear.x + (glint.x - rayNear.x) * kidEase.easeInOutSine(pull * 1.1);
  const rayY = rayNear.y + (glint.y - rayNear.y) * kidEase.easeInOutSine(pull * 1.1);
  const rayScale = 1.0 - 0.86 * kidEase.easeInOutSine(pull);
  const rayMark: Mark = {
    x: rayX,
    y: hover("ray", rayY, Math.max(0.14, rayScale)),
    scale: Math.max(0.14, rayScale),
    who: "ray",
    side: "left",
  };

  // Sunny, over the far horizon, and a very long way away: scale and position
  // are the whole effect. He rises on his own line and does not leave, because
  // something leaving inside the payoff is something happening inside it.
  const sunnyUp = spring({ frame: frame - sunnyFrom, fps, config: { damping: 14, mass: 1.1 } });
  const sunnyAt = limbPoint(960, 540, S31_GLOBE.r1, -2.05);
  const sunnyMark: Mark = {
    x: sunnyAt.x,
    y: hover("sunny", sunnyAt.y - 34 * sunnyUp, 0.19),
    scale: 0.19,
    who: "sunny",
    side: "right",
  };

  return (
    <AbsoluteFill style={{ background: "#050b1d" }}>
      {/* Space comes up *as* the sea goes, rather than sitting underneath it at
          full strength: a still mid-dissolve otherwise has a star field showing
          through the water, which is a double exposure rather than a retreat. */}
      <div style={{ position: "absolute", inset: 0, opacity: clamp01((pull - 0.1) / 0.24) }}>
        <PaintedSky bg="space_stars" drift={0} phase={2.2} />
      </div>

      {/* The sea we are leaving, and the planet we are leaving it for, dissolved
          across each other rather than cut. **The globe cannot simply be there
          from frame one**: at the start of the pull-back its radius is 26000px,
          which is a flat-topped disc filling the bottom two thirds of the frame
          in solid navy — a still of the first pass had it painted straight over
          the sea, Sunny's sinking sliver and all. It is the same object either
          way; what has to fade is which of the two pictures of it we are
          looking at. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - clamp01((pull - 0.13) / 0.2),
          filter: `brightness(${1 - 0.3 * pull})`,
        }}
      >
        <PaintedSky bg="sea_sunset" phase={6.4} drift={SEA_DRIFT} />
        <SideLight horizon={horizon} strength={0.55 * (1 - sink)} />
        <SleepingVolcano x={VOLCANO_AT.x} base={horizon} scale={VOLCANO_AT.scale} phase={0.3} />
        {/* The last sliver: Sunny's crown, going under. */}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${Math.max(0, H - horizon)}px 0)` }}>
          <Sunny
            x={1268}
            y={hover("sunny", horizon + 130 + sink * 190, 0.9)}
            scale={0.9}
            phase={PHASE.sunny}
            emotion="happy"
            look={{ x: -0.3, y: -0.3 }}
            raySpeed={0.08}
            zIndex={12}
          />
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: clamp01((pull - 0.17) / 0.2) }}>
        <Globe cx={960} cy={cy} r={r} spin={spin} phase={phase} dawn={dawn} />
      </div>

      <Ray
        x={rayMark.x}
        y={rayMark.y}
        scale={rayMark.scale ?? 1}
        brightness={RAY_LIGHT.full}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        look={pull > 0.5 ? { x: -0.3, y: 0.2 } : { x: -0.2, y: -0.6 }}
        streak={0.4}
        // He never goes out. At the far end of the pull-back he is one glint on
        // the edge of a turning planet, which is what the line says he is.
        opacity={1}
        zIndex={26}
      />

      <div style={{ opacity: Math.max(0, Math.min(1, sunnyUp * 1.4)) }}>
        <Sunny
          x={sunnyMark.x}
          y={sunnyMark.y}
          scale={0.19}
          phase={PHASE.sunny}
          emotion="excited"
          speaking={stage.speaking("sunny")}
          look={{ x: 0.3, y: 0.2 }}
          raySpeed={0.24}
          zIndex={24}
        />
      </div>

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark } as Cast}
        text={S31_BUBBLES}
        fontSize={kidType.bubbleSmall}
        maxWidth={560}
        at={{
          a3_27_ray: { x: 700, y: 300, tail: "right", tailAt: rayMark.x },
          a3_29_ray: { x: 700, y: 236, tail: "right", tailAt: rayMark.x },
        }}
      />
      {/* Sunny's own pass, at his own size. **Distance is staged, and a bubble
          is part of the staging**: the same text in the same house bubble at
          the same size as the near character's is a man standing next to you,
          whatever his body is doing. Small type, narrow box, out in the star
          field beside a sun the size of a pea. No audio processing anywhere —
          it is the identical recording of `a1_03_sunny` and it has to stay
          identical, so the whole of "from over the far horizon" has to be
          carried by the picture. */}
      {/* …and it is **gone before the payoff opens**. `SpeechBubble` springs
          back out over the frames *after* its `until`, and the last line's
          `until` is the first frame of the seventy-five. A still at 19495
          caught a shrinking bubble sitting inside the ending. The wrapper takes
          it out over the last eight frames of the line instead, so the beat
          opens on a clean frame. **Keyed to `bragTo` since T8** — the last line
          is now the catch-phrase, and keying this to the greeting would have
          wiped the brag's bubble off the screen eighteen frames before he said
          it. */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp01((frame - (bragTo - 8)) / 8) }}>
        <Bubbles
          scene={scene}
          cast={{ sunny: sunnyMark } as Cast}
          text={S31_BUBBLES}
          fontSize={kidType.min}
          maxWidth={380}
          at={{
            a3_31_sunny: {
              x: Math.max(400, sunnyMark.x - 300),
              y: sunnyAt.y - 190,
              tail: "right",
              tailAt: sunnyMark.x,
            },
            // Same mark, same size, same tail: it is the same character in the
            // same place saying the second half of one thought, and moving the
            // bubble between them would read as a cut. (The same call Scene 11
            // makes for Drip's two lines and Scene 10 for Orange's.)
            a3_31b_sunny: {
              x: Math.max(400, sunnyMark.x - 300),
              y: sunnyAt.y - 190,
              tail: "right",
              tailAt: sunnyMark.x,
            },
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/**
 * A point on the limb of the globe, at `a` radians from straight up. Used for
 * both the glint Ray becomes and the corner of the world Sunny is shouting
 * from, so the two are on the same circle and cannot drift apart.
 */
function limbPoint(cx: number, cy: number, r: number, a: number): { x: number; y: number } {
  return { x: cx + Math.sin(a) * r, y: cy - Math.cos(a) * r };
}

/**
 * The planet: a night side, a day side, a terminator that slides, and a rim of
 * atmosphere that is **the thing the whole episode has been about** — the blue
 * is not painted on the planet, it is the shell of air round it catching light.
 *
 * `dawn` grows the blue on the leading limb: the new morning coming up on the
 * far side, which is the last thing that happens in the story and the only
 * thing that moves inside the 75-frame silence.
 */
const Globe: React.FC<{
  cx: number;
  cy: number;
  r: number;
  spin: number;
  /** Terminator position in cosine space, -1..1. See the note at the call. */
  phase: number;
  dawn: number;
}> = ({ cx, cy, r, spin, phase, dawn }) => {
  // The lit crescent, as a moon-phase path: one semicircle plus one elliptical
  // arc whose horizontal semi-axis is |phase| × r. Sweeping that number through
  // zero is a terminator sliding across a sphere, and it is the only honest way
  // to do it in two dimensions.
  const k = Math.abs(phase) * r;
  const sweep = phase > 0 ? 1 : 0;
  const day =
    `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r}` +
    ` A ${k} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`;
  const id = Math.round(r);
  const clip = `a3-globe-${id}`;
  const dayClip = `a3-globeday-${id}`;
  // Land rides round with the spin; two copies half a world apart, so the limb
  // that is turning into view always has something on it.
  const roll = ((spin * 2 * r) % (2 * r)) - r;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 14 }}
    >
      <defs>
        <clipPath id={clip}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <clipPath id={dayClip}>
          <path d={day} />
        </clipPath>
      </defs>
      {/* The air, seen edge on. This is the whole episode in one shape: the
          blue is not painted on the planet, it is the shell of air round it
          catching light. */}
      <circle cx={cx} cy={cy} r={r + Math.max(9, r * 0.05)} fill={kidTheme.skyTop} opacity={0.2 + 0.28 * dawn} />
      <g clipPath={`url(#${clip})`}>
        {/* Night: the ocean and the land are both still there, just unlit —
            which is the same claim Scene 6 made with a grey garden. */}
        <circle cx={cx} cy={cy} r={r} fill="#14224a" />
        {[0, 1].map((c) => (
          <g key={c} transform={`translate(${roll + c * 2 * r - r} 0)`}>
            <Continents cx={cx} cy={cy} r={r} fill="#25406a" />
          </g>
        ))}
        {/* Day, clipped to the lit crescent. */}
        <g clipPath={`url(#${dayClip})`}>
          <circle cx={cx} cy={cy} r={r} fill="#2f7fd0" />
          {[0, 1].map((c) => (
            <g key={c} transform={`translate(${roll + c * 2 * r - r} 0)`}>
              <Continents cx={cx} cy={cy} r={r} fill="#5cb765" />
            </g>
          ))}
        </g>
        {/* The terminator's own warm edge. */}
        <path d={day} fill="none" stroke={kidTheme.sunLight} strokeWidth={Math.max(2, r * 0.016)} opacity={0.55} />
      </g>
      {/* The morning rim: blue coming up on the far limb, and the only thing
          that changes inside the 75-frame payoff. */}
      <circle
        cx={cx}
        cy={cy}
        r={r + Math.max(5, r * 0.026)}
        fill="none"
        stroke={kidTheme.skyMid}
        strokeWidth={Math.max(3, r * 0.03)}
        opacity={0.3 + 0.55 * dawn}
        strokeDasharray={`${r * 1.9} ${r * 4.4}`}
        strokeDashoffset={r * 3.15}
      />
    </svg>
  );
};

/** Simple land shapes on the globe, sized off its radius. */
const Continents: React.FC<{ cx: number; cy: number; r: number; fill: string }> = ({
  cx,
  cy,
  r,
  fill,
}) => (
  <g fill={fill} opacity={0.95}>
    <path
      d={
        `M ${cx - r * 0.62} ${cy - r * 0.36} q ${r * 0.24} ${-r * 0.16} ${r * 0.42} ${r * 0.04}` +
        ` q ${r * 0.12} ${r * 0.16} ${-r * 0.06} ${r * 0.26}` +
        ` q ${-r * 0.24} ${r * 0.1} ${-r * 0.36} ${-r * 0.06} Z`
      }
    />
    <path
      d={
        `M ${cx - r * 0.3} ${cy + r * 0.1} q ${r * 0.16} ${-r * 0.04} ${r * 0.2} ${r * 0.14}` +
        ` q ${r * 0.02} ${r * 0.3} ${-r * 0.14} ${r * 0.4}` +
        ` q ${-r * 0.14} ${-r * 0.14} ${-r * 0.12} ${-r * 0.3} Z`
      }
    />
    <path
      d={
        `M ${cx + r * 0.16} ${cy - r * 0.5} q ${r * 0.3} ${-r * 0.06} ${r * 0.42} ${r * 0.16}` +
        ` q ${r * 0.06} ${r * 0.24} ${-r * 0.16} ${r * 0.3}` +
        ` q ${-r * 0.26} ${r * 0.02} ${-r * 0.34} ${-r * 0.16} Z`
      }
    />
    <ellipse cx={cx + r * 0.44} cy={cy + r * 0.42} rx={r * 0.15} ry={r * 0.1} transform={`rotate(-18 ${cx + r * 0.44} ${cy + r * 0.42})`} />
    <ellipse cx={cx - r * 0.02} cy={cy + r * 0.62} rx={r * 0.22} ry={r * 0.09} />
  </g>
);

// ---------------------------------------------------------------------------

/**
 * **The act's scene map, and the two scenes that live in their own files.**
 *
 * `s27b_start_line` and `s28b2_two_walkers` are revision2's new scenes and are
 * big enough to own a file each (the start line has nine speakers in it). The
 * import direction is the one thing to know about them:
 *
 *   - `s27b_start_line.tsx` imports **only** `./common`, so it is a leaf.
 *   - `s28b2_two_walkers.tsx` imports the volcano, the boat and the sea
 *     constants from **this** file, which imports it back for the map below —
 *     a deliberate ES-module cycle, and the alternative was a third copy of
 *     `SleepingVolcano` (there are already two; promoting it is the cleanup
 *     list's headline and is not this batch's job). It is safe because that
 *     file touches nothing of this one at module scope: every reference is
 *     inside a component body, i.e. after both modules have finished
 *     evaluating. **Do not hoist an act3 value into a module-level `const`
 *     over there** — that is the one edit that would break it, and it would
 *     break as a render-time TDZ error rather than as a type error.
 */
export const ACT3_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s25_sea_sunset: SeaSunsetScene,
  // No `s26_volcano`: the scene was cut on 2026-08-01 and its component went
  // with it in wave 2 (A7). Nothing is renumbered and the id is not reused.
  s27_long_way: LongWayScene,
  s27b_start_line: StartLineScene,
  s28_blue_runs_out: BlueRunsOutScene,
  s28b_race_island: RaceIslandScene,
  s28b2_two_walkers: TwoWalkersScene,
  s28c_red_arrives: RedArrivesScene,
  s29_bigword_sunset: BigWordSunsetScene,
  s30_crayon_back: CrayonBackScene,
  s31_round_the_other_side: RoundTheOtherSideScene,
};

/** Re-exported for the recap: Scene 35 is Scene 26's framing, at dusk. */
export { SEA_DUSK_FRAC, SEA_SUNSET_FRAC, MOON_FRAC, SEA_DRIFT, NO_LEAD, clamp01, Globe };
