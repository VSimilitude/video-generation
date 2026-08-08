# EP 4 — Wave B worklist (staging), written at the Wave A boundary

Successor boot path: `docs/kids/BIBLE.md` → `ep4-decision-log.md` →
`script.md` (the single source of truth for the cut) → this file. The
treatments/synthesis are history; the script won.

## State at handoff (Wave A complete when this is committed)

- `script.md` + `narration.mjs` final draft, showrunner edit pass done.
- Pip CAST: `Inspirational_girl` (decision-log TOP; Mike's ear pending).
- TTS generated (see HANDOFF for gate results); 2 clips cache-migrated
  (`a2_13_drip` from sky-blue, `a2_55_puff` from wind) — do NOT re-buy.
- No composition yet: `Video.tsx`, `Root.tsx` + `src/site/registry.ts`
  registration, `backgrounds.mjs` all Wave B.

## Wave B batch plan (commit per batch; quota-gate per spawn)

1. **B1 — promotions + skeleton.**
   - PROMOTE to `src/lib/kid/` (each is now needed twice+): the ep-3 shard
     rig bodies used here (Ray F2 incl. frequency-ladder constants, Blue,
     Violet), `SleepingVolcano` (third episode — backlog item), and
     anything else the skeleton needs that sky-blue/wind own. Follow
     PROCESS §7 promotion verification EXACTLY: before/after frame grids
     on sky-blue + wind + DripChooses vs a control run, re-exports keep
     old imports byte-stable.
   - Skeleton: full timed SCRIPT table from script.md with real audio,
     `ScenePlaceholder`s playing real dialogue end to end, `timeline()`
     with every `gapFrames` held beat EXACTLY as script.md writes them
     (44 held beats with frame counts; no-emotion-lead rule on held-beat
     scenes), Root/registry registration (minimal diffs — shared files).
   - **Pip body design** (the campaign's one new rig body): dandelion
     seed → sprout → young plant as STAGED GROWTH STATES (capability
     unlocks, script Scenes 3/14/16/24); face 60–75% of body width, flat
     fills, ink outlines, silhouette test MIRRORED, leaves are her
     gesture rig (leaf-point), lean = stem tilt (heliotropism runner —
     needs a dedicated prop/pose API, it fires 6+ times). Render a
     CHARACTER SHEET png early → ships to Mike (front-load his eye);
     decision-log TOP item gets the sheet path.
2. **B2 — backgrounds.** `backgrounds.mjs`: meadow world, one style
   anchor; plates owe the frame the two clean zones; VOLCANO ON THE
   MEASURED HORIZON in every wide plate (continuously visible — volcano
   rule), old tree at field's edge (load-bearing Scene 20), Cloud Hotel
   sky for Scene 12, night + dawn + golden-hour + dusk variants per
   script. Paint value contrasts, not hue (STYLE). Volcano steam curl is
   SVG (it moves), never painted.
3. **B3+ — acts in parallel** (per-act scene-map files, zero merge
   conflicts), then showrunner still review per batch, gates, cut.

## Carry-forward flags for builder briefs

- Ep-3 flagged weak points travel: badge occlusion class, bubble z-index
  law, per-scene motion boxes must hand off position/heading at cuts
  (boundary checklist + paired-still verification), zoom-pop, pop-in.
- The chant beat (Scene 24): five one-clip syllables + WordCard sync —
  measure real clip midpoints (`silencedetect`), don't split evenly.
  Narrator-led fallback exists in narration.mjs if sync fights.
- Bubble text may carry caps the clips don't ("I am FIRST!", "AWAY",
  "I TRADED with a PLANT!") — drawn/spoken disagreement is deliberate,
  script.md marks each.
- Held beats are spine-only; ensemble business allowed everywhere else.
- The stamp-chain and "That is also true." firings are ONE clip each —
  mouth-sync via turns, never re-timed by hand.
- Blue: 4f approach gap, direction-blur, apologises to the dandelion he
  hits. Violet: same body as ep 3, amplitude blur, frame edge, zero
  acknowledgement. Ray: F2, no arms at rest, ribbon stoops to Pip's mark.
- Arrivals stoop DOWN to Pip's mark (staging guidance, all deliveries).
- Kid silhouette opens and closes (breath visible both times).
- Volcano: established Scene 1 first wide; steam curl Scene 13 ~60f,
  wordless, no reaction, no sting; asleep on end card.
