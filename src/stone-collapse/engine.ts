import type { Action, ChallengeDefinition, ChallengeGoal, ChallengeOptions, CreateOptions, GameEvent, GameMode, GameState, GameStatus, Settings, Stone, StoneColour, StoredTool, Transition, UndoFrame } from './types.js';
import { optionsFor, neighbors, StoneCollapseOptionsError } from './validation.js';
import type { NormalizedOptions } from './validation.js';

const COLOURS: readonly StoneColour[] = ['red', 'blue', 'green', 'gold', 'purple', 'teal'];
const COLOURS_USED: readonly StoneColour[] = COLOURS;
const RULES = 'collapse-2' as const;
const MARK_TICKS = 7;
const REMOVE_TICKS = 6;
const GRAVITY_TICKS = 9;
const MAX_RECORDED_ACTIONS = 100_000;
const MAX_RECORDED_TICKS = 10_000_000;

function hashSeed(seed: string | number): number {
  let hash = 0x811c9dc5;
  const bytes = new TextEncoder().encode(String(seed));
  for (const byte of bytes) hash = Math.imul(hash ^ byte, 0x01000193) >>> 0;
  return hash || 0x6d2b79f5;
}
function nextUint32(state: number): number {
  let value = state >>> 0;
  value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
  return value >>> 0;
}
function nextInt(state: number, size: number): readonly [number, number] {
  const limit = Math.floor(0x1_0000_0000 / size) * size;
  let current = state >>> 0;
  for (;;) {
    const value = nextUint32(current); current = value;
    if (value < limit) return [value % size, current];
  }
}
function drawColour(state: number, count: number): readonly [StoneColour, number] {
  const [index, next] = nextInt(state, count);
  return [COLOURS[index]!, next];
}

function groupAt(board: readonly (Stone | null)[], settings: GameState['settings'], start: number): readonly number[] {
  const stone = board[start]; if (!stone) return [];
  const mask = settings.mask!; const found = new Set<number>([start]); const pending = [start];
  while (pending.length) {
    const at = pending.pop()!;
    for (const next of neighbors(at, settings.width, settings.height, mask)) if (!found.has(next) && board[next]?.colour === stone.colour) { found.add(next); pending.push(next); }
  }
  return [...found].sort((a, b) => a - b);
}
function hasLegalGroup(board: readonly (Stone | null)[], settings: GameState['settings']): boolean {
  return board.some((stone, index) => Boolean(stone && groupAt(board, settings, index).length >= 2));
}
function canUseTool(state: GameState): boolean {
  return state.settings.tools && state.board.some(Boolean) && (state.inventory.bomb > 0 || state.inventory.pick > 0);
}
function previewAt(state: GameState, tool: StoredTool, target: number): readonly number[] {
  if (!Number.isInteger(target) || target < 0 || target >= state.board.length || !state.settings.mask[target] || !state.board[target]) return [];
  if (tool === 'pick') return [target];
  const { width, height, mask } = state.settings; const tx = target % width, ty = Math.floor(target / width); const cells: number[] = [];
  for (let y = Math.max(0, ty - 1); y <= Math.min(height - 1, ty + 1); y++) for (let x = Math.max(0, tx - 1); x <= Math.min(width - 1, tx + 1); x++) {
    const index = y * width + x;
    if (mask[index] && state.board[index]) cells.push(index);
  }
  return cells;
}
function clearToolSelection(state: GameState): Pick<GameState, 'selectedTool' | 'toolTarget' | 'toolPreview'> {
  return { selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]) };
}
function recordToolAction(state: GameState, action: GameState['recording'][number]): readonly GameState['recording'][number][] | null {
  return state.recording.length >= MAX_RECORDED_ACTIONS ? null : Object.freeze([...state.recording, action]);
}
function undoFrame(state: GameState): UndoFrame {
  return Object.freeze({ board: state.board, score: state.score, moves: state.moves, removed: state.removed, randomState: state.randomState, nextId: state.nextId, usedFallback: state.usedFallback, finishAdjustmentApplied: state.finishAdjustmentApplied, selectedId: state.selectedId, selectedIds: state.selectedIds, previewScore: state.previewScore, witnessIndex: state.witnessIndex, inventory: state.inventory, toolProgress: state.toolProgress, toolAwardCursor: state.toolAwardCursor, selectedTool: state.selectedTool, toolTarget: state.toolTarget, toolPreview: state.toolPreview });
}

