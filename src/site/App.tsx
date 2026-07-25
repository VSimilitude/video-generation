// The site shell: a gallery of every video in the suite plus a player screen.
//
// Routing is the URL hash (#/ for the gallery, #/<id> for a video) so the
// build stays a single static index.html — no server rewrites, and the phone
// back button works. Styling comes from src/lib/theme.ts so the page reads as
// part of the same suite as the videos.

import React from "react";
import { Player } from "@remotion/player";
import { theme } from "../lib/theme";
import { VIDEOS, findVideo, formatDuration, type SiteVideo } from "./registry";

function currentVideoId(): string | null {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return hash.length > 0 ? decodeURIComponent(hash) : null;
}

function useHashRoute(): string | null {
  const [id, setId] = React.useState<string | null>(() => currentVideoId());
  React.useEffect(() => {
    const onChange = () => setId(currentVideoId());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return id;
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  margin: "0 auto",
  maxWidth: 1100,
  padding: "20px 16px 48px",
  color: theme.text,
  fontFamily: theme.fontFamily,
  boxSizing: "border-box",
};

const cardStyle: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: theme.text,
  background: theme.panel,
  border: `1px solid ${theme.panelBorder}`,
  borderRadius: 16,
  padding: 18,
  marginBottom: 14,
};

const Header: React.FC<{ subtitle: string }> = ({ subtitle }) => (
  <header style={{ marginBottom: 22 }}>
    <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px" }}>
      video_generation
      <span style={{ color: theme.accent }}>.</span>
    </h1>
    <p style={{ margin: 0, color: theme.textMuted, fontSize: 15 }}>{subtitle}</p>
  </header>
);

const Gallery: React.FC = () => (
  <main style={page}>
    <Header subtitle="Remotion + Kokoro TTS videos, playing live in the browser." />
    {VIDEOS.map((video) => (
      <a key={video.id} href={`#/${video.id}`} style={cardStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>
            {video.title}
          </h2>
          <span
            style={{ color: theme.accentSoft, fontSize: 14, flexShrink: 0 }}
          >
            {formatDuration(video.durationInFrames, video.fps)}
          </span>
        </div>
        <p
          style={{
            margin: "8px 0 0",
            color: theme.textMuted,
            fontSize: 15,
            lineHeight: 1.45,
          }}
        >
          {video.description}
        </p>
      </a>
    ))}
    {VIDEOS.length === 0 ? (
      <p style={{ color: theme.textMuted }}>No videos registered yet.</p>
    ) : null}
  </main>
);

const PlayerScreen: React.FC<{ video: SiteVideo }> = ({ video }) => (
  <main style={page}>
    <a
      href="#/"
      style={{
        display: "inline-block",
        marginBottom: 14,
        color: theme.accent,
        textDecoration: "none",
        fontSize: 15,
      }}
    >
      ← All videos
    </a>
    {/* Letterbox: the player fills the viewport width and keeps the
        composition's aspect ratio, on a flat dark field. */}
    <div
      style={{
        background: theme.outline,
        border: `1px solid ${theme.panelBorder}`,
        borderRadius: 12,
        overflow: "hidden",
        lineHeight: 0,
      }}
    >
      <Player
        component={video.component}
        durationInFrames={video.durationInFrames}
        compositionWidth={video.width}
        compositionHeight={video.height}
        fps={video.fps}
        controls
        clickToPlay
        doubleClickToFullscreen
        allowFullscreen
        acknowledgeRemotionLicense
        style={{ width: "100%" }}
      />
    </div>
    <h2 style={{ fontSize: 20, fontWeight: 700, margin: "18px 0 6px" }}>
      {video.title}
    </h2>
    <p
      style={{
        margin: 0,
        color: theme.textMuted,
        fontSize: 15,
        lineHeight: 1.45,
      }}
    >
      {video.description}
    </p>
    <p style={{ marginTop: 10, color: theme.textMuted, fontSize: 13 }}>
      {formatDuration(video.durationInFrames, video.fps)} ·{" "}
      {video.width}×{video.height} @ {video.fps} fps · has narration — unmute or
      raise the volume.
    </p>
  </main>
);

const NotFound: React.FC<{ id: string }> = ({ id }) => (
  <main style={page}>
    <Header subtitle={`No video registered with the id "${id}".`} />
    <a href="#/" style={{ color: theme.accent }}>
      ← All videos
    </a>
  </main>
);

export const App: React.FC = () => {
  const id = useHashRoute();
  const video = findVideo(id);
  if (!id) return <Gallery />;
  if (!video) return <NotFound id={id} />;
  return <PlayerScreen video={video} />;
};
