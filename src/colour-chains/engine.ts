import { compactBoard, findGroups } from './match.js';
import { drawPair, seedState } from './random.js';
import { applyEarthquake, applyLightning, applyMagneticPulse, createNatureState, isEnvironmentTurnScheduled, markMagneticStones, previewPowerDrop } from '../nature.js';
import type { PowerDropPreview } from '../nature/types.js';
import { StoneChainsOptionsError, normalizeOptions } from './validation.js';
import type { Action, Cell, Colour, CreateOptions, GameEvent, GameState, GameStatus, Gem, Landing, Orientation, Pair, Settings, Transition } from './types.js';

export { StoneChainsOptionsError } from './validation.js';
const HIDDEN = 3;
const RULES = 'chains-1' as const;
const OFFSETS: Readonly<Record<Orientation, readonly [number, number]>> = { up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0] };
const ORIENTATIONS: readonly Orientation[] = ['up', 'right', 'down', 'left'];
const KICKS: readonly (readonly [number, number])[] = [[0, 0], [-1, 0], [1, 0], [0, -1]];
const indexOf = (x: number, y: number, width: number): number => (y + HIDDEN) * width + x;
const emptyTransition = (state: GameState, reason: string): Transition => ({ state, events: [], accepted: false, reason });
function cellFor(pair: Pair, satellite: boolean): Cell {
  const [dx, dy] = OFFSETS[pair.orientation]; return satellite ? { x: pair.pivot.x + dx, y: pair.pivot.y + dy } : pair.pivot;
}
function occupied(state: GameState, x: number, y: number): boolean {
  return x < 0 || x >= state.settings.width || y < -HIDDEN || y >= state.settings.height || state.board[indexOf(x, y, state.settings.width)] !== null;
}
function pairFits(state: GameState, pair: Pair): boolean {
  const a = cellFor(pair, false); const b = cellFor(pair, true);
  return (a.x !== b.x || a.y !== b.y) && !occupied(state, a.x, a.y) && !occupied(state, b.x, b.y);
}
function grounded(state: GameState, pair: Pair): boolean { return !pairFits(state, { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 } }); }
function rigidLanding(state: GameState, initial: Pair): Pair {
  let pair = initial; while (pairFits(state, { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 } })) pair = { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 } }; return pair;
}
function makePair(state: Pick<GameState, 'settings' | 'completedPairs' | 'nextId'>, colours: readonly [Colour, Colour], magnets?: readonly [boolean, boolean]): Pair {
  const level = state.settings.mode === 'arcade' || state.settings.mode === 'daily' ? 1 + Math.floor(state.completedPairs / 30) : 1;
  const gems: [Gem, Gem] = [{ id: state.nextId, colour: colours[0] }, { id: state.nextId + 1, colour: colours[1] }];
  if (magnets?.[0]) gems[0] = { ...gems[0], magnetic: true };
  if (magnets?.[1]) gems[1] = { ...gems[1], magnetic: true };
  return { pivot: { x: Math.floor((state.settings.width - 1) / 2), y: -2 }, orientation: 'up', gems, level, gravityTicks: 0, groundedTicks: 0, resetCount: 0, groundedStarted: false };
}
function magneticFlags(seed: string, pairIndex: number, colours: readonly [Colour, Colour]): readonly [boolean, boolean] {
  const board = createNatureState({ width: 2, height: 1, seed: `colour-chains|shizen|${seed}|pair-${pairIndex}`, cells: [{ id: 1, kind: 'stone', colour: colours[0] }, { id: 2, kind: 'stone', colour: colours[1] }] });
  const marked = markMagneticStones(board, { probability: 0.08, maximum: 1 }).state;
  return [marked.cells[0]?.magnetic === true, marked.cells[1]?.magnetic === true];
}
function natureBoard(state: GameState) {
  const width = state.settings.width, height = state.settings.height;
  const cells = state.board.slice(width * HIDDEN).map(gem => gem ? { id: gem.id, kind: 'stone' as const, colour: gem.colour, ...(gem.magnetic ? { magnetic: true } : {}) } : null);
  return createNatureState({ width, height, seed: `colour-chains|shizen|${state.settings.seed}`, cells });
}
function naturePulse(state: GameState, board: readonly (Gem | null)[]): { board: readonly (Gem | null)[]; events: readonly GameEvent[] } {
  const width = state.settings.width, height = state.settings.height;
  const cells = board.slice(width * HIDDEN).map(gem => gem ? { id: gem.id, kind: 'stone' as const, colour: gem.colour, ...(gem.magnetic ? { magnetic: true } : {}) } : null);
  const result = applyMagneticPulse(createNatureState({ width, height, seed: `colour-chains|shizen|${state.settings.seed}`, cells }));
  if (!result.events.length) return { board, events: [] };
  const updated = [...board];
  for (let i = 0; i < result.state.cells.length; i++) {
    const entity = result.state.cells[i];
    updated[i + width * HIDDEN] = entity ? { id: entity.id, colour: entity.colour as Colour, ...(entity.magnetic ? { magnetic: true } : {}) } : null;
  }
  return { board: updated, events: result.events.map(event => ({ ...event })) };
}
function boardWithNatureCells(state: GameState, board: readonly (Gem | null)[], cells: readonly ({ id: number; kind: 'stone' | 'obstacle'; colour?: string; magnetic?: boolean } | null)[]): readonly (Gem | null)[] {
  const width = state.settings.width, updated = [...board];
  for (let index = 0; index < cells.length; index++) {
    const entity = cells[index];
    updated[index + width * HIDDEN] = entity?.kind === 'stone' ? { id: entity.id, colour: entity.colour as Colour, ...(entity.magnetic ? { magnetic: true } : {}) } : null;
  }
  return updated;
}
function applyWeather(state: GameState): { board: readonly (Gem | null)[]; events: readonly GameEvent[] } {
  const nature = natureBoard(state); const turn = state.completedPairs;
  const interval = state.settings.weather === 'frequent' ? 2 : 8;
  const eventIndex = Math.floor(turn / interval) - 1;
  const kind = eventIndex % 2 === 0 ? 'jumble' : 'lightning';
  if (kind === 'jumble') {
    const result = applyEarthquake(createNatureState({ width: nature.width, height: nature.height, seed: `${state.settings.seed}|arashi|turn-${turn}`, cells: nature.cells }), { kind: 'jumble' });
    return { board: boardWithNatureCells(state, state.board, result.state.cells), events: [{ type: 'weather-triggered', kind, turn }, ...result.events.map(event => ({ ...event }))] };
  }
  const result = applyLightning(createNatureState({ width: nature.width, height: nature.height, seed: `${state.settings.seed}|arashi|turn-${turn}`, cells: nature.cells }));
  return { board: boardWithNatureCells(state, state.board, result.state.cells), events: [{ type: 'weather-triggered', kind, turn }, ...result.events.map(event => ({ ...event }))] };
}
function takeNextPair(state: GameState): readonly [GameState, readonly GameEvent[]] {
  const colours = state.next[0]!; const draw = drawPair(state); const next = [...state.next.slice(1), draw[0]];
  const flags = state.settings.nature ? state.nextMagnetic?.[0] : undefined;
  const active = makePair(state, colours, flags);
  const nextMagnetic = state.settings.nature ? [...(state.nextMagnetic?.slice(1) ?? []), magneticFlags(state.settings.seed, state.completedPairs + 3, draw[0])] : undefined;
  let current: GameState = { ...state, active, next, ...(nextMagnetic ? { nextMagnetic } : {}), bag: draw[1], randomState: draw[2], nextId: state.nextId + 2 };
  if (!pairFits(current, active)) current = { ...current, active: null, phase: 'lost', reason: 'spawn-collision' };
  return [current, [current.phase === 'lost' ? { type: 'run-ended', reason: 'spawn-collision' } : { type: 'pair-spawned', ids: active.gems.map(gem => gem.id), colours }]];
}
function movedEntries(before: readonly (Gem | null)[], after: readonly (Gem | null)[], width: number): readonly { id: number; from: Cell; to: Cell }[] {
  const origin = new Map<number, number>(); before.forEach((gem, index) => { if (gem) origin.set(gem.id, index); });
  return after.flatMap((gem, index) => { if (!gem) return []; const from = origin.get(gem.id)!; if (from === index) return []; return [{ id: gem.id, from: { x: from % width, y: Math.floor(from / width) - HIDDEN }, to: { x: index % width, y: Math.floor(index / width) - HIDDEN } }]; });
}
function satisfied(state: GameState): boolean {
  const goal = state.settings.goal; if (!goal) return false;
  if (goal.kind === 'clear-targets') return goal.targetIds.every(id => !state.board.some(gem => gem?.id === id));
  if (goal.kind === 'minimum-chain') return state.maxChain >= goal.chain;
  return state.board.every(gem => gem === null);
}
function terminalAfterResolution(state: GameState): readonly [GameState, readonly GameEvent[]] {
  if (state.settings.mode === 'challenge' && satisfied(state)) return [{ ...state, phase: 'won', active: null, reason: 'goal-complete' }, [{ type: 'run-ended', reason: 'goal-complete', score: state.score }]];
  if (state.board.slice(0, state.settings.width * HIDDEN).some(gem => gem !== null)) return [{ ...state, phase: 'lost', active: null, reason: 'top-out' }, [{ type: 'run-ended', reason: 'top-out' }]];
  let current = state; const weatherEvents: GameEvent[] = [];
  if (state.settings.weather && state.weatherResolvedPairs !== state.completedPairs) {
    const turn = state.completedPairs;
    current = { ...current, weatherResolvedPairs: turn };
    if (isEnvironmentTurnScheduled(turn, { kind: state.settings.weather })) {
      const effect = applyWeather(current); weatherEvents.push(...effect.events);
      current = { ...current, board: effect.board };
      const groups = findGroups(current.board, current.settings.width, current.settings.height + HIDDEN);
      if (groups.length) {
        const cells = [...new Set(groups.flat())].sort((a, b) => a - b);
        return [{ ...current, phase: 'clear-mark', active: null, clearCells: cells, gravityBoard: null, resolutionTick: 0 }, [...weatherEvents, { type: 'match-marked', chain: current.waves.length + 1, cells, ids: cells.map(index => current.board[index]!.id), groups }]];
      }
      const settled = compactBoard(current.board, current.settings.width, current.settings.height + HIDDEN);
      const movement = movedEntries(current.board, settled, current.settings.width);
      if (movement.length) return [{ ...current, phase: 'gravity', active: null, gravityBoard: settled, resolutionTick: 0 }, [...weatherEvents, { type: 'cells-fell', cells: movement, before: current.board, after: settled }]];
      current = { ...current, board: settled };
    }
  }
  if (current.settings.mode === 'challenge') {
    const nextIndex = current.completedPairs;
    if (nextIndex >= (current.settings.queue?.length ?? 0)) return [{ ...current, phase: 'lost', active: null, reason: 'challenge-queue-exhausted' }, [...weatherEvents, { type: 'run-ended', reason: 'challenge-queue-exhausted' }]];
    const queue = current.settings.queue!; const colours = queue[nextIndex]!; const pair = makePair(current, colours);
    const next = { ...current, active: pair, next: queue.slice(nextIndex + 1, nextIndex + 4), nextId: current.nextId + 2 };
    if (!pairFits(next, pair)) return [{ ...next, active: null, phase: 'lost', reason: 'spawn-collision' }, [...weatherEvents, { type: 'run-ended', reason: 'spawn-collision' }]];
    return [next, [...weatherEvents, { type: 'pair-spawned', ids: pair.gems.map(gem => gem.id), colours }]];
  }
  if (current.settings.pairLimit !== undefined && current.completedPairs >= current.settings.pairLimit) return [{ ...current, phase: 'finished', active: null, reason: 'pair-limit' }, [...weatherEvents, { type: 'run-ended', reason: 'pair-limit', score: current.score }]];
  const [spawned, events] = takeNextPair(current); return [spawned, [...weatherEvents, ...events]];
}
function startWave(state: GameState, chain: number): readonly [GameState, readonly GameEvent[]] {
  const groups = findGroups(state.board, state.settings.width, state.settings.height + HIDDEN);
  if (!groups.length) {
    let score = state.score; let allClears = state.allClears; const events: GameEvent[] = [];
    if (state.resolutionHadClear && state.board.every(gem => gem === null) && (state.settings.mode === 'arcade' || state.settings.mode === 'daily')) {
      const bonus = 500 * (state.resolutionLevel ?? 1); score += bonus; allClears++;
      events.push({ type: 'all-clear', points: bonus, score, count: allClears });
    }
    const ended = { ...state, score, allClears, active: null, phase: 'falling' as const, clearCells: [], gravityBoard: null, resolutionTick: 0 };
    return terminalAfterResolution(ended);
  }
  const cells = [...new Set(groups.flat())].sort((a, b) => a - b);
  return [{ ...state, phase: 'clear-mark', clearCells: cells, gravityBoard: null, resolutionTick: 0 }, [{ type: 'match-marked', chain, cells, ids: cells.map(index => state.board[index]!.id), groups }]];
}
function lock(state: GameState, pair: Pair, points = 0): Transition {
  const board = [...state.board]; const positions = [cellFor(pair, false), cellFor(pair, true)];
  for (const [i, cell] of positions.entries()) {
    if (occupied(state, cell.x, cell.y)) return { state: { ...state, phase: 'lost', active: null, reason: 'spawn-collision' }, events: [{ type: 'run-ended', reason: 'spawn-collision' }], accepted: true };
    board[indexOf(cell.x, cell.y, state.settings.width)] = pair.gems[i]!;
  }
  const compacted = state.settings.nature ? board : compactBoard(board, state.settings.width, state.settings.height + HIDDEN);
  const witness = state.settings.witness?.[state.completedPairs];
  const onPath = state.witnessIndex >= 0 && (!witness || witness.pivotX === pair.pivot.x && witness.orientation === pair.orientation);
  const witnessIndex = state.settings.mode === 'challenge' ? (onPath ? state.completedPairs + 1 : -1) : -1;
  const next: GameState = { ...state, board: compacted, active: null, score: state.score + points, completedPairs: state.completedPairs + 1, waves: [], resolutionTick: 0, clearCells: [], gravityBoard: null, resolutionHadClear: false, resolutionLevel: pair.level, witnessIndex, ...(state.settings.nature ? { naturePulsePending: false } : {}) };
  const events: GameEvent[] = [{ type: 'pair-locked', cells: positions, ids: pair.gems.map(gem => gem.id), ...(points ? { points, score: next.score } : {}) }];
  if (state.settings.nature) {
    const groups = findGroups(board, state.settings.width, state.settings.height + HIDDEN);
    if (groups.length) {
      const cells = [...new Set(groups.flat())].sort((a, b) => a - b);
      const marked: GameState = { ...next, naturePulsePending: true, phase: 'clear-mark', clearCells: cells };
      return { state: marked, events: [...events, { type: 'match-marked', chain: 1, cells, ids: cells.map(index => board[index]!.id), groups }], accepted: true };
    }
    const pulse = naturePulse(next, board);
    const afterPulse = pulse.board;
    const pulseGroups = findGroups(afterPulse, state.settings.width, state.settings.height + HIDDEN);
    if (pulseGroups.length) {
      const cells = [...new Set(pulseGroups.flat())].sort((a, b) => a - b);
      const marked: GameState = { ...next, board: afterPulse, phase: 'clear-mark', clearCells: cells };
      return { state: marked, events: [...events, ...pulse.events, { type: 'match-marked', chain: 1, cells, ids: cells.map(index => afterPulse[index]!.id), groups: pulseGroups }], accepted: true };
    }
    const settled = compactBoard(afterPulse, state.settings.width, state.settings.height + HIDDEN);
    const movement = movedEntries(afterPulse, settled, state.settings.width);
    if (movement.length) return { state: { ...next, board: afterPulse, phase: 'gravity', gravityBoard: settled }, events: [...events, ...pulse.events, { type: 'cells-fell', cells: movement, before: afterPulse, after: settled }], accepted: true };
    const [resolved, waveEvents] = startWave({ ...next, board: settled }, 1);
    return { state: resolved, events: [...events, ...pulse.events, ...waveEvents], accepted: true };
  }
  const movement = movedEntries(board, compacted, state.settings.width);
  if (movement.length) return { state: { ...next, board, phase: 'gravity', gravityBoard: compacted }, events: [...events, { type: 'cells-fell', cells: movement, before: board, after: compacted }], accepted: true };
  const [resolved, waveEvents] = startWave({ ...next, board: compacted }, 1); return { state: resolved, events: [...events, ...waveEvents], accepted: true };
}
function rebound(state: GameState, pair: Pair) {
  const landing = rigidLanding(state, pair); const nature = natureBoard(state);
  const piece = [cellFor(landing, false), cellFor(landing, true)].map((cell, index) => ({
    id: landing.gems[index]!.id, kind: 'stone' as const, colour: landing.gems[index]!.colour,
    ...(landing.gems[index]!.magnetic ? { magnetic: true } : {}), x: cell.x, y: cell.y,
  }));
  if (piece.some(cell => cell.y < 0 || cell.y >= state.settings.height)) return null;
  const direction = state.lastHorizontalDirection ?? (state.completedPairs % 2 === 0 ? 'left' : 'right');
  const preview = previewPowerDrop(nature, { piece, pivotId: landing.gems[0].id, power: true, lastHorizontalDirection: direction });
  const pivot = preview.finalCells.find(cell => cell.id === landing.gems[0].id)!;
  return { pair: { ...landing, pivot: { x: pivot.x, y: pivot.y } }, preview };
}
function moved(state: GameState, action: 'left' | 'right' | 'down'): Transition {
  const pair = state.active!; const dx = action === 'left' ? -1 : action === 'right' ? 1 : 0; const dy = action === 'down' ? 1 : 0;
  const nextPair: Pair = { ...pair, pivot: { x: pair.pivot.x + dx, y: pair.pivot.y + dy }, ...(action === 'down' ? { gravityTicks: 0 } : {}) };
  if (!pairFits(state, nextPair)) return emptyTransition(state, 'blocked');
  const wasGrounded = grounded(state, pair); const isGrounded = grounded(state, nextPair); const canReset = wasGrounded && action !== 'down' && pair.resetCount < 8;
  const resetCount = pair.resetCount + (canReset ? 1 : 0);
  const groundedTicks = canReset ? 0 : pair.groundedTicks;
  const groundedStarted = canReset ? isGrounded : pair.groundedStarted;
  return { state: { ...state, active: { ...nextPair, resetCount, groundedTicks, groundedStarted }, ...(state.settings.nature && (action === 'left' || action === 'right') ? { lastHorizontalDirection: action } : {}) }, events: [{ type: action === 'down' ? 'pair-soft-dropped' : 'pair-moved', action, from: pair.pivot, to: nextPair.pivot }], accepted: true };
}
function rotate(state: GameState, clockwise: boolean): Transition {
  const pair = state.active!; const oldIndex = ORIENTATIONS.indexOf(pair.orientation); const orientation = ORIENTATIONS[(oldIndex + (clockwise ? 1 : 3)) % 4]!;
  for (const [dx, dy] of KICKS) {
    const candidate: Pair = { ...pair, pivot: { x: pair.pivot.x + dx!, y: pair.pivot.y + dy! }, orientation };
    if (!pairFits(state, candidate)) continue;
    const wasGrounded = grounded(state, pair); const isGrounded = grounded(state, candidate); const canReset = wasGrounded && pair.resetCount < 8;
    return { state: { ...state, active: { ...candidate, resetCount: pair.resetCount + (canReset ? 1 : 0), groundedTicks: canReset ? 0 : pair.groundedTicks, groundedStarted: canReset ? isGrounded : pair.groundedStarted } }, events: [{ type: 'pair-rotated', direction: clockwise ? 'clockwise' : 'anticlockwise', from: pair.orientation, to: orientation, kick: { x: dx, y: dy } }], accepted: true };
  }
  return emptyTransition(state, 'blocked-rotation');
}
function applyCore(state: GameState, action: Action): Transition {
  if (!action || typeof action !== 'object' || !['left', 'right', 'down', 'rotate-clockwise', 'rotate-anticlockwise', 'hard-drop', 'place', 'pause', 'resume', 'hint'].includes((action as {kind?: string}).kind ?? '') || Object.keys(action).some(key => key !== 'kind')) return emptyTransition(state, 'invalid-action');
  if (action.kind === 'pause') {
    if (!['falling', 'clear-mark', 'clear-remove', 'gravity'].includes(state.phase)) return emptyTransition(state, 'cannot-pause');
    return { state: { ...state, phase: 'paused', pausedPhase: state.phase as Exclude<GameState['phase'], 'paused'>, assisted: state.assisted || state.settings.mode === 'arcade' || state.settings.mode === 'daily' }, events: [{ type: 'paused' }], accepted: true };
  }
  if (action.kind === 'resume') {
    if (state.phase !== 'paused') return emptyTransition(state, 'not-paused');
    const { pausedPhase, ...rest } = state; return { state: { ...rest, phase: pausedPhase ?? 'falling' }, events: [{ type: 'resumed' }], accepted: true };
  }
  if (action.kind === 'hint') {
    const witness = state.settings.witness?.[state.completedPairs];
    if (state.settings.mode !== 'challenge' || state.phase !== 'falling' || !state.active || state.witnessIndex !== state.completedPairs || !witness) return emptyTransition(state, 'no-proved-hint-available');
    return { state: { ...state, assisted: true }, events: [{ type: 'hint-shown', pair: state.completedPairs, ...witness, assisted: true }], accepted: true };
  }
  if (state.phase !== 'falling' || !state.active) return emptyTransition(state, 'not-ready');
  const pair = state.active;
  switch (action.kind) {
    case 'left': case 'right': return moved(state, action.kind);
    case 'down':
      if (!pairFits(state, { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 } })) return emptyTransition(state, 'blocked');
      { const result = moved(state, 'down'); const points = state.settings.mode === 'arcade' || state.settings.mode === 'daily' ? 1 : 0; const score = state.score + points; return { ...result, state: { ...result.state, score }, events: points ? [...result.events, { type: 'score-changed', score, points }] : result.events }; }
    case 'rotate-clockwise': return rotate(state, true);
    case 'rotate-anticlockwise': return rotate(state, false);
    case 'place':
      if (state.settings.mode !== 'relaxed') return emptyTransition(state, 'place-only-in-relaxed');
      return lock(state, pair);
    case 'hard-drop': {
      if (state.settings.mode === 'relaxed') return emptyTransition(state, 'hard-drop-disabled');
      const normal = rigidLanding(state, pair); const reboundResult = state.settings.nature ? rebound(state, normal) : null;
      const landing = reboundResult?.pair ?? normal; const points = state.settings.mode === 'arcade' || state.settings.mode === 'daily' ? (normal.pivot.y - pair.pivot.y) * 2 : 0; const result = lock(state, landing, points);
      return { ...result, events: [{ type: 'pair-dropped', from: pair.pivot, to: landing.pivot, points, score: state.score + points }, ...(reboundResult ? [{ type: 'power-drop-landed', power: true, rebound: reboundResult.preview.rebound, ...(reboundResult.preview.selectedDirection ? { direction: reboundResult.preview.selectedDirection } : {}), quarterTurn: reboundResult.preview.quarterTurn, moves: reboundResult.preview.moves, cells: reboundResult.preview.finalCells.map(cell => ({ id: cell.id, x: cell.x, y: cell.y })), ids: pair.gems.map(gem => gem.id) }] : []), ...result.events] };
    }
  }
}
/** Applies one immutable accepted action and records its logical-tick position. */
export function applyAction(state: GameState, action: Action): Transition {
  const result = applyCore(state, action); if (!result.accepted) return result;
  const previous = state.recording.at(-1); const ordinal = previous?.tick === state.elapsedTicks ? previous.ordinal + 1 : 0;
  return { ...result, state: { ...result.state, recording: [...state.recording, { tick: state.elapsedTicks, ordinal, action }] } };
}
function advanceResolution(state: GameState): Transition {
  let next = { ...state, resolutionTick: state.resolutionTick + 1 }; const events: GameEvent[] = [];
  if (next.phase === 'clear-mark' && next.resolutionTick >= 7) { next = { ...next, phase: 'clear-remove', resolutionTick: 0 }; events.push({ type: 'clear-removal-started', chain: next.waves.length + 1, cells: next.clearCells }); }
  else if (next.phase === 'clear-remove' && next.resolutionTick >= 6) {
    const clear = new Set(next.clearCells); const ids = [...clear].map(index => next.board[index]!.id); const chain = next.waves.length + 1; const level = next.resolutionLevel ?? 1; const points = 10 * clear.size * level * chain;
    const board = next.board.map((gem, index) => clear.has(index) ? null : gem);
    const wave = { chain, cells: [...clear], ids, points }; const score = next.score + points;
    next = { ...next, board, score, waves: [...next.waves, wave], maxChain: Math.max(next.maxChain, chain), phase: 'gravity', resolutionTick: 0, clearCells: [], resolutionHadClear: true };
    events.push({ type: 'cells-cleared', chain, cells: [...clear], ids, points, score });
    if (next.settings.nature && next.naturePulsePending) {
      const pulse = naturePulse(next, board); const afterPulse = pulse.board; events.push(...pulse.events);
      const groups = findGroups(afterPulse, next.settings.width, next.settings.height + HIDDEN);
      next = { ...next, board: afterPulse, naturePulsePending: false, phase: 'falling' };
      if (groups.length) {
        const cells = [...new Set(groups.flat())].sort((a, b) => a - b);
        next = { ...next, phase: 'clear-mark', clearCells: cells, gravityBoard: null, resolutionTick: 0 };
        events.push({ type: 'match-marked', chain: next.waves.length + 1, cells, ids: cells.map(index => afterPulse[index]!.id), groups });
        return { state: next, events, accepted: true };
      }
      const gravityBoard = compactBoard(afterPulse, next.settings.width, next.settings.height + HIDDEN);
      next = { ...next, gravityBoard, phase: 'gravity' };
    } else next = { ...next, gravityBoard: compactBoard(board, next.settings.width, next.settings.height + HIDDEN) };
  } else if (next.phase === 'gravity' && next.resolutionTick >= 9) {
    const before = next.board; const after = next.gravityBoard ?? next.board; const falling = movedEntries(before, after, next.settings.width);
    next = { ...next, board: after, gravityBoard: null, resolutionTick: 0, phase: 'falling' };
    if (falling.length) events.push({ type: 'cells-fell', cells: falling, before, after });
    const result = startWave(next, next.waves.length + 1); next = result[0]; events.push(...result[1]);
  }
  return { state: next, events, accepted: true };
}
function lockGrounded(state: GameState): Transition {
  return lock(state, rigidLanding(state, state.active!));
}
/** Advances deterministic 60 Hz simulation and resolution; Relaxed and Challenges do not force a falling clock. */
export function advanceTicks(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600) throw new RangeError('ticks must be an integer from 0 to 3600');
  let current = state; const events: GameEvent[] = [];
  for (let i = 0; i < ticks && !['paused', 'won', 'lost', 'finished'].includes(current.phase); i++) {
    current = { ...current, elapsedTicks: current.elapsedTicks + 1 };
    if (current.phase !== 'falling') { const result = advanceResolution(current); current = result.state; events.push(...result.events); continue; }
    if (!current.active || current.settings.mode === 'relaxed' || current.settings.mode === 'challenge') continue;
    const pair = current.active;
    if (grounded(current, pair)) {
      if (!pair.groundedStarted) current = { ...current, active: { ...pair, groundedStarted: true, groundedTicks: 0 } };
      else {
        const groundedTicks = pair.groundedTicks + 1; current = { ...current, active: { ...pair, groundedTicks } };
        if (groundedTicks >= 24) { const result = lockGrounded(current); current = result.state; events.push(...result.events); }
      }
    } else {
      const interval = Math.max(6, Math.round(60 * 0.85 ** (pair.level - 1))); const gravityTicks = pair.gravityTicks + 1;
      if (gravityTicks >= interval) {
        const nextPair = { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 }, gravityTicks: 0 };
        current = { ...current, active: { ...nextPair, ...(grounded(current, nextPair) ? { groundedStarted: false } : {}) } };
        events.push({ type: 'pair-fell', from: pair.pivot, to: nextPair.pivot });
      } else current = { ...current, active: { ...pair, gravityTicks } };
    }
  }
  return { state: current, events, accepted: true };
}
/** Lists only actions accepted by the current game state. */
export function legalActions(state: GameState): readonly Action[] {
  if (state.phase === 'paused') return [{ kind: 'resume' }];
  if (['clear-mark', 'clear-remove', 'gravity'].includes(state.phase)) return [{ kind: 'pause' }];
  if (state.phase !== 'falling' || !state.active) return [];
  const actions: Action[] = [];
  for (const kind of ['left', 'right'] as const) if (moved(state, kind).accepted) actions.push({ kind });
  if (rotate(state, true).accepted) actions.push({ kind: 'rotate-clockwise' });
  if (rotate(state, false).accepted) actions.push({ kind: 'rotate-anticlockwise' });
  actions.push({ kind: 'down' });
  if (state.settings.mode === 'relaxed') actions.push({ kind: 'place' });
  else actions.push({ kind: 'hard-drop' });
  if (state.settings.witness?.[state.completedPairs] && state.witnessIndex === state.completedPairs) actions.push({ kind: 'hint' });
  actions.push({ kind: 'pause' }); return actions;
}
/** Returns the exact independent landing cells for the current rigid pair without consuming random values. */
export function landingCells(state: GameState): Landing | null {
  if (!state.active) return null;
  const pair = rigidLanding(state, state.active); const board = [...state.board];
  for (const [i, cell] of [cellFor(pair, false), cellFor(pair, true)].entries()) board[indexOf(cell.x, cell.y, state.settings.width)] = pair.gems[i]!;
  const settled = compactBoard(board, state.settings.width, state.settings.height + HIDDEN);
  return pair.gems.map(gem => { const index = settled.findIndex(cell => cell?.id === gem.id); return { x: index % state.settings.width, y: Math.floor(index / state.settings.width) - HIDDEN }; }) as unknown as Landing;
}
/** Returns the Shizen hard-drop landing and one-step rebound preview without changing state. */
export function powerDropPreview(state: GameState): PowerDropPreview | null {
  if (!state.settings.nature || state.settings.mode === 'relaxed' || !state.active) return null;
  return rebound(state, state.active)?.preview ?? null;
}
/** Returns score, mode, chain and completion fields derived from state. */
export function statusOf(state: GameState): GameStatus { return { mode: state.settings.mode, phase: state.phase, score: state.score, maxChain: state.maxChain, allClears: state.allClears, completedPairs: state.completedPairs, assisted: state.assisted, ...(state.reason ? { reason: state.reason } : {}) }; }
/** Creates a base challenge state with a previously validated visible board and pair queue. @internal */
export function initialChallengeState(settings: Settings, visibleBoard: readonly (Gem | null)[], queue: readonly (readonly [Colour, Colour])[]): GameState {
  const board: (Gem | null)[] = Array(settings.width * (settings.height + HIDDEN)).fill(null);
  for (let i = 0; i < visibleBoard.length; i++) board[i + settings.width * HIDDEN] = visibleBoard[i]!;
  const maxId = Math.max(0, ...visibleBoard.flatMap(gem => gem ? [gem.id] : []));
  const base: GameState = { game: 'colour-chains', rules: RULES, settings, board: Object.freeze(board), phase: 'falling', active: null, next: Object.freeze(queue.slice(1, 4)), bag: [], randomState: seedState(`colour-chains|${RULES}|${settings.seed}`), nextId: maxId + 1, score: 0, maxChain: 0, allClears: 0, completedPairs: 0, resolutionTick: 0, waves: [], clearCells: [], gravityBoard: null, resolutionHadClear: false, elapsedTicks: 0, assisted: false, witnessIndex: 0, recording: [] };
  const active = makePair(base, queue[0]!); return { ...base, active, nextId: maxId + 3 };
}
/** Creates a deterministic seeded game with one active pair and three previews. */
export function createGame(options: CreateOptions = {}): GameState {
  const valid = normalizeOptions(options); let state: GameState = { game: 'colour-chains', rules: RULES, settings: valid, board: Array(valid.width * (valid.height + HIDDEN)).fill(null), phase: 'falling', active: null, next: [], bag: [], randomState: seedState(`colour-chains|${RULES}|${valid.seed}`), nextId: 1, score: 0, maxChain: 0, allClears: 0, completedPairs: 0, resolutionTick: 0, waves: [], clearCells: [], gravityBoard: null, resolutionHadClear: false, elapsedTicks: 0, assisted: false, witnessIndex: -1, recording: [], ...(valid.weather ? { weatherResolvedPairs: 0 } : {}) };
  const first = drawPair(state); state = { ...state, bag: first[1], randomState: first[2] }; const active = makePair(state, first[0], valid.nature ? magneticFlags(valid.seed, 0, first[0]) : undefined); state = { ...state, active, nextId: 3 };
  const next: (readonly [Colour, Colour])[] = [];
  const nextMagnetic: (readonly [boolean, boolean])[] = [];
  for (let i = 0; i < 3; i++) { const drawn = drawPair(state); next.push(drawn[0]); if (valid.nature) nextMagnetic.push(magneticFlags(valid.seed, i + 1, drawn[0])); state = { ...state, bag: drawn[1], randomState: drawn[2] }; }
  return { ...state, next, ...(valid.nature ? { nextMagnetic } : {}) };
}