/** @internal Constructs the generator's bounded valid-pair fallback for direct invariant checks. */
export function fallbackBoard(mask: readonly boolean[], width: number, height: number, colourCount: number): readonly (Stone | null)[] {
  const pair = mask.findIndex((on, index) => on && neighbors(index, width, height, mask).some(next => next > index));
  if (pair < 0) throw new StoneCollapseOptionsError('invalid-fallback-mask', 'Fallback requires at least one orthogonal active-cell pair');
  const partner = neighbors(pair, width, height, mask).find(next => next > pair)!;
  let id = 1;
  return Object.freeze(mask.map((on, index) => !on ? null : Object.freeze({ id: id++, colour: index === pair || index === partner ? COLOURS_USED[0]! : COLOURS_USED[(index + 1) % colourCount]! })));
}
function baseState(settings: Settings, board: readonly (Stone | null)[], randomState: number, challenge: ChallengeDefinition | null, usedFallback = false): GameState {
  const initialBoard = Object.freeze([...board]);
  const inventory = settings.tools ? { bomb: 1, pick: 1 } : { bomb: 0, pick: 0 };
  return {
    game: 'stone-collapse', rules: RULES, settings: Object.freeze({ ...settings, mask: Object.freeze([...settings.mask]) }), challenge,
    initialBoard, board: initialBoard, phase: 'ready', selectedId: null, selectedIds: Object.freeze([]), previewScore: 0,
    score: 0, moves: 0, removed: 0, randomState, nextId: Math.max(0, ...board.flatMap(stone => stone ? [stone.id] : [])) + 1,
    usedFallback, resolutionTick: 0, pendingIds: Object.freeze([]), gravityBoard: null,
    finishAdjustmentApplied: false, assisted: false, history: Object.freeze([]), witnessIndex: challenge ? 0 : -1,
    elapsedTicks: 0, recording: Object.freeze([]), inventory: Object.freeze(inventory), toolProgress: 0, toolAwardCursor: 0,
    selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]),
  };
}
/** Creates a seeded full board; an all-singleton draw retries before using a checked adjacent pair. */
export function createGame(options: CreateOptions = {}): GameState {
  const valid = optionsFor(options); // All settings are checked before drawing any random values.
  let randomState = hashSeed(`stone-collapse|${RULES}|${String(valid.seed)}`);
  let board: (Stone | null)[] = []; let nextId = 1; let usedFallback = false; let found = false;
  for (let attempt = 0; attempt < 128 && !found; attempt++) {
    const candidate: (Stone | null)[] = []; let id = 1;
    for (const active of valid.mask) {
      if (!active) candidate.push(null);
      else { const [colour, next] = drawColour(randomState, valid.colourCount); randomState = next; candidate.push({ id: id++, colour }); }
    }
    board = candidate; nextId = id;
    const settings = { ...valid, mask: valid.mask } as GameState['settings'];
    found = hasLegalGroup(board, settings);
  }
  if (!found) {
    // Preserve the consumed stream and IDs; the first adjacent active pair is a guaranteed legal move.
    board = [...fallbackBoard(valid.mask, valid.width, valid.height, valid.colourCount)];
    nextId = valid.mask.filter(Boolean).length + 1; usedFallback = true;
  }
  const settings: Settings = { ...valid, mode: valid.mode, mask: valid.mask };
  const state = baseState(settings, board, randomState, null, usedFallback);
  return { ...state, nextId };
}

