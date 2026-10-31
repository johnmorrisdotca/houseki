import type {
  Action,
  ChallengeDefinition,
  ChallengeGoal,
  ChallengeOptions,
  GameEvent,
  GameState,
  GameStatus,
  Settings,
  Transition,
} from "./types.js";
import { optionsFor, StoneCollapseOptionsError } from "./validation.js";

export { createGame, fallbackBoard } from "./engine-setup.js";

import {
  canUndo,
  confirmSelected,
  confirmTool,
  emptyTransition,
  goalSatisfied,
  groupScore,
  hintGroup,
  indexOfId,
  removeAndSettle,
  terminal,
  undoCore,
} from "./engine-resolve.js";
import {
  baseState,
  COLOURS,
  clearToolSelection,
  GRAVITY_TICKS,
  groupAt,
  hashSeed,
  hasLegalGroup,
  MARK_TICKS,
  MAX_RECORDED_ACTIONS,
  MAX_RECORDED_TICKS,
  previewAt,
  REMOVE_TICKS,
  RULES,
  recordToolAction,
} from "./engine-setup.js";

/** Creates a fixed witnessed challenge after validating its board, objective, move budget, and every witness group.
 *
 * @param options - Validated native creation, authored challenge, or environment options described by this signature.
 * @returns Creates a fixed witnessed challenge after validating its board, objective, move budget, and every witness group.
 * @example
 * ```ts
 * import { createChallenge, levelManifest } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const level=levelManifest[0];
 * console.log(createChallenge({id:level.id,seed:level.seed,width:level.width,height:level.height,colourCount:level.colourCount,initialBoard:level.board,goal:level.goal,moveLimit:level.moveLimit,witness:level.witness}).phase);
 * ```
 */
