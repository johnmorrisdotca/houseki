import { advanceTime, advanceTicks, applyAction, createGame } from './engine.js';
import type { Action, CreateOptions, GameState, ReplayOperation } from './types.js';

const FORMAT = 'gem-swap-replay-1';
const MAX_BYTES = 262_144;
const MAX_OPERATIONS = 5_000;
const MAX_TICKS = 100_000;
const byteLength = (value: string) => new TextEncoder().encode(value).byteLength;

export class ReplayError extends TypeError {
  readonly code: string;
  constructor(code: string, message: string) { super(message); this.name = 'ReplayError'; this.code = code; }
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    const object = value as Record<string, unknown>;
    return `{${Object.keys(object).sort().map(key => `${JSON.stringify(key)}:${canonical(object[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
function validateOperation(value: unknown): ReplayOperation {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ReplayError('invalid-operation', 'Replay operation must be an object');
  const input = value as Record<string, unknown>;
  if (input.kind === 'action' && Object.keys(input).every(key => ['kind', 'action'].includes(key)) && input.action && typeof input.action === 'object' && !Array.isArray(input.action)) return { kind: 'action', action: input.action as Action };
  if (input.kind === 'ticks' && Object.keys(input).every(key => ['kind', 'count'].includes(key)) && Number.isInteger(input.count) && (input.count as number) > 0 && (input.count as number) <= 3600) return { kind: 'ticks', count: input.count as number };
  if (input.kind === 'time' && Object.keys(input).every(key => ['kind', 'milliseconds'].includes(key)) && Number.isInteger(input.milliseconds) && (input.milliseconds as number) > 0 && (input.milliseconds as number) <= 180_000) return { kind: 'time', milliseconds: input.milliseconds as number };
  throw new ReplayError('invalid-operation', 'Replay operation is malformed or unsupported');
}
function execute(initial: CreateOptions, operations: readonly ReplayOperation[]): GameState {
  let state = createGame(initial); let ticks = 0;
  for (let index = 0; index < operations.length; index++) {
    const operation = operations[index]!;
    if (operation.kind === 'action') {
      const result = applyAction(state, operation.action);
      if (!result.accepted) throw new ReplayError('rejected-action', `Replay action ${index} was rejected: ${result.reason ?? 'unknown reason'}`);
      state = result.state;
    } else if (operation.kind === 'ticks') {
      ticks += operation.count;
      if (ticks > MAX_TICKS) throw new ReplayError('replay-too-long', 'Replay exceeds the tick work limit');
      state = advanceTicks(state, operation.count).state;
    } else {
      const result = advanceTime(state, operation.milliseconds);
      if (!result.accepted) throw new ReplayError('invalid-time-step', `Replay time step ${index} was rejected`);
      state = result.state;
    }
  }
  return state;
}

/** Encodes the initial rules plus accepted actions and logical inputs in canonical JSON. */
export function encodeGame(state: GameState): string {
  if (!state || state.game !== 'gem-swap' || state.history.length > MAX_OPERATIONS) throw new ReplayError('invalid-state', 'State is invalid or exceeds the operation limit');
  const operations = state.history.map(validateOperation);
  const replayed = execute(state.initialOptions, operations);
  if (canonical(replayed) !== canonical(state)) throw new ReplayError('checkpoint-mismatch', 'State does not match its recorded inputs');
  const result = canonical({ format: FORMAT, initial: state.initialOptions, operations });
  if (byteLength(result) > MAX_BYTES) throw new ReplayError('save-too-large', 'Replay exceeds the 256 KiB size limit');
  return result;
}

/** Validates and reconstructs a state by replay; serialized board snapshots are never trusted. */
export function decodeGame(serialized: string): GameState {
  if (typeof serialized !== 'string' || byteLength(serialized) > MAX_BYTES) throw new ReplayError('save-too-large', 'Replay must be a string no larger than 256 KiB');
  let parsed: unknown;
  try { parsed = JSON.parse(serialized); } catch { throw new ReplayError('invalid-json', 'Replay is not valid JSON'); }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new ReplayError('invalid-recording', 'Replay root must be an object');
  const value = parsed as Record<string, unknown>;
  if (Object.keys(value).length !== 3 || Object.keys(value).some(key => !['format', 'initial', 'operations'].includes(key)) || value.format !== FORMAT || !Array.isArray(value.operations) || value.operations.length > MAX_OPERATIONS || !value.initial || typeof value.initial !== 'object' || Array.isArray(value.initial)) throw new ReplayError('invalid-recording', 'Replay envelope is malformed or unsupported');
  if (canonical(parsed) !== serialized) throw new ReplayError('noncanonical-recording', 'Replay JSON must use canonical key order and encoding');
  const operations = value.operations.map(validateOperation);
  return execute(value.initial as CreateOptions, operations);
}

/** Starts the exact initial ruleset and seed again, discarding all run progress. */
export function restartGame(state: GameState): GameState { return createGame(state.initialOptions); }

/** Checks a complete authored witness through the public deterministic rules API. */
export function validateChallengeWitness(options: CreateOptions, witness: readonly ReplayOperation[]): { readonly valid: boolean; readonly state?: GameState; readonly reason?: string } {
  try {
    if (options.mode !== 'challenge' || !Array.isArray(witness) || witness.length > MAX_OPERATIONS) throw new ReplayError('invalid-witness', 'Challenge witness or settings are invalid');
    const state = execute(options, witness.map(validateOperation));
    if (state.outcome !== 'won') throw new ReplayError('witness-does-not-win', 'Challenge witness does not complete every goal');
    return Object.freeze({ valid: true, state });
  } catch (error) {
    return Object.freeze({ valid: false, reason: error instanceof Error ? error.message : 'invalid-witness' });
  }
}
