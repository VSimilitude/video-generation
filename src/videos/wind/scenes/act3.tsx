import React from "react";
import {
  Cloudia,
  Drip,
  Puff,
  Sunny,
  kidEase,
  kidTheme,
  mixHex,
  moveAlong,
  settleWave,
} from "../../../lib/kid";
import {
  ACT_COLOR,
  AbsoluteFill,
  AirArcs,
  Beetle,
  BigWordBeat,
  CloudiaHat,
  Bubbles,
  Camera,
  CutFlash,
  Hill,
  KidContactShadow,
  Kite,
  KidSilhouette,
  KiteString,
  PAINTED_GREEN,
  PHASE,
  PUFF_OPACITY,
  PaintedSky,
  Thermometer,
  WIDE,
  WideLayer,
  airBlobPath,
  heldBeat,
  hillY,
  hover,
  interpolate,
  kidHand,
  lineProgress,
  lineWindow,
  spring,
  stand,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cam,
  type Cast,
  type KidPlacement,
  type Mark,
  type SpeakerVisual,
  type TimedScene,
} from "./common";
import { HILL_MARKS } from "./coldOpen";

// ACT THREE — AIR WITH A JOB. Scenes 23–32 of script.md: the beach, the sea
// breeze, four jobs, and the kite.
//
// The act has two geographies and one rule.
//
//   The beach (Scenes 23–27) is one drawn place — sea in the upper left, sand
//   in the lower right, one shoreline running between them — so that "the wind
//   comes in off the water" is a *direction on screen* four scenes running,
//   exactly as Act Two staged its FWOOSH sideways. Everything is derived from
//   `shoreX()`, so nudging the shoreline moves the sea, the sand, the foam and
//   the diagram together.
//
//   The hill (Scenes 31–32) is the cold open's hill, from `HILL_MARKS` in
//   coldOpen.tsx — same crest, same kid, same kite, same camera. Not a
//   look-alike: the same numbers. The frame story closes by the audience
//   recognising a picture they saw ten minutes ago, and a redraw would only
//   have to be a few pixels out to spend that.
//
//   The rule is Puff's opacity: `PUFF_OPACITY.notSorry` (0.7) through Scene 31,
//   and `.full` from Scene 32 — the first time all episode. Nothing in dialogue
//   ever mentions it, and no scene here invents a number.
//
// Every held beat in the act cuts the `useEmotion` lead to zero (NO_LEAD), per
// script.md's Production notes: the default eight-frame lead lands a reaction
// inside a silence the joke is being held for.

const NO_LEAD = 0;

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------------------
// Air, drawn — the same shape Act Two draws it with
// ---------------------------------------------------------------------------
//
// `airBlobPath` (src/lib/kid/characters/AirBlob.tsx) is the bare silhouette the
// character is built from, without a face. Act Two draws hundreds of them from
// the same function, which is what makes the gap in Scene 25 visibly the same
// hole as the Big Empty in Scene 17, and the cool air off the sea visibly the
// stuff that came rushing in during the FWOOSH. It was written twice — once
// here, once there — and is now the kit's.

// ---------------------------------------------------------------------------
// The beach — one place, shared by Scenes 23 to 27
// ---------------------------------------------------------------------------

/** Sea meets sky here. Above it is sky in every beach scene. */
const HORIZON = 400;

const SHORE_TOP = { x: 430, y: HORIZON } as const;
const SHORE_FOOT = { x: 1210, y: 1180 } as const;

const SAND = "#f3dfae";
const SAND_WET = "#dcbf86";
const SAND_DARK = "#c9a86b";
const SEA_FAR = "#2aa8bd";
const SEA_MID = "#37c2d2";
const SEA_NEAR = "#6fe0dd";

/**
 * The shoreline, as x at a given y. The whole beach is built from this one
 * function: the sea is everything to its left, the sand everything to its
 * right, and the diagram in Scene 25 blows from one to the other.
 *
 * It runs down-right rather than straight across the frame because the sea
 * breeze has to be a *sideways* move on screen — the same staging note Act Two
 * makes about the cool air filling the gap.
 */
function shoreX(y: number): number {
  const u = (y - SHORE_TOP.y) / (SHORE_FOOT.y - SHORE_TOP.y);
  return SHORE_TOP.x + (SHORE_FOOT.x - SHORE_TOP.x) * u + Math.sin(u * 3.1) * 40;
}

function shoreRun(from: number, to: number, step = 48): string {
  const pts: string[] = [];
  for (let y = from; y <= to; y += step) pts.push(`${shoreX(y).toFixed(1)} ${y}`);
  pts.push(`${shoreX(to).toFixed(1)} ${to}`);
  return pts.join(" L ");
}

const BOTTOM = WIDE.y + WIDE.h;
const SEA_PATH = `M ${WIDE.x} ${HORIZON} L ${shoreRun(HORIZON, BOTTOM)} L ${WIDE.x} ${BOTTOM} Z`;
const SAND_PATH = `M ${shoreRun(HORIZON, BOTTOM)} L ${WIDE.x + WIDE.w} ${BOTTOM} L ${WIDE.x + WIDE.w} ${HORIZON} Z`;

/**
 * The beach itself. `swell` is how alive the water is — 1 for an ordinary
 * morning, 0 for Scene 27's dead-flat glassy bay, which has to be flat before
 * the sail can snap.
 */
const BeachWorld: React.FC<{ swell?: number; foam?: number }> = ({
  swell = 1,
  foam = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer>
      {/* Far water, then the body of the sea, then the shallows: three flat
          bands, because a gradient here cannot be matched by anything else in
          the kit (see the flat-fill note in STYLE.md). */}
      <path d={SEA_PATH} fill={SEA_FAR} />
      <path
        d={`M ${WIDE.x} ${HORIZON + 96} L ${shoreRun(HORIZON + 96, BOTTOM)} L ${WIDE.x} ${BOTTOM} Z`}
        fill={SEA_MID}
      />
      <path
        d={`M ${WIDE.x} ${HORIZON + 300} L ${shoreRun(HORIZON + 300, BOTTOM)} L ${WIDE.x} ${BOTTOM} Z`}
        fill={SEA_NEAR}
        opacity={0.85}
      />
      {/* Swell lines. They are the only thing on the water that moves, so they
          are also the whole of "glassy" when `swell` goes to 0. */}
      {Array.from({ length: 9 }, (_, i) => {
        const y = HORIZON + 60 + i * 92;
        const x1 = shoreX(y) - 120;
        const roll = Math.sin(t * 0.9 + i * 0.8) * 26 * swell;
        return (
          <path
            key={i}
            d={`M ${WIDE.x + 60} ${y + roll} Q ${(WIDE.x + x1) / 2} ${y - 22 * swell + roll} ${x1} ${y + roll}`}
            stroke="#ffffff"
            strokeWidth={7 + i}
            strokeLinecap="round"
            fill="none"
            opacity={(0.12 + 0.05 * i) * (0.35 + 0.65 * swell)}
          />
        );
      })}
      {/* Sand, its wet strip, and a scatter of shells and pebbles. */}
      <path d={SAND_PATH} fill={SAND} />
      <path
        d={`M ${shoreRun(HORIZON, BOTTOM)} L ${shoreX(BOTTOM) + 96} ${BOTTOM} L ${shoreX(HORIZON) + 40} ${HORIZON} Z`}
        fill={SAND_WET}
        opacity={0.75}
      />
      {Array.from({ length: 34 }, (_, i) => {
        const y = HORIZON + 60 + ((i * 137) % 900);
        const x = shoreX(y) + 130 + ((i * 271) % 1500);
        const r = 5 + (i % 4) * 4;
        return (
          <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.6} fill={SAND_DARK} opacity={0.45} />
        );
      })}
      {/* Foam, riding up and down the shoreline. */}
      {foam > 0
        ? Array.from({ length: 26 }, (_, i) => {
            const y = HORIZON + 20 + i * 44;
            const push = (Math.sin(t * 0.8 + i * 0.5) * 0.5 + 0.5) * 26 * foam;
            return (
              <ellipse
                key={i}
                cx={shoreX(y) + push}
                cy={y}
                rx={40 + (i % 3) * 14}
                ry={13}
                fill="#ffffff"
                opacity={0.62 * foam}
                transform={`rotate(43 ${shoreX(y)} ${y})`}
              />
            );
          })
        : null}
    </WideLayer>
  );
};

