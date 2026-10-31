import { consumePortal, contactCells } from "./black-hole.js";
import { findMatches, listLegalSwaps } from "./board.js";
import { gem } from "./engine-create.js";
import { drawColour } from "./random.js";
import { materializeSpecials, planWave } from "./specials.js";
import type { GameEvent, GameState, Gem, Goal, OrdinaryToolKind, ReplayOperation, Transition } from "./types.js";

export const TOOL_ORDER: readonly OrdinaryToolKind[] = ["bomb", "row-clear", "colour-clear"];

export function availableToolCount(state: GameState): number {
  return TOOL_ORDER.reduce<number>((count, tool) => count + state.inventory[tool], state.blackHoleCharges);
}
export function hasUsableTool(state: GameState): boolean {
  return (
    TOOL_ORDER.some((tool) => state.inventory[tool] > 0) ||
    (state.settings.advancedTools && state.blackHoleCharges > 0 && state.blackHole === null)
  );
}

export function appendHistory(state: GameState, operation: ReplayOperation): GameState {
  const previous = state.history.at(-1);
  if (operation.kind === "ticks" && previous?.kind === "ticks" && previous.count + operation.count <= 3600)
    return Object.freeze({
      ...state,
      history: Object.freeze([
        ...state.history.slice(0, -1),
        Object.freeze({ kind: "ticks", count: previous.count + operation.count }),
      ]),
    });
  if (operation.kind === "time" && previous?.kind === "time")
    return Object.freeze({
      ...state,
      history: Object.freeze([
        ...state.history.slice(0, -1),
        Object.freeze({ kind: "time", milliseconds: previous.milliseconds + operation.milliseconds }),
      ]),
    });
  return Object.freeze({ ...state, history: Object.freeze([...state.history, Object.freeze(operation)]) });
}

export function gravityBoard(state: GameState): readonly (Gem | null)[] {
  const { width, height, mask } = state.settings;
  const result = [...state.board];
  const blocked = (index: number) => !mask[index] || state.blackHole?.cell === index;
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && blocked(y * width + x)) y++;
      if (y >= height) break;
      const start = y;
      while (y < height && !blocked(y * width + x)) y++;
      const end = y;
      const survivors: Gem[] = [];
      for (let row = start; row < end; row++) {
        const item = state.board[row * width + x];
        if (item) survivors.push(item);
      }
      for (let row = start; row < end; row++) result[row * width + x] = null;
      for (let offset = 0; offset < survivors.length; offset++)
        result[(end - survivors.length + offset) * width + x] = survivors[offset]!;
    }
  }
  return Object.freeze(result);
}
export function refill(state: GameState): readonly [readonly (Gem | null)[], number, number, readonly GameEvent[]] {
  const { width, height, mask, colourCount } = state.settings;
  const board = [...state.board];
  let randomState = state.randomState;
  let nextId = state.nextId;
  const draws: GameEvent[] = [];
  const blocked = (index: number) => !mask[index] || state.blackHole?.cell === index;
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && blocked(y * width + x)) y++;
      if (y >= height) break;
      const start = y;
      while (y < height && !blocked(y * width + x)) y++;
      const end = y;
      for (let row = end - 1; row >= start; row--) {
        const index = row * width + x;
        if (board[index]) continue;
        const [colour, next] = drawColour(randomState, colourCount);
        randomState = next;
        board[index] = gem(nextId++, colour);
        draws.push({ type: "gem-refilled", id: nextId - 1, colour, cell: index });
      }
    }
  }
  return [Object.freeze(board), randomState, nextId, Object.freeze(draws)];
}
export function awardTools(
  state: GameState,
  removed: number,
): {
  readonly inventory: GameState["inventory"];
  readonly progress: number;
  readonly cursor: number;
  readonly events: readonly GameEvent[];
} {
  if (!state.settings.tools || state.toolWaveActive)
    return {
      inventory: state.inventory,
      progress: state.toolProgress,
      cursor: state.toolAwardCursor,
      events: Object.freeze([]),
    };
  let progress = state.toolProgress + removed;
  let cursor = state.toolAwardCursor;
  const inventory = { ...state.inventory };
  const events: GameEvent[] = [];
  while (progress >= 12) {
    progress -= 12;
    const tool = TOOL_ORDER[cursor]!;
    const before = inventory[tool];
    if (before < 3) inventory[tool] = before + 1;
    events.push({ type: "tool-awarded", tool, inventory: inventory[tool], discarded: before >= 3 });
    cursor = (cursor + 1) % TOOL_ORDER.length;
  }
  return { inventory: Object.freeze(inventory), progress, cursor, events: Object.freeze(events) };
}
export function awardBlackHole(
  state: GameState,
  removed: number,
): { readonly charges: 0 | 1; readonly progress: number; readonly events: readonly GameEvent[] } {
  if (!state.settings.advancedTools || state.toolWaveActive)
    return { charges: state.blackHoleCharges, progress: state.blackHoleProgress, events: Object.freeze([]) };
  let progress = state.blackHoleProgress + removed;
  let charges: 0 | 1 = state.blackHoleCharges;
  const events: GameEvent[] = [];
  while (progress >= 48) {
    progress -= 48;
    const discarded = charges >= 1;
    if (!discarded) charges = 1;
    events.push({ type: "black-hole-awarded", charges, discarded });
  }
  return { charges, progress, events: Object.freeze(events) };
}

