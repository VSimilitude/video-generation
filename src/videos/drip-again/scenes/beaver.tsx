import React from "react";
import { CharacterFrame, Face, kidTheme, useRig, type CharacterProps } from "../../../lib/kid";

// The Beaver — this video's one new speaking cameo (brief: "brown oval body,
// flat paddle tail, round ears, two big orange front teeth, a Character-style
// mouth so he can speak — no more detail than Drip has").
//
// Same rig as the cast (useRig + CharacterFrame + Face), so he blinks,
// breathes, talks and takes emotions exactly like them. His box is Drip's
// height (380, CHAR_BOX.beaver), so `stand("beaver", groundY)` plants him.
// The teeth hang from the upper lip over the mouth, so an open, talking mouth
// shows round them — that is what makes a beaver read as a beaver talking.

export const BEAVER = {
  fur: "#a46a3a",
  furDark: "#6f4322",
  furLight: "#d7ad80",
  tail: "#5b3a24",
  tailDark: "#3f2716",
  teeth: "#f39a2b",
  nose: "#3b2417",
} as const;

const W = 420;
const H = 380;
/** Face centre and size in local units: eyes ~-52, mouth ~-6. */
const FACE_Y = -42;
const FACE_SIZE = 1.2;
const MOUTH_Y = FACE_Y + 30 * FACE_SIZE;

export type BeaverProps = CharacterProps & {
  /** Jaw working on something (a tree, a stick): a quick small chomp. */
  chew?: boolean;
  /** Holding a stick across his front paws. */
  stick?: boolean;
  /** A drawn name tag on his chest (CHIP). */
  tag?: string;
  /** Ground shadow; off in water. */
  shadow?: boolean;
};

export const Beaver: React.FC<BeaverProps> = (props) => {
  const rig = useRig(props);
  const { chew = false, stick = false, tag, shadow = true } = props;
  // A chomp: two quick bites a second. Pure frame.
  const bite = chew ? Math.max(0, Math.sin(rig.frame / 2.6)) * 7 : 0;
  const tailSwing = Math.sin(rig.frame / 22 + rig.phase) * 4;
  const swing = rig.trail.dy * 0.35;
  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox="-210 -190 420 380"
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      {shadow ? <ellipse cx={20} cy={182} rx={150} ry={18} fill={kidTheme.ink} opacity={0.14} /> : null}
      {/* The flat paddle tail, behind him, poking out to his left-back. */}
      <g transform={`rotate(${-14 + tailSwing} 70 150)`}>
        <ellipse cx={168} cy={150} rx={96} ry={38} fill={BEAVER.tail} stroke={kidTheme.ink} strokeWidth={8} />
        {[-50, -16, 18, 52].map((dx) => (
          <path key={dx} d={`M ${168 + dx} 122 L ${168 + dx - 14} 178`} stroke={BEAVER.tailDark} strokeWidth={6} strokeLinecap="round" />
        ))}
        {[134, 164].map((dy) => (
          <path key={dy} d={`M 88 ${dy} Q 168 ${dy - 6} 250 ${dy}`} stroke={BEAVER.tailDark} strokeWidth={6} fill="none" strokeLinecap="round" />
        ))}
      </g>
      {/* Ears, behind the body so only the round tops show. */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <circle cx={s * 78} cy={-118} r={30} fill={BEAVER.fur} stroke={kidTheme.ink} strokeWidth={8} />
          <circle cx={s * 78} cy={-116} r={14} fill={BEAVER.furLight} />
        </g>
      ))}
      {/* Feet. */}
      {[-1, 1].map((s) => (
        <ellipse key={s} cx={s * 56} cy={172} rx={44} ry={18} fill={BEAVER.furDark} stroke={kidTheme.ink} strokeWidth={7} />
      ))}
      {/* Body: one tall oval, head and all, like Drip's one-piece silhouette. */}
      <ellipse cx={0} cy={22} rx={124} ry={150} fill={BEAVER.fur} stroke={kidTheme.ink} strokeWidth={9} />
      {/* Belly. */}
      <ellipse cx={0} cy={98} rx={78} ry={66} fill={BEAVER.furLight} opacity={0.9} />
      {tag ? <NameTag text={tag} /> : null}
      {/* Muzzle: a pale patch the nose, mouth and teeth sit on. */}
      <ellipse cx={0} cy={MOUTH_Y - 4} rx={58} ry={34} fill={BEAVER.furLight} />
      <Face
        rig={rig}
        x={0}
        y={FACE_Y}
        size={FACE_SIZE}
        skin={BEAVER.fur}
        blushColor="#ff8f86"
        blushStrength={1.6}
      />
      <ellipse cx={0} cy={MOUTH_Y - 18} rx={17} ry={11} fill={BEAVER.nose} />
      <ellipse cx={-5} cy={MOUTH_Y - 21} rx={6} ry={3.5} fill="#ffffff" opacity={0.5} />
      {/* The famous orange teeth. */}
      <g transform={`translate(0 ${MOUTH_Y + 2 + bite})`}>
        {[-1, 1].map((s) => (
          <rect
            key={s}
            x={s === -1 ? -23 : 1}
            y={0}
            width={22}
            height={36}
            rx={5}
            fill={BEAVER.teeth}
            stroke={kidTheme.ink}
            strokeWidth={5}
          />
        ))}
      </g>
      {/* Front paws. */}
      <g transform={`translate(0 ${swing})`}>
        {[-1, 1].map((s) => (
          <ellipse key={s} cx={s * 62} cy={62} rx={22} ry={18} fill={BEAVER.furDark} stroke={kidTheme.ink} strokeWidth={6} />
        ))}
        {stick ? <Stick x={0} y={74} len={250} angle={-8} /> : null}
      </g>
    </CharacterFrame>
  );
};

/** A stick, the dam's building block. */
export const Stick: React.FC<{ x: number; y: number; len: number; angle?: number; tone?: number }> = ({
  x,
  y,
  len,
  angle = 0,
  tone = 0,
}) => {
  const fill = tone % 2 ? "#8a5a32" : "#9c6a3c";
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-len / 2} y={-11} width={len} height={22} rx={11} fill={fill} stroke={kidTheme.ink} strokeWidth={6} />
      <path d={`M ${len * 0.18} -8 l 26 -24`} stroke={kidTheme.ink} strokeWidth={6} strokeLinecap="round" />
      <path d={`M ${len * 0.18} -8 l 26 -24`} stroke={fill} strokeWidth={0} />
      <ellipse cx={len / 2 - 6} cy={0} rx={6} ry={9} fill="#d8b082" />
    </g>
  );
};

const NameTag: React.FC<{ text: string }> = ({ text }) => (
  <g transform="translate(0 92) rotate(-6)">
    <rect x={-62} y={-24} width={124} height={48} rx={12} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={6} />
    <text
      x={0}
      y={12}
      textAnchor="middle"
      fontFamily={kidTheme.fontFamily}
      fontSize={32}
      fontWeight={900}
      letterSpacing={2}
      fill={kidTheme.tomato}
    >
      {text}
    </text>
  </g>
);
