import { contentData } from './content-data.js';
import { createChallenge } from './challenge.js';
import type { ChainCampaignLevel, ChainCampaignManifest, ChainTutorialDefinition, NatureChainCampaignLevel, NatureChainCampaignManifest } from './content-types.js';
import type { GameState } from './types.js';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
}

export const campaignManifest: ChainCampaignManifest = deepFreeze(contentData.campaign as ChainCampaignManifest);
export const levelManifest: readonly ChainCampaignLevel[] = campaignManifest.levels;
export const tutorialManifest: readonly ChainTutorialDefinition[] = deepFreeze(contentData.tutorials as ChainTutorialDefinition[]);
export const shizenCampaignManifest: NatureChainCampaignManifest = deepFreeze((contentData.shizen ?? { ...contentData.campaign, count: 0, levels: [], checksum: '' }) as NatureChainCampaignManifest);
export const shizenLevelManifest: readonly NatureChainCampaignLevel[] = shizenCampaignManifest.levels;
export const arashiCampaignManifest: NatureChainCampaignManifest = deepFreeze((contentData.arashi ?? { ...contentData.campaign, count: 0, levels: [], checksum: '' }) as NatureChainCampaignManifest);
export const arashiLevelManifest: readonly NatureChainCampaignLevel[] = arashiCampaignManifest.levels;

/** Find a campaign challenge by stable content ID or its current one-based number. */
export function getLevel(id: string | number): ChainCampaignLevel | undefined {
  if (typeof id === 'number') return Number.isInteger(id) ? levelManifest.find(level => level.number === id) : undefined;
  return levelManifest.find(level => level.id === id);
}

/** Create a fresh engine-validated challenge from a stable content ID or display number. */
export function createLevel(id: string | number): GameState {
  const level = getLevel(id);
  if (!level) throw new RangeError(`Unknown Colour Chains level: ${String(id)}`);
  return createChallenge({ id: level.id, seed: level.seed, width: level.width, height: level.height, colourCount: level.colourCount, board: level.board, queue: level.queue, goal: level.goal, witness: level.witness });
}

function createNatureLevel(level: NatureChainCampaignLevel): GameState {
  return createChallenge({ id: level.id, seed: level.seed, width: level.width, height: level.height, colourCount: level.colourCount, board: level.board, queue: level.queue, goal: level.goal, witness: level.witness, nature: true, ...(level.weather ? { weather: level.weather } : {}), ...(level.magneticQueue ? { magneticQueue: level.magneticQueue } : {}) });
}
export function getShizenLevel(id: string | number): NatureChainCampaignLevel | undefined { return typeof id === 'number' ? shizenLevelManifest.find(level => level.number === id) : shizenLevelManifest.find(level => level.id === id); }
export function createShizenLevel(id: string | number): GameState { const level = getShizenLevel(id); if (!level) throw new RangeError(`Unknown Shizen Colour Chains level: ${String(id)}`); return createNatureLevel(level); }
export function getArashiLevel(id: string | number): NatureChainCampaignLevel | undefined { return typeof id === 'number' ? arashiLevelManifest.find(level => level.number === id) : arashiLevelManifest.find(level => level.id === id); }
export function createArashiLevel(id: string | number): GameState { const level = getArashiLevel(id); if (!level) throw new RangeError(`Unknown Arashi Colour Chains level: ${String(id)}`); return createNatureLevel(level); }

/** Find a persistent interactive lesson by its stable ID. */
export function getTutorial(id: string): ChainTutorialDefinition | undefined { return tutorialManifest.find(tutorial => tutorial.id === id); }
