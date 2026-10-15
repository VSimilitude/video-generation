// The site shell: a player screen per video, reached from the family hub.
//
// Routing is the URL hash (#/<id> for a video, #/all for the review gallery)
// so the build stays a single static index.html — no server rewrites, and the
// phone back button works. The bare #/ is no longer a front door: it sends
// people to the hub (kthanks.com), which is where videos are picked from now.
// Chrome styling comes from siteTheme.ts so the page looks like the hub.

import React from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { BranchingPlayer } from "./BranchingPlayer";
import { EndCard } from "./ChoiceCard";
import { FullscreenStage } from "./FullscreenStage";
import { hubHome, returnToHub } from "./hub";
import { site } from "./siteTheme";
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
  maxWidth: 720,
  padding: "calc(16px + env(safe-area-inset-top)) 16px 48px",
  color: site.text,
  fontFamily: site.fontFamily,
  boxSizing: "border-box",
};

const cardStyle: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: site.text,
  background: site.surface,
  border: `2px solid ${site.border}`,
  borderRadius: site.radius,
  padding: 16,
  marginBottom: 12,
  boxShadow: site.shadow,
};

// The hub's buttons, so "Back to the hub" here is the same button it is there.
const pillButton = (primary: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 999,
  border: `2px solid ${primary ? "transparent" : site.border}`,
  background: primary ? site.primary : site.surface,
  color: primary ? "#fff" : site.text,
  fontFamily: site.fontFamily,
  fontSize: 17,
  fontWeight: 700,
  cursor: "pointer",
  touchAction: "manipulation",
  boxShadow: primary ? "0 4px 0 rgba(0, 0, 0, 0.12)" : "none",
  textDecoration: "none",
});

const HubButton: React.FC<{ big?: boolean }> = ({ big }) => (
  <button
    type="button"
    onClick={returnToHub}
    style={{
      ...pillButton(true),
      ...(big ? { width: "100%", minHeight: 60, fontSize: 20 } : {}),
    }}
  >
    🏠 Back to the hub
  </button>
);

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
      background: site.surface,
      border: `2px solid ${site.border}`,
      borderRadius: site.radius,
      padding: "36px 24px",
      textAlign: "center",
      width: "100%",
      boxSizing: "border-box",
      color: site.text,
      fontFamily: site.fontFamily,
    }}
  >
    <div style={{ fontSize: 46, lineHeight: 1, marginBottom: 12 }}>🫧</div>
    <p style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>
      Something hiccuped!
    </p>
    <p style={{ margin: "0 0 18px", color: site.textSoft, fontSize: 15 }}>
      The video tripped over its own feet. Tap to try again.
    </p>
    <button type="button" onClick={onRetry} style={pillButton(true)}>
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

// Branching entries advertise themselves in the gallery and under the player.
// They deliberately do NOT show a duration: a CYOA composition's
// `durationInFrames` is the sum of every branch laid end to end, so the honest
// mm:ss is roughly double what anyone actually watches.
const BranchingChip: React.FC = () => (
  <span
    style={{
      display: "inline-block",
      flexShrink: 0,
      color: "#fff",
      background: site.primary,
      borderRadius: 999,
      padding: "3px 10px",
      fontSize: 12,
      fontWeight: 800,
      whiteSpace: "nowrap",
    }}
  >
    you choose the story
  </span>
);

const Header: React.FC<{ subtitle: string }> = ({ subtitle }) => (
  <header style={{ marginBottom: 18 }}>
    <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 4px", lineHeight: 1.1 }}>
      All videos
    </h1>
    <p style={{ margin: 0, color: site.textSoft, fontSize: 16, fontWeight: 500 }}>
      {subtitle}
    </p>
  </header>
);

// #/all — every registered video, kids' and otherwise, for reviewing an
// episode on a phone. Not linked from anywhere a kid goes.
const Gallery: React.FC = () => (
  <main style={page}>
    <div style={{ marginBottom: 14 }}>
      <HubButton />
    </div>
    <Header subtitle="The whole suite, for review. Kids get theirs from the hub." />
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
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1.15 }}>
            {video.title}
          </h2>
          {video.branching ? (
            <BranchingChip />
          ) : (
            <span style={{ color: site.textSoft, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
              {formatDuration(video.durationInFrames, video.fps)}
            </span>
          )}
        </div>
        <p
          style={{
            margin: "6px 0 0",
            color: site.textSoft,
            fontSize: 15,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {video.description}
        </p>
      </a>
    ))}
    {PUBLIC_VIDEOS.length === 0 ? (
      <p style={{ color: site.textSoft }}>No videos registered yet.</p>
    ) : null}
  </main>
);

// #/ — the old gallery address. The hub is the front door now, so go there.
const GoToHub: React.FC = () => {
  React.useEffect(() => {
    window.location.replace(hubHome());
  }, []);
  return (
    <main style={{ ...page, textAlign: "center", paddingTop: "40vh" }}>
      <p style={{ margin: 0, color: site.textSoft, fontWeight: 700 }}>
        Taking you to the hub…
      </p>
    </main>
  );
};

// Letterbox: the player fills the viewport width and keeps the composition's
// aspect ratio, on a flat dark field. `display: flex` (not `lineHeight: 0`)
// removes the inline baseline gap under the player — line-height here would
// cascade into the composition itself, since the Player does not reset
// inherited typography.
const letterbox: React.CSSProperties = {
  background: "#0a0e18",
  border: `2px solid ${site.border}`,
  borderRadius: 12,
  overflow: "hidden",
  display: "flex",
};