/** Creates a fixed witnessed challenge after validating its board, objective, move budget, and every witness group. */
export function createChallenge(options: ChallengeOptions): GameState {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new StoneCollapseOptionsError('invalid-challenge', 'Challenge options must be an object');
  const allowedKeys = ['id', 'width', 'height', 'colourCount', 'seed', 'mask', 'initialBoard', 'goal', 'moveLimit', 'witness'];
  if (Object.keys(options).some(key => !allowedKeys.includes(key))) throw new StoneCollapseOptionsError('unknown-challenge-option', 'Challenge options contain an unsupported field');
  if (typeof options.id !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,63}$/.test(options.id)) throw new StoneCollapseOptionsError('invalid-challenge-id', 'Challenge ID must be a stable lowercase identifier');
  const base = optionsFor({ width: options.width, height: options.height, colourCount: options.colourCount, seed: options.seed === undefined ? `challenge:${options.id}` : options.seed, ...(options.mask !== undefined ? { mask: options.mask } : {}) });
  if (!Array.isArray(options.initialBoard) || options.initialBoard.length !== base.width * base.height) throw new StoneCollapseOptionsError('invalid-challenge-board', 'Challenge board must contain one entry per cell');
  const ids = new Set<number>();
  const initialBoard = Array.from(options.initialBoard, (stone, index) => {
    if (!base.mask[index]) {
      if (stone !== null) throw new StoneCollapseOptionsError('stone-in-masked-cell', 'Masked challenge cells must be empty');
      return null;
    }
    if (!stone || typeof stone !== 'object' || Array.isArray(stone) || Object.keys(stone).some(key => key !== 'id' && key !== 'colour') || !Number.isSafeInteger(stone.id) || stone.id < 1 || stone.id > 0x7fff_ffff || ids.has(stone.id) || !COLOURS.slice(0, base.colourCount).includes(stone.colour)) throw new StoneCollapseOptionsError('invalid-challenge-stone', 'Active challenge cells need unique positive IDs and configured colours');
    ids.add(stone.id);
    return Object.freeze({ id: stone.id, colour: stone.colour });
  });
  if (!options.goal || typeof options.goal !== 'object' || !['clear-all', 'clear-targets', 'score-target'].includes(options.goal.kind)) throw new StoneCollapseOptionsError('invalid-challenge-goal', 'Challenge goal must clear all, clear marked stones, or reach a score');
  let goal: ChallengeGoal;
  if (options.goal.kind === 'clear-all') {
    if (Object.keys(options.goal).some(key => key !== 'kind')) throw new StoneCollapseOptionsError('invalid-challenge-goal', 'Clear-all goal contains unsupported fields');
    goal = { kind: 'clear-all' };
  }
  else if (options.goal.kind === 'clear-targets') {
    if (Object.keys(options.goal).some(key => key !== 'kind' && key !== 'targetIds')) throw new StoneCollapseOptionsError('invalid-challenge-goal', 'Target goal contains unsupported fields');
    const targets = options.goal.targetIds;
    if (!Array.isArray(targets) || targets.length === 0 || targets.length > 144 || Array.from(targets).some(id => !Number.isSafeInteger(id) || !ids.has(id)) || new Set(targets).size !== targets.length) throw new StoneCollapseOptionsError('invalid-target-ids', 'Every target ID must name one unique initial challenge stone');
    goal = { kind: 'clear-targets', targetIds: Object.freeze(Array.from(targets).sort((a, b) => a - b)) };
  } else {
    if (Object.keys(options.goal).some(key => key !== 'kind' && key !== 'minimumScore')) throw new StoneCollapseOptionsError('invalid-challenge-goal', 'Score goal contains unsupported fields');
    const minimumScore = options.goal.minimumScore;
    if (!Number.isSafeInteger(minimumScore) || minimumScore < 1 || minimumScore > 1_000_000_000) throw new StoneCollapseOptionsError('invalid-score-goal', 'Minimum score must be an integer from 1 to 1,000,000,000');
    goal = { kind: 'score-target', minimumScore };
  }
  if (options.moveLimit !== undefined && (!Number.isInteger(options.moveLimit) || options.moveLimit < 1 || options.moveLimit > 144)) throw new StoneCollapseOptionsError('invalid-move-limit', 'Challenge move limit must be an integer from 1 to 144');
  if (goal.kind === 'score-target' && options.moveLimit === undefined) throw new StoneCollapseOptionsError('score-goal-needs-budget', 'Score-target challenges require a finite move limit');
  if (!Array.isArray(options.witness) || options.witness.length < 1 || options.witness.length > 72) throw new StoneCollapseOptionsError('invalid-witness', 'Challenge witness must contain 1–72 group removals');
  const witness = Array.from(options.witness, group => {
    if (!Array.isArray(group) || group.length < 2 || group.length > 144 || Array.from(group).some(id => !Number.isSafeInteger(id) || !ids.has(id)) || new Set(group).size !== group.length) throw new StoneCollapseOptionsError('invalid-witness-group', 'Each witness step must name distinct initial stone IDs');
    return Object.freeze(Array.from(group).sort((a, b) => a - b));
  });
  if (options.moveLimit !== undefined && witness.length > options.moveLimit) throw new StoneCollapseOptionsError('witness-exceeds-budget', 'Witness is longer than the challenge move limit');
  const seed = base.seed;
  const challenge: ChallengeDefinition = Object.freeze({ id: options.id, width: base.width, height: base.height, colourCount: base.colourCount, seed, mask: Object.freeze([...base.mask]), initialBoard: Object.freeze(initialBoard), goal, ...(options.moveLimit === undefined ? {} : { moveLimit: options.moveLimit }), witness: Object.freeze(witness) });
  const settings: Settings = { mode: 'challenge', width: base.width, height: base.height, colourCount: base.colourCount, seed, mask: challenge.mask, challengeId: challenge.id, goal, tools: false, ...(options.moveLimit === undefined ? {} : { moveLimit: options.moveLimit }) };
  let state = baseState(settings, challenge.initialBoard, hashSeed(`stone-collapse|${RULES}|${String(seed)}`), challenge);
  let board = challenge.initialBoard; let score = 0; let moves = 0;
  for (let index = 0; index < challenge.witness.length; index++) {
    if (goalSatisfied({ ...state, board, score })) throw new StoneCollapseOptionsError('witness-continues-after-goal', 'Challenge witness must stop at the first completed goal');
    const group = challenge.witness[index]!; const at = indexOfId(board, group[0]!);
    const actual = at < 0 ? [] : groupAt(board, settings, at).map(cell => board[cell]!.id).sort((a, b) => a - b);
    if (actual.length !== group.length || actual.some((id, i) => id !== group[i])) throw new StoneCollapseOptionsError('invalid-witness-path', `Witness group ${index + 1} is not the complete current connected group`);
    score += groupScore(group.length); moves++;
    board = removeAndSettle({ ...state, board, settings }, group);
    state = { ...state, board, score, moves };
    if (!goalSatisfied(state) && (!hasLegalGroup(board, settings) || challenge.moveLimit !== undefined && moves >= challenge.moveLimit)) throw new StoneCollapseOptionsError('witness-does-not-complete-goal', `Witness ends before the goal after move ${moves}`);
  }
  if (!goalSatisfied(state)) throw new StoneCollapseOptionsError('witness-does-not-complete-goal', 'Challenge witness does not reach its objective');
  return baseState(settings, challenge.initialBoard, hashSeed(`stone-collapse|${RULES}|${String(seed)}`), challenge);
}

