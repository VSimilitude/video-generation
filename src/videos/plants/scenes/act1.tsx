import React from "react";
import { Img, staticFile } from "remotion";
import { lookAt } from "../../../lib/kid";
import { BACKGROUNDS } from "../backgroundManifest";
import {
  Bubbles,
  KidContactShadow,
  MEADOW,
  MEADOW_Z,
  MeadowWorld,
  NO_LEAD,
  PHASE,
  PLATES,
  Pip,
  RAY_LIGHT,
  Ray,
  Shard,
  SleepingVolcano,
  SpeechBubble,
  Sunny,
  VOLCANO_AT,
  WIDTH,
  HEIGHT,
  WideLayer,
  blueRicochet,
  blueTrail,
  centreOf,
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
  settleWave,
  stand,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  type Box,
  type Cam,
  type Cast,
  type Mark,
  type TimedScene,
} from "./common";

// ACT ONE — THE LIGHT (scenes s05_sunrise … s10_puddle).
//
// B3 act file. Owned by the act-1 builder; nobody else edits it. Video.tsx
// spreads ACT1_SCENES into its SCENES registry — staging a scene here is
// adding its component to the record, nothing else to wire.
//
// The act in one line: recruited at night, wasted by day. Sunny claims
// everything and is right every single time, which is the problem.
//
// ---------------------------------------------------------------------------
// WHAT THIS ACT PLANTS (and therefore what a later act is allowed to assume)
//
//   THE LEAN       Pip's stem drifts toward the light all by itself and she
//                  puts it back — heliotropism, true botany, her body voting
//                  against her attitude. Planted in Scene 5 (scripted, with
//                  narration on it), fired wordlessly in Scene 7. It is her
//                  whole gesture rig: she has no arms and never leaves
//                  `MEADOW.pip.x`.
//   THE ORDER      LIGHT / WATER / AIR, posted over her head in Scene 6 as
//                  three cards. Dirt is conspicuously not on it.
//   THE STAMP      "It will do." firing 2 of 5, on the moonlight (Scene 7).
//   SUNNY'S SIDE   He rises frame-RIGHT (x = 1180) and everything about him
//                  in this episode happens on that side of frame: he sets
//                  there (Scene 7's under-horizon glow), dawn comes back up
//                  there (Scene 8), and he sits there all morning (Scenes 9
//                  and 10). Pip's two leans aim at that side because that is
//                  where he is — Scene 5 toward him, Scene 7 toward the place
//                  he went down. **An act that moves him breaks both leans.**
//
// ---------------------------------------------------------------------------
// THE PLATE MECHANISM (B3, new since the skeleton)
//
// Every wide in this act draws its painted plate scaled by `PLATES[key].scale`
// and top-cropped so the plate's measured `skyline` row lands exactly on
// `MEADOW.horizon` (604) — see `plateFit`. That is what puts the SVG volcano
// on the *painted* horizon rather than near it, in every wide, from the first
// frame of the scene. Everything that moves, gets touched or lines up with a
// character stays SVG on top: the volcano, the old tree, Sunny, the moon, the
// beams, the puddle, the mist, Pip's dirt patch, the bowed field.
//
// The plate replaces `MeadowWorld`'s painted sky/far-hills/grass bands, so
// every scene here mounts it with `wide={false}` and re-draws the two pieces
// that are not the plate's job (`MeadowPlate` below): the near-field crest,
// tinted from `PLATES[key].grass` so the seam does not read, and the scenery
// layer the volcano and the tree stand in.
//
// ---------------------------------------------------------------------------
// THE BOUNDARY CHECKLIST (STYLE, "A cut inside a continuous space")
//
// Twelve cuts touch this act. Every one lands in *silence* — after the last
// bubble has finished its seven-frame shrink-out and before the next line
// starts — and every one is verified by a paired still at (cut−1, cut). The
// LOCAL frame numbers below are the constants; the global frames are the still
// filenames in `scratchpad/ep4b3_repair12/`.
//
//   s04→s05  2625|2626. **A time cut, and it changes the world**: the cold
//            open's title scene ends drawn (no plate at all) and pulled back
//            to zoom 0.46 with dy 96, and this act opens on a seated
//            `meadow_sunrise` plate at 1.0. That is a night-and-day cut
//            between two shots that share only Pip's mark and her `skeptical`
//            face, and it is fine — title → sunrise is a time cut, so the
//            world is allowed to change with it. (The older claim here, that
//            "the camera is parked at 1.0 on both sides", was simply false.)
//   s05      wide → close at 505, ONE frame before `a1_07`: `a1_06_sunny`'s
//            bubble is not gone until 505 (see `S5_CUT`). Pip's mark, her face
//            and her (zero) lean carry; only the lens changes.
//   s06      wide → close at 503, close → wide at 745. The order cards keep
//            their `from` frames across both — they are already up rather than
//            popping a second time — and, since B3's repair pass, they stay
//            POSTED through the close as well, repositioned into its left
//            third. A posted work order does not come down for a reaction shot.
//   s06→s07  4287|4288. Day → night, hours apart; nothing carries but the mark.
//   s07      one shot. The push-in finishes 24 frames before the first held
//            beat.
//   s07→s08  6054|6055. Night → dawn, hours apart, but **Ray does not move**:
//            he is on the same mark at x=560 in both, which is the one handoff
//            that matters here (he took the job and worked the night).
//   s08→s09  6874|6875. Dawn → morning. Ray holds his mark again; Blue and
//            Violet are both gone before s08 ends, so nobody vanishes AT the
//            cut.
//   s09      wide → close insert on the held beat ("Here is what the light did
//            there."), and back. Both boundaries are derived from
//            `heldBeat(scene, "a1_41_narrator")` rather than typed, so the
//            insert cannot come adrift of the beat it exists for. The beam is
//            mid-fall on both sides of the first cut and mid-glitter on neither.
//   s09→s10  8172|8173. Same field, same hour, Ray on his mark in both.
//   s10      close → wide at 382, one frame before `a1_52`. The puddle is on
//            Pip's right in both, one step away in both.
//   s10→s11  9655|9656. Handed to act 2: `meadow_day`, camera 1.0, Pip at
//            `MEADOW.pip.x` scale 0.72, **Sunny on his mark at (1180, 320)** —
//            act 2 keeps him there, ambient, because a sun cannot leave a
//            daylight sky at a cut. Ray is NOT carried: he has no line in
//            Scene 11 and the script's cast for it is Pip and the Narrator, so
//            he is out of the frame from 9656 (showrunner ruling, film
//            grammar). His last mark here is the dry spot at x≈1122, not 1140.
//
// ---------------------------------------------------------------------------

/** Pip's face for the whole act: unimpressed, and never grumpy. */
const PIP_RESTING = "skeptical";

/**
 * **Sunny's side of the frame.** See the act header: two of Pip's leans and
 * three light sources are aimed at this number.
 */
const SUNNY_X = 1180;

// ---------------------------------------------------------------------------
// The painted plates, seated
// ---------------------------------------------------------------------------

/** Every plate is generated at this size (`scripts/generate-backgrounds.mjs`). */
const PLATE = { w: 1344, h: 768 } as const;

/**
 * A uniform 2% over-scale on top of the measured seat scale.
 *
 * `PLATES` is measured for the *minimum* seating fit, and two of the four
 * plates this act uses (`meadow_night`, `meadow_dawn`) land their top edge
 * about one pixel *below* the top of frame at exactly that number — a
 * one-pixel band of `KidBackdrop`'s day gradient across the top of a night
 * sky. 2% is the cheapest fix that keeps the seat exact (the skyline is
 * pinned to 604 at any scale, because the crop is derived from it) and costs
 * at most 2% more horizontal crop, which every plate in the set can spare.
 */
const PLATE_BLEED = 1.02;

type PlateKey = keyof typeof PLATES;

/**
 * **Where a plate is drawn**, in composition px.
 *
 * The seating rule, and the only place in the act that knows it: draw the
 * plate `scale × bleed` big and put its measured `skyline` row on
 * `MEADOW.horizon`. Everything else — the volcano's feet, the near-field
 * crest, where a character stands — is already keyed to that line, so the
 * plate is the thing that moves.
 *
 * A plate with no skyline (`grass_close`) is not a wide and has no horizon in
 * it: it covers the frame and is centred.
 */
function plateFit(key: PlateKey): { left: number; top: number; w: number; h: number } {
  const { skyline, scale } = PLATES[key];
  if (skyline === null) {
    const cover = Math.max(WIDTH / PLATE.w, HEIGHT / PLATE.h) * PLATE_BLEED;
    const w = PLATE.w * cover;
    const h = PLATE.h * cover;
    return { left: (WIDTH - w) / 2, top: (HEIGHT - h) / 2, w, h };
  }
  const s = scale * PLATE_BLEED;
  const w = PLATE.w * s;
  const h = PLATE.h * s;
  return { left: (WIDTH - w) / 2, top: MEADOW.horizon - h * skyline, w, h };
}

/**
 * The plate itself.
 *
 * **The drift is horizontal only**, which is a departure from
 * `KidPaintedBackdrop`'s two-axis breath and the reason this is not that
 * component: a vertical drift moves the painted skyline, and the volcano
 * standing on it does not move with it. Five pixels on a 34-second cycle is
 * under the threshold of noticing and is what keeps the plate from reading as
 * a slide the show forgot to animate.
 *
 * `Img` rather than `<img>`: Remotion blocks the frame until it has decoded,
 * so a render never emits a frame with a missing background.
 */
const Plate: React.FC<{
  bg: PlateKey;
  phase?: number;
  drift?: number;
  /**
   * Mirror the painting. One plate needs it: `meadow_dawn` paints its first
   * gold up the LEFT edge, and in this episode the sun belongs to the right
   * (`SUNNY_X`) — he rose there in Scene 5, set there in Scene 7 and sits
   * there all morning. Flipping the plate is free (the meadow has no composed
   * left or right, and the tree and the volcano are drawn on top) and keeping
   * the light where the character is, is not optional.
   */
  flip?: boolean;
}> = ({ bg, phase = 0, drift = 5, flip = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fit = plateFit(bg);
  const dx = Math.sin((frame / fps) * ((2 * Math.PI) / 34) + phase) * drift;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      <Img
        src={staticFile(BACKGROUNDS[bg])}
        style={{
          position: "absolute",
          left: fit.left + dx,
          top: fit.top,
          width: fit.w,
          height: fit.h,
          display: "block",
          transform: flip ? "scaleX(-1)" : undefined,
        }}
      />
    </div>
  );
};

/**
 * The near field, drawn on top of the plate's bottom band.
 *
 * Same crest as `MeadowWorld`'s (same path, same `MEADOW.ground`), because it
 * is the same field — but filled from `PLATES[key].grass`, the plate's own
 * measured near-field green, so the seam between painted grass and drawn
 * ground does not read. It is what a character standing on `MEADOW.ground`
 * actually stands *in*, and it is what hides the plates' painted grass fringe.
 */
