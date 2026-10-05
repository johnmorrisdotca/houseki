import { COLOURS, PRESETS, findMatches, listLegalSwaps, neighbors } from './board.js';
import { drawColour, nextInt, seedState } from './random.js';
import { isValidSpecialSwap, materializeSpecials, planWave } from './specials.js';
import { previewTool } from './tools.js';
import type { Action, BoardPreset, BoardShape, CreateOptions, GameEvent, GameState, GameStatus, Gem, GemColour, Settings, ToolKind, Transition } from './types.js';

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
  if (active.length < 16 || active.length > 144 || active.some(i => neighbors(i, width, height, mask).length === 0)) return false;
  const visited = new Set([active[0]!]); const queue = [active[0]!];
  while (queue.length) for (const next of neighbors(queue.pop()!, width, height, mask)) if (!visited.has(next)) { visited.add(next); queue.push(next); }
  return visited.size === active.length;
}
function validateDimensions(width: number, height: number): void {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 4 || width > 12 || height < 4 || height > 12 || width * height > 144) {
    throw new GemSwapOptionsError('invalid-board-size', 'Dimensions must each be 4–12 with at most 144 cells');
  }
}
function optionsFor(options: CreateOptions): Settings {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new GemSwapOptionsError('invalid-options', 'Options must be an object');
  const allowed = ['preset', 'width', 'height', 'colourCount', 'seed', 'shape', 'mask', 'tools'];
  if (Object.keys(options).some(key => !allowed.includes(key))) throw new GemSwapOptionsError('unknown-option', 'Options contain an unsupported field');
  if (options.tools !== undefined && typeof options.tools !== 'boolean') throw new GemSwapOptionsError('invalid-tools-option', 'Tools must be enabled or disabled with a boolean');
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
  if (!validMask(mask, width!, height!)) throw new GemSwapOptionsError('invalid-mask', 'The active mask must be connected, contain 16–144 cells and have no isolated cell');
  const colourCount = options.colourCount ?? 5;
  if (colourCount !== 4 && colourCount !== 5 && colourCount !== 6) throw new GemSwapOptionsError('invalid-colour-count', 'Colour count must be 4, 5, or 6');
  const seed = options.seed ?? 'houseki-gem-swap';
  if (typeof seed === 'string' ? seed.length > 256 : (!Number.isInteger(seed) || seed < 0 || seed > 0xffff_ffff)) throw new GemSwapOptionsError('invalid-seed', 'Seed must be a string of at most 256 characters or an unsigned 32-bit integer');
  return Object.freeze({ width: width!, height: height!, colourCount, seed, tools: options.tools ?? false, ...(shape ? { shape } : {}), mask: Object.freeze([...mask]) });
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
  const settings = optionsFor(options); let randomState = seedState(settings.seed); let board: (Gem | null)[] = []; let nextId = 1; let found = false;
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
      const trial: GameState = { ...initialState(settings, board, randomState, id, false), usedFallback: false };
      found = !findMatches(board, settings).length && listLegalSwaps(trial).length > 0;
    }
  }
  let usedFallback = false;
  if (!found) {
    board = [...fallbackBoardForTest(settings)]; nextId = board.filter(Boolean).length + 1; usedFallback = true;
    const fallbackState: GameState = { ...initialState(settings, board, randomState, nextId, true), usedFallback: true };
    if (findMatches(board, settings).length || listLegalSwaps(fallbackState).length === 0) throw new GemSwapOptionsError('invalid-fallback', 'The validated standard fallback failed its stability or legal-move check');
  }
  return Object.freeze({ ...initialState(settings, Object.freeze(board), randomState, nextId, usedFallback) });
}

function initialState(settings: Settings, board: readonly (Gem | null)[], randomState: number, nextId: number, usedFallback: boolean): GameState {
  const start = settings.tools ? 1 : 0;
  return { game: 'gem-swap', rules: 'swap-1', settings, board, phase: 'ready', score: 0, moves: 0, randomState, nextId, usedFallback, wave: 0, resolutionTick: 0, pendingCells: Object.freeze([]), pendingSpecials: Object.freeze([]), gravityBoard: null,
    inventory: Object.freeze({ bomb: start, 'row-clear': start, 'colour-clear': start }), selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]), toolProgress: 0, toolAwardCursor: 0, assisted: false, toolWaveActive: false };
}

function rejected(state: GameState, reason: string): Transition { return { state, events: Object.freeze([]), accepted: false, reason }; }
function adjacent(state: GameState, from: number, to: number): boolean { return neighbors(from, state.settings.width, state.settings.height, state.settings.mask).includes(to); }

