import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Drip,
  Cloudia,
  GroundShadow,
  Plane,
  SpeechBubble,
  EMOTION_EASE,
  Sunny,
  World,
  burst,
  holdCreep,
  kidPaintTheme,
  kidRadius,
  kidShadow,
  kidTheme,
  kidType,
  lineKeyOf,
  lookAt,
  makeBodyGeometry,
  makeWideLayer,
  mixHex,
  ribbon,
  softRadial,
  withCam,
  type Cam,
  type CamDelta,
  type CloudiaProps,
  type Depth,
  type DripProps,
  type Emotion,
  type EmotionInput,
  type LightRig,
  type LookDirection,
  type Mark as KitMark,
  type PaintOpts,
  type Pt,
  type SunnyProps,
  type TimeOfDay,
} from "../../../lib/kid";
import {
  isSpeaking,
  speakerAt,
  useSpeaking,
  type DialogueTurn,
  type TimedScene,
} from "../../../lib/narration";
import { NARRATION } from "../narrationManifest";
import { PLATES, type PlateKey } from "../plateManifest";

// Shared kit for "Drip's Big Adventure (Remaster)" — `DripWaterCycleRemaster`.
//
// The SAME export names as src/videos/water-cycle/scenes/common.tsx, so an act
// builder can open ep 1's act file next to theirs and re-picture it beat by
// beat. The speaker plumbing (API 1 + 2) is ep 1's, verbatim. What is new is
// the look package, bound to this episode (read in this order):
//
//   LIGHT[id] / TIME[id]   the light script, brief §4, one row per scene id.
//                          TIME picks the Post band (Video.tsx wraps every
//                          scene in ONE <Post time={TIME[id]}>; never mount a
//                          second Post in a scene — draw key-light bloom with
//                          <KeyBloom>, which is Post's bloom maths).
//   SETS / SCENE_SET       one plate stack per location (brief §3), keys
//                          `<location>_<plane>[_<variant>]` from plateManifest
//                          (keyed offline, atmosphere baked: decision log D17),
//                          rendered by <SetStack> with <Plane flat> (no live
//                          plane filter — banned for cost).
//   remasterCam()          ep 1's Cam + holdCreep + stepped bursts, pinned to
//                          line keys with atLine().
//   PaintedDrip/Sunny/Cloudia  the cast on the paint path with LIGHT[id]
//                          injected, a unique boilKey, and the ground shadow.
//   ScenePlaceholder       an unstaged scene in the right set, light and band.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Every voice in the show. `narrator` is off-stage: no body, no bubble. */
export type Speaker = "narrator" | "drip" | "sunny" | "cloudia";

/**
 * Per-character cycle offset. Breathing, blinking and mouth timing all key off
 * it, so two characters sharing one bob in lockstep — always pass these.
 */
export const PHASE: Record<Speaker, number> = {
  narrator: 0,
  drip: 0,
  sunny: 3.4,
  cloudia: 1.9,
};

/** Act colours — the Big Word banner and its syllable blocks wear them. */
export const ACT_COLOR = {
  evaporation: kidTheme.sunDark,
  condensation: kidTheme.purple,
  precipitation: kidTheme.waterDark,
  collection: kidTheme.mint,
} as const;

// ---------------------------------------------------------------------------
// API 1 — building a scene's turns from script.md's line keys
// ---------------------------------------------------------------------------

/** `co_02_drip` -> `drip`. The key convention *is* the cast list. */
export function speakerOf(lineKey: string): Speaker {
  const tail = lineKey.split("_").slice(2).join("_");
  if (tail === "drip" || tail === "sunny" || tail === "cloudia") return tail;
  return "narrator";
}

/**
 * Turn list for a scene, straight from script.md's line keys. The speaker is
 * derived from the key, so a scene's cast can never drift from its audio.
 *
 * The last turn gets `gapFrames: 0`: a trailing gap stacks with the scene's
 * tail and leaves a scene sitting silent twice as long as intended.
 */
export function turnsOf(
  keys: string[],
  opts?: { gap?: number; gaps?: Record<string, number> },
): DialogueTurn[] {
  return keys.map((key, i) => {
    const clip = NARRATION[key];
    if (!clip) throw new Error(`[water-cycle-remaster] no narration clip for "${key}"`);
    const explicit = opts?.gaps?.[key];
    const gapFrames =
      explicit !== undefined ? explicit : i === keys.length - 1 ? 0 : opts?.gap;
    return { clip, speaker: speakerOf(key), gapFrames };
  });
}

// `lineKeyOf`, `turnFor`, `lineWindow`, `heldBeat` and `lineProgress` are the
// kit's (`src/lib/kid/lines.ts`); they are re-exported at the foot of this file.

// ---------------------------------------------------------------------------
// API 2 — staging: who stands where, who is talking, who looks at whom
// ---------------------------------------------------------------------------

/**
 * Natural SVG box height of each character, from their component files. Needed
 * because `CharacterFrame` scales about the **bottom** of that box: a
 * character's `y` prop plus half this number is a ground line that does not
 * move when you change `scale`. Everything geometric below is derived from
 * that fact — it is the single easiest thing to get wrong when staging.
 */
export const CHAR_BOX = { drip: 380, sunny: 460, cloudia: 380 } as const;
export type Body = keyof typeof CHAR_BOX;

/**
 * Where a character stands. Pass exactly the `x`, `y` and `scale` you gave the
 * character component and the helpers do the rest: bubbles clear the crown,
 * looks aim at the middle.
 */
export type Mark = KitMark<Body>;

/**
 * The staging arithmetic, bound to this episode's cast: `stand`, `hover`,
 * `crownOf`, `midOf`, `bubbleAbove`, `markCentre`, `projectMark`. Drip is the
 * default body for a mark that does not name one, and a bubble sits 175px above
 * the crown (episode two, with a shorter hero, uses 165).
 */
const geometry = makeBodyGeometry({ box: CHAR_BOX, body: "drip", bubbleLift: 175 });
export const { stand, hover, crownOf, midOf, bubbleAbove, markCentre, projectMark } =
  geometry;

export type Cast = Partial<Record<Speaker, Mark>>;

/** Who is mid-line right now, plus a flag per character for `speaking={…}`. */
export function useTalking(scene: TimedScene): Record<Speaker, boolean> & {
  current: Speaker | null;
} {
  const frame = useCurrentFrame();
  const current = speakerAt(scene, frame) as Speaker | null;
  return {
    current,
    narrator: isSpeaking(scene, "narrator", frame),
    drip: isSpeaking(scene, "drip", frame),
    sunny: isSpeaking(scene, "sunny", frame),
    cloudia: isSpeaking(scene, "cloudia", frame),
  };
}

