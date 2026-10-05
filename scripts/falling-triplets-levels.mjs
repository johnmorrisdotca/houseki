import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { applyAction, advanceTicks, createChallenge, findMatches } from '../dist/falling-triplets.js';

export const GENERATION_REVISION = 'houseki-triplets-campaign-1.4';
export const GRADING_VERSION = 'triplets-choice-grade-2';
export const SAMPLE_BUDGET = 64;
const WIDTH = 6, HEIGHT = 13, COLOURS = ['red', 'blue', 'green', 'gold', 'purple'];
const MOTIFS = ['vertical', 'horizontal', 'diagonal', 'crossing', 'cascade'];

function rng(seed) {
  let value = Number.parseInt(createHash('sha256').update(String(seed)).digest('hex').slice(0, 8), 16) || 1;
  return () => { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) / 0x100000000; };
}
const pick = (random, values) => values[Math.floor(random() * values.length)];
const cell = (x, y, width = WIDTH) => y * width + x;
function withIds(board) {
  let id = 1;
  return board.map(gem => gem ? { id: id++, colour: gem.colour, ...(gem.target ? { target: true } : {}) } : null);
}
function add(board, x, y, colour, target = false) { board[cell(x, y)] = { colour, ...(target ? { target: true } : {}) }; }
function hasMatch(board) { return findMatches(board.map((g, i) => g ? { ...g, id: i + 1 } : null), WIDTH, HEIGHT).length > 0; }
function solidDecor(board, random, protectedColumns, forbiddenColours, maximum = 7) {
  const safe = Array.from({ length: WIDTH }, (_, x) => x).filter(x => !protectedColumns.has(x));
  const amount = Math.floor(random() * maximum);
  for (let i = 0; i < amount; i++) {
    const x = pick(random, safe); const occupied = [];
    for (let y = HEIGHT - 1; y >= 0 && board[cell(x, y)] !== null; y--) occupied.push(y);
    const y = HEIGHT - 1 - occupied.length;
    if (y < 1) continue;
    const choices = COLOURS.filter(colour => !forbiddenColours.includes(colour));
    add(board, x, y, pick(random, choices));
  }
}
function cascadeBoard(random) {
  const board = Array(WIDTH * HEIGHT).fill(null);
  const targetColour = pick(random, COLOURS); const chainColour = pick(random, COLOURS.filter(colour => colour !== targetColour));
  const targetX = pick(random, [2, 3]); const safeX = targetX === 2 ? 5 : 0;
  const protectedColumns = new Set([targetX - 1, targetX, targetX + 1, safeX]);
  add(board, targetX, 11, targetColour); add(board, targetX, 12, targetColour);
  add(board, targetX - 1, 12, chainColour); add(board, targetX + 1, 12, chainColour);
  solidDecor(board, random, protectedColumns, [targetColour, chainColour], 8);
  if (hasMatch(board)) return null;
  return { board: withIds(board), targetColour, chainColour, targetX, safeX, protectedColumns: [...protectedColumns] };
}
function motifBoard(motif, serial, attempt) {
  const random = rng(`${GENERATION_REVISION}|${motif}|${serial}|${attempt}`);
  const board = Array(WIDTH * HEIGHT).fill(null);
  if (motif === 'cascade') {
    return cascadeBoard(random);
  }
  const targetColour = pick(random, COLOURS); const c = pick(random, [2, 3]); const protectedColumns = new Set();
  let targetCoord;
  if (motif === 'vertical') {
    targetCoord = [c, 11]; protectedColumns.add(c);
    add(board, c, 11, targetColour, true); add(board, c, 12, targetColour);
  } else if (motif === 'horizontal') {
    targetCoord = [c - 1, 12]; protectedColumns.add(c - 1); protectedColumns.add(c + 1);
    add(board, c - 1, 12, targetColour, true); add(board, c + 1, 12, targetColour);
  } else if (motif === 'diagonal') {
    const left = c === 2 ? 1 : 2; const middle = left + 1; const drop = left + 2;
    targetCoord = [left, 10]; protectedColumns.add(left); protectedColumns.add(middle); protectedColumns.add(drop);
    add(board, left, 10, targetColour, true); add(board, left, 11, pick(random, COLOURS.filter(v => v !== targetColour))); add(board, left, 12, pick(random, COLOURS.filter(v => v !== targetColour)));
    add(board, middle, 11, targetColour); add(board, middle, 12, pick(random, COLOURS.filter(v => v !== targetColour)));
  } else if (motif === 'crossing') {
    targetCoord = [c, 11]; protectedColumns.add(c - 1); protectedColumns.add(c); protectedColumns.add(c + 1);
    add(board, c, 11, targetColour, true); add(board, c, 12, targetColour);
    for (const x of [c - 1, c + 1]) {
      add(board, x, 10, targetColour);
      add(board, x, 11, pick(random, COLOURS.filter(v => v !== targetColour)));
      add(board, x, 12, pick(random, COLOURS.filter(v => v !== targetColour)));
    }
  }
  solidDecor(board, random, protectedColumns, [targetColour], 8);
  if (motif !== 'cascade' && hasMatch(board)) return null;
  const inits = withIds(board);
  const targetId = targetCoord ? inits[cell(...targetCoord)]?.id : undefined;
  return { board: inits, targetColour, targetId, targetX: motif === 'diagonal' ? (targetCoord[0] + 2) : motif === 'horizontal' ? targetCoord[0] + 1 : motif === 'crossing' ? c : motif === 'cascade' ? 5 : c, protectedColumns: [...protectedColumns] };
}
function makeQueue(random, motif, setup, serial) {
  const { targetColour, targetX } = setup;
  if (motif === 'cascade') {
    const fillers = COLOURS.filter(colour => colour !== setup.targetColour && colour !== setup.chainColour);
    const permutations = [fillers, [fillers[0], fillers[2], fillers[1]], [fillers[1], fillers[0], fillers[2]], [fillers[1], fillers[2], fillers[0]], [fillers[2], fillers[0], fillers[1]], [fillers[2], fillers[1], fillers[0]]];
    for (let offset = 0; offset < permutations.length; offset++) {
      const harmless = permutations[(serial + offset) % permutations.length];
      const trial = [...setup.board]; let id = Math.max(0, ...trial.flatMap(gem => gem ? [gem.id] : [])) + 1;
      for (let i = 0; i < 3; i++) trial[cell(setup.safeX, HEIGHT - 3 + i)] = { id: id++, colour: harmless[i] };
      if (findMatches(trial, WIDTH, HEIGHT).length) continue;
      const trigger = [pick(random, fillers), setup.chainColour, setup.targetColour];
      return { queue: [harmless, trigger], witness: [{ x: setup.safeX, orientation: 0 }, { x: targetX, orientation: 0 }] };
    }
    return null;
  }
  const length = 2 + (serial % 3); const diversionCount = length - 1; const nonTarget = COLOURS.filter(colour => colour !== targetColour);
  const queue = [];
  for (let p = 0; p < diversionCount; p++) {
    const set = [...nonTarget]; for (let i = set.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [set[i], set[j]] = [set[j], set[i]]; } set.length = 3;
    if (serial % 7 === 0) set[2] = set[0] === set[1] ? nonTarget[(nonTarget.indexOf(set[0]) + 1) % nonTarget.length] : set[0];
    queue.push(set);
  }
  const orientation = serial % 3; const final = [pick(random, nonTarget), pick(random, nonTarget), pick(random, nonTarget)];
  final[(2 - orientation + 3) % 3] = targetColour; queue.push(final);
  const available = [0, 5, 1, 4, 2, 3].filter(x => x !== targetX);
  const witness = Array.from({ length: diversionCount }, (_, i) => ({ x: available[i % available.length], orientation: serial % 3 }));
  witness.push({ x: targetX, orientation });
  return { queue, witness };
}
function canonicalDuplicateKey(level) {
  const variants = [];
  for (const mirror of [false, true]) {
    const map = new Map(); const label = colour => { if (!map.has(colour)) map.set(colour, map.size); return map.get(colour); };
    const board = [];
    for (let y = 0; y < level.height; y++) for (let px = 0; px < level.width; px++) {
      const x = mirror ? level.width - 1 - px : px; const gem = level.board[cell(x, y, level.width)];
      board.push(gem ? [label(gem.colour), !!gem.target] : null);
    }
    const queue = level.queue.map(piece => piece.map(label));
    const goal = level.goal.type === 'targets' ? { type: 'targets', targetCount: level.goal.targetIds.length } : level.goal;
    variants.push(JSON.stringify([level.width, level.height, level.colourCount, goal, board, queue]));
  }
  return variants.sort()[0];
}
function actionsToPlacement(state, x, orientation) {
  let next = state;
  while (next.active.x !== x) {
    const move = applyAction(next, { kind: x < next.active.x ? 'left' : 'right' });
    if (!move.accepted) return null; next = move.state;
  }
  const cycles = (orientation - next.active.orientation + 3) % 3;
  for (let i = 0; i < cycles; i++) { const step = applyAction(next, { kind: 'cycle-forward' }); if (!step.accepted) return null; next = step.state; }
  const placed = applyAction(next, { kind: 'hard-drop' }); return placed.accepted ? placed.state : null;
}
function markedAxes(state) {
  if (state.phase !== 'clear-mark' || !state.pendingClear?.length) return new Set();
  const width = state.settings.width, totalHeight = state.settings.height + 3, marked = new Set(state.pendingClear);
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]]; const axes = new Set();
  for (const index of marked) {
    const x = index % width, y = Math.floor(index / width), colour = state.board[index]?.colour; if (!colour) continue;
    for (let direction = 0; direction < directions.length; direction++) {
      const [dx, dy] = directions[direction]; let count = 1;
      for (const sign of [-1, 1]) { let nx = x + dx * sign, ny = y + dy * sign; while (nx >= 0 && nx < width && ny >= 0 && ny < totalHeight && state.board[cell(nx, ny, width)]?.colour === colour) { count++; nx += dx * sign; ny += dy * sign; } }
      if (count >= 3) axes.add(direction);
    }
  }
  return axes;
}
function settleWithMetrics(state, targetIds = []) {
  let next = state; let budget = 0; let directions = 0; let targetCrossing = false;
  while (['clear-mark', 'clear-remove', 'gravity'].includes(next.phase) && budget++ < 100_000) {
    const axes = markedAxes(next);
    directions = Math.max(directions, axes.size);
    if (axes.size >= 2 && targetIds.some(id => next.pendingClear?.some(index => next.board[index]?.id === id))) targetCrossing = true;
    next = advanceTicks(next, 1).state;
  }
  return { state: next, directions, targetCrossing };
}
function settle(state) {
  return settleWithMetrics(state).state;
}
function simulateWitness(level, pieces) {
  let state = createChallenge({ seed: level.seed, width: level.width, height: level.height, colourCount: level.colourCount, board: level.board, queue: level.queue, goal: level.goal });
  let directions = 0, targetCrossing = false; const steps = [];
  for (let i = 0; i < pieces; i++) {
    const result = actionsToPlacement(state, level.witness[i].x, level.witness[i].orientation); if (!result) return null;
    const settled = settleWithMetrics(result, level.goal.type === 'targets' ? level.goal.targetIds : []); state = settled.state; directions = Math.max(directions, settled.directions); targetCrossing ||= settled.targetCrossing;
    steps.push({ state, waves: state.waves });
    if (state.phase === 'won') return { state, directions, targetCrossing, steps };
    if (state.phase !== 'falling') return null;
  }
  return { state, directions, targetCrossing, steps };
}
function playWitnessPrefix(level, pieces) {
  return simulateWitness(level, pieces)?.state ?? null;
}
function followSuffix(state, level, start) {
  let current = state;
  for (let i = start; i < level.witness.length; i++) {
    if (current.phase === 'won') return current;
    if (current.phase !== 'falling') return current;
    current = actionsToPlacement(current, level.witness[i].x, level.witness[i].orientation);
    if (!current) return null;
    current = settle(current);
  }
  return current;
}
function probedChoiceMetrics(level) {
  const budgets = []; const successful = []; let forced = 0;
  for (let i = 0; i < level.witness.length; i++) {
    const state = playWitnessPrefix(level, i); if (!state || state.phase !== 'falling') break;
    let legal = 0, wins = 0;
    for (let x = 0; x < level.width; x++) for (let orientation = 0; orientation < 3; orientation++) {
      const result = actionsToPlacement(state, x, orientation); if (!result) continue;
      legal++;
      const final = followSuffix(settle(result), level, i + 1);
      if (final?.phase === 'won') wins++;
    }
    budgets.push(legal); successful.push(wins); if (wins <= 1) forced++;
  }
  const goalPreservingChoices = successful.reduce((a, b) => a + b, 0); const probedChoices = budgets.reduce((a, b) => a + b, 0);
  return { legalChoiceBreadth: budgets.length ? budgets.reduce((a, b) => a + b, 0) / budgets.length : 0, goalPreservingChoices, probedChoices, goalPreservingChoiceShare: probedChoices ? goalPreservingChoices / probedChoices : 0, forcedChoiceShare: budgets.length ? forced / budgets.length : 1 };
}
function trialRandomPlay(level, seed) {
  const random = rng(seed); let state = createChallenge({ seed: level.seed, width: level.width, height: level.height, colourCount: level.colourCount, board: level.board, queue: level.queue, goal: level.goal });
  while (state.phase === 'falling' && state.active) {
    const x = Math.floor(random() * level.width); const orientation = Math.floor(random() * 3);
    const placed = actionsToPlacement(state, x, orientation);
    if (placed) state = settle(placed);
    else { const fallback = actionsToPlacement(state, state.active.x, state.active.orientation); if (!fallback) return false; state = settle(fallback); }
  }
  return state.phase === 'won';
}
function metricRaw(level) {
  let successes = 0;
  for (let sample = 0; sample < SAMPLE_BUDGET; sample++) if (trialRandomPlay(level, `${GRADING_VERSION}|${level.id}|${sample}`)) successes++;
  const choices = probedChoiceMetrics(level);
  const witnessRun = simulateWitness(level, level.witness.length); const witnessFinal = witnessRun?.state;
  const payoffPieces = witnessFinal?.phase === 'won' ? witnessFinal.completedPieces : level.witness.length;
  return {
    seededGoalSuccesses: successes,
    seededGoalSamples: SAMPLE_BUDGET,
    seededGoalSuccessRate: successes / SAMPLE_BUDGET,
    ...choices,
    setupPiecesBeforePayoff: Math.max(0, payoffPieces - 1),
    requiredChainDepth: level.goal.type === 'chain' ? level.goal.minimumChain : Math.max(1, witnessFinal?.maxChain ?? 1),
    witnessPlanningLength: level.witness.length,
    payoffDirections: witnessRun?.directions ?? 0
  };
}
function percentile(values, value) {
  const less = values.filter(item => item < value).length; const equal = values.filter(item => item === value).length;
  return values.length <= 1 ? 0 : (less + (equal - 1) / 2) / (values.length - 1);
}
function hashId(text) { return createHash('sha256').update(text).digest('hex').slice(0, 12); }

