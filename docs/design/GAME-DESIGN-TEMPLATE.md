# [Game title]

Design revision: [revision/date] · Owner: [owner] · Game ID: [stable kebab-case ID] · Rules ID: [versioned evaluator ID].

Status: [proposed / reviewed / slice accepted / release accepted]. Link actual review evidence; do not mark accepted before review. This template is for a new design, not a completed game.

## 1. Design intent and audience

- One sentence describing what the player does and why it is enjoyable.
- Distinctive skill/decision that separates this game from existing games.
- Primary audience, typical session length, casual/competitive expectations.
- Genre references with links and exactly which behaviours they illustrate.
- Original implementation/assets/content policy and naming considerations.

## 2. Board, pieces and setup

| Item | Exact specification |
| --- | --- |
| Default board and coordinate origin | [dimensions, cells/crossings, axes] |
| Hidden rows / mask / adjacency | [explicit values, no implied defaults] |
| Pieces and stable identity | [IDs, colours, shapes, properties] |
| Allowed presets/custom settings | [bounds, validation, rejected cases] |
| Starting position and sequence | [empty/fixed/generated, seed and algorithm] |
| Generation guarantees | [legal move / witnessed solution / neither] |
| Recovery | [bounded attempts, fallback, player-visible error] |

State whether shapes are visual silhouettes, different neighbour lattices or different rules. Explain how gravity and objectives behave at holes.

## 3. Exact rules and edge cases

Write a numbered transition from one accepted action through resolution to the next decision. Specify:

- What counts as legal input, and what rejected input changes or consumes.
- Movement, rotation, kicks, collisions, support and lock behaviour.
- Matching adjacency/lines/threshold, simultaneous union and tie-breaks.
- Clear order, gravity/refill order, new matches and chain boundaries.
- Special creation/activation precedence and interaction table, if any.
- End ordering when success, time/move exhaustion and failure coincide.
- At least ten boundary cases, including stale actions, hidden cells, empty/no-move boards and invalid settings.

Every rule has a concrete expected result. If an implementer could reasonably pick two different behaviours, add the missing decision.

## 4. Scoring, goals and ending

Give exact formulae, rounding, multiplier timing and one-time bonuses/penalties. Distinguish score from victory. Define assistance, undo/restart, hints, finite/infinite play, no-move handling and separate comparison categories. Do not advertise measured difficulty or optimality without evidence.

## 5. Modes and original content

| Mode | Setup | Goal/end | Timing | Help/undo | Comparison identity |
| --- | --- | --- | --- | --- | --- |
| [mode] | [exact] | [exact] | [exact] | [exact] | [rules/settings/seed] |

Define UTC/date policy for Daily, the precise seed/sequence identity and whether its goal is witnessed. Specify tutorial actions, minimum distinct challenge count, witness format and human difficulty review. List deferred modes explicitly.

## 6. Controls and accessibility

Map every game action to keyboard, mouse and touch. Define selection/confirmation, drag thresholds, held-input cadence, focus/pointer cancellation and prevention of accidental page movement. State what remains playable without dragging, colour discrimination, sound, animation or speed. Specify practical limitations honestly.

## 7. Visual and sensory design

Link a real proposed/approved visual reference, with approval status. Give palette/material/symbol mapping, board geometry, layout/breakpoints, status/goal placement, next-piece previews, selection/ghost/special distinctions, sound and reduced-motion behaviour. Reuse the family shell; keep game-specific styling separate.

## 8. Timing and state machine

List phases and permitted actions per phase. Separate logical clock/rules timing from presentation interpolation. Define pause/resume/background handling, resolution duration, ordering of simultaneous input and animation cancellation. For real-time play give precise gravity, lock-delay and repeat rules.

## 9. Package/API and persistence

Link shared architecture or define module ownership. Specify pure transitions/events, root/subpath exports, validation, seed stability, save format, replay verification, limits and migration. Mark browser-only entries; do not imply a proposed API is already published. Keep user preferences separate from rules identity.

## 10. Worked examples and test fixtures

Provide at least:

1. One basic legal action and one rejected action.
2. A multi-stage example with before/after coordinates, clear sets and exact score.
3. A boundary/collision example.
4. Every special interaction or exceptional end-ordering example.
5. A deterministic save/replay example.

Supply machine-readable fixtures and an independently derived checker. Record the derivation and expected outcomes, not just a copy of implementation output.

## 11. Implementation milestones and work boundaries

Describe a small playable slice, its review gate, full rules, content/persistence and release polish. Assign editable paths and shared-contract ownership. Define escalation conditions, report evidence and explicit exclusions. Keep the host project untouched until integration is assigned.

## 12. Validation and commercial feel

