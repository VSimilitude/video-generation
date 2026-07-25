import React from "react";
import {
  Cloudia,
  Drip,
  KidBackdrop,
  Sunny,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  mixHex,
} from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  ACT_COLOR,
  AbsoluteFill,
  Bubbles,
  Camera,
  CaptionCard,
  PHASE,
  SteamWisps,
  WaterBand,
  WideLayer,
  lineWindow,
  spring,
  stand,
  useCurrentFrame,
  useEmotion,
  useVideoConfig,
  type Cast,
  type TimedScene,
} from "./common";
import { BathTubPanel, CycleRing } from "./act3";

// RECAP — Scenes 33–36 of script.md: the chant, the ring, the mind-blower and
// the tease.
//
// Two things here are deliberately *repeats* rather than new pictures, because
// recognition is the whole job of a recap:
//   - the narrator's panel in Scene 33 is Scene 30's `CycleRing`, still turning
//     the way Sunny left it spinning in Scene 31;
//   - Scene 35 opens on Scene 28's `BathTubPanel`, the same tub and the same
//     duck, because "the water in your bath" only lands if the viewer has
//     already watched that bath being filled from the river.
// Both are imported from ./act3 rather than redrawn.
//
// Scene 34 is the episode's summary image — the frame a parent screenshots —
// so it assembles once on the four Big Words and then holds, clean and turning.

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------------------
// Scene 33 — The chant
// ---------------------------------------------------------------------------

type Panel = {
  key: "sunny" | "cloudia" | "drip" | "narrator";
  word: string;
  color: string;
  lineKey: string;
  /** Grid cell. */
  col: 0 | 1;
  row: 0 | 1;
  sky: string;
};

const PANELS: Panel[] = [
  {
    key: "sunny",
    word: "EVAPORATION",
    color: ACT_COLOR.evaporation,
    lineKey: "rc_02_sunny",
    col: 0,
    row: 0,
    sky: `linear-gradient(180deg, ${kidTheme.sunLight} 0%, ${kidTheme.sun} 100%)`,
  },
  {
    key: "cloudia",
    word: "CONDENSATION",
    color: ACT_COLOR.condensation,
    lineKey: "rc_03_cloudia",
    col: 1,
    row: 0,
    sky: `linear-gradient(180deg, ${kidTheme.skyMid} 0%, ${kidTheme.skyLow} 100%)`,
  },
  {
    key: "drip",
    word: "PRECIPITATION",
    color: ACT_COLOR.precipitation,
    lineKey: "rc_04_drip",
    col: 0,
    row: 1,
    sky: `linear-gradient(180deg, ${kidTheme.waterDark} 0%, ${kidTheme.water} 100%)`,
  },
  {
    key: "narrator",
    word: "COLLECTION",
    color: ACT_COLOR.collection,
    lineKey: "rc_05_narrator",
    col: 1,
    row: 1,
    sky: `linear-gradient(180deg, ${kidTheme.waterDeep} 0%, ${kidTheme.waterDark} 100%)`,
  },
];

const PANEL_W = 960;
const PANEL_H = 540;

const ChantScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  // Every character mouths their own line inside their own panel; the hooks are
  // read here so the panels stay dumb.
  const speaking = {
    sunny: useSpeaking(scene, "sunny"),
    cloudia: useSpeaking(scene, "cloudia"),
    drip: useSpeaking(scene, "drip"),
    narrator: false,
  };
  const windows = {
    sunny: lineWindow(scene, "rc_02_sunny"),
    cloudia: lineWindow(scene, "rc_03_cloudia"),
    drip: lineWindow(scene, "rc_04_drip"),
    narrator: lineWindow(scene, "rc_05_narrator"),
  };

  return (
    <AbsoluteFill style={{ background: kidTheme.ink }}>
      {PANELS.map((p) => {
        const [from, to] = windows[p.key];
        // A panel lights the moment its character takes the word, and stays lit
        // — by the last line all four are up, which is the recap's shape.
        const live = frame >= from - 8;
        const slam = from + 4;
        return (
          <ChantPanel
            key={p.key}
            panel={p}
            live={live}
            slam={slam}
            lit={frame >= from - 8 && frame < to + 40}
            speaking={speaking[p.key]}
          />
        );
      })}
      {/* Grid lines, so four panels read as one split screen. */}
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
  const left = panel.col * PANEL_W;
  const top = panel.row * PANEL_H;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: PANEL_W,
        height: PANEL_H,
        overflow: "hidden",
        background: panel.sky,
      }}
    >
      <PanelCast who={panel.key} speaking={speaking} lit={lit} />
      {/* Unlit panels sit back; the lit one is at full daylight. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(36,52,71,${live ? 0 : 0.55})`,
          pointerEvents: "none",
        }}
      />
      {live ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: `inset 0 0 0 12px ${panel.color}`,
            pointerEvents: "none",
          }}
        />
      ) : null}
      {live && wordIn > 0.002 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 34,
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
              padding: "8px 34px",
              fontSize: 74,
              fontWeight: 900,
              letterSpacing: -1,
              color: kidTheme.paper,
              WebkitTextStroke: `4px ${kidTheme.ink}`,
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

/** One character (or the ring) inside a 960×540 panel, in panel coordinates. */
const PanelCast: React.FC<{ who: Panel["key"]; speaking: boolean; lit: boolean }> = ({
  who,
  speaking,
  lit,
}) => {
  const frame = useCurrentFrame();
  // Everything sits in the top two-thirds of the panel: the word banner owns
  // the bottom 140px, and a character standing in it loses their mouth.
  if (who === "sunny") {
    return (
      <>
        <svg width={PANEL_W} height={PANEL_H} viewBox={`0 0 ${PANEL_W} ${PANEL_H}`} style={{ position: "absolute", inset: 0 }}>
          <ellipse cx={480} cy={470} rx={620} ry={70} fill={kidTheme.water} />
          <ellipse cx={380} cy={452} rx={180} ry={24} fill={kidTheme.waterLight} opacity={0.7} />
        </svg>
        <Sunny
          x={480}
          y={228}
          scale={0.6}
          emotion="proud"
          speaking={speaking}
          phase={PHASE.sunny}
          shades={lit ? 0 : 1}
          look={{ x: 0, y: 0.15 }}
        />
      </>
    );
  }
  if (who === "cloudia") {
    return (
      <Cloudia
        x={480}
        y={232}
        scale={0.66}
        emotion="proud"
        speaking={speaking}
        phase={PHASE.cloudia}
        clipboard
        fill={0.35}
        look={{ x: 0, y: 0.2 }}
      />
    );
  }
  if (who === "drip") {
    return (
      <>
        <svg width={PANEL_W} height={PANEL_H} viewBox={`0 0 ${PANEL_W} ${PANEL_H}`} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 16 }, (_, i) => {
            const x = ((i * 137) % 980) - 20;
            const y = ((frame * 17 + i * 97) % 700) - 120;
            return (
              <path
                key={i}
                d={`M ${x} ${y} L ${x + 12} ${y - 70}`}
                stroke={kidTheme.waterLight}
                strokeWidth={8}
                strokeLinecap="round"
                opacity={0.6}
              />
            );
          })}
        </svg>
        <Drip
          x={470}
          y={stand("drip", 372)}
          scale={0.72}
          emotion="excited"
          speaking={speaking}
          phase={PHASE.drip}
          shadow={false}
          idle={1.5}
          pose="cheer"
          look="camera"
        />
      </>
    );
  }
  // The narrator has no body, so his panel is the thing he is describing —
  // Scene 30's ring, still turning the way Sunny left it in Scene 31.
  return (
    <div style={{ position: "absolute", left: -480, top: -270, width: 1920, height: 1080 }}>
      <CycleRing cx={960} cy={442} r={158} progress={1} spin={frame * 0.6} stations />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 34 — The ring, and the same old water
// ---------------------------------------------------------------------------
//
// The episode in one picture. It assembles on the four words of rc_06 and then
// holds, turning, for two more takes — long enough to photograph, which is the
// brief.

const STATION = {
  sun: { x: 268, y: 208 },
  cloud: { x: 900, y: 280 },
  /** Apex of the mountain the rain lands on. */
  mountain: { x: 1490, y: 540 },
  ocean: { y: 872 },
};
/** The loop drawn behind the whole diagram. */
const LOOP = { cx: 960, cy: 560, rx: 640, ry: 318 };

const TheRingScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [wordsFrom, wordsTo] = lineWindow(scene, "rc_06_narrator");
  const span = wordsTo - wordsFrom;

  // One stage per Big Word, in the order the narrator says them.
  const at = (u: number) => Math.round(wordsFrom + span * u);
  const stage = (u: number) =>
    spring({ frame: frame - at(u), fps, config: { damping: 13, mass: 0.8 } });
  const evap = stage(0.04);
  const cond = stage(0.2);
  const prec = stage(0.36);
  const coll = stage(0.52);
  // "Around, and around, and around." — the arrows arrive last and never stop.
  const ringIn = stage(0.68);
  const spin = Math.max(0, frame - at(0.68)) * 0.34;

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={0} waves={false} />
      {/* The loop goes down first, behind everything: it is what the pieces are
          arranged on, and the scenery occluding it is what gives the picture
          depth instead of a hoop pasted over a drawing. */}
      <DiagramLoop progress={clamp01(ringIn)} spin={spin} />

      <WideLayer>
        <rect x={-1200} y={STATION.ocean.y + 60} width={4400} height={1200} fill={kidTheme.waterDeep} />
      </WideLayer>
      {/* Land first, then the sea over its feet: the mountain rises out of the
          water and the river runs into it, rather than both sitting on top. */}
      <WideLayer>
        {prec > 0.02 ? <DiagramMountain x={STATION.mountain.x} y={STATION.mountain.y} on={prec} /> : null}
        {coll > 0.02 ? <DiagramRiver on={coll} /> : null}
      </WideLayer>
      <WaterBand top={STATION.ocean.y} warmth={0.4} dx={-frame * 1.1} />

      {/* Sun, and the energy that runs the whole thing. */}
      <DiagramSun x={STATION.sun.x} y={STATION.sun.y} on={evap} />
      <WideLayer>
        {evap > 0.02 ? (
          <g opacity={clamp01(evap)}>
            <VapourColumn x={470} top={STATION.cloud.y + 120} bottom={STATION.ocean.y - 10} />
            <SteamWisps x={660} y={STATION.ocean.y - 20} count={3} scale={1.2} />
          </g>
        ) : null}
        {/* Rain after the mountain, or the mountain hides the rain that is
            supposed to be landing on it. */}
        {prec > 0.02 ? <RainFall x={1150} from={STATION.cloud.y + 150} to={760} on={prec} /> : null}
      </WideLayer>
      <DiagramCloud x={STATION.cloud.x} y={STATION.cloud.y} on={cond} />

      <DiagramLabel text="EVAPORATION" color={ACT_COLOR.evaporation} x={318} y={678} on={evap} />
      <DiagramLabel text="CONDENSATION" color={ACT_COLOR.condensation} x={946} y={78} on={cond} />
      <DiagramLabel text="PRECIPITATION" color={ACT_COLOR.precipitation} x={1596} y={286} on={prec} />
      <DiagramLabel text="COLLECTION" color={ACT_COLOR.collection} x={1020} y={1006} on={coll} />
    </AbsoluteFill>
  );
};

