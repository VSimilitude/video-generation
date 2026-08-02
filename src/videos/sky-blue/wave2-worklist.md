# Ep 3 wave-2 staging worklist — showrunner, 2026-08-02

Merged from: `scratchpad/ep3_wave1_audit.md` (the wave-1 audit),
`script.md:2282-2328` (the builder's own staging worklist — audited accurate
and sized), `docs/HANDOFF.md`'s wave-2 section, and `revision.md` + its three
addenda. HANDOFF's suggested batch structure is KEPT — the audit gave no
reason to change it — with a kit-prerequisite layer added in front, because
every scene row depends on it.

## Wave-1 audit outcome (context for builders)

- **CONFIRMED 41 · MISSING 1 · WRONG 9 · wave-2 expected-absent 6 · accepted
  deviations 3.** The script layer is substantively correct: every line text,
  key, voice, speed, pitch, emotion, gap and alias checked matches the spec;
  both TTS caches complete; manifest ↔ narration ↔ Video.tsx in exact 208-key
  sync; alias audio md5-identical. Full evidence: `scratchpad/ep3_wave1_audit.md`.
- **All nine WRONGs were doc/comment drift and are FIXED in the audit wave**
  (2026-08-02, this session): Video.tsx Scene 23 beat comment now says the grin
  GROWS (was the deleted wrongness ceremony — the one find that would have
  shipped a broken beat); Video.tsx Scene 16 comment now the empty tray; plus
  seven count/gap corrections in script.md and narration.mjs. No behaviour
  changed; cache still reports 0 to synthesize; gates re-run green.
- The episode is **36 scenes** (race split into `s28b_race_island` +
  `s28c_red_arrives` — accepted deviation D1); `s28_blue_runs_out` keeps its
  id and nothing is renumbered.

## Showrunner rulings (made this wave — carry into briefs, do not re-open)

- **R1 — Roll call stays reply-free (audit MISSING M1).** Addendum 2's
  "six replies — hang the lantern" roll-call line-home is DECLINED, accepting
  the builder's written craft argument (script.md:603-607): the three-episode
  roll-call shape (name → flat narrator line → unbothered button) is a series
  signature and a spoken reply breaks it. The addendum's binding core is fully
  delivered elsewhere (six speak, Violet alone silent, line-is-personality; the
  lantern is hung by `a3_13d_yellow` "Great bounce, Violet!"). Flagged to Mike
  as override-able at the family screening; reversal costs six MiniMax clips
  (cents) + a Scene 10 re-time.
