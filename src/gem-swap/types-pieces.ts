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
export type GemColour = "red" | "blue" | "green" | "gold" | "purple" | "teal";
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
export type SpecialKind = "row-beam" | "column-beam" | "bomb" | "colour-burst";
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
export type ToolKind = "bomb" | "row-clear" | "colour-clear" | "black-hole";
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
export type OrdinaryToolKind = Exclude<ToolKind, "black-hole">;
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
export interface Gem {
  readonly id: number;
  readonly colour: GemColour;
  readonly kind?: SpecialKind;
}
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
export interface PlannedSpecial {
  readonly cell: number;
  readonly kind: SpecialKind;
}
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
export type BoardPreset = "compact" | "standard" | "wide" | "tall" | "extraWide" | "deep" | "large";
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
export type BoardShape = "heart" | "star" | "hexagon";
