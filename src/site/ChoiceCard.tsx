// The kid-facing half of the branching player: the choice card and the end
// card, plus the scrim they sit on.
//
// These are *site* UI, not compositions — plain DOM with CSS transitions — but
// they belong to the kids' show, so every colour, radius and type size comes
// from src/lib/kid/theme.ts rather than the slate site chrome. A six-year-old
// meets this overlay in the middle of an episode; it has to look like the
// episode, not like a settings dialog.
//
// Layout notes:
//   - Everything scales off the container width (`useCardScale`) because the
//     overlay lives inside the letterbox, which is ~360px wide on a phone in
//     portrait and full-screen wide in landscape. Fixed px would be either
//     enormous or unreadable depending on which one you looked at.
//   - The two option cards wrap (flex-wrap + a min basis) instead of using a
//     media query — inline styles have no @media, and the wrap point falls
//     naturally on narrow/portrait screens.
//   - No hover-only affordances: everything reads the same on a touch screen,
//     and tap targets stay far above 64px.

import React from "react";
import {
  kidTheme,
  kidRadius,
  kidShadow,
  mixHex,
} from "../lib/kid/theme";
import type { BranchChoiceOption } from "./registry";

/** The scrim's ink, matched to the kids' outline colour rather than black. */
const SCRIM = "rgba(36, 52, 71, 0.35)";

/** Above the Player's own controls (they top out at z-index 9999). */
const OVERLAY_Z = 10000;

/** Card accents, cycled per option. Bright, and distinct at a glance. */
const OPTION_COLORS = [
  kidTheme.water,
  kidTheme.sun,
  kidTheme.pink,
  kidTheme.mint,
] as const;

/**
 * Container-relative sizing. 900px of overlay width is "design size"; below
 * that everything shrinks, but never past 0.85 — the label has to stay
 * readable for a new reader even on a phone held in portrait, and the overlay
 * scrolls rather than clipping if the maths runs out of room.
 */
function useCardScale(): [React.RefObject<HTMLDivElement>, number] {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const width = el.clientWidth || 900;
      setScale(Math.max(0.85, Math.min(1.3, width / 900)));
    };
    update();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, scale];
}

/** Flips to true one frame after mount, so a CSS transition can play in. */
function useEntrance(): boolean {
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => {
    const handle = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(handle);
  }, []);
  return entered;
}

/**
 * Reads a list of already-resolved audio URLs aloud, one after the next.
 *
 * Every failure mode is a no-op: a blocked autoplay promise, a 404, a missing
 * file. Choosing must never depend on the voice working, so nothing here is
 * awaited by the caller and nothing throws.
 */
