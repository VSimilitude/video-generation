import React from "react";
import { useCurrentFrame } from "remotion";
import { Blobby, kidTheme, mixHex } from "../../../lib/kid";
import { Stick } from "./beaver";

// Scenery and props drawn for this video. Everything here is SVG and draws in
// composition coordinates, so it goes inside a `WideLayer` (some props are
// absolutely-positioned HTML/SVG furniture and say so).
//
// ONE pond, drawn once: `PondWorld`. The valley paths watch it form (dam), the
// mountain paths arrive at its left shore (race), and both meet on it (pond),
// so every shot of it shares these numbers. Water flows left to right in every
// shot of the video: upstream / the mountain is left, the sea is right.

export const POND = {
  /** Pond surface when full, and the trickle's surface before the dam fills it. */
  full: 620,
  /** The river before the dam fills it: deep enough that the lodge stands in it. */
  low: 852,
  /** The pond bed and the left bank. */
  bed: 930,
  bankTop: 600,
  bankX: 250,
  bedX: 600,
  /** The dam, in profile: a long low wall of mud and sticks, wider than it
   *  is tall, with a long sloping upstream face (left) and a steeper far
   *  face (right, the spill's face — same slope as before the fix pass). */
  damBase: [1020, 1590] as const,
  damTop: [1210, 1500] as const,
  damTopY: 598,
  /** Downstream ground and its river, right of the dam. */
  downY: 900,
  /** The beaver's lodge, a stick dome standing in the pond: smaller than the
   *  dam and set well left of it, so it never reads as the wall. */
  lodge: { x: 735, w: 330, top: 588 },
  /** Where the lava meets the water on mountain paths: the slab's spot. */
  slab: { x: 300, y: 632 },
} as const;

const DAM_TOP_MID = (POND.damTop[0] + POND.damTop[1]) / 2;
/** Ground line on top of the dam, for standing a beaver on it. */
export const DAM_STAND = { x: DAM_TOP_MID, y: POND.damTopY + 8 };

/** Left bank height at x (the slope down into the pond). */
export function bankY(x: number): number {
  if (x <= POND.bankX) return POND.bankTop;
  if (x >= POND.bedX) return POND.bed;
  const u = (x - POND.bankX) / (POND.bedX - POND.bankX);
  return POND.bankTop + (POND.bed - POND.bankTop) * (u * u * (3 - 2 * u));
}

/** Left edge of the water at a given level (where the bank meets it). */
export function shoreX(level: number): number {
  let x = POND.bankX;
  while (x < POND.bedX && bankY(x) < level) x += 2;
  return x;
}

const MUD = "#7a5232";
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** A dam in profile: a long, low wall of mud with sticks laid in courses. */
export const StickWall: React.FC<{ extra?: number }> = ({ extra = 0 }) => {
  const [b0, b1] = POND.damBase;
  const [t0, t1] = POND.damTop;
  const ty = POND.damTopY;
  const base = POND.bed + 10;
  // Near-straight faces and a flat top: a wall, not a mound or a tower.
  const d = `M ${b0} ${base} Q ${b0 + (t0 - b0) * 0.45} ${ty + (base - ty) * 0.42} ${t0} ${ty + 6} Q ${(t0 + t1) / 2} ${ty - 10} ${t1} ${ty + 6} Q ${b1 - (b1 - t1) * 0.4} ${ty + (base - ty) * 0.45} ${b1} ${base} Z`;
  // Sticks laid lengthways in horizontal courses, like bricks in a wall.
  const sticks: React.ReactNode[] = [];
  let k = 0;
  for (let row = 0; row < 7; row++) {
    const y = base - 34 - row * 48;
    const u = (base - y) / (base - ty);
    const x0 = b0 + (t0 - b0) * u + 10;
    const x1 = b1 - (b1 - t1) * u - 10;
    const n = Math.max(1, Math.round((x1 - x0) / 175));
    const off = row % 2 ? 0.5 : 0;
    for (let i = 0; i < n + 1; i++) {
      const cx = x0 + ((i + off - 0.25) / n) * (x1 - x0);
      sticks.push(<Stick key={k} x={cx} y={y} len={150} angle={(k % 2 ? 1 : -1) * (3 + (k % 3) * 2)} tone={k} />);
      k++;
    }
  }
  return (
    <g>
      <path d={d} fill={MUD} stroke={kidTheme.ink} strokeWidth={10} strokeLinejoin="round" />
      <g clipPath="url(#da-dam-clip)">{sticks}</g>
      <defs>
        <clipPath id="da-dam-clip">
          <path d={d} />
        </clipPath>
      </defs>
      {/* The top course, proud of the wall so the silhouette reads as sticks. */}
      {[-84, 0, 84].map((dx, i) => (
        <Stick key={`t${i}`} x={DAM_TOP_MID + dx} y={ty - 4 - (i % 2) * 6} len={170} angle={i % 2 ? 3 : -4} tone={i + 1} />
      ))}
      {extra >= 1 ? <Stick x={DAM_TOP_MID + 10} y={ty - 20} len={200} angle={-2} tone={4} /> : null}
      {extra >= 2 ? <Stick x={DAM_TOP_MID - 40} y={ty - 34} len={180} angle={6} tone={5} /> : null}
    </g>
  );
};

