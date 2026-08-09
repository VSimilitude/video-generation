import React from "react";
import { Img, staticFile } from "remotion";
// The only thing this act needs from the kit that `common.tsx` does not
// re-export: the volcano's own geometry, so the steam curl in Scene 13 can be
// anchored to the summit by arithmetic rather than by a typed-in 108.
import { VOLCANO_SHAPE } from "../../../lib/kid";
import { BACKGROUNDS } from "../backgroundManifest";
import {
  AbsoluteFill,
  Bubbles,
  Camera,
  Cloudia,
  Drip,
  HEIGHT,
  KidContactShadow,
  MEADOW,
  MEADOW_Z,
  NO_LEAD,
  PHASE,
  PLATES,
  Pip,
  RAY_LIGHT,
  Ray,
  SleepingVolcano,
  Sunny,
  VOLCANO_AT,
  WIDE,
  WIDTH,
  WideLayer,
  emotionAt,
  heldBeat,
  hover,
  interpolate,
  kidEase,
  kidTheme,
  lineWindow,
  mixHex,
  moveAlong,
  pipLean,
  projectMark,
  stand,
  useCurrentFrame,
  useEmotion,
  useLookAtSpeaker,
  useStage,
  useVideoConfig,
  type Cam,
  type Cast,
  type Mark,
  type TimedScene,
} from "./common";

// ACT TWO — THE WATER (Scenes 11–16 of script.md).
//
// The rain is summoned, the plumbing is thrilled, and the first swerves are
// swerved. Six scenes, four setups:
//
//   the meadow wide   Scenes 11, 12b, 13, 15 — a painted plate seated so its
//                     skyline lands on `MEADOW.horizon`, the volcano standing
//                     on that line, the old tree at the field's edge, and a
//                     drawn near-field crest over the plate's grass fringe.
//   the cloud level   Scene 12a — up at the Cloud Hotel's checkout ledge, on
//                     `sky_cloud_level`, with the meadow a very long way down
//                     through a break in the floor.
//   the cutaway       Scenes 14 and 16 — the split frame: `grass_close` above
//                     the surface line, `soil_cutaway` below it, and the root,
//                     the straw, the water and Drip all drawn on top.
//   the weather       Scene 13's rain, which is SVG over the rain plate, and
//                     which carries the episode's entire volcano budget.
//
// ---------------------------------------------------------------------------
// THE BOUNDARY CHECKLIST (STYLE, "A cut inside a continuous space")
//
//   10→11  Act One ends on the meadow in daylight with Pip planted on her
//          mark; Scene 11 opens on the same mark, same scale (0.72, the cold
//          open's), same `meadow_day` plate, and the volcano is where it has
//          been since Scene 1. **Sunny is carried across, at act 1's mark**
//          (`SUNNY_X` = 1180, centre 320): the showrunner's B3 ruling is that
//          Ray may be absent after a time cut — Scene 11's cast in script.md
//          is Pip and the Narrator, and a contractor going home is film
//          grammar — but the sun cannot vanish out of a daylight sky at a hard
//          cut. He is ambient here and nothing more: no line, no swell, no
//          staging weight, nobody looks at him. What actually moves at the cut
//          is the Hotel, which is new and enters from off frame right.
//   11→12  A POV change rather than a continuous cut: Scene 11 ends with the
//          Hotel three quarters of the way in, low over the field; 12a is the
//          same building from its own ledge. The Hotel's *identity* carries
//          (awning, bell, stripe), not its screen position.
//   12a→12b  An intra-scene cut back down to the meadow, on the first frame
//          of `a2_09_narrator` (10585). It used to sit four frames earlier,
//          which put it three frames inside `a2_08`'s seven-frame bubble
//          shrink-out — and the two setups pin that bubble 500px apart, so the
//          dying bubble jumped across the cut. `a2_08` is `until` 10577 and
//          gone at 10584; the line that says "she leaned" now starts on the
//          shot that can show it. Cloudia holds her screen side (frame right)
//          across the cut, and the Hotel that was over our heads at cloud
//          level is over Pip's head here.
//   12→13  Same meadow, same mark, plate changes `meadow_day` → `meadow_rain`
//          because the weather arrived. The Hotel is still overhead on the
//          first frame of 13 and dissolves into the overcast as the rain
//          thickens — the building does not vanish at a cut.
//   13→14  A cut inside one place: the wide, then the same square inch of it
//          in section. Drip is on frame right of Pip at the end of 13 and
//          soaks in on frame right of her at the top of 14.
//   14→15  Section back out to the wide. Pip's growth state carries (sprout,
//          settled), Drip is still in the plumbing and shows the audience she
//          is by being half out of the top of it.
//   15→16  Wide back to section, same geometry as 14, Ray carried across: he
//          is on Pip's right at the end of 15 — over the field, stooped to her
//          mark — and angles back in on her right during 16, so his side of
//          frame and his ribbon's tilt are the same on both sides of the cut.
//   16→17  Act Three's opening scene. Pip ends 16 with her first leaf
//          pointed at the sky and holds it through the trailing beat — Scene
//          17 is her inventory line, so the pointer is the handoff.
//
// Paired stills for every cut above are in `scratchpad/ep4b3_act2/`.
// ---------------------------------------------------------------------------

type PlateKey = keyof typeof PLATES;

/** The plates are all generated at this size; the seating maths needs it. */
const PLATE_PX = { w: 1344, h: 768 } as const;

/**
 * How far a plate drifts, in px. STYLE: "a plate is never dead still" — but
 * this one is also carrying a volcano that has to stay standing on its
 * horizon, so the number is at the bottom of the sanctioned range. Five px on
 * a twenty-six second cycle is a fifth of a pixel a second.
 *
 * **HORIZONTAL ONLY**, which act 1 documents and this act used to get wrong: a
 * vertical drift moves the painted skyline, and the SVG volcano standing on it
 * is pinned to `MEADOW.horizon` and does not move with it. Two and a bit pixels
 * of it, under a 1.18 zoom, is a mountain that slowly sinks into its own
 * horizon and comes back out — small, and it is the one rule the seating table
 * exists to protect.
 */
const PLATE_DRIFT = 5;

/**
 * **A painted plate, seated.**
 *
 * `PLATES` is the measured table (B2 acceptance): `skyline` is the sky→land
 * row as a fraction of plate height and `scale` is the magnification that
 * seating requires. Drawn at that scale with the skyline row landing on
 * `seat`, the volcano stands on the painted horizon rather than near it —
 * which is the whole reason the numbers were measured instead of eyeballed.
 *
 * `row`/`seat` are overridable because two of this act's plates seat on
 * something that is not a horizon: the cloud floor's top edge is where the
 * Hotel stands, and the cutaway seats `grass_close` by the crest of its
 * painted mound. Pass `row: null` for a plate that just fills its band.
 *
 * `from`/`to` clip the plate to a band of the frame, which is what makes the
 * split-frame cutaway one component twice rather than a special case.
 */
const PlateLayer: React.FC<{
  which: PlateKey;
  /** Composition y the seated row lands on. */
  seat?: number;
  /** Which row of the plate seats there, 0..1. Defaults to its skyline. */
  row?: number | null;
  /** Band of the frame this plate paints; everything outside is clipped. */
  from?: number;
  to?: number;
  /** Extra magnification over the measured seating scale. */
  zoom?: number;
  dx?: number;
  phase?: number;
  drift?: number;
  zIndex?: number;
}> = ({
  which,
  seat = MEADOW.horizon,
  row,
  from = 0,
  to = HEIGHT,
  zoom = 1,
  dx = 0,
  phase = 0,
  drift = PLATE_DRIFT,
  zIndex = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const plate = PLATES[which];
  const seatRow = row === undefined ? plate.skyline : row;

  // Overscan, so the drift can never expose an edge. Applied to both axes off
  // the plate's height: the horizontal crop the seating scale already buys is
  // 0–11% on every key this act uses, and this adds to it rather than eating
  // into it.
  const fit = plate.scale * zoom;
  const over = 1 + (drift * 2.6) / (PLATE_PX.h * fit);
  const w = PLATE_PX.w * fit * over;
  const h = PLATE_PX.h * fit * over;
  const omega = (2 * Math.PI) / 26;
  // One axis. See `PLATE_DRIFT`: the seated row IS the horizon and the volcano
  // stands on it, so `top` is a constant for the life of the shot.
  const px = Math.sin(t * omega + phase) * drift;
  const left = (WIDTH - w) / 2 + dx + px;
  const top = seatRow === null ? (from + to) / 2 - h / 2 : seat - seatRow * h;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: from,
        width: WIDTH,
        height: Math.max(0, to - from),
        overflow: "hidden",
        zIndex,
      }}
    >
      <Img
        src={staticFile(BACKGROUNDS[which])}
        style={{
          position: "absolute",
          left,
          top: top - from,
          width: w,
          height: h,
          display: "block",
        }}
      />
    </div>
  );
};

/**
 * The drawn near field, over the plate's own grass fringe.
 *
 * Two jobs, both of them the plates' fault and neither of them optional: the
 * generated wides carry a band of painted grass blades along the bottom edge
 * that a flat-filled character standing in front of reads as *in front of a
 * photograph*, and the lower third is where STYLE says the characters live. So
 * the crest is drawn, it is filled from the plate's own sampled grass
 * (`PLATES[key].grass`, the ep-2 `PAINTED_GREEN` precedent), and the seam does
 * not read because the two greens are the same green.
 *
 * Same curve as `MeadowWorld`'s, deliberately: a scene of this episode that
 * uses a plate and a scene that does not have to be the same field.
 */
const NearField: React.FC<{ plate: PlateKey }> = ({ plate }) => {
  const green = PLATES[plate].grass;
  const ground = MEADOW.ground;
  return (
    <WideLayer zIndex={MEADOW_Z.ground}>
      <path
        d={
          `M ${WIDE.x} ${WIDE.y + WIDE.h}` +
          ` L ${WIDE.x} ${ground - 46}` +
          ` Q ${WIDTH * 0.28} ${ground - 92} ${WIDTH * 0.62} ${ground - 54}` +
          ` Q ${WIDTH * 0.9} ${ground - 26} ${WIDE.x + WIDE.w} ${ground - 62}` +
          ` L ${WIDE.x + WIDE.w} ${WIDE.y + WIDE.h} Z`
        }
        fill={green}
      />
      {/* A whisper of a lit lip along the crest. The first pass drew this at
          0.5 alpha and it read as a ruled line across the field — the band is
          supposed to disappear into the plate, not announce where it starts. */}
      <path
        d={
          `M ${WIDE.x} ${ground - 46}` +
          ` Q ${WIDTH * 0.28} ${ground - 92} ${WIDTH * 0.62} ${ground - 54}` +
          ` Q ${WIDTH * 0.9} ${ground - 26} ${WIDE.x + WIDE.w} ${ground - 62}`
        }
        fill="none"
        stroke={mixHex(green, kidTheme.paper, 0.34)}
        strokeWidth={12}
        opacity={0.16}
      />
      {/* The bottom edge pulled down a little, so a flat-filled character
          standing there is in a shadowed foreground rather than pasted on a
          lit one (STYLE, painted backgrounds). */}
      <defs>
        <linearGradient id="a2-nearfield-foot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mixHex(green, kidTheme.ink, 0.42)} stopOpacity={0} />
          <stop offset="100%" stopColor={mixHex(green, kidTheme.ink, 0.42)} stopOpacity={0.38} />
        </linearGradient>
      </defs>
      <rect x={WIDE.x} y={ground + 30} width={WIDE.w} height={HEIGHT - ground + 40} fill="url(#a2-nearfield-foot)" />
    </WideLayer>
  );
};

/**
 * The big old tree at the field's edge.
 *
 * Drawn rather than painted for the reason `common.tsx` gives — Scene 20 is
 * about what it is made of, and it only pays if the audience has been looking
 * at it for thirteen minutes — and re-drawn here rather than imported because
 * `MeadowWorld` owns the only other copy and this act cannot reach into it.
 * **Flagged for promotion**: the plate seating, the near-field crest and this
 * tree are the three things every act with a plate in it has to have, and all
 * four act files are going to write them.
 *
 * The palette is now a rule shared with act 1 (`canopyFor` there is this
 * arithmetic, with an extra `deep` knob its night and dawn plates need): the
 * theme's dark green carried a fifth of the way toward the plate's own sampled
 * near-field grass. Both acts drew the load-bearing Scene-20 tree in different
 * greens under the same daylight plate until the B3 repair pass; act 3 and the
 * recap use flat `kidTheme.grassDark`, which this is within a few percent of.
 */
