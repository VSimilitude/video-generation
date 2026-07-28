import React from "react";
import { Rock, mixHex } from "../../../lib/kid";
import {
  ACT_COLOR,
  AbsoluteFill,
  AirBlob,
  BigWordBeat,
  Bubbles,
  Camera,
  HEIGHT,
  PHASE,
  PaintedSky,
  RAY_LIGHT,
  RAY_SPECTRUM,
  Ray,
  RayShard,
  SHARD_PHASE,
  SPECTRUM,
  SoftShade,
  Sunny,
  WIDTH,
  WideLayer,
  heldBeat,
  hover,
  interpolate,
  kidEase,
  kidTheme,
  kidType,
  lineWindow,
  moveAlong,
  plateY,
  settleWave,
  spring,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cam,
  type Cast,
  type Mark,
  type TimedScene,
} from "./common";
import {
  BLUE_CRAYON,
  CRAYONS,
  CRAYON_BOX,
  CrayonDrawing,
  ORANGE_CRAYON,
  PAGE,
  SKY_BAND,
  crayonAt,
} from "./coldOpen";

// ACT THREE — THE LONG WAY. Scenes 25–31 of script.md.
//
//   s25  the sea, late, blue draining out of the top of frame. Ray hangs low
//        with the light coming in almost horizontally and throwing a long
//        shadow off a rock (`Rock` is the kit's). Plate: sea_sunset.
//   s26  THE VOLCANO. One line, then 60 frames of nothing.
//   s27  the cross-section: a short slice of air at midday against a very long
//        one at sunset. The only new physics in the act, and it is geometry.
//   s28  follow the beam along its whole path and watch the blue ping out of
//        it sideways, one at a time, in silence. Payoff of Scene 18.
//   s29  BIG WORD THREE — SUNSET, lit from below. `ACT_COLOR.sunset`,
//        syllables ["Sun", "Set"]. Sunny leans on the bottom of the card.
//   s30  the crayon goes back in the box. **Scene 1's exact framing**, so it
//        reuses `PAGE` and `CRAYONS` from coldOpen.tsx rather than re-picking
//        marks — the frame story closes by the audience recognising a picture.
//        Plate: hill_day's grass, under a warm dusk wash.
//   s31  the world turns. Pull back off the coast, off the country, until the
//        planet is in frame with the terminator sliding across it, and then 75
//        frames of silence — the longest in the episode and the end of the
//        story. Plate: space_stars.
//
// ---------------------------------------------------------------------------
// THE VOLCANO RULE (script.md, Production notes) — read this before staging
// anything on a coastal horizon.
//
//   - It sits on the **measured** horizon, exactly as it did in episode two:
//     sample the plate or read the drawn horizon, never guess, or it floats.
//     `SEA_SUNSET_FRAC` / `SEA_DUSK_FRAC` below are those measurements and
//     `plateY` turns them into a composition y for the scene's own pan/zoom.
//   - It must be **continuously visible for the whole shot** it appears in. A
//     background gag that vanishes mid-scene reads as a bug — that is why
//     episode two cut it from its own Scene 26. Both scenes it appears in here
//     (25 and 26, plus Scene 29's frozen horizon and Scene 35's dusk) have it
//     on screen from their first frame to their last; there is a stills sweep
//     in the retro that checks exactly that.
//   - It gets one line (Scene 26) and one wobble (Scene 35) in three episodes,
//     and **nothing else in this episode may look at it, point at it, or
//     explain it**. No bubble, no arrow, no music sting, no second narrator
//     line anywhere. The whole value of the beat is that the show appears to
//     think it is not important.
//
// `sea_sunset` and `sea_dusk` were both prompted for one straight unambiguous
// waterline so that it can be measured; `sea_sunset` cost three rolls to get a
// horizon with nothing sitting on it (see backgrounds.mjs).
// ---------------------------------------------------------------------------

/** The act's held-beat scenes cut the emotion lead to zero (script.md). */
const NO_LEAD = 0;

const W = WIDTH;
const H = HEIGHT;

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------------------
// The measured horizons
// ---------------------------------------------------------------------------
//
// Sharpest row-to-row transition down each plate, as a fraction of its height
// (backgrounds.mjs). Never eyeballed: two real transforms sit between the plate
// and the frame — `objectFit: cover` on a 1.75 plate inside a 1.778 frame, then
// `KidPaintedBackdrop`'s overscan — and `plateY` models both.

const SEA_SUNSET_FRAC = 0.5391;
const SEA_DUSK_FRAC = 0.513;
const MOON_FRAC = 0.4961;

/** Every sea shot in the act breathes at the same rate, so it is one place. */
const SEA_DRIFT = 10;

// ---------------------------------------------------------------------------
// The sleeping volcano
// ---------------------------------------------------------------------------
//
// **This is episode two's `SleepingVolcano`, written out a second time.** It is
// `const` (not exported) in `src/videos/wind/scenes/act3.tsx`, and this file may
// not edit another episode — so the component is reproduced here with its
// geometry, its palette, its snore period and its restraint intact, plus the two
// things episode three needs and episode two did not:
//
//   `rim`   a warm rim light. `sea_dusk` is very dark and the ep-2 body colour
//           is a near-black silhouette against it; the tease has to stay
//           **wondrous**, which means the island has to be *visible* and shaped
//           rather than a hole in the picture.
//   `stir`  Scene 35, and the only frame of this gag that has ever moved: the
//           newest ring comes out wobbling and does not close.
//
// It is now written twice, which by the `props.tsx` rule means the *next* thing
// anybody does with it is promote it to `src/lib/kid/props.tsx` and delete both
// copies. See the retro.
//
// The direction, unchanged from episode two:
//
//   - **It must read as a character, not a mountain.** Closed happy eyes and a
//     small smile, or it is scenery and there is no gag to pay off later.
//   - **It must not compete.** Low contrast against the sea, no outline, small.
//   - **It is a place, so it does not move between shots.** Same `x`, same
//     `scale` in every scene; only the horizon it sits on changes. Scene 26 and
//     Scene 35 push in on it with the *camera* rather than by growing it, which
//     is the same rule stated for a shot that is about it.

/** Half-width, height and crater width of the island at `scale` 1. */
const VOLCANO = { halfW: 88, h: 108, crater: 18 };
/** One snore: breath in, ring out. Seconds. */
const SNORE = 3;
/** How long a ring lives after it leaves the crater. Seconds. */
const SNORE_RING_LIFE = 2;

/** Warm and dark, but nowhere near ink, and hazed back towards the sky. */
const VOLCANO_BODY = mixHex(mixHex(kidTheme.ink, "#c2705a", 0.38), kidTheme.skyLow, 0.24);
/** The face, pale enough to read on the silhouette and no paler. */
const VOLCANO_FACE = mixHex(VOLCANO_BODY, kidTheme.paper, 0.52);

