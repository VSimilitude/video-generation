import React from "react";
import { kidEase, kidRadius, kidShadow, kidTheme, kidType, settleWave } from "../../../lib/kid";
import {
  AbsoluteFill,
  Bubbles,
  PHASE,
  PaintRoller,
  PaintedSky,
  Sunny,
  heldBeat,
  hover,
  interpolate,
  lineProgress,
  lineWindow,
  spring,
  stand,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cast,
  type Mark,
  type TimedScene,
} from "./common";

// COLD OPEN — Scenes 1 and 2 of script.md. A crayon, a question, and a theory
// that is wrong.
//
// Forty seconds with no hero in them. The whole beat is a hand: it hovers over
// a box of crayons, it takes the blue without being told to, and it colours in
// a sky. Every child watching knows which one it is going to pick, and knowing
// it is the hook — so the pick happens in **complete silence**, at real speed,
// inside the sixty frames the script bought for it.
//
// **Scene 30 is this frame again, five minutes later, with a different crayon.**
// That is the entire emotional payoff of Act Three and it depends on the
// audience recognising a picture, so the geography, the drawing and the crayon
// box are exported from here and Act Three reuses them rather than re-picking
// marks. Two hand-built copies of a shot that has to be identical would drift
// in a week; this cannot.

/**
 * The geography, exported because **Act Three, Scene 30 must reuse it exactly**
 * — same overhead angle, same page, same box, same kid.
 */
export const PAGE = {
  /** Centre of the sheet of paper, and its size. */
  x: 830,
  y: 545,
  w: 760,
  h: 580,
  /** Degrees off square. A page a kid is lying over is never straight. */
  tilt: -3.4,
} as const;

export const CRAYON_BOX = { x: 1560, y: 560, w: 250, h: 470 } as const;

/**
 * The crayons, in the box, left to right, and the one thing in the cold open
 * the audience is asked to look at.
 *
 * Nine, in a real child's order rather than in spectrum order — a tidy rainbow
 * in the box would make the pick look designed, and the point is that the hand
 * goes past a row of perfectly good colours to the one every kid picks. `blue`
 * is index 4 and `orange` is index 1; Scene 30 needs both.
 */
export const CRAYONS = [
  { name: "red", fill: "#ea4b3c", deep: "#b2291c" },
  { name: "orange", fill: "#ff9227", deep: "#c26206" },
  { name: "yellow", fill: "#ffd23c", deep: "#c19206" },
  { name: "green", fill: "#4cbe58", deep: "#2a8134" },
  { name: "blue", fill: "#2f8fdc", deep: "#175f97" },
  { name: "purple", fill: "#9a63e0", deep: "#6335a4" },
  { name: "pink", fill: "#ff7fb0", deep: "#cc4a7d" },
  { name: "brown", fill: "#a3714a", deep: "#6f4726" },
  { name: "black", fill: "#3b4453", deep: "#222a36" },
] as const;

export const BLUE_CRAYON = 4;
export const ORANGE_CRAYON = 1;

/** Where a crayon stands in the box, in composition coordinates. */
export function crayonAt(i: number): { x: number; y: number } {
  const gap = CRAYON_BOX.w / CRAYONS.length;
  return {
    x: CRAYON_BOX.x - CRAYON_BOX.w / 2 + gap * (i + 0.5),
    y: CRAYON_BOX.y - 40,
  };
}

/** The empty band across the top of the drawing — the sky the kid colours in. */
export const SKY_BAND = {
  x0: PAGE.x - PAGE.w / 2 + 34,
  x1: PAGE.x + PAGE.w / 2 - 34,
  y0: PAGE.y - PAGE.h / 2 + 30,
  y1: PAGE.y - PAGE.h / 2 + 196,
} as const;

// ---------------------------------------------------------------------------
// Scene 1 — A kid, a picture, and a box of crayons
// ---------------------------------------------------------------------------

