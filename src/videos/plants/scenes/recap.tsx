import React from "react";
// Two things the episode kit does not re-export, and only a plated scene needs
// them: the plate itself is an `<Img>` (Remotion blocks the frame until it has
// decoded, so a render never emits a frame with a missing background) seated by
// hand off `PLATES`, which is arithmetic `KidPaintedBackdrop`'s `objectFit:
// cover` cannot do — see `plateSeat` below.
import { Img, staticFile } from "remotion";
import { BACKGROUNDS } from "../backgroundManifest";
import {
  AbsoluteFill,
  Bubbles,
  CHANT_SYLLABLES,
  CHAR_BOX,
  Camera,
  CutFlash,
  Drip,
  HEIGHT,
  INGREDIENT,
  KidSilhouette,
  MEADOW,
  MEADOW_Z,
  NO_LEAD,
  PHASE,
  PLATES,
  Pip,
  Puff,
  Ray,
  RAY_LIGHT,
  SleepingVolcano,
  SpeechBubble,
  Sunny,
  VOLCANO_AT,
  WIDTH,
  WideLayer,
  bubbleOver,
  heldBeat,
  hover,
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
  moveAlong,
  pipCrownLocal,
  spring,
  stand,
  useCurrentFrame,
  emotionAt,
  useEmotion,
  useStage,
  useVideoConfig,
  type Cam,
  type Cast,
  type KidPlacement,
  type Mark,
  type TimedScene,
} from "./common";

// RECAP + GOODNIGHT — Scenes 27–29 of script.md, and the end card.
//
//   s27  THE CURTAIN CALL. The recap's lit panels, one per ingredient, each
//        hero taking a bow for theirs — and the LIGHT panel is claimed twice,
//        by the beam who delivers it and by the man who makes it, with nobody
//        adjudicating (the ep-3 recap's shape, and both claimants are right).
//        Then a flash, and the whole cast on one stage under the reprise of
//        the PHOTOSYNTHESIS card, whose syllables light up in owner order.
//        **The one sanctioned plate-less scene besides the cutaways**: this is
//        the drawn recap world, not the meadow.
//   s28  YOUR NEXT BREATH. Golden hour: `meadow_day` under **act three's**
//        comp-level warm grade — the same CSS filter chain scenes 22 and 23 are
//        in, ported here so the three scenes the script treats as one hour are
//        one hour (see `goldenGrade`). The kid is back, standing where the
//        dandelion clock used to be, and **the cold open's circle closes
//        here**: Scene 1 is a child giving a plant a breath, and this is a
//        plant giving one back. The breath is the same staging with the sign
//        flipped — the chest rises instead of emptying.
//   s29  GOODNIGHT. `meadow_dusk`, whose ember band is the brightest thing in
//        the frame by design: the sprout row reads as five sibling silhouettes
//        standing in it — six plants with Pip, and she is the tallest. Roll
//        call, firing two — the goodbye. Then the end card, and the volcano
//        asleep on the horizon it has held since the first wide of Scene 1,
//        promising nothing.
//
// ---------------------------------------------------------------------------
// THE BOUNDARY CHECKLIST (STYLE, "A cut inside a continuous space")
//
//   26→27  NOT a continuous space: Scene 26 is the meadow at sunset, Scene 27
//          is the recap world. Nothing hands off but the cast's faces, which
//          all arrive on their resting emotion.
//   27→28  same: recap world back to the meadow, at a new hour.
//   28→29  **A MOTIVATED TIME CUT, not a continuous space** (showrunner ruling,
//          repair pass). Golden hour to dusk: the sky, the plate, the value of
//          the whole field and the hour itself change across this cut, and the
//          framing changes with them — Pip is 0.68 in 28 and 0.96 in 29,
//          because 28 is a two-shot that has to hold a standing child at arm's
//          length from her and 29 is her own last picture, sized so her crown
//          reaches the only band of that plate anything reads in (the ember).
//          A time cut is allowed to reframe; what it may not do is change the
//          FACTS, so those are what carry across: she is on `MEADOW.pip.x` in
//          both, in the `young` state, with the SAME permanent lean she has
//          carried since Scene 26 (`LEAN_FULL` — the heliotropism runner
//          resolved and was never put back); the volcano and the tree are in
//          their fixed places; the camera is parked at 1× on both sides; and
//          the sprout row standing in 29 is the row that is already standing in
//          28, on Scene 15's own marks. Paired stills: 27282 / 27283.
//   inside 27  one flash-cut, `CutFlash` — the series' sanctioned in-scene hard
//          cut. It lands on the frame Sunny stops braying and buys the whole
//          re-staging in eight frames.
//
// Paired stills for every one of these are in `scratchpad/ep4b3_recap/`.
// ---------------------------------------------------------------------------

type PlateKey = keyof typeof PLATES;

/**
 * **The plate, seated** — the B3 mechanism, and the only arithmetic in this
 * file that is load-bearing rather than taste.
 *
 * `PLATES[key].skyline` is the measured sky→land row as a fraction of plate
 * height. Draw the plate at `scale` (its width ÷ 1344) with its top cropped so
 * that row lands on `MEADOW.horizon`, and the SVG volcano at `VOLCANO_AT`
 * stands ON the painted horizon rather than floating over it or sunk into it.
 * Horizontal crop is centred and is safe on every plate (backgrounds.mjs has
 * the per-plate numbers).
 *
 * `KidPaintedBackdrop` cannot do this: it covers the frame with `objectFit:
 * cover`, which decides the crop from the aspect ratio and puts the horizon
 * wherever it lands.
 */
function plateSeat(key: PlateKey): {
  left: number;
  top: number;
  width: number;
  height: number;
  /** The seat row in composition px — `MEADOW.horizon` for a plate with one. */
  seatY: number;
} {
  const { skyline, scale } = PLATES[key];
  const width = 1344 * scale;
  const height = 768 * scale;
  const left = (WIDTH - width) / 2;
  const top = skyline === null ? (HEIGHT - height) / 2 : MEADOW.horizon - skyline * height;
  return { left, top, width, height, seatY: skyline === null ? HEIGHT / 2 : MEADOW.horizon };
}

/**
 * The plate on screen, seated, with the smallest legal amount of life in it.
 *
 * STYLE: "a painted plate is never dead still" — but the usual fix (a few px of
 * translation drift) would carry the painted horizon off `MEADOW.horizon` and
 * the volcano would slowly stop standing on it. So the breath here is **scale
 * only, about the seat point**: the sky and the grass edges move a hair, the
 * skyline row does not move at all, and the volcano rule survives it.
 */
