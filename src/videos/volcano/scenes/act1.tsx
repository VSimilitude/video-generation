import React from "react";
import { Freeze } from "remotion";
import {
  AbsoluteFill,
  Bubbles,
  CHAMBER,
  COAST,
  CoastWorld,
  Cast,
  Ember,
  EMBER_COLOR,
  GlowDrop,
  KidSilhouette,
  MountainWorld,
  PHASE,
  PLATES,
  Sandcastle,
  SpeechBubble,
  Sunny,
  UnderWorld,
  VOLCANO_SEAT,
  volcanoBubble,
  WIDTH,
  WideLayer,
  WordCard,
  hover,
  interpolate,
  kidEase,
  kidTheme,
  lineWindow,
  mixHex,
  stand,
  useCurrentFrame,
  useEmotion,
  useStage,
  useVideoConfig,
  NO_LEAD,
  type KidPlacement,
  type Mark,
  type TimedScene,
} from "./common";

// ACT ONE — DOWNSTAIRS (scenes s05_basement … s09_first_line).
//
// The world's basement, a newborn with opinions, and the first line the scenery
// has ever spoken. Four scenes underground and one on the surface, and the one
// on the surface is the biggest beat the series has had since the ceremony it
// has not reached yet.
//
// ---------------------------------------------------------------------------
// WHAT THIS ACT PLANTS (and therefore what a later act may assume)
//
//   EMBER         Her whole rig, in public for the first time: she arrives
//                 mid-sentence at maximum velocity, she has no arms, and her
//                 gesture vocabulary is `lean` + `squish` + speed. Act two
//                 inherits a hero the audience has already watched ricochet off
//                 a closed door twice.
//   THE DOOR      The sealed vent, UP in the ceiling, because warm things rise
//                 and a door in the wall would have made the rise a detour. It
//                 is drawn, not painted: she touches it, bounces off it, and it
//                 opens on her.
//   THE CROWD     Dozens of identical glow-drops with faces, silent forever
//                 (STYLE's crowd rule: a crowd with faces is a comedy cast that
//                 costs nothing, as long as nobody gives it a line). They are
//                 also the pedagogy — "some of it has been waiting for ten
//                 thousand years. Nobody minds."
//   THE WAKE      `Volcano`'s `awake` goes 0 → 1 exactly once, in Scene 9,
//                 across V1. From that frame on he has a face for the rest of
//                 the series, and act two inherits him awake.
//
// ---------------------------------------------------------------------------
// THE BOUNDARY CHECKLIST (STYLE, "A cut inside a continuous space")
//
//   s04→s05  A place cut and a time cut at once: the title is a dawn portrait
//            out on the water, this act opens on a cross-section of the ground
//            under the beach. Nothing carries but the fact that the mountain is
//            asleep, and he is not in the shot to contradict it.
//   s05      TWO internal cuts. The descent (drawn strata sliding past a
//            painted column) arrives at the glow on the last word of `a1_01`
//            and cuts to `magma_chamber`; the shot then holds for the rest of
//            the scene. The glow level is continuous across that cut — the
//            descent's `DeepGlow` ends at the same warmth the chamber floor
//            starts at, which is what makes it an arrival rather than a jump.
//   s05→s06  Same chamber, same camera, same crowd on the same marks. Ember is
//            the only new thing and she gets a real entrance: she comes OUT of
//            the floor, already talking.
//   s06→s07  Same chamber. She is centre-frame and looking UP at the end of
//            Scene 6 (the 48f of nothing) and she is centre-frame and looking
//            UP at the start of Scene 7, because Scene 7 is about the thing she
//            is looking at.
//   s07→s08  Same chamber, and then it moves. The plate changes at the cut
//            (`magma_chamber` → `magma_shaft`) because the room genuinely
//            changes: they have left it.
//   s08→s09  **THE BIG ONE.** Underground to the surface, and the surface is
//            frozen. Everything about that cut is deliberate: it is the first
//            time in the episode the camera has been outside since the title,
//            the world is holding perfectly still when we get there, and it
//            holds for ninety-three frames before anything happens.
// ---------------------------------------------------------------------------

/** Ember's resting face for the whole act: gleeful, never whiny. */
const EMBER_RESTING = "excited";

/** Where the crowd sits, and how big the room feels. */
const CHAMBER_MID = { x: 960, y: 620 } as const;

// ---------------------------------------------------------------------------
// The magma crowd
// ---------------------------------------------------------------------------

/**
 * Sixteen drops, deterministic, never random (Remotion renders frames in a pool
 * of tabs). Two coprime strides plus a quadratic jitter, so they do not lay out
 * on a lattice the eye reads as rows.
 *
 * They are **perfectly content and completely still** — a bob and a blink, and
 * that is all. That stillness is the joke Ember is played against for four
 * scenes, and it is also the fact: some of them have been waiting ten thousand
 * years and nobody minds.
 */
