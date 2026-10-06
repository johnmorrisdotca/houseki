import type { Action } from './types.js';
type HoldAction = 'left' | 'right' | 'soft-drop';
/** Snapshot of deterministic held-input state at a logical tick boundary. */
export interface InputSchedulerState { readonly held: Readonly<Partial<Record<HoldAction, number>>>; readonly queued: readonly Action[] }
/** Creates an empty fixed-tick input scheduler state. */
export function createInputScheduler(): InputSchedulerState { return { held: {}, queued: [] }; }
/** Starts or releases one held action; opposite lateral holds cancel during scheduling. */
export function setHeldAction(state: InputSchedulerState, action: HoldAction, held: boolean): InputSchedulerState {
  const next = { ...state.held };
  if (held) { if (next[action] === undefined) next[action] = 0; } else delete next[action];
  return { ...state, held: next };
}
/** Queues a one-shot cycle, drop, or pause edge for the next logical tick. */
export function queueInputEdge(state: InputSchedulerState, action: Action): InputSchedulerState {
  if (!['cycle-forward', 'cycle-backward', 'hard-drop', 'place', 'pause', 'resume'].includes(action.kind)) return state;
  return { ...state, queued: [...state.queued, action] };
}
/** Resolves canonical actions in the design's per-tick order. */
export function actionsForTick(state: InputSchedulerState): readonly [readonly Action[], InputSchedulerState] {
  const actions: Action[] = []; const held = { ...state.held };
  const left = held.left; const right = held.right;
  if (left !== undefined && right === undefined && (left === 0 || (left >= 10 && (left - 10) % 3 === 0))) actions.push({ kind: 'left' });
  if (right !== undefined && left === undefined && (right === 0 || (right >= 10 && (right - 10) % 3 === 0))) actions.push({ kind: 'right' });
  const edges = [...state.queued];
  actions.push(...edges.filter(item => item.kind === 'cycle-forward' || item.kind === 'cycle-backward'));
  actions.push(...edges.filter(item => item.kind === 'hard-drop' || item.kind === 'place'));
  if (held['soft-drop'] !== undefined && (held['soft-drop'] === 0 || held['soft-drop'] % 2 === 0)) actions.push({ kind: 'soft-drop' });
  actions.push(...edges.filter(item => item.kind === 'pause' || item.kind === 'resume'));
  for (const key of Object.keys(held) as HoldAction[]) held[key] = (held[key] ?? 0) + 1;
  return [actions, { held, queued: [] }];
}
/** Releases every held action after blur, pause, or pointer cancellation. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- the public signature takes the state a caller holds, though nothing of it is kept
export function releaseAllActions(state: InputSchedulerState): InputSchedulerState { return { held: {}, queued: [] }; }
