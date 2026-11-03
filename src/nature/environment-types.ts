import type { NatureEntity, NatureMove, NatureState } from "./types.js";

/** The native fault, jumble or combined earthquake mode.
 *
 * @example
 * ```ts
 * import type { EarthquakeKind } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: EarthquakeKind = "fault";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type EarthquakeKind = "fault" | "jumble" | "combined";
/** A periodic, one-turn or authored list of environment trigger turns.
 *
 * @example
 * ```ts
 * import type { EnvironmentSchedule } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: EnvironmentSchedule = {kind:"authored",turns:[2,4]};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type EnvironmentSchedule =
  | { readonly kind: "frequent" }
  | { readonly kind: "rare" }
  | { readonly kind: "midlevel"; readonly turn: number }
  | { readonly kind: "authored"; readonly turns: readonly number[] };
/** The earthquake mode and optional enabled flag.
 *
 * @example
 * ```ts
 * import type { EarthquakeOptions } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: EarthquakeOptions = {kind:"fault"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface EarthquakeOptions {
  readonly kind: EarthquakeKind;
  readonly enabled?: boolean;
}
/** Lightning enablement and explicit columns or a bounded column count.
 *
 * @example
 * ```ts
 * import type { LightningOptions } from "@johnmorrisdotca/houseki/nature";
 *
 * const value: LightningOptions = {columns:[0]};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface LightningOptions {
  readonly enabled?: boolean;
  readonly columns?: readonly number[];
  readonly columnCount?: 1 | 2 | 3;
}
/** A pure earthquake fault path, removed ids and resulting occupants/passability mask.
 *
 * @example
 * ```ts
 * import { createNatureState, previewFault } from "@johnmorrisdotca/houseki/nature";
 * import type { FaultPreview } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const value: FaultPreview = previewFault(state);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface FaultPreview {
  readonly path: readonly number[];
  readonly fracturedCells: readonly number[];
  readonly removedIds: readonly number[];
  readonly cells: readonly (NatureEntity | null)[];
  readonly activeCells: readonly boolean[];
  readonly randomStateAfter: number;
}
/** A pure eligible-patch shuffle and resulting occupants; reason explains when no patch exists.
 *
 * @example
 * ```ts
 * import { createNatureState, previewJumble } from "@johnmorrisdotca/houseki/nature";
 * import type { JumblePreview } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const value: JumblePreview = previewJumble(state);
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface JumblePreview {
  readonly patchCells: readonly number[];
  readonly moves: readonly NatureMove[];
  readonly changed: boolean;
  readonly reason?: "no-eligible-patch";
  readonly cells: readonly (NatureEntity | null)[];
  readonly randomStateAfter: number;
}
export interface EarthquakePreview {
  readonly kind: EarthquakeKind;
  readonly fault?: FaultPreview;
  readonly jumble?: JumblePreview;
  readonly cells: readonly (NatureEntity | null)[];
  readonly activeCells: readonly boolean[];
  readonly randomStateAfter: number;
}
/** A pure selected-column removal and resulting occupants/random state.
 *
 * @example
 * ```ts
 * import { createNatureState, previewLightning } from "@johnmorrisdotca/houseki/nature";
 * import type { LightningPreview } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const value: LightningPreview = previewLightning(state,{columns:[0]});
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface LightningPreview {
  readonly columns: readonly number[];
  readonly removedCells: readonly number[];
  readonly removedIds: readonly number[];
  readonly cells: readonly (NatureEntity | null)[];
  readonly randomStateAfter: number;
}
/** A native earthquake or lightning preview before it is committed.
 *
 * @example
 * ```ts
 * import { createNatureState, previewLightning } from "@johnmorrisdotca/houseki/nature";
 * import type { EnvironmentPreview } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const value: EnvironmentPreview = previewLightning(state,{columns:[0]});
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type EnvironmentPreview = EarthquakePreview | LightningPreview;
/** A committed earthquake or lightning event with its native preview fields.
 *
 * @example
 * ```ts
 * import { applyLightning, createNatureState } from "@johnmorrisdotca/houseki/nature";
 * import type { EnvironmentEvent } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const value: EnvironmentEvent = applyLightning(state,{columns:[0]}).events[0];
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type EnvironmentEvent =
  | {
      readonly type: "fault-opened";
      readonly path: readonly number[];
      readonly fracturedCells: readonly number[];
      readonly removedIds: readonly number[];
    }
  | {
      readonly type: "jumble-completed";
      readonly changed: boolean;
      readonly reason?: "no-eligible-patch";
      readonly patchCells: readonly number[];
      readonly moves: readonly NatureMove[];
    }
  | {
      readonly type: "lightning-struck";
      readonly columns: readonly number[];
      readonly removedCells: readonly number[];
      readonly removedIds: readonly number[];
    };
/** The committed environment state, event list and pure preview.
 *
 * @example
 * ```ts
 * import { applyLightning, createNatureState } from "@johnmorrisdotca/houseki/nature";
 * import type { EnvironmentTransition } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * const value: EnvironmentTransition = applyLightning(state,{columns:[0]});
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface EnvironmentTransition {
  readonly state: NatureState;
  readonly accepted: true;
  readonly events: readonly EnvironmentEvent[];
  readonly preview: EnvironmentPreview;
}
