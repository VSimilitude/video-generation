import React from "react";
import {
  AbsoluteFill,
  Freeze,
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
  Sunny,
  WordCard,
  kidOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  lookAt,
  mixHex,
  type Emotion,
  type KidBackdropProps,
  type LookDirection,
  type SkyVariant,
} from "../../../lib/kid";
import {
  isSpeaking,
  speakerAt,
  useSpeaking,
  type DialogueTurn,
  type TimedScene,
  type TimedTurn,
} from "../../../lib/narration";
import { NARRATION } from "../narrationManifest";

// Shared kit for "Drip's Big Adventure".
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

/** The line key a turn plays, recovered from its clip path. */
export function lineKeyOf(turn: { clip: { file: string } }): string {
  const base = turn.clip.file.split("/").pop() ?? "";
  return base.replace(/\.mp3$/, "");
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

/** The timed turn that plays `lineKey`, for beats keyed to one line. */
export function turnFor(scene: TimedScene, lineKey: string): TimedTurn | null {
  return (scene.turns ?? []).find((t) => lineKeyOf(t) === lineKey) ?? null;
}

/** `[start, end)` of a line inside its scene; `[0, 0]` if the line isn't here. */
export function lineWindow(scene: TimedScene, lineKey: string): [number, number] {
  const turn = turnFor(scene, lineKey);
  return turn ? [turn.from, turn.from + turn.durationInFrames] : [0, 0];
}

/** 0..1 progress through a line — the honest way to key a beat to a clause. */
export function lineProgress(
  scene: TimedScene,
  lineKey: string,
  frame: number,
): number {
  const [a, b] = lineWindow(scene, lineKey);
  if (b <= a) return 0;
  return Math.max(0, Math.min(1, (frame - a) / (b - a)));
}

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

/** `y` prop for a character whose feet should land on `groundY`. */
export function stand(who: Body, groundY: number): number {
  return groundY - CHAR_BOX[who] / 2;
}

/** Screen y of the top of a character's head — what a bubble has to clear. */
export function crownOf(who: Body, y: number, scale = 1): number {
  const h = CHAR_BOX[who];
  return y + h / 2 - h * scale;
}

/** Screen y of a character's visual middle — what another character looks at. */
export function midOf(who: Body, y: number, scale = 1): number {
  const h = CHAR_BOX[who];
  return y + h / 2 - (h * scale) / 2;
}

/**
 * Where a character stands. Pass exactly the `x`, `y` and `scale` you gave the
 * character component and the helpers do the rest: bubbles clear the crown,
 * looks aim at the middle.
 */
export type Mark = {
  x: number;
  y: number;
  /** The character's own `scale` prop. */
  scale?: number;
  /** Which body's geometry to use. Default `drip`. */
  who?: Body;
  /** Override: bubble centre this far above `y` instead of above the crown. */
  lift?: number;
  /** Horizontal gap from the character to the bubble. Default 330. */
  offset?: number;
  /** Which side of the character the bubble sits on; default = towards centre. */
  side?: "left" | "right";
};

/** Bubble centre for a mark: clear of the crown, with room for the tail. */
export function bubbleAbove(m: Mark): number {
  if (m.lift !== undefined) return m.y - m.lift;
  return crownOf(m.who ?? "drip", m.y, m.scale ?? 1) - 175;
}

/** The point another character should look at. */
export function markCentre(m: Mark): { x: number; y: number } {
  return { x: m.x, y: midOf(m.who ?? "drip", m.y, m.scale ?? 1) };
}

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
 */
export function useEmotion(
  scene: TimedScene,
  speaker: Speaker,
  byKey: Record<string, Emotion>,
  resting: Emotion = "happy",
  lead = 8,
): Emotion {
  const frame = useCurrentFrame();
  let current = resting;
  for (const turn of scene.turns ?? []) {
    if (turn.speaker !== speaker) continue;
    const emotion = byKey[lineKeyOf(turn)];
    if (!emotion) continue;
    if (frame >= turn.from - lead) current = emotion;
  }
  return current;
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
 */
export const Bubbles: React.FC<{
  scene: TimedScene;
  cast: Cast;
  text: Record<string, string>;
  at?: Record<
    string,
    { x?: number; y?: number; tail?: "left" | "right" | "none"; side?: "left" | "right"; offset?: number }
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

/**
 * A camera move, as a transform on whatever is inside it. `x`/`y` is the point
 * that stays put (the thing you are pushing in on).
 *
 * Zooming *out* below 1 shows past the edge of the frame, so keep the sky
 * outside the camera in a pull-out shot and only put the world inside it.
 */
export type Cam = {
  x: number;
  y: number;
  zoom?: number;
  /** Vertical zoom, when it differs — a stretch (Drip's liftoff thwip). */
  zoomY?: number;
  dx?: number;
  dy?: number;
  rotate?: number;
};

export const Camera: React.FC<{ cam: Cam; children: React.ReactNode }> = ({
  cam,
  children,
}) => (
  <AbsoluteFill
    style={{
      transformOrigin: `${cam.x}px ${cam.y}px`,
      transform: [
        `translate(${cam.dx ?? 0}px, ${cam.dy ?? 0}px)`,
        `rotate(${cam.rotate ?? 0}deg)`,
        `scale(${cam.zoom ?? 1}, ${cam.zoomY ?? cam.zoom ?? 1})`,
      ].join(" "),
    }}
  >
    {children}
  </AbsoluteFill>
);

/**
 * World point -> screen point under a camera. Bubbles live *outside* the
 * camera (a zoomed bubble is unreadable), so a bubble on a character inside
 * one is placed with `project(cam, mark)`. Ignores `rotate`.
 */
export function project(cam: Cam, p: { x: number; y: number }): { x: number; y: number } {
  const z = cam.zoom ?? 1;
  const zy = cam.zoomY ?? z;
  return {
    x: cam.x + (p.x - cam.x) * z + (cam.dx ?? 0),
    y: cam.y + (p.y - cam.y) * zy + (cam.dy ?? 0),
  };
}

/**
 * A mark as it appears on screen under a camera move — bubbles live outside
 * the camera, so a bubble on a character inside one is placed with this.
 * (The character's ground line projects like any point; the scale multiplies.)
 */
export function projectMark(cam: Cam, m: Mark): Mark {
  const h = CHAR_BOX[m.who ?? "drip"];
  const ground = project(cam, { x: m.x, y: m.y + h / 2 });
  return {
    ...m,
    x: ground.x,
    y: ground.y - h / 2,
    scale: (m.scale ?? 1) * (cam.zoomY ?? cam.zoom ?? 1),
  };
}

// ---------------------------------------------------------------------------
// API 4 — the Big Word signature
// ---------------------------------------------------------------------------

/**
 * The show's Big Word beat, and the only way one should ever be built: the
 * action behind hard-freezes, the word slams on in capitals, then it splits
 * into syllable blocks that bounce one at a time while Drip chants them.
 * Identical treatment all four times, so a six-year-old learns the format and
 * knows to shout along.
 *
 *   <BigWordBeat
 *     scene={scene}
 *     word="EVAPORATION"
 *     syllables={["Ee", "vap", "oh", "RAY", "shun"]}
 *     chantKey="a1_25_drip"          // Drip's syllable line
 *     slamAt={…}                     // when the narrator says the word
 *     color={ACT_COLOR.evaporation}
 *     freeze={<TheActionSoFar />}    // frozen on the slam frame
 *   >
 *     …the live layer: whoever is chanting…
 *   </BigWordBeat>
 *
 * `freeze` is frozen; `children` keep playing (the chanting character has to
 * be able to move their mouth). Both draw under the card.
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
  // into the syllable blocks a few frames before Drip starts saying them.
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
      <WordCard
        text={word}
        from={slam}
        until={split}
        y={y}
        bannerColor={color}
        sub={sub}
      />
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
 * The impact flash under a slam, and the cheapest way to sell a hard cut
 * inside a scene (Scene 4's three identical Mondays).
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

// ---------------------------------------------------------------------------
// Recurring props and scenery
// ---------------------------------------------------------------------------

/**
 * A scenery layer that extends far past the frame on every side. An `<svg>`
 * clips to its own viewport, so a plain full-frame one loses its edges the
 * moment a scene pulls out below 1× (Scene 3's reveal, Scene 11's nine
 * million drops). Draw in ordinary composition coordinates.
 */
export const WIDE = { x: -1200, y: -500, w: 4400, h: 2200 } as const;

export const WideLayer: React.FC<{ opacity?: number; children: React.ReactNode }> = ({
  opacity = 1,
  children,
}) => (
  <svg
    width={WIDE.w}
    height={WIDE.h}
    viewBox={`${WIDE.x} ${WIDE.y} ${WIDE.w} ${WIDE.h}`}
    style={{
      position: "absolute",
      left: WIDE.x,
      top: WIDE.y,
      opacity,
      pointerEvents: "none",
    }}
  >
    {children}
  </svg>
);

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

/** The cartoon thermometer. `level` is 0..1 of the tube. */
export const Thermometer: React.FC<{
  x: number;
  y: number;
  level: number;
  scale?: number;
  label?: string;
}> = ({ x, y, level, scale = 1, label }) => {
  const frame = useCurrentFrame();
  const u = Math.max(0, Math.min(1, level));
  const tubeTop = -230;
  const tubeBottom = 120;
  const fillTop = tubeBottom - (tubeBottom - tubeTop) * u;
  // A hot thermometer shivers a little; a cold one holds still.
  const shake = Math.sin(frame * 0.9) * 3 * u * u;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${shake}deg)`,
      }}
    >
      <svg width={220} height={520} viewBox="-110 -270 220 520" overflow="visible">
        <g stroke={kidTheme.ink} strokeWidth={9} strokeLinecap="round">
          <rect
            x={-34}
            y={tubeTop}
            width={68}
            height={tubeBottom - tubeTop + 40}
            rx={34}
            fill={kidTheme.paper}
          />
          <circle cx={0} cy={148} r={62} fill={kidTheme.paper} />
        </g>
        <rect
          x={-19}
          y={fillTop}
          width={38}
          height={tubeBottom - fillTop + 60}
          rx={19}
          fill={kidTheme.tomato}
        />
        <circle cx={0} cy={148} r={46} fill={kidTheme.tomato} />
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const ty = tubeBottom - (tubeBottom - tubeTop) * p;
          return (
            <path
              key={p}
              d={`M 36 ${ty} L ${p === 0 || p === 1 ? 84 : 66} ${ty}`}
              stroke={kidTheme.ink}
              strokeWidth={8}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -70,
            transform: "translateX(-50%)",
            fontSize: kidType.min,
            fontWeight: 900,
            letterSpacing: 2,
            color: kidTheme.ink,
            textShadow: kidOutline(4),
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

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

/**
 * A caption card — the "Monday / Tuesday / also Tuesday" gag furniture. Not a
 * caption in the financial-series sense; the kids' series has none.
 *
 * `align` exists because a centred card and a speech bubble both want the top
 * of the frame: put the card on the opposite side from the speaker.
 */
export const CaptionCard: React.FC<{
  text: string;
  from?: number;
  until?: number;
  y?: number;
  color?: string;
  align?: "left" | "center" | "right";
}> = ({ text, from = 0, until, y = 150, color = kidTheme.paper, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 12, mass: 0.6 } });
  const out = until === undefined ? 0 : Math.max(0, Math.min(1, (frame - until) / 6));
  const scale = s * (1 - out);
  if (scale <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent:
          align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        padding: align === "center" ? 0 : "0 96px",
        transform: `translateY(-50%) scale(${scale})`,
        zIndex: 45,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: color,
          border: `9px solid ${kidTheme.ink}`,
          borderRadius: kidRadius.card,
          padding: "16px 56px",
          fontSize: kidType.title * 0.62,
          fontWeight: 900,
          color: kidTheme.ink,
          boxShadow: kidShadow(1.2),
          transform: `rotate(${-1.5 + (1 - s) * 5}deg)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

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

// Re-exported so an act file needs one import for the whole kit.
export { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill };
export type { TimedScene };