export function generateCandidates(count = 100) {
  if (!Number.isInteger(count) || count < 1 || count > 200) throw new RangeError('Candidate selection count must be 1–200');
  const poolCount = count + Math.max(10, Math.ceil(count * 0.1));
  const selected = []; const keys = new Set(); const counters = Object.fromEntries(MOTIFS.map(motif => [motif, 0])); const familyCounts = Object.fromEntries(MOTIFS.map(motif => [motif, 0])); const familyQuotas = Object.fromEntries(MOTIFS.map((motif, index) => [motif, Math.floor(poolCount / MOTIFS.length) + (index < poolCount % MOTIFS.length ? 1 : 0)])); let serial = 0, attempts = 0;
  while (selected.length < poolCount && attempts < 10_000) {
    const motif = MOTIFS[serial % MOTIFS.length]; const ordinal = counters[motif]++; serial++; attempts++;
    if (familyCounts[motif] >= familyQuotas[motif]) continue;
    const setup = motifBoard(motif, ordinal, 0); if (!setup) continue;
    const random = rng(`${motif}|queue|${ordinal}`); const queued = makeQueue(random, motif, setup, ordinal); if (!queued) continue;
    const { queue, witness } = queued;
    const goal = motif === 'cascade' ? { type: 'chain', minimumChain: 2 } : { type: 'targets', targetIds: [setup.targetId] };
    const provisional = { id: `${motif}-${String(ordinal).padStart(3, '0')}`, seed: `campaign-${motif}-${ordinal}`, number: 0, width: WIDTH, height: HEIGHT, colourCount: 5, goal, board: setup.board, queue, witness, tags: [] };
    try { createChallenge({ seed: provisional.seed, width: WIDTH, height: HEIGHT, colourCount: 5, board: provisional.board, queue, goal, witness }); } catch { continue; }
    if (motif === 'cascade') {
      const run = simulateWitness(provisional, witness.length);
      if (!run || run.steps.length !== 2 || run.steps[0].state.phase !== 'falling' || run.steps[0].state.maxChain !== 0 || run.steps[0].waves.length !== 0 || run.state.phase !== 'won' || run.state.maxChain < 2 || run.state.waves.length < 2 || run.state.waves[0].chain !== 1 || run.state.waves[1].chain !== 2) continue;
    }
    if (motif === 'crossing' && !simulateWitness(provisional, witness.length)?.targetCrossing) continue;
    const key = canonicalDuplicateKey(provisional); if (keys.has(key)) continue; keys.add(key);
    const id = `ft-${hashId(key)}`;
    const titleBase = { vertical: ['Vertical Steps', '縦の一歩'], horizontal: ['Side-by-Side', '横並び'], diagonal: ['Diagonal Thread', '斜めの糸'], crossing: ['Crossing Lines', '交差する線'], cascade: ['Cascade Starter', '連鎖の始まり'] }[motif];
    const tags = [motif === 'cascade' ? 'two-wave-chain' : `${motif}-clear`, 'target-planning'];
    if (witness.some(step => step.orientation !== 0)) tags.push('cycle-required');
    if (motif === 'cascade') tags.push('2-wave-chain');
    if (queue.length > 2) tags.push('setup-sequence');
    if (setup.board.filter(Boolean).length >= 8) tags.push('space-management');
    selected.push({ ...provisional, id, title: { en: `${titleBase[0]} ${ordinal + 1}`, ja: `${titleBase[1]} ${ordinal + 1}` }, canonicalKeyHash: createHash('sha256').update(key).digest('hex'), key, tags });
    familyCounts[motif]++;
  }
  if (selected.length !== poolCount) throw new Error(`Only generated ${selected.length} distinct witnessed candidates after ${attempts} attempts`);
  return selected;
}

