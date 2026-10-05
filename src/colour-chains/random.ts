import type { Colour, GameState } from './types.js';

const COLOURS: readonly Colour[] = ['red', 'blue', 'green', 'gold', 'purple', 'teal'];
/** Hashes a UTF-8 seed with FNV-1a, scoped to this game and rules version. */
export function seedState(seed: string): number {
  let hash = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(`colour-chains|chains-1|${seed}`)) hash = Math.imul(hash ^ byte, 0x01000193) >>> 0;
  return hash || 0x6d2b79f5;
}
/** Advances the package's reference xorshift32 source. */
export function nextUint32(state: number): number {
  let next = state >>> 0; next ^= next << 13; next ^= next >>> 17; next ^= next << 5; return next >>> 0;
}
function nextInt(state: number, n: number): readonly [number, number] {
  const limit = Math.floor(0x100000000 / n) * n; let current = state >>> 0;
  for (;;) { const next = nextUint32(current); current = next; if (next < limit) return [next % n, current]; }
}
function refill(state: number, count: 4 | 5 | 6): readonly [readonly Colour[], number] {
  const values = [...COLOURS.slice(0, count), ...COLOURS.slice(0, count), ...COLOURS.slice(0, count)]; let randomState = state;
  for (let i = values.length - 1; i > 0; i--) { const [j, next] = nextInt(randomState, i + 1); randomState = next; [values[i], values[j]] = [values[j]!, values[i]!]; }
  return [values, randomState];
}
/** Draws one deterministic pair from a three-of-each-colour shuffled bag. */
export function drawPair(state: Pick<GameState, 'bag' | 'randomState' | 'settings'>): readonly [readonly [Colour, Colour], readonly Colour[], number] {
  let bag = state.bag; let randomState = state.randomState; const colours: Colour[] = [];
  for (let i = 0; i < 2; i++) {
    if (!bag.length) [bag, randomState] = refill(randomState, state.settings.colourCount);
    colours.push(bag[bag.length - 1]!); bag = bag.slice(0, -1);
  }
  return [[colours[0]!, colours[1]!], bag, randomState];
}
