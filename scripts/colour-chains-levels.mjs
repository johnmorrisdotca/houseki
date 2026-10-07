import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { applyAction, advanceTicks, createChallenge } from '../dist/colour-chains.js';
import { initialChallengeState } from '../dist/colour-chains/engine.js';
import { advancedShizenPrototypes, arashiCausalPrototype, arashiThreeTargetPrototype, arashiConstructionBlueprints, arashiGuardGatePrototypes, arashiTallTowerPrototypes, arashiWideGuardPrototypes, shizenConstructionBlueprints, shizenFourWaveLayouts, shizenFourWaveRestorePrototype } from './nature-campaign-levels.mjs';

export const GENERATION_REVISION = 'colour-chains-campaign-1.3.1';
export const GRADING_VERSION = 'chains-placement-forgiveness-1';
export const NATURE_GENERATION_REVISION = 'colour-chains-nature-campaign-3.4.0';
export const NATURE_GRADING_VERSION = 'chains-nature-decision-evidence-7';
export const SAMPLE_BUDGET = 64;
export const GRADING_FORMULA = 'raw=0.18*(1-fullPlanSuccessRate)+0.28*consequentialDecisionShare+0.30*setupDeviationLossShare+0.12*goalCoordinationShare+0.06*cascadeShare+0.06*weatherDependency; score=clamp(1+round(99*raw),1,100)';
const WIDTH = 6, HEIGHT = 12, COLOURS = ['red', 'blue', 'green', 'gold'];
const SHAPES = [
  { tag: 'horizontal-link', cells: [[0, 11], [1, 11], [2, 11]] },
  { tag: 'corner-link', cells: [[0, 11], [1, 11], [1, 10]] },
  { tag: 'vertical-link', cells: [[0, 11], [0, 10], [0, 9]] },
  { tag: 'split-link', cells: [[0, 11], [1, 10], [2, 10]] },
  { tag: 'stepped-link', cells: [[0, 11], [1, 10], [1, 9]] }
];
const cell = (x, y) => y * WIDTH + x;
const hash = value => createHash('sha256').update(value).digest('hex');
function rng(seed) {
  let value = Number.parseInt(hash(String(seed)).slice(0, 8), 16) || 1;
  return () => { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) / 0x1_0000_0000; };
}
function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.freeze(value); for (const item of Object.values(value)) deepFreeze(item); }
  return value;
}
function scoreFor(metrics) {
  const score = 35 * (1 - metrics.seededPlayoutSuccessRate)
    + 10 * metrics.forcedPlacementShare
    + 10 * Math.min(1, Math.max(0, (metrics.requiredChainDepth - 1) / 2))
    + 10 * Math.min(1, metrics.splitLandingDependencies)
    + 8 * Math.min(1, metrics.requiredRotations)
    + 12 * Math.min(1, metrics.requiredSetupPairs / 2)
    + 5 * Math.min(1, Math.max(0, (metrics.planningLength - 1) / 2));
  return Math.round(Math.max(0, Math.min(100, score)) * 100) / 100;
}
const placementDirections = ['up', 'right', 'down', 'left'];
function placePair(start, placement) {
  let state = start; const events = [];
  const act = kind => { const result = applyAction(state, { kind }); if (!result.accepted) return false; state = result.state; events.push(...result.events); return true; };
  for (let safety = 0; state.active && state.active.pivot.x !== placement.pivotX && safety < 20; safety++) if (!act(state.active.pivot.x < placement.pivotX ? 'right' : 'left')) return null;
  for (let turns = 0; state.active?.orientation !== placement.orientation && turns < 4; turns++) if (!act('rotate-clockwise')) return null;
  if (!state.active || state.active.orientation !== placement.orientation || !act('hard-drop')) return null;
  let work = 0;
  while (['clear-mark', 'clear-remove', 'gravity'].includes(state.phase) && work < 100_000) {
    const tick = advanceTicks(state, 3600); state = tick.state; events.push(...tick.events); work += 3600;
  }
  return { state, events };
}
function playPlan(start, plan) {
  let state = start; const events = [];
  for (const placement of plan) {
    if (state.phase !== 'falling') break;
    const outcome = placePair(state, placement); if (!outcome) return null;
    state = outcome.state; events.push(...outcome.events);
  }
  return { state, events };
}
function weatherTrace(events, source) {
  const targets = new Set(source.goal.kind === 'clear-targets' ? source.goal.targetIds : []);
  return events.flatMap(event => {
    if (event.type === 'weather-triggered') return [{ kind: event.kind, turn: event.turn }];
    if (event.type === 'jumble-completed') return [{ kind: 'jumble-result', changed: event.changed === true, patchCells: [...(event.patchCells ?? [])].sort((a, b) => a - b), moves: (event.moves ?? []).map(move => [move.from.x, move.from.y, move.to.x, move.to.y, targets.has(move.id)]).sort((a, b) => a[1] - b[1] || a[0] - b[0]) }];
    if (event.type === 'lightning-struck') return [{ kind: 'lightning-result', columns: [...(event.columns ?? [])].sort((a, b) => a - b), removedCells: [...(event.removedCells ?? [])].sort((a, b) => a - b), removedTargetCells: (event.removedIds ?? []).flatMap((id, index) => targets.has(id) ? [event.removedCells[index]] : []).sort((a, b) => a - b) }];
    return [];
  });
}
function playRandomLegalPlan(start, random) {
  let state = start, placements = 0, maxChainDepth = 1;
  const width = state.settings.width;
  const choices = Array.from({ length: width * 4 }, (_, index) => ({ pivotX: Math.floor(index / 4), orientation: placementDirections[index % 4] }));
  while (state.phase === 'falling' && placements < (state.settings.queue?.length ?? 12)) {
    const order = [...choices];
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    let next = null;
    for (const placement of order) {
      const placed = placePair(state, placement);
      if (placed) { next = placed; break; }
    }
    if (!next) break;
    state = next.state; placements++;
    maxChainDepth = Math.max(maxChainDepth, state.maxChain);
  }
  return { state, placements, maxChainDepth };
}
function canonicalNatureKey(level) {
  const variants = [];
  for (const mirror of [false, true]) {
    const labels = new Map(); const label = colour => { if (!labels.has(colour)) labels.set(colour, labels.size); return labels.get(colour); };
    const board = [];
    for (let y = 0; y < level.height; y++) for (let px = 0; px < level.width; px++) {
      const x = mirror ? level.width - 1 - px : px; const gem = level.board[y * level.width + x];
      board.push(gem ? [label(gem.colour), Boolean(gem.magnetic), level.goal.kind === 'clear-targets' && level.goal.targetIds.includes(gem.id)] : null);
    }
    const queue = level.queue.map(pair => pair.map(label));
    const goal = level.goal.kind === 'clear-targets' ? { kind: 'clear-targets', targets: level.goal.targetIds.map(id => {
      const at = level.board.findIndex(gem => gem?.id === id), x = at % level.width; return Math.floor(at / level.width) * level.width + (mirror ? level.width - 1 - x : x);
    }).sort((a, b) => a - b) } : level.goal;
    // Identity is normalized puzzle geometry plus its fixed mechanics. The
    // seed and witnessed weather trace remain replay evidence, not uniqueness.
    variants.push(JSON.stringify([level.width, level.height, level.colourCount, level.weather ?? '', goal, board, queue, level.magneticQueue ?? []]));
  }
  return variants.sort()[0];
}
function targetComponentCount(source) {
  if (source.goal.kind !== 'clear-targets') return 0;
  const remaining = new Set(source.goal.targetIds.map(id => source.board.findIndex(gem => gem?.id === id)).filter(index => index >= 0));
  let count = 0;
  while (remaining.size) {
    count++;
    const queue = [remaining.values().next().value]; const colour = source.board[queue[0]]?.colour; remaining.delete(queue[0]);
    while (queue.length) {
      const at = queue.pop(), x = at % source.width, y = Math.floor(at / source.width);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nx < 0 || nx >= source.width || ny < 0 || ny >= source.height) continue;
        const next = ny * source.width + nx;
        if (remaining.has(next) && source.board[next]?.colour === colour) { remaining.delete(next); queue.push(next); }
      }
    }
  }
  return count;
}
function targetColourCount(source) {
  if (source.goal.kind !== 'clear-targets') return 0;
  return new Set(source.goal.targetIds.map(id => source.board.find(gem => gem?.id === id)?.colour).filter(Boolean)).size;
}
function natureMetrics(source, options, witness, events, scoreData = {}) {
  const sampleBudget = scoreData.sampleBudget ?? SAMPLE_BUDGET;
  const placements = [];
  for (let pivotX = 0; pivotX < source.width; pivotX++) for (const orientation of placementDirections) placements.push({ pivotX, orientation });
  const measurementKey = canonicalNatureKey({ width: source.width, height: source.height, colourCount: source.colourCount, board: options.board, queue: source.queue, goal: source.goal, nature: options.nature, weather: options.weather, magneticQueue: options.magneticQueue });
  const measurementId = hash(measurementKey).slice(0, 12);
  const initial = (() => { try { return createChallenge({ id: `probe-${measurementId}`, seed: options.seed, width: source.width, height: source.height, colourCount: source.colourCount, board: options.board, queue: source.queue, goal: source.goal, witness, nature: options.nature, ...(options.weather ? { weather: options.weather } : {}), ...(options.magneticQueue ? { magneticQueue: options.magneticQueue } : {}) }); } catch { return null; } })();
  let legalPlacements = 0, wins = 0;
  let requiredSetupPairs = 0, setupDependencyProbes = 0, setupDependencyFails = 0, setupDeviationProbes = 0, setupDeviationLosses = 0;
  let deviationProbes = 0, deviationWins = 0, branchingPoints = 0, forcedSafeSteps = 0, deadEndDeviations = 0;
  if (initial) for (let index = 0; index < witness.length; index++) {
    let prefix = initial;
    for (const step of witness.slice(0, index)) {
      const placed = placePair(prefix, step);
      if (!placed) { prefix = null; break; }
      prefix = placed.state;
    }
    if (!prefix || prefix.phase !== 'falling') continue;
    let alternatives = 0, alternativeWins = 0;
    for (const placement of placements) {
      if (placement.pivotX === witness[index].pivotX && placement.orientation === witness[index].orientation) continue;
      const placed = placePair(prefix, placement); if (!placed) continue;
      alternatives++; deviationProbes++;
      const suffix = placed.state.phase === 'falling' ? playPlan(placed.state, witness.slice(index + 1)) : { state: placed.state, events: [] };
      if (suffix?.state.phase === 'won') { alternativeWins++; deviationWins++; } else deadEndDeviations++;
      if (index < witness.length - 1) { setupDeviationProbes++; if (suffix?.state.phase !== 'won') setupDeviationLosses++; }
    }
    const actual = placePair(prefix, witness[index]);
    if (!actual) continue;
    legalPlacements += alternatives + 1;
    const actualSuffix = actual.state.phase === 'falling' ? playPlan(actual.state, witness.slice(index + 1)) : { state: actual.state, events: [] };
    if (actualSuffix?.state.phase === 'won') wins++;
    if (alternativeWins > 0 && alternatives - alternativeWins > 0) branchingPoints++;
    if (alternativeWins === 0) forcedSafeSteps++;
    if (alternatives && index < witness.length - 1) {
      setupDependencyProbes++;
      if (alternativeWins === 0) { setupDependencyFails++; requiredSetupPairs++; }
    }
  }
  const random = rng(`${NATURE_GENERATION_REVISION}|full-plans|${measurementId}`); let successes = 0, fullPlanPlacements = 0, observedPotentialChainDepth = 1;
  const witnessedChainDepth = Math.max(1, ...events.filter(event => event.type === 'cells-cleared').map(event => event.chain ?? 1));
  if (initial) for (let i = 0; i < sampleBudget; i++) {
    const run = playRandomLegalPlan(initial, random);
    if (run.state.phase === 'won') successes++;
    fullPlanPlacements += run.placements; observedPotentialChainDepth = Math.max(observedPotentialChainDepth, run.maxChainDepth);
  }
  const featureEvent = events.find(event => event.type === 'power-drop-landed' && event.rebound) ?? events.find(event => event.type === 'magnetic-pulse' && event.moves?.length);
  const setupPairs = Math.max(0, witness.length - 1);
  const successRate = Number((successes / sampleBudget).toFixed(6));
  const forcedSafeShare = witness.length ? forcedSafeSteps / witness.length : 0;
  const branchingShare = witness.length ? branchingPoints / witness.length : 0;
  const mechanicOffKind = options.weather ? 'weather' : (events.some(event => event.type === 'magnetic-pulse' && event.moves?.length) ? 'magnetism' : 'nature');
  const consequence = playCounterfactual(options, source, witness, mechanicOffKind);
  const weatherDependency = options.weather && consequence?.state.phase !== 'won' ? 1 : 0;
  // Ordinary clear goals with multiple disconnected stones of one colour are
  // still a single ordinary match objective. Scheduled weather can expose
  // separated target groups independently, so its spatial components count.
  const goalComponents = source.goal.kind === 'clear-targets'
    ? (options.weather ? targetComponentCount(source) : targetColourCount(source))
    : 0;
  const goalDependencyCount = source.goal.kind === 'minimum-chain' ? source.goal.chain : goalComponents;
  const goalCoordinationShare = source.goal.kind === 'minimum-chain'
    ? Math.min(1, Math.max(0, (source.goal.chain - 1) / 3))
    : Math.min(1, Math.max(0, (goalComponents - 1) / 2));
  const occupiedCells = options.board.filter(Boolean).length, usableCells = source.width * source.height;
  const requiredChainDepth = source.goal.kind === 'minimum-chain' ? source.goal.chain : (scoreData.requiredChainDepth ?? 1);
  const cascadeShare = Math.min(1, Math.max(0, (requiredChainDepth - 1) / 2));
  const consequentialDecisionShare = deviationProbes ? deadEndDeviations / deviationProbes : 0;
  const verifiedSetupDependencyShare = setupDependencyProbes ? setupDependencyFails / setupDependencyProbes : 0;
  const setupDeviationLossShare = setupDeviationProbes ? setupDeviationLosses / setupDeviationProbes : 0;
  const rawDifficultyScore = Math.max(0, Math.min(1,
    0.18 * (1 - successRate)
    + 0.28 * consequentialDecisionShare
    + 0.30 * setupDeviationLossShare
    + 0.12 * goalCoordinationShare
    + 0.06 * cascadeShare
    + 0.06 * weatherDependency
  ));
  const score = Math.max(1, Math.min(100, 1 + Math.round(rawDifficultyScore * 99)));
  const rawMetrics = {
    placementProbes: placements.length * witness.length, legalPlacements, goalPreservingPlacements: wins,
    forcedPlacementShare: witness.length ? forcedSafeSteps / witness.length : 0,
    seededPlayoutSamples: sampleBudget, seededPlayoutQueueDepth: source.queue.length,
    seededPlayoutVariablePrefixLength: source.queue.length, seededPlayoutFixedSuffixLength: 0,
    seededPlayoutPlacements: fullPlanPlacements, seededPlayoutSuccesses: successes, seededPlayoutSuccessRate: successRate,
    fullPlanSuccessRate: successRate, witnessedPlanPlacements: witness.length,
    singleStepDeviationProbes: deviationProbes, singleStepDeviationWins: deviationWins,
    singleStepDeviationDeadEnds: deadEndDeviations, branchingDecisionPoints: branchingPoints,
    forcedSafeSteps, forcedSafeShare, branchingShare, consequentialDecisionShare, verifiedSetupDependencyShare, setupDeviationProbes, setupDeviationLosses, setupDeviationLossShare,
    setupPairsBeforePayoff: setupPairs, requiredSetupPairs,
    verifiedSetupDependencies: setupDependencyFails,
    setupDependencyProbeSteps: setupDependencyProbes,
    requiredChainDepth,
    witnessedChainDepth,
    observedPotentialChainDepth,
    requiredRotations: witness.filter(step => step.orientation !== 'up' && step.orientation !== 'down').length + 2 * witness.filter(step => step.orientation === 'down').length,
    requiredWallKicks: events.filter(event => event.type === 'pair-rotated' && (event.kick?.x || event.kick?.y)).length,
    splitLandingDependencies: scoreData.splitLandingDependencies ?? 0, goalTargets: source.goal.kind === 'clear-targets' ? source.goal.targetIds.length : 0, goalDependencyCount,
    occupiedCells, usableCells, boardCoverage: Number((occupiedCells / usableCells).toFixed(6)),
    goalCoordinationShare, cascadeShare, weatherEventCount: events.filter(event => event.type === 'weather-triggered').length,
    weatherDependency, mechanicOffCounterfactualWon: consequence?.state.phase === 'won', mechanicOffCounterfactualKind: mechanicOffKind, mechanicOffCounterfactualPhase: consequence?.state.phase ?? 'invalid', planningLength: witness.length
  };
  return { rawMetrics, rawDifficultyScore, score, featureEvent };
}
export function authoredLevel(source, prefix, number, options, witness, events, scoreData = {}) {
  let measured = natureMetrics(source, options, witness, events, scoreData);
  if (measured.score >= 81 && scoreData.sampleBudget === undefined) measured = natureMetrics(source, options, witness, events, { ...scoreData, sampleBudget: 256 });
  const featureTag = events.some(event => event.type === 'magnetic-pulse' && event.moves?.length) ? 'magnetic-attraction' : 'rebound';
  const level = {
    id: '', number, title: options.title, objective: options.objective,
    canonicalKeyHash: '', width: source.width, height: source.height, colourCount: source.colourCount,
    seed: options.seed, board: options.board, queue: source.queue, goal: source.goal, witness,
    tags: [...new Set([...source.tags.filter(tag => ['rotation', 'split-landing', 'two-wave-chain', 'setup-dependency', 'gravity-setup'].includes(tag)), featureTag, ...(options.weather ? ['jumble', 'lightning'] : [])])],
    rawMetrics: measured.rawMetrics, rawDifficultyScore: measured.rawDifficultyScore, score: measured.score, marks: Math.min(5, 1 + Math.floor((measured.score - 1) / 20)),
    gradingVersion: NATURE_GRADING_VERSION, normalizationCategory: `${prefix}-${source.width}x${source.height}-finite-v3`, proofStatus: 'engine-witness-verified', reviewStatus: 'human-review-pending', nature: true,
    ...(options.weather ? { weather: options.weather, weatherTrace: weatherTrace(events, source) } : {}), ...(options.magneticQueue ? { magneticQueue: options.magneticQueue } : {})
  };
  const key = canonicalNatureKey(level); level.canonicalKeyHash = hash(key); level.id = `${prefix}-${hash(key).slice(0, 12)}`;
  return { level, key };
}
function initialBoard(serial) {
  const random = rng(`${GENERATION_REVISION}|board|${serial}`);
  const shape = SHAPES[serial % SHAPES.length]; const shift = Math.floor(random() * (WIDTH - 3));
  const targetColour = COLOURS[Math.floor(random() * COLOURS.length)];
  const board = Array(WIDTH * HEIGHT).fill(null); const targets = new Set();
  for (const [dx, y] of shape.cells) { const at = cell(shift + dx, y); board[at] = targetColour; targets.add(at); }
  const targetColumns = new Set([...targets].map(at => at % WIDTH));
  const openApproaches = new Set();
  for (const at of targets) {
    const x = at % WIDTH, y = Math.floor(at / WIDTH);
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx >= 0 && nx < WIDTH && ny >= 0 && ny < HEIGHT && !targets.has(cell(nx, ny))) openApproaches.add(nx);
    }
  }
  // Add only stable supports and side stacks; each is checked before selection.
  const safeColours = COLOURS.filter(colour => colour !== targetColour);
  for (let x = 0; x < WIDTH; x++) {
    const topTarget = Math.min(...[...targets].filter(at => at % WIDTH === x).map(at => Math.floor(at / WIDTH)), HEIGHT);
    if (topTarget < HEIGHT) {
      for (let y = topTarget + 1; y < HEIGHT; y++) if (!board[cell(x, y)]) board[cell(x, y)] = safeColours[(x + y + serial) % safeColours.length];
    } else if (!targetColumns.has(x) && !openApproaches.has(x)) {
      const stackHeight = Math.floor(random() * 7);
      for (let y = HEIGHT - stackHeight; y < HEIGHT; y++) board[cell(x, y)] = safeColours[Math.floor(random() * safeColours.length)];
    }
  }
  return { board, targets: [...targets].sort((a, b) => a - b), targetColour, shape: shape.tag };
}
function withIds(colours) {
  let id = 1;
  return colours.map(colour => colour ? { id: id++, colour } : null);
}
function hasInitialMatch(board) {
  const seen = new Set();
  for (let index = 0; index < board.length; index++) {
    if (!board[index] || seen.has(index)) continue;
    const queue = [index], colour = board[index], cells = []; seen.add(index);
    while (queue.length) {
      const at = queue.pop(); cells.push(at); const x = at % WIDTH, y = Math.floor(at / WIDTH);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const next = ny * WIDTH + nx;
        if (nx >= 0 && nx < WIDTH && ny >= 0 && ny < HEIGHT && !seen.has(next) && board[next] === colour) { seen.add(next); queue.push(next); }
      }
    }
    if (cells.length >= 4) return true;
  }
  return false;
}
function stableColumns(board) {
  for (let x = 0; x < WIDTH; x++) { let gap = false; for (let y = HEIGHT - 1; y >= 0; y--) { if (!board[cell(x, y)]) gap = true; else if (gap) return false; } }
  return true;
}
function playPlacement(start, placement) {
  let state = start; const events = [];
  const act = kind => { const result = applyAction(state, { kind }); if (!result.accepted) return false; state = result.state; events.push(...result.events); return true; };
  while (state.active.pivot.x !== placement.pivotX) if (!act(state.active.pivot.x < placement.pivotX ? 'right' : 'left')) return null;
  const orientationIndex = { up: 0, right: 1, down: 2, left: 3 };
  for (let turns = 0; turns < (orientationIndex[placement.orientation] + 4) % 4; turns++) if (!act('rotate-clockwise')) return null;
  if (!act('hard-drop')) return null;
  let work = 0;
  while (['clear-mark', 'clear-remove', 'gravity'].includes(state.phase) && work < 100_000) {
    const result = advanceTicks(state, 3600); state = result.state; events.push(...result.events); work += 3600;
  }
  return { state, events };
}
function canonicalKey(level) {
  const variants = [];
  for (const mirror of [false, true]) {
    const labels = new Map(); const label = colour => { if (!labels.has(colour)) labels.set(colour, labels.size); return labels.get(colour); };
    const board = [];
    for (let y = 0; y < level.height; y++) for (let px = 0; px < level.width; px++) {
      const x = mirror ? level.width - 1 - px : px; const gem = level.board[cell(x, y)];
      board.push(gem ? [label(gem.colour), level.goal.kind === 'clear-targets' && level.goal.targetIds.includes(gem.id)] : null);
    }
    const queue = level.queue.map(pair => pair.map(label));
    const goal = level.goal.kind === 'clear-targets' ? { kind: 'clear-targets', targets: level.goal.targetIds.map(id => {
      const at = level.board.findIndex(gem => gem?.id === id); const x = at % level.width; return Math.floor(at / level.width) * level.width + (mirror ? level.width - 1 - x : x);
    }).sort((a, b) => a - b) } : level.goal;
    variants.push(JSON.stringify([level.width, level.height, level.colourCount, goal, board, queue]));
  }
  return variants.sort()[0];
}
function candidate(serial) {
  const boardData = initialBoard(serial);
  if (!stableColumns(boardData.board) || hasInitialMatch(boardData.board)) return null;
  const board = withIds(boardData.board); const targetIds = boardData.targets.map(at => board[at].id);
  const otherColours = COLOURS.filter(colour => colour !== boardData.targetColour);
  const queue = [[boardData.targetColour, otherColours[0]], [otherColours[1], otherColours[2]]];
  const goal = { kind: 'clear-targets', targetIds };
  const base = { id: `candidate-${serial}`, width: WIDTH, height: HEIGHT, colourCount: 4, seed: `${GENERATION_REVISION}:${serial}`, board, queue, goal };
  let start = null; const placements = [];
  for (let pivotX = 0; pivotX < WIDTH; pivotX++) for (const orientation of ['up', 'right', 'down', 'left']) placements.push({ pivotX, orientation });
  for (const placement of placements) {
    try { start = createChallenge({ ...base, witness: [placement] }); break; } catch { /* Try the next legal winning placement as the proof. */ }
  }
  if (!start) return null;
  const wins = []; const all = [];
  for (const placement of placements) {
    const outcome = playPlacement(start, placement);
    if (outcome) { all.push({ placement, outcome }); if (outcome.state.phase === 'won') wins.push({ placement, outcome }); }
  }
  if (!wins.length || !all.length) return null;
  const random = rng(`${GENERATION_REVISION}|playouts|${serial}`); let successes = 0;
  for (let i = 0; i < SAMPLE_BUDGET; i++) if (all[Math.floor(random() * all.length)]?.outcome.state.phase === 'won') successes++;
  const witnessChoice = wins.reduce((best, item) => {
    const rotations = item.placement.orientation === 'up' ? 0 : item.placement.orientation === 'down' ? 2 : 1;
    const bestRotations = best.placement.orientation === 'up' ? 0 : best.placement.orientation === 'down' ? 2 : 1;
    return rotations + Math.abs(item.placement.pivotX - 2) < bestRotations + Math.abs(best.placement.pivotX - 2) ? item : best;
  });
  const placement = witnessChoice.placement; const event = witnessChoice.outcome.events.find(item => item.type === 'pair-locked');
  const cells = event?.cells ?? []; const ids = event?.ids ?? [];
  const settledY = ids.map((id, i) => witnessChoice.outcome.events.flatMap(item => item.type === 'cells-fell' ? item.cells : []).find(move => move.id === id)?.to.y ?? cells[i]?.y);
  const split = ['left', 'right'].includes(placement.orientation) && settledY.length === 2 && settledY[0] !== settledY[1];
  const requiredRotations = placement.orientation === 'up' ? 0 : placement.orientation === 'down' ? 2 : 1;
  const requiredWallKicks = witnessChoice.outcome.events.filter(item => item.type === 'pair-rotated' && (item.kick.x !== 0 || item.kick.y !== 0)).length;
  const metrics = {
    placementProbes: WIDTH * 4,
    legalPlacements: all.length,
    goalPreservingPlacements: wins.length,
    forcedPlacementShare: wins.length === 1 ? 1 : 0,
    seededPlayoutSamples: SAMPLE_BUDGET,
    seededPlayoutQueueDepth: 1,
    seededPlayoutSuccesses: successes,
    seededPlayoutSuccessRate: Number((successes / SAMPLE_BUDGET).toFixed(6)),
    setupPairsBeforePayoff: 0,
    requiredSetupPairs: 0,
    verifiedSetupDependencies: 0,
    requiredChainDepth: 1,
    requiredRotations,
    requiredWallKicks,
    splitLandingDependencies: split ? 1 : 0,
    planningLength: 1
  };
  const level = {
    id: `chains-${hash(JSON.stringify([boardData.board, boardData.targets, boardData.shape])).slice(0, 12)}`,
    number: 0,
    title: { en: `Linked stones: ${boardData.shape}`, ja: `つながる石：${({ 'horizontal-link': '横のつながり', 'corner-link': '角のつながり', 'vertical-link': '縦のつながり', 'split-link': '段差のつながり', 'stepped-link': '階段のつながり' })[boardData.shape]}` },
    canonicalKeyHash: '', width: WIDTH, height: HEIGHT, colourCount: 4,
    seed: `${GENERATION_REVISION}:${serial}`, board, queue, goal,
    witness: [placement], tags: [boardData.shape, ...(requiredRotations ? ['rotation'] : []), ...(split ? ['split-landing'] : [])],
    rawMetrics: metrics, score: 0, marks: 1, gradingVersion: GRADING_VERSION,
    proofStatus: 'engine-witness-verified', reviewStatus: 'human-review-pending'
  };
  level.canonicalKeyHash = hash(canonicalKey(level));
  level.score = scoreFor(metrics);
  level.marks = Math.min(5, 1 + Math.floor(level.score / 20));
  return { level, key: canonicalKey(level) };
}
function splitCandidate(serial) {
  const boardColours = Array(WIDTH * HEIGHT).fill(null); const row = 5 + (serial % 5); const shift = serial % 2;
  const targetIdsPositions = [];
  for (let x = shift; x < shift + 3; x++) { const at = cell(x, row); boardColours[at] = 'red'; targetIdsPositions.push(at); }
  const safe = ['blue', 'green', 'gold'];
  for (let x = shift; x < shift + 4; x++) for (let y = row + 1; y < HEIGHT; y++) boardColours[cell(x, y)] = safe[(x + y + serial) % safe.length];
  const satelliteX = shift + 4; const supportDepth = 1 + (serial % Math.max(1, HEIGHT - row - 1));
  for (let y = HEIGHT - supportDepth; y < HEIGHT; y++) boardColours[cell(satelliteX, y)] = safe[(y + serial + 1) % safe.length];
  const farX = shift === 0 ? 5 : 0; const farHeight = serial % 4;
  for (let y = HEIGHT - farHeight; y < HEIGHT; y++) boardColours[cell(farX, y)] = safe[(y * 2 + serial) % safe.length];
  if (!stableColumns(boardColours) || hasInitialMatch(boardColours)) return null;
  const board = withIds(boardColours); const targetIds = targetIdsPositions.map(at => board[at].id);
  const queue = [['red', 'blue'], ['green', 'gold']]; const goal = { kind: 'clear-targets', targetIds };
  const witness = { pivotX: shift + 3, orientation: 'right' };
  const base = { id: `split-${serial}`, width: WIDTH, height: HEIGHT, colourCount: 4, seed: `${GENERATION_REVISION}:split:${serial}`, board, queue, goal };
  let start;
  try { start = createChallenge({ ...base, witness: [witness] }); } catch { return null; }
  const legal = [], wins = [];
  for (let pivotX = 0; pivotX < WIDTH; pivotX++) for (const orientation of ['up', 'right', 'down', 'left']) {
    const placement = { pivotX, orientation }; const outcome = playPlacement(start, placement);
    if (!outcome) continue; legal.push(outcome); if (outcome.state.phase === 'won') wins.push({ placement, outcome });
  }
  const expected = wins.find(item => item.placement.pivotX === witness.pivotX && item.placement.orientation === witness.orientation);
  if (!expected || !legal.length) return null;
  const locked = expected.outcome.events.find(item => item.type === 'pair-locked');
  const finalY = locked.ids.map((id, index) => expected.outcome.events.flatMap(item => item.type === 'cells-fell' ? item.cells : []).find(move => move.id === id)?.to.y ?? locked.cells[index].y);
  if (finalY[0] === finalY[1]) return null;
  const randomPlayout = rng(`${GENERATION_REVISION}|split-samples|${serial}`); let successes = 0;
  for (let i = 0; i < SAMPLE_BUDGET; i++) if (legal[Math.floor(randomPlayout() * legal.length)]?.state.phase === 'won') successes++;
  const metrics = { placementProbes: WIDTH * 4, legalPlacements: legal.length, goalPreservingPlacements: wins.length, forcedPlacementShare: wins.length === 1 ? 1 : 0, seededPlayoutSamples: SAMPLE_BUDGET, seededPlayoutQueueDepth: 1, seededPlayoutSuccesses: successes, seededPlayoutSuccessRate: Number((successes / SAMPLE_BUDGET).toFixed(6)), setupPairsBeforePayoff: 0, requiredSetupPairs: 0, verifiedSetupDependencies: 0, requiredChainDepth: 1, requiredRotations: 1, requiredWallKicks: 0, splitLandingDependencies: 1, planningLength: 1 };
  const level = { id: `chains-${hash(JSON.stringify([boardColours, targetIdsPositions, 'split'])).slice(0, 12)}`, number: 0, title: { en: 'Split landing: close the row', ja: '段差着地：横一列を完成' }, canonicalKeyHash: '', width: WIDTH, height: HEIGHT, colourCount: 4, seed: base.seed, board, queue, goal, witness: [witness], tags: ['split-landing', 'rotation'], rawMetrics: metrics, score: scoreFor(metrics), marks: 1, gradingVersion: GRADING_VERSION, proofStatus: 'engine-witness-verified', reviewStatus: 'human-review-pending' };
  level.canonicalKeyHash = hash(canonicalKey(level)); level.marks = Math.min(5, 1 + Math.floor(level.score / 20));
  return { level, key: canonicalKey(level) };
}
function chainCandidate(serial) {
  const x = 2 + (serial % 2); const pattern = serial % 3;
  const reds = [
    [[x - 2, 11], [x - 1, 11], [x - 1, 10]],
    [[x - 1, 11], [x - 1, 10], [x - 2, 10]],
    [[x - 1, 11], [x - 2, 11], [x - 2, 10]]
  ][pattern];
  const colours = Array(WIDTH * HEIGHT).fill(null);
  for (const [rx, ry] of reds) colours[cell(rx, ry)] = 'red';
  for (const y of [9, 10, 11]) colours[cell(x, y)] = 'blue';
  // Stable alternating supports below any elevated red stones.
  for (const [rx, ry] of reds) for (let y = ry + 1; y < HEIGHT; y++) if (!colours[cell(rx, y)]) colours[cell(rx, y)] = (y + rx + serial) % 2 ? 'gold' : 'green';
  // Decorate a distant column to create board-specific space constraints without an initial match.
  const farX = x === 2 ? 5 : 0; const stackHeight = serial % 5;
  for (let y = HEIGHT - stackHeight; y < HEIGHT; y++) colours[cell(farX, y)] = (y + serial) % 2 ? 'green' : 'gold';
  if (!stableColumns(colours) || hasInitialMatch(colours)) return null;
  const board = withIds(colours); const queue = [['blue', 'red'], ['green', 'gold']];
  const goal = { kind: 'minimum-chain', chain: 2 }; const witness = { pivotX: x, orientation: 'up' };
  const base = { id: `chain-${serial}`, width: WIDTH, height: HEIGHT, colourCount: 4, seed: `${GENERATION_REVISION}:chain:${serial}`, board, queue, goal };
  let start;
  try { start = createChallenge({ ...base, witness: [witness] }); } catch { return null; }
  const legal = [], wins = [];
  for (let pivotX = 0; pivotX < WIDTH; pivotX++) for (const orientation of ['up', 'right', 'down', 'left']) {
    const placement = { pivotX, orientation }, outcome = playPlacement(start, placement);
    if (!outcome) continue; legal.push(outcome); if (outcome.state.phase === 'won') wins.push({ placement, outcome });
  }
  if (!wins.some(item => item.placement.pivotX === x && item.placement.orientation === 'up') || !legal.length) return null;
  const random = rng(`${GENERATION_REVISION}|chain-samples|${serial}`); let successes = 0;
  for (let i = 0; i < SAMPLE_BUDGET; i++) if (legal[Math.floor(random() * legal.length)]?.state.phase === 'won') successes++;
  const metrics = { placementProbes: WIDTH * 4, legalPlacements: legal.length, goalPreservingPlacements: wins.length, forcedPlacementShare: wins.length === 1 ? 1 : 0, seededPlayoutSamples: SAMPLE_BUDGET, seededPlayoutQueueDepth: 1, seededPlayoutSuccesses: successes, seededPlayoutSuccessRate: Number((successes / SAMPLE_BUDGET).toFixed(6)), setupPairsBeforePayoff: 0, requiredSetupPairs: 0, verifiedSetupDependencies: 0, requiredChainDepth: 2, requiredRotations: 0, requiredWallKicks: 0, splitLandingDependencies: 0, planningLength: 1 };
  const level = { id: `chains-${hash(JSON.stringify([colours, pattern, 'chain'])).slice(0, 12)}`, number: 0, title: { en: `Two-wave chain: ${pattern + 1}`, ja: `2段連鎖：${pattern + 1}` }, canonicalKeyHash: '', width: WIDTH, height: HEIGHT, colourCount: 4, seed: base.seed, board, queue, goal, witness: [witness], tags: ['two-wave-chain', 'gravity-setup'], rawMetrics: metrics, score: scoreFor(metrics), marks: 1, gradingVersion: GRADING_VERSION, proofStatus: 'engine-witness-verified', reviewStatus: 'human-review-pending' };
  level.canonicalKeyHash = hash(canonicalKey(level)); level.marks = Math.min(5, 1 + Math.floor(level.score / 20));
  return { level, key: canonicalKey(level) };
}
export function multiPairCandidate(serial) {
  const row = 5 + (serial % 3); const shift = Math.floor(serial / 3) % 3; const gapX = shift + 3;
  const colours = Array(WIDTH * HEIGHT).fill(null); const targetPositions = [];
  for (let x = shift; x < shift + 3; x++) { const at = cell(x, row); colours[at] = 'red'; targetPositions.push(at); }
  // Rows below the target form settled supports, but the missing target column starts short.
  const supportColour = new Map(); let previous = null;
  const initialSupportCount = HEIGHT - row - 1 - 4;
  const setupColours = new Map([[11 - initialSupportCount, 'blue'], [10 - initialSupportCount, 'green'], [9 - initialSupportCount, 'gold'], [8 - initialSupportCount, 'blue']]);
  for (let y = HEIGHT - 1; y > row; y--) {
    const pairColour = setupColours.get(y);
    let support = ['blue', 'green', 'gold'].find(colour => colour !== pairColour && colour !== previous);
    if (!support) support = ['blue', 'green', 'gold'].find(colour => colour !== pairColour) ?? 'blue';
    supportColour.set(y, support); previous = support;
    for (let x = shift; x < shift + 3; x++) colours[cell(x, y)] = support;
  }
  for (let i = 0; i < initialSupportCount; i++) {
    const y = HEIGHT - 1 - i; const forbidden = supportColour.get(y);
    colours[cell(gapX, y)] = ['blue', 'green', 'gold'].find(colour => colour !== forbidden && colour !== (i ? colours[cell(gapX, y + 1)] : null));
  }
  // Sparse side stacks vary the position problem while preserving an open setup column.
  const farX = gapX < 4 ? 5 : 0; const height = serial % 4;
  for (let y = HEIGHT - height; y < HEIGHT; y++) colours[cell(farX, y)] = ['blue', 'green', 'gold'][(y + serial) % 3];
  if (!stableColumns(colours) || hasInitialMatch(colours)) return null;
  const board = withIds(colours); const targetIds = targetPositions.map(at => board[at].id);
  const queue = [['blue', 'green'], ['gold', 'blue'], ['red', 'green']];
  const goal = { kind: 'clear-targets', targetIds };
  const witness = [{ pivotX: gapX, orientation: 'up' }, { pivotX: gapX, orientation: 'up' }, { pivotX: gapX, orientation: 'up' }];
  const base = { id: `setup-${serial}`, width: WIDTH, height: HEIGHT, colourCount: 4, seed: `${GENERATION_REVISION}:setup:${serial}`, board, queue, goal };
  let initial;
  try { initial = createChallenge({ ...base, witness }); } catch { return null; }
  let proofState = initial; const stateAtDecision = [];
  for (const step of witness) {
    stateAtDecision.push(proofState);
    const result = playPlacement(proofState, step); if (!result || result.state.phase === 'lost') return null;
    proofState = result.state;
  }
  if (proofState.phase !== 'won') return null;
  const dependencyIndices = [];
  for (let i = 0; i < 2; i++) {
    let invalidatingChange = false;
    for (let pivotX = 0; pivotX < WIDTH && !invalidatingChange; pivotX++) for (const orientation of ['up', 'right', 'down', 'left']) {
      if (pivotX === witness[i].pivotX && orientation === witness[i].orientation) continue;
      const changed = witness.map(step => ({ ...step })); changed[i] = { pivotX, orientation };
      try { createChallenge({ ...base, witness: changed }); } catch { invalidatingChange = true; break; }
    }
    if (invalidatingChange) dependencyIndices.push(i);
  }
  if (dependencyIndices.length !== 2) return null;
  let placementProbes = 0, legalPlacements = 0; let finalWinningChoices = 0;
  for (const [stepIndex, start] of stateAtDecision.entries()) {
    for (let pivotX = 0; pivotX < WIDTH; pivotX++) for (const orientation of ['up', 'right', 'down', 'left']) {
      placementProbes++; const outcome = playPlacement(start, { pivotX, orientation });
      if (outcome) { legalPlacements++; if (stepIndex === witness.length - 1 && outcome.state.phase === 'won') finalWinningChoices++; }
    }
  }
  const randomPlayout = rng(`${GENERATION_REVISION}|multi-samples|${serial}`); let successes = 0;
  for (let sample = 0; sample < SAMPLE_BUDGET; sample++) {
    let state = initial; let failed = false;
    for (let pairIndex = 0; pairIndex < queue.length; pairIndex++) {
      const options = [];
      for (let pivotX = 0; pivotX < WIDTH; pivotX++) for (const orientation of ['up', 'right', 'down', 'left']) {
        const result = playPlacement(state, { pivotX, orientation }); if (result) options.push(result);
      }
      if (!options.length) { failed = true; break; }
      state = options[Math.floor(randomPlayout() * options.length)].state;
      if (state.phase === 'won') break;
      if (state.phase !== 'falling' || !state.active) { failed = true; break; }
    }
    if (!failed && state.phase === 'won') successes++;
  }
  const metrics = { placementProbes, legalPlacements, goalPreservingPlacements: finalWinningChoices, forcedPlacementShare: finalWinningChoices === 1 ? 1 : 0, seededPlayoutSamples: SAMPLE_BUDGET, seededPlayoutQueueDepth: 3, seededPlayoutSuccesses: successes, seededPlayoutSuccessRate: Number((successes / SAMPLE_BUDGET).toFixed(6)), setupPairsBeforePayoff: 2, requiredSetupPairs: 2, verifiedSetupDependencies: dependencyIndices.length, requiredChainDepth: 1, requiredRotations: 0, requiredWallKicks: 0, splitLandingDependencies: 0, planningLength: 3 };
  const level = { id: `chains-${hash(JSON.stringify([colours, targetPositions, 'three-placement'])).slice(0, 12)}`, number: 0, title: { en: 'Build the missing column', ja: '足りない列を積み上げる' }, canonicalKeyHash: '', width: WIDTH, height: HEIGHT, colourCount: 4, seed: base.seed, board, queue, goal, witness, tags: ['setup-dependency', 'three-placement-plan'], rawMetrics: metrics, score: scoreFor(metrics), marks: 1, gradingVersion: GRADING_VERSION, proofStatus: 'engine-witness-verified', reviewStatus: 'human-review-pending' };
  level.canonicalKeyHash = hash(canonicalKey(level)); level.marks = Math.min(5, 1 + Math.floor(level.score / 20));
  return { level, key: canonicalKey(level) };
}
function tutorials() {
  const makeBoard = () => Array(WIDTH * HEIGHT).fill(null);
  const lessonRotation = makeBoard();
  [[0, 11], [1, 11], [2, 11]].forEach(([x, y], i) => lessonRotation[cell(x, y)] = { id: i + 1, colour: 'red' });
  const rotationQueue = [['red', 'blue'], ['gold', 'green']];
  const rotationBoard = withIds(lessonRotation.map(gem => gem?.colour ?? null));
  const rotation = { id: 'rotate-to-link', title: { en: 'Rotate to connect', ja: '回転してつなげる' }, objective: { en: 'Turn the pair sideways so its red stone closes the three-stone link. The first practice uses a wall kick.', ja: 'ペアを横向きにし、赤い石で3つの石の列を完成させましょう。最初の練習では壁際のキックも使います。' }, setup: { board: rotationBoard, queue: rotationQueue, goal: { kind: 'clear-targets', targetIds: [1, 2, 3] }, witness: [{ pivotX: 3, orientation: 'right' }] }, steps: [{ instruction: { en: 'Move left to the wall, then rotate anticlockwise. The pair kicks one column inward.', ja: '壁まで左へ動かしてから反時計回りに回転します。ペアが1列内側へキックします。' }, action: 'left; left; rotate-anticlockwise' }, { instruction: { en: 'Move to the open end, turn right, and place the pair.', ja: '空いている端へ動き、右向きにしてペアを置きます。' }, action: 'right; right; rotate-clockwise; rotate-clockwise; hard-drop' }], tags: ['rotation', 'wall-kick'] };

  const splitBoard = makeBoard();
  let id = 1;
  for (let y = 8; y <= 11; y++) splitBoard[cell(2, y)] = { id: id++, colour: y % 2 ? 'gold' : 'green' };
  splitBoard[cell(3, 11)] = { id: id++, colour: 'green' };
  // Three reds form an L beside the pivot landing. Every starting column is settled.
  for (let y = 8; y <= 11; y++) splitBoard[cell(0, y)] = { id: id++, colour: y % 2 ? 'gold' : 'blue' };
  for (let y = 8; y <= 11; y++) splitBoard[cell(1, y)] = { id: id++, colour: y % 2 ? 'green' : 'gold' };
  for (const [x, y] of [[0, 6], [0, 7], [1, 7]]) splitBoard[cell(x, y)] = { id: id++, colour: 'red' };
  const splitBoardIds = withIds(splitBoard.map(gem => gem?.colour ?? null));
  const targetSplit = splitBoardIds.filter(gem => gem?.colour === 'red').map(gem => gem.id);
  const split = { id: 'split-landing', title: { en: 'Land at two heights', ja: '異なる高さに着地' }, objective: { en: 'A sideways pair settles each stone independently. Watch how the red pivot joins the target link while its blue partner lands lower.', ja: '横向きのペアは石ごとに着地します。赤いピボットが目標の列につながり、青い相方は低い位置に着地します。' }, setup: { board: splitBoardIds, queue: [['red', 'blue'], ['gold', 'green']], goal: { kind: 'clear-targets', targetIds: targetSplit }, witness: [{ pivotX: 2, orientation: 'right' }] }, steps: [{ instruction: { en: 'Rotate clockwise so the pair spans the uneven columns.', ja: '時計回りに回転し、段差のある列にペアを渡します。' }, action: 'rotate-clockwise' }, { instruction: { en: 'Drop the pair; the two stones settle at different heights.', ja: 'ペアを落とすと、2つの石が別々の高さに着地します。' }, action: 'hard-drop' }], tags: ['split-landing', 'gravity'] };

  const chainBoard = makeBoard(); id = 1;
  for (const [x, y] of [[0, 11], [1, 11], [1, 10]]) chainBoard[cell(x, y)] = { id: id++, colour: 'red' };
  for (const y of [9, 10, 11]) chainBoard[cell(2, y)] = { id: id++, colour: 'blue' };
  const chainBoardIds = withIds(chainBoard.map(gem => gem?.colour ?? null));
  const chain = { id: 'build-a-two-wave-chain', title: { en: 'Set up a two-wave chain', ja: '2段の連鎖をつくる' }, objective: { en: 'Clear the blue group first. The red stone above it falls onto the red link for a second wave.', ja: '先に青いグループを消します。その上の赤い石が落ちて赤い列につながり、2段目の連鎖が起こります。' }, setup: { board: chainBoardIds, queue: [['blue', 'red'], ['gold', 'green']], goal: { kind: 'minimum-chain', chain: 2 }, witness: [{ pivotX: 2, orientation: 'up' }] }, steps: [{ instruction: { en: 'Keep the blue pivot below its red satellite.', ja: '青いピボットを赤いサテライトの下に保ちます。' }, action: 'keep-up' }, { instruction: { en: 'Drop the pair above the blue stack and watch both waves resolve.', ja: '青い積み重ねの上にペアを落とし、2段の消去を見届けます。' }, action: 'hard-drop' }], tags: ['chain', 'two-wave'] };
  return [rotation, split, chain];
}

