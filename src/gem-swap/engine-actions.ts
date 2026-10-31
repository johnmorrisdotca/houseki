import { placementCells } from "./black-hole.js";
import { findMatches, listLegalSwaps, neighbors } from "./board.js";
import { createGame } from "./engine-create.js";
import {
  advanceTicks,
  advanceTime,
  appendHistory,
  availableToolCount,
  goalTarget,
  goalValue,
  TOOL_ORDER,
} from "./engine-ticks.js";
import { hintTransition, reshuffleTransition, undoTransition } from "./practice.js";
import { isValidSpecialSwap, planWave } from "./specials.js";
import { previewTool } from "./tools.js";
import type { Action, CreateOptions, GameState, GameStatus, ReplayOperation, ToolKind, Transition } from "./types.js";

export function rejected(state: GameState, reason: string): Transition {
  return { state, events: Object.freeze([]), accepted: false, reason };
}
export function adjacent(state: GameState, from: number, to: number): boolean {
  return neighbors(from, state.settings.width, state.settings.height, state.settings.mask).includes(to);
}

/** Accepts a legal orthogonal normal-gem swap, leaving invalid state identity unchanged. */
export function applyActionBase(state: GameState, action: Action): Transition {
  if (!action || typeof action !== "object") return rejected(state, "invalid-action");
  if (action.kind === "undo")
    return Object.keys(action).length === 1
      ? undoTransition(state, replayOperations)
      : rejected(state, "invalid-action");
  if (action.kind === "hint")
    return Object.keys(action).length === 1 ? hintTransition(state) : rejected(state, "invalid-action");
  if (action.kind === "reshuffle")
    return Object.keys(action).length === 1 ? reshuffleTransition(state) : rejected(state, "invalid-action");
  if (action.kind !== "swap") return applyToolAction(state, action);
  if (
    !Number.isInteger(action.from) ||
    !Number.isInteger(action.to) ||
    Object.keys(action).some((key) => !["kind", "from", "to"].includes(key))
  )
    return rejected(state, "invalid-action");
  if (state.phase !== "ready") return rejected(state, "resolution-in-progress");
  if (findMatches(state.board, state.settings).length) return rejected(state, "unstable-board");
  const { from, to } = action;
  if (
    from < 0 ||
    to < 0 ||
    from >= state.board.length ||
    to >= state.board.length ||
    from === to ||
    !state.settings.mask[from] ||
    !state.settings.mask[to] ||
    !state.board[from] ||
    !state.board[to] ||
    !adjacent(state, from, to)
  )
    return rejected(state, "not-adjacent-active-gems");
  const board = [...state.board];
  [board[from], board[to]] = [board[to]!, board[from]!];
  const matched = findMatches(board, state.settings);
  if (!isValidSpecialSwap(board[from]!, board[to]!, matched.length > 0))
    return rejected(
      state,
      board[from]!.colour === board[to]!.colour && !board[from]!.kind && !board[to]!.kind
        ? "identical-gems"
        : "swap-makes-no-match",
    );
  const swapped = Object.freeze({ ...state, board: Object.freeze(board) });
  const plan = planWave(swapped, matched, from, to);
  const next = Object.freeze({
    ...swapped,
    phase: "clear-mark" as const,
    moves: state.moves + 1,
    swapCount: state.swapCount + 1,
    wave: 1,
    resolutionTick: 0,
    pendingCells: plan.cells,
    pendingSpecials: plan.specials,
    gravityBoard: null,
    selectedTool: null,
    toolTarget: null,
    toolPreview: Object.freeze([]),
    toolWaveActive: false,
    blackHoleMovePending: state.blackHole !== null,
    blackHoleContactPending: state.blackHole !== null,
  });
  return {
    state: next,
    events: Object.freeze([
      { type: "swap-accepted", from, to, ids: [state.board[from]!.id, state.board[to]!.id] },
      ...(matched.length ? [{ type: "match-marked", cells: matched, wave: 1 }] : []),
      ...plan.events,
    ]),
    accepted: true,
  };
}

