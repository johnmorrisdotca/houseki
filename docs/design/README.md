# Matching games: design pack

Design revision: 1.1 · 2026-10-06 · Owner: John Morris

This pack specifies five original matching games for a standalone open-source library. It is a design and implementation contract, not a claim that the games have been built or their feel has been approved. Itsutsu integration is deferred to the site's maintainer. Do not edit Itsutsu while implementing this pack.

## The games

| Game | Player action | Match rule | Main pleasure |
| --- | --- | --- | --- |
| [Falling Triplets](01-FALLING-TRIPLETS.md) | Move a falling column; cycle its three colours | Lines of three, including diagonals | Read the landing, set up a cascade |
| [Stone Collapse](02-STONE-COLLAPSE.md) | Select and confirm a connected group | Orthogonal groups of two or more | Plan which groups to remove first |
| [Colour Chains](03-COLOUR-CHAINS.md) | Move and rotate a falling pair | Orthogonal groups of four or more | Build a deliberate multi-stage chain |
| [Gem Swap](04-GEM-SWAP.md) | Swap adjacent gems | Horizontal/vertical runs of three or more | Discover cascades and combine special gems |
| [Magnetic Blocks](CAMPAIGN-EXTENSIONS.md) | Rotate bonded squares; plan the floor | Orthogonal groups of four or more | Choose bonded versus split settling |

These are separate games sharing a visual language and library infrastructure. Shizen and Arashi are Colour Chains variants with dedicated campaigns. A colour count or board size is a setting.

## Read and implement in this order

1. [Shared design](SHARED-DESIGN.md): visual reference, accessibility, input, animation and game modes.
2. [Package architecture](PACKAGE-ARCHITECTURE.md): module ownership, immutable state, random sequences, saves and replay.
3. The assigned game's complete design above, including its edge cases and worked examples.
4. [Implementation plan](IMPLEMENTATION-PLAN.md): milestones, sequencing, boundaries and implementation brief.
5. [Acceptance and release](ACCEPTANCE-AND-RELEASE.md): measurable checks and human playtesting.

The [reusable template](GAME-DESIGN-TEMPLATE.md) is for future games. The [visual reference](reference/visual-reference.html) shows the proposed family layout in light and dark themes. It is a static design reference, not a playable prototype. [Fixtures](reference/rules-fixtures.json) encode the worked rule examples; an independent checker validated their expected results.

## Scope and naming

