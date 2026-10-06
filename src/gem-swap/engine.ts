import { COLOURS, PRESETS, findMatches, listLegalSwaps, neighbors } from './board.js';
import { drawColour, nextInt, seedState } from './random.js';
import { isValidSpecialSwap, materializeSpecials, planWave } from './specials.js';
import { previewTool } from './tools.js';
import { consumePortal, contactCells, placementCells } from './black-hole.js';
import { hintTransition, reshuffleTransition, undoTransition } from './practice.js';
import type { Action, BoardPreset, BoardShape, ChallengeRules, CreateOptions, GameEvent, GameMode, GameState, GameStatus, Gem, GemColour, Goal, OrdinaryToolKind, ReplayOperation, Seal, Settings, ToolKind, Transition } from './types.js';

/** Typed error for invalid settings or a board that cannot be generated safely. */
export class GemSwapOptionsError extends RangeError {
  readonly code: string;
  constructor(code: string, message: string) { super(message); this.name = 'GemSwapOptionsError'; this.code = code; }
}

function shapeMask(shape: BoardShape): readonly [number, number, readonly boolean[]] {
  if (shape === 'heart') {
    const width = 10; const rows: readonly (readonly (readonly [number, number])[])[] = [
      [[1, 3], [6, 8]], [[0, 4], [5, 9]], [[0, 9]], [[0, 9]], [[1, 8]], [[2, 7]], [[3, 6]], [[4, 5]], [[4, 5]], [[4, 5]],
    ];
    return [width, rows.length, rows.flatMap(ranges => Array.from({ length: width }, (_, x) => ranges.some(([a, b]) => x >= a && x <= b)))];
  }
  if (shape === 'star') {
    const width = 12; const ranges: readonly (readonly [number, number])[] = [[5, 6], [5, 6], [4, 7], [4, 7], [0, 11], [0, 11], [2, 9], [2, 9], [3, 8], [3, 8], [4, 7], [4, 7]];
    return [width, ranges.length, ranges.flatMap(([a, b]) => Array.from({ length: width }, (_, x) => x >= a && x <= b))];
  }
  const width = 10; const ranges: readonly (readonly [number, number])[] = [[2, 7], [1, 8], [0, 9], [0, 9], [0, 9], [0, 9], [0, 9], [0, 9], [1, 8], [2, 7]];
  return [width, ranges.length, ranges.flatMap(([a, b]) => Array.from({ length: width }, (_, x) => x >= a && x <= b))];
}
function validMask(mask: readonly boolean[], width: number, height: number): boolean {
  if (!Array.isArray(mask) || mask.length !== width * height || mask.some(v => typeof v !== 'boolean')) return false;
  const active = mask.flatMap((on, i) => on ? [i] : []);
  if (active.length < 16 || active.length > 512 || active.some(i => neighbors(i, width, height, mask).length === 0)) return false;
  const visited = new Set([active[0]!]); const queue = [active[0]!];
  while (queue.length) for (const next of neighbors(queue.pop()!, width, height, mask)) if (!visited.has(next)) { visited.add(next); queue.push(next); }
  return visited.size === active.length;
}
function validateDimensions(width: number, height: number): void {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 4 || width > 16 || height < 4 || height > 32 || width * height > 512) {
    throw new GemSwapOptionsError('invalid-board-size', 'Dimensions must be width 4–16, height 4–32, and at most 512 cells');
  }
}
function validateChallenge(value: unknown): ChallengeRules {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new GemSwapOptionsError('invalid-challenge', 'Challenge rules must be an object');
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some(key => !['goals', 'moveLimit', 'seals'].includes(key)) || !Array.isArray(input.goals) || input.goals.length < 1 || input.goals.length > 8) throw new GemSwapOptionsError('invalid-challenge', 'A challenge requires one to eight supported goals');
  if (input.moveLimit !== undefined && (!Number.isInteger(input.moveLimit) || (input.moveLimit as number) < 1 || (input.moveLimit as number) > 1000)) throw new GemSwapOptionsError('invalid-challenge', 'Challenge move limit must be from 1 to 1000');
  const goals: Goal[] = input.goals.map((raw: unknown) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new GemSwapOptionsError('invalid-challenge-goal', 'Challenge goals must be objects');
    const goal = raw as Record<string, unknown>;
    if (goal.kind === 'score' && Object.keys(goal).every(key => ['kind', 'target'].includes(key)) && Number.isSafeInteger(goal.target) && (goal.target as number) > 0) return Object.freeze({ kind: 'score', target: goal.target as number });
    if (goal.kind === 'collect' && Object.keys(goal).every(key => ['kind', 'colour', 'target'].includes(key)) && COLOURS.includes(goal.colour as GemColour) && Number.isSafeInteger(goal.target) && (goal.target as number) > 0) return Object.freeze({ kind: 'collect', colour: goal.colour as GemColour, target: goal.target as number });
    if (goal.kind === 'chain' && Object.keys(goal).every(key => ['kind', 'target'].includes(key)) && Number.isInteger(goal.target) && (goal.target as number) >= 2 && (goal.target as number) <= 100) return Object.freeze({ kind: 'chain', target: goal.target as number });
    if (goal.kind === 'seals' && Object.keys(goal).length === 1) return Object.freeze({ kind: 'seals' });
    throw new GemSwapOptionsError('invalid-challenge-goal', 'Challenge goal is malformed or unsupported');
  });
  let seals: readonly Seal[] | undefined;
  if (input.seals !== undefined) {
    if (!Array.isArray(input.seals) || input.seals.length > 512) throw new GemSwapOptionsError('invalid-challenge-seals', 'Challenge seals must be a bounded list');
    const seen = new Set<number>();
    seals = Object.freeze(input.seals.map((raw: unknown) => {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new GemSwapOptionsError('invalid-challenge-seal', 'Seal entries must be objects');
      const seal = raw as Record<string, unknown>;
      if (Object.keys(seal).some(key => !['cell', 'layers'].includes(key)) || !Number.isInteger(seal.cell) || (seal.cell as number) < 0 || !Number.isInteger(seal.layers) || (seal.layers as number) < 1 || (seal.layers as number) > 3 || seen.has(seal.cell as number)) throw new GemSwapOptionsError('invalid-challenge-seal', 'Seal cell or layers are invalid or duplicated');
      seen.add(seal.cell as number); return Object.freeze({ cell: seal.cell as number, layers: seal.layers as number });
    }));
  }
  if (goals.some(goal => goal.kind === 'seals') && !seals?.length) throw new GemSwapOptionsError('invalid-challenge-seals', 'A seal goal requires at least one seal');
  return Object.freeze({ goals: Object.freeze(goals), ...(input.moveLimit === undefined ? {} : { moveLimit: input.moveLimit as number }), ...(seals ? { seals } : {}) });
}
function optionsFor(options: CreateOptions): { readonly settings: Settings; readonly mode: GameMode; readonly dailyDate: string | null; readonly challenge: ChallengeRules | null; readonly initialOptions: CreateOptions } {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new GemSwapOptionsError('invalid-options', 'Options must be an object');
  const allowed = ['preset', 'width', 'height', 'colourCount', 'seed', 'shape', 'mask', 'tools', 'advancedTools', 'mode', 'dailyDate', 'challenge'];
  if (Object.keys(options).some(key => !allowed.includes(key))) throw new GemSwapOptionsError('unknown-option', 'Options contain an unsupported field');
  const mode = options.mode ?? 'relaxed';
  if (!['relaxed', 'arcade', 'daily', 'challenge'].includes(mode)) throw new GemSwapOptionsError('invalid-mode', 'Unknown game mode');
  const dailyDate = options.dailyDate ?? null;
  if (mode === 'daily') {
    const parsedDate = typeof dailyDate === 'string' ? Date.parse(`${dailyDate}T00:00:00.000Z`) : Number.NaN;
    if (typeof dailyDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dailyDate) || !Number.isFinite(parsedDate) || new Date(parsedDate).toISOString().slice(0, 10) !== dailyDate) throw new GemSwapOptionsError('invalid-daily-date', 'Daily mode requires a valid UTC date in YYYY-MM-DD form');
    if (options.preset !== undefined || options.width !== undefined || options.height !== undefined || options.colourCount !== undefined || options.seed !== undefined || options.tools !== undefined || options.advancedTools !== undefined || options.shape !== undefined || options.mask !== undefined || options.challenge !== undefined) throw new GemSwapOptionsError('daily-settings-fixed', 'Daily uses canonical board settings and a date-derived seed');
  } else if (dailyDate !== null) throw new GemSwapOptionsError('unexpected-daily-date', 'A UTC date is only valid in Daily mode');
  const challenge = mode === 'challenge' ? validateChallenge(options.challenge) : null;
  if (mode !== 'challenge' && options.challenge !== undefined) throw new GemSwapOptionsError('unexpected-challenge', 'Challenge rules require Challenge mode');
  if (options.tools !== undefined && typeof options.tools !== 'boolean') throw new GemSwapOptionsError('invalid-tools-option', 'Tools must be enabled or disabled with a boolean');
  if (options.advancedTools !== undefined && typeof options.advancedTools !== 'boolean') throw new GemSwapOptionsError('invalid-advanced-tools-option', 'Advanced tools must be enabled or disabled with a boolean');
  if (options.advancedTools && !options.tools) throw new GemSwapOptionsError('advanced-tools-require-tools', 'Advanced tools require the stored-tool tray');
  const dimensions = options.width !== undefined || options.height !== undefined;
  let width: number; let height: number; let mask: readonly boolean[] | undefined; let shape: BoardShape | undefined;
  if (options.shape !== undefined) {
    if (!['heart', 'star', 'hexagon'].includes(options.shape) || options.preset !== undefined || dimensions || options.mask !== undefined) throw new GemSwapOptionsError('conflicting-board-options', 'Choose one mask shape or one rectangular board');
    shape = options.shape; [width, height, mask] = shapeMask(shape);
  } else if (options.mask !== undefined) {
    if (options.preset !== undefined || options.width === undefined || options.height === undefined) throw new GemSwapOptionsError('custom-mask-dimensions-required', 'A custom mask requires explicit dimensions and cannot use a preset');
    width = options.width; height = options.height; mask = options.mask;
  } else {
    const presetName = options.preset ?? 'standard';
    if (!Object.hasOwn(PRESETS, presetName)) throw new GemSwapOptionsError('invalid-preset', 'Unknown board preset');
    if (dimensions && options.preset !== undefined) throw new GemSwapOptionsError('conflicting-board-options', 'Choose a preset or custom dimensions');
    const preset = PRESETS[presetName as BoardPreset]; width = options.width ?? preset[0]; height = options.height ?? preset[1];
  }
  validateDimensions(width!, height!);
  if (mask === undefined) mask = Array(width! * height!).fill(true);
  if (!validMask(mask, width!, height!)) throw new GemSwapOptionsError('invalid-mask', 'The active mask must be connected, contain 16–512 cells and have no isolated cell');
  if (challenge?.seals?.some(seal => seal.cell >= mask!.length || !mask![seal.cell])) throw new GemSwapOptionsError('invalid-challenge-seal', 'Every seal must occupy an active board cell');
  const colourCount = options.colourCount ?? 5;
  if (colourCount !== 4 && colourCount !== 5 && colourCount !== 6) throw new GemSwapOptionsError('invalid-colour-count', 'Colour count must be 4, 5, or 6');
  if (mode === 'daily' && (options.tools || options.advancedTools)) throw new GemSwapOptionsError('daily-tools-disabled', 'Daily mode does not use stored tools');
  const seed = mode === 'daily' ? `gem-swap:daily-1:${dailyDate}` : options.seed ?? 'houseki-gem-swap';
  if (typeof seed === 'string' ? seed.length > 256 : (!Number.isInteger(seed) || seed < 0 || seed > 0xffff_ffff)) throw new GemSwapOptionsError('invalid-seed', 'Seed must be a string of at most 256 characters or an unsigned 32-bit integer');
  const settings = Object.freeze({ width: width!, height: height!, colourCount, seed, tools: options.tools ?? false, advancedTools: options.advancedTools ?? false, ...(shape ? { shape } : {}), mask: Object.freeze([...mask]) });
  const initialOptions: CreateOptions = Object.freeze(mode === 'daily' ? { mode, dailyDate: dailyDate! } : {
    ...(mode === 'relaxed' ? {} : { mode }),
    ...(options.preset !== undefined ? { preset: options.preset } : shape ? { shape } : { width: width!, height: height!, mask: Object.freeze([...mask]) }),
    colourCount, seed, tools: options.tools ?? false, advancedTools: options.advancedTools ?? false,
    ...(challenge ? { challenge } : {}),
  });
  return Object.freeze({ settings, mode, dailyDate, challenge, initialOptions });
}

