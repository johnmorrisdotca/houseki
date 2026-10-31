import { activeFromColours, addr, drawTriplet, HIDDEN, occupied } from "./engine-setup.js";
import { compactBoard, findMatches } from "./match.js";
import type { GameEvent, GameState, Piece, Transition } from "./types.js";

export function waveCells(state: GameState): readonly number[] {
  return [
    ...new Set(
      findMatches(state.board, state.settings.width, state.settings.height + HIDDEN).flatMap((match) => match.cells),
    ),
  ].sort((a, b) => a - b);
}
export function spawnOrEnd(state: GameState): readonly [GameState, readonly GameEvent[]] {
  const board = state.board;
  const targetIds = state.settings.targetIds ?? [];
  let phase: GameState["phase"] = "falling";
  let reason: string | undefined;
  if (
    state.settings.mode === "challenge" &&
    state.settings.goal === "targets" &&
    targetIds.length > 0 &&
    targetIds.every((id) => !board.some((g) => g?.id === id))
  )
    phase = "won";
  else if (
    state.settings.mode === "challenge" &&
    state.settings.goal === "chain" &&
    state.maxChain >= (state.settings.minimumChain ?? 1)
  )
    phase = "won";
  else if (state.settings.mode === "challenge" && state.settings.goal === "empty" && board.every((g) => g === null))
    phase = "won";
  else if (board.slice(0, state.settings.width * HIDDEN).some((g) => g !== null)) {
    phase = "lost";
    reason = "top-out";
  } else if (state.settings.pieceLimit !== undefined && state.completedPieces >= state.settings.pieceLimit)
    phase = state.settings.mode === "daily" ? "finished" : "lost";
  if (phase !== "falling")
    return [
      { ...state, phase, active: null, ...(reason ? { reason } : {}) },
      [{ type: "run-ended", reason: reason ?? phase }],
    ];
  if (state.settings.mode === "challenge") {
    const queue = state.settings.challengeQueue!;
    const index = (state.challengeIndex ?? 0) + 1;
    if (index >= queue.length)
      return [
        { ...state, phase: "lost", active: null, next: [], reason: "challenge-queue-exhausted" },
        [{ type: "run-ended", reason: "challenge-queue-exhausted" }],
      ];
    const colours = queue[index]!;
    const base = activeFromColours(state, colours);
    const active = {
      ...base,
      gems: base.gems.map((gem, i) => ({ ...gem, id: state.nextId + i })) as unknown as Piece["gems"],
    };
    const next = {
      ...state,
      active,
      challengeIndex: index,
      nextId: state.nextId + 3,
      next: queue.slice(index + 1, index + 4),
    };
    if (occupied(next, active))
      return [
        { ...next, phase: "lost", active: null, reason: "spawn-collision" },
        [{ type: "run-ended", reason: "spawn-collision" }],
      ];
    return [next, [{ type: "piece-spawned", ids: active.gems.map((g) => g.id) }]];
  }
  const queue = [...state.next];
  const colours = queue.shift()!;
  const draw = drawTriplet(state);
  queue.push(draw.colours);
  const base = activeFromColours(state, colours);
  const active = {
    ...base,
    gems: base.gems.map((gem, i) => ({ ...gem, id: state.nextId + i })) as unknown as Piece["gems"],
  };
  let next: GameState = {
    ...state,
    active,
    nextId: state.nextId + 3,
    next: queue,
    bag: draw.bag,
    randomState: draw.randomState,
  };
  if (occupied(next, active)) next = { ...next, phase: "lost", active: null, reason: "spawn-collision" };
  return [
    next,
    [
      {
        type: next.phase === "lost" ? "run-ended" : "piece-spawned",
        ...(next.phase === "lost" ? { reason: "spawn-collision" } : { ids: active.gems.map((g) => g.id) }),
      },
    ],
  ];
}
export function beginWave(state: GameState, chain: number, level: number): readonly [GameState, readonly GameEvent[]] {
  const cells = waveCells(state);
  if (!cells.length)
    return spawnOrEnd({
      ...state,
      phase: "falling",
      active: null,
      pendingClear: undefined,
      resolutionChain: undefined,
      resolutionLevel: undefined,
      resolutionTick: 0,
    });
  const ids = cells.map((cell) => state.board[cell]!.id);
  return [
    {
      ...state,
      phase: "clear-mark",
      active: null,
      pendingClear: cells,
      resolutionChain: chain,
      resolutionLevel: level,
      resolutionTick: 0,
    },
    [{ type: "match-marked", chain, cells, ids }],
  ];
}
export function lock(state: GameState): Transition {
  const piece = state.active!;
  const placed = [...state.board];
  for (let i = 0; i < 3; i++) {
    const y = piece.y + i;
    const at = addr(piece.x, y, state.settings.width);
    if (y < -HIDDEN || y >= state.settings.height || placed[at] !== null)
      return {
        state: { ...state, phase: "lost", active: null, reason: "spawn-collision" },
        events: [{ type: "run-ended", reason: "spawn-collision" }],
        accepted: true,
      };
    placed[at] = piece.gems[i]!;
  }
  const board = compactBoard(placed, state.settings.width, state.settings.height + HIDDEN);
  const witnessStep = state.settings.witness?.[state.completedPieces];
  const witnessPathMatches =
    state.witnessPathMatches &&
    (!witnessStep || (witnessStep.x === piece.x && witnessStep.orientation === piece.orientation));
  const next = {
    ...state,
    board,
    active: null,
    completedPieces: state.completedPieces + 1,
    witnessPathMatches,
    pieceTicks: 0,
    waves: [],
    resolutionTick: 0,
  };
  const [resolved, events] = beginWave(next, 1, piece.level);
  return {
    state: resolved,
    events: [{ type: "piece-locked", x: piece.x, y: piece.y, ids: piece.gems.map((g) => g.id) }, ...events],
    accepted: true,
  };
}
export function advanceResolution(state: GameState): Transition {
  let next = { ...state, resolutionTick: state.resolutionTick + 1 };
  const events: GameEvent[] = [];
  if (next.phase === "clear-mark" && next.resolutionTick >= 7)
    next = { ...next, phase: "clear-remove", resolutionTick: 0 };
  else if (next.phase === "clear-remove" && next.resolutionTick >= 6) {
    const cells = new Set(next.pendingClear ?? []);
    const ids = [...cells].map((index) => next.board[index]!.id);
    const chain = next.resolutionChain ?? 1;
    const points = 10 * cells.size * (next.resolutionLevel ?? 1) * chain;
    const board = next.board.map((gem, index) => (cells.has(index) ? null : gem));
    const gravityBoard = compactBoard(board, next.settings.width, next.settings.height + HIDDEN);
    const moved = gravityBoard.flatMap((gem, index) =>
      gem && board.findIndex((old) => old?.id === gem.id) !== index
        ? [{ id: gem.id, from: board.findIndex((old) => old?.id === gem.id), to: index }]
        : [],
    );
    const wave = { clearedIds: ids, cells: [...cells], chain, points };
    const waves = [...next.waves, wave];
    const score = next.score + points;
    next = {
      ...next,
      board,
      gravityBoard,
      score,
      waves,
      maxChain: Math.max(next.maxChain, chain),
      phase: "gravity",
      pendingClear: undefined,
      resolutionTick: 0,
    };
    events.push(
      { type: "cells-cleared", chain, cells: [...cells], ids, points },
      { type: "score-changed", score, points },
    );
    if (!moved.length) events.push({ type: "gravity-started", cells: [] });
  } else if (next.phase === "gravity" && next.resolutionTick >= 9) {
    const settled = next.gravityBoard ?? next.board;
    const moved = settled.flatMap((gem, index) =>
      gem && next.board.findIndex((old) => old?.id === gem.id) !== index
        ? [{ id: gem.id, from: next.board.findIndex((old) => old?.id === gem.id), to: index }]
        : [],
    );
    if (moved.length) events.push({ type: "cells-fell", gems: moved });
    const result = beginWave(
      { ...next, board: settled, gravityBoard: undefined, resolutionTick: 0, phase: "falling" },
      (next.resolutionChain ?? next.waves.at(-1)?.chain ?? 1) + 1,
      next.resolutionLevel ?? 1,
    );
    next = result[0];
    events.push(...result[1]);
  }
  return { state: next, events, accepted: true };
}