/**
 * The loop, as a wide ellipse with arrowheads travelling along it. Rotating an
 * ellipse wobbles; moving the arrows around a fixed one reads as "and it keeps
 * going", which is the sentence this shape has to say.
 */
const DiagramLoop: React.FC<{ progress: number; spin: number }> = ({ progress, spin }) => {
  const { cx, cy, rx, ry } = LOOP;
  const d =
    `M ${cx} ${cy - ry}` +
    ` A ${rx} ${ry} 0 0 1 ${cx} ${cy + ry}` +
    ` A ${rx} ${ry} 0 0 1 ${cx} ${cy - ry}`;
  const at = (u: number) => {
    // u = 0 at the bottom, running clockwise: up the left, over the top, down
    // the right — the order the water actually goes round.
    const th = (Math.PI / 2) + u * Math.PI * 2;
    return {
      x: cx + Math.cos(th) * rx,
      y: cy + Math.sin(th) * ry,
      // Tangent of the ellipse, for the arrowhead's heading.
      a: (Math.atan2(Math.cos(th) * ry, -Math.sin(th) * rx) * 180) / Math.PI,
    };
  };
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <path d={d} pathLength={1} strokeDasharray={`${progress} 1`} stroke={kidTheme.star} strokeWidth={56} fill="none" opacity={0.5} />
      <path d={d} pathLength={1} strokeDasharray={`${progress} 1`} stroke={kidTheme.paper} strokeWidth={26} fill="none" opacity={0.95} />
      <path d={d} pathLength={1} strokeDasharray={`${progress} 1`} stroke={kidTheme.waterDark} strokeWidth={10} fill="none" opacity={0.8} />
      {progress > 0.98
        ? Array.from({ length: 6 }, (_, i) => {
            const u = ((spin / 360 + i / 6) % 1 + 1) % 1;
            const p = at(u);
            return (
              <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a})`}>
                <path
                  d="M -30 -22 L 26 0 L -30 22 Z"
                  fill={kidTheme.waterDark}
                  stroke={kidTheme.paper}
                  strokeWidth={7}
                  strokeLinejoin="round"
                />
              </g>
            );
          })
        : null}
    </svg>
  );
};

const DiagramLabel: React.FC<{ text: string; color: string; x: number; y: number; on: number }> = ({
  text,
  color,
  x,
  y,
  on,
}) => {
  if (on <= 0.002) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * Math.min(1, on)})`,
        background: color,
        border: `8px solid ${kidTheme.ink}`,
        borderRadius: kidRadius.pill,
        padding: "8px 34px",
        fontSize: kidType.min + 8,
        fontWeight: 900,
        letterSpacing: 2,
        color: kidTheme.paper,
        WebkitTextStroke: `3px ${kidTheme.ink}`,
        whiteSpace: "nowrap",
        boxShadow: kidShadow(1),
        fontFamily: kidTheme.fontFamily,
        zIndex: 30,
      }}
    >
      {text}
    </div>
  );
};

