import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Drip,
  Cloudia,
  KidBackdrop,
  SpeechBubble,
  EMOTION_EASE,
  Sunny,
  kidOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  lineKeyOf,
  lookAt,
  makeBodyGeometry,
  makeWideLayer,
  mixHex,
  type Cam,
  type Emotion,
  type EmotionInput,
  type KidBackdropProps,
  type LookDirection,
  type Mark as KitMark,
  type SkyVariant,
} from "../../../lib/kid";
import {
  isSpeaking,
  speakerAt,
  useSpeaking,
  type DialogueTurn,
  type TimedScene,
} from "../../../lib/narration";
import { NARRATION } from "../narrationManifest";

// Shared kit for "Drip's Big Adventure".
//
// Since episode two, the *episode-agnostic* half of this file lives in
// `src/lib/kid/` — the line-key lookups (`lines.ts`), the staging arithmetic
// and camera (`staging.tsx`), the Big Word signature (`BigWord.tsx`), the
// thermometer and caption card (`props.tsx`). This file binds that kit to this
// episode's cast and re-exports it, so an act file still gets everything from
// one `./common` import and none of them had to change.
//
// Everything an act file needs that isn't specific to one scene lives here:
// the line-key -> turn plumbing the timeline is built from, the speaker
// staging API (auto-placed bubbles, mouth sync, per-line emotions, reaction
// looks), the Big Word freeze-frame signature that fires four times across the
// episode, the camera, the recurring props, and the placeholder scene that
// keeps an unbuilt act watchable.
//
// Read the four sections marked "API" below before building an act; they are
// the contract between the act files.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Every voice in the show. `narrator` is off-stage: no body, no bubble. */
export type Speaker = "narrator" | "drip" | "sunny" | "cloudia";

/**
 * Per-character cycle offset. Breathing, blinking and mouth timing all key off
 * it, so two characters sharing one bob in lockstep — always pass these.
 */
export const PHASE: Record<Speaker, number> = {
  narrator: 0,
  drip: 0,
  sunny: 3.4,
  cloudia: 1.9,
};

/** Act colours — the Big Word banner and its syllable blocks wear them. */
export const ACT_COLOR = {
  evaporation: kidTheme.sunDark,
  condensation: kidTheme.purple,
  precipitation: kidTheme.waterDark,
  collection: kidTheme.mint,
} as const;

// ---------------------------------------------------------------------------
// API 1 — building a scene's turns from script.md's line keys
// ---------------------------------------------------------------------------

/** `co_02_drip` -> `drip`. The key convention *is* the cast list. */
export function speakerOf(lineKey: string): Speaker {
  const tail = lineKey.split("_").slice(2).join("_");
  if (tail === "drip" || tail === "sunny" || tail === "cloudia") return tail;
  return "narrator";
}

/**
 * Turn list for a scene, straight from script.md's line keys. The speaker is
 * derived from the key, so a scene's cast can never drift from its audio.
 *
 * The last turn gets `gapFrames: 0`: a trailing gap stacks with the scene's
 * tail and leaves a scene sitting silent twice as long as intended.
 */
export function turnsOf(
  keys: string[],
  opts?: { gap?: number; gaps?: Record<string, number> },
): DialogueTurn[] {
  return keys.map((key, i) => {
    const clip = NARRATION[key];
    if (!clip) throw new Error(`[water-cycle] no narration clip for "${key}"`);
    const explicit = opts?.gaps?.[key];
    const gapFrames =
      explicit !== undefined ? explicit : i === keys.length - 1 ? 0 : opts?.gap;
    return { clip, speaker: speakerOf(key), gapFrames };
  });
}

// `lineKeyOf`, `turnFor`, `lineWindow`, `heldBeat` and `lineProgress` are the
// kit's (`src/lib/kid/lines.ts`); they are re-exported at the foot of this file.

// ---------------------------------------------------------------------------
// API 2 — staging: who stands where, who is talking, who looks at whom
// ---------------------------------------------------------------------------

