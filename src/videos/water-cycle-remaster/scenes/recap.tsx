import React from "react";
import { Img, staticFile } from "remotion";
import { CloudiaHat, SpeechBubble, threeValues, type Value3 } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  AbsoluteFill,
  Bubbles,
  HEIGHT,
  KeyBloom,
  LIGHT,
  LightPool,
  NIGHT_PAPER,
  PHASE,
  PLATES,
  PaintFill,
  PaintedCloudia,
  PaintedDrip,
  PaintedSunny,
  Plate,
  SETS,
  SetStack,
  SteamWisps,
  WIDTH,
  afterLine,
  atLine,
  kidPaintTheme,
  remasterCam,
  ribbon,
  stand,
  useCurrentFrame,
  useEmotion,
  type Cam,
  type PlateKey,
  type Pt,
  type TimedScene,
} from "./common";
import { Svg, Zenith, rnd, secs, shake } from "./act1kit";
import { FgMound, MirroredPlate, PV, PaintedRing, PaintedShape, RainStreaks, band, clamp01, lerp } from "./act3kit";
import {
  BlowingLeaves,
  CardFrame,
  MedallionRim,
  PaintedTag,
  PaperCard,
  SyllableRow,
  WORD_V,
  WindRibbons,
} from "./recapkit";

// RECAP — s33–s36 re-pictured on the look package (shot-plan rows s33–s36 +
// D12 Q4/Q6). Beats are ep 1's (src/videos/water-cycle/scenes/recap.tsx):
// the chant with the four panels, the ring with the four Big Words, the
// dinosaur-puddle mind-blower, the WIND tease. Pictures: s33/s34 are evening
// paper cards (cream ceiling, kit grain, ONE low-left evening key shared by
// every panel and station); s35 is four single night vignette plates joined
// by ripple wipes (camera still); s36 is the home sea at evening, then the
// night-blue next-episode card over the 60 f tail. Every move is pinned to a
// line or a measured word (silencedetect times quoted inline).

const P = kidPaintTheme;
const smooth = (u: number) => {
  const c = clamp01(u);
  return c * c * (3 - 2 * c);
};

/** The shared evening key over a painted set: warm multiply + a low-left warm pool. */
const EveningKey: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <>
    <AbsoluteFill style={{ background: "#e89a70", mixBlendMode: "multiply", opacity: 0.3 * strength }} />
    <AbsoluteFill style={{ background: "#3a2c6a", mixBlendMode: "multiply", opacity: 0.16 * strength }} />
    <LightPool x={-160} y={900} r={1400} ry={1000} color="#ffb07a" opacity={0.42 * strength} />
  </>
);

// ---------------------------------------------------------------------------
// Scene 33 — The chant: four panels on an evening paper card
// ---------------------------------------------------------------------------
// Plan: four medium panels, HOLD creep in all four; each panel lights on its
// line (rc_02–rc_05) with a word slam (a panel-local cream flash 0.4, never
// #fff), no camera move; ONE shared evening key (low left) across all four
// (Q6); unlit panels dim two bands; one bubble at a time inside the lit
// panel, below the word slam. One baseline (virtual y 990), one ink weight.

type PanelKey = "sunny" | "cloudia" | "drip" | "narrator";
type Panel = {
  key: PanelKey;
  word: string;
  syl: string[];
  stress: number;
  v: Value3;
  line: string;
  col: 0 | 1;
  row: 0 | 1;
};

const PANELS: Panel[] = [
  { key: "sunny", word: "EVAPORATION", syl: ["Ee", "vap", "oh", "RAY", "shun"], stress: 3, v: WORD_V.evaporation, line: "rc_02_sunny", col: 0, row: 0 },
  { key: "cloudia", word: "CONDENSATION", syl: ["Con", "den", "SAY", "shun"], stress: 2, v: WORD_V.condensation, line: "rc_03_cloudia", col: 1, row: 0 },
  { key: "drip", word: "PRECIPITATION", syl: ["Pre", "sip", "ih", "TAY", "shun"], stress: 3, v: WORD_V.precipitation, line: "rc_04_drip", col: 0, row: 1 },
  { key: "narrator", word: "COLLECTION", syl: ["Coll", "ECK", "shun"], stress: 1, v: WORD_V.collection, line: "rc_05_narrator", col: 1, row: 1 },
];

const PS = 0.46;
const PW = WIDTH * PS;
const PH = HEIGHT * PS;
const GX = (WIDTH - 2 * PW) / 3;
const GY = (HEIGHT - 2 * PH) / 3;
const cell = (p: Panel) => ({ left: GX + p.col * (PW + GX), top: GY + p.row * (PH + GY) });
/** The shared baseline inside every panel (virtual 1920×1080 px). */
const BASE = 990;
/** Character x inside a panel (virtual px): the left third, so the bubble owns the right. */
const CX = 560;

const ChantScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const speaking = {
    sunny: useSpeaking(scene, "sunny"),
    cloudia: useSpeaking(scene, "cloudia"),
    drip: useSpeaking(scene, "drip"),
    narrator: false,
  };
  const from = PANELS.map((p) => atLine(scene, p.line));
  const to = PANELS.map((p) => afterLine(scene, p.line));
  const allLit = afterLine(scene, "rc_05_narrator");
  const cam = remasterCam(frame);
  const titleOn = clamp01(frame / 10) * (1 - clamp01((frame - from[0] + 10) / 8));

  // Bubble marks in composition px (panel cell + virtual position × PS).
  const mark = (i: number, vy: number) => {
    const c = cell(PANELS[i]);
    return { x: c.left + CX * PS, y: c.top + vy * PS };
  };
  const bub = (i: number) => {
    const c = cell(PANELS[i]);
    return { x: c.left + PW * 0.72, y: c.top + PH * 0.7, tail: "left" as const, tailAt: mark(i, 0).x + 60 };
  };

  return (
    <AbsoluteFill>
      <PaperCard />
      <LightPool x={-200} y={1000} r={1500} ry={900} color="#ffb07a" opacity={0.3} />
      {PANELS.map((p, i) => {
        const lit = frame >= from[i] - 6;
        const dim = frame >= allLit ? 0 : !lit ? 0.62 : frame < to[i] + 6 ? 0 : 0.28;
        return <ChantPanel key={p.key} panel={p} cam={cam} dim={dim} slam={from[i]} speaking={speaking[p.key]} scene={scene} />;
      })}
      {PANELS.map((p) => {
        const c = cell(p);
        return <CardFrame key={p.key} x={c.left} y={c.top} w={PW} h={PH} seed={710 + p.col * 7 + p.row * 13} />;
      })}
      {PANELS.map((p, i) => {
        const c = cell(p);
        const on = smooth((frame - from[i] + 2) / 8);
        return (
          <React.Fragment key={p.key}>
            <PaintedTag id={`s33-w-${p.key}`} text={p.word} x={c.left + PW / 2} y={c.top + 64} v={p.v} size={58} on={frame >= from[i] - 2 ? Math.min(1, on * 1.1) : 0} />
            <SyllableRow id={`s33-s-${p.key}`} syllables={p.syl} stress={p.stress} x={c.left + PW / 2} y={c.top + 148} v={p.v} size={40} from={from[i] + 6} />
          </React.Fragment>
        );
      })}
      <PaintedTag id="s33-title" text="THE FOUR BIG WORDS" x={WIDTH / 2} y={HEIGHT / 2} v={threeValues("#c46a4a", "#6a2a3a", { tame: 0.1 })} size={64} on={titleOn} rot={-2} />
      <Bubbles
        scene={scene}
        cast={{
          sunny: { ...mark(0, 600), scale: 0.5, who: "sunny" },
          cloudia: { ...mark(1, 600), scale: 0.5, who: "cloudia" },
          drip: { ...mark(2, 700), scale: 0.5, who: "drip" },
        }}
        text={{ rc_02_sunny: "It floats up! That is ME!", rc_03_cloudia: "And I get guests!" }}
        at={{ rc_02_sunny: bub(0), rc_03_cloudia: bub(1) }}
        fontSize={44}
        maxWidth={460}
      />
      {/* Bottom-row bubble placed directly: Bubbles clamps y ≤ 800, which lands it on the syllable row. */}
      <SpeechBubble x={bub(2).x} y={cell(PANELS[2]).top + PH * 0.74} text="Best waterslide ever! Whee!" tail="left" tailAt={bub(2).tailAt}
        from={from[2]} until={to[2]} fontSize={44} maxWidth={520} background={NIGHT_PAPER} />
    </AbsoluteFill>
  );
};

