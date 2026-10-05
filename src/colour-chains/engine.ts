import { compactBoard, findGroups } from './match.js';
import { drawPair, seedState } from './random.js';
import type { Action, Cell, Colour, CreateOptions, GameEvent, GameState, GameStatus, Gem, Landing, Orientation, Pair, Transition } from './types.js';

const HIDDEN = 3;
const PRESETS = { narrow: [5, 12], standard: [6, 12], wide: [8, 12], tall: [6, 16] } as const;
const OFFSETS: Readonly<Record<Orientation, readonly [number, number]>> = { up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0] };
const ORIENTATIONS: readonly Orientation[] = ['up', 'right', 'down', 'left'];
const KICKS: readonly (readonly [number, number])[] = [[0, 0], [-1, 0], [1, 0], [0, -1]];
const indexOf = (x: number, y: number, width: number): number => (y + HIDDEN) * width + x;
const emptyTransition = (state: GameState, reason: string): Transition => ({ state, events: [], accepted: false, reason });
function cellFor(pair: Pair, satellite: boolean): Cell {
  const [dx, dy] = OFFSETS[pair.orientation]; return satellite ? { x: pair.pivot.x + dx, y: pair.pivot.y + dy } : pair.pivot;
}
function occupied(state: GameState, x: number, y: number, ignoreActive = false): boolean {
  return x < 0 || x >= state.settings.width || y < -HIDDEN || y >= state.settings.height || state.board[indexOf(x, y, state.settings.width)] !== null;
}
function pairFits(state: GameState, pair: Pair): boolean {
  const a = cellFor(pair, false); const b = cellFor(pair, true);
  return a.x !== b.x || a.y !== b.y ? !occupied(state, a.x, a.y) && !occupied(state, b.x, b.y) : false;
}
function rigidLanding(state: GameState, initial: Pair): Pair {
  let pair = initial;
  while (pairFits(state, { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 } })) pair = { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 } };
  return pair;
}
function makePair(state: Pick<GameState, 'settings' | 'completedPairs' | 'nextId'>, colours: readonly [Colour, Colour]): Pair {
  return { pivot: { x: Math.floor((state.settings.width - 1) / 2), y: -2 }, orientation: 'up', gems: [{ id: state.nextId, colour: colours[0] }, { id: state.nextId + 1, colour: colours[1] }], level: 1 };
}
function takeNextPair(state: GameState): readonly [GameState, readonly GameEvent[]] {
  const colours = state.next[0]!; const drawn = drawPair(state); const next = [...state.next.slice(1), drawn[0]];
  const active = makePair(state, colours);
  let current: GameState = { ...state, active, next, bag: drawn[1], randomState: drawn[2], nextId: state.nextId + 2 };
  if (!pairFits(current, active)) current = { ...current, active: null, phase: 'lost', reason: 'spawn-collision' };
  return [current, [current.phase === 'lost' ? { type: 'run-ended', reason: 'spawn-collision' } : { type: 'pair-spawned', ids: active.gems.map(gem => gem.id), colours }]];
}
function startWave(state: GameState, chain: number): readonly [GameState, readonly GameEvent[]] {
  const groups = findGroups(state.board, state.settings.width, state.settings.height + HIDDEN);
  if (!groups.length) {
    let score = state.score; const events: GameEvent[] = [];
    if (state.resolutionHadClear && state.board.every(gem => gem === null)) {
      const bonus = 500; score += bonus; events.push({ type: 'all-clear', points: bonus, score });
    }
    const settled = { ...state, score, active: null, phase: 'falling' as const, clearCells: [], gravityBoard: null, resolutionTick: 0 };
    if (settled.board.slice(0, settled.settings.width * HIDDEN).some(gem => gem !== null)) {
      const ended = { ...settled, phase: 'lost' as const, reason: 'top-out' };
      return [ended, [...events, { type: 'run-ended', reason: 'top-out' }]];
    }
    const [spawned, spawnEvents] = takeNextPair(settled);
    return [spawned, [...events, ...spawnEvents]];
  }
  const cells = [...new Set(groups.flat())].sort((a, b) => a - b);
  return [{ ...state, phase: 'clear-mark', clearCells: cells, gravityBoard: null, resolutionTick: 0 }, [{ type: 'match-marked', chain, cells, ids: cells.map(index => state.board[index]!.id), groups }]];
}
function movedEntries(before: readonly (Gem | null)[], after: readonly (Gem | null)[], width: number): readonly { id: number; from: Cell; to: Cell }[] {
  const origin = new Map<number, number>(); before.forEach((gem, index) => { if (gem) origin.set(gem.id, index); });
  return after.flatMap((gem, index) => {
    if (!gem) return []; const from = origin.get(gem.id)!; if (from === index) return [];
    return [{ id: gem.id, from: { x: from % width, y: Math.floor(from / width) - HIDDEN }, to: { x: index % width, y: Math.floor(index / width) - HIDDEN } }];
  });
}
function lock(state: GameState, pair: Pair): Transition {
  const board = [...state.board]; const positions = [cellFor(pair, false), cellFor(pair, true)];
  for (const [i, cell] of positions.entries()) {
    if (occupied(state, cell.x, cell.y)) return { state: { ...state, phase: 'lost', active: null, reason: 'spawn-collision' }, events: [{ type: 'run-ended', reason: 'spawn-collision' }], accepted: true };
    board[indexOf(cell.x, cell.y, state.settings.width)] = pair.gems[i]!;
  }
  const compacted = compactBoard(board, state.settings.width, state.settings.height + HIDDEN);
  const next: GameState = { ...state, board, active: null, completedPairs: state.completedPairs + 1, waves: [], resolutionTick: 0, clearCells: [], gravityBoard: null, resolutionHadClear: false };
  const movement = movedEntries(board, compacted, state.settings.width);
  const events: GameEvent[] = [{ type: 'pair-locked', cells: positions, ids: pair.gems.map(gem => gem.id) }];
  if (movement.length) {
    return { state: { ...next, phase: 'gravity', gravityBoard: compacted }, events: [...events, { type: 'cells-fell', cells: movement, before: board, after: compacted }], accepted: true };
  }
  const [resolved, waveEvents] = startWave({ ...next, board: compacted }, 1);
  return { state: resolved, events: [...events, ...waveEvents], accepted: true };
}
function moved(state: GameState, action: 'left' | 'right' | 'down'): Transition {
  const pair = state.active!; const dx = action === 'left' ? -1 : action === 'right' ? 1 : 0; const dy = action === 'down' ? 1 : 0;
  const nextPair: Pair = { ...pair, pivot: { x: pair.pivot.x + dx, y: pair.pivot.y + dy } };
  if (!pairFits(state, nextPair)) return emptyTransition(state, 'blocked');
  return { state: { ...state, active: nextPair }, events: [{ type: 'pair-moved', action, from: pair.pivot, to: nextPair.pivot }], accepted: true };
}
function rotate(state: GameState, clockwise: boolean): Transition {
  const pair = state.active!; const oldIndex = ORIENTATIONS.indexOf(pair.orientation); const orientation = ORIENTATIONS[(oldIndex + (clockwise ? 1 : 3)) % 4]!;
  for (const [dx, dy] of KICKS) {
    const candidate: Pair = { ...pair, pivot: { x: pair.pivot.x + dx!, y: pair.pivot.y + dy! }, orientation };
    if (pairFits(state, candidate)) return { state: { ...state, active: candidate }, events: [{ type: 'pair-rotated', direction: clockwise ? 'clockwise' : 'anticlockwise', from: pair.orientation, to: orientation, kick: { x: dx, y: dy } }], accepted: true };
  }
  return emptyTransition(state, 'blocked-rotation');
}
/** Creates a deterministic relaxed game with one active pair and three preview pairs. */
export function createGame(options: CreateOptions = {}): GameState {
  if (options && typeof options !== 'object') throw new TypeError('Options must be an object');
  const preset = options.preset ?? 'standard';
  if (!Object.hasOwn(PRESETS, preset)) throw new RangeError('Unsupported board preset');
  const dimensions = PRESETS[preset]; const width = options.width ?? dimensions[0]; const height = options.height ?? dimensions[1];
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 5 || width > 10 || height < 12 || height > 20 || width * height > 240) throw new RangeError('Board must be 5–10 columns by 12–20 visible rows, with at most 240 cells');
  const colourCount = options.colourCount ?? 4;
  if (![4, 5, 6].includes(colourCount)) throw new RangeError('Colour count must be 4, 5, or 6');
  const seed = options.seed ?? 'houseki-colour-chains';
  if (typeof seed !== 'string' || seed.length > 200) throw new RangeError('Seed must be a string of at most 200 characters');
  const settings = { width, height, colourCount, seed } as const;
  let state: GameState = { game: 'colour-chains', rules: 'chains-1', settings, board: Array(width * (height + HIDDEN)).fill(null), phase: 'falling', active: null, next: [], bag: [], randomState: seedState(seed), nextId: 1, score: 0, maxChain: 0, completedPairs: 0, resolutionTick: 0, waves: [], clearCells: [], gravityBoard: null, resolutionHadClear: false };
  const first = drawPair(state); state = { ...state, bag: first[1], randomState: first[2] }; const active = makePair(state, first[0]); state = { ...state, active, nextId: 3 };
  const next: (readonly [Colour, Colour])[] = [];
  for (let i = 0; i < 3; i++) { const draw = drawPair(state); next.push(draw[0]); state = { ...state, bag: draw[1], randomState: draw[2] }; }
  return { ...state, next };
}
/** Applies one canonical action without mutating the input state. */
export function applyAction(state: GameState, action: Action): Transition {
  if (!action || typeof action !== 'object' || !('kind' in action)) return emptyTransition(state, 'invalid-action');
  if (state.phase !== 'falling' || !state.active) return emptyTransition(state, 'not-ready');
  switch (action.kind) {
    case 'left': case 'right': case 'down': return moved(state, action.kind);
    case 'rotate-clockwise': return rotate(state, true);
    case 'rotate-anticlockwise': return rotate(state, false);
    case 'place': return lock(state, rigidLanding(state, state.active));
    case 'hard-drop': {
      const pair = rigidLanding(state, state.active);
      const dropped = { ...state, active: pair };
      const result = lock(dropped, pair);
      return { ...result, events: [{ type: 'pair-dropped', from: state.active.pivot, to: pair.pivot }, ...result.events] };
    }
    default: return emptyTransition(state, 'invalid-action');
  }
}
/** Advances clear, removal, and gravity phases by a bounded number of logical ticks. */
export function advanceTicks(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600) throw new RangeError('ticks must be an integer from 0 to 3600');
  let current = state; const events: GameEvent[] = [];
  for (let i = 0; i < ticks; i++) {
    if (current.phase === 'clear-mark' && current.resolutionTick + 1 >= 7) {
      current = { ...current, phase: 'clear-remove', resolutionTick: 0 };
      events.push({ type: 'clear-removal-started', chain: current.waves.length + 1, cells: current.clearCells });
    } else if (current.phase === 'clear-mark') current = { ...current, resolutionTick: current.resolutionTick + 1 };
    else if (current.phase === 'clear-remove' && current.resolutionTick + 1 >= 6) {
      const clear = new Set(current.clearCells); const board = current.board.map((gem, index) => clear.has(index) ? null : gem);
      const chain = current.waves.length + 1; const ids = current.clearCells.map(index => current.board[index]!.id); const points = 10 * clear.size * 1 * chain;
      const wave = { chain, cells: current.clearCells, ids, points }; const score = current.score + points;
      const gravityBoard = compactBoard(board, current.settings.width, current.settings.height + HIDDEN);
      current = { ...current, board, phase: 'gravity', gravityBoard, resolutionTick: 0, score, maxChain: Math.max(current.maxChain, chain), waves: [...current.waves, wave], resolutionHadClear: true };
      events.push({ type: 'cells-cleared', chain, cells: current.clearCells, ids, points, score });
    } else if (current.phase === 'clear-remove') current = { ...current, resolutionTick: current.resolutionTick + 1 };
    else if (current.phase === 'gravity' && current.resolutionTick + 1 >= 9) {
      const before = current.board; const after = current.gravityBoard!; const falling = movedEntries(before, after, current.settings.width);
      current = { ...current, board: after, phase: 'falling', gravityBoard: null, resolutionTick: 0 };
      if (falling.length) events.push({ type: 'cells-fell', cells: falling, before, after });
      const [resolved, waveEvents] = startWave(current, current.waves.length + 1); current = resolved; events.push(...waveEvents);
    } else if (current.phase === 'gravity') current = { ...current, resolutionTick: current.resolutionTick + 1 };
  }
  return { state: current, events, accepted: true };
}
/** Lists only actions accepted by the current falling pair. */
export function legalActions(state: GameState): readonly Action[] {
  if (state.phase !== 'falling' || !state.active) return [];
  const actions: Action[] = [];
  for (const kind of ['left', 'right', 'down'] as const) if (moved(state, kind).accepted) actions.push({ kind });
  if (rotate(state, true).accepted) actions.push({ kind: 'rotate-clockwise' });
  if (rotate(state, false).accepted) actions.push({ kind: 'rotate-anticlockwise' });
  actions.push({ kind: 'hard-drop' }, { kind: 'place' }); return actions;
}
/** Returns concise status fields without changing the game state. */
export function statusOf(state: GameState): GameStatus {
  return { phase: state.phase, score: state.score, maxChain: state.maxChain, completedPairs: state.completedPairs, ...(state.reason ? { reason: state.reason } : {}) };
}
/** Projects the pair's hard-drop and independent column-settle destinations without matching or drawing. */
export function landingCells(state: GameState): Landing | null {
  if (!state.active) return null;
  const pair = rigidLanding(state, state.active);
  const board = [...state.board];
  for (const [i, cell] of [cellFor(pair, false), cellFor(pair, true)].entries()) board[indexOf(cell.x, cell.y, state.settings.width)] = pair.gems[i]!;
  const settled = compactBoard(board, state.settings.width, state.settings.height + HIDDEN);
  return pair.gems.map(gem => {
    const index = settled.findIndex(cell => cell?.id === gem.id);
    return { x: index % state.settings.width, y: Math.floor(index / state.settings.width) - HIDDEN };
  }) as unknown as Landing;
}