export function gradeAndOrder(candidates) {
  const enriched = candidates.map(candidate => ({ ...candidate, rawMetrics: metricRaw(candidate) }));
  const values = {
    success: enriched.map(item => item.rawMetrics.seededGoalSuccessRate),
    forced: enriched.map(item => item.rawMetrics.forcedChoiceShare),
    forgiveness: enriched.map(item => item.rawMetrics.goalPreservingChoiceShare),
    dependency: enriched.map(item => item.rawMetrics.setupPiecesBeforePayoff + item.rawMetrics.requiredChainDepth + item.rawMetrics.payoffDirections),
    length: enriched.map(item => item.rawMetrics.witnessPlanningLength)
  };
  const scored = enriched.map(item => {
    const m = item.rawMetrics;
    const lowSuccess = 1 - percentile(values.success, m.seededGoalSuccessRate);
    const choiceDemand = 0.5 * percentile(values.forced, m.forcedChoiceShare) + 0.5 * (1 - percentile(values.forgiveness, m.goalPreservingChoiceShare));
    const dependencies = percentile(values.dependency, m.setupPiecesBeforePayoff + m.requiredChainDepth + m.payoffDirections);
    const planning = percentile(values.length, m.witnessPlanningLength);
    const score = Math.round(100 * (0.45 * lowSuccess + 0.25 * choiceDemand + 0.20 * dependencies + 0.10 * planning));
    return { ...item, score, marks: Math.min(5, 1 + Math.floor(score / 20)), gradingVersion: GRADING_VERSION, proofStatus: 'engine-witness-verified', reviewStatus: 'human-review-pending', rawMetrics: m };
  });
  return scored.sort((a, b) => a.score - b.score || a.id.localeCompare(b.id)).map((item, index) => ({ ...item, number: index + 1 }));
}