const NearField: React.FC<{ grass: string }> = ({ grass }) => {
  const g = MEADOW.ground;
  const crest = (lift: number): string =>
    `M -1400 1880` +
    ` L -1400 ${g - 46 - lift}` +
    ` Q ${WIDTH * 0.28} ${g - 92 - lift} ${WIDTH * 0.62} ${g - 54 - lift}` +
    ` Q ${WIDTH * 0.9} ${g - 26 - lift} 3320 ${g - 62 - lift}` +
    ` L 3320 1880 Z`;
  return (
    <>
      <WideLayer zIndex={MEADOW_Z.ground}>
        {/* Three ghost copies of the crest, climbing and fading, before the
            solid one: the plate's painted grass and this flat fill are within
            a few percent of each other by construction (`PLATES[key].grass` is
            sampled from exactly this band) but a hard edge across 1920px shows
            up at *any* contrast, and a 54px feather is what makes the two one
            field rather than two greens meeting. */}
        {[54, 36, 18].map((lift, i) => (
          <path key={lift} d={crest(lift)} fill={grass} opacity={0.22 + i * 0.16} />
        ))}
        <path d={crest(0)} fill={grass} />
      </WideLayer>
      {/* The bottom of the frame belongs to the characters (STYLE, painted
          backgrounds): a soft darkening under them so a flat-filled body is
          sitting in a shadowed foreground rather than pasted onto a lit one. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: MEADOW_Z.ground,
          background:
            "linear-gradient(to top, rgba(24,44,30,0.34) 0%, rgba(24,44,30,0.13) 13%, transparent 32%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
};

/**
 * **The canopy's colour, and it is one rule for the whole episode.**
 *
 * The tree is copy-pasted into four files (see `ActOneTree` below) and for a
 * while every copy mixed it differently — act 1 from the plate's grass toward
 * ink, act 2 from `grassDark` toward the plate's grass, act 3 and the recap
 * flat `grassDark` — so the load-bearing Scene-20 tree was a different green in
 * act 1 and act 2 under the SAME daylight plate. Showrunner ruling at the B3
 * repair pass: acts 1 and 2 compute it from this rule, which is act 2's (and
 * therefore the nearest to act 3's and the recap's flat `grassDark`), and which
 * is also the one that reads: the theme's dark green carried a fifth of the way
 * toward the plate's own sampled near-field grass, so the tree belongs to the
 * light its plate is painted in without dissolving into the field.
 *
 * **The hour is the only knob**, and it is how far along that mix the canopy
 * sits. A fifth of the way in daylight, which is what act 2 draws; nearly all
 * the way when the field is in shadow, because those plates sample almost black
 * — and a theme-green tree in a moonlit field, or standing bright against a
 * dawn sky it should be a silhouette in front of, is a cut-out with a torch on
 * it. Same rule, same two colours, one number.
 *
 * `low` is therefore "this plate's field is dark", not "it is night": this act
 * stages `meadow_night` AND `meadow_dawn` that way, and the dawn one is the
 * reason the flag is not simply `night` — Scene 8's backdrop is a day backdrop
 * under a plate whose sky is bright and whose field is not.
 */
const CANOPY_MIX = { day: 0.22, low: 0.86 } as const;

function canopyFor(plateGrass: string, low = false): string {
  return mixHex(kidTheme.grassDark, plateGrass, low ? CANOPY_MIX.low : CANOPY_MIX.day);
}

/** The trunk: `kidTheme.earth` — everybody else's — taken down by the hour. */
function trunkFor(low = false): string {
  return low ? mixHex(kidTheme.earth, kidTheme.ink, 0.62) : kidTheme.earth;
}

/**
 * The big old tree at the meadow's edge.
 *
 * **A copy of `MeadowWorld`'s `OldTree`, and it is flagged for the
 * showrunner.** The tree is not exported from `scenes/common.tsx` and this act
 * may not edit that file, but a wide without it breaks the rule the cold open
 * set up (it is in every wide, always in the same place, because Scene 20 is
 * about it). The path data is byte-identical to common.tsx's so the two cannot
 * drift in shape; what differs is the palette, which here is mixed from the
 * *plate's* grass rather than from the theme — an SVG that shares an edge with
 * a painted plate matches the plate (STYLE). The clean fix is a `plate` prop on
 * `MeadowWorld` plus an exported `OldTree`, which would delete this component
 * and the same duplication in the other three act files; flagged at handback.
 * The *palette* is no longer this file's own invention — see `canopyFor`.
 */
const ActOneTree: React.FC<{ base: number; grass: string; low?: boolean }> = ({
  base,
  grass,
  low = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sway = Math.sin(t * 0.42) * 1.5;
  const canopy = canopyFor(grass, low);
  const canopyLit = mixHex(canopy, kidTheme.paper, 0.22);
  const trunk = trunkFor(low);
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
          <ellipse cx={-8} cy={-336} rx={72} ry={40} fill={canopyLit} opacity={0.75} />
        </g>
      </g>
    </WideLayer>
  );
};

/**
 * **A wide in this act**: the painted plate, the near field on top of it, the
 * volcano and the tree standing on the painted horizon, and the cast in front.
 *
 * `MeadowWorld` is mounted `wide={false}` — its drawn sky, far hills and grass
 * bands are exactly what the plate replaces — and everything it would have
 * drawn for a wide is re-drawn here in the same order, at the same
 * `MEADOW_Z` bands, so nothing in the act is ever at `zIndex: auto`. The
 * plate is *inside* the camera: a wide that pushes in has to push in on its
 * own world, and the seat is a fraction of the plate rather than a screen
 * position, so a zoom keeps the volcano on the painted horizon for free.
 * (Every camera in this act therefore stays at or above 1.0 — a pull-out below
 * 1.0 would show past the plate's edge.)
 */
const MeadowPlate: React.FC<{
  bg: PlateKey;
  phase: number;
  cam?: Cam;
  night?: boolean;
  /**
   * The tree is a silhouette in this shot. Defaults to `night`; Scene 8 sets it
   * by hand, because `meadow_dawn` is a day backdrop with a field in shadow.
   */
  darkTree?: boolean;
  drift?: number;
  flip?: boolean;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ bg, phase, cam, night = false, darkTree, drift, flip, overlay, children }) => {
  const grass = PLATES[bg].grass;
  return (
    <MeadowWorld
      variant={night ? "night" : "day"}
      phase={phase}
      wide={false}
      cam={cam}
      overlay={overlay}
    >
      <Plate bg={bg} phase={phase} drift={drift} flip={flip} />
      <NearField grass={grass} />
      <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.scenery }}>
        <SleepingVolcano
          x={VOLCANO_AT.x}
          base={MEADOW.horizon}
          scale={VOLCANO_AT.scale}
          phase={phase}
        />
        <ActOneTree base={MEADOW.horizon + 22} grass={grass} low={darkTree ?? night} />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.cast }}>{children}</div>
    </MeadowWorld>
  );
};

/**
 * **A close shot on Pip's square inch**: the `grass_close` plate, which is a
 * painted world of its own — grass up both edges, a clean cream top for the
 * bubbles, and a plain open patch of earth across the middle and bottom.
 *
 * There is no horizon in it, which is the sanctioned way to be in this
 * episode without a volcano (`MeadowWorld`'s `wide` note): a close shot on a
 * seed cannot see the far field.
 */
const CloseWorld: React.FC<{
  phase: number;
  cam?: Cam;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ phase, cam, overlay, children }) => (
  <MeadowWorld phase={phase} wide={false} cam={cam} overlay={overlay}>
    <Plate bg="grass_close" phase={phase} drift={4} />
    <div style={{ position: "absolute", inset: 0, zIndex: MEADOW_Z.cast }}>{children}</div>
  </MeadowWorld>
);

/** Where the ground is in a `grass_close` shot: the top face of the mound. */
const CLOSE_GROUND = 740;

/**
 * How big Pip is in a close shot.
 *
 * 2.0 against the wide's 0.72, which is a 2.8× cut — and it has to be: the
 * point of every close in this act is a face doing almost nothing (the lean
 * noticing itself, the deadpan hold, a beam bouncing off her doorstep), and at
 * anything less she is a bean in the middle of a lot of brown.
 */
const CLOSE_SCALE = 2;

/** Pip in a wide. Her mark for the whole act, and the rest of her life. */
const PIP_WIDE = {
  x: MEADOW.pip.x,
  y: stand("pip", MEADOW.ground),
  scale: 0.72,
} as const;

function pipWideMark(extra?: Partial<Mark>): Mark {
  return { ...PIP_WIDE, who: "pip", state: "planted", ...extra };
}

/**
 * Her square inch, drawn — the same small brown spot the cold open landed her
 * on, and it stays SVG for the three reasons STYLE gives: she stands on it,
 * she grows out of it, and Scene 16 makes a joke about it.
 */
const DirtPatch: React.FC<{ x: number; y: number; scale?: number; shade?: number }> = ({
  x,
  y,
  scale = 1,
  shade = 0,
}) => {
  // `shade` mixes her earth toward ink: warm brown is right in daylight and a
  // hot orange spot in the middle of a moonlit field is not. The *shape* never
  // changes — it is the same square inch under every light in the episode.
  const earth = shade > 0 ? mixHex(kidTheme.earth, kidTheme.ink, shade) : kidTheme.earth;
  return (
  <WideLayer>
    <ellipse cx={x} cy={y + 4} rx={104 * scale} ry={26 * scale} fill={earth} />
    <ellipse
      cx={x - 22 * scale}
      cy={y - 2}
      rx={44 * scale}
      ry={12 * scale}
      fill={earth}
      opacity={0.7}
    />
    <ellipse
      cx={x}
      cy={y + 4}
      rx={104 * scale}
      ry={26 * scale}
      fill="none"
      stroke={kidTheme.ink}
      strokeWidth={5}
      opacity={0.45}
    />
  </WideLayer>
  );
};

/**
 * Her mark in a close shot. The `grass_close` plate is already a patch of
 * earth, so drawing the cold open's dirt ellipse on top of it would be two
 * pictures of one thing; what the close needs instead is the *rim* of her
 * square inch — a shade darker than the painted earth, mixed from the plate's
 * own sampled brown, plus the two pebbles that say this is a place rather than
 * a colour.
 */
const CloseMark: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const brown = PLATES.grass_close.grass;
  return (
    <WideLayer>
      <ellipse
        cx={x}
        cy={y + 10}
        rx={300}
        ry={62}
        fill={mixHex(brown, kidTheme.ink, 0.22)}
        opacity={0.5}
      />
      <ellipse cx={x - 336} cy={y + 30} rx={40} ry={16} fill={mixHex(brown, kidTheme.ink, 0.34)} opacity={0.7} />
      <ellipse cx={x + 290} cy={y + 48} rx={30} ry={13} fill={mixHex(brown, kidTheme.ink, 0.34)} opacity={0.7} />
    </WideLayer>
  );
};

/**
 * Sunny's glow — the warm field around him, drawn as a CSS radial gradient
 * rather than an SVG one because an SVG gradient needs a per-instance id and
 * everything in this episode shares one document.
 *
 * He is the only light source in the act that is a *character*, so the glow is
 * his rather than the scene's: it rides his position and his scale.
 */