const DiagramSun: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => {
  const frame = useCurrentFrame();
  if (on <= 0.002) return null;
  const s = Math.min(1, on);
  return (
    <>
      <WideLayer opacity={s}>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M ${x - 40 + i * 26} ${y + 110} L ${x + 90 + i * 120} ${STATION.ocean.y - 20} L ${x + 146 + i * 120} ${STATION.ocean.y - 20} L ${x + 16 + i * 26} ${y + 110} Z`}
            fill={kidTheme.sunLight}
            opacity={0.2 + 0.07 * Math.sin(frame / 18 + i)}
          />
        ))}
      </WideLayer>
      <Sunny x={x} y={y} scale={0.5 * s} emotion="proud" phase={PHASE.sunny} shades={1} raySpeed={0.22} look={{ x: 0.5, y: 0.4 }} />
    </>
  );
};

const VapourColumn: React.FC<{ x: number; top: number; bottom: number }> = ({ x, top, bottom }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => {
        const cycle = ((frame * 1.6 + i * 62) % (bottom - top)) / (bottom - top);
        const y = bottom - cycle * (bottom - top);
        const px = x + Math.sin(cycle * 5 + i) * 62 + cycle * 190;
        const o = 0.5 + 0.5 * Math.sin(cycle * Math.PI);
        return (
          <g key={i} opacity={o}>
            {/* A tail *below* each drop: a teardrop on its own reads as rain
                falling, whatever direction it is actually travelling. */}
            <path
              d={`M ${px} ${y + 30} L ${px - 6} ${y + 116}`}
              stroke={kidTheme.waterLight}
              strokeWidth={9}
              strokeLinecap="round"
              opacity={0.6}
            />
            <path
              transform={`translate(${px} ${y}) scale(${1.5 - cycle * 0.5})`}
              d="M 0 -26 C 6 -14 17 -6 17 6 A 17 17 0 0 1 -17 6 C -17 -6 -6 -14 0 -26 Z"
              fill={kidTheme.waterLight}
              stroke={kidTheme.waterDark}
              strokeWidth={5}
            />
          </g>
        );
      })}
    </g>
  );
};

const DiagramCloud: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => {
  if (on <= 0.002) return null;
  const s = Math.min(1, on);
  return (
    <Cloudia
      x={x}
      y={y}
      scale={0.8 * s}
      emotion="happy"
      phase={PHASE.cloudia}
      fill={0.5}
      bowTie
      look={{ x: 0.1, y: 0.3 }}
    />
  );
};

const RainFall: React.FC<{ x: number; from: number; to: number; on: number }> = ({ x, from, to, on }) => {
  const frame = useCurrentFrame();
  return (
    <g opacity={Math.min(1, on)}>
      {Array.from({ length: 22 }, (_, i) => {
        const lane = x + ((i * 79) % 460) - 40;
        const span = to - from;
        const y = from + ((frame * 13 + i * 53) % span);
        return (
          <path
            key={i}
            d={`M ${lane} ${y} L ${lane + 10} ${y + 46}`}
            stroke={kidTheme.waterLight}
            strokeWidth={9}
            strokeLinecap="round"
            opacity={0.9}
          />
        );
      })}
    </g>
  );
};

const DiagramMountain: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => {
  const s = Math.min(1, on);
  const base = STATION.ocean.y + 16;
  return (
    <g opacity={s}>
      <path
        d={`M ${x - 262} ${base} L ${x} ${y} L ${x + 262} ${base} Z`}
        fill="#9fb4c6"
        stroke={kidTheme.ink}
        strokeWidth={10}
        strokeLinejoin="round"
      />
      <path d={`M ${x - 262} ${base} L ${x} ${y} L ${x + 28} ${y + 34} L ${x - 196} ${base} Z`} fill="#8ba3b8" opacity={0.55} />
      <path
        d={`M ${x - 74} ${y + 92} L ${x} ${y} L ${x + 74} ${y + 92} Q ${x} ${y + 60} ${x - 74} ${y + 92} Z`}
        fill="#ffffff"
      />
    </g>
  );
};

/** The river coming off the mountain and back into the sea. */
const DiagramRiver: React.FC<{ on: number }> = ({ on }) => {
  const frame = useCurrentFrame();
  const s = Math.min(1, on);
  // Stops at the shoreline: any lower and the waves drawn over it swallow the
  // river whole, which is exactly what the first pass did.
  const y0 = STATION.ocean.y - 96;
  const d = `M 1330 ${y0} Q 1200 ${y0 + 60} 1020 ${y0 + 92}`;
  return (
    <g opacity={s}>
      <path d={d} stroke={kidTheme.waterDeep} strokeWidth={62} strokeLinecap="round" fill="none" />
      <path d={d} stroke={kidTheme.water} strokeWidth={42} strokeLinecap="round" fill="none" />
      {Array.from({ length: 4 }, (_, i) => {
        const u = (frame * 0.012 + i * 0.25) % 1;
        const px = 1330 - u * 310;
        const py = y0 + Math.sin(u * Math.PI) * 40 + u * 92;
        return <ellipse key={i} cx={px} cy={py} rx={24} ry={7} fill={kidTheme.waterLight} opacity={0.85} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 35 — The mind-blower
// ---------------------------------------------------------------------------

const ERAS = ["tonight", "a hundred years ago", "long, long ago", "a VERY long time ago"];

const MindBlowerScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [bathFrom, bathTo] = lineWindow(scene, "rc_09_narrator");

  // "So the water in your bath tonight? It might once have been a dinosaur's
  // puddle." — the ripple back through time lands the footprint on the word.
  const span = bathTo - bathFrom;
  const cuts = [0, Math.round(span * 0.42), Math.round(span * 0.58), Math.round(span * 0.74)];
  const era = cuts.reduce((acc, at, i) => (frame >= at ? i : acc), 0);

  const talking = useSpeaking(scene, "drip");
  const emotion = useEmotion(scene, "drip", { rc_10_drip: "excited" }, "amazed");

  return (
    <AbsoluteFill style={{ background: kidTheme.ink }}>
      <BathTubPanel />
      {era >= 1 ? <RippleReveal from={cuts[1]}><VictorianStreet /></RippleReveal> : null}
      {era >= 2 ? <RippleReveal from={cuts[2]}><Jungle /></RippleReveal> : null}
      {era >= 3 ? (
        <RippleReveal from={cuts[3]}>
          <DinoPuddle />
        </RippleReveal>
      ) : null}

      {era >= 3 ? (
        <>
          <Drip
            x={620}
            y={stand("drip", 902)}
            scale={0.8}
            emotion={emotion}
            speaking={talking}
            phase={PHASE.drip}
            shadow={false}
            idle={1.2}
            look="upRight"
          />
          <Bubbles
            scene={scene}
            cast={{ drip: { x: 620, y: stand("drip", 902), scale: 0.8, who: "drip", side: "right" } }}
            text={{ rc_10_drip: "I was a dinosaur's puddle!" }}
          />
        </>
      ) : null}

      {ERAS.map((label, i) => (
        <CaptionCard
          key={label}
          text={label}
          from={cuts[i]}
          until={i === ERAS.length - 1 ? undefined : cuts[i + 1] - 4}
          y={128}
          align="left"
          color={i === ERAS.length - 1 ? kidTheme.star : kidTheme.paper}
        />
      ))}
    </AbsoluteFill>
  );
};

/** The same water, one era further back: an expanding ripple opens the shot. */
const RippleReveal: React.FC<{ from: number; children: React.ReactNode }> = ({ from, children }) => {
  const frame = useCurrentFrame();
  const u = clamp01((frame - from) / 20);
  const r = u * 130;
  return (
    <>
      <AbsoluteFill style={{ clipPath: `circle(${r}% at 50% 56%)` }}>{children}</AbsoluteFill>
      {u < 1 ? (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {[0, 0.18, 0.36].map((d) => {
            const ru = clamp01(u - d);
            if (ru <= 0) return null;
            return (
              <ellipse
                key={d}
                cx={960}
                cy={604}
                rx={ru * 1500}
                ry={ru * 1000}
                fill="none"
                stroke={kidTheme.paper}
                strokeWidth={18 * (1 - ru)}
                opacity={0.7 * (1 - ru)}
              />
            );
          })}
        </svg>
      ) : null}
    </>
  );
};

const VictorianStreet: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #6b5a49 0%, #b79a76 62%, #d9c3a1 100%)" }} />
    <WideLayer>
      {[
        [-200, 300, 420],
        [280, 210, 360],
        [700, 340, 300],
        [1060, 180, 460],
        [1560, 280, 400],
      ].map(([x, y, w]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={1080 - y} fill="#4a3b30" />
          <path d={`M ${x} ${y} L ${x + w / 2} ${y - 90} L ${x + w} ${y} Z`} fill="#4a3b30" />
          {[0, 1, 2].map((r) =>
            [0, 1].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={x + 50 + c * (w - 150)}
                y={y + 70 + r * 150}
                width={72}
                height={104}
                rx={12}
                fill="#f0d9a8"
                opacity={0.75}
              />
            )),
          )}
        </g>
      ))}
      {/* Gas lamp, and a figure with an umbrella. */}
      <g transform="translate(1370 520)">
        <path d="M 0 380 L 0 -30" stroke="#2c231c" strokeWidth={22} strokeLinecap="round" />
        <path d="M -46 -30 L 46 -30 L 26 -110 L -26 -110 Z" fill="#ffe9a8" stroke="#2c231c" strokeWidth={12} strokeLinejoin="round" />
        <circle cx={0} cy={-70} r={80} fill={kidTheme.star} opacity={0.22} />
      </g>
      <g transform="translate(690 640)" fill="#2c231c">
        <ellipse cx={0} cy={-172} rx={40} ry={44} />
        <rect x={-52} y={-232} width={104} height={26} rx={12} />
        <rect x={-34} y={-292} width={68} height={68} rx={12} />
        <path d="M -56 -120 q 56 -30 112 0 L 96 190 L -96 190 Z" />
        <path d="M 90 -150 q 130 -10 180 90 q -180 -40 -360 0 q 50 -100 180 -90 Z" />
        <path d="M 90 -150 L 90 120" stroke="#2c231c" strokeWidth={12} />
      </g>
      {/* Cobbles, and the puddle in the street. */}
      <rect x={-1200} y={860} width={4400} height={800} fill="#8f7c68" />
      {Array.from({ length: 40 }, (_, i) => (
        <ellipse key={i} cx={-200 + (i % 10) * 230 + (i % 3) * 40} cy={900 + Math.floor(i / 10) * 62} rx={90} ry={26} fill="#7d6b59" />
      ))}
      <ellipse cx={880} cy={980} rx={330} ry={62} fill="#9fb6c2" />
      <ellipse cx={880} cy={972} rx={300} ry={50} fill="#c7dce6" opacity={0.8} />
    </WideLayer>
  </AbsoluteFill>
);

const Jungle: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #1f6b48 0%, #3f9a5f 58%, #7cc879 100%)" }} />
      <WideLayer>
        {[
          [120, 260, 1.5, -20],
          [1720, 200, 1.7, 22],
          [620, 90, 1.1, 8],
          [1280, 120, 1.2, -12],
        ].map(([x, y, s, rot], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s}) rotate(${(rot as number) + Math.sin(frame / 40 + i) * 3})`}>
            <path d="M 0 0 Q 190 -120 340 40 Q 190 200 0 0 Z" fill="#2f8752" stroke="#1f6b48" strokeWidth={10} />
            <path d="M 0 0 L 330 40" stroke="#1f6b48" strokeWidth={10} strokeLinecap="round" />
          </g>
        ))}
        {[
          [220, 1040],
          [820, 1080],
          [1520, 1040],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[-60, -30, 0, 30, 60].map((a) => (
              <path
                key={a}
                transform={`rotate(${a})`}
                d="M 0 0 Q 40 -190 0 -320 Q -40 -190 0 0 Z"
                fill="#4fae66"
                stroke="#2f8752"
                strokeWidth={8}
              />
            ))}
          </g>
        ))}
        <ellipse cx={960} cy={960} rx={520} ry={92} fill="#2c6f7d" />
        <ellipse cx={960} cy={948} rx={480} ry={78} fill="#54b8c4" opacity={0.85} />
        <SteamWisps x={760} y={920} count={3} scale={1.3} color="#e6fff6" />
      </WideLayer>
    </AbsoluteFill>
  );
};