/** The line key playing right now, or null in the gaps between turns. */
export function useLineKey(scene: TimedScene): string | null {
  const frame = useCurrentFrame();
  const turn = (scene.turns ?? []).find(
    (t) => frame >= t.from && frame < t.from + t.durationInFrames,
  );
  return turn ? lineKeyOf(turn) : null;
}

/**
 * Per-line emotion for one character: `{ "a1_21_drip": "amazed" }`.
 *
 * The emotion lands `lead` frames *before* the line starts and holds until the
 * character's next mapped line. That lead is deliberate — the rig's
 * wobble-mouth (`scared`) hard-cuts to the talking mouth on the first frame of
 * a line, so a character has to settle into a face before they open it. For
 * the same reason: never map a line to `scared`. Put `scared` in the gap
 * between two lines instead (see Scene 9).
 *
 * Returns an `EmotionCue`, not a bare name: it knows both the face being left
 * and the frame the change lands on, which is exactly what the rig needs to
 * *morph* between the two instead of cutting (see `resolveEmotion`). Pass the
 * result straight to `emotion={…}`; nothing else changes.
 */
export function useEmotion(
  scene: TimedScene,
  speaker: Speaker,
  byKey: Record<string, Emotion>,
  resting: Emotion = "happy",
  lead = 8,
): EmotionInput {
  const frame = useCurrentFrame();
  let current = resting;
  let previous = resting;
  let at = -1;
  for (const turn of scene.turns ?? []) {
    if (turn.speaker !== speaker) continue;
    const emotion = byKey[lineKeyOf(turn)];
    if (!emotion) continue;
    if (frame < turn.from - lead) continue;
    // Two mapped lines with the same face are not a change: the morph (and the
    // settle it leaves behind) belongs to the frame the face actually moved.
    if (emotion !== current) {
      previous = current;
      at = turn.from - lead;
    }
    current = emotion;
  }
  // The morph fits inside the lead, so the face is settled by the time the
  // line opens the mouth — a scene that asked for a *short* lead (a held beat)
  // still gets a short change rather than one running under its own line.
  const frames = Math.min(EMOTION_EASE, Math.max(4, lead));
  return at < 0 ? current : { emotion: current, from: previous, at, frames };
}

/**
 * A listener's eyes. Whoever is talking gets looked at; nobody talking (or the
 * narrator talking, who has no body) falls back to `fallback`.
 */
export function useLookAtSpeaker(
  scene: TimedScene,
  cast: Cast,
  me: Speaker,
  fallback: LookDirection = "camera",
): LookDirection {
  const { current } = useTalking(scene);
  const from = cast[me];
  const to = current && current !== me ? cast[current] : undefined;
  if (!from || !to) return fallback;
  return lookAt(markCentre(from), markCentre(to));
}

/**
 * Every bubble in a dialogue scene, placed automatically.
 *
 * One entry per line key you want a bubble for — six words maximum, and a
 * *summary* rather than a transcript: the voice carries the line, the bubble
 * is a visual aid. Narrator lines normally get no entry (he has no body, so
 * his bubble would have nothing to point at).
 *
 * Placement: above the speaker's crown, on the side facing frame centre, tail
 * pointing back down at them, up for exactly the length of their turn.
 *
 * `at` overrides one line's bubble — `{x, y}` there is the **bubble's own
 * centre**, not the character's. Needed for a character who fills the top of
 * the frame (Sunny, mostly: there is no "above" left that isn't his rays), or
 * one who moves through their own line.
 *
 * `tailAt` in that override is a composition x for the *tail* — use it whenever
 * `x` moved the bubble away from its speaker, because the default tail sits at
 * a fixed inset from the bubble's corner and will then be pointing at nobody.
 */
export const Bubbles: React.FC<{
  scene: TimedScene;
  cast: Cast;
  text: Record<string, string>;
  at?: Record<
    string,
    {
      x?: number;
      y?: number;
      tail?: "left" | "right" | "none";
      /** Composition x the tail points at; defaults to the bubble's corner. */
      tailAt?: number;
      side?: "left" | "right";
      offset?: number;
    }
  >;
  fontSize?: number;
  maxWidth?: number;
}> = ({ scene, cast, text, at, fontSize, maxWidth }) => (
  <>
    {(scene.turns ?? []).map((turn, i) => {
      const key = lineKeyOf(turn);
      const body = text[key];
      const mark = cast[turn.speaker as Speaker];
      if (!body || !mark) return null;
      const override = at?.[key];
      const side =
        override?.side ?? mark.side ?? (mark.x < WIDTH / 2 ? "right" : ("left" as const));
      const offset = override?.offset ?? mark.offset ?? 330;
      const bx = clamp(
        override?.x ?? mark.x + (side === "right" ? offset : -offset),
        400,
        WIDTH - 400,
      );
      const by = clamp(override?.y ?? bubbleAbove(mark), 170, HEIGHT - 280);
      const tail = override?.tail ?? (side === "right" ? "left" : "right");
      return (
        <SpeechBubble
          key={`${key}-${i}`}
          x={bx}
          y={by}
          text={body}
          tail={tail}
          tailAt={override?.tailAt}
          from={turn.from}
          until={turn.from + turn.durationInFrames}
          fontSize={fontSize}
          maxWidth={maxWidth}
        />
      );
    })}
  </>
);

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// ---------------------------------------------------------------------------
// LIGHT + TIME — brief §4, one row per scene id
// ---------------------------------------------------------------------------
//
// `dir` = SCREEN direction from the subject toward the key, degrees, SVG
// convention (0 = camera-right, −90 = straight up, ±180 = camera-left).
// `elevation` 0 = on the horizon … 1 = overhead. Sunny IS the key whenever he
// is on screen: a scene with Sunny may pass `light={{ ...LIGHT[id], dir:
// keyDirTo(drip, sunny) }}` to a painted character; off screen the key stays
// where he last was (that is what these rows encode).
//
// Sun-side switch 1 at s24 (key right → left; we have travelled); Sunny
// re-enters camera-LEFT at s31 and stays left to the end.

const rig = (dir: number, elevation: number, key: string, shadow: string, contrast: number): LightRig => ({
  dir,
  elevation,
  key,
  shadow,
  contrast,
});

