import { drawBag, seedState } from "./random.js";
import type { Colour, CreateOptions, GameState, Gem, Mode, Piece, Settings, Transition } from "./types.js";

export const PRESETS = {
  compact: [5, 13],
  extraWide: [12, 13],
  narrow: [6, 13],
  standard: [8, 13],
  wide: [10, 13],
  tall: [8, 17],
  deep: [8, 32],
  large: [12, 24],
} as const;
export const RULES = "triplets-1" as const;
export const HIDDEN = 3;
export const MAX_VISIBLE_CELLS = 512;
export function validateDimensions(width: number, height: number): void {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 5 ||
    width > 16 ||
    height < 12 ||
    height > 32 ||
    width * height > MAX_VISIBLE_CELLS
  )
    throw new RangeError("Board must be 5–16 columns by 12–32 visible rows, with at most 512 cells");
}
export const emptyTransition = (state: GameState, reason: string): Transition => ({
  state,
  events: [],
  accepted: false,
  reason,
});
export const addr = (x: number, y: number, width: number): number => (y + HIDDEN) * width + x;
interface Drawn {
  readonly colours: readonly [Colour, Colour, Colour];
  readonly bag: readonly Colour[];
  readonly randomState: number;
}
export function drawTriplet(state: Pick<GameState, "bag" | "randomState" | "settings">): Drawn {
  let bag = state.bag;
  let randomState = state.randomState;
  const colours: Colour[] = [];
  for (let i = 0; i < 3; i++) {
    [bag, randomState] = drawBag(bag, randomState, state.settings.colourCount);
    colours.push(bag[bag.length - 1]!);
    bag = bag.slice(0, -1);
  }
  return { colours: colours as unknown as readonly [Colour, Colour, Colour], bag, randomState };
}
export function makeGem(state: Pick<GameState, "nextId">, colour: Colour, target = false): Gem {
  return { id: state.nextId, colour, ...(target ? { target: true } : {}) };
}
export function activeFromColours(state: GameState, colours: readonly [Colour, Colour, Colour], y = -3): Piece {
  return {
    gems: colours.map((colour, i) => makeGem({ nextId: state.nextId + i }, colour)) as unknown as Piece["gems"],
    x: Math.floor((state.settings.width - 1) / 2),
    y,
    orientation: 0,
    level:
      state.settings.mode === "arcade" || state.settings.mode === "daily"
        ? 1 + Math.floor(state.completedPieces / 30)
        : 1,
    descent: 0,
    lockTicks: 0,
    lockResets: 0,
    lockStarted: false,
  };
}
export function occupied(state: GameState, piece: Piece, x = piece.x, y = piece.y): boolean {
  return piece.gems.some((_, i) => {
    const cy = y + i;
    return (
      x < 0 ||
      x >= state.settings.width ||
      cy < -HIDDEN ||
      cy >= state.settings.height ||
      state.board[addr(x, cy, state.settings.width)] !== null
    );
  });
}
/** Returns the exact landing row for the current rigid triplet.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Returns the exact landing row for the current rigid triplet. Returns null when there is no active piece or applicable preview.
 * @example
 * ```ts
 * import { createGame, landingY } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * console.log(landingY(state));
 * ```
 */
export function landingY(state: GameState): number | null {
  if (!state.active) return null;
  let y = state.active.y;
  while (!occupied(state, state.active, state.active.x, y + 1)) y++;
  return y;
}
export function advanceBag(
  state: GameState,
): readonly [readonly Colour[], number, readonly (readonly [Colour, Colour, Colour])[]] {
  let bag = state.bag;
  let randomState = state.randomState;
  const next: (readonly [Colour, Colour, Colour])[] = [];
  for (let p = 0; p < 3; p++) {
    const draw = drawTriplet({ bag, randomState, settings: state.settings });
    bag = draw.bag;
    randomState = draw.randomState;
    next.push(draw.colours);
  }
  return [bag, randomState, next];
}
/** Creates a deterministic empty game with an active piece and three-piece preview.
 *
 * @param options - Validated native creation, authored challenge, or environment options described by this signature.
 * @returns Creates a deterministic empty game with an active piece and three-piece preview.
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * console.log(createGame({seed:"docs"}).phase);
 * ```
 */
