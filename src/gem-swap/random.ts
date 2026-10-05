import { COLOURS } from './board.js';
import type { GemColour } from './types.js';

/** Hashes a seed with FNV-1a, scoped to this game and its rule identity. */
export function seedState(seed: string | number): number {
  let hash = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(`gem-swap|swap-1|${String(seed)}`)) hash = Math.imul(hash ^ byte, 0x01000193) >>> 0;
  return hash || 0x6d2b79f5;
}
/** Advances the reference xorshift32 random source. */
export function nextUint32(state: number): number {
  let next = state >>> 0; next ^= next << 13; next ^= next >>> 17; next ^= next << 5; return next >>> 0;
}
/** Draws an unbiased integer and its following random state. */
export function nextInt(state: number, size: number): readonly [number, number] {
  const limit = Math.floor(0x1_0000_0000 / size) * size; let current = state >>> 0;
  for (;;) { const value = nextUint32(current); current = value; if (value < limit) return [value % size, current]; }
}
/** Draws one uniformly selected configured normal-gem colour. */
export function drawColour(state: number, colourCount: number): readonly [GemColour, number] {
  const [index, next] = nextInt(state, colourCount);
  return [COLOURS[index]!, next];
}
