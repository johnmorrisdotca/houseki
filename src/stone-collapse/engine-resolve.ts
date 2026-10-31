import {
  canUseTool,
  clearToolSelection,
  groupAt,
  hasLegalGroup,
  MAX_RECORDED_ACTIONS,
  previewAt,
  recordToolAction,
  undoFrame,
} from "./engine-setup.js";
import type { GameEvent, GameState, Stone, StoredTool, Transition } from "./types.js";

export function groupScore(size: number): number {
  return 5 * size * (size - 1);
}
export function emptyTransition(state: GameState, reason: string): Transition {
  return { state, events: [], accepted: false, reason };
}
export function indexOfId(board: readonly (Stone | null)[], id: number): number {
  return board.findIndex((stone) => stone?.id === id);
}
export function removeAndSettle(state: GameState, removeIds: readonly number[]): readonly (Stone | null)[] {
  const remove = new Set(removeIds);
  const board = state.board.map((stone) => (stone && remove.has(stone.id) ? null : stone));
  const result = [...board];
  const { width, height, mask } = state.settings;
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && !mask[y * width + x]) y++;
      if (y >= height) break;
      const start = y;
      while (y < height && mask[y * width + x]) y++;
      const end = y;
      const survivors: Stone[] = [];
      for (let row = start; row < end; row++) {
        const stone = board[row * width + x];
        if (stone) survivors.push(stone);
      }
      for (let row = start; row < end; row++) result[row * width + x] = null;
      for (let offset = 0; offset < survivors.length; offset++)
        result[(end - survivors.length + offset) * width + x] = survivors[offset]!;
    }
  }
  if (mask.every(Boolean)) {
    const kept: (Stone | null)[][] = [];
    for (let x = 0; x < width; x++) {
      const column = Array.from({ length: height }, (_, y) => result[y * width + x] ?? null);
      if (column.some(Boolean)) kept.push(column);
    }
    for (let x = 0; x < width; x++) for (let y = 0; y < height; y++) result[y * width + x] = kept[x]?.[y] ?? null;
  }
  return Object.freeze(result);
}
export function terminal(state: GameState): readonly [GameState, readonly GameEvent[]] {
  if (state.settings.mode === "challenge" && state.challenge) {
    if (goalSatisfied(state)) {
      const bonus = state.board.every((stone) => stone === null) && !state.finishAdjustmentApplied ? 1000 : 0;
      const won = {
        ...state,
        phase: "won" as const,
        reason: "goal-complete",
        score: state.score + bonus,
        finishAdjustmentApplied: state.finishAdjustmentApplied || bonus > 0,
      };
      return [won, [{ type: "run-ended", result: "won", reason: "goal-complete", bonus, score: won.score }]];
    }
    if (!hasLegalGroup(state.board, state.settings))
      return [
        { ...state, phase: "lost", reason: "no-legal-groups" },
        [{ type: "run-ended", result: "lost", reason: "no-legal-groups", score: state.score }],
      ];
    if (state.challenge.moveLimit !== undefined && state.moves >= state.challenge.moveLimit)
      return [
        { ...state, phase: "lost", reason: "move-limit", score: state.score },
        [{ type: "run-ended", result: "lost", reason: "move-limit", score: state.score }],
      ];
    return [state, []];
  }
  if (state.board.every((stone) => stone === null)) {
    if (state.finishAdjustmentApplied) return [state, []];
    return [
      { ...state, phase: "won", reason: "board-empty", score: state.score + 1000, finishAdjustmentApplied: true },
      [{ type: "run-ended", result: "won", reason: "board-empty", bonus: 1000, score: state.score + 1000 }],
    ];
  }
  if (!hasLegalGroup(state.board, state.settings)) {
    if (canUseTool(state)) return [state, []];
    const penalty = Math.min(state.score, 10 * state.board.filter(Boolean).length);
    if (state.finishAdjustmentApplied) return [state, []];
    return [
      {
        ...state,
        phase: "finished",
        reason: "no-legal-groups",
        score: state.score - penalty,
        finishAdjustmentApplied: true,
      },
      [
        {
          type: "run-ended",
          result: "finished",
          reason: "no-legal-groups",
          penalty,
          remaining: state.board.filter(Boolean).length,
          score: state.score - penalty,
        },
      ],
    ];
  }
  return [state, []];
}

export function goalSatisfied(state: GameState): boolean {
  const goal = state.challenge?.goal;
  if (!goal) return false;
  if (goal.kind === "clear-all") return state.board.every((stone) => stone === null);
  if (goal.kind === "clear-targets")
    return goal.targetIds.every((id) => !state.board.some((stone) => stone?.id === id));
  return state.score >= goal.minimumScore;
}

