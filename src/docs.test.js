// The documents and the demo, held to the source. Plain JavaScript, so that reading files needs no Node types.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { PAGES, pageWords } from "../demo/words.js";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const readme = readFileSync("README.md", "utf8");

/** A README section's text, from its heading to the next heading of the same level. */
const section = (heading) => {
  const from = readme.indexOf(`\n## ${heading}\n`);
  if (from < 0) throw new Error(`no “## ${heading}” in the README`);
  const next = readme.indexOf("\n## ", from + 5);
  return readme.slice(from, next < 0 ? undefined : next);
};

/** The cells of every table row in a piece of text, header and rule rows left out. */
const rows = (text) =>
  text
    .split("\n")
    .filter((line) => line.startsWith("|") && !/^\|[\s|:-]+\|$/.test(line))
    .map((line) => line.split(/(?<!\\)\|/).slice(1, -1).map((cell) => cell.replace(/\\\|/g, "|").trim()));

describe("the documents", () => {
  it("say the version package.json says, in the changelog (under Unreleased until it is released)", () => {
    const log = readFileSync("CHANGELOG.md", "utf8");
    expect(log).toMatch(new RegExp(`^## \\[(${pkg.version.replace(/\./g, "\\.")}|Unreleased)\\]`, "m"));
  });

  it("name in the README every entry package.json exports, and no other", () => {
    const exported = Object.keys(pkg.exports).filter((key) => key !== ".").map((key) => `${pkg.name}/${key.slice(2)}`);
    for (const entry of exported) expect(readme, entry).toContain(`${entry}`);
    const named = new Set([...readme.matchAll(/@johnmorrisdotca\/houseki\/([a-z-]+)/g)].map((match) => match[1]));
    for (const name of named) expect(exported, name).toContain(`${pkg.name}/${name}`);
  });

  it("keep the family's stylesheet byte for byte, as its first line's hash says", () => {
    const [first, ...rest] = readFileSync("demo/family.css", "utf8").split("\n");
    const hash = /sha256 of every line after this one: ([0-9a-f]{64})/.exec(first)?.[1];
    expect(createHash("sha256").update(rest.join("\n")).digest("hex")).toBe(hash);
  });
});

describe("the package.json a visitor reads", () => {
  it("has a description npm shows whole, and the demo as its homepage", () => {
    expect(pkg.description.length).toBeLessThanOrEqual(250);
    expect(pkg.description).toMatch(/\.$/);
    expect(pkg.homepage).toBe("https://johnmorrisdotca.github.io/houseki/");
  });

  it("is an ES module with types, no side effects and no runtime dependencies", () => {
    expect(pkg.type).toBe("module");
    expect(pkg.sideEffects).toBe(false);
    expect(pkg.dependencies ?? {}).toEqual({});
    for (const [key, entry] of Object.entries(pkg.exports)) {
      expect(Object.keys(entry), key).toEqual(["types", "import", "default"]);
    }
  });
});

