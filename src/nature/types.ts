/** The native left or right direction used for rebound decisions.
 *
 * @example
 * ```ts
 * import type { HorizontalDirection } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: HorizontalDirection = "left";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type HorizontalDirection = 'left' | 'right';
/** Whether rebound prefers recent input/alternation or the seeded random source.
 *
 * @example
 * ```ts
 * import type { ReboundDirectionMode } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: ReboundDirectionMode = "seeded";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type ReboundDirectionMode = 'input-or-alternate' | 'seeded';
/** A counterclockwise, unchanged or clockwise quarter-turn chosen by the host.
 *
 * @example
 * ```ts
 * import type { QuarterTurn } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: QuarterTurn = 0;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type QuarterTurn = -1 | 0 | 1;

/** Stable board occupant. Obstacles collide and block attraction but cannot move or attract.
 *
 * @example
 * ```ts
 * import type { NatureEntity } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: NatureEntity = {id:1,kind:"stone",colour:"red"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface NatureEntity {
  readonly id: number;
  readonly kind: 'stone' | 'obstacle';
  readonly colour?: string;
  readonly magnetic?: boolean;
  readonly anchored?: boolean;
}
/** A falling native stone with its cell coordinates and stable id.
 *
 * @example
 * ```ts
 * import type { NaturePieceCell } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: NaturePieceCell = {id:1,kind:"stone",colour:"red",x:1,y:0};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface NaturePieceCell extends NatureEntity {
  readonly kind: 'stone';
  readonly x: number;
  readonly y: number;
}
/** The fixed native magnetic and rebound rule switches.
 *
 * @example
 * ```ts
 * import { createNatureState } from "@johnmorrisdotca/houseki/nature";
 * import type { NatureRules } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const value: NatureRules = state.rules;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface NatureRules {
  readonly magneticEnabled: boolean;
  readonly reboundEnabled: boolean;
  readonly reboundDirectionMode: ReboundDirectionMode;
}
/** The native grid dimensions, passability mask, occupants, seed and magnetic/rebound settings.
 *
 * @example
 * ```ts
 * import type { NatureOptions } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: NatureOptions = {width:4,height:4,seed:"docs"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface NatureOptions {
  readonly width: number;
  readonly height: number;
  readonly seed?: string;
  /** Row-major passability mask. False cells are permanent gaps and cannot hold pieces. */
  readonly activeCells?: readonly boolean[];
  /** Row-major initial occupants; false mask cells must be empty. */
  readonly cells?: readonly (NatureEntity | null)[];
  readonly magneticEnabled?: boolean;
  readonly reboundEnabled?: boolean;
  readonly reboundDirectionMode?: ReboundDirectionMode;
}
/** The immutable native environment state with stable ids, seeded random state and placement count.
 *
 * @example
 * ```ts
 * import { createNatureState } from "@johnmorrisdotca/houseki/nature";
 * import type { NatureState } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const value: NatureState = state;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface NatureState {
  readonly width: number;
  readonly height: number;
  readonly activeCells: readonly boolean[];
  readonly cells: readonly (NatureEntity | null)[];
  readonly seed: string;
  readonly randomState: number;
  readonly nextId: number;
  readonly committedPlacements: number;
  readonly rules: NatureRules;
}
/** One native stable-id move between two board coordinates.
 *
 * @example
 * ```ts
 * import type { NatureMove } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: NatureMove = {id:1,from:{x:0,y:0},to:{x:0,y:1}};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface NatureMove {
  readonly id: number;
  readonly from: { readonly x: number; readonly y: number };
  readonly to: { readonly x: number; readonly y: number };
}
/** A pure attraction decision including the paired ids, axis, gap, midpoint and moves.
 *
 * @example
 * ```ts
 * import type { AttractionPairPreview } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: AttractionPairPreview = {ids:[1,2],axis:"horizontal",emptyGap:1,midpoint:{x:1,y:1},moves:[]};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface AttractionPairPreview {
  readonly ids: readonly [number, number];
  readonly axis: 'horizontal' | 'vertical';
  readonly emptyGap: number;
  readonly midpoint: { readonly x: number; readonly y: number };
  readonly anchoredId?: number;
  readonly moves: readonly NatureMove[];
}
/** A pure magnetic-pulse result; no input state or random source is consumed.
 *
 * @example
 * ```ts
 * import { createNatureState, previewMagneticPulse } from "@johnmorrisdotca/houseki/nature";
 * import type { MagneticPreview } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const value: MagneticPreview = previewMagneticPulse(state);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface MagneticPreview {
  readonly pairs: readonly AttractionPairPreview[];
  readonly moves: readonly NatureMove[];
  readonly cells: readonly (NatureEntity | null)[];
}
/** The native piece cells, pivot id and host-selected power/rebound options.
 *
 * @example
 * ```ts
 * import type { PowerDropRequest } from "@johnmorrisdotca/houseki/nature";
 *
 * const request:PowerDropRequest={piece:[{id:1,kind:"stone",colour:"red",x:1,y:0}],pivotId:1,power:true};
 * const value: PowerDropRequest = request;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface PowerDropRequest {
  readonly piece: readonly NaturePieceCell[];
  readonly pivotId: number;
  readonly power: boolean;
  readonly lastHorizontalDirection?: HorizontalDirection;
  /** A caller-selected quarter-turn applied with the one-cell rebound. */
  readonly quarterTurn?: QuarterTurn;
}
/** One tested rebound direction and quarter-turn with its collision-validity result.
 *
 * @example
 * ```ts
 * import type { ReboundAttemptPreview } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: ReboundAttemptPreview = {direction:"left",quarterTurn:0,valid:true};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ReboundAttemptPreview {
  readonly direction: HorizontalDirection;
  readonly quarterTurn: QuarterTurn;
  readonly valid: boolean;
}
/** The pure normal landing, rebound attempts and final lock cells with resulting random state.
 *
 * @example
 * ```ts
 * import { createNatureState, previewPowerDrop } from "@johnmorrisdotca/houseki/nature";
 * import type { PowerDropPreview, PowerDropRequest } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const request:PowerDropRequest={piece:[{id:1,kind:"stone",colour:"red",x:1,y:0}],pivotId:1,power:true};
 * const value: PowerDropPreview = previewPowerDrop(state,request);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface PowerDropPreview {
  readonly normalLanding: readonly NaturePieceCell[];
  readonly attempts: readonly ReboundAttemptPreview[];
  readonly rebound: boolean;
  readonly selectedDirection?: HorizontalDirection;
  readonly quarterTurn: QuarterTurn;
  readonly finalCells: readonly NaturePieceCell[];
  readonly moves: readonly NatureMove[];
  readonly randomStateAfter: number;
}
/** An emitted native magnetic marking, attraction or power-drop event.
 *
 * @example
 * ```ts
 * import { createNatureState } from "@johnmorrisdotca/houseki/nature";
 * import type { NatureEvent } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const value: NatureEvent = {type:"magnetic-stones-marked",ids:[],randomState:state.randomState};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type NatureEvent =
  | { readonly type: 'magnetic-pulse'; readonly pairs: readonly AttractionPairPreview[]; readonly moves: readonly NatureMove[] }
  | { readonly type: 'magnetic-stones-marked'; readonly ids: readonly number[]; readonly randomState: number }
  | { readonly type: 'power-drop-landed'; readonly power: boolean; readonly rebound: boolean; readonly direction?: HorizontalDirection; readonly quarterTurn: QuarterTurn; readonly moves: readonly NatureMove[]; readonly ids: readonly number[] };
/** The native environment result, emitted events and optional pure preview.
 *
 * @example
 * ```ts
 * import { applyMagneticPulse, createNatureState } from "@johnmorrisdotca/houseki/nature";
 * import type { NatureTransition } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const value: NatureTransition = applyMagneticPulse(state);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface NatureTransition {
  readonly state: NatureState;
  readonly accepted: boolean;
  readonly reason?: string;
  readonly events: readonly NatureEvent[];
  readonly preview?: MagneticPreview | PowerDropPreview;
}
/** The probability and optional count/anchor bounds used to mark magnetic stones.
 *
 * @example
 * ```ts
 * import type { MarkingOptions } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: MarkingOptions = {probability:0.25,maximum:2};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface MarkingOptions { readonly probability: number; readonly maximum?: number; readonly anchoredProbability?: number }
/** Stable native validation codes for grid, cell, marking and power-drop failures.
 *
 * @example
 * ```ts
 * import type { NatureErrorCode } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: NatureErrorCode = "invalid-grid-size";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type NatureErrorCode = 'invalid-nature-options' | 'invalid-grid-size' | 'invalid-seed' | 'invalid-mask' | 'invalid-cell' | 'duplicate-id' | 'invalid-marking-options' | 'invalid-power-drop' | 'piece-collision' | 'invalid-piece-position';
