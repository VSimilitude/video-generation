// ACT TWO — THE WATER (scenes s11_rain_campaign … s16_leaf).
//
// B3 act file. Owned by the act-2 builder; nobody else edits it. Video.tsx
// spreads ACT2_SCENES into its SCENES registry — staging a scene here is
// adding its component to the record, nothing else to wire.
import type React from "react";
import type { TimedScene } from "../../../lib/narration";

export const ACT2_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {};
