import { at, deepFreeze, drawBelow, noKeysExcept } from "./environment-support.js";
import type {
  EarthquakeOptions,
  EarthquakePreview,
  EnvironmentEvent,
  EnvironmentTransition,
  FaultPreview,
  JumblePreview,
} from "./environment-types.js";
import { freezeNatureState } from "./state.js";
import type { NatureEntity, NatureMove, NatureState } from "./types.js";
import { NatureOptionsError, validateState } from "./validation.js";

function validateEarthquakeOptions(options: EarthquakeOptions): void {
  if (!options || typeof options !== "object" || Array.isArray(options))
    throw new NatureOptionsError("invalid-nature-options", "Earthquake options must be an object");
  noKeysExcept(options, ["kind", "enabled"], "Earthquake options");
  if (
    !["fault", "jumble", "combined"].includes(options.kind) ||
    (options.enabled !== undefined && typeof options.enabled !== "boolean")
  )
    throw new NatureOptionsError("invalid-nature-options", "Earthquake options are malformed");
}

function faultPath(state: NatureState): readonly [readonly number[], number] {
  if (state.width < 3)
    throw new NatureOptionsError(
      "invalid-grid-size",
      "A fault needs at least three columns to preserve playable space on both sides",
    );
  const [firstState, draw] = drawBelow(state.randomState, state.width - 2);
  let randomState = firstState;
  let x = draw + 1;
  const path: number[] = [at(x, 0, state.width)];
  for (let y = 1; y < state.height; y++) {
    let step: number;
    [randomState, step] = drawBelow(randomState, 3);
    x = Math.max(1, Math.min(state.width - 2, x + step - 1));
    path.push(at(x, y, state.width));
  }
  if (
    state.height > 1 &&
    state.width > 3 &&
    path.every((index, y) => y === 0 || index % state.width === path[y - 1]! % state.width)
  ) {
    const row = Math.min(state.height - 1, Math.floor(state.height / 2));
    const priorX = path[row - 1]! % state.width;
    const bentX = priorX === state.width - 2 ? priorX - 1 : priorX + 1;
    path[row] = at(bentX, row, state.width);
  }
  return [path, randomState];
}

/** Preview a bounded top-to-bottom fracture. The path keeps at least one column active on each side.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Preview a bounded top-to-bottom fracture. The path keeps at least one column active on each side.
 * @example
 * ```ts
 * import { createNatureState, previewFault } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * console.log(previewFault(state).removedIds.length);
 * ```
 */
export function previewFault(state: NatureState): FaultPreview {
  validateState(state);
  const [path, randomStateAfter] = faultPath(state);
  const cells = [...state.cells];
  const activeCells = [...state.activeCells];
  const removedIds: number[] = [];
  const fracturedCells: number[] = [];
  for (const index of path) {
    if (!activeCells[index]) continue;
    activeCells[index] = false;
    fracturedCells.push(index);
    const entity = cells[index];
    if (entity) {
      removedIds.push(entity.id);
      cells[index] = null;
    }
  }
  return deepFreeze({ path, fracturedCells, removedIds, cells, activeCells, randomStateAfter });
}

const appearance = (entity: NatureEntity): string => `${entity.colour}|${Boolean(entity.magnetic)}`;
interface Patch {
  readonly cells: readonly number[];
  readonly stones: readonly number[];
}
function candidatePatches(state: NatureState): readonly Patch[] {
  const patches: Patch[] = [];
  for (let height = 1; height <= Math.min(3, state.height); height++)
    for (let width = 1; width <= Math.min(3, state.width); width++) {
      if (width * height < 2) continue;
      for (let top = 0; top <= state.height - height; top++)
        for (let left = 0; left <= state.width - width; left++) {
          const cells: number[] = [];
          const stones: number[] = [];
          let allowed = true;
          for (let dy = 0; dy < height && allowed; dy++)
            for (let dx = 0; dx < width; dx++) {
              const index = at(left + dx, top + dy, state.width);
              const entity = state.cells[index];
              if (
                !state.activeCells[index] ||
                entity?.kind === "obstacle" ||
                (entity?.kind === "stone" && entity.anchored)
              ) {
                allowed = false;
                break;
              }
              cells.push(index);
              if (entity?.kind === "stone") stones.push(index);
            }
          if (allowed && stones.length >= 2 && new Set(stones.map((index) => appearance(state.cells[index]!))).size > 1)
            patches.push({ cells, stones });
        }
    }
  return patches;
}

/** Preview one seeded, nontrivial stone permutation inside a fully active connected rectangle no larger than 3×3.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Preview one seeded, nontrivial stone permutation inside a fully active connected rectangle no larger than 3×3.
 * @example
 * ```ts
 * import { createNatureState, previewJumble } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * console.log(previewJumble(state).changed);
 * ```
 */