export function generateCampaign(count = 100) {
  const pool = gradeAndOrder(generateCandidates(count));
  const motifs = ['vertical-clear', 'horizontal-clear', 'diagonal-clear', 'crossing-clear', 'two-wave-chain'];
  const curated = motifs.flatMap(tag => {
    const ranked = pool.filter(level => level.tags[0] === tag);
    const quota = Math.floor(count / motifs.length) + (motifs.indexOf(tag) < count % motifs.length ? 1 : 0);
    return Array.from({ length: quota }, (_, index) => ranked[Math.round(index * (ranked.length - 1) / Math.max(1, quota - 1))]);
  });
  const levels = gradeAndOrder(curated).map(({ key: _canonicalKey, ...level }) => level);
  const checksum = createHash('sha256').update(JSON.stringify(levels)).digest('hex');
  return { count, candidatePoolCount: pool.length, generationRevision: GENERATION_REVISION, gradingVersion: GRADING_VERSION, category: '6×13 visible well / 5 colours', curationPolicy: `Generate 10% surplus; retain score-quantile coverage within each of five mechanic families; then regrade and order the selected ${count}.`, orderingPolicy: 'single-category/nondecreasing-measured-score/stable-id-tie-break', grading: { weights: { lowSeededSuccessPercentile: 0.45, goalPreservingChoiceAndForcedChoicePercentile: 0.25, setupChainAndDirectionDemandPercentile: 0.20, witnessLengthPercentile: 0.10 }, seededPlayouts: '64 independent fixed-seed legal placement runs per candidate', choiceProbe: 'Enumerate legal column/orientation choices at each witnessed setup state and replay the remaining witness suffix; low goal-preserving choice share and high forced-choice share increase measured demand.', percentileScope: 'within the declared 6×13/five-colour category; higher raw difficulty percentile increases score', scoreRule: 'round(100 × weighted percentile blend); marks=min(5,1+floor(score/20))' }, sampleBudget: SAMPLE_BUDGET, checksum, levels };
}

