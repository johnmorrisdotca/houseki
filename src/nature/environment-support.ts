import { nextNatureUint32 } from "./random.js";
import { NatureOptionsError } from "./validation.js";

export const at = (x: number, y: number, width: number): number => y * width + x;
export function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
}
export function drawBelow(state: number, bound: number): readonly [number, number] {
  const [next, value] = nextNatureUint32(state);
  return [next, value % bound];
}
export function noKeysExcept(value: object, allowed: readonly string[], label: string): void {
  if (Object.keys(value).some((key) => !allowed.includes(key)))
    throw new NatureOptionsError("invalid-nature-options", `${label} contains an unsupported field`);
}
