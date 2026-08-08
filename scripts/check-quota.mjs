#!/usr/bin/env node
// Orchestrator quota gate: measure the active 5-hour usage window (via
// ccusage, which reconstructs it from local transcripts) and answer one
// question: is there headroom to start the next batch, or should we pause
// until the window resets?
//
//   node scripts/check-quota.mjs [expectedBatchOutputTokens]
//
// Prints a one-line verdict (PROCEED / PAUSE until <reset>) plus the numbers.
// Exit code 0 = proceed, 2 = pause.
//
// Calibration (2026-08-07, live /usage reading): 1.24M output tokens
// measured ↔ 93% used → ~13.4k output tokens per percent, implied ceiling
// ~1.34M. CEILING=1.2M is kept as the conservative floor. Default batch cost
// 200k (observed showrunner batches: 160-260k). Threshold = ceiling - batch.
//
// SUPERSEDED (2026-08-02/03): ceiling was 450k, from two same-day kills at
// ~452k/~546k output and a 25%↔127k reading (~5.1k per percent). That was
// measured when this machine ran ONE session; the window is now shared with
// Mike's other sessions and the per-percent rate came out 2.6x higher. Two
// lessons: the window is per-account, not per-session, so a quiet session can
// still be at 90%; and a stale ceiling reads as a hard stop, which cost this
// session a near-miss (a batch was launched believing 38% when the true state
// was 93%). Re-calibrate against a live /usage reading, not against kills.
//
// Caveat (researched 2026-08-02): there is NO supported programmatic quota
// API — the live state is only in the interactive /usage command. ccusage
// estimates from Claude Code's internal transcript JSONL, a format that may
// change between CC versions. If this script starts erroring or reading
// nonsense, fall back to Mike running /usage manually at checkpoints.

import { execSync } from "node:child_process";

const CEILING = Number(process.env.QUOTA_CEILING_OUTPUT ?? 1_200_000);
const batch = Number(process.argv[2] ?? 200_000);

const raw = execSync("npx --yes ccusage@latest blocks --json", {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
});
const active = JSON.parse(raw).blocks.find((b) => b.isActive && !b.isGap);

if (!active) {
  console.log("PROCEED — no active usage window (fresh window on next call)");
  process.exit(0);
}

const out = active.tokenCounts.outputTokens;
const inp = active.tokenCounts.inputTokens;
const resetAt = new Date(active.endTime);
const fmt = (n) => `${Math.round(n / 1000)}k`;

// Sanity gate (2026-08-07): compare output against TOTAL input, cache
// included. `inputTokens` alone counts only uncached input — with prompt
// caching that is a rounding error (one live reading: in=1694 uncached
// against 21.6M cache reads + 3.3M cache creation), so testing against it
// alone falsely flags every healthy window as a parse failure.
const inpTotal =
  inp +
  (active.tokenCounts.cacheReadInputTokens ?? 0) +
  (active.tokenCounts.cacheCreationInputTokens ?? 0);
if (inpTotal <= out) {
  console.log(
    `UNRELIABLE — ccusage returned total input ${fmt(inpTotal)} vs output ` +
      `${fmt(out)} (agentic work reads far more than it writes; this looks ` +
      `like a parse failure, not a quota reading). Ask Mike for a /usage ` +
      `percent and gate on that.`
  );
  process.exit(3);
}
const minsLeft = Math.max(0, Math.round((resetAt - Date.now()) / 60000));
const headroom = CEILING - out;

console.log(
  `window: ${fmt(out)} output tokens used, ceiling ~${fmt(CEILING)}, ` +
    `headroom ${fmt(headroom)}, next batch ~${fmt(batch)}, ` +
    `window resets ${resetAt.toISOString()} (~${minsLeft} min)`
);

if (headroom >= batch) {
  console.log("PROCEED");
  process.exit(0);
}
console.log(`PAUSE until ${resetAt.toISOString()} (~${minsLeft} min)`);
process.exit(2);
