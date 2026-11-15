import React from "react";
import { kidInkOutline, kidRadius, kidShadow, kidTheme, kidType, mixHex } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  AbsoluteFill,
  Bubbles,
  KeyBloom,
  LightPool,
  PHASE,
  PaintedDrip,
  SETS,
  SetStack,
  afterLine,
  atLine,
  kidPaintTheme,
  midOf,
  outlinePath,
  project,
  remasterCam,
  ribbon,
  spring,
  stand,
  useCurrentFrame,
  useEmotion,
  useVideoConfig,
  type Cast,
  type Pt,
  type TimedScene,
} from "./common";
import { FgSwell, Glints, Svg, secs } from "./act1kit";
import { PaintedShape, band, circleD } from "./act3kit";

// Cold open, re-pictured on the look package (shot-plan rows s01–s02).
// Beats are ep 1's (src/videos/water-cycle/scenes/coldOpen.tsx); every picture
// is new: plate planes, lit painted Drip, camera grammar pinned to line keys.

const P = kidPaintTheme;

// ---------------------------------------------------------------------------
// Scene 1 — Open ocean, just before dawn
// ---------------------------------------------------------------------------
//
// Shot plan: close by the end, horizon top third, low cam. Three stepped
// BURST zooms on co_01 "hero / pinky finger / sneeze" (the macro steps,
// measured with silencedetect: sentence ends at 1.88 s, 4.27 s, 7.54 s);
// HOLD creep from co_02; a pull-back on co_05 "He is very small" (narrator);
// a 14 px BURST back in inside co_05's 12 f gap, settled before the co_06
// bubble. Light: rose rim from low camera-right; sky holds the hue.

const S1_GROUND = 862;
const S1_SCALE = 0.42;
const S1_DRIP = { x: 1010, y: stand("drip", S1_GROUND) };
const S1_FOCUS = { x: S1_DRIP.x, y: midOf("drip", S1_DRIP.y, S1_SCALE) - 10 };

const S1_BUBBLES: Record<string, string> = {
  co_02_drip: "That's me! I'm Drip!",
  co_04_drip: "My adventure pose.",
  co_06_drip: "NOT small. Travel-sized!",
};

const STARS: Array<[number, number, number]> = [
  [180, 110, 6], [420, 210, 4], [760, 80, 5], [1080, 170, 4], [1320, 60, 6], [560, 330, 3],
  [240, 380, 4], [1500, 220, 3], [900, 300, 3], [1760, 120, 4], [1180, 360, 3], [80, 260, 3],
];

const DawnScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hook = atLine(scene, "co_01_narrator");
  const small = atLine(scene, "co_05_narrator");
  const protestGap = afterLine(scene, "co_05_narrator");

  const cam = remasterCam(frame, {
    base: { ...S1_FOCUS },
    creep: { from: atLine(scene, "co_02_drip") },
    bursts: [
      { at: secs(hook, 1.7), delta: { zoom: 1.42 } },
      { at: secs(hook, 4.05), delta: { zoom: 1.36 } },
      { at: secs(hook, 7.3), delta: { zoom: 1.32 } },
      { at: small + 4, delta: { zoom: 0.78 } },
      { at: protestGap, delta: { zoom: 1.16 }, frames: 11 },
    ],
  });

  const poseAt = secs(hook, 7.3) + 6;
  const posed = spring({ frame: frame - poseAt, fps, config: { damping: 9, mass: 0.5 } });
  const emotion = useEmotion(
    scene,
    "drip",
    { co_02_drip: "excited", co_04_drip: "proud", co_06_drip: "grumpy" },
    frame > poseAt ? "proud" : "neutral",
  );
  const speaking = useSpeaking(scene, "drip");
  const zoom = cam.zoom ?? 1;
  const dripScreen = project(cam, S1_FOCUS);
  const cast: Cast = { drip: { ...S1_DRIP, scale: S1_SCALE, who: "drip" } };
  const t = frame / fps;
  const fadeIn = Math.min(1, frame / 14);

  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.ocean.predawn}
        cam={cam}
        horizons={{ far: 520, mid: 596, near: 935 }}
        sky={
          <>
            <LightPool x={1700} y={600} r={1300} ry={520} color="#ffae94" opacity={0.75} />
            <Svg>
              <defs>
                <radialGradient id="s1star">
                  <stop offset="0" stopColor="#efe4cc" stopOpacity={1} />
                  <stop offset="0.4" stopColor="#efe4cc" stopOpacity={0.5} />
                  <stop offset="1" stopColor="#efe4cc" stopOpacity={0} />
                </radialGradient>
              </defs>
              {STARS.map(([x, y, r], i) => (
                <circle key={i} cx={x} cy={y} r={r * 1.6} fill="url(#s1star)"
                  opacity={(0.35 + 0.25 * Math.sin(t * 1.3 + i * 2.1)) * (1 - Math.min(0.6, frame / 1400))} />
              ))}
            </Svg>
          </>
        }
        mid={
          <Svg>
            {/* Rose reflection dabs where the dawn horizon meets the water. */}
            {[0, 1, 2, 3].map((i) => (
              <ellipse key={i} cx={1560 + i * 50 + Math.sin(t * 1.6 + i) * 8} cy={540 + i * 18}
                rx={190 - i * 36} ry={6 + i * 2} fill="#f0a08e" opacity={0.32 - i * 0.06} />
            ))}
          </Svg>
        }
        stage={
          <>
            <Glints x={S1_FOCUS.x} y={S1_FOCUS.y} from={poseAt} r={70} />
            <FoamCape x={S1_DRIP.x} y={S1_DRIP.y} scale={S1_SCALE} billow={posed} />
            <PaintedDrip
              id={scene.id}
              {...S1_DRIP}
              scale={S1_SCALE * (1 + 0.06 * Math.max(0, 1 - Math.abs(frame - poseAt) / 12))}
              emotion={emotion}
              speaking={speaking}
              phase={PHASE.drip}
              look="camera"
              idle={0.7}
              pose={frame > poseAt && emotion !== "excited" ? "cheer" : undefined}
              groundY={S1_GROUND}
              groundLum={0.2}
            />
          </>
        }
      />
      <Bubbles
        scene={scene}
        cast={cast}
        text={S1_BUBBLES}
        at={Object.fromEntries(
          Object.keys(S1_BUBBLES).map((k) => [k, { x: 560, y: 230, tail: "right" as const, tailAt: dripScreen.x - 70 * zoom * S1_SCALE }]),
        )}
      />
      <AbsoluteFill style={{ background: "#1d1c26", opacity: 1 - fadeIn, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/**
 * The foam cape, re-pictured as FOAM (act-1 review F4: the old cream sheet
 * read as a seashell; polish F4b: the beaded arcs read as pearl strings).
 * Now a pooled cream wash per side (a painted band that thickens toward the
 * hem, where foam gathers) with a few irregular bubble CLUSTERS on it and a
 * little spray. Drawn in Drip's local units so it stays welded to him.
 */
const FOAM_V = { base: "#e2d8c8", shadow: "#a9a2c2", light: "#f3ead8", line: "#5d6f86" };
const FoamCape: React.FC<{ x: number; y: number; scale: number; billow: number }> = ({ x, y, scale, billow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (billow <= 0.02) return null;
  const t = frame / fps;
  const cream = "#ece2cf";
  const shade = "#b9b0cc";
  // One arc per side: shoulder → out → down to the hem, fluttering.
  const arc = (side: number): Pt[] =>
    Array.from({ length: 13 }, (_, i) => {
      const u = i / 12;
      const flutter = Math.sin(t * 2.6 + u * 4 + side) * 10 * u;
      return [side * (70 + 150 * Math.sin(u * 1.35) + flutter), -40 + 190 * u + Math.sin(t * 2 + u * 3) * 6 * u] as Pt;
    });
  // Irregular clusters (2 per side): a few bubbles of mixed size huddled on the wash, not a string of beads.
  const CL: Array<{ u: number; parts: Array<[number, number, number]> }> = [
    { u: 0.55, parts: [[0, 0, 11], [13, -6, 6], [-9, 8, 5], [6, 10, 4]] },
    { u: 0.92, parts: [[0, 0, 14], [-16, -4, 8], [12, 9, 7], [22, -5, 4], [-6, 15, 5]] },
  ];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 360, height: 380, marginLeft: -180, marginTop: -190,
      transformOrigin: "50% 100%", transform: `scale(${scale * (0.92 + 0.08 * billow)})`, opacity: Math.min(1, billow * 1.4) }}>
      <svg width={360} height={380} viewBox="-180 -190 360 380" overflow="visible">
        {[-1, 1].map((side) => {
          const pts = arc(side);
          // The wash: a puffy union of overlapping blobs along the arc, small at the shoulder and
          // pooling larger toward the hem (foam is a mass of bubbles, not a strap).
          const puffs = pts.slice(1).map(([px, py], i) => {
            const u = (i + 1) / 12;
            const r = 9 + 24 * u * u + 3 * Math.sin(i * 2.7 + side);
            return circleD(px + side * 4 * Math.sin(i * 1.9), py + 3 * Math.cos(i * 2.3), r);
          });
          return (
            <g key={side}>
              <PaintedShape id={`s01-foam${side}`} ds={puffs} bbox={{ x: side < 0 ? -270 : 30, y: -70, w: 240, h: 270 }}
                v={FOAM_V} ink={2.5} seed={300 + side} strength={1.2} />
              {/* pooled lavender underside along the hem */}
              <path d={band(pts.slice(6).map(([px, py]) => [px, py + 12] as Pt), (u) => 6 + 14 * u, 310 + side, 0.3)} fill={shade} opacity={0.55} />
              {CL.map(({ u, parts }, ci) => {
                const [cx, cy] = pts[Math.round(u * 12)];
                return parts.map(([dx, dy, r], i) => {
                  const wob = Math.sin(t * 3 + i * 1.3 + ci) * 2;
                  const bx = cx + side * dx;
                  const by = cy + dy - 4 + wob;
                  return (
                    <g key={`${ci}-${i}`}>
                      <circle cx={bx} cy={by} r={r} fill={cream} opacity={0.92} />
                      <path d={ribbon([[bx - r * 0.8, by + r * 0.35], [bx, by + r * 0.85], [bx + r * 0.8, by + r * 0.35]], Math.max(2, r * 0.35), 1, 330 + i + ci * 7, { jitter: 0.2 })} fill={shade} opacity={0.8} />
                    </g>
                  );
                });
              })}
            </g>
          );
        })}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={(i - 2) * 70 + Math.sin(t + i) * 8} cy={150 - ((t * 40 + i * 37) % 60)} r={3 + (i % 3) * 1.5} fill={cream} opacity={0.6} />
        ))}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — Title card over the sunrise
