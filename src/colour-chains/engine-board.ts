import {
  applyEarthquake,
  applyLightning,
  applyMagneticPulse,
  createNatureState,
  isEnvironmentTurnScheduled,
  markMagneticStones,
} from "../nature.js";
import { compactBoard, findGroups } from "./match.js";
import { drawPair } from "./random.js";
import type { Cell, Colour, GameEvent, GameState, Gem, Orientation, Pair, Transition } from "./types.js";

export const HIDDEN = 3;
export const RULES = "chains-1" as const;
export const OFFSETS: Readonly<Record<Orientation, readonly [number, number]>> = {
  up: [0, -1],
  right: [1, 0],
  down: [0, 1],
  left: [-1, 0],
};
export const ORIENTATIONS: readonly Orientation[] = ["up", "right", "down", "left"];
export const KICKS: readonly (readonly [number, number])[] = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [0, -1],
];
export const indexOf = (x: number, y: number, width: number): number => (y + HIDDEN) * width + x;
export const emptyTransition = (state: GameState, reason: string): Transition => ({
  state,
  events: [],
  accepted: false,
  reason,
});
export function cellFor(pair: Pair, satellite: boolean): Cell {
  const [dx, dy] = OFFSETS[pair.orientation];
  return satellite ? { x: pair.pivot.x + dx, y: pair.pivot.y + dy } : pair.pivot;
}
export function occupied(state: GameState, x: number, y: number): boolean {
  return (
    x < 0 ||
    x >= state.settings.width ||
    y < -HIDDEN ||
    y >= state.settings.height ||
    state.board[indexOf(x, y, state.settings.width)] !== null
  );
}
export function pairFits(state: GameState, pair: Pair): boolean {
  const a = cellFor(pair, false);
  const b = cellFor(pair, true);
  return (a.x !== b.x || a.y !== b.y) && !occupied(state, a.x, a.y) && !occupied(state, b.x, b.y);
}
export function grounded(state: GameState, pair: Pair): boolean {
  return !pairFits(state, { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 } });
}
export function rigidLanding(state: GameState, initial: Pair): Pair {
  let pair = initial;
  while (pairFits(state, { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 } }))
    pair = { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 } };
  return pair;
}
export function makePair(
  state: Pick<GameState, "settings" | "completedPairs" | "nextId">,
  colours: readonly [Colour, Colour],
  magnets?: readonly [boolean, boolean],
): Pair {
  const level =
    state.settings.mode === "arcade" || state.settings.mode === "daily" ? 1 + Math.floor(state.completedPairs / 30) : 1;
  const gems: [Gem, Gem] = [
    { id: state.nextId, colour: colours[0] },
    { id: state.nextId + 1, colour: colours[1] },
  ];
  if (magnets?.[0]) gems[0] = { ...gems[0], magnetic: true };
  if (magnets?.[1]) gems[1] = { ...gems[1], magnetic: true };
  return {
    pivot: { x: Math.floor((state.settings.width - 1) / 2), y: -2 },
    orientation: "up",
    gems,
    level,
    gravityTicks: 0,
    groundedTicks: 0,
    resetCount: 0,
    groundedStarted: false,
  };
}
export function magneticFlags(
  seed: string,
  pairIndex: number,
  colours: readonly [Colour, Colour],
): readonly [boolean, boolean] {
  const board = createNatureState({
    width: 2,
    height: 1,
    seed: `colour-chains|shizen|${seed}|pair-${pairIndex}`,
    cells: [
      { id: 1, kind: "stone", colour: colours[0] },
      { id: 2, kind: "stone", colour: colours[1] },
    ],
  });
  const marked = markMagneticStones(board, { probability: 0.08, maximum: 1 }).state;
  return [marked.cells[0]?.magnetic === true, marked.cells[1]?.magnetic === true];
}
export function natureBoard(state: GameState) {
  const width = state.settings.width;
  const height = state.settings.height;
  const cells = state.board
    .slice(width * HIDDEN)
    .map((gem) =>
      gem
        ? { id: gem.id, kind: "stone" as const, colour: gem.colour, ...(gem.magnetic ? { magnetic: true } : {}) }
        : null,
    );
  return createNatureState({ width, height, seed: `colour-chains|shizen|${state.settings.seed}`, cells });
}
export function naturePulse(
  state: GameState,
  board: readonly (Gem | null)[],
): { board: readonly (Gem | null)[]; events: readonly GameEvent[] } {
  const width = state.settings.width;
  const height = state.settings.height;
  const cells = board
    .slice(width * HIDDEN)
    .map((gem) =>
      gem
        ? { id: gem.id, kind: "stone" as const, colour: gem.colour, ...(gem.magnetic ? { magnetic: true } : {}) }
        : null,
    );
  const result = applyMagneticPulse(
    createNatureState({ width, height, seed: `colour-chains|shizen|${state.settings.seed}`, cells }),
  );
  if (!result.events.length) return { board, events: [] };
  const updated = [...board];
  for (let i = 0; i < result.state.cells.length; i++) {
    const entity = result.state.cells[i];
    updated[i + width * HIDDEN] = entity
      ? { id: entity.id, colour: entity.colour as Colour, ...(entity.magnetic ? { magnetic: true } : {}) }
      : null;
  }
  return { board: updated, events: result.events.map((event) => ({ ...event })) };
}
export function boardWithNatureCells(
  state: GameState,
  board: readonly (Gem | null)[],
  cells: readonly ({ id: number; kind: "stone" | "obstacle"; colour?: string; magnetic?: boolean } | null)[],
): readonly (Gem | null)[] {
  const width = state.settings.width;
  const updated = [...board];
  for (let index = 0; index < cells.length; index++) {
    const entity = cells[index];
    updated[index + width * HIDDEN] =
      entity?.kind === "stone"
        ? { id: entity.id, colour: entity.colour as Colour, ...(entity.magnetic ? { magnetic: true } : {}) }
        : null;
  }
  return updated;
}
export function applyWeather(state: GameState): { board: readonly (Gem | null)[]; events: readonly GameEvent[] } {
  const nature = natureBoard(state);
  const turn = state.completedPairs;
  const interval = state.settings.weather === "frequent" ? 2 : 8;
  const eventIndex = Math.floor(turn / interval) - 1;
  const kind = eventIndex % 2 === 0 ? "jumble" : "lightning";
  if (kind === "jumble") {
    const result = applyEarthquake(
      createNatureState({
        width: nature.width,
        height: nature.height,
        seed: `${state.settings.seed}|arashi|turn-${turn}`,
        cells: nature.cells,
      }),
      { kind: "jumble" },
    );
    return {
      board: boardWithNatureCells(state, state.board, result.state.cells),
      events: [{ type: "weather-triggered", kind, turn }, ...result.events.map((event) => ({ ...event }))],
    };
  }
  const result = applyLightning(
    createNatureState({
      width: nature.width,
      height: nature.height,
      seed: `${state.settings.seed}|arashi|turn-${turn}`,
      cells: nature.cells,
    }),
  );
  return {
    board: boardWithNatureCells(state, state.board, result.state.cells),
    events: [{ type: "weather-triggered", kind, turn }, ...result.events.map((event) => ({ ...event }))],
  };
}
export function takeNextPair(state: GameState): readonly [GameState, readonly GameEvent[]] {
  const colours = state.next[0]!;
  const draw = drawPair(state);
  const next = [...state.next.slice(1), draw[0]];
  const flags = state.settings.nature ? state.nextMagnetic?.[0] : undefined;
  const active = makePair(state, colours, flags);
  const nextMagnetic = state.settings.nature
    ? [...(state.nextMagnetic?.slice(1) ?? []), magneticFlags(state.settings.seed, state.completedPairs + 3, draw[0])]
    : undefined;
  let current: GameState = {
    ...state,
    active,
    next,
    ...(nextMagnetic ? { nextMagnetic } : {}),
    bag: draw[1],
    randomState: draw[2],
    nextId: state.nextId + 2,
  };
  if (!pairFits(current, active)) current = { ...current, active: null, phase: "lost", reason: "spawn-collision" };
  return [
    current,
    [
      current.phase === "lost"
        ? { type: "run-ended", reason: "spawn-collision" }
        : { type: "pair-spawned", ids: active.gems.map((gem) => gem.id), colours },
    ],
  ];
}
export function movedEntries(
  before: readonly (Gem | null)[],
  after: readonly (Gem | null)[],
  width: number,
): readonly { id: number; from: Cell; to: Cell }[] {
  const origin = new Map<number, number>();
  before.forEach((gem, index) => {
    if (gem) origin.set(gem.id, index);
  });
  return after.flatMap((gem, index) => {
    if (!gem) return [];
    const from = origin.get(gem.id)!;
    if (from === index) return [];
    return [
      {
        id: gem.id,
        from: { x: from % width, y: Math.floor(from / width) - HIDDEN },
        to: { x: index % width, y: Math.floor(index / width) - HIDDEN },
      },
    ];
  });
}
export function satisfied(state: GameState): boolean {
  const goal = state.settings.goal;
  if (!goal) return false;
  if (goal.kind === "clear-targets") return goal.targetIds.every((id) => !state.board.some((gem) => gem?.id === id));
  if (goal.kind === "minimum-chain") return state.maxChain >= goal.chain;
  return state.board.every((gem) => gem === null);
}
export function terminalAfterResolution(state: GameState): readonly [GameState, readonly GameEvent[]] {
  if (state.settings.mode === "challenge" && satisfied(state))
    return [
      { ...state, phase: "won", active: null, reason: "goal-complete" },
      [{ type: "run-ended", reason: "goal-complete", score: state.score }],
    ];
  if (state.board.slice(0, state.settings.width * HIDDEN).some((gem) => gem !== null))
    return [{ ...state, phase: "lost", active: null, reason: "top-out" }, [{ type: "run-ended", reason: "top-out" }]];
  let current = state;
  const weatherEvents: GameEvent[] = [];
  if (state.settings.weather && state.weatherResolvedPairs !== state.completedPairs) {
    const turn = state.completedPairs;
    current = { ...current, weatherResolvedPairs: turn };
    if (isEnvironmentTurnScheduled(turn, { kind: state.settings.weather })) {
      const effect = applyWeather(current);
      weatherEvents.push(...effect.events);
      current = { ...current, board: effect.board };
      const groups = findGroups(current.board, current.settings.width, current.settings.height + HIDDEN);
      if (groups.length) {
        const cells = [...new Set(groups.flat())].sort((a, b) => a - b);
        return [
          { ...current, phase: "clear-mark", active: null, clearCells: cells, gravityBoard: null, resolutionTick: 0 },
          [
            ...weatherEvents,
            {
              type: "match-marked",
              chain: current.waves.length + 1,
              cells,
              ids: cells.map((index) => current.board[index]!.id),
              groups,
            },
          ],
        ];
      }
      const settled = compactBoard(current.board, current.settings.width, current.settings.height + HIDDEN);
      const movement = movedEntries(current.board, settled, current.settings.width);
      if (movement.length)
        return [
          { ...current, phase: "gravity", active: null, gravityBoard: settled, resolutionTick: 0 },
          [...weatherEvents, { type: "cells-fell", cells: movement, before: current.board, after: settled }],
        ];
      current = { ...current, board: settled };
      if (current.settings.mode === "challenge" && satisfied(current))
        return [
          { ...current, phase: "won", active: null, reason: "goal-complete" },
          [...weatherEvents, { type: "run-ended", reason: "goal-complete", score: current.score }],
        ];
    }
  }
  if (current.settings.mode === "challenge") {
    const nextIndex = current.completedPairs;
    if (nextIndex >= (current.settings.queue?.length ?? 0))
      return [
        { ...current, phase: "lost", active: null, reason: "challenge-queue-exhausted" },
        [...weatherEvents, { type: "run-ended", reason: "challenge-queue-exhausted" }],
      ];
    const queue = current.settings.queue!;
    const colours = queue[nextIndex]!;
    const pair = makePair(current, colours, current.settings.magneticQueue?.[nextIndex]);
    const nextMagnetic = current.settings.nature
      ? queue
          .slice(nextIndex + 1, nextIndex + 4)
          .map((_, index) => current.settings.magneticQueue?.[nextIndex + index + 1] ?? ([false, false] as const))
      : undefined;
    const next = {
      ...current,
      active: pair,
      next: queue.slice(nextIndex + 1, nextIndex + 4),
      ...(nextMagnetic ? { nextMagnetic: Object.freeze(nextMagnetic) } : {}),
      nextId: current.nextId + 2,
    };
    if (!pairFits(next, pair))
      return [
        { ...next, active: null, phase: "lost", reason: "spawn-collision" },
        [...weatherEvents, { type: "run-ended", reason: "spawn-collision" }],
      ];
    return [next, [...weatherEvents, { type: "pair-spawned", ids: pair.gems.map((gem) => gem.id), colours }]];
  }
  if (current.settings.pairLimit !== undefined && current.completedPairs >= current.settings.pairLimit)
    return [
      { ...current, phase: "finished", active: null, reason: "pair-limit" },
      [...weatherEvents, { type: "run-ended", reason: "pair-limit", score: current.score }],
    ];
  const [spawned, events] = takeNextPair(current);
  return [spawned, [...weatherEvents, ...events]];
}
