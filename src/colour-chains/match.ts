import type { Gem } from './types.js';

/** Finds maximal orthogonally connected same-colour components of at least four stones. */
export function findGroups(board: readonly (Gem | null)[], width: number, height: number): readonly (readonly number[])[] {
  const seen = new Set<number>(); const groups: number[][] = [];
  for (let start = 0; start < board.length; start++) {
    const first = board[start]; if (!first || seen.has(start)) continue;
    const colour = first.colour; const stack = [start]; const group: number[] = []; seen.add(start);
    while (stack.length) {
      const at = stack.pop()!; group.push(at); const x = at % width; const y = Math.floor(at / width);
      const neighbours = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
      for (const [nx, ny] of neighbours) {
        if (nx! < 0 || nx! >= width || ny! < 0 || ny! >= height) continue;
        const index = ny! * width + nx!; if (!seen.has(index) && board[index]?.colour === colour) { seen.add(index); stack.push(index); }
      }
    }
    if (group.length >= 4) groups.push(group.sort((a, b) => a - b));
  }
  return groups;
}
/** Compacts each column independently, preserving survivor order. */
export function compactBoard(board: readonly (Gem | null)[], width: number, height: number): readonly (Gem | null)[] {
  const result: (Gem | null)[] = Array(width * height).fill(null);
  for (let x = 0; x < width; x++) {
    const stack: Gem[] = []; for (let y = 0; y < height; y++) { const gem = board[y * width + x]; if (gem) stack.push(gem); }
    for (let i = 0; i < stack.length; i++) result[(height - stack.length + i) * width + x] = stack[i]!;
  }
  return result;
}
