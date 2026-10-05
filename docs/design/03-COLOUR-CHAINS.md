# Colour Chains

Revision 1.3 · Game ID `colour-chains` · Rules ID `chains-1`.

## Design intent

Move and rotate two connected coloured stones; join groups of four and arrange the next group to form after the first falls away. This is the most deliberate chain-building game of the four. The screen should make the relationship between placement, gravity and chain order unmistakable.

Genre reference: [Puyo Puyo group and chain rules](https://games.sega.com/3dclassics/puyo2.html). Use original stones, interface, levels, terminology and implementation. This is a solo original group-matching game, not a claim to reproduce a competitive ruleset.

## Board, pieces and setup

Standard **6×12 visible well**, three hidden rows, four colours. Presets: narrow 5×12, standard 6×12, wide 8×12 and tall 6×16. Optional five/six colours are separate categories. No masked wells, obstacles or garbage in v1.

A piece has a pivot and satellite, each with its own stable ID and colour. Spawn pivot at `(floor((width-1)/2),-2)`, satellite above it at y=-3. Orientation sequence is Up `(0,-1)`, Right `(1,0)`, Down `(0,1)`, Left `(-1,0)`. Bag/three-piece preview use the shared architecture. Both stones move rigidly until lock; after lock they fall independently and can separate into different column heights.

## Movement and rotation

Left/right/down translate both stones one cell if both destinations are legal. Clockwise advances orientation in the listed sequence; anticlockwise reverses it. Pivot colour/ID never swaps with satellite colour/ID when rotating.

For a requested rotation, evaluate translated pivot candidates in this exact order: `(0,0)`, `(-1,0)`, `(1,0)`, `(0,-1)` relative to the current pivot. Accept the first candidate whose pivot and satellite are in bounds and empty. These are the only wall/floor kicks. Cells from the old active pair do not count as settled obstacles. Reject if all candidates collide; no random kick, no two-cell translation and no special flip through a sealed cavity. A 180° change requires two rotation actions.

Hard drop moves the rigid pair the greatest legal downward distance, inserts both into the settled board, and locks immediately. A horizontal pair resting over uneven columns may leave one gem unsupported; subsequent stable column gravity drops that gem before matching. The ghost shows both **final independently settled landing positions**, not just the rigid pair's lowest position. To calculate it, simulate hard drop and column compaction without running match removal or consuming random values.

## Matching, gravity and end ordering

After lock and initial gravity, find maximal orthogonally connected same-colour components. A component of four or more is a match. Lines are not required; L, T, square and irregular connected groups qualify. Diagonal-only contact does not.

Mark/remove every qualifying component simultaneously, union without duplication, score one wave, compact every column and search again. First wave from this lock is chain 1; subsequent waves increment it. Two separate four-stone groups removed together are one wave, not a two-chain. Disconnected stones of one colour are not added together to meet four.

After no matches remain, check challenge success, then hidden-row top-out, then challenge queue exhaustion, then spawn. Arcade/Daily have no clear-board win; an all-clear is a scoring event and play continues. A spawn collision loses immediately. Hidden-row stones may be rescued by the current cascade before the terminal check.

## Timing, score and progression

Arcade starts at level 1; a new pair uses `level=1+floor(completedPairs/30)` and gravity interval `max(6, round(60 * 0.85^(level-1)))` ticks. This curve is a tuneable starting target, not a claim of tournament equivalence. Grounded lock delay is 24 ticks, maximum eight resets, with the same airborne/recontact semantics as Falling Triplets. Successful rotation or lateral movement may reset grounded delay; failed rotation cannot.

Soft drop earns 1 point per successful pair downward step; hard drop earns 2; gravity earns zero. Wave score is `10 × uniqueClearedStones × pieceLevel × chainIndex`. A fully empty settled board after the complete resolution adds `500 × pieceLevel`, once per locking pair, only if that pair cleared at least one group. No escalating competitive garbage/attack table is hidden in this score formula.

Relaxed has no automatic gravity, grounded timer or drop bonus. Place explicitly locks; rotation and ghost work identically. Challenge goals: minimum chain length, clear marked starting stones, or empty the board. Challenges use a finite supplied queue, and hints follow only a proved witness. A chain goal is evaluated after the current complete resolution; its witness records the exact qualifying waves.

Daily: standard four-colour arcade seed, maximum 60 resolved pairs, finishes at the cap or loses earlier. Report score, largest chain and all-clear count. A paused timed run becomes practice. Relaxed/Arcade and differing settings never share score categories.

## Controls and feedback

Use Left, Right, Rotate clockwise, Rotate anticlockwise, Drop and Place controls. Mobile buttons must show distinguishable rotation arrows plus accessible text, with no ambiguous single “Turn” button. Rotation is one action per press. Keyboard Up/X clockwise, Z anticlockwise, Down soft drop and Space Place follow shared focus rules.

Ghost stones show their colours and independent landing cells. Display the next three pairs with orientation/colour labels. On a clear, outline the actual connected group and announce its size before gravity. After the next match forms, show `Chain 2` in a fixed status location. Do not announce “Combo 2” for two simultaneous components. No flashing full-screen effects in standard or reduced-motion mode.

Three-second Continue countdown allows the player to see the restored pair and preview before ticking resumes. Cycling colours is not an action in this game. New game is explicit after mode/board/colour changes.

## Worked examples and rule fixtures

**Component:** `(0,11),(1,11),(1,10),(2,10)` of one colour are a connected four and clear. Two isolated pairs of that colour do not. A same-colour diagonal of four does not clear.

**Split landing:** settled column 2 has its top at y=8; column 3 has its top at y=11. A horizontal active pair spanning these columns rigidly lands at y=7. After lock, its left gem stays y=7 and its right falls to y=10. The ghost shows y=7 and y=10 before placement.

**Wall kick:** width 6, pivot `(0,5)`, satellite above. Anticlockwise requests Left; `(0,0)` translation would put the satellite at x=-1, and `(-1,0)` is also illegal. `(1,0)` succeeds if `(1,5)` and `(0,5)` are free. Result pivot `(1,5)`, satellite `(0,5)`. If all four candidates fail, orientation and timer remain unchanged.

**Two-wave fixture**, all other cells empty on a 6×12 board:

```text
y=7   . . R . . .
y=8   . . B . . .
y=9   . . B . . .
y=10  . R B . . .
y=11  R R B . . .
```

The four B clear for 40 at chain 1. R at `(2,7)` falls to `(2,11)`, connecting with the three R at `(0,11),(1,11),(1,10)`. Four R clear for 80 at chain 2. The board empties: add 500, total 620 at level 1, excluding drop bonuses. See `chains-cascade` in [the fixtures](reference/rules-fixtures.json).

## Modes, content and balancing

Ship Relaxed, Arcade, Daily and Challenges. Tutorials: rotate and land; connected four versus diagonal contact; build the two-wave chain. The curated campaign targets 100 original witnessed challenges covering teaching, two/three-wave plans, longer chains and space management, graded before numbering under [the generation policy](LEVEL-GENERATION.md). Target the technique, not merely a higher starting pile. Include at least one split landing and one useful wall kick in the teaching set.

Playtests must show that new users understand four-connected matching and independent falling, and that experienced players can deliberately build a three-chain. Compare ghost accuracy and rotation predictability with a established falling-pair game. This design does not claim its score curve or timing matches that game.

## Validation and performance

Tests cover every orientation at both walls/floor/hidden rows; ordered kick attempts; failed kick and no timer reset; pair-ID preservation; uneven-column split; all qualifying shapes; simultaneous groups; chain versus simultaneous matches; exact all-clear bonus; hidden rescue; bag/preview; grounded resets; replay at several render rates and resume during a cascade.

Independent checker derives components, falling positions and score without calling the engine's matcher. Browser tests perform both rotation directions, a split placement, a two-chain, save/resume and tutorial completion. Real-phone review includes rapid rotate/place alternation and thumb reach. Apply [shared acceptance](ACCEPTANCE-AND-RELEASE.md).

## Implementation slice and deferred work

First slice: relaxed standard board, one fixed queue, both rotations, ordered kicks, split ghost, Place, matching/gravity and two-chain feedback. Timing, content and skins follow review. Versus garbage, cancellation, competitive balance, hold-piece, larger piece shapes and online play are deferred.

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
