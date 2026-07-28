// The fullscreen stage: one wrapper, used by both player screens, that owns
// "make this fill the phone, in landscape, with the overlays along for the
// ride".
//
// Why this exists rather than the Player's own fullscreen button:
//
//   1. `@remotion/player` fullscreens *its own* element. Anything rendered
//      beside it — the branching player's choice card and end card — is left
//      behind in the page, invisible. (The old branching player worked around
//      that by portalling the card into the fullscreen element; this component
//      replaces that trick, because the card is now inside the element that
//      goes fullscreen in the first place.)
//   2. iPhone Safari has no Element.requestFullscreen at all, and it refuses
//      `screen.orientation.lock` everywhere. A phone on rotation lock can
//      therefore never be talked into a landscape video by the standard APIs.
//
// So the stage has two escalating strategies, and one rotation:
//
//   native  requestFullscreen() on the WRAPPER (desktop, Android). The
//           overlays are inside it, so they come too.
//   fake    position: fixed, inset 0, black, body scroll locked. What iPhone
//           Safari and an iOS standalone PWA actually get.
//   rotated Either of the above, when the viewport is portrait: the content is
//           turned 90° (see stageGeometry.ts) so a 16:9 picture fills the long
//           axis of the phone. Physically turning the phone (if rotation lock
//           is off) makes the viewport landscape, and the rotation drops away.
//
// DOM shape is CONSTANT across all of those — wrapper > box > safe > children —
// and only the styles change. That is load-bearing: the branching player seeks
// inside one mounted Player for the whole session, and an extra or missing
// wrapper div would remount it, reload the composition and drop the audio.
//
// Typography: nothing here sets a font, size or line-height. The Player does
// not reset inherited CSS, so every ancestor of it is a way to leak type
// metrics into the composition (docs/STYLE.md).

import React from "react";
import { stageBox, type StageBox } from "./stageGeometry";

type Mode = "windowed" | "native" | "fake";

export type StageState = {
  /** True in either fullscreen strategy. */
  fullscreen: boolean;
  /** True when the content is turned 90° for a portrait viewport. */
  rotated: boolean;
  /** Style for the Player: fills the stage in fullscreen, width-only outside. */
  playerStyle: React.CSSProperties;
  /**
   * Whether the Player should keep its own fullscreen affordances. False on
   * touch devices, where two competing fullscreen paths (ours, which brings
   * the overlays, and Remotion's, which does not) is a bug waiting to happen.
   */
  allowPlayerFullscreen: boolean;
};

type WebkitElement = HTMLDivElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type WebkitDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

/** Orientation lock is not in every lib.dom, and is a no-op on iOS. */
type LockableOrientation = {
  lock?: (orientation: string) => Promise<unknown>;
  unlock?: () => void;
};

function currentFullscreenElement(): Element | null {
  if (typeof document === "undefined") return null;
  const doc = document as WebkitDocument;
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

function readViewport(): { width: number; height: number } {
  // visualViewport, not innerWidth/innerHeight: on iOS the layout viewport
  // lies about its height while the URL bar is collapsing, and a stage sized
  // from it ends up a bar-height too tall.
  const visual = typeof window === "undefined" ? null : window.visualViewport;
  if (visual) return { width: visual.width, height: visual.height };
  if (typeof window === "undefined") return { width: 1280, height: 720 };
  return { width: window.innerWidth, height: window.innerHeight };
}

function orientation(): LockableOrientation | null {
  if (typeof window === "undefined") return null;
  const screenOrientation = window.screen?.orientation;
  if (!screenOrientation) return null;
  return screenOrientation as unknown as LockableOrientation;
}

/** Best-effort landscape lock. Android honours it; iOS never does. */
function lockLandscape(): void {
  try {
    const promise = orientation()?.lock?.("landscape");
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => undefined);
    }
  } catch {
    // Safari throws synchronously rather than rejecting. Same outcome.
  }
}

function unlockOrientation(): void {
  try {
    orientation()?.unlock?.();
  } catch {
    // Nothing to undo.
  }
}

/**
 * True on touch devices. Read once after mount (never during render) so the
 * first paint is identical on the server-rendered and hydrated trees.
 */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(query.matches);
    update();
    // Safari < 14 has no addEventListener on MediaQueryList.
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }
    return undefined;
  }, []);
  return coarse;
}

const BUTTON_SIZE = 52;
/** Above the choice/end cards (10000), so fullscreen is never a one-way trip. */
const BUTTON_Z = 10001;
/** Clears Remotion's control bar, which sits at the bottom of the picture. */
const BUTTON_BOTTOM = 58;

const ExpandIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden focusable="false">
    <path
      d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CollapseIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden focusable="false">
    <path
      d="M3 9h6V3M21 9h-6V3M3 15h6v6M21 15h-6v6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type FullscreenStageProps = {
  /** The site's letterbox style, worn by the wrapper while windowed. */
  letterboxStyle: React.CSSProperties;
  /** Named in the button's accessible label. */
  label?: string;
  children: (stage: StageState) => React.ReactNode;
};