export function generatedLevelPool() {
  const pools = { easy: new Map(), chain: new Map(), split: new Map(), multi: new Map() };
  for (let serial = 1; serial <= 5000 && pools.easy.size < 25; serial++) {
    const item = candidate(serial); if (item && !pools.easy.has(item.key)) pools.easy.set(item.key, item.level);
  }
  for (let serial = 1; serial <= 2000 && pools.chain.size < 12; serial++) {
    const item = chainCandidate(serial); if (item && !pools.chain.has(item.key)) pools.chain.set(item.key, item.level);
  }
  for (let serial = 1; serial <= 2000 && pools.split.size < 15; serial++) {
    const item = splitCandidate(serial); if (item && !pools.split.has(item.key)) pools.split.set(item.key, item.level);
  }
  for (let serial = 1; serial <= 2000 && pools.multi.size < 12; serial++) {
    const item = multiPairCandidate(serial); if (item && !pools.multi.has(item.key)) pools.multi.set(item.key, item.level);
  }
  if (pools.easy.size < 20 || pools.chain.size < 10 || pools.split.size < 10 || pools.multi.size < 10) throw new Error(`Insufficient variety: ${pools.easy.size} easy, ${pools.chain.size} chain, ${pools.split.size} split, ${pools.multi.size} multi-pair candidates`);
  return pools;
}

