// Build dist-site/ and force-push it to the gh-pages branch (GitHub Pages).
//
//   npm run deploy
//
// dist-site/ holds its own tiny git repo (ignored by the main repo) whose
// only job is to be pushed to gh-pages.

import { execSync } from "node:child_process";

const REMOTE = "https://github.com/VSimilitude/video-generation.git";
const run = (cmd) => execSync(cmd, { stdio: "inherit" });

run("npm run site");
run("git -C dist-site init -b gh-pages -q");
run("git -C dist-site add -A");
try {
  run(
    'git -C dist-site -c user.name="Mike Verb" -c user.email="mikeverb@gmail.com" commit -q -m "Deploy player site"',
  );
} catch {
  console.log("No changes since last deploy.");
  process.exit(0);
}
run(`git -C dist-site push -f ${REMOTE} gh-pages`);
console.log("Deployed: https://vsimilitude.github.io/video-generation/");
