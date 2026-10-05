# Package architecture

Revision 1.3 · Provisional package `@johnmorrisdotca/houseki`.

## Boundaries and ownership

One package, four independently importable engines. Share board validation, stable gravity, random sequence, event shapes, input scheduling and presentation helpers. Matching and scoring rules stay in the individual engines. Avoid a universal matcher full of switches. Do not import one game's match rules into another.

| Path | Responsibility |
| --- | --- |
| `src/core/*.ts` | Validated cells/masks, stable compaction, random source, clock/input contracts, encoding helpers |
| `src/falling-triplets/` | Triplet state, actions, line matching, scoring and progression |
| `src/stone-collapse/` | Connected groups, gravity/column compaction, terminal states |
| `src/colour-chains/` | Pair rotation, group matching, chains and progression |
| `src/gem-swap/` | Swap validation, run detection, special planning/activation and refill |
| `src/view/` | SVG geometry, skins, event animation, touch and keyboard wiring |
| `src/*.types.ts`, `src/*.constants.ts` | Adjacent shared types and named constants |
| `src/strings.ts` | Complete English/Japanese interface strings |
| `src/challenges/` | Original manifests, witnesses and independent checks |
| `demo/`, `scripts/`, `e2e/` | Family demo, source-derived API, release checks and browser flows |

Tests live beside the source. Keep source code files under 500 lines; split responsibilities before reaching the limit. Use each reference package's formatter, declaration conventions and named domain constants. Option values are kebab case. No runtime dependencies. Node 22+ for development/consumption; modern browsers for the optional player. React is an optional peer only if a tested wrapper is actually shipped.

## Public API contract

Engine-only root exports common types, `VERSION`, rule-version metadata and pure helpers; no renderer side effects. Each game entry exports `createGame`, `applyAction`, `advanceTicks`, `legalActions`, `statusOf`, `encodeGame`, `decodeGame` and its types. Turn-based `advanceTicks` only advances resolution phases; it never consumes a move.

```ts
import { createGame, applyAction, advanceTicks } from '@johnmorrisdotca/houseki/falling-triplets';

let game = createGame({ mode: 'arcade', seed: 'sample', preset: 'standard' });
game = applyAction(game, { kind: 'cycle-forward' }).state;
game = applyAction(game, { kind: 'hard-drop' }).state;
game = advanceTicks(game, 1).state;
```

These are proposed signatures to implement, not examples of a currently published package. Pin them in a compile-and-run example test. `Transition<S>` is `{ state: S; events: readonly GameEvent[]; accepted: boolean; reason?: ActionRejection }`. Invalid actions leave `state` reference-identical and return a typed rejection. Events are not stored indefinitely in state.

Planned entries: `/falling-triplets`, `/stone-collapse`, `/colour-chains`, `/gem-swap`, `/draw`, `/play`, `/element`, `/element/define`. Root and all normal entries import without a DOM; `/element/define` is explicitly browser-only and marked side-effectful. Do not publish an unfinished game entry. `/draw` returns escaped SVG markup from a read-only view model; `/play` mounts a DOM player and returns `getGame`, `setGame`, `pause`, `resume`, `destroy`. `setGame` validates game/rules identity. Host callbacks receive immutable state and safe events.

Game settings, UI preferences and host options are separate objects. UI preferences never appear in a puzzle seed or score identity. A host supplies persistence callbacks; the engine makes no network/storage calls. The demo uses local storage and handles unavailable/quota-full storage without preventing play.

## State and invariants

Use row-major addresses and zero-based `(x,y)`, with y increasing downward. Visible cells have `0 <= y < height`; falling games additionally store three hidden rows `-3 <= y < 0`. Serialization indexes these as `index = (y + 3) * width + x` for falling games; turn-based boards use `y * width + x`. Document this distinction, never infer it from array length.

