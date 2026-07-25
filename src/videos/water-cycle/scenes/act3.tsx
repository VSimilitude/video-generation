import React from "react";
import { Easing } from "remotion";
import {
  Blobby,
  BlobbyCrowd,
  Cloudia,
  Drip,
  KidBackdrop,
  SpeechBubble,
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
  CaptionCard,
  CutFlash,
  PHASE,
  SteamWisps,
  WaterBand,
  WideLayer,
  interpolate,
  lineProgress,
  lineWindow,
  midOf,
  projectMark,
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

// ACT THREE — THE FALL AND THE RIDE HOME. Scenes 22–32 of script.md: the
// check-out, the plummet, the mountain, the river, the moose, the ocean, and
// the twist.
//
// Two of the episode's four Big Words land here (Scene 23 PRECIPITATION,
// Scene 29 COLLECTION), both through <BigWordBeat> exactly as Scene 10 uses
// it. Scene 29 is the only place in the show where a Big Word beat has to hand
// the frame *back* to the action (the sibling mob), so it mounts the beat
// conditionally and cuts out of the freeze on a flash.
//
// The act's tone rule, from script.md's guardrails: the fall is a waterslide
// from its first frame. Drip is `excited`, never `scared` — the only fear in
// the act is the one long wide-eyed beat in Scene 22, and that is `amazed`
// (round mouth, huge eyes) rather than the rig's wobble-mouth `scared`, which
// hard-cuts the moment a line starts.
//
// Two components are exported for the recap to reuse rather than redraw:
// `CycleRing` (Scene 30's journey ring is Scene 33's narrator panel) and
// `BathTubPanel` (Scene 28's bathtub is literally the bath in Scene 35). Both
// callbacks depend on it being visibly the same picture.

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------------------
// Scene 22 — Check-out
// ---------------------------------------------------------------------------

/** The hotel floor line. Everything in the scene is measured off it. */
const S22_FLOOR = 812;
const S22_DRIP = { x: 700, y: stand("drip", S22_FLOOR) };
const S22_DRIP_SCALE = 1;
const S22_CLOUDIA = { x: 1380, y: stand("cloudia", S22_FLOOR) };
const S22_CLOUDIA_SCALE = 0.95;
const S22_LEVER = { x: 1660, y: S22_FLOOR };
/** Half-width of the hole that opens under Drip. */
const S22_HOLE = 430;

const S22_BUBBLES: Record<string, string> = {
  a3_01_cloudia: "Everybody OUT! Check-out time!",
  a3_02_drip: "Where are the stairs?",
  a3_03_cloudia: "There are no stairs.",
  a3_04_drip: "Ohhhh nooooo. WHEEE!",
};

const CheckoutScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [outFrom, outTo] = lineWindow(scene, "a3_01_cloudia");
  const [, noStairsTo] = lineWindow(scene, "a3_03_cloudia");
  const [dropAt] = lineWindow(scene, "a3_04_drip");

  // She hauls on "…check-out time!", and the floor goes when the lever bottoms
  // out. The comedy is entirely in what happens next, which is nothing.
  const pull = clamp01((lineProgress(scene, "a3_01_cloudia", frame) - 0.46) / 0.36);
  const vanishAt = Math.round(outFrom + (outTo - outFrom) * 0.9);

  // The drop. Gravity, not a transition: he is still there, and then he isn't.
  const since = frame - dropAt;
  const fall = since > 0 ? 3.8 * since * since : 0;

  const cloudiaTalking = useSpeaking(scene, "cloudia");
  const dripTalking = useSpeaking(scene, "drip");
  const cloudiaLook = useLookAtSpeaker(scene, {
    drip: { ...S22_DRIP, scale: S22_DRIP_SCALE, who: "drip" },
    cloudia: { ...S22_CLOUDIA, scale: S22_CLOUDIA_SCALE, who: "cloudia" },
  }, "cloudia", "left");
  const dripEmotion = useEmotion(
    scene,
    "drip",
    // Wide-eyed, not frightened: `amazed` is the round mouth and the huge eyes,
    // and it survives a line starting on top of it.
    { a3_02_drip: "amazed", a3_04_drip: "excited" },
    "happy",
  );

  const cast: Cast = {
    drip: { ...S22_DRIP, y: S22_DRIP.y + fall, scale: S22_DRIP_SCALE, who: "drip", side: "right" },
    cloudia: { ...S22_CLOUDIA, scale: S22_CLOUDIA_SCALE, who: "cloudia", side: "left" },
  };

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={4} waves={false} />
      <WideLayer>
        {/* The ground, an unreasonable distance below. It is on screen from the
            first frame so the hole reads as "a long way down", not as a void. */}
        <g opacity={0.55}>
          <path
            d={`M -1200 1180 Q 200 990 900 1060 Q 1600 1130 3200 1010 L 3200 1700 L -1200 1700 Z`}
            fill={mixHex(kidTheme.grass, kidTheme.skyLow, 0.55)}
          />
          <path
            d={`M -1200 1260 Q 500 1120 1400 1180 Q 2300 1240 3200 1150 L 3200 1700 L -1200 1700 Z`}
            fill={mixHex(kidTheme.grassDark, kidTheme.skyLow, 0.4)}
          />
        </g>
        <HotelCeiling />
        <HotelFloor vanishAt={vanishAt} holeX={S22_DRIP.x} />
      </WideLayer>

      <CheckOutLever x={S22_LEVER.x} y={S22_LEVER.y} pull={pull} />

      {/* Cloudia leans into the lever: the character component has no arms, so
          the haul is her whole body tipping towards it. */}
      <Camera cam={{ x: S22_CLOUDIA.x, y: S22_FLOOR, rotate: pull * 9 }}>
        <Cloudia
          x={S22_CLOUDIA.x}
          y={S22_CLOUDIA.y}
          scale={S22_CLOUDIA_SCALE}
          emotion="proud"
          speaking={cloudiaTalking}
          phase={PHASE.cloudia}
          clipboard
          fill={0.75}
          look={cloudiaLook}
        />
      </Camera>

      {/* `exit` is only the drop's *last* few frames. The rig's `shrink` runs in
          0.35s and takes him from full size to nothing, which on its own reads
          as a character being scaled away rather than falling — so gravity does
          the first six frames at full size and the shrink finishes him off.
          (First use of an exit transform in the show; verdict in the retro.) */}
      <Drip
        x={S22_DRIP.x}
        y={S22_DRIP.y + fall}
        scale={S22_DRIP_SCALE}
        emotion={dripEmotion}
        speaking={dripTalking}
        phase={PHASE.drip}
        shadow={frame < vanishAt}
        idle={frame > vanishAt && frame < dropAt ? 0.25 : 1}
        look={frame > noStairsTo - 20 && frame < dropAt ? "down" : "right"}
        exit={{ at: dropAt + 6, kind: "shrink" }}
      />
      {since > 0 && since < 26 ? (
        <DropStreaks x={S22_DRIP.x} y={S22_DRIP.y + fall} from={dropAt} />
      ) : null}

      <Bubbles
        scene={scene}
        cast={cast}
        text={S22_BUBBLES}
        // His last line is shouted on the way down: the bubble stays over the
        // hole he went through rather than chasing a character who has gone.
        at={{ a3_04_drip: { x: 700, y: 470, tail: "right" } }}
      />
    </AbsoluteFill>
  );
};

/** The lobby: a ceiling, a back wall, and a sign, so the sky reads as indoors. */
const HotelCeiling: React.FC = () => (
  <g>
    {/* Back wall — only the top half of the room, so the hole in the floor can
        still show open sky and a very long way down. */}
    <path
      d="M -1200 -120 L 3200 -120 L 3200 560 Q 2200 620 1400 570 Q 600 520 -1200 590 Z"
      fill={kidTheme.cloudShade}
    />
    <path
      d="M -1200 -120 L 3200 -120 L 3200 190 Q 2400 250 1700 200 Q 1000 150 300 210 Q -400 260 -1200 200 Z"
      fill={kidTheme.cloud}
      stroke={kidTheme.cloudShade}
      strokeWidth={10}
    />
    {/* A hanging plaque, not a floating card: it has to read as furniture, or
        it competes with the speech bubbles for the same job. */}
    <g transform="translate(620 330)">
      <path d="M -170 -66 L -170 -104 M 170 -66 L 170 -104" stroke={kidTheme.ink} strokeWidth={8} strokeLinecap="round" />
      <rect x={-236} y={-66} width={472} height={104} rx={30} fill={kidTheme.star} stroke={kidTheme.ink} strokeWidth={9} />
      <text
        x={0}
        y={6}
        textAnchor="middle"
        fontSize={46}
        fontWeight={900}
        fill={kidTheme.ink}
        fontFamily={kidTheme.fontFamily}
        letterSpacing={3}
      >
        CLOUD HOTEL
      </text>
    </g>
    {[220, 940, 1660].map((x) => (
      <g key={x}>
        <path d={`M ${x} 190 L ${x} 300`} stroke={kidTheme.cloudGreyShade} strokeWidth={9} strokeLinecap="round" />
        <path
          d={`M ${x - 78} 300 Q ${x} 250 ${x + 78} 300 Q ${x} 400 ${x - 78} 300 Z`}
          fill={kidTheme.star}
          stroke={kidTheme.ink}
          strokeWidth={8}
          strokeLinejoin="round"
        />
      </g>
    ))}
  </g>
);

/**
 * The floor, in segments, so it can stop existing from Drip outwards. The
 * segments beyond `S22_HOLE` never go — Cloudia keeps her footing, which is
 * what makes the hole read as *under Drip* rather than as the end of the set.
 */
const HotelFloor: React.FC<{ vanishAt: number; holeX: number }> = ({ vanishAt, holeX }) => {
  const frame = useCurrentFrame();
  const segs = 34;
  const w = 132;
  const x0 = -1200;
  return (
    <g>
      {Array.from({ length: segs }, (_, i) => {
        const cx = x0 + i * w + w / 2;
        const d = Math.abs(cx - holeX);
        const gone =
          d < S22_HOLE ? clamp01((frame - vanishAt - (d / S22_HOLE) * 13) / 11) : 0;
        if (gone >= 1) return null;
        return (
          <g
            key={i}
            transform={`translate(${cx} ${S22_FLOOR + gone * 70}) scale(${1 - gone * 0.25})`}
            opacity={1 - gone}
          >
            <rect x={-w / 2 - 2} y={0} width={w + 4} height={86} fill={kidTheme.cloudShade} />
            <rect x={-w / 2 - 2} y={0} width={w + 4} height={26} fill={kidTheme.cloud} />
            <circle cx={-w / 4} cy={86} r={38} fill={kidTheme.cloudShade} />
            <circle cx={w / 4} cy={80} r={32} fill={kidTheme.cloudShade} />
          </g>
        );
      })}
      {/* Wisps where the floor used to be. */}
      {frame > vanishAt && frame < vanishAt + 60 ? (
        <g opacity={clamp01(1 - (frame - vanishAt) / 60)}>
          <SteamWisps x={holeX - 250} y={S22_FLOOR + 120} count={3} scale={1.1} color={kidTheme.cloud} />
          <SteamWisps x={holeX + 250} y={S22_FLOOR + 150} count={3} scale={1} phase={0.4} color={kidTheme.cloud} />
        </g>
      ) : null}
    </g>
  );
};

/** The CHECK OUT lever. `pull` 0..1 hauls it from up to down. */
const CheckOutLever: React.FC<{ x: number; y: number; pull: number }> = ({ x, y, pull }) => {
  const angle = interpolate(pull, [0, 1], [-42, 52], { easing: Easing.inOut(Easing.quad) });
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: kidTheme.fontFamily }}>
      <svg width={10} height={10} viewBox="0 0 10 10" overflow="visible">
        <rect x={-96} y={-74} width={192} height={82} rx={26} fill={kidTheme.cloudGreyShade} stroke={kidTheme.ink} strokeWidth={9} />
        <g transform={`rotate(${angle})`}>
          <path d="M 0 -40 L 0 -236" stroke={kidTheme.ink} strokeWidth={28} strokeLinecap="round" />
          <path d="M 0 -40 L 0 -236" stroke={kidTheme.cloudGrey} strokeWidth={15} strokeLinecap="round" />
          <circle cx={0} cy={-244} r={42} fill={kidTheme.tomato} stroke={kidTheme.ink} strokeWidth={10} />
          <circle cx={-13} cy={-256} r={12} fill="#ffffff" opacity={0.6} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 62,
          transform: "translateX(-50%)",
          background: kidTheme.star,
          border: `8px solid ${kidTheme.ink}`,
          borderRadius: kidRadius.chip,
          padding: "6px 26px",
          fontSize: kidType.min,
          fontWeight: 900,
          letterSpacing: 3,
          color: kidTheme.ink,
          whiteSpace: "nowrap",
          boxShadow: kidShadow(0.8),
        }}
      >
        CHECK OUT
      </div>
    </div>
  );
};