/** Gulls, hanging motionless — there is no wind here until Puff arrives. */
const Gulls: React.FC<{ lift?: number }> = ({ lift = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer>
      {[
        [300, 190, 1],
        [640, 130, 0.8],
        [1520, 226, 0.9],
      ].map(([x, y, s], i) => {
        const bob = Math.sin(t * 0.7 + i) * 6 + lift * -40;
        return (
          <path
            key={i}
            transform={`translate(${x} ${(y as number) + bob}) scale(${s})`}
            d="M -46 0 q 24 -22 46 0 q 22 -22 46 0"
            stroke={kidTheme.inkSoft}
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
            opacity={0.75}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// The sleeping volcano — a running gag that has not started yet
// ---------------------------------------------------------------------------
//
// A small island out on the sea horizon with a face on it, fast asleep. It is
// never mentioned: no line, no bubble, no narration, no reaction anywhere in
// the episode except one four-frame flick of Puff's eyes in Scene 23. The plan
// is that it is asleep in the background of every coastal scene the series ever
// shoots, until the episode where it wakes up.
//
// Which makes the direction here entirely about restraint:
//
//   - **It must read as a character, not a mountain.** Closed happy eyes and a
//     small smile, or it is scenery and there is no gag to pay off later.
//   - **It must not compete.** Low contrast against the sea (a dusty warm dark,
//     not ink), no outline, and small — 176px wide against a 1920 frame, which
//     is about the size of the gulls.
//   - **It is a place, so it does not move between shots.** Same `x`, same
//     `scale` in every scene it appears; only the horizon it sits on changes,
//     because Scene 23 draws its own horizon at `HORIZON` and Scene 24's is the
//     painted one in `beach_wide`.
//
// The snore is the whole performance: a slow breath and a smoke ring out of the
// crater on a 3s loop, deterministic from the frame like everything else in the
// kit, `phase` per scene so two shots do not snore in lockstep.

/** Half-width, height and crater width of the island at `scale` 1. */
const VOLCANO = { halfW: 88, h: 108, crater: 18 };
/** One snore: breath in, ring out. Seconds. */
const SNORE = 3;
/**
 * How long a ring lives after it leaves the crater. Seconds. Shorter than the
 * snore on purpose — a ring still climbing when the next one appears reads as a
 * chimney, and a ring that has drifted a long way from the crater reads as a
 * stray halo in the sky rather than as something this island did.
 */
const SNORE_RING_LIFE = 2;

/**
 * Warm and dark, but nowhere near ink, and then hazed a fifth of the way back
 * towards the sky: the first pass was #604b4e and read as a sticker stuck on
 * the horizon rather than as something a long way off.
 */
const VOLCANO_BODY = mixHex(mixHex(kidTheme.ink, "#c2705a", 0.38), kidTheme.skyLow, 0.24);
/** The face, pale enough to read on the silhouette and no paler. */
const VOLCANO_FACE = mixHex(VOLCANO_BODY, kidTheme.paper, 0.52);

/**
 * The island itself. `base` is the horizon line it sits on — the shape's
 * baseline is y=0 in its own coordinates, so it seats exactly on that line
 * rather than floating above it or cutting into the water.
 */
const SleepingVolcano: React.FC<{
  x: number;
  base: number;
  scale?: number;
  phase?: number;
}> = ({ x, base, scale = 1, phase = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase * SNORE;

  // One breath per snore, and the ring leaves the crater at the top of it.
  const breath = Math.sin((t / SNORE) * Math.PI * 2);
  const sy = 1 - 0.03 * breath;
  const sx = 1 + 0.022 * breath;

  // The last two rings emitted. Deterministic from the frame: ring `k` left the
  // crater at t = k * SNORE, so nothing here remembers anything.
  const newest = Math.floor(t / SNORE);

  const { halfW, h, crater } = VOLCANO;
  return (
    <WideLayer>
      <g transform={`translate(${x} ${base}) scale(${scale})`} opacity={0.92}>
        {/* Haze where the island meets the water. Ink at low alpha rather than
            a sea colour, because the same component sits on the drawn horizon
            in Scene 23 and the painted one in Scene 24. */}
        <ellipse cx={0} cy={0} rx={halfW * 1.08} ry={6} fill={kidTheme.ink} opacity={0.16} />
        <g transform={`scale(${sx} ${sy})`}>
          <path
            d={
              `M ${-halfW} 0` +
              ` C ${-halfW * 0.66} ${-h * 0.32} ${-halfW * 0.39} ${-h * 0.7} ${-crater} ${-h}` +
              ` Q 0 ${-h * 0.87} ${crater} ${-h}` +
              ` C ${halfW * 0.39} ${-h * 0.7} ${halfW * 0.66} ${-h * 0.32} ${halfW} 0 Z`
            }
            fill={VOLCANO_BODY}
          />
          {/* One lit flank, so it has a shape instead of being a cut-out. */}
          <path
            d={
              `M ${-halfW} 0` +
              ` C ${-halfW * 0.66} ${-h * 0.32} ${-halfW * 0.39} ${-h * 0.7} ${-crater} ${-h}` +
              ` L ${-crater * 0.2} ${-h * 0.9} L ${-halfW * 0.42} 0 Z`
            }
            fill={mixHex(VOLCANO_BODY, kidTheme.sunLight, 0.16)}
            opacity={0.7}
          />
          {/* The face. Closed, content, and the only reason this is a gag. */}
          <g
            stroke={VOLCANO_FACE}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            opacity={0.8}
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
          // 62, not the 104 of the first pass: at 104 the ring topped out level
          // with the gull at x=300 in `Gulls`, and two unrelated small things at
          // the same height read as one cluttered corner.
          const rise = kidEase.easeOutSine(u) * 62;
          const rx = 11 + u * 24;
          return (
            <ellipse
              key={k}
              cx={u * 30 + Math.sin(u * 3.4 + k) * 6}
              cy={-h - 4 - rise}
              rx={rx}
              ry={rx * 0.44}
              fill="none"
              stroke={VOLCANO_FACE}
              strokeWidth={7 * (1 - u * 0.55)}
              opacity={0.55 * Math.min(1, u * 7) * (1 - u) ** 1.2}
            />
          );
        })}
      </g>
    </WideLayer>
  );
};

/**
 * Where it is. Far enough left to be over open water in Scene 23 — the sea only
 * touches the sky left of `shoreX(HORIZON)` (x≈430) in that geography — and far
 * enough from the gull at x=300 that the two never overlap.
 */
const VOLCANO_AT = { x: 232, scale: 1 };

// ---------------------------------------------------------------------------
// Scene 23 — The beach
// ---------------------------------------------------------------------------

const S23_SCALE = 1.05;
/** Where he ends up, on dry sand, well clear of the shoreline. */
const S23_MARK = { x: 1330, y: 690 };
/** The flight, then the skid. Both inside the first narration line. */
const S23_FLY = { from: 24, to: 96 };
const S23_SKID = { from: 96, to: 126 };

/**
 * The one glance at the volcano, and the only acknowledgement it gets all
 * episode. It has to be over before he speaks — a3_02 starts at frame 134 — and
 * it cannot start before the skid has visibly stopped, which by frame 114 it
 * has (`easeOutQuad` is 84% of the way there by then and decelerating hard).
 * That leaves twenty frames: six to swing the pupils across from the sand, nine
 * holding, five back to camera, and two frames of air before the line.
 *
 * No emotion change, no bubble, no beat: he notices something and lets it go.
 */
const S23_GLANCE = { from: 114, hold: 120, release: 129, to: 134 };

const S23_BUBBLES: Record<string, string> = {
  a3_02_puff: "I have never been ANYWHERE!",
  a3_04_puff: "The beach MAKES wind?",
};

const BeachScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();

  // The wipe. The scene before this one is Puff alone against open sky, so the
  // sky carries across the cut and only the ground is new — which is what makes
  // it read as a wipe rather than as a dissolve to a different show.
  const wipe = kidEase.easeInOutSine(frame / 22);

  // First self-powered travel in the episode: he arrives at speed from frame
  // left, on an arc, banked into it, and skids.
  const flyU = (frame - S23_FLY.from) / (S23_FLY.to - S23_FLY.from);
  const fly = moveAlong({ x: -340, y: 430 }, { x: 1075, y: 646 }, flyU, {
    arc: 0.14,
    bias: 0.86,
    ease: kidEase.easeOutSine,
  });
  const skidU = kidEase.easeOutQuad((frame - S23_SKID.from) / (S23_SKID.to - S23_SKID.from));
  const x = frame < S23_SKID.from ? fly.x : fly.x + (S23_MARK.x - fly.x) * skidU;
  const yc = frame < S23_SKID.from ? fly.y : fly.y + (S23_MARK.y - fly.y) * skidU;
  // The bank comes off the path itself and unwinds through the skid.
  const bank = frame < S23_SKID.from ? fly.angle * 0.5 : fly.angle * 0.5 * (1 - skidU);
  const settle = frame >= S23_SKID.to ? settleWave((frame - S23_SKID.to) / 26, 1.2, 4) : 0;

  const emotion = useEmotion(
    scene,
    "puff",
    { a3_02_puff: "excited", a3_04_puff: "amazed" },
    "happy",
  );

  const puffY = hover("puff", yc + settle * 10, S23_SCALE);
  const mark: Mark = { x, y: puffY, scale: S23_SCALE, who: "puff", side: "left" };

  // Up and a long way left, from where he lands. The rig clamps to -1..1, so
  // this is a direction and not a distance.
  const glance =
    frame < S23_GLANCE.from || frame >= S23_GLANCE.to
      ? 0
      : frame < S23_GLANCE.hold
        ? kidEase.easeInOutSine((frame - S23_GLANCE.from) / (S23_GLANCE.hold - S23_GLANCE.from))
        : frame < S23_GLANCE.release
          ? 1
          : 1 -
            kidEase.easeInOutSine(
              (frame - S23_GLANCE.release) / (S23_GLANCE.to - S23_GLANCE.release),
            );
  const restLook = frame < S23_SKID.to ? { x: 1, y: 0 } : { x: 0, y: 0 };
  const look =
    glance > 0
      ? {
          x: restLook.x + (-1 - restLook.x) * glance,
          y: restLook.y + (-0.34 - restLook.y) * glance,
        }
      : frame < S23_SKID.to
        ? ("right" as const)
        : ("camera" as const);

  return (
    <AbsoluteFill>
      <PaintedSky bg="beach_wide" phase={0.5} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>
        <BeachWorld />
        {/* Part of the world, so it wipes in with the ground rather than being
            revealed on top of it. */}
        <SleepingVolcano x={VOLCANO_AT.x} base={HORIZON} scale={VOLCANO_AT.scale} phase={0} />
        <Gulls />
      </div>
      <Puff
        x={x}
        y={puffY}
        scale={S23_SCALE * (1 + settle * 0.06)}
        opacity={PUFF_OPACITY.notSorry}
        phase={PHASE.puff}
        emotion={emotion}
        speaking={useStage(scene).speaking("puff")}
        bank={bank}
        look={look}
        wisps={frame < S23_SKID.to ? 4 : 2}
        idle={frame < S23_SKID.to ? 0.4 : 1.1}
      />
      <SkidSand at={S23_SKID.from} to={S23_MARK} />
      <Bubbles scene={scene} cast={{ puff: mark }} text={S23_BUBBLES} />
    </AbsoluteFill>
  );
};

/** The sand he kicks up on the way in. Each grain is its own little arc. */
const SkidSand: React.FC<{ at: number; to: { x: number; y: number } }> = ({ at, to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - at;
  if (f < 0 || f > fps * 2.2) return null;
  return (
    <WideLayer>
      {Array.from({ length: 22 }, (_, i) => {
        const lead = (i % 6) * 3;
        const u = clamp01((f - lead) / (fps * 1.1));
        if (u <= 0) return null;
        const from = { x: to.x - 210 + (i % 5) * 46, y: to.y + 92 };
        const away = { x: from.x + 190 + ((i * 97) % 300), y: from.y - 20 };
        const p = moveAlong(from, away, u, {
          arc: 0.22 + (i % 4) * 0.06,
          bias: 0.7,
          ease: kidEase.easeOutQuad,
        });
        return (
          <ellipse
            key={i}
            cx={p.x}
            cy={p.y + kidEase.gravity(u) * 90}
            rx={7 + (i % 3) * 3}
            ry={6}
            fill={SAND_DARK}
            opacity={0.8 * (1 - u)}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 24 — Hot sand, cool sea
// ---------------------------------------------------------------------------
//
// Two matched shots and then a split screen, which is the scene's whole
// argument: same sun, same morning, two surfaces, two answers. The matched
// shots are deliberately built from one component with one parameter — if the
// framing of the sand shot and the sea shot differed by so much as a horizon,
// the comparison would be about the pictures instead of about the temperature.

const SURFACE_Y = 690;
/** Puff sits in exactly the same place in both halves of the comparison. */
const S24_PUFF = { x: 880, scale: 1.15 };
/**
 * Where sea meets sky in this shot. Unlike Scene 23 this scene draws no horizon
 * of its own — `Surface` is the near water only — so the line the eye reads is
 * the painted one in `beach_wide`, and the volcano seats on that. Measured off
 * a rendered still rather than guessed: the plate puts it at y=605–606 and
 * drifts it by about a pixel across this scene's sea shot.
 */
const S24_SEA_HORIZON = 606;

const S24_BUBBLES: Record<string, string> = {
  a3_06_puff: "Ow! That sand is HOT.",
  a3_08_puff: "The sea is lovely and cool.",
};

const HotSandCoolSeaScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, sandTo] = lineWindow(scene, "a3_06_puff");
  const [, seaTo] = lineWindow(scene, "a3_08_puff");
  const [splitFrom] = lineWindow(scene, "a3_09_narrator");
  const [beatFrom, beatTo] = heldBeat(scene, "a3_09_narrator");

  // Three phases, cut on the narration: sand, sea, and the two side by side.
  const seaAt = sandTo + 4;
  const splitAt = Math.max(seaTo + 4, splitFrom - 4);
  const onSand = frame < seaAt;
  const onSea = frame >= seaAt && frame < splitAt;
  const onSplit = frame >= splitAt;

  // The thermometers. The sand's races; the sea's barely moves — the fact is
  // the difference between the two, so they are driven from one clock.
  const climb = clamp01((frame - splitAt - 10) / 150);
  const sandLevel = 0.18 + 0.74 * kidEase.easeOutQuad(climb);
  const seaLevel = 0.2 + 0.07 * climb;

  const emotion = useEmotion(
    scene,
    "puff",
    { a3_06_puff: "amazed", a3_08_puff: "happy" },
    "happy",
    // 24f held beat in this scene.
    NO_LEAD,
  );
  const speaking = useStage(scene).speaking("puff");
  const hop = Math.abs(Math.sin(frame * 0.55)) * (onSand ? 1 : 0);
  const sink = onSea ? Math.sin(frame * 0.1) * 7 : 0;

  const puffCentre = SURFACE_Y - 62 - hop * 30 + sink;
  const puffY = hover("puff", puffCentre, S24_PUFF.scale);
  const mark: Mark = {
    x: S24_PUFF.x,
    y: puffY,
    scale: S24_PUFF.scale,
    who: "puff",
    side: "right",
    offset: 380,
  };

  return (
    <AbsoluteFill>
      <PaintedSky bg="beach_wide" phase={1.6} />
      {onSplit ? null : <Surface kind={onSand ? "sand" : "sea"} y={SURFACE_Y} />}
      {onSand ? <HeatShimmer y={SURFACE_Y} /> : null}
      {/* Same island, same x, same size as Scene 23 — the sea shot is the only
          phase of this scene that has a sea horizon to put it on, and the split
          that follows is two thermometers and no room. */}
      {onSea ? (
        <SleepingVolcano
          x={VOLCANO_AT.x}
          base={S24_SEA_HORIZON}
          scale={VOLCANO_AT.scale}
          phase={0.45}
        />
      ) : null}
      {onSea ? <Ripples x={S24_PUFF.x} y={SURFACE_Y - 40} /> : null}

      {/* Tomato red on the sand, cool blue on the sea — done by putting the
          colour *behind* him rather than on him. Puff's vapour is translucent
          by construction (see ALPHA in characters/Puff.tsx), so a coloured blob
          under the body reads through it while his face core, which is nearly
          opaque, stays pale and legible. A CSS filter was the first attempt and
          it turned his tongue green: hue-rotate cannot tell the difference
          between the body and the eyes. */}
      {onSplit ? null : (
        <>
          <TintBehind
            x={S24_PUFF.x}
            y={puffCentre}
            scale={S24_PUFF.scale}
            color={onSand ? kidTheme.tomato : kidTheme.water}
            strength={onSand ? 0.85 : 0.7}
          />
          <Puff
            x={S24_PUFF.x}
            y={puffY}
            scale={S24_PUFF.scale}
            opacity={PUFF_OPACITY.notSorry}
            phase={PHASE.puff}
            emotion={emotion}
            speaking={speaking}
            look={onSand ? "down" : "upRight"}
            idle={onSand ? 1.8 : 0.5}
            wisps={onSand ? 3 : 1}
          />
        </>
      )}

      {onSplit ? (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
            <Surface kind="sand" y={SURFACE_Y} />
            <HeatShimmer y={SURFACE_Y} />
          </div>
          <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: -960, top: 0, width: 1920, height: 1080 }}>
              <Surface kind="sea" y={SURFACE_Y} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 954, top: 0, width: 12, height: 1080, background: kidTheme.ink }} />
          <Thermometer x={430} y={640} level={sandLevel} scale={0.92} label="SAND" />
          <Thermometer x={1490} y={640} level={seaLevel} scale={0.92} label="SEA" />
          {/* One sun over both halves, straddling the seam. It is the same sun;
              that is the entire point of the comparison. */}
          <Sunny
            x={960}
            y={150}
            scale={0.44}
            phase={PHASE.sunny}
            emotion="proud"
            look={{ x: 0, y: 0.5 }}
            raySpeed={0.12}
          />
        </>
      ) : null}

      {frame >= seaAt && frame < seaAt + 8 ? <CutFlash at={seaAt} strength={0.35} /> : null}
      {frame >= splitAt && frame < splitAt + 8 ? <CutFlash at={splitAt} strength={0.35} /> : null}
      {/* The 24f beat is two thermometers and no voice. Nothing is scheduled
          inside [beatFrom, beatTo): the only thing still moving is the sand's
          mercury, which is the thing being looked at. */}
      <Bubbles scene={scene} cast={{ puff: mark }} text={S24_BUBBLES} />
    </AbsoluteFill>
  );
};

/** A flat surface filling the bottom of frame: sand, or sea. */
const Surface: React.FC<{ kind: "sand" | "sea"; y: number }> = ({ kind, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sand = kind === "sand";
  return (
    <WideLayer>
      <path
        d={`M ${WIDE.x} ${y} Q 960 ${y - 26} ${WIDE.x + WIDE.w} ${y} L ${WIDE.x + WIDE.w} ${BOTTOM} L ${WIDE.x} ${BOTTOM} Z`}
        fill={sand ? SAND : SEA_MID}
      />
      <path
        d={`M ${WIDE.x} ${y + 70} Q 960 ${y + 44} ${WIDE.x + WIDE.w} ${y + 70} L ${WIDE.x + WIDE.w} ${BOTTOM} L ${WIDE.x} ${BOTTOM} Z`}
        fill={sand ? SAND_WET : SEA_NEAR}
        opacity={sand ? 0.5 : 0.75}
      />
      {sand
        ? Array.from({ length: 40 }, (_, i) => {
            const px = -300 + i * 62 + ((i * 91) % 40);
            const py = y + 40 + ((i * 137) % 330);
            return (
              <ellipse key={i} cx={px} cy={py} rx={7 + (i % 3) * 4} ry={5} fill={SAND_DARK} opacity={0.4} />
            );
          })
        : Array.from({ length: 10 }, (_, i) => {
            const py = y + 30 + i * 74;
            const drift = Math.sin(t * 0.8 + i) * 20;
            return (
              <path
                key={i}
                d={`M -300 ${py + drift} Q 960 ${py - 18 + drift} 2220 ${py + drift}`}
                stroke="#ffffff"
                strokeWidth={6 + i}
                fill="none"
                strokeLinecap="round"
                opacity={0.16}
              />
            );
          })}
    </WideLayer>
  );
};

/**
 * A colour laid under Puff, for the two shots where the script says he changes
 * temperature. It is a blob roughly his own size, drawn behind him and moving
 * on his breath — see the note at the call site for why it is not a filter.
 */
const TintBehind: React.FC<{
  x: number;
  y: number;
  scale: number;
  color: string;
  strength: number;
}> = ({ x, y, scale, color, strength }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const wob = 1 + Math.sin(t * 2.6) * 0.03;
  return (
    <WideLayer>
      <ellipse
        cx={x}
        cy={y}
        rx={112 * scale * wob}
        ry={96 * scale * (2 - wob)}
        fill={color}
        opacity={strength}
      />
    </WideLayer>
  );
};

/** Heat coming off hot sand: the air itself, wobbling. */
const HeatShimmer: React.FC<{ y: number }> = ({ y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer>
      {Array.from({ length: 16 }, (_, i) => {
        const x = -240 + i * 150;
        const rise = ((t * 42 + i * 37) % 240) / 240;
        return (
          <path
            key={i}
            d={
              `M ${x} ${y - rise * 210}` +
              ` q ${18 * Math.sin(t * 3 + i)} -34 0 -68` +
              ` q ${-18 * Math.sin(t * 3 + i)} -34 0 -68`
            }
            stroke="#ff8b7d"
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
            opacity={0.62 * Math.sin(rise * Math.PI)}
          />
        );
      })}
    </WideLayer>
  );
};

/** Rings on the water under a Puff who is sitting on it. */
const Ripples: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer>
      {[0, 1, 2].map((i) => {
        const u = ((t * 0.4 + i / 3) % 1);
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={90 + u * 320}
            ry={22 + u * 76}
            fill="none"
            stroke="#ffffff"
            strokeWidth={8 * (1 - u)}
            opacity={0.5 * (1 - u)}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 25 — The beach makes its own wind
// ---------------------------------------------------------------------------
//
// Act Two's gap diagram, rebuilt on the beach and colour-matched to it: warm
// orange off the sand, the outlined gap it leaves, cool blue in off the sea.
// Same three shapes, same order, new place — which is how a rule stops being a
// story about one puff and starts explaining places.

const GAP = { x: 1330, y: 742 };
const S25_PUFF = { x: 690, y: 560, scale: 1.05 };

const S25_BUBBLES: Record<string, string> = {
  a3_12_puff: "That leaves a GAP!",
  a3_14_puff: "FWOOSH! Off the sea!",
};

const BeachMakesWindScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [warmFrom, warmTo] = lineWindow(scene, "a3_11_narrator");
  const [coolFrom] = lineWindow(scene, "a3_13_narrator");

  // The gap opens *before* the Narrator finishes the sentence, and Puff points
  // at it a beat later — the comprehension check script.md asks for, played as
  // the hero getting there first rather than as a question to the audience.
  const gapAt = Math.round(warmFrom + (warmTo - warmFrom) * 0.66);
  const pointAt = gapAt + 14;
  const rise = clamp01((frame - warmFrom - 12) / 40);
  const gapOpen = clamp01((frame - gapAt) / 16);
  const coolAt = coolFrom + 18;
  const fill = clamp01((frame - coolAt - 120) / 90);

  const emotion = useEmotion(
    scene,
    "puff",
    { a3_12_puff: "excited", a3_14_puff: "excited" },
    "happy",
  );

  const puffY = hover("puff", S25_PUFF.y, S25_PUFF.scale);
  const mark: Mark = {
    x: S25_PUFF.x,
    y: puffY,
    scale: S25_PUFF.scale,
    who: "puff",
    side: "left",
    offset: 360,
  };

  return (
    <AbsoluteFill>
      <PaintedSky bg="beach_wide" phase={2.7} />
      <BeachWorld />
      {/* Same beach world, same framing as Scene 23 — so the sleeping volcano
          must still be there (a background character that vanishes between
          shots breaks the one-world rule the series gag depends on). */}
      <SleepingVolcano x={VOLCANO_AT.x} base={HORIZON} scale={VOLCANO_AT.scale} phase={0} />
      <Gulls lift={clamp01((frame - coolAt) / 60) * 0.4} />

      {/* 1. Warm air rising off the hot sand. Orange, because the sand is what
             heated it — the colour is the argument. */}
      <WarmRise x={GAP.x} strength={rise} />
      {/* 2. The gap it leaves behind, outlined, in the sand's own darker shade. */}
      <GapOnTheSand open={gapOpen * (1 - fill)} />
      {/* 3. Cool air, in off the sea, sideways. Never falling in from above. */}
      <CoolInflow at={coolAt} />

      <Puff
        x={S25_PUFF.x}
        y={puffY}
        scale={S25_PUFF.scale}
        opacity={PUFF_OPACITY.notSorry}
        phase={PHASE.puff}
        emotion={emotion}
        speaking={useStage(scene).speaking("puff")}
        pose={frame >= pointAt ? "point" : "rest"}
        look={frame >= pointAt ? { x: 0.9, y: 0.5 } : { x: 0.6, y: -0.2 }}
        idle={0.9}
      />
      <Bubbles scene={scene} cast={{ puff: mark }} text={S25_BUBBLES} />
    </AbsoluteFill>
  );
};

/** Warm air leaving the sand: fat orange puffs and the arrows they travel on. */
const WarmRise: React.FC<{ x: number; strength: number }> = ({ x, strength }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (strength <= 0.01) return null;
  return (
    <WideLayer>
      {Array.from({ length: 7 }, (_, i) => {
        const u = ((t * 0.34 + i / 7) % 1);
        const px = x - 150 + ((i * 83) % 300) + Math.sin(u * 4 + i) * 34;
        const py = GAP.y - u * 620;
        const r = (30 + u * 40) * (1 - u * 0.5);
        // In and gone, rather than in and faded: warm yellow held at a low
        // alpha over a blue sky goes grey-green, which read as a mouldy egg on
        // the first pass. Nothing here is allowed to sit at 30%.
        const fade = u < 0.12 ? u / 0.12 : Math.max(0, 1 - (u - 0.12) / 0.55) ** 1.6;
        return (
          <g key={i} transform={`translate(${px} ${py})`} opacity={strength * fade}>
            <path d={airBlobPath(r, t, i)} fill={kidTheme.sun} />
            <path d={airBlobPath(r, t, i)} fill="none" stroke={kidTheme.sunDark} strokeWidth={7} />
          </g>
        );
      })}
      {[0, 1, 2].map((i) => {
        const u = ((t * 0.4 + i / 3) % 1);
        const py = GAP.y - 60 - u * 620;
        return (
          <path
            key={`a${i}`}
            transform={`translate(${x} ${py})`}
            d="M -34 44 L 0 -34 L 34 44 L 12 34 L 12 96 L -12 96 L -12 34 Z"
            fill={kidTheme.sunDark}
            stroke={kidTheme.ink}
            strokeWidth={6}
            strokeLinejoin="round"
            opacity={strength * Math.sin(u * Math.PI) * 0.8}
          />
        );
      })}
    </WideLayer>
  );
};

/**
 * The Big Empty, on a beach. Outlined and slightly darker than the sand around
 * it, with grains leaning in over the lip — an emptiness has no edges of its
 * own to catch a six-year-old's eye, so it is given some.
 */
const GapOnTheSand: React.FC<{ open: number }> = ({ open }) => {
  const frame = useCurrentFrame();
  if (open <= 0.01) return null;
  const s = kidEase.easeOutBack(open, 1.2);
  return (
    <WideLayer opacity={Math.min(1, open * 1.4)}>
      <g transform={`translate(${GAP.x} ${GAP.y}) scale(${s})`}>
        {/* The same outline the Big Empty is drawn with in Act Two: a hole in
            the world exactly the shape of the air that used to be in it. */}
        <path d={airBlobPath(178, frame / 30, 3)} fill={SAND_DARK} opacity={0.9} />
        <path d={airBlobPath(150, frame / 30, 3)} fill="#a98d55" opacity={0.55} />
        <path
          d={airBlobPath(178, frame / 30, 3)}
          fill="none"
          stroke={kidTheme.ink}
          strokeWidth={9}
          strokeDasharray="34 20"
          strokeDashoffset={-frame * 0.5}
          opacity={0.7}
        />
        {/* Grains tipping in over the lip. */}
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <ellipse
              key={i}
              cx={Math.cos(a) * 206}
              cy={Math.sin(a) * 132}
              rx={9}
              ry={6}
              fill={SAND_DARK}
              opacity={0.6}
            />
          );
        })}
      </g>
    </WideLayer>
  );
};

/** Cool air arriving off the sea, horizontally, and filling the hole. */
const CoolInflow: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - at;
  if (f < 0) return null;
  return (
    <WideLayer>
      {Array.from({ length: 11 }, (_, i) => {
        const u = (((f / (fps * 2.6)) + i / 11) % 1);
        // Three lanes, all of them *below* Puff's face and all of them level:
        // the sideways-ness is the fact this scene is teaching, so nothing here
        // is allowed to drift downward into the gap from above.
        const from = { x: -280, y: 690 + (i % 3) * 106 };
        const p = moveAlong(from, { x: GAP.x - 30, y: GAP.y - 20 }, u, {
          arc: 0.04,
          ease: kidEase.linear,
        });
        const r = 52 - u * 16;
        return (
          <g key={i} opacity={Math.min(1, f / 20) * (u > 0.94 ? (1 - u) / 0.06 : 1)}>
            <path
              d={`M ${p.x - r - 150} ${p.y - 10} q 70 -14 130 -4`}
              stroke={kidTheme.airDeep}
              strokeWidth={9}
              strokeLinecap="round"
              fill="none"
              opacity={0.5}
            />
            <g transform={`translate(${p.x} ${p.y})`}>
              <path d={airBlobPath(r, f / fps, i)} fill={kidTheme.airCool} />
              <path d={airBlobPath(r, f / fps, i)} fill="none" stroke={kidTheme.airDeep} strokeWidth={7} />
            </g>
          </g>
        );
      })}
    </WideLayer>
  );
};

/** The picture Scene 26 freezes: the sea breeze, blowing. */
const SeaBreezeShot: React.FC = () => (
  <AbsoluteFill>
    <PaintedSky bg="beach_wide" phase={3.8} />
    <BeachWorld />
    {/* No volcano here, and it was tried: `WaveTrim` lays a scalloped band of
        sea from y≈170 to y≈450 across the full width on the slam and never
        lifts it, so the island shows for the first seven seconds of the scene
        and is under the card's trim for the remaining fifteen. Two beach scenes
        it is continuously in beat three it flickers through. */}
    <Gulls lift={0.4} />
    <WarmRise x={GAP.x} strength={1} />
    <CoolInflow at={-90} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Scene 26 — Big Word Three: SEA BREEZE
// ---------------------------------------------------------------------------

const S26_CARD_Y = 300;
const S26_PUFF = { x: 360, y: 806, scale: 0.8 };
const S26_SUNNY = { x: 1560, y: 216, scale: 0.95 };

const BigWordSeaBreezeScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [breezeFrom, breezeTo] = lineWindow(scene, "a3_17_narrator");
  const [sunnyFrom] = lineWindow(scene, "a3_19_sunny");
  // The freeze lands on the words "a sea breeze" at the end of a3_17.
  const slamAt = Math.round(breezeFrom + (breezeTo - breezeFrom) * 0.84);

  // Sunny leans in from the top corner, uninvited, over a card that is not
  // about him. He arrives on his own line — never inside the held beat after it.
  const lean = kidEase.easeOutBack(clamp01((frame - sunnyFrom + 10) / 24), 1.15);

  const emotion = useEmotion(
    scene,
    "puff",
    { a3_18_puff: "excited" },
    "happy",
    // 30f held beat in this scene.
    NO_LEAD,
  );
  const stage = useStage(scene);

  const puffY = hover("puff", S26_PUFF.y, S26_PUFF.scale);
  const cast: Cast = {
    puff: { x: S26_PUFF.x, y: puffY, scale: S26_PUFF.scale, who: "puff", side: "right" },
    sunny: { x: S26_SUNNY.x, y: S26_SUNNY.y, scale: S26_SUNNY.scale, who: "sunny", side: "left" },
  };

  return (
    <AbsoluteFill>
      <BigWordBeat
        scene={scene}
        word="SEA BREEZE"
        syllables={["SEA", "BREEZE"]}
        chantKey="a3_18_puff"
        slamAt={slamAt}
        color={ACT_COLOR.seaBreeze}
        sub="wind off the water"
        y={S26_CARD_Y}
        freeze={<SeaBreezeShot />}
      >
        {/* Wave-edged, as scripted: a scalloped ribbon of sea behind the card,
            so the word arrives wearing the thing it names. */}
        <WaveTrim y={S26_CARD_Y} from={slamAt} />
        <Puff
          x={S26_PUFF.x}
          y={puffY}
          scale={S26_PUFF.scale}
          opacity={PUFF_OPACITY.notSorry}
          phase={PHASE.puff}
          emotion={emotion}
          speaking={stage.speaking("puff")}
          look="upRight"
          idle={1.1}
          zIndex={46}
        />
        <div style={{ position: "absolute", inset: 0, zIndex: 56 }}>
          <Sunny
            x={S26_SUNNY.x}
            y={S26_SUNNY.y - (1 - lean) * 420}
            scale={S26_SUNNY.scale * Math.max(0.01, lean)}
            phase={PHASE.sunny}
            emotion="proud"
            speaking={stage.speaking("sunny")}
            look={{ x: -0.55, y: 0.35 }}
            shades={0.2}
            raySpeed={0.24}
          />
        </div>
      </BigWordBeat>
      <Bubbles
        scene={scene}
        cast={cast}
        text={{
          a3_18_puff: "That is ME! A sea breeze!",
          a3_19_sunny: "I make the beach windy!",
        }}
        at={{
          a3_18_puff: { x: 760, y: 730, tail: "left" },
          // Tailless, and directly under him. A bubble tail leaves the bottom
          // edge, so a character leaning in from the *top* of frame cannot be
          // pointed at by one — and a tail aimed anywhere else would read as
          // Puff's line, which is the only other bubble in the scene.
          a3_19_sunny: { x: 1400, y: 630, tail: "none" },
        }}
      />
    </AbsoluteFill>
  );
};

/** A scalloped band of sea under the Big Word — the card's wave edge. */
const WaveTrim: React.FC<{ y: number; from: number }> = ({ y, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - from;
  if (f < -6) return null;
  const t = frame / fps;
  const grow = kidEase.easeOutQuad((f + 6) / 14);
  // A band, not a wash: it stops 150px under the banner. The first pass filled
  // to the bottom of the card's zone at 55% three times over and turned the
  // whole beach teal.
  const scallop = (dy: number, amp: number, phase: number): string => {
    const pts: string[] = [`M -120 ${y + dy}`];
    for (let x = -120; x <= 2040; x += 120) {
      pts.push(
        `Q ${x + 60} ${y + dy + Math.sin(x / 120 + t * 1.4 + phase) * amp - amp} ${x + 120} ${y + dy}`,
      );
    }
    pts.push(`L 2040 ${y + 150} L -120 ${y + 150} Z`);
    return pts.join(" ");
  };
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, zIndex: 44, pointerEvents: "none", opacity: grow }}
    >
      <path d={scallop(-104, 26, 0)} fill={SEA_NEAR} opacity={0.8} />
      <path d={scallop(-52, 22, 1.7)} fill={ACT_COLOR.seaBreeze} opacity={0.75} />
      <path d={scallop(6, 18, 3.1)} fill={SEA_FAR} opacity={0.6} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 27 — The sailboat
// ---------------------------------------------------------------------------
//
// The money frame is one instant: slack to taut. Everything before it is built
// to make that instant readable — a dead-flat bay (`swell` 0, no foam), a sail
// hanging in exactly the shape the kite flopped in, and no motion anywhere in
// frame except Puff filling his lungs.

const BAY_Y = 762;
const BOAT_START = 900;

/**
 * The bay: the same water as the beach, but seen from out on it, with the shore
 * a long way off at the horizon. Scene 23's shoreline runs diagonally across
 * frame, which is right for a scene about wind coming *ashore* and wrong for a
 * boat, so this is the one beach scene with its own geography.
 */
const BayWorld: React.FC<{ swell: number }> = ({ swell }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer>
      {/* The water, the far shore and the headland are all in `bay.webp`: this
          is the one beach scene whose geography is plain horizontal bands, so
          the plate could take the whole world and leave only the part that
          moves. The swell lines below are that part — and they are also the
          whole of "glassy", because at `swell` 0 they flatten and the painted
          water is all that is left. */}
      {Array.from({ length: 8 }, (_, i) => {
        const y = HORIZON + 120 + i * 96;
        const roll = Math.sin(t * 0.9 + i * 0.8) * 22 * swell;
        return (
          <path
            key={i}
            d={`M ${WIDE.x} ${y + roll} Q 960 ${y - 26 * swell + roll} ${WIDE.x + WIDE.w} ${y + roll}`}
            stroke="#ffffff"
            strokeWidth={6 + i}
            fill="none"
            strokeLinecap="round"
            opacity={(0.1 + 0.04 * i) * (0.3 + 0.7 * swell)}
          />
        );
      })}
    </WideLayer>
  );
};

const S27_BUBBLES: Record<string, string> = {
  a3_22_puff: "Should I push the boat?",
  a3_24_puff: "Okay, boat. PUSH!",
  a3_26_puff: "I am a BOAT ENGINE!",
};

const SailboatScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [pushFrom, pushTo] = lineWindow(scene, "a3_24_puff");
  // The whump: the last frames of "PUSH!". Five frames of snap, then the boat
  // is a different boat.
  const snap = pushTo - 5;
  const since = frame - snap;

  // Taut is a spring, not a ramp: the sail overshoots into its own curve and
  // rings out, which is what a sheet of fabric taking a load actually does.
  const taut = clamp01(spring({ frame: since, fps, config: { damping: 9, mass: 0.42 } }));
  // Heeled, not capsized: eight degrees plus the ring-out. The first pass went
  // to nineteen and the boat read as going over.
  const heel = taut * 8 + (since >= 0 ? settleWave(since / (fps * 0.9), 1.6, 4.4) * 3 : 0);
  const run = since > 0 ? kidEase.easeInQuad(clamp01(since / 150)) : 0;
  const boatX = BOAT_START + run * 940;

  // He braces and fills up across his own line, and lets go on the snap.
  const swell =
    kidEase.easeInOutSine((frame - pushFrom + 20) / 46) *
    (frame < snap ? 1 : Math.max(0, 1 - (frame - snap) / 9));

  const emotion = useEmotion(
    scene,
    "puff",
    { a3_22_puff: "happy", a3_24_puff: "excited", a3_26_puff: "proud" },
    "happy",
  );

  // Puff follows the boat once it goes, a little behind and below the sail —
  // and losing ground, because she is faster than he is.
  const puffX = 450 + run * 860;
  const puffY = hover("puff", 640 - run * 40, 1.05);
  const mark: Mark = { x: puffX, y: puffY, scale: 1.05, who: "puff", side: "right" };

  const cam: Cam = { x: 960, y: BAY_Y, zoom: 1 + taut * 0.03, dx: -run * 240 };

  return (
    <AbsoluteFill>
      <PaintedSky bg="bay" phase={4.9} />
      <Camera cam={cam}>
        <BayWorld swell={taut * 0.9} />
        {/* The bay is glassy until the wind arrives: a mirror under the boat,
            and nothing else on the water at all. */}
        <GlassyBay y={BAY_Y} x={boatX} calm={1 - taut} />
        <Boat x={boatX} y={BAY_Y - 96} scale={1} taut={taut} heel={heel} speed={run} />
      </Camera>
      {/* The push itself, drawn because he cannot be: a blast leaving him and
          arriving in the sail on the frame it fills. */}
      {since >= -6 && since < 26 ? (
        <AirArcs
          x={puffX + 120 + Math.max(0, since) * 8}
          y={700}
          scale={1.2}
          strength={clamp01((since + 6) / 6) * Math.max(0, 1 - since / 26) * 0.9}
          count={3}
        />
      ) : null}
      <Puff
        x={puffX}
        y={puffY}
        scale={1.05}
        opacity={PUFF_OPACITY.notSorry}
        phase={PHASE.puff}
        emotion={emotion}
        speaking={useStage(scene).speaking("puff")}
        swell={clamp01(swell)}
        pose={swell > 0.45 ? "brace" : run > 0.02 ? "cheer" : "rest"}
        look={{ x: 0.85, y: -0.1 }}
        idle={swell > 0.45 ? 0.3 : 1}
        wisps={run > 0.02 ? 4 : 2}
      />
      <Bubbles scene={scene} cast={{ puff: mark }} text={S27_BUBBLES} />
    </AbsoluteFill>
  );
};

