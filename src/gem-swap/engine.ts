import { COLOURS, PRESETS, findMatches, listLegalSwaps, neighbors } from './board.js';
import { drawColour, nextInt, seedState } from './random.js';
import { isValidSpecialSwap, materializeSpecials, planWave } from './specials.js';
import type { Action, BoardPreset, BoardShape, CreateOptions, GameEvent, GameState, GameStatus, Gem, GemColour, Settings, Transition } from './types.js';

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
  const allowed = ['preset', 'width', 'height', 'colourCount', 'seed', 'shape', 'mask'];
  if (Object.keys(options).some(key => !allowed.includes(key))) throw new GemSwapOptionsError('unknown-option', 'Options contain an unsupported field');
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
  return Object.freeze({ width: width!, height: height!, colourCount, seed, ...(shape ? { shape } : {}), mask: Object.freeze([...mask]) });
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
      const trial: GameState = { game: 'gem-swap', rules: 'swap-1', settings, board, phase: 'ready', score: 0, moves: 0, randomState, nextId, usedFallback: false, wave: 0, resolutionTick: 0, pendingCells: [], pendingSpecials: [], gravityBoard: null };
      found = !findMatches(board, settings).length && listLegalSwaps(trial).length > 0;
    }
  }
  let usedFallback = false;
  if (!found) {
    board = [...fallbackBoardForTest(settings)]; nextId = board.filter(Boolean).length + 1; usedFallback = true;
    const fallbackState: GameState = { game: 'gem-swap', rules: 'swap-1', settings, board, phase: 'ready', score: 0, moves: 0, randomState, nextId, usedFallback: true, wave: 0, resolutionTick: 0, pendingCells: [], pendingSpecials: [], gravityBoard: null };
    if (findMatches(board, settings).length || listLegalSwaps(fallbackState).length === 0) throw new GemSwapOptionsError('invalid-fallback', 'The validated standard fallback failed its stability or legal-move check');
  }
  return Object.freeze({ game: 'gem-swap', rules: 'swap-1', settings, board: Object.freeze(board), phase: 'ready', score: 0, moves: 0, randomState, nextId, usedFallback, wave: 0, resolutionTick: 0, pendingCells: Object.freeze([]), pendingSpecials: Object.freeze([]), gravityBoard: null });
}

function rejected(state: GameState, reason: string): Transition { return { state, events: Object.freeze([]), accepted: false, reason }; }
function adjacent(state: GameState, from: number, to: number): boolean { return neighbors(from, state.settings.width, state.settings.height, state.settings.mask).includes(to); }

/** Accepts a legal orthogonal normal-gem swap, leaving invalid state identity unchanged. */
export function applyAction(state: GameState, action: Action): Transition {
  if (!action || typeof action !== 'object' || action.kind !== 'swap' || !Number.isInteger(action.from) || !Number.isInteger(action.to)) return rejected(state, 'invalid-action');
  if (Object.keys(action).some(key => !['kind', 'from', 'to'].includes(key))) return rejected(state, 'invalid-action');
  if (state.phase !== 'ready') return rejected(state, 'resolution-in-progress');
  if (findMatches(state.board, state.settings).length) return rejected(state, 'unstable-board');
  const { from, to } = action;
  if (from < 0 || to < 0 || from >= state.board.length || to >= state.board.length || from === to || !state.settings.mask[from] || !state.settings.mask[to] || !state.board[from] || !state.board[to] || !adjacent(state, from, to)) return rejected(state, 'not-adjacent-active-gems');
  const board = [...state.board]; [board[from], board[to]] = [board[to]!, board[from]!];
  const matched = findMatches(board, state.settings);
  if (!isValidSpecialSwap(board[from]!, board[to]!, matched.length > 0)) return rejected(state, board[from]!.colour === board[to]!.colour && !board[from]!.kind && !board[to]!.kind ? 'identical-gems' : 'swap-makes-no-match');
  const swapped = Object.freeze({ ...state, board: Object.freeze(board) });
  const plan = planWave(swapped, matched, from, to);
  const next = Object.freeze({ ...swapped, phase: 'clear-mark' as const, moves: state.moves + 1, wave: 1, resolutionTick: 0, pendingCells: plan.cells, pendingSpecials: plan.specials, gravityBoard: null });
  return { state: next, events: Object.freeze([{ type: 'swap-accepted', from, to, ids: [state.board[from]!.id, state.board[to]!.id] }, ...(matched.length ? [{ type: 'match-marked', cells: matched, wave: 1 }] : []), ...plan.events]), accepted: true };
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
      const createdEvents = current.pendingSpecials.map(planned => ({ type: 'special-created', cell: planned.cell, kind: planned.kind, id: current.board[planned.cell]!.id }));
      const board = materializeSpecials(Object.freeze(holes), current.pendingSpecials);
      current = Object.freeze({ ...current, board, phase: 'clear-remove', resolutionTick: 0, score: current.score + points, pendingSpecials: Object.freeze([]) });
      events.push({ type: 'cells-removed', cells: current.pendingCells, wave: current.wave, points, board }, ...createdEvents);
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
      const stable = Object.freeze({ ...current, board, randomState, nextId, phase: 'ready' as const, wave: 0, resolutionTick: 0, pendingCells: Object.freeze([]), pendingSpecials: Object.freeze([]) });
      const legal = listLegalSwaps(stable);
      if (legal.length) current = stable;
      else current = Object.freeze({ ...stable, phase: 'finished' as const });
      events.push(...refillEvents, ...(legal.length ? [] : [{ type: 'run-ended', result: 'no-legal-swaps' } satisfies GameEvent]));
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
  return Object.freeze(actions);
}
/** Returns the current score, move count and accurately enumerated legal move count. */
export function statusOf(state: GameState): GameStatus { return { phase: state.phase, score: state.score, moves: state.moves, legalMoveCount: legalActions(state).length, usedFallback: state.usedFallback }; }
