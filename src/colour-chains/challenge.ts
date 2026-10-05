import { applyAction, advanceTicks, initialChallengeState } from './engine.js';
import { StoneChainsOptionsError, validateChallengeGoal, validateSize } from './validation.js';
import type { ChallengeOptions, Colour, GameState, Gem, Orientation, Settings, Transition, WitnessStep } from './types.js';
const COLOUR_NAMES: readonly Colour[] = ['red', 'blue', 'green', 'gold', 'purple', 'teal'];
const ORIENTATIONS: readonly Orientation[] = ['up', 'right', 'down', 'left'];
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).filter(([, item]) => item !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(',')}}`;
  return JSON.stringify(value) ?? 'null';
}
function solveWitness(start: GameState, witness: readonly WitnessStep[]): GameState {
  let state = start; let work = 0;
  const act = (kind: Parameters<typeof applyAction>[1]['kind']): void => {
    const result = applyAction(state, { kind } as Parameters<typeof applyAction>[1]);
    if (!result.accepted) throw new StoneChainsOptionsError('invalid-witness', `Witness action ${kind} was rejected: ${result.reason}`);
    state = result.state; if (++work > 100_000) throw new StoneChainsOptionsError('witness-work-limit', 'Challenge witness exceeds bounded verification work');
  };
  for (let stepIndex = 0; stepIndex < witness.length; stepIndex++) {
    const step = witness[stepIndex]!;
    if (state.phase !== 'falling' || !state.active) break;
    const rotateToward = (target: Orientation): void => {
      for (let count = 0; state.active!.orientation !== target && count < 4; count++) act('rotate-clockwise');
      if (state.active!.orientation !== target) throw new StoneChainsOptionsError('invalid-witness', `Witness step ${stepIndex + 1} cannot reach its orientation`);
    };
    for (let count = 0; state.active!.pivot.x !== step.pivotX && count < 12; count++) act(state.active!.pivot.x < step.pivotX ? 'right' : 'left');
    if (state.active!.pivot.x !== step.pivotX) throw new StoneChainsOptionsError('invalid-witness', `Witness step ${stepIndex + 1} cannot reach its pivot column`);
    rotateToward(step.orientation);
    for (let count = 0; state.active!.pivot.x !== step.pivotX && count < 12; count++) act(state.active!.pivot.x < step.pivotX ? 'right' : 'left');
    if (state.active!.pivot.x !== step.pivotX) throw new StoneChainsOptionsError('invalid-witness', `Witness step ${stepIndex + 1} cannot finish at its pivot column`);
    act('hard-drop');
    while (['clear-mark', 'clear-remove', 'gravity'].includes(state.phase) && work < 100_000) {
      const result = advanceTicks(state, 3600); state = result.state; work += 3600;
    }
    if (state.phase === 'lost' || state.phase === 'finished') throw new StoneChainsOptionsError('invalid-witness', `Witness ends before its goal after pair ${stepIndex + 1}`);
    if (state.phase === 'won') {
      if (stepIndex !== witness.length - 1) throw new StoneChainsOptionsError('witness-after-goal', 'Witness must stop at the first completed goal');
      return state;
    }
  }
  if (state.phase !== 'won') throw new StoneChainsOptionsError('witness-does-not-win', 'Witness does not complete the challenge goal within its finite queue');
  return state;
}
/** Validates and creates a finite witnessed challenge. Hints use only the supplied verified pair placements. */
export function createChallenge(options: ChallengeOptions): GameState {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new StoneChainsOptionsError('invalid-challenge', 'Challenge options must be an object');
  const allowed = ['id', 'width', 'height', 'colourCount', 'seed', 'board', 'queue', 'goal', 'witness'];
  if (Object.keys(options).some(key => !allowed.includes(key))) throw new StoneChainsOptionsError('unknown-challenge-option', 'Challenge options contain unsupported fields');
  if (typeof options.id !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,63}$/.test(options.id)) throw new StoneChainsOptionsError('invalid-challenge-id', 'Challenge ID must be stable lowercase text');
  const width = options.width ?? 6; const height = options.height ?? 12; validateSize(width, height);
  const colourCount = options.colourCount ?? 4;
  if (colourCount !== 4 && colourCount !== 5 && colourCount !== 6) throw new StoneChainsOptionsError('invalid-colour-count', 'Challenge colour count must be 4, 5 or 6');
  const seed = options.seed ?? `challenge:${options.id}`;
  if (typeof seed !== 'string' || seed.length < 1 || seed.length > 200) throw new StoneChainsOptionsError('invalid-seed', 'Seed must contain 1–200 characters');
  if (!Array.isArray(options.board) || options.board.length !== width * height) throw new StoneChainsOptionsError('invalid-challenge-board', 'Challenge board must contain width × height visible cells');
  if (!Array.isArray(options.queue) || options.queue.length < 2 || options.queue.length > 12) throw new StoneChainsOptionsError('invalid-challenge-queue', 'Challenge queue must contain 2–12 pairs');
  const allowedColours = COLOUR_NAMES.slice(0, colourCount); const ids = new Set<number>();
  const board = options.board.map((gem, index): Gem | null => {
    if (gem === null) return null;
    if (!gem || typeof gem !== 'object' || Array.isArray(gem) || Object.keys(gem).some(key => key !== 'id' && key !== 'colour') || !Number.isSafeInteger(gem.id) || gem.id < 1 || gem.id > 0x7fff_ffff || ids.has(gem.id) || !allowedColours.includes(gem.colour)) throw new StoneChainsOptionsError('invalid-challenge-gem', `Invalid challenge gem at cell ${index}`);
    ids.add(gem.id); return Object.freeze({ id: gem.id, colour: gem.colour });
  });
  for (let x = 0; x < width; x++) { let gap = false; for (let y = height - 1; y >= 0; y--) { if (board[y * width + x] === null) gap = true; else if (gap) throw new StoneChainsOptionsError('unstable-challenge-board', `Starting column ${x} is not gravity-stable`); } }
  const queue = options.queue.map((pair, index) => {
    if (!Array.isArray(pair) || pair.length !== 2 || pair.some(colour => !allowedColours.includes(colour))) throw new StoneChainsOptionsError('invalid-challenge-pair', `Invalid queue pair ${index + 1}`);
    return Object.freeze([pair[0], pair[1]]) as readonly [Colour, Colour];
  });
  const goal = validateChallengeGoal(options.goal, ids);
  if (!Array.isArray(options.witness) || options.witness.length < 1 || options.witness.length > queue.length) throw new StoneChainsOptionsError('invalid-witness', 'A challenge requires a complete witness of 1–12 pair placements');
  const witness = options.witness.map((step, index): WitnessStep => {
    if (!step || typeof step !== 'object' || Array.isArray(step) || Object.keys(step).some(key => key !== 'pivotX' && key !== 'orientation') || !Number.isInteger(step.pivotX) || step.pivotX < 0 || step.pivotX >= width || !ORIENTATIONS.includes(step.orientation)) throw new StoneChainsOptionsError('invalid-witness-step', `Invalid witness placement ${index + 1}`);
    return Object.freeze({ pivotX: step.pivotX, orientation: step.orientation });
  });
  const settings: Settings = Object.freeze({ mode: 'challenge', width, height, colourCount, seed, challengeId: options.id, goal, initialBoard: Object.freeze(board), queue: Object.freeze(queue), witness: Object.freeze(witness) });
  const state = initialChallengeState(settings, settings.initialBoard!, settings.queue!);
  const solved = solveWitness(state, witness);
  if (solved.phase !== 'won' || stable(solved.settings) !== stable(settings)) throw new StoneChainsOptionsError('invalid-witness', 'Challenge witness validation failed');
  return state;
}
