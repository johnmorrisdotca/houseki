import { contentData } from './content-data.js';
import { createChallenge } from './engine.js';
import type { CollapseCampaignLevel, CollapseCampaignManifest, CollapseTutorialDefinition } from './content-types.js';
import type { GameState } from './types.js';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
}

export const campaignManifest: CollapseCampaignManifest = deepFreeze(contentData.campaign as unknown as CollapseCampaignManifest);
export const levelManifest: readonly CollapseCampaignLevel[] = campaignManifest.levels;
export const tutorialManifest: readonly CollapseTutorialDefinition[] = deepFreeze(contentData.tutorials as unknown as CollapseTutorialDefinition[]);

/** Find a challenge by its persistent content ID or current one-based display number. */
export function getLevel(id: string | number): CollapseCampaignLevel | undefined {
  if (typeof id === 'number') return Number.isInteger(id) ? levelManifest.find(level => level.number === id) : undefined;
  return levelManifest.find(level => level.id === id);
}

/** Construct a fresh engine-validated challenge from a content ID or display number. */
export function createLevel(id: string | number): GameState {
  const level = getLevel(id);
  if (!level) throw new RangeError(`Unknown Stone Collapse level: ${String(id)}`);
  return createChallenge({ id: level.id, seed: level.seed, width: level.width, height: level.height, colourCount: level.colourCount, ...(level.mask ? { mask: level.mask } : {}), initialBoard: level.board, goal: level.goal, moveLimit: level.moveLimit, witness: level.witness });
}

/** Find a persistent interactive lesson by its stable ID. */
export function getTutorial(id: string): CollapseTutorialDefinition | undefined { return tutorialManifest.find(tutorial => tutorial.id === id); }