/** The reflection under a boat on flat water. Fades out as the bay wakes up. */
const GlassyBay: React.FC<{ y: number; x: number; calm: number }> = ({ y, x, calm }) => {
  if (calm <= 0.02) return null;
  return (
    <WideLayer opacity={calm}>
      <ellipse cx={x} cy={y + 26} rx={230} ry={26} fill="#ffffff" opacity={0.35} />
      <path
        d={`M ${x - 24} ${y + 20} L ${x - 10} ${y + 200} L ${x + 46} ${y + 200} L ${x + 22} ${y + 20} Z`}
        fill={kidTheme.paper}
        opacity={0.28}
      />
      {[-560, -300, 320, 620].map((dx) => (
        <path
          key={dx}
          d={`M ${x + dx} ${y + 90} L ${x + dx + 240} ${y + 90}`}
          stroke="#ffffff"
          strokeWidth={9}
          strokeLinecap="round"
          opacity={0.3}
        />
      ))}
    </WideLayer>
  );
};

/**
 * The little boat. `taut` 0 is the sail hanging dead — deliberately the same
 * limp diagonal the kite lies in back on the hill — and 1 is a full airfoil
 * with the boat heeled over and going somewhere.
 */
const Boat: React.FC<{
  x: number;
  y: number;
  scale?: number;
  taut: number;
  heel: number;
  speed: number;
}> = ({ x, y, scale = 1, taut, heel, speed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // Sail geometry: the clew swings out and the belly fills as the load comes on.
  const clewX = 74 + 168 * taut;
  const belly = 26 + 210 * taut;
  const sag = 54 * (1 - taut);
  const sail =
    `M 0 -330 Q ${belly} ${-206 + 26 * (1 - taut)} ${clewX} ${-30 + sag * 0.35}` +
    ` Q ${clewX * 0.45} ${-6 + sag} 0 -6 Z`;
  const bob = Math.sin(t * 1.6) * 4 * (1 - taut) + Math.sin(t * 6) * 5 * speed;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${heel}deg)`,
        transformOrigin: "50% 62%",
        pointerEvents: "none",
      }}
    >
      <svg width={760} height={760} viewBox="-300 -420 760 760" overflow="visible">
        {/* Mast and boom. */}
        <path d="M 0 -344 L 0 -4" stroke={kidTheme.ink} strokeWidth={13} strokeLinecap="round" />
        <path d={`M -18 -8 L ${clewX + 16} ${-8 + sag * 0.2}`} stroke={kidTheme.ink} strokeWidth={11} strokeLinecap="round" />
        {/* Sail. Tomato, like the kite — the rhyme is the point of the scene. */}
        <path d={sail} fill={kidTheme.tomato} stroke={kidTheme.ink} strokeWidth={10} strokeLinejoin="round" />
        <path d={sail} fill="#ff8b7d" opacity={0.55} transform="translate(6 10) scale(0.82)" />
        {/* Wrinkles, while there is nothing holding it out. */}
        {taut < 0.6
          ? [0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M ${8 + i * 6} ${-262 + i * 78} q ${28 + i * 8} 22 ${44 + i * 10} 8`}
                stroke={kidTheme.ink}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
                opacity={(0.6 - taut) * 0.8}
              />
            ))
          : null}
        {/* Hull. */}
        <path
          d="M -168 -4 L 196 -4 Q 176 84 96 96 L -74 96 Q -150 84 -168 -4 Z"
          fill={kidTheme.paper}
          stroke={kidTheme.ink}
          strokeWidth={11}
          strokeLinejoin="round"
        />
        <path d="M -150 30 L 182 30" stroke={kidTheme.tomato} strokeWidth={16} strokeLinecap="round" />
        {/* Bow spray and a wake, in the hull's own coordinates so they leave
            from the bow rather than from wherever a second svg happened to be
            pinned. She travels right, so the bow is the right-hand end. */}
        {speed > 0.02 ? (
          <g>
            {Array.from({ length: 12 }, (_, i) => {
              const u = ((t * 1.6 + i / 12) % 1);
              return (
                <ellipse
                  key={i}
                  cx={186 + u * 120}
                  cy={70 - Math.sin(u * Math.PI) * (70 + (i % 4) * 26)}
                  rx={15 + (i % 3) * 8}
                  ry={12}
                  fill="#ffffff"
                  opacity={speed * 0.9 * (1 - u)}
                />
              );
            })}
            <path
              d="M -170 78 Q -360 96 -520 66"
              stroke="#ffffff"
              strokeWidth={16}
              strokeLinecap="round"
              fill="none"
              opacity={speed * 0.7}
            />
          </g>
        ) : null}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 28 — The turbines