function gem(id: number, colour: GemColour): Gem { return Object.freeze({ id, colour }); }
/** @internal Test seam for checking the built-in standard-board fallback witness. */
export function fallbackBoardForTest(settings: Settings): readonly (Gem | null)[] {
  if (settings.shape || settings.mask.some(on => !on) || settings.width !== 8 || settings.height !== 8 || settings.colourCount !== 5) throw new GemSwapOptionsError('unsupported-board-generation', 'No validated stable fallback exists for these settings');
  const board: (Gem | null)[] = [];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) board.push(gem(y * 8 + x + 1, COLOURS[(x + 2 * y) % 5]!));
  board[3 * 8 + 3] = gem(28, COLOURS[0]!);
  board[4 * 8 + 3] = gem(36, COLOURS[1]!);
  board[4 * 8 + 4] = gem(37, COLOURS[0]!);
  board[5 * 8 + 3] = gem(44, COLOURS[0]!);
  board[6 * 8 + 3] = gem(52, COLOURS[2]!);
  // Swapping (3,4) blue with (3,3) red completes the red row at y=4, x=2..4.
  return Object.freeze(board);
}

/** Creates a deterministic stable board with at least one legal normal swap. */
export function createGame(options: CreateOptions = {}): GameState {
  const config = optionsFor(options); const { settings } = config; let randomState = seedState(settings.seed); let board: (Gem | null)[] = []; let nextId = 1; let found = false;
  for (let attempt = 0; attempt < 128 && !found; attempt++) {
    const candidate: (Gem | null)[] = []; let id = 1; let viable = true;
    for (let index = 0; index < settings.mask.length; index++) {
      if (!settings.mask[index]) { candidate.push(null); continue; }
      const x = index % settings.width; const y = Math.floor(index / settings.width); const allowed: number[] = [];
      for (let colour = 0; colour < settings.colourCount; colour++) {
        const sameLeft = x >= 2 && settings.mask[index - 1] && settings.mask[index - 2] && candidate[index - 1]?.colour === COLOURS[colour] && candidate[index - 2]?.colour === COLOURS[colour];
        const sameAbove = y >= 2 && settings.mask[index - settings.width] && settings.mask[index - 2 * settings.width] && candidate[index - settings.width]?.colour === COLOURS[colour] && candidate[index - 2 * settings.width]?.colour === COLOURS[colour];
        if (!sameLeft && !sameAbove) allowed.push(colour);
      }
      if (!allowed.length) { viable = false; break; }
      const [pick, next] = nextInt(randomState, allowed.length); randomState = next;
      candidate.push(gem(id++, COLOURS[allowed[pick]!]!));
    }
    if (viable) {
      board = candidate; nextId = id;
      const trial: GameState = { ...initialState(settings, board, randomState, id, false, config), usedFallback: false };
      found = !findMatches(board, settings).length && listLegalSwaps(trial).length > 0;
    }
  }
  let usedFallback = false;
  if (!found) {
    board = [...fallbackBoardForTest(settings)]; nextId = board.filter(Boolean).length + 1; usedFallback = true;
    const fallbackState: GameState = { ...initialState(settings, board, randomState, nextId, true, config), usedFallback: true };
    if (findMatches(board, settings).length || listLegalSwaps(fallbackState).length === 0) throw new GemSwapOptionsError('invalid-fallback', 'The validated standard fallback failed its stability or legal-move check');
  }
  return Object.freeze({ ...initialState(settings, Object.freeze(board), randomState, nextId, usedFallback, config) });
}

