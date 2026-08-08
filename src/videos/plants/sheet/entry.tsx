// Standalone Remotion entry point for Pip's character sheet.
//
//   npx remotion still src/videos/plants/sheet/entry.tsx PipSheet \
//       scratchpad/ep4_pip_sheet.png
//
// It points here rather than at src/index.ts on purpose (the same trick
// `npm run icons` uses): the sheet is a design artefact rather than a video, so
// it does not take a registry entry, does not appear in the gallery, and does
// not need the whole suite to compile before it can be drawn.

import React from "react";
import { Composition, registerRoot } from "remotion";
import { PipSheet, SHEET } from "./Sheet";

const SheetRoot: React.FC = () => (
  <Composition
    id="PipSheet"
    component={PipSheet}
    durationInFrames={1}
    fps={SHEET.fps}
    width={SHEET.width}
    height={SHEET.height}
  />
);

registerRoot(SheetRoot);
