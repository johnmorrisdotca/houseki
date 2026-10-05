import { NatureOptionsError, validateNatureOptions } from './validation.js';
import { seedNatureState } from './random.js';
import type { NatureEntity, NatureOptions, NatureState } from './types.js';

export function freezeNatureState(state: NatureState): NatureState {
  const cells = Object.freeze(state.cells.map(entity => entity ? Object.freeze({ ...entity }) : null));
  const activeCells = Object.freeze([...state.activeCells]);
  const rules = Object.freeze({ ...state.rules });
  return Object.freeze({ ...state, cells, activeCells, rules });
}

export function createNatureState(options: NatureOptions): NatureState {
  validateNatureOptions(options);
  const cells = options.cells ?? Array(options.width * options.height).fill(null) as (NatureEntity | null)[];
  const maxId = cells.reduce((max, entity) => Math.max(max, entity?.id ?? 0), 0);
  if (maxId >= 0x8000_0000) throw new NatureOptionsError('invalid-cell', 'No stable IDs remain');
  const seed = options.seed ?? 'houseki-shizen-default';
  return freezeNatureState({
    width: options.width, height: options.height,
    activeCells: options.activeCells ?? Array(options.width * options.height).fill(true),
    cells, seed, randomState: seedNatureState(seed), nextId: maxId + 1, committedPlacements: 0,
    rules: { magneticEnabled: options.magneticEnabled ?? true, reboundEnabled: options.reboundEnabled ?? true, reboundDirectionMode: options.reboundDirectionMode ?? 'input-or-alternate' }
  });
}
