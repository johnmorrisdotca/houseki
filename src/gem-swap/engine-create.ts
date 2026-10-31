import { COLOURS, findMatches, listLegalSwaps } from "./board.js";
import { GemSwapOptionsError, optionsFor } from "./engine-setup.js";
import { nextInt, seedState } from "./random.js";
import type { CreateOptions, GameState, Gem, GemColour, Settings } from "./types.js";

export function gem(id: number, colour: GemColour): Gem {
  return Object.freeze({ id, colour });
}
/** @internal Test seam for checking the built-in standard-board fallback witness. */
export function fallbackBoardForTest(settings: Settings): readonly (Gem | null)[] {
  if (
    settings.shape ||
    settings.mask.some((on) => !on) ||
    settings.width !== 8 ||
    settings.height !== 8 ||
    settings.colourCount !== 5
  )
    throw new GemSwapOptionsError(
      "unsupported-board-generation",
      "No validated stable fallback exists for these settings",
    );
  const board: (Gem | null)[] = [];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) board.push(gem(y * 8 + x + 1, COLOURS[(x + 2 * y) % 5]!));
  board[3 * 8 + 3] = gem(28, COLOURS[0]!);
  board[4 * 8 + 3] = gem(36, COLOURS[1]!);
  board[4 * 8 + 4] = gem(37, COLOURS[0]!);
  board[5 * 8 + 3] = gem(44, COLOURS[0]!);
  board[6 * 8 + 3] = gem(52, COLOURS[2]!);
  // Swapping (3,4) blue with (3,3) red completes the red row at y=4, x=2..4.
  return Object.freeze(board);
}

/** Creates a deterministic stable board with at least one legal normal swap.
 *
 * @param options - Validated native creation, authored challenge, or environment options described by this signature.
 * @returns Creates a deterministic stable board with at least one legal normal swap.
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * console.log(createGame({seed:"docs"}).phase);
 * ```
 */
export function createGame(options: CreateOptions = {}): GameState {
  const config = optionsFor(options);
  const { settings } = config;
  let randomState = seedState(settings.seed);
  let board: (Gem | null)[] = [];
  let nextId = 1;
  let found = false;
  for (let attempt = 0; attempt < 128 && !found; attempt++) {
    const candidate: (Gem | null)[] = [];
    let id = 1;
    let viable = true;
    for (let index = 0; index < settings.mask.length; index++) {
      if (!settings.mask[index]) {
        candidate.push(null);
        continue;
      }
      const x = index % settings.width;
      const y = Math.floor(index / settings.width);
      const allowed: number[] = [];
      for (let colour = 0; colour < settings.colourCount; colour++) {
        const sameLeft =
          x >= 2 &&
          settings.mask[index - 1] &&
          settings.mask[index - 2] &&
          candidate[index - 1]?.colour === COLOURS[colour] &&
          candidate[index - 2]?.colour === COLOURS[colour];
        const sameAbove =
          y >= 2 &&
          settings.mask[index - settings.width] &&
          settings.mask[index - 2 * settings.width] &&
          candidate[index - settings.width]?.colour === COLOURS[colour] &&
          candidate[index - 2 * settings.width]?.colour === COLOURS[colour];
        if (!sameLeft && !sameAbove) allowed.push(colour);
      }
      if (!allowed.length) {
        viable = false;
        break;
      }
      const [pick, next] = nextInt(randomState, allowed.length);
      randomState = next;
      candidate.push(gem(id++, COLOURS[allowed[pick]!]!));
    }
    if (viable) {
      board = candidate;
      nextId = id;
      const trial: GameState = {
        ...initialState(settings, board, randomState, id, false, config),
        usedFallback: false,
      };
      found = !findMatches(board, settings).length && listLegalSwaps(trial).length > 0;
    }
  }
  let usedFallback = false;
  if (!found) {
    board = [...fallbackBoardForTest(settings)];
    nextId = board.filter(Boolean).length + 1;
    usedFallback = true;
    const fallbackState: GameState = {
      ...initialState(settings, board, randomState, nextId, true, config),
      usedFallback: true,
    };
    if (findMatches(board, settings).length || listLegalSwaps(fallbackState).length === 0)
      throw new GemSwapOptionsError(
        "invalid-fallback",
        "The validated standard fallback failed its stability or legal-move check",
      );
  }
  return Object.freeze({ ...initialState(settings, Object.freeze(board), randomState, nextId, usedFallback, config) });
}

export function initialState(
  settings: Settings,
  board: readonly (Gem | null)[],
  randomState: number,
  nextId: number,
  usedFallback: boolean,
  config: ReturnType<typeof optionsFor>,
): GameState {
  const start = settings.tools ? 1 : 0;
  return {
    game: "gem-swap",
    rules: "swap-1",
    settings,
    initialOptions: config.initialOptions,
    mode: config.mode,
    dailyDate: config.dailyDate,
    challenge: config.challenge,
    seals: config.challenge?.seals ?? Object.freeze([]),
    sealsCleared: 0,
    elapsedMs: 0,
    outcome: null,
    clearedByColour: Object.freeze({ red: 0, blue: 0, green: 0, gold: 0, purple: 0, teal: 0 }),
    bestChain: 0,
    history: Object.freeze([]),
    board,
    phase: "ready",
    score: 0,
    moves: 0,
    swapCount: 0,
    randomState,
    nextId,
    usedFallback,
    wave: 0,
    resolutionTick: 0,
    pendingCells: Object.freeze([]),
    pendingSpecials: Object.freeze([]),
    gravityBoard: null,
    inventory: Object.freeze({ bomb: start, "row-clear": start, "colour-clear": start }),
    selectedTool: null,
    toolTarget: null,
    toolPreview: Object.freeze([]),
    toolProgress: 0,
    toolAwardCursor: 0,
    assisted: false,
    toolWaveActive: false,
    blackHoleCharges: 0,
    blackHoleProgress: 0,
    blackHole: null,
    blackHoleMovePending: false,
    blackHoleContactPending: false,
    pendingBlackHole: false,
  };
}
