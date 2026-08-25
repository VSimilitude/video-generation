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
//
// RESET-BOUNDARY calibration (2026-08-25 mid-flight kill, Mike's ruling):
// the REAL window anchors at the first action after the previous reset;
// ccusage floors its block start to the hour, so its endTime can read up to
// an hour EARLY (observed: predicted 11:00 ET, real reset 11:50 ET — first
// action was 6:50). Two consequences handled below:
//   1. PAUSE waits until endTime + RESET_SLOP (default 60 min — covers the
//      full floor error; Mike suggested ~30, the same-day observed error
//      was already 50).
//   2. A reading taken inside the slop zone after a floored boundary is
//      flagged: usage from the tail of the real previous window gets binned
//      into a "fresh" block, so PROCEED there can be false (that's exactly
//      how the 2026-08-25 kill happened).

import { execSync } from "node:child_process";

const CEILING = Number(process.env.QUOTA_CEILING_WEIGHTED ?? 24_000_000);
const RESET_SLOP_MS =
  Number(process.env.QUOTA_RESET_SLOP_MIN ?? 60) * 60_000;
// Default batch: showrunner + 2 builders for one act-sized batch, observed
// 5-8M weighted; 8M is the conservative planning figure.
const batch = Number(process.argv[2] ?? 8_000_000);

const raw = execSync("npx --yes ccusage@latest blocks --json", {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
});
const active = JSON.parse(raw).blocks.find((b) => b.isActive && !b.isGap);

if (!active) {
  console.log(
    "PROCEED — no active usage window (fresh window on next call). " +
      "CAUTION: if the previous window died at the session limit within " +
      "the last hour, the real reset may not have happened yet — anchor " +
      "on the API's own reset time from the kill message, not this."
  );
  process.exit(0);
}

const t = active.tokenCounts;
const out = t.outputTokens;
const inp = t.inputTokens;
const cacheRead = t.cacheReadInputTokens ?? 0;
const cacheCreate = t.cacheCreationInputTokens ?? 0;
const resetAt = new Date(new Date(active.endTime).getTime() + RESET_SLOP_MS);
// Slop zone: this block began less than RESET_SLOP ago, right after a
// floored boundary — usage from the tail of the REAL previous window may be
// binned in here, and conversely the real previous window may not have
// reset yet. Flag it so the orchestrator treats PROCEED with suspicion.
const blockAgeMs = Date.now() - new Date(active.startTime).getTime();
const inSlopZone = blockAgeMs < RESET_SLOP_MS;
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
    `window resets ~${resetAt.toISOString()} (~${minsLeft} min, incl. ` +
    `${Math.round(RESET_SLOP_MS / 60000)} min boundary slop)`
);

if (inSlopZone) {
  console.log(
    `SLOP ZONE — this block started ${Math.round(blockAgeMs / 60000)} min ` +
      `ago, just after a floored hour boundary. If the previous window ` +
      `ended in a session-limit kill, trust the API's reset time from the ` +
      `kill message over this reading, and count recent burn as belonging ` +
      `to the OLD window.`
  );
}

if (headroom >= batch) {
  console.log("PROCEED");
  process.exit(0);
}
console.log(`PAUSE until ${resetAt.toISOString()} (~${minsLeft} min)`);
process.exit(2);