/** Speed lines under a character who has just stopped being supported. */
const DropStreaks: React.FC<{ x: number; y: number; from: number }> = ({ x, y, from }) => {
  const frame = useCurrentFrame();
  const u = frame - from;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      {[-120, -40, 40, 120].map((dx, i) => (
        <path
          key={dx}
          d={`M ${dx} ${-160 + i * 18} L ${dx} ${-160 + i * 18 - 150 - u * 12}`}
          stroke={kidTheme.paper}
          strokeWidth={12}
          strokeLinecap="round"
          opacity={0.55 * clamp01(1 - u / 24)}
        />
      ))}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 23 — The best waterslide ever, and Big Word Three: PRECIPITATION
// ---------------------------------------------------------------------------

const S23_DRIP_SCALE = 1.05;
const S23_LOOP_LEN = 48;
const S23_LOOP_R = 140;

/**
 * Where Drip is, and which way up, on frame `f` of the plummet. `loops` are the
 * frames a loop-the-loop starts on; the last one is timed so the freeze catches
 * him a third of the way round it, which is the "frozen mid-loop" the script
 * asks for — and low enough in frame that the banner doesn't land on him.
 */
function plunge(f: number, loops: number[]): { x: number; y: number; rot: number } {
  let x = 960 + 290 * Math.sin(f / 43);
  // Low in frame on purpose: the Big Word banner owns the top third and the
  // four weather badges flank the band below it (PRECIP_SLOTS), so a freeze any
  // higher puts the pose behind furniture.
  let y = 900 + 46 * Math.sin(f / 26 + 1.2);
  let rot = 10 * Math.sin(f / 18);
  for (const w of loops) {
    const u = (f - w) / S23_LOOP_LEN;
    if (u >= 0 && u <= 1) {
      const th = u * Math.PI * 2;
      x += Math.sin(th) * S23_LOOP_R;
      y -= (1 - Math.cos(th)) * S23_LOOP_R;
      rot = (th * 180) / Math.PI;
    }
  }
  return { x, y, rot };
}

const WaterslideScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [wordFrom, wordTo] = lineWindow(scene, "a3_07_narrator");
  // "When drops fall out of a cloud, that is precipitation." — the freeze lands
  // on the word, and the rest of the take ("Rain, snow, sleet, hail") plays
  // over the frozen frame while the four icons arrive.
  const slamAt = Math.round(wordFrom + (wordTo - wordFrom) * 0.45);

  const talking = useSpeaking(scene, "drip");
  // The pose freezes with the world; the mouth and the face do not, because he
  // is still chanting.
  // `plunge` returns the character's own `y` prop (its box centre), not a
  // ground line — he is in mid-air and has no feet on anything.
  // The third loop is placed so the freeze catches him about three-quarters of
  // the way round it: tilted, clearly mid-manoeuvre, and clear of the banner.
  const held = plunge(Math.min(frame, slamAt), [56, 232, slamAt - 35]);
  const mid = midOf("drip", held.y, S23_DRIP_SCALE);

  return (
    <AbsoluteFill>
      <BigWordBeat
        scene={scene}
        word="PRECIPITATION"
        syllables={["Pre", "sip", "ih", "TAY", "shun"]}
        chantKey="a3_08_drip"
        slamAt={slamAt}
        color={ACT_COLOR.precipitation}
        sub="the falling part"
        y={300}
        freeze={<PlungeWorld />}
      >
        <Camera cam={{ x: held.x, y: mid, rotate: held.rot }}>
          <Drip
            x={held.x}
            y={held.y}
            scale={S23_DRIP_SCALE}
            emotion="excited"
            speaking={talking}
            phase={PHASE.drip}
            shadow={false}
            idle={1.6}
            pose="cheer"
            look="camera"
          />
        </Camera>
      </BigWordBeat>

      <PrecipIcons scene={scene} from={slamAt} />

      <Bubbles
        scene={scene}
        cast={{ drip: { x: held.x, y: held.y, scale: S23_DRIP_SCALE, who: "drip" } }}
        text={{ a3_06_drip: "The GREATEST thing ever!" }}
        // He is tumbling through his own line, so the bubble is parked rather
        // than pinned: a tail chasing a loop-the-loop is unreadable.
        at={{ a3_06_drip: { x: 1400, y: 220, tail: "left" } }}
      />
    </AbsoluteFill>
  );
};

/** The waterslide itself: streaked rain, the hotel receding, drops everywhere. */
const PlungeWorld: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={2} waves={false} />
      <WideLayer>
        {/* The underside of the Cloud Hotel, getting further away every frame. */}
        <g
          transform={`translate(0 ${-frame * 5.5}) scale(1 ${Math.max(0.35, 1 - frame / 260)})`}
          opacity={clamp01(1 - frame / 130)}
        >
          <path
            d="M -600 -520 L 2500 -520 L 2500 -180 Q 1800 -70 1100 -150 Q 400 -230 -600 -140 Z"
            fill={kidTheme.cloudGrey}
            stroke={kidTheme.cloudGreyShade}
            strokeWidth={12}
          />
        </g>
        {/* Rain streaks. They travel *up* the frame, because he is going down. */}
        {Array.from({ length: 46 }, (_, i) => {
          const lane = ((i * 271) % 2600) - 340;
          const len = 130 + (i % 4) * 90;
          const speed = 34 + (i % 5) * 7;
          const span = 2400;
          const y = 1500 - ((frame * speed + i * 213) % span);
          return (
            <path
              key={i}
              d={`M ${lane} ${y} L ${lane + 26} ${y - len}`}
              stroke={i % 3 === 0 ? kidTheme.paper : kidTheme.waterLight}
              strokeWidth={9 + (i % 3) * 3}
              strokeLinecap="round"
              opacity={0.5 + (i % 4) * 0.1}
            />
          );
        })}
        {/* The rest of the cloud, falling with him. Precipitation is not a solo. */}
        {Array.from({ length: 16 }, (_, i) => {
          const x = ((i * 397) % 2400) - 260;
          const y = 1400 - ((frame * (22 + (i % 4) * 6) + i * 311) % 2100);
          return (
            <Blobby
              key={i}
              x={x}
              y={y}
              scale={0.45 + (i % 3) * 0.18}
              phase={i * 1.29}
              mood={i % 3 === 0 ? "surprised" : "happy"}
              opacity={0.92}
            />
          );
        })}
      </WideLayer>
    </AbsoluteFill>
  );
};

const PRECIP_KINDS = ["RAIN", "SNOW", "SLEET", "HAIL"] as const;

/**
 * Where each badge parks, in arrival order. A badge is about 305 x 130 (icon
 * circle, then the label pill beside it), and the beat leaves it nowhere to
 * orbit: the word card owns y 150–470 across almost the full width (its 1.6°
 * tilt drops the far corners lowest), the syllable row that replaces it owns
 * 210–390, and Drip's frozen pose owns x 780–1120 down to y 900. An ellipse
 * around the word therefore drags every badge through a syllable block twice a
 * turn — that is how HAIL ended up behind "Pre" and RAIN behind "shun". They
 * flank the pose instead, two a side, alternating left/right as they arrive so
 * the frame fills evenly, in the one band that is clear all the way through the
 * freeze.
 */
const PRECIP_SLOTS = [
  { x: 300, y: 600 }, // RAIN — left, ~50px below the card's lowest corner
  { x: 1620, y: 600 }, // SNOW — right, same line
  { x: 300, y: 900 }, // SLEET — left, below
  { x: 1620, y: 900 }, // HAIL — right, below
] as const;

/**
 * Rain, snow, sleet and hail, flanking the word. They arrive one at a time as
 * the narrator names them, and sit *behind* the banner (z 45 against the card's
 * 50) as a belt-and-braces against the card ever growing into their lane.
 */
