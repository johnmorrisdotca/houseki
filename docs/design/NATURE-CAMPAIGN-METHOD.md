# Shizen and Arashi campaign construction and grading

Revision 4 · 2026-10-06

This note records the reproducible construction and measurement contract for the expanded Shizen and Arashi Colour Chains campaigns. A witness demonstrates one legal route; it does not establish an optimum or prove that alternatives are impossible.

## Candidate construction and proof

A candidate stores its exact board, stable gem IDs, finite pair queue, seed, objective, nature modifiers, witness and persistent ID. Challenge creation independently checks the complete witness. The verifier then replays every placement and every resolution tick through the shipping engine and records the actual magnetic pulse, rebound, jumble and lightning events. Nature remains untimed in challenge mode, and the queue ends in a loss when the objective remains incomplete.

For a mechanic-dependence claim, replay the same witness under a counterfactual that removes only the claimed mechanic while preserving the rest of the challenge. Shizen attraction tests remove starting magnetic gem flags while retaining nature and the authored pair flags, so rebound remains available. Rebound-only tests remove nature. Arashi tests keep nature enabled and omit the weather schedule. A candidate is rejected as dependent if that counterfactual still wins.

Canonical identity includes dimensions, normalized colours, mirrored board geometry, target locations, queue, magnetic flags and weather policy. It ignores seed, witness and observed weather trace, so a different proof route or schedule outcome cannot make a duplicate board into a second level. The selected schedule seed and trace remain in each level as replay and mechanic evidence; the trace records the selected jumble patch, moved target status and destinations, lightning columns, removed cells and removed target cells.

## Measurement

Grading version 7 uses the following bounded measurements. Its random sample stream is derived from the grading revision and canonical puzzle geometry. Source labels, temporary candidate IDs, generation ordering, schedule seed and observed trace do not change the sample stream. The authored seed still determines the actual weather trace, which is retained as replay and proof evidence.

- 64 deterministic full-plan trials derive their random stream from grading revision and canonical puzzle geometry, independently select from the current complete legal placement set on every pair, and continue through the entire finite queue. Candidates provisionally scoring 81 or higher are remeasured with 256 deterministic full-plan trials before band selection. Each level records the exact budget, wins, placements and queue depth. No sample holds a witnessed suffix fixed.
- Every legal placement deviation at each witness decision is tested, followed by the exact remaining witness. The report separates losing deviations from wins and dead ends. Goal-preserving placements include all winning alternatives plus the witnessed choice at every decision; legal and preserving counts use the same population.
- Setup deviation loss share repeats those probes only before the payoff placement. A setup is called uniquely verified only when every enumerated legal alternative fails. Mixed results remain measured as consequential losses, never as a forced dependency.
- For ordinary Shizen clear goals, goal coordination counts distinct target colours: separated red target fragments still form one ordinary red-match objective. Arashi weather goals use distinct connected target components, because scheduled strikes can expose those spatial groups independently.
- Cascade share uses only a challenge goal that explicitly requires a minimum chain depth; witnessed per-resolution chain depth and random-play potential depth are stored separately. Several ordinary clearing turns do not add together as one longer chain. Weather dependence is one only when the same witness fails with weather removed. Attraction and rebound are recorded as counterfactual evidence and technique tags.

The versioned raw score is:

```text
raw = 0.18 × (1 − fullPlanSuccessRate)
    + 0.28 × consequentialDecisionShare
    + 0.30 × setupDeviationLossShare
    + 0.12 × goalCoordinationShare
    + 0.06 × cascadeShare
    + 0.06 × weatherDependency
score = clamp(1 + round(99 × raw), 1, 100)
```

`consequentialDecisionShare` is losing legal placement deviations divided by all enumerated legal deviations at witness steps. `setupDeviationLossShare` uses the same denominator restricted to steps before payoff. `goalCoordinationShare` uses distinct target colours for ordinary `clear-targets` levels, weather-exposed target components for weather levels, or the required chain length for `minimum-chain`, normalized from zero through two or more independent objectives. `cascadeShare` separately reflects an explicit minimum-chain requirement, normalized from one through three or more waves; random or merely witnessed cascades never fill this field. Scores are a deterministic heuristic, not a calibrated estimate of human performance.

The intended score bands are entry 1–20, easy 21–40, intermediate 41–60, hard 61–80 and expert 81–100. Candidates are measured before band selection; no band is assigned from display position. The 32 entry, 32 easy, 32 intermediate and 24 hard selections take the lowest scores in their measured bands; the 8 expert selections take the highest scores so the campaign ends with its strongest verified challenges. Every selected score remains in ascending order across the complete campaign. If the verified pool does not meet a band count, generation stops with the shortfall rather than relabeling or padding candidates.

## Reviewed prototypes and current limits

The entry rebound constructions vary connected red target shapes, pair targets and raised target rows with real support columns. They retain only layouts where a witnessed rebound clears the marked target and the same route fails without nature. Width-11 and width-12 recovery examples also verify an alternate two-pair line: a far-side first drop remains live and the second red/red pair wins. Attraction constructions preserve the marked board and queue events as proof; their goals include only starting stones actually cleared by the witness.

A separate two-placement rebound route removes the gold gem needed at the top of a four-wave cascade. Its first blue/gold pair rebounds into the missing cell; its second pair triggers the required cascade of four. The explicit four-wave goal contributes a measured dependency count of four; the two ordinary placements are not miscounted as cascade depth.

A reviewed Arashi four-pair prototype uses a changed turn-two jumble to move marked targets into columns struck at turn four. Lightning removes the marked targets, and the same witness loses when weather is omitted. Zero randomized wins is a sample result, not proof that no alternative complete plan exists. Guard-clearing routes add an ordinary third-turn teal match: the jumble moves a target and three teal guard stones, the third pair clears all guard stones from the selected lane, and turn-four lightning removes all targets. The selected wide-workspace examples also replay a wrong third-pair lane and retain at least one target after the strike. These exact witnesses are checked against the engine and the same-route no-weather counterfactual during generation.

The selected campaigns contain 128 levels each in the stated 32/32/32/24/8 bands. A deterministic regeneration test compares both complete generated manifests, including scores, canonical hashes, witnesses, replay traces and checksums, against the published content data.

When reports disagree with the visible puzzle, revise the construction or grading evidence. Never infer expert status from a long queue, a high tower, a schedule wait, a seed number or an exhaustive-looking but bounded probe.