/** Card scenes (titles, Big Word freezes) keep the world's key: a frozen frame is still lit. */
export const LIGHT: Record<string, LightRig> = {
  // 1 pre-dawn: low horizon camera-right, rose; indigo; low. Rim light only on Drip.
  s01_dawn: rig(-8, 0.06, "#ffb09a", "#1e2050", 0.25),
  // 2 title card over the sunrise horizon.
  s02_title: rig(-10, 0.12, "#ffc27a", "#3a3a7a", 0.3),
  // 3–4 dawn: low right, gold; violet-blue; medium. Long shadows on the wave band.
  s03_ocean_wide: rig(-12, 0.14, "#ffc46a", "#3a3f8a", 0.5),
  s04_slosh: rig(-12, 0.14, "#ffc46a", "#3a3f8a", 0.5),
  // 5–8 sunrise → morning: rising right → 45°, warm yellow; cool blue; medium-high.
  s05_sunrise: rig(-20, 0.25, "#ffcf78", "#3c5c92", 0.6),
  s06_sunny_intro: rig(-45, 0.5, "#ffd27a", "#3c5c92", 0.7),
  s07_warming: rig(-45, 0.52, "#ffd680", "#3c5c92", 0.72),
  s08_everywhere: rig(-45, 0.55, "#ffd680", "#3c5c92", 0.72),
  // 9–11 morning: high right, warm; blue; high. s09: shadow detaches at liftoff.
  s09_liftoff: rig(-55, 0.68, "#ffe08e", "#36589a", 0.85),
  s10_bigword_evaporation: rig(-55, 0.68, "#ffe08e", "#36589a", 0.85),
  s11_best_at_it: rig(-58, 0.72, "#ffe08e", "#36589a", 0.85),
  // 12 climb: overhead, cooling; grey-blue; falling.
  s12_layers: rig(-80, 0.85, "#eef0f2", "#56688a", 0.6),
  // 13–17 noon above the cloud deck: top, soft white-warm; soft grey; low (giant softbox).
  s13_cloud_hotel: rig(-90, 0.92, "#fff0d2", "#6b6880", 0.3),
  s14_myth_pillow: rig(-90, 0.9, "#fff0d2", "#5c5878", 0.32),
  s15_what_a_cloud_is: rig(-90, 0.9, "#fff0d2", "#5c5878", 0.32),
  s16_dust_rule: rig(-90, 0.9, "#fff0d2", "#5c5878", 0.32),
  s17_kevin: rig(-90, 0.9, "#fff0d2", "#5c5878", 0.32),
  // 18 Big Word card (frozen s17 world).
  s18_bigword_condensation: rig(-90, 0.9, "#fff0d2", "#5c5878", 0.3),
  // 19–20 filling: top, dimming; grey; lower. Palette cools one band per scene.
  s19_hotel_fills: rig(-90, 0.9, "#e9e4dc", "#5a5a70", 0.24),
  s20_full_capacity: rig(-90, 0.9, "#d8d8dc", "#505468", 0.2),
  // 21 grey and heavy: diffuse, nearly none; blue-grey; lowest. NO ground shadow (SHADOWLESS).
  s21_grey_and_heavy: rig(-90, 0.98, "#b9bec8", "#454c60", 0.05),
  // 22–23 rain: backlit from above, cool; slate; medium. Wet rim highlights.
  s22_checkout: rig(-95, 0.8, "#c4d6ea", "#3a4656", 0.5),
  s23_bigword_precipitation: rig(-95, 0.8, "#c4d6ea", "#3a4656", 0.5),
  // 24–25 after rain: breaking sun LEFT; soft blue; rising. SUN-SIDE SWITCH 1.
  s24_landing: rig(-150, 0.45, "#ffe2a4", "#5a78a8", 0.55),
  s25_downhill: rig(-160, 0.3, "#ffd284", "#4a6aa0", 0.7),
  // 26–28 late afternoon: low left, gold; long blue; high. Longest shadows.
  s26_flower: rig(-170, 0.14, "#ffbe5c", "#2f4c80", 0.88),
  s27_moose: rig(-172, 0.1, "#ffbe5c", "#2f4c80", 0.9),
  s28_everybody_wants_a_bit: rig(-168, 0.16, "#ffbe5c", "#2f4c80", 0.85),
  // 29–32 sunset: low left, orange; purple; high → medium. Warmest palette.
  s29_bigword_collection: rig(-172, 0.1, "#ff9a50", "#4a2f6a", 0.85),
  s30_twist: rig(-160, 0.3, "#ffb070", "#4a2f6a", 0.7),
  s31_credit: rig(-172, 0.12, "#ff9a50", "#4a2f6a", 0.75),
  s32_round_again: rig(-170, 0.16, "#ffa45c", "#4a2f6a", 0.6),
  // 33–36 evening → night: card / moonlit blue; low. ONE shared evening key in s33 (D12 Q6).
  s33_chant: rig(-168, 0.2, "#ffb07a", "#2c2a5a", 0.35),
  s34_the_ring: rig(-168, 0.25, "#ffc08a", "#2c2a5a", 0.3),
  s35_mind_blower: rig(-90, 0.8, "#a8c0ff", "#1a2048", 0.25),
  s36_tease: rig(-170, 0.14, "#ff9e60", "#2c2a5a", 0.4),
};

/**
 * Post band per scene (LOOK bible columns: day / interior-overcast / night-dawn).
 * Dawn, the dawn title and the evening/night recap are "night"; the cloud
 * interior, the grey hotel and the rain are "interior" (overcast); the rest
 * "day". This puts 8 scenes in the night band (bible: ≥ 3 scenes < 0.40).
 */
export const TIME: Record<string, TimeOfDay> = {
  s01_dawn: "night",
  s02_title: "night",
  s03_ocean_wide: "night",
  s04_slosh: "night",
  s05_sunrise: "day",
  s06_sunny_intro: "day",
  s07_warming: "day",
  s08_everywhere: "day",
  s09_liftoff: "day",
  s10_bigword_evaporation: "day",
  s11_best_at_it: "day",
  s12_layers: "day",
  s13_cloud_hotel: "day",
  s14_myth_pillow: "interior",
  s15_what_a_cloud_is: "interior",
  s16_dust_rule: "interior",
  s17_kevin: "interior",
  s18_bigword_condensation: "interior",
  s19_hotel_fills: "interior",
  s20_full_capacity: "interior",
  s21_grey_and_heavy: "interior",
  s22_checkout: "interior",
  s23_bigword_precipitation: "interior",
  s24_landing: "day",
  s25_downhill: "day",
  s26_flower: "day",
  s27_moose: "day",
  s28_everybody_wants_a_bit: "day",
  s29_bigword_collection: "day",
  s30_twist: "day",
  s31_credit: "day",
  s32_round_again: "day",
  s33_chant: "night",
  s34_the_ring: "night",
  s35_mind_blower: "night",
  s36_tease: "night",
};

/** Scenes with open sky in the top of frame: Post's lighter paper over the sky (`skyRamp`). */
export const SKY_RAMP = new Set<string>([
  "s01_dawn", "s02_title", "s03_ocean_wide", "s04_slosh", "s05_sunrise", "s06_sunny_intro",
  "s07_warming", "s09_liftoff", "s10_bigword_evaporation", "s11_best_at_it", "s12_layers",
  "s13_cloud_hotel", "s21_grey_and_heavy", "s24_landing", "s25_downhill", "s26_flower",
  "s27_moose", "s29_bigword_collection", "s31_credit", "s32_round_again", "s36_tease",
]);

