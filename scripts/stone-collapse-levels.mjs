import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createChallenge } from '../dist/stone-collapse.js';

export const GENERATION_REVISION = 'stone-collapse-campaign-1.0';
export const GRADING_VERSION = 'collapse-order-forgiveness-1';
export const SAMPLE_BUDGET = 64;
const PROBE_BUDGET = 6, WIDTH = 6, HEIGHT = 6, COLOURS = ['red', 'blue', 'green', 'gold'];
const COUNT = 100, SURPLUS = 10, SEARCH_LIMIT = 9000;
const SILHOUETTE = [false, true, true, true, true, false, ...Array(18).fill(true), false, true, true, true, true, false, false, false, true, true, false, false];
const hash = value => createHash('sha256').update(String(value)).digest('hex');
function rng(seed) { let value = Number.parseInt(hash(seed).slice(0, 8), 16) || 1; return () => { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) / 0x1_0000_0000; }; }
const cell = (x, y, width = WIDTH) => y * width + x;
function neighbours(index, width, height) { const x = index % width, y = Math.floor(index / width); return [x ? index - 1 : -1, x + 1 < width ? index + 1 : -1, y ? index - width : -1, y + 1 < height ? index + width : -1].filter(next => next >= 0); }
function groups(board, width = WIDTH, height = HEIGHT, mask = Array(board.length).fill(true)) {
  const seen = new Uint8Array(board.length), result = [];
  for (let start = 0; start < board.length; start++) {
    if (seen[start] || board[start] === -1) continue;
    const colour = board[start], pending = [start], group = []; seen[start] = 1;
    while (pending.length) { const at = pending.pop(); group.push(at); for (const next of neighbours(at, width, height)) if (mask[next] && !seen[next] && board[next] === colour) { seen[next] = 1; pending.push(next); } }
    if (group.length >= 2) result.push(group.sort((a, b) => a - b));
  }
  return result;
}
function removeAndSettle(board, group, width = WIDTH, height = HEIGHT, mask = Array(board.length).fill(true)) {
  const removed = new Set(group), next = board.map((colour, index) => removed.has(index) ? -1 : colour);
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && !mask[cell(x, y, width)]) y++;
      const start = y; while (y < height && mask[cell(x, y, width)]) y++;
      const end = y, survivors = [];
      for (let row = start; row < end; row++) if (next[cell(x, row, width)] !== -1) survivors.push(next[cell(x, row, width)]);
      for (let row = start; row < end; row++) next[cell(x, row, width)] = row < end - survivors.length ? -1 : survivors[row - (end - survivors.length)];
    }
  }
  if (!mask.every(Boolean)) return next;
  const kept = [];
  for (let x = 0; x < width; x++) { const column = Array.from({ length: height }, (_, y) => next[cell(x, y, width)]); if (column.some(value => value !== -1)) kept.push(column); }
  return Array.from({ length: width * height }, (_, index) => kept[index % width]?.[Math.floor(index / width)] ?? -1);
}
function solve(initial, seed, limit = SEARCH_LIMIT, width = WIDTH, height = HEIGHT, mask = Array(initial.length).fill(true)) {
  const visited = new Set(); let nodes = 0;
  function visit(board, path) {
    if (board.every(value => value === -1)) return path;
    const key = board.join(','); if (visited.has(key) || nodes++ >= limit) return null; visited.add(key);
    const random = rng(`${seed}|${key}`); const options = groups(board, width, height, mask).map(group => ({ group, rank: random() }));
    options.sort((a, b) => a.rank - b.rank);
    for (const { group } of options) { const result = visit(removeAndSettle(board, group, width, height, mask), [...path, group]); if (result) return result; }
    return null;
  }
  return { witness: visit(initial, []), nodes };
}
function boardWithIds(colours) { return colours.map((colour, index) => colour === -1 ? null : { id: index + 1, colour: COLOURS[colour] }); }
function witnessIds(board, path, width = WIDTH, height = HEIGHT, mask = Array(board.length).fill(true)) {
  let current = board;
  return path.map(group => { const ids = group.map(index => current[index]?.id).sort((a, b) => a - b); current = settleStoneBoard(current, group, width, height, mask); return ids; });
}
function settleStoneBoard(board, cells, width = WIDTH, height = HEIGHT, mask = Array(board.length).fill(true)) {
  const removed = new Set(cells), next = board.map((stone, index) => removed.has(index) ? null : stone);
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && !mask[cell(x, y, width)]) y++;
      const start = y; while (y < height && mask[cell(x, y, width)]) y++;
      const end = y, survivors = [];
      for (let row = start; row < end; row++) if (next[cell(x, row, width)]) survivors.push(next[cell(x, row, width)]);
      for (let row = start; row < end; row++) next[cell(x, row, width)] = row < end - survivors.length ? null : survivors[row - (end - survivors.length)] ?? null;
    }
  }
  if (!mask.every(Boolean)) return next;
  const kept = []; for (let x = 0; x < width; x++) { const column = Array.from({ length: height }, (_, y) => next[cell(x, y, width)]); if (column.some(Boolean)) kept.push(column); }
  return Array.from({ length: width * height }, (_, index) => kept[index % width]?.[Math.floor(index / width)] ?? null);
}
function canonicalKey(level) {
  const variants = [];
  for (const mirror of [false, true]) {
    const labels = new Map(); const label = colour => { if (!labels.has(colour)) labels.set(colour, labels.size); return labels.get(colour); };
    const board = [];
    const mask = [];
    for (let y = 0; y < level.height; y++) for (let px = 0; px < level.width; px++) { const x = mirror ? level.width - 1 - px : px, at = cell(x, y); mask.push(level.mask?.[at] ?? true); const stone = level.board[at]; board.push(stone ? label(stone.colour) : null); }
    variants.push(JSON.stringify([level.width, level.height, level.colourCount, level.goal, level.moveLimit, mask, board]));
  }
  return variants.sort()[0];
}
function randomFinish(board, movesLeft, random, mask = Array(board.length).fill(true)) {
  let current = board, remaining = movesLeft;
  while (remaining > 0 && current.some(value => value !== -1)) {
    const options = groups(current, WIDTH, HEIGHT, mask); if (!options.length) return false;
    current = removeAndSettle(current, options[Math.floor(random() * options.length)], WIDTH, HEIGHT, mask); remaining--;
  }
  return current.every(value => value === -1);
}
function metricsFor(level, colourBoard, witnessCells) {
  const sampleRandom = rng(`${GRADING_VERSION}|${level.seed}|whole`); let successes = 0;
  const mask = level.mask ?? Array(colourBoard.length).fill(true);
  for (let sample = 0; sample < SAMPLE_BUDGET; sample++) if (randomFinish(colourBoard, level.moveLimit, rng(`${GRADING_VERSION}|${level.seed}|${sample}|${sampleRandom()}`), mask)) successes++;
  let current = colourBoard, stoneCurrent = level.board, choices = 0, safeShareSum = 0, forced = 0, decisions = 0;
  for (let move = 0; move < level.witness.length; move++) {
    const legal = groups(current, WIDTH, HEIGHT, mask); if (!legal.length) break;
    const intended = level.witness[move], intendedCells = witnessCells[move], viable = new Set(); choices += legal.length; decisions++;
    for (const group of legal) {
      const after = removeAndSettle(current, group, WIDTH, HEIGHT, mask), remaining = level.moveLimit - move - 1;
      const ids = group.map(index => stoneCurrent[index]?.id).sort((a, b) => a - b);
      const isWitness = ids.length === intended.length && ids.every((id, index) => id === intended[index]);
      let completions = 0;
      for (let sample = 0; sample < PROBE_BUDGET; sample++) if (randomFinish(after, remaining, rng(`${level.seed}|probe|${move}|${ids.join('.') }|${sample}`), mask)) completions++;
      if (isWitness || completions > 0) viable.add(group);
      if (!isWitness && completions === 0) safeShareSum++;
    }
    if (viable.size === 1) forced++;
    current = removeAndSettle(current, intendedCells, WIDTH, HEIGHT, mask); stoneCurrent = settleStoneBoard(stoneCurrent, intendedCells, WIDTH, HEIGHT, mask);
  }
  return { seededPlayoutSamples: SAMPLE_BUDGET, seededPlayoutSuccesses: successes, seededPlayoutSuccessRate: successes / SAMPLE_BUDGET, legalGroupChoices: choices, witnessedDecisionCount: decisions, sampledOrderFailureShare: choices ? safeShareSum / choices : 0, forcedSafeGroupShare: decisions ? forced / decisions : 0, averageGroupChoices: decisions ? choices / decisions : 0, witnessMoves: level.witness.length, moveBudgetSlack: 0 };
}
function generateCandidate(serial, shaped) {
  const random = rng(`${GENERATION_REVISION}|board|${serial}`), mask = shaped ? SILHOUETTE : Array(WIDTH * HEIGHT).fill(true);
  const colours = mask.map(active => active ? Math.floor(random() * COLOURS.length) : -1);
  const solved = solve(colours, `${GENERATION_REVISION}|solve|${serial}`, SEARCH_LIMIT, WIDTH, HEIGHT, mask); if (!solved.witness || solved.witness.length < 2) return null;
  const board = boardWithIds(colours); const witness = witnessIds(board, solved.witness, WIDTH, HEIGHT, mask); const goal = { kind: 'clear-all' };
  const isShaped = !mask.every(Boolean);
  const draft = { id: `candidate-${serial}`, width: WIDTH, height: HEIGHT, colourCount: 4, seed: `${GENERATION_REVISION}:${serial}`, ...(isShaped ? { mask } : {}), initialBoard: board, goal, moveLimit: witness.length, witness };
  try { createChallenge(draft); } catch { return null; }
  const key = canonicalKey({ ...draft, board }), keyHash = hash(key), persistentId = `stone-${keyHash.slice(0, 12)}`, titleCode = keyHash.slice(0, 4).toUpperCase();
  const level = { id: persistentId, number: 0, title: { en: `Clearing Route ${titleCode}`, ja: `石の道筋 ${titleCode}` }, canonicalKeyHash: keyHash, width: WIDTH, height: HEIGHT, colourCount: 4, seed: draft.seed, ...(isShaped ? { mask } : {}), board, goal, moveLimit: witness.length, witness, tags: ['clear-all', ...(isShaped ? ['fixed-columns', 'silhouette'] : []), ...(witness.length >= 6 ? ['removal-order'] : []), ...(groups(colours, WIDTH, HEIGHT, mask).some(group => group.length === 2) ? ['pair-choice'] : [])], rawMetrics: null, score: 0, marks: 1, gradingVersion: GRADING_VERSION, proofStatus: 'engine-witness-verified', reviewStatus: 'human-review-pending' };
  level.rawMetrics = metricsFor(level, colours, solved.witness);
  return { level, key, solveNodes: solved.nodes };
}
function percentile(values, value) { const less = values.filter(item => item < value).length, equal = values.filter(item => item === value).length; return values.length < 2 ? 0 : (less + (equal - 1) / 2) / (values.length - 1); }
function gradeCategory(candidates) {
  const metrics = candidates.map(item => item.level.rawMetrics);
  const values = { inverseSuccess: metrics.map(value => 1 - value.seededPlayoutSuccessRate), failure: metrics.map(value => value.sampledOrderFailureShare), forced: metrics.map(value => value.forcedSafeGroupShare), branch: metrics.map(value => value.averageGroupChoices), length: metrics.map(value => value.witnessMoves) };
  return candidates.map(item => { const m = item.level.rawMetrics; const score = Math.round(100 * (0.4 * percentile(values.inverseSuccess, 1 - m.seededPlayoutSuccessRate) + 0.25 * percentile(values.failure, m.sampledOrderFailureShare) + 0.15 * percentile(values.forced, m.forcedSafeGroupShare) + 0.1 * percentile(values.branch, m.averageGroupChoices) + 0.1 * percentile(values.length, m.witnessMoves))); return { ...item, level: { ...item.level, score, marks: Math.min(5, 1 + Math.floor(score / 20)) } }; });
}
function gradeAndOrder(candidates) {
  const rectangles = gradeCategory(candidates.filter(item => !item.level.mask));
  const silhouettes = gradeCategory(candidates.filter(item => item.level.mask));
  return [...rectangles, ...silhouettes].sort((a, b) => a.level.score - b.level.score || a.level.id.localeCompare(b.level.id));
}
function campaign(count = COUNT) {
  if (!Number.isInteger(count) || count < 50 || count > 100) throw new RangeError('Campaign count must be 50 or 100');
  const poolCount = count + SURPLUS, shapedPool = Math.round(poolCount * 0.2), rectanglePool = poolCount - shapedPool, selectedShapeCount = Math.round(count * 0.2), selectedRectCount = count - selectedShapeCount;
  const keys = new Set(), candidates = []; let serial = 0, attempts = 0;
  for (const [shaped, quota] of [[false, rectanglePool], [true, shapedPool]]) {
    let found = 0, categoryAttempts = 0;
    while (found < quota && categoryAttempts++ < 50_000) {
      const candidate = generateCandidate(serial++, shaped); attempts++;
      if (!candidate || keys.has(candidate.key)) continue;
      keys.add(candidate.key); candidates.push(candidate); found++;
    }
    if (found !== quota) throw new Error(`Could not generate ${quota} unique ${shaped ? 'silhouette' : 'rectangular'} boards after ${categoryAttempts} attempts`);
  }
  const ranked = gradeAndOrder(candidates);
  const selectQuantiles = (category, amount) => { const entries = ranked.filter(item => Boolean(item.level.mask) === category); return Array.from({ length: amount }, (_, index) => entries[Math.round(index * (entries.length - 1) / Math.max(1, amount - 1))]); };
  const selected = [...selectQuantiles(false, selectedRectCount), ...selectQuantiles(true, selectedShapeCount)];
  const levels = gradeAndOrder(selected).map((item, index) => ({ ...item.level, number: index + 1 }));
  if (levels.slice(-10).some(level => level.rawMetrics.witnessMoves < 5)) throw new Error('The hardest ten boards must demand at least five planned removals');
  const checksum = hash(JSON.stringify(levels));
  return { count, candidatePoolCount: ranked.length, generationRevision: GENERATION_REVISION, gradingVersion: GRADING_VERSION, category: '6×6 four-colour rectangles (36 cells) and fixed-column silhouettes (28 cells); percentiles within each shape category', curationPolicy: `Generate ${SURPLUS} surplus boards with an 80/20 rectangle/silhouette balance; curate score quantiles within each category, then regrade, merge and number.`, orderingPolicy: 'single-category/nondecreasing-measured-score/stable-id-tie-break', grading: { weights: { lowSeededLegalPlaySuccess: 0.4, sampledOrderFailureShare: 0.25, forcedSafeGroupShare: 0.15, legalGroupChoiceBreadth: 0.1, witnessedPlanningLength: 0.1 }, seededPlayouts: `64 uniform legal group-removal runs, each bounded by the witnessed move limit`, orderProbe: `${PROBE_BUDGET} deterministic completion samples for every legal group choice at each witnessed decision; witnessed route itself is counted as proven-safe`, search: `depth-first all-clear witness search bounded at ${SEARCH_LIMIT} states per candidate`, scoreRule: 'round(100 × weighted empirical percentile blend within the same mask category); marks=min(5,1+floor(score/20))', claims: 'Scores are deterministic progression heuristics; no uniqueness, minimum-move or optimality claims.' }, sampleBudget: SAMPLE_BUDGET, checksum, levels };
}
function tutorials() {
  const board = (colors, width, height) => colors.map((colour, index) => colour === null ? null : { id: index + 1, colour });
  const pair = board(['red', 'red', 'blue', 'gold', 'green', 'blue', 'gold', 'green', 'blue', 'green', 'green', 'gold', 'green', 'gold', 'gold', 'blue'], 4, 4);
  const pairIds = [1, 2];
  const compression = board(['red', 'blue', 'green', 'gold', 'red', 'blue', 'green', 'gold', 'red', 'blue', 'green', 'gold', 'red', 'blue', 'blue', 'gold'], 4, 4);
  const compressionIds = [2, 6, 10, 14, 15];
  const orderColours = [2, 1, 1, 0, 0, 0, 0, 2, 2, 1, 2, 0, 0, 2, 2, 1];
  const orderBoard = board(orderColours.map(value => COLOURS[value]), 4, 4);
  const orderSolution = [[1, 2], [4, 5, 6], [10, 14, 13], [13, 14], [4, 8, 9], [9, 13, 12]];
  const orderWitness = witnessIds(orderBoard, orderSolution, 4, 4);
  return [
    { id: 'identify-a-group', title: { en: 'Find a Connected Group', ja: 'つながったグループを見つける' }, objective: { en: 'Select and clear the marked pair.', ja: '印のペアを選び、消しましょう。' }, setup: { width: 4, height: 4, colourCount: 4, board: pair, goal: { kind: 'clear-targets', targetIds: pairIds }, witness: [pairIds] }, steps: [{ instruction: { en: 'Select either red stone. Both connected stones should be previewed.', ja: '赤い石のどちらかを選びます。つながった2つがプレビューされます。' }, action: 'select' }, { instruction: { en: 'Confirm the selected group to clear it.', ja: '選んだグループを確認して消します。' }, action: 'confirm' }], tags: ['group-selection', 'confirmation'] },
    { id: 'follow-gravity-and-compression', title: { en: 'Follow Gravity and Compression', ja: '重力と列の圧縮を見る' }, objective: { en: 'Clear the blue pair and watch the empty column close.', ja: '青いペアを消し、空いた列が詰まる様子を見ます。' }, setup: { width: 4, height: 4, colourCount: 4, board: compression, goal: { kind: 'clear-targets', targetIds: compressionIds }, witness: [compressionIds] }, steps: [{ instruction: { en: 'Choose either blue stone to preview the complete pair.', ja: '青い石を選び、ペア全体をプレビューします。' }, action: 'select' }, { instruction: { en: 'Confirm. Stones above fall first; on this rectangle, the empty column then shifts away.', ja: '確認します。石が先に下へ落ち、この長方形では空いた列が左へ詰まります。' }, action: 'confirm' }], tags: ['gravity', 'column-compression'] },
    { id: 'plan-the-removal-order', title: { en: 'Plan the Removal Order', ja: '消す順番を考える' }, objective: { en: 'Clear the whole board without stranding the remaining stones.', ja: '石を取り残さないように盤面をすべて消します。' }, setup: { width: 4, height: 4, colourCount: 4, board: orderBoard, goal: { kind: 'clear-all' }, moveLimit: orderWitness.length, witness: orderWitness }, steps: [{ instruction: { en: 'Clear the blue pair first, then the red group. This opens the lower groups.', ja: '先に青いペアを消し、次に赤いグループを消して下の道を開きます。' }, action: 'select; confirm' }, { instruction: { en: 'The green group is tempting, but taking it first leaves only single stones. Follow the marked route.', ja: '緑のグループを先に消すと、1つずつの石が残ってしまいます。印の順番で進めます。' }, action: 'plan; clear-all' }], tags: ['removal-order', 'singleton-risk'] }
  ];
}
export function generateCampaign(count = COUNT) { return campaign(count); }
export function tutorialDefinitions() { return tutorials(); }
export async function writeCampaign(path = resolve('src/stone-collapse/content-data.ts')) { const data = { campaign: campaign(COUNT), tutorials: tutorials() }; await writeFile(path, `// Generated offline by scripts/stone-collapse-levels.mjs.\nexport const contentData = ${JSON.stringify(data, null, 2)} as const;\n`, 'utf8'); return data.campaign; }
if (process.argv[1] && resolve(process.argv[1]) === resolve('scripts/stone-collapse-levels.mjs')) { const result = await writeCampaign(); process.stdout.write(`Generated ${result.count} distinct Stone Collapse challenges (${result.levels[0].score}–${result.levels.at(-1).score}); ${result.levels[0].id} → ${result.levels.at(-1).id}\n`); }