const OldTree: React.FC<{ base: number; t: number; tint: string }> = ({ base, t, tint }) => {
  const sway = Math.sin(t * 0.42) * 1.5;
  // 0.22 is the daylight arm of the shared rule (act 1 writes it as
  // `canopyFor`/`CANOPY_MIX`); every plate in this act is a daylight one.
  const canopy = mixHex(kidTheme.grassDark, tint, 0.22);
  return (
    <WideLayer>
      <g transform={`translate(${MEADOW.tree.x} ${base})`}>
        <ellipse cx={0} cy={4} rx={128} ry={16} fill={kidTheme.ink} opacity={0.14} />
        <path
          d="M -26 0 Q -18 -108 -34 -196 L 34 -196 Q 18 -108 26 0 Z"
          fill={kidTheme.earth}
          stroke={kidTheme.ink}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <g transform={`rotate(${sway.toFixed(2)} 0 -170)`}>
          <ellipse cx={-76} cy={-232} rx={104} ry={78} fill={canopy} stroke={kidTheme.ink} strokeWidth={7} />
          <ellipse cx={82} cy={-248} rx={96} ry={72} fill={canopy} stroke={kidTheme.ink} strokeWidth={7} />
          <ellipse cx={0} cy={-306} rx={118} ry={86} fill={canopy} stroke={kidTheme.ink} strokeWidth={7} />
          {/* One lit mass, off the outline, so the canopy has a top. Mixed off
              the canopy rather than named, so it follows it. Act 1's is this. */}
          <ellipse cx={-8} cy={-336} rx={72} ry={40} fill={mixHex(canopy, kidTheme.paper, 0.22)} opacity={0.75} />
        </g>
      </g>
    </WideLayer>
  );
};

/**
 * **The volcano's one firing in this episode**: a thin curl of steam off the
 * summit, about two seconds long, that nobody looks at.
 *
 * `u` is 0..1 through its whole life. It rises for the first third, hangs, and
 * thins away over the last third — rain steaming off a mountain that is warm
 * now, and fully deniable. It is anchored by arithmetic to the summit of the
 * volcano at `VOLCANO_AT` on `MEADOW.horizon`, so it cannot drift off the peak
 * if the seating ever changes.
 *
 * No sting, no reaction, no line, and it does not get a beat of its own: the
 * rain keeps falling straight through it.
 */
const STEAM = mixHex(kidTheme.paper, kidTheme.inkSoft, 0.36);

