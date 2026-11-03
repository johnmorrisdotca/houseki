import type { CreateOptions } from "./types.js";
import type { Action } from "./types-actions.js";
import type {
  BlackHolePortal,
  BoardShape,
  Gem,
  GemColour,
  PlannedSpecial,
  ToolInventory,
  ToolKind,
} from "./types-pieces.js";

/** The native ready, resolution and ending phases.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/gem-swap";
 * import type { GamePhase } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * const value: GamePhase = state.phase;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type GamePhase = "ready" | "clear-mark" | "clear-remove" | "gravity" | "refill" | "finished";
/** The native free, timed, daily or authored-challenge game mode.
 *
 * @example
 * ```ts
 * import type { GameMode } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: GameMode = "relaxed";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type GameMode = "relaxed" | "arcade" | "daily" | "challenge";
/** The terminal outcome; null means the run has no terminal outcome yet.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/gem-swap";
 * import type { GameOutcome } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * const value: GameOutcome = state.outcome;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type GameOutcome = "won" | "lost" | "finished" | null;
/** The native authored goal; its discriminant selects the required collection or clearing condition.
 *
 * @example
 * ```ts
 * import type { Goal } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: Goal = {kind:"score",target:100};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Goal =
  | { readonly kind: "score"; readonly target: number }
  | { readonly kind: "collect"; readonly colour: GemColour; readonly target: number }
  | { readonly kind: "chain"; readonly target: number }
  | { readonly kind: "seals" };
/** A Gem Swap row-major seal cell and its remaining layers.
 *
 * @example
 * ```ts
 * import type { Seal } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: Seal = {cell:0,layers:1};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Seal {
  readonly cell: number;
  readonly layers: number;
}
/** Gem Swap authored goals, optional move budget and seal layout.
 *
 * @example
 * ```ts
 * import type { ChallengeRules } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: ChallengeRules = {goals:[{kind:"score",target:100}],moveLimit:5};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChallengeRules {
  readonly goals: readonly Goal[];
  readonly moveLimit?: number;
  readonly seals?: readonly Seal[];
}
/** One native Gem Swap action, fixed-tick advance or elapsed-time replay operation.
 *
 * @example
 * ```ts
 * import type { ReplayOperation } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: ReplayOperation = {kind:"ticks",count:1};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type ReplayOperation =
  | { readonly kind: "action"; readonly action: Action }
  | { readonly kind: "ticks"; readonly count: number }
  | { readonly kind: "time"; readonly milliseconds: number };
/** Validated settings fixed at native game creation.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/gem-swap";
 * import type { Settings } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * const value: Settings = state.settings;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Settings {
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly seed: string | number;
  readonly tools: boolean;
  readonly advancedTools: boolean;
  readonly shape?: BoardShape;
  readonly mask: readonly boolean[];
}
/** The immutable authoritative native game state, including its board, random state and recording.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/gem-swap";
 * import type { GameState } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * const value: GameState = state;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameState {
  readonly game: "gem-swap";
  readonly rules: "swap-1";
  readonly settings: Settings;
  readonly initialOptions: CreateOptions;
  readonly mode: GameMode;
  readonly dailyDate: string | null;
  readonly challenge: ChallengeRules | null;
  readonly seals: readonly Seal[];
  readonly sealsCleared: number;
  readonly elapsedMs: number;
  readonly outcome: GameOutcome;
  readonly clearedByColour: Readonly<Record<GemColour, number>>;
  readonly bestChain: number;
  readonly history: readonly ReplayOperation[];
  /** Row-major. Mask gaps and the holes in clear phases contain null. */
  readonly board: readonly (Gem | null)[];
  readonly phase: GamePhase;
  readonly score: number;
  readonly moves: number;
  readonly swapCount: number;
  readonly randomState: number;
  readonly nextId: number;
  readonly usedFallback: boolean;
  readonly wave: number;
  readonly resolutionTick: number;
  readonly pendingCells: readonly number[];
  readonly pendingSpecials: readonly PlannedSpecial[];
  readonly gravityBoard: readonly (Gem | null)[] | null;
  readonly inventory: ToolInventory;
  readonly selectedTool: ToolKind | null;
  readonly toolTarget: number | null;
  readonly toolPreview: readonly number[];
  readonly toolProgress: number;
  readonly toolAwardCursor: number;
  readonly assisted: boolean;
  /** Remains true across cascades originating from one tool use. */
  readonly toolWaveActive: boolean;
  readonly blackHoleCharges: 0 | 1;
  readonly blackHoleProgress: number;
  readonly blackHole: BlackHolePortal | null;
  readonly blackHoleMovePending: boolean;
  readonly blackHoleContactPending: boolean;
  readonly pendingBlackHole: boolean;
}