const PrecipIcons: React.FC<{ scene: TimedScene; from: number }> = ({ scene, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [listFrom, listTo] = lineWindow(scene, "a3_07_narrator");
  if (frame < from) return null;
  const t = frame / fps;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 45, pointerEvents: "none" }}>
      {PRECIP_KINDS.map((kind, i) => {
        // "Rain, snow, sleet, hail" occupies the back half of the take.
        const at = Math.round(listFrom + (listTo - listFrom) * (0.5 + i * 0.075));
        const s = spring({ frame: frame - at, fps, config: { damping: 12, mass: 0.6 } });
        if (s <= 0.002) return null;
        // Parked, not orbiting — but the world is frozen, so they breathe: a
        // slow bob and a couple of degrees of tilt, each on its own phase.
        const slot = PRECIP_SLOTS[i];
        const bob = Math.sin(t * 0.9 + i * 1.7);
        const x = slot.x + Math.cos(t * 0.7 + i * 2.1) * 7;
        const y = slot.y + bob * 12;
        return (
          <div
            key={kind}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${s}) rotate(${bob * 2.5}deg)`,
              textAlign: "center",
              fontFamily: kidTheme.fontFamily,
            }}
          >
            <svg width={132} height={132} viewBox="-66 -66 132 132" overflow="visible">
              <circle r={62} fill={kidTheme.paper} stroke={kidTheme.ink} strokeWidth={8} />
              <PrecipGlyph kind={kind} />
            </svg>
            <div
              style={{
                marginTop: -6,
                display: "inline-block",
                background: ACT_COLOR.precipitation,
                border: `6px solid ${kidTheme.ink}`,
                borderRadius: kidRadius.pill,
                padding: "2px 20px",
                fontSize: kidType.min,
                fontWeight: 900,
                letterSpacing: 2,
                color: kidTheme.paper,
              }}
            >
              {kind}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const PrecipGlyph: React.FC<{ kind: (typeof PRECIP_KINDS)[number] }> = ({ kind }) => {
  if (kind === "RAIN") {
    return (
      <g>
        {[-22, 12].map((dx, i) => (
          <path
            key={dx}
            transform={`translate(${dx} ${i * 10 - 4}) scale(1.05)`}
            d="M 0 -26 C 6 -14 17 -6 17 6 A 17 17 0 0 1 -17 6 C -17 -6 -6 -14 0 -26 Z"
            fill={kidTheme.water}
            stroke={kidTheme.waterDeep}
            strokeWidth={5}
          />
        ))}
      </g>
    );
  }
  if (kind === "SNOW") {
    return (
      <g stroke={kidTheme.waterDark} strokeWidth={7} strokeLinecap="round">
        {[0, 60, 120].map((a) => (
          <path key={a} d="M -34 0 L 34 0" transform={`rotate(${a})`} />
        ))}
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={a} d="M 22 0 L 32 -10 M 22 0 L 32 10" transform={`rotate(${a})`} />
        ))}
      </g>
    );
  }
  if (kind === "SLEET") {
    return (
      <g>
        <path
          transform="translate(-20 -2)"
          d="M 0 -26 C 6 -14 17 -6 17 6 A 17 17 0 0 1 -17 6 C -17 -6 -6 -14 0 -26 Z"
          fill={kidTheme.water}
          stroke={kidTheme.waterDeep}
          strokeWidth={5}
        />
        <g transform="translate(22 4)" stroke={kidTheme.waterDark} strokeWidth={6} strokeLinecap="round">
          {[0, 60, 120].map((a) => (
            <path key={a} d="M -20 0 L 20 0" transform={`rotate(${a})`} />
          ))}
        </g>
      </g>
    );
  }
  return (
    <g>
      {[
        [-20, -8, 20],
        [16, -14, 15],
        [4, 20, 17],
      ].map(([cx, cy, r]) => (
        <g key={`${cx},${cy}`}>
          <circle cx={cx} cy={cy} r={r} fill={kidTheme.cloudShade} stroke={kidTheme.cloudGreyShade} strokeWidth={5} />
          <circle cx={cx - r * 0.3} cy={cy - r * 0.35} r={r * 0.3} fill="#ffffff" opacity={0.8} />
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 24 — Landing
// ---------------------------------------------------------------------------

/** Top surface of the mossy rock he lands on. */
const S24_GROUND = 800;
const S24_DRIP = { x: 880, y: stand("drip", S24_GROUND) };
const S24_DRIP_SCALE = 0.95;

const S24_BUBBLES: Record<string, string> = {
  a3_11_drip: "I am a mountain drop!",
  a3_13_drip: "I'd look GREAT as snow!",
};

const LandingScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, splooshTo] = lineWindow(scene, "a3_10_narrator");
  const [flagFrom] = lineWindow(scene, "a3_11_drip");
  const [winterFrom, winterTo] = lineWindow(scene, "a3_12_narrator");

  // "Sploosh." is the last word of the take, so that is where he lands.
  const splooshAt = splooshTo - 12;
  const drop = interpolate(frame, [splooshAt - 26, splooshAt], [-980, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const land = frame >= splooshAt ? Math.max(0, 1 - (frame - splooshAt) / 16) : 0;
  const squash = Math.sin(land * Math.PI) * 0.9;

  // The cross-fade to winter and back, on the narrator's winter line.
  const winter = interpolate(
    frame,
    [winterFrom + 16, winterFrom + 62, winterTo - 52, winterTo + 4],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const talking = useSpeaking(scene, "drip");
  const emotion = useEmotion(scene, "drip", { a3_11_drip: "excited", a3_13_drip: "proud" }, "happy");

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WideLayer>
        <MountainPeak winter={0} />
      </WideLayer>
      <AbsoluteFill style={{ opacity: winter }}>
        <KidBackdrop variant="day" clouds={5} waves={false} />
        <WideLayer>
          <MountainPeak winter={1} />
        </WideLayer>
        <Snowfall />
      </AbsoluteFill>

      {/* The flag, planted the moment he claims the place. */}
      <TinyFlag x={S24_DRIP.x + 190} y={S24_GROUND + 6} from={flagFrom + 26} />

      {/* Saluting through both seasons — the same pose across the cross-fade is
          the whole joke of the winter aside. */}
      <Camera cam={{ x: S24_DRIP.x, y: S24_GROUND, zoom: 1 + squash * 0.22, zoomY: 1 - squash * 0.26 }}>
        <Drip
          x={S24_DRIP.x}
          y={S24_DRIP.y + drop}
          scale={S24_DRIP_SCALE}
          emotion={emotion}
          speaking={talking}
          phase={PHASE.drip}
          shadow={frame > splooshAt}
          idle={0.7}
          pose="cheer"
          look="camera"
        />
      </Camera>
      {frame >= splooshAt && frame < splooshAt + 34 ? (
        <Splash x={S24_DRIP.x} y={S24_GROUND} from={splooshAt} />
      ) : null}

      <Bubbles
        scene={scene}
        cast={{ drip: { ...S24_DRIP, scale: S24_DRIP_SCALE, who: "drip", side: "left" } }}
        text={S24_BUBBLES}
      />
    </AbsoluteFill>
  );
};

/** The same peak twice: `winter` 0 is moss and rock, 1 is snow. */
const MountainPeak: React.FC<{ winter: number }> = ({ winter }) => {
  const rock = winter ? "#cfd9e4" : "#8e8a86";
  const rockDark = winter ? "#a9b8c9" : "#6d6a67";
  const moss = winter ? "#e9f2fb" : kidTheme.grassDark;
  const far = winter ? "#c3d4e6" : "#9fb4c6";
  return (
    <g>
      {/* Back range, drawn flat and opaque: overlapping translucent triangles
          read as glass rather than as distance. */}
      <path d="M -1200 940 L -340 500 L 420 940 Z" fill={mixHex(far, "#ffffff", 0.34)} />
      <path d="M 1080 940 L 1960 560 L 2800 940 Z" fill={mixHex(far, "#ffffff", 0.34)} />
      <path d="M -160 940 L 700 470 L 1560 940 Z" fill={far} />
      {/* The peak he is standing on. */}
      <path
        d="M -260 1700 L 300 1080 L 620 900 L 880 780 L 1180 900 L 1520 1120 L 2100 1700 Z"
        fill={rock}
        stroke={kidTheme.ink}
        strokeWidth={10}
        strokeLinejoin="round"
      />
      <path d="M 620 900 L 880 780 L 1180 900 L 980 1010 Z" fill={rockDark} opacity={0.5} />
      {/* The mossy top slab, which is where his feet are. */}
      <path
        d={`M 660 ${S24_GROUND + 34} Q 700 ${S24_GROUND - 16} 800 ${S24_GROUND - 6} Q 880 ${S24_GROUND - 22} 990 ${S24_GROUND - 4} Q 1090 ${S24_GROUND - 14} 1120 ${S24_GROUND + 34} Z`}
        fill={moss}
        stroke={kidTheme.ink}
        strokeWidth={8}
        strokeLinejoin="round"
      />
      {winter ? (
        <path
          d="M 620 900 L 880 780 L 1180 900 Q 1020 860 880 890 Q 740 920 620 900 Z"
          fill="#ffffff"
          opacity={0.9}
        />
      ) : (
        <g fill={kidTheme.grassDark} opacity={0.85}>
          {[-160, -80, 90, 170].map((dx) => (
            <path
              key={dx}
              d={`M ${880 + dx} ${S24_GROUND + 6} q 12 -34 -4 -58 M ${880 + dx} ${S24_GROUND + 6} q -14 -30 6 -52`}
              stroke={kidTheme.grassDark}
              strokeWidth={9}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>
      )}
    </g>
  );
};

const Snowfall: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <WideLayer>
      {Array.from({ length: 60 }, (_, i) => {
        const x = ((i * 331) % 2600) - 300 + Math.sin(frame / 28 + i) * 30;
        const y = ((frame * (1.3 + (i % 4) * 0.5) + i * 197) % 1700) - 260;
        return <circle key={i} cx={x} cy={y} r={5 + (i % 3) * 3} fill="#ffffff" opacity={0.85} />;
      })}
    </WideLayer>
  );
};

const Splash: React.FC<{ x: number; y: number; from: number }> = ({ x, y, from }) => {
  const frame = useCurrentFrame();
  const u = clamp01((frame - from) / 34);
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      <ellipse
        rx={40 + u * 240}
        ry={12 + u * 60}
        fill="none"
        stroke={kidTheme.waterLight}
        strokeWidth={14 * (1 - u)}
        opacity={1 - u}
      />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r = u * 300;
        return (
          <circle
            key={i}
            cx={Math.cos(a) * r * 1.3}
            cy={Math.sin(a) * r * 0.5 - u * 200 + u * u * 260}
            r={16 * (1 - u * 0.6)}
            fill={kidTheme.water}
            stroke={kidTheme.waterDeep}
            strokeWidth={5}
            opacity={1 - u}
          />
        );
      })}
    </svg>
  );
};

const TinyFlag: React.FC<{ x: number; y: number; from: number }> = ({ x, y, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 11, mass: 0.6 } });
  if (s <= 0.002) return null;
  const flap = Math.sin(frame / 7) * 10;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      <g transform={`scale(${s}) translate(0 0)`} style={{ transformOrigin: "0px 0px" }}>
        <path d="M 0 0 L 0 -180" stroke={kidTheme.ink} strokeWidth={12} strokeLinecap="round" />
        <path
          d={`M 4 -176 L ${118 + flap} ${-146 + flap * 0.4} L 4 -112 Z`}
          fill={kidTheme.tomato}
          stroke={kidTheme.ink}
          strokeWidth={9}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 25 — Downhill
// ---------------------------------------------------------------------------

/**
 * The river's centre line in world coordinates: downhill, left to right.
 *
 * The whole journey is kept inside world x 200..1300 on purpose. `WideLayer`'s
 * box is 4400×2200 and the scene ends at 0.6× — at that zoom the frame sees
 * 3200×1800 of world, so a camera any further along the river would run off the
 * edge of the scenery and show bare sky. (It did, on the first pass.)
 */
function riverCentre(x: number): number {
  return 240 + x * 0.38 + 46 * Math.sin(x / 420);
}

/**
 * Half-width of the flow. The two steps are the two merges — the river gets
 * wider *because* something joined it, which is the scene's whole claim.
 */
function riverHalf(x: number): number {
  return interpolate(x, [0, 300, 400, 740, 860, 1600], [15, 30, 66, 92, 172, 258], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

const S25_MERGE_A = 360;
const S25_MERGE_B = 800;
const S25_DRIP_SCALE = 0.85;
/** Where Drip sits on screen; the world slides under him. */
const S25_ANCHOR = { x: 830, y: 520 };

const S25_BUBBLES: Record<string, string> = {
  a3_14_drip: "Hey. Why am I moving?",
  a3_16_drip: "Downhill it is!",
  a3_18_drip: "Hi! Hi! Where are we going?",
};

const DownhillScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, whyTo] = lineWindow(scene, "a3_14_drip");
  const [, downhillTo] = lineWindow(scene, "a3_16_drip");
  const [riverFrom, riverTo] = lineWindow(scene, "a3_17_narrator");

  // "A trickle became a stream. The stream met another stream. And the streams
  // became a river." — three clauses, three pull-backs, and Drip reaches each
  // merge as its clause lands.
  const streamAt = Math.round(riverFrom + (riverTo - riverFrom) * 0.3);
  const bigAt = Math.round(riverFrom + (riverTo - riverFrom) * 0.72);
  const zoom = interpolate(
    frame,
    [0, whyTo, streamAt, streamAt + 46, bigAt, bigAt + 60],
    [1.75, 1.75, 1.75, 1.08, 1.08, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const worldX = interpolate(
    frame,
    [0, downhillTo, streamAt + 46, bigAt + 60, scene.durationInFrames],
    [140, 250, S25_MERGE_A + 120, S25_MERGE_B + 230, 1300],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const worldY = riverCentre(worldX);

  // Park him on the anchor and fly the world past: a bubble can then stay over
  // his head through a 3× pull-back.
  const cam = { x: worldX, y: worldY, zoom, dx: S25_ANCHOR.x - worldX, dy: S25_ANCHOR.y - worldY };
  const mark: Mark = {
    x: worldX,
    y: stand("drip", worldY + 30),
    scale: S25_DRIP_SCALE,
    who: "drip",
    side: "right",
  };

  const talking = useSpeaking(scene, "drip");
  const emotion = useEmotion(
    scene,
    "drip",
    { a3_14_drip: "amazed", a3_16_drip: "excited", a3_18_drip: "happy" },
    "happy",
  );

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Camera cam={cam}>
        <WideLayer>
          <Valley />
          <RiverBand />
          <Tributary at={S25_MERGE_A} from={-380} />
          <Tributary at={S25_MERGE_B} from={340} below />
          {/* Every merge adds a swarm. They are only drawn downstream of the
              merge that produced them, so the crowd grows with the water. */}
          <RiverCrowd fromX={S25_MERGE_A + 40} toX={2600} rows={2} />
          <RiverCrowd fromX={S25_MERGE_B + 40} toX={2600} rows={3} />
        </WideLayer>
        <Drip
          x={worldX}
          y={stand("drip", worldY + 30)}
          scale={S25_DRIP_SCALE}
          emotion={emotion}
          speaking={talking}
          phase={PHASE.drip}
          shadow={false}
          idle={1.2}
          look="right"
        />
      </Camera>
      <Bubbles scene={scene} cast={{ drip: projectMark(cam, mark) }} text={S25_BUBBLES} />
    </AbsoluteFill>
  );
};

/** Grass, hills and the mountain he came off, all in world coordinates. */
const Valley: React.FC = () => (
  <g>
    <rect x={-1200} y={-500} width={4400} height={2200} fill={kidTheme.grass} />
    <path d="M -1200 -500 L 3200 -500 L 3200 120 Q 2000 260 900 140 Q -200 20 -1200 180 Z" fill={kidTheme.grassDark} opacity={0.5} />
    {/* The mountain he came off, well clear of the water so the merges stay
        the only thing happening in the top-left of the frame. */}
    <path d="M -1150 60 L -680 -420 L -210 60 Z" fill="#9fb4c6" />
    <path d="M -790 -160 L -680 -420 L -570 -160 Z" fill="#ffffff" opacity={0.9} />
    {[
      [-160, 430],
      [520, 190],
      [1120, 360],
      [1700, 640],
      [2300, 900],
    ].map(([x, y]) => (
      <g key={`${x},${y}`} transform={`translate(${x} ${y})`}>
        <rect x={-16} y={0} width={32} height={110} rx={15} fill={kidTheme.earth} />
        <circle cx={0} cy={-36} r={84} fill={kidTheme.grassDark} />
        <circle cx={-30} cy={-58} r={50} fill={kidTheme.grass} />
      </g>
    ))}
    {[
      [180, 620],
      [760, 300],
      [1420, 900],
      [2000, 1180],
    ].map(([x, y]) => (
      <g key={`${x},${y}`}>
        <circle cx={x} cy={y} r={44} fill={kidTheme.grassDark} />
        <circle cx={x + 40} cy={y + 10} r={32} fill={kidTheme.grassDark} />
        <circle cx={x - 34} cy={y + 12} r={28} fill={kidTheme.grassDark} />
      </g>
    ))}
  </g>
);

/** The flow itself: one polygon whose half-width is `riverHalf`. */
const RiverBand: React.FC = () => {
  const frame = useCurrentFrame();
  const xs: number[] = [];
  for (let x = -400; x <= 3000; x += 50) xs.push(x);
  const top = xs.map((x) => `${x} ${riverCentre(x) - riverHalf(x)}`).join(" L ");
  const bottom = xs
    .slice()
    .reverse()
    .map((x) => `${x} ${riverCentre(x) + riverHalf(x)}`)
    .join(" L ");
  return (
    <g>
      <path d={`M ${top} L ${bottom} Z`} fill={kidTheme.waterDark} />
      <path
        d={`M ${xs.map((x) => `${x} ${riverCentre(x) - riverHalf(x) * 0.82}`).join(" L ")} L ${xs
          .slice()
          .reverse()
          .map((x) => `${x} ${riverCentre(x) + riverHalf(x) * 0.82}`)
          .join(" L ")} Z`}
        fill={kidTheme.water}
      />
      {/* Current lines, drifting downstream. */}
      {Array.from({ length: 16 }, (_, i) => {
        const x = ((i * 230 + frame * 5) % 3300) - 400;
        const h = riverHalf(x);
        const off = (i % 3 === 0 ? -0.4 : i % 3 === 1 ? 0 : 0.45) * h;
        return (
          <path
            key={i}
            d={`M ${x} ${riverCentre(x) + off} q ${60 + h * 0.3} -${8 + h * 0.06} ${120 + h * 0.6} 0`}
            stroke={kidTheme.waterLight}
            strokeWidth={Math.max(4, h * 0.12)}
            strokeLinecap="round"
            fill="none"
            opacity={0.7}
          />
        );
      })}
    </g>
  );
};

/** A stream joining the main flow at `at`, with its own crowd riding in. */
const Tributary: React.FC<{ at: number; from: number; below?: boolean }> = ({ at, from, below }) => {
  const cy = riverCentre(at);
  const side = below ? 1 : -1;
  const startY = cy + side * 620;
  const w = riverHalf(at) * 0.55;
  return (
    <g>
      <path
        d={
          `M ${from - w} ${startY} Q ${(from + at) / 2 - w * 1.4} ${(startY + cy) / 2} ${at - w * 1.2} ${cy}` +
          ` L ${at + w * 1.2} ${cy} Q ${(from + at) / 2 + w * 1.4} ${(startY + cy) / 2} ${from + w} ${startY} Z`
        }
        fill={kidTheme.waterDark}
      />
      <path
        d={
          `M ${from - w * 0.7} ${startY} Q ${(from + at) / 2 - w} ${(startY + cy) / 2} ${at - w * 0.8} ${cy}` +
          ` L ${at + w * 0.8} ${cy} Q ${(from + at) / 2 + w} ${(startY + cy) / 2} ${from + w * 0.7} ${startY} Z`
        }
        fill={kidTheme.water}
      />
      <BlobbyCrowd
        count={6}
        x={(from + at) / 2}
        y={(startY + cy) / 2}
        spread={340}
        scale={0.5}
        jitter={54}
        opacity={0.95}
      />
    </g>
  );
};

/** Waving drops riding the flow between two world x positions. */
const RiverCrowd: React.FC<{ fromX: number; toX: number; rows: number }> = ({ fromX, toX, rows }) => {
  const frame = useCurrentFrame();
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let i = 0; i < 7; i++) {
      const span = toX - fromX;
      const x = fromX + ((i * (span / 7) + frame * 3.2 + r * 130) % span);
      const h = riverHalf(x);
      const y = riverCentre(x) + (r - (rows - 1) / 2) * (h * 0.72);
      cells.push(
        <Blobby
          key={`${r}-${i}`}
          x={x}
          y={y}
          scale={0.42 + (i % 3) * 0.1}
          phase={r * 2.1 + i * 1.37}
          look={Math.sin(i * 4.2)}
          mood={i % 3 === 0 ? "calm" : "happy"}
          opacity={0.95}
        />,
      );
    }
  }
  return <g>{cells}</g>;
};

// ---------------------------------------------------------------------------
// Scene 26 — The flower
// ---------------------------------------------------------------------------

const S26_SURFACE = 700;
const S26_DRIP_SCALE = 1.15;
/** Where the bank starts, and where the roots end up inside it. */
const S26_BANK_X = 1130;
const S26_BANK_TOP = 560;
const S26_ROOT = { x: 1520, y: 900 };

const FlowerScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [slurpFrom, slurpTo] = lineWindow(scene, "a3_20_narrator");

  // The piece of him leaves on "drank a bit of him", and lands in the roots on
  // "Slurp." — the flower is visibly drinking *this* drop, not water in general.
  const takeAt = Math.round(slurpFrom + (slurpTo - slurpFrom) * 0.42);
  const travel = clamp01((frame - takeAt) / 46);
  const drunk = clamp01((frame - takeAt - 40) / 30);

  const dripX = interpolate(frame, [0, scene.durationInFrames], [520, 700], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dripY = stand("drip", S26_SURFACE + 120);

  const talking = useSpeaking(scene, "drip");
  const emotion = useEmotion(scene, "drip", { a3_21_drip: "grumpy" }, "happy");

  // The bit of him, on its way to the roots — up out of the river, over the
  // bank, and down into the soil where the glow is.
  const pieceX = interpolate(travel, [0, 1], [dripX + 130, S26_ROOT.x - 30]);
  const pieceY =
    interpolate(travel, [0, 1], [S26_SURFACE - 20, S26_ROOT.y - 90]) - Math.sin(travel * Math.PI) * 210;

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WideLayer>
        {/* Far bank, across the water. */}
        <rect x={-1200} y={S26_SURFACE - 90} width={4400} height={120} fill={kidTheme.grass} />
        <rect x={-1200} y={S26_SURFACE - 30} width={4400} height={60} fill={kidTheme.grassDark} opacity={0.55} />
      </WideLayer>

      <Drip
        x={dripX}
        y={dripY}
        scale={S26_DRIP_SCALE}
        emotion={emotion}
        speaking={talking}
        phase={PHASE.drip}
        shadow={false}
        idle={1}
        look="upRight"
      />
      {/* The water in front of him: he is *in* the current, not beside it. */}
      <WaterBand top={S26_SURFACE} dx={-frame * 2.4} />

      {/* The near bank, cut away, so the roots are something you can watch. */}
      <WideLayer>
        <path
          d={`M ${S26_BANK_X + 120} 1700 L ${S26_BANK_X + 120} ${S26_BANK_TOP + 60} Q ${S26_BANK_X + 40} ${S26_BANK_TOP + 30} ${S26_BANK_X} ${S26_BANK_TOP + 120} L ${S26_BANK_X - 60} 1700 Z`}
          fill={kidTheme.earth}
        />
        <rect x={S26_BANK_X + 100} y={S26_BANK_TOP + 40} width={2400} height={1700} fill={kidTheme.earth} />
        {/* Stones in the soil, so the bank is a cut-away and not a brown box. */}
        {[
          [1280, 780, 30],
          [1760, 700, 22],
          [1400, 1010, 26],
          [1860, 960, 32],
          [1230, 900, 18],
        ].map(([cx, cy, r]) => (
          <ellipse key={`${cx},${cy}`} cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="#8c6236" opacity={0.75} />
        ))}
        <path
          d={`M ${S26_BANK_X} ${S26_BANK_TOP + 120} Q ${S26_BANK_X + 60} ${S26_BANK_TOP + 20} ${S26_BANK_X + 200} ${S26_BANK_TOP + 40} L 3200 ${S26_BANK_TOP + 40} L 3200 ${S26_BANK_TOP - 40} L ${S26_BANK_X + 120} ${S26_BANK_TOP - 40} Z`}
          fill={kidTheme.grass}
          stroke={kidTheme.grassDark}
          strokeWidth={10}
        />
        <Daisy x={S26_ROOT.x} top={S26_BANK_TOP} root={S26_ROOT.y} drink={drunk} pulse={travel} />
      </WideLayer>

      {travel > 0 && travel < 1 ? (
        <WideLayer>
          <g opacity={Math.min(1, (1 - travel) * 3)}>
            <circle cx={pieceX} cy={pieceY} r={54} fill={kidTheme.star} opacity={0.35} />
            <Blobby x={pieceX} y={pieceY} scale={0.55} phase={2.2} mood="surprised" />
          </g>
        </WideLayer>
      ) : null}

      <CaptionCard
        text="Slurp."
        from={takeAt + 26}
        until={takeAt + 74}
        y={160}
        align="left"
        color={kidTheme.star}
      />
      <Bubbles
        scene={scene}
        cast={{ drip: { x: dripX, y: dripY, scale: S26_DRIP_SCALE, who: "drip", side: "left" } }}
        text={{ a3_21_drip: "That was my ELBOW!" }}
      />
    </AbsoluteFill>
  );
};

/** A daisy leaning over the bank, with roots that glow while they drink. */
const Daisy: React.FC<{
  x: number;
  /** Grass line the stem grows out of. */
  top: number;
  root: number;
  drink: number;
  pulse: number;
}> = ({ x, top, root, drink, pulse }) => {
  const frame = useCurrentFrame();
  const head = { x: x - 470, y: top - 300 - drink * 26 };
  const sway = Math.sin(frame / 34) * 10;
  return (
    <g>
      {/* Roots, in the cut-away soil where they can be watched drinking. */}
      <g>
        {[-1, -0.4, 0.35, 1].map((s, i) => (
          <path
            key={i}
            d={`M ${x} ${top + 40} Q ${x + s * 80} ${(top + root) / 2} ${x + s * 170} ${root}`}
            stroke={drink > 0.02 ? mixHex("#8c6236", kidTheme.star, drink) : "#8c6236"}
            strokeWidth={22}
            strokeLinecap="round"
            fill="none"
          />
        ))}
        {drink > 0.02
          ? [-1, -0.4, 0.35, 1].map((s, i) => {
              // A pulse of light running up each root, into the stem.
              const u = ((frame / 34 + i * 0.25) % 1);
              return (
                <circle
                  key={i}
                  cx={x + s * 170 * (1 - u)}
                  cy={root - (root - (top + 40)) * u}
                  r={26}
                  fill={kidTheme.star}
                  opacity={0.9 * drink * Math.sin(u * Math.PI)}
                />
              );
            })
          : null}
      </g>
      {/* Stem, leaning out over the water. */}
      <path
        d={`M ${x} ${top + 60} Q ${x - 40} ${top - 150} ${head.x + sway} ${head.y}`}
        stroke={kidTheme.grassDark}
        strokeWidth={26}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M ${x - 60} ${top - 120} q -150 -60 -190 40 q 130 60 190 -40 Z`}
        fill={kidTheme.grass}
        stroke={kidTheme.grassDark}
        strokeWidth={8}
      />
      <path
        d={`M ${x - 12} ${top - 250} q 140 -70 200 30 q -140 60 -200 -30 Z`}
        fill={kidTheme.grass}
        stroke={kidTheme.grassDark}
        strokeWidth={8}
      />
      {/* Head. */}
      <g transform={`translate(${head.x + sway} ${head.y}) scale(${1 + drink * 0.12})`}>
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse
            key={i}
            transform={`rotate(${(360 / 12) * i}) translate(0 -108)`}
            rx={34}
            ry={62}
            fill={kidTheme.paper}
            stroke={kidTheme.ink}
            strokeWidth={7}
          />
        ))}
        <circle r={74} fill={kidTheme.sun} stroke={kidTheme.ink} strokeWidth={8} />
        <circle cx={-22} cy={-24} r={16} fill={kidTheme.sunLight} opacity={0.8} />
      </g>
      {pulse > 0 && pulse < 1 ? (
        <circle
          cx={head.x + sway}
          cy={head.y}
          r={140 + pulse * 90}
          fill="none"
          stroke={kidTheme.star}
          strokeWidth={10}
          opacity={0.5 * (1 - pulse)}
        />
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 27 — The moose
// ---------------------------------------------------------------------------
//
// The joke is stillness. The moose has no idle, no blink, no phase and no
// frame-dependent anything: it is drawn once and it is drawn the same on every
// frame of the scene. Everything else in the shot stays minimal so the
// narrator's flat delivery is what carries the beat.

const S27_SURFACE = 690;
const S27_DRIP_SCALE = 0.62;
/** The knee Drip bounces off. */
const S27_KNEE = { x: 1010, y: 780 };

const MooseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, arriveTo] = lineWindow(scene, "a3_22_narrator");
  const [quoteFrom, quoteTo] = lineWindow(scene, "a3_23_narrator");
  const [aroundFrom] = lineWindow(scene, "a3_26_drip");

  const bounceAt = arriveTo - 18;
  // In, bonk, sulk, and then the long detour. All of it is one interpolation
  // per axis, because the moose is not going to help.
  const dripX = interpolate(
    frame,
    [0, bounceAt, bounceAt + 13, bounceAt + 32, aroundFrom, aroundFrom + 74, aroundFrom + 150, scene.durationInFrames],
    [140, S27_KNEE.x - 70, 700, 760, 760, 1150, 1580, 1860],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const dripY = interpolate(
    frame,
    [0, bounceAt, bounceAt + 13, bounceAt + 32, aroundFrom, aroundFrom + 74, aroundFrom + 150, scene.durationInFrames],
    [S27_SURFACE + 90, S27_SURFACE + 90, S27_SURFACE + 10, S27_SURFACE + 90, S27_SURFACE + 90, S27_SURFACE + 340, S27_SURFACE + 330, S27_SURFACE + 170],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );

  const talking = useSpeaking(scene, "drip");
  const emotion = useEmotion(scene, "drip", { a3_24_drip: "grumpy", a3_26_drip: "grumpy" }, "happy");

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <WideLayer>
        <rect x={-1200} y={S27_SURFACE - 260} width={4400} height={320} fill={kidTheme.grass} />
        {/* A treeline, so the far bank is a place rather than a green band. */}
        {[-140, 180, 430, 1760, 2050, 2320].map((x, i) => (
          <g key={x} transform={`translate(${x} ${S27_SURFACE - 250})`}>
            <rect x={-14} y={0} width={28} height={90} rx={13} fill={kidTheme.earth} />
            <circle cx={0} cy={-30} r={74 + (i % 3) * 10} fill={kidTheme.grassDark} />
            <circle cx={-26} cy={-52} r={44} fill={kidTheme.grass} />
          </g>
        ))}
        <path
          d={`M -1200 ${S27_SURFACE - 10} Q 500 ${S27_SURFACE - 60} 1400 ${S27_SURFACE - 4} Q 2400 ${S27_SURFACE + 40} 3200 ${S27_SURFACE - 20} L 3200 ${S27_SURFACE + 40} L -1200 ${S27_SURFACE + 40} Z`}
          fill={kidTheme.grassDark}
          opacity={0.7}
        />
      </WideLayer>
      <WaterBand top={S27_SURFACE} dx={-frame * 2} />
      <WideLayer>
        {/* The river parting around the legs. Water goes around an obstacle;
            that is the real thing hiding inside the gag. */}
        {[
          [1010, 906],
          [1140, 922],
          [1470, 910],
          [1600, 926],
        ].map(([x, y]) => (
          <g key={x}>
            <ellipse cx={x} cy={y} rx={104} ry={30} fill={kidTheme.waterLight} opacity={0.75} />
            <path
              d={`M ${x - 96} ${y + 4} q -110 44 -230 66 M ${x + 96} ${y + 4} q 110 44 230 66`}
              stroke={kidTheme.waterLight}
              strokeWidth={10}
              strokeLinecap="round"
              fill="none"
              opacity={0.75}
            />
          </g>
        ))}
      </WideLayer>

      <TheMoose />

      {/* Drip and the family draw *over* the moose: the detour takes them
          downstream of its legs, i.e. between the moose and the camera. */}
      <Drip
        x={dripX}
        y={stand("drip", dripY)}
        scale={S27_DRIP_SCALE}
        emotion={emotion}
        speaking={talking}
        phase={PHASE.drip}
        shadow={false}
        idle={1}
        look={dripX < 1000 ? "upRight" : "right"}
      />
      <WideLayer>
        {Array.from({ length: 7 }, (_, i) => {
          const lag = 16 + i * 13;
          const f = Math.max(0, frame - lag);
          const x = interpolate(
            f,
            [0, aroundFrom, aroundFrom + 74, aroundFrom + 150, scene.durationInFrames],
            [80 - i * 60, 700 - i * 46, 1090 - i * 40, 1520 - i * 36, 1800 - i * 30],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
          );
          const y = interpolate(
            f,
            [0, aroundFrom, aroundFrom + 74, aroundFrom + 150, scene.durationInFrames],
            [S27_SURFACE + 130, S27_SURFACE + 130, S27_SURFACE + 356, S27_SURFACE + 340, S27_SURFACE + 190],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
          );
          return <Blobby key={i} x={x} y={y} scale={0.44} phase={i * 1.31} mood={i % 3 === 0 ? "calm" : "happy"} />;
        })}
      </WideLayer>

      {frame >= bounceAt && frame < bounceAt + 16 ? (
        <Bonk x={S27_KNEE.x - 40} y={S27_KNEE.y - 40} from={bounceAt} />
      ) : null}

      {/* The moose's one line, quoted exactly. */}
      <SpeechBubble
        x={368}
        y={158}
        text="mmm. Nice water."
        tail="right"
        maxWidth={420}
        from={quoteFrom + 30}
        until={quoteTo}
      />
      <Bubbles
        scene={scene}
        cast={{ drip: { x: dripX, y: stand("drip", dripY), scale: S27_DRIP_SCALE, who: "drip", side: "right" } }}
        text={{ a3_24_drip: "SIR! That is my family!", a3_26_drip: "Fine. We go AROUND." }}
        at={{ a3_26_drip: { x: 520, y: 606, tail: "right" } }}
      />
    </AbsoluteFill>
  );
};

