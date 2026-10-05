import type { BoardPreset, BoardShape, CreateOptions, GameMode, StoneColour } from './types.js';

const PRESETS: Readonly<Record<BoardPreset, readonly [number, number]>> = {
  compact: [6, 8], standard: [8, 10], wide: [10, 8], tall: [6, 12],
};
const COLOURS: readonly StoneColour[] = ['red', 'blue', 'green', 'gold', 'purple', 'teal'];

/** Typed public-settings validation error. */
export class StoneCollapseOptionsError extends RangeError {
  readonly code: string;
  constructor(code: string, message: string) { super(message); this.name = 'StoneCollapseOptionsError'; this.code = code; }
}

export interface NormalizedOptions {
  readonly mode: Exclude<GameMode, 'challenge'>;
  readonly dailyDate?: string;
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly seed: string | number;
  readonly shape?: BoardShape;
  readonly mask: readonly boolean[];
}

function shapeMask(shape: BoardShape): readonly [number, number, readonly boolean[]] {
  if (shape === 'heart') {
    const width = 10; const rows = [
      [1, 3, 6, 8], [0, 4, 5, 9], [0, 9], [0, 9], [1, 8], [2, 7], [3, 6], [4, 5], [4, 5], [4, 5],
    ];
    return [width, rows.length, rows.flatMap(([a, b, c, d]) => Array.from({ length: width }, (_, x) => x >= a! && x <= b! || c !== undefined && x >= c && x <= d!))];
  }
  if (shape === 'star') {
    const width = 12; const rowRanges: readonly (readonly [number, number])[] = [
      [5, 6], [5, 6], [4, 7], [4, 7], [0, 11], [0, 11], [2, 9], [2, 9], [3, 8], [3, 8], [4, 7], [4, 7],
    ];
    return [width, rowRanges.length, rowRanges.flatMap(([a, b]) => Array.from({ length: width }, (_, x) => x >= a && x <= b))];
  }
  const width = 10; const rowRanges: readonly (readonly [number, number])[] = [
    [2, 7], [1, 8], [0, 9], [0, 9], [0, 9], [0, 9], [0, 9], [0, 9], [1, 8], [2, 7],
  ];
  return [width, rowRanges.length, rowRanges.flatMap(([a, b]) => Array.from({ length: width }, (_, x) => x >= a && x <= b))];
}

/** Returns orthogonal active neighbors in deterministic row-major order. */
export function neighbors(index: number, width: number, height: number, mask: readonly boolean[]): number[] {
  const x = index % width; const y = Math.floor(index / width); const out: number[] = [];
  if (x > 0 && mask[index - 1]) out.push(index - 1);
  if (x + 1 < width && mask[index + 1]) out.push(index + 1);
  if (y > 0 && mask[index - width]) out.push(index - width);
  if (y + 1 < height && mask[index + width]) out.push(index + width);
  return out;
}

function validateMask(mask: readonly boolean[], width: number, height: number): void {
  if (!Array.isArray(mask)) throw new StoneCollapseOptionsError('invalid-mask', 'Mask must be a boolean array');
  if (mask.length !== width * height || Array.from(mask).some(value => typeof value !== 'boolean')) throw new StoneCollapseOptionsError('invalid-mask-size', 'Mask must contain one boolean per board cell');
  const active = mask.flatMap((on, i) => on ? [i] : []);
  if (active.length < 16 || active.length > 144) throw new StoneCollapseOptionsError('invalid-active-count', 'A board must have 16–144 active cells');
  if (active.some(index => neighbors(index, width, height, mask).length === 0)) throw new StoneCollapseOptionsError('isolated-mask-cell', 'Mask cannot contain an isolated active cell');
  const visited = new Set<number>([active[0]!]); const pending = [active[0]!];
  while (pending.length) for (const next of neighbors(pending.pop()!, width, height, mask)) if (!visited.has(next)) { visited.add(next); pending.push(next); }
  if (visited.size !== active.length) throw new StoneCollapseOptionsError('disconnected-mask', 'Active mask cells must be orthogonally connected');
}

function isUtcDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}

