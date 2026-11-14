import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { softRadial, type TimeOfDay } from "../light/light";

// Full-frame post chain (ROADMAP Step 2, gap 1 §5), in order:
//   grade → key-light bloom → paper plate → vignette.
//
// Grade: CSS `saturate()` IS the spec's feColorMatrix saturate (same matrix),
// and `contrast(c)` maps 0..1 to (1−c)/2 .. (1+c)/2 — a black lift and a
// white cap in one op, which is what puts p2/p98 in the bible band. One CSS
// filter on the stage (memo §2(e): never stack more than one).
// Bloom: a masked screen glow at each key light (Sunny's disc, lamps), not a
// full-frame blur. Paper: public/kit/paper.webp at multiply + soft-light.
// Vignette: radial, radius 0.75.

export type PostGrade = { saturate: number; contrast: number; brightness: number };

export const POST_BANDS: Record<
  TimeOfDay,
  { grade: PostGrade; paper: [number, number]; vignette: number }
> = {
  day: { grade: { saturate: 0.92, contrast: 0.97, brightness: 1 }, paper: [0.18, 0.1], vignette: 0.18 },
  interior: { grade: { saturate: 0.9, contrast: 0.97, brightness: 0.98 }, paper: [0.22, 0.12], vignette: 0.22 },
  night: { grade: { saturate: 0.85, contrast: 0.95, brightness: 1 }, paper: [0.22, 0.12], vignette: 0.28 },
};

export type Bloom = { x: number; y: number; r: number; color: string; opacity?: number };

export const PAPER_SRC = "kit/paper.webp";

/** Baked multiply plate (paper multiply × vignette) for a band; see scratchpad/remaster/kit/make-plates.mjs. */
export const paperMulSrc = (time: TimeOfDay, skyRamp = false) => `kit/paper-mul-${time}${skyRamp ? "-sky" : ""}.webp`;

/**
 * The darkest value a band may reach, applied last as a `lighten` floor: the
 * ink family, never black. Day = the ink itself (#2b2a33); interior and night
 * sit a step under it so p2 can still land in their bible bands.
 */
export const POST_FLOOR: Record<TimeOfDay, string> = { day: "#2b2a33", interior: "#24232c", night: "#1d1c26" };

export const Post: React.FC<{
  time: TimeOfDay;
  bloom?: Bloom[];
  /** Override pieces of the grade for a beat. */
  grade?: Partial<PostGrade>;
  off?: boolean;
  /**
   * "baked" (default): paper multiply + vignette come from ONE precomputed
   * 1920x1080 multiply plate per band, and the grade is two cheap overlay
   * layers (a 50% grey at opacity 1 − contrast = CSS contrast(); a grey
   * `saturation` blend at 1 − saturate). "css": the reference chain (CSS
   * filter + two paper layers + CSS vignette) — same look, ~2× the cost.
   */
  mode?: "baked" | "css";
  /** Cost diagnostics: switch single stages off. */
  layers?: { grade?: boolean; paper?: boolean; vignette?: boolean };
  /** Lighter paper multiply over the top of frame (0.12 at the top easing to the band value by 70% height) — for skies. */
  skyRamp?: boolean;
  /** Clamp the darkest value to the band's ink floor (POST_FLOOR). Default on. */
  floor?: boolean;
  children: React.ReactNode;
}> = ({ time, bloom = [], grade, off = false, mode = "baked", layers = {}, skyRamp = false, floor = true, children }) => {
  if (off) return <AbsoluteFill>{children}</AbsoluteFill>;
  const band = POST_BANDS[time];
  const g = { ...band.grade, ...grade };
  const [mul, soft] = band.paper;
  const v = band.vignette;
  const blooms = bloom.map((b, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        left: b.x - b.r,
        top: b.y - b.r,
        width: b.r * 2,
        height: b.r * 2,
        background: softRadial(b.color),
        mixBlendMode: "screen",
        opacity: b.opacity ?? 0.25,
      }}
    />
  ));
  const softPaper =
    layers.paper === false ? null : (
      <Img
        src={staticFile(PAPER_SRC)}
        style={{ position: "absolute", left: -64, top: -480, width: 2048, height: 2048, mixBlendMode: "soft-light", opacity: soft }}
      />
    );
  if (mode === "baked") {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {children}
        {blooms}
        {layers.grade === false ? null : (
          <>
            {g.brightness !== 1 ? (
              <AbsoluteFill style={{ background: "#000", opacity: 1 - g.brightness }} />
            ) : null}
            {g.contrast < 1 ? <AbsoluteFill style={{ background: "#808080", opacity: 1 - g.contrast }} /> : null}
            {g.saturate < 1 ? (
              <AbsoluteFill style={{ background: "#808080", mixBlendMode: "saturation", opacity: 1 - g.saturate }} />
            ) : null}
          </>
        )}
        {layers.paper === false && layers.vignette === false ? null : (
          <Img src={staticFile(paperMulSrc(time, skyRamp))} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, mixBlendMode: "multiply" }} />
        )}
        {softPaper}
        {floor ? <AbsoluteFill style={{ background: POST_FLOOR[time], mixBlendMode: "lighten" }} /> : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{ filter: layers.grade === false ? undefined : `saturate(${g.saturate}) contrast(${g.contrast}) brightness(${g.brightness})` }}
      >
        {children}
        {blooms}
      </AbsoluteFill>
      {layers.paper === false ? null : (
        <Img
          src={staticFile(PAPER_SRC)}
          style={{ position: "absolute", left: 0, top: 0, width: 2048, height: 2048, mixBlendMode: "multiply", opacity: mul }}
        />
      )}
      {softPaper}
      {layers.vignette === false ? null : (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 75% 75% at 50% 50%, rgba(30,26,44,0) 55%, rgba(30,26,44,${v}) 100%)`,
            mixBlendMode: "multiply",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