const SunGlow: React.FC<{ x: number; y: number; r: number; strength?: number }> = ({
  x,
  y,
  r,
  strength = 0.5,
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
 * **The HA! HA!**, drawn identically at every firing.
 *
 * "You're welcome! HA! HA!" is one clip fired five times across the episode
 * and the ledger is explicit that the escalation lives in everyone else, never
 * in his read — so the *picture* must not escalate either. Two firings are in
 * this act (Scenes 6 and 10) and they share this function: a double bounce on
 * the two HAs, same size both times.
 */
function haHaBounce(frame: number, from: number, dur: number): number {
  const u = (frame - from) / Math.max(1, dur);
  if (u < 0 || u > 1) return 0;
  return (
    Math.max(0, settleWave((u - 0.42) / 0.3, 1, 3.2)) +
    Math.max(0, settleWave((u - 0.68) / 0.3, 1, 3.2))
  );
}

// ---------------------------------------------------------------------------
// Scene 5 — Sunrise, and the one non-fan
// ---------------------------------------------------------------------------

/**
 * Sunny at sunrise: **ENORMOUS**, and low enough that coming up is a journey.
 *
 * 1.3 against the 0.85 he sits at for the rest of the act, which is the
 * difference between a sun on the horizon and a sun in the sky and is also the
 * scene's whole opening statement — he is the biggest thing in the frame, at
 * the top of his ego, four episodes in.
 */
const S5_SUNNY = { x: SUNNY_X, cy: 300, scale: 1.3 } as const;

/**
 * The frame the wide gives way to the close.
 *
 * 505 rather than "somewhere in the gap", and the arithmetic is the act's
 * placement rule: `a1_06_sunny`'s last frame is local 497, so its bubble's
 * `until` is 498, and `SpeechBubble` takes seven frames to shrink out — it is
 * not gone until 505. `a1_07` starts at 506. **505 is therefore the only frame
 * this cut can be on.** A cut while a bubble is mid-out does not merely take it
 * off early, it *moves* it, because the two shots place it on two different
 * marks. Every cut in this act is placed the same way: after the last bubble
 * has finished leaving, before the next line starts.
 */
const S5_CUT = 505;

/**
 * The field that bows.
 *
 * Fifteen stems laid across the near field, of which **thirteen are drawn** —
 * the filter takes out the two that fall within 168px of Pip's mark. Each has a
 * flower head and each leans *toward Sunny*; the ones past him lean back the
 * other way, which is what makes the shot a field converging on one point
 * rather than a row of things tipped the same way. The gap in the middle is
 * Pip's, so the one vertical stem in the picture is the hero.
 *
 * Deterministic from the index, never random (Remotion renders frames in a
 * pool of tabs).
 */
const S5_STEMS = Array.from({ length: 15 }, (_, i) => {
  const x = 70 + i * 128 + ((i * 37) % 44);
  // Depth: the row is not a row. A flower further back sits nearer the crest,
  // is drawn smaller, and leans by the same *angle* — which is what makes
  // thirteen of them read as a field rather than as a fence of lollipops.
  const depth = ((i * 29) % 100) / 100;
  return {
    x,
    base: MEADOW.ground + 30 - depth * 78,
    size: 1.15 - depth * 0.46,
    head: i % 3,
    phase: (i * 1.7) % 6.283,
  };
}).filter((s) => Math.abs(s.x - MEADOW.pip.x) > 168);

const S5_HEADS = [
  { petal: "#ffd23c", eye: "#f2921d" },
  { petal: "#ff9ec7", eye: "#ffd23c" },
  { petal: "#fffdf7", eye: "#ffd23c" },
] as const;

/**
 * One flower in the bowing field.
 *
 * `bow` is degrees, signed, already aimed; `alive` is how much of its idle
 * sway is running (zero through the held beat — nothing moves in that
 * picture, and a field still breathing under "Except one." is the show selling
 * the joke).
 *
 * The head is six petals and a centre rather than a dot, and the whole head
 * rotates with the stem: a flower turning to the sun turns its *face*, which
 * is the botany the scene is about and also the only thing that reads at this
 * size. The first pass drew a stroke and a circle and the field came out as a
 * row of dressmaker's pins.
 */
const FieldStem: React.FC<{
  x: number;
  base: number;
  size: number;
  head: number;
  phase: number;
  bow: number;
  alive: number;
  t: number;
  tint: string;
}> = ({ x, base, size, head, phase, bow, alive, t, tint }) => {
  const sway = Math.sin(t * 0.9 + phase) * 2.4 * alive;
  const a = bow + sway;
  const rad = (a * Math.PI) / 180;
  const h = 150 * size;
  const tipX = x + Math.sin(rad) * h;
  const tipY = base - Math.cos(rad) * h;
  const colors = S5_HEADS[head];
  const r = 15 * size;
  return (
    <g>
      <path
        d={`M ${x} ${base} Q ${(x + Math.sin(rad) * h * 0.4).toFixed(1)} ${(base - h * 0.58).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}`}
        stroke={tint}
        strokeWidth={9 * size}
        strokeLinecap="round"
        fill="none"
      />
      {/* One leaf, halfway up, on the outside of the bend. */}
      <ellipse
        cx={x + Math.sin(rad) * h * 0.46 - 17 * size * Math.cos(rad)}
        cy={base - Math.cos(rad) * h * 0.46 - 15 * size * Math.sin(rad)}
        rx={20 * size}
        ry={8 * size}
        fill={tint}
        transform={`rotate(${(a - 26).toFixed(1)} ${(x + Math.sin(rad) * h * 0.46).toFixed(1)} ${(base - Math.cos(rad) * h * 0.46).toFixed(1)})`}
      />
      <g transform={`translate(${tipX.toFixed(1)} ${tipY.toFixed(1)}) rotate(${a.toFixed(1)})`}>
        {Array.from({ length: 6 }, (_, k) => (
          <ellipse
            key={k}
            cx={0}
            cy={-r * 1.12}
            rx={r * 0.52}
            ry={r * 0.92}
            fill={colors.petal}
            stroke={kidTheme.ink}
            strokeWidth={3.4 * size}
            transform={`rotate(${k * 60})`}
          />
        ))}
        <circle cx={0} cy={0} r={r * 0.66} fill={colors.eye} stroke={kidTheme.ink} strokeWidth={3.4 * size} />
      </g>
    </g>
  );
};

const S5_BUBBLES: Record<string, string> = {
  a1_02_sunny: "GOOD MORNING, EVERYBODY!",
  a1_03_sunny: "I invented mornings!",
  a1_06_sunny: "Speechless! They often are.",
  a1_08_pip: "We will discuss that later.",
};

const SunriseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [bowFrom, bowTo] = lineWindow(scene, "a1_04_narrator");
  const [holdFrom, holdTo] = heldBeat(scene, "a1_05_narrator");
  const [leanFrom, leanTo] = lineWindow(scene, "a1_07_narrator");

  // --- the sunrise ---------------------------------------------------------
  // He comes up over the field during the Narrator's first line and is fully
  // up before he opens his mouth. `easeOutCubic` plus a ring-out rather than a
  // plain ease: nothing in this kit stops dead, and a sun that arrives and
  // settles by a couple of pixels is a sun that has *arrived*.
  const rise = kidEase.easeOutCubic((frame - 4) / 68);
  const sunCy =
    interpolate(rise, [0, 1], [900, S5_SUNNY.cy]) +
    settleWave((frame - 72) / 46, 1.2, 4.4) * 9;
  const sunR = 202 * S5_SUNNY.scale;

  // --- the bow -------------------------------------------------------------
  // "Every flower in the field turned to look at him. Every stem leaned." It
  // lands across that line, as a wave from frame left to frame right, and it
  // stays down: they are facing the sun and it is morning.
  const bowAt = bowFrom + (bowTo - bowFrom) * 0.34;
  // Frozen solid through the held beat, and dead still after it — the picture
  // the beat holds is "a field of bowed stems and one vertical seed".
  const alive = frame >= holdFrom && frame < holdTo ? 0 : 0.7;

  // --- the lean, planted ---------------------------------------------------
  // "Pip's stem started to lean all by itself. She put it back." The drift is
  // slow and involuntary and starts on the first clause; the snap is fast and
  // lands on the second. Toward Sunny, which is toward camera-right, which is
  // the whole gag: the direction is not hers.
  const lean = pipLean(frame, [
    { at: leanFrom + 6, to: 11, snapAt: leanFrom + Math.round((leanTo - leanFrom) * 0.72) },
  ]);

  // --- faces ---------------------------------------------------------------
  const sunnyEmotion = useEmotion(
    scene,
    "sunny",
    { a1_02_sunny: "excited", a1_06_sunny: "proud" },
    "proud",
    NO_LEAD,
  );
  // She notices her own stem doing it, and is not impressed by it either.
  const pipEmotion = emotionAt(
    frame,
    [
      // She notices. `skeptical` rather than `grumpy`: the series deadpan is
      // unimpressed and never cross (STYLE), and the joke is her body, not her
      // temper. The eyes going down the stem do the work.
      { at: leanFrom + 30, emotion: "neutral" },
      { at: leanTo + 10, emotion: PIP_RESTING },
    ],
    PIP_RESTING,
  );

  const close = frame >= S5_CUT;
  const pipMark = pipWideMark({ side: "left", offset: 300 });
  const sunnyMark: Mark = {
    x: S5_SUNNY.x,
    y: hover("sunny", sunCy, S5_SUNNY.scale),
    scale: S5_SUNNY.scale,
    who: "sunny",
  };
  const closeMark: Mark = {
    x: MEADOW.pip.x,
    y: stand("pip", CLOSE_GROUND),
    scale: CLOSE_SCALE,
    who: "pip",
    state: "planted",
    side: "right",
    offset: 400,
  };

  if (close) {
    // THE CLOSE HALF. `grass_close`, and the only thing in it is the runner
    // being planted: her stem goes over on its own and she puts it back. At
    // the wide's 0.72 an eleven-degree lean on a 120px seed is a rumour; this
    // is the shot that makes it a gag.
    return (
      <CloseWorld
        phase={4.1}
        overlay={<Bubbles scene={scene} cast={{ pip: closeMark } as Cast} text={S5_BUBBLES} />}
      >
        <CloseMark x={MEADOW.pip.x} y={CLOSE_GROUND} />
        <Pip
          x={closeMark.x}
          y={closeMark.y}
          scale={closeMark.scale}
          state="planted"
          lean={lean}
          phase={PHASE.pip}
          emotion={pipEmotion}
          speaking={stage.speaking("pip")}
          // She looks down her own stem on "We will discuss that later." — the
          // line is addressed to her body, not to the sun.
          look={frame >= leanFrom + 30 ? { x: 0.3, y: 0.85 } : { x: 0.4, y: 0.1 }}
        />
      </CloseWorld>
    );
  }

  return (
    <MeadowPlate
      bg="meadow_sunrise"
      phase={4.1}
      night={false}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ pip: pipMark, sunny: sunnyMark } as Cast}
          text={S5_BUBBLES}
          at={{
            // He is 520px across and his crown is off the top of frame, so his
            // bubbles cannot sit above him. They go into the empty left half,
            // with the tail aimed back at him.
            a1_02_sunny: { x: 610, y: 168, tail: "right", tailAt: S5_SUNNY.x },
            a1_03_sunny: { x: 610, y: 168, tail: "right", tailAt: S5_SUNNY.x },
            a1_06_sunny: { x: 610, y: 168, tail: "right", tailAt: S5_SUNNY.x },
          }}
        />
      }
    >
      <SunGlow x={S5_SUNNY.x} y={sunCy} r={sunR * 3.4} strength={0.44 * rise + 0.06} />
      {/* THE SUNRISE, CLIPPED AT THE HORIZON. He rises from *behind* the far
          field, which he cannot do from the cast layer — the plate's land is
          one opaque image. So the whole of him lives in a box that ends on
          `MEADOW.horizon` while he is coming up, and the painted horizon
          therefore cuts him exactly the way it cuts everything else behind it. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: WIDTH,
          height: MEADOW.horizon,
          overflow: "hidden",
        }}
      >
        <Sunny
          x={S5_SUNNY.x}
          y={hover("sunny", sunCy, S5_SUNNY.scale)}
          scale={S5_SUNNY.scale}
          phase={PHASE.sunny}
          emotion={sunnyEmotion}
          speaking={stage.speaking("sunny")}
          look={
            stage.current === "pip"
              ? lookAt({ x: S5_SUNNY.x, y: sunCy }, centreOf(pipMark))
              : "camera"
          }
        />
      </div>

      <WideLayer>
        {S5_STEMS.map((s, i) => {
          // Each stem starts its bow a little after the one to its left: a
          // wave across the field rather than thirteen things moving at once.
          const delay = (s.x / WIDTH) * 26;
          const u = kidEase.easeInOutSine((frame - bowAt - delay) / 34);
          const toward = Math.sign(S5_SUNNY.x - s.x) || 1;
          return (
            <FieldStem
              key={i}
              x={s.x}
              base={s.base}
              size={s.size}
              head={s.head}
              phase={s.phase}
              bow={toward * 24 * u}
              alive={alive}
              t={t}
              tint={mixHex(PLATES.meadow_sunrise.grass, kidTheme.ink, 0.38)}
            />
          );
        })}
      </WideLayer>

      <DirtPatch x={PIP_WIDE.x} y={MEADOW.ground} />
      <Pip
        x={PIP_WIDE.x}
        y={PIP_WIDE.y}
        scale={PIP_WIDE.scale}
        state="planted"
        lean={0}
        phase={PHASE.pip}
        emotion={pipEmotion}
        speaking={stage.speaking("pip")}
        // Facing exactly where she was already facing. She does not turn to
        // him, in a frame where everything else does — that is the scene.
        look="camera"
        idle={frame >= holdFrom && frame < holdTo ? 0.25 : 1}
        eyeLife={frame >= holdFrom && frame < holdTo ? 0 : 1}
      />
    </MeadowPlate>
  );
};

// ---------------------------------------------------------------------------
// Scene 6 — The order
// ---------------------------------------------------------------------------

/** Sunny for the rest of the act: up, small, and parked on his own side. */
const SUNNY_DAY = { x: SUNNY_X, cy: 320, scale: 0.85 } as const;

function sunnyDayMark(scale: number = SUNNY_DAY.scale): Mark {
  return {
    x: SUNNY_DAY.x,
    y: hover("sunny", SUNNY_DAY.cy, scale),
    scale,
    who: "sunny",
  };
}

/**
 * **The order board.** Three cards, posted over her head, in the order she
 * says them — and the pedagogy is what is *not* on it: dirt. The answer to the
 * cold-open riddle is on screen eleven minutes before anybody says it.
 *
 * The words are drawn in caps because they are print rather than
 * pronunciation (script.md), and they are `SpeechBubble`s rather than a drawn
 * board so they obey the bubble law like everything else: above everything,
 * outside the camera, and they pop rather than fade.
 *
 * **Measured, not split evenly.** `npx remotion ffmpeg -af
 * silencedetect=noise=-32dB:d=0.10` on `a1_10_pip.mp3` (4.536s) puts the four
 * phrase onsets at 0.183 / 1.996 / 2.891 / 3.743s; the three below are the
 * last three as fractions of the clip, so each card lands on its own word
 * however the clip is re-rolled.
 */
const S6_ORDER_AT = [0.44, 0.637, 0.825] as const;
const S6_ORDER = ["LIGHT", "WATER", "AIR"] as const;
/** Where the three cards sit, top to bottom. Read as a list, from her mark up. */
const S6_ORDER_Y = [330, 475, 620] as const;

/**
 * **And where they sit in the close.** Showrunner ruling, B3 repair pass: a
 * posted work order stays posted — it does not come down for a reaction shot
 * and then reappear at the cut-out. The close is a 2.8× lens on the same square
 * inch, so the cards cannot stay stacked over her head (they would be over her
 * face); they move into the empty left third, which the close's own bubbles
 * never use (Pip's are `side: "right"`, offset 420), and they keep their `from`
 * frames, so nothing pops a second time at either boundary.
 */
const S6_ORDER_CLOSE_X = 356;
const S6_ORDER_CLOSE_Y = [268, 413, 558] as const;

/**
 * The two intra-scene cuts, both placed by the act's rule (clear of the last
 * bubble's seven-frame shrink-out, before the next line).
 *
 *   503  `a1_13_sunny`'s bubble is `until` 496 and gone at 503; `a1_14` starts
 *        at 504, so 503 is the only frame the cut-in can be on.
 *   745  inside the 45-frame hold behind `a1_15_pip` (708–752) and deliberately
 *        so: the deadpan is *held* in the close and the wide comes back under
 *        the tail of it, which is what puts the Narrator's button back over the
 *        whole field. Her bubble is long gone (`until` 708, out by 715).
 */
const S6_CUT_IN = 503;
const S6_CUT_OUT = 745;

const S6_BUBBLES: Record<string, string> = {
  a1_09_pip: "Attention, sky. Building site.",
  a1_12_sunny: "Light is MINE!",
  a1_13_sunny: "You're welcome! HA! HA!",
  a1_14_pip: "The delivery service is loud.",
  a1_15_pip: "Sourcing my light independently.",
};

const OrderScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const [orderFrom, orderTo] = lineWindow(scene, "a1_10_pip");
  const [claimFrom] = lineWindow(scene, "a1_12_sunny");
  const [haFrom, haTo] = lineWindow(scene, "a1_13_sunny");
  const [holdFrom, holdTo] = heldBeat(scene, "a1_15_pip");

  // He is in the sky from the first frame of the scene — he is the sun, and a
  // sun that pops in on its own line is a pop-in. What happens on `a1_12` is
  // that he *swells* and turns to camera: the interrupt is a size change on a
  // body that was already there.
  const swell = interpolate(
    frame,
    [claimFrom - 6, claimFrom + 16, haTo + 40],
    [0, 1, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );
  const bounce = haHaBounce(frame, haFrom, haTo - haFrom);
  const sunnyScale = SUNNY_DAY.scale * (1 + 0.14 * swell + 0.05 * bounce);

  const sunnyEmotion = useEmotion(
    scene,
    "sunny",
    { a1_12_sunny: "excited", a1_13_sunny: "proud" },
    "proud",
    NO_LEAD,
  );
  const pipEmotion = useEmotion(
    scene,
    "pip",
    // Nothing mapped but her own resting face: `skeptical` is the series
    // deadpan (STYLE) and every line she has in this scene is one. A softer
    // face under "The delivery service is loud." plays the line as cheerful,
    // which is the one reading it does not have.
    { a1_09_pip: PIP_RESTING },
    PIP_RESTING,
    NO_LEAD,
  );

  const sunnyMark = sunnyDayMark(sunnyScale);
  const pipMark = pipWideMark({ side: "left", offset: 360 });
  const closeMark: Mark = {
    x: MEADOW.pip.x,
    y: stand("pip", CLOSE_GROUND),
    scale: CLOSE_SCALE,
    who: "pip",
    state: "planted",
    side: "right",
    offset: 420,
  };
  const close = frame >= S6_CUT_IN && frame < S6_CUT_OUT;

  // The order board. Mounted for the whole scene — in BOTH setups — and
  // windowed by `from`, the same shape `Bubbles` uses: a `.filter()` on the
  // current frame would change how many `SpeechBubble`s exist between one frame
  // and the next, and `SpeechBubble` calls hooks. The `from` frames are
  // identical in the two framings, so a card that is already up at the cut is
  // still up, mid-life, on the other side of it.
  const orderLen = Math.max(1, orderTo - orderFrom);
  const board = (
    x: number,
    ys: readonly number[],
    tailAt: number,
    // Which flank the bottom card's tail leaves from: it has to face her. In
    // the wide the cards sit directly over her mark, so "left" reads as
    // straight down; in the close they sit in the empty LEFT third and she is
    // to their right — a "left" tail there aimed at nothing (showrunner
    // still-review find, f3900).
    tailSide: "left" | "right",
  ): React.ReactNode => (
    <>
      {S6_ORDER.map((word, i) => (
        <SpeechBubble
          key={word}
          x={x}
          y={ys[i]}
          text={word}
          tail={i === S6_ORDER.length - 1 ? tailSide : "none"}
          tailAt={tailAt}
          from={orderFrom + Math.round(S6_ORDER_AT[i] * orderLen)}
          zIndex={44}
        />
      ))}
    </>
  );

  if (close) {
    // THE DEADPAN HALF. Her two flattest lines and the 45-frame hold behind
    // them, at a size where a face that does nothing is doing something.
    return (
      <CloseWorld
        phase={5.3}
        overlay={
          <>
            <Bubbles scene={scene} cast={{ pip: closeMark } as Cast} text={S6_BUBBLES} />
            {/* THE ORDER STAYS POSTED. Left third, clear of her face and of her
                own bubbles, tail on the bottom card aimed back at her mark. */}
            {board(S6_ORDER_CLOSE_X, S6_ORDER_CLOSE_Y, MEADOW.pip.x, "right")}
          </>
        }
      >
        <CloseMark x={MEADOW.pip.x} y={CLOSE_GROUND} />
        <Pip
          x={closeMark.x}
          y={closeMark.y}
          scale={closeMark.scale}
          state="planted"
          phase={PHASE.pip}
          emotion={pipEmotion}
          speaking={stage.speaking("pip")}
          look={{ x: 0.15, y: -0.1 }}
          // Nothing enters the hold. She has said the sentence the whole
          // episode is now about and she is not going to sell it.
          idle={frame >= holdFrom && frame < holdTo ? 0.3 : 1}
          eyeLife={frame >= holdFrom && frame < holdTo ? 0 : 1}
        />
      </CloseWorld>
    );
  }

  return (
    <MeadowPlate
      bg="meadow_day"
      phase={5.3}
      overlay={
        <>
          <Bubbles
            scene={scene}
            cast={{ pip: pipMark, sunny: sunnyMark } as Cast}
            text={S6_BUBBLES}
            at={{
              // High and hard left: the order board owns the middle of this
              // frame for the whole scene, and the board is drawn above the
              // bubbles (`zIndex` 44), so a bubble that shares a corner with it
              // loses its own tail behind a card.
              a1_12_sunny: { x: 520, y: 162, tail: "right", tailAt: SUNNY_DAY.x },
              a1_13_sunny: { x: 520, y: 162, tail: "right", tailAt: SUNNY_DAY.x },
            }}
          />
          {board(MEADOW.pip.x, S6_ORDER_Y, MEADOW.pip.x, "left")}
        </>
      }
    >
      <SunGlow
        x={SUNNY_DAY.x}
        y={SUNNY_DAY.cy}
        r={202 * sunnyScale * 3}
        strength={0.3 + 0.16 * swell}
      />
      <Sunny
        x={sunnyMark.x}
        y={sunnyMark.y}
        scale={sunnyScale}
        phase={PHASE.sunny}
        emotion={sunnyEmotion}
        speaking={stage.speaking("sunny")}
        look={frame >= claimFrom ? "camera" : lookAt({ x: SUNNY_DAY.x, y: SUNNY_DAY.cy }, centreOf(pipMark))}
      />
      <DirtPatch x={PIP_WIDE.x} y={MEADOW.ground} />
      <Pip
        x={PIP_WIDE.x}
        y={PIP_WIDE.y}
        scale={PIP_WIDE.scale}
        state="planted"
        phase={PHASE.pip}
        emotion={pipEmotion}
        speaking={stage.speaking("pip")}
        // She is shouting at the sky, so she is looking at it — up, and not at
        // the one bit of it that answers until it has answered.
        look={
          frame >= claimFrom
            ? lookAt(centreOf(pipMark), { x: SUNNY_DAY.x, y: SUNNY_DAY.cy })
            : { x: 0.1, y: -0.9 }
        }
      />
    </MeadowPlate>
  );
};

// ---------------------------------------------------------------------------
// Scene 7 — The moonlight workaround
// ---------------------------------------------------------------------------

/**
 * **The moon, and it is SVG.** The night plate was prompted with moonglow and
 * deliberately no disc, because this is the thing Ray arrives down and the
 * beam's geometry has to line up with it — a painted moon and a drawn beam
 * would miss each other by however much the painting felt like.
 *
 * Frame left, high, and clear of the volcano's summit: the *right* of frame is
 * Sunny's, in this act and this episode, and the moon is not allowed to
 * confuse the two.
 */
const S7_MOON = { x: 520, y: 250, r: 86 } as const;

/**
 * **The stoop**, in degrees. Every arrival in this episode stoops DOWN to
 * Pip's mark and she never rises to meet one — and for a body with no arms
 * the stoop *is* the ribbon, tipped so the end nearest her is the low one.
 *
 * `bank` is an SVG `rotate`, so positive is CLOCKWISE and dips the ribbon's
 * frame-RIGHT end (verified on stills: `s08_ray_6390.png` at +11 and
 * `cut_s10_end_9655.png` at +12 both drop the right-hand end). Ray stands at
 * x=560 and Pip is at 812, so +11 is the number for the whole of this act — he
 * is on her left and the low end is the one nearest her. **The sign is which
 * side of the mark he is standing on, not a constant**; act 2's Ray stands on
 * her right and uses −11.
 */
const RAY_STOOP = 11;

/**
 * **The travelling bank, clamped — a lean into the path, never a tumble.**
 *
 * Act 2's construction (`act2.tsx`'s `BANK_CLAMP`/`travelBank`, installed for
 * W-A2-09/W-A2-11), brought back here so both acts land an arrival the same
 * way. Act 1 keeps its own factor (0.22, a flatter lean than act 2's 0.4) and
 * its own timing; what it did not have was the *blend*: the raw tangent reaches
 * +23.6° at the end of the moonbeam while the stoop on the landing frame is
 * only +6.5°, so `landed ? stoop : tangent` rotated the whole ribbon 17° in one
 * frame. The bank now eases out of the tangent and into the stoop over the last
 * fifth of the path, and the landing frame is just another frame on that curve.
 */
const BANK_CLAMP = 30;

function travelBank(angle: number): number {
  return Math.max(-BANK_CLAMP, Math.min(BANK_CLAMP, angle * 0.22));
}

/** Ray's mark for the rest of the act. He takes the job and does not leave. */
const S7_RAY = { x: 560, cy: 800, scale: 0.8 } as const;

/** How far behind the body the Cheshire grin arrives. Nine frames, once. */
const RAY_FACE_LAG = 9;

function rayMark(
  x: number = S7_RAY.x,
  cy: number = S7_RAY.cy,
  scale: number = S7_RAY.scale,
): Mark {
  return { x, y: hover("ray", cy, scale), scale, who: "ray" };
}

const S7_BUBBLES: Record<string, string> = {
  a1_18_pip: "Night shift. No commentary.",
  a1_20_ray: "Look up. That's me.",
  a1_22_pip: "You work nights?",
  a1_23_ray: "Full disclosure.",
  a1_24_ray: "Moonlight is his light. Bounced.",
  a1_25_pip: "So the moon is a mirror.",
  a1_26_ray: "That is also true.",
  a1_28_pip: "That makes you freelance.",
  a1_29_ray: "That is not how light works.",
  a1_30_pip: "You are hired.",
  a1_31_pip: "It will do.",
  a1_32_ray: "It is second-hand light.",
  a1_33_pip: "Quiet light is worth more.",
};

/**
 * The moonbeam: the moon's disc, opened out into a shaft that lands on Pip's
 * square inch.
 *
 * Drawn from the moon's own numbers rather than from a guess, so moving the
 * moon moves the beam — the two are one object with a long thin bottom.
 */
const MoonBeam: React.FC<{ strength: number }> = ({ strength }) => {
  const topL = S7_MOON.x - S7_MOON.r * 0.72;
  const topR = S7_MOON.x + S7_MOON.r * 0.72;
  const footL = MEADOW.pip.x - 168;
  const footR = MEADOW.pip.x + 208;
  return (
    <WideLayer opacity={strength}>
      <path
        d={`M ${topL} ${S7_MOON.y + 30} L ${topR} ${S7_MOON.y + 30} L ${footR} ${MEADOW.ground} L ${footL} ${MEADOW.ground} Z`}
        fill="#dbeafe"
        opacity={0.14}
      />
      <path
        d={`M ${S7_MOON.x - 26} ${S7_MOON.y + 30} L ${S7_MOON.x + 26} ${S7_MOON.y + 30} L ${MEADOW.pip.x + 92} ${MEADOW.ground} L ${MEADOW.pip.x - 62} ${MEADOW.ground} Z`}
        fill="#eef5ff"
        opacity={0.12}
      />
      {/* The pool: her spot, lit pale silver. */}
      <ellipse cx={MEADOW.pip.x + 14} cy={MEADOW.ground + 6} rx={214} ry={46} fill="#dbeafe" opacity={0.17} />
    </WideLayer>
  );
};

const Moon: React.FC<{ glow: number }> = ({ glow }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          `radial-gradient(circle ${S7_MOON.r * 4.2}px at ${S7_MOON.x}px ${S7_MOON.y}px,` +
          ` rgba(226,240,255,${0.2 + 0.1 * glow}) 0%,` +
          ` rgba(200,225,255,${0.08 + 0.06 * glow}) 36%,` +
          ` rgba(200,225,255,0) 72%)`,
      }}
    />
    <WideLayer>
      <circle cx={S7_MOON.x} cy={S7_MOON.y} r={S7_MOON.r} fill="#f4f7ec" />
      <circle cx={S7_MOON.x} cy={S7_MOON.y} r={S7_MOON.r} fill="#e6eef8" opacity={0.55} />
      {/* Three craters, well off the rim so the disc keeps its silhouette. */}
      <circle cx={S7_MOON.x - 24} cy={S7_MOON.y - 18} r={18} fill="#d7e2ef" opacity={0.8} />
      <circle cx={S7_MOON.x + 22} cy={S7_MOON.y + 14} r={13} fill="#d7e2ef" opacity={0.8} />
      <circle cx={S7_MOON.x - 6} cy={S7_MOON.y + 34} r={9} fill="#d7e2ef" opacity={0.8} />
    </WideLayer>
  </>
);

const MoonlightScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const [arriveFrom, arriveTo] = lineWindow(scene, "a1_19_narrator");
  const [pointFrom, pointTo] = lineWindow(scene, "a1_20_ray");
  const [discFrom] = lineWindow(scene, "a1_23_ray");
  const [discHoldFrom, discHoldTo] = heldBeat(scene, "a1_24_ray");
  const [winFrom, winTo] = lineWindow(scene, "a1_27_narrator");
  const [stampHoldFrom, stampHoldTo] = heldBeat(scene, "a1_31_pip");
  const [quietFrom, quietTo] = lineWindow(scene, "a1_33_pip");

  // --- the arrival ---------------------------------------------------------
  // "And a light arrived anyway. A quiet one." He comes DOWN the moonbeam and
  // stoops to her mark; she never rises. He is a fade-up out of the moon's own
  // light rather than a body walking on — he *is* the moonlight, and the beam
  // was already there.
  const landAt = arriveFrom + Math.round((arriveTo - arriveFrom) * 0.92);
  const rayU = (frame - arriveFrom - 6) / Math.max(1, landAt - arriveFrom - 6);
  const travel = moveAlong(
    { x: S7_MOON.x + 40, y: S7_MOON.y + 120 },
    { x: S7_RAY.x, y: S7_RAY.cy },
    rayU,
    { arc: 0.1, ease: kidEase.easeInOutSine },
  );
  const rayIn = interpolate(frame, [arriveFrom + 4, arriveFrom + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const landed = frame >= landAt;
  // THE STOOP. Once he is on her mark his ribbon bends down toward it — a
  // beam bending its whole length to reach a seed, which is the staging note
  // every arrival in this episode gets. See `RAY_STOOP` for the sign.
  const stoop = interpolate(frame, [landAt - 20, landAt + 14], [0, RAY_STOOP], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  // ...and the bank that gets him there. The clamped tangent while he is
  // travelling, easing into the stoop over the last fifth of the beam, so the
  // ribbon arrives already tipped the way it will stay. `rayU` clamps at 1, so
  // every frame from the landing onward is pure `stoop` — the old
  // `landed ? stoop : tangent` behaviour, without the 17° cut on `landAt`.
  const rayBank =
    travelBank(travel.angle) +
    (stoop - travelBank(travel.angle)) *
      interpolate(rayU, [0.8, 1], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: kidEase.easeInOutSine,
      });

  // --- the camera ----------------------------------------------------------
  // One slow push, on his disclosure, parked well before the beat it leads
  // into. A camera still moving inside a held beat is exactly the leak the
  // script's rule forbids.
  // 1.16, and the ceiling is the moon: bubbles and characters are safe at
  // anything, but the disc is 86px from the top of frame and the push moves it
  // *up*. At 1.2 with the moon at y=250 the top of it leaves the frame, which
  // is the one thing a scene whose catch-phrase is "Look up" cannot do.
  const zoom = interpolate(frame, [discFrom, discHoldFrom - 24], [1, 1.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const cam: Cam = { x: 860, y: 780, zoom };

  // --- somewhere under the horizon -----------------------------------------
  // "…fast asleep, Sunny was winning." A warm bloom sitting on the horizon on
  // *his* side of frame, with no disc in it: he is under there, and even
  // unconscious he owns the light this scene runs on.
  const asleep = interpolate(
    frame,
    [winFrom, winFrom + 26, winTo - 10, winTo + 26],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );

  // --- the lean, wordless --------------------------------------------------
  // "As she says 'quiet light,' her stem drifts toward the horizon where Sunny
  // set. Snap back. Nobody comments." Toward camera-right, which is his side
  // of frame in every scene of this act.
  const lean = pipLean(frame, [
    { at: quietFrom + 8, to: 12, snapAt: quietTo - 4 },
  ]);

  const held =
    (frame >= discHoldFrom && frame < discHoldTo) ||
    (frame >= stampHoldFrom && frame < stampHoldTo);

  const pipEmotion = useEmotion(
    scene,
    "pip",
    // No `amazed` on `a1_25`: `useEmotion` holds a face until that body's next
    // mapped line, so a dropped jaw on "So the moon is a mirror." would still
    // be hanging open four seconds later under the Narrator. The realisation
    // is in the sentence; her face files it.
    { a1_18_pip: PIP_RESTING, a1_28_pip: PIP_RESTING },
    PIP_RESTING,
    NO_LEAD,
  );
  // He hates every second of where his own compulsory honesty points, and the
  // upset is in his stillness rather than in his face — so the face goes flat
  // and stays flat from the disclosure to the end of "That is also true."
  const rayEmotion = useEmotion(
    scene,
    "ray",
    { a1_20_ray: "happy", a1_23_ray: "neutral", a1_29_ray: "neutral", a1_32_ray: "sad" },
    "happy",
    NO_LEAD,
  );
  // **"His Cheshire face catches up a beat late, as ever."** (script.md, Scene
  // 7's Visual.) A written stage direction, staged once, on the arrival, where
  // it belongs: the ribbon lands on her mark with a flat face and the grin
  // turns up nine frames afterwards, morphing rather than cutting. It is over
  // before his first line, so the rest of the scene is `rayEmotion`'s.
  const rayFace =
    frame < pointFrom
      ? emotionAt(frame, [{ at: landAt + RAY_FACE_LAG, emotion: "happy" }], "neutral")
      : rayEmotion;

  const pipMark = pipWideMark({ side: "right", offset: 340 });
  const ray = landed ? rayMark() : rayMark(travel.x, travel.y);

  return (
    <MeadowPlate
      bg="meadow_night"
      phase={6.7}
      night
      cam={cam}
      drift={4}
      overlay={
        // **Projected marks, because this scene has a camera in it.** Bubbles
        // live outside the camera (a zoomed bubble is unreadable), so a bubble
        // placed on a world mark drifts off its speaker the moment the push
        // starts. `projectMark` is the kit's answer and it carries Pip's
        // growth state through, so the bubble still clears the crown she
        // actually has. It also keeps both of them off the two things this
        // frame is not allowed to cover: the volcano and the moon.
        <Bubbles
          scene={scene}
          cast={{ pip: projectMark(cam, pipMark), ray: projectMark(cam, ray) } as Cast}
          text={S7_BUBBLES}
        />
      }
    >
      {/* The warm bloom of a sun that is not on stage and is winning anyway. */}
      {asleep > 0.01 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              `radial-gradient(ellipse 620px 190px at ${SUNNY_X + 120}px ${MEADOW.horizon + 6}px,` +
              ` rgba(255,186,92,${0.28 * asleep}) 0%, rgba(255,170,80,${0.11 * asleep}) 44%,` +
              ` rgba(255,170,80,0) 78%)`,
          }}
        />
      ) : null}

      <Moon glow={interpolate(frame, [pointFrom, pointFrom + 20, pointTo], [0, 1, 0.5], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })} />
      <MoonBeam strength={interpolate(frame, [arriveFrom - 30, arriveFrom + 20], [0.55, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })} />

      <DirtPatch x={PIP_WIDE.x} y={MEADOW.ground} shade={0.5} />
      <Pip
        x={PIP_WIDE.x}
        y={PIP_WIDE.y}
        scale={PIP_WIDE.scale}
        state="planted"
        lean={lean}
        phase={PHASE.pip}
        emotion={pipEmotion}
        speaking={stage.speaking("pip")}
        look={
          frame >= pointFrom && frame < pointTo + 30
            ? // "Look up. That's me." — a line a child can obey and be right.
              { x: -0.5, y: -0.95 }
            : lookAt(centreOf(pipMark), centreOf(ray))
        }
        idle={held ? 0.3 : 1}
        eyeLife={held ? 0 : 1}
      />

      {rayIn > 0.01 ? (
        <Ray
          x={ray.x}
          y={ray.y}
          scale={S7_RAY.scale}
          brightness={RAY_LIGHT}
          bank={rayBank}
          streak={landed ? 0.22 : 0.6}
          opacity={rayIn}
          phase={PHASE.ray}
          emotion={rayFace}
          speaking={stage.speaking("ray")}
          look={
            frame >= pointFrom && frame < pointTo + 20
              ? { x: -0.4, y: -0.9 }
              : lookAt(centreOf(ray), centreOf(pipMark))
          }
          idle={held ? 0.12 : 1}
          eyeLife={held ? 0 : 1}
          zIndex={12}
        />
      ) : null}
    </MeadowPlate>
  );
};