export const SleepingVolcano: React.FC<{
  x: number;
  /** The horizon line it seats on. The shape's baseline is y=0 locally. */
  base: number;
  scale?: number;
  phase?: number;
  /**
   * Warm rim light, 0..1. Zero on `sea_sunset` (the plate is bright behind it
   * already); ~0.9 on `sea_dusk`, where without it the island is black on
   * near-black and the tease reads as an absence rather than as a place.
   */
  rim?: number;
  /**
   * 0..1. Scene 35 only. Above zero the newest ring comes out **wobbling** and
   * open-ended, the breath deepens, and the island itself gets a very slow
   * half-pixel sway — a rumble you feel rather than a camera shake.
   */
  stir?: number;
}> = ({ x, base, scale = 1, phase = 0, rim = 0, stir = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase * SNORE;
  const s = clamp01(stir);

  // One breath per snore, and the ring leaves the crater at the top of it.
  const breath = Math.sin((t / SNORE) * Math.PI * 2);
  const sy = 1 - (0.03 + 0.016 * s) * breath;
  const sx = 1 + (0.022 + 0.012 * s) * breath;
  // The rumble: slow, tiny, and in the island rather than in the lens.
  const sway = s * Math.sin(t * 5.1) * 1.6;

  // The last two rings emitted. Deterministic from the frame: ring `k` left the
  // crater at t = k * SNORE, so nothing here remembers anything.
  const newest = Math.floor(t / SNORE);

  const { halfW, h, crater } = VOLCANO;
  const body =
    rim > 0 ? mixHex(VOLCANO_BODY, kidTheme.sunDeep, 0.18 * rim) : VOLCANO_BODY;
  const face = rim > 0 ? mixHex(VOLCANO_FACE, kidTheme.sunLight, 0.5 * rim) : VOLCANO_FACE;

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
            {/* Small and soft. A flat-filled ellipse at 2.4 half-widths was, at
                Scene 35's 1.9× camera, a 900px grey oval lying across a quarter
                of the frame — fog, not a rim light, and the one thing that made
                a still of the tease look like a mistake. */}
            <ellipse
              cx={0}
              cy={-h * 0.5}
              rx={halfW * 1.45}
              ry={h * 0.92}
              fill="url(#a3-volcano-glow)"
            />
          </>
        ) : null}
        {/* Haze where the island meets the water. */}
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
            <path d={`M 11 ${-h * 0.56} q 11 -13 22 0`} />
            <path d={`M -10 ${-h * 0.4} q 10 9 20 0`} strokeWidth={5} />
          </g>
        </g>
        {/* The snore. */}
        {[newest, newest - 1].map((k) => {
          const age = t - k * SNORE;
          if (age < 0 || age > SNORE_RING_LIFE) return null;
          const u = age / SNORE_RING_LIFE;
          const rise = kidEase.easeOutSine(u) * 62;
          const rr = 11 + u * 24;
          const cx = u * 30 + Math.sin(u * 3.4 + k) * 6;
          const cy = -h - 4 - rise;
          const alpha = 0.8 * Math.min(1, u * 7) * (1 - u) ** 1.2;
          // Smoke, not rock: paler than the face, because episode two's ring
          // colour was picked against a pale blue sky and this act plays every
          // one of its horizons against orange or indigo. At the ep-2 value the
          // ring is completely invisible on `sea_sunset` — which would take
          // Scene 35's whole beat with it, since the payoff of three episodes
          // is *one of these rings not closing*.
          const stroke = mixHex(face, kidTheme.paper, rim > 0 ? 0.75 : 0.6);
          // Asleep: a closed ring. Stirring: the newest one comes out open and
          // wobbling and never closes, and it is the only thing in three
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

/**
 * Where it is: the same island in the same place on the same horizon, in every
 * shot of the series that can see it. Frame left, over open water, and small.
 */
export const VOLCANO_AT = { x: 300, scale: 1.15 } as const;

// ---------------------------------------------------------------------------
// Scene 25 — Down at the sea, going orange
// ---------------------------------------------------------------------------

const S25_RAY = { x: 940, y: 748, scale: 1.05 };
/** Rock front-right, so the sideways light throws its shadow across frame. */
const S25_ROCK = { x: 1548, ground: 942, scale: 0.62 };

const S25_BUBBLES: Record<string, string> = {
  a3_04_ray: "Why is it going orange?",
};

/**
 * Scene 25 — the act's question, asked on a horizon that has already answered
 * it, and the one shot in the episode that has to *drain*.
 *
 * `sea_sunset` is warm from the top edge to the bottom edge, which is the right
 * plate for the end of the scene and the wrong one for the start: the script
 * opens on "the blue draining out of the top of the frame". So the blue is a
 * wash **over** the plate that retreats upward and thins out across the first
 * two lines, and the warm band along the waterline comes up as it goes. Nothing
 * about the plate changes; what changes is how much day is left on top of it.
 */
const SeaSunsetScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, drainFrom] = lineWindow(scene, "a3_01_narrator");
  const [, drainTo] = lineWindow(scene, "a3_02_narrator");

  const horizon = plateY(SEA_SUNSET_FRAC, { drift: SEA_DRIFT });

  // The day going. Eased, and slow enough that no single second of it is an
  // event — the Narrator's word is "slowly".
  const drain = interpolate(frame, [drainFrom - 40, drainTo + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  const stage = useStage(scene);
  const emotion = useEmotion(scene, "ray", { a3_04_ray: "amazed" }, "happy");
  // He drifts a little further out over the water across the shot; a hero
  // parked on one x for twenty seconds is a sticker.
  const rayX = S25_RAY.x + Math.sin(frame / 90) * 26 - (frame / scene.durationInFrames) * 40;
  const rayMark: Mark = {
    x: rayX,
    y: hover("ray", S25_RAY.y, S25_RAY.scale),
    scale: S25_RAY.scale,
    who: "ray",
    side: "right",
  };

  return (
    <AbsoluteFill>
      <PaintedSky bg="sea_sunset" phase={1.1} drift={SEA_DRIFT} />

      {/* The blue, leaving. Top of frame down, retreating upward and thinning
          — and gone before the Narrator gets to "sideways". */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, rgba(42,159,224,${0.82 * (1 - drain)}) 0%, rgba(126,208,245,${0.6 * (1 - drain)}) ${28 - drain * 20}%, rgba(205,239,255,${0.24 * (1 - drain)}) ${46 - drain * 34}%, rgba(205,239,255,0) ${62 - drain * 44}%)`,
          pointerEvents: "none",
        }}
      />
      {/* …and the warm coming in along the waterline as it goes. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: horizon - 150,
          height: 300,
          background: `linear-gradient(to bottom, rgba(255,201,60,0) 0%, rgba(255,167,64,${0.26 * drain}) 46%, rgba(255,138,90,${0.34 * drain}) 52%, rgba(255,167,64,0) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* THE VOLCANO. On the measured horizon, in frame from the first frame of
          the scene to the last, and never mentioned. */}
      <SleepingVolcano
        x={VOLCANO_AT.x}
        base={horizon}
        scale={VOLCANO_AT.scale}
        phase={0.15}
      />

      {/* The light, coming in almost horizontally: long flat bars off the
          right-hand edge, low and warm, lying on the water rather than over it. */}
      <SideLight horizon={horizon} strength={0.35 + 0.35 * drain} />

      {/* The rock, and the long shadow the sideways light throws off it. The
          shadow is the scene's one piece of evidence: a sun this low makes
          shadows that do not fit in the frame. */}
      <LongShadow
        x={S25_ROCK.x}
        y={S25_ROCK.ground}
        reach={1180 + drain * 220}
        strength={0.34 + 0.2 * drain}
      />
      <Rock x={S25_ROCK.x} y={S25_ROCK.ground - 170} scale={S25_ROCK.scale} speaking={false} />

      {/* He is warm-white over warm water, which is the Ray legibility problem
          in its mildest form. Shade behind him rather than a brighter Ray. */}
      <SoftShade x={rayX} y={S25_RAY.y - 30} rx={520} ry={380} strength={0.24} color="60,32,64" />
      <Ray
        x={rayX}
        y={rayMark.y}
        scale={S25_RAY.scale}
        brightness={RAY_LIGHT.full}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={emotion}
        speaking={stage.speaking("ray")}
        look={frame > drainTo ? { x: 0.15, y: -0.5 } : { x: 0.7, y: -0.15 }}
        streak={0.3}
        bank={-3}
        zIndex={20}
      />
      {/* The water under him takes the light back. */}
      <WideLayer zIndex={12}>
        <ellipse
          cx={rayX}
          cy={S25_RAY.y + 190}
          rx={210}
          ry={22}
          fill={kidTheme.sunLight}
          opacity={0.3}
        />
      </WideLayer>

      <Bubbles scene={scene} cast={{ ray: rayMark } as Cast} text={S25_BUBBLES} />
    </AbsoluteFill>
  );
};

/**
 * Long flat bars of light lying *along* the water, coming in from the right.
 *
 * Every bar runs off both edges of the frame and fades out along its own
 * length. The first pass drew them as plain rectangles a little wider than they
 * needed to be, and a still caught what a description never would: a hard
 * vertical end on a bar of light is a UI stripe, not a reflection. Nothing that
 * is made of light in this show is allowed to have a corner on it.
 */
const SideLight: React.FC<{ horizon: number; strength: number }> = ({
  horizon,
  strength,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer zIndex={8}>
      <defs>
        <linearGradient id="a3-sidelight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={kidTheme.sunLight} stopOpacity={0} />
          <stop offset="0.42" stopColor={kidTheme.sunLight} stopOpacity={0.55} />
          <stop offset="1" stopColor={kidTheme.sunLight} stopOpacity={1} />
        </linearGradient>
      </defs>
      {Array.from({ length: 7 }, (_, i) => {
        const y = horizon + 26 + i * i * 13 + Math.sin(t * 0.4 + i) * 3;
        return (
          <rect
            key={i}
            x={-500 + Math.sin(t * 0.3 + i * 1.7) * 26 + i * 90}
            y={y}
            width={W + 700}
            height={7 + i * 2.4}
            rx={6}
            fill="url(#a3-sidelight)"
            opacity={strength * (0.5 - i * 0.05)}
          />
        );
      })}
    </WideLayer>
  );
};

/**
 * The shadow a very low sun throws: a long tapering wedge running away from the
 * light, not an ellipse under the object. `reach` is how far it goes, which is
 * the whole point — it goes further than the frame is wide, and that is the
 * scene's one piece of evidence that the sun is on the floor.
 *
 * Blurred and gradient-faded, both for the same reason as `SideLight` above: a
 * flat-filled quad at this size reads as a grey bar lying on the sea. A still
 * of the first pass is the only thing that said so.
 */
const LongShadow: React.FC<{
  x: number;
  y: number;
  reach: number;
  strength: number;
}> = ({ x, y, reach, strength }) => (
  <WideLayer zIndex={10}>
    <defs>
      <linearGradient id="a3-longshadow" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor="#2f2a5c" stopOpacity={1} />
        <stop offset="0.4" stopColor="#2f2a5c" stopOpacity={0.55} />
        <stop offset="1" stopColor="#2f2a5c" stopOpacity={0} />
      </linearGradient>
      <filter id="a3-shadowblur" x="-20%" y="-300%" width="140%" height="700%">
        <feGaussianBlur stdDeviation="13" />
      </filter>
    </defs>
    <path
      d={
        `M ${x + 130} ${y + 30} Q ${x - reach * 0.45} ${y + 4} ${x - reach} ${y - 12}` +
        ` Q ${x - reach * 0.45} ${y + 34} ${x + 130} ${y + 76} Z`
      }
      fill="url(#a3-longshadow)"
      opacity={strength}
      filter="url(#a3-shadowblur)"
    />
  </WideLayer>
);

// ---------------------------------------------------------------------------
// Scene 26 — The volcano
// ---------------------------------------------------------------------------

/**
 * Scene 26 — one line, sixty frames of nothing, and the most disciplined shot
 * in the episode.
 *
 * The camera drifts idly across the horizon and settles on the island. It is in
 * frame on frame zero (the drift is a *settle*, not a search — a gag that walks
 * on halfway through a shot is a reveal, and this one is emphatically not a
 * reveal), and it is still in frame on the last frame of the held beat.
 *
 * **Nothing else is in this scene.** No Ray, no bubble, no arrow, no caption, no
 * sting, no second look. The whole value of the beat is that the show appears to
 * think it is not important, and the only way to play that is to put the thing
 * in the middle of the frame and let the line be the entire performance.
 *
 * The push is done with the *camera*, not by growing the island: it is a place,
 * and a place is the same size in every episode.
 */
const VolcanoScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, lineTo] = lineWindow(scene, "a3_06_narrator");

  // Settles well before the line ends, and then does not move again — the held
  // beat is on a completely locked-off frame.
  const settle = kidEase.easeInOutSine(frame / Math.max(1, lineTo * 0.55));

  // **The plate is never inside the camera.** A `Camera` translate slides an
  // `AbsoluteFill` bodily, and `KidPaintedBackdrop` only overscans enough to
  // cover its own drift and pan — so a 660px camera `dx` walks the picture off
  // its own left edge and puts a cream stripe down a quarter of the frame. A
  // still of the first pass is the only thing that said so. The plate does its
  // own push (`zoom`, which is paid for by the overscan), the *island* is what
  // the camera moves, and the horizon is recomputed from the plate's live
  // numbers so the island stays seated on it to the pixel.
  const zoom = 1 + settle * 0.1;
  const horizon = plateY(SEA_SUNSET_FRAC, { drift: SEA_DRIFT, zoom });
  const cam: Cam = {
    // `y` on the horizon with `dy` at zero is what keeps the island's baseline
    // welded to the waterline through the whole push.
    x: VOLCANO_AT.x,
    y: horizon,
    zoom: 1.34 + settle * 0.56,
    dx: 960 - VOLCANO_AT.x + (1 - settle) * 250,
  };

  return (
    <AbsoluteFill style={{ background: kidTheme.sunsetLow, overflow: "hidden" }}>
      <PaintedSky bg="sea_sunset" phase={2.7} drift={SEA_DRIFT} zoom={zoom} />
      <Camera cam={cam}>
        <SleepingVolcano
          x={VOLCANO_AT.x}
          base={horizon}
          scale={VOLCANO_AT.scale}
          phase={0.55}
        />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 27 — The long way through
// ---------------------------------------------------------------------------
//
// The act's only new physics, and it is *geometry* — which is why it gets a
// diagram rather than a place, and why the diagram is built out of two lengths
// a six-year-old could measure with a piece of string.
//
// The numbers below are one circle and one shell thickness, and everything else
// is derived from them, because the whole claim is that the two paths are the
// same picture at two angles. Earth centre is far below frame with a very large
// radius, so the surface is a gentle curve across the bottom of the frame and
// the shell above it is near-constant thickness — a *thin shell*, as scripted,
// rather than the fat halo a small circle would need to be legible.

// Tuned against a still. The first pass put the observer at x=1600 (the whole
// diagram jammed into the right third, the long path running off the left edge
// with its measuring bar out of frame) and gave the shell 260px, which is not
// "thin" and which shortened the grazing chord to something you could not call
// long. 150px of air and an observer at 1260 puts the entry point at x≈154 —
// just inside the frame — and makes the two trips 150px and 1106px, a ratio of
// seven to one that a six-year-old can see without being told it.
const EARTH = { cx: 1260, cy: 4600, r: 4000, air: 150 };

/** Surface y under a composition x. */
function groundY(x: number): number {
  const dx = x - EARTH.cx;
  return EARTH.cy - Math.sqrt(Math.max(0, EARTH.r * EARTH.r - dx * dx));
}
/** Top-of-the-air y over a composition x. */
function airTopY(x: number): number {
  const dx = x - EARTH.cx;
  const ro = EARTH.r + EARTH.air;
  return EARTH.cy - Math.sqrt(Math.max(0, ro * ro - dx * dx));
}

/** Where the observer stands: the top of the arc, and both trips end here. */
const OBSERVER = { x: EARTH.cx, y: groundY(EARTH.cx) };
/**
 * The sunset trip is the ray that grazes the ground at the observer, so its
 * chord through the shell is the longest one there is — 1465px of it, most of
 * the width of the frame, which is the fact the scene is selling.
 */
const GRAZE_X = EARTH.cx - Math.sqrt((EARTH.r + EARTH.air) ** 2 - EARTH.r ** 2);
/** The midday trip: straight down onto the same spot. */
const NOON_TOP = airTopY(EARTH.cx);

const S27_BUBBLES: Record<string, string> = {
  a3_10_ray: "How long is that trip?",
};

const LongWayScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [noonFrom, noonTo] = lineWindow(scene, "a3_08_narrator");
  const [lowFrom] = lineWindow(scene, "a3_09_narrator");

  // The midday trip: down, fast, over in a second, and its path stays drawn.
  const noon = clamp01((frame - noonFrom - 14) / Math.max(1, (noonTo - noonFrom) * 0.62));
  const noonDrawn = clamp01((frame - noonFrom - 12) / 18);

  // The sunset trip: begins on "So Ray comes in sideways" and is **still
  // going** when the scene cuts. script.md: "let the sunset one keep going, and
  // going, across the whole width of the frame."
  const low = clamp01(
    (frame - lowFrom - 10) / Math.max(1, (scene.durationInFrames - lowFrom - 10) * 1.09),
  );

  // He is one character, so he cannot be on both paths at once: he lands at the
  // observer, fades, and the sunset trip starts him again out at the left. The
  // two *paths* stay on screen, which is the comparison.
  const onNoon = frame < lowFrom - 6;
  const rayAlpha = onNoon
    ? clamp01((frame - noonFrom - 12) / 8) * (1 - clamp01((frame - noonTo + 6) / 10))
    : clamp01((frame - lowFrom - 8) / 10);

  const rayX = onNoon ? EARTH.cx : GRAZE_X + (OBSERVER.x - GRAZE_X) * low;
  const rayY = onNoon
    ? NOON_TOP - 260 + (OBSERVER.y - (NOON_TOP - 260)) * kidEase.easeInOutSine(noon)
    : OBSERVER.y;

  const stage = useStage(scene);
  const emotion = useEmotion(scene, "ray", { a3_10_ray: "amazed" }, "happy");

  const rayMark: Mark = {
    x: rayX,
    y: hover("ray", rayY, 0.6),
    scale: 0.6,
    who: "ray",
    side: onNoon ? "right" : "left",
  };

  return (
    <AbsoluteFill style={{ background: "#fdefe0" }}>
      {/* The world, drained to a wash: the same sea the act is standing in,
          drawn simply rather than cut to a whiteboard. */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.26, filter: "saturate(0.55)" }}>
        <PaintedSky bg="sea_sunset" phase={3.9} drift={0} />
      </div>

      <CrossSection noon={noonDrawn} low={low} />

      <Ray
        x={rayX}
        y={rayMark.y}
        scale={0.6}
        brightness={RAY_LIGHT.full}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={emotion}
        speaking={stage.speaking("ray")}
        look={onNoon ? { x: 0, y: 0.8 } : { x: 0.8, y: 0 }}
        bank={onNoon ? 0 : -2}
        streak={0.7}
        opacity={rayAlpha}
        edge={kidTheme.ink}
        zIndex={30}
      />

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark } as Cast}
        text={S27_BUBBLES}
        at={{ a3_10_ray: { x: 1180, y: 250, tail: "left", tailAt: rayX } }}
      />
    </AbsoluteFill>
  );
};