export function playAuthored(options, source, witness) {
  try {
    const start = createChallenge({ id: `proof-${source.id}`, seed: options.seed, width: source.width, height: source.height, colourCount: source.colourCount, board: options.board, queue: source.queue, goal: source.goal, witness, nature: true, ...(options.weather ? { weather: options.weather } : {}), ...(options.magneticQueue ? { magneticQueue: options.magneticQueue } : {}) });
    return playPlan(start, witness);
  } catch { return null; }
}

export function playAuthoredRaw(options, source, witness) {
  try {
    const settings = { mode: 'challenge', width: source.width, height: source.height, colourCount: source.colourCount, seed: options.seed, challengeId: `candidate-${source.id}`, goal: source.goal, initialBoard: options.board, queue: source.queue, witness, nature: true, ...(options.weather ? { weather: options.weather } : {}), ...(options.magneticQueue ? { magneticQueue: options.magneticQueue } : {}) };
    return playPlan(initialChallengeState(settings, options.board, source.queue), witness);
  } catch { return null; }
}

export function playCounterfactual(options, source, witness, disable) {
  const board = disable === 'magnetism' ? options.board.map(gem => gem ? { id: gem.id, colour: gem.colour } : null) : options.board;
  const settings = { mode: 'challenge', width: source.width, height: source.height, colourCount: source.colourCount, seed: options.seed, challengeId: `counterfactual-${source.id}`, goal: source.goal, initialBoard: board, queue: source.queue, witness, ...(disable === 'weather' || disable === 'magnetism' ? { nature: true } : {}), ...(disable !== 'weather' && options.weather ? { weather: options.weather } : {}), ...(options.magneticQueue ? { magneticQueue: options.magneticQueue } : {}) };
  const start = initialChallengeState(settings, board, source.queue);
  return playPlan(start, witness);
}