const CROWD = Array.from({ length: 14 }, (_, i) => {
  const x = 170 + ((i * 421) % 1600) + (((i * i * 29) % 121) - 60);
  const depth = ((i * 37) % 5) / 4;
  return {
    x,
    // A real depth spread rather than a line-up: 168px of it, and the scale
    // ladder that goes with it. The first pass put every drop inside 96px of
    // one another and the chamber read as a police line-up on a bench.
    y: CHAMBER.floor - 18 - depth * 168,
    // Ember is staged at 1.18 of a 320-unit box (378px). Every drop has to be
    // visibly smaller than her: at 1.5 they matched her and the chamber read as
    // a pile of identical balls with the hero somewhere in it.
    scale: 1.05 - depth * 0.44,
    phase: (i * 1.9) % 6.28,
  };
});

const MagmaCrowd: React.FC<{
  t: number;
  look?: number;
  lift?: number;
  /**
   * Pulls the crowd in towards the middle. 1 is the chamber's full width; the
   * shaft in Scene 8 is a much narrower room and at 1 the outer drops rode up
   * the dark walls looking like stickers stuck to the rock.
   */
  squeeze?: number;
}> = ({ t, look = 0, lift = 0, squeeze = 1 }) => (
  <WideLayer>
    {CROWD.map((c, i) => (
      <GlowDrop
        key={i}
        x={CHAMBER_MID.x + (c.x - CHAMBER_MID.x) * squeeze}
        y={c.y + lift}
        scale={c.scale}
        phase={c.phase}
        t={t}
        look={look}
        opacity={0.72 + c.scale * 0.3}
      />
    ))}
  </WideLayer>
);

// ---------------------------------------------------------------------------
// Scene 5 — The world's basement
// ---------------------------------------------------------------------------

/**
 * How far the descent travels, in px. It is the whole of `a1_01` — "Under the
 * beach. Under the grass. Under the rock. Down where it glows." — and it is
 * slow on purpose: about seven pixels a frame, which is a lift going down
 * rather than a fall.
 */
const DESCENT = { from: 720, to: -940 } as const;

/**
 * The beach, in cross-section, riding the top of the descent: sky, the sea off
 * to frame left, the sand, and the darker subsoil the strata start under.
 *
 * The castle and the kid are staged on top of it by the scene (they are
 * composition-space bodies rather than wide-layer geometry), which is why they
 * are not in here.
 */
const SurfaceCap: React.FC<{ top: number }> = ({ top }) => {
  const sand = PLATES.coast_day.near;
  const sea = "#2fa9c4";
  return (
    <WideLayer>
      <g transform={`translate(0 ${top.toFixed(1)})`}>
        {/* Sky above the cut, then the sea, then the sand the beach is made
            of — the same three bands the cold open's wide has, seen edge on. */}
        {/* One gradient rather than three stacked flat rects: the first pass
            drew the sky as bands and the shot opened on three horizontal
            stripes of blue, which reads as coloured paper rather than as air.
            A single shared id is safe — there is exactly one of these on
            screen, and it is the same ramp every time. */}
        <defs>
          <linearGradient id="ep5-cap-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={kidTheme.skyTop} />
            <stop offset="0.62" stopColor={kidTheme.skyMid} />
            <stop offset="1" stopColor={kidTheme.skyLow} />
          </linearGradient>
        </defs>
        <rect x={-1400} y={-1600} width={4720} height={1600} fill="url(#ep5-cap-sky)" />
        {/* The sea is off to frame LEFT and the beach runs away to the right —
            the same geography as the cold open's wide, turned ninety degrees.
            The first pass drew the water band from x = −1400 for 1180px, which
            put all of it off the left edge of a 1920 frame. */}
        {/* The water, and the wet edge where it meets the beach. Both curve:
            a straight vertical seam between sea and sand is a colour swatch. */}
        <path
          d={`M -1400 -14 L 470 -14 Q 560 34 610 190 L -1400 190 Z`}
          fill={sea}
        />
        <path
          d={`M 470 -14 Q 620 -34 880 -12 L 3320 -16 L 3320 190 L 610 190 Q 560 34 470 -14 Z`}
          fill={sand}
        />
        <rect x={-1400} y={130} width={4720} height={120} fill={mixHex(sand, "#6b4a2a", 0.5)} />
      </g>
    </WideLayer>
  );
};

/**
 * Drawn debris in the strata, at three depths, sliding past at three speeds.
 *
 * Eight seconds of scrolling stripes is eight seconds of nothing happening, and
 * the painted column cannot help — its bands are prompted empty on purpose so
 * the descent does not pass the same landmark twice. These are the parallax:
 * pebbles and roots at 1.0, 0.86 and 0.72 of the plate's speed, which is what
 * turns a sliding texture into a thing with depth in it.
 *
 * Deterministic from the index, never random (Remotion renders frames in a pool
 * of tabs), and they are the only things in this shot with an edge on them.
 */
const StrataDetail: React.FC<{ offsetY: number; below: number }> = ({ offsetY, below }) => (
  <WideLayer>
    {Array.from({ length: 22 }, (_, i) => {
      const layer = i % 3;
      const speed = 1 - layer * 0.14;
      const x = 90 + ((i * 613) % 1760) + (((i * i * 41) % 141) - 70);
      const home = -520 + ((i * 397) % 2260);
      const y = home + offsetY * speed;
      // **Never above the ground line.** The first pass culled only on the
      // frame and drew half the debris in the sky over the beach — pebbles
      // hanging in mid-air above a child building a sandcastle.
      if (y < below + 40 || y > 1500) return null;
      const r = 9 + (i % 4) * 7 - layer * 2;
      const root = i % 5 === 0;
      return root ? (
        <path
          key={i}
          d={`M ${x - 60} ${y.toFixed(0)} q 34 ${18 + (i % 3) * 10} 72 ${4} q 30 ${-14} 62 ${10}`}
          stroke="#5a2a1c"
          strokeWidth={7 - layer * 1.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.5 - layer * 0.12}
        />
      ) : (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={r}
          ry={r * 0.74}
          fill={layer === 0 ? "#6d3222" : "#7c4030"}
          opacity={0.55 - layer * 0.13}
        />
      );
    })}
  </WideLayer>
);