/**
 * The pick, in the sixty frames the script bought for it.
 *
 * Every number below is a fraction of that held beat rather than a scene frame,
 * so the whole gag moves with the beat if the gap in Video.tsx ever changes —
 * and if the beat were shortened the phases would compress rather than the hand
 * still colouring after the silence had ended.
 *
 * The shape of it is the joke: the hand **hesitates** (it arrives over the box
 * and slides along the row, passing four perfectly good colours), and then it
 * does the only thing it was ever going to do.
 */
const PICK = {
  /** Arrives over the row. */
  reach: 0.1,
  /** Slides along it, considering. */
  browse: 0.3,
  /** Down, and the blue lifts out. */
  take: 0.4,
  /** Carried to the left-hand end of the band. */
  carry: 0.54,
  /** Colouring, left to right. */
  colourFrom: 0.56,
  colourTo: 0.95,
} as const;

const CrayonScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();

  const [pickFrom, pickTo] = heldBeat(scene, "co_03_narrator");
  const [tiltFrom, tiltTo] = heldBeat(scene, "co_05_narrator");
  const span = Math.max(1, pickTo - pickFrom);
  const u = (frame - pickFrom) / span;

  // The hand starts drifting towards the box on "Watch which one they pick",
  // i.e. under the *end* of co_03 — the silence must open with the hand already
  // hovering, or the first thing in the beat is a hand deciding to move.
  const approach = kidEase.easeInOutSine((lineProgress(scene, "co_03_narrator", frame) - 0.62) / 0.38);

  const hand = handAt(u, approach);
  // How much of the band is blue — the high-water mark of the hand's own two
  // passes, so the ink and the crayon tip are never in different places.
  const inked = u < PICK.colourFrom ? 0 : inkedTo(colourT(u));

  // The tilt up off the page. The world slides down and out of frame and the
  // sky comes in over the top of it, which is a camera tilting up.
  const tilt = kidEase.easeInOutSine((frame - tiltFrom) / Math.max(1, (tiltTo - tiltFrom) * 0.72));

  // A very slow push in on the page for the whole first half. The frame is
  // otherwise a still life for fifteen seconds; without it the cold open reads
  // as a photograph with a voice over it.
  const zoom = interpolate(frame, [0, pickTo], [1, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  return (
    <AbsoluteFill style={{ background: kidTheme.skyLow, overflow: "hidden" }}>
      {/* The sky the camera tilts up into, parked one frame-height above the
          ground and riding down with it. `drift={0}`: the shot is a held
          question and a breathing sky would be an answer to it. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: -HEIGHT_PX + tilt * HEIGHT_PX,
          width: WIDTH_PX,
          height: HEIGHT_PX,
        }}
      >
        <PaintedSky bg="hill_day" drift={0} dy={-120} zoom={1 + tilt * 0.06} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${tilt * HEIGHT_PX}px)`,
        }}
      >
        {/* Straight down at a patch of late-afternoon lawn. */}
        <PaintedSky bg="grass_overhead" drift={6} phase={0.4} />
        {/* The ground has to *end* somewhere as the camera leaves it, and a
            hard edge between two plates is a cut, not a tilt. This is the
            ground dissolving into haze at the top of its own layer, which is
            what the far end of a lawn does when you look up off it. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: -2,
            width: WIDTH_PX,
            height: 210,
            background: `linear-gradient(to top, rgba(196,224,140,0) 0%, rgba(203,228,168,0.75) 55%, ${kidTheme.skyLow} 100%)`,
            opacity: tilt > 0 ? 1 : 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: `${PAGE.x}px ${PAGE.y}px`,
            transform: `scale(${zoom})`,
          }}
        >
          <PageShadow />
          <CrayonDrawing blue={inked} orange={0} />
          <CrayonBox lifted={hand.carrying ? BLUE_CRAYON : -1} />
          <OverheadKid />
          <Hand
            x={hand.x}
            y={hand.y}
            press={hand.press}
            carrying={hand.carrying ? CRAYONS[BLUE_CRAYON] : null}
            tiltDeg={hand.tilt}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const WIDTH_PX = 1920;
const HEIGHT_PX = 1080;

/**
 * Where the right hand is at `u` (0..1 through the held beat), whether it is
 * holding the blue, and how hard it is pressing.
 *
 * `approach` (0..1) runs *before* the beat and only moves the hand from its
 * resting place to the top of the box, so that the silence opens on a hand
 * already hovering.
 */
function handAt(
  u: number,
  approach: number,
): { x: number; y: number; press: number; carrying: boolean; tilt: number } {
  const rest = { x: 1290, y: 880 };
  const overBox = { x: crayonAt(0).x - 10, y: CRAYON_BOX.y - 210 };
  const overBlue = { x: crayonAt(BLUE_CRAYON).x, y: CRAYON_BOX.y - 210 };
  const atBlue = { x: crayonAt(BLUE_CRAYON).x, y: CRAYON_BOX.y - 96 };
  // The two ends of the stroke are where the crayon's **tip** has to be, so the
  // palm sits back up the shaft from them (`palmFor`). Placing the palm on the
  // band instead puts the tip a hundred and forty pixels below it, drawing on
  // the tree — which is exactly what a still catches and a description does not.
  const bandLeft = palmFor(
    { x: SKY_BAND.x0 + 44, y: (SKY_BAND.y0 + SKY_BAND.y1) / 2 },
    COLOUR_TILT,
  );
  const bandRight = palmFor(
    { x: SKY_BAND.x1 - 44, y: (SKY_BAND.y0 + SKY_BAND.y1) / 2 },
    COLOUR_TILT,
  );

  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  });

  if (u < 0) {
    const p = lerp(rest, overBox, Math.max(0, Math.min(1, approach)));
    return { ...p, press: 0, carrying: false, tilt: -14 };
  }
  if (u < PICK.reach) {
    const p = lerp(overBox, overBox, 1);
    return { ...p, press: 0, carrying: false, tilt: -14 };
  }
  if (u < PICK.browse) {
    // Along the row, considering. Slow, and it passes four colours.
    const t = kidEase.easeInOutSine((u - PICK.reach) / (PICK.browse - PICK.reach));
    const p = lerp(overBox, overBlue, t);
    return { ...p, press: 0, carrying: false, tilt: -14 + t * 4 };
  }
  if (u < PICK.take) {
    // Down onto the blue and back up with it.
    const t = (u - PICK.browse) / (PICK.take - PICK.browse);
    const dip = Math.sin(t * Math.PI);
    const p = lerp(overBlue, atBlue, dip);
    return { ...p, press: 0, carrying: t > 0.5, tilt: -10 };
  }
  if (u < PICK.carry) {
    const t = kidEase.easeInOutSine((u - PICK.take) / (PICK.carry - PICK.take));
    const p = lerp(overBlue, bandLeft, t);
    return { ...p, press: 0, carrying: true, tilt: -10 + t * (COLOUR_TILT + 10) };
  }
  const t = colourT(u);
  const p = lerp(bandLeft, bandRight, scribbleSweep(t));
  return {
    x: p.x,
    y: p.y + Math.sin(t * Math.PI * 7) * 9,
    press: 1,
    carrying: true,
    tilt: COLOUR_TILT,
  };
}

/** How far through the colouring, 0..1. */
function colourT(u: number): number {
  return Math.max(
    0,
    Math.min(1, (u - PICK.colourFrom) / (PICK.colourTo - PICK.colourFrom)),
  );
}

/**
 * Where along the band the crayon is, 0..1, over two passes — because a child
 * colouring a strip goes most of the way, comes back, and finishes it, and a
 * single left-to-right wipe reads as a fill animation.
 *
 * **Every segment is eased and the ends meet.** The first pass at this was
 * `t < 0.5 ? t * 2 : 0.62 + …`, which crosses the whole band and then jumps
 * back to 62% of it in one frame: two hundred and fifty pixels of teleport that
 * plays as a dropped frame, and the hand is the only thing moving in a beat the
 * script bought two seconds of silence for.
 */
function scribbleSweep(t: number): number {
  if (t < 0.4) return 0.66 * kidEase.easeInOutSine(t / 0.4);
  if (t < 0.55) return 0.66 - 0.42 * kidEase.easeInOutSine((t - 0.4) / 0.15);
  return 0.24 + 0.76 * kidEase.easeInOutSine((t - 0.55) / 0.45);
}

/**
 * How much of the band is blue: the furthest right the crayon has *been*, not
 * where it is now. Ink does not come off the paper when the hand goes back over
 * it, and a band that un-colours itself on the return pass is the one thing
 * here nobody would forgive.
 */
function inkedTo(t: number): number {
  return Math.max(scribbleSweep(t), 0.66 * kidEase.easeInOutSine(t / 0.4));
}

/** The crayon's angle in the hand while colouring, in degrees. */
const COLOUR_TILT = 14;

/**
 * The palm position that puts the crayon's tip at `tip`.
 *
 * `Hand` draws the crayon in the palm's own frame, rotated a further 28° and
 * running 186px down the shaft to the point, so the tip is nowhere near the
 * coordinate the hand was given. Anything the crayon has to actually touch is
 * therefore a tip target, converted here.
 */
const CRAYON_REACH = 186;
function palmFor(tip: { x: number; y: number }, tiltDeg: number): { x: number; y: number } {
  const th = ((tiltDeg + 28) * Math.PI) / 180;
  return {
    x: tip.x + CRAYON_REACH * Math.sin(th),
    y: tip.y - CRAYON_REACH * Math.cos(th),
  };
}

// ---------------------------------------------------------------------------
// Scene 2 — Title, and a theory
// ---------------------------------------------------------------------------

const TITLE: Array<{ text: string; size: number }> = [
  { text: "RAY", size: 170 },
  { text: "AND THE SKY", size: 76 },
  { text: "NOBODY PAINTED", size: 76 },
];

/** Top of the title block. The whole scene's layout hangs off this number. */
const TITLE_TOP = 300;

/**
 * Sunny leans in from the top corner, as scripted, and **the title lives below
 * him rather than behind him**.
 *
 * That is a layout note worth writing down because the first pass got it wrong
 * in a way a still catches instantly and a description does not: his bubble has
 * to sit *somewhere*, a bubble sits above its speaker, and a speaker in the top
 * corner puts his bubble exactly where "RAY" is. The word was completely
 * covered by it. Top strip for Sunny and his bubble, everything below for the
 * card.
 */
const S2_SUNNY: Mark = {
  x: 1690,
  y: hover("sunny", 215, 1.2),
  scale: 1.2,
  who: "sunny",
  side: "left",
};

const S2_BUBBLES: Record<string, string> = {
  // Six words. "I DID! It was ME!" is the whole claim, and the claim is what
  // the audience is being told to hold onto.
  co_08_sunny: "I DID! I painted it!",
};

const TitleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [claimFrom, claimTo] = lineWindow(scene, "co_08_sunny");

  // The title paints itself on: one broad stroke per line, left to right.
  const paint = (i: number): number => kidEase.easeInOutSine((frame - 6 - i * 22) / 30);

  // …and Sunny arrives exactly as the **last line** is being laid down, so the
  // final stroke of the title turns out to be his. He leans in from the top
  // corner rather than entering, which is the only way a character who is also
  // the sun can have been "off screen".
  const arriveAt = claimFrom + Math.round((claimTo - claimFrom) * 0.4);
  const lean = spring({ frame: frame - arriveAt, fps, config: { damping: 13, mass: 0.8 } });

  const pill = spring({
    frame: frame - claimTo + 14,
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  const emotion = useEmotion(scene, "sunny", { co_08_sunny: "excited" }, "proud", 0);

  return (
    <AbsoluteFill>
      <PaintedSky bg="hill_day" drift={0} dy={-120} zoom={1.06} />

      <PaintedTitle paint={paint} />

      {/* Sunny, leaning in from the top right, with the roller sitting on the
          right-hand end of the last line he just "painted". `wet` is 1 here and
          nowhere else in the episode: this is the only moment the show lets him
          look like he might be telling the truth. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${(1 - lean) * 300}px, ${(1 - lean) * -430}px) rotate(${(1 - lean) * 9}deg)`,
          transformOrigin: "100% 0%",
        }}
      >
        <PaintRoller
          x={1462}
          y={556}
          scale={1.06}
          rot={-122 + settleWave((frame - arriveAt) / 40, 1.2, 4) * 8}
          wet={1}
          zIndex={12}
        />
        <Sunny
          x={S2_SUNNY.x}
          y={S2_SUNNY.y}
          scale={1.2}
          phase={PHASE.sunny}
          emotion={emotion}
          speaking={useStage(scene).speaking("sunny")}
          look={{ x: -0.6, y: 0.35 }}
          zIndex={14}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 790,
          textAlign: "center",
          fontFamily: kidTheme.fontFamily,
          opacity: Math.max(0, Math.min(1, pill * 1.4)),
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: kidTheme.paper,
            border: `7px solid ${kidTheme.ink}`,
            borderRadius: kidRadius.pill,
            padding: "10px 44px",
            fontSize: kidType.min,
            fontWeight: 900,
            letterSpacing: 6,
            color: kidTheme.ink,
            boxShadow: kidShadow(1),
            transform: `scale(${pill})`,
          }}
        >
          LITTLE BIG WORLD · EPISODE THREE
        </span>
      </div>

      <Bubbles
        scene={scene}
        cast={{ sunny: S2_SUNNY } as Cast}
        text={S2_BUBBLES}
        at={{ co_08_sunny: { x: 700, y: 186, tail: "right", tailAt: 1500 } }}
      />
    </AbsoluteFill>
  );
};

/**
 * The title, painting itself on in wide brush strokes.
 *
 * Episode two's title was *blown* in, letter by letter, because that episode
 * was about wind. This one is painted, because this one is about a theory that
 * somebody painted the sky — and the last stroke of it turns out to be Sunny's,
 * which only lands if the audience has just watched the rest of it arrive the
 * same way.
 *
 * Each line is a sky-blue band that widens left to right with the text clipped
 * to it, so the letters emerge *out of the paint* rather than fading up on top
 * of it. The band's right-hand end is left ragged (a second, shorter band a few
 * pixels behind) so the stroke has a brush edge instead of a ruler edge.
 */
const PaintedTitle: React.FC<{ paint: (i: number) => number }> = ({ paint }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: TITLE_TOP,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      fontFamily: kidTheme.fontFamily,
      pointerEvents: "none",
    }}
  >
    {TITLE.map((line, i) => {
      const p = Math.max(0, Math.min(1, paint(i)));
      if (p <= 0) return <div key={line.text} style={{ height: line.size * 1.06 }} />;
      return (
        <div key={line.text} style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: -30,
              right: -30,
              top: line.size * 0.1,
              bottom: line.size * 0.1,
              background: kidTheme.skyMid,
              borderRadius: kidRadius.chip,
              opacity: 0.5,
              clipPath: `inset(0 ${(1 - p) * 100}% 0 0 round ${kidRadius.chip}px)`,
            }}
          />
          <div
            style={{
              position: "relative",
              fontSize: line.size,
              fontWeight: 900,
              lineHeight: 1.06,
              letterSpacing: 2,
              color: kidTheme.paper,
              WebkitTextStroke: `${Math.round(line.size * 0.055)}px ${kidTheme.ink}`,
              paintOrder: "stroke",
              textShadow: `0 ${Math.round(line.size * 0.05)}px 0 rgba(36,52,71,0.35)`,
              clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
            }}
          >
            {line.text}
          </div>
        </div>
      );
    })}
  </div>
);

// ---------------------------------------------------------------------------
// The overhead world — the page, the box, the kid and the hand
// ---------------------------------------------------------------------------
//
// All four are new drawings rather than the standing `KidSilhouette` episode
// two used, and they have to be: this shot is **straight down** at a child
// lying on their front, and a body drawn to be seen from the side has no
// overhead pose. What carries across from episode two is the rule, not the
// component — no face ever, not one word in three episodes, and the *prop* is
// the entire emotional readout.

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
      boxShadow: "0 26px 46px rgba(24,44,22,0.34)",
      background: "#fffdf6",
    }}
  />
);