const ChantPanel: React.FC<{ panel: Panel; cam: Cam; dim: number; slam: number; speaking: boolean; scene: TimedScene }> = ({
  panel,
  cam,
  dim,
  slam,
  speaking,
  scene,
}) => {
  const frame = useCurrentFrame();
  const c = cell(panel);
  const flash = frame >= slam ? Math.max(0, 1 - (frame - slam) / 8) * 0.4 : 0;
  const id = scene.id;
  const light = LIGHT[id];
  let body: React.ReactNode = null;
  let set = SETS.ocean.sunrise as typeof SETS.ocean.sunrise | typeof SETS.hotel.noon | typeof SETS.valley.rock | typeof SETS.home.evening;
  let hide: Array<"far" | "mid" | "near" | "fg"> = [];
  let fg: React.ReactNode = null;
  let horizons: Partial<Record<"far" | "mid" | "near", number>> = {};
  if (panel.key === "sunny") {
    set = SETS.ocean.sunrise;
    horizons = { far: 700, mid: 820 };
    body = (
      <PaintedSunny id={id} boilKey="sunny-s33" x={CX} y={stand("sunny", BASE) - 90} scale={1.3} emotion="proud" speaking={speaking} phase={PHASE.sunny}
        shades={0} raySpeed={0.3} look={{ x: 0.3, y: 0.15 }} light={light} groundY={BASE} altitude={90} groundLum={0.3} />
    );
  } else if (panel.key === "cloudia") {
    set = SETS.hotel.noon;
    hide = ["fg"];
    horizons = { mid: 760 };
    body = (
      <PaintedCloudia id={id} boilKey="cloudia-s33" x={CX} y={stand("cloudia", BASE)} scale={1.4} emotion="proud" speaking={speaking} phase={PHASE.cloudia}
        clipboard fill={0.35} look={{ x: 0.3, y: 0.2 }} light={light} groundY={BASE} groundLum={0.6} />
    );
  } else if (panel.key === "drip") {
    set = SETS.valley.rock;
    hide = ["fg"];
    horizons = { far: 560, mid: 860 };
    body = (
      <PaintedDrip id={id} boilKey="drip-s33" x={CX} y={stand("drip", BASE)} scale={1.5} emotion="excited" speaking={speaking} phase={PHASE.drip}
        idle={1.5} pose="cheer" look="camera" light={light} groundY={BASE} groundLum={0.45} />
    );
    fg = <RainStreaks count={22} speed={44} len={200} opacity={0.5} seed={33} />;
  } else {
    set = SETS.home.evening;
    hide = ["near", "fg"];
    horizons = { mid: 860 };
    body = <PaintedRing cx={1000} cy={640} r={300} progress={1} spin={frame * 0.6} glow={0.15} />;
  }
  return (
    <div style={{ position: "absolute", left: c.left, top: c.top, width: PW, height: PH, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT, transform: `scale(${PS})`, transformOrigin: "0 0" }}>
        <SetStack set={set} cam={cam} hide={hide} horizons={horizons} sky={<Zenith color="#3a3a7a" mid="#a07a9a" reach={60} opacity={0.35} />}
          stage={<><EveningKey />{body}</>} fg={fg} />
        <AbsoluteFill style={{ background: "#2a2850", mixBlendMode: "multiply", opacity: dim }} />
        {flash > 0.01 ? <AbsoluteFill style={{ background: P.paper, opacity: flash }} /> : null}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 34 — The ring on a paper card
// ---------------------------------------------------------------------------
// Plan + brief: the ring diagram as a brushed ribbon (act 3's PaintedRing, so
// it is the same ring Drip found in s30) on an evening paper card; each Big
// Word station a tiny painted vignette in its act's palette under ONE shared
// evening key; painted tags, ink on cream. Camera: a short PUSH on each
// station timed to its word in rc_06 (silencedetect: EVAPORATION 0.36 s,
// CONDENSATION 1.41 s, PRECIPITATION 2.65 s, COLLECTION 3.85 s, "Around"
// 4.60 s), back out to wide on "Around", then HOLD creep (the frame parents
// photograph). No bubbles in this scene.

const RING = { cx: 960, cy: 572, r: 292 };
const START = 140; // PaintedRing's draw start (deg)
type Station = { key: keyof typeof WORD_V; word: string; deg: number; tag: { x: number; y: number }; plates: Array<{ k: PlateKey; y: number; w: number }> };
const MED_R = 118;
const STATIONS: Station[] = [
  { key: "evaporation", word: "EVAPORATION", deg: 180, tag: { x: 330, y: 572 }, plates: [{ k: "ocean_sky_sunrise", y: -40, w: 480 }, { k: "ocean_mid_morning", y: -60, w: 480 }] },
  { key: "condensation", word: "CONDENSATION", deg: 270, tag: { x: 1420, y: 190 }, plates: [{ k: "hotel_sky", y: -30, w: 460 }, { k: "hotel_far", y: -70, w: 460 }] },
  { key: "precipitation", word: "PRECIPITATION", deg: 0, tag: { x: 1600, y: 572 }, plates: [{ k: "rain_sky", y: -40, w: 460 }, { k: "valley_far_hills", y: -70, w: 460 }] },
  { key: "collection", word: "COLLECTION", deg: 90, tag: { x: 520, y: 930 }, plates: [{ k: "valley_sky_late", y: -40, w: 460 }, { k: "valley_near_river_late", y: -110, w: 460 }] },
];
const stationPt = (deg: number) => {
  const th = (deg * Math.PI) / 180;
  return { x: RING.cx + Math.cos(th) * RING.r, y: RING.cy + Math.sin(th) * RING.r };
};
const fracOf = (deg: number) => ((((deg - START) % 360) + 360) % 360) / 360;
const WORDS_S = [0.36, 1.41, 2.65, 3.85];
const AROUND_S = 4.6;

function ringCam(frame: number, words: number[], around: number): { z: number; dx: number; dy: number } {
  // States: wide → station 0..3 → wide. Each move 12 f ending 2 f after its word lands.
  const keys = [...words.map((w) => w - 10), around - 6];
  const states = [
    { z: 1, f: { x: RING.cx, y: RING.cy }, k: 0 },
    ...STATIONS.map((s) => ({ z: 1.12, f: stationPt(s.deg), k: 0.35 })),
    { z: 1, f: { x: RING.cx, y: RING.cy }, k: 0 },
  ];
  let a = states[0];
  let b = states[0];
  let u = 1;
  for (let i = 0; i < keys.length; i++) {
    if (frame >= keys[i]) {
      a = states[i];
      b = states[i + 1];
      u = smooth((frame - keys[i]) / (i === keys.length - 1 ? 18 : 12));
    }
  }
  const z = lerp(a.z, b.z, u);
  // Put the focus point `k` of the way toward frame centre.
  const off = (s: typeof a) => ({
    dx: (s.f.x - WIDTH / 2) * (1 - s.k - s.z),
    dy: (s.f.y - HEIGHT / 2) * (1 - s.k - s.z),
  });
  const oa = off(a);
  const ob = off(b);
  // After the pull-back the hold creeps (1.00 → 1.02 / 6 s).
  const creep = frame > around + 12 ? 1 + 0.02 * Math.min(1, (frame - around - 12) / 180) : 1;
  return { z: z * creep, dx: lerp(oa.dx, ob.dx, u), dy: lerp(oa.dy, ob.dy, u) };
}

const RingScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const w0 = atLine(scene, "rc_06_narrator");
  const words = WORDS_S.map((s) => secs(w0, s));
  const around = secs(w0, AROUND_S);
  const newFrom = atLine(scene, "rc_07_narrator");
  const sameFrom = atLine(scene, "rc_08_narrator");
  const { z, dx, dy } = ringCam(frame, words, around);
  // The ribbon draws station to station on the words, closes on "Around".
  const targets = STATIONS.map((s) => fracOf(s.deg) + 0.04);
  let progress = 0.02;
  words.forEach((w, i) => {
    progress = Math.max(progress, lerp(i === 0 ? 0.02 : targets[i - 1], targets[i], smooth((frame - w + 8) / 14)));
  });
  progress = Math.max(progress, lerp(targets[3], 1, smooth((frame - around + 4) / 16)));
  const spinF = Math.max(0, frame - around - 12);
  const spin = spinF < 40 ? (0.5 * spinF * spinF) / 80 : 0.5 * (spinF - 20);
  const on = words.map((w) => smooth((frame - w + 6) / 10));
  const active = words.reduce((acc, w, i) => (frame >= w - 4 ? i : acc), -1);
  const dripLook = frame >= around ? "camera" : active >= 0 ? (["left", "up", "right", "camera"] as const)[active] : "camera";
  const dripTalk = false;
  const dripEmotion = frame >= newFrom ? "amazed" : "happy";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${z})`, transformOrigin: `${WIDTH / 2}px ${HEIGHT / 2}px` }}>
        <div style={{ position: "absolute", inset: "-14%" }}>
          <PaperCard tone="#cdb898" />
          <AbsoluteFill style={{ background: "#7a5a7a", mixBlendMode: "multiply", opacity: 0.22 }} />
        </div>
        <LightPool x={-160} y={980} r={1500} ry={1000} color="#ffb07a" opacity={0.34} />
        <LightPool x={RING.cx} y={RING.cy} r={420} color="#ffd8a0" opacity={0.18} />
        <PaintedRing cx={RING.cx} cy={RING.cy} r={RING.r} progress={progress} spin={spin} glow={0.1} stations={false} />
        {STATIONS.map((s, i) => (
          <StationVignette key={s.key} s={s} on={on[i]} />
        ))}
        {/* Tiny painted icons: Sunny drives evaporation; Cloudia hosts condensation. */}
        {on[0] > 0.02 ? (
          <PaintedSunny id={scene.id} boilKey="sunny-s34" x={stationPt(180).x - 10} y={stationPt(180).y - 175} scale={0.3 * on[0]} emotion="proud"
            phase={PHASE.sunny} shades={0} raySpeed={0.3} look={{ x: 0.5, y: 0.4 }} />
        ) : null}
        {on[1] > 0.02 ? (
          <PaintedCloudia id={scene.id} boilKey="cloudia-s34" x={stationPt(270).x - 150} y={stationPt(270).y - 20} scale={0.3 * on[1]} emotion="happy"
            phase={PHASE.cloudia} fill={0.4} bowTie look={{ x: 0.4, y: 0.3 }} />
        ) : null}
        <LightPool x={RING.cx} y={RING.cy + 40} r={220} ry={160} color="#ffc890" opacity={0.3} />
        <PaintedDrip id={scene.id} boilKey="drip-s34" x={RING.cx} y={stand("drip", RING.cy + 50)} scale={0.62} emotion={dripEmotion} speaking={dripTalk}
          phase={PHASE.drip} idle={1.1} look={dripLook} groundY={RING.cy + 50} groundLum={0.7} />
        {STATIONS.map((s, i) => (
          <PaintedTag key={s.key} id={`s34-t-${s.key}`} text={s.word} x={s.tag.x} y={s.tag.y} v={WORD_V[s.key]} size={50} on={on[i]} rot={i % 2 ? 1.5 : -1.5} />
        ))}
        <PaintedTag id="s34-new" text="not ONE new drop" x={RING.cx} y={RING.cy + 122} v={threeValues("#b8a48a", "#5a4060", { tame: 0.1 })} size={40}
          on={frame >= newFrom + 60 && frame < sameFrom ? smooth((frame - newFrom - 60) / 8) : 0} />
        <PaintedTag id="s34-same" text="the SAME water" x={RING.cx} y={RING.cy + 122} v={WORD_V.collection} size={40}
          on={frame >= sameFrom ? smooth((frame - sameFrom - 4) / 8) : 0} />
      </div>
    </AbsoluteFill>
  );
};

/** One ring station: a circular painted vignette (two plates clipped), the shared evening key, an ink rim. */
const StationVignette: React.FC<{ s: Station; on: number }> = ({ s, on }) => {
  const frame = useCurrentFrame();
  if (on <= 0.01) return null;
  const p = stationPt(s.deg);
  const r = MED_R * (0.6 + 0.4 * on);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: p.x - r,
          top: p.y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          overflow: "hidden",
          opacity: clamp01(on * 2),
          background: "#5a4a6a",
        }}
      >
        {s.plates.map((pl) => (
          <Img
            key={pl.k}
            src={staticFile(PLATES[pl.k].src)}
            style={{ position: "absolute", width: pl.w * (r / MED_R), left: r - (pl.w * (r / MED_R)) / 2, top: pl.y * (r / MED_R), height: "auto" }}
          />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "#e89a70", mixBlendMode: "multiply", opacity: 0.32 }} />
        <div style={{ position: "absolute", inset: 0, background: "#3a2c6a", mixBlendMode: "multiply", opacity: 0.14 }} />
        <LightPool x={r * 0.1} y={r * 1.6} r={r * 1.3} color="#ffb07a" opacity={0.45} />
        <Svg style={{ left: -(p.x - r), top: -(p.y - r) }}>
          <StationLife s={s} p={p} frame={frame} r={r} />
        </Svg>
      </div>
      <MedallionRim x={p.x} y={p.y} r={r} on={on} seed={760 + s.deg} />
    </>
  );
};

/** The motion inside each vignette: vapour up, rain down, river ripples; cream at low opacity. */
const StationLife: React.FC<{ s: Station; p: { x: number; y: number }; frame: number; r: number }> = ({ s, p, frame, r }) => {
  if (s.key === "evaporation") {
    return (
      <>
        {Array.from({ length: 5 }, (_, i) => {
          const k = ((frame * 1.2 + i * 37) % 160) / 160;
          const x = p.x - 60 + i * 30 + Math.sin(k * 6 + i) * 10;
          const y = p.y + r * 0.5 - k * r * 1.2;
          return <path key={i} d={ribbon([[x, y + 30], [x + 6, y + 10], [x, y - 12]], 9, 2, 900 + i)} fill={P.paper} opacity={0.6 * Math.sin(k * Math.PI)} />;
        })}
      </>
    );
  }
  if (s.key === "precipitation") {
    return (
      <>
        {Array.from({ length: 9 }, (_, i) => {
          const k = ((frame * 2.2 + rnd(i, 91) * 200) % 200) / 200;
          const x = p.x - r + rnd(i, 92) * r * 2;
          const y = p.y - r + k * r * 2;
          return <path key={i} d={ribbon([[x, y], [x - 4, y + 18], [x - 8, y + 36]], 6, 1, 920 + i)} fill="#cfd8e8" opacity={0.7} />;
        })}
      </>
    );
  }
  if (s.key === "collection") {
    return (
      <>
        {Array.from({ length: 3 }, (_, i) => {
          const k = ((frame * 0.8 + i * 40) % 120) / 120;
          const x = p.x - r * 0.6 + k * r * 1.2;
          const y = p.y + r * 0.35 + i * 14;
          return <path key={i} d={ribbon([[x - 30, y], [x, y - 4], [x + 30, y]], 2, 5, 940 + i)} fill={P.paper} opacity={0.5 * Math.sin(k * Math.PI)} />;
        })}
      </>
    );
  }
  return null;
};

// ---------------------------------------------------------------------------
// Scene 35 — The mind-blower: four night stops, ripple wipes
// ---------------------------------------------------------------------------
// Plan + D12 Q4: single vignette plates per stop (bathtub → Victorian street
// → jungle → puddle by a three-toed footprint), joined by 8 f ripple wipes
// (a water ring opening from the stop's puddle), camera still across each
// wipe; HOLD creep per stop. rc_09 measured: "So the water in your bath
// tonight?" 0.34–1.85 s, "It might once have been a dinosaur's puddle"
// 2.30–4.06 s → stops at 0, 1.95, 2.65, 3.35 s. The bath is the SAME tub as
// s28 (clawfoot, duck at the right, window left) re-painted at night, with
// Drip in it again. Moonlit, low contrast; the puddle holds the moon.

type Stop = { k: PlateKey; at: number; era: string; origin: { x: number; y: number } };
const WIPE = 8;
const S35_TUB = { x: 760, surface: 646, scale: 0.42 };
const PRINT = { x: 600, y: 930 };
const S35_DRIP = { x: 1040, ground: 960, scale: 0.5 };

const MindBlowerScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const b0 = atLine(scene, "rc_09_narrator");
  const stops: Stop[] = [
    { k: "mind_bathtub", at: 0, era: "tonight", origin: { x: 960, y: 640 } },
    { k: "mind_street", at: secs(b0, 1.95), era: "a hundred years ago", origin: { x: 860, y: 930 } },
    { k: "mind_jungle", at: secs(b0, 2.65), era: "long, long ago", origin: { x: 960, y: 900 } },
    { k: "mind_footprint", at: secs(b0, 3.35), era: "a VERY long time ago", origin: { x: PRINT.x, y: PRINT.y } },
  ];
  const cur = stops.reduce((acc, s, i) => (frame >= s.at ? i : acc), 0);
  const emotion = useEmotion(scene, "drip", { rc_10_drip: "excited" }, "amazed");
  const talking = useSpeaking(scene, "drip");
  const prev = cur > 0 && frame < stops[cur].at + WIPE ? cur - 1 : -1;
  const eraV = threeValues("#3e4c8a", "#141a40", { tame: 0.05 });
  return (
    <AbsoluteFill style={{ background: "#141a40" }}>
      {prev >= 0 ? <StopShot stop={stops[prev]} idx={prev} scene={scene} emotion={emotion} talking={talking} /> : null}
      <RippleWipe stop={stops[cur]} first={cur === 0}>
        <StopShot stop={stops[cur]} idx={cur} scene={scene} emotion={emotion} talking={talking} />
      </RippleWipe>
      {stops.map((s, i) => (
        <PaintedTag key={s.era} id={`s35-era-${i}`} text={s.era} x={150 + (s.era.length * 44 * 0.66 + 70) / 2} y={118} v={eraV} size={44}
          on={frame >= s.at && (i === stops.length - 1 || frame < stops[i + 1].at) ? smooth((frame - s.at) / 6) : 0} rot={-1} />
      ))}
      <Bubbles
        scene={scene}
        cast={{ drip: { x: S35_DRIP.x, y: stand("drip", S35_DRIP.ground), scale: S35_DRIP.scale, who: "drip" } }}
        text={{ rc_10_drip: "I was a dinosaur's puddle!" }}
        at={{ rc_10_drip: { x: 1420, y: 330, tail: "left", tailAt: S35_DRIP.x + 50 } }}
      />
    </AbsoluteFill>
  );
};

const RippleWipe: React.FC<{ stop: Stop; first: boolean; children: React.ReactNode }> = ({ stop, first, children }) => {
  const frame = useCurrentFrame();
  const u = first ? 1 : clamp01((frame - stop.at) / WIPE);
  if (u >= 1) return <>{children}</>;
  const e = smooth(u);
  const R = e * 2300;
  return (
    <>
      <AbsoluteFill style={{ clipPath: `ellipse(${R}px ${R * 0.62}px at ${stop.origin.x}px ${stop.origin.y}px)` }}>{children}</AbsoluteFill>
      <Svg>
        {[0, 0.2, 0.4].map((d) => {
          const ru = clamp01(e - d);
          if (ru <= 0) return null;
          const rr = ru * 2300;
          const n = 48;
          const pts: Pt[] = Array.from({ length: n + 1 }, (_, i) => {
            const th = (i / n) * Math.PI * 2;
            return [stop.origin.x + Math.cos(th) * rr, stop.origin.y + Math.sin(th) * rr * 0.62];
          });
          return <path key={d} d={ribbon(pts, 16 * (1 - ru) + 2, 4, 960 + d * 10, { jitter: 0.4 })} fill={NIGHT_PAPER} opacity={0.55 * (1 - ru)} />;
        })}
      </Svg>
    </>
  );
};

const StopShot: React.FC<{ stop: Stop; idx: number; scene: TimedScene; emotion: ReturnType<typeof useEmotion>; talking: boolean }> = ({
  stop,
  idx,
  scene,
  emotion,
  talking,
}) => {
  const frame = useCurrentFrame();
  const z = remasterCam(frame, { creep: { from: stop.at } }).zoom ?? 1;
  const origin = idx === 3 ? "40% 80%" : "50% 55%";
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: origin }}>
        <Plate k={stop.k} />
        <AbsoluteFill style={{ background: "#2a3470", mixBlendMode: "multiply", opacity: 0.18 }} />
        {idx === 0 ? <BathStop scene={scene} /> : null}
        {idx === 1 ? <PuddleGlint x={890} y={905} rx={150} /> : null}
        {idx === 2 ? <PuddleGlint x={1060} y={890} rx={220} /> : null}
        {idx === 3 ? <FootprintStop scene={scene} emotion={emotion} talking={talking} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BathStop: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const dripY = stand("drip", S35_TUB.surface + 80 * S35_TUB.scale);
  return (
    <>
      <LightPool x={420} y={260} r={700} ry={600} color="#a8c0ff" opacity={0.18} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${HEIGHT - S35_TUB.surface - 3}px 0)` }}>
        <PaintedDrip id={scene.id} boilKey="drip-s35-bath" x={S35_TUB.x} y={dripY} scale={S35_TUB.scale} emotion="happy" phase={PHASE.drip} idle={0.7} look="right" />
      </div>
      <Svg>
        <path d={ribbon([[S35_TUB.x - 70, S35_TUB.surface + 2], [S35_TUB.x, S35_TUB.surface - 2], [S35_TUB.x + 70, S35_TUB.surface + 2]], 2, 5, 970)} fill={NIGHT_PAPER} opacity={0.5} />
      </Svg>
    </>
  );
};

