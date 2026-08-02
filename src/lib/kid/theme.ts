import type React from "react";

// Visual language for the kids' series — a separate world from the dark
// financial look in src/lib/theme.ts. Nothing here imports that theme and
// nothing there imports this: the two palettes are meant to be unmixable, so a
// kid scene can never half-inherit slate-and-cyan.
//
// Design rules the numbers encode (see docs/STYLE.md "Kids' series"):
//   - Daylight, not darkness. Backgrounds are bright; ink is a soft navy
//     (#243447), never pure black — black outlines read as clip-art.
//   - Saturated but not fluorescent. Every hue has a light and a dark partner
//     so a shape can be lit from above without a filter.
//   - Everything is round. `kidRadius` is the only source of corner radii.
//   - Type is enormous. The audience is six: the floor here is 44px, well
//     above the financial suite's 34px.

export const kidTheme = {
  // --- ink & paper --------------------------------------------------------
  /** Outline / eye / brow colour. A warm-dark navy, softer than black. */
  ink: "#243447",
  inkSoft: "#3d5068",
  paper: "#fffdf7",

  // --- sky (day) ----------------------------------------------------------
  skyTop: "#2a9fe0",
  skyMid: "#7ed0f5",
  skyLow: "#cdefff",

  // --- sky (sunset) — the calm-beat variant -------------------------------
  sunsetTop: "#6b4b9e",
  sunsetMid: "#ff8a72",
  sunsetLow: "#ffd28a",

  // --- sky (night) --------------------------------------------------------
  nightTop: "#101d45",
  nightMid: "#1f3b7a",
  nightLow: "#3d69a8",

  // --- underwater ---------------------------------------------------------
  seaTop: "#0a6d8c",
  seaMid: "#159fbc",
  seaLow: "#6fe0dd",

  // --- water / Drip -------------------------------------------------------
  water: "#3fc4f0",
  waterLight: "#9fe9ff",
  waterDark: "#1a8fce",
  waterDeep: "#0f6ba3",
  shine: "#ffffff",

  // --- air / Puff ---------------------------------------------------------
  // Puff is drawn at 25–100% opacity across episode two, so his palette is
  // built for the *low* end: a pale fill that reads as vapour, a face core
  // light enough to anchor the eyes against grass or sky, and an edge dark
  // enough to survive both. `airEdge` is deliberately a mid blue rather than
  // `ink` — a navy outline at 25% went muddy against grass.
  air: "#dff0ff",
  airLight: "#f4fcff",
  airEdge: "#4a86b4",
  airDeep: "#2f6690",
  /** Cool air rushing in to fill a gap (Act Two). */
  airCool: "#9ec9e8",

  // --- sun / Sunny --------------------------------------------------------
  sun: "#ffc93c",
  sunLight: "#ffe680",
  sunDark: "#f2921d",
  sunDeep: "#d9700f",

  // --- clouds / Cloudia ---------------------------------------------------
  cloud: "#ffffff",
  cloudShade: "#dce8f4",
  cloudGrey: "#93a3b5",
  cloudGreyShade: "#6d7e92",
  cloudStorm: "#556472", // heaviest "full of rain" cloud

  // --- ground -------------------------------------------------------------
  grass: "#5ccc63",
  grassDark: "#37a34a",
  earth: "#b07a4e",

  // --- accents ------------------------------------------------------------
  pink: "#ff6fa5",
  pinkDeep: "#e0407f",
  purple: "#a86bff",
  mint: "#4fe0c0",
  tomato: "#ff6a5c",
  star: "#fff4b8",

  // --- mouth interior -----------------------------------------------------
  mouthDark: "#8d3c4d",
  tongue: "#ff7d92",
  teeth: "#fffdf7",
  blush: "#ff8fae",

  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as const;

/** Corner radii. Kid UI is round everywhere; pick from here, never inline. */
export const kidRadius = {
  chip: 22,
  card: 40,
  bubble: 56,
  banner: 48,
  pill: 999,
} as const;

/**
 * Type scale. Floors are deliberately above docs/STYLE.md's 34px: the reader
 * is six, and half of these land on a phone screen.
 */
export const kidType = {
  /** Absolute floor for any text in a kid composition. */
  min: 44,
  bubble: 60,
  bubbleSmall: 50,
  label: 56,
  title: 132,
  word: 150,
} as const;

export type SkyVariant = "day" | "sunset" | "night" | "underwater";

/**
 * CSS background for a sky. Three stops rather than two: the horizon band is
 * what makes a gradient read as *sky* instead of as a colour ramp.
 */
export function skyGradient(variant: SkyVariant = "day"): string {
  const t = kidTheme;
  const stops: Record<SkyVariant, [string, string, string]> = {
    day: [t.skyTop, t.skyMid, t.skyLow],
    sunset: [t.sunsetTop, t.sunsetMid, t.sunsetLow],
    night: [t.nightTop, t.nightMid, t.nightLow],
    underwater: [t.seaTop, t.seaMid, t.seaLow],
  };
  const [a, b, c] = stops[variant];
  return `linear-gradient(180deg, ${a} 0%, ${b} 58%, ${c} 100%)`;
}

/** The three sky stops, for code that needs the colours rather than the CSS. */
export function skyColors(variant: SkyVariant = "day"): [string, string, string] {
  const t = kidTheme;
  if (variant === "sunset") return [t.sunsetTop, t.sunsetMid, t.sunsetLow];
  if (variant === "night") return [t.nightTop, t.nightMid, t.nightLow];
  if (variant === "underwater") return [t.seaTop, t.seaMid, t.seaLow];
  return [t.skyTop, t.skyMid, t.skyLow];
}

/** Water body for the bottom of an ocean scene. */
export function waterGradient(): string {
  const t = kidTheme;
  return `linear-gradient(180deg, ${t.waterLight} 0%, ${t.water} 40%, ${t.waterDeep} 100%)`;
}

/**
 * Text shadow for kid text: a chunky light halo plus a soft drop shadow, so
 * dark text survives a bright sky. The financial suite's `darkOutline()` does
 * the opposite job (light text on dark) — don't mix them.
 */
export function kidOutline(w = 3, color: string = kidTheme.paper): string {
  return [
    `-${w}px -${w}px 0 ${color}`,
    `${w}px -${w}px 0 ${color}`,
    `-${w}px ${w}px 0 ${color}`,
    `${w}px ${w}px 0 ${color}`,
    `0 ${w + 2}px ${w + 4}px rgba(36, 52, 71, 0.28)`,
  ].join(", ");
}

/**
 * Ink ring for big display text — the replacement for `-webkit-text-stroke`
 * everywhere in the kid suite (2026-08-01).
 *
 * Stroking text outlines each glyph *contour* on its own, and an iPhone
 * resolves `system-ui` to a variable font whose letterforms keep their
 * overlapping components — so a stroked "A" renders as the three bars it is
 * assembled from, each wearing its own outline. `paint-order: stroke` hides
 * that in Chrome (it paints the seams under the fill) but WebKit only honours
 * it for SVG, which is why every laptop preview looked fine and the phone did
 * not. A ring of text-shadows is cast by the glyph's *finished* silhouette,
 * so it is seamless on every platform.
 *
 * `w` is the ring's thickness outside the glyph: pass HALF the stroke width
 * it replaces, because a centred stroke only ever showed half of itself.
 */
export function kidInkOutline(w: number, color: string = kidTheme.ink): string {
  // Enough points that adjacent shadow copies overlap (spacing < ~1px).
  const steps = Math.max(8, Math.ceil(w * 6.5));
  return Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return `${(Math.cos(a) * w).toFixed(2)}px ${(Math.sin(a) * w).toFixed(2)}px 0 ${color}`;
  }).join(", ");
}

/** SVG counterpart: a stroke painted under the glyph fill. */
export function kidSvgOutline(
  w = 6,
  color: string = kidTheme.paper,
): React.CSSProperties {
  return {
    paintOrder: "stroke",
    stroke: color,
    strokeWidth: w,
    strokeLinejoin: "round",
  };
}

/** Chunky, friendly drop shadow for cards and bubbles. */
export function kidShadow(strength = 1): string {
  return `0 ${10 * strength}px ${26 * strength}px rgba(36, 52, 71, ${0.22 * strength})`;
}

/** Mix two hex colours. Used for fill-level tinting (white cloud -> grey). */
export function mixHex(a: string, b: string, t: number): string {
  const clamp = Math.max(0, Math.min(1, t));
  const pa = parseHex(a);
  const pb = parseHex(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * clamp));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}