export const FullscreenStage: React.FC<FullscreenStageProps> = ({
  letterboxStyle,
  label,
  children,
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [mode, setMode] = React.useState<Mode>("windowed");
  const [box, setBox] = React.useState<StageBox | null>(null);
  const coarse = useCoarsePointer();

  // --- Measurement --------------------------------------------------------
  //
  // Only while fullscreen: windowed layout is the browser's job. Every source
  // of a size change on iOS is listened to, because they do not all fire —
  // `orientationchange` without `resize` on older iOS, visualViewport-only
  // changes when the keyboard or the URL bar moves.
  React.useEffect(() => {
    if (mode === "windowed") {
      setBox(null);
      return undefined;
    }
    const measure = () => setBox(stageBox(readViewport()));
    measure();
    // A rotation can settle a frame or two after the event fires.
    const settle = window.setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    const visual = window.visualViewport;
    visual?.addEventListener("resize", measure);
    visual?.addEventListener("scroll", measure);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      visual?.removeEventListener("resize", measure);
      visual?.removeEventListener("scroll", measure);
    };
  }, [mode]);

  // --- Fake fullscreen: hold the page still -------------------------------
  //
  // `position: fixed` on the body rather than `overflow: hidden`, which iOS
  // Safari ignores for rubber-band scrolling. The scroll offset is saved and
  // put back, because pinning the body loses it.
  React.useEffect(() => {
    if (mode !== "fake") return undefined;
    const body = document.body;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `${-scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      Object.assign(body.style, previous);
      window.scrollTo(0, scrollY);
    };
  }, [mode]);

  // Native fullscreen can end without us: Esc, the browser's own control, a
  // navigation. Sync back so the button and the layout agree with reality.
  React.useEffect(() => {
    const onChange = () => {
      if (currentFullscreenElement()) return;
      setMode((current) => (current === "native" ? "windowed" : current));
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // Leaving the screen mid-fullscreen (hash route change, retry remount) must
  // not strand the document in the top layer.
  React.useEffect(() => {
    return () => {
      unlockOrientation();
      if (currentFullscreenElement()) {
        const doc = document as WebkitDocument;
        try {
          if (document.exitFullscreen) void document.exitFullscreen();
          else doc.webkitExitFullscreen?.();
        } catch {
          // Already gone.
        }
      }
    };
  }, []);

  const enter = React.useCallback(async () => {
    const element = wrapperRef.current as WebkitElement | null;
    if (!element) return;
    const request =
      element.requestFullscreen?.bind(element) ??
      element.webkitRequestFullscreen?.bind(element);
    if (request && document.fullscreenEnabled !== false) {
      try {
        await request();
        setMode("native");
        lockLandscape();
        return;
      } catch {
        // Historically flaky on iOS and inside an installed PWA. Fake it.
      }
    }
    setMode("fake");
  }, []);

  const exit = React.useCallback(() => {
    unlockOrientation();
    const doc = document as WebkitDocument;
    try {
      if (currentFullscreenElement()) {
        if (document.exitFullscreen) void document.exitFullscreen();
        else doc.webkitExitFullscreen?.();
      }
    } catch {
      // Fall through: the state below is what the layout reads.
    }
    setMode("windowed");
  }, []);

  const toggle = React.useCallback(() => {
    if (mode === "windowed") void enter();
    else exit();
  }, [mode, enter, exit]);

  const fullscreen = mode !== "windowed";
  const rotated = box?.rotated ?? false;
  const insets = box?.insets;

  // --- Layout -------------------------------------------------------------
  //
  // Three nested divs, always the same three:
  //
  //   wrapper  the letterbox while windowed; the black fullscreen surface
  //            otherwise (and the element handed to requestFullscreen)
  //   stage    the rotated box — landscape dimensions, 90° transform
  //   safe     inset by the safe areas, using top/right/bottom/left rather
  //            than padding so that `position: absolute; inset: 0` children
  //            (the choice card, the end card) land inside the safe area too
  const wrapperStyle: React.CSSProperties = fullscreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: box ? `${box.viewportWidth}px` : "100%",
        height: box ? `${box.viewportHeight}px` : "100%",
        background: "#000",
        overflow: "hidden",
        // Over everything, including the Player's own 9999-ish controls.
        zIndex: 2147483000,
        // No border/radius from the letterbox: this is the whole screen now.
        border: "none",
        borderRadius: 0,
        display: "block",
      }
    : { ...letterboxStyle };

  const stageStyle: React.CSSProperties = fullscreen
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: box ? `${box.width}px` : "100%",
        height: box ? `${box.height}px` : "100%",
        transform: box?.transform ?? "none",
        transformOrigin: box?.transformOrigin ?? "0 0",
        background: "#000",
        overflow: "hidden",
      }
    : { position: "relative", display: "flex", width: "100%", minWidth: 0 };

  const safeStyle: React.CSSProperties = fullscreen
    ? {
        position: "absolute",
        top: insets?.top ?? 0,
        right: insets?.right ?? 0,
        bottom: insets?.bottom ?? 0,
        left: insets?.left ?? 0,
        display: "flex",
      }
    : { position: "relative", display: "flex", width: "100%", minWidth: 0 };

  const stage: StageState = {
    fullscreen,
    rotated,
    playerStyle: fullscreen
      ? { width: "100%", height: "100%" }
      : { width: "100%" },
    allowPlayerFullscreen: !coarse,
  };

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <div style={stageStyle}>
        <div style={safeStyle}>
          {children(stage)}
          <button
            type="button"
            onClick={toggle}
            aria-label={
              fullscreen
                ? "Leave full screen"
                : `Watch ${label ?? "this"} full screen`
            }
            style={{
              position: "absolute",
              right: 12,
              bottom: BUTTON_BOTTOM,
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              color: "#fff",
              background: "rgba(10, 14, 24, 0.55)",
              border: "1px solid rgba(255, 255, 255, 0.28)",
              borderRadius: 14,
              cursor: "pointer",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              zIndex: BUTTON_Z,
            }}
          >
            {fullscreen ? <CollapseIcon /> : <ExpandIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};