/** Accepts a legal orthogonal normal-gem swap, leaving invalid state identity unchanged. */
export function applyAction(state: GameState, action: Action): Transition {
  if (!action || typeof action !== 'object') return rejected(state, 'invalid-action');
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
  const next = Object.freeze({ ...swapped, phase: 'clear-mark' as const, moves: state.moves + 1, wave: 1, resolutionTick: 0, pendingCells: plan.cells, pendingSpecials: plan.specials, gravityBoard: null, selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]), toolWaveActive: false });
  return { state: next, events: Object.freeze([{ type: 'swap-accepted', from, to, ids: [state.board[from]!.id, state.board[to]!.id] }, ...(matched.length ? [{ type: 'match-marked', cells: matched, wave: 1 }] : []), ...plan.events]), accepted: true };
}

const TOOL_ORDER: readonly ToolKind[] = ['bomb', 'row-clear', 'colour-clear'];
function validTool(tool: unknown): tool is ToolKind { return TOOL_ORDER.includes(tool as ToolKind); }
function onReady(state: GameState): boolean { return state.phase === 'ready' && findMatches(state.board, state.settings).length === 0; }
function applyToolAction(state: GameState, action: Exclude<Action, { readonly kind: 'swap' }>): Transition {
  if (!['select-tool', 'target-tool', 'confirm-tool', 'cancel-tool'].includes(action.kind)) return rejected(state, 'invalid-action');
  const fields: Record<string, readonly string[]> = { 'select-tool': ['kind', 'tool'], 'target-tool': ['kind', 'cell'], 'confirm-tool': ['kind'], 'cancel-tool': ['kind'] };
  if (Object.keys(action).some(key => !(fields[action.kind] ?? []).includes(key))) return rejected(state, 'invalid-action');
  if (!state.settings.tools) return rejected(state, 'tools-disabled');
  if (!onReady(state)) return rejected(state, state.phase === 'ready' ? 'unstable-board' : 'resolution-in-progress');
  if (action.kind === 'select-tool') {
    if (!validTool(action.tool)) return rejected(state, 'invalid-action');
    if (state.inventory[action.tool] < 1) return rejected(state, 'tool-unavailable');
    const next = Object.freeze({ ...state, selectedTool: action.tool, toolTarget: null, toolPreview: Object.freeze([]) });
    return { state: next, events: Object.freeze([{ type: 'tool-selected', tool: action.tool }]), accepted: true };
  }
  if (action.kind === 'target-tool') {
    if (!Number.isInteger(action.cell) || !state.selectedTool || action.cell < 0 || action.cell >= state.board.length || !state.settings.mask[action.cell] || !state.board[action.cell]) return rejected(state, 'invalid-tool-target');
    const preview = previewTool(state, state.selectedTool, action.cell);
    const next = Object.freeze({ ...state, toolTarget: action.cell, toolPreview: preview });
    return { state: next, events: Object.freeze([{ type: 'tool-targeted', tool: state.selectedTool, cell: action.cell, cells: preview, count: preview.length }]), accepted: true };
  }
  if (action.kind === 'cancel-tool') {
    if (!state.selectedTool) return rejected(state, 'no-tool-selected');
    const next = Object.freeze({ ...state, selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]) });
    return { state: next, events: Object.freeze([{ type: 'tool-cancelled' }]), accepted: true };
  }
  if (!state.selectedTool || state.toolTarget === null || state.inventory[state.selectedTool] < 1) return rejected(state, 'tool-not-ready');
  const preview = previewTool(state, state.selectedTool, state.toolTarget);
  if (!preview.length) return rejected(state, 'invalid-tool-target');
  const plan = planWave(state, [], null, null, preview);
  const inventory = Object.freeze({ ...state.inventory, [state.selectedTool]: state.inventory[state.selectedTool] - 1 });
  const next = Object.freeze({ ...state, phase: 'clear-mark' as const, moves: state.moves + 1, wave: 1, resolutionTick: 0, pendingCells: plan.cells, pendingSpecials: Object.freeze([]), gravityBoard: null, inventory, selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]), assisted: true, toolWaveActive: true });
  return { state: next, events: Object.freeze([{ type: 'tool-used', tool: state.selectedTool, target: state.toolTarget, cells: plan.cells, count: plan.cells.length }, ...plan.events]), accepted: true };
}

function gravityBoard(state: GameState): readonly (Gem | null)[] {
  const { width, height, mask } = state.settings; const result = [...state.board];
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && !mask[y * width + x]) y++;
      if (y >= height) break;
      const start = y; while (y < height && mask[y * width + x]) y++; const end = y; const survivors: Gem[] = [];
      for (let row = start; row < end; row++) { const item = state.board[row * width + x]; if (item) survivors.push(item); }
      for (let row = start; row < end; row++) result[row * width + x] = null;
      for (let offset = 0; offset < survivors.length; offset++) result[(end - survivors.length + offset) * width + x] = survivors[offset]!;
    }
  }
  return Object.freeze(result);
}
function refill(state: GameState): readonly [readonly (Gem | null)[], number, number, readonly GameEvent[]] {
  const { width, height, mask, colourCount } = state.settings; const board = [...state.board]; let randomState = state.randomState; let nextId = state.nextId; const draws: GameEvent[] = [];
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && !mask[y * width + x]) y++;
      if (y >= height) break;
      const start = y; while (y < height && mask[y * width + x]) y++; const end = y;
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
  let progress = state.toolProgress + removed; let cursor = state.toolAwardCursor; let inventory = { ...state.inventory }; const events: GameEvent[] = [];
  while (progress >= 12) {
    progress -= 12; const tool = TOOL_ORDER[cursor]!; const before = inventory[tool];
    if (before < 3) inventory[tool] = before + 1;
    events.push({ type: 'tool-awarded', tool, inventory: inventory[tool], discarded: before >= 3 });
    cursor = (cursor + 1) % TOOL_ORDER.length;
  }
  return { inventory: Object.freeze(inventory), progress, cursor, events: Object.freeze(events) };
}

