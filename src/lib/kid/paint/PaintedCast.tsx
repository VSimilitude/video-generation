import React from "react";
import { CharacterFrame, Face, type CharacterProps, type Rig } from "../Character";
import { kidTheme, mixHex } from "../theme";
import { Boil, BoilGroup } from "./Boil";
import { PaintFill, type BBox } from "./PaintFill";
import { circlePts, hashKey, outlinePath, ribbon, roundRectPath, type Pt } from "./strokes";
import { kidPaintTheme, type Value3 } from "./theme";
import { CastShade } from "../light/Shadowed";
import type { LightRig } from "../light/light";

// Painted variants of Drip, Sunny and Cloudia (ROADMAP Step 2). Reached only
// through the characters' optional `paint` prop: with `paint` unset each
// character renders exactly as before. Same silhouettes, same face rig, same
// CharacterFrame placement — the medium changes, the design does not:
//   - outlines are perfect-freehand ribbons (thick on the side away from the
//     key), not uniform strokes;
//   - fills are PaintFill (three values, pooled/dry bands, bleed), with no
//     gradients and no specular shines;
//   - CastShade puts the light rig's shadow on the far side + a key rim;
//   - the INK boils (Boil/BoilGroup on the ribbons only); fills, shade and
//     the Face stay put. Boiling the whole body group forced every nested
//     filter (PaintFill, CastShade) through an offscreen pass each frame and
//     cost ~0.08 s/frame for three characters; ink-only boil is ~free and the
//     line drifting a pixel off the fill reads as hand-registration.
//     `boilScope: "all"` restores whole-body boil (faces still excluded).
// Ground shadows are scene-space (<GroundShadow>), so the built-in contact
// ellipse is off in the painted path.

export type PaintOpts = {
  light: LightRig;
  /** Boil/filter-id key; must be unique per on-screen instance. */
  boilKey?: string;
  /** Displacement px (bible 2.5; memo start 5). */
  boil?: number;
  /** Frames per boil re-seed (3 = 10/s). */
  boilEvery?: number;
  boilOff?: boolean;
  /** Edge-bleed layer of the fills. */
  bleed?: boolean;
  /** "ink" (default): only the ribbons boil. "all": the whole body group (≈2× render cost). */
  boilScope?: "ink" | "all";
};

const DEFAULT_BOIL = 3;

/** Thick side of the ink = directly away from the key, in local radians. */
function awayFromKey(light: LightRig, flip?: boolean): number {
  const a = (light.dir * Math.PI) / 180;
  const x = Math.cos(a) * (flip ? -1 : 1);
  const y = Math.sin(a);
  return Math.atan2(-y, -x);
}

function ellipsePts(cx: number, cy: number, rx: number, ry: number, n = 36): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as Pt;
  });
}

type FrameProps = CharacterProps & { paint: PaintOpts };

// ---------------------------------------------------------------------------
// Drip
// ---------------------------------------------------------------------------

const D_BALL_Y = 46;
const D_BALL_R = 106;
const D_TIP_Y = -140;
const DRIP_BODY =
  `M 0 ${D_TIP_Y} C 34 -84 ${D_BALL_R} -34 ${D_BALL_R} ${D_BALL_Y}` +
  ` A ${D_BALL_R} ${D_BALL_R} 0 0 1 ${-D_BALL_R} ${D_BALL_Y}` +
  ` C ${-D_BALL_R} -34 -34 -84 0 ${D_TIP_Y} Z`;
const DRIP_BBOX: BBox = { x: -110, y: -144, w: 220, h: 300 };
const DRIP_ARMS_BBOX: BBox = { x: -175, y: -100, w: 350, h: 225 };
const DRIP_FEET_BBOX: BBox = { x: -92, y: D_BALL_Y + D_BALL_R - 20, w: 184, h: 44 };
const DRIP_BOIL_BOX: BBox = { x: -195, y: -150, w: 390, h: 335 };

const DRIP_ARM: Record<string, string> = {
  rest: "M -76 30 Q -150 56 -146 100",
  hips: "M -78 2 L -128 62 L -84 80",
  cheer: "M -76 14 Q -164 -24 -142 -72",
  clutch: "M -80 34 Q -140 4 -104 -32",
};
const DRIP_HAND: Record<string, [number, number]> = {
  rest: [-146, 100],
  hips: [-84, 80],
  cheer: [-142, -72],
  clutch: [-104, -32],
};

