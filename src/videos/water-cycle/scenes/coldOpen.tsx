import React from "react";
import { Drip, kidRadius, kidShadow, kidTheme, kidType } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  AbsoluteFill,
  Bubbles,
  Camera,
  SkyBlend,
  Vignette,
  WaterBand,
  interpolate,
  lineWindow,
  midOf,
  projectMark,
  spring,
  stand,
  useCurrentFrame,
  useEmotion,
  useVideoConfig,
  type Cast,
  type Mark,
  type TimedScene,
} from "./common";

// COLD OPEN — Scenes 1 and 2 of script.md. Hook, hero, title.
//
// Scene 1 is one unbroken push-in: black-ish pre-dawn ocean, one enormous
// wave, and we magnify absurdly until a single drop fills the frame and strikes
// a superhero pose in a cape made of foam. Scene 2 whips up out of the water
// into the title.

const SURFACE = 700;
const DRIP_SCALE = 0.34;
// `y` is not the character's middle: CharacterFrame scales about the bottom of
// its box, so stand() takes the ground line and hands back the prop. See
// CHAR_BOX in ./common.tsx.
const DRIP_AT = { x: 960, y: stand("drip", SURFACE + 40) };
const DRIP_MARK: Mark = { ...DRIP_AT, scale: DRIP_SCALE, who: "drip", side: "right" };
/** The camera pushes in on his middle, not on his feet. */
const FOCUS = { x: DRIP_AT.x, y: midOf("drip", DRIP_AT.y, DRIP_SCALE) };

const BUBBLES: Record<string, string> = {
  co_02_drip: "That's me! I'm Drip!",
  co_04_drip: "My adventure pose.",
  co_06_drip: "NOT small. Travel-sized!",
};

