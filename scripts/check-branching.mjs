// Self-check for a branching (CYOA) composition's graph, plus the pure
// branching-engine helpers the player uses on it.
//
//   node scripts/check-branching.mjs            # DripChooses
//
// Checks, and exits non-zero on any failure:
//   - every `jump` / choice-option target names a real segment
//   - every `continue` has a following segment
//   - segments tile the composition: contiguous, in layout order, no overlap,
//     and the last one ends on the composition's last frame
//   - every segment is reachable from `start`, and every path reaches `end`
//   - every option id is unique within its choice, every choice id unique
//   - every preload / card narration file exists under public/
//   - firstChoiceSegment / lastChoiceSegment behave on every complete path
//     (and on an empty and a partial path)
// Prints every distinct root-to-end path with its per-watch length.
//
// Implementation: esbuild bundles a tiny entry that imports the registry and
// the engine (TypeScript + TSX) into a temp .mjs, which node then runs.

import { build } from "esbuild";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const compId = process.argv[2] ?? "DripChooses";

const entry = `
import { VIDEOS } from "./src/videos/registry";
import { firstChoiceSegment, lastChoiceSegment, seamAction } from "./src/site/branchingEngine";
export { VIDEOS, firstChoiceSegment, lastChoiceSegment, seamAction };
`;

// Inside the repo (tmp/ is gitignored) so the bundle resolves node_modules.
mkdirSync(path.join(root, "tmp"), { recursive: true });
const dir = mkdtempSync(path.join(root, "tmp", "branching-check-"));
const outfile = path.join(dir, "bundle.mjs");
await build({
  stdin: { contents: entry, resolveDir: root, loader: "ts" },
  bundle: true,
  platform: "node",
  format: "esm",
  outfile,
  logLevel: "error",
  jsx: "automatic",
  // Remotion and React resolve from node_modules at run time.
  packages: "external",
});
const mod = await import(pathToFileURL(outfile).href);
rmSync(dir, { recursive: true, force: true });

const video = mod.VIDEOS.find((v) => v.id === compId);
const failures = [];
const fail = (msg) => failures.push(msg);

if (!video) {
  console.error(`no video "${compId}" in the registry`);
  process.exit(1);
}
const spec = video.branching;
if (!spec) {
  console.error(`"${compId}" has no branching spec`);
  process.exit(1);
}
const fps = video.fps;
const segs = spec.segments;
const byId = new Map(segs.map((s) => [s.id, s]));

// --- targets ---------------------------------------------------------------
const choiceIds = new Set();
segs.forEach((s, i) => {
  const n = s.next;
  if (n.kind === "jump" && !byId.has(n.to)) fail(`${s.id}: jump to missing "${n.to}"`);
  if (n.kind === "continue" && !segs[i + 1]) fail(`${s.id}: continue off the end of the layout`);
  if (n.kind === "choice") {
    if (choiceIds.has(n.id)) fail(`${s.id}: duplicate choice id "${n.id}"`);
    choiceIds.add(n.id);
    const optionIds = new Set();
    for (const o of n.options) {
      if (optionIds.has(o.id)) fail(`${s.id}/${n.id}: duplicate option id "${o.id}"`);
      optionIds.add(o.id);
      if (!byId.has(o.to)) fail(`${s.id}/${n.id}/${o.id}: target "${o.to}" missing`);
      if (o.narrationFile && !existsSync(path.join(root, "public", o.narrationFile)))
        fail(`${s.id}/${n.id}/${o.id}: narration ${o.narrationFile} missing`);
    }
    if (n.promptNarrationFile && !existsSync(path.join(root, "public", n.promptNarrationFile)))
      fail(`${s.id}/${n.id}: prompt narration ${n.promptNarrationFile} missing`);
  }
  for (const f of s.preload ?? [])
    if (!existsSync(path.join(root, "public", f))) fail(`${s.id}: preload ${f} missing`);
});

// --- tiling ----------------------------------------------------------------
let expect = 0;
for (const s of segs) {
  if (s.from !== expect) fail(`${s.id}: starts at ${s.from}, expected ${expect} (gap or overlap)`);
  if (s.durationInFrames <= 0) fail(`${s.id}: empty segment`);
  expect = s.from + s.durationInFrames;
}
if (expect !== video.durationInFrames)
  fail(`segments end at ${expect} but the composition is ${video.durationInFrames} frames`);