/** A muddy puddle, and the foot that made it. Friendly, never scary. */
const DinoPuddle: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${kidTheme.sunsetLow} 0%, #e6c48f 44%, #b98f5f 100%)` }} />
      <WideLayer>
        {/* Distant ferny hills. */}
        <path d="M -1200 700 Q -200 560 500 690 Q 1300 830 3200 660 L 3200 1700 L -1200 1700 Z" fill="#a97f52" />
        <path d="M -1200 820 Q 300 720 1200 840 Q 2200 960 3200 830 L 3200 1700 L -1200 1700 Z" fill="#8f6942" />
        {/* The footprint: three toes, pressed into the mud. */}
        <g transform="translate(1180 900)">
          <ellipse cx={0} cy={0} rx={330} ry={170} fill="#6f4f31" />
          {[-1, 0, 1].map((s) => (
            <ellipse key={s} cx={s * 210} cy={-170} rx={120} ry={110} fill="#6f4f31" transform={`rotate(${s * 16} ${s * 210} -170)`} />
          ))}
          <ellipse cx={0} cy={6} rx={300} ry={144} fill="#563c25" />
          {[-1, 0, 1].map((s) => (
            <ellipse key={s} cx={s * 208} cy={-166} rx={100} ry={92} fill="#563c25" />
          ))}
        </g>
        {/* The puddle beside it. */}
        <ellipse cx={620} cy={950} rx={360} ry={104} fill="#5d7f8c" />
        <ellipse cx={620} cy={940} rx={330} ry={88} fill="#8fc3d1" />
        <ellipse cx={520} cy={918} rx={110} ry={26} fill="#d9f2f8" opacity={0.8} />
        {/* And the leg that made it, walking out of frame. Rounded, green and
            calm: friendly is a design constraint here, not a preference. */}
        <g transform="translate(1740 60)">
          <path
            d="M -170 -560 Q -250 100 -190 600 Q -60 680 110 620 Q 150 120 170 -560 Z"
            fill="#8fbf5e"
            stroke="#5d8a3c"
            strokeWidth={14}
            strokeLinejoin="round"
          />
          <path
            d="M -200 600 q -150 60 -170 150 q 190 60 420 20 q 60 -100 -50 -160 Z"
            fill="#7fb050"
            stroke="#5d8a3c"
            strokeWidth={12}
            strokeLinejoin="round"
          />
          {[-160, -40, 90].map((x) => (
            <ellipse key={x} cx={x} cy={760} rx={62} ry={34} fill="#6c9c43" stroke="#5d8a3c" strokeWidth={9} />
          ))}
          {/* Spots, so the leg is an animal and not a stem. */}
          {[
            [-90, -320, 34],
            [30, -120, 28],
            [-60, 120, 30],
            [60, 340, 24],
          ].map(([cx, cy, r]) => (
            <ellipse key={`${cx},${cy}`} cx={cx} cy={cy} rx={r} ry={r * 0.72} fill="#6c9c43" opacity={0.8} />
          ))}
        </g>
        {/* One fern in the near foreground, so the shot has a floor — the pair
            of them turned the dinosaur's leg into a third plant. */}
        <g transform="translate(80 1120)">
          {[-50, -18, 14, 46].map((a) => (
            <path
              key={a}
              transform={`rotate(${a + Math.sin(frame / 46 + a) * 2})`}
              d="M 0 0 Q 46 -220 0 -380 Q -46 -220 0 0 Z"
              fill="#4e8a49"
              stroke="#3f7d45"
              strokeWidth={8}
            />
          ))}
        </g>
      </WideLayer>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 36 — Tease and sign-off
