import type { BlackHolePortal, BoardPreset, BoardShape, GemColour, ToolInventory } from "./types-pieces.js";
import type { ChallengeRules, GameMode, GameOutcome, GamePhase, Goal } from "./types-state.js";

export type {
  Action,
  CancelToolAction,
  ConfirmToolAction,
  GameEvent,
  HintAction,
  ReshuffleAction,
  SelectToolAction,
  SwapAction,
  TargetToolAction,
  Transition,
  UndoAction,
} from "./types-actions.js";
export type {
  BlackHolePortal,
  BoardPreset,
  BoardShape,
  Gem,
  GemColour,
  OrdinaryToolKind,
  PlannedSpecial,
  SpecialKind,
  ToolInventory,
  ToolKind,
} from "./types-pieces.js";
export type {
  ChallengeRules,
  GameMode,
  GameOutcome,
  GamePhase,
  GameState,
  Goal,
  ReplayOperation,
  Seal,
  Settings,
} from "./types-state.js";

/** Creation settings for this native engine; dimensions, mode, seed and optional mechanics are validated together.
 *
 * @example
 * ```ts
 * import type { CreateOptions } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: CreateOptions = {seed:"docs"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CreateOptions {
  readonly preset?: BoardPreset;
  readonly width?: number;
  readonly height?: number;
  readonly colourCount?: 4 | 5 | 6;
  readonly seed?: string | number;
  readonly tools?: boolean;
  readonly advancedTools?: boolean;
  readonly shape?: BoardShape;
  /** Row-major active-cell mask. Requires explicit custom dimensions. */
  readonly mask?: readonly boolean[];
  readonly mode?: GameMode;
  /** Required for Daily; a UTC calendar date in YYYY-MM-DD form. */
  readonly dailyDate?: string;
  /** Challenge-only finite goals and optional legal-swap budget. */
  readonly challenge?: ChallengeRules;
}
/** A compact native status derived from the authoritative state for a host’s labels.
 *
 * @example
 * ```ts
 * import { createGame, statusOf } from "@johnmorrisdotca/houseki/gem-swap";
 * import type { GameStatus } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * const value: GameStatus = statusOf(state);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameStatus {
  readonly phase: GamePhase;
  readonly score: number;
  readonly moves: number;
  readonly legalMoveCount: number;
  readonly usedFallback: boolean;
  readonly availableToolCount: number;
  readonly inventory: ToolInventory;
  readonly toolProgress: number;
  readonly toolAwardCursor: number;
  readonly assisted: boolean;
  readonly blackHoleCharges: 0 | 1;
  readonly blackHoleProgress: number;
  readonly blackHole: BlackHolePortal | null;
  readonly mode: GameMode;
  readonly outcome: GameOutcome;
  readonly remainingMoves: number | null;
  readonly elapsedMs: number;
  readonly remainingMs: number | null;
  readonly goals: readonly Goal[];
  readonly goalProgress: readonly {
    readonly kind: Goal["kind"];
    readonly current: number;
    readonly target: number;
    readonly colour?: GemColour;
    readonly complete: boolean;
  }[];
  readonly bestChain: number;
}
