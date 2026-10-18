import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Blobby, Drip, KidBackdrop, kidOutline, kidTheme, kidType } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
// Episode one's Scenes 26–29 (flower, moose, everybody, headland), restaged
// from its own props.
import {
  BathTubPanel,
  Bonk,
  Daisy,
  HeadlandWorld,
  TheMoose,
  UsePanel,
} from "../../water-cycle/scenes/act3";
import {
  Bubbles,
  Camera,
  CaptionCard,
  CutFlash,
  PHASE,
  WaterBand,
  WideLayer,
  lineWindow,
  projectMark,
  stand,
  useEmotion,
  type Mark,
  type SceneProps,
} from "./common";

// RIVER — home the long way round: episode one's Act Three river, compressed
// to three scenes. The flower, the moose (a narrator cameo, as in ep 1 — no new
// voice), everybody wanting a bit, and the headland reveal of the sea.
//
// Branch segments carry no variants (brief ruling 2): this plays identically
// under all four earlier histories.

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------------------
// Scene 1 — the river has visitors: the flower
// ---------------------------------------------------------------------------

const S1_SURFACE = 700;
const S1_SCALE = 1.15;
const S1_BANK_X = 1130;
const S1_BANK_TOP = 560;
const S1_ROOT = { x: 1520, y: 900 };

const FlowerScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [slurpFrom, slurpTo] = lineWindow(scene, "ri_02_narrator");
  // The piece of him leaves on "drank a bit of him" and lands in the roots on
  // "Slurp." — the flower is drinking *this* drop, not water in general.
  const takeAt = Math.round(slurpFrom + (slurpTo - slurpFrom) * 0.4);
  const travel = clamp01((frame - takeAt) / 40);
  const drunk = clamp01((frame - takeAt - 34) / 28);

  const dripX = interpolate(frame, [16, scene.durationInFrames], [470, 700], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dripY = stand("drip", S1_SURFACE + 120);
  const emotion = useEmotion(scene, "drip", { ri_03_drip: "grumpy" }, "happy");
  const pieceX = interpolate(travel, [0, 1], [dripX + 130, S1_ROOT.x - 30]);
  const pieceY =
    interpolate(travel, [0, 1], [S1_SURFACE - 20, S1_ROOT.y - 90]) - Math.sin(travel * Math.PI) * 210;

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WideLayer>
        <rect x={-1200} y={S1_SURFACE - 90} width={4400} height={120} fill={kidTheme.grass} />
        <rect x={-1200} y={S1_SURFACE - 30} width={4400} height={60} fill={kidTheme.grassDark} opacity={0.55} />
      </WideLayer>
      <Drip
        x={dripX}
        y={dripY}
        scale={S1_SCALE}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={1}
        look="upRight"
      />
      <WaterBand top={S1_SURFACE} dx={-frame * 2.4} />
      {/* "…and the river had visitors": the other drops, riding along in
          front of him, all of them upstream of the bank. */}
      <WideLayer>
        {Array.from({ length: 5 }, (_, i) => (
          <Blobby
            key={i}
            x={((i * 290 + frame * 1.6) % 1350) - 280}
            y={S1_SURFACE + 70 + (i % 2) * 50}
            scale={0.5}
            phase={i * 1.3}
            mood={i % 3 === 0 ? "calm" : "happy"}
          />
        ))}
      </WideLayer>
      <WideLayer>
        <path
          d={`M ${S1_BANK_X + 120} 1700 L ${S1_BANK_X + 120} ${S1_BANK_TOP + 60} Q ${S1_BANK_X + 40} ${S1_BANK_TOP + 30} ${S1_BANK_X} ${S1_BANK_TOP + 120} L ${S1_BANK_X - 60} 1700 Z`}
          fill={kidTheme.earth}
        />
        <rect x={S1_BANK_X + 100} y={S1_BANK_TOP + 40} width={2400} height={1700} fill={kidTheme.earth} />
        {[
          [1280, 780, 30],
          [1760, 700, 22],
          [1400, 1010, 26],
          [1860, 960, 32],
        ].map(([cx, cy, r]) => (
          <ellipse key={`${cx},${cy}`} cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="#8c6236" opacity={0.75} />
        ))}
        <path
          d={`M ${S1_BANK_X} ${S1_BANK_TOP + 120} Q ${S1_BANK_X + 60} ${S1_BANK_TOP + 20} ${S1_BANK_X + 200} ${S1_BANK_TOP + 40} L 3200 ${S1_BANK_TOP + 40} L 3200 ${S1_BANK_TOP - 40} L ${S1_BANK_X + 120} ${S1_BANK_TOP - 40} Z`}
          fill={kidTheme.grass}
          stroke={kidTheme.grassDark}
          strokeWidth={10}
        />
        <Daisy x={S1_ROOT.x} top={S1_BANK_TOP} root={S1_ROOT.y} drink={drunk} pulse={travel} />
      </WideLayer>
      {travel > 0 && travel < 1 ? (
        <WideLayer>
          <g opacity={Math.min(1, (1 - travel) * 3)}>
            <circle cx={pieceX} cy={pieceY} r={54} fill={kidTheme.star} opacity={0.35} />
            <Blobby x={pieceX} y={pieceY} scale={0.55} phase={2.2} mood="surprised" />
          </g>
        </WideLayer>
      ) : null}
      {/* Episode one's card, word for word. */}
      <CaptionCard text="Slurp." from={takeAt + 24} until={takeAt + 70} y={160} align="left" color={kidTheme.star} />
      <Bubbles
        scene={scene}
        cast={{ drip: { x: dripX, y: dripY, scale: S1_SCALE, who: "drip", side: "left" } }}
        text={{ ri_03_drip: "That was my ELBOW!" }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — the moose
// ---------------------------------------------------------------------------
//
// The joke is stillness. Episode one's moose is drawn the same on every frame;
// here he walks in first — one slide, eased to a dead stop — and then he is
// that same moose, not moving, for the rest of the scene.

const S2_SURFACE = 690;
const S2_SCALE = 0.62;
const S2_KNEE = { x: 1010, y: 780 };

const MooseScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [inFrom, inTo] = lineWindow(scene, "ri_04_narrator");
  const [sirFrom, sirTo] = lineWindow(scene, "ri_05_drip");
  const span = inTo - inFrom;
  // "Then a moose walked in" — and stops; "stood right in the middle".
  const walk = interpolate(frame, [inFrom + 6, inFrom + span * 0.36], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const bounceAt = Math.round(inFrom + span * 0.52);
  // "…We will go AROUND the moose" is the end of his line.
  const aroundFrom = Math.round(sirFrom + (sirTo - sirFrom) * 0.6);
  const keys = [0, bounceAt, bounceAt + 13, bounceAt + 32, aroundFrom, aroundFrom + 70, scene.durationInFrames];
  const dripX = interpolate(frame, keys, [140, S2_KNEE.x - 70, 700, 760, 760, 1150, 1700], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const dripY = interpolate(
    frame,
    keys,
    [S2_SURFACE + 90, S2_SURFACE + 90, S2_SURFACE + 10, S2_SURFACE + 90, S2_SURFACE + 90, S2_SURFACE + 340, S2_SURFACE + 300],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const emotion = useEmotion(scene, "drip", { ri_05_drip: "grumpy" }, "happy");

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WideLayer>
        <rect x={-1200} y={S2_SURFACE - 260} width={4400} height={320} fill={kidTheme.grass} />
        {[-140, 180, 430, 1760, 2050, 2320].map((x, i) => (
          <g key={x} transform={`translate(${x} ${S2_SURFACE - 250})`}>
            <rect x={-14} y={0} width={28} height={90} rx={13} fill={kidTheme.earth} />
            <circle cx={0} cy={-30} r={74 + (i % 3) * 10} fill={kidTheme.grassDark} />
            <circle cx={-26} cy={-52} r={44} fill={kidTheme.grass} />
          </g>
        ))}
      </WideLayer>
      <WaterBand top={S2_SURFACE} dx={-frame * 2} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${walk * 1300}px)` }}>
        <TheMoose />
      </div>
      <Drip
        x={dripX}
        y={stand("drip", dripY)}
        scale={S2_SCALE}
        emotion={emotion}
        speaking={useSpeaking(scene, "drip")}
        phase={PHASE.drip}
        shadow={false}
        idle={1}
        look={dripX < 1000 ? "upRight" : "right"}
      />
      {frame >= bounceAt && frame < bounceAt + 16 ? <Bonk x={S2_KNEE.x - 40} y={S2_KNEE.y - 40} from={bounceAt} /> : null}
      <Bubbles
        scene={scene}
        cast={{ drip: { x: dripX, y: stand("drip", dripY), scale: S2_SCALE, who: "drip", side: "right" } }}
        text={{ ri_05_drip: "SIR! Fine. We go AROUND." }}
        at={{ ri_05_drip: { x: 520, y: 560, tail: "right", tailAt: 740 } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3 — everybody wants a bit, and the corner
// ---------------------------------------------------------------------------

const S3_LABELS = ["a farmer's field", "the town", "somebody's bath", "somebody's teeth"];
const S3_SCALE = 0.9;
const S3_ANCHOR = { x: 820, y: 600 };

const WantsScene: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [listFrom, listTo] = lineWindow(scene, "ri_06_narrator");
  const [popFrom] = lineWindow(scene, "ri_07_drip");
  const [cornerFrom, cornerTo] = lineWindow(scene, "ri_08_narrator");
  const span = listTo - listFrom;
  // "Farmers took some. A town took some. Somebody's bath. Somebody's teeth."
  // — four hard cuts on the four clauses, then back to the river for his boast.
  const cuts = [0, 0.27, 0.53, 0.76].map((u) => Math.round(listFrom + span * u));
  const backAt = popFrom - 10;
  let panel = 0;
  for (let i = 0; i < cuts.length; i++) if (frame >= cuts[i]) panel = i;
  const onRiver = frame >= backAt;

  // The headland reveal: the river rounds the corner and the sea opens up, in
  // one unbroken pull-out over the last line (ep 1's Scene 29 move).
  const zoom = interpolate(frame, [cornerFrom + 10, cornerTo + 20], [1.5, 0.62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const worldX = interpolate(frame, [cornerFrom, cornerTo + 30], [520, 1300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const worldY = interpolate(frame, [cornerFrom, cornerTo + 30], [1120, 800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cam = { x: worldX, y: worldY, zoom, dx: S3_ANCHOR.x - worldX, dy: S3_ANCHOR.y - worldY };
  const mark: Mark = { x: worldX, y: stand("drip", worldY + 26), scale: S3_SCALE, who: "drip", side: "right" };
  const emotion = useEmotion(scene, "drip", { ri_07_drip: "proud" }, "happy");
  const amazed = frame > cornerTo - 20;
  // Hoisted: the river half below is conditional, and a hook must not be.
  const talking = useSpeaking(scene, "drip");

  return (
    <AbsoluteFill>
      {onRiver ? (
        <>
          <HeadlandWorld cam={cam} />
          <Camera cam={cam}>
            <Drip
              x={worldX}
              y={stand("drip", worldY + 26)}
              scale={S3_SCALE}
              emotion={amazed ? { emotion: "amazed", from: "happy", at: cornerTo - 20, frames: 8 } : emotion}
              speaking={talking}
              phase={PHASE.drip}
              shadow={false}
              idle={1.2}
              pose={frame >= popFrom && frame < cornerFrom ? "cheer" : undefined}
              look={frame >= cornerFrom ? "right" : "camera"}
            />
          </Camera>
          <CutFlash at={backAt} strength={0.5} />
        </>
      ) : (
        <>
          {panel === 2 ? <BathTubPanel duck /> : panel === 3 ? <TeethPanel /> : <UsePanel index={panel} />}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 54,
              textAlign: "center",
              fontSize: kidType.label,
              fontWeight: 900,
              letterSpacing: 3,
              color: kidTheme.ink,
              textShadow: kidOutline(4),
              fontFamily: kidTheme.fontFamily,
            }}
          >
            {S3_LABELS[panel]}
          </div>
          {cuts.map((at, i) => (
            <CutFlash key={at} at={at} strength={i === 0 ? 0.45 : 0.6} />
          ))}
        </>
      )}
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(cam, mark) }}
        text={{ ri_07_drip: "Everybody wants a bit of me!" }}
        at={{ ri_07_drip: { x: 1340, y: 230, tail: "left", tailAt: S3_ANCHOR.x + 80 } }}
      />
    </AbsoluteFill>
  );
};

/** Somebody's teeth: the tap panel from episode one, plus a toothbrush. */
const TeethPanel: React.FC = () => (
  <AbsoluteFill>
    <UsePanel index={2} />
    <WideLayer>
      <g transform="translate(1260 560) rotate(-28)">
        <rect x={-30} y={0} width={60} height={330} rx={28} fill={kidTheme.mint} stroke={kidTheme.ink} strokeWidth={10} />
        <rect x={-42} y={-110} width={84} height={120} rx={20} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={9} />
        {[-22, 0, 22].map((dx) => (
          <path key={dx} d={`M ${dx} -110 L ${dx} -160`} stroke={kidTheme.water} strokeWidth={16} strokeLinecap="round" />
        ))}
        <ellipse cx={0} cy={-170} rx={56} ry={22} fill="#ffffff" stroke={kidTheme.ink} strokeWidth={7} />
      </g>
    </WideLayer>
  </AbsoluteFill>
);

export const RIVER_SCENES: Record<string, React.FC<SceneProps>> = {
  ri_flower: FlowerScene,
  ri_moose: MooseScene,
  ri_wants: WantsScene,
};
