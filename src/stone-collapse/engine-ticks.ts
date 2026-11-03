import { emptyTransition, terminal } from "./engine-resolve.js";
import { GRAVITY_TICKS, MARK_TICKS, MAX_RECORDED_ACTIONS, MAX_RECORDED_TICKS, REMOVE_TICKS } from "./engine-setup.js";
import type { GameEvent, GameState, Transition } from "./types.js";

/** Advances the observable 7/6/9 tick removal and gravity stages, bounded to 3600 ticks.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param ticks - The nonnegative number of fixed 60 Hz logical ticks to advance.
 * @returns Advances the observable 7/6/9 tick removal and gravity stages, bounded to 3600 ticks.
 * @example
 * ```ts
 * import { advanceTicks, createGame } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * console.log(advanceTicks(state,1).state.phase);
 * ```
 */
export function advanceTicks(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600)
    throw new RangeError("ticks must be an integer from 0 to 3600");
  if (state.elapsedTicks + ticks > MAX_RECORDED_TICKS)
    throw new RangeError("recording exceeds 10,000,000 logical ticks");
  let current = state;
  const events: GameEvent[] = [];
  for (let i = 0; i < ticks; i++) {
    if (current.phase === "won" || current.phase === "lost" || current.phase === "finished") break;
    if (current.phase === "ready") break;
    current = { ...current, elapsedTicks: current.elapsedTicks + 1 };
    const resolutionTick = current.resolutionTick + 1;
    if (current.phase === "clear-mark" && resolutionTick >= MARK_TICKS) {
      const pending = new Set(current.pendingIds);
      const board = Object.freeze(current.board.map((stone) => (stone && pending.has(stone.id) ? null : stone)));
      current = {
        ...current,
        board,
        removed: current.removed + current.pendingIds.length,
        phase: "clear-remove",
        resolutionTick: 0,
      };
      events.push({ type: "removal-started", ids: current.pendingIds, board: current.board });
    } else if (current.phase === "clear-remove" && resolutionTick >= REMOVE_TICKS) {
      current = { ...current, phase: "gravity", resolutionTick: 0 };
      events.push({ type: "gravity-started", board: current.board, settledBoard: current.gravityBoard });
    } else if (current.phase === "gravity" && resolutionTick >= GRAVITY_TICKS) {
      current = {
        ...current,
        board: current.gravityBoard ?? current.board,
        gravityBoard: null,
        phase: "ready",
        resolutionTick: 0,
        pendingIds: Object.freeze([]),
      };
      events.push({ type: "gravity-completed", board: current.board });
      const ended = terminal(current);
      current = ended[0];
      events.push(...ended[1]);
    } else current = { ...current, resolutionTick };
  }
  const advanced = current.elapsedTicks - state.elapsedTicks;
  if (advanced > 0) {
    if (current.recording.length >= MAX_RECORDED_ACTIONS) return emptyTransition(state, "recording-action-limit");
    const recording = [...current.recording];
    const last = recording.at(-1);
    if (last?.kind === "ticks") recording[recording.length - 1] = { kind: "ticks", count: last.count + advanced };
    else recording.push({ kind: "ticks", count: advanced });
    current = { ...current, recording: Object.freeze(recording) };
  }
  return { state: current, events: Object.freeze(events), accepted: true };
}
