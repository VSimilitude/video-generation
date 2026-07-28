// The branching (choose-your-own-adventure) player screen.
//
// A branching video is ONE Remotion composition whose timeline is laid out as
// segments at fixed frame offsets (see the BranchingSpec types in
// src/videos/registry.ts). Playing a path means *seeking inside one mounted
// Player* — never remounting it. A remount reloads the composition, flashes,
// and drops the audio context; the seam has to be invisible, so the Player
// below mounts once for the whole session and every branch, replay and
// "different way" is a seekTo on the same instance.
//
// The viewer's choices reach the composition only through Player inputProps
// (`{ path }`), which variant scenes read. The composition stays a pure
// function of frame; this file holds all the interaction state.
//
// See docs/CYOA.md ("Player mechanics", phase 1).

import React from "react";
import { createPortal } from "react-dom";
import { Player, type CallbackListener, type PlayerRef } from "@remotion/player";
import { prefetch, staticFile } from "remotion";
import { ChoiceCard, EndCard } from "./ChoiceCard";
import {
  choiceHoldFrame,
  firstChoiceSegment,
  seamAction,
  segmentAtFrame,
} from "./branchingEngine";
import type {
  BranchChoiceOption,
  BranchingSpec,
  SiteVideo,
} from "./registry";

// ---------------------------------------------------------------------------
// OPEN UX QUESTION — being A/B tested with an actual six-year-old.
//
//   10   -> the first option is picked for the viewer after 10 seconds, with a
//           visible countdown bar on that card. Pre-readers never get stuck on
//           a screen they cannot read.
//   null -> wait forever. The story does not move until the viewer taps.
//
// docs/CYOA.md lists this as open question #1. Flip it here, rebuild, watch a
// kid use it. Nothing else in the player depends on which way it is set.
// ---------------------------------------------------------------------------
export const AUTO_CHOICE_SECONDS: number | null = 10;

type Overlay =
  | { kind: "choice"; segmentId: string }
  | { kind: "end" }
  | null;

/** localStorage payload: the last completed path plus a replay counter. */
type StoredRun = {
  path: Record<string, string>;
  runs: number;
  at: number;
};

function storageKey(videoId: string): string {
  return `cyoa:${videoId}`;
}

