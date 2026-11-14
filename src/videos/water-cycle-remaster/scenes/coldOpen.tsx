import type React from "react";
import type { TimedScene } from "./common";

// STUB (skeleton builder). The owning act builder replaces this file: export
// a Record<sceneId, React.FC<{ scene: TimedScene }>>; unlisted ids render
// ScenePlaceholder (right band, right light row, real audio).
export const COLD_OPEN_SCENES: Record<string, React.FC<{ scene: TimedScene }>> = {};
