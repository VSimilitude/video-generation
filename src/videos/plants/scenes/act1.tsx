// ACT ONE — THE LIGHT (scenes s05_sunrise … s10_puddle).
//
// B3 act file. Owned by the act-1 builder; nobody else edits it. Video.tsx
// spreads ACT1_SCENES into its SCENES registry — staging a scene here is
// adding its component to the record, nothing else to wire.
import type React from "react";
import type { TimedScene } from "../../../lib/narration";

export const ACT1_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {};
