import { shizenFourWaveRestorePrototype } from "../nature-campaign-levels.mjs";
import {
  cell,
  deepFreeze,
  GRADING_FORMULA,
  hash,
  NATURE_GENERATION_REVISION,
  NATURE_GRADING_VERSION,
  SAMPLE_BUDGET,
} from "./core.mjs";
import { authoredLevel } from "./nature-metrics.mjs";
import { playAuthored, playAuthoredRaw, playCounterfactual } from "./shizen-candidates.mjs";

/** Keep only color/queue variants that change the witnessed cascade route and retain the rebound dependency. */
export function shizenReboundChainCandidatePool(minimum = 8, scoreRange = [81, 100], chainRequirements = [3, 4]) {
  const candidates = new Map();
  const width = 6;
  const height = 12;
  const baseBoard = Array(width * height).fill(null);
  let id = 1;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const colour = shizenFourWaveRestorePrototype.rows[y][x];
      if (colour !== ".") baseBoard[cell(x, y)] = { id: id++, colour };
    }
  const baseDefinitions = [
    {
      queue: [
        ["blue", "gold"],
        ["green", "red"],
      ],
      witness: [
        { pivotX: 1, orientation: "left" },
        { pivotX: 0, orientation: "up" },
      ],
    },
    {
      queue: [
        ["gold", "blue"],
        ["green", "red"],
      ],
      witness: [
        { pivotX: 0, orientation: "right" },
        { pivotX: 0, orientation: "up" },
      ],
    },
  ];
  const colourNames = ["red", "blue", "green", "gold"];
  const routeSignature = (events) =>
    JSON.stringify(
      events
        .filter((event) => event.type === "cells-cleared")
        .map((event) => [event.chain ?? 1, [...(event.ids ?? [])].sort((a, b) => a - b)]),
    );
  const knownRoutes = new Set();
  for (const definition of baseDefinitions) {
    for (const chain of chainRequirements) {
      const source = {
        id: "shizen-route-reference",
        width,
        height,
        colourCount: 4,
        board: baseBoard,
        queue: definition.queue,
        goal: { kind: "minimum-chain", chain },
        tags: ["minimum-chain", "gravity-setup", "setup-dependency"],
      };
      const options = {
        seed: shizenFourWaveRestorePrototype.seed,
        board: baseBoard,
        nature: true,
        magneticQueue: [
          [false, false],
          [false, false],
        ],
      };
      const result = playAuthored(options, source, definition.witness);
      if (result?.state.phase === "won") knownRoutes.add(routeSignature(result.events));
    }
  }
  let mutationIndex = 0;
  for (const definition of baseDefinitions)
    for (const chain of chainRequirements) {
      for (let at = 0; at < baseBoard.length && candidates.size < minimum; at++) {
        const gem = baseBoard[at];
        if (!gem) continue;
        for (const colour of colourNames) {
          if (colour === gem.colour || candidates.size >= minimum) continue;
          const board = baseBoard.map((item, index) => (index === at ? { ...item, colour } : item));
          const source = {
            id: `shizen-route-variant-${mutationIndex++}`,
            width,
            height,
            colourCount: 4,
            board,
            queue: definition.queue,
            goal: { kind: "minimum-chain", chain },
            tags: ["minimum-chain", "gravity-setup", "setup-dependency"],
          };
          const options = {
            seed: shizenFourWaveRestorePrototype.seed,
            board,
            nature: true,
            magneticQueue: [
              [false, false],
              [false, false],
            ],
            title: { en: "Restore the gold step", ja: "金の段差を戻す" },
            objective: {
              en: `Restore the rebound support, then complete the required ${chain}-wave cascade.`,
              ja: `リバウンドで支えを戻し、必須の${chain}段連鎖を完成させます。`,
            },
          };
          const raw = playAuthoredRaw(options, source, definition.witness);
          if (raw?.state.phase !== "won" || raw.state.maxChain < chain) continue;
          const route = routeSignature(raw.events);
          if (knownRoutes.has(route)) continue;
          const reboundEvent = raw.events.some((event) => event.type === "power-drop-landed" && event.rebound);
          if (!reboundEvent) continue;
          const withoutNature = playCounterfactual(options, source, definition.witness, "nature");
          if (withoutNature?.state.phase === "won") continue;
          const proof = playAuthored(options, source, definition.witness);
          if (proof?.state.phase !== "won") continue;
          const authored = authoredLevel(source, "shizen", 0, options, definition.witness, proof.events);
          if (authored.level.score < scoreRange[0] || authored.level.score > scoreRange[1]) continue;
          authored.level.tags.push(
            "minimum-chain-dependency",
            "rebound-dependency",
            "counterfactual-fail-without-nature",
            "cascade-route-variant",
          );
          knownRoutes.add(route);
          if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
        }
      }
    }
  for (const definition of baseDefinitions)
    for (const chain of chainRequirements) {
      const mutationCells = baseBoard.flatMap((gem, at) =>
        gem && Math.floor(at / width) >= 5 && at % width <= 3 ? [at] : [],
      );
      for (let firstIndex = 0; firstIndex < mutationCells.length && candidates.size < minimum; firstIndex++)
        for (
          let secondIndex = firstIndex + 1;
          secondIndex < mutationCells.length && candidates.size < minimum;
          secondIndex++
        ) {
          const firstAt = mutationCells[firstIndex];
          const secondAt = mutationCells[secondIndex];
          for (const firstColour of colourNames)
            for (const secondColour of colourNames) {
              const firstGem = baseBoard[firstAt];
              const secondGem = baseBoard[secondAt];
              if (firstColour === firstGem.colour || secondColour === secondGem.colour || candidates.size >= minimum)
                continue;
              const board = baseBoard.map((item, at) =>
                at === firstAt
                  ? { ...item, colour: firstColour }
                  : at === secondAt
                    ? { ...item, colour: secondColour }
                    : item,
              );
              const source = {
                id: `shizen-route-pair-${mutationIndex++}`,
                width,
                height,
                colourCount: 4,
                board,
                queue: definition.queue,
                goal: { kind: "minimum-chain", chain },
                tags: ["minimum-chain", "gravity-setup", "setup-dependency"],
              };
              const options = {
                seed: shizenFourWaveRestorePrototype.seed,
                board,
                nature: true,
                magneticQueue: [
                  [false, false],
                  [false, false],
                ],
                title: { en: "Restore the gold step", ja: "金の段差を戻す" },
                objective: {
                  en: `Restore the rebound support, then complete the required ${chain}-wave cascade.`,
                  ja: `リバウンドで支えを戻し、必須の${chain}段連鎖を完成させます。`,
                },
              };
              const raw = playAuthoredRaw(options, source, definition.witness);
              if (raw?.state.phase !== "won" || raw.state.maxChain < chain) continue;
              const route = routeSignature(raw.events);
              if (
                knownRoutes.has(route) ||
                !raw.events.some((event) => event.type === "power-drop-landed" && event.rebound)
              )
                continue;
              const withoutNature = playCounterfactual(options, source, definition.witness, "nature");
              if (withoutNature?.state.phase === "won") continue;
              const proof = playAuthored(options, source, definition.witness);
              if (proof?.state.phase !== "won") continue;
              const authored = authoredLevel(source, "shizen", 0, options, definition.witness, proof.events);
              if (authored.level.score < scoreRange[0] || authored.level.score > scoreRange[1]) continue;
              authored.level.tags.push(
                "minimum-chain-dependency",
                "rebound-dependency",
                "counterfactual-fail-without-nature",
                "cascade-route-variant",
              );
              knownRoutes.add(route);
              if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
            }
        }
    }
  return candidates;
}

