import { nextNatureUint32 } from './random.js';
import { freezeNatureState } from './state.js';
import { NatureOptionsError, validateState } from './validation.js';
import type { NatureEntity, NatureMove, NatureState } from './types.js';

export type EarthquakeKind = 'fault' | 'jumble' | 'combined';
export type EnvironmentSchedule = { readonly kind: 'frequent' } | { readonly kind: 'rare' } | { readonly kind: 'midlevel'; readonly turn: number } | { readonly kind: 'authored'; readonly turns: readonly number[] };
export interface EarthquakeOptions { readonly kind: EarthquakeKind; readonly enabled?: boolean }
export interface LightningOptions { readonly enabled?: boolean; readonly columns?: readonly number[]; readonly columnCount?: 1 | 2 | 3 }
export interface FaultPreview { readonly path: readonly number[]; readonly fracturedCells: readonly number[]; readonly removedIds: readonly number[]; readonly cells: readonly (NatureEntity | null)[]; readonly activeCells: readonly boolean[]; readonly randomStateAfter: number }
export interface JumblePreview { readonly patchCells: readonly number[]; readonly moves: readonly NatureMove[]; readonly changed: boolean; readonly reason?: 'no-eligible-patch'; readonly cells: readonly (NatureEntity | null)[]; readonly randomStateAfter: number }
export interface EarthquakePreview { readonly kind: EarthquakeKind; readonly fault?: FaultPreview; readonly jumble?: JumblePreview; readonly cells: readonly (NatureEntity | null)[]; readonly activeCells: readonly boolean[]; readonly randomStateAfter: number }
export interface LightningPreview { readonly columns: readonly number[]; readonly removedCells: readonly number[]; readonly removedIds: readonly number[]; readonly cells: readonly (NatureEntity | null)[]; readonly randomStateAfter: number }
export type EnvironmentPreview = EarthquakePreview | LightningPreview;
export type EnvironmentEvent =
  | { readonly type: 'fault-opened'; readonly path: readonly number[]; readonly fracturedCells: readonly number[]; readonly removedIds: readonly number[] }
  | { readonly type: 'jumble-completed'; readonly changed: boolean; readonly reason?: 'no-eligible-patch'; readonly patchCells: readonly number[]; readonly moves: readonly NatureMove[] }
  | { readonly type: 'lightning-struck'; readonly columns: readonly number[]; readonly removedCells: readonly number[]; readonly removedIds: readonly number[] };
export interface EnvironmentTransition { readonly state: NatureState; readonly accepted: true; readonly events: readonly EnvironmentEvent[]; readonly preview: EnvironmentPreview }

