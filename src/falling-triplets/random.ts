import type { Colour } from './types.js';
const COLOURS: readonly Colour[] = ['red', 'blue', 'green', 'gold', 'purple', 'teal'];
/** Hashes a string seed with UTF-8 FNV-1a and returns a nonzero uint32 state. */
export function seedState(seed: string): number {
  let hash = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(seed)) hash = Math.imul(hash ^ byte, 0x01000193) >>> 0;
  return hash || 0x6d2b79f5;
}
/** Advances the reference xorshift32 source. */
export function nextUint32(state: number): readonly [number, number] {
  let next = state >>> 0;
  next ^= next << 13; next ^= next >>> 17; next ^= next << 5;
  next >>>= 0;
  return [next, next];
}
/** Draws an unbiased integer and updated state using rejection sampling. */
export function nextInt(state: number, n: number): readonly [number, number] {
  if (!Number.isInteger(n) || n < 1 || n > 0x100000000) throw new RangeError('n must be an integer from 1 to 2^32');
  const limit = Math.floor(0x100000000 / n) * n;
  let current = state >>> 0;
  for (;;) { const [value, next] = nextUint32(current); current = next; if (value < limit) return [value % n, current]; }
}
/** Creates a shuffled bag with three of each available colour. */
export function drawBag(bag: readonly Colour[], state: number, count: 4 | 5 | 6): readonly [readonly Colour[], number] {
  if (bag.length) return [bag, state];
  const values = COLOURS.slice(0, count) as Colour[];
  const nextBag = [...values, ...values, ...values];
  let current = state;
  for (let i = nextBag.length - 1; i > 0; i--) { const [j, next] = nextInt(current, i + 1); current = next; [nextBag[i], nextBag[j]] = [nextBag[j]!, nextBag[i]!]; }
  return [nextBag, current];
}