/**
 * The cross-section: Earth, a thin shell of air, and the two trips through it.
 *
 * Both paths are drawn as **measured lines** — a rule of ticks under each one,
 * countable air puffs strung along each one, and an end-stopped bar. There is
 * no text anywhere in it (the kids' series has no captions, and the Narrator is
 * saying the numbers); what a six-year-old can do with this picture is *count*,
 * which is the same trick Scene 9 uses on the seven.
 */
const CrossSection: React.FC<{ noon: number; low: number }> = ({ noon, low }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const groundPath =
    `M ${-1600} ${groundY(-1600)} ` +
    Array.from({ length: 40 }, (_, i) => {
      const x = -1600 + ((W + 3200) / 39) * i;
      return `L ${x.toFixed(0)} ${groundY(x).toFixed(1)}`;
    }).join(" ") +
    ` L ${W + 1600} ${H + 900} L -1600 ${H + 900} Z`;
  const airPath =
    `M ${-1600} ${airTopY(-1600)} ` +
    Array.from({ length: 40 }, (_, i) => {
      const x = -1600 + ((W + 3200) / 39) * i;
      return `L ${x.toFixed(0)} ${airTopY(x).toFixed(1)}`;
    }).join(" ") +
    ` L ${W + 1600} ${H + 900} L -1600 ${H + 900} Z`;

  const lowX = GRAZE_X + (OBSERVER.x - GRAZE_X) * low;

  return (
    <WideLayer zIndex={12}>
      {/* The air: a thin shell, drawn as a band rather than as a glow, because
          the scene is about how far through it a thing has to go. */}
      <path d={airPath} fill={kidTheme.skyMid} opacity={0.34} />
      <path
        d={airPath.split(" L " + (W + 1600))[0]}
        fill="none"
        stroke={kidTheme.skyTop}
        strokeWidth={5}
        strokeDasharray="22 16"
        opacity={0.65}
      />
      {/* The ground. */}
      <path d={groundPath} fill="#7fc06a" stroke="#2a8134" strokeWidth={9} />

      {/* Air, as countable puffs, strung along both trips. Two on the short
          one, fourteen on the long one, and that ratio is the lesson. */}
      {Array.from({ length: 2 }, (_, i) => (
        <AirBlob
          key={`n${i}`}
          x={EARTH.cx + (i % 2 ? 48 : -50)}
          y={NOON_TOP + 42 + i * 68}
          r={26}
          t={t}
          seed={i * 3}
          opacity={0.5}
        />
      ))}
      {Array.from({ length: 14 }, (_, i) => {
        const u = (i + 0.5) / 14;
        return (
          <AirBlob
            key={`l${i}`}
            x={GRAZE_X + (OBSERVER.x - GRAZE_X) * u}
            y={OBSERVER.y - 44 - ((i * 37) % 62)}
            r={26}
            t={t}
            seed={i}
            opacity={0.5}
          />
        );
      })}

      {/* THE SHORT TRIP. Straight down, through a slice of air you can measure
          with two fingers. */}
      <g opacity={noon}>
        <path
          d={`M ${EARTH.cx} ${NOON_TOP - 300} L ${EARTH.cx} ${OBSERVER.y}`}
          stroke={kidTheme.sunLight}
          strokeWidth={26}
          strokeLinecap="round"
          opacity={0.55}
        />
        <path
          d={`M ${EARTH.cx} ${NOON_TOP} L ${EARTH.cx} ${OBSERVER.y}`}
          stroke={kidTheme.sunDeep}
          strokeWidth={11}
          strokeLinecap="round"
        />
        <MeasureBar
          from={{ x: EARTH.cx - 104, y: NOON_TOP }}
          to={{ x: EARTH.cx - 104, y: OBSERVER.y }}
          ticks={2}
          color={kidTheme.sunDeep}
        />
      </g>

      {/* THE LONG TRIP. In almost flat, and it keeps going, and going. */}
      <g>
        <path
          d={`M ${GRAZE_X - 320} ${OBSERVER.y} L ${lowX} ${OBSERVER.y}`}
          stroke={kidTheme.sunLight}
          strokeWidth={30}
          strokeLinecap="round"
          opacity={0.55}
        />
        <path
          d={`M ${GRAZE_X - 320} ${OBSERVER.y} L ${lowX} ${OBSERVER.y}`}
          stroke={kidTheme.sunDeep}
          strokeWidth={11}
          strokeLinecap="round"
        />
        <MeasureBar
          from={{ x: GRAZE_X, y: OBSERVER.y + 74 }}
          to={{ x: lowX, y: OBSERVER.y + 74 }}
          ticks={Math.max(1, Math.round(14 * low))}
          color={kidTheme.sunDeep}
        />
      </g>

      {/* The observer both trips arrive at: the same drawn child Act One's
          homework diagram used, standing **beside** the landing point rather
          than on it. A still of the first pass had them standing exactly where
          the midday beam comes down, which hid the entire short path behind a
          silhouette — i.e. hid one of the two things the scene is comparing. */}
      <g transform={`translate(${OBSERVER.x + 122} ${OBSERVER.y})`}>
        <ellipse cx={0} cy={4} rx={54} ry={12} fill="rgba(26,50,36,0.28)" />
        <path d="M 0 -46 L -18 2 M 0 -46 L 18 2" stroke={kidTheme.ink} strokeWidth={18} strokeLinecap="round" />
        <path d="M -28 -122 Q 0 -140 28 -122 L 22 -40 L -22 -40 Z" fill={kidTheme.ink} />
        <circle cx={0} cy={-160} r={32} fill={kidTheme.ink} />
        <path d="M -30 -178 q 16 -20 36 -13 q 18 6 24 18" stroke={kidTheme.ink} strokeWidth={16} strokeLinecap="round" fill="none" />
      </g>
    </WideLayer>
  );
};

/**
 * A length, drawn so it can be read as a length: a bar with hard end stops and
 * a row of ticks along it. Two of these side by side is the whole of Scene 27's
 * argument, and neither of them needs a word on it.
 */
