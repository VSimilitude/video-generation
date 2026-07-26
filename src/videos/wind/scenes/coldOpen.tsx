import React from "react";
import { kidEase, kidRadius, kidShadow, kidTheme, kidType, moveAlong, settleWave } from "../../../lib/kid";
import {
  AbsoluteFill,
  Camera,
  Hill,
  Kite,
  hillY,
  KiteString,
  KidSilhouette,
  SkyBlend,
  heldBeat,
  interpolate,
  kidHand,
  lineWindow,
  spring,
  stand,
  useCurrentFrame,
  useVideoConfig,
  type KidPose,
  type TimedScene,
} from "./common";

// COLD OPEN — Scenes 1 and 2 of script.md. The problem, and the promise.
//
// Thirty seconds with no hero in them: a hill, a kid, a kite that will not fly,
// and a title. The whole point of the act is an *absence*, so almost nothing on
// screen moves — `wind={0}` everywhere, no drifting clouds, no idle sway. That
// is the one staging note the script gives twice ("perfectly, unnaturally
// still"), and it is also what makes the ending work: Scene 31 is this frame
// again with one thing changed.

/**
 * The geography, exported because **Act Three, Scene 31 must reuse it exactly**
 * — same angle, same crest, same marks. The frame story closes by the audience
 * recognising a picture, so the two scenes share numbers rather than eyeballs.
 */
export const HILL_MARKS = {
  crest: 640,
  /** Where the kid starts, before the run. */
  kidStartX: 1180,
  /** Where the kid ends up, and where Scene 31 finds them. */
  kidX: 780,
  kidScale: 0.85,
  /** Where the kite comes to rest, and stays for the rest of the episode. */
  kiteRest: { x: 1064, y: 612 },
  kiteScale: 0.6,
  /** The kite lying flat: nearly on its side, squashed towards the ground. */
  kiteRestRot: 96,
} as const;

/** The kid's `y` prop for a given x — feet on the drawn hill, not near it. */
const kidYAt = (x: number): number => stand("kid", hillY(x, HILL_MARKS.crest));

// ---------------------------------------------------------------------------
// Scene 1 — A hill, a kid, a kite, and no wind at all
// ---------------------------------------------------------------------------

/**
 * The flop, in the 60 frames the script bought for it.
 *
 * Every number below is an offset into that held beat rather than a scene
 * frame, so the whole gag moves with the beat if the gap in Video.tsx ever
 * changes — and if the beat were shortened, the phases would compress rather
 * than the flop running past the end of the silence.
 */
const RUN = { start: 0.03, end: 0.5 } as const;
const KITE = { launch: 0.07, apex: 0.44, hang: 0.63, land: 0.9 } as const;

const HillScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The two held beats, read off the timeline rather than hard-coded.
  const [flopFrom, flopTo] = heldBeat(scene, "co_04_narrator");
  const [slumpFrom] = heldBeat(scene, "co_05_narrator");
  const span = Math.max(1, flopTo - flopFrom);
  const u = (frame - flopFrom) / span;

  // --- the kid.
  const runU = kidEase.easeInOutSine((u - RUN.start) / (RUN.end - RUN.start));
  const kidX = HILL_MARKS.kidStartX + (HILL_MARKS.kidX - HILL_MARKS.kidStartX) * runU;
  const running = u > RUN.start && u < RUN.end ? Math.sin(Math.min(1, Math.max(0, (u - RUN.start) / (RUN.end - RUN.start))) * Math.PI) : 0;
  // The shoulders drop *once*, well inside the second beat, and stay down.
  const slump = kidEase.easeOutQuad((frame - slumpFrom - 10) / 12);
  const pose: KidPose = { run: running, slump };

  // --- the kite. Up on an arc, a hang, then gravity.
  const kite = kiteFlight(u, kidX);
  const landedAt = flopFrom + KITE.land * span;
  const since = frame - landedAt;
  // The flump: one hard compression on the frame it hits, ringing out. No
  // music sting anywhere near it — the script is explicit that the flump is
  // the only sound, so the picture has to carry the whole landing.
  const flump = since >= 0 ? settleWave(since / (fps * 0.8), 1.6, 5) : 0;

  const kidY = kidYAt(kidX);
  const hand = kidHand(kidX, kidY, HILL_MARKS.kidScale, pose);

  // A very slow push in. The frame is otherwise motionless for eighteen
  // seconds; without this the cold open reads as a photograph with a voice
  // over it rather than as a shot that is waiting for something.
  const zoom = interpolate(frame, [0, scene.durationInFrames], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* No clouds. A flat blue sky, exactly as written — and nothing in the
          backdrop that drifts, because drifting clouds are wind. */}
      <SkyBlend from="day" to="day" u={0} clouds={0} />
      <Camera cam={{ x: 1000, y: 620, zoom }}>
        <Hill wind={0} crest={HILL_MARKS.crest} />
        <KiteString
          from={hand}
          to={{ x: kite.x, y: kite.y }}
          slack={kite.slack}
        />
        <KidSilhouette
          x={kidX}
          y={kidY}
          scale={HILL_MARKS.kidScale}
          flip
          {...pose}
        />
        <Kite
          x={kite.x}
          y={kite.y + Math.max(0, flump) * 6}
          scale={HILL_MARKS.kiteScale * (1 + flump * 0.14)}
          rot={kite.rot}
          flat={kite.down}
          life={kite.down ? 0 : kite.life}
        />
      </Camera>
    </AbsoluteFill>
  );
};

/**
 * Where the kite is at `u` (0..1 through the held beat), and how it is lying.
 *
 * Four phases, and the shape of each one is the joke: it *climbs* on an arc
 * (hope), it *hangs* almost still (the pause that makes the audience think it
 * might be about to work), and then it comes down under `gravity` rather than
 * on an ease — a kite that eased to the ground would look like it was landing
 * on purpose.
 */
function kiteFlight(
  u: number,
  kidX: number,
): { x: number; y: number; rot: number; slack: number; life: number; down: boolean } {
  // Held at the kid's chest, and lifting to about the height of their
  // shoulder — which is barely higher, and is the point.
  const held = { x: HILL_MARKS.kidStartX + 150, y: 520 };
  const apex = { x: 1000, y: 366 };
  const rest = HILL_MARKS.kiteRest;

  if (u < KITE.launch) {
    // Held up hopefully. It does not move, because nothing does.
    return { x: held.x, y: held.y, rot: 22, slack: 0.1, life: 0.25, down: false };
  }
  if (u < KITE.apex) {
    const t = (u - KITE.launch) / (KITE.apex - KITE.launch);
    // Trailing behind and up: the bow of the arc is what "lifts" means.
    const p = moveAlong(held, apex, t, { arc: 0.26, bias: 0.85, ease: kidEase.easeOutQuad });
    return { x: p.x, y: p.y, rot: 22 - t * 34, slack: 0.06, life: 1, down: false };
  }
  if (u < KITE.hang) {
    // The hang. It is not still — it sags a couple of pixels, which is worse
    // than still, because it reads as a thing losing.
    const t = (u - KITE.apex) / (KITE.hang - KITE.apex);
    return {
      x: apex.x + t * 12,
      y: apex.y + kidEase.easeInQuad(t) * 18,
      rot: -12 + t * 10,
      slack: 0.06 + t * 0.2,
      life: 0.7 - t * 0.5,
      down: false,
    };
  }
  const t = Math.min(1, (u - KITE.hang) / (KITE.land - KITE.hang));
  const g = kidEase.gravity(t);
  const from = { x: apex.x + 12, y: apex.y + 18 };
  return {
    x: from.x + (rest.x - from.x) * kidEase.easeOutSine(t),
    y: from.y + (rest.y - from.y) * g,
    rot: -2 + HILL_MARKS.kiteRestRot * kidEase.easeInQuad(t),
    slack: 0.26 + 0.74 * t,
    life: 0.4 * (1 - t),
    down: t >= 1,
  };
}