State includes game ID, rules version, immutable settings, seed identity, PRNG state, board, phase, score, moves/locked-piece count, elapsed ticks, assisted flag, active/next pieces where relevant, resolution work and terminal reason. Phase is one of `ready`, `falling`, `clear-mark`, `clear-remove`, `gravity`, `refill`, `paused`, `won`, `lost`, `finished`. Each game's legal subset is explicit. Preserve the pre-pause phase. Pausing does not resolve or roll back a move.

Every function is pure and deterministic. Copy modified arrays; never mutate input boards, settings, events or seeds. Domain constants replace scattered string literals. One stone per cell, IDs unique within a run, masked-out cells empty, colours within the configured set. Gravity preserves the order of surviving pieces within a gravity segment. Matching never crosses a masked-out cell. A stable terminal state accepts no play action.

## Randomness

Reference random source: 32-bit xorshift with operations `x ^= x << 13`, `x ^= x >>> 17`, `x ^= x << 5`, normalized with `>>> 0`. Zero seed maps to `0x6d2b79f5`. String seeds hash UTF-8 bytes using FNV-1a, offset `0x811c9dc5`, multiply by `0x01000193` using `Math.imul`, then normalize. Hash zero uses the same nonzero replacement. Numeric seeds are integer uint32 only; no silent truncation of arbitrary numbers.

For uniform `nextInt(n)`, reject uint32 values at or above `floor(2^32/n)*n`, then take `% n`. Seed input is hashed with game ID and rules version; store the resulting numeric initial state too. Never use `Math.random` in an engine or generator.

Falling games use a bag containing three of each configured colour; Fisher–Yates shuffle with this source. Draw colours in piece order; refill a depleted bag before the next draw, even mid-piece. Preview shows the next three pieces but does not draw more values on each render. Gem Swap refills use independent uniform colours, not this bag. Stone Collapse random boards use uniform colours. Generator retries consume the documented PRNG stream; a format/rules bump is required if a released stream changes.

## Clock and input record

Fixed 60Hz logical simulation. `advanceTicks(state,n)` for integer `0..3600` must equal n sequential single-tick advances in state and event order. Larger elapsed intervals are processed in bounded chunks. The DOM scheduler accumulates monotonic elapsed time and never turns a long frame into one giant gravity movement. On background visibility or focus loss, pause immediately and release held controls; require Continue on return. Do not fast-forward a tab that was hidden.

The scheduler translates key/pointer edges into canonical per-tick actions, ordered as the shared design specifies. Lateral hold: move immediately, initial repeat delay 10 ticks, subsequent repeat every 3 ticks. Soft-drop hold: attempt one downward cell every 2 ticks. No duplicate gravity move on a tick with a successful soft drop. Cycle/rotation and hard drop are one-shot. An action cannot run again merely because an animation callback fires.

Record canonical discrete actions with monotonic tick number and ordinal within the tick. UI pointer positions and raw browser key-repeat events are not part of the rules record. A replay carries initial settings, initial random identity, rules version and these actions; the verifier derives the terminal board and score. Do not trust score, assistance or outcome fields supplied by a client. Invalid action streams fail with a location and reason.

## Resolution and events

One source of truth: engine phases. Clear candidates are discovered together, marked together and removed together. Stable gravity follows; a new match search starts only when gravity is complete. Gem Swap additionally refills before its next match search. Input does not select a disappearing cell or move an active piece during resolution. Cancel selection on accepted actions.

Events have deterministic sequence numbers scoped to a transition: `piece-spawned`, `piece-moved`, `piece-rotated`, `colours-cycled`, `piece-locked`, `match-marked`, `special-created`, `special-activated`, `cells-cleared`, `cells-fell`, `columns-shifted`, `cells-refilled`, `score-changed`, `level-changed`, `selection-cleared`, `paused`, `resumed`, `run-ended`. Each includes relevant cell IDs/coordinates; animation never guesses paths from only a final board. Do not emit sound-specific events from the rules engine.