const MeasureBar: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  ticks: number;
  color: string;
}> = ({ from, to, ticks, color }) => {
  const vertical = Math.abs(to.y - from.y) > Math.abs(to.x - from.x);
  const cap = 15;
  return (
    <g opacity={0.9}>
      <path
        d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {[from, to].map((p, i) => (
        <path
          key={i}
          d={
            vertical
              ? `M ${p.x - cap} ${p.y} L ${p.x + cap} ${p.y}`
              : `M ${p.x} ${p.y - cap} L ${p.x} ${p.y + cap}`
          }
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
        />
      ))}
      {Array.from({ length: Math.max(0, ticks - 1) }, (_, i) => {
        const u = (i + 1) / ticks;
        const x = from.x + (to.x - from.x) * u;
        const y = from.y + (to.y - from.y) * u;
        return (
          <path
            key={i}
            d={
              vertical ? `M ${x - 8} ${y} L ${x + 8} ${y}` : `M ${x} ${y - 8} L ${x} ${y + 8}`
            }
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.8}
          />
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 28 — Blue runs out
// ---------------------------------------------------------------------------
//
// The payoff of Scene 18, and **the one scene in the episode where a colour
// genuinely goes missing from a beam** — so it is also the scene where the
// script's physics-honesty rule bites hardest:
//
//   "Nothing is taken away. Act Three is the one place where a colour genuinely
//    does go missing from a beam, and it is staged as blue *bouncing off
//    sideways*, visibly, into the rest of the sky, rather than as blue being
//    removed."
//
// So no shard ever fades out on the beam. Each one hits an air puff, **ricochets
// off sideways and upward**, keeps flying, and the blue it takes with it turns
// into the blue wash across the top of the corridor — the rest of the sky, being
// made, out of the exact material that left. A six-year-old can follow one blob
// from the beam to the sky with their finger.

/**
 * The corridor, in world coordinates. The camera rides along it.
 *
 * **Everything here has to live inside `WIDE`** (-1600..3600 in x), because a
 * `WideLayer` is an `<svg>` and an `<svg>` clips to its own viewBox. The first
 * pass put the eye at x=4200 and the shot arrived, at the end of the scene's
 * whole journey, at an empty frame: red and orange hanging in the air with
 * nothing to land on, because the thing they were landing on was outside the
 * layer's box and had never been drawn. Nothing in a `WideLayer` is allowed to
 * be somewhere the box is not.
 */
const BEAM = { x0: -1150, x1: 2600, y: 596, eyeX: 3010 };
/** Where the pack sits on screen while the camera is tracking it. */
const TRACK_X = 690;

const S28_BUBBLES: Record<string, string> = {
  a3_15_ray: "So who is left?",
  a3_17_ray: "The calm ones.",
};

/** The order the seven leave in: violet-ward first, red and orange never. */
const LEAVERS = [4, 5, 6, 3, 2] as const;

const BlueRunsOutScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const [travelFrom] = lineWindow(scene, "a3_12_narrator");
  const [bounceFrom, bounceTo] = lineWindow(scene, "a3_13_narrator");
  const [beatFrom, beatTo] = heldBeat(scene, "a3_13_narrator");
  const [, arriveTo] = lineWindow(scene, "a3_14_narrator");

  // Three bounces on "Bounce. Bounce. Bounce." (the line runs at 0.88 so that
  // they are three bounces), then the drain carries on **in silence** through
  // the held beat with two more. Five pings, one at a time, over most of the
  // width of the frame.
  const bounceSpan = Math.max(1, bounceTo - bounceFrom);
  const beatSpan = Math.max(1, beatTo - beatFrom);
  const departAt = [
    bounceFrom + bounceSpan * 0.24,
    bounceFrom + bounceSpan * 0.56,
    bounceFrom + bounceSpan * 0.88,
    beatFrom + beatSpan * 0.3,
    beatFrom + beatSpan * 0.74,
  ];

  // Where the light is. One continuous move, left to right, all the way to the
  // eye — it never stops and never cuts.
  const travel = kidEase.easeInOutSine(
    clamp01((frame - travelFrom) / Math.max(1, arriveTo - travelFrom)),
  );
  // …and then the last of it, on "straight down the middle, all the way to your
  // eyes": red and orange cover the final stretch into the pupil while the
  // camera holds. The scene ends with the light actually arriving somewhere.
  const [landFrom, landTo] = lineWindow(scene, "a3_18_narrator");
  const land = kidEase.easeInOutSine(
    clamp01((frame - landFrom - 20) / Math.max(1, (landTo - landFrom) * 0.8)),
  );
  const packX =
    BEAM.x0 + (BEAM.x1 - BEAM.x0) * travel + land * (BEAM.eyeX - 268 - BEAM.x1);
  const packY = BEAM.y + Math.sin(travel * 5.2) * 14;

  // The camera follows, and stops when the eye is in frame — the last third of
  // the scene is four lines of dialogue on a locked-off shot.
  const dx = Math.max(-(BEAM.x1 - TRACK_X), -(packX - TRACK_X));
  const cam: Cam = { x: 0, y: 540, dx };

  // How much of the blue has gone up into the sky. Drives the wash at the top
  // of frame: what left the beam is what the sky is now made of.
  const gone = departAt.filter((f) => frame >= f).length / departAt.length;

  const stage = useStage(scene);
  const emotion = useEmotion(
    scene,
    "ray",
    { a3_15_ray: "amazed", a3_17_ray: "happy" },
    "happy",
    // 45f held beat in this scene.
    NO_LEAD,
  );

  // He gets out of the way of the thing the beam is landing in. A still had him
  // sitting on the eye's own eyebrow.
  const rayMark: Mark = {
    x: packX + 120 - land * 300,
    y: hover("ray", packY - 96 - land * 210, 0.62),
    scale: 0.62,
    who: "ray",
  };

  return (
    <AbsoluteFill>
      <PaintedSky bg="sky_dome_day" phase={4.4} drift={8} />
      {/* Sunset light in the corridor. `tint` on the plate is a soft-light wash
          and soft-light orange over a cyan sky barely moves it — the still was
          a bright blue midday sky, in the scene about the sun being on the
          floor. A plain warm wash on top does what the plate's own knob would
          not, and it also **clears the blue out of the picture**, which this
          scene needs: the blue that arrives at the top of the frame has to be
          the blue that left the beam, and it cannot be if the sky was already
          that colour. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(255,138,60,0.62) 0%, rgba(255,167,64,0.7) 46%, rgba(255,201,60,0.62) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* The rest of the sky, filling up with what bounced out of the beam. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, rgba(58,160,236,${0.86 * gone}) 0%, rgba(58,160,236,${0.44 * gone}) 32%, rgba(58,160,236,0) 60%)`,
          pointerEvents: "none",
        }}
      />

      <Camera cam={cam}>
        <AirCorridor t={t} />
        <BeamTrail x0={BEAM.x0 - 420} x1={packX} y={BEAM.y} gone={gone} />
        <TheEye x={BEAM.eyeX} y={BEAM.y} arrive={clamp01((frame - arriveTo + 40) / 30)} />

        {/* The seven. Always seven, always mounted, always in the same order —
            what changes is where each one is. Red and Orange ride all the way
            to the eye; the other five bounce off sideways, keep going, and end
            up in the sky at the top of the frame. */}
        {SPECTRUM.map((c, i) => {
          const slot = LEAVERS.indexOf(i as (typeof LEAVERS)[number]);
          const left = slot >= 0 && frame >= departAt[slot];
          const packPos = {
            // Red at the head of the file and violet at the tail, so the two
            // that never bounce are the two that arrive in the eye — and the
            // order of the file is the order they leave in.
            x: packX - i * 46,
            y: packY + ((i % 2) - 0.5) * 26,
          };
          if (!left) {
            return (
              <RayShard
                key={c.name}
                color={i}
                x={packPos.x}
                // `hover`, not the raw centre: `CharacterFrame` scales about
                // the bottom of the body's box, so a shard at 0.44 handed its
                // own centre sits 56px low — which put the whole pack under
                // the beam it is supposed to be travelling in.
                y={hover("shard", packPos.y, 0.44)}
                scale={0.44}
                phase={SHARD_PHASE[i]}
                look={{ x: 0.6, y: 0 }}
                bank={-4}
                zIndex={24 + i}
              />
            );
          }
          const at = departAt[slot];
          const origin = beamPointAt(at, travelFrom, arriveTo);
          // Off sideways and up, on an arc, and it keeps going: nothing is
          // taken away, it is somewhere else now.
          const age = frame - at;
          const dir = slot % 2 === 0 ? -1 : 1;
          const p = moveAlong(
            origin,
            { x: origin.x + dir * 620 + 120, y: origin.y - 1180 },
            clamp01(age / 150),
            { arc: 0.22 * dir, ease: kidEase.easeOutQuad },
          );
          return (
            <RayShard
              key={c.name}
              color={i}
              x={p.x}
              y={hover("shard", p.y, 0.44)}
              scale={0.44 * (1 - clamp01(age / 150) * 0.34)}
              phase={SHARD_PHASE[i]}
              emotion="excited"
              look={{ x: dir * 0.4, y: -0.5 }}
              bank={p.angle * 0.3}
              opacity={1 - clamp01((age - 40) / 110) * 0.55}
              zIndex={24 + i}
            />
          );
        })}

        {/* The ping each bounce leaves on the air it bounced off. */}
        {departAt.map((at, i) => (
          <PingRing
            key={i}
            at={at}
            frame={frame}
            fps={fps}
            p={beamPointAt(at, travelFrom, arriveTo)}
          />
        ))}

        <Ray
          x={rayMark.x}
          y={rayMark.y}
          scale={0.62}
          brightness={RAY_LIGHT.full}
          spectrum={RAY_SPECTRUM.afterRainbow}
          phase={PHASE.ray}
          emotion={emotion}
          speaking={stage.speaking("ray")}
          look={{ x: -0.5, y: 0.35 }}
          bank={-3}
          streak={0.85}
          zIndex={40}
        />
      </Camera>

      <Bubbles
        scene={scene}
        cast={{ ray: { ...rayMark, x: rayMark.x + dx } } as Cast}
        text={S28_BUBBLES}
        at={{
          a3_15_ray: { x: 700, y: 232, tail: "left", tailAt: rayMark.x + dx },
          a3_17_ray: { x: 700, y: 232, tail: "left", tailAt: rayMark.x + dx },
        }}
      />
    </AbsoluteFill>
  );
};

/** The beam's world position at an arbitrary frame — bounces need the past. */
function beamPointAt(at: number, from: number, to: number): { x: number; y: number } {
  const u = kidEase.easeInOutSine(clamp01((at - from) / Math.max(1, to - from)));
  return { x: BEAM.x0 + (BEAM.x1 - BEAM.x0) * u, y: BEAM.y + Math.sin(u * 5.2) * 14 };
}

/** The air the beam is crossing: hundreds of miles of it, drawn as a crowd. */
const AirCorridor: React.FC<{ t: number }> = ({ t }) => (
  <WideLayer zIndex={10}>
    {Array.from({ length: 54 }, (_, i) => {
      const k = i * 37;
      const x = BEAM.x0 - 300 + i * 86 + ((k * 41) % 60);
      const y = BEAM.y - 220 + ((k * 97) % 430);
      const r = 26 + ((k * 13) % 22);
      return (
        <AirBlob key={i} x={x} y={y} r={r} t={t} seed={i} opacity={0.42} />
      );
    })}
  </WideLayer>
);

/**
 * The beam behind the pack: a warm corridor of light that **loses its blue as
 * it goes**. Ahead of the pack there is nothing yet; behind it the trail is red
 * and orange only, and the further left you look the more blue it still has.
 */
const BeamTrail: React.FC<{ x0: number; x1: number; y: number; gone: number }> = ({
  x0,
  x1,
  y,
  gone,
}) => (
  <WideLayer zIndex={8}>
    <defs>
      <linearGradient id="a3-beam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={SPECTRUM[4].fill} stopOpacity={0.75} />
        <stop offset={String(0.18 + gone * 0.3)} stopColor={SPECTRUM[2].fill} stopOpacity={0.7} />
        <stop offset="1" stopColor={SPECTRUM[0].fill} stopOpacity={0.85} />
      </linearGradient>
    </defs>
    <rect x={x0} y={y - 34} width={Math.max(0, x1 - x0)} height={68} rx={34} fill="url(#a3-beam)" />
    <rect
      x={x0}
      y={y - 13}
      width={Math.max(0, x1 - x0)}
      height={26}
      rx={13}
      fill={kidTheme.sunLight}
      opacity={0.55}
    />
  </WideLayer>
);

/** The ring a bounce leaves on the puff it bounced off. */
const PingRing: React.FC<{
  at: number;
  frame: number;
  fps: number;
  p: { x: number; y: number };
}> = ({ at, frame, fps, p }) => {
  const u = (frame - at) / (fps * 0.7);
  if (u < 0 || u > 1) return null;
  return (
    <WideLayer zIndex={30}>
      <circle
        cx={p.x}
        cy={p.y}
        r={40 + u * 190}
        fill="none"
        stroke={SPECTRUM[4].light}
        strokeWidth={12 * (1 - u)}
        opacity={0.75 * (1 - u)}
      />
    </WideLayer>
  );
};

/**
 * The far end of the trip: an eye, and what actually gets there.
 *
 * Drawn friendly and large — this is the "you" the Narrator has been saying for
 * five minutes, and the last thing the beam does in the episode is arrive in
 * it. It warms as red and orange land, which is the sunset happening *in the
 * audience's own eye* rather than in the sky.
 */
const TheEye: React.FC<{ x: number; y: number; arrive: number }> = ({ x, y, arrive }) => {
  const frame = useCurrentFrame();
  const blink = Math.max(0, Math.sin(frame / 42) - 0.985) * 66;
  const open = 1 - Math.min(1, blink);
  return (
    <WideLayer zIndex={26}>
      <g transform={`translate(${x} ${y})`}>
        {/* The warm arriving in it. */}
        <ellipse rx={340} ry={240} fill={kidTheme.sunDark} opacity={0.17 * arrive} />
        <g transform={`scale(1 ${0.18 + 0.82 * open})`}>
          <path
            d="M -230 0 Q 0 -170 230 0 Q 0 170 -230 0 Z"
            fill={kidTheme.paper}
            stroke={kidTheme.ink}
            strokeWidth={12}
            strokeLinejoin="round"
          />
          <circle cx={0} cy={0} r={92} // Still a blue eye when the warm light lands in it: mixed any
            // further and the iris goes grey, which is the one colour the
            // scene is not allowed to end on.
            fill={mixHex("#2f7fd0", kidTheme.sunDark, 0.22 * arrive)} />
          <circle cx={0} cy={0} r={44} fill={kidTheme.ink} />
          <circle cx={-26} cy={-28} r={20} fill={kidTheme.paper} opacity={0.9} />
        </g>
        {/* Brow and two lashes, so it is somebody's eye and not an eyeball. */}
        <path
          d="M -220 -108 Q 0 -196 220 -108"
          stroke={kidTheme.ink}
          strokeWidth={16}
          strokeLinecap="round"
          fill="none"
        />
        <path d="M -196 -44 l -54 -34 M 196 -44 l 54 -34" stroke={kidTheme.ink} strokeWidth={13} strokeLinecap="round" />
      </g>
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 29 — Big Word Three: SUNSET
// ---------------------------------------------------------------------------

// Higher than the house 300. Three things want the middle of this frame — the
// card, Sunny's bubble and Sunny's own rays — and the script says which of them
// wins where: "Sunny, half sunk behind the sea, leans on the bottom of the
// card." So the card goes up until its bottom edge is where his rays reach, and
// the strip between it and the waterline is left free for the bubble.
const S29_CARD_Y = 250;
/** Perches on the card, hand-tuned against a still at 1920×1080. */
// Measured off a still of the split, not guessed: the two blocks land at
// roughly x=795 and x=1135 with their top edge at y≈241, and `y` here is Ray's
// *middle*, so it is that edge minus his own half-height at `S29_PERCH`. The
// first pass had him sunk to the waist in the "Set" block.
const S29_SUN_BLOCK = { x: 795, y: 120 };
const S29_SET_BLOCK = { x: 1135, y: 116 };
const S29_PERCH = 0.34;

const S29_BUBBLES: Record<string, string> = {
  a3_22_sunny: "I do this ON PURPOSE!",
};

/**
 * Scene 29 — Big Word Three, and the only one of the three lit from below.
 *
 * The freeze is the sea horizon at full sunset **with the island still on it**.
 * That is not the volcano being acknowledged: it is the volcano being scenery,
 * which is the rule. It is drawn live over the frozen plate rather than inside
 * the freeze, so it keeps snoring through the beat and nothing in the shot ever
 * stops except the water.
 *
 * Sunny is half sunk behind the sea. He is clipped at the measured waterline
 * rather than having paint drawn over him — the plate is behind him, so the
 * only honest way to put water in front of a character is to cut him off at the
 * line the plate says the water is at.
 */
const BigWordSunsetScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [wordFrom, wordTo] = lineWindow(scene, "a3_19_narrator");
  const [chantFrom] = lineWindow(scene, "a3_20_ray");
  const [sunnyFrom] = lineWindow(scene, "a3_22_sunny");

  const horizon = plateY(SEA_SUNSET_FRAC, { drift: SEA_DRIFT });
  // The freeze lands on the word itself — "…That is a sunset."
  const slamAt = Math.round(wordFrom + (wordTo - wordFrom) * 0.88);
  const splitAt = Math.max(slamAt + 20, chantFrom - 8);

  // He rides the letters apart, Sun to Set, on an arc with a settle.
  const hopU = (frame - splitAt + 6) / 16;
  const perch = moveAlong(S29_SUN_BLOCK, S29_SET_BLOCK, hopU, {
    arc: 0.3,
    ease: kidEase.easeInOutSine,
  });
  // …and he flies up to the card from over the water as it slams, rather than
  // being parked in mid-air for four seconds waiting for it.
  const rise = moveAlong({ x: 1000, y: horizon - 230 }, S29_SUN_BLOCK, (frame - slamAt + 22) / 26, {
    arc: 0.24,
    ease: kidEase.easeInOutSine,
  });
  const at = frame < splitAt ? rise : perch;
  const land = hopU > 1 ? settleWave((hopU - 1) / 2.2, 1.3, 4.4) : 0;

  const stage = useStage(scene);
  const emotion = useEmotion(
    scene,
    "ray",
    { a3_20_ray: "excited" },
    "amazed",
    // Two 12-frame held beats in this scene.
    NO_LEAD,
  );
  const sunnyEmotion = useEmotion(
    scene,
    "sunny",
    { a3_22_sunny: "proud" },
    "happy",
    NO_LEAD,
  );

  const sunnyMark: Mark = {
    x: 1462,
    // Half sunk — but his *mouth* has to be above the water, because he has a
    // line. A still with his middle on the waterline cut him off at the eyes,
    // which is a character talking with no mouth on screen.
    y: hover("sunny", horizon - 58, 1.0),
    scale: 1,
    who: "sunny",
    side: "left",
  };

  return (
    <AbsoluteFill>
      <BigWordBeat
        scene={scene}
        word="SUNSET"
        syllables={["Sun", "Set"]}
        chantKey="a3_20_ray"
        slamAt={slamAt}
        color={ACT_COLOR.sunset}
        sub="the long way"
        y={S29_CARD_Y}
        freeze={<SunsetStill horizon={horizon} />}
      >
        {/* Live over the frozen water: the island keeps snoring, and Sunny
            keeps talking. */}
        <SleepingVolcano
          x={VOLCANO_AT.x}
          base={horizon}
          scale={VOLCANO_AT.scale}
          phase={0.85}
        />
        {/* Lit from below, in red and orange: a warm glow standing up off the
            waterline and under the card. */}
        <UpLight y={horizon} strength={0.85} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            // The sea in front of him. Clipped at the measured horizon, which
            // is the only number in the shot that must not be eyeballed.
            clipPath: `inset(0 0 ${Math.max(0, H - horizon)}px 0)`,
          }}
        >
          <Sunny
            x={sunnyMark.x}
            y={sunnyMark.y}
            scale={1}
            phase={PHASE.sunny}
            emotion={sunnyEmotion}
            speaking={stage.speaking("sunny")}
            look={{ x: -0.35, y: -0.5 }}
            raySpeed={0.1}
            zIndex={30}
          />
        </div>
        {/* Where he meets the water, so he is *in* the sea rather than cut off
            by an invisible ruler. */}
        <WideLayer zIndex={31}>
          <ellipse
            cx={sunnyMark.x}
            cy={horizon + 4}
            rx={230}
            ry={14}
            fill={kidTheme.sunLight}
            opacity={0.5}
          />
        </WideLayer>
        <Ray
          x={at.x}
          y={hover("ray", at.y + land * 8, S29_PERCH)}
          scale={S29_PERCH * (1 + land * 0.1)}
          brightness={RAY_LIGHT.full}
          spectrum={RAY_SPECTRUM.afterRainbow}
          phase={PHASE.ray}
          emotion={emotion}
          speaking={stage.speaking("ray")}
          look="camera"
          streak={0.25}
          idle={0.6}
          zIndex={55}
        />
      </BigWordBeat>

      <Bubbles
        scene={scene}
        cast={{ sunny: sunnyMark } as Cast}
        text={S29_BUBBLES}
        // Above him and to the left, in the gap between the card and the
        // waterline: a bubble under its speaker points its tail at the floor,
        // and this frame has a Big Word card sitting in the only other place it
        // could go. One line, so it fits in that gap.
        maxWidth={780}
        at={{
          a3_22_sunny: {
            x: 880,
            y: Math.max(430, horizon - 132),
            tail: "right",
            tailAt: sunnyMark.x,
          },
        }}
      />
      {/* Nothing after the card may draw over Sunny's own line, so the glow
          the freeze is standing in is behind everything. */}
      <FrameLight from={sunnyFrom} />
    </AbsoluteFill>
  );
};

/** What the Big Word freezes: the sea horizon at full sunset. */
const SunsetStill: React.FC<{ horizon: number }> = ({ horizon }) => (
  <AbsoluteFill>
    <PaintedSky bg="sea_sunset" phase={5.2} drift={SEA_DRIFT} />
    <SideLight horizon={horizon} strength={0.6} />
  </AbsoluteFill>
);

/** Red and orange standing up off the waterline — the card's light source. */
const UpLight: React.FC<{ y: number; strength: number }> = ({ y, strength }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y - 620,
      height: 700,
      background: `radial-gradient(ellipse 62% 100% at 50% 100%, rgba(255,138,60,${0.5 * strength}) 0%, rgba(255,106,92,${0.24 * strength}) 46%, rgba(255,106,92,0) 74%)`,
      pointerEvents: "none",
      zIndex: 6,
    }}
  />
);

/** A last warm lift under Sunny's line, so the button is the brightest beat. */
const FrameLight: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const u = clamp01((frame - from) / 26);
  if (u <= 0.01) return null;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(255,201,60,0.22) 0%, rgba(255,201,60,0) 70%)",
        opacity: u,
        pointerEvents: "none",
        zIndex: 4,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Scene 30 — The blue crayon goes back in the box
