import React from "react";
import { kidTheme, softRadial, threeValues, type Value3 } from "../../../lib/kid";
import { AbsoluteFill, LightPool, kidPaintTheme, ribbon, roundRectPath, type Pt } from "./common";
import { PaintedShape } from "./act3kit";

// The Cloud Hotel's shared lobby props (polish pass, decision D30): ONE desk,
// ONE sign, ONE lamp for act 2 (s13 sign, s16 desk) and act 3 (s22).
//   desk = act 3's SHAPE (scalloped cloud top, panel line, label, lamp on it)
//          in act 2's COLOUR (violet cloud-marble, read in the dusk room);
//   sign = act 2's hanging cream board, ink lettering.
// Same recipe as the act kits: PaintFill pooled fill under a tapered ribbon;
// cream #f3ead8 is the lightest value; every instance takes its own `id`.

const INK = kidPaintTheme.ink;
const CREAM = kidPaintTheme.paper;

export const LOBBY_V = {
  /** The desk front: act 2's cloud-marble. */
  marble: threeValues("#6a5aa8", "#2e2456", { tame: 0.04 }),
  /** The scalloped cloud top: act 2's desk-top violet. */
  marbleTop: threeValues("#8a7cc0", "#4a3c7a", { tame: 0.04 }),
  /** The sign board: act 2's cream card. */
  board: { base: "#eadcc0", shadow: "#b9a888", light: CREAM, line: "#5a4a3a" } as Value3,
  brass: threeValues("#c9a45a", "#7a5a2a", { tame: 0.1 }),
  shade: threeValues("#e8c88a", "#9a6a3a", { tame: 0.05 }),
};

const circleD = (cx: number, cy: number, rx: number, ry = rx) =>
  `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
const ptsD = (pts: Pt[]) => `M ${pts.map(([x, y]) => `${x} ${y}`).join(" L ")} Z`;

/** The reception desk: violet cloud-marble front, a panel line, a cream label, a scalloped cloud top. */
export const LobbyDesk: React.FC<{
  id: string;
  x0: number;
  x1: number;
  top: number;
  bottom: number;
  label?: string;
  /** Label centre x (default: the desk's right third). */
  labelX?: number;
}> = ({ id, x0, x1, top, bottom, label, labelX }) => {
  const w = x1 - x0;
  const front = roundRectPath(x0, top + 30, w, bottom - top - 30, 26);
  const n = Math.max(4, Math.round(w / 150));
  const puffs = Array.from({ length: n }, (_, i) => circleD(x0 + 40 + ((w - 80) * i) / (n - 1), top + 34, 62 + (i % 2) * 12, 44));
  return (
    <g>
      <PaintedShape id={`${id}-front`} ds={[front]} bbox={{ x: x0, y: top + 30, w, h: bottom - top - 30 }} v={LOBBY_V.marble} ink={7} seed={181} />
      <path d={ribbon([[x0 + 30, top + 120], [x0 + w * 0.5, top + 124], [x1 - 30, top + 118]], 5, 2, 183)} fill={LOBBY_V.marble.line} opacity={0.6} />
      {label ? (
        <text x={labelX ?? x1 - 150} y={top + Math.min(220, (bottom - top) * 0.5 + 30)} textAnchor="middle" fontFamily={kidTheme.fontFamily} fontWeight={900} fontSize={34}
          letterSpacing={3} fill={LOBBY_V.board.base}>
          {label}
        </text>
      ) : null}
      <PaintedShape id={`${id}-top`} ds={puffs} bbox={{ x: x0 - 40, y: top - 30, w: w + 80, h: 110 }} v={LOBBY_V.marbleTop} ink={6} seed={182} />
    </g>
  );
};

/** The CLOUD HOTEL board: cream, ink lettering, hanging on two cords of length `cord`. Origin = board centre. */
export const LobbySign: React.FC<{ id: string; x: number; y: number; scale?: number; rotate?: number; cord?: number }> = ({
  id,
  x,
  y,
  scale = 1,
  rotate = -2.5,
  cord = 90,
}) => {
  const w = 560;
  const h = 110;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${rotate})`}>
      <path d={`${ribbon([[-200, -h / 2], [-205, -h / 2 - cord * 0.5], [-210, -h / 2 - cord]], 5, 2, 101)} ${ribbon([[200, -h / 2], [205, -h / 2 - cord * 0.5], [210, -h / 2 - cord]], 5, 2, 102)}`} fill={INK} />
      <PaintedShape id={`${id}-card`} ds={[roundRectPath(-w / 2, -h / 2, w, h, 26)]} bbox={{ x: -w / 2, y: -h / 2, w, h }} v={LOBBY_V.board}
        ink={5} inkColor={INK} seed={103} />
      <text x={0} y={16} textAnchor="middle" fontFamily={kidTheme.fontFamily} fontSize={56} fontWeight={900} letterSpacing={4} fill={INK}>
        CLOUD HOTEL
      </text>
    </g>
  );
};

/** The desk lamp (stands ON the desk at x, y = its foot): brass stem + base, warm shade. Its light is a LightPool the scene places. */
export const LobbyLamp: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => {
  const shade = ptsD([[x - 70, y - 150], [x + 70, y - 150], [x + 44, y - 220], [x - 44, y - 220]]);
  return (
    <g>
      <path d={ribbon([[x, y], [x + 4, y - 80], [x, y - 152]], 10, 6, 61)} fill={LOBBY_V.brass.line} />
      <PaintedShape id={`${id}-base`} ds={[circleD(x, y - 8, 46, 16)]} bbox={{ x: x - 46, y: y - 24, w: 92, h: 32 }} v={LOBBY_V.brass} ink={4} seed={63} />
      <PaintedShape id={`${id}-shade`} ds={[shade]} bbox={{ x: x - 70, y: y - 220, w: 140, h: 70 }} v={LOBBY_V.shade} ink={5} seed={65} />
    </g>
  );
};

/** Act 2's dusk lobby room light (LOBBY_TINT + the four dark corners), for scenes outside act2.tsx (s22). */
export const LOBBY_TINT = "#b0bcee";
const DUSK = "#1e1838";
const CORNERS = [
  { x: 0, y: 1080, r: 900, ry: 620, o: 1 },
  { x: 1920, y: 1080, r: 900, ry: 620, o: 1 },
  { x: 0, y: 0, r: 700, ry: 460, o: 0.7 },
  { x: 1920, y: 0, r: 700, ry: 460, o: 0.7 },
];
export type LobbyPool = { x: number; y: number; r: number; ry?: number; color: string; opacity: number };
/** Multiply tint + dark corners, then the screen `pools` (lamps) over them. `opacity` fades the whole room (s22's fall). */
export const LobbyDusk: React.FC<{ opacity?: number; pools?: LobbyPool[] }> = ({ opacity = 1, pools = [] }) =>
  opacity <= 0.003 ? null : (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <AbsoluteFill style={{ background: LOBBY_TINT, mixBlendMode: "multiply" }} />
      {CORNERS.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: d.x - d.r, top: d.y - d.ry, width: d.r * 2, height: d.ry * 2,
          background: softRadial(DUSK), mixBlendMode: "multiply", opacity: d.o }} />
      ))}
      {pools.map((p, i) => (
        <LightPool key={i} x={p.x} y={p.y} r={p.r} ry={p.ry} color={p.color} opacity={p.opacity} />
      ))}
    </AbsoluteFill>
  );
