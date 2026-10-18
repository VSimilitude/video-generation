import React from "react";
import { Img, staticFile } from "remotion";
import {
  AbsoluteFill,
  Bubbles,
  CHANT_SYLLABLES,
  CHAR_BOX,
  Camera,
  Cast,
  Drip,
  MEADOW,
  MEADOW_Z,
  NO_LEAD,
  PHASE,
  PIP_COLOR,
  PLATES,
  Pip,
  Puff,
  RAY_LIGHT,
  Ray,
  SleepingVolcano,
  SoftShade,
  Sunny,
  VOLCANO_AT,
  WIDTH,
  HEIGHT,
  WideLayer,
  emotionAt,
  heldBeat,
  interpolate,
  kidEase,
  kidInkOutline,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  LEAN_FULL,
  lineWindow,
  mixHex,
  pipCrownLocal,
  pipLean,
  project,
  settleWave,
  spring,
  stand,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cam,
  type Emotion,
  type Mark,
  type TimedScene,
} from "./common";
import { BACKGROUNDS } from "../backgroundManifest";

// ACT THREE — THE AIR, AND THE KITCHEN. Scenes 17–26 of script.md: the last
// ingredient, the trade, the tree, the crumb that breaks the stamp, the hire,
// the Big Word, and the button.
//
// It is the biggest act in the episode and it carries the whole emotional
// spine, which is why the effort inside this file is deliberately lopsided:
// scenes 22 to 26 (stall → hire → chant → stored sunshine → button) get the
// staging, the camera and the runners; 17 to 21 set the mechanism up and get
// out of the way.
//
// ---------------------------------------------------------------------------
// THE PLATES, AND WHY THIS FILE HAS ITS OWN WORLD COMPONENT
// ---------------------------------------------------------------------------
//
// `MeadowWorld` in `scenes/common.tsx` predates the painted plates (batch B2)
// and draws its own sky, far field and grass texture. Those three bands are
// exactly what a plate replaces, and `MeadowWorld` has no seam for one: its
// `children` render in the CAST layer, which is *above* the ground band, so a
// plate passed in as a child would paint over the volcano and the tree.
//
// `PlateWorld` below is therefore this act's world: the same z-discipline and
// the same geography constants, with the plate seated underneath and the
// near-field crest tinted from the plate instead of from the theme. It is a
// duplicate of `MeadowWorld`'s structure, and `OldTree` is a duplicate of its
// drawing (that component is module-private in common.tsx).
//
// **FLAGGED FOR THE SHOWRUNNER / THE RETRO:** `OldTree` and a plate-aware
// `MeadowWorld` belong in `scenes/common.tsx`, tinted once, so the three acts
// cannot drift into three trees and three seams. This file could not put them
// there without writing outside its brief.
//
// ---------------------------------------------------------------------------
// THE BOUNDARY CHECKLIST (STYLE, "A cut inside a continuous space")
// ---------------------------------------------------------------------------
//
//   16→17  (act two's cut into mine) **a cutaway→wide cut**, the same family as
//          20→21 in the other direction. Scene 16 ends inside act two's
//          `CutawayWorld` — the soil cross-section, Pip at 0.86 on a 520 ground
//          line — and 17 opens on the wide: same hero, same `leaf` state, back
//          on `MEADOW.pip.x` at 0.72 with the camera at 1.0 and the plate
//          `meadow_day`. What hands off is the character and her state, not the
//          framing; the size change is the shot changing. Paired still:
//          `ep4b3_repair3r/bd_15595.png` / `bd_15596.png`.
//   17→18  Puff is visible, at `PUFF_AT`, at his settled opacity, and the
//          plate and camera do not move across the cut. He arrives at the end
//          of 17 and is simply still there.
//   18→19  camera: 18 ends at 1.10 and 19 opens at 1.10 before pushing to the
//          leaf. Puff holds his mark and his opacity.
//   19→20  the beam that is on the leaf at the end of 19 is the beam Ray
//          arrives down at the top of 20 — his entrance is the light already
//          in the shot resolving into a body, so nobody pops in. It is drawn:
//          Scene 20 opens with that same beam still on the leaf, its landing
//          point travels to Ray's mark across the first fifty frames, and he
//          condenses at its foot as it dims (`beamTo`, `rayIn` below).
//   20→21  hard cut to the cutaway (`grass_close`, no horizon). Sanctioned:
//          `wide={false}` is the only way to be in this episode without a
//          volcano in it, and Scene 21 is the crumb, alone.
//   21→22  back to the wide, and the light has changed — golden hour. Pip is
//          on the same mark, in the same state, with the lean she was left
//          with (21 corrects hers; 22 is the first one she does not).
//   22→23  same plate, same grade, same marks, camera unmoved. The cut is a
//          reframe on the same second of the same evening.
//   23→24  time cut to dawn (the script's: "Shift starts at dawn." / "At
//          dawn, the oven clocked in."). New plate, new light, same marks.
//   24→25  camera: 24 ends at 1.0, 25 opens pushed to `S25_ZOOM` on the leaf.
//          A closer framing on the same plant, and the only scale change the
//          hero gets in the act.
//   25→26  25 ends at `S25_ZOOM` and 26 opens at exactly that number and
//          pulls back from it across `a3_78`, parking long before the hold.
//   26→27  (the recap's cut out of my act) my last frame is the sunset wide,
//          Pip young and leaning full, Sunny quiet. Paired stills:
//          `ep4b3_repair3r/bd_25471.png` / `bd_25472.png`.
//
// Paired stills either side of every cut are in `scratchpad/ep4b3_act3/` and
// (the repair pass) `scratchpad/ep4b3_repair3r/`.

// ---------------------------------------------------------------------------
// API 0 — the painted plate, seated
// ---------------------------------------------------------------------------

/** Every plate is generated at this size; `PLATES[k].scale` is relative to it. */
const PLATE_NATIVE = { w: 1344, h: 768 } as const;

type PlateKey = keyof typeof PLATES;

/**
 * **The seating arithmetic, and the one number the whole act's continuity
 * hangs off.**
 *
 * `PLATES[key].skyline` is the sky→land row as a fraction of the plate's
 * height (measured, B2). Draw the plate at `PLATES[key].scale` and slide it up
 * until that row lands on `MEADOW.horizon`, and the volcano — which is SVG,
 * because it breathes and smokes — stands ON the painted horizon rather than
 * in front of it or up in the sky. Horizontal crop is safe on every plate in
 * the set (backgrounds.mjs has the per-plate numbers; the two big crops are
 * edge-to-edge band skies with nothing composed in their corners).
 *
 * A plate with `skyline: null` has no horizon to seat — `grass_close` is a
 * dirt mound at arm's length — so those pass their own `scale` and `top`.
 */
function plateSeat(
  plate: PlateKey,
  opts?: { scale?: number; top?: number; dx?: number },
): { w: number; h: number; left: number; top: number } {
  const spec = PLATES[plate];
  const scale = opts?.scale ?? spec.scale;
  const w = PLATE_NATIVE.w * scale;
  const h = PLATE_NATIVE.h * scale;
  const left = (WIDTH - w) / 2 + (opts?.dx ?? 0);
  const top =
    opts?.top !== undefined
      ? opts.top
      : spec.skyline !== null
        ? MEADOW.horizon - spec.skyline * h
        : (HEIGHT - h) / 2;
  return { w, h, left, top };
}

/**
 * The plate itself.
 *
 * **The drift is horizontal only, and that is the seating rule showing its
 * teeth.** STYLE asks for a few pixels of motion so a painted plate is not a
 * slide the show forgot to animate; the ordinary `KidPaintedBackdrop` gets it
 * from translation *and* a hair of scale. Scale breathes the skyline row up
 * and down, which walks the painted horizon off the volcano's feet twice a
 * minute. A horizontal sine cannot: the skyline is a horizontal line, so
 * sliding along it changes nothing that was measured.
 *
 * `Img` rather than `<img>` for the usual reason — Remotion blocks the frame
 * until the plate has decoded, so a render never emits a frame with a hole in
 * it. The webp stays webp: Chrome decodes it, Remotion's ffmpeg cannot.
 */
