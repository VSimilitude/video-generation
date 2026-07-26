import React from "react";
import { Easing } from "remotion";
import {
  Blobby,
  Cloudia,
  Drip,
  Sunny,
  kidOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  lookAt,
  mixHex,
  type Emotion,
} from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  ACT_COLOR,
  AbsoluteFill,
  BigWordBeat,
  Bubbles,
  Camera,
  CutFlash,
  NameArrow,
  PHASE,
  SkyBlend,
  Thermometer,
  Vignette,
  WaterBand,
  WideLayer,
  crownOf,
  interpolate,
  lineProgress,
  lineWindow,
  midOf,
  spring,
  stand,
  useCurrentFrame,
  useEmotion,
  useLookAtSpeaker,
  useVideoConfig,
  type Cast,
  type Mark,
  type TimedScene,
} from "./common";

// ACT TWO — THE SKY. Scenes 12–21 of script.md: the real ascent, the Cloud
// Hotel, the pillow myth, condensation, and a hotel that fills until it cannot
// stay up.
//
// The act has one prop and one number. The prop is `CloudBlob` — every cloud in
// these ten scenes (the hotel, the terrace, the mist, the wall Drip falls
// through) is the same union-of-circles drawn twice, once stroked and once
// fill-only, exactly as Cloudia's own body is: that is what makes her look like
// she is *made of her hotel*. The number is `grey` (0 white .. 1 storm), which
// is the same 0..1 as Cloudia's `fill` prop, so the building and its manager
// darken together from Scene 19 to Scene 21 off one shared value.

// ---------------------------------------------------------------------------
// The act's cloud kit
// ---------------------------------------------------------------------------

/**
 * A cloud's three paints at a given greyness. Same ramps as Cloudia
 * (characters/Cloudia.tsx), on purpose — a hotel built from a different white
 * than its manager reads as two shows.
 */
function cloudPaint(grey: number) {
  const g = Math.max(0, Math.min(1, grey));
  return {
    top: mixHex(kidTheme.cloud, kidTheme.cloudGrey, g * 0.92),
    bottom: mixHex(kidTheme.cloudShade, kidTheme.cloudStorm, g),
    // A white cloud on a pale blue sky has no silhouette without this.
    edge: mixHex("#7d93aa", "#33414f", g),
  };
}

/**
 * One cloud: a rounded slab with a row of puffs on top, drawn twice — filled
 * *and* thickly stroked, then fill-only over it. The second pass covers every
 * interior seam, so a union of circles gets one clean outline with no mask and
 * no hand-built path. Draw it inside a `<WideLayer>` (or any svg).
 *
 * `droop` hangs the underside lobes lower — Scene 21's sagging hotel.
 */
const CloudBlob: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  /** 0 white .. 1 storm grey. */
  grey?: number;
  /** Shifts the puff pattern; two clouds with the same seed are twins. */
  seed?: number;
  droop?: number;
  opacity?: number;
  stroke?: number;
}> = ({ x, y, w, h, grey = 0, seed = 0, droop = 0, opacity = 1, stroke = 12 }) => {
  const { top, bottom, edge } = cloudPaint(grey);
  const n = Math.max(3, Math.round(w / (h * 0.62)));
  const puffs = Array.from({ length: n }, (_, i) => {
    const u = n === 1 ? 0.5 : i / (n - 1);
    const r = h * (0.3 + 0.17 * Math.abs(Math.sin((i + seed) * 2.71)));
    return {
      cx: (u - 0.5) * (w - r * 1.4),
      cy: -h * 0.1 + Math.sin((i + seed) * 1.31) * h * 0.1 - r * 0.2,
      r,
    };
  });
  const slab = { x: -w / 2 + h * 0.1, y: -h * 0.06, w: w - h * 0.2, h: h * 0.5 };
  const lobes = [-0.4, -0.14, 0.14, 0.4].map((u, i) => ({
    cx: u * slab.w,
    cy: slab.y + slab.h * 0.74 + droop * (30 + 22 * Math.abs(Math.sin(i + seed))),
    r: h * (0.15 + 0.05 * Math.abs(Math.sin(i * 2.3 + seed))) * (1 + droop * 0.3),
  }));

  const shapes = (stroked: boolean) => (
    <>
      <rect
        x={slab.x}
        y={slab.y}
        width={slab.w}
        height={slab.h}
        rx={slab.h / 2}
        fill={bottom}
        stroke={stroked ? edge : "none"}
        strokeWidth={stroked ? stroke : 0}
      />
      {lobes.map((l, i) => (
        <circle
          key={`l${i}`}
          cx={l.cx}
          cy={l.cy}
          r={l.r}
          fill={bottom}
          stroke={stroked ? edge : "none"}
          strokeWidth={stroked ? stroke : 0}
        />
      ))}
      {puffs.map((p, i) => (
        <circle
          key={`p${i}`}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill={top}
          stroke={stroked ? edge : "none"}
          strokeWidth={stroked ? stroke : 0}
        />
      ))}
    </>
  );

  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      {shapes(true)}
      {shapes(false)}
      {/* Lit crown, so the top still reads as sunlit at full storm grey. */}
      <ellipse
        cx={-w * 0.1}
        cy={-h * 0.34}
        rx={w * 0.16}
        ry={h * 0.09}
        fill="#ffffff"
        opacity={0.4 - grey * 0.34}
      />
    </g>
  );
};

/**
 * The guests, seen as themselves: a churning grid of drops with faces. Scene 15
 * dives into it, Scenes 18–20 sit inside it. `spacing` is world px between
 * neighbours — packed tighter than a drop is wide, because "shoulder to
 * shoulder" is the whole point by Scene 20.
 */
const DropSwarm: React.FC<{
  cx: number;
  cy: number;
  halfW: number;
  halfH: number;
  spacing: number;
  scale: number;
  churn?: number;
  opacity?: number;
}> = ({ cx, cy, halfW, halfH, spacing, scale, churn = 1, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cols = Math.ceil((halfW * 2) / spacing);
  const rows = Math.ceil((halfH * 2) / spacing);
  const drops: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      // Deterministic jitter plus a slow orbit each: a grid that never stops
      // being a grid reads as tiles, and a cloud is not tiled.
      const jx = Math.sin(i * 12.9898) * spacing * 0.34;
      const jy = Math.cos(i * 7.233) * spacing * 0.3;
      drops.push(
        <Blobby
          key={i}
          x={cx - halfW + c * spacing + spacing / 2 + jx + Math.sin(t * 0.55 + i) * 11 * churn}
          y={cy - halfH + r * spacing + spacing / 2 + jy + Math.cos(t * 0.47 + i * 1.7) * 9 * churn}
          scale={scale * (0.84 + 0.3 * Math.abs(Math.sin(i * 4.1)))}
          phase={i * 0.83}
          mood={i % 4 === 0 ? "surprised" : i % 3 === 0 ? "calm" : "happy"}
          look={Math.sin(i * 2.2)}
          opacity={opacity}
        />,
      );
    }
  }
  return <>{drops}</>;
};

/**
 * The Cloud Hotel from outside: a cloud with floors, lit windows and a door.
 * `floors` is a whole number so Scene 19 can *sprout* one (each new band springs
 * in), and `guests` fills the windows with the drops that arrived.
 */