export function scheduleContact(
  state: GameState,
  board: readonly (Gem | null)[],
): { readonly state: GameState; readonly events: readonly GameEvent[] } | null {
  if (!state.blackHole) return null;
  const onBoard = Object.freeze({ ...state, board });
  const cells = contactCells(onBoard, state.blackHole);
  if (!cells.length) return null;
  const ids = cells.flatMap((cell) => (board[cell] ? [board[cell]!.id] : []));
  const portal = consumePortal(onBoard, cells);
  const next = Object.freeze({
    ...onBoard,
    phase: "clear-mark" as const,
    resolutionTick: 0,
    pendingCells: cells,
    pendingSpecials: Object.freeze([]),
    gravityBoard: null,
    pendingBlackHole: true,
    toolWaveActive: true,
    blackHole: portal,
    blackHoleMovePending: portal ? state.blackHoleMovePending : false,
    blackHoleContactPending: false,
  });
  const closed = portal ? [] : [{ type: "black-hole-closed", reason: "capacity" } satisfies GameEvent];
  return { state: next, events: Object.freeze([{ type: "black-hole-consumed", cells, ids }, ...closed]) };
}
export function goalValue(state: GameState, goal: Goal): number {
  if (goal.kind === "score") return state.score;
  if (goal.kind === "collect") return state.clearedByColour[goal.colour];
  if (goal.kind === "seals") return state.sealsCleared;
  return state.bestChain;
}
export function goalTarget(state: GameState, goal: Goal): number {
  return goal.kind === "seals"
    ? (state.challenge?.seals ?? []).reduce((sum, seal) => sum + seal.layers, 0)
    : goal.target;
}

