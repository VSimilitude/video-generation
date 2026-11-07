# Animation roadmap — puppets, poses, and stepped timing

Status: Step 1 TESTED AND REJECTED 2026-11-06 (see verdict below); Step 2 is the open proposal. Origin: a Reddit creator whose Remotion video
read as noticeably better than ours explained his setup as (1) tools and
systems Claude animates *with*, (2) graphics on a puppet-and-rig system so
Claude poses puppets instead of drawing every frame, (3) drawing "on twos"
(a new pose every other frame of a 24fps video), with fast sections on ones
and slow ones on fours, inside a 60fps container.

This doc maps those three onto what `src/lib/kid/` already does, names the
gaps, and specifies the work in the order it should land. Mike decides
after step 1's A/B render.

## Where we already stand

- **Systems to animate with: largely YES.** `rig.ts` (pure frame → number
  functions: idle squash, blink, mouth, emotion morph, entrances/exits,
  arcs, trail, settle) and `staging.tsx` (body geometry, marks, camera) are
  exactly "tools for Claude". A scene file poses by props
  (`x y scale emotion look enter exit speaking`), never by drawing.
- **Puppet/rig: HALF.** Faces are a real rig (`EmotionSpec` knobs, morphs,
  follow-through). Bodies are not: each character is a hand-coded SVG with
  at most a few bespoke arm poses (`Drip.pose: rest|hips|cheer|clutch`, Pip's
  `point` leaf). There is no skeleton, no named joints, no general "pose" a
  scene can key over time. Body acting is therefore rare, and when a scene
  wants it a builder writes new SVG per episode.
- **Timing: NO.** Everything interpolates continuously at 30 fps. Smooth
  sine tweens on every frame read as motion graphics, not animation. This is
  the single cheapest gap to test.
- **Painted graphics:** backgrounds are AI plates already (Tier 2 of
  `graphics-roadmap`). Characters are vector and should stay vector for now:
  six episodes of identity, and the still-review loop depends on the SVG
  being editable to the byte.

## Step 1 — stepped timing A/B (cheap; do first)

**Mechanism.** Remotion's `<Freeze frame={q}>` overrides `useCurrentFrame`
for its children, so a wrapper quantises time for everything inside it
without touching the rig:

```tsx
// src/lib/kid/Stepped.tsx
export const Stepped: React.FC<{ n?: number; children }> = ({ n = 2, children }) => {
  const frame = useCurrentFrame();
  if (n <= 1) return <>{children}</>;
  return <Freeze frame={Math.floor(frame / n) * n}>{children}</Freeze>;
};
```

Wrap the **character layer** only. Backgrounds, camera moves, particles,
text draw-on, graphs and `DialogueAudio` stay outside and smooth: this is
how the Reddit mix of "15 and 30 fps in places inside a 60 fps video" works.
Composition fps stays 30 (the phone/YouTube pipeline and all narration
timing depend on it): `n=2` is 15 poses/s (≈ classic twos at 24), `n=3` is
10/s (≈ threes). Fast beats (a dash, a slam, a spin) use `n=1`.

Checks: `Freeze` must not sit around `<Audio>`/`DialogueAudio`; nested
`<Sequence>`s inside see the frozen frame, which is what we want; a scene
whose x/y travel is computed in the scene body is still smooth unless that
computation is inside the wrapper, so wrap at the layer, not the component.

**Deliverable.** A hidden composition `StepDemo` (registry pattern of
`KidDemo`): the same ~8 s beat rendered four ways in sequence, each with a
big label: ONES (30/s), TWOS (15/s), THREES (10/s), then a split screen
ONES | TWOS. The beat: Drip bounce-enters, walks an arc across the frame,
emotion cue neutral → excited, speaks for ~3 s with a bubble, Sunny reacts
with a look and emotion change, Drip zip-exits. Render
`out/StepDemo.mp4`, plus a phone cut. Mike watches it; the decision is
"which n is the house default, and which beats go on ones".

**If adopted:** `Stepped` becomes part of the scene kit; `docs/STYLE.md`
"Motion craft" gets a rule (default n, exceptions); episodes 1–6 are *not*
retrofitted unless Mike asks.

### Step 1 verdict (Mike, 2026-11-06, phone cut of `StepDemo`)

"Not impressed with the rate differences; ones seems slightly better than
twos." **Stepping is NOT adopted.** Composition stays 30 fps on ones.
Why it did not transfer: twos helps hand-drawn work because every drawing
is a distinct pose; our motion is tweened between the same shapes, so
holding frames only adds judder to a tween. The real difference in the
Reddit video was the *poses*, not the frame rate — which is Step 2.
`Stepped` and `StepDemo` stay in the tree as a hidden workbench; do not
use `Stepped` in an episode.

## Step 2 — pose-track puppet layer (the real win; spec, then Opus builds)

Goal: a scene keys *poses at times*; the system handles in-betweens,
anticipation, overshoot, settle, holds, and stepping. "Claude poses the
puppet" means a scene reads like:

```tsx
<Drip x={…} y={…}
  poses={[
    { at: 0,   pose: "rest" },
    { at: 40,  pose: "point", side: "right", ease: "snap" },   // 6-frame anticipation + overshoot built in
    { at: 130, pose: "shrug", hold: 45 },
    { at: 200, pose: "cheer" },
  ]}
/>
```

Design (all pure functions of frame, same contract as `rig.ts`):

- **Skeleton.** A small named-joint tree per character, declared as data:
  `root → torso → head`, `torso → shoulderL → elbowL → handL` (same right),
  optional `hipL/R → footL/R`. Each joint has rest angle, length, and a
  clamp range. Characters without arms (Pip, Ray, blobs) declare a smaller
  tree; the pointer leaf is just a joint.
- **Pose.** `Record<JointName, degrees>` plus `root` offset and squash. A
  per-character **pose library** (`POSES.drip.point`, `…wave`, `…shrug`,
  `…lean`, `…cheer`, `…clutch`) is where the drawing craft goes; a scene
  only names them, or passes a partial override.
- **Pose track.** `poseAt(frame, track)` lerps joint angles with `kidEase`
  defaults (anticipate → easeOutBack → settleWave), mirrors `emotionAt`'s
  "from is whatever the last change left" rule, supports `hold` and
  per-key `ease`, and quantises with `Stepped`. Holds with a tiny idle
  overlay so a held pose still breathes.
- **Parts.** Existing SVG limb/accessory shapes get re-rooted at joints via
  `<Joint name="elbowL">` groups: today's `Arms pose=…` in Drip.tsx becomes
  the first pose library. No character redraw: the silhouettes stay.
- **Lip/face unchanged.** The face rig stays as is; `EmotionCue` and
  `poses` are independent tracks a scene keys separately, like a real
  dope sheet.
- **Workbench.** `KidDemo` gets a pose sheet scene: every library pose for
  every character as a grid still, so forks can review poses like faces.

Order: Drip first (he has arms and the most scenes), then Sunny and
Cloudia, then the storm cast. Pip/Ray get `point`/`lean` only.

## Step 3 — later, only if 1–2 plateau

- Painted *parts* on the puppet (AI-generated textures on the SVG limbs,
  consistency via the still-review loop) — the second half of the old
  Tier 2. Not before the pose layer exists; there is nothing to pose yet.
- 60 fps container with ones/twos/fours mixing — only if YouTube motion
  smoothness of camera moves is ever the complaint. Doubles render time.

## Non-goals

Engine moves (Rive/Lottie/Blender) stay rejected for the reasons in the
graphics roadmap: the still-review + instant-deploy loop is worth more than
any single visual gain.
