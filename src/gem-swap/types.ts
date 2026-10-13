/** A colour used by a normal gem.
 *
 * @example
 * ```ts
 * import type { GemColour } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: GemColour = "red";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type GemColour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
/** A Gem Swap beam, bomb or colour-burst special retained at its chosen anchor.
 *
 * @example
 * ```ts
 * import type { SpecialKind } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: SpecialKind = "row-beam";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type SpecialKind = 'row-beam' | 'column-beam' | 'bomb' | 'colour-burst';
/** A Gem Swap stored tool or advanced Black Hole selection.
 *
 * @example
 * ```ts
 * import type { ToolKind } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: ToolKind = "bomb";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type ToolKind = 'bomb' | 'row-clear' | 'colour-clear' | 'black-hole';
/** A Gem Swap stored tool excluding the separately charged Black Hole.
 *
 * @example
 * ```ts
 * import type { OrdinaryToolKind } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: OrdinaryToolKind = "bomb";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type OrdinaryToolKind = Exclude<ToolKind, 'black-hole'>;
/** The native remaining counts of stored tools.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/gem-swap";
 * import type { ToolInventory } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * const value: ToolInventory = state.inventory;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type ToolInventory = Readonly<Record<OrdinaryToolKind, number>>;
/** A Gem Swap portal’s cell, remaining capacity, move lifetime and consumed stable ids.
 *
 * @example
 * ```ts
 * import type { BlackHolePortal } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: BlackHolePortal = {cell:0,capacityRemaining:2,movesRemaining:2,consumedIds:[]};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface BlackHolePortal {
  readonly cell: number;
  readonly capacityRemaining: number;
  readonly movesRemaining: number;
  readonly consumedIds: readonly number[];
}
/** A gem has a stable identity and stored colour until it is cleared. Missing kind means normal.
 *
 * @example
 * ```ts
 * import type { Gem } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: Gem = {id:1,colour:"red"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Gem { readonly id: number; readonly colour: GemColour; readonly kind?: SpecialKind }
/** The native Gem Swap cell and special kind planned for the end of a clear wave.
 *
 * @example
 * ```ts
 * import type { PlannedSpecial } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: PlannedSpecial = {cell:0,kind:"row-beam"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface PlannedSpecial { readonly cell: number; readonly kind: SpecialKind }
/** A named native board geometry; custom dimensions remain a separate option.
 *
 * @example
 * ```ts
 * import type { BoardPreset } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: BoardPreset = "compact";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type BoardPreset = 'compact' | 'standard' | 'wide' | 'tall' | 'extraWide' | 'deep' | 'large';
/** A native shaped active-cell layout applied to the row-major board.
 *
 * @example
 * ```ts
 * import type { BoardShape } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: BoardShape = "heart";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type BoardShape = 'heart' | 'star' | 'hexagon';
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
export type GamePhase = 'ready' | 'clear-mark' | 'clear-remove' | 'gravity' | 'refill' | 'finished';
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
export type GameMode = 'relaxed' | 'arcade' | 'daily' | 'challenge';
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
export type GameOutcome = 'won' | 'lost' | 'finished' | null;
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
  | { readonly kind: 'score'; readonly target: number }
  | { readonly kind: 'collect'; readonly colour: GemColour; readonly target: number }
  | { readonly kind: 'chain'; readonly target: number }
  | { readonly kind: 'seals' };
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
export interface Seal { readonly cell: number; readonly layers: number }
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
export interface ChallengeRules { readonly goals: readonly Goal[]; readonly moveLimit?: number; readonly seals?: readonly Seal[] }
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
export type ReplayOperation = { readonly kind: 'action'; readonly action: Action } | { readonly kind: 'ticks'; readonly count: number } | { readonly kind: 'time'; readonly milliseconds: number };
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
  readonly game: 'gem-swap';
  readonly rules: 'swap-1';
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
/** Swaps two row-major cell addresses.
 *
 * @example
 * ```ts
 * import type { SwapAction } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: SwapAction = {kind:"swap",from:0,to:1};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface SwapAction { readonly kind: 'swap'; readonly from: number; readonly to: number }
/** Selects a stored Gem Swap tool without committing its target.
 *
 * @example
 * ```ts
 * import type { SelectToolAction } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: SelectToolAction = {kind:"select-tool",tool:"bomb"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface SelectToolAction { readonly kind: 'select-tool'; readonly tool: ToolKind }
/** Previews a selected Gem Swap tool on one row-major cell.
 *
 * @example
 * ```ts
 * import type { TargetToolAction } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: TargetToolAction = {kind:"target-tool",cell:0};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface TargetToolAction { readonly kind: 'target-tool'; readonly cell: number }
/** Commits the currently selected Gem Swap tool and target.
 *
 * @example
 * ```ts
 * import type { ConfirmToolAction } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: ConfirmToolAction = {kind:"confirm-tool"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ConfirmToolAction { readonly kind: 'confirm-tool' }
/** Clears the current Gem Swap tool preview.
 *
 * @example
 * ```ts
 * import type { CancelToolAction } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: CancelToolAction = {kind:"cancel-tool"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CancelToolAction { readonly kind: 'cancel-tool' }
/** Requests restoration of the prior Gem Swap move.
 *
 * @example
 * ```ts
 * import type { UndoAction } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: UndoAction = {kind:"undo"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface UndoAction { readonly kind: 'undo' }
/** Requests a native Gem Swap hint and marks assisted play.
 *
 * @example
 * ```ts
 * import type { HintAction } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: HintAction = {kind:"hint"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface HintAction { readonly kind: 'hint' }
/** Requests a native Gem Swap recovery shuffle.
 *
 * @example
 * ```ts
 * import type { ReshuffleAction } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: ReshuffleAction = {kind:"reshuffle"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ReshuffleAction { readonly kind: 'reshuffle' }
/** A native player action accepted or rejected according to the current phase and rules.
 *
 * @example
 * ```ts
 * import type { Action } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const action: Action={kind:"hint"};
 * const value: Action = action;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Action = SwapAction | SelectToolAction | TargetToolAction | ConfirmToolAction | CancelToolAction | UndoAction | HintAction | ReshuffleAction;
/** An event emitted by one native transition; type selects the event’s additional fields.
 *
 * @example
 * ```ts
 * import type { GameEvent } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: GameEvent = {type:"host-example"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameEvent { readonly type: string; readonly [key: string]: unknown }
/** The resulting native state, emitted events and acceptance decision; rejected actions preserve the input.
 *
 * @example
 * ```ts
 * import { applyAction, createGame } from "@johnmorrisdotca/houseki/gem-swap";
 * import type { Action, Transition } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const state=createGame({seed:"docs"});
 * const action: Action={kind:"hint"};
 * const value: Transition = applyAction(state,action);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Transition { readonly state: GameState; readonly events: readonly GameEvent[]; readonly accepted: boolean; readonly reason?: string }
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
  readonly goalProgress: readonly { readonly kind: Goal['kind']; readonly current: number; readonly target: number; readonly colour?: GemColour; readonly complete: boolean }[];
  readonly bestChain: number;
}