const Plate: React.FC<{
  plate: PlateKey;
  /** Only on a plate with no `skyline`; a seated plate's scale is measured. */
  scale?: number;
  /** Only on a plate with no `skyline`: composition y of its top edge. */
  top?: number;
  dx?: number;
  /** Peak horizontal drift in px. 0 pins it (a scene about stillness). */
  drift?: number;
  phase?: number;
}> = ({ plate, scale, top, dx = 0, drift = 9, phase = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seat = plateSeat(plate, { scale, top, dx });
  // ~26s cycle, the same clock `KidPaintedBackdrop` uses, so two plates in the
  // same episode breathe at the same rate and only their phase differs.
  const wobble = Math.sin((frame / fps) * ((2 * Math.PI) / 26) + phase) * drift;
  return (
    <Img
      src={staticFile(BACKGROUNDS[plate])}
      style={{
        position: "absolute",
        left: seat.left + wobble,
        top: seat.top,
        width: seat.w,
        height: seat.h,
        display: "block",
        zIndex: 0,
      }}
    />
  );
};

/**
 * The near field, drawn on top of the plate's bottom band.
 *
 * Same crest as `MeadowWorld`'s, and it is here for the same two reasons: a
 * character standing on `MEADOW.ground` has to stand *in* a field rather than
 * on the seam of one, and the plates' painted grass fringe (tall blades, hard
 * edges, high detail) is exactly the low-detail lower third STYLE says the
 * characters own. The fill is sampled from the plate rather than taken from
 * `kidTheme` — `PLATES[key].grass` is the ep-2 `PAINTED_GREEN` precedent — so
 * the seam does not read as a colour error.
 */
const NearCrest: React.FC<{ grass: string; ground?: number }> = ({
  grass,
  ground = MEADOW.ground,
}) => {
  const face = mixHex(grass, kidTheme.grassDark, 0.14);
  const lip = mixHex(grass, kidTheme.paper, 0.24);
  const crest =
    `M ${-1400} ${ground - 46}` +
    ` Q ${WIDTH * 0.28} ${ground - 92} ${WIDTH * 0.62} ${ground - 54}` +
    ` Q ${WIDTH * 0.9} ${ground - 26} ${3320} ${ground - 62}`;
  return (
    <WideLayer zIndex={MEADOW_Z.ground}>
      <defs>
        {/* **A ramp rather than a swatch.** A flat fill butted against the
            plate draws a ruled horizontal line across the whole frame where
            the painted blades stop — visible in every still of the first
            pass. Fading it in over ~120px keeps the low-detail band the
            characters need and lets the painting die into it. */}
        <linearGradient id="a3-crest" x1="0" y1={ground - 92} x2="0" y2={ground + 90} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={face} stopOpacity={0} />
          <stop offset="0.55" stopColor={face} stopOpacity={0.72} />
          <stop offset="1" stopColor={face} stopOpacity={0.94} />
        </linearGradient>
      </defs>
      <path d={`${crest} L 3320 1880 L -1400 1880 Z`} fill="url(#a3-crest)" />
      {/* One pale lip along the crest so the near field has a top edge and
          does not read as a flat swatch laid over the painting. */}
      <path d={crest} stroke={lip} strokeWidth={6} fill="none" opacity={0.3} />
    </WideLayer>
  );
};

/**
 * The big old tree at the meadow's edge — **a copy of `MeadowWorld`'s, and
 * flagged as one** (see the header). It is drawn rather than painted because
 * Scene 20 pushes the camera INTO it, and a plate cannot survive that.
 *
 * The delivered plates have no tree in them at all (B2's prompts asked for one
 * and flux declined on every roll), so this drawing is the only tree in the
 * episode, which makes the duplication a continuity risk rather than a tidiness
 * one: acts one and two must be drawing the same object at the same x.
 */
const OldTree: React.FC<{ x: number; base: number; t: number }> = ({ x, base, t }) => {
  const sway = Math.sin(t * 0.42) * 1.5;
  return (
    <WideLayer>
      <g transform={`translate(${x} ${base})`}>
        <ellipse cx={0} cy={4} rx={128} ry={16} fill={kidTheme.ink} opacity={0.14} />
        <path
          d="M -26 0 Q -18 -108 -34 -196 L 34 -196 Q 18 -108 26 0 Z"
          fill={kidTheme.earth}
          stroke={kidTheme.ink}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <g transform={`rotate(${sway.toFixed(2)} 0 -170)`}>
          <ellipse cx={-76} cy={-232} rx={104} ry={78} fill={kidTheme.grassDark} stroke={kidTheme.ink} strokeWidth={7} />
          <ellipse cx={82} cy={-248} rx={96} ry={72} fill={kidTheme.grassDark} stroke={kidTheme.ink} strokeWidth={7} />
          <ellipse cx={0} cy={-306} rx={118} ry={86} fill={kidTheme.grassDark} stroke={kidTheme.ink} strokeWidth={7} />
          <ellipse cx={-8} cy={-336} rx={72} ry={40} fill={kidTheme.grass} opacity={0.75} />
        </g>
      </g>
    </WideLayer>
  );
};

/**
 * **GOLDEN HOUR, and it is a comp-level grade rather than a plate.**
 *
 * B2 cut `meadow_golden` after five rolls (backgrounds.mjs has the autopsy),
 * so scenes 22 and 23 stage on `meadow_day` under a warm grade targeting a
 * whole-frame mean luminance of about 140 — between the delivered day (178.5)
 * and rain (169) and above dawn (112).
 *
 * It is applied to the WHOLE camera group: plate, field, volcano, tree and
 * every body in the scene. Grading the plate alone is the failure the brief
 * names — the field goes to evening and the cast stays at noon, and a
 * six-year-old reads that instantly as "pasted on" without being able to say
 * why. The bubbles are outside it, because a graded bubble is a legibility
 * problem in service of nothing.
 *
 * Measured, not guessed: `scratchpad/ep4b3_act3/lum.py` reads the stills back.
 */
function goldenGrade(u: number): string {
  const k = Math.max(0, Math.min(1, u));
  if (k <= 0.001) return "none";
  return (
    `sepia(${(0.6 * k).toFixed(3)})` +
    ` saturate(${(1 + 1.2 * k).toFixed(3)})` +
    ` brightness(${(1 - 0.28 * k).toFixed(3)})` +
    ` hue-rotate(${(-16 * k).toFixed(1)}deg)`
  );
}

/**
 * **The numbers above, and how they were arrived at.**
 *
 * `scratchpad/ep4b3_act3/grade.py` collapses a CSS filter chain to the same
 * 3×4 colour matrix Chrome applies and runs it over a rendered still, so the
 * grade was solved rather than guessed: at sepia 0.60 / saturate 2.20 /
 * brightness 0.72 / hue −16° the whole frame measures **142.5** against the
 * brief's target of ~140, from an ungraded 180.8.
 *
 * The two rejected neighbours are worth writing down, because both of them
 * hit the number and neither of them is golden hour:
 *
 *   sepia 0.85+  hits 140 and turns the frame into a sepia photograph. Drip
 *                goes grey-green, Ray's spectrum disappears and the cast
 *                loses the identity colours the whole series is built on.
 *                Sepia destroys hue before `saturate` can put it back.
 *   sepia 0.34   (the first guess) leaves the sky at full midday cerulean and
 *                only dims it. A value change with no hue change is a scene
 *                that is darker, not later.
 *
 * 0.60 is the knee: enough of the hue survives that Drip is still teal and
 * Sunny is still Sunny, and `saturate(2.2)` pushes the survivors back up.
 */

/**
 * The light coming off the one enormous obvious supplier — a warm wash from
 * his corner of the sky, inside the graded group and above the cast, because
 * it is light between the viewer and the field rather than a thing standing
 * in it. Bubbles are outside it (they are outside everything).
 */
const SunWash: React.FC<{ u: number; x: number; y: number }> = ({ u, x, y }) => {
  if (u <= 0.01) return null;
  return (
    <AbsoluteFill
      style={{
        background:
          `radial-gradient(ellipse 1200px 900px at ${x}px ${y}px,` +
          ` rgba(255,206,120,${(0.34 * u).toFixed(3)}) 0%,` +
          ` rgba(255,178,96,${(0.14 * u).toFixed(3)}) 42%, transparent 76%)`,
        pointerEvents: "none",
      }}
    />
  );
};

/**
 * The act's world: a seated plate, the drawn near field, the volcano and the
 * tree on the measured horizon, the cast in front of all of it, and the
 * overlay outside the camera.
 *
 * The z-discipline is `MEADOW_Z`'s, unchanged and for the same reason — every
 * band has a number and nothing is ever `auto`, because CSS paints an `auto`
 * child underneath every positioned sibling and that is how the cold open
 * shipped a hero buried in the grass with her head over the horizon.
 */
const PlateWorld: React.FC<{
  plate: PlateKey;
  /** False for a cutaway: no horizon, no volcano, no tree, no crest. */
  wide?: boolean;
  cam?: Cam;
  /** Per-scene offset so two consecutive shots do not drift in lockstep. */
  phase?: number;
  /** Golden-hour grade, 0..1. Scenes 22 and 23 only (and 24's sunrise ramp). */
  grade?: number;
  /** Extra whole-group brightness, for Scene 24's dawn switching on. */
  flood?: number;
  plateScale?: number;
  plateTop?: number;
  plateDx?: number;
  plateDrift?: number;
  /** Ground line for the drawn crest, when a shot is not on `MEADOW.ground`. */
  ground?: number;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({
  plate,
  wide = true,
  cam,
  phase = 0,
  grade = 0,
  flood = 0,
  plateScale,
  plateTop,
  plateDx,
  plateDrift,
  ground,
  overlay,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase;
  const grass = PLATES[plate].grass;
  const golden = goldenGrade(grade);
  const filter =
    flood > 0.001
      ? `${golden === "none" ? "" : `${golden} `}brightness(${(1 + 0.3 * flood).toFixed(3)}) saturate(${(1 + 0.18 * flood).toFixed(3)})`
      : golden;
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: grass,
        fontFamily: kidTheme.fontFamily,
        color: kidTheme.ink,
        // Pinned for the same reason KidBackdrop pins it: @remotion/player does
        // not reset inherited typography.
        lineHeight: "normal",
      }}
    >
      <AbsoluteFill style={{ filter }}>
        <Camera cam={cam ?? { x: WIDTH / 2, y: HEIGHT / 2 }}>
          <Plate
            plate={plate}
            scale={plateScale}
            top={plateTop}
            dx={plateDx}
            drift={plateDrift}
            phase={phase}
          />
          {wide ? (
            <>
              <NearCrest grass={grass} ground={ground} />
              {/* The volcano and the tree stand ON the horizon, so they get a
                  layer of their own between the ground and the cast. */}
              <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.scenery }}>
                <SleepingVolcano
                  x={VOLCANO_AT.x}
                  base={MEADOW.horizon}
                  scale={VOLCANO_AT.scale}
                  phase={phase}
                />
                <OldTree x={MEADOW.tree.x} base={MEADOW.horizon + 22} t={t} />
              </div>
            </>
          ) : null}
          <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.cast }}>
            {children}
          </div>
        </Camera>
        <SunWash u={grade} x={SUNNY_AT.x} y={SUNNY_AT.y + 40} />
      </AbsoluteFill>
      {overlay ? (
        <AbsoluteFill style={{ zIndex: MEADOW_Z.overlay, pointerEvents: "none" }}>
          {overlay}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// API 1 — the act's marks
// ---------------------------------------------------------------------------

/**
 * **Pip's mark, and it is the same square inch it has been since Scene 3.**
 *
 * `MEADOW.pip.x` is a constant because she is: the premise of the character is
 * that she never takes a step, so a scene that would like her a little more to
 * the left moves the CAMERA. The only thing that changes about her across this
 * act is that she is taller.
 */
const PIP_X = MEADOW.pip.x;
const PIP_Y = stand("pip", MEADOW.ground);
const PIP_SCALE = 0.72;

function pipMark(state: "leaf" | "young", morph = 1, scale = PIP_SCALE): Mark {
  return { x: PIP_X, y: PIP_Y, scale, who: "pip", state, morph };
}

/**
 * Puff's mark for the trade scenes (17, 18, 19).
 *
 * Low and close rather than up in the sky, because scenes 18 and 19 are a
 * two-hander about a plant and the air *touching* it — but still wholly under
 * the horizon band, which is the floater rule: a hovering body sitting across
 * the far field's top edge reads as sunk into it. His box is 340, so at 0.78 he
 * is 265 tall and a centre of 772 puts his crown at 640, comfortably under 604's
 * band and above the grass.
 */
const PUFF_AT = { x: 1194, y: 772, scale: 0.78 } as const;
const puffMark = (): Mark => ({
  x: PUFF_AT.x,
  y: PUFF_AT.y - CHAR_BOX.puff / 2 + (CHAR_BOX.puff * PUFF_AT.scale) / 2,
  scale: PUFF_AT.scale,
  who: "puff",
});

/** His settled visibility once he has "popped visible" — his courtesy, Scene 18. */
const PUFF_SEEN = 0.62;

/** Drip, standing in the near field on Pip's left. */
const DRIP_AT = { x: 470, ground: 948, scale: 0.8 } as const;
const dripMark = (): Mark => ({
  x: DRIP_AT.x,
  y: stand("drip", DRIP_AT.ground),
  scale: DRIP_AT.scale,
  who: "drip",
});

/** A hovering body's placement: centre point plus the component's own scale. */
type Hover = { x: number; y: number; scale: number };

/**
 * Ray, in the sky, wholly above the horizon band.
 *
 * **640 rather than 372, and the volcano decides it** (showrunner ruling,
 * repair pass). His ribbon is about 260px across at this scale, so parked at
 * 372 he spans 239–505 and sits squarely on the volcano, which stands at 336
 * and is the one piece of scenery this series keeps readable in every wide.
 * At 640 he clears its right slope by eighty pixels, stays clear of Drip (who
 * is on the ground under him) and stops well short of Sunny's disc at 892.
 */
const RAY_AT: Hover = { x: 640, y: 388, scale: 0.82 };
const rayMark = (at: Hover = RAY_AT): Mark => ({
  x: at.x,
  y: at.y - CHAR_BOX.ray / 2 + (CHAR_BOX.ray * at.scale) / 2,
  scale: at.scale,
  who: "ray",
});

/**
 * Sunny: right of centre, enormous, and the whole act is about not looking at
 * him.
 *
 * **1186 rather than 1600, and it is the tree that decides it.** `MEADOW.tree`
 * is at x 1588 with a canopy 360px across and 250 tall; a sun big enough to be
 * "one enormous obvious supplier" parked over there eats the trunk, and Scene
 * 20's whole payoff is that the audience has been looking at that tree for
 * thirteen minutes. At 1186 his ray tips stop about 80px short of the canopy
 * and both objects are whole.
 *
 * **FLAGGED:** Sunny's side of frame is a cross-act constant and this act
 * picked it alone. If acts one and two stage him frame-left or hard-right, one
 * of the three is wrong and it should become a number in `common.tsx`.
 */
const SUNNY_AT: Hover = { x: 1186, y: 268, scale: 1.28 };
const sunnyMark = (at: Hover = SUNNY_AT): Mark => ({
  x: at.x,
  y: at.y - CHAR_BOX.sunny / 2 + (CHAR_BOX.sunny * at.scale) / 2,
  scale: at.scale,
  who: "sunny",
});

/**
 * A mark as it appears under a camera move.
 *
 * Bubbles live outside the camera (a zoomed bubble is unreadable and the law is
 * that a bubble is above everything), so every bubble in this act is placed on
 * a projected mark. It carries Pip's `state`/`morph` through, which is what
 * lets `bubbleOver` clear the crown she actually has rather than the one the
 * box claims.
 */
function proj(cam: Cam | undefined, m: Mark): Mark {
  if (!cam) return m;
  const z = cam.zoom ?? 1;
  const half = CHAR_BOX[m.who ?? "pip"] / 2;
  const ground = project(cam, { x: m.x, y: m.y + half });
  return { ...m, x: ground.x, y: ground.y - half, scale: (m.scale ?? 1) * z };
}

/**
 * Where the pointer leaf has to be held to aim at a point — her one gesture
 * that is not the lean, unlocked in Scene 16 and spent on the Sun in Scene 23.
 *
 * `Pip`'s `point` is degrees from horizontal, positive up, and `pointSide`
 * picks which flank the leaf grows on, so both come out of the same call.
 *
 * Clamped to [−24, `POINT_CEILING`]. The floor is unchanged and is her own
 * leaf's droop; the ceiling is the elbow's, and is now high enough that every
 * target this act has is reachable rather than approximated.
 */
function leafAt(
  m: Mark,
  target: { x: number; y: number },
): { point: number; pointSide: "left" | "right" } {
  const scale = m.scale ?? 1;
  // The top node's height, in composition px, off Pip's own geometry: the box
  // bottom is `y + PIP_BOX/2` and local 230 is her ground.
  const nodeLocal = 134;
  const from = { x: m.x, y: m.y + CHAR_BOX.pip / 2 - (230 - nodeLocal) * scale };
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const angle = (Math.atan2(-dy, Math.max(40, Math.abs(dx))) * 180) / Math.PI;
  return { point: Math.max(-24, Math.min(POINT_CEILING, angle)), pointSide: dx >= 0 ? "right" : "left" };
}

/**
 * **How high the pointer can actually point — a rig number, and the rig now
 * bends.**
 *
 * HISTORY, one line, because the whole act was staged around it: until the
 * pointer-articulation batch this constant was **14**, because a straight leaf
 * 150 long, hung 56 units under a pod 208 across and drawn *behind* it, buries
 * its own tip in her cheek anywhere above ~14° — so Scene 23 aimed at a Sun 56°
 * up and drew a collar.
 *
 * `Pip.tsx` now gives the pointer an ELBOW above 14°: the leaf runs out at 12°
 * for its first third — below the pod, not past it — then curves up to the
 * angle it was asked for and finishes on a straight run at that angle, 190
 * long in total and slimmed 30% so the direction is legible. The tip is
 * outside the pod silhouette at every angle up to the rig's own limit of
 * **61.1°** (`ELBOW` in `Pip.tsx`: 12° plus the 49.1° the arc budget buys at
 * the tightest radius the blade can bend to without pinching). Anything above
 * that saturates there rather than kinking.
 *
 * 56 is what this act asks for: Scene 23's Sun sits 56.5° above her pointer
 * node, so `leafAt` can now aim honestly and be believed. The aim is still
 * carried by the lean and the eyes as well — the leaf is the third of three.
 *
 * **This is NOT `pointRamp`'s default.** The everyday "leaf held out" pose is
 * `POINT_HELD`, still 14, and every ramp in Scenes 17/19/21/24 still tops out
 * there — unchanged drawings, on the byte-stable side of the elbow threshold.
 * Only a scene that aims at something passes a number above it.
 */
const POINT_CEILING = 56;

/**
 * The pointer's everyday held-out pose: a leaf raised to say "noted", not to
 * aim at anything. Also exactly the top of the band where `Pip` draws the
 * pointer with its original flat geometry, which is why every ramp that does
 * not have a target lands here.
 */
const POINT_HELD = 14;

/**
 * **The pointer's rest angle, and why every `point` in this act is a ramp
 * between two numbers rather than a value that appears and disappears.**
 *
 * `Pip` does not ease `point` (Pip.tsx:608, 648): the leaf is drawn at whatever
 * angle it is handed, this frame. So `point={cond ? 14 : undefined}` is a
 * one-frame flick of the pointer — a pop-in on the one limb the hero has — and
 * the first pass put one of them on the opening frame of Scene 17's held beat.
 *
 * The fix is that the prop is always supplied and always interpolated, from the
 * rest angle the rig would have drawn anyway. −4° is `LEAF_NODES[0].angle` in
 * `Pip.tsx`, the pointer's rest angle in the `leaf` state, so a ramp that
 * starts and ends here is invisible at both ends.
 *
 * (The `young` plant's pointer rests at 0°. The 4° difference is a quarter of
 * the ceiling and lands mid-morph in Scene 24, where nothing is holding still.)
 */
const POINT_REST = -4;

/** A pointer angle that ramps: `undefined` never appears, so it cannot flick. */
function pointRamp(u: number, to: number = POINT_HELD): number {
  const k = Math.max(0, Math.min(1, u));
  return POINT_REST + (to - POINT_REST) * k;
}

// ---------------------------------------------------------------------------
// API 2 — the act's props
// ---------------------------------------------------------------------------

/**
 * The grass flattening in a soft ring — Puff's entrance, and every gesture he
 * makes afterwards. It is the one thing an invisible character can do to a
 * field, and it is the reason his catch-phrase is about feeling rather than
 * seeing.
 */
const GrassRing: React.FC<{
  x: number;
  y: number;
  /** 0 at the moment it starts, 1 when it has run out to full radius. */
  u: number;
  radius?: number;
  color?: string;
}> = ({ x, y, u, radius = 300, color = kidTheme.airLight }) => {
  if (u <= 0 || u >= 1) return null;
  const r = radius * kidEase.easeOutCubic(u);
  const fade = 1 - kidEase.easeInQuad(u);
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={r}
      ry={r * 0.26}
      fill="none"
      stroke={color}
      strokeWidth={9 * fade + 2}
      opacity={0.6 * fade}
    />
  );
};

/**
 * One beam of light, landing where a scene points it.
 *
 * Ray is a character and his light is his body, so this is deliberately NOT a
 * Ray: Scene 19's stage list is "Narrator, Puff, Pip" and the direction is
 * "Ray lays one beam on the new leaf" — the beam arrives, he does not. It
 * becomes him at the top of Scene 20, which is the whole of that cut's
 * continuity check.
 */
const LightBeam: React.FC<{
  /** Where the beam comes from (off frame, sun-ward). */
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  /** 0..1 — how much beam there is. */
  power: number;
  t: number;
  width?: number;
}> = ({ fromX, fromY, toX, toY, power, t, width = 78 }) => {
  if (power <= 0.01) return null;
  const nx = toY - fromY;
  const ny = -(toX - fromX);
  const len = Math.max(1, Math.hypot(nx, ny));
  const hw = (width / 2) / len;
  const shimmer = 0.86 + 0.14 * Math.sin(t * 2.4);
  return (
    <g opacity={power * shimmer}>
      <path
        d={
          `M ${(fromX + nx * hw * 2.2).toFixed(1)} ${(fromY + ny * hw * 2.2).toFixed(1)}` +
          ` L ${(toX + nx * hw * 0.5).toFixed(1)} ${(toY + ny * hw * 0.5).toFixed(1)}` +
          ` L ${(toX - nx * hw * 0.5).toFixed(1)} ${(toY - ny * hw * 0.5).toFixed(1)}` +
          ` L ${(fromX - nx * hw * 2.2).toFixed(1)} ${(fromY - ny * hw * 2.2).toFixed(1)} Z`
        }
        fill={kidTheme.sunLight}
        opacity={0.34}
      />
      <path
        d={
          `M ${(fromX + nx * hw).toFixed(1)} ${(fromY + ny * hw).toFixed(1)}` +
          ` L ${(toX + nx * hw * 0.22).toFixed(1)} ${(toY + ny * hw * 0.22).toFixed(1)}` +
          ` L ${(toX - nx * hw * 0.22).toFixed(1)} ${(toY - ny * hw * 0.22).toFixed(1)}` +
          ` L ${(fromX - nx * hw).toFixed(1)} ${(fromY - ny * hw).toFixed(1)} Z`
        }
        fill={kidTheme.star}
        opacity={0.6}
      />
    </g>
  );
};

/**
 * A mote — the fizzy bit of air on its way into a leaf, and the fresh part on
 * its way back out.
 *
 * Played funny, never scary (script.md's tone guardrail): it is a glitter
 * crumb travelling a lazy arc, nothing is grabbed, and the leaf is warm.
 */
const Mote: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** 0..1 along the trip; outside that it does not exist. */
  u: number;
  color: string;
  size?: number;
  t: number;
}> = ({ from, to, u, color, size = 13, t }) => {
  if (u <= 0 || u >= 1) return null;
  const e = kidEase.easeInOutSine(u);
  const x = from.x + (to.x - from.x) * e;
  // A lazy sag on the way over, so it drifts rather than being fired.
  const y = from.y + (to.y - from.y) * e - Math.sin(e * Math.PI) * 46;
  const twinkle = 0.75 + 0.25 * Math.sin(t * 7 + u * 9);
  const fade = Math.min(1, Math.min(u, 1 - u) * 7);
  return (
    <g opacity={fade}>
      <circle cx={x} cy={y} r={size * 1.9} fill={color} opacity={0.22 * twinkle} />
      <circle cx={x} cy={y} r={size} fill={color} opacity={0.9} />
      <circle cx={x - size * 0.3} cy={y - size * 0.3} r={size * 0.34} fill={kidTheme.paper} opacity={0.85} />
      {/* Four short spokes — a sparkle, not a ball bearing. */}
      {[0, 90, 45, 135].map((a) => (
        <path
          key={a}
          d={`M ${x} ${y} L ${x + Math.cos((a * Math.PI) / 180) * size * 2.4} ${y + Math.sin((a * Math.PI) / 180) * size * 2.4}`}
          stroke={color}
          strokeWidth={2.6}
          strokeLinecap="round"
          opacity={0.4 * twinkle}
        />
      ))}
    </g>
  );
};