export function gradeNatureConstructionBlueprints(manifest, campaign) {
  const levels = [];
  for (const prior of manifest) {
    const source = { id: `construction-${campaign}-${levels.length + 1}`, width: prior.width, height: prior.height, colourCount: prior.colourCount, board: prior.board, queue: prior.queue, goal: prior.goal, tags: prior.tags ?? [] };
    const options = { seed: prior.seed, board: prior.board, nature: true, ...(prior.weather ? { weather: prior.weather } : {}), ...(prior.magneticQueue ? { magneticQueue: prior.magneticQueue } : {}), title: prior.title, objective: prior.objective };
    const proof = playAuthored(options, source, prior.witness); if (!proof || proof.state.phase !== 'won') continue;
    const disabled = playCounterfactual(options, source, prior.witness, campaign === 'arashi' ? 'weather' : 'nature');
    if (disabled?.state.phase === 'won') continue;
    if (campaign === 'shizen' && !proof.events.some(event => event.type === 'power-drop-landed' && event.rebound || event.type === 'magnetic-pulse' && event.moves?.length)) continue;
    const fallback = campaign === 'arashi' ? { title: { en: 'Keep the target in range', ja: '目標を範囲に保つ' }, objective: { en: 'Preserve the marked target until the scheduled weather can reach it.', ja: '予定された天候が届くまで目標を残しましょう。' } } : { title: { en: 'Guide the pair with nature', ja: '自然の力でペアを導く' }, objective: { en: 'Place the marked pair so its nature effect clears the target.', ja: '磁石付きのペアを置き、自然の力で目標を消しましょう。' } };
    const authored = authoredLevel(source, campaign, 0, { ...options, title: options.title ?? fallback.title, objective: options.objective ?? fallback.objective }, prior.witness, proof.events);
    authored.level.tags.push('construction-blueprint'); levels.push(authored);
  }
  return levels;
}

export function shizenHorizontalOpeningCandidates() {
  const levels = new Map(); const height = 12;
  for (const width of [5, 6, 7, 8]) {
    const board = Array(width * height).fill(null), targetIds = [1, 2, 3];
    for (const [id, x, y] of [[1, 2, 11], [2, 3, 11], [3, 4, 11]]) board[y * width + x] = { id, colour: 'red' };
    const queue = [['red', 'red'], ['blue', 'gold']], witness = [{ pivotX: 0, orientation: 'up' }];
    const source = { id: `shizen-horizontal-red-link-${width}`, width, height, colourCount: 6, board, queue, goal: { kind: 'clear-targets', targetIds }, tags: ['horizontal-target-link', 'wall-rebound'] };
    const options = { seed: `shizen-horizontal-red-link-${width}`, board, nature: true, magneticQueue: [[false, false], [false, false]], title: { en: 'Rebound into the long red row', ja: '長い赤い列へリバウンド' }, objective: { en: 'Use the left-wall rebound to bridge the gap into all three marked red stones.', ja: '左端のリバウンドで隙間を越え、3つの赤い目標へつなげます。' } };
    const proof = playAuthored(options, source, witness); if (!proof || proof.state.phase !== 'won' || !proof.events.some(event => event.type === 'power-drop-landed' && event.rebound)) continue;
    if (playCounterfactual(options, source, witness, 'nature')?.state.phase === 'won') continue;
    const authored = authoredLevel(source, 'shizen', 0, options, witness, proof.events);
    authored.level.tags.push('rebound-dependency', 'counterfactual-fail-without-nature');
    levels.set(authored.key, authored.level);
  }
  return levels;
}

export function shizenPairOpeningCandidates() {
  const levels = new Map(), height = 12;
  for (const width of [5, 6, 7, 8]) for (const geometry of ['horizontal', 'vertical']) {
    const positions = geometry === 'horizontal'
      ? Array.from({ length: width - 1 }, (_, index) => [index + 1, 11, index + 2, 11])
      : Array.from({ length: width }, (_, x) => [[x, 10, x, 11]]).flat();
    for (const position of positions) {
      const cells = geometry === 'horizontal' ? [[position[0], position[1]], [position[2], position[3]]] : [position.slice(0, 2), position.slice(2, 4)];
      if (cells.some(([x]) => x >= width)) continue;
      const board = Array(width * height).fill(null), targetIds = [];
      cells.forEach(([x, y], index) => { const id = index + 1; board[y * width + x] = { id, colour: 'red' }; targetIds.push(id); });
      const orientation = cells[0][0] <= 2 ? 'up' : 'right';
      const queue = [['red', 'red'], ['blue', 'gold']], witness = [{ pivotX: 0, orientation }];
      const source = { id: `shizen-two-target-${geometry}-${width}-${cells[0][0]}-${cells[0][1]}`, width, height, colourCount: 6, board, queue, goal: { kind: 'clear-targets', targetIds }, tags: ['two-target-opening', 'wall-rebound'] };
      const options = { seed: source.id, board, nature: true, magneticQueue: [[false, false], [false, false]], title: { en: 'Bridge the marked red pair', ja: '赤い目標の間をつなぐ' }, objective: { en: 'Use the left-wall rebound to reach the two marked red stones. Without the rebound, the gap stays open.', ja: '左端のリバウンドで2つの赤い目標へ届かせます。リバウンドがなければ隙間が残ります。' } };
      const proof = playAuthored(options, source, witness);
      if (!proof || proof.state.phase !== 'won' || !proof.events.some(event => event.type === 'power-drop-landed' && event.rebound)) continue;
      if (playCounterfactual(options, source, witness, 'nature')?.state.phase === 'won') continue;
      const authored = authoredLevel(source, 'shizen', 0, options, witness, proof.events);
      if (authored.level.score > 20) continue;
      authored.level.tags.push('rebound-dependency', 'counterfactual-fail-without-nature');
      levels.set(authored.key, authored.level);
    }
  }
  return levels;
}

export function shizenSupportedTargetCandidates() {
  const levels = new Map(), height = 12;
  for (const width of [5, 6, 7]) for (const towerHeight of [2, 3, 4]) {
    const targetX = 2;
    if (targetX + 2 >= width) continue;
    const board = Array(width * height).fill(null), targetIds = [];
    const targetY = height - towerHeight;
    for (let dx = 0; dx < 3; dx++) {
      const targetId = dx + 1;
      board[targetY * width + targetX + dx] = { id: targetId, colour: 'red' }; targetIds.push(targetId);
      for (let support = 1; support < towerHeight; support++) {
        board[(targetY + support) * width + targetX + dx] = { id: 10 + dx * 4 + support, colour: (dx + support) % 2 ? 'blue' : 'green' };
      }
    }
    const queue = [['red', 'red'], ['blue', 'gold']], witness = [{ pivotX: 0, orientation: 'up' }];
    const source = { id: `shizen-supported-row-${width}-${towerHeight}`, width, height, colourCount: 6, board, queue, goal: { kind: 'clear-targets', targetIds }, tags: ['supported-target-row', 'wall-rebound'] };
    const options = { seed: source.id, board, nature: true, magneticQueue: [[false, false], [false, false]], title: { en: 'Rebound onto the raised row', ja: '高い列へリバウンド' }, objective: { en: `Use the left-wall rebound to reach the three marked red stones above the ${towerHeight - 1}-row support.`, ja: `左端のリバウンドで、${towerHeight - 1}段の支えの上にある3つの赤い目標へ届かせます。` } };
    const proof = playAuthored(options, source, witness);
    if (!proof || proof.state.phase !== 'won' || !proof.events.some(event => event.type === 'power-drop-landed' && event.rebound)) continue;
    if (playCounterfactual(options, source, witness, 'nature')?.state.phase === 'won') continue;
    const authored = authoredLevel(source, 'shizen', 0, options, witness, proof.events);
    if (authored.level.score > 20) continue;
    authored.level.tags.push('rebound-dependency', 'counterfactual-fail-without-nature');
    levels.set(authored.key, authored.level);
  }
  return levels;
}

export function shizenReboundLaneCandidates() {
  const levels = new Map(), height = 12;
  for (const width of [5, 6, 7, 8]) for (const guideHeight of [1, 2, 3]) {
    const board = Array(width * height).fill(null), targetIds = [1, 2, 3];
    for (let dx = 0; dx < 3; dx++) board[11 * width + 2 + dx] = { id: dx + 1, colour: 'red' };
    for (let step = 0; step < guideHeight; step++) board[(11 - step) * width] = { id: 20 + step, colour: step % 2 ? 'green' : 'blue' };
    const queue = [['red', 'red'], ['blue', 'gold']], witness = [{ pivotX: 0, orientation: 'up' }];
    const source = { id: `shizen-rebound-guide-${width}-${guideHeight}`, width, height, colourCount: 6, board, queue, goal: { kind: 'clear-targets', targetIds }, tags: ['rebound-guide', 'wall-rebound'] };
    const options = { seed: source.id, board, nature: true, magneticQueue: [[false, false], [false, false]], title: { en: 'Use the blue rebound guide', ja: '青いガイドでリバウンド' }, objective: { en: `Drop the red pair onto the ${guideHeight}-stone guide in the left landing lane. Its rebound must bridge to all three marked red targets.`, ja: `左端の着地路にある${guideHeight}個のガイドへ赤いペアを落とします。リバウンドで3つの赤い目標へつなげましょう。` } };
    const proof = playAuthored(options, source, witness);
    if (!proof || proof.state.phase !== 'won' || !proof.events.some(event => event.type === 'power-drop-landed' && event.rebound)) continue;
    if (playCounterfactual(options, source, witness, 'nature')?.state.phase === 'won') continue;
    const authored = authoredLevel(source, 'shizen', 0, options, witness, proof.events);
    if (authored.level.score > 20) continue;
    authored.level.tags.push('rebound-dependency', 'counterfactual-fail-without-nature');
    levels.set(authored.key, authored.level);
  }
  return levels;
}

export function shizenLedgeOpeningCandidates() {
  const levels = new Map(), supportHeights = [2, 1, 2, 2, 2], height = 12;
  for (const width of [6, 7]) {
    const board = Array(width * height).fill(null), targetIds = [1, 2, 3]; let id = 4;
    for (let x = 0; x < supportHeights.length; x++) for (let offset = 0; offset < supportHeights[x]; offset++) {
      board[(11 - offset) * width + x] = { id: id++, colour: (x + offset) % 2 ? 'blue' : 'green' };
    }
    for (let dx = 0; dx < 3; dx++) board[9 * width + 2 + dx] = { id: dx + 1, colour: 'red' };
    const queue = [['red', 'red'], ['blue', 'gold']], witness = [{ pivotX: 0, orientation: 'up' }];
    const source = { id: `shizen-low-ledge-${width}`, width, height, colourCount: 6, board, queue, goal: { kind: 'clear-targets', targetIds }, tags: ['uneven-support', 'wall-rebound'] };
    const options = { seed: source.id, board, nature: true, magneticQueue: [[false, false], [false, false]], title: { en: 'Find the rebound over the ledge', ja: '段差越しのリバウンド' }, objective: { en: 'Use the changing support heights to carry the red pair into the three marked targets.', ja: '高さの異なる支えを使い、赤いペアを3つの目標へ導きます。' } };
    const proof = playAuthored(options, source, witness);
    if (!proof || proof.state.phase !== 'won' || !proof.events.some(event => event.type === 'power-drop-landed' && event.rebound)) continue;
    if (playCounterfactual(options, source, witness, 'nature')?.state.phase === 'won') continue;
    const authored = authoredLevel(source, 'shizen', 0, options, witness, proof.events);
    authored.level.tags.push('rebound-dependency', 'counterfactual-fail-without-nature');
    levels.set(authored.key, authored.level);
  }
  return levels;
}

