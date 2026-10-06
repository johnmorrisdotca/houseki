# Level generation, grading and progression

Revision 1.4 · Applies to every game's curated campaign and every future design using this template.

## Count and ordering policy

Choose an intentional complete count before shipping. Round counts such as 50, 100 or 200 and structured counts such as 128 or 256 are appropriate. A count of 256 supports sixteen blocks of sixteen. Neither 100 nor any other single count is mandatory. Unplanned totals such as 97 or 113 are not a finished campaign. Generate surplus candidates and curate the selected count; never pad it with renamed seeds or colour permutations.

The approved next campaign revision for Magnetic Blocks, Shizen and Arashi has **128 independently witnessed challenges per campaign**, with separate tutorials. Its bands contain 32 entry-level, 32 easy, 32 intermediate, 24 hard and 8 expert challenges. The currently published fifty-level sets are the baseline, not evidence that this expanded progression is delivered. The four original campaigns retain their existing counts until separately revised. Expand to 256 only when distinct, verified content supports it. Record the chosen count and band boundaries in the manifest and require them in tests.

Generate, prove, measure, deduplicate, curate, sort, then number. Level 1 must be among the simplest genuine boards, not merely the first generated seed. The final levels must have the strongest measured planning demands. Fix the order before release and keep persistent content IDs separate from display numbers, so later reordering does not reinterpret saved progress.

## Existing family patterns consulted

Itsutsu's Tsunagi measures turns, branching, the share of forced moves and the longest route, blends within-size percentiles, and uses stable tie-breaking. Its tests check symmetry duplicates, measured marks and rising block difficulty. Its 256-level structure groups boards in blocks of sixteen and reserves late block positions for introducing and testing twists. Mahjong constructs solvable deals first and grades how forgiving they are by seeded legal random playouts, rather than assuming that a larger board is harder.

Reuse these principles, not Tsunagi's exact weights for unrelated mechanics. Solver CPU work alone is not player difficulty; raw move count and seed number are insufficient too. Grade each game's actual decisions. No changes to Itsutsu are part of this task.

## Reproducible generation pipeline

1. Generate original boards through reverse construction or forward legal play with a retained complete witness. Supply explicit rules version, seed, board settings, queue/refill identity and objective.
2. Independently replay every candidate to its goal. Verify stable IDs, legal actions, exact budget and ending. A supplied witness proves solvability; it does not prove uniqueness, minimum moves or optimum score.
3. Deduplicate using gameplay-preserving symmetries and canonical colour relabelling. Gravity games do not permit vertical reflection or arbitrary rotation as equivalences. Preserve masks, target locations, special kinds and finite queues in the key. Repeated boards under new names or colours are excluded.
4. Measure strategic demand with deterministic versioned grading. Store raw measures and sampling/search budgets. Exhausted bounded search is `unknown`, not `unsolvable`, `unique` or `optimal`.
5. Curate coverage: line/diagonal/chain construction for Triplets, removal-order traps and masked gravity for Collapse, split landings/kicks/long chains for Chains, special creation/combinations and layered objectives for Swap. Do not inflate difficulty solely through board occupancy or time pressure.
6. Sort by measured difficulty with a stable content-ID tie-break. For lesson blocks, introduce a mechanic before testing it and require nondecreasing block means and a clear increasing envelope. For a simple linear campaign, require nondecreasing numeric scores. Never silently claim strict individual sorting when only block means are tested.
7. Independently validate the selected count, all witnesses, unique keys, coverage, grade reproducibility, ordering and first/last examples. Commit the resulting data, grading version and generation script; generation/measurement is offline, not an expensive page-load operation.

## Game-specific grading plans

| Game | Player-facing measures to compute | Checks against misleading difficulty |
| --- | --- | --- |
| Falling Triplets | Consequential placement/cycle choices, forced placement share, required setup pieces before payoff, simultaneous direction/target coordination, required chain depth, seeded legal-play goal success rate | A tall stack or long witness alone does not establish hard planning; easy visible triples belong early |
| Stone Collapse | Number of consequential removable groups, order-sensitive failures, forced safe group share, budget/score slack, endgame isolation risks, seeded legal-play clear/goal success rate | Large one-colour groups are easy despite size; all-clear solvability must be witnessed |
| Colour Chains | Setup choices, forced placements, split-landing dependencies, necessary rotations/kicks, required chain depth, seeded legal-play success rate | A four-chain is not automatically harder if its trigger is obvious; tests distinguish setup from payoff |
| Gem Swap | Viable progressing swaps, objective coordination, necessary special combinations, seal depth, budget slack, seeded legal-play goal success rate | Lots of specials can make a board easier; no arbitrary tight budget without a witness |

