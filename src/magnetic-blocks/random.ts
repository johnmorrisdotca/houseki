/** Hashes a numeric or string seed into the engine's non-zero xorshift state. */
export function seedState(seed: string | number): number {
  let hash = 0x811c9dc5; for (const byte of new TextEncoder().encode(String(seed))) hash = Math.imul(hash ^ byte, 0x01000193) >>> 0;
  return hash || 0x6d2b79f5;
}
/** Advances the fixed 32-bit xorshift source. */
export function nextUint32(state: number): number { let value = state >>> 0; value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return value >>> 0; }
/** Draws an unbiased integer in [0, bound). */
export function nextInt(state: number, bound: number): readonly [number, number] {
  const limit = Math.floor(0x1_0000_0000 / bound) * bound; let current = state >>> 0;
  for (;;) { current = nextUint32(current); if (current < limit) return [current % bound, current]; }
}
