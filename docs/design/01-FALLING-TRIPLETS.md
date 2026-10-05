# Falling Triplets

Revision 1.3 · Game ID `falling-triplets` · Rules ID `triplets-1`.

## Design intent

A compact falling-gem game: slide a vertical triplet, cycle the order of its colours, and place it to make straight or diagonal matches. The defining skill is seeing what will line up after the first clear. It must feel immediate enough for arcade play and clear enough for relaxed planning.

Genre reference: [SEGA's Columns family](https://segaages.sega.com/project/columns-ii/index.htm). Build original rules implementation, art, sounds and challenges. This game uses cycling, not a geometric rotation of the column.

## Board, pieces and setup

Standard well: **6 columns × 13 visible rows**, plus three hidden rows. Presets: narrow 5×13, standard 6×13, wide 8×13 and tall 6×17. Custom dimensions follow the shared validation. Default five colours; optional four or six colours are separate score categories. No masks, obstacles or decorative well shapes in v1.

Empty start. A piece is three separately identified coloured gems ordered top/middle/bottom, initially occupying `(spawnX,-3)`, `(spawnX,-2)`, `(spawnX,-1)`, where `spawnX=floor((width-1)/2)`. The active piece is not part of the settled board. The shuffled bag and three-piece preview follow the shared architecture; preview consumption is deterministic. No hold-piece mechanic or wildcard in v1.

The active triplet stays vertical and rigid until it locks. After locking its individual gems participate in ordinary gravity and matching. Gems never pass through existing pieces or the floor.

## Exact rules and resolution

1. A valid left/right action translates all three active gems one cell; collision rejects it without changing state.
2. Cycle forward transforms `[A,B,C]` into `[C,A,B]`. Cycle backward transforms it into `[B,C,A]`. Cycling always succeeds while falling, including when grounded, because geometry does not change.
3. Down translates all three one cell if the destination is free. Hard drop translates by the largest legal downward distance, then locks immediately, even if that distance is zero.
4. On lock, insert the three gems into the settled board. Compact every column downward, preserving gem order. This matters when separate gems eventually lose their support.
5. Detect every maximal same-colour run of length at least three in directions `(1,0)`, `(0,1)`, `(1,1)` and `(1,-1)`. Runs include settled hidden-row cells. The matched set is the union of these runs. Crossing runs count their shared cell once.
6. If the matched set is nonempty, mark all its cells, remove them simultaneously, score the wave, compact columns and search again. First wave is chain 1; the next wave from this lock is chain 2. Separate matches in the same wave do not increment the chain separately.
7. When no match remains, check objectives, then top-out, then a challenge's exhausted piece limit, then spawn the next piece. Never spawn during a cascade. A new lock begins a new chain at 1.

Terminal priority after a lock: completed challenge goal wins even if a hidden row remains occupied; otherwise hidden-row occupancy loses; otherwise exhausted challenge queue loses. Arcade has no win goal and loses if settled hidden rows remain occupied after resolution or a new spawn collides. The render shows a loss line at the visible top; do not end merely because an active piece is temporarily in hidden rows.

## Grounding, timing and progression

Arcade starts at level 1. Let `completedPieces` be the number of already resolved locks. A new active piece uses `level = 1 + floor(completedPieces/30)` and gravity interval `max(6, round(60 * 0.85^(level-1)))` logical ticks. This interval is fixed for that piece. Successful gravity/soft descent resets its descent timer to zero; movement/cycling does not. Freeze the interval when pausing.

Grounded means a one-cell down translation is illegal. The first grounded tick starts a 24-tick lock timer. A successful lateral move or cycle while grounded resets it, at most eight times per piece. Failed movement never resets it. A successful move that becomes airborne cancels the timer but consumes a reset if it began grounded; after the reset allowance is exhausted, the grounded timer pauses while airborne and resumes on recontact. The first downward move that makes a piece grounded starts the timer at zero; it does not also count as one elapsed grounded tick. This prevents inconsistent off-by-one locking.

Use the shared hold-repeat scheduler. Soft descent earns 1 point per actual active-piece cell-step; hard drop earns 2 per actual cell-step. Gravity earns none. These bonuses are not multiplied. Cycling has no movement score. Relaxed placement has no drop bonuses. Score categories separate relaxed and arcade.

## Scoring and goals

Wave points: `10 × uniqueClearedCells × pieceLevel × chainIndex`. `pieceLevel` is captured when this piece spawned, not after a threshold is crossed. No extra all-clear bonus in v1. Display a score breakdown after a run so a player can understand its score.

Arcade goals: survive, improve score, reach higher speed. Relaxed goals: same placement rules with no automatic gravity or forced lock; press Place to commit. It is still a finite-capacity well, and top-out still ends the run.

Challenges specify a stable starting board, a finite piece queue and one of: clear marked starting gems, achieve a minimum chain, or empty the board. Marked targets keep their unique IDs through falling. Clearing all targets completes that goal after the current wave fully resolves. A target may not be a colour label that moves to replacement pieces. Hints suggest a next placement from a supplied witness, not an unproved optimum.

Daily is a fixed standard arcade seed with a limit of 60 resolved pieces; it ends `finished` at that limit or `lost` earlier. Score and maximum chain are shown. A Daily relaxed practice view is explicitly a different category. The standard daily uses five colours and no undo/hints; pausing marks it practice.

## Controls and feedback

Desktop keyboard and mobile controls follow the shared design. Buttons say **Left**, **Right**, **Cycle**, **Reverse cycle**, **Drop**, **Place**. In relaxed mode hide Drop, keep movement/cycling and Place. A live ghost displays the exact landing triplet with permanent colour symbols. Cycling updates the ghost immediately; the ghost cannot predict a cascade or imply the move is optimal.

At spawn show the next three pieces top-to-bottom with accessible names such as “Next: red, blue, green”. The active piece has an outline distinct from the ghost. A 500ms chain label announces the wave number without covering the well. Status distinguishes “Place the triplet”, “Chain 2”, “Paused”, and the precise end reason.

Changing dimensions, colour count, seed or mode requires New game; show the pending settings without silently erasing the run. Cosmetic settings apply live. A held button does not move the next spawned triplet after resolution.

## Worked examples and rule fixtures

`R/B/G` mean red/blue/green; `.` is empty. All coordinates are zero based.

**Cycle:** `[R,B,G]` → forward → `[G,R,B]` → backward → `[R,B,G]`. Three forward cycles restore the original; piece IDs rotate with their colours.

**Two-wave cascade:** on a 6×12 fixture board, only these cells are occupied:

```text
y=8   . . R . . .
y=9   . . B . . .
y=10  . . B . . .
y=11  R R B . . .
```

The vertical three B clear together: 30 points at level 1, chain 1. The R at `(2,8)` falls to `(2,11)`, creating the bottom R R R: 60 points at chain 2. The final board is empty and the wave score is 90. This is the `triplets-cascade` fixture in [the fixture file](reference/rules-fixtures.json).

**Crossing:** red cells `(0,10),(1,10),(2,10),(1,9),(1,11)` form two three-cell lines sharing `(1,10)`. Clear five cells, not six; wave score 50 at level/chain 1. **Diagonal:** `(0,11),(1,10),(2,9)` clear; `(0,11),(1,10),(3,8)` do not.

**Blocked cycle:** cycling a grounded triplet is legal because its cells do not move. **Hidden rescue:** a locked hidden-row gem does not cause loss if that same resolution clears/settles every hidden gem into visible rows. **Spawn collision:** a new active piece colliding with settled cells loses immediately, without deleting those cells.

## Modes, content and balancing

Ship Relaxed, Arcade, Daily and Challenges. Three tutorials: cycle and land; diagonal clear; construct the two-wave cascade. The curated campaign targets 100 original challenges with teaching, placement planning and longer cascade boards; measured strategic demand determines the order, not stack height. Follow [the generation policy](LEVEL-GENERATION.md). Limit teaching queues to 2–6 pieces; advanced queues may use up to 12. Every challenge has a complete legal placement witness and independent goal check.

Tune the gravity curve only through recorded playtests. Beginners should complete the first tutorial without losing; experienced players should still find decisions interesting at speed. Do not call level numbers human difficulty ratings. Compare controls and cascade readability against a genre reference, not its artwork.

## Validation and performance

Test all match directions and crossing unions; stable gravity; identity preservation; preview/bag boundary; blocked lateral actions; zero-distance hard drop; all eight lock resets and airborne recontact; level threshold; saved active/resolving pieces; pause/resume and identical replay at varying frame rates. Independent simulation checks each wave, score and final board without calling the engine's matcher.

Desktop and phone tests complete the tutorials, cycle both ways, hard drop, make a two-chain, pause/resume and recover a saved run. Real-device testing includes rapid repeated cycling, left/right hold transitions and accidental page-scroll prevention. Apply [the shared acceptance gates](ACCEPTANCE-AND-RELEASE.md).

## Implementation slice and deferred work

First slice: standard well, five colours, one seed, left/right/cycle/Place, ghost, one clear/cascade, restart and score. Implement it in relaxed mode before adding the timing scheduler. Review the actual feel, then add Arcade, saving, content, skins and release presentation. Hold-piece, wildcards, obstructed wells, competitive garbage and online play are deferred.

## Revision 1.3 — Implementation evidence and explicit completion contract

Apply the shared [review findings](DESIGN-REVIEW.md) and the following requirements before declaring this game complete. A supported option must work through the public API and the actual player; a menu item or type union alone is not implementation. Every stated mode, lesson, challenge, material, language and persistence control has a traceable test or an explicitly pending human review.

- Test the geometry of the board, preview and controls at 320, 390, 768 and 1280 pixels for **every preset**, largest supported custom dimensions, both themes and both languages. Assert each essential element is inside its intended viewport or an explicitly labelled scroll region. `overflow-x: hidden` cannot establish a pass. Size cells using the actual column count; relocate the preview when necessary. Keep the main action controls reachable without repeatedly scrolling between board and controls; provide a compact layout for tall wells.
- Capture and test each observable resolution phase, its intermediate board and accepted/rejected inputs. Showing a final board with a batch of historical events does not meet cascade playback requirements. At the first wave, assert the marked board still contains the gems; after removal assert the holes; after gravity assert the settled board; then assert the next wave. Reduced motion changes presentation while preserving accepted action ordering.
- `legalActions` lists actions that would actually be accepted in the current state. State-dependent blocked moves are omitted. Rejected actions preserve state identity, score, random stream, timer and replay log. Validate all public settings against the documented bounds before drawing random values.
- Keyboard shortcuts run only in the focused game control surface. Text inputs, selects, sliders and unrelated buttons retain native behaviour. Check every documented key and pointer equivalent, focus loss, held-key release and action rejection during resolution.
- Restore a bounded, validated canonical recording and reconstruct the checkpoint through replay. Reject malformed settings, IDs, cells, phases, queues, scores and impossible checkpoint combinations. A shallow JSON tag check is insufficient. Bound replay work as well as payload size; yield or use a worker for long browser replays.
- A meaningful end-to-end test starts through the real player, makes a distinctive move, observes its score and ending, saves, reloads, resumes and reproduces the run. A build plus a few pure-function examples is only an early slice check. Report exact executed tests and pending physical-device/human checks separately.

### Ground contact reference cases

Use a direct `isGrounded` predicate before the accepted action, not `lockTicks > 0`, to decide whether movement/cycling consumes a reset. Grounded time can be zero on initial contact. A successful grounded action uses one of the eight resets; an illegal lateral attempt uses none. At allowance exhaustion, cycling must preserve the timer. After an exhausted piece moves off support, airborne ticks pause accumulated grounded time and recontact resumes it. Preserve this accumulated time separately from gravity descent counters.

Pin fixtures for: initial contact at zero ticks; eight permitted resets; ninth cycle at 23 grounded ticks followed by one tick locking; successful sideways departure consuming the final reset; later departure with no allowance, ten airborne ticks, recontact with the old timer; blocked lateral movement at 23 ticks; pause with 23 ticks. Timing actions do not silently erase this history.

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

### Portable verification gate

Keep every required test fixture inside the repository. Verify an archive of the committed revision, not only the development workspace: tests, type checking and site generation must succeed without sibling projects, personal paths or uncommitted files. The installed tarball check separately verifies all declared entry points. A local pass that depends on external fixture files is incomplete.

### Reviewed preset widths

Compact is 5×13; Narrow is 6×13; Standard and the casual default are 8×13; Wide is 10×13; Extra wide is 12×13; Tall is 8×17. The Daily challenge retains its fixed 6×13 well for reproducibility and is independent of the casual default. Authored campaign levels retain their own declared dimensions.
