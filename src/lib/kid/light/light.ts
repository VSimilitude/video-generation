// Light rig (ROADMAP Step 2, gap 3; brief §4 light script).
//
// `dir` is the SCREEN direction from the subject toward the key light, in
// degrees, SVG convention (0 = camera-right, −90 = straight up, 180 = left).
// `elevation` 0 = on the horizon (long shadows, wide terminator), 1 =
// overhead. `contrast` 0–1 scales shade alpha. Pure data + pure helpers.

export type LightRig = {
  dir: number;
  elevation: number;
  key: string;
  shadow: string;
  contrast: number;
  /**
   * Optional visibility multiplier for the light ON the character (cast-shade, lit-side band and rim
   * alphas, clamped; also widens the rim and the shade push). Omitted = the iteration-2 look, so existing episodes are unchanged.
   */
  strength?: number;
};

export type TimeOfDay = "day" | "interior" | "night";

/** Unit vector toward the key, optionally mirrored for a flipped character. */
export function keyVector(light: LightRig, flip = false): { x: number; y: number } {
  const a = (light.dir * Math.PI) / 180;
  return { x: Math.cos(a) * (flip ? -1 : 1), y: Math.sin(a) };
}

/** `dir` (degrees) from a subject to a light source (e.g. Sunny's disc). */
export function keyDirTo(from: { x: number; y: number }, to: { x: number; y: number }): number {
  return (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
}

/** Shade alpha for a rig: 0.25 at contrast 0 up to 0.4 at contrast 1 (spec band). */
/** Rim: width (local units) and alpha grow as the key drops toward the horizon (dawn = rim-lit). */
export function rimFor(light: LightRig): { width: number; alpha: number } {
  const low = 1 - Math.max(0, Math.min(1, light.elevation));
  const a = 0.3 + 0.35 * low;
  const w = 2 + 5 * low;
  if (light.strength === undefined) return { width: w, alpha: a };
  // With a strength the rim also widens, so it clears the body's ink line (a 2–5 unit rim sits under it).
  return { width: w * Math.max(1, light.strength * 1.4), alpha: Math.min(0.95, a * light.strength) };
}

export function shadeAlpha(light: LightRig): number {
  const a = 0.3 + 0.1 * Math.max(0, Math.min(1, light.contrast));
  return light.strength === undefined ? a : Math.min(0.85, a * light.strength);
}

/**
 * How far the shade silhouette is pushed off the body, in body-local units.
 * Spec: 6 px × (1 − elevation) — read as 6 px per 50 px of body height so it
 * reads on a 300-unit hero (a literal 6 px band vanished at phone size); an
 * overhead key keeps a floor of 40% so a top light still shades the belly.
 */
export function shadePush(light: LightRig, bodyH: number): number {
  const p = 6 * (bodyH / 50) * Math.max(0.4, 1 - light.elevation);
  return light.strength === undefined ? p : p * Math.max(1, light.strength);
}

/** Ground-shadow geometry (scene px). Spec: 0.9× w, 0.18× w tall, offset 0.35× along −key, ×0.5 at 200 px altitude. */
export function groundShadowGeom(light: LightRig, bodyW: number, altitude = 0, groundLum = 0.5) {
  const k = keyVector(light);
  const lift = Math.max(0, Math.min(1, altitude / 200));
  const s = 1 - 0.5 * lift;
  const horiz = Math.sign(k.x) * Math.min(1, Math.abs(k.x) * 1.5);
  return {
    w: 0.9 * bodyW * s,
    h: 0.18 * bodyW * s,
    dx: -horiz * 0.35 * bodyW * (1 - light.elevation),
    // 0.3 on a mid-value ground, rising to ~0.45 on a dark one (value 0.25):
    // a multiply shadow on a dark sea/floor otherwise vanishes.
    opacity: Math.max(0.3, Math.min(0.48, 0.3 + 0.6 * (0.5 - groundLum))) * (1 - 0.45 * lift),
  };
}

/** "#rrggbb" -> "rgba(r,g,b,a)". */
export function rgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a.toFixed(3)})`;
}

/**
 * A feathered radial gradient (CSS): eased alpha falloff with no visible rim,
 * so a glow never reads as a disc. Fully transparent at the box edge.
 */
export function softRadial(color: string, shape = "closest-side"): string {
  const stops: Array<[number, number]> = [[0, 1], [0.12, 0.9], [0.3, 0.6], [0.5, 0.3], [0.7, 0.11], [0.85, 0.03], [1, 0]];
  return `radial-gradient(${shape}, ${stops.map(([p, a]) => `${rgba(color, a)} ${Math.round(p * 100)}%`).join(", ")})`;
}
