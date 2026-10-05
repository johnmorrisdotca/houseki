import { advanceTicks, applyAction, createGame } from './engine.js';
import type { Action, CreateOptions, GameState, Settings } from './types.js';

const RULES = 'magnetic-blocks-1' as const;
const MAX_SAVE_BYTES = 2 * 1024 * 1024;
const MAX_ACTIONS = 100_000;
const MAX_TICKS = 600_000;
const ACTIONS = ['left', 'right', 'soft-drop', 'rotate-clockwise', 'rotate-anticlockwise', 'hard-drop', 'land', 'pause', 'resume', 'set-floor-override', 'cancel-floor-override'] as const;

function stable(value: unknown, depth = 0): string {
  if (depth > 60) throw new TypeError('Save data is nested too deeply');
  if (Array.isArray(value)) return `[${value.map(item => stable(item, depth + 1)).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).filter(([, item]) => item !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item, depth + 1)}`).join(',')}}`;
  return JSON.stringify(value) ?? 'null';
}
function optionsFromSettings(settings: Settings): CreateOptions {
  return {
    mode: settings.mode, width: settings.width, height: settings.height, colourCount: settings.colourCount,
    seed: settings.seed, mask: settings.mask, initialBoard: settings.initialBoard, bonds: settings.bonds,
    ...(settings.initialQueue ? { queue: settings.initialQueue } : {}), pieceLimit: settings.pieceLimit,
    schedule: settings.schedule, floorSwitch: settings.floorSwitch, magneticImpact: settings.magneticImpact,
    ...(settings.goal ? { goal: settings.goal } : {}),
  };
}
function createFromSettings(settings: Settings): GameState {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new TypeError('Save has invalid settings');
  const state = createGame(optionsFromSettings(settings));
  if (stable(state.settings) !== stable(settings)) throw new TypeError('Save settings are not canonical');
  return state;
}
function replay(settings: Settings, actions: readonly unknown[], elapsedTicks: number): GameState {
  let state = createFromSettings(settings);
  let previousTick = -1, previousOrdinal = -1;
  for (let index = 0; index < actions.length; index++) {
    const raw = actions[index];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new TypeError(`Invalid action record ${index + 1}`);
    const item = raw as { tick?: number; ordinal?: number; action?: Action };
    if (Object.keys(item).some(key => !['tick', 'ordinal', 'action'].includes(key)) || !Number.isSafeInteger(item.tick) || item.tick! < 0 || item.tick! > elapsedTicks || !Number.isSafeInteger(item.ordinal) || !item.action || typeof item.action !== 'object' || Array.isArray(item.action) || !ACTIONS.includes(item.action.kind)) throw new TypeError(`Invalid action record ${index + 1}`);
    const actionKeys = item.action.kind === 'set-floor-override' ? ['kind', 'floor'] : ['kind'];
    if (Object.keys(item.action).some(key => !actionKeys.includes(key))) throw new TypeError(`Invalid action fields at record ${index + 1}`);
    if (item.action.kind === 'set-floor-override' && item.action.floor !== 'calm' && item.action.floor !== 'magnetic') throw new TypeError(`Invalid floor override at record ${index + 1}`);
    if (item.tick! < previousTick || item.ordinal !== (item.tick === previousTick ? previousOrdinal + 1 : 0)) throw new TypeError(`Invalid action ordering at record ${index + 1}`);
    while (state.elapsedTicks < item.tick!) {
      const before = state.elapsedTicks;
      state = advanceTicks(state, Math.min(3600, item.tick! - state.elapsedTicks)).state;
      if (state.elapsedTicks === before) throw new TypeError(`Action occurs after the run stopped at record ${index + 1}`);
    }
    const result = applyAction(state, item.action);
    if (!result.accepted) throw new TypeError(`Illegal action at record ${index + 1}: ${result.reason ?? 'rejected'}`);
    state = result.state;
    previousTick = item.tick!; previousOrdinal = item.ordinal!;
  }
  while (state.elapsedTicks < elapsedTicks) {
    const before = state.elapsedTicks;
    state = advanceTicks(state, Math.min(3600, elapsedTicks - state.elapsedTicks)).state;
    if (state.elapsedTicks === before) throw new TypeError('Checkpoint time exceeds the running game clock');
  }
  return state;
}

/** Restarts the same seed, custom starting board, fixed queue, rules and floor options. */
export function restartGame(state: GameState): GameState { return createFromSettings(state.settings); }

/** Encodes canonical settings, accepted tick-stamped actions and a verified replay checkpoint. */
export function encodeGame(state: GameState): string {
  if (!Number.isSafeInteger(state.elapsedTicks) || state.elapsedTicks < 0 || state.elapsedTicks > MAX_TICKS || state.recording.length > MAX_ACTIONS) throw new RangeError('Run exceeds replay limits');
  const derived = replay(state.settings, state.recording, state.elapsedTicks);
  if (stable(derived) !== stable(state)) throw new TypeError('State does not match its recorded actions and clock');
  const text = JSON.stringify({ format: 1, game: state.game, rules: state.rules, settings: state.settings, actions: state.recording, elapsedTicks: state.elapsedTicks, checkpoint: state });
  if (new TextEncoder().encode(text).byteLength > MAX_SAVE_BYTES) throw new RangeError('Save exceeds 2 MiB');
  return text;
}

/** Replays bounded canonical input and verifies every saved checkpoint field. */
export function decodeGame(text: string): GameState {
  if (typeof text !== 'string' || new TextEncoder().encode(text).byteLength > MAX_SAVE_BYTES) throw new RangeError('Save must be text no larger than 2 MiB');
  let value: { format?: number; game?: string; rules?: string; settings?: Settings; actions?: unknown[]; elapsedTicks?: number; checkpoint?: GameState };
  try { value = JSON.parse(text) as typeof value; } catch { throw new TypeError('Save is not valid JSON'); }
  if (!value || value.format !== 1 || value.game !== 'magnetic-blocks' || value.rules !== RULES || !value.settings || !Array.isArray(value.actions) || !value.checkpoint || Object.keys(value).some(key => !['format', 'game', 'rules', 'settings', 'actions', 'elapsedTicks', 'checkpoint'].includes(key))) throw new TypeError('Unsupported or invalid Magnetic Blocks save');
  if (!Number.isSafeInteger(value.elapsedTicks) || value.elapsedTicks! < 0 || value.elapsedTicks! > MAX_TICKS || value.actions.length > MAX_ACTIONS) throw new RangeError('Save exceeds replay limits');
  const state = replay(value.settings, value.actions, value.elapsedTicks!);
  if (state.game !== value.game || state.rules !== value.rules || stable(state) !== stable(value.checkpoint)) throw new TypeError('Save checkpoint does not match its action recording');
  return state;
}