For each game document a concrete weighted score before generation, including normalization across board sizes or separate declared size categories. At least one metric must assess choices/forgiveness, rather than only board size, colours or witness length. A valid starting option is a blended percentile score combining low sampled success rate, low forced share, objective dependencies and measured consequential choices; final weights are reviewed against representative boards. Use separate deterministic streams for grading samples so grading never changes game randomness.

For the three expanded campaigns display an integer **1–100** difficulty score, preserving a separately recorded raw measurement score and normalization category. If a normalized value is in 0–1, use `1 + round(99 * normalized)`; ties retain the same score. Display five difficulty marks from the displayed score: `min(5, 1 + floor((score - 1)/20))`. Existing campaign grades remain versioned and must not be silently reinterpreted. A measured score is a reproducible heuristic, with human calibration pending until reviewed. Check simple first examples and complex last examples manually and adjust the grader when the scores contradict those visible differences.

## Content manifest and release gate

Each level records persistent ID, display number, title in both languages, settings, goal, seed/queue, witness, canonical duplicate key, technique tags, raw grade measures, grade score/marks, grading version, proof status and review status. A campaign records count, linear/block ordering policy, generation revision and checksum. Witnesses and hints are separate from authoritative player saves.

Tests must regenerate scores and order, replay every selected witness, check all display numbers 1..N and no gaps, verify opening and closing difficulty bands, and pin representative easy/medium/hard fixtures. Also verify that solved progress uses stable IDs rather than mutable level numbers. Difficulty labels must not be assigned from the index after sorting; they derive from actual measures. Human feel and translation reviews remain separately pending where not performed.

### Stored tools

Gem Swap and Stone Collapse optionally support the separately specified [stored-tool tray](STORED-TOOLS.md). Initial counts, deterministic earning, confirmation previews, assisted scoring, save/undo behavior and level proof requirements follow that contract. Ordinary tool-free play remains available; existing Daily and authored campaign levels retain their declared rules. Review the bounded engine gate before adding the player controls.

## Expanded campaign grading gate

Use [the reviewed family precedents](LEVEL-GRADING-REFERENCES.md). A winning witness is not a shortest-solution proof. Record verified minimum placements only when search completes; otherwise report the known bounds and `unknown`. Distinguish a long finite queue from consequential setup decisions. Sample complete legal plans with a separate deterministic stream; a first-placement probe followed by a fixed winning suffix must be described as such and cannot stand in for full-plan success rate.

Measure planning, alternative branches and dead ends, forced-safe decisions, chain/target dependencies, budget slack, and occupied versus usable board cells. Occupancy or board area alone has no difficulty weight. For nature campaigns measure whether attraction, rebound or weather changes the outcome, and distinguish necessary timing from an event that happens automatically. For Blocks measure consequential floor choices, bonded/split dependencies and impact timing. Publish budgets, sample counts, bounds and the exact weighted formula before numbering.

Scores are not assigned from level number or the requested band quota. Generate surplus candidates, prove and measure them, then select the band counts. Introduce mechanics before combining them. Eight hardest-in-pool boards do not automatically qualify as extremely hard: closing fixtures must show deeper consequential planning and lower forgiveness than introductory fixtures. If a band lacks evidence, improve the construction rather than stretching scores, adding filler or changing the band label.

Regression fixtures must cover obvious one-move openings, deceptive larger-but-easier boards, longer-but-forced solutions, genuinely branching plans, mechanic-dependent outcomes, equal-metric ties, exhausted search and expert candidates. Check stable IDs and saved progress across regeneration; existing published IDs must remain available or have an explicit versioned recovery policy. Generation and grading run offline and are committed as reproducible data.
