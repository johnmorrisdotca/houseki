export { StoneCollapseOptionsError } from './stone-collapse/validation.js';
export { createGame, createChallenge, applyAction, advanceTicks, legalActions, requestHint, undo, statusOf } from './stone-collapse/engine.js';
export { restartGame, encodeGame, decodeGame } from './stone-collapse/persistence.js';
export { campaignManifest, levelManifest, tutorialManifest, getLevel, createLevel, getTutorial } from './stone-collapse/content.js';
export type { Action, BoardPreset, BoardShape, ChallengeDefinition, ChallengeGoal, ChallengeOptions, CreateOptions, GameEvent, GameMode, GamePhase, GameState, GameStatus, RecordedAction, Settings, Stone, StoneColour, StoredTool, ToolInventory, Transition, UndoFrame } from './stone-collapse/types.js';
export type { CollapseCampaignLevel, CollapseCampaignManifest, CollapseDifficultyMetrics, CollapseTutorialDefinition, CollapseTutorialStep, LocalizedText } from './stone-collapse/content-types.js';
