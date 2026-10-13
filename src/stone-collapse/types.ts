/** A colour used by a stone.
 *
 * @example
 * ```ts
 * import type { StoneColour } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const value: StoneColour = "red";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type StoneColour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
/** A stone keeps its run-local identity as it falls or changes column.
 *
 * @example
 * ```ts
 * import type { Stone } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const value: Stone = {id:1,colour:"red"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Stone { readonly id: number; readonly colour: StoneColour }
/** A named native board geometry; custom dimensions remain a separate option.
 *
 * @example
 * ```ts
 * import type { BoardPreset } from "@johnmorrisdotca/houseki/stone-collapse";
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
 * import type { BoardShape } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const value: BoardShape = "heart";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type BoardShape = 'heart' | 'star' | 'hexagon';
/** The native free, timed, daily or authored-challenge game mode.
 *
 * @example
 * ```ts
 * import type { GameMode } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const value: GameMode = "relaxed";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type GameMode = 'relaxed' | 'arcade' | 'daily' | 'challenge';
/** A stored Stone Collapse tool selected from the native Bomb and Pick tray.
 *
 * @example
 * ```ts
 * import type { StoredTool } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const value: StoredTool = "bomb";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type StoredTool = 'bomb' | 'pick';
/** The native remaining counts of stored tools.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { ToolInventory } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * const value: ToolInventory = state.inventory;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ToolInventory { readonly bomb: number; readonly pick: number }
/** The native ready, resolution and ending phases.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { GamePhase } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * const value: GamePhase = state.phase;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type GamePhase = 'ready' | 'clear-mark' | 'clear-remove' | 'gravity' | 'won' | 'lost' | 'finished';
/** A native authored challenge objective; its discriminant selects target, chain, empty-board or score requirements.
 *
 * @example
 * ```ts
 * import type { ChallengeGoal } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const value: ChallengeGoal = {kind:"clear-all"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type ChallengeGoal =
  | { readonly kind: 'clear-all' }
  | { readonly kind: 'clear-targets'; readonly targetIds: readonly number[] }
  | { readonly kind: 'score-target'; readonly minimumScore: number };
/** Validated settings fixed at native game creation.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { Settings } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * const value: Settings = state.settings;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Settings {
  readonly mode: GameMode;
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly seed: string | number;
  readonly shape?: BoardShape;
  readonly mask: readonly boolean[];
  readonly dailyDate?: string;
  readonly challengeId?: string;
  readonly goal?: ChallengeGoal;
  readonly moveLimit?: number;
  readonly tools: boolean;
}
/** A validated Stone Collapse authored setup and stable-id group witness.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { ChallengeDefinition } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * const value: ChallengeDefinition = {id:"docs",width:state.settings.width,height:state.settings.height,colourCount:4,seed:"docs",mask:state.settings.mask,initialBoard:state.board,goal:{kind:"clear-all"},witness:[]};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChallengeDefinition {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly seed: string | number;
  readonly mask: readonly boolean[];
  readonly initialBoard: readonly (Stone | null)[];
  readonly goal: ChallengeGoal;
  readonly moveLimit?: number;
  /** Each entry is the complete stable-ID set of the next witnessed group. */
  readonly witness: readonly (readonly number[])[];
}
/** Data sufficient to restore the complete game immediately before a committed move.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { UndoFrame } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * const value: UndoFrame = {board:state.board,score:0,moves:0,removed:0,randomState:state.randomState,nextId:state.nextId,usedFallback:false,finishAdjustmentApplied:false,selectedId:null,selectedIds:[],previewScore:0,witnessIndex:0,inventory:state.inventory,toolProgress:0,toolAwardCursor:0,selectedTool:null,toolTarget:null,toolPreview:[]};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface UndoFrame {
  readonly board: readonly (Stone | null)[];
  readonly score: number;
  readonly moves: number;
  readonly removed: number;
  readonly randomState: number;
  readonly nextId: number;
  readonly usedFallback: boolean;
  readonly finishAdjustmentApplied: boolean;
  readonly selectedId: number | null;
  readonly selectedIds: readonly number[];
  readonly previewScore: number;
  readonly witnessIndex: number;
  readonly inventory: ToolInventory;
  readonly toolProgress: number;
  readonly toolAwardCursor: 0 | 1;
  readonly selectedTool: StoredTool | null;
  readonly toolTarget: number | null;
  readonly toolPreview: readonly number[];
}
/** A native action recording with the logical position needed for deterministic replay.
 *
 * @example
 * ```ts
 * import type { RecordedAction } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const value: RecordedAction = {kind:"ticks",count:1};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type RecordedAction =
  | { readonly kind: 'remove'; readonly move: number; readonly stoneId: number }
  | { readonly kind: 'select-tool'; readonly tool: StoredTool }
  | { readonly kind: 'target-tool'; readonly cell: number }
  | { readonly kind: 'confirm-tool'; readonly move: number }
  | { readonly kind: 'cancel-tool' }
  | { readonly kind: 'undo'; readonly move: number }
  | { readonly kind: 'hint'; readonly witnessIndex: number }
  | { readonly kind: 'ticks'; readonly count: number };
/** The immutable authoritative native game state, including its board, random state and recording.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { GameState } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * const value: GameState = state;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameState {
  readonly game: 'stone-collapse';
  readonly rules: 'collapse-2';
  readonly settings: Settings;
  readonly challenge: ChallengeDefinition | null;
  readonly initialBoard: readonly (Stone | null)[];
  /** Row-major; masked and currently empty cells contain null. */
  readonly board: readonly (Stone | null)[];
  readonly phase: GamePhase;
  readonly selectedId: number | null;
  readonly selectedIds: readonly number[];
  readonly previewScore: number;
  readonly score: number;
  readonly moves: number;
  readonly removed: number;
  readonly randomState: number;
  readonly nextId: number;
  readonly usedFallback: boolean;
  readonly resolutionTick: number;
  readonly pendingIds: readonly number[];
  /** Settled destination board held during the gravity animation. */
  readonly gravityBoard: readonly (Stone | null)[] | null;
  readonly finishAdjustmentApplied: boolean;
  readonly assisted: boolean;
  readonly history: readonly UndoFrame[];
  /** -1 means the player's current board has left the supplied witness path. */
  readonly witnessIndex: number;
  readonly elapsedTicks: number;
  readonly reason?: string;
  readonly recording: readonly RecordedAction[];
  readonly inventory: ToolInventory;
  /** Ordinary removed stones carried toward the next tool award; always 0–11. */
  readonly toolProgress: number;
  /** 0 awards Bomb next; 1 awards Pick next. */
  readonly toolAwardCursor: 0 | 1;
  readonly selectedTool: StoredTool | null;
  readonly toolTarget: number | null;
  /** Exact row-major cells affected by the current target. */
  readonly toolPreview: readonly number[];
}
/** A native player action accepted or rejected according to the current phase and rules.
 *
 * @example
 * ```ts
 * import type { Action } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const action: Action={kind:"hint"};
 * const value: Action = action;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Action =
  | { readonly kind: 'select'; readonly stoneId: number }
  | { readonly kind: 'confirm' }
  | { readonly kind: 'cancel' }
  | { readonly kind: 'undo' }
  | { readonly kind: 'hint' }
  | { readonly kind: 'select-tool'; readonly tool: StoredTool }
  | { readonly kind: 'target-tool'; readonly cell: number }
  | { readonly kind: 'confirm-tool' }
  | { readonly kind: 'cancel-tool' };
/** An event emitted by one native transition; type selects the event’s additional fields.
 *
 * @example
 * ```ts
 * import type { GameEvent } from "@johnmorrisdotca/houseki/stone-collapse";
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
 * import { applyAction, createGame } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { Action, Transition } from "@johnmorrisdotca/houseki/stone-collapse";
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
 * import type { CreateOptions } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const value: CreateOptions = {seed:"docs"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CreateOptions {
  readonly mode?: Exclude<GameMode, 'challenge'>;
  readonly preset?: BoardPreset;
  readonly width?: number;
  readonly height?: number;
  readonly colourCount?: 4 | 5 | 6;
  readonly seed?: string | number;
  readonly shape?: BoardShape;
  /** Row-major custom active-cell mask. Supply width and height with a custom mask. */
  readonly mask?: readonly boolean[];
  /** Required for Daily; supplied by the host in UTC. */
  readonly dailyDate?: string;
  /** Optional Bomb and Pick tray; available only in Relaxed and Arcade. */
  readonly tools?: boolean;
}
/** Authored challenge inputs including the starting board, finite goal and supplied witness.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { ChallengeOptions } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * const value: ChallengeOptions = {id:"docs",width:6,height:6,colourCount:4,initialBoard:state.board,goal:{kind:"clear-all"},witness:[]};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChallengeOptions {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly seed?: string | number;
  readonly mask?: readonly boolean[];
  readonly initialBoard: readonly (Stone | null)[];
  readonly goal: ChallengeGoal;
  readonly moveLimit?: number;
  readonly witness: readonly (readonly number[])[];
}
/** A compact native status derived from the authoritative state for a host’s labels.
 *
 * @example
 * ```ts
 * import { createGame, statusOf } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { GameStatus } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const state=createGame({seed:"docs"});
 * const value: GameStatus = statusOf(state);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameStatus {
  readonly mode: GameMode;
  readonly phase: GamePhase;
  readonly score: number;
  readonly moves: number;
  readonly removed: number;
  readonly remaining: number;
  readonly previewScore: number;
  readonly usedFallback: boolean;
  readonly assisted: boolean;
  readonly goal?: ChallengeGoal;
  readonly reason?: string;
  readonly inventory: ToolInventory;
  readonly toolProgress: number;
  readonly toolAwardCursor: 0 | 1;
  readonly selectedTool: StoredTool | null;
  readonly toolTarget: number | null;
  readonly toolPreview: readonly number[];
}
