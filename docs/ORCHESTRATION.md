# Orchestration playbook — lessons from the first three episodes

How this project actually runs: the showrunner-session practices that are NOT
in PROCESS.md/STYLE.md/LEARNINGS.md (which remain the authorities on the
production pipeline, house style, and per-video retros — read all three).
Written 2026-08-01 at session handoff. Memory files in
`~/.claude/projects/-home-mike-projects-video-generation/memory/` carry the
same decisions in condensed form and auto-load in new sessions.

## Division of labor (Mike's standing preferences)
- **Fable session = showrunner**: designs briefs, reviews everything, makes
  taste calls, coordinates; **Opus subagents implement** ("defer
  implementation to Opus"). Scripts: Fable writes a tight brief (structure,
  cast, gag seeds, pedagogy, tone rules), Opus drafts, Fable reviews before
  TTS. "Delegate the draft, never the design or the review."
- **Two concurrent sessions**: production (src/videos + src/lib/kid) vs
  technical (src/site + branching player). Rules in CLAUDE.md
  "Multi-session etiquette": selective commits, push-after-commit (a
  local-only commit is invisible to the other session's deploys — this bit
  us once), clean-worktree deploys when the tree holds another session's WIP.
- **Mike's decisions**: casting (by ear, audition clips sent as files to his
  phone), art direction (by eye, sheets sent as files), script/treatment
  sign-off, arc-level story changes. Everything else proceeds autonomously.
  His standing rule: auditions are provisional — final judgment is FULL
  CONTEXT on the deployed episode; re-tweaks cost cents, so ship and revise.

## Agent campaign patterns (proven across 3 episodes)
- **Wave pattern for episodes**: (1) skeleton agent — full timed SCRIPT
  table from script.md with real audio + ScenePlaceholders playing real
  dialogue, plus the hero character + cold open + act 1; (2) parallel act
  agents filling per-act scene-map files (zero merge conflicts by design);
  (3) orchestrator sampled still review; (4) gates; (5) deploy. Each act
  file exports a Record<sceneId, FC>; Video.tsx merges with placeholder
  fallback.
