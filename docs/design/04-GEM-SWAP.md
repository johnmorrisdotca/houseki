# Gem Swap

Revision 1.3 · Game ID `gem-swap` · Rules ID `swap-1`.

## Design intent

Swap two neighbours to make a match; larger formations create useful special gems. This is the approachable objective game of the collection. Its depth comes from choosing a useful match, predicting refill cascades and combining earned powers.

Genre references: [Bejeweled](https://www.ea.com/games/bejeweled) and [special-piece matching examples](https://candycrush.zendesk.com/hc/en-us/articles/211939685-Creating-and-combining-Special-Candies). Use original implementation, assets, levels and terminology. The complete rules below govern this game, including places where its combinations differ from a reference.

## Board, pieces and setup

Default **8×8 rectangle**, five colours; compact 6×6, wide 10×6 and tall 6×10. Optional four/six colours are separate settings/categories. Original heart, star and hexagon silhouettes are supported as square-cell masks once each passes generation, witness and mobile-size tests. Mask gaps are impassable; gravity cannot cross them. Holes are visually distinct from empty active cells.

Every active cell contains a normal or special gem. A normal/special retains a unique ID until cleared. Every special also retains an underlying colour, including a colour burst. Optional challenge seal layers sit beneath gems at fixed cell coordinates and never fall or travel with a swap. Seals are objectives, not obstacles preventing movement.

Initial board must be stable, full, contain no existing run of three and have at least one legal swap. Casual generation: fill active cells in row-major order, choose uniformly among colours that avoid a completed horizontal/vertical three; retry the full board if a cell has no candidate or the completed board has no legal action. Cap at 128 attempts. For standard rectangles with five colours, a tested stable fallback containing a witnessed swap is permitted and flagged. Arbitrary masks/settings without a validated fallback return a typed generation error; never serve an unplayable board. The demo offers only proven presets and handles errors with a new-seed/recovery action.

## Swapping and ordinary matching

Only orthogonally adjacent active cells can swap. Ordinary gem + ordinary gem is valid only if the swap produces at least one horizontal or vertical run of length three or more. Swapping equal-colour normals is invalid. Diagonal groups and 2×2 squares alone do not match.

Normal + line/bomb special needs an ordinary match after swapping; a special is not activated merely by tapping it. Colour burst + any other gem, and any two special gems, are valid independently of a run. A burst counts as a special and its underlying colour can participate in an ordinary run.

Validation performs a pure trial before accepting. Invalid swap returns the original state, consumes no move/random value, and the player animates a short return. Valid swap consumes one move, clears selection and starts resolution. Gem IDs travel with the swap; seals stay put. Define p as the selected source and q as the chosen destination; combo centre is q.

## Special creation

Find all maximal horizontal/vertical colour runs, union intersecting runs into match components, and plan at most one new special per component. Disjoint components can each create a special. Priority:

1. A run of at least five → **colour burst**.
2. Intersecting horizontal/vertical runs with a shared cell (T/L/cross) → **burst stone**, a 3×3 bomb.
3. A run of exactly four → **row beam** for a horizontal run or **column beam** for a vertical run.
4. Otherwise no new special.

Eligible anchors: cells of the selected longest qualifying run for a colour burst; intersection cells for a bomb; cells of the selected four-run for a beam. When tied, select the run containing q, then p, then one with greatest maximum y, then smallest minimum x, then horizontal before vertical. Within the eligible anchor cells choose q, then p, then greatest y and smallest x. On cascades there are no p/q preferences. These tie-breaks are stable and tested.

An existing special is ineligible as a new-special anchor; choose a normal eligible gem instead. If none exists, no new special is created for that component. The anchor's ID/colour survives, its kind changes, and it is protected from all clear effects during this wave. It cannot activate until a later wave or move. Creation comes from ordinary runs, never from explosion-only cleared formations.

## Special activation and combinations

An existing special in the natural matched set or hit by another clear activates once per wave. Row beam clears all active cells in its row; column beam clears its column; bomb clears the active cells within Chebyshev distance 1 (3×3 clipped to the board). A matched/hit colour burst clears all gems of its stored colour. Effects do not travel through a mask gap as gravity, but row/column beams hit all active cells anywhere in that row/column. Blast geometry ignores gaps; absent cells are simply skipped.

For an explicit special swap, use this table instead of separately applying the two basic powers:

| Swapped pair | Effect centred at destination q |
| --- | --- |
| Beam + beam, either orientation | Entire row and column through q |
| Beam + bomb | Three rows and three columns through/adjacent to q |
| Bomb + bomb | 5×5 square centred at q |
| Colour burst + normal | Every gem of the normal's colour |
| Colour burst + beam | Clear both swapped gems; turn every other gem of the beam's colour into a beam of the same orientation and activate it this wave |
| Colour burst + bomb | Clear both swapped gems; turn every other gem of the bomb's colour into a bomb and activate it this wave |
| Colour burst + colour burst | Every active gem |

Both swapped specials are consumed and counted once. Conversion retains other gems' IDs; converted powers are temporary activations and all converted gems are cleared. Existing specials of that selected colour use the converted power instead of their original power. Specials of other colours reached by effects use their original power. Explicit swapped-source specials are already handled by the combo and do not activate a second time. Newly created protected anchors are excluded from conversions/effects. No conversion creates persistent extra specials after this wave.

Process activation requests in ascending cell address with a visited-ID set. Expand to a fixed point; clear the union of reached cells once. A wave can hit each seal once irrespective of how many beams hit it. This prevents recursive loops, double score and double seal damage. Independent testing must cover this expansion, not just individual animations.

## Complete resolution order

1. Commit the legal swap and increment moves.
2. Detect natural runs; plan/protect new-special anchors. Seed effects with matched cells and any explicit swap combo.
3. Expand existing/converted special effects to a fixed point. Exclude protected new anchors. Mark every final cleared cell.
4. Remove those gems together. Reduce seals under removed cells by one layer, counting each affected cell once. Score the unique removed cells. Then materialize the planned specials at their protected anchors.
5. Apply stable downward gravity separately within each contiguous active vertical segment. No column compression.
6. Refill empty cells with uniformly drawn normal colours. Segment order: x ascending, then segment top y ascending; within a segment, place new gems in its empty cells bottom-to-top. Gem IDs are assigned in that exact draw order. Refill can create matches; do not filter these out.
7. Search all natural runs again. If any exist, start the next wave with chain index +1 and no explicit swap combo/p/q. Continue until stable and full.
8. Evaluate completed goals, then exhausted move/time budget, then legal actions. Return ready or end.

No live input while resolving. Animated refill changes neither random order nor matching time. Long cascades advance in bounded engine phases, not a blocking while-loop on the UI thread. Timed modes finish a cascade committed before the deadline; they accept no new swap at/after the deadline.

## Score, objectives and dead boards

Wave score: `10 × uniqueRemovedGems × waveIndex`, starting at 1 for each accepted swap. A protected new special does not score as removed. All effects in one expansion belong to one wave. Creation has no separate points, and seals do not add score in v1.

Challenge goals may combine a score target, collecting specified counts of cleared colours, and clearing all fixed seals. All listed goals must be satisfied. Colour collection counts underlying colours of actually removed gems, including special/converted gems. Simultaneous win and move exhaustion is a win. A move budget counts swaps only, not cascades; invalid swaps do not count.

Stable no-legal-action detection enumerates all adjacent active swaps under the complete special rules. Relaxed score play ends `finished` when none exists; this is an explicit game rule, not a crash. Daily ends similarly or after 30 legal swaps. An unfinished challenge with no legal action loses. Check goal success first. Arcade is a 180-second score run with the same no-move ending. No paid or automatic rescue.

Relaxed practice offers **Reshuffle**, marking the run assisted. Shuffle the existing gem records only, preserving colour counts and special kinds, with Fisher–Yates and the recorded PRNG stream; keep seals fixed. Try at most 128 permutations for a stable board with a legal move. Failed reshuffle restores the old board and original PRNG state and returns an explanation; it does not pretend the player has a move. Successful reshuffle consumes no scoring move and can be recorded/replayed. Do not allow it in unassisted Daily/Arcade or challenges.

Undo in Relaxed/Challenges restores the full pre-swap state including PRNG/refill order and seals, and permanently marks assistance. Hint highlights a witnessed action on a matching challenge path; otherwise it highlights a legal swap and explicitly promises no optimality. Hint use marks assistance. Score comparison separates these runs.

## Controls and feedback

Tap one gem then an adjacent target; tap the selected gem again to deselect. A nonadjacent second gem becomes the new selection. Drag threshold is one-cell intent: commit only to an orthogonal neighbour when movement passes 0.35 cell; reject diagonal/ambiguous movement, pointer cancellation and releases outside the board without a swap. One drag produces one move. Keyboard selection uses the same p/q semantics.

Show move budget/remaining seals/collection goals above the board. Display “4 in a row → row beam” and the special's outline briefly when created. A beam carries an arrow stripe; bomb a ring; colour burst a star rim, all in addition to its permanent colour symbol. Tutorial and accessible labels explain the power; never depend solely on an animation.

For no legal action, show the ending and practice Reshuffle/Restart choices without a silent board replacement. Invalid swap feedback says “That swap makes no match.” Special-swap feedback names the actual combination. Touch controls allow ordinary page scrolling outside the board.

## Worked examples and rule fixtures

**Ordinary swap:** rows `[R,G,R]` above `[B,R,B]`, with other nearby cells not making a run. Swap p=`(1,1)` with q=`(1,0)`; top becomes R R R and clears three. The lower G does not clear. Direct wave points: 30, before any refill cascade. Reversing an invalid swap leaves board, random state and move count unchanged. See `swap-basic` in [the fixtures](reference/rules-fixtures.json).

**Four-run:** swap creates R R R R in row 4 with q on that run. q becomes a row beam; the other three gems clear for 30 at wave 1. The new beam survives this wave even if an old bomb overlaps it. **T:** two three-runs sharing their middle cell yield a bomb at that intersection; union has five gems, so four are removed, score 40. **Five:** a five-run creates a colour burst at an eligible anchor and removes four, score 40.

**Beam+beam:** on a full 8×8 board, centre `(3,3)` clears its 8-cell row and 8-cell column, union 15 (assuming no other activated specials); score 150 at wave 1. **Bomb+bomb:** centre `(3,3)` clears 25 cells; centre `(0,0)` clears 9. **Seal overlap:** three beams hitting a two-layer seal in the same wave remove one layer, not three. **Two separate matches:** two three-runs with no overlap clear six together for 60, not two different chain multipliers.

## Modes, content and balancing

Ship Relaxed, Arcade (180 seconds), Daily (30 accepted moves) and Challenges. Tutorials: valid swap/invalid return; create and use a beam; combine specials and clear a seal. The curated campaign targets 100 original witnessed challenges covering teaching, collection/seal boards and combined objectives, graded before numbering under [the generation policy](LEVEL-GENERATION.md). Every goal has a complete deterministic replay under the fixed refill sequence. No arbitrary move budget chosen without a witness and human review.

Playtests assess special recognizability, whether dead-board endings feel fair, useful move previews, and objective pacing. Check that beginners understand the powers and experienced players can plan combinations. Test both no-timer enjoyment and the three-minute mode. Do not promise a never-ending supply of measured-difficulty levels from a random generator.

## Validation and implementation slice

Independent tests cover all swap pairs, identical normals, invalid RNG preservation, special anchor precedence/ties, protected anchors, every combo-table pair in both source orders, recursive activation visitation, mask clipping, seal damage, uniform refill order, cascade score, goal priority, no-move enumeration, undo RNG restoration and failed reshuffle rollback. Include replayable examples for each special, not only random smoke tests.

First slice: stable standard board, normal-only swaps, invalid return, matching/gravity/refill, score, deterministic restart and a no-move ending. Review responsiveness and readability, then implement beams/bombs/bursts one at a time with the combination fixtures, followed by objectives, modes, saves and content. Competitive attacks, diagonal matches, 2×2 rewards, immovable blockers, portals, conveyors and a map campaign are deferred.

Browser checks play every power/combination, finish a seal level, invalidate a swap, undo, save/resume, and operate all shapes in both themes. Apply [shared acceptance](ACCEPTANCE-AND-RELEASE.md).

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
