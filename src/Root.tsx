import React from "react";
import { Composition } from "remotion";
import {
  PipelineDemoVideo,
  timeline as pipelineDemoTimeline,
  FPS,
  WIDTH,
  HEIGHT,
} from "./videos/pipeline-demo/Video";
import {
  BondBasicsVideo,
  timeline as bondBasicsTimeline,
  FPS as BOND_BASICS_FPS,
  WIDTH as BOND_BASICS_WIDTH,
  HEIGHT as BOND_BASICS_HEIGHT,
} from "./videos/bond-basics/Video";

// One <Composition> per video. Duration comes from each video's timeline(),
// which is derived from the generated narration manifest — re-run
// `npm run narration` after script changes and durations follow automatically.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PipelineDemo"
        component={PipelineDemoVideo}
        durationInFrames={pipelineDemoTimeline().durationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="BondBasics"
        component={BondBasicsVideo}
        durationInFrames={bondBasicsTimeline().durationInFrames}
        fps={BOND_BASICS_FPS}
        width={BOND_BASICS_WIDTH}
        height={BOND_BASICS_HEIGHT}
      />
    </>
  );
};
