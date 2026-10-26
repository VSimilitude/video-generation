// The volcano lives in the kit now: `src/lib/kid/characters/Volcano.tsx`
// (promoted in the ep-6 skeleton wave, zero-diff gated on EmberVolcano). This
// re-export keeps every ep-5 import of "./Volcano" byte-identical.
export {
  VOLCANO_PORTRAIT,
  makeVolcano,
  volcanoFace,
  type VolcanoProps,
} from "../../../lib/kid/characters/Volcano";