/**
 * Natural SVG box height of each character, from their component files. Needed
 * because `CharacterFrame` scales about the **bottom** of that box: a
 * character's `y` prop plus half this number is a ground line that does not
 * move when you change `scale`. Everything geometric below is derived from
 * that fact — it is the single easiest thing to get wrong when staging.
 */
export const CHAR_BOX = { drip: 380, sunny: 460, cloudia: 380 } as const;
export type Body = keyof typeof CHAR_BOX;

/**
 * Where a character stands. Pass exactly the `x`, `y` and `scale` you gave the
 * character component and the helpers do the rest: bubbles clear the crown,
 * looks aim at the middle.
 */
export type Mark = KitMark<Body>;

/**
 * The staging arithmetic, bound to this episode's cast: `stand`, `hover`,
 * `crownOf`, `midOf`, `bubbleAbove`, `markCentre`, `projectMark`. Drip is the
 * default body for a mark that does not name one, and a bubble sits 175px above
 * the crown (episode two, with a shorter hero, uses 165).
 */
const geometry = makeBodyGeometry({ box: CHAR_BOX, body: "drip", bubbleLift: 175 });
export const { stand, hover, crownOf, midOf, bubbleAbove, markCentre, projectMark } =
  geometry;

export type Cast = Partial<Record<Speaker, Mark>>;

/** Who is mid-line right now, plus a flag per character for `speaking={…}`. */
export function useTalking(scene: TimedScene): Record<Speaker, boolean> & {
  current: Speaker | null;
} {
  const frame = useCurrentFrame();
  const current = speakerAt(scene, frame) as Speaker | null;
  return {
    current,
    narrator: isSpeaking(scene, "narrator", frame),
    drip: isSpeaking(scene, "drip", frame),
    sunny: isSpeaking(scene, "sunny", frame),
    cloudia: isSpeaking(scene, "cloudia", frame),
  };
}

/** The line key playing right now, or null in the gaps between turns. */
export function useLineKey(scene: TimedScene): string | null {
  const frame = useCurrentFrame();
  const turn = (scene.turns ?? []).find(
    (t) => frame >= t.from && frame < t.from + t.durationInFrames,
  );
  return turn ? lineKeyOf(turn) : null;
}

/**
 * Per-line emotion for one character: `{ "a1_21_drip": "amazed" }`.
 *
 * The emotion lands `lead` frames *before* the line starts and holds until the
 * character's next mapped line. That lead is deliberate — the rig's
 * wobble-mouth (`scared`) hard-cuts to the talking mouth on the first frame of
 * a line, so a character has to settle into a face before they open it. For
 * the same reason: never map a line to `scared`. Put `scared` in the gap
 * between two lines instead (see Scene 9).
 *
 * Returns an `EmotionCue`, not a bare name: it knows both the face being left
 * and the frame the change lands on, which is exactly what the rig needs to
 * *morph* between the two instead of cutting (see `resolveEmotion`). Pass the
 * result straight to `emotion={…}`; nothing else changes.
 */
export function useEmotion(
  scene: TimedScene,
  speaker: Speaker,
  byKey: Record<string, Emotion>,
  resting: Emotion = "happy",
  lead = 8,
): EmotionInput {
  const frame = useCurrentFrame();
  let current = resting;
  let previous = resting;
  let at = -1;
  for (const turn of scene.turns ?? []) {
    if (turn.speaker !== speaker) continue;
    const emotion = byKey[lineKeyOf(turn)];
    if (!emotion) continue;
    if (frame < turn.from - lead) continue;
    // Two mapped lines with the same face are not a change: the morph (and the
    // settle it leaves behind) belongs to the frame the face actually moved.
    if (emotion !== current) {
      previous = current;
      at = turn.from - lead;
    }
    current = emotion;
  }
  // The morph fits inside the lead, so the face is settled by the time the
  // line opens the mouth — a scene that asked for a *short* lead (a held beat)
  // still gets a short change rather than one running under its own line.
  const frames = Math.min(EMOTION_EASE, Math.max(4, lead));
  return at < 0 ? current : { emotion: current, from: previous, at, frames };
}