const at = (x: number, y: number, width: number): number => y * width + x;
function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
}
function drawBelow(state: number, bound: number): readonly [number, number] {
  const [next, value] = nextNatureUint32(state);
  return [next, value % bound];
}
/** Pure one-based schedule lookup: frequent is every second turn; rare is every eighth turn. */
export function isEnvironmentTurnScheduled(turn: number, schedule: EnvironmentSchedule): boolean {
  if (!Number.isSafeInteger(turn) || turn < 1 || turn > 10_000_000 || !schedule || typeof schedule !== 'object' || Array.isArray(schedule)) throw new NatureOptionsError('invalid-nature-options', 'Schedule turn and policy must be valid');
  if (schedule.kind === 'frequent' || schedule.kind === 'rare') {
    noKeysExcept(schedule, ['kind'], 'Environment schedule');
    return turn % (schedule.kind === 'frequent' ? 2 : 8) === 0;
  }
  if (schedule.kind === 'midlevel') {
    noKeysExcept(schedule, ['kind', 'turn'], 'Environment schedule');
    if (!Number.isSafeInteger(schedule.turn) || schedule.turn < 1 || schedule.turn > 10_000_000) throw new NatureOptionsError('invalid-nature-options', 'Midlevel schedule turn is out of range');
    return turn === schedule.turn;
  }
  if (schedule.kind === 'authored') {
    noKeysExcept(schedule, ['kind', 'turns'], 'Environment schedule');
    if (!Array.isArray(schedule.turns) || schedule.turns.length > 100_000 || schedule.turns.some((item, index) => !Number.isSafeInteger(item) || item < 1 || item > 10_000_000 || (index > 0 && item <= schedule.turns[index - 1]!))) throw new NatureOptionsError('invalid-nature-options', 'Authored turns must be bounded, positive and strictly increasing');
    let low = 0, high = schedule.turns.length - 1;
    while (low <= high) { const middle = (low + high) >> 1, candidate = schedule.turns[middle]!; if (candidate === turn) return true; if (candidate < turn) low = middle + 1; else high = middle - 1; }
    return false;
  }
  throw new NatureOptionsError('invalid-nature-options', 'Unsupported environment schedule');
}
function noKeysExcept(value: object, allowed: readonly string[], label: string): void {
  if (Object.keys(value).some(key => !allowed.includes(key))) throw new NatureOptionsError('invalid-nature-options', `${label} contains an unsupported field`);
}
function validateEarthquakeOptions(options: EarthquakeOptions): void {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new NatureOptionsError('invalid-nature-options', 'Earthquake options must be an object');
  noKeysExcept(options, ['kind', 'enabled'], 'Earthquake options');
  if (!['fault', 'jumble', 'combined'].includes(options.kind) || options.enabled !== undefined && typeof options.enabled !== 'boolean') throw new NatureOptionsError('invalid-nature-options', 'Earthquake options are malformed');
}
function validateLightningOptions(options: LightningOptions, width: number): void {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new NatureOptionsError('invalid-nature-options', 'Lightning options must be an object');
  noKeysExcept(options, ['enabled', 'columns', 'columnCount'], 'Lightning options');
  if (options.enabled !== undefined && typeof options.enabled !== 'boolean') throw new NatureOptionsError('invalid-nature-options', 'Lightning enabled must be boolean');
  if (options.columns !== undefined && options.columnCount !== undefined) throw new NatureOptionsError('invalid-nature-options', 'Choose explicit lightning columns or a seeded column count');
  if (options.columnCount !== undefined && ![1, 2, 3].includes(options.columnCount)) throw new NatureOptionsError('invalid-nature-options', 'Lightning column count must be one, two or three');
  if (options.columns !== undefined && (!Array.isArray(options.columns) || options.columns.length < 1 || options.columns.length > 3 || options.columns.some(column => !Number.isSafeInteger(column) || column < 0 || column >= width) || new Set(options.columns).size !== options.columns.length)) throw new NatureOptionsError('invalid-nature-options', 'Lightning columns must be one to three unique in-range column indexes');
}

function faultPath(state: NatureState): readonly [readonly number[], number] {
  if (state.width < 3) throw new NatureOptionsError('invalid-grid-size', 'A fault needs at least three columns to preserve playable space on both sides');
  let randomState = state.randomState; let draw: number;
  [randomState, draw] = drawBelow(randomState, state.width - 2);
  let x = draw + 1;
  const path: number[] = [at(x, 0, state.width)];
  for (let y = 1; y < state.height; y++) {
    let step: number;
    [randomState, step] = drawBelow(randomState, 3);
    x = Math.max(1, Math.min(state.width - 2, x + step - 1));
    path.push(at(x, y, state.width));
  }
  if (state.height > 1 && state.width > 3 && path.every((index, y) => y === 0 || index % state.width === path[y - 1]! % state.width)) {
    const row = Math.min(state.height - 1, Math.floor(state.height / 2));
    const priorX = path[row - 1]! % state.width;
    const bentX = priorX === state.width - 2 ? priorX - 1 : priorX + 1;
    path[row] = at(bentX, row, state.width);
  }
  return [path, randomState];
}

/** Preview a bounded top-to-bottom fracture. The path keeps at least one column active on each side. */
export function previewFault(state: NatureState): FaultPreview {
  validateState(state);
  const [path, randomStateAfter] = faultPath(state);
  const cells = [...state.cells], activeCells = [...state.activeCells]; const removedIds: number[] = [], fracturedCells: number[] = [];
  for (const index of path) {
    if (!activeCells[index]) continue;
    activeCells[index] = false; fracturedCells.push(index);
    const entity = cells[index]; if (entity) { removedIds.push(entity.id); cells[index] = null; }
  }
  return deepFreeze({ path, fracturedCells, removedIds, cells, activeCells, randomStateAfter });
}