Owner-approved library name: **Houseki / 宝石**, with package identifier `@johnmorrisdotca/houseki` (confirmed 2026-10-05). The owner created [johnmorrisdotca/houseki](https://github.com/johnmorrisdotca/houseki) on 2026-10-05. The isolated implementation checkout is linked to this repository. The npm package is published; released versions and changes are recorded in the changelog. Changing the package name must not change game IDs or save semantics.

Game IDs: `falling-triplets`, `stone-collapse`, `colour-chains`, `gem-swap`, `magnetic-blocks`. Public game names are the English names above, with Japanese copy supplied in the shared design. Release one finished game first; expose the others only after each independently passes its release gates. Keep incomplete entry points out of published exports.

## What is fixed and what may be tuned

The rules, event ordering, input semantics, save format and expected fixtures are specified. Implement them exactly. Any discrepancy is a design issue to resolve explicitly, not a silent local adjustment.

Animation durations, sound levels, level difficulty and speed progression are starting targets. Record changes with before/after measurements and playtest evidence. Update the relevant document and tests before freezing a rules version. No design in this pack has yet passed the human feel review.

## Existing family references

Use the current owner-maintained [Kyuubu contribution rules](https://github.com/johnmorrisdotca/kyuubu/blob/main/CONTRIBUTING.md), [Kyuubu demo](https://johnmorrisdotca.github.io/kyuubu/), [Kazu demo](https://johnmorrisdotca.github.io/kazu/) and [Tobiishi demo](https://johnmorrisdotca.github.io/tobiishi/) as implementation and presentation references. The family stylesheet included here is a byte-identical snapshot used for the mockup; obtain the current canonical shared files at implementation time and preserve their shared hashes.

At release, use the same API documentation, screenshots, badges, MIT licensing, keywords and community-file checks as the established packages. Original source, original layouts and owner-approved original or verified CC0/public-domain assets only. Do not port another game's source or reuse its artwork, music, characters or level collections.

Project text and authorship metadata belong to John Morris.

## Design verification record

The design review checks local links, required sections, fixture results, the reference's mobile layout, light/dark contrast and visual identity. These checks verify the documents and reference only. Implementation, actual-device responsiveness, balancing, sound and commercial feel remain mandatory work described in the release checklist.

## First slice review requirements

Revision 1.3 incorporates the [first implementation findings](DESIGN-REVIEW.md). Apply the completion contract appended to each game design: element-bound layout checks across every preset, observable phase snapshots, accurate legal actions, strict public validation, focus-safe keyboard controls and replay-authoritative saves. These supplement existing requirements and must be reflected in the coverage manifest.

## Revision 1.3 — Bounded implementation and review gates

The implementation assignment covers exactly one milestone at a time. After completing that milestone, stop and deliver the tested source revision, coverage table, actual player evidence when applicable, and remaining defects. The reviewer independently checks the work, assigns a bounded correction task for failures, updates this design when wording or examples were insufficient, and explicitly assigns the next milestone only after the gate passes. Do not interpret the full design as permission to continue through unreviewed later milestones.

1. **Core:** board/state validation, deterministic randomness, gravity and the game's basic input/preview. Prove identity and immutability.
2. **Rules:** exact matching/groups, resolution phase snapshots, score and ending order. Prove decisive independent fixtures.
3. **Timing and controls:** any falling clock/locking, held controls, focus/pause, keyboard and pointer parity. Prove boundaries and actual viewport element bounds.
4. **Modes and persistence:** all specified modes, objectives, canonical saves/replays, assistance and hostile input validation.
5. **Content and feel:** three interactive lessons, an intentionally sized, graded and ordered original challenge campaign (target 100; see LEVEL-GENERATION.md), both languages, original opt-in audio, materials and reduced motion. Human translation/device/feel approval is tracked separately and cannot be fabricated.
6. **Package and documentation:** source-derived API reference, README real images, MIT/community metadata, checked installed tarball, browser integration and complete coverage report.

A correction assignment contains the concrete defect, expected behaviour and regression check. Keep shared infrastructure under one owner and game modules under separate owners; no concurrent edits of the same files. Each later game begins from the revised requirements and reviewed shared contracts, with its own bounded milestone. All four games are authorized; site integration and npm publishing remain outside this implementation batch.

## Campaign generation and ordering policy

Follow [LEVEL-GENERATION.md](LEVEL-GENERATION.md): deliberate complete counts such as 100/200 or structured 128/256, not arbitrary unfinished totals; independently witnessed original boards; deterministic player-facing grading before numbering; simple openings and hardest endings; stable content IDs; deduplication and reproducible progression tests. Houseki targets 100 per game, with a reviewed smaller or larger complete count allowed when justified. Three separate tutorials do not pad the campaign count.

Advanced designs have separate implementation gates: [Black Hole](BLACK-HOLE.md), [Magnetic Blocks and Floor Switch](MAGNETIC-BLOCKS.md), and [Earthquake, Lightning and deep boards](ENVIRONMENTAL-MODES.md). These documents describe proposed rules; they do not imply released support.

[Magnetic Pieces](MAGNETIC-PIECES.md) defines rare queue/layout distribution, clear marking and bounded grid attraction separately from the floor mechanic.

[Bounce and nature modes](BOUNCE-AND-NATURE.md) specifies controlled placement versus rebound and proposes naming choices. Working, tested development checkpoints should be committed frequently; unfinished feel review remains explicitly recorded.

## Additional campaigns

[Campaign extensions](CAMPAIGN-EXTENSIONS.md) specifies the published fifty-level Magnetic Blocks, Shizen and Arashi baseline and the approved 128-level expansion, with fixed rules, verification, grading and player requirements.

## Campaign maintenance

Read [Campaign review workflow](CAMPAIGN-REVIEW-WORKFLOW.md) before extending a campaign. It supplies a prototype-first process, an evidence worksheet and regression/release gates. [Family grading review](LEVEL-GRADING-REFERENCES.md) records the consulted predecessors. Keep engine-specific construction methods and review findings beside these documents so later revisions improve the process rather than repeat its mistakes.

Use [Campaign design template](CAMPAIGN-DESIGN-TEMPLATE.md) as a filled-in specification for a future game or campaign revision. The worksheet asks for actual source precedents, metric definitions, proof limits, recovery and release evidence.
