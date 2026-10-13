import type { Block, Bond, Floor, Gem } from './types.js';

export const HIDDEN_ROWS = 0;
/** The fixed 60 Hz ticks showing the magnetic-block match mark phase.
 *
 * @example
 * ```ts
 * import { MARK_TICKS } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * console.log(MARK_TICKS);
 * ```
 */
export const MARK_TICKS = 7;
/** Fixed 60 Hz ticks in the magnetic-block removal phase.
 * @example
 * ```ts
 * import { REMOVE_TICKS } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * console.log(REMOVE_TICKS);
 * ```
 */
export const REMOVE_TICKS = 6;
/** Fixed 60 Hz ticks in the magnetic-block gravity phase.
 * @example
 * ```ts
 * import { GRAVITY_TICKS } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * console.log(GRAVITY_TICKS);
 * ```
 */
export const GRAVITY_TICKS = 9;
export const cell = (x: number, y: number, width: number): number => y * width + x;
const BASE: readonly (readonly [number, number])[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
/** Returns stable-gem addresses after rotating the square block around its centre.
 *
 * @param block - The native active 2×2 block and its stable gem ids.
 * @param width - The native board width in cells.
 * @returns Returns stable-gem addresses after rotating the square block around its centre.
 * @example
 * ```ts
 * import { blockCells, createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(blockCells(state.active!,state.settings.width).length);
 * ```
 */
export function blockCells(block: Block, width: number): readonly { readonly index: number; readonly gem: Gem }[] {
  return block.gems.map((gem, corner) => {
    let [x, y] = BASE[corner]!;
    for (let turn = 0; turn < block.orientation; turn++) [x, y] = [1 - y, x];
    return { index: cell(block.x + x, block.y + y, width), gem };
  });
}
/** Test whether the whole native block fits passable empty board cells.
 *
 * @param block - The native active 2×2 block and its stable gem ids.
 * @param board - The row-major native board; null cells are empty or masked.
 * @param width - The native board width in cells.
 * @param height - The native board height in cells.
 * @param mask - The row-major active-cell mask; false cells cannot hold gems.
 * @returns Test whether the whole native block fits passable empty board cells.
 * @example
 * ```ts
 * import { canPlace, createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(canPlace(state.active!,state.board,state.settings.width,state.settings.height,state.settings.mask));
 * ```
 */
export function canPlace(block: Block, board: readonly (Gem | null)[], width: number, height: number, mask: readonly boolean[]): boolean {
  if (block.x < 0 || block.x + 1 >= width || block.y < 0 || block.y + 1 >= height) return false;
  return blockCells(block, width).every(({ index }) => { const x = index % width, y = Math.floor(index / width); return x >= 0 && x < width && y >= 0 && y < height && mask[index] && !board[index]; });
}
/** Find the last legal block row before downward collision.
 *
 * @param block - The native active 2×2 block and its stable gem ids.
 * @param board - The row-major native board; null cells are empty or masked.
 * @param width - The native board width in cells.
 * @param height - The native board height in cells.
 * @param mask - The row-major active-cell mask; false cells cannot hold gems.
 * @returns Find the last legal block row before downward collision.
 * @example
 * ```ts
 * import { createGame, landingY } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(landingY(state.active!,state.board,state.settings.width,state.settings.height,state.settings.mask));
 * ```
 */
export function landingY(block: Block, board: readonly (Gem | null)[], width: number, height: number, mask: readonly boolean[]): number {
  let y = block.y; while (canPlace({ ...block, y: y + 1 }, board, width, height, mask)) y++; return y;
}
/** Computes deterministic orthogonal colour components of at least four gems.
 *
 * @param board - The row-major native board; null cells are empty or masked.
 * @param width - The native board width in cells.
 * @param height - The native board height in cells.
 * @param mask - The row-major active-cell mask; false cells cannot hold gems.
 * @returns Computes deterministic orthogonal colour components of at least four gems.
 * @example
 * ```ts
 * import { createGame, matchGroups } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(matchGroups(state.board,state.settings.width,state.settings.height,state.settings.mask).length);
 * ```
 */
export function matchGroups(board: readonly (Gem | null)[], width: number, height: number, mask: readonly boolean[]): readonly (readonly number[])[] {
  const seen = new Set<number>(), matches: number[][] = [];
  for (let start = 0; start < board.length; start++) {
    const gem = board[start]; if (!gem || seen.has(start)) continue;
    const group = [start], pending = [start]; seen.add(start);
    while (pending.length) {
      const at = pending.pop()!, x = at % width, y = Math.floor(at / width);
      for (const next of [x ? at - 1 : -1, x + 1 < width ? at + 1 : -1, y ? at - width : -1, y + 1 < height ? at + width : -1]) if (next >= 0 && mask[next] && !seen.has(next) && board[next]?.colour === gem.colour) { seen.add(next); group.push(next); pending.push(next); }
    }
    if (group.length >= 4) matches.push(group.sort((a, b) => a - b));
  }
  return matches;
}
export function allMatchedCells(groups: readonly (readonly number[])[]): readonly number[] { return [...new Set(groups.flat())].sort((a, b) => a - b); }
/** Remove the selected native cell indices and discard bonds whose endpoint gems were removed.
 *
 * @param board - The row-major native board; null cells are empty or masked.
 * @param bonds - Native stable-id bonds connecting surviving gems.
 * @param indices - Row-major cell indices selected for removal.
 * @returns Remove the selected native cell indices and discard bonds whose endpoint gems were removed. Nested null values denote empty board cells, absent active pieces, unselected tools or outcomes not yet reached; optional undefined fields are absent until applicable.
 * @example
 * ```ts
 * import { createGame, removeIds } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(removeIds(state.board,state.bonds,[]).ids.length);
 * ```
 */
export function removeIds(board: readonly (Gem | null)[], bonds: readonly Bond[], indices: readonly number[]): { readonly board: readonly (Gem | null)[]; readonly bonds: readonly Bond[]; readonly ids: readonly number[] } {
  const removed = new Set(indices), ids = indices.flatMap(index => board[index] ? [board[index]!.id] : []), remaining = board.map((gem, index) => removed.has(index) ? null : gem), alive = new Set(remaining.flatMap(gem => gem ? [gem.id] : []));
  return { board: Object.freeze(remaining), bonds: Object.freeze(bonds.filter(edge => alive.has(edge.a) && alive.has(edge.b))), ids: Object.freeze(ids) };
}
function connectedComponents(board: readonly (Gem | null)[], bonds: readonly Bond[]): readonly (readonly number[])[] {
  const indices = new Map<number, number>(); board.forEach((gem, index) => { if (gem) indices.set(gem.id, index); });
  const edges = new Map<number, number[]>(); for (const id of indices.keys()) edges.set(id, []);
  for (const edge of bonds) if (edges.has(edge.a) && edges.has(edge.b)) { edges.get(edge.a)!.push(edge.b); edges.get(edge.b)!.push(edge.a); }
  const seen = new Set<number>(), groups: number[][] = [];
  for (const id of indices.keys()) { if (seen.has(id)) continue; const pending = [id], cells: number[] = []; seen.add(id); while (pending.length) { const next = pending.pop()!; cells.push(indices.get(next)!); for (const neighbour of edges.get(next)!) if (!seen.has(neighbour)) { seen.add(neighbour); pending.push(neighbour); } } groups.push(cells); }
  return groups;
}
/** Settles bonded connected components one cell per deterministic bottom/ID priority step.
 *
 * @param initial - The row-major starting board for gravity settlement.
 * @param bonds - Native stable-id bonds connecting surviving gems.
 * @param width - The native board width in cells.
 * @param height - The native board height in cells.
 * @param mask - The row-major active-cell mask; false cells cannot hold gems.
 * @returns Settles bonded connected components one cell per deterministic bottom/ID priority step. Nested null values denote empty board cells, absent active pieces, unselected tools or outcomes not yet reached; optional undefined fields are absent until applicable.
 * @example
 * ```ts
 * import { calmGravity, createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(calmGravity(state.board,state.bonds,state.settings.width,state.settings.height,state.settings.mask).length);
 * ```
 */
export function calmGravity(initial: readonly (Gem | null)[], bonds: readonly Bond[], width: number, height: number, mask: readonly boolean[]): readonly (Gem | null)[] {
  let board = [...initial], moved = true, guard = width * height * height;
  while (moved && guard-- > 0) {
    moved = false;
    const groups = connectedComponents(board, bonds).map(cells => ({ cells, bottom: Math.max(...cells.map(index => Math.floor(index / width))), id: Math.min(...cells.map(index => board[index]!.id)) })).sort((a, b) => b.bottom - a.bottom || a.id - b.id);
    for (const group of groups) {
      const own = new Set(group.cells), destinations = group.cells.map(index => index + width);
      const canMove = group.cells.every((index, i) => { const y = Math.floor(index / width), dest = destinations[i]!; return y + 1 < height && mask[dest] && (!board[dest] || own.has(dest)); });
      if (!canMove) continue;
      const next = [...board]; for (const index of group.cells) next[index] = null; for (const index of group.cells) next[index + width] = board[index]!; board = next; moved = true; break;
    }
  }
  if (guard <= 0) throw new RangeError('Calm gravity did not converge within its board-derived step bound');
  return Object.freeze(board);
}
/** Magnetic floor removes all bonds and settles each column segment independently.
 *
 * @param initial - The row-major starting board for gravity settlement.
 * @param width - The native board width in cells.
 * @param height - The native board height in cells.
 * @param mask - The row-major active-cell mask; false cells cannot hold gems.
 * @returns Magnetic floor removes all bonds and settles each column segment independently. Nested null values denote empty board cells, absent active pieces, unselected tools or outcomes not yet reached; optional undefined fields are absent until applicable.
 * @example
 * ```ts
 * import { createGame, magneticGravity } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(magneticGravity(state.board,state.settings.width,state.settings.height,state.settings.mask).length);
 * ```
 */
export function magneticGravity(initial: readonly (Gem | null)[], width: number, height: number, mask: readonly boolean[]): readonly (Gem | null)[] {
  const board = [...initial];
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && !mask[cell(x, y, width)]) y++;
      const start = y; while (y < height && mask[cell(x, y, width)]) y++;
      const end = y, survivors: Gem[] = [];
      for (let row = start; row < end; row++) { const gem = board[cell(x, row, width)]; if (gem) survivors.push(gem); }
      for (let row = start; row < end; row++) board[cell(x, row, width)] = null;
      for (let i = 0; i < survivors.length; i++) board[cell(x, end - survivors.length + i, width)] = survivors[i]!;
    }
  }
  return Object.freeze(board);
}
/** Settle surviving gems with the chosen floor rule and retain valid stable-id bonds.
 *
 * @param initial - The row-major starting board for gravity settlement.
 * @param bonds - Native stable-id bonds connecting surviving gems.
 * @param floor - The native calm or magnetic floor rule to apply.
 * @param width - The native board width in cells.
 * @param height - The native board height in cells.
 * @param mask - The row-major active-cell mask; false cells cannot hold gems.
 * @returns Settle surviving gems with the chosen floor rule and retain valid stable-id bonds. Nested null values denote empty board cells, absent active pieces, unselected tools or outcomes not yet reached; optional undefined fields are absent until applicable.
 * @example
 * ```ts
 * import { createGame, settle } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(settle(state.board,state.bonds,"calm",state.settings.width,state.settings.height,state.settings.mask).board.length);
 * ```
 */