/** The glow coming up from below, and it is the destination of the shot. */
const DeepGlow: React.FC<{ top: number; strength: number }> = ({ top, strength }) => (
  <WideLayer>
    <g transform={`translate(0 ${top.toFixed(1)})`}>
      <rect x={-1400} y={0} width={4720} height={2400} fill="#c2380f" />
      <rect x={-1400} y={110} width={4720} height={2400} fill="#f07a12" opacity={0.85} />
      <rect x={-1400} y={260} width={4720} height={2400} fill="#ffb42a" opacity={0.9} />
      <ellipse
        cx={WIDTH / 2}
        cy={60}
        rx={1500}
        ry={330}
        fill="#ffd86a"
        opacity={0.5 * strength}
      />
    </g>
  </WideLayer>
);

const BasementScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const [, descentTo] = lineWindow(scene, "a1_01_narrator");
  const [magmaFrom, magmaTo] = lineWindow(scene, "a1_02_narrator");

  // THE DESCENT. It runs the whole of the first line and lands on the glow with
  // the last word of it ("Down where it glows."), and then the scene cuts.
  const arrived = frame >= descentTo;
  const u = interpolate(frame, [0, descentTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const offsetY = DESCENT.from + (DESCENT.to - DESCENT.from) * u;
  // The painted column is 1119px tall over a 1080 frame, so it runs out of
  // slack almost immediately: the drawn cap rides above its top edge and the
  // drawn glow rides below its bottom one, and the three move as one object.
  const plateTop = -19 + offsetY;
  const plateBottom = plateTop + 1119;

  // THE BIG WORD. `WordCard` rather than `BigWordBeat`: script.md's Big Words
  // table asks for a card, and a chant needs a character to chant it — down here
  // the only voice is the Narrator's, and she does not shout along.
  //
  // It lands on the last word of `a1_02` ("Melted rock has a name. Magma.") and
  // holds through the 24f the timeline buys for it. That gap is the builder's,
  // not the script's, and it is flagged in `Video.tsx`.
  const cardFrom = magmaFrom + Math.round((magmaTo - magmaFrom) * 0.82);

  // SUNNY, FROM VERY FAR ABOVE, THROUGH A KILOMETRE OF ROCK. A hairline crack
  // in the ceiling with one pale shaft coming down it, and a bubble under the
  // shaft with no tail — there is no body down here to point at, and a tail
  // aimed at nobody reads as narration.
  const [offerFrom, offerTo] = lineWindow(scene, "a1_06_sunny");
  const shaft = interpolate(
    frame,
    [offerFrom - 14, offerFrom + 6, offerTo, offerTo + 26],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: kidEase.easeInOutSine },
  );
  // "Nobody down there needed light." Nobody looks up. That is the whole gag,
  // so the crowd's eyeline is the ONE thing that must not move here.
  const crowdLook = 0;

  if (!arrived) {
    return (
      <AbsoluteFill style={{ background: "#2b1119", fontFamily: kidTheme.fontFamily }}>
        <UnderWorld bg="strata_column" phase={0.4} offsetY={offsetY} glow={0}>
          <SurfaceCap top={plateTop} />
          {/* **THE ONE FRAME THAT HAS BOTH HALVES OF THE BUILDER PARALLEL IN
              IT.** The castle and the kid from the cold open, on the same marks
              and small, sitting on the surface as the camera drops past them.
              Nothing points at them and nobody says anything; they are gone
              inside three seconds. Scene 29 is what they are for. */}
          <Sandcastle
            x={COAST.castle.x + 190}
            y={plateTop - 10}
            scale={0.38}
            built={0.94}
            sand={PLATES.coast_day.near}
          />
          <KidSilhouette
            x={COAST.kid.x + 190}
            y={stand("kid", plateTop - 10)}
            scale={0.5}
            kneel={1}
            flip
            hold={0}
          />
          <StrataDetail offsetY={offsetY} below={plateTop + 180} />
          <DeepGlow top={plateBottom} strength={u} />
        </UnderWorld>
      </AbsoluteFill>
    );
  }

  return (
    <UnderWorld
      bg="magma_chamber"
      phase={0.9}
      overlay={
        <>
          <WordCard
            text="MAGMA"
            from={cardFrom}
            until={cardFrom + 96}
            y={286}
            bannerColor={EMBER_COLOR.body}
            sub="melted rock"
          />
          {shaft > 0.02 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 168,
                display: "flex",
                justifyContent: "center",
                opacity: shaft,
              }}
            >
              <SpeechBubble
                x={WIDTH / 2}
                y={228}
                text="Need light? I am available!"
                tail="none"
                from={offerFrom - 10}
                until={offerTo + 8}
                fontSize={50}
                background={mixHex(kidTheme.paper, kidTheme.sun, 0.22)}
              />
            </div>
          ) : null}
        </>
      }
    >
      {/* The door is in this room too. It is not mentioned until Scene 7, and
          nobody looks at it here — but a ceiling that grows a vent between two
          consecutive shots of the same chamber is the pop-in half of STYLE's
          boundary checklist. */}
      <SealedDoor lit={0.3} />
      <CeilingCrack strength={shaft} />
      <MagmaCrowd t={t} look={crowdLook} />
    </UnderWorld>
  );
};

