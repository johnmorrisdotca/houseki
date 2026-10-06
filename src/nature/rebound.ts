import { nextNatureUint32 } from './random.js';
import { freezeNatureState } from './state.js';
import { NatureOptionsError, validatePowerDropRequest, validateState } from './validation.js';
import type { HorizontalDirection, NatureEntity, NatureMove, NaturePieceCell, NatureState, NatureTransition, PowerDropPreview, PowerDropRequest, QuarterTurn, ReboundAttemptPreview } from './types.js';

function at(state: NatureState, x: number, y: number): number { return y * state.width + x; }
function freeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) freeze(child);
  }
  return value;
}
function fits(state: NatureState, piece: readonly NaturePieceCell[]): boolean {
  const own = new Set(piece.map(cell => `${cell.x},${cell.y}`));
  if (own.size !== piece.length) return false;
  return piece.every(cell => cell.x >= 0 && cell.x < state.width && cell.y >= 0 && cell.y < state.height && state.activeCells[at(state, cell.x, cell.y)] && state.cells[at(state, cell.x, cell.y)] === null);
}
function translate(piece: readonly NaturePieceCell[], dx: number, dy: number): NaturePieceCell[] {
  return piece.map(cell => ({ ...cell, x: cell.x + dx, y: cell.y + dy }));
}
function turnAroundPivot(piece: readonly NaturePieceCell[], pivotId: number, quarterTurn: QuarterTurn): NaturePieceCell[] {
  if (quarterTurn === 0) return piece.map(cell => ({ ...cell }));
  const pivot = piece.find(cell => cell.id === pivotId)!;
  return piece.map(cell => {
    const dx = cell.x - pivot.x, dy = cell.y - pivot.y;
    return { ...cell, x: pivot.x + (quarterTurn === 1 ? -dy : dy), y: pivot.y + (quarterTurn === 1 ? dx : -dx) };
  });
}
function movesBetween(before: readonly NaturePieceCell[], after: readonly NaturePieceCell[]): NatureMove[] {
  const previous = new Map(before.map(cell => [cell.id, cell]));
  return after.flatMap(cell => {
    const from = previous.get(cell.id)!;
    return from.x === cell.x && from.y === cell.y ? [] : [{ id: cell.id, from: { x: from.x, y: from.y }, to: { x: cell.x, y: cell.y } }];
  });
}
function preferredDirection(state: NatureState, request: PowerDropRequest): readonly [HorizontalDirection, number] {
  if (state.rules.reboundDirectionMode === 'seeded') {
    const [randomState, value] = nextNatureUint32(state.randomState);
    return [value % 2 === 0 ? 'left' : 'right', randomState];
  }
  if (request.lastHorizontalDirection) return [request.lastHorizontalDirection, state.randomState];
  return [state.committedPlacements % 2 === 0 ? 'left' : 'right', state.randomState];
}

/** Preview a single normal landing and, for a power drop, at most one validated one-cell rebound. */
export function previewPowerDrop(state: NatureState, request: PowerDropRequest): PowerDropPreview {
  validateState(state);
  validatePowerDropRequest(state, request);
  let normal = request.piece.map(cell => ({ ...cell }));
  while (true) {
    const lower = translate(normal, 0, 1);
    if (!fits(state, lower)) break;
    normal = lower;
  }
  const eligible = request.power && state.rules.reboundEnabled;
  let randomStateAfter = state.randomState;
  const attempts: ReboundAttemptPreview[] = [];
  let finalCells = normal;
  let selectedDirection: HorizontalDirection | undefined;
  let selectedTurn: QuarterTurn = 0;
  if (eligible) {
    const [first, nextState] = preferredDirection(state, request);
    randomStateAfter = nextState;
    const directions: readonly HorizontalDirection[] = [first, first === 'left' ? 'right' : 'left'];
    const turn = request.quarterTurn ?? 0;
    const rotated = turnAroundPivot(normal, request.pivotId, turn);
    for (const direction of directions) {
      const candidate = translate(rotated, direction === 'left' ? -1 : 1, 0);
      const valid = fits(state, candidate);
      attempts.push({ direction, quarterTurn: turn, valid });
      if (valid) { finalCells = candidate; selectedDirection = direction; selectedTurn = turn; break; }
    }
  }
  return freeze({ normalLanding: normal, attempts, rebound: selectedDirection !== undefined, ...(selectedDirection ? { selectedDirection } : {}), quarterTurn: selectedTurn, finalCells, moves: movesBetween(request.piece, finalCells), randomStateAfter });
}

/** Commit a previewed landing as one immutable operation. A failed preview leaves the original state untouched. */
export function applyPowerDrop(state: NatureState, request: PowerDropRequest): NatureTransition {
  const preview = previewPowerDrop(state, request);
  const cells: (NatureEntity | null)[] = [...state.cells];
  for (const pieceCell of preview.finalCells) {
    const index = at(state, pieceCell.x, pieceCell.y);
    if (cells[index] !== null) throw new NatureOptionsError('piece-collision', 'Power-drop destination is occupied');
    cells[index] = { id: pieceCell.id, kind: 'stone', colour: pieceCell.colour!, ...(pieceCell.magnetic ? { magnetic: true } : {}), ...(pieceCell.anchored ? { anchored: true } : {}) };
  }
  const maxId = preview.finalCells.reduce((maximum, cell) => Math.max(maximum, cell.id), 0);
  const next = freezeNatureState({ ...state, cells, randomState: preview.randomStateAfter, nextId: Math.max(state.nextId, maxId + 1), committedPlacements: state.committedPlacements + 1 });
  const event = freeze({ type: 'power-drop-landed' as const, power: request.power, rebound: preview.rebound, ...(preview.selectedDirection ? { direction: preview.selectedDirection } : {}), quarterTurn: preview.quarterTurn, moves: preview.moves, ids: preview.finalCells.map(cell => cell.id) });
  return { state: next, accepted: true, events: [event], preview };
}
