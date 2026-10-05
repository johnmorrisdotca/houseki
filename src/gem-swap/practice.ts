import { findMatches, listLegalSwaps } from './board.js';
import { nextInt } from './random.js';
import type { GameState, Gem, ReplayOperation, Transition } from './types.js';

function rejected(state: GameState, reason: string): Transition { return { state, events: Object.freeze([]), accepted: false, reason }; }
function onReady(state: GameState): boolean { return state.phase === 'ready' && findMatches(state.board, state.settings).length === 0; }

export function undoTransition(state: GameState, replay: (options: GameState['initialOptions'], operations: readonly ReplayOperation[]) => GameState): Transition {
  if (!['relaxed', 'challenge'].includes(state.mode) || state.phase !== 'ready' || state.selectedTool) return rejected(state, 'undo-unavailable');
  const outstanding: number[] = [];
  state.history.forEach((operation, index) => { if (operation.kind !== 'action') return; if (operation.action.kind === 'swap') outstanding.push(index); else if (operation.action.kind === 'undo') outstanding.pop(); });
  const lastSwap = outstanding.at(-1) ?? -1;
  if (lastSwap < 0) return rejected(state, 'nothing-to-undo');
  let restored: GameState;
  try { restored = replay(state.initialOptions, state.history.slice(0, lastSwap)); } catch { return rejected(state, 'undo-unavailable'); }
  return { state: Object.freeze({ ...restored, assisted: true, history: state.history }), events: Object.freeze([{ type: 'move-undone', moves: restored.moves, assisted: true }]), accepted: true };
}

export function hintTransition(state: GameState): Transition {
  if (!onReady(state) || state.selectedTool) return rejected(state, 'hint-unavailable');
  const witness = listLegalSwaps(state)[0];
  if (!witness) return rejected(state, 'no-legal-swap');
  return { state: Object.freeze({ ...state, assisted: true }), events: Object.freeze([{ type: 'hint', action: witness, guarantee: 'legal-only' }]), accepted: true };
}

export function reshuffleTransition(state: GameState): Transition {
  const finishedRelaxed = state.mode === 'relaxed' && state.phase === 'finished' && state.outcome === 'finished' && !findMatches(state.board, state.settings).length;
  if (state.mode !== 'relaxed' || (!onReady(state) && !finishedRelaxed) || state.selectedTool) return rejected(state, 'reshuffle-unavailable');
  const gems = state.board.filter((item): item is Gem => item !== null); let randomState = state.randomState;
  for (let attempt = 0; attempt < 128; attempt++) {
    const shuffled = [...gems];
    for (let index = shuffled.length - 1; index > 0; index--) { const [pick, next] = nextInt(randomState, index + 1); randomState = next; [shuffled[index], shuffled[pick]] = [shuffled[pick]!, shuffled[index]!]; }
    const board = [...state.board]; let at = 0;
    for (let index = 0; index < board.length; index++) if (state.settings.mask[index]) board[index] = shuffled[at++]!;
    if (!findMatches(board, state.settings).length && listLegalSwaps({ ...state, board }).length) {
      return { state: Object.freeze({ ...state, board: Object.freeze(board), randomState, assisted: true, phase: 'ready', outcome: null, selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]) }), events: Object.freeze([{ type: 'board-reshuffled', attempts: attempt + 1, assisted: true }]), accepted: true };
    }
  }
  return rejected(state, 'reshuffle-failed');
}
