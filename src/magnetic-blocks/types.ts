/** A standard gem colour used by a magnetic block.
 *
 * @example
 * ```ts
 * import type { Colour } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const value: Colour = "red";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Colour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
/** The native calm or magnetic floor used when settling blocks.
 *
 * @example
 * ```ts
 * import type { Floor } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const value: Floor = "calm";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Floor = 'calm' | 'magnetic';
/** A fixed, periodic or authored schedule selecting the floor for committed block placements.
 *
 * @example
 * ```ts
 * import type { FloorSchedule } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const value: FloorSchedule = {kind:"fixed",floor:"calm"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type FloorSchedule =
  | { readonly kind: 'frequent' }
  | { readonly kind: 'occasional' }
  | { readonly kind: 'infrequent' }
  | { readonly kind: 'mid-level'; readonly placement: number }
  | { readonly kind: 'fixed'; readonly floor: Floor }
  | { readonly kind: 'authored'; readonly magneticPlacements: readonly number[]; readonly defaultFloor?: Floor };
/** The native game mode; authored challenges have fixed setup and queue rules.
 *
 * @example
 * ```ts
 * import type { Mode } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const value: Mode = "relaxed";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Mode = 'relaxed' | 'arcade';
/** The native falling, resolution, pause and ending phases.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * import type { Phase } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * const value: Phase = state.phase;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Phase = 'falling' | 'clear-mark' | 'clear-remove' | 'gravity' | 'paused' | 'won' | 'lost' | 'finished';
/** A native gem with a stable run-local id and colour.
 *
 * @example
 * ```ts
 * import type { Gem } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const value: Gem = {id:1,colour:"red"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Gem { readonly id: number; readonly colour: Colour }
/** An undirected stable-id connection between two gems in a magnetic block.
 *
 * @example
 * ```ts
 * import type { Bond } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const value: Bond = {a:1,b:2};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Bond { readonly a: number; readonly b: number }
/** The native active 2×2 block, orientation and fixed-tick descent/lock counters.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * import type { Block } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * const value: Block = state.active!;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Block { readonly x: number; readonly y: number; readonly orientation: 0 | 1 | 2 | 3; readonly gems: readonly [Gem, Gem, Gem, Gem]; readonly descent: number; readonly lockTicks: number; readonly lockResets: number; readonly lockStarted: boolean }
/** The native authored goal; its discriminant selects the required collection or clearing condition.
 *
 * @example
 * ```ts
 * import type { Goal } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const value: Goal = {kind:"clear-all"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Goal = { readonly kind: 'clear-all' } | { readonly kind: 'clear-targets'; readonly targetIds: readonly number[] };
/** Creation settings for this native engine; dimensions, mode, seed and optional mechanics are validated together.
 *
 * @example
 * ```ts
 * import type { CreateOptions } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const value: CreateOptions = {seed:"docs"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CreateOptions {
  readonly mode?: Mode;
  readonly width?: number;
  readonly height?: number;
  readonly colourCount?: 4 | 5 | 6;
  readonly seed?: string | number;
  readonly mask?: readonly boolean[];
  readonly initialBoard?: readonly (Gem | null)[];
  readonly bonds?: readonly Bond[];
  readonly queue?: readonly (readonly [Colour, Colour, Colour, Colour])[];
  readonly pieceLimit?: number;
  readonly schedule?: FloorSchedule;
  readonly floorSwitch?: boolean;
  readonly magneticImpact?: boolean;
  readonly goal?: Goal;
}
/** Validated settings fixed at native game creation.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * import type { Settings } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * const value: Settings = state.settings;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Settings {
  readonly mode: Mode; readonly width: number; readonly height: number; readonly colourCount: 4 | 5 | 6; readonly seed: string | number;
  readonly mask: readonly boolean[]; readonly schedule: FloorSchedule; readonly floorSwitch: boolean;
  readonly magneticImpact: boolean; readonly pieceLimit: number; readonly initialBoard: readonly (Gem | null)[]; readonly bonds: readonly Bond[];
  readonly initialQueue?: readonly (readonly [Colour, Colour, Colour, Colour])[]; readonly goal?: Goal;
}
/** The immutable authoritative native game state, including its board, random state and recording.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * import type { GameState } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * const value: GameState = state;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameState {
  readonly game: 'magnetic-blocks'; readonly rules: 'magnetic-blocks-1'; readonly settings: Settings;
  readonly board: readonly (Gem | null)[]; readonly bonds: readonly Bond[]; readonly active: Block | null;
  readonly queue: readonly (readonly [Colour, Colour, Colour, Colour])[]; readonly randomState: number; readonly nextId: number;
  readonly phase: Phase; readonly pausedPhase?: Exclude<Phase, 'paused'>; readonly score: number; readonly moves: number; readonly placements: number; readonly chain: number; readonly maxChain: number;
  readonly floor: Floor; readonly nextFloor: Floor; readonly floorSwitchCharges: 0 | 1; readonly pendingFloorOverride: Floor | null;
  readonly pendingClear: readonly number[]; readonly gravityBoard: readonly (Gem | null)[] | null; readonly resolutionTick: number;
  readonly impactRemovedIds: readonly number[]; readonly elapsedTicks: number; readonly recording: readonly RecordedAction[]; readonly reason?: string;
}
/** A native player action accepted or rejected according to the current phase and rules.
 *
 * @example
 * ```ts
 * import type { Action } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const action: Action={kind:"left"};
 * const value: Action = action;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type Action =
  | { readonly kind: 'left' } | { readonly kind: 'right' } | { readonly kind: 'soft-drop' }
  | { readonly kind: 'rotate-clockwise' } | { readonly kind: 'rotate-anticlockwise' }
  | { readonly kind: 'hard-drop' } | { readonly kind: 'land' } | { readonly kind: 'pause' } | { readonly kind: 'resume' }
  | { readonly kind: 'set-floor-override'; readonly floor: Floor } | { readonly kind: 'cancel-floor-override' };
/** A native action recording with the logical position needed for deterministic replay.
 *
 * @example
 * ```ts
 * import type { Action, RecordedAction } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const action: Action={kind:"left"};
 * const value: RecordedAction = {tick:0,ordinal:0,action};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface RecordedAction { readonly tick: number; readonly ordinal: number; readonly action: Action }
/** An event emitted by one native transition; type selects the event’s additional fields.
 *
 * @example
 * ```ts
 * import type { GameEvent } from "@johnmorrisdotca/houseki/magnetic-blocks";
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
 * import { applyAction, createGame } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * import type { Action, Transition } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * const action: Action={kind:"left"};
 * const value: Transition = applyAction(state,action);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface Transition { readonly state: GameState; readonly events: readonly GameEvent[]; readonly accepted: boolean; readonly reason?: string }
/** A compact native status derived from the authoritative state for a host’s labels.
 *
 * @example
 * ```ts
 * import { createGame, statusOf } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * import type { GameStatus } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const state=createGame({seed:"docs"});
 * const value: GameStatus = statusOf(state);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GameStatus { readonly phase: Phase; readonly score: number; readonly moves: number; readonly placements: number; readonly floor: Floor; readonly nextFloor: Floor; readonly floorSwitchCharges: number; readonly pendingFloorOverride: Floor | null; readonly maxChain: number; readonly reason?: string }
