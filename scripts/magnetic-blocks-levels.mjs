import { writeFile } from "node:fs/promises";
import {
  doubleTargetCandidate,
  GRADING,
  grade,
  hasCausalTargetDependencies,
  layeredCandidate,
  openCandidate,
  REVISION,
  selectBandCandidates,
} from "./magnetic-blocks-levels/candidates.mjs";
import { deepFreeze, makeLessons } from "./magnetic-blocks-levels/lessons.mjs";
import { hash, normalizedColourKey, stable } from "./magnetic-blocks-levels/search.mjs";

export { hasCausalTargetDependencies, selectBandCandidates } from "./magnetic-blocks-levels/candidates.mjs";

export function generateContent() {
  const pool = new Map();
  const add = (item) => {
    if (!item) return;
    const canonicalKey = normalizedColourKey(item.options);
    if (!pool.has(canonicalKey)) pool.set(canonicalKey, { ...item, canonicalKey });
  };
  for (let serial = 0; serial < 600; serial++) add(openCandidate(serial));
  for (let serial = 0; serial < 500; serial++) add(doubleTargetCandidate(serial));
  for (let serial = 0; serial < 32; serial++) {
    add(layeredCandidate(serial, false));
    add(layeredCandidate(serial, true));
  }
  const graded = [...pool.values()].map((item) => ({ ...item, ...grade(item, item.canonicalKey) }));
  const ranges = [
    { id: "entry", count: 32, min: 1, max: 20 },
    { id: "easy", count: 32, min: 21, max: 40 },
    { id: "intermediate", count: 32, min: 41, max: 60 },
    { id: "hard", count: 24, min: 61, max: 80 },
    { id: "expert", count: 8, min: 81, max: 100 },
  ];
  const selected = [];
  for (const range of ranges) {
    let matches = graded.filter((item) => item.score >= range.min && item.score <= range.max);
    if (range.id === "intermediate") matches = matches.filter((item) => item.targetGroupCount === 2);
    if (range.id === "hard") matches = matches.filter((item) => hasCausalTargetDependencies(item, 1));
    if (range.id === "expert")
      matches = matches.filter(
        (item) =>
          item.interactionDepth === 2 && item.necessaryFloorDecisionShare === 1 && hasCausalTargetDependencies(item, 2),
      );
    matches.sort((a, b) => a.score - b.score || a.canonicalKey.localeCompare(b.canonicalKey));
    if (matches.length < range.count)
      throw new Error(
        `Only ${matches.length}/${range.count} verified ${range.id} candidates; pool=${pool.size}; scores=${JSON.stringify(
          graded.reduce((out, item) => {
            const key =
              item.score <= 20
                ? "entry"
                : item.score <= 40
                  ? "easy"
                  : item.score <= 60
                    ? "intermediate"
                    : item.score <= 80
                      ? "hard"
                      : "expert";
            out[key] = (out[key] ?? 0) + 1;
            return out;
          }, {}),
        )}`,
      );
    const chosen = selectBandCandidates(matches, range);
    selected.push(...chosen.map((item) => ({ ...item, band: range.id })));
  }
  selected.sort((a, b) => a.score - b.score || a.canonicalKey.localeCompare(b.canonicalKey));
  const bands = [];
  let cursor = 0;
  for (const range of ranges) {
    bands.push({ id: range.id, count: range.count, first: cursor + 1, last: cursor + range.count });
    cursor += range.count;
  }
  const levels = selected.map((item, index) => {
    const band = item.band;
    const text =
      band === "expert"
        ? [
            "Layered support sequence",
            "重なる支えの順序",
            "Clear blue, then green, then switch to Pull for the red target.",
            "青、緑の順に消し、最後に引力へ切り替えて赤い目標を消します。",
          ]
        : band === "hard"
          ? [
              "Layered support",
              "重なる支え",
              "Remove the marked support layers in queue order to expose the final target.",
              "順番に支えの層を消して、最後の目標を見つけます。",
            ]
          : band === "intermediate"
            ? [
                "Two marked columns",
                "2つの印の列",
                "Use Pull to split one block across two marked red columns.",
                "引力でブロックを分け、2つの印の赤い列に届けます。",
              ]
            : [
                "Open landing",
                "自由な着地",
                "Match the marked red line with a legal block placement.",
                "合法なブロック配置で印の赤い列をそろえます。",
              ];
    const [titleEn, titleJa, objectiveEn, objectiveJa] = text;
    const occupiedCells = item.options.initialBoard.filter(Boolean).length;
    const usableCells = item.options.mask
      ? item.options.mask.filter(Boolean).length
      : item.options.width * item.options.height;
    const metrics = {
      occupiedCells,
      usableCells,
      boardCoverage: Number((occupiedCells / usableCells).toFixed(6)),
      legalPlacementChoices: item.legalPlacementChoices,
      setupPlacementChoices: item.setupPlacementChoices ?? 0,
      winningPlacementChoices: item.winningPlacementChoices,
      availableFloorChoices: item.options.floorSwitch ? 3 : 1,
      witnessPlacements: item.witnessPlacements,
      witnessFloorDecisions: item.witnessFloorDecisions,
      difficultyScore: item.score,
      fullPlanTrials: item.trials,
      fullPlanWins: item.wins,
      fullPlanSuccessRate: item.fullRate,
      setupDecisionPressure: item.setupDecisionPressure ?? 0,
      interactingDependencyDepth: item.interactionDepth ?? 0,
      necessaryFloorDecisionShare: item.necessaryFloorDecisionShare ?? 0,
      ...(item.setupEvidence ? { setupDecisionEvidence: item.setupEvidence } : {}),
      ...(item.targetIdsClearedByPlacement
        ? {
            targetIdsClearedByPlacement: item.targetIdsClearedByPlacement,
            targetIdsRemainingAfterPlacement: item.targetIdsRemainingAfterPlacement,
            targetIdsMovedByPlacement: item.targetIdsMovedByPlacement,
          }
        : {}),
      minimumPlanSearch: {
        status: item.witnessPlacements === 1 ? "exact" : "unknown",
        nodeBudget: item.witnessPlacements === 1 ? item.legalPlacementChoices : 0,
        nodesVisited: item.witnessPlacements === 1 ? item.legalPlacementChoices : 0,
        lowerBound: 1,
        upperBound: item.witnessPlacements,
      },
    };
    const id = `magnetic-${hash(item.canonicalKey).slice(0, 16)}`;
    const options = { ...item.options, seed: id };
    return {
      id,
      number: index + 1,
      band,
      title: {
        en: `${titleEn} ${String(index + 1).padStart(3, "0")}`,
        ja: `${titleJa} ${String(index + 1).padStart(3, "0")}`,
      },
      objective: { en: objectiveEn, ja: objectiveJa },
      options,
      witness: item.witness,
      witnessResult: "won",
      metrics,
      marks: Math.min(5, 1 + Math.floor((item.score - 1) / 20)),
      tags: [
        band,
        item.layerEvidence ? "layered-support" : item.targetGroupCount === 2 ? "two-target-groups" : "marked-line",
        item.witnessPlacements > 1 ? "multi-placement" : "single-placement",
      ],
      canonicalKey: item.canonicalKey,
      canonicalKeyHash: hash(item.canonicalKey),
      score: item.score,
      gradingVersion: GRADING,
      proofStatus: "engine-witness-verified",
      reviewStatus: "human-review-pending",
      ...(item.counterfactualResult
        ? {
            counterfactual: {
              kind: item.options.floorSwitch ? "floor-switch" : "floor-schedule",
              alternative: item.options.floorSwitch
                ? "same witness without the one-use floor switch"
                : "same witness with Calm on the scheduled placement",
              result: item.counterfactualResult,
            },
          }
        : {}),
    };
  });
  const body = {
    count: levels.length,
    currentCount: levels.length,
    candidateCount: pool.size,
    generationRevision: REVISION,
    gradingVersion: GRADING,
    difficultyFormula:
      "raw = .35*(1 - completePlanWinRate) + .25*(1 - finalWinningChoices/finalLegalChoices) + .15*meanFixedSuffixSetupPressure + .15*min(1, interactingDependencyDepth/2) + .10*necessaryFloorDecisionShare; score = clamp(1,100,1+round(99*raw)). Full-plan evidence uses 128 seeded legal playouts (1024 for expert candidates).",
    normalization:
      "Absolute score; no pool-relative normalization. Bands are fixed at 1–20, 21–40, 41–60, 61–80, and 81–100.",
    marksFormula: "min(5, 1 + floor((score - 1) / 20))",
    orderingPolicy:
      "Sort ascending by measured integer score, then canonical SHA-256 key; band comes from fixed score ranges.",
    bands,
    levels,
  };
  const campaign = { ...body, checksum: hash(stable(body)) };
  return deepFreeze({ campaign, lessons: makeLessons() });
}
if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  const data = generateContent();
  const source = `import type { MagneticContentData } from './content-types.js';\n\n/** Generated by scripts/magnetic-blocks-levels.mjs. */\nexport const contentData: MagneticContentData = ${JSON.stringify(data, null, 2)};\n`;
  await writeFile(new URL("../src/magnetic-blocks/content.data.ts", import.meta.url), source);
  process.stdout.write(
    `${data.campaign.count} verified levels from ${data.campaign.candidateCount} canonical candidates · ${data.campaign.checksum}\n`,
  );
}
