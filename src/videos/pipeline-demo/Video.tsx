import React from "react";
import {
  Series,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../../lib/components/Backdrop";
import { Caption } from "../../lib/components/Caption";
import { ContentArea } from "../../lib/components/ContentArea";
import { TitleCard } from "../../lib/components/TitleCard";
import { SceneAudio, buildTimeline } from "../../lib/narration";
import { theme, darkOutline } from "../../lib/theme";
import { NARRATION } from "./narrationManifest";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene order + narration mapping. The timeline stretches each scene to fit
// its clip, so total duration always tracks the generated audio.
export function timeline() {
  return buildTimeline(
    [
      { id: "intro", clip: NARRATION.intro, minFrames: 120 },
      { id: "pipeline", clip: NARRATION.pipeline, minFrames: 180 },
      { id: "timing", clip: NARRATION.timing, minFrames: 180 },
      { id: "outro", clip: NARRATION.outro, minFrames: 120, tailFrames: 30 },
    ],
    FPS,
  );
}

// Three-step pipeline diagram; each step pops in on its own beat.
const PipelineDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = [
    { label: "Script", detail: "plain text lines", color: theme.accent, at: 20 },
    { label: "Kokoro", detail: "speech + durations", color: theme.warm, at: 75 },
    { label: "Remotion", detail: "rendered video", color: theme.good, at: 130 },
  ];
  return (
    <ContentArea gap={48}>
      {steps.map((step, i) => {
        const pop = spring({
          frame: frame - step.at,
          fps,
          config: { damping: 13, mass: 0.7 },
        });
        return (
          <React.Fragment key={step.label}>
            {i > 0 ? (
              <div
                style={{
                  fontSize: 84,
                  color: theme.textMuted,
                  opacity: Math.max(0, pop),
                  textShadow: darkOutline(2),
                }}
              >
                →
              </div>
            ) : null}
            <div
              style={{
                width: 380,
                padding: "44px 20px",
                textAlign: "center",
                background: theme.panel,
                border: `3px solid ${step.color}`,
                borderRadius: 24,
                boxShadow: `0 0 34px ${step.color}44`,
                transform: `scale(${0.5 + 0.5 * pop})`,
                opacity: Math.max(0, pop),
              }}
            >
              <div style={{ fontSize: 64, fontWeight: 900, textShadow: darkOutline(2) }}>
                {step.label}
              </div>
              <div style={{ fontSize: 34, color: theme.textMuted, marginTop: 12 }}>
                {step.detail}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </ContentArea>
  );
};

// Visual for audio-driven timing: a "waveform" fills, and the scene block
// underneath stretches to match its width.
const TimingDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [15, 120], [0.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bars = 36;
  return (
    <ContentArea direction="column" gap={34}>
      <div style={{ width: 1100 }}>
        <div style={{ fontSize: 34, color: theme.textMuted, marginBottom: 14 }}>
          narration clip
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            height: 120,
            width: `${grow * 100}%`,
            overflow: "hidden",
          }}
        >
          {Array.from({ length: bars }, (_, i) => {
            const h = 24 + 80 * Math.abs(Math.sin(i * 1.7 + 0.6));
            return (
              <div
                key={i}
                style={{
                  width: 22,
                  height: h,
                  borderRadius: 8,
                  background: theme.warm,
                  opacity: 0.9,
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>
      </div>
      <div style={{ width: 1100 }}>
        <div style={{ fontSize: 34, color: theme.textMuted, marginBottom: 14 }}>
          scene duration
        </div>
        <div
          style={{
            width: `calc(${grow * 100}% + 70px)`,
            height: 84,
            borderRadius: 16,
            background: theme.panel,
            border: `3px solid ${theme.accent}`,
            boxShadow: `0 0 28px ${theme.accent}44`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 30,
            fontSize: 36,
            fontWeight: 700,
            textShadow: darkOutline(1),
          }}
        >
          audio + tail
        </div>
      </div>
    </ContentArea>
  );
};

// No caption on this scene, so it gets the whole frame — a caption-less scene
// must not carry a leftover bottom padding "just in case".
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 15, mass: 0.9 } });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 92,
          fontWeight: 900,
          textShadow: darkOutline(3),
          transform: `scale(${0.7 + 0.3 * pop})`,
          opacity: pop,
        }}
      >
        Same pipeline, next topic<span style={{ color: theme.accent }}>.</span>
      </div>
    </div>
  );
};

export const PipelineDemoVideo: React.FC = () => {
  const { scenes } = timeline();
  const captions: Record<string, string> = {
    pipeline: "Script → Kokoro speech → Remotion render",
    timing: "Scenes stretch to fit their narration",
  };
  return (
    <Backdrop>
      <Series>
        {scenes.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
          >
            <SceneAudio clip={scene.clip} />
            {scene.id === "intro" ? (
              <TitleCard
                title="Generated, Start to Finish"
                subtitle="How this video series is made"
              />
            ) : null}
            {scene.id === "pipeline" ? <PipelineDiagram /> : null}
            {scene.id === "timing" ? <TimingDiagram /> : null}
            {scene.id === "outro" ? <Outro /> : null}
            {captions[scene.id] ? <Caption text={captions[scene.id]} /> : null}
          </Series.Sequence>
        ))}
      </Series>
    </Backdrop>
  );
};
