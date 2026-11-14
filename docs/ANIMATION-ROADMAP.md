# Animation roadmap — puppets, poses, and stepped timing

Status 2026-11-14: Step 1 (twos) tested and rejected; **Step 2 is now the LOOK PACKAGE** (five gaps, not just the medium), ruled by Mike 2026-11-14 and being built as the ep-1 remaster (`DripWaterCycleRemaster`, src/videos/water-cycle-remaster/brief.md). Steps 3–5 trimmed to what still applies. Origin: a Reddit creator whose Remotion video
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

## What the Reddit video's lineage actually is (found 2026-11-06)

reddit.com is unreachable from this box, but the setup described in the
reply matches a public kit: **JohnHeibel/ClaudeAnimationBase** (2.6k stars,
Sep 2026) and the six-minute film built on it, **raiscan/all-that-time-saved**
(YouTube G2m9CwD_ocY, "All That Time Saved" by UncleHerbert, animation and
code by Claude Opus 5.5). Both repos are cloned read-only in the session
scratchpad; the kit is MIT.

It is **not Remotion**. It is p5.js + p5.brush rendered headless by
Puppeteer, one pure function of time per shot, exactly our contract. What
makes it read as hand-made is **the medium**, not the rig and not the
frame rate (the film's own rule is "puppets on twos, camera on ones", and
Mike rejected twos on our tweens anyway):

- every shape is painted: flat wash + watercolour layer with edge bleed and
  pigment texture, paper grain under everything, a vignette;
- every outline is one continuous **tapered ink stroke**, never a uniform
  SVG stroke; "plain shapes look like 2000s Flash" is the kit's first rule;
- vertices are **jittered** per element and **re-seeded 12×/s** ("boil"),
  so linework crawls while nothing else steps (`boilSeed(key)` per element
  so still things do not jitter);
- a **soft palette**, no pure black or white, few hues, one body colour in
  three values;
- the character is crude (a block with four legs) but has **31 acted
  emotions** where ~12 change the body or add a painted emote (sweat,
  hearts, bulb, rain cloud) and a colour tint (pale/flushed/green);
- turns are **drawn key views** (front, 3/4, side, back 3/4, back) with
  smears, never a projected rotation;
- a 460-line ANIMATION_GUIDE.md the model reads first: three goals
  (handmade, alive, one piece), "no text", "something happens in every
  scene", **timing by reads** (list what the viewer must understand, give
  each read time, one read at a time), transitions at every seam, and a
  review loop of contact sheets / frame strips / crops at three zooms.

Fork comparison of the kit's model sheets against our KidDemo and
BoomStorm stills (text report, 2026-11-06): our silhouettes and designs are
**better**; we lose on uniform strokes, flat fills and smooth gradients,
geometric edges, specular white shines, saturated primaries + pure white,
no paper, no boil. "Clean vector UI illustration" versus "painted".

The film's repo adds, for later: a parametric human rig with named poses
and an IK `reach()` whose elbow never flips (elbow pops 21 → 3), replacement
mouths lip-synced from forced-aligned lyrics, five media (rubber hose, cut
card, riso, banknote, doodle) each with motion rules, and a polish
checklist of pose/staging failures the director caught.

## Step 2 — the LOOK PACKAGE (spec, 2026-11-14)

Keep SVG, keep the rig, keep Remotion, keep soft gouache storybook. Close the
five gaps named in memory `ai-graphics-standard-practice-2026` with the
reference repo's METHOD (claude-animated-shorts: measured bible, post chain,
camera grammar, lit characters, scored verifier) — not its ink-on-3D look.

**What the stills comparison found for OUR material**
(`scratchpad/remaster/stills-comparison.md`, fork, 6 ep-1 stills + KidDemo
vs 8 reference frames): gap 1 (medium/post) dominates every still; gap 3
(light never touches characters: Drip lit identically at dawn, noon and
indoors; no ground shadow in any episode scene) second; gap 4 (one plane:
same sharpness/saturation/line weight at every depth) third; gap 2 (camera:
eye-level, centred, no tilt or push) fourth in a still, probably higher in
motion; gap 5 is a process gap whose symptoms are everywhere (p98 = 1.00 in
every frame, s13 40% pure white, high-key everywhere). Measured: our p2
0.20–0.37 vs ref 0.07–0.17; lum mean 0.46–0.78 vs ref 0.26–0.60 moving with
the beat; saturation mean 0.53–0.64 vs ref 0.45–0.65 reserved by mood. Hue
count is fine (3–7 bins) — **the gap is value structure, not hue**. Keep what
we beat them on: silhouettes, designs, the face rig, readability, diagram
scenes, per-character hue identity. **Faces are masked from displacement and
blur.**