export function settle(initial: readonly (Gem | null)[], bonds: readonly Bond[], floor: Floor, width: number, height: number, mask: readonly boolean[]): { readonly board: readonly (Gem | null)[]; readonly bonds: readonly Bond[] } {
  return floor === 'magnetic' ? { board: magneticGravity(initial, width, height, mask), bonds: Object.freeze([]) } : { board: calmGravity(initial, bonds, width, height, mask), bonds };
}
/** Collects the occupied one-cell support layer under both block columns at first contact.
 *
 * @param block - The native active 2×2 block and its stable gem ids.
 * @param board - The row-major native board; null cells are empty or masked.
 * @param width - The native board width in cells.
 * @param height - The native board height in cells.
 * @param mask - The row-major active-cell mask; false cells cannot hold gems.
 * @returns Collects the occupied one-cell support layer under both block columns at first contact.
 * @example
 * ```ts
 * import { createGame, impactSupportIds } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(impactSupportIds(state.active!,state.board,state.settings.width,state.settings.height,state.settings.mask).length);
 * ```
 */
export function impactSupportIds(block: Block, board: readonly (Gem | null)[], width: number, height: number, mask: readonly boolean[]): readonly number[] {
  const byColumn = new Map<number, number>();
  for (const { index } of blockCells(block, width)) { const x = index % width, y = Math.floor(index / width); byColumn.set(x, Math.max(byColumn.get(x) ?? -1, y)); }
  const ids = new Set<number>();
  for (const [x, y] of byColumn) { const supportY = y + 1; if (supportY >= 0 && supportY < height) { const index = cell(x, supportY, width); if (mask[index] && board[index]) ids.add(board[index]!.id); } }
  return Object.freeze([...ids].sort((a, b) => a - b));
}
/** List the native stable-id bonds connecting adjacent gems in the active block.
 *
 * @param block - The native active 2×2 block and its stable gem ids.
 * @returns List the native stable-id bonds connecting adjacent gems in the active block.
 * @example
 * ```ts
 * import { blockBonds, createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(blockBonds(state.active!).length);
 * ```
 */
export function blockBonds(block: Block): readonly Bond[] { return Object.freeze([[0, 1], [1, 2], [2, 3], [3, 0]].map(([a, b]) => { const ids = [block.gems[a!]!.id, block.gems[b!]!.id].sort((x, y) => x - y); return Object.freeze({ a: ids[0]!, b: ids[1]! }); }).sort((a, b) => a.a - b.a || a.b - b.b)); }