/** Validates all public score-game options before any random draw occurs. */
export function optionsFor(options: CreateOptions): NormalizedOptions {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new StoneCollapseOptionsError('invalid-options', 'Options must be an object');
  const allowedKeys = ['mode', 'preset', 'width', 'height', 'colourCount', 'seed', 'shape', 'mask', 'dailyDate'];
  if (Object.keys(options).some(key => !allowedKeys.includes(key))) throw new StoneCollapseOptionsError('unknown-option', 'Create options contain an unsupported field');
  const mode = options.mode === undefined ? 'relaxed' : options.mode;
  if (!['relaxed', 'arcade', 'daily'].includes(mode)) throw new StoneCollapseOptionsError('invalid-mode', 'Create options support Relaxed, Arcade, or Daily score play');
  if (mode === 'daily') {
    if (typeof options.dailyDate !== 'string' || !isUtcDate(options.dailyDate)) throw new StoneCollapseOptionsError('invalid-daily-date', 'Daily requires a valid UTC YYYY-MM-DD date from the host');
    if (options.preset !== undefined || options.width !== undefined || options.height !== undefined || options.colourCount !== undefined || options.seed !== undefined || options.shape !== undefined || options.mask !== undefined) throw new StoneCollapseOptionsError('noncanonical-daily-settings', 'Daily uses the fixed standard 8×10 rectangular board and four colours');
    return { mode, dailyDate: options.dailyDate, width: 8, height: 10, colourCount: 4, seed: `stone-collapse:daily:${options.dailyDate}`, mask: Array(80).fill(true) };
  }
  if (options.dailyDate !== undefined) throw new StoneCollapseOptionsError('daily-date-outside-daily', 'dailyDate is supported only in Daily mode');
  const hasDimensions = options.width !== undefined || options.height !== undefined;
  let width: number; let height: number; let shape = options.shape; let mask = options.mask;
  if (shape !== undefined) {
    if (options.preset !== undefined || hasDimensions || mask !== undefined || !['heart', 'star', 'hexagon'].includes(shape)) throw new StoneCollapseOptionsError('conflicting-board-options', 'Choose one shape or one rectangular preset/custom size');
    [width, height, mask] = shapeMask(shape);
  } else if (mask !== undefined) {
    if (options.preset !== undefined || options.width === undefined || options.height === undefined) throw new StoneCollapseOptionsError('custom-mask-dimensions-required', 'A custom mask requires explicit width and height and cannot use a preset');
    width = options.width; height = options.height;
  } else {
    const presetName = options.preset === undefined ? 'standard' : options.preset;
    if (!Object.hasOwn(PRESETS, presetName)) throw new StoneCollapseOptionsError('invalid-preset', 'Unknown board preset');
    const preset = PRESETS[presetName];
    if (hasDimensions && options.preset !== undefined) throw new StoneCollapseOptionsError('conflicting-board-options', 'Choose a preset or custom dimensions');
    width = options.width ?? preset[0]; height = options.height ?? preset[1];
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 4 || width > 12 || height < 4 || height > 12 || width * height > 144) throw new StoneCollapseOptionsError('invalid-board-size', 'Board dimensions must each be 4–12 with at most 144 cells');
    mask = Array(width * height).fill(true);
  }
  if (!Number.isInteger(width!) || !Number.isInteger(height!) || width! < 4 || width! > 12 || height! < 4 || height! > 12 || width! * height! > 144) throw new StoneCollapseOptionsError('invalid-board-size', 'Board dimensions must each be 4–12 with at most 144 cells');
  validateMask(mask!, width!, height!);
  const colourCount = options.colourCount ?? 4;
  if (colourCount !== 4 && colourCount !== 5 && colourCount !== 6) throw new StoneCollapseOptionsError('invalid-colour-count', 'Colour count must be 4, 5, or 6');
  const seed = options.seed === undefined ? 'houseki-stone-collapse' : options.seed;
  if (typeof seed !== 'string' && (!Number.isInteger(seed) || seed < 0 || seed > 0xffff_ffff)) throw new StoneCollapseOptionsError('invalid-seed', 'Numeric seed must be an unsigned 32-bit integer');
  return { mode, width: width!, height: height!, colourCount, seed, ...(shape ? { shape } : {}), mask: [...mask!] };
}
