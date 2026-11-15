import React from "react";
import { LobbyDesk, LobbyDusk, LobbyLamp, LobbySign } from "./lobbykit";
import { Easing } from "remotion";
import { SpeechBubble, keyDirTo, kidTheme, kidType, lookAt, threeValues, type EmotionInput } from "../../../lib/kid";
import { useSpeaking } from "../../../lib/narration";
import {
  ACT_COLOR,
  AbsoluteFill,
  BigWordBeat,
  Bubbles,
  CaptionCard,
  CutFlash,
  HEIGHT,
  KeyBloom,
  LIGHT,
  LightPool,
  PHASE,
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
  bigWordPush,
  burst,
  horizonAt,
  interpolate,
  kidPaintTheme,
  midOf,
  project,
  remasterCam,
  stand,
  useCurrentFrame,
  useEmotion,
  useLookAtSpeaker,
  withCam,
  type Cam,
  type Cast,
  type LightRig,
  type PlateKey,
  type TimedScene,
} from "./common";
import { Crowd, Svg, Zenith, secs, shake } from "./act1kit";
import {
  BankCutaway,
  BeamsTo,
  Bonk,
  CloudFloor,
  Daisy,
  DropStreaks,
  FgMound,
  FloatCrowd,
  Lever,
  MirroredPlate,
  PRECIP,
  PaintedMoose,
  PaintedRing,
  PrecipIcon,
  RainBelow,
  RainStreaks,
  Ripples,
  RubberDuck,
  ScrollPlate,
  ShadowPool,
  Snowfall,
  Splash,
  Stream,
  SummitRock,
  TinyFlag,
  Waterline,
  clamp01,
  lerp,
} from "./act3kit";

// Act three, re-pictured on the look package (shot-plan rows s22–s32 + the
// D12 rulings). Beats are ep 1's (src/videos/water-cycle/scenes/act3.tsx);
// pictures are plate planes + the lit painted cast + camera grammar. Every
// camera move is pinned to a line key or a measured word (silencedetect
// times quoted inline); no move while a bubble is up except the plan's
// FOLLOWs (s22 drop, s25 drift, s27 detour), where the bubble rides with Drip.
// Sun-side switch 1 lands in s24 (key LEFT from here to s32); Sunny re-enters
// camera-left in s31.

const P = kidPaintTheme;
const smooth = (u: number) => {
  const c = clamp01(u);
  return c * c * (3 - 2 * c);
};
const ramp = (frame: number, a: number, b: number) => (b <= a ? (frame >= b ? 1 : 0) : clamp01((frame - a) / (b - a)));

/** Light row with the key aimed at Sunny's disc (he IS the key on screen). */
const keyAt = (id: string, from: { x: number; y: number }, sun: { x: number; y: number }): LightRig => ({
  ...LIGHT[id],
  dir: keyDirTo(from, sun),
});

/** Drip in a body's cast shadow: cooler, flatter key (s27 "Drip reads cooler inside it"). */
const inShade = (id: string): LightRig => ({ ...LIGHT[id], key: "#a8b8d8", contrast: LIGHT[id].contrast * 0.45, strength: 0.8 });

// ---------------------------------------------------------------------------
// Scene 22 — Check-out: the lever, the vanishing floor, Drip on nothing
// ---------------------------------------------------------------------------
// Plan: medium, horizon mid (desk line), eye. HOLD creep a3_01–a3_03; camera
// STILL through the 16 f gap with Drip on nothing; a3_04 split into its two
// halves (measured: "Oh, no." 0.16–1.17 s, "Whee!" from 2.03 s) so the BURST
// 26 px + roll to 3° lands on WHEEE after the first bubble clears; then a
// FOLLOW down the hole (the whole set cranes up off frame; the rain world
// below holds) — the continuous move is the seam into s23 (hard cut).

const S22_FLOOR = 900;
const S22_DESK = { x0: 280, x1: 1040, top: 560 };
const S22_CLOUDIA = { x: 720, ground: 600, scale: 0.95 };
const S22_LEVER = { x: 1000, y: 560 };
const S22_LAMP = { x: 340, y: 560 };
const S22_DRIP = { x: 1400, scale: 1 };
const S22_SIGN = { x: 960, y: 104 };

const CheckoutScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const outFrom = atLine(scene, "a3_01_cloudia");
  const outTo = afterLine(scene, "a3_01_cloudia");
  const noStairsTo = afterLine(scene, "a3_03_cloudia");
  const ohFrom = atLine(scene, "a3_04_drip");
  const ohTo = secs(ohFrom, 1.3);
  const wheeAt = secs(ohFrom, 2.0);
  const pull = smooth((frame - (outFrom + (outTo - outFrom) * 0.5)) / ((outTo - outFrom) * 0.34));
  const vanishAt = Math.round(outFrom + (outTo - outFrom) * 0.9);
  const holeR = 340 * Easing.out(Easing.back(1.4))(clamp01((frame - vanishAt) / 10));
  const since = Math.max(0, frame - wheeAt);
  const fall = 1.7 * since * since;
  // FOLLOW: the set cranes up after him, lagging so he drifts down-frame.
  // FOLLOW: the camera cranes down after him (he settles ~140 px higher in frame).
  const follow = since > 0 ? fall + 140 * smooth(since / 20) : 0;
  const cam = remasterCam(frame, {
    creep: { from: 0 },
    bursts: [{ at: wheeAt, delta: { rotate: 3, zoom: 1.04, dy: -30 } }],
    deltas: [{ dy: -follow }],
  });
  const dripY = stand("drip", S22_FLOOR) + fall;
  const dripMid = { x: S22_DRIP.x, y: midOf("drip", dripY, S22_DRIP.scale) };
  const cloudiaY = stand("cloudia", S22_CLOUDIA.ground);
  const cloudiaLook = useLookAtSpeaker(
    scene,
    {
      drip: { x: S22_DRIP.x, y: stand("drip", S22_FLOOR), scale: S22_DRIP.scale, who: "drip" },
      cloudia: { x: S22_CLOUDIA.x, y: cloudiaY, scale: S22_CLOUDIA.scale, who: "cloudia" },
    },
    "cloudia",
    "right",
  );
  const mapped = useEmotion(scene, "drip", { a3_02_drip: "amazed", a3_04_drip: "amazed" }, "happy");
  const dripEmotion: EmotionInput = frame >= wheeAt - 3 ? "excited" : mapped;
  const cloudiaTalking = useSpeaking(scene, "cloudia");
  const dripTalking = useSpeaking(scene, "drip");
  const shiftY = 0;
  const dripS = project(cam, { x: dripMid.x, y: dripMid.y + shiftY });
  const cloudS = project(cam, { x: S22_CLOUDIA.x, y: midOf("cloudia", cloudiaY, S22_CLOUDIA.scale) });
  const cast: Cast = {
    drip: { x: S22_DRIP.x, y: stand("drip", S22_FLOOR), scale: S22_DRIP.scale, who: "drip" },
    cloudia: { x: S22_CLOUDIA.x, y: cloudiaY, scale: S22_CLOUDIA.scale, who: "cloudia" },
  };
  const lampOn = 1;
  const lampS = project(cam, { x: S22_LAMP.x, y: S22_LAMP.y });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#55667c" }}>
      <AbsoluteFill style={{ transform: `translateY(${shiftY}px)` }}>
        <SetStack
          set={SETS.lobby.dim}
          cam={cam}
          bleed={0.3}
          hide={["fg"]}
          sky={<><AbsoluteFill style={{ background: "#5a4aa0", mixBlendMode: "multiply", opacity: 0.4 }} /><LightPool x={1500} y={300} r={700} color="#ffd8a0" opacity={0.18} /></>}
          stage={
            <>
              <RainBelow top={S22_FLOOR - 40 + Math.max(0, follow - S22_FLOOR)} scroll={6 + since * 0.4} />
              <Svg>
                <CloudFloor top={S22_FLOOR} hole={{ x: S22_DRIP.x, r: holeR }} />
                {/* Polish A2-3/A3-6 (D30): the canon cream board, desk and lamp from lobbykit. */}
                <LobbySign id="s22-sign" x={S22_SIGN.x} y={S22_SIGN.y} cord={230} rotate={-1.5} />
              </Svg>
              {/* Lamp cone on Cloudia (screen 0.2) + the floor pool under the lamp. */}
              <LightPool x={S22_CLOUDIA.x - 40} y={cloudiaY - 20} r={330} ry={300} color="#ffd8a0" opacity={0.32 * lampOn} />
              <AbsoluteFill style={{ transformOrigin: `${S22_CLOUDIA.x}px ${S22_CLOUDIA.ground}px`, transform: `rotate(${pull * 9}deg)` }}>
                <PaintedCloudia id={scene.id} x={S22_CLOUDIA.x} y={cloudiaY} scale={S22_CLOUDIA.scale} emotion="proud" speaking={cloudiaTalking}
                  phase={PHASE.cloudia} clipboard fill={0.75} look={frame < outTo ? "right" : cloudiaLook} />
              </AbsoluteFill>
              <Svg>
                <Lever x={S22_LEVER.x} y={S22_LEVER.y} pull={pull} />
                <LobbyDesk id="s22-desk" x0={S22_DESK.x0} x1={S22_DESK.x1} top={S22_DESK.top} bottom={S22_FLOOR + 8} label="CHECK OUT" />
                <LobbyLamp id="s22-lamp" x={S22_LAMP.x} y={S22_LAMP.y + 6} />
              </Svg>
              <LightPool x={S22_LAMP.x + 40} y={S22_DESK.top + 30} r={260} ry={120} color="#ffd8a0" opacity={0.4} />
              {/* The rain world's cold light comes UP through the hole once it opens. */}
              <LightPool x={S22_DRIP.x} y={S22_FLOOR - 100} r={360} ry={300} color="#9fb8d8" opacity={0.3 * clamp01(holeR / 200)} />
              <PaintedDrip
                id={scene.id}
                x={S22_DRIP.x}
                y={dripY}
                scale={S22_DRIP.scale * (1 - 0.25 * clamp01(since / 40))}
                emotion={dripEmotion}
                speaking={dripTalking}
                phase={PHASE.drip}
                idle={frame > vanishAt && frame < wheeAt ? 0.25 : 1}
                look={frame > noStairsTo - 20 && frame < wheeAt ? "down" : frame >= wheeAt ? "camera" : "left"}
                pose={frame >= wheeAt ? "cheer" : undefined}
                // The tell: his shadow goes WITH the floor.
                groundY={frame < vanishAt ? S22_FLOOR : undefined}
                groundLum={0.42}
              />
              <DropStreaks x={S22_DRIP.x} y={dripMid.y} strength={clamp01(since / 8) * 0.9} />
            </>
          }
        />
        {/* Polish A3-6 (D30): act 2's dusk-violet room light (s21→s22 continuity), fading out as the fall
            leaves the lobby; A3-5: the desk lamp LIT — a cone onto Cloudia and a pool on the desk top. */}
        <LobbyDusk
          opacity={1 - clamp01(since / 14)}
          pools={[
            { x: lampS.x + 150, y: lampS.y - 40, r: 380, ry: 300, color: "#ffd08a", opacity: 0.55 },
            { x: lampS.x + 60, y: lampS.y + 40, r: 300, ry: 110, color: "#ffbe5c", opacity: 0.6 },
            { x: lampS.x, y: lampS.y - 190, r: 130, ry: 100, color: "#ffe2a8", opacity: 0.8 },
            { x: 1500, y: 300, r: 640, ry: 420, color: "#cadcff", opacity: 0.35 },
          ]}
        />
      </AbsoluteFill>
      <Bubbles
        scene={scene}
        cast={cast}
        text={{
          a3_01_cloudia: "Everybody OUT! Check-out time!",
          a3_02_drip: "Where are the stairs?",
          a3_03_cloudia: "There are no stairs.",
        }}
        at={{
          a3_01_cloudia: { x: 410, y: 200, tail: "right", tailAt: cloudS.x - 70 },
          a3_03_cloudia: { x: 410, y: 200, tail: "right", tailAt: cloudS.x - 70 },
          a3_02_drip: { x: 1500, y: 430, tail: "left", tailAt: dripS.x - 20 },
        }}
      />
      <SpeechBubble x={1500} y={430} text="Ohhhh nooooo." tail="left" tailAt={S22_DRIP.x - 20} from={ohFrom} until={ohTo} background={P.paper} />
      <SpeechBubble x={Math.min(1500, dripS.x + 330)} y={Math.max(200, dripS.y - 250)} text="WHEEE!" tail="left" tailAt={dripS.x + 40}
        from={wheeAt + 12} until={scene.durationInFrames + 10} background={P.paper} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 23 — The waterslide, and Big Word Three: PRECIPITATION