function initialState(settings: Settings, board: readonly (Gem | null)[], randomState: number, nextId: number, usedFallback: boolean, config: ReturnType<typeof optionsFor>): GameState {
  const start = settings.tools ? 1 : 0;
  return { game: 'gem-swap', rules: 'swap-1', settings, initialOptions: config.initialOptions, mode: config.mode, dailyDate: config.dailyDate, challenge: config.challenge, seals: config.challenge?.seals ?? Object.freeze([]), sealsCleared: 0, elapsedMs: 0, outcome: null, clearedByColour: Object.freeze({ red: 0, blue: 0, green: 0, gold: 0, purple: 0, teal: 0 }), bestChain: 0, history: Object.freeze([]), board, phase: 'ready', score: 0, moves: 0, swapCount: 0, randomState, nextId, usedFallback, wave: 0, resolutionTick: 0, pendingCells: Object.freeze([]), pendingSpecials: Object.freeze([]), gravityBoard: null,
    inventory: Object.freeze({ bomb: start, 'row-clear': start, 'colour-clear': start }), selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]), toolProgress: 0, toolAwardCursor: 0, assisted: false, toolWaveActive: false,
    blackHoleCharges: 0, blackHoleProgress: 0, blackHole: null, blackHoleMovePending: false, blackHoleContactPending: false, pendingBlackHole: false };
}

