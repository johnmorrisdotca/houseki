import type { Block, Bond, Floor, Gem } from './types.js';

export const HIDDEN_ROWS = 0;
export const MARK_TICKS = 7, REMOVE_TICKS = 6, GRAVITY_TICKS = 9;
export const cell = (x: number, y: number, width: number): number => y * width + x;
const BASE: readonly (readonly [number, number])[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
/** Returns stable-gem addresses after rotating the square block around its centre. */
export function blockCells(block: Block, width: number): readonly { readonly index: number; readonly gem: Gem }[] {
  return block.gems.map((gem, corner) => {
    let [x, y] = BASE[corner]!;
    for (let turn = 0; turn < block.orientation; turn++) [x, y] = [1 - y, x];
    return { index: cell(block.x + x, block.y + y, width), gem };
  });
}
export function canPlace(block: Block, board: readonly (Gem | null)[], width: number, height: number, mask: readonly boolean[]): boolean {
  if (block.x < 0 || block.x + 1 >= width || block.y < 0 || block.y + 1 >= height) return false;
  return blockCells(block, width).every(({ index }) => { const x = index % width, y = Math.floor(index / width); return x >= 0 && x < width && y >= 0 && y < height && mask[index] && !board[index]; });
}
export function landingY(block: Block, board: readonly (Gem | null)[], width: number, height: number, mask: readonly boolean[]): number {
  let y = block.y; while (canPlace({ ...block, y: y + 1 }, board, width, height, mask)) y++; return y;
}
/** Computes deterministic orthogonal colour components of at least four gems. */
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
/** Settles bonded connected components one cell per deterministic bottom/ID priority step. */
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
/** Magnetic floor removes all bonds and settles each column segment independently. */
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
export function settle(initial: readonly (Gem | null)[], bonds: readonly Bond[], floor: Floor, width: number, height: number, mask: readonly boolean[]): { readonly board: readonly (Gem | null)[]; readonly bonds: readonly Bond[] } {
  return floor === 'magnetic' ? { board: magneticGravity(initial, width, height, mask), bonds: Object.freeze([]) } : { board: calmGravity(initial, bonds, width, height, mask), bonds };
}
/** Collects the occupied one-cell support layer under both block columns at first contact. */
export function impactSupportIds(block: Block, board: readonly (Gem | null)[], width: number, height: number, mask: readonly boolean[]): readonly number[] {
  const byColumn = new Map<number, number>();
  for (const { index } of blockCells(block, width)) { const x = index % width, y = Math.floor(index / width); byColumn.set(x, Math.max(byColumn.get(x) ?? -1, y)); }
  const ids = new Set<number>();
  for (const [x, y] of byColumn) { const supportY = y + 1; if (supportY >= 0 && supportY < height) { const index = cell(x, supportY, width); if (mask[index] && board[index]) ids.add(board[index]!.id); } }
  return Object.freeze([...ids].sort((a, b) => a - b));
}
export function blockBonds(block: Block): readonly Bond[] { return Object.freeze([[0, 1], [1, 2], [2, 3], [3, 0]].map(([a, b]) => { const ids = [block.gems[a!]!.id, block.gems[b!]!.id].sort((x, y) => x - y); return Object.freeze({ a: ids[0]!, b: ids[1]! }); }).sort((a, b) => a.a - b.a || a.b - b.b)); }