export function previewJumble(state: NatureState): JumblePreview {
  validateState(state);
  const candidates = candidatePatches(state);
  if (candidates.length === 0)
    return deepFreeze({
      patchCells: [],
      moves: [],
      changed: false,
      reason: "no-eligible-patch",
      cells: state.cells,
      randomStateAfter: state.randomState,
    });
  const [firstState, selectedIndex] = drawBelow(state.randomState, candidates.length);
  let randomState = firstState;
  const patch = candidates[selectedIndex]!;
  const shuffled = [...patch.stones];
  for (let index = shuffled.length - 1; index > 0; index--) {
    let chosen: number;
    [randomState, chosen] = drawBelow(randomState, index + 1);
    [shuffled[index], shuffled[chosen]] = [shuffled[chosen]!, shuffled[index]!];
  }
  if (
    shuffled.every(
      (index, indexInOrder) =>
        appearance(state.cells[index]!) === appearance(state.cells[patch.stones[indexInOrder]!]!),
    )
  ) {
    // A swap within identical colours would not change the puzzle.
    const first = 0;
    const second = shuffled.findIndex(
      (index) => appearance(state.cells[index]!) !== appearance(state.cells[shuffled[first]!]!),
    );
    [shuffled[first], shuffled[second]] = [shuffled[second]!, shuffled[first]!];
  }
  const cells = [...state.cells];
  const moves: NatureMove[] = [];
  for (let index = 0; index < patch.stones.length; index++) {
    const from = patch.stones[index]!;
    const to = shuffled[index]!;
    const entity = state.cells[from]!;
    cells[to] = entity;
    if (from !== to)
      moves.push({
        id: entity.id,
        from: { x: from % state.width, y: Math.floor(from / state.width) },
        to: { x: to % state.width, y: Math.floor(to / state.width) },
      });
  }
  for (const index of patch.stones) if (!shuffled.includes(index)) cells[index] = null;
  return deepFreeze({
    patchCells: patch.cells,
    moves,
    changed: moves.length > 0,
    cells,
    randomStateAfter: randomState,
  });
}

/** Preview an earthquake, with Combined always fracturing before its one jumble attempt.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param options - Validated native creation, authored challenge, or environment options described by this signature.
 * @returns Preview an earthquake, with Combined always fracturing before its one jumble attempt.
 * @example
 * ```ts
 * import { createNatureState, previewEarthquake } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * console.log(previewEarthquake(state,{kind:"fault"}).kind);
 * ```
 */
export function previewEarthquake(state: NatureState, options: EarthquakeOptions): EarthquakePreview {
  validateState(state);
  validateEarthquakeOptions(options);
  if (options.enabled === false)
    return deepFreeze({
      kind: options.kind,
      cells: state.cells,
      activeCells: state.activeCells,
      randomStateAfter: state.randomState,
    });
  let cells: readonly (NatureEntity | null)[] = state.cells;
  let activeCells = state.activeCells;
  let randomStateAfter = state.randomState;
  let fault: FaultPreview | undefined;
  let jumble: JumblePreview | undefined;
  if (options.kind === "fault" || options.kind === "combined") {
    fault = previewFault(state);
    cells = fault.cells;
    activeCells = fault.activeCells;
    randomStateAfter = fault.randomStateAfter;
  }
  if (options.kind === "jumble" || options.kind === "combined") {
    const jumbleState = fault
      ? freezeNatureState({ ...state, cells, activeCells, randomState: randomStateAfter })
      : state;
    jumble = previewJumble(jumbleState);
    cells = jumble.cells;
    randomStateAfter = jumble.randomStateAfter;
  }
  return deepFreeze({
    kind: options.kind,
    ...(fault ? { fault } : {}),
    ...(jumble ? { jumble } : {}),
    cells,
    activeCells,
    randomStateAfter,
  });
}

/** Commit one bounded environmental resolution; matching, gravity and score remain the host game's job.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param options - Validated native creation, authored challenge, or environment options described by this signature.
 * @returns Commit one bounded environmental resolution; matching, gravity and score remain the host game's job.
 * @example
 * ```ts
 * import { applyEarthquake, createNatureState } from "@johnmorrisdotca/houseki/nature";
 *
 * const state=createNatureState({width:4,height:4,seed:"docs"});
 * console.log(applyEarthquake(state,{kind:"fault"}).accepted);
 * ```
 */
export function applyEarthquake(state: NatureState, options: EarthquakeOptions): EnvironmentTransition {
  const preview = previewEarthquake(state, options);
  if (options.enabled === false) return { state, accepted: true, events: [], preview };
  const events: EnvironmentEvent[] = [];
  if (preview.fault)
    events.push(
      deepFreeze({
        type: "fault-opened",
        path: preview.fault.path,
        fracturedCells: preview.fault.fracturedCells,
        removedIds: preview.fault.removedIds,
      }),
    );
  if (preview.jumble)
    events.push(
      deepFreeze({
        type: "jumble-completed",
        changed: preview.jumble.changed,
        ...(preview.jumble.reason ? { reason: preview.jumble.reason } : {}),
        patchCells: preview.jumble.patchCells,
        moves: preview.jumble.moves,
      }),
    );
  if (events.length === 0) return { state, accepted: true, events: [], preview };
  if (
    preview.cells === state.cells &&
    preview.activeCells === state.activeCells &&
    preview.randomStateAfter === state.randomState
  )
    return { state, accepted: true, events: deepFreeze(events), preview };
  const next = freezeNatureState({
    ...state,
    cells: preview.cells,
    activeCells: preview.activeCells,
    randomState: preview.randomStateAfter,
  });
  return { state: next, accepted: true, events: deepFreeze(events), preview };
}