/** The only shadowless scene (bible: ground shadow absent only in s21). */
export const SHADOWLESS = new Set<string>(["s21_grey_and_heavy"]);

/**
 * Incoming seam per scene, frames (Step 2: seams = 6–8 f dissolve or a move;
 * Video.tsx draws it). 0 = hard cut: the cold open's first frame, and the
 * Big Word freezes, which continue the previous scene's frozen world (a
 * dissolve between two identical frames is invisible and only costs).
 * An act builder who stages a seam as a camera move instead asks the
 * skeleton owner to zero its row.
 */
export const SEAM: Record<string, number> = {
  s01_dawn: 0, s02_title: 7, s03_ocean_wide: 7, s04_slosh: 6, s05_sunrise: 7,
  s06_sunny_intro: 7, s07_warming: 7, s08_everywhere: 7, s09_liftoff: 7,
  s10_bigword_evaporation: 0, s11_best_at_it: 7, s12_layers: 8, s13_cloud_hotel: 8,
  s14_myth_pillow: 7, s15_what_a_cloud_is: 7, s16_dust_rule: 7, s17_kevin: 7,
  s18_bigword_condensation: 0, s19_hotel_fills: 7, s20_full_capacity: 7,
  s21_grey_and_heavy: 8, s22_checkout: 7, s23_bigword_precipitation: 0,
  s24_landing: 8, s25_downhill: 7, s26_flower: 7, s27_moose: 7,
  s28_everybody_wants_a_bit: 7, s29_bigword_collection: 7, s30_twist: 8,
  s31_credit: 8, s32_round_again: 7, s33_chant: 8, s34_the_ring: 7,
  s35_mind_blower: 8, s36_tease: 8,
};

// ---------------------------------------------------------------------------
// SETS — one plate stack per location (brief §3)
// ---------------------------------------------------------------------------

export type PlaneName = "sky" | "far" | "mid" | "near" | "fg";

export const PLANE_DEPTH: Record<PlaneName, Depth> = {
  sky: "sky",
  far: 0.15,
  mid: 0.4,
  near: 1.0,
  fg: 1.3,
};

export type PlateStack = {
  /** Sky plate (∞). Omit for a paper card: `bg` paints the card colour. */
  sky?: PlateKey;
  far?: PlateKey;
  mid?: PlateKey;
  near?: PlateKey;
  fg?: PlateKey;
  /** Haze veil colour for the far plane's lift (the horizon colour). */
  haze: string;
  /** Flat backing colour under the sky plate (cards; plate overscan safety). */
  bg: string;
  /** Typical ground-contact y for a body on the near plane (scene px), for shadows. */
  groundY: number;
  /** Luminance of that ground, 0–1 (GroundShadow strengthens on dark ground). */
  groundLum: number;
};

const stack = (s: PlateStack) => s;

/**
 * Plate stacks per location and variant. Where the painted horizon sits is the
 * plate's own composition (far ≈ lower half, mid ≈ lower 40%, near ≈ bottom
 * quarter); shift a plane per scene with <SetStack offsets={{ far: -120 }}>.
 */
export const SETS = {
  ocean: {
    predawn: stack({ sky: "ocean_sky_predawn", far: "ocean_far_dawn", mid: "ocean_mid_dawn", near: "ocean_near_dawn", fg: "ocean_fg_spray", haze: "#8a6a86", bg: "#151a4c", groundY: 860, groundLum: 0.22 }),
    dawn: stack({ sky: "ocean_sky_dawn", far: "ocean_far_dawn", mid: "ocean_mid_dawn", near: "ocean_near_dawn", fg: "ocean_fg_spray", haze: "#c8a0a0", bg: "#43367a", groundY: 860, groundLum: 0.25 }),
    sunrise: stack({ sky: "ocean_sky_sunrise", far: "ocean_far_morning", mid: "ocean_mid_dawn", near: "ocean_near_dawn", fg: "ocean_fg_spray", haze: "#f0d0a0", bg: "#6a8ac8", groundY: 860, groundLum: 0.3 }),
    morning: stack({ sky: "ocean_sky_morning", far: "ocean_far_morning", mid: "ocean_mid_morning", near: "ocean_near_morning", fg: "ocean_fg_spray", haze: "#cfe0ea", bg: "#5a9ad4", groundY: 860, groundLum: 0.35 }),
  },
  sky: {
    morning: stack({ sky: "sky_sky_high", far: "sky_far_streaks", haze: "#d8e6f0", bg: "#4a8ad0", groundY: 1000, groundLum: 0.5 }),
  },
  layers: {
    climb: stack({ sky: "layers_sky", far: "layers_far_wisps", mid: "layers_mid_wisps", haze: "#c8d8e8", bg: "#2a4a8a", groundY: 1000, groundLum: 0.5 }),
  },
  hotel: {
    noon: stack({ sky: "hotel_sky", far: "hotel_far", mid: "hotel_mid_bulk", fg: "hotel_fg_mist", haze: "#e8e2d6", bg: "#9cc0e0", groundY: 900, groundLum: 0.7 }),
    grey: stack({ sky: "hotel_sky_grey", far: "hotel_far_grey", mid: "hotel_mid_bulk_grey", fg: "hotel_fg_mist", haze: "#8a909c", bg: "#4a5266", groundY: 900, groundLum: 0.35 }),
  },
  lobby: {
    noon: stack({ sky: "hotel_sky_lobby", mid: "hotel_mid_columns", fg: "hotel_fg_mist", haze: "#e0d6e6", bg: "#8a7ab8", groundY: 880, groundLum: 0.6 }),
    dim: stack({ sky: "hotel_sky_lobby_dim", mid: "hotel_mid_columns", fg: "hotel_fg_mist", haze: "#a8a4b8", bg: "#5a5478", groundY: 880, groundLum: 0.42 }),
  },
  rain: {
    fall: stack({ sky: "rain_sky", far: "rain_far_curtain", mid: "rain_mid_curtain", fg: "rain_fg_streaks", haze: "#8a98a8", bg: "#3a4656", groundY: 1000, groundLum: 0.35 }),
  },
  valley: {
    afterrain: stack({ sky: "valley_sky_afterrain", far: "valley_far_hills", mid: "valley_mid_bank", near: "valley_near_river", fg: "valley_fg_grass", haze: "#d8e4e0", bg: "#7aa8d0", groundY: 880, groundLum: 0.45 }),
    rock: stack({ sky: "valley_sky_afterrain", far: "valley_far_hills", mid: "valley_mid_rock", fg: "valley_fg_grass", haze: "#d8e4e0", bg: "#7aa8d0", groundY: 760, groundLum: 0.45 }),
    winter: stack({ sky: "valley_sky_winter", far: "valley_far_hills_snow", mid: "valley_mid_rock", fg: "valley_fg_grass", haze: "#e4e8ee", bg: "#b8c4d4", groundY: 760, groundLum: 0.6 }),
    late: stack({ sky: "valley_sky_late", far: "valley_far_hills_late", mid: "valley_mid_bank_late", near: "valley_near_river_late", fg: "valley_fg_grass", haze: "#f0dcb0", bg: "#d0a868", groundY: 880, groundLum: 0.4 }),
  },
  home: {
    sunset: stack({ sky: "home_sky_sunset", far: "home_far_headland", mid: "home_mid_sea", near: "home_near_shore", fg: "home_fg_rock", haze: "#e8a888", bg: "#7a4a8a", groundY: 900, groundLum: 0.4 }),
    evening: stack({ sky: "home_sky_evening", far: "home_far_headland_evening", mid: "home_mid_sea", near: "home_near_shore", haze: "#8a7aa8", bg: "#2c2a5a", groundY: 900, groundLum: 0.3 }),
  },
  /** Single vignette plates (D12 Q4): s08 tour, s28 montage, s35 stops. */
  insert: {
    lake: stack({ sky: "everywhere_lake", haze: "#cfe0ea", bg: "#5a9ad4", groundY: 900, groundLum: 0.4 }),
    paddy: stack({ sky: "everywhere_paddy", haze: "#cfe0ea", bg: "#5a9ad4", groundY: 900, groundLum: 0.4 }),
    puddle: stack({ sky: "everywhere_puddle", haze: "#cfe0ea", bg: "#8a8a90", groundY: 900, groundLum: 0.4 }),
    dogbowl: stack({ sky: "everywhere_dogbowl", haze: "#e8dcc8", bg: "#c8a878", groundY: 900, groundLum: 0.4 }),
    channel: stack({ sky: "wants_channel", haze: "#f0dcb0", bg: "#a8b868", groundY: 900, groundLum: 0.4 }),
    tower: stack({ sky: "wants_tower", haze: "#f0dcb0", bg: "#a8b868", groundY: 900, groundLum: 0.4 }),
    tap: stack({ sky: "wants_tap", haze: "#f0dcb0", bg: "#c8b8a0", groundY: 900, groundLum: 0.4 }),
    kettle: stack({ sky: "wants_kettle", haze: "#f0dcb0", bg: "#c8a880", groundY: 900, groundLum: 0.4 }),
    bathtub: stack({ sky: "wants_bathtub", haze: "#f0e4d0", bg: "#c8d0d8", groundY: 900, groundLum: 0.5 }),
    nightBath: stack({ sky: "mind_bathtub", haze: "#6a78a8", bg: "#1a2048", groundY: 900, groundLum: 0.25 }),
    street: stack({ sky: "mind_street", haze: "#6a78a8", bg: "#1a2048", groundY: 900, groundLum: 0.25 }),
    jungle: stack({ sky: "mind_jungle", haze: "#5a7890", bg: "#14282a", groundY: 900, groundLum: 0.25 }),
    footprint: stack({ sky: "mind_footprint", haze: "#6a78a8", bg: "#1a2048", groundY: 900, groundLum: 0.25 }),
  },
  map: {
    paper: stack({ sky: "map_paper", haze: "#f3ead8", bg: "#e8dcc0", groundY: 900, groundLum: 0.7 }),
  },
  /** Paper cards (recap): no plate; kit paper comes from Post. */
  card: {
    evening: stack({ haze: "#e8d8c0", bg: "#d8c4a4", groundY: 900, groundLum: 0.6 }),
    night: stack({ haze: "#4a5888", bg: "#22305a", groundY: 900, groundLum: 0.25 }),
  },
} as const;