/**
 * One hairline crack in the ceiling with a pale shaft coming down it.
 *
 * The only light in the episode that is not the world's own, and it arrives
 * exactly once, unasked for, from a character who is a kilometre away and
 * genuinely trying to help. It is drawn narrow and short: a shaft that reached
 * the floor would light the room, and the joke is that it changes nothing.
 */
const CeilingCrack: React.FC<{ strength: number }> = ({ strength }) => {
  if (strength <= 0.02) return null;
  return (
    <WideLayer>
      <path
        d={`M ${WIDTH / 2 - 42} ${CHAMBER.ceiling - 96} L ${WIDTH / 2 + 10} ${CHAMBER.ceiling - 20} L ${WIDTH / 2 - 4} ${CHAMBER.ceiling - 12} L ${WIDTH / 2 - 58} ${CHAMBER.ceiling - 92} Z`}
        fill={kidTheme.sunLight}
        opacity={0.85 * strength}
      />
      <path
        d={`M ${WIDTH / 2 - 58} ${CHAMBER.ceiling - 14} L ${WIDTH / 2 + 12} ${CHAMBER.ceiling - 14} L ${WIDTH / 2 + 104} ${CHAMBER.ceiling + 300} L ${WIDTH / 2 - 138} ${CHAMBER.ceiling + 300} Z`}
        fill={kidTheme.sunLight}
        opacity={0.18 * strength}
      />
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 6 — Ember, mid-sentence
// ---------------------------------------------------------------------------

/** Her lap of the chamber: an ellipse, and she goes round it fast. */
const LAP = { rx: 620, ry: 150, y: 540 } as const;

/**
 * Where she comes to rest, and where Scene 7 finds her. Centre of the room,
 * under the door, because the door is what the rest of the act is about.
 */
const EMBER_SCALE = 1.18;
const EMBER_MARK: Mark = {
  x: CHAMBER_MID.x,
  y: hover("ember", 620, EMBER_SCALE),
  scale: EMBER_SCALE,
  who: "ember",
  side: "left",
  offset: 320,
};

const S6_BUBBLES: Record<string, string> = {
  a1_08_ember: "Nobody here has a schedule!",
  a1_10_ember: "It is all broken.",
  a1_11_ember: "Hello? Big house?",
};

const EmberScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [lapFrom, lapTo] = lineWindow(scene, "a1_08_ember");
  const [introFrom, introTo] = lineWindow(scene, "a1_09_narrator");
  const [upFrom] = lineWindow(scene, "a1_11_ember");

  // SHE ENTERS ALREADY TALKING, AND ALREADY MOVING. The clip starts lowercase
  // on purpose ("and another thing.") and the picture matches it: she is out of
  // the floor and round the room before the Narrator has said who she is.
  //
  // Two and a bit laps in six seconds, then she spirals in and parks. The lap
  // is a real ellipse rather than a lerp between marks, so she banks into her
  // own path (`lean`) instead of sliding.
  const lapU = interpolate(frame, [lapFrom, introTo], [0, 2.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeOutSine,
  });
  const settle = interpolate(frame, [introFrom, introTo], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });
  const a = lapU * Math.PI * 2 - Math.PI / 2;
  const x = CHAMBER_MID.x + Math.cos(a) * LAP.rx * settle;
  // She orbits ABOVE the crowd, never through it: the lap's centre is 540 and
  // its half-height 150, so she runs 390–690 while the drops sit at 730–900.
  // At the first pass's 660/196 she was inside the row and read as one of them,
  // which is the one thing the hero of this act cannot be.
  const y = LAP.y + Math.sin(a) * LAP.ry * settle + (1 - settle) * 80;
  // Banking: the tangent of the ellipse, in degrees, damped and capped. A drop
  // of lava at speed leans; a drop of lava standing still does not.
  const lean =
    settle *
    Math.max(-26, Math.min(26, -Math.sin(a) * 26));
  // She stretches along her path and squashes when she parks — her whole
  // gesture rig, and the reason she does not need arms.
  const squish = settle * 0.5 - (1 - settle) * 0.16;

  // The crowd watches her go past "with great interest" — their eyes track her
  // x, which is four eye-lines and costs nothing (STYLE's crowd rule).
  const crowdLook = Math.max(-1, Math.min(1, (x - CHAMBER_MID.x) / 700));

  // THE 48 FRAMES OF NOTHING. "She addresses the mountain and gets 48 frames of
  // nothing." She looks up at the door for the whole of it and nothing in the
  // frame answers — not the crowd, not the room, not him.
  const looking = frame >= upFrom;
  const mark: Mark = { ...EMBER_MARK, x, y: hover("ember", y, EMBER_SCALE) };

  return (
    <UnderWorld
      bg="magma_chamber"
      phase={0.9}
      overlay={<Bubbles scene={scene} cast={{ ember: mark } as Cast} text={S6_BUBBLES} />}
    >
      <MagmaCrowd t={t} look={crowdLook} />
      <Ember
        x={x}
        y={hover("ember", y, EMBER_SCALE)}
        scale={EMBER_SCALE}
        phase={PHASE.ember}
        lean={lean}
        squish={squish}
        wisps={0.6 + settle * 0.6}
        shadow={false}
        // NO_LEAD: this scene owns a held beat, and the kit's default 8-frame
        // lead would put her reaction to the silence *inside* the silence.
        emotion={useEmotion(
          scene,
          "ember",
          { a1_10_ember: "grumpy", a1_11_ember: EMBER_RESTING },
          EMBER_RESTING,
          NO_LEAD,
        )}
        speaking={stage.speaking("ember")}
        look={looking ? { x: 0, y: -1 } : "camera"}
        eyeLife={looking ? 0.3 : 1}
      />
      <SealedDoor lit={looking ? 1 : 0.45} />
    </UnderWorld>
  );
};