export function generateShizenCampaign() {
  const unique = new Map(); const width = 6, height = 12, colourCount = 6;
  for (const { level, key } of gradeNatureConstructionBlueprints(shizenConstructionBlueprints, 'shizen')) unique.set(key, level);
  for (const [key, level] of shizenHorizontalOpeningCandidates()) unique.set(key, level);
  for (const [key, level] of shizenPairOpeningCandidates()) unique.set(key, level);
  for (const [key, level] of shizenSupportedTargetCandidates()) unique.set(key, level);
  for (const [key, level] of shizenReboundLaneCandidates()) unique.set(key, level);
  for (const [key, level] of shizenLedgeOpeningCandidates()) unique.set(key, level);
  // Low-decision Shizen openings: one red pair rebounds from the left wall
  // into a small connected red target. Width and target topology change the
  // actual reachable placements; no seed-only or empty-height variants.
  for (const boardWidth of [5, 6, 7, 8, 9, 10, 11, 12]) for (const offset of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    if (offset + 1 >= boardWidth) continue;
    const shapes = [
      { name: 'corner-left', cells: [[offset, 11], [offset + 1, 11], [offset, 10]] },
      { name: 'corner-right', cells: [[offset, 11], [offset + 1, 11], [offset + 1, 10]] },
      { name: 'vertical', cells: [[offset, 11], [offset, 10], [offset, 9]] },
      ...(offset === 2 && offset + 2 < boardWidth ? [{ name: 'horizontal', cells: [[offset, 11], [offset + 1, 11], [offset + 2, 11]] }] : []),
      ...(offset === 2 && offset + 1 < boardWidth ? [{ name: 'square', cells: [[offset, 11], [offset + 1, 11], [offset, 10], [offset + 1, 10]] }] : []),
      { name: 'tall-vertical', cells: [[offset, 11], [offset, 10], [offset, 9], [offset, 8]] },
      ...(offset === 2 && offset + 3 < boardWidth ? [{ name: 'wide-row', cells: [[offset, 11], [offset + 1, 11], [offset + 2, 11], [offset + 3, 11]] }] : [])
    ];
    for (const shape of shapes) {
      if (shape.cells.some(([x]) => x >= boardWidth)) continue;
      const board = Array(boardWidth * height).fill(null), targetIds = [];
      shape.cells.forEach(([x, y], index) => { const id = index + 1; board[y * boardWidth + x] = { id, colour: 'red' }; targetIds.push(id); });
      const orientation = offset >= 3 && shape.name !== 'horizontal' ? 'right' : 'up';
      const queue = [['red', 'red'], [boardWidth > 10 ? 'red' : 'blue', boardWidth > 10 ? 'red' : 'gold']], witness = [{ pivotX: 0, orientation }];
      const source = { id: `shizen-red-wall-link-${boardWidth}-${offset}-${shape.name}`, width: boardWidth, height, colourCount: 6, board, queue, goal: { kind: 'clear-targets', targetIds }, tags: ['wall-rebound', 'connected-target'] };
      const options = { seed: `shizen-red-wall-link-${boardWidth}-${offset}-${shape.name}`, board, nature: true, magneticQueue: [[false, false], [false, false]], title: boardWidth > 10 ? { en: 'Keep a red pair in reserve', ja: '赤いペアを予備にする' } : { en: 'Rebound into the red link', ja: '赤い連結へリバウンド' }, objective: boardWidth > 10 ? { en: 'Use the first red pair to rebound into the connected target. The second red pair can recover if the first placement misses.', ja: '最初の赤いペアをリバウンドさせ、つながった目標へ導きます。外した場合は2組目の赤いペアで立て直せます。' } : { en: 'A red pair rebounds from the left edge. Guide it into the connected red target group.', ja: '赤いペアを左端でリバウンドさせ、つながった赤い目標へ導きます。' } };
      const proof = playAuthored(options, source, witness); if (proof?.state.phase !== 'won' || !proof.events.some(event => event.type === 'power-drop-landed' && event.rebound)) continue;
      const plain = playCounterfactual(options, source, witness, 'nature'); if (plain?.state.phase === 'won') continue;
      if (boardWidth > 10) {
        const wrongFirst = { pivotX: boardWidth - 1, orientation: 'up' };
        const miss = playAuthoredRaw(options, source, [wrongFirst]), recovery = playAuthoredRaw(options, source, [wrongFirst, witness[0]]);
        if (miss?.state.phase !== 'falling' || recovery?.state.phase !== 'won') continue;
      }
      const authored = authoredLevel(source, 'shizen', 0, options, witness, proof.events);
      if (boardWidth > 10) authored.level.rawMetrics.verifiedWrongFirstRecovery = 1;
      authored.level.tags.push('rebound-dependency', 'counterfactual-fail-without-nature');
      unique.set(authored.key, authored.level);
    }
  }
  const restoreBoard = Array(width * height).fill(null); let restoreId = 1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const colour = shizenFourWaveRestorePrototype.rows[y][x];
    if (colour !== '.') restoreBoard[cell(x, y)] = { id: restoreId++, colour };
  }
  const restoreSource = { id: 'shizen-four-wave-restore', width, height, colourCount: 4, board: restoreBoard, queue: shizenFourWaveRestorePrototype.queue, goal: shizenFourWaveRestorePrototype.goal, tags: ['minimum-chain', 'gravity-setup', 'setup-dependency'] };
  const restoreOptions = { seed: shizenFourWaveRestorePrototype.seed, board: restoreBoard, nature: true, magneticQueue: shizenFourWaveRestorePrototype.magneticQueue,
    title: { en: 'Restore the gold step', ja: '金の段差を戻す' },
    objective: { en: 'Use the first rebound to restore the gold at the top of the cascade. The second pair starts four required clearing waves.', ja: '最初のリバウンドで連鎖の頂上に金を戻します。2組目で4段の必須連鎖を起こします。' } };
  const restoreProof = playAuthored(restoreOptions, restoreSource, shizenFourWaveRestorePrototype.witness);
  const restorePlain = playCounterfactual(restoreOptions, restoreSource, shizenFourWaveRestorePrototype.witness, 'nature');
  if (restoreProof?.state.phase === 'won' && restoreProof.state.maxChain >= 4 && restoreProof.events.some(event => event.type === 'power-drop-landed' && event.rebound) && restorePlain?.state.phase !== 'won') {
    const authored = authoredLevel(restoreSource, 'shizen', 0, restoreOptions, shizenFourWaveRestorePrototype.witness, restoreProof.events);
    authored.level.tags.push('minimum-chain-dependency', 'rebound-dependency', 'counterfactual-fail-without-nature');
    unique.set(authored.key, authored.level);
  }
  for (const [index, layout] of shizenFourWaveLayouts.entries()) {
    const board = Array(width * height).fill(null), removed = new Set(layout.remove.map(([x, y]) => cell(x, y))); let gemId = 1;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const colour = shizenFourWaveRestorePrototype.rows[y][x];
      if (colour !== '.' && !removed.has(cell(x, y))) board[cell(x, y)] = { id: gemId++, colour };
    }
    const source = { id: `shizen-four-wave-layout-${index + 1}`, width, height, colourCount: 4, board, queue: shizenFourWaveRestorePrototype.queue, goal: shizenFourWaveRestorePrototype.goal, tags: ['minimum-chain', 'gravity-setup', 'setup-dependency'] };
    const options = { seed: 'review:shizen-variant', board, nature: true, magneticQueue: shizenFourWaveRestorePrototype.magneticQueue,
      title: { en: 'Restore the gold step', ja: '金の段差を戻す' },
      objective: { en: 'Use the rebound to restore the cascade route, then trigger the required four-wave clear.', ja: 'リバウンドで連鎖の道を戻し、必須の4段連鎖を起こしましょう。' } };
    const proof = playAuthored(options, source, layout.witness), plain = playCounterfactual(options, source, layout.witness, 'nature');
    if (proof?.state.phase !== 'won' || proof.state.maxChain < 4 || !proof.events.some(event => event.type === 'power-drop-landed' && event.rebound) || plain?.state.phase === 'won') continue;
    const authored = authoredLevel(source, 'shizen', 0, options, layout.witness, proof.events);
    authored.level.tags.push('minimum-chain-dependency', 'rebound-dependency', 'counterfactual-fail-without-nature', 'cascade-route-variant');
    if (!unique.has(authored.key)) unique.set(authored.key, authored.level);
  }
  // The same causal rebound route supports a measured cascade progression.
  // Admit a shorter minimum only when its sampled wins or consequential
  // deviations differ from the four-wave objective on the identical board.
  for (const layout of [{ remove: [], witness: shizenFourWaveRestorePrototype.witness }, ...shizenFourWaveLayouts]) {
    const board = Array(width * height).fill(null), removed = new Set(layout.remove.map(([x, y]) => cell(x, y))); let gemId = 1;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const colour = shizenFourWaveRestorePrototype.rows[y][x]; if (colour !== '.' && !removed.has(cell(x, y))) board[cell(x, y)] = { id: gemId++, colour };
    }
    const options = { seed: 'review:shizen-variant', board, nature: true, magneticQueue: shizenFourWaveRestorePrototype.magneticQueue };
    const baselineSource = { id: 'shizen-cascade-comparison', width, height, colourCount: 4, board, queue: shizenFourWaveRestorePrototype.queue, goal: { kind: 'minimum-chain', chain: 4 }, tags: ['minimum-chain', 'gravity-setup', 'setup-dependency'] };
    const baselineProof = playAuthored(options, baselineSource, layout.witness); if (!baselineProof || baselineProof.state.phase !== 'won') continue;
    const baseline = natureMetrics(baselineSource, options, layout.witness, baselineProof.events);
    for (const chain of [2, 3]) {
      const source = { ...baselineSource, id: `shizen-cascade-progression-${chain}`, goal: { kind: 'minimum-chain', chain } };
      const proof = playAuthored(options, source, layout.witness); if (!proof || proof.state.phase !== 'won' || proof.state.maxChain < chain) continue;
      if (!proof.events.some(event => event.type === 'power-drop-landed' && event.rebound) || playCounterfactual(options, source, layout.witness, 'nature')?.state.phase === 'won') continue;
      const measured = natureMetrics(source, options, layout.witness, proof.events);
      if (measured.rawMetrics.seededPlayoutSuccesses === baseline.rawMetrics.seededPlayoutSuccesses && measured.rawMetrics.singleStepDeviationWins === baseline.rawMetrics.singleStepDeviationWins) continue;
      const authored = authoredLevel(source, 'shizen', 0, { ...options, title: { en: `Require a ${chain}-wave cascade`, ja: `${chain}段連鎖を目標に` }, objective: { en: `Restore the missing support with the first rebound. The next pair must produce at least ${chain} dependent clearing waves.`, ja: `最初のリバウンドで欠けた支えを戻します。次のペアで少なくとも${chain}段の連鎖を起こしましょう。` } }, layout.witness, proof.events);
      authored.level.tags.push('minimum-chain-dependency', 'rebound-dependency', 'cascade-progression', 'counterfactual-fail-without-nature');
      if (!unique.has(authored.key)) unique.set(authored.key, authored.level);
    }
  }
  for (const [key, level] of shizenReboundChainCandidatePool(8)) unique.set(key, level);
  for (const [key, level] of shizenReboundChainCandidatePool(32, [61, 80], [1, 2, 3, 4])) unique.set(key, level);
  for (let index = 0; index < advancedShizenPrototypes.length; index++) {
    const prototype = advancedShizenPrototypes[index];
    const board = Array(width * height).fill(null);
    for (const [at, id, colour, magnetic] of prototype.board) board[at] = { id, colour, ...(magnetic ? { magnetic: true } : {}) };
    let source = { id: `magnetic-setup-${index + 1}`, width, height, colourCount, board, queue: prototype.queue, goal: { kind: 'clear-targets', targetIds: [1, 2, 3] }, tags: [] };
    const options = { seed: prototype.seed, board, nature: true, magneticQueue: prototype.magneticQueue };
    let outcome = playAuthored(options, source, prototype.witness);
    if (!outcome || outcome.state.phase !== 'won') continue;
    const pulseMoves = outcome.events.filter(event => event.type === 'magnetic-pulse').flatMap(event => event.moves ?? []);
    const rebound = outcome.events.some(event => event.type === 'power-drop-landed' && event.rebound);
    if (!pulseMoves.length || !rebound) continue;
    if (prototype.witness.length > 1) {
      const startingIds = new Set(board.filter(Boolean).map(gem => gem.id));
      const setupTargets = [...new Set(outcome.events.filter(event => event.type === 'cells-cleared').flatMap(event => event.ids ?? []).filter(id => startingIds.has(id)))];
      if (setupTargets.length > source.goal.targetIds.length) {
        const coordinatedSource = { ...source, id: `${source.id}-coordinated-goal`, goal: { kind: 'clear-targets', targetIds: setupTargets } };
        const coordinatedOutcome = playAuthored(options, coordinatedSource, prototype.witness);
        const coordinatedOff = playCounterfactual(options, coordinatedSource, prototype.witness, 'magnetism');
        if (coordinatedOutcome?.state.phase === 'won' && coordinatedOff?.state.phase !== 'won') { source = coordinatedSource; outcome = coordinatedOutcome; }
      }
    }
    const attractionDependent = pulseMoves.length > 0;
    const plain = playCounterfactual(options, source, prototype.witness, attractionDependent ? 'magnetism' : 'nature');
    if (plain?.state.phase === 'won') continue;
    const isThreeStep = prototype.witness.length >= 3;
    const levelOptions = {
      ...options,
      title: isThreeStep
        ? { en: 'Build two clearings', ja: '2つの連鎖を準備' }
        : { en: 'Pulse, then rebound', ja: '磁力の後にリバウンド' },
      objective: isThreeStep
        ? { en: 'Clear both setup colours first. Watch the magnetic pulse pull the gap closed, then place the marked red pair for the rebound finish.', ja: '先に2色の準備を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。' }
        : { en: 'Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.', ja: '先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。' }
    };
    const authored = authoredLevel(source, 'shizen', 0, levelOptions, prototype.witness, outcome.events);
    authored.level.tags.push('setup-dependency', ...(attractionDependent ? ['magnetic-attraction'] : []), ...(rebound ? ['rebound-dependency'] : []), 'counterfactual-fail-without-nature');
    if (!unique.has(authored.key)) unique.set(authored.key, authored.level);
  }
  // Real boundary-sensitive variants of the authored multi-pair plans. Moving
  // the entire occupied structure changes edge distances and legal landing
  // space; retain only reverified attraction/rebound-dependent outcomes.
  for (let index = 0; index < advancedShizenPrototypes.length; index++) {
    const prototype = advancedShizenPrototypes[index]; if (prototype.witness.length < 2) continue;
    for (const boardWidth of [7, 8, 9, 10]) for (let shift = 0; shift <= boardWidth - 6; shift++) {
      const board = Array(boardWidth * height).fill(null);
      for (const [at, id, colour, magnetic] of prototype.board) {
        const oldX = at % 6, y = Math.floor(at / 6), x = oldX + shift;
        board[y * boardWidth + x] = { id, colour, ...(magnetic ? { magnetic: true } : {}) };
      }
      const witness = prototype.witness.map(step => ({ ...step, pivotX: step.pivotX + shift }));
      const queue = prototype.queue;
      let source = { id: `shizen-boundary-${index + 1}-${boardWidth}-${shift}`, width: boardWidth, height, colourCount, board, queue, goal: { kind: 'clear-targets', targetIds: [1, 2, 3] }, tags: ['setup-dependency', 'boundary-sensitive-route'] };
      const options = { seed: prototype.seed, board, nature: true, magneticQueue: prototype.magneticQueue };
      let outcome = playAuthored(options, source, witness); if (!outcome || outcome.state.phase !== 'won') continue;
      const moved = outcome.events.some(event => event.type === 'magnetic-pulse' && event.moves?.length), rebound = outcome.events.some(event => event.type === 'power-drop-landed' && event.rebound);
      if (!moved && !rebound) continue;
      if (witness.length > 1) {
        const startingIds = new Set(board.filter(Boolean).map(gem => gem.id));
        const setupTargets = [...new Set(outcome.events.filter(event => event.type === 'cells-cleared').flatMap(event => event.ids ?? []).filter(id => startingIds.has(id)))];
        if (setupTargets.length > source.goal.targetIds.length) {
          const coordinated = { ...source, goal: { kind: 'clear-targets', targetIds: setupTargets } };
          const coordinatedOutcome = playAuthored(options, coordinated, witness), coordinatedOff = playCounterfactual(options, coordinated, witness, 'magnetism');
          if (coordinatedOutcome?.state.phase === 'won' && coordinatedOff?.state.phase !== 'won') { source = coordinated; outcome = coordinatedOutcome; }
        }
      }
      const counterfactual = playCounterfactual(options, source, witness, moved ? 'magnetism' : 'nature'); if (counterfactual?.state.phase === 'won') continue;
      const title = { en: 'Route the pair around the edge', ja: '端を回ってペアを導く' };
      const objective = { en: 'The wider board changes the magnetic reach and rebound route. Clear the setup targets, then finish the marked group from the verified landing column.', ja: '幅広い盤面では磁力の届く範囲とリバウンド経路が変わります。準備の目標を消し、確認済みの着地点から最後の組を決めましょう。' };
      const authored = authoredLevel(source, 'shizen', 0, { ...options, title, objective }, witness, outcome.events);
      authored.level.tags.push('boundary-sensitive-route', ...(moved ? ['magnetic-attraction'] : []), ...(rebound ? ['rebound-dependency'] : []), 'counterfactual-fail-without-nature');
      if (!unique.has(authored.key)) unique.set(authored.key, authored.level);
    }
  }
  const safeColours = ['blue', 'green', 'gold', 'purple', 'teal'];
  for (let serial = 1; serial <= 4_000 && unique.size < 220; serial++) {
    const board = Array(width * height).fill(null); const targetIds = [1, 2, 3];
    for (const [index, x] of [[0, 2], [1, 3], [2, 4]]) board[(height - 1) * width + x] = { id: index + 1, colour: 'red' };
    let id = 4;
    // A changing skyline above the red link alters safe landings without changing the proof pattern.
    for (const x of [2, 3, 4]) {
      const heightAbove = Math.floor(serial / (x === 2 ? 1 : x === 3 ? 7 : 49)) % 5;
      for (let depth = 0; depth < heightAbove; depth++) board[(height - 2 - depth) * width + x] = { id: id++, colour: safeColours[(serial + x + depth) % safeColours.length] };
    }
    const outsideHeight = 1 + (serial % 11);
    for (let depth = 0; depth < outsideHeight; depth++) board[(height - 1 - depth) * width + 5] = { id: id++, colour: safeColours[(serial * 3 + depth) % safeColours.length] };
    const queue = [['red', 'blue'], [safeColours[serial % safeColours.length], safeColours[(serial + 2) % safeColours.length]]];
    const witness = [{ pivotX: 0, orientation: 'up' }];
    const source = { id: `magnetic-template-${serial}`, width, height, colourCount, board, queue, goal: { kind: 'clear-targets', targetIds }, tags: [] };
    const magneticQueue = [[true, false], [false, false]];
    const options = { seed: `shizen:${NATURE_GENERATION_REVISION}:${serial}`, board, nature: true, magneticQueue };
    const outcome = playAuthored(options, source, witness);
    if (!outcome || outcome.state.phase !== 'won') continue;
    const rebound = outcome.events.find(event => event.type === 'power-drop-landed' && event.rebound && event.ids?.includes(outcome.events.find(item => item.type === 'pair-locked')?.ids?.[0]));
    if (!rebound) continue;
    const plain = playCounterfactual(options, source, witness, 'nature');
    if (plain?.state.phase === 'won') continue;
    const levelOptions = { ...options, title: { en: 'Rebound the red link', ja: '赤い列へリバウンド' }, objective: { en: 'Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.', ja: '磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。' } };
    const authored = authoredLevel(source, 'shizen', 0, levelOptions, witness, outcome.events);
    authored.level.tags.push('rebound-dependency', 'counterfactual-fail-without-nature');
    const key = canonicalNatureKey(authored.level);
    authored.level.canonicalKeyHash = hash(key); authored.level.id = `shizen-${hash(key).slice(0, 12)}`;
    if (!unique.has(key)) unique.set(key, authored.level);
  }
  if (unique.size < 128) throw new Error(`Shizen generation found only ${unique.size} unique engine-witnessed candidates for 128 measured bands`);
  return makeVariantManifest([...unique.values()], 'shizen', 'Preserve verified published stable IDs, add canonically unique rebound and attraction boards, and select only candidates with engine-replayed witnesses and same-plan mechanic counterfactual evidence.', 'Within the declared 1–20, 21–40, 41–60, 61–80 and 81–100 measured score bands, sort ascending by score then stable canonical ID.', unique.size);
}

