import { goalSatisfied, groupScore, indexOfId, removeAndSettle } from "./engine-resolve.js";
import { baseState, COLOURS, groupAt, hashSeed, hasLegalGroup, RULES } from "./engine-setup.js";
import type { ChallengeDefinition, ChallengeGoal, ChallengeOptions, GameState, Settings } from "./types.js";
import { optionsFor, StoneCollapseOptionsError } from "./validation.js";

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
