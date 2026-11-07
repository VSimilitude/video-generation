import React from "react";
import { Freeze, useCurrentFrame } from "remotion";

// Stepped — drawing "on twos" (or threes) for the character layer.
//
// Everything in the rig is a smooth function of frame, so at 30 fps every
// frame is a new pose and the motion reads as motion graphics rather than
// animation. `<Stepped n={2}>` quantises time for its subtree: Remotion's
// `<Freeze frame={q}>` overrides `useCurrentFrame()` for every descendant, so
// each pose is held for `n` frames without touching the rig. n=2 is 15 poses/s
// (classic twos at 24), n=3 is 10/s (threes). n<=1 renders children unchanged
// — use it for fast beats (a dash, a slam, a spin), which want ones.
// Composition fps stays 30: narration timing and the phone pipeline depend on
// it. See docs/ANIMATION-ROADMAP.md, Step 1.
//
// WRAP THE CHARACTER LAYER OF A SCENE — NEVER AUDIO, BACKGROUNDS, CAMERA OR
// TEXT. The look this is after is "smooth world, stepped characters": the
// plate, clouds, waves, particles, camera moves, text draw-ons and graphs stay
// on ones and keep the frame alive while the puppets hold. Specifically:
//
//   - Audio (`DialogueAudio`, `<Audio>`) must stay outside. A frozen
//     timeline is a paused one, and an audio element under it would be
//     re-seeked / stalled every held frame.
//   - Backgrounds, camera and text stepped with the characters just make the
//     whole picture look like a 15 fps video, which is the opposite effect.
//   - Wrap at the LAYER, not the component: any x/y travel (`moveAlong`,
//     `lookAt` targets, `isSpeaking`) computed in the scene body above the
//     wrapper is still evaluated on the real frame and stays smooth. Put the
//     code that reads `useCurrentFrame()` for the characters inside the
//     subtree (a small component), so the travel steps with the pose.
//
// Nested `<Sequence>`s inside see the frozen frame, which is what we want.

export const Stepped: React.FC<{ n?: number; children: React.ReactNode }> = ({
  n = 2,
  children,
}) => {
  const frame = useCurrentFrame();
  if (n <= 1) return <>{children}</>;
  return <Freeze frame={Math.floor(frame / n) * n}>{children}</Freeze>;
};
