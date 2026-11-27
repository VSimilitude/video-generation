#!/usr/bin/env node
// Orchestrator quota gate: is there headroom in the 5-hour usage window to
// start the next batch, or should we pause until the window resets?
//
//   node scripts/check-quota.mjs [expectedBatch]
//
// expectedBatch is the next batch's size: a number <= 100 is read as a
// percent of the 5-hour window, anything larger as weighted tokens (the old
// unit, default 8M ~ 30%).
//
// Prints a one-line verdict (PROCEED / PAUSE until <reset>) plus the numbers.
// Exit code 0 = proceed, 2 = pause, 3 = reading unreliable.
//
// SOURCE (2026-11-26): the REAL quota percentages. Claude Code now hands the
// account's 5-hour and weekly used % (the same numbers /usage shows) to the
// status line script, and ~/.claude/statusline.py saves them to
// ~/.claude/quota-status.json on every refresh. That file is the server's
// own reading: it includes Mike's other sessions and devices, and its
// resets_at is the true reset time, so no boundary slop is needed.
//
// The file only updates while an interactive Claude Code session is open.
// If it is older than QUOTA_MAX_AGE_MIN (default 15) this script falls back
// to the old ccusage ESTIMATE (kept below, with its calibration notes) and
// says so. A fresh file with no five_hour entry means the window has just
// reset and nothing has been spent in the new one yet.
//
// The weekly limit is checked too: at or above QUOTA_WEEK_CEILING_PCT
// (default 95) the verdict is PAUSE until the weekly reset.

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const QUOTA_FILE =
  process.env.QUOTA_STATUS_FILE ?? join(homedir(), ".claude", "quota-status.json");
const MAX_AGE_MS = Number(process.env.QUOTA_MAX_AGE_MIN ?? 15) * 60_000;
// 90% matches the old 24M-of-27M ceiling.
const CEILING_PCT = Number(process.env.QUOTA_CEILING_PCT ?? 90);
const WEEK_CEILING_PCT = Number(process.env.QUOTA_WEEK_CEILING_PCT ?? 95);
// Observed size of a full 5-hour window in weighted tokens (2026-08-08
// calibration, see the estimate section). Only used to convert a batch size
// given in weighted tokens into a percent.
const WINDOW_WEIGHTED = Number(process.env.QUOTA_WINDOW_WEIGHTED ?? 27_000_000);

// Default batch: showrunner + 2 builders for one act-sized batch, observed
// 5-8M weighted; 8M is the conservative planning figure.
const batchArg = Number(process.argv[2] ?? 8_000_000);
const batchPct = batchArg <= 100 ? batchArg : (batchArg / WINDOW_WEIGHTED) * 100;
const batchWeighted = batchArg <= 100 ? (batchArg / 100) * WINDOW_WEIGHTED : batchArg;

const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const toMs = (epoch) => (epoch > 1e11 ? epoch : epoch * 1000);
const mins = (ms) => Math.max(0, Math.round(ms / 60000));
const when = (ms) => new Date(ms).toISOString();

function readRealQuota() {
  let q;
  try {
    q = JSON.parse(readFileSync(QUOTA_FILE, "utf8"));
  } catch {
    return { skip: `no readable ${QUOTA_FILE}` };
  }
  if (!isNum(q.updated_at)) return { skip: "quota file has no updated_at" };
  const ageMs = Date.now() - toMs(q.updated_at);
  if (ageMs > MAX_AGE_MS) {
    return {
      skip:
        `quota file is ${mins(ageMs)} min old (limit ` +
        `${mins(MAX_AGE_MS)}) - no interactive session has refreshed it`,
    };
  }
  const win = (entry) => {
    if (!entry || !isNum(entry.used_percentage)) return null;
    const resetMs = isNum(entry.resets_at) ? toMs(entry.resets_at) : null;
    // A reading whose reset time has already passed describes the previous
    // window; the current one is empty until the next reply says otherwise.
    if (resetMs !== null && resetMs <= Date.now()) return null;
    return { pct: entry.used_percentage, resetMs };
  };
  return { ageMs, five: win(q.five_hour), week: win(q.seven_day) };
}

const real = readRealQuota();

if (!real.skip) {
  const { five, week, ageMs } = real;
  const fivePct = five ? five.pct : 0;
  const headroom = CEILING_PCT - fivePct;
  console.log(
    `5h window: ${fivePct}% used` +
      (five
        ? five.resetMs
          ? `, resets ${when(five.resetMs)} (~${mins(five.resetMs - Date.now())} min)`
          : ""
        : " (just reset - nothing spent in the new window yet)") +
      `; ceiling ${CEILING_PCT}%, headroom ${headroom.toFixed(0)}%, ` +
      `next batch ~${batchPct.toFixed(0)}%. ` +
      `Week: ${week ? `${week.pct}% used` : "no reading"}` +
      (week?.resetMs ? `, resets ${when(week.resetMs)}` : "") +
      `. Source: real quota reading, ${mins(ageMs)} min old.`
  );
  if (week && week.pct >= WEEK_CEILING_PCT) {
    console.log(
      `PAUSE until ${week.resetMs ? when(week.resetMs) : "the weekly reset"} ` +
        `- weekly limit at ${week.pct}% (ceiling ${WEEK_CEILING_PCT}%)`
    );
    process.exit(2);
  }
  if (headroom >= batchPct) {
    console.log("PROCEED");
    process.exit(0);
  }
  if (five?.resetMs) {
    console.log(
      `PAUSE until ${when(five.resetMs)} (~${mins(five.resetMs - Date.now())} min)`
    );
  } else {
    console.log("PAUSE - batch is larger than the whole window allows; split it");
  }
  process.exit(2);
}

// ---------------------------------------------------------------------------
// FALLBACK: ccusage ESTIMATE (the gate before 2026-11-26). Used only when the
// real reading is missing or stale, e.g. in a headless run.
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
// ccusage estimates from Claude Code's internal transcript JSONL, a format
// that may change between CC versions, and it only sees this machine.
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

console.log(
  `ESTIMATE ONLY - ${real.skip}; falling back to ccusage. For a real ` +
    `reading, check from an interactive session (the status line refreshes ` +
    `the quota file).`
);

const CEILING = Number(process.env.QUOTA_CEILING_WEIGHTED ?? 24_000_000);
const RESET_SLOP_MS =
  Number(process.env.QUOTA_RESET_SLOP_MIN ?? 60) * 60_000;
const batch = batchWeighted;

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