function rejected(state: GameState, reason: string): Transition { return { state, events: Object.freeze([]), accepted: false, reason }; }
function adjacent(state: GameState, from: number, to: number): boolean { return neighbors(from, state.settings.width, state.settings.height, state.settings.mask).includes(to); }

/** Accepts a legal orthogonal normal-gem swap, leaving invalid state identity unchanged. */
function applyActionBase(state: GameState, action: Action): Transition {
  if (!action || typeof action !== 'object') return rejected(state, 'invalid-action');
  if (action.kind === 'undo') return Object.keys(action).length === 1 ? undoTransition(state, replayOperations) : rejected(state, 'invalid-action');
  if (action.kind === 'hint') return Object.keys(action).length === 1 ? hintTransition(state) : rejected(state, 'invalid-action');
  if (action.kind === 'reshuffle') return Object.keys(action).length === 1 ? reshuffleTransition(state) : rejected(state, 'invalid-action');
  if (action.kind !== 'swap') return applyToolAction(state, action);
  if (!Number.isInteger(action.from) || !Number.isInteger(action.to) || Object.keys(action).some(key => !['kind', 'from', 'to'].includes(key))) return rejected(state, 'invalid-action');
  if (state.phase !== 'ready') return rejected(state, 'resolution-in-progress');
  if (findMatches(state.board, state.settings).length) return rejected(state, 'unstable-board');
  const { from, to } = action;
  if (from < 0 || to < 0 || from >= state.board.length || to >= state.board.length || from === to || !state.settings.mask[from] || !state.settings.mask[to] || !state.board[from] || !state.board[to] || !adjacent(state, from, to)) return rejected(state, 'not-adjacent-active-gems');
  const board = [...state.board]; [board[from], board[to]] = [board[to]!, board[from]!];
  const matched = findMatches(board, state.settings);
  if (!isValidSpecialSwap(board[from]!, board[to]!, matched.length > 0)) return rejected(state, board[from]!.colour === board[to]!.colour && !board[from]!.kind && !board[to]!.kind ? 'identical-gems' : 'swap-makes-no-match');
  const swapped = Object.freeze({ ...state, board: Object.freeze(board) });
  const plan = planWave(swapped, matched, from, to);
  const next = Object.freeze({ ...swapped, phase: 'clear-mark' as const, moves: state.moves + 1, swapCount: state.swapCount + 1, wave: 1, resolutionTick: 0, pendingCells: plan.cells, pendingSpecials: plan.specials, gravityBoard: null, selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]), toolWaveActive: false, blackHoleMovePending: state.blackHole !== null, blackHoleContactPending: state.blackHole !== null });
  return { state: next, events: Object.freeze([{ type: 'swap-accepted', from, to, ids: [state.board[from]!.id, state.board[to]!.id] }, ...(matched.length ? [{ type: 'match-marked', cells: matched, wave: 1 }] : []), ...plan.events]), accepted: true };
}

function appendHistory(state: GameState, operation: ReplayOperation): GameState {
  const previous = state.history.at(-1);
  if (operation.kind === 'ticks' && previous?.kind === 'ticks' && previous.count + operation.count <= 3600) return Object.freeze({ ...state, history: Object.freeze([...state.history.slice(0, -1), Object.freeze({ kind: 'ticks', count: previous.count + operation.count })]) });
  if (operation.kind === 'time' && previous?.kind === 'time') return Object.freeze({ ...state, history: Object.freeze([...state.history.slice(0, -1), Object.freeze({ kind: 'time', milliseconds: previous.milliseconds + operation.milliseconds })]) });
  return Object.freeze({ ...state, history: Object.freeze([...state.history, Object.freeze(operation)]) });
}
/** Applies one recorded player action. Rejected actions preserve state identity and are not recorded. */
export function applyAction(state: GameState, action: Action): Transition {
  const explicitPracticeReshuffle = action?.kind === 'reshuffle' && state.mode === 'relaxed' && state.outcome === 'finished';
  if ((state.outcome && !explicitPracticeReshuffle) || (state.mode === 'arcade' && state.elapsedMs >= 180_000)) return rejected(state, 'run-ended');
  const result = applyActionBase(state, action);
  return result.accepted ? { ...result, state: appendHistory(result.state, { kind: 'action', action: Object.freeze({ ...action }) }) } : result;
}