### Mechanisms, per gap (all pure functions of frame; additive modules under `src/lib/kid/`)

**Gap 1 — painted medium + post chain** (`paint.tsx`, `post.tsx`, `strokes.ts`)
1. *Paper + palette.* One committed paper plate (`public/kit/paper.webp`,
   2048², tileable) at `mix-blend-mode: multiply` 0.18 over the whole frame
   plus `soft-light` 0.10; radial vignette (see bible). `kidPaintTheme`: ink =
   #2b2a33 (cool near-black, never #000), paper = #f3ead8 (cream; the
   brightest allowed value), each body colour in THREE values (shadow / base /
   light) replacing today's base + gradient + shine.
2. *Tapered outlines.* `ribbon(points, w0, w1, seed)` → variable-width
   filled path (perfect-freehand `getStroke` with `thinning` 0.6, start/end
   taper; deterministic by seed). Hero outlines first: Drip body, Sunny disc +
   rays, Cloudia body. Uniform `stroke=` remains only for details < 2 px.
3. *Painted fills.* `PaintFill`: flat base colour + a turbulence-alpha
   second layer (feTurbulence baseFrequency 0.012, 2 octaves) darkening the
   low 35% of the shape (pooled band, −12 L) and lightening the top 20% (dry
   band, +8 L); edges get a 2–3 px bleed (`feMorphology dilate` + blur, alpha
   0.35). **Delete gradients and specular shines** from the paint variants.
4. *Wobble + boil.* `Boil` wrapper: `feTurbulence` (baseFrequency 0.02,
   octaves 1) + `feDisplacementMap` scale 2.5 px on each character and prop
   `<g>`, `seed = hash(boilKey) + floor(frame / 3)` (10 re-seeds/s); filter
   region padded 8%; faces excluded (`Face` rendered outside the filtered
   group). Everything else stays on ones.
