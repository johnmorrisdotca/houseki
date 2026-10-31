import { core, drawQueue, floorAt, freezeBlock, freezeState, gravityResult, place, spawn } from "./engine-core.js";
import { canPlace, GRAVITY_TICKS, MARK_TICKS, matchGroups, REMOVE_TICKS, removeIds, settle } from "./physics.js";
import { seedState } from "./random.js";
import type { Action, Colour, GameEvent, GameState, GameStatus, RecordedAction, Transition } from "./types.js";
import { validateOptions } from "./validation.js";

/** Creates an immutable seeded 2×2-block game with a fixed queue and explicit floor schedule.
 *
 * @param options - Validated native creation, authored challenge, or environment options described by this signature.
 * @returns Creates an immutable seeded 2×2-block game with a fixed queue and explicit floor schedule.
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * console.log(createGame({seed:"docs"}).phase);
 * ```
 */
export function createGame(options: import("./types.js").CreateOptions = {}): GameState {
  const valid = validateOptions(options);
  let randomState: number;
  let queue: readonly (readonly [Colour, Colour, Colour, Colour])[];
  if (valid.queue) {
    queue = valid.queue;
    randomState = seedState(`magnetic-blocks|magnetic-blocks-1|${String(valid.seed)}`);
  } else {
    const generated = drawQueue(valid.seed, valid.pieceLimit, valid.colourCount);
    queue = generated.queue;
    randomState = generated.randomState;
  }
  const nextId = Math.max(0, ...valid.initialBoard.flatMap((gem) => (gem ? [gem.id] : []))) + 1;
  const settings = Object.freeze({
    mode: valid.mode,
    width: valid.width,
    height: valid.height,
    colourCount: valid.colourCount,
    seed: valid.seed,
    mask: valid.mask,
    schedule: valid.schedule,
    floorSwitch: valid.floorSwitch,
    magneticImpact: valid.magneticImpact,
    pieceLimit: valid.pieceLimit,
    initialBoard: valid.initialBoard,
    bonds: valid.bonds,
    ...(valid.queue ? { initialQueue: valid.queue } : {}),
    ...(valid.goal ? { goal: valid.goal } : {}),
  });
  const state: GameState = {
    game: "magnetic-blocks",
    rules: "magnetic-blocks-1",
    settings,
    board: valid.initialBoard,
    bonds: valid.bonds,
    active: null,
    queue,
    randomState,
    nextId,
    phase: "falling",
    score: 0,
    moves: 0,
    placements: 0,
    chain: 0,
    maxChain: 0,
    floor: floorAt(valid.schedule, 1),
    nextFloor: floorAt(valid.schedule, 2),
    floorSwitchCharges: valid.floorSwitch ? 1 : 0,
    pendingFloorOverride: null,
    pendingClear: Object.freeze([]),
    gravityBoard: null,
    resolutionTick: 0,
    impactRemovedIds: Object.freeze([]),
    elapsedTicks: 0,
    recording: Object.freeze([]),
  };
  if (matchGroups(state.board, valid.width, valid.height, valid.mask).length)
    throw new RangeError("Initial board must not contain a clearable group");
  const [started] = spawn(state);
  return freezeState(started);
}
/** Applies one movement, rotation, floor-switch or placement action without mutation.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param action - One native action for this entry point; inspect accepted and reason on the result.
 * @returns Applies one movement, rotation, floor-switch or placement action without mutation.
 * @example
 * ```ts
 * import { applyAction, createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * import type { Action } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * const action: Action={kind:"left"};
 * console.log(applyAction(state,action).accepted);
 * ```
 */
export function applyAction(state: GameState, action: Action): Transition {
  const result = core(state, action);
  if (!result.accepted) return { ...result, state: freezeState(result.state) };
  const previous = state.recording.at(-1);
  const ordinal = previous?.tick === state.elapsedTicks ? previous.ordinal + 1 : 0;
  const recorded: RecordedAction = Object.freeze({
    tick: state.elapsedTicks,
    ordinal,
    action: Object.freeze({ ...action }),
  });
  const next = freezeState({ ...result.state, recording: Object.freeze([...state.recording, recorded]) });
  return { ...result, state: next };
}
/** Advances fixed 60 Hz time, resolving phases in all modes and falling/locking only in Arcade.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param ticks - The nonnegative number of fixed 60 Hz logical ticks to advance.
 * @returns Advances fixed 60 Hz time, resolving phases in all modes and falling/locking only in Arcade.
 * @example
 * ```ts
 * import { advanceTicks, createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(advanceTicks(state,1).state.phase);
 * ```
 */
