import { drawPiece, seedState } from "./shapes.js";
import type {
  Action,
  ActionResult,
  Block,
  ChallengeGoal,
  ChallengeOptions,
  CreateOptions,
  GameEvent,
  GamePhase,
  GameSettings,
  GameState,
  GameStatus,
  Piece,
} from "./types.js";

/** The board's side: eight cells each way.
 * @example
 * ```ts
 * import { BOARD_SIDE } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(BOARD_SIDE);
 * ```
 */
export const BOARD_SIDE = 8;
const TRAY = 3;
/** How many times a tray none of whose pieces fits is dealt again before the game takes it as it is: a board can truly be full. */
const DEAL_TRIES = 8;

function fits(board: readonly (Block | null)[], piece: Piece, row: number, column: number): boolean {
  return piece.cells.every(([down, across]) => {
    const r = row + down;
    const c = column + across;
    return r >= 0 && c >= 0 && r < BOARD_SIDE && c < BOARD_SIDE && board[r * BOARD_SIDE + c] === null;
  });
}

function fitsAnywhere(board: readonly (Block | null)[], piece: Piece): boolean {
  for (let row = 0; row < BOARD_SIDE; row += 1)
    for (let column = 0; column < BOARD_SIDE; column += 1) if (fits(board, piece, row, column)) return true;
  return false;
}

/** A new tray: three pieces, dealt again a few times where none of them would fit. */
function dealTray(board: readonly (Block | null)[], random: number): readonly [readonly Piece[], number] {
  let state = random;
  let tray: Piece[] = [];
  for (let tries = 0; tries < DEAL_TRIES; tries += 1) {
    tray = [];
    for (let at = 0; at < TRAY; at += 1) {
      const [piece, next] = drawPiece(state);
      tray.push(piece);
      state = next;
    }
    if (tray.some((piece) => fitsAnywhere(board, piece))) break;
  }
  return [tray, state];
}

function goalReached(
  goal: ChallengeGoal | undefined,
  score: number,
  lines: number,
  board: readonly (Block | null)[],
): boolean {
  if (goal === undefined) return false;
  if (goal.kind === "score") return score >= goal.target;
  if (goal.kind === "lines") return lines >= goal.target;
  return !board.some((block) => block?.stone === true);
}

function start(settings: GameSettings): GameState {
  const board = new Array<Block | null>(BOARD_SIDE * BOARD_SIDE).fill(null);
  let nextId = 1;
  for (const cell of settings.stones ?? []) {
    board[cell] = { id: nextId, colour: "gold", stone: true };
    nextId += 1;
  }
  const [tray, random] = dealTray(board, seedState(settings.seed));
  return {
    game: "tsumiki",
    settings,
    board,
    tray,
    phase: "ready",
    score: 0,
    lines: 0,
    moves: 0,
    streak: 0,
    nextId,
    random,
    history: [],
  };
}

/** Makes a free game or a Daily: a Daily's seed is its date, so one date is one game for everybody.
 * @param options - A seed for a free game, or a mode and a date for a Daily.
 * @returns A new game, its tray dealt.
 *
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(createGame({ seed: "demo" }).tray.length);
 * ```
 */
export function createGame(options: CreateOptions = {}): GameState {
  const mode = options.mode ?? "relaxed";
  if (mode === "daily") {
    const date = options.dailyDate ?? new Date().toISOString().slice(0, 10);
    return start({ mode, seed: `daily:${date}`, width: BOARD_SIDE, height: BOARD_SIDE, dailyDate: date });
  }
  return start({ mode, seed: options.seed ?? "tsumiki", width: BOARD_SIDE, height: BOARD_SIDE });
}

/** Makes an authored game from its seed, goal and stones.
 * @param options - The game's identity, seed, goal and stones.
 * @returns A new game of that challenge.
 *
 * @example
 * ```ts
 * import { createChallenge } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(createChallenge({ id: "one", seed: "s", goal: { kind: "lines", target: 1 } }).settings.mode);
 * ```
 */
export function createChallenge(options: ChallengeOptions): GameState {
  return start({
    mode: "challenge",
    seed: options.seed,
    width: BOARD_SIDE,
    height: BOARD_SIDE,
    challengeId: options.id,
    goal: options.goal,
    ...(options.stones === undefined ? {} : { stones: options.stones }),
  });
}

/** Every placement allowed now, a bot's or a test's whole view of what can be done.
 * @param state - The game.
 * @returns Every placement allowed; empty once the game has ended.
 *
 * @example
 * ```ts
 * import { createGame, legalActions } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(legalActions(createGame({ seed: "demo" })).length > 0);
 * ```
 */
export function legalActions(state: GameState): readonly Action[] {
  if (state.phase !== "ready") return [];
  const actions: Action[] = [];
  state.tray.forEach((piece, slot) => {
    if (piece === null) return;
    for (let row = 0; row < BOARD_SIDE; row += 1)
      for (let column = 0; column < BOARD_SIDE; column += 1)
        if (fits(state.board, piece, row, column)) actions.push({ kind: "place", slot, row, column });
  });
  return actions;
}

/** Whether a piece from the tray can go with its top left on this cell, for a host to draw a ghost.
 * @param state - The game.
 * @param slot - The place in the tray: 0, 1 or 2.
 * @param row - The row of the piece's top left.
 * @param column - The column of the piece's top left.
 * @returns True when the piece is there and every cell it would take is free and on the board.
 *
 * @example
 * ```ts
 * import { canPlace, createGame } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(canPlace(createGame({ seed: "demo" }), 0, 0, 0));
 * ```
 */
