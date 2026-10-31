import {
  activeFromColours,
  createGame,
  emptyTransition,
  HIDDEN,
  occupied,
  RULES,
  stable,
  VALID_COLOURS,
  validateDimensions,
} from "./engine-setup.js";
import { advanceResolution, lock } from "./engine-waves.js";
import { seedState } from "./random.js";
import type {
  Action,
  ChallengeOptions,
  GameEvent,
  GameState,
  Gem,
  Piece,
  Settings,
  Transition,
  Triplet,
} from "./types.js";

/** Creates a challenge after validating its authored board, finite queue, goal, and witness.
 *
 * @param options - Validated native creation, authored challenge, or environment options described by this signature.
 * @returns Creates a challenge after validating its authored board, finite queue, goal, and witness.
 * @example
 * ```ts
 * import { createChallenge } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * console.log(createChallenge({width:6,height:12,board:Array(72).fill(null),queue:[["red","green","blue"],["blue","red","green"]],goal:{type:"empty"}}).phase);
 * ```
 */
export function createChallenge(options: ChallengeOptions): GameState {
  const width = options.width ?? 6;
  const height = options.height ?? 13;
  const colourCount = options.colourCount ?? 5;
  validateDimensions(width, height);
  if (![4, 5, 6].includes(colourCount)) throw new RangeError("Colour count must be 4, 5, or 6");
  const seed = options.seed ?? "houseki-challenge";
  if (typeof seed !== "string" || seed.length < 1 || seed.length > 128)
    throw new RangeError("Challenge seed must contain 1–128 characters");
  if (!Array.isArray(options.board) || options.board.length !== width * height)
    throw new RangeError("Challenge board must contain exactly width × height visible cells");
  if (!Array.isArray(options.queue) || options.queue.length < 2 || options.queue.length > 12)
    throw new RangeError("Challenge queue must contain 2–12 triplets");
  const colours = ["red", "blue", "green", "gold", "purple", "teal"].slice(0, colourCount);
  const ids = new Set<number>();
  let maxId = 0;
  const cleanBoard: (Gem | null)[] = [];
  for (let i = 0; i < options.board.length; i++) {
    const cell = options.board[i];
    if (cell === null) {
      cleanBoard.push(null);
      continue;
    }
    if (
      !cell ||
      typeof cell !== "object" ||
      !Number.isSafeInteger(cell.id) ||
      cell.id < 1 ||
      cell.id > 1_000_000_000 ||
      ids.has(cell.id) ||
      !VALID_COLOURS.has(cell.colour) ||
      !colours.includes(cell.colour) ||
      (cell.target !== undefined && typeof cell.target !== "boolean")
    )
      throw new TypeError(`Invalid challenge gem at cell ${i}`);
    if (Object.keys(cell).some((key) => !["id", "colour", "target"].includes(key)))
      throw new TypeError(`Unexpected challenge gem field at cell ${i}`);
    ids.add(cell.id);
    maxId = Math.max(maxId, cell.id);
    cleanBoard.push({ id: cell.id, colour: cell.colour, ...(cell.target ? { target: true } : {}) });
  }
  for (let x = 0; x < width; x++) {
    let gap = false;
    for (let y = height - 1; y >= 0; y--) {
      if (cleanBoard[y * width + x] === null) gap = true;
      else if (gap) throw new RangeError(`Challenge board is unstable in column ${x}`);
    }
  }
  const queue: Triplet[] = options.queue.map((triplet, index) => {
    if (!Array.isArray(triplet) || triplet.length !== 3 || triplet.some((colour) => !colours.includes(colour)))
      throw new TypeError(`Invalid challenge triplet ${index}`);
    return [...triplet] as unknown as Triplet;
  });
  if (!options.goal || typeof options.goal !== "object" || !["targets", "chain", "empty"].includes(options.goal.type))
    throw new TypeError("Invalid challenge goal");
  let goal: Settings["goal"];
  let targetIds: readonly number[] | undefined;
  let minimumChain: number | undefined;
  if (options.goal.type === "targets") {
    const raw = options.goal as { type: string; targetIds?: unknown };
    const targetSet = raw.targetIds;
    if (
      Object.keys(raw).some((key) => !["type", "targetIds"].includes(key)) ||
      !Array.isArray(targetSet) ||
      !targetSet.length ||
      targetSet.length > cleanBoard.length ||
      targetSet.some((id) => !Number.isSafeInteger(id) || !ids.has(id)) ||
      new Set(targetSet).size !== targetSet.length
    )
      throw new TypeError("Target goal must reference unique starting gem IDs");
    targetIds = [...(targetSet as number[])];
    goal = "targets";
    const marked = cleanBoard
      .filter((gem): gem is Gem => gem !== null && gem.target === true)
      .map((gem) => gem.id)
      .sort((a, b) => a - b);
    if (stable(marked) !== stable([...targetIds].sort((a, b) => a - b)))
      throw new TypeError("Target flags must exactly match the target goal IDs");
  } else if (options.goal.type === "chain") {
    const raw = options.goal as { type: string; minimumChain?: unknown };
    const value = raw.minimumChain;
    if (
      Object.keys(raw).some((key) => !["type", "minimumChain"].includes(key)) ||
      typeof value !== "number" ||
      !Number.isInteger(value) ||
      value < 1 ||
      value > 12
    )
      throw new RangeError("Minimum chain must be an integer from 1 to 12");
    minimumChain = value;
    goal = "chain";
  } else {
    if (Object.keys(options.goal).some((key) => key !== "type")) throw new TypeError("Unexpected empty-goal field");
    goal = "empty";
  }
  if (
    options.witness !== undefined &&
    (!Array.isArray(options.witness) ||
      options.witness.length > queue.length ||
      options.witness.some(
        (hint) =>
          !hint ||
          !Number.isInteger(hint.x) ||
          hint.x < 0 ||
          hint.x >= width ||
          ![0, 1, 2].includes(hint.orientation) ||
          Object.keys(hint).some((key) => !["x", "orientation"].includes(key)),
      ))
  )
    throw new TypeError("Invalid challenge witness");
  const internalBoard = Array(width * (height + HIDDEN)).fill(null) as (Gem | null)[];
  for (let i = 0; i < cleanBoard.length; i++) internalBoard[i + width * HIDDEN] = cleanBoard[i]!;
  const settings: Settings = {
    mode: "challenge",
    width,
    height,
    colourCount: colourCount as 4 | 5 | 6,
    seed,
    goal,
    challengeBoard: cleanBoard,
    challengeQueue: queue,
    ...(targetIds ? { targetIds } : {}),
    ...(minimumChain ? { minimumChain } : {}),
    ...(options.witness ? { witness: options.witness.map((hint) => ({ ...hint })) } : {}),
  };
  const base: GameState = {
    game: "falling-triplets",
    rules: RULES,
    settings,
    board: internalBoard,
    phase: "falling",
    active: null,
    next: [],
    bag: [],
    randomState: seedState(`falling-triplets|${RULES}|${seed}`),
    nextId: maxId + 1,
    score: 0,
    maxChain: 0,
    completedPieces: 0,
    elapsedTicks: 0,
    pieceTicks: 0,
    resolutionTick: 0,
    waves: [],
    assisted: false,
    hintsUsed: 0,
    witnessPathMatches: true,
    challengeIndex: 0,
    recording: [],
  };
  const firstPieceBase = activeFromColours(base, queue[0]!);
  const active = {
    ...firstPieceBase,
    gems: firstPieceBase.gems.map((gem, i) => ({ ...gem, id: maxId + 1 + i })) as unknown as Piece["gems"],
  };
  const state: GameState = {
    ...base,
    settings,
    board: internalBoard,
    active,
    next: queue.slice(1, 4),
    bag: [],
    nextId: maxId + 4,
    hintsUsed: 0,
    challengeIndex: 0,
    assisted: false,
  };
  if (occupied(state, active)) throw new RangeError("Challenge starting board blocks the first queued triplet");
  if (options.witness) {
    if (options.witness.length === 0) throw new TypeError("A supplied witness must contain a complete legal solution");
    let proof = state;
    let proofTicks = 0;
    for (const step of options.witness) {
      if (proof.phase !== "falling" || !proof.active) break;
      while (proof.active!.x !== step.x) {
        const action: Action = { kind: step.x < proof.active!.x ? "left" : "right" };
        const result = applyActionCore(proof, action);
        if (!result.accepted) throw new TypeError("Challenge witness contains a blocked placement");
        proof = result.state;
      }
      const turns = (step.orientation - proof.active!.orientation + 3) % 3;
      for (let i = 0; i < turns; i++) {
        const result = applyActionCore(proof, { kind: "cycle-forward" });
        if (!result.accepted) throw new TypeError("Challenge witness contains an illegal cycle");
        proof = result.state;
      }
      const placed = applyActionCore(proof, { kind: "hard-drop" });
      if (!placed.accepted) throw new TypeError("Challenge witness contains an illegal placement");
      proof = placed.state;
      while (["clear-mark", "clear-remove", "gravity"].includes(proof.phase) && proofTicks < 100_000) {
        proof = advanceTicks(proof, 1).state;
        proofTicks++;
      }
      if (["lost", "finished"].includes(proof.phase))
        throw new TypeError("Challenge witness ends before its goal is achieved");
      if (proof.phase === "won") break;
    }
    if (proof.phase !== "won") throw new TypeError("Challenge witness does not solve its goal within the finite queue");
  }
  return state;
}

