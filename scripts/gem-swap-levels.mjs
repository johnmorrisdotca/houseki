import { readFile, writeFile } from "node:fs/promises";
import {
  CANDIDATE_POOL,
  CATEGORIES,
  GENERATION_REVISION,
  GRADING_VERSION,
  GRADING_WEIGHTS,
  LENGTHS,
  OUTPUT,
  QUOTAS,
  SAMPLE_BUDGET,
  TYPES,
} from "./gem-swap-levels/constants.mjs";
import { generateLessons } from "./gem-swap-levels/lessons.mjs";
import { NAMES, NAMES_JA } from "./gem-swap-levels/names.data.mjs";
import { hash, makeCandidate, stable } from "./gem-swap-levels/search.mjs";

export { GENERATION_REVISION, GRADING_VERSION, GRADING_WEIGHTS, SAMPLE_BUDGET } from "./gem-swap-levels/constants.mjs";

function campaignLevels() {
  const selected = [];
  const keys = new Set();
  const usedIds = new Set();
  for (const category of CATEGORIES) {
    const candidates = [];
    const categoryKeys = new Set();
    for (let seed = 0; candidates.length < CANDIDATE_POOL && seed < 100_000; seed++) {
      const position = candidates.length % QUOTAS;
      const length = LENGTHS[category][position];
      const level = makeCandidate(seed, length, category, position);
      if (
        !level ||
        usedIds.has(level.id) ||
        keys.has(level.canonicalKeyHash) ||
        categoryKeys.has(level.canonicalKeyHash)
      )
        continue;
      usedIds.add(level.id);
      keys.add(level.canonicalKeyHash);
      categoryKeys.add(level.canonicalKeyHash);
      candidates.push({ ...level, category });
    }
    if (candidates.length !== CANDIDATE_POOL)
      throw new Error(`Could not generate ${CANDIDATE_POOL} unique witnessed ${category} candidates`);
    candidates.sort((a, b) => a.difficultyScore - b.difficultyScore || a.id.localeCompare(b.id));
    for (let index = 0; index < QUOTAS; index++) {
      const poolIndex = Math.floor((index * (CANDIDATE_POOL - 1)) / (QUOTAS - 1));
      const chosen = candidates[poolIndex];
      selected.push({ ...chosen, title: { en: NAMES[category][index], ja: NAMES_JA[category][index] } });
    }
  }
  selected.sort((a, b) => a.difficultyScore - b.difficultyScore || a.id.localeCompare(b.id));
  return selected.map((level, index) => ({ ...level, number: index + 1 }));
}

function sourceFor(campaign, lessons) {
  const levelRows = campaign.map((level) => `  ${JSON.stringify(level)}`).join(",\n");
  const lessonRows = lessons.map((lesson) => `  ${JSON.stringify(lesson)}`).join(",\n");
  return `import type { GemSwapCampaignLevel, GemSwapLesson } from "./content.js";\n\nexport const gemSwapCampaignRows: GemSwapCampaignLevel[] = [\n${levelRows}\n];\n\nexport const gemSwapLessonRows: GemSwapLesson[] = [\n${lessonRows}\n];\n`;
}
export function generateContent() {
  const candidateLevels = campaignLevels();
  const campaign = candidateLevels.map(({ category: _category, ...level }) => level);
  const lessons = generateLessons();
  const checksum = hash(
    stable({
      campaign,
      lessons,
      generationRevision: GENERATION_REVISION,
      gradingVersion: GRADING_VERSION,
      sampleBudget: SAMPLE_BUDGET,
      gradingWeights: GRADING_WEIGHTS,
    }),
  );
  return { campaign, lessons, checksum, source: sourceFor(campaign, lessons, checksum) };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const generated = generateContent();
  const types = await readFile(TYPES, "utf8");
  const recorded = /export const CAMPAIGN_CHECKSUM = "([0-9a-f]+)"/.exec(types)?.[1];
  if (process.argv.includes("--check")) {
    const data = await readFile(OUTPUT, "utf8").catch(() => "");
    if (recorded !== generated.checksum || !data.includes(generated.campaign[0].id)) {
      console.error("Gem Swap authored content is stale; run scripts/gem-swap-levels.mjs");
      process.exitCode = 1;
    } else
      console.log(
        `Verified ${generated.campaign.length} levels, ${generated.lessons.length} lessons, checksum ${generated.checksum}`,
      );
  } else {
    await writeFile(OUTPUT, generated.source);
    if (recorded !== generated.checksum) await writeFile(TYPES, types.replace(recorded, generated.checksum));
    console.log(
      `Wrote ${generated.campaign.length} levels, ${generated.lessons.length} lessons, checksum ${generated.checksum}`,
    );
  }
}