// ---------------------------------------------------------------------------
// Scene 8 — First, at dawn (Blue cameo + Violet garnish)
// ---------------------------------------------------------------------------

/**
 * **Blue's corridor.** Centred just off Pip so that his ricochet keeps
 * crossing her square inch, and 840×310 so a leg is 140–260px: a pinball in a
 * small box changes direction just as often and covers less ground, which is
 * the law (`blueRicochet`), and the corridor has to stay clear of the horizon
 * band and off Ray's mark.
 */
const S8_BOX: Box = { x: 660, y: 640, w: 840, h: 310 };

/**
 * **The seed is chosen, not arbitrary — it is what makes "Sorry, fence!" true.**
 *
 * Blue apologises to the things he hits (Bible law), and the corridor's right
 * wall (x = 1500) runs straight through the drawn fence (posts at 1444 / 1508 /
 * 1572, x 1424–1592, y 784–908). A wall bounce there IS a fence hit — but
 * nothing forces one to land inside the line, and the first build left it to
 * chance, so for the whole of `a1_37` he apologised to a fence he was nowhere
 * near.
 *
 * `blueRicochet` is a pure function of (frame, box, seed) and its corners land
 * on multiples of `BLUE_LEG` (9), so the seed is a search: 1269 is the value
 * whose 29th corner is at **(1499.9, 840.5) on local frame 447** — hard against
 * the right wall, between the fence's two rails, on the middle post. The clip's
 * measured phrase onsets (`silencedetect`, `a1_37_blue.mp3`) put "Sorry," at
 * local 453 and "fence!" at 464, so he hits it six frames before he says sorry
 * to it, which is the order those two things have to happen in.
 *
 * If the box, `loopAt` or `BLUE_LEG` ever move, this number has to be searched
 * again — `scratchpad/ep4b3_repair12/seed2.mjs` is the search.
 */
