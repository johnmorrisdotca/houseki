import type { ChallengeGoal, Colour, CreateOptions, Mode, Preset, Settings } from './types.js';
const PRESETS: Readonly<Record<Preset, readonly [number, number]>> = { narrow: [5, 12], standard: [6, 12], wide: [8, 12], tall: [6, 16] };
const COLOURS: readonly Colour[] = ['red', 'blue', 'green', 'gold', 'purple', 'teal'];
/** Typed setup and authored challenge error. */
export class StoneChainsOptionsError extends RangeError {
  readonly code: string;
  constructor(code: string, message: string) { super(message); this.name = 'StoneChainsOptionsError'; this.code = code; }
}
export interface NormalizedOptions extends Settings { readonly mode: Exclude<Mode, 'challenge'> }
function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00.000Z`); return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}
function validateSize(width: number, height: number): void {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 5 || width > 10 || height < 12 || height > 20 || width * height > 240) throw new StoneChainsOptionsError('invalid-board-size', 'Board must be 5–10 columns by 12–20 visible rows, with at most 240 cells');
}
/** Validates public modes and canonical category dimensions before a random draw. */
export function normalizeOptions(options: CreateOptions): NormalizedOptions {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new StoneChainsOptionsError('invalid-options', 'Options must be an object');
  const keys = ['mode', 'seed', 'dailyDate', 'preset', 'width', 'height', 'colourCount', 'pairLimit'];
  if (Object.keys(options).some(key => !keys.includes(key))) throw new StoneChainsOptionsError('unknown-option', 'Options contain an unsupported field');
  const mode = options.mode ?? 'relaxed';
  if (!['relaxed', 'arcade', 'daily'].includes(mode)) throw new StoneChainsOptionsError('invalid-mode', 'Use Relaxed, Arcade or Daily; Challenges use createChallenge');
  const colourCount = options.colourCount ?? 4;
  if (colourCount !== 4 && colourCount !== 5 && colourCount !== 6) throw new StoneChainsOptionsError('invalid-colour-count', 'Colour count must be 4, 5 or 6');
  if (mode === 'daily') {
    if (typeof options.dailyDate !== 'string' || !validDate(options.dailyDate)) throw new StoneChainsOptionsError('invalid-daily-date', 'Daily requires a valid UTC YYYY-MM-DD date from the host');
    if (options.seed !== undefined || options.preset !== undefined || options.width !== undefined || options.height !== undefined || options.colourCount !== undefined && options.colourCount !== 4 || options.pairLimit !== undefined && options.pairLimit !== 60) throw new StoneChainsOptionsError('noncanonical-daily-settings', 'Daily uses the standard 6×12 four-colour well and 60 resolved pairs');
    return { mode, width: 6, height: 12, colourCount: 4, date: options.dailyDate, seed: `colour-chains:daily:${options.dailyDate}`, pairLimit: 60 };
  }
  if (options.dailyDate !== undefined) throw new StoneChainsOptionsError('daily-date-outside-daily', 'dailyDate is supported only in Daily mode');
  if (options.preset !== undefined && !Object.hasOwn(PRESETS, options.preset)) throw new StoneChainsOptionsError('invalid-preset', 'Unsupported board preset');
  if (options.preset !== undefined && (options.width !== undefined || options.height !== undefined)) throw new StoneChainsOptionsError('conflicting-board-options', 'Choose a preset or custom dimensions');
  const [presetWidth, presetHeight] = PRESETS[options.preset ?? 'standard'];
  const width = options.width ?? presetWidth; const height = options.height ?? presetHeight; validateSize(width, height);
  const seed = options.seed ?? 'houseki-colour-chains';
  if (typeof seed !== 'string' || seed.length < 1 || seed.length > 200) throw new StoneChainsOptionsError('invalid-seed', 'Seed must contain 1–200 characters');
  if (options.pairLimit !== undefined) throw new StoneChainsOptionsError('unsupported-pair-limit', 'Pair limits are defined only for Daily and Challenges');
  return { mode, width, height, colourCount, seed };
}
export function validateChallengeGoal(goal: ChallengeGoal, ids: ReadonlySet<number>): ChallengeGoal {
  if (!goal || typeof goal !== 'object' || Array.isArray(goal)) throw new StoneChainsOptionsError('invalid-goal', 'Challenge goal must be an object');
  if (goal.kind === 'clear-targets') {
    if (Object.keys(goal).some(key => key !== 'kind' && key !== 'targetIds') || !Array.isArray(goal.targetIds) || goal.targetIds.length < 1 || goal.targetIds.length > 240 || goal.targetIds.some(id => !Number.isSafeInteger(id) || !ids.has(id)) || new Set(goal.targetIds).size !== goal.targetIds.length) throw new StoneChainsOptionsError('invalid-target-ids', 'Target goal requires unique IDs from the starting board');
    return Object.freeze({ kind: 'clear-targets', targetIds: Object.freeze([...goal.targetIds].sort((a, b) => a - b)) });
  }
  if (goal.kind === 'minimum-chain') {
    if (Object.keys(goal).some(key => key !== 'kind' && key !== 'chain') || !Number.isInteger(goal.chain) || goal.chain < 1 || goal.chain > 12) throw new StoneChainsOptionsError('invalid-chain-goal', 'Minimum chain must be 1–12');
    return Object.freeze({ kind: 'minimum-chain', chain: goal.chain });
  }
  if (goal.kind === 'empty-board' && Object.keys(goal).length === 1) return Object.freeze({ kind: 'empty-board' });
  throw new StoneChainsOptionsError('invalid-goal', 'Unsupported challenge goal');
}
export { COLOURS, PRESETS, validateSize };