// ---------------------------------------------------------------------------
// Plan: medium, no horizon. Dutch 3° held through the slide, eased to 0° by
// slam − 16 (≥ 12 f before the card). HOLD creep locked on Drip; the rain
// planes scroll UP past him (plate animation, not camera). PUSH 1.00→1.06 over
// 24 f ending on the slam (end of "…that is precipitation.", measured 3.08 s
// into a3_07); CutFlash; the four icons arrive on "Rain, snow, sleet, hail"
// and hover round the card.

const S23_LOOP = 48;
const S23_R = 140;
const S23_SCALE = 1.0;
const S23_PRECIP_AT = [3.75, 4.2, 4.65, 5.1];
const S23_SLOTS: Array<[number, number]> = [[250, 560], [600, 690], [1580, 640], [1740, 500]];

function plunge(f: number, loops: number[]): { x: number; y: number; rot: number } {
  let x = 1180 + 220 * Math.sin(f / 43);
  let y = 780 + 46 * Math.sin(f / 26 + 1.2);
  let rot = 10 * Math.sin(f / 18);
  for (const w of loops) {
    const u = (f - w) / S23_LOOP;
    if (u >= 0 && u <= 1) {
      const th = u * Math.PI * 2;
      x += Math.sin(th) * S23_R;
      y -= (1 - Math.cos(th)) * S23_R;
      rot = (th * 180) / Math.PI;
    }
  }
  return { x, y, rot };
}

function s23Cam(frame: number, slam: number): Cam {
  const roll = 3 * (1 - smooth((frame - (slam - 44)) / 24));
  const creep = remasterCam(Math.min(frame, slam - 24), {});
  return withCam({ ...creep, rotate: roll }, bigWordPush(frame, slam));
}

const PlungeWorld: React.FC<{ slam: number }> = ({ slam }) => {
  const frame = useCurrentFrame();
  const cam = s23Cam(frame, slam);
  const hotel = clamp01(1 - frame / 110);
  return (
    <SetStack
      set={SETS.rain.fall}
      cam={cam}
      bleed={0.3}
      hide={["far", "mid", "fg"]}
      sky={<><Zenith color="#26304a" mid="#56688a" reach={60} opacity={0.85} bleed={0.3} /><LightPool x={200} y={1000} r={900} color="#4aa8a0" opacity={0.35} /><LightPool x={1700} y={80} r={900} color="#8a6ac0" opacity={0.4} /></>}
      far={
        <>
          <ScrollPlate k="rain_far_curtain" speed={5} opacity={0.55} />
          {hotel > 0 ? (
            <div style={{ position: "absolute", inset: 0, opacity: hotel, transform: `translateY(${-260 - frame * 7}px)` }}>
              <Plate k="hotel_mid_bulk_grey" />
            </div>
          ) : null}
        </>
      }
      mid={
        <>
          <ScrollPlate k="rain_mid_curtain" speed={13} opacity={0.45} />
          <Crowd id="s23m" bob={6} litDir={-1} rows={[{ y: 300, s: 0.3, count: 6, spread: 2600, tint: 0.45 }, { y: 760, s: 0.34, count: 5, spread: 2400, x: 900, tint: 0.45 }]}
            rise={(f, i) => ((f * (1.2 + (i % 3) * 0.5) + i * 140) % 1400) - 300} />
        </>
      }
      stage={
        <Crowd id="s23s" bob={8} litDir={-1} rows={[{ y: 240, s: 0.55, count: 3, spread: 1900, x: 700 }, { y: 980, s: 0.6, count: 3, spread: 2100, x: 1000 }]}
          rise={(f, i) => ((f * (2 + (i % 2)) + i * 300) % 1800) - 500} />
      }
      fg={<RainStreaks count={16} speed={-46} len={260} opacity={0.4} seed={23} />}
    />
  );
};

const WaterslideScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const wordFrom = atLine(scene, "a3_07_narrator");
  const slamAt = secs(wordFrom, 3.08);
  const talking = useSpeaking(scene, "drip");
  const cam = s23Cam(frame, slamAt);
  const held = plunge(Math.min(frame, slamAt), [70, 236, slamAt - 35]);
  const mid = { x: held.x, y: midOf("drip", held.y, S23_SCALE) };
  const at = project(cam, mid);
  const z = cam.zoom ?? 1;
  const t = frame / 30;
  return (
    <AbsoluteFill>
      <BigWordBeat
        scene={scene}
        word="PRECIPITATION"
        syllables={["Pre", "sip", "ih", "TAY", "shun"]}
        beats={[0.06, 0.255, 0.459, 0.594, 0.778]}
        chantKey="a3_08_drip"
        slamAt={slamAt}
        color={ACT_COLOR.precipitation}
        sub="the falling part"
        y={300}
        freeze={<PlungeWorld slam={slamAt} />}
      >
        <AbsoluteFill style={{ transformOrigin: `${at.x}px ${at.y}px`, transform: `rotate(${held.rot + (cam.rotate ?? 0)}deg)` }}>
          <PaintedDrip id={scene.id} x={at.x} y={at.y} scale={S23_SCALE * z} emotion="excited" speaking={talking} phase={PHASE.drip}
            idle={1.6} pose="cheer" look="camera" />
        </AbsoluteFill>
        {frame < slamAt ? <DropStreaks x={at.x} y={at.y} strength={0.8} up /> : null}
      </BigWordBeat>
      {frame >= slamAt ? (
        <Svg style={{ zIndex: 45 }}>
          {PRECIP.map((kind, i) => {
            const arrive = secs(wordFrom, S23_PRECIP_AT[i]);
            const u = clamp01((frame - arrive) / 10);
            if (u <= 0) return null;
            const pop = Easing.out(Easing.back(2))(u);
            const a = t * 0.5 + i * 1.7;
            const x = S23_SLOTS[i][0] + Math.cos(a) * 18;
            const y = S23_SLOTS[i][1] + Math.sin(a) * 12;
            return <PrecipIcon key={kind} kind={kind} x={x} y={y} s={0.95 * pop} rot={Math.sin(t * 0.9 + i) * 4} />;
          })}
        </Svg>
      ) : null}
      <Bubbles
        scene={scene}
        cast={{ drip: { x: held.x, y: held.y, scale: S23_SCALE, who: "drip" } }}
        text={{ a3_06_drip: "The GREATEST thing ever!" }}
        at={{ a3_06_drip: { x: 560, y: 220, tail: "right", tailAt: Math.min(at.x - 100, 860) } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 24 — Landing: Sploosh on a mossy summit; the flag; the winter aside
// ---------------------------------------------------------------------------
// Plan: medium, horizon top third (on the peak), low cam, 0°. BURST 14 px on
// "Sploosh" (measured 2.20 s into a3_10, a VO line); HOLD creep; the winter
// DISSOLVE (8 f) on a3_12 ("In winter," 0.38 s) and 8 f back before a3_13 —
// plate swap, camera still. SUN-SIDE SWITCH 1: key LEFT from here on.

const S24_ROCK_TOP = 780;
const S24_DRIP = { x: 820, scale: 0.95 };

const LandingScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const splooshAt = secs(atLine(scene, "a3_10_narrator"), 2.2);
  const flagFrom = atLine(scene, "a3_11_drip");
  const winterFrom = atLine(scene, "a3_12_narrator");
  const backBy = atLine(scene, "a3_13_drip");
  const drop = interpolate(frame, [splooshAt - 26, splooshAt], [-1100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const land = frame >= splooshAt ? clamp01((frame - splooshAt) / 16) : 1;
  const squash = frame >= splooshAt ? Math.sin(land * Math.PI) * (1 - land) * 1.6 : 0;
  const winter = Math.min(ramp(frame, secs(winterFrom, 0.4), secs(winterFrom, 0.4) + 8), 1 - ramp(frame, backBy - 10, backBy - 2));
  const cam = remasterCam(frame, { base: { x: 960, y: 560 }, deltas: [shake(frame, splooshAt, 14)] });
  const emotion = useEmotion(scene, "drip", { a3_11_drip: "excited", a3_13_drip: "proud" }, "happy");
  const dripY = stand("drip", S24_ROCK_TOP) + drop;
  const dripS = project(cam, { x: S24_DRIP.x, y: midOf("drip", dripY, S24_DRIP.scale) });
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.valley.rock}
        cam={cam}
        horizons={{ far: 330 }}
        hide={["mid", "fg"]}
        mid={<Plate k="valley_mid_rock" x={620} y={horizonAt("valley_mid_rock", 470)} />}
        sky={
          <>
            {winter > 0 ? <AbsoluteFill style={{ opacity: winter }}><Plate k="valley_sky_winter" /></AbsoluteFill> : null}
            <Zenith color="#3f6aa8" mid="#86a6cf" reach={58} opacity={0.65 * (1 - winter)} bleed={0.3} />
            <LightPool x={120} y={260} r={900} color="#ffe2a4" opacity={0.4 * (1 - winter)} />
          </>
        }
        far={winter > 0 ? <AbsoluteFill style={{ opacity: winter }}><Plate k="valley_far_hills_snow" y={horizonAt("valley_far_hills_snow", 330)} /></AbsoluteFill> : null}
        stage={
          <>
            <Svg>
              <SummitRock top={S24_ROCK_TOP} x={760} snow={winter} />
              <TinyFlag x={S24_DRIP.x + 170} y={S24_ROCK_TOP + 4} from={flagFrom + 26} />
            </Svg>
            <AbsoluteFill style={{ transformOrigin: `${S24_DRIP.x}px ${S24_ROCK_TOP}px`, transform: `scale(${1 + squash * 0.18}, ${1 - squash * 0.22})` }}>
              <PaintedDrip id={scene.id} x={S24_DRIP.x} y={dripY} scale={S24_DRIP.scale} emotion={emotion} speaking={useSpeaking(scene, "drip")}
                phase={PHASE.drip} idle={0.7} pose="cheer" look="camera" groundY={S24_ROCK_TOP} altitude={-drop} groundLum={0.45} />
            </AbsoluteFill>
            <Splash x={S24_DRIP.x} y={S24_ROCK_TOP - 20} from={splooshAt} />
          </>
        }
        // Polish A3-1: the grass plate slid 360 px left so no near blade crosses Drip's box in any frame.
        fg={<><Plate k="valley_fg_grass" y={700} x={-360} /><FgMound id="s24-fgl" side="left" reach={540} top={890} /><Snowfall opacity={winter} /></>}
      />
      <Bubbles
        scene={scene}
        cast={{ drip: { x: S24_DRIP.x, y: stand("drip", S24_ROCK_TOP), scale: S24_DRIP.scale, who: "drip" } }}
        text={{ a3_11_drip: "I am a mountain drop!", a3_13_drip: "I'd look GREAT as snow!" }}
        at={{
          a3_11_drip: { x: 1380, y: 300, tail: "left", tailAt: dripS.x + 80 },
          a3_13_drip: { x: 1380, y: 300, tail: "left", tailAt: dripS.x + 80 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 25 — Downhill: trickle → stream → river, three stepped pull-outs
// ---------------------------------------------------------------------------
// Plan: medium → wide → high wide, low → high cam. BURST 14 px on the
// slide-off (frame 0, under the seam); three stepped pull-out BURSTs on
// a3_17 (VO) at its clause starts (measured 0.35 / 2.09 / 3.89 s); FOLLOW
// drift ≤0.3 px/f downstream (Drip pinned, the planes drift by depth).
// Waterline + submerged tint from here on.

const S25_SURFACE = 790;
const S25_SCALE = 1.0;
const S25_X0 = 900;

/** The family joining at each merge: offsets from Drip (x, surface dy, scale). */
const S25_JOIN: Array<{ at: number; drops: Array<[number, number, number]> }> = [
  { at: 0, drops: [[-260, 30, 0.5], [-420, 10, 0.44]] },
  { at: 1, drops: [[-610, 40, 0.5], [-760, 0, 0.42], [260, 60, 0.55], [-130, 110, 0.6]] },
  { at: 2, drops: [[420, 20, 0.48], [600, 70, 0.55], [-900, 60, 0.5], [-1060, 20, 0.44], [800, 10, 0.42], [-380, 150, 0.62], [180, 170, 0.66]] },
];

const DownhillScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const riverFrom = atLine(scene, "a3_17_narrator");
  const steps = [secs(riverFrom, 0.35), secs(riverFrom, 2.09), secs(riverFrom, 3.89)];
  const dripX = S25_X0 + frame * 0.3;
  const dripY = stand("drip", S25_SURFACE + 70 * S25_SCALE);
  const focus = { x: dripX, y: S25_SURFACE - 60 };
  const cam = remasterCam(frame, {
    base: { ...focus, zoom: 1.75 },
    creep: { from: 0 },
    bursts: [
      { at: 0, delta: { dx: -16 }, frames: 10 },
      ...steps.map((at) => ({ at, delta: { zoom: 1 / 1.2, dy: -30 } })),
    ],
  });
  const emotion = useEmotion(scene, "drip", { a3_14_drip: "amazed", a3_16_drip: "excited", a3_18_drip: "happy" }, "happy");
  const dripS = project(cam, { x: dripX, y: midOf("drip", dripY, S25_SCALE) });
  const joined = S25_JOIN.flatMap((g, gi) => {
    const start = steps[g.at];
    return g.drops.map(([dx, dy, s], i) => {
      const u = smooth((frame - start - i * 6) / 50);
      return { x: dripX + dx - (1 - u) * 900, y: S25_SURFACE + dy - 14, s, o: (i + gi) % 3 === 0, show: u > 0 };
    });
  }).filter((d) => d.show);
  const grow = (i: number) => smooth((frame - steps[i] + 10) / 40);
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.valley.afterrain}
        cam={cam}
        bleed={0.35}
        hide={["near"]}
        horizons={{ far: 430, mid: 560 }}
        offsets={{ fg: 700 }}
        fg={<FgMound id="s25-fgl" side="left" reach={600} top={880} />}
        sky={<><Zenith color="#3f6aa8" mid="#86a6cf" reach={60} opacity={0.7} bleed={0.3} /><LightPool x={0} y={300} r={1000} color="#ffd284" opacity={0.4} /></>}
        mid={
          <>
            <Stream pts={[[-300, 560], [0, 600], [260, 650], [480, 720], [640, 800]]} w0={12} w1={44} grow={grow(0)} seed={161} />
            <Stream pts={[[2200, 540], [1900, 600], [1640, 660], [1440, 740], [1300, 800]]} w0={14} w1={52} grow={grow(1)} seed={171} />
          </>
        }
        stage={
          <>
            <Plate k="valley_near_river" y={horizonAt("valley_near_river", S25_SURFACE - 120, 0.35)} x={-frame * 0.6} bleed={0.35} />
            <ShadowPool x={dripX + 140} y={S25_SURFACE + 20} rx={260} ry={34} color="#2a4a7a" opacity={0.35} />
            <Ripples at={[[dripX - 200, S25_SURFACE + 40, 60], [dripX + 260, S25_SURFACE + 90, 80], [dripX - 520, S25_SURFACE + 130, 90], [dripX + 640, S25_SURFACE + 20, 70]]} />
            <FloatCrowd id="s25" drops={joined} litDir={-1} />
            <PaintedDrip id={scene.id} x={dripX} y={dripY} scale={S25_SCALE} emotion={emotion} speaking={useSpeaking(scene, "drip")}
              phase={PHASE.drip} idle={1.2} look={frame < atLine(scene, "a3_16_drip") ? "down" : "right"} />
            <Waterline x={dripX} surface={S25_SURFACE} w={212 * S25_SCALE} depth={70 * S25_SCALE} />
          </>
        }
      />
      <Bubbles
        scene={scene}
        cast={{ drip: { x: dripS.x, y: dripS.y, scale: S25_SCALE, who: "drip" } }}
        text={{ a3_14_drip: "Hey. Why am I moving?", a3_16_drip: "Downhill it is!", a3_18_drip: "Hi! Hi! Where are we going?" }}
        at={{
          a3_14_drip: { x: 1440, y: 230, tail: "left", tailAt: dripS.x + 60 },
          a3_16_drip: { x: 1440, y: 230, tail: "left", tailAt: dripS.x + 60 },
          a3_18_drip: { x: 1440, y: 230, tail: "left", tailAt: dripS.x + 60 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 26 — The flower: slurp; "my elbow"
// ---------------------------------------------------------------------------
// Plan: medium, horizon top third, LOW cam at water level (the flower
// towers), 0°. HOLD creep 1.00→1.02 / 6 s, no bursts. Key low left gold: the
// flower's long shadow crosses the water toward Drip. The bank (cut away, so
// the roots can be watched drinking) is on the LEFT — the head leans over
// upper-left of Drip, the bubble goes right.

const S26_SURFACE = 760;
const S26_SCALE = 1.08;
const S26_BANK = { x: 760, top: 600 };
const S26_ROOT = { x: 470, y: 960 };

const FlowerScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const slurpFrom = atLine(scene, "a3_20_narrator");
  const takeAt = secs(slurpFrom, 1.5);
  const slurpAt = secs(slurpFrom, 2.79);
  const travel = clamp01((frame - takeAt) / (slurpAt - takeAt));
  const drunk = clamp01((frame - slurpAt + 6) / 24);
  const dripX = interpolate(frame, [0, scene.durationInFrames], [1180, 1300], { extrapolateRight: "clamp" });
  const dripY = stand("drip", S26_SURFACE + 70 * S26_SCALE);
  const cam = remasterCam(frame, { base: { x: 960, y: 560 } });
  const emotion = useEmotion(scene, "drip", { a3_21_drip: "grumpy" }, "happy");
  const lostChip = frame >= takeAt ? 1 : 0;
  // The bit of him (mirror-space coordinates are handled by hand: screen x).
  const pieceX = lerp(dripX - 110, S26_ROOT.x + 60, travel);
  const pieceY = lerp(S26_SURFACE - 120, S26_ROOT.y - 80, travel) - Math.sin(travel * Math.PI) * 260;
  const dripS = project(cam, { x: dripX, y: midOf("drip", dripY, S26_SCALE) });
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.valley.late}
        cam={cam}
        hide={["near", "fg"]}
        horizons={{ far: 380, mid: 470 }}
        fg={<FgMound id="s26-fgr" side="right" reach={600} top={910} />}
        sky={<><Zenith color="#5a78b0" mid="#c0a890" reach={62} opacity={0.55} bleed={0.3} /><LightPool x={-60} y={520} r={1000} ry={600} color="#ffbe5c" opacity={0.45} /></>}
        stage={
          <>
            <Plate k="valley_near_river_late" y={horizonAt("valley_near_river_late", S26_SURFACE - 150)} x={-frame * 0.8} />
            {/* The daisy's long shadow across the water, reaching for Drip. */}
            <ShadowPool x={1000} y={S26_SURFACE + 30} rx={360} ry={46} color="#2f4c80" opacity={0.5} rotate={4} />
            <Ripples at={[[dripX + 230, S26_SURFACE + 50, 70], [dripX - 260, S26_SURFACE + 110, 80], [1650, S26_SURFACE + 20, 60]]} />
            <PaintedDrip id={scene.id} x={dripX} y={dripY} scale={S26_SCALE} emotion={emotion} speaking={useSpeaking(scene, "drip")}
              phase={PHASE.drip} idle={1} look={frame < takeAt ? "upLeft" : frame < slurpAt + 20 ? "left" : "camera"} />
            {lostChip ? (
              <Svg>
                {/* The missing chip on his elbow side: a painted notch of water colour + ink. */}
                <ellipse cx={dripX - 108 * S26_SCALE} cy={midOf("drip", dripY, S26_SCALE) + 30} rx={20} ry={16} fill={P.water.shadow} opacity={0.85} />
              </Svg>
            ) : null}
            <Waterline x={dripX} surface={S26_SURFACE} w={212 * S26_SCALE} depth={70 * S26_SCALE} />
            <Svg>
              <g transform={`translate(${WIDTH} 0) scale(-1 1)`}>
                <BankCutaway x={WIDTH - S26_BANK.x} top={S26_BANK.top} surface={S26_SURFACE} />
                <g transform={`translate(${WIDTH - S26_ROOT.x} ${S26_BANK.top}) scale(1.35) translate(${S26_ROOT.x - WIDTH} ${-S26_BANK.top})`}>
                  <Daisy x={WIDTH - S26_ROOT.x} top={S26_BANK.top} root={S26_BANK.top + (S26_ROOT.y - S26_BANK.top) / 1.35} drink={drunk} lean={0.2 + 0.3 * travel} />
                </g>
              </g>
            </Svg>
            {travel > 0 && travel < 1 ? (
              <Svg>
                <circle cx={pieceX} cy={pieceY} r={44} fill="#f0c75a" opacity={0.3} />
                <path d={`M ${pieceX} ${pieceY - 30} C ${pieceX + 8} ${pieceY - 18} ${pieceX + 20} ${pieceY - 6} ${pieceX + 20} ${pieceY + 8} A 20 20 0 0 1 ${pieceX - 20} ${pieceY + 8} C ${pieceX - 20} ${pieceY - 6} ${pieceX - 8} ${pieceY - 18} ${pieceX} ${pieceY - 30} Z`}
                  fill={P.water.base} stroke={P.water.line} strokeWidth={1.5} />
              </Svg>
            ) : null}
          </>
        }
      />
      <CaptionCard text="Slurp." from={slurpAt} until={slurpAt + 48} y={160} align="left" color={P.paper} />
      <Bubbles scene={scene} cast={{ drip: { x: dripS.x, y: dripS.y, scale: S26_SCALE, who: "drip" } }}
        text={{ a3_21_drip: "That was my ELBOW!" }}
        at={{ a3_21_drip: { x: 1520, y: 300, tail: "left", tailAt: dripS.x + 60 } }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 27 — The moose
// ---------------------------------------------------------------------------
// Plan: wide, horizon top third, LOW cam at water level, dutch 2° from the
// stomp. The moose plants on "walked in" (measured 1.2 s into a3_22) — BURST
// 14 px + roll to 2°; HOLD creep through a3_23–a3_25; BURST 14 px on the knee
// bounce just before the a3_24 bubble; FOLLOW Drip around the knee ~60 f on
// a3_27 (VO), rolling back to 0°. Backlit low key: the moose's shadow falls
// toward camera across the water and covers Drip (cooler inside it). The
// moose never moves once planted — stillness is the joke.

const S27_SURFACE = 850;
const S27_SCALE = 0.62;
const S27_KNEE = { x: 1112, y: 700 };
const MOOSE_T = { x: -150, y: -330, s: 1.25 };

const MooseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stompAt = secs(atLine(scene, "a3_22_narrator"), 1.2);
  const quoteFrom = atLine(scene, "a3_23_narrator");
  const quoteTo = afterLine(scene, "a3_23_narrator");
  const sirFrom = atLine(scene, "a3_24_drip");
  const aroundFrom = afterLine(scene, "a3_26_drip");
  const detourAt = atLine(scene, "a3_27_narrator");
  const bounceAt = sirFrom - 14;
  const slide = 1 - Easing.out(Easing.cubic)(clamp01(frame / Math.max(1, stompAt)));
  const mooseX = MOOSE_T.x + slide * 1100;
  const keys = [0, 50, bounceAt, bounceAt + 13, bounceAt + 30, aroundFrom - 10, detourAt + 30, detourAt + 70, scene.durationInFrames + 10];
  const dripX = interpolate(frame, keys, [-160, -160, S27_KNEE.x - 80, 930, 960, 960, 1260, 1560, 1900], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad),
  });
  const dripSurf = interpolate(frame, keys, [S27_SURFACE, S27_SURFACE, S27_SURFACE - 30, S27_SURFACE - 110, S27_SURFACE, S27_SURFACE, S27_SURFACE + 110, S27_SURFACE + 120, S27_SURFACE + 70], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad),
  });
  const cam = remasterCam(frame, {
    base: { x: 960, y: 540 },
    bursts: [
      { at: stompAt, delta: { rotate: 2, zoom: 1.03 } },
      { at: detourAt, delta: { rotate: -2, dx: -150 }, frames: 60 },
    ],
    deltas: [shake(frame, bounceAt, 14, 12, "x")],
  });
  const emotion = useEmotion(scene, "drip", { a3_24_drip: "grumpy", a3_26_drip: "grumpy" }, "happy");
  const shaded = dripX > 760 && dripX < 1500 && frame > bounceAt;
  // 0→1 as Drip enters the moose's shadow (edges eased over 90 px and 10 frames).
  const shadeAmt = clamp01((frame - bounceAt) / 10) * clamp01((dripX - 760) / 90) * clamp01((1500 - dripX) / 90);
  const dripY = stand("drip", dripSurf + 70 * S27_SCALE);
  const dripS = project(cam, { x: dripX, y: midOf("drip", dripY, S27_SCALE) });
  const family = Array.from({ length: 7 }, (_, i) => {
    const lag = 14 + i * 12;
    const f = Math.max(0, frame - lag);
    const x = interpolate(f, keys.slice(0, 3).concat([aroundFrom, detourAt + 40, detourAt + 90, scene.durationInFrames + 10]),
      [-300 - i * 70, -300 - i * 70, 1010 - i * 38, 1000 - i * 40, 1200 - i * 40, 1500 - i * 36, 1800 - i * 30], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad),
      });
    const y = interpolate(f, [0, detourAt + 10, detourAt + 60, scene.durationInFrames + 10],
      [S27_SURFACE + 30 + (i % 3) * 26, S27_SURFACE + 30 + (i % 3) * 26, S27_SURFACE + 150 + (i % 3) * 20, S27_SURFACE + 100], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    return { x, y, s: 0.5 + (i % 3) * 0.06, o: i % 3 === 0 };
  });
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.valley.late}
        cam={cam}
        bleed={0.3}
        hide={["near"]}
        horizons={{ far: 330, mid: 440 }}
        offsets={{ fg: 700 }}
        fg={<><FgMound id="s27-fgl" side="left" reach={520} top={900} /><FgMound id="s27-fgr" side="right" reach={360} top={960} seed={411} /></>}
        sky={<><Zenith color="#5a78b0" mid="#c0a890" reach={62} opacity={0.55} bleed={0.3} /><LightPool x={-80} y={560} r={1100} ry={620} color="#ffbe5c" opacity={0.5} /></>}
        stage={
          <>
            <Plate k="valley_near_river_late" y={horizonAt("valley_near_river_late", 520, 0.3)} x={-frame * 0.7} bleed={0.3} />
            {/* The moose's long backlit shadow, toward camera, across the water. */}
            {/* Polish A3-5: deeper, so it reads as the moose's shade over the water and over Drip inside it. */}
            <ShadowPool x={1240 + slide * 1100} y={S27_SURFACE + 60} rx={620} ry={170} color="#16244a" opacity={0.85 * (1 - slide)} rotate={6} />
            <Svg>
              <g transform={`translate(${mooseX} ${MOOSE_T.y}) scale(${MOOSE_T.s})`}>
                <PaintedMoose />
              </g>
            </Svg>
            {/* Water over the hooves: the legs stand IN the river; it parts round them. */}
            <Svg>
              <path d={`M -400 ${S27_SURFACE - 40} L ${WIDTH + 400} ${S27_SURFACE - 40} L ${WIDTH + 400} ${HEIGHT + 400} L -400 ${HEIGHT + 400} Z`} fill="#2c5f8e" opacity={0.5} />
            </Svg>
            <Ripples at={[0, 1, 2, 3].map((k) => [[1112, 1275, 1687, 1850][k] + slide * 1100, S27_SURFACE - 34, 50] as [number, number, number])} opacity={0.7} />
            <Splash x={1112} y={S27_SURFACE - 40} from={stompAt} s={1.2} />
            <FloatCrowd id="s27" drops={family} litDir={-1} />
            {/* Polish A3-5: inside the moose's shade Drip himself darkens and cools (the pool alone only shaded the water). */}
            <AbsoluteFill style={shadeAmt > 0.01 ? { filter: `brightness(${(1 - 0.3 * shadeAmt).toFixed(3)}) saturate(${(1 - 0.12 * shadeAmt).toFixed(3)}) hue-rotate(${(6 * shadeAmt).toFixed(2)}deg)` } : undefined}>
              <PaintedDrip id={scene.id} x={dripX} y={dripY} scale={S27_SCALE} emotion={emotion} speaking={useSpeaking(scene, "drip")}
                phase={PHASE.drip} idle={1} look={dripX < 1000 ? "upRight" : "right"} light={shaded ? inShade(scene.id) : undefined} />
            </AbsoluteFill>
            <Waterline x={dripX} surface={dripSurf} w={212 * S27_SCALE} depth={70 * S27_SCALE} />
            {shaded ? <ShadowPool x={dripX} y={midOf("drip", dripY, S27_SCALE)} rx={150} ry={150} color="#2a3a70" opacity={0.5} /> : null}
            <Bonk x={S27_KNEE.x - 40} y={S27_KNEE.y + 40} from={bounceAt} />
          </>
        }
      />
      <SpeechBubble x={1260} y={170} text="mmm. Nice water." tail="left" tailAt={900} maxWidth={460} from={secs(quoteFrom, 2.7)} until={quoteTo}
        background={P.paper} />
      <Bubbles
        scene={scene}
        cast={{ drip: { x: dripS.x, y: dripS.y, scale: S27_SCALE, who: "drip" } }}
        text={{ a3_24_drip: "SIR! That is my family!", a3_26_drip: "Fine. We go AROUND." }}
        at={{
          a3_24_drip: { x: 1480, y: 230, tail: "left", tailAt: dripS.x + 40 },
          a3_26_drip: { x: 1480, y: 230, tail: "left", tailAt: dripS.x + 40 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 28 — Everybody wants a bit: the montage (D12 Q4)
// ---------------------------------------------------------------------------
// Plan: five single vignette plates joined by 6 f dissolves, HOLD creep per
// insert, timed to a3_28's clauses (measured: fields 0.40 s, town 2.32 s,
// "taps" ~3.4 s, bath 4.11 s, teeth 5.21 s), no whips. One light: a low-left
// gold wash carried over every insert. Glowing drops lift out of each water
// source. Ends on the bathtub with Drip in it for a3_29.

type Shot = { k: PlateKey; at: number; label: string; src: Array<[number, number]>; drip?: boolean };

const S28_LABELS: Record<string, string> = {
  wants_channel: "a farmer's field",
  wants_tower: "the town's water tower",
  wants_kettle: "somebody's kettle",
  wants_bathtub: "somebody's bath",
  wants_tap: "somebody's tap",
};

// Polish A3-3: the re-rolled tub plate puts its water at screen y 527.
const S28_TUB = { x: 1010, surface: 530, scale: 0.5 };

const InsertShot: React.FC<{ shot: Shot; scene: TimedScene; opacity: number }> = ({ shot, scene, opacity }) => {
  const frame = useCurrentFrame();
  const z = remasterCam(frame, { creep: { from: shot.at } }).zoom ?? 1;
  const emotion = useEmotion(scene, "drip", { a3_29_drip: "excited" }, "happy");
  const talking = useSpeaking(scene, "drip");
  const t = frame - shot.at;
  const dripY = stand("drip", S28_TUB.surface + 80 * S28_TUB.scale);
  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${z * 1.06})`, transformOrigin: "50% 45%" }}>
        <Plate k={shot.k} />
        <AbsoluteFill style={{ background: "#2f4c80", mixBlendMode: "multiply", opacity: 0.12 }} />
        <LightPool x={-120} y={360} r={1200} ry={900} color="#ffbe5c" opacity={0.42} />
        <Svg>
          {shot.src.flatMap(([sx, sy], j) =>
            Array.from({ length: 4 }, (_, i) => {
              const k = ((t * 1.4 + i * 55 + j * 23) % 220) / 220;
              if (t < 0) return null;
              const x = sx + Math.sin(k * 6 + i) * 30 + (i - 1.5) * 40;
              const y = sy - k * 300;
              return (
                <g key={`${j}-${i}`} opacity={Math.sin(k * Math.PI) * 0.95}>
                  <circle cx={x} cy={y} r={30} fill="#ffd27a" opacity={0.35} />
                  <path d={`M ${x} ${y - 20} C ${x + 6} ${y - 12} ${x + 14} ${y - 4} ${x + 14} ${y + 5} A 14 14 0 0 1 ${x - 14} ${y + 5} C ${x - 14} ${y - 4} ${x - 6} ${y - 12} ${x} ${y - 20} Z`}
                    fill={P.water.light} />
                </g>
              );
            }),
          )}
        </Svg>
        {shot.drip ? (
          <>
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${HEIGHT - S28_TUB.surface - 4}px 0)` }}>
              <PaintedDrip id={scene.id} x={S28_TUB.x} y={dripY} scale={S28_TUB.scale} emotion={emotion} speaking={talking} phase={PHASE.drip}
                idle={1.2} look="left" pose="cheer" />
            </div>
            <Waterline x={S28_TUB.x} surface={S28_TUB.surface} w={212 * S28_TUB.scale} depth={4} tint="#9fc6d8" opacity={0.0} />
            <Svg>
              <RubberDuck id={`s28-duck-${shot.at}`} x={1460} y={S28_TUB.surface + 8} s={0.8} bob={frame} />
            </Svg>
          </>
        ) : null}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: kidTheme.fontFamily }}>
        <span style={{ background: P.paper, color: P.ink, borderRadius: 999, padding: "8px 34px", fontSize: kidType.label, fontWeight: 900, letterSpacing: 3 }}>
          {S28_LABELS[shot.k]}
        </span>
      </div>
    </AbsoluteFill>
  );
};

const EverybodyScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const list = atLine(scene, "a3_28_narrator");
  const popular = atLine(scene, "a3_29_drip");
  const shots: Shot[] = [
    { k: "wants_channel", at: 0, label: "", src: [[960, 930]] },
    { k: "wants_tower", at: secs(list, 2.25), label: "", src: [[960, 420]] },
    { k: "wants_kettle", at: secs(list, 3.35), label: "", src: [[1010, 460]] },
    { k: "wants_bathtub", at: secs(list, 4.05), label: "", src: [[760, 520]], drip: true },
    { k: "wants_tap", at: secs(list, 5.15), label: "", src: [[1200, 790]] },
    { k: "wants_bathtub", at: popular - 10, label: "", src: [[760, 520]], drip: true },
  ];
  const DIS = 6;
  let cur = 0;
  for (let i = 0; i < shots.length; i++) if (frame >= shots[i].at) cur = i;
  const u = cur > 0 ? clamp01((frame - shots[cur].at) / DIS) : 1;
  return (
    <AbsoluteFill style={{ background: "#3a3040" }}>
      {cur > 0 && u < 1 ? <InsertShot shot={shots[cur - 1]} scene={scene} opacity={1} /> : null}
      <InsertShot key={cur} shot={shots[cur]} scene={scene} opacity={u} />
      <Bubbles
        scene={scene}
        cast={{ drip: { x: S28_TUB.x, y: stand("drip", S28_TUB.surface), scale: S28_TUB.scale, who: "drip" } }}
        text={{ a3_29_drip: "Everybody wants a bit!" }}
        at={{ a3_29_drip: { x: 640, y: 210, tail: "right", tailAt: S28_TUB.x - 120 } }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 29 — Home, and Big Word Four: COLLECTION
// ---------------------------------------------------------------------------
// Plan: wide, high cam, horizon upper third. HOLD creep behind the near
// headland rock (1.3); ONE BURST pan 26 px on "turned a corner" (measured
// 1.2 s into a3_30, VO) — the rock slides off and the sea opens; HOLD creep
// through "wide, blue, salty, enormous"; PUSH 1.00→1.06 over 24 f to the slam
// ("…that is collection.", 5.2 s into a3_32); CutFlash; out of the freeze on a
// flash for the sibling mob (a3_33), who fill the lower half.

/** Polish A3-4: the sunset FgMound family — violet bank a step above a near-black core. */
const DUSK_BANK = { base: "#33263e", shadow: "#1c1424", light: "#7a5266", line: "#0a0810" };
const DUSK_CORE = { base: "#1a1420", shadow: "#0e0b14", light: "#2a2030", line: "#0a0810" };
const S29_SCALE = 0.82;

function s29Pose(scene: TimedScene, frame: number) {
  const panAt = secs(atLine(scene, "a3_30_narrator"), 1.15);
  const slam = secs(atLine(scene, "a3_32_narrator"), 5.2);
  const f = Math.min(frame, slam);
  const pan = burst(f, panAt, { dx: -320, dy: 40 }, 14);
  const panU = clamp01(-(pan.dx ?? 0) / 320);
  const base = remasterCam(Math.min(f, slam - 24), { base: { x: 960, y: 540 } });
  const cam = withCam({ ...base, dx: (base.dx ?? 0) + (pan.dx ?? 0), dy: (base.dy ?? 0) + (pan.dy ?? 0) }, bigWordPush(f, slam));
  const dripX = 1480 - 380 * smooth((f - panAt + 4) / 70);
  return { panAt, slam, cam, panU, dripX };
}

const S29_SURF = 820;

const HomeWorld: React.FC<{ scene: TimedScene; mob?: number }> = ({ scene, mob = -1 }) => {
  const frame = useCurrentFrame();
  const { cam, panU, dripX } = s29Pose(scene, frame);
  const mobU = mob >= 0 ? smooth((frame - mob) / 34) : 0;
  const sibs = Array.from({ length: 16 }, (_, i) => {
    const side = i % 2 ? 1 : -1;
    const row = Math.floor(i / 4);
    const tx = dripX + side * (170 + (i % 4) * 170 + row * 60);
    const ty = S29_SURF + 30 + row * 85;
    return { x: tx + side * (1 - mobU) * 1300, y: ty, s: 0.62 + row * 0.1, o: i % 3 === 0 };
  });
  return (
    <SetStack
      set={SETS.home.sunset}
      cam={cam}
      bleed={0.3}
      hide={["far", "fg"]}
      horizons={{ mid: 400, near: 960 }}
      sky={<LightPool x={-100} y={420} r={1100} ry={600} color="#ff9a50" opacity={0.4} />}
      far={<MirroredPlate k="home_far_headland" y={horizonAt("home_far_headland", 300, 0.3)} bleed={0.3} />}
      stage={
        <>
          <Ripples at={[[dripX - 260, S29_SURF + 40, 70], [dripX + 300, S29_SURF + 30, 80], [1700, S29_SURF - 120, 70], [500, S29_SURF - 80, 60]]} />
          <LightPool x={dripX} y={S29_SURF} r={500} ry={160} color="#ff9a50" opacity={0.25} />
          {mob >= 0 ? <FloatCrowd id="s29" drops={sibs} litDir={-1} /> : null}
        </>
      }
      fg={
        <>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${416 * panU}px)` }}>
          <FgMound id="s29-fgr" side="right" reach={650} top={850} blades={false} v={DUSK_BANK} core={DUSK_CORE} />
          </div>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${-1500 * panU}px)` }}>
            <Plate k="home_fg_rock" bleed={0.3} x={-220} />
          </div>
        </>
      }
    />
  );
};

const HomeScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { slam, cam, dripX } = s29Pose(scene, frame);
  const mobAt = atLine(scene, "a3_33_drip") - 16;
  const emotion = useEmotion(scene, "drip", { a3_31_drip: "amazed", a3_32b_drip: "proud", a3_33_drip: "excited" }, "happy");
  const talking = useSpeaking(scene, "drip");
  const dripY = stand("drip", S29_SURF + 70 * S29_SCALE);
  const mid = { x: dripX, y: midOf("drip", dripY, S29_SCALE) };
  const at = project(cam, mid);
  const z = cam.zoom ?? 1;
  const surfS = project(cam, { x: dripX, y: S29_SURF });
  const rider = (
    <>
      <PaintedDrip id={scene.id} x={at.x} y={at.y} scale={S29_SCALE * z} emotion={emotion} speaking={talking} phase={PHASE.drip} idle={1.2}
        look={frame > mobAt ? "camera" : "right"} />
      <Waterline x={at.x} surface={surfS.y} w={212 * S29_SCALE * z} depth={70 * S29_SCALE * z} tint="#3a3a7a" />
    </>
  );
  return (
    <AbsoluteFill>
      {frame < mobAt ? (
        <BigWordBeat
          scene={scene}
          word="COLLECTION"
          syllables={["Coll", "ECK", "shun"]}
          beats={[0.1, 0.2, 0.3]}
          chantKey="a3_32b_drip"
          slamAt={slam}
          color={ACT_COLOR.collection}
          sub="the gathering-up part"
          y={296}
          freeze={<HomeWorld scene={scene} />}
        >
          {rider}
        </BigWordBeat>
      ) : (
        <>
          <HomeWorld scene={scene} mob={mobAt} />
          {rider}
          <CutFlash at={mobAt} strength={0.6} />
        </>
      )}
      <Bubbles
        scene={scene}
        cast={{ drip: { x: at.x, y: at.y, scale: S29_SCALE, who: "drip" } }}
        text={{ a3_31_drip: "I know this place.", a3_33_drip: "Hi Drop! I am BACK!" }}
        at={{
          a3_31_drip: { x: 1420, y: 230, tail: "left", tailAt: at.x + 60 },
          a3_33_drip: { x: 1420, y: 230, tail: "left", tailAt: at.x + 60 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 30 — The twist: the journey redraws on the map and snaps into a ring
// ---------------------------------------------------------------------------
// Plan: medium on Drip → wide map. HOLD creep on Drip for "Wait. Wait a
// minute." (measured to 1.41 s); DISSOLVE 8 f to the map plate; HOLD creep
// while the line draws on "UP / across the sky / down a mountain" and a3_35;
// BURST 14 px on the snap ("It is a circle", 4.0 s into a3_36, VO); HOLD.

const RING = { cx: 1130, cy: 450, r: 280 };
const S30_INSET = { x: 300, y: 700, scale: 0.78 };

const TwistScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const upFrom = atLine(scene, "a3_34_drip");
  const homeFrom = atLine(scene, "a3_35_drip");
  const homeTo = afterLine(scene, "a3_35_drip");
  const mapAt = secs(upFrom, 1.45);
  const snapAt = secs(atLine(scene, "a3_36_narrator"), 4.0);
  const mapU = clamp01((frame - mapAt) / 8);
  const progress = frame >= snapAt
    ? 1
    : interpolate(frame, [secs(upFrom, 1.75), secs(upFrom, 2.3), secs(upFrom, 3.8), secs(upFrom, 5.1), homeFrom, homeTo - 10], [0, 0.12, 0.38, 0.62, 0.62, 0.965], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
  const pulse = frame >= snapAt ? Math.max(0, 1 - (frame - snapAt) / 26) : 0;
  const mapped = useEmotion(scene, "drip", { a3_34_drip: "skeptical", a3_35_drip: "excited", a3_37_drip: "excited" }, "happy");
  const emotion: EmotionInput = frame >= snapAt - 4 && frame < atLine(scene, "a3_37_drip") ? "amazed" : mapped;
  const talking = useSpeaking(scene, "drip");
  const camA = remasterCam(frame);
  const camB = remasterCam(frame, { creep: { from: mapAt }, deltas: [shake(frame, snapAt, 14)] });
  const z = camB.zoom ?? 1;
  const ringS = project(camB, { x: RING.cx, y: RING.cy });
  const dripA = { x: S30_INSET.x + 20, y: S30_INSET.y - 20 };
  const insetMid = { x: S30_INSET.x, y: S30_INSET.y };
  return (
    <AbsoluteFill>
      {mapU < 1 ? (
        <SetStack
          set={SETS.home.sunset}
          cam={camA}
          hide={["far", "fg"]}
          horizons={{ mid: 640, near: 1000 }}
          sky={<LightPool x={-100} y={420} r={1100} ry={600} color="#ff9a50" opacity={0.4} />}
          far={<MirroredPlate k="home_far_headland" y={horizonAt("home_far_headland", 420)} />}
          stage={
            <>
              <PaintedDrip id={scene.id} boilKey="drip-s30a" x={dripA.x} y={dripA.y} scale={1.0} emotion={emotion} speaking={talking} phase={PHASE.drip}
                idle={0.8} look="upRight" />
              <Waterline x={dripA.x} surface={dripA.y + 70} w={212} depth={70} tint="#3a3a7a" />
            </>
          }
        />
      ) : null}
      {mapU > 0 ? (
        <AbsoluteFill style={{ opacity: mapU }}>
          <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 45%" }}>
            <Plate k="map_paper" />
            <AbsoluteFill style={{ background: "#c06a50", mixBlendMode: "multiply", opacity: 0.5 }} />
            <AbsoluteFill style={{ background: "#4a2f6a", mixBlendMode: "multiply", opacity: 0.25 }} />
            <LightPool x={-100} y={500} r={1300} ry={900} color="#ffb070" opacity={0.35} />
            <LightPool x={RING.cx} y={RING.cy} r={520} color="#ffd28a" opacity={0.25 + 0.4 * pulse} />
          </AbsoluteFill>
          <PaintedRing cx={ringS.x} cy={ringS.y} r={RING.r * z} progress={progress} glow={pulse} />
          <LightPool x={insetMid.x} y={insetMid.y} r={300} color="#ffb070" opacity={0.35} />
          <PaintedDrip id={scene.id} x={S30_INSET.x} y={S30_INSET.y} scale={S30_INSET.scale} emotion={emotion} speaking={talking} phase={PHASE.drip}
            idle={1.1} look={frame >= snapAt ? "camera" : "upRight"} pose={frame >= atLine(scene, "a3_37_drip") ? "cheer" : undefined} />
        </AbsoluteFill>
      ) : null}
      {frame >= snapAt ? <CutFlash at={snapAt} strength={0.4} /> : null}
      <Bubbles
        scene={scene}
        cast={{ drip: { x: S30_INSET.x, y: S30_INSET.y, scale: S30_INSET.scale, who: "drip" } }}
        text={{ a3_34_drip: "Up. Across. Down.", a3_35_drip: "I ended where I started!", a3_37_drip: "A CYCLE! THE WATER CYCLE!" }}
        at={{
          a3_34_drip: { x: 780, y: 800, tail: "left", tailAt: S30_INSET.x + 70 },
          a3_35_drip: { x: 780, y: 800, tail: "left", tailAt: S30_INSET.x + 70 },
          a3_37_drip: { x: 780, y: 800, tail: "left", tailAt: S30_INSET.x + 70 },
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 31 — Credit where it is due
// ---------------------------------------------------------------------------
// Plan: wide, no horizon (the ring on the sunset sky), 0°. HOLD creep; Sunny
// slides in from camera-LEFT at full brightness (his move — the sun-side
// switch made visible); his beams drive the ring, which starts turning on
// "it never stops" (a3_40, ~0.36 s). Bloom masked to the disc.

const S31_SUN = { x: 470, y: 470, scale: 1.15 };
const S31_RING = { cx: 1240, cy: 600, r: 270 };

const CreditScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rightFrom = atLine(scene, "a3_39_narrator");
  const stopsAt = secs(atLine(scene, "a3_40_narrator"), 0.4);
  const slide = Easing.out(Easing.cubic)(clamp01(frame / 26));
  const sunX = lerp(-420, S31_SUN.x, slide);
  const f = Math.max(0, frame - stopsAt);
  const RAMP = 50;
  const spin = f < RAMP ? (0.7 * f * f) / (2 * RAMP) : 0.7 * (f - RAMP / 2);
  const cam = remasterCam(frame);
  const sunMid = { x: sunX, y: midOf("sunny", S31_SUN.y, S31_SUN.scale) };
  const sunS = project(cam, sunMid);
  const ringS = project(cam, { x: S31_RING.cx, y: S31_RING.cy });
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.home.sunset}
        cam={cam}
        bleed={0.3}
        hide={["far", "mid", "near", "fg"]}
        offsets={{ sky: 250 }}
        sky={<><Zenith color="#3a2a6a" mid="#8a5a8a" reach={55} opacity={0.5} bleed={0.3} /><LightPool x={sunMid.x} y={sunMid.y} r={1000} color="#ff9a50" opacity={0.3 + 0.2 * slide} /></>}
        stage={
          <>
            <LightPool x={S31_RING.cx} y={S31_RING.cy} r={460} color="#ffc070" opacity={0.3 * slide} />
            <BeamsTo x={sunMid.x + 80} y={sunMid.y} tx={S31_RING.cx - S31_RING.r * 0.6} ty={S31_RING.cy} spread={S31_RING.r * 1.6} strength={slide} />
            <PaintedRing cx={S31_RING.cx} cy={S31_RING.cy} r={S31_RING.r} progress={1} spin={spin} glow={0.2} />
            <PaintedSunny id={scene.id} x={sunX} y={S31_SUN.y} scale={S31_SUN.scale} emotion="proud" speaking={useSpeaking(scene, "sunny")}
              phase={PHASE.sunny} shades={0} raySpeed={0.4} look={{ x: 0.6, y: 0.2 }} />
          </>
        }
      />
      <KeyBloom x={sunS.x} y={sunS.y} r={360} color="#ffd890" opacity={0.3 * slide} />
      <Bubbles
        scene={scene}
        cast={{ sunny: { x: sunX, y: S31_SUN.y, scale: S31_SUN.scale, who: "sunny" } }}
        text={{ a3_38_sunny: "I POWER THE WHOLE THING!" }}
        at={{ a3_38_sunny: { x: 1300, y: 180, tail: "left", tailAt: Math.max(sunS.x + 200, ringS.x - 400) } }}
      />
      <CaptionCard text="annoyingly, he is right" from={rightFrom + 26} until={rightFrom + 104} y={982} color={P.paper} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 32 — Round again
// ---------------------------------------------------------------------------
// Plan: medium, horizon low third, eye, 0°. HOLD creep; Drip hops on the
// surface, Sunny (upper-left, the key) leans in for the magic words; Drip
// rises mid-"You're welcome?" (45%) and out of the top of frame — his move,
// camera still. The ground shadow detaches again (s09's rule: ×0.5 at 200 px).

const S32_SURFACE = 870;
const S32_DRIP = { x: 1240, scale: 1.0 };

const RoundAgainScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const readyTo = afterLine(scene, "a3_41_drip");
  const magicFrom = atLine(scene, "a3_42_sunny");
  const welcomeFrom = atLine(scene, "a3_43_drip");
  const riseAt = secs(welcomeFrom, 0.42);
  const hop = Math.abs(Math.sin(frame / 7)) * (frame < readyTo ? 70 : 30) * (frame < riseAt ? 1 : 0);
  const rise = interpolate(frame, [riseAt, scene.durationInFrames + 8], [0, 900], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad),
  });
  const lean = smooth((frame - (magicFrom - 20)) / 46);
  const sunX = lerp(360, 520, lean);
  const sunY = lerp(330, 400, lean);
  const sunScale = lerp(0.8, 0.98, lean);
  const warmth = interpolate(frame, [riseAt - 40, scene.durationInFrames], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dripY = stand("drip", S32_SURFACE) - hop - rise;
  const dripMid = { x: S32_DRIP.x, y: midOf("drip", dripY, S32_DRIP.scale) };
  const sunMid = { x: sunX, y: midOf("sunny", sunY, sunScale) };
  const cam = remasterCam(frame);
  const dripS = project(cam, dripMid);
  const sunS = project(cam, sunMid);
  const emotion = useEmotion(scene, "drip", { a3_41_drip: "excited", a3_43_drip: "skeptical" }, "excited");
  return (
    <AbsoluteFill>
      <SetStack
        set={SETS.home.sunset}
        cam={cam}
        hide={["far", "fg"]}
        horizons={{ mid: 700, near: 990 }}
        sky={
          <>
            <Zenith color="#3a2a6a" mid="#8a5a8a" reach={50} opacity={0.45} bleed={0.3} />
            <LightPool x={sunMid.x} y={sunMid.y} r={900} color="#ff9a50" opacity={0.35 + 0.25 * warmth} />
            <PaintedSunny id={scene.id} x={sunX} y={sunY} scale={sunScale} emotion="proud" speaking={useSpeaking(scene, "sunny")} phase={PHASE.sunny}
              shades={1 - lean} look={lookAt(sunMid, dripMid, 1200)} />
          </>
        }
        far={<MirroredPlate k="home_far_headland" y={horizonAt("home_far_headland", 590)} />}
        fg={<><FgMound id="s32-fgl" side="left" reach={540} top={930} blades={false} v={DUSK_BANK} core={DUSK_CORE} /><FgMound id="s32-fgr" side="right" reach={440} top={960} blades={false} v={DUSK_BANK} core={DUSK_CORE} seed={421} /></>}
        stage={
          <>
            <LightPool x={S32_DRIP.x - 200} y={S32_SURFACE} r={800} ry={160} color="#ffb070" opacity={0.2 + 0.25 * warmth} />
            <Svg>
              <SteamWisps x={380} y={S32_SURFACE + 40} count={3} scale={1.1} />
              <SteamWisps x={1560} y={S32_SURFACE + 60} count={3} scale={1} phase={0.5} />
            </Svg>
            {rise > 4 ? (
              <Crowd id="s32" bob={2} litDir={-1}
                rows={[0, 1, 2, 3].map((r) => ({ y: 980 + r * 160, s: 0.36 + (r % 3) * 0.1, count: 7, spread: 2400, x: 960 + (r % 2) * 120 }))}
                rise={(f, i) => Math.max(0, f - riseAt - (i % 7) * 8) * (2.4 + (i % 4) * 0.3)} />
            ) : null}
            <PaintedDrip id={scene.id} x={S32_DRIP.x} y={dripY} scale={S32_DRIP.scale} emotion={emotion} speaking={useSpeaking(scene, "drip")}
              phase={PHASE.drip} idle={1.7} pose={frame < riseAt ? "cheer" : undefined} look={lookAt(dripMid, sunMid, 1200)}
              light={keyAt(scene.id, dripMid, sunMid)} groundY={S32_SURFACE} altitude={hop + rise} groundLum={0.3} />
          </>
        }
      />
      <KeyBloom x={sunS.x} y={sunS.y} r={300} color="#ffd890" opacity={0.25 + 0.15 * warmth} />
      <Bubbles
        scene={scene}
        cast={{ drip: { x: S32_DRIP.x, y: dripY, scale: S32_DRIP.scale, who: "drip" }, sunny: { x: sunX, y: sunY, scale: sunScale, who: "sunny" } }}
        text={{ a3_41_drip: "Sunny! Warm me up!", a3_42_sunny: "Say the magic words.", a3_43_drip: "You're welcome?", a3_44_sunny: "HA! HA! Good drop." }}
        at={{
          a3_41_drip: { x: 1520, y: 300, tail: "left", tailAt: dripS.x + 60 },
          a3_43_drip: { x: 1520, y: 300, tail: "left", tailAt: dripS.x + 60 },
          a3_42_sunny: { x: 760, y: 200, tail: "left", tailAt: sunS.x + 240 },
          a3_44_sunny: { x: 760, y: 200, tail: "left", tailAt: sunS.x + 240 },
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