/** Keep only color/queue variants that change the witnessed cascade route and retain the rebound dependency. */
export function shizenReboundChainCandidatePool(minimum = 8, scoreRange = [81, 100], chainRequirements = [3, 4]) {
  const candidates = new Map(); const width = 6, height = 12;
  const baseBoard = Array(width * height).fill(null); let id = 1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const colour = shizenFourWaveRestorePrototype.rows[y][x];
    if (colour !== '.') baseBoard[cell(x, y)] = { id: id++, colour };
  }
  const baseDefinitions = [
    { queue: [['blue', 'gold'], ['green', 'red']], witness: [{ pivotX: 1, orientation: 'left' }, { pivotX: 0, orientation: 'up' }] },
    { queue: [['gold', 'blue'], ['green', 'red']], witness: [{ pivotX: 0, orientation: 'right' }, { pivotX: 0, orientation: 'up' }] }
  ];
  const colourNames = ['red', 'blue', 'green', 'gold'];
  const routeSignature = events => JSON.stringify(events.filter(event => event.type === 'cells-cleared').map(event => [event.chain ?? 1, [...(event.ids ?? [])].sort((a, b) => a - b)]));
  const knownRoutes = new Set();
  for (const definition of baseDefinitions) {
    for (const chain of chainRequirements) {
      const source = { id: 'shizen-route-reference', width, height, colourCount: 4, board: baseBoard, queue: definition.queue, goal: { kind: 'minimum-chain', chain }, tags: ['minimum-chain', 'gravity-setup', 'setup-dependency'] };
      const options = { seed: shizenFourWaveRestorePrototype.seed, board: baseBoard, nature: true, magneticQueue: [[false, false], [false, false]] };
      const result = playAuthored(options, source, definition.witness);
      if (result?.state.phase === 'won') knownRoutes.add(routeSignature(result.events));
    }
  }
  let mutationIndex = 0;
  for (const definition of baseDefinitions) for (const chain of chainRequirements) {
    for (let at = 0; at < baseBoard.length && candidates.size < minimum; at++) {
      const gem = baseBoard[at]; if (!gem) continue;
      for (const colour of colourNames) {
        if (colour === gem.colour || candidates.size >= minimum) continue;
        const board = baseBoard.map((item, index) => index === at ? { ...item, colour } : item);
        const source = { id: `shizen-route-variant-${mutationIndex++}`, width, height, colourCount: 4, board, queue: definition.queue, goal: { kind: 'minimum-chain', chain }, tags: ['minimum-chain', 'gravity-setup', 'setup-dependency'] };
        const options = { seed: shizenFourWaveRestorePrototype.seed, board, nature: true, magneticQueue: [[false, false], [false, false]], title: { en: 'Restore the gold step', ja: '金の段差を戻す' }, objective: { en: `Restore the rebound support, then complete the required ${chain}-wave cascade.`, ja: `リバウンドで支えを戻し、必須の${chain}段連鎖を完成させます。` } };
        const raw = playAuthoredRaw(options, source, definition.witness); if (raw?.state.phase !== 'won' || raw.state.maxChain < chain) continue;
        const route = routeSignature(raw.events); if (knownRoutes.has(route)) continue;
        const reboundEvent = raw.events.some(event => event.type === 'power-drop-landed' && event.rebound);
        if (!reboundEvent) continue;
        const withoutNature = playCounterfactual(options, source, definition.witness, 'nature'); if (withoutNature?.state.phase === 'won') continue;
        const proof = playAuthored(options, source, definition.witness); if (proof?.state.phase !== 'won') continue;
        const authored = authoredLevel(source, 'shizen', 0, options, definition.witness, proof.events);
        if (authored.level.score < scoreRange[0] || authored.level.score > scoreRange[1]) continue;
        authored.level.tags.push('minimum-chain-dependency', 'rebound-dependency', 'counterfactual-fail-without-nature', 'cascade-route-variant');
        knownRoutes.add(route);
        if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
      }
    }
  }
  for (const definition of baseDefinitions) for (const chain of chainRequirements) {
    const mutationCells = baseBoard.flatMap((gem, at) => gem && Math.floor(at / width) >= 5 && at % width <= 3 ? [at] : []);
    for (let firstIndex = 0; firstIndex < mutationCells.length && candidates.size < minimum; firstIndex++) for (let secondIndex = firstIndex + 1; secondIndex < mutationCells.length && candidates.size < minimum; secondIndex++) {
      const firstAt = mutationCells[firstIndex], secondAt = mutationCells[secondIndex];
      for (const firstColour of colourNames) for (const secondColour of colourNames) {
        const firstGem = baseBoard[firstAt], secondGem = baseBoard[secondAt];
        if (firstColour === firstGem.colour || secondColour === secondGem.colour || candidates.size >= minimum) continue;
        const board = baseBoard.map((item, at) => at === firstAt ? { ...item, colour: firstColour } : at === secondAt ? { ...item, colour: secondColour } : item);
        const source = { id: `shizen-route-pair-${mutationIndex++}`, width, height, colourCount: 4, board, queue: definition.queue, goal: { kind: 'minimum-chain', chain }, tags: ['minimum-chain', 'gravity-setup', 'setup-dependency'] };
        const options = { seed: shizenFourWaveRestorePrototype.seed, board, nature: true, magneticQueue: [[false, false], [false, false]], title: { en: 'Restore the gold step', ja: '金の段差を戻す' }, objective: { en: `Restore the rebound support, then complete the required ${chain}-wave cascade.`, ja: `リバウンドで支えを戻し、必須の${chain}段連鎖を完成させます。` } };
        const raw = playAuthoredRaw(options, source, definition.witness); if (raw?.state.phase !== 'won' || raw.state.maxChain < chain) continue;
        const route = routeSignature(raw.events); if (knownRoutes.has(route) || !raw.events.some(event => event.type === 'power-drop-landed' && event.rebound)) continue;
        const withoutNature = playCounterfactual(options, source, definition.witness, 'nature'); if (withoutNature?.state.phase === 'won') continue;
        const proof = playAuthored(options, source, definition.witness); if (proof?.state.phase !== 'won') continue;
        const authored = authoredLevel(source, 'shizen', 0, options, definition.witness, proof.events);
        if (authored.level.score < scoreRange[0] || authored.level.score > scoreRange[1]) continue;
        authored.level.tags.push('minimum-chain-dependency', 'rebound-dependency', 'counterfactual-fail-without-nature', 'cascade-route-variant');
        knownRoutes.add(route); if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
      }
    }
  }
  return candidates;
}

function makeVariantManifest(levels, category, curationPolicy, orderingPolicy, candidatePoolCount = levels.length) {
  const definitions = [['entry', 32, 1, 20], ['easy', 32, 21, 40], ['intermediate', 32, 41, 60], ['hard', 24, 61, 80], ['expert', 8, 81, 100]];
  const selected = [];
  for (const [band, count, minimum, maximum] of definitions) {
    const candidates = levels.filter(level => level.score >= minimum && level.score <= maximum).sort((a, b) => a.score - b.score || a.id.localeCompare(b.id));
    if (candidates.length < count) {
      const yieldSummary = definitions.map(([id, , low, high]) => `${id}:${levels.filter(level => level.score >= low && level.score <= high).length}`).join(', ');
      throw new Error(`${category} needs ${count} measured ${band} levels scored ${minimum}–${maximum}; only ${candidates.length} qualified (pool ${levels.length}; yields ${yieldSummary})`);
    }
    const chosen = band === 'expert' ? candidates.slice(-count) : candidates.slice(0, count);
    for (const level of chosen) { level.band = band; selected.push(level); }
  }
  selected.sort((a, b) => a.score - b.score || a.id.localeCompare(b.id));
  selected.forEach((level, index) => { level.number = index + 1; });
  const checksum = hash(JSON.stringify(selected));
  const bands = definitions.map(([id, count]) => ({ id, count, first: selected.findIndex(level => level.band === id) + 1, last: selected.findIndex(level => level.band === id) + count }));
  return deepFreeze({ count: selected.length, candidatePoolCount, generationRevision: NATURE_GENERATION_REVISION, gradingVersion: NATURE_GRADING_VERSION, category, curationPolicy, orderingPolicy, grading: { formula: GRADING_FORMULA, goalCoordinationEvidence: 'Ordinary clear-target goals count distinct target colours; weather challenges count distinct connected target components exposed to scheduled weather. Minimum-chain goals use the explicit required wave count.', sampleBudget: '64 for standard candidates; candidates scoring 81+ are remeasured at 256 before final score selection.', decisionProbeScope: 'Enumerate all legal placement deviations at each witness decision and replay the exact remaining witnessed suffix; setup-loss share excludes the payoff placement.', seededPlayoutScope: 'Each deterministic sample chooses independently from the complete legal placement set at every pair through the full finite queue.' }, sampleBudget: SAMPLE_BUDGET, checksum, bands, levels: selected });
}

export function arashiCausalCandidatePool(minimum = 100) {
  const candidates = new Map(); const targetPositions = [];
  for (let y = 1; y <= 2; y++) for (let x = 3; x <= 5; x++) targetPositions.push(y * WIDTH + x);
  const plans = [
    { queue: [['blue', 'gold'], ['green', 'purple'], ['teal', 'blue'], ['gold', 'green']], xs: [0, 1, 0, 0] },
    { queue: [['green', 'purple'], ['teal', 'blue'], ['gold', 'green'], ['blue', 'gold']], xs: [1, 0, 1, 1] },
    { queue: [['teal', 'blue'], ['blue', 'gold'], ['green', 'purple'], ['gold', 'green']], xs: [0, 2, 1, 0] }
  ];
  const colors = ['red', 'blue', 'gold', 'purple', 'teal']; let pattern = 0;
  for (const targetCount of [2, 3]) {
    const familyStart = candidates.size;
    const choose = (start, selected) => {
      if (selected.length === targetCount) {
        const targets = selected.map((position, index) => [position, 9001 + index, colors[index]]);
        const board = Array(WIDTH * HEIGHT).fill(null); let id = 1;
        const targetByCell = new Map(targets.map(([position, targetId, colour]) => [position, { id: targetId, colour }]));
        for (let y = 0; y < HEIGHT; y++) for (let x = 3; x <= 5; x++) {
          const position = cell(x, y), target = targetByCell.get(position);
          board[position] = target ?? { id: id++, colour: ['blue', 'green', 'gold', 'purple', 'teal'][(2 * x + y) % 5] };
          if (target) id++;
        }
        const targetIds = targets.map(([, targetId]) => targetId);
        const signature = selected.join('-'); pattern++;
        for (const [planIndex, plan] of plans.entries()) for (let seedIndex = 1; seedIndex <= 300 && candidates.size - familyStart < minimum; seedIndex++) {
          const witness = plan.xs.map(pivotX => ({ pivotX, orientation: 'up' }));
          const source = { id: `arashi-coordinated-${pattern}-${planIndex}`, width: WIDTH, height: HEIGHT, colourCount: 6, board, queue: plan.queue, goal: { kind: 'clear-targets', targetIds }, tags: [] };
          const options = { seed: `arashi-causal-${targetCount}-${signature}-${planIndex}-${seedIndex}`, board, nature: true, weather: 'frequent' };
          const proof = playAuthoredRaw(options, source, witness); if (!proof || proof.state.phase !== 'won') continue;
          const jumble = proof.events.find(event => event.type === 'jumble-completed' && event.changed);
          const lightning = proof.events.find(event => event.type === 'lightning-struck');
          if (!jumble?.moves?.some(move => targetIds.includes(move.id)) || !targetIds.every(targetId => lightning?.removedIds?.includes(targetId))) continue;
          const withoutWeather = playCounterfactual(options, source, witness, 'weather'); if (withoutWeather?.state.phase === 'won') continue;
          const title = targetCount === 3 ? { en: 'Route three targets into lightning', ja: '3つの目標を雷へ導く' } : { en: 'Expose both targets after the jumble', ja: '地震の後に2つの目標を露出' };
          const objective = targetCount === 3 ? { en: 'Use the turn-two shuffle to expose all three marked stones, then keep each strike column clear until turn-four lightning.', ja: '2手目の入れ替えで3つの目標を露出させ、4手目の雷まで各列を空けておきましょう。' } : { en: 'The turn-two shuffle must expose both marked stones; preserve their lightning columns until turn four.', ja: '2手目の入れ替えで2つの目標を露出させ、4手目まで雷の列を守りましょう。' };
          const verified = playAuthored(options, source, witness); if (!verified || verified.state.phase !== 'won') continue;
          const authored = authoredLevel(source, 'arashi', 0, { ...options, title, objective }, witness, verified.events);
          authored.level.tags.push('jumble-dependency', 'lightning-coordination', `${targetCount}-target-coordination`, 'counterfactual-fail-without-weather');
          if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
        }
        return;
      }
      for (let index = start; index < targetPositions.length && candidates.size - familyStart < minimum; index++) choose(index + 1, [...selected, targetPositions[index]]);
    };
    choose(0, []);
  }
  return candidates;
}

/** Search a bounded family where clearing a blue guard steers the later jumble away from the guard area. */
export function arashiGuardedCandidatePool(minimum = 8) {
  const candidates = new Map();
  const guardIds = [9101, 9102, 9103];
  const queue = [['blue', 'blue'], ['green', 'green'], ['gold', 'gold'], ['teal', 'teal']];
  const witness = [0, 0, 0, 0].map(pivotX => ({ pivotX, orientation: 'up' }));
  const colors = ['blue', 'green', 'gold', 'purple', 'teal'];
  const positions = Array.from({ length: 9 }, (_, index) => [3 + index % 3, Math.floor(index / 3)]);
  const combinations = (count, start = 0, chosen = []) => chosen.length === count ? [chosen] : positions.slice(start).flatMap((_, offset) => combinations(count, start + offset + 1, [...chosen, start + offset]));
  let pattern = 0;
  for (const targetCount of [2, 3]) for (const indices of combinations(targetCount)) {
    const targetIds = Array.from({ length: targetCount }, (_, index) => 9001 + index);
    const targetChoices = indices.map(index => positions[index]);
    const board = Array(WIDTH * HEIGHT).fill(null); let id = 1;
    for (let y = 0; y < HEIGHT; y++) for (let x = 3; x <= 5; x++) {
      const targetIndex = targetChoices.findIndex(([tx, ty]) => tx === x && ty === y);
      board[cell(x, y)] = targetIndex >= 0 ? { id: targetIds[targetIndex], colour: ['red', 'blue', 'gold'][targetIndex] } : { id: id++, colour: colors[(2 * x + y) % colors.length] };
    }
    for (let y = 9; y <= 11; y++) board[cell(0, y)] = { id: guardIds[y - 9], colour: 'blue' };
    pattern++;
    const source = { id: `arashi-guarded-${pattern}`, width: WIDTH, height: HEIGHT, colourCount: 6, board, queue, goal: { kind: 'clear-targets', targetIds: [...guardIds, ...targetIds] }, tags: [] };
    const title = { en: 'Clear the guard before the shuffle', ja: '入れ替え前に守りを消す' };
    const objective = { en: `Clear the three blue guards with the first pair. This removes the left jumble patch; then preserve the ${targetCount} exposed marked targets for the turn-four strike.`, ja: `最初のペアで青い守りを3つ消しましょう。左の地震区画がなくなったら、4手目の雷まで${targetCount}つの目標を守ります。` };
    for (let seedIndex = 1; seedIndex <= 160 && candidates.size < minimum; seedIndex++) {
      const options = { seed: `arashi-guard-route-${pattern}-${seedIndex}`, board, nature: true, weather: 'frequent', magneticQueue: queue.map(() => [false, false]), title, objective };
      const raw = playAuthoredRaw(options, source, witness); if (!raw || raw.state.phase !== 'won') continue;
      const clearedGuardIds = new Set(raw.events.filter(event => event.type === 'cells-cleared').flatMap(event => event.ids ?? []));
      const jumble = raw.events.find(event => event.type === 'jumble-completed' && event.changed);
      const strike = raw.events.find(event => event.type === 'lightning-struck');
      if (!guardIds.every(target => clearedGuardIds.has(target)) || !targetIds.some(target => jumble?.moves?.some(move => move.id === target)) || !targetIds.every(target => strike?.removedIds?.includes(target)) || guardIds.some(target => strike?.removedIds?.includes(target))) continue;
      const wrongFirst = playAuthoredRaw(options, source, [{ pivotX: 1, orientation: 'up' }, ...witness.slice(1)]);
      const wrongClear = wrongFirst?.events.some(event => event.type === 'cells-cleared' && guardIds.every(target => event.ids?.includes(target)));
      if (wrongFirst?.state.phase === 'won' && wrongClear) continue;
      const withoutWeather = playCounterfactual(options, source, witness, 'weather'); if (withoutWeather?.state.phase === 'won') continue;
      const proof = playAuthored(options, source, witness); if (proof?.state.phase !== 'won') continue;
      const authored = authoredLevel(source, 'arashi', 0, { ...options, title, objective }, witness, proof.events);
      authored.level.tags.push('jumble-dependency', 'lightning-coordination', 'cleared-guard-steers-jumble', 'counterfactual-fail-without-weather');
      if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
    }
  }
  return candidates;
}

/** A two-clear setup makes both the first work choice and later weather patch depend on the route. */
export function arashiDoubleGuardCandidatePool(minimum = 8) {
  const candidates = new Map(); const guardIds = [9101, 9102, 9103, 9201, 9202, 9203];
  const queue = [['blue', 'blue'], ['green', 'green'], ['gold', 'gold'], ['teal', 'teal']];
  const witness = [0, 1, 0, 0].map(pivotX => ({ pivotX, orientation: 'up' }));
  const positions = Array.from({ length: 9 }, (_, index) => [3 + index % 3, Math.floor(index / 3)]);
  const combinations = (count, start = 0, chosen = []) => chosen.length === count ? [chosen] : positions.slice(start).flatMap((_, offset) => combinations(count, start + offset + 1, [...chosen, start + offset]));
  const colors = ['blue', 'green', 'gold', 'purple', 'teal']; let pattern = 0;
  for (const targetCount of [2, 3]) for (const indices of combinations(targetCount)) {
    const targetIds = Array.from({ length: targetCount }, (_, index) => 9301 + index);
    const targetChoices = indices.map(index => positions[index]);
    const board = Array(WIDTH * HEIGHT).fill(null); let id = 1;
    for (let y = 0; y < HEIGHT; y++) for (let x = 3; x <= 5; x++) {
      const targetIndex = targetChoices.findIndex(([tx, ty]) => tx === x && ty === y);
      board[cell(x, y)] = targetIndex >= 0 ? { id: targetIds[targetIndex], colour: ['red', 'blue', 'gold'][targetIndex] } : { id: id++, colour: colors[(2 * x + y) % colors.length] };
    }
    for (let y = 9; y <= 11; y++) { board[cell(1, y)] = { id: guardIds[y - 9], colour: 'blue' }; board[cell(2, y)] = { id: guardIds[y - 6], colour: 'green' }; }
    pattern++;
    const source = { id: `arashi-double-guard-${pattern}`, width: WIDTH, height: HEIGHT, colourCount: 6, board, queue, goal: { kind: 'clear-targets', targetIds: [...guardIds, ...targetIds] }, tags: [] };
    const title = { en: 'Clear both guards to steer the shuffle', ja: '2つの守りを消して地震を導く' };
    const objective = { en: 'Clear the blue guard with pair one and the green guard with pair two. With both work columns clear, the turn-two jumble can select the marked target area; preserve those targets for the turn-four strike.', ja: '1組目で青、2組目で緑の守りを消します。作業列を空けると2手目の地震が目標区画を選べます。4手目の雷まで目標を守りましょう。' };
    for (let seedIndex = 1; seedIndex <= 160 && candidates.size < minimum; seedIndex++) {
      const options = { seed: `arashi-double-guard-${pattern}-${seedIndex}`, board, nature: true, weather: 'frequent', magneticQueue: queue.map(() => [false, false]), title, objective };
      const raw = playAuthoredRaw(options, source, witness); if (!raw || raw.state.phase !== 'won') continue;
      const cleared = new Set(raw.events.filter(event => event.type === 'cells-cleared').flatMap(event => event.ids ?? []));
      const jumble = raw.events.find(event => event.type === 'jumble-completed' && event.changed), strike = raw.events.find(event => event.type === 'lightning-struck');
      if (!guardIds.every(target => cleared.has(target)) || !targetIds.some(target => jumble?.moves?.some(move => move.id === target)) || !targetIds.every(target => strike?.removedIds?.includes(target))) continue;
      const wrongFirst = playAuthoredRaw(options, source, [{ pivotX: 1, orientation: 'up' }, ...witness.slice(1)]);
      if (wrongFirst?.state.phase === 'won') continue;
      const withoutWeather = playCounterfactual(options, source, witness, 'weather'); if (withoutWeather?.state.phase === 'won') continue;
      const proof = playAuthored(options, source, witness); if (proof?.state.phase !== 'won') continue;
      const authored = authoredLevel(source, 'arashi', 0, { ...options, title, objective }, witness, proof.events);
      authored.level.tags.push('jumble-dependency', 'lightning-coordination', 'double-guard-steers-jumble', 'counterfactual-fail-without-weather');
      if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
    }
  }
  return candidates;
}

