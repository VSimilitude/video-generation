#!/usr/bin/env node
// Orchestrator quota gate: measure the active 5-hour usage window (via
// ccusage, which reconstructs it from local transcripts) and answer one
// question: is there headroom to start the next batch, or should we pause
// until the window resets?
//
//   node scripts/check-quota.mjs [expectedBatchWeightedTokens]
//
// Prints a one-line verdict (PROCEED / PAUSE until <reset>) plus the numbers.
// Exit code 0 = proceed, 2 = pause.
//
// METRIC (2026-08-08): the window is budgeted in WEIGHTED tokens, not output
// tokens. Weights follow API pricing ratios: input x1, output x5, cache
// creation x1.25, cache READ x0.1. Cache reads dominate agentic work — a
// parallel-builder fleet re-reads a multi-hundred-k cached context every
// tool turn, so raw output wildly understates cost when parallelism is high.
//
// Calibration (2026-08-08, two same-day session-limit kills):
//   kill 1: out 417k, cacheRead 185M, cacheCreate 5M  -> ~26.9M weighted
//   kill 2: out 548k, cacheRead 148M, cacheCreate 8M  -> ~27.5M weighted
// Output varied 30% between kills; weighted totals agree within 2%. The
// earlier output-based calibrations (450k on 2026-08-02 sequential work,
// 1.2M on 2026-08-07) were both mix-dependent snapshots of the same
// underlying ~27M weighted budget. CEILING=24M is ~90% of observed.
//
// Caveat (researched 2026-08-02): there is NO supported programmatic quota
// API — the live state is only in the interactive /usage command. ccusage
// estimates from Claude Code's internal transcript JSONL, a format that may
// change between CC versions. If this script starts erroring or reading
// nonsense, fall back to Mike running /usage manually at checkpoints.

import { execSync } from "node:child_process";

const CEILING = Number(process.env.QUOTA_CEILING_WEIGHTED ?? 24_000_000);
// Default batch: showrunner + 2 builders for one act-sized batch, observed
// 5-8M weighted; 8M is the conservative planning figure.
const batch = Number(process.argv[2] ?? 8_000_000);

const raw = execSync("npx --yes ccusage@latest blocks --json", {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
});
const active = JSON.parse(raw).blocks.find((b) => b.isActive && !b.isGap);

if (!active) {
  console.log("PROCEED — no active usage window (fresh window on next call)");
  process.exit(0);
}

const t = active.tokenCounts;
const out = t.outputTokens;
const inp = t.inputTokens;
const cacheRead = t.cacheReadInputTokens ?? 0;
const cacheCreate = t.cacheCreationInputTokens ?? 0;
const resetAt = new Date(active.endTime);
const fmt = (n) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${Math.round(n / 1000)}k`;

// Sanity gate (2026-08-07): compare output against TOTAL input, cache
// included — agentic work reads far more than it writes, so out >= inpTotal
// means ccusage parsed nonsense, not that the window is healthy.
const inpTotal = inp + cacheRead + cacheCreate;
if (inpTotal <= out) {
  console.log(
    `UNRELIABLE — ccusage returned total input ${fmt(inpTotal)} vs output ` +
      `${fmt(out)} (agentic work reads far more than it writes; this looks ` +
      `like a parse failure, not a quota reading). Ask Mike for a /usage ` +
      `percent and gate on that.`
  );
  process.exit(3);
}

const weighted = inp + out * 5 + cacheCreate * 1.25 + cacheRead * 0.1;
const minsLeft = Math.max(0, Math.round((resetAt - Date.now()) / 60000));
const headroom = CEILING - weighted;

console.log(
  `window: ${fmt(weighted)} weighted tokens used ` +
    `(out ${fmt(out)}, cacheRead ${fmt(cacheRead)}, cacheCreate ${fmt(cacheCreate)}), ` +
    `ceiling ~${fmt(CEILING)}, headroom ${fmt(headroom)}, next batch ~${fmt(batch)}, ` +
    `window resets ${resetAt.toISOString()} (~${minsLeft} min)`
);

if (headroom >= batch) {
  console.log("PROCEED");
  process.exit(0);
}
console.log(`PAUSE until ${resetAt.toISOString()} (~${minsLeft} min)`);
process.exit(2);
