import React from "react";
import { Composition } from "remotion";
import { VIDEOS } from "./videos/registry";

// One <Composition> per registered video. Everything — id, component, size and
// duration — comes from src/videos/registry.ts, which derives each duration
// from that video's timeline() and so from the generated narration manifest:
// re-run `npm run narration` after a script change and the durations follow.
//
// Registering a video is an entry in the registry, not an edit here.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {VIDEOS.map((video) => (
        <Composition
          key={video.id}
          id={video.id}
          component={video.component}
          durationInFrames={video.durationInFrames}
          fps={video.fps}
          width={video.width}
          height={video.height}
        />
      ))}
    </>
  );
};
