import { compactBoard, findGroups } from "./match.js";
import { drawPair, seedState } from "./random.js";
import type {
  Action,
  ChainsPowerDropPreview,
  Colour,
  CreateOptions,
  GameEvent,
  GameState,
  GameStatus,
  Gem,
  Landing,
  Settings,
  Transition,
} from "./types.js";
import { normalizeOptions } from "./validation.js";

export { StoneChainsOptionsError } from "./validation.js";

import { applyCore, lock, moved, rebound, rotate, startWave } from "./engine-actions.js";
import {
  cellFor,
  grounded,
  HIDDEN,
  indexOf,
  magneticFlags,
  makePair,
  movedEntries,
  naturePulse,
  RULES,
  rigidLanding,
} from "./engine-board.js";

/** Applies one immutable accepted action and records its logical-tick position.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param action - One native action for this entry point; inspect accepted and reason on the result.
 * @returns Applies one immutable accepted action and records its logical-tick position.
 * @example
 * ```ts
 * import { applyAction, createGame } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { Action } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const action: Action={kind:"left"};
 * console.log(applyAction(state,action).accepted);
 * ```
 */
export function applyAction(state: GameState, action: Action): Transition {
  const result = applyCore(state, action);
  if (!result.accepted) return result;
  const previous = state.recording.at(-1);
  const ordinal = previous?.tick === state.elapsedTicks ? previous.ordinal + 1 : 0;
  return {
    ...result,
    state: { ...result.state, recording: [...state.recording, { tick: state.elapsedTicks, ordinal, action }] },
  };
}
export function advanceResolution(state: GameState): Transition {
  let next = { ...state, resolutionTick: state.resolutionTick + 1 };
  const events: GameEvent[] = [];
  if (next.phase === "clear-mark" && next.resolutionTick >= 7) {
    next = { ...next, phase: "clear-remove", resolutionTick: 0 };
    events.push({ type: "clear-removal-started", chain: next.waves.length + 1, cells: next.clearCells });
  } else if (next.phase === "clear-remove" && next.resolutionTick >= 6) {
    const clear = new Set(next.clearCells);
    const ids = [...clear].map((index) => next.board[index]!.id);
    const chain = next.waves.length + 1;
    const level = next.resolutionLevel ?? 1;
    const points = 10 * clear.size * level * chain;
    const board = next.board.map((gem, index) => (clear.has(index) ? null : gem));
    const wave = { chain, cells: [...clear], ids, points };
    const score = next.score + points;
    next = {
      ...next,
      board,
      score,
      waves: [...next.waves, wave],
      maxChain: Math.max(next.maxChain, chain),
      phase: "gravity",
      resolutionTick: 0,
      clearCells: [],
      resolutionHadClear: true,
    };
    events.push({ type: "cells-cleared", chain, cells: [...clear], ids, points, score });
    if (next.settings.nature && next.naturePulsePending) {
      const pulse = naturePulse(next, board);
      const afterPulse = pulse.board;
      events.push(...pulse.events);
      const groups = findGroups(afterPulse, next.settings.width, next.settings.height + HIDDEN);
      next = { ...next, board: afterPulse, naturePulsePending: false, phase: "falling" };
      if (groups.length) {
        const cells = [...new Set(groups.flat())].sort((a, b) => a - b);
        next = { ...next, phase: "clear-mark", clearCells: cells, gravityBoard: null, resolutionTick: 0 };
        events.push({
          type: "match-marked",
          chain: next.waves.length + 1,
          cells,
          ids: cells.map((index) => afterPulse[index]!.id),
          groups,
        });
        return { state: next, events, accepted: true };
      }
      const gravityBoard = compactBoard(afterPulse, next.settings.width, next.settings.height + HIDDEN);
      next = { ...next, gravityBoard, phase: "gravity" };
    } else next = { ...next, gravityBoard: compactBoard(board, next.settings.width, next.settings.height + HIDDEN) };
  } else if (next.phase === "gravity" && next.resolutionTick >= 9) {
    const before = next.board;
    const after = next.gravityBoard ?? next.board;
    const falling = movedEntries(before, after, next.settings.width);
    next = { ...next, board: after, gravityBoard: null, resolutionTick: 0, phase: "falling" };
    if (falling.length) events.push({ type: "cells-fell", cells: falling, before, after });
    const result = startWave(next, next.waves.length + 1);
    next = result[0];
    events.push(...result[1]);
  }
  return { state: next, events, accepted: true };
}
export function lockGrounded(state: GameState): Transition {
  return lock(state, rigidLanding(state, state.active!));
}
/** Advances deterministic 60 Hz simulation and resolution; Relaxed and Challenges do not force a falling clock.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param ticks - The nonnegative number of fixed 60 Hz logical ticks to advance.
 * @returns Advances deterministic 60 Hz simulation and resolution; Relaxed and Challenges do not force a falling clock.
 * @example
 * ```ts
 * import { advanceTicks, createGame } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * console.log(advanceTicks(state,1).state.phase);
 * ```
 */
