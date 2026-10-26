import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { kidEase, kidTheme, mixHex } from "../../../lib/kid";

// THE KID — silhouette, silent, sixth canon episode running. Two new poses,
// both this episode's:
//
//   KidLying      Scene 1: flat on the grass, bare feet in the air, too hot to
//                 move.
//   KidAtWindow   Scene 2 to the end card: indoors, seen from BEHIND, at the
//                 window, with both hands on the sill — and THE COUNTABLE
//                 FINGERS, the first time in six shows the kid does the thing
//                 the audience can copy.
//
// Flat ink at 0.92, no outline, no features, no face, ever (the series rule).
//
// ---------------------------------------------------------------------------
// THE HANDS' VOCABULARY (what an act can ask of them)
//
//   CAN     hold 0..10 fingers up — `fingers` is a FLOAT: the whole part is
//           fingers fully up, the fraction is the next one rising (drive it
//           from `fingersAt()` in common.tsx and it climbs on the count
//           grid by itself). Order: the frame-left hand fills first, index →
//           middle → ring → little → thumb (1–5), then the frame-right hand
//           the same way (6–10). Ten up = "all the fingers".
//           rest on the sill as two loose fists (`fingers` 0);
//           be raised off the sill towards the glass (`raise`, 0..1) — Scene
//           14's "holds up three fingers at the hotel", Scene 26's wave;
//           wave (`wave`, 0..1 — the frame-right hand sways, fingers open).
//   CANNOT  count past ten, show a fist with a number, or point at anything
//           (pointing is a different hand shape and nobody has asked for it);
//           leave the sill sideways — the hands' x is fixed to the kid.
//
// The kid themself CAN `lean` in (0..1 — closer to the glass, the loudest
// moment), pull the `blanket` up (0..1 — over the shoulders, then up to the
// ears), and feel the `wind` (0..1 — the gust front lifts the hair tuft).

const INK = kidTheme.ink;

export type KidAtWindowProps = {
  /** Centre of the kid's head, composition px. */
  x: number;
  /** The sill line the hands rest on. */
  sill: number;
  scale?: number;
  /** 0..10, float. See the hands' vocabulary above. */
  fingers?: number;
  /** Hands lifted off the sill towards the glass, 0..1. */
  raise?: number;
  /** The frame-right hand waves, 0..1. */
  wave?: number;
  lean?: number;
  blanket?: number;
  wind?: number;
  /** The blanket's colour — cosy, never ink. */
  blanketColor?: string;
  opacity?: number;
};

/** Where each hand sits, relative to the kid's x, at scale 1. */
export const HAND_SPREAD = 270;
/** Hand size against the body — big, because the hands are the count. */
export const HAND_SIZE = 1.35;