/** Advances marked-clear, removal, gravity and refill phases in bounded deterministic ticks. */
export function advanceTicksBase(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600)
    throw new RangeError("ticks must be an integer from 0 to 3600");
  let current = state;
  const events: GameEvent[] = [];
  for (let tick = 0; tick < ticks; tick++) {
    if (current.phase === "ready" || current.phase === "finished") break;
    if (current.phase === "clear-mark") {
      const elapsed = current.resolutionTick + 1;
      if (elapsed < 7) {
        current = Object.freeze({ ...current, resolutionTick: elapsed });
        continue;
      }
      const removed = new Set(current.pendingCells);
      const holes = current.board.map((item, index) => (removed.has(index) ? null : item));
      const removedCount = current.pendingCells.filter((index) => current.board[index]).length;
      const clearedByColour = { ...current.clearedByColour };
      for (const cell of current.pendingCells) {
        const removedGem = current.board[cell];
        if (removedGem) clearedByColour[removedGem.colour]++;
      }
      const clearedCells = new Set(current.pendingCells);
      let sealsCleared = current.sealsCleared;
      const seals = current.seals.flatMap((seal) => {
        if (!clearedCells.has(seal.cell)) return [seal];
        sealsCleared++;
        return seal.layers > 1 ? [Object.freeze({ ...seal, layers: seal.layers - 1 })] : [];
      });
      const blackHoleRemoval = current.pendingBlackHole;
      const points = removedCount * 10 * (blackHoleRemoval ? 1 : current.wave);
      const earning = awardTools(current, removedCount);
      const rareEarning = awardBlackHole(current, removedCount);
      const createdEvents = current.pendingSpecials.map((planned) => ({
        type: "special-created",
        cell: planned.cell,
        kind: planned.kind,
        id: current.board[planned.cell]!.id,
      }));
      const board = materializeSpecials(Object.freeze(holes), current.pendingSpecials);
      current = Object.freeze({
        ...current,
        board,
        phase: "clear-remove",
        resolutionTick: 0,
        score: current.score + points,
        clearedByColour: Object.freeze(clearedByColour),
        seals: Object.freeze(seals),
        sealsCleared,
        pendingSpecials: Object.freeze([]),
        pendingBlackHole: false,
        inventory: earning.inventory,
        toolProgress: earning.progress,
        toolAwardCursor: earning.cursor,
        blackHoleCharges: rareEarning.charges,
        blackHoleProgress: rareEarning.progress,
      });
      events.push(
        {
          type: "cells-removed",
          cells: current.pendingCells,
          wave: current.wave,
          points,
          board,
          source: blackHoleRemoval ? "black-hole" : "match",
        },
        ...createdEvents,
        ...earning.events,
        ...rareEarning.events,
      );
      continue;
    }
    if (current.phase === "clear-remove") {
      const elapsed = current.resolutionTick + 1;
      if (elapsed < 6) {
        current = Object.freeze({ ...current, resolutionTick: elapsed });
        continue;
      }
      current = Object.freeze({ ...current, phase: "gravity", resolutionTick: 0, gravityBoard: gravityBoard(current) });
      events.push({ type: "gravity-started", board: current.board, settledBoard: current.gravityBoard });
      continue;
    }
    if (current.phase === "gravity") {
      const elapsed = current.resolutionTick + 1;
      if (elapsed < 9) {
        current = Object.freeze({ ...current, resolutionTick: elapsed });
        continue;
      }
      const board = current.gravityBoard!;
      current = Object.freeze({ ...current, phase: "refill", resolutionTick: 0, board, gravityBoard: null });
      events.push({ type: "gravity-completed", board });
      continue;
    }
    const [board, randomState, nextId, refillEvents] = refill(current);
    const matches = findMatches(board, current.settings);
    if (matches.length) {
      const nextWave = current.wave + 1;
      const plan = planWave({ ...current, board }, matches, null, null);
      current = Object.freeze({
        ...current,
        board,
        randomState,
        nextId,
        phase: "clear-mark",
        wave: nextWave,
        resolutionTick: 0,
        pendingCells: plan.cells,
        pendingSpecials: plan.specials,
      });
      events.push(...refillEvents, { type: "match-marked", cells: matches, wave: current.wave }, ...plan.events);
    } else {
      let stable: GameState = Object.freeze({
        ...current,
        board,
        randomState,
        nextId,
        phase: "ready" as const,
        bestChain: Math.max(current.bestChain, current.wave),
        wave: 0,
        resolutionTick: 0,
        pendingCells: Object.freeze([]),
        pendingSpecials: Object.freeze([]),
        toolWaveActive: false,
      });
      if (stable.blackHole && stable.blackHoleContactPending) {
        const contact = scheduleContact(stable, stable.board);
        if (contact) {
          current = contact.state;
          events.push(...refillEvents, ...contact.events);
          continue;
        }
        stable = Object.freeze({ ...stable, blackHoleContactPending: false });
      }
      if (stable.blackHole && stable.blackHoleMovePending) {
        if (stable.blackHole.movesRemaining <= 1) {
          stable = Object.freeze({
            ...stable,
            blackHole: null,
            blackHoleMovePending: false,
            blackHoleContactPending: false,
            toolWaveActive: true,
            phase: "gravity",
            gravityBoard: null,
          });
          const settledBoard = gravityBoard(stable);
          stable = Object.freeze({ ...stable, gravityBoard: settledBoard });
          current = stable;
          events.push(
            ...refillEvents,
            { type: "black-hole-closed", reason: "duration" },
            { type: "gravity-started", board: stable.board, settledBoard },
          );
          continue;
        }
        stable = Object.freeze({
          ...stable,
          blackHole: Object.freeze({ ...stable.blackHole, movesRemaining: stable.blackHole.movesRemaining - 1 }),
          blackHoleMovePending: false,
        });
      }
      const legal = listLegalSwaps(stable);
      const goalWon =
        stable.mode === "challenge" &&
        (stable.challenge?.goals.every((goal) => goalValue(stable, goal) >= goalTarget(stable, goal)) ?? false);
      const timedOut = stable.mode === "arcade" && stable.elapsedMs >= 180_000;
      const moveExpired =
        (stable.mode === "daily" && stable.swapCount >= 30) ||
        (stable.mode === "challenge" &&
          stable.challenge?.moveLimit !== undefined &&
          stable.swapCount >= stable.challenge.moveLimit);
      const noActions = legal.length === 0 && !hasUsableTool(stable);
      if (goalWon) current = Object.freeze({ ...stable, phase: "finished" as const, outcome: "won" as const });
      else if (timedOut || moveExpired || noActions)
        current = Object.freeze({
          ...stable,
          phase: "finished" as const,
          outcome:
            stable.mode === "challenge" && (moveExpired || noActions) ? ("lost" as const) : ("finished" as const),
        });
      else current = stable;
      if (current.phase === "finished")
        events.push({
          type: "run-ended",
          result: current.outcome,
          reason: goalWon
            ? "goals-complete"
            : timedOut
              ? "time-limit"
              : moveExpired
                ? "move-limit"
                : "no-legal-actions",
        });
      events.push(...refillEvents);
    }
  }
  return { state: current, events: Object.freeze(events), accepted: true };
}