// ---------------------------------------------------------------------------
//
// **Scene 1's frame, five minutes later, with a different crayon**, and the
// whole emotional payoff of Act Three is that the audience recognises a
// picture. So the geography (`PAGE`, `CRAYON_BOX`, `CRAYONS`, `SKY_BAND`,
// `crayonAt`) and the drawing itself (`CrayonDrawing`) are **imported from
// coldOpen.tsx**, not re-picked. Those two shots cannot drift apart, because
// there is only one set of numbers.
//
// BLOCKER, and it is the honest note on this scene: the cold open's four
// *drawings* — the page shadow, the box, the overhead kid and the hand — are
// module-private in `coldOpen.tsx`, and this wave may only edit act3.tsx and
// recap.tsx. They are therefore reproduced below, character for character,
// including `palmFor` and `CRAYON_REACH` (the wave-1 bug fix: `Hand` draws the
// crayon 186px down a shaft rotated a further 28°, so anything the tip has to
// touch is a **tip target** converted back to a palm position — putting the palm
// on the band draws on the tree). **The fix is one word:** export `PageShadow`,
// `CrayonBox`, `OverheadKid`, `Hand`, `palmFor`, `CRAYON_REACH` and
// `COLOUR_TILT` from coldOpen.tsx and delete every copy below. Until that
// happens these two shots are one careless edit apart from disagreeing, which is
// exactly the failure the cold open's own header warns about.

