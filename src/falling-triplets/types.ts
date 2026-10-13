/** A gem colour ID.
 *
 * @example
 * ```ts
 * import type { Colour } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: Colour = "red";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Colour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
/** A settled or active gem with a stable run-local identity.
 *
 * @example
 * ```ts
 * import type { Gem } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: Gem = {id:1,colour:"red"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Gem { readonly id: number; readonly colour: Colour; readonly target?: boolean }
/** The native game mode; authored challenges have fixed setup and queue rules.
 *
 * @example
 * ```ts
 * import type { Mode } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: Mode = "relaxed";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Mode = 'relaxed' | 'arcade' | 'daily' | 'challenge';
/** The native falling, resolution, pause and ending phases.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { Phase } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * const value: Phase = state.phase;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Phase = 'falling' | 'clear-mark' | 'clear-remove' | 'gravity' | 'paused' | 'won' | 'lost' | 'finished';
/** The native falling triplet with stable gem ids, orientation, descent and lock counters.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { Piece } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * const value: Piece = state.active!;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Piece { readonly gems: readonly [Gem, Gem, Gem]; readonly x: number; readonly y: number; readonly orientation: 0 | 1 | 2; readonly level: number; readonly descent: number; readonly lockTicks: number; readonly lockResets: number; readonly lockStarted: boolean }
/** Validated settings fixed at native game creation.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { Settings } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * const value: Settings = state.settings;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Settings { readonly mode: Mode; readonly width: number; readonly height: number; readonly colourCount: 4 | 5 | 6; readonly seed: string; readonly pieceLimit?: number; readonly goal?: 'targets' | 'chain' | 'empty'; readonly targetIds?: readonly number[]; readonly minimumChain?: number; readonly challengeBoard?: readonly (Gem | null)[]; readonly challengeQueue?: readonly Triplet[]; readonly witness?: readonly ChallengeHint[] }
/** Three ordered gem colours composing one falling triplet.
 *
 * @example
 * ```ts
 * import type { Triplet } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: Triplet = ["red","green","blue"];
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Triplet = readonly [Colour, Colour, Colour];
/** A Falling Triplets objective requiring the supplied stable target ids to be cleared.
 *
 * @example
 * ```ts
 * import type { ChallengeGoalTargets } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: ChallengeGoalTargets = {type:"targets",targetIds:[1]};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChallengeGoalTargets { readonly type: 'targets'; readonly targetIds: readonly number[] }
/** A Falling Triplets objective requiring at least the supplied chain depth.
 *
 * @example
 * ```ts
 * import type { ChallengeGoalChain } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: ChallengeGoalChain = {type:"chain",minimumChain:2};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChallengeGoalChain { readonly type: 'chain'; readonly minimumChain: number }
/** A Falling Triplets objective requiring an empty board.
 *
 * @example
 * ```ts
 * import type { ChallengeGoalEmpty } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: ChallengeGoalEmpty = {type:"empty"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChallengeGoalEmpty { readonly type: 'empty' }
/** A native authored challenge objective; its discriminant selects target, chain, empty-board or score requirements.
 *
 * @example
 * ```ts
 * import type { ChallengeGoal } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: ChallengeGoal = {type:"empty"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type ChallengeGoal = ChallengeGoalTargets | ChallengeGoalChain | ChallengeGoalEmpty;
/** One witnessed Falling Triplets placement with a column and cycle orientation.
 *
 * @example
 * ```ts
 * import type { ChallengeHint } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: ChallengeHint = {x:0,orientation:0};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChallengeHint { readonly x: number; readonly orientation: 0 | 1 | 2 }
/** The fixed Falling Triplets challenge settings with the original board and finite triplet queue.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { ChallengeSettings } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * const value: ChallengeSettings = {...state.settings,mode:"challenge",goal:"empty",challengeBoard:state.board,challengeQueue:[["red","green","blue"]]};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChallengeSettings extends Settings { readonly mode: 'challenge'; readonly goal: ChallengeGoal['type']; readonly challengeBoard: readonly (Gem | null)[]; readonly challengeQueue: readonly Triplet[] }
/** One simultaneous native match wave, its cleared cells and chain score.
 *
 * @example
 * ```ts
 * import type { Wave } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: Wave = {chain:1,cells:[],points:0,clearedIds:[]};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Wave { readonly clearedIds: readonly number[]; readonly cells: readonly number[]; readonly chain: number; readonly points: number }
/** The immutable authoritative native game state, including its board, random state and recording.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { GameState } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * const value: GameState = state;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameState { readonly game: 'falling-triplets'; readonly rules: 'triplets-1'; readonly settings: Settings; readonly board: readonly (Gem | null)[]; readonly phase: Phase; readonly pausedPhase?: Phase; readonly active: Piece | null; readonly next: readonly Triplet[]; readonly bag: readonly Colour[]; readonly randomState: number; readonly nextId: number; readonly score: number; readonly maxChain: number; readonly completedPieces: number; readonly elapsedTicks: number; readonly pieceTicks: number; readonly resolutionTick: number; readonly waves: readonly Wave[]; readonly assisted: boolean; readonly hintsUsed: number; readonly witnessPathMatches: boolean; readonly challengeIndex?: number; readonly pendingClear?: readonly number[]; readonly gravityBoard?: readonly (Gem | null)[]; readonly resolutionChain?: number; readonly resolutionLevel?: number; readonly recording: readonly RecordedAction[]; readonly reason?: string }
/** A native player action accepted or rejected according to the current phase and rules.
 *
 * @example
 * ```ts
 * import type { Action } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const action: Action={kind:"left"};
 * const value: Action = action;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Action = { readonly kind: 'left' | 'right' | 'soft-drop' | 'hard-drop' | 'place' | 'cycle-forward' | 'cycle-backward' | 'pause' | 'resume' | 'hint' | 'tick' };
/** The resulting native state, emitted events and acceptance decision; rejected actions preserve the input.
 *
 * @example
 * ```ts
 * import { applyAction, createGame } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { Action, Transition } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * const action: Action={kind:"left"};
 * const value: Transition = applyAction(state,action);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Transition { readonly state: GameState; readonly events: readonly GameEvent[]; readonly accepted: boolean; readonly reason?: string }
/** One accepted canonical action and its logical tick position.
 *
 * @example
 * ```ts
 * import type { Action, RecordedAction } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const action: Action={kind:"left"};
 * const value: RecordedAction = {tick:0,ordinal:0,action};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface RecordedAction { readonly tick: number; readonly ordinal: number; readonly action: Exclude<Action, { readonly kind: 'tick' }> }
/** An event emitted by one native transition; type selects the event’s additional fields.
 *
 * @example
 * ```ts
 * import type { GameEvent } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: GameEvent = {type:"host-example"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameEvent { readonly type: string; readonly [key: string]: unknown }
/** Creation settings for this native engine; dimensions, mode, seed and optional mechanics are validated together.
 *
 * @example
 * ```ts
 * import type { CreateOptions } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: CreateOptions = {seed:"docs"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CreateOptions { readonly mode?: Exclude<Mode, 'challenge'>; readonly seed?: string; readonly preset?: 'compact' | 'narrow' | 'standard' | 'wide' | 'extraWide' | 'tall' | 'deep' | 'large'; readonly width?: number; readonly height?: number; readonly colourCount?: 4 | 5 | 6; readonly pieceLimit?: number }
/** Authored challenge inputs including the starting board, finite goal and supplied witness.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { ChallengeOptions } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * const value: ChallengeOptions = {width:6,height:12,board:state.board,queue:[["red","green","blue"]],goal:{type:"empty"}};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChallengeOptions { readonly seed?: string; readonly width?: number; readonly height?: number; readonly colourCount?: 4 | 5 | 6; readonly board: readonly (Gem | null)[]; readonly queue: readonly Triplet[]; readonly goal: ChallengeGoal; readonly witness?: readonly ChallengeHint[] }
