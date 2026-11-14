import React from "react";
import { AbsoluteFill } from "remotion";
import type { Cam } from "../staging";

// Multi-plane world (ROADMAP Step 2, gap 4; remaster log D8: plain 2D
// layers, not @remotion/three). Each Plane is the camera scaled by its depth
// factor: translate = cam pan × depth, scale = 1 + (zoom − 1) × depth, about
// the same origin; rotate (a Dutch tilt) applies whole. "sky" (∞) never
// moves. Characters are children of the depth-1.0 plane.
//
// Atmosphere by depth: far (≤0.15) lift +8 L (a haze veil), saturation ×0.7,
// blur 1.5 px; mid (0.4) +3 L, ×0.9; stage (1.0) untouched; foreground (1.3)
// −4 L, blur 2.5 px, ink weight ×1.3 (scene content reads `inkScale`).

export type Depth = "sky" | 0.15 | 0.4 | 1.0 | 1.3 | number;

export function depthFactor(depth: Depth): number {
  return depth === "sky" ? 0 : depth;
}

export function camForDepth(cam: Cam, depth: Depth): Cam {
  const k = depthFactor(depth);
  const z = cam.zoom ?? 1;
  const zy = cam.zoomY ?? z;
  return {
    x: cam.x,
    y: cam.y,
    zoom: 1 + (z - 1) * k,
    zoomY: 1 + (zy - 1) * k,
    dx: (cam.dx ?? 0) * k,
    dy: (cam.dy ?? 0) * k,
    rotate: cam.rotate ?? 0,
  };
}

export type Atmosphere = { filter?: string; haze: number; inkScale: number };

export function atmosphereFor(depth: Depth): Atmosphere {
  const k = depthFactor(depth);
  if (depth === "sky") return { haze: 0, inkScale: 0.5 };
  if (k <= 0.2) return { filter: "saturate(0.7) blur(1.5px)", haze: 0.12, inkScale: 0.55 };
  if (k <= 0.6) return { filter: "saturate(0.9)", haze: 0.06, inkScale: 0.75 };
  if (k <= 1.05) return { haze: 0, inkScale: 1 };
  return { filter: "brightness(0.92) blur(2.5px)", haze: 0, inkScale: 1.3 };
}

export const Plane: React.FC<{
  depth: Depth;
  /** Injected by <World>; pass explicitly when a Plane is used alone. */
  cam?: Cam;
  /** Haze colour for the far-plane lift (the sky's horizon colour). */
  haze?: string;
  /** Turn the per-depth filter off (render-cost reduction 4: pre-blurred plates). */
  flat?: boolean;
  zIndex?: number;
  children: React.ReactNode;
}> = ({ depth, cam, haze = "#e8e2d6", flat = false, zIndex, children }) => {
  const c = camForDepth(cam ?? { x: 960, y: 540 }, depth);
  const atm = atmosphereFor(depth);
  return (
    <AbsoluteFill style={{ zIndex }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${c.x}px ${c.y}px`,
          transform: `translate(${c.dx}px, ${c.dy}px) rotate(${c.rotate}deg) scale(${c.zoom}, ${c.zoomY})`,
          filter: flat ? undefined : atm.filter,
        }}
      >
        {children}
        {atm.haze > 0 ? <AbsoluteFill style={{ background: haze, opacity: atm.haze }} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Stacks Planes and hands each the camera. */
export const World: React.FC<{ cam: Cam; children: React.ReactNode }> = ({ cam, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    {React.Children.map(children, (child) =>
      React.isValidElement<{ cam?: Cam }>(child) && child.type === Plane
        ? React.cloneElement(child, { cam: child.props.cam ?? cam })
        : child,
    )}
  </AbsoluteFill>
);