/**
 * The drawing. A house, a tree, a wobbly path, three flowers, a strip of grass
 * — and an empty white band across the top where the sky goes.
 *
 * Everything is drawn the way a six-year-old draws: nothing is straight,
 * nothing quite meets, the windows are too big and the roof overhangs. That is
 * a deliberate amount of work for one prop, and it is worth it twice over —
 * this picture is the first thing the audience sees the show do, and it comes
 * back in Scene 30 as the last thing that happens in the story.
 *
 * `blue` fills the sky band left to right (the cold open). `orange` then goes
 * over the top of it (Scene 30), which is why they are two props and not one:
 * at the end of the episode both are on the page at once.
 */
export const CrayonDrawing: React.FC<{ blue: number; orange: number }> = ({
  blue,
  orange,
}) => {
  const left = PAGE.x - PAGE.w / 2;
  const top = PAGE.y - PAGE.h / 2;
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
        background: "#fffdf6",
      }}
    >
      <svg width={PAGE.w} height={PAGE.h} viewBox={`0 0 ${PAGE.w} ${PAGE.h}`}>
        {/* The sky band, coloured in. Waxy: a solid block with a scribbled
            leading edge and a few paler gaps where the crayon skipped. */}
        <CrayonBand
          progress={blue}
          color={CRAYONS[BLUE_CRAYON].fill}
          seed={0}
          y0={SKY_BAND.y0 - top}
          y1={SKY_BAND.y1 - top}
          x0={SKY_BAND.x0 - left}
          x1={SKY_BAND.x1 - left}
        />
        <CrayonBand
          progress={orange}
          color={CRAYONS[ORANGE_CRAYON].fill}
          seed={3}
          y0={SKY_BAND.y0 - top}
          y1={SKY_BAND.y1 - top}
          x0={SKY_BAND.x0 - left}
          x1={SKY_BAND.x1 - left}
        />

        {/* Grass: one wobbly green line with tufts on it, about a third up. */}
        <path
          d="M 26 452 q 90 -14 180 -4 q 100 12 190 -6 q 110 -20 208 2 q 70 16 128 2"
          stroke="#4cbe58"
          strokeWidth={17}
          strokeLinecap="round"
          fill="none"
        />
        {[70, 150, 250, 470, 560, 660].map((x, i) => (
          <path
            key={x}
            d={`M ${x} ${452 - (i % 2) * 4} l ${-8 + i * 2} -26`}
            stroke="#4cbe58"
            strokeWidth={9}
            strokeLinecap="round"
          />
        ))}

        {/* The house. Square-ish, roof too big, door off centre. */}
        <path
          d="M 118 452 L 124 292 L 356 286 L 350 450 Z"
          fill="#ffe9a8"
          stroke="#a3714a"
          strokeWidth={11}
          strokeLinejoin="round"
        />
        <path
          d="M 100 296 L 238 196 L 372 292 Z"
          fill="#ea4b3c"
          stroke="#b2291c"
          strokeWidth={11}
          strokeLinejoin="round"
        />
        <rect x={196} y={368} width={72} height={84} rx={4} fill="#a3714a" stroke="#6f4726" strokeWidth={8} />
        <circle cx={254} cy={412} r={7} fill="#3b4453" />
        {[
          [140, 320],
          [286, 318],
        ].map(([x, y]) => (
          <g key={x}>
            <rect x={x} y={y} width={62} height={54} rx={3} fill="#9fdcff" stroke="#175f97" strokeWidth={8} />
            <path d={`M ${x + 31} ${y} L ${x + 31} ${y + 54} M ${x} ${y + 27} L ${x + 62} ${y + 27}`} stroke="#175f97" strokeWidth={6} />
          </g>
        ))}

        {/* The tree. A brown trunk and one big green scribble. */}
        <path d="M 596 452 L 590 348" stroke="#a3714a" strokeWidth={22} strokeLinecap="round" />
        <circle cx={588} cy={300} r={76} fill="#4cbe58" stroke="#2a8134" strokeWidth={10} />
        <circle cx={548} cy={334} r={44} fill="#4cbe58" stroke="#2a8134" strokeWidth={10} />
        <circle cx={636} cy={330} r={40} fill="#4cbe58" stroke="#2a8134" strokeWidth={10} />

        {/* A path from the door to the bottom of the page, and three flowers. */}
        <path
          d="M 232 452 q -22 60 -6 118"
          stroke="#c9b48a"
          strokeWidth={26}
          strokeLinecap="round"
          fill="none"
        />
        {[
          [400, 508, "#ff7fb0"],
          [456, 540, "#ffd23c"],
          [346, 546, "#9a63e0"],
        ].map(([x, y, c]) => (
          <g key={`${x}`}>
            <path d={`M ${x} ${Number(y) + 40} L ${x} ${y}`} stroke="#4cbe58" strokeWidth={8} strokeLinecap="round" />
            {[0, 1, 2, 3, 4].map((k) => (
              <circle
                key={k}
                cx={Number(x) + Math.cos((k / 5) * Math.PI * 2) * 17}
                cy={Number(y) + Math.sin((k / 5) * Math.PI * 2) * 17}
                r={11}
                fill={String(c)}
              />
            ))}
            <circle cx={Number(x)} cy={Number(y)} r={9} fill="#ffd23c" />
          </g>
        ))}
      </svg>
    </div>
  );
};

