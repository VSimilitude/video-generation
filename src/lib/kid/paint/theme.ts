import { kidTheme, mixHex } from "../theme";

// kidPaintTheme — the painted variant's palette (ROADMAP Step 2, gap 1 §1).
//
// Rules the numbers encode:
//   - ink is a cool near-black (#2b2a33), never #000; character outlines are
//     that ink pulled toward each character's own deep colour, so hue
//     identity survives in the line.
//   - paper cream (#f3ead8) is the brightest value anywhere. Nothing paints
//     #fff — eye whites come from the existing Face and are a tiny area.
//   - every body colour comes in exactly THREE values (shadow / base / light),
//     derived from kidTheme so the six-episode identities hold. No gradients
//     and no specular shines in paint variants.

export const PAINT_INK = "#2b2a33";
export const PAINT_PAPER = "#f3ead8";

export type Value3 = { shadow: string; base: string; light: string; line: string };

/**
 * Three values from one kidTheme colour: the shadow leans toward a cool
 * violet (gouache shadows are coloured, not grey), the light toward cream.
 * `tame` pulls the base a little toward cream-grey to bring saturation
 * into the bible band.
 */
export function threeValues(
  base: string,
  deep: string,
  opts: { tame?: number; shadowMix?: number; lightMix?: number; lineMix?: number } = {},
): Value3 {
  const tame = opts.tame ?? 0.12;
  const b = mixHex(base, "#b9b4b0", tame);
  return {
    base: b,
    shadow: mixHex(mixHex(b, deep, 0.55), "#4a4470", opts.shadowMix ?? 0.25),
    light: mixHex(b, PAINT_PAPER, opts.lightMix ?? 0.4),
    line: mixHex(deep, PAINT_INK, opts.lineMix ?? 0.45),
  };
}

export const kidPaintTheme = {
  ink: PAINT_INK,
  paper: PAINT_PAPER,
  /** Drip. */
  water: threeValues(kidTheme.water, kidTheme.waterDeep, { tame: 0 }),
  waterLimb: threeValues(kidTheme.waterDark, kidTheme.waterDeep, { tame: 0 }),
  /** Sunny's disc and rays. */
  sun: threeValues(kidTheme.sun, kidTheme.sunDeep, { tame: 0.04, lightMix: 0.45 }),
  sunRay: threeValues(kidTheme.sunDark, kidTheme.sunDeep, { tame: 0.04 }),
  /** Cloudia (at fill 0): cream-cool, never white. */
  cloud: {
    base: mixHex(PAINT_PAPER, kidTheme.cloudShade, 0.45),
    shadow: mixHex(kidTheme.cloudGrey, "#6f6a9a", 0.25),
    light: PAINT_PAPER,
    line: mixHex("#5d6f86", PAINT_INK, 0.35),
  } as Value3,
  pink: threeValues(kidTheme.pink, kidTheme.pinkDeep, { tame: 0.12 }),
  /** Hero lit-side lift: lighter AND more saturated than the base (not toward grey/cream). */
  waterLit: "#45d4ff",
} as const;