const SteamCurl: React.FC<{ u: number; t: number }> = ({ u, t }) => {
  if (u <= 0 || u >= 1) return null;
  const grow = kidEase.easeOutCubic(u / 0.34);
  const thin = kidEase.easeInOutSine((u - 0.62) / 0.38);
  const alpha = 0.6 * (1 - thin) * Math.min(1, u / 0.1);
  const summitY = MEADOW.horizon - VOLCANO_SHAPE.h * VOLCANO_AT.scale;
  const N = 14;
  const pts = Array.from({ length: N + 1 }, (_, k) => {
    const f = k / N;
    return {
      x: VOLCANO_AT.x + Math.sin(f * 3.4 + t * 1.05) * 8.5 * f + f * f * 13,
      y: summitY - 4 - 126 * grow * f,
    };
  });
  const d = pts
    .map((p, k) => `${k === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  return (
    <WideLayer>
      <path
        d={d}
        fill="none"
        // NOT paper. The rain plate's sky is a pale silver-white and a white
        // curl on it is invisible — the whole volcano budget, spent on
        // nothing. A warm grey reads as steam against bright overcast and
        // still disappears completely if you are not looking at it.
        stroke={STEAM}
        strokeWidth={5.5 * (1 - thin * 0.6)}
        strokeLinecap="round"
        opacity={alpha}
      />
      {/* Three soft heads near the top, so the curl frays instead of ending
          in a full stop. */}
      {[0.74, 0.88, 1].map((f, i) => (
        <circle
          key={f}
          cx={pts[Math.round(f * N)].x}
          cy={pts[Math.round(f * N)].y}
          r={5 + i * 2.4}
          fill={STEAM}
          opacity={alpha * (0.7 - i * 0.16)}
        />
      ))}
    </WideLayer>
  );
};

/**
 * The meadow wide, with a plate under it.
 *
 * The plate lives **inside** the camera, unlike `MeadowWorld`'s gradient sky:
 * a painted horizon that does not move while the drawn volcano standing on it
 * does is the seating rule breaking on screen. The consequence is that every
 * camera move in this act is a push *in* (zoom ≥ 1) — pulling out below 1
 * would show past the plate's edge.
 */
const PlateWorld: React.FC<{
  plate: PlateKey;
  phase?: number;
  /** Volcano stir, 0..1. Scene 13 only, and it is the whole budget. */
  stir?: number;
  /** The steam curl's lifecycle, 0..1. Scene 13 only. */
  steam?: number;
  cam?: Cam;
  /** Scenery that belongs above the horizon and behind the cast. */
  sky?: React.ReactNode;
  /** Everything the camera must not touch: bubbles, cards. */
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ plate, phase = 0, stir = 0, steam = 0, cam, sky, overlay, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase;
  return (
    <AbsoluteFill
      style={{
        background: kidTheme.skyLow,
        fontFamily: kidTheme.fontFamily,
        color: kidTheme.ink,
        // Pinned for the same reason `KidBackdrop` pins it: the player does
        // not reset inherited typography. See docs/STYLE.md.
        lineHeight: "normal",
        overflow: "hidden",
      }}
    >
      <Camera cam={cam ?? { x: WIDTH / 2, y: HEIGHT / 2 }}>
        <PlateLayer which={plate} phase={phase} />
        <NearField plate={plate} />
        {/* The volcano and the tree stand ON the painted horizon, so they are
            a layer of their own rather than `auto`. See `MEADOW_Z`. */}
        <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.scenery }}>
          <SleepingVolcano
            x={VOLCANO_AT.x}
            base={MEADOW.horizon}
            scale={VOLCANO_AT.scale}
            phase={phase}
            stir={stir}
          />
          <SteamCurl u={steam} t={t} />
          <OldTree base={MEADOW.horizon + 22} t={t} tint={PLATES[plate].grass} />
        </div>
        {sky ? (
          <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.scenery + 1 }}>
            {sky}
          </div>
        ) : null}
        <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.cast }}>
          {children}
        </div>
      </Camera>
      {overlay ? (
        <AbsoluteFill style={{ zIndex: MEADOW_Z.overlay, pointerEvents: "none" }}>
          {overlay}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Her square inch, and the two marks the whole act is staged around
// ---------------------------------------------------------------------------

/**
 * Pip in a meadow wide. **0.72, which is the cold open's number** — Scene 3
 * plants her at that scale on that ground line and she cannot move, so every
 * wide in the episode that shows her from the field owes the audience the same
 * seed at the same size. (`PIP_MARK` in `common.tsx` is 0.62; that is the
 * placeholder's value, and the acts should converge on this one — flagged.)
 */
const PIP_WIDE = { x: MEADOW.pip.x, y: stand("pip", MEADOW.ground), scale: 0.72 } as const;

/**
 * **The act's wide framing.** One eye point for every meadow shot in the act,
 * so the only thing that ever changes between two of them is the zoom — which
 * is the second item on the boundary checklist, solved by construction rather
 * than by matching numbers by hand afterwards.
 *
 * The zooms: Scene 11 pushes 1.0 → 1.18 (closing on a seed who is about to
 * order the weather), Scene 12b holds 1.18, Scene 13 opens back out to 1.0 as
 * the rain arrives, and Scene 15 plays at 1.0 because it has four characters
 * and a field of sprouts in it.
 */
const WIDE_EYE = { x: MEADOW.pip.x, y: 720 } as const;
const S11_ZOOM = 1.18;

/**
 * Bubbles live outside the camera (a zoomed bubble is unreadable), so a mark
 * inside one is projected before `Bubbles` places anything on it. Pip's growth
 * state rides through, which is what keeps a bubble clearing the crown she
 * actually has.
 */
function seen(cam: Cam, m: Mark): Mark {
  return { ...projectMark(cam, m), state: m.state, morph: m.morph };
}

/** Her face for this act: unimpressed, and never grumpy. The cold open's. */
const PIP_RESTING = "skeptical";

/**
 * **Sunny's side of the frame, and it is a cross-act constant.**
 *
 * Act 1 fixes him at x = 1180 and says so in its header — "everything about him
 * in this episode happens on that side of frame… an act that moves him breaks
 * both leans" — and act 3 independently lands on 1186. This act had him frame
 * LEFT in Scene 15, which made the sun cross the sky and come back and pointed
 * the heliotropism runner at nothing; the B3 repair pass moved him back.
 * `cy` and the resting scale are act 1's `SUNNY_DAY`, so the 9655|9656 cut hands
 * one sun over rather than two.
 */
const SUNNY_AT = { x: 1180, cy: 320, scale: 0.85 } as const;

/**
 * The warm field around him, as a CSS radial gradient (an SVG one would need a
 * per-instance id and this episode is one document). Act 1's, verbatim, because
 * the whole point of the two Sunny marks in this act is that they are act 1's.
 */
const SunGlow: React.FC<{ x: number; y: number; r: number; strength?: number }> = ({
  x,
  y,
  r,
  strength = 0.3,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background:
        `radial-gradient(circle ${r}px at ${x}px ${y}px,` +
        ` rgba(255,214,110,${strength}) 0%,` +
        ` rgba(255,201,60,${strength * 0.42}) 34%,` +
        ` rgba(255,201,60,0) 72%)`,
    }}
  />
);

/**
 * **The stoop**, in degrees, and it is act 1's number (`RAY_STOOP = 11`).
 *
 * Every arrival in this episode stoops DOWN to Pip's mark and she never rises
 * to meet one; for a body with no arms the stoop *is* the ribbon, tipped so the
 * end nearest her is the low one. `bank` is an SVG `rotate`, so positive is
 * clockwise and dips the ribbon's frame-RIGHT end — which means the SIGN is
 * simply which side of the mark he is standing on. Act 1's Ray is on her left
 * and banks +11; both of this act's Ray scenes put him on her right, so they
 * bank −11.
 *
 * Before the repair pass this act had no stoop at all: it fed `moveAlong`'s raw
 * tangent (`angle * 0.4`) straight to `bank`, which tumbled him through ~127°
 * mid-flight and then parked him at −62° for eleven hundred frames.
 */
const RAY_STOOP = 11;

function stoopTo(rayX: number, markX: number): number {
  return rayX > markX ? -RAY_STOOP : RAY_STOOP;
}

/** The tangent bank is only ever a lean into the path, never a tumble. */
const BANK_CLAMP = 30;

function travelBank(angle: number): number {
  return Math.max(-BANK_CLAMP, Math.min(BANK_CLAMP, angle * 0.4));
}

/**
 * **A clock that stops dead inside a held beat and resumes where it stopped.**
 *
 * Held beats are spine-only: the bodies freeze, and so does anything of theirs
 * that is *running* rather than standing still — in this act that is the water
 * column climbing the root and the wet highlight sliding down the bore. Both
 * are pure functions of `t`, so freezing them is freezing the clock, exactly as
 * act 1 freezes Blue's ricochet through Scene 8's hold: the advance the beat
 * costs is given back, so the column does not jump when the picture starts
 * again. The plate's own drift keeps running (ratified: it is the world
 * breathing, not a body moving).
 */
function heldClock(frame: number, holds: readonly (readonly [number, number])[]): number {
  let f = frame;
  for (const [from, to] of holds) {
    if (frame >= to) f -= to - from;
    else if (frame >= from) return f - (frame - from);
  }
  return f;
}

/** How much of a body's idle survives a hold. Act 1's numbers. */
const HELD_IDLE = 0.3;

/**
 * Her dirt patch — drawn, always, for the three reasons STYLE gives (she
 * stands on it, grows out of it, and Scene 16 makes a joke about it).
 */
const DirtPatch: React.FC<{ x: number; y: number; rx?: number }> = ({ x, y, rx = 104 }) => (
  <WideLayer>
    <ellipse cx={x} cy={y + 4} rx={rx} ry={rx * 0.25} fill={kidTheme.earth} />
    <ellipse cx={x - rx * 0.21} cy={y - 2} rx={rx * 0.42} ry={rx * 0.115} fill={kidTheme.earth} opacity={0.7} />
    <ellipse
      cx={x}
      cy={y + 4}
      rx={rx}
      ry={rx * 0.25}
      fill="none"
      stroke={kidTheme.ink}
      strokeWidth={5}
      opacity={0.45}
    />
  </WideLayer>
);

// ---------------------------------------------------------------------------
// The Cloud Hotel
// ---------------------------------------------------------------------------

/**
 * A cloud mass: a union of ellipses drawn twice — once filled *and* thickly
 * stroked, then again fill-only on top, which is how `Cloudia` gets a single
 * clean outline round a union of circles without a mask. Everything cloudy in
 * this act is made of these.
 */
const CloudMass: React.FC<{
  cx: number;
  cy: number;
  w: number;
  h: number;
  seed?: number;
  grey?: number;
  opacity?: number;
}> = ({ cx, cy, w, h, seed = 0, grey = 0, opacity = 1 }) => {
  const fill = mixHex(kidTheme.cloud, kidTheme.cloudGrey, grey);
  const edge = mixHex(kidTheme.cloudGreyShade, kidTheme.ink, grey * 0.4);
  // Five lobes and no slab. The first pass put a rounded rectangle under them
  // to join the union up, and its corners came out past the lobes as hard
  // right angles — a cloud with two square shoulders. Overlapping the lobes
  // properly does the same job with nothing to stick out.
  const lobes = [-0.44, -0.2, 0, 0.22, 0.45].map((u, i) => ({
    x: cx + u * w,
    y: cy + Math.sin(seed + i * 1.7) * h * 0.1,
    rx: w * (0.24 + 0.045 * Math.cos(seed * 1.3 + i)),
    ry: h * (0.5 + 0.16 * Math.sin(seed + i * 2.1)),
  }));
  return (
    <g opacity={opacity}>
      <g fill={fill} stroke={edge} strokeWidth={7}>
        {lobes.map((l) => (
          <ellipse key={l.x} cx={l.x} cy={l.y} rx={l.rx} ry={l.ry} />
        ))}
      </g>
      <g fill={fill}>
        {lobes.map((l) => (
          <ellipse key={l.x} cx={l.x} cy={l.y} rx={l.rx} ry={l.ry} />
        ))}
      </g>
    </g>
  );
};

/**
 * A guest: a round happy drop-blob with a face and no rig.
 *
 * Wallpaper with eyes, exactly like episode two's window guests — a real body
 * at this size costs more than it reads, and there are up to nine of them in
 * the queue.
 */
const DropGuest: React.FC<{
  x: number;
  y: number;
  scale?: number;
  phase?: number;
  t: number;
  opacity?: number;
}> = ({ x, y, scale = 1, phase = 0, t, opacity = 1 }) => (
  <g
    transform={`translate(${x.toFixed(1)} ${(y + Math.sin(t * 1.7 + phase) * 3).toFixed(1)}) scale(${scale})`}
    opacity={opacity}
  >
    <path
      d="M 0 -46 C 30 -12 40 8 40 22 A 40 40 0 1 1 -40 22 C -40 8 -30 -12 0 -46 Z"
      fill={kidTheme.water}
      stroke={kidTheme.waterDeep}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <circle cx={-13} cy={16} r={5.4} fill={kidTheme.ink} />
    <circle cx={13} cy={16} r={5.4} fill={kidTheme.ink} />
    <path d="M -9 30 q 9 8 18 0" stroke={kidTheme.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
    <ellipse cx={-16} cy={-8} rx={7} ry={12} fill={kidTheme.shine} opacity={0.55} transform="rotate(-16 -16 -8)" />
  </g>
);

/**
 * **The Cloud Hotel, from outside**: a skyscraper of cloud with lit rooms, a
 * striped awning and a brass bell.
 *
 * Episode one built the hotel as a place and episode two showed it from
 * underneath in three seconds; the point of both is that a returning viewer
 * recognises the awning and the bell. `base` is the underside of the awning —
 * the building hangs *up* from it, because in this act the hotel is always
 * over somebody's head.
 */
const CloudHotel: React.FC<{
  x: number;
  base: number;
  w: number;
  t: number;
  opacity?: number;
  /** How full it is: greys the cloud and lights the windows. 0..1. */
  full?: number;
}> = ({ x, base, w, t, opacity = 1, full = 1 }) => {
  const floors = 3;
  const bandH = w * 0.3;
  const lit = mixHex(kidTheme.star, kidTheme.sunLight, 0.4);
  const edge = mixHex(kidTheme.cloudGreyShade, kidTheme.ink, 0.16);
  return (
    <WideLayer opacity={opacity}>
      {/* Top floors first, so each lower band overlaps the one above it and
          the stack reads as one building rather than a pile of clouds. Three
          bands with a real overlap: four evenly spaced ones drew a wedding
          cake, which is a stack of clouds, which is not a building. */}
      {Array.from({ length: floors }, (_, k) => floors - 1 - k).map((i) => {
        const bw = w * (1 - i * 0.14);
        const cy = base - bandH * 0.58 - i * bandH * 0.66;
        const rooms = 2 + (i % 2);
        return (
          <g key={i}>
            <CloudMass cx={x} cy={cy} w={bw} h={bandH} seed={i * 1.7} grey={0.12 + 0.06 * full} />
            {Array.from({ length: rooms }, (_, r) => {
              const u = rooms === 1 ? 0.5 : r / (rooms - 1);
              const wx = x + (u - 0.5) * bw * 0.46;
              const ww = Math.max(14, bw * 0.075);
              return (
                <g key={r}>
                  <ellipse
                    cx={wx}
                    cy={cy}
                    rx={ww}
                    ry={ww * 0.94}
                    fill={lit}
                    stroke={edge}
                    strokeWidth={Math.max(3, ww * 0.16)}
                  />
                  {/* One guest per lit room, leaning on the sill. */}
                  <g transform={`translate(${wx} ${cy + ww * 0.3}) scale(${ww / 52})`}>
                    <DropGuest x={0} y={0} scale={0.8} phase={i * 2.1 + r} t={t} />
                  </g>
                </g>
              );
            })}
          </g>
        );
      })}
      {/* The awning, and the bell under it. The stripe is episode two's. */}
      <g transform={`translate(${x} ${base})`}>
        {Array.from({ length: 8 }, (_, i) => {
          const u0 = (-1 + (i * 2) / 8) * w * 0.34;
          const u1 = (-1 + ((i + 1) * 2) / 8) * w * 0.34;
          return (
            <path
              key={i}
              d={`M ${u0} 0 L ${u1} 0 L ${u1 * 1.36} ${w * 0.13} L ${u0 * 1.36} ${w * 0.13} Z`}
              fill={i % 2 ? kidTheme.paper : kidTheme.pink}
              stroke={kidTheme.ink}
              strokeWidth={Math.max(2, w * 0.009)}
              strokeLinejoin="round"
            />
          );
        })}
        {Array.from({ length: 8 }, (_, i) => {
          const sw = (w * 0.92) / 8;
          const cx = -w * 0.46 + sw * (i + 0.5);
          return (
            <path
              key={`hem${i}`}
              d={`M ${cx - sw / 2} ${w * 0.13} a ${sw / 2} ${sw / 2.6} 0 0 0 ${sw} 0 Z`}
              fill={i % 2 ? kidTheme.paper : kidTheme.pink}
              stroke={kidTheme.ink}
              strokeWidth={Math.max(2, w * 0.009)}
              strokeLinejoin="round"
            />
          );
        })}
        <path
          d={`M ${-w * 0.34} 0 L ${w * 0.34} 0`}
          stroke={kidTheme.ink}
          strokeWidth={Math.max(3, w * 0.018)}
          strokeLinecap="round"
        />
        <g transform={`translate(0 ${w * 0.2}) scale(${w / 520})`}>
          <path
            d="M -34 26 C -34 -12 -18 -30 0 -30 C 18 -30 34 -12 34 26 Z"
            fill={kidTheme.sun}
            stroke={kidTheme.ink}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <circle cx={0} cy={34} r={9} fill={kidTheme.sunDark} stroke={kidTheme.ink} strokeWidth={5} />
        </g>
      </g>
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 11 — The rain campaign
// ---------------------------------------------------------------------------

const S11_BUBBLES: Record<string, string> = {
  a2_01_pip: "Rain does not take orders.",
  a2_03_pip: "Send me a cloud. Big one.",
};

/**
 * The Hotel's drift, as two marks. It comes in from frame right, grandly, and
 * is still coming at the cut — Scene 12 is the same building from its own
 * ledge, so it must not have arrived yet.
 */
const S11_HOTEL = {
  from: { x: 1770, base: 540, w: 190 },
  to: { x: 1218, base: 452, w: 366 },
} as const;

const RainCampaignScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [cloudFrom] = lineWindow(scene, "a2_02_narrator");

  // The Hotel, drifting the whole scene. `easeInOutSine` rather than a ramp,
  // so it is already moving at the top of the shot and still moving at the
  // cut — a building that starts and stops inside one scene reads as a prop
  // being placed.
  const u = kidEase.easeInOutSine(frame / Math.max(1, scene.durationInFrames));
  const hotel = {
    x: S11_HOTEL.from.x + (S11_HOTEL.to.x - S11_HOTEL.from.x) * u,
    base: S11_HOTEL.from.base + (S11_HOTEL.to.base - S11_HOTEL.from.base) * u,
    w: S11_HOTEL.from.w + (S11_HOTEL.to.w - S11_HOTEL.from.w) * u,
  };

  // "Pip glares at the sky like a dispatcher at an empty loading dock": at
  // nothing at all until the Narrator says where rain comes from, and at the
  // Hotel from there on. The aim is arithmetic off the Hotel's own mark, so
  // her eyes track it as it drifts rather than parking on where it started.
  const dock = { x: 0.2, y: -0.92 };
  const track = {
    x: Math.max(-1, Math.min(1, (hotel.x - PIP_WIDE.x) / 900)),
    y: Math.max(-1, Math.min(1, (hotel.base - 120 - 760) / 520)),
  };
  const look = frame >= cloudFrom ? track : dock;

  const emotion = useEmotion(scene, "pip", { a2_03_pip: "proud" }, PIP_RESTING);

  // **THE SUN DOES NOT LEAVE A DAYLIGHT SKY AT A CUT.** He has no line in this
  // scene and the script's cast for it is Pip and the Narrator, so he is
  // ambient and nothing else: parked on act 1's mark, looking at nothing in
  // particular, never spoken to, never looked at, no swell.
  //
  // The one thing that IS animated is the tail of act 1's: Scene 10 hands him
  // over still 8% up from his interrupt there ("That WAS my water elevator!"),
  // and `useEmotion`-style residue cannot cross an act file, so the first
  // thirty-six frames here let that settle back to his resting size. Without it
  // the cut is a 7% scale pop on the biggest object in the sky.
  const sunnyScale = interpolate(frame, [0, 36], [SUNNY_AT.scale * 1.077, SUNNY_AT.scale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  // Her bubbles go to her RIGHT for the whole act, and it is not a taste call:
  // the volcano lives at x = 336 on the horizon and a bubble parked on her
  // left sits straight on top of it. Badge occlusion, ep-3's flagged class.
  const pipMark: Mark = { ...PIP_WIDE, who: "pip", state: "planted", side: "right", offset: 348 };

  // A slow push in across the whole scene: the frame is closing on a seed who
  // is about to order the weather, and it hands Scene 12b a framing rather
  // than a jump.
  const cam: Cam = {
    ...WIDE_EYE,
    zoom: interpolate(frame, [0, scene.durationInFrames], [1, S11_ZOOM], {
      extrapolateRight: "clamp",
      easing: kidEase.easeInOutSine,
    }),
  };

  return (
    <PlateWorld
      plate="meadow_day"
      phase={4.1}
      cam={cam}
      sky={
        <>
          <SunGlow
            x={SUNNY_AT.x}
            y={SUNNY_AT.cy}
            r={202 * sunnyScale * 3}
            strength={0.3}
          />
          <Sunny
            x={SUNNY_AT.x}
            y={hover("sunny", SUNNY_AT.cy, sunnyScale)}
            scale={sunnyScale}
            phase={PHASE.sunny}
            emotion="proud"
            look="camera"
          />
          <CloudHotel x={hotel.x} base={hotel.base} w={hotel.w} t={t} />
        </>
      }
      overlay={
        <Bubbles scene={scene} cast={{ pip: seen(cam, pipMark) } as Cast} text={S11_BUBBLES} />
      }
    >
      <DirtPatch x={PIP_WIDE.x} y={MEADOW.ground} />
      <Pip
        x={PIP_WIDE.x}
        y={PIP_WIDE.y}
        scale={PIP_WIDE.scale}
        state="planted"
        phase={PHASE.pip}
        emotion={emotion}
        speaking={stage.speaking("pip")}
        look={look}
      />
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 12 — Checkout at the Cloud Hotel  (CUTTABLE — one scene, no arc)
// ---------------------------------------------------------------------------
//
// Staged as two setups with one cut between them, and the cut is what makes
// the scene work rather than a flourish: the checkout happens at cloud level,
// where Cloudia has a desk and a queue and a ledge to be grand from, and THE
// LEAN happens in the meadow, where Pip is nine pixels tall from up there and
// a signature drawn with her whole body would be invisible. The cut is taken
// in the eight-frame gap in front of `a2_09_narrator` — the line that says
// "she leaned" plays over the shot that can show it.
//
// It is marked CUTTABLE in the script, so it is staged tight: no camera moves,
// no business that another scene has to inherit, and if it goes, nothing else
// in the act moves.

const S12_BUBBLES: Record<string, string> = {
  a2_04_cloudia: "The Hotel is at full capacity.",
  a2_05_cloudia: "It is checkout time, darling.",
  a2_06_pip: "I ordered one water.",
  a2_07_cloudia: "Nobody leaves this hotel alone.",
  a2_08_cloudia: "Signature required, darling.",
  a2_10_pip: "Consider that a signature.",
  a2_11_cloudia: "Gorgeous penmanship, darling.",
};

/**
 * Where the checkout happens. The hotel stands on the cloud floor at frame
 * left; the queue shuffles right along the floor to the break in it, which is
 * the only exit this hotel has.
 */
const LEDGE = { hotel: 560, floor: 712, exit: 1330 } as const;

const CloudHotelScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const [downFrom] = lineWindow(scene, "a2_09_narrator");
  // **The cut lands on the Narrator's first frame**, and not one frame before
  // it. `a2_08_cloudia` ends at local 573, so its bubble's `until` is 574 and
  // `SpeechBubble`'s seven-frame shrink-out does not finish until 581; the two
  // setups pin that bubble five hundred pixels apart (`{x:1502}` up at the
  // ledge, over Cloudia's head down here), so a cut inside those seven frames
  // teleports a dying bubble. The old placement (`downFrom - 4` = 578) did
  // exactly that for three frames. There is no bubble and no mouth on 582 — the
  // Narrator has no body — so the picture changes into silence, and the line
  // that says "she leaned" plays over the shot that can show it.
  const down = frame >= downFrom;
  return down ? <CheckoutBelow scene={scene} /> : <CheckoutAbove scene={scene} />;
};

/** Setup A — up at the hotel, where the guests are being asked to leave. */
const CheckoutAbove: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [checkoutFrom] = lineWindow(scene, "a2_05_cloudia");

  const cloudia: Mark = { x: 1086, y: 452, scale: 0.82, who: "cloudia", side: "right" };
  // Pip, from up here. A sixth of her wide-shot scale, which is the joke of
  // the setup: the hotel is negotiating with a speck.
  const pipBelow: Mark = { x: 1560, y: stand("pip", 978), scale: 0.16, who: "pip", state: "planted" };

  const emotion = useEmotion(
    scene,
    "cloudia",
    { a2_07_cloudia: "amazed", a2_08_cloudia: "proud", a2_11_cloudia: "happy" },
    "proud",
  );

  // The queue: four guests on the cloud floor, and one stepping off the edge
  // of it every forty frames once checkout has been announced. They are the
  // rain, an hour early, and nobody says so.
  const gone = Math.max(0, Math.floor((frame - checkoutFrom) / 40));

  return (
    <AbsoluteFill
      style={{
        background: kidTheme.skyLow,
        fontFamily: kidTheme.fontFamily,
        color: kidTheme.ink,
        lineHeight: "normal",
        overflow: "hidden",
      }}
    >
      <PlateLayer which="sky_cloud_level" seat={MEADOW.horizon} />
      {/* The break in the cloud floor, and the field a very long way down it.
          Drawn rather than painted: the plate is an unbroken floor, and this
          is the only way Pip is in this shot at all. */}
      <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.ground }}>
        <CloudGap t={t} />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.ground + 1 }}>
        <Pip
          x={pipBelow.x}
          y={pipBelow.y}
          scale={0.16}
          state="planted"
          phase={PHASE.pip}
          emotion={PIP_RESTING}
          speaking={stage.speaking("pip")}
          look="up"
        />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.scenery }}>
        <CloudHotel x={LEDGE.hotel} base={618} w={760} t={t} />
        <Checkout t={t} gone={gone} />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.cast }}>
        <Cloudia
          x={cloudia.x}
          y={cloudia.y}
          scale={cloudia.scale}
          fill={0.5}
          bowTie
          clipboard
          phase={PHASE.cloudia}
          emotion={emotion}
          speaking={stage.speaking("cloudia")}
          look={{ x: 0.5, y: 0.62 }}
        />
      </div>
      <AbsoluteFill style={{ zIndex: MEADOW_Z.overlay, pointerEvents: "none" }}>
        <Bubbles
          scene={scene}
          cast={{ cloudia, pip: pipBelow } as Cast}
          text={S12_BUBBLES}
          at={{
            // Into the empty blue on her right — the whole left of this frame
            // is her own hotel, and a bubble parked on it hides four guests.
            a2_04_cloudia: { x: 1502, y: 196, tail: "left", tailAt: 1180 },
            a2_05_cloudia: { x: 1502, y: 196, tail: "left", tailAt: 1180 },
            a2_07_cloudia: { x: 1502, y: 196, tail: "left", tailAt: 1180 },
            a2_08_cloudia: { x: 1502, y: 196, tail: "left", tailAt: 1180 },
            // Hers comes up out of the gap, with the tail pointing straight
            // back down at the speck it belongs to.
            a2_06_pip: { x: 1560, y: 636, tail: "left", tailAt: 1560 },
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * The hole in the cloud floor, and the meadow at the bottom of it.
 *
 * The rim is a row of soft cloud lobes rather than a stroked outline: a ring
 * around the hole read as a porthole, and the picture has to be "a gap in the
 * weather", which is also, quietly, how the delivery is going to get down
 * there.
 */
const GAP = { cx: 1600, cy: 1030, rx: 470, ry: 300 } as const;

const CloudGap: React.FC<{ t: number }> = ({ t }) => (
  <WideLayer>
    <defs>
      <linearGradient id="a2-gap-air" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#cfe9f8" />
        <stop offset="42%" stopColor="#d7ecdb" />
        <stop offset="100%" stopColor="#a8c651" />
      </linearGradient>
    </defs>
    <ellipse cx={GAP.cx} cy={GAP.cy} rx={GAP.rx} ry={GAP.ry} fill="url(#a2-gap-air)" />
    {/* Field bands at the bottom of the hole. Hazy, and getting greener as
        they come forward: it is a long way down. */}
    <path d={`M ${GAP.cx - GAP.rx} 940 C ${GAP.cx - 200} 916 ${GAP.cx + 220} 922 ${GAP.cx + GAP.rx} 946 L ${GAP.cx + GAP.rx} 1080 L ${GAP.cx - GAP.rx} 1080 Z`} fill="#9dbf47" opacity={0.9} />
    <path d={`M ${GAP.cx - GAP.rx} 1006 C ${GAP.cx - 160} 988 ${GAP.cx + 200} 992 ${GAP.cx + GAP.rx} 1008 L ${GAP.cx + GAP.rx} 1080 L ${GAP.cx - GAP.rx} 1080 Z`} fill="#8cb43a" opacity={0.95} />
    <ellipse cx={1560} cy={984} rx={46} ry={11} fill={kidTheme.earth} opacity={0.85} />
    {/* The rim: big, irregular lobes of cloud along the far edge of the break.
        The first pass used twenty-two even circles and drew a pearl necklace,
        and drew the shaded ones on top, which drew soap bubbles. Shade behind,
        white in front, both opaque. */}
    {Array.from({ length: 13 }, (_, i) => {
      const a = Math.PI * (0.02 + (i / 12) * 0.96);
      const r = 46 + 26 * Math.sin(i * 1.9);
      return (
        <circle
          key={`s${i}`}
          cx={GAP.cx - Math.cos(a) * (GAP.rx + 62)}
          cy={GAP.cy - Math.sin(a) * (GAP.ry + 48)}
          r={r}
          fill={kidTheme.cloudShade}
        />
      );
    })}
    {Array.from({ length: 13 }, (_, i) => {
      const a = Math.PI * (0.02 + (i / 12) * 0.96);
      const wob = Math.sin(i * 2.3) * 0.06;
      const r = 62 + 34 * Math.sin(i * 1.9) + 6 * Math.sin(t * 0.4 + i);
      return (
        <circle
          key={i}
          cx={GAP.cx - Math.cos(a) * GAP.rx * (0.98 + wob)}
          cy={GAP.cy - Math.sin(a) * GAP.ry * (0.98 + wob)}
          r={r}
          fill={kidTheme.cloud}
        />
      );
    })}
  </WideLayer>
);

/**
 * The checkout: the desk, the bell, and the queue walking off the edge of the
 * world. Nobody leaves this hotel alone.
 */
const Checkout: React.FC<{ t: number; gone: number }> = ({ t, gone }) => (
  <WideLayer>
    {/* The registry desk: a cloud podium with a ledger and the brass bell. */}
    <g transform={`translate(1152 ${LEDGE.floor + 26})`}>
      <path
        d="M -118 132 L -102 -16 Q 0 -40 102 -16 L 118 132 Z"
        fill={kidTheme.cloud}
        stroke={kidTheme.cloudGreyShade}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      <path d="M -78 -18 L 78 -18" stroke={kidTheme.cloudShade} strokeWidth={10} strokeLinecap="round" />
      <g transform="translate(-56 -66) scale(0.72)">
        <path
          d="M -34 26 C -34 -12 -18 -30 0 -30 C 18 -30 34 -12 34 26 Z"
          fill={kidTheme.sun}
          stroke={kidTheme.ink}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <circle cx={0} cy={34} r={9} fill={kidTheme.sunDark} stroke={kidTheme.ink} strokeWidth={5} />
      </g>
    </g>
    {/* The queue, shuffling right along the floor towards the break. */}
    {Array.from({ length: 4 }, (_, i) => {
      if (i < gone) return null;
      const x = 700 + i * 168 + Math.sin(t * 0.9 + i) * 6;
      return (
        <DropGuest key={i} x={x} y={LEDGE.floor - 46} scale={0.9} phase={i * 1.6} t={t} />
      );
    })}
    {/* And the ones who have already checked out, on their way down through
        it. Nobody leaves this hotel alone. */}
    {Array.from({ length: gone }, (_, i) => {
      const drop = ((t * 520 + i * 190) % 760) - 60;
      return (
        <DropGuest
          key={`out${i}`}
          x={LEDGE.exit + 90 + i * 130}
          y={LEDGE.floor - 60 + drop}
          scale={0.86 - drop / 2600}
          phase={i * 2.3}
          t={t}
          opacity={Math.max(0, Math.min(1, (700 - drop) / 220))}
        />
      );
    })}
  </WideLayer>
);

/** Setup B — back down in the meadow, with the hotel over her head. */
const CheckoutBelow: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [signFrom, signTo] = lineWindow(scene, "a2_09_narrator");

  // **THE LEAN — firing (scripted).** Her first voluntary one, and it is a
  // signature rather than an admission: a deliberate tip and a return, so the
  // drift is fast (14f, half the involuntary rate) and the snap is the rig's.
  // It lands on the word, at the end of the Narrator's line.
  const signAt = signTo - 52;
  // Fifteen degrees, not ten: at this stage she is a pod on the dirt with no
  // stem to bend, so the signature is the whole body tipping and it has to be
  // legible at her wide-shot size.
  const lean = pipLean(frame, [{ at: signAt, to: 15, snapAt: signAt + 46, drift: 14 }]);

  // The hotel is over her head and frame LEFT, which is what leaves the right
  // half of the sky empty — this setup has two speakers and both of their
  // bubbles have to live somewhere that is not a building.
  const cloudia: Mark = { x: 1028, y: 424, scale: 0.56, who: "cloudia", side: "right" };
  const pipMark: Mark = { ...PIP_WIDE, who: "pip", state: "planted", side: "right", offset: 348 };
  const cam: Cam = { ...WIDE_EYE, zoom: S11_ZOOM };

  const emotion = useEmotion(scene, "pip", { a2_10_pip: "proud" }, PIP_RESTING);
  const cloudiaEmotion = useEmotion(scene, "cloudia", { a2_11_cloudia: "happy" }, "proud");

  return (
    <PlateWorld
      plate="meadow_day"
      phase={5.3}
      cam={cam}
      sky={
        <>
          <CloudHotel x={640} base={430} w={600} t={t} />
          {/* The first few guests, on their way down. The delivery is in the
              post; the weather is Scene 13. */}
          <WideLayer>
            {[0, 1, 2].map((i) => {
              // They fade out well before the grass: a half-transparent cyan
              // drop over a yellow-green field renders GREEN, and the first
              // pass had three green blobs bouncing about in the meadow.
              const drop = ((t * 300 + i * 190) % 420) - 120;
              return (
                <DropGuest
                  key={i}
                  x={452 + i * 196}
                  y={470 + drop}
                  scale={0.4}
                  phase={i * 2.2}
                  t={t}
                  opacity={Math.max(0, Math.min(1, (200 - drop) / 130))}
                />
              );
            })}
          </WideLayer>
        </>
      }
      overlay={
        <Bubbles
          scene={scene}
          cast={{ pip: seen(cam, pipMark), cloudia: seen(cam, cloudia) } as Cast}
          text={S12_BUBBLES}
        />
      }
    >
      <DirtPatch x={PIP_WIDE.x} y={MEADOW.ground} />
      <Pip
        x={PIP_WIDE.x}
        y={PIP_WIDE.y}
        scale={PIP_WIDE.scale}
        state="planted"
        lean={lean}
        phase={PHASE.pip}
        emotion={emotion}
        speaking={stage.speaking("pip")}
        look={{ x: 0.34, y: -0.78 }}
      />
      <Cloudia
        x={cloudia.x}
        y={cloudia.y}
        scale={cloudia.scale}
        fill={0.5}
        bowTie
        clipboard
        phase={PHASE.cloudia}
        emotion={cloudiaEmotion}
        speaking={stage.speaking("cloudia")}
        look={{ x: -0.2, y: 0.82 }}
      />
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 13 — Here comes the weather (and the stir)
// ---------------------------------------------------------------------------

const S13_BUBBLES: Record<string, string> = {
  a2_13_drip: "Hi! It's me! I'm the weather!",
  a2_15_pip: "Water order confirmed. One water.",
  a2_16_drip: "I am the whole sky falling!",
  a2_17_pip: "The order said one.",
  a2_18_drip: "I brought a thousand cousins!",
  a2_19_pip: "Well done, one water.",
  a2_20_drip: "I will take it.",
};

/** Where Drip lands, and stands for the rest of the scene. */
const S13_DRIP = { x: 1186, y: stand("drip", MEADOW.ground), scale: 0.72 } as const;

/** The frame the dissolving Cloud Hotel is fully into the overcast and gone. */
const HOTEL_GONE = 62;

const RAIN_DROPS = 170;

/**
 * The rain, as a sheet that sweeps in from frame right.
 *
 * `front` is the composition x its leading edge has reached; a drop is only
 * falling once the front has gone past it. That is what lets the volcano's
 * steam curl be *caused*: the summit is at x = 336, the front crosses it, and
 * the curl starts a dozen frames later.
 *
 * Deliberately thin above `MEADOW.horizon`. The rain plate was accepted
 * specifically because its horizon stays readable under weather, and a full
 * sheet drawn over it would throw that away — which would also take the stir
 * with it, because a curl of steam off a summit nobody can find is nothing.
 */
const Rain: React.FC<{ t: number; front: number; strength: number }> = ({ t, front, strength }) => {
  if (strength <= 0) return null;
  const colour = mixHex(kidTheme.water, kidTheme.paper, 0.55);
  return (
    <WideLayer>
      {Array.from({ length: RAIN_DROPS }, (_, i) => {
        const lane = ((i * 137) % 1000) / 1000;
        const depth = ((i * 311) % 100) / 100;
        const x0 = -260 + lane * 2440;
        if (x0 < front) return null;
        const speed = 660 + depth * 980;
        const len = 24 + depth * 74;
        const y = -340 + ((t * speed + ((i * 577) % 1400)) % 1560);
        const far = y < MEADOW.horizon;
        const alpha = strength * (0.16 + depth * 0.3) * (far ? 0.42 : 1);
        return (
          <path
            key={i}
            d={`M ${(x0 - y * 0.09).toFixed(1)} ${y.toFixed(1)} l ${(-len * 0.1).toFixed(1)} ${len.toFixed(1)}`}
            stroke={colour}
            strokeWidth={2 + depth * 3.4}
            strokeLinecap="round"
            opacity={alpha}
          />
        );
      })}
      {/* Splash ticks along the ground line: the rain has to arrive somewhere
          or it reads as a scratched lens. */}
      {Array.from({ length: 16 }, (_, i) => {
        const x = -120 + ((i * 617) % 2160);
        if (x < front) return null;
        const u = ((t * 1.9 + i * 0.37) % 1);
        const r = 8 + u * 34;
        return (
          <ellipse
            key={`s${i}`}
            cx={x}
            cy={MEADOW.ground + 10 + ((i * 97) % 60)}
            rx={r}
            ry={r * 0.3}
            fill="none"
            stroke={colour}
            strokeWidth={3}
            opacity={strength * 0.4 * (1 - u)}
          />
        );
      })}
    </WideLayer>
  );
};

/** The fat first drop Drip rides in on, and the splash it makes. */
const FatDrop: React.FC<{ x: number; y: number; scale: number; opacity: number }> = ({
  x,
  y,
  scale,
  opacity,
}) => (
  <WideLayer opacity={opacity}>
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale})`}>
      <path
        d="M 0 -230 C 70 -96 122 -22 122 44 A 122 122 0 1 1 -122 44 C -122 -22 -70 -96 0 -230 Z"
        fill={kidTheme.water}
        stroke={kidTheme.waterDeep}
        strokeWidth={9}
        opacity={0.5}
      />
      <ellipse cx={-44} cy={-20} rx={20} ry={44} fill={kidTheme.shine} opacity={0.4} transform="rotate(-14 -44 -20)" />
    </g>
  </WideLayer>
);

const WeatherScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [dripFrom, dripTo] = lineWindow(scene, "a2_13_drip");
  const [cousinsFrom] = lineWindow(scene, "a2_18_drip");
  const [decideFrom, decideTo] = heldBeat(scene, "a2_19_pip");

  // --- the weather --------------------------------------------------------
  // The front sweeps right to left across two and a half frame widths in four
  // and a half seconds, starting on the Narrator's line.
  const front = interpolate(frame, [10, 145], [WIDTH + 260, -280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const strength = interpolate(frame, [8, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- THE VOLCANO STIR ---------------------------------------------------
  // The episode's entire volcano budget. Solving the `front` ramp above for
  // x = 336 (the summit) puts the crossing at **frame 100** — global 11023 —
  // and the curl starts thirty-two frames after it: rain arriving, then rain
  // steaming off a mountain that is warm now. It holds two seconds, thins, and
  // is gone. Nobody looks at it, nobody names it, no sting, and the rain does
  // not pause for it.
  const STEAM_AT = 132;
  const STEAM_FOR = 64;
  const steam = Math.max(0, Math.min(1, (frame - STEAM_AT) / STEAM_FOR));
  // A breath of rumble under it, and nothing more: the ladder is ep-3 one
  // eye → ep-4 small stir → ep-5 wakes, and this is the middle rung.
  const stir = 0.34 * Math.sin(Math.PI * Math.max(0, Math.min(1, (frame - STEAM_AT + 20) / (STEAM_FOR + 40))));

  // --- Drip's entrance ----------------------------------------------------
  // **The identical-take joke**: `a2_13_drip` is `Hi! It's me! I'm the
  // weather!` in the same take, third episode running (cache-migrated from
  // sky-blue). It is played completely straight — the headliner rides the
  // first fat drop down, arms wide, and lands on the last word.
  // She is on screen for the whole of her own line: the first build started
  // her fall at the line and she was still above the frame edge saying "Hi!
  // It's me!" to an empty meadow.
  const fallFrom = 18;
  const landAt = dripFrom + 30;
  const fall = kidEase.gravity(Math.max(0, (frame - fallFrom) / Math.max(1, landAt - fallFrom)));
  const dripY = -300 + (S13_DRIP.y + 300) * fall;
  const landed = frame >= landAt;
  const splash = Math.max(0, Math.min(1, (frame - landAt) / 22));

  // --- the faces ----------------------------------------------------------
  // NO_LEAD: this scene carries a held beat, and the kit's default eight-frame
  // lead would put Drip's decision inside the silence it is supposed to be
  // taken in.
  const pipEmotion = useEmotion(scene, "pip", { a2_15_pip: PIP_RESTING }, PIP_RESTING, NO_LEAD);
  // "Drip decides, visibly, whether to be outraged or flattered" — the one
  // thing the script *does* put inside a held beat, and it is the content of
  // the beat rather than a leak into it. Placed by `emotionAt`, in the
  // silence, on absolute frames.
  const dripEmotion = emotionAt(
    frame,
    [
      { at: dripFrom, emotion: "excited" },
      { at: cousinsFrom, emotion: "proud" },
      { at: decideFrom + 8, emotion: "grumpy" },
      { at: decideFrom + Math.round((decideTo - decideFrom) * 0.62), emotion: "happy", frames: 12 },
    ],
    "happy",
  );

  // The frame opens back out as the weather arrives: Scene 12b handed over at
  // 1.18 and this settles to the act's plain wide by the time Drip lands.
  const cam: Cam = {
    ...WIDE_EYE,
    zoom: interpolate(frame, [0, 150], [S11_ZOOM, 1], {
      extrapolateRight: "clamp",
      easing: kidEase.easeInOutSine,
    }),
  };

  const pipMark: Mark = { ...PIP_WIDE, who: "pip", state: "planted", side: "right", offset: 348 };
  const dripMark: Mark = { x: S13_DRIP.x, y: landed ? S13_DRIP.y : dripY, scale: S13_DRIP.scale, who: "drip", side: "left" };
  // Where her bubble's tail has to point while she is still falling: her mark
  // as the camera sees it, which is not her mark, because the frame is opening
  // out from 1.18 underneath her.
  const dripSeen = seen(cam, dripMark);

  return (
    <PlateWorld
      plate="meadow_rain"
      phase={6.2}
      stir={stir}
      steam={steam}
      cam={cam}
      sky={
        <>
          {/* The Hotel is still up there on the first frame of this scene and
              dissolves into the overcast as the sheet thickens: a building
              does not vanish at a cut. Gone well before the rain is at full
              strength — a translucent hotel hanging over the horizon for six
              seconds is a ghost, not a dissolve.
              **Unmounted at 62, not merely transparent.** Its `w` shrinks with
              the frame and crosses zero at 629, and a `CloudMass` built from a
              negative width hands the DOM negative `rx`/`ry`: sixty invalid-
              SVG-attribute errors a frame for the last three hundred frames of
              the scene, on a building nobody can see. Invisible on screen,
              eighteen thousand nine hundred lines in a render log. */}
          {frame < HOTEL_GONE ? (
            <CloudHotel
              x={560 - frame * 2.2}
              base={300 - frame * 3.4}
              w={880 - frame * 1.4}
              t={t}
              opacity={Math.max(0, 1 - frame / HOTEL_GONE)}
              full={0.2}
            />
          ) : null}
          <Rain t={t} front={front} strength={strength} />
        </>
      }
      overlay={
        <Bubbles
          scene={scene}
          cast={{ pip: seen(cam, pipMark), drip: dripSeen } as Cast}
          text={S13_BUBBLES}
          at={{
            // **PINNED, not parked on her.** "Hi! It's me! I'm the weather!"
            // runs from thirty frames before she lands to fifty after it, and
            // she covers a thousand pixels of frame inside it — a bubble that
            // rides that fall is a bubble nobody can read (act 1 refuses the
            // same thing for Blue). So it sits still, high in the empty sky
            // left of her landing, and the TAIL tracks the fall instead.
            a2_13_drip: { x: 872, y: 214, tail: "right", tailAt: dripSeen.x },
          }}
        />
      }
    >
      <DirtPatch x={PIP_WIDE.x} y={MEADOW.ground} />
      <Pip
        x={PIP_WIDE.x}
        y={PIP_WIDE.y}
        scale={PIP_WIDE.scale}
        state="planted"
        phase={PHASE.pip}
        emotion={pipEmotion}
        speaking={stage.speaking("pip")}
        look={useLookAtSpeaker(scene, { pip: pipMark, drip: dripMark } as Cast, "pip", "camera")}
      />
      {/* The drop she came down in, which becomes the splash she lands in. */}
      <FatDrop
        x={S13_DRIP.x}
        y={(landed ? S13_DRIP.y : dripY) + 96}
        scale={landed ? 0.72 * (1 + splash * 0.5) : 0.72}
        opacity={landed ? Math.max(0, 0.8 - splash) : 0.8}
      />
      <KidContactShadow x={S13_DRIP.x} y={MEADOW.ground + 4} rx={104} ry={22} strength={landed ? 0.26 : 0} />
      <Drip
        x={S13_DRIP.x}
        y={landed ? S13_DRIP.y : dripY}
        scale={S13_DRIP.scale}
        pose={landed ? "rest" : "cheer"}
        shadow={false}
        phase={PHASE.drip}
        emotion={dripEmotion}
        speaking={stage.speaking("drip")}
        look={useLookAtSpeaker(scene, { pip: pipMark, drip: dripMark } as Cast, "drip", "camera")}
      />
      {/* Her thousand cousins, briefly countable. They are the rain that is
          already falling — the gag costs six drops and no runtime. */}
      <Cousins t={t} from={cousinsFrom} frame={frame} />
    </PlateWorld>
  );
};

/** Six of the thousand, with faces, falling past behind her. */
const Cousins: React.FC<{ t: number; from: number; frame: number }> = ({ t, from, frame }) => {
  const u = (frame - from) / 150;
  if (u <= 0 || u >= 1.4) return null;
  const alpha = Math.min(1, u * 4) * Math.max(0, Math.min(1, (1.4 - u) * 3));
  return (
    <WideLayer>
      {Array.from({ length: 6 }, (_, i) => {
        const x = 620 + i * 236 + Math.sin(i * 2.1) * 40;
        const y = -160 + (((t + i * 0.31) * 520) % 1320);
        return (
          <DropGuest key={i} x={x} y={y} scale={0.42} phase={i * 1.3} t={t} opacity={alpha * 0.9} />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// The cutaway — Scenes 14 and 16
// ---------------------------------------------------------------------------
//
// The split frame: `grass_close` above the surface, `soil_cutaway` below it,
// and everything that is *about* anything drawn on top. The surface line is
// where the painted mound's crest sits when the plate is seated (0.451 of the
// plate, measured off the committed webp), so the painted mound IS the ground
// Pip is planted in rather than a second one behind it.
//
// Per the plate design, the soil plate is optional and the drawn cutaway wins:
// it is here as texture under drawn roots, drawn straw, drawn water and a
// drawn comedian, and it earns its place by being completely featureless.

const CUT = {
  /** Where the ground is, in both cutaway scenes. */
  surface: 520,
  /** The crest row of `grass_close`, measured. */
  crest: 0.451,
  /** Pip's scale down here — a closer shot than the wide. */
  pip: 0.86,
} as const;

/**
 * Drip's scale inside the plumbing. Sized off the bore, not off her: she has
 * to fit in the tube she is riding, and at 0.34 she is a hundred and twenty
 * across in a hundred-and-forty-eight-wide root.
 */
const CUT_DRIP = 0.34;

const CUT_PIP_Y = stand("pip", CUT.surface);

/**
 * The root, drawn as a fat hollow tube with a slide in it.
 *
 * It is a waterslide that goes the wrong way, so it is drawn like one: an
 * outer root wall in earth colours and an interior channel wide enough to hold
 * a character, which is not botany and is exactly the right call — the script
 * asks for a comedian INSIDE the geometry, and a true-scale xylem vessel is
 * four pixels across.
 *
 * `RIDE` is the path Drip takes through it, as points; `ridePath` samples it.
 * Everything else in the cutaway hangs off the same three numbers, so the
 * water, the root and the rider cannot disagree.
 */
const ROOT_TOP = { x: MEADOW.pip.x, y: CUT.surface };

/**
 * The root, as tapered segments of one spine. A stroke cannot change width
 * along its length, so the taper is five round-capped strokes of decreasing
 * width laid over each other — which is also how the wall, the fill and the
 * interior stay in register: all three are the same `d`s at three widths.
 */
const TAP: readonly { d: string; w: number }[] = [
  { d: "M 812 496 C 808 540 802 570 800 606", w: 104 },
  { d: "M 800 606 C 798 646 798 672 802 706", w: 138 },
  { d: "M 802 706 C 806 754 812 792 822 828", w: 148 },
  { d: "M 822 828 C 830 866 838 894 846 922", w: 116 },
  { d: "M 846 922 C 852 948 856 966 858 986", w: 66 },
];
const LATERAL: readonly { d: string; w: number }[] = [
  { d: "M 812 764 C 878 776 926 790 970 804", w: 106 },
  { d: "M 970 804 C 1002 814 1022 820 1042 824", w: 68 },
];

/**
 * Drip's ride, as points on that spine. Down through the soil beside the
 * plant, sideways along the lateral when the root takes hold of her, and then
 * up the inside of the taproot — the waterslide that goes the wrong way.
 */
const RIDE: readonly { x: number; y: number }[] = [
  { x: 1046, y: 606 },
  { x: 1046, y: 742 },
  { x: 1044, y: 822 },
  { x: 964, y: 802 },
  { x: 880, y: 780 },
  { x: 818, y: 764 },
  { x: 806, y: 718 },
  { x: 800, y: 664 },
  { x: 804, y: 600 },
];

function ridePath(u: number): { x: number; y: number; angle: number } {
  const c = Math.max(0, Math.min(0.9999, u)) * (RIDE.length - 1);
  const i = Math.floor(c);
  const f = c - i;
  const a = RIDE[i];
  const b = RIDE[Math.min(RIDE.length - 1, i + 1)];
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
}

const RootSystem: React.FC<{ grown: number; t: number }> = ({ grown, t }) => {
  const edge = mixHex(kidTheme.earth, kidTheme.ink, 0.42);
  const wall = mixHex(kidTheme.earth, kidTheme.paper, 0.3);
  const inner = mixHex(kidTheme.water, kidTheme.paper, 0.58);
  const all = [...TAP, ...LATERAL];
  const stroke = (
    key: string,
    colour: string,
    delta: number,
    opacity: number,
  ): React.ReactNode[] =>
    all.map((seg, i) => (
      <path
        key={`${key}${i}`}
        d={seg.d}
        fill="none"
        stroke={colour}
        strokeWidth={Math.max(1, seg.w + delta)}
        strokeLinecap="round"
        opacity={opacity}
      />
    ));
  return (
    <WideLayer opacity={grown}>
      {/* Hairs first: they come off the root's own line, they point down and
          out the way a real one does, and they are most of what stops the
          tube reading as a pipe. */}
      {Array.from({ length: 18 }, (_, i) => {
        const u = i / 17;
        const side = i % 2 ? 1 : -1;
        const from = { x: 800 + u * 54 + side * (46 + u * 26), y: 580 + u * 380 };
        const len = 34 + ((i * 37) % 44);
        return (
          <path
            key={i}
            d={`M ${from.x} ${from.y} q ${side * len * 0.6} ${len * 0.42} ${side * len} ${len * 0.9}`}
            stroke={wall}
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
            opacity={0.8}
          />
        );
      })}
      {/* Wall, fill, interior: the same five segments at three widths. */}
      {stroke("edge", edge, 10, 1)}
      {stroke("fill", wall, 0, 1)}
      {stroke("bore", inner, -46, 0.5)}
      {/* One slow highlight down the inside of the bore, so the slide is wet. */}
      {TAP.map((seg, i) => (
        <path
          key={`shine${i}`}
          d={seg.d}
          fill="none"
          stroke={kidTheme.shine}
          strokeWidth={Math.max(1, seg.w - 116)}
          strokeLinecap="round"
          opacity={0.16 * (0.7 + 0.3 * Math.sin(t * 1.2 - i))}
          transform={`translate(${-seg.w * 0.16} 0)`}
        />
      ))}
    </WideLayer>
  );
};

/**
 * The straw: water climbing. Six drops on one loop, rising through the root
 * and on up the stem — the mechanism as a picture, running under whatever is
 * being said over it.
 */
const WaterColumn: React.FC<{ t: number; topY: number; strength: number }> = ({
  t,
  topY,
  strength,
}) => {
  if (strength <= 0) return null;
  return (
    <WideLayer>
      {Array.from({ length: 7 }, (_, i) => {
        const u = ((t * 0.32 + i / 7) % 1);
        // Up the root to the surface, then up the (much thinner) stem. Below
        // ground it rides the taproot's own spine, so the column is inside the
        // bore rather than beside it.
        const y = 900 - (900 - topY) * u;
        const inRoot = y > CUT.surface;
        const x =
          (inRoot ? 802 + 46 * Math.max(0, (y - 700) / 200) - 4 * Math.max(0, (700 - y) / 200) : ROOT_TOP.x) +
          Math.sin(t * 1.6 + i) * 2;
        const r = inRoot ? 14 : 7;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={r}
            ry={r * 1.25}
            fill={kidTheme.waterLight}
            stroke={kidTheme.water}
            strokeWidth={3}
            opacity={strength * (inRoot ? 0.85 : 0.95)}
          />
        );
      })}
    </WideLayer>
  );
};

/** The world for a cutaway scene: two plates, a horizon-free sky, no volcano. */
const CutawayWorld: React.FC<{
  phase?: number;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ phase = 0, overlay, children }) => (
  <AbsoluteFill
    style={{
      background: kidTheme.paper,
      fontFamily: kidTheme.fontFamily,
      color: kidTheme.ink,
      lineHeight: "normal",
      overflow: "hidden",
    }}
  >
    <PlateLayer
      which="grass_close"
      seat={CUT.surface}
      row={CUT.crest}
      to={CUT.surface}
      phase={phase}
      drift={3}
    />
    <PlateLayer which="soil_cutaway" row={null} from={CUT.surface} phase={phase + 1.4} drift={3} />
    {/* The seam: a rim of the plate's own dirt colour along the surface, and
        a little crumb texture, so the two plates meet on a line that reads as
        ground rather than as a join. */}
    <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.ground }}>
      <WideLayer>
        {/* The ground line. Drawn with a wobble and a lip: seated flat it is a
            ruled line across the frame, which reads as a diagram rather than
            as somewhere a plant lives. */}
        <path
          d={
            `M ${WIDE.x} ${CUT.surface + 4}` +
            ` C 240 ${CUT.surface - 26} 520 ${CUT.surface + 16} 760 ${CUT.surface - 6}` +
            ` C 1010 ${CUT.surface - 28} 1330 ${CUT.surface + 18} 1620 ${CUT.surface - 10}` +
            ` C 1760 ${CUT.surface - 24} 1860 ${CUT.surface + 4} ${WIDE.x + WIDE.w} ${CUT.surface - 2}` +
            ` L ${WIDE.x + WIDE.w} ${CUT.surface + 58} L ${WIDE.x} ${CUT.surface + 58} Z`
          }
          fill={PLATES.grass_close.grass}
        />
        {/* Grass roots hanging off the underside of the turf, all the way
            across: the field above is made of plants too. */}
        {Array.from({ length: 19 }, (_, i) => {
          const x = -40 + i * 108 + ((i * 53) % 46);
          if (x > 680 && x < 960) return null;
          const len = 18 + ((i * 29) % 62);
          const side = i % 2 ? 1 : -1;
          return (
            <path
              key={`r${i}`}
              d={`M ${x} ${CUT.surface + 40} q ${side * 10} ${len * 0.6} ${side * 6} ${len}`}
              stroke={mixHex(kidTheme.earth, kidTheme.paper, 0.22)}
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
              opacity={0.6}
            />
          );
        })}
        {/* Crumbs and small stones, so the soil has a scale. */}
        {Array.from({ length: 40 }, (_, i) => {
          const x = -60 + ((i * 421) % 2040);
          const y = CUT.surface + 70 + ((i * 197) % 460);
          const r = 4 + ((i * 13) % 11);
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={r}
              ry={r * (0.6 + ((i * 7) % 5) / 10)}
              fill={mixHex(kidTheme.earth, kidTheme.ink, i % 3 ? 0.42 : 0.06)}
              opacity={0.3}
              transform={`rotate(${(i * 37) % 60} ${x} ${y})`}
            />
          );
        })}
      </WideLayer>
    </div>
    <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.cast }}>{children}</div>
    {overlay ? (
      <AbsoluteFill style={{ zIndex: MEADOW_Z.overlay, pointerEvents: "none" }}>{overlay}</AbsoluteFill>
    ) : null}
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Scene 14 — The straw
// ---------------------------------------------------------------------------

const S14_BUBBLES: Record<string, string> = {
  a2_22_drip: "The door is in the dirt?",
  a2_23_drip: "An uphill waterslide!",
  a2_25_drip: "I am the plumbing!",
  a2_26_pip: "Height. Put it on the building.",
  a2_27_pip: "It will do.",
  a2_28_drip: "I am the best water ever!",
  a2_30_drip: "Oh. Then I accept.",
};

const StrawScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage(scene);
  const [soakFrom, soakTo] = lineWindow(scene, "a2_21_narrator");
  const [slideFrom, slideTo] = lineWindow(scene, "a2_23_drip");
  const [strawFrom] = lineWindow(scene, "a2_24_narrator");
  const [plumbFrom, plumbTo] = lineWindow(scene, "a2_25_drip");

  // --- the three held beats ------------------------------------------------
  // Stamp-chain firing 3 (30f), Drip's outrage (36f) and the Narrator's button
  // (45f). Held beats are SPINE-ONLY and this scene's spine is both of the
  // bodies in it, so both of them go still — and so does the plumbing, which is
  // the one thing in the frame that is genuinely *travelling*. Read off the
  // beats rather than typed, so re-synthesising a line moves the freeze with it.
  const holds = [
    heldBeat(scene, "a2_27_pip"),
    heldBeat(scene, "a2_28_drip"),
    heldBeat(scene, "a2_29_narrator"),
  ] as const;
  const held = holds.some(([from, to]) => frame >= from && frame < to);
  const flow = heldClock(frame, holds) / fps;

  // --- the ride -----------------------------------------------------------
  // She lands on the surface, soaks in through the Narrator's line, is pulled
  // sideways to the root's tip, and then rides the interior up. One `u` along
  // one path, so the water, the root and the rider cannot disagree.
  const sink = kidEase.easeInOutSine((frame - (soakFrom + 24)) / Math.max(1, soakTo - soakFrom - 10));
  const climb = kidEase.easeInOutSine((frame - (slideFrom + 14)) / Math.max(1, slideTo - slideFrom - 6));
  const along = Math.min(1, sink * 0.42 + climb * 0.58);
  const ride = ridePath(along);
  // Above the surface she is still a raindrop falling; below it she is in the
  // ground. The handoff is the surface line itself.
  const entering = frame < soakFrom + 24;
  const dripY = entering
    ? interpolate(frame, [0, soakFrom + 24], [-160, RIDE[0].y], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: kidEase.gravity,
      })
    : ride.y;
  const dripX = entering ? RIDE[0].x : ride.x;

  // --- GERMINATION --------------------------------------------------------
  // A capability unlock, not a time-lapse: the case cracks, the sprout comes
  // up, and Pip is taller for the rest of her life. It runs under the end of
  // "I am the plumbing!" and finishes as she says "Height. Finally."
  const germAt = plumbFrom + Math.round((plumbTo - plumbFrom) * 0.6);
  const germ = kidEase.easeInOutSine((frame - germAt) / 56);
  const crack = Math.max(0, Math.min(1, (frame - germAt) / 26));

  // --- the faces ----------------------------------------------------------
  // NO_LEAD everywhere: three held beats in this scene, and the stamp is one
  // of them.
  const pipEmotion = useEmotion(
    scene,
    "pip",
    { a2_26_pip: "proud", a2_27_pip: PIP_RESTING },
    PIP_RESTING,
    NO_LEAD,
  );
  const dripEmotion = useEmotion(
    scene,
    "drip",
    {
      a2_22_drip: "amazed",
      a2_23_drip: "excited",
      a2_25_drip: "proud",
      a2_28_drip: "grumpy",
      a2_30_drip: "happy",
    },
    "happy",
    NO_LEAD,
  );

  const pipMark: Mark = {
    x: ROOT_TOP.x,
    y: CUT_PIP_Y,
    scale: CUT.pip,
    who: "pip",
    state: germ > 0 ? "sprout" : "planted",
    morph: germ,
    side: "left",
    offset: 360,
  };
  // The mark is the y the BODY is drawn at, not the raw ride y: `hover` is what
  // turns a centre into a `CharacterFrame` y, and every look in this scene aims
  // through `centreOf(dripMark)`. Feeding it `dripY` aimed Pip's eyes 125px
  // below Drip's face for the whole cutaway.
  const dripMark: Mark = { x: dripX, y: hover("drip", dripY, CUT_DRIP), scale: CUT_DRIP, who: "drip" };

  return (
    <CutawayWorld
      phase={2.2}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ pip: pipMark, drip: dripMark } as Cast}
          text={S14_BUBBLES}
          at={{
            a2_22_drip: { x: 1440, y: 640, tail: "left", tailAt: 1180 },
            a2_23_drip: { x: 1420, y: 782, tail: "left", tailAt: 1150 },
            a2_25_drip: { x: 1400, y: 700, tail: "left", tailAt: 1120 },
            a2_28_drip: { x: 1400, y: 700, tail: "left", tailAt: 1120 },
            a2_30_drip: { x: 1400, y: 700, tail: "left", tailAt: 1120 },
          }}
        />
      }
    >
      <RootSystem grown={1} t={flow} />
      <WaterColumn
        t={flow}
        topY={germ > 0.2 ? CUT.surface - 150 * germ : CUT.surface - 20}
        strength={Math.max(0, Math.min(1, (frame - strawFrom) / 40))}
      />
      {/* The seed case, cracking. Two shards and a puff of crumbs: the unlock
          has to be an event, not a dissolve. */}
      <SeedCrack x={ROOT_TOP.x} y={CUT.surface} u={crack} />
      <Pip
        x={ROOT_TOP.x}
        y={CUT_PIP_Y}
        scale={CUT.pip}
        state={germ > 0 ? "sprout" : "planted"}
        morph={germ}
        phase={PHASE.pip}
        emotion={pipEmotion}
        speaking={stage.speaking("pip")}
        look={useLookAtSpeaker(scene, { pip: pipMark, drip: dripMark } as Cast, "pip", "camera")}
        idle={held ? HELD_IDLE : 1}
        eyeLife={held ? 0 : 1}
      />
      <Drip
        x={dripX}
        y={dripMark.y}
        scale={CUT_DRIP}
        feet={entering || along > 0.98}
        shadow={false}
        pose={along > 0.2 && along < 0.95 ? "cheer" : "rest"}
        phase={PHASE.drip}
        emotion={dripEmotion}
        speaking={stage.speaking("drip")}
        look={useLookAtSpeaker(scene, { pip: pipMark, drip: dripMark } as Cast, "drip", "camera")}
        idle={held ? HELD_IDLE : 1}
        eyeLife={held ? 0 : 1}
      />
    </CutawayWorld>
  );
};

