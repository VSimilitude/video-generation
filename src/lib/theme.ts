// Base visual language for the educational suite. Deliberately neutral — a
// clean dark slate look with one accent — so individual videos can lean on it
// directly or override pieces per topic. Refine here as we learn what reads
// well (see docs/STYLE.md).

export const theme = {
  bgTop: "#1d2433",
  bgBottom: "#10141d",
  bgGlow: "#2a3550",

  panel: "rgba(10, 14, 24, 0.66)",
  panelBorder: "rgba(255, 255, 255, 0.14)",

  text: "#f4f6fb",
  textMuted: "#a8b0c4",

  accent: "#4cc2ff",
  accentSoft: "#8fdcff",
  warm: "#ffb84c",
  good: "#7fe08a",

  outline: "#0a0e18",
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as const;

// Layered dark outline so light text stays readable over any backdrop.
export function darkOutline(w = 2): string {
  const o = theme.outline;
  return [
    `-${w}px -${w}px 0 ${o}`,
    `${w}px -${w}px 0 ${o}`,
    `-${w}px ${w}px 0 ${o}`,
    `${w}px ${w}px 0 ${o}`,
    `0 ${w + 1}px ${w + 2}px rgba(0,0,0,0.55)`,
  ].join(", ");
}
