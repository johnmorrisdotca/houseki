import {
  allMatchedCells,
  blockBonds,
  blockCells,
  canPlace,
  impactSupportIds,
  landingY,
  matchGroups,
  settle,
} from "./physics.js";
import { nextInt, seedState } from "./random.js";
import type { Action, Block, Bond, Colour, Floor, FloorSchedule, GameEvent, GameState, Transition } from "./types.js";
import { COLOURS } from "./validation.js";

export function floorAt(schedule: FloorSchedule, placement: number): Floor {
  switch (schedule.kind) {
    case "frequent":
      return placement % 2 === 0 ? "magnetic" : "calm";
    case "occasional":
      return placement % 4 === 0 ? "magnetic" : "calm";
    case "infrequent":
      return placement % 8 === 0 ? "magnetic" : "calm";
    case "mid-level":
      return placement === schedule.placement ? "magnetic" : "calm";
    case "fixed":
      return schedule.floor;
    case "authored":
      return schedule.magneticPlacements.includes(placement) ? "magnetic" : (schedule.defaultFloor ?? "calm");
  }
}
export function drawQueue(
  seed: string | number,
  count: number,
  colourCount: number,
): { readonly queue: readonly (readonly [Colour, Colour, Colour, Colour])[]; readonly randomState: number } {
  let randomState = seedState(`magnetic-blocks|magnetic-blocks-1|${String(seed)}`);
  const queue: (readonly [Colour, Colour, Colour, Colour])[] = [];
  for (let piece = 0; piece < count; piece++) {
    const colours: Colour[] = [];
    for (let i = 0; i < 4; i++) {
      const [index, next] = nextInt(randomState, colourCount);
      randomState = next;
      colours.push(COLOURS[index]!);
    }
    queue.push(Object.freeze(colours as [Colour, Colour, Colour, Colour]));
  }
  return { queue: Object.freeze(queue), randomState };
}
export function freezeBlock(block: Block): Block {
  return Object.freeze({
    ...block,
    gems: Object.freeze(block.gems.map((gem) => Object.freeze({ ...gem }))) as unknown as Block["gems"],
  });
}
export function freezeState(state: GameState): GameState {
  return Object.freeze(state);
}
export function freezeBonds(bonds: readonly Bond[]): readonly Bond[] {
  return Object.freeze(
    bonds.map((edge) => Object.freeze({ a: edge.a, b: edge.b })).sort((a, b) => a.a - b.a || a.b - b.b),
  );
}
export function empty(state: GameState, reason: string): Transition {
  return { state, events: Object.freeze([]), accepted: false, reason };
}
export function completeGoal(state: GameState): boolean {
  const goal = state.settings.goal;
  if (!goal) return false;
  return goal.kind === "clear-all"
    ? state.board.every((gem) => gem === null)
    : goal.targetIds.every((id) => !state.board.some((gem) => gem?.id === id));
}
export function spawn(state: GameState): readonly [GameState, readonly GameEvent[]] {
  if (completeGoal(state))
    return [
      { ...state, phase: "won", active: null, reason: "goal-complete" },
      [{ type: "run-ended", result: "won", reason: "goal-complete", score: state.score }],
    ];
  if (state.placements >= state.settings.pieceLimit || !state.queue.length) {
    const result = state.settings.goal ? "lost" : "finished";
    return [
      { ...state, phase: result, active: null, reason: "queue-exhausted" },
      [{ type: "run-ended", result, reason: "queue-exhausted", score: state.score }],
    ];
  }
  const [colours, ...rest] = state.queue;
  const gems = colours!.map((colour, index) => ({ id: state.nextId + index, colour })) as unknown as Block["gems"];
  const block = freezeBlock({
    x: Math.floor(state.settings.width / 2) - 1,
    y: 0,
    orientation: 0,
    gems,
    descent: 0,
    lockTicks: 0,
    lockResets: 0,
    lockStarted: false,
  });
  const floor = floorAt(state.settings.schedule, state.placements + 1);
  if (!canPlace(block, state.board, state.settings.width, state.settings.height, state.settings.mask))
    return [
      {
        ...state,
        queue: Object.freeze(rest),
        nextId: state.nextId + 4,
        active: null,
        phase: "lost",
        floor,
        nextFloor: floorAt(state.settings.schedule, state.placements + 2),
        reason: "top-out",
      },
      [{ type: "run-ended", result: "lost", reason: "top-out", score: state.score }],
    ];
  const next: GameState = {
    ...state,
    queue: Object.freeze(rest),
    nextId: state.nextId + 4,
    active: block,
    phase: "falling",
    floor,
    nextFloor: floorAt(state.settings.schedule, state.placements + 2),
    chain: 0,
    reason: undefined,
  };
  return [
    next,
    [
      {
        type: "piece-spawned",
        ids: block.gems.map((gem) => gem.id),
        x: block.x,
        y: block.y,
        floor,
        nextFloor: next.nextFloor,
      },
    ],
  ];
}
export function startMatchOrSpawn(state: GameState): readonly [GameState, readonly GameEvent[]] {
  const groups = matchGroups(state.board, state.settings.width, state.settings.height, state.settings.mask);
  const cells = allMatchedCells(groups);
  if (cells.length)
    return [
      {
        ...state,
        phase: "clear-mark",
        pendingClear: Object.freeze([...cells]),
        resolutionTick: 0,
        chain: state.chain + 1,
        maxChain: Math.max(state.maxChain, state.chain + 1),
        gravityBoard: null,
      },
      [{ type: "match-marked", chain: state.chain + 1, cells, ids: cells.map((index) => state.board[index]!.id) }],
    ];
  if (completeGoal(state))
    return [
      { ...state, phase: "won", active: null, reason: "goal-complete" },
      [{ type: "run-ended", result: "won", reason: "goal-complete", score: state.score }],
    ];
  return spawn(state);
}
export function place(
  state: GameState,
  action: Extract<Action, { kind: "hard-drop" | "land" | "soft-drop" }>,
): Transition {
  const hardDrop = action.kind === "hard-drop";
  const active = state.active!;
  const { width, height, mask, magneticImpact } = state.settings;
  const landing = { ...active, y: landingY(active, state.board, width, height, mask) };
  const floor = state.pendingFloorOverride ?? state.floor;
  let board = [...state.board];
  let bonds = [...state.bonds];
  let impactIds: readonly number[] = Object.freeze([]);
  const events: GameEvent[] = [];
  if (floor === "magnetic" && magneticImpact && hardDrop) {
    impactIds = impactSupportIds(landing, board, width, height, mask);
    if (impactIds.length) {
      const remove = new Set(impactIds);
      board = board.map((gem) => (gem && remove.has(gem.id) ? null : gem));
      bonds = bonds.filter((edge) => !remove.has(edge.a) && !remove.has(edge.b));
      events.push({
        type: "magnetic-impact",
        floor,
        removedIds: impactIds,
        cells: impactIds.map((id) => state.board.findIndex((gem) => gem?.id === id)),
      });
    }
  }
  for (const { index, gem } of blockCells(landing, width)) board[index] = gem;
  bonds = floor === "calm" ? [...bonds, ...blockBonds(landing)] : [];
  const settled = settle(board, bonds, floor, width, height, mask);
  const placements = state.placements + 1;
  const charges = state.pendingFloorOverride && state.floorSwitchCharges ? 0 : state.floorSwitchCharges;
  const next: GameState = {
    ...state,
    board: Object.freeze(board),
    bonds: freezeBonds(settled.bonds),
    active: null,
    phase: "gravity",
    score: state.score,
    moves: state.moves + 1,
    placements,
    floor,
    nextFloor: floorAt(state.settings.schedule, placements + 1),
    floorSwitchCharges: charges as 0 | 1,
    pendingFloorOverride: null,
    pendingClear: Object.freeze([]),
    gravityBoard: settled.board,
    resolutionTick: 0,
    impactRemovedIds: Object.freeze([...impactIds]),
    chain: 0,
  };
  events.push({
    type: "piece-locked",
    ids: active.gems.map((gem) => gem.id),
    cells: blockCells(landing, width).map((entry) => entry.index),
    floor,
    hardDrop,
    consumedFloorSwitch: Boolean(state.pendingFloorOverride),
  });
  return { state: next, events: Object.freeze(events), accepted: true };
}
export function gravityResult(state: GameState): readonly [GameState, readonly GameEvent[]] {
  const board = state.gravityBoard ?? state.board;
  const next = { ...state, board, gravityBoard: null, resolutionTick: 0 };
  const [continued, events] = startMatchOrSpawn(next);
  return [continued, [{ type: "gravity-completed", floor: state.floor, board }, ...events]];
}
export function core(state: GameState, action: Action): Transition {
  if (
    !action ||
    typeof action !== "object" ||
    ![
      "left",
      "right",
      "soft-drop",
      "rotate-clockwise",
      "rotate-anticlockwise",
      "hard-drop",
      "land",
      "pause",
      "resume",
      "set-floor-override",
      "cancel-floor-override",
    ].includes((action as { kind?: string }).kind ?? "")
  )
    return empty(state, "invalid-action");
  const allowed = action.kind === "set-floor-override" ? ["kind", "floor"] : ["kind"];
  if (
    Object.keys(action).some((key) => !allowed.includes(key)) ||
    (action.kind === "set-floor-override" && !["calm", "magnetic"].includes(action.floor))
  )
    return empty(state, "invalid-action");
  if (action.kind === "pause") {
    if (!["falling", "clear-mark", "clear-remove", "gravity"].includes(state.phase))
      return empty(state, "cannot-pause");
    return {
      state: { ...state, phase: "paused", pausedPhase: state.phase as Exclude<GameState["phase"], "paused"> },
      events: [{ type: "paused" }],
      accepted: true,
    };
  }
  if (action.kind === "resume") {
    if (state.phase !== "paused") return empty(state, "not-paused");
    const { pausedPhase, ...rest } = state;
    return { state: { ...rest, phase: pausedPhase ?? "falling" }, events: [{ type: "resumed" }], accepted: true };
  }
  if (state.phase !== "falling" || !state.active) return empty(state, "action-unavailable");
  if (action.kind === "set-floor-override") {
    if (!state.settings.floorSwitch || !state.floorSwitchCharges) return empty(state, "floor-switch-unavailable");
    const next = { ...state, pendingFloorOverride: action.floor };
    return {
      state: next,
      events: [{ type: "floor-override-selected", floor: action.floor, charges: state.floorSwitchCharges }],
      accepted: true,
    };
  }
  if (action.kind === "cancel-floor-override") {
    if (!state.pendingFloorOverride) return empty(state, "no-floor-override");
    return {
      state: { ...state, pendingFloorOverride: null },
      events: [{ type: "floor-override-cancelled", charges: state.floorSwitchCharges }],
      accepted: true,
    };
  }
  const active = state.active;
  const { width, height, mask } = state.settings;
  if (action.kind === "hard-drop") {
    let landed = active;
    while (canPlace({ ...landed, y: landed.y + 1 }, state.board, width, height, mask))
      landed = { ...landed, y: landed.y + 1 };
    return place({ ...state, active: freezeBlock(landed) }, action);
  }
  if (action.kind === "land") return place(state, action);
  if (action.kind === "soft-drop") {
    if (!canPlace({ ...active, y: active.y + 1 }, state.board, width, height, mask)) return place(state, action);
    const moved = { ...active, y: active.y + 1, descent: 0 };
    const grounded = !canPlace({ ...moved, y: moved.y + 1 }, state.board, width, height, mask);
    const next = {
      ...state,
      active: freezeBlock({
        ...moved,
        ...(state.settings.mode === "arcade" && grounded ? { lockStarted: true, lockTicks: 0 } : {}),
      }),
    };
    return { state: next, events: [{ type: "piece-moved", direction: "down", y: next.active!.y }], accepted: true };
  }
  if (action.kind === "left" || action.kind === "right") {
    const x = active.x + (action.kind === "left" ? -1 : 1);
    const moved = { ...active, x };
    if (!canPlace(moved, state.board, width, height, mask)) return empty(state, "blocked");
    const grounded = !canPlace({ ...active, y: active.y + 1 }, state.board, width, height, mask);
    const reset = state.settings.mode === "arcade" && grounded && active.lockResets < 8;
    const nextGrounded = !canPlace({ ...moved, y: moved.y + 1 }, state.board, width, height, mask);
    return {
      state: {
        ...state,
        active: freezeBlock({
          ...moved,
          lockTicks: reset ? 0 : active.lockTicks,
          lockResets: active.lockResets + (reset ? 1 : 0),
          lockStarted: reset ? nextGrounded : nextGrounded || active.lockStarted,
          ...(state.settings.mode === "arcade" && !nextGrounded && active.lockResets < 8
            ? { lockTicks: 0, lockStarted: false }
            : {}),
        }),
      },
      events: [{ type: "piece-moved", direction: action.kind, x }],
      accepted: true,
    };
  }
  const orientation = ((active.orientation + (action.kind === "rotate-clockwise" ? 1 : 3)) % 4) as Block["orientation"];
  const rotated = { ...active, orientation };
  if (!canPlace(rotated, state.board, width, height, mask)) return empty(state, "blocked");
  const grounded = !canPlace({ ...active, y: active.y + 1 }, state.board, width, height, mask);
  const reset = state.settings.mode === "arcade" && grounded && active.lockResets < 8;
  return {
    state: {
      ...state,
      active: freezeBlock({
        ...rotated,
        lockTicks: reset ? 0 : active.lockTicks,
        lockResets: active.lockResets + (reset ? 1 : 0),
        lockStarted: reset ? true : active.lockStarted,
      }),
    },
    events: [
      {
        type: "piece-rotated",
        orientation,
        ids: rotated.gems.map((gem) => gem.id),
        cells: blockCells(rotated, width).map((item) => item.index),
      },
    ],
    accepted: true,
  };
}
