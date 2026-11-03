import { createChallenge } from "./engine-challenge.js";
import { createGame, occupied } from "./engine-setup.js";
import type { Action, GameState } from "./types.js";

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