// ---------------------------------------------------------------------------
// Scene 7 — The broken door
// ---------------------------------------------------------------------------

/**
 * THE DOOR. A plugged vent set into the ceiling stone, drawn rather than
 * painted for all three of STYLE's reasons at once: it is touched, it moves,
 * and a character lines up with it.
 *
 * "It was not broken. It was closed. It had been closed for ten thousand
 * years." So it is drawn as a *plug* — a disc of cooled rock sitting in a
 * collar — rather than as a hole with something over it. A hole says
 * obstruction; a plug says the last eruption's leftovers, which is what it is.
 */
const SealedDoor: React.FC<{ lit?: number; hit?: number }> = ({ lit = 0.45, hit = 0 }) => {
  const { x, y } = CHAMBER.door;
  const jolt = hit * 5;
  const plug = mixHex("#3d2a2c", EMBER_COLOR.crust, 0.4);
  return (
    <WideLayer>
      <g transform={`translate(${x} ${(y + jolt).toFixed(1)})`}>
        {/* **SEEN FROM UNDERNEATH, LOOKING UP.** The first pass drew a collar
            with visible side walls and a lit disc slung under it, and at this
            camera it read as a bucket hanging off the ceiling. From below, a
            plugged vent is a socket: a ring of ceiling stone, a dark throat
            inside it, and the plug filling the throat. No side walls, because
            from directly beneath there are none to see. */}
        <ellipse cx={0} cy={0} rx={262} ry={98} fill="#4a2c26" />
        <ellipse cx={0} cy={4} rx={224} ry={78} fill="#2c1a18" />
        {/* The plug: cooled rock, sitting in the throat. Its underside is warm
            because the heat is on OUR side of it, which is the whole physics of
            the act — and the reason it is not going to hold. */}
        <ellipse cx={0} cy={6} rx={200} ry={66} fill={plug} stroke="#241413" strokeWidth={9} />
        <ellipse
          cx={0}
          cy={14}
          rx={172}
          ry={50}
          fill={EMBER_COLOR.glow}
          opacity={0.12 + 0.34 * lit}
        />
        {/* Hairline cracks with light behind them, radiating from the middle.
            They are the tell that this thing is not permanent, and they are
            already there in Scene 6: the picture knows before anybody says it. */}
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2 + 0.4;
          return (
            <path
              key={i}
              d={
                `M ${(Math.cos(a) * 30).toFixed(1)} ${(Math.sin(a) * 10 + 6).toFixed(1)}` +
                ` L ${(Math.cos(a) * 186).toFixed(1)} ${(Math.sin(a) * 60 + 6).toFixed(1)}`
              }
              stroke={EMBER_COLOR.hot}
              strokeWidth={4 + (i % 2) * 2}
              strokeLinecap="round"
              fill="none"
              opacity={0.45 + 0.5 * lit}
            />
          );
        })}
      </g>
    </WideLayer>
  );
};

const S7_BUBBLES: Record<string, string> = {
  a1_13_ember: "The door is broken.",
  a1_15_ember: "I will try it fast again.",
};

const BrokenDoorScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [inspectFrom, inspectTo] = lineWindow(scene, "a1_13_ember");
  const [notFrom, notTo] = lineWindow(scene, "a1_14_narrator");
  const [againFrom, againTo] = lineWindow(scene, "a1_15_ember");
  const [watchFrom] = lineWindow(scene, "a1_16_narrator");

  // TWO RUNS AT IT, AND THEY ARE THE SAME RUN. "I tried it fast. Now I will try
  // it fast again." The first happens under the Narrator's correction and the
  // second under her own line, and they are the identical shape on purpose:
  // repetition is the gag, and a second attempt that looked different would be
  // a character learning something.
  const runs = [notFrom + 26, againTo - 6];
  const RUN = 34;
  let launch = 0;
  let hit = 0;
  for (const at of runs) {
    const s = frame - at;
    if (s >= 0 && s <= RUN) {
      // Up fast, stop dead, come back down slower. `easeOutCubic` up and
      // `gravity` down, because nothing in this show starts or stops linearly.
      const up = kidEase.easeOutCubic(Math.min(1, s / 11));
      const back = kidEase.gravity(Math.max(0, (s - 13) / (RUN - 13)));
      launch = Math.max(launch, up - back);
      if (s >= 11 && s <= 20) hit = Math.max(hit, 1 - (s - 11) / 9);
    }
  }

  const restY = 620;
  const y = restY - launch * (restY - (CHAMBER.door.y + 170));
  // Squash on the way up, and a proper flatten on the bounce: a body of liquid
  // that hits a rock does not keep its shape, and hers is the only thing on
  // screen that can say "ouch" without a line.
  // A body of liquid that hits a rock does not keep its shape, and hers is the
  // only thing on screen that can say "ouch" without a line. The weights are
  // deliberately lopsided: stretched by half on the way up, flattened by a
  // third MORE than that on contact.
  const squish = launch * 0.5 - hit * 1.3;

  return (
    <UnderWorld
      bg="magma_chamber"
      phase={1.6}
      overlay={
        <Bubbles
          scene={scene}
          cast={
            {
              ember: {
                ...EMBER_MARK,
                y: hover("ember", Math.max(y, 430), EMBER_SCALE),
                side: "left",
              },
            } as Cast
          }
          text={S7_BUBBLES}
        />
      }
    >
      <MagmaCrowd t={t} look={0} />
      <SealedDoor lit={0.5 + hit * 0.5} hit={hit} />
      {hit > 0.02 ? <Bonk at={CHAMBER.door} strength={hit} /> : null}
      <Ember
        x={CHAMBER_MID.x}
        y={hover("ember", y, EMBER_SCALE)}
        scale={EMBER_SCALE}
        phase={PHASE.ember}
        lean={0}
        squish={squish}
        wisps={0.7 + launch * 0.6}
        shadow={false}
        emotion={useEmotion(
          scene,
          "ember",
          { a1_13_ember: "grumpy", a1_15_ember: EMBER_RESTING },
          EMBER_RESTING,
        )}
        speaking={stage.speaking("ember")}
        // Management inspecting a fixture: she looks at the thing, not at us.
        look={frame >= inspectFrom && frame < watchFrom ? { x: 0, y: -0.85 } : "camera"}
      />
    </UnderWorld>
  );
};

/**
 * The bounce, as a picture: six impact dashes off the plug and gone inside a
 * third of a second.
 *
 * **Dashes rather than arcs, in paper rather than in her own orange.** The
 * first pass drew two warm arcs under the plug, which on a chamber that is
 * entirely warm orange had no contrast at all — an impact nobody could see. The
 * dash burst is the comics device, it is detached from both bodies (so it can
 * never read as anatomy), and paper is the only value in this room that pops.
 */
const Bonk: React.FC<{ at: { x: number; y: number }; strength: number }> = ({
  at,
  strength,
}) => (
  <WideLayer>
    {Array.from({ length: 6 }, (_, i) => {
      const a = Math.PI * (0.12 + (i / 5) * 0.76);
      const r0 = 150;
      const r1 = r0 + 58 * strength;
      return (
        <path
          key={i}
          d={
            `M ${(at.x + Math.cos(a) * r0).toFixed(1)} ${(at.y + 74 + Math.sin(a) * r0 * 0.5).toFixed(1)}` +
            ` L ${(at.x + Math.cos(a) * r1).toFixed(1)} ${(at.y + 74 + Math.sin(a) * r1 * 0.5).toFixed(1)}`
          }
          stroke={kidTheme.paper}
          strokeWidth={10}
          strokeLinecap="round"
          opacity={strength * 0.85}
        />
      );
    })}
  </WideLayer>
);

// ---------------------------------------------------------------------------
// Scene 8 — Warm things rise
// ---------------------------------------------------------------------------

const S8_BUBBLES: Record<string, string> = {
  a1_19_ember: "Let's go, let's go, let's go!",
};

const WarmRiseScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stage = useStage(scene);

  const [, upTo] = lineWindow(scene, "a1_17_narrator");
  const [goFrom] = lineWindow(scene, "a1_19_ember");

  // THE WHOLE ROOM MOVES. The plate slides DOWN, which is the camera going up;
  // the crowd rides serenely; Ember goes to the front of the queue, because of
  // course she does.
  //
  // The rise starts on "Up." and never stops — it is still going at the cut,
  // which is the point: the act ends with the doors opening.
  const rise = interpolate(frame, [upTo - 20, scene.durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInOutSine,
  });

  // The crowd rises TOGETHER and at ONE speed — "the crowd rises together,
  // serene". Ember overtakes them, and the difference between the two speeds is
  // the entire characterisation of the scene.
  const crowdLift = -rise * 210;
  const emberLift = interpolate(frame, [goFrom - 24, scene.durationInFrames], [0, -520], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: kidEase.easeInCubic,
  });
  const emberY = 640 + crowdLift * 0.4 + emberLift;

  return (
    <UnderWorld
      bg="magma_shaft"
      phase={2.2}
      glow={0.7}
      overlay={
        <Bubbles
          scene={scene}
          cast={
            {
              ember: {
                ...EMBER_MARK,
                y: hover("ember", Math.max(emberY, 300), EMBER_SCALE),
                side: "right",
              },
            } as Cast
          }
          text={S8_BUBBLES}
        />
      }
    >
      {/* **THE PLATE DOES NOT MOVE, AND THAT IS THE STAGING.**
          The first pass slid it 520px to sell the rise and pulled its top edge
          into frame — a flat dark bar across the top of the shot with a hard
          seam under it, which is worse than no move at all (a 1119px plate over
          a 1080px frame has 39px of slack and there is no way round that).
          "Then the whole basement began to move. Up." is carried by the things
          IN the shaft going up past a camera that stays put: the crowd rises
          together, Ember overtakes them, and the streaks run. That is also the
          more honest reading — they are the ones moving. */}
      {/* Rising streaks: the room going past. Two thin parallel lines per streak
          — never one, because one tapering line off anything is a tadpole
          (STYLE, and it cost episode two four separate fixes). */}
      <RiseStreaks t={t} strength={rise} />
      <MagmaCrowd t={t} look={0} lift={crowdLift} squeeze={0.56} />
      <Ember
        x={CHAMBER_MID.x + 40}
        y={hover("ember", emberY, EMBER_SCALE)}
        scale={EMBER_SCALE}
        phase={PHASE.ember}
        lean={-6}
        squish={0.34 + rise * 0.3}
        wisps={1}
        shadow={false}
        emotion={EMBER_RESTING}
        speaking={stage.speaking("ember")}
        look={{ x: 0, y: -0.7 }}
      />
    </UnderWorld>
  );
};

const RiseStreaks: React.FC<{ t: number; strength: number }> = ({ t, strength }) => {
  if (strength <= 0.02) return null;
  return (
    <WideLayer>
      {Array.from({ length: 12 }, (_, i) => {
        const u = ((t * 0.55 + i / 12) % 1);
        const x = 150 + ((i * 331) % 1620);
        const y = 1180 - u * 1500;
        return (
          <g key={i} opacity={strength * 0.4 * Math.sin(u * Math.PI)}>
            <path
              d={`M ${x} ${y.toFixed(0)} L ${x} ${(y + 90).toFixed(0)}`}
              stroke={EMBER_COLOR.hot}
              strokeWidth={5}
              strokeLinecap="round"
            />
            <path
              d={`M ${x + 16} ${(y + 26).toFixed(0)} L ${x + 16} ${(y + 96).toFixed(0)}`}
              stroke={EMBER_COLOR.hot}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.7}
            />
          </g>
        );
      })}
    </WideLayer>
  );
};

// ---------------------------------------------------------------------------
// Scene 9 — THE FIRST LINE
// ---------------------------------------------------------------------------
//
// The act-one climax, the series event, and the beat every visual rule in five
// episodes has been paying into. Its shape is three shots and it is worth
// writing down, because the temptation on a beat this size is to do more:
//
//   0 … 93     THE FROZEN WIDE. The summit puffs once, and then the world
//              stops — `Freeze`, hard, every character mid-gesture. Ninety-three
//              frames: the script's 45f on the frozen wide plus the volcano's
//              own 48f approach gap on top of it. Nothing enters it. **That is
//              three seconds of a still picture and it is the single most
//              important thing in the scene**: five episodes of nobody looking
//              at him are cashed by the world holding still and looking.
//   V1 …       THE PORTRAIT. Cut to him, head on, filling the frame. His eyes
//              open ACROSS the line — the right one first, the left one a beat
//              behind (`VolcanoEyes`) — and he says good morning. The 60f hold
//              after it stays on his face, because the thing the audience needs
//              to look at is the thing that just happened.
//   V2 …       Still the portrait. "Do pardon the ash." and the ash pop lands
//              ON the button, which is the butler register confirmed in one
//              frame of animation.
//   a1_22 …    BACK TO THE WIDE, live. Sunny rocked, the kid still patting, and
//              "Hold on to something."
//
// The one thing to keep hold of: **he never moves.** He opens his eyes, his
// mouth works, and one small puff of ash leaves the crater. The mountain does
// not lean, nod, turn or grow. "The mountain moved slightly and that is
// enormous."

/** How long his eyes take to open. Slow, and it starts with the line. */
const WAKE_FRAMES = 46;

const S9_KID: KidPlacement = {
  x: COAST.kid.x,
  y: stand("kid", COAST.ground + 14),
  scale: 1.34,
  kneel: 1,
  flip: true,
  hold: 0.7,
};