const PuddleGlint: React.FC<{ x: number; y: number; rx: number }> = ({ x, y, rx }) => {
  const frame = useCurrentFrame();
  return (
    <Svg>
      {[0, 1].map((i) => {
        const k = ((frame * 0.9 + i * 30) % 60) / 60;
        const rr = rx * (0.3 + k * 0.7);
        return (
          <path key={i} d={ribbon([[x - rr, y], [x, y - rr * 0.12], [x + rr, y]], 2, 4, 980 + i)} fill={NIGHT_PAPER} opacity={0.35 * (1 - k)} />
        );
      })}
    </Svg>
  );
};

// The three-toed print (friendly, blunt-tipped: a heel pad and three long
// toes splayed forward, foreshortened by the low cam), pressed into the mud,
// filled with rainwater that holds the moon.
const TOE_DEG = [-124, -90, -56];
const toeD = (deg: number, len: number, w0: number, w1: number, seed: number) => {
  const a = (deg * Math.PI) / 180;
  const pts: Pt[] = Array.from({ length: 9 }, (_, i) => {
    const u = i / 8;
    return [PRINT.x + Math.cos(a) * len * u, PRINT.y + Math.sin(a) * len * u * 0.62];
  });
  return band(pts, (u) => lerp(w0, w1, u) * (u > 0.85 ? Math.sqrt(Math.max(0.05, (1 - u) / 0.15)) : 1), seed, 0.05);
};
const MUD_V: Value3 = { base: "#1e2242", shadow: "#10122a", light: "#363c66", line: "#0a0c1e" };
const PRINT_WATER: Value3 = { base: "#2e4682", shadow: "#1a2650", light: "#5a72b0", line: "#1a2448" };