export function makeVariantManifest(
  levels,
  category,
  curationPolicy,
  orderingPolicy,
  candidatePoolCount = levels.length,
) {
  const definitions = [
    ["entry", 32, 1, 20],
    ["easy", 32, 21, 40],
    ["intermediate", 32, 41, 60],
    ["hard", 24, 61, 80],
    ["expert", 8, 81, 100],
  ];
  const selected = [];
  for (const [band, count, minimum, maximum] of definitions) {
    const candidates = levels
      .filter((level) => level.score >= minimum && level.score <= maximum)
      .sort((a, b) => a.score - b.score || a.id.localeCompare(b.id));
    if (candidates.length < count) {
      const yieldSummary = definitions
        .map(
          ([id, , low, high]) => `${id}:${levels.filter((level) => level.score >= low && level.score <= high).length}`,
        )
        .join(", ");
      throw new Error(
        `${category} needs ${count} measured ${band} levels scored ${minimum}–${maximum}; only ${candidates.length} qualified (pool ${levels.length}; yields ${yieldSummary})`,
      );
    }
    const chosen = band === "expert" ? candidates.slice(-count) : candidates.slice(0, count);
    for (const level of chosen) {
      level.band = band;
      selected.push(level);
    }
  }
  selected.sort((a, b) => a.score - b.score || a.id.localeCompare(b.id));
  selected.forEach((level, index) => {
    level.number = index + 1;
  });
  const checksum = hash(JSON.stringify(selected));
  const bands = definitions.map(([id, count]) => ({
    id,
    count,
    first: selected.findIndex((level) => level.band === id) + 1,
    last: selected.findIndex((level) => level.band === id) + count,
  }));
  return deepFreeze({
    count: selected.length,
    candidatePoolCount,
    generationRevision: NATURE_GENERATION_REVISION,
    gradingVersion: NATURE_GRADING_VERSION,
    category,
    curationPolicy,
    orderingPolicy,
    grading: {
      formula: GRADING_FORMULA,
      goalCoordinationEvidence:
        "Ordinary clear-target goals count distinct target colours; weather challenges count distinct connected target components exposed to scheduled weather. Minimum-chain goals use the explicit required wave count.",
      sampleBudget:
        "64 for standard candidates; candidates scoring 81+ are remeasured at 256 before final score selection.",
      decisionProbeScope:
        "Enumerate all legal placement deviations at each witness decision and replay the exact remaining witnessed suffix; setup-loss share excludes the payoff placement.",
      seededPlayoutScope:
        "Each deterministic sample chooses independently from the complete legal placement set at every pair through the full finite queue.",
    },
    sampleBudget: SAMPLE_BUDGET,
    checksum,
    bands,
    levels: selected,
  });
}