/** Applies one recorded player action. Rejected actions preserve state identity and are not recorded.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param action - One native action for this entry point; inspect accepted and reason on the result.
 * @returns Applies one recorded player action. Rejected actions preserve state identity and are not recorded.
 * @example
 * ```ts
 * import { applyAction, createGame } from "@johnmorrisdotca/houseki/gem-swap";
 * import type { Action } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * const action: Action={kind:"hint"};
 * console.log(applyAction(state,action).accepted);
 * ```
 */
export function applyAction(state: GameState, action: Action): Transition {
  const explicitPracticeReshuffle =
    action?.kind === "reshuffle" && state.mode === "relaxed" && state.outcome === "finished";
  if ((state.outcome && !explicitPracticeReshuffle) || (state.mode === "arcade" && state.elapsedMs >= 180_000))
    return rejected(state, "run-ended");
  const result = applyActionBase(state, action);
  return result.accepted
    ? { ...result, state: appendHistory(result.state, { kind: "action", action: Object.freeze({ ...action }) }) }
    : result;
}

export function validTool(tool: unknown): tool is ToolKind {
  return [...TOOL_ORDER, "black-hole"].includes(tool as ToolKind);
}
export function onReady(state: GameState): boolean {
  return state.phase === "ready" && findMatches(state.board, state.settings).length === 0;
}
export function applyToolAction(state: GameState, action: Exclude<Action, { readonly kind: "swap" }>): Transition {
  if (!["select-tool", "target-tool", "confirm-tool", "cancel-tool"].includes(action.kind))
    return rejected(state, "invalid-action");
  const fields: Record<string, readonly string[]> = {
    "select-tool": ["kind", "tool"],
    "target-tool": ["kind", "cell"],
    "confirm-tool": ["kind"],
    "cancel-tool": ["kind"],
  };
  if (Object.keys(action).some((key) => !(fields[action.kind] ?? []).includes(key)))
    return rejected(state, "invalid-action");
  if (!state.settings.tools) return rejected(state, "tools-disabled");
  if (!onReady(state)) return rejected(state, state.phase === "ready" ? "unstable-board" : "resolution-in-progress");
  if (action.kind === "select-tool") {
    if (!validTool(action.tool)) return rejected(state, "invalid-action");
    if (action.tool === "black-hole") {
      if (!state.settings.advancedTools || state.blackHoleCharges < 1 || state.blackHole)
        return rejected(state, "tool-unavailable");
    } else if (state.inventory[action.tool] < 1) return rejected(state, "tool-unavailable");
    const next = Object.freeze({
      ...state,
      selectedTool: action.tool,
      toolTarget: null,
      toolPreview: Object.freeze([]),
    });
    return { state: next, events: Object.freeze([{ type: "tool-selected", tool: action.tool }]), accepted: true };
  }
  if (action.kind === "target-tool") {
    if (
      !Number.isInteger(action.cell) ||
      !state.selectedTool ||
      action.cell < 0 ||
      action.cell >= state.board.length ||
      !state.settings.mask[action.cell] ||
      !state.board[action.cell]
    )
      return rejected(state, "invalid-tool-target");
    const preview =
      state.selectedTool === "black-hole"
        ? placementCells(state, action.cell)
        : previewTool(state, state.selectedTool, action.cell);
    const next = Object.freeze({ ...state, toolTarget: action.cell, toolPreview: preview });
    return {
      state: next,
      events: Object.freeze([
        { type: "tool-targeted", tool: state.selectedTool, cell: action.cell, cells: preview, count: preview.length },
      ]),
      accepted: true,
    };
  }
  if (action.kind === "cancel-tool") {
    if (!state.selectedTool) return rejected(state, "no-tool-selected");
    const next = Object.freeze({ ...state, selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]) });
    return { state: next, events: Object.freeze([{ type: "tool-cancelled" }]), accepted: true };
  }
  if (!state.selectedTool || state.toolTarget === null) return rejected(state, "tool-not-ready");
  if (state.selectedTool === "black-hole") {
    if (!state.settings.advancedTools || state.blackHoleCharges < 1 || state.blackHole)
      return rejected(state, "tool-unavailable");
    const cells = placementCells(state, state.toolTarget);
    if (!cells.length) return rejected(state, "invalid-tool-target");
    const ids = cells.flatMap((cell) => (state.board[cell] ? [state.board[cell]!.id] : []));
    const portal = Object.freeze({
      cell: state.toolTarget,
      capacityRemaining: Math.max(0, 8 - ids.length),
      movesRemaining: 2,
      consumedIds: Object.freeze(ids),
    });
    const next = Object.freeze({
      ...state,
      phase: "clear-mark" as const,
      moves: state.moves + 1,
      wave: 1,
      resolutionTick: 0,
      pendingCells: cells,
      pendingSpecials: Object.freeze([]),
      gravityBoard: null,
      selectedTool: null,
      toolTarget: null,
      toolPreview: Object.freeze([]),
      assisted: true,
      toolWaveActive: true,
      pendingBlackHole: true,
      blackHole: portal,
      blackHoleCharges: 0 as const,
      blackHoleMovePending: false,
      blackHoleContactPending: false,
    });
    return {
      state: next,
      events: Object.freeze([
        {
          type: "black-hole-opened",
          cell: portal.cell,
          capacityRemaining: portal.capacityRemaining,
          movesRemaining: portal.movesRemaining,
        },
        { type: "black-hole-consumed", cells, ids },
      ]),
      accepted: true,
    };
  }
  if (state.inventory[state.selectedTool] < 1) return rejected(state, "tool-not-ready");
  const preview = previewTool(state, state.selectedTool, state.toolTarget);
  if (!preview.length) return rejected(state, "invalid-tool-target");
  const plan = planWave(state, [], null, null, preview);
  const inventory = Object.freeze({
    ...state.inventory,
    [state.selectedTool]: state.inventory[state.selectedTool] - 1,
  });
  const next = Object.freeze({
    ...state,
    phase: "clear-mark" as const,
    moves: state.moves + 1,
    wave: 1,
    resolutionTick: 0,
    pendingCells: plan.cells,
    pendingSpecials: Object.freeze([]),
    gravityBoard: null,
    inventory,
    selectedTool: null,
    toolTarget: null,
    toolPreview: Object.freeze([]),
    assisted: true,
    toolWaveActive: true,
    blackHoleMovePending: state.blackHoleMovePending || state.blackHole !== null,
    blackHoleContactPending: state.blackHoleContactPending || state.blackHole !== null,
  });
  return {
    state: next,
    events: Object.freeze([
      {
        type: "tool-used",
        tool: state.selectedTool,
        target: state.toolTarget,
        cells: plan.cells,
        count: plan.cells.length,
      },
      ...plan.events,
    ]),
    accepted: true,
  };
}