function groupScore(size: number): number { return 5 * size * (size - 1); }
function emptyTransition(state: GameState, reason: string): Transition { return { state, events: [], accepted: false, reason }; }
function indexOfId(board: readonly (Stone | null)[], id: number): number { return board.findIndex(stone => stone?.id === id); }
function removeAndSettle(state: GameState, removeIds: readonly number[]): readonly (Stone | null)[] {
  const remove = new Set(removeIds); const board = state.board.map(stone => stone && remove.has(stone.id) ? null : stone);
  const result = [...board]; const { width, height, mask } = state.settings;
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && !mask[y * width + x]) y++;
      if (y >= height) break;
      const start = y;
      while (y < height && mask[y * width + x]) y++;
      const end = y; const survivors: Stone[] = [];
      for (let row = start; row < end; row++) { const stone = board[row * width + x]; if (stone) survivors.push(stone); }
      for (let row = start; row < end; row++) result[row * width + x] = null;
      for (let offset = 0; offset < survivors.length; offset++) result[(end - survivors.length + offset) * width + x] = survivors[offset]!;
    }
  }
  if (mask.every(Boolean)) {
    const kept: (Stone | null)[][] = [];
    for (let x = 0; x < width; x++) {
      const column = Array.from({ length: height }, (_, y) => result[y * width + x] ?? null);
      if (column.some(Boolean)) kept.push(column);
    }
    for (let x = 0; x < width; x++) for (let y = 0; y < height; y++) result[y * width + x] = kept[x]?.[y] ?? null;
  }
  return Object.freeze(result);
}
function terminal(state: GameState): readonly [GameState, readonly GameEvent[]] {
  if (state.settings.mode === 'challenge' && state.challenge) {
    if (goalSatisfied(state)) {
      const bonus = state.board.every(stone => stone === null) && !state.finishAdjustmentApplied ? 1000 : 0;
      const won = { ...state, phase: 'won' as const, reason: 'goal-complete', score: state.score + bonus, finishAdjustmentApplied: state.finishAdjustmentApplied || bonus > 0 };
      return [won, [{ type: 'run-ended', result: 'won', reason: 'goal-complete', bonus, score: won.score }]];
    }
    if (!hasLegalGroup(state.board, state.settings)) return [{ ...state, phase: 'lost', reason: 'no-legal-groups' }, [{ type: 'run-ended', result: 'lost', reason: 'no-legal-groups', score: state.score }]];
    if (state.challenge.moveLimit !== undefined && state.moves >= state.challenge.moveLimit) return [{ ...state, phase: 'lost', reason: 'move-limit', score: state.score }, [{ type: 'run-ended', result: 'lost', reason: 'move-limit', score: state.score }]];
    return [state, []];
  }
  if (state.board.every(stone => stone === null)) {
    if (state.finishAdjustmentApplied) return [state, []];
    return [{ ...state, phase: 'won', reason: 'board-empty', score: state.score + 1000, finishAdjustmentApplied: true }, [{ type: 'run-ended', result: 'won', reason: 'board-empty', bonus: 1000, score: state.score + 1000 }]];
  }
  if (!hasLegalGroup(state.board, state.settings)) {
    if (canUseTool(state)) return [state, []];
    const penalty = Math.min(state.score, 10 * state.board.filter(Boolean).length);
    if (state.finishAdjustmentApplied) return [state, []];
    return [{ ...state, phase: 'finished', reason: 'no-legal-groups', score: state.score - penalty, finishAdjustmentApplied: true }, [{ type: 'run-ended', result: 'finished', reason: 'no-legal-groups', penalty, remaining: state.board.filter(Boolean).length, score: state.score - penalty }]];
  }
  return [state, []];
}