const TOOL_ORDER: readonly OrdinaryToolKind[] = ['bomb', 'row-clear', 'colour-clear'];
function validTool(tool: unknown): tool is ToolKind { return [...TOOL_ORDER, 'black-hole'].includes(tool as ToolKind); }
function onReady(state: GameState): boolean { return state.phase === 'ready' && findMatches(state.board, state.settings).length === 0; }
function applyToolAction(state: GameState, action: Exclude<Action, { readonly kind: 'swap' }>): Transition {
  if (!['select-tool', 'target-tool', 'confirm-tool', 'cancel-tool'].includes(action.kind)) return rejected(state, 'invalid-action');
  const fields: Record<string, readonly string[]> = { 'select-tool': ['kind', 'tool'], 'target-tool': ['kind', 'cell'], 'confirm-tool': ['kind'], 'cancel-tool': ['kind'] };
  if (Object.keys(action).some(key => !(fields[action.kind] ?? []).includes(key))) return rejected(state, 'invalid-action');
  if (!state.settings.tools) return rejected(state, 'tools-disabled');
  if (!onReady(state)) return rejected(state, state.phase === 'ready' ? 'unstable-board' : 'resolution-in-progress');
  if (action.kind === 'select-tool') {
    if (!validTool(action.tool)) return rejected(state, 'invalid-action');
    if (action.tool === 'black-hole') {
      if (!state.settings.advancedTools || state.blackHoleCharges < 1 || state.blackHole) return rejected(state, 'tool-unavailable');
    } else if (state.inventory[action.tool] < 1) return rejected(state, 'tool-unavailable');
    const next = Object.freeze({ ...state, selectedTool: action.tool, toolTarget: null, toolPreview: Object.freeze([]) });
    return { state: next, events: Object.freeze([{ type: 'tool-selected', tool: action.tool }]), accepted: true };
  }
  if (action.kind === 'target-tool') {
    if (!Number.isInteger(action.cell) || !state.selectedTool || action.cell < 0 || action.cell >= state.board.length || !state.settings.mask[action.cell] || !state.board[action.cell]) return rejected(state, 'invalid-tool-target');
    const preview = state.selectedTool === 'black-hole' ? placementCells(state, action.cell) : previewTool(state, state.selectedTool, action.cell);
    const next = Object.freeze({ ...state, toolTarget: action.cell, toolPreview: preview });
    return { state: next, events: Object.freeze([{ type: 'tool-targeted', tool: state.selectedTool, cell: action.cell, cells: preview, count: preview.length }]), accepted: true };
  }
  if (action.kind === 'cancel-tool') {
    if (!state.selectedTool) return rejected(state, 'no-tool-selected');
    const next = Object.freeze({ ...state, selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]) });
    return { state: next, events: Object.freeze([{ type: 'tool-cancelled' }]), accepted: true };
  }
  if (!state.selectedTool || state.toolTarget === null) return rejected(state, 'tool-not-ready');
  if (state.selectedTool === 'black-hole') {
    if (!state.settings.advancedTools || state.blackHoleCharges < 1 || state.blackHole) return rejected(state, 'tool-unavailable');
    const cells = placementCells(state, state.toolTarget);
    if (!cells.length) return rejected(state, 'invalid-tool-target');
    const ids = cells.flatMap(cell => state.board[cell] ? [state.board[cell]!.id] : []);
    const portal = Object.freeze({ cell: state.toolTarget, capacityRemaining: Math.max(0, 8 - ids.length), movesRemaining: 2, consumedIds: Object.freeze(ids) });
    const next = Object.freeze({ ...state, phase: 'clear-mark' as const, moves: state.moves + 1, wave: 1, resolutionTick: 0, pendingCells: cells, pendingSpecials: Object.freeze([]), gravityBoard: null, selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]), assisted: true, toolWaveActive: true, pendingBlackHole: true, blackHole: portal, blackHoleCharges: 0 as const, blackHoleMovePending: false, blackHoleContactPending: false });
    return { state: next, events: Object.freeze([{ type: 'black-hole-opened', cell: portal.cell, capacityRemaining: portal.capacityRemaining, movesRemaining: portal.movesRemaining }, { type: 'black-hole-consumed', cells, ids }]), accepted: true };
  }
  if (state.inventory[state.selectedTool] < 1) return rejected(state, 'tool-not-ready');
  const preview = previewTool(state, state.selectedTool, state.toolTarget);
  if (!preview.length) return rejected(state, 'invalid-tool-target');
  const plan = planWave(state, [], null, null, preview);
  const inventory = Object.freeze({ ...state.inventory, [state.selectedTool]: state.inventory[state.selectedTool] - 1 });
  const next = Object.freeze({ ...state, phase: 'clear-mark' as const, moves: state.moves + 1, wave: 1, resolutionTick: 0, pendingCells: plan.cells, pendingSpecials: Object.freeze([]), gravityBoard: null, inventory, selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]), assisted: true, toolWaveActive: true, blackHoleMovePending: state.blackHoleMovePending || state.blackHole !== null, blackHoleContactPending: state.blackHoleContactPending || state.blackHole !== null });
  return { state: next, events: Object.freeze([{ type: 'tool-used', tool: state.selectedTool, target: state.toolTarget, cells: plan.cells, count: plan.cells.length }, ...plan.events]), accepted: true };
}

