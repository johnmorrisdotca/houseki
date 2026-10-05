import { compactBoard, findMatches } from './match.js';
import { drawBag, nextInt, seedState } from './random.js';
import type { Action, ChallengeOptions, Colour, CreateOptions, GameEvent, GameState, Gem, Mode, Piece, Settings, Transition, Triplet } from './types.js';
const PRESETS = { compact: [5, 13], extraWide: [12, 13], narrow: [6, 13], standard: [8, 13], wide: [10, 13], tall: [8, 17] } as const;
const RULES = 'triplets-1' as const;
const HIDDEN = 3;
const emptyTransition = (state: GameState, reason: string): Transition => ({ state, events: [], accepted: false, reason });
const addr = (x: number, y: number, width: number): number => (y + HIDDEN) * width + x;
interface Drawn { readonly colours: readonly [Colour, Colour, Colour]; readonly bag: readonly Colour[]; readonly randomState: number }
function drawTriplet(state: Pick<GameState, 'bag' | 'randomState' | 'settings'>): Drawn {
  let bag = state.bag; let randomState = state.randomState; const colours: Colour[] = [];
  for (let i = 0; i < 3; i++) { [bag, randomState] = drawBag(bag, randomState, state.settings.colourCount); colours.push(bag[bag.length - 1]!); bag = bag.slice(0, -1); }
  return { colours: colours as unknown as readonly [Colour, Colour, Colour], bag, randomState };
}
function makeGem(state: Pick<GameState, 'nextId'>, colour: Colour, target = false): Gem { return { id: state.nextId, colour, ...(target ? { target: true } : {}) }; }
function activeFromColours(state: GameState, colours: readonly [Colour, Colour, Colour], y = -3): Piece {
  return { gems: colours.map((colour, i) => makeGem({ nextId: state.nextId + i }, colour)) as unknown as Piece['gems'], x: Math.floor((state.settings.width - 1) / 2), y, orientation: 0, level: state.settings.mode === 'arcade' || state.settings.mode === 'daily' ? 1 + Math.floor(state.completedPieces / 30) : 1, descent: 0, lockTicks: 0, lockResets: 0, lockStarted: false };
}
function occupied(state: GameState, piece: Piece, x = piece.x, y = piece.y): boolean {
  return piece.gems.some((_, i) => { const cy = y + i; return x < 0 || x >= state.settings.width || cy < -HIDDEN || cy >= state.settings.height || state.board[addr(x, cy, state.settings.width)] !== null; });
}
/** Returns the exact landing row for the current rigid triplet. */
export function landingY(state: GameState): number | null {
  if (!state.active) return null; let y = state.active.y;
  while (!occupied(state, state.active, state.active.x, y + 1)) y++;
  return y;
}
function advanceBag(state: GameState): readonly [readonly Colour[], number, readonly (readonly [Colour, Colour, Colour])[]] {
  let bag = state.bag, randomState = state.randomState; const next: (readonly [Colour, Colour, Colour])[] = [];
  for (let p = 0; p < 3; p++) { const draw = drawTriplet({ bag, randomState, settings: state.settings }); bag = draw.bag; randomState = draw.randomState; next.push(draw.colours); }
  return [bag, randomState, next];
}
/** Creates a deterministic empty game with an active piece and three-piece preview. */
export function createGame(options: CreateOptions = {}): GameState {
  if (options.preset !== undefined && !Object.hasOwn(PRESETS, options.preset)) throw new RangeError('Unsupported board preset');
  const preset = PRESETS[options.preset ?? (options.mode === 'daily' ? 'narrow' : 'standard')]; const width = options.width ?? preset[0]; const height = options.height ?? preset[1];
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 5 || width > 12 || height < 12 || height > 20 || width * height > 240) throw new RangeError('Board must be 5–12 columns by 12–20 visible rows, with at most 240 cells');
  const requestedMode = (options as { mode?: string }).mode ?? 'relaxed'; if (!['relaxed', 'arcade', 'daily', 'challenge'].includes(requestedMode)) throw new RangeError('Unsupported mode');
  if (requestedMode === 'challenge') throw new RangeError('Use createChallenge with a validated starting board and finite queue');
  const mode = requestedMode as Exclude<Mode, 'challenge'>;
  const seed = options.seed ?? 'houseki-falling-triplets';
  if (typeof seed !== 'string' || seed.length < 1 || seed.length > 128) throw new RangeError('Seed must contain 1–128 characters');
  if (mode === 'daily') {
    const timestamp = /^\d{4}-\d{2}-\d{2}$/.test(seed) ? Date.parse(`${seed}T00:00:00Z`) : Number.NaN;
    if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== seed) throw new RangeError('Daily seed must be a UTC YYYY-MM-DD date supplied by the host');
  }
  if (mode === 'daily' && (width !== 6 || height !== 13 || (options.colourCount ?? 5) !== 5 || (options.pieceLimit !== undefined && options.pieceLimit !== 60))) throw new RangeError('Daily uses the fixed 6×13 well, five colours, and 60 pieces');
  const colourCount = options.colourCount ?? 5; const pieceLimit = mode === 'daily' ? 60 : options.pieceLimit;
  if (pieceLimit !== undefined && (!Number.isInteger(pieceLimit) || pieceLimit < 1 || pieceLimit > 60)) throw new RangeError('Piece limit must be an integer from 1 to 60');
  const settings: Settings = { mode, width, height, colourCount, seed, ...(pieceLimit === undefined ? {} : { pieceLimit }) };
  if (![4, 5, 6].includes(settings.colourCount)) throw new RangeError('Colour count must be 4, 5, or 6');
  let randomState = seedState(`falling-triplets|${RULES}|${seed}`); const initial: GameState = { game: 'falling-triplets', rules: RULES, settings, board: Array(width * (height + HIDDEN)).fill(null), phase: 'falling', active: null, next: [], bag: [], randomState, nextId: 1, score: 0, maxChain: 0, completedPieces: 0, elapsedTicks: 0, pieceTicks: 0, resolutionTick: 0, waves: [], assisted: false, hintsUsed: 0, witnessPathMatches: true, recording: [] };
  const first = drawTriplet(initial); let state: GameState = { ...initial, bag: first.bag, randomState: first.randomState, hintsUsed: 0 };
  const preview = advanceBag(state); state = { ...state, bag: preview[0], randomState: preview[1], active: activeFromColours(state, first.colours), next: preview[2], nextId: 4 };
  return state;
}
const VALID_COLOURS = new Set(['red', 'blue', 'green', 'gold', 'purple', 'teal']);
/** Creates a challenge after validating its authored board, finite queue, goal, and witness. */
export function createChallenge(options: ChallengeOptions): GameState {
  const width = options.width ?? 6; const height = options.height ?? 13; const colourCount = options.colourCount ?? 5;
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 5 || width > 12 || height < 12 || height > 20 || width * height > 240) throw new RangeError('Board must be 5–12 columns by 12–20 visible rows, with at most 240 cells');
  if (![4, 5, 6].includes(colourCount)) throw new RangeError('Colour count must be 4, 5, or 6');
  const seed = options.seed ?? 'houseki-challenge'; if (typeof seed !== 'string' || seed.length < 1 || seed.length > 128) throw new RangeError('Challenge seed must contain 1–128 characters');
  if (!Array.isArray(options.board) || options.board.length !== width * height) throw new RangeError('Challenge board must contain exactly width × height visible cells');
  if (!Array.isArray(options.queue) || options.queue.length < 2 || options.queue.length > 12) throw new RangeError('Challenge queue must contain 2–12 triplets');
  const colours = ['red', 'blue', 'green', 'gold', 'purple', 'teal'].slice(0, colourCount);
  const ids = new Set<number>(); let maxId = 0; const cleanBoard: (Gem | null)[] = [];
  for (let i = 0; i < options.board.length; i++) {
    const cell = options.board[i];
    if (cell === null) { cleanBoard.push(null); continue; }
    if (!cell || typeof cell !== 'object' || !Number.isSafeInteger(cell.id) || cell.id < 1 || cell.id > 1_000_000_000 || ids.has(cell.id) || !VALID_COLOURS.has(cell.colour) || !colours.includes(cell.colour) || (cell.target !== undefined && typeof cell.target !== 'boolean')) throw new TypeError(`Invalid challenge gem at cell ${i}`);
    if (Object.keys(cell).some(key => !['id', 'colour', 'target'].includes(key))) throw new TypeError(`Unexpected challenge gem field at cell ${i}`);
    ids.add(cell.id); maxId = Math.max(maxId, cell.id); cleanBoard.push({ id: cell.id, colour: cell.colour, ...(cell.target ? { target: true } : {}) });
  }
  for (let x = 0; x < width; x++) { let gap = false; for (let y = height - 1; y >= 0; y--) { if (cleanBoard[y * width + x] === null) gap = true; else if (gap) throw new RangeError(`Challenge board is unstable in column ${x}`); } }
  const queue: Triplet[] = options.queue.map((triplet, index) => {
    if (!Array.isArray(triplet) || triplet.length !== 3 || triplet.some(colour => !colours.includes(colour))) throw new TypeError(`Invalid challenge triplet ${index}`);
    return [...triplet] as unknown as Triplet;
  });
  if (!options.goal || typeof options.goal !== 'object' || !['targets', 'chain', 'empty'].includes(options.goal.type)) throw new TypeError('Invalid challenge goal');
  let goal: Settings['goal']; let targetIds: readonly number[] | undefined; let minimumChain: number | undefined;
  if (options.goal.type === 'targets') {
    const raw = options.goal as { type: string; targetIds?: unknown }; const targetSet = raw.targetIds;
    if (Object.keys(raw).some(key => !['type', 'targetIds'].includes(key)) || !Array.isArray(targetSet) || !targetSet.length || targetSet.length > cleanBoard.length || targetSet.some(id => !Number.isSafeInteger(id) || !ids.has(id)) || new Set(targetSet).size !== targetSet.length) throw new TypeError('Target goal must reference unique starting gem IDs');
    targetIds = [...targetSet as number[]]; goal = 'targets';
    const marked = cleanBoard.filter((gem): gem is Gem => gem !== null && gem.target === true).map(gem => gem.id).sort((a, b) => a - b);
    if (stable(marked) !== stable([...targetIds].sort((a, b) => a - b))) throw new TypeError('Target flags must exactly match the target goal IDs');
  } else if (options.goal.type === 'chain') {
    const raw = options.goal as { type: string; minimumChain?: unknown };
    const value = raw.minimumChain;
    if (Object.keys(raw).some(key => !['type', 'minimumChain'].includes(key)) || typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 12) throw new RangeError('Minimum chain must be an integer from 1 to 12');
    minimumChain = value; goal = 'chain';
  } else { if (Object.keys(options.goal).some(key => key !== 'type')) throw new TypeError('Unexpected empty-goal field'); goal = 'empty'; }
  if (options.witness !== undefined && (!Array.isArray(options.witness) || options.witness.length > queue.length || options.witness.some(hint => !hint || !Number.isInteger(hint.x) || hint.x < 0 || hint.x >= width || ![0, 1, 2].includes(hint.orientation) || Object.keys(hint).some(key => !['x', 'orientation'].includes(key))))) throw new TypeError('Invalid challenge witness');
  const internalBoard = Array(width * (height + HIDDEN)).fill(null) as (Gem | null)[];
  for (let i = 0; i < cleanBoard.length; i++) internalBoard[i + width * HIDDEN] = cleanBoard[i]!;
  const settings: Settings = { mode: 'challenge', width, height, colourCount: colourCount as 4 | 5 | 6, seed, goal, challengeBoard: cleanBoard, challengeQueue: queue, ...(targetIds ? { targetIds } : {}), ...(minimumChain ? { minimumChain } : {}), ...(options.witness ? { witness: options.witness.map(hint => ({ ...hint })) } : {}) };
  const base: GameState = { game: 'falling-triplets', rules: RULES, settings, board: internalBoard, phase: 'falling', active: null, next: [], bag: [], randomState: seedState(`falling-triplets|${RULES}|${seed}`), nextId: maxId + 1, score: 0, maxChain: 0, completedPieces: 0, elapsedTicks: 0, pieceTicks: 0, resolutionTick: 0, waves: [], assisted: false, hintsUsed: 0, witnessPathMatches: true, challengeIndex: 0, recording: [] };
  const firstPieceBase = activeFromColours(base, queue[0]!);
  const active = { ...firstPieceBase, gems: firstPieceBase.gems.map((gem, i) => ({ ...gem, id: maxId + 1 + i })) as unknown as Piece['gems'] };
  const state: GameState = { ...base, settings, board: internalBoard, active, next: queue.slice(1, 4), bag: [], nextId: maxId + 4, hintsUsed: 0, challengeIndex: 0, assisted: false };
  if (occupied(state, active)) throw new RangeError('Challenge starting board blocks the first queued triplet');
  if (options.witness) {
    if (options.witness.length === 0) throw new TypeError('A supplied witness must contain a complete legal solution');
    let proof = state; let proofTicks = 0;
    for (const step of options.witness) {
      if (proof.phase !== 'falling' || !proof.active) break;
      while (proof.active!.x !== step.x) { const action: Action = { kind: step.x < proof.active!.x ? 'left' : 'right' }; const result = applyActionCore(proof, action); if (!result.accepted) throw new TypeError('Challenge witness contains a blocked placement'); proof = result.state; }
      const turns = (step.orientation - proof.active!.orientation + 3) % 3;
      for (let i = 0; i < turns; i++) { const result = applyActionCore(proof, { kind: 'cycle-forward' }); if (!result.accepted) throw new TypeError('Challenge witness contains an illegal cycle'); proof = result.state; }
      const placed = applyActionCore(proof, { kind: 'hard-drop' }); if (!placed.accepted) throw new TypeError('Challenge witness contains an illegal placement'); proof = placed.state;
      while (['clear-mark', 'clear-remove', 'gravity'].includes(proof.phase) && proofTicks < 100_000) { proof = advanceTicks(proof, 1).state; proofTicks++; }
      if (['lost', 'finished'].includes(proof.phase)) throw new TypeError('Challenge witness ends before its goal is achieved');
      if (proof.phase === 'won') break;
    }
    if (proof.phase !== 'won') throw new TypeError('Challenge witness does not solve its goal within the finite queue');
  }
  return state;
}
function waveCells(state: GameState): readonly number[] { return [...new Set(findMatches(state.board, state.settings.width, state.settings.height + HIDDEN).flatMap(match => match.cells))].sort((a, b) => a - b); }
function spawnOrEnd(state: GameState): readonly [GameState, readonly GameEvent[]] {
  const board = state.board; const targetIds = state.settings.targetIds ?? []; let phase: GameState['phase'] = 'falling'; let reason: string | undefined;
  if (state.settings.mode === 'challenge' && state.settings.goal === 'targets' && targetIds.length > 0 && targetIds.every(id => !board.some(g => g?.id === id))) phase = 'won';
  else if (state.settings.mode === 'challenge' && state.settings.goal === 'chain' && state.maxChain >= (state.settings.minimumChain ?? 1)) phase = 'won';
  else if (state.settings.mode === 'challenge' && state.settings.goal === 'empty' && board.every(g => g === null)) phase = 'won';
  else if (board.slice(0, state.settings.width * HIDDEN).some(g => g !== null)) { phase = 'lost'; reason = 'top-out'; }
  else if (state.settings.pieceLimit !== undefined && state.completedPieces >= state.settings.pieceLimit) phase = state.settings.mode === 'daily' ? 'finished' : 'lost';
  if (phase !== 'falling') return [{ ...state, phase, active: null, ...(reason ? { reason } : {}) }, [{ type: 'run-ended', reason: reason ?? phase }]];
  if (state.settings.mode === 'challenge') {
    const queue = state.settings.challengeQueue!; const index = (state.challengeIndex ?? 0) + 1;
    if (index >= queue.length) return [{ ...state, phase: 'lost', active: null, next: [], reason: 'challenge-queue-exhausted' }, [{ type: 'run-ended', reason: 'challenge-queue-exhausted' }]];
    const colours = queue[index]!; const base = activeFromColours(state, colours); const active = { ...base, gems: base.gems.map((gem, i) => ({ ...gem, id: state.nextId + i })) as unknown as Piece['gems'] };
    const next = { ...state, active, challengeIndex: index, nextId: state.nextId + 3, next: queue.slice(index + 1, index + 4) };
    if (occupied(next, active)) return [{ ...next, phase: 'lost', active: null, reason: 'spawn-collision' }, [{ type: 'run-ended', reason: 'spawn-collision' }]];
    return [next, [{ type: 'piece-spawned', ids: active.gems.map(g => g.id) }]];
  }
  const queue = [...state.next]; const colours = queue.shift()!; const draw = drawTriplet(state); queue.push(draw.colours);
  const base = activeFromColours(state, colours); const active = { ...base, gems: base.gems.map((gem, i) => ({ ...gem, id: state.nextId + i })) as unknown as Piece['gems'] };
  let next: GameState = { ...state, active, nextId: state.nextId + 3, next: queue, bag: draw.bag, randomState: draw.randomState };
  if (occupied(next, active)) next = { ...next, phase: 'lost', active: null, reason: 'spawn-collision' };
  return [next, [{ type: next.phase === 'lost' ? 'run-ended' : 'piece-spawned', ...(next.phase === 'lost' ? { reason: 'spawn-collision' } : { ids: active.gems.map(g => g.id) }) }]];
}
function beginWave(state: GameState, chain: number, level: number): readonly [GameState, readonly GameEvent[]] {
  const cells = waveCells(state);
  if (!cells.length) return spawnOrEnd({ ...state, phase: 'falling', active: null, pendingClear: undefined, resolutionChain: undefined, resolutionLevel: undefined, resolutionTick: 0 });
  const ids = cells.map(cell => state.board[cell]!.id);
  return [{ ...state, phase: 'clear-mark', active: null, pendingClear: cells, resolutionChain: chain, resolutionLevel: level, resolutionTick: 0 }, [{ type: 'match-marked', chain, cells, ids }]];
}
function lock(state: GameState): Transition {
  const piece = state.active!; const placed = [...state.board];
  for (let i = 0; i < 3; i++) { const y = piece.y + i; const at = addr(piece.x, y, state.settings.width); if (y < -HIDDEN || y >= state.settings.height || placed[at] !== null) return { state: { ...state, phase: 'lost', active: null, reason: 'spawn-collision' }, events: [{ type: 'run-ended', reason: 'spawn-collision' }], accepted: true }; placed[at] = piece.gems[i]!; }
  const board = compactBoard(placed, state.settings.width, state.settings.height + HIDDEN);
  const witnessStep = state.settings.witness?.[state.completedPieces];
  const witnessPathMatches = state.witnessPathMatches && (!witnessStep || (witnessStep.x === piece.x && witnessStep.orientation === piece.orientation));
  const next = { ...state, board, active: null, completedPieces: state.completedPieces + 1, witnessPathMatches, pieceTicks: 0, waves: [], resolutionTick: 0 };
  const [resolved, events] = beginWave(next, 1, piece.level);
  return { state: resolved, events: [{ type: 'piece-locked', x: piece.x, y: piece.y, ids: piece.gems.map(g => g.id) }, ...events], accepted: true };
}
function advanceResolution(state: GameState): Transition {
  let next = { ...state, resolutionTick: state.resolutionTick + 1 }; const events: GameEvent[] = [];
  if (next.phase === 'clear-mark' && next.resolutionTick >= 7) next = { ...next, phase: 'clear-remove', resolutionTick: 0 };
  else if (next.phase === 'clear-remove' && next.resolutionTick >= 6) {
    const cells = new Set(next.pendingClear ?? []); const ids = [...cells].map(index => next.board[index]!.id); const chain = next.resolutionChain ?? 1; const points = 10 * cells.size * (next.resolutionLevel ?? 1) * chain;
    const board = next.board.map((gem, index) => cells.has(index) ? null : gem);
    const gravityBoard = compactBoard(board, next.settings.width, next.settings.height + HIDDEN);
    const moved = gravityBoard.flatMap((gem, index) => gem && board.findIndex(old => old?.id === gem.id) !== index ? [{ id: gem.id, from: board.findIndex(old => old?.id === gem.id), to: index }] : []);
    const wave = { clearedIds: ids, cells: [...cells], chain, points }; const waves = [...next.waves, wave]; const score = next.score + points;
    next = { ...next, board, gravityBoard, score, waves, maxChain: Math.max(next.maxChain, chain), phase: 'gravity', pendingClear: undefined, resolutionTick: 0 };
    events.push({ type: 'cells-cleared', chain, cells: [...cells], ids, points }, { type: 'score-changed', score, points });
    if (!moved.length) events.push({ type: 'gravity-started', cells: [] });
  } else if (next.phase === 'gravity' && next.resolutionTick >= 9) {
    const settled = next.gravityBoard ?? next.board;
    const moved = settled.flatMap((gem, index) => gem && next.board.findIndex(old => old?.id === gem.id) !== index ? [{ id: gem.id, from: next.board.findIndex(old => old?.id === gem.id), to: index }] : []);
    if (moved.length) events.push({ type: 'cells-fell', gems: moved });
    const result = beginWave({ ...next, board: settled, gravityBoard: undefined, resolutionTick: 0, phase: 'falling' }, (next.resolutionChain ?? next.waves.at(-1)?.chain ?? 1) + 1, next.resolutionLevel ?? 1);
    next = result[0]; events.push(...result[1]);
  }
  return { state: next, events, accepted: true };
}
/** Applies one immutable game action. Rejected actions preserve the original state reference. */
function applyActionCore(state: GameState, action: Action): Transition {
  if (action.kind === 'pause') { if (!['falling', 'clear-mark', 'clear-remove', 'gravity'].includes(state.phase)) return emptyTransition(state, 'cannot-pause'); return { state: { ...state, phase: 'paused', pausedPhase: state.phase, assisted: state.assisted || state.settings.mode === 'daily' }, events: [{ type: 'paused' }], accepted: true }; }
  if (action.kind === 'resume') { if (state.phase !== 'paused') return emptyTransition(state, 'not-paused'); const { pausedPhase, ...rest } = state; return { state: { ...rest, phase: pausedPhase ?? 'falling' }, events: [{ type: 'resumed' }], accepted: true }; }
  if (action.kind === 'hint') {
    if (state.settings.mode !== 'challenge' || state.phase !== 'falling' || !state.active) return emptyTransition(state, 'hint-only-in-active-challenge');
    const hint = state.settings.witness?.[state.completedPieces]; if (!hint || !state.witnessPathMatches) return emptyTransition(state, 'no-witness-hint-available');
    return { state: { ...state, assisted: true, hintsUsed: state.hintsUsed + 1 }, events: [{ type: 'hint-shown', piece: state.completedPieces, ...hint }], accepted: true };
  }
  if (state.phase !== 'falling' || !state.active) return emptyTransition(state, 'not-falling');
  const piece = state.active;
  if (action.kind === 'cycle-forward' || action.kind === 'cycle-backward') {
    const [a, b, c] = piece.gems; const gems = action.kind === 'cycle-forward' ? [c, a, b] : [b, c, a]; const orientation = ((piece.orientation + (action.kind === 'cycle-forward' ? 1 : 2)) % 3) as Piece['orientation'];
    const grounded = occupied(state, piece, piece.x, piece.y + 1); const reset = grounded && piece.lockResets < 8;
    return { state: { ...state, active: { ...piece, gems: gems as unknown as Piece['gems'], orientation, lockTicks: reset ? 0 : piece.lockTicks, lockResets: piece.lockResets + (reset ? 1 : 0), lockStarted: piece.lockStarted || grounded } }, events: [{ type: 'colours-cycled', direction: action.kind === 'cycle-forward' ? 'forward' : 'backward' }], accepted: true };
  }
  if (action.kind === 'left' || action.kind === 'right') {
    const x = piece.x + (action.kind === 'left' ? -1 : 1); if (occupied(state, piece, x)) return emptyTransition(state, 'blocked');
    const wasGrounded = occupied(state, piece, piece.x, piece.y + 1); const reset = wasGrounded && piece.lockResets < 8;
    const isAirborne = !occupied(state, piece, x, piece.y + 1);
    const leavingWithReset = wasGrounded && reset; const lockTicks = leavingWithReset || (isAirborne && piece.lockResets < 8) ? 0 : piece.lockTicks;
    return { state: { ...state, active: { ...piece, x, lockTicks, lockStarted: isAirborne ? (piece.lockResets >= 8 ? piece.lockStarted : false) : true, lockResets: piece.lockResets + (reset ? 1 : 0) } }, events: [{ type: 'piece-moved', x, y: piece.y }], accepted: true };
  }
  if (action.kind === 'tick') return advanceTicks(state, 1);
  if (action.kind === 'soft-drop') {
    if (state.settings.mode === 'relaxed') return emptyTransition(state, 'soft-drop-disabled');
    if (occupied(state, piece, piece.x, piece.y + 1)) return { state: { ...state, active: piece }, events: [], accepted: true };
    const resetsAvailable = piece.lockResets < 8; const y = piece.y + 1; const becameGrounded = occupied(state, piece, piece.x, y + 1);
    return { state: { ...state, active: { ...piece, y, descent: 0, lockTicks: resetsAvailable ? 0 : piece.lockTicks, lockStarted: becameGrounded ? false : resetsAvailable ? false : piece.lockStarted }, score: state.score + 1 }, events: [{ type: 'piece-moved', x: piece.x, y }, { type: 'score-changed', score: state.score + 1, points: 1 }], accepted: true };
  }
  if (action.kind === 'place' || action.kind === 'hard-drop') {
    if (action.kind === 'place' && state.settings.mode !== 'relaxed') return emptyTransition(state, 'place-only-in-relaxed');
    if (action.kind === 'hard-drop' && state.settings.mode === 'relaxed') return emptyTransition(state, 'use-place-in-relaxed');
    let y = piece.y; while (!occupied(state, piece, piece.x, y + 1)) y++;
    const distance = y - piece.y; const points = action.kind === 'hard-drop' ? distance * 2 : 0;
    const result = lock({ ...state, active: { ...piece, y }, score: state.score + points });
    return points ? { ...result, events: [{ type: 'score-changed', score: state.score + points, points }, ...result.events] } : result;
  }
  return emptyTransition(state, 'unsupported-action');
}
/** Applies and records one immutable action; rejected actions preserve state identity. */
export function applyAction(state: GameState, action: Action): Transition {
  const result = applyActionCore(state, action);
  if (!result.accepted || action.kind === 'tick') return result;
  const last = state.recording.at(-1); const ordinal = last?.tick === state.elapsedTicks ? last.ordinal + 1 : 0;
  return { ...result, state: { ...result.state, recording: [...state.recording, { tick: state.elapsedTicks, ordinal, action }] } };
}
/** Advances fixed 60 Hz game ticks. Arcade timing is applied to the active piece. */
export function advanceTicks(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600) throw new RangeError('ticks must be an integer from 0 to 3600');
  let current = state; const events: GameEvent[] = [];
  for (let i = 0; i < ticks && !['paused', 'won', 'lost', 'finished'].includes(current.phase); i++) {
    if (current.phase !== 'falling') { const result = advanceResolution(current); current = { ...result.state, elapsedTicks: result.state.elapsedTicks + 1 }; events.push(...result.events); continue; }
    if (!current.active) break;
    const active = current.active;
    current = { ...current, elapsedTicks: current.elapsedTicks + 1, pieceTicks: current.pieceTicks + 1 };
    if (current.settings.mode === 'relaxed') continue;
    const level = active.level; const interval = Math.max(6, Math.round(60 * 0.85 ** (level - 1)));
    const grounded = occupied(current, active, active.x, active.y + 1);
    if (grounded) {
      const lockStarted = active.lockStarted; const lockTicks = lockStarted ? active.lockTicks + 1 : 0;
      current = { ...current, active: { ...active, lockStarted: true, lockTicks } };
      if (lockTicks >= 24) { const result = lock(current); current = result.state; events.push(...result.events); }
    }
    else if (active.descent + 1 >= interval) {
      const y = active.y + 1; const becomesGrounded = occupied(current, active, active.x, y + 1);
      current = { ...current, active: { ...active, y, descent: 0, lockTicks: active.lockResets < 8 && !becomesGrounded ? 0 : active.lockTicks, lockStarted: becomesGrounded && active.lockResets < 8 ? true : active.lockResets < 8 ? false : active.lockStarted } };
    }
    else current = { ...current, active: { ...active, descent: active.descent + 1, lockTicks: active.lockResets < 8 ? 0 : active.lockTicks, lockStarted: active.lockResets < 8 ? false : active.lockStarted } };
  }
  return { state: current, events, accepted: true };
}
/** Lists the core actions currently available to the player. */
export function legalActions(state: GameState): readonly Action[] {
  if (state.phase === 'paused') return [{ kind: 'resume' }];
  if (['clear-mark', 'clear-remove', 'gravity'].includes(state.phase)) return [{ kind: 'pause' }];
  if (state.phase !== 'falling' || !state.active) return [];
  const piece = state.active; const actions: Action[] = [];
  if (!occupied(state, piece, piece.x - 1)) actions.push({ kind: 'left' }); if (!occupied(state, piece, piece.x + 1)) actions.push({ kind: 'right' });
  actions.push({ kind: 'cycle-forward' }, { kind: 'cycle-backward' });
  if (state.settings.mode === 'relaxed') actions.push({ kind: 'place' }); else actions.push({ kind: 'soft-drop' }, { kind: 'hard-drop' });
  if (state.settings.mode === 'challenge' && state.witnessPathMatches && state.settings.witness?.[state.completedPieces]) actions.push({ kind: 'hint' });
  actions.push({ kind: 'pause' });
  return actions;
}
/** Returns a plain status summary suitable for UI labels. */
export function statusOf(state: GameState): Readonly<{ phase: GameState['phase']; score: number; maxChain: number; reason?: string }> { return { phase: state.phase, score: state.score, maxChain: state.maxChain, ...(state.reason ? { reason: state.reason } : {}) }; }
/** Recreates the same authored mode, seed, and challenge configuration from its original setup. */
export function restartGame(state: GameState): GameState {
  if (state.settings.mode === 'challenge') {
    const settings = state.settings;
    const goal = settings.goal === 'targets' ? { type: 'targets' as const, targetIds: settings.targetIds ?? [] } : settings.goal === 'chain' ? { type: 'chain' as const, minimumChain: settings.minimumChain ?? 1 } : { type: 'empty' as const };
    return createChallenge({ seed: settings.seed, width: settings.width, height: settings.height, colourCount: settings.colourCount, board: settings.challengeBoard ?? [], queue: settings.challengeQueue ?? [], goal, ...(settings.witness ? { witness: settings.witness } : {}) });
  }
  return createGame({ mode: state.settings.mode, seed: state.settings.seed, width: state.settings.width, height: state.settings.height, colourCount: state.settings.colourCount, ...(state.settings.pieceLimit === undefined ? {} : { pieceLimit: state.settings.pieceLimit }) });
}
/** Encodes the authoritative settings, action recording, and derived checkpoint. */
export function encodeGame(state: GameState): string { return JSON.stringify({ format: 1, game: state.game, rules: state.rules, settings: state.settings, actions: state.recording, elapsedTicks: state.elapsedTicks, checkpoint: state }); }
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).filter(([, item]) => item !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(',')}}`;
  return JSON.stringify(value) ?? 'null';
}
/** Replays and validates a bounded save, then verifies its checkpoint against the derived state. */
export function decodeGame(text: string): GameState {
  if (text.length > 2 * 1024 * 1024) throw new RangeError('Save exceeds 2 MiB');
  const value = JSON.parse(text) as { format?: number; game?: string; rules?: string; settings?: Settings; actions?: unknown[]; elapsedTicks?: number; checkpoint?: GameState };
  if (value.format !== 1 || value.game !== 'falling-triplets' || value.rules !== RULES || !value.settings || !Array.isArray(value.actions) || !value.checkpoint) throw new TypeError('Unsupported or invalid Falling Triplets save');
  if (value.actions.length > 10_000 || !Number.isInteger(value.elapsedTicks) || value.elapsedTicks! < 0 || value.elapsedTicks! > 600_000) throw new RangeError('Save exceeds replay limits');
  const s = value.settings;
  let state: GameState;
  if (s.mode === 'challenge') {
    const goal = s.goal === 'targets' ? { type: 'targets' as const, targetIds: s.targetIds ?? [] } : s.goal === 'chain' ? { type: 'chain' as const, minimumChain: s.minimumChain ?? 1 } : s.goal === 'empty' ? { type: 'empty' as const } : null;
    if (!goal) throw new TypeError('Invalid challenge goal in save');
    state = createChallenge({ seed: s.seed, width: s.width, height: s.height, colourCount: s.colourCount, board: s.challengeBoard ?? [], queue: s.challengeQueue ?? [], goal, ...(s.witness ? { witness: s.witness } : {}) });
  } else state = createGame({ mode: s.mode, seed: s.seed, width: s.width, height: s.height, colourCount: s.colourCount, ...(s.pieceLimit === undefined ? {} : { pieceLimit: s.pieceLimit }) });
  if (stable(state.settings) !== stable(s)) throw new TypeError('Save settings are not canonical');
  let previousTick = 0; let previousOrdinal = -1; const replayRecording: GameState['recording'][number][] = [];
  for (const raw of value.actions) {
    if (!raw || typeof raw !== 'object') throw new TypeError('Invalid recorded action');
    const item = raw as { tick?: number; ordinal?: number; action?: Action };
    if (!Number.isInteger(item.tick) || item.tick! < previousTick || item.tick! > value.elapsedTicks! || !Number.isInteger(item.ordinal) || !item.action || Object.keys(item.action).some(key => key !== 'kind') || !['left', 'right', 'soft-drop', 'hard-drop', 'place', 'cycle-forward', 'cycle-backward', 'pause', 'resume', 'hint'].includes(item.action.kind)) throw new TypeError('Invalid recorded action fields');
    const expectedOrdinal = item.tick === previousTick ? previousOrdinal + 1 : 0; if (item.ordinal !== expectedOrdinal) throw new TypeError('Invalid action order');
    while (item.tick! > state.elapsedTicks) { const prior = state.elapsedTicks; state = advanceTicks(state, Math.min(3600, item.tick! - state.elapsedTicks)).state; if (state.elapsedTicks === prior) throw new TypeError('Recorded action occurs after the run ended'); }
    const result = applyActionCore(state, item.action); if (!result.accepted) throw new TypeError(`Illegal recorded action at tick ${item.tick}: ${result.reason ?? 'rejected'}`);
    state = result.state; replayRecording.push({ tick: item.tick!, ordinal: item.ordinal!, action: item.action });
    previousTick = item.tick!; previousOrdinal = item.ordinal!;
  }
  while (state.elapsedTicks < value.elapsedTicks!) { const prior = state.elapsedTicks; state = advanceTicks(state, Math.min(3600, value.elapsedTicks! - state.elapsedTicks)).state; if (state.elapsedTicks === prior) throw new TypeError('Checkpoint elapsed time exceeds the run clock'); }
  state = { ...state, recording: replayRecording };
  if (stable(state) !== stable(value.checkpoint)) throw new TypeError('Save checkpoint does not match its action recording');
  return state;
}