function goalSatisfied(state: GameState): boolean {
  const goal = state.challenge?.goal;
  if (!goal) return false;
  if (goal.kind === 'clear-all') return state.board.every(stone => stone === null);
  if (goal.kind === 'clear-targets') return goal.targetIds.every(id => !state.board.some(stone => stone?.id === id));
  return state.score >= goal.minimumScore;
}

function confirmSelected(state: GameState): Transition {
  if (state.recording.length >= MAX_RECORDED_ACTIONS) return emptyTransition(state, 'recording-action-limit');
  if (state.selectedId === null || state.selectedIds.length < 2) return emptyTransition(state, 'no-legal-group-selected');
  const currentIndex = indexOfId(state.board, state.selectedId);
  const currentIds = currentIndex < 0 ? [] : groupAt(state.board, state.settings, currentIndex).map(at => state.board[at]!.id);
  if (currentIds.length !== state.selectedIds.length || currentIds.some((id, i) => id !== state.selectedIds[i])) return emptyTransition(state, 'stale-selection');
  const ids = [...state.selectedIds]; const points = groupScore(ids.length); const score = state.score + points;
  const gravityBoard = removeAndSettle(state, ids);
  const moves = state.moves + 1;
  const frame = undoFrame(state);
  let inventory = state.inventory; let toolProgress = state.toolProgress; let toolAwardCursor = state.toolAwardCursor;
  const awardEvents: GameEvent[] = [];
  if (state.settings.tools) {
    const total = state.toolProgress + ids.length; let awards = Math.floor(total / 12); toolProgress = total % 12;
    const awardedInventory = { ...state.inventory };
    while (awards-- > 0) {
      const tool: StoredTool = toolAwardCursor === 0 ? 'bomb' : 'pick'; toolAwardCursor = (toolAwardCursor === 0 ? 1 : 0);
      const discarded = awardedInventory[tool] >= 3;
      if (!discarded) awardedInventory[tool]++;
      awardEvents.push({ type: 'tool-awarded', tool, count: awardedInventory[tool], discarded });
    }
    inventory = Object.freeze(awardedInventory);
  }
  const expected = state.challenge?.witness[state.witnessIndex];
  const witnessIndex = expected && expected.length === ids.length && expected.every((id, i) => [...ids].sort((a, b) => a - b)[i] === id) ? state.witnessIndex + 1 : state.challenge ? -1 : -1;
  const next: GameState = { ...state, selectedId: null, selectedIds: Object.freeze([]), previewScore: 0, ...clearToolSelection(state), inventory, toolProgress, toolAwardCursor, score, moves, phase: 'clear-mark', resolutionTick: 0, pendingIds: Object.freeze(ids), gravityBoard, history: Object.freeze([...state.history, frame]), witnessIndex, recording: Object.freeze([...state.recording, { kind: 'remove', move: moves, stoneId: state.selectedId }]) };
  return { state: next, events: [{ type: 'group-committed', ids, points, move: moves }, { type: 'score-changed', score, points }, ...awardEvents], accepted: true };
}

