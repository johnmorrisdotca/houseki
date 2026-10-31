export {
  campaignManifest,
  createLesson,
  createLevel,
  getLesson,
  getLevel,
  getTutorial,
  lessonManifest,
  levelManifest,
  tutorialManifest,
} from "./magnetic-blocks/content.js";
export type {
  LocalizedText,
  MagneticCampaignLevel,
  MagneticCampaignManifest,
  MagneticDifficultyMetrics,
  MagneticLesson,
} from "./magnetic-blocks/content-types.js";
export { advanceTicks, applyAction, createGame, legalActions, statusOf } from "./magnetic-blocks/engine.js";
export { decodeGame, encodeGame, restartGame } from "./magnetic-blocks/persistence.js";
export {
  blockBonds,
  blockCells,
  calmGravity,
  canPlace,
  GRAVITY_TICKS,
  impactSupportIds,
  landingY,
  MARK_TICKS,
  magneticGravity,
  matchGroups,
  REMOVE_TICKS,
  removeIds,
  settle,
} from "./magnetic-blocks/physics.js";
export type {
  Action,
  Block,
  Bond,
  Colour,
  CreateOptions,
  Floor,
  FloorSchedule,
  GameEvent,
  GameState,
  GameStatus,
  Gem,
  Goal,
  Mode,
  Phase,
  RecordedAction,
  Settings,
  Transition,
} from "./magnetic-blocks/types.js";
export { MagneticBlocksOptionsError } from "./magnetic-blocks/validation.js";