/** The lodge: a dome of sticks standing in the pond, door at its base. */
export const Lodge: React.FC<{ door?: number; x?: number; scale?: number }> = ({
  door = 0,
  x = POND.lodge.x,
  scale = 1,
}) => {
  const w = POND.lodge.w;
  // Lighter than the dam's mud, so the house never reads as a second wall.
  const top = POND.lodge.top;
  const base = POND.bed + 6;
  // A low, wide, lumpy mound — not the dam's tall tidy wedge — with sticks
  // poking out of its top every which way: a house built by someone busy.
  const d = `M ${-w / 2} ${base} C ${-w / 2 + 10} ${top + 120} ${-w * 0.3} ${top} ${-w * 0.05} ${top + 6} C ${w * 0.22} ${top - 6} ${w / 2 - 20} ${top + 90} ${w / 2} ${base} Z`;
  return (
    <g transform={`translate(${x} 0) scale(${scale} 1)`}>
      {[-150, -95, -30, 40, 110].map((dx, i) => (
        <Stick key={`p${i}`} x={dx} y={top + 30 + Math.abs(dx) * 0.25} len={150} angle={-40 + i * 22} tone={i} />
      ))}
      <path d={d} fill="#94683f" stroke={kidTheme.ink} strokeWidth={10} strokeLinejoin="round" />
      <g clipPath="url(#da-lodge-clip)">
        {Array.from({ length: 24 }, (_, i) => {
          const r = Math.floor(i / 5);
          const c = i % 5;
          const y = base - 46 - r * 66;
          return <Stick key={i} x={-w / 2 + 50 + c * 92 + (r % 2) * 40} y={y} len={130} angle={(i % 2 ? 1 : -1) * (24 + (i % 3) * 10)} tone={i + 1} />;
        })}
      </g>
      <defs>
        <clipPath id="da-lodge-clip">
          <path d={d} />
        </clipPath>
      </defs>
      {door > 0.01 ? (
        <path
          d={`M -62 ${base - 4} L -62 ${base - 80} Q 0 ${base - 150} 62 ${base - 80} L 62 ${base - 4}`}
          fill="#1d1426"
          fillOpacity={0.55 * door}
          stroke={kidTheme.paper}
          strokeWidth={9}
          strokeDasharray="18 16"
          strokeLinecap="round"
          opacity={door}
        />
      ) : null}
    </g>
  );
};

/**
 * The pond, the dam and the land round them, in profile. `level` is the water
 * surface y (POND.low .. POND.full). Water first, then the bank and bed over it.
 */