export function advanceTicks(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600)
    throw new RangeError("ticks must be an integer from 0 to 3600");
  let current = state;
  const events: GameEvent[] = [];
  for (let i = 0; i < ticks && !["paused", "won", "lost", "finished"].includes(current.phase); i++) {
    current = { ...current, elapsedTicks: current.elapsedTicks + 1 };
    if (current.phase !== "falling") {
      const result = advanceResolution(current);
      current = result.state;
      events.push(...result.events);
      continue;
    }
    if (!current.active || current.settings.mode === "relaxed" || current.settings.mode === "challenge") continue;
    const pair = current.active;
    if (grounded(current, pair)) {
      if (!pair.groundedStarted) current = { ...current, active: { ...pair, groundedStarted: true, groundedTicks: 0 } };
      else {
        const groundedTicks = pair.groundedTicks + 1;
        current = { ...current, active: { ...pair, groundedTicks } };
        if (groundedTicks >= 24) {
          const result = lockGrounded(current);
          current = result.state;
          events.push(...result.events);
        }
      }
    } else {
      const interval = Math.max(6, Math.round(60 * 0.85 ** (pair.level - 1)));
      const gravityTicks = pair.gravityTicks + 1;
      if (gravityTicks >= interval) {
        const nextPair = { ...pair, pivot: { x: pair.pivot.x, y: pair.pivot.y + 1 }, gravityTicks: 0 };
        current = {
          ...current,
          active: { ...nextPair, ...(grounded(current, nextPair) ? { groundedStarted: false } : {}) },
        };
        events.push({ type: "pair-fell", from: pair.pivot, to: nextPair.pivot });
      } else current = { ...current, active: { ...pair, gravityTicks } };
    }
  }
  return { state: current, events, accepted: true };
}
/** Lists only actions accepted by the current game state.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Lists only actions accepted by the current game state.
 * @example
 * ```ts
 * import { createGame, legalActions } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * console.log(legalActions(state).length);
 * ```
 */
export function legalActions(state: GameState): readonly Action[] {
  if (state.phase === "paused") return [{ kind: "resume" }];
  if (["clear-mark", "clear-remove", "gravity"].includes(state.phase)) return [{ kind: "pause" }];
  if (state.phase !== "falling" || !state.active) return [];
  const actions: Action[] = [];
  for (const kind of ["left", "right"] as const) if (moved(state, kind).accepted) actions.push({ kind });
  if (rotate(state, true).accepted) actions.push({ kind: "rotate-clockwise" });
  if (rotate(state, false).accepted) actions.push({ kind: "rotate-anticlockwise" });
  actions.push({ kind: "down" });
  if (state.settings.mode === "relaxed") actions.push({ kind: "place" });
  else actions.push({ kind: "hard-drop" });
  if (state.settings.witness?.[state.completedPairs] && state.witnessIndex === state.completedPairs)
    actions.push({ kind: "hint" });
  actions.push({ kind: "pause" });
  return actions;
}
/** Returns the exact independent landing cells for the current rigid pair without consuming random values.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Returns the exact independent landing cells for the current rigid pair without consuming random values. Returns null when there is no active piece or applicable preview.
 * @example
 * ```ts
 * import { createGame, landingCells } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * console.log(landingCells(state));
 * ```
 */
export function landingCells(state: GameState): Landing | null {
  if (!state.active) return null;
  const pair = rigidLanding(state, state.active);
  const board = [...state.board];
  for (const [i, cell] of [cellFor(pair, false), cellFor(pair, true)].entries())
    board[indexOf(cell.x, cell.y, state.settings.width)] = pair.gems[i]!;
  const settled = compactBoard(board, state.settings.width, state.settings.height + HIDDEN);
  return pair.gems.map((gem) => {
    const index = settled.findIndex((cell) => cell?.id === gem.id);
    return { x: index % state.settings.width, y: Math.floor(index / state.settings.width) - HIDDEN };
  }) as unknown as Landing;
}
/**
 * Returns the Shizen hard-drop landing and one-step rebound preview without changing state.
 *
 * `finalCells` is where the pair locks after any rebound, the cells of the `power-drop-landed` event. Stones above a
 * gap then fall, so `settledCells` is where each stone of the pair comes to rest in the board the hard drop commits,
 * before any clear: draw a ghost from it. Both carry the pair's stable stone ids, and both are checked against
 * `applyAction` with a `hard-drop` over many played boards.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Returns the Shizen hard-drop landing and one-step rebound preview without changing state. Returns null when there is no active piece or applicable preview.
 * @example
 * ```ts
 * import { createGame, powerDropPreview } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * console.log(powerDropPreview(state));
 * ```
 */