/** The crayon's angle in the hand while colouring, in degrees. */
const COLOUR_TILT = 14;
const CRAYON_REACH = 186;

/** The palm position that puts the crayon's tip at `tip`. */
function palmFor(tip: { x: number; y: number }, tiltDeg: number): { x: number; y: number } {
  const th = ((tiltDeg + 28) * Math.PI) / 180;
  return {
    x: tip.x + CRAYON_REACH * Math.sin(th),
    y: tip.y - CRAYON_REACH * Math.cos(th),
  };
}

/** The zoom the cold open's push-in ended on. Same shot means same number. */
const S30_ZOOM = 1.07;

const CrayonBackScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();

  const [, stillTo] = lineWindow(scene, "a3_24_narrator");
  const [lookFrom, lookTo] = heldBeat(scene, "a3_24_narrator");
  const [putFrom, putTo] = lineWindow(scene, "a3_25_narrator");
  const [searchFrom, searchTo] = heldBeat(scene, "a3_25_narrator");

  const hand = handAt(frame, {
    stillTo,
    lookFrom,
    lookTo,
    putFrom,
    putTo,
    searchFrom,
    searchTo,
    end: scene.durationInFrames,
  });

  // The head comes up off the page and goes back down — the kid looking at the
  // orange sky, with no face and not a word, three episodes running.
  const lift = kidEase.easeInOutSine((frame - lookFrom) / 22) - kidEase.easeInOutSine((frame - lookFrom - 34) / 20);

  return (
    <AbsoluteFill style={{ background: "#c08a4e", overflow: "hidden" }}>
      {/* Same lawn, same page, same kid, five minutes later — and the *only*
          thing about the shot that is different is the light on it. The plate's
          own `tint` is a soft-light wash and a still of it was still a bright
          midday lawn, so the evening is a wash of its own on top: violet in the
          shadow corner, gold coming in low from the right. It has to be
          unmistakable, because the Narrator never says the word "orange" and
          the audience has to get there first. */}
      <div style={{ position: "absolute", inset: 0, filter: "saturate(0.92) brightness(0.9)" }}>
        <PaintedSky bg="grass_overhead" drift={6} phase={7.3} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(108deg, rgba(74,36,88,0.46) 0%, rgba(150,68,86,0.28) 30%, rgba(255,142,52,0.34) 70%, rgba(255,196,92,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${PAGE.x}px ${PAGE.y}px`,
          transform: `scale(${S30_ZOOM})`,
        }}
      >
        <PageShadow />
        <CrayonDrawing blue={1} orange={hand.inked} />
        {/* A second pass with the orange, and the reason for it is the same
            reason a child presses harder the second time round: `CrayonBand`
            lays wax at ~65% alpha, and 65% orange over a full blue band is
            brown. The picture the episode ends on is an orange sky, so the band
            gets the second pass — clipped a little short of the leading edge,
            so the ragged crayon front underneath is still the front. */}
        <SecondCoat progress={hand.inked * 0.96} />
        <CrayonBox lifted={hand.carrying === "blue" ? BLUE_CRAYON : hand.carrying === "orange" ? ORANGE_CRAYON : -1} />
        <OverheadKid lift={lift} />
        <Hand
          x={hand.x}
          y={hand.y}
          press={hand.press}
          carrying={
            hand.carrying === "blue"
              ? CRAYONS[BLUE_CRAYON]
              : hand.carrying === "orange"
                ? CRAYONS[ORANGE_CRAYON]
                : null
          }
          tiltDeg={hand.tilt}
        />
      </div>
    </AbsoluteFill>
  );
};

/**
 * The orange, gone over twice. Same page transform, same band, same ragged-row
 * trick as `CrayonBand` so the two passes agree at the edges.
 */
const SecondCoat: React.FC<{ progress: number }> = ({ progress }) => {
  const p = clamp01(progress);
  if (p <= 0.002) return null;
  const left = PAGE.x - PAGE.w / 2;
  const top = PAGE.y - PAGE.h / 2;
  const rows = 8;
  const h = (SKY_BAND.y1 - SKY_BAND.y0) / rows;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: PAGE.w,
        height: PAGE.h,
        transform: `rotate(${PAGE.tilt}deg)`,
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <svg width={PAGE.w} height={PAGE.h} viewBox={`0 0 ${PAGE.w} ${PAGE.h}`}>
        <g opacity={0.86}>
          {Array.from({ length: rows }, (_, i) => {
            const lead = ((i * 37 + 159) % 11) / 11;
            const t = clamp01(p * 1.16 - lead * 0.16);
            if (t <= 0) return null;
            return (
              <rect
                key={i}
                x={SKY_BAND.x0 - left}
                y={SKY_BAND.y0 - top + i * h - h * 0.34}
                width={(SKY_BAND.x1 - SKY_BAND.x0) * t}
                height={h * 1.68}
                fill={CRAYONS[ORANGE_CRAYON].fill}
                opacity={0.6 + ((i * 29) % 4) * 0.03}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

type HandState = {
  x: number;
  y: number;
  press: number;
  carrying: "blue" | "orange" | null;
  tilt: number;
  /** How much of the sky band is orange. */
  inked: number;
};

/**
 * The whole scene, as one function of the frame — and every phase of it is
 * bounded by a scripted beat rather than by a number, so if a gap in Video.tsx
 * moves, the business moves with it.
 *
 *   a3_24 + before   still colouring, the way the cold open left them
 *   45f beat         stop. Look up. Look at the page. Look at the crayon.
 *   a3_25            carry the blue back and put it in the box
 *   36f beat         search the row, find the orange, take it, start colouring
 *   a3_26 + tail     colour over the top of the blue band
 */
function handAt(
  frame: number,
  b: {
    stillTo: number;
    lookFrom: number;
    lookTo: number;
    putFrom: number;
    putTo: number;
    searchFrom: number;
    searchTo: number;
    end: number;
  },
): HandState {
  const bandY = (SKY_BAND.y0 + SKY_BAND.y1) / 2;
  const bandLeft = palmFor({ x: SKY_BAND.x0 + 44, y: bandY }, COLOUR_TILT);
  const bandRight = palmFor({ x: SKY_BAND.x1 - 44, y: bandY }, COLOUR_TILT);
  const bandMid = { x: (bandLeft.x + bandRight.x) * 0.56, y: bandLeft.y };
  const overBlue = { x: crayonAt(BLUE_CRAYON).x, y: CRAYON_BOX.y - 210 };
  const atBlue = { x: crayonAt(BLUE_CRAYON).x, y: CRAYON_BOX.y - 96 };
  const overRow = { x: crayonAt(6).x, y: CRAYON_BOX.y - 200 };
  const overOrange = { x: crayonAt(ORANGE_CRAYON).x, y: CRAYON_BOX.y - 210 };
  const atOrange = { x: crayonAt(ORANGE_CRAYON).x, y: CRAYON_BOX.y - 96 };

  const lerp = (a: { x: number; y: number }, c: { x: number; y: number }, t: number) => ({
    x: a.x + (c.x - a.x) * t,
    y: a.y + (c.y - a.y) * t,
  });

  // 1. Still colouring — small, idle passes over a band that is already blue.
  if (frame < b.lookFrom) {
    const u = frame / Math.max(1, b.stillTo);
    const p = lerp(bandMid, bandRight, kidEase.easeInOutSine(Math.sin(u * Math.PI * 1.6) * 0.5 + 0.5));
    return { x: p.x, y: p.y + Math.sin(frame / 7) * 6, press: 1, carrying: "blue", tilt: COLOUR_TILT, inked: 0 };
  }

  // 2. The beat. Lift off the page, hold, and turn the crayon over — the shot
  //    is an overhead of a child working out that they need a different one,
  //    and the crayon is the entire emotional readout.
  if (frame < b.putFrom) {
    const span = Math.max(1, b.lookTo - b.lookFrom);
    const u = (frame - b.lookFrom) / span;
    const rise = kidEase.easeOutCubic(u / 0.34);
    const p = lerp(bandRight, { x: bandRight.x + 40, y: bandRight.y + 130 }, rise);
    // …and it turns towards them at the end of the beat.
    const turn = kidEase.easeInOutSine((u - 0.6) / 0.4);
    return {
      x: p.x,
      y: p.y,
      press: 1 - rise,
      carrying: "blue",
      tilt: COLOUR_TILT + turn * 52,
      inked: 0,
    };
  }

  // 3. "The blue crayon went back in the box."
  if (frame < b.searchFrom) {
    const span = Math.max(1, b.putTo - b.putFrom);
    const u = (frame - b.putFrom) / span;
    const carry = kidEase.easeInOutSine(u / 0.62);
    const drop = kidEase.easeInOutSine((u - 0.62) / 0.24);
    const p = lerp(lerp({ x: bandRight.x + 40, y: bandRight.y + 130 }, overBlue, carry), atBlue, drop);
    return {
      x: p.x,
      y: p.y,
      press: 0,
      // It is in the box from the moment the hand reaches the slot, which is
      // the frame the line is about.
      carrying: drop > 0.72 ? null : "blue",
      tilt: COLOUR_TILT + 52 - carry * 62,
      inked: 0,
    };
  }

  // 4. The 36-frame beat: search the row, find the orange, and start.
  const searchSpan = Math.max(1, b.searchTo - b.searchFrom);
  const s = (frame - b.searchFrom) / searchSpan;
  if (s < 1) {
    if (s < 0.32) {
      const p = lerp(overBlue, overRow, kidEase.easeInOutSine(s / 0.32));
      return { x: p.x, y: p.y, press: 0, carrying: null, tilt: -14, inked: 0 };
    }
    if (s < 0.62) {
      const p = lerp(overRow, overOrange, kidEase.easeInOutSine((s - 0.32) / 0.3));
      return { x: p.x, y: p.y, press: 0, carrying: null, tilt: -14, inked: 0 };
    }
    if (s < 0.78) {
      const t = (s - 0.62) / 0.16;
      const p = lerp(overOrange, atOrange, Math.sin(t * Math.PI));
      return { x: p.x, y: p.y, press: 0, carrying: t > 0.5 ? "orange" : null, tilt: -10, inked: 0 };
    }
    const t = kidEase.easeInOutSine((s - 0.78) / 0.22);
    const p = lerp(overOrange, bandLeft, t);
    return { x: p.x, y: p.y, press: 0, carrying: "orange", tilt: -10 + t * (COLOUR_TILT + 10), inked: 0 };
  }

  // 5. Colouring over the top of the blue, left to right, two passes, and it
  //    finishes inside the tail rather than on the last word.
  const u = clamp01((frame - b.searchTo) / Math.max(1, (b.end - 20 - b.searchTo)));
  const p = lerp(bandLeft, bandRight, scribbleSweep(u));
  return {
    x: p.x,
    y: p.y + Math.sin(u * Math.PI * 7) * 9,
    press: 1,
    carrying: "orange",
    tilt: COLOUR_TILT,
    inked: inkedTo(u),
  };
}

/** Two passes across the band — a child colouring, not a fill animation. */
function scribbleSweep(t: number): number {
  if (t < 0.4) return 0.66 * kidEase.easeInOutSine(t / 0.4);
  if (t < 0.55) return 0.66 - 0.42 * kidEase.easeInOutSine((t - 0.4) / 0.15);
  return 0.24 + 0.76 * kidEase.easeInOutSine((t - 0.55) / 0.45);
}

/** The high-water mark: ink does not come off the paper on the way back. */
function inkedTo(t: number): number {
  return Math.max(scribbleSweep(t), 0.66 * kidEase.easeInOutSine(t / 0.4));
}

// --- the four drawings, copied from coldOpen.tsx (see the BLOCKER above) ----

/** The paper, and the soft shadow that stops it floating over painted grass. */
const PageShadow: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: PAGE.x - PAGE.w / 2,
      top: PAGE.y - PAGE.h / 2,
      width: PAGE.w,
      height: PAGE.h,
      transform: `rotate(${PAGE.tilt}deg)`,
      borderRadius: 6,
      // Longer and softer than the cold open's: the sun is on the horizon now,
      // and it is the same evidence Scene 25 puts under the rock.
      boxShadow: "-40px 30px 54px rgba(52,28,22,0.4)",
      background: "#fffdf6",
    }}
  />
);

/** The open box, seen from above, with every colour standing up in it. */
const CrayonBox: React.FC<{ lifted: number }> = ({ lifted }) => (
  <div
    style={{
      position: "absolute",
      left: CRAYON_BOX.x - CRAYON_BOX.w / 2 - 26,
      top: CRAYON_BOX.y - CRAYON_BOX.h / 2 - 26,
      width: CRAYON_BOX.w + 52,
      height: CRAYON_BOX.h + 52,
      transform: "rotate(4deg)",
    }}
  >
    <svg
      width={CRAYON_BOX.w + 52}
      height={CRAYON_BOX.h + 52}
      viewBox={`0 0 ${CRAYON_BOX.w + 52} ${CRAYON_BOX.h + 52}`}
      overflow="visible"
    >
      <rect x={4} y={4} width={CRAYON_BOX.w + 44} height={CRAYON_BOX.h + 44} rx={22} fill="#d8b98a" stroke="#8a6134" strokeWidth={10} />
      <rect x={22} y={22} width={CRAYON_BOX.w + 8} height={CRAYON_BOX.h + 8} rx={14} fill="#c19d68" />
      {CRAYONS.map((c, i) => {
        const gap = CRAYON_BOX.w / CRAYONS.length;
        const x = 26 + gap * (i + 0.5) - 11;
        if (i === lifted) return null;
        return (
          <g key={c.name}>
            <rect x={x} y={70 + ((i * 17) % 14)} width={23} height={CRAYON_BOX.h - 78} rx={11} fill={c.fill} stroke={c.deep} strokeWidth={5} />
            <rect x={x + 1} y={132 + ((i * 17) % 14)} width={21} height={CRAYON_BOX.h - 214} fill="#fffdf6" opacity={0.55} />
          </g>
        );
      })}
    </svg>
  </div>
);

/**
 * The kid, from above, lying on their front — never a face, three episodes
 * running. `lift` (0..1) raises the head off the page: the one thing this shot
 * has to say that the cold open's did not is "they looked up at the sky", and
 * they have to say it with the back of their head.
 */
const OverheadKid: React.FC<{ lift: number }> = ({ lift }) => {
  const l = clamp01(lift);
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    >
      <g opacity={0.94}>
        <path d="M 590 1140 Q 620 900 760 852 L 1120 846 Q 1276 894 1300 1140 Z" fill={kidTheme.ink} />
        <g transform={`translate(0 ${-l * 26}) scale(1 ${1 + l * 0.06})`} style={{ transformOrigin: "942px 900px" }}>
          <ellipse cx={942} cy={806} rx={104} ry={92 - l * 8} fill={kidTheme.ink} />
          <path
            d="M 852 786 q 44 -52 100 -40 q 62 12 84 54"
            stroke={kidTheme.ink}
            strokeWidth={30}
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <path d="M 782 902 Q 640 900 512 866" stroke={kidTheme.ink} strokeWidth={60} strokeLinecap="round" fill="none" />
        <ellipse cx={486} cy={856} rx={54} ry={42} fill={kidTheme.ink} transform="rotate(-14 486 856)" />
      </g>
    </svg>
  );
};

/** The right hand and forearm — the only thing in this shot that acts. */
const Hand: React.FC<{
  x: number;
  y: number;
  press: number;
  carrying: (typeof CRAYONS)[number] | null;
  tiltDeg: number;
}> = ({ x, y, press, carrying, tiltDeg }) => {
  const shoulder = { x: 1178, y: 962 };
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    >
      <path
        d={`M ${shoulder.x} ${shoulder.y} Q ${(shoulder.x + x) / 2 + 40} ${(shoulder.y + y) / 2} ${x} ${y}`}
        stroke={kidTheme.ink}
        strokeWidth={58}
        strokeLinecap="round"
        fill="none"
        opacity={0.94}
      />
      <g transform={`translate(${x} ${y}) rotate(${tiltDeg})`} opacity={0.96}>
        {carrying ? (
          <g transform="rotate(28)">
            <rect x={-17} y={-10} width={34} height={176} rx={15} fill={carrying.fill} stroke={carrying.deep} strokeWidth={7} />
            <rect x={-15} y={22} width={30} height={86} fill="#fffdf6" opacity={0.62} />
            <path d={`M -17 ${156 + press * 8} L 0 ${186 + press * 10} L 17 ${156 + press * 8} Z`} fill={carrying.deep} />
          </g>
        ) : null}
        <ellipse cx={0} cy={0} rx={62 + press * 5} ry={52 - press * 4} fill={kidTheme.ink} />
        {[-34, -12, 11, 33].map((fx, i) => (
          <rect key={fx} x={fx - 11} y={-4} width={22} height={62 - Math.abs(i - 1.5) * 8} rx={11} fill={kidTheme.ink} />
        ))}
        <ellipse cx={-52} cy={12} rx={20} ry={30} fill={kidTheme.ink} transform="rotate(-28 -52 12)" />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 31 — Round the other side
// ---------------------------------------------------------------------------
//
// The end of the story, and the beat the whole ending rests on is a **75-frame
// silence with nothing in it but a planet turning**. script.md: "If any line
// lands inside these seventy-five frames, the episode does not have an ending."
//
// So the payoff is built out of things that are *already on screen and already
// moving* — the terminator keeps sliding, and a blue rim comes up on the far
// limb as the new morning arrives. Nothing enters, nothing pops, nothing lands.
// The only new thing in the last three seconds of the story is more daylight.

/** The pull-back, in one number: 0 is the sea, 1 is the whole planet. */
const S31_GLOBE = { r0: 26000, r1: 372 };

const S31_BUBBLES: Record<string, string> = {
  a3_27_ray: "Look up. That's still me.",
  a3_29_ray: "Wait. Am I finished?",
  // The identical text of a1_03, on the identical recording (`sameAs`), eight
  // minutes later and a world away. The sameness is the joke *and* the comfort;
  // it is staged small and far rather than processed.
  a3_31_sunny: "GOOD MORNING, EVERYBODY!",
};

const RoundTheOtherSideScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [rayFrom] = lineWindow(scene, "a3_27_ray");
  const [pullFrom] = lineWindow(scene, "a3_28_narrator");
  const [morningFrom] = lineWindow(scene, "a3_30_narrator");
  const [sunnyFrom, sunnyTo] = lineWindow(scene, "a3_31_sunny");
  const [payoffFrom] = heldBeat(scene, "a3_31_sunny");

  const horizon = plateY(SEA_SUNSET_FRAC, { drift: SEA_DRIFT });

  // The sliver goes under the sea on Ray's line, and the pull-back starts on
  // the Narrator's. One long ease all the way out: it is a retreat, not a cut.
  const sink = kidEase.easeInOutSine((frame - rayFrom - 26) / 70);
  const pull = kidEase.easeInOutSine(
    (frame - pullFrom + 10) / Math.max(1, (morningFrom - pullFrom) * 1.24),
  );

  // The planet. Enormous and just under the horizon at the start (its limb *is*
  // the sea's horizon), then smaller and smaller until the whole thing is in
  // frame and turning.
  const e = kidEase.easeInOutSine(pull);
  const r = S31_GLOBE.r0 + (S31_GLOBE.r1 - S31_GLOBE.r0) * e;
  // **The pull-back is parametrised by the top of the globe, not by its
  // centre.** Interpolating the centre gives a shrinking radius that outruns a
  // rising centre, and halfway through the move the camera ends up *inside* the
  // planet: a still at pull≈0.5 was a completely flat blue frame. What a
  // retreat actually looks like is the limb staying in view and getting
  // flatter, so the limb is what the numbers describe. It also hangs back until
  // the sea has finished dissolving, so the waterline and the planet's edge are
  // in the same place while both are on screen.
  const lift = kidEase.easeInOutSine(clamp01((pull - 0.2) / 0.8));
  const top = horizon + (540 - S31_GLOBE.r1 - horizon) * lift;
  const cy = top + r;

  // It never stops turning, and the terminator never stops sliding — including
  // through the whole of the 75-frame payoff, which is the only thing moving.
  //
  // `phase` is the terminator's own position, in cosine space, driven **linear
  // in time and never allowed near ±1**: at +1 the planet is fully lit and at
  // -1 it is fully dark, and a first pass that ran a real cosine round a
  // twelve-second cycle produced a still of a planet in complete daylight with
  // no terminator on it at all. This ramp crosses zero (the exact half-lit
  // disc) at about fourteen seconds, which puts the terminator sliding through
  // the middle of the world for the whole of the payoff.
  const spin = (frame / fps) * 0.078;
  const phase = 0.42 - (frame / fps) * 0.03;
  // The new day coming up on the far limb. Starts under the Narrator's
  // "somewhere out there it is already morning" and finishes inside the payoff.
  const dawn = clamp01((frame - morningFrom) / Math.max(1, (payoffFrom + 62) - morningFrom));

  const stage = useStage(scene);
  const rayEmotion = useEmotion(
    scene,
    "ray",
    { a3_27_ray: "happy", a3_29_ray: "amazed" },
    "happy",
    // Two held beats in this scene, one of them the longest in the episode.
    NO_LEAD,
  );

  // Ray: a body over the water while there is still a sea, and one glint on the
  // retreating edge once there is a planet. He crosses over as the pull-back
  // takes him — the same character, at two distances.
  //
  // Both of them aim at the globe's **final** geometry rather than its current
  // one. A point on a 26000px limb is thousands of pixels off frame, so a Ray
  // interpolating towards "wherever the limb is now" simply leaves the picture
  // for six seconds in the middle of the pull-back — which a still of frame
  // 19300 showed as a bubble with nobody under it. He crosses the daylight side
  // and *arrives* on the edge exactly as the planet arrives at its size.
  const rayNear = { x: 1080, y: 726 };
  const glint = limbPoint(960, 540, S31_GLOBE.r1, 0.62 + spin * 0.3);
  const rayX = rayNear.x + (glint.x - rayNear.x) * kidEase.easeInOutSine(pull * 1.1);
  const rayY = rayNear.y + (glint.y - rayNear.y) * kidEase.easeInOutSine(pull * 1.1);
  const rayScale = 1.0 - 0.86 * kidEase.easeInOutSine(pull);
  const rayMark: Mark = {
    x: rayX,
    y: hover("ray", rayY, Math.max(0.14, rayScale)),
    scale: Math.max(0.14, rayScale),
    who: "ray",
    side: "left",
  };

  // Sunny, over the far horizon, and a very long way away: scale and position
  // are the whole effect. He rises on his own line and does not leave, because
  // something leaving inside the payoff is something happening inside it.
  const sunnyUp = spring({ frame: frame - sunnyFrom, fps, config: { damping: 14, mass: 1.1 } });
  const sunnyAt = limbPoint(960, 540, S31_GLOBE.r1, -2.05);
  const sunnyMark: Mark = {
    x: sunnyAt.x,
    y: hover("sunny", sunnyAt.y - 34 * sunnyUp, 0.19),
    scale: 0.19,
    who: "sunny",
    side: "right",
  };

  return (
    <AbsoluteFill style={{ background: "#050b1d" }}>
      {/* Space comes up *as* the sea goes, rather than sitting underneath it at
          full strength: a still mid-dissolve otherwise has a star field showing
          through the water, which is a double exposure rather than a retreat. */}
      <div style={{ position: "absolute", inset: 0, opacity: clamp01((pull - 0.1) / 0.24) }}>
        <PaintedSky bg="space_stars" drift={0} phase={2.2} />
      </div>

      {/* The sea we are leaving, and the planet we are leaving it for, dissolved
          across each other rather than cut. **The globe cannot simply be there
          from frame one**: at the start of the pull-back its radius is 26000px,
          which is a flat-topped disc filling the bottom two thirds of the frame
          in solid navy — a still of the first pass had it painted straight over
          the sea, Sunny's sinking sliver and all. It is the same object either
          way; what has to fade is which of the two pictures of it we are
          looking at. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - clamp01((pull - 0.13) / 0.2),
          filter: `brightness(${1 - 0.3 * pull})`,
        }}
      >
        <PaintedSky bg="sea_sunset" phase={6.4} drift={SEA_DRIFT} />
        <SideLight horizon={horizon} strength={0.55 * (1 - sink)} />
        <SleepingVolcano x={VOLCANO_AT.x} base={horizon} scale={VOLCANO_AT.scale} phase={0.3} />
        {/* The last sliver: Sunny's crown, going under. */}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${Math.max(0, H - horizon)}px 0)` }}>
          <Sunny
            x={1268}
            y={hover("sunny", horizon + 130 + sink * 190, 0.9)}
            scale={0.9}
            phase={PHASE.sunny}
            emotion="happy"
            look={{ x: -0.3, y: -0.3 }}
            raySpeed={0.08}
            zIndex={12}
          />
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: clamp01((pull - 0.17) / 0.2) }}>
        <Globe cx={960} cy={cy} r={r} spin={spin} phase={phase} dawn={dawn} />
      </div>

      <Ray
        x={rayMark.x}
        y={rayMark.y}
        scale={rayMark.scale ?? 1}
        brightness={RAY_LIGHT.full}
        spectrum={RAY_SPECTRUM.afterRainbow}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        look={pull > 0.5 ? { x: -0.3, y: 0.2 } : { x: -0.2, y: -0.6 }}
        streak={0.4}
        // He never goes out. At the far end of the pull-back he is one glint on
        // the edge of a turning planet, which is what the line says he is.
        opacity={1}
        zIndex={26}
      />

      <div style={{ opacity: Math.max(0, Math.min(1, sunnyUp * 1.4)) }}>
        <Sunny
          x={sunnyMark.x}
          y={sunnyMark.y}
          scale={0.19}
          phase={PHASE.sunny}
          emotion="excited"
          speaking={stage.speaking("sunny")}
          look={{ x: 0.3, y: 0.2 }}
          raySpeed={0.24}
          zIndex={24}
        />
      </div>

      <Bubbles
        scene={scene}
        cast={{ ray: rayMark } as Cast}
        text={S31_BUBBLES}
        fontSize={kidType.bubbleSmall}
        maxWidth={560}
        at={{
          a3_27_ray: { x: 700, y: 300, tail: "right", tailAt: rayMark.x },
          a3_29_ray: { x: 700, y: 236, tail: "right", tailAt: rayMark.x },
        }}
      />
      {/* Sunny's own pass, at his own size. **Distance is staged, and a bubble
          is part of the staging**: the same text in the same house bubble at
          the same size as the near character's is a man standing next to you,
          whatever his body is doing. Small type, narrow box, out in the star
          field beside a sun the size of a pea. No audio processing anywhere —
          it is the identical recording of `a1_03_sunny` and it has to stay
          identical, so the whole of "from over the far horizon" has to be
          carried by the picture. */}
      {/* …and it is **gone before the payoff opens**. `SpeechBubble` springs
          back out over the frames *after* its `until`, and `until` here is the
          last frame of Sunny's line — which is the first frame of the
          seventy-five. A still at 19495 caught a shrinking bubble sitting
          inside the ending. The wrapper takes it out over the last eight frames
          of his own line instead, so the beat opens on a clean frame. */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp01((frame - (sunnyTo - 8)) / 8) }}>
        <Bubbles
          scene={scene}
          cast={{ sunny: sunnyMark } as Cast}
          text={S31_BUBBLES}
          fontSize={kidType.min}
          maxWidth={380}
          at={{
            a3_31_sunny: {
              x: Math.max(400, sunnyMark.x - 300),
              y: sunnyAt.y - 190,
              tail: "right",
              tailAt: sunnyMark.x,
            },
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/**
 * A point on the limb of the globe, at `a` radians from straight up. Used for
 * both the glint Ray becomes and the corner of the world Sunny is shouting
 * from, so the two are on the same circle and cannot drift apart.
 */
function limbPoint(cx: number, cy: number, r: number, a: number): { x: number; y: number } {
  return { x: cx + Math.sin(a) * r, y: cy - Math.cos(a) * r };
}

/**
 * The planet: a night side, a day side, a terminator that slides, and a rim of
 * atmosphere that is **the thing the whole episode has been about** — the blue
 * is not painted on the planet, it is the shell of air round it catching light.
 *
 * `dawn` grows the blue on the leading limb: the new morning coming up on the
 * far side, which is the last thing that happens in the story and the only
 * thing that moves inside the 75-frame silence.
 */
const Globe: React.FC<{
  cx: number;
  cy: number;
  r: number;
  spin: number;
  /** Terminator position in cosine space, -1..1. See the note at the call. */
  phase: number;
  dawn: number;
}> = ({ cx, cy, r, spin, phase, dawn }) => {
  // The lit crescent, as a moon-phase path: one semicircle plus one elliptical
  // arc whose horizontal semi-axis is |phase| × r. Sweeping that number through
  // zero is a terminator sliding across a sphere, and it is the only honest way
  // to do it in two dimensions.
  const k = Math.abs(phase) * r;
  const sweep = phase > 0 ? 1 : 0;
  const day =
    `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r}` +
    ` A ${k} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`;
  const id = Math.round(r);
  const clip = `a3-globe-${id}`;
  const dayClip = `a3-globeday-${id}`;
  // Land rides round with the spin; two copies half a world apart, so the limb
  // that is turning into view always has something on it.
  const roll = ((spin * 2 * r) % (2 * r)) - r;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 14 }}
    >
      <defs>
        <clipPath id={clip}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <clipPath id={dayClip}>
          <path d={day} />
        </clipPath>
      </defs>
      {/* The air, seen edge on. This is the whole episode in one shape: the
          blue is not painted on the planet, it is the shell of air round it
          catching light. */}
      <circle cx={cx} cy={cy} r={r + Math.max(9, r * 0.05)} fill={kidTheme.skyTop} opacity={0.2 + 0.28 * dawn} />
      <g clipPath={`url(#${clip})`}>
        {/* Night: the ocean and the land are both still there, just unlit —
            which is the same claim Scene 6 made with a grey garden. */}
        <circle cx={cx} cy={cy} r={r} fill="#14224a" />
        {[0, 1].map((c) => (
          <g key={c} transform={`translate(${roll + c * 2 * r - r} 0)`}>
            <Continents cx={cx} cy={cy} r={r} fill="#25406a" />
          </g>
        ))}
        {/* Day, clipped to the lit crescent. */}
        <g clipPath={`url(#${dayClip})`}>
          <circle cx={cx} cy={cy} r={r} fill="#2f7fd0" />
          {[0, 1].map((c) => (
            <g key={c} transform={`translate(${roll + c * 2 * r - r} 0)`}>
              <Continents cx={cx} cy={cy} r={r} fill="#5cb765" />
            </g>
          ))}
        </g>
        {/* The terminator's own warm edge. */}
        <path d={day} fill="none" stroke={kidTheme.sunLight} strokeWidth={Math.max(2, r * 0.016)} opacity={0.55} />
      </g>
      {/* The morning rim: blue coming up on the far limb, and the only thing
          that changes inside the 75-frame payoff. */}
      <circle
        cx={cx}
        cy={cy}
        r={r + Math.max(5, r * 0.026)}
        fill="none"
        stroke={kidTheme.skyMid}
        strokeWidth={Math.max(3, r * 0.03)}
        opacity={0.3 + 0.55 * dawn}
        strokeDasharray={`${r * 1.9} ${r * 4.4}`}
        strokeDashoffset={r * 3.15}
      />
    </svg>
  );
};