const FootprintStop: React.FC<{ scene: TimedScene; emotion: ReturnType<typeof useEmotion>; talking: boolean }> = ({ scene, emotion, talking }) => {
  const frame = useCurrentFrame();
  const pad = (dx: number, dy: number, rx: number, ry: number, rot = 0) => {
    const th0 = (rot * Math.PI) / 180;
    const pts: string[] = [];
    for (let i = 0; i <= 28; i++) {
      const t = (i / 28) * Math.PI * 2;
      const wob = 1 + 0.04 * Math.sin(t * 3 + dx);
      const x = Math.cos(t) * rx * wob;
      const y = Math.sin(t) * ry * wob;
      pts.push(`${(PRINT.x + dx + x * Math.cos(th0) - y * Math.sin(th0)).toFixed(1)} ${(PRINT.y + dy + x * Math.sin(th0) + y * Math.cos(th0)).toFixed(1)}`);
    }
    return `M ${pts.join(" L ")} Z`;
  };
  const rim = [pad(0, 30, 150, 84), ...TOE_DEG.map((d, i) => toeD(d, d === -90 ? 470 : 420, 124, 64, 1011 + i))];
  const water = [pad(0, 34, 122, 62), ...TOE_DEG.map((d, i) => toeD(d, d === -90 ? 430 : 384, 92, 36, 1021 + i))];
  const bob = Math.sin(frame / 18) * 2;
  return (
    <>
      <Svg>
        <PaintedShape id="s35-print-rim" ds={rim} bbox={{ x: PRINT.x - 330, y: PRINT.y - 300, w: 660, h: 420 }} v={MUD_V} ink={6} seed={1001} />
        <PaintFill id="s35-print-water" shape={<>{water.map((d, i) => <path key={i} d={d} />)}</>} bbox={{ x: PRINT.x - 300, y: PRINT.y - 280, w: 600, h: 390 }}
          v={PRINT_WATER} seed={1003} />
        {/* The moon, held in the puddle (low, dimmed cream: the only bright thing). */}
        <ellipse cx={PRINT.x + 10} cy={PRINT.y - 150 + bob} rx={34} ry={13} fill={NIGHT_PAPER} opacity={0.7} />
        <path d={ribbon([[PRINT.x - 40, PRINT.y - 128], [PRINT.x + 10, PRINT.y - 131 + bob], [PRINT.x + 60, PRINT.y - 128]], 2, 5, 1005)} fill={NIGHT_PAPER} opacity={0.4} />
        <path d={ribbon([[PRINT.x - 120, PRINT.y + 40], [PRINT.x - 60, PRINT.y - 10], [PRINT.x - 20, PRINT.y - 60]], 3, 7, 1007)} fill={PV.snow.shadow} opacity={0.35} />
      </Svg>
      <LightPool x={PRINT.x + 10} y={PRINT.y - 150} r={200} ry={80} color="#a8c0ff" opacity={0.25} />
      <PaintedDrip id={scene.id} boilKey="drip-s35" x={S35_DRIP.x} y={stand("drip", S35_DRIP.ground)} scale={S35_DRIP.scale} emotion={emotion} speaking={talking}
        phase={PHASE.drip} idle={1.2} look="left" pose={frame > atLine(scene, "rc_10_drip") + 40 ? "cheer" : undefined} groundY={S35_DRIP.ground} groundLum={0.25} />
    </>
  );
};