export function independentGoalReached(state, goal) {
  if (goal.type === 'targets') return goal.targetIds.every(id => !state.board.some(gem => gem?.id === id));
  if (goal.type === 'chain') return state.maxChain >= goal.minimumChain;
  return state.board.every(gem => gem === null);
}

export function tutorialDefinitions() {
  const board = Array(WIDTH * HEIGHT).fill(null);
  board[cell(2, 11)] = { id: 1, colour: 'red', target: true }; board[cell(2, 12)] = { id: 2, colour: 'red' };
  const cycle = { type: 'targets', targetIds: [1] };
  const diagonalBoard = Array(WIDTH * HEIGHT).fill(null);
  diagonalBoard[cell(1, 10)] = { id: 1, colour: 'red', target: true }; diagonalBoard[cell(1, 11)] = { id: 2, colour: 'blue' }; diagonalBoard[cell(1, 12)] = { id: 3, colour: 'gold' };
  diagonalBoard[cell(2, 11)] = { id: 4, colour: 'red' }; diagonalBoard[cell(2, 12)] = { id: 5, colour: 'purple' };
  const cascadeSetup = cascadeBoard(rng('lesson-two-wave-cascade'));
  if (!cascadeSetup) throw new Error('Could not make the stable tutorial cascade board');
  const cascadeQueue = makeQueue(rng('lesson-two-wave-cascade-queue'), 'cascade', cascadeSetup, 0);
  if (!cascadeQueue) throw new Error('Could not make the tutorial cascade queue');
  return [
    { id: 'lesson-cycle-and-land', title: { en: 'Cycle and Land', ja: '回して着地' }, objective: { en: 'Place the red gem above the marked pair.', ja: '赤いジェムを印の上に置きます。' }, setup: { board, queue: [['red', 'blue', 'green'], ['gold', 'purple', 'blue']], goal: cycle, witness: [{ x: 2, orientation: 2 }] }, steps: [{ instruction: { en: 'Cycle forward to move red to the bottom.', ja: '前へ回して赤を一番下にします。' }, action: 'cycle-forward' }, { instruction: { en: 'Cycle once more, then place the triplet over the target column.', ja: 'もう一度回して、印の列に置きます。' }, action: 'cycle-forward' }], tags: ['cycling', 'vertical-clear'] },
    { id: 'lesson-diagonal-clear', title: { en: 'Diagonal Thread', ja: '斜めの糸' }, objective: { en: 'Complete the rising diagonal through the marked gem.', ja: '印のジェムを通る斜めの列を完成させます。' }, setup: { board: diagonalBoard, queue: [['blue', 'gold', 'red'], ['green', 'purple', 'gold']], goal: cycle, witness: [{ x: 3, orientation: 0 }] }, steps: [{ instruction: { en: 'Keep the red gem at the bottom and land in the open right column.', ja: '赤を一番下にして、右の空いた列に着地します。' }, action: 'hard-drop' }], tags: ['diagonal-clear', 'target-planning'] },
    { id: 'lesson-two-wave-cascade', title: { en: 'Two-Wave Cascade', ja: '二段の連鎖' }, objective: { en: 'Set up a clear, then trigger two waves with one placement.', ja: '準備をして、一回の着地で二段の消去を起こします。' }, setup: { board: cascadeSetup.board, queue: cascadeQueue.queue, goal: { type: 'chain', minimumChain: 2 }, witness: cascadeQueue.witness }, steps: [{ instruction: { en: 'Place the first triplet in the open side column without making a match.', ja: '最初のトリプレットを端の空いた列に置き、マッチを作らないようにします。' }, action: 'hard-drop' }, { instruction: { en: 'Place the matching-colour gem at the bottom above its pair to start the first wave.', ja: '同じ色のジェムが一番下になるように回し、ペアの上に置いて最初の波を始めます。' }, action: 'hard-drop' }, { instruction: { en: 'Watch gravity reveal the second wave.', ja: '重力で二段目が現れるのを見ます。' }, action: 'wait' }], tags: ['two-wave-chain', 'gravity'] }
  ];
}

export async function writeCampaign(path = resolve('src/falling-triplets/content-data.ts')) {
  const campaign = generateCampaign(100); const tutorials = tutorialDefinitions();
  const literal = JSON.stringify({ campaign, tutorials }, null, 2);
  await writeFile(path, `// Generated offline by scripts/falling-triplets-levels.mjs.\nexport const contentData = ${literal} as const;\n`, 'utf8');
  return campaign;
}
if (process.argv[1] && resolve(process.argv[1]) === resolve('scripts/falling-triplets-levels.mjs')) {
  const campaign = await writeCampaign();
  process.stdout.write(`Generated ${campaign.count} distinct levels (${campaign.levels[0].score}–${campaign.levels.at(-1).score}); ${campaign.levels[0].id} → ${campaign.levels.at(-1).id}\n`);
}
