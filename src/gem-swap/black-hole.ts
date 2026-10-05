import { neighbors } from './board.js';
import type { BlackHolePortal, GameState } from './types.js';

/** Lists the placement gem and first edge-contact wave in deterministic cell order. */
export function placementCells(state: GameState, target: number): readonly number[] {
  if (!Number.isInteger(target) || target < 0 || target >= state.board.length || !state.settings.mask[target] || !state.board[target]) return Object.freeze([]);
  const cells = [target]; const ids = new Set([state.board[target]!.id]);
  for (const cell of neighbors(target, state.settings.width, state.settings.height, state.settings.mask).sort((a, b) => a - b)) {
    const id = state.board[cell]?.id;
    if (id === undefined || ids.has(id)) continue;
    ids.add(id); cells.push(cell);
    if (cells.length === 8) break;
  }
  return Object.freeze(cells.sort((a, b) => a - b));
}

/** Finds the next bounded orthogonal contact wave without activating swallowed powers. */
export function contactCells(state: GameState, portal: BlackHolePortal): readonly number[] {
  if (portal.capacityRemaining <= 0) return Object.freeze([]);
  const consumed = new Set(portal.consumedIds); const candidates = neighbors(portal.cell, state.settings.width, state.settings.height, state.settings.mask).sort((a, b) => a - b);
  const cells: number[] = [];
  for (const cell of candidates) {
    const id = state.board[cell]?.id;
    if (id === undefined || consumed.has(id)) continue;
    consumed.add(id); cells.push(cell);
    if (cells.length === portal.capacityRemaining) break;
  }
  return Object.freeze(cells);
}

/** Accounts for one portal contact wave and closes the portal exactly at zero capacity. */
export function consumePortal(state: GameState, cells: readonly number[]): BlackHolePortal | null {
  const portal = state.blackHole; if (!portal) return null;
  const seen = new Set(portal.consumedIds); const ids = cells.flatMap(cell => {
    const id = state.board[cell]?.id;
    if (id === undefined || seen.has(id)) return [];
    seen.add(id); return [id];
  });
  const capacityRemaining = Math.max(0, portal.capacityRemaining - ids.length);
  if (!capacityRemaining) return null;
  return Object.freeze({ ...portal, capacityRemaining, consumedIds: Object.freeze([...portal.consumedIds, ...ids]) });
}