- **Agent briefs must carry forward**: prior agents' flagged weak points
  (plate quirks, rig gaps, emotion-vocab limits), the quality bar ("read
  act1.tsx"), scope guards (files owned by others), and "render + Read your
  own stills and iterate" — visual self-review inside the agent is the
  single biggest quality lever. Agents run ~50–170 stills per wave.
- **Orchestrator review still catches things** after agent self-review
  (~1 real find per wave: badge occlusion, ink-blot Big Empty). Sample the
  riskiest beats, not everything.
- **Recovery from dead agents** (quota kills, connection drops — happened
  4x): SendMessage resume works if the transcript survives (message: "check
  on-disk state first, repair partials, continue"). If "No transcript
  found", spawn a fresh agent with an ON-DISK INVENTORY and the instruction
  to AUDIT-not-trust the predecessor's work (this found 12 real bugs once —
  the audit is not optional). Paid work (TTS/plates) always survives on
  disk; the cache makes re-runs free.
- **Batch discipline under quota pressure**: commit+push the moment each
  agent lands; split waves smaller and sequential; keep coordination turns
  minimal; the campaign state lives in task descriptions + docs so any
  session can resume from the repo alone.
- **Text-only design agents** (treatments, punch-ups, audits) are cheap and
  reviewable — always run design as text before build. The density-audit →
  treatment → implementation chain is the standard revision loop.

## Verification stack (all mandatory, in PROCESS.md but the WHY matters)
1. Typecheck + `npm run lint:hooks` (AST scanner; a hook in a ternary =
   React #300 = bricked player — shipped once, never again; the scanner
   caught 2 more in-flight).
2. Per-scene stills + mid-animation frames (layout bugs invisible in diffs).
3. **Full every-frame render** `--scale=0.25` exit 0 — the ONLY thing that
   catches hook-count changes across frames; stills structurally cannot.
4. Promotion/refactor: frame-grid pixel diff vs a same-code control run
   (Chrome AA noise floor ~22/831 frames; PNG hashes are an invalid oracle).
   Harness: scripts/frame-{grid,diff,crop}.mjs.
5. Deploy from a clean worktree of origin/main; verify URLs post-CDN
   (expect 404s for ~60s, retry).

## Engines, voices, costs (see memory/voice-engine-findings.md for detail)
- Kokoro = free/local/deterministic → narrator + Sunny (am_puck, reverted
  after MiniMax trial; "mechanical is funnier"). MiniMax speech-2.8-hd via
  Replicate = characters ($0.11/1k chars; whole episodes recast for cents).
  ElevenLabs-via-Replicate: voices work, v3 audio tags DO NOT (read aloud).
- Per-line fields: engine/voiceId/emotion/speed/pitch(±12 semitones —
  a second character from one casting, e.g. Indigo = Blue+3)/`<#s#>` pause
  markers (MiniMax only)/`sameAs` (byte-identical clip alias — mandatory for
  repetition gags on a paid nondeterministic engine).
- Rules: emotion is seasoning (auto default, cite the stage direction);
  sound-word spellings are PER-ENGINE (letter-stretch is kokoro-only —
  "PUUUSH" reads "pu-ush" on MiniMax); if a joke needs a pause kokoro can't
  make, SPLIT THE CLIP and use gaps; engine switches re-audit sound words;
  6/min Replicate rate limit (pace 12s, retry per item, never lose paid
  work to a thrown batch).
- Backgrounds: flux-schnell gouache plates ~$0.003/image, committed like
  audio; webp stays webp (remotion ffmpeg can't decode it; Chrome can).

## Audience intelligence (the real product spec)
- **Claire (6)**: comedy channel. Loves deadpan repetition + roll calls
  (series signature: one fresh roll-call variant per episode). Noticed
  cameo voices matching the narrator and bubble text not matching speech
  (reading-practice — still open). Verdicts drive punch-ups.
- **Math (8)**: mind-blower channel. Sahara→Amazon fact sent him
  researching; true/checkable facts pay off. Gives precise notes ("Probably"
  > "Yes." — adopted, credited).
- **Mike**: full-context reviewer; catches physics-intuition breaks (Indigo
  pitch must go UP — bouncier=higher), visual-grammar problems (single
  motion trails read as sperm → always two offset lines), arc pacing
  (Sunny's wrongness saved for the volcano ep).
- Measured comedy standard: a kid-graded laugh ≤ every 25–30s, **track the
  max gap (≤50s), not the average**; the sag follows the DIAGRAMS, not a
  fixed act — any stretch carried by drawn geometry needs a character beat
  inside it. Characters must CARRY the mechanism (Cloudia's stress IS
  condensation); a hero who only reacts ("awe") is not a comedian — give
  heroes attitudes (Ray is a pedant).
- Series arc canon: Sunny claims everything and is always (annoyingly,
  at-least-half) right; his first true wrongness is RESERVED for the
  volcano episode ("I did that." / "No. He really didn't."). The volcano
  sleeps in the background (ep2 unmentioned → ep3 one-eye in the sunset
  race → ep4 wakes = Claire's commissioned lava/rock-cycle episode; hero
  must NOT reuse the wrong-about-self arc — impatience vs slow rock cycle).
  Elegant_Man @ pitch −6 reserved as the volcano's voice.

## Tooling gotchas
- npx remotion still/render need libnspr4/libnss3 (installed). Audition
  filenames must include the line key (fixed). Kokoro model + TTS cache
  survive everything. `git add -A` is FORBIDDEN while the other session has
  WIP. The site player needs `pauseWhenBuffering` on audio (iPhone).
  Agents cannot commit; the orchestrator commits per-agent-landing.
