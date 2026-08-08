// ACT THREE — THE AIR, AND THE KITCHEN (scenes s17_air_order … s26_button).
//
// B3 act file. Owned by the act-3 builder; nobody else edits it. Video.tsx
// spreads ACT3_SCENES into its SCENES registry — staging a scene here is
// adding its component to the record, nothing else to wire.
import type React from "react";
import type { TimedScene } from "../../../lib/narration";

export const ACT3_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {};