export function powerDropPreview(state: GameState): ChainsPowerDropPreview | null {
  if (!state.settings.nature || state.settings.mode === "relaxed" || !state.active) return null;
  const preview = rebound(state, state.active)?.preview;
  if (!preview) return null;
  const dropped = applyAction(state, { kind: "hard-drop" });
  const board = dropped.accepted ? (dropped.state.gravityBoard ?? dropped.state.board) : null;
  const settledCells = board
    ? state.active.gems.flatMap((gem) => {
        const index = board.findIndex((cell) => cell?.id === gem.id);
        return index < 0
          ? []
          : [
              {
                ...(preview.finalCells.find((cell) => cell.id === gem.id) ?? {
                  id: gem.id,
                  kind: "stone" as const,
                  colour: gem.colour,
                }),
                x: index % state.settings.width,
                y: Math.floor(index / state.settings.width) - HIDDEN,
              },
            ];
      })
    : preview.finalCells;
  return Object.freeze({ ...preview, settledCells: Object.freeze(settledCells) });
}
/** Returns score, mode, chain and completion fields derived from state.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Returns score, mode, chain and completion fields derived from state.
 * @example
 * ```ts
 * import { createGame, statusOf } from "@johnmorrisdotca/houseki/colour-chains";
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
    maxChain: state.maxChain,
    allClears: state.allClears,
    completedPairs: state.completedPairs,
    assisted: state.assisted,
    ...(state.reason ? { reason: state.reason } : {}),
  };
}
/** Creates a base challenge state with a previously validated visible board and pair queue. @internal */
export function initialChallengeState(
  settings: Settings,
  visibleBoard: readonly (Gem | null)[],
  queue: readonly (readonly [Colour, Colour])[],
): GameState {
  const board: (Gem | null)[] = Array(settings.width * (settings.height + HIDDEN)).fill(null);
  for (let i = 0; i < visibleBoard.length; i++) board[i + settings.width * HIDDEN] = visibleBoard[i]!;
  const maxId = Math.max(0, ...visibleBoard.flatMap((gem) => (gem ? [gem.id] : [])));
  const base: GameState = {
    game: "colour-chains",
    rules: RULES,
    settings,
    board: Object.freeze(board),
    phase: "falling",
    active: null,
    next: Object.freeze(queue.slice(1, 4)),
    bag: [],
    randomState: seedState(`colour-chains|${RULES}|${settings.seed}`),
    nextId: maxId + 1,
    score: 0,
    maxChain: 0,
    allClears: 0,
    completedPairs: 0,
    resolutionTick: 0,
    waves: [],
    clearCells: [],
    gravityBoard: null,
    resolutionHadClear: false,
    elapsedTicks: 0,
    assisted: false,
    witnessIndex: 0,
    recording: [],
  };
  const active = makePair(base, queue[0]!, settings.magneticQueue?.[0]);
  const nextMagnetic = settings.nature
    ? queue.slice(1, 4).map((_, index) => settings.magneticQueue?.[index + 1] ?? ([false, false] as const))
    : undefined;
  return { ...base, active, ...(nextMagnetic ? { nextMagnetic: Object.freeze(nextMagnetic) } : {}), nextId: maxId + 3 };
}
/** Creates a deterministic seeded game with one active pair and three previews.
 *
 * @param options - Validated native creation, authored challenge, or environment options described by this signature.
 * @returns Creates a deterministic seeded game with one active pair and three previews.
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(createGame({seed:"docs"}).phase);
 * ```
 */
export function createGame(options: CreateOptions = {}): GameState {
  const valid = normalizeOptions(options);
  let state: GameState = {
    game: "colour-chains",
    rules: RULES,
    settings: valid,
    board: Array(valid.width * (valid.height + HIDDEN)).fill(null),
    phase: "falling",
    active: null,
    next: [],
    bag: [],
    randomState: seedState(`colour-chains|${RULES}|${valid.seed}`),
    nextId: 1,
    score: 0,
    maxChain: 0,
    allClears: 0,
    completedPairs: 0,
    resolutionTick: 0,
    waves: [],
    clearCells: [],
    gravityBoard: null,
    resolutionHadClear: false,
    elapsedTicks: 0,
    assisted: false,
    witnessIndex: -1,
    recording: [],
    ...(valid.weather ? { weatherResolvedPairs: 0 } : {}),
  };
  const first = drawPair(state);
  state = { ...state, bag: first[1], randomState: first[2] };
  const active = makePair(state, first[0], valid.nature ? magneticFlags(valid.seed, 0, first[0]) : undefined);
  state = { ...state, active, nextId: 3 };
  const next: (readonly [Colour, Colour])[] = [];
  const nextMagnetic: (readonly [boolean, boolean])[] = [];
  for (let i = 0; i < 3; i++) {
    const drawn = drawPair(state);
    next.push(drawn[0]);
    if (valid.nature) nextMagnetic.push(magneticFlags(valid.seed, i + 1, drawn[0]));
    state = { ...state, bag: drawn[1], randomState: drawn[2] };
  }
  return { ...state, next, ...(valid.nature ? { nextMagnetic } : {}) };
}