const S8_SEED = 1269;

/** He is on screen four frames before he opens his mouth. Bible law. */
const S8_APPROACH_GAP = 4;

/** Where all three of Blue's bubbles are pinned. See the `at` map below. */
const S8_BUBBLE = { x: 620, y: 264 } as const;

const S8_BUBBLES: Record<string, string> = {
  // Drawn caps the clip does not carry — deliberate, and script.md marks it.
  a1_35_blue: "I am FIRST!",
  a1_36_ray: "I arrived last night.",
  a1_37_blue: "Today counts! Sorry, fence!",
  a1_38_pip: "I live here.",
  a1_39_blue: "First to leave!",
};

/** The fence he ricochets off, and apologises to. */
const Fence: React.FC = () => (
  <WideLayer>
    {[1444, 1508, 1572].map((x) => (
      <rect key={x} x={x - 11} y={784} width={22} height={124} rx={9} fill="#b98d5e" stroke={kidTheme.ink} strokeWidth={5} />
    ))}
    {[812, 852].map((y) => (
      <rect key={y} x={1424} y={y} width={168} height={15} rx={7} fill="#cba071" stroke={kidTheme.ink} strokeWidth={5} />
    ))}
  </WideLayer>
);

const DawnFirstScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const [blueFrom] = lineWindow(scene, "a1_35_blue");
  const [holdFrom, holdTo] = heldBeat(scene, "a1_38_pip");
  const [, leaveTo] = lineWindow(scene, "a1_39_blue");

  // --- Blue, arriving the way Blue arrives everywhere ----------------------
  // Three legs: in from frame right, off the dandelion he is about to
  // apologise to, and into the corridor. The two arrival legs are 750px and
  // 190px — well inside his hard rule (never more than half a frame without a
  // change of direction) — and the exit is longer and bowed hard instead, so
  // there is no frame of this scene in which he is travelling straight. He is
  // on screen four frames before his line, which is his approach gap, and the
  // hit lands on that frame.
  const hitAt = blueFrom - S8_APPROACH_GAP;
  const enterAt = hitAt - 26;
  const loopAt = hitAt + 12;
  const exitAt = leaveTo + 4;
  // The ricochet clock stops dead through the held beat — "Blue freezes
  // mid-ricochet for the whole beat, recalculating" — and resumes where it
  // stopped, so the freeze costs him no distance.
  const clock =
    frame < holdFrom ? frame : frame < holdTo ? holdFrom : frame - (holdTo - holdFrom);
  const ric = blueRicochet(clock - loopAt, S8_BOX, S8_SEED);
  const hitPoint = { x: MEADOW.pip.x + 132, y: 806 };
  const inLeg = moveAlong({ x: 1700, y: 690 }, hitPoint, (frame - enterAt) / 26, {
    arc: 0.06,
    ease: kidEase.linear,
  });
  const bounceLeg = moveAlong(hitPoint, { x: ric.x, y: ric.y }, (frame - hitAt) / 12, {
    arc: 0.18,
    ease: kidEase.linear,
  });
  // The exit leaves from where the ricochet HAD got to at `exitAt`, sampled
  // once — using the live `ric` as the origin blends two motions and drags him
  // out of frame wobbling, because that origin is still ricocheting while the
  // lerp runs. The clock is the frozen one, so the sample is a constant.
  const ricAtExit = blueRicochet(exitAt - (holdTo - holdFrom) - loopAt, S8_BOX, S8_SEED);
  // Out the way he came in, frame right — away from Pip, away from Ray, away
  // from the one corner of frame Violet is standing in — and on a hard arc
  // rather than a straight line, because a Blue who travels a frame and a half
  // dead straight is not Blue.
  const exitTo = { x: 2260, y: 660 };
  const exitPath = (u: number): { x: number; y: number; angle: number } =>
    moveAlong({ x: ricAtExit.x, y: ricAtExit.y }, exitTo, u, {
      arc: 0.3,
      ease: kidEase.easeInQuad,
    });
  const exitLeg = exitPath((frame - exitAt) / 46);
  // His blur has to come off the path he is ON. `blueTrail` samples the
  // *ricochet*, so during the exit it draws a smear hanging in the corridor he
  // has already left.
  const exitTrail = Array.from({ length: 9 }, (_, k) => {
    const p = exitPath((frame - exitAt - (8 - k) * 2) / 46);
    return { x: p.x, y: p.y };
  });
  const blue =
    frame < hitAt ? inLeg : frame < loopAt ? bounceLeg : frame < exitAt ? ric : exitLeg;
  const blueOn = frame >= enterAt && frame < exitAt + 46;
  const frozen = frame >= holdFrom && frame < holdTo;

  // --- Pip, hit ------------------------------------------------------------
  // He has hit the dandelion he is apologising to. She takes it in the stem:
  // a fast knock away from the impact, a tremble, and back. It is the only
  // thing in four episodes that has ever moved her, and it moved her nine
  // degrees for a third of a second.
  const lean = pipLean(frame, [
    { at: hitAt, to: -9, snapAt: hitAt + 9, drift: 3, snap: 8 },
  ]);
  const tremble = interpolate(frame, [hitAt, hitAt + 3, hitAt + 22], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pipEmotion = useEmotion(
    scene,
    "pip",
    { a1_38_pip: PIP_RESTING },
    PIP_RESTING,
    NO_LEAD,
  );
  const blueEmotion = useEmotion(scene, "blue", { a1_35_blue: "excited" }, "happy", NO_LEAD);

  const pipMark = pipWideMark({ side: "left", offset: 330 });
  const ray = rayMark();
  const blueMark: Mark = { x: blue.x, y: blue.y, scale: 0.7, who: "shard" };

  return (
    <MeadowPlate
      bg="meadow_dawn"
      phase={8.2}
      flip
      // Dawn: bright sky, field still in shadow. The tree reads as a
      // silhouette in front of the first gold, which is what it is.
      darkTree
      overlay={
        <Bubbles
          scene={scene}
          cast={{ pip: pipMark, ray, blue: blueMark } as Cast}
          text={S8_BUBBLES}
          at={{
            // His bubbles are pinned rather than parked on his mark: he is a
            // body that moves three hundred pixels inside his own line, and a
            // bubble following him is a bubble nobody can read. The tail
            // tracks him instead.
            //
            // Frame LEFT and high, which is not where he is and is the point:
            // his corridor runs 660–1500 and he enters and leaves off frame
            // right, so a bubble parked left of all of it can keep ONE tail
            // direction for the whole scene. Pinned at 1240 the tail flipped
            // sides six times inside "Sorry, fence!" alone, and pointed away
            // from him on the frame he actually hits the fence.
            a1_35_blue: { ...S8_BUBBLE, tail: "right", tailAt: blue.x },
            a1_37_blue: { ...S8_BUBBLE, tail: "right", tailAt: blue.x },
            a1_39_blue: { ...S8_BUBBLE, tail: "right", tailAt: blue.x },
          }}
        />
      }
    >
      {/* Dawn on Sunny's side of frame: first gold at the horizon, and no disc
          in it. He is not on stage in this scene and he is still the reason
          the light showed up. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            `radial-gradient(ellipse 760px 260px at ${SUNNY_X + 180}px ${MEADOW.horizon - 10}px,` +
            ` rgba(255,196,104,0.3) 0%, rgba(255,180,90,0.11) 46%, rgba(255,180,90,0) 78%)`,
        }}
      />

      <Fence />
      <WideLayer>
        <ellipse cx={700} cy={952} rx={58} ry={38} fill="#8c95a1" stroke={kidTheme.ink} strokeWidth={5} />
        <ellipse cx={686} cy={938} rx={24} ry={13} fill="#a9b2bd" opacity={0.8} />
      </WideLayer>

      {/* VIOLET. Far frame edge, vibrating in place, inspected by no one,
          greeted by no one, and gone before the scene ends. He has no line, no
          reaction and no cost — and nobody in the frame ever looks at him,
          which is the whole of the gag and is enforced by every `look` in this
          scene aiming somewhere else. */}
      <Shard
        who="violet"
        x={interpolate(frame, [700, 746], [112, -190], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: kidEase.easeInBack,
        })}
        y={744}
        scale={0.62}
        look="right"
        zIndex={11}
      />

      <DirtPatch x={PIP_WIDE.x} y={MEADOW.ground} shade={0.3} />
      <Pip
        x={PIP_WIDE.x}
        y={PIP_WIDE.y}
        scale={PIP_WIDE.scale}
        state="planted"
        lean={lean}
        tremble={tremble}
        phase={PHASE.pip}
        emotion={pipEmotion}
        speaking={stage.speaking("pip")}
        look={blueOn && !frozen ? lookAt(centreOf(pipMark), { x: blue.x, y: blue.y }) : "camera"}
        idle={frozen ? 0.3 : 1}
        eyeLife={frozen ? 0 : 1}
      />

      <Ray
        x={ray.x}
        y={ray.y}
        scale={S7_RAY.scale}
        brightness={RAY_LIGHT}
        bank={RAY_STOOP}
        streak={0.22}
        phase={PHASE.ray}
        emotion="neutral"
        speaking={stage.speaking("ray")}
        look={blueOn && !frozen ? lookAt(centreOf(ray), { x: blue.x, y: blue.y }) : "right"}
        idle={frozen ? 0.3 : 1}
        eyeLife={frozen ? 0 : 1}
        zIndex={12}
      />

      {blueOn ? (
        <Shard
          who="blue"
          x={blue.x}
          y={blue.y}
          scale={0.7}
          heading={blue.angle}
          trail={
            frozen
              ? undefined
              : frame >= exitAt
                ? exitTrail
                : blueTrail(clock - loopAt, S8_BOX, S8_SEED)
          }
          emotion={blueEmotion}
          speaking={stage.speaking("blue")}
          look={frozen ? "down" : lookAt({ x: blue.x, y: blue.y }, centreOf(pipMark))}
          idle={frozen ? 0 : undefined}
          eyeLife={frozen ? 0.2 : 1}
          zIndex={16}
        />
      ) : null}
    </MeadowPlate>
  );
};