function useReadAloud(files: string[]): void {
  React.useEffect(() => {
    if (files.length === 0) return;
    let cancelled = false;
    let audio: HTMLAudioElement | null = null;

    const playAt = (index: number) => {
      if (cancelled || index >= files.length) return;
      const element = new Audio(files[index]);
      audio = element;
      const next = () => playAt(index + 1);
      element.addEventListener("ended", next);
      element.addEventListener("error", next);
      try {
        const promise = element.play() as Promise<void> | undefined;
        if (promise && typeof promise.catch === "function") {
          promise.catch(() => {
            // Autoplay policy, most likely. The card stays usable.
          });
        }
      } catch {
        // Same.
      }
    };

    playAt(0);
    return () => {
      cancelled = true;
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [files]);
}

// --- Shell -----------------------------------------------------------------

const overlayBase: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: OVERLAY_Z,
  background: SCRIM,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflowY: "auto",
  // Self-contained typography: this div is a SIBLING of the Player, never an
  // ancestor, so setting a font here cannot cascade into the composition.
  fontFamily: kidTheme.fontFamily,
  boxSizing: "border-box",
  WebkitTapHighlightColor: "transparent",
};

// --- Choice card -----------------------------------------------------------

type Choice = {
  id: string;
  prompt: string;
  promptNarrationFile?: string;
  options: BranchChoiceOption[];
};

export const ChoiceCard: React.FC<{
  choice: Choice;
  /** Seconds until the first option is picked for the viewer; null = wait. */
  autoSeconds: number | null;
  onPick: (option: BranchChoiceOption) => void;
  /** Site-relative asset path -> URL the browser can fetch. */
  resolveAsset: (path: string) => string;
}> = ({ choice, autoSeconds, onPick, resolveAsset }) => {
  const [ref, scale] = useCardScale();
  const entered = useEntrance();
  const [pressed, setPressed] = React.useState<string | null>(null);

  // The prompt first, then each option in order — the whole card, read out for
  // a viewer who cannot read it.
  const narration = React.useMemo(() => {
    const files: string[] = [];
    if (choice.promptNarrationFile) files.push(choice.promptNarrationFile);
    for (const option of choice.options) {
      if (option.narrationFile) files.push(option.narrationFile);
    }
    return files.map(resolveAsset);
  }, [choice, resolveAsset]);
  useReadAloud(narration);

  // Auto-default. The countdown is armed on mount and disarmed by unmount,
  // which is what happens the instant an option is picked.
  const first = choice.options[0];
  React.useEffect(() => {
    if (autoSeconds === null || !first) return;
    const timer = window.setTimeout(() => onPick(first), autoSeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [autoSeconds, first, onPick]);

  const pad = Math.round(16 * scale);

  return (
    <div ref={ref} style={{ ...overlayBase, padding: pad }}>
      <div
        style={{
          width: "100%",
          maxWidth: Math.round(880 * scale),
          margin: "auto",
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1)" : "scale(0.88)",
          // Overshooting curve: the card lands like a stamp, not a fade.
          transition:
            "opacity 220ms ease-out, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <p
          style={{
            margin: `0 0 ${Math.round(14 * scale)}px`,
            textAlign: "center",
            color: kidTheme.paper,
            fontSize: Math.round(34 * scale),
            fontWeight: 800,
            lineHeight: 1.2,
            textShadow: "0 3px 12px rgba(20, 30, 45, 0.75)",
          }}
        >
          {choice.prompt}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: Math.round(16 * scale),
            justifyContent: "center",
          }}
        >
          {choice.options.map((option, index) => {
            const accent = OPTION_COLORS[index % OPTION_COLORS.length];
            const counting = autoSeconds !== null && index === 0;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onPick(option)}
                onPointerDown={() => setPressed(option.id)}
                onPointerUp={() => setPressed(null)}
                onPointerCancel={() => setPressed(null)}
                onPointerLeave={() => setPressed(null)}
                style={{
                  flex: "1 1 240px",
                  minWidth: 0,
                  minHeight: Math.max(96, Math.round(150 * scale)),
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: Math.round(6 * scale),
                  padding: `${Math.round(18 * scale)}px ${Math.round(14 * scale)}px`,
                  background: mixHex(accent, kidTheme.paper, 0.72),
                  border: `${Math.max(3, Math.round(5 * scale))}px solid ${accent}`,
                  borderRadius: kidRadius.chip + 2,
                  boxShadow: kidShadow(1),
                  color: kidTheme.ink,
                  fontFamily: kidTheme.fontFamily,
                  cursor: "pointer",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  transform:
                    pressed === option.id ? "scale(0.965)" : "scale(1)",
                  transition: "transform 120ms ease-out",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    fontSize: Math.round(72 * scale),
                    lineHeight: 1,
                  }}
                  aria-hidden
                >
                  {option.emoji}
                </span>
                <span
                  style={{
                    fontSize: Math.round(26 * scale),
                    fontWeight: 800,
                    lineHeight: 1.15,
                    textAlign: "center",
                  }}
                >
                  {option.label}
                </span>
                {counting ? (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: Math.max(6, Math.round(9 * scale)),
                      background: "rgba(36, 52, 71, 0.14)",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "100%",
                        background: accent,
                        transformOrigin: "left center",
                        transform: entered ? "scaleX(0)" : "scaleX(1)",
                        transition: `transform ${autoSeconds}s linear`,
                      }}
                    />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- End card --------------------------------------------------------------

export const EndCard: React.FC<{
  picks: { emoji: string; label: string }[];
  onAgain: () => void;
  onDifferent: () => void;
  /** False when the spec has no choice point to rewind to. */
  canTryDifferent: boolean;
}> = ({ picks, onAgain, onDifferent, canTryDifferent }) => {
  const [ref, scale] = useCardScale();
  const entered = useEntrance();

  const button = (
    label: string,
    accent: string,
    onClick: () => void,
  ): React.ReactElement => (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: "1 1 220px",
        minHeight: Math.max(64, Math.round(74 * scale)),
        boxSizing: "border-box",
        padding: `${Math.round(14 * scale)}px ${Math.round(20 * scale)}px`,
        background: accent,
        border: "none",
        borderRadius: kidRadius.pill,
        boxShadow: kidShadow(0.8),
        color: kidTheme.ink,
        fontFamily: kidTheme.fontFamily,
        fontSize: Math.round(24 * scale),
        fontWeight: 800,
        cursor: "pointer",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {label}
    </button>
  );

  return (
    <div ref={ref} style={{ ...overlayBase, padding: Math.round(16 * scale) }}>
      <div
        style={{
          width: "100%",
          maxWidth: Math.round(760 * scale),
          margin: "auto",
          boxSizing: "border-box",
          padding: `${Math.round(24 * scale)}px ${Math.round(22 * scale)}px`,
          background: kidTheme.paper,
          borderRadius: kidRadius.card,
          boxShadow: kidShadow(1.1),
          textAlign: "center",
          color: kidTheme.ink,
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1)" : "scale(0.9)",
          transition:
            "opacity 220ms ease-out, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: Math.round(42 * scale),
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          The End!
        </p>
        {picks.length > 0 ? (
          <p
            style={{
              margin: `${Math.round(10 * scale)}px 0 0`,
              fontSize: Math.round(24 * scale),
              fontWeight: 700,
              lineHeight: 1.3,
              color: kidTheme.inkSoft,
            }}
          >
            You chose{" "}
            {picks.map((pick, index) => (
              <span key={`${pick.label}-${index}`}>
                {index > 0 ? ", then " : null}
                <span aria-hidden>{pick.emoji}</span> {pick.label}
              </span>
            ))}
          </p>
        ) : null}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: Math.round(12 * scale),
            justifyContent: "center",
            marginTop: Math.round(20 * scale),
          }}
        >
          {button("Watch it again", kidTheme.water, onAgain)}
          {canTryDifferent
            ? button("Try a different way", kidTheme.sun, onDifferent)
            : null}
        </div>
      </div>
    </div>
  );
};