- **R2 — Runtime 13:36.1 stands, flagged.** Addendum 1: "budget approved
  implicitly by the scope of the request, flag the final number." Flagged:
  **24,482 frames = 13:36.1** (vs the revision's ~13:01.7 estimate). No cuts
  now; the costed cut-list lives at script.md:2358-2365 if Mike wants it
  shorter after full-context viewing.
- **R3 — Ray F2 is APPROVED by Mike** (relayed 2026-08-02): "I can approve the
  ray final - it looks a little alien-y, so we'll ultimately have to see how
  the kids respond to it." The "alien-y" note is a family-screening WATCH
  ITEM, not wave-2 work.

## Kit prerequisites — build FIRST (every batch depends on these)

- **K1 — `Speaker` learns the colours.** `scenes/common.tsx:84` union +
  `speakerOf()` (common.tsx:173-179) currently map every colour line to
  `narrator`, so **all 16 colour lines stage as narrator turns — no mouth, no
  bubble**. Extend both; delete the now-false "crowd, not a cast" comment at
  common.tsx:88-93 in the same change.
- **K2 — Seven personality tables** (revision §2, §6.2 — "the heaviest single
  item"): one `SHARD_PHASE` identity, one signature move, one idle per colour,
  written once in `scenes/common.tsx`, read by every act. Signatures must
  survive a paused frame; Blue's blur = change of DIRECTION, Violet's =
  amplitude in place — two different kinds of blur.
- **K3 — The frequency ladder** (addendum 3): Red = single trough + peak
  (half-wave), stepwise wavier per colour up to Violet's fizz, ONE shared wave
  speed so frequency IS temperament; must read as ascending at a glance in
  spectrum order. Ladder numbers already in STYLE.md's Ray section (Red 1.0
  cycle → Violet 7.2); `scratchpad/rayRedesign2.tsx` is the F2/ladder source
  of truth for reference.
- **K4 — Per-body `faceOffset` kit-wide** (Ray staging item 1): `staging.tsx`
  `midOf`/`markCentre` aim at box centre, which on F2 is the gap between face
  and wave — other characters' `look` at Ray aims low. Add `faceOffset` and
  route look/aim targets through it. (Ray has NO arms at pose="rest" by
  design — do not "fix" that.)

## Batch (a) — act3 race + tease (commit after)

- **A1 — `s28_blue_runs_out` rework** (medium): goodbye roll call kept EXACTLY
  (`a3_14b/c/d`, 20f/24f beats, Blue does NOT answer); Blue already bounced
  out before Ray's wave arrives; Indigo four frames behind so that wave lands;
  Violet last, furthest, waves back from further away (firing three); Green +
  Yellow leave inside the 45f drain beat WITHOUT waving (nothing enters it);
  Orange stays with Red (the plant).
- **A2 — `s28b_race_island` component** (large, NEW): multi-leg race world
  (high air → country → sea). Every exit is that colour's signature move,
  bounced UP into the blue above — never falling/fading/vanishing (physics
  honesty: bounced out ≠ lost). Drop-out in spectrum order. Yellow lands on
  the volcano ("A warm rock!"); narrator warn-off "That is not a rest stop.";
  **THE VOLCANO OPENS ONE EYE — 45f, nothing enters, no dialogue, NO rumble**
  (the rumble belongs to Scene 35); eye closes; Yellow bounces off
  apologetically, exits upward. Green settles on the becalmed sailboat ("This
  is a nice spot."). Landing-on-an-eye pedagogy beat survives at the finish.
- **A3 — `s28c_red_arrives` component** (large, NEW): Red walks out of the
  beam at his one unvaried speed; Orange one body-length behind, arrives
  second, silent until "What Red said."; beats 36/30/45 with nothing entering;
  empty orange sky; contented, never elegiac — **the sunset must never read
  as the light dying** (tone guardrail lives here).
- **A4 — `s27_long_way` delta** (visual only): Blue on the midday beam
  (arrives almost instantly, then ricochets around having arrived), Red on the
  sunset beam (still walking when the scene ends, and into s28).
- **A5 — `s35_tease` staging**: wobbling smoke ring that does not close;
  rumble moves the water; Sunny BEAMS at full brightness, arms out, zero
  doubt, emotion lead 0; beats 45/60/45/30; **wondrous, not frightening** —
  no dark chord, no red glow, no camera shake.
- **A6 — Volcano scenery continuity**: continuously visible on the MEASURED
  horizon (sample the plate or read drawn `HORIZON`, never guess) in scenes
  25, 28b, 29, 31, 35 and in no other frame; snoring three-second loop;
  nobody looks at it; the narrator's warn-off in A2 is the only adjacent line
  in the episode. Reuse `SleepingVolcano` (exists in BOTH wind/act3 and
  sky-blue/act3; promotion to `src/lib/` is cleanup-list work, NOT this wave).
- **A7 — trivial**: delete the dead `s26_volcano: VolcanoScene` mapping
  (act3.tsx:2471) and the `VolcanoScene` component's `a3_06_narrator`
  reference (act3.tsx:613) — the only dangling line-key reference in the tree.

## Batch (a) — DONE 2026-08-02 (showrunner-reviewed; rulings below)

- Built across two builders (first quota-killed mid-run; recovery builder
  audited the inherited work per-constraint, fixed 5 real finds — bubble
  tails/looks/beat invasions — and built A5). Gates green on the final tree:
  typecheck 0, lint:hooks 0, full every-frame --scale=0.25 render exit 0.
  Stills: scratchpad/w2a2/ (scratchpad/w2a/ is STALE — pre-SKY_MARK).
- **Rulings (do not re-open):**
  - R4 — Red stands still ~350f in s28 during the goodbye: STAYS. Red stood
    all of Act One; the roll-call beats want a quiet frame; "one colour is
    still walking" lands in s28c over him visibly walking. C3/screening
    watch-item, not a bug.
  - R5 — Green+Yellow do NOT leave inside s28's 45f drain beat: the race
    addendum supersedes §6.13's five-leave staging (both have lines in 28b;
    a3_14e counts "four"). Worklist item A1's sentence is superseded;
    argument in act3.tsx:107-115.
  - R6 — Volcano appears in s28c too (the worklist's 25/28b/29/31/35 list
    predates the 28b/28c split; revision's own rule puts it in red-arrives).
  - R7 — Kit: new RayShard props (pose/wave, smear) APPROVED; Indigo's
    hero-scale ribbon braid accepted (screening watch-item).
- Carry into (b)/(c) briefs: bubble y-clamp 170 — any speaker above y≈340
  gets STILL-checked, not diff-checked; Orange follow spacing (0.8×
  SHARD_BODY here) must agree with B6's Scene 18; act2's VioletCase must
  move to violetVibrate/<Shard> (B8); scene-19 Blue is still a plain dot
  (B7); s32 has no colour bodies yet (C1); s28c's eye→volcano dissolve is
  the murkiest 48f in the act (C3 sample); Blue/Indigo cross Green's slot
  in the s28 pack 17500-17610 (C3 sample); SleepingVolcano now exists twice
  with divergent behaviour — promotion to lib is cleanup-list, NOT wave 2.

## Batch (b) — acts 1–2 revisions + Ray staging (commit after)

**Showrunner rulings for this batch (2026-08-02, successor session — do not
re-open):**
- **R8 — B4's DECIDE is decided: Drip STAYS on the B; Blue ricochets off her
  twice before settling somewhere else entirely.** The revision names this the
  funnier option (§6.4) and it is one more free firing of Blue's signature.
  The choice is written into the scene file per B4's instruction.
- **R9 — AMENDED TO OUT.** The act2 builder's arithmetic is decisive: `a2_51`
  + `a2_52_ray` give Red 171 frames = a quarter of the crossing at RED_SPEED,
  so every staging leaves him walking inside the 30f "It lands on him. Nobody
  helps." beat (evidence still: scratchpad/w2b2/r9_REJECTED_*.png). Kept as
  `S23_RED_WALK = false` in act2.tsx with the argument written on the
  constant. Do not re-add.

### Batch (b) act2 — DONE 2026-08-02 (showrunner-reviewed, accepted)
- B5–B10 + VioletCase→kit migration all landed in act2.tsx only. Gates:
  typecheck 0, lint:hooks 0, every-frame render of scenes 16–24
  (frames 9869–15845) --scale=0.25 exit 0. Stills: scratchpad/w2b2/ (52 +
  fix pair). Showrunner sampled 12 stills — one fix (Scene 23 roller
  anchored to Sunny's spikes, showrunner-applied, re-stilled, typecheck 0).
- B7 measured fractions vs the NEW 3.06s a2_28b_blue: clause onsets
  [0.058, 0.455, 0.740] via silencedetect; acceptance test written on
  S19_SEED. Builder fixed three stale pre-revision bubbles (a2_10, a2_50,
  a2_52) found during the work.
- Accepted deviations: B6 Orange spacing = one DRAWN body-length (264px at
  S18 scale 1.1 — act3's 0.8 was that shot's drawn scale, not a
  coefficient); Scene 20 comparator-Blue keeps ricocheting through the 20f
  droop beat (his law; stopping him would be a second event) — screening
  watch-item, like Scene 19 Blue/Indigo mid-leg touching at 4f lag.
- Kit gaps reported (cleanup-list, NOT wave 2): <Shard> hardcodes
  pose=wave for yellow only (Violet cannot wave through the kit; act3's
  body-wag workaround reused); no syllableBlock() geometry export (B9
  perched on the banner centre + stagger constant instead); SpeechBubble
  dressing not exported (corner bubbles re-derive blue inline —
  bubbleDressOf(who) wanted); SpeechBubble tails are bottom-edge-only.

- **B1 — Scene 5 journey**: unchanging star field, no cuts, 25.6s of
  deliberate sameness; five identical firings (one clip, five identical mouth
  shapes and bubbles); gaps 30/45/60/75; the fifth UNANSWERED — 6f tail, hard
  cut to the Scene 6 garden. Nothing may telegraph the cut.
- **B2 — Scene 9 ensemble birth**: the 60f counting beat stays EMPTY; the
  seven come alive only from `a1_37_ray`, one per ~8f, spectrum order, via
  `beats()` — stagger, never swarm. Red does not come alive because he never
  stopped; he does not move again until Act Two.
- **B3 — Scene 10 roll call**: seven in-character reactions per revision
  §6.3; Red does not react AT ALL (the new best moment, zero frames); nobody
  replies out loud (ruling R1); everyone freezes in seven different poses
  through the 20f beat.
- **B4 — Scene 11**: letters taken in character; Violet squeezed onto the W's
  far arm, ignored, still there at the cut. DECIDE Drip-on-B vs Blue
  ricocheting off her, and WRITE THE CHOICE IN THE SCENE FILE (revision names
  the ricochet as funnier) — the next reader will otherwise "fix" it.
- **B5 — Scene 16 restage** (negative work): one prop — the tray, tipped
  toward camera on the 45f beat, plainly never used. DELETE the ladder, dust
  sheet and painting animation. Emotion lead 0.
- **B6 — Scene 18 corridor**: Red + Orange cross dead straight; Puff's
  reach-miss-shrug runs INSIDE the 30f beat as continuous action; Red's 16f
  approach gaps are already in the timeline — stage to them.
- **B7 — Scene 19 corridor**: Blue pinball; Indigo permanently hitting the
  puff Blue just left; the 45f pinball beat is SACRED — motion builds under
  silence, no bubbles inside it; three-corner bubbles on `a2_28b_blue` at
  `beats(clip, [0.05, 0.42, 0.74])`, each two words, each `tailAt` Blue's
  actual position, bubbles STILL even when Blue is not. **BLOCKED ON B12**
  (the a2_28b_blue re-roll): measure the beat fractions against the NEW take,
  never the current 6.66s one. (a2_25b_blue PASSED Mike's ear-check as-is —
  its fallback is withdrawn; no coupling there.)
- **B8 — Scene 20 dome**: every arrow gets Blue on the end of it; dome
  resolves into Blue's face for ~half a second ON `a2_33_narrator` (never in
  the 36f beat, which stays empty); Violet out-bounces Blue (replace the
  plain-dot comparator with Blue), droops on the 20f beat, nothing else
  enters; Ray looks at him on "Sorry, Violet." and on no other frame.
- **B9 — Scene 21**: Blue throws the letters one per ricochet; Indigo throws
  one four frames late and misses; everything perched on `syllableBlock()`,
  never composition coordinates.
- **B10 — Scene 23 restage**: **the diagram NEVER stops** — it rebuilds
  around Sunny with the air drawn into it on `a2_51_narrator`; the grin GROWS
  across the whole 36f beat (Video.tsx comment now says so — W1 fixed);
  ray-fan visual pun on "LOADS of points"; optional free visual: Red walks
  across the finished diagram on `a2_51`, NEVER inside a held beat.
- **B11 — Ray staging items 2 + 3** (item 1 = K4): act1.tsx:359-367 scene-4
  whip streak band crosses the face/wave gap — re-aim it; Scene 4 Sunny's
  pinch arms converge on the same gap — re-aim via K4's `faceOffset`.
- **B12 — Re-roll `a2_28b_blue` (bad take; do BEFORE B7).** Mike's ear-check
  (2026-08-02): "weirdly slow and low". Diagnosis: bad nondeterministic
  MiniMax draw, NOT a field problem — 6.66s / 0.83 s/word vs Blue's own
  0.31–0.36 s/word on `a3_13b`/`rc_03b` with IDENTICAL fields (Decent_Boy,
  happy, 1.05). Keep text and every field unchanged. Procedure: delete the
  `a2_28b_blue` entry from `public/narration/sky-blue/.cache.json`, re-run
  `npm run narration -- --video sky-blue` (needs REPLICATE_API_TOKEN;
  ~$0.01), sanity-check the new duration lands ~2.4–3.2s; up to two more
  rolls if it draws slow again (escalate to a field tweak only after three
  bad draws). THEN: (1) relay the new clip + `a2_28c_indigo` +
  `a3_13c_indigo` to Mike — he approved the Indigo faded-copy contrast
  against the OLD slow 28b, so the pairing must be re-heard against the fast
  take; (2) B7 measures its bubble beats against the new clip. Side effect:
  scene 19 re-times ~3.5s shorter automatically (audio-driven), total
  runtime dips to ~13:32.

### Batch (b) act1 — DONE 2026-08-02 (showrunner-reviewed, accepted, no fix round)
- B1–B4 + B11 all landed in act1.tsx only. Gates: typecheck 0, lint:hooks 0,
  every-frame renders 2140–3355 and 5426–7284 --scale=0.25 both exit 0.
  Stills: scratchpad/w2b1/ (27). Showrunner sampled 6 — accepted.
- Highlights: ArcShard `alive` gate keeps the 60f count beat personality-free
  and makes Red's non-birth a no-op; Scene 10 reactions freeze on a stopped
  `held` clock; Ray aims at the mark of whoever he names incl. Blue's empty
  slot; R8 written into the file (Drip rings on each of Blue's two bounces);
  B11 pinch/streak re-aimed to faceOf (streak now two bands: face + wave).
- Builder finds fixed en route: S5 bubble only existed on 2 of 5 firings
  (now one shared bubble+at), S5 tailAt pointed past Ray on firing five,
  S9 fan landed mid-count-beat (now beatFrom+8), S10 Ray materialised on
  top of Red (walk retimed 0.18–0.78).
- Accepted deviations: Yellow idles at 0.82 wave so "waves harder" has
  headroom; Indigo echo anchored on own mark −130px (act3 precedent); Violet
  keeps vibrating inside frozen beats (resting state, not gesture); Blue has
  no further excursions after §6.2's two (kit idle carries his jitter).
- Kit gaps reported (cleanup-list, NOT wave 2): Shard pose hardcoded (only
  Yellow can raise arms — "a raised arm is Yellow's" now de-facto law);
  `beats()` not re-exported by common.tsx; `blueTrail` unusable at formation
  scale over painted plates (dropped in s09/s10, fine at 0.36 perch scale;
  act2 built its own mesh for s19/s20 so the predicted bite didn't land);
  Ray wave-ribbon offset undeclared (local +72, single use).
- Pre-existing flags for batch (c)/cleanup: a1_49_drip bubble sits below
  Drip (tail points away); s11 ~6940–6960 the seven cluster over WordCard
  capitals that don't match their block seats (~20f); arcPointLifted cannot
  clear a shard at the bow's ends.

## Batch (c) — recap + review + gates + deploy

- **C1 — Scene 32 chant**: Blue shoves into Puff's panel (4f gap; neither
  concedes, nobody adjudicates); Red walks into and out of Sunny's panel (16f
  gap; the 20f beat after "It is mostly me." is total stillness — Sunny does
  not hear, does not look); Violet half out of the RAINBOW panel edge, waving,
  unre-framed (firing four).
- **C2 — Remaining recap rows** from script.md's staging worklist (Scene 35
  already in A5; Moon/Scene 34 untouched — 60f black-sky hold sacred).
- **C3 — Showrunner sampled still review** (mine, not a builder's): riskiest
  beats — race exits MID-animation, the one-eye 45f, s28c's empty orange
  frame, Scene 19's three-corner bubbles mid-ricochet, Scene 23 grin growth
  arc, Scene 9 stagger. Builders render stills INSIDE animated beats, not at
  endpoints (the lesson this repo has learned three times), and Read their own
  stills before reporting.
- **C4 — Ear-check packet: DONE 2026-08-02.** Mike's verdict: "all are good
  except I think blue in 28b sounds weirdly slow and low while in 25b blue
  sounds fine." So: `a2_49` flat ✓, `a2_25b` APPROVED AS-IS (the predicted
  dud passed — its 1.11 s/word is pause-driven and reads as apologizing
  mid-bounce; fallback withdrawn), `a2_24b` ✓, `a3_18d` tone ✓, Indigo
  contrast ✓ (against the old 28b — re-verify per B12), five-firing run ✓,
  `a2_50` pun ✓, `rc_18` confidence ✓. The one fail is `a2_28b_blue` → B12.
  Remaining ear work this batch: the B12 re-heard pairing only.
- **C5 — Full gates**: `npm run typecheck`, `npm run lint:hooks`, full
  every-frame `RaySkyBlue` render at `--scale=0.25`, exit 0.
- **C6 — Clean-worktree deploy** (CLAUDE.md recipe; never `git add -A` — the
  technical session may have WIP). Then, per HANDOFF: send Mike the deployed
  link for the full-context family screening.

## Watch items (screening, not wave-2 work)

- Ray F2 reads "a little alien-y" (Mike) — kids' reaction at the family
  screening decides whether it ever becomes a tweak.
- R1 (roll call reply-free) — Mike may override after viewing; cents to add.
- Runtime 13:36.1 — cut-list at script.md:2358-2365 if it must come down.

## Brief boilerplate for wave-2 builders (per docs/roles/showrunner.md)

Carry into every brief: quality bar = "read act1.tsx first"; scope guards
(registries shared — minimal diffs; `src/site/` belongs to the technical
session; do not touch wind/ scene files); render + Read your own stills and
iterate (~50–170 stills is normal); flagged weak points above (F2 face/wave
gap, emotion-vocab limits, plate horizon measurement); stills inside animated
beats; commit nothing — report to the showrunner.
