import type { Colour, Gem } from './types.js';
export interface MatchWave { readonly cells: readonly number[]; readonly colour: Colour }
/** Finds the union of every maximal horizontal, vertical, and diagonal run of at least three. */
export function findMatches(board: readonly (Gem | null)[], width: number, height: number): readonly MatchWave[] {
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]] as const;
  const found = new Map<Colour, Set<number>>();
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const index = y * width + x; const gem = board[index]; if (!gem) continue;
    for (const [dx, dy] of directions) {
      const px = x - dx, py = y - dy;
      if (px >= 0 && px < width && py >= 0 && py < height && board[py * width + px]?.colour === gem.colour) continue;
      const run: number[] = []; let cx = x, cy = y;
      while (cx >= 0 && cx < width && cy >= 0 && cy < height && board[cy * width + cx]?.colour === gem.colour) { run.push(cy * width + cx); cx += dx; cy += dy; }
      if (run.length >= 3) { const cells = found.get(gem.colour) ?? new Set<number>(); run.forEach(cell => cells.add(cell)); found.set(gem.colour, cells); }
    }
  }
  return [...found].map(([colour, cells]) => ({ colour, cells: [...cells].sort((a, b) => a - b) }));
}
/** Compacts each column downward while preserving the top-to-bottom order of survivors. */
export function compactBoard(board: readonly (Gem | null)[], width: number, height: number): readonly (Gem | null)[] {
  const result: (Gem | null)[] = Array(width * height).fill(null);
  for (let x = 0; x < width; x++) { const stack: Gem[] = []; for (let y = 0; y < height; y++) { const gem = board[y * width + x]; if (gem) stack.push(gem); } const offset = height - stack.length; stack.forEach((gem, i) => { result[(offset + i) * width + x] = gem; }); }
  return result;
}