// ---------------------------------------------------------------------------

const S36_SUNNY = { x: 1330, y: 470, scale: 0.92 };
const S36_DRIP = { x: 250, y: stand("drip", 980), scale: 0.16 };

const TeaseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [windFrom] = lineWindow(scene, "rc_11_narrator");
  const [, creditTo] = lineWindow(scene, "rc_13_narrator");

  const poster = spring({ frame: frame - windFrom - 40, fps, config: { damping: 13, mass: 0.8 } });
  const button = spring({ frame: frame - creditTo + 40, fps, config: { damping: 13, mass: 0.8 } });
  const wave = Math.sin(frame / 5) * 11;

  const sunnyTalking = useSpeaking(scene, "sunny");
  const dripTalking = useSpeaking(scene, "drip");

  const cast: Cast = {
    sunny: { ...S36_SUNNY, who: "sunny" },
    drip: { ...S36_DRIP, who: "drip", side: "right" },
  };

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={5} waves={false} ground />
      <WindStreaks />
      <Blowing />

      {/* Sunny is already posing for the sequel. */}
      <div
        style={{
          position: "absolute",
          left: S36_SUNNY.x,
          top: S36_SUNNY.y + 88,
          width: 760,
          height: 700,
          marginLeft: -380,
          marginTop: -350,
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
            top: 28,
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
            bottom: 34,
            textAlign: "center",
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: 2,
            color: kidTheme.purple,
            WebkitTextStroke: `6px ${kidTheme.ink}`,
          }}
        >
          THE WIND
        </div>
      </div>
      <Sunny
        x={S36_SUNNY.x}
        y={S36_SUNNY.y}
        scale={S36_SUNNY.scale * Math.min(1, poster * 1.2)}
        emotion="proud"
        speaking={sunnyTalking}
        phase={PHASE.sunny}
        shades={0.15}
        raySpeed={0.3}
        look={{ x: -0.2, y: 0.1 }}
      />

      {/* Drip waves from the very corner, still an unreadable speck. */}
      <Camera cam={{ x: S36_DRIP.x, y: 980, rotate: wave }}>
        <Drip
          x={S36_DRIP.x}
          y={S36_DRIP.y}
          scale={S36_DRIP.scale}
          emotion="excited"
          speaking={dripTalking}
          phase={PHASE.drip}
          shadow={false}
          pose="cheer"
          look="right"
        />
      </Camera>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 56,
          textAlign: "center",
          fontFamily: kidTheme.fontFamily,
          transform: `scale(${button})`,
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
        text={{ rc_12_sunny: "That one is me too!", rc_14_drip: "Bye! I'm travel-sized!" }}
        at={{ rc_12_sunny: { x: 560, y: 300, tail: "right" } }}
      />
    </AbsoluteFill>
  );
};