describe("the README's promises", () => {
  it("has the sections a package of this family has, each with something in it", () => {
    for (const heading of ["In 30 seconds", "Who it is for", "Features", "Use it in your project", "API", "Theming", "Limits", "Browser support", "Languages", "Roadmap", "Architecture", "The name", "Where it comes from", "Development", "Contributing", "Changes", "Licence"]) {
      expect(section(heading).length, heading).toBeGreaterThan(heading.length + 40);
    }
  });

  it("installs the package it is, and every version it names is the one in package.json", () => {
    expect(readme).toContain(`npm install ${pkg.name}`);
    const major = pkg.version.split(".")[0];
    const named = [...readme.matchAll(/@johnmorrisdotca\/houseki@([\w.-]+)/g)].map((match) => match[1]);
    expect(named.length).toBeGreaterThan(0);
    for (const version of named) expect(version).toBe(major);
    expect(readme).not.toMatch(/\bhouseki@\d+\.\d+/);
  });

  it("links only to files that exist", () => {
    const targets = [...readme.matchAll(/\]\((?!https?:|#|mailto:)([^)\s#]+)/g)].map((match) => match[1]);
    expect(targets.length).toBeGreaterThan(5);
    for (const target of targets) expect(existsSync(target), target).toBe(true);
    for (const [, src] of readme.matchAll(/<img [^>]*src="(?!https?:)([^"]+)"/g)) expect(existsSync(src), src).toBe(true);
  });

  it("lists every package of the family, with its kana, as the demo's footer does", () => {
    const template = readFileSync("scripts/family-template.mjs", "utf8");
    const family = [...template.matchAll(/\{ id: "([\w-]+)", name: "(\w+)", kana: "([^"]+)" \}/g)].map((match) => ({ id: match[1], name: match[2], kana: match[3] }));
    expect(family.length).toBe(24);
    const block = readme.slice(readme.indexOf("### The family"), readme.indexOf("\n## ", readme.indexOf("### The family")));
    for (const { id, name, kana } of family) expect(block, id).toContain(`- [${name}](https://github.com/johnmorrisdotca/${id}) (${kana}`);
    expect(block).toContain("one of twenty-four packages");
    expect([...block.matchAll(/^- \[/gm)]).toHaveLength(family.length);
  });

  it("gives every game its entry point and its number of challenges, as the engines have them", async () => {
    const table = rows(section("Features").slice(section("Features").indexOf("### The games")));
    const counts = {
      "falling-triplets": (await import("./falling-triplets.ts")).levelManifest.length,
      "colour-chains": (await import("./colour-chains.ts")).levelManifest.length,
      "stone-collapse": (await import("./stone-collapse.ts")).levelManifest.length,
      "gem-swap": (await import("./gem-swap.ts")).GEM_SWAP_CAMPAIGN.length,
    };
    for (const [entry, count] of Object.entries(counts)) {
      const row = table.find((cells) => cells[1] === `\`${entry}\``);
      expect(row, entry).toBeDefined();
      expect(row[4], entry).toBe(String(count));
    }
    const chains = await import("./colour-chains.ts");
    const blocks = await import("./magnetic-blocks.ts");
    for (const [name, count] of [["Magnetic Blocks", blocks.levelManifest.length], ["Shizen", chains.shizenLevelManifest.length], ["Arashi", chains.arashiLevelManifest.length]]) {
      expect(table.find(cells => cells[0] === name)?.[4], name).toBe(String(count));
      expect(count, name).toBe(128);
    }
    expect(Object.values(counts).reduce((sum, count) => sum + count, 0) + blocks.levelManifest.length + chains.shizenLevelManifest.length + chains.arashiLevelManifest.length).toBe(684);
    expect(table.find((cells) => cells[1] === "`magnetic-blocks`")).toBeDefined();
  });

  it("has the files a visitor looks for: the package's own issue templates, its security policy, and the rest of what its README links", () => {
    for (const file of [".github/ISSUE_TEMPLATE/report-a-bug.md", ".github/ISSUE_TEMPLATE/suggest-a-feature.md", ".github/ISSUE_TEMPLATE/fix-a-translation.md", ".github/ISSUE_TEMPLATE/add-my-project.md", ".github/ISSUE_TEMPLATE/config.yml", "SECURITY.md", "CODE_OF_CONDUCT.md", "CONTRIBUTING.md", "LICENSE"]) expect(existsSync(file), file).toBe(true);
  });
});

describe("the demo", () => {
  it("has each page's markup, its script and its title and description in the family's form", () => {
    for (const [key, page] of Object.entries(PAGES)) {
      expect(existsSync(`demo/${page.file}`), key).toBe(true);
      expect(page.title, key).toMatch(/^Houseki · \S/);
      expect(page.description.length, key).toBeGreaterThan(80);
      const html = readFileSync(`demo/${page.file}`, "utf8");
      for (const marker of ["family:head", "family:header", "family:pages", "family:unreviewed", "family:footer", "family:scripts"]) expect(html, `${key} ${marker}`).toContain(`<!--${marker}`);
      expect(html, key).not.toMatch(/id="theme"|id="language"/);
    }
  });

  it("says every word of the header and footer in both languages", () => {
    for (const key of Object.keys(PAGES)) {
      const words = pageWords(key);
      expect(Object.keys(words.ja).sort(), key).toEqual(Object.keys(words.en).sort());
      for (const [name, text] of Object.entries(words.ja)) expect(text, `${key} ${name}`).toMatch(/\S/);
    }
  });

  it("marks every option row for the Help switch with a line in both languages", () => {
    for (const page of Object.values(PAGES)) {
      const html = readFileSync(`demo/${page.file}`, "utf8");
      const rowsMarked = [...html.matchAll(/data-help-en="([^"]+)" data-help-ja="([^"]+)"/g)];
      expect(rowsMarked.length, page.file).toBeGreaterThan(2);
      for (const [, en, ja] of rowsMarked) {
        expect(en.length, page.file).toBeGreaterThan(10);
        expect(ja.length, page.file).toBeGreaterThan(4);
      }
    }
  });

  it("never reaches for crypto.randomUUID outside the seed helper, which falls back on a page served over plain http", () => {
    for (const file of ["demo.js", "chains.js", "tools.js", "blocks.js"]) expect(readFileSync(`demo/${file}`, "utf8"), file).not.toContain("randomUUID");
  });
});

describe("the community files", () => {
  it("keep SECURITY.md and CODE_OF_CONDUCT.md equal to the family's master text, a copy of which is kept in scripts/community", () => {
    for (const file of ["SECURITY.md", "CODE_OF_CONDUCT.md"]) expect(readFileSync(file, "utf8"), file).toBe(readFileSync(`scripts/community/${file}`, "utf8"));
  });
});
