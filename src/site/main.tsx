// Browser entry for the static player site (bundled to dist-site/bundle.js by
// `npm run site`). No Remotion CLI/bundler involved — the compositions are
// imported directly and played by @remotion/player.

import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Narration audio is referenced with staticFile("narration/<slug>/<key>.mp3"),
// which Remotion resolves against window.remotion_staticBase, defaulting to
// the server root ("/narration/..."). GitHub Pages serves this site from a
// project subpath (/<repo>/), so point the static base at the directory this
// page was loaded from — computed at runtime, so one build works at any path.
const dir = window.location.pathname.replace(/[^/]*$/, "");
window.remotion_staticBase = dir.replace(/\/+$/, "");

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