/** Advances deterministic resolution ticks; wall-clock time is supplied separately by the host.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param ticks - The nonnegative number of fixed 60 Hz logical ticks to advance.
 * @returns Advances deterministic resolution ticks; wall-clock time is supplied separately by the host.
 * @example
 * ```ts
 * import { advanceTicks, createGame } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * console.log(advanceTicks(state,1).state.phase);
 * ```
 */
export function advanceTicks(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600)
    throw new RangeError("ticks must be an integer from 0 to 3600");
  let current = state;
  let consumed = 0;
  const events: GameEvent[] = [];
  while (consumed < ticks && current.phase !== "ready" && current.phase !== "finished") {
    const result = advanceTicksBase(current, 1);
    current = result.state;
    events.push(...result.events);
    consumed++;
  }
  if (consumed) current = appendHistory(current, { kind: "ticks", count: consumed });
  return { state: current, events: Object.freeze(events), accepted: true };
}

/** Adds explicit host-measured elapsed time. Arcade runs end at 180 seconds; no clock is read here.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param milliseconds - The nonnegative elapsed milliseconds for the native timer.
 * @returns Adds explicit host-measured elapsed time. Arcade runs end at 180 seconds; no clock is read here.
 * @example
 * ```ts
 * import { advanceTime, createGame } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * console.log(advanceTime(state,16).state.phase);
 * ```
 */
export function advanceTime(state: GameState, milliseconds: number): Transition {
  if (!Number.isInteger(milliseconds) || milliseconds < 0 || milliseconds > 180_000)
    throw new RangeError("milliseconds must be an integer from 0 to 180000");
  if (state.mode !== "arcade" || state.outcome || milliseconds === 0)
    return { state, events: Object.freeze([]), accepted: true };
  const elapsedMs = Math.min(180_000, state.elapsedMs + milliseconds);
  let next: GameState = Object.freeze({ ...state, elapsedMs });
  const events: GameEvent[] = [{ type: "time-advanced", elapsedMs }];
  if (elapsedMs >= 180_000 && state.phase === "ready") {
    next = Object.freeze({ ...next, phase: "finished", outcome: "finished" });
    events.push({ type: "run-ended", result: "finished", reason: "time-limit" });
  }
  next = appendHistory(next, { kind: "time", milliseconds: elapsedMs - state.elapsedMs });
  return { state: next, events: Object.freeze(events), accepted: true };
}