export const PondWorld: React.FC<{
  level: number;
  lodge?: boolean;
  door?: number;
  /** The volcano far behind on the left (mountain paths and their wide). */
  volcano?: number;
  /** A lava trail down the left bank, ending at the slab's spot. */
  lavaTrail?: number;
  spill?: number;
  extraStick?: number;
  children?: React.ReactNode;
}> = ({ level, lodge = false, door = 0, volcano = 0, lavaTrail = 0, spill = 0, extraStick = 0, children }) => {
  const frame = useCurrentFrame();
  const sx = shoreX(level);
  const bank = `M -1200 ${POND.bankTop} L ${POND.bankX} ${POND.bankTop} ${Array.from({ length: 21 }, (_, i) => {
    const x = POND.bankX + ((POND.bedX - POND.bankX) * i) / 20;
    return `L ${x} ${bankY(x)}`;
  }).join(" ")} L ${POND.damBase[1] - 30} ${POND.bed} L ${POND.damBase[1] - 30} 1700 L -1200 1700 Z`;
  return (
    <g>
      {/* Far hills, and on mountain paths the polite volcano behind them. */}
      {volcano > 0 ? (
        <g opacity={volcano}>
          <Volcano x={-40} baseY={POND.bankTop + 20} h={760} w={1400} lava={0} far />
        </g>
      ) : null}
      <path d="M -1200 640 Q -200 430 600 560 Q 1300 660 2000 480 Q 2600 400 3200 520 L 3200 1700 L -1200 1700 Z" fill={mixHex(kidTheme.grass, kidTheme.skyLow, 0.45)} />
      {/* Downstream land and its river, right of the dam. */}
      <path d={`M ${POND.damBase[1] - 30} ${POND.downY} L 3200 ${POND.downY + 30} L 3200 1700 L ${POND.damBase[1] - 30} 1700 Z`} fill={kidTheme.grass} stroke={kidTheme.grassDark} strokeWidth={10} />
      <path d={`M ${POND.damBase[1] - 40} ${POND.downY - 4} L 3200 ${POND.downY + 26} L 3200 ${POND.downY + 70} L ${POND.damBase[1] - 40} ${POND.downY + 40} Z`} fill={kidTheme.water} />
      {/* The water, behind the bank. */}
      <rect x={sx - 30} y={level} width={DAM_TOP_MID - sx + 30} height={1700 - level} fill={kidTheme.water} />
      <rect x={sx - 30} y={level + 60} width={DAM_TOP_MID - sx + 30} height={1700 - level} fill={kidTheme.waterDark} opacity={0.35} />
      <path
        d={Array.from({ length: 14 }, (_, i) => {
          const x = Math.min(DAM_TOP_MID - 60, sx + i * 80 + ((frame * 0.8) % 80));
          return `M ${x} ${level + 2} q 20 -6 40 0`;
        }).join(" ")}
        stroke={kidTheme.waterLight}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      {lodge ? <Lodge door={door} /> : null}
      {/* The water again, thin, in front of the lodge: it stands IN the river
          at every level, so before the pond fills it reads as a house in the
          water, not as the wall. */}
      {lodge ? (
        <rect x={sx - 30} y={level} width={POND.damBase[0] + 60 - sx} height={POND.bed + 20 - level} fill={kidTheme.water} opacity={0.42 - 0.12 * clamp01((POND.low - level) / (POND.low - POND.full))} />
      ) : null}
      {/* The left bank and the pond bed. */}
      <path d={bank} fill={kidTheme.earth} stroke={kidTheme.ink} strokeWidth={10} strokeLinejoin="round" />
      <path d={`M -1200 ${POND.bankTop} L ${POND.bankX} ${POND.bankTop} Q ${POND.bankX + 30} ${POND.bankTop + 4} ${POND.bankX + 52} ${POND.bankTop + 22} L -1200 ${POND.bankTop + 46} Z`} fill={kidTheme.grass} stroke={kidTheme.grassDark} strokeWidth={8} />
      {lavaTrail > 0 ? <LavaTrail u={lavaTrail} /> : null}
      <StickWall extra={extraStick} />
      {spill > 0.01 ? <Spill u={spill} /> : null}
      {children}
    </g>
  );
};

/** Cooled lava down the left bank — a dark seam where the trickle ran. */
const LavaTrail: React.FC<{ u: number }> = ({ u }) => (
  <path
    d={`M -400 ${POND.bankTop - 260} Q 0 ${POND.bankTop - 120} 160 ${POND.bankTop - 6} Q 240 ${POND.bankTop + 6} ${POND.slab.x - 10} ${POND.slab.y - 10}`}
    stroke="#4a3b3f"
    strokeWidth={30}
    strokeLinecap="round"
    fill="none"
    opacity={u}
  />
);