/** Scene 1 — Open ocean, just before dawn. */
const DawnScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [, hookEnd] = lineWindow(scene, "co_01_narrator");
  const [smallFrom, smallTo] = lineWindow(scene, "co_05_narrator");
  const [protestFrom] = lineWindow(scene, "co_06_drip");

  // The push-in: absurd magnification over the narrator's hook, a small pull
  // back when he says "He is very small" (the frame agreeing with him), and a
  // shove back in when Drip objects.
  const pushEnd = Math.round(hookEnd * 0.82);
  const zoom = interpolate(
    frame,
    [0, pushEnd, smallFrom, smallTo, protestFrom + 10],
    [1, 3.4, 3.4, 2.5, 3.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const cam = { ...FOCUS, zoom };

  // The pose lands as the push-in settles, and is then held a beat too long.
  const poseAt = pushEnd - 26;
  const posed = spring({ frame: frame - poseAt, fps, config: { damping: 9, mass: 0.5 } });

  const emotion = useEmotion(
    scene,
    "drip",
    {
      co_02_drip: "excited",
      co_04_drip: "proud",
      // Not "scared" anywhere: the wobble mouth hard-cuts when a line starts.
      co_06_drip: "grumpy",
    },
    frame > poseAt ? "proud" : "neutral",
  );

  // Bubbles sit outside the camera, so the mark is projected through it.
  const cast: Cast = { drip: projectMark(cam, DRIP_MARK) };

  return (
    <AbsoluteFill>
      <Camera cam={cam}>
        <SkyBlend
          from="night"
          to="underwater"
          // A pre-dawn sea: night sky with the sea's teal bleeding into it.
          u={0.34}
          clouds={2}
          stars
          waves={false}
        />
        {/* The horizon starting to think about morning. */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 70% 26% at 50% ${SURFACE}px, rgba(255,201,60,${0.16 + 0.06 * Math.sin(frame / 40)}) 0%, transparent 70%)`,
          }}
        />
        <WaterBand top={SURFACE} />
        <Glints x={FOCUS.x} y={FOCUS.y} from={poseAt} />
        <FoamCape
          x={DRIP_AT.x}
          y={DRIP_AT.y}
          scale={DRIP_SCALE}
          billow={posed}
        />
        <Drip
          {...DRIP_AT}
          scale={DRIP_SCALE * (1 + 0.06 * Math.max(0, 1 - Math.abs(frame - poseAt) / 12))}
          emotion={emotion}
          speaking={useSpeaking(scene, "drip")}
          phase={0}
          shadow={false}
          look="camera"
          idle={0.7}
          pose={frame > poseAt && emotion !== "excited" ? "cheer" : undefined}
        />
      </Camera>
      <Vignette strength={0.62} />
      <Bubbles scene={scene} cast={cast} text={BUBBLES} />
    </AbsoluteFill>
  );
};

/**
 * The foam cape: a white sheet off Drip's shoulders with a scalloped foam hem,
 * fluttering. Drawn in Drip's own local units at his own position and scale,
 * so it stays welded to him through the push-in.
 */
const FoamCape: React.FC<{ x: number; y: number; scale: number; billow: number }> = ({
  x,
  y,
  scale,
  billow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (billow <= 0.02) return null;
  const t = frame / fps;
  const hemY = 146 + Math.sin(t * 2.1) * 10;
  const scallops = 7;
  // Wider than his body (r = 106) at the hem, or the cape is a white mound
  // hidden entirely behind him.
  const x0 = -215;
  const x1 = 215;
  const step = (x1 - x0) / scallops;
  let hem = "";
  for (let i = 0; i < scallops; i++) {
    const sx = x0 + step * i;
    const dip = 24 + Math.sin(t * 3 + i) * 9;
    hem += ` Q ${sx + step / 2} ${hemY + dip} ${sx + step} ${hemY + Math.sin(t * 2.4 + i) * 7}`;
  }
  const d = `M -52 -62 C -150 -30 -200 44 ${x0} ${hemY}` + hem + ` C 200 44 150 -30 52 -62 Z`;
  return (
    // Positioned exactly like CharacterFrame — same box, same bottom-centre
    // origin — so the cape stays welded to Drip through a 3.4× push-in.
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 360,
        height: 380,
        marginLeft: -180,
        marginTop: -190,
        transformOrigin: "50% 100%",
        transform: `scale(${scale * (0.92 + 0.08 * billow)})`,
        opacity: Math.min(1, billow * 1.4),
      }}
    >
      <svg width={360} height={380} viewBox="-180 -190 360 380" overflow="visible">
        <path
          d={d}
          fill={kidTheme.paper}
          stroke={kidTheme.cloudShade}
          strokeWidth={9}
          strokeLinejoin="round"
          opacity={0.95}
        />
        {/* Foam bubbles along the hem, so it reads as sea-foam not as cloth. */}
        {Array.from({ length: 7 }, (_, i) => (
          <circle
            key={i}
            cx={x0 + 26 + i * (step * 0.94)}
            cy={hemY + 18 + Math.sin(t * 3 + i * 1.3) * 10}
            r={12 + (i % 3) * 4}
            fill={kidTheme.paper}
            stroke={kidTheme.cloudShade}
            strokeWidth={5}
          />
        ))}
      </svg>
    </div>
  );
};

/** "A single glittering drop": four-point sparkles orbiting the hero. */
const Glints: React.FC<{ x: number; y: number; from: number }> = ({ x, y, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = Math.max(0, Math.min(1, (frame - from) / 20));
  if (u <= 0) return null;
  const t = frame / fps;
  return (
    <svg
      style={{ position: "absolute", left: x, top: y, overflow: "visible" }}
      width={1}
      height={1}
    >
      {Array.from({ length: 6 }, (_, i) => {
        const ang = (i / 6) * Math.PI * 2 + t * 0.4;
        const r = 96 + Math.sin(t * 1.7 + i) * 14;
        const a = 12 + 8 * Math.abs(Math.sin(t * 2.3 + i * 1.7));
        const px = Math.cos(ang) * r * 1.5;
        const py = Math.sin(ang) * r;
        return (
          <path
            key={i}
            transform={`translate(${px} ${py})`}
            d={`M 0 ${-a} Q ${a * 0.16} ${-a * 0.16} ${a} 0 Q ${a * 0.16} ${a * 0.16} 0 ${a} Q ${-a * 0.16} ${a * 0.16} ${-a} 0 Q ${-a * 0.16} ${-a * 0.16} 0 ${-a} Z`}
            fill={kidTheme.star}
            opacity={u * (0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i)))}
          />
        );
      })}
    </svg>
  );
};

// --- Scene 2 — the title card ----------------------------------------------

const TITLE_LINES = ["DRIP'S BIG", "ADVENTURE"];

/** Scene 2 — Title card. */
const TitleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The whip up out of the water: the surface starts near the top of frame and
  // drops away as the camera rises.
  const dy = interpolate(frame, [0, 14], [-560, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sunrise = interpolate(frame, [6, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wave = Math.sin((frame - 30) / 5) * 9 * Math.max(0, Math.min(1, (frame - 30) / 20));

  return (
    <AbsoluteFill>
      <SkyBlend from="night" to="sunset" u={sunrise} clouds={3} stars={sunrise < 0.9} waves={false} />
      <Camera cam={{ x: 960, y: 540, dy }}>
        {/* The morning sun coming up behind the horizon — not Sunny; he does
            not get an entrance until Scene 5. */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 800,
            width: 620,
            height: 620,
            marginLeft: -310,
            marginTop: -310,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${kidTheme.sunLight} 0%, ${kidTheme.sun} 58%, rgba(255,201,60,0) 72%)`,
            opacity: 0.85 * sunrise,
          }}
        />
        <WaterBand top={760} warmth={0.25} />
        {/* Drip waves from the corner, far too small to read as anything but a
            speck — the running gag's visual half. */}
        <Camera cam={{ x: 1690, y: 900, rotate: wave }}>
          <Drip
            x={1690}
            y={stand("drip", 900)}
            scale={0.16}
            emotion="happy"
            phase={0}
            shadow={false}
            pose="cheer"
            look="left"
          />
        </Camera>
      </Camera>
      <DrippingTitle from={10} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 690,
          textAlign: "center",
          fontFamily: kidTheme.fontFamily,
          opacity: Math.max(0, Math.min(1, (frame - 60) / 14)),
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
            transform: `scale(${spring({ frame: frame - 60, fps, config: { damping: 12, mass: 0.6 } })})`,
          }}
        >
          LITTLE BIG WORLD · EPISODE ONE
        </span>
      </div>
    </AbsoluteFill>
  );
};

