// The player site's chrome — everything around the picture — matches the
// family hub (kids-hub/src/styles.css) so the hop from hub to video does not
// feel like leaving. The videos themselves keep src/lib/theme.ts; this file
// is for the page, never for a composition.

export const site = {
  bg: "#f4f6ff",
  surface: "#ffffff",
  sunk: "#eef1fb",
  text: "#23264a",
  textSoft: "#676b8f",
  border: "#e2e6f5",
  primary: "#5b6cff",
  fontFamily:
    '"Baloo 2", "Nunito", "Segoe UI", system-ui, -apple-system, sans-serif',
  radius: 18,
  shadow: "0 6px 24px rgba(35, 38, 74, 0.08)",
} as const;
