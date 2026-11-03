import { resolve } from "node:path";

export const GENERATION_REVISION = "gem-swap-campaign-1.3.0";
export const GRADING_VERSION = "swap-choice-forgiveness-1";
export const SAMPLE_BUDGET = 24;
export const GRADING_WEIGHTS = Object.freeze({
  seededPlayoutDifficulty: 30,
  choiceDifficulty: 18,
  objectiveCoordination: 12,
  chainDepth: 10,
  witnessLength: 25,
  specialCombination: 5,
});
export const OUTPUT = resolve("src/gem-swap/content.data.ts");
export const TYPES = resolve("src/gem-swap/content.ts");
export const CATEGORIES = ["score", "collect", "chain", "seals", "combined"];
export const QUOTAS = 10;
export const CANDIDATE_POOL = 18;
export const LENGTHS = {
  score: [1, 1, 2, 2, 3, 3, 4, 4, 5, 6],
  collect: [1, 2, 2, 3, 3, 4, 4, 5, 6, 6],
  chain: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6],
  seals: [1, 2, 2, 3, 3, 4, 4, 5, 6, 6],
  combined: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6],
};