// ---------------------------------------------------------------------------
//
// The second job, and the one that reaches the child's own bedroom. The scene
// is a chain of causes drawn as one continuous glowing pulse — blade, tower,
// cable, field, house, night light — because the point is not that turbines
// make electricity, it is that *this* turning arm turned *that* light on.

const TURBINES = [
  { x: 470, base: 806, h: 372, r: 176 },
  { x: 900, base: 838, h: 330, r: 152 },
  { x: 1290, base: 862, h: 296, r: 134 },
] as const;

/** Tower foot -> along the cable -> under the field -> up into the house. */
const PULSE_PATH: Array<{ x: number; y: number }> = [
  { x: TURBINES[0].x, y: TURBINES[0].base - TURBINES[0].h },
  { x: TURBINES[0].x, y: TURBINES[0].base },
  { x: 760, y: 902 },
  { x: 1480, y: 946 },
  { x: 1660, y: 1000 },
  { x: 1712, y: 902 },
  { x: 1712, y: 826 },
];

function alongPulse(u: number): { x: number; y: number } {
  const segs: number[] = [];
  let total = 0;
  for (let i = 1; i < PULSE_PATH.length; i++) {
    const d = Math.hypot(
      PULSE_PATH[i].x - PULSE_PATH[i - 1].x,
      PULSE_PATH[i].y - PULSE_PATH[i - 1].y,
    );
    segs.push(d);
    total += d;
  }
  let want = clamp01(u) * total;
  for (let i = 0; i < segs.length; i++) {
    if (want <= segs[i]) {
      const k = segs[i] === 0 ? 0 : want / segs[i];
      return {
        x: PULSE_PATH[i].x + (PULSE_PATH[i + 1].x - PULSE_PATH[i].x) * k,
        y: PULSE_PATH[i].y + (PULSE_PATH[i + 1].y - PULSE_PATH[i].y) * k,
      };
    }
    want -= segs[i];
  }
  return PULSE_PATH[PULSE_PATH.length - 1];
}

const TurbinesScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [spinFrom, spinTo] = lineWindow(scene, "a3_28_narrator");
  const [, bulbTo] = lineWindow(scene, "a3_29_puff");
  const [nightFrom] = lineWindow(scene, "a3_30_narrator");
  const [beatFrom] = heldBeat(scene, "a3_30_narrator");
  const [shoutFrom] = lineWindow(scene, "a3_31_puff");

  // "Spin them, Puff." — he shoves the first blade on the instruction.
  const shoveAt = Math.round(spinFrom + (spinTo - spinFrom) * 0.72);
  const pulseAt = bulbTo + 10;
  // The pulse arrives just as the Narrator gets to "somebody's night light".
  const pulseDur = Math.max(30, nightFrom + 118 - pulseAt);
  const pulseU = clamp01((frame - pulseAt) / pulseDur);

  // The bedroom takes the frame before the held beat opens, so the beat itself
  // is nothing but a night light in a dark room. The click is inside the
  // silence, which is the whole reason the silence was bought.
  const bedroomAt = nightFrom + 104;
  const clickAt = beatFrom + 6;
  const inBedroom = frame >= bedroomAt && frame < shoutFrom;

  const emotion = useEmotion(
    scene,
    "puff",
    { a3_29_puff: "amazed", a3_31_puff: "excited" },
    "happy",
    // 36f held beat in this scene.
    NO_LEAD,
  );
  // Read here rather than inline in the JSX: the bedroom takes the whole frame
  // for a while, so an inline `useStage()` sits inside a ternary and the hook
  // count changes on the frame we cut. That is React error #300, and it only
  // ever shows up in a contiguous render (docs/PROCESS.md).
  const speaking = useStage(scene).speaking("puff");

  // Puff goes to the first blade tip, shoves, and drops back to a mark.
  const reachU = kidEase.easeInOutSine((frame - shoveAt + 26) / 30);
  const home = { x: 250, y: 560 };
  const tip = { x: TURBINES[0].x - 96, y: TURBINES[0].base - TURBINES[0].h - 118 };
  const back = kidEase.easeInOutSine((frame - shoveAt - 16) / 34);
  const px = home.x + (tip.x - home.x) * reachU - (tip.x - 300) * back;
  const py = home.y + (tip.y - home.y) * reachU - (tip.y - 500) * back;
  const puffY = hover("puff", py, 1);
  const mark: Mark = { x: px, y: puffY, scale: 1, who: "puff", side: "right" };

  return (
    <AbsoluteFill>
      {inBedroom ? (
        <Bedroom clickAt={clickAt} />
      ) : (
        <>
          <PaintedSky bg="headland_turbines" phase={0.2} />
          <Headland />
          {TURBINES.map((tb, i) => (
            <Turbine
              key={tb.x}
              tb={tb}
              spinFrom={shoveAt + i * 7}
              glow={i === 0 ? clamp01((pulseU - 0.02) * 8) : 0}
            />
          ))}
          <PulseLine u={pulseU} live={frame >= pulseAt} />
          <FarmHouse x={1712} y={826} lit={pulseU >= 0.995} />
          <Puff
            x={px}
            y={puffY}
            scale={1}
            opacity={PUFF_OPACITY.notSorry}
            phase={PHASE.puff}
            emotion={emotion}
            speaking={speaking}
            pose={Math.abs(frame - shoveAt) < 14 ? "brace" : frame >= shoutFrom ? "cheer" : "rest"}
            look={frame >= shoutFrom ? "camera" : { x: 0.7, y: -0.2 }}
            idle={1}
          />
          <Bubbles
            scene={scene}
            cast={{ puff: mark }}
            text={{ a3_29_puff: "Like for LIGHTBULBS?", a3_31_puff: "I MAKE LIGHTBULBS!" }}
            at={{ a3_31_puff: { x: 700, y: 250, tail: "left" } }}
          />
        </>
      )}
      {frame >= bedroomAt && frame < bedroomAt + 8 ? <CutFlash at={bedroomAt} strength={0.3} /> : null}
    </AbsoluteFill>
  );
};

/**
 * What is left of the headland once the painting arrived.
 *
 * The sea, the sky and the ridge itself are all in `headland_turbines.webp`
 * now — the plate's grass line runs from y≈800 at frame left up over a crest at
 * y≈530 and back down to y≈700 on the right, which is *above* all three turbine
 * bases (806/838/862) and above the cable path, so every tower still stands on
 * ground and nothing had to move. Two painted ridges (one drawn, one plate) is
 * the failure mode this file used to have; the fix was to delete the drawn one
 * rather than to try to make them agree.
 *
 * The field lines stay: they are what the cable runs under, and they read as
 * furrows on the painted slope.
 */
const Headland: React.FC = () => (
  <WideLayer>
    {[960, 1030, 1104].map((y) => (
      <path key={y} d={`M ${WIDE.x} ${y} Q 960 ${y - 30} ${WIDE.x + WIDE.w} ${y}`} stroke={kidTheme.grassDark} strokeWidth={6} fill="none" opacity={0.4} />
    ))}
  </WideLayer>
);

const Turbine: React.FC<{
  tb: { x: number; base: number; h: number; r: number };
  spinFrom: number;
  glow: number;
}> = ({ tb, spinFrom, glow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Spin accelerates from a standing start and settles into a steady turn: a
  // blade that snaps to full speed reads as a video starting, not as a shove.
  const since = frame - spinFrom;
  const speed = since <= 0 ? 0 : kidEase.easeOutQuad(since / (fps * 1.6));
  const angle = since <= 0 ? 0 : (since * speed * 3.1) % 360;
  const hub = { x: tb.x, y: tb.base - tb.h };
  return (
    <WideLayer>
      <path
        d={`M ${tb.x - 24} ${tb.base} L ${tb.x - 10} ${hub.y} L ${tb.x + 10} ${hub.y} L ${tb.x + 24} ${tb.base} Z`}
        fill={kidTheme.paper}
        stroke={kidTheme.ink}
        strokeWidth={8}
        strokeLinejoin="round"
      />
      {glow > 0.01 ? (
        <path
          d={`M ${tb.x - 16} ${tb.base} L ${tb.x - 6} ${hub.y} L ${tb.x + 6} ${hub.y} L ${tb.x + 16} ${tb.base} Z`}
          fill={kidTheme.star}
          opacity={glow * 0.8}
        />
      ) : null}
      <g transform={`translate(${hub.x} ${hub.y}) rotate(${angle})`}>
        {[0, 120, 240].map((a) => (
          <path
            key={a}
            transform={`rotate(${a})`}
            d={`M -16 0 L -7 ${-tb.r} Q 0 ${-tb.r - 20} 7 ${-tb.r} L 16 0 Z`}
            fill={kidTheme.paper}
            stroke={kidTheme.ink}
            strokeWidth={7}
            strokeLinejoin="round"
          />
        ))}
        <circle r={20} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={8} />
      </g>
    </WideLayer>
  );
};

/** The cable, and the pulse travelling down it. */
const PulseLine: React.FC<{ u: number; live: boolean }> = ({ u, live }) => {
  const d = PULSE_PATH.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const head = alongPulse(u);
  return (
    <WideLayer>
      <path d={d} stroke={kidTheme.inkSoft} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.55} />
      {/* The buried stretch is dashed, so "under a field" is legible. */}
      <path
        d={`M ${PULSE_PATH[3].x} ${PULSE_PATH[3].y} L ${PULSE_PATH[4].x} ${PULSE_PATH[4].y} L ${PULSE_PATH[5].x} ${PULSE_PATH[5].y}`}
        stroke={kidTheme.paper}
        strokeWidth={5}
        strokeDasharray="18 16"
        fill="none"
        opacity={0.7}
      />
      {live ? (
        <g>
          <path
            d={d}
            pathLength={1}
            strokeDasharray={`${Math.max(0.001, u * 0.14)} 1`}
            strokeDashoffset={-Math.max(0, u - 0.14)}
            stroke={kidTheme.star}
            strokeWidth={22}
            fill="none"
            strokeLinecap="round"
            opacity={0.8}
          />
          <circle cx={head.x} cy={head.y} r={26} fill={kidTheme.star} opacity={0.5} />
          <circle cx={head.x} cy={head.y} r={13} fill={kidTheme.paper} />
        </g>
      ) : null}
    </WideLayer>
  );
};

const FarmHouse: React.FC<{ x: number; y: number; lit: boolean }> = ({ x, y, lit }) => (
  <WideLayer>
    <rect x={x - 110} y={y - 40} width={220} height={200} rx={12} fill="#f0e2c8" stroke={kidTheme.ink} strokeWidth={9} />
    <path d={`M ${x - 140} ${y - 40} L ${x} ${y - 150} L ${x + 140} ${y - 40} Z`} fill={kidTheme.tomato} stroke={kidTheme.ink} strokeWidth={9} strokeLinejoin="round" />
    <rect
      x={x - 40}
      y={y + 10}
      width={80}
      height={74}
      rx={8}
      fill={lit ? kidTheme.star : "#9db4c6"}
      stroke={kidTheme.ink}
      strokeWidth={7}
    />
    {lit ? <circle cx={x} cy={y + 47} r={110} fill={kidTheme.star} opacity={0.28} /> : null}
  </WideLayer>
);

/**
 * Somebody's bedroom, at night. The whole shot exists so a six-year-old can
 * arrive at the sentence themselves during the held beat: the light in *their*
 * room is the far end of a chain that starts with moving air.
 */
