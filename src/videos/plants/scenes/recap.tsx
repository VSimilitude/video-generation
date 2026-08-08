// RECAP + GOODNIGHT (scenes s27_curtain_call … s29_goodnight, and the end
// card).
//
// B3 act file. Owned by the recap builder; nobody else edits it. Video.tsx
// spreads RECAP_SCENES into its SCENES registry — staging a scene here is
// adding its component to the record, nothing else to wire.
import type React from "react";
import type { TimedScene } from "../../../lib/narration";

export const RECAP_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {};
