import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { applyAction, advanceTicks, createGame, legalActions, validateChallengeWitness } from '../dist/gem-swap.js';

export const GENERATION_REVISION = 'gem-swap-campaign-1.3.0';
export const GRADING_VERSION = 'swap-choice-forgiveness-1';
export const SAMPLE_BUDGET = 24;
export const GRADING_WEIGHTS = Object.freeze({ seededPlayoutDifficulty: 30, choiceDifficulty: 18, objectiveCoordination: 12, chainDepth: 10, witnessLength: 25, specialCombination: 5 });
const OUTPUT = resolve('src/gem-swap/content.ts');
const CATEGORIES = ['score', 'collect', 'chain', 'seals', 'combined'];
const QUOTAS = 10;
const CANDIDATE_POOL = 18;
const LENGTHS = {
  score: [1, 1, 2, 2, 3, 3, 4, 4, 5, 6],
  collect: [1, 2, 2, 3, 3, 4, 4, 5, 6, 6],
  chain: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6],
  seals: [1, 2, 2, 3, 3, 4, 4, 5, 6, 6],
  combined: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6]
};
const NAMES = {
  score: ['Clear Horizon', 'Quiet Current', 'Bright Measure', 'Blue Crossing', 'Open Span', 'Silver Path', 'Far Current', 'Evening Tide', 'Long Passage', 'Last Horizon'],
  collect: ['Red Thread', 'Colour Ledger', 'Gathered Light', 'Green Passage', 'Gold Measure', 'Purple Current', 'Small Collection', 'Deep Palette', 'Many Hues', 'Last Colour'],
  chain: ['First Echo', 'Linked Current', 'Cascade Turn', 'Second Echo', 'Rising Sequence', 'Threefold Fall', 'Echo Chamber', 'Layered Current', 'Long Cascade', 'Final Echo'],
  seals: ['First Seal', 'Quiet Guard', 'Paired Marks', 'Stone Ledger', 'Fixed Points', 'Seal Passage', 'Joined Marks', 'Deep Guard', 'Lasting Seal', 'Final Marks'],
  combined: ['Measured Route', 'Three Bearings', 'Shared Current', 'Crossing Marks', 'Threefold Plan', 'Colour and Stone', 'Joined Objectives', 'Far Bearings', 'Long Alignment', 'Final Accord']
};
const NAMES_JA = {
  score: ['晴れた地平', '静かな流れ', '明るい目盛り', '青い交差点', '開けた道', '銀色の小径', '遠い潮流', '夕べの潮', '長い航路', '最後の地平'],
  collect: ['赤い糸', '色の記録', '集まる光', '緑の道', '金色の目盛り', '紫の流れ', '小さな収集', '深い色彩', '多彩な色', '最後の色'],
  chain: ['最初の反響', '連なる流れ', '連鎖の転回', '二度目の反響', '上昇する連鎖', '三段の落下', '反響の間', '重なる流れ', '長い連鎖', '最後の反響'],
  seals: ['最初の封印', '静かな守り', '対の印', '石の記録', '定まる点', '封印の道', '結ばれた印', '深い守り', '残る封印', '最後の印'],
  combined: ['計られた道', '三つの方角', '共有する流れ', '交差する印', '三段の計画', '色と石', '結ばれた目標', '遠い方角', '長い整列', '最後の調和']
};
const hash = value => createHash('sha256').update(value).digest('hex');
const stable = value => Array.isArray(value) ? `[${value.map(stable).join(',')}]` : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}` : JSON.stringify(value);
function random(seed) {
  let value = Number.parseInt(hash(String(seed)).slice(0, 8), 16) || 1;
  return () => { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) / 0x1_0000_0000; };
}
function settle(state, action) {
  const first = applyAction(state, action);
  if (!first.accepted) return null;
  const result = advanceTicks(first.state, 3600);
  return { state: result.state, events: [...first.events, ...result.events] };
}
function colorCounts(state) { return state.clearedByColour; }
function chooseAction(state, rng) {
  const moves = legalActions(state).filter(action => action.kind === 'swap');
  return moves.length ? moves[Math.floor(rng() * moves.length)] : null;
}
function createPath(seed, length, category, ordinal) {
  const challenge = { moveLimit: length, goals: [{ kind: 'score', target: 9_000_000 }] };
  let state = createGame({ mode: 'challenge', preset: 'compact', seed, challenge });
  const rng = random(`${GENERATION_REVISION}|path|${category}|${ordinal}|${seed}`);
  const moves = []; const removedByMove = []; const chainBefore = []; const coloursAddedByMove = []; const eventsByMove = [];
  for (let move = 0; move < length; move++) {
    chainBefore.push(state.bestChain);
    let action = chooseAction(state, rng);
    if (!action) return null;
    if (category === 'chain') {
      let best = null;
      for (const candidate of legalActions(state).filter(item => item.kind === 'swap')) {
        const trial = settle(state, candidate);
        if (!trial || trial.state.bestChain <= state.bestChain) continue;
        const value = trial.state.bestChain * 100 + trial.state.score - state.score;
        if (!best || value > best.value || (value === best.value && candidate.from * 144 + candidate.to < best.action.from * 144 + best.action.to)) best = { action: candidate, value };
      }
      if (best) action = best.action;
    }
    const previousCounts = { ...state.clearedByColour };
    const played = settle(state, action);
    if (!played) return null;
    moves.push(action);
    removedByMove.push(played.events.filter(event => event.type === 'cells-removed').flatMap(event => event.cells));
    eventsByMove.push(played.events);
    state = played.state;
    coloursAddedByMove.push(Object.fromEntries(Object.keys(previousCounts).map(colour => [colour, state.clearedByColour[colour] - previousCounts[colour]])));
    if (move < length - 1 && state.outcome) return null;
  }
  const lastCells = [...new Set(removedByMove.at(-1) ?? [])];
  const previouslyRemoved = new Set(removedByMove.slice(0, -1).flat());
  const finalFreshCells = lastCells.filter(cell => !previouslyRemoved.has(cell));
  const lastCounts = coloursAddedByMove.at(-1) ?? {};
  const collectColour = Object.keys(lastCounts).filter(colour => lastCounts[colour] > 0).sort((a, b) => (state.clearedByColour[b] ?? 0) - (state.clearedByColour[a] ?? 0) || a.localeCompare(b))[0];
  if (category === 'chain' && !(state.bestChain >= 2 && state.bestChain > (chainBefore.at(-1) ?? 0))) return null;
  if (['seals', 'combined'].includes(category) && !finalFreshCells.length) return null;
  if (category === 'collect' && !collectColour) return null;
  if (category === 'combined' && !collectColour) return null;
  return { seed, length, state, moves, removedByMove, chainBefore, finalFreshCells, collectColour, eventsByMove };
}
function optionsFor(path, category) {
  const state = path.state; const goals = [];
  const seals = ['seals', 'combined'].includes(category) ? path.finalFreshCells.slice(0, Math.min(category === 'combined' ? 2 : 3, path.finalFreshCells.length)).map(cell => ({ cell, layers: 1 })) : undefined;
  if (category === 'score' || category === 'combined') goals.push({ kind: 'score', target: state.score });
  if (category === 'collect' || category === 'combined') goals.push({ kind: 'collect', colour: path.collectColour, target: state.clearedByColour[path.collectColour] });
  if (category === 'chain') goals.push({ kind: 'chain', target: state.bestChain });
  if (category === 'seals' || category === 'combined') goals.push({ kind: 'seals' });
  return { mode: 'challenge', preset: 'compact', seed: path.seed, challenge: { moveLimit: path.length, goals, ...(seals ? { seals } : {}) } };
}
function goalProgress(state, options) {
  return options.challenge.goals.map(goal => {
    if (goal.kind === 'score') return state.score / goal.target;
    if (goal.kind === 'collect') return state.clearedByColour[goal.colour] / goal.target;
    if (goal.kind === 'chain') return state.bestChain / goal.target;
    return state.sealsCleared / options.challenge.seals.reduce((sum, seal) => sum + seal.layers, 0);
  });
}
function measureChoices(options) {
  const initial = createGame(options); const legal = legalActions(initial).filter(action => action.kind === 'swap');
  let progressing = 0;
  for (const action of legal) {
    const played = settle(initial, action);
    if (played && goalProgress(played.state, options).some(value => value > 0)) progressing++;
  }
  return { legalSwapCount: legal.length, initiallyProgressingSwaps: progressing, initialProgressingShare: legal.length ? progressing / legal.length : 0 };
}
function sampledSuccessRate(options, seedLabel) {
  const rng = random(`${GENERATION_REVISION}|grade|${seedLabel}`); let successes = 0;
  for (let sample = 0; sample < SAMPLE_BUDGET; sample++) {
    let state = createGame(options);
    for (let move = 0; move < options.challenge.moveLimit && !state.outcome; move++) {
      const action = chooseAction(state, rng);
      if (!action) break;
      const played = settle(state, action); if (!played) break; state = played.state;
    }
    if (state.outcome === 'won') successes++;
  }
  return successes / SAMPLE_BUDGET;
}
function canonicalKey(level) {
  const width = level.width, height = level.height;
  const transforms = width === height ? [
    (x, y) => [x, y], (x, y) => [width - 1 - x, y], (x, y) => [x, height - 1 - y], (x, y) => [width - 1 - x, height - 1 - y],
    (x, y) => [y, x], (x, y) => [width - 1 - y, x], (x, y) => [y, height - 1 - x], (x, y) => [width - 1 - y, height - 1 - x]
  ] : [(x, y) => [x, y], (x, y) => [width - 1 - x, y], (x, y) => [x, height - 1 - y], (x, y) => [width - 1 - x, height - 1 - y]];
  return transforms.map(transform => {
    const colours = new Map(); const board = [];
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const [sx, sy] = transform(x, y); const cell = sy * width + sx; const gem = level.board[cell];
      if (!gem) board.push(null);
      else { if (!colours.has(gem.colour)) colours.set(gem.colour, colours.size); board.push([colours.get(gem.colour), gem.kind ?? 'normal']); }
    }
    const goals = level.challenge.goals.map(goal => goal.kind === 'collect' ? { ...goal, colour: colours.get(goal.colour) } : goal).sort((a, b) => stable(a).localeCompare(stable(b)));
    const seals = (level.challenge.seals ?? []).map(seal => { const [x, y] = [seal.cell % width, Math.floor(seal.cell / width)]; const [tx, ty] = transform(x, y); return { cell: ty * width + tx, layers: seal.layers }; }).sort((a, b) => a.cell - b.cell);
    return stable({ width, height, board, moveLimit: level.challenge.moveLimit, goals, seals });
  }).sort()[0];
}
function scoreLevel(level) {
  const choices = measureChoices(level.options);
  const successRate = sampledSuccessRate(level.options, level.id);
  const objectives = level.challenge.goals.length;
  const witnessMoves = level.challenge.moveLimit;
  const requiredChain = level.challenge.goals.find(goal => goal.kind === 'chain')?.target ?? 1;
  const sealDepth = (level.challenge.seals ?? []).reduce((sum, seal) => sum + seal.layers, 0);
  const coordination = Math.min(1, (objectives - 1) / 2 + sealDepth / 6);
  const events = level.witnessEvents;
  const specialCreations = events.filter(event => event.type === 'special-created').length;
  const specialActivations = events.filter(event => event.type === 'special-activated').length;
  const specialCombinations = events.filter(event => event.type === 'special-combination').length;
  const score = GRADING_WEIGHTS.seededPlayoutDifficulty * (1 - successRate)
    + GRADING_WEIGHTS.choiceDifficulty * (1 - choices.initialProgressingShare)
    + GRADING_WEIGHTS.objectiveCoordination * coordination
    + GRADING_WEIGHTS.chainDepth * Math.min(1, (requiredChain - 1) / 2)
    + GRADING_WEIGHTS.witnessLength * Math.min(1, (witnessMoves - 1) / 5)
    + GRADING_WEIGHTS.specialCombination * Math.min(1, specialCombinations);
  return { ...choices, seededPlayoutSamples: SAMPLE_BUDGET, seededPlayoutSuccessRate: Number(successRate.toFixed(6)), objectiveCount: objectives, requiredChainDepth: requiredChain, sealLayers: sealDepth, witnessMoves, planningLength: witnessMoves, specialCreations, specialActivations, specialCombinations, difficultyScore: Math.round(score * 100) / 100 };
}
function makeLevel(path, category, position) {
  const options = optionsFor(path, category); const id = `swap-${hash(stable({ seed: path.seed, challenge: options.challenge })).slice(0, 12)}`;
  const witness = path.moves.flatMap(action => [{ kind: 'action', action }, { kind: 'ticks', count: 3600 }]);
  const proven = validateChallengeWitness(options, witness);
  if (!proven.valid) return null;
  const board = createGame(options).board;
  const level = {
    id, number: 0, title: { en: NAMES[category][position], ja: NAMES_JA[category][position] }, options, width: 6, height: 6,
    colourCount: 5, seed: path.seed, challenge: options.challenge, witness, witnessEvents: path.eventsByMove.flat(), canonicalKeyHash: '', tags: [category, ...(path.length >= 4 ? ['multi-move-planning'] : []), ...(path.state.bestChain > 1 ? ['cascade'] : []), ...(path.eventsByMove.flat().some(event => event.type === 'special-created') ? ['special-creation'] : []), ...(path.eventsByMove.flat().some(event => event.type === 'special-combination') ? ['special-combination'] : [])],
    rawMetrics: {}, difficultyScore: 0, difficultyMarks: 1, gradingVersion: GRADING_VERSION, proofStatus: 'engine-witness-verified', reviewStatus: 'human-review-pending'
  };
  level.canonicalKeyHash = hash(canonicalKey({ ...level, board }));
  level.rawMetrics = scoreLevel(level);
  level.difficultyScore = level.rawMetrics.difficultyScore;
  level.difficultyMarks = Math.min(5, 1 + Math.floor(level.difficultyScore / 20));
  delete level.witnessEvents;
  return level;
}
function makeCandidate(seed, length, category, position) {
  const path = createPath(seed, length, category, position);
  return path ? makeLevel(path, category, position) : null;
}
function campaignLevels() {
  const selected = []; const keys = new Set(); const usedIds = new Set();
  for (const category of CATEGORIES) {
    const candidates = []; const categoryKeys = new Set();
    for (let seed = 0; candidates.length < CANDIDATE_POOL && seed < 100_000; seed++) {
      const position = candidates.length % QUOTAS; const length = LENGTHS[category][position];
      const level = makeCandidate(seed, length, category, position);
      if (!level || usedIds.has(level.id) || keys.has(level.canonicalKeyHash) || categoryKeys.has(level.canonicalKeyHash)) continue;
      usedIds.add(level.id); keys.add(level.canonicalKeyHash); categoryKeys.add(level.canonicalKeyHash); candidates.push({ ...level, category });
    }
    if (candidates.length !== CANDIDATE_POOL) throw new Error(`Could not generate ${CANDIDATE_POOL} unique witnessed ${category} candidates`);
    candidates.sort((a, b) => a.difficultyScore - b.difficultyScore || a.id.localeCompare(b.id));
    for (let index = 0; index < QUOTAS; index++) {
      const poolIndex = Math.floor(index * (CANDIDATE_POOL - 1) / (QUOTAS - 1));
      const chosen = candidates[poolIndex];
      selected.push({ ...chosen, title: { en: NAMES[category][index], ja: NAMES_JA[category][index] } });
    }
  }
  selected.sort((a, b) => a.difficultyScore - b.difficultyScore || a.id.localeCompare(b.id));
  return selected.map((level, index) => ({ ...level, number: index + 1 }));
}
function generateLessons() {
  const lessons = [];
  const basicStart = createGame({ preset: 'compact', seed: 8001 });
  const valid = legalActions(basicStart).find(action => action.kind === 'swap');
  const invalid = invalidNeighbor(basicStart);
  lessons.push({ id: 'gem-swap-lesson-basics', title: { en: 'Make a match', ja: 'マッチを作る' }, initial: { preset: 'compact', seed: 8001 }, steps: [
    { kind: 'action', id: 'invalid-return', action: invalid, accepted: false, reason: 'swap-makes-no-match', text: { en: 'This pair makes no line of three, so it returns unchanged.', ja: '3つ並ばないため、この交換は元に戻ります。' } },
    { kind: 'action', id: 'first-match', action: valid, accepted: true, event: 'match-marked', text: { en: 'Swap neighbouring gems to make a line of three.', ja: '隣り合う宝石を交換して、3つ並べましょう。' } },
    { kind: 'ticks', id: 'watch-refill', count: 3600, text: { en: 'Watch the cleared cells refill before the next turn.', ja: '次の手の前に、消えた場所が補充される様子を見ましょう。' } }
  ], witness: [{ kind: 'action', action: valid }, { kind: 'ticks', count: 3600 }], reviewStatus: 'human-review-pending' });
  lessons.push(findBeamLesson());
  lessons.push(findSealLesson());
  return lessons;
}
function invalidNeighbor(state) {
  const legal = new Set(legalActions(state).filter(action => action.kind === 'swap').map(action => `${action.from}:${action.to}`));
  const width = state.settings.width, height = state.settings.height;
  for (let from = 0; from < state.board.length; from++) for (const to of [from + 1, from + width]) {
    if (to >= state.board.length || (to === from + 1 && Math.floor(from / width) !== Math.floor(to / width)) || !state.board[from] || !state.board[to]) continue;
    if (!legal.has(`${from}:${to}`)) return { kind: 'swap', from, to };
  }
  throw new Error('No invalid adjacent swap found for the first lesson');
}
function findBeamLesson() {
  for (let seed = 1; seed < 100_000; seed++) {
    const start = createGame({ preset: 'compact', seed });
    for (const first of legalActions(start).filter(action => action.kind === 'swap')) {
      const result = settle(start, first); if (!result) continue;
      const created = result.events.find(event => event.type === 'special-created' && (event.kind === 'row-beam' || event.kind === 'column-beam'));
      if (!created || result.state.outcome) continue;
      const secondState = result.state;
      for (const second of legalActions(secondState).filter(action => action.kind === 'swap')) {
        const follow = settle(secondState, second);
        if (follow?.events.some(event => event.type === 'special-activated' && event.id === created.id)) {
          const title = { en: 'Create and use a beam', ja: 'ビームを作って使う' };
          const steps = [
            { kind: 'action', id: 'plan-beam', action: first, accepted: true, event: 'special-planned', text: { en: 'A line of four plans a beam at its marked anchor.', ja: '4つの列がそろうと、印の位置にビームが作られます。' } },
            { kind: 'ticks', id: 'create-beam', count: 3600, event: 'special-created', text: { en: 'Let the clear finish; the beam stays on the board.', ja: '消去が終わると、ビームが盤面に残ります。' } },
            { kind: 'action', id: 'activate-beam', action: second, accepted: true, event: 'match-marked', text: { en: 'Make a match that reaches the beam to clear its line.', ja: 'ビームに届くマッチを作り、その列を消しましょう。' } },
            { kind: 'ticks', id: 'finish-beam', count: 3600, event: 'special-activated', text: { en: 'Watch the beam clear its line and the board refill.', ja: 'ビームが列を消し、盤面が補充される様子を見ましょう。' } }
          ];
          return { id: 'gem-swap-lesson-beam', title, initial: { preset: 'compact', seed }, steps, witness: [{ kind: 'action', action: first }, { kind: 'ticks', count: 3600 }, { kind: 'action', action: second }, { kind: 'ticks', count: 3600 }], reviewStatus: 'human-review-pending' };
        }
      }
    }
  }
  throw new Error('Could not find an original create-and-use-beam lesson witness');
}
function findSealLesson() {
  for (let seed = 1; seed < 100_000; seed++) {
    const start = createGame({ preset: 'compact', seed });
    for (const first of legalActions(start).filter(action => action.kind === 'swap')) {
      const result = settle(start, first); if (!result) continue;
      const created = result.events.find(event => event.type === 'special-created' && (event.kind === 'row-beam' || event.kind === 'column-beam'));
      if (!created || result.state.outcome) continue;
      for (const second of legalActions(result.state).filter(action => action.kind === 'swap')) {
        const follow = settle(result.state, second); if (!follow) continue;
        if (!follow.events.some(event => event.type === 'special-activated' && event.id === created.id)) continue;
        const cleared = follow.events.filter(event => event.type === 'cells-removed').flatMap(event => event.cells);
        const sealCell = cleared.find(cell => cell !== created.cell);
        if (sealCell === undefined) continue;
        const initial = { mode: 'challenge', preset: 'compact', seed, challenge: { moveLimit: 2, seals: [{ cell: sealCell, layers: 1 }], goals: [{ kind: 'seals' }] } };
        const witness = [{ kind: 'action', action: first }, { kind: 'ticks', count: 3600 }, { kind: 'action', action: second }, { kind: 'ticks', count: 3600 }];
        const verified = validateChallengeWitness(initial, witness); if (!verified.valid) continue;
        return { id: 'gem-swap-lesson-seal', title: { en: 'A beam opens a seal', ja: 'ビームで封印を解く' }, initial, steps: [
          { kind: 'action', id: 'plan-beam', action: first, accepted: true, event: 'special-planned', text: { en: 'Build a beam, then plan a later match through it.', ja: 'ビームを作り、次のマッチで使う準備をしましょう。' } },
          { kind: 'ticks', id: 'create-beam', count: 3600, event: 'special-created', text: { en: 'Let the clear finish; the beam stays on the board.', ja: '消去が終わると、ビームが盤面に残ります。' } },
          { kind: 'action', id: 'clear-seal', action: second, accepted: true, event: 'match-marked', cell: sealCell, text: { en: 'Activate the beam through the marked seal cell.', ja: '印の封印を通るようにビームを発動しましょう。' } },
          { kind: 'ticks', id: 'finish-seal', count: 3600, event: 'special-activated', outcome: 'won', cell: sealCell, text: { en: 'The wave clears the seal and completes the lesson.', ja: 'この連鎖で封印が消え、レッスンが完了します。' } }
        ], witness, reviewStatus: 'human-review-pending' };
      }
    }
  }
  throw new Error('Could not find an original beam-and-seal lesson witness');
}

function sourceFor(campaign, lessons, checksum) {
  const levelRows = campaign.map(level => `  ${JSON.stringify(level)}`).join(',\n');
  const lessonRows = lessons.map(lesson => `  ${JSON.stringify(lesson)}`).join(',\n');
  return `import type { Action, CreateOptions, ReplayOperation } from './types.js';\n\nexport type GemSwapReviewStatus = 'human-review-pending';\nexport interface GemSwapCampaignLevel { readonly id: string; readonly number: number; readonly title: { readonly en: string; readonly ja: string }; readonly options: CreateOptions; readonly width: number; readonly height: number; readonly colourCount: number; readonly seed: number; readonly challenge: NonNullable<CreateOptions['challenge']>; readonly witness: readonly ReplayOperation[]; readonly canonicalKeyHash: string; readonly tags: readonly string[]; readonly rawMetrics: Readonly<Record<string, number>>; readonly difficultyScore: number; readonly difficultyMarks: number; readonly gradingVersion: string; readonly proofStatus: 'engine-witness-verified'; readonly reviewStatus: GemSwapReviewStatus }\nexport type GemSwapLessonStep = { readonly kind: 'action'; readonly id: string; readonly action: Action; readonly accepted: boolean; readonly reason?: string; readonly event?: string; readonly cell?: number; readonly text: { readonly en: string; readonly ja: string } } | { readonly kind: 'ticks'; readonly id: string; readonly count: number; readonly event?: string; readonly outcome?: string; readonly cell?: number; readonly text: { readonly en: string; readonly ja: string } };\nexport interface GemSwapLesson { readonly id: string; readonly title: { readonly en: string; readonly ja: string }; readonly initial: CreateOptions; readonly steps: readonly GemSwapLessonStep[]; readonly witness: readonly ReplayOperation[]; readonly reviewStatus: GemSwapReviewStatus }\nfunction freezeContent<T>(value: T): T { if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.freeze(value); for (const item of Object.values(value as Record<string, unknown>)) freezeContent(item); } return value; }\nexport const GENERATION_REVISION = ${JSON.stringify(GENERATION_REVISION)};\nexport const GRADING_VERSION = ${JSON.stringify(GRADING_VERSION)};\nexport const SAMPLE_BUDGET = ${SAMPLE_BUDGET};\nexport const GRADING_WEIGHTS = freezeContent(${JSON.stringify(GRADING_WEIGHTS)});\nexport const CAMPAIGN_CHECKSUM = ${JSON.stringify(checksum)};\nexport const CAMPAIGN_COUNT = ${campaign.length};\nexport const GEM_SWAP_CAMPAIGN: readonly GemSwapCampaignLevel[] = freezeContent<GemSwapCampaignLevel[]>([\n${levelRows}\n]);\nexport const GEM_SWAP_LESSONS: readonly GemSwapLesson[] = freezeContent<GemSwapLesson[]>([\n${lessonRows}\n]);\n`;
}
export function generateContent() {
  const candidateLevels = campaignLevels();
  const campaign = candidateLevels.map(({ category: _category, ...level }) => level);
  const lessons = generateLessons();
  const checksum = hash(stable({ campaign, lessons, generationRevision: GENERATION_REVISION, gradingVersion: GRADING_VERSION, sampleBudget: SAMPLE_BUDGET, gradingWeights: GRADING_WEIGHTS }));
  return { campaign, lessons, checksum, source: sourceFor(campaign, lessons, checksum) };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const generated = generateContent();
  if (process.argv.includes('--check')) {
    const existing = await readFile(OUTPUT, 'utf8').catch(() => '');
    if (existing !== generated.source) { console.error('Gem Swap authored content is stale; run scripts/gem-swap-levels.mjs'); process.exitCode = 1; }
    else console.log(`Verified ${generated.campaign.length} levels, ${generated.lessons.length} lessons, checksum ${generated.checksum}`);
  } else {
    await writeFile(OUTPUT, generated.source);
    console.log(`Wrote ${generated.campaign.length} levels, ${generated.lessons.length} lessons, checksum ${generated.checksum}`);
  }
}