export function arashiHeadroomEntryCandidates() {
  const candidates = new Map(), height = 12, colourCount = 6;
  for (const width of [13, 14, 15, 16]) for (let targetX = 1; targetX < width; targetX++) {
    const board = Array(width * height).fill(null), targetId = 1;
    board[width + targetX] = { id: targetId, colour: 'red' };
    for (let y = 2; y < height; y++) board[y * width + targetX] = { id: y + 1, colour: y % 2 === 0 ? 'purple' : 'green' };
    const queue = Array.from({ length: 4 }, () => ['blue', 'gold']);
    const witness = Array.from({ length: 4 }, () => ({ pivotX: 0, orientation: 'up' }));
    const source = { id: `arashi-headroom-lane-${width}-${targetX}`, width, height, colourCount, board, queue, goal: { kind: 'clear-targets', targetIds: [targetId] }, tags: ['scheduled-lightning', 'headroom-target', 'open-lane'] };
    const title = { en: 'Leave space above the target', ja: '目標の上に空間を残す' };
    const objective = { en: 'Keep the marked lane clear. Lightning removes its exposed target from below the empty row above it.', ja: '目標の列を空けておきます。上に空間を残した目標を、4手目の雷で消しましょう。' };
    for (let seedIndex = 1; seedIndex <= 128; seedIndex++) {
      const seed = width === 16 && targetX === 15 && seedIndex === 1 ? 'weather-entry-1' : `weather-headroom-${width}-${targetX}-${seedIndex}`;
      const options = { seed, board, nature: true, weather: 'frequent', title, objective };
      const proof = playAuthored(options, source, witness); if (!proof || proof.state.phase !== 'won') continue;
      const strike = proof.events.find(event => event.type === 'lightning-struck');
      if (!strike?.removedIds?.includes(targetId)) continue;
      if (playCounterfactual(options, source, witness, 'weather')?.state.phase === 'won') continue;
      const authored = authoredLevel(source, 'arashi', 0, options, witness, proof.events);
      authored.level.tags.push('lightning-dependency', 'counterfactual-fail-without-weather');
      if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
      break;
    }
  }
  return candidates;
}

export function generateArashiCampaign() {
  const candidates = new Map(); const width = 6, height = 12, colourCount = 6;
  for (const { level, key } of gradeNatureConstructionBlueprints(arashiConstructionBlueprints, 'arashi')) candidates.set(key, level);
  for (const [key, level] of arashiHeadroomEntryCandidates()) candidates.set(key, level);
  const causalSource = { id: 'arashi-causal-jumble-lightning', width, height, colourCount, board: arashiCausalPrototype.board, queue: arashiCausalPrototype.queue, goal: arashiCausalPrototype.goal, tags: [] };
  const causalOptions = { seed: arashiCausalPrototype.seed, board: causalSource.board, nature: true, weather: 'frequent', title: { en: 'Expose both targets to lightning', ja: '2つの目標を雷にさらす' }, objective: { en: 'Keep both marked stones in the selected patch. The turn-two jumble exposes them, and turn-four lightning must reach both columns.', ja: '2つの目標を選ばれる区画に保ちましょう。2手目の地震で露出させ、4手目の雷を両方の列に届かせます。' } };
  const causalProof = playAuthored(causalOptions, causalSource, arashiCausalPrototype.witness);
  if (causalProof?.state.phase === 'won' && causalProof.events.some(event => event.type === 'jumble-completed' && event.changed && event.moves?.some(move => move.id === 9001)) && causalProof.events.some(event => event.type === 'lightning-struck' && [9001, 9002].every(id => event.removedIds?.includes(id))) && playCounterfactual(causalOptions, causalSource, arashiCausalPrototype.witness, 'weather')?.state.phase !== 'won') {
    const authored = authoredLevel(causalSource, 'arashi', 0, causalOptions, arashiCausalPrototype.witness, causalProof.events);
    authored.level.tags.push('jumble-dependency', 'lightning-coordination', 'counterfactual-fail-without-weather');
    candidates.set(authored.key, authored.level);
  }
  const coordinatedSource = { id: 'arashi-three-target-coordination', width, height, colourCount, board: arashiThreeTargetPrototype.board, queue: arashiThreeTargetPrototype.queue, goal: arashiThreeTargetPrototype.goal, tags: [] };
  const coordinatedOptions = { seed: arashiThreeTargetPrototype.seed, board: coordinatedSource.board, nature: true, weather: 'frequent', title: { en: 'Shuffle three targets into range', ja: '3つの目標を雷の範囲へ' }, objective: { en: 'The turn-two jumble must move all three marked stones into the exposed row. Turn-four lightning must select each of their columns.', ja: '2手目の地震で3つの目標を露出させ、4手目の雷がすべての列を選ぶようにします。' } };
  const coordinatedProof = playAuthored(coordinatedOptions, coordinatedSource, arashiThreeTargetPrototype.witness);
  if (coordinatedProof?.state.phase === 'won' && coordinatedProof.events.some(event => event.type === 'jumble-completed' && event.changed && event.moves?.some(move => arashiThreeTargetPrototype.goal.targetIds.includes(move.id))) && coordinatedProof.events.some(event => event.type === 'lightning-struck' && arashiThreeTargetPrototype.goal.targetIds.every(id => event.removedIds?.includes(id))) && playCounterfactual(coordinatedOptions, coordinatedSource, arashiThreeTargetPrototype.witness, 'weather')?.state.phase !== 'won') {
    const authored = authoredLevel(coordinatedSource, 'arashi', 0, coordinatedOptions, arashiThreeTargetPrototype.witness, coordinatedProof.events);
    authored.level.tags.push('jumble-dependency', 'lightning-coordination', 'three-target-coordination', 'counterfactual-fail-without-weather');
    candidates.set(authored.key, authored.level);
  }
  for (const prototype of arashiTallTowerPrototypes) {
    const source = { id: `arashi-${prototype.geometry}`, width, height: prototype.height, colourCount, board: prototype.board, queue: prototype.queue, goal: prototype.goal, tags: ['jumble-dependency', 'lightning-coordination', 'three-target-coordination', 'tower-profile'] };
    const options = { seed: prototype.seed, board: prototype.board, nature: true, weather: prototype.weather };
    const proof = playAuthored(options, source, prototype.witness); if (!proof || proof.state.phase !== 'won') continue;
    const targets = new Set(source.goal.targetIds);
    const jumble = proof.events.find(event => event.type === 'jumble-completed' && event.changed), strike = proof.events.find(event => event.type === 'lightning-struck');
    if (!jumble?.moves?.some(move => targets.has(move.id)) || !source.goal.targetIds.every(id => strike?.removedIds?.includes(id))) continue;
    if (playCounterfactual(options, source, prototype.witness, 'weather')?.state.phase === 'won') continue;
    const authored = authoredLevel(source, 'arashi', 0, { ...options, title: { en: 'Route three targets through the shuffle', ja: '3つの目標を入れ替えに通す' }, objective: { en: `The changed turn-two jumble must expose all three marked stones; turn-four lightning must then remove all three. Tower height is ${prototype.height}.`, ja: `2手目の入れ替えで3つの目標を露出させ、4手目の雷ですべて消します。塔の高さは${prototype.height}段です。` } }, prototype.witness, proof.events);
    authored.level.tags.push('jumble-dependency', 'lightning-coordination', 'three-target-coordination', 'tower-profile', 'counterfactual-fail-without-weather');
    if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
  }
  for (const prototype of arashiGuardGatePrototypes) {
    const source = { id: prototype.geometry, width: 6, height: prototype.height, colourCount, board: prototype.board, queue: prototype.queue, goal: prototype.goal, tags: ['guard-gate', 'jumble-dependency', 'lightning-coordination'] };
    const options = { seed: prototype.seed, board: prototype.board, nature: true, weather: 'frequent', title: { en: 'Clear the teal guard before lightning', ja: '雷の前に青緑のガードを消す' }, objective: { en: 'The turn-two jumble moves a target and the teal guard. Use the third teal pair to clear all three guard stones, then let turn-four lightning remove all three marked targets.', ja: '2手目の入れ替えで目標と青緑のガードが動きます。3組目のペアでガード3個を消し、4手目の雷ですべての目標を消しましょう。' } };
    const witness = prototype.witness, proof = playAuthored(options, source, witness); if (!proof || proof.state.phase !== 'won') continue;
    const targetIds = new Set(source.goal.targetIds), guardIds = new Set([8001, 8002, 8003]);
    const jumble = proof.events.find(event => event.type === 'jumble-completed' && event.changed), match = proof.events.find(event => event.type === 'match-marked' && [...guardIds].every(id => event.ids?.includes(id))), strike = proof.events.find(event => event.type === 'lightning-struck');
    if (!jumble?.moves?.some(move => targetIds.has(move.id)) || !jumble.moves.some(move => guardIds.has(move.id)) || !match || !source.goal.targetIds.every(id => strike?.removedIds?.includes(id))) continue;
    if (playCounterfactual(options, source, witness, 'weather')?.state.phase === 'won') continue;
    const wrongThird = witness.map(step => ({ ...step })); wrongThird[2] = { pivotX: 0, orientation: 'up' };
    const wrong = playAuthoredRaw(options, source, wrongThird), wrongStrike = wrong?.events.find(event => event.type === 'lightning-struck');
    if (!wrongStrike || wrong?.state.phase === 'won' || source.goal.targetIds.every(id => wrongStrike.removedIds?.includes(id))) continue;
    const authored = authoredLevel(source, 'arashi', 0, options, witness, proof.events);
    authored.level.tags.push('jumble-dependency', 'lightning-coordination', 'three-target-coordination', 'guard-gate', 'counterfactual-fail-without-weather', 'counterfactual-fail-wrong-guard-lane');
    if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
  }
  for (const prototype of arashiWideGuardPrototypes) {
    const source = { id: prototype.geometry, width: prototype.width, height: prototype.height, colourCount: prototype.colourCount, board: prototype.board, queue: prototype.queue, goal: prototype.goal, tags: ['wide-guard-gate', 'jumble-dependency', 'lightning-coordination'] };
    const options = { seed: prototype.seed, board: prototype.board, nature: true, weather: prototype.weather, title: { en: 'Clear the guard from the wide lane', ja: '広い列でガードを消す' }, objective: { en: 'The second-turn jumble moves a marked target and the teal guard. Place the third pair in the guard lane to clear all three guard stones; turn-four lightning must then reach every target.', ja: '2手目の入れ替えで目標と青緑のガードが動きます。3組目をガード列へ置いて3個すべてを消し、4手目の雷ですべての目標を狙います。' } };
    const witness = prototype.witness, proof = playAuthored(options, source, witness); if (!proof || proof.state.phase !== 'won') continue;
    const targetIds = new Set(source.goal.targetIds), guardIds = new Set([8001, 8002, 8003]);
    const jumble = proof.events.find(event => event.type === 'jumble-completed' && event.changed), match = proof.events.find(event => event.type === 'match-marked' && [...guardIds].every(id => event.ids?.includes(id))), strike = proof.events.find(event => event.type === 'lightning-struck');
    if (!jumble?.moves?.some(move => targetIds.has(move.id)) || !jumble.moves.some(move => guardIds.has(move.id)) || !match || !source.goal.targetIds.every(id => strike?.removedIds?.includes(id))) continue;
    if (playCounterfactual(options, source, witness, 'weather')?.state.phase === 'won') continue;
    const wrongThird = witness.map(step => ({ ...step })); wrongThird[2] = { pivotX: prototype.wrongThirdLane, orientation: witness[2].orientation };
    const wrong = playAuthoredRaw(options, source, wrongThird), wrongStrike = wrong?.events.find(event => event.type === 'lightning-struck');
    if (!wrongStrike || wrong?.state.phase === 'won' || source.goal.targetIds.every(id => wrongStrike.removedIds?.includes(id))) continue;
    const authored = authoredLevel(source, 'arashi', 0, options, witness, proof.events);
    authored.level.tags.push('jumble-dependency', 'lightning-coordination', 'three-target-coordination', 'guard-gate', 'wide-workspace', 'counterfactual-fail-without-weather', 'counterfactual-fail-wrong-guard-lane');
    if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
  }
  // A broad, sparse board teaches the scheduled strike as an accessible entry
  // mechanic: the marked lane is tall, all four placements stay on its far
  // side, and only lightning can remove the target. Width/lane are structural.
  for (const boardWidth of [8, 9, 10, 11, 12, 13, 14, 15, 16]) for (let targetX = 1; targetX < boardWidth; targetX++) {
    const board = Array(boardWidth * height).fill(null), targetId = 50_001 + boardWidth * 100 + targetX;
    board[targetX] = { id: targetId, colour: 'red' };
    for (let y = 1; y < height; y++) board[y * boardWidth + targetX] = { id: targetId + y, colour: y % 2 ? 'green' : 'purple' };
    const queue = Array.from({ length: 4 }, () => ['blue', 'gold']);
    const witness = Array.from({ length: 4 }, () => ({ pivotX: 0, orientation: 'up' }));
    const source = { id: `arashi-open-lightning-lane-${boardWidth}-${targetX}`, width: boardWidth, height, colourCount, board, queue, goal: { kind: 'clear-targets', targetIds: [targetId] }, tags: ['scheduled-lightning', 'open-lane'] };
    const title = { en: 'Keep the marked lane open', ja: '目標の列を空けておく' };
    const objective = { en: 'Keep all four pairs away from the marked tower. The turn-two shuffle passes, then turn-four lightning removes the exposed target.', ja: '4組すべてを目標の塔から離して置きます。2手目の入れ替えの後、4手目の雷で露出した目標を消しましょう。' };
    for (let seedIndex = 1; seedIndex <= 80; seedIndex++) {
      const seed = boardWidth === 16 && targetX === 15 && seedIndex === 1 ? 'weather-entry-1' : `arashi-open-lane-${boardWidth}-${targetX}-${seedIndex}`;
      const options = { seed, board, nature: true, weather: 'frequent', magneticQueue: queue.map(() => [false, false]), title, objective };
      const raw = playAuthoredRaw(options, source, witness); if (!raw || raw.state.phase !== 'won') continue;
      const strike = raw.events.find(event => event.type === 'lightning-struck');
      if (!strike?.columns?.includes(targetX) || !strike.removedIds?.includes(targetId)) continue;
      const withoutWeather = playCounterfactual(options, source, witness, 'weather'); if (withoutWeather?.state.phase === 'won') continue;
      const proof = playAuthored(options, source, witness); if (!proof || proof.state.phase !== 'won') continue;
      const authored = authoredLevel(source, 'arashi', 0, options, witness, proof.events);
      authored.level.tags.push('lightning-dependency', 'counterfactual-fail-without-weather');
      if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
      break;
    }
  }
  // Two independently exposed towers make the strike-column plan a real
  // choice. These compact widths place the same weather lesson in the easy
  // band without assigning difficulty by level position.
  for (const boardWidth of [8, 9, 10, 11, 12]) for (let firstX = 1; firstX < boardWidth - 2; firstX++) for (let secondX = firstX + 3; secondX < boardWidth; secondX++) {
    const board = Array(boardWidth * height).fill(null), targetXs = [firstX, secondX], targetIds = targetXs.map((_, index) => 60_001 + boardWidth * 100 + firstX * 10 + secondX + index); let supportId = 1;
    for (const [towerIndex, targetX] of targetXs.entries()) {
      board[targetX] = { id: targetIds[towerIndex], colour: towerIndex ? 'gold' : 'red' };
      for (let y = 1; y < height; y++) board[y * boardWidth + targetX] = { id: supportId++, colour: (y + towerIndex) % 2 ? 'green' : 'purple' };
    }
    const queue = Array.from({ length: 4 }, () => ['blue', 'gold']), witness = Array.from({ length: 4 }, () => ({ pivotX: 0, orientation: 'up' }));
    const source = { id: `arashi-dual-open-lanes-${boardWidth}-${firstX}-${secondX}`, width: boardWidth, height, colourCount, board, queue, goal: { kind: 'clear-targets', targetIds }, tags: ['dual-strike-lanes', 'scheduled-lightning'] };
    const title = { en: 'Keep both target lanes clear', ja: '2つの目標列を空ける' };
    const objective = { en: 'Place each pair away from both marked towers. Turn-four lightning must reach both exposed targets.', ja: '各ペアを2つの塔から離して置きます。4手目の雷が露出した両方の目標へ届く必要があります。' };
    for (let seedIndex = 1; seedIndex <= 48; seedIndex++) {
      const options = { seed: `arashi-dual-lane-${boardWidth}-${firstX}-${secondX}-${seedIndex}`, board, nature: true, weather: 'frequent', magneticQueue: queue.map(() => [false, false]), title, objective };
      const raw = playAuthoredRaw(options, source, witness); if (!raw || raw.state.phase !== 'won') continue;
      const strike = raw.events.find(event => event.type === 'lightning-struck');
      if (!targetIds.every(id => strike?.removedIds?.includes(id))) continue;
      if (playCounterfactual(options, source, witness, 'weather')?.state.phase === 'won') continue;
      const proof = playAuthored(options, source, witness); if (!proof || proof.state.phase !== 'won') continue;
      const authored = authoredLevel(source, 'arashi', 0, options, witness, proof.events);
      if (authored.level.score < 21 || authored.level.score > 40) continue;
      authored.level.tags.push('lightning-dependency', 'dual-strike-lanes', 'counterfactual-fail-without-weather');
      if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
      break;
    }
  }
  const safeColours = ['blue', 'green', 'gold', 'purple', 'teal'];
  for (let serial = 1; serial <= 1_200 && candidates.size < 80; serial++) {
    const targetX = serial % width; const dropXs = [0, 1, 2, 3, 4, 5].filter(x => x !== targetX);
    const planOffset = Math.floor(serial / width) % dropXs.length;
    const witness = Array.from({ length: 4 }, (_, index) => ({ pivotX: dropXs[(planOffset + index) % dropXs.length], orientation: 'up' }));
    const board = Array(width * height).fill(null); board[(height - 1) * width + targetX] = { id: 1, colour: 'red' };
    // Keep the target exposed above two supports. The four placements must leave its strike column open.
    board[(height - 2) * width + targetX] = { id: 2, colour: 'green' }; board[(height - 3) * width + targetX] = { id: 3, colour: 'gold' };
    let nextId = 4; const decorationCount = serial % 3;
    const random = rng(`${NATURE_GENERATION_REVISION}|arashi-board|${serial}`);
    const usedColumns = new Set([targetX]);
    for (let i = 0; i < decorationCount; i++) {
      let column = Math.floor(random() * width); let attempts = 0;
      while (usedColumns.has(column) && attempts++ < width) column = (column + 1) % width;
      if (usedColumns.has(column)) break;
      usedColumns.add(column); const stack = 1 + Math.floor(random() * 3);
      for (let depth = 0; depth < stack; depth++) board[(height - 1 - depth) * width + column] = { id: nextId++, colour: safeColours[Math.floor(random() * safeColours.length)] };
    }
    const palette = [...safeColours.slice(serial % safeColours.length), ...safeColours.slice(0, serial % safeColours.length)];
    const queue = Array.from({ length: 4 }, (_, index) => [palette[(index * 2) % palette.length], palette[(index * 2 + 1) % palette.length]]);
    const source = { id: `arashi-${serial}`, width, height, colourCount, board, queue, goal: { kind: 'clear-targets', targetIds: [1] }, tags: [] };
    const seed = `arashi:${NATURE_GENERATION_REVISION}:${serial}`;
    const options = { seed, board, nature: true, weather: 'frequent' };
    const outcome = playAuthored(options, source, witness);
    if (!outcome || outcome.state.phase !== 'won') continue;
    const weather = outcome.events.filter(event => event.type === 'weather-triggered');
    if (!weather.some(event => event.kind === 'jumble' && event.turn === 2) || !weather.some(event => event.kind === 'lightning' && event.turn === 4)) continue;
    if (!outcome.events.some(event => event.type === 'jumble-completed' && event.changed === true) || !outcome.events.some(event => event.type === 'lightning-struck' && event.removedIds?.includes(1))) continue;
    const withoutWeather = playCounterfactual(options, source, witness, 'weather');
    if (!withoutWeather || withoutWeather.state.phase === 'won') continue;
    const names = [
      [{ en: 'Keep the target exposed', ja: '目標を露出させる' }, { en: 'Leave the target clear through the jumble, then let turn-four lightning remove it.', ja: '目標の列を地震の後まで空けておき、4手目の雷で消しましょう。' }],
      [{ en: 'Save a path for lightning', ja: '雷への道を残す' }, { en: 'Place the setup pairs away from the marked target so lightning can reach it on turn four.', ja: '準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。' }],
      [{ en: 'After the jumble', ja: '地震の後に' }, { en: 'The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.', ja: '2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。' }]
    ];
    const [title, objective] = names[(targetX + decorationCount) % names.length];
    const variantOptions = { ...options, title, objective };
    const authored = authoredLevel(source, 'arashi', 0, variantOptions, witness, outcome.events);
    if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
  }
  for (const [key, level] of arashiCausalCandidatePool(28)) candidates.set(key, level);
  for (const [key, level] of arashiGuardedCandidatePool(16)) candidates.set(key, level);
  if (candidates.size < 128) throw new Error(`Arashi generation found only ${candidates.size} unique engine-witnessed candidates for 128 measured bands`);
  return makeVariantManifest([...candidates.values()], 'arashi', 'Curate exact score bands from measured full-plan success, consequential placement deviations, setup-only deviation losses, distinct target-color components and verified weather dependence. Every target-bearing weather trace records its actual jumble and strike outcome.', 'Within declared 1–20, 21–40, 41–60, 61–80 and 81–100 measured score bands, sort ascending by score then stable canonical ID.', candidates.size);
}