// ---------------------------------------------------------------------------
// Scene 36 — The tease, then the next-episode card
// ---------------------------------------------------------------------------
// Plan: wide, horizon low third, HOLD creep; BURST 14 px on "WIND" (rc_11,
// measured ≈1.85 s, VO) as the gust hits; wind ribbons + leaves + Cloudia's
// hat through on 1.3; Sunny LEFT (the key, since s31) strikes a poster pose in
// front of his own NEXT TIME poster for rc_12; Drip an unreadable speck on
// the shore bottom-right for rc_14 (the bubble carries the line). Over the
// 60 f tail: dissolve to the night-blue next-episode card, then to black.

const S36_SUN = { x: 520, y: 470, scale: 1.0 };
const S36_DRIP = { x: 1700, ground: 968, scale: 0.15 };

const TeaseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const n0 = atLine(scene, "rc_11_narrator");
  const windAt = secs(n0, 1.85);
  const posterAt = atLine(scene, "rc_12_sunny") - 6;
  const tail = afterLine(scene, "rc_14_drip");
  const end = scene.durationInFrames;
  const gust = smooth((frame - windAt + 6) / 14);
  const poster = smooth((frame - posterAt) / 12);
  const card = smooth((frame - tail - 6) / 12);
  const black = smooth((frame - (end - 22)) / 20);
  const cam = remasterCam(frame, { deltas: [shake(frame, windAt, 14, 12, "x")] });
  const sunnyTalking = useSpeaking(scene, "sunny");
  const dripTalking = useSpeaking(scene, "drip");
  const wave = Math.sin(frame / 5) * 14;
  const hatX = -300 + ((frame - windAt) * 24) % 2800;
  const hatY = 300 + Math.sin(frame / 15) * 90;
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.home.evening}
        cam={cam}
        bleed={0.15}
        hide={["far", "fg"]}
        horizons={{ mid: 760, near: 930 }}
        sky={<><Zenith color="#26285a" mid="#5a4a7a" reach={60} opacity={0.45} /><LightPool x={S36_SUN.x} y={S36_SUN.y} r={1000} color="#ff9e60" opacity={0.3} /></>}
        far={<MirroredPlate k="home_far_headland_evening" y={0} bleed={0.15} />}
        stage={
          <>
            <div style={{ position: "absolute", inset: "-8%", background: "#4a3c7a", mixBlendMode: "multiply", opacity: 0.5 }} />
            <LightPool x={S36_SUN.x} y={900} r={900} ry={200} color="#ff9e60" opacity={0.2} />
            <PosterCard on={poster} />
            <PaintedSunny id={scene.id} x={S36_SUN.x} y={S36_SUN.y} scale={S36_SUN.scale} emotion={frame >= posterAt ? "proud" : "happy"} speaking={sunnyTalking}
              phase={PHASE.sunny} shades={frame >= posterAt ? 0.15 : 0} smug={frame >= posterAt} raySpeed={0.3 + gust * 0.4} look={{ x: -0.2, y: 0.1 }} />
            <div style={{ position: "absolute", inset: 0, transform: `rotate(${wave}deg)`, transformOrigin: `${S36_DRIP.x}px ${S36_DRIP.ground}px` }}>
              <PaintedDrip id={scene.id} x={S36_DRIP.x} y={stand("drip", S36_DRIP.ground)} scale={S36_DRIP.scale} emotion="excited" speaking={dripTalking}
                phase={PHASE.drip} pose="cheer" look="left" groundY={S36_DRIP.ground} groundLum={0.3} />
            </div>
          </>
        }
        fg={
          <>
            <FgMound id="s36-fgl" side="left" reach={560} top={930} v={{ base: "#1e1826", shadow: "#0e0b14", light: "#3a2a3a", line: "#0a0810" }} seed={1301} />
            <WindRibbons strength={gust} />
            <BlowingLeaves strength={gust} />
            {frame >= windAt ? (
              <Svg>
                <g transform={`translate(${hatX} ${hatY}) rotate(${Math.sin(frame / 9) * 22})`}>
                  <CloudiaHat stream={0.8} />
                </g>
              </Svg>
            ) : null}
          </>
        }
      />
      <KeyBloom x={S36_SUN.x} y={S36_SUN.y - 40} r={320} color="#ffc070" opacity={0.25} />
      <Bubbles
        scene={scene}
        cast={{ sunny: { x: S36_SUN.x, y: S36_SUN.y, scale: S36_SUN.scale, who: "sunny" }, drip: { x: S36_DRIP.x, y: stand("drip", S36_DRIP.ground), scale: S36_DRIP.scale, who: "drip" } }}
        text={{ rc_12_sunny: "That one is me too!", rc_14_drip: "Bye! I'm travel-sized!" }}
        at={{
          rc_12_sunny: { x: 1100, y: 230, tail: "left", tailAt: S36_SUN.x + 180 },
          rc_14_drip: { x: 1380, y: 760, tail: "right", tailAt: S36_DRIP.x - 10 },
        }}
      />
      {card > 0 ? <NextCard on={card} /> : null}
      {black > 0 ? <AbsoluteFill style={{ background: "#07081a", opacity: black }} /> : null}
    </AbsoluteFill>
  );
};