/** The case cracking open: two shards, a crumb of soil, one frame of event. */
const SeedCrack: React.FC<{ x: number; y: number; u: number }> = ({ x, y, u }) => {
  if (u <= 0 || u >= 1) return null;
  const out = kidEase.easeOutCubic(u);
  const fade = 1 - kidEase.easeInOutSine(Math.max(0, (u - 0.5) / 0.5));
  return (
    <WideLayer opacity={fade}>
      {([-1, 1] as const).map((s) => (
        <path
          key={s}
          d="M -34 0 Q -6 -30 34 -8 Q 6 12 -34 0 Z"
          fill="#f3ddb0"
          stroke={kidTheme.ink}
          strokeWidth={5}
          transform={`translate(${x + s * (30 + out * 96)} ${y - 96 - out * 54}) rotate(${s * out * 78})`}
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => {
        const a = -0.4 - i * 0.34;
        return (
          <circle
            key={i}
            cx={x + Math.cos(a) * (40 + out * 92)}
            cy={y - 20 + Math.sin(a) * (26 + out * 52)}
            r={5 + (i % 3) * 2}
            fill={mixHex(kidTheme.earth, kidTheme.ink, 0.2)}
          />
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 15 — Credit, and the first swerves
// ---------------------------------------------------------------------------

const S15_BUBBLES: Record<string, string> = {
  a2_31_drip: "That sprout is mine.",
  a2_32_ray: "Half yours. Something lifted it.",
  a2_33_drip: "By a large warm colleague.",
  a2_34_ray: "The lift is powered by somebody.",
  a2_35_pip: "Do not say it.",
  a2_36_ray: "Everybody knows it.",
  a2_37_sunny: "The lift is ME!",
  a2_38_sunny: "You're welcome! HA! HA!",
  a2_39_ray: "That is also true.",
  a2_40_pip: "Stop confirming him.",
  a2_41_ray: "I am contractually honest.",
};

/**
 * The five, quietly. The rain watered everybody, so the whole packet comes up
 * in the background of this scene — nobody names them, nobody looks at them,
 * and Scene 29 says goodbye to them by name at dusk. Planting the picture is
 * the entire job here.
 */
const SPROUT_ROW = [
  { x: 236, ground: 812, at: 300 },
  { x: 470, ground: 776, at: 332 },
  { x: 1180, ground: 790, at: 360 },
  { x: 1452, ground: 832, at: 388 },
  { x: 1734, ground: 878, at: 418 },
] as const;

const SproutRow: React.FC<{ frame: number; t: number }> = ({ frame, t }) => (
  <WideLayer>
    {SPROUT_ROW.map((s, i) => {
      const u = kidEase.easeOutBack(Math.max(0, Math.min(1, (frame - s.at) / 26)), 1.2);
      if (u <= 0) return null;
      const h = 54 * u;
      const sway = Math.sin(t * 0.9 + i * 1.4) * 3;
      return (
        <g key={s.x} transform={`translate(${s.x} ${s.ground}) rotate(${sway.toFixed(2)})`}>
          <ellipse cx={0} cy={2} rx={26} ry={7} fill={kidTheme.earth} opacity={0.8} />
          <path
            d={`M -5 0 L -4 ${-h} L 4 ${-h} L 5 0 Z`}
            fill={kidTheme.grass}
            stroke={kidTheme.ink}
            strokeWidth={4}
          />
          {([-1, 1] as const).map((side) => (
            <ellipse
              key={side}
              cx={side * 22 * u}
              cy={-h - 4}
              rx={22 * u}
              ry={13 * u}
              fill="#63d16b"
              stroke={kidTheme.ink}
              strokeWidth={4}
            />
          ))}
          <circle cx={-6} cy={-h - 16} r={2.6} fill={kidTheme.ink} opacity={u} />
          <circle cx={6} cy={-h - 16} r={2.6} fill={kidTheme.ink} opacity={u} />
        </g>
      );
    })}
  </WideLayer>
);

/**
 * Drip, half out of the plumbing.
 *
 * The script asks for "Drip's face visible in the stem cross-section (she
 * lives here now)", and in a wide that is not stageable: Pip's stem is thirty
 * units across, which at 0.72 is twenty pixels — narrower than one of Drip's
 * eyes. **Flagged deviation, same idea:** she is up out of the top of the root
 * beside the stem, head and shoulders above the dirt, with the water column
 * still visibly climbing past her. She lives here now; you can see her doing
 * it.
 */
const S15_DRIP = { x: 604, y: 720, scale: 0.52 } as const;

/**
 * **Ray's mark in Scene 15, and it moved in the B3 repair pass.**
 *
 * He used to park in the sky at (1236, 344), which is where `SUNNY_AT` is once
 * the sun is on the side of frame the rest of the episode keeps him on — the
 * two bodies overlapped completely. So he comes down instead, to act 1's own
 * hover height (`S7_RAY.cy` = 800), on Pip's right, over the field: the same
 * picture act 1 ends on, mirrored. Scale 0.84 rather than 1, because down here
 * he is next to a 0.72 Pip rather than alone in an empty sky, and act 1 plays
 * him at 0.8 in exactly this framing.
 */
const S15_RAY = { x: 1300, y: 800, scale: 0.84 } as const;

const CreditScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [rayLineFrom] = lineWindow(scene, "a2_32_ray");
  const [sunnyFrom] = lineWindow(scene, "a2_37_sunny");
  const [haFrom, haTo] = lineWindow(scene, "a2_38_sunny");

  // Ray angles down out of the sky and is parked well before he speaks — an
  // entrance that finishes under somebody else's line is an entrance nobody
  // has to be told about. He comes in frame RIGHT and settles over the field on
  // Pip's right, clear of the old tree (canopy from x≈1408) and well under it.
  const rayU = (frame - 6) / Math.max(1, rayLineFrom - 26);
  const rayIn = moveAlong({ x: 2260, y: 214 }, { x: S15_RAY.x, y: S15_RAY.y }, rayU, {
    arc: 0.2,
    ease: kidEase.easeInOutSine,
  });
  // THE STOOP. Tangent bank while he is travelling — clamped, because
  // `moveAlong`'s tangent goes vertical at the very end of a bowed path and a
  // pedant who cartwheels in is a different character — settling over the last
  // fifth into the ribbon tipped down toward her mark, and staying there.
  const rayBank =
    travelBank(rayIn.angle) +
    (stoopTo(S15_RAY.x, PIP_WIDE.x) - travelBank(rayIn.angle)) *
      interpolate(rayU, [0.8, 1], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: kidEase.easeInOutSine,
      });

  // Sunny interrupts a scene that is not about him (ep-2 pattern, no ceiling
  // — three firings this episode and every one of them true). He has been up
  // there the whole time on **his** side of frame (`SUNNY_AT`, act 1's mark,
  // act 3's within six pixels) and small; the interruption is him coming
  // *closer*, not appearing — which is act 1's grammar for the same beat in
  // Scenes 6 and 10, a swell on a body that was already there.
  const barge = kidEase.easeOutBack(Math.max(0, Math.min(1, (frame - (sunnyFrom - 12)) / 30)), 1.25);
  const sunnyScale = SUNNY_AT.scale * (0.64 + 0.54 * barge);
  const sunny = {
    x: SUNNY_AT.x,
    y: hover("sunny", SUNNY_AT.cy, sunnyScale),
    scale: sunnyScale,
  };

  // **THE LEAN — wordless firing.** Her stem drifts sunward under the HA! HA!
  // and snaps back. Sunny is frame RIGHT — he is frame right in every scene of
  // this episode — so the lean is positive, the same direction as act 1's two
  // firings (+11 in Scene 5, +12 in Scene 7). The whole gag of the runner is
  // that the direction is not hers, it is his, which only works while it is the
  // same direction every time.
  const lean = pipLean(frame, [{ at: haFrom + 4, to: 11, snapAt: haTo + 10 }]);

  const pipMark: Mark = {
    ...PIP_WIDE,
    who: "pip",
    state: "sprout",
    side: "right",
    offset: 340,
  };
  const dripMark: Mark = { x: S15_DRIP.x, y: S15_DRIP.y, scale: S15_DRIP.scale, who: "drip", side: "left" };
  const rayMark: Mark = { x: rayIn.x, y: rayIn.y, scale: S15_RAY.scale, who: "ray", side: "left" };
  const sunnyMark: Mark = { x: sunny.x, y: sunny.y, scale: sunny.scale, who: "sunny", side: "left" };
  const cast = { pip: pipMark, drip: dripMark, ray: rayMark, sunny: sunnyMark } as Cast;

  const pipEmotion = useEmotion(
    scene,
    "pip",
    { a2_35_pip: "grumpy", a2_40_pip: "grumpy" },
    PIP_RESTING,
  );
  const dripEmotion = useEmotion(scene, "drip", { a2_31_drip: "proud", a2_33_drip: "happy" }, "happy");
  const rayEmotion = useEmotion(
    scene,
    "ray",
    { a2_32_ray: "neutral", a2_36_ray: "skeptical", a2_39_ray: "sad", a2_41_ray: "neutral" },
    "neutral",
  );

  return (
    <PlateWorld
      plate="meadow_day"
      phase={7.4}
      overlay={<Bubbles scene={scene} cast={cast} text={S15_BUBBLES} />}
    >
      {/* Behind everything, the way act 1 draws it: the warm field is the
          light in the shot, not a sticker on top of the cast. */}
      <SunGlow
        x={SUNNY_AT.x}
        y={SUNNY_AT.cy}
        r={202 * sunny.scale * 3}
        strength={0.3 + 0.1 * barge}
      />
      <SproutRow frame={frame} t={t} />
      <DirtPatch x={PIP_WIDE.x} y={MEADOW.ground} />
      {/* The straw, still running, up a stem that now has one. */}
      <WideLayer>
        {Array.from({ length: 4 }, (_, i) => {
          const u = (t * 0.3 + i / 4) % 1;
          return (
            <ellipse
              key={i}
              cx={PIP_WIDE.x + lean * 0.5}
              cy={MEADOW.ground - 20 - 88 * u}
              rx={4.5}
              ry={6}
              fill={kidTheme.waterLight}
              opacity={0.9 * (1 - u * 0.4)}
            />
          );
        })}
      </WideLayer>
      <Pip
        x={PIP_WIDE.x}
        y={PIP_WIDE.y}
        scale={PIP_WIDE.scale}
        state="sprout"
        lean={lean}
        phase={PHASE.pip}
        emotion={pipEmotion}
        speaking={stage.speaking("pip")}
        look={useLookAtSpeaker(scene, cast, "pip", "camera")}
      />
      {/* Drip, up out of the plumbing, with the dirt drawn back over her so
          she is IN it rather than standing in front of it. */}
      <Drip
        x={S15_DRIP.x}
        y={S15_DRIP.y}
        scale={S15_DRIP.scale}
        feet={false}
        shadow={false}
        phase={PHASE.drip}
        emotion={dripEmotion}
        speaking={stage.speaking("drip")}
        look={useLookAtSpeaker(scene, cast, "drip", "camera")}
      />
      {/* The dirt drawn back OVER her, so she is coming out of the ground
          rather than standing in front of a brown ellipse. */}
      <WideLayer>
        <ellipse cx={S15_DRIP.x} cy={MEADOW.ground - 22} rx={122} ry={30} fill={kidTheme.earth} />
        <ellipse
          cx={S15_DRIP.x}
          cy={MEADOW.ground - 22}
          rx={122}
          ry={30}
          fill="none"
          stroke={kidTheme.ink}
          strokeWidth={5}
          opacity={0.4}
        />
      </WideLayer>
      <Ray
        x={rayIn.x}
        y={rayIn.y}
        scale={S15_RAY.scale}
        brightness={RAY_LIGHT}
        // A whisper of the seven in the ribbon. It is what makes him read as
        // *light* against a blue sky rather than as a pale worm — the ink
        // outline the first pass tried did the opposite, and drew a bone.
        spectrum={0.35}
        bank={rayBank}
        streak={rayU < 1 ? 0.5 : 0}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        look={useLookAtSpeaker(scene, cast, "ray", "down")}
      />
      {/* A beam's worth of shade under the floater, so a flat-filled body sits
          on the painted field rather than in front of it. Act 1's Scene 10. */}
      <KidContactShadow x={rayIn.x} y={MEADOW.ground + 8} rx={150} ry={26} strength={0.16} />
      <Sunny
        x={sunny.x}
        y={sunny.y}
        scale={sunny.scale}
        phase={PHASE.sunny}
        emotion="proud"
        speaking={stage.speaking("sunny")}
        look={useLookAtSpeaker(scene, cast, "sunny", "down")}
      />
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 16 — Nobody eats dirt (and the leaf)
// ---------------------------------------------------------------------------

const S16_BUBBLES: Record<string, string> = {
  a2_43_drip: "Do you eat the dirt?",
  a2_44_drip: "I have been mud. Delicious.",
  a2_45_pip: "Nobody eats dirt.",
  a2_47_pip: "A leaf. Somewhere to cook.",
  a2_49_pip: "You. Sky. Stand by.",
  a2_50_ray: "Green is the catching colour.",
  a2_51_drip: "So what is dirt for?",
  a2_52_pip: "Where I keep my feet.",
};

/** Where Drip lives now: the top of the root, just under the surface. */
const S16_DRIP = { x: 806, y: 700, scale: CUT_DRIP } as const;

/**
 * Ray's mark in the cutaway: frame right of the stem, above the surface.
 *
 * **He hangs low, and the reason is his own bubble.** The sky band in this
 * framing is only 520px deep and a bubble's centre cannot go above y=170
 * (`Bubbles` clamps it), so any bubble in this shot has its lower edge at
 * y≈270 at best. At his old y=268 his face sat at `faceOf("ray", 268, 0.72)`
 * = 264 — inside every bubble the shot can draw, and his six-second line
 * played with his face behind his own words. Dropped to 360 his crown is at
 * 290 and his face at 356, clear underneath the bubble with the tail coming
 * down onto him; his box bottom is 482, still 38px clear of the surface.
 */
const S16_RAY = { x: 1352, y: 360, scale: 0.72 } as const;

const LeafScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [watchFrom, watchTo] = lineWindow(scene, "a2_46_narrator");
  const [pointFrom] = lineWindow(scene, "a2_49_pip");
  const [rayLineFrom, rayLineTo] = lineWindow(scene, "a2_50_ray");

  // --- THE LEAF UNFURLS ---------------------------------------------------
  // In real time, on "Watch what they do instead." It opens width-first (a
  // rolled leaf unrolls) — that is `Pip`'s own `grow`, driven from the morph.
  const leafAt = watchTo - 58;
  const morph = kidEase.easeInOutSine((frame - leafAt) / 64);

  // --- THE POINTER --------------------------------------------------------
  // Her first one. Before this she could only lean at the world; the unlock is
  // demonstrated the instant it exists, on "You. Sky. Stand by for orders."
  const point = interpolate(frame, [pointFrom + 6, pointFrom + 34], [-4, 78], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutBack,
  });

  // Ray angles back in — he was on Pip's right at the end of Scene 15 and comes
  // in on her right here, arriving before his line and staying for it. Same
  // stoop as Scene 15's: the tangent while he travels, clamped, settling into
  // the ribbon tipped down toward her mark over the last fifth of the path.
  // `arc` is 0.09 rather than the kit default because his mark came down to
  // y=360: the bow sags (the arc bows left of a leftward-and-downward move,
  // which is down), and at 0.16 the sag put the low end of his ribbon *through*
  // the surface line around frame 15060 — a sunbeam swimming in the soil, in a
  // shot whose whole job is that the surface is a hard boundary. At 0.09 the
  // deepest point of the flight is where it was before he was moved.
  const rayU = (frame - (rayLineFrom - 250)) / 170;
  const rayIn = moveAlong({ x: 2280, y: 150 }, { x: S16_RAY.x, y: S16_RAY.y }, rayU, {
    arc: 0.09,
    ease: kidEase.easeInOutSine,
  });
  const rayBank =
    travelBank(rayIn.angle) +
    (stoopTo(S16_RAY.x, ROOT_TOP.x) - travelBank(rayIn.angle)) *
      interpolate(rayU, [0.8, 1], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: kidEase.easeInOutSine,
      });

  // --- the two held beats --------------------------------------------------
  // "Nobody eats dirt." (36f) and the scene's trailing button, "It's where I
  // keep my feet." (45f) — the beat that *is* the tail. Spine-only: the three
  // bodies go still and the water column stops climbing, on the same clock that
  // gives the frames back afterwards. The leaf and the pointer are held poses
  // rather than motion, so they simply stay where they are.
  const holds = [heldBeat(scene, "a2_45_pip"), heldBeat(scene, "a2_52_pip")] as const;
  const held = holds.some(([from, to]) => frame >= from && frame < to);
  const flow = heldClock(frame, holds) / fps;

  // NO_LEAD: two held beats, one of them the scene's trailing button.
  const pipEmotion = useEmotion(
    scene,
    "pip",
    { a2_45_pip: PIP_RESTING, a2_47_pip: "proud", a2_49_pip: "proud", a2_52_pip: PIP_RESTING },
    PIP_RESTING,
    NO_LEAD,
  );
  const dripEmotion = useEmotion(
    scene,
    "drip",
    { a2_43_drip: "happy", a2_44_drip: "proud", a2_51_drip: "neutral" },
    "happy",
    NO_LEAD,
  );
  const rayEmotion = useEmotion(scene, "ray", { a2_50_ray: "happy" }, "neutral", NO_LEAD);

  const pipMark: Mark = {
    x: ROOT_TOP.x,
    y: CUT_PIP_Y,
    scale: CUT.pip,
    who: "pip",
    state: "leaf",
    morph,
    side: "left",
    offset: 380,
  };
  const dripMark: Mark = {
    x: S16_DRIP.x,
    y: hover("drip", S16_DRIP.y, S16_DRIP.scale),
    scale: S16_DRIP.scale,
    who: "drip",
  };
  const rayMark: Mark = { x: rayIn.x, y: rayIn.y, scale: S16_RAY.scale, who: "ray", side: "left" };
  const cast = { pip: pipMark, drip: dripMark, ray: rayMark } as Cast;

  return (
    <CutawayWorld
      phase={3.9}
      overlay={
        <Bubbles
          scene={scene}
          cast={cast}
          text={S16_BUBBLES}
          at={{
            a2_43_drip: { x: 1436, y: 704, tail: "left", tailAt: 1140 },
            a2_44_drip: { x: 1436, y: 704, tail: "left", tailAt: 1140 },
            a2_51_drip: { x: 1436, y: 704, tail: "left", tailAt: 1140 },
            // Ray's, and it has two things to miss. At the default offset its
            // lower edge sat on the new leaf, the one thing this scene is
            // asking the audience to look at; pinned hard right at x=1430 it
            // was squeezed to 500px by the frame edge, went four lines tall,
            // and covered Ray's own face for the whole line. At x=1280 it has
            // room to wrap two lines instead of four (~570×200, so its lower
            // edge is at 270), it starts at 995 — clear of her crown at 930
            // and of the leaf below that — and Ray now hangs beneath it with
            // the tail coming down on his mark.
            a2_50_ray: { x: 1280, y: 170, tail: "right", tailAt: S16_RAY.x },
          }}
        />
      }
    >
      <RootSystem grown={1} t={flow} />
      <WaterColumn t={flow} topY={CUT.surface - 190} strength={1} />
      <Pip
        x={ROOT_TOP.x}
        y={CUT_PIP_Y}
        scale={CUT.pip}
        state="leaf"
        morph={morph}
        point={frame >= pointFrom ? point : undefined}
        pointSide="right"
        phase={PHASE.pip}
        emotion={pipEmotion}
        speaking={stage.speaking("pip")}
        look={useLookAtSpeaker(scene, cast, "pip", "camera")}
        idle={held ? HELD_IDLE : 1}
        eyeLife={held ? 0 : 1}
      />
      {/* "The green you see is the bit it sends back to you." The pedagogy as
          a picture, under the clause that says it: a few green motes leaving
          the new leaf, towards camera. Faint — it is a detail the script
          mandates and forbids anybody remarking on. */}
      <GreenBounce
        x={ROOT_TOP.x + 150}
        y={CUT.surface - 210}
        t={t}
        strength={frame > rayLineFrom + 70 && frame < rayLineTo + 30 ? 1 : 0}
      />
      <Drip
        x={S16_DRIP.x}
        y={dripMark.y}
        scale={S16_DRIP.scale}
        feet={false}
        shadow={false}
        phase={PHASE.drip}
        emotion={dripEmotion}
        speaking={stage.speaking("drip")}
        look={useLookAtSpeaker(scene, cast, "drip", "up")}
        idle={held ? HELD_IDLE : 1}
        eyeLife={held ? 0 : 1}
      />
      <Ray
        x={rayIn.x}
        y={rayIn.y}
        scale={S16_RAY.scale}
        brightness={RAY_LIGHT}
        spectrum={0.4}
        bank={rayBank}
        streak={rayU < 1 ? 0.45 : 0}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        look={useLookAtSpeaker(scene, cast, "ray", "down")}
        idle={held ? HELD_IDLE : 1}
        eyeLife={held ? 0 : 1}
      />
    </CutawayWorld>
  );
};

/** The bit the leaf sends back: six slow green motes, towards camera. */
const GreenBounce: React.FC<{ x: number; y: number; t: number; strength: number }> = ({
  x,
  y,
  t,
  strength,
}) => {
  if (strength <= 0) return null;
  return (
    <WideLayer>
      {Array.from({ length: 6 }, (_, i) => {
        const u = ((t * 0.5 + i / 6) % 1);
        return (
          <circle
            key={i}
            cx={x + 60 * u + Math.sin(t * 1.3 + i * 1.7) * 14}
            cy={y - 40 * u + Math.cos(t + i) * 10}
            r={9 + 13 * u}
            fill="#63d16b"
            opacity={strength * 0.6 * (1 - u)}
          />
        );
      })}
    </WideLayer>
  );
};

export const ACT2_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s11_rain_campaign: RainCampaignScene,
  s12_cloud_hotel: CloudHotelScene,
  s13_weather: WeatherScene,
  s14_straw: StrawScene,
  s15_credit: CreditScene,
  s16_leaf: LeafScene,
};