export function canPlace(state: GameState, slot: number, row: number, column: number): boolean {
  const piece = state.tray[slot];
  return state.phase === "ready" && piece !== null && piece !== undefined && fits(state.board, piece, row, column);
}

/** The points a placement earns: one for each cell laid, and for clearing, ten a line times the lines cleared together, more for each placement in a row that clears. */
function pointsFor(cellsLaid: number, lines: number, streak: number): number {
  return cellsLaid + (lines === 0 ? 0 : 10 * lines * lines + 5 * (streak - 1));
}

/** Plays one move: a piece is laid, every full row and column clears together, and the tray fills when it is empty. A move that cannot be made is refused and changes nothing.
 * @param state - The game.
 * @param action - The placement.
 * @returns Whether it was taken, the state after it, and what happened; a refused move returns the same state.
 *
 * @example
 * ```ts
 * import { applyAction, createGame, legalActions } from "@johnmorrisdotca/houseki/tsumiki";
 * const game = createGame({ seed: "demo" });
 * console.log(applyAction(game, legalActions(game)[0]!).state.moves);
 * ```
 */
export function applyAction(state: GameState, action: Action): ActionResult {
  const piece = state.tray[action.slot];
  if (
    action.kind !== "place" ||
    !canPlace(state, action.slot, action.row, action.column) ||
    piece === null ||
    piece === undefined
  )
    return { accepted: false, state, events: [] };
  const board = [...state.board];
  let nextId = state.nextId;
  const laid: number[] = [];
  for (const [down, across] of piece.cells) {
    const cell = (action.row + down) * BOARD_SIDE + action.column + across;
    board[cell] = { id: nextId, colour: piece.colour, stone: false };
    nextId += 1;
    laid.push(cell);
  }
  const rows: number[] = [];
  const columns: number[] = [];
  for (let at = 0; at < BOARD_SIDE; at += 1) {
    if (
      Array.from({ length: BOARD_SIDE }, (_, across) => board[at * BOARD_SIDE + across]).every(
        (block) => block !== null,
      )
    )
      rows.push(at);
    if (Array.from({ length: BOARD_SIDE }, (_, down) => board[down * BOARD_SIDE + at]).every((block) => block !== null))
      columns.push(at);
  }
  for (const row of rows)
    for (let across = 0; across < BOARD_SIDE; across += 1) board[row * BOARD_SIDE + across] = null;
  for (const column of columns)
    for (let down = 0; down < BOARD_SIDE; down += 1) board[down * BOARD_SIDE + column] = null;
  const cleared = rows.length + columns.length;
  const streak = cleared > 0 ? state.streak + 1 : 0;
  const points = pointsFor(piece.cells.length, cleared, streak);
  const score = state.score + points;
  const lines = state.lines + cleared;
  const events: GameEvent[] = [{ kind: "placed", cells: laid }];
  if (cleared > 0) events.push({ kind: "lines", rows, columns, points });

  let tray: readonly (Piece | null)[] = state.tray.map((each, slot) => (slot === action.slot ? null : each));
  let random = state.random;
  if (tray.every((each) => each === null)) {
    const [dealt, after] = dealTray(board, random);
    tray = dealt;
    random = after;
    events.push({ kind: "dealt" });
  }

  let phase: GamePhase = "ready";
  if (goalReached(state.settings.goal, score, lines, board)) phase = "won";
  else if (!tray.some((each) => each !== null && fitsAnywhere(board, each)))
    phase = state.settings.mode === "challenge" ? "lost" : "finished";
  if (phase !== "ready") events.push({ kind: "ended", phase });
  return {
    accepted: true,
    state: {
      ...state,
      board,
      tray,
      phase,
      score,
      lines,
      moves: state.moves + 1,
      streak,
      nextId,
      random,
      history: [...state.history, action],
    },
    events,
  };
}

/** Advances nothing: a placement is whole the moment it is made. There so a host can treat this game as it treats the falling ones.
 * @param state - The game.
 * @param ticks - How many ticks would pass.
 * @returns The same state: nothing in this game moves on its own.
 *
 * @example
 * ```ts
 * import { advanceTicks, createGame } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(advanceTicks(createGame({ seed: "demo" }), 1).accepted);
 * ```
 */
export function advanceTicks(state: GameState, ticks: number): ActionResult {
  return { accepted: ticks >= 0, state, events: [] };
}

/** A game's figures: its phase, its score, its lines and how far along its goal it is.
 * @param state - The game.
 * @returns Its phase, score, lines, moves, stones left and how far along its goal it is.
 *
 * @example
 * ```ts
 * import { createGame, statusOf } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(statusOf(createGame({ seed: "demo" })).score);
 * ```
 */
export function statusOf(state: GameState): GameStatus {
  const stonesLeft = state.board.filter((block) => block?.stone === true).length;
  const goal = state.settings.goal;
  const total =
    goal === undefined ? 0 : goal.kind === "clear-stones" ? (state.settings.stones?.length ?? 0) : goal.target;
  const done =
    goal === undefined
      ? 0
      : goal.kind === "score"
        ? Math.min(total, state.score)
        : goal.kind === "lines"
          ? Math.min(total, state.lines)
          : total - stonesLeft;
  return {
    phase: state.phase,
    score: state.score,
    lines: state.lines,
    moves: state.moves,
    stonesLeft,
    goalDone: done,
    goalTotal: total,
  };
}