/**
 * One crayon pass across the sky band.
 *
 * `progress` 0..1 reveals it left to right with a **ragged** leading edge —
 * eight overlapping strokes of slightly different length, so the front of the
 * colour is a scribble rather than a wipe. A straight edge would read as a
 * loading bar, and the whole point of the beat is that a hand did this.
 */
const CrayonBand: React.FC<{
  progress: number;
  color: string;
  seed: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}> = ({ progress, color, seed, x0, x1, y0, y1 }) => {
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0.002) return null;
  const rows = 8;
  const h = (y1 - y0) / rows;
  return (
    <g opacity={0.92}>
      {Array.from({ length: rows }, (_, i) => {
        // Each stroke runs a little ahead of or behind the others.
        const lead = ((i * 37 + seed * 53) % 11) / 11;
        const t = Math.max(0, Math.min(1, p * 1.16 - lead * 0.16));
        if (t <= 0) return null;
        return (
          <rect
            key={i}
            x={x0}
            // Strokes overlap by a third of their height rather than butting up
            // against each other. Eight rows that only just touch read as ruled
            // lines on notepaper; eight that overlap read as one waxy block
            // with a ragged front, which is what a crayon does.
            y={y0 + i * h - h * 0.34}
            width={(x1 - x0) * t}
            height={h * 1.68}
            fill={color}
            opacity={0.62 + ((i * 29 + seed) % 4) * 0.03}
          />
        );
      })}
    </g>
  );
};

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
      <rect
        x={4}
        y={4}
        width={CRAYON_BOX.w + 44}
        height={CRAYON_BOX.h + 44}
        rx={22}
        fill="#d8b98a"
        stroke="#8a6134"
        strokeWidth={10}
      />
      <rect
        x={22}
        y={22}
        width={CRAYON_BOX.w + 8}
        height={CRAYON_BOX.h + 8}
        rx={14}
        fill="#c19d68"
      />
      {CRAYONS.map((c, i) => {
        const gap = CRAYON_BOX.w / CRAYONS.length;
        const x = 26 + gap * (i + 0.5) - 11;
        // The one that has been taken out is simply not in the box.
        if (i === lifted) return null;
        return (
          <g key={c.name}>
            <rect x={x} y={70 + ((i * 17) % 14)} width={23} height={CRAYON_BOX.h - 78} rx={11} fill={c.fill} stroke={c.deep} strokeWidth={5} />
            {/* The paper wrapper, because a crayon seen from above is two
                thirds paper and a third wax. */}
            <rect x={x + 1} y={132 + ((i * 17) % 14)} width={21} height={CRAYON_BOX.h - 214} fill="#fffdf6" opacity={0.55} />
          </g>
        );
      })}
    </svg>
  </div>
);