/** Water spilling over the top of the dam and down its far face. */
export const Spill: React.FC<{ u: number }> = ({ u }) => {
  const frame = useCurrentFrame();
  const x0 = POND.damTop[1] - 10;
  const y0 = POND.damTopY - 4;
  const d = `M ${x0 - 70} ${y0} Q ${x0 + 30} ${y0 - 6} ${x0 + 50} ${y0 + 60} Q ${x0 + 80} ${POND.downY - 120} ${x0 + 92} ${POND.downY}`;
  return (
    <g opacity={Math.min(1, u)}>
      <path d={d} stroke={kidTheme.waterDeep} strokeWidth={46} fill="none" strokeLinecap="round" />
      <path d={d} stroke={kidTheme.water} strokeWidth={32} fill="none" strokeLinecap="round" />
      {Array.from({ length: 5 }, (_, i) => {
        const t = (frame / 34 + i / 5) % 1;
        const x = t < 0.25 ? x0 - 70 + t * 4 * 110 : x0 + 40 + (t - 0.25) * 70;
        const y = t < 0.25 ? y0 - 2 : y0 + (t - 0.25) * (1 / 0.75) * (POND.downY - y0);
        return <circle key={i} cx={x} cy={y} r={8} fill={kidTheme.waterLight} />;
      })}
      <ellipse cx={x0 + 96} cy={POND.downY + 6} rx={50 + Math.sin(frame / 5) * 6} ry={12} fill="#ffffff" opacity={0.7} />
    </g>
  );
};

/**
 * The volcano. Grey, alone, a hat of snow, a notch of a crater. `lava` 0..1 is
 * the trickle's reach from the crack down the middle of the face.
 * Drawn about its base centre; `h`/`w` size it.
 */
export const Volcano: React.FC<{
  x: number;
  baseY: number;
  h: number;
  w: number;
  lava?: number;
  far?: boolean;
  glow?: number;
  /** Where the trickle starts (the crack); defaults just under the crater. */
  lavaTop?: number;
  /** How far down it can reach at lava = 1. */
  lavaBottom?: number;
}> = ({ x, baseY, h, w, lava = 0, far = false, glow = 0, lavaTop, lavaBottom }) => {
  const frame = useCurrentFrame();
  const rock = far ? "#a3a6ad" : "#8b8790";
  const rockDark = far ? "#8d9097" : "#6b6770";
  const peak = baseY - h;
  const cw = w * 0.09;
  const d = `M ${x - w / 2} ${baseY} Q ${x - w * 0.2} ${baseY - h * 0.35} ${x - cw} ${peak} L ${x + cw} ${peak} Q ${x + w * 0.2} ${baseY - h * 0.35} ${x + w / 2} ${baseY} Z`;
  // The snow hat: a scalloped cap over the top fifth.
  const capY = peak + h * 0.2;
  const capHalf = cw + (w / 2 - cw) * 0.16;
  const cap = `M ${x - cw} ${peak} L ${x + cw} ${peak} L ${x + capHalf} ${capY} q ${-capHalf * 0.25} 26 ${-capHalf * 0.5} 0 q ${-capHalf * 0.25} 30 ${-capHalf * 0.5} 4 q ${-capHalf * 0.25} 28 ${-capHalf * 0.5} -2 q ${-capHalf * 0.25} 26 ${-capHalf * 0.5} -2 Z`;
  const top = lavaTop ?? peak + 40;
  const trickleLen = ((lavaBottom ?? baseY - 40) - top) * Math.max(0, Math.min(1, lava));
  return (
    <g>
      <path d={d} fill={rock} stroke={far ? "none" : kidTheme.ink} strokeWidth={10} strokeLinejoin="round" />
      <path d={`M ${x + cw} ${peak} Q ${x + w * 0.2} ${baseY - h * 0.35} ${x + w / 2} ${baseY} L ${x + w * 0.1} ${baseY} Q ${x + w * 0.06} ${baseY - h * 0.4} ${x + cw * 0.4} ${peak + 10} Z`} fill={rockDark} opacity={0.45} />
      <path d={cap} fill="#ffffff" stroke={far ? "none" : kidTheme.ink} strokeWidth={8} strokeLinejoin="round" />
      {/* The crater's lip. */}
      <ellipse cx={x} cy={peak + 2} rx={cw} ry={cw * 0.28} fill="#46424c" stroke={far ? "none" : kidTheme.ink} strokeWidth={6} />
      {glow > 0 ? <ellipse cx={x} cy={peak + 2} rx={cw * 0.8} ry={cw * 0.2} fill={LAVA} opacity={glow * (0.75 + 0.25 * Math.sin(frame / 6))} /> : null}
      {lava > 0 ? (
        <g>
          <path
            d={`M ${x} ${top} q ${-14} ${trickleLen * 0.3} 6 ${trickleLen * 0.55} q 16 ${trickleLen * 0.25} -4 ${trickleLen * 0.45}`}
            stroke="#ffd36b"
            strokeWidth={46}
            strokeLinecap="round"
            fill="none"
            opacity={0.4}
          />
          <path
            d={`M ${x} ${top} q ${-14} ${trickleLen * 0.3} 6 ${trickleLen * 0.55} q 16 ${trickleLen * 0.25} -4 ${trickleLen * 0.45}`}
            stroke={LAVA}
            strokeWidth={26}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ) : null}
    </g>
  );
};

