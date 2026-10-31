import type {
  ChallengeDefinition,
  CreateOptions,
  GameState,
  Settings,
  Stone,
  StoneColour,
  StoredTool,
  UndoFrame,
} from "./types.js";
import { neighbors, optionsFor, StoneCollapseOptionsError } from "./validation.js";

export const COLOURS: readonly StoneColour[] = ["red", "blue", "green", "gold", "purple", "teal"];
export const COLOURS_USED: readonly StoneColour[] = COLOURS;
export const RULES = "collapse-2" as const;
export const MARK_TICKS = 7;
export const REMOVE_TICKS = 6;
export const GRAVITY_TICKS = 9;
export const MAX_RECORDED_ACTIONS = 100_000;
export const MAX_RECORDED_TICKS = 10_000_000;

export function hashSeed(seed: string | number): number {
  let hash = 0x811c9dc5;
  const bytes = new TextEncoder().encode(String(seed));
  for (const byte of bytes) hash = Math.imul(hash ^ byte, 0x01000193) >>> 0;
  return hash || 0x6d2b79f5;
}
export function nextUint32(state: number): number {
  let value = state >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return value >>> 0;
}
export function nextInt(state: number, size: number): readonly [number, number] {
  const limit = Math.floor(0x1_0000_0000 / size) * size;
  let current = state >>> 0;
  for (;;) {
    const value = nextUint32(current);
    current = value;
    if (value < limit) return [value % size, current];
  }
}
export function drawColour(state: number, count: number): readonly [StoneColour, number] {
  const [index, next] = nextInt(state, count);
  return [COLOURS[index]!, next];
}

export function groupAt(
  board: readonly (Stone | null)[],
  settings: GameState["settings"],
  start: number,
): readonly number[] {
  const stone = board[start];
  if (!stone) return [];
  const mask = settings.mask!;
  const found = new Set<number>([start]);
  const pending = [start];
  while (pending.length) {
    const at = pending.pop()!;
    for (const next of neighbors(at, settings.width, settings.height, mask))
      if (!found.has(next) && board[next]?.colour === stone.colour) {
        found.add(next);
        pending.push(next);
      }
  }
  return [...found].sort((a, b) => a - b);
}
export function hasLegalGroup(board: readonly (Stone | null)[], settings: GameState["settings"]): boolean {
  return board.some((stone, index) => Boolean(stone && groupAt(board, settings, index).length >= 2));
}
export function canUseTool(state: GameState): boolean {
  return state.settings.tools && state.board.some(Boolean) && (state.inventory.bomb > 0 || state.inventory.pick > 0);
}
export function previewAt(state: GameState, tool: StoredTool, target: number): readonly number[] {
  if (
    !Number.isInteger(target) ||
    target < 0 ||
    target >= state.board.length ||
    !state.settings.mask[target] ||
    !state.board[target]
  )
    return [];
  if (tool === "pick") return [target];
  const { width, height, mask } = state.settings;
  const tx = target % width;
  const ty = Math.floor(target / width);
  const cells: number[] = [];
  for (let y = Math.max(0, ty - 1); y <= Math.min(height - 1, ty + 1); y++)
    for (let x = Math.max(0, tx - 1); x <= Math.min(width - 1, tx + 1); x++) {
      const index = y * width + x;
      if (mask[index] && state.board[index]) cells.push(index);
    }
  return cells;
}
export function clearToolSelection(_state: GameState): Pick<GameState, "selectedTool" | "toolTarget" | "toolPreview"> {
  return { selectedTool: null, toolTarget: null, toolPreview: Object.freeze([]) };
}
export function recordToolAction(
  state: GameState,
  action: GameState["recording"][number],
): readonly GameState["recording"][number][] | null {
  return state.recording.length >= MAX_RECORDED_ACTIONS ? null : Object.freeze([...state.recording, action]);
}
export function undoFrame(state: GameState): UndoFrame {
  return Object.freeze({
    board: state.board,
    score: state.score,
    moves: state.moves,
    removed: state.removed,
    randomState: state.randomState,
    nextId: state.nextId,
    usedFallback: state.usedFallback,
    finishAdjustmentApplied: state.finishAdjustmentApplied,
    selectedId: state.selectedId,
    selectedIds: state.selectedIds,
    previewScore: state.previewScore,
    witnessIndex: state.witnessIndex,
    inventory: state.inventory,
    toolProgress: state.toolProgress,
    toolAwardCursor: state.toolAwardCursor,
    selectedTool: state.selectedTool,
    toolTarget: state.toolTarget,
    toolPreview: state.toolPreview,
  });
}