const SeatedPlate: React.FC<{ plate: PlateKey; phase?: number }> = ({
  plate,
  phase = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seat = plateSeat(plate);
  const breathe = 1 + 0.004 * Math.sin((frame / fps) * 0.24 + phase);
  return (
    <div
      style={{
        position: "absolute",
        left: seat.left,
        top: seat.top,
        width: seat.width,
        height: seat.height,
        transform: `scale(${breathe.toFixed(5)})`,
        transformOrigin: `${(WIDTH / 2 - seat.left).toFixed(1)}px ${(seat.seatY - seat.top).toFixed(1)}px`,
      }}
    >
      <Img
        src={staticFile(BACKGROUNDS[plate])}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
};

/**
 * The drawn near field, on top of the plate's bottom band.
 *
 * Two jobs. It hides the plates' painted grass fringe (`meadow_day` ends in
 * crisp painted blades that fight a flat-filled character standing in them),
 * and it gives the lower third the low-detail band STYLE asks every frame to
 * owe its cast. It is `MeadowWorld`'s crest, tinted from `PLATES[key].grass` —
 * the ep-2 `PAINTED_GREEN` precedent — so the seam does not read.
 */
const NearField: React.FC<{ plate: PlateKey; shade?: number }> = ({ plate, shade = 0.22 }) => {
  const near = mixHex(PLATES[plate].grass, kidTheme.ink, shade);
  const lip = mixHex(near, kidTheme.paper, 0.2);
  const ground = MEADOW.ground;
  const crest =
    `M -1400 ${ground - 46}` +
    ` Q ${WIDTH * 0.28} ${ground - 92} ${WIDTH * 0.62} ${ground - 54}` +
    ` Q ${WIDTH * 0.9} ${ground - 26} 3320 ${ground - 62}`;
  return (
    <WideLayer zIndex={MEADOW_Z.ground}>
      <defs>
        {/* **A ramp rather than a swatch**, act three's `NearCrest` recipe
            ported here. A flat fill butted against the plate draws a ruled
            horizontal line across the whole frame where the painted blades
            stop — it was visible across the lower third of every Scene-28
            still. Fading it in over ~180px keeps the low-detail band the cast
            is read against and lets the painting die into it. */}
        <linearGradient
          id="rc-crest"
          x1="0"
          y1={ground - 92}
          x2="0"
          y2={ground + 90}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={near} stopOpacity={0} />
          <stop offset="0.55" stopColor={near} stopOpacity={0.72} />
          <stop offset="1" stopColor={near} stopOpacity={0.94} />
        </linearGradient>
      </defs>
      <path d={`${crest} L 3320 2680 L -1400 2680 Z`} fill="url(#rc-crest)" />
      {/* One pale lip along the crest, so the near field has a top edge and
          does not read as a swatch laid over the painting. */}
      <path d={crest} stroke={lip} strokeWidth={6} fill="none" opacity={0.3} />
    </WideLayer>
  );
};

/**
 * The big old tree at the field's edge, in its fixed place.
 *
 * **A duplicate of `MeadowWorld`'s `OldTree`, and flagged as one.** That
 * component is private to `common.tsx`, this act may not edit `common.tsx`, and
 * the tree cannot be dropped: the delivered plates paint no tree (the design
 * asked for one and five rolls did not produce it), Scene 20 is about this
 * tree, and `rc_18_narrator` names it in Scene 28. Same geometry, same place,
 * same sway clock — the retro item is "promote `OldTree` out of `MeadowWorld`".
 */
const FieldTree: React.FC<{ base: number; t: number; canopy: string; trunk: string }> = ({
  base,
  t,
  canopy,
  trunk,
}) => {
  const sway = Math.sin(t * 0.42) * 1.5;
  return (
    <WideLayer>
      <g transform={`translate(${MEADOW.tree.x} ${base})`}>
        <ellipse cx={0} cy={4} rx={128} ry={16} fill={kidTheme.ink} opacity={0.14} />
        <path
          d="M -26 0 Q -18 -108 -34 -196 L 34 -196 Q 18 -108 26 0 Z"
          fill={trunk}
          stroke={kidTheme.ink}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <g transform={`rotate(${sway.toFixed(2)} 0 -170)`}>
          <ellipse cx={-76} cy={-232} rx={104} ry={78} fill={canopy} stroke={kidTheme.ink} strokeWidth={7} />
          <ellipse cx={82} cy={-248} rx={96} ry={72} fill={canopy} stroke={kidTheme.ink} strokeWidth={7} />
          <ellipse cx={0} cy={-306} rx={118} ry={86} fill={canopy} stroke={kidTheme.ink} strokeWidth={7} />
          <ellipse cx={-8} cy={-336} rx={72} ry={40} fill={mixHex(canopy, kidTheme.paper, 0.22)} opacity={0.75} />
        </g>
      </g>
    </WideLayer>
  );
};

/**
 * A plated wide: the painted plate, the drawn near field, the volcano and the
 * tree standing on the measured horizon, and the cast in front of all of it.
 *
 * `MeadowWorld` cannot be used for a plated scene — its root is a `KidBackdrop`
 * that paints an opaque sky, and its far-field band would paint over the plate's
 * own horizon. What it does that this has to keep is the **z discipline**:
 * nothing is `auto`, every band goes through `MEADOW_Z`, and `overlay` is
 * rendered *outside* the camera so a bubble is never zoomed and never behind
 * anybody.
 *
 * **The camera contains the plate.** In `MeadowWorld` the sky is outside it,
 * because a scaled gradient leaves bands of nothing at the sides in a pull-out.
 * A plate with a horizon painted in it is different: leave it outside and a
 * push-in slides the volcano off the painted skyline. So the plate rides with
 * the world, and every camera in this act therefore stays at or above 1×.
 */
const PlatedWide: React.FC<{
  plate: PlateKey;
  phase?: number;
  cam?: Cam;
  /** Drawn near field on/off (a shot with no ground in it). */
  crest?: boolean;
  crestShade?: number;
  /** Warm rim on the volcano, for a dark plate (see `SleepingVolcano`). */
  rim?: number;
  canopy?: string;
  trunk?: string;
  /**
   * A wash on the plate's own sky, UNDER everything drawn — the hour's colour
   * where the hour actually is. It has to be under the cast: painted over them
   * (which the first pass did) it is atmospheric haze, and a still had it
   * bleaching the child's silhouette and the tree's trunk.
   */
  sky?: React.ReactNode;
  /**
   * **The comp-level colour grade, as a CSS `filter` on the whole camera
   * group** — plate, near field, volcano, tree, child and hero together.
   * Scene 28 passes act three's `goldenGrade`; see its note.
   */
  filter?: string;
  /**
   * A light layer INSIDE the graded group and above the camera — light between
   * the viewer and the field rather than a thing standing in it, and graded
   * along with everything else. Act three's `SunWash` is exactly this, and
   * leaving it out is what made Scene 28's port of the grade only half a port.
   */
  wash?: React.ReactNode;
  /** A light layer above the graded group (a bloom), below the bubbles. */
  grade?: React.ReactNode;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({
  plate,
  phase = 0,
  cam,
  crest = true,
  crestShade = 0.22,
  rim = 0,
  canopy = kidTheme.grassDark,
  trunk = kidTheme.earth,
  sky,
  filter,
  wash,
  grade,
  overlay,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + phase;
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: PLATES[plate].grass,
        fontFamily: kidTheme.fontFamily,
        color: kidTheme.ink,
        // Pinned for the same reason `KidBackdrop` pins it: @remotion/player
        // does not reset inherited typography (docs/STYLE.md).
        lineHeight: "normal",
      }}
    >
      <AbsoluteFill style={filter ? { filter } : undefined}>
        <Camera cam={cam ?? { x: WIDTH / 2, y: HEIGHT / 2 }}>
          <SeatedPlate plate={plate} phase={phase} />
          {sky}
          {crest ? <NearField plate={plate} shade={crestShade} /> : null}
          {/* On the measured horizon, from this scene's first frame — the
              volcano rule, fifth episode running. Asleep, and it stays asleep:
              no `stir` is passed anywhere in this file. */}
          <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.scenery }}>
            <SleepingVolcano
              x={VOLCANO_AT.x}
              base={MEADOW.horizon}
              scale={VOLCANO_AT.scale}
              phase={phase}
              rim={rim}
            />
            <FieldTree base={MEADOW.horizon + 22} t={t} canopy={canopy} trunk={trunk} />
          </div>
          <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.cast }}>
            {children}
          </div>
        </Camera>
        {wash}
      </AbsoluteFill>
      {/* **Anything left here is NOT wrapped**, and that is load-bearing rather
          than tidiness. A wrapper with a `zIndex` is `position: absolute` with a
          z-index, which creates a stacking context — and `mix-blend-mode`
          blends an element with the backdrop of its PARENT stacking context,
          so a blend layer inside a wrapper blends against nothing and comes out
          as a flat veil over the picture (measured: 175.5 against a target of
          140, and it looked like a fog machine). Each layer carries its own
          `zIndex` and sits directly in this tree. */}
      {grade}
      {overlay ? (
        <AbsoluteFill style={{ zIndex: MEADOW_Z.overlay, pointerEvents: "none" }}>
          {overlay}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 27 — The curtain call
// ===========================================================================
//
// Two shots, one flash between them.
//
// **The bows.** Three panels, one per ingredient, dressed from `INGREDIENT` —
// the same table the order board in Scene 6 posts and the inventory in Scene 17
// ticks off, so the three places that have to agree are one table. A panel
// lights as its owner takes their bow and stays lit, so by the flash all three
// are up, which is the sentence "light, water and air" drawn.
//
// The LIGHT panel is claimed twice and **nobody adjudicates** (the ep-3 recap's
// rule, and the whole shape of this episode): Ray files the correction —
// "Light. Also me. Mostly him." — and on the word *him* the man himself shoves
// into the cell and takes the lot. Both of them are right. Ray does not concede
// an inch, does not look away, and is still in his own panel at the flash.
//
// **The reprise.** The word is not taught here — Scene 24 taught it — so there
// is no slam and no `BigWordBeat`: five dim syllable blocks rise into place and
// each **lights up as its owner says it**, in owner order, which is script.md's
// direction verbatim. `BigWordBeat` structurally cannot do it anyway: it hangs
// its blocks off ONE chant clip, and the reprise is five separate one-syllable
// aliases with their own turns.

const PANEL_W = WIDTH / 3;

type Bow = {
  who: "drip" | "puff" | "ray";
  line: string;
  word: string;
  color: string;
};

/**
 * The three panels, left to right in **bow order** — which is the order the
 * script fires them in, and the only order in which the lights come up across
 * the frame instead of jumping about it.
 *
 * (`INGREDIENT` lists light first, because the order board does. The colours
 * are that table's; the seating is this scene's. Flagged in the report.)
 */
const BOWS: Bow[] = [
  { who: "drip", line: "rc_02_drip", word: "WATER", color: INGREDIENT.water },
  { who: "puff", line: "rc_03_puff", word: "AIR", color: INGREDIENT.air },
  { who: "ray", line: "rc_04_ray", word: "LIGHT", color: INGREDIENT.light },
];

/** Panel-local marks. A `ChantPanel` is a positioned box; its children are in it. */
const P_DRIP = { x: 320, y: stand("drip", 900), scale: 1.45 };
const P_PUFF = { x: 320, y: hover("puff", 620, 1.45), scale: 1.45 };
const P_RAY = { x: 250, y: hover("ray", 560, 1.05), scale: 1.05 };
// Frame right is the panel's outer wall AND the frame's edge: at 0.92 he was
// 40px wider than the frame and lost a ray to it.
const P_SUNNY = { x: 440, y: hover("sunny", 545, 0.86), scale: 0.86 };

/** How far Sunny's arrival shunts Ray across, and how fast he comes in. */
const S27_SHUNT = 40;
const S27_SHOVE_PX = 380;
const S27_SHOVE_FRAMES = 8;

/**
 * The five syllables, in owner order — the card, and the cast list. Since the
 * 2026-10-17 ruling the Narrator says them (`rc_07..rc_11_narrator`, aliases
 * of Scene 24's clips); `who` is the block's OWNER, who hops and is never
 * mouthing it.
 */
const CHANT = CHANT_SYLLABLES.map((syl) => ({ syllable: syl.text, line: syl.reprise, who: syl.who, onset: syl.onset, out: syl.out }));
type ChantOwner = (typeof CHANT)[number]["who"];

/**
 * `[start, end)` of the syllable actually being heard inside its clip — the
 * measured speech in/out, not the turn window. The kokoro clips are padded
 * and laid out overlapping (negative `gaps`), so a turn window is mostly
 * silence and runs into the next syllable's.
 */
function sayWindow(scene: TimedScene, block: (typeof CHANT)[number], fps: number): [number, number] {
  const [from] = lineWindow(scene, block.line);
  return [from + Math.round(block.onset * fps), from + Math.round(block.out * fps)];
}

/**
 * The line-up, after the flash.
 *
 * Pip is on stage for the first time in the recap and she arrives with the new
 * shot rather than walking on, because she cannot walk on — she is a plant, and
 * this is the one place in the episode she is not standing on her own dirt.
 * That is the recap world's licence (ep 3 puts Sunny half-sunk in a sea and Ray
 * in a garden); it is flagged in the report rather than smuggled.
 */
const LINEUP = {
  drip: { x: 300, y: stand("drip", 946), scale: 1.05 },
  puff: { x: 668, y: hover("puff", 664, 1.05), scale: 1.05 },
  ray: { x: 1002, y: hover("ray", 648, 0.95), scale: 0.95 },
  pip: { x: 1310, y: stand("pip", 946), scale: 0.86 },
  sunny: { x: 1652, y: hover("sunny", 590, 0.92), scale: 0.92 },
} as const;

const S27_BUBBLES: Record<string, string> = {
  // Clip: "Water! That was me! I took the uphill waterslide!" Six words is the
  // house ceiling and a bubble is a summary, not a transcript.
  rc_02_drip: "Water! That was me!",
  // Clip: "Air! That was me! I traded my fizzy bit! I am in the tree right
  // now!" — the trim keeps the half his own line does not repeat from Drip's.
  rc_03_puff: "Air! I am in the tree!",
  // Clip: "Three deliveries. One kitchen. No dirt was eaten." A DELIBERATE
  // trim to the punch clause (the ep-3 recap's law): the last four words are
  // the cold open's riddle formally closed, and they are the ones a
  // six-year-old should be reading while she says them.
  rc_13_pip: "No dirt was eaten.",
};

/** The LIGHT cell's two claimants, placed by hand — see `PanelBubble`. */
const S27_PANEL_BUBBLES = {
  // Six words in the clip and six on screen: there is no shorter version of his
  // whole episode than his whole episode.
  rc_04_ray: "Light. Also me. Mostly him.",
  rc_05_sunny: "LIGHT! MINE! ALL OF IT!",
  rc_06_sunny: "You're welcome! HA! HA!",
} as const;

const CurtainCallScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage(scene);

  const windows = {
    drip: lineWindow(scene, "rc_02_drip"),
    puff: lineWindow(scene, "rc_03_puff"),
    ray: lineWindow(scene, "rc_04_ray"),
  };
  const [rayFrom, rayTo] = windows.ray;
  const [, braggedTo] = lineWindow(scene, "rc_06_sunny");
  const [summaryFrom, summaryTo] = lineWindow(scene, "rc_12_narrator");

  // **THE FLASH.** Two frames after Sunny stops braying, and it buys the whole
  // re-staging: three panels become one stage, and a hero who was in none of
  // them is standing on it. A cut, not a pop-in — `CutFlash` is the series'
  // sanctioned way of saying so inside a scene.
  const cut = braggedTo + 2;
  const inPanels = frame < cut;

  // --- Sunny shoving into the LIGHT panel ----------------------------------
  // He arrives on the word "him", which is 84% of the way through Ray's line —
  // the correction is still being filed when the thing it credits turns up.
  const shoveAt = rayFrom + Math.round((rayTo - rayFrom) * 0.84);
  const shove = kidEase.easeOutQuad((frame - shoveAt) / S27_SHOVE_FRAMES);
  const shunt = S27_SHUNT * kidEase.easeOutQuad((frame - shoveAt) / 12);

  // --- the reprise ---------------------------------------------------------
  // Blocks rise into place across the flash, dim, and light one at a time.
  const blocksFrom = cut + 2;

  // Drip and Puff settle to `happy` on their own block. That used to be keyed
  // on their syllable clips; the Narrator says those now, so it is keyed on
  // the block's measured onset instead (`useEmotion` only follows a body's
  // own lines). Both hooks always run — the frame only picks which one shows.
  const slamOf = (who: ChantOwner): number => sayWindow(scene, CHANT.find((b) => b.who === who)!, fps)[0];
  const dripBow = useEmotion(scene, "drip", { rc_02_drip: "excited" }, "happy");
  const puffBow = useEmotion(scene, "puff", { rc_03_puff: "proud" }, "happy");
  const dripEmotion =
    frame >= slamOf("drip") ? emotionAt(frame, [{ at: slamOf("drip"), emotion: "happy" }], "excited") : dripBow;
  const puffEmotion =
    frame >= slamOf("puff") ? emotionAt(frame, [{ at: slamOf("puff"), emotion: "happy" }], "proud") : puffBow;
  // The deadpan bow, and he keeps the face after Sunny takes the panel off him:
  // he is not upset, he is *correct*, and being correct is what upsets him.
  const rayEmotion = useEmotion(scene, "ray", { rc_04_ray: "skeptical" }, "happy");
  const sunnyEmotion = useEmotion(scene, "sunny", { rc_05_sunny: "excited", rc_06_sunny: "proud" }, "proud");
  const pipEmotion = useEmotion(scene, "pip", { rc_13_pip: "skeptical" }, "happy");

  // Each owner pops a little as their own syllable lights. It is the only thing
  // joining a centred row of blocks to five bodies who are not under them.
  // Keyed on the syllable as heard (`sayWindow`), not the padded clip.
  const hopOf = (who: ChantOwner): number => {
    const [from, to] = sayWindow(scene, CHANT.find((b) => b.who === who)!, fps);
    const u = (frame - from) / Math.max(1, to - from);
    return u >= 0 && u <= 1.2 ? Math.sin(Math.min(1, u) * Math.PI) : 0;
  };

  // Bubble marks. The panel bubbles are placed by hand inside their own cell
  // (a bubble spanning two cells breaks the split screen); the line-up's read
  // off the mark, like everywhere else in the episode.
  const pipMark: Mark = {
    x: LINEUP.pip.x,
    y: LINEUP.pip.y,
    scale: LINEUP.pip.scale,
    who: "pip",
    state: "young",
    side: "left",
  };
  const bubbleCast = {
    drip: { x: PANEL_W * 0.5, y: 400, who: "drip" },
    puff: { x: PANEL_W * 1.5, y: 400, who: "puff" },
    ray: { x: PANEL_W * 2 + P_RAY.x, y: 400, who: "ray" },
    sunny: { x: PANEL_W * 2 + P_SUNNY.x, y: 400, who: "sunny" },
    pip: pipMark,
  } as Cast;

  return (
    <AbsoluteFill
      style={{
        background: kidTheme.ink,
        fontFamily: kidTheme.fontFamily,
        lineHeight: "normal",
        overflow: "hidden",
      }}
    >
      {inPanels ? (
        <>
          {BOWS.map((bow, i) => {
            const [from] = windows[bow.who];
            const live = frame >= from - 8;
            return (
              <ChantPanel key={bow.who} bow={bow} index={i} live={live} slam={from - 4}>
                {bow.who === "drip" ? (
                  <Drip
                    x={P_DRIP.x}
                    y={P_DRIP.y}
                    scale={P_DRIP.scale}
                    phase={PHASE.drip}
                    emotion={dripEmotion}
                    speaking={stage.speaking("drip")}
                    pose={live ? "cheer" : "rest"}
                    look="camera"
                    zIndex={20}
                  />
                ) : null}
                {bow.who === "puff" ? (
                  <Puff
                    x={P_PUFF.x}
                    y={P_PUFF.y}
                    scale={P_PUFF.scale}
                    opacity={0.72}
                    phase={PHASE.puff}
                    emotion={puffEmotion}
                    speaking={stage.speaking("puff")}
                    pose={live ? "cheer" : "rest"}
                    wisps={2}
                    look="camera"
                    zIndex={20}
                  />
                ) : null}
                {bow.who === "ray" ? (
                  <>
                    <Ray
                      // Shunted, and he **stays** shunted: he is shoved over far
                      // enough for two of them to stand in one cell, which is
                      // the difference between sharing a word and conceding it.
                      x={P_RAY.x - Math.max(0, shunt)}
                      y={P_RAY.y}
                      scale={P_RAY.scale}
                      brightness={RAY_LIGHT}
                      // STYLE, the Ray rules: his warm-white edge vanishes on
                      // gold, and this panel is the one gold field in the
                      // episode he is asked to stand in front of.
                      edge={kidTheme.ink}
                      phase={PHASE.ray}
                      emotion={rayEmotion}
                      speaking={stage.speaking("ray")}
                      // At the camera for the bow, then at the man he has just
                      // credited — who is now standing in his panel.
                      look={frame >= shoveAt ? { x: 0.8, y: -0.15 } : "camera"}
                      streak={0.15}
                      zIndex={22}
                    />
                    {frame >= shoveAt - 2 ? (
                      <Sunny
                        x={P_SUNNY.x + (1 - Math.min(1, Math.max(0, shove))) * S27_SHOVE_PX}
                        y={P_SUNNY.y}
                        scale={P_SUNNY.scale}
                        phase={PHASE.sunny}
                        emotion={sunnyEmotion}
                        speaking={stage.speaking("sunny")}
                        look="camera"
                        raySpeed={0.3}
                        zIndex={20}
                      />
                    ) : null}
                  </>
                ) : null}
              </ChantPanel>
            );
          })}
          {/* Grid lines, so three pictures read as one split screen. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              boxShadow: `inset 0 0 0 10px ${kidTheme.ink}`,
              zIndex: 30,
            }}
          />
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: PANEL_W * i - 5,
                top: 0,
                width: 10,
                height: HEIGHT,
                background: kidTheme.ink,
                zIndex: 30,
              }}
            />
          ))}
        </>
      ) : (
        <>
          <CurtainStage />
          <Drip
            x={LINEUP.drip.x}
            y={LINEUP.drip.y - hopOf("drip") * 26}
            scale={LINEUP.drip.scale}
            phase={PHASE.drip}
            emotion={dripEmotion}
            speaking={stage.speaking("drip")}
            look="camera"
            zIndex={20}
          />
          <Puff
            x={LINEUP.puff.x}
            y={LINEUP.puff.y - hopOf("puff") * 26}
            scale={LINEUP.puff.scale}
            opacity={0.72}
            phase={PHASE.puff}
            emotion={puffEmotion}
            speaking={stage.speaking("puff")}
            wisps={2}
            look="camera"
            zIndex={20}
          />
          <Ray
            x={LINEUP.ray.x}
            y={LINEUP.ray.y - hopOf("ray") * 26}
            scale={LINEUP.ray.scale}
            brightness={RAY_LIGHT}
            phase={PHASE.ray}
            emotion={rayEmotion}
            speaking={stage.speaking("ray")}
            look="camera"
            streak={0.15}
            zIndex={20}
          />
          <Pip
            x={LINEUP.pip.x}
            y={LINEUP.pip.y - hopOf("pip") * 18}
            scale={LINEUP.pip.scale}
            state="young"
            // The runner, resolved. Scene 26 let the lean stay — "fully, and she
            // leaves it there. Permanent." — so she carries it into the recap
            // and into the goodnight, and it happens to point at Sunny.
            lean={LEAN_FULL}
            phase={PHASE.pip}
            emotion={pipEmotion}
            speaking={stage.speaking("pip")}
            look="camera"
            zIndex={20}
          />
          <Sunny
            x={LINEUP.sunny.x}
            y={LINEUP.sunny.y - hopOf("sunny") * 26}
            scale={LINEUP.sunny.scale}
            phase={PHASE.sunny}
            emotion={sunnyEmotion}
            speaking={stage.speaking("sunny")}
            look="camera"
            raySpeed={0.24}
            zIndex={20}
          />
        </>
      )}

      <CutFlash at={cut - 2} strength={0.85} />

      {/* THE REPRISE, over everything and under the bubbles. The blocks leave
          before Pip's button so her last line owns the frame. */}
      <SyllableReprise
        scene={scene}
        from={blocksFrom}
        // Up while the word is being assembled and through the Narrator's
        // one-sentence version of the whole episode; gone before the button.
        until={summaryTo + 10}
        summaryFrom={summaryFrom}
      />

      <AbsoluteFill style={{ zIndex: MEADOW_Z.overlay, pointerEvents: "none" }}>
        <Bubbles
          scene={scene}
          cast={bubbleCast}
          text={S27_BUBBLES}
          maxWidth={520}
          at={{
            // Each panel bubble sits **inside its own cell**: a bubble clipped
            // by a panel wall is unreadable and one spanning two cells breaks
            // the split screen. `Bubbles` clamps x to [400, 1520], which is
            // why the third cell's two are placed at the clamp and aim their
            // tails back across at their speakers.
            rc_02_drip: { x: 348, y: 240, tail: "left", tailAt: PANEL_W * 0.5 },
            rc_03_puff: { x: 960, y: 210, tail: "left", tailAt: PANEL_W * 1.5 },
            rc_13_pip: { x: 1076, y: bubbleOver(pipMark), tail: "right", tailAt: LINEUP.pip.x },
          }}
        />
        {/* **The third cell's two bubbles are raw `SpeechBubble`s**, and that
            is the cell's geometry rather than a preference: `Bubbles` clamps a
            bubble's centre to x ≤ 1520, and the LIGHT panel runs 1280–1920, so
            every bubble it places for Ray or Sunny straddles the wall into
            Puff's cell — which is the one thing a split screen may not do. At
            1600 with `maxWidth` 460 they sit entirely inside their own panel,
            with the tail reaching back at whichever of the two is talking. */}
        <PanelBubble
          text={S27_PANEL_BUBBLES.rc_04_ray}
          x={1596}
          y={214}
          tail="left"
          tailAt={PANEL_W * 2 + P_RAY.x}
          window={windows.ray}
        />
        <PanelBubble
          text={S27_PANEL_BUBBLES.rc_05_sunny}
          x={1600}
          y={190}
          tail="right"
          tailAt={PANEL_W * 2 + P_SUNNY.x}
          window={lineWindow(scene, "rc_05_sunny")}
        />
        <PanelBubble
          text={S27_PANEL_BUBBLES.rc_06_sunny}
          x={1600}
          y={190}
          tail="right"
          tailAt={PANEL_W * 2 + P_SUNNY.x}
          window={lineWindow(scene, "rc_06_sunny")}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * A bubble that belongs to one panel: placed by hand, windowed by its turn —
 * **and given room to be as wide as it asked for.**
 *
 * `SpeechBubble` is a shrink-to-fit box at `position: absolute; left: x`, so
 * the width it is *allowed* is its containing block minus its own `left`: at
 * x=1600 a `maxWidth` of 520 silently becomes 320, and "Light. Also me. Mostly
 * him." came out as five stacked lines with the tail buried in Ray's face.
 * Episode three hit this and paid for it by shrinking the type (`S32_BUBBLES`,
 * "his therefore gets its own element, at its own size").
 *
 * The cheaper fix is a containing block that starts far enough left: this
 * wrapper is 2·`room` wide and the bubble sits at its centre, so the available
 * width is `room` wherever in the frame the bubble is. **Retro item**: this
 * belongs in `SpeechBubble` itself.
 */
const PanelBubble: React.FC<{
  text: string;
  x: number;
  y: number;
  tail: "left" | "right";
  tailAt: number;
  window: [number, number];
}> = ({ text, x, y, tail, tailAt, window: [from, until] }) => {
  const room = 700;
  return (
    <div
      style={{
        position: "absolute",
        left: x - room,
        top: 0,
        width: room * 2,
        height: HEIGHT,
        pointerEvents: "none",
      }}
    >
      <SpeechBubble
        x={room}
        y={y}
        text={text}
        tail={tail}
        tailAt={tailAt - (x - room)}
        from={from}
        until={until}
        maxWidth={520}
        zIndex={44}
      />
    </div>
  );
};

/**
 * One lit panel: the ingredient's own weather behind its owner, a coloured
 * border, and the word on a banner at the bottom.
 *
 * Dim until its owner takes the bow, then lit for the rest of the shot —
 * so by the flash all three are up at once, which is the recap in one frame.
 */
const ChantPanel: React.FC<{
  bow: Bow;
  index: number;
  live: boolean;
  slam: number;
  children?: React.ReactNode;
}> = ({ bow, index, live, slam, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordIn = spring({ frame: frame - slam, fps, config: { damping: 11, mass: 0.7 } });
  return (
    <div
      style={{
        position: "absolute",
        left: index * PANEL_W,
        top: 0,
        width: PANEL_W,
        height: HEIGHT,
        overflow: "hidden",
        background: `linear-gradient(180deg, ${mixHex(bow.color, kidTheme.paper, 0.52)} 0%, ${bow.color} 64%, ${mixHex(bow.color, kidTheme.ink, 0.26)} 100%)`,
      }}
    >
      <PanelWeather word={bow.word} color={bow.color} />
      {children}
      {/* The dim veil. Drawn after the cast, with no z-index of its own, so the
          bodies sit above it and below nothing. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          // Near-black and deep rather than a blue-grey haze: any veil over the
          // LIGHT panel's gold mixes towards olive, and a dirty olive reads as
          // a mistake where a dark one reads as "not lit yet".
          background: `rgba(10,14,22,${live ? 0 : 0.74})`,
          pointerEvents: "none",
          transition: "none",
        }}
      />
      {live ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: `inset 0 0 0 12px ${bow.color}`,
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
            bottom: 52,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              // A shade darker than the panel it is standing on: the LIGHT
              // banner is gold on gold otherwise, and disappears.
              background: mixHex(bow.color, kidTheme.ink, 0.2),
              border: `9px solid ${kidTheme.ink}`,
              borderRadius: kidRadius.banner,
              padding: "8px 30px",
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: -1,
              color: kidTheme.paper,
              textShadow: kidInkOutline(2),
              whiteSpace: "nowrap",
              boxShadow: kidShadow(1.1),
              transform: `scale(${0.5 + 0.5 * wordIn}) rotate(${-1.5 + (1 - wordIn) * 6}deg)`,
            }}
          >
            {bow.word}
          </div>
        </div>
      ) : null}
    </div>
  );
};

/**
 * What each ingredient looks like when it is a place rather than a character:
 * rain falling, air drifting, light coming down. Panel-local, slow, cheap, and
 * deliberately behind everything — it is the wallpaper of a bow, not a set.
 */
const PanelWeather: React.FC<{ word: string; color: string }> = ({ word, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pale = mixHex(color, kidTheme.paper, 0.55);
  return (
    <svg
      width={PANEL_W}
      height={HEIGHT}
      viewBox={`0 0 ${PANEL_W} ${HEIGHT}`}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    >
      {word === "WATER"
        ? Array.from({ length: 9 }, (_, i) => {
            const x = 40 + ((i * 137) % 560);
            const y = ((t * 108 + i * 128) % 1240) - 120;
            return (
              <path
                key={i}
                d={`M ${x} ${y.toFixed(1)} l 0 62`}
                stroke={pale}
                strokeWidth={9}
                strokeLinecap="round"
                opacity={0.5}
              />
            );
          })
        : null}
      {word === "AIR"
        ? Array.from({ length: 5 }, (_, i) => {
            const y = 160 + i * 170 + Math.sin(t * 0.5 + i) * 14;
            const x = ((t * 46 + i * 190) % 900) - 180;
            return (
              <path
                key={i}
                d={`M ${x.toFixed(1)} ${y.toFixed(1)} q 90 -34 176 0 q 78 30 148 -8`}
                stroke={pale}
                strokeWidth={9}
                strokeLinecap="round"
                fill="none"
                opacity={0.42}
              />
            );
          })
        : null}
      {word === "LIGHT"
        ? Array.from({ length: 7 }, (_, i) => {
            const a = -62 + i * 20 + Math.sin(t * 0.3 + i) * 1.6;
            const r = (a * Math.PI) / 180;
            return (
              <path
                key={i}
                d={`M 320 -60 L ${(320 + Math.sin(r) * 1500).toFixed(1)} ${(-60 + Math.cos(r) * 1500).toFixed(1)}`}
                stroke={pale}
                strokeWidth={44}
                strokeLinecap="round"
                opacity={0.22}
              />
            );
          })
        : null}
    </svg>
  );
};

/**
 * The curtain-call stage: the three panel colours, walls down, as one lit
 * field with a dark floor under it.
 *
 * It is the same three lights the bows were taken in — the split screen opened
 * out rather than replaced — which is what stops the flash from reading as a
 * different scene.
 */
const CurtainStage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <>
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(ellipse 44% 62% at 13% 52%, ${mixHex(INGREDIENT.water, kidTheme.paper, 0.24)} 0%, rgba(0,0,0,0) 70%),` +
            `radial-gradient(ellipse 44% 60% at 40% 46%, ${mixHex(INGREDIENT.air, kidTheme.paper, 0.3)} 0%, rgba(0,0,0,0) 70%),` +
            `radial-gradient(ellipse 52% 70% at 86% 50%, ${mixHex(INGREDIENT.light, kidTheme.paper, 0.2)} 0%, rgba(0,0,0,0) 72%),` +
            `linear-gradient(180deg, ${mixHex(kidTheme.ink, kidTheme.nightMid, 0.3)} 0%, ${mixHex(kidTheme.ink, kidTheme.skyLow, 0.18)} 62%, ${mixHex(kidTheme.ink, kidTheme.earth, 0.3)} 100%)`,
        }}
      />
      {/* The floor: a lit pool with a soft front edge, because five bodies
          standing on nothing read as five stickers — and because the shot needs
          somewhere for the eye to put them. It breathes on the same slow clock
          everything else in the episode does. */}
      <WideLayer zIndex={1}>
        <ellipse
          cx={WIDTH / 2}
          cy={1148 + Math.sin(t * 0.4) * 1.5}
          rx={1560}
          ry={288}
          fill={mixHex(kidTheme.ink, kidTheme.earth, 0.26)}
        />
        <ellipse
          cx={WIDTH / 2}
          cy={1176}
          rx={1120}
          ry={244}
          fill={mixHex(kidTheme.earth, kidTheme.sun, 0.35)}
          opacity={0.22}
        />
      </WideLayer>
    </>
  );
};

/**
 * **PHOTOSYNTHESIS, reprised** — five blocks that light up in owner order.
 *
 * Every block is mounted for the whole window and lit by its own turn, so the
 * number of elements never changes between two frames (the `RollCall` rule in
 * the cold open: a `.filter()` on the current frame changes how many components
 * with hooks exist, and `SpeechBubble`/`spring` are hooks).
 *
 * A block is dim in the ingredient-neutral card colour until its syllable is
 * said (by the Narrator, since 2026-10-17), then it takes its owner's own
 * colour and hops. By `rc_11_narrator` the
 * whole word is lit, which is the picture the Narrator's summary plays over.
 */
/** Pip's leaf green, from her own palette — the row is made of her family. */
const PIP_LEAF = "#63d16b";

const SYLLABLE_COLOR: Record<string, string> = {
  drip: INGREDIENT.water,
  puff: INGREDIENT.air,
  // Ray is the warm white he is drawn in; Pip takes her LEAF green rather than
  // her seed's oat, which is the same colour a foot away on the card and made
  // SYN and THE one block with a gap in it.
  ray: mixHex(INGREDIENT.light, kidTheme.paper, 0.72),
  pip: PIP_LEAF,
  sunny: INGREDIENT.light,
};

const SyllableReprise: React.FC<{
  scene: TimedScene;
  from: number;
  until: number;
  summaryFrom: number;
}> = ({ scene, from, until, summaryFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = Math.max(0, Math.min(1, (frame - until) / 10));
  if (frame < from || out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 196,
        transform: `translateY(-50%) scale(${1 - out * 0.12})`,
        opacity: 1 - out,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        zIndex: 50,
        fontFamily: kidTheme.fontFamily,
        pointerEvents: "none",
      }}
    >
      {CHANT.map((block, i) => {
        const [saidFrom, saidTo] = sayWindow(scene, block, fps);
        const land = spring({
          frame: frame - from - i * 3,
          fps,
          config: { damping: 11, mass: 0.6 },
        });
        // The hop is the syllable being SAID: it runs over that syllable's
        // measured speech in/out inside its own clip (`sayWindow`), not the
        // padded turn window and not an even split.
        const u = (frame - saidFrom) / Math.max(1, saidTo - saidFrom);
        const hop = u >= 0 && u <= 1 ? Math.sin(u * Math.PI) : 0;
        const lit = frame >= saidFrom;
        const color = SYLLABLE_COLOR[block.who];
        // Everything is lit by the time the Narrator says the word plainly, and
        // the whole row gives one small breath under his line.
        const together = frame >= summaryFrom ? 1 + 0.02 * Math.sin((frame - summaryFrom) / 9) : 1;
        return (
          <div
            key={block.syllable}
            style={{
              background: lit ? color : mixHex(kidTheme.ink, kidTheme.paper, 0.22),
              color: lit ? kidTheme.ink : mixHex(kidTheme.paper, kidTheme.ink, 0.45),
              border: `9px solid ${kidTheme.ink}`,
              borderRadius: kidRadius.card,
              padding: "12px 30px",
              fontSize: 100,
              fontWeight: 900,
              lineHeight: 1.05,
              boxShadow: kidShadow(1.1),
              transform:
                `translateY(${(-hop * 46 + (1 - land) * -80).toFixed(1)}px)` +
                ` scale(${((0.4 + 0.6 * land) * (1 + hop * 0.12) * together).toFixed(3)})` +
                ` rotate(${((1 - land) * 12 - 2 + hop * 3).toFixed(1)}deg)`,
              opacity: Math.min(1, Math.max(0, (frame - from - i * 3) / 4)),
            }}
          >
            {block.syllable}
          </div>
        );
      })}
    </div>
  );
};

// ===========================================================================
// Scene 28 — Your next breath
// ===========================================================================
//
// **The cold open's circle, closed.** Scene 1: a child kneels in this field and
// gives a plant a breath. Here the child is standing where the dandelion clock
// used to be, beside a young plant that was not there this morning, and the
// plant gives one back. The staging is Scene 1's, mirrored:
//
//   Scene 1   the beat is a ramp UP and a hard drop THROUGH zero — the blow.
//   Scene 28  the same ramp up, held, and released gently — the breath IN. The
//             audience is doing it too, which is what the 45 frames are for
//             ("a child needs the time to actually do it, and if the next line
//             lands first they will not").
//
// GOLDEN HOUR HAS NO PLATE. `meadow_day` under act three's `goldenGrade` filter
// chain — see its note for the measured numbers and for why one hour has to be
// one recipe rather than two files' worth of independent good ideas.

const S28_KID: KidPlacement = {
  // Clear of the volcano's right slope (it reaches x≈417 on the horizon) and
  // clear of Pip's leaves, which start around 700. The gap between the two of
  // them is the shot: a child and a plant, standing next to each other.
  x: 620,
  y: stand("kid", MEADOW.ground + 12),
  scale: 1.24,
  // Standing, not kneeling: same body, same field, a few hours later.
  kneel: 0,
  hold: 0,
};

const S28_PIP = { x: MEADOW.pip.x, y: stand("pip", MEADOW.ground), scale: 0.68 };
const S28_PUFF = { x: 1210, y: 372, scale: 0.92 };

const S28_BUBBLES: Record<string, string> = {
  // Clip: "A plant made that one. Pass it on." The proudest small line he has,
  // and the trim keeps the half that is about the plant rather than about him.
  rc_17_puff: "A plant made that one.",
};

const YourBreathScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  // --- THE BREATH ----------------------------------------------------------
  // Scripted at 45f after "Take a big breath. A real one. Go on." Phases are
  // fractions of the beat rather than frame numbers, so raising the gap in
  // Video.tsx stretches the breath instead of leaving a filled chest sitting in
  // silence — `heldBeat` reads the script's number out of the timeline.
  const [beatFrom, beatTo] = heldBeat(scene, "rc_15_narrator");
  const beat = Math.max(1, beatTo - beatFrom);
  const u = (frame - beatFrom) / beat;
  const inhale = kidEase.easeInOutSine(u / 0.46);
  const release = kidEase.easeInOutSine((u - 0.74) / 0.26);
  const breath = frame < beatFrom ? 0 : Math.max(0, inhale - release);

  // --- what the plant handed over ------------------------------------------
  // One pale mote leaves Pip's leaves while the Narrator says "A plant breathed
  // it out.", and it is still travelling when the held beat after that line
  // opens. **That is deliberate and it is the ep-3 ruling**: nothing may ENTER
  // a held beat, and a law already in progress is not entering. It arrives at
  // the child two thirds of the way through the silence.
  const [outFrom, outTo] = lineWindow(scene, "rc_16_narrator");
  const [, oxygenTo] = heldBeat(scene, "rc_16_narrator");
  const oxygenFrom = outFrom + Math.round((outTo - outFrom) * 0.72);
  const oxygenLands = oxygenTo - 14;
  const oxygen = (frame - oxygenFrom) / Math.max(1, oxygenLands - oxygenFrom);

  // And the other half of the trade, in the other direction: the fizzy part of
  // the child's own breath crosses to the tree while the Narrator says so.
  const [fizzFrom, fizzTo] = lineWindow(scene, "rc_18_narrator");
  const fizz = (frame - fizzFrom - 10) / Math.max(1, (fizzTo - fizzFrom) * 0.62);

  const kid: KidPlacement = { ...S28_KID, breath };
  // Where the mote goes: the child's chest, which is where a breath ends up.
  // Local y ≈ −44 standing (`kidPose`'s shoulder line plus a bit), and the body
  // is bottom-anchored, so it is the ground line minus (210 − −44) × scale.
  const chestY = S28_KID.y + CHAR_BOX.kid / 2 - 254 * (S28_KID.scale ?? 1);

  const puffEmotion = useEmotion(
    scene,
    "puff",
    { rc_17_puff: "proud" },
    "happy",
    // Two held beats in this scene: the kit's 8-frame lead would land his face
    // inside the silence the homework is being done in.
    NO_LEAD,
  );

  // Puff drifts across to the tree under the last line, escorting the fizzy
  // part he has just been talking about. He is in the shot from frame one — a
  // character who arrives for his own line is a pop-in, and he lives here.
  // He stops a body short of the canopy: a character parked ON the tree hides
  // the one piece of scenery this line is about.
  const puffX = S28_PUFF.x + Math.max(0, Math.min(1, fizz)) * 128;
  const puffMark: Mark = {
    x: puffX,
    y: hover("puff", S28_PUFF.y + Math.sin(t * 0.6) * 8, S28_PUFF.scale),
    scale: S28_PUFF.scale,
    who: "puff",
    side: "left",
  };

  // A very slow pull back, so the tree the last line is about is in the frame
  // by the time it is named. Under the threshold of noticing, and it never goes
  // below 1× — the plate rides inside the camera (see `PlatedWide`).
  //
  // **Parked before the first held beat**, which every camera in act three
  // does and this one did not: it used to run to `fizzFrom`, i.e. straight
  // through the 45-frame breath and the 45-frame oxygen hold. The rate made it
  // deniable; the rule does not have a rate in it. `beatFrom` is the breath
  // hold's first frame, so the move is over before the child inhales.
  const cam: Cam = {
    x: S28_PIP.x,
    y: MEADOW.ground - 120,
    zoom: interpolate(frame, [0, beatFrom], [1.075, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeInOutSine,
    }),
  };

  return (
    <PlatedWide
      plate="meadow_day"
      phase={5.2}
      cam={cam}
      // Everything inside the camera is left in its own colours and graded by
      // the filter, exactly as act three does it: pre-tinting the canopy and
      // the crest for a grade that is no longer there double-warms them.
      filter={goldenGrade(1)}
      wash={<SunWash u={1} x={1186} y={308} spread={1.8} />}
      grade={<CookingBloom u={Math.max(0, Math.min(1, (frame - fizzFrom) / 60))} />}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ puff: puffMark } as Cast}
          text={S28_BUBBLES}
          maxWidth={520}
          at={{ rc_17_puff: { x: 1330, y: 190, tail: "right", tailAt: S28_PUFF.x } }}
        />
      }
    >
      {/* **THE SPROUT ROW, on Scene 15's own marks.** Scene 29 finds five
          siblings standing in this field and they were planted in Scene 15, so
          on the world's own logic they are here at golden hour too — and they
          now are, at the same marks and the same fraction of the hero's height
          the goodnight uses. (They were absent because the first pass sized
          them to reach the dusk plate's ember band, which made them bean poles
          in daylight; `siblingHeight` is the fix.) Background: unnamed, and
          nobody looks at them. */}
      {SPROUT_ROW.map((s) => (
        <SproutSilhouette
          key={s.name}
          x={s.x}
          ground={s.ground}
          h={siblingHeight(pipHeightPx("young", S28_PIP.scale), s.ground)}
          leaves={s.leaves}
          phase={s.phase}
          t={t}
          tone={mixHex(PLATES.meadow_day.grass, kidTheme.grassDark, 0.34)}
        />
      ))}
      <KidSilhouette {...kid} />
      <Pip
        x={S28_PIP.x}
        y={S28_PIP.y}
        scale={S28_PIP.scale}
        state="young"
        // The permanent lean, toward the low sun off frame right. Set in Scene
        // 26 and never put back — this is the resolved runner, not a firing.
        lean={LEAN_FULL}
        phase={PHASE.pip}
        emotion="happy"
        // She watches the child do the homework. She has no line in this scene
        // and does not need one.
        look={{ x: -0.7, y: 0.15 }}
        zIndex={12}
      />
      <Puff
        x={puffMark.x}
        y={puffMark.y}
        scale={S28_PUFF.scale}
        opacity={0.5}
        phase={PHASE.puff}
        emotion={puffEmotion}
        speaking={stage.speaking("puff")}
        look={frame >= fizzFrom ? { x: 0.6, y: 0.1 } : { x: -0.4, y: 0.35 }}
        wisps={2}
        bank={frame >= fizzFrom ? 6 : 0}
        zIndex={14}
      />
      {/* The two motes. Drawn, tiny, and never named: the oxygen the plant let
          go of and the fizzy part the tree takes back. */}
      {/* `arc` is signed off the LEFT-HAND normal of the chord (`moveAlong`),
          so a leftward journey needs a negative one to bow upwards. The first
          pass had the plant's breath sagging to the child's knees. */}
      <Mote
        from={{ x: S28_PIP.x + 30, y: 686 }}
        to={{ x: S28_KID.x + 26, y: chestY }}
        u={oxygen}
        arc={-0.32}
        color={kidTheme.mint}
      />
      <Mote
        from={{ x: S28_KID.x + 40, y: chestY }}
        to={{ x: MEADOW.tree.x - 40, y: MEADOW.horizon - 250 }}
        u={fizz}
        arc={0.28}
        color={mixHex(kidTheme.airCool, kidTheme.paper, 0.3)}
      />
    </PlatedWide>
  );
};

/**
 * One small travelling breath. An arc rather than a lerp (STYLE: "a straight
 * lerp between two marks is the clearest tell that a scene was positioned
 * rather than animated"), fading in off its source and out into its target, so
 * nothing pops on or off.
 */
const Mote: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  u: number;
  arc: number;
  color: string;
}> = ({ from, to, u, arc, color }) => {
  const frame = useCurrentFrame();
  if (u <= 0 || u >= 1) return null;
  const p = moveAlong(from, to, kidEase.easeInOutSine(u), { arc });
  const fade = Math.min(1, u * 6) * Math.min(1, (1 - u) * 5);
  const wobble = Math.sin(frame * 0.24) * 4;
  return (
    <WideLayer zIndex={16}>
      <g opacity={0.9 * fade}>
        <circle cx={p.x} cy={p.y + wobble} r={26} fill={color} opacity={0.32} />
        <circle cx={p.x} cy={p.y + wobble} r={15} fill={color} opacity={0.6} />
        <circle cx={p.x} cy={p.y + wobble} r={8} fill={kidTheme.paper} opacity={0.95} />
      </g>
    </WideLayer>
  );
};

/**
 * **GOLDEN HOUR, and it is act three's grade rather than this file's.**
 *
 * script.md treats scenes 22, 23 and 28 as one hour, separated only by the
 * recap panels — so they have to BE one hour. Act three solved it as a CSS
 * filter chain over the whole camera group and measured it (`act3.tsx`'s
 * `goldenGrade`, with the derivation and the two rejected neighbours written
 * down): whole-frame mean ≈141, a warm channel balance of roughly 160/143/70.
 * This file's first pass solved the same problem independently, with a pair of
 * `mix-blend-mode` layers, and landed somewhere else entirely — 132–134 mean
 * with a balance of 115/143/92, green-dominant, which reads as a hazy midday
 * rather than as the hour `full_s23e.png` is in. Showrunner ruling (repair
 * pass): act three's is canon; port it, kill the blend layers, re-measure.
 *
 * **It is a copy, and it is flagged as one.** `act3.tsx` exports its scene map
 * and nothing else, and neither file may edit the other or `common.tsx`, which
 * is where this belongs. **Retro item**: `goldenGrade` (and `NearCrest`, and
 * `OldTree`, and the sprout row) belong in `scenes/common.tsx`, defined once —
 * three acts solving the same problem three times is exactly how two of them
 * end up in different hours.
 *
 * **The filter is only half of it** — the other half is `SunWash`, below, and
 * porting this without that is what left Scene 28 measuring 130.6 with a cyan
 * sky. Both are needed; the numbers are in `SunWash`'s note.
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
 * **The other half of the grade, and the half the first port left behind.**
 *
 * Golden hour in act three is `goldenGrade` PLUS this — a warm radial from the
 * corner of the sky the one enormous obvious supplier is in, drawn inside the
 * graded group and above the field, because it is light between the viewer and
 * the world rather than a thing standing in it. Ported alone, the filter took
 * Scene 28 to a measured **130.6** with the sky reading cyan (36.6/123.9/126.9
 * against act three's 87.3/127.4/109.5) — the right chemistry over the wrong
 * light. It is act three's component, verbatim, and the same retro item as
 * `goldenGrade`: both belong in `scenes/common.tsx`, defined once.
 *
 * Sunny is not in this shot; the sun still is. It sits where act three puts
 * him — frame right, low, which is the direction Pip's permanent lean points.
 *
 * **`spread` is the one number that is not act three's, and it is 1.8.** Act
 * three's wash is a 1200×900 glow *around a two-metre luminous character*;
 * half the warmth in that frame is Sunny's own body, and Scene 28 does not
 * have him. Widened 1.8× the same gradient carries the hour on its own.
 * Measured on frame 26800 against act three's 22466 (`lum.py`):
 *
 *   act3 s23   142.3   rgb 164.4/144.9/70.9
 *   filter only  130.6   rgb 139.6/137.0/74.1   (the half port)
 *   + wash ×1.0  133.6   rgb 148.6/137.9/71.9
 *   + wash ×1.8  136.9   rgb 158.6/138.8/70.1   ← here
 *
 * The remaining 5 points of mean are the missing sun *body*, not the hour:
 * the field strips agree to 1.5 (act3 191.2/143.2/30.3, s28 201.5/137.8/17.2)
 * and R > G by 20 in both.
 */
const SunWash: React.FC<{ u: number; x: number; y: number; spread?: number }> = ({
  u,
  x,
  y,
  spread = 1,
}) => {
  if (u <= 0.01) return null;
  return (
    <AbsoluteFill
      style={{
        background:
          `radial-gradient(ellipse ${(1200 * spread).toFixed(0)}px ${(900 * spread).toFixed(0)}px at ${x}px ${y}px,` +
          ` rgba(255,206,120,${(0.34 * u).toFixed(3)}) 0%,` +
          ` rgba(255,178,96,${(0.14 * u).toFixed(3)}) 42%, transparent 76%)`,
        pointerEvents: "none",
      }}
    />
  );
};

/**
 * The one thing left over the graded group: the tree taking the fizzy part of
 * the child's breath on the last line. A bloom, not a grade — small enough to
 * be deniable, and the only lighting event in the scene.
 */
const CookingBloom: React.FC<{ u: number }> = ({ u }) => {
  if (u <= 0.01) return null;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle 320px at ${MEADOW.tree.x}px ${MEADOW.horizon - 240}px, rgba(255,236,168,${(0.34 * u).toFixed(3)}) 0%, rgba(255,224,140,0) 72%)`,
        zIndex: 42,
        pointerEvents: "none",
      }}
    />
  );
};

// ===========================================================================
// Scene 29 — Goodnight, everybody called Pip
// ===========================================================================
//
// The last picture in the episode, and it is built the way the plate is:
// `meadow_dusk`'s ember band is the brightest thing in the frame **by design**
// and its field is near-black, so the row is read as silhouettes standing in
// the ember rather than as characters lit in a field. Everything in this scene
// is therefore sized so its head is above the horizon.
//
// ROLL CALL — FIRING 2 (goodbye), and the shape is the cold open's exactly:
// cheerful naming, one flat Narrator line, unbothered button. One clip, five
// bubbles, swapped on the **measured** phrase boundaries of `rc_20_pip.mp3`
// (see `GOODBYE_STARTS`). The joke is also the lesson: a farewell between
// neighbours who are all planted forever, and nobody goes anywhere.

/**
 * The five, in the order the cold open fixed — **and they must stay in it**:
 * the greeting in Scene 2 and this goodbye are the same names in the same
 * sequence, which is most of what makes the second firing land.
 *
 * The names are re-typed here rather than shared, because `SIBLINGS` is private
 * to `coldOpen.tsx` and this act may not edit that file. **Retro item**: the
 * roll-call table belongs in `common.tsx`, where both firings can read it.
 *
 * **`x` and `ground` are Scene 15's, and they are canon because plants cannot
 * move** (showrunner ruling, repair pass). They were planted at
 * `act2.tsx:1887-1892` — x 236/470/1180/1452/1734 on ground lines
 * 812/776/790/832/878 — and the first pass of this scene put them at
 * 170/430/1150/1420/1750, all on `MEADOW.ground`: five plants that had walked
 * 16–66px sideways and up to 126px forward, in an episode whose entire premise
 * is that they can do neither. The left-to-right order is unchanged, so the
 * roll call still names them in the order the eye reads them.
 */
const SPROUT_ROW = [
  { name: "Pipsqueak", x: 236, ground: 812, leaves: 4, phase: 0.4 },
  { name: "Pipley", x: 470, ground: 776, leaves: 5, phase: 2.1 },
  { name: "other Pip", x: 1180, ground: 790, leaves: 4, phase: 3.6 },
  { name: "Pippa", x: 1452, ground: 832, leaves: 5, phase: 1.2 },
  { name: "Pip the third", x: 1734, ground: 878, leaves: 4, phase: 4.8 },
] as const;

/**
 * **How tall a sibling is, and it is measured against the hero rather than in
 * pixels** — the same rule act three's copy of this row uses, so the row is the
 * same row in Scene 24, Scene 26, Scene 28 and here.
 *
 * What has to be true is a ratio, not a number: Pip is "tallest among them" in
 * Scene 29 and "taller than the sprout row" in Scene 26, and the two acts do
 * not agree about her absolute scale (0.72 in act three, 0.68 in Scene 28, 0.96
 * here — see the 28→29 note in the header). So a sibling is 0.8 of the hero's
 * own height in THIS shot, scaled by how far back it stands: the row is planted
 * across a hundred pixels of depth and a plant on the far line has to be
 * smaller than one on the near line or the field goes flat.
 */
const SIBLING_OF_PIP = 0.8;

function siblingHeight(pipHeight: number, ground: number): number {
  const depth = (ground - MEADOW.horizon) / (MEADOW.ground - MEADOW.horizon);
  return pipHeight * SIBLING_OF_PIP * depth;
}

/** Pip's height in composition px — crown to dirt — at a state and a scale. */
function pipHeightPx(state: "young", scale: number): number {
  return (230 - pipCrownLocal(state)) * scale;
}

/**
 * **Where the goodbye's five names actually land in the clip.**
 *
 * `npx remotion ffmpeg -i public/narration/plants/rc_20_pip.mp3 -af
 * silencedetect=noise=-32dB:d=0.10` on the 6.41s take: four phrase boundaries
 * at 1.154–1.514, 2.327–2.686, 3.398–3.835 and 4.575–4.954. The numbers below
 * are the **middles** of those four gaps as fractions of the turn, so every
 * bubble swap happens while nobody is talking, and a re-roll of the clip
 * re-times all five for free.
 */
const GOODBYE_STARTS = [0, 0.207, 0.39, 0.562, 0.741] as const;

/** How far the outgoing bubble leaves ahead of the incoming one. */
const GOODBYE_HANDOVER = 5;

/**
 * **Pip's height is the joke's straight man**: "Pip's young plant tallest among
 * them". At 0.96 her crown lands around y=490 — a clear head above the tallest
 * sibling (Pippa's 330px tops out at 572) and well up inside the ember band,
 * which is the only place in this frame anything reads at all.
 */
const S29_PIP = { x: MEADOW.pip.x, y: stand("pip", MEADOW.ground), scale: 0.96 };

const S29_BUBBLES: Record<string, string> = {
  rc_22_pip: "See you tomorrow.",
  // Clip: "Send it here. I will grade it." — seven words on screen, one over
  // the house ceiling, and `SpeechBubble` warned on every render for it. Six,
  // and the last six of the episode: her stamp machinery aimed at next time's
  // question, register intact to the final syllable.
  rc_24_pip: "Send it. I will grade it.",
};

const GoodnightScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [nameFrom, nameTo] = lineWindow(scene, "rc_20_pip");
  const [cardFrom] = lineWindow(scene, "rc_23_narrator");

  // THE ROLL CALL: her eyes walk the row, one sibling per measured phrase, and
  // the bubble saying a name and the eyes finding that plant are the same
  // instant by construction.
  const naming = frame >= nameFrom && frame < nameTo;
  const nameLen = Math.max(1, nameTo - nameFrom);
  const sayAt = GOODBYE_STARTS.map((f) => nameFrom + Math.round(f * nameLen));
  let which = 0;
  for (let i = 0; i < sayAt.length; i += 1) if (frame >= sayAt[i]) which = i;
  const target = SPROUT_ROW[which];
  // Divisors are the actual spread of the row about her, so five names land on
  // five distinct pupil positions instead of clamping to one.
  const look = naming
    ? {
        x: Math.max(-1, Math.min(1, (target.x - S29_PIP.x) / 700)),
        y: -0.25,
      }
    : ("camera" as const);

  // NO_LEAD: two 45f held beats in this scene, and the kit's default lead would
  // put her deadpan on her face while the silence in front of it is still
  // running. Both of her faces here land on their own first frame of speech.
  const pipEmotion = useEmotion(
    scene,
    "pip",
    { rc_20_pip: "happy", rc_22_pip: "skeptical", rc_24_pip: "skeptical" },
    "happy",
    NO_LEAD,
  );

  const pipMark: Mark = {
    x: S29_PIP.x,
    y: S29_PIP.y,
    scale: S29_PIP.scale,
    who: "pip",
    state: "young",
    side: "left",
  };
  // One place for every bubble in the scene: high and left of her, clear of the
  // volcano (which tops out at y≈505) and clear of the end card, which comes up
  // on the other side of the frame. A bubble that moves for the button would
  // read as a cut.
  const bubbleAt = { x: 560, y: 286, tail: "right" as const, tailAt: S29_PIP.x };

  return (
    <PlatedWide
      plate="meadow_dusk"
      phase={7.4}
      crestShade={0.45}
      // A dark plate: without the warm rim the island is black on near-black and
      // reads as a hole rather than as a place (the ep-3 finding).
      rim={0.9}
      canopy={mixHex(kidTheme.ink, kidTheme.nightMid, 0.28)}
      trunk={mixHex(kidTheme.ink, kidTheme.nightTop, 0.2)}
      // "The sun went down on the field": the last of it goes out across the
      // scene, one twelfth of a stop, far too slow to notice frame to frame.
      grade={<DuskDeepen u={Math.min(1, frame / Math.max(1, scene.durationInFrames))} />}
      overlay={
        <>
          <Bubbles
            scene={scene}
            cast={{ pip: pipMark } as Cast}
            text={S29_BUBBLES}
            maxWidth={520}
            at={{ rc_22_pip: bubbleAt, rc_24_pip: bubbleAt }}
          />
          <GoodbyeRollCall
            at={sayAt}
            until={nameTo}
            x={bubbleAt.x}
            y={bubbleAt.y}
            tailAt={S29_PIP.x}
          />
          <NextTimeCard from={cardFrom} />
        </>
      }
    >
      {SPROUT_ROW.map((s) => (
        <SproutSilhouette
          key={s.name}
          x={s.x}
          ground={s.ground}
          h={siblingHeight(pipHeightPx("young", S29_PIP.scale), s.ground)}
          leaves={s.leaves}
          phase={s.phase}
          t={t}
          // Lifted off the near-black field rather than mixed into it: at dusk
          // a silhouette only exists if it is a different value from what is
          // behind it, and their crowns no longer reach the ember band.
          tone={mixHex(kidTheme.ink, PLATES.meadow_dusk.grass, 0.35)}
        />
      ))}
      <Pip
        x={S29_PIP.x}
        y={S29_PIP.y}
        scale={S29_PIP.scale}
        state="young"
        // Still leaning where Scene 26 left her, at the place the sun went down.
        lean={LEAN_FULL}
        phase={PHASE.pip}
        emotion={pipEmotion}
        speaking={stage.speaking("pip")}
        look={look}
        eyeLife={naming ? 0.4 : 1}
        zIndex={14}
      />
    </PlatedWide>
  );
};

/**
 * One of the row: a sibling, at dusk, as a shape.
 *
 * Flat ink with a hair of the plate's own dusk green in it, so the row belongs
 * to the field it is standing in rather than being cut out of black paper. No
 * faces — they never had any, in either firing, and the joke of the roll call
 * is that Pip is naming plants indistinguishable from her.
 *
 * **Read against the ember band, not sized to reach it.** `meadow_dusk`'s field
 * is near-black by design and its ember band is the brightest thing in the
 * frame, so the first pass simply made the row tall enough for its crowns to
 * poke into the band — which put five siblings a head above the hero the script
 * calls "tallest among them", and made the row unusable in daylight (they came
 * out as bean poles in Scene 28, which is why that scene had none). They are
 * now `siblingHeight` like everywhere else, and the legibility comes from the
 * value instead: their tint is lifted off the field they stand in rather than
 * mixed into it, so a shape reads at dusk without out-growing the hero.
 */
const SproutSilhouette: React.FC<{
  x: number;
  ground: number;
  h: number;
  leaves: number;
  phase: number;
  t: number;
  tone: string;
}> = ({ x, ground, h, leaves, phase, t, tone }) => {
  const ink = tone;
  const sway = Math.sin(t * 0.5 + phase) * 1.4;
  const top = ground - h;
  // **The first pass of this drew a street lamp**, and that is the silhouette
  // trap STYLE warns about: a thin even pole with a round blob on top and two
  // small leaves reads as municipal lighting at any size. Three fixes, all of
  // them shape rather than colour — a stem that TAPERS (a filled path, not a
  // stroke), leaves that are a third of the plant's height and start low, and a
  // seed case small enough that the leaves out-measure it.
  // Proportional to the plant rather than absolute: the row is sized off the
  // hero now, so a sibling at the back of the field is a smaller plant and not
  // a full-sized one that has been squashed.
  const base = h * 0.042;
  const tip = h * 0.016;
  const bend = h * 0.028;
  const capR = h * 0.058;
  return (
    <WideLayer zIndex={12}>
      <g transform={`rotate(${sway.toFixed(2)} ${x} ${ground})`}>
        <ellipse cx={x} cy={ground + 4} rx={h * 0.14} ry={h * 0.034} fill={kidTheme.ink} opacity={0.35} />
        {/* Stem: two curves out and back, so it is wide at the dirt and thin at
            the case. */}
        <path
          d={
            `M ${x - base} ${ground}` +
            ` Q ${x - bend - 3} ${top + h * 0.45} ${x - tip} ${top + 8}` +
            ` L ${x + tip} ${top + 8}` +
            ` Q ${x - bend + 3} ${top + h * 0.45} ${x + base} ${ground} Z`
          }
          fill={ink}
        />
        {Array.from({ length: leaves }, (_, i) => {
          const side = i % 2 === 0 ? 1 : -1;
          // **All the foliage lives in the top third**, and that is a legibility
          // call rather than botany: this plate's field is near-black by design
          // and only what stands in the ember band reads at all, so a plant
          // whose leaves are down in the grass is a bare pole on screen. The
          // lowest of the four is the biggest.
          const u = 0.55 + (i / Math.max(1, leaves - 1)) * 0.38;
          const y = ground - h * u;
          const len = h * (0.46 - u * 0.22);
          // Fat and round rather than pointed: a thin leaf on a long stem is a
          // petal, and five petals round a knob is a flower on a stick.
          const lift = len * 0.56;
          return (
            <path
              key={i}
              d={
                `M ${(x + side * 3).toFixed(1)} ${y.toFixed(1)}` +
                ` q ${(side * len * 0.55).toFixed(1)} ${(-lift).toFixed(1)} ${(side * len).toFixed(1)} ${(-lift * 0.5).toFixed(1)}` +
                ` q ${(-side * len * 0.42).toFixed(1)} ${(lift * 0.86).toFixed(1)} ${(-side * len).toFixed(1)} ${(lift * 0.5).toFixed(1)} Z`
              }
              fill={ink}
            />
          );
        })}
        {/* The seed case and three filaments of what is left of a parachute, so
            a sibling is the same species as the hero rather than a weed. */}
        <ellipse cx={x} cy={top - capR * 0.5} rx={capR} ry={capR * 0.82} fill={ink} />
        {[-1, 0, 1].map((s) => (
          <path
            key={s}
            d={`M ${(x + s * capR * 0.26).toFixed(1)} ${(top - capR).toFixed(1)} l ${(s * capR * 0.68).toFixed(1)} ${(-capR * 0.9).toFixed(1)}`}
            stroke={ink}
            strokeWidth={Math.max(2, capR * 0.21)}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </g>
    </WideLayer>
  );
};

/**
 * The goodbye, and the one bubble `Bubbles` structurally cannot draw: five of
 * them on one turn.
 *
 * Same construction as the cold open's greeting — all five mounted for the
 * whole scene and windowed, never filtered, because the number of components
 * calling hooks may not change between two frames.
 */
const GoodbyeRollCall: React.FC<{
  at: number[];
  until: number;
  x: number;
  y: number;
  tailAt: number;
}> = ({ at, until, x, y, tailAt }) => (
  <>
    {SPROUT_ROW.map((sibling, i) => (
      <SpeechBubbleLine
        key={sibling.name}
        text={`Bye ${sibling.name}.`}
        x={x}
        y={y}
        tailAt={tailAt}
        from={at[i]}
        until={i + 1 < at.length ? at[i + 1] - GOODBYE_HANDOVER : until}
      />
    ))}
  </>
);

/** One roll-call bubble. Kept separate so the map above has no inline props. */
const SpeechBubbleLine: React.FC<{
  text: string;
  x: number;
  y: number;
  tailAt: number;
  from: number;
  until: number;
}> = ({ text, x, y, tailAt, from, until }) => (
  <SpeechBubble
    x={x}
    y={y}
    text={text}
    tail="right"
    tailAt={tailAt}
    from={from}
    until={until}
    zIndex={44}
  />
);

/** The last of the light going, across the whole scene. */
const DuskDeepen: React.FC<{ u: number }> = ({ u }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(10,18,40,${(0.05 + 0.07 * u).toFixed(3)}) 0%, rgba(6,12,26,${(0.1 + 0.14 * u).toFixed(3)}) 100%)`,
      zIndex: 40,
      pointerEvents: "none",
    }}
  />
);

/**
 * **The end card, and next time is dirt.**
 *
 * Series grammar, fourth episode running: NEXT TIME, then the question in the
 * biggest type on screen, read aloud by the Narrator (`rc_23_narrator`) so a
 * six-year-old who cannot read it yet still gets asked it.
 *
 * And it asks the one thing this episode deliberately never answered. Soil is
 * an unexplained given for the whole fifteen minutes — she stands in it, she
 * grades it, she is told nobody eats it — and the card hands the question to
 * episode five without a single line of setup being spent on it.
 *
 * Frame right, so it never covers Pip, her bubbles, or the volcano — which is
 * asleep on the horizon underneath it and promises nothing.
 */
const NextTimeCard: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - from, fps, config: { damping: 14, mass: 0.9 } });
  if (pop <= 0.002) return null;
  return (
    <div
      style={{
        position: "absolute",
        // Frame right, and sized so it covers the old tree **completely**
        // rather than leaving a canopy peeking out of one rounded corner — a
        // still of the smaller card had exactly that, and a green blob behind
        // the poster reads as a smudge rather than as a tree.
        left: 1470,
        top: 424,
        width: 664,
        height: 460,
        marginLeft: -332,
        marginTop: -230,
        transform: `scale(${pop}) rotate(${-3 + (1 - pop) * 8}deg)`,
        transformOrigin: "50% 100%",
        background: `linear-gradient(180deg, #2b2450 0%, #5a3a4e 100%)`,
        border: `12px solid ${kidTheme.ink}`,
        borderRadius: kidRadius.card,
        boxShadow: kidShadow(1.4),
        fontFamily: kidTheme.fontFamily,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 26,
          textAlign: "center",
          fontSize: kidType.min,
          fontWeight: 900,
          letterSpacing: 6,
          color: kidTheme.paper,
          opacity: 0.85,
        }}
      >
        NEXT TIME
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 104,
          bottom: 34,
          padding: "0 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontSize: 62,
          fontWeight: 900,
          lineHeight: 1.06,
          letterSpacing: 1,
          color: kidTheme.sun,
          textShadow: kidInkOutline(3),
        }}
      >
        WHAT IS DIRT ACTUALLY MADE OF?
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------

export const RECAP_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s27_curtain_call: CurtainCallScene,
  s28_your_breath: YourBreathScene,
  s29_goodnight: GoodnightScene,
};
