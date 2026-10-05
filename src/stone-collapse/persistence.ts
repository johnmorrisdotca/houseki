import type { Action, ChallengeDefinition, CreateOptions, GameState, RecordedAction, Settings, Stone, Transition } from './types.js';
import { advanceTicks, applyAction, createChallenge, createGame, requestHint, undo } from './engine.js';

const RULES = 'collapse-2' as const;
const MAX_RECORDED_ACTIONS = 100_000;
const MAX_RECORDED_TICKS = 10_000_000;
function groupScore(size: number): number { return 5 * size * (size - 1); }
function indexOfId(board: readonly (Stone | null)[], id: number): number { return board.findIndex(stone => stone?.id === id); }
function groupAt(board: readonly (Stone | null)[], settings: GameState['settings'], start: number): readonly number[] {
  const stone = board[start]; if (!stone) return [];
  const width = settings.width; const height = settings.height; const mask = settings.mask!;
  const neighbors = (index: number): number[] => {
    const x = index % width; const y = Math.floor(index / width); const out: number[] = [];
    if (x > 0 && mask[index - 1]) out.push(index - 1);
    if (x + 1 < width && mask[index + 1]) out.push(index + 1);
    if (y > 0 && mask[index - width]) out.push(index - width);
    if (y + 1 < height && mask[index + width]) out.push(index + width);
    return out;
  };
  const found = new Set<number>([start]); const pending = [start];
  while (pending.length) for (const next of neighbors(pending.pop()!)) if (!found.has(next) && board[next]?.colour === stone.colour) { found.add(next); pending.push(next); }
  return [...found].sort((a, b) => a - b);
}
/** Starts a fresh attempt from the identical seeded board or preserved challenge definition. */
export function restartGame(state: GameState): GameState {
  if (state.settings.mode === 'challenge') return createChallenge(state.challenge!);
  if (state.settings.mode === 'daily') return createGame({ mode: 'daily', dailyDate: state.settings.dailyDate });
  const { settings } = state;
  const mode: 'relaxed' | 'arcade' = settings.mode === 'arcade' ? 'arcade' : 'relaxed';
  return createGame({ mode, colourCount: settings.colourCount, seed: settings.seed, tools: settings.tools, ...(settings.shape ? { shape: settings.shape } : { width: settings.width, height: settings.height, ...(settings.mask.every(Boolean) ? {} : { mask: settings.mask }) }) });
}

/** Encodes the canonical initial configuration, accepted replay actions, and a derived checkpoint. */
export function encodeGame(state: GameState): string {
  // Undo frames are derived by replaying committed actions; storing their full board snapshots scales poorly on deep boards.
  const { history: _history, ...checkpoint } = state;
  const encoded = JSON.stringify({ format: 1, game: state.game, rules: state.rules, settings: state.settings, challenge: state.challenge, actions: state.recording, checkpoint });
  if (new TextEncoder().encode(encoded).length > 2 * 1024 * 1024) throw new RangeError('Save exceeds 2 MiB');
  return encoded;
}

