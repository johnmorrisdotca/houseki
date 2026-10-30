import { applyAction, createChallenge, createGame } from './engine.js';
import type { Action, GameSettings, GameState } from './types.js';

/** A game's settings made again: a save names what it was, and the engine makes it afresh. */
function fresh(settings: GameSettings): GameState {
  if (settings.mode === 'challenge') return createChallenge({ id: settings.challengeId ?? '', seed: settings.seed, goal: settings.goal ?? { kind: 'clear-stones' }, ...(settings.stones === undefined ? {} : { stones: settings.stones }) });
  if (settings.mode === 'daily') return createGame({ mode: 'daily', dailyDate: settings.dailyDate ?? '' });
  return createGame({ mode: 'relaxed', seed: settings.seed });
}

/** The same game from its start, with the same settings.
 * @param state - The game to begin again.
 * @returns A new game with the same settings.
 *
 * @example
 * ```ts
 * import { createGame, restartGame } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(restartGame(createGame({ seed: "demo" })).moves);
 * ```
 */
export function restartGame(state: GameState): GameState {
  return fresh(state.settings);
}

/** A game as text: what it was and the moves made, never the score or the board, which a replay works out.
 * @param state - The game to keep.
 * @returns Text that decodeGame reads back to this state.
 *
 * @example
 * ```ts
 * import { createGame, encodeGame } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(encodeGame(createGame({ seed: "demo" })).length > 0);
 * ```
 */
export function encodeGame(state: GameState): string {
  return JSON.stringify({ v: 1, game: 'tsumiki', settings: state.settings, moves: state.history.map((action) => [action.slot, action.row, action.column]) });
}

/** Reads a save by playing it again from the start, so a save cannot claim what its moves do not do. Throws on anything else.
 * @param text - A save from encodeGame.
 * @returns The state its moves arrive at. Throws for anything that is not such a save.
 *
 * @example
 * ```ts
 * import { createGame, decodeGame, encodeGame } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(decodeGame(encodeGame(createGame({ seed: "demo" }))).moves);
 * ```
 */
export function decodeGame(text: string): GameState {
  const save = JSON.parse(text) as { v?: unknown; game?: unknown; settings?: GameSettings; moves?: unknown };
  if (save.v !== 1 || save.game !== 'tsumiki' || typeof save.settings !== 'object' || save.settings === null || !Array.isArray(save.moves)) throw new Error('not a saved game of Tsumiki');
  let state = fresh(save.settings);
  for (const move of save.moves as unknown[]) {
    if (!Array.isArray(move) || move.length !== 3 || !move.every((each) => Number.isInteger(each))) throw new Error('not a move of Tsumiki');
    const action: Action = { kind: 'place', slot: move[0] as number, row: move[1] as number, column: move[2] as number };
    const result = applyAction(state, action);
    if (!result.accepted) throw new Error('a move that was not allowed');
    state = result.state;
  }
  return state;
}
