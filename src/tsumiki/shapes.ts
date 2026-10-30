import type { BlockColour, Piece } from './types.js';

/** The six colours a piece may come in. */
export const COLOURS: readonly BlockColour[] = ['red', 'blue', 'green', 'gold', 'purple', 'teal'];

const at = (...cells: readonly (readonly [number, number])[]) => cells;

/** Every shape a tray can hold, with how often it comes up: the small and straight more than the awkward. */
export const SHAPES: readonly { readonly name: string; readonly weight: number; readonly cells: readonly (readonly [number, number])[] }[] = [
  { name: 'dot', weight: 2, cells: at([0, 0]) },
  { name: 'bar-2', weight: 3, cells: at([0, 0], [0, 1]) },
  { name: 'post-2', weight: 3, cells: at([0, 0], [1, 0]) },
  { name: 'bar-3', weight: 4, cells: at([0, 0], [0, 1], [0, 2]) },
  { name: 'post-3', weight: 4, cells: at([0, 0], [1, 0], [2, 0]) },
  { name: 'bar-4', weight: 2, cells: at([0, 0], [0, 1], [0, 2], [0, 3]) },
  { name: 'post-4', weight: 2, cells: at([0, 0], [1, 0], [2, 0], [3, 0]) },
  { name: 'bar-5', weight: 1, cells: at([0, 0], [0, 1], [0, 2], [0, 3], [0, 4]) },
  { name: 'post-5', weight: 1, cells: at([0, 0], [1, 0], [2, 0], [3, 0], [4, 0]) },
  { name: 'square-2', weight: 4, cells: at([0, 0], [0, 1], [1, 0], [1, 1]) },
  { name: 'square-3', weight: 2, cells: at([0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]) },
  { name: 'wide-3x2', weight: 2, cells: at([0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]) },
  { name: 'tall-2x3', weight: 2, cells: at([0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]) },
  { name: 'corner-ne', weight: 3, cells: at([0, 0], [0, 1], [1, 1]) },
  { name: 'corner-nw', weight: 3, cells: at([0, 0], [0, 1], [1, 0]) },
  { name: 'corner-se', weight: 3, cells: at([0, 1], [1, 0], [1, 1]) },
  { name: 'corner-sw', weight: 3, cells: at([0, 0], [1, 0], [1, 1]) },
  { name: 'tee-up', weight: 2, cells: at([0, 1], [1, 0], [1, 1], [1, 2]) },
  { name: 'tee-down', weight: 2, cells: at([0, 0], [0, 1], [0, 2], [1, 1]) },
  { name: 'tee-left', weight: 2, cells: at([0, 1], [1, 0], [1, 1], [2, 1]) },
  { name: 'tee-right', weight: 2, cells: at([0, 0], [1, 0], [1, 1], [2, 0]) },
  { name: 'step-right', weight: 2, cells: at([0, 1], [0, 2], [1, 0], [1, 1]) },
  { name: 'step-left', weight: 2, cells: at([0, 0], [0, 1], [1, 1], [1, 2]) },
  { name: 'long-l', weight: 1, cells: at([0, 0], [1, 0], [2, 0], [2, 1]) },
  { name: 'long-j', weight: 1, cells: at([0, 1], [1, 1], [2, 0], [2, 1]) },
];

const TOTAL_WEIGHT = SHAPES.reduce((sum, shape) => sum + shape.weight, 0);

/** Hashes a seed with FNV-1a, scoped to this game. */
export function seedState(seed: string): number {
  let hash = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(`tsumiki|1|${seed}`)) hash = Math.imul(hash ^ byte, 0x01000193);
  return hash >>> 0 || 0x6d2b79f5;
}

/** Advances the reference xorshift32 random source. */
function nextUint32(state: number): number {
  let next = state >>> 0;
  next ^= next << 13;
  next ^= next >>> 17;
  next ^= next << 5;
  return next >>> 0;
}

/** Draws one piece and the random state that follows it. */
export function drawPiece(random: number): readonly [Piece, number] {
  const first = nextUint32(random);
  const second = nextUint32(first);
  let left = first % TOTAL_WEIGHT;
  const shape = SHAPES.find((each) => {
    left -= each.weight;
    return left < 0;
  })!;
  return [{ shape: shape.name, colour: COLOURS[second % COLOURS.length]!, cells: shape.cells }, second];
}