/** Sunny's sequel poster, behind him: a painted cream card, ink ribbon, two painted tags. */
const PosterCard: React.FC<{ on: number }> = ({ on }) => {
  if (on <= 0.01) return null;
  const x = 180;
  const y = 120;
  const w = 700;
  const h = 640;
  const POSTER: Value3 = { base: "#d9c9ae", shadow: "#a08aa0", light: P.paper, line: "#3a2c40" };
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${0.4 + 0.6 * on}) rotate(${-3 + (1 - on) * 8}deg)`, transformOrigin: `${x + w / 2}px ${y + h}px`, opacity: clamp01(on * 2) }}>
      <Svg>
        <PaintedShape id="s36-poster" ds={[`M ${x} ${y} L ${x + w} ${y + 8} L ${x + w - 6} ${y + h} L ${x + 4} ${y + h - 6} Z`]} bbox={{ x, y, w, h }} v={POSTER} ink={8} seed={1101} />
      </Svg>
      <PaintedTag id="s36-p-next" text="NEXT TIME" x={x + w / 2} y={y + 70} v={threeValues("#6a5a8a", "#2a2050", { tame: 0.1 })} size={46} rot={-2} />
      <PaintedTag id="s36-p-wind" text="THE WIND" x={x + w / 2} y={y + h - 80} v={WORD_V.condensation} size={78} rot={2} />
    </div>
  );
};

/** The night-blue next-episode card over the tail. */
const NextCard: React.FC<{ on: number }> = ({ on }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: on }}>
      <PaperCard tone="#5a6aa0" grain={0.5} night={0.72} />
      <LightPool x={-160} y={980} r={1300} ry={900} color="#ffb07a" opacity={0.16} />
      <Svg>
        {Array.from({ length: 22 }, (_, i) => (
          <circle key={i} cx={rnd(i, 1201) * WIDTH} cy={rnd(i, 1203) * 520} r={2 + rnd(i, 1205) * 3} fill={NIGHT_PAPER}
            opacity={0.35 + 0.3 * Math.sin(frame / 10 + i)} />
        ))}
      </Svg>
      <PaintedTag id="s36-c-show" text="LITTLE BIG WORLD" x={WIDTH / 2} y={300} v={threeValues("#3a4a8a", "#141a40", { tame: 0.05 })} size={60} rot={-1} />
      <PaintedTag id="s36-c-next" text="NEXT TIME:" x={WIDTH / 2} y={500} v={threeValues("#6a5a8a", "#2a2050", { tame: 0.1 })} size={50} rot={1} />
      <PaintedTag id="s36-c-wind" text="THE WIND" x={WIDTH / 2} y={650} v={WORD_V.condensation} size={110} rot={-2} />
      <SteamWisps x={WIDTH / 2 - 420} y={680} count={3} scale={1.1} color={NIGHT_PAPER} />
    </AbsoluteFill>
  );
};

export const RECAP_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s33_chant: ChantScene,
  s34_the_ring: RingScene,
  s35_mind_blower: MindBlowerScene,
  s36_tease: TeaseScene,
};