function readRun(videoId: string): StoredRun | null {
  try {
    const raw = window.localStorage.getItem(storageKey(videoId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredRun> | null;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      path: (parsed.path ?? {}) as Record<string, string>,
      runs: typeof parsed.runs === "number" ? parsed.runs : 0,
      at: typeof parsed.at === "number" ? parsed.at : 0,
    };
  } catch {
    // Private mode, disabled storage, corrupt JSON — all the same to us.
    return null;
  }
}

function writeRun(videoId: string, path: Record<string, string>): void {
  try {
    const previous = readRun(videoId);
    const next: StoredRun = {
      path,
      runs: (previous?.runs ?? 0) + 1,
      at: Date.now(),
    };
    window.localStorage.setItem(storageKey(videoId), JSON.stringify(next));
  } catch {
    // Persistence is a nicety; never let it break playback.
  }
}

/** Site-relative asset path -> a URL the browser can actually fetch. */
function assetUrl(path: string): string {
  try {
    return staticFile(path);
  } catch {
    return path;
  }
}

export type BranchingPlayerProps = {
  video: SiteVideo;
  spec: BranchingSpec;
  /** The site's letterbox style, reused so the two players look identical. */
  letterboxStyle: React.CSSProperties;
  /** Passed straight to the Player, so a composition throw shows the Hiccup. */
  errorFallback: () => React.ReactElement;
};

export const BranchingPlayer: React.FC<BranchingPlayerProps> = ({
  video,
  spec,
  letterboxStyle,
  errorFallback,
}) => {
  const segments = spec.segments;

  // The Player instance, held twice on purpose: as state so the subscription
  // effect re-runs when it attaches, and as a ref so the event handlers can
  // stay stable (they must not re-subscribe on every frame).
  const playerRef = React.useRef<PlayerRef | null>(null);
  const [player, setPlayer] = React.useState<PlayerRef | null>(null);
  const attachPlayer = React.useCallback((instance: PlayerRef | null) => {
    playerRef.current = instance;
    setPlayer(instance);
  }, []);

  const [currentSegmentId, setCurrentSegmentId] = React.useState(spec.start);
  const currentRef = React.useRef(spec.start);
  const [path, setPath] = React.useState<Record<string, string>>({});
  const pathRef = React.useRef<Record<string, string>>({});
  const [overlay, setOverlay] = React.useState<Overlay>(null);
  const overlayRef = React.useRef<Overlay>(null);

  const byId = React.useMemo(
    () => new Map(segments.map((segment) => [segment.id, segment])),
    [segments],
  );
  /** "Try a different way" rewinds to the first choice, whichever it is. */
  const rewindTarget = React.useMemo(() => firstChoiceSegment(spec), [spec]);

  // Ref writes are the load-bearing ones: the frame handler reads them
  // synchronously, long before React commits the matching state.
  const goToSegment = React.useCallback((id: string) => {
    currentRef.current = id;
    setCurrentSegmentId(id);
  }, []);
  const applyPath = React.useCallback((next: Record<string, string>) => {
    pathRef.current = next;
    setPath(next);
  }, []);
  const showOverlay = React.useCallback((next: Overlay) => {
    overlayRef.current = next;
    setOverlay(next);
  }, []);

  const finish = React.useCallback(() => {
    playerRef.current?.pause();
    showOverlay({ kind: "end" });
    writeRun(video.id, pathRef.current);
  }, [showOverlay, video.id]);

  // --- The engine ---------------------------------------------------------
  //
  // One rule: when playback reaches the current segment's last frame, do what
  // that segment's `next` says. Everything else (choices, replays, manual
  // scrubbing) funnels back into "which segment are we in".
  const handleFrame = React.useCallback(
    (frame: number) => {
      if (overlayRef.current) return; // paused behind a card
      const action = seamAction(segments, currentRef.current, frame);
      const instance = playerRef.current;
      if (action.kind === "wait") return;
      if (action.kind === "choice") {
        instance?.pause();
        showOverlay({ kind: "choice", segmentId: action.segmentId });
        return;
      }
      if (action.kind === "seek") {
        // Order matters: claim the target segment before the seek, so the
        // `seeked` event this causes finds the state already consistent.
        goToSegment(action.segmentId);
        instance?.seekTo(action.frame);
        return;
      }
      if (action.kind === "advance") {
        goToSegment(action.segmentId);
        return;
      }
      finish();
    },
    [finish, goToSegment, segments, showOverlay],
  );

  // The Player keeps its own controls, so the viewer can scrub anywhere. Snap
  // the current segment to wherever they landed — including into a branch that
  // is not on their path. Keeping the ledger honest is the composition's job,
  // not the player's (prototype: see docs/CYOA.md).
  const handleSeeked = React.useCallback(
    (frame: number) => {
      const segment = segmentAtFrame(segments, frame);
      if (!segment) return;
      if (segment.id !== currentRef.current) goToSegment(segment.id);
      const open = overlayRef.current;
      if (open?.kind === "choice" && open.segmentId !== segment.id) {
        showOverlay(null);
      } else if (open?.kind === "end") {
        showOverlay(null);
      }
    },
    [goToSegment, segments, showOverlay],
  );

  React.useEffect(() => {
    if (!player) return;
    const onFrame: CallbackListener<"frameupdate"> = (event) =>
      handleFrame(event.detail.frame);
    const onSeeked: CallbackListener<"seeked"> = (event) =>
      handleSeeked(event.detail.frame);
    player.addEventListener("frameupdate", onFrame);
    player.addEventListener("seeked", onSeeked);
    return () => {
      player.removeEventListener("frameupdate", onFrame);
      player.removeEventListener("seeked", onSeeked);
    };
  }, [player, handleFrame, handleSeeked]);

  // Park on the start segment. Usually frame 0, but the spec is free to lay
  // the segments out in any order, and `initialFrame` alone is not enough —
  // it only applies to the very first mount.
  const startFrame = byId.get(spec.start)?.from ?? 0;
  React.useEffect(() => {
    if (!player) return;
    if (startFrame !== 0) player.seekTo(startFrame);
  }, [player, startFrame]);

  // Prefetch every segment's assets plus the choice-card narration up front.
  // The whole demo is a couple of MB of mp3 and the alternative is a seam that
  // lands on an empty audio element — fire and forget, failures are non-fatal.
  React.useEffect(() => {
    const urls = new Set<string>();
    for (const segment of segments) {
      for (const asset of segment.preload ?? []) urls.add(asset);
      if (segment.next.kind === "choice") {
        if (segment.next.promptNarrationFile) {
          urls.add(segment.next.promptNarrationFile);
        }
        for (const option of segment.next.options) {
          if (option.narrationFile) urls.add(option.narrationFile);
        }
      }
    }
    const handles = Array.from(urls).map((url) => {
      try {
        const handle = prefetch(assetUrl(url));
        handle.waitUntilDone().catch(() => undefined);
        return handle;
      } catch {
        return null;
      }
    });
    return () => {
      for (const handle of handles) {
        try {
          handle?.free();
        } catch {
          // Nothing to do — the page is going away anyway.
        }
      }
    };
  }, [segments]);

  // --- Viewer actions -----------------------------------------------------

  const openChoice = React.useMemo(() => {
    if (overlay?.kind !== "choice") return null;
    const segment = byId.get(overlay.segmentId);
    if (!segment || segment.next.kind !== "choice") return null;
    return segment.next;
  }, [overlay, byId]);

  const pick = React.useCallback(
    (option: BranchChoiceOption) => {
      const choice = openChoice;
      if (!choice) return;
      applyPath({ ...pathRef.current, [choice.id]: option.id });
      showOverlay(null); // unmounts the card, which stops its read-aloud
      const instance = playerRef.current;
      const target = byId.get(option.to);
      if (target) {
        goToSegment(target.id);
        instance?.seekTo(target.from);
      }
      instance?.play();
    },
    [applyPath, byId, goToSegment, openChoice, showOverlay],
  );

  const watchAgain = React.useCallback(() => {
    applyPath({});
    showOverlay(null);
    const start = byId.get(spec.start);
    goToSegment(spec.start);
    const instance = playerRef.current;
    instance?.seekTo(start?.from ?? 0);
    instance?.play();
  }, [applyPath, byId, goToSegment, showOverlay, spec.start]);

  // Back to the choice itself rather than to the top: the held frames at the
  // end of the choice segment are the moment the question was asked, so the
  // card comes back over exactly the picture it came up on the first time.
  const tryDifferent = React.useCallback(() => {
    const segment = rewindTarget;
    if (!segment) return;
    applyPath({});
    goToSegment(segment.id);
    // The card goes up first so the `seeked` this triggers sees an overlay
    // that matches the segment it lands in, and leaves it alone.
    showOverlay({ kind: "choice", segmentId: segment.id });
    const instance = playerRef.current;
    instance?.pause();
    instance?.seekTo(choiceHoldFrame(segment));
  }, [applyPath, goToSegment, rewindTarget, showOverlay]);

  // What the end card reads back: every choice they made, in story order.
  const picks = React.useMemo(() => {
    const made: { emoji: string; label: string }[] = [];
    for (const segment of segments) {
      if (segment.next.kind !== "choice") continue;
      const chosen = path[segment.next.id];
      if (!chosen) continue;
      const option = segment.next.options.find((o) => o.id === chosen);
      if (option) made.push({ emoji: option.emoji, label: option.label });
    }
    return made;
  }, [segments, path]);

  // --- Fullscreen ---------------------------------------------------------
  //
  // The Player fullscreens its own container, which would leave an overlay
  // rendered next to it invisible — and landscape fullscreen is exactly how a
  // phone watches this. So while fullscreen is active the overlay is portalled
  // *into* that container, where it is still a sibling of the composition (it
  // never becomes an ancestor of the Player, so no typography can cascade in).
  const [fullscreenElement, setFullscreenElement] =
    React.useState<Element | null>(null);
  React.useEffect(() => {
    const onChange = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element };
      setFullscreenElement(
        document.fullscreenElement ?? doc.webkitFullscreenElement ?? null,
      );
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const inputProps = React.useMemo(() => ({ path }), [path]);

  const overlayNode = openChoice ? (
    <ChoiceCard
      key={`${currentSegmentId}:${openChoice.id}`}
      choice={openChoice}
      autoSeconds={AUTO_CHOICE_SECONDS}
      onPick={pick}
      resolveAsset={assetUrl}
    />
  ) : overlay?.kind === "end" ? (
    <EndCard
      picks={picks}
      onAgain={watchAgain}
      onDifferent={tryDifferent}
      canTryDifferent={rewindTarget !== null}
    />
  ) : null;

  return (
    <div style={{ ...letterboxStyle, position: "relative" }}>
      <Player
        ref={attachPlayer}
        component={video.component}
        inputProps={inputProps}
        durationInFrames={video.durationInFrames}
        compositionWidth={video.width}
        compositionHeight={video.height}
        fps={video.fps}
        initialFrame={startFrame}
        controls
        clickToPlay
        doubleClickToFullscreen
        allowFullscreen
        acknowledgeRemotionLicense
        errorFallback={errorFallback}
        style={{ width: "100%" }}
      />
      {overlayNode && fullscreenElement
        ? createPortal(overlayNode, fullscreenElement)
        : overlayNode}
    </div>
  );
};