const Bedroom: React.FC<{ clickAt: number }> = ({ clickAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = frame >= clickAt;
  const since = frame - clickAt;
  // A click, not a fade: it flares a little brighter than it settles.
  const glow = on ? 1 + Math.max(0, 1 - since / 6) * 0.7 : 0;
  const flicker = on ? 1 + Math.sin(frame * 0.6) * 0.02 : 0;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0d1734 0%, #16244d 62%, #1d2c5c 100%)" }}>
      <WideLayer>
        {/* Window, night sky, moon. */}
        <rect x={230} y={150} width={520} height={430} rx={18} fill="#0b1430" stroke="#2c3d6b" strokeWidth={14} />
        <path d="M 490 150 L 490 580 M 230 366 L 750 366" stroke="#2c3d6b" strokeWidth={12} />
        {Array.from({ length: 14 }, (_, i) => (
          <circle
            key={i}
            cx={266 + ((i * 137) % 450)}
            cy={182 + ((i * 89) % 360)}
            r={3 + (i % 3)}
            fill={kidTheme.star}
            opacity={0.5 + 0.3 * Math.sin(frame / 20 + i)}
          />
        ))}
        <circle cx={660} cy={244} r={52} fill="#e8eeff" opacity={0.85} />
        <circle cx={636} cy={230} r={44} fill="#0b1430" opacity={0.9} />
        {/* Bed, with somebody in it. No face, ever. */}
        <rect x={880} y={700} width={880} height={230} rx={30} fill="#2a3a6d" />
        <path d="M 900 700 Q 1180 610 1500 700 L 1500 720 L 900 720 Z" fill="#33488a" />
        <rect x={1560} y={560} width={200} height={180} rx={26} fill="#3b5299" />
        {/* Night light on a small table. */}
        <rect x={430} y={760} width={280} height={180} rx={16} fill="#2b3a63" />
        <g transform="translate(570 720)">
          <path d="M -70 42 Q -70 -46 0 -46 Q 70 -46 70 42 Z" fill={on ? kidTheme.star : "#41527f"} stroke="#1a2547" strokeWidth={8} strokeLinejoin="round" opacity={on ? flicker : 1} />
          <rect x={-22} y={42} width={44} height={34} rx={8} fill="#41527f" stroke="#1a2547" strokeWidth={7} />
        </g>
      </WideLayer>
      {on ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 900px 700px at 570px 720px, rgba(255,244,184,${0.34 * glow}) 0%, rgba(255,244,184,${0.14 * glow}) 40%, transparent 72%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}
      {on && since < 6 ? (
        <AbsoluteFill style={{ background: kidTheme.star, opacity: 0.12 * (1 - since / 6), pointerEvents: "none" }} />
      ) : null}
      {/* A hair of dark at the edges: it is night, and the room is small. */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 78% 78% at 40% 62%, transparent 34%, rgba(4,9,26,0.72) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 29 — The seeds
// ---------------------------------------------------------------------------
//
// Third job, and the episode's heart. The scene has two halves and the cut
// between them is the point: Puff carrying seeds, and then — with him nowhere
// in frame — the hillside those seeds became. Sixty frames of it, gentle and
// unhurried, and nobody says a word.

const S29_BUBBLES: Record<string, string> = {
  a3_33_puff: "I know these ones!",
  a3_35_puff: "Flowers. Because of me.",
};

const SeedsScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [knowFrom, knowTo] = lineWindow(scene, "a3_33_puff");
  const [, becauseTo] = lineWindow(scene, "a3_35_puff");
  const [beatFrom, beatTo] = heldBeat(scene, "a3_36_narrator");

  // The hillside takes the frame before the last line, so "Yes, Puff. There
  // are." plays over it and the held beat that follows is already settled.
  const hillAt = becauseTo + 2;
  const onHill = frame >= hillAt;

  const emotion = useEmotion(
    scene,
    "puff",
    { a3_33_puff: "amazed", a3_35_puff: "proud" },
    "happy",
  );
  const speaking = useStage(scene).speaking("puff");

  // The recognition: one dandelion seed drifts up to his nose and he goes
  // (very nearly) cross-eyed at it. The rig has one look direction for both
  // eyes, so the convergence is staged as a hard look down his own front with
  // the seed parked there — see the note in the report.
  const close = frame >= knowFrom - 26 && frame < knowTo + 20;
  const puffX = 720;
  const puffY = hover("puff", 520, 1.15);
  const mark: Mark = { x: puffX, y: puffY, scale: 1.15, who: "puff", side: "right", offset: 380 };

  return (
    <AbsoluteFill>
      {onHill ? (
        <DandelionHillside from={hillAt} beat={[beatFrom, beatTo]} />
      ) : (
        <>
          <PaintedSky bg="country_fields" phase={1.3} />
          <OpenCountry />
          <SeedBlizzard />
          <Puff
            x={puffX}
            y={puffY}
            scale={1.15}
            opacity={PUFF_OPACITY.notSorry}
            phase={PHASE.puff}
            emotion={emotion}
            speaking={speaking}
            // As close to cross-eyed as the rig goes: both pupils take one
            // direction, so "looking at the thing on the end of his nose" is
            // staged as a hard converging look down and in, with the seed
            // parked exactly there. Per-eye convergence would need a rig
            // change; see the report.
            look={close ? { x: 0.5, y: 0.5 } : { x: 0.8, y: -0.05 }}
            eyeLife={close ? 0.15 : 1}
            wisps={4}
            idle={1}
          />
          {close ? <NoseSeed x={puffX + 78} y={puffY + 34} /> : null}
          <Bubbles scene={scene} cast={{ puff: mark }} text={S29_BUBBLES} />
        </>
      )}
      {frame >= hillAt && frame < hillAt + 8 ? <CutFlash at={hillAt} strength={0.28} /> : null}
    </AbsoluteFill>
  );
};

/** Fields going past underneath: hedges, trees, a long way of it. */
const OpenCountry: React.FC = () => {
  const frame = useCurrentFrame();
  const dx = -frame * 3.4;
  return (
    <WideLayer>
      {/* The far band of fields used to be a static shape here; it is in
          `country_fields.webp` now. Everything below still scrolls — this is a
          travelling shot, and the parallax between the plate and these two
          layers is what sells the distance. */}
      {/* Everything below is in `PAINTED_GREEN`, not `kidTheme`: the theme's
          grass is a blue-green and it read as a strip of a different show laid
          across the bottom of the painting. Scenery that shares an edge with a
          plate matches the plate. */}
      <g transform={`translate(${dx % 900} 0)`}>
        <path d={`M ${WIDE.x} 820 Q 900 740 1800 830 Q 2600 900 ${WIDE.x + WIDE.w} 830 L ${WIDE.x + WIDE.w} ${BOTTOM} L ${WIDE.x} ${BOTTOM} Z`} fill={PAINTED_GREEN.lit} />
        {Array.from({ length: 12 }, (_, i) => {
          const x = -900 + i * 380;
          return (
            <g key={i}>
              <path d={`M ${x} 900 q 90 -40 180 0`} stroke={PAINTED_GREEN.shade} strokeWidth={26} fill="none" strokeLinecap="round" />
            </g>
          );
        })}
      </g>
      <g transform={`translate(${(dx * 1.5) % 1400} 0)`}>
        {Array.from({ length: 6 }, (_, i) => {
          const x = -700 + i * 620;
          return (
            <g key={i} transform={`translate(${x} 1020)`}>
              <path d="M 0 0 L 0 -140" stroke="#8a5a34" strokeWidth={26} strokeLinecap="round" />
              <circle cx={0} cy={-190} r={96} fill={PAINTED_GREEN.deep} />
              <circle cx={-54} cy={-150} r={62} fill={PAINTED_GREEN.shade} />
              <circle cx={58} cy={-158} r={58} fill={PAINTED_GREEN.shade} />
            </g>
          );
        })}
      </g>
    </WideLayer>
  );
};

/** Dandelion clocks, sycamore helicopters and thistledown, all going west. */
const SeedBlizzard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer zIndex={35}>
      {Array.from({ length: 34 }, (_, i) => {
        const kind = i % 3;
        const speed = 300 + (i % 7) * 55;
        const x = 2300 - (((t * speed + i * 331) % 3600));
        const y = 180 + ((i * 173) % 780) + Math.sin(t * 1.4 + i) * 34;
        const spin = t * (60 + (i % 5) * 40) + i * 30;
        const s = 0.7 + ((i * 37) % 60) / 100;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${spin}) scale(${s})`} opacity={0.95}>
            {kind === 0 ? <DandelionSeedMark /> : kind === 1 ? <HelicopterMark /> : <ThistleMark />}
          </g>
        );
      })}
    </WideLayer>
  );
};

const DandelionSeedMark: React.FC = () => (
  <g>
    <path d="M 0 0 L 0 30" stroke="#b9a97d" strokeWidth={4} />
    {[-46, -23, 0, 23, 46].map((d) => (
      <path
        key={d}
        d={`M 0 0 L ${Math.sin((d * Math.PI) / 180) * 30} ${-Math.cos((d * Math.PI) / 180) * 30}`}
        stroke={kidTheme.paper}
        strokeWidth={4}
        strokeLinecap="round"
      />
    ))}
    <circle cy={30} r={4} fill="#8f7f57" />
  </g>
);

const HelicopterMark: React.FC = () => (
  <g>
    <path d="M 0 0 Q 44 -22 96 -6 Q 50 12 0 8 Z" fill="#c9a86b" stroke="#8a5a34" strokeWidth={4} />
    <circle r={9} fill="#8a5a34" />
  </g>
);

const ThistleMark: React.FC = () => (
  <g>
    {Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2;
      return (
        <path
          key={i}
          d={`M 0 0 L ${Math.cos(a) * 26} ${Math.sin(a) * 26}`}
          stroke={kidTheme.paper}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.9}
        />
      );
    })}
    <circle r={6} fill="#d8c9a4" />
  </g>
);

/** The one seed he recognises, hanging right off the end of his nose. */
const NoseSeed: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer zIndex={40}>
      <g transform={`translate(${x + Math.sin(t * 1.6) * 8} ${y + Math.sin(t * 2.2) * 6}) rotate(${Math.sin(t) * 12}) scale(1.5)`}>
        <DandelionSeedMark />
      </g>
    </WideLayer>
  );
};

/**
 * A whole hillside gone yellow, five minutes after one dandelion in Act One.
 *
 * The camera does one thing very slowly and nothing else happens at all. Puff
 * is not in frame; that is written down in the script and it is the reason the
 * shot works — the consequence outlives the hero, which is a bigger idea than
 * any line in the episode could carry.
 */
const DandelionHillside: React.FC<{ from: number; beat: [number, number] }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const u = (frame - from) / 200;
  const drift = kidEase.easeInOutSine(clamp01(u));
  return (
    <AbsoluteFill>
      <PaintedSky bg="country_fields" phase={1.3} />
      <Camera cam={{ x: 960, y: 700, zoom: 1.04 + drift * 0.07, dx: -drift * 120 }}>
        <WideLayer>
          {/* The hillside itself is the painting — two flat green shapes used
              to be here and they are exactly what `country_fields.webp` draws
              better. What is left is the only thing that was ever the point:
              rows of dandelions, bigger and looser towards the camera, every
              one of them nodding on its own clock. */}
          {Array.from({ length: 15 }, (_, row) =>
            Array.from({ length: 26 }, (_, col) => {
              const depth = row / 14;
              const y = 660 + depth * 620 + ((col * 37) % 26);
              // Jitter per cell, not per row: an offset that only varies with
              // the row turns a meadow into a set of diagonal stripes, which is
              // exactly what the first pass looked like.
              const x =
                -900 + col * 150 + ((row * 91 + col * 173) % 130) + depth * 40 + ((row * col * 53) % 47);
              const s = 0.3 + depth * 1.1;
              const nod = Math.sin(t * 0.9 + row * 0.7 + col * 0.35) * 5 * s;
              return (
                <g key={`${row}-${col}`} transform={`translate(${x + nod} ${y}) scale(${s})`}>
                  <path d={`M 0 0 q ${nod * 2} -34 ${nod * 2.4} -66`} stroke={kidTheme.grassDark} strokeWidth={9} fill="none" strokeLinecap="round" />
                  <circle cx={nod * 2.4} cy={-72} r={22} fill={kidTheme.sun} />
                  <circle cx={nod * 2.4} cy={-72} r={13} fill={kidTheme.sunDark} opacity={0.55} />
                  {Array.from({ length: 8 }, (_, k) => {
                    const a = (k / 8) * Math.PI * 2;
                    return (
                      <ellipse
                        key={k}
                        cx={nod * 2.4 + Math.cos(a) * 22}
                        cy={-72 + Math.sin(a) * 22}
                        rx={9}
                        ry={6}
                        fill={kidTheme.sun}
                        transform={`rotate(${(a * 180) / Math.PI} ${nod * 2.4 + Math.cos(a) * 22} ${-72 + Math.sin(a) * 22})`}
                      />
                    );
                  })}
                </g>
              );
            }),
          )}
        </WideLayer>
      </Camera>
      {/* A little warm light over the whole thing. Nothing else. */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,244,184,0.22) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 30 — Door to door
// ---------------------------------------------------------------------------

const S30_CLOUDIA = { x: 1080, y: 470, scale: 1.15 };

const DoorToDoorScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [pushFrom] = lineWindow(scene, "a3_39_narrator");
  const [dripFrom] = lineWindow(scene, "a3_41_drip");

  // She does not cross the frame — the world does. Mountains slide in beneath
  // her, which is what makes a cloud that stays put read as a cloud going
  // somewhere (and keeps her face in shot for two more lines).
  const travel = kidEase.easeInOutSine((frame - pushFrom + 10) / 300);
  const glide = travel * 2400;
  const shove = Math.sin(clamp01((frame - pushFrom) / 26) * Math.PI) * 26;

  const stage = useStage(scene);
  const emotion = useEmotion(scene, "puff", { a3_39_narrator: "proud" }, "happy");
  const cloudiaEmotion = useEmotion(
    scene,
    "cloudia",
    { a3_38_cloudia: "amazed", a3_40_cloudia: "proud" },
    "happy",
  );

  const puffX = S30_CLOUDIA.x - 470 + shove;
  const puffY = hover("puff", 560, 1.05);
  const cast: Cast = {
    puff: { x: puffX, y: puffY, scale: 1.05, who: "puff", side: "left", offset: 300 },
    cloudia: { x: S30_CLOUDIA.x, y: S30_CLOUDIA.y, scale: S30_CLOUDIA.scale, who: "cloudia", side: "left" },
    drip: {
      x: S30_CLOUDIA.x + 140,
      y: hover("drip", S30_CLOUDIA.y + 10, 0.32),
      scale: 0.26,
      who: "drip",
      side: "right",
    },
  };

  return (
    <AbsoluteFill>
      <PaintedSky bg="sky_recap" phase={2.4} />
      <PlainAndMountains dx={-glide} />

      {/* Her hat, streaming. Last seen blowing across episode one's sign-off,
          which is exactly the joke. */}
      <ManagerHat x={S30_CLOUDIA.x - 60} y={S30_CLOUDIA.y - 190} stream={travel} />
      {/* Awning and bell hang off her *underside*, clear of the face, the bow
          tie and the window. Two earlier passes put the awning across her
          middle and then across her cheek; both read as a striped bar drawn on
          top of the character rather than as something she is carrying. */}
      <Awning x={S30_CLOUDIA.x + 140} y={S30_CLOUDIA.y - 96} scale={0.5} />
      <Cloudia
        x={S30_CLOUDIA.x}
        y={S30_CLOUDIA.y}
        scale={S30_CLOUDIA.scale}
        phase={PHASE.cloudia}
        emotion={cloudiaEmotion}
        speaking={stage.speaking("cloudia")}
        fill={0.72}
        bowTie
        look={{ x: -0.6, y: 0.1 }}
        idle={0.9}
      />
      <BrassBell x={S30_CLOUDIA.x + 236} y={S30_CLOUDIA.y + 96} ring={clamp01((frame - pushFrom) / 20)} />

      {/* Drip, at a window, halfway across. One line, both arms, gone. */}
      {frame >= dripFrom - 22 ? (
        <>
          <Drip
            x={S30_CLOUDIA.x + 140}
            // `hover`, not a raw y: CharacterFrame scales about the *bottom* of
            // the natural box, so a small `scale` on a raw y drops the body a
            // hundred pixels (see CHAR_BOX in common.tsx).
            y={hover("drip", S30_CLOUDIA.y + 10, 0.32)}
            scale={0.32}
            phase={PHASE.drip}
            emotion="excited"
            speaking={stage.speaking("drip")}
            pose="cheer"
            shadow={false}
            look="left"
            enter={{ at: dripFrom - 20, kind: "pop" }}
            idle={1.6}
          />
          {/* The window he is leaning out of: a lip in front of him, so he
              reads as inside the cloud rather than stuck to it. */}
          <WideLayer zIndex={20}>
            <ellipse
              cx={S30_CLOUDIA.x + 140}
              cy={S30_CLOUDIA.y + 58}
              rx={66}
              ry={22}
              fill={mixHex(kidTheme.cloud, kidTheme.cloudGrey, 0.5)}
              stroke={kidTheme.cloudGreyShade}
              strokeWidth={8}
            />
          </WideLayer>
        </>
      ) : null}

      <Puff
        x={puffX}
        y={puffY}
        scale={1.05}
        opacity={PUFF_OPACITY.notSorry}
        phase={PHASE.puff}
        emotion={emotion}
        speaking={stage.speaking("puff")}
        pose={frame >= pushFrom ? "brace" : "rest"}
        look={{ x: 0.9, y: -0.05 }}
        idle={frame >= pushFrom ? 1.6 : 1}
        wisps={4}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={{
          a3_38_cloudia: "Take me to the mountains!",
          a3_40_cloudia: "Door to door, darling!",
          a3_41_drip: "Hi! I'm the weather!",
        }}
        at={{
          a3_38_cloudia: { x: 660, y: 250, tail: "right" },
          a3_40_cloudia: { x: 660, y: 250, tail: "right" },
          a3_41_drip: { x: 1560, y: 700, tail: "left" },
        }}
      />
    </AbsoluteFill>
  );
};

/** A flat plain, and then mountains, sliding in underneath. */
const PlainAndMountains: React.FC<{ dx: number }> = ({ dx }) => (
  <WideLayer>
    <path d={`M ${WIDE.x} 900 L ${WIDE.x + WIDE.w} 900 L ${WIDE.x + WIDE.w} ${BOTTOM} L ${WIDE.x} ${BOTTOM} Z`} fill="#9fd79a" />
    <g transform={`translate(${dx} 0)`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 2100 + i * 640;
        const h = 320 + (i % 3) * 120;
        return (
          <g key={i}>
            <path d={`M ${x - 420} 940 L ${x} ${940 - h} L ${x + 420} 940 Z`} fill="#9fb4c6" stroke={kidTheme.ink} strokeWidth={9} strokeLinejoin="round" />
            <path d={`M ${x - 110} ${940 - h + 120} L ${x} ${940 - h} L ${x + 110} ${940 - h + 120} Q ${x} ${940 - h + 84} ${x - 110} ${940 - h + 120} Z`} fill="#ffffff" />
          </g>
        );
      })}
      {/* Fields and hedges on the plain, so the ground reads as moving. */}
      {Array.from({ length: 22 }, (_, i) => (
        <path
          key={i}
          d={`M ${-800 + i * 340} 940 q 120 -34 240 0`}
          stroke="#6fbf72"
          strokeWidth={16}
          fill="none"
          strokeLinecap="round"
          opacity={0.8}
        />
      ))}
    </g>
    <path d={`M ${WIDE.x} 1000 L ${WIDE.x + WIDE.w} 1000 L ${WIDE.x + WIDE.w} ${BOTTOM} L ${WIDE.x} ${BOTTOM} Z`} fill="#7cc879" />
  </WideLayer>
);

/** The manager's hat, streaming backwards at speed. */
const ManagerHat: React.FC<{ x: number; y: number; stream: number }> = ({ x, y, stream }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tilt = -8 - stream * 16 + Math.sin((frame / fps) * 2.4) * 3;
  return (
    <WideLayer zIndex={25}>
      <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(0.9)`}>
        <CloudiaHat stream={stream} />
      </g>
    </WideLayer>
  );
};

/**
 * Her awning: she is a business, and business is good.
 *
 * A canopy, i.e. a *sloping* shape with a scalloped hem — the first pass drew
 * the stripes as upright wavy panels and the whole thing rendered as a striped
 * rod stuck through the character.
 */
const Awning: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  const TOP = 150;
  const BOT = 210;
  const H = 76;
  const N = 8;
  return (
    <WideLayer zIndex={22}>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        {Array.from({ length: N }, (_, i) => {
          const u0 = -1 + (i * 2) / N;
          const u1 = -1 + ((i + 1) * 2) / N;
          return (
            <path
              key={i}
              d={`M ${u0 * TOP} 0 L ${u1 * TOP} 0 L ${u1 * BOT} ${H} L ${u0 * BOT} ${H} Z`}
              fill={i % 2 ? kidTheme.paper : kidTheme.pink}
              stroke={kidTheme.ink}
              strokeWidth={5}
              strokeLinejoin="round"
            />
          );
        })}
        {/* Scalloped hem, so it reads as fabric and not as a shelf. */}
        {Array.from({ length: N }, (_, i) => {
          const w = (BOT * 2) / N;
          const cx = -BOT + w * (i + 0.5);
          return (
            <path
              key={`h${i}`}
              d={`M ${cx - w / 2} ${H} a ${w / 2} ${w / 2.6} 0 0 0 ${w} 0 Z`}
              fill={i % 2 ? kidTheme.paper : kidTheme.pink}
              stroke={kidTheme.ink}
              strokeWidth={5}
              strokeLinejoin="round"
            />
          );
        })}
        <path d={`M ${-TOP - 8} 0 L ${TOP + 8} 0`} stroke={kidTheme.ink} strokeWidth={10} strokeLinecap="round" />
      </g>
    </WideLayer>
  );
};

