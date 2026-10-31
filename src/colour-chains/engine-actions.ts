import { previewPowerDrop } from "../nature.js";
import {
  cellFor,
  emptyTransition,
  grounded,
  HIDDEN,
  indexOf,
  KICKS,
  movedEntries,
  natureBoard,
  naturePulse,
  ORIENTATIONS,
  occupied,
  pairFits,
  rigidLanding,
  terminalAfterResolution,
} from "./engine-board.js";
import { compactBoard, findGroups } from "./match.js";
import type { Action, GameEvent, GameState, Pair, Transition } from "./types.js";

export function startWave(state: GameState, chain: number): readonly [GameState, readonly GameEvent[]] {
  const groups = findGroups(state.board, state.settings.width, state.settings.height + HIDDEN);
  if (!groups.length) {
    let score = state.score;
    let allClears = state.allClears;
    const events: GameEvent[] = [];
    if (
      state.resolutionHadClear &&
      state.board.every((gem) => gem === null) &&
      (state.settings.mode === "arcade" || state.settings.mode === "daily")
    ) {
      const bonus = 500 * (state.resolutionLevel ?? 1);
      score += bonus;
      allClears++;
      events.push({ type: "all-clear", points: bonus, score, count: allClears });
    }
    const ended = {
      ...state,
      score,
      allClears,
      active: null,
      phase: "falling" as const,
      clearCells: [],
      gravityBoard: null,
      resolutionTick: 0,
    };
    return terminalAfterResolution(ended);
  }
  const cells = [...new Set(groups.flat())].sort((a, b) => a - b);
  return [
    { ...state, phase: "clear-mark", clearCells: cells, gravityBoard: null, resolutionTick: 0 },
    [{ type: "match-marked", chain, cells, ids: cells.map((index) => state.board[index]!.id), groups }],
  ];
}
export function lock(state: GameState, pair: Pair, points = 0): Transition {
  const board = [...state.board];
  const positions = [cellFor(pair, false), cellFor(pair, true)];
  for (const [i, cell] of positions.entries()) {
    if (occupied(state, cell.x, cell.y))
      return {
        state: { ...state, phase: "lost", active: null, reason: "spawn-collision" },
        events: [{ type: "run-ended", reason: "spawn-collision" }],
        accepted: true,
      };
    board[indexOf(cell.x, cell.y, state.settings.width)] = pair.gems[i]!;
  }
  const compacted = state.settings.nature
    ? board
    : compactBoard(board, state.settings.width, state.settings.height + HIDDEN);
  const witness = state.settings.witness?.[state.completedPairs];
  const onPath =
    state.witnessIndex >= 0 &&
    (!witness || (witness.pivotX === pair.pivot.x && witness.orientation === pair.orientation));
  const witnessIndex = state.settings.mode === "challenge" ? (onPath ? state.completedPairs + 1 : -1) : -1;
  const next: GameState = {
    ...state,
    board: compacted,
    active: null,
    score: state.score + points,
    completedPairs: state.completedPairs + 1,
    waves: [],
    resolutionTick: 0,
    clearCells: [],
    gravityBoard: null,
    resolutionHadClear: false,
    resolutionLevel: pair.level,
    witnessIndex,
    ...(state.settings.nature ? { naturePulsePending: false } : {}),
  };
  const events: GameEvent[] = [
    {
      type: "pair-locked",
      cells: positions,
      ids: pair.gems.map((gem) => gem.id),
      ...(points ? { points, score: next.score } : {}),
    },
  ];
  if (state.settings.nature) {
    const groups = findGroups(board, state.settings.width, state.settings.height + HIDDEN);
    if (groups.length) {
      const cells = [...new Set(groups.flat())].sort((a, b) => a - b);
      const marked: GameState = { ...next, naturePulsePending: true, phase: "clear-mark", clearCells: cells };
      return {
        state: marked,
        events: [
          ...events,
          { type: "match-marked", chain: 1, cells, ids: cells.map((index) => board[index]!.id), groups },
        ],
        accepted: true,
      };
    }
    const pulse = naturePulse(next, board);
    const afterPulse = pulse.board;
    const pulseGroups = findGroups(afterPulse, state.settings.width, state.settings.height + HIDDEN);
    if (pulseGroups.length) {
      const cells = [...new Set(pulseGroups.flat())].sort((a, b) => a - b);
      const marked: GameState = { ...next, board: afterPulse, phase: "clear-mark", clearCells: cells };
      return {
        state: marked,
        events: [
          ...events,
          ...pulse.events,
          {
            type: "match-marked",
            chain: 1,
            cells,
            ids: cells.map((index) => afterPulse[index]!.id),
            groups: pulseGroups,
          },
        ],
        accepted: true,
      };
    }
    const settled = compactBoard(afterPulse, state.settings.width, state.settings.height + HIDDEN);
    const movement = movedEntries(afterPulse, settled, state.settings.width);
    if (movement.length)
      return {
        state: { ...next, board: afterPulse, phase: "gravity", gravityBoard: settled },
        events: [
          ...events,
          ...pulse.events,
          { type: "cells-fell", cells: movement, before: afterPulse, after: settled },
        ],
        accepted: true,
      };
    const [resolved, waveEvents] = startWave({ ...next, board: settled }, 1);
    return { state: resolved, events: [...events, ...pulse.events, ...waveEvents], accepted: true };
  }
  const movement = movedEntries(board, compacted, state.settings.width);
  if (movement.length)
    return {
      state: { ...next, board, phase: "gravity", gravityBoard: compacted },
      events: [...events, { type: "cells-fell", cells: movement, before: board, after: compacted }],
      accepted: true,
    };
  const [resolved, waveEvents] = startWave({ ...next, board: compacted }, 1);
  return { state: resolved, events: [...events, ...waveEvents], accepted: true };
}
export function rebound(state: GameState, pair: Pair) {
  const landing = rigidLanding(state, pair);
  const nature = natureBoard(state);
  const piece = [cellFor(landing, false), cellFor(landing, true)].map((cell, index) => ({
    id: landing.gems[index]!.id,
    kind: "stone" as const,
    colour: landing.gems[index]!.colour,
    ...(landing.gems[index]!.magnetic ? { magnetic: true } : {}),
    x: cell.x,
    y: cell.y,
  }));
  if (piece.some((cell) => cell.y < 0 || cell.y >= state.settings.height)) return null;
  const direction = state.lastHorizontalDirection ?? (state.completedPairs % 2 === 0 ? "left" : "right");
  const preview = previewPowerDrop(nature, {
    piece,
    pivotId: landing.gems[0].id,
    power: true,
    lastHorizontalDirection: direction,
  });
  const pivot = preview.finalCells.find((cell) => cell.id === landing.gems[0].id)!;
  return { pair: { ...landing, pivot: { x: pivot.x, y: pivot.y } }, preview };
}
export function moved(state: GameState, action: "left" | "right" | "down"): Transition {
  const pair = state.active!;
  const dx = action === "left" ? -1 : action === "right" ? 1 : 0;
  const dy = action === "down" ? 1 : 0;
  const nextPair: Pair = {
    ...pair,
    pivot: { x: pair.pivot.x + dx, y: pair.pivot.y + dy },
    ...(action === "down" ? { gravityTicks: 0 } : {}),
  };
  if (!pairFits(state, nextPair)) return emptyTransition(state, "blocked");
  const wasGrounded = grounded(state, pair);
  const isGrounded = grounded(state, nextPair);
  const canReset = wasGrounded && action !== "down" && pair.resetCount < 8;
  const resetCount = pair.resetCount + (canReset ? 1 : 0);
  const groundedTicks = canReset ? 0 : pair.groundedTicks;
  const groundedStarted = canReset ? isGrounded : pair.groundedStarted;
  return {
    state: {
      ...state,
      active: { ...nextPair, resetCount, groundedTicks, groundedStarted },
      ...(state.settings.nature && (action === "left" || action === "right")
        ? { lastHorizontalDirection: action }
        : {}),
    },
    events: [
      { type: action === "down" ? "pair-soft-dropped" : "pair-moved", action, from: pair.pivot, to: nextPair.pivot },
    ],
    accepted: true,
  };
}
export function rotate(state: GameState, clockwise: boolean): Transition {
  const pair = state.active!;
  const oldIndex = ORIENTATIONS.indexOf(pair.orientation);
  const orientation = ORIENTATIONS[(oldIndex + (clockwise ? 1 : 3)) % 4]!;
  for (const [dx, dy] of KICKS) {
    const candidate: Pair = { ...pair, pivot: { x: pair.pivot.x + dx!, y: pair.pivot.y + dy! }, orientation };
    if (!pairFits(state, candidate)) continue;
    const wasGrounded = grounded(state, pair);
    const isGrounded = grounded(state, candidate);
    const canReset = wasGrounded && pair.resetCount < 8;
    return {
      state: {
        ...state,
        active: {
          ...candidate,
          resetCount: pair.resetCount + (canReset ? 1 : 0),
          groundedTicks: canReset ? 0 : pair.groundedTicks,
          groundedStarted: canReset ? isGrounded : pair.groundedStarted,
        },
      },
      events: [
        {
          type: "pair-rotated",
          direction: clockwise ? "clockwise" : "anticlockwise",
          from: pair.orientation,
          to: orientation,
          kick: { x: dx, y: dy },
        },
      ],
      accepted: true,
    };
  }
  return emptyTransition(state, "blocked-rotation");
}
export function applyCore(state: GameState, action: Action): Transition {
  if (
    !action ||
    typeof action !== "object" ||
    ![
      "left",
      "right",
      "down",
      "rotate-clockwise",
      "rotate-anticlockwise",
      "hard-drop",
      "place",
      "pause",
      "resume",
      "hint",
    ].includes((action as { kind?: string }).kind ?? "") ||
    Object.keys(action).some((key) => key !== "kind")
  )
    return emptyTransition(state, "invalid-action");
  if (action.kind === "pause") {
    if (!["falling", "clear-mark", "clear-remove", "gravity"].includes(state.phase))
      return emptyTransition(state, "cannot-pause");
    return {
      state: {
        ...state,
        phase: "paused",
        pausedPhase: state.phase as Exclude<GameState["phase"], "paused">,
        assisted: state.assisted || state.settings.mode === "arcade" || state.settings.mode === "daily",
      },
      events: [{ type: "paused" }],
      accepted: true,
    };
  }
  if (action.kind === "resume") {
    if (state.phase !== "paused") return emptyTransition(state, "not-paused");
    const { pausedPhase, ...rest } = state;
    return { state: { ...rest, phase: pausedPhase ?? "falling" }, events: [{ type: "resumed" }], accepted: true };
  }
  if (action.kind === "hint") {
    const witness = state.settings.witness?.[state.completedPairs];
    if (
      state.settings.mode !== "challenge" ||
      state.phase !== "falling" ||
      !state.active ||
      state.witnessIndex !== state.completedPairs ||
      !witness
    )
      return emptyTransition(state, "no-proved-hint-available");
    return {
      state: { ...state, assisted: true },
      events: [{ type: "hint-shown", pair: state.completedPairs, ...witness, assisted: true }],
      accepted: true,
    };
  }
  if (state.phase !== "falling" || !state.active) return emptyTransition(state, "not-ready");
  const pair = state.active;
  // biome-ignore lint/nursery/useExhaustiveSwitchCases: pause, resume and hint return above, so this union no longer includes them
  switch (action.kind) {
    case "left":
    case "right":
      return moved(state, action.kind);
    case "down":
      if (!pairFits(state, { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 } }))
        return emptyTransition(state, "blocked");
      {
        const result = moved(state, "down");
        const points = state.settings.mode === "arcade" || state.settings.mode === "daily" ? 1 : 0;
        const score = state.score + points;
        return {
          ...result,
          state: { ...result.state, score },
          events: points ? [...result.events, { type: "score-changed", score, points }] : result.events,
        };
      }
    case "rotate-clockwise":
      return rotate(state, true);
    case "rotate-anticlockwise":
      return rotate(state, false);
    case "place":
      if (state.settings.mode !== "relaxed") return emptyTransition(state, "place-only-in-relaxed");
      return lock(state, pair);
    case "hard-drop": {
      if (state.settings.mode === "relaxed") return emptyTransition(state, "hard-drop-disabled");
      const normal = rigidLanding(state, pair);
      const reboundResult = state.settings.nature ? rebound(state, normal) : null;
      const landing = reboundResult?.pair ?? normal;
      const points =
        state.settings.mode === "arcade" || state.settings.mode === "daily" ? (normal.pivot.y - pair.pivot.y) * 2 : 0;
      const result = lock(state, landing, points);
      return {
        ...result,
        events: [
          { type: "pair-dropped", from: pair.pivot, to: landing.pivot, points, score: state.score + points },
          ...(reboundResult
            ? [
                {
                  type: "power-drop-landed",
                  power: true,
                  rebound: reboundResult.preview.rebound,
                  ...(reboundResult.preview.selectedDirection
                    ? { direction: reboundResult.preview.selectedDirection }
                    : {}),
                  quarterTurn: reboundResult.preview.quarterTurn,
                  moves: reboundResult.preview.moves,
                  cells: reboundResult.preview.finalCells.map((cell) => ({ id: cell.id, x: cell.x, y: cell.y })),
                  ids: pair.gems.map((gem) => gem.id),
                },
              ]
            : []),
          ...result.events,
        ],
      };
    }
  }
}