/**
 * An enormous moose, drawn out of six shapes and a pair of half-lidded eyes.
 * Nothing here reads the frame: total stillness is the joke, and a breathing
 * moose would be a different, worse joke.
 */
const TheMoose: React.FC = () => {
  const hide = "#8a6242";
  const hideDark = "#6d4a30";
  const muzzle = "#c9a37c";
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* Legs, straight into the water. */}
      {[
        [1010, 58],
        [1140, 50],
        [1470, 56],
        [1600, 48],
      ].map(([x, w]) => (
        <rect key={x} x={x - w / 2} y={520} width={w} height={410} rx={25} fill={x > 1300 ? hide : hideDark} stroke={kidTheme.ink} strokeWidth={9} />
      ))}
      {/* Body, hump, neck and head as one silhouette: every shape is drawn
          filled-and-stroked and then filled again on top, which is how the
          union gets a single outline with no interior seams (same trick
          Cloudia's puffs use). */}
      <g fill={hide} stroke={kidTheme.ink} strokeWidth={11} strokeLinejoin="round">
        <MooseShapes />
      </g>
      <g fill={hide}>
        <MooseShapes />
      </g>
      <ellipse cx={1330} cy={400} rx={210} ry={46} fill="#9c7150" opacity={0.55} />
      <ellipse cx={556} cy={368} rx={96} ry={74} fill={muzzle} stroke={kidTheme.ink} strokeWidth={10} />
      <circle cx={524} cy={346} r={12} fill={kidTheme.ink} />
      <circle cx={576} cy={352} r={12} fill={kidTheme.ink} />
      <path d="M 500 404 q 54 30 112 8" stroke={kidTheme.ink} strokeWidth={10} strokeLinecap="round" fill="none" />
      {/* Antler nubs and an ear. */}
      {[
        [690, 244],
        [780, 240],
      ].map(([x, y]) => (
        <rect key={x} x={x - 24} y={y - 76} width={48} height={92} rx={24} fill={hideDark} stroke={kidTheme.ink} strokeWidth={9} />
      ))}
      <ellipse cx={846} cy={266} rx={50} ry={28} transform="rotate(-22 846 266)" fill={hideDark} stroke={kidTheme.ink} strokeWidth={9} />
      {/* Dewlap — the last detail the silhouette needs. */}
      <path d="M 636 424 q 40 104 -8 140 q -56 -34 -50 -134 Z" fill={muzzle} stroke={kidTheme.ink} strokeWidth={9} strokeLinejoin="round" />
      {/* Deadpan eyes: half a lid, no highlight, no interest. */}
      {[
        [640, 308],
        [742, 304],
      ].map(([x, y]) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx={30} ry={28} fill="#ffffff" stroke={kidTheme.ink} strokeWidth={6} />
          <circle cx={x} cy={y + 8} r={14} fill={kidTheme.ink} />
          <path d={`M ${x - 32} ${y} h 64 v -30 h -64 Z`} fill={hide} />
          <path d={`M ${x - 32} ${y} h 64`} stroke={kidTheme.ink} strokeWidth={7} strokeLinecap="round" />
          <path d={`M ${x - 34} ${y - 38} h 68`} stroke={kidTheme.ink} strokeWidth={10} strokeLinecap="round" />
        </g>
      ))}
      {/* Tail. */}
      <path d="M 1660 386 q 46 30 30 88" stroke={kidTheme.ink} strokeWidth={20} strokeLinecap="round" fill="none" />
    </svg>
  );
};

