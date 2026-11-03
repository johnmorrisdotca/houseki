import { emptyTransition, occupied } from "./engine-setup.js";
import { advanceTicks } from "./engine-ticks.js";
import { lock } from "./engine-waves.js";
import type { Action, GameState, Piece, Transition } from "./types.js";

export { createChallenge } from "./engine-challenge.js";
export { advanceTicks } from "./engine-ticks.js";
export { legalActions, restartGame, statusOf } from "./engine-view.js";

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