/**
 * A listener's eyes. Whoever is talking gets looked at; nobody talking (or the
 * narrator talking, who has no body) falls back to `fallback`.
 */
export function useLookAtSpeaker(
  scene: TimedScene,
  cast: Cast,
  me: Speaker,
  fallback: LookDirection = "camera",
): LookDirection {
  const { current } = useTalking(scene);
  const from = cast[me];
  const to = current && current !== me ? cast[current] : undefined;
  if (!from || !to) return fallback;
  return lookAt(markCentre(from), markCentre(to));
}

/**
 * Every bubble in a dialogue scene, placed automatically.
 *
 * One entry per line key you want a bubble for — six words maximum, and a
 * *summary* rather than a transcript: the voice carries the line, the bubble
 * is a visual aid. Narrator lines normally get no entry (he has no body, so
 * his bubble would have nothing to point at).
 *
 * Placement: above the speaker's crown, on the side facing frame centre, tail
 * pointing back down at them, up for exactly the length of their turn.
 *
 * `at` overrides one line's bubble — `{x, y}` there is the **bubble's own
 * centre**, not the character's. Needed for a character who fills the top of
 * the frame (Sunny, mostly: there is no "above" left that isn't his rays), or
 * one who moves through their own line.
 *
 * `tailAt` in that override is a composition x for the *tail* — use it whenever
 * `x` moved the bubble away from its speaker, because the default tail sits at
 * a fixed inset from the bubble's corner and will then be pointing at nobody.
 */
export const Bubbles: React.FC<{
  scene: TimedScene;
  cast: Cast;
  text: Record<string, string>;
  at?: Record<
    string,
    {
      x?: number;
      y?: number;
      tail?: "left" | "right" | "none";
      /** Composition x the tail points at; defaults to the bubble's corner. */
      tailAt?: number;
      side?: "left" | "right";
      offset?: number;
    }
  >;
  fontSize?: number;
  maxWidth?: number;
}> = ({ scene, cast, text, at, fontSize, maxWidth }) => (
  <>
    {(scene.turns ?? []).map((turn, i) => {
      const key = lineKeyOf(turn);
      const body = text[key];
      const mark = cast[turn.speaker as Speaker];
      if (!body || !mark) return null;
      const override = at?.[key];
      const side =
        override?.side ?? mark.side ?? (mark.x < WIDTH / 2 ? "right" : ("left" as const));
      const offset = override?.offset ?? mark.offset ?? 330;
      const bx = clamp(
        override?.x ?? mark.x + (side === "right" ? offset : -offset),
        400,
        WIDTH - 400,
      );
      const by = clamp(override?.y ?? bubbleAbove(mark), 170, HEIGHT - 280);
      const tail = override?.tail ?? (side === "right" ? "left" : "right");
      return (
        <SpeechBubble
          key={`${key}-${i}`}
          x={bx}
          y={by}
          text={body}
          tail={tail}
          tailAt={override?.tailAt}
          from={turn.from}
          until={turn.from + turn.durationInFrames}
          fontSize={fontSize}
          maxWidth={maxWidth}
        />
      );
    })}
  </>
);

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// ---------------------------------------------------------------------------
// API 3 — the camera
// ---------------------------------------------------------------------------
//
// `Cam`, `Camera`, `project` and `projectMark` are the kit's
// (`src/lib/kid/staging.tsx`) and are re-exported at the foot of this file.
// Bubbles live *outside* the camera — a zoomed bubble is unreadable — so a
// bubble on a character inside one is placed with `projectMark(cam, mark)`.

// ---------------------------------------------------------------------------
// API 4 — the Big Word signature
// ---------------------------------------------------------------------------
//
// `BigWordBeat` and `CutFlash` are the kit's (`src/lib/kid/BigWord.tsx`): the
// action behind hard-freezes, the word slams on in capitals, then it splits
// into syllable blocks that bounce one at a time while Drip chants them.
// Identical treatment all four times, so a six-year-old learns the format and
// knows to shout along. Dress it from `ACT_COLOR`.