function gravityBoard(state: GameState): readonly (Gem | null)[] {
  const { width, height, mask } = state.settings; const result = [...state.board];
  const blocked = (index: number) => !mask[index] || state.blackHole?.cell === index;
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && blocked(y * width + x)) y++;
      if (y >= height) break;
      const start = y; while (y < height && !blocked(y * width + x)) y++; const end = y; const survivors: Gem[] = [];
      for (let row = start; row < end; row++) { const item = state.board[row * width + x]; if (item) survivors.push(item); }
      for (let row = start; row < end; row++) result[row * width + x] = null;
      for (let offset = 0; offset < survivors.length; offset++) result[(end - survivors.length + offset) * width + x] = survivors[offset]!;
    }
  }
  return Object.freeze(result);
}
function refill(state: GameState): readonly [readonly (Gem | null)[], number, number, readonly GameEvent[]] {
  const { width, height, mask, colourCount } = state.settings; const board = [...state.board]; let randomState = state.randomState; let nextId = state.nextId; const draws: GameEvent[] = [];
  const blocked = (index: number) => !mask[index] || state.blackHole?.cell === index;
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && blocked(y * width + x)) y++;
      if (y >= height) break;
      const start = y; while (y < height && !blocked(y * width + x)) y++; const end = y;
      for (let row = end - 1; row >= start; row--) {
        const index = row * width + x; if (board[index]) continue;
        const [colour, next] = drawColour(randomState, colourCount); randomState = next; board[index] = gem(nextId++, colour);
        draws.push({ type: 'gem-refilled', id: nextId - 1, colour, cell: index });
      }
    }
  }
  return [Object.freeze(board), randomState, nextId, Object.freeze(draws)];
}
function awardTools(state: GameState, removed: number): { readonly inventory: GameState['inventory']; readonly progress: number; readonly cursor: number; readonly events: readonly GameEvent[] } {
  if (!state.settings.tools || state.toolWaveActive) return { inventory: state.inventory, progress: state.toolProgress, cursor: state.toolAwardCursor, events: Object.freeze([]) };
  let progress = state.toolProgress + removed; let cursor = state.toolAwardCursor; const inventory = { ...state.inventory }; const events: GameEvent[] = [];
  while (progress >= 12) {
    progress -= 12; const tool = TOOL_ORDER[cursor]!; const before = inventory[tool];
    if (before < 3) inventory[tool] = before + 1;
    events.push({ type: 'tool-awarded', tool, inventory: inventory[tool], discarded: before >= 3 });
    cursor = (cursor + 1) % TOOL_ORDER.length;
  }
  return { inventory: Object.freeze(inventory), progress, cursor, events: Object.freeze(events) };
}
function awardBlackHole(state: GameState, removed: number): { readonly charges: 0 | 1; readonly progress: number; readonly events: readonly GameEvent[] } {
  if (!state.settings.advancedTools || state.toolWaveActive) return { charges: state.blackHoleCharges, progress: state.blackHoleProgress, events: Object.freeze([]) };
  let progress = state.blackHoleProgress + removed; let charges: 0 | 1 = state.blackHoleCharges; const events: GameEvent[] = [];
  while (progress >= 48) {
    progress -= 48; const discarded = charges >= 1; if (!discarded) charges = 1;
    events.push({ type: 'black-hole-awarded', charges, discarded });
  }
  return { charges, progress, events: Object.freeze(events) };
}

function scheduleContact(state: GameState, board: readonly (Gem | null)[]): { readonly state: GameState; readonly events: readonly GameEvent[] } | null {
  if (!state.blackHole) return null;
  const onBoard = Object.freeze({ ...state, board }); const cells = contactCells(onBoard, state.blackHole);
  if (!cells.length) return null;
  const ids = cells.flatMap(cell => board[cell] ? [board[cell]!.id] : []);
  const portal = consumePortal(onBoard, cells);
  const next = Object.freeze({ ...onBoard, phase: 'clear-mark' as const, resolutionTick: 0, pendingCells: cells, pendingSpecials: Object.freeze([]), gravityBoard: null, pendingBlackHole: true, toolWaveActive: true, blackHole: portal, blackHoleMovePending: portal ? state.blackHoleMovePending : false, blackHoleContactPending: false });
  const closed = portal ? [] : [{ type: 'black-hole-closed', reason: 'capacity' } satisfies GameEvent];
  return { state: next, events: Object.freeze([{ type: 'black-hole-consumed', cells, ids }, ...closed]) };
}
function goalValue(state: GameState, goal: Goal): number {
  if (goal.kind === 'score') return state.score;
  if (goal.kind === 'collect') return state.clearedByColour[goal.colour];
  if (goal.kind === 'seals') return state.sealsCleared;
  return state.bestChain;
}
function goalTarget(state: GameState, goal: Goal): number { return goal.kind === 'seals' ? (state.challenge?.seals ?? []).reduce((sum, seal) => sum + seal.layers, 0) : goal.target; }

