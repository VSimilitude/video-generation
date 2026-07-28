// Standalone Remotion entry point for `npm run icons`.
//
// The icon compositions are also in src/videos/registry.ts (so Studio and
// `npx remotion still AppIcon` can reach them the usual way), but the icons
// script points at THIS file instead of src/index.ts on purpose: it bundles
// one SVG rather than the whole suite, which turns a two-minute build into a
// couple of seconds and keeps a home-screen icon from depending on every
// episode in the tree compiling.

import React from "react";
import { Composition, registerRoot } from "remotion";
import {
  AppIconMaskableVideo,
  AppIconVideo,
  DURATION_IN_FRAMES,
  FPS,
  HEIGHT,
  WIDTH,
} from "./Video";

const IconRoot: React.FC = () => (
  <>
    <Composition
      id="AppIcon"
      component={AppIconVideo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="AppIconMaskable"
      component={AppIconMaskableVideo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);

registerRoot(IconRoot);