/** Body, shoulder hump, neck and head — drawn twice by `TheMoose`. */
const MooseShapes: React.FC = () => (
  <>
    <rect x={960} y={330} width={700} height={290} rx={142} />
    <path d="M 980 430 q 60 -180 230 -160 q 130 16 160 160 Z" />
    <path d="M 1010 350 L 830 300 L 780 420 L 1000 480 Z" />
    <rect x={520} y={252} width={330} height={180} rx={88} />
  </>
);

const Bonk: React.FC<{ x: number; y: number; from: number }> = ({ x, y, from }) => {
  const frame = useCurrentFrame();
  const u = clamp01((frame - from) / 16);
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      <g transform={`scale(${0.6 + u * 0.9})`} opacity={1 - u}>
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={i}
            transform={`rotate(${(360 / 9) * i})`}
            d="M -20 0 L 0 -96 L 20 0 Z"
            fill={kidTheme.star}
            stroke={kidTheme.ink}
            strokeWidth={7}
            strokeLinejoin="round"
          />
        ))}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 28 — Everybody wants a bit
// ---------------------------------------------------------------------------

const S28_PANELS = [
  "a farmer's field",
  "the town's water tower",
  "somebody's tap",
  "somebody's kettle",
  "somebody's bath",
];

const EverybodyScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [listFrom, listTo] = lineWindow(scene, "a3_28_narrator");
  const span = listTo - listFrom;
  // Farmers / a town / its taps / a kettle / somebody's bath — five hard cuts
  // on the narrator's four clauses, ending on the bath so Drip can be in it.
  const cuts = [0, 0.22, 0.42, 0.6, 0.78].map((u) => Math.round(listFrom + span * u));
  let panel = 0;
  for (let i = 0; i < cuts.length; i++) if (frame >= cuts[i]) panel = i;

  const talking = useSpeaking(scene, "drip");
  const emotion = useEmotion(scene, "drip", { a3_29_drip: "proud" }, "happy");
  // Sitting in the bath: the tub's front wall is drawn over his lower half, so
  // his ground line is set by where his *mouth* has to clear it.
  const dripAt = { x: 760, y: stand("drip", 690) };

  return (
    <AbsoluteFill>
      {panel === 4 ? (
        <BathTubPanel duck>
          <Drip
            x={dripAt.x}
            y={dripAt.y}
            scale={0.62}
            emotion={emotion}
            speaking={talking}
            phase={PHASE.drip}
            shadow={false}
            idle={1.2}
            look="left"
          />
        </BathTubPanel>
      ) : (
        <UsePanel index={panel} />
      )}
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
        {S28_PANELS[panel]}
      </div>
      {cuts.map((at, i) => (
        <CutFlash key={at} at={at} strength={i === 0 ? 0.45 : 0.6} />
      ))}
      <Bubbles
        scene={scene}
        cast={{ drip: { ...dripAt, scale: 0.62, who: "drip", side: "right" } }}
        text={{ a3_29_drip: "Everybody wants a bit!" }}
      />
    </AbsoluteFill>
  );
};

