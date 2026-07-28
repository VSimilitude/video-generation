// The kids' series toolkit. One import for a kid composition:
//
//   import { KidBackdrop, Drip, Sunny, Cloudia, SpeechBubble, WordCard,
//            kidTheme } from "../../lib/kid";
//
// Nothing here touches src/lib/theme.ts or src/lib/components/: the kids' world
// and the dark financial world share the timing library (src/lib/narration.ts)
// and nothing else.
//
// Roughly, in the order an episode meets them:
//
//   theme.ts        colours, type scale, radii, shadows
//   rig.ts          emotions and their morphs, easing, idle, blink, look, travel
//   Character.tsx   the frame + face every body is built on
//   characters/     the cast, the cameo bodies, and faceless air
//   lines.ts        line-key -> turn lookups (the timeline's own vocabulary)
//   staging.tsx     marks, ground lines, bubbles' headroom, the camera
//   BigWord.tsx     the Big Word signature beat
//   props.tsx       drawn furniture that recurs across episodes
//
// An episode binds the cast-shaped parts of this in its own
// `scenes/common.tsx` and re-exports the rest, so its act files have one
// import. What lives in an episode is its cast; what lives here is the show.

export * from "./theme";
export * from "./rig";
export * from "./lines";
export * from "./staging";
export { CharacterFrame, Face, useRig, type CharacterProps, type Rig } from "./Character";
export { BigWordBeat, CutFlash } from "./BigWord";
export { CaptionCard, CloudiaHat, Thermometer } from "./props";
export { KidBackdrop, type KidBackdropProps } from "./KidBackdrop";
export {
  KidPaintedBackdrop,
  KidContactShadow,
  type KidPaintedBackdropProps,
} from "./PaintedBackdrop";
export { SpeechBubble, MAX_BUBBLE_WORDS, type SpeechBubbleProps } from "./SpeechBubble";
export { WordCard, type WordCardProps } from "./WordCard";
export { AirBlob, airBlobPath } from "./characters/AirBlob";
export { Drip, type DripProps } from "./characters/Drip";
export { Rock } from "./characters/Rock";
export { Puff, type PuffProps, type PuffPose } from "./characters/Puff";
export { Sunny, type SunnyProps } from "./characters/Sunny";
export { Cloudia, type CloudiaProps } from "./characters/Cloudia";
export { Blobby, BlobbyCrowd, type BlobbyProps } from "./characters/Blobby";