/**
 * The kid, from above, lying on their front. Head, shoulders, two arms
 * reaching up the page, and the backs of two hands — never a face, three
 * episodes running.
 *
 * The left hand rests on the corner of the paper holding it flat, which is what
 * a real child does and what makes the right hand read as *the* hand.
 */
const OverheadKid: React.FC = () => (
  <svg
    width={WIDTH_PX}
    height={HEIGHT_PX}
    viewBox={`0 0 ${WIDTH_PX} ${HEIGHT_PX}`}
    style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
  >
    <g opacity={0.94}>
      {/* Shoulders and back, running off the bottom of frame. */}
      <path
        d="M 590 1140 Q 620 900 760 852 L 1120 846 Q 1276 894 1300 1140 Z"
        fill={kidTheme.ink}
      />
      {/* Head, seen from above: the crown, with a scruff of hair. */}
      <ellipse cx={942} cy={806} rx={104} ry={92} fill={kidTheme.ink} />
      <path
        d="M 852 786 q 44 -52 100 -40 q 62 12 84 54"
        stroke={kidTheme.ink}
        strokeWidth={30}
        strokeLinecap="round"
        fill="none"
      />
      {/* Left arm, out to the bottom corner of the page, holding it flat —
          which is what a real child does, and what makes the *right* hand read
          as the one making a decision. Kept low and outside the drawing: an
          arm lying across the house was covering the thing the audience is
          being asked to look at. */}
      <path
        d="M 782 902 Q 640 900 512 866"
        stroke={kidTheme.ink}
        strokeWidth={60}
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx={486} cy={856} rx={54} ry={42} fill={kidTheme.ink} transform="rotate(-14 486 856)" />
    </g>
  </svg>
);

