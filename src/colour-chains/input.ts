import type { Action, GameState, HeldControl, Transition } from './types.js';
type EdgeAction = Extract<Action, {kind: 'rotate-clockwise' | 'rotate-anticlockwise' | 'hard-drop' | 'place' | 'pause' | 'resume'}>;
/** Deterministic held-key snapshot. Counters measure logical ticks since each press. */
export interface InputSchedulerState { readonly held: Readonly<Partial<Record<HeldControl, number>>>; readonly queued: readonly EdgeAction[] }
/** Creates an empty held-input scheduler.
 *
 * @returns Creates an empty held-input scheduler.
 * @example
 * ```ts
 * import { createInputScheduler } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(Object.keys(createInputScheduler()));
 * ```
 */
export function createInputScheduler(): InputSchedulerState { return { held: Object.freeze({}), queued: Object.freeze([]) }; }
/** Starts or releases one held control. Repeated press edges do not reset its repeat counter.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param control - The native held-control name.
 * @param pressed - Whether this control is currently pressed.
 * @returns Starts or releases one held control. Repeated press edges do not reset its repeat counter.
 * @example
 * ```ts
 * import { createInputScheduler, setHeldInput } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const input=createInputScheduler();
 * console.log(setHeldInput(input,"left",true));
 * ```
 */
export function setHeldInput(state: InputSchedulerState, control: HeldControl, pressed: boolean): InputSchedulerState {
  const held = { ...state.held };
  if (pressed) { if (held[control] === undefined) held[control] = 0; } else delete held[control];
  return { ...state, held: Object.freeze(held) };
}
/** Queues a one-shot rotation, drop, Place, pause or resume edge for the next logical tick.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param action - One native action for this entry point; inspect accepted and reason on the result.
 * @returns Queues a one-shot rotation, drop, Place, pause or resume edge for the next logical tick.
 * @example
 * ```ts
 * import { createInputScheduler, queueInputEdge } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const input=createInputScheduler();
 * console.log(queueInputEdge(input,{kind:"hard-drop"}));
 * ```
 */
export function queueInputEdge(state: InputSchedulerState, action: EdgeAction): InputSchedulerState { return { ...state, queued: Object.freeze([...state.queued, action]) }; }
/** Releases every held or queued control after focus loss, lock, resolution or pause.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Releases every held or queued control after focus loss, lock, resolution or pause.
 * @example
 * ```ts
 * import { createInputScheduler, releaseAllInput } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const input=createInputScheduler();
 * console.log(releaseAllInput(input));
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- the public signature takes the state a caller holds, though nothing of it is kept
export function releaseAllInput(state: InputSchedulerState): InputSchedulerState { return createInputScheduler(); }
/** Resolves this tick's inputs in lateral, rotation, drop, soft-drop, pause order.
 *
 * @param game - The native game state used to resolve scheduled input.
 * @param input - The held-input scheduler state for this logical tick.
 * @returns Resolves this tick's inputs in lateral, rotation, drop, soft-drop, pause order.
 * @example
 * ```ts
 * import { actionsForTick, createGame, createInputScheduler } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const input=createInputScheduler();
 * console.log(actionsForTick(state,input)[0]);
 * ```
 */
