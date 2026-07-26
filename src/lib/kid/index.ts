// The kids' series toolkit. One import for a kid composition:
//
//   import { KidBackdrop, Drip, Sunny, Cloudia, SpeechBubble, WordCard,
//            kidTheme } from "../../lib/kid";
//
// Nothing here touches src/lib/theme.ts or src/lib/components/: the kids' world
// and the dark financial world share the timing library (src/lib/narration.ts)
// and nothing else.

export * from "./theme";
export * from "./rig";
export { CharacterFrame, Face, useRig, type CharacterProps, type Rig } from "./Character";
export { KidBackdrop, type KidBackdropProps } from "./KidBackdrop";
export {
  KidPaintedBackdrop,
  KidContactShadow,
  type KidPaintedBackdropProps,
} from "./PaintedBackdrop";
export { SpeechBubble, MAX_BUBBLE_WORDS, type SpeechBubbleProps } from "./SpeechBubble";
export { WordCard, type WordCardProps } from "./WordCard";
export { Drip, type DripProps } from "./characters/Drip";
export { Puff, type PuffProps, type PuffPose } from "./characters/Puff";
export { Sunny, type SunnyProps } from "./characters/Sunny";
export { Cloudia, type CloudiaProps } from "./characters/Cloudia";
export { Blobby, BlobbyCrowd, type BlobbyProps } from "./characters/Blobby";