// ---------------------------------------------------------------------------
// Recurring props and scenery
// ---------------------------------------------------------------------------

/**
 * How far past the frame this episode's scenery has to reach — Scene 3's
 * reveal and Scene 11's nine million drops both pull out below 1×, and an
 * `<svg>` clips to its own viewport. Draw in ordinary composition coordinates.
 */
export const WIDE = { x: -1200, y: -500, w: 4400, h: 2200 } as const;

export const WideLayer = makeWideLayer(WIDE);

/**
 * The ocean surface. KidBackdrop's own waves are fixed-colour; this one takes
 * a `warmth` (0..1) so Act One's water can visibly heat up under Sunny.
 *
 * Warmth is a *small* mix towards a warm light plus a gold sheen on the
 * surface — the first pass mixed the blues towards `sunDark` at 0.42 and the
 * sea turned olive, which read as a grass field with a wave in it.
 */
export const WaterBand: React.FC<{
  /** Y of the surface in composition px. */
  top: number;
  warmth?: number;
  /** Extra horizontal drift, for a pan. */
  dx?: number;
  opacity?: number;
}> = ({ top, warmth = 0, dx = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const warm = (c: string) => mixHex(c, "#ffc98a", warmth * 0.2);
  const layers = [
    { dy: 0, amp: 18, wl: 760, speed: 0.5, fill: warm(kidTheme.waterLight), o: 0.9 },
    { dy: 40, amp: 24, wl: 540, speed: -0.75, fill: warm(kidTheme.water), o: 1 },
    { dy: 104, amp: 28, wl: 940, speed: 0.32, fill: warm(kidTheme.waterDark), o: 1 },
    { dy: 210, amp: 30, wl: 1200, speed: -0.24, fill: warm(kidTheme.waterDeep), o: 1 },
  ];
  const span = WIDE.w;
  return (
    <WideLayer opacity={opacity}>
      <g transform={`translate(${dx + WIDE.x} 0)`}>
        {layers.map((l, i) => (
          <path
            key={i}
            d={wavePath(span, WIDE.y + WIDE.h, top + l.dy, l.amp, l.wl, t * l.speed)}
            fill={l.fill}
            opacity={l.o}
          />
        ))}
        {warmth > 0.02 ? (
          // Sun on the surface. Kept faint: at 0.22 the whole sea read as a
          // grass field with a wave in it.
          <path
            d={wavePath(span, top + 130, top, 18, 760, t * 0.5)}
            fill={kidTheme.sunLight}
            opacity={0.1 * warmth}
          />
        ) : null}
        {Array.from({ length: 22 }, (_, i) => {
          const x = (i * 291 + t * 44) % span;
          const y = top + Math.sin((x / 760) * Math.PI * 2 + t * 0.5) * 18 - 8;
          return <ellipse key={i} cx={x} cy={y} rx={30} ry={6} fill="#ffffff" opacity={0.55} />;
        })}
      </g>
    </WideLayer>
  );
};

function wavePath(
  width: number,
  height: number,
  top: number,
  amp: number,
  wavelength: number,
  phase: number,
): string {
  const step = wavelength / 2;
  let d = `M ${-step} ${top + Math.sin(phase) * amp}`;
  for (let x = -step; x < width + step * 2; x += step) {
    const nx = x + step;
    const y0 = top + Math.sin((x / wavelength) * Math.PI * 2 + phase) * amp;
    const y1 = top + Math.sin((nx / wavelength) * Math.PI * 2 + phase) * amp;
    d += ` C ${x + step * 0.4} ${y0} ${x + step * 0.6} ${y1} ${nx} ${y1}`;
  }
  return `${d} L ${width + step * 2} ${height} L ${-step} ${height} Z`;
}

/**
 * Crossfade between two skies — sunrise, nightfall, a cloud going grey. Both
 * layers are real `KidBackdrop`s, so the clouds and waves line up exactly and
 * only the colour changes.
 */
export const SkyBlend: React.FC<
  { from: SkyVariant; to: SkyVariant; u: number } & Omit<KidBackdropProps, "variant">
> = ({ from, to, u, children, ...rest }) => (
  <AbsoluteFill>
    <KidBackdrop variant={from} {...rest} />
    <AbsoluteFill style={{ opacity: Math.max(0, Math.min(1, u)) }}>
      <KidBackdrop variant={to} {...rest} />
    </AbsoluteFill>
    {children}
  </AbsoluteFill>
);

// `Thermometer` is the kit's (src/lib/kid/props.tsx); re-exported below.

/**
 * The name-arrow gag: a chunky arrow that hops in and points at one drop in a
 * crowd of identical drops. `x`/`y` is the *tip*.
 */
export const NameArrow: React.FC<{
  x: number;
  y: number;
  label: string;
  from?: number;
  /** Where the label sits relative to the tip. */
  dir?: "up" | "left" | "right";
  color?: string;
}> = ({ x, y, label, from = 0, dir = "up", color = kidTheme.tomato }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 11, mass: 0.6 } });
  if (s <= 0.001) return null;
  const bob = Math.sin((frame - from) / 6) * 10;
  const dx = dir === "left" ? -300 : dir === "right" ? 300 : 0;
  const dy = dir === "up" ? -280 : -170;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        transform: `scale(${s})`,
        transformOrigin: "0px 0px",
        zIndex: 35,
        fontFamily: kidTheme.fontFamily,
      }}
    >
      <svg width={10} height={10} viewBox="0 0 10 10" overflow="visible">
        <path
          d={`M ${dx * 0.55} ${dy * 0.72} Q ${dx * 0.3} ${dy * 0.34} 0 -18`}
          stroke={color}
          strokeWidth={22}
          strokeLinecap="round"
          fill="none"
        />
        <path d="M -34 -66 L 0 -8 L 34 -66 Z" fill={color} stroke={color} strokeWidth={14} strokeLinejoin="round" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: dx,
          top: dy,
          transform: "translate(-50%, -50%)",
          background: color,
          color: kidTheme.paper,
          border: `8px solid ${kidTheme.ink}`,
          borderRadius: kidRadius.pill,
          padding: "10px 34px",
          fontSize: kidType.label,
          fontWeight: 900,
          letterSpacing: 2,
          whiteSpace: "nowrap",
          boxShadow: kidShadow(1),
        }}
      >
        {label}
      </div>
    </div>
  );
};