function confirmTool(state: GameState): Transition {
  if (!state.settings.tools || !state.selectedTool || state.toolTarget === null || state.recording.length >= MAX_RECORDED_ACTIONS) return emptyTransition(state, 'tool-not-ready');
  const count = state.inventory[state.selectedTool];
  const preview = previewAt(state, state.selectedTool, state.toolTarget);
  if (count < 1 || !preview.length || preview.length !== state.toolPreview.length || preview.some((cell, index) => state.toolPreview[index] !== cell)) return emptyTransition(state, 'stale-tool-preview');
  const ids = preview.map(index => state.board[index]!.id); const points = 10 * ids.length; const moves = state.moves + 1;
  const inventory = Object.freeze({ ...state.inventory, [state.selectedTool]: count - 1 });
  const frame = undoFrame(state); const recording = recordToolAction(state, { kind: 'confirm-tool', move: moves });
  if (!recording) return emptyTransition(state, 'recording-action-limit');
  const next: GameState = {
    ...state, ...clearToolSelection(state), selectedId: null, selectedIds: Object.freeze([]), previewScore: 0,
    inventory: inventory, score: state.score + points, moves, phase: 'clear-mark', resolutionTick: 0,
    pendingIds: Object.freeze(ids), gravityBoard: removeAndSettle(state, ids), history: Object.freeze([...state.history, frame]),
    assisted: true, recording,
  };
  return { state: next, events: [{ type: 'tool-used', tool: state.selectedTool, target: state.toolTarget, cells: preview, ids, points, move: moves }, { type: 'score-changed', score: next.score, points }], accepted: true };
}

function hintGroup(state: GameState): readonly number[] | null {
  if (state.settings.mode !== 'challenge' || !state.challenge || state.witnessIndex < 0) return null;
  const expected = state.challenge.witness[state.witnessIndex];
  if (!expected) return null;
  const at = indexOfId(state.board, expected[0]!);
  if (at < 0) return null;
  const actual = groupAt(state.board, state.settings, at).map(cell => state.board[cell]!.id);
  const sorted = [...actual].sort((a, b) => a - b);
  return sorted.length === expected.length && sorted.every((id, i) => id === expected[i]) ? actual : null;
}
function canUndo(state: GameState): boolean { return (state.settings.mode === 'relaxed' || state.settings.mode === 'challenge') && state.history.length > 0 && state.recording.length < MAX_RECORDED_ACTIONS; }
function undoCore(state: GameState): Transition {
  if (!canUndo(state) || !['ready', 'won', 'finished', 'lost'].includes(state.phase)) return emptyTransition(state, 'undo-unavailable');
  const frame = state.history.at(-1)!;
  const restored: GameState = { ...state, ...frame, phase: 'ready', resolutionTick: 0, pendingIds: Object.freeze([]), gravityBoard: null, assisted: true, history: Object.freeze(state.history.slice(0, -1)), reason: undefined, recording: Object.freeze([...state.recording, { kind: 'undo', move: frame.moves }]) };
  return { state: restored, events: [{ type: 'move-undone', move: frame.moves, assisted: true }], accepted: true };
}