export function advanceTicks(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600)
    throw new RangeError("ticks must be an integer from 0 to 3600");
  let current = state;
  const events: GameEvent[] = [];
  for (let i = 0; i < ticks; i++) {
    if (["paused", "won", "lost", "finished"].includes(current.phase)) break;
    if (current.phase === "falling" && !current.active) break;
    current = { ...current, elapsedTicks: current.elapsedTicks + 1 };
    if (current.phase === "falling") {
      if (current.settings.mode === "relaxed" || !current.active) continue;
      const active = current.active;
      const grounded = !canPlace(
        { ...active, y: active.y + 1 },
        current.board,
        current.settings.width,
        current.settings.height,
        current.settings.mask,
      );
      if (grounded) {
        const lockTicks = active.lockStarted ? active.lockTicks + 1 : 0;
        current = { ...current, active: freezeBlock({ ...active, lockStarted: true, lockTicks }) };
        if (lockTicks >= 24) {
          const result = place(current, { kind: "land" });
          current = result.state;
          events.push(...result.events);
        }
        continue;
      }
      const interval = Math.max(6, Math.round(60 * 0.85 ** Math.floor(current.placements / 30)));
      if (active.descent + 1 >= interval) {
        const fallen = freezeBlock({ ...active, y: active.y + 1, descent: 0 });
        const nowGrounded = !canPlace(
          { ...fallen, y: fallen.y + 1 },
          current.board,
          current.settings.width,
          current.settings.height,
          current.settings.mask,
        );
        current = {
          ...current,
          active: freezeBlock({
            ...fallen,
            lockStarted: nowGrounded ? true : active.lockResets < 8 ? false : active.lockStarted,
            lockTicks: nowGrounded || active.lockResets >= 8 ? active.lockTicks : 0,
          }),
        };
        events.push({
          type: "piece-fell",
          id: active.gems[0].id,
          fromY: active.y,
          toY: active.y + 1,
          grounded: nowGrounded,
        });
      } else
        current = {
          ...current,
          active: freezeBlock({
            ...active,
            descent: active.descent + 1,
            ...(active.lockResets < 8 ? { lockTicks: 0, lockStarted: false } : {}),
          }),
        };
      continue;
    }
    const resolutionTick = current.resolutionTick + 1;
    current = { ...current, resolutionTick };
    if (current.phase === "clear-mark" && resolutionTick >= MARK_TICKS) {
      const removed = removeIds(current.board, current.bonds, current.pendingClear);
      const remainingIds = new Set(removed.board.flatMap((gem) => (gem ? [gem.id] : [])));
      const gravity = settle(
        removed.board,
        removed.bonds,
        current.floor,
        current.settings.width,
        current.settings.height,
        current.settings.mask,
      );
      const points = removed.ids.length * 10 * Math.max(1, current.chain);
      current = {
        ...current,
        board: removed.board,
        bonds: gravity.bonds,
        score: current.score + points,
        phase: "clear-remove",
        resolutionTick: 0,
        gravityBoard: gravity.board,
        pendingClear: Object.freeze([]),
      };
      events.push(
        { type: "cells-removed", ids: removed.ids, board: current.board, points, remainingIds: [...remainingIds] },
        { type: "score-changed", score: current.score, points },
      );
    } else if (current.phase === "clear-remove" && resolutionTick >= REMOVE_TICKS) {
      current = { ...current, phase: "gravity", resolutionTick: 0 };
      events.push({
        type: "gravity-started",
        floor: current.floor,
        board: current.board,
        settledBoard: current.gravityBoard,
      });
    } else if (current.phase === "gravity" && resolutionTick >= GRAVITY_TICKS) {
      const result = gravityResult(current);
      current = result[0];
      events.push(...result[1]);
    }
  }
  return { state: freezeState(current), events: Object.freeze(events), accepted: true };
}
/** Lists accepted controls for the current falling or resolution phase.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Lists accepted controls for the current falling or resolution phase.
 * @example
 * ```ts
 * import { createGame, legalActions } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(legalActions(state).length);
 * ```
 */
export function legalActions(state: GameState): readonly Action[] {
  if (state.phase === "paused") return Object.freeze([{ kind: "resume" }]);
  if (["clear-mark", "clear-remove", "gravity"].includes(state.phase)) return Object.freeze([{ kind: "pause" }]);
  if (state.phase === "falling" && state.active)
    return Object.freeze([
      ...(canPlace(
        { ...state.active, x: state.active.x - 1 },
        state.board,
        state.settings.width,
        state.settings.height,
        state.settings.mask,
      )
        ? [{ kind: "left" as const }]
        : []),
      ...(canPlace(
        { ...state.active, x: state.active.x + 1 },
        state.board,
        state.settings.width,
        state.settings.height,
        state.settings.mask,
      )
        ? [{ kind: "right" as const }]
        : []),
      { kind: "soft-drop" as const },
      { kind: "rotate-clockwise" as const },
      { kind: "rotate-anticlockwise" as const },
      { kind: "hard-drop" as const },
      { kind: "land" as const },
      ...(state.settings.floorSwitch && state.floorSwitchCharges
        ? [
            { kind: "set-floor-override" as const, floor: "calm" as const },
            { kind: "set-floor-override" as const, floor: "magnetic" as const },
          ]
        : []),
      ...(state.pendingFloorOverride ? [{ kind: "cancel-floor-override" as const }] : []),
      { kind: "pause" as const },
    ]);
  return Object.freeze([]);
}
/** Returns a compact immutable status including current and upcoming floor state.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Returns a compact immutable status including current and upcoming floor state.
 * @example
 * ```ts
 * import { createGame, statusOf } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * console.log(statusOf(state).phase);
 * ```
 */
export function statusOf(state: GameState): GameStatus {
  return Object.freeze({
    phase: state.phase,
    score: state.score,
    moves: state.moves,
    placements: state.placements,
    floor: state.pendingFloorOverride ?? state.floor,
    nextFloor: state.nextFloor,
    floorSwitchCharges: state.floorSwitchCharges,
    pendingFloorOverride: state.pendingFloorOverride,
    maxChain: state.maxChain,
    ...(state.reason ? { reason: state.reason } : {}),
  });
}
