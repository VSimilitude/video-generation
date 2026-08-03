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
// Calibration (2026-08-02, two same-day quota kills): the window died at
// ~452k and ~546k output tokens. Ceiling assumed 450k; default batch cost
// 200k (observed showrunner batches: 160-260k). Threshold = ceiling - batch.
// Re-calibrate CEILING if a kill happens below it or plans change.
// Validated 2026-08-03 against a live /usage reading: 25% used ↔ 127k
// output tokens measured → implied true ceiling ~508k (~5.1k output tokens
// per /usage percent). The kills bracket that at -11%/+7% (workload-mix
// noise), so CEILING=450k is kept as the conservative floor.
//
// Caveat (researched 2026-08-02): there is NO supported programmatic quota
// API — the live state is only in the interactive /usage command. ccusage
// estimates from Claude Code's internal transcript JSONL, a format that may
// change between CC versions. If this script starts erroring or reading
// nonsense, fall back to Mike running /usage manually at checkpoints.

import { execSync } from "node:child_process";

const CEILING = Number(process.env.QUOTA_CEILING_OUTPUT ?? 450_000);
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
const resetAt = new Date(active.endTime);
const minsLeft = Math.max(0, Math.round((resetAt - Date.now()) / 60000));
const headroom = CEILING - out;
const fmt = (n) => `${Math.round(n / 1000)}k`;

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