export const DripPaint: React.FC<FrameProps & { rig: Rig; pose: string; arms: boolean; feet: boolean }> = (props) => {
  const { rig, paint, pose, arms, feet } = props;
  const key = paint.boilKey ?? "drip";
  const seed = hashKey(key);
  const P = kidPaintTheme;
  const thick = awayFromKey(paint.light, props.flip);
  const swing = rig.trail.dy * 0.35;
  const d = DRIP_ARM[pose] ?? DRIP_ARM.rest;
  const [hx, hy] = DRIP_HAND[pose] ?? DRIP_HAND.rest;
  const armInk = outlinePath(d, 44, 34, seed + 3, { closed: false, jitter: 0.4 });
  // Filled limb tube: 28 at the shoulder easing to 24 at the wrist, no wobble (the ink carries it).
  const armFill = outlinePath(d, 28, 24, seed + 6, { closed: false, jitter: 0 });
  const handInk = ribbon(circlePts(hx, hy, 22, 28), 9, 3, seed + 4, { closed: true, thickAt: thick });
  const footInk = (s: number) =>
    ribbon(ellipsePts(s * 50, D_BALL_Y + D_BALL_R + 2, 40, 20, 32), 8, 2.5, seed + 5 + s, { closed: true, thickAt: Math.PI / 2 });
  const bodyInk = outlinePath(DRIP_BODY, 11, 2.5, seed, { thickAt: thick, step: 5 });
  const all = paint.boilScope === "all";
  const inkOff = !!paint.boilOff || all;
  return (
    <CharacterFrame rig={rig} x={props.x} y={props.y} width={360} height={380} viewBox="-180 -190 360 380"
      scale={props.scale} flip={props.flip} zIndex={props.zIndex}>
      <Boil id={`${key}-boil`} boilKey={key} frame={rig.frame} bbox={DRIP_BOIL_BOX}
        scale={paint.boil ?? DEFAULT_BOIL} every={paint.boilEvery} off={paint.boilOff} defsOnly={!all}>
        {feet ? (
          <>
            {/* Feet: one PaintFill (pooled limb blue) under the two tapered ink rings. */}
            <PaintFill id={`${key}-feet`} bbox={DRIP_FEET_BBOX} v={P.waterLimb} seed={(seed + 11) % 997} bleed={paint.bleed ?? true}
              shape={[-1, 1].map((s) => <ellipse key={s} cx={s * 50} cy={D_BALL_Y + D_BALL_R + 2} rx={40} ry={20} />)} />
            {[-1, 1].map((s) => (
              <BoilGroup key={s} id={`${key}-boil`} off={inkOff}>
                <path d={footInk(s)} fill={P.water.line} />
              </BoilGroup>
            ))}
          </>
        ) : null}
        {arms ? (
          <g transform={`translate(0 ${swing})`}>
            {[-1, 1].map((s) => (
              <g key={s} transform={s === 1 ? "scale(-1 1)" : undefined}>
                <BoilGroup id={`${key}-boil`} off={inkOff}>
                  <path d={armInk} fill={P.water.line} />
                </BoilGroup>
              </g>
            ))}
            {/* Arms + hands: one PaintFill over a tapered tube (was a uniform 28-unit stroke). */}
            <PaintFill id={`${key}-arms`} bbox={DRIP_ARMS_BBOX} v={P.waterLimb} seed={(seed + 7) % 997} bleed={paint.bleed ?? true}
              shape={[-1, 1].flatMap((s) => [
                <path key={`a${s}`} d={armFill} transform={s === 1 ? "scale(-1 1)" : undefined} />,
                <circle key={`h${s}`} cx={hx * -s} cy={hy} r={22} />,
              ])} />
            {[-1, 1].map((s) => (
              <g key={s} transform={s === 1 ? "scale(-1 1)" : undefined}>
                <BoilGroup id={`${key}-boil`} off={inkOff}>
                  <path d={handInk} fill={P.water.line} />
                </BoilGroup>
              </g>
            ))}
          </g>
        ) : null}
        <PaintFill id={`${key}-fill`} shape={<path d={DRIP_BODY} />} bbox={DRIP_BBOX} v={P.water} seed={seed % 997} bleed={paint.bleed ?? true} />
        <CastShade id={`${key}-shade`} silhouette={<path d={DRIP_BODY} />} light={paint.light} bbox={DRIP_BBOX} bodyH={292} flip={props.flip}
          lit={mixHex(P.waterLit, paint.light.key, 0.1)} />
        <BoilGroup id={`${key}-boil`} off={inkOff}>
          <path d={bodyInk} fill={P.water.line} />
        </BoilGroup>
      </Boil>
      <Face rig={rig} x={2} y={D_BALL_Y - 26} size={1.5} eyeScale={1.06} skin={P.water.base}
        blushColor="#ff7f8e" blushStrength={3} />
    </CharacterFrame>
  );
};

// ---------------------------------------------------------------------------
// Sunny
// ---------------------------------------------------------------------------

const S_R = 124;
const SUNNY_BBOX: BBox = { x: -128, y: -128, w: 256, h: 256 };
const SUNNY_BOIL_BOX: BBox = { x: -230, y: -230, w: 460, h: 460 };

