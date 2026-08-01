import React from "react";
import {
  Cloudia,
  Puff,
  Sunny,
  kidEase,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  moveAlong,
} from "../../../lib/kid";
import {
  ACT_COLOR,
  AbsoluteFill,
  Bubbles,
  Camera,
  MotionTrail,
  PHASE,
  PUFF_OPACITY,
  PaintedSky,
  WIDE,
  WideLayer,
  heldBeat,
  hover,
  interpolate,
  lineWindow,
  spring,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cast,
  type TimedScene,
} from "./common";
import { SAND, SAND_DARK, SEA_FAR, SEA_MID, SEA_NEAR } from "./act3";

// RECAP — Scenes 33–36 of script.md: the chant, the summary card, the
// mind-blower and the tease.
//
// Three of the four scenes are recognition rather than new pictures, which is
// the whole job of a recap:
//
//   Scene 33 is episode one's four-way split, beat for beat — one character per
//   panel, each panel lighting as it takes its word, the word slamming in in
//   that act's colour. The colours come from `ACT_COLOR`, which is the same
//   table the three Big Word cards were dressed from, so the recap cannot drift
//   from the thing it is recapping.
//
//   Scene 34 is the episode in one photographable frame: four words stacked
//   over a turning globe with wind on every ocean. Then the claim that makes it
//   portable — a night window, a curtain moving, outside the room the child is
//   actually sitting in.
//
//   Scene 36 is episode one's sign-off with the running gag finally broken.
//
// Puff is at `PUFF_OPACITY.full` throughout. Nobody mentions it.

const NO_LEAD = 0;
const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------------------
// Scene 33 — The chant
// ---------------------------------------------------------------------------

const PANEL_W = 960;
const PANEL_H = 540;

type Panel = {
  key: "puff" | "sunny" | "cloudia" | "narrator";
  word: string;
  color: string;
  lineKey: string;
  col: 0 | 1;
  row: 0 | 1;
  sky: string;
};

const PANELS: Panel[] = [
  {
    key: "puff",
    word: "AIR",
    color: ACT_COLOR.air,
    lineKey: "rc_02_puff",
    col: 0,
    row: 0,
    sky: `linear-gradient(180deg, ${kidTheme.skyMid} 0%, ${kidTheme.skyLow} 100%)`,
  },
  {
    key: "sunny",
    word: "WARM AIR RISES",
    color: ACT_COLOR.warmAirRises,
    lineKey: "rc_03_sunny",
    col: 1,
    row: 0,
    sky: `linear-gradient(180deg, ${kidTheme.sunLight} 0%, ${kidTheme.sun} 100%)`,
  },
  {
    key: "cloudia",
    word: "WIND",
    color: ACT_COLOR.wind,
    lineKey: "rc_04_cloudia",
    col: 0,
    row: 1,
    sky: `linear-gradient(180deg, ${kidTheme.skyTop} 0%, ${kidTheme.skyMid} 100%)`,
  },
  {
    key: "narrator",
    word: "SEA BREEZE",
    color: ACT_COLOR.seaBreeze,
    lineKey: "rc_05_narrator",
    col: 1,
    row: 1,
    sky: `linear-gradient(180deg, ${kidTheme.skyLow} 0%, ${SEA_NEAR} 100%)`,
  },
];

const ChantScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const windows = {
    puff: lineWindow(scene, "rc_02_puff"),
    sunny: lineWindow(scene, "rc_03_sunny"),
    cloudia: lineWindow(scene, "rc_04_cloudia"),
    narrator: lineWindow(scene, "rc_05_narrator"),
  };

  return (
    <AbsoluteFill style={{ background: kidTheme.ink }}>
      {PANELS.map((p) => {
        const [from, to] = windows[p.key];
        // A panel lights as its character takes the word and stays lit: by the
        // last line all four are up, which is the shape of the recap.
        const live = frame >= from - 8;
        return (
          <ChantPanel
            key={p.key}
            panel={p}
            live={live}
            lit={live && frame < to + 40}
            slam={from + 4}
            speaking={stage.speaking(p.key)}
          />
        );
      })}
      {/* Grid lines, so four pictures read as one split screen. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          boxShadow: `inset 0 0 0 10px ${kidTheme.ink}`,
        }}
      />
      <div style={{ position: "absolute", left: PANEL_W - 5, top: 0, width: 10, height: 1080, background: kidTheme.ink }} />
      <div style={{ position: "absolute", left: 0, top: PANEL_H - 5, width: 1920, height: 10, background: kidTheme.ink }} />
    </AbsoluteFill>
  );
};

const ChantPanel: React.FC<{
  panel: Panel;
  live: boolean;
  lit: boolean;
  slam: number;
  speaking: boolean;
}> = ({ panel, live, lit, slam, speaking }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordIn = spring({ frame: frame - slam, fps, config: { damping: 11, mass: 0.7 } });
  const flash = live ? Math.max(0, 1 - (frame - slam) / 10) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: panel.col * PANEL_W,
        top: panel.row * PANEL_H,
        width: PANEL_W,
        height: PANEL_H,
        overflow: "hidden",
        background: panel.sky,
      }}
    >
      <PanelCast who={panel.key} speaking={speaking} lit={lit} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(36,52,71,${live ? 0 : 0.55})`,
          pointerEvents: "none",
        }}
      />
      {live ? (
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 12px ${panel.color}`, pointerEvents: "none" }} />
      ) : null}
      {live && wordIn > 0.002 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 30,
            display: "flex",
            justifyContent: "center",
            fontFamily: kidTheme.fontFamily,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: panel.color,
              border: `9px solid ${kidTheme.ink}`,
              borderRadius: kidRadius.banner,
              padding: "8px 30px",
              // WARM AIR RISES is three words in a 960 panel; the others are
              // one or two, so the size is per-word rather than per-panel.
              fontSize: panel.word.length > 10 ? 60 : 74,
              fontWeight: 900,
              letterSpacing: -1,
              color: kidTheme.paper,
              WebkitTextStroke: `4px ${kidTheme.ink}`,
              whiteSpace: "nowrap",
              boxShadow: kidShadow(1.1),
              transform: `scale(${0.5 + 0.5 * wordIn}) rotate(${-1.5 + (1 - wordIn) * 6}deg)`,
            }}
          >
            {panel.word}
          </div>
        </div>
      ) : null}
      {flash > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, background: "#ffffff", opacity: flash * 0.7 }} />
      ) : null}
    </div>
  );
};

/** One character (or the sea breeze) inside a 960×540 panel. */
const PanelCast: React.FC<{ who: Panel["key"]; speaking: boolean; lit: boolean }> = ({
  who,
  speaking,
  lit,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (who === "puff") {
    return (
      <>
        <svg width={PANEL_W} height={PANEL_H} viewBox={`0 0 ${PANEL_W} ${PANEL_H}`} style={{ position: "absolute", inset: 0 }}>
          <path d={`M -40 430 Q 300 370 700 420 Q 900 448 1000 424 L 1000 560 L -40 560 Z`} fill={kidTheme.grass} />
          {Array.from({ length: 14 }, (_, i) => {
            const x = 20 + i * 70;
            const lean = Math.sin(t * 1.6 + i) * 9;
            return (
              <path
                key={i}
                d={`M ${x} 470 q ${6 + lean} -30 ${2 + lean * 1.6} -56`}
                stroke={kidTheme.grassDark}
                strokeWidth={8}
                strokeLinecap="round"
                fill="none"
                opacity={0.5}
              />
            );
          })}
        </svg>
        <Puff
          x={470}
          y={hover("puff", 230, 0.92)}
          scale={0.92}
          opacity={PUFF_OPACITY.full}
          phase={PHASE.puff}
          emotion="proud"
          speaking={speaking}
          look="camera"
          idle={1.2}
          wisps={3}
        />
      </>
    );
  }
  if (who === "sunny") {
    return (
      <Sunny
        x={470}
        y={200}
        scale={0.56}
        phase={PHASE.sunny}
        emotion="proud"
        speaking={speaking}
        shades={lit ? 0.9 : 0.2}
        raySpeed={0.22}
        look={{ x: 0, y: 0.1 }}
      />
    );
  }
  if (who === "cloudia") {
    return (
      <>
        <svg width={PANEL_W} height={PANEL_H} viewBox={`0 0 ${PANEL_W} ${PANEL_H}`} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 9 }, (_, i) => {
            const y = 60 + i * 46;
            const x = ((t * 210 + i * 137) % 1300) - 300;
            return (
              <path
                key={i}
                d={`M ${x} ${y} q 70 -14 140 -2`}
                stroke="#ffffff"
                strokeWidth={8}
                strokeLinecap="round"
                fill="none"
                opacity={0.45}
              />
            );
          })}
        </svg>
        <Cloudia
          x={470}
          y={210}
          scale={0.7}
          phase={PHASE.cloudia}
          emotion="proud"
          speaking={speaking}
          fill={0.35}
          bowTie
          look={{ x: 0, y: 0.15 }}
        />
      </>
    );
  }
  // The Narrator has no body, so his panel is the thing he is describing: hot
  // sand, cool sea, and the wind that makes off the water every sunny day.
  return (
    <svg width={PANEL_W} height={PANEL_H} viewBox={`0 0 ${PANEL_W} ${PANEL_H}`} style={{ position: "absolute", inset: 0 }}>
      <path d={`M 0 250 L 1000 250 L 1000 560 L 0 560 Z`} fill={SEA_MID} />
      <path d={`M 0 250 L 480 250 L 480 560 L 0 560 Z`} fill={SEA_FAR} opacity={0.5} />
      <path d={`M 520 250 Q 640 320 700 560 L 1000 560 L 1000 250 Z`} fill={SAND} />
      {Array.from({ length: 5 }, (_, i) => {
        const y = 300 + i * 46;
        const x = ((t * 260 + i * 173) % 900) - 120;
        return (
          <g key={i}>
            {/* Two lines, never one — see `MotionTrail`. This panel and Scene
                25's cool-air sweep are the two the eight-year-old named: a
                round blob with a single tapering line off it is a tadpole. */}
            <MotionTrail x={x + 122} y={y - 4} len={112} dir={-1} width={7} opacity={0.55} />
            <ellipse cx={x + 150} cy={y - 4} rx={26} ry={20} fill={kidTheme.airCool} stroke={kidTheme.airDeep} strokeWidth={5} />
          </g>
        );
      })}
      {Array.from({ length: 10 }, (_, i) => (
        <ellipse key={i} cx={700 + ((i * 91) % 280)} cy={330 + ((i * 137) % 200)} rx={7} ry={5} fill={SAND_DARK} opacity={0.5} />
      ))}
      <circle cx={840} cy={120} r={54} fill={kidTheme.sun} stroke={kidTheme.sunDeep} strokeWidth={6} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 34 — All four, and everywhere
// ---------------------------------------------------------------------------
//
// The photographable frame. Four words stacked over a turning globe with wind
// arrows on every ocean, held long enough for a parent to get a phone out —
// and then the line that makes it portable, over a window at night.

const WORDS = ["AIR", "WARM AIR RISES", "WIND", "SEA BREEZE"] as const;
const WORD_COLORS = [ACT_COLOR.air, ACT_COLOR.warmAirRises, ACT_COLOR.wind, ACT_COLOR.seaBreeze];

const AllFourScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [wordsFrom, wordsTo] = lineWindow(scene, "rc_06_narrator");
  const [outsideFrom] = lineWindow(scene, "rc_07_narrator");
  const span = Math.max(1, wordsTo - wordsFrom);

  // One stage per Big Word, in the order the Narrator says them.
  const at = (u: number): number => Math.round(wordsFrom + span * u);
  const stage = (u: number): number =>
    spring({ frame: frame - at(u), fps, config: { damping: 13, mass: 0.8 } });

  // "…Outside your window." — the globe gives way to one window, at night,
  // with the curtain moving. Same fact, one room.
  const nightAt = outsideFrom + 62;
  const night = clamp01((frame - nightAt) / 26);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - night }}>
        <PaintedSky bg="sky_recap" phase={0.7} />
        <Globe cx={960} cy={706} r={344} />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 96,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            fontFamily: kidTheme.fontFamily,
            pointerEvents: "none",
          }}
        >
          {WORDS.map((w, i) => {
            const s = stage(0.04 + i * 0.17);
            if (s <= 0.002) return null;
            return (
              <div
                key={w}
                style={{
                  background: WORD_COLORS[i],
                  border: `9px solid ${kidTheme.ink}`,
                  borderRadius: kidRadius.banner,
                  padding: "6px 40px",
                  fontSize: 70,
                  fontWeight: 900,
                  letterSpacing: 1,
                  color: kidTheme.paper,
                  WebkitTextStroke: `5px ${kidTheme.ink}`,
                  boxShadow: kidShadow(1.2),
                  whiteSpace: "nowrap",
                  transform: `scale(${0.55 + 0.45 * s}) rotate(${(i % 2 ? 1.4 : -1.4) * (2 - s)}deg)`,
                }}
              >
                {w}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {night > 0.002 ? <NightWindow opacity={night} /> : null}
    </AbsoluteFill>
  );
};

/**
 * A slow turning globe with wind on every ocean and continent.
 *
 * Longitudes are carried round by one angle, and anything on the far side is
 * simply not drawn — which is all a six-year-old needs a rotating planet to do,
 * and costs no projection maths beyond a cosine.
 */
const Globe: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => {
  const frame = useCurrentFrame();
  const spin = frame * 0.42;
  const LAND: Array<[number, number, number, number]> = [
    // lon, lat, width°, height°  — the shapes are impressionistic on purpose.
    [10, 12, 34, 46],
    [24, -18, 26, 34],
    [-58, -12, 26, 40],
    [-96, 34, 34, 30],
    [96, 32, 46, 34],
    [134, -24, 22, 18],
    [20, 58, 60, 20],
  ];
  const onFace = (lon: number): number => Math.cos(((lon + spin) * Math.PI) / 180);
  const px = (lon: number, lat: number): number =>
    cx + r * Math.sin(((lon + spin) * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180);
  const py = (lat: number): number => cy - r * Math.sin((lat * Math.PI) / 180);
  return (
    <WideLayer>
      <circle cx={cx} cy={cy} r={r} fill={SEA_MID} stroke={kidTheme.ink} strokeWidth={12} />
      <circle cx={cx} cy={cy} r={r} fill={SEA_FAR} opacity={0.35} />
      {/* Land. */}
      {LAND.map(([lon, lat, w, h], i) => {
        const face = onFace(lon);
        if (face <= 0.05) return null;
        return (
          <ellipse
            key={i}
            cx={px(lon, lat)}
            cy={py(lat)}
            rx={(w / 90) * r * face}
            ry={(h / 90) * r}
            fill={i % 2 ? kidTheme.grass : "#7cc879"}
            stroke={kidTheme.grassDark}
            strokeWidth={7}
            opacity={0.95}
          />
        );
      })}
      {/* Wind, on every ocean and every continent: four latitude bands with
          arrowheads riding round them. */}
      {[-52, -26, 0, 26, 52].map((lat, band) =>
        Array.from({ length: 7 }, (_, i) => {
          const lon = -180 + i * 51 + (band % 2 ? 24 : 0) + spin * (band % 2 ? -0.6 : 0.6);
          const face = onFace(lon);
          if (face <= 0.12) return null;
          const x = px(lon, lat);
          const y = py(lat);
          const dir = band % 2 ? -1 : 1;
          return (
            <g key={`${lat}-${i}`} transform={`translate(${x} ${y}) scale(${0.5 + face * 0.7})`} opacity={0.5 + face * 0.4}>
              <path
                d={`M ${-34 * dir} -10 L ${10 * dir} -10 L ${4 * dir} -24 L ${34 * dir} 0 L ${4 * dir} 24 L ${10 * dir} 10 L ${-34 * dir} 10 Z`}
                fill={kidTheme.paper}
                stroke={kidTheme.ink}
                strokeWidth={5}
                strokeLinejoin="round"
              />
            </g>
          );
        }),
      )}
      {/* A hint of atmosphere, so the ball reads as a planet. */}
      <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke={kidTheme.airLight} strokeWidth={16} opacity={0.35} />
      <ellipse cx={cx - r * 0.36} cy={cy - r * 0.42} rx={r * 0.4} ry={r * 0.24} fill="#ffffff" opacity={0.14} />
    </WideLayer>
  );
};

/** A window at night, with the curtain moving. It is happening right now. */
const NightWindow: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // The curtain is the only thing in the shot that moves, and it is the whole
  // point of the shot.
  const blow = (Math.sin(t * 1.1) * 0.5 + 0.5) ** 1.4;
  return (
    <AbsoluteFill style={{ opacity, background: "linear-gradient(180deg, #0d1734 0%, #17264f 60%, #1d2c5c 100%)" }}>
      <WideLayer>
        {/* Wall, window, night sky, moon. */}
        <rect x={480} y={150} width={960} height={720} rx={20} fill="#0b1430" stroke="#2c3d6b" strokeWidth={18} />
        <path d="M 960 150 L 960 870 M 480 510 L 1440 510" stroke="#2c3d6b" strokeWidth={14} />
        {Array.from({ length: 22 }, (_, i) => (
          <circle
            key={i}
            cx={520 + ((i * 173) % 880)}
            cy={190 + ((i * 97) % 640)}
            r={3 + (i % 3)}
            fill={kidTheme.star}
            opacity={0.45 + 0.35 * Math.sin(t * 1.4 + i)}
          />
        ))}
        <circle cx={1250} cy={300} r={62} fill="#e8eeff" opacity={0.9} />
        <circle cx={1222} cy={284} r={52} fill="#0b1430" />
        {/* Curtain, lifting on the wind that is happening right now. */}
        {[0, 1].map((s) => {
          const dir = s === 0 ? 1 : -1;
          const x0 = s === 0 ? 480 : 1440;
          const lift = blow * 300 * dir;
          return (
            <path
              key={s}
              d={
                `M ${x0} 150` +
                ` C ${x0 + lift * 0.7} 320 ${x0 + lift} 560 ${x0 + lift * 0.55} 880` +
                ` L ${x0 + dir * 150} 880 L ${x0 + dir * 150} 150 Z`
              }
              fill="#33488a"
              stroke="#4a63b0"
              strokeWidth={8}
              opacity={0.92}
            />
          );
        })}
      </WideLayer>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 74% 74% at 50% 52%, transparent 40%, rgba(4,9,26,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 35 — The mind-blower
// ---------------------------------------------------------------------------
//
// Satellite view, in four moves: the desert, the plume lifting, several days of
// it crossing an ocean, and a golden haze arriving over a rainforest. Then one
// leaf, close, with sand on it — because the fact only lands if the child can
// see where it ends up.

const MAP = {
  africaX: 1420,
  amazonX: 470,
  plumeY: 520,
} as const;

const MindBlowerScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [liftFrom] = lineWindow(scene, "rc_09_narrator");
  const [crossFrom, crossTo] = lineWindow(scene, "rc_10_narrator");
  const [leafFrom] = lineWindow(scene, "rc_12_narrator");

  const lift = clamp01((frame - liftFrom - 20) / 60);
  const cross = clamp01((frame - crossFrom) / Math.max(1, crossTo - crossFrom + 40));
  const settle = clamp01((frame - crossFrom - 120) / 90);
  const onLeaf = frame >= leafFrom - 6;

  // C10 — nothing is mapped to `rc_11b_puff`, and that is the joke: he keeps
  // the amazed face `rc_11` landed on and does the impression flat over the top
  // of it. Held-beat scene now (12f), so the lead comes off as well.
  const emotion = useEmotion(scene, "puff", { rc_11_puff: "amazed" }, "happy", NO_LEAD);
  // Hoisted out of the JSX: the leaf close-up replaces the whole shot, so an
  // inline `useStage()` would sit inside a ternary and change the hook count on
  // the frame we cut to it.
  const stage = useStage(scene);
  const speaking = stage.speaking("puff");
  // C10 — Puff does Cloudia: a very small version of the grand two-handed
  // presenting gesture she makes in Scene 30. `cheer` is the rig's both-arms-up
  // pose and it is the nearest thing to it. Nobody comments.
  const presenting = stage.lineKey === "rc_11b_puff";

  const puffY = hover("puff", 250, 0.8);

  return (
    <AbsoluteFill style={{ background: "#0f4f7a" }}>
      {onLeaf ? (
        <LeafCloseUp from={leafFrom - 6} />
      ) : (
        <>
          <SatelliteMap lift={lift} cross={cross} settle={settle} />
          <Puff
            x={250}
            y={puffY}
            scale={0.8}
            opacity={PUFF_OPACITY.full}
            phase={PHASE.puff}
            emotion={emotion}
            speaking={speaking}
            pose={presenting ? "cheer" : "rest"}
            look={presenting ? "camera" : { x: 0.5, y: 0.6 }}
            idle={0.9}
            wisps={3}
          />
          <Bubbles
            scene={scene}
            cast={{ puff: { x: 250, y: puffY, scale: 0.8, who: "puff", side: "right" } }}
            text={{
              rc_11_puff: "Sand. Across a whole OCEAN.",
              // C10. Cloudia's catchphrase, third firing, out of Puff's mouth.
              rc_11b_puff: "Door to door, darling.",
            }}
            at={{
              rc_11_puff: { x: 620, y: 210, tail: "left" },
              rc_11b_puff: { x: 620, y: 210, tail: "left" },
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};

const SatelliteMap: React.FC<{ lift: number; cross: number; settle: number }> = ({
  lift,
  cross,
  settle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // Several days, in one shot: the light dips and comes back twice while the
  // plume crosses, which is the cheapest legible time-lapse there is.
  const day = 0.5 + 0.5 * Math.cos(cross * Math.PI * 4);
  return (
    <>
      <WideLayer>
        {/* Ocean. */}
        <rect x={WIDE.x} y={WIDE.y} width={WIDE.w} height={WIDE.h} fill="#12628f" />
        {Array.from({ length: 16 }, (_, i) => (
          <path
            key={i}
            d={`M ${-200 + ((i * 211) % 2200)} ${120 + i * 62} q 90 -14 180 0`}
            stroke="#2a86b8"
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
            opacity={0.5}
          />
        ))}
        {/* Africa, with the Sahara on it. */}
        <path
          d={`M 1180 60 Q 1560 40 1900 180 Q 2000 520 1760 820 Q 1500 1060 1280 940 Q 1140 700 1180 60 Z`}
          fill="#c9a86b"
          stroke="#8a6b3c"
          strokeWidth={10}
        />
        <path d={`M 1240 180 Q 1620 140 1880 260 Q 1840 470 1560 520 Q 1300 500 1240 180 Z`} fill="#e8cf95" />
        {/* South America, with the Amazon on it. */}
        <path
          d={`M 240 240 Q 560 180 700 380 Q 760 640 560 900 Q 380 1080 250 940 Q 150 640 240 240 Z`}
          fill="#6fbf72"
          stroke="#3f8a46"
          strokeWidth={10}
        />
        <path d={`M 300 380 Q 560 330 660 470 Q 640 700 470 800 Q 320 780 300 380 Z`} fill="#4fae66" />
        {/* The haze arriving, and the green coming up with it. */}
        {settle > 0.01 ? (
          <path
            d={`M 300 380 Q 560 330 660 470 Q 640 700 470 800 Q 320 780 300 380 Z`}
            fill="#e8cf95"
            opacity={settle * 0.5}
          />
        ) : null}
      </WideLayer>

      {/* The plume: pale dust lifting off the desert and streaming west. */}
      <WideLayer>
        {Array.from({ length: 26 }, (_, i) => {
          const u = clamp01((cross * 1.5 + i / 26) % 1.5);
          const start = { x: MAP.africaX - 60, y: MAP.plumeY - 120 + ((i * 97) % 260) };
          const end = { x: MAP.amazonX + 30, y: MAP.plumeY + 60 + ((i * 61) % 200) };
          const p = moveAlong(start, end, u, {
            arc: 0.06 + (i % 5) * 0.02,
            ease: kidEase.linear,
          });
          const grow = lift * (u < 0.06 ? u / 0.06 : 1);
          const r = 54 + (i % 6) * 22 + u * 40;
          return (
            <ellipse
              key={i}
              cx={p.x + Math.sin(t * 0.7 + i) * 12}
              cy={p.y + Math.sin(t * 0.9 + i * 1.3) * 10}
              rx={r}
              ry={r * 0.62}
              fill="#f0dcae"
              opacity={grow * (u > 0.86 ? Math.max(0, (1 - u) / 0.14) : 0.62)}
            />
          );
        })}
      </WideLayer>

      {/* Place names: a map is allowed to have words on it. */}
      <MapLabel x={1560} y={330} text="THE SAHARA" />
      <MapLabel x={960} y={840} text="THE ATLANTIC OCEAN" small />
      <MapLabel x={470} y={560} text="THE AMAZON" />

      {/* Night sweeping over, twice, so "several days" is on screen. */}
      <AbsoluteFill
        style={{
          background: "rgba(10,22,52,1)",
          opacity: cross > 0.02 && cross < 0.98 ? (1 - day) * 0.34 : 0,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

const MapLabel: React.FC<{ x: number; y: number; text: string; small?: boolean }> = ({
  x,
  y,
  text,
  small,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      fontFamily: kidTheme.fontFamily,
      fontSize: small ? kidType.min : kidType.min + 10,
      fontWeight: 900,
      letterSpacing: 3,
      color: kidTheme.paper,
      WebkitTextStroke: `5px ${kidTheme.ink}`,
      paintOrder: "stroke",
      whiteSpace: "nowrap",
      pointerEvents: "none",
    }}
  >
    {text}
  </div>
);

/** One green leaf, close, with a few grains of desert sand on it. */
const LeafCloseUp: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const push = interpolate(frame - from, [0, 120], [1.16, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #2f8752 0%, #1f6b48 100%)" }}>
      <Camera cam={{ x: 960, y: 560, zoom: push }}>
        <WideLayer>
          {/* Out-of-focus jungle behind: three big soft leaves. */}
          {[
            [280, 300, 1.5, -22],
            [1620, 260, 1.7, 20],
            [1000, 120, 1.2, 6],
          ].map(([x, y, s, rot], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s}) rotate(${rot as number})`} opacity={0.5}>
              <path d="M 0 0 Q 190 -120 340 40 Q 190 200 0 0 Z" fill="#2f8752" />
            </g>
          ))}
          {/* The leaf. */}
          <g transform={`translate(940 620) rotate(${-8 + Math.sin(t * 0.8) * 1.6})`}>
            <path d="M -520 0 C -300 -300 300 -320 560 -40 C 300 260 -280 280 -520 0 Z" fill="#4fae66" stroke={kidTheme.ink} strokeWidth={12} strokeLinejoin="round" />
            <path d="M -520 0 C -260 -60 300 -60 560 -40" stroke="#2f8752" strokeWidth={16} fill="none" />
            {[-380, -220, -60, 100, 260].map((vx, i) => (
              <g key={vx}>
                <path d={`M ${vx} ${-16 - i * 4} q 60 -78 130 -104`} stroke="#3f9a5f" strokeWidth={9} fill="none" opacity={0.8} />
                <path d={`M ${vx} ${-8 - i * 4} q 60 74 120 96`} stroke="#3f9a5f" strokeWidth={9} fill="none" opacity={0.8} />
              </g>
            ))}
            {/* The sand. A few grains, and they came four thousand miles. */}
            {Array.from({ length: 26 }, (_, i) => {
              const a = i * 2.39996;
              const rr = 300 * Math.sqrt((i + 0.5) / 26);
              return (
                <ellipse
                  key={i}
                  cx={-60 + Math.cos(a) * rr}
                  cy={-20 + Math.sin(a) * rr * 0.5}
                  rx={9 + (i % 3) * 4}
                  ry={7 + (i % 2) * 3}
                  fill="#e8cf95"
                  stroke={kidTheme.ink}
                  strokeWidth={4}
                  opacity={0.95}
                />
              );
            })}
          </g>
        </WideLayer>
      </Camera>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 70% 66% at 50% 50%, rgba(255,244,184,0.18) 0%, transparent 72%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 36 — Tease and sign-off
// ---------------------------------------------------------------------------

const S36_SUNNY = { x: 1310, y: 470, scale: 0.9 };
const S36_PUFF = { x: 230, y: 880, scale: 0.5 };

const TeaseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [, nextTo] = lineWindow(scene, "rc_13_narrator");
  const [wrongFrom] = lineWindow(scene, "rc_15_narrator");
  const [byeFrom] = lineWindow(scene, "rc_17_puff");
  const [beatFrom] = heldBeat(scene, "rc_15_narrator");

  // The sky deepens to its most saturated blue and fills the frame — which is
  // both the sign-off and the setup for the question episode three answers.
  const deep = clamp01((frame - 10) / 90);
  const poster = spring({ frame: frame - nextTo + 26, fps, config: { damping: 13, mass: 0.8 } });
  const button = spring({ frame: frame - byeFrom + 20, fps, config: { damping: 13, mass: 0.8 } });
  const wave = Math.sin(frame / 5) * 10;

  const stage = useStage(scene);
  // Emotion lead 0, as scripted: his face must not fall until "Wait. What?"
  // itself, or the reaction pre-empts the joke inside the 45-frame beat.
  const sunnyEmotion = useEmotion(
    scene,
    "sunny",
    { rc_14_sunny: "proud", rc_16_sunny: "amazed" },
    "proud",
    NO_LEAD,
  );

  const puffY = hover("puff", S36_PUFF.y, S36_PUFF.scale);
  const cast: Cast = {
    sunny: { ...S36_SUNNY, who: "sunny", side: "left" },
    puff: { x: S36_PUFF.x, y: puffY, scale: S36_PUFF.scale, who: "puff", side: "right" },
  };

  return (
    <AbsoluteFill>
      <PaintedSky bg="sky_recap" phase={1.8} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, #0f6fc4 0%, #2a9fe0 62%, #7ed0f5 100%)`,
          opacity: deep * 0.85,
        }}
      />

      {/* The poster for episode three. He is already posing for it. */}
      <div
        style={{
          position: "absolute",
          left: S36_SUNNY.x,
          top: S36_SUNNY.y + 96,
          width: 780,
          height: 720,
          marginLeft: -390,
          marginTop: -360,
          transform: `scale(${poster}) rotate(${-3 + (1 - poster) * 8}deg)`,
          transformOrigin: "50% 100%",
          background: `linear-gradient(180deg, ${kidTheme.skyLow} 0%, ${kidTheme.paper} 100%)`,
          border: `12px solid ${kidTheme.ink}`,
          borderRadius: kidRadius.card,
          boxShadow: kidShadow(1.4),
          fontFamily: kidTheme.fontFamily,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 26,
            textAlign: "center",
            fontSize: kidType.min,
            fontWeight: 900,
            letterSpacing: 6,
            color: kidTheme.inkSoft,
          }}
        >
          NEXT TIME
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 30,
            textAlign: "center",
            fontSize: 78,
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: 1,
            color: ACT_COLOR.wind,
            WebkitTextStroke: `6px ${kidTheme.ink}`,
            paintOrder: "stroke",
          }}
        >
          WHY IS THE
          <br />
          SKY BLUE?
        </div>
      </div>
      <Sunny
        x={S36_SUNNY.x}
        y={S36_SUNNY.y}
        scale={S36_SUNNY.scale * Math.min(1, poster * 1.2)}
        phase={PHASE.sunny}
        emotion={sunnyEmotion}
        speaking={stage.speaking("sunny")}
        shades={frame >= wrongFrom ? 0.9 : 0.15}
        raySpeed={0.3}
        look={frame >= beatFrom ? { x: -0.3, y: 0 } : { x: -0.2, y: 0.1 }}
      />

      {/* Puff waves from the corner: visible to us, invisible to everyone in
          the picture, and at full strength for the last time. */}
      <Camera cam={{ x: S36_PUFF.x, y: S36_PUFF.y, rotate: frame >= byeFrom ? wave : 0 }}>
        <Puff
          x={S36_PUFF.x}
          y={puffY}
          scale={S36_PUFF.scale}
          opacity={PUFF_OPACITY.full}
          phase={PHASE.puff}
          emotion="excited"
          speaking={stage.speaking("puff")}
          pose={frame >= byeFrom ? "wave" : "rest"}
          look="camera"
          idle={1.2}
          wisps={3}
        />
      </Camera>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 52,
          textAlign: "center",
          fontFamily: kidTheme.fontFamily,
          transform: `scale(${Math.max(0, button)})`,
          zIndex: 20,
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: kidTheme.paper,
            border: `7px solid ${kidTheme.ink}`,
            borderRadius: kidRadius.pill,
            padding: "10px 44px",
            fontSize: kidType.min,
            fontWeight: 900,
            letterSpacing: 6,
            color: kidTheme.ink,
            boxShadow: kidShadow(1),
          }}
        >
          LITTLE BIG WORLD · SEE YOU NEXT TIME
        </span>
      </div>

      <Bubbles
        scene={scene}
        cast={cast}
        text={{
          rc_14_sunny: "That one is me as well!",
          rc_16_sunny: "Wait. What?",
          rc_17_puff: "Bye! You can't see me.",
        }}
        at={{
          rc_14_sunny: { x: 620, y: 300, tail: "right" },
          rc_16_sunny: { x: 780, y: 300, tail: "right" },
          rc_17_puff: { x: 560, y: 620, tail: "left" },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------

export const RECAP_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s33_chant: ChantScene,
  s34_all_four: AllFourScene,
  s35_mind_blower: MindBlowerScene,
  s36_tease: TeaseScene,
};
