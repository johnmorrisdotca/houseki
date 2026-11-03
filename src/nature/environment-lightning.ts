import { at, deepFreeze, drawBelow, noKeysExcept } from "./environment-support.js";
import type { EnvironmentTransition, LightningOptions, LightningPreview } from "./environment-types.js";
import { freezeNatureState } from "./state.js";
import type { NatureState } from "./types.js";
import { NatureOptionsError, validateState } from "./validation.js";

function validateLightningOptions(options: LightningOptions, width: number): void {
  if (!options || typeof options !== "object" || Array.isArray(options))
    throw new NatureOptionsError("invalid-nature-options", "Lightning options must be an object");
  noKeysExcept(options, ["enabled", "columns", "columnCount"], "Lightning options");
  if (options.enabled !== undefined && typeof options.enabled !== "boolean")
    throw new NatureOptionsError("invalid-nature-options", "Lightning enabled must be boolean");
  if (options.columns !== undefined && options.columnCount !== undefined)
    throw new NatureOptionsError(
      "invalid-nature-options",
      "Choose explicit lightning columns or a seeded column count",
    );
  if (options.columnCount !== undefined && ![1, 2, 3].includes(options.columnCount))
    throw new NatureOptionsError("invalid-nature-options", "Lightning column count must be one, two or three");
  if (
    options.columns !== undefined &&
    (!Array.isArray(options.columns) ||
      options.columns.length < 1 ||
      options.columns.length > 3 ||
      options.columns.some((column) => !Number.isSafeInteger(column) || column < 0 || column >= width) ||
      new Set(options.columns).size !== options.columns.length)
  )
    throw new NatureOptionsError(
      "invalid-nature-options",
      "Lightning columns must be one to three unique in-range column indexes",
    );
}
function chooseColumns(state: NatureState, options: LightningOptions): readonly [readonly number[], number] {
  if (options.columns !== undefined) {
    return [[...options.columns].sort((a, b) => a - b), state.randomState];
  }
  let randomState = state.randomState;
  let count: number;
  if (options.columnCount !== undefined) count = options.columnCount;
  else {
    let draw: number;
    [randomState, draw] = drawBelow(randomState, 3);
    count = draw + 1;
  }
  count = Math.min(count, state.width);
  const pool = Array.from({ length: state.width }, (_, column) => column);
  for (let index = 0; index < count; index++) {
    let offset: number;
    [randomState, offset] = drawBelow(randomState, state.width - index);
    const swap = index + offset;
    [pool[index], pool[swap]] = [pool[swap]!, pool[index]!];
  }
  return [pool.slice(0, count).sort((a, b) => a - b), randomState];
}

/** Preview seeded or explicitly selected columns; a mask gap or obstacle blocks the strike below it.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param options - Validated native creation, authored challenge, or environment options described by this signature.
 * @returns Preview seeded or explicitly selected columns; a mask gap or obstacle blocks the strike below it.
 * @example
 * ```ts
 * import { createNatureState, previewLightning } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * console.log(previewLightning(state,{columns:[0]}).columns);
 * ```
 */
export function previewLightning(state: NatureState, options: LightningOptions = {}): LightningPreview {
  validateState(state);
  validateLightningOptions(options, state.width);
  if (options.enabled === false)
    return deepFreeze({
      columns: [],
      removedCells: [],
      removedIds: [],
      cells: state.cells,
      randomStateAfter: state.randomState,
    });
  const [columns, randomStateAfter] = chooseColumns(state, options);
  const cells = [...state.cells];
  const removedCells: number[] = [];
  const removedIds: number[] = [];
  for (const column of columns) {
    let hits = 0;
    for (let y = 0; y < state.height && hits < 2; y++) {
      const index = at(column, y, state.width);
      if (!state.activeCells[index] || cells[index]?.kind === "obstacle") break;
      const entity = cells[index];
      if (entity?.kind === "stone") {
        cells[index] = null;
        removedCells.push(index);
        removedIds.push(entity.id);
        hits++;
      }
    }
  }
  return deepFreeze({ columns, removedCells, removedIds, cells, randomStateAfter });
}

/** Commit one lightning strike. It removes exposed stones only and consumes no scores or tools.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param options - Validated native creation, authored challenge, or environment options described by this signature.
 * @returns Commit one lightning strike. It removes exposed stones only and consumes no scores or tools.
 * @example
 * ```ts
 * import { applyLightning, createNatureState } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * console.log(applyLightning(state,{columns:[0]}).accepted);
 * ```
 */
export function applyLightning(state: NatureState, options: LightningOptions = {}): EnvironmentTransition {
  const preview = previewLightning(state, options);
  if (options.enabled === false) return { state, accepted: true, events: [], preview };
  const event = deepFreeze({
    type: "lightning-struck" as const,
    columns: preview.columns,
    removedCells: preview.removedCells,
    removedIds: preview.removedIds,
  });
  if (preview.randomStateAfter === state.randomState && preview.removedIds.length === 0)
    return { state, accepted: true, events: [event], preview };
  const next = freezeNatureState({ ...state, cells: preview.cells, randomState: preview.randomStateAfter });
  return { state: next, accepted: true, events: [event], preview };
}
