import { createChallenge } from "../../dist/colour-chains.js";
import {
  hash,
  NATURE_GENERATION_REVISION,
  NATURE_GRADING_VERSION,
  placementDirections,
  placePair,
  playPlan,
  playRandomLegalPlan,
  rng,
  SAMPLE_BUDGET,
  weatherTrace,
} from "./core.mjs";
import { playCounterfactual } from "./shizen-candidates.mjs";

export function canonicalNatureKey(level) {
  const variants = [];
  for (const mirror of [false, true]) {
    const labels = new Map();
    const label = (colour) => {
      if (!labels.has(colour)) labels.set(colour, labels.size);
      return labels.get(colour);
    };
    const board = [];
    for (let y = 0; y < level.height; y++)
      for (let px = 0; px < level.width; px++) {
        const x = mirror ? level.width - 1 - px : px;
        const gem = level.board[y * level.width + x];
        board.push(
          gem
            ? [
                label(gem.colour),
                Boolean(gem.magnetic),
                level.goal.kind === "clear-targets" && level.goal.targetIds.includes(gem.id),
              ]
            : null,
        );
      }
    const queue = level.queue.map((pair) => pair.map(label));
    const goal =
      level.goal.kind === "clear-targets"
        ? {
            kind: "clear-targets",
            targets: level.goal.targetIds
              .map((id) => {
                const at = level.board.findIndex((gem) => gem?.id === id);
                const x = at % level.width;
                return Math.floor(at / level.width) * level.width + (mirror ? level.width - 1 - x : x);
              })
              .sort((a, b) => a - b),
          }
        : level.goal;
    // Identity is normalized puzzle geometry plus its fixed mechanics. The
    // seed and witnessed weather trace remain replay evidence, not uniqueness.
    variants.push(
      JSON.stringify([
        level.width,
        level.height,
        level.colourCount,
        level.weather ?? "",
        goal,
        board,
        queue,
        level.magneticQueue ?? [],
      ]),
    );
  }
  return variants.sort()[0];
}
function targetComponentCount(source) {
  if (source.goal.kind !== "clear-targets") return 0;
  const remaining = new Set(
    source.goal.targetIds.map((id) => source.board.findIndex((gem) => gem?.id === id)).filter((index) => index >= 0),
  );
  let count = 0;
  while (remaining.size) {
    count++;
    const queue = [remaining.values().next().value];
    const colour = source.board[queue[0]]?.colour;
    remaining.delete(queue[0]);
    while (queue.length) {
      const at = queue.pop();
      const x = at % source.width;
      const y = Math.floor(at / source.width);
      for (const [nx, ny] of [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ]) {
        if (nx < 0 || nx >= source.width || ny < 0 || ny >= source.height) continue;
        const next = ny * source.width + nx;
        if (remaining.has(next) && source.board[next]?.colour === colour) {
          remaining.delete(next);
          queue.push(next);
        }
      }
    }
  }
  return count;
}
function targetColourCount(source) {
  if (source.goal.kind !== "clear-targets") return 0;
  return new Set(source.goal.targetIds.map((id) => source.board.find((gem) => gem?.id === id)?.colour).filter(Boolean))
    .size;
}
export function natureMetrics(source, options, witness, events, scoreData = {}) {
  const sampleBudget = scoreData.sampleBudget ?? SAMPLE_BUDGET;
  const placements = [];
  for (let pivotX = 0; pivotX < source.width; pivotX++)
    for (const orientation of placementDirections) placements.push({ pivotX, orientation });
  const measurementKey = canonicalNatureKey({
    width: source.width,
    height: source.height,
    colourCount: source.colourCount,
    board: options.board,
    queue: source.queue,
    goal: source.goal,
    nature: options.nature,
    weather: options.weather,
    magneticQueue: options.magneticQueue,
  });
  const measurementId = hash(measurementKey).slice(0, 12);
  const initial = (() => {
    try {
      return createChallenge({
        id: `probe-${measurementId}`,
        seed: options.seed,
        width: source.width,
        height: source.height,
        colourCount: source.colourCount,
        board: options.board,
        queue: source.queue,
        goal: source.goal,
        witness,
        nature: options.nature,
        ...(options.weather ? { weather: options.weather } : {}),
        ...(options.magneticQueue ? { magneticQueue: options.magneticQueue } : {}),
      });
    } catch {
      return null;
    }
  })();
  let legalPlacements = 0;
  let wins = 0;
  let requiredSetupPairs = 0;
  let setupDependencyProbes = 0;
  let setupDependencyFails = 0;
  let setupDeviationProbes = 0;
  let setupDeviationLosses = 0;
  let deviationProbes = 0;
  let deviationWins = 0;
  let branchingPoints = 0;
  let forcedSafeSteps = 0;
  let deadEndDeviations = 0;
  if (initial)
    for (let index = 0; index < witness.length; index++) {
      let prefix = initial;
      for (const step of witness.slice(0, index)) {
        const placed = placePair(prefix, step);
        if (!placed) {
          prefix = null;
          break;
        }
        prefix = placed.state;
      }
      if (prefix?.phase !== "falling") continue;
      let alternatives = 0;
      let alternativeWins = 0;
      for (const placement of placements) {
        if (placement.pivotX === witness[index].pivotX && placement.orientation === witness[index].orientation)
          continue;
        const placed = placePair(prefix, placement);
        if (!placed) continue;
        alternatives++;
        deviationProbes++;
        const suffix =
          placed.state.phase === "falling"
            ? playPlan(placed.state, witness.slice(index + 1))
            : { state: placed.state, events: [] };
        if (suffix?.state.phase === "won") {
          alternativeWins++;
          deviationWins++;
        } else deadEndDeviations++;
        if (index < witness.length - 1) {
          setupDeviationProbes++;
          if (suffix?.state.phase !== "won") setupDeviationLosses++;
        }
      }
      const actual = placePair(prefix, witness[index]);
      if (!actual) continue;
      legalPlacements += alternatives + 1;
      const actualSuffix =
        actual.state.phase === "falling"
          ? playPlan(actual.state, witness.slice(index + 1))
          : { state: actual.state, events: [] };
      wins += alternativeWins + (actualSuffix?.state.phase === "won" ? 1 : 0);
      if (alternativeWins > 0 && alternatives - alternativeWins > 0) branchingPoints++;
      if (alternativeWins === 0) forcedSafeSteps++;
      if (alternatives && index < witness.length - 1) {
        setupDependencyProbes++;
        if (alternativeWins === 0) {
          setupDependencyFails++;
          requiredSetupPairs++;
        }
      }
    }
  const random = rng(`${NATURE_GENERATION_REVISION}|full-plans|${measurementId}`);
  let successes = 0;
  let fullPlanPlacements = 0;
  let observedPotentialChainDepth = 1;
  const witnessedChainDepth = Math.max(
    1,
    ...events.filter((event) => event.type === "cells-cleared").map((event) => event.chain ?? 1),
  );
  if (initial)
    for (let i = 0; i < sampleBudget; i++) {
      const run = playRandomLegalPlan(initial, random);
      if (run.state.phase === "won") successes++;
      fullPlanPlacements += run.placements;
      observedPotentialChainDepth = Math.max(observedPotentialChainDepth, run.maxChainDepth);
    }
  const featureEvent =
    events.find((event) => event.type === "power-drop-landed" && event.rebound) ??
    events.find((event) => event.type === "magnetic-pulse" && event.moves?.length);
  const setupPairs = Math.max(0, witness.length - 1);
  const successRate = Number((successes / sampleBudget).toFixed(6));
  const forcedSafeShare = witness.length ? forcedSafeSteps / witness.length : 0;
  const branchingShare = witness.length ? branchingPoints / witness.length : 0;
  const mechanicOffKind = options.weather
    ? "weather"
    : events.some((event) => event.type === "magnetic-pulse" && event.moves?.length)
      ? "magnetism"
      : "nature";
  const consequence = playCounterfactual(options, source, witness, mechanicOffKind);
  const weatherDependency = options.weather && consequence?.state.phase !== "won" ? 1 : 0;
  // Ordinary clear goals with multiple disconnected stones of one colour are
  // still a single ordinary match objective. Scheduled weather can expose
  // separated target groups independently, so its spatial components count.
  const goalComponents =
    source.goal.kind === "clear-targets"
      ? options.weather
        ? targetComponentCount(source)
        : targetColourCount(source)
      : 0;
  const goalDependencyCount = source.goal.kind === "minimum-chain" ? source.goal.chain : goalComponents;
  const goalCoordinationShare =
    source.goal.kind === "minimum-chain"
      ? Math.min(1, Math.max(0, (source.goal.chain - 1) / 3))
      : Math.min(1, Math.max(0, (goalComponents - 1) / 2));
  const occupiedCells = options.board.filter(Boolean).length;
  const usableCells = source.width * source.height;
  const requiredChainDepth =
    source.goal.kind === "minimum-chain" ? source.goal.chain : (scoreData.requiredChainDepth ?? 1);
  const cascadeShare = Math.min(1, Math.max(0, (requiredChainDepth - 1) / 2));
  const consequentialDecisionShare = deviationProbes ? deadEndDeviations / deviationProbes : 0;
  const verifiedSetupDependencyShare = setupDependencyProbes ? setupDependencyFails / setupDependencyProbes : 0;
  const setupDeviationLossShare = setupDeviationProbes ? setupDeviationLosses / setupDeviationProbes : 0;
  const rawDifficultyScore = Math.max(
    0,
    Math.min(
      1,
      0.18 * (1 - successRate) +
        0.28 * consequentialDecisionShare +
        0.3 * setupDeviationLossShare +
        0.12 * goalCoordinationShare +
        0.06 * cascadeShare +
        0.06 * weatherDependency,
    ),
  );
  const score = Math.max(1, Math.min(100, 1 + Math.round(rawDifficultyScore * 99)));
  const rawMetrics = {
    placementProbes: placements.length * witness.length,
    legalPlacements,
    goalPreservingPlacements: wins,
    forcedPlacementShare: witness.length ? forcedSafeSteps / witness.length : 0,
    seededPlayoutSamples: sampleBudget,
    seededPlayoutQueueDepth: source.queue.length,
    seededPlayoutVariablePrefixLength: source.queue.length,
    seededPlayoutFixedSuffixLength: 0,
    seededPlayoutPlacements: fullPlanPlacements,
    seededPlayoutSuccesses: successes,
    seededPlayoutSuccessRate: successRate,
    fullPlanSuccessRate: successRate,
    witnessedPlanPlacements: witness.length,
    singleStepDeviationProbes: deviationProbes,
    singleStepDeviationWins: deviationWins,
    singleStepDeviationDeadEnds: deadEndDeviations,
    branchingDecisionPoints: branchingPoints,
    forcedSafeSteps,
    forcedSafeShare,
    branchingShare,
    consequentialDecisionShare,
    verifiedSetupDependencyShare,
    setupDeviationProbes,
    setupDeviationLosses,
    setupDeviationLossShare,
    setupPairsBeforePayoff: setupPairs,
    requiredSetupPairs,
    verifiedSetupDependencies: setupDependencyFails,
    setupDependencyProbeSteps: setupDependencyProbes,
    requiredChainDepth,
    witnessedChainDepth,
    observedPotentialChainDepth,
    requiredRotations:
      witness.filter((step) => step.orientation !== "up" && step.orientation !== "down").length +
      2 * witness.filter((step) => step.orientation === "down").length,
    requiredWallKicks: events.filter((event) => event.type === "pair-rotated" && (event.kick?.x || event.kick?.y))
      .length,
    splitLandingDependencies: scoreData.splitLandingDependencies ?? 0,
    goalTargets: source.goal.kind === "clear-targets" ? source.goal.targetIds.length : 0,
    goalDependencyCount,
    occupiedCells,
    usableCells,
    boardCoverage: Number((occupiedCells / usableCells).toFixed(6)),
    goalCoordinationShare,
    cascadeShare,
    weatherEventCount: events.filter((event) => event.type === "weather-triggered").length,
    weatherDependency,
    mechanicOffCounterfactualWon: consequence?.state.phase === "won",
    mechanicOffCounterfactualKind: mechanicOffKind,
    mechanicOffCounterfactualPhase: consequence?.state.phase ?? "invalid",
    planningLength: witness.length,
  };
  return { rawMetrics, rawDifficultyScore, score, featureEvent };
}
export function authoredLevel(source, prefix, number, options, witness, events, scoreData = {}) {
  let measured = natureMetrics(source, options, witness, events, scoreData);
  if (measured.score >= 81 && scoreData.sampleBudget === undefined)
    measured = natureMetrics(source, options, witness, events, { ...scoreData, sampleBudget: 256 });
  const featureTag = events.some((event) => event.type === "magnetic-pulse" && event.moves?.length)
    ? "magnetic-attraction"
    : "rebound";
  const level = {
    id: "",
    number,
    title: options.title,
    objective: options.objective,
    canonicalKeyHash: "",
    width: source.width,
    height: source.height,
    colourCount: source.colourCount,
    seed: options.seed,
    board: options.board,
    queue: source.queue,
    goal: source.goal,
    witness,
    tags: [
      ...new Set([
        ...source.tags.filter((tag) =>
          ["rotation", "split-landing", "two-wave-chain", "setup-dependency", "gravity-setup"].includes(tag),
        ),
        featureTag,
        ...(options.weather ? ["jumble", "lightning"] : []),
      ]),
    ],
    rawMetrics: measured.rawMetrics,
    rawDifficultyScore: measured.rawDifficultyScore,
    score: measured.score,
    marks: Math.min(5, 1 + Math.floor((measured.score - 1) / 20)),
    gradingVersion: NATURE_GRADING_VERSION,
    normalizationCategory: `${prefix}-${source.width}x${source.height}-finite-v3`,
    proofStatus: "engine-witness-verified",
    reviewStatus: "human-review-pending",
    nature: true,
    ...(options.weather ? { weather: options.weather, weatherTrace: weatherTrace(events, source) } : {}),
    ...(options.magneticQueue ? { magneticQueue: options.magneticQueue } : {}),
  };
  const key = canonicalNatureKey(level);
  level.canonicalKeyHash = hash(key);
  level.id = `${prefix}-${hash(key).slice(0, 12)}`;
  return { level, key };
}