// ---------------------------------------------------------------------------
// Scene 9 — Not open for business
// ---------------------------------------------------------------------------

/**
 * Every beam Ray sends, by index — the schedule is a pure function so a beam
 * is never half-drawn across a cut. `at` is the frame it leaves him; it lands
 * eighteen frames later and the glitter of nothing dies twenty-four after that.
 */
const S9_BEAMS = [40, 250, 360, 470, 580, 690, 800, 910, 1020, 1130, 1240] as const;
const BEAM_FALL = 18;
const BEAM_GLITTER = 26;

/**
 * One delivery: a beam falling to Pip's square inch, hitting bare dirt, and
 * bouncing off in a little glitter of nothing.
 *
 * The glitter is eight sparks on eight different arcs, all of them leaving the
 * ground — light that arrived, found nothing to catch it, and left. It is the
 * pedagogy of the scene as a picture: light cannot be stockpiled, and there is
 * no green catcher here yet.
 */
const Delivery: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  age: number;
  scale?: number;
}> = ({ from, to, age, scale = 1 }) => {
  if (age < 0 || age > BEAM_FALL + BEAM_GLITTER) return null;
  const fall = Math.min(1, age / BEAM_FALL);
  const glit = Math.max(0, (age - BEAM_FALL) / BEAM_GLITTER);
  const e = kidEase.easeInQuad(fall);
  const head = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
  // The shaft is drawn from where it started to where its head is — a beam
  // arriving, not a dash travelling. Two strokes: a soft gold body and a hot
  // white core, which is the only way a light-coloured thing reads over a
  // sunlit field.
  const shaft = Math.max(0, 1 - glit * 3.2);
  return (
    <WideLayer>
      {shaft > 0.02 ? (
        <>
          <path
            d={`M ${from.x} ${from.y} L ${head.x.toFixed(1)} ${head.y.toFixed(1)}`}
            stroke={kidTheme.sunDark}
            strokeWidth={18 * scale}
            strokeLinecap="round"
            opacity={0.32 * shaft}
          />
          <path
            d={`M ${from.x} ${from.y} L ${head.x.toFixed(1)} ${head.y.toFixed(1)}`}
            stroke={kidTheme.sunLight}
            strokeWidth={9 * scale}
            strokeLinecap="round"
            opacity={0.9 * shaft}
          />
          <path
            d={`M ${from.x} ${from.y} L ${head.x.toFixed(1)} ${head.y.toFixed(1)}`}
            stroke={kidTheme.paper}
            strokeWidth={3.5 * scale}
            strokeLinecap="round"
            opacity={0.95 * shaft}
          />
        </>
      ) : null}
      {/* The impact: a flat flash on the dirt, gone in eight frames. It is the
          only moment the light is *on* her square inch, and it is the point of
          the scene that it does not stay there. */}
      {glit > 0 && glit < 0.5 ? (
        <ellipse
          cx={to.x}
          cy={to.y}
          rx={(48 + 90 * glit * 2) * scale}
          ry={(14 + 24 * glit * 2) * scale}
          fill={kidTheme.sunLight}
          opacity={0.55 * (1 - glit * 2)}
        />
      ) : null}
      {glit > 0 && glit < 1
        ? Array.from({ length: 8 }, (_, i) => {
            const a = (-152 + i * 32) * (Math.PI / 180);
            const d = (86 + ((i * 37) % 56)) * scale * kidEase.easeOutCubic(glit);
            return (
              <circle
                key={i}
                cx={to.x + Math.cos(a) * d}
                cy={to.y + Math.sin(a) * d * 0.78 - 16 * glit * scale}
                r={(9 - 4 * glit) * scale}
                fill={kidTheme.sun}
                stroke={kidTheme.sunDeep}
                strokeWidth={2.6 * scale}
                opacity={0.95 * (1 - glit)}
              />
            );
          })
        : null}
    </WideLayer>
  );
};

const S9_BUBBLES: Record<string, string> = {
  a1_42_ray: "Nothing is catching it.",
  a1_43_pip: "You said you were the delivery.",
  a1_44_ray: "You need a catcher. A leaf.",
  a1_45_ray: "I know green personally.",
  a1_46_ray: "Nobody is eating me.",
  a1_47_pip: "New order. Water.",
};

const NotOpenScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const [holdFrom, holdTo] = heldBeat(scene, "a1_41_narrator");
  const [waterFrom] = lineWindow(scene, "a1_47_pip");

  const pipEmotion = useEmotion(
    scene,
    "pip",
    { a1_47_pip: PIP_RESTING },
    PIP_RESTING,
    NO_LEAD,
  );
  const rayEmotion = useEmotion(
    scene,
    "ray",
    { a1_42_ray: "neutral", a1_45_ray: "happy", a1_46_ray: "neutral" },
    "neutral",
    NO_LEAD,
  );

  const pipMark = pipWideMark({ side: "right", offset: 330 });
  const ray = rayMark();
  // Where a delivery comes from and where it lands. It starts off-frame in the
  // upper left and runs *through* Ray's mark on its way down — he is the
  // delivery, and a beam that starts at his mouth is 250px long in a wide and
  // reads as a spark rather than as light arriving from the sky.
  const beamFrom = { x: 296, y: -150 };
  const target = { x: MEADOW.pip.x, y: MEADOW.ground - 10 };
  // **THE 45-FRAME INSERT IS THE HELD BEAT**, so it is the held beat's own
  // frames and not a copy of them: `heldBeat(scene, "a1_41_narrator")` above.
  // The two agreed when they were typed out separately and would have come
  // silently apart the first time `a1_41` was re-synthesised — the close on the
  // dirt exists for that silence and has to move with it.
  const insert = frame >= holdFrom && frame < holdTo;
  const closeMark: Mark = {
    x: MEADOW.pip.x,
    y: stand("pip", CLOSE_GROUND),
    scale: CLOSE_SCALE,
    who: "pip",
    state: "planted",
  };

  if (insert) {
    // "Here is what the light did there." — the same instant, from close
    // enough to watch it fail. One beam, bare dirt, and a glitter of nothing.
    return (
      <CloseWorld phase={9.4}>
        <CloseMark x={MEADOW.pip.x} y={CLOSE_GROUND} />
        <Pip
          x={closeMark.x}
          y={closeMark.y}
          scale={closeMark.scale}
          state="planted"
          phase={PHASE.pip}
          emotion={PIP_RESTING}
          look={{ x: 0.25, y: 0.5 }}
          idle={0.4}
          eyeLife={0}
        />
        {/* One beam, forty-four frames of it, laid exactly along the
            forty-five the script bought: it arrives, it hits bare dirt, it
            bounces off, it is gone, and the silence is the joke. */}
        <Delivery
          from={{ x: 620, y: -260 }}
          to={{ x: MEADOW.pip.x + 330, y: CLOSE_GROUND + 30 }}
          age={frame - (holdFrom + 1)}
          scale={2.1}
        />
      </CloseWorld>
    );
  }

  return (
    <MeadowPlate
      bg="meadow_day"
      phase={9.4}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ pip: pipMark, ray } as Cast}
          text={S9_BUBBLES}
        />
      }
    >
      <SunGlow x={SUNNY_DAY.x} y={SUNNY_DAY.cy} r={202 * SUNNY_DAY.scale * 3} strength={0.3} />
      {/* He is up. He has no line in this scene and he is the reason there is
          any light in it to waste — the irony is free and it is on screen. */}
      <Sunny
        x={SUNNY_DAY.x}
        y={hover("sunny", SUNNY_DAY.cy, SUNNY_DAY.scale)}
        scale={SUNNY_DAY.scale}
        phase={PHASE.sunny}
        emotion="proud"
        look="camera"
      />

      {S9_BEAMS.map((at) => (
        <Delivery key={at} from={beamFrom} to={target} age={frame - at} scale={1.55} />
      ))}

      <DirtPatch x={PIP_WIDE.x} y={MEADOW.ground} />
      <Pip
        x={PIP_WIDE.x}
        y={PIP_WIDE.y}
        scale={PIP_WIDE.scale}
        state="planted"
        phase={PHASE.pip}
        emotion={pipEmotion}
        speaking={stage.speaking("pip")}
        // She watches her deliveries ricochet off the premises, then turns to
        // the contractor to place the next order.
        look={
          frame >= waterFrom
            ? lookAt(centreOf(pipMark), centreOf(ray))
            : { x: 0.25, y: 0.55 }
        }
        idle={frame >= holdFrom && frame < holdTo ? 0.35 : 1}
      />

      <Ray
        x={ray.x}
        y={ray.y}
        scale={S7_RAY.scale}
        brightness={RAY_LIGHT}
        bank={RAY_STOOP}
        streak={0.22}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        look={lookAt(centreOf(ray), centreOf(pipMark))}
        zIndex={12}
      />
    </MeadowPlate>
  );
};

// ---------------------------------------------------------------------------
// Scene 10 — The puddle that would not walk
// ---------------------------------------------------------------------------

/** Where the puddle is in the close two-shot, and in the wide. Her right, both. */
const S10_PUDDLE_CLOSE = { x: 1330, y: CLOSE_GROUND + 34 } as const;
const S10_PUDDLE_WIDE = { x: 1148, y: MEADOW.ground + 16 } as const;