export const LAVA = "#ff7a1a";
export const LAVA_HOT = "#ffd36b";

/** A white ring of smoke, rising and widening. `u` 0..1 over its life. */
export const SmokeRing: React.FC<{ x: number; y: number; u: number }> = ({ x, y, u }) => {
  if (u <= 0 || u >= 1) return null;
  const r = 30 + u * 120;
  return (
    <g opacity={Math.min(1, (1 - u) * 1.8)}>
      <ellipse cx={x} cy={y - u * 90} rx={r} ry={r * 0.36} fill="none" stroke="#ffffff" strokeWidth={26 - u * 10} />
      <ellipse cx={x} cy={y - u * 90} rx={r} ry={r * 0.36} fill="none" stroke={kidTheme.cloudShade} strokeWidth={8} opacity={0.8} />
    </g>
  );
};

/**
 * The obsidian slab. `cool` 0..1: glowing orange lava front -> black glossy
 * glass with a highlight. Drawn about its base centre.
 */
export const ObsidianSlab: React.FC<{ x: number; y: number; cool: number; scale?: number }> = ({
  x,
  y,
  cool,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const c = Math.max(0, Math.min(1, cool));
  const fill = mixHex(LAVA, "#16131c", c);
  const edge = mixHex("#b33d0a", kidTheme.ink, c);
  const d = "M -120 0 L -96 -54 L -40 -86 L 30 -78 L 92 -50 L 124 0 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {c < 0.6 ? <path d={d} fill={LAVA_HOT} opacity={(0.6 - c) * 0.9} transform="scale(1.18)" /> : null}
      <path d={d} fill={fill} stroke={edge} strokeWidth={9} strokeLinejoin="round" />
      {/* Facets, then the glassy highlight and a glint. */}
      <path d="M -40 -86 L -10 -30 L 92 -50 M -10 -30 L -96 -54" stroke={mixHex(LAVA_HOT, "#4a4458", c)} strokeWidth={5} fill="none" opacity={0.8} />
      <path d="M -72 -56 L -34 -76 L -18 -60 L -58 -42 Z" fill="#ffffff" opacity={0.75 * c} />
      {c > 0.9 ? (
        <path
          transform={`translate(54 -58) scale(${0.7 + 0.3 * Math.sin(frame / 9)})`}
          d="M 0 -18 L 4 -4 L 18 0 L 4 4 L 0 18 L -4 4 L -18 0 L -4 -4 Z"
          fill="#ffffff"
        />
      ) : null}
    </g>
  );
};