/** Applies one immutable game action. Rejected actions preserve the original state reference. */
export function applyActionCore(state: GameState, action: Action): Transition {
  if (action.kind === "pause") {
    if (!["falling", "clear-mark", "clear-remove", "gravity"].includes(state.phase))
      return emptyTransition(state, "cannot-pause");
    return {
      state: {
        ...state,
        phase: "paused",
        pausedPhase: state.phase,
        assisted: state.assisted || state.settings.mode === "daily",
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
    if (state.settings.mode !== "challenge" || state.phase !== "falling" || !state.active)
      return emptyTransition(state, "hint-only-in-active-challenge");
    const hint = state.settings.witness?.[state.completedPieces];
    if (!hint || !state.witnessPathMatches) return emptyTransition(state, "no-witness-hint-available");
    return {
      state: { ...state, assisted: true, hintsUsed: state.hintsUsed + 1 },
      events: [{ type: "hint-shown", piece: state.completedPieces, ...hint }],
      accepted: true,
    };
  }
  if (state.phase !== "falling" || !state.active) return emptyTransition(state, "not-falling");
  const piece = state.active;
  if (action.kind === "cycle-forward" || action.kind === "cycle-backward") {
    const [a, b, c] = piece.gems;
    const gems = action.kind === "cycle-forward" ? [c, a, b] : [b, c, a];
    const orientation = ((piece.orientation + (action.kind === "cycle-forward" ? 1 : 2)) % 3) as Piece["orientation"];
    const grounded = occupied(state, piece, piece.x, piece.y + 1);
    const reset = grounded && piece.lockResets < 8;
    return {
      state: {
        ...state,
        active: {
          ...piece,
          gems: gems as unknown as Piece["gems"],
          orientation,
          lockTicks: reset ? 0 : piece.lockTicks,
          lockResets: piece.lockResets + (reset ? 1 : 0),
          lockStarted: piece.lockStarted || grounded,
        },
      },
      events: [{ type: "colours-cycled", direction: action.kind === "cycle-forward" ? "forward" : "backward" }],
      accepted: true,
    };
  }
  if (action.kind === "left" || action.kind === "right") {
    const x = piece.x + (action.kind === "left" ? -1 : 1);
    if (occupied(state, piece, x)) return emptyTransition(state, "blocked");
    const wasGrounded = occupied(state, piece, piece.x, piece.y + 1);
    const reset = wasGrounded && piece.lockResets < 8;
    const isAirborne = !occupied(state, piece, x, piece.y + 1);
    const leavingWithReset = wasGrounded && reset;
    const lockTicks = leavingWithReset || (isAirborne && piece.lockResets < 8) ? 0 : piece.lockTicks;
    return {
      state: {
        ...state,
        active: {
          ...piece,
          x,
          lockTicks,
          lockStarted: isAirborne ? (piece.lockResets >= 8 ? piece.lockStarted : false) : true,
          lockResets: piece.lockResets + (reset ? 1 : 0),
        },
      },
      events: [{ type: "piece-moved", x, y: piece.y }],
      accepted: true,
    };
  }
  if (action.kind === "tick") return advanceTicks(state, 1);
  if (action.kind === "soft-drop") {
    if (state.settings.mode === "relaxed") return emptyTransition(state, "soft-drop-disabled");
    if (occupied(state, piece, piece.x, piece.y + 1))
      return { state: { ...state, active: piece }, events: [], accepted: true };
    const resetsAvailable = piece.lockResets < 8;
    const y = piece.y + 1;
    const becameGrounded = occupied(state, piece, piece.x, y + 1);
    return {
      state: {
        ...state,
        active: {
          ...piece,
          y,
          descent: 0,
          lockTicks: resetsAvailable ? 0 : piece.lockTicks,
          lockStarted: becameGrounded ? false : resetsAvailable ? false : piece.lockStarted,
        },
        score: state.score + 1,
      },
      events: [
        { type: "piece-moved", x: piece.x, y },
        { type: "score-changed", score: state.score + 1, points: 1 },
      ],
      accepted: true,
    };
  }
  if (action.kind === "place" || action.kind === "hard-drop") {
    if (action.kind === "place" && state.settings.mode !== "relaxed")
      return emptyTransition(state, "place-only-in-relaxed");
    if (action.kind === "hard-drop" && state.settings.mode === "relaxed")
      return emptyTransition(state, "use-place-in-relaxed");
    let y = piece.y;
    while (!occupied(state, piece, piece.x, y + 1)) y++;
    const distance = y - piece.y;
    const points = action.kind === "hard-drop" ? distance * 2 : 0;
    const result = lock({ ...state, active: { ...piece, y }, score: state.score + points });
    return points
      ? { ...result, events: [{ type: "score-changed", score: state.score + points, points }, ...result.events] }
      : result;
  }
  return emptyTransition(state, "unsupported-action");
}
/** Applies and records one immutable action; rejected actions preserve state identity.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param action - One native action for this entry point; inspect accepted and reason on the result.
 * @returns Applies and records one immutable action; rejected actions preserve state identity.
 * @example
 * ```ts
 * import { applyAction, createGame } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { Action } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * const action: Action={kind:"left"};
 * console.log(applyAction(state,action).accepted);
 * ```
 */
export function applyAction(state: GameState, action: Action): Transition {
  const result = applyActionCore(state, action);
  if (!result.accepted || action.kind === "tick") return result;
  const last = state.recording.at(-1);
  const ordinal = last?.tick === state.elapsedTicks ? last.ordinal + 1 : 0;
  return {
    ...result,
    state: { ...result.state, recording: [...state.recording, { tick: state.elapsedTicks, ordinal, action }] },
  };
}
/** Advances fixed 60 Hz game ticks. Arcade timing is applied to the active piece.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param ticks - The nonnegative number of fixed 60 Hz logical ticks to advance.
 * @returns Advances fixed 60 Hz game ticks. Arcade timing is applied to the active piece.
 * @example
 * ```ts
 * import { advanceTicks, createGame } from "@johnmorrisdotca/houseki/falling-triplets";
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
    if (current.phase !== "falling") {
      const result = advanceResolution(current);
      current = { ...result.state, elapsedTicks: result.state.elapsedTicks + 1 };
      events.push(...result.events);
      continue;
    }
    if (!current.active) break;
    const active = current.active;
    current = { ...current, elapsedTicks: current.elapsedTicks + 1, pieceTicks: current.pieceTicks + 1 };
    if (current.settings.mode === "relaxed") continue;
    const level = active.level;
    const interval = Math.max(6, Math.round(60 * 0.85 ** (level - 1)));
    const grounded = occupied(current, active, active.x, active.y + 1);
    if (grounded) {
      const lockStarted = active.lockStarted;
      const lockTicks = lockStarted ? active.lockTicks + 1 : 0;
      current = { ...current, active: { ...active, lockStarted: true, lockTicks } };
      if (lockTicks >= 24) {
        const result = lock(current);
        current = result.state;
        events.push(...result.events);
      }
    } else if (active.descent + 1 >= interval) {
      const y = active.y + 1;
      const becomesGrounded = occupied(current, active, active.x, y + 1);
      current = {
        ...current,
        active: {
          ...active,
          y,
          descent: 0,
          lockTicks: active.lockResets < 8 && !becomesGrounded ? 0 : active.lockTicks,
          lockStarted:
            becomesGrounded && active.lockResets < 8 ? true : active.lockResets < 8 ? false : active.lockStarted,
        },
      };
    } else
      current = {
        ...current,
        active: {
          ...active,
          descent: active.descent + 1,
          lockTicks: active.lockResets < 8 ? 0 : active.lockTicks,
          lockStarted: active.lockResets < 8 ? false : active.lockStarted,
        },
      };
  }
  return { state: current, events, accepted: true };
}
/** Lists the core actions currently available to the player.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Lists the core actions currently available to the player.
 * @example
 * ```ts
 * import { createGame, legalActions } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * console.log(legalActions(state).length);
 * ```
 */
export function legalActions(state: GameState): readonly Action[] {
  if (state.phase === "paused") return [{ kind: "resume" }];
  if (["clear-mark", "clear-remove", "gravity"].includes(state.phase)) return [{ kind: "pause" }];
  if (state.phase !== "falling" || !state.active) return [];
  const piece = state.active;
  const actions: Action[] = [];
  if (!occupied(state, piece, piece.x - 1)) actions.push({ kind: "left" });
  if (!occupied(state, piece, piece.x + 1)) actions.push({ kind: "right" });
  actions.push({ kind: "cycle-forward" }, { kind: "cycle-backward" });
  if (state.settings.mode === "relaxed") actions.push({ kind: "place" });
  else actions.push({ kind: "soft-drop" }, { kind: "hard-drop" });
  if (
    state.settings.mode === "challenge" &&
    state.witnessPathMatches &&
    state.settings.witness?.[state.completedPieces]
  )
    actions.push({ kind: "hint" });
  actions.push({ kind: "pause" });
  return actions;
}
/** Returns a plain status summary suitable for UI labels.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Returns a plain status summary suitable for UI labels.
 * @example
 * ```ts
 * import { createGame, statusOf } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * console.log(statusOf(state).phase);
 * ```
 */
export function statusOf(
  state: GameState,
): Readonly<{ phase: GameState["phase"]; score: number; maxChain: number; reason?: string }> {
  return {
    phase: state.phase,
    score: state.score,
    maxChain: state.maxChain,
    ...(state.reason ? { reason: state.reason } : {}),
  };
}
/** Recreates the same authored mode, seed, and challenge configuration from its original setup.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Recreates the same authored mode, seed, and challenge configuration from its original setup.
 * @example
 * ```ts
 * import { createGame, restartGame } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * console.log(restartGame(state).phase);
 * ```
 */
export function restartGame(state: GameState): GameState {
  if (state.settings.mode === "challenge") {
    const settings = state.settings;
    const goal =
      settings.goal === "targets"
        ? { type: "targets" as const, targetIds: settings.targetIds ?? [] }
        : settings.goal === "chain"
          ? { type: "chain" as const, minimumChain: settings.minimumChain ?? 1 }
          : { type: "empty" as const };
    return createChallenge({
      seed: settings.seed,
      width: settings.width,
      height: settings.height,
      colourCount: settings.colourCount,
      board: settings.challengeBoard ?? [],
      queue: settings.challengeQueue ?? [],
      goal,
      ...(settings.witness ? { witness: settings.witness } : {}),
    });
  }
  return createGame({
    mode: state.settings.mode,
    seed: state.settings.seed,
    width: state.settings.width,
    height: state.settings.height,
    colourCount: state.settings.colourCount,
    ...(state.settings.pieceLimit === undefined ? {} : { pieceLimit: state.settings.pieceLimit }),
  });
}