const WindStreaks: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <WideLayer>
      {Array.from({ length: 14 }, (_, i) => {
        const y = 90 + i * 74;
        const x = ((frame * (16 + (i % 4) * 6) + i * 431) % 3400) - 1400;
        const len = 220 + (i % 3) * 160;
        return (
          <path
            key={i}
            d={`M ${x} ${y} q ${len * 0.5} ${-18 - (i % 3) * 8} ${len} 0`}
            stroke="#ffffff"
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
            opacity={0.34}
          />
        );
      })}
    </WideLayer>
  );
};

/** Leaves, and Cloudia's hat, going past at speed. */
const Blowing: React.FC = () => {
  const frame = useCurrentFrame();
  const hatX = ((frame * 21 + 200) % 3000) - 700;
  const hatY = 300 + Math.sin(frame / 15) * 90;
  return (
    <WideLayer>
      {Array.from({ length: 12 }, (_, i) => {
        const x = ((frame * (17 + (i % 5) * 5) + i * 337) % 3200) - 900;
        const y = 140 + ((i * 137) % 800) + Math.sin(frame / 12 + i) * 60;
        const rot = frame * (3 + (i % 3)) + i * 40;
        const leaf = i % 3 === 0 ? kidTheme.sunDark : i % 3 === 1 ? kidTheme.tomato : kidTheme.grassDark;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.7 + (i % 3) * 0.25})`}>
            <path d="M 0 0 Q 44 -46 96 0 Q 44 46 0 0 Z" fill={leaf} stroke={mixHex(leaf, kidTheme.ink, 0.4)} strokeWidth={6} />
          </g>
        );
      })}
      {/* The manager's hat, last seen on a cloud. */}
      <g transform={`translate(${hatX} ${hatY}) rotate(${Math.sin(frame / 9) * 22})`}>
        <ellipse cx={0} cy={40} rx={120} ry={30} fill={kidTheme.pinkDeep} stroke={kidTheme.ink} strokeWidth={9} />
        <path d="M -66 40 L -50 -66 Q 0 -96 50 -66 L 66 40 Z" fill={kidTheme.pink} stroke={kidTheme.ink} strokeWidth={9} strokeLinejoin="round" />
        <path d="M -58 -18 L 58 -18" stroke={kidTheme.ink} strokeWidth={9} />
      </g>
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------

export const RECAP_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s33_chant: ChantScene,
  s34_the_ring: TheRingScene,
  s35_mind_blower: MindBlowerScene,
  s36_tease: TeaseScene,
};