/** A straight-up column of steam. `u` 0..1 its strength. */
export const SteamColumn: React.FC<{ x: number; y: number; u: number }> = ({ x, y, u }) => {
  const frame = useCurrentFrame();
  if (u <= 0.01) return null;
  return (
    <g opacity={u}>
      {Array.from({ length: 12 }, (_, i) => {
        const t = (frame / 50 + i / 12) % 1;
        const yy = y - t * 900;
        const r = 40 + t * 90;
        return (
          <circle
            key={i}
            cx={x + Math.sin(t * 6 + i) * 24}
            cy={yy}
            r={r}
            fill="#ffffff"
            stroke={kidTheme.cloudShade}
            strokeWidth={6}
            opacity={(1 - t) * 0.85}
          />
        );
      })}
    </g>
  );
};

/** A tall tree: trunk and a round crown. Drawn about its base. */
export const Tree: React.FC<{ x: number; baseY: number; h: number; chewed?: number }> = ({ x, baseY, h, chewed = 0 }) => {
  const tw = h * 0.09;
  const crownR = h * 0.3;
  const top = baseY - h;
  const notch = chewed * tw * 0.42;
  return (
    <g>
      <path
        d={`M ${x - tw} ${baseY} L ${x - tw * 0.7} ${top + crownR} L ${x + tw * 0.7} ${top + crownR} L ${x + tw} ${baseY} Z`}
        fill="#8a5a32"
        stroke={kidTheme.ink}
        strokeWidth={9}
        strokeLinejoin="round"
      />
      {/* The beaver's notch, low on the trunk. */}
      {notch > 1 ? (
        <path
          d={`M ${x - tw - 2} ${baseY - h * 0.1} L ${x - tw + notch} ${baseY - h * 0.075} L ${x - tw - 2} ${baseY - h * 0.05} Z M ${x + tw + 2} ${baseY - h * 0.1} L ${x + tw - notch} ${baseY - h * 0.075} L ${x + tw + 2} ${baseY - h * 0.05} Z`}
          fill="#e7c89a"
          stroke={kidTheme.ink}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      ) : null}
      {[
        [0, -crownR * 0.2, crownR],
        [-crownR * 0.7, crownR * 0.3, crownR * 0.7],
        [crownR * 0.7, crownR * 0.28, crownR * 0.72],
      ].map(([dx, dy, r], i) => (
        <circle key={i} cx={x + dx} cy={top + crownR + dy} r={r} fill={i === 0 ? kidTheme.grass : kidTheme.grassDark} stroke={kidTheme.ink} strokeWidth={9} />
      ))}
      <circle cx={x - crownR * 0.3} cy={top + crownR * 0.6} r={crownR * 0.22} fill="#8be08f" opacity={0.6} />
    </g>
  );
};

/** A drop falling or sitting, without a face: rain, the crowd. */
export const DROP_PATH = "M 0 -26 C 6 -14 17 -6 17 6 A 17 17 0 0 1 -17 6 C -17 -6 -6 -14 0 -26 Z";

export const RainField: React.FC<{
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  strength: number;
  count?: number;
  speed?: number;
}> = ({ x0, x1, y0, y1, strength, count = 40, speed = 18 }) => {
  const frame = useCurrentFrame();
  if (strength <= 0.01) return null;
  const span = y1 - y0;
  return (
    <g opacity={strength}>
      {Array.from({ length: count }, (_, i) => {
        const h = Math.sin(i * 12.9898) * 43758.5453;
        const x = x0 + (h - Math.floor(h)) * (x1 - x0);
        const y = y0 + ((frame * speed + i * 211) % span);
        return <path key={i} transform={`translate(${x} ${y}) scale(0.9)`} d={DROP_PATH} fill={kidTheme.water} stroke={kidTheme.waterDeep} strokeWidth={4} />;
      })}
    </g>
  );
};

/**
 * The cloud with no manager: grey, raggedy, no windows, a crowd of drop faces
 * churning in it. Drawn about its centre.
 */
