import React from "react";
import { AbsoluteFill, Freeze, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimedScene } from "../narration";
import { turnFor } from "./lines";
import { kidRadius, kidShadow, kidTheme } from "./theme";
import { WordCard } from "./WordCard";

// The show's Big Word beat — the signature that fires three or four times an
// episode and is identical every time, so a six-year-old learns the format and
// knows to shout along. Written twice (episodes one and two) with no difference
// beyond comments before being promoted here.

/**
 * The action behind hard-freezes, the word slams on in capitals, then it splits
 * into syllable blocks that bounce one at a time while a character chants them.
 *
 *   <BigWordBeat
 *     scene={scene}
 *     word="EVAPORATION"
 *     syllables={["Ee", "vap", "oh", "RAY", "shun"]}
 *     chantKey="a1_25_drip"          // the chanting character's line
 *     slamAt={…}                     // when the narrator says the word
 *     color={ACT_COLOR.evaporation}
 *     freeze={<TheActionSoFar />}    // frozen on the slam frame
 *   >
 *     …the live layer: whoever is chanting…
 *   </BigWordBeat>
 *
 * `freeze` is frozen on the slam frame; `children` keep playing, because the
 * character chanting the syllables has to be able to move their mouth. Both
 * draw under the card.
 *
 * Only for a word the episode is actually teaching. A *rule* is not a word: give
 * it a different treatment (episode two stamps its rule), or the signature stops
 * meaning "learn this".
 */
export const BigWordBeat: React.FC<{
  scene: TimedScene;
  word: string;
  syllables: string[];
  chantKey: string;
  /** Frame the freeze + slam happens. Default: 40 frames before the chant. */
  slamAt?: number;
  color?: string;
  sub?: string;
  /** Vertical centre of the banner. Default 300. */
  y?: number;
  freeze?: React.ReactNode;
  children?: React.ReactNode;
}> = ({
  scene,
  word,
  syllables,
  chantKey,
  slamAt,
  color = kidTheme.pink,
  sub,
  y = 300,
  freeze,
  children,
}) => {
  const frame = useCurrentFrame();
  const chant = turnFor(scene, chantKey);
  const chantFrom = chant ? chant.from : scene.durationInFrames;
  const chantLen = chant ? chant.durationInFrames : 45;
  const slam = slamAt ?? Math.max(0, chantFrom - 40);
  // The word holds through the narrator's plain delivery, then breaks apart
  // into the syllable blocks a few frames before the chant starts.
  const split = Math.max(slam + 20, chantFrom - 8);

  return (
    <>
      {freeze ? (
        <Freeze frame={slam} active={frame >= slam}>
          {freeze}
        </Freeze>
      ) : null}
      {children}
      <CutFlash at={slam} />
      <WordCard text={word} from={slam} until={split} y={y} bannerColor={color} sub={sub} />
      <SyllableBlocks
        syllables={syllables}
        from={split}
        chantFrom={chantFrom}
        chantLen={chantLen}
        y={y}
        color={color}
      />
    </>
  );
};

/**
 * The impact flash under a slam, and the cheapest way to sell a hard cut inside
 * a scene (episode one's three identical Mondays).
 */
export const CutFlash: React.FC<{ at: number; strength?: number }> = ({
  at,
  strength = 0.8,
}) => {
  const frame = useCurrentFrame();
  const u = frame - at;
  if (u < 0 || u > 8) return null;
  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        opacity: strength * Math.max(0, 1 - u / 8),
        zIndex: 60,
        pointerEvents: "none",
      }}
    />
  );
};

const SyllableBlocks: React.FC<{
  syllables: string[];
  from: number;
  chantFrom: number;
  chantLen: number;
  y: number;
  color: string;
}> = ({ syllables, from, chantFrom, chantLen, y, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from) return null;
  const per = chantLen / syllables.length;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        transform: "translateY(-50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
        zIndex: 50,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      {syllables.map((s, i) => {
        const land = spring({
          frame: frame - from - i * 3,
          fps,
          config: { damping: 11, mass: 0.6 },
        });
        // Each block hops on its own slice of the chant — the word is being
        // *said* one beat at a time, which is the whole point of the card.
        const u = (frame - (chantFrom + i * per)) / per;
        const hop = u >= 0 && u <= 1 ? Math.sin(u * Math.PI) : 0;
        const hot = hop > 0.15;
        return (
          <div
            key={`${s}-${i}`}
            style={{
              background: hot ? kidTheme.star : color,
              color: hot ? kidTheme.ink : kidTheme.paper,
              border: `9px solid ${kidTheme.ink}`,
              borderRadius: kidRadius.card,
              padding: "14px 34px",
              fontSize: 116,
              fontWeight: 900,
              lineHeight: 1.05,
              boxShadow: kidShadow(1.1),
              transform: `translateY(${-hop * 56 + (1 - land) * -90}px) scale(${(0.4 + 0.6 * land) * (1 + hop * 0.14)}) rotate(${(1 - land) * 12 - 2 + hop * 3}deg)`,
              opacity: Math.min(1, Math.max(0, (frame - from - i * 3) / 3)),
            }}
          >
            {s}
          </div>
        );
      })}
    </div>
  );
};