// A linear video's last frame used to be a paused picture and silence. Kids
// who have just finished are the audience the hub most wants to hear from, so
// the end shows the same card the branching player ends on — watch again, or
// back to the hub, where the "how was it?" card is waiting.
function useEndedOverlay(player: PlayerRef | null): {
  ended: boolean;
  watchAgain: () => void;
} {
  const [ended, setEnded] = React.useState(false);
  React.useEffect(() => {
    if (!player) return;
    const onEnded = () => setEnded(true);
    const onPlay = () => setEnded(false);
    player.addEventListener("ended", onEnded);
    player.addEventListener("play", onPlay);
    return () => {
      player.removeEventListener("ended", onEnded);
      player.removeEventListener("play", onPlay);
    };
  }, [player]);
  const watchAgain = React.useCallback(() => {
    setEnded(false);
    player?.seekTo(0);
    player?.play();
  }, [player]);
  return { ended, watchAgain };
}

const LinearPlayer: React.FC<{
  video: SiteVideo;
  errorFallback: () => React.ReactElement;
}> = ({ video, errorFallback }) => {
  // State, not a ref: the ended-subscription effect must re-run once the
  // Player instance actually attaches.
  const [player, setPlayer] = React.useState<PlayerRef | null>(null);
  const { ended, watchAgain } = useEndedOverlay(player);
  return (
    // The stage owns the letterbox so the fullscreen button, and the
    // portrait-phone rotation, work the same here as in the branching
    // player. Remotion's own fullscreen stays on for mouse users (there
    // is no overlay to leave behind on a linear video) and off on touch,
    // where two fullscreen buttons would just fight.
    <FullscreenStage letterboxStyle={letterbox} label={video.title}>
      {(stage) => (
        <>
          <Player
            ref={setPlayer}
            component={video.component}
            durationInFrames={video.durationInFrames}
            compositionWidth={video.width}
            compositionHeight={video.height}
            fps={video.fps}
            controls
            clickToPlay
            doubleClickToFullscreen={stage.allowPlayerFullscreen}
            allowFullscreen={stage.allowPlayerFullscreen}
            // Mobile Safari only reliably plays audio elements unlocked by
            // a user gesture; the shared pool is warmed on first tap and
            // reused, instead of minting a fresh <audio> per line mid-play.
            numberOfSharedAudioTags={10}
            acknowledgeRemotionLicense
            errorFallback={errorFallback}
            style={stage.playerStyle}
          />
          {ended ? (
            <EndCard
              picks={[]}
              onAgain={watchAgain}
              onDifferent={watchAgain}
              canTryDifferent={false}
              onHome={returnToHub}
            />
          ) : null}
        </>
      )}
    </FullscreenStage>
  );
};

const PlayerScreen: React.FC<{ video: SiteVideo }> = ({ video }) => {
  // Bumping this remounts the Player subtree, so "try again" is a real retry
  // from a clean mount rather than a re-render of the state that just threw.
  const [attempt, setAttempt] = React.useState(0);
  const retry = React.useCallback(() => setAttempt((n) => n + 1), []);
  const hiccup = React.useCallback(() => <Hiccup onRetry={retry} />, [retry]);

  return (
    <main style={page}>
      <div style={{ marginBottom: 14 }}>
        <button type="button" onClick={returnToHub} style={pillButton(false)}>
          ← Back to the hub
        </button>
      </div>
      <ErrorBoundary onRetry={retry}>
        {video.branching ? (
          // Same containment, different screen: the branching player wraps the
          // letterbox in its own stage, because the choice card has to sit over
          // the picture and go fullscreen with it.
          <BranchingPlayer
            key={attempt}
            video={video}
            spec={video.branching}
            letterboxStyle={letterbox}
            errorFallback={hiccup}
          />
        ) : (
          <LinearPlayer key={attempt} video={video} errorFallback={hiccup} />
        )}
      </ErrorBoundary>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: "18px 0 4px", lineHeight: 1.15 }}>
        {video.title}
      </h2>
      <p
        style={{
          margin: 0,
          color: site.textSoft,
          fontSize: 16,
          fontWeight: 500,
          lineHeight: 1.4,
        }}
      >
        {video.description}
      </p>
      <p
        style={{
          margin: "10px 0 0",
          color: site.textSoft,
          fontSize: 14,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {video.branching ? (
          <>
            <BranchingChip />
            <span>When the cards appear, tap one. Turn the sound up!</span>
          </>
        ) : (
          <span>
            {formatDuration(video.durationInFrames, video.fps)} · Turn the sound up!
          </span>
        )}
      </p>
      <div style={{ marginTop: 24 }}>
        <HubButton big />
      </div>
    </main>
  );
};

const NotFound: React.FC<{ id: string }> = ({ id }) => (
  <main style={page}>
    <Header subtitle={`No video registered with the id "${id}".`} />
    <HubButton />
  </main>
);

export const App: React.FC = () => {
  const id = useHashRoute();
  if (!id) return <GoToHub />;
  if (id === "all") return <Gallery />;
  const video = findVideo(id);
  if (!video) return <NotFound id={id} />;
  return <PlayerScreen video={video} />;
};