export const WildCloud: React.FC<{ x: number; y: number; w: number; h: number; grey?: number; faces?: number }> = ({
  x,
  y,
  w,
  h,
  grey = 0.6,
  faces = 14,
}) => {
  const frame = useCurrentFrame();
  const top = mixHex(kidTheme.cloud, kidTheme.cloudGrey, grey * 0.9);
  const bottom = mixHex(kidTheme.cloudShade, kidTheme.cloudStorm, grey);
  const edge = mixHex("#7d93aa", "#33414f", grey);
  const n = 9;
  const puffs = Array.from({ length: n }, (_, i) => {
    const u = i / (n - 1);
    const r = h * (0.28 + 0.2 * Math.abs(Math.sin(i * 2.31 + 0.4)));
    return {
      cx: (u - 0.5) * (w - r * 1.2) + Math.sin(frame / 23 + i) * 6,
      cy: -h * 0.12 + Math.sin(i * 1.9) * h * 0.14 + Math.cos(frame / 19 + i * 2) * 5,
      r,
    };
  });
  // Ragged bottom: a row of small drooping lumps.
  const rag = Array.from({ length: 11 }, (_, i) => {
    const u = i / 10;
    return { cx: (u - 0.5) * w * 0.86, cy: h * 0.28 + Math.sin(i * 3.3) * 10, r: h * (0.12 + 0.05 * Math.abs(Math.sin(i * 1.7))) };
  });
  const shapes = (stroked: boolean) => (
    <>
      <rect x={-w / 2 + h * 0.1} y={-h * 0.08} width={w - h * 0.2} height={h * 0.46} rx={h * 0.23} fill={bottom} stroke={stroked ? edge : "none"} strokeWidth={stroked ? 12 : 0} />
      {rag.map((p, i) => (
        <circle key={`r${i}`} cx={p.cx} cy={p.cy} r={p.r} fill={bottom} stroke={stroked ? edge : "none"} strokeWidth={stroked ? 12 : 0} />
      ))}
      {puffs.map((p, i) => (
        <circle key={`p${i}`} cx={p.cx} cy={p.cy} r={p.r} fill={top} stroke={stroked ? edge : "none"} strokeWidth={stroked ? 12 : 0} />
      ))}
    </>
  );
  return (
    <g transform={`translate(${x} ${y})`}>
      {shapes(true)}
      {shapes(false)}
      {Array.from({ length: faces }, (_, i) => {
        const u = (i + 0.5) / faces;
        const bx = (u - 0.5) * w * 0.78 + Math.sin(frame / 11 + i * 1.7) * 14;
        const by = -h * 0.05 + Math.sin(i * 2.9) * h * 0.14 + Math.cos(frame / 9 + i) * 8;
        return (
          <Blobby
            key={i}
            x={bx}
            y={by}
            scale={(h / 300) * (0.42 + 0.12 * Math.abs(Math.sin(i * 4.1)))}
            phase={i * 0.9}
            mood={i % 3 === 0 ? "surprised" : "happy"}
            look={Math.sin(i * 2.2 + frame / 30)}
          />
        );
      })}
    </g>
  );
};

/**
 * Screen furniture: a big direction sign (LEFT / RIGHT, OVER, THROUGH), as the
 * hotel's exit signs were in DripChooses. Absolutely positioned HTML-level
 * SVG at `x`,`y` (its centre). `s` is the pop-in spring; `glow` the hold pulse.
 */
export const WaySign: React.FC<{
  x: number;
  y: number;
  s: number;
  glow: number;
  label: string;
  arrow: "left" | "right" | "up" | "down";
  icon?: React.ReactNode;
  w?: number;
}> = ({ x, y, s, glow, label, arrow, icon, w: wIn }) => {
  if (s <= 0.01) return null;
  const w = wIn ?? Math.max(330, label.length * 42 + 200);
  const h = 130;
  const rot = { left: 180, right: 0, up: -90, down: 90 }[arrow];
  const tilt = arrow === "left" ? -2.5 : 2.5;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", zIndex: 30 }} width={1} height={1}>
      <g transform={`scale(${s}) rotate(${tilt})`}>
        {glow > 0 ? <rect x={-w / 2 - 22} y={-h / 2 - 22} width={w + 44} height={h + 44} rx={50} fill={kidTheme.star} opacity={0.18 + 0.32 * glow} /> : null}
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={32} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={10} />
        <g transform={`translate(${arrow === "left" ? -w / 2 + 70 : w / 2 - 70} 0) rotate(${rot})`}>
          <path d="M 44 0 L 4 -32 L 4 -14 L -44 -14 L -44 14 L 4 14 L 4 32 Z" fill={kidTheme.tomato} stroke={kidTheme.ink} strokeWidth={6} strokeLinejoin="round" />
        </g>
        <text
          x={arrow === "left" ? 50 : -50}
          y={17}
          textAnchor="middle"
          fontFamily={kidTheme.fontFamily}
          fontSize={50}
          fontWeight={900}
          letterSpacing={2}
          fill={kidTheme.ink}
        >
          {label}
        </text>
        {icon}
      </g>
    </svg>
  );
};