// ---------------------------------------------------------------------------
// Scene 2 — Title, over a still hill
// ---------------------------------------------------------------------------

const TITLE: Array<{ text: string; size: number }> = [
  { text: "PUFF", size: 178 },
  { text: "AND THE KITE", size: 86 },
  { text: "THAT WOULDN'T FLY", size: 86 },
];

const TitleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [, missingTo] = lineWindow(scene, "co_07_narrator");

  // Pull back off the hill. The kite has to stay in shot at the bottom of the
  // frame for the whole card, so the pull-out is anchored low.
  const zoom = interpolate(frame, [0, 46], [1.06, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  const pill = spring({ frame: frame - missingTo + 20, fps, config: { damping: 12, mass: 0.6 } });

  return (
    <AbsoluteFill>
      <SkyBlend from="day" to="day" u={0} clouds={0} />
      {/* Pushed down as well as out: the title needs the top two thirds, and
          the kite has to stay in shot at the bottom for the whole card. */}
      <Camera cam={{ x: 960, y: 900, zoom, dy: 190 }}>
        <Hill wind={0} crest={HILL_MARKS.crest} />
        <KidSilhouette
          x={HILL_MARKS.kidX}
          y={kidYAt(HILL_MARKS.kidX)}
          scale={HILL_MARKS.kidScale}
          flip
          slump={1}
        />
        <Kite
          {...HILL_MARKS.kiteRest}
          scale={HILL_MARKS.kiteScale}
          rot={HILL_MARKS.kiteRestRot}
          flat
          life={0}
        />
      </Camera>
      <BlownTitle from={8} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 512,
          textAlign: "center",
          fontFamily: kidTheme.fontFamily,
          opacity: Math.max(0, Math.min(1, pill * 1.4)),
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
            transform: `scale(${pill})`,
          }}
        >
          LITTLE BIG WORLD · EPISODE TWO
        </span>
      </div>
    </AbsoluteFill>
  );
};

/**
 * The title, arriving on a wind we cannot see — and then stopping dead.
 *
 * Each letter blows in from off frame right, overshoots and rings down on
 * `settleWave`. The ring is the whole idea: the damping is fast enough that
 * every letter is *exactly* motionless within a second, because there is no
 * wind here yet and a title that keeps bobbing would say there was.
 */
const BlownTitle: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 236,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        transform: "translateY(-50%)",
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      {TITLE.map((line, li) => (
        <div key={line.text} style={{ display: "flex", alignItems: "flex-end" }}>
          {line.text.split("").map((ch, i) => {
            // Letters arrive right-to-left, which is the direction the wind
            // that brought them was going.
            const order = line.text.length - 1 - i;
            const at = from + li * 12 + order * 2.2;
            const f = frame - at;
            const inU = kidEase.easeOutCubic(f / 12);
            const ring = settleWave(f / (fps * 0.85), 1.7, 5.4);
            if (ch === " ") return <span key={`sp-${i}`} style={{ width: line.size * 0.3 }} />;
            return (
              <span
                key={`${ch}-${i}`}
                style={{
                  display: "inline-block",
                  fontSize: line.size,
                  fontWeight: 900,
                  lineHeight: 1.04,
                  color: kidTheme.paper,
                  WebkitTextStroke: `${Math.round(line.size * 0.055)}px ${kidTheme.ink}`,
                  paintOrder: "stroke",
                  textShadow: `0 ${Math.round(line.size * 0.05)}px 0 rgba(36,52,71,0.35)`,
                  transform: `translate(${(1 - inU) * 760 + ring * 14}px, ${ring * -9}px) rotate(${(1 - inU) * 16 + ring * 5}deg)`,
                  opacity: Math.max(0, Math.min(1, f / 3)),
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const COLD_OPEN_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s01_hill: HillScene,
  s02_title: TitleScene,
};