export function actionsForTick(game: GameState, input: InputSchedulerState): readonly [readonly Action[], InputSchedulerState] {
  if (game.phase === 'paused') { const resume = input.queued.filter(action => action.kind === 'resume'); return [resume, createInputScheduler()]; }
  if (game.phase !== 'falling' || !game.active) { const pause = input.queued.filter(action => action.kind === 'pause'); return [pause, createInputScheduler()]; }
  const actions: Action[] = []; const held = { ...input.held };
  const left = held.left; const right = held.right;
  if (left !== undefined && right === undefined && (left === 0 || left >= 10 && (left - 10) % 3 === 0)) actions.push({ kind: 'left' });
  if (right !== undefined && left === undefined && (right === 0 || right >= 10 && (right - 10) % 3 === 0)) actions.push({ kind: 'right' });
  const edges = [...input.queued];
  actions.push(...edges.filter(action => action.kind === 'rotate-clockwise' || action.kind === 'rotate-anticlockwise'));
  actions.push(...edges.filter(action => action.kind === 'hard-drop' || action.kind === 'place'));
  const soft = held['soft-drop']; if (soft !== undefined && (soft === 0 || soft % 2 === 0)) actions.push({ kind: 'down' });
  actions.push(...edges.filter(action => action.kind === 'pause' || action.kind === 'resume'));
  for (const control of Object.keys(held) as HeldControl[]) held[control] = (held[control] ?? 0) + 1;
  return [actions, { held: Object.freeze(held), queued: Object.freeze([]) }];
}
/** Applies a scheduler batch until the pair locks or the run pauses; accepted actions are recorded by the engine.
 *
 * @param game - The native game state used to resolve scheduled input.
 * @param input - The held-input scheduler state for this logical tick.
 * @param actions - Native actions in the scheduler’s canonical order.
 * @param applyAction - The native applyAction function for this game.
 * @returns Applies a scheduler batch until the pair locks or the run pauses; accepted actions are recorded by the engine.
 * @example
 * ```ts
 * import { applyAction, applyScheduledActions, createGame, createInputScheduler } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { Action } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const action: Action={kind:"left"};
 * const input=createInputScheduler();
 * console.log(applyScheduledActions(state,input,[action],applyAction)[0].phase);
 * ```
 */
export function applyScheduledActions(game: GameState, input: InputSchedulerState, actions: readonly Action[], applyAction: (state: GameState, action: Action) => Transition): readonly [GameState, InputSchedulerState, readonly Transition[]] {
  let state = game; const transitions: Transition[] = [];
  for (const action of actions) {
    if (state.phase !== 'falling' && action.kind !== 'pause' && action.kind !== 'resume') break;
    if (state.phase === 'falling' && !state.active && action.kind !== 'pause') break;
    const result = applyAction(state, action); transitions.push(result); if (result.accepted) state = result.state;
    if (result.accepted && (action.kind === 'hard-drop' || action.kind === 'place' || action.kind === 'pause')) break;
  }
  const lockedOrPaused = transitions.some(result => result.events.some(event => event.type === 'pair-locked' || event.type === 'paused')) || state.phase !== 'falling';
  return [state, lockedOrPaused ? createInputScheduler() : input, transitions];
}

/** Applies a complete deterministic held-input and simulation tick, releasing controls on lock or resolution.
 *
 * @param game - The native game state used to resolve scheduled input.
 * @param input - The held-input scheduler state for this logical tick.
 * @param apply - The native applyAction function for this game.
 * @param tick - The native advanceTicks function for this game.
 * @returns Applies a complete deterministic held-input and simulation tick, releasing controls on lock or resolution.
 * @example
 * ```ts
 * import { advanceTicks, applyAction, createGame, createInputScheduler, processInputTick } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const input=createInputScheduler();
 * console.log(processInputTick(state,input,applyAction,advanceTicks)[0].phase);
 * ```
 */
export function processInputTick(game: GameState, input: InputSchedulerState, apply: (state: GameState, action: Action) => Transition, tick: (state: GameState, ticks: number) => Transition): readonly [GameState, InputSchedulerState, readonly Transition[]] {
  const [actions, scheduled] = actionsForTick(game, input);
  const [afterInput, retained, transitions] = applyScheduledActions(game, scheduled, actions, apply);
  const clock = tick(afterInput, 1); const nextGame = clock.state;
  const pairId = (state: GameState): number | null => state.active?.gems[0].id ?? null;
  const pairChanged = pairId(game) !== pairId(nextGame);
  const locked = transitions.some(result => result.events.some(event => event.type === 'pair-locked')) || clock.events.some(event => event.type === 'pair-locked');
  const nextInput = locked || pairChanged || nextGame.phase !== 'falling' ? createInputScheduler() : retained;
  return [nextGame, nextInput, [...transitions, clock]];
}