/** @internal Constructs the generator's bounded valid-pair fallback for direct invariant checks. */
export function fallbackBoard(
  mask: readonly boolean[],
  width: number,
  height: number,
  colourCount: number,
): readonly (Stone | null)[] {
  const pair = mask.findIndex((on, index) => on && neighbors(index, width, height, mask).some((next) => next > index));
  if (pair < 0)
    throw new StoneCollapseOptionsError(
      "invalid-fallback-mask",
      "Fallback requires at least one orthogonal active-cell pair",
    );
  const partner = neighbors(pair, width, height, mask).find((next) => next > pair)!;
  let id = 1;
  return Object.freeze(
    mask.map((on, index) =>
      !on
        ? null
        : Object.freeze({
            id: id++,
            colour: index === pair || index === partner ? COLOURS_USED[0]! : COLOURS_USED[(index + 1) % colourCount]!,
          }),
    ),
  );
}
export function baseState(
  settings: Settings,
  board: readonly (Stone | null)[],
  randomState: number,
  challenge: ChallengeDefinition | null,
  usedFallback = false,
): GameState {
  const initialBoard = Object.freeze([...board]);
  const inventory = settings.tools ? { bomb: 1, pick: 1 } : { bomb: 0, pick: 0 };
  return {
    game: "stone-collapse",
    rules: RULES,
    settings: Object.freeze({ ...settings, mask: Object.freeze([...settings.mask]) }),
    challenge,
    initialBoard,
    board: initialBoard,
    phase: "ready",
    selectedId: null,
    selectedIds: Object.freeze([]),
    previewScore: 0,
    score: 0,
    moves: 0,
    removed: 0,
    randomState,
    nextId: Math.max(0, ...board.flatMap((stone) => (stone ? [stone.id] : []))) + 1,
    usedFallback,
    resolutionTick: 0,
    pendingIds: Object.freeze([]),
    gravityBoard: null,
    finishAdjustmentApplied: false,
    assisted: false,
    history: Object.freeze([]),
    witnessIndex: challenge ? 0 : -1,
    elapsedTicks: 0,
    recording: Object.freeze([]),
    inventory: Object.freeze(inventory),
    toolProgress: 0,
    toolAwardCursor: 0,
    selectedTool: null,
    toolTarget: null,
    toolPreview: Object.freeze([]),
  };
}
/** Creates a seeded full board; an all-singleton draw retries before using a checked adjacent pair.
 *
 * @param options - Validated native creation, authored challenge, or environment options described by this signature.
 * @returns Creates a seeded full board; an all-singleton draw retries before using a checked adjacent pair.
 * @example
 * ```ts
 * import { createGame } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * console.log(createGame({seed:"docs"}).phase);
 * ```
 */
export function createGame(options: CreateOptions = {}): GameState {
  const valid = optionsFor(options); // All settings are checked before drawing any random values.
  let randomState = hashSeed(`stone-collapse|${RULES}|${String(valid.seed)}`);
  let board: (Stone | null)[] = [];
  let nextId = 1;
  let usedFallback = false;
  let found = false;
  for (let attempt = 0; attempt < 128 && !found; attempt++) {
    const candidate: (Stone | null)[] = [];
    let id = 1;
    for (const active of valid.mask) {
      if (!active) candidate.push(null);
      else {
        const [colour, next] = drawColour(randomState, valid.colourCount);
        randomState = next;
        candidate.push({ id: id++, colour });
      }
    }
    board = candidate;
    nextId = id;
    const settings = { ...valid, mask: valid.mask } as GameState["settings"];
    found = hasLegalGroup(board, settings);
  }
  if (!found) {
    // Preserve the consumed stream and IDs; the first adjacent active pair is a guaranteed legal move.
    board = [...fallbackBoard(valid.mask, valid.width, valid.height, valid.colourCount)];
    nextId = valid.mask.filter(Boolean).length + 1;
    usedFallback = true;
  }
  const settings: Settings = { ...valid, mode: valid.mode, mask: valid.mask };
  const state = baseState(settings, board, randomState, null, usedFallback);
  return { ...state, nextId };
}
