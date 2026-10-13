import type { NaturePieceCell, PowerDropPreview } from '../nature/types.js';
/** A gem colour used by Colour Chains.
 *
 * @example
 * ```ts
 * import type { Colour } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: Colour = "red";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Colour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
/** A settled or active stone with a stable run-local identity.
 *
 * @example
 * ```ts
 * import type { Gem } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: Gem = {id:1,colour:"red"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Gem { readonly id: number; readonly colour: Colour; readonly magnetic?: true }
/** Authored challenge layouts can include explicit Shizen-marked stones.
 *
 * @example
 * ```ts
 * import type { ChallengeGem } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: ChallengeGem = {id:1,colour:"red",magnetic:true};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type ChallengeGem = Gem;
/** The pivot-to-satellite direction, in clockwise order.
 *
 * @example
 * ```ts
 * import type { Orientation } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: Orientation = "up";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Orientation = 'up' | 'right' | 'down' | 'left';
/** A visible or hidden board coordinate.
 *
 * @example
 * ```ts
 * import type { Cell } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: Cell = {x:0,y:0};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Cell { readonly x: number; readonly y: number }
/** The active rigid pair. The pivot always retains its own gem identity.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { Pair } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const value: Pair = state.active!;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Pair { readonly pivot: Cell; readonly orientation: Orientation; readonly gems: readonly [Gem, Gem]; readonly level: number; readonly gravityTicks: number; readonly groundedTicks: number; readonly resetCount: number; readonly groundedStarted: boolean }
/** Supported well presets.
 *
 * @example
 * ```ts
 * import type { Preset } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: Preset = "standard";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Preset = 'narrow' | 'standard' | 'wide' | 'tall' | 'extraWide' | 'deep' | 'large';
/** The native game mode; authored challenges have fixed setup and queue rules.
 *
 * @example
 * ```ts
 * import type { Mode } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: Mode = "relaxed";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Mode = 'relaxed' | 'arcade' | 'daily' | 'challenge';
/** The native frequent or rare weather schedule for Colour Chains.
 *
 * @example
 * ```ts
 * import type { WeatherSchedule } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: WeatherSchedule = "frequent";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type WeatherSchedule = 'frequent' | 'rare';
/** Creation settings for this native engine; dimensions, mode, seed and optional mechanics are validated together.
 *
 * @example
 * ```ts
 * import type { CreateOptions } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: CreateOptions = {seed:"docs"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CreateOptions { readonly mode?: Exclude<Mode, 'challenge'>; readonly seed?: string; readonly dailyDate?: string; readonly preset?: Preset; readonly width?: number; readonly height?: number; readonly colourCount?: 4 | 5 | 6; readonly pairLimit?: number; readonly nature?: boolean; readonly weather?: WeatherSchedule }
/** Run settings fixed at game creation.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { Settings } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const value: Settings = state.settings;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Settings { readonly mode: Mode; readonly width: number; readonly height: number; readonly colourCount: 4 | 5 | 6; readonly seed: string; readonly date?: string; readonly pairLimit?: number; readonly nature?: true; readonly weather?: WeatherSchedule; readonly challengeId?: string; readonly goal?: ChallengeGoal; readonly initialBoard?: readonly (ChallengeGem | null)[]; readonly queue?: readonly (readonly [Colour, Colour])[]; readonly magneticQueue?: readonly (readonly [boolean, boolean])[]; readonly witness?: readonly WitnessStep[] }
/** Challenge objective; target IDs refer to the visible starting board.
 *
 * @example
 * ```ts
 * import type { ChallengeGoal } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: ChallengeGoal = {kind:"empty-board"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type ChallengeGoal = { readonly kind: 'clear-targets'; readonly targetIds: readonly number[] } | { readonly kind: 'minimum-chain'; readonly chain: number } | { readonly kind: 'empty-board' };
/** One witnessed Colour Chains pair placement using pivot column and orientation.
 *
 * @example
 * ```ts
 * import type { WitnessStep } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: WitnessStep = {pivotX:0,orientation:"up"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface WitnessStep { readonly pivotX: number; readonly orientation: Orientation }
/** Authored challenge inputs including the starting board, finite goal and supplied witness.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { ChallengeOptions } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const value: ChallengeOptions = {id:"docs",board:state.board,queue:[["red","green"]],goal:{kind:"empty-board"}};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChallengeOptions { readonly id: string; readonly width?: number; readonly height?: number; readonly colourCount?: 4 | 5 | 6; readonly seed?: string; readonly board: readonly (ChallengeGem | null)[]; readonly queue: readonly (readonly [Colour, Colour])[]; readonly magneticQueue?: readonly (readonly [boolean, boolean])[]; readonly nature?: boolean; readonly weather?: WeatherSchedule; readonly goal: ChallengeGoal; readonly witness?: readonly WitnessStep[] }
/** Observable game phases.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { Phase } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const value: Phase = state.phase;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Phase = 'falling' | 'clear-mark' | 'clear-remove' | 'gravity' | 'paused' | 'won' | 'lost' | 'finished';
/** A scored simultaneous match wave.
 *
 * @example
 * ```ts
 * import type { Wave } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: Wave = {chain:1,cells:[],points:0,ids:[]};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Wave { readonly chain: number; readonly cells: readonly number[]; readonly ids: readonly number[]; readonly points: number }
/** One native Colour Chains player command, including pause and hint commands.
 *
 * @example
 * ```ts
 * import type { Action, PlayAction } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const action: Action={kind:"left"};
 * const value: PlayAction = action;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type PlayAction = { readonly kind: 'left' } | { readonly kind: 'right' } | { readonly kind: 'down' } | { readonly kind: 'rotate-clockwise' } | { readonly kind: 'rotate-anticlockwise' } | { readonly kind: 'hard-drop' } | { readonly kind: 'place' } | { readonly kind: 'pause' } | { readonly kind: 'resume' } | { readonly kind: 'hint' };
/** A native player action accepted or rejected according to the current phase and rules.
 *
 * @example
 * ```ts
 * import type { Action } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const action: Action={kind:"left"};
 * const value: Action = action;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Action = PlayAction;
/** A lateral or soft-drop control which the input scheduler can repeat.
 *
 * @example
 * ```ts
 * import type { HeldControl } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: HeldControl = "left";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type HeldControl = 'left' | 'right' | 'soft-drop';
/** A native held-control change or one-shot edge command for Colour Chains.
 *
 * @example
 * ```ts
 * import type { InputCommand } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: InputCommand = {kind:"hold",control:"left",pressed:true};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type InputCommand = { readonly kind: 'hold'; readonly control: HeldControl; readonly pressed: boolean } | { readonly kind: 'edge'; readonly action: Extract<PlayAction, { kind: 'rotate-clockwise' | 'rotate-anticlockwise' | 'hard-drop' | 'place' | 'pause' | 'resume' }> };
/** A native action recording with the logical position needed for deterministic replay.
 *
 * @example
 * ```ts
 * import type { Action, RecordedAction } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const action: Action={kind:"left"};
 * const value: RecordedAction = {tick:0,ordinal:0,action};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface RecordedAction { readonly tick: number; readonly ordinal: number; readonly action: PlayAction }
/** An immutable Colour Chains rules state. Board rows include the three hidden rows above the well.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { GameState } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const value: GameState = state;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameState {
  readonly game: 'colour-chains'; readonly rules: 'chains-1'; readonly settings: Settings;
  readonly board: readonly (Gem | null)[]; readonly phase: Phase; readonly pausedPhase?: Exclude<Phase, 'paused'>; readonly active: Pair | null;
  readonly next: readonly (readonly [Colour, Colour])[]; readonly bag: readonly Colour[]; readonly randomState: number;
  readonly nextMagnetic?: readonly (readonly [boolean, boolean])[]; readonly lastHorizontalDirection?: 'left' | 'right'; readonly naturePulsePending?: boolean;
  readonly weatherResolvedPairs?: number;
  readonly nextId: number; readonly score: number; readonly maxChain: number; readonly allClears: number; readonly completedPairs: number;
  readonly resolutionTick: number; readonly resolutionLevel?: number; readonly waves: readonly Wave[]; readonly clearCells: readonly number[];
  readonly gravityBoard: readonly (Gem | null)[] | null; readonly resolutionHadClear: boolean; readonly elapsedTicks: number;
  readonly assisted: boolean; readonly witnessIndex: number; readonly recording: readonly RecordedAction[]; readonly reason?: string;
}
/** A deterministic transition; rejected actions retain the exact input state.
 *
 * @example
 * ```ts
 * import { applyAction, createGame } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { Action, Transition } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const action: Action={kind:"left"};
 * const value: Transition = applyAction(state,action);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Transition { readonly state: GameState; readonly events: readonly GameEvent[]; readonly accepted: boolean; readonly reason?: string }
/** A domain event emitted by one transition.
 *
 * @example
 * ```ts
 * import type { GameEvent } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: GameEvent = {type:"host-example"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameEvent { readonly type: string; readonly [key: string]: unknown }
/** Compact player status derived from the current state.
 *
 * @example
 * ```ts
 * import { createGame, statusOf } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { GameStatus } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const value: GameStatus = statusOf(state);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameStatus { readonly mode: Mode; readonly phase: Phase; readonly score: number; readonly maxChain: number; readonly allClears: number; readonly completedPairs: number; readonly assisted: boolean; readonly reason?: string }
/** Destination cells for the two independently settled ghost stones.
 *
 * @example
 * ```ts
 * import { createGame, landingCells } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { Landing } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const state=createGame({seed:"docs"});
 * const value: Landing = landingCells(state)!;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Landing = readonly [Cell, Cell];

/** The Shizen hard-drop preview: the one-step rebound and where the pair locks (`finalCells`), and where each stone of the pair comes to rest once the committed drop's gravity has run (`settledCells`).
 *
 * @example
 * ```ts
 * import type { ChainsPowerDropPreview } from "@johnmorrisdotca/houseki/colour-chains";
 * import { createGame, powerDropPreview } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: ChainsPowerDropPreview = powerDropPreview(createGame({seed:"docs",nature:true}))!;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChainsPowerDropPreview extends PowerDropPreview { readonly settledCells: readonly NaturePieceCell[] }