/**
 * One crumb of sugar. Absurdly small, on purpose: the frame is huge around it
 * and it rhymes with `co_15` ("Pip was the size of a crumb").
 */
const SugarCrumb: React.FC<{
  x: number;
  y: number;
  /** 0..1 — it is born with ceremony, so this is a spring, not a fade. */
  pop: number;
  t: number;
  size?: number;
}> = ({ x, y, pop, t, size = 11 }) => {
  if (pop <= 0.001) return null;
  const s = size * pop;
  const gleam = 0.55 + 0.45 * Math.sin(t * 2.1);
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <circle r={s * 5.2} fill={kidTheme.star} opacity={0.2 * gleam * pop} />
      <circle r={s * 2.6} fill={kidTheme.sunLight} opacity={0.34 * gleam * pop} />
      <rect
        x={-s}
        y={-s}
        width={s * 2}
        height={s * 2}
        rx={s * 0.35}
        fill={kidTheme.paper}
        stroke={kidTheme.ink}
        strokeWidth={Math.max(1.5, s * 0.28)}
        transform={`rotate(${-14 + gleam * 4})`}
      />
      <path
        d={`M ${-s * 2.9} 0 L ${s * 2.9} 0 M 0 ${-s * 2.9} L 0 ${s * 2.9}`}
        stroke={kidTheme.star}
        strokeWidth={s * 0.34}
        strokeLinecap="round"
        opacity={0.7 * gleam}
      />
    </g>
  );
};

/**
 * **Pip's inventory board** — Scene 17's "site foreman at a whiteboard".
 *
 * The ticks are MEASURED against the clip rather than split evenly.
 * `a2_53_pip` ("Inventory. Water, inside. Light, on retainer. One delivery
 * left. Air.") is 6.34s with eight silences; the seven spoken runs start at
 * 0.196 / 1.238 / 1.954 / 2.777 / 3.381 / 4.339 / 5.701s, and the numbers below
 * are those onsets in frames. Splitting a five-item list evenly puts the WATER
 * tick most of a second off the word "inside", which is a foreman ticking the
 * wrong line.
 *
 *   npx remotion ffmpeg -i public/narration/plants/a2_53_pip.mp3 \
 *     -af silencedetect=noise=-32dB:d=0.08 -f null -
 */
const BOARD_BEATS = {
  title: 6,
  water: 37,
  waterTick: 59,
  light: 83,
  lightTick: 101,
  air: 171,
} as const;

