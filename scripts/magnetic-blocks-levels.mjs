import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createGame, applyAction, advanceTicks } from '../dist/magnetic-blocks.js';

const REVISION = 'magnetic-blocks-campaign-2';
const GRADING = 'full-plan-and-interaction-evidence-2';
const WIDTH = 8, HEIGHT = 12;
const palette = ['blue', 'green', 'gold', 'purple'];
function hash(text) {
  return createHash('sha256').update(text).digest('hex');
}
function stable(value) { if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`; if (value && typeof value === 'object') return `{${Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`).join(',')}}`; return JSON.stringify(value); }
function normalizedColourKey(options) {
  const width = options.width ?? WIDTH, height = options.height ?? HEIGHT;
  const variants = [];
  const targets = new Set(options.goal.targetIds);
  for (const reflect of [false, true]) {
    const seen = new Map();
    const colour = name => { if (!seen.has(name)) seen.set(name, String.fromCharCode(65 + seen.size)); return seen.get(name); };
    const board = Array.from({ length: width * height }, (_, index) => {
      const x = index % width, y = Math.floor(index / width), source = options.initialBoard[y * width + (reflect ? width - 1 - x : x)];
      return source ? `${colour(source.colour)}:${targets.has(source.id) ? 't' : 'g'}` : '.';
    });
    const queue = options.queue.map(piece => (reflect ? [piece[1], piece[0], piece[3], piece[2]] : piece).map(colour));
    const mask = options.mask && Array.from({ length: width * height }, (_, index) => {
      const x = index % width, y = Math.floor(index / width);
      return options.mask[y * width + (reflect ? width - 1 - x : x)];
    });
    const targetGeometry = options.goal.targetIds.map(id => {
      const i = options.initialBoard.findIndex(g => g?.id === id), x = i % width;
      return [reflect ? width - 1 - x : x, Math.floor(i / width)];
    }).sort((a,b) => a[1]-b[1] || a[0]-b[0]);
    variants.push(stable({ width, height, mask, board, queue, bonds: options.bonds, schedule: options.schedule, floorSwitch: options.floorSwitch, magneticImpact: options.magneticImpact, targetGeometry }));
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
const choiceCache = new Map();
function choices(state, wantCount = false) {
  const key = stable({ mode: state.settings.mode, width: state.settings.width, height: state.settings.height, mask: state.settings.mask,
    goal: state.settings.goal, schedule: state.settings.schedule, floorSwitch: state.settings.floorSwitch,
    magneticImpact: state.settings.magneticImpact, pieceLimit: state.settings.pieceLimit,
    board: state.board, bonds: state.bonds,
    active: state.active && { x: state.active.x, y: state.active.y, orientation: state.active.orientation, gems: state.active.gems },
    queue: state.queue, placements: state.placements, floor: state.floor, nextFloor: state.nextFloor,
    floorSwitchCharges: state.floorSwitchCharges, pendingFloorOverride: state.pendingFloorOverride, phase: state.phase });
  const cached = choiceCache.get(key);
  if (cached) return wantCount ? { outputs: cached, legal: cached.length } : cached;
  const outputs = []; let legal = 0;
  for (let x = 0; x < state.settings.width - 1; x++) for (let orientation = 0; orientation < 4; orientation++) for (const floor of floorVariants(state)) {
    const result = actionPath(state, x, orientation, floor);
    if (!result) continue;
    legal++;
    outputs.push({ ...result, x, orientation, floor });
  }
  choiceCache.set(key, outputs);
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
function openCandidate(serial) {
  const widths = [4, 5, 6, 7, 8], heights = [6, 8, 10, 12];
  const width = widths[Math.floor(serial / 16) % widths.length];
  const height = heights[Math.floor(serial / 80) % heights.length];
  const vertical = Math.floor(serial / 144) % 2 === 1;
  const shapeIndex = Math.floor(serial / 288) % 3;
  const extent = vertical ? width : width - 2;
  const targetStart = (serial * 7 + Math.floor(serial / 11)) % (extent + 1);
  const targetY = height - 3;
  const initialBoard = Array(width * height).fill(null), targetIds = [];
  const targetCells = Array.from({ length: 3 }, (_, i) => vertical ? [targetStart, targetY + i] : [targetStart + i, height - 1]);
  let id = 1;
  for (const [x, y] of targetCells) { initialBoard[y * width + x] = { id, colour: 'red' }; targetIds.push(id++); }
  // A bottom-connected asymmetric shelf changes actual landing options. Its
  // profile is included in the geometry key and never exists as inert padding.
  const profileCode = Math.floor(serial / 576);
  for (let x = 0; x < width; x++) {
    if (targetCells.some(([tx]) => tx === x && !vertical)) continue;
    if (vertical && x === targetStart) continue;
    const heightHere = (Math.floor(serial / (5 ** (x % 5))) + profileCode + x * 3) % 5;
    for (let d = 0; d < heightHere; d++) {
      const y = height - 1 - d;
      if (initialBoard[y * width + x]) continue;
      initialBoard[y * width + x] = { id: id++, colour: palette[(x + d + shapeIndex) % palette.length] };
    }
  }
  // Rotate which corners carry red across all nonempty patterns; the four
  // corners remain a genuine placement decision rather than a seed variant.
  const redMask = serial % 4 === 0 ? 15 : 1 + ((serial + Math.floor(serial / 5)) % 15);
  const colours = ['blue', 'green', 'gold', 'purple'].map((colour, corner) => redMask & (1 << corner) ? 'red' : colour);
  const options = { mode: 'relaxed', width, height, colourCount: 6, seed: `magnetic-open-${serial}`, initialBoard,
    queue: [colours], pieceLimit: 1, schedule: { kind: 'fixed', floor: 'calm' },
    goal: { kind: 'clear-targets', targetIds } };
  try {
    const proof = prove(options);
    if (!proof.witness || proof.witness.state.phase !== 'won') return null;
    return { serial, options, witness: proof.witness.actions, legalPlacementChoices: proof.legalPlacementChoices,
      setupPlacementChoices: 0, winningPlacementChoices: proof.winningPlacementChoices,
      witnessPlacements: proof.witness.state.placements, witnessFloorDecisions: proof.witness.decisions,
      interactionDepth: 0, setupDecisionPressure: 0, necessaryFloorDecisionShare: 0,
      exactFullPlanWins: proof.winningPlacementChoices, exactFullPlanTrials: proof.legalPlacementChoices,
      variant: 5, targetGroupCount: 1 };
  } catch { return null; }
}
function doubleTargetCandidate(serial) {
  const widths = [4, 6, 8], heights = [10, 12];
  const width = widths[Math.floor(serial / 8) % widths.length], height = heights[Math.floor(serial / 24) % heights.length];
  const targetX = (serial * 3 + Math.floor(serial / 5)) % (width - 1);
  const initialBoard = Array(width * height).fill(null), targetIds = [];
  let id = 1;
  for (const y of [height - 4, height - 3, height - 2]) { const gem = { id: id++, colour: 'red' }; initialBoard[y * width + targetX] = gem; targetIds.push(gem.id); }
  for (const y of [height - 7, height - 6, height - 5]) { const gem = { id: id++, colour: 'red' }; initialBoard[y * width + targetX + 1] = gem; targetIds.push(gem.id); }
  initialBoard[(height - 1) * width + targetX] = { id: id++, colour: 'blue' };
  for (let y = height - 4; y < height; y++) initialBoard[y * width + targetX + 1] = { id: id++, colour: ['gold','purple','teal','blue'][y - (height - 4)] };
  for (let x = 0; x < width; x++) {
    if (x === targetX || x === targetX + 1) continue;
    const heightHere = (Math.floor(serial / (7 ** (x % 3))) + x + Math.floor(serial / 9)) % 4;
    for (let depth = 0; depth < heightHere; depth++) {
      const y = height - 1 - depth;
      initialBoard[y * width + x] = { id: id++, colour: palette[(x + depth * 2) % palette.length] };
    }
  }
  const options = { mode: 'relaxed', width, height, colourCount: 6, seed: `magnetic-two-target-${serial}`, initialBoard,
    queue: [['red','red','red','red']], pieceLimit: 1, schedule: { kind: 'fixed', floor: 'magnetic' },
    goal: { kind: 'clear-targets', targetIds } };
  try {
    const proof = prove(options);
    if (!proof.witness || proof.witness.state.phase !== 'won') return null;
    const calmOptions = structuredClone(options); calmOptions.schedule = { kind: 'fixed', floor: 'calm' };
    const calmResult = proveWithWitness(calmOptions, proof.witness.actions).phase;
    if (calmResult === 'won') return null;
    return { serial, options, witness: proof.witness.actions, legalPlacementChoices: proof.legalPlacementChoices,
      setupPlacementChoices: 0, winningPlacementChoices: proof.winningPlacementChoices,
      witnessPlacements: 1, witnessFloorDecisions: proof.witness.decisions, interactionDepth: 0, setupDecisionPressure: 0,
      necessaryFloorDecisionShare: 1, exactFullPlanWins: proof.winningPlacementChoices,
      exactFullPlanTrials: proof.legalPlacementChoices, counterfactualResult: calmResult, variant: 8, targetGroupCount: 2 };
  } catch { return null; }
}
function layeredCandidate(serial, requireSwitch = true) {
  const shift = Math.floor(serial / 4) % 2;
  const mirror = Math.floor(serial / 8) % 2 === 1;
  const towerHeight = 4 + serial % 4;
  const width = WIDTH, height = HEIGHT, targetX = 3 + shift;
  const initialBoard = Array(width * height).fill(null), targetIds = [];
  let id = 1;
  const put = (x, y, colour, target = false) => { const gem = { id: id++, colour }; initialBoard[y * width + x] = gem; if (target) targetIds.push(gem.id); };
  // The lower blue and green bars are separate support layers. Removing them
  // in queue order lowers the red column twice before the final split.
  for (let dx = -1; dx <= 1; dx++) put(targetX + dx, 10, 'blue', true);
  for (let dx = -1; dx <= 1; dx++) put(targetX + dx, 11, 'green', true);
  for (let y = 7; y <= 9; y++) put(targetX, y, 'red', true);
  const towerX = targetX + (mirror ? -1 : 1);
  const colours = ['gold', 'purple', 'teal', 'gold', 'purple', 'teal', 'gold', 'purple', 'teal'];
  for (let i = 0; i < towerHeight; i++) put(towerX, 10 - towerHeight + i, colours[i]);
  const outerX = (serial & 1) === 0 ? 0 : width - 1;
  const outerHeight = Math.floor(serial / 16) % 5;
  for (let i = 0; i < outerHeight; i++) put(outerX, height - 1 - i, ['teal','gold','purple','teal','gold'][i]);
  if (mirror) {
    const reflected = Array(width * height).fill(null);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) reflected[y * width + width - 1 - x] = initialBoard[y * width + x];
    initialBoard.splice(0, initialBoard.length, ...reflected);
  }
  const queue = [['blue','gold','purple','teal'], ['blue','gold','green','purple'], ['gold','purple','teal','red']];
  if (mirror) for (const piece of queue) {
    [piece[0], piece[1]] = [piece[1], piece[0]];
    [piece[2], piece[3]] = [piece[3], piece[2]];
  }
  const options = { mode: 'relaxed', width, height, colourCount: 6, seed: `magnetic-layer-${serial}`, initialBoard, queue,
    pieceLimit: 3, schedule: requireSwitch ? { kind: 'fixed', floor: 'calm' } : { kind: 'authored', magneticPlacements: [3] },
    floorSwitch: requireSwitch, magneticImpact: false, goal: { kind: 'clear-targets', targetIds } };
  const xs = mirror ? [1 - shift, 6 - shift, 3 - shift] : [5 + shift, shift, 3 + shift];
  const witness = [];
  let state = createGame(options);
  for (let i = 0; i < 3; i++) {
    const p = actionPath(state, xs[i], 0, requireSwitch && i === 2 ? 'magnetic' : null);
    if (!p || ['lost', 'finished'].includes(p.state.phase)) return null;
    witness.push(...p.actions); state = p.state;
  }
  if (state.phase !== 'won') return null;
  const calmOptions = structuredClone(options); calmOptions.schedule = { kind: 'fixed', floor: 'calm' }; calmOptions.floorSwitch = false;
  const calmActions = witness.filter(action => action.kind !== 'set-floor-override');
  let floorAlternative;
  try { floorAlternative = proveWithWitness(calmOptions, calmActions).phase; } catch { return null; }
  if (requireSwitch && floorAlternative === 'won') return null;
  const groups = []; let group = []; for (const action of witness) { group.push(action); if (action.kind === 'hard-drop') { groups.push(group); group = []; } }
  let finalStart = createGame(options); finalStart = applyGroup(finalStart, groups[0]); finalStart = applyGroup(finalStart, groups[1]);
  const finalChoices = choices(finalStart), setupEvidence = measureSetupPressure(options, witness);
  let causalState = createGame(options), remaining = targetIds.length;
  const targetIdsClearedByPlacement = [], targetIdsRemainingAfterPlacement = [], targetIdsMovedByPlacement = [];
  for (const actionGroup of groups) {
    const before = new Map(targetIds.map(targetId => [targetId, causalState.board.findIndex(gem => gem?.id === targetId)]));
    causalState = applyGroup(causalState, actionGroup);
    const after = targetIds.filter(targetId => causalState.board.some(gem => gem?.id === targetId)).length;
    const moved = targetIds.filter(targetId => {
      const oldIndex = before.get(targetId), newIndex = causalState.board.findIndex(gem => gem?.id === targetId);
      return oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex;
    }).length;
    targetIdsClearedByPlacement.push(remaining - after); targetIdsRemainingAfterPlacement.push(after); remaining = after;
    targetIdsMovedByPlacement.push(moved);
  }
  return { serial, options, witness, legalPlacementChoices: finalChoices.length,
    setupPlacementChoices: choices(createGame(options)).length, winningPlacementChoices: finalChoices.filter(choice => choice.state.phase === 'won').length,
    witnessPlacements: state.placements, witnessFloorDecisions: requireSwitch ? 1 : 0,
    interactionDepth: requireSwitch ? 2 : 1, setupDecisionPressure: setupEvidence.pressure, setupEvidence: setupEvidence.steps,
    targetIdsClearedByPlacement, targetIdsRemainingAfterPlacement, targetIdsMovedByPlacement, necessaryFloorDecisionShare: requireSwitch ? 1 : 0,
    counterfactualResult: floorAlternative, variant: requireSwitch ? 6 : 7, layerEvidence: true };
}
function measureSetupPressure(options, witness) {
  const groups = []; let group = [];
  for (const action of witness) { group.push(action); if (action.kind === 'hard-drop' || action.kind === 'land') { groups.push(group); group = []; } }
  if (group.length) groups.push(group);
  if (groups.length < 2) return { pressure: 0, steps: [] };
  const pressures = [];
  for (let step = 0; step < groups.length - 1; step++) {
    let state = createGame(options);
    for (let i = 0; i < step; i++) state = applyGroup(state, groups[i]);
    const legal = choices(state), suffix = groups.slice(step + 1).flat(); let wins = 0;
    for (const choice of legal) {
      let next = choice.state;
      try { next = applyActions(next, suffix); if (next.phase === 'won') wins++; } catch { /* invalid alternatives are losing evidence */ }
    }
    pressures.push({ step, legalChoices: legal.length, preservingChoices: wins, pressure: legal.length ? 1 - wins / legal.length : 1 });
  }
  return { pressure: pressures.reduce((sum, value) => sum + value.pressure, 0) / pressures.length, steps: pressures };
}
function applyActions(state, actions) {
  for (const action of actions) {
    state = advanceToInput(state);
    if (state.phase !== 'falling') throw new Error(`terminal phase ${state.phase}`);
    const result = applyAction(state, action);
    if (!result.accepted) throw new Error(`rejected ${action.kind}`);
    state = result.state;
  }
  return advanceToInput(state);
}
function applyGroup(state, group) { return applyActions(state, group); }
function seededRandom(seedText) {
  let state = Number.parseInt(hash(seedText).slice(0, 8), 16) || 1;
  return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 0x100000000; };
}
function sampleFullPlans(options, trials, seedText) {
  const random = seededRandom(seedText); let wins = 0;
  for (let trial = 0; trial < trials; trial++) {
    let state = createGame(options);
    for (let placed = 0; state.phase === 'falling' && placed < options.pieceLimit; placed++) {
      const legal = choices(state);
      if (!legal.length) break;
      state = legal[Math.floor(random() * legal.length)].state;
    }
    if (state.phase === 'won') wins++;
  }
  return wins;
}
function grade(item, canonicalKey) {
  const trials = item.variant === 6 ? 1024 : 128;
  let wins;
  if (item.witnessPlacements === 1) {
    const legal = choices(createGame(item.options)), random = seededRandom(canonicalKey); wins = 0;
    for (let i = 0; i < trials; i++) if (legal[Math.floor(random() * legal.length)]?.state.phase === 'won') wins++;
  } else wins = sampleFullPlans(item.options, trials, canonicalKey);
  const fullRate = wins / trials;
  const finalRate = item.legalPlacementChoices ? item.winningPlacementChoices / item.legalPlacementChoices : 0;
  const raw = 0.35 * (1 - fullRate) + 0.25 * (1 - finalRate)
    + 0.15 * Math.min(1, (item.setupDecisionPressure ?? 0))
    + 0.15 * Math.min(1, (item.interactionDepth ?? 0) / 2)
    + 0.10 * Math.min(1, (item.necessaryFloorDecisionShare ?? 0));
  return { raw, score: Math.max(1, Math.min(100, 1 + Math.round(99 * raw))), trials, wins, fullRate, finalRate, setupDecisionPressure: item.setupDecisionPressure ?? 0 };
}
/** Structural gate rejects several independent target clears masquerading as a layered plan. */
export function hasCausalTargetDependencies(item, minimumDependentSteps) {
  const clears = item.targetIdsClearedByPlacement ?? [];
  const remaining = item.targetIdsRemainingAfterPlacement ?? [];
  const moved = item.targetIdsMovedByPlacement ?? [];
  return Boolean(item.layerEvidence) && remaining.at(-1) === 0
    && clears.filter(count => count > 0).length >= 2
    && moved.slice(0, -1).filter(count => count > 0).length >= minimumDependentSteps;
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
  const pool = new Map();
  const add = item => { if (!item) return; const canonicalKey = normalizedColourKey(item.options); if (!pool.has(canonicalKey)) pool.set(canonicalKey, { ...item, canonicalKey }); };
  for (let serial = 0; serial < 600; serial++) add(openCandidate(serial));
  for (let serial = 0; serial < 500; serial++) add(doubleTargetCandidate(serial));
  for (let serial = 0; serial < 32; serial++) { add(layeredCandidate(serial, false)); add(layeredCandidate(serial, true)); }
  const graded = [...pool.values()].map(item => ({ ...item, ...grade(item, item.canonicalKey) }));
  const ranges = [
    { id: 'entry', count: 32, min: 1, max: 20 }, { id: 'easy', count: 32, min: 21, max: 40 },
    { id: 'intermediate', count: 32, min: 41, max: 60 }, { id: 'hard', count: 24, min: 61, max: 80 },
    { id: 'expert', count: 8, min: 81, max: 100 },
  ];
  const selected = [];
  for (const range of ranges) {
    let matches = graded.filter(item => item.score >= range.min && item.score <= range.max);
    if (range.id === 'intermediate') matches = matches.filter(item => item.targetGroupCount === 2);
    if (range.id === 'hard') matches = matches.filter(item => hasCausalTargetDependencies(item, 1));
    if (range.id === 'expert') matches = matches.filter(item => item.interactionDepth === 2 && item.necessaryFloorDecisionShare === 1 && hasCausalTargetDependencies(item, 2));
    matches.sort((a, b) => a.score - b.score || a.canonicalKey.localeCompare(b.canonicalKey));
    if (matches.length < range.count) throw new Error(`Only ${matches.length}/${range.count} verified ${range.id} candidates; pool=${pool.size}; scores=${JSON.stringify(graded.reduce((out, item) => { const key = item.score <= 20 ? 'entry' : item.score <= 40 ? 'easy' : item.score <= 60 ? 'intermediate' : item.score <= 80 ? 'hard' : 'expert'; out[key] = (out[key] ?? 0) + 1; return out; }, {}))}`);
    selected.push(...matches.slice(0, range.count).map(item => ({ ...item, band: range.id })));
  }
  selected.sort((a, b) => a.score - b.score || a.canonicalKey.localeCompare(b.canonicalKey));
  const bands = []; let cursor = 0;
  for (const range of ranges) { bands.push({ id: range.id, count: range.count, first: cursor + 1, last: cursor + range.count }); cursor += range.count; }
  const levels = selected.map((item, index) => {
    const band = item.band;
    const text = band === 'expert' ? ['Layered support sequence', '重なる支えの順序', 'Clear blue, then green, then switch to Pull for the red target.', '青、緑の順に消し、最後に引力へ切り替えて赤い目標を消します。']
      : band === 'hard' ? ['Layered support', '重なる支え', 'Remove the marked support layers in queue order to expose the final target.', '順番に支えの層を消して、最後の目標を見つけます。']
      : band === 'intermediate' ? ['Two marked columns', '2つの印の列', 'Use Pull to split one block across two marked red columns.', '引力でブロックを分け、2つの印の赤い列に届けます。']
      : ['Open landing', '自由な着地', 'Match the marked red line with a legal block placement.', '合法なブロック配置で印の赤い列をそろえます。'];
    const [titleEn, titleJa, objectiveEn, objectiveJa] = text;
    const occupiedCells = item.options.initialBoard.filter(Boolean).length;
    const usableCells = item.options.mask ? item.options.mask.filter(Boolean).length : item.options.width * item.options.height;
    const metrics = { occupiedCells, usableCells, boardCoverage: Number((occupiedCells / usableCells).toFixed(6)), legalPlacementChoices: item.legalPlacementChoices, setupPlacementChoices: item.setupPlacementChoices ?? 0,
      winningPlacementChoices: item.winningPlacementChoices, availableFloorChoices: item.options.floorSwitch ? 3 : 1,
      witnessPlacements: item.witnessPlacements, witnessFloorDecisions: item.witnessFloorDecisions, difficultyScore: item.score,
      fullPlanTrials: item.trials, fullPlanWins: item.wins, fullPlanSuccessRate: item.fullRate,
      setupDecisionPressure: item.setupDecisionPressure ?? 0, interactingDependencyDepth: item.interactionDepth ?? 0,
      necessaryFloorDecisionShare: item.necessaryFloorDecisionShare ?? 0,
      ...(item.setupEvidence ? { setupDecisionEvidence: item.setupEvidence } : {}),
      ...(item.targetIdsClearedByPlacement ? { targetIdsClearedByPlacement: item.targetIdsClearedByPlacement, targetIdsRemainingAfterPlacement: item.targetIdsRemainingAfterPlacement, targetIdsMovedByPlacement: item.targetIdsMovedByPlacement } : {}),
      minimumPlanSearch: { status: item.witnessPlacements === 1 ? 'exact' : 'unknown', nodeBudget: item.witnessPlacements === 1 ? item.legalPlacementChoices : 0,
        nodesVisited: item.witnessPlacements === 1 ? item.legalPlacementChoices : 0, lowerBound: 1,
        upperBound: item.witnessPlacements } };
    const id = `magnetic-${hash(item.canonicalKey).slice(0, 16)}`;
    const options = { ...item.options, seed: id };
    return { id, number: index + 1, band,
      title: { en: `${titleEn} ${String(index + 1).padStart(3, '0')}`, ja: `${titleJa} ${String(index + 1).padStart(3, '0')}` },
      objective: { en: objectiveEn, ja: objectiveJa }, options, witness: item.witness, witnessResult: 'won', metrics,
      marks: Math.min(5, 1 + Math.floor((item.score - 1) / 20)), tags: [band, item.layerEvidence ? 'layered-support' : item.targetGroupCount === 2 ? 'two-target-groups' : 'marked-line', item.witnessPlacements > 1 ? 'multi-placement' : 'single-placement'],
      canonicalKey: item.canonicalKey, canonicalKeyHash: hash(item.canonicalKey), score: item.score, gradingVersion: GRADING,
      proofStatus: 'engine-witness-verified', reviewStatus: 'human-review-pending',
      ...(item.counterfactualResult ? { counterfactual: { kind: item.options.floorSwitch ? 'floor-switch' : 'floor-schedule', alternative: item.options.floorSwitch ? 'same witness without the one-use floor switch' : 'same witness with Calm on the scheduled placement', result: item.counterfactualResult } } : {}) };
  });
  const body = { count: levels.length, currentCount: levels.length, candidateCount: pool.size, generationRevision: REVISION, gradingVersion: GRADING,
    difficultyFormula: 'raw = .35*(1 - completePlanWinRate) + .25*(1 - finalWinningChoices/finalLegalChoices) + .15*meanFixedSuffixSetupPressure + .15*min(1, interactingDependencyDepth/2) + .10*necessaryFloorDecisionShare; score = clamp(1,100,1+round(99*raw)). Full-plan evidence uses 128 seeded legal playouts (1024 for expert candidates).',
    normalization: 'Absolute score; no pool-relative normalization. Bands are fixed at 1–20, 21–40, 41–60, 61–80, and 81–100.',
    marksFormula: 'min(5, 1 + floor((score - 1) / 20))', orderingPolicy: 'Sort ascending by measured integer score, then canonical SHA-256 key; band comes from fixed score ranges.',
    bands, levels };
  const campaign = { ...body, checksum: hash(stable(body)) };
  return deepFreeze({ campaign, lessons: makeLessons() });
}
if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  const data = generateContent();
  const source = `import type { MagneticContentData } from './content-types.js';\n\n/** Generated by scripts/magnetic-blocks-levels.mjs. */\nexport const contentData: MagneticContentData = ${JSON.stringify(data, null, 2)};\n`;
  await writeFile(new URL('../src/magnetic-blocks/content-data.ts', import.meta.url), source);
  process.stdout.write(`${data.campaign.count} verified levels from ${data.campaign.candidateCount} canonical candidates · ${data.campaign.checksum}\n`);
}