// `CaptionCard` is the kit's (src/lib/kid/props.tsx); re-exported below. Its
// `align` matters here: a centred card and a speech bubble both want the top of
// the frame, so put the card on the opposite side from the speaker.

/** Steam wisps rising off warm water. Cheap, curly, and always upward. */
export const SteamWisps: React.FC<{
  x: number;
  y: number;
  count?: number;
  scale?: number;
  phase?: number;
  color?: string;
}> = ({ x, y, count = 3, scale = 1, phase = 0, color = "#ffffff" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {Array.from({ length: count }, (_, i) => {
        const cycle = (t * 0.42 + i * 0.31 + phase) % 1;
        const rise = cycle * 190;
        const sway = Math.sin(cycle * Math.PI * 2 + i) * 26;
        const o = Math.sin(cycle * Math.PI) * 0.65;
        const px = (i - (count - 1) / 2) * 54;
        return (
          <path
            key={i}
            d={`M ${px} 0 q ${26 + sway} -42 ${sway * 0.4} -84 q ${-26 - sway} -42 ${sway * 0.2} -84`}
            transform={`translate(0 ${-rise})`}
            stroke={color}
            strokeWidth={13}
            strokeLinecap="round"
            fill="none"
            opacity={o}
          />
        );
      })}
    </g>
  );
};

