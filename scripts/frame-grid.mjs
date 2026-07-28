// Render-neutrality harness: a grid of frame-states, for proving that code
// which moved under an existing caller did not change what it draws.
//
//   node scripts/frame-grid.mjs <outDir> [step]              # every Nth frame
//   node scripts/frame-grid.mjs <outDir> --frames Id:1200 …  # exactly these
//
// Compare two runs with `node scripts/frame-diff.mjs <dirA> <dirB>`; see
// docs/PROCESS.md §7 for the procedure (and for why the comparison needs a
// same-code control run rather than a hash equality check).
//
// One browser for the whole run — `renderStill` would otherwise start one per
// frame, and 800 stills would cost an hour instead of four minutes.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";

// The compositions a kids'-series promotion has to leave alone. DripChooses is
// in the list because it reuses episode one's scene kit through
// drip-fork/scenes/common — it is the third consumer of anything promoted out
// of it, and the easiest one to forget.
const DEFAULT_TARGETS = ["DripWaterCycle", "PuffWind", "DripChooses"];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const outDir = path.resolve(args[0] ?? "scratchpad/frames");
const explicit = args.indexOf("--frames");
const step = explicit === -1 ? Number(args[1] ?? 100) : 0;
const wanted =
  explicit === -1
    ? null
    : args.slice(explicit + 1).map((s) => {
        const [id, frame] = s.split(":");
        return { id, frame: Number(frame) };
      });

mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  onProgress: () => undefined,
});
const browser = await openBrowser("chrome");
const compositions = new Map();
const started = Date.now();
const lines = [];

async function compositionFor(id) {
  if (!compositions.has(id)) {
    compositions.set(
      id,
      await selectComposition({ serveUrl, id, inputProps: {}, puppeteerInstance: browser }),
    );
  }
  return compositions.get(id);
}

async function shoot(id, frame) {
  const composition = await compositionFor(id);
  const file = path.join(outDir, `${id}_${String(frame).padStart(6, "0")}.png`);
  await renderStill({
    composition,
    serveUrl,
    output: file,
    frame,
    imageFormat: "png",
    // Half size: a promotion that moved something moves whole shapes, and the
    // full-size frames are four times the disk for no more signal.
    scale: 0.5,
    puppeteerInstance: browser,
    logLevel: "error",
  });
  const hash = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 16);
  lines.push(`${id} ${String(frame).padStart(6, "0")} ${hash}`);
  process.stdout.write(`\r${lines.length} stills, ${Math.round((Date.now() - started) / 1000)}s`);
}

if (wanted) {
  for (const { id, frame } of wanted) await shoot(id, frame);
} else {
  for (const id of DEFAULT_TARGETS) {
    const composition = await compositionFor(id);
    for (let f = 0; f < composition.durationInFrames; f += step) await shoot(id, f);
    await shoot(id, composition.durationInFrames - 1);
  }
}

await browser.close({ silent: true });
writeFileSync(path.join(outDir, "hashes.txt"), `${lines.join("\n")}\n`);
process.stdout.write(`\ndone: ${lines.length} stills -> ${outDir}\n`);
