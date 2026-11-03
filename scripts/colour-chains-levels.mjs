import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateArashiCampaign } from "./colour-chains-levels/arashi-campaign.mjs";
import { generatedLevelPool, tutorials } from "./colour-chains-levels/chain-candidates.mjs";
import { deepFreeze, GENERATION_REVISION, GRADING_VERSION, hash, SAMPLE_BUDGET } from "./colour-chains-levels/core.mjs";
import { generateShizenCampaign } from "./colour-chains-levels/shizen-campaign.mjs";

export { generateArashiCampaign } from "./colour-chains-levels/arashi-campaign.mjs";
export {
  arashiCausalCandidatePool,
  arashiDoubleGuardCandidatePool,
  arashiGuardedCandidatePool,
  arashiHeadroomEntryCandidates,
} from "./colour-chains-levels/arashi-candidates.mjs";
export { generatedLevelPool, multiPairCandidate } from "./colour-chains-levels/chain-candidates.mjs";
export {
  GENERATION_REVISION,
  GRADING_FORMULA,
  GRADING_VERSION,
  NATURE_GENERATION_REVISION,
  NATURE_GRADING_VERSION,
  SAMPLE_BUDGET,
} from "./colour-chains-levels/core.mjs";
export { authoredLevel } from "./colour-chains-levels/nature-metrics.mjs";
export { generateNaturePrototypeReport } from "./colour-chains-levels/prototype-report.mjs";
export { generateShizenCampaign } from "./colour-chains-levels/shizen-campaign.mjs";
export {
  gradeNatureConstructionBlueprints,
  playAuthored,
  playAuthoredRaw,
  playCounterfactual,
  shizenHorizontalOpeningCandidates,
  shizenLedgeOpeningCandidates,
  shizenPairOpeningCandidates,
  shizenReboundLaneCandidates,
  shizenSupportedTargetCandidates,
} from "./colour-chains-levels/shizen-candidates.mjs";
export { shizenReboundChainCandidatePool } from "./colour-chains-levels/shizen-rebound.mjs";

export function generateContent() {
  const pools = generatedLevelPool();
  const curate = (pool, count) =>
    [...pool.values()].sort((a, b) => a.score - b.score || a.id.localeCompare(b.id)).slice(0, count);
  const poolCount = Object.values(pools).reduce((total, pool) => total + pool.size, 0);
  const levels = [
    ...curate(pools.easy, 20),
    ...curate(pools.chain, 10),
    ...curate(pools.split, 10),
    ...curate(pools.multi, 10),
  ].sort((a, b) => a.score - b.score || a.id.localeCompare(b.id));
  levels.forEach((level, index) => {
    level.number = index + 1;
  });
  const checksum = hash(JSON.stringify(levels));
  const campaign = {
    count: levels.length,
    candidatePoolCount: poolCount,
    generationRevision: GENERATION_REVISION,
    gradingVersion: GRADING_VERSION,
    category: "linear",
    curationPolicy:
      "Select fifty canonically unique stable boards with 20 one-placement links, 10 two-wave chains, 10 split landings and 10 coupled multi-pair plans; validate required setup placements by perturbing each setup step and retaining only dependencies that break the finish path.",
    orderingPolicy:
      "Sort by stored player-facing placement-forgiveness score ascending, then stable content ID; number only after ordering.",
    grading: {
      formula:
        "35*(1-seededPlayoutSuccessRate)+10*forcedPlacementShare+10*min(1,(requiredChainDepth-1)/2)+10*min(1,splitLandingDependencies)+8*min(1,requiredRotations)+12*min(1,requiredSetupPairs/2)+5*min(1,(planningLength-1)/2)",
      sampleBudget: SAMPLE_BUDGET,
      planningLength:
        "committed pair placements in the witnessed winning plan; horizontal input distance is not counted",
      seededPlayoutScope:
        "64 seeded samples vary the first placement and replay the remaining witnessed suffix unchanged",
      setupDependencyScope:
        "For each pre-payoff placement, enumerate all other legal single-step placements, replaying the unchanged witnessed suffix; a step counts only when every tested alternative fails.",
    },
    sampleBudget: SAMPLE_BUDGET,
    checksum,
    levels,
  };
  const shizen = generateShizenCampaign();
  const arashi = generateArashiCampaign();
  return deepFreeze({ campaign, tutorials: tutorials(), shizen, arashi });
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const data = generateContent();
  await writeFile(
    new URL("../src/colour-chains/content.data.ts", import.meta.url),
    `import type { ChainContentData } from './content-types.js';\n\nexport const contentData: ChainContentData = ${JSON.stringify(data, null, 2)};\n`,
  );
  process.stdout.write(
    `${data.campaign.count} levels; ${data.campaign.candidatePoolCount} generated unique candidates; ${data.campaign.checksum}\n`,
  );
}
