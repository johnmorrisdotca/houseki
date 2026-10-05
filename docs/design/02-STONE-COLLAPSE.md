# Stone Collapse

Revision 1.3 · Game ID `stone-collapse` · Rules ID `collapse-1`.

## Design intent

A quiet, strategic group-removal game. Preview a connected group, choose to remove it, and understand how the remaining stones move. It should be enjoyable with one hand and no timer. Larger groups give better scores, but clearing the whole board gives the strongest finish.

Genre reference: [Same Game rules](https://www.chiark.greenend.org.uk/~sgtatham/puzzles/doc/samegame.html). The implementation, score system, levels and presentation are original to this package.

## Board, pieces and setup

Default **8×10 rectangle**, four colours. Presets: compact 6×8, standard 8×10, wide 10×8, tall 6×12; custom bounds follow the architecture. Five/six-colour settings are separate categories. Each active cell starts occupied by one coloured stone; no new stones enter during play. No power-ups in v1.

Generate casual random boards with the seeded uniform colour source. If the full board has no removable group, retry up to 128 complete boards; then use a deterministic fallback with at least one adjacent pair, checked before returning. Store whether the fallback was used. Random boards are score games: they are not claimed all-clearable. Challenges have independently replayed all-clear/target witnesses.

Launch shaped presets: **heart**, **star**, **hexagon**, using original masks with at least 16 active cells and practical square-cell geometry. These are silhouettes on a square lattice, not a hex-neighbour game. Masks are orthogonally connected, contain no isolated cell and fit the readable touch size. Each shipped shape has an all-clear demonstration board. Optional arbitrary masks use shared validation.

## Exact rules and resolution

Select a stone; find the maximal orthogonally connected component of its colour. Diagonal contact never joins a group. Groups of two or more are legal; a singleton is not removable. Selecting a legal group outlines the entire group and previews its score. Selecting a different group changes the preview, not the board. Tap the selected group again, or press the Clear group button, to commit. Tapping empty space/Escape cancels selection.

On a committed move:

1. Record the component's original unique cell IDs, calculate its points and remove all its stones together.
2. Apply stable downward gravity independently within each contiguous active vertical segment.
3. On a full rectangular board only, remove empty columns and translate remaining columns left while preserving their order. This is a change to stone coordinates, not board dimensions; rightmost columns become empty.
4. On a shaped/masked board, keep columns fixed. Never slide a column into a different silhouette or move a stone through a mask gap. Display “Fixed columns” in the mode's rules summary.
5. Check the goal and whether a legal group remains, then return to `ready` or end the run. Falling adjacent colours do not clear automatically: another confirmed selection is required.

A move consumes exactly one turn, even when the group spans several rows. An invalid singleton/empty selection consumes no move and shows “Choose two or more connected stones.” Selection is UI state, not a replay action; committed removal records a representative stone ID and expected move number. The engine finds its group again and rejects stale requests.

## Scoring and victory

Group points: `5 × n × (n-1)`, where n is the number of removed stones. A pair scores 10; three score 30; five score 100. There is no cascade multiplier because no automatic cascade occurs.

Casual/Arcade score play ends when the board is empty or no legal group remains. Empty board is `won` and adds 1000 once. A board with only singletons is `finished`; subtract `10 × remainingStones`, with final score clamped at zero. Show removed count, remaining count, group score, bonus/penalty and final score. Apply the finish adjustment only once, never on repeated status queries or decode.

Challenges: clear all, clear marked initial stones, or achieve a minimum score within an explicit move limit. A marked goal ends after resolution when all target IDs have been removed, even if other stones remain; its success bonus is zero unless the whole board is also empty. The score target uses group points before the terminal remainder penalty. Completed goal wins before checking the move limit. Otherwise zero legal groups or exhausted moves loses. Challenge score is secondary to the stated goal, not a promise of optimality.

Undo restores the complete pre-move board, score, move count and terminal adjustment, but marks the run assisted permanently. Redo is not required in v1. Restart restores the exact original board with assistance cleared; it is a new attempt. A hint highlights the next still-valid witness group only; when the run leaves that witness path, say “No proved hint for this position” rather than suggesting an unproved group.

## Modes

- **Relaxed:** no clock; undo, preview and optional proved hints. Random score boards or selected shape.
- **Arcade:** same rules, no undo/hints; no timer. The page explicitly calls it a score run. Avoid promising falling arcade behaviour here.
- **Daily:** fixed standard rectangular board and seed; no undo/hints for an unassisted result. Board need not be all-clearable; label it a score challenge.
- **Challenges:** fixed witnessed board, goal and optional move budget. Practice undo is allowed and visibly marked assisted.

Language, cosmetics and pause do not change score category because the game is untimed. A saved daily retains its UTC date and rules identity; tomorrow does not silently replace an unfinished board.

## Controls and feedback

Tap-select/tap-confirm is default on mouse and touch. A clearly labelled **Clear group (+100)** button offers an accessible equivalent. Keyboard arrows focus occupied cells in row/column order; Enter selects, Enter again commits that selected group. Skip masked-out cells; empty active cells may be focusable for inspection but never selected. Focus returns to the nearest occupied position after resolution, or the result heading when terminal.

Use a high-contrast group outline, colour-independent permanent symbols and a preview label such as “5 stones · +100”. Selection updates within one frame. After confirmation animate removal, then gravity, then horizontal column motion as distinct readable phases. Do not animate every stone along a diagonal shortcut across other stones. With reduced motion show the three states without spatial movement.

No auto-confirm on the first tap, no drag requirement, and no destructive New game on a settings change. Material changes preserve selection. Changing mask, seed, colour count or compression rules requires a new run.

## Worked examples and rule fixtures

**Compression fixture** on a 4×4 test board (top row first):

```text
before        after selecting B at (1,2)
. . . .       . . . .
. . . .       . . . .
R B . G       R . G .
R B G G       R G G .
```

The B group contains `(1,2),(1,3)`. Removing it scores 10. Old column 1 becomes empty; old column 2 shifts to 1 and old column 3 to 2. Three colours now form R group 2 and G group 3; there is no automatic clear. See `collapse-compression` in [the fixture file](reference/rules-fixtures.json).

**Singleton finish:** `[R,B,G,R]` in one occupied row has no adjacent equal colours; it ends with four remaining stones and a 40-point remainder penalty. **Diagonal:** R at `(0,0)` and `(1,1)` are separate singletons. **Mask gap:** if `(2,2)` is inactive, a stone at `(2,1)` cannot fall into the active segment below `(2,2)`. **All-clear:** removing the last legal pair earns its 10 group points plus 1000; decoding the won state earns nothing again.

## Content and balancing

Tutorials: identify a legal group; see rectangle gravity/column compression; choose removal order to avoid isolated stones. Include a short shaped-board explanation when selecting a silhouette for the first time. The curated campaign targets 100 original challenges covering teaching, rectangular removal-order planning and shaped/fixed-column play, graded before numbering under [the generation policy](LEVEL-GENERATION.md). Every stated clear-all challenge has a legal witness. Do not fill the campaign with colour permutations of the same layout.

Score preview must encourage large groups without hiding the value of a full clear. Playtests should include a first-time user and someone who already knows SameGame. Assess accidental confirmations, whether shaped gravity is understood, and whether the last five stones remain interesting. Change scoring only before freezing `collapse-1` or introduce a new rules version.

## Validation and performance

Independent checker verifies component size, orthogonal adjacency, no automatic clear, stable gravity, leftward compression, fixed masked columns, exact score and one-time finish adjustment. Cover representative IDs after falling, stale action rejection, undo from won/finished, assistance persistence and a daily saved across midnight.

Browser flows select/cancel/confirm, choose a different group, use keyboard confirmation, preview score, undo, save/resume and finish a full board. Test all masks in both themes and on a phone; every board must fit or offer the explicit supported viewport. Apply [shared acceptance](ACCEPTANCE-AND-RELEASE.md).

## Implementation slice and deferred work

First slice: seeded 6×8 rectangle, select/confirm, score preview, removal, gravity, compression, restart and a correct ending. Review the feel before adding shapes, undo/save, tutorials and content. Rising rows, bombs, timed collapse and hex-neighbour groups are deferred; those would need separately specified rules and categories.

## Revision 1.3 — Implementation evidence and explicit completion contract

Apply the shared [review findings](DESIGN-REVIEW.md) and the following requirements before declaring this game complete. A supported option must work through the public API and the actual player; a menu item or type union alone is not implementation. Every stated mode, lesson, challenge, material, language and persistence control has a traceable test or an explicitly pending human review.

- Test the geometry of the board, preview and controls at 320, 390, 768 and 1280 pixels for **every preset**, largest supported custom dimensions, both themes and both languages. Assert each essential element is inside its intended viewport or an explicitly labelled scroll region. `overflow-x: hidden` cannot establish a pass. Size cells using the actual column count; relocate the preview when necessary. Keep the main action controls reachable without repeatedly scrolling between board and controls; provide a compact layout for tall wells.
- Capture and test each observable resolution phase, its intermediate board and accepted/rejected inputs. Showing a final board with a batch of historical events does not meet cascade playback requirements. At the first wave, assert the marked board still contains the gems; after removal assert the holes; after gravity assert the settled board; then assert the next wave. Reduced motion changes presentation while preserving accepted action ordering.
- `legalActions` lists actions that would actually be accepted in the current state. State-dependent blocked moves are omitted. Rejected actions preserve state identity, score, random stream, timer and replay log. Validate all public settings against the documented bounds before drawing random values.
- Keyboard shortcuts run only in the focused game control surface. Text inputs, selects, sliders and unrelated buttons retain native behaviour. Check every documented key and pointer equivalent, focus loss, held-key release and action rejection during resolution.
- Restore a bounded, validated canonical recording and reconstruct the checkpoint through replay. Reject malformed settings, IDs, cells, phases, queues, scores and impossible checkpoint combinations. A shallow JSON tag check is insufficient. Bound replay work as well as payload size; yield or use a worker for long browser replays.
- A meaningful end-to-end test starts through the real player, makes a distinctive move, observes its score and ending, saves, reloads, resumes and reproduces the run. A build plus a few pure-function examples is only an early slice check. Report exact executed tests and pending physical-device/human checks separately.

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