const InventoryBoard: React.FC<{
  /** Scene-local frame the line starts on. */
  from: number;
  /** Frame the board leaves on. */
  until: number;
  x?: number;
  y?: number;
}> = ({ from, until, x = 1430, y = 250 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - from;
  const inSpring = spring({ frame: f - BOARD_BEATS.title, fps, config: { damping: 13, mass: 0.7 } });
  const out = Math.max(0, Math.min(1, (frame - until) / 10));
  const show = inSpring * (1 - out);
  if (show <= 0.005) return null;
  const rows: { label: string; at: number; tick: number | null }[] = [
    { label: "WATER", at: BOARD_BEATS.water, tick: BOARD_BEATS.waterTick },
    { label: "LIGHT", at: BOARD_BEATS.light, tick: BOARD_BEATS.lightTick },
    { label: "AIR", at: BOARD_BEATS.air, tick: null },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${show}) rotate(${-2.2 + (1 - inSpring) * 6}deg)`,
        opacity: Math.min(1, show * 1.6),
        background: kidTheme.paper,
        border: `9px solid ${kidTheme.ink}`,
        borderRadius: kidRadius.card,
        boxShadow: kidShadow(1.1),
        padding: "18px 30px 22px",
        minWidth: 430,
        fontFamily: kidTheme.fontFamily,
      }}
    >
      <div
        style={{
          fontSize: kidType.min,
          fontWeight: 900,
          letterSpacing: 4,
          color: kidTheme.inkSoft,
          borderBottom: `6px solid ${kidTheme.inkSoft}`,
          paddingBottom: 8,
          marginBottom: 10,
        }}
      >
        INVENTORY
      </div>
      {rows.map((row) => {
        const rowIn = Math.max(0, Math.min(1, (f - row.at) / 6));
        const tick =
          row.tick === null ? 0 : Math.max(0, Math.min(1, (f - row.tick) / 5));
        return (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 26,
              fontSize: kidType.bubbleSmall,
              fontWeight: 900,
              color: kidTheme.ink,
              opacity: rowIn,
              transform: `translateX(${(1 - rowIn) * -18}px)`,
              marginTop: 6,
            }}
          >
            <span>{row.label}</span>
            <span
              style={{
                color: row.tick === null ? kidTheme.pinkDeep : kidTheme.grassDark,
                transform: `scale(${row.tick === null ? 1 : 0.4 + 0.6 * tick})`,
                opacity: row.tick === null ? rowIn : tick,
                minWidth: 54,
                textAlign: "right",
              }}
            >
              {row.tick === null ? "?" : "✓"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * **THE RULE STAMP — A TREE IS MADE OF AIR.**
 *
 * A rule is not a vocabulary word, so it does not get the `WordCard`
 * signature; episode two established the treatment (`RuleStamp`, WARM AIR
 * RISES) and script.md names it explicitly. The thump is the whole component:
 * it arrives from 2.4× in six frames on `easeInQuad` — a stamp accelerates
 * *into* the paper — lands hard and rings out.
 *
 * The arrow behind it climbs, because the claim is that the tree came from up
 * there.
 */
const RuleStamp: React.FC<{
  text: string;
  from: number;
  y?: number;
  color?: string;
  tilt?: number;
}> = ({ text, from, y = 300, color = kidTheme.mint, tilt = -3.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - from;
  if (f < -8) return null;
  const drop = kidEase.easeInQuad(Math.max(0, (f + 6) / 6));
  const scale = 2.4 - 1.4 * drop;
  const ring = f >= 0 ? settleWave(f / (fps * 0.7), 1.5, 4.2) : 0;
  const sx = scale * (1 + 0.1 * ring);
  const sy = scale * (1 - 0.12 * ring);
  const ink = Math.min(1, Math.max(0, (f + 6) / 5));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `translateY(-50%) scale(${sx}, ${sy}) rotate(${tilt}deg)`,
        opacity: ink,
        // **Under the bubbles.** `SpeechBubble` defaults to `zIndex: 40`, so
        // DOM order alone would not have saved "be a TREE." from the rise
        // arrow: the law needs the number as well as the ordering.
        zIndex: 30,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      <RiseArrow color={color} frame={frame} />
      <div
        style={{
          position: "relative",
          background: color,
          border: `11px solid ${kidTheme.ink}`,
          borderRadius: kidRadius.banner,
          padding: "18px 56px",
          fontSize: 92,
          fontWeight: 900,
          letterSpacing: 2,
          lineHeight: 1.02,
          color: kidTheme.paper,
          textShadow: kidInkOutline(3),
          boxShadow: kidShadow(1.3),
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** The fat arrow behind the stamp, climbing on a loop. */
const RiseArrow: React.FC<{ color: string; frame: number }> = ({ color, frame }) => (
  <svg
    width={480}
    height={560}
    viewBox="-240 -280 480 560"
    style={{ position: "absolute", pointerEvents: "none" }}
  >
    <g
      opacity={0.4}
      transform={`translate(0 ${(Math.sin(frame / 14) * 12).toFixed(1)})`}
      fill={color}
      stroke={kidTheme.ink}
      strokeWidth={9}
      strokeLinejoin="round"
    >
      <path d="M -58 210 L -58 -60 L -140 -60 L 0 -230 L 140 -60 L 58 -60 L 58 210 Z" />
    </g>
  </svg>
);

/**
 * **THE BIG WORD — PHOTOSYNTHESIS, one syllable per hero.**
 *
 * `BigWordBeat` is the house signature and STYLE says build one only with it.
 * This one cannot be: `BigWordBeat` takes ONE chant clip and splits it, and
 * this chant is five separate recordings, one per syllable, each of which a
 * hero slams on as its own block. Mounting all five blocks up front (which is
 * what `BigWordBeat` does at `split`) throws away the entire joke — the word
 * is supposed to be *assembled*, and the assembly order is the reunion engine
 * made visible.
 *
 * **The Narrator chants it; the heroes slam it** (showrunner ruling
 * 2026-10-17, from the kids' hub: "Thing that broke was the word
 * photosynthesis"). It used to be five voices, one syllable each, and five
 * timbres a second apart never read as one word. Now one voice says all five
 * — five kokoro clips, because kokoro runs a one-line "Pho. To. Syn. The. Sis."
 * together with no onsets to slam on — and each owner still slams, rings and
 * cheers their block with their mouth shut (Pip files hers).
 *
 * Everything that makes it read as the signature is kept: kid type at 116,
 * `kidInkOutline`, the ink border, the ring on impact, the hop. What is added
 * is the owner's colour on each block, which is the only place in the episode
 * the five leads are drawn as one object.
 *
 * **The beats are measured onsets, not even fifths.** Every kokoro syllable
 * clip carries ~0.45s of leading silence (table and recipe on
 * `CHANT_SYLLABLES` in common.tsx), so each block slams on its own turn's
 * start plus that clip's measured onset.
 */
const CHANT_COLOR: Record<(typeof CHANT_SYLLABLES)[number]["who"], { bg: string; fg: string }> = {
  drip: { bg: kidTheme.waterDark, fg: kidTheme.paper },
  puff: { bg: kidTheme.airEdge, fg: kidTheme.paper },
  ray: { bg: kidTheme.mint, fg: kidTheme.ink },
  pip: { bg: PIP_COLOR.seedDeep, fg: kidTheme.paper },
  sunny: { bg: kidTheme.sunDark, fg: kidTheme.paper },
};
const CHANT = CHANT_SYLLABLES.map((syl) => ({ ...syl, ...CHANT_COLOR[syl.who] }));

const ChantCard: React.FC<{
  /** Scene-local frame each block slams on, in order. */
  at: number[];
  /** Frame the assembled word starts fading. */
  until: number;
  /** The four-word definition, once the word is whole. */
  sub?: string;
  subFrom?: number;
  /**
   * Vertical centre of the whole card group.
   *
   * **142, and three faces set it** (showrunner ruling, repair pass). At 262
   * the THE and SIS blocks sat across Sunny's eyes and mouth on the frame his
   * own syllable lands — the one character who must be seen claiming it
   * (shouting it, until the 2026-10-17 Narrator-led chant; cheering it now),
   * buried by the graphic saying it. The card group is 96px type (row ≈ 139
   * tall) plus the sub-line, so a centre of 142 puts its lowest ink at ≈ 243,
   * which clears Ray's forehead (253) and, with Sunny lowered to y 300 in
   * Scene 24, his eyes (278) as well. Everything in this scene is stacked in
   * one narrow column of sky and the three clearances are the whole layout.
   */
  y?: number;
}> = ({ at, until, sub, subFrom, y = 142 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = Math.max(0, Math.min(1, (frame - until) / 12));
  if (frame < at[0] - 8 || out >= 1) return null;
  const subIn = sub && subFrom !== undefined ? Math.max(0, Math.min(1, (frame - subFrom) / 8)) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transform: `translateY(-50%) scale(${1 - out * 0.1})`,
        opacity: 1 - out,
        // Under the bubbles, same law as `RuleStamp`.
        zIndex: 30,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {CHANT.map((syl, i) => {
          const f = frame - at[i];
          // A stamp, not a fade: it comes in from 2.1× over five frames and
          // rings out, so the block reads as being SLAMMED on by its owner.
          const land = kidEase.easeInQuad(Math.max(0, Math.min(1, (f + 5) / 5)));
          const ring = f >= 0 ? settleWave(f / (fps * 0.55), 1.5, 4.6) : 0;
          const s = (2.1 - 1.1 * land) * (1 + 0.11 * ring);
          const sy = (2.1 - 1.1 * land) * (1 - 0.13 * ring);
          const alpha = Math.max(0, Math.min(1, (f + 5) / 4));
          if (f < -6) return <span key={syl.text} />;
          return (
            <div
              key={syl.text}
              style={{
                background: syl.bg,
                color: syl.fg,
                border: `9px solid ${kidTheme.ink}`,
                borderRadius: kidRadius.card,
                padding: "10px 26px",
                fontSize: 96,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: 1,
                textShadow: syl.fg === kidTheme.paper ? kidInkOutline(3) : "none",
                boxShadow: kidShadow(1.1),
                opacity: alpha,
                transform: `scale(${s}, ${sy}) rotate(${(i % 2 === 0 ? -1 : 1) * 2 + ring * 3}deg)`,
              }}
            >
              {syl.text}
            </div>
          );
        })}
      </div>
      {sub ? (
        <div
          style={{
            fontSize: kidType.bubbleSmall,
            fontWeight: 800,
            letterSpacing: 2,
            color: kidTheme.paper,
            textShadow: kidInkOutline(3),
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 14}px)`,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

/**
 * One piece of stored sunshine: an apple, a strawberry, a slice of bread. Each
 * fades in over the hoard and glows sun-gold from the inside for a beat.
 */
const StoredFood: React.FC<{
  kind: "apple" | "berry" | "bread";
  x: number;
  y: number;
  scale?: number;
  /** 0..1 — in, glow, hold. */
  u: number;
}> = ({ kind, x, y, scale = 1, u }) => {
  if (u <= 0.001) return null;
  const inn = Math.min(1, u * 4);
  const glow = Math.max(0, Math.sin(Math.min(1, u * 1.6) * Math.PI));
  return (
    <g
      transform={`translate(${x} ${y}) scale(${(scale * (0.72 + 0.28 * inn)).toFixed(3)})`}
      opacity={inn}
    >
      <circle r={132} fill={kidTheme.star} opacity={0.3 * glow} />
      {kind === "apple" ? (
        <>
          <path
            d="M 0 -52 C 58 -86 106 -44 100 12 C 94 74 50 106 0 88 C -50 106 -94 74 -100 12 C -106 -44 -58 -86 0 -52 Z"
            fill={mixHex(kidTheme.tomato, kidTheme.star, glow * 0.45)}
            stroke={kidTheme.ink}
            strokeWidth={8}
            strokeLinejoin="round"
          />
          <path d="M 0 -56 q 6 -40 34 -52" stroke={kidTheme.earth} strokeWidth={11} fill="none" strokeLinecap="round" />
          <ellipse cx={38} cy={-70} rx={30} ry={16} fill={kidTheme.grassDark} stroke={kidTheme.ink} strokeWidth={6} transform="rotate(-18 38 -70)" />
        </>
      ) : null}
      {kind === "berry" ? (
        <>
          <path
            d="M 0 96 C -70 46 -84 -18 -50 -50 C -22 -76 22 -76 50 -50 C 84 -18 70 46 0 96 Z"
            fill={mixHex(kidTheme.pinkDeep, kidTheme.star, glow * 0.45)}
            stroke={kidTheme.ink}
            strokeWidth={8}
            strokeLinejoin="round"
          />
          {[[-26, -6], [22, -14], [-4, 26], [30, 34], [-32, 40]].map(([sx, sy]) => (
            <circle key={`${sx}-${sy}`} cx={sx} cy={sy} r={6} fill={kidTheme.star} opacity={0.9} />
          ))}
          {[-34, 0, 34].map((a) => (
            <ellipse key={a} cx={a * 0.7} cy={-60} rx={26} ry={12} fill={kidTheme.grassDark} stroke={kidTheme.ink} strokeWidth={6} transform={`rotate(${a} ${a * 0.7} -60)`} />
          ))}
        </>
      ) : null}
      {kind === "bread" ? (
        <>
          <path
            d="M -84 92 L -84 -18 C -84 -70 -40 -92 0 -92 C 40 -92 84 -70 84 -18 L 84 92 Z"
            fill={mixHex("#e8b96a", kidTheme.star, glow * 0.45)}
            stroke={kidTheme.ink}
            strokeWidth={8}
            strokeLinejoin="round"
          />
          <path d="M -60 -6 L 60 -6" stroke={kidTheme.earth} strokeWidth={7} strokeLinecap="round" opacity={0.5} />
        </>
      ) : null}
    </g>
  );
};

/**
 * A dandelion seedling's plumbing, drawn small: the water climbing out of the
 * soil and up the stem, with Drip visible in it.
 *
 * Drip has a body and it is 380 units tall; the stem at Scene 21's scale is
 * about thirty pixels across, so staging the component inside it would put a
 * character ten times the width of the pipe she is supposed to be in. Two dots
 * and an arc is the cold open's own answer to the same problem (the five named
 * siblings) and it is what "Drip visible in it" means at this size.
 *
 * **THE REBUILD (showrunner ruling, repair pass).** The first version drew an
 * opaque 26px column at `zIndex 4` — above the hero — for the fifty seconds
 * that contain "One crumb.", "It is mostly him." and THE BREAK, with the little
 * face riding the head of the column, which parks under her chin. She read as a
 * plant with a blue post for a body and a second tiny face on her jaw. The
 * ruling: the column goes UNDER her, it is translucent, and the face rides
 * LOWER — never near her face.
 *
 * Three consequences, and the middle one is a flagged compromise:
 *
 *   under her   `zIndex 2`, below Pip's 3. Her stem is an opaque filled taper
 *               with an ink outline, so everything the column does *behind* the
 *               stem is hidden by it — which is the point: her body is her body
 *               again.
 *   the shape   the run therefore starts BELOW the ground line, in the soil the
 *               cutaway is a cross-section of, and it is widest there. What is
 *               on screen is water rising through the dirt into a plant, plus a
 *               soft translucent rim either side of the stem where the column
 *               is wider than she is. That is the only place a column drawn
 *               under an opaque stem can be seen at all, and the script's
 *               "water from below" is the sentence it illustrates.
 *   the face    parks at `faceY`, low in the soil run, once the column has
 *               climbed past it. It never travels up the stem again.
 */
const WaterLine: React.FC<{
  x: number;
  /** Bottom (in the soil) and top (the stem's top node) of the run, comp px. */
  bottom: number;
  top: number;
  /** Column width at the soil end; it tapers to `width * 0.42` at the top. */
  width: number;
  /** Where Drip's face parks, in composition px. Low, and clear of the hero. */
  faceY: number;
  /** 0..1 how far up the column has climbed. */
  fill: number;
  t: number;
}> = ({ x, bottom, top, width, faceY, fill, t }) => {
  const f = Math.max(0, Math.min(1, fill));
  if (f <= 0.01) return null;
  const head = bottom + (top - bottom) * f;
  // Half-width at a given y: fat in the dirt, thin in the stem.
  const halfAt = (y: number) => {
    const u = Math.max(0, Math.min(1, (bottom - y) / Math.max(1, bottom - top)));
    return (width / 2) * (1 - 0.58 * u);
  };
  const hb = halfAt(bottom);
  const hh = halfAt(head);
  const wob = Math.sin(t * 2.2) * (hh * 0.22);
  const faceR = width * 0.13;
  const column =
    `M ${(x - hb).toFixed(1)} ${bottom}` +
    ` L ${(x - hh).toFixed(1)} ${head.toFixed(1)}` +
    ` Q ${(x + wob).toFixed(1)} ${(head - hh * 1.6).toFixed(1)} ${(x + hh).toFixed(1)} ${head.toFixed(1)}` +
    ` L ${(x + hb).toFixed(1)} ${bottom} Z`;
  return (
    // 0.62 rather than a hair of tint: the run that is actually on screen is
    // the one in the DIRT, and a pale blue at 0.4 over brown mixes to a grey
    // post. Translucent has to survive its own background.
    <g opacity={0.62}>
      <path d={column} fill={kidTheme.water} />
      {/* A brighter core, so the column has water's own vertical highlight
          rather than reading as one flat swatch. */}
      <path
        d={column}
        fill="none"
        stroke={kidTheme.waterLight}
        strokeWidth={Math.max(2, width * 0.09)}
        opacity={0.5}
      />
      {/* Drip, low in the soil run, once the water has risen past her. */}
      <g opacity={Math.min(1, Math.max(0, (faceY - head) / 26))}>
        <circle cx={x - faceR * 1.7} cy={faceY} r={faceR} fill={kidTheme.ink} />
        <circle cx={x + faceR * 1.7} cy={faceY} r={faceR} fill={kidTheme.ink} />
        <path
          d={`M ${(x - faceR * 1.8).toFixed(1)} ${(faceY + faceR * 2.2).toFixed(1)} q ${(faceR * 1.8).toFixed(1)} ${(faceR * 1.8).toFixed(1)} ${(faceR * 3.6).toFixed(1)} 0`}
          stroke={kidTheme.ink}
          strokeWidth={faceR * 0.8}
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// The sprout row — the five siblings, in the background of every act-three wide
// that has to measure the hero against them
// ---------------------------------------------------------------------------

/**
 * **Scene 15's marks, mirrored — and they are CANON because plants cannot
 * move.** Read from `act2.tsx:1887-1892` (`x` and the ground line each was
 * planted on); this act may not edit that file, so the table is copied with the
 * source cited rather than shared. **Retro item**: the sprout row's geometry
 * belongs in `common.tsx`, where act two, act three and the recap can all read
 * one table instead of three.
 */
const SPROUT_ROW = [
  { x: 236, ground: 812, leaves: 4, phase: 0.4 },
  { x: 470, ground: 776, leaves: 5, phase: 2.1 },
  { x: 1180, ground: 790, leaves: 4, phase: 3.6 },
  { x: 1452, ground: 832, leaves: 5, phase: 1.2 },
  { x: 1734, ground: 878, leaves: 4, phase: 4.8 },
] as const;

/**
 * **How tall a sibling is, and it is measured against the hero rather than in
 * pixels.**
 *
 * The script sells two beats against this row — Scene 24's "a visible growth
 * spurt past the sprout row" and Scene 26's "taller than the sprout row" — so
 * what has to be true is a *ratio*, not a number: after the spurt Pip's crown
 * clears theirs, and before it she does not. `base` is therefore the height of
 * a sibling standing on `MEADOW.ground`, given as a fraction of the hero's own
 * height in this shot, and each one is then scaled by how far back it stands:
 * the row is planted across a hundred pixels of depth (ground lines 776–878)
 * and a plant on the far line has to be smaller than one on the near line or
 * the field goes flat.
 *
 * 0.8 is the fraction. At Scene 24's `leaf` Pip (230px) the row stands a head
 * taller than she does; the spurt takes her to 302px and lands her a clear
 * forty pixels over the tallest of them, which is the beat.
 */
const SIBLING_OF_PIP = 0.8;

function siblingHeight(pipHeight: number, ground: number): number {
  const depth = (ground - MEADOW.horizon) / (MEADOW.ground - MEADOW.horizon);
  return pipHeight * SIBLING_OF_PIP * depth;
}

/**
 * One sibling, in the background of a wide: the same species as the hero, at a
 * distance, and never looked at by anybody.
 *
 * Flat, outline-free and tinted off the plate's own grass, because these are
 * scenery: an ink outline at this size would make five background plants read
 * as five characters, and the one thing the row may not do is pull focus from
 * the plant the scene is about.
 */
const Sibling: React.FC<{
  x: number;
  ground: number;
  h: number;
  leaves: number;
  phase: number;
  t: number;
  tone: string;
}> = ({ x, ground, h, leaves, phase, t, tone }) => {
  const sway = Math.sin(t * 0.5 + phase) * 1.4;
  const top = ground - h;
  const base = h * 0.042;
  const tip = h * 0.016;
  const capR = h * 0.058;
  return (
    <g transform={`rotate(${sway.toFixed(2)} ${x} ${ground})`} fill={tone}>
      <ellipse cx={x} cy={ground + 3} rx={h * 0.13} ry={h * 0.032} fill={kidTheme.ink} opacity={0.16} />
      <path
        d={
          `M ${(x - base).toFixed(1)} ${ground}` +
          ` Q ${(x - base * 0.7).toFixed(1)} ${(top + h * 0.45).toFixed(1)} ${(x - tip).toFixed(1)} ${(top + 6).toFixed(1)}` +
          ` L ${(x + tip).toFixed(1)} ${(top + 6).toFixed(1)}` +
          ` Q ${(x + base * 0.7).toFixed(1)} ${(top + h * 0.45).toFixed(1)} ${(x + base).toFixed(1)} ${ground} Z`
        }
      />
      {Array.from({ length: leaves }, (_, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        const u = 0.5 + (i / Math.max(1, leaves - 1)) * 0.4;
        const y = ground - h * u;
        const len = h * (0.44 - u * 0.2);
        const lift = len * 0.56;
        return (
          <path
            key={i}
            d={
              `M ${(x + side * 2).toFixed(1)} ${y.toFixed(1)}` +
              ` q ${(side * len * 0.55).toFixed(1)} ${(-lift).toFixed(1)} ${(side * len).toFixed(1)} ${(-lift * 0.5).toFixed(1)}` +
              ` q ${(-side * len * 0.42).toFixed(1)} ${(lift * 0.86).toFixed(1)} ${(-side * len).toFixed(1)} ${(lift * 0.5).toFixed(1)} Z`
            }
          />
        );
      })}
      <ellipse cx={x} cy={top - capR * 0.5} rx={capR} ry={capR * 0.82} />
    </g>
  );
};

/** The whole row, as one background layer. `pipHeight` is the hero's, in px. */
const SproutRow: React.FC<{ pipHeight: number; tone: string; t: number }> = ({
  pipHeight,
  tone,
  t,
}) => (
  <WideLayer zIndex={1}>
    {SPROUT_ROW.map((s) => (
      <Sibling
        key={s.x}
        x={s.x}
        ground={s.ground}
        h={siblingHeight(pipHeight, s.ground)}
        leaves={s.leaves}
        phase={s.phase}
        t={t}
        tone={tone}
      />
    ))}
  </WideLayer>
);

/**
 * Pip's height in composition px — crown to dirt — for a state and a scale.
 * `pipCrownLocal` is her own geometry and the box's floor is local 230, so this
 * is the one honest way to measure a hero whose size is a function of the plot.
 */
function pipHeightPx(state: "leaf" | "young", scale: number, morph = 1): number {
  return (230 - pipCrownLocal(state, morph)) * scale;
}

// ---------------------------------------------------------------------------
// Scene 17 — The air order
// ---------------------------------------------------------------------------

const S17_BUBBLES: Record<string, string> = {
  a2_54_pip: "Where does one order air?",
  // Canon capital, and the clip carries it too — this is the ep-2 take,
  // cache-migrated, so "FEEL" is the approved read rather than a fresh draw.
  a2_55_puff: "But you can FEEL me.",
};

const AirOrderScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [invFrom] = lineWindow(scene, "a2_53_pip");
  const [askFrom, askTo] = lineWindow(scene, "a2_54_pip");
  const [emptyFrom, emptyTo] = heldBeat(scene, "a2_54_pip");
  const [puffFrom] = lineWindow(scene, "a2_55_puff");

  // Her face: brisk through the inventory, flat on the question with no
  // obvious supplier, and unbothered when the answer turns out to have been
  // standing there the whole time. Placed with `emotionAt` (absolute frames),
  // so the held-beat NO-LEAD rule is satisfied by placement itself.
  const emotion = emotionAt(
    frame,
    [
      { at: invFrom, emotion: "neutral" as Emotion },
      { at: askFrom, emotion: "skeptical" as Emotion },
      { at: puffFrom + 20, emotion: "neutral" as Emotion },
    ],
    "neutral",
  );

  // Puff's arrival: he does not fly in, he *becomes visible*, on his own line.
  // Anything else contradicts the catch-phrase he arrives saying.
  const seen = interpolate(frame, [puffFrom - 2, puffFrom + 16], [0, PUFF_SEEN], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });
  // The grass flattens in a soft ring as he says it. One ring on the entrance,
  // and a smaller one under the tail of the line.
  const ring1 = (frame - (puffFrom + 4)) / 40;
  const ring2 = (frame - (puffFrom + 30)) / 46;

  // "Empty sky. Grass stirs, just barely." The stir is a slow travelling
  // shimmer along the crest — barely, which is the direction, so it is two
  // pixels of a sine and no more.
  const stir = frame >= emptyFrom && frame < emptyTo ? kidEase.easeInOutSine((frame - emptyFrom) / 24) : 0;

  // She points the new leaf at the sky on the inventory and lets it fall back
  // when the answer turns out to be at ground level. **It RAMPS, and it is all
  // the way home before the held beat opens**: the first pass hard-cut the leaf
  // from 14° to rest on `askTo`, which is the opening frame of the 45f "empty
  // sky" hold — a one-frame flick inside a scripted silence.
  const point = pointRamp(
    interpolate(frame, [invFrom, invFrom + 18, askTo - 26, askTo - 8], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeInOutSine,
    }),
  );

  const pip = pipMark("leaf");
  const puff = puffMark();
  const cast: Cast = { pip, puff };

  return (
    <PlateWorld
      plate="meadow_day"
      phase={0.4}
      overlay={
        <>
          {/* **The board is GONE before the silence starts.** `until` is when
              its 10-frame exit begins, and it used to be `puffFrom - 6` —
              which put six frames of a posted prop rotating and shrinking out
              of frame inside the 45-frame "empty sky" held beat. `emptyFrom`
              is that beat's first frame, so the exit now finishes two frames
              before it, under the tail of her own question. Nothing moves in
              a scripted silence, props included. */}
          <InventoryBoard from={invFrom} until={emptyFrom - 12} />
          <Bubbles scene={scene} cast={cast} text={S17_BUBBLES} />
        </>
      }
    >
      <WideLayer zIndex={1}>
        <GrassRing x={PUFF_AT.x} y={MEADOW.ground + 6} u={ring1} radius={430} />
        <GrassRing x={PUFF_AT.x} y={MEADOW.ground + 6} u={ring2} radius={300} />
        {/* The barely-there stir in the held beat: three short blades leaning. */}
        {stir > 0
          ? [980, 1180, 1390].map((bx, i) => (
              <path
                key={bx}
                d={`M ${bx} ${MEADOW.ground - 4} q ${Math.sin(t * 1.6 + i) * 12 * stir} -34 ${Math.sin(t * 1.6 + i) * 26 * stir} -62`}
                stroke={mixHex(PLATES.meadow_day.grass, kidTheme.grassDark, 0.4)}
                strokeWidth={7}
                strokeLinecap="round"
                fill="none"
                opacity={0.75 * stir}
              />
            ))
          : null}
      </WideLayer>
      <Pip
        x={pip.x}
        y={pip.y}
        scale={pip.scale}
        state="leaf"
        phase={PHASE.pip}
        emotion={emotion}
        speaking={stage.speaking("pip")}
        point={point}
        look={frame >= puffFrom ? { x: 0.85, y: 0.4 } : frame >= askFrom ? { x: 0.2, y: -0.8 } : "camera"}
        zIndex={3}
      />
      <Puff
        x={puff.x}
        y={puff.y}
        scale={PUFF_AT.scale}
        opacity={seen}
        phase={PHASE.puff}
        emotion="happy"
        pose="wave"
        wave={0.7}
        wisps={0.5}
        speaking={stage.speaking("puff")}
        look={{ x: -0.8, y: -0.1 }}
        zIndex={4}
      />
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 18 — The guest that lives at the party
// ---------------------------------------------------------------------------

const S18_BUBBLES: Record<string, string> = {
  a3_01_puff: "I am air! I am HERE!",
  a3_02_pip: "Since when?",
  a3_03_puff: "The guest that lives here!",
  a3_05_pip: "Air order. Noted. Promoted.",
};

const GuestScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [popFrom] = lineWindow(scene, "a3_01_puff");
  const [alwaysFrom] = lineWindow(scene, "a3_03_puff");
  const [noteFrom, noteTo] = lineWindow(scene, "a3_05_pip");
  const [swerveFrom, swerveTo] = lineWindow(scene, "a3_06_narrator");

  // This scene has no held beat, so the emotion cues keep the kit's default
  // eight-frame lead — the rule is specific to held-beat scenes and this is
  // the one scene in the act that is allowed the reaction running early.
  const pipFace = useEmotion(
    scene,
    "pip",
    { a3_02_pip: "skeptical", a3_05_pip: "neutral" },
    "skeptical",
  );
  const puffFace = useEmotion(
    scene,
    "puff",
    { a3_01_puff: "excited", a3_03_puff: "proud" },
    "happy",
  );

  // The meadow's grass ripples wherever he gestures — one ring per line of his,
  // which is what makes an invisible character legible as a *presence* rather
  // than as a smudge.
  const ripple = (at: number, span: number) => (frame - at) / span;

  // THE SWERVE, firing 2, and it is the Narrator's: "Who makes the wind that
  // stirs him? Moving on." Nobody looks up. The only thing that acknowledges
  // the question is the light itself — a warm wash swells at the frame's
  // sun-ward edge on the question and is gone by "Moving on.", which is
  // entirely deniable and is the joke drawn rather than pointed at.
  const swerve = interpolate(
    frame,
    [swerveFrom, swerveFrom + 26, swerveFrom + 52, swerveTo],
    [0, 1, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );

  const cam: Cam = {
    x: PIP_X,
    y: MEADOW.ground - 140,
    // A very slow push across the scene, parked at 1.10 — the number Scene 19
    // opens on. Half a percent a second, under the threshold of noticing.
    zoom: interpolate(frame, [0, scene.durationInFrames], [1, 1.1], {
      extrapolateRight: "clamp",
    }),
  };

  const pip = pipMark("leaf");
  const puff = puffMark();
  const cast: Cast = { pip: proj(cam, pip), puff: proj(cam, puff) };

  return (
    <PlateWorld
      plate="meadow_day"
      phase={1.1}
      cam={cam}
      overlay={<Bubbles scene={scene} cast={cast} text={S18_BUBBLES} />}
    >
      <WideLayer zIndex={1}>
        <GrassRing x={PUFF_AT.x} y={MEADOW.ground + 6} u={ripple(popFrom + 6, 44)} radius={420} />
        <GrassRing x={PUFF_AT.x - 120} y={MEADOW.ground + 6} u={ripple(alwaysFrom + 8, 52)} radius={520} />
        <GrassRing x={PUFF_AT.x + 90} y={MEADOW.ground + 6} u={ripple(alwaysFrom + 40, 46)} radius={360} />
      </WideLayer>
      <Pip
        x={pip.x}
        y={pip.y}
        scale={pip.scale}
        state="leaf"
        phase={PHASE.pip}
        emotion={pipFace}
        speaking={stage.speaking("pip")}
        // She files the air order on "Noted." — the leaf comes up like a pen.
        // **26° again, and honestly this time**: it was 26 in the first pass,
        // hard-cut on and off, into the band where the old straight leaf
        // vanished behind her cheek; the repair pass pulled it down to the
        // 14° ceiling. With the elbow the leaf bends past her head, so the
        // pose is back where the scene wanted it — a pen held a little higher
        // than "held out" — and it ramps at both ends.
        point={pointRamp(
          interpolate(
            frame,
            [noteFrom, noteFrom + 16, noteTo + 6, noteTo + 24],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
          ),
          26,
        )}
        look={{ x: 0.8, y: 0.25 }}
        zIndex={3}
      />
      <Puff
        x={puff.x}
        y={puff.y}
        scale={PUFF_AT.scale}
        opacity={PUFF_SEEN}
        phase={PHASE.puff}
        emotion={puffFace}
        pose={stage.speaking("puff") ? "cheer" : "rest"}
        wisps={0.6}
        swell={0.2 + 0.2 * Math.sin(t * 1.3)}
        speaking={stage.speaking("puff")}
        look={{ x: -0.8, y: 0 }}
        zIndex={4}
      />
      {/* The swerve's wash. Inside the camera, because it is the light in the
          field rather than a graphic on the frame. */}
      {swerve > 0.01 ? (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 900px 720px at 1900px 120px, rgba(255,214,110,0.55) 0%, rgba(255,214,110,0.18) 45%, transparent 74%)",
            opacity: swerve,
            pointerEvents: "none",
            zIndex: 8,
          }}
        />
      ) : null}
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 19 — The kitchen takes its first breath
// ---------------------------------------------------------------------------

const S19_BUBBLES: Record<string, string> = {
  a3_08_puff: "The leaf is EATING me!",
  a3_09_pip: "Only the fizzy bit.",
  a3_10_puff: "I have PARTS?",
  a3_12_pip: "And look. It gives one back.",
  a3_13_puff: "A fresh one!",
  // Drawn caps the clip does not carry — script.md marks this one explicitly.
  a3_15_puff: "I TRADED with a PLANT!",
  a3_16_pip: "It will do.",
  a3_17_puff: "The air will do!",
};

const FirstBreathScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [beamFrom, beamTo] = lineWindow(scene, "a3_07_narrator");
  const [eatFrom] = lineWindow(scene, "a3_08_puff");
  const [backFrom] = lineWindow(scene, "a3_12_pip");
  const [stampFrom] = lineWindow(scene, "a3_16_pip");
  const [, holdTo] = heldBeat(scene, "a3_16_pip");

  const pipFace = useEmotion(
    scene,
    "pip",
    { a3_09_pip: "neutral", a3_12_pip: "happy", a3_16_pip: "neutral" },
    "neutral",
    NO_LEAD,
  );
  const puffFace = useEmotion(
    scene,
    "puff",
    {
      a3_08_puff: "amazed",
      a3_10_puff: "amazed",
      a3_13_puff: "excited",
      a3_15_puff: "excited",
      a3_17_puff: "proud",
    },
    "happy",
    NO_LEAD,
  );

  const cam: Cam = {
    x: PIP_X + 120,
    y: MEADOW.ground - 190,
    // Opens on Scene 18's closing 1.10 (boundary checklist) and pushes to the
    // leaf across the Narrator's line, parked long before the stamp's hold.
    zoom: interpolate(frame, [0, beamTo], [1.1, 1.34], {
      extrapolateRight: "clamp",
      easing: kidEase.easeInOutSine,
    }),
  };

  const pip = pipMark("leaf");
  const puff = puffMark();

  // The leaf, in composition coordinates: where the beam lands, where the
  // fizzy bit goes in and where the fresh one comes out.
  const leaf = { x: PIP_X + 108, y: PIP_Y + CHAR_BOX.pip / 2 - (230 - 134) * PIP_SCALE };
  const puffCentre = { x: PUFF_AT.x, y: PUFF_AT.y - 30 };

  // Ray lays one beam on the leaf; it stays on for the rest of the scene,
  // because the kitchen does not switch off again.
  const power = interpolate(frame, [beamFrom + 18, beamFrom + 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });
  const glow = power * (0.72 + 0.28 * Math.sin(t * 1.8));

  // IN: the fizzy bit, out of Puff and into the leaf, on the Narrator's line
  // and again under his carbon-dioxide line. OUT: a different, brighter mote,
  // back to Puff, on "It gives one back."
  const inhale = (frame - (beamFrom + 58)) / 46;
  const inhale2 = (frame - (eatFrom + 96)) / 52;
  const exhale = (frame - (backFrom + 40)) / 54;
  const exhale2 = (frame - (backFrom + 108)) / 58;

  const cast: Cast = { pip: proj(cam, pip), puff: proj(cam, puff) };

  return (
    <PlateWorld
      plate="meadow_day"
      phase={1.9}
      cam={cam}
      overlay={<Bubbles scene={scene} cast={cast} text={S19_BUBBLES} />}
    >
      <WideLayer zIndex={2}>
        <LightBeam fromX={2260} fromY={-260} toX={leaf.x} toY={leaf.y} power={power} t={t} />
      </WideLayer>
      <Pip
        x={pip.x}
        y={pip.y}
        scale={pip.scale}
        state="leaf"
        phase={PHASE.pip}
        emotion={pipFace}
        speaking={stage.speaking("pip")}
        // The leaf holds itself up into the beam as the beam comes on — the
        // ramp IS the beam's own ramp — and does not move again for the rest
        // of the scene, so nothing of hers enters the stamp's held beat.
        point={pointRamp(power)}
        look={
          frame >= stampFrom && frame < holdTo
            ? { x: 0.35, y: 0.1 }
            : { x: 0.6, y: -0.1 }
        }
        zIndex={3}
      />
      <WideLayer zIndex={4}>
        {/* The leaf glowing: a soft warm disc on the leaf itself, breathing. */}
        {glow > 0.02 ? (
          <ellipse cx={leaf.x + 40} cy={leaf.y} rx={128} ry={74} fill={kidTheme.star} opacity={0.36 * glow} />
        ) : null}
        <Mote from={puffCentre} to={leaf} u={inhale} color={kidTheme.airCool} t={t} />
        <Mote from={puffCentre} to={leaf} u={inhale2} color={kidTheme.airCool} t={t} size={11} />
        <Mote from={leaf} to={puffCentre} u={exhale} color={kidTheme.mint} t={t} size={15} />
        <Mote from={leaf} to={puffCentre} u={exhale2} color={kidTheme.mint} t={t} size={13} />
      </WideLayer>
      <Puff
        x={puff.x}
        y={puff.y}
        scale={PUFF_AT.scale}
        opacity={PUFF_SEEN}
        phase={PHASE.puff}
        emotion={puffFace}
        pose={stage.speaking("puff") ? "cheer" : "rest"}
        wisps={0.55}
        // He deflates a hair on the in-breath and comes back on the trade-back:
        // the mechanism, drawn on the character it is happening to.
        swell={0.24 - 0.18 * Math.max(0, Math.min(1, inhale)) + 0.3 * Math.max(0, Math.min(1, exhale))}
        speaking={stage.speaking("puff")}
        // He watches her grade the air, and he is still watching when the 30f
        // hold ends: the window closes on `holdTo`, not on `stampTo`, because
        // `stampTo` is the hold's opening frame and nothing starts in there.
        look={frame >= stampFrom && frame < holdTo ? { x: -0.9, y: 0.2 } : { x: -0.7, y: 0.1 }}
        zIndex={5}
      />
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 20 — The tree made of air
// ---------------------------------------------------------------------------

const S20_BUBBLES: Record<string, string> = {
  a3_19_drip: "Wood.",
  a3_20_puff: "I'd have said wood too.",
  a3_23_puff: "She is made of ME.",
  // Clip: "I am going to be a tree." Seven words on screen is over the house
  // ceiling of six and `SpeechBubble` warns on every render; the trim keeps the
  // register, the drawn capital and the whole joke.
  a3_24_puff: "I will be a TREE.",
  a3_25_ray: "Mostly air and water.",
  a3_26_pip: "Less admiring. More building.",
};

/** Where the mind-blower parks. See the camera note inside the scene. */
const S20_PUSH = { zoom: 1.35, x: 1350, y: 660 } as const;

const TreeOfAirScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [lookFrom, lookTo] = lineWindow(scene, "a3_18_narrator");
  const [digFrom] = lineWindow(scene, "a3_21_narrator");
  const [, madeTo] = lineWindow(scene, "a3_22_narrator");
  const [, holdTo] = heldBeat(scene, "a3_22_narrator");
  const [proudFrom] = lineWindow(scene, "a3_24_puff");

  const pipFace = useEmotion(
    scene,
    "pip",
    { a3_26_pip: "grumpy" },
    "neutral",
    NO_LEAD,
  );
  const puffFace = useEmotion(
    scene,
    "puff",
    { a3_20_puff: "neutral", a3_23_puff: "amazed", a3_24_puff: "proud" },
    "happy",
    NO_LEAD,
  );

  // --- the camera ---------------------------------------------------------
  // Four positions, and every move parks before the beat it leads into:
  //
  //   1  the group, wide, at the cut in from Scene 19;
  //   2  the lift to the tree, on "Now look at the big old tree" — wide enough
  //      that Drip and Puff are still in frame to answer "Wood.";
  //   3  the PUSH TOWARD THE TREE on the dirt line and the mind-blower;
  //   4  back out to the group for the stamp and the last three lines.
  //
  // **S20_PUSH is the repair pass's reframe, and the arithmetic is the ruling.**
  // The first version parked at 1.66 about the tree itself (1588, 430), which
  // maps Pip's feet to y 1213, slices Drip and Puff at the neck on the bottom
  // edge and puts the volcano at x −490 — off frame for four seconds, in an act
  // whose one continuity rule is that it is not. The mind-blower's picture is
  // the TREE being enormous, not the cast being cropped, so:
  //
  //   zoom 1.35 about (1350, 660)   tree      x 1671, canopy 1498–1844, 529px
  //                                           tall — still the biggest object
  //                                           in the frame by a factor of two
  //                                 volcano   x −19: its right slope is in
  //                                           frame at the left edge
  //                                 Drip      feet at y 1049, 31px of floor
  //                                 Pip       x 624, feet at 987
  //                                 Puff      x 1139, bottom at 990
  //
  // and it parks ON `madeTo` — the frame the sentence ends — rather than six
  // frames into the 60-frame hold it opens.
  const zoom = interpolate(
    frame,
    [0, lookFrom + 40, lookTo, digFrom + 34, madeTo, holdTo, holdTo + 46],
    [1.0, 1.0, 1.26, 1.26, S20_PUSH.zoom, S20_PUSH.zoom, 1.02],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );
  const camX = interpolate(
    frame,
    [0, lookFrom + 40, lookTo, digFrom + 34, madeTo, holdTo, holdTo + 46],
    [WIDTH / 2, WIDTH / 2, 1290, 1290, S20_PUSH.x, S20_PUSH.x, WIDTH / 2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );
  const camY = interpolate(
    frame,
    [0, lookTo, madeTo, holdTo, holdTo + 46],
    [MEADOW.ground - 150, 640, S20_PUSH.y, S20_PUSH.y, MEADOW.ground - 150],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );
  const cam: Cam = { x: camX, y: camY, zoom };

  // --- the arrivals -------------------------------------------------------
  // Drip and Ray join the scene under the camera move, which is what keeps
  // them from being pop-ins: Drip comes UP out of the plumbing she has been in
  // since Act Two, and Ray condenses out of the beam that has been on the leaf
  // since Scene 19. Both are finished before the first reply.
  const dripUp = interpolate(frame, [10, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });
  const rayIn = interpolate(frame, [24, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  // **THE BEAM RAY ARRIVES DOWN, and it is now actually drawn.** The boundary
  // note has always claimed his entrance is "the light already in the shot
  // resolving into a body"; before the repair pass Scene 20 drew no beam at
  // all and he faded up from nothing at x 690 while Scene 19's beam was three
  // quarters of a frame away. So: the shot opens on Scene 19's beam, still on
  // the leaf, in world coordinates (the cut reframes, the light does not move);
  // its landing point travels to his mark across the first fifty frames; and it
  // dims out as he reaches full opacity. Where it lands, he is.
  const beamTravel = interpolate(frame, [4, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const beamPower = interpolate(frame, [0, 54, 86], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  // --- "Dig under a tree. The dirt is all still there." --------------------
  // The window opens under the tree and shows what is there: dirt, all of it,
  // undisturbed. It is the mind-blower's control experiment and it is on
  // screen for exactly as long as the sentence is.
  // It is gone BY `madeTo`, not twenty-four frames into the hold that opens on
  // it: the hole closes while the sentence is still being said.
  const dig = interpolate(frame, [digFrom + 40, digFrom + 74, madeTo - 30, madeTo], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  const pip = pipMark("leaf");
  const puff = puffMark();
  const drip = dripMark();
  const ray = rayMark({ x: 690, y: 372, scale: 0.72 });
  // Scene 19's leaf, and Ray's face — the two ends of the beam's travel.
  const s19Leaf = { x: PIP_X + 108, y: PIP_Y + CHAR_BOX.pip / 2 - (230 - 134) * PIP_SCALE };
  const rayFace = { x: 690, y: 372 - 68 * 0.72 };
  const beamTo = {
    x: s19Leaf.x + (rayFace.x - s19Leaf.x) * beamTravel,
    y: s19Leaf.y + (rayFace.y - s19Leaf.y) * beamTravel,
  };
  const cast: Cast = {
    pip: proj(cam, pip),
    puff: proj(cam, puff),
    drip: proj(cam, drip),
    ray: proj(cam, ray),
  };

  // Everyone looks at the tree while the camera is on it, and back at whoever
  // is talking afterwards. A five-hander in which nobody looks at the object of
  // the scene is a five-hander about nothing.
  const atTree = frame >= lookFrom + 30 && frame < holdTo;

  return (
    <PlateWorld
      plate="meadow_day"
      phase={2.7}
      cam={cam}
      overlay={
        <>
          {/* RULE STAMP, not a WordCard: a rule is not a vocabulary word.
              It lands on the second half of "I am going to be a tree."
              **BEFORE `Bubbles`, and that is the bubble law rather than
              housekeeping**: the stamp carries `zIndex: 30` (see `RuleStamp`)
              against `SpeechBubble`'s default 40, and its rise-arrow is a
              480px shaft at 0.4 opacity, so painted after the bubbles it
              drew a grey bar straight across "be a TREE." — the act's biggest
              graphic breaking the one rule the whole episode keeps. A bubble is
              above everything. */}
          <RuleStamp text="A TREE IS MADE OF AIR" from={proudFrom + 26} y={318} />
          <Bubbles scene={scene} cast={cast} text={S20_BUBBLES} />
        </>
      }
    >
      {/* The beam Ray arrives down — behind everybody, because it is light in
          the field rather than an object standing in it. */}
      <WideLayer zIndex={1}>
        <LightBeam
          fromX={2260}
          fromY={-260}
          toX={beamTo.x}
          toY={beamTo.y}
          power={beamPower}
          t={t}
        />
      </WideLayer>
      {/* The hole under the tree — inside the camera, because it is a place. */}
      <WideLayer zIndex={1}>
        {dig > 0.01 ? (
          <g opacity={dig}>
            <ellipse
              cx={MEADOW.tree.x}
              cy={MEADOW.horizon + 74}
              rx={150 * dig}
              ry={40 * dig}
              fill="#5e2e18"
              stroke={kidTheme.ink}
              strokeWidth={5}
            />
            <ellipse cx={MEADOW.tree.x} cy={MEADOW.horizon + 80} rx={128 * dig} ry={30 * dig} fill="#7a4022" />
            {/* Crumbs of the dirt that is all still there. */}
            {[[-70, 6], [-14, -8], [46, 10], [92, -4], [16, 18]].map(([dx, dy]) => (
              <ellipse
                key={`${dx}-${dy}`}
                cx={MEADOW.tree.x + dx}
                cy={MEADOW.horizon + 80 + dy}
                rx={13}
                ry={7}
                fill="#4a2312"
                opacity={0.8}
              />
            ))}
          </g>
        ) : null}
      </WideLayer>
      <Drip
        x={drip.x}
        y={drip.y + (1 - dripUp) * 90}
        scale={DRIP_AT.scale}
        phase={PHASE.drip}
        emotion="happy"
        speaking={stage.speaking("drip")}
        look={atTree ? { x: 0.9, y: -0.5 } : "right"}
        zIndex={2}
      />
      <Pip
        x={pip.x}
        y={pip.y}
        scale={pip.scale}
        state="leaf"
        phase={PHASE.pip}
        emotion={pipFace}
        speaking={stage.speaking("pip")}
        look={atTree ? { x: 0.9, y: -0.55 } : { x: -0.4, y: 0 }}
        zIndex={3}
      />
      <Puff
        x={puff.x}
        y={puff.y}
        scale={PUFF_AT.scale}
        opacity={PUFF_SEEN}
        phase={PHASE.puff}
        emotion={puffFace}
        pose={frame >= proudFrom ? "cheer" : "rest"}
        wisps={0.55}
        swell={0.2 + 0.35 * Math.max(0, Math.min(1, (frame - proudFrom) / 30))}
        speaking={stage.speaking("puff")}
        look={atTree ? { x: 0.85, y: -0.55 } : { x: -0.7, y: 0.1 }}
        zIndex={4}
      />
      <Ray
        x={ray.x}
        y={ray.y}
        scale={0.72}
        brightness={RAY_LIGHT}
        spectrum={0.45}
        opacity={rayIn}
        phase={PHASE.ray}
        emotion="happy"
        speaking={stage.speaking("ray")}
        look={atTree ? { x: 0.9, y: -0.4 } : { x: 0.3, y: 0.5 }}
        zIndex={5}
      />
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 21 — One crumb of sugar
// ---------------------------------------------------------------------------

/**
 * The cutaway's world. `grass_close` has no skyline to seat, so it takes its
 * own scale and top — and it is scaled up hard, because a close shot on a
 * dirt mound wants the mound to be the *ground*, not a hill in the distance.
 */
const S21_PLATE = { scale: 2.2, top: -124 } as const;
/** Where feet go in the cutaway. */
const S21_GROUND = 700;

/**
 * The water's run, in the cutaway's own coordinates.
 *
 * It starts 160px UNDER the ground line — this shot is a cross-section of a
 * dirt mound, so there is soil to rise through, and that is the only stretch of
 * the run that a column drawn behind an opaque stem can actually be seen in.
 * `faceY` parks Drip 46px below the dirt line: low, unmistakably not the hero's
 * face, and about as far from her chin as the frame allows.
 */
const S21_WATER = {
  /** Off the bottom of the frame: the run has no visible end, it has a source. */
  bottom: HEIGHT,
  width: 78,
  faceY: S21_GROUND + 60,
} as const;

const S21_BUBBLES: Record<string, string> = {
  a3_30_pip: "One crumb.",
  a3_31_ray: "Sugar is sunshine, stored.",
  a3_32_ray: "Look down. That is also me.",
  a3_33_pip: "How many crumbs?",
  a3_34_ray: "Every beam the sun has.",
  a3_35_ray: "That is the whole sun.",
  a3_36_ray: "It is mostly him.",
  a3_37_pip: "It will not do.",
};

const CrumbScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [cookFrom] = lineWindow(scene, "a3_27_narrator");
  const [sugarFrom, sugarTo] = lineWindow(scene, "a3_28_narrator");
  const [oneFrom] = lineWindow(scene, "a3_29_narrator");
  const [crumbHoldFrom] = heldBeat(scene, "a3_29_narrator");
  const [downFrom] = lineWindow(scene, "a3_32_ray");
  const [mathFrom, mathTo] = heldBeat(scene, "a3_35_ray");
  const [mostlyFrom] = lineWindow(scene, "a3_36_ray");
  const [mostlyHoldFrom] = heldBeat(scene, "a3_36_ray");
  const [breakFrom] = lineWindow(scene, "a3_37_pip");
  const [, breakHoldTo] = heldBeat(scene, "a3_37_pip");

  // **THE HELD-BEAT BOUNDARY, and every change of hers is on one of them.**
  // script.md: "nothing — no line, no entrance, no emotion change — starts
  // inside it", and this scene owns four of the act's holds including the two
  // spine ones. The showrunner's ruling for the cases where the realisation IS
  // the beat: land the change ON the boundary frame, as the line ends, then
  // hold dead still. So each `at` below is its hold's first frame MINUS the
  // morph length, which puts the whole move inside the line in front of it and
  // leaves the silence with nothing in it at all.
  const crumbSettle = crumbHoldFrom - 12;
  const mathSettle = mathFrom - 14;
  const mostlySettle = mostlyHoldFrom - 18;

  const pip: Mark = { x: PIP_X, y: stand("pip", S21_GROUND), scale: 0.95, who: "pip", state: "leaf" };
  const ray = { x: 430, y: 300, scale: 0.8 };
  const rayM: Mark = {
    x: ray.x,
    y: ray.y - CHAR_BOX.ray / 2 + (CHAR_BOX.ray * ray.scale) / 2,
    scale: ray.scale,
    who: "ray",
  };

  // The assembly. Everything arrives before the crumb does, in the order the
  // Narrator lists it: water from below, the fizzy bit of air, one beam.
  const stemTop = S21_GROUND - (230 - 36) * 0.95;
  const leaf = { x: pip.x + 142, y: pip.y + CHAR_BOX.pip / 2 - (230 - 134) * 0.95 };
  const water = interpolate(frame, [cookFrom + 6, cookFrom + 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const power = interpolate(frame, [cookFrom + 74, cookFrom + 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });
  const fizz = (frame - (cookFrom + 58)) / 50;

  // THE CRUMB. Born with ceremony on "Sugar." and held, alone, for the whole
  // sixty-frame beat after "One crumb of it." — the leaf glows up into it and
  // settles back, and nothing else in the frame moves for two seconds.
  const pop = spring({
    frame: frame - (sugarFrom + Math.round((sugarTo - sugarFrom) * 0.68)),
    fps,
    config: { damping: 11, mass: 0.8 },
  });
  const cook = interpolate(
    frame,
    [sugarFrom + 30, sugarFrom + 62, sugarFrom + 96],
    [0, 1, 0.35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );

  // --- the lean, and the break --------------------------------------------
  // The runner is still live here: her stem drifts toward the light while the
  // maths hangs, and she CATCHES it — on the frame she says "It will not do."
  // Scene 22 is the first one she does not correct, so this firing has to snap
  // or that one means nothing.
  // The drift now runs across HIS line and is parked on the frame the deadpan
  // hold opens ("Deadpan is stillness; nothing enters this beat"), and she
  // catches it on the first frame of her own — not four frames early, inside
  // the silence.
  const lean = pipLean(frame, [
    { at: mostlyHoldFrom - 40, to: 9.5, snapAt: breakFrom, drift: 40 },
  ]);

  const pipFace = emotionAt(
    frame,
    [
      { at: oneFrom, emotion: "neutral" as Emotion },
      { at: crumbSettle, emotion: "amazed" as Emotion, frames: 12 },
      { at: mathSettle, emotion: "neutral" as Emotion, frames: 14 },
      // The break. She is not sad about it; she has FILED it, and the face is
      // the flat one she grades things with, one notch lower.
      { at: mostlySettle, emotion: "sad" as Emotion, frames: 18 },
      // And she does not come back inside the 75-frame break either: the
      // recovery lands on the hold's END, under the Narrator's last line.
      { at: breakHoldTo, emotion: "neutral" as Emotion, frames: 20 },
    ],
    "neutral",
  );

  const cast: Cast = { pip, ray: rayM };

  return (
    <PlateWorld
      plate="grass_close"
      wide={false}
      phase={3.3}
      plateScale={S21_PLATE.scale}
      plateTop={S21_PLATE.top}
      plateDrift={6}
      overlay={<Bubbles scene={scene} cast={cast} text={S21_BUBBLES} />}
    >
      {/* Ray is a pale warm wash and the top of this plate is cream; the
          sanctioned fix for a legibility problem is to darken what is behind
          him, never to change the character. */}
      <SoftShade x={ray.x} y={ray.y} rx={430} ry={330} strength={0.22} color="90,70,40" />
      <WideLayer zIndex={2}>
        <LightBeam fromX={1980} fromY={-320} toX={leaf.x} toY={leaf.y} power={power} t={t} width={92} />
      </WideLayer>
      <Pip
        x={pip.x}
        y={pip.y}
        scale={pip.scale}
        state="leaf"
        lean={lean}
        phase={PHASE.pip}
        emotion={pipFace}
        speaking={stage.speaking("pip")}
        point={pointRamp(power)}
        // Her eyes go down to the crumb as the Narrator's line ends, not on
        // the hold's opening frame — same boundary as her face.
        look={
          frame >= crumbSettle && frame < mathTo
            ? { x: 0.55, y: 0.35 }
            : frame >= breakFrom
              ? { x: 0.1, y: 0.5 }
              : { x: -0.6, y: -0.3 }
        }
        zIndex={3}
      />
      {/* The plumbing, UNDER the hero — see `WaterLine`. */}
      <WideLayer zIndex={2}>
        <WaterLine
          x={pip.x}
          bottom={S21_WATER.bottom}
          top={stemTop}
          width={S21_WATER.width}
          faceY={S21_WATER.faceY}
          fill={water}
          t={t}
        />
      </WideLayer>
      <WideLayer zIndex={4}>
        <Mote from={{ x: 1560, y: 520 }} to={leaf} u={fizz} color={kidTheme.airCool} t={t} size={12} />
        {/* The leaf glowing as it cooks, and settling back. */}
        {cook > 0.02 ? (
          <ellipse cx={leaf.x + 20} cy={leaf.y} rx={150} ry={82} fill={kidTheme.star} opacity={0.4 * cook} />
        ) : null}
        <SugarCrumb x={leaf.x + 46} y={leaf.y - 26} pop={Math.max(0, pop)} t={t} size={11} />
      </WideLayer>
      <Ray
        x={rayM.x}
        y={rayM.y}
        scale={ray.scale}
        brightness={RAY_LIGHT}
        spectrum={0.45}
        phase={PHASE.ray}
        emotion={frame >= mostlyFrom ? "neutral" : "happy"}
        speaking={stage.speaking("ray")}
        // "Look down. That is also me." — the proudest and most begrudging
        // thing he says all episode, and he says it to the sugar.
        look={frame >= downFrom ? { x: 0.55, y: 0.9 } : { x: 0.7, y: 0.35 }}
        zIndex={5}
      />
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 22 — The stall
// ---------------------------------------------------------------------------

/** Golden hour, measured: `meadow_day` graded to a whole-frame mean of ~140. */
const GOLDEN = 1;

const S22_BUBBLES: Record<string, string> = {
  a3_40_drip: "Ask a cloud. Clouds are powerful.",
  a3_41_puff: "Or the sky's roommate?",
  a3_42_ray: "The source of every beam.",
  a3_43_ray: "No. Forget I said that.",
  a3_45_pip: "Fine.",
};

const StallScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);
  const [sourceFrom] = lineWindow(scene, "a3_42_ray");
  const [hearsFrom] = heldBeat(scene, "a3_42_ray");
  const [leanFrom] = lineWindow(scene, "a3_44_narrator");
  const [leanHoldFrom] = heldBeat(scene, "a3_44_narrator");
  const [fineFrom] = lineWindow(scene, "a3_45_pip");

  // **The two boundaries this scene turns on**, both of them a hold's opening
  // frame minus the length of the move that has to be finished by then. "He
  // hears himself" is 24 frames of a sun's assistant realising what he has just
  // recommended: the realisation lands ON the last word, and the beat is the
  // 24 frames of him sitting in it with nothing moving.
  const hearsSettle = hearsFrom - 12;
  const leanSettle = leanHoldFrom - 16;

  const pipFace = emotionAt(
    frame,
    [
      { at: 0, emotion: "grumpy" as Emotion },
      { at: leanSettle, emotion: "sad" as Emotion, frames: 16 },
      { at: fineFrom, emotion: "neutral" as Emotion, frames: 10 },
    ],
    "grumpy",
  );
  const rayFace = emotionAt(
    frame,
    [
      { at: 0, emotion: "happy" as Emotion },
      { at: hearsSettle - 14, emotion: "amazed" as Emotion, frames: 8 },
      { at: hearsSettle, emotion: "grumpy" as Emotion, frames: 12 },
    ],
    "happy",
  );

  // **THE LEAN, UNCORRECTED.** "Pip's stem leaned. This time, she let it."
  // No `snapAt`, which is the whole resolution beginning: the body said it
  // first, and the runner's two uncorrected firings are this one and Scene
  // 26's. It drifts across the Narrator's line and holds through "Fine."
  const lean = pipLean(frame, [{ at: leanFrom + 30, to: 13, drift: 54 }]);

  const pip = pipMark("leaf");
  const puff = puffMark();
  const drip = dripMark();
  // His bubbles go LEFT: the default side would park them at x 970, across the
  // face of the one enormous obvious supplier nobody in this scene is looking
  // at. Left of him they sit over empty sky, a long way above the volcano.
  const ray: Mark = { ...rayMark(), side: "left" };
  const sunny = sunnyMark();
  const cast: Cast = { pip, puff, drip, ray };

  // Everyone is carefully looking at things that are not the sun. Ray is the
  // only one whose eyes go up, and only for the length of his own sentence —
  // then he hears himself and takes them back down.
  const rayLook: { x: number; y: number } =
    frame >= sourceFrom + 24 && frame < hearsSettle
      ? { x: 0.85, y: -0.85 }
      : { x: 0.2, y: 0.75 };

  return (
    <PlateWorld
      plate="meadow_day"
      phase={4.1}
      grade={GOLDEN}
      overlay={<Bubbles scene={scene} cast={cast} text={S22_BUBBLES} />}
    >
      <Drip
        x={drip.x}
        y={drip.y}
        scale={DRIP_AT.scale}
        phase={PHASE.drip}
        emotion="happy"
        speaking={stage.speaking("drip")}
        // Down and away: the cloud she is recommending is a lie of omission
        // and she knows it.
        look={{ x: 0.5, y: 0.6 }}
        zIndex={2}
      />
      <Pip
        x={pip.x}
        y={pip.y}
        scale={pip.scale}
        state="leaf"
        lean={lean}
        phase={PHASE.pip}
        emotion={pipFace}
        speaking={stage.speaking("pip")}
        look={frame >= leanSettle ? { x: 0.25, y: 0.55 } : { x: -0.35, y: 0.5 }}
        // The light goes out of her eyes as the Narrator finishes and it STAYS
        // out: the first pass snapped it back to 1 on `fineTo`, which is the
        // opening frame of the trailing 45f hold the act turns on.
        eyeLife={frame >= leanSettle ? 0.3 : 1}
        zIndex={3}
      />
      <Puff
        x={puff.x}
        y={puff.y}
        scale={PUFF_AT.scale}
        opacity={PUFF_SEEN}
        phase={PHASE.puff}
        emotion="happy"
        wisps={0.5}
        speaking={stage.speaking("puff")}
        look={{ x: -0.3, y: 0.6 }}
        zIndex={4}
      />
      <Ray
        x={ray.x}
        y={ray.y}
        scale={RAY_AT.scale}
        brightness={RAY_LIGHT}
        spectrum={0.45}
        phase={PHASE.ray}
        emotion={rayFace}
        speaking={stage.speaking("ray")}
        look={rayLook}
        zIndex={5}
      />
      {/* THE ONE ENORMOUS OBVIOUS SUPPLIER. He has no line in this scene and
          he is the whole subject of it: five characters carefully not looking
          at a sun that takes up a fifth of the frame. Staged rather than
          implied — script.md's visual asks for him by name ("with one
          enormous obvious supplier in it") even though the cast list, which
          is a list of voices, does not. */}
      <Sunny
        x={sunny.x}
        y={sunny.y}
        scale={SUNNY_AT.scale}
        phase={PHASE.sunny}
        emotion="proud"
        speaking={false}
        look={{ x: -0.5, y: 0.6 }}
        raySpeed={0.1}
        zIndex={1}
      />
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 23 — The hire
// ---------------------------------------------------------------------------

const S23_BUBBLES: Record<string, string> = {
  a3_47_pip: "You. The big one. Down here.",
  a3_49_pip: "The cooking runs on light.",
  a3_50_pip: "All of it ran on you.",
  a3_51_pip: "Never the delivery service.",
  a3_52_pip: "He is the oven.",
  a3_53_pip: "The job is yours. Dawn.",
  a3_54_sunny: "I know.",
  a3_55_sunny: "You're welcome! HA! HA!",
  a3_56_sunny: "All of it cooks on ME!",
  a3_57_ray: "That is also true.",
  a3_58_sunny: "Every apple is MY apple!",
  a3_59_pip: "Do not be late.",
};

const HireScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [addressFrom] = lineWindow(scene, "a3_47_pip");
  const [pitchFrom, pitchTo] = lineWindow(scene, "a3_49_pip");
  const [ovenFrom] = lineWindow(scene, "a3_52_pip");
  const [, ovenHoldTo] = heldBeat(scene, "a3_52_pip");
  const [jobFrom] = lineWindow(scene, "a3_53_pip");
  const [knowFrom] = lineWindow(scene, "a3_54_sunny");
  const [haFrom, haTo] = lineWindow(scene, "a3_55_sunny");
  const [ariaFrom] = lineWindow(scene, "a3_56_sunny");
  const [alsoFrom] = lineWindow(scene, "a3_57_ray");

  // Her bubbles go LEFT in this scene, into the empty half: she is talking to
  // a sun that fills the right of the frame, and a bubble parked on the
  // default side lands on the face she is addressing. Sunny's own bubbles get
  // a wider offset for the same reason — the tail still points back at him.
  const pip: Mark = { ...pipMark("leaf"), side: "left", offset: 340 };
  const puff = puffMark();
  const drip = dripMark();
  // Ray sits further in and higher than his wide mark: the 1.13 push in this
  // scene walks his ribbon off the left edge at x 372, and her bubbles live in
  // the left half of this scene, so he has to be above the stack rather than
  // behind it.
  const ray = rayMark({ x: 548, y: 252, scale: 0.78 });
  const sunny: Mark = { ...sunnyMark(), side: "left", offset: 470 };

  // **THE LEAN, AND SHE IS LETTING IT.** It starts on the frame she addresses
  // him and it never comes back — the promotion's held beat is 75 frames of a
  // hero leaning at the thing she has just admitted she runs on.
  const lean = pipLean(frame, [{ at: addressFrom, to: 12.5, drift: 70 }]);

  // **Her pointer, aimed at him, and since the elbow landed it can actually
  // get there**: `leafAt` measures 56.5° from her top node to his middle and
  // the clamp gives back 56, which the bent leaf draws with its tip outside
  // her own silhouette. This is the unlock from Scene 16 spent on the one
  // target the episode has been avoiding for three acts.
  //
  // Through `pointRamp` like every other pointer in the act: the previous
  // shape (`pointing > 0.02 ? aim.point * pointing : undefined`) stepped from
  // the rig's −4° rest to +0.3° on the frame it crossed the threshold — a
  // one-frame flick of the one limb she has.
  const aim = leafAt(pip, { x: sunny.x, y: sunny.y + CHAR_BOX.sunny / 2 - (CHAR_BOX.sunny * SUNNY_AT.scale) / 2 });
  const pointing = interpolate(frame, [addressFrom - 6, addressFrom + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });
  const point = pointRamp(pointing, aim.point);

  const pipFace = emotionAt(
    frame,
    [
      { at: 0, emotion: "neutral" as Emotion },
      { at: ovenFrom, emotion: "neutral" as Emotion },
      { at: jobFrom, emotion: "happy" as Emotion, frames: 14 },
      // Her reaction to the HA! HA! lands as the laugh ENDS, not on the first
      // frame of the 45-frame silence it detonates into. Same ruling as Scene
      // 21's: the boundary belongs to the line, the beat gets nothing.
      { at: haTo - 12, emotion: "grumpy" as Emotion, frames: 12 },
    ],
    "neutral",
  );

  // **The field's one reaction, and it is now a morph rather than a hard cut.**
  // Not `amazed` all scene: the whole meadow is listening for sixty-eight
  // seconds, and a held open mouth over that long stops being a reaction and
  // becomes the character's face. The HA! HA! is the one thing they are
  // allowed to react to — and it was a bare-string ternary, i.e. a one-frame
  // face swap on two characters at once.
  //
  // It STARTS on `haFrom` rather than finishing there, which is the opposite
  // of the emotion rule everywhere else in this act, and deliberately:
  // `haFrom` is the first frame of his line and the frame before it is the
  // last of a scripted silence, so a change that *landed* on the boundary
  // would have had to begin inside the hold. Reactions land on the boundary
  // when a line runs up to it; when a HOLD runs up to it they start on it.
  const witness = emotionAt(
    frame,
    [
      { at: 0, emotion: "neutral" as Emotion },
      { at: haFrom, emotion: "amazed" as Emotion, frames: 8 },
    ],
    "neutral",
  );

  // **He does not interrupt.** For the only time in four episodes Sunny lets
  // somebody finish, and the whole warmth of the scene rests on it — so the
  // performance in the admission is a sun visibly holding it in: his rays slow
  // right down and his face stays still. Then "I know." at nothing, and then
  // the HA! HA! detonates in the silence around it.
  const holdingIn = frame >= addressFrom && frame < knowFrom;
  const raySpeed = holdingIn ? 0.05 : frame >= ariaFrom ? 0.42 : 0.16;
  const sunnyFace = emotionAt(
    frame,
    [
      { at: 0, emotion: "happy" as Emotion },
      { at: addressFrom, emotion: "neutral" as Emotion, frames: 14 },
      { at: knowFrom, emotion: "happy" as Emotion, frames: 10 },
      { at: haFrom, emotion: "proud" as Emotion, frames: 6 },
    ],
    "happy",
  );
  // The wattage: he swells on the HA! HA! and stays swollen through the aria,
  // every word of which is legitimate.
  const wattage =
    interpolate(frame, [haFrom, haFrom + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeOutCubic,
    }) *
    (1 + 0.06 * Math.sin(t * 3.1));

  const rayFace = emotionAt(
    frame,
    [
      { at: 0, emotion: "neutral" as Emotion },
      // Firing 3 of 3, finally at peace: inside a fully true aria there is
      // nothing left to be upset about.
      { at: alsoFrom - 2, emotion: "happy" as Emotion, frames: 12 },
    ],
    "neutral",
  );

  // The camera: one slow push, on her longest line, parked a beat and a half
  // before the first held beat opens. Everything after that is static, which
  // is what the five holds in this scene are for.
  const zoom = interpolate(frame, [pitchFrom, pitchTo - 20], [1.0, 1.13], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam: Cam = { x: 1120, y: 560, zoom };
  const shown: Cast = {
    pip: proj(cam, pip),
    sunny: proj(cam, sunny),
    ray: proj(cam, ray),
    drip: proj(cam, drip),
    puff: proj(cam, puff),
  };

  return (
    <PlateWorld
      plate="meadow_day"
      phase={5.0}
      grade={GOLDEN}
      cam={cam}
      overlay={<Bubbles scene={scene} cast={shown} text={S23_BUBBLES} />}
    >
      <Drip
        x={drip.x}
        y={drip.y}
        scale={DRIP_AT.scale}
        phase={PHASE.drip}
        // See `witness`: neutral for the whole pitch, and one morph on the
        // laugh.
        emotion={witness}
        speaking={false}
        look={{ x: 0.55, y: -0.25 }}
        zIndex={2}
      />
      <Pip
        x={pip.x}
        y={pip.y}
        scale={pip.scale}
        state="leaf"
        lean={lean}
        phase={PHASE.pip}
        emotion={pipFace}
        speaking={stage.speaking("pip")}
        point={point}
        pointSide={aim.pointSide}
        look={{ x: 0.85, y: -0.7 }}
        eyeLife={frame >= ovenFrom && frame < ovenHoldTo ? 0.25 : 1}
        zIndex={3}
      />
      <Puff
        x={puff.x}
        y={puff.y}
        scale={PUFF_AT.scale}
        opacity={PUFF_SEEN}
        phase={PHASE.puff}
        emotion={witness}
        wisps={0.45}
        speaking={false}
        look={{ x: 0.5, y: -0.6 }}
        zIndex={4}
      />
      <Ray
        x={ray.x}
        y={ray.y}
        scale={0.78}
        brightness={RAY_LIGHT}
        spectrum={0.45}
        phase={PHASE.ray}
        emotion={rayFace}
        speaking={stage.speaking("ray")}
        look={{ x: 0.9, y: -0.4 }}
        zIndex={5}
      />
      <Sunny
        x={sunny.x}
        y={sunny.y - wattage * 10}
        scale={SUNNY_AT.scale * (1 + 0.06 * wattage)}
        phase={PHASE.sunny}
        emotion={sunnyFace}
        speaking={stage.speaking("sunny")}
        look={{ x: -0.55, y: 0.6 }}
        raySpeed={raySpeed}
        idle={holdingIn ? 0.35 : 1}
        zIndex={1}
      />
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 24 — Full power, and the Big Word
// ---------------------------------------------------------------------------

const S24_BUBBLES: Record<string, string> = {
  a3_62_sunny: "ONE WHOLE SUN! DELIVERED!",
  a3_63_pip: "More leaves! More pans!",
  a3_71_ray: "Photosynthesis. First try.",
};

const FullPowerScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [, clockTo] = lineWindow(scene, "a3_61_narrator");
  const [deliverFrom] = lineWindow(scene, "a3_62_sunny");
  const [growFrom, growTo] = lineWindow(scene, "a3_63_pip");
  const [wordFrom, wordTo] = lineWindow(scene, "a3_70_narrator");
  const [unclappedFrom] = heldBeat(scene, "a3_72_narrator");

  // DAWN, and the sun comes up like an appliance switching on. The plate is
  // `meadow_dawn` (measured mean 111.5, the cool half-lit ladder rung) and the
  // flood is a whole-group brightness ramp on the frame he clocks in — a plate
  // swap mid-scene would be a cut, and this is a switch being thrown.
  const flood = interpolate(frame, [deliverFrom - 6, deliverFrom + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutCubic,
  });

  // **THE GROWTH SPURT — growth is her only travel, and it is spent here.**
  // She morphs leaf → young across her own line, which is the one thing that
  // has ever changed about her position in fifteen minutes.
  const morph = interpolate(frame, [growFrom + 6, growTo + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const surge = Math.max(0, Math.min(1, (frame - growFrom) / 20)) * (1 - Math.max(0, Math.min(1, (frame - growTo - 40) / 30)));

  const pip = pipMark("young", morph);
  const drip = dripMark();
  const puff = puffMark();
  const ray = rayMark({ x: 372, y: 356, scale: 0.78 });
  // **Lower and a shade smaller than the act's usual Sunny, and the chant card
  // is why** (showrunner ruling, repair pass): the card's THE and SIS blocks sat
  // across his eyes and mouth on the frame SIS lands. He cannot go much
  // lower than this — a floater's box may not cross `MEADOW.horizon`, and at
  // 1.04 swelling to 1.09 his lowest edge is 602 against the horizon's 604 —
  // so the rest of the clearance comes out of the card (see `ChantCard`'s `y`).
  // The dawn "rise" is therefore carried by the swell and the flood rather than
  // by 46px of travel he no longer has room for.
  const sunny = sunnyMark({ x: 1186, y: 300, scale: 1.04 });
  const cast: Cast = { pip, drip, puff, ray, sunny };

  // The row Scene 15 planted, in the background: the growth spurt is sold
  // against it ("a visible growth spurt past the sprout row"), so it has to be
  // in the shot for the sentence to mean anything. Nobody names it, nobody
  // looks at it, and it is measured off the hero rather than in pixels.
  const rowTone = mixHex(PLATES.meadow_dawn.grass, kidTheme.grassDark, 0.34);

  // **THE CHANT — measured onsets, not even fifths.** Each block slams on the
  // frame its own clip's syllable is actually audible, which is that turn's
  // start plus that clip's leading silence.
  const chantAt = CHANT.map((syl) => {
    const [from] = lineWindow(scene, syl.key);
    return from + Math.round(syl.onset * fps);
  });
  // **Mouths shut, faces on.** The Narrator says the syllables (ruling
  // 2026-10-17), so nobody's mouth moves on them — `stage.speaking` reads the
  // narrator keys as no one. What sells "slammed on by its owner" is the
  // owner: a hop and a cheer on the frame their own block lands. Pip does
  // neither — she files hers, flat, and is back in the kitchen roar once the
  // Narrator says the whole word.
  type Owner = (typeof CHANT)[number]["who"];
  const slamOf = (who: Owner): number => chantAt[CHANT.findIndex((syl) => syl.who === who)];
  const cheerHop = (who: Owner): number => {
    const f = frame - slamOf(who);
    return f >= 0 && f <= 14 ? Math.sin((f / 14) * Math.PI) : 0;
  };
  const rayFace = emotionAt(frame, [{ at: slamOf("ray"), emotion: "excited" }], "happy", 6);
  const sunnyFace = emotionAt(frame, [{ at: slamOf("sunny"), emotion: "excited" }], "proud", 6);
  const pipFace = emotionAt(
    frame,
    [
      { at: growFrom, emotion: "excited" },
      { at: slamOf("pip"), emotion: "neutral" },
      { at: wordFrom, emotion: "excited" },
    ],
    "neutral",
    6,
  );

  return (
    <PlateWorld
      plate="meadow_dawn"
      phase={5.8}
      flood={flood}
      overlay={
        <>
          {/* **A wider box and one lowered bubble, and Sunny's mouth is why.**
              Dropping him to clear the chant card put his face where her
              bubble already was: "More leaves! More pans!" at the default
              width landed across his chin. At `maxWidth` 760 it still wraps
              to two lines (measured ~195px tall in `r8_23640.png`, not the
              one line an earlier note here claimed) — the width buys the
              *lift* rather than a shorter box, and the explicit `y: 478` is
              what actually parks it in the corridor between his mouth
              (y≈414) and her own crown (597), clear of both. */}
          <Bubbles
            scene={scene}
            cast={cast}
            text={S24_BUBBLES}
            maxWidth={760}
            at={{ a3_63_pip: { y: 478 } }}
          />
          {/* Gone before Ray's "Photosynthesis. First try." — his bubble
              lands at the card's own height, and the card used to still be
              fading across it. */}
          <ChantCard
            at={chantAt}
            until={wordTo - 8}
            sub="LIGHT + WATER + AIR = FOOD"
            subFrom={wordFrom + 30}
          />
        </>
      }
    >
      {/* The reference is her FINISHED height, not this frame's: the row is
          five plants standing still while the hero grows past them, and a row
          sized off a morphing `pipHeight` would grow with her. */}
      <SproutRow pipHeight={pipHeightPx("young", PIP_SCALE)} tone={rowTone} t={t} />
      <Drip
        x={drip.x}
        y={drip.y - cheerHop("drip") * 26}
        scale={DRIP_AT.scale}
        phase={PHASE.drip}
        emotion="excited"
        speaking={stage.speaking("drip")}
        look={{ x: 0.5, y: -0.3 }}
        idle={1.4}
        zIndex={2}
      />
      <Pip
        x={pip.x}
        y={pip.y}
        scale={pip.scale}
        state="young"
        morph={morph}
        // The kitchen at full roar, on the character it is running inside.
        tremble={surge * 0.5}
        phase={PHASE.pip}
        emotion={pipFace}
        speaking={stage.speaking("pip")}
        point={pointRamp(
          interpolate(frame, [growFrom, growFrom + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: kidEase.easeOutCubic,
          }),
        )}
        look={{ x: 0.7, y: -0.55 }}
        zIndex={3}
      />
      <Puff
        x={puff.x}
        y={puff.y - cheerHop("puff") * 26}
        scale={PUFF_AT.scale}
        opacity={PUFF_SEEN}
        phase={PHASE.puff}
        emotion="excited"
        pose="cheer"
        wisps={0.7}
        speaking={stage.speaking("puff")}
        look={{ x: -0.4, y: -0.3 }}
        zIndex={4}
      />
      <Ray
        x={ray.x}
        y={ray.y - cheerHop("ray") * 22}
        scale={0.78}
        brightness={RAY_LIGHT}
        spectrum={0.6}
        phase={PHASE.ray}
        emotion={rayFace}
        speaking={stage.speaking("ray")}
        // "Ray said it perfectly. Nobody clapped." He is looking at the camera
        // for the whole of the last beat, which is the joke.
        look={frame >= unclappedFrom ? "camera" : { x: 0.5, y: 0.2 }}
        zIndex={5}
      />
      <Sunny
        x={sunny.x}
        // No hop: he has no room to go up toward the card (see `sunnyMark`
        // above), so his cheer on SIS is a swell and a face.
        y={sunny.y}
        scale={1.04 * (1 + 0.05 * flood) * (1 + 0.03 * cheerHop("sunny"))}
        phase={PHASE.sunny}
        emotion={sunnyFace}
        speaking={stage.speaking("sunny")}
        look={{ x: -0.5, y: 0.5 }}
        raySpeed={0.16 + 0.2 * flood}
        zIndex={1}
      />
      {/* The light flooding the field: beams down the frame on the switch-on,
          fading back as the day settles into itself. */}
      <WideLayer zIndex={6}>
        {flood > 0.02
          ? [0, 1, 2, 3].map((i) => (
              <LightBeam
                key={i}
                fromX={2180 - i * 60}
                fromY={-300}
                toX={1280 - i * 330}
                toY={MEADOW.ground + 20}
                power={flood * (0.5 - i * 0.07) * (1 - Math.max(0, Math.min(1, (frame - clockTo - 90) / 120)))}
                t={t + i}
                width={150}
              />
            ))
          : null}
      </WideLayer>
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 25 — Sweetness is stored sunshine
// ---------------------------------------------------------------------------

/** The closer framing on the production line. Scene 26 opens on this number. */
const S25_ZOOM = 1.26;
const S25_CAM = { x: 1080, y: 640 } as const;
/**
 * And so does her pointer. The leaf the sugar crumbs pile onto is held at 10°
 * for the whole of Scene 25 and Scene 26 is the same shot from further back —
 * so the number is shared rather than written twice, which is how it came to
 * be 10 in one scene and absent in the next.
 */
const S25_POINT = 10;

const S25_BUBBLES: Record<string, string> = {
  a3_74_sunny: "Sweetness is me, in a box.",
  a3_77_sunny: "Enjoy your lunch! It is me!",
};

const StoredSunshineScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [sugarFrom] = lineWindow(scene, "a3_73_narrator");
  const [everyFrom] = lineWindow(scene, "a3_76_narrator");

  const cam: Cam = { ...S25_CAM, zoom: S25_ZOOM };
  const pip = pipMark("young");
  const sunny = sunnyMark({ x: 1128, y: 296, scale: 0.98 });
  const cast: Cast = { pip: proj(cam, pip), sunny: proj(cam, sunny) };

  // The hoard: crumbs accumulating on the top leaf, beat by beat, into a
  // little gleaming pile. Eleven of them over the first two lines — the
  // pedagogy is that one beam makes one crumb and a plant does this all day.
  const leaf = { x: PIP_X + 150, y: PIP_Y + CHAR_BOX.pip / 2 - (230 - 84) * PIP_SCALE };
  const HOARD = Array.from({ length: 11 }, (_, i) => ({
    dx: ((i * 37) % 9) * 15 - 60,
    dy: -((i * 53) % 5) * 12 - (i % 3) * 6,
    at: sugarFrom + 14 + i * 15,
  }));

  // Over it, an apple — then a strawberry, then a slice of bread. Each one
  // briefly glowing sun-gold from inside, which is the whole mind-blower drawn
  // instead of asserted.
  const foods = [
    { kind: "apple" as const, x: 470, y: 360, at: everyFrom + 10 },
    { kind: "berry" as const, x: 760, y: 300, at: everyFrom + 62 },
    { kind: "bread" as const, x: 1010, y: 372, at: everyFrom + 116 },
  ];

  return (
    <PlateWorld
      plate="meadow_sunset"
      phase={6.6}
      cam={cam}
      overlay={<Bubbles scene={scene} cast={cast} text={S25_BUBBLES} />}
    >
      <Pip
        x={pip.x}
        y={pip.y}
        scale={pip.scale}
        state="young"
        phase={PHASE.pip}
        emotion="neutral"
        speaking={false}
        // Held, not ramped: she has been holding this leaf out since the
        // growth spurt and Scene 26 opens on the same number, because the two
        // scenes are one continuous sunset seen from two distances.
        point={S25_POINT}
        look={{ x: 0.6, y: 0.3 }}
        zIndex={3}
      />
      <WideLayer zIndex={4}>
        {HOARD.map((c, i) => (
          <SugarCrumb
            key={i}
            x={leaf.x + c.dx}
            y={leaf.y + c.dy}
            pop={Math.max(0, Math.min(1, (frame - c.at) / 7))}
            t={t + i}
            size={9}
          />
        ))}
      </WideLayer>
      <Sunny
        x={sunny.x}
        y={sunny.y}
        scale={0.98}
        phase={PHASE.sunny}
        emotion="proud"
        speaking={stage.speaking("sunny")}
        look={{ x: -0.5, y: 0.5 }}
        zIndex={1}
      />
      {/* The three foods sit OUTSIDE the camera's push in composition space —
          they are a fade-up over the shot, the way the script writes them
          ("over it, an apple fades in"), not objects standing in the field. */}
      <AbsoluteFill style={{ zIndex: 8, pointerEvents: "none" }}>
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
          {foods.map((f) => (
            <StoredFood
              key={f.kind}
              kind={f.kind}
              x={f.x}
              y={f.y}
              scale={0.92}
              u={Math.max(0, Math.min(1, (frame - f.at) / 40))}
            />
          ))}
        </svg>
      </AbsoluteFill>
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 26 — The button
// ---------------------------------------------------------------------------

const S26_BUBBLES: Record<string, string> = {
  a3_79_pip: "It will do.",
};

const ButtonScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);
  const [dayFrom, dayTo] = lineWindow(scene, "a3_78_narrator");
  const [stampFrom] = lineWindow(scene, "a3_79_pip");
  const [stampHoldFrom] = heldBeat(scene, "a3_79_pip");
  const [lastFrom] = heldBeat(scene, "a3_80_narrator");

  // Opens on Scene 25's closing zoom and pulls back across "The build went up
  // all day", parked a long way before the stamp. Nothing moves after that:
  // this scene is two held beats and a pair of full stops.
  const zoom = interpolate(frame, [0, dayTo - 12], [S25_ZOOM, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const camX = interpolate(frame, [0, dayTo - 12], [S25_CAM.x, WIDTH / 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const camY = interpolate(frame, [0, dayTo - 12], [S25_CAM.y, MEADOW.ground - 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam: Cam = { x: camX, y: camY, zoom };

  const pip = pipMark("young");
  const sunny = sunnyMark({ x: 1176, y: 330, scale: 1.12 });
  const cast: Cast = { pip: proj(cam, pip), sunny: proj(cam, sunny) };

  // **THE LEAN, RESOLVED. Permanent.** Her stem is toward him, fully, and she
  // leaves it there. `LEAN_FULL` is the runner's settled value and there is no
  // `snapAt` on this firing, in this scene or ever again.
  const lean = pipLean(frame, [{ at: dayFrom + 40, to: LEAN_FULL, drift: 96 }]);

  // **The episode's last Pip beat, and her face is settled BEFORE the hold
  // starts.** The first pass moved her thirty frames into the 75-frame
  // resolution hold — the joint-longest silence in the episode, and one of the
  // four spine holds. The change now runs across the back half of "It will do."
  // and lands on the frame the line ends; the hold gets a hero who has already
  // arrived, holding still, which is the whole picture.
  const pipFace = emotionAt(
    frame,
    [
      { at: 0, emotion: "neutral" as Emotion },
      { at: stampHoldFrom - 24, emotion: "happy" as Emotion, frames: 24 },
    ],
    "neutral",
  );

  // **Sunny says nothing — his first silent beat in four episodes.** His glow
  // swells about ten percent across the last hold and nothing else moves. It
  // is the thank-you the script refuses to write as a line.
  const swell = interpolate(frame, [lastFrom, lastFrom + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  return (
    <PlateWorld
      plate="meadow_sunset"
      phase={7.4}
      cam={cam}
      plateDrift={5}
      overlay={<Bubbles scene={scene} cast={cast} text={S26_BUBBLES} />}
    >
      {/* "The build is visibly a young plant now — taller than the sprout
          row." The row is what that sentence is measured against, so it is in
          the shot, in the background, unnamed and un-looked-at. */}
      <SproutRow
        pipHeight={pipHeightPx("young", PIP_SCALE)}
        tone={mixHex(PLATES.meadow_sunset.grass, kidTheme.grassDark, 0.3)}
        t={t}
      />
      <Pip
        x={pip.x}
        y={pip.y}
        scale={pip.scale}
        state="young"
        lean={lean}
        phase={PHASE.pip}
        emotion={pipFace}
        speaking={stage.speaking("pip")}
        // The pointer Scene 25 ends on. 25 → 26 is a reframe inside one
        // continuous sunset, so the leaf may not change angle across the cut:
        // passing nothing here dropped it 10° → 0° on the boundary frame.
        point={S25_POINT}
        look={{ x: 0.8, y: -0.55 }}
        eyeLife={frame >= stampFrom ? 0.3 : 1}
        zIndex={3}
      />
      <Sunny
        x={sunny.x}
        y={sunny.y}
        scale={1.12 * (1 + 0.1 * swell)}
        phase={PHASE.sunny}
        emotion="happy"
        smug={false}
        speaking={false}
        look={{ x: -0.6, y: 0.45 }}
        raySpeed={0.09}
        idle={0.6}
        zIndex={1}
      />
      {/* His glow, as light rather than as scale alone. */}
      {swell > 0.01 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 940px 760px at ${sunny.x}px ${sunny.y + 120}px, rgba(255,214,110,${(0.3 * swell).toFixed(3)}) 0%, rgba(255,190,90,${(0.1 * swell).toFixed(3)}) 46%, transparent 74%)`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      ) : null}
    </PlateWorld>
  );
};

// ---------------------------------------------------------------------------

export const ACT3_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s17_air_order: AirOrderScene,
  s18_guest: GuestScene,
  s19_first_breath: FirstBreathScene,
  s20_tree_of_air: TreeOfAirScene,
  s21_crumb: CrumbScene,
  s22_stall: StallScene,
  s23_hire: HireScene,
  s24_full_power: FullPowerScene,
  s25_stored_sunshine: StoredSunshineScene,
  s26_button: ButtonScene,
};