function stable(value: unknown, depth = 0): string {
  if (depth > 50) throw new TypeError('Save checkpoint is nested too deeply');
  if (Array.isArray(value)) return `[${value.map(item => stable(item, depth + 1)).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).filter(([, item]) => item !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item, depth + 1)}`).join(',')}}`;
  return JSON.stringify(value) ?? 'null';
}
function applyUiSelection(state: GameState, stoneId: number | null): GameState {
  if (stoneId === null) return { ...state, selectedId: null, selectedIds: Object.freeze([]), previewScore: 0 };
  const at = indexOfId(state.board, stoneId);
  if (at < 0) throw new TypeError('Checkpoint selection names an unknown stone');
  const cells = groupAt(state.board, state.settings, at);
  if (cells.length < 2) throw new TypeError('Checkpoint selection is not a legal group');
  const ids = cells.map(cell => state.board[cell]!.id);
  return { ...state, selectedId: stoneId, selectedIds: Object.freeze(ids), previewScore: groupScore(ids.length), selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]) };
}
function stateFromInitial(settings: Settings, challenge: ChallengeDefinition | null): GameState {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new TypeError('Save has invalid initial settings');
  const settingsKeys = ['mode', 'width', 'height', 'colourCount', 'seed', 'shape', 'mask', 'dailyDate', 'challengeId', 'goal', 'moveLimit', 'tools'];
  if (Object.keys(settings).some(key => !settingsKeys.includes(key))) throw new TypeError('Initial settings contain unsupported fields');
  if (settings.mode === 'challenge') {
    if (!challenge) throw new TypeError('Challenge save has no initial challenge definition');
    const state = createChallenge(challenge);
    if (stable(state.settings) !== stable(settings)) throw new TypeError('Challenge settings do not match the initial definition');
    return state;
  }
  if (challenge !== null) throw new TypeError('Score-game save cannot contain a challenge definition');
  const options: CreateOptions = settings.mode === 'daily'
    ? { mode: 'daily', dailyDate: settings.dailyDate }
    : { mode: settings.mode, colourCount: settings.colourCount, seed: settings.seed, tools: settings.tools, ...(settings.shape ? { shape: settings.shape } : { width: settings.width, height: settings.height, ...(settings.mask.every(Boolean) ? {} : { mask: settings.mask }) }) };
  const state = createGame(options);
  if (stable(state.settings) !== stable(settings)) throw new TypeError('Initial settings are not canonical');
  return state;
}

/** Reconstructs and validates a bounded replay before accepting its checkpoint. */
export function decodeGame(text: string): GameState {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > 2 * 1024 * 1024) throw new RangeError('Save must be text no larger than 2 MiB');
  let value: { format?: number; game?: string; rules?: string; settings?: Settings; challenge?: ChallengeDefinition | null; actions?: unknown[]; checkpoint?: GameState };
  try { value = JSON.parse(text) as typeof value; } catch { throw new TypeError('Save is not valid JSON'); }
  if (!value || value.format !== 1 || value.game !== 'stone-collapse' || value.rules !== RULES || !value.settings || !Array.isArray(value.actions) || !value.checkpoint) throw new TypeError('Unsupported or invalid Stone Collapse save');
  if (Object.keys(value).some(key => !['format', 'game', 'rules', 'settings', 'challenge', 'actions', 'checkpoint'].includes(key))) throw new TypeError('Save contains unsupported fields');
  if (value.actions.length > MAX_RECORDED_ACTIONS) throw new RangeError('Save exceeds 100,000 replay entries');
  let state = stateFromInitial(value.settings, value.challenge ?? null);
  let totalTicks = 0;
  for (let index = 0; index < value.actions.length; index++) {
    const raw = value.actions[index];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new TypeError(`Invalid replay entry ${index + 1}`);
    const entry = raw as RecordedAction;
    if (entry.kind === 'remove') {
      if (Object.keys(entry).some(key => !['kind', 'move', 'stoneId'].includes(key))) throw new TypeError(`Removal record ${index + 1} contains unsupported fields`);
      if (!Number.isSafeInteger(entry.move) || entry.move !== state.moves + 1 || !Number.isSafeInteger(entry.stoneId)) throw new TypeError(`Invalid removal record ${index + 1}`);
      const at = indexOfId(state.board, entry.stoneId);
      if (at < 0) throw new TypeError(`Illegal removal record ${index + 1}: unknown stone`);
      const groupIds = groupAt(state.board, state.settings, at).map(cell => state.board[cell]!.id);
      const alreadySelected = state.selectedIds.length === groupIds.length && groupIds.every(id => state.selectedIds.includes(id));
      const selected = alreadySelected ? { state, accepted: true } as Transition : applyAction(state, { kind: 'select', stoneId: entry.stoneId });
      if (!selected.accepted) throw new TypeError(`Illegal removal record ${index + 1}: ${(selected as Transition).reason}`);
      const committed = applyAction(selected.state, { kind: 'confirm' });
      if (!committed.accepted || committed.state.moves !== entry.move) throw new TypeError(`Illegal removal record ${index + 1}: ${committed.reason ?? 'wrong move number'}`);
      state = committed.state;
    } else if (entry.kind === 'select-tool') {
      if (Object.keys(entry).some(key => !['kind', 'tool'].includes(key)) || !['bomb', 'pick'].includes(entry.tool)) throw new TypeError(`Invalid tool selection record ${index + 1}`);
      const result = applyAction(state, { kind: 'select-tool', tool: entry.tool });
      if (!result.accepted) throw new TypeError(`Illegal tool selection record ${index + 1}: ${result.reason}`);
      state = result.state;
    } else if (entry.kind === 'target-tool') {
      if (Object.keys(entry).some(key => !['kind', 'cell'].includes(key)) || !Number.isSafeInteger(entry.cell)) throw new TypeError(`Invalid tool target record ${index + 1}`);
      const result = applyAction(state, { kind: 'target-tool', cell: entry.cell });
      if (!result.accepted) throw new TypeError(`Illegal tool target record ${index + 1}: ${result.reason}`);
      state = result.state;
    } else if (entry.kind === 'confirm-tool') {
      if (Object.keys(entry).some(key => !['kind', 'move'].includes(key)) || !Number.isSafeInteger(entry.move) || entry.move !== state.moves + 1) throw new TypeError(`Invalid tool-use record ${index + 1}`);
      const result = applyAction(state, { kind: 'confirm-tool' });
      if (!result.accepted || result.state.moves !== entry.move) throw new TypeError(`Illegal tool-use record ${index + 1}: ${result.reason ?? 'wrong move number'}`);
      state = result.state;
    } else if (entry.kind === 'cancel-tool') {
      if (Object.keys(entry).some(key => key !== 'kind')) throw new TypeError(`Tool cancellation record ${index + 1} contains unsupported fields`);
      const result = applyAction(state, { kind: 'cancel-tool' });
      if (!result.accepted) throw new TypeError(`Illegal tool cancellation record ${index + 1}: ${result.reason}`);
      state = result.state;
    } else if (entry.kind === 'undo') {
      if (Object.keys(entry).some(key => !['kind', 'move'].includes(key))) throw new TypeError(`Undo record ${index + 1} contains unsupported fields`);
      if (!Number.isSafeInteger(entry.move) || entry.move !== state.moves - 1) throw new TypeError(`Invalid undo record ${index + 1}`);
      const result = undo(state);
      if (!result.accepted || result.state.moves !== entry.move) throw new TypeError(`Illegal undo record ${index + 1}`);
      state = result.state;
    } else if (entry.kind === 'hint') {
      if (Object.keys(entry).some(key => !['kind', 'witnessIndex'].includes(key))) throw new TypeError(`Hint record ${index + 1} contains unsupported fields`);
      if (!Number.isSafeInteger(entry.witnessIndex) || entry.witnessIndex !== state.witnessIndex) throw new TypeError(`Invalid hint record ${index + 1}`);
      const result = requestHint(state);
      if (!result.accepted) throw new TypeError(`Illegal hint record ${index + 1}: ${result.reason}`);
      state = result.state;
    } else if (entry.kind === 'ticks') {
      if (Object.keys(entry).some(key => !['kind', 'count'].includes(key))) throw new TypeError(`Tick record ${index + 1} contains unsupported fields`);
      if (!Number.isSafeInteger(entry.count) || entry.count < 1 || (totalTicks += entry.count) > MAX_RECORDED_TICKS) throw new RangeError(`Invalid tick record ${index + 1}`);
      let remaining = entry.count;
      while (remaining > 0) {
        const amount = Math.min(3600, remaining); const prior = state.elapsedTicks;
        state = advanceTicks(state, amount).state;
        const advanced = state.elapsedTicks - prior;
        if (advanced !== amount) throw new TypeError(`Ticks continue after the run stopped at replay entry ${index + 1}`);
        remaining -= amount;
      }
    } else throw new TypeError(`Unknown replay entry ${index + 1}`);
  }
  const checkpoint = value.checkpoint as GameState;
  try {
    if (checkpoint.selectedId !== state.selectedId) state = applyUiSelection(state, checkpoint.selectedId ?? null);
    const checkpointHasHistory = Object.hasOwn(checkpoint, 'history');
    const { history: _history, ...derivedCheckpoint } = state;
    if (stable(checkpointHasHistory ? state : derivedCheckpoint) !== stable(checkpoint)) throw new TypeError('Save checkpoint does not match its action recording');
  } catch (error) {
    if (error instanceof TypeError && error.message.startsWith('Save checkpoint')) throw error;
    throw new TypeError('Save checkpoint is invalid or does not match its action recording');
  }
  return state;
}