export function replayOperations(initial: CreateOptions, operations: readonly ReplayOperation[]): GameState {
  let state = createGame(initial);
  for (const operation of operations) {
    if (operation.kind === "action") {
      const result = applyAction(state, operation.action);
      if (!result.accepted) throw new Error("Recorded action cannot be replayed");
      state = result.state;
    } else if (operation.kind === "ticks") state = advanceTicks(state, operation.count).state;
    else if (operation.kind === "time") state = advanceTime(state, operation.milliseconds).state;
  }
  return state;
}
/** Returns a deterministic legal swap hint and permanently marks the run assisted.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Returns a deterministic legal swap hint and permanently marks the run assisted.
 * @example
 * ```ts
 * import { createGame, hintGame } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * console.log(hintGame(state).accepted);
 * ```
 */
export function hintGame(state: GameState): Transition {
  return applyAction(state, { kind: "hint" });
}
/** Shuffles existing gem records in Relaxed play, preserving their colour and special counts.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Shuffles existing gem records in Relaxed play, preserving their colour and special counts.
 * @example
 * ```ts
 * import { createGame, reshuffleGame } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * console.log(reshuffleGame(state).accepted);
 * ```
 */
export function reshuffleGame(state: GameState): Transition {
  return applyAction(state, { kind: "reshuffle" });
}
/** Restores the last committed swap in Relaxed or Challenge play and marks assistance.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Restores the last committed swap in Relaxed or Challenge play and marks assistance.
 * @example
 * ```ts
 * import { createGame, undoGame } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * console.log(undoGame(state).accepted);
 * ```
 */
export function undoGame(state: GameState): Transition {
  return applyAction(state, { kind: "undo" });
}