List decisive tests, browser flows, real-device scenarios and performance targets. Define human reviewer tasks and a scored feel review. Correctness tests, emulated phone tests and human acceptance are different evidence. State what has actually been checked today and what remains.

## 13. Documentation and release

Use the shared [acceptance/release checklist](ACCEPTANCE-AND-RELEASE.md), adapting paths for another project. Include source-derived API, real screenshots, family badges/links, MIT/package metadata, community-file drift checks, original asset ledger, packed imports and public npm-page verification. Record version/rules IDs/commit/tag and reviewed limits.

## 14. Decision log and open questions

| Date | Decision | Reason/evidence | Rules/API impact |
| --- | --- | --- | --- |
| [date] | [decision] | [evidence] | [none/version bump] |

Separate unresolved design choices from tuneable targets. State a concrete proposed default and its acceptance test for each open choice. Naming/visual approval and human feel review must not be claimed complete without the owner's review.

## Completeness check before implementation

- [ ] A reader can set up, play, score and end a complete game using only this design.
- [ ] All input, collision, match, gravity, special and end-ordering choices are explicit.
- [ ] Worked results have been independently checked.
- [ ] First playable milestone and review criteria are bounded and clear.
- [ ] Shared implementation/docs/release standards are linked.
- [ ] Unreviewed assumptions, translation, performance and tuning are identified.

## Evidence-driven revision checklist

Before reusing this template, include concrete intermediate phase snapshots, boundary contact examples, public input bounds, full preset/viewport geometry checks, keyboard focus exclusions, authoritative save validation and a feature-to-test coverage table. After the first playable slice, record defects against the requirement that should have prevented them; improve vague requirements and add regression fixtures. A supported option needs an implementation and test, not just a selector. Preserve a separate list of pending physical-device and human feel reviews.

## Revision 1.3 — Bounded implementation and review gates

The implementation assignment covers exactly one milestone at a time. After completing that milestone, stop and deliver the tested source revision, coverage table, actual player evidence when applicable, and remaining defects. The reviewer independently checks the work, assigns a bounded correction task for failures, updates this design when wording or examples were insufficient, and explicitly assigns the next milestone only after the gate passes. Do not interpret the full design as permission to continue through unreviewed later milestones.

1. **Core:** board/state validation, deterministic randomness, gravity and the game's basic input/preview. Prove identity and immutability.
2. **Rules:** exact matching/groups, resolution phase snapshots, score and ending order. Prove decisive independent fixtures.
3. **Timing and controls:** any falling clock/locking, held controls, focus/pause, keyboard and pointer parity. Prove boundaries and actual viewport element bounds.
4. **Modes and persistence:** all specified modes, objectives, canonical saves/replays, assistance and hostile input validation.
5. **Content and feel:** three interactive lessons, an intentionally sized, graded and ordered original challenge campaign (target 100; see LEVEL-GENERATION.md), both languages, original opt-in audio, materials and reduced motion. Human translation/device/feel approval is tracked separately and cannot be fabricated.
6. **Package and documentation:** source-derived API reference, README real images, MIT/community metadata, checked installed tarball, browser integration and complete coverage report.

A correction assignment contains the concrete defect, expected behaviour and regression check. Keep shared infrastructure under one owner and game modules under separate owners; no concurrent edits of the same files. Each later game begins from the revised requirements and reviewed shared contracts, with its own bounded milestone. All four games are authorized; site integration and npm publishing remain outside this implementation batch.

### Replay and daily mode review cases

The rules engine must not read the wall clock. The host supplies the UTC Daily date; a fixed explicit date reproduces exactly the same configuration and seed. Daily ranked-category dimensions and colour counts are canonical and cannot silently accept custom settings.

Every option that changes logical tick processing must be derived from recorded input or present in the versioned canonical recording. For each public timing option, make a state through the public API, encode it, decode it and compare the entire derived checkpoint. Test soft-drop/ordinary gravity on the same tick, paused resolution, a held key released during a cascade and arbitrary clock batching. Do not add an undocumented timing escape hatch that can produce unreplayable saves.

Removal snapshots contain holes. Compaction happens at the gravity boundary and has an explicit event containing before/after positions; matching the next wave cannot observe the compacted board early. A test that checks only the phase name does not prove the phase's board is correct.

## Campaign generation and ordering policy

Follow [LEVEL-GENERATION.md](LEVEL-GENERATION.md): deliberate complete counts such as 100/200 or structured 128/256, not arbitrary unfinished totals; independently witnessed original boards; deterministic player-facing grading before numbering; simple openings and hardest endings; stable content IDs; deduplication and reproducible progression tests. Houseki targets 100 per game, with a reviewed smaller or larger complete count allowed when justified. Three separate tutorials do not pad the campaign count.