/** Advances marked-clear, removal, gravity and refill phases in bounded deterministic ticks. */
function advanceTicksBase(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600) throw new RangeError('ticks must be an integer from 0 to 3600');
  let current = state; const events: GameEvent[] = [];
  for (let tick = 0; tick < ticks; tick++) {
    if (current.phase === 'ready' || current.phase === 'finished') break;
    if (current.phase === 'clear-mark') {
      const elapsed = current.resolutionTick + 1;
      if (elapsed < 7) { current = Object.freeze({ ...current, resolutionTick: elapsed }); continue; }
      const removed = new Set(current.pendingCells); const holes = current.board.map((item, index) => removed.has(index) ? null : item);
      const removedCount = current.pendingCells.filter(index => current.board[index]).length;
      const clearedByColour = { ...current.clearedByColour };
      for (const cell of current.pendingCells) { const removedGem = current.board[cell]; if (removedGem) clearedByColour[removedGem.colour]++; }
      const clearedCells = new Set(current.pendingCells);
      let sealsCleared = current.sealsCleared;
      const seals = current.seals.flatMap(seal => {
        if (!clearedCells.has(seal.cell)) return [seal];
        sealsCleared++;
        return seal.layers > 1 ? [Object.freeze({ ...seal, layers: seal.layers - 1 })] : [];
      });
      const blackHoleRemoval = current.pendingBlackHole; const points = removedCount * 10 * (blackHoleRemoval ? 1 : current.wave);
      const earning = awardTools(current, removedCount); const rareEarning = awardBlackHole(current, removedCount);
      const createdEvents = current.pendingSpecials.map(planned => ({ type: 'special-created', cell: planned.cell, kind: planned.kind, id: current.board[planned.cell]!.id }));
      const board = materializeSpecials(Object.freeze(holes), current.pendingSpecials);
      current = Object.freeze({ ...current, board, phase: 'clear-remove', resolutionTick: 0, score: current.score + points, clearedByColour: Object.freeze(clearedByColour), seals: Object.freeze(seals), sealsCleared, pendingSpecials: Object.freeze([]), pendingBlackHole: false, inventory: earning.inventory, toolProgress: earning.progress, toolAwardCursor: earning.cursor, blackHoleCharges: rareEarning.charges, blackHoleProgress: rareEarning.progress });
      events.push({ type: 'cells-removed', cells: current.pendingCells, wave: current.wave, points, board, source: blackHoleRemoval ? 'black-hole' : 'match' }, ...createdEvents, ...earning.events, ...rareEarning.events);
      continue;
    }
    if (current.phase === 'clear-remove') {
      const elapsed = current.resolutionTick + 1;
      if (elapsed < 6) { current = Object.freeze({ ...current, resolutionTick: elapsed }); continue; }
      current = Object.freeze({ ...current, phase: 'gravity', resolutionTick: 0, gravityBoard: gravityBoard(current) });
      events.push({ type: 'gravity-started', board: current.board, settledBoard: current.gravityBoard }); continue;
    }
    if (current.phase === 'gravity') {
      const elapsed = current.resolutionTick + 1;
      if (elapsed < 9) { current = Object.freeze({ ...current, resolutionTick: elapsed }); continue; }
      const board = current.gravityBoard!;
      current = Object.freeze({ ...current, phase: 'refill', resolutionTick: 0, board, gravityBoard: null });
      events.push({ type: 'gravity-completed', board });
      continue;
    }
    const [board, randomState, nextId, refillEvents] = refill(current);
    const matches = findMatches(board, current.settings);
    if (matches.length) {
      const nextWave = current.wave + 1; const plan = planWave({ ...current, board }, matches, null, null);
      current = Object.freeze({ ...current, board, randomState, nextId, phase: 'clear-mark', wave: nextWave, resolutionTick: 0, pendingCells: plan.cells, pendingSpecials: plan.specials });
      events.push(...refillEvents, { type: 'match-marked', cells: matches, wave: current.wave }, ...plan.events);
    } else {
      let stable: GameState = Object.freeze({ ...current, board, randomState, nextId, phase: 'ready' as const, bestChain: Math.max(current.bestChain, current.wave), wave: 0, resolutionTick: 0, pendingCells: Object.freeze([]), pendingSpecials: Object.freeze([]), toolWaveActive: false });
      if (stable.blackHole && stable.blackHoleContactPending) {
        const contact = scheduleContact(stable, stable.board);
        if (contact) {
          current = contact.state;
          events.push(...refillEvents, ...contact.events); continue;
        }
        stable = Object.freeze({ ...stable, blackHoleContactPending: false });
      }
      if (stable.blackHole && stable.blackHoleMovePending) {
        if (stable.blackHole.movesRemaining <= 1) {
          stable = Object.freeze({ ...stable, blackHole: null, blackHoleMovePending: false, blackHoleContactPending: false, toolWaveActive: true, phase: 'gravity', gravityBoard: null });
          const settledBoard = gravityBoard(stable); stable = Object.freeze({ ...stable, gravityBoard: settledBoard });
          current = stable;
          events.push(...refillEvents, { type: 'black-hole-closed', reason: 'duration' }, { type: 'gravity-started', board: stable.board, settledBoard });
          continue;
        }
        stable = Object.freeze({ ...stable, blackHole: Object.freeze({ ...stable.blackHole, movesRemaining: stable.blackHole.movesRemaining - 1 }), blackHoleMovePending: false });
      }
      const legal = listLegalSwaps(stable);
      const goalWon = stable.mode === 'challenge' && (stable.challenge?.goals.every(goal => goalValue(stable, goal) >= goalTarget(stable, goal)) ?? false);
      const timedOut = stable.mode === 'arcade' && stable.elapsedMs >= 180_000;
      const moveExpired = (stable.mode === 'daily' && stable.swapCount >= 30) || (stable.mode === 'challenge' && stable.challenge?.moveLimit !== undefined && stable.swapCount >= stable.challenge.moveLimit);
      const noActions = legal.length === 0 && !hasUsableTool(stable);
      if (goalWon) current = Object.freeze({ ...stable, phase: 'finished' as const, outcome: 'won' as const });
      else if (timedOut || moveExpired || noActions) current = Object.freeze({ ...stable, phase: 'finished' as const, outcome: stable.mode === 'challenge' && (moveExpired || noActions) ? 'lost' as const : 'finished' as const });
      else current = stable;
      if (current.phase === 'finished') events.push({ type: 'run-ended', result: current.outcome, reason: goalWon ? 'goals-complete' : timedOut ? 'time-limit' : moveExpired ? 'move-limit' : 'no-legal-actions' });
      events.push(...refillEvents);
    }
  }
  return { state: current, events: Object.freeze(events), accepted: true };
}

/** Advances deterministic resolution ticks; wall-clock time is supplied separately by the host. */
export function advanceTicks(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600) throw new RangeError('ticks must be an integer from 0 to 3600');
  let current = state; let consumed = 0; const events: GameEvent[] = [];
  while (consumed < ticks && current.phase !== 'ready' && current.phase !== 'finished') {
    const result = advanceTicksBase(current, 1); current = result.state; events.push(...result.events); consumed++;
  }
  if (consumed) current = appendHistory(current, { kind: 'ticks', count: consumed });
  return { state: current, events: Object.freeze(events), accepted: true };
}

