import { canUndo, hintGroup } from "./engine-resolve.js";
import { groupAt, MAX_RECORDED_ACTIONS } from "./engine-setup.js";
import type { Action, GameState, GameStatus } from "./types.js";

/** Lists every selection and confirmation currently accepted by the rules.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Lists every selection and confirmation currently accepted by the rules.
 * @example
 * ```ts
 * import { createGame, legalActions } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * console.log(legalActions(state).length);
 * ```
 */
export function legalActions(state: GameState): readonly Action[] {
  if (state.phase === "won" || state.phase === "finished" || state.phase === "lost")
    return canUndo(state) ? [{ kind: "undo" }] : [];
  if (state.phase !== "ready") return [];
  const recordingRoom = state.recording.length < MAX_RECORDED_ACTIONS;
  const actions: Action[] = [];
  for (let index = 0; index < state.board.length; index++) {
    const stone = state.board[index];
    if (!stone || groupAt(state.board, state.settings, index).length < 2) continue;
    if (!recordingRoom && state.selectedIds.includes(stone.id)) continue;
    actions.push({ kind: "select", stoneId: stone.id });
  }
  if (state.selectedId !== null) {
    if (recordingRoom) actions.push({ kind: "confirm" });
    actions.push({ kind: "cancel" });
  }
  if (state.settings.tools) {
    if (state.recording.length <= MAX_RECORDED_ACTIONS - 3)
      for (const tool of ["bomb", "pick"] as const)
        if (state.inventory[tool] > 0) actions.push({ kind: "select-tool", tool });
    if (state.selectedTool) {
      if (state.recording.length <= MAX_RECORDED_ACTIONS - 2)
        for (let cell = 0; cell < state.board.length; cell++)
          if (state.board[cell] && state.settings.mask[cell]) actions.push({ kind: "target-tool", cell });
      if (recordingRoom) actions.push({ kind: "cancel-tool" });
      if (recordingRoom && state.toolTarget !== null && state.toolPreview.length)
        actions.push({ kind: "confirm-tool" });
    }
  }
  if (recordingRoom && hintGroup(state)) actions.push({ kind: "hint" });
  if (canUndo(state)) actions.push({ kind: "undo" });
  return actions;
}

/** Returns the stable public game status and the remaining-stone count.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Returns the stable public game status and the remaining-stone count.
 * @example
 * ```ts
 * import { createGame, statusOf } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * console.log(statusOf(state).phase);
 * ```
 */
export function statusOf(state: GameState): GameStatus {
  return {
    mode: state.settings.mode,
    phase: state.phase,
    score: state.score,
    moves: state.moves,
    removed: state.removed,
    remaining: state.board.filter(Boolean).length,
    previewScore: state.previewScore,
    usedFallback: state.usedFallback,
    assisted: state.assisted,
    inventory: state.inventory,
    toolProgress: state.toolProgress,
    toolAwardCursor: state.toolAwardCursor,
    selectedTool: state.selectedTool,
    toolTarget: state.toolTarget,
    toolPreview: state.toolPreview,
    ...(state.settings.goal ? { goal: state.settings.goal } : {}),
    ...(state.reason ? { reason: state.reason } : {}),
  };
}