export type Location = keyof typeof SETS;

/** Default set per scene — the placeholder uses it; act builders pick variants freely. */
export const SCENE_SET: Record<string, PlateStack> = {
  s01_dawn: SETS.ocean.predawn,
  s02_title: SETS.ocean.sunrise,
  s03_ocean_wide: SETS.ocean.dawn,
  s04_slosh: SETS.ocean.dawn,
  s05_sunrise: SETS.ocean.sunrise,
  s06_sunny_intro: SETS.sky.morning,
  s07_warming: SETS.ocean.morning,
  s08_everywhere: SETS.ocean.morning,
  s09_liftoff: SETS.ocean.morning,
  s10_bigword_evaporation: SETS.ocean.morning,
  s11_best_at_it: SETS.sky.morning,
  s12_layers: SETS.layers.climb,
  s13_cloud_hotel: SETS.hotel.noon,
  s14_myth_pillow: SETS.lobby.noon,
  s15_what_a_cloud_is: SETS.lobby.noon,
  s16_dust_rule: SETS.lobby.noon,
  s17_kevin: SETS.lobby.noon,
  s18_bigword_condensation: SETS.lobby.noon,
  s19_hotel_fills: SETS.hotel.noon,
  s20_full_capacity: SETS.lobby.dim,
  s21_grey_and_heavy: SETS.hotel.grey,
  s22_checkout: SETS.lobby.dim,
  s23_bigword_precipitation: SETS.rain.fall,
  s24_landing: SETS.valley.rock,
  s25_downhill: SETS.valley.afterrain,
  s26_flower: SETS.valley.late,
  s27_moose: SETS.valley.late,
  s28_everybody_wants_a_bit: SETS.insert.channel,
  s29_bigword_collection: SETS.home.sunset,
  s30_twist: SETS.map.paper,
  s31_credit: SETS.home.sunset,
  s32_round_again: SETS.home.sunset,
  s33_chant: SETS.card.evening,
  s34_the_ring: SETS.card.evening,
  s35_mind_blower: SETS.insert.nightBath,
  s36_tease: SETS.home.evening,
};

/**
 * One painted plate, full-frame with an overscan `bleed` (fraction per side,
 * default 0.1) so pans and creeps never reveal an edge. `fit="width"` keeps a
 * tall plate (layers_sky, 9:16) at frame width and lets `y` scroll it.
 */
export const Plate: React.FC<{
  k: PlateKey;
  y?: number;
  x?: number;
  bleed?: number;
  opacity?: number;
  fit?: "cover" | "width";
}> = ({ k, y = 0, x = 0, bleed = 0.1, opacity = 1, fit = "cover" }) => {
  const w = WIDTH * (1 + 2 * bleed);
  const h = HEIGHT * (1 + 2 * bleed);
  return (
    <Img
      src={staticFile(PLATES[k].src)}
      style={{
        position: "absolute",
        left: -WIDTH * bleed + x,
        top: -HEIGHT * bleed + y,
        width: w,
        height: fit === "width" ? "auto" : h,
        objectFit: fit === "width" ? undefined : "cover",
        opacity,
      }}
    />
  );
};

