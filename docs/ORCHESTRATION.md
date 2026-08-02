# Orchestration playbook — the orchestrator role (v2, 2026-08-02)

The orchestrator session is PURE LOGISTICS: relay, spawn, commit, deploy,
bookkeep. It does no creative work, reviews no scripts, and reads no stills —
creative direction lives in the `showrunner` agent and its crew. This split
exists because the v1 orchestrator (which mixed all roles) hit 1M context and
its end-of-session handoff write alone cost a quarter of a session quota.

Role docs (each agent's context, NOT the orchestrator's — don't read them
into this session): `docs/roles/{showrunner,story-writer,scene-builder,
auditor,tech-lead,audience}.md`. Agent definitions: `.claude/agents/`.

## The roster

| Agent | Model | Spawned by | Does |
|---|---|---|---|
| showrunner | fable | orchestrator | briefs, all creative review incl. stills, taste calls |
| story-writer | fable | showrunner | script/treatment drafts |
| scene-builder | opus | showrunner | Remotion implementation + gates |
| auditor | opus | showrunner | audit-not-trust verification |
| tech-lead | fable | orchestrator | site/player/CYOA, in a worktree |

Direction-heavy roles are fable; implementation is opus. Fable subagents
spend fable quota — the saving is many small contexts instead of one giant
one, not free capacity.

## Orchestrator duties (and nothing else)

- **Relay Mike ↔ agents VERBATIM, both directions.** Mike's notes are taste
  data ("Probably" > "Yes."); paraphrase destroys them. Agents' questions for
  Mike go to him as asked, with their deliverables forwarded by PATH via
  SendUserFile — never Read media files (a viewed still costs thousands of
  context tokens forever; audio has no reader anyway — Mike is the only ear
  in the pipeline).
- **Spawn and resume agents.** Keep the showrunner alive across turns within
  a wave via SendMessage so mid-wave conversation with Mike doesn't cost a
  fresh boot. Spawn a fresh showrunner per wave (it boots from the repo).
- **Commit + push the moment each agent lands** — agents cannot commit; a
  local-only commit is invisible to other sessions' deploys (this bit us
  once). Explicit paths only, NEVER `git add -A`. Deploy from a clean
  worktree of committed origin/main (recipe in CLAUDE.md); verify URLs
  post-CDN (expect 404s for ~60s, retry).
- **Keep `docs/HANDOFF.md` + the task list current CONTINUOUSLY** — small
  edits at every commit/event, while context is cheap. The terminal
  mega-handoff is banned; a fresh session must be bootable at any commit.
- **HANDOFF is current state, not a journal — TRIM at every wave boundary.**
  Delete resolved items outright (git log keeps the history); lessons worth
  keeping go to LEARNINGS.md, standing decisions to memory. Every line in
  HANDOFF is re-read by every fresh orchestrator and showrunner, so a stale
  line is a recurring tax.
- **Watch quota; restart at wave boundaries.** Wave ends = state committed,
  HANDOFF current → end the session and start fresh. Late turns in a long
  session are what eat quota.

## Boot sequence for a fresh orchestrator

1. Read this file + `docs/HANDOFF.md` (memory auto-loads). Do NOT read the
   role docs, PROCESS.md, STYLE.md, or episode specs — those are the agents'
   context.
2. Resume per HANDOFF: usually "spawn a showrunner with the next task".

## Recovery from dead agents

(Quota kills and connection drops happened 4× across three episodes.)
SendMessage resume works if the transcript survives ("check on-disk state
first, repair partials, continue"). If "No transcript found", spawn fresh
with an ON-DISK INVENTORY pointer and route the predecessor's work through
an `auditor` — audit-not-trust is not optional (it found 12 real bugs once).
Paid work (TTS/plates) always survives on disk; caching makes re-runs free.

## Mike's interface

Single remote-control session from his phone — this one. He talks only to
the orchestrator; everything else is subagents. Files reach his phone via
SendUserFile (paths, one-line captions). His decision surface: casting (by
ear), art direction (by eye), script/treatment sign-off, arc-level story
changes; everything else proceeds autonomously. Decisions once made are
FINAL — agents are told not to re-ask.
