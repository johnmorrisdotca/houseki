# Implementation plan and brief

Revision 1.3 · Deliver a standalone library and family demo. Do not integrate into Itsutsu.

## Starting decisions

One shared package is preferable to four packages: the games share board presentation, colours/materials, input, recording and release work, but preserve independent rules modules. Use the owner-approved Houseki name and `@johnmorrisdotca/houseki` identifier in design/code. The name was confirmed and the owner created [johnmorrisdotca/houseki](https://github.com/johnmorrisdotca/houseki) on 2026-10-05. The local checkout is linked to that repository. npm publishing follows completed implementation and release checks.

Use original TypeScript implementations, not translated or copied engines. Study the listed gameplay references and the owner's family packages for behaviour/style. Do not import executable reference implementations or published level sets. Existing licences and family copyright notices remain intact where shared assets/scripts are reused.

The first public version can expose only Falling Triplets once complete. Stone Collapse, Colour Chains and Gem Swap then become reviewed feature releases. Alternatively release all four together only after all four pass; an incomplete game does not get a public API merely to fill the menu.

## Work ownership and safe parallelism

| Work area | Editable paths | Dependencies |
| --- | --- | --- |
| Shared foundation | `src/core/`, public common types/constants, package/build/release scripts, shared view/input | First agreed board/event/API contracts |
| Falling Triplets | `src/falling-triplets/`, its tests/content, its player adapter | Foundation contracts |
| Stone Collapse | `src/stone-collapse/`, its tests/content, its player adapter | Foundation contracts |
| Colour Chains | `src/colour-chains/`, its tests/content, its player adapter | Foundation; agreed falling scheduler |
| Gem Swap | `src/gem-swap/`, its tests/content, its player adapter | Foundation contracts |

One implementation owner edits each area. Shared files have one maintainer. Changes to core contracts are proposed with a small concrete diff; do not have four implementations quietly change the same type. Separate branches/checkouts per game, no shared stash operations and no changes in Itsutsu's active checkout. Review and land complete changes into the package integration checkout.

Parallel engine work can begin after the foundation and fixtures are agreed. Sequence feel reviews: Triplets first, then Collapse, Chains and Swap. Reuse successful input/rendering patterns only after their first real review. Avoid multiplying an unreviewed interaction across four games.

## Milestones and exit criteria

### M0 — Design and contracts

- Read this pack and the actual family package instructions.
- Public naming is confirmed as Houseki and the GitHub repository exists; prepare reviewed changes in its isolated checkout.
- Resolve any rule contradiction as an explicit design edit. Record decisions, never invent defaults silently.
- Agree board addressing, mask/gravity semantics, event ordering, random identity and proposed API.
- Turn reference examples into independently expected test fixtures.

Exit: reviewed design revision and interface definitions. Open questions concern tuning, not missing win rules.

### M1 — Shared foundation

- Pure board validation, address conversion, stable gravity and connected-mask checks.
- Frozen random-vector tests and deterministic bag/refill utilities.
- Transition/event model and canonical input scheduler.
- Family demo shell, ivory board/three materials, permanent colour symbols, shared accessible controls.
- Empty consumer package check, source-derived API scaffolding, presentation gate.

Exit: a headless model imports in Node; a reference board renders in both themes; controls work by touch and keyboard without altering the actual host project. Contract tests pin invariants.

### M2 — One playable slice per game

- Triplets: relaxed placement, cycling/ghost, diagonal clear and two-wave cascade.
- Collapse: group preview/confirmation, gravity/column compression and honest ending.
- Chains: pair rotations/kicks, split ghost and connected four-chain.
- Swap: normal swaps, invalid return, gravity/refill and no-move ending.

Each slice includes a seed, Restart, score and one decisive replay fixture. Use real package code and controls; no mock engine behind the demonstration.

Exit: reviewer plays it on keyboard and a real phone, records feel scores, compares visuals to the design reference and approves or lists concrete changes. Capture screenshots/video of the real slice. Do not label a slice production-ready.

### M3 — Full rules and modes

Add falling clocks/lock semantics, special creation/combination table, objectives, supported shapes and all stated modes. Complete independent rule checks and boundary/property tests. Implement rejected-action reasons and clear recovery. Verify the rules at low/high render rates.

Exit: every game-specific rule has a decisive fixture and complete run tests; no rule remains a TODO or unsupported menu choice.

### M4 — Complete experience

Add three interactive lessons and an intentionally sized graded campaign per game, targeting 100 original witnessed challenges, English/Japanese copy, assistance handling, saving/resume/replay, sound controls, reduced motion and tested skins. Tune progression and level budgets from real playtests. Do not fabricate reviewed difficulty or translation status.

Exit: playable content covers each distinctive mechanic; witnesses all replay; complete UI/string checks pass; first-time users can learn and finish a lesson unaided.

### M5 — Quality and release

Complete the [acceptance checklist](ACCEPTANCE-AND-RELEASE.md), packed consumer imports, browser/real-device checks, API docs, README images and family registration. Review source and authorship metadata. Build and inspect the actual npm tarball; check the deployed demo and public README after publishing.

Exit: all hard gates pass, human review accepts the feel, and public artifacts visibly contain the promised documentation/assets. Record exact package version, rules versions, commit and checks. Authentication remains a maintainer step when required.

## Implementation brief to reuse

Copy this section into a work assignment, setting only the bracketed fields. Read all linked files as part of the assignment.

> Implement **[game title]**, ID **[game ID]**, in **[absolute isolated package checkout]**, owned paths **[paths from the ownership table]**. Follow its design file, the shared design, architecture and acceptance checklist in this pack. First deliver M2's playable slice, including the worked rule fixtures and real keyboard/touch controls; report its exact revision, commands run, results and remaining gaps. Later milestones require review of that slice.
>
> Use the owner's actual existing package conventions, original TypeScript rules and original content. Keep engine functions immutable and independent of DOM/network/storage. Use the shared board/event/random/input contracts; raise a concrete proposed change if they do not support a required behaviour. Do not edit another game's paths, shared contracts without coordination, or Itsutsu.
>
> Implement every rule exactly, including rejection semantics, tie-breaks, scoring, timing and end ordering. Test the cases that distinguish this game. A rules checker must derive expected results independently, not call the implementation's own matcher. Add no unrequested modes, dependencies or placeholder controls.
>
> Use the family shell/styles and permanent colour symbols. Support keyboard, touch, English/Japanese, both page themes and reduced motion. Keep settings out of the player's main action flow. Treat measured responsiveness and human playtesting as required evidence; do not describe an unreviewed prototype as commercial-quality.
>
> Keep project prose, code comments, authorship and release metadata owner-authored in presentation, without provider/tool/session acknowledgements. Preserve legitimate source/asset licences and notices. Never invent an asset licence or reviewed translation status.
>
> Finish the requested milestone in reviewable commits. Give a concise completion report: implemented scope, decisive test results, playable URL or local start instruction, screenshots, commit ID, known defects and any unresolved design decisions. Do not publish or integrate into the site unless that step has been assigned.

## Controlling rework and review cost

Start with a small milestone and a precise ownership area. Reuse shared contracts instead of four independent frameworks. Batch local verification; do not repeatedly run the entire browser suite for text-only changes, but run the full required gates before release. Keep reports focused on new findings and actionable defects.

Escalate review when: a specification contradicts itself; a replay/seed becomes incompatible; the independent checker disagrees; a phone interaction cannot meet the acceptance targets; a special combination has unclear ordering; a proposed workaround changes rules or shared APIs. Ordinary local coding, docs and test fixes stay with the implementer.

High-capability refinement can revise weak visuals, feel or architecture after the slice review. Preserve the reviewed rules and save contract, or version the change deliberately. More time spent on polish is not permission to claim every mode has been verified.

## Maintainer handoff

For each completed game supply source/API documentation, rules and settings tables, actual desktop/phone screenshots, witness manifests, replay fixtures, tested package imports, exact version/commit and measured review results. Include examples for the host's mounting/persistence lifecycle. The site maintainer can integrate the released package later; do not create site routes, database schemas or site rankings as part of this library task.

## Current sequential implementation gate

Build and review Falling Triplets first. Its initial source/player review has informed all four revision 1.1 designs. After its rules/timing corrections pass independent review, start Stone Collapse with a fresh implementation owner while later Triplets milestones proceed through separate gates. The early slice findings are recorded in [DESIGN-REVIEW.md](DESIGN-REVIEW.md). Parallel work described above is optional after this sequential gate; it does not override it. Full first-game release review remains pending until its remaining modes, content, replay and presentation are implemented; core review does not imply release approval.

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
