/** A colour used by a placed block.
 *
 * @example
 * ```ts
 * import type { BlockColour } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: BlockColour = "red";
 * console.log(value);
 * ```
 */
export type BlockColour = "red" | "blue" | "green" | "gold" | "purple" | "teal";
/** One filled cell: its run-local identity, its colour, and whether it is a stone a challenge asks to be cleared.
 *
 * @example
 * ```ts
 * import type { Block } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: Block = { id: 1, colour: "red", stone: false };
 * console.log(value.colour);
 * ```
 */
export interface Block {
  readonly id: number;
  readonly colour: BlockColour;
  readonly stone: boolean;
}
/** A shape in the tray: its name, its colour, and its cells as row and column from its own top left.
 *
 * @example
 * ```ts
 * import type { Piece } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: Piece = { shape: "bar-2", colour: "blue", cells: [[0, 0], [0, 1]] };
 * console.log(value.cells.length);
 * ```
 */
export interface Piece {
  readonly shape: string;
  readonly colour: BlockColour;
  readonly cells: readonly (readonly [number, number])[];
}
/** The free, daily or authored game mode.
 *
 * @example
 * ```ts
 * import type { GameMode } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: GameMode = "relaxed";
 * console.log(value);
 * ```
 */
export type GameMode = "relaxed" | "daily" | "challenge";
/** What a challenge asks for: a score, a number of lines, or every stone cleared.
 *
 * @example
 * ```ts
 * import type { ChallengeGoal } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: ChallengeGoal = { kind: "lines", target: 4 };
 * console.log(value.kind);
 * ```
 */
export type ChallengeGoal =
  | { readonly kind: "score"; readonly target: number }
  | { readonly kind: "lines"; readonly target: number }
  | { readonly kind: "clear-stones" };
/** Where a game stands: waiting for a placement, won, lost, or finished with a score.
 *
 * @example
 * ```ts
 * import type { GamePhase } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: GamePhase = "ready";
 * console.log(value);
 * ```
 */
export type GamePhase = "ready" | "won" | "lost" | "finished";
/** How a game was set up, the whole of what a replay needs but the moves.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/tsumiki";
 * import type { GameSettings } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: GameSettings = createGame({ seed: "demo" }).settings;
 * console.log(value.mode);
 * ```
 */
export interface GameSettings {
  readonly mode: GameMode;
  readonly seed: string;
  readonly width: number;
  readonly height: number;
  readonly dailyDate?: string;
  readonly challengeId?: string;
  readonly goal?: ChallengeGoal;
  /** The stones a challenge starts with, as cell indices. */
  readonly stones?: readonly number[];
}
/** The options a free game or a Daily is made from.
 *
 * @example
 * ```ts
 * import type { CreateOptions } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: CreateOptions = { seed: "demo" };
 * console.log(value.seed);
 * ```
 */
export interface CreateOptions {
  readonly mode?: "relaxed" | "daily";
  readonly seed?: string;
  readonly dailyDate?: string;
}
/** An authored game: its identity, seed, goal and the stones it starts with.
 *
 * @example
 * ```ts
 * import type { ChallengeOptions } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: ChallengeOptions = { id: "one", seed: "s", goal: { kind: "lines", target: 1 } };
 * console.log(value.id);
 * ```
 */
export interface ChallengeOptions {
  readonly id: string;
  readonly seed: string;
  readonly goal: ChallengeGoal;
  readonly stones?: readonly number[];
}
/** One move: a piece from the tray, placed with its top left on a cell.
 *
 * @example
 * ```ts
 * import type { Action } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: Action = { kind: "place", slot: 0, row: 2, column: 3 };
 * console.log(value.kind);
 * ```
 */
export type Action = { readonly kind: "place"; readonly slot: number; readonly row: number; readonly column: number };
/** What a move made happen, for a host to draw or sound.
 *
 * @example
 * ```ts
 * import type { GameEvent } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: GameEvent = { kind: "lines", rows: [0], columns: [], points: 10 };
 * console.log(value.kind);
 * ```
 */
export type GameEvent =
  | { readonly kind: "placed"; readonly cells: readonly number[] }
  | {
      readonly kind: "lines";
      readonly rows: readonly number[];
      readonly columns: readonly number[];
      readonly points: number;
    }
  | { readonly kind: "dealt" }
  | { readonly kind: "ended"; readonly phase: GamePhase };
/** The whole of a game, returned new by every move: nothing in it is changed in place.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/tsumiki";
 * import type { GameState } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: GameState = createGame({ seed: "demo" });
 * console.log(value.tray.length);
 * ```
 */
export interface GameState {
  readonly game: "tsumiki";
  readonly settings: GameSettings;
  readonly board: readonly (Block | null)[];
  readonly tray: readonly (Piece | null)[];
  readonly phase: GamePhase;
  readonly score: number;
  readonly lines: number;
  readonly moves: number;
  /** How many placements in a row have cleared something. */
  readonly streak: number;
  readonly nextId: number;
  readonly random: number;
  readonly history: readonly Action[];
}
/** What an applied action came to: whether it was taken, the state after it, and what happened.
 *
 * @example
 * ```ts
 * import { applyAction, createGame, legalActions } from "@johnmorrisdotca/houseki/tsumiki";
 * import type { ActionResult } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const game = createGame({ seed: "demo" });
 * const value: ActionResult = applyAction(game, legalActions(game)[0]!);
 * console.log(value.accepted);
 * ```
 */
export interface ActionResult {
  readonly accepted: boolean;
  readonly state: GameState;
  readonly events: readonly GameEvent[];
}
/** A game's figures as a host would show them.
 *
 * @example
 * ```ts
 * import { createGame, statusOf } from "@johnmorrisdotca/houseki/tsumiki";
 * import type { GameStatus } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: GameStatus = statusOf(createGame({ seed: "demo" }));
 * console.log(value.phase);
 * ```
 */
export interface GameStatus {
  readonly phase: GamePhase;
  readonly score: number;
  readonly lines: number;
  readonly moves: number;
  readonly stonesLeft: number;
  readonly goalDone: number;
  readonly goalTotal: number;
}