/** Crossfade two plates (the ep-1 SkyBlend, re-pictured: sunrise, the snow dissolve, greying). */
export const SkyBlend: React.FC<{ from: PlateKey; to: PlateKey; u: number; y?: number; fit?: "cover" | "width" }> = ({
  from,
  to,
  u,
  y,
  fit,
}) => (
  <AbsoluteFill>
    <Plate k={from} y={y} fit={fit} />
    <AbsoluteFill style={{ opacity: Math.max(0, Math.min(1, u)) }}>
      <Plate k={to} y={y} fit={fit} />
    </AbsoluteFill>
  </AbsoluteFill>
);

/**
 * A whole location: World + flat Planes, back to front — sky (∞), far (0.15),
 * mid (0.4), near (1.0, the characters' plane), fg (1.3). Each slot prop puts
 * SVG/HTML set-pieces ON that plane, above its plate: `stage` is where the
 * cast goes (after the near plate, so they stand on it). `swap` replaces a
 * plane's plate for this scene (e.g. `{ far: "valley_far_hills_snow" }`),
 * `offsets` shifts a plate vertically (horizon placement per shot plan),
 * `hide` drops a plane.
 */
export const SetStack: React.FC<{
  set: PlateStack;
  cam: Cam;
  swap?: Partial<Record<PlaneName, PlateKey>>;
  offsets?: Partial<Record<PlaneName, number>>;
  hide?: PlaneName[];
  sky?: React.ReactNode;
  far?: React.ReactNode;
  mid?: React.ReactNode;
  stage?: React.ReactNode;
  fg?: React.ReactNode;
  skyFit?: "cover" | "width";
}> = ({ set, cam, swap = {}, offsets = {}, hide = [], sky, far, mid, stage, fg, skyFit }) => {
  const plate = (p: PlaneName) => {
    if (hide.includes(p)) return null;
    const k = swap[p] ?? set[p];
    return k ? <Plate k={k} y={offsets[p] ?? 0} fit={p === "sky" ? skyFit : undefined} /> : null;
  };
  return (
    <World cam={cam}>
      <Plane depth="sky" flat>
        <AbsoluteFill style={{ background: set.bg }} />
        {plate("sky")}
        {sky}
      </Plane>
      <Plane depth={0.15} flat haze={set.haze}>
        {plate("far")}
        {far}
      </Plane>
      <Plane depth={0.4} flat haze={set.haze}>
        {plate("mid")}
        {mid}
      </Plane>
      <Plane depth={1.0} flat>
        {plate("near")}
        {stage}
      </Plane>
      <Plane depth={1.3} flat>
        {plate("fg")}
        {fg}
      </Plane>
    </World>
  );
};

