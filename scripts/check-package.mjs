// Packs the package the way it is published (`npm pack`, npm and not pnpm),
// installs the tarball into an empty project, and uses it as somebody who
// installed it would: every entry in `exports` imported by ESM and loaded by
// `require`, and each command in `bin` run. A package whose `exports` name a
// file that is not in the tarball fails here, before it can be published.
// `pnpm test:package` builds first.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const windows = process.platform === "win32";
const scratch = mkdtempSync(join(tmpdir(), "houseki-package-"));

/** Run a command and hand back what it printed. On Windows, npm and the installed commands are .cmd files, which only a shell runs; node itself is run directly. */
function run(command, args, cwd, viaShell = false) {
  const shell = viaShell && windows;
  // A path is quoted for the shell; a bare name such as npm is left for the shell to find.
  const ran = spawnSync(shell && /[\\/]/.test(command) ? `"${command}"` : command, args, { cwd, encoding: "utf8", shell });
  if (ran.status !== 0) {
    console.error(`FAIL ${command} ${args.join(" ")}\n${ran.stdout}\n${ran.stderr}`);
    process.exit(1);
  }
  return ran.stdout;
}

// 1. Pack, with npm.
const packed = JSON.parse(run("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", scratch], root, true));
const tarball = join(scratch, packed[0].filename);
const inTarball = new Set(packed[0].files.map((file) => file.path));
console.log(`ok   npm pack: ${packed[0].filename}, ${packed[0].files.length} files`);
// The README's pictures are in docs/images, for GitHub and npm to show by address, and are never in what is installed.
const shipped = [...inTarball].filter((file) => file.startsWith("docs/") || /\.(webp|png|jpe?g|gif)$/.test(file));
if (shipped.length > 0) {
  console.error(`FAIL the tarball holds pictures or docs: ${shipped.join(", ")}`);
  process.exit(1);
}
console.log("ok   no picture and nothing from docs/ is in the tarball");

// 2. Everything package.json points at is in the tarball.
const pointed = [pkg.main, pkg.module, pkg.types, ...Object.values(pkg.bin ?? {}), ...Object.values(pkg.exports).flatMap((entry) => (typeof entry === "string" ? [entry] : Object.values(entry)))];
for (const file of new Set(pointed)) {
  if (!inTarball.has(file.replace(/^\.\//, ""))) {
    console.error(`FAIL package.json points at ${file}, which is not in the tarball`);
    process.exit(1);
  }
}
console.log(`ok   every file package.json points at is in the tarball (${new Set(pointed).size})`);

for (const named of pkg.files) {
  if (![...inTarball].some((file) => file === named || file.startsWith(`${named}/`))) {
    console.error(`FAIL package.json's files names ${named}, which is not in the tarball`);
    process.exit(1);
  }
}
console.log(`ok   everything in package.json's files is in the tarball (${pkg.files.length})`);

// 3. Install it into an empty project.
const project = join(scratch, "project");
mkdirSync(project);
writeFileSync(join(project, "package.json"), JSON.stringify({ name: "scratch", private: true, version: "0.0.0" }));
run("npm", ["install", "--no-audit", "--no-fund", "--silent", tarball], project, true);
console.log("ok   npm install of the tarball");

// 4. Every entry in `exports`, imported as an installer would, and each game's engine run from the installed copy.
const entries = Object.keys(pkg.exports).map((key) => (key === "." ? pkg.name : `${pkg.name}/${key.slice(2)}`));
writeFileSync(
  join(project, "esm.mjs"),
  `import assert from "node:assert/strict";
${entries.map((entry, i) => `import * as m${i} from ${JSON.stringify(entry)};`).join("\n")}
const names = ${JSON.stringify(entries)};
[${entries.map((_, i) => `m${i}`).join(", ")}].forEach((m, i) => { if (Object.keys(m).length === 0) throw new Error(names[i] + " exports nothing"); });
const collection = m0;
for (const [entry, name] of [["falling-triplets", "fallingTriplets"], ["stone-collapse", "stoneCollapse"], ["colour-chains", "colourChains"], ["gem-swap", "gemSwap"], ["magnetic-blocks", "magneticBlocks"]]) {
  const engine = await import(${JSON.stringify(`${pkg.name}/`)} + entry);
  assert.equal(collection[name].createGame, engine.createGame);
  const game = engine.createGame({ seed: "installed-package" });
  assert.equal(game.game, entry);
  assert.ok(game.board.length > 0);
  assert.equal(typeof engine.applyAction, "function");
  assert.equal(typeof engine.advanceTicks, "function");
}
const chains = collection.colourChains;
const blocks = collection.magneticBlocks;
for (const [levels, create] of [[chains.shizenLevelManifest, chains.createShizenLevel], [chains.arashiLevelManifest, chains.createArashiLevel], [blocks.levelManifest, blocks.createLevel]]) {
  assert.equal(levels.length, 128);
  for (const number of [1, 64, 128]) {
    const state = create(number);
    assert.equal(state.phase, "falling");
    assert.ok(state.settings.goal);
    assert.ok(state.board.length > 0);
  }
}
const nature = await import(${JSON.stringify(`${pkg.name}/nature`)});
assert.equal(collection.nature.createNatureState, nature.createNatureState);
console.log(names.join(" "));
`,
);
console.log(`ok   import:  ${run(process.execPath, ["esm.mjs"], project).trim()}`);

rmSync(scratch, { recursive: true, force: true });
console.log("the package installs and runs as published, on", process.platform, process.version);