const CloudHotel: React.FC<{
  x: number;
  groundY: number;
  w: number;
  floors: number;
  grey?: number;
  droop?: number;
  guests?: number;
  /** Frame each floor above the first appeared, for its pop-in spring. */
  floorAt?: number[];
}> = ({ x, groundY, w, floors, grey = 0, droop = 0, guests = 0, floorAt = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { top, edge } = cloudPaint(grey);
  const bandH = w * 0.2;
  const bands = Array.from({ length: Math.max(1, floors) }, (_, i) => {
    const at = i === 0 ? -999 : (floorAt[i - 1] ?? 0);
    const pop = i === 0 ? 1 : spring({ frame: frame - at, fps, config: { damping: 11, mass: 0.7 } });
    return {
      i,
      pop,
      bw: w * (1 - i * 0.13),
      bh: bandH * (1 - i * 0.05),
      cy: groundY - bandH * 0.62 - i * bandH * 0.84,
    };
  });
  const doorW = w * 0.11;
  const lit = mixHex(kidTheme.star, kidTheme.sunLight, 0.4);

  return (
    <g>
      {/* Top floors first, so each lower band overlaps the one above it and
          the stack reads as one building rather than a pile of clouds. */}
      {bands
        .slice()
        .reverse()
        .map((b) => (
          <g key={b.i} opacity={Math.min(1, b.pop * 1.6)}>
            <g transform={`translate(${x} ${b.cy}) scale(${0.3 + 0.7 * b.pop}) translate(${-x} ${-b.cy})`}>
              <CloudBlob
                x={x}
                y={b.cy}
                w={b.bw}
                h={b.bh}
                grey={grey}
                seed={b.i * 1.7}
                droop={b.i === 0 ? droop : droop * 0.3}
              />
              {/* Windows. They stay lit as the cloud darkens — a black hotel
                  with no windows is a storm cloud, not a hotel. */}
              {Array.from({ length: 4 + b.i }, (_, k) => {
                const n = 4 + b.i;
                const u = n === 1 ? 0.5 : k / (n - 1);
                const wx = x + (u - 0.5) * b.bw * 0.62;
                const wy = b.cy + b.bh * 0.1;
                const ww = Math.min(46, b.bw * 0.06);
                const occupied = guests > (k + b.i * 2) / (n + b.i * 2 + 1);
                return (
                  <g key={k}>
                    <rect
                      x={wx - ww}
                      y={wy - ww}
                      width={ww * 2}
                      height={ww * 2}
                      rx={ww * 0.45}
                      fill={lit}
                      stroke={edge}
                      strokeWidth={6}
                    />
                    {occupied ? (
                      <Blobby x={wx} y={wy + ww * 0.5} scale={ww / 78} phase={k * 1.9 + b.i} />
                    ) : null}
                  </g>
                );
              })}
            </g>
          </g>
        ))}

      {/* Door, awning and plaque, on the ground floor. */}
      <g>
        <path
          d={
            `M ${x - doorW} ${groundY}` +
            ` L ${x - doorW} ${groundY - bandH * 0.5}` +
            ` A ${doorW} ${doorW} 0 0 1 ${x + doorW} ${groundY - bandH * 0.5}` +
            ` L ${x + doorW} ${groundY} Z`
          }
          fill={mixHex(kidTheme.cloudShade, kidTheme.ink, 0.45)}
          stroke={edge}
          strokeWidth={9}
        />
        <rect
          x={x - doorW * 2.2}
          y={groundY - bandH * 1.32}
          width={doorW * 4.4}
          height={bandH * 0.3}
          rx={12}
          fill={kidTheme.pink}
          stroke={kidTheme.ink}
          strokeWidth={7}
        />
        <text
          x={x}
          y={groundY - bandH * 1.12}
          textAnchor="middle"
          fontFamily={kidTheme.fontFamily}
          fontSize={Math.max(kidType.min, w * 0.045)}
          fontWeight={900}
          fill={kidTheme.paper}
          stroke={kidTheme.ink}
          strokeWidth={5}
          paintOrder="stroke"
        >
          CLOUD HOTEL
        </text>
      </g>
      {/* Standing on nothing is the Act Three joke; here it stands on its own
          base, so a faint underside shadow is all it needs. */}
      <ellipse cx={x} cy={groundY + 8} rx={w * 0.4} ry={16} fill={kidTheme.ink} opacity={0.08} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 12 — Up through the layers
// ---------------------------------------------------------------------------

// The real ascent. Scene 9 faked it by dropping the ocean out of frame; here
// the world is a *column* — sea, boats, gulls, cloud decks, an airliner, thin
// cirrus — and we climb past all of it while Drip stays framed.
//
// One number does it: `alt`, our altitude in world px. Anything in the column
// declares the altitude it sits at, and `sy()` turns that into a screen y. A
// thing at our altitude is at eye level; everything below slides down the
// frame. Adding scenery is adding one altitude, which is why the layer list
// below reads like a flight plan.
const S12_EYE = 560;
const S12_START_ALT = 380;
const S12_TOP_ALT = 5400;
const S12_DRIP_X = 700;
const S12_GROUND = 760;

const S12_BUBBLES: Record<string, string> = {
  a2_02_drip: "Why is it so COLD?",
  a2_04_drip: "I'm getting droppy again!",
};

const LayersScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = scene.durationInFrames;

  const [coldFrom] = lineWindow(scene, "a2_02_drip");
  const [explainFrom] = lineWindow(scene, "a2_03_narrator");
  const [droppyFrom] = lineWindow(scene, "a2_04_drip");

  // Eased at both ends: the ocean is worth a beat at the bottom, and arriving
  // at cloud level slowly is what hands Scene 13 its reveal.
  const alt = interpolate(frame, [0, dur], [S12_START_ALT, S12_TOP_ALT], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const climbU = (alt - S12_START_ALT) / (S12_TOP_ALT - S12_START_ALT);
  const sy = (a: number) => S12_EYE + (alt - a);
  // Climb *rate*, in px/frame — the ascent streaks key off it, so they thin out
  // exactly when the ascent does.
  const rate = Math.max(
    0,
    alt -
      interpolate(frame - 1, [0, dur], [S12_START_ALT, S12_TOP_ALT], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      }),
  );

  const chill = interpolate(climbU, [0.12, 0.62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shiverAmp = chill * 4.5;
  const t = frame / fps;
  const shakeX = Math.sin(t * 21) * shiverAmp + Math.sin(t * 33) * shiverAmp * 0.4;
  const shakeY = Math.cos(t * 27) * shiverAmp * 0.5;

  // The fear is a face, not a line: `scared`'s wobble mouth hard-cuts the frame
  // a line starts, so it lands in Drip's silence under the narrator and he has
  // settled into `amazed` well before he opens his mouth again.
  let emotion: Emotion = frame < coldFrom - 8 ? "amazed" : "grumpy";
  if (frame >= explainFrom + 12 && frame < droppyFrom - 12) emotion = "scared";
  else if (frame >= droppyFrom - 12) emotion = "amazed";
  // Hugging himself for the whole cold stretch.
  const hugging = frame >= coldFrom - 8 && frame < droppyFrom - 12;

  // "I can feel myself getting droppy again": he rounds out on the last line.
  const droppy = interpolate(frame, [droppyFrom - 10, droppyFrom + 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dripY = stand("drip", S12_GROUND);
  const cast: Cast = {
    drip: { x: S12_DRIP_X, y: dripY, scale: 1, who: "drip", side: "right" },
  };

  return (
    <AbsoluteFill>
      {/* Thin blue: the sky darkens as the air runs out. `night` at a low mix is
          the deep blue of altitude, not nightfall. */}
      <SkyBlend from="day" to="night" u={climbU * 0.42} clouds={0} stars={false} waves={false} />
      {/* The sea, going away. */}
      <WaterBand top={sy(0)} warmth={0.35} />
      <WideLayer>
        <Layers sy={sy} alt={alt} frame={frame} />
      </WideLayer>
      <AscentStreaks rate={rate} />
      {/* The rest of the ocean is coming up too, at very nearly his speed —
          kept out of the middle third, which belongs to Drip and his bubble. */}
      <WideLayer>
        {[120, 380, 1290, 1560, 1810].map((lane, i) => (
          <Blobby
            key={lane}
            x={lane + Math.sin(frame / 30 + i) * 26}
            y={((i * 331 + frame * 0.55) % 1500) - 210}
            scale={0.34 + (i % 3) * 0.1}
            phase={i * 1.7}
            mood={i % 3 === 0 ? "surprised" : "happy"}
            opacity={0.85}
          />
        ))}
      </WideLayer>

      <Camera
        cam={{
          x: S12_DRIP_X,
          y: S12_GROUND,
          zoom: 1 + droppy * 0.1,
          zoomY: 1 + droppy * 0.03,
        }}
      >
        <Drip
          x={S12_DRIP_X + shakeX}
          y={dripY + shakeY}
          scale={1}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          idle={1.3}
          pose={hugging ? "clutch" : undefined}
          look={climbU < 0.3 ? "down" : "up"}
        />
      </Camera>
      {/* Condensation starting on him, on the line where he says so. */}
      {droppy > 0.05 ? <DroppySparks x={S12_DRIP_X} y={midOf("drip", dripY, 1)} u={droppy} /> : null}

      <Thermometer x={1790} y={520} level={interpolate(chill, [0, 1], [0.8, 0.09])} scale={0.85} label="COLD" />
      {/* Frost creeping in from the edges as the gauge falls. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 72% 66% at 50% 48%, transparent 40%, rgba(197,236,255,${0.5 * chill}) 100%)`,
          pointerEvents: "none",
        }}
      />
      <Bubbles scene={scene} cast={cast} text={S12_BUBBLES} />
    </AbsoluteFill>
  );
};

/** Everything we climb past, each at the altitude it lives at. */
const Layers: React.FC<{ sy: (a: number) => number; alt: number; frame: number }> = ({
  sy,
  alt,
  frame,
}) => {
  const shown = (a: number, pad = 700) => sy(a) > -pad && sy(a) < 1080 + pad;
  return (
    <g>
      {/* Boats on the water. */}
      {shown(60) ? (
        <g>
          <Boat x={430} y={sy(60)} scale={1} />
          <Boat x={1310} y={sy(46)} scale={0.72} />
        </g>
      ) : null}
      {/* Gulls — "past the birds", which is the first thing he passes. */}
      {[
        { a: 560, x: 380, s: 1 },
        { a: 660, x: 1180, s: 0.8 },
        { a: 760, x: 720, s: 0.62 },
        { a: 900, x: 1520, s: 0.9 },
      ].map((g) =>
        shown(g.a) ? (
          <Gull key={g.a} x={g.x + Math.sin(frame / 40 + g.a) * 60} y={sy(g.a)} scale={g.s} phase={g.a} />
        ) : null,
      )}
      {/* "Past the airplanes." Drifting left as we pass it — parallax is the
          only thing that stops a plane at this size reading as a sticker. */}
      {shown(1150, 900) ? <Plane x={1400 - (alt - 620) * 0.5} y={sy(1150)} /> : null}
      {/* Two decks of ordinary cloud on the way up. */}
      {[
        { a: 1850, x: 560, w: 820, h: 220, seed: 1 },
        { a: 2050, x: 1500, w: 640, h: 180, seed: 4 },
        { a: 2650, x: 300, w: 700, h: 200, seed: 2 },
        { a: 2850, x: 1350, w: 900, h: 240, seed: 6 },
      ].map((c) =>
        shown(c.a, 900) ? (
          <CloudBlob
            key={c.a}
            x={c.x + Math.sin(frame / 90 + c.seed) * 30}
            y={sy(c.a)}
            w={c.w}
            h={c.h}
            opacity={0.95}
            seed={c.seed}
          />
        ) : null,
      )}
      {/* Thin cirrus: at this height clouds are streaks, not puffs. */}
      {[3150, 3400, 3650, 3900, 4300].map((a, i) =>
        shown(a, 400) ? (
          <g key={a} opacity={0.5}>
            {[0, 1, 2].map((k) => (
              <path
                key={k}
                d={`M ${-200 + k * 620 + i * 180} ${sy(a) + k * 26} q 260 ${-30 - k * 8} 620 ${-4}`}
                stroke="#ffffff"
                strokeWidth={14 - k * 3}
                strokeLinecap="round"
                fill="none"
              />
            ))}
          </g>
        ) : null,
      )}
      {/* Cloud level: the neighbourhood Scene 13 opens in, arriving from above. */}
      {shown(5980, 1200) ? (
        <g>
          <CloudBlob x={520} y={sy(5980)} w={1100} h={300} seed={3} />
          <CloudBlob x={1560} y={sy(6120)} w={900} h={260} seed={8} />
        </g>
      ) : null}
    </g>
  );
};

const Boat: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path
      d="M -86 0 L 86 0 L 58 42 L -58 42 Z"
      fill={kidTheme.tomato}
      stroke={kidTheme.ink}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path d="M 0 -6 L 0 -104" stroke={kidTheme.ink} strokeWidth={8} strokeLinecap="round" />
    <path
      d="M 6 -100 L 70 -14 L 6 -14 Z"
      fill={kidTheme.paper}
      stroke={kidTheme.ink}
      strokeWidth={7}
      strokeLinejoin="round"
    />
  </g>
);

const Gull: React.FC<{ x: number; y: number; scale: number; phase: number }> = ({
  x,
  y,
  scale,
  phase,
}) => {
  const frame = useCurrentFrame();
  // The wings never straighten out: a gull drawn as two flat lines is a dash.
  const flap = Math.sin(frame / 4 + phase) * 12;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d={`M -66 0 q 33 ${-30 - flap} 66 0 q 33 ${-30 - flap} 66 0`}
        stroke={kidTheme.ink}
        strokeWidth={9}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
};

/** "Past the airplanes." One chunky airliner, seen from below and behind. */
const Plane: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={230} ry={46} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={9} />
    <path
      d="M -40 -8 L 40 -8 L 190 -96 L 120 -96 Z"
      fill={kidTheme.cloudShade}
      stroke={kidTheme.ink}
      strokeWidth={9}
      strokeLinejoin="round"
    />
    <path
      d="M -40 8 L 40 8 L 190 96 L 120 96 Z"
      fill={kidTheme.cloudShade}
      stroke={kidTheme.ink}
      strokeWidth={9}
      strokeLinejoin="round"
    />
    <path
      d="M -196 -6 L -150 -6 L -206 -90 L -240 -90 Z"
      fill={kidTheme.water}
      stroke={kidTheme.ink}
      strokeWidth={9}
      strokeLinejoin="round"
    />
    <path d="M 208 -12 q 34 12 0 24" stroke={kidTheme.ink} strokeWidth={9} fill="none" strokeLinecap="round" />
    {[-120, -60, 0, 60, 120].map((wx) => (
      <circle key={wx} cx={wx} cy={-8} r={13} fill={kidTheme.waterLight} stroke={kidTheme.ink} strokeWidth={5} />
    ))}
  </g>
);

/** Vertical streaks pulled down past the camera. The ascent, made visible. */
const AscentStreaks: React.FC<{ rate: number }> = ({ rate }) => {
  const frame = useCurrentFrame();
  const strength = Math.min(1, rate / 12);
  if (strength <= 0.02) return null;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {Array.from({ length: 14 }, (_, i) => {
        const x = ((i * 173) % 1920) + 40;
        const len = 120 + (i % 4) * 90;
        const y = ((frame * (14 + (i % 5) * 5) + i * 311) % (1080 + 400)) - 300;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={5 + (i % 3) * 3}
            height={len}
            rx={3}
            fill="#ffffff"
            opacity={0.16 * strength}
          />
        );
      })}
    </svg>
  );
};

/** Condensation beading on Drip: he is turning back into a drop. */
const DroppySparks: React.FC<{ x: number; y: number; u: number }> = ({ x, y, u }) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      {Array.from({ length: 7 }, (_, i) => {
        const ang = (i / 7) * Math.PI * 2 + frame / 60;
        const r = 150 + Math.sin(frame / 12 + i) * 14;
        return (
          <circle
            key={i}
            cx={Math.cos(ang) * r * 1.1}
            cy={Math.sin(ang) * r * 0.85}
            r={9 + (i % 3) * 4}
            fill={kidTheme.waterLight}
            stroke={kidTheme.waterDeep}
            strokeWidth={4}
            opacity={u * (0.5 + 0.5 * Math.sin(frame / 9 + i))}
          />
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 13 — The Cloud Hotel
// ---------------------------------------------------------------------------

const S13_GROUND = 950;
const S13_DOOR_X = 560;
const S13_CLOUDIA: Mark = {
  x: 1430,
  y: stand("cloudia", S13_GROUND),
  scale: 1.05,
  who: "cloudia",
  side: "left",
};
const S13_DRIP = { x: 1010, y: stand("drip", 995) };

const CloudHotelScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const mist = lineProgress(scene, "a2_05_narrator", frame);
  const [, doorTo] = lineWindow(scene, "a2_05_narrator");
  const [cloudiaFrom] = lineWindow(scene, "a2_06_cloudia");
  // She sweeps in on the beat before her line, not on it.
  const enterAt = Math.max(0, cloudiaFrom - 22);
  const bell = frame - (enterAt + 10);

  const cast: Cast = { cloudia: S13_CLOUDIA };
  const dripMid = { x: S13_DRIP.x, y: midOf("drip", S13_DRIP.y, 0.62) };

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={0.16} clouds={2} waves={false} />
      <WideLayer>
        {/* The facade, and the terrace they are standing on. */}
        <CloudBlob x={520} y={470} w={1560} h={520} seed={2} />
        <CloudBlob x={1500} y={560} w={900} h={340} seed={7} opacity={0.96} />
        <CloudBlob x={860} y={S13_GROUND + 130} w={2400} h={330} seed={5} />
        <Doorway x={S13_DOOR_X} groundY={S13_GROUND} />
        <Doorman x={S13_DOOR_X + 300} groundY={S13_GROUND} />
        <Bell x={S13_DOOR_X - 300} y={S13_GROUND - 250} ring={bell} />
      </WideLayer>
      <HotelSign x={S13_DOOR_X} y={230} from={Math.round(doorTo * 0.55)} />

      <Drip
        {...S13_DRIP}
        scale={0.62}
        emotion={useEmotion(scene, "drip", {}, "amazed")}
        phase={PHASE.drip}
        shadow={false}
        idle={0.9}
        look={lookAt(dripMid, { x: S13_DOOR_X, y: S13_GROUND - 320 }, 900)}
      />
      <Cloudia
        x={S13_CLOUDIA.x}
        y={S13_CLOUDIA.y}
        scale={S13_CLOUDIA.scale}
        fill={0}
        clipboard
        emotion="proud"
        speaking={useSpeaking(scene, "cloudia")}
        phase={PHASE.cloudia}
        enter={{ at: enterAt, kind: "slideLeft" }}
        look={lookAt(
          { x: S13_CLOUDIA.x, y: midOf("cloudia", S13_CLOUDIA.y, S13_CLOUDIA.scale) },
          dripMid,
          900,
        )}
      />

      {/* Mist, parting on the door. Two banks that slide out of frame over the
          narrator's line — the reveal is his sentence, so it runs at his pace. */}
      <MistBanks u={mist} />
      <Bubbles
        scene={scene}
        cast={cast}
        text={{ a2_06_cloudia: "Welcome to the CLOUD HOTEL!" }}
        // Right of centre: the hotel's own sign owns the top-left corner.
        at={{ a2_06_cloudia: { x: 1230, y: 360, tail: "right" } }}
      />
    </AbsoluteFill>
  );
};

/** The grand doorway: arch, carpet, awning. */
const Doorway: React.FC<{ x: number; groundY: number }> = ({ x, groundY }) => {
  const w = 190;
  const top = groundY - 470;
  return (
    <g>
      <path
        d={`M ${x - w} ${groundY} L ${x - w} ${top + w} A ${w} ${w} 0 0 1 ${x + w} ${top + w} L ${x + w} ${groundY} Z`}
        fill="#6b4f7a"
        stroke={kidTheme.ink}
        strokeWidth={11}
        strokeLinejoin="round"
      />
      {/* Warm light from inside — the one warm thing in a cold act. */}
      <path
        d={`M ${x - w + 26} ${groundY} L ${x - w + 26} ${top + w} A ${w - 26} ${w - 26} 0 0 1 ${x + w - 26} ${top + w} L ${x + w - 26} ${groundY} Z`}
        fill={kidTheme.sunLight}
        opacity={0.4}
      />
      {/* Two doors, with handles: the seam alone reads as a garage. */}
      <path d={`M ${x} ${top + 30} L ${x} ${groundY}`} stroke={kidTheme.ink} strokeWidth={8} opacity={0.5} />
      {[-1, 1].map((s) => (
        <circle key={s} cx={x + s * 42} cy={groundY - 230} r={15} fill={kidTheme.sun} stroke={kidTheme.ink} strokeWidth={7} />
      ))}
      <rect x={x - w - 60} y={groundY - 16} width={(w + 60) * 2} height={26} rx={13} fill={kidTheme.tomato} stroke={kidTheme.ink} strokeWidth={7} />
      {/* Awning: scalloped, striped, and wider than the door. */}
      <g>
        {Array.from({ length: 7 }, (_, i) => {
          const bw = (w * 2.9) / 7;
          const bx = x - w * 1.45 + i * bw;
          return (
            <path
              key={i}
              d={`M ${bx + bw * 0.16} ${top - 74} L ${bx + bw} ${top - 74} L ${bx + bw} ${top + 10} q ${-bw / 2} 44 ${-bw} 0 Z`}
              fill={i % 2 ? kidTheme.paper : kidTheme.pink}
              stroke={kidTheme.ink}
              strokeWidth={7}
              strokeLinejoin="round"
            />
          );
        })}
        <rect x={x - w * 1.5} y={top - 88} width={w * 3} height={30} rx={15} fill={kidTheme.pinkDeep} stroke={kidTheme.ink} strokeWidth={7} />
      </g>
    </g>
  );
};

/** "A swirl of a doorman": a cloud wisp in a bellhop cap. */
const Doorman: React.FC<{ x: number; groundY: number }> = ({ x, groundY }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 26) * 8;
  const y = groundY - 190 + bob;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* A body with the head *overlapping* it: drawn apart, the cap and face
          floated above a separate blob and read as a snowman. */}
      <g stroke="#7d93aa" strokeWidth={9}>
        <ellipse cx={20} cy={30} rx={70} ry={52} fill={kidTheme.cloud} />
        <circle cx={-32} cy={4} r={38} fill={kidTheme.cloud} />
        <circle cx={44} cy={-42} r={56} fill={kidTheme.cloud} />
      </g>
      <g fill={kidTheme.cloud}>
        <ellipse cx={20} cy={30} rx={70} ry={52} />
        <circle cx={-32} cy={4} r={38} />
        <circle cx={44} cy={-42} r={56} />
      </g>
      <circle cx={28} cy={-48} r={7} fill={kidTheme.ink} />
      <circle cx={62} cy={-48} r={7} fill={kidTheme.ink} />
      <path d="M 30 -24 q 16 12 32 0" stroke={kidTheme.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path
        d="M -6 -84 L 94 -84 L 86 -110 L 2 -110 Z"
        fill={kidTheme.tomato}
        stroke={kidTheme.ink}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      <rect x={-8} y={-88} width={104} height={16} rx={8} fill={kidTheme.pinkDeep} stroke={kidTheme.ink} strokeWidth={5} />
    </g>
  );
};

/** Brass bell on a post. It rings when Cloudia sweeps in. */
const Bell: React.FC<{ x: number; y: number; ring: number }> = ({ x, y, ring }) => {
  const swing = ring > 0 && ring < 40 ? Math.sin(ring * 0.7) * 14 * Math.max(0, 1 - ring / 40) : 0;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-14} y={0} width={28} height={250} rx={14} fill={kidTheme.sunDark} stroke={kidTheme.ink} strokeWidth={7} />
      {/* A dome alone is a lamp. The flared rim, the crown loop and the clapper
          are what make it a bell. */}
      <g transform={`rotate(${swing})`}>
        <path
          d="M -58 -6 q 0 -78 58 -78 q 58 0 58 78 Z"
          fill={kidTheme.sun}
          stroke={kidTheme.ink}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        <rect x={-76} y={-14} width={152} height={26} rx={13} fill={kidTheme.sun} stroke={kidTheme.ink} strokeWidth={8} />
        <path d="M 0 -84 q -18 -20 0 -34 q 18 14 0 34" fill="none" stroke={kidTheme.ink} strokeWidth={9} />
        <circle cx={0} cy={26} r={15} fill={kidTheme.sunDeep} stroke={kidTheme.ink} strokeWidth={6} />
      </g>
      {swing !== 0
        ? [-1, 1].map((s) => (
            <path
              key={s}
              d={`M ${s * 100} -70 q ${s * 34} 22 0 44`}
              stroke={kidTheme.star}
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              opacity={Math.abs(swing) / 14}
            />
          ))
        : null}
    </g>
  );
};

const HotelSign: React.FC<{ x: number; y: number; from: number }> = ({ x, y, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 11, mass: 0.7 } });
  if (s <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${-2.5 + (1 - s) * 8}deg)`,
        background: kidTheme.paper,
        border: `9px solid ${kidTheme.ink}`,
        borderRadius: kidRadius.card,
        padding: "10px 40px",
        boxShadow: kidShadow(1.2),
        fontFamily: kidTheme.fontFamily,
        fontSize: kidType.min,
        fontWeight: 900,
        letterSpacing: 3,
        color: kidTheme.ink,
        whiteSpace: "nowrap",
      }}
    >
      ✦ CLOUD HOTEL ✦
    </div>
  );
};

/** Two banks of mist, parting. */
const MistBanks: React.FC<{ u: number }> = ({ u }) => {
  const frame = useCurrentFrame();
  const shift = interpolate(u, [0, 1], [0, 1500], { easing: Easing.inOut(Easing.quad) });
  const fade = interpolate(u, [0.25, 0.95], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (fade <= 0.01) return null;
  return (
    <WideLayer opacity={fade}>
      <g transform={`translate(${-shift} ${Math.sin(frame / 50) * 12})`}>
        <CloudBlob x={340} y={520} w={1800} h={760} seed={11} opacity={0.94} stroke={0} />
        <CloudBlob x={-140} y={880} w={1500} h={620} seed={13} opacity={0.9} stroke={0} />
      </g>
      <g transform={`translate(${shift} ${Math.sin(frame / 42 + 2) * 12})`}>
        <CloudBlob x={1620} y={480} w={1800} h={780} seed={17} opacity={0.94} stroke={0} />
        <CloudBlob x={2050} y={860} w={1500} h={620} seed={19} opacity={0.9} stroke={0} />
      </g>
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 14 — Myth-bust: clouds are not pillows
// ---------------------------------------------------------------------------

// The gag is two-phase and both phases have to be legible: he lands *on* the
// cloud (squash, puff, a beat of "it worked"), and only then goes through it.
// The shelf is drawn after Drip, so falling through it is literal — he passes
// behind the fill and comes back out under the bottom edge.
// The shelf's *visual* top, not its centre: a CloudBlob's puffs stand well
// above the y it is drawn at, and standing a character on the centre buries him
// to the waist (which is exactly what the first pass did).
const S14_SHELF_Y = 820;
const S14_SHELF_H = 230;
const S14_SHELF_TOP = 700;
const S14_DRIP_X = 700;
// Land, hold for the length of a "…huh?", sink, drop out. The hold is the beat
// that makes it a myth-bust rather than a fall: for a moment the cloud *is* a
// pillow, and then it is not.
const S14_FLOP = 200;
const S14_CONTACT = S14_FLOP + 22;
const S14_THROUGH = S14_CONTACT + 14;
const S14_OUT = S14_THROUGH + 18;
/** The stamp thuds on as he comes out the bottom. */
const S14_STAMP = S14_OUT - 2;

const S14_CLOUDIA: Mark = {
  x: 1440,
  y: stand("cloudia", S14_SHELF_TOP + 40),
  scale: 0.95,
  who: "cloudia",
  side: "left",
};

const S14_BUBBLES: Record<string, string> = {
  a2_07_drip: "A giant fluffy pillow?",
  a2_08_cloudia: "A PILLOW? Absolutely not.",
};

const MythPillowScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();

  // Lean back, land, sink, drop out the bottom. Every phase is a straight
  // interpolate on one ground line, so the two halves of the gag share a body.
  const ground = interpolate(
    frame,
    [S14_FLOP, S14_CONTACT, S14_THROUGH, S14_OUT, S14_OUT + 40],
    [S14_SHELF_TOP, S14_SHELF_TOP + 20, S14_SHELF_TOP + 130, 1210, 1265],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) },
  );
  // He drops out of the bottom of the cloud, so the shot goes with him. There
  // is no bubble up after the foomp, which is what makes a whole-frame move
  // safe here.
  const follow = interpolate(frame, [S14_THROUGH - 4, S14_OUT + 14], [0, -320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const lean = interpolate(frame, [S14_FLOP, S14_CONTACT], [0, -24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spin = interpolate(frame, [S14_THROUGH, S14_OUT + 30], [-24, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The foomp: a hard squash on contact that recovers over 10 frames.
  const since = frame - S14_CONTACT;
  const squash = since >= 0 && since < 12 ? 1 - 0.26 * Math.max(0, 1 - since / 12) : 1;

  const dripY = stand("drip", ground);
  // Under the cloud there is nothing to look at but the camera, which is the
  // joke: he checks whether we saw.
  let emotion: Emotion = frame < S14_FLOP - 8 ? "excited" : "happy";
  if (frame >= S14_CONTACT - 6 && frame < S14_OUT + 60) emotion = "scared";
  else if (frame >= S14_OUT + 60) emotion = "grumpy";

  const cast: Cast = {
    drip: { x: S14_DRIP_X, y: stand("drip", S14_SHELF_TOP), scale: 1.05, who: "drip", side: "right" },
    cloudia: S14_CLOUDIA,
  };

  // Unconditional: once Drip is through the shelf Cloudia looks down at the hole
  // rather than at whoever is talking, but the *hook* has to run on every frame
  // either way. Calling it inside the ternary below changed this component's
  // hook count on the frame the branch flipped (S14_CONTACT), which is React
  // error #300 — a crash that only appears when frames render contiguously.
  const cloudiaLook = useLookAtSpeaker(scene, cast, "cloudia", "left");

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={0.16} clouds={2} waves={false} />
      <Camera cam={{ x: 960, y: 540, dy: follow }}>
        <WideLayer>
          <CloudBlob x={1500} y={330} w={1000} h={300} seed={9} opacity={0.9} />
        </WideLayer>

        <Camera
          cam={{
            x: S14_DRIP_X,
            y: ground,
            zoomY: squash,
            zoom: 1 + (1 - squash) * 0.35,
            rotate: frame < S14_CONTACT ? lean : spin,
          }}
        >
          <Drip
            x={S14_DRIP_X}
            y={dripY}
            scale={1.05}
            emotion={emotion}
            speaking={useSpeaking(scene, "drip")}
            phase={PHASE.drip}
            shadow={false}
            idle={frame > S14_CONTACT ? 1.4 : 0.8}
            pose={frame >= S14_CONTACT ? "clutch" : undefined}
            look={frame < S14_FLOP ? "upRight" : "camera"}
          />
        </Camera>

        {/* The shelf, drawn *over* Drip: this is what he falls through. */}
        <WideLayer>
          <CloudBlob x={640} y={S14_SHELF_Y} w={1500} h={S14_SHELF_H} seed={3} />
          <PuffBurst x={S14_DRIP_X} y={S14_SHELF_TOP} at={S14_CONTACT} />
        </WideLayer>

        <Cloudia
          x={S14_CLOUDIA.x}
          y={S14_CLOUDIA.y}
          scale={S14_CLOUDIA.scale}
          fill={0}
          clipboard
          emotion={useEmotion(scene, "cloudia", { a2_08_cloudia: "grumpy" }, "neutral")}
          speaking={useSpeaking(scene, "cloudia")}
          phase={PHASE.cloudia}
          look={frame > S14_CONTACT ? "down" : cloudiaLook}
        />

        {/* Left of the impact: the MYTH stamp lands to the right of it. */}
        <Foomp x={S14_DRIP_X - 330} y={S14_SHELF_TOP - 60} at={S14_CONTACT} />
      </Camera>
      <CutFlash at={S14_STAMP} strength={0.35} />
      <MythStamp at={S14_STAMP} />
      <Bubbles scene={scene} cast={cast} text={S14_BUBBLES} />
    </AbsoluteFill>
  );
};

/** Cloud thrown up where he hit it — the only evidence it was ever solid. */
const PuffBurst: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const u = (frame - at) / 26;
  if (u < 0 || u > 1) return null;
  return (
    <g opacity={1 - u}>
      {Array.from({ length: 9 }, (_, i) => {
        const ang = Math.PI + (i / 8) * Math.PI;
        // Starts spread, not stacked: nine circles at one point is a bullseye.
        const d = 50 + u * (170 + (i % 3) * 60);
        return (
          <circle
            key={i}
            cx={x + Math.cos(ang) * d * 1.5}
            cy={y + Math.sin(ang) * d * 0.7}
            r={(26 + (i % 4) * 12) * (1 - u * 0.4)}
            fill={kidTheme.cloud}
            stroke={kidTheme.cloudShade}
            strokeWidth={5}
          />
        );
      })}
    </g>
  );
};

/** The sound, spelled out. */
const Foomp: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = frame - at;
  if (u < 0 || u > 40) return null;
  const s = spring({ frame: u, fps, config: { damping: 9, mass: 0.5 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s * (1 - Math.max(0, (u - 26) / 14))}) rotate(-9deg)`,
        fontFamily: kidTheme.fontFamily,
        fontSize: 96,
        fontWeight: 900,
        color: kidTheme.paper,
        WebkitTextStroke: `9px ${kidTheme.ink}`,
        paintOrder: "stroke",
        letterSpacing: 2,
        zIndex: 30,
      }}
    >
      foomp!
    </div>
  );
};