export function createChallenge(options: ChallengeOptions): GameState {
  if (!options || typeof options !== "object" || Array.isArray(options))
    throw new StoneCollapseOptionsError("invalid-challenge", "Challenge options must be an object");
  const allowedKeys = [
    "id",
    "width",
    "height",
    "colourCount",
    "seed",
    "mask",
    "initialBoard",
    "goal",
    "moveLimit",
    "witness",
  ];
  if (Object.keys(options).some((key) => !allowedKeys.includes(key)))
    throw new StoneCollapseOptionsError("unknown-challenge-option", "Challenge options contain an unsupported field");
  if (typeof options.id !== "string" || !/^[a-z0-9][a-z0-9._-]{0,63}$/.test(options.id))
    throw new StoneCollapseOptionsError("invalid-challenge-id", "Challenge ID must be a stable lowercase identifier");
  const base = optionsFor({
    width: options.width,
    height: options.height,
    colourCount: options.colourCount,
    seed: options.seed === undefined ? `challenge:${options.id}` : options.seed,
    ...(options.mask !== undefined ? { mask: options.mask } : {}),
  });
  if (!Array.isArray(options.initialBoard) || options.initialBoard.length !== base.width * base.height)
    throw new StoneCollapseOptionsError("invalid-challenge-board", "Challenge board must contain one entry per cell");
  const ids = new Set<number>();
  const initialBoard = Array.from(options.initialBoard, (stone, index) => {
    if (!base.mask[index]) {
      if (stone !== null)
        throw new StoneCollapseOptionsError("stone-in-masked-cell", "Masked challenge cells must be empty");
      return null;
    }
    if (
      !stone ||
      typeof stone !== "object" ||
      Array.isArray(stone) ||
      Object.keys(stone).some((key) => key !== "id" && key !== "colour") ||
      !Number.isSafeInteger(stone.id) ||
      stone.id < 1 ||
      stone.id > 0x7fff_ffff ||
      ids.has(stone.id) ||
      !COLOURS.slice(0, base.colourCount).includes(stone.colour)
    )
      throw new StoneCollapseOptionsError(
        "invalid-challenge-stone",
        "Active challenge cells need unique positive IDs and configured colours",
      );
    ids.add(stone.id);
    return Object.freeze({ id: stone.id, colour: stone.colour });
  });
  if (
    !options.goal ||
    typeof options.goal !== "object" ||
    !["clear-all", "clear-targets", "score-target"].includes(options.goal.kind)
  )
    throw new StoneCollapseOptionsError(
      "invalid-challenge-goal",
      "Challenge goal must clear all, clear marked stones, or reach a score",
    );
  let goal: ChallengeGoal;
  if (options.goal.kind === "clear-all") {
    if (Object.keys(options.goal).some((key) => key !== "kind"))
      throw new StoneCollapseOptionsError("invalid-challenge-goal", "Clear-all goal contains unsupported fields");
    goal = { kind: "clear-all" };
  } else if (options.goal.kind === "clear-targets") {
    if (Object.keys(options.goal).some((key) => key !== "kind" && key !== "targetIds"))
      throw new StoneCollapseOptionsError("invalid-challenge-goal", "Target goal contains unsupported fields");
    const targets = options.goal.targetIds;
    if (
      !Array.isArray(targets) ||
      targets.length === 0 ||
      targets.length > 144 ||
      Array.from(targets).some((id) => !Number.isSafeInteger(id) || !ids.has(id)) ||
      new Set(targets).size !== targets.length
    )
      throw new StoneCollapseOptionsError(
        "invalid-target-ids",
        "Every target ID must name one unique initial challenge stone",
      );
    goal = { kind: "clear-targets", targetIds: Object.freeze(Array.from(targets).sort((a, b) => a - b)) };
  } else {
    if (Object.keys(options.goal).some((key) => key !== "kind" && key !== "minimumScore"))
      throw new StoneCollapseOptionsError("invalid-challenge-goal", "Score goal contains unsupported fields");
    const minimumScore = options.goal.minimumScore;
    if (!Number.isSafeInteger(minimumScore) || minimumScore < 1 || minimumScore > 1_000_000_000)
      throw new StoneCollapseOptionsError(
        "invalid-score-goal",
        "Minimum score must be an integer from 1 to 1,000,000,000",
      );
    goal = { kind: "score-target", minimumScore };
  }
  if (
    options.moveLimit !== undefined &&
    (!Number.isInteger(options.moveLimit) || options.moveLimit < 1 || options.moveLimit > 144)
  )
    throw new StoneCollapseOptionsError("invalid-move-limit", "Challenge move limit must be an integer from 1 to 144");
  if (goal.kind === "score-target" && options.moveLimit === undefined)
    throw new StoneCollapseOptionsError(
      "score-goal-needs-budget",
      "Score-target challenges require a finite move limit",
    );
  if (!Array.isArray(options.witness) || options.witness.length < 1 || options.witness.length > 72)
    throw new StoneCollapseOptionsError("invalid-witness", "Challenge witness must contain 1–72 group removals");
  const witness = Array.from(options.witness, (group) => {
    if (
      !Array.isArray(group) ||
      group.length < 2 ||
      group.length > 144 ||
      Array.from(group).some((id) => !Number.isSafeInteger(id) || !ids.has(id)) ||
      new Set(group).size !== group.length
    )
      throw new StoneCollapseOptionsError(
        "invalid-witness-group",
        "Each witness step must name distinct initial stone IDs",
      );
    return Object.freeze(Array.from(group).sort((a, b) => a - b));
  });
  if (options.moveLimit !== undefined && witness.length > options.moveLimit)
    throw new StoneCollapseOptionsError("witness-exceeds-budget", "Witness is longer than the challenge move limit");
  const seed = base.seed;
  const challenge: ChallengeDefinition = Object.freeze({
    id: options.id,
    width: base.width,
    height: base.height,
    colourCount: base.colourCount,
    seed,
    mask: Object.freeze([...base.mask]),
    initialBoard: Object.freeze(initialBoard),
    goal,
    ...(options.moveLimit === undefined ? {} : { moveLimit: options.moveLimit }),
    witness: Object.freeze(witness),
  });
  const settings: Settings = {
    mode: "challenge",
    width: base.width,
    height: base.height,
    colourCount: base.colourCount,
    seed,
    mask: challenge.mask,
    challengeId: challenge.id,
    goal,
    tools: false,
    ...(options.moveLimit === undefined ? {} : { moveLimit: options.moveLimit }),
  };
  let state = baseState(
    settings,
    challenge.initialBoard,
    hashSeed(`stone-collapse|${RULES}|${String(seed)}`),
    challenge,
  );
  let board = challenge.initialBoard;
  let score = 0;
  let moves = 0;
  for (let index = 0; index < challenge.witness.length; index++) {
    if (goalSatisfied({ ...state, board, score }))
      throw new StoneCollapseOptionsError(
        "witness-continues-after-goal",
        "Challenge witness must stop at the first completed goal",
      );
    const group = challenge.witness[index]!;
    const at = indexOfId(board, group[0]!);
    const actual =
      at < 0
        ? []
        : groupAt(board, settings, at)
            .map((cell) => board[cell]!.id)
            .sort((a, b) => a - b);
    if (actual.length !== group.length || actual.some((id, i) => id !== group[i]))
      throw new StoneCollapseOptionsError(
        "invalid-witness-path",
        `Witness group ${index + 1} is not the complete current connected group`,
      );
    score += groupScore(group.length);
    moves++;
    board = removeAndSettle({ ...state, board, settings }, group);
    state = { ...state, board, score, moves };
    if (
      !goalSatisfied(state) &&
      (!hasLegalGroup(board, settings) || (challenge.moveLimit !== undefined && moves >= challenge.moveLimit))
    )
      throw new StoneCollapseOptionsError(
        "witness-does-not-complete-goal",
        `Witness ends before the goal after move ${moves}`,
      );
  }
  if (!goalSatisfied(state))
    throw new StoneCollapseOptionsError(
      "witness-does-not-complete-goal",
      "Challenge witness does not reach its objective",
    );
  return baseState(settings, challenge.initialBoard, hashSeed(`stone-collapse|${RULES}|${String(seed)}`), challenge);
}

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