const appearance = (entity: NatureEntity): string => `${entity.colour}|${Boolean(entity.magnetic)}`;
interface Patch { readonly cells: readonly number[]; readonly stones: readonly number[] }
function candidatePatches(state: NatureState): readonly Patch[] {
  const patches: Patch[] = [];
  for (let height = 1; height <= Math.min(3, state.height); height++) for (let width = 1; width <= Math.min(3, state.width); width++) {
    if (width * height < 2) continue;
    for (let top = 0; top <= state.height - height; top++) for (let left = 0; left <= state.width - width; left++) {
      const cells: number[] = [], stones: number[] = []; let allowed = true;
      for (let dy = 0; dy < height && allowed; dy++) for (let dx = 0; dx < width; dx++) {
        const index = at(left + dx, top + dy, state.width); const entity = state.cells[index];
        if (!state.activeCells[index] || entity?.kind === 'obstacle' || entity?.kind === 'stone' && entity.anchored) { allowed = false; break; }
        cells.push(index); if (entity?.kind === 'stone') stones.push(index);
      }
      if (allowed && stones.length >= 2 && new Set(stones.map(index=>appearance(state.cells[index]!))).size>1) patches.push({ cells, stones });
    }
  }
  return patches;
}

/** Preview one seeded, nontrivial stone permutation inside a fully active connected rectangle no larger than 3×3. */
export function previewJumble(state: NatureState): JumblePreview {
  validateState(state);
  const candidates = candidatePatches(state);
  if (candidates.length === 0) return deepFreeze({ patchCells: [], moves: [], changed: false, reason: 'no-eligible-patch', cells: state.cells, randomStateAfter: state.randomState });
  let randomState: number, selectedIndex: number;
  [randomState, selectedIndex] = drawBelow(state.randomState, candidates.length);
  const patch = candidates[selectedIndex]!; const shuffled = [...patch.stones];
  for (let index = shuffled.length - 1; index > 0; index--) {
    let chosen: number; [randomState, chosen] = drawBelow(randomState, index + 1);
    [shuffled[index], shuffled[chosen]] = [shuffled[chosen]!, shuffled[index]!];
  }
  if (shuffled.every((index, indexInOrder) => appearance(state.cells[index]!) === appearance(state.cells[patch.stones[indexInOrder]!]!))) {
    // A swap within identical colours would not change the puzzle.
    const first = 0;
    const second = shuffled.findIndex(index=>appearance(state.cells[index]!)!==appearance(state.cells[shuffled[first]!]!));
    [shuffled[first], shuffled[second]] = [shuffled[second]!, shuffled[first]!];
  }
  const cells = [...state.cells], moves: NatureMove[] = [];
  for (let index = 0; index < patch.stones.length; index++) {
    const from = patch.stones[index]!, to = shuffled[index]!, entity = state.cells[from]!;
    cells[to] = entity;
    if (from !== to) moves.push({ id: entity.id, from: { x: from % state.width, y: Math.floor(from / state.width) }, to: { x: to % state.width, y: Math.floor(to / state.width) } });
  }
  for (const index of patch.stones) if (!shuffled.includes(index)) cells[index] = null;
  return deepFreeze({ patchCells: patch.cells, moves, changed: moves.length > 0, cells, randomStateAfter: randomState });
}

/** Preview an earthquake, with Combined always fracturing before its one jumble attempt. */
export function previewEarthquake(state: NatureState, options: EarthquakeOptions): EarthquakePreview {
  validateState(state); validateEarthquakeOptions(options);
  if (options.enabled === false) return deepFreeze({ kind: options.kind, cells: state.cells, activeCells: state.activeCells, randomStateAfter: state.randomState });
  let cells: readonly (NatureEntity | null)[] = state.cells, activeCells = state.activeCells, randomStateAfter = state.randomState;
  let fault: FaultPreview | undefined, jumble: JumblePreview | undefined;
  if (options.kind === 'fault' || options.kind === 'combined') {
    fault = previewFault(state); cells = fault.cells; activeCells = fault.activeCells; randomStateAfter = fault.randomStateAfter;
  }
  if (options.kind === 'jumble' || options.kind === 'combined') {
    const jumbleState = fault ? freezeNatureState({ ...state, cells, activeCells, randomState: randomStateAfter }) : state;
    jumble = previewJumble(jumbleState); cells = jumble.cells; randomStateAfter = jumble.randomStateAfter;
  }
  return deepFreeze({ kind: options.kind, ...(fault ? { fault } : {}), ...(jumble ? { jumble } : {}), cells, activeCells, randomStateAfter });
}