/**
 * The MYTH stamp. It thuds on at 3× and cracks in half a beat later: the crack
 * is two copies of the same card behind complementary jagged clip-paths, so the
 * halves separate along one line that was never drawn twice.
 */
const MythStamp: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const u = frame - at;
  if (u < 0) return null;
  const land = interpolate(u, [0, 9], [3.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const opacity = Math.min(1, u / 3);
  const crack = Math.max(0, Math.min(1, (u - 16) / 22));
  // Complementary polygons off one jagged line — an overlap band would draw the
  // letters twice and read as a printing error rather than as a crack.
  const seam = "50% 0%, 43% 26%, 57% 52%, 45% 76%, 51% 100%";
  const halves: Array<{ clip: string; dx: number; rot: number }> = [
    { clip: `polygon(0% 0%, ${seam}, 0% 100%)`, dx: -crack * 24, rot: -crack * 3 },
    { clip: `polygon(100% 0%, ${seam}, 100% 100%)`, dx: crack * 24, rot: crack * 3 },
  ];
  const face = (
    <div
      style={{
        border: `14px solid ${kidTheme.tomato}`,
        borderRadius: kidRadius.card,
        padding: "8px 20px 16px",
        background: "rgba(255,253,247,0.92)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          border: `7px solid ${kidTheme.tomato}`,
          borderRadius: kidRadius.chip,
          padding: "8px 30px",
        }}
      >
        <div style={{ fontSize: 116, fontWeight: 900, color: kidTheme.tomato, lineHeight: 1 }}>
          MYTH
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, color: kidTheme.tomato, letterSpacing: 8 }}>
          BUSTED
        </div>
      </div>
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 880,
        top: 380,
        transform: `translate(-50%, -50%) scale(${land}) rotate(-11deg)`,
        opacity,
        zIndex: 55,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      {halves.map((h, i) => (
        <div
          key={i}
          style={{
            position: i === 0 ? "relative" : "absolute",
            inset: i === 0 ? undefined : 0,
            clipPath: h.clip,
            transform: `translateX(${h.dx}px) rotate(${h.rot}deg)`,
            filter: `drop-shadow(0 10px 0 rgba(36,52,71,0.25))`,
          }}
        >
          {face}
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 15 — What a cloud actually is
// ---------------------------------------------------------------------------

// The replacement model, delivered as a camera move: dive into the wall until
// the wall is not a wall. Only the wall is inside the camera — Cloudia, Drip
// and their bubbles stay at 1×, so a 4.4× push never touches a face or a word.
const S15_FOCUS = { x: 830, y: 520 };
const S15_CLOUDIA: Mark = {
  x: 1560,
  y: stand("cloudia", 1000),
  scale: 1,
  who: "cloudia",
  side: "left",
};
const S15_DRIP = { x: 250, y: stand("drip", 1030) };

const S15_BUBBLES: Record<string, string> = {
  a2_10_cloudia: "A zillion tiny water drops!",
  a2_11_drip: "The hotel is the guests?",
  a2_12_cloudia: "You are the wallpaper, darling.",
};

const WhatACloudIsScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, gestureTo] = lineWindow(scene, "a2_10_cloudia");
  const dur = scene.durationInFrames;

  // Stops at 3.6: past that there are only four drops across the frame and the
  // swarm stops reading as "a zillion".
  const zoom = interpolate(frame, [30, gestureTo - 20, dur], [1, 3.6, 4.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  // The resolve: the puffs give way to the drops that were always there.
  const resolved = interpolate(zoom, [1.9, 3.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cast: Cast = {
    cloudia: S15_CLOUDIA,
    drip: { ...S15_DRIP, scale: 0.8, who: "drip", side: "right" },
  };

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={0.16} clouds={2} waves={false} />
      <Camera cam={{ ...S15_FOCUS, zoom }}>
        <WideLayer>
          <DropSwarm
            cx={S15_FOCUS.x}
            cy={S15_FOCUS.y}
            halfW={460}
            halfH={330}
            spacing={48}
            scale={0.42}
            opacity={resolved}
          />
          <g opacity={1 - resolved}>
            <CloudBlob x={S15_FOCUS.x - 120} y={S15_FOCUS.y - 40} w={1700} h={620} seed={3} />
            <CloudBlob x={1560} y={S15_FOCUS.y + 260} w={1100} h={420} seed={7} />
            <CloudBlob x={860} y={1120} w={2400} h={330} seed={5} />
          </g>
        </WideLayer>
      </Camera>

      <Drip
        {...S15_DRIP}
        scale={0.8}
        emotion={useEmotion(scene, "drip", { a2_11_drip: "amazed" }, "happy")}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        look={useLookAtSpeaker(scene, cast, "drip", "upRight")}
      />
      <Cloudia
        x={S15_CLOUDIA.x}
        y={S15_CLOUDIA.y}
        scale={S15_CLOUDIA.scale}
        fill={0}
        clipboard
        emotion="proud"
        speaking={useSpeaking(scene, "cloudia")}
        phase={PHASE.cloudia}
        look={useLookAtSpeaker(scene, cast, "cloudia", "left")}
      />
      <Bubbles scene={scene} cast={cast} text={S15_BUBBLES} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 16 — House rules: hug a speck of dust
// ---------------------------------------------------------------------------

const S16_GROUND = 990;
const S16_DRIP = { x: 430, y: stand("drip", S16_GROUND) };
const S16_BOWL = { x: 930, y: 700 };
const S16_CLOUDIA: Mark = {
  x: 1470,
  y: stand("cloudia", S16_GROUND),
  scale: 1,
  who: "cloudia",
  side: "left",
};

const S16_BUBBLES: Record<string, string> = {
  a2_13_cloudia: "Every guest hugs a dust speck!",
  a2_14_drip: "Dust? Why dust?",
};

const DustRuleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [factFrom] = lineWindow(scene, "a2_15_narrator");
  const chain = lineProgress(scene, "a2_16_narrator", frame);

  // Pick the speck up, hug it, and balloon — one beat each, all hung off the
  // narrator's "every drop is hugging a speck" so the picture is making his
  // claim rather than illustrating it afterwards.
  const pickAt = factFrom + 56;
  const hugAt = pickAt + 26;
  const speckU = interpolate(frame, [pickAt, hugAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const balloon = interpolate(frame, [hugAt + 4, hugAt + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const scale = 1 + balloon * 0.22;
  // Hands in the `cheer` pose sit at ±142·scale, 262·scale above the ground
  // (HAND_AT in characters/Drip). Held out at one of them, the speck is outside
  // his silhouette; between them it lands on his forehead.
  const handsY = S16_GROUND - 262 * scale;
  // He keeps holding it up rather than tucking it in: Drip is nearly all face,
  // so anything "hugged to the chest" lands on his mouth — and holding it up is
  // the pose Scene 17 needs him already in.
  const speckX = interpolate(speckU, [0, 1], [S16_BOWL.x - 40, S16_DRIP.x + 168]);
  const speckY =
    interpolate(speckU, [0, 1], [S16_BOWL.y - 40, handsY]) - Math.sin(speckU * Math.PI) * 90;

  const pose = frame >= pickAt - 10 ? "cheer" : undefined;
  // Hand-placed rather than `useEmotion`: its `resting` only applies *before*
  // the character's first mapped line, so a mapped grumpy would hold for the
  // rest of the scene and he would balloon with a scowl on.
  const [whyFrom] = lineWindow(scene, "a2_14_drip");
  let dripEmotion: Emotion = "happy";
  if (frame >= whyFrom - 8) dripEmotion = "grumpy";
  if (frame >= pickAt - 10) dripEmotion = "amazed";
  if (frame >= hugAt + 4) dripEmotion = "excited";
  const cast: Cast = {
    drip: { ...S16_DRIP, scale, who: "drip", side: "right" },
    cloudia: S16_CLOUDIA,
  };

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={0.18} clouds={2} waves={false} />
      <WideLayer>
        {/* Lobby: a cloud wall of guests behind, a cloud floor underfoot. */}
        <g opacity={0.38}>
          <DropSwarm cx={960} cy={430} halfW={1300} halfH={330} spacing={128} scale={0.7} churn={0.5} />
        </g>
        <CloudBlob x={860} y={S16_GROUND + 190} w={2600} h={420} seed={5} />
        <Pedestal x={S16_BOWL.x} groundY={S16_GROUND} bowlY={S16_BOWL.y} />
        {/* Between the bowl and the manager: the rope is what Drip is queuing
            at, so it must not run through him. */}
        <VelvetRope x0={1090} x1={1310} y={S16_GROUND - 20} />
      </WideLayer>

      <Camera cam={{ x: S16_DRIP.x, y: S16_GROUND, zoom: 1 + balloon * 0.14, zoomY: 1 + balloon * 0.03 }}>
        <Drip
          x={S16_DRIP.x}
          y={stand("drip", S16_GROUND)}
          scale={scale}
          emotion={dripEmotion}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          pose={pose}
          idle={1 + balloon * 0.6}
          look={useLookAtSpeaker(scene, cast, "drip", frame > pickAt - 20 ? "up" : "right")}
        />
      </Camera>
      {frame >= pickAt - 4 ? <Speck x={speckX} y={speckY} r={26} glow={balloon} /> : null}
      {balloon > 0.02 && balloon < 0.99 ? <BalloonRing x={S16_DRIP.x} y={midOf("drip", S16_DRIP.y, scale)} u={balloon} /> : null}

      <Cloudia
        x={S16_CLOUDIA.x}
        y={S16_CLOUDIA.y}
        scale={S16_CLOUDIA.scale}
        fill={0.08}
        clipboard
        emotion={useEmotion(scene, "cloudia", { a2_13_cloudia: "proud" }, "happy")}
        speaking={useSpeaking(scene, "cloudia")}
        phase={PHASE.cloudia}
        look={useLookAtSpeaker(scene, cast, "cloudia", "left")}
      />

      {/* The consequence chain, one link per clause of the last line. */}
      <ChainCards u={chain} />
      <Bubbles scene={scene} cast={cast} text={S16_BUBBLES} />
    </AbsoluteFill>
  );
};

/** A bowl of dust specks by the door, like complimentary mints. */
const Pedestal: React.FC<{ x: number; groundY: number; bowlY: number }> = ({
  x,
  groundY,
  bowlY,
}) => (
  <g>
    {/* Column starts *below* the bowl: run up into it and the beige shows
        through the glass as a block sitting in the mints. */}
    <rect x={x - 26} y={bowlY + 66} width={52} height={groundY - bowlY - 66} fill={kidTheme.sunDark} stroke={kidTheme.ink} strokeWidth={8} />
    <ellipse cx={x} cy={groundY} rx={92} ry={22} fill={kidTheme.sunDark} stroke={kidTheme.ink} strokeWidth={8} />
    <path
      d={`M ${x - 120} ${bowlY - 34} A 120 96 0 0 0 ${x + 120} ${bowlY - 34} Z`}
      fill="rgba(255,255,255,0.55)"
      stroke={kidTheme.ink}
      strokeWidth={8}
      strokeLinejoin="round"
    />
    {Array.from({ length: 11 }, (_, i) => (
      <circle
        key={i}
        cx={x - 84 + (i % 6) * 34 + (i > 5 ? 17 : 0)}
        cy={bowlY - 40 - Math.floor(i / 6) * 26}
        r={13}
        fill="#9aa1ab"
        stroke={kidTheme.ink}
        strokeWidth={4}
      />
    ))}
    <ellipse cx={x} cy={bowlY - 34} rx={120} ry={20} fill="none" stroke={kidTheme.ink} strokeWidth={8} />
    <g transform={`translate(${x} ${bowlY + 96})`}>
      <rect x={-150} y={-32} width={300} height={64} rx={32} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={7} />
      <text
        x={0}
        y={16}
        textAnchor="middle"
        fontFamily={kidTheme.fontFamily}
        fontSize={kidType.min}
        fontWeight={900}
        fill={kidTheme.ink}
      >
        TAKE ONE
      </text>
    </g>
  </g>
);

const VelvetRope: React.FC<{ x0: number; x1: number; y: number }> = ({ x0, x1, y }) => (
  <g>
    {[x0, x1].map((x) => (
      <g key={x}>
        <rect x={x - 14} y={y - 200} width={28} height={200} rx={14} fill={kidTheme.sunDark} stroke={kidTheme.ink} strokeWidth={8} />
        <ellipse cx={x} cy={y} rx={62} ry={16} fill={kidTheme.sunDark} stroke={kidTheme.ink} strokeWidth={8} />
        <circle cx={x} cy={y - 214} r={26} fill={kidTheme.sun} stroke={kidTheme.ink} strokeWidth={8} />
      </g>
    ))}
    <path
      d={`M ${x0} ${y - 196} Q ${(x0 + x1) / 2} ${y - 90} ${x1} ${y - 196}`}
      stroke={kidTheme.pinkDeep}
      strokeWidth={26}
      strokeLinecap="round"
      fill="none"
    />
  </g>
);

/** One speck of dust. Kevin, later. */
const Speck: React.FC<{ x: number; y: number; r: number; glow?: number }> = ({
  x,
  y,
  r,
  glow = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      {glow > 0.02 ? <circle r={r * 2.4} fill={kidTheme.star} opacity={0.35 * glow} /> : null}
      <g transform={`rotate(${Math.sin(frame / 40) * 8})`}>
        <circle cx={0} cy={0} r={r} fill="#9aa1ab" stroke={kidTheme.ink} strokeWidth={r * 0.2} />
        <circle cx={-r * 0.5} cy={-r * 0.34} r={r * 0.46} fill="#b3b9c2" />
        <circle cx={r * 0.52} cy={r * 0.3} r={r * 0.3} fill="#7f8792" />
      </g>
    </svg>
  );
};

/** The pop of a drop getting bigger around its speck. */
const BalloonRing: React.FC<{ x: number; y: number; u: number }> = ({ x, y, u }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
    <circle
      r={90 + u * 200}
      fill="none"
      stroke={kidTheme.waterLight}
      strokeWidth={18 * (1 - u)}
      opacity={0.7 * (1 - u)}
    />
  </svg>
);

/** No dust, no clouds. No clouds, no rain. */
const CHAIN = ["NO DUST", "NO CLOUDS", "NO RAIN"];

const ChainCards: React.FC<{ u: number }> = ({ u }) => {
  const { fps } = useVideoConfig();
  if (u <= 0.001) return null;
  const at = [0.34, 0.58, 0.8];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 165,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 26,
        fontFamily: kidTheme.fontFamily,
        zIndex: 44,
        pointerEvents: "none",
      }}
    >
      {CHAIN.map((text, i) => {
        // The chant lands one link at a time; springs are keyed off the frame
        // the clause was reached, not off a fixed offset.
        const on = u >= at[i];
        const s = spring({
          frame: on ? Math.round((u - at[i]) * 200) : -1,
          fps,
          config: { damping: 11, mass: 0.6 },
        });
        if (s <= 0.01) return null;
        return (
          <React.Fragment key={text}>
            {i > 0 ? (
              <div style={{ fontSize: 64, fontWeight: 900, color: kidTheme.ink, textShadow: kidOutline(4), transform: `scale(${s})` }}>
                →
              </div>
            ) : null}
            <div
              style={{
                background: i === 2 ? kidTheme.tomato : kidTheme.paper,
                color: i === 2 ? kidTheme.paper : kidTheme.ink,
                border: `8px solid ${kidTheme.ink}`,
                borderRadius: kidRadius.pill,
                padding: "10px 34px",
                fontSize: kidType.min,
                fontWeight: 900,
                letterSpacing: 2,
                boxShadow: kidShadow(1),
                transform: `scale(${s}) rotate(${(1 - s) * 8 - 1.5}deg)`,
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 17 — Kevin
// ---------------------------------------------------------------------------

// The best joke in the act, and the direction is therefore: do almost nothing.
// No camera move, no entrance, no reaction. Drip holds a speck up like a
// newborn and Cloudia never looks up from her clipboard. The only motion in the
// frame is breathing, and the only event is the name.
const S17_DRIP = { x: 620, y: stand("drip", 900) };
const S17_DRIP_SCALE = 1.5;
const S17_CLOUDIA: Mark = {
  x: 1560,
  y: stand("cloudia", 1150),
  scale: 1.15,
  who: "cloudia",
  side: "left",
};
/**
 * Held up above his head. His hands (`cheer`) reach 262·scale above the ground,
 * but the space *between* them is in front of his own face — at that height the
 * speck reads as sitting on his forehead. Above the crown it reads as held out.
 */
const S17_SPECK = { x: S17_DRIP.x, y: crownOf("drip", stand("drip", 900), S17_DRIP_SCALE) - 34 };

const KevinScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [nameFrom, nameTo] = lineWindow(scene, "a2_17_drip");
  // "…I shall call you Kevin" is the end of the take, so the arrow lands there.
  const arrowAt = Math.round(nameFrom + (nameTo - nameFrom) * 0.72);

  const cast: Cast = {
    drip: { ...S17_DRIP, scale: S17_DRIP_SCALE, who: "drip", side: "right" },
    cloudia: S17_CLOUDIA,
  };

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={0.2} clouds={1} waves={false} />
      <WideLayer>
        {/* The lobby, softened right down: nothing in this frame competes. */}
        <g opacity={0.26}>
          <DropSwarm cx={960} cy={420} halfW={1200} halfH={300} spacing={150} scale={0.9} churn={0.35} />
        </g>
        <CloudBlob x={860} y={1220} w={2600} h={460} seed={5} />
      </WideLayer>

      <Drip
        {...S17_DRIP}
        scale={S17_DRIP_SCALE}
        emotion={useEmotion(scene, "drip", { a2_17_drip: "amazed" }, "happy")}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={0.35}
        pose="cheer"
        look="up"
      />
      <Speck x={S17_SPECK.x} y={S17_SPECK.y} r={44} glow={0.55} />
      {/* The same name-arrow that introduced Drip in Scene 3, pointed at a
          speck of dust. The callback is the joke. */}
      <NameArrow x={S17_SPECK.x - 44} y={S17_SPECK.y - 20} label="KEVIN" from={arrowAt} dir="left" />

      {/* Mid-clipboard. She does not look up — not for the speck, not for the
          name, not while saying the line. */}
      <Cloudia
        x={S17_CLOUDIA.x}
        y={S17_CLOUDIA.y}
        scale={S17_CLOUDIA.scale}
        fill={0.12}
        clipboard
        emotion="neutral"
        speaking={useSpeaking(scene, "cloudia")}
        phase={PHASE.cloudia}
        idle={0.4}
        look={{ x: 0.55, y: 0.9 }}
      />

      <Bubbles
        scene={scene}
        cast={cast}
        text={{
          a2_17_drip: "Hello, dust speck.",
          a2_18_cloudia: "Kevin is a lovely name.",
        }}
        at={{ a2_17_drip: { x: 1090, y: 250, tail: "left" } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 18 — Big Word Two: CONDENSATION
// ---------------------------------------------------------------------------

// Same component, same shape, same beats as Scene 10. The format is the thing a
// six-year-old learns, so the only differences allowed are the word, the
// colour, and the frost on the glass.
const S18_DRIP = { x: 560, y: stand("drip", 1010) };
const S18_CLOUDIA: Mark = {
  x: 1430,
  y: stand("cloudia", 1010),
  scale: 1,
  who: "cloudia",
  side: "left",
};

const BigWordCondensationScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [wordFrom, wordTo] = lineWindow(scene, "a2_19_narrator");
  // "…that is condensation" is the last clause of the take.
  const slamAt = Math.round(wordFrom + (wordTo - wordFrom) * 0.86);

  return (
    <AbsoluteFill>
      <BigWordBeat
        scene={scene}
        word="CONDENSATION"
        syllables={["Con", "den", "SAY", "shun"]}
        chantKey="a2_20_drip"
        slamAt={slamAt}
        color={ACT_COLOR.condensation}
        sub="cold air makes drops"
        y={300}
        freeze={<CondensingWorld />}
      >
        {/* Live under the card: Drip chants the syllables and Cloudia has the
            tie-back line after them, so neither mouth may be frozen. */}
        <Drip
          {...S18_DRIP}
          scale={1.15}
          emotion={frame > slamAt ? "proud" : "excited"}
          speaking={useSpeaking(scene, "drip")}
          phase={PHASE.drip}
          shadow={false}
          idle={0.45}
          look="upRight"
        />
        <Cloudia
          x={S18_CLOUDIA.x}
          y={S18_CLOUDIA.y}
          scale={S18_CLOUDIA.scale}
          fill={0.2}
          clipboard
          emotion="proud"
          speaking={useSpeaking(scene, "cloudia")}
          phase={PHASE.cloudia}
          idle={0.6}
          look="upLeft"
        />
      </BigWordBeat>
      {/* Frost: the act's Big Word is what cold does, so the frame ices up. */}
      <Frost from={slamAt} />
      <Bubbles
        scene={scene}
        cast={{ cloudia: S18_CLOUDIA }}
        text={{ a2_21_cloudia: "That's how I get guests!" }}
        // Low and to her left: the syllable blocks own the middle of the frame.
        at={{ a2_21_cloudia: { x: 1080, y: 770, tail: "right" } }}
      />
    </AbsoluteFill>
  );
};

/** The action the Big Word freezes: the lobby, mid-check-in. */
const CondensingWorld: React.FC = () => (
  <AbsoluteFill>
    <SkyBlend from="day" to="night" u={0.2} clouds={2} waves={false} />
    <WideLayer>
      <g opacity={0.6}>
        <DropSwarm cx={960} cy={420} halfW={1300} halfH={320} spacing={124} scale={0.72} churn={0.6} />
      </g>
      <CloudBlob x={860} y={1210} w={2600} h={440} seed={5} />
    </WideLayer>
  </AbsoluteFill>
);

/** Ice at the edges of the frame plus a few drifting crystals. */
const Frost: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const u = interpolate(frame, [from, from + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (u <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 46 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 66% 60% at 50% 50%, transparent 46%, rgba(214,242,255,${0.62 * u}) 100%)`,
        }}
      />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 22 }, (_, i) => {
          const x = ((i * 271) % 1920) + 30;
          const y = ((i * 173 + frame * 0.6) % 1080) + 10;
          const a = 10 + (i % 3) * 7;
          return (
            <path
              key={i}
              transform={`translate(${x} ${y}) rotate(${frame * 0.4 + i * 24})`}
              d={`M 0 ${-a} L 0 ${a} M ${-a} 0 L ${a} 0 M ${-a * 0.7} ${-a * 0.7} L ${a * 0.7} ${a * 0.7} M ${-a * 0.7} ${a * 0.7} L ${a * 0.7} ${-a * 0.7}`}
              stroke="#ffffff"
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.5 * u}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 19 — The hotel fills
// ---------------------------------------------------------------------------

// Cloud growth *is* accumulation, so the picture has to be arithmetic: a column
// of arriving drops, a building that gets bigger by exactly as much as arrives,
// a manager who darkens as she takes them on, and a list of ticks.
const S19_HOTEL = { x: 900, ground: 830, w: 900 };
const S19_CLOUDIA: Mark = {
  x: 1620,
  y: stand("cloudia", 1010),
  scale: 0.95,
  who: "cloudia",
  side: "left",
};

const HotelFillsScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const dur = scene.durationInFrames;
  const [, keepComingTo] = lineWindow(scene, "a2_22_narrator");
  const [crowdedFrom] = lineWindow(scene, "a2_24_narrator");

  // One climbing number: floors, guests, greyness and Cloudia's fill are all
  // this, so the hotel and its manager can never disagree about how full it is.
  const full = interpolate(frame, [0, keepComingTo, crowdedFrom, dur], [0.06, 0.3, 0.66, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const floorAt = [Math.round(dur * 0.24), Math.round(dur * 0.52), Math.round(dur * 0.78)];
  const floors = 1 + floorAt.filter((f) => frame >= f).length;
  const swell = 1 + full * 0.16;

  const cast: Cast = { cloudia: S19_CLOUDIA };

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={0.12} clouds={0} waves={false} />
      <WideLayer>
        {/* Time-lapse: the sky is running fast. */}
        {[0, 1, 2, 3].map((i) => (
          <CloudBlob
            key={i}
            x={((frame * (7 + i * 3) + i * 900) % 3400) - 700}
            y={140 + i * 130}
            w={420 + i * 90}
            h={120 + i * 24}
            opacity={0.45}
            seed={i * 3}
            stroke={0}
          />
        ))}
      </WideLayer>

      <Camera cam={{ x: S19_HOTEL.x, y: S19_HOTEL.ground, zoom: swell }}>
        <WideLayer>
          {/* Arrivals first: they have to disappear *behind* the building, not
              stream across its front door. */}
          <ArrivingColumn x={S19_HOTEL.x} topY={S19_HOTEL.ground - 40} />
          <CloudHotel
            x={S19_HOTEL.x}
            groundY={S19_HOTEL.ground}
            w={S19_HOTEL.w}
            floors={floors}
            floorAt={floorAt}
            grey={full * 0.42}
            guests={full}
          />
        </WideLayer>
      </Camera>

      <GuestList x={300} y={720} ticks={Math.floor(full * 11)} />
      <Cloudia
        x={S19_CLOUDIA.x}
        y={S19_CLOUDIA.y}
        scale={S19_CLOUDIA.scale}
        fill={full * 0.6}
        clipboard
        emotion={useEmotion(scene, "cloudia", { a2_23_cloudia: "excited" }, "happy")}
        speaking={useSpeaking(scene, "cloudia")}
        phase={PHASE.cloudia}
        look={{ x: -0.7, y: -0.2 }}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={{ a2_23_cloudia: "Room for one more! Oh my." }}
      />
    </AbsoluteFill>
  );
};

/** Guests arriving, one drop at a time, forever. */
const ArrivingColumn: React.FC<{ x: number; topY: number }> = ({ x, topY }) => {
  const frame = useCurrentFrame();
  const span = 1400;
  return (
    <g>
      {Array.from({ length: 16 }, (_, i) => {
        const u = ((frame * 7 + i * 132) % span) / span;
        const y = topY + 560 - u * 620;
        const fade = Math.min(1, (1 - u) * 4);
        return (
          <Blobby
            key={i}
            x={x + Math.sin(u * 5 + i) * 130}
            y={y}
            scale={0.34 + (i % 3) * 0.08}
            phase={i * 1.13}
            mood={i % 3 === 0 ? "surprised" : "happy"}
            opacity={0.9 * fade}
          />
        );
      })}
    </g>
  );
};

/** Cloudia's guest list, filling with check-marks. */
const GuestList: React.FC<{ x: number; y: number; ticks: number }> = ({ x, y, ticks }) => (
  <svg
    width={1}
    height={1}
    style={{ position: "absolute", left: x, top: y, overflow: "visible", zIndex: 20 }}
  >
    <g transform="rotate(-7)">
      <rect x={-150} y={-210} width={300} height={420} rx={22} fill="#e9d2a6" stroke="#a8783f" strokeWidth={9} />
      <rect x={-70} y={-244} width={140} height={54} rx={16} fill="#b9c3ce" stroke="#75828f" strokeWidth={8} />
      <text
        x={0}
        y={-150}
        textAnchor="middle"
        fontFamily={kidTheme.fontFamily}
        fontSize={kidType.min}
        fontWeight={900}
        fill={kidTheme.ink}
      >
        GUESTS
      </text>
      {Array.from({ length: 11 }, (_, i) => {
        const ry = -104 + i * 30;
        return (
          <g key={i}>
            <path d={`M -104 ${ry} L 60 ${ry}`} stroke="#a8783f" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
            {i < ticks ? (
              <path
                d={`M 74 ${ry - 6} L 90 ${ry + 10} L 122 ${ry - 22}`}
                stroke={kidTheme.mint}
                strokeWidth={11}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ) : null}
          </g>
        );
      })}
    </g>
  </svg>
);

// ---------------------------------------------------------------------------
// Scene 20 — Full capacity
// ---------------------------------------------------------------------------

// Inside, through the window, from outside. The whole frame is one porthole
// (a CSS clip), the interior dims as the crowd thickens, and Cloudia is
// flattened against the glass — the squash is a transform on her, because a
// character rig has no "pressed against a window" pose and should not grow one.
const S20_CLOUDIA = { x: 820, ground: 950, scale: 1.15 };
// Kept well inside the porthole: at x=1330 the clip cut off everything below
// his eyes and he read as a smudge on the glass.
const S20_DRIP = { x: 1200, ground: 880, scale: 0.8 };
const S20_PORT = { x: 960, y: 520, r: 470 };

const FullCapacityScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const dur = scene.durationInFrames;
  const press = interpolate(frame, [0, dur], [0.35, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dim = interpolate(frame, [0, dur], [0.1, 0.52], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cloudiaY = stand("cloudia", S20_CLOUDIA.ground);
  const dripY = stand("drip", S20_DRIP.ground);

  return (
    <AbsoluteFill>
      {/* Outside: the hotel's own grey flank, in daylight. Flat fill first —
          the blob alone left wedges of blue sky showing between its puffs, and
          a hole in the wall of a building reads as a mistake. */}
      <AbsoluteFill style={{ background: cloudPaint(0.5).bottom }} />
      <WideLayer>
        <CloudBlob x={960} y={620} w={2800} h={1700} grey={0.5} seed={5} />
      </WideLayer>

      {/* Inside the glass. */}
      <AbsoluteFill style={{ clipPath: `circle(${S20_PORT.r}px at ${S20_PORT.x}px ${S20_PORT.y}px)` }}>
        <AbsoluteFill style={{ background: mixHex(kidTheme.waterDeep, kidTheme.ink, 0.35) }} />
        <WideLayer>
          <DropSwarm cx={S20_PORT.x} cy={S20_PORT.y + 60} halfW={620} halfH={520} spacing={112} scale={0.72} churn={0.4} />
        </WideLayer>
        {/* Cheek to the glass: wider than she is tall, and leaning. */}
        <AbsoluteFill
          style={{
            transformOrigin: `${S20_CLOUDIA.x}px ${S20_CLOUDIA.ground - 150}px`,
            transform: `scale(${1 + press * 0.3}, ${1 - press * 0.2}) skewX(${-press * 6}deg)`,
          }}
        >
          <Cloudia
            x={S20_CLOUDIA.x}
            y={cloudiaY}
            scale={S20_CLOUDIA.scale}
            fill={0.62}
            clipboard={false}
            emotion={useEmotion(scene, "cloudia", { a2_25_cloudia: "grumpy" }, "grumpy")}
            speaking={useSpeaking(scene, "cloudia")}
            phase={PHASE.cloudia}
            idle={0.5}
            look="camera"
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            transformOrigin: `${S20_DRIP.x}px ${S20_DRIP.ground - 120}px`,
            transform: `scale(${1 + press * 0.16}, ${1 - press * 0.1})`,
          }}
        >
          <Drip
            x={S20_DRIP.x}
            y={dripY}
            scale={S20_DRIP.scale}
            emotion={useEmotion(scene, "drip", { a2_26_drip: "amazed" }, "grumpy")}
            speaking={useSpeaking(scene, "drip")}
            phase={PHASE.drip}
            shadow={false}
            idle={0.5}
            look="camera"
          />
        </AbsoluteFill>
        {/* The light going. Drip says it out loud on the next line. */}
        <AbsoluteFill style={{ background: `rgba(14,26,54,${dim})` }} />
      </AbsoluteFill>

      {/* The glass itself: rim, then a sheen over everything inside it. */}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <circle
          cx={S20_PORT.x}
          cy={S20_PORT.y}
          r={S20_PORT.r + 22}
          fill="none"
          stroke={kidTheme.paper}
          strokeWidth={44}
        />
        <circle cx={S20_PORT.x} cy={S20_PORT.y} r={S20_PORT.r + 44} fill="none" stroke={kidTheme.ink} strokeWidth={11} />
        <circle cx={S20_PORT.x} cy={S20_PORT.y} r={S20_PORT.r} fill="none" stroke={kidTheme.ink} strokeWidth={11} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2 + 0.3;
          return (
            <circle
              key={i}
              cx={S20_PORT.x + Math.cos(a) * (S20_PORT.r + 22)}
              cy={S20_PORT.y + Math.sin(a) * (S20_PORT.r + 22)}
              r={16}
              fill={kidTheme.sunDark}
              stroke={kidTheme.ink}
              strokeWidth={6}
            />
          );
        })}
        <g clipPath="none" opacity={0.16}>
          <path
            d={`M ${S20_PORT.x - 380} ${S20_PORT.y + 300} L ${S20_PORT.x - 40} ${S20_PORT.y - 400} L ${S20_PORT.x + 90} ${S20_PORT.y - 400} L ${S20_PORT.x - 250} ${S20_PORT.y + 340} Z`}
            fill="#ffffff"
          />
        </g>
      </svg>

      <Bubbles
        scene={scene}
        cast={{
          cloudia: { x: S20_CLOUDIA.x, y: cloudiaY, scale: S20_CLOUDIA.scale, who: "cloudia" },
          drip: { x: S20_DRIP.x, y: dripY, scale: S20_DRIP.scale, who: "drip" },
        }}
        text={{
          a2_25_cloudia: "We are at FULL CAPACITY!",
          a2_26_drip: "It's getting dark in here.",
        }}
        at={{
          a2_25_cloudia: { x: 470, y: 210, tail: "right" },
          a2_26_drip: { x: 1440, y: 360, tail: "left" },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 21 — Grey, and heavy
// ---------------------------------------------------------------------------

// Two facts in one shot, and both of them are visible or they are not taught:
// the sunlight *stops* at the top of the cloud (dark is blocked light, not a
// colour change), and the hotel sags under the weight (rain is mass beating
// buoyancy). The beams therefore end in a flat cap with a splash, and there is
// a shadow under the hotel where the light did not arrive.
const S21_HOTEL = { x: 840, ground: 800, w: 1080 };
// Where the top floor's puffs actually are (bandH = 0.2w, three bands, puffs
// standing ~0.6·bandH above their own centre) and how wide that floor is. The
// beams have to stop *on the silhouette*; 200px too low and they stop inside
// the cloud, which looks like light getting through.
const S21_TOP_Y = S21_HOTEL.ground - S21_HOTEL.w * 0.545;
const S21_BEAM_X0 = S21_HOTEL.x - S21_HOTEL.w * 0.26;
const S21_BEAM_X1 = S21_HOTEL.x + S21_HOTEL.w * 0.28;
const S21_SUNNY = { x: 1640, y: stand("sunny", 300), scale: 0.62 };
const S21_CLOUDIA: Mark = {
  x: 1360,
  y: stand("cloudia", 1010),
  scale: 1,
  who: "cloudia",
  side: "left",
};

const S21_BUBBLES: Record<string, string> = {
  a2_28_sunny: "Rude! I was shining nicely.",
  a2_29_cloudia: "I love guests. I hate gravity.",
};

const GreyAndHeavyScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const dur = scene.durationInFrames;
  const [, greyTo] = lineWindow(scene, "a2_27_narrator");
  const [heavyFrom] = lineWindow(scene, "a2_29_cloudia");

  // "A crowded cloud turns grey" — it turns while he says it.
  const grey = interpolate(frame, [20, greyTo - 20], [0.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // And then it gets heavy: droop, sink, and the first drops gathering.
  const heavy = interpolate(frame, [heavyFrom - 30, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const sink = heavy * 54;

  const sunnyMid = { x: S21_SUNNY.x, y: midOf("sunny", S21_SUNNY.y, S21_SUNNY.scale) };
  const cast: Cast = { sunny: { ...S21_SUNNY, who: "sunny" }, cloudia: S21_CLOUDIA };

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="night" u={0.1 + grey * 0.12} clouds={2} waves={false} />
      {/* Beams first: the hotel is drawn over them, so nothing can leak past
          the cloud's own silhouette by accident. The splashes come back on top
          afterwards, or the moment of impact is inside the cloud. */}
      <WideLayer>
        <StoppedBeams part="rays" from={sunnyMid} topY={S21_TOP_Y + sink} x0={S21_BEAM_X0} x1={S21_BEAM_X1} blocked={grey} />
      </WideLayer>
      <Sunny
        x={S21_SUNNY.x}
        y={S21_SUNNY.y}
        scale={S21_SUNNY.scale}
        emotion={useEmotion(scene, "sunny", { a2_28_sunny: "grumpy" }, "proud")}
        speaking={useSpeaking(scene, "sunny")}
        phase={PHASE.sunny}
        shades={1}
        look={{ x: -0.8, y: 0.4 }}
      />
      <WideLayer>
        <g transform={`translate(0 ${sink})`}>
          <CloudHotel
            x={S21_HOTEL.x}
            groundY={S21_HOTEL.ground}
            w={S21_HOTEL.w}
            floors={3}
            grey={grey}
            droop={heavy}
            guests={1}
          />
          <PreDrips x={S21_HOTEL.x} y={S21_HOTEL.ground + 20} w={S21_HOTEL.w} u={heavy} />
        </g>
        <StoppedBeams part="hits" from={sunnyMid} topY={S21_TOP_Y} x0={S21_BEAM_X0} x1={S21_BEAM_X1} blocked={grey} />
        {/* The shadow the blocked light leaves underneath. */}
        <path
          d={`M ${S21_HOTEL.x - S21_HOTEL.w * 0.44} ${S21_HOTEL.ground + sink} L ${S21_HOTEL.x + S21_HOTEL.w * 0.44} ${S21_HOTEL.ground + sink} L ${S21_HOTEL.x + S21_HOTEL.w * 0.86} 1300 L ${S21_HOTEL.x - S21_HOTEL.w * 0.8} 1300 Z`}
          fill="#2b3a52"
          opacity={0.16 * grey}
        />
      </WideLayer>

      <Cloudia
        x={S21_CLOUDIA.x}
        y={S21_CLOUDIA.y + sink * 0.6}
        scale={S21_CLOUDIA.scale}
        fill={Math.min(1, grey * 0.9 + heavy * 0.2)}
        clipboard
        emotion={useEmotion(scene, "cloudia", { a2_29_cloudia: "grumpy" }, "neutral")}
        speaking={useSpeaking(scene, "cloudia")}
        phase={PHASE.cloudia}
        idle={0.6}
        look={useLookAtSpeaker(scene, cast, "cloudia", "down")}
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S21_BUBBLES}
        at={{ a2_28_sunny: { x: 1120, y: 250, tail: "right" } }}
      />
      <Vignette strength={0.28 * grey} />
    </AbsoluteFill>
  );
};

/**
 * Sunlight hitting the top of the cloud and stopping dead. The flat cap and the
 * splash at the end of each beam are the pedagogy: the light does not dim, it
 * does not tint the cloud, it *does not get through*.
 */
const StoppedBeams: React.FC<{
  /** `rays` draws under the cloud; `hits` draws over it, at the contact line. */
  part: "rays" | "hits";
  from: { x: number; y: number };
  topY: number;
  x0: number;
  x1: number;
  blocked: number;
}> = ({ part, from, topY, x0, x1, blocked }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => {
        const u = i / 4;
        const landing = x0 + (x1 - x0) * u;
        // The cloud's top is a dome, so the outer beams land lower.
        const drop = Math.abs(u - 0.5) * 2;
        const hitY = topY + drop * drop * 135;
        const w = 44 + (i % 2) * 18;
        const shimmer = 0.5 + 0.5 * Math.sin(t * 1.7 + i * 1.3);
        if (part === "rays") {
          return (
            <path
              key={i}
              d={
                `M ${from.x - w * 0.5} ${from.y} L ${from.x + w * 0.5} ${from.y}` +
                ` L ${landing + w * 1.6} ${hitY} L ${landing - w * 1.6} ${hitY} Z`
              }
              fill={kidTheme.sunLight}
              opacity={0.26 + 0.14 * shimmer}
            />
          );
        }
        return (
          <g key={i}>
            {/* Full stop: a flat cap on the cloud's own surface, a splash of
                light that goes no further, and two beams bouncing back off. */}
            <path
              d={`M ${landing - w * 1.7} ${hitY} L ${landing + w * 1.7} ${hitY}`}
              stroke={kidTheme.star}
              strokeWidth={20}
              strokeLinecap="round"
              opacity={0.55 + 0.35 * shimmer}
            />
            <ellipse
              cx={landing}
              cy={hitY - 6}
              rx={w * 1.5}
              ry={20}
              fill={kidTheme.star}
              opacity={(0.4 + 0.3 * shimmer) * blocked}
            />
            {/* Only the middle beams bounce: ten arcs along the roofline read as
                scribble rather than as reflected light. */}
            {i % 2 === 0
              ? [-1, 1].map((s) => (
                  <path
                    key={s}
                    d={`M ${landing + s * w * 1.3} ${hitY - 10} q ${s * 40} ${-20} ${s * 62} ${-52}`}
                    stroke={kidTheme.star}
                    strokeWidth={13}
                    strokeLinecap="round"
                    fill="none"
                    opacity={0.62 * blocked * (0.6 + 0.4 * shimmer)}
                  />
                ))
              : null}
          </g>
        );
      })}
    </g>
  );
};

/** Drops gathering on the underside. Not falling yet — that is Act Three. */
const PreDrips: React.FC<{ x: number; y: number; w: number; u: number }> = ({ x, y, w, u }) => {
  const frame = useCurrentFrame();
  if (u <= 0.02) return null;
  return (
    <g opacity={Math.min(1, u * 1.6)}>
      {Array.from({ length: 7 }, (_, i) => {
        const px = x + ((i - 3) / 3) * w * 0.4;
        const wob = 1 + 0.18 * Math.sin(frame / 14 + i);
        const len = (34 + (i % 3) * 22) * u * wob;
        // Narrow where it hangs, heavy at the bottom. Drawn the other way up it
        // is an arrowhead, which is what the first pass looked like.
        const r = 22;
        return (
          <path
            key={i}
            transform={`translate(${px} ${y + Math.abs(Math.sin(i * 2.1)) * 26})`}
            d={
              `M -9 0 C -12 ${len * 0.5} ${-r} ${len - r} ${-r} ${len}` +
              ` A ${r} ${r} 0 0 0 ${r} ${len}` +
              ` C ${r} ${len - r} 12 ${len * 0.5} 9 0 Z`
            }
            fill={kidTheme.water}
            stroke={kidTheme.waterDeep}
            strokeWidth={6}
          />
        );
      })}
    </g>
  );
};

export const ACT2_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s12_layers: LayersScene,
  s13_cloud_hotel: CloudHotelScene,
  s14_myth_pillow: MythPillowScene,
  s15_what_a_cloud_is: WhatACloudIsScene,
  s16_dust_rule: DustRuleScene,
  s17_kevin: KevinScene,
  s18_bigword_condensation: BigWordCondensationScene,
  s19_hotel_fills: HotelFillsScene,
  s20_full_capacity: FullCapacityScene,
  s21_grey_and_heavy: GreyAndHeavyScene,
};
