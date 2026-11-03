import {
  confirmSelected,
  confirmTool,
  emptyTransition,
  groupScore,
  hintGroup,
  indexOfId,
  undoCore,
} from "./engine-resolve.js";
import { clearToolSelection, groupAt, MAX_RECORDED_ACTIONS, previewAt, recordToolAction } from "./engine-setup.js";
import type { Action, GameState, Transition } from "./types.js";

export { createChallenge } from "./engine-challenge.js";
export { createGame, fallbackBoard } from "./engine-setup.js";
export { advanceTicks } from "./engine-ticks.js";
export { legalActions, statusOf } from "./engine-view.js";

export function applyCore(state: GameState, action: Action): Transition {
  if (
    !action ||
    typeof action !== "object" ||
    ![
      "select",
      "confirm",
      "cancel",
      "undo",
      "hint",
      "select-tool",
      "target-tool",
      "confirm-tool",
      "cancel-tool",
    ].includes((action as { kind?: string }).kind ?? "") ||
    (action.kind === "select" && !Number.isInteger(action.stoneId)) ||
    (action.kind === "select-tool" && !["bomb", "pick"].includes(action.tool)) ||
    (action.kind === "target-tool" && !Number.isInteger(action.cell))
  )
    return emptyTransition(state, "invalid-action");
  const actionKeys =
    action.kind === "select"
      ? ["kind", "stoneId"]
      : action.kind === "select-tool"
        ? ["kind", "tool"]
        : action.kind === "target-tool"
          ? ["kind", "cell"]
          : ["kind"];
  if (Object.keys(action).some((key) => !actionKeys.includes(key))) return emptyTransition(state, "invalid-action");
  if (action.kind === "undo") return undoCore(state);
  if (state.phase !== "ready") return emptyTransition(state, "resolution-in-progress");
  if (action.kind === "select-tool") {
    if (!state.settings.tools) return emptyTransition(state, "tools-disabled");
    if (state.inventory[action.tool] < 1) return emptyTransition(state, "tool-out-of-stock");
    if (state.recording.length > MAX_RECORDED_ACTIONS - 3) return emptyTransition(state, "recording-action-limit");
    const recording = recordToolAction(state, action);
    if (!recording) return emptyTransition(state, "recording-action-limit");
    return {
      state: {
        ...state,
        selectedId: null,
        selectedIds: Object.freeze([]),
        previewScore: 0,
        selectedTool: action.tool,
        toolTarget: null,
        toolPreview: Object.freeze([]),
        recording,
      },
      events: [{ type: "tool-selected", tool: action.tool, count: state.inventory[action.tool] }],
      accepted: true,
    };
  }
  if (action.kind === "target-tool") {
    if (!state.settings.tools || !state.selectedTool) return emptyTransition(state, "tool-not-selected");
    if (state.recording.length > MAX_RECORDED_ACTIONS - 2) return emptyTransition(state, "recording-action-limit");
    const preview = previewAt(state, state.selectedTool, action.cell);
    if (!preview.length) return emptyTransition(state, "tool-target-must-be-occupied");
    const recording = recordToolAction(state, action);
    if (!recording) return emptyTransition(state, "recording-action-limit");
    const ids = preview.map((index) => state.board[index]!.id);
    return {
      state: { ...state, toolTarget: action.cell, toolPreview: Object.freeze([...preview]), recording },
      events: [
        {
          type: "tool-targeted",
          tool: state.selectedTool,
          target: action.cell,
          cells: preview,
          ids,
          count: preview.length,
        },
      ],
      accepted: true,
    };
  }
  if (action.kind === "confirm-tool") return confirmTool(state);
  if (action.kind === "cancel-tool") {
    if (!state.selectedTool) return emptyTransition(state, "tool-not-selected");
    const recording = recordToolAction(state, action);
    if (!recording) return emptyTransition(state, "recording-action-limit");
    return {
      state: { ...state, ...clearToolSelection(state), recording },
      events: [{ type: "tool-cancelled" }],
      accepted: true,
    };
  }
  if (action.kind === "hint") {
    if (state.recording.length >= MAX_RECORDED_ACTIONS) return emptyTransition(state, "recording-action-limit");
    const group = hintGroup(state);
    if (!group)
      return emptyTransition(state, state.settings.mode === "challenge" ? "no-proved-hint" : "hints-disabled");
    const stoneId = group[0]!;
    return {
      state: {
        ...state,
        ...clearToolSelection(state),
        selectedId: stoneId,
        selectedIds: Object.freeze(group),
        previewScore: groupScore(group.length),
        assisted: true,
        recording: Object.freeze([...state.recording, { kind: "hint", witnessIndex: state.witnessIndex }]),
      },
      events: [{ type: "hint-shown", ids: group, points: groupScore(group.length), assisted: true }],
      accepted: true,
    };
  }
  if (action.kind === "select") {
    const index = indexOfId(state.board, action.stoneId);
    if (index < 0) return emptyTransition(state, "unknown-stone");
    const ids = groupAt(state.board, state.settings, index);
    if (ids.length < 2) return emptyTransition(state, "choose-two-or-more-connected-stones");
    const selectedIds = ids.map((at) => state.board[at]!.id);
    if (
      state.selectedId !== null &&
      state.selectedIds.length === selectedIds.length &&
      state.selectedIds.every((id, i) => id === selectedIds[i])
    )
      return confirmSelected(state);
    return {
      state: {
        ...state,
        ...clearToolSelection(state),
        selectedId: action.stoneId,
        selectedIds: Object.freeze(selectedIds),
        previewScore: groupScore(ids.length),
      },
      events: [{ type: "group-selected", ids: selectedIds, size: ids.length, points: groupScore(ids.length) }],
      accepted: true,
    };
  }
  if (action.kind === "cancel") {
    if (state.selectedId === null) return emptyTransition(state, "nothing-selected");
    return {
      state: { ...state, selectedId: null, selectedIds: Object.freeze([]), previewScore: 0 },
      events: [{ type: "selection-cleared" }],
      accepted: true,
    };
  }
  return confirmSelected(state);
}

/** Applies a selection, confirmation, or cancellation without mutating its input.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param action - One native action for this entry point; inspect accepted and reason on the result.
 * @returns Applies a selection, confirmation, or cancellation without mutating its input.
 * @example
 * ```ts
 * import { applyAction, createGame } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { Action } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * const action: Action={kind:"hint"};
 * console.log(applyAction(state,action).accepted);
 * ```
 */
export function applyAction(state: GameState, action: Action): Transition {
  return applyCore(state, action);
}

/** Selects the next supplied witness group only while the run still matches its path; accepted hints mark the run assisted.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Selects the next supplied witness group only while the run still matches its path; accepted hints mark the run assisted.
 * @example
 * ```ts
 * import { createGame, requestHint } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * console.log(requestHint(state).accepted);
 * ```
 */
export function requestHint(state: GameState): Transition {
  return applyCore(state, { kind: "hint" });
}
/** Restores the full pre-move state in Relaxed or Challenge practice and permanently marks the attempt assisted.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Restores the full pre-move state in Relaxed or Challenge practice and permanently marks the attempt assisted.
 * @example
 * ```ts
 * import { createGame, undo } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * console.log(undo(state).accepted);
 * ```
 */
export function undo(state: GameState): Transition {
  return undoCore(state);
}
