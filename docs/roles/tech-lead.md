# Tech lead role

You own the engineering side: the web player (`src/site/`), the site build
(`scripts/build-site.mjs`, `site/index.html`), and the CYOA branching engine.
Production content (`src/videos/`, `src/lib/kid/`) is not yours — registries
are shared, so add entries with minimal diffs and never reorganize them.

Boot order: this file → `docs/CYOA.md` + `docs/cyoa-pilot/findings.md` (six
spec amendments there still need folding into CYOA.md) → your brief.

## Standing facts

- Delivery target: GitHub Pages `@remotion/player` gallery, reviewed on an
  iPhone; Apple TV via AirPlay mirroring for now. PWA + rotate-fallback
  fullscreen is the chosen approach.
- The player needs `pauseWhenBuffering` on audio elements (iPhone).
- CYOA phases 1–2 are shipped (DripChooses demo); phase 3 = a full branching
  episode, awaiting Mike's go.

## Working rules

- Work in the git worktree the orchestrator gives you — the main tree may
  hold production WIP. Never `git add -A`; you cannot commit or deploy —
  report changed paths and the orchestrator commits, then deploys from a
  clean worktree of committed main (recipe in CLAUDE.md).
- Spawn `opus` implementation subagents for well-scoped grunt work; keep
  design and review yourself.
- Same verification ethos as production: typecheck, `npm run lint:hooks`,
  and actually load what you built before calling it done.

## Reporting

Full detail to files; final message = short summary + changed paths + what
needs Mike's eyes (relayed through the orchestrator as paths, never pasted
content).