// ---------------------------------------------------------------------------
//
// Shot plan: wide, horizon lower third, eye, 0°. BURST tilt-up 26 px peak on
// frame 0 (the whip up out of the water: the camera starts looking down at
// the waves and bursts up to the horizon), then HOLD creep under the card.
// Drip waves from the corner, a speck — unreadable on purpose.

const S2_GROUND = 922;
const S2_DRIP = { x: 1700, y: stand("drip", S2_GROUND) };
const TITLE_LINES = ["DRIP'S BIG", "ADVENTURE"];

const TitleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = remasterCam(frame, {
    base: { x: 960, y: 540, dy: -460 },
    creep: { from: 12 },
    bursts: [{ at: 0, delta: { dy: 460 }, frames: 12 }],
  });
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.ocean.sunrise}
        cam={cam}
        horizons={{ far: 690, mid: 880, near: 1010 }}
        fg={<FgSwell top={1055} />}
        sky={
          <>
            {/* The sunrise plate is pale: deepen the zenith (multiply) so the title sits on value, not on paper. */}
            <AbsoluteFill style={{ background: "linear-gradient(180deg, #3f6fb8 0%, #7f9fd0 38%, rgba(255,255,255,0) 70%)", mixBlendMode: "multiply", opacity: 0.85 }} />
            <LightPool x={960} y={720} r={1100} ry={420} color="#ffc47a" opacity={0.7} />
          </>
        }
        stage={
          <PaintedDrip
            id={scene.id}
            {...S2_DRIP}
            scale={0.16}
            emotion="happy"
            phase={0}
            pose="cheer"
            look="left"
            groundY={S2_GROUND}
            groundLum={0.3}
          />
        }
      />
      <KeyBloom x={960} y={700} r={520} color="#ffd89a" opacity={0.35} />
      <DrippingTitle from={10} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: kidTheme.fontFamily,
        opacity: Math.max(0, Math.min(1, (frame - 60) / 14)) }}>
        <span style={{ display: "inline-block", background: P.paper, border: `7px solid ${P.ink}`, borderRadius: kidRadius.pill,
          padding: "10px 44px", fontSize: kidType.min, fontWeight: 900, letterSpacing: 6, color: P.ink, boxShadow: kidShadow(1),
          transform: `scale(${spring({ frame: frame - 60, fps, config: { damping: 12, mass: 0.6 } })})` }}>
          LITTLE BIG WORLD · EPISODE ONE
        </span>
      </div>
    </AbsoluteFill>
  );
};