const BrassBell: React.FC<{ x: number; y: number; ring: number }> = ({ x, y, ring }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const swing = ring * Math.sin((frame / fps) * 7) * 12 * Math.max(0, 1 - ring * 0.4);
  return (
    <WideLayer zIndex={24}>
      <g transform={`translate(${x} ${y}) rotate(${swing})`}>
        <path d="M 0 -30 L 0 0" stroke={kidTheme.ink} strokeWidth={7} />
        <path d="M -44 46 Q -44 -6 0 -6 Q 44 -6 44 46 Z" fill={kidTheme.sun} stroke={kidTheme.sunDeep} strokeWidth={7} strokeLinejoin="round" />
        <ellipse cx={0} cy={46} rx={50} ry={12} fill={kidTheme.sunDark} stroke={kidTheme.sunDeep} strokeWidth={6} />
        <circle cx={0} cy={62} r={9} fill={kidTheme.sunDeep} />
      </g>
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 31 — The hill
// ---------------------------------------------------------------------------
//
// The cold open, five minutes later, with one thing changed.
//
// Everything geographic here comes from HILL_MARKS (coldOpen.tsx) and the
// camera is the cold open's camera at the zoom it finished on, so the audience
// is looking at a picture they have already been taught to read. The only new
// thing in frame is Puff — and he is the thing that was missing.
//
// The last seventy-five frames are the episode's ending: the kite goes up, the
// line goes tight, the kid's arms go up, and nothing else happens at all. No
// bubble is mapped inside them, no emotion changes inside them (every cue in
// this scene lands on a line start with NO_LEAD), and nobody arrives.

// Far enough left that the biggest breath in the episode still does not reach
// the kid: at 430 his braced arms touched the silhouette, and the kid is the
// entire emotional readout of the scene.
const S31_PUFF = { x: 330, y: 545, scale: 1.15 };
const kidYAt = (x: number): number => stand("kid", hillY(x, HILL_MARKS.crest));

const TheHillScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [, arriveTo] = lineWindow(scene, "a3_43_narrator");
  const [lookFrom] = heldBeat(scene, "a3_46_narrator");
  const [breathFrom, breathTo] = heldBeat(scene, "a3_48_narrator");
  const [pushFrom, pushTo] = lineWindow(scene, "a3_49_puff");
  const [flyFrom, flyTo] = heldBeat(scene, "a3_49_puff");

  // --- Puff crests the hill and stops dead.
  const arriveU = (frame - 6) / Math.max(1, arriveTo - 20);
  const arrive = moveAlong({ x: 60, y: 1010 }, S31_PUFF, arriveU, {
    arc: 0.18,
    bias: 0.9,
    ease: kidEase.easeOutCubic,
  });

  // --- the breath, and the push.
  //
  // He fills up across the whole 45-frame beat the script bought for it, and
  // empties across "PUUUSH!" itself — so that by the time the payoff beat
  // opens, the only thing left moving on screen is the kite.
  const swell =
    kidEase.easeInOutSine((frame - breathFrom) / Math.max(1, breathTo - breathFrom)) *
    (frame < pushFrom + 6 ? 1 : Math.max(0, 1 - (frame - pushFrom - 6) / 20));
  const blast = frame - (pushFrom + 8);

  // --- the kite.
  const t = frame - flyFrom;
  const flying = t >= 0;
  const kite = kiteClimb(t);
  const kidX = HILL_MARKS.kidX;
  // One object for the body and the hand that holds the string: `kidHand` needs
  // the flip as much as the pose (see its note in ./common).
  const kid: KidPlacement = {
    x: kidX,
    y: kidYAt(kidX),
    scale: HILL_MARKS.kidScale,
    flip: true,
    slump: flying ? 1 - kidEase.easeOutQuad((t - 6) / 26) : 1,
    armsUp: flying ? kidEase.easeOutBack(clamp01((t - 10) / 34), 1.15) : 0,
  };
  const hand = kidHand(kid);

  // The camera holds the cold open's framing until the kite leaves, then eases
  // out and up to keep it and the kid in one shot. It is the only camera move
  // inside the payoff, and it is the shot following the thing that is moving.
  const out = kidEase.easeInOutSine(clamp01((t - 4) / 74));
  const cam: Cam = { x: 1000, y: 620, zoom: 1.06 - out * 0.32, dy: out * 118 };

  // Grass: still all through the scene (there is no wind, that is the premise),
  // leaning in as he inhales and flattening away on the push.
  const gust = flying
    ? Math.max(0, 1 - t / 60)
    : frame >= pushFrom
      ? clamp01((frame - pushFrom) / 8)
      : -0.35 * clamp01((frame - breathFrom) / 30);

  const emotion = useEmotion(
    scene,
    "puff",
    {
      a3_45_puff: "sad",
      a3_47_puff: "proud",
      a3_49_puff: "excited",
    },
    "happy",
    // Three held beats in this scene, one of them the ending.
    NO_LEAD,
  );

  const puffX = flying || frame >= pushFrom ? S31_PUFF.x : arrive.x;
  const puffCentre = flying || frame >= pushFrom ? S31_PUFF.y : arrive.y;
  const puffY = hover("puff", puffCentre, S31_PUFF.scale);
  const camPuff = {
    x: cam.x + (puffX - cam.x) * (cam.zoom ?? 1),
    y: cam.y + (puffCentre - cam.y) * (cam.zoom ?? 1) + (cam.dy ?? 0),
  };

  return (
    <AbsoluteFill>
      <PaintedSky bg="hill_day" drift={6} dy={-190} />
      <Camera cam={cam}>
        <Hill wind={gust} crest={HILL_MARKS.crest} />
        {/* Same two contact shadows as the cold open — this is that frame with
            one thing changed, so it has to be seated the same way. Puff gets
            one too while he is low over the grass; it fades out as he lifts,
            because a shadow that stays put under a rising character is worse
            than none. */}
        <KidContactShadow x={kidX} y={hillY(kidX, HILL_MARKS.crest)} rx={104} ry={20} />
        <KidContactShadow x={kite.x} y={hillY(kite.x, HILL_MARKS.crest) + 12} rx={120} ry={20} strength={0.18 * (kite.flat ? 1 : 0)} />
        <KidContactShadow
          x={puffX}
          y={hillY(puffX, HILL_MARKS.crest) + 10}
          rx={150 * S31_PUFF.scale}
          ry={26}
          strength={0.16 * clamp01(1 - (hillY(puffX, HILL_MARKS.crest) - puffCentre) / 420)}
        />
        <KiteString
          from={hand}
          to={{ x: kite.x, y: kite.y }}
          slack={kite.slack}
          thrumFrom={flying ? flyFrom + 8 : undefined}
        />
        <KidSilhouette {...kid} />
        <Kite
          x={kite.x}
          y={kite.y}
          scale={HILL_MARKS.kiteScale}
          rot={kite.rot}
          flat={kite.flat}
          life={kite.life}
        />
        <Puff
          x={puffX}
          y={puffY}
          // The breath is the biggest he has ever been: `swell` widens the body
          // around a face that stays put, and the scale ramp on top of it is
          // what makes "bigger than he has been all episode" legible from the
          // back of the room. Both unwind across "PUUUSH!" itself.
          scale={S31_PUFF.scale * (1 + 0.4 * clamp01(swell))}
          opacity={PUFF_OPACITY.notSorry}
          phase={PHASE.puff}
          emotion={emotion}
          speaking={useStage(scene).speaking("puff")}
          swell={clamp01(swell)}
          bank={frame < arriveTo - 20 ? arrive.angle * 0.4 : 0}
          pose={swell > 0.4 ? "brace" : "rest"}
          look={frame >= lookFrom ? { x: 0.9, y: 0.25 } : { x: 0.75, y: 0.1 }}
          idle={swell > 0.4 ? 0.25 : 0.9}
          wisps={frame < arriveTo - 20 ? 4 : 2}
        />
      </Camera>
      {/* The push, drawn: one long blast leaving him and reaching the kite on
          the frame the kite moves. */}
      {blast >= 0 && blast < 44 ? (
        <AirArcs
          x={camPuff.x + 190 + blast * 14}
          y={camPuff.y - 20}
          scale={1.7}
          strength={Math.max(0, 1 - blast / 44)}
          count={4}
        />
      ) : null}
      <Bubbles
        scene={scene}
        cast={{ puff: { x: camPuff.x, y: hover("puff", camPuff.y, S31_PUFF.scale), scale: S31_PUFF.scale, who: "puff", side: "right" } }}
        text={{
          a3_45_puff: "That kite is not flying.",
          a3_47_puff: "That kite is missing ME.",
          a3_49_puff: "PUUUSH!",
        }}
        at={{
          // Up in the empty sky, with the tail down over Puff. The x values are
          // per line because the tail sits a fixed 54px inside the bubble's left
          // edge and the bubble is only as wide as its text: parked at one x,
          // the two-line bubbles pointed straight at the *kid*, who does not
          // speak in this episode and must never look like he does.
          a3_45_puff: { x: 706, y: 232, tail: "left" },
          a3_47_puff: { x: 706, y: 232, tail: "left" },
          a3_49_puff: { x: 553, y: 232, tail: "left" },
        }}
      />
      {/* A whisper of light as it goes up. Not a sting — the script is explicit
          that the ending has no music and no punctuation. */}
      {flying ? (
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse 70% 60% at 62% 26%, rgba(255,255,255,0.16) 0%, transparent 68%)",
            opacity: Math.min(1, t / 20),
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * The kite, going up.
 *
 * Four beats inside the payoff: it tears off the grass (0–8), the line comes
 * tight (8), it climbs away on an arc (8–80), and then it just keeps going,
 * because a kite that stops at a mark reads as a kite that has arrived.
 */
function kiteClimb(t: number): {
  x: number;
  y: number;
  rot: number;
  slack: number;
  life: number;
  flat: boolean;
} {
  const rest = HILL_MARKS.kiteRest;
  if (t < 0) {
    return { ...rest, rot: HILL_MARKS.kiteRestRot, slack: 1, life: 0, flat: true };
  }
  if (t < 8) {
    // The snap off the grass: it comes up on its nose, fast.
    const u = kidEase.easeOutQuad(t / 8);
    return {
      x: rest.x + u * 26,
      y: rest.y - u * 96,
      rot: HILL_MARKS.kiteRestRot + (10 - HILL_MARKS.kiteRestRot) * u,
      slack: 1 - u,
      life: u,
      flat: t < 2,
    };
  }
  const u = (t - 8) / 74;
  const p = moveAlong(
    { x: rest.x + 26, y: rest.y - 96 },
    { x: 1470, y: -230 },
    Math.min(1.35, u),
    { arc: 0.12, bias: 0.9, ease: kidEase.easeOutSine },
  );
  return {
    x: p.x,
    y: p.y,
    rot: 10 - Math.min(1, u) * 22 + Math.sin(t / 9) * 3,
    slack: 0,
    life: 1,
    flat: false,
  };
}

// ---------------------------------------------------------------------------
// Scene 32 — Look what they CAN see
// ---------------------------------------------------------------------------
//
// The repetition gag's third and last firing, and the only place in the episode
// Puff is at full opacity.
//
// The beetle is Scene 4's beetle, and that is not a resemblance: the component,
// the mark (1320, 560), the scale (1.4), the `SpeakerVisual` mapping and the
// pupil sweep are the same as `CreatureBeat` in act1.tsx uses, and the hill
// behind him is drawn without a camera so the numbers land on screen exactly as
// they do in Act One. He is a foreground beetle in a wide shot, which is why he
// gets a foreground clump of grass to sit in front of.

const S32_BEETLE = { x: 1320, y: 560, scale: 1.4 };
const S32_PUFF = { x: 250, y: 640, scale: 1.15 };
const S32_KITE = { x: 1580, y: 196 };

const WhatTheyCanSeeScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const visual: SpeakerVisual = { a3_51_narrator: "beetle" };
  const stage = useStage(scene, visual);

  const [askFrom, askTo] = lineWindow(scene, "a3_51_narrator");
  const [beatFrom] = heldBeat(scene, "a3_51_narrator");

  // The beetle wanders in during the first line and is on his mark, at exactly
  // Scene 4's size, before he says a word.
  const walkU = kidEase.easeInOutSine((frame - 30) / 96);
  const beetleX = 2060 + (S32_BEETLE.x - 2060) * walkU;

  // The pupil sweep, lifted from act1's CreatureBeat: right to left across the
  // whole eye, through the bearing Puff is standing on, and away to the middle
  // distance. Identical, because the joke is that it is identical.
  const scan = kidEase.easeInOutSine(lineProgress(scene, "a3_51_narrator", frame));
  const looking = frame >= askFrom && frame < askTo;
  const cross = Math.min(1, scan / 0.7);
  const beyond = Math.max(0, (scan - 0.7) / 0.3);
  const beetleLook = looking
    ? { x: 0.55 - cross * 1.5 + beyond * 0.3, y: 0.16 - cross * 0.12 - beyond * 0.5 }
    : { x: 0.4, y: -0.34 };

  const emotion = useEmotion(
    scene,
    "puff",
    { a3_52_puff: "proud", a3_54_puff: "proud" },
    "happy",
    // Two 45f held beats in this scene.
    NO_LEAD,
    visual,
  );

  const kidX = HILL_MARKS.kidX;
  const kid: KidPlacement = {
    x: kidX,
    y: kidYAt(kidX),
    scale: HILL_MARKS.kidScale,
    flip: true,
    armsUp: 0.42,
  };
  const hand = kidHand(kid);

  const puffY = hover("puff", S32_PUFF.y, S32_PUFF.scale);
  const cast: Cast = {
    puff: { x: S32_PUFF.x, y: puffY, scale: S32_PUFF.scale, who: "puff", side: "right" },
    beetle: { x: beetleX, y: S32_BEETLE.y, scale: S32_BEETLE.scale, who: "beetle", side: "left" },
  };

  return (
    <AbsoluteFill>
      <PaintedSky bg="hill_day" drift={10} phase={1} dy={-190} />
      <Hill wind={0.5} crest={HILL_MARKS.crest} />
      <KidContactShadow x={kidX} y={hillY(kidX, HILL_MARKS.crest)} rx={104} ry={20} />
      <KiteString from={hand} to={S32_KITE} slack={0.05} />
      <KidSilhouette {...kid} />
      <Kite x={S32_KITE.x} y={S32_KITE.y} scale={0.55} rot={-12} life={1} />
      <Puff
        x={S32_PUFF.x}
        y={puffY}
        scale={S32_PUFF.scale}
        // The first frame of the episode he is all the way here. Nobody says a
        // word about it, and nothing else in the scene marks it either.
        opacity={PUFF_OPACITY.full}
        phase={PHASE.puff}
        emotion={emotion}
        speaking={stage.speaking("puff")}
        look={frame >= beatFrom ? { x: 0.85, y: -0.55 } : { x: 0.7, y: -0.6 }}
        idle={frame >= beatFrom && frame < beatFrom + 45 ? 0.4 : 0.9}
        wisps={2}
      />
      {/* Foreground grass for the beetle to arrive through. */}
      <ForegroundTuft x={S32_BEETLE.x + 40} />
      <Beetle
        x={beetleX}
        y={S32_BEETLE.y}
        scale={S32_BEETLE.scale}
        phase={PHASE.beetle}
        speaking={stage.speaking("beetle")}
        look={beetleLook}
        emotion="neutral"
        eyeLife={0.3}
        idle={0.45}
        zIndex={26}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={{
          // Word for word identical to Scenes 4 and 5. Do not vary these.
          a3_51_narrator: "Hello? Is somebody there?",
          a3_52_puff: "Yes. Yes, there is.",
          a3_54_puff: "But look what they CAN see.",
        }}
        visual={visual}
        // Narrower than the house 660 for this scene only. Three bodies share
        // the frame and the kid is between the other two: at full width every
        // bubble in the scene overlapped his head, and the kid does not speak
        // in this episode, in any scene, on any account.
        maxWidth={480}
        at={{
          a3_51_narrator: { x: 1200, y: 220, tail: "right" },
          a3_52_puff: { x: 430, y: 290, tail: "left" },
          a3_54_puff: { x: 430, y: 290, tail: "left" },
        }}
      />
    </AbsoluteFill>
  );
};

/** A clump of grass in the very front of frame, at beetle scale. */
const ForegroundTuft: React.FC<{ x: number }> = ({ x }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <WideLayer zIndex={24}>
      {Array.from({ length: 7 }, (_, i) => {
        const bx = x - 220 + i * 76;
        const h = 300 + ((i * 97) % 200);
        const lean = Math.sin(t * 1.1 + i) * 14;
        return (
          <path
            key={i}
            d={`M ${bx - 26} 1120 Q ${bx - 10 + lean} ${1120 - h * 0.6} ${bx + lean * 2} ${1120 - h} Q ${bx + 24 + lean} ${1120 - h * 0.55} ${bx + 26} 1120 Z`}
            fill={i % 2 ? kidTheme.grassDark : "#2e8f3e"}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------

export const ACT3_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s23_beach: BeachScene,
  s24_hot_sand_cool_sea: HotSandCoolSeaScene,
  s25_beach_makes_wind: BeachMakesWindScene,
  s26_bigword_sea_breeze: BigWordSeaBreezeScene,
  s27_sailboat: SailboatScene,
  s28_turbines: TurbinesScene,
  s29_seeds: SeedsScene,
  s30_door_to_door: DoorToDoorScene,
  s31_the_hill: TheHillScene,
  s32_what_they_can_see: WhatTheyCanSeeScene,
};

// Shared with recap.tsx: Scene 33's sea-breeze panel is this act's beach, and
// Scene 35's leaf is the same green the Amazon is drawn in.
export { BeachWorld, Gulls, HORIZON, SAND, SAND_DARK, SEA_FAR, SEA_MID, SEA_NEAR, shoreX };
