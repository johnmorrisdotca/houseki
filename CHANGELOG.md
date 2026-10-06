# Changelog

All notable changes to this package are written here, newest first, in the form of [Keep a Changelog](https://keepachangelog.com), and this package follows [Semantic Versioning](https://semver.org).

## [Unreleased]

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

[Unreleased]: https://github.com/johnmorrisdotca/houseki/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/johnmorrisdotca/houseki/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/johnmorrisdotca/houseki/releases/tag/v0.1.0