function applyCore(state: GameState, action: Action): Transition {
  if (!action || typeof action !== 'object' || !['select', 'confirm', 'cancel', 'undo', 'hint', 'select-tool', 'target-tool', 'confirm-tool', 'cancel-tool'].includes((action as { kind?: string }).kind ?? '') || action.kind === 'select' && !Number.isInteger(action.stoneId) || action.kind === 'select-tool' && !['bomb', 'pick'].includes(action.tool) || action.kind === 'target-tool' && !Number.isInteger(action.cell)) return emptyTransition(state, 'invalid-action');
  const actionKeys = action.kind === 'select' ? ['kind', 'stoneId'] : action.kind === 'select-tool' ? ['kind', 'tool'] : action.kind === 'target-tool' ? ['kind', 'cell'] : ['kind'];
  if (Object.keys(action).some(key => !actionKeys.includes(key))) return emptyTransition(state, 'invalid-action');
  if (action.kind === 'undo') return undoCore(state);
  if (state.phase !== 'ready') return emptyTransition(state, 'resolution-in-progress');
  if (action.kind === 'select-tool') {
    if (!state.settings.tools) return emptyTransition(state, 'tools-disabled');
    if (state.inventory[action.tool] < 1) return emptyTransition(state, 'tool-out-of-stock');
    if (state.recording.length > MAX_RECORDED_ACTIONS - 3) return emptyTransition(state, 'recording-action-limit');
    const recording = recordToolAction(state, action); if (!recording) return emptyTransition(state, 'recording-action-limit');
    return { state: { ...state, selectedId: null, selectedIds: Object.freeze([]), previewScore: 0, selectedTool: action.tool, toolTarget: null, toolPreview: Object.freeze([]), recording }, events: [{ type: 'tool-selected', tool: action.tool, count: state.inventory[action.tool] }], accepted: true };
  }
  if (action.kind === 'target-tool') {
    if (!state.settings.tools || !state.selectedTool) return emptyTransition(state, 'tool-not-selected');
    if (state.recording.length > MAX_RECORDED_ACTIONS - 2) return emptyTransition(state, 'recording-action-limit');
    const preview = previewAt(state, state.selectedTool, action.cell);
    if (!preview.length) return emptyTransition(state, 'tool-target-must-be-occupied');
    const recording = recordToolAction(state, action); if (!recording) return emptyTransition(state, 'recording-action-limit');
    const ids = preview.map(index => state.board[index]!.id);
    return { state: { ...state, toolTarget: action.cell, toolPreview: Object.freeze([...preview]), recording }, events: [{ type: 'tool-targeted', tool: state.selectedTool, target: action.cell, cells: preview, ids, count: preview.length }], accepted: true };
  }
  if (action.kind === 'confirm-tool') return confirmTool(state);
  if (action.kind === 'cancel-tool') {
    if (!state.selectedTool) return emptyTransition(state, 'tool-not-selected');
    const recording = recordToolAction(state, action); if (!recording) return emptyTransition(state, 'recording-action-limit');
    return { state: { ...state, ...clearToolSelection(state), recording }, events: [{ type: 'tool-cancelled' }], accepted: true };
  }
  if (action.kind === 'hint') {
    if (state.recording.length >= MAX_RECORDED_ACTIONS) return emptyTransition(state, 'recording-action-limit');
    const group = hintGroup(state);
    if (!group) return emptyTransition(state, state.settings.mode === 'challenge' ? 'no-proved-hint' : 'hints-disabled');
    const stoneId = group[0]!;
    return { state: { ...state, ...clearToolSelection(state), selectedId: stoneId, selectedIds: Object.freeze(group), previewScore: groupScore(group.length), assisted: true, recording: Object.freeze([...state.recording, { kind: 'hint', witnessIndex: state.witnessIndex }]) }, events: [{ type: 'hint-shown', ids: group, points: groupScore(group.length), assisted: true }], accepted: true };
  }
  if (action.kind === 'select') {
    const index = indexOfId(state.board, action.stoneId);
    if (index < 0) return emptyTransition(state, 'unknown-stone');
    const ids = groupAt(state.board, state.settings, index);
    if (ids.length < 2) return emptyTransition(state, 'choose-two-or-more-connected-stones');
    const selectedIds = ids.map(at => state.board[at]!.id);
    if (state.selectedId !== null && state.selectedIds.length === selectedIds.length && state.selectedIds.every((id, i) => id === selectedIds[i])) return confirmSelected(state);
    return { state: { ...state, ...clearToolSelection(state), selectedId: action.stoneId, selectedIds: Object.freeze(selectedIds), previewScore: groupScore(ids.length) }, events: [{ type: 'group-selected', ids: selectedIds, size: ids.length, points: groupScore(ids.length) }], accepted: true };
  }
  if (action.kind === 'cancel') {
    if (state.selectedId === null) return emptyTransition(state, 'nothing-selected');
    return { state: { ...state, selectedId: null, selectedIds: Object.freeze([]), previewScore: 0 }, events: [{ type: 'selection-cleared' }], accepted: true };
  }
  return confirmSelected(state);
}

/** Applies a selection, confirmation, or cancellation without mutating its input. */
export function applyAction(state: GameState, action: Action): Transition { return applyCore(state, action); }

/** Selects the next supplied witness group only while the run still matches its path; accepted hints mark the run assisted. */
export function requestHint(state: GameState): Transition { return applyCore(state, { kind: 'hint' }); }
/** Restores the full pre-move state in Relaxed or Challenge practice and permanently marks the attempt assisted. */
export function undo(state: GameState): Transition { return undoCore(state); }