/**
 * The right hand and forearm — the only thing in the cold open that acts.
 *
 * Drawn from above: a forearm running down out of frame towards the kid's
 * shoulder, the back of a hand, and four stubby fingers. When it is carrying a
 * crayon the crayon is drawn *between* the fingers and the thumb, tilted the
 * way a child holds one, and `press` squashes the hand a little and puts the
 * crayon's tip on the paper.
 */
const Hand: React.FC<{
  x: number;
  y: number;
  press: number;
  carrying: (typeof CRAYONS)[number] | null;
  tiltDeg: number;
}> = ({ x, y, press, carrying, tiltDeg }) => {
  // The forearm always runs back to the same shoulder, so the hand can go
  // anywhere and the arm still belongs to the body.
  const shoulder = { x: 1178, y: 962 };
  return (
    <svg
      width={WIDTH_PX}
      height={HEIGHT_PX}
      viewBox={`0 0 ${WIDTH_PX} ${HEIGHT_PX}`}
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
          <rect
            key={fx}
            x={fx - 11}
            y={-4}
            width={22}
            height={62 - Math.abs(i - 1.5) * 8}
            rx={11}
            fill={kidTheme.ink}
          />
        ))}
        {/* Thumb, tucked across — this is what holds the crayon. */}
        <ellipse cx={-52} cy={12} rx={20} ry={30} fill={kidTheme.ink} transform="rotate(-28 -52 12)" />
      </g>
    </svg>
  );
};

export const COLD_OPEN_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s01_crayon: CrayonScene,
  s02_title: TitleScene,
};
