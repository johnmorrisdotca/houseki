export { MagneticBlocksOptionsError } from './magnetic-blocks/validation.js';
export { createGame, applyAction, advanceTicks, legalActions, statusOf } from './magnetic-blocks/engine.js';
export { encodeGame, decodeGame, restartGame } from './magnetic-blocks/persistence.js';
export { blockCells, canPlace, landingY, matchGroups, removeIds, calmGravity, magneticGravity, settle, impactSupportIds, blockBonds, MARK_TICKS, REMOVE_TICKS, GRAVITY_TICKS } from './magnetic-blocks/physics.js';
export type { Action, Block, Bond, Colour, CreateOptions, Floor, FloorSchedule, GameEvent, GameState, GameStatus, Gem, Goal, Mode, Phase, RecordedAction, Settings, Transition } from './magnetic-blocks/types.js';
