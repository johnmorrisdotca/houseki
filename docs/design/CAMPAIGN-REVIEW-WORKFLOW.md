# Campaign construction and review workflow

Revision 1 · 2026-10-06. A reusable process for puzzle packages in this family.

Read this with [LEVEL-GENERATION.md](LEVEL-GENERATION.md), [the family precedents](LEVEL-GRADING-REFERENCES.md) and the game's rule specification. Keep the workflow reusable; put engine-specific construction and scoring details in the corresponding campaign-method document.

## Start from evidence

1. Read the current generation script, content types, shipped manifest, difficulty tests and save-recovery code. Record the published count and grading revision. Inspect another family project with a similar decision structure.
2. Describe an obvious opening, a medium planning puzzle and a genuinely demanding closing puzzle. Build these three prototypes before filling the campaign. Replay their solutions through accepted actions in the shipped engine.
3. Probe plausible mistakes. Explain why the easy puzzle is forgiving and why the expert puzzle needs planning. Record actual measurements and complete versus incomplete search. Review contradictory scores before generating more content.
4. Specify the weighted formula, feature scales, sample budgets, comparison categories and band acceptance gates. Grades cannot be assigned from display index. A board's size and a long witness alone are insufficient.

## Produce and measure

Construct original, solvable candidates with complete witnesses. Use deterministic independent random streams for construction, weather/refills and measurement. Measure complete legal plans, necessary decisions and interacting objectives. Keep local single-step probes clearly separate from full-plan samples. Record success counts as well as rates; zero successes in a bounded sample does not prove impossibility.

Canonical identity describes the puzzle, not its proof: remove seed-only, colour-label, mirror and witness-only differences where rules preserve equivalence. Preserve queue, targets, modifiers, geometry and special-piece flags. Store a persistent ID and canonical hash. Curate surplus candidates for the exact approved count and technique coverage, then sort and number.

A winning witness establishes solvability. Only completed exhaustive search establishes shortest solutions, uniqueness or impossibility. Report bounds and unknown results when budgets expire. Never silently label a timed-out candidate hard or impossible.

## Review worksheet

For each representative fixture record:

| Field | Required evidence |
| --- | --- |
| Identity | Stable ID, rules revision, canonical hash, declared board and queue |
| Intended lesson | The actual consequential player decision |
| Winning proof | Accepted actions, first terminal victory and independent goal check |
| Difficulty | Raw measurements, score formula, comparison category, displayed 1–100 score |
| Sampling | Seed, number of full plans, wins, failures, truncations and horizon |
| Search | Budget, explored states/branches, completed status, shortest-plan bounds |
| Space | Occupied and usable cells; relevance to the objective |
| Mechanics | Recorded interaction events and mechanic-disabled replay outcome |
| Mistakes | Plausible wrong decisions, observed result and recovery/slack |
| Review limits | Human calibration, translation and physical-device reviews still pending |

Preserve fixtures for deceptively easy large boards, long forced sequences, repeated independent one-step tasks, visually simple traps, tied metrics and incomplete searches. Random full-plan success drops when several easy choices are multiplied together; this does not by itself establish expert planning. Require evidence that earlier decisions affect later access, support, timing or targets, rather than merely repeating the same obvious removal. When a score disagrees with visible decisions, fix the grader or construction and record the reason. Do not simply relabel the example.

## Release gate

Verify every witness, exact count and bands, canonical uniqueness, regeneration checksum, stable recovery of published IDs, ordering, metadata and grade calculations. Play first, middle and final fixtures through the real phone and desktop controls. Check goal progress, fixed rules, win/loss controls, replay, next level, language geometry and optional appearance.

Document actual counts and test results. Package and demo must agree. Verify the installed tarball and deployed path. Keep published results separate from future targets; a planning document must never be used as evidence of shipped content.

## Improve this process

After each review, append a short finding to the game's method document: the observed weakness, a concrete example, the corrected rule or measurement, and the regression that prevents recurrence. Update reusable guidance when the finding applies across games. Preserve measured evidence and historical grading revisions so later maintainers can understand why a rule changed.

Changes to one game's content do not authorize changing every project or integrating its package into the host site. Reuse the process and relevant tests first; apply other repository changes under their own scope.
