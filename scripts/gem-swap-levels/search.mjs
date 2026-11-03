import { createHash } from "node:crypto";
import { advanceTicks, applyAction, createGame, legalActions, validateChallengeWitness } from "../../dist/gem-swap.js";
import { GENERATION_REVISION, GRADING_VERSION, GRADING_WEIGHTS, SAMPLE_BUDGET } from "./constants.mjs";
import { NAMES, NAMES_JA } from "./names.data.mjs";

export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const stable = (value) =>
  Array.isArray(value)
    ? `[${value.map(stable).join(",")}]`
    : value && typeof value === "object"
      ? `{${Object.keys(value)
          .sort()
          .map((key) => `${JSON.stringify(key)}:${stable(value[key])}`)
          .join(",")}}`
      : JSON.stringify(value);
function random(seed) {
  let value = Number.parseInt(hash(String(seed)).slice(0, 8), 16) || 1;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 0x1_0000_0000;
  };
}
export function settle(state, action) {
  const first = applyAction(state, action);
  if (!first.accepted) return null;
  const result = advanceTicks(first.state, 3600);
  return { state: result.state, events: [...first.events, ...result.events] };
}
function chooseAction(state, rng) {
  const moves = legalActions(state).filter((action) => action.kind === "swap");
  return moves.length ? moves[Math.floor(rng() * moves.length)] : null;
}
function createPath(seed, length, category, ordinal) {
  const challenge = { moveLimit: length, goals: [{ kind: "score", target: 9_000_000 }] };
  let state = createGame({ mode: "challenge", preset: "compact", seed, challenge });
  const rng = random(`${GENERATION_REVISION}|path|${category}|${ordinal}|${seed}`);
  const moves = [];
  const removedByMove = [];
  const chainBefore = [];
  const coloursAddedByMove = [];
  const eventsByMove = [];
  for (let move = 0; move < length; move++) {
    chainBefore.push(state.bestChain);
    let action = chooseAction(state, rng);
    if (!action) return null;
    if (category === "chain") {
      let best = null;
      for (const candidate of legalActions(state).filter((item) => item.kind === "swap")) {
        const trial = settle(state, candidate);
        if (!trial || trial.state.bestChain <= state.bestChain) continue;
        const value = trial.state.bestChain * 100 + trial.state.score - state.score;
        if (
          !best ||
          value > best.value ||
          (value === best.value && candidate.from * 144 + candidate.to < best.action.from * 144 + best.action.to)
        )
          best = { action: candidate, value };
      }
      if (best) action = best.action;
    }
    const previousCounts = { ...state.clearedByColour };
    const played = settle(state, action);
    if (!played) return null;
    moves.push(action);
    removedByMove.push(played.events.filter((event) => event.type === "cells-removed").flatMap((event) => event.cells));
    eventsByMove.push(played.events);
    state = played.state;
    coloursAddedByMove.push(
      Object.fromEntries(
        Object.keys(previousCounts).map((colour) => [colour, state.clearedByColour[colour] - previousCounts[colour]]),
      ),
    );
    if (move < length - 1 && state.outcome) return null;
  }
  const lastCells = [...new Set(removedByMove.at(-1) ?? [])];
  const previouslyRemoved = new Set(removedByMove.slice(0, -1).flat());
  const finalFreshCells = lastCells.filter((cell) => !previouslyRemoved.has(cell));
  const lastCounts = coloursAddedByMove.at(-1) ?? {};
  const collectColour = Object.keys(lastCounts)
    .filter((colour) => lastCounts[colour] > 0)
    .sort((a, b) => (state.clearedByColour[b] ?? 0) - (state.clearedByColour[a] ?? 0) || a.localeCompare(b))[0];
  if (category === "chain" && !(state.bestChain >= 2 && state.bestChain > (chainBefore.at(-1) ?? 0))) return null;
  if (["seals", "combined"].includes(category) && !finalFreshCells.length) return null;
  if (category === "collect" && !collectColour) return null;
  if (category === "combined" && !collectColour) return null;
  return { seed, length, state, moves, removedByMove, chainBefore, finalFreshCells, collectColour, eventsByMove };
}
function optionsFor(path, category) {
  const state = path.state;
  const goals = [];
  const seals = ["seals", "combined"].includes(category)
    ? path.finalFreshCells
        .slice(0, Math.min(category === "combined" ? 2 : 3, path.finalFreshCells.length))
        .map((cell) => ({ cell, layers: 1 }))
    : undefined;
  if (category === "score" || category === "combined") goals.push({ kind: "score", target: state.score });
  if (category === "collect" || category === "combined")
    goals.push({ kind: "collect", colour: path.collectColour, target: state.clearedByColour[path.collectColour] });
  if (category === "chain") goals.push({ kind: "chain", target: state.bestChain });
  if (category === "seals" || category === "combined") goals.push({ kind: "seals" });
  return {
    mode: "challenge",
    preset: "compact",
    seed: path.seed,
    challenge: { moveLimit: path.length, goals, ...(seals ? { seals } : {}) },
  };
}
function goalProgress(state, options) {
  return options.challenge.goals.map((goal) => {
    if (goal.kind === "score") return state.score / goal.target;
    if (goal.kind === "collect") return state.clearedByColour[goal.colour] / goal.target;
    if (goal.kind === "chain") return state.bestChain / goal.target;
    return state.sealsCleared / options.challenge.seals.reduce((sum, seal) => sum + seal.layers, 0);
  });
}
function measureChoices(options) {
  const initial = createGame(options);
  const legal = legalActions(initial).filter((action) => action.kind === "swap");
  let progressing = 0;
  for (const action of legal) {
    const played = settle(initial, action);
    if (played && goalProgress(played.state, options).some((value) => value > 0)) progressing++;
  }
  return {
    legalSwapCount: legal.length,
    initiallyProgressingSwaps: progressing,
    initialProgressingShare: legal.length ? progressing / legal.length : 0,
  };
}
function sampledSuccessRate(options, seedLabel) {
  const rng = random(`${GENERATION_REVISION}|grade|${seedLabel}`);
  let successes = 0;
  for (let sample = 0; sample < SAMPLE_BUDGET; sample++) {
    let state = createGame(options);
    for (let move = 0; move < options.challenge.moveLimit && !state.outcome; move++) {
      const action = chooseAction(state, rng);
      if (!action) break;
      const played = settle(state, action);
      if (!played) break;
      state = played.state;
    }
    if (state.outcome === "won") successes++;
  }
  return successes / SAMPLE_BUDGET;
}
function canonicalKey(level) {
  const width = level.width;
  const height = level.height;
  const transforms =
    width === height
      ? [
          (x, y) => [x, y],
          (x, y) => [width - 1 - x, y],
          (x, y) => [x, height - 1 - y],
          (x, y) => [width - 1 - x, height - 1 - y],
          (x, y) => [y, x],
          (x, y) => [width - 1 - y, x],
          (x, y) => [y, height - 1 - x],
          (x, y) => [width - 1 - y, height - 1 - x],
        ]
      : [
          (x, y) => [x, y],
          (x, y) => [width - 1 - x, y],
          (x, y) => [x, height - 1 - y],
          (x, y) => [width - 1 - x, height - 1 - y],
        ];
  return transforms
    .map((transform) => {
      const colours = new Map();
      const board = [];
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          const [sx, sy] = transform(x, y);
          const cell = sy * width + sx;
          const gem = level.board[cell];
          if (!gem) board.push(null);
          else {
            if (!colours.has(gem.colour)) colours.set(gem.colour, colours.size);
            board.push([colours.get(gem.colour), gem.kind ?? "normal"]);
          }
        }
      const goals = level.challenge.goals
        .map((goal) => (goal.kind === "collect" ? { ...goal, colour: colours.get(goal.colour) } : goal))
        .sort((a, b) => stable(a).localeCompare(stable(b)));
      const seals = (level.challenge.seals ?? [])
        .map((seal) => {
          const [x, y] = [seal.cell % width, Math.floor(seal.cell / width)];
          const [tx, ty] = transform(x, y);
          return { cell: ty * width + tx, layers: seal.layers };
        })
        .sort((a, b) => a.cell - b.cell);
      return stable({ width, height, board, moveLimit: level.challenge.moveLimit, goals, seals });
    })
    .sort()[0];
}
function scoreLevel(level) {
  const choices = measureChoices(level.options);
  const successRate = sampledSuccessRate(level.options, level.id);
  const objectives = level.challenge.goals.length;
  const witnessMoves = level.challenge.moveLimit;
  const requiredChain = level.challenge.goals.find((goal) => goal.kind === "chain")?.target ?? 1;
  const sealDepth = (level.challenge.seals ?? []).reduce((sum, seal) => sum + seal.layers, 0);
  const coordination = Math.min(1, (objectives - 1) / 2 + sealDepth / 6);
  const events = level.witnessEvents;
  const specialCreations = events.filter((event) => event.type === "special-created").length;
  const specialActivations = events.filter((event) => event.type === "special-activated").length;
  const specialCombinations = events.filter((event) => event.type === "special-combination").length;
  const score =
    GRADING_WEIGHTS.seededPlayoutDifficulty * (1 - successRate) +
    GRADING_WEIGHTS.choiceDifficulty * (1 - choices.initialProgressingShare) +
    GRADING_WEIGHTS.objectiveCoordination * coordination +
    GRADING_WEIGHTS.chainDepth * Math.min(1, (requiredChain - 1) / 2) +
    GRADING_WEIGHTS.witnessLength * Math.min(1, (witnessMoves - 1) / 5) +
    GRADING_WEIGHTS.specialCombination * Math.min(1, specialCombinations);
  return {
    ...choices,
    seededPlayoutSamples: SAMPLE_BUDGET,
    seededPlayoutSuccessRate: Number(successRate.toFixed(6)),
    objectiveCount: objectives,
    requiredChainDepth: requiredChain,
    sealLayers: sealDepth,
    witnessMoves,
    planningLength: witnessMoves,
    specialCreations,
    specialActivations,
    specialCombinations,
    difficultyScore: Math.round(score * 100) / 100,
  };
}
function makeLevel(path, category, position) {
  const options = optionsFor(path, category);
  const id = `swap-${hash(stable({ seed: path.seed, challenge: options.challenge })).slice(0, 12)}`;
  const witness = path.moves.flatMap((action) => [
    { kind: "action", action },
    { kind: "ticks", count: 3600 },
  ]);
  const proven = validateChallengeWitness(options, witness);
  if (!proven.valid) return null;
  const board = createGame(options).board;
  const level = {
    id,
    number: 0,
    title: { en: NAMES[category][position], ja: NAMES_JA[category][position] },
    options,
    width: 6,
    height: 6,
    colourCount: 5,
    seed: path.seed,
    challenge: options.challenge,
    witness,
    witnessEvents: path.eventsByMove.flat(),
    canonicalKeyHash: "",
    tags: [
      category,
      ...(path.length >= 4 ? ["multi-move-planning"] : []),
      ...(path.state.bestChain > 1 ? ["cascade"] : []),
      ...(path.eventsByMove.flat().some((event) => event.type === "special-created") ? ["special-creation"] : []),
      ...(path.eventsByMove.flat().some((event) => event.type === "special-combination")
        ? ["special-combination"]
        : []),
    ],
    rawMetrics: {},
    difficultyScore: 0,
    difficultyMarks: 1,
    gradingVersion: GRADING_VERSION,
    proofStatus: "engine-witness-verified",
    reviewStatus: "human-review-pending",
  };
  level.canonicalKeyHash = hash(canonicalKey({ ...level, board }));
  level.rawMetrics = scoreLevel(level);
  level.difficultyScore = level.rawMetrics.difficultyScore;
  level.difficultyMarks = Math.min(5, 1 + Math.floor(level.difficultyScore / 20));
  delete level.witnessEvents;
  return level;
}
export function makeCandidate(seed, length, category, position) {
  const path = createPath(seed, length, category, position);
  return path ? makeLevel(path, category, position) : null;
}