/** The title, in letters that hang drips. */
const DrippingTitle: React.FC<{ from: number }> = ({ from }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 300,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      // Room for the first line's drips to hang without landing on the second.
      gap: 66,
      transform: "translateY(-50%)",
      fontFamily: kidTheme.fontFamily,
      pointerEvents: "none",
    }}
  >
    {TITLE_LINES.map((line, li) => (
      <div key={line} style={{ display: "flex", alignItems: "flex-end" }}>
        {line.split("").map((ch, i) => (
          <TitleLetter
            key={`${ch}-${i}`}
            ch={ch}
            index={li * 10 + i}
            from={from + (li * 10 + i) * 2.5}
          />
        ))}
      </div>
    ))}
  </div>
);

const TitleLetter: React.FC<{ ch: string; index: number; from: number }> = ({
  ch,
  index,
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 9, mass: 0.5 } });
  const size = kidType.title;
  if (ch === " ") return <span style={{ width: size * 0.3 }} />;
  // Some letters grow a drip, on their own cycle, and let it go. The top line
  // gets fewer of them: its drips hang into the line below.
  const drips = index >= 10 ? index % 3 === 0 : index % 7 === 3;
  const t = (frame - from) / 30;
  const cycle = drips && t > 0.6 ? (t * 0.42 + index * 0.17) % 1 : -1;
  const len = cycle < 0 ? 0 : 18 + cycle * 44;
  const fallen = cycle > 0.72 ? (cycle - 0.72) / 0.28 : 0;
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        fontSize: size,
        fontWeight: 900,
        lineHeight: 1,
        color: kidTheme.waterLight,
        WebkitTextStroke: `9px ${kidTheme.ink}`,
        paintOrder: "stroke",
        textShadow: `0 8px 0 rgba(36,52,71,0.4)`,
        transform: `translateY(${(1 - s) * -160}px) scale(${0.4 + 0.6 * s}) rotate(${(1 - s) * -10}deg)`,
        opacity: Math.min(1, Math.max(0, (frame - from) / 3)),
      }}
    >
      {ch}
      {len > 0 ? (
        <svg
          width={60}
          height={200}
          viewBox="-30 0 60 200"
          style={{
            position: "absolute",
            left: "50%",
            top: "82%",
            marginLeft: -30,
            overflow: "visible",
          }}
        >
          <path
            d={`M -13 -10 C -13 ${len * 0.5} -15 ${len} 0 ${len + 16} C 15 ${len} 13 ${len * 0.5} 13 -10 Z`}
            fill={kidTheme.waterLight}
            stroke={kidTheme.ink}
            strokeWidth={7}
            strokeLinejoin="round"
          />
          {fallen > 0 ? (
            <circle
              cx={0}
              cy={len + 40 + fallen * 190}
              r={15}
              fill={kidTheme.waterLight}
              stroke={kidTheme.ink}
              strokeWidth={7}
              opacity={1 - fallen}
            />
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