/** Key-light bloom (Sunny's disc, lamps) — Post's bloom maths; draw it last in a scene. */
export const KeyBloom: React.FC<{ x: number; y: number; r: number; color: string; opacity?: number }> = ({
  x,
  y,
  r,
  color,
  opacity = 0.25,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      background: softRadial(color),
      mixBlendMode: "screen",
      opacity,
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// API 3 — the camera (ep 1's Cam + the kit's grammar)
// ---------------------------------------------------------------------------
//
// Bubbles live OUTSIDE the camera (outside SetStack) — a zoomed bubble is
// unreadable — so a bubble on a character inside one is placed with
// `projectMark(cam, mark)`. Never move the camera while a bubble is up:
// pin every burst to a gap or a narrator line with atLine().

export const BASE_CAM: Cam = { x: WIDTH / 2, y: HEIGHT / 2 };

export type Burst = { at: number; delta: CamDelta; frames?: number };

export type CamSpec = {
  /** Origin + any static framing (zoom, dx, dy, rotate) — ep 1's Cam. */
  base?: Cam;
  /** Every hold creeps (1.00 → 1.02 over 6 s from `from`); `false` for a dead-still beat (Big Word card read). */
  creep?: false | { from?: number; seconds?: number; amount?: number };
  /** Stepped bursts, each composed on top of the previous (zooms multiply, pans add). */
  bursts?: Burst[];
  /** Any other deltas (a follow(), a shake). */
  deltas?: CamDelta[];
};

/** The scene camera: base ∘ holdCreep ∘ bursts ∘ deltas. Pure function of frame. */
export function remasterCam(frame: number, spec: CamSpec = {}): Cam {
  const base = spec.base ?? BASE_CAM;
  const creep =
    spec.creep === false
      ? {}
      : holdCreep(frame, spec.creep?.from ?? 0, spec.creep?.seconds ?? 6, FPS, spec.creep?.amount ?? 0.02);
  const bursts = (spec.bursts ?? []).map((b) => burst(frame, b.at, b.delta, b.frames ?? 12));
  return withCam(base, creep, ...bursts, ...(spec.deltas ?? []));
}

/** Alias, for symmetry with ep 1's `Camera` component name. */
export const RemasterCam = remasterCam;

/** Scene frame `u` (0–1) of the way through a line — pin a camera verb to a line key/word. */
export function atLine(scene: TimedScene, lineKey: string, u = 0): number {
  const turn = (scene.turns ?? []).find((t) => lineKeyOf(t) === lineKey);
  if (!turn) return 0;
  return Math.round(turn.from + u * turn.durationInFrames);
}

/** First frame after a line ends (its held gap starts here). */
export function afterLine(scene: TimedScene, lineKey: string): number {
  return atLine(scene, lineKey, 1);
}

/** A 1.00 → 1.06 Big Word push ending on `slam` (24 f, tilt 0°). Use with `creep: false`. */
export function bigWordPush(frame: number, slam: number, frames = 24): CamDelta {
  const u = Math.max(0, Math.min(1, (frame - (slam - frames)) / frames));
  const e = u * u * (3 - 2 * u);
  return { zoom: 1 + 0.06 * e };
}

// ---------------------------------------------------------------------------
// The painted cast — LIGHT[id] injected, unique boilKey, ground shadow
// ---------------------------------------------------------------------------

/** Body width per character at scale 1 (ground-shadow width; PaintDemo's numbers). */
export const BODY_W = { drip: 212, sunny: 330, cloudia: 300 } as const;

type PaintedExtra = {
  /** Scene id: picks LIGHT[id] and the boilKey prefix. */
  id: string;
  /** Override the scene's light (e.g. a dir aimed at Sunny's disc). */
  light?: LightRig;
  /** Unique per on-screen instance (two Drips in one scene need two keys). */
  boilKey?: string;
  paintOpts?: Partial<Omit<PaintOpts, "light" | "boilKey">>;
  /**
   * Ground contact y (scene px) to draw a GroundShadow under the body; omit
   * when airborne with no ground in frame. `altitude` (px above it) shrinks
   * and detaches it (×0.5 at 200 px). Skipped automatically in SHADOWLESS.
   */
  groundY?: number;
  altitude?: number;
  groundLum?: number;
};

function paintFor(who: string, p: PaintedExtra): PaintOpts {
  return { light: p.light ?? LIGHT[p.id], boilKey: p.boilKey ?? `${who}-${p.id}`, ...p.paintOpts };
}

const Shadow: React.FC<{ who: keyof typeof BODY_W; x: number; scale: number; p: PaintedExtra }> = ({ who, x, scale, p }) =>
  p.groundY === undefined || SHADOWLESS.has(p.id) ? null : (
    <GroundShadow
      x={x}
      y={p.groundY}
      bodyW={BODY_W[who] * scale}
      light={p.light ?? LIGHT[p.id]}
      altitude={p.altitude ?? 0}
      ground={p.groundLum ?? SCENE_SET[p.id]?.groundLum ?? 0.5}
    />
  );

export const PaintedDrip: React.FC<DripProps & PaintedExtra> = (props) => {
  const { id, light, boilKey, paintOpts, groundY, altitude, groundLum, ...rest } = props;
  const p = { id, light, boilKey, paintOpts, groundY, altitude, groundLum };
  return (
    <>
      <Shadow who="drip" x={rest.x} scale={rest.scale ?? 1} p={p} />
      <Drip {...rest} shadow={false} paint={paintFor("drip", p)} />
    </>
  );
};

export const PaintedSunny: React.FC<SunnyProps & PaintedExtra> = (props) => {
  const { id, light, boilKey, paintOpts, groundY, altitude, groundLum, ...rest } = props;
  const p = { id, light, boilKey, paintOpts, groundY, altitude, groundLum };
  return (
    <>
      <Shadow who="sunny" x={rest.x} scale={rest.scale ?? 1} p={p} />
      <Sunny {...rest} paint={paintFor("sunny", p)} />
    </>
  );
};

export const PaintedCloudia: React.FC<CloudiaProps & PaintedExtra> = (props) => {
  const { id, light, boilKey, paintOpts, groundY, altitude, groundLum, ...rest } = props;
  const p = { id, light, boilKey, paintOpts, groundY, altitude, groundLum };
  return (
    <>
      <Shadow who="cloudia" x={rest.x} scale={rest.scale ?? 1} p={p} />
      <Cloudia {...rest} paint={paintFor("cloudia", p)} />
    </>
  );
};

// ---------------------------------------------------------------------------
// Recurring props and scenery (re-pictured: ribbons + paint palette, no #fff)
// ---------------------------------------------------------------------------

/**
 * How far past the frame scenery has to reach for a pull-out below 1×.
 * Draw in ordinary composition coordinates.
 */
export const WIDE = { x: -1200, y: -500, w: 4400, h: 2200 } as const;

export const WideLayer = makeWideLayer(WIDE);

const PAPER = kidPaintTheme.paper;

/**
 * The live ocean surface for where water must MOVE or be touched (Drip on it,
 * liftoff). The painted mid/near ocean plates carry the look; this sits on
 * the near plane. Ep 1's WaterBand re-pictured: tapered ink tops (ribbon), the
 * paint palette, cream (never white) foam dabs. `warmth` 0..1 as ep 1.
 */
export const WaterBand: React.FC<{
  top: number;
  warmth?: number;
  dx?: number;
  opacity?: number;
  /** Ink colour for the wave tops. */
  ink?: string;
  /** Darken the whole band toward night (0..1). */
  dusk?: number;
}> = ({ top, warmth = 0, dx = 0, opacity = 1, ink = "#22304a", dusk = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tone = (c: string) => mixHex(mixHex(c, "#ffc98a", warmth * 0.2), "#141a3a", dusk * 0.55);
  const layers = [
    { dy: 0, amp: 18, wl: 760, speed: 0.5, fill: tone(kidTheme.waterLight), w: 3 },
    { dy: 40, amp: 24, wl: 540, speed: -0.75, fill: tone(kidTheme.water), w: 3.5 },
    { dy: 104, amp: 28, wl: 940, speed: 0.32, fill: tone(kidTheme.waterDark), w: 4.5 },
    { dy: 210, amp: 30, wl: 1200, speed: -0.24, fill: tone(kidTheme.waterDeep), w: 5 },
  ];
  const x0 = WIDE.x;
  const x1 = WIDE.x + WIDE.w;
  return (
    <WideLayer opacity={opacity}>
      <g transform={`translate(${dx} 0)`}>
        {layers.map((l, i) => {
          const pts: Pt[] = [];
          for (let x = x0; x <= x1; x += 40) {
            pts.push([x, top + l.dy + Math.sin((x / l.wl) * Math.PI * 2 + t * l.speed) * l.amp]);
          }
          const d = `M ${x0} ${WIDE.y + WIDE.h} L ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")} L ${x1} ${WIDE.y + WIDE.h} Z`;
          return (
            <g key={i}>
              <path d={d} fill={l.fill} />
              <path d={ribbon(pts, l.w, l.w * 0.3, 700 + i, { jitter: 0.8 })} fill={ink} opacity={0.75} />
            </g>
          );
        })}
        {Array.from({ length: 22 }, (_, i) => {
          const x = x0 + ((i * 291 + t * 44) % WIDE.w);
          const y = top + Math.sin((x / 760) * Math.PI * 2 + t * 0.5) * 18 - 8;
          return <ellipse key={i} cx={x} cy={y} rx={30} ry={6} fill={PAPER} opacity={0.4} />;
        })}
      </g>
    </WideLayer>
  );
};

/**
 * The name-arrow gag (ep 1): a chunky arrow that hops in and points at one
 * drop in a crowd. `x`/`y` is the tip. Painted: ribbon shaft, cream label,
 * ink-family border (no #fff).
 */
export const NameArrow: React.FC<{
  x: number;
  y: number;
  label: string;
  from?: number;
  dir?: "up" | "left" | "right";
  color?: string;
}> = ({ x, y, label, from = 0, dir = "up", color = kidTheme.tomato }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 11, mass: 0.6 } });
  if (s <= 0.001) return null;
  const bob = Math.sin((frame - from) / 6) * 10;
  const dx = dir === "left" ? -300 : dir === "right" ? 300 : 0;
  const dy = dir === "up" ? -280 : -170;
  const shaft: Pt[] = [
    [dx * 0.55, dy * 0.72],
    [dx * 0.42, dy * 0.5],
    [dx * 0.3 * 0.8, dy * 0.3],
    [0, -18],
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        transform: `scale(${s})`,
        transformOrigin: "0px 0px",
        zIndex: 35,
        fontFamily: kidTheme.fontFamily,
      }}
    >
      <svg width={10} height={10} viewBox="0 0 10 10" overflow="visible">
        <path d={ribbon(shaft, 24, 14, 811)} fill={color} />
        <path d="M -34 -66 L 0 -8 L 34 -66 Z" fill={color} stroke={color} strokeWidth={14} strokeLinejoin="round" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: dx,
          top: dy,
          transform: "translate(-50%, -50%)",
          background: color,
          color: PAPER,
          border: `8px solid ${kidPaintTheme.ink}`,
          borderRadius: kidRadius.pill,
          padding: "10px 34px",
          fontSize: kidType.label,
          fontWeight: 900,
          letterSpacing: 2,
          whiteSpace: "nowrap",
          boxShadow: kidShadow(1),
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Steam wisps rising off warm water (ep 1), cream and tapered. */
export const SteamWisps: React.FC<{
  x: number;
  y: number;
  count?: number;
  scale?: number;
  phase?: number;
  color?: string;
}> = ({ x, y, count = 3, scale = 1, phase = 0, color = PAPER }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {Array.from({ length: count }, (_, i) => {
        const cycle = (t * 0.42 + i * 0.31 + phase) % 1;
        const rise = cycle * 190;
        const sway = Math.sin(cycle * Math.PI * 2 + i) * 26;
        const o = Math.sin(cycle * Math.PI) * 0.6;
        const px = (i - (count - 1) / 2) * 54;
        const pts: Pt[] = [
          [px, 0],
          [px + 26 + sway, -42],
          [px + sway * 0.4, -84],
          [px - 26 - sway * 0.6, -126],
          [px + sway * 0.6, -168],
        ];
        return (
          <path key={i} d={ribbon(pts, 14, 4, 900 + i)} transform={`translate(0 ${-rise})`} fill={color} opacity={o} />
        );
      })}
    </g>
  );
};