/** A felled tree: a fat log with a cut end, and a tuft of leaves at the top. */
export const Log: React.FC<{ x: number; y: number; len: number; angle?: number; leaves?: boolean }> = ({
  x,
  y,
  len,
  angle = 0,
  leaves = true,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    {leaves ? (
      <g>
        <circle cx={len / 2 + 30} cy={-10} r={60} fill={kidTheme.grassDark} stroke={kidTheme.ink} strokeWidth={8} />
        <circle cx={len / 2 - 10} cy={-30} r={46} fill={kidTheme.grass} stroke={kidTheme.ink} strokeWidth={8} />
      </g>
    ) : null}
    <rect x={-len / 2} y={-28} width={len} height={56} rx={24} fill="#8a5a32" stroke={kidTheme.ink} strokeWidth={8} />
    <path d={`M ${-len / 2 + 60} -8 L ${len / 2 - 80} -12 M ${-len / 2 + 120} 12 L ${len / 2 - 140} 10`} stroke="#6f4322" strokeWidth={6} strokeLinecap="round" />
    <ellipse cx={-len / 2 + 4} cy={0} rx={16} ry={27} fill="#e7c89a" stroke={kidTheme.ink} strokeWidth={6} />
    <ellipse cx={-len / 2 + 4} cy={0} rx={6} ry={11} fill="none" stroke="#b98a58" strokeWidth={3} />
  </g>
);

/**
 * The green valley, seen from the cloud's side: rolling hills, the little
 * river winding down the LEFT half, the tall tree in the RIGHT half. The
 * Beaver at the tree's foot is drawn by the scene (he is a character).
 */
export const VALLEY = {
  tree: { x: 1440, baseY: 930, h: 440 },
  river: "M 760 560 C 640 640 360 660 420 760 C 470 840 260 900 160 1100",
} as const;

export const ValleyWorld: React.FC<{ morning?: boolean; children?: React.ReactNode; tree?: boolean }> = ({
  children,
  tree = true,
}) => (
  <g>
    <path d="M -1200 620 Q -300 480 400 560 Q 1100 640 1800 520 Q 2500 430 3200 560 L 3200 1700 L -1200 1700 Z" fill={mixHex(kidTheme.grass, kidTheme.skyLow, 0.4)} />
    <path d="M -1200 700 Q 200 600 900 640 Q 1600 690 3200 620 L 3200 1700 L -1200 1700 Z" fill={kidTheme.grass} stroke={kidTheme.grassDark} strokeWidth={10} />
    <path d={VALLEY.river} stroke={kidTheme.waterDeep} strokeWidth={88} fill="none" strokeLinecap="round" />
    <path d={VALLEY.river} stroke={kidTheme.water} strokeWidth={66} fill="none" strokeLinecap="round" />
    <path d={VALLEY.river} stroke={kidTheme.waterLight} strokeWidth={10} strokeDasharray="30 60" fill="none" strokeLinecap="round" opacity={0.8} />
    {/* A few far trees for scale. */}
    {[[980, 650, 120], [1120, 640, 90], [260, 620, 110]].map(([x, y, h], i) => (
      <Tree key={i} x={x} baseY={y} h={h} />
    ))}
    {tree ? <Tree x={VALLEY.tree.x} baseY={VALLEY.tree.baseY} h={VALLEY.tree.h} chewed={0.8} /> : null}
    {children}
  </g>
);