/** A soft vignette — used to sell "we are deep underwater / it is night". */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.5 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 74% 74% at 50% 50%, transparent 38%, rgba(16,29,69,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// Placeholder scenes (Acts Two and Three, and the recap, until they are built)
// ---------------------------------------------------------------------------

const PLACEHOLDER_MARKS: Record<Exclude<Speaker, "narrator">, Mark> = {
  drip: { x: 420, y: stand("drip", 900), scale: 1.15, who: "drip" },
  cloudia: { x: 980, y: stand("cloudia", 620), scale: 1, who: "cloudia" },
  sunny: { x: 1520, y: stand("sunny", 880), scale: 0.95, who: "sunny" },
};

/**
 * Stand-in for a scene nobody has staged yet: the real dialogue, in the real
 * voices, with the real timing, and every character on stage mouthing their
 * own lines — just no direction. Drop the finished scene in and the timeline
 * does not move.
 */
export const ScenePlaceholder: React.FC<{ scene: TimedScene; title?: string }> = ({
  scene,
  title,
}) => {
  const cast = Array.from(
    new Set(
      (scene.turns ?? [])
        .map((t) => t.speaker as Speaker)
        .filter((s): s is Exclude<Speaker, "narrator"> => s !== "narrator"),
    ),
  );
  const marks: Cast = Object.fromEntries(cast.map((s) => [s, PLACEHOLDER_MARKS[s]]));
  const lineKey = useLineKey(scene);
  return (
    <KidBackdrop variant="day" clouds={3} ground waves={false}>
      {cast.includes("drip") ? (
        <PlaceholderDrip scene={scene} cast={marks} />
      ) : null}
      {cast.includes("cloudia") ? (
        <PlaceholderCloudia scene={scene} cast={marks} />
      ) : null}
      {cast.includes("sunny") ? (
        <PlaceholderSunny scene={scene} cast={marks} />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 78,
          textAlign: "center",
          fontFamily: kidTheme.fontFamily,
        }}
      >
        <div
          style={{
            fontSize: kidType.label,
            fontWeight: 900,
            letterSpacing: 3,
            color: kidTheme.ink,
            textShadow: kidOutline(4),
          }}
        >
          {title ?? scene.id}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: kidType.min,
            fontWeight: 800,
            letterSpacing: 2,
            color: kidTheme.inkSoft,
            textShadow: kidOutline(3),
          }}
        >
          {lineKey ?? "…"} · staging to come
        </div>
      </div>
    </KidBackdrop>
  );
};

const PlaceholderDrip: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Drip
    x={PLACEHOLDER_MARKS.drip.x}
    y={PLACEHOLDER_MARKS.drip.y}
    scale={1.15}
    phase={PHASE.drip}
    emotion="happy"
    speaking={useSpeaking(scene, "drip")}
    look={useLookAtSpeaker(scene, cast, "drip")}
  />
);

const PlaceholderCloudia: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Cloudia
    x={PLACEHOLDER_MARKS.cloudia.x}
    y={PLACEHOLDER_MARKS.cloudia.y}
    scale={1}
    phase={PHASE.cloudia}
    emotion="happy"
    clipboard
    speaking={useSpeaking(scene, "cloudia")}
    look={useLookAtSpeaker(scene, cast, "cloudia")}
  />
);

const PlaceholderSunny: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <Sunny
    x={PLACEHOLDER_MARKS.sunny.x}
    y={PLACEHOLDER_MARKS.sunny.y}
    scale={0.95}
    phase={PHASE.sunny}
    emotion="proud"
    speaking={useSpeaking(scene, "sunny")}
    look={useLookAtSpeaker(scene, cast, "sunny")}
  />
);

// Re-exported so an act file needs one import for the whole kit — including
// everything promoted to `src/lib/kid/`, which is why no scene file's imports
// changed when it moved.
export { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill };
export {
  BigWordBeat,
  CaptionCard,
  CloudiaHat,
  CutFlash,
  Camera,
  Thermometer,
  emotionAt,
  heldBeat,
  lineKeyOf,
  lineProgress,
  lineWindow,
  project,
  turnFor,
} from "../../../lib/kid";
export type { Cam };
export type { TimedScene };