function prototypeMetricSummary(source, options, witness, campaign) {
  const proof = playAuthored(options, source, witness);
  if (!proof || proof.state.phase !== 'won') return { campaign, valid: false, witnessLength: witness.length };
  const measured = natureMetrics(source, options, witness, proof.events);
  const counterfactual = playCounterfactual(options, source, witness, campaign === 'arashi' ? 'weather' : (proof.events.some(event => event.type === 'magnetic-pulse' && event.moves?.length) ? 'magnetism' : 'nature'));
  const eventEvidence = proof.events.filter(event => ['magnetic-pulse', 'power-drop-landed', 'weather-triggered', 'jumble-completed', 'lightning-struck'].includes(event.type)).map(event => ({ type: event.type, ...(event.kind ? { kind: event.kind } : {}), ...(event.turn ? { turn: event.turn } : {}), ...(event.rebound !== undefined ? { rebound: event.rebound } : {}), ...(event.moves?.length ? { moved: event.moves.length } : {}), ...(event.removedIds?.length ? { removedIds: event.removedIds } : {}) }));
  return { campaign, valid: true, id: source.id, witnessLength: witness.length, score: measured.score, rawDifficultyScore: measured.rawDifficultyScore, metrics: measured.rawMetrics, mechanicOffPhase: counterfactual?.state.phase ?? 'invalid', events: eventEvidence };
}

/** Small, reviewable construction set; intentionally does not generate the full campaign. */
export function generateNaturePrototypeReport() {
  const prototypes = [];
  const introBoard = Array(WIDTH * HEIGHT).fill(null);
  introBoard[cell(2, 11)] = { id: 1, colour: 'red' }; introBoard[cell(3, 11)] = { id: 2, colour: 'red' }; introBoard[cell(4, 11)] = { id: 3, colour: 'red' };
  introBoard[cell(0, 11)] = { id: 4, colour: 'blue' }; introBoard[cell(0, 10)] = { id: 5, colour: 'red', magnetic: true };
  introBoard[cell(5, 11)] = { id: 6, colour: 'green' }; introBoard[cell(5, 10)] = { id: 7, colour: 'red', magnetic: true };
  const introSource = { id: 'prototype-shizen-attraction-opening', width: WIDTH, height: HEIGHT, colourCount: 6, board: introBoard, queue: [['blue', 'gold'], ['green', 'teal']], goal: { kind: 'clear-targets', targetIds: [1, 2, 3] }, tags: [] };
  const introOptions = { seed: 'shizen-attraction-opening', board: introBoard, nature: true, magneticQueue: [[false, false], [false, false]] };
  prototypes.push(prototypeMetricSummary(introSource, introOptions, [{ pivotX: 0, orientation: 'up' }], 'shizen'));
  const shizenIntro = shizenConstructionBlueprints.find(level => level.witness.length === 1);
  if (shizenIntro) prototypes.push(prototypeMetricSummary({ ...shizenIntro, id: `prototype-${shizenIntro.id}` }, { seed: shizenIntro.seed, board: shizenIntro.board, nature: true, ...(shizenIntro.weather ? { weather: shizenIntro.weather } : {}), ...(shizenIntro.magneticQueue ? { magneticQueue: shizenIntro.magneticQueue } : {}) }, shizenIntro.witness, 'shizen'));
  for (const [index, spec] of advancedShizenPrototypes.entries()) {
    const board = Array(WIDTH * HEIGHT).fill(null);
    for (const [at, id, colour, magnetic] of spec.board) board[at] = { id, colour, ...(magnetic ? { magnetic: true } : {}) };
    const source = { id: `prototype-shizen-${index + 1}`, width: WIDTH, height: HEIGHT, colourCount: 6, board, queue: spec.queue, goal: { kind: 'clear-targets', targetIds: [1, 2, 3] }, tags: [] };
    prototypes.push(prototypeMetricSummary(source, { seed: spec.seed, board, nature: true, magneticQueue: spec.magneticQueue }, spec.witness, 'shizen'));
  }
  const coordinatedShizen = advancedShizenPrototypes[18];
  if (coordinatedShizen) {
    const board = Array(WIDTH * HEIGHT).fill(null);
    for (const [at, id, colour, magnetic] of coordinatedShizen.board) board[at] = { id, colour, ...(magnetic ? { magnetic: true } : {}) };
    const source = { id: 'prototype-shizen-three-wave-target-coordination', width: WIDTH, height: HEIGHT, colourCount: 6, board, queue: coordinatedShizen.queue, goal: { kind: 'clear-targets', targetIds: [1, 2, 3, 9, 10, 11, 13, 14] }, tags: [] };
    prototypes.push(prototypeMetricSummary(source, { seed: coordinatedShizen.seed, board, nature: true, magneticQueue: coordinatedShizen.magneticQueue }, coordinatedShizen.witness, 'shizen'));
  }
  const restoreBoard = Array(WIDTH * HEIGHT).fill(null); let restoreId = 1;
  for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) { const colour = shizenFourWaveRestorePrototype.rows[y][x]; if (colour !== '.') restoreBoard[cell(x, y)] = { id: restoreId++, colour }; }
  const restoreSource = { id: 'prototype-shizen-four-wave-restore', width: WIDTH, height: HEIGHT, colourCount: 4, board: restoreBoard, queue: shizenFourWaveRestorePrototype.queue, goal: shizenFourWaveRestorePrototype.goal, tags: [] };
  prototypes.push(prototypeMetricSummary(restoreSource, { seed: shizenFourWaveRestorePrototype.seed, board: restoreBoard, nature: true, magneticQueue: shizenFourWaveRestorePrototype.magneticQueue }, shizenFourWaveRestorePrototype.witness, 'shizen'));
  const weatherIntro = arashiConstructionBlueprints.find(level => level.witness.length === 4);
  if (weatherIntro) prototypes.push(prototypeMetricSummary({ ...weatherIntro, id: `prototype-${weatherIntro.id}` }, { seed: weatherIntro.seed, board: weatherIntro.board, nature: true, weather: 'frequent' }, weatherIntro.witness, 'arashi'));
  const causalSource = { id: 'prototype-arashi-causal-jumble-lightning', width: WIDTH, height: HEIGHT, colourCount: 6, board: arashiCausalPrototype.board, queue: arashiCausalPrototype.queue, goal: arashiCausalPrototype.goal, tags: [] };
  prototypes.push(prototypeMetricSummary(causalSource, { seed: arashiCausalPrototype.seed, board: causalSource.board, nature: true, weather: 'frequent' }, arashiCausalPrototype.witness, 'arashi'));
  const coordinatedSource = { id: 'prototype-arashi-three-target-coordination', width: WIDTH, height: HEIGHT, colourCount: 6, board: arashiThreeTargetPrototype.board, queue: arashiThreeTargetPrototype.queue, goal: arashiThreeTargetPrototype.goal, tags: [] };
  prototypes.push(prototypeMetricSummary(coordinatedSource, { seed: arashiThreeTargetPrototype.seed, board: coordinatedSource.board, nature: true, weather: 'frequent' }, arashiThreeTargetPrototype.witness, 'arashi'));
  const width = 6, height = 12, board = Array(width * height).fill(null);
  board[8 * width + 5] = { id: 1, colour: 'red' }; board[9 * width + 5] = { id: 10, colour: 'blue' }; board[10 * width + 5] = { id: 11, colour: 'green' }; board[11 * width + 5] = { id: 12, colour: 'gold' };
  board[8 * width + 4] = { id: 13, colour: 'gold' }; board[9 * width + 4] = { id: 14, colour: 'purple' }; board[10 * width + 4] = { id: 2, colour: 'blue' }; board[11 * width + 4] = { id: 15, colour: 'teal' };
  board[10 * width] = { id: 3, colour: 'purple' }; board[11 * width] = { id: 4, colour: 'red' }; board[10 * width + 1] = { id: 5, colour: 'blue' }; board[11 * width + 1] = { id: 6, colour: 'green' };
  const longQueue = Array.from({ length: 8 }, () => ['blue', 'green']);
  const longWitness = Array.from({ length: 8 }, (_, index) => ({ pivotX: 2 + index % 2, orientation: 'up' }));
  const longSource = { id: 'prototype-arashi-dual-target-weather', width, height, colourCount: 6, board, queue: longQueue, goal: { kind: 'clear-targets', targetIds: [1, 2] }, tags: [] };
  prototypes.push(prototypeMetricSummary(longSource, { seed: 'arashi-dualtarget-292', board, nature: true, weather: 'frequent' }, longWitness, 'arashi'));
  return prototypes;
}

export function generateContent() {
  const pools = generatedLevelPool();
  const curate = (pool, count) => [...pool.values()].sort((a, b) => a.score - b.score || a.id.localeCompare(b.id)).slice(0, count);
  const poolCount = Object.values(pools).reduce((total, pool) => total + pool.size, 0);
  const levels = [...curate(pools.easy, 20), ...curate(pools.chain, 10), ...curate(pools.split, 10), ...curate(pools.multi, 10)].sort((a, b) => a.score - b.score || a.id.localeCompare(b.id));
  levels.forEach((level, index) => { level.number = index + 1; });
  const checksum = hash(JSON.stringify(levels));
  const campaign = {
    count: levels.length, candidatePoolCount: poolCount, generationRevision: GENERATION_REVISION,
    gradingVersion: GRADING_VERSION, category: 'linear',
    curationPolicy: 'Select fifty canonically unique stable boards with 20 one-placement links, 10 two-wave chains, 10 split landings and 10 coupled multi-pair plans; validate required setup placements by perturbing each setup step and retaining only dependencies that break the finish path.',
    orderingPolicy: 'Sort by stored player-facing placement-forgiveness score ascending, then stable content ID; number only after ordering.',
    grading: { formula: '35*(1-seededPlayoutSuccessRate)+10*forcedPlacementShare+10*min(1,(requiredChainDepth-1)/2)+10*min(1,splitLandingDependencies)+8*min(1,requiredRotations)+12*min(1,requiredSetupPairs/2)+5*min(1,(planningLength-1)/2)', sampleBudget: SAMPLE_BUDGET, planningLength: 'committed pair placements in the witnessed winning plan; horizontal input distance is not counted', seededPlayoutScope: '64 seeded samples vary the first placement and replay the remaining witnessed suffix unchanged', setupDependencyScope: 'For each pre-payoff placement, enumerate all other legal single-step placements, replaying the unchanged witnessed suffix; a step counts only when every tested alternative fails.' },
    sampleBudget: SAMPLE_BUDGET, checksum, levels
  };
  const shizen = generateShizenCampaign(), arashi = generateArashiCampaign();
  return deepFreeze({ campaign, tutorials: tutorials(), shizen, arashi });
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const data = generateContent();
  await writeFile(new URL('../src/colour-chains/content-data.ts', import.meta.url), `import type { ChainContentData } from './content-types.js';\n\nexport const contentData: ChainContentData = ${JSON.stringify(data, null, 2)};\n`);
  process.stdout.write(`${data.campaign.count} levels; ${data.campaign.candidatePoolCount} generated unique candidates; ${data.campaign.checksum}\n`);
}
