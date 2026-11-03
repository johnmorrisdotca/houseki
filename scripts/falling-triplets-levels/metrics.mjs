import { createHash } from "node:crypto";
import { advanceTicks, applyAction, createChallenge } from "../../dist/falling-triplets.js";
import { GRADING_VERSION, SAMPLE_BUDGET } from "../falling-triplets-levels.mjs";
import { cell, rng } from "./boards.mjs";

export function canonicalDuplicateKey(level) {
  const variants = [];
  for (const mirror of [false, true]) {
    const map = new Map();
    const label = (colour) => {
      if (!map.has(colour)) map.set(colour, map.size);
      return map.get(colour);
    };
    const board = [];
    for (let y = 0; y < level.height; y++)
      for (let px = 0; px < level.width; px++) {
        const x = mirror ? level.width - 1 - px : px;
        const gem = level.board[cell(x, y, level.width)];
        board.push(gem ? [label(gem.colour), !!gem.target] : null);
      }
    const queue = level.queue.map((piece) => piece.map(label));
    const goal =
      level.goal.type === "targets" ? { type: "targets", targetCount: level.goal.targetIds.length } : level.goal;
    variants.push(JSON.stringify([level.width, level.height, level.colourCount, goal, board, queue]));
  }
  return variants.sort()[0];
}
function actionsToPlacement(state, x, orientation) {
  let next = state;
  while (next.active.x !== x) {
    const move = applyAction(next, { kind: x < next.active.x ? "left" : "right" });
    if (!move.accepted) return null;
    next = move.state;
  }
  const cycles = (orientation - next.active.orientation + 3) % 3;
  for (let i = 0; i < cycles; i++) {
    const step = applyAction(next, { kind: "cycle-forward" });
    if (!step.accepted) return null;
    next = step.state;
  }
  const placed = applyAction(next, { kind: "hard-drop" });
  return placed.accepted ? placed.state : null;
}
function markedAxes(state) {
  if (state.phase !== "clear-mark" || !state.pendingClear?.length) return new Set();
  const width = state.settings.width;
  const totalHeight = state.settings.height + 3;
  const marked = new Set(state.pendingClear);
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];
  const axes = new Set();
  for (const index of marked) {
    const x = index % width;
    const y = Math.floor(index / width);
    const colour = state.board[index]?.colour;
    if (!colour) continue;
    for (let direction = 0; direction < directions.length; direction++) {
      const [dx, dy] = directions[direction];
      let count = 1;
      for (const sign of [-1, 1]) {
        let nx = x + dx * sign;
        let ny = y + dy * sign;
        while (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < totalHeight &&
          state.board[cell(nx, ny, width)]?.colour === colour
        ) {
          count++;
          nx += dx * sign;
          ny += dy * sign;
        }
      }
      if (count >= 3) axes.add(direction);
    }
  }
  return axes;
}
function settleWithMetrics(state, targetIds = []) {
  let next = state;
  let budget = 0;
  let directions = 0;
  let targetCrossing = false;
  while (["clear-mark", "clear-remove", "gravity"].includes(next.phase) && budget++ < 100_000) {
    const axes = markedAxes(next);
    directions = Math.max(directions, axes.size);
    if (axes.size >= 2 && targetIds.some((id) => next.pendingClear?.some((index) => next.board[index]?.id === id)))
      targetCrossing = true;
    next = advanceTicks(next, 1).state;
  }
  return { state: next, directions, targetCrossing };
}
function settle(state) {
  return settleWithMetrics(state).state;
}
export function simulateWitness(level, pieces) {
  let state = createChallenge({
    seed: level.seed,
    width: level.width,
    height: level.height,
    colourCount: level.colourCount,
    board: level.board,
    queue: level.queue,
    goal: level.goal,
  });
  let directions = 0;
  let targetCrossing = false;
  const steps = [];
  for (let i = 0; i < pieces; i++) {
    const result = actionsToPlacement(state, level.witness[i].x, level.witness[i].orientation);
    if (!result) return null;
    const settled = settleWithMetrics(result, level.goal.type === "targets" ? level.goal.targetIds : []);
    state = settled.state;
    directions = Math.max(directions, settled.directions);
    targetCrossing ||= settled.targetCrossing;
    steps.push({ state, waves: state.waves });
    if (state.phase === "won") return { state, directions, targetCrossing, steps };
    if (state.phase !== "falling") return null;
  }
  return { state, directions, targetCrossing, steps };
}
function playWitnessPrefix(level, pieces) {
  return simulateWitness(level, pieces)?.state ?? null;
}
function followSuffix(state, level, start) {
  let current = state;
  for (let i = start; i < level.witness.length; i++) {
    if (current.phase === "won") return current;
    if (current.phase !== "falling") return current;
    current = actionsToPlacement(current, level.witness[i].x, level.witness[i].orientation);
    if (!current) return null;
    current = settle(current);
  }
  return current;
}
function probedChoiceMetrics(level) {
  const budgets = [];
  const successful = [];
  let forced = 0;
  for (let i = 0; i < level.witness.length; i++) {
    const state = playWitnessPrefix(level, i);
    if (state?.phase !== "falling") break;
    let legal = 0;
    let wins = 0;
    for (let x = 0; x < level.width; x++)
      for (let orientation = 0; orientation < 3; orientation++) {
        const result = actionsToPlacement(state, x, orientation);
        if (!result) continue;
        legal++;
        const final = followSuffix(settle(result), level, i + 1);
        if (final?.phase === "won") wins++;
      }
    budgets.push(legal);
    successful.push(wins);
    if (wins <= 1) forced++;
  }
  const goalPreservingChoices = successful.reduce((a, b) => a + b, 0);
  const probedChoices = budgets.reduce((a, b) => a + b, 0);
  return {
    legalChoiceBreadth: budgets.length ? budgets.reduce((a, b) => a + b, 0) / budgets.length : 0,
    goalPreservingChoices,
    probedChoices,
    goalPreservingChoiceShare: probedChoices ? goalPreservingChoices / probedChoices : 0,
    forcedChoiceShare: budgets.length ? forced / budgets.length : 1,
  };
}
function trialRandomPlay(level, seed) {
  const random = rng(seed);
  let state = createChallenge({
    seed: level.seed,
    width: level.width,
    height: level.height,
    colourCount: level.colourCount,
    board: level.board,
    queue: level.queue,
    goal: level.goal,
  });
  while (state.phase === "falling" && state.active) {
    const x = Math.floor(random() * level.width);
    const orientation = Math.floor(random() * 3);
    const placed = actionsToPlacement(state, x, orientation);
    if (placed) state = settle(placed);
    else {
      const fallback = actionsToPlacement(state, state.active.x, state.active.orientation);
      if (!fallback) return false;
      state = settle(fallback);
    }
  }
  return state.phase === "won";
}
export function metricRaw(level) {
  let successes = 0;
  for (let sample = 0; sample < SAMPLE_BUDGET; sample++)
    if (trialRandomPlay(level, `${GRADING_VERSION}|${level.id}|${sample}`)) successes++;
  const choices = probedChoiceMetrics(level);
  const witnessRun = simulateWitness(level, level.witness.length);
  const witnessFinal = witnessRun?.state;
  const payoffPieces = witnessFinal?.phase === "won" ? witnessFinal.completedPieces : level.witness.length;
  return {
    seededGoalSuccesses: successes,
    seededGoalSamples: SAMPLE_BUDGET,
    seededGoalSuccessRate: successes / SAMPLE_BUDGET,
    ...choices,
    setupPiecesBeforePayoff: Math.max(0, payoffPieces - 1),
    requiredChainDepth:
      level.goal.type === "chain" ? level.goal.minimumChain : Math.max(1, witnessFinal?.maxChain ?? 1),
    witnessPlanningLength: level.witness.length,
    payoffDirections: witnessRun?.directions ?? 0,
  };
}
export function percentile(values, value) {
  const less = values.filter((item) => item < value).length;
  const equal = values.filter((item) => item === value).length;
  return values.length <= 1 ? 0 : (less + (equal - 1) / 2) / (values.length - 1);
}
export function hashId(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 12);
}
