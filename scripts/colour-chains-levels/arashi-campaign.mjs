import { arashiConstructionBlueprints } from "../nature-campaign-levels.mjs";
import {
  arashiCausalCandidatePool,
  arashiGuardedCandidatePool,
  arashiHeadroomEntryCandidates,
} from "./arashi-candidates.mjs";
import { addPrototypeCandidates } from "./arashi-prototype-phases.mjs";
import { addSearchedCandidates } from "./arashi-search-phases.mjs";
import { gradeNatureConstructionBlueprints } from "./shizen-candidates.mjs";
import { makeVariantManifest } from "./shizen-rebound.mjs";

export function generateArashiCampaign() {
  const candidates = new Map();
  for (const { level, key } of gradeNatureConstructionBlueprints(arashiConstructionBlueprints, "arashi"))
    candidates.set(key, level);
  for (const [key, level] of arashiHeadroomEntryCandidates()) candidates.set(key, level);
  addPrototypeCandidates(candidates);
  addSearchedCandidates(candidates);
  for (const [key, level] of arashiCausalCandidatePool(28)) candidates.set(key, level);
  for (const [key, level] of arashiGuardedCandidatePool(16)) candidates.set(key, level);
  if (candidates.size < 128)
    throw new Error(
      `Arashi generation found only ${candidates.size} unique engine-witnessed candidates for 128 measured bands`,
    );
  return makeVariantManifest(
    [...candidates.values()],
    "arashi",
    "Curate exact score bands from measured full-plan success, consequential placement deviations, setup-only deviation losses, distinct target-color components and verified weather dependence. Every target-bearing weather trace records its actual jumble and strike outcome.",
    "Within declared 1–20, 21–40, 41–60, 61–80 and 81–100 measured score bands, sort ascending by score then stable canonical ID.",
    candidates.size,
  );
}
