import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createGame, applyAction, advanceTicks } from '../dist/magnetic-blocks.js';

const REVISION = 'magnetic-blocks-campaign-1';
const GRADING = 'legal-choices-and-witness-length-1';
const WIDTH = 8, HEIGHT = 12;
const palette = ['blue', 'green', 'gold', 'purple'];
const cell = (x, y) => y * WIDTH + x;
function hash(text) {
  return createHash('sha256').update(text).digest('hex');
}
function stable(value) { if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`; if (value && typeof value === 'object') return `{${Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`).join(',')}}`; return JSON.stringify(value); }
function normalizedColourKey(options) {
  const variants = [];
  const targets = new Set(options.goal.targetIds);
  for (const reflect of [false, true]) {
    const seen = new Map();
    const colour = name => { if (!seen.has(name)) seen.set(name, String.fromCharCode(65 + seen.size)); return seen.get(name); };
    const board = Array.from({ length: WIDTH * HEIGHT }, (_, index) => {
      const x = index % WIDTH, y = Math.floor(index / WIDTH), source = options.initialBoard[y * WIDTH + (reflect ? WIDTH - 1 - x : x)];
      return source ? `${colour(source.colour)}:${targets.has(source.id) ? 't' : 'g'}` : '.';
    });
    const queue = options.queue.map(piece => (reflect ? [piece[1], piece[0], piece[3], piece[2]] : piece).map(colour));
    variants.push(stable({ width: options.width, height: options.height, board, queue, schedule: options.schedule, floorSwitch: options.floorSwitch, magneticImpact: options.magneticImpact, targetCount: targets.size }));
  }
  return variants.sort()[0];
}
function act(state, action) { const result = applyAction(state, action); return result.accepted ? result.state : null; }
function advanceToInput(state) {
  for (let guard = 0; guard < 8 && ['gravity', 'clear-mark', 'clear-remove'].includes(state.phase); guard++) state = advanceTicks(state, 60).state;
  return state;
}
function actionPath(state, x, orientation, floor, resolve = true) {
  const actions = []; let currentX = state.active.x;
  while (currentX > x) { actions.push({ kind: 'left' }); currentX--; }
  while (currentX < x) { actions.push({ kind: 'right' }); currentX++; }
  for (let turn = 0; turn < orientation; turn++) actions.push({ kind: 'rotate-clockwise' });
  if (floor) actions.push({ kind: 'set-floor-override', floor });
  actions.push({ kind: 'hard-drop' });
  let current = state;
  for (const action of actions) { current = act(current, action); if (!current) return null; }
  return { state: resolve ? advanceToInput(current) : current, actions };
}
function floorVariants(state) { return state.floorSwitchCharges ? [null, 'calm', 'magnetic'] : [null]; }
function choices(state, wantCount = false) {
  const outputs = []; let legal = 0;
  for (let x = 0; x < WIDTH - 1; x++) for (let orientation = 0; orientation < 4; orientation++) for (const floor of floorVariants(state)) {
    const result = actionPath(state, x, orientation, floor);
    if (!result) continue;
    legal++;
    outputs.push({ ...result, x, orientation, floor });
  }
  return wantCount ? { outputs, legal } : outputs;
}
function prove(options) {
  const start = createGame(options); let winningPlacementChoices = 0;
  const firstChoices = choices(start, true);
  if (options.pieceLimit === 1) {
    for (const option of firstChoices.outputs) if (option.state.phase === 'won') winningPlacementChoices++;
    const winning = firstChoices.outputs.find(option => option.state.phase === 'won');
    return { witness: winning ? { state: winning.state, actions: winning.actions, decisions: Number(Boolean(winning.floor)) } : null, legalPlacementChoices: firstChoices.legal, setupPlacementChoices: 0, winningPlacementChoices };
  }
  const setupX = options.goal.targetIds.length && options.initialBoard.findIndex(gem => gem?.id === options.goal.targetIds[0]) % WIDTH < WIDTH / 2 ? WIDTH - 2 : 0;
  const setup = actionPath(start, setupX, 0, null, true);
  if (!setup || setup.state.phase !== 'falling') return { witness: null, legalPlacementChoices: 0, setupPlacementChoices: firstChoices.legal, winningPlacementChoices };
  const secondChoices = choices(setup.state, true);
  for (const option of secondChoices.outputs) if (option.state.phase === 'won') winningPlacementChoices++;
  const winning = secondChoices.outputs.find(option => option.state.phase === 'won');
  return { witness: winning ? { state: winning.state, actions: [...setup.actions, ...winning.actions], decisions: Number(Boolean(winning.floor)) } : null, legalPlacementChoices: secondChoices.legal, setupPlacementChoices: firstChoices.legal, winningPlacementChoices };
}
function proveWithWitness(options, witness) {
  let state = createGame(options);
  for (const action of witness) {
    state = advanceToInput(state);
    const result = applyAction(state, action);
    if (!result.accepted) throw new Error(`Counterfactual rejected ${action.kind}: ${result.reason}`);
    state = result.state;
  }
  return advanceToInput(state);
}
function candidate(serial) {
  const variant = serial % 5;
  const targetX = variant === 0 ? serial % 6 : 2 + serial % 4;
  const initialBoard = Array(WIDTH * HEIGHT).fill(null); let id = 1;
  if (variant === 0) {
    for (let dx = 0; dx < 3; dx++) initialBoard[cell(targetX + dx, HEIGHT - 1)] = { id: id++, colour: 'red' };
    for (let x = 0; x < WIDTH; x++) {
      if (x >= targetX && x < targetX + 3) continue;
      const height = (serial * (x + 5) + x * x * 3) % 4;
      for (let depth = 0; depth < height; depth++) initialBoard[cell(x, HEIGHT - 1 - depth)] = { id: id++, colour: palette[(x + depth) % 4] };
    }
  } else {
    const leftHeight = 6 + (serial % 3), rightHeight = 2 + (Math.floor(serial / 3) % 5);
    for (const [x, height] of [[targetX - 1, leftHeight], [targetX + 1, rightHeight]]) {
      for (let depth = 0; depth < height; depth++) initialBoard[cell(x, HEIGHT - 1 - depth)] = { id: id++, colour: palette[(x + depth + serial) % 4] };
    }
    for (let depth = 0; depth < 3; depth++) initialBoard[cell(targetX, HEIGHT - 1 - depth)] = { id: id++, colour: 'red' };
    for (const x of [0, WIDTH - 1]) {
      if ([targetX - 1, targetX, targetX + 1].includes(x)) continue;
      const height = (serial + x * 2) % 4;
      for (let depth = 0; depth < height; depth++) initialBoard[cell(x, HEIGHT - 1 - depth)] = { id: id++, colour: palette[(x + depth * 2 + serial) % 4] };
    }
  }
  const targetIds = initialBoard.flatMap(gem => gem?.colour === 'red' ? [gem.id] : []);
  const options = {
    mode: 'relaxed', width: WIDTH, height: HEIGHT, colourCount: 5, seed: `magnetic-level-${serial}`,
    initialBoard, queue: variant === 0 ? [['blue','green','gold','red']] : variant === 2 ? [['blue','green','gold','purple'], ['blue','gold','red','green']] : [['blue','gold','red','green']],
    pieceLimit: variant === 2 ? 2 : 1,
    schedule: variant === 0 || variant === 3 ? { kind: 'fixed', floor: 'calm' } : variant === 2 ? { kind: 'frequent' } : { kind: 'fixed', floor: 'magnetic' },
    floorSwitch: variant === 3, magneticImpact: variant === 4,
    goal: { kind: 'clear-targets', targetIds },
  };
  try {
    const { witness, legalPlacementChoices, setupPlacementChoices, winningPlacementChoices } = prove(options);
    if (!witness || witness.state.phase !== 'won') return null;
    const counterfactualOptions = structuredClone(options);
    if (variant === 1 || variant === 2 || variant === 4) counterfactualOptions.schedule = { kind: 'fixed', floor: 'calm' };
    if (variant === 3) counterfactualOptions.floorSwitch = false;
    const counterfactualActions = variant === 3 ? witness.actions.filter(action => action.kind !== 'set-floor-override') : witness.actions;
    let counterfactualResult = 'not-run';
    try { counterfactualResult = proveWithWitness(counterfactualOptions, counterfactualActions).phase; } catch { return null; }
    if (variant > 0 && !['lost', 'finished'].includes(counterfactualResult)) return null;
    if (variant === 4 && !witness.state.impactRemovedIds.length) return null;
    let disabledImpactResult;
    if (variant === 4) {
      disabledImpactResult = proveWithWitness({ ...options, magneticImpact: false }, witness.actions).phase;
      if (disabledImpactResult !== 'won') return null;
    }
    return { serial, targetX, options, witness: witness.actions, legalPlacementChoices, setupPlacementChoices, winningPlacementChoices, witnessPlacements: witness.state.placements, witnessFloorDecisions: witness.decisions, impactRemovedIds: witness.state.impactRemovedIds, disabledImpactResult, counterfactualResult, variant };
  } catch { return null; }
}
function levelText(serial, variant) {
  const names = [
    ['Bonded landing', '結合着地', 'Add the red corner to the marked group. Calm keeps the new square bonded as it settles.', '赤い角を印のグループにつなげます。静穏の床では四角形の結合が保たれます。'],
    ['Split magnetic landing', '磁力で分かれる着地', 'The marked red column sits below the tall guard. Pull separates the block so its red corner can fall onto the target.', '高い支えの下に赤い列があります。引力でブロックを分け、赤い角を目標まで落としましょう。'],
    ['Read the floor schedule', '床の予定を読む', 'The first queued block is a setup. Place it, then use the scheduled Pull floor for the red block.', '最初のブロックは準備用です。配置したあと、予定された引力の床で赤いブロックを置きましょう。'],
    ['Spend one floor switch', '床スイッチを1回使う', 'The scheduled floor is Calm, where the block stays above the target. Spend the one switch to choose Pull.', '予定された床は静穏で、ブロックは目標より上に留まります。1回分のスイッチで引力を選びましょう。'],
    ['Impact the support', '支えに衝撃を与える', 'Hard-drop on Pull to break one contacted guard stone, then watch the red corner split onto the target.', '引力の床でハードドロップし、接触した支えを壊してから赤い角を目標へ落としましょう。'],
  ];
  const [en, ja, objectiveEn, objectiveJa] = names[variant];
  return { title: { en: `${en} ${String(serial).padStart(2, '0')}`, ja: `${ja} ${String(serial).padStart(2, '0')}` }, objective: { en: objectiveEn, ja: objectiveJa } };
}
function makeLessons() {
  const lessons = [];
  for (const data of [
    ['calm-bonds', 'Calm keeps bonds', '静穏では結合が続く', 'Place a bonded block on an uneven stack. Its gems settle together as one connected group.', '段差のある積み重ねに結合したブロックを置きます。つながった宝石は一緒に落ちます。', { kind: 'fixed', floor: 'calm' }, false, false],
    ['magnetic-split', 'Pull separates columns', '引力で列が分かれる', 'Place the same square on Pull. The bonds break and each column settles independently.', '同じ四角ブロックを引力の床に置きます。結合が切れ、列ごとに落ちます。', { kind: 'fixed', floor: 'magnetic' }, false, false],
    ['floor-switch-impact', 'Switch and impact', '床スイッチと衝撃', 'Select Pull with the one-use Floor Switch, then hard-drop to remove the contacted support layer.', '1回分の床スイッチで引力を選び、ハードドロップで接触した支えを壊します。', { kind: 'fixed', floor: 'calm' }, true, true],
  ]) {
    const [id, en, ja, objectiveEn, objectiveJa, schedule, floorSwitch, magneticImpact] = data;
    const board = Array(WIDTH * 8).fill(null);
    // A short, uneven support shelf demonstrates the lesson without creating an opening clear.
    board[7 * WIDTH + 2] = { id: 1, colour: 'red' }; board[7 * WIDTH + 3] = { id: 2, colour: 'blue' };
    board[7 * WIDTH + 4] = { id: 3, colour: 'green' }; board[7 * WIDTH + 5] = { id: 4, colour: 'gold' };
    const options = { mode: 'relaxed', width: WIDTH, height: 8, colourCount: 5, seed: `magnetic-lesson-${id}`, initialBoard: board, queue: [['red','blue','green','gold']], pieceLimit: 1, schedule, floorSwitch, magneticImpact };
    const witness = floorSwitch ? [{ kind: 'set-floor-override', floor: 'magnetic' }, { kind: 'hard-drop' }] : [{ kind: 'hard-drop' }];
    lessons.push({ id, title: { en, ja }, objective: { en: objectiveEn, ja: objectiveJa }, options, witness, instruction: [{ en: 'Move and rotate the active square. The ghost shows where its cells will land.', ja: '操作して四角ブロックを動かし、回転します。ゴーストは着地点を示します。' }, { en: objectiveEn, ja: objectiveJa }] });
  }
  return lessons;
}
function deepFreeze(value) { if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.freeze(value); for (const child of Object.values(value)) deepFreeze(child); } return value; }

export function generateContent() {
  const candidates = new Map();
  for (let serial = 1; serial <= 500 && candidates.size < 80; serial++) {
    const item = candidate(serial); if (!item) continue;
    const canonicalKey = normalizedColourKey(item.options);
    if (!candidates.has(canonicalKey)) candidates.set(canonicalKey, { ...item, canonicalKey });
  }
  if (candidates.size < 50) throw new Error(`Only ${candidates.size} verified canonical candidates were found`);
  const scoreOf = value => value.legalPlacementChoices > 0
    ? (1 - value.winningPlacementChoices / value.legalPlacementChoices) * 0.55
      + Math.max(0, value.witnessPlacements - 1) * 0.35
      + (value.witnessFloorDecisions ? 0.10 : 0)
    : 0;
  const selected = [];
  for (let variant = 0; variant < 5; variant++) {
    const group = [...candidates.values()].filter(item => item.variant === variant).sort((a, b) => scoreOf(a) - scoreOf(b) || a.canonicalKey.localeCompare(b.canonicalKey));
    if (group.length < 10) throw new Error(`Only ${group.length} verified levels for mechanic group ${variant}`);
    selected.push(...group.slice(0, 10));
  }
  const levels = selected.sort((a, b) => {
    return scoreOf(a) - scoreOf(b) || a.canonicalKey.localeCompare(b.canonicalKey);
  }).map((item, index, ordered) => {
    const score = scoreOf(item);
    const scores = ordered.map(scoreOf), low = Math.min(...scores), high = Math.max(...scores);
    const score100 = high === low ? 0 : Math.round((score - low) / (high - low) * 100);
    const variant = item.variant;
    const localized = levelText(item.serial, variant);
    return {
      id: `magnetic-${hash(item.canonicalKey).slice(0, 16)}`, number: index + 1,
      ...localized, options: item.options, witness: item.witness, witnessResult: 'won',
      metrics: { legalPlacementChoices: item.legalPlacementChoices, setupPlacementChoices: item.setupPlacementChoices, winningPlacementChoices: item.winningPlacementChoices, availableFloorChoices: item.options.floorSwitch ? 3 : 1, witnessPlacements: item.witnessPlacements, witnessFloorDecisions: item.witnessFloorDecisions, difficultyScore: score100 },
      marks: Math.min(5, 1 + Math.floor(score100 / 20)), tags: [variant === 0 ? 'calm-bonded' : variant === 1 ? 'magnetic-split' : variant === 2 ? 'floor-schedule' : variant === 3 ? 'floor-switch' : 'magnetic-impact', item.witnessPlacements > 1 ? 'multi-placement' : 'single-placement'], canonicalKey: item.canonicalKey,
      canonicalKeyHash: hash(item.canonicalKey), score: score100, gradingVersion: GRADING, proofStatus: 'engine-witness-verified', reviewStatus: 'human-review-pending',
      ...(variant ? { counterfactual: { kind: variant === 1 || variant === 4 ? 'floor-choice' : variant === 2 ? 'floor-schedule' : 'floor-switch', alternative: variant === 3 ? 'same action sequence with no Floor Switch available' : 'same action sequence with Calm floor on every placement', result: item.counterfactualResult } } : {}),
      ...(variant === 4 ? { impactEvidence: { removedSupportCount: item.impactRemovedIds.length, disabledImpactResult: item.disabledImpactResult } } : {}),
    };
  });
  const body = { count: levels.length, candidateCount: candidates.size, generationRevision: REVISION, gradingVersion: GRADING,
    difficultyFormula: 'raw = 0.55*(1 - winningChoicesAtFinalDecision / legalPlacementChoicesAtFinalDecision) + 0.35*max(0,witnessPlacements-1) + 0.10*Boolean(witnessFloorDecision); setupPlacementChoices is reported separately and floor availability alone has no weight.',
    normalization: 'Map raw scores across the selected fifty levels linearly from the observed minimum to maximum onto integer 0–100; if all scores are equal use 0.',
    marksFormula: 'min(5, 1 + floor(score / 20))',
    orderingPolicy: 'Sort ascending by the raw engine-derived difficulty score, then canonical SHA-256 key; number after sorting.', levels };
  const campaign = { ...body, checksum: hash(stable(body)) };
  return deepFreeze({ campaign, lessons: makeLessons() });
}

if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  const data = generateContent();
  const source = `import type { MagneticContentData } from './content-types.js';\n\n/** Generated by scripts/magnetic-blocks-levels.mjs. */\nexport const contentData: MagneticContentData = ${JSON.stringify(data, null, 2)};\n`;
  await writeFile(new URL('../src/magnetic-blocks/content-data.ts', import.meta.url), source);
  process.stdout.write(`${data.campaign.count} verified levels from ${data.campaign.candidateCount} canonical candidates · ${data.campaign.checksum}\n`);
}
