import type { Gem, GemColour, GameState, Settings } from './types.js';

export const COLOURS: readonly GemColour[] = ['red', 'blue', 'green', 'gold', 'purple', 'teal'];
export const PRESETS = { compact: [6, 6], standard: [8, 8], wide: [10, 6], tall: [6, 10], extraWide: [16, 10], deep: [8, 32], large: [12, 32] } as const;

/** Returns active orthogonal neighbours in row-major order. */
export function neighbors(index: number, width: number, height: number, mask: readonly boolean[]): number[] {
  const x = index % width; const y = Math.floor(index / width); const out: number[] = [];
  if (x > 0 && mask[index - 1]) out.push(index - 1);
  if (x + 1 < width && mask[index + 1]) out.push(index + 1);
  if (y > 0 && mask[index - width]) out.push(index - width);
  if (y + 1 < height && mask[index + width]) out.push(index + width);
  return out;
}

/** Finds every cell participating in a horizontal or vertical run of at least three. */
export function findMatches(board: readonly (Gem | null)[], settings: Settings): readonly number[] {
  const found = new Set<number>(); const { width, height, mask } = settings;
  const scan = (cells: readonly number[]) => {
    let start = 0;
    while (start < cells.length) {
      const first = board[cells[start]!];
      if (!first) { start++; continue; }
      let end = start + 1;
      while (end < cells.length && board[cells[end]!]?.colour === first.colour) end++;
      if (end - start >= 3) for (let i = start; i < end; i++) found.add(cells[i]!);
      start = end;
    }
  };
  for (let y = 0; y < height; y++) {
    let segment: number[] = [];
    for (let x = 0; x <= width; x++) {
      const index = y * width + x;
      if (x < width && mask[index]) segment.push(index);
      else { scan(segment); segment = []; }
    }
  }
  for (let x = 0; x < width; x++) {
    let segment: number[] = [];
    for (let y = 0; y <= height; y++) {
      const index = y * width + x;
      if (y < height && mask[index]) segment.push(index);
      else { scan(segment); segment = []; }
    }
  }
  return [...found].sort((a, b) => a - b);
}

/** Tests an adjacent swap without changing either the board or random stream. */
export function matchesAfterSwap(state: GameState, from: number, to: number): readonly number[] {
  const board = [...state.board]; [board[from], board[to]] = [board[to]!, board[from]!];
  return findMatches(board, state.settings);
}

/** Enumerates legal normal-gem swaps in stable source/destination order. */
export function listLegalSwaps(state: GameState): readonly { readonly kind: 'swap'; readonly from: number; readonly to: number }[] {
  if (state.phase !== 'ready' || findMatches(state.board, state.settings).length) return [];
  const moves: { kind: 'swap'; from: number; to: number }[] = [];
  for (let from = 0; from < state.board.length; from++) {
    if (!state.board[from]) continue;
    for (const to of neighbors(from, state.settings.width, state.settings.height, state.settings.mask)) {
      if (to <= from || !state.board[to] || state.board[from]!.colour === state.board[to]!.colour) continue;
      if (matchesAfterSwap(state, from, to).length) moves.push({ kind: 'swap', from, to });
    }
  }
  return moves;
}

/** Checks whether a partially filled row-major board already contains a run. */
export function hasMatch(board: readonly (Gem | null)[], settings: Settings): boolean { return findMatches(board, settings).length > 0; }
