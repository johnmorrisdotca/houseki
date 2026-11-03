import { applyActionCore } from "./engine-play.js";
import {
  activeFromColours,
  HIDDEN,
  occupied,
  RULES,
  stable,
  VALID_COLOURS,
  validateDimensions,
} from "./engine-setup.js";
import { advanceTicks } from "./engine-ticks.js";
import { seedState } from "./random.js";
import type { Action, ChallengeOptions, GameState, Gem, Piece, Settings, Triplet } from "./types.js";

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
