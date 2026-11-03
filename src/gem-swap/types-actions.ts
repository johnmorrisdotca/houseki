import type { ToolKind } from "./types-pieces.js";
import type { GameState } from "./types-state.js";

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
export interface SwapAction {
  readonly kind: "swap";
  readonly from: number;
  readonly to: number;
}
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
export interface SelectToolAction {
  readonly kind: "select-tool";
  readonly tool: ToolKind;
}
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
export interface TargetToolAction {
  readonly kind: "target-tool";
  readonly cell: number;
}
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
export interface ConfirmToolAction {
  readonly kind: "confirm-tool";
}
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
export interface CancelToolAction {
  readonly kind: "cancel-tool";
}
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
export interface UndoAction {
  readonly kind: "undo";
}
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
export interface HintAction {
  readonly kind: "hint";
}
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
export interface ReshuffleAction {
  readonly kind: "reshuffle";
}
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
export type Action =
  | SwapAction
  | SelectToolAction
  | TargetToolAction
  | ConfirmToolAction
  | CancelToolAction
  | UndoAction
  | HintAction
  | ReshuffleAction;
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
export interface GameEvent {
  readonly type: string;
  readonly [key: string]: unknown;
}
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
export interface Transition {
  readonly state: GameState;
  readonly events: readonly GameEvent[];
  readonly accepted: boolean;
  readonly reason?: string;
}