/** Commit one bounded environmental resolution; matching, gravity and score remain the host game's job. */
export function applyEarthquake(state: NatureState, options: EarthquakeOptions): EnvironmentTransition {
  const preview = previewEarthquake(state, options);
  if (options.enabled === false) return { state, accepted: true, events: [], preview };
  const events: EnvironmentEvent[] = [];
  if (preview.fault) events.push(deepFreeze({ type: 'fault-opened', path: preview.fault.path, fracturedCells: preview.fault.fracturedCells, removedIds: preview.fault.removedIds }));
  if (preview.jumble) events.push(deepFreeze({ type: 'jumble-completed', changed: preview.jumble.changed, ...(preview.jumble.reason ? { reason: preview.jumble.reason } : {}), patchCells: preview.jumble.patchCells, moves: preview.jumble.moves }));
  if (events.length === 0) return { state, accepted: true, events: [], preview };
  if (preview.cells === state.cells && preview.activeCells === state.activeCells && preview.randomStateAfter === state.randomState) return { state, accepted: true, events: deepFreeze(events), preview };
  const next = freezeNatureState({ ...state, cells: preview.cells, activeCells: preview.activeCells, randomState: preview.randomStateAfter });
  return { state: next, accepted: true, events: deepFreeze(events), preview };
}

function chooseColumns(state: NatureState, options: LightningOptions): readonly [readonly number[], number] {
  if (options.columns !== undefined) {
    return [[...options.columns].sort((a, b) => a - b), state.randomState];
  }
  let randomState = state.randomState, count: number;
  if (options.columnCount !== undefined) count = options.columnCount;
  else { let draw: number; [randomState, draw] = drawBelow(randomState, 3); count = draw + 1; }
  count = Math.min(count, state.width);
  const pool = Array.from({ length: state.width }, (_, column) => column);
  for (let index = 0; index < count; index++) {
    let offset: number; [randomState, offset] = drawBelow(randomState, state.width - index);
    const swap = index + offset; [pool[index], pool[swap]] = [pool[swap]!, pool[index]!];
  }
  return [pool.slice(0, count).sort((a, b) => a - b), randomState];
}

/** Preview seeded or explicitly selected columns; a mask gap or obstacle blocks the strike below it. */
export function previewLightning(state: NatureState, options: LightningOptions = {}): LightningPreview {
  validateState(state); validateLightningOptions(options, state.width);
  if (options.enabled === false) return deepFreeze({ columns: [], removedCells: [], removedIds: [], cells: state.cells, randomStateAfter: state.randomState });
  const [columns, randomStateAfter] = chooseColumns(state, options); const cells = [...state.cells], removedCells: number[] = [], removedIds: number[] = [];
  for (const column of columns) {
    let hits = 0;
    for (let y = 0; y < state.height && hits < 2; y++) {
      const index = at(column, y, state.width);
      if (!state.activeCells[index] || cells[index]?.kind === 'obstacle') break;
      const entity = cells[index];
      if (entity?.kind === 'stone') { cells[index] = null; removedCells.push(index); removedIds.push(entity.id); hits++; }
    }
  }
  return deepFreeze({ columns, removedCells, removedIds, cells, randomStateAfter });
}

/** Commit one lightning strike. It removes exposed stones only and consumes no scores or tools. */
export function applyLightning(state: NatureState, options: LightningOptions = {}): EnvironmentTransition {
  const preview = previewLightning(state, options);
  if (options.enabled === false) return { state, accepted: true, events: [], preview };
  const event = deepFreeze({ type: 'lightning-struck' as const, columns: preview.columns, removedCells: preview.removedCells, removedIds: preview.removedIds });
  if (preview.randomStateAfter === state.randomState && preview.removedIds.length === 0) return { state, accepted: true, events: [event], preview };
  const next = freezeNatureState({ ...state, cells: preview.cells, randomState: preview.randomStateAfter });
  return { state: next, accepted: true, events: [event], preview };
}
