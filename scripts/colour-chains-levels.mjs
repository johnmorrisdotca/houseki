import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { applyAction, advanceTicks, createChallenge } from '../dist/colour-chains.js';

export const GENERATION_REVISION = 'colour-chains-campaign-1.3.1';
export const GRADING_VERSION = 'chains-placement-forgiveness-1';
export const SAMPLE_BUDGET = 64;
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

export function generateContent() {
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
    grading: { formula: '35*(1-seededPlayoutSuccessRate)+10*forcedPlacementShare+10*min(1,(requiredChainDepth-1)/2)+10*min(1,splitLandingDependencies)+8*min(1,requiredRotations)+12*min(1,requiredSetupPairs/2)+5*min(1,(planningLength-1)/2)', sampleBudget: SAMPLE_BUDGET, planningLength: 'committed pair placements in the witnessed winning plan; horizontal input distance is not counted' },
    sampleBudget: SAMPLE_BUDGET, checksum, levels
  };
  return deepFreeze({ campaign, tutorials: tutorials() });
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const data = generateContent();
  await writeFile(new URL('../src/colour-chains/content-data.ts', import.meta.url), `import type { ChainContentData } from './content-types.js';\n\nexport const contentData: ChainContentData = ${JSON.stringify(data, null, 2)};\n`);
  process.stdout.write(`${data.campaign.count} levels; ${data.campaign.candidatePoolCount} generated unique candidates; ${data.campaign.checksum}\n`);
}
