# Family level-generation and grading review

Reviewed 2026-10-06 for the approved Magnetic Blocks, Shizen and Arashi expansion.

## Precedents checked

| Project and source | Existing rule | Application to Houseki |
| --- | --- | --- |
| Itsutsu, `src/lib/puzzles/tsunagi/difficulty.ts` and `difficulty.test.ts` | Turns 35%, branching 30%, non-forced cells 25%, longest route 10%; blended percentiles within a size. Tests reject solver-node inflation on forced boards and preserve equal-score ties. | Measure actual player choices. Use game-specific weights and declared comparison categories. Do not reuse route-turn weights for falling pieces. |
| Itsutsu, `src/lib/puzzles/tsunagi/levels.ts` and `levelBlocks.ts` | Fixed authored data, explicit counts by size, sixteen-level teaching blocks, harder endings, separate size modules. Counts include 64, 128, 192 and 256. | Explicit complete counts and teaching progression; 128 is intentional. Preserve stable identities and avoid loading unrelated content unnecessarily. |
| Itsutsu, `src/lib/puzzles/mahjong/generate.ts` | Reverse-constructed solvable deals; five candidates; sixteen complete seeded random legal playouts per candidate; difficulty ranks completion forgiveness. | A complete random plan measures error tolerance. A winning witness alone or a first-move sample with a fixed suffix does not. Increase and document sample budgets for campaign grading. |
| Itsutsu, `src/lib/puzzles/numberPlace/generate.ts`; `docs/plans/numbers/NUM-02-numbers-and-number-place.md` | Seeded full solution, clue removal preserving uniqueness and solving-depth limits; easy uses singles, medium permits one guess, hard permits deeper search. | Construct solvable originals, independently validate, and reject misleading difficulty labels. Do not require unique answers in action puzzles unless their rules require them. |
| Kazu, `README.md`, Shikaku generation and bounded solver contract | Reject ambiguous generated boards; only a completed one-answer search proves uniqueness. Generation profiles are explicitly not calibrated human grades. | Record proof scope. A search limit means unknown, not impossible, unique or optimal. Keep measured grades distinct from human calibration. |
| Houseki, `docs/design/LEVEL-GENERATION.md` | Generate, prove, measure, deduplicate, curate, sort, then number; separate grading randomness; stable IDs and independent witnesses. | Retain this pipeline and strengthen complete-plan measurement and closing-band evidence. |

## Approved expansion

Each of the three campaigns targets 128 challenges, with tutorials outside the count:

| Band | Count | Display positions |
| --- | ---: | --- |
| Entry level | 32 | 1–32 |
| Easy | 32 | 33–64 |
| Intermediate | 32 | 65–96 |
| Hard | 24 | 97–120 |
| Expert | 8 | 121–128 |

A band is a content requirement, not permission to assign difficulty from its index. Scores must be measured first. Publish an integer 1–100 score, raw metrics, normalization category, grading revision and sampling/search budgets. Relative rank alone cannot establish extreme difficulty.

## Measurement requirements

- **Planning:** consequential committed placements, dependent setup decisions, verified shortest-plan bounds where available, and budget slack. Count rotations when they change a necessary placement; never count left/right keypress distance as reasoning.
- **Choices:** full-plan success rate, meaningful alternative branches, dead ends and forced-safe decisions. Keep single-step deviation probes distinct from full-plan search.
- **Interactions:** chain dependencies, competing targets, bonded versus split settling, magnetic attraction, rebound, floor choice and weather timing. Record event evidence and mechanic-disabled counterfactuals.
- **Space:** occupied and usable cells, obstacles and coverage relevant to the goal. Area and occupancy are context, not independent proof of difficulty.
- **Reproducibility:** independent proof replay, canonical duplicate rejection, exact deterministic regeneration, stable ID recovery and explicit incomplete-search outcomes.

Prototype and review representative entry, intermediate and expert constructions before generating a whole band. Expert examples need demonstrated consequential choices and substantially less forgiveness than the openings. Generate surplus original candidates; do not pad quotas with seeds, recolours, mirrors or longer queues that leave the same decision unchanged.

The published fifty-level campaigns remain the baseline. This document does not assert that the 128-level expansion, expert calibration or human review is complete. Site integration remains outside this package work.
