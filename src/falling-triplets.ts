export * from './falling-triplets/types.js';
export { findMatches, compactBoard } from './falling-triplets/match.js';
export { nextUint32, nextInt, seedState } from './falling-triplets/random.js';
export { createInputScheduler, setHeldAction, queueInputEdge, actionsForTick, releaseAllActions } from './falling-triplets/input.js';
export { createGame, createChallenge, restartGame, applyAction, advanceTicks, legalActions, statusOf, encodeGame, decodeGame, landingY } from './falling-triplets/engine.js';