export const SunnyPaint: React.FC<FrameProps & { rig: Rig; shades?: number; raySpeed?: number }> = (props) => {
  const { rig, paint } = props;
  const key = paint.boilKey ?? "sunny";
  const seed = hashKey(key);
  const P = kidPaintTheme;
  const spin = rig.frame * (props.raySpeed ?? 0.16) + rig.phase * 9;
  const flare = rig.trail.dy * 2.6;
  const ray = (long: boolean) => {
    const len = (long ? 78 : 50) + (long ? flare : -flare * 0.7);
    const h = (long ? 26 : 21) + 9;
    const d = `M ${-h} 10 L -5 ${-len - 2} Q 0 ${-len - 13} 5 ${-len - 2} L ${h} 10 Z`;
    return { d, half: `M 0 ${-len - 8} L ${h} 10 L 0 10 Z`, ink: outlinePath(d, 6.5, 1.6, seed + (long ? 1 : 2), { thickAt: 0, step: 5 }) };
  };
  const rays = [ray(true), ray(false)];
  const discInk = ribbon(circlePts(0, 0, S_R, 64), 10, 3, seed, { closed: true, thickAt: Math.PI * 0.6 });
  const all = paint.boilScope === "all";
  const inkOff = !!paint.boilOff || all;
  return (
    <CharacterFrame rig={rig} x={props.x} y={props.y} width={460} height={460} viewBox="-230 -230 460 460"
      scale={props.scale} flip={props.flip} zIndex={props.zIndex}>
      <Boil id={`${key}-boil`} boilKey={key} frame={rig.frame} bbox={SUNNY_BOIL_BOX}
        scale={paint.boil ?? DEFAULT_BOIL} every={paint.boilEvery} off={paint.boilOff} defsOnly={!all}>
        <g transform={`rotate(${spin})`}>
          {Array.from({ length: 12 }, (_, i) => {
            const r = rays[i % 2];
            return (
              <g key={i} transform={`rotate(${30 * i}) translate(0 ${-S_R + 10})`}>
                <path d={r.d} fill={P.sunRay.base} />
                <path d={r.half} fill={P.sunRay.shadow} opacity={0.45} />
              </g>
            );
          })}
          <BoilGroup id={`${key}-boil`} off={inkOff}>
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d={rays[i % 2].ink} fill={P.sunRay.line} transform={`rotate(${30 * i}) translate(0 ${-S_R + 10})`} />
            ))}
          </BoilGroup>
        </g>
        <PaintFill id={`${key}-fill`} shape={<circle cx={0} cy={0} r={S_R} />} bbox={SUNNY_BBOX} v={P.sun} seed={seed % 997} bleed={paint.bleed ?? true} strength={0.8} />
        <BoilGroup id={`${key}-boil`} off={inkOff}>
          <path d={discInk} fill={P.sun.line} />
        </BoilGroup>
      </Boil>
      <Face rig={rig} x={0} y={10} size={1.62} skin={P.sun.base} eyeSpread={1.04} eyeScale={0.92} blushColor="#ff8f6a" />
      {props.shades === undefined ? null : <PaintShades drop={props.shades} y={10} size={1.62} />}
    </CharacterFrame>
  );
};

