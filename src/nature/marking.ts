import { validateMarkingOptions, validateState } from './validation.js';
import { freezeNatureState } from './state.js';
import { nextNatureUnit } from './random.js';
import type { MarkingOptions, NatureEvent, NatureState, NatureTransition } from './types.js';

/** Deterministically assign magnetic markings to settled stones without changing their IDs or colours. */
export function markMagneticStones(state: NatureState, options: MarkingOptions): NatureTransition {
  validateState(state); validateMarkingOptions(options);
  if (!state.rules.magneticEnabled || options.maximum === 0 || options.probability === 0) return { state, accepted: true, events: [] };
  const maximum = options.maximum ?? state.cells.length; const anchoredProbability = options.anchoredProbability ?? 0;
  let randomState = state.randomState; let marked = 0; const ids: number[] = [];
  const cells = state.cells.map(entity => {
    if (!entity || entity.kind !== 'stone' || entity.magnetic || marked >= maximum) return entity;
    let sample: number; [randomState, sample] = nextNatureUnit(randomState);
    if (sample >= options.probability) return entity;
    let anchored = false;
    if (anchoredProbability > 0) { let anchorSample: number; [randomState, anchorSample] = nextNatureUnit(randomState); anchored = anchorSample < anchoredProbability; }
    marked++; ids.push(entity.id);
    return { ...entity, magnetic: true, ...(anchored ? { anchored: true } : {}) };
  });
  if (ids.length === 0) {
    const unchanged = randomState === state.randomState ? state : freezeNatureState({ ...state, randomState });
    return { state: unchanged, accepted: true, events: [] };
  }
  const next = freezeNatureState({ ...state, cells, randomState });
  const event: NatureEvent = Object.freeze({ type: 'magnetic-stones-marked', ids: Object.freeze(ids), randomState });
  return { state: next, accepted: true, events: [event] };
}
