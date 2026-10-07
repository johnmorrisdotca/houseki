# Magnetic Blocks campaign grading

The expanded campaign uses a fixed, absolute 1–100 score. Its input evidence is
the authored option set, not the level's list position or a random seed. The
current score formula is recorded in `campaignManifest.difficultyFormula` and
reproduced by `scripts/magnetic-blocks-levels.mjs`.

Each candidate is replayed through the engine with a deterministic, separately
seeded sample of complete legal plans. The sample stream is derived from the
canonical puzzle description, so changing the game seed does not change the
grade. The manifest stores the trial and win counts; a rate from a finite
sample is evidence, not a proof that all plans have been searched.

The candidate witness is also executed action by action. Legal placement
choices are measured by trying every in-bounds horizontal position, rotation,
and available floor choice through the engine. For setup puzzles, alternative
first placements are replayed with the authored suffix to measure how often
the setup choice preserves the win. Floor necessity is measured by replaying
the same plan with the consequential floor choice removed. Merely offering
more floor choices does not increase difficulty.

The intermediate set contains two vertical target columns at different
heights. The all-red block must split on Pull so its columns settle to the two
separate target tops; the Calm-floor counterfactual does not clear both groups.
Hard levels use a support-layer sequence, and expert levels add the one-use
floor choice whose Calm counterfactual loses.

Level bands use fixed score ranges: entry 1–20, easy 21–40, intermediate
41–60, hard 61–80, expert 81–100. The curated campaign has 32 entry, 32 easy,
32 intermediate, 24 hard, and 8 expert levels, sorted by score and then by
canonical SHA-256 key. Marks are `min(5, 1 + floor((score - 1) / 20))`.

One-placement levels have an exact minimum of one placement. Multi-placement
levels report `unknown` for minimum plan length; no exhaustive minimum-plan
search was run, and the stored witness supplies only an upper bound. A finite
random sample likewise cannot establish uniqueness or a complete win rate.
Expert curation therefore has an additional structural
gate: the verified plan must include interacting support changes whose order
changes later target access, and a consequential floor decision. Repeating
independent one-placement targets or adding inert queued pieces does not meet
that gate.

This revision regrades and renumbers all 128 selected challenges. Backward compatibility with the former fifty-level campaign is outside the approved scope; no archived level records are retained.

Occupied cells, usable cells and board coverage are stored as context alongside the strategic metrics. They are not independent score weights: an open obvious puzzle and a crowded forced puzzle can both be easy. Coverage affects the measured placement and failure behavior rather than granting difficulty for area alone.

Curation retains the lowest eligible scores for entry through hard bands and the highest eight eligible expert candidates. The final catalogue remains ascending. A surplus-pool regression protects this distinction.