export function confirmSelected(state: GameState): Transition {
  if (state.recording.length >= MAX_RECORDED_ACTIONS) return emptyTransition(state, "recording-action-limit");
  if (state.selectedId === null || state.selectedIds.length < 2)
    return emptyTransition(state, "no-legal-group-selected");
  const currentIndex = indexOfId(state.board, state.selectedId);
  const currentIds =
    currentIndex < 0 ? [] : groupAt(state.board, state.settings, currentIndex).map((at) => state.board[at]!.id);
  if (currentIds.length !== state.selectedIds.length || currentIds.some((id, i) => id !== state.selectedIds[i]))
    return emptyTransition(state, "stale-selection");
  const ids = [...state.selectedIds];
  const points = groupScore(ids.length);
  const score = state.score + points;
  const gravityBoard = removeAndSettle(state, ids);
  const moves = state.moves + 1;
  const frame = undoFrame(state);
  let inventory = state.inventory;
  let toolProgress = state.toolProgress;
  let toolAwardCursor = state.toolAwardCursor;
  const awardEvents: GameEvent[] = [];
  if (state.settings.tools) {
    const total = state.toolProgress + ids.length;
    let awards = Math.floor(total / 12);
    toolProgress = total % 12;
    const awardedInventory = { ...state.inventory };
    while (awards-- > 0) {
      const tool: StoredTool = toolAwardCursor === 0 ? "bomb" : "pick";
      toolAwardCursor = toolAwardCursor === 0 ? 1 : 0;
      const discarded = awardedInventory[tool] >= 3;
      if (!discarded) awardedInventory[tool]++;
      awardEvents.push({ type: "tool-awarded", tool, count: awardedInventory[tool], discarded });
    }
    inventory = Object.freeze(awardedInventory);
  }
  const expected = state.challenge?.witness[state.witnessIndex];
  const witnessIndex =
    expected && expected.length === ids.length && expected.every((id, i) => [...ids].sort((a, b) => a - b)[i] === id)
      ? state.witnessIndex + 1
      : state.challenge
        ? -1
        : -1;
  const next: GameState = {
    ...state,
    selectedId: null,
    selectedIds: Object.freeze([]),
    previewScore: 0,
    ...clearToolSelection(state),
    inventory,
    toolProgress,
    toolAwardCursor,
    score,
    moves,
    phase: "clear-mark",
    resolutionTick: 0,
    pendingIds: Object.freeze(ids),
    gravityBoard,
    history: Object.freeze([...state.history, frame]),
    witnessIndex,
    recording: Object.freeze([...state.recording, { kind: "remove", move: moves, stoneId: state.selectedId }]),
  };
  return {
    state: next,
    events: [
      { type: "group-committed", ids, points, move: moves },
      { type: "score-changed", score, points },
      ...awardEvents,
    ],
    accepted: true,
  };
}

export function confirmTool(state: GameState): Transition {
  if (
    !state.settings.tools ||
    !state.selectedTool ||
    state.toolTarget === null ||
    state.recording.length >= MAX_RECORDED_ACTIONS
  )
    return emptyTransition(state, "tool-not-ready");
  const count = state.inventory[state.selectedTool];
  const preview = previewAt(state, state.selectedTool, state.toolTarget);
  if (
    count < 1 ||
    !preview.length ||
    preview.length !== state.toolPreview.length ||
    preview.some((cell, index) => state.toolPreview[index] !== cell)
  )
    return emptyTransition(state, "stale-tool-preview");
  const ids = preview.map((index) => state.board[index]!.id);
  const points = 10 * ids.length;
  const moves = state.moves + 1;
  const inventory = Object.freeze({ ...state.inventory, [state.selectedTool]: count - 1 });
  const frame = undoFrame(state);
  const recording = recordToolAction(state, { kind: "confirm-tool", move: moves });
  if (!recording) return emptyTransition(state, "recording-action-limit");
  const next: GameState = {
    ...state,
    ...clearToolSelection(state),
    selectedId: null,
    selectedIds: Object.freeze([]),
    previewScore: 0,
    inventory: inventory,
    score: state.score + points,
    moves,
    phase: "clear-mark",
    resolutionTick: 0,
    pendingIds: Object.freeze(ids),
    gravityBoard: removeAndSettle(state, ids),
    history: Object.freeze([...state.history, frame]),
    assisted: true,
    recording,
  };
  return {
    state: next,
    events: [
      {
        type: "tool-used",
        tool: state.selectedTool,
        target: state.toolTarget,
        cells: preview,
        ids,
        points,
        move: moves,
      },
      { type: "score-changed", score: next.score, points },
    ],
    accepted: true,
  };
}

export function hintGroup(state: GameState): readonly number[] | null {
  if (state.settings.mode !== "challenge" || !state.challenge || state.witnessIndex < 0) return null;
  const expected = state.challenge.witness[state.witnessIndex];
  if (!expected) return null;
  const at = indexOfId(state.board, expected[0]!);
  if (at < 0) return null;
  const actual = groupAt(state.board, state.settings, at).map((cell) => state.board[cell]!.id);
  const sorted = [...actual].sort((a, b) => a - b);
  return sorted.length === expected.length && sorted.every((id, i) => id === expected[i]) ? actual : null;
}
export function canUndo(state: GameState): boolean {
  return (
    (state.settings.mode === "relaxed" || state.settings.mode === "challenge") &&
    state.history.length > 0 &&
    state.recording.length < MAX_RECORDED_ACTIONS
  );
}
export function undoCore(state: GameState): Transition {
  if (!canUndo(state) || !["ready", "won", "finished", "lost"].includes(state.phase))
    return emptyTransition(state, "undo-unavailable");
  const frame = state.history.at(-1)!;
  const restored: GameState = {
    ...state,
    ...frame,
    phase: "ready",
    resolutionTick: 0,
    pendingIds: Object.freeze([]),
    gravityBoard: null,
    assisted: true,
    history: Object.freeze(state.history.slice(0, -1)),
    reason: undefined,
    recording: Object.freeze([...state.recording, { kind: "undo", move: frame.moves }]),
  };
  return { state: restored, events: [{ type: "move-undone", move: frame.moves, assisted: true }], accepted: true };
}