/**
 * Close → wide. Same rule as the act's other cuts: `a1_51_pip`'s bubble is
 * `until` 375 and gone at 382, and `a1_52_ray` starts at 383 — so 382 is the
 * one frame this cut can be on.
 */
const S10_CUT = 382;

const S10_BUBBLES: Record<string, string> = {
  a1_50_pip: "You. Puddle. Come here.",
  a1_51_pip: "Walking is off the menu.",
  a1_52_ray: "I can move water. Watch.",
  // Drawn caps the clip does not carry — deliberate, and script.md marks it.
  a1_54_pip: "You sent my water AWAY.",
  a1_55_ray: "It will come back. Eventually.",
  a1_56_sunny: "That WAS my water elevator!",
  a1_57_sunny: "You're welcome! HA! HA!",
  a1_58_ray: "The elevator is his.",
  a1_59_pip: "Everything is his. Exhausting.",
};

/**
 * The puddle: one, in the whole field, exactly one step away.
 *
 * `dry` is 0 (a puddle) to 1 (gone), and it is not a fade — it thins first
 * (the ellipse loses its height before it loses its width), because that is
 * what a puddle in the sun actually does and it is the difference between
 * evaporation and a dissolve.
 */
const Puddle: React.FC<{
  x: number;
  y: number;
  rx: number;
  dry: number;
  shimmer: number;
  t: number;
}> = ({ x, y, rx, dry, shimmer, t }) => {
  const d = Math.max(0, Math.min(1, dry));
  if (d >= 1) return null;
  const w = rx * (1 - 0.42 * d);
  const h = rx * 0.3 * (1 - 0.82 * d);
  const wobble = 1 + Math.sin(t * 2.6) * 0.02 * shimmer;
  return (
    <WideLayer>
      <ellipse cx={x} cy={y} rx={w * wobble} ry={h} fill={kidTheme.water} opacity={0.92 * (1 - d * 0.4)} />
      <ellipse cx={x} cy={y} rx={w * wobble} ry={h} fill="none" stroke={kidTheme.waterDark} strokeWidth={5} opacity={0.7 * (1 - d)} />
      <ellipse
        cx={x - w * 0.3}
        cy={y - h * 0.34}
        rx={w * 0.3}
        ry={h * 0.3}
        fill={kidTheme.shine}
        opacity={(0.55 + 0.25 * Math.sin(t * 3.1)) * (1 - d)}
      />
    </WideLayer>
  );
};

/**
 * The puddle, leaving: a twist of mist going up and away.
 *
 * Nine blobs on one slow rising curve rather than a cloud of them — the script
 * says "a twist", the joke is that her water is being *taken somewhere*, and a
 * shapeless fog would say it merely went. Each blob is one pure function of
 * its index and the age of the lift.
 */
const Mist: React.FC<{ x: number; y: number; age: number; scale?: number }> = ({
  x,
  y,
  age,
  scale = 1,
}) => {
  if (age <= 0) return null;
  return (
    <WideLayer>
      {Array.from({ length: 9 }, (_, i) => {
        const u = (age - i * 7) / 150;
        if (u <= 0 || u >= 1) return null;
        const rise = kidEase.easeOutCubic(u);
        return (
          <circle
            key={i}
            cx={x + Math.sin(u * 4.4 + i * 0.8) * 62 * scale + rise * 96 * scale}
            cy={y - rise * 520 * scale}
            r={(30 + i * 2.6) * scale * (0.5 + 0.5 * rise)}
            fill={kidTheme.paper}
            stroke={kidTheme.waterLight}
            strokeWidth={5 * scale}
            opacity={0.72 * (1 - u)}
          />
        );
      })}
    </WideLayer>
  );
};

const PuddleScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [declineFrom, declineTo] = heldBeat(scene, "a1_50_pip");
  const [watchFrom, watchTo] = lineWindow(scene, "a1_52_ray");
  const [guessFrom, guessTo] = heldBeat(scene, "a1_55_ray");
  const [claimFrom] = lineWindow(scene, "a1_56_sunny");
  const [haFrom, haTo] = lineWindow(scene, "a1_57_sunny");

  // --- the lift ------------------------------------------------------------
  // "Ray bends over the puddle and warms it — no arms, all ribbon. The puddle
  // shimmers, thins, and rises off the ground as a twist of mist, up and
  // away." It happens on the back half of "Watch." and is finished before the
  // Narrator says it went.
  const liftAt = watchFrom + Math.round((watchTo - watchFrom) * 0.72);
  const dry = interpolate(frame, [liftAt, liftAt + 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const shimmer = interpolate(frame, [liftAt - 30, liftAt], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ray crosses to the puddle to do it, and stays over the dry spot for the
  // rest of the scene — the sums he did are about the place where it was.
  const cross = moveAlong(
    { x: S7_RAY.x, y: S7_RAY.cy },
    { x: S10_PUDDLE_WIDE.x - 26, y: 806 },
    (frame - watchFrom) / 58,
    { arc: 0.12 },
  );

  const swell = interpolate(
    frame,
    [claimFrom - 6, claimFrom + 16, haTo + 40],
    [0, 1, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );
  const bounce = haHaBounce(frame, haFrom, haTo - haFrom);
  const sunnyScale = SUNNY_DAY.scale * (1 + 0.14 * swell + 0.05 * bounce);

  const pipEmotion = useEmotion(
    scene,
    "pip",
    // Nothing lower than `neutral` on her, ever: the holdout counter clicks
    // ("It is exhausting.") are dry, not defeated — she concedes the mechanism
    // and never her dignity, and the act hands her to Act Two flat rather than
    // sad.
    { a1_50_pip: PIP_RESTING, a1_59_pip: "neutral" },
    PIP_RESTING,
    NO_LEAD,
  );
  const rayEmotion = useEmotion(
    scene,
    "ray",
    { a1_52_ray: "happy", a1_55_ray: "neutral", a1_58_ray: "sad" },
    "neutral",
    NO_LEAD,
  );
  const sunnyEmotion = useEmotion(
    scene,
    "sunny",
    { a1_56_sunny: "excited", a1_57_sunny: "proud" },
    "proud",
    NO_LEAD,
  );

  const held =
    (frame >= declineFrom && frame < declineTo) || (frame >= guessFrom && frame < guessTo);
  const close = frame < S10_CUT;

  const closeMark: Mark = {
    x: 596,
    y: stand("pip", CLOSE_GROUND + 20),
    scale: 1.45,
    who: "pip",
    state: "planted",
    side: "right",
    offset: 360,
  };

  if (close) {
    // THE MATHS PROBLEM: seed, gap, puddle, in one frame. The whole geography
    // of the joke is that the answer is one step away and she does not have
    // one — so both ends of the sentence are in the shot and nothing else is.
    return (
      <CloseWorld
        phase={11.6}
        overlay={<Bubbles scene={scene} cast={{ pip: closeMark } as Cast} text={S10_BUBBLES} />}
      >
        <CloseMark x={closeMark.x} y={CLOSE_GROUND + 20} />
        <Pip
          x={closeMark.x}
          y={closeMark.y}
          scale={closeMark.scale}
          state="planted"
          phase={PHASE.pip}
          emotion={pipEmotion}
          speaking={stage.speaking("pip")}
          look={{ x: 0.85, y: 0.35 }}
          // The puddle declines by existing. Nothing moves, including her.
          idle={frame >= declineFrom && frame < declineTo ? 0.3 : 1}
          eyeLife={frame >= declineFrom && frame < declineTo ? 0 : 1}
        />
        <Puddle
          x={S10_PUDDLE_CLOSE.x}
          y={S10_PUDDLE_CLOSE.y}
          rx={210}
          dry={0}
          shimmer={frame >= declineFrom && frame < declineTo ? 0 : 1}
          t={t}
        />
      </CloseWorld>
    );
  }

  const pipMark = pipWideMark({ side: "left", offset: 340 });
  const ray = rayMark(cross.x, cross.y);
  const sunnyMark = sunnyDayMark(sunnyScale);

  return (
    <MeadowPlate
      bg="meadow_day"
      phase={11.6}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ pip: pipMark, ray, sunny: sunnyMark } as Cast}
          text={S10_BUBBLES}
          at={{
            a1_56_sunny: { x: 640, y: 172, tail: "right", tailAt: SUNNY_DAY.x },
            a1_57_sunny: { x: 640, y: 172, tail: "right", tailAt: SUNNY_DAY.x },
          }}
        />
      }
    >
      <SunGlow
        x={SUNNY_DAY.x}
        y={SUNNY_DAY.cy}
        r={202 * sunnyScale * 3}
        strength={0.3 + 0.16 * swell}
      />
      <Sunny
        x={sunnyMark.x}
        y={sunnyMark.y}
        scale={sunnyScale}
        phase={PHASE.sunny}
        emotion={sunnyEmotion}
        speaking={stage.speaking("sunny")}
        look={frame >= claimFrom ? "camera" : "down"}
      />

      <Puddle
        x={S10_PUDDLE_WIDE.x}
        y={S10_PUDDLE_WIDE.y}
        rx={128}
        dry={dry}
        shimmer={shimmer}
        t={t}
      />
      <Mist x={S10_PUDDLE_WIDE.x} y={S10_PUDDLE_WIDE.y - 20} age={frame - liftAt} />

      <DirtPatch x={PIP_WIDE.x} y={MEADOW.ground} />
      <Pip
        x={PIP_WIDE.x}
        y={PIP_WIDE.y}
        scale={PIP_WIDE.scale}
        state="planted"
        phase={PHASE.pip}
        emotion={pipEmotion}
        speaking={stage.speaking("pip")}
        look={
          frame >= claimFrom
            ? lookAt(centreOf(pipMark), { x: SUNNY_DAY.x, y: SUNNY_DAY.cy })
            : frame >= liftAt + 16
              ? // She watches her water leave, which is the only thing she can
                // do about it.
                { x: 0.5, y: -0.85 }
              : lookAt(centreOf(pipMark), { x: S10_PUDDLE_WIDE.x, y: S10_PUDDLE_WIDE.y - 60 })
        }
        idle={held ? 0.3 : 1}
        eyeLife={held ? 0 : 1}
      />

      <Ray
        x={ray.x}
        y={ray.y}
        scale={S7_RAY.scale}
        brightness={RAY_LIGHT}
        // He bends over the puddle to warm it — no arms, all ribbon — and
        // straightens up once it has gone.
        bank={interpolate(frame, [watchFrom, liftAt, liftAt + 70], [RAY_STOOP, 26, 12], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: kidEase.easeInOutSine,
        })}
        streak={0.22}
        phase={PHASE.ray}
        emotion={rayEmotion}
        speaking={stage.speaking("ray")}
        look={
          frame >= claimFrom
            ? lookAt(centreOf(ray), { x: SUNNY_DAY.x, y: SUNNY_DAY.cy })
            : frame >= watchFrom
              ? { x: -0.2, y: 0.95 }
              : lookAt(centreOf(ray), centreOf(pipMark))
        }
        idle={held ? 0.15 : 1}
        eyeLife={held ? 0 : 1}
        zIndex={12}
      />

      {/* A beam's worth of shade under the two floaters, so a flat-filled body
          is sitting on the painted field rather than in front of it. */}
      <KidContactShadow x={ray.x} y={MEADOW.ground + 8} rx={150} ry={26} strength={0.16} />
    </MeadowPlate>
  );
};

export const ACT1_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s05_sunrise: SunriseScene,
  s06_order: OrderScene,
  s07_moonlight: MoonlightScene,
  s08_dawn_first: DawnFirstScene,
  s09_not_open: NotOpenScene,
  s10_puddle: PuddleScene,
};
