export function seedNatureState(seed: string): number {
  let value = 0x811c_9dc5;
  for (let index = 0; index < seed.length; index++) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 0x0100_0193) >>> 0;
  }
  return value || 0x6d2b_79f5;
}
export function nextNatureUint32(state: number): readonly [number, number] {
  let next = state >>> 0;
  next ^= next << 13; next ^= next >>> 17; next ^= next << 5;
  return [next >>> 0, next >>> 0];
}
export function nextNatureUnit(state: number): readonly [number, number] {
  const [next, value] = nextNatureUint32(state);
  return [next, value / 0x1_0000_0000];
}