Resolution windows are fixed logical ticks from the shared design. Turns become ready after the final gravity/refill phase and terminal check. Old positions are available through events for interpolation; old DOM elements do not remain actionable.

## Saves and replay safety

Format 1 uses JSON with `format`, `game`, `rules`, initial settings/seed, action record and a compact checkpoint. Maximum board: 240 visible cells plus falling hidden rows. Maximum decoded text: 2 MiB; maximum input record: 100,000 actions, maximum tick: 10,000,000. Validate integers, enum values, array lengths, unique IDs, hidden cells, mask, progression bounds and phase work. Reject unsupported versions with an explicit error.

The action record is authoritative. Decode replays it and compares the checkpoint; an arbitrary checkpoint is not accepted as a valid game. A developer-authored challenge supplies a separately validated initial board and sequence. Budget replay in a worker in the browser; yield progress and permit cancel. Synchronous engine verification is for bounded examples/testing. Long sessions reaching save limits show an explicit export/start-new-run choice, never silently truncate a replay.

Format 1 readers remain supported. Any migration uses frozen fixture saves and their old rule evaluator. A changed score formula, input cadence, random draw order or resolution duration needs a new rules ID, not just the same format with a different result. Material/locale preferences are a separate versioned UI record.

## Settings and masks

Validate settings before creating state. Falling widths 5–10, visible heights 12–20, colour count 4–6 (Pairs standard 4); test kernel fixtures may use smaller boards but the public game rejects them. Turn-based widths/heights 4–12, active count 16–144, direct-play UI offers presets within its readable cell limits.

Masks are orthogonally connected, no isolated active cell and no unreachable objective. Gravity acts independently in each contiguous active vertical segment. A hole never teleports a piece across a gap. Stone Collapse's rectangular column compression is forbidden for masks; its masked variant keeps fixed columns. Gem Swap never compresses columns. Masked Gem Swap must have a valid three-in-line opportunity and a legal swap at creation. Arbitrary masks may be rejected with a typed reason; the demo offers only witnessed, tested presets.

## Build and release surface

Build declarations and ES modules with the same compiler/style as the references. Verify both ESM and Node 22+ `require` for every DOM-safe entry from an installed tarball. Browser registration gets a real browser test. Every public export has a useful doc comment and appears in the source-derived API page. README snippets compile/run. No untested framework support claims.

Canonical CI commands: `pnpm check` (format/lint/types/unit/build/presentation), `pnpm test:demo` (real browser flows), `pnpm test:package` (pack/install/consume), `pnpm test:content` (witnesses), `pnpm site`. Command names may wrap established family scripts, but their contract must be genuine. Publishing is a separate maintainer step after the complete release checklist.

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

### Replay and daily mode review cases

The rules engine must not read the wall clock. The host supplies the UTC Daily date; a fixed explicit date reproduces exactly the same configuration and seed. Daily ranked-category dimensions and colour counts are canonical and cannot silently accept custom settings.

Every option that changes logical tick processing must be derived from recorded input or present in the versioned canonical recording. For each public timing option, make a state through the public API, encode it, decode it and compare the entire derived checkpoint. Test soft-drop/ordinary gravity on the same tick, paused resolution, a held key released during a cascade and arbitrary clock batching. Do not add an undocumented timing escape hatch that can produce unreplayable saves.

Removal snapshots contain holes. Compaction happens at the gravity boundary and has an explicit event containing before/after positions; matching the next wave cannot observe the compacted board early. A test that checks only the phase name does not prove the phase's board is correct.

## Campaign generation and ordering policy

Follow [LEVEL-GENERATION.md](LEVEL-GENERATION.md): deliberate complete counts such as 100/200 or structured 128/256, not arbitrary unfinished totals; independently witnessed original boards; deterministic player-facing grading before numbering; simple openings and hardest endings; stable content IDs; deduplication and reproducible progression tests. Houseki targets 100 per game, with a reviewed smaller or larger complete count allowed when justified. Three separate tutorials do not pad the campaign count.
