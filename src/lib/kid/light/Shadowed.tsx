import React from "react";
import type { BBox } from "../paint/PaintFill";
import { keyVector, rimFor, shadeAlpha, shadePush, groundShadowGeom, softRadial, type LightRig } from "./light";

// Light that touches the characters (ROADMAP Step 2, gap 3).
//
// <CastShade>   — inside a character's <svg>, after the body: the shadow
//                 colour over the far side (silhouette minus a copy pushed
//                 toward the key, blurred 6), plus a 2 px key-colour rim on
//                 the lit edge. Clipped to the body; faces go on top of it.
// <GroundShadow>— a scene-space (HTML) ellipse under a standing body, pushed
//                 away from the key, detaching and shrinking with altitude.
// <LightPool>   — a soft radial key-coloured pool (screen) on the plane
//                 behind a lamp or Sunny; tints whatever sits in it.

export const CastShade: React.FC<{
  id: string;
  /** The body silhouette: shapes with no fill attributes. */
  silhouette: React.ReactNode;
  light: LightRig;
  bbox: BBox;
  /** Body height in local units (drives the push). */
  bodyH: number;
  flip?: boolean;
  rim?: boolean;
  /**
   * Colour of the lit-side lift (default: the key). Pass a lighter, MORE
   * saturated body value for the hero so the lit side holds the frame's
   * highest saturation instead of greying toward the key.
   */
  lit?: string;
}> = ({ id, silhouette, light, bbox, bodyH, flip = false, rim = true, lit }) => {
  const k = keyVector(light, flip);
  const push = shadePush(light, bodyH);
  const rimL = rimFor(light);
  const pad = push + 24;
  const r = { x: bbox.x - pad, y: bbox.y - pad, width: bbox.w + pad * 2, height: bbox.h + pad * 2 };
  return (
    <g>
      <defs>
        <clipPath id={`${id}-clip`}>{silhouette}</clipPath>
        <filter id={`${id}-blur`} filterUnits="userSpaceOnUse" {...r}>
          <feGaussianBlur stdDeviation={6} />
        </filter>
        <mask id={`${id}-shade`} maskUnits="userSpaceOnUse" {...r}>
          <rect {...r} fill="white" />
          <g fill="black" transform={`translate(${k.x * push} ${k.y * push})`} filter={`url(#${id}-blur)`}>
            {silhouette}
          </g>
        </mask>
        <mask id={`${id}-lit`} maskUnits="userSpaceOnUse" {...r}>
          <g fill="white">{silhouette}</g>
          <g fill="black" transform={`translate(${-k.x * push * 0.9} ${-k.y * push * 0.9})`} filter={`url(#${id}-blur)`}>
            {silhouette}
          </g>
        </mask>
        {rim ? (
          <mask id={`${id}-rim`} maskUnits="userSpaceOnUse" {...r}>
            <g fill="white">{silhouette}</g>
            <g fill="black" transform={`translate(${-k.x * rimL.width} ${-k.y * rimL.width})`}>
              {silhouette}
            </g>
          </mask>
        ) : null}
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect {...r} fill={light.shadow} opacity={shadeAlpha(light)} mask={`url(#${id}-shade)`} />
        {/* Lit side: the band facing the key, lifted toward `lit`. */}
        <rect {...r} fill={lit ?? light.key} opacity={0.42} mask={`url(#${id}-lit)`} />
      </g>
      {rim ? (
        <rect {...r} fill={light.key} opacity={rimL.alpha} mask={`url(#${id}-rim)`} style={{ mixBlendMode: "screen" }} />
      ) : null}
    </g>
  );
};

export const GroundShadow: React.FC<{
  /** Scene x of the body centre and y of its ground contact. */
  x: number;
  y: number;
  bodyW: number;
  light: LightRig;
  /** Height of the body above the ground, px (hover / liftoff). */
  altitude?: number;
  /** Override the shadow colour (default light.shadow). */
  color?: string;
  /** Luminance of the ground under the body (0–1): darker ground, stronger shadow. */
  ground?: number;
}> = ({ x, y, bodyW, light, altitude = 0, color, ground = 0.5 }) => {
  const g = groundShadowGeom(light, bodyW, altitude, ground);
  const lift = Math.max(0, Math.min(1, altitude / 200));
  const c = color ?? light.shadow;
  return (
    <>
    <div
      style={{
        position: "absolute",
        left: x + g.dx - g.w / 2,
        top: y - g.h / 2,
        width: g.w,
        height: g.h,
        borderRadius: "50%",
        background: color ?? light.shadow,
        opacity: g.opacity,
        filter: "blur(8px)",
        mixBlendMode: "multiply",
      }}
    />
    {/* Contact line: a tight dark core under the feet, only when grounded. */}
    {lift < 0.15 ? (
      <div
        style={{
          position: "absolute",
          left: x - g.w * 0.3,
          top: y - Math.max(3, g.h * 0.14),
          width: g.w * 0.6,
          height: Math.max(6, g.h * 0.28),
          borderRadius: "50%",
          background: c,
          opacity: Math.min(0.6, g.opacity + 0.15) * (1 - lift * 6),
          filter: "blur(1.5px)",
          mixBlendMode: "multiply",
        }}
      />
    ) : null}
    </>
  );
};

export const LightPool: React.FC<{
  x: number;
  y: number;
  /** Radius (px); `ry` defaults to r for a disc, smaller for a floor pool. */
  r: number;
  ry?: number;
  color: string;
  opacity?: number;
}> = ({ x, y, r, ry, color, opacity = 0.2 }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - (ry ?? r),
      width: r * 2,
      height: (ry ?? r) * 2,
      background: softRadial(color),
      opacity,
      mixBlendMode: "screen",
      pointerEvents: "none",
    }}
  />
);