5. *Post chain* (`<Post>` around the composition, in this order): grade
   (saturation ×0.92 by day, ×0.85 at night via `feColorMatrix`; lift blacks
   so p2 lands in the bible band) → soft bloom on the key light only
   (Sunny's disc, lamps: `feGaussianBlur` 18 px, `screen` 0.25, masked) →
   grain (paper plate, above) → vignette. No lens blur full-frame; blur is
   per plane (gap 4).

**Gap 3 — lighting that touches the characters** (`light.ts`, `Shadowed.tsx`)
- `LightRig` prop on every scene: `{ dir: degrees, elevation: 0–1, key: hex,
  shadow: hex, contrast: 0–1 }` from the episode's light script (brief §4).
- *Cast shading:* each character body gets a `shade` layer: an offset copy
  of its silhouette filled with the shadow colour at 0.25–0.4 alpha, pushed
  away from the key by `6 px × (1 − elevation)` and blurred 6 px, clipped to
  the body; a 2 px rim of the key colour on the lit edge (alpha 0.3). Faces
  untouched.
- *Ground shadow:* `GroundShadow` ellipse on the ground plane under every
  standing character: width 0.9× body, height 0.18× body, offset along the
  key direction by `0.35 × body × (1 − elevation)`, colour = scene shadow
  colour at 0.3, blur 8 px; detaches and shrinks (×0.5 at 200 px altitude)
  when the character hovers; absent only in the shadowless scene (s21).
- *Light pools:* lamps and Sunny project a soft cone (`radial-gradient`
  screen 0.2) onto the plane behind them; tints the character within it.

**Gap 4 — multi-plane world** (`Planes.tsx`)
- A `World` wrapper takes `cam` (existing `Cam`) and children `Plane`
  elements, each `{ depth: ∞|0.15|0.4|1.0|1.3, src|children }`. Translate =
  `camera.pan × depthFactor`, scale = `1 + (cam.zoom − 1) × depthFactor`.
  Characters are children of the depth-1.0 plane.
- *Atmosphere by depth:* far planes get lift (+8 L), desaturation (×0.7),
  and 1.5 px blur; mid: +3 L, ×0.9, no blur; foreground (1.3): −4 L,
  2.5 px blur, ink weight ×1.3.
- Plates come from `backgrounds.mjs` as one prompt PER PLANE with an alpha
  mask step (sky plane opaque; far/mid/near plates generated on flat key
  colour and keyed, or painted with a matching horizon cut); the brief lists
  the plane recipe per location. Decision (remaster log D8): plain 2D
  layers, NOT `@remotion/three` — software WebGL in headless Chrome on a
  GPU-less WSL2 box would multiply render time; 2D parallax is a transform
  per plane.

**Gap 2 — camera and motion grammar** (`camera.ts` additions)
- `holdCreep(frame, from, seconds)`: every hold creeps (push-in 1.00→1.02
  over 6 s, or drift ≤0.3 px/frame); holds ≥70% of episode frames.
- `burst(frame, at, delta)`: ease-out burst — peak velocity on frame 1 of
  the move, decaying to <0.5 px/frame within 8–12 frames (reference: 720p
  px/frame 6, 26, 12, 14, 6, 5, 2, 1 scaled ×1.5 for 1080p).
- `follow(subject)` for transitions where an object carries the eye
  (Drip's liftoff, the slide, the river); seams between scenes = 6–8 frame
  dissolve or a continuous move; hard cuts ≤1 per scene; `CutFlash` stays
  for Big Words.
- Dutch tilt 2–4° only in drama beats (slosh, liftoff, check-out slide, the
  moose); low camera (horizon in the top third) when Drip is small among
  big things; push-in 1.00→1.06 over the reveal on every Big Word.
- Blink schedule: 1 blink / 3–5 s, 6-frame close–open, never during a
  `CutFlash`; `rig.blink` already exists — the rule is the schedule.

**Gap 5 — the numeric LOOK bible + scored verifier** — below.

### LOOK bible (numbers; the verifier measures these on 640 px thumbnails, Rec.709 luminance, HSV saturation)

| Dimension | Day | Interior / overcast | Night / dawn | Rule |
|---|---|---|---|---|
| Luminance mean | 0.45–0.62 | 0.35–0.50 | 0.22–0.40 | ≥3 scenes of the episode < 0.40; none > 0.70 |
| Luminance std | 0.16–0.24 | 0.14–0.22 | 0.12–0.20 | tonal range comes from light, not from saturation |
| p2 (blacks) | 0.14–0.20 | 0.10–0.16 | 0.08–0.14 | ink is #2b2a33; nothing is #000 |
| p98 (whites) | ≤ 0.96 | ≤ 0.94 | ≤ 0.80 | no pixel > 0.96; paper cream is the ceiling; clouds are never #fff |
| Pure-white fraction (>0.97) | < 0.5% | < 0.5% | < 0.1% | cards included |
| Saturation mean | 0.38–0.50 | 0.30–0.42 | 0.30–0.45 | reserved for the lit side and the hero |
| Saturation p90 | ≤ 0.75 | ≤ 0.65 | ≤ 0.72 | |
| Hue bins > 2% (of 24) | 3–6 | 3–5 | 3–5 | per-character hue identity kept |
| Ink weight near / mid / far | 5 / 3.5 / 2 px (tapered, ×1.3 at depth 1.3) | same | same | measured as edge-width median on the strip |
| Stroke-width CV (uniformity) | ≥ 0.35 | | | 0 = uniform SVG stroke, the tell |
| Grain | multiply 0.18 + soft-light 0.10 | 0.22 + 0.12 | 0.22 + 0.12 | visible at 1080p, invisible on the phone cut |
| Vignette | 0.18 edge darkening, radius 0.75 | 0.22 | 0.28 | |
| Ground shadow | present under every standing body | present | present | absent only in s21 |
| Camera holds | ≥ 70% of frames at < 0.5 px/frame | | | every hold creeps |
| Burst decay | peak frame 1, < 0.5 px/frame by frame 12 | | | |
| Hard cuts | ≤ 1 per scene; seams = 6–8 f dissolve or move | | | |
| Dutch | 0° default; 2–4° drama only | | | |
| Blinks | 1 per 3–5 s, 6 f | | | |
| Boil | 10 re-seeds/s, 2.5 px | | | faces excluded |

Band exceptions (act-1 review, 2026-11-14): sky/ocean-dominated day frames
may sit at saturation mean ≥ 0.32; sky-only frames (airborne, Sunny alone)
may have p2 ≤ 0.30; gradient-sky frames may show up to 8 hue bins. Cards
keep their own rows. `verify.py --sky` applies these.

### Verifier rubric (fork scores each still 0–10; `scratchpad/remaster/verify.py` supplies the numbers)

| # | Dimension | 10 looks like | 5 looks like | Pass |
|---|---|---|---|---|
| V1 | Medium | tapered ink, pooled fills, bleed, grain visible at 100% | taper present, fills still flat | ≥ 7 |
| V2 | Value structure | bands in the bible for the scene's time of day; no pure white | one band out | ≥ 7 |
| V3 | Light on characters | cast shade + rim consistent with the key; ground shadow matches | shadow present, direction wrong | ≥ 7 |
| V4 | Depth | ≥ 3 planes read; far lifted/soft; overlap + scale | 2 planes, same sharpness | ≥ 6 |
| V5 | Camera | framing per the shot plan; horizon/tilt deliberate | centred eye-level default | ≥ 6 |
| V6 | Palette | ≤ 6 hue bins, saturation reserved | saturated everywhere | ≥ 7 |
| V7 | Readability (ours to keep) | silhouette + face read at phone size; bubbles clear of signs | one occlusion | ≥ 8 |
| V8 | Consistency | same Drip across the sheet; shared baseline; one light | one drift | ≥ 8 |

Pass = every dimension at or above its threshold AND mean ≥ 7.5 AND the
numeric columns inside the bible band for the scene's time of day. A fail
names the dimension and the bible row; the builder fixes the mechanism, not
the still.

### Render-cost budget

Baseline: an ep-1 scale frame at 1080p renders ≈ 0.25 s/frame on this box
(measure first: 10 s of `DripWaterCycle` at `--scale=1`). Budget for the
look package: **≤ 2.5× baseline** at `--scale=1` (≈ 36 min / 10 min of
episode) and ≤ 2× at `--scale=0.25`. Measured on the `PaintDemo` 10 s clip
with filters on/off; if over budget, in this order: drop the bleed layer,
coarsen boil to 8 re-seeds/s, apply displacement per character not per
prop, drop per-plane blur in favour of pre-blurred plates. Never drop the
ground shadows or the grade.

### Engineering calls (confirmed by `scratchpad/remaster/ref-method-memo.md`; remaster log D8–D11)

- Remotion stays at 4.0.498. `@remotion/effects` is REJECTED: it renders
  via WebGL/WebGPU on Chrome's HTML-in-canvas path, which cannot run in the
  `@remotion/player` gallery on iPhone. All mechanisms are SVG filters + CSS.
- Blink: gap 0.5–2.3 s, 4-frame half/shut/shut/half, and a blink across
  every expression swap (reference measurement) — supersedes the 3–5 s row.
- Tapered strokes: `perfect-freehand` (tiny, ESM, deterministic given fixed
  points); `roughjs` only if hachure fills are wanted later.
- Multi-plane: 2D layers (above), not `@remotion/three`.
- Verifier: python3 + PIL/numpy if present, else node + `sharp` (already in
  node_modules; the fork's `scratchpad/remaster/stats.mjs` is the seed).

### Gate before any episode scene is built

Hidden `PaintDemo` composition: three stills twice (flat vs painted) — Drip
on the dawn ocean, Sunny's intro, a Cloud Hotel interior with Cloudia — each
with planes, light rig and post on. A fork scores the painted side on V1–V8;
pass per the rubric or iterate the kit. Then the 10 s cost measurement.
Adoption for ep 7+ = a STYLE.md "Medium" section after Mike judges the
remaster tile; episodes 1–6 are not back-ported unless he asks.

## Step 3 — acting (still applies, after the look package)

Drawn key views per character (front, 3/4, side) with `turn()` smears,
`take()`/`jump()` rig verbs, painted emotes (`!`, `?`, sweat, hearts, bulb,
zzz) that pop by the head, a tint column in `EMOTIONS`, and "timing by
reads" + the contact-sheet/strip/crop review loop in
docs/roles/scene-builder.md. Each is a rig.ts addition in the existing
style. Not part of the remaster unless a scene needs one.

## Step 4 — pose-track puppet layer (deferred)

A scene keys poses at times; `poseAt(frame, track)` lerps joint angles with
anticipation/overshoot/settle over a small named-joint tree per character,
with a per-character pose library and a `KidDemo` pose sheet. Drip first.
Spec stays as written in git history (this file before 2026-11-14); revive
only if acting plateaus after Step 3.

## Step 5 — later, only if the above plateau

Painted parts on the puppet (AI textures on SVG limbs) once a pose layer
exists; a 60 fps container only if camera smoothness is ever the complaint.

## Non-goals

Engine moves (Rive/Lottie/Blender/Three) stay rejected: the still-review +
instant-deploy loop is worth more than any single visual gain.
