// Static-asset half of `npm run site`.
//
// The npm script esbuilds src/site/main.tsx to dist-site/bundle.js first; this
// script then assembles the rest of the deployable directory:
//
//   dist-site/index.html   copied from site/index.html
//   dist-site/narration/   copied from public/narration (the compositions load
//                          these via staticFile(), resolved relative to the
//                          page — so they must ship alongside index.html)
//   dist-site/.nojekyll    GitHub Pages: serve files/dirs as-is
//
// Node-only (no shell built-ins) so it works the same on Linux/macOS/Windows.

import { cp, mkdir, rm, writeFile, stat, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist-site");
const bundle = path.join(outDir, "bundle.js");
const narrationSrc = path.join(root, "public", "narration");
const narrationOut = path.join(outDir, "narration");

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

await mkdir(outDir, { recursive: true });

if (!(await exists(bundle))) {
  console.error(
    "dist-site/bundle.js is missing — run this via `npm run site` (esbuild step first).",
  );
  process.exit(1);
}

await cp(path.join(root, "site", "index.html"), path.join(outDir, "index.html"));

// Replace rather than merge, so clips deleted from public/ don't linger.
await rm(narrationOut, { recursive: true, force: true });
if (await exists(narrationSrc)) {
  await cp(narrationSrc, narrationOut, {
    recursive: true,
    // Leave build bookkeeping (.cache.json) out of the published site.
    filter: (src) => !path.basename(src).startsWith("."),
  });
} else {
  console.warn(
    "public/narration not found — the site will play silent. Run `npm run narration`.",
  );
}

await writeFile(path.join(outDir, ".nojekyll"), "");

const { size } = await stat(bundle);
const slugs = (await exists(narrationOut))
  ? (await readdir(narrationOut, { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  : [];
console.log(
  `dist-site ready: bundle.js (${Math.round(size / 1024)} kB), index.html, .nojekyll` +
    (slugs.length ? `, narration/{${slugs.join(", ")}}` : ""),
);
