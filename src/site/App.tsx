// The site shell: a gallery of every video in the suite plus a player screen.
//
// Routing is the URL hash (#/ for the gallery, #/<id> for a video) so the
// build stays a single static index.html — no server rewrites, and the phone
// back button works. Styling comes from src/lib/theme.ts so the page reads as
// part of the same suite as the videos.

import React from "react";
import { Player } from "@remotion/player";
import { theme } from "../lib/theme";
import {
  PUBLIC_VIDEOS,
  findVideo,
  formatDuration,
  type SiteVideo,
} from "./registry";

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

// --- Crash containment -----------------------------------------------------
//
// A composition that throws takes the whole React tree down with it, and an
// unmounted tree on a static page means a blank screen with no way back — the
// viewer has to know to reload. That is not an acceptable failure mode for an
// audience that cannot read the URL bar, so a render error is caught and turned
// into something tappable instead.
//
// Two layers, because they catch different things: `errorFallback` handles a
// throw from inside the composition while the Player is driving it, and the
// boundary below catches anything that escapes the Player itself (mount-time
// throws, errors in the surrounding screen).

const Hiccup: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div
    style={{
      background: theme.panel,
      border: `1px solid ${theme.panelBorder}`,
      borderRadius: 16,
      padding: "36px 24px",
      textAlign: "center",
      width: "100%",
      boxSizing: "border-box",
    }}
  >
    <div style={{ fontSize: 46, lineHeight: 1, marginBottom: 12 }}>🫧</div>
    <p style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>
      Something hiccuped!
    </p>
    <p style={{ margin: "0 0 18px", color: theme.textMuted, fontSize: 15 }}>
      The video tripped over its own feet. Tap to try again.
    </p>
    <button
      type="button"
      onClick={onRetry}
      style={{
        fontFamily: theme.fontFamily,
        fontSize: 17,
        fontWeight: 700,
        color: theme.outline,
        background: theme.accent,
        border: "none",
        borderRadius: 999,
        padding: "12px 30px",
        cursor: "pointer",
      }}
    >
      Try again
    </button>
  </div>
);

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onRetry: () => void },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    // Console only: there is no error reporting service wired up, and this at
    // least leaves a trace for whoever opens devtools after a report.
    console.error("[site] composition crashed:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <Hiccup
          onRetry={() => {
            this.setState({ error: null });
            this.props.onRetry();
          }}
        />
      );
    }
    return this.props.children;
  }
}

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
    {PUBLIC_VIDEOS.map((video) => (
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
    {PUBLIC_VIDEOS.length === 0 ? (
      <p style={{ color: theme.textMuted }}>No videos registered yet.</p>
    ) : null}
  </main>
);

// Letterbox: the player fills the viewport width and keeps the composition's
// aspect ratio, on a flat dark field. `display: flex` (not `lineHeight: 0`)
// removes the inline baseline gap under the player — line-height here would
// cascade into the composition itself, since the Player does not reset
// inherited typography.
const letterbox: React.CSSProperties = {
  background: theme.outline,
  border: `1px solid ${theme.panelBorder}`,
  borderRadius: 12,
  overflow: "hidden",
  display: "flex",
};

const PlayerScreen: React.FC<{ video: SiteVideo }> = ({ video }) => {
  // Bumping this remounts the Player subtree, so "try again" is a real retry
  // from a clean mount rather than a re-render of the state that just threw.
  const [attempt, setAttempt] = React.useState(0);
  const retry = React.useCallback(() => setAttempt((n) => n + 1), []);

  return (
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
      <ErrorBoundary onRetry={retry}>
        <div key={attempt} style={letterbox}>
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
            errorFallback={() => <Hiccup onRetry={retry} />}
            style={{ width: "100%" }}
          />
        </div>
      </ErrorBoundary>
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
};

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