/** Advances marked-clear, removal, gravity and refill phases in bounded deterministic ticks. */
export function advanceTicks(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600) throw new RangeError('ticks must be an integer from 0 to 3600');
  let current = state; const events: GameEvent[] = [];
  for (let tick = 0; tick < ticks; tick++) {
    if (current.phase === 'ready' || current.phase === 'finished') break;
    if (current.phase === 'clear-mark') {
      const elapsed = current.resolutionTick + 1;
      if (elapsed < 7) { current = Object.freeze({ ...current, resolutionTick: elapsed }); continue; }
      const removed = new Set(current.pendingCells); const holes = current.board.map((item, index) => removed.has(index) ? null : item);
      const points = current.pendingCells.filter(index => current.board[index]).length * 10 * current.wave;
      const earning = awardTools(current, current.pendingCells.filter(index => current.board[index]).length);
      const createdEvents = current.pendingSpecials.map(planned => ({ type: 'special-created', cell: planned.cell, kind: planned.kind, id: current.board[planned.cell]!.id }));
      const board = materializeSpecials(Object.freeze(holes), current.pendingSpecials);
      current = Object.freeze({ ...current, board, phase: 'clear-remove', resolutionTick: 0, score: current.score + points, pendingSpecials: Object.freeze([]), inventory: earning.inventory, toolProgress: earning.progress, toolAwardCursor: earning.cursor });
      events.push({ type: 'cells-removed', cells: current.pendingCells, wave: current.wave, points, board }, ...createdEvents, ...earning.events);
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
      current = Object.freeze({ ...current, phase: 'refill', resolutionTick: 0, board: current.gravityBoard!, gravityBoard: null });
      events.push({ type: 'gravity-completed', board: current.board }); continue;
    }
    const [board, randomState, nextId, refillEvents] = refill(current);
    const matches = findMatches(board, current.settings);
    if (matches.length) {
      const nextWave = current.wave + 1; const plan = planWave({ ...current, board }, matches, null, null);
      current = Object.freeze({ ...current, board, randomState, nextId, phase: 'clear-mark', wave: nextWave, resolutionTick: 0, pendingCells: plan.cells, pendingSpecials: plan.specials });
      events.push(...refillEvents, { type: 'match-marked', cells: matches, wave: current.wave }, ...plan.events);
    } else {
      const stable = Object.freeze({ ...current, board, randomState, nextId, phase: 'ready' as const, wave: 0, resolutionTick: 0, pendingCells: Object.freeze([]), pendingSpecials: Object.freeze([]), toolWaveActive: false });
      const legal = listLegalSwaps(stable);
      if (legal.length || availableToolCount(stable) > 0) current = stable;
      else current = Object.freeze({ ...stable, phase: 'finished' as const });
      events.push(...refillEvents, ...(legal.length || availableToolCount(stable) > 0 ? [] : [{ type: 'run-ended', result: 'no-legal-actions' } satisfies GameEvent]));
    }
  }
  return { state: current, events: Object.freeze(events), accepted: true };
}

/** Lists all legal swaps that would be accepted from the current stable state. */
export function legalActions(state: GameState): readonly Action[] {
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
    if (state.selectedTool) {
      for (let cell = 0; cell < state.board.length; cell++) if (state.settings.mask[cell] && state.board[cell]) actions.push({ kind: 'target-tool', cell });
      if (state.toolTarget !== null) actions.push({ kind: 'confirm-tool' });
      actions.push({ kind: 'cancel-tool' });
    }
  }
  return Object.freeze(actions);
}
/** Returns the current score, move count and accurately enumerated legal move count. */
function availableToolCount(state: GameState): number { return TOOL_ORDER.reduce((count, tool) => count + state.inventory[tool], 0); }
export function statusOf(state: GameState): GameStatus { return { phase: state.phase, score: state.score, moves: state.moves, legalMoveCount: legalActions(state).filter(action => action.kind === 'swap').length, usedFallback: state.usedFallback, availableToolCount: availableToolCount(state), inventory: state.inventory, toolProgress: state.toolProgress, toolAwardCursor: state.toolAwardCursor, assisted: state.assisted }; }
