import { planWave } from './specials.js';
import type { GameState, ToolKind } from './types.js';

/** Computes the occupied cells affected by a tool and all special activations it causes. */
export function previewTool(state: GameState, tool: ToolKind, target: number): readonly number[] {
  const { width, mask } = state.settings;
  if (!Number.isInteger(target) || target < 0 || target >= state.board.length || !mask[target] || !state.board[target]) return Object.freeze([]);
  const x = target % width; const y = Math.floor(target / width); const targetGem = state.board[target]!;
  const direct = state.board.flatMap((gem, cell) => {
    if (!gem || !mask[cell]) return [];
    if (tool === 'colour-clear') return gem.colour === targetGem.colour ? [cell] : [];
    if (tool === 'row-clear') return Math.floor(cell / width) === y ? [cell] : [];
    return Math.abs(cell % width - x) <= 1 && Math.abs(Math.floor(cell / width) - y) <= 1 ? [cell] : [];
  });
  return planWave(state, [], null, null, direct).cells;
}
