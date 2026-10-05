export type { Action, BoardPreset, BoardShape, CreateOptions, GameEvent, GamePhase, GameState, GameStatus, Gem, GemColour, PlannedSpecial, Settings, SpecialKind, SwapAction, Transition } from './gem-swap/types.js';
export { GemSwapOptionsError, createGame, applyAction, advanceTicks, legalActions, statusOf } from './gem-swap/engine.js';