/** Simple land shapes on the globe, sized off its radius. */
const Continents: React.FC<{ cx: number; cy: number; r: number; fill: string }> = ({
  cx,
  cy,
  r,
  fill,
}) => (
  <g fill={fill} opacity={0.95}>
    <path
      d={
        `M ${cx - r * 0.62} ${cy - r * 0.36} q ${r * 0.24} ${-r * 0.16} ${r * 0.42} ${r * 0.04}` +
        ` q ${r * 0.12} ${r * 0.16} ${-r * 0.06} ${r * 0.26}` +
        ` q ${-r * 0.24} ${r * 0.1} ${-r * 0.36} ${-r * 0.06} Z`
      }
    />
    <path
      d={
        `M ${cx - r * 0.3} ${cy + r * 0.1} q ${r * 0.16} ${-r * 0.04} ${r * 0.2} ${r * 0.14}` +
        ` q ${r * 0.02} ${r * 0.3} ${-r * 0.14} ${r * 0.4}` +
        ` q ${-r * 0.14} ${-r * 0.14} ${-r * 0.12} ${-r * 0.3} Z`
      }
    />
    <path
      d={
        `M ${cx + r * 0.16} ${cy - r * 0.5} q ${r * 0.3} ${-r * 0.06} ${r * 0.42} ${r * 0.16}` +
        ` q ${r * 0.06} ${r * 0.24} ${-r * 0.16} ${r * 0.3}` +
        ` q ${-r * 0.26} ${r * 0.02} ${-r * 0.34} ${-r * 0.16} Z`
      }
    />
    <ellipse cx={cx + r * 0.44} cy={cy + r * 0.42} rx={r * 0.15} ry={r * 0.1} transform={`rotate(-18 ${cx + r * 0.44} ${cy + r * 0.42})`} />
    <ellipse cx={cx - r * 0.02} cy={cy + r * 0.62} rx={r * 0.22} ry={r * 0.09} />
  </g>
);

// ---------------------------------------------------------------------------

export const ACT3_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s25_sea_sunset: SeaSunsetScene,
  s26_volcano: VolcanoScene,
  s27_long_way: LongWayScene,
  s28_blue_runs_out: BlueRunsOutScene,
  s29_bigword_sunset: BigWordSunsetScene,
  s30_crayon_back: CrayonBackScene,
  s31_round_the_other_side: RoundTheOtherSideScene,
};

/** Re-exported for the recap: Scene 35 is Scene 26's framing, at dusk. */
export { SEA_DUSK_FRAC, SEA_SUNSET_FRAC, MOON_FRAC, SEA_DRIFT, NO_LEAD, clamp01, Globe };