/** Lists all legal swaps that would be accepted from the current stable state.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Lists all legal swaps that would be accepted from the current stable state.
 * @example
 * ```ts
 * import { createGame, legalActions } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * console.log(legalActions(state).length);
 * ```
 */
export function legalActions(state: GameState): readonly Action[] {
  if (state.phase === "finished")
    return state.mode === "relaxed" && state.outcome === "finished"
      ? Object.freeze([{ kind: "reshuffle" }])
      : Object.freeze([]);
  if (state.phase !== "ready" || findMatches(state.board, state.settings).length) return [];
  const actions: Action[] = [];
  for (let from = 0; from < state.board.length; from++) {
    if (!state.board[from]) continue;
    for (const to of neighbors(from, state.settings.width, state.settings.height, state.settings.mask)) {
      if (to <= from || !state.board[to]) continue;
      const trial = [...state.board];
      [trial[from], trial[to]] = [trial[to]!, trial[from]!];
      const matches = findMatches(trial, state.settings);
      if (isValidSpecialSwap(trial[from]!, trial[to]!, matches.length > 0)) actions.push({ kind: "swap", from, to });
    }
  }
  if (state.settings.tools) {
    for (const tool of TOOL_ORDER) if (state.inventory[tool] > 0) actions.push({ kind: "select-tool", tool });
    if (state.settings.advancedTools && state.blackHoleCharges > 0 && !state.blackHole)
      actions.push({ kind: "select-tool", tool: "black-hole" });
    if (state.selectedTool) {
      for (let cell = 0; cell < state.board.length; cell++)
        if (state.settings.mask[cell] && state.board[cell]) actions.push({ kind: "target-tool", cell });
      if (state.toolTarget !== null) actions.push({ kind: "confirm-tool" });
      actions.push({ kind: "cancel-tool" });
    }
  }
  if (listLegalSwaps(state).length && !state.selectedTool) actions.push({ kind: "hint" });
  if (state.mode === "relaxed" && !state.selectedTool) actions.push({ kind: "reshuffle" });
  if (
    ["relaxed", "challenge"].includes(state.mode) &&
    !state.selectedTool &&
    state.history.some((operation) => operation.kind === "action" && operation.action.kind === "swap")
  )
    actions.push({ kind: "undo" });
  return Object.freeze(actions);
}
/** Derive the native phase, score, legal-move count, tools and goal/timer progress for host labels.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Derive the native phase, score, legal-move count, tools and goal/timer progress for host labels.
 * @example
 * ```ts
 * import { createGame, statusOf } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * console.log(statusOf(state).phase);
 * ```
 */
export function statusOf(state: GameState): GameStatus {
  const goals = state.challenge?.goals ?? Object.freeze([]);
  const goalProgress = goals.map((goal) => ({
    kind: goal.kind,
    ...(goal.kind === "collect" ? { colour: goal.colour } : {}),
    current: goalValue(state, goal),
    target: goalTarget(state, goal),
    complete: goalValue(state, goal) >= goalTarget(state, goal),
  }));
  const remainingMoves =
    state.mode === "daily"
      ? Math.max(0, 30 - state.swapCount)
      : state.mode === "challenge" && state.challenge?.moveLimit !== undefined
        ? Math.max(0, state.challenge.moveLimit - state.swapCount)
        : null;
  return {
    phase: state.phase,
    score: state.score,
    moves: state.moves,
    legalMoveCount: legalActions(state).filter((action) => action.kind === "swap").length,
    usedFallback: state.usedFallback,
    availableToolCount: availableToolCount(state),
    inventory: state.inventory,
    toolProgress: state.toolProgress,
    toolAwardCursor: state.toolAwardCursor,
    assisted: state.assisted,
    blackHoleCharges: state.blackHoleCharges,
    blackHoleProgress: state.blackHoleProgress,
    blackHole: state.blackHole,
    mode: state.mode,
    outcome: state.outcome,
    remainingMoves,
    elapsedMs: state.elapsedMs,
    remainingMs: state.mode === "arcade" ? Math.max(0, 180_000 - state.elapsedMs) : null,
    goals: Object.freeze([...goals]),
    goalProgress: Object.freeze(goalProgress),
    bestChain: state.bestChain,
  };
}