export const KidAtWindow: React.FC<KidAtWindowProps> = ({
  x,
  sill,
  scale = 1,
  fingers = 0,
  raise = 0,
  wave = 0,
  lean = 0,
  blanket = 0,
  wind = 0,
  blanketColor = "#c8584a",
  // Opaque: at the window the kid is IN FRONT of the glass, and a 0.94 ink
  // let the rings outside show through the hands (repair R2).
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const s = scale * (1 + 0.06 * lean);
  const breath = Math.sin(t * 1.6) * 3;
  // Head and shoulders, seen from behind, the head just above the sill.
  const headY = sill - 170 * s - lean * 26 * s + breath * 0.4;
  const headR = 92 * s;
  const shoulderY = sill + 40 * s + breath;
  const tuft = Math.sin(t * 5.2) * 14 * wind + wind * 18;
  const raiseY = raise * 120 * s;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", opacity }}
    >
      <g fill={INK}>
        {/* Forearms: from the shoulders out and up to each hand. Drawn first,
            so the shoulders sit over their roots. */}
        {[-1, 1].map((side) => {
          const hx = x + side * HAND_SPREAD * s;
          const hy = sill - 8 * s - raiseY;
          return (
            <path
              key={side}
              d={`M ${x + side * 120 * s} ${shoulderY - 20 * s} Q ${x + side * 230 * s} ${sill + 30 * s} ${hx} ${hy + 20 * s}`}
              stroke={INK}
              strokeWidth={62 * s}
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
        {/* Shoulders and back: a wide soft dome running off the bottom. */}
        <path
          d={
            `M ${x - 300 * s} 1180 ` +
            `C ${x - 300 * s} ${shoulderY + 10 * s} ${x - 220 * s} ${shoulderY - 70 * s} ${x - 90 * s} ${shoulderY - 80 * s} ` +
            `L ${x + 90 * s} ${shoulderY - 80 * s} ` +
            `C ${x + 220 * s} ${shoulderY - 70 * s} ${x + 300 * s} ${shoulderY + 10 * s} ${x + 300 * s} 1180 Z`
          }
        />
        {/* Neck + head + the tuft (the one thing the wind can move). */}
        <rect x={x - 46 * s} y={headY + headR * 0.4} width={92 * s} height={shoulderY - headY} rx={30 * s} />
        <circle cx={x} cy={headY} r={headR} />
        <path
          d={`M ${x - headR * 0.5} ${headY - headR * 0.82} q ${30 * s + tuft * 0.4} ${-44 * s - tuft * 0.2} ${74 * s + tuft} ${-30 * s}`}
          stroke={INK}
          strokeWidth={24 * s}
          strokeLinecap="round"
          fill="none"
        />
      </g>
      {/* The blanket: over the shoulders, and up to the ears at full. */}
      {blanket > 0.01 ? (
        <path
          d={
            `M ${x - 320 * s} 1180 ` +
            `C ${x - 330 * s} ${shoulderY - 40 * s * blanket} ${x - 200 * s} ${shoulderY - (90 + 120 * blanket) * s} ${x - 70 * s} ${shoulderY - (70 + 140 * blanket) * s} ` +
            `Q ${x} ${shoulderY - (40 + 110 * blanket) * s} ${x + 70 * s} ${shoulderY - (70 + 140 * blanket) * s} ` +
            `C ${x + 200 * s} ${shoulderY - (90 + 120 * blanket) * s} ${x + 330 * s} ${shoulderY - 40 * s * blanket} ${x + 320 * s} 1180 Z`
          }
          fill={blanketColor}
          stroke={mixHex(blanketColor, INK, 0.5)}
          strokeWidth={6 * s}
          opacity={Math.min(1, blanket * 3)}
        />
      ) : null}
      {/* THE HANDS. */}
      {[-1, 1].map((side, h) => {
        const hx = x + side * HAND_SPREAD * s;
        const hy = sill - raiseY;
        const waveA = side > 0 ? wave * Math.sin(t * 7) * 14 : 0;
        return (
          <Hand
            key={side}
            x={hx}
            y={hy}
            scale={s}
            side={side as -1 | 1}
            up={(i) => fingerUp(fingers, h * 5 + i, side > 0 ? wave : 0)}
            tilt={waveA}
          />
        );
      })}
    </svg>
  );
};

/** How far finger `n` (0-based, 0..9) is up for a `fingers` float. */
function fingerUp(fingers: number, n: number, wave: number): number {
  const u = Math.max(0, Math.min(1, fingers - n));
  // easeOutBack: the finger overshoots a touch and settles — it is a kid's
  // finger going UP, not a bar filling.
  const raised = u <= 0 ? 0 : u >= 1 ? 1 : kidEase.easeOutBack(u);
  return Math.max(raised, wave);
}

/**
 * One hand from behind, resting on its heel at `y`. Fingers are rounded bars;
 * a finger down is a short knuckle bump, a finger up is the full length.
 * Order within the hand: index, middle, ring, little, thumb (`up(i)`, i 0..4).
 */
const Hand: React.FC<{
  x: number;
  y: number;
  scale: number;
  side: -1 | 1;
  up: (i: number) => number;
  tilt: number;
}> = ({ x, y, scale: s0, side, up, tilt }) => {
  // The hands are drawn BIG on purpose: during every count they are the
  // picture (script.md: "the kid's hand is the picture"), and a six-year-old
  // copies what they can read from the back of the room.
  const s = s0 * HAND_SIZE;
  // From behind, the thumb is on the side towards the kid's middle: the
  // frame-left hand's thumb points right (+1), the frame-right hand's left.
  const inward = -side;
  const palmW = 112 * s;
  const palmH = 92 * s;
  const top = y - palmH;
  // Index nearest the thumb, little finger outermost.
  const fingersX = [0.3, 0.1, -0.1, -0.3].map((f) => x + inward * f * palmW * 1.05);
  const lens = [96, 104, 96, 78];
  return (
    <g fill={INK} transform={`rotate(${tilt.toFixed(2)} ${x} ${y})`}>
      <rect x={x - palmW / 2} y={top} width={palmW} height={palmH} rx={34 * s} />
      {fingersX.map((fx, i) => {
        const u = up(i);
        const len = (24 + (lens[i] - 24) * u) * s;
        return (
          <rect
            key={i}
            x={fx - 12 * s}
            y={top - len + 14 * s}
            width={24 * s}
            height={len + 10 * s}
            rx={12 * s}
          />
        );
      })}
      {/* The thumb: out to the inward side, angled up as it rises. */}
      {(() => {
        const u = up(4);
        const ang = inward * (70 - 48 * u);
        const len = (34 + 46 * u) * s;
        const bx = x + inward * palmW * 0.42;
        const by = top + palmH * 0.5;
        return (
          <rect
            x={bx - 13 * s}
            y={by - len}
            width={26 * s}
            height={len + 12 * s}
            rx={13 * s}
            transform={`rotate(${ang.toFixed(2)} ${bx} ${by})`}
          />
        );
      })()}
    </g>
  );
};

/**
 * Scene 1: the kid flat on the grass, bare feet in the air. `x`,`y` is where
 * the back of the head meets the lawn; the body runs frame-right of it. The
 * feet wiggle (`wiggle`), which is the whole of "too hot to move".
 */
export const KidLying: React.FC<{ x: number; y: number; scale?: number; wiggle?: number; opacity?: number }> = ({
  x,
  y,
  scale: s = 1,
  wiggle = 1,
  opacity = 0.92,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const w = Math.sin(t * 3.1) * 6 * wiggle;
  const w2 = Math.sin(t * 3.1 + 1.7) * 6 * wiggle;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", opacity }}
    >
      <ellipse cx={x + 170 * s} cy={y + 10 * s} rx={280 * s} ry={24 * s} fill={INK} opacity={0.16} />
      <g fill={INK} stroke={INK} strokeLinecap="round" strokeLinejoin="round">
        {/* Head, resting on the lawn, and the tuft. */}
        <circle cx={x} cy={y - 46 * s} r={46 * s} stroke="none" />
        <path d={`M ${x - 30 * s} ${y - 84 * s} q 20 ${-26 * s} ${50 * s} ${-14 * s}`} strokeWidth={18 * s} fill="none" />
        {/* Torso, flat along the lawn. */}
        <path d={`M ${x + 40 * s} ${y - 40 * s} L ${x + 230 * s} ${y - 36 * s}`} strokeWidth={76 * s} fill="none" />
        {/* Arms flopped out on the grass — too hot to move. */}
        <path d={`M ${x + 70 * s} ${y - 26 * s} Q ${x + 40 * s} ${y + 4 * s} ${x - 20 * s} ${y + 4 * s}`} strokeWidth={24 * s} fill="none" />
        <path d={`M ${x + 120 * s} ${y - 30 * s} Q ${x + 160 * s} ${y + 2 * s} ${x + 210 * s} ${y + 4 * s}`} strokeWidth={24 * s} fill="none" />
        {/* Legs: thighs up, knees bent, shins up — bare feet in the air. */}
        <path d={`M ${x + 250 * s} ${y - 40 * s} L ${x + 330 * s} ${y - 150 * s} L ${x + 350 * s + w} ${y - 250 * s}`} strokeWidth={34 * s} fill="none" />
        <path d={`M ${x + 262 * s} ${y - 34 * s} L ${x + 370 * s} ${y - 120 * s} L ${x + 412 * s + w2} ${y - 214 * s}`} strokeWidth={34 * s} fill="none" />
        <ellipse cx={x + 356 * s + w} cy={y - 268 * s} rx={26 * s} ry={15 * s} stroke="none" transform={`rotate(-80 ${x + 356 * s + w} ${y - 268 * s})`} />
        <ellipse cx={x + 420 * s + w2} cy={y - 232 * s} rx={26 * s} ry={15 * s} stroke="none" transform={`rotate(-68 ${x + 420 * s + w2} ${y - 232 * s})`} />
      </g>
    </svg>
  );
};