const FirstLineScene: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const stage = useStage(scene);

  const [v1From, v1To] = lineWindow(scene, "a1_20_volcano");
  const [v2From, v2To] = lineWindow(scene, "a1_21_volcano");
  const [sunnyFrom] = lineWindow(scene, "a1_22_sunny");

  // **HOISTED ON PURPOSE, AND IT IS THE ONE THING IN THIS FILE THAT WOULD BRICK
  // THE PLAYER.** This scene returns two completely different trees depending
  // on the frame (the portrait during V1/V2, the wide either side of it), and
  // `useEmotion` is a hook. Called inline in the wide's JSX — which is where it
  // naturally wants to live, and where the other four scenes in this act
  // correctly keep it — it would run on the wide's frames and not on the
  // portrait's, changing this component's hook count mid-composition: React
  // #300, a bricked player, and a bug stills structurally cannot see. It is
  // also exactly the class `npm run lint:hooks` exists to catch.
  const sunnyEmotion = useEmotion(
    scene,
    "sunny",
    { a1_22_sunny: "amazed", a1_23_sunny: "excited" },
    "proud",
    // NO_LEAD: the ninety-three frames in front of V1 are the point of the
    // scene, and an 8-frame lead would move Sunny's face inside them.
    NO_LEAD,
  );

  // The freeze: the summit puffs for twenty frames and then everything stops.
  const FREEZE_AT = 22;
  const frozen = frame >= FREEZE_AT && frame < v1From;

  const sunnyMark: Mark = {
    x: 1608,
    y: hover("sunny", 254, 1.05),
    scale: 1.05,
    who: "sunny",
    side: "left",
    offset: 360,
  };

  // **THE MOUTH ANCHOR.** His two lines are the first words the scenery has
  // ever spoken and they have to visibly come out of his MOUTH — the first
  // pass typed the bubble in at (470, 252) and put the tail on his eye.
  // `volcanoBubble` derives the anchor from the same constants the component
  // draws the mouth with, and keeps the bubble clear of the eyes and brows so
  // nothing is occluded during the eyelid rise. It is computed at `awake: 1`
  // rather than at the live value on purpose: a face that is still growing
  // would drag the bubble down the flank underneath it while he speaks.
  const vBubble = volcanoBubble({ ...VOLCANO_SEAT, awake: 1 });

  // --- shot 2 and 3: the portrait ------------------------------------------
  if (frame >= v1From && frame < sunnyFrom) {
    const wake = interpolate(frame, [v1From, v1From + WAKE_FRAMES], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: kidEase.easeInOutSine,
    });
    return (
      <MountainWorld
        bg="sea_horizon_day"
        phase={3.1}
        drift={2}
        volcano={{
          scale: VOLCANO_SEAT.scale,
          awake: wake,
          // Quieter than the wide's: at portrait scale the plume's puffs are
          // 5.6× bigger and a 0.6 curl is a stack of grey balls up the middle
          // of the frame, over the one shot in the episode that is his face.
          smoke: 0.32,
          speaking: stage.speaking("volcano"),
          // He looks straight down the lens. Not at Sunny, not at the sea —
          // the first thing four episodes of scenery does with its eyes is
          // look at the audience.
          look: "camera",
          emotion: "happy",
          // ON THE BUTTON: the pop is timed to the last third of "Do pardon the
          // ash.", so the apology and the thing being apologised for arrive
          // together. That is the whole butler register in one gag.
          ashAt: v2From + Math.round((v2To - v2From) * 0.62),
        }}
        overlay={
          <Bubbles
            scene={scene}
            cast={{ volcano: vBubble.mark } as Cast}
            text={{
              a1_20_volcano: "Good morning.",
              a1_21_volcano: "Do pardon the ash.",
            }}
            at={{
              a1_20_volcano: vBubble.at,
              a1_21_volcano: vBubble.at,
            }}
            maxWidth={vBubble.maxWidth}
          />
        }
      />
    );
  }

  // --- shot 1 (frozen) and shot 3 (live) -----------------------------------
  const wide = (
    <CoastWorld
      bg="coast_day"
      phase={2.9}
      drift={frozen ? 0 : 4}
      volcano={{
        smoke: frame < v1From ? 0.95 : 0.6,
        awake: frame >= sunnyFrom ? 1 : 0,
        look: "camera",
        emotion: "happy",
      }}
      overlay={
        <Bubbles
          scene={scene}
          cast={{ sunny: sunnyMark } as Cast}
          text={{
            a1_22_sunny: "GOOD MORNING?!",
            a1_23_sunny: "It said good morning. TO ME!",
          }}
        />
      }
    >
      <Sunny
        x={sunnyMark.x}
        y={sunnyMark.y}
        scale={1.05}
        phase={PHASE.sunny}
        // `amazed` on the rocked pair. See `sunnyEmotion` above for why it is
        // computed at the top of the component rather than here.
        emotion={sunnyEmotion}
        speaking={stage.speaking("sunny")}
        look={frame >= sunnyFrom ? { x: -1, y: 0.2 } : "left"}
      />
      <Sandcastle
        x={COAST.castle.x}
        y={COAST.ground}
        scale={0.95}
        built={0.94}
        sand={PLATES.coast_day.near}
      />
      <KidSilhouette {...S9_KID} />
    </CoastWorld>
  );

  // `Freeze` rather than feeding constants: every body in the shot animates off
  // `useCurrentFrame`, and there is no prop on any of them for "stop". Hook
  // counts are unchanged either side of it (the kit's `BigWordBeat` freezes the
  // same way), which is what keeps the every-frame render honest.
  return (
    <Freeze frame={FREEZE_AT} active={frozen}>
      {wide}
    </Freeze>
  );
};

export const ACT1_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {
  s05_basement: BasementScene,
  s06_ember: EmberScene,
  s07_broken_door: BrokenDoorScene,
  s08_warm_rise: WarmRiseScene,
  s09_first_line: FirstLineScene,
};
