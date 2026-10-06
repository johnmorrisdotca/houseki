# Magnetic Blocks: experimental 2×2 variant

Implementation status: an experimental public engine implements bonded blocks, floor schedules, Floor Switch, magnetic impact, Relaxed/Arcade timing and canonical replay. A standalone experimental demo is published. It has no authored campaign or completed human feel review. The four primary games retain their rules and authored witnesses.

## Core idea

A four-gem 2×2 block falls as one unit and rotates clockwise or anticlockwise around its square centre. Its gem positions cycle through the four corners without changing identity. The floor state determines whether the landed block retains its bonds or separates.

- Calm: the rigid block lands when any member contacts support. Its connected remainder can bridge gaps. Bonded pieces settle as a rigid component if all occupied cells below it permit one downward step.
- Magnetic: every landed gem loses its bonds, and each column settles independently. The current falling block remains controllable as a unit until landing. The magnetic pulse also breaks existing resting bonds; previously bridged stones can drop and create new matches.

The board floor shows a distinct magnetic colour plus a magnet glyph and the words Calm / Pull. Never communicate the rule by colour alone. Show the upcoming state beside the next-block preview, and label it in English/Japanese.

## Timing and decisions

An initial deterministic proposal is three Calm placements followed by one Magnetic placement, repeating. The next placement's floor state is known before input begins. A pulse occurs at the placement boundary, not unexpectedly during a falling animation. Relaxed permits untimed planning; Arcade can add the falling clock after the mechanic is reviewed. Authored puzzles explicitly declare the starting phase and pulse schedule.

The rigid component graph must be engine data, with stable gem IDs and explicit bond edges. Removing a gem removes its incident bonds; surviving disconnected components are separate rigid groups during Calm. Treating the whole original bounding square as solid after removals is invalid. Settling is deterministic: process one-cell downward steps until no component can move, using bottommost cell then stable ID to resolve order; components cannot overlap or pass through one another.

For the first rules prototype, clear orthogonally connected colour groups of at least four after settling. Do not mix this with a second square-only match rule in the same ruleset; square-only matching is a separately measurable future option. Continue clear/settle waves using the floor state of the committed placement. Preview ghosts must simulate the actual selected floor state, component breakage, support and resulting gem positions.

## Separate bounded implementation

First prototype and verify 2×2 piece rotation and rigid component gravity alone. Then implement floor states/pulses and independent column gravity; prove calm bridging, magnetic splitting, surviving bonds after removal, hidden-row rescue and finite cascade termination. Next add matching and scoring, then exact deterministic replay and authored goal/witness support. Grade and sort original puzzles under these rules rather than reusing existing pair/triplet grades.

Use existing palette, glyphs, one-hand arrow/keypad controls, non-selectable pieces, accessible previews and reduced-motion policy. Phone and desktop checks must show the floor and upcoming pulse without scrolling away from the current board. No claim of playable or released support before the implementation and review gates pass.

## Configurable floor schedules

The host/level explicitly chooses one schedule: frequent pulses (alternating Calm/Pull placements), occasional pulses (three Calm then one Pull), infrequent pulses (seven Calm then one Pull), one mid-level pulse at a declared placement number, a fixed floor for selected levels, or an authored sorted list of magnetic placement numbers. These are starting design presets, not approved difficulty constants. No random or hidden switches and no sudden elapsed-time change during input. The next floor state and countdown are visible. Level grading includes the exact declared schedule. Introduction progresses from Calm support, to a demonstrated predictable pulse, to planning mixed schedules; it does not silently change the rules of an already authored level.

## Floor Switch gadget

An optional earned prize or explicitly supplied level tool lets the player override the floor for the next committed placement, choosing Calm or Pull. Capacity is one use per level; no purchases and no unlimited switching. The engine holds a pending override, exposes its exact ghost/settling preview, and permits changing or cancelling it without spending. It is consumed only when a legal piece placement commits. Rejected input, cancellation, pause, and animation ticks do not spend it.

The override affects only that placement and its complete clear/settle cascade. The underlying automatic schedule still advances one placement and resumes afterward. Pull breaks resting bonds permanently; a later Calm phase never re-bonds previously separated stones. Calm preserves bonds on newly landed blocks and any surviving old components. Display the selected floor, remaining gadget count and subsequent scheduled floor together.

Prize eligibility must be deterministic and explicit: an authored intermediate objective can award the gadget once, or a level can begin with one supplied charge. A prior-level prize cannot be an undeclared prerequisite for solving a later authored level. Tool-triggered effects do not repeatedly re-award the gadget. Saves/undo restore the charge and pending choice with assisted status sticky; Daily has no extra gadget unless its canonical rules explicitly include it.

Every gadget-enabled level declares initial inventory, one-time award condition, pulse schedule and a complete solving witness including the override decision. Independent verification and difficulty probes use exactly that availability. Check each Calm/Pull choice, cancel/no-cost, single-use, underlying-schedule advancement, full-cascade duration, stable ghost and canonical replay before calling it playable.

## Optional Magnetic Impact mode

A separate explicitly enabled mode makes a hard/power drop destructive only for a Magnetic placement. A Calm hard drop remains ordinary rigid placement; a Magnetic soft/natural landing remains ordinary magnetic splitting. Do not silently add destructive impact to existing falling games.

First simulate the rigid block's landing at first contact. At that exact position, collect occupied support cells directly below the bottommost gem in each of the block's two columns, skipping off-board cells and mask gaps. Remove each actual contacted stone once, for at most one layer of impact damage (one or two contacted supports). Do not blast an entire row, hit distant lower stacks in a non-contact column, or recursively smash successive layers. Then break the incoming block's bonds and settle all individual stones under Magnetic rules; resolve normal matches/cascades afterward. Impact removes the contacted stones while preserving incoming gem identities. Off-board floor contact causes no damage.

The effect preview must show actual support hits and the resulting settled destination under the selected floor. A Floor Switch set to Pull can enable the impact for its next placement; setting Calm prevents it. State/replay records the enabled ruleset, pending override, hard-drop decision and uniquely removed IDs. Use separate impact score events, cap damage independently of cascade score, and never let impact awards create an infinite power reward. Authored levels include the mode and any gadget charge in their witness and grading.

Before approval, verify high/low uneven columns (only touching supports break), empty floor, masks, one-layer limit, stable incoming IDs, no effect on soft drops or Calm, override consumption, resulting chains, hidden-row outcomes, preview agreement and canonical batched replay. Keep the mode visibly named so the player can distinguish placement from destructive impact.