/** Advances the observable 7/6/9 tick removal and gravity stages, bounded to 3600 ticks. */
export function advanceTicks(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600) throw new RangeError('ticks must be an integer from 0 to 3600');
  if (state.elapsedTicks + ticks > MAX_RECORDED_TICKS) throw new RangeError('recording exceeds 10,000,000 logical ticks');
  let current = state; const events: GameEvent[] = [];
  for (let i = 0; i < ticks; i++) {
    if (current.phase === 'won' || current.phase === 'lost' || current.phase === 'finished') break;
    if (current.phase === 'ready') break;
    current = { ...current, elapsedTicks: current.elapsedTicks + 1 };
    const resolutionTick = current.resolutionTick + 1;
    if (current.phase === 'clear-mark' && resolutionTick >= MARK_TICKS) {
      const pending = new Set(current.pendingIds);
      const board = Object.freeze(current.board.map(stone => stone && pending.has(stone.id) ? null : stone));
      current = { ...current, board, removed: current.removed + current.pendingIds.length, phase: 'clear-remove', resolutionTick: 0 };
      events.push({ type: 'removal-started', ids: current.pendingIds, board: current.board });
    } else if (current.phase === 'clear-remove' && resolutionTick >= REMOVE_TICKS) {
      current = { ...current, phase: 'gravity', resolutionTick: 0 };
      events.push({ type: 'gravity-started', board: current.board, settledBoard: current.gravityBoard });
    } else if (current.phase === 'gravity' && resolutionTick >= GRAVITY_TICKS) {
      current = { ...current, board: current.gravityBoard ?? current.board, gravityBoard: null, phase: 'ready', resolutionTick: 0, pendingIds: Object.freeze([]) };
      events.push({ type: 'gravity-completed', board: current.board });
      const ended = terminal(current); current = ended[0]; events.push(...ended[1]);
    } else current = { ...current, resolutionTick };
  }
  const advanced = current.elapsedTicks - state.elapsedTicks;
  if (advanced > 0) {
    if (current.recording.length >= MAX_RECORDED_ACTIONS) return emptyTransition(state, 'recording-action-limit');
    const recording = [...current.recording]; const last = recording.at(-1);
    if (last?.kind === 'ticks') recording[recording.length - 1] = { kind: 'ticks', count: last.count + advanced };
    else recording.push({ kind: 'ticks', count: advanced });
    current = { ...current, recording: Object.freeze(recording) };
  }
  return { state: current, events: Object.freeze(events), accepted: true };
}

/** Lists every selection and confirmation currently accepted by the rules. */
export function legalActions(state: GameState): readonly Action[] {
  if (state.phase === 'won' || state.phase === 'finished' || state.phase === 'lost') return canUndo(state) ? [{ kind: 'undo' }] : [];
  if (state.phase !== 'ready') return [];
  const recordingRoom = state.recording.length < MAX_RECORDED_ACTIONS;
  const actions: Action[] = [];
  for (let index = 0; index < state.board.length; index++) {
    const stone = state.board[index];
    if (!stone || groupAt(state.board, state.settings, index).length < 2) continue;
    if (!recordingRoom && state.selectedIds.includes(stone.id)) continue;
    actions.push({ kind: 'select', stoneId: stone.id });
  }
  if (state.selectedId !== null) { if (recordingRoom) actions.push({ kind: 'confirm' }); actions.push({ kind: 'cancel' }); }
  if (state.settings.tools) {
    if (state.recording.length <= MAX_RECORDED_ACTIONS - 3) for (const tool of ['bomb', 'pick'] as const) if (state.inventory[tool] > 0) actions.push({ kind: 'select-tool', tool });
    if (state.selectedTool) {
      if (state.recording.length <= MAX_RECORDED_ACTIONS - 2) for (let cell = 0; cell < state.board.length; cell++) if (state.board[cell] && state.settings.mask[cell]) actions.push({ kind: 'target-tool', cell });
      if (recordingRoom) actions.push({ kind: 'cancel-tool' });
      if (recordingRoom && state.toolTarget !== null && state.toolPreview.length) actions.push({ kind: 'confirm-tool' });
    }
  }
  if (recordingRoom && hintGroup(state)) actions.push({ kind: 'hint' });
  if (canUndo(state)) actions.push({ kind: 'undo' });
  return actions;
}

/** Returns the stable public game status and the remaining-stone count. */
export function statusOf(state: GameState): GameStatus {
  return { mode: state.settings.mode, phase: state.phase, score: state.score, moves: state.moves, removed: state.removed, remaining: state.board.filter(Boolean).length, previewScore: state.previewScore, usedFallback: state.usedFallback, assisted: state.assisted, inventory: state.inventory, toolProgress: state.toolProgress, toolAwardCursor: state.toolAwardCursor, selectedTool: state.selectedTool, toolTarget: state.toolTarget, toolPreview: state.toolPreview, ...(state.settings.goal ? { goal: state.settings.goal } : {}), ...(state.reason ? { reason: state.reason } : {}) };
}