/** Adds explicit host-measured elapsed time. Arcade runs end at 180 seconds; no clock is read here. */
export function advanceTime(state: GameState, milliseconds: number): Transition {
  if (!Number.isInteger(milliseconds) || milliseconds < 0 || milliseconds > 180_000) throw new RangeError('milliseconds must be an integer from 0 to 180000');
  if (state.mode !== 'arcade' || state.outcome || milliseconds === 0) return { state, events: Object.freeze([]), accepted: true };
  const elapsedMs = Math.min(180_000, state.elapsedMs + milliseconds);
  let next: GameState = Object.freeze({ ...state, elapsedMs });
  const events: GameEvent[] = [{ type: 'time-advanced', elapsedMs }];
  if (elapsedMs >= 180_000 && state.phase === 'ready') {
    next = Object.freeze({ ...next, phase: 'finished', outcome: 'finished' });
    events.push({ type: 'run-ended', result: 'finished', reason: 'time-limit' });
  }
  next = appendHistory(next, { kind: 'time', milliseconds: elapsedMs - state.elapsedMs });
  return { state: next, events: Object.freeze(events), accepted: true };
}

function replayOperations(initial: CreateOptions, operations: readonly ReplayOperation[]): GameState {
  let state = createGame(initial);
  for (const operation of operations) {
    if (operation.kind === 'action') {
      const result = applyAction(state, operation.action); if (!result.accepted) throw new Error('Recorded action cannot be replayed'); state = result.state;
    } else if (operation.kind === 'ticks') state = advanceTicks(state, operation.count).state;
    else if (operation.kind === 'time') state = advanceTime(state, operation.milliseconds).state;
  }
  return state;
}
/** Returns a deterministic legal swap hint and permanently marks the run assisted. */
export function hintGame(state: GameState): Transition { return applyAction(state, { kind: 'hint' }); }
/** Shuffles existing gem records in Relaxed play, preserving their colour and special counts. */
export function reshuffleGame(state: GameState): Transition { return applyAction(state, { kind: 'reshuffle' }); }
/** Restores the last committed swap in Relaxed or Challenge play and marks assistance. */
export function undoGame(state: GameState): Transition { return applyAction(state, { kind: 'undo' }); }

/** Lists all legal swaps that would be accepted from the current stable state. */
export function legalActions(state: GameState): readonly Action[] {
  if (state.phase === 'finished') return state.mode === 'relaxed' && state.outcome === 'finished' ? Object.freeze([{ kind: 'reshuffle' }]) : Object.freeze([]);
  if (state.phase !== 'ready' || findMatches(state.board, state.settings).length) return [];
  const actions: Action[] = [];
  for (let from = 0; from < state.board.length; from++) {
    if (!state.board[from]) continue;
    for (const to of neighbors(from, state.settings.width, state.settings.height, state.settings.mask)) {
      if (to <= from || !state.board[to]) continue;
      const trial = [...state.board]; [trial[from], trial[to]] = [trial[to]!, trial[from]!];
      const matches = findMatches(trial, state.settings);
      if (isValidSpecialSwap(trial[from]!, trial[to]!, matches.length > 0)) actions.push({ kind: 'swap', from, to });
    }
  }
  if (state.settings.tools) {
    for (const tool of TOOL_ORDER) if (state.inventory[tool] > 0) actions.push({ kind: 'select-tool', tool });
    if (state.settings.advancedTools && state.blackHoleCharges > 0 && !state.blackHole) actions.push({ kind: 'select-tool', tool: 'black-hole' });
    if (state.selectedTool) {
      for (let cell = 0; cell < state.board.length; cell++) if (state.settings.mask[cell] && state.board[cell]) actions.push({ kind: 'target-tool', cell });
      if (state.toolTarget !== null) actions.push({ kind: 'confirm-tool' });
      actions.push({ kind: 'cancel-tool' });
    }
  }
  if (listLegalSwaps(state).length && !state.selectedTool) actions.push({ kind: 'hint' });
  if (state.mode === 'relaxed' && !state.selectedTool) actions.push({ kind: 'reshuffle' });
  if (['relaxed', 'challenge'].includes(state.mode) && !state.selectedTool && state.history.some(operation => operation.kind === 'action' && operation.action.kind === 'swap')) actions.push({ kind: 'undo' });
  return Object.freeze(actions);
}
/** Returns the current score, move count and accurately enumerated legal move count. */
function availableToolCount(state: GameState): number { return TOOL_ORDER.reduce<number>((count, tool) => count + state.inventory[tool], state.blackHoleCharges); }
function hasUsableTool(state: GameState): boolean { return TOOL_ORDER.some(tool => state.inventory[tool] > 0) || (state.settings.advancedTools && state.blackHoleCharges > 0 && state.blackHole === null); }
export function statusOf(state: GameState): GameStatus {
  const goals = state.challenge?.goals ?? Object.freeze([]);
  const goalProgress = goals.map(goal => ({ kind: goal.kind, ...(goal.kind === 'collect' ? { colour: goal.colour } : {}), current: goalValue(state, goal), target: goalTarget(state, goal), complete: goalValue(state, goal) >= goalTarget(state, goal) }));
  const remainingMoves = state.mode === 'daily' ? Math.max(0, 30 - state.swapCount) : state.mode === 'challenge' && state.challenge?.moveLimit !== undefined ? Math.max(0, state.challenge.moveLimit - state.swapCount) : null;
  return { phase: state.phase, score: state.score, moves: state.moves, legalMoveCount: legalActions(state).filter(action => action.kind === 'swap').length, usedFallback: state.usedFallback, availableToolCount: availableToolCount(state), inventory: state.inventory, toolProgress: state.toolProgress, toolAwardCursor: state.toolAwardCursor, assisted: state.assisted, blackHoleCharges: state.blackHoleCharges, blackHoleProgress: state.blackHoleProgress, blackHole: state.blackHole, mode: state.mode, outcome: state.outcome, remainingMoves, elapsedMs: state.elapsedMs, remainingMs: state.mode === 'arcade' ? Math.max(0, 180_000 - state.elapsedMs) : null, goals: Object.freeze([...goals]), goalProgress: Object.freeze(goalProgress), bestChain: state.bestChain };
}
