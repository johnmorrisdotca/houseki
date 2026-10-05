import { validateState } from './validation.js';
import { freezeNatureState } from './state.js';
import type { AttractionPairPreview, MagneticPreview, NatureEntity, NatureMove, NatureState, NatureTransition } from './types.js';

const indexOf = (x: number, y: number, width: number): number => y * width + x;
const coordinates = (index: number, width: number): { x: number; y: number } => ({ x: index % width, y: Math.floor(index / width) });
function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.freeze(value); for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child); }
  return value;
}
function visiblePairCandidates(state: NatureState): { a: NatureEntity; b: NatureEntity; aIndex: number; bIndex: number; axis: 'horizontal' | 'vertical'; gap: number }[] {
  const magnets = state.cells.flatMap((entity, index) => entity?.kind === 'stone' && entity.magnetic ? [{ entity, index }] : []);
  const pairs = [];
  for (let i = 0; i < magnets.length; i++) for (let j = i + 1; j < magnets.length; j++) {
    const first = magnets[i]!, second = magnets[j]!; if (first.entity.anchored && second.entity.anchored) continue;
    const p = coordinates(first.index, state.width), q = coordinates(second.index, state.width);
    const axis: 'horizontal' | 'vertical' | null = p.y === q.y ? 'horizontal' : p.x === q.x ? 'vertical' : null;
    if (!axis) continue;
    const distance = Math.abs(p.x - q.x) + Math.abs(p.y - q.y); if (distance <= 1) continue;
    const stepX = Math.sign(q.x - p.x), stepY = Math.sign(q.y - p.y); let clear = true;
    for (let offset = 1; offset < distance; offset++) {
      const x = p.x + stepX * offset, y = p.y + stepY * offset, index = indexOf(x, y, state.width);
      if (!state.activeCells[index] || state.cells[index] !== null) { clear = false; break; }
    }
    if (clear) pairs.push({ a: first.entity, b: second.entity, aIndex: first.index, bIndex: second.index, axis, gap: distance - 1 });
  }
  return pairs.sort((left, right) => left.gap - right.gap || Math.min(left.a.id, left.b.id) - Math.min(right.a.id, right.b.id) || Math.max(left.a.id, left.b.id) - Math.max(right.a.id, right.b.id));
}
function selectDisjoint(state: NatureState): ReturnType<typeof visiblePairCandidates> {
  const used = new Set<number>(); const result = [];
  for (const pair of visiblePairCandidates(state)) if (!used.has(pair.a.id) && !used.has(pair.b.id)) { result.push(pair); used.add(pair.a.id); used.add(pair.b.id); }
  return result;
}
function findIndex(board: readonly (NatureEntity | null)[], id: number): number { return board.findIndex(entity => entity?.id === id); }
function relocate(board: (NatureEntity | null)[], from: number, to: number): boolean {
  const entity = board[from]; if (!entity || board[to] !== null) return false;
  board[to] = entity; board[from] = null; return true;
}
function stepMove(board: (NatureEntity | null)[], state: NatureState, fromIndex: number, toX: number, toY: number): NatureMove | null {
  const entity = board[fromIndex]; const toIndex = indexOf(toX, toY, state.width);
  if (!entity || toX < 0 || toX >= state.width || toY < 0 || toY >= state.height || !state.activeCells[toIndex] || board[toIndex] !== null) return null;
  const from = coordinates(fromIndex, state.width); relocate(board, fromIndex, toIndex);
  return { id: entity.id, from, to: { x: toX, y: toY } };
}
function movePair(board: (NatureEntity | null)[], state: NatureState, pair: ReturnType<typeof selectDisjoint>[number]): AttractionPairPreview {
  const localMoves: NatureMove[] = []; const ids = [pair.a.id, pair.b.id].sort((a, b) => a - b) as [number, number];
  let safety = state.width + state.height;
  while (safety-- > 0) {
    const aIndexCurrent = findIndex(board, pair.a.id), bIndexCurrent = findIndex(board, pair.b.id); if (aIndexCurrent < 0 || bIndexCurrent < 0) break;
    const a = coordinates(aIndexCurrent, state.width), b = coordinates(bIndexCurrent, state.width);
    const distance = Math.abs(a.x - b.x) + Math.abs(a.y - b.y); if (distance <= 1) break;
    const vector = { x: Math.sign(b.x - a.x), y: Math.sign(b.y - a.y) };
    const aEntity = board[aIndexCurrent]!, bEntity = board[bIndexCurrent]!;
    if (aEntity.anchored || bEntity.anchored) {
      const moverIsA = bEntity.anchored;
      const from = moverIsA ? a : b; const toward = moverIsA ? vector : { x: -vector.x, y: -vector.y };
      const move = stepMove(board, state, moverIsA ? aIndexCurrent : bIndexCurrent, from.x + toward.x, from.y + toward.y);
      if (!move) break; localMoves.push(move); continue;
    }
    if (distance === 2) {
      const moverId = Math.min(aEntity.id, bEntity.id); const from = moverId === aEntity.id ? a : b;
      const toward = moverId === aEntity.id ? vector : { x: -vector.x, y: -vector.y };
      const move = stepMove(board, state, findIndex(board, moverId), from.x + toward.x, from.y + toward.y);
      if (!move) break; localMoves.push(move); break;
    }
    const moveA = { from: aIndexCurrent, to: indexOf(a.x + vector.x, a.y + vector.y, state.width), entity: aEntity, x: a.x + vector.x, y: a.y + vector.y };
    const moveB = { from: bIndexCurrent, to: indexOf(b.x - vector.x, b.y - vector.y, state.width), entity: bEntity, x: b.x - vector.x, y: b.y - vector.y };
    if (!state.activeCells[moveA.to] || !state.activeCells[moveB.to] || board[moveA.to] !== null || board[moveB.to] !== null || moveA.to === moveB.to) break;
    board[moveA.to] = moveA.entity; board[moveA.from] = null; board[moveB.to] = moveB.entity; board[moveB.from] = null;
    localMoves.push({ id: moveA.entity.id, from: a, to: { x: moveA.x, y: moveA.y } }, { id: moveB.entity.id, from: b, to: { x: moveB.x, y: moveB.y } });
  }
  const aIndex = findIndex(board, pair.a.id), bIndex = findIndex(board, pair.b.id);
  const a = coordinates(aIndex, state.width), b = coordinates(bIndex, state.width);
  return deepFreeze({ ids, axis: pair.axis, emptyGap: pair.gap, midpoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, ...(pair.a.anchored || pair.b.anchored ? { anchoredId: pair.a.anchored ? pair.a.id : pair.b.id } : {}), moves: localMoves });
}

/** Preview one bounded deterministic attraction pulse without mutating the state. */
export function previewMagneticPulse(state: NatureState): MagneticPreview {
  validateState(state);
  if (!state.rules.magneticEnabled) return deepFreeze({ pairs: [], moves: [], cells: state.cells });
  const board = [...state.cells]; const pairs = selectDisjoint(state).map(pair => movePair(board, state, pair));
  const moves = pairs.flatMap(pair => pair.moves);
  return deepFreeze({ pairs, moves, cells: board });
}

/** Apply one attraction pulse. Disabled nature rules preserve the exact state reference and consume no random state. */
export function applyMagneticPulse(state: NatureState): NatureTransition {
  const preview = previewMagneticPulse(state);
  if (!state.rules.magneticEnabled || preview.moves.length === 0) return { state, accepted: true, events: [], preview };
  const next = freezeNatureState({ ...state, cells: preview.cells });
  return { state: next, accepted: true, events: [deepFreeze({ type: 'magnetic-pulse', pairs: preview.pairs, moves: preview.moves })], preview };
}