/** Sunny's sunglasses, painted: same geometry as Sunny.tsx, the white glint becomes a dull cream stroke. */
const PaintShades: React.FC<{ drop: number; y: number; size: number }> = ({ drop, y, size }) => {
  const cx = 25;
  const ey = -8 + drop * 28;
  const lensW = 44 - drop * 4;
  const lensH = 38 - drop * 16;
  const outer = cx + lensW / 2;
  const ink = kidPaintTheme.ink;
  return (
    <g transform={`translate(0 ${y}) scale(${size})`}>
      {[-1, 1].map((s) => (
        <path key={s}
          d={`M ${s * (outer - 6)} ${ey - 8} L ${s * (outer + 12 * (1 - drop * 0.85))} ${ey - 8 - 9 * (1 - drop * 0.85)}`}
          stroke={ink} strokeWidth={8} strokeLinecap="round" />
      ))}
      <rect x={-7} y={ey - 8} width={14} height={8} rx={4} fill={ink} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={s * cx - lensW / 2} y={ey - lensH / 2} width={lensW} height={lensH} rx={Math.min(15, lensH / 2)}
            fill="#2a2f45" stroke={ink} strokeWidth={5} />
          <path d={`M ${s * cx - lensW / 2 + 10} ${ey + lensH / 2 - 9} L ${s * cx + 2} ${ey - lensH / 2 + 8}`}
            stroke={kidPaintTheme.paper} strokeWidth={3} strokeLinecap="round" opacity={0.22} />
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Cloudia
// ---------------------------------------------------------------------------

const C_PUFFS: Array<[number, number, number]> = [
  [-118, 12, 66],
  [-46, -34, 88],
  [46, -20, 76],
  [122, 20, 58],
];
const C_SLAB = { x: -172, y: 8, w: 344, h: 84, r: 42 };
const CLOUDIA_BBOX: BBox = { x: -176, y: -126, w: 352, h: 222 };
const CLOUDIA_BOIL_BOX: BBox = { x: -200, y: -140, w: 400, h: 290 };

const CPuffs: React.FC = () => (
  <>
    <rect x={C_SLAB.x} y={C_SLAB.y} width={C_SLAB.w} height={C_SLAB.h} rx={C_SLAB.r} />
    {C_PUFFS.map(([cx, cy, r]) => (
      <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={r} />
    ))}
  </>
);

const BOW_WING = (s: number) => `M ${s * 9} 0 L ${s * 52} -22 Q ${s * 60} 0 ${s * 52} 22 Z`;

export const CloudiaPaint: React.FC<FrameProps & { rig: Rig; fill?: number; bowTie?: boolean }> = (props) => {
  const { rig, paint } = props;
  const key = paint.boilKey ?? "cloudia";
  const seed = hashKey(key);
  const P = kidPaintTheme;
  const fill = Math.max(0, Math.min(1, props.fill ?? 0));
  const v: Value3 = {
    base: mixHex(P.cloud.base, kidTheme.cloudGrey, fill * 0.85),
    shadow: mixHex(P.cloud.shadow, kidTheme.cloudStorm, fill),
    light: mixHex(P.cloud.light, kidTheme.cloudShade, fill),
    line: mixHex(P.cloud.line, "#33414f", fill),
  };
  const sag = fill * 16;
  const thick = awayFromKey(paint.light, props.flip);
  // Each puff's ribbon is centred on its edge; pass 2's fill covers the
  // inner half, so only the outer half shows — widths are doubled.
  const puffInk = C_PUFFS.map(([cx, cy, r], i) =>
    ribbon(circlePts(cx, cy, r, 44, i), 20, 5, seed + i, { closed: true, thickAt: thick }),
  ).join(" ");
  const slabInk = outlinePath(roundRectPath(C_SLAB.x, C_SLAB.y, C_SLAB.w, C_SLAB.h, C_SLAB.r), 20, 5, seed + 9, { thickAt: thick });
  const bob = rig.trail.dy * 2.2;
  const tip = (rig.trail.dy - rig.squash.dy) * 2.4;
  const bow = props.bowTie ?? true;
  const all = paint.boilScope === "all";
  const inkOff = !!paint.boilOff || all;
  return (
    <CharacterFrame rig={rig} x={props.x} y={props.y} width={520} height={380} viewBox="-260 -190 520 380"
      scale={props.scale} flip={props.flip} zIndex={props.zIndex}>
      <g transform={`translate(0 ${sag}) scale(1 ${1 + fill * 0.06})`}>
        <Boil id={`${key}-boil`} boilKey={key} frame={rig.frame} bbox={CLOUDIA_BOIL_BOX}
          scale={paint.boil ?? DEFAULT_BOIL} every={paint.boilEvery} off={paint.boilOff} defsOnly={!all}>
          <BoilGroup id={`${key}-boil`} off={inkOff}>
            <path d={`${puffInk} ${slabInk}`} fill={v.line} />
          </BoilGroup>
          <PaintFill id={`${key}-fill`} shape={<CPuffs />} bbox={CLOUDIA_BBOX} v={v} seed={seed % 997} bleed={false} strength={0.45} />
          <CastShade id={`${key}-shade`} silhouette={<CPuffs />} light={paint.light} bbox={CLOUDIA_BBOX} bodyH={220} flip={props.flip}
            lit={mixHex(P.paper, paint.light.key, 0.35)} />
          {bow ? (
            <g transform={`translate(0 ${98 + bob}) rotate(${tip})`}>
              {[-1, 1].map((s) => (
                <g key={s}>
                  <path d={BOW_WING(s)} fill={P.pink.base} />
                  <BoilGroup id={`${key}-boil`} off={inkOff}>
                    <path d={outlinePath(BOW_WING(s), 5.5, 1.5, seed + 20 + s, { step: 4, thickAt: Math.PI / 2 })} fill={P.pink.line} />
                  </BoilGroup>
                </g>
              ))}
              <circle cx={0} cy={0} r={13} fill={P.pink.shadow} />
            </g>
          ) : null}
        </Boil>
        <Face rig={rig} x={0} y={-10} size={1.34} skin={v.base} eyeSpread={1.02} eyeScale={0.94} />
      </g>
    </CharacterFrame>
  );
};