export function createGame(options: CreateOptions = {}): GameState {
  if (options.preset !== undefined && !Object.hasOwn(PRESETS, options.preset))
    throw new RangeError("Unsupported board preset");
  const preset = PRESETS[options.preset ?? (options.mode === "daily" ? "narrow" : "standard")];
  const width = options.width ?? preset[0];
  const height = options.height ?? preset[1];
  validateDimensions(width, height);
  const requestedMode = (options as { mode?: string }).mode ?? "relaxed";
  if (!["relaxed", "arcade", "daily", "challenge"].includes(requestedMode)) throw new RangeError("Unsupported mode");
  if (requestedMode === "challenge")
    throw new RangeError("Use createChallenge with a validated starting board and finite queue");
  const mode = requestedMode as Exclude<Mode, "challenge">;
  const seed = options.seed ?? "houseki-falling-triplets";
  if (typeof seed !== "string" || seed.length < 1 || seed.length > 128)
    throw new RangeError("Seed must contain 1–128 characters");
  if (mode === "daily") {
    const timestamp = /^\d{4}-\d{2}-\d{2}$/.test(seed) ? Date.parse(`${seed}T00:00:00Z`) : Number.NaN;
    if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== seed)
      throw new RangeError("Daily seed must be a UTC YYYY-MM-DD date supplied by the host");
  }
  if (
    mode === "daily" &&
    (width !== 6 ||
      height !== 13 ||
      (options.colourCount ?? 5) !== 5 ||
      (options.pieceLimit !== undefined && options.pieceLimit !== 60))
  )
    throw new RangeError("Daily uses the fixed 6×13 well, five colours, and 60 pieces");
  const colourCount = options.colourCount ?? 5;
  const pieceLimit = mode === "daily" ? 60 : options.pieceLimit;
  if (pieceLimit !== undefined && (!Number.isInteger(pieceLimit) || pieceLimit < 1 || pieceLimit > 60))
    throw new RangeError("Piece limit must be an integer from 1 to 60");
  const settings: Settings = {
    mode,
    width,
    height,
    colourCount,
    seed,
    ...(pieceLimit === undefined ? {} : { pieceLimit }),
  };
  if (![4, 5, 6].includes(settings.colourCount)) throw new RangeError("Colour count must be 4, 5, or 6");
  const randomState = seedState(`falling-triplets|${RULES}|${seed}`);
  const initial: GameState = {
    game: "falling-triplets",
    rules: RULES,
    settings,
    board: Array(width * (height + HIDDEN)).fill(null),
    phase: "falling",
    active: null,
    next: [],
    bag: [],
    randomState,
    nextId: 1,
    score: 0,
    maxChain: 0,
    completedPieces: 0,
    elapsedTicks: 0,
    pieceTicks: 0,
    resolutionTick: 0,
    waves: [],
    assisted: false,
    hintsUsed: 0,
    witnessPathMatches: true,
    recording: [],
  };
  const first = drawTriplet(initial);
  let state: GameState = { ...initial, bag: first.bag, randomState: first.randomState, hintsUsed: 0 };
  const preview = advanceBag(state);
  state = {
    ...state,
    bag: preview[0],
    randomState: preview[1],
    active: activeFromColours(state, first.colours),
    next: preview[2],
    nextId: 4,
  };
  return state;
}
export const VALID_COLOURS = new Set(["red", "blue", "green", "gold", "purple", "teal"]);

export function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`)
      .join(",")}}`;
  return JSON.stringify(value) ?? "null";
}
