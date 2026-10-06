import { createChallenge } from './challenge.js';
import { advanceTicks, applyAction, createGame } from './engine.js';
import type { ChallengeOptions, CreateOptions, GameState, RecordedAction, Settings } from './types.js';
const RULES = 'chains-1' as const;
const MAX_SAVE_BYTES = 2 * 1024 * 1024;
const MAX_ACTIONS = 100_000;
const MAX_TICKS = 10_000_000;
const ACTIONS = ['left', 'right', 'down', 'rotate-clockwise', 'rotate-anticlockwise', 'hard-drop', 'place', 'pause', 'resume', 'hint'] as const;
function stable(value: unknown, depth = 0): string {
  if (depth > 60) throw new TypeError('Save checkpoint is nested too deeply');
  if (Array.isArray(value)) return `[${value.map(item => stable(item, depth + 1)).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).filter(([, item]) => item !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item, depth + 1)}`).join(',')}}`;
  return JSON.stringify(value) ?? 'null';
}
function challengeOptions(settings: Settings): ChallengeOptions {
  if (settings.mode !== 'challenge' || !settings.challengeId || !settings.goal || !settings.initialBoard || !settings.queue || !settings.witness) throw new TypeError('Challenge settings are incomplete');
  return { id: settings.challengeId, width: settings.width, height: settings.height, colourCount: settings.colourCount, seed: settings.seed, board: settings.initialBoard, queue: settings.queue, ...(settings.magneticQueue ? { magneticQueue: settings.magneticQueue } : {}), ...(settings.nature ? { nature: true } : {}), ...(settings.weather ? { weather: settings.weather } : {}), goal: settings.goal, witness: settings.witness };
}
function createFromSettings(settings: Settings): GameState {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new TypeError('Save has invalid settings');
  if (settings.mode === 'challenge') return createChallenge(challengeOptions(settings));
  const options: CreateOptions = settings.mode === 'daily' ? { mode: 'daily', dailyDate: settings.date } : { mode: settings.mode, width: settings.width, height: settings.height, colourCount: settings.colourCount, seed: settings.seed, ...(settings.nature ? { nature: true } : {}), ...(settings.weather ? { weather: settings.weather } : {}) };
  const state = createGame(options);
  if (stable(state.settings) !== stable(settings)) throw new TypeError('Save settings are not canonical');
  return state;
}
/** Restarts the same seed/date or original witnessed challenge board and queue. */
export function restartGame(state: GameState): GameState { return createFromSettings(state.settings); }
/** Encodes canonical initial settings, accepted ordinal actions and a derived checkpoint. */
export function encodeGame(state: GameState): string {
  if (!Number.isSafeInteger(state.elapsedTicks) || state.elapsedTicks < 0 || state.elapsedTicks > MAX_TICKS || state.recording.length > MAX_ACTIONS) throw new RangeError('Run exceeds replay limits');
  const text = JSON.stringify({ format: 1, game: state.game, rules: state.rules, settings: state.settings, elapsedTicks: state.elapsedTicks, actions: state.recording, checkpoint: state });
  if (new TextEncoder().encode(text).byteLength > MAX_SAVE_BYTES) throw new RangeError('Save exceeds 2 MiB');
  return text;
}
/** Reconstructs a bounded action replay and rejects any checkpoint that differs from replay. */
export function decodeGame(text: string): GameState {
  if (typeof text !== 'string' || new TextEncoder().encode(text).byteLength > MAX_SAVE_BYTES) throw new RangeError('Save must be text no larger than 2 MiB');
  let value: { format?: number; game?: string; rules?: string; settings?: Settings; elapsedTicks?: number; actions?: unknown[]; checkpoint?: GameState };
  try { value = JSON.parse(text) as typeof value; } catch { throw new TypeError('Save is not valid JSON'); }
  if (!value || value.format !== 1 || value.game !== 'colour-chains' || value.rules !== RULES || !value.settings || !Array.isArray(value.actions) || !value.checkpoint || Object.keys(value).some(key => !['format', 'game', 'rules', 'settings', 'elapsedTicks', 'actions', 'checkpoint'].includes(key))) throw new TypeError('Unsupported or invalid Colour Chains save');
  if (!Number.isSafeInteger(value.elapsedTicks) || value.elapsedTicks! < 0 || value.elapsedTicks! > MAX_TICKS || value.actions.length > MAX_ACTIONS) throw new RangeError('Save exceeds replay limits');
  let state = createFromSettings(value.settings); let previousTick = -1; let previousOrdinal = -1; const recording: RecordedAction[] = [];
  for (let index = 0; index < value.actions.length; index++) {
    const raw = value.actions[index];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new TypeError(`Invalid action record ${index + 1}`);
    const item = raw as RecordedAction;
    if (Object.keys(item).some(key => !['tick', 'ordinal', 'action'].includes(key)) || !Number.isSafeInteger(item.tick) || item.tick < 0 || item.tick > value.elapsedTicks! || !Number.isSafeInteger(item.ordinal) || !item.action || typeof item.action !== 'object' || Array.isArray(item.action) || Object.keys(item.action).some(key => key !== 'kind') || !ACTIONS.includes(item.action.kind)) throw new TypeError(`Invalid action record ${index + 1}`);
    if (item.tick < previousTick || item.ordinal !== (item.tick === previousTick ? previousOrdinal + 1 : 0)) throw new TypeError(`Invalid action ordering at record ${index + 1}`);
    while (state.elapsedTicks < item.tick) {
      const prior = state.elapsedTicks; state = advanceTicks(state, Math.min(3600, item.tick - state.elapsedTicks)).state;
      if (state.elapsedTicks === prior) throw new TypeError(`Action occurs after the run stopped at record ${index + 1}`);
    }
    const result = applyAction(state, item.action);
    if (!result.accepted) throw new TypeError(`Illegal action at record ${index + 1}: ${result.reason ?? 'rejected'}`);
    state = result.state; recording.push({ tick: item.tick, ordinal: item.ordinal, action: item.action }); previousTick = item.tick; previousOrdinal = item.ordinal;
  }
  while (state.elapsedTicks < value.elapsedTicks!) {
    const prior = state.elapsedTicks; state = advanceTicks(state, Math.min(3600, value.elapsedTicks! - state.elapsedTicks)).state;
    if (state.elapsedTicks === prior) throw new TypeError('Checkpoint time exceeds the logical game clock');
  }
  state = { ...state, recording };
  if (stable(state) !== stable(value.checkpoint)) throw new TypeError('Save checkpoint does not match its action recording');
  return state;
}
