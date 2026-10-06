# Changelog

All notable changes to this package are written here, newest first, in the form of [Keep a Changelog](https://keepachangelog.com), and this package follows [Semantic Versioning](https://semver.org).

## [Unreleased]

## [0.2.1] - 2026-10-06

Nothing that was exported has changed. The README is the family's one layout, in full.

### Added

- The README has a picture of the demo on a desk and on a phone, in light and dark, taken from the demo by `pnpm screenshots:readme` (the pictures are in `docs/images/` and are not in the package), a picture of each game and campaign (Falling Triplets, Colour Chains, Gem Swap, Stone Collapse, Magnetic Blocks, Shizen and Arashi) and of the tool tray on a phone, an Examples section of nine examples that run, examples for React, Vue, Svelte and Angular, an Accessibility section, and tables of the entry points and the calls to learn first.
- `pnpm test:readme` type-checks and runs every TypeScript and JavaScript example in the README against the built package, as a job of its own in CI; `src/readme.test.js` holds the README to the family's standard (sections in order, languages on code fences, pictures with alt text and a caption, no marketing words, version pins) in `pnpm check`; `pnpm test:package` fails if a picture or anything under `docs/` is in the packed package.

### Changed

- `pnpm screenshots:readme` takes the README's pictures as WebP in light and dark under `docs/images/`, instead of five PNGs of 3 MB taken by hand.

## [0.2.0] - 2026-10-06

### Added

- Three dedicated fifty-level campaigns: Magnetic Blocks, Shizen and Arashi, bringing the package to 450 original graded challenges. Exact boards, finite queues, stable IDs, measured difficulty, winning witnesses and deterministic generation are published with the engines.
- Campaign selectors, fixed rule displays, goal progress, replay and next-level recovery in the players.

### Fixed

- Clear game-over results and disabled play controls; fixed challenge settings; exact save recovery; responsive goal text; shared cloth and piece appearance; generated API imports and markup.
- Stable board geometry when switching English and Japanese at phone, tablet and desktop widths.


### Changed

- `CONTRIBUTING.md` is the family's one text with a section of its own for Houseki, held to the master in johnmorrisdotca/.github by `src/family.test.js`; `ci.yml` and `pages.yml` are the family's one text (`pnpm check`, the demo, and the package on Linux, macOS and Windows), and any jobs of the package's own after them.
- The demo's shared stylesheet is `demo/houseki.css` (it was `game.css`), named for the package like the family's.

## [0.1.1] - 2026-10-05

### Changed

- The package is brought to the family's standard: the same checks (`pnpm check` is lint, types and tests), tests run by Vitest, a CI workflow on Node 22 and 24, a release workflow that publishes by trusted publishing, and a Pages workflow, all on current action versions; `pnpm test:package` packs, installs and imports every entry point.
- `package.json` is made like the family's: a description short enough for npm, homepage, author, `module` and `sideEffects`.
- The README follows the family's order and lists all twenty-four packages of the family, made from the shared template.
- The demo's four pages are made under the family's header, footer, language chooser, Help switch and table cloths, with a description, an icon and a title in the family's form, and an API reference in the same header. The page's own Theme button is gone: light and dark follow the device, as in the other demos.
- The demo's tests are Playwright tests that run at a phone's width and a desk's, in Chromium, and the pages themselves in WebKit too.

### Fixed

- A new game on a page served over plain http, from an address other than localhost, no longer fails: the seed falls back to random bytes where `crypto.randomUUID` does not exist.
- The API reference no longer widens the page on a phone for a doc comment that names a long entry path.
- Unused imports and variables are removed from the source; no public export, signature or behaviour changes.

## [0.1.0] - 2026-10-05

### Added

- Original Falling Triplets, Colour Chains, Stone Collapse and Gem Swap engines with immutable state, seeded play, validated settings and canonical saves.
- 300 graded challenges and three bilingual lessons for each game.
- Family-style keyboard, keypad and touch demos, configurable boards, stored tools, goal progress and shared animation preferences.
- Optional Black Hole powers, Shizen magnetic stones with bounded rebound, and Arashi jumble and lightning schedules.
- An experimental Magnetic Blocks engine with bonded squares, magnetic floor schedules, a Floor Switch and impact drops.
- Typed entry points, a generated API reference, an MIT licence and reproducible package checks.

[Unreleased]: https://github.com/johnmorrisdotca/houseki/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/johnmorrisdotca/houseki/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/johnmorrisdotca/houseki/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/johnmorrisdotca/houseki/releases/tag/v0.1.0
