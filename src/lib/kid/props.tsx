import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kidEase } from "./rig";
import type { WideLayerProps } from "./staging";
import { kidOutline, kidRadius, kidShadow, kidTheme, kidType, mixHex } from "./theme";

// Recurring props that have earned their way out of an episode: drawn furniture
// with no episode knowledge in them, each written identically twice before
// being promoted.

/**
 * The cartoon thermometer. `level` is 0..1 of the tube.
 *
 * Episode one heats the sea under Sunny with it; episode two heats a rock. A
 * hot thermometer shivers a little and a cold one holds still, which is the
 * only thing in it that is not a straight readout.
 */
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
 * A caption card — gag furniture (episode one's "Monday / Tuesday / also
 * Tuesday"), and *not* a caption in the financial series' sense: the kids'
 * series has none.
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

/**
 * Cloudia's hat, off her head — a prop in its own right, because it has now
 * blown across two episodes' endings (episode one's sign-off, episode two's
 * Scene 34) and the joke is that it is the *same* hat.
 *
 * Drawn as a bare `<g>` in composition coordinates: the caller supplies the
 * `<svg>` (a `WideLayer`, usually) and its own translate/rotate, because how it
 * tumbles is the scene's business. `stream` (0..1) adds the two ribbons trailing
 * behind it at speed; omit it for a hat that is merely in the air.
 */
export const CloudiaHat: React.FC<{ stream?: number }> = ({ stream }) => (
  <>
    <ellipse
      cx={0}
      cy={40}
      rx={120}
      ry={30}
      fill={kidTheme.pinkDeep}
      stroke={kidTheme.ink}
      strokeWidth={9}
    />
    <path
      d="M -66 40 L -50 -66 Q 0 -96 50 -66 L 66 40 Z"
      fill={kidTheme.pink}
      stroke={kidTheme.ink}
      strokeWidth={9}
      strokeLinejoin="round"
    />
    <path d="M -58 -18 L 58 -18" stroke={kidTheme.ink} strokeWidth={9} />
    {stream === undefined
      ? null
      : /* Ribbons, going the way the wind is. */
        [0, 1].map((i) => (
          <path
            key={i}
            d={`M 60 ${-20 + i * 26} q ${80 + stream * 120} ${-10 + i * 18} ${150 + stream * 220} ${4 + i * 26}`}
            stroke={kidTheme.pink}
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
            opacity={0.9}
          />
        ))}
  </>
);

// ---------------------------------------------------------------------------
// The sleeping volcano — a running gag that has not started yet
// ---------------------------------------------------------------------------
//
// A small island out on the horizon with a face on it, fast asleep. It is
// never mentioned: no line, no bubble, no narration, no reaction anywhere,
// except one four-frame flick of Puff's eyes in ep 2, one eyelid in ep 3, and
// one curl of steam in ep 4. The plan is that it is asleep in the background
// of every wide the series ever shoots, until the episode where it wakes up.
//
// **Promoted at episode four** (2026-08-08), from two divergent copies: it was
// written in `wind/scenes/act3.tsx`, written out again in
// `sky-blue/scenes/act3.tsx` with a rim light, a stir and an eyelid added, and
// ep 4 is the third episode to need it. The two copies had drifted in exactly
// one place — how the smoke ring is coloured — so that is the parameter, and
// everything else is the same component it always was.
//
// The direction, unchanged since episode two:
//
//   - **It must read as a character, not a mountain.** Closed happy eyes and a
//     small smile, or it is scenery and there is no gag to pay off later.
//   - **It must not compete.** Low contrast against the horizon (a dusty warm
//     dark, not ink), no outline, and small — 176px wide against a 1920 frame.
//   - **It is a place, so it does not move between shots.** Same `x`, same
//     `scale` in every scene; only the horizon it sits on changes. A shot that
//     is *about* it pushes in with the CAMERA rather than by growing it.
//
// The snore is the whole performance: a slow breath and a smoke ring out of
// the crater on a 3s loop, deterministic from the frame like everything else
// in the kit, `phase` per scene so two shots do not snore in lockstep.

/**
 * Half-width, height and crater width of the island at `scale` 1.
 *
 * Exported because a scene occasionally has to *seat* something on it — ep 3
 * puts Yellow on the crater — and a hand-typed 108 in a scene file is a number
 * that will not follow the shape if the shape ever changes.
 */
export const VOLCANO_SHAPE = { halfW: 88, h: 108, crater: 18 };
const VOLCANO = VOLCANO_SHAPE;
/** One snore: breath in, ring out. Seconds. */
const SNORE = 3;
/**
 * How long a ring lives after it leaves the crater. Seconds. Shorter than the
 * snore on purpose — a ring still climbing when the next one appears reads as
 * a chimney, and a ring that has drifted a long way from the crater reads as a
 * stray halo in the sky rather than as something this island did.
 */
const SNORE_RING_LIFE = 2;

/**
 * Warm and dark, but nowhere near ink, and then hazed a fifth of the way back
 * towards the sky: the first pass was #604b4e and read as a sticker stuck on
 * the horizon rather than as something a long way off.
 */
export const VOLCANO_BODY = mixHex(
  mixHex(kidTheme.ink, "#c2705a", 0.38),
  kidTheme.skyLow,
  0.24,
);
/** The face, pale enough to read on the silhouette and no paler. */
const VOLCANO_FACE = mixHex(VOLCANO_BODY, kidTheme.paper, 0.52);

/**
 * **How this episode paints the snore ring** — the one thing the two written
 * copies disagreed about, and therefore the one thing that is data.
 *
 * Episode two picked its ring colour against a pale blue sky and left it the
 * face colour at 0.55 alpha. Episode three plays every horizon it owns against
 * orange or indigo, where that ring is completely invisible — which would have
 * taken its tease beat with it, since the payoff of three episodes is *one of
 * these rings not closing* — so it lifted the alpha to 0.8 and tinted the
 * stroke towards paper.
 *
 * An episode passes the one that matches its skies. Neither is a default,
 * because "whichever the last episode used" is how a promoted component
 * silently changes an old film.
 */
export type SnokeRingStyle = {
  /** Peak alpha of a ring, before its age fade. */
  alpha: number;
  /** How far the stroke is mixed towards paper on a plate with no rim light. */
  tint: number;
  /** The same, on a plate that asked for a rim light (`rim > 0`). */
  tintRim: number;
};

/** Episode two's: a pale sky behind it, so the ring can stay the face colour. */
export const SNORE_RING_EP2: SnokeRingStyle = { alpha: 0.55, tint: 0, tintRim: 0 };
/** Episode three's, and episode four's: readable against orange and indigo. */
export const SNORE_RING_WARM: SnokeRingStyle = { alpha: 0.8, tint: 0.6, tintRim: 0.75 };

export type SleepingVolcanoProps = {
  x: number;
  /** The horizon line it seats on. The shape's baseline is y=0 locally. */
  base: number;
  scale?: number;
  phase?: number;
  /**
   * Warm rim light, 0..1. Zero on a bright plate; ~0.9 on a dark one, where
   * without it the island is black on near-black and reads as an absence
   * rather than as a place.
   */
  rim?: number;
  /**
   * 0..1. Above zero the newest ring comes out **wobbling** and open-ended,
   * the breath deepens, and the island itself gets a very slow half-pixel sway
   * — a rumble you feel rather than a camera shake.
   */
  stir?: number;
  /**
   * **One eye, open, and it is the whole escalation** (ep 3, Scene 28b).
   *
   * 0 is the closed happy arc it has worn for two episodes; 1 is the right eye
   * fully open. The left one never moves, because "one eye" is the joke — two
   * would be the volcano waking up, which belongs to the volcano episode.
   *
   * It looks **straight ahead**, not at anybody. Aiming the pupil would make
   * it a reaction, and the value of the beat is that nothing in the show
   * acknowledges anything.
   */
  eye?: number;
};

/**
 * The island itself, bound to an episode's `WideLayer`.
 *
 *   export const SleepingVolcano = makeSleepingVolcano(WideLayer, SNORE_RING_WARM);
 *
 * `base` is the horizon line it sits on — the shape's baseline is y=0 in its
 * own coordinates, so it seats exactly on that line rather than floating above
 * it or cutting into the water.
 */
export function makeSleepingVolcano(
  WideLayer: React.FC<WideLayerProps>,
  ring: SnokeRingStyle,
): React.FC<SleepingVolcanoProps> {
  const SleepingVolcano: React.FC<SleepingVolcanoProps> = ({
    x,
    base,
    scale = 1,
    phase = 0,
    rim = 0,
    stir = 0,
    eye = 0,
  }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const t = frame / fps + phase * SNORE;
    const s = volcanoClamp01(stir);

    // One breath per snore, and the ring leaves the crater at the top of it.
    const breath = Math.sin((t / SNORE) * Math.PI * 2);
    const sy = 1 - (0.03 + 0.016 * s) * breath;
    const sx = 1 + (0.022 + 0.012 * s) * breath;
    // The rumble: slow, tiny, and in the island rather than in the lens.
    const sway = s * Math.sin(t * 5.1) * 1.6;

    // The last two rings emitted. Deterministic from the frame: ring `k` left
    // the crater at t = k * SNORE, so nothing here remembers anything.
    const newest = Math.floor(t / SNORE);

    const open = volcanoClamp01(eye);
    const { halfW, h, crater } = VOLCANO;
    const body =
      rim > 0 ? mixHex(VOLCANO_BODY, kidTheme.sunDeep, 0.18 * rim) : VOLCANO_BODY;
    const face =
      rim > 0 ? mixHex(VOLCANO_FACE, kidTheme.sunLight, 0.5 * rim) : VOLCANO_FACE;

    return (
      <WideLayer>
        <g transform={`translate(${x + sway} ${base}) scale(${scale})`} opacity={0.92}>
          {/* The warm glow the rim light sits in. Behind everything, wide and
              soft: it is what keeps a dark island from cutting a hole in a dark
              sea, and it reads in-fiction as the last of the day on the water. */}
          {rim > 0 ? (
            <>
              <defs>
                <radialGradient id="a3-volcano-glow">
                  <stop offset="0" stopColor={kidTheme.sunDark} stopOpacity={0.42 * rim} />
                  <stop offset="0.5" stopColor={kidTheme.sunDark} stopOpacity={0.16 * rim} />
                  <stop offset="1" stopColor={kidTheme.sunDark} stopOpacity={0} />
                </radialGradient>
              </defs>
              {/* Small and soft. A flat-filled ellipse at 2.4 half-widths was,
                  at a 1.9× camera, a 900px grey oval lying across a quarter of
                  the frame — fog, not a rim light, and the one thing that made
                  a still of the ep-3 tease look like a mistake. */}
              <ellipse
                cx={0}
                cy={-h * 0.5}
                rx={halfW * 1.45}
                ry={h * 0.92}
                fill="url(#a3-volcano-glow)"
              />
            </>
          ) : null}
          {/* Haze where the island meets the water. Ink at low alpha rather
              than a sea colour, because the same component sits on a drawn
              horizon in one scene and a painted one in the next. */}
          <ellipse cx={0} cy={0} rx={halfW * 1.08} ry={6} fill={kidTheme.ink} opacity={0.16} />
          <g transform={`scale(${sx} ${sy})`}>
            <path
              d={
                `M ${-halfW} 0` +
                ` C ${-halfW * 0.66} ${-h * 0.32} ${-halfW * 0.39} ${-h * 0.7} ${-crater} ${-h}` +
                ` Q 0 ${-h * 0.87} ${crater} ${-h}` +
                ` C ${halfW * 0.39} ${-h * 0.7} ${halfW * 0.66} ${-h * 0.32} ${halfW} 0 Z`
              }
              fill={body}
            />
            {/* One lit flank, so it has a shape instead of being a cut-out. */}
            <path
              d={
                `M ${-halfW} 0` +
                ` C ${-halfW * 0.66} ${-h * 0.32} ${-halfW * 0.39} ${-h * 0.7} ${-crater} ${-h}` +
                ` L ${-crater * 0.2} ${-h * 0.9} L ${-halfW * 0.42} 0 Z`
              }
              fill={mixHex(body, kidTheme.sunLight, 0.16 + 0.14 * rim)}
              opacity={0.7 + 0.1 * rim}
            />
            {/* The rim itself: one warm stroke down the lit edge and along the
                crest. Drawn, not filtered — a glow filter on a 176px shape at
                this value just fogs it. */}
            {rim > 0 ? (
              <path
                d={
                  `M ${-halfW} 0` +
                  ` C ${-halfW * 0.66} ${-h * 0.32} ${-halfW * 0.39} ${-h * 0.7} ${-crater} ${-h}` +
                  ` Q 0 ${-h * 0.87} ${crater} ${-h}`
                }
                fill="none"
                stroke={kidTheme.sunLight}
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.72 * rim}
              />
            ) : null}
            {/* The face. Closed, content, and the only reason this is a gag. */}
            <g
              stroke={face}
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
              opacity={0.8 + 0.2 * rim}
            >
              <path d={`M -33 ${-h * 0.56} q 11 -13 22 0`} />
              <path d={`M 11 ${-h * 0.56} q 11 -13 22 0`} opacity={1 - open} />
              <path d={`M -10 ${-h * 0.4} q 10 9 20 0`} strokeWidth={5} />
            </g>
            {/* ONE EYE. Drawn as a lid *rising* — the eye grows in height about
                its own centre and the upper lid rides up with it — rather than
                as a shape that fades in on top of the closed one, because a
                cross-faded eye reads as a double exposure and this beat has to
                read as a decision. Pupil dead centre: it is not looking at
                anybody (see the `eye` prop). */}
            {open > 0.01 ? (
              <g transform={`translate(22 ${-h * 0.56 - 2})`}>
                <ellipse rx={13} ry={11.5 * open} fill={mixHex(face, kidTheme.paper, 0.6)} />
                <circle cx={0} cy={0} r={5.6 * open} fill={mixHex(VOLCANO_BODY, kidTheme.ink, 0.5)} />
                <path
                  d={`M -13 ${-11.5 * open} q 13 ${-8 * open} 26 0`}
                  stroke={face}
                  strokeWidth={6}
                  strokeLinecap="round"
                  fill="none"
                  opacity={0.8 + 0.2 * rim}
                />
              </g>
            ) : null}
          </g>
          {/* The snore.
              **Asleep, a ring lives two seconds out of every three, so there is
              one second in every snore with no ring on screen at all — which is
              correct for a background gag nobody is looking at, and fatal for a
              beat whose content *is* "the wobbling smoke ring, alone, in
              silence". Stirring, the smoke hangs around: 3.2s of life against a
              3s period, so the rings overlap and the beat always has one in
              it.** (It reads, too — smoke that stops dissipating is a thing
              that has started producing more of it.) */}
          {[newest, newest - 1].map((k) => {
            const life = SNORE_RING_LIFE * (1 + 0.6 * s);
            const age = t - k * SNORE;
            if (age < 0 || age > life) return null;
            const u = age / life;
            // 62, not the 104 of the first pass: at 104 the ring topped out
            // level with a gull, and two unrelated small things at the same
            // height read as one cluttered corner.
            const rise = kidEase.easeOutSine(u) * 62;
            const rr = 11 + u * 24;
            const cx = u * 30 + Math.sin(u * 3.4 + k) * 6;
            const cy = -h - 4 - rise;
            const alpha = ring.alpha * Math.min(1, u * 7) * (1 - u) ** 1.2;
            const stroke = mixHex(face, kidTheme.paper, rim > 0 ? ring.tintRim : ring.tint);
            // Asleep: a closed ring. Stirring: the newest one comes out open
            // and wobbling and never closes, and it is the only thing in three
            // episodes this gag has ever done.
            if (s > 0.02 && k === newest) {
              return (
                <path
                  key={k}
                  d={wobbleRing(cx, cy, rr, rr * 0.44, t * 2.6 + k, s)}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={7 * (1 - u * 0.55)}
                  strokeLinecap="round"
                  opacity={alpha}
                />
              );
            }
            return (
              <ellipse
                key={k}
                cx={cx}
                cy={cy}
                rx={rr}
                ry={rr * 0.44}
                fill="none"
                stroke={stroke}
                strokeWidth={7 * (1 - u * 0.55)}
                opacity={alpha}
              />
            );
          })}
        </g>
      </WideLayer>
    );
  };
  return SleepingVolcano;
}

const volcanoClamp01 = (v: number): number => Math.max(0, Math.min(1, v));

/**
 * A smoke ring that has stopped being a ring: an open arc with a wobble running
 * round it, missing the last fifth of itself. The gap is the whole tell — a
 * ring that closes is a snore and a ring that does not is a thing waking up.
 */
function wobbleRing(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  t: number,
  amount: number,
): string {
  const steps = 26;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    // 0.82 of the way round, so the ring is visibly unfinished.
    const a = -Math.PI / 2 + (i / steps) * Math.PI * 2 * 0.82;
    const wob = 1 + amount * (0.2 * Math.sin(a * 3 + t) + 0.12 * Math.sin(a * 5 - t * 1.3));
    const x = cx + Math.cos(a) * rx * wob;
    const y = cy + Math.sin(a) * ry * wob * (1 + amount * 0.25 * Math.sin(t * 0.9));
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
}