/** Four iconic places, in the same shapes-and-a-glow language as Scene 8. */
const UsePanel: React.FC<{ index: number }> = ({ index }) => (
  <AbsoluteFill>
    <KidBackdrop variant="day" clouds={2} waves={false} ground={index === 0 || index === 1} />
    <WideLayer>
      {index === 0 ? (
        <g>
          <rect x={-1200} y={640} width={4400} height={1060} fill={kidTheme.earth} />
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <rect x={-1200} y={700 + r * 108} width={4400} height={22} rx={11} fill="#8c6236" opacity={0.7} />
              {Array.from({ length: 14 }, (_, i) => (
                <path
                  key={i}
                  d={`M ${60 + i * 150} ${700 + r * 108} q 12 -42 -6 -70 M ${60 + i * 150} ${700 + r * 108} q -14 -38 8 -62`}
                  stroke={kidTheme.grassDark}
                  strokeWidth={9}
                  strokeLinecap="round"
                  fill="none"
                />
              ))}
            </g>
          ))}
          {/* The channel, and the sluice lifting water into the field. */}
          <rect x={-1200} y={520} width={4400} height={110} rx={30} fill={kidTheme.waterDark} />
          <rect x={-1200} y={534} width={4400} height={80} rx={24} fill={kidTheme.water} />
          <rect x={880} y={430} width={130} height={210} rx={16} fill={kidTheme.cloudGreyShade} stroke={kidTheme.ink} strokeWidth={9} />
          <LiftedDrops x={700} y={520} count={4} rise={260} />
          <LiftedDrops x={1240} y={520} count={3} rise={230} phase={0.4} />
        </g>
      ) : null}
      {index === 1 ? (
        <g>
          <rect x={760} y={210} width={420} height={250} rx={70} fill="#dfe6ee" stroke={kidTheme.ink} strokeWidth={12} />
          <path d="M 760 300 L 1180 300" stroke={kidTheme.waterDark} strokeWidth={10} opacity={0.5} />
          <path d="M 800 460 L 840 830 M 1140 460 L 1100 830 M 830 700 L 1110 700" stroke={kidTheme.ink} strokeWidth={18} strokeLinecap="round" />
          <rect x={940} y={460} width={60} height={380} fill={kidTheme.cloudGreyShade} stroke={kidTheme.ink} strokeWidth={9} />
          <ellipse cx={970} cy={880} rx={420} ry={80} fill={kidTheme.waterDark} />
          <ellipse cx={970} cy={868} rx={396} ry={66} fill={kidTheme.water} />
          <LiftedDrops x={970} y={840} count={4} rise={380} />
        </g>
      ) : null}
      {index === 2 ? (
        <g>
          <rect x={-1200} y={760} width={4400} height={940} fill="#e6e9ee" />
          <rect x={-1200} y={760} width={4400} height={26} fill="#c6ccd6" />
          <path d="M 700 200 L 700 470 Q 700 540 780 540 L 1010 540" stroke="#b7c0cc" strokeWidth={58} fill="none" strokeLinecap="round" />
          <path d="M 700 200 L 700 470 Q 700 540 780 540 L 1010 540" stroke="#dfe6ee" strokeWidth={34} fill="none" strokeLinecap="round" />
          <circle cx={700} cy={210} r={62} fill="#b7c0cc" stroke={kidTheme.ink} strokeWidth={10} />
          <path d="M 1000 546 q 22 140 -8 214" stroke={kidTheme.water} strokeWidth={44} strokeLinecap="round" fill="none" />
          <ellipse cx={992} cy={790} rx={210} ry={44} fill={kidTheme.water} />
          <LiftedDrops x={992} y={770} count={4} rise={300} />
        </g>
      ) : null}
      {index === 3 ? (
        <g>
          <rect x={-1200} y={820} width={4400} height={880} fill="#cfd6e0" />
          <rect x={-1200} y={820} width={4400} height={30} fill="#aab4c2" />
          <rect x={640} y={520} width={620} height={300} rx={90} fill="#e8eef6" stroke={kidTheme.ink} strokeWidth={12} />
          <path d="M 1250 600 q 130 40 90 170" stroke={kidTheme.ink} strokeWidth={26} fill="none" strokeLinecap="round" />
          <path d="M 700 520 q 250 -110 500 0" stroke={kidTheme.ink} strokeWidth={22} fill="none" strokeLinecap="round" />
          <rect x={870} y={470} width={140} height={54} rx={26} fill="#b7c0cc" stroke={kidTheme.ink} strokeWidth={10} />
          <SteamWisps x={940} y={440} count={3} scale={1.2} color="#ffffff" />
          <LiftedDrops x={700} y={880} count={3} rise={300} />
        </g>
      ) : null}
    </WideLayer>
  </AbsoluteFill>
);

/**
 * Somebody's bath, with the duck. Exported because Scene 35's mind-blower opens
 * on this exact tub: the fact only lands if it is visibly the same bath.
 */
export const BathTubPanel: React.FC<{ duck?: boolean; children?: React.ReactNode }> = ({
  duck = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 22) * 8;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #eaf3fb 0%, #cfe2f2 62%, #b9d3ea 100%)" }} />
      <WideLayer>
        {/* Tiles. */}
        {Array.from({ length: 8 }, (_, r) =>
          Array.from({ length: 18 }, (_, c) => (
            <rect
              key={`${r}-${c}`}
              x={-260 + c * 148}
              y={-60 + r * 128}
              width={138}
              height={118}
              rx={14}
              fill="#f2f7fc"
              stroke="#d9e6f2"
              strokeWidth={6}
            />
          )),
        )}
        {/* Tub: the back half. Anything standing *in* the bath is drawn after
            this and before the front wall below, so the water line cuts it. */}
        <path
          d="M 300 560 L 1620 560 L 1520 980 A 340 70 0 0 1 400 980 Z"
          fill={kidTheme.paper}
          stroke={kidTheme.ink}
          strokeWidth={14}
          strokeLinejoin="round"
        />
        <ellipse cx={960} cy={560} rx={660} ry={110} fill="#ffffff" stroke={kidTheme.ink} strokeWidth={14} />
        <ellipse cx={960} cy={572} rx={600} ry={92} fill={kidTheme.water} />
        <ellipse cx={800} cy={556} rx={190} ry={30} fill={kidTheme.waterLight} opacity={0.7} />
      </WideLayer>
      {children}
      <WideLayer>
        {/* The front wall of the tub, over whoever is sitting in it. */}
        <path
          d="M 300 560 A 660 110 0 0 0 1620 560 L 1520 980 A 340 70 0 0 1 400 980 Z"
          fill={kidTheme.paper}
          stroke={kidTheme.ink}
          strokeWidth={14}
          strokeLinejoin="round"
        />
        {[430, 1490].map((x) => (
          <path key={x} d={`M ${x} 962 q 30 70 -6 96 q -60 -10 -54 -80 Z`} fill="#dfe6ee" stroke={kidTheme.ink} strokeWidth={10} strokeLinejoin="round" />
        ))}
        {/* Taps. */}
        <path d="M 1640 380 L 1640 470 Q 1640 520 1560 524" stroke="#b7c0cc" strokeWidth={40} fill="none" strokeLinecap="round" />
        <circle cx={1640} cy={366} r={44} fill="#b7c0cc" stroke={kidTheme.ink} strokeWidth={10} />
        {duck ? (
          <g transform={`translate(1300 ${508 + bob}) scale(1.15)`}>
            <ellipse cx={0} cy={30} rx={92} ry={56} fill={kidTheme.sun} stroke={kidTheme.sunDeep} strokeWidth={8} />
            <circle cx={-58} cy={-26} r={50} fill={kidTheme.sun} stroke={kidTheme.sunDeep} strokeWidth={8} />
            <path d="M -104 -18 q -46 6 -44 26 q 26 12 48 -6 Z" fill={kidTheme.sunDark} stroke={kidTheme.sunDeep} strokeWidth={7} strokeLinejoin="round" />
            <circle cx={-70} cy={-36} r={8} fill={kidTheme.ink} />
          </g>
        ) : null}
        <SteamWisps x={560} y={520} count={3} scale={1.1} color="#ffffff" />
        <SteamWisps x={1460} y={500} count={2} scale={1} phase={0.5} color="#ffffff" />
      </WideLayer>
    </AbsoluteFill>
  );
};

