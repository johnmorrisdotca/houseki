import { contentData } from './content-data.js';
import { createChallenge } from './engine.js';
import type { CampaignLevel, CampaignManifest, TutorialDefinition } from './content-types.js';
import type { GameState } from './types.js';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
}

export const campaignManifest: CampaignManifest = deepFreeze(contentData.campaign as unknown as CampaignManifest);
export const levelManifest: readonly CampaignLevel[] = campaignManifest.levels;
export const tutorialManifest: readonly TutorialDefinition[] = deepFreeze(contentData.tutorials as unknown as TutorialDefinition[]);

/** Find a level by stable content ID or its current one-based display number. */
export function getLevel(id: string | number): CampaignLevel | undefined {
  if (typeof id === 'number') return Number.isInteger(id) ? levelManifest.find(level => level.number === id) : undefined;
  return levelManifest.find(level => level.id === id);
}

/** Construct a fresh validated challenge state for a stable level ID or display number. */
export function createLevel(id: string | number): GameState {
  const level = getLevel(id);
  if (!level) throw new RangeError(`Unknown Falling Triplets level: ${String(id)}`);
  return createChallenge({
    seed: level.seed,
    width: level.width,
    height: level.height,
    colourCount: level.colourCount,
    board: level.board,
    queue: level.queue,
    goal: level.goal,
    witness: level.witness
  });
}

/** Find a lesson by its persistent ID. */
export function getTutorial(id: string): TutorialDefinition | undefined {
  return tutorialManifest.find(tutorial => tutorial.id === id);
}
