import { contentData } from './content-data.js';
import { createGame } from './engine.js';
import type { MagneticCampaignLevel, MagneticCampaignManifest, MagneticLesson } from './content-types.js';
import type { GameState } from './types.js';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
}

export const campaignManifest: MagneticCampaignManifest = deepFreeze(contentData.campaign);
export const levelManifest: readonly MagneticCampaignLevel[] = campaignManifest.levels;
/** Alias kept alongside other Houseki campaign lesson APIs. */
export const tutorialManifest: readonly MagneticLesson[] = deepFreeze(contentData.lessons);
export const lessonManifest = tutorialManifest;

/** Finds a Magnetic Blocks campaign level by stable ID or one-based display number. */
export function getLevel(id: string | number): MagneticCampaignLevel | undefined {
  if (typeof id === 'number') return Number.isInteger(id) ? levelManifest.find(level => level.number === id) : undefined;
  return levelManifest.find(level => level.id === id);
}

/** Creates a fresh game with the authored rules, board, queue, and finite move budget. */
export function createLevel(id: string | number): GameState {
  const level = getLevel(id);
  if (!level) throw new RangeError(`Unknown Magnetic Blocks level: ${String(id)}`);
  return createGame(level.options);
}

/** Finds one of the three bilingual rules lessons by stable ID. */
export function getLesson(id: string): MagneticLesson | undefined { return tutorialManifest.find(lesson => lesson.id === id); }
export const getTutorial = getLesson;
/** Creates a fresh lesson game with its authored setup and queue. */
export function createLesson(id: string): GameState {
  const lesson = getLesson(id);
  if (!lesson) throw new RangeError(`Unknown Magnetic Blocks lesson: ${String(id)}`);
  return createGame(lesson.options);
}