const DrippingTitle: React.FC<{ from: number }> = ({ from }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center",
    gap: 66, transform: "translateY(-50%)", fontFamily: kidTheme.fontFamily, pointerEvents: "none" }}>
    {TITLE_LINES.map((line, li) => (
      <div key={line} style={{ display: "flex", alignItems: "flex-end" }}>
        {line.split("").map((ch, i) => (
          <TitleLetter key={`${ch}-${i}`} ch={ch} index={li * 10 + i} from={from + (li * 10 + i) * 2.5} />
        ))}
      </div>
    ))}
  </div>
);

const LETTER = mixHex(P.water.base, P.paper, 0.25);

const TitleLetter: React.FC<{ ch: string; index: number; from: number }> = ({ ch, index, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 9, mass: 0.5 } });
  const size = kidType.title;
  if (ch === " ") return <span style={{ width: size * 0.3 }} />;
  const drips = index >= 10 ? index % 3 === 0 : index % 7 === 3;
  const t = (frame - from) / 30;
  const cycle = drips && t > 0.6 ? (t * 0.42 + index * 0.17) % 1 : -1;
  const len = cycle < 0 ? 0 : 18 + cycle * 44;
  const fallen = cycle > 0.72 ? (cycle - 0.72) / 0.28 : 0;
  const dripD = `M -13 -10 C -13 ${len * 0.5} -15 ${len} 0 ${len + 16} C 15 ${len} 13 ${len * 0.5} 13 -10 Z`;
  return (
    <span style={{ position: "relative", display: "inline-block", fontSize: size, fontWeight: 900, lineHeight: 1, color: LETTER,
      textShadow: `${kidInkOutline(4.5)}, 0 8px 0 rgba(43,42,51,0.35)`,
      transform: `translateY(${(1 - s) * -160}px) scale(${0.4 + 0.6 * s}) rotate(${(1 - s) * -10}deg)`,
      opacity: Math.min(1, Math.max(0, (frame - from) / 3)) }}>
      {ch}
      {len > 0 ? (
        <svg width={60} height={200} viewBox="-30 0 60 200" style={{ position: "absolute", left: "50%", top: "82%", marginLeft: -30, overflow: "visible" }}>
          <path d={dripD} fill={LETTER} />
          <path d={outlinePath(dripD, 7, 2, 900 + index, { thickAt: Math.PI / 2 })} fill={P.ink} />
          {fallen > 0 ? (
            <g opacity={1 - fallen}>
              <circle cx={0} cy={len + 40 + fallen * 190} r={15} fill={LETTER} />
              <path d={outlinePath(`M 15 ${len + 40 + fallen * 190} A 15 15 0 1 1 -15 ${len + 40 + fallen * 190} A 15 15 0 1 1 15 ${len + 40 + fallen * 190} Z`, 6, 2, 950 + index)} fill={P.ink} />
            </g>
          ) : null}
        </svg>
      ) : null}
    </span>
  );
};

export const COLD_OPEN_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s01_dawn: DawnScene,
  s02_title: TitleScene,
};
