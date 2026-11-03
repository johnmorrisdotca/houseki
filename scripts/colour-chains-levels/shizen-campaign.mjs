import { shizenConstructionBlueprints } from "../nature-campaign-levels.mjs";
import {
  gradeNatureConstructionBlueprints,
  shizenHorizontalOpeningCandidates,
  shizenLedgeOpeningCandidates,
  shizenPairOpeningCandidates,
  shizenReboundLaneCandidates,
  shizenSupportedTargetCandidates,
} from "./shizen-candidates.mjs";
import { addLowDecisionOpenings, addSeededCandidates } from "./shizen-openings.mjs";
import { addAdvancedPrototypes, addFourWaveCandidates } from "./shizen-prototype-phases.mjs";
import { makeVariantManifest, shizenReboundChainCandidatePool } from "./shizen-rebound.mjs";

export function generateShizenCampaign() {
  const unique = new Map();
  for (const { level, key } of gradeNatureConstructionBlueprints(shizenConstructionBlueprints, "shizen"))
    unique.set(key, level);
  for (const [key, level] of shizenHorizontalOpeningCandidates()) unique.set(key, level);
  for (const [key, level] of shizenPairOpeningCandidates()) unique.set(key, level);
  for (const [key, level] of shizenSupportedTargetCandidates()) unique.set(key, level);
  for (const [key, level] of shizenReboundLaneCandidates()) unique.set(key, level);
  for (const [key, level] of shizenLedgeOpeningCandidates()) unique.set(key, level);
  addLowDecisionOpenings(unique);
  addFourWaveCandidates(unique);
  for (const [key, level] of shizenReboundChainCandidatePool(8)) unique.set(key, level);
  for (const [key, level] of shizenReboundChainCandidatePool(32, [61, 80], [1, 2, 3, 4])) unique.set(key, level);
  addAdvancedPrototypes(unique);
  addSeededCandidates(unique);
  if (unique.size < 128)
    throw new Error(
      `Shizen generation found only ${unique.size} unique engine-witnessed candidates for 128 measured bands`,
    );
  return makeVariantManifest(
    [...unique.values()],
    "shizen",
    "Preserve verified published stable IDs, add canonically unique rebound and attraction boards, and select only candidates with engine-replayed witnesses and same-plan mechanic counterfactual evidence.",
    "Within the declared 1–20, 21–40, 41–60, 61–80 and 81–100 measured score bands, sort ascending by score then stable canonical ID.",
    unique.size,
  );
}