// --- walk every path ---------------------------------------------------------
const paths = [];
const reached = new Set();
function walk(id, choices, route, frames, guard) {
  const s = byId.get(id);
  if (!s) return fail(`walk reached missing segment "${id}"`);
  if (guard.has(id)) return fail(`cycle at "${id}" via ${route.join(" > ")}`);
  const g = new Set(guard).add(id);
  reached.add(id);
  const r = [...route, id];
  const f = frames + s.durationInFrames;
  const n = s.next;
  if (n.kind === "end") return paths.push({ choices, route: r, frames: f });
  if (n.kind === "jump") return walk(n.to, choices, r, f, g);
  if (n.kind === "continue") return walk(segs[segs.indexOf(s) + 1]?.id, choices, r, f, g);
  for (const o of n.options) walk(o.to, { ...choices, [n.id]: o.id }, r, f, g);
}
walk(spec.start, {}, [], 0, new Set());
for (const s of segs) if (!reached.has(s.id)) fail(`${s.id}: unreachable from "${spec.start}"`);

// --- the seam engine agrees with the walk ------------------------------------
// Simulate the player: at each segment's hold frame, seamAction must say what
// the walk did.
for (const p of paths) {
  for (let i = 0; i < p.route.length; i++) {
    const s = byId.get(p.route[i]);
    const hold = s.from + s.durationInFrames - 2;
    const a = mod.seamAction(segs, s.id, hold);
    const want = p.route[i + 1];
    const ok =
      (s.next.kind === "end" && a.kind === "end") ||
      (s.next.kind === "choice" && a.kind === "choice" && a.segmentId === s.id) ||
      (a.kind === "seek" && a.segmentId === want && a.frame === byId.get(want).from) ||
      (a.kind === "advance" && a.segmentId === want);
    if (!ok) fail(`seamAction at ${s.id}@${hold} gave ${JSON.stringify(a)}, walk went to ${want}`);
    if (mod.seamAction(segs, s.id, hold - 1).kind !== "wait")
      fail(`seamAction fires early inside ${s.id}`);
  }
}

// --- firstChoiceSegment / lastChoiceSegment ---------------------------------
const first = mod.firstChoiceSegment(spec);
const firstChoice = segs.find((s) => s.next.kind === "choice");
if (first?.id !== firstChoice?.id) fail(`firstChoiceSegment gave ${first?.id}`);
if (mod.lastChoiceSegment(spec, {}) !== null) fail("lastChoiceSegment({}) should be null");
for (const p of paths) {
  const want = [...p.route].reverse().map((id) => byId.get(id)).find((s) => s.next.kind === "choice");
  const got = mod.lastChoiceSegment(spec, p.choices);
  if (!want) {
    if (got !== null) fail(`lastChoiceSegment on choice-free path should be null`);
    continue;
  }
  if (got?.segment.id !== want.id)
    fail(`lastChoiceSegment(${JSON.stringify(p.choices)}) gave ${got?.segment.id}, want ${want.id}`);
  const truncated = { ...p.choices };
  delete truncated[want.next.id];
  if (JSON.stringify(got?.path) !== JSON.stringify(truncated))
    fail(`lastChoiceSegment path ${JSON.stringify(got?.path)}, want ${JSON.stringify(truncated)}`);
  // A partial path (only the first answer) rewinds to the first choice... but
  // only if the walk can get past it; the second choice is then unanswered.
  const firstId = firstChoice.next.id;
  const partial = { [firstId]: p.choices[firstId] };
  const gotPartial = mod.lastChoiceSegment(spec, partial);
  if (gotPartial?.segment.id !== firstChoice.id || JSON.stringify(gotPartial.path) !== "{}")
    fail(`lastChoiceSegment on partial path ${JSON.stringify(partial)} gave ${gotPartial?.segment.id}`);
}
// A recorded answer that is not an option of its choice is ignored, not trusted.
if (firstChoice && mod.lastChoiceSegment(spec, { [firstChoice.next.id]: "nonsense" }) !== null)
  fail("lastChoiceSegment trusted an unknown option id");

// --- report ------------------------------------------------------------------
const secs = (f) => (f / fps).toFixed(1);
const mmss = (f) => {
  const t = Math.round(f / fps);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};
console.log(`${compId}: ${segs.length} segments, ${video.durationInFrames} frames (${secs(video.durationInFrames)}s) laid out`);
for (const s of segs)
  console.log(`  ${s.id.padEnd(12)} from ${String(s.from).padStart(5)}  ${secs(s.durationInFrames).padStart(6)}s  -> ${
    s.next.kind === "choice"
      ? `choice ${s.next.id} [${s.next.options.map((o) => `${o.id}->${o.to}`).join(", ")}]`
      : s.next.kind === "jump"
        ? `jump ${s.next.to}`
        : s.next.kind
  }`);
console.log(`\n${paths.length} distinct paths:`);
for (const p of paths)
  console.log(
    `  ${Object.values(p.choices).join(" / ").padEnd(30)} ${secs(p.frames).padStart(6)}s  (${mmss(p.frames)})  ${p.route.join(" > ")}`,
  );

if (failures.length) {
  console.error(`\nFAIL — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("\nPASS — every target exists, every segment is reachable, segments tile the composition, engine helpers agree.");