/** Extra mood vignette (underwater / deep night) ON TOP of Post's own vignette — use sparingly. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.4 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 74% 74% at 50% 50%, transparent 38%, rgba(16,29,69,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// Placeholder scenes — the right set, light row and Post band, real audio
// ---------------------------------------------------------------------------

const PLACEHOLDER_MARKS: Record<Exclude<Speaker, "narrator">, Mark> = {
  drip: { x: 460, y: stand("drip", 900), scale: 1.0, who: "drip" },
  cloudia: { x: 980, y: stand("cloudia", 640), scale: 0.95, who: "cloudia" },
  sunny: { x: 1500, y: stand("sunny", 760), scale: 0.85, who: "sunny" },
};

function lightLabel(l: LightRig | undefined): string {
  if (!l) return "no LIGHT row";
  return `key ${l.key} @ ${l.dir}° elev ${l.elevation} · shadow ${l.shadow} · contrast ${l.contrast}`;
}

/**
 * Stand-in for a scene nobody has staged yet: its default set (SCENE_SET),
 * its light row on the painted cast, its Post band (from Video.tsx), the real
 * dialogue with every character mouthing their own lines. Drop the finished
 * scene in and the timeline does not move.
 */
export const ScenePlaceholder: React.FC<{ scene: TimedScene; title?: string }> = ({ scene, title }) => {
  const frame = useCurrentFrame();
  const cast = Array.from(
    new Set(
      (scene.turns ?? [])
        .map((t) => t.speaker as Speaker)
        .filter((s): s is Exclude<Speaker, "narrator"> => s !== "narrator"),
    ),
  );
  const marks: Cast = Object.fromEntries(cast.map((s) => [s, PLACEHOLDER_MARKS[s]]));
  const lineKey = useLineKey(scene);
  const set = SCENE_SET[scene.id] ?? SETS.ocean.morning;
  const cam = remasterCam(frame);
  return (
    <AbsoluteFill>
      <SetStack
        set={set}
        cam={cam}
        skyFit={set.sky === "layers_sky" ? "width" : undefined}
        stage={
          <>
            {cast.includes("drip") ? <PlaceholderDrip scene={scene} cast={marks} /> : null}
            {cast.includes("cloudia") ? <PlaceholderCloudia scene={scene} cast={marks} /> : null}
            {cast.includes("sunny") ? <PlaceholderSunny scene={scene} cast={marks} /> : null}
          </>
        }
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 60,
          display: "flex",
          justifyContent: "center",
          fontFamily: kidTheme.fontFamily,
        }}
      >
        <div
          style={{
            background: "rgba(243,234,216,0.86)",
            color: kidPaintTheme.ink,
            borderRadius: 24,
            padding: "14px 30px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: kidType.label, fontWeight: 900, letterSpacing: 3 }}>{title ?? scene.id}</div>
          <div style={{ marginTop: 6, fontSize: 30, fontWeight: 800 }}>
            {TIME[scene.id] ?? "?"} · {lightLabel(LIGHT[scene.id])}
          </div>
          <div style={{ marginTop: 4, fontSize: 28, fontWeight: 700, opacity: 0.8 }}>
            {lineKey ?? "…"} · staging to come
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PlaceholderDrip: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <PaintedDrip
    id={scene.id}
    x={PLACEHOLDER_MARKS.drip.x}
    y={PLACEHOLDER_MARKS.drip.y}
    scale={1}
    phase={PHASE.drip}
    emotion="happy"
    speaking={useSpeaking(scene, "drip")}
    look={useLookAtSpeaker(scene, cast, "drip")}
    groundY={900}
  />
);

const PlaceholderCloudia: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <PaintedCloudia
    id={scene.id}
    x={PLACEHOLDER_MARKS.cloudia.x}
    y={PLACEHOLDER_MARKS.cloudia.y}
    scale={0.95}
    phase={PHASE.cloudia}
    emotion="happy"
    clipboard
    speaking={useSpeaking(scene, "cloudia")}
    look={useLookAtSpeaker(scene, cast, "cloudia")}
    groundY={stand("cloudia", 640) + 180 * 0.95 + 60}
    altitude={60}
  />
);

const PlaceholderSunny: React.FC<{ scene: TimedScene; cast: Cast }> = ({ scene, cast }) => (
  <PaintedSunny
    id={scene.id}
    x={PLACEHOLDER_MARKS.sunny.x}
    y={PLACEHOLDER_MARKS.sunny.y}
    scale={0.85}
    phase={PHASE.sunny}
    emotion="proud"
    speaking={useSpeaking(scene, "sunny")}
    look={useLookAtSpeaker(scene, cast, "sunny")}
  />
);

// Re-exported so an act file needs one import for the whole kit.
export { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill };
export {
  BigWordBeat,
  CaptionCard,
  CloudiaHat,
  CutFlash,
  Camera,
  CastShade,
  GroundShadow,
  LightPool,
  PaintFill,
  Plane,
  Thermometer,
  World,
  burst,
  dissolve,
  emotionAt,
  follow,
  heldBeat,
  holdCreep,
  keyDirTo,
  kidPaintTheme,
  lineKeyOf,
  lineProgress,
  lineWindow,
  outlinePath,
  project,
  ribbon,
  roundRectPath,
  turnFor,
  withCam,
} from "../../../lib/kid";
export { PLATES };
export type { Cam, CamDelta, LightRig, PlateKey, Pt, TimeOfDay };
export type { TimedScene };