/** Glowing drops being lifted out of the flow. */
const LiftedDrops: React.FC<{
  x: number;
  y: number;
  count?: number;
  rise?: number;
  phase?: number;
}> = ({ x, y, count = 3, rise = 260, phase = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const cycle = (t * 0.5 + i / count + phase) % 1;
        const px = x + (i - (count - 1) / 2) * 62 + Math.sin(cycle * 6 + i) * 16;
        const py = y - cycle * rise;
        const o = Math.sin(cycle * Math.PI);
        return (
          <g key={i} opacity={o}>
            <circle cx={px} cy={py} r={44} fill={kidTheme.star} opacity={0.45} />
            <path
              transform={`translate(${px} ${py}) scale(1.1)`}
              d="M 0 -26 C 6 -14 17 -6 17 6 A 17 17 0 0 1 -17 6 C -17 -6 -6 -14 0 -26 Z"
              fill={kidTheme.water}
              stroke={kidTheme.waterDeep}
              strokeWidth={5}
            />
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Scene 29 — Home, and Big Word Four: COLLECTION
// ---------------------------------------------------------------------------

const S29_DRIP_SCALE = 0.9;
const S29_ANCHOR = { x: 820, y: 560 };

const HomeScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [cornerFrom, cornerTo] = lineWindow(scene, "a3_30_narrator");
  const [wordFrom, wordTo] = lineWindow(scene, "a3_32_narrator");
  const [mobFrom] = lineWindow(scene, "a3_33_drip");

  // "…that is collection." lands late in a long take; the freeze goes there.
  const slamAt = Math.round(wordFrom + (wordTo - wordFrom) * 0.78);
  // Out of the freeze and back to the water for the sibling mob.
  const mobAt = mobFrom - 16;

  // The river rounds the headland and the ocean opens up, in one unbroken move.
  const zoom = interpolate(frame, [0, cornerFrom + 20, cornerTo + 30], [1.5, 1.5, 0.62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  // The camera stops at world x 1300: past that, a 0.62× frame runs off the
  // right-hand edge of `WideLayer`'s box and shows bare sky (Scene 25's bug).
  const worldX = interpolate(frame, [0, cornerTo + 60], [520, 1300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  // He starts in the river channel and ends out in the open sea.
  const worldY = interpolate(frame, [0, cornerTo + 60], [1120, 800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cam = { x: worldX, y: worldY, zoom, dx: S29_ANCHOR.x - worldX, dy: S29_ANCHOR.y - worldY };
  const mark: Mark = {
    x: worldX,
    y: stand("drip", worldY + 26),
    scale: S29_DRIP_SCALE,
    who: "drip",
    side: "right",
  };

  const talking = useSpeaking(scene, "drip");
  const emotion = useEmotion(
    scene,
    "drip",
    { a3_31_drip: "amazed", a3_32b_drip: "proud", a3_33_drip: "excited" },
    "happy",
  );

  const rider = (
    <Camera cam={cam}>
      <Drip
        x={worldX}
        y={stand("drip", worldY + 26)}
        scale={S29_DRIP_SCALE}
        emotion={emotion}
        speaking={talking}
        phase={PHASE.drip}
        shadow={false}
        idle={1.2}
        look={frame > mobAt ? "camera" : "right"}
      />
    </Camera>
  );

  return (
    <AbsoluteFill>
      {frame < mobAt ? (
        <BigWordBeat
          scene={scene}
          word="COLLECTION"
          syllables={["Coll", "ECK", "shun"]}
          chantKey="a3_32b_drip"
          slamAt={slamAt}
          color={ACT_COLOR.collection}
          sub="the gathering-up part"
          y={296}
          freeze={<HeadlandWorld cam={cam} />}
        >
          {rider}
        </BigWordBeat>
      ) : (
        <>
          <HeadlandWorld cam={cam} />
          {rider}
          <SiblingMob from={mobAt} anchor={S29_ANCHOR} />
          <CutFlash at={mobAt} strength={0.7} />
        </>
      )}
      <Bubbles
        scene={scene}
        cast={{ drip: projectMark(cam, mark) }}
        text={{ a3_31_drip: "I know this place.", a3_33_drip: "Hi Drop! I am BACK!" }}
        at={{ a3_33_drip: { x: 1330, y: 250, tail: "left" } }}
      />
    </AbsoluteFill>
  );
};

/** The last corner of the river, and then all of the water there is. */
const HeadlandWorld: React.FC<{ cam: { x: number; y: number; zoom?: number; dx?: number; dy?: number } }> = ({
  cam,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={4} waves={false} />
      <Camera cam={cam}>
        <WideLayer>
          {/* Horizon: the sea starts here and the backdrop's real sky is left
              showing above it. Without a horizon the pull-out just gets bluer,
              and "the ocean opens up" needs somewhere for it to end. */}
          <rect x={-1200} y={240} width={4400} height={1460} fill={kidTheme.waterDeep} />
          <rect x={-1200} y={228} width={4400} height={26} fill={kidTheme.waterDark} opacity={0.7} />
          {/* Texture for the deep water below the wave band, which is otherwise
              a flat field of blue at the widest zoom. */}
          {Array.from({ length: 26 }, (_, i) => {
            const x = ((i * 617) % 4200) - 1100;
            const y = 620 + ((i * 331) % 1000);
            return (
              <path
                key={i}
                d={`M ${x} ${y} q 90 -18 180 0`}
                stroke={kidTheme.waterDark}
                strokeWidth={12}
                strokeLinecap="round"
                fill="none"
                opacity={0.45}
              />
            );
          })}
        </WideLayer>
        {/* Waves over the open sea, but *under* the land: the headland is in
            front of the water, not floating on it. */}
        <WaterBand top={330} dx={-frame * 1.2} />
        <WideLayer>
          {/* The headland the river comes round. */}
          <path
            d="M -1200 60 L 400 60 Q 640 220 420 420 Q 200 600 -300 700 L -1200 800 Z"
            fill={kidTheme.grass}
            stroke={kidTheme.grassDark}
            strokeWidth={14}
          />
          <path d="M 420 420 Q 200 620 -300 720 L -300 800 Q 260 700 480 480 Z" fill={kidTheme.earth} opacity={0.9} />
          {/* The river coming round it to meet all of the water there is. */}
          <path
            d="M -1200 1080 Q -300 1000 260 1060 Q 680 1120 960 1240 L 960 1500 Q 540 1280 -60 1240 Q -660 1200 -1200 1280 Z"
            fill={kidTheme.water}
          />
        </WideLayer>
        <WideLayer>
          {/* Open water, all the way to the edge of the wide layer. */}
          <BlobbyCrowd count={14} x={1700} y={1180} spread={2600} scale={0.6} opacity={0.75} />
          <BlobbyCrowd count={12} x={1900} y={1420} spread={2800} scale={0.8} opacity={0.85} />
          {/* The coast he came out of, in the near corner: without land around
              it the river was a pale slab lying on top of the sea. */}
          <path
            d="M -1200 1300 Q -400 1240 260 1360 Q 700 1440 1000 1620 L 1000 1700 L -1200 1700 Z"
            fill={kidTheme.grass}
            stroke={kidTheme.grassDark}
            strokeWidth={14}
          />
        </WideLayer>
      </Camera>
    </AbsoluteFill>
  );
};

/** Scene 3's ocean-sized family, closing in on him. */
const SiblingMob: React.FC<{ from: number; anchor: { x: number; y: number } }> = ({ from, anchor }) => {
  const frame = useCurrentFrame();
  const u = clamp01((frame - from) / 34);
  return (
    <WideLayer>
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2 + i * 0.13;
        const r = interpolate(u, [0, 1], [1500, 300 + (i % 4) * 80], { easing: Easing.out(Easing.cubic) });
        const x = anchor.x + Math.cos(a) * r * 1.5;
        const y = anchor.y + Math.sin(a) * r * 0.62 + Math.sin(frame / 12 + i) * 10;
        return (
          <Blobby
            key={i}
            x={x}
            y={y}
            scale={0.55 + (i % 3) * 0.12}
            phase={i * 1.37}
            look={x > anchor.x ? -1 : 1}
            mood={i % 3 === 0 ? "surprised" : "happy"}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 30 — The twist
// ---------------------------------------------------------------------------

const RING = { cx: 960, cy: 566, r: 336 };

const TwistScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [upFrom, upTo] = lineWindow(scene, "a3_34_drip");
  const [homeFrom, homeTo] = lineWindow(scene, "a3_35_drip");
  const [circleFrom, circleTo] = lineWindow(scene, "a3_36_narrator");

  // The journey redraws itself as he lists it: up, across, down, and home.
  const progress = interpolate(
    frame,
    [upFrom + 10, upTo, homeFrom, homeTo],
    [0, 0.62, 0.62, 0.965],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  // "It is not a line. It is a circle." — and the two ends snap together.
  const snapAt = Math.round(circleFrom + (circleTo - circleFrom) * 0.74);
  const snapped = frame >= snapAt;
  const pulse = snapped ? Math.max(0, 1 - (frame - snapAt) / 26) : 0;

  const talking = useSpeaking(scene, "drip");
  const mapped = useEmotion(scene, "drip", { a3_34_drip: "excited", a3_35_drip: "excited" }, "happy");
  // The jaw drop lands on the snap, which happens inside a narrator line — so
  // it is set here rather than mapped to one of his own.
  const emotion: Emotion = frame >= snapAt - 4 ? "amazed" : mapped;

  return (
    <AbsoluteFill>
      <WorldMap />
      <CycleRing
        cx={RING.cx}
        cy={RING.cy}
        r={RING.r}
        progress={snapped ? 1 : progress}
        glow={pulse}
        stations
      />
      {snapped ? <CutFlash at={snapAt} strength={0.55} /> : null}
      {/* He is inside his own journey, watching it close around him. */}
      <Drip
        x={RING.cx}
        y={stand("drip", RING.cy + 150)}
        scale={0.78}
        emotion={emotion}
        speaking={talking}
        phase={PHASE.drip}
        shadow={false}
        idle={1.1}
        look={frame >= snapAt ? "camera" : frame > homeFrom ? "upRight" : "up"}
      />
      <Bubbles
        scene={scene}
        cast={{ drip: { x: RING.cx, y: stand("drip", RING.cy + 150), scale: 0.78, who: "drip" } }}
        text={{
          a3_34_drip: "Up. Across. Down.",
          a3_35_drip: "I ended where I started!",
          a3_37_drip: "A CYCLE! THE WATER CYCLE!",
        }}
        at={{
          a3_34_drip: { x: 470, y: 205, tail: "right" },
          a3_35_drip: { x: 1450, y: 205, tail: "left" },
          a3_37_drip: { x: 1420, y: 930, tail: "left" },
        }}
      />
    </AbsoluteFill>
  );
};

/** A stylized world, because the journey is a world-sized one. */
const WorldMap: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${kidTheme.waterDark} 0%, ${kidTheme.water} 58%, ${kidTheme.waterLight} 100%)` }} />
    <WideLayer opacity={0.62}>
      {[-260, 60, 380, 700, 1020, 1340].map((y) => (
        <path key={y} d={`M -1200 ${y} L 3200 ${y + 60}`} stroke="#ffffff" strokeWidth={4} opacity={0.22} fill="none" />
      ))}
      {/* Continents, kept small and plural: at four big blobs the map read as
          leaves, and the ring had to fight them. */}
      {[
        "M 70 180 Q 230 110 330 200 Q 420 300 300 360 Q 150 400 90 300 Z",
        "M 250 470 Q 360 430 420 520 Q 470 640 350 690 Q 230 720 210 600 Z",
        "M 640 120 Q 900 60 1030 170 Q 1130 270 960 320 Q 760 350 660 250 Z",
        "M 1230 210 Q 1420 150 1530 260 Q 1600 360 1450 400 Q 1290 420 1230 330 Z",
        "M 1420 620 Q 1620 570 1730 690 Q 1800 800 1650 850 Q 1470 880 1420 760 Z",
        "M 560 800 Q 740 760 830 870 Q 890 980 740 1010 Q 580 1030 540 920 Z",
        "M 1080 900 Q 1210 870 1260 950 Q 1290 1030 1180 1050 Q 1070 1060 1050 980 Z",
      ].map((d, i) => (
        <path key={i} d={d} fill={kidTheme.grass} stroke={kidTheme.grassDark} strokeWidth={9} />
      ))}
    </WideLayer>
  </AbsoluteFill>
);

/**
 * The journey, as a ring. Shared with Scene 31 (Sunny spins it) and with the
 * recap's Scene 33 panel — same picture, three sizes, which is the point: a
 * six-year-old should recognise it instantly the third time.
 *
 * `progress` draws the line; at 1 the two ends meet and it is a circle.
 */
export const CycleRing: React.FC<{
  cx: number;
  cy: number;
  r: number;
  progress?: number;
  /** Rotation in degrees — Scene 31 onwards, the wheel turns. */
  spin?: number;
  /** 0..1 flash of extra glow, for the snap. */
  glow?: number;
  /** Sun / cloud / rain / mountain icons around the rim. */
  stations?: boolean;
  opacity?: number;
}> = ({ cx, cy, r, progress = 1, spin = 0, glow = 0, stations = false, opacity = 1 }) => {
  const p = clamp01(progress);
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    // From the ocean at lower-left, up the left side, across the top, down the
    // right, and along the bottom back home.
    const th = ((140 + (i / 120) * 360) * Math.PI) / 180;
    pts.push(`${(cx + Math.cos(th) * r).toFixed(1)} ${(cy + Math.sin(th) * r).toFixed(1)}`);
  }
  const d = `M ${pts.join(" L ")}`;
  const scale = r / 336;
  // Station icons are drawn bigger than the line weight scale: at 1× they were
  // specks on a hoop and the mountain read as an arrowhead.
  const iconScale = scale * 1.55;
  // A station only appears once the line has reached it, so the journey draws
  // its own stops rather than laying them out in advance.
  const station = (deg: number, node: React.ReactNode) => {
    const th = (deg * Math.PI) / 180;
    const frac = ((((deg - 140) % 360) + 360) % 360) / 360;
    if (frac > p) return null;
    return (
      // Counter-rotated: the ring is a wheel, but a mountain lying on its side
      // is a broken icon rather than a turning one.
      <g
        transform={`translate(${cx + Math.cos(th) * r} ${cy + Math.sin(th) * r}) rotate(${-spin}) scale(${iconScale})`}
      >
        {node}
      </g>
    );
  };
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}
    >
      <g transform={`rotate(${spin} ${cx} ${cy})`}>
        <path
          d={d}
          pathLength={1}
          strokeDasharray={`${p} 1`}
          // White, not `star`: a warm glow at 45% over a blue sky mixes to a
          // pale green and the ring reads as a plastic hoop.
          stroke={glow > 0.05 ? kidTheme.star : "#ffffff"}
          strokeWidth={54 * scale + glow * 30}
          strokeLinecap="round"
          fill="none"
          opacity={0.4 + glow * 0.45}
        />
        <path
          d={d}
          pathLength={1}
          strokeDasharray={`${p} 1`}
          stroke={kidTheme.paper}
          strokeWidth={22 * scale}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={d}
          pathLength={1}
          strokeDasharray={`${p} 1`}
          stroke={kidTheme.waterDark}
          strokeWidth={11 * scale}
          strokeLinecap="round"
          fill="none"
        />
        {/* Direction chevrons: the ring is going somewhere. */}
        {[0, 90, 180, 270].map((deg) => {
          const at = ((140 + deg + 44) * Math.PI) / 180;
          const frac = ((deg + 44) / 360) % 1;
          if (frac > p) return null;
          return (
            <g
              key={deg}
              transform={`translate(${cx + Math.cos(at) * r} ${cy + Math.sin(at) * r}) rotate(${(at * 180) / Math.PI + 90}) scale(${scale})`}
            >
              <path d="M -26 -18 L 0 16 L 26 -18" stroke={kidTheme.waterDeep} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          );
        })}
        {stations ? (
          <>
            {/* Rising vapour, not a sun: Sunny arrives in person in Scene 31,
                and two suns in one frame is a puzzle rather than a diagram. */}
            {station(
              186,
              <g>
                {[-34, 0, 34].map((dx, i) => (
                  <path
                    key={dx}
                    d={`M ${dx} ${28 - i * 6} L ${dx} ${-30 - i * 6}`}
                    stroke={kidTheme.waterDark}
                    strokeWidth={14}
                    strokeLinecap="round"
                  />
                ))}
                <path d="M -24 -28 L 0 -66 L 24 -28 Z" fill={kidTheme.waterDark} />
              </g>,
            )}
            {station(
              272,
              <g>
                <circle cx={-38} cy={6} r={34} fill={kidTheme.cloud} stroke={kidTheme.cloudShade} strokeWidth={7} />
                <circle cx={4} cy={-18} r={44} fill={kidTheme.cloud} stroke={kidTheme.cloudShade} strokeWidth={7} />
                <circle cx={46} cy={8} r={32} fill={kidTheme.cloud} stroke={kidTheme.cloudShade} strokeWidth={7} />
              </g>,
            )}
            {station(
              6,
              <g>
                {[-30, 0, 30].map((dx, i) => (
                  <path
                    key={dx}
                    transform={`translate(${dx} ${i * 8 - 8}) scale(1.3)`}
                    d="M 0 -26 C 6 -14 17 -6 17 6 A 17 17 0 0 1 -17 6 C -17 -6 -6 -14 0 -26 Z"
                    fill={kidTheme.water}
                    stroke={kidTheme.waterDeep}
                    strokeWidth={6}
                  />
                ))}
              </g>,
            )}
            {station(
              92,
              <g>
                <path d="M -78 40 L -10 -52 L 58 40 Z" fill="#9fb4c6" stroke={kidTheme.ink} strokeWidth={8} strokeLinejoin="round" />
                <path d="M -34 -18 L -10 -52 L 14 -18 Q -10 -34 -34 -18 Z" fill="#ffffff" />
                <path d="M 30 40 q 40 -18 78 -6" stroke={kidTheme.water} strokeWidth={16} strokeLinecap="round" fill="none" />
              </g>,
            )}
          </>
        ) : null}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Scene 31 — Credit where it is due
// ---------------------------------------------------------------------------

const S31_SUNNY = { x: 1560, y: 420, scale: 1.15 };

const CreditScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [rightFrom] = lineWindow(scene, "a3_39_narrator");

  // He slides in at maximum brightness, which is the only volume he has.
  const slide = interpolate(frame, [0, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const sunnyX = interpolate(slide, [0, 1], [2400, S31_SUNNY.x]);
  const bloom = Math.max(0, 1 - Math.abs(frame - 26) / 22);

  // The ring turns because he is turning it. The angle is the integral of a
  // ramping speed, so the wheel accelerates instead of snapping into motion.
  const spinStart = 30;
  const ramp = 70;
  const f = Math.max(0, frame - spinStart);
  const spin = f < ramp ? (0.6 * f * f) / (2 * ramp) : 0.6 * (f - ramp / 2);

  const talking = useSpeaking(scene, "sunny");

  return (
    <AbsoluteFill>
      <WorldMap />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${sunnyX}px 470px, rgba(255,230,128,${0.5 * slide}) 0%, rgba(255,201,60,0.22) 26%, transparent 62%)`,
        }}
      />
      <CycleRing cx={RING.cx} cy={RING.cy} r={RING.r} progress={1} spin={spin} glow={0.35 + bloom * 0.4} stations />
      <SunBeamsToRing x={sunnyX} y={S31_SUNNY.y} strength={slide} />
      <Sunny
        x={sunnyX}
        y={S31_SUNNY.y}
        scale={S31_SUNNY.scale}
        emotion="proud"
        speaking={talking}
        phase={PHASE.sunny}
        shades={0}
        raySpeed={0.4}
        look={{ x: -0.6, y: 0.2 }}
      />
      {bloom > 0.02 ? (
        <AbsoluteFill style={{ background: "#ffffff", opacity: bloom * 0.35, pointerEvents: "none" }} />
      ) : null}
      <Bubbles
        scene={scene}
        cast={{ sunny: { ...S31_SUNNY, x: sunnyX, who: "sunny" } }}
        text={{ a3_38_sunny: "I POWER THE WHOLE THING!" }}
        at={{ a3_38_sunny: { x: 640, y: 200, tail: "right" } }}
      />
      {/* The grown-up's payoff for two acts of Sunny. */}
      <CaptionCard
        text="annoyingly, he is right"
        from={rightFrom + 26}
        until={rightFrom + 104}
        y={982}
        color={kidTheme.paper}
      />
    </AbsoluteFill>
  );
};

/** Beams from Sunny onto the ring — the thing that is turning it. */
const SunBeamsToRing: React.FC<{ x: number; y: number; strength: number }> = ({ x, y, strength }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (strength <= 0.01) return null;
  return (
    <WideLayer>
      {Array.from({ length: 5 }, (_, i) => {
        const ang = (-40 + i * 26) * (Math.PI / 180);
        const tx = RING.cx + Math.cos(ang + Math.PI) * RING.r * 1.1;
        const ty = RING.cy + Math.sin(ang + Math.PI) * RING.r * 1.1;
        const w = 40 + (i % 2) * 22;
        const shimmer = 0.5 + 0.5 * Math.sin(t * 1.8 + i);
        return (
          <path
            key={i}
            d={`M ${x - w} ${y} L ${x + w} ${y} L ${tx + w * 2} ${ty} L ${tx - w * 2} ${ty} Z`}
            fill={kidTheme.sunLight}
            opacity={strength * (0.12 + 0.1 * shimmer)}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 32 — Round again
// ---------------------------------------------------------------------------

const S32_SURFACE = 800;
const S32_DRIP_X = 720;
const S32_DRIP_SCALE = 1.05;

const S32_BUBBLES: Record<string, string> = {
  a3_41_drip: "Sunny! Warm me up!",
  a3_42_sunny: "Say the magic words.",
  a3_43_drip: "You're welcome?",
  a3_44_sunny: "HA! HA! Good drop.",
};

const RoundAgainScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [, readyTo] = lineWindow(scene, "a3_41_drip");
  const [magicFrom] = lineWindow(scene, "a3_42_sunny");
  const [welcomeFrom, welcomeTo] = lineWindow(scene, "a3_43_drip");

  // Hopping on the spot, and then not coming back down: the cycle restarting,
  // shown rather than said.
  const hop = Math.abs(Math.sin(frame / 7)) * (frame < readyTo ? 74 : 34);
  const riseAt = Math.round(welcomeFrom + (welcomeTo - welcomeFrom) * 0.45);
  const rise = interpolate(frame, [riseAt, scene.durationInFrames], [0, 470], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const dripY = stand("drip", S32_SURFACE) - hop - rise;

  // He leans in for the magic words.
  const lean = interpolate(frame, [magicFrom - 20, magicFrom + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const sunnyX = interpolate(lean, [0, 1], [1690, 1420]);
  const sunnyY = interpolate(lean, [0, 1], [330, 448]);
  const sunnyScale = interpolate(lean, [0, 1], [0.78, 1.02]);
  const warmth = interpolate(frame, [riseAt - 40, scene.durationInFrames], [0.35, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dripTalking = useSpeaking(scene, "drip");
  const sunnyTalking = useSpeaking(scene, "sunny");
  const dripEmotion = useEmotion(
    scene,
    "drip",
    { a3_41_drip: "excited", a3_43_drip: "excited" },
    "excited",
  );

  const dripMark: Mark = { x: S32_DRIP_X, y: dripY, scale: S32_DRIP_SCALE, who: "drip", side: "right" };
  const sunnyMark: Mark = { x: sunnyX, y: sunnyY, scale: sunnyScale, who: "sunny" };

  return (
    <AbsoluteFill>
      <KidBackdrop variant="day" clouds={3} waves={false} />
      <Sunny
        x={sunnyX}
        y={sunnyY}
        scale={sunnyScale}
        emotion="proud"
        speaking={sunnyTalking}
        phase={PHASE.sunny}
        shades={1 - lean}
        look={lookAt(
          { x: sunnyX, y: midOf("sunny", sunnyY, sunnyScale) },
          { x: S32_DRIP_X, y: midOf("drip", dripY, S32_DRIP_SCALE) },
          1200,
        )}
      />
      <WaterBand top={S32_SURFACE + 40} warmth={warmth} />
      <WideLayer>
        <SteamWisps x={380} y={S32_SURFACE + 90} count={3} scale={1.1} />
        <SteamWisps x={1500} y={S32_SURFACE + 120} count={3} scale={1} phase={0.5} />
        {rise > 4 ? (
          <g opacity={clamp01(rise / 90)}>
            {Array.from({ length: 12 }, (_, i) => {
              const lane = ((i * 173) % 1800) + 60;
              const travel = ((frame * 3.4 + i * 61) % 620) - 60;
              return (
                <Blobby
                  key={i}
                  x={lane}
                  y={S32_SURFACE + 40 - travel}
                  scale={0.36 + (i % 3) * 0.1}
                  phase={i * 1.31}
                  mood="happy"
                  opacity={0.85}
                />
              );
            })}
          </g>
        ) : null}
      </WideLayer>
      <Drip
        x={S32_DRIP_X}
        y={dripY}
        scale={S32_DRIP_SCALE}
        emotion={dripEmotion}
        speaking={dripTalking}
        phase={PHASE.drip}
        shadow={false}
        idle={1.7}
        pose="cheer"
        look="upRight"
      />
      <Bubbles
        scene={scene}
        cast={{ drip: dripMark, sunny: sunnyMark }}
        text={S32_BUBBLES}
        at={{
          a3_42_sunny: { x: 1180, y: 190, tail: "right" },
          a3_44_sunny: { x: 1180, y: 190, tail: "right" },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------

export const ACT3_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s22_checkout: CheckoutScene,
  s23_bigword_precipitation: WaterslideScene,
  s24_landing: LandingScene,
  s25_downhill: DownhillScene,
  s26_flower: FlowerScene,
  s27_moose: MooseScene,
  s28_everybody_wants_a_bit: EverybodyScene,
  s29_bigword_collection: HomeScene,
  s30_twist: TwistScene,
  s31_credit: CreditScene,
  s32_round_again: RoundAgainScene,
};
