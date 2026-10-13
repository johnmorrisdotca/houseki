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

/** The frozen native campaign manifest with its ordering, revisions, checksum and measured levels.
 *
 * @example
 * ```ts
 * import { campaignManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(campaignManifest.count);
 * ```
 */
export const campaignManifest: ChainCampaignManifest = deepFreeze(contentData.campaign as ChainCampaignManifest);
/** The frozen ordered native levels; array indices start at zero and display numbers start at one.
 *
 * @example
 * ```ts
 * import { levelManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(levelManifest.length);
 * ```
 */
export const levelManifest: readonly ChainCampaignLevel[] = campaignManifest.levels;
/** The frozen native bilingual lessons and their authored teaching steps.
 *
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(tutorialManifest.length);
 * ```
 */
export const tutorialManifest: readonly ChainTutorialDefinition[] = deepFreeze(contentData.tutorials as ChainTutorialDefinition[]);
/** The ordered native campaign, its generation/grading revisions, checksum and measured levels.
 *
 * @example
 * ```ts
 * import { shizenCampaignManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(shizenCampaignManifest.count);
 * ```
 */
export const shizenCampaignManifest: NatureChainCampaignManifest = deepFreeze((contentData.shizen ?? { ...contentData.campaign, count: 0, levels: [], checksum: '' }) as NatureChainCampaignManifest);
/** The frozen ordered native levels; array indices start at zero and display numbers start at one.
 *
 * @example
 * ```ts
 * import { shizenLevelManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(shizenLevelManifest.length);
 * ```
 */
export const shizenLevelManifest: readonly NatureChainCampaignLevel[] = shizenCampaignManifest.levels;
/** The ordered native campaign, its generation/grading revisions, checksum and measured levels.
 *
 * @example
 * ```ts
 * import { arashiCampaignManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(arashiCampaignManifest.count);
 * ```
 */
export const arashiCampaignManifest: NatureChainCampaignManifest = deepFreeze((contentData.arashi ?? { ...contentData.campaign, count: 0, levels: [], checksum: '' }) as NatureChainCampaignManifest);
/** The frozen ordered native levels; array indices start at zero and display numbers start at one.
 *
 * @example
 * ```ts
 * import { arashiLevelManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(arashiLevelManifest.length);
 * ```
 */
export const arashiLevelManifest: readonly NatureChainCampaignLevel[] = arashiCampaignManifest.levels;

/** Find a campaign challenge by stable content ID or its current one-based number.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Find a campaign challenge by stable content ID or its current one-based number. Returns undefined when the id or display number is absent.
 * @example
 * ```ts
 * import { getLevel } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(getLevel(1)?.id);
 * ```
 */
export function getLevel(id: string | number): ChainCampaignLevel | undefined {
  if (typeof id === 'number') return Number.isInteger(id) ? levelManifest.find(level => level.number === id) : undefined;
  return levelManifest.find(level => level.id === id);
}

/** Create a fresh engine-validated challenge from a stable content ID or display number.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Create a fresh engine-validated challenge from a stable content ID or display number.
 * @example
 * ```ts
 * import { createLevel } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(createLevel(1).phase);
 * ```
 */
export function createLevel(id: string | number): GameState {
  const level = getLevel(id);
  if (!level) throw new RangeError(`Unknown Colour Chains level: ${String(id)}`);
  return createChallenge({ id: level.id, seed: level.seed, width: level.width, height: level.height, colourCount: level.colourCount, board: level.board, queue: level.queue, goal: level.goal, witness: level.witness });
}

function createNatureLevel(level: NatureChainCampaignLevel): GameState {
  return createChallenge({ id: level.id, seed: level.seed, width: level.width, height: level.height, colourCount: level.colourCount, board: level.board, queue: level.queue, goal: level.goal, witness: level.witness, nature: true, ...(level.weather ? { weather: level.weather } : {}), ...(level.magneticQueue ? { magneticQueue: level.magneticQueue } : {}) });
}
/** Find a native Shizen challenge by stable id or one-based display number.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Find a native Shizen challenge by stable id or one-based display number. Returns undefined when the id or display number is absent.
 * @example
 * ```ts
 * import { getShizenLevel } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(getShizenLevel(1)?.id);
 * ```
 */
export function getShizenLevel(id: string | number): NatureChainCampaignLevel | undefined { return typeof id === 'number' ? shizenLevelManifest.find(level => level.number === id) : shizenLevelManifest.find(level => level.id === id); }
/** Create a validated native Shizen challenge using its stored setup and winning witness.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Create a validated native Shizen challenge using its stored setup and winning witness.
 * @example
 * ```ts
 * import { createShizenLevel } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(createShizenLevel(1).phase);
 * ```
 */
export function createShizenLevel(id: string | number): GameState { const level = getShizenLevel(id); if (!level) throw new RangeError(`Unknown Shizen Colour Chains level: ${String(id)}`); return createNatureLevel(level); }
/** Find a native Arashi challenge by stable id or one-based display number.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Find a native Arashi challenge by stable id or one-based display number. Returns undefined when the id or display number is absent.
 * @example
 * ```ts
 * import { getArashiLevel } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(getArashiLevel(1)?.id);
 * ```
 */
export function getArashiLevel(id: string | number): NatureChainCampaignLevel | undefined { return typeof id === 'number' ? arashiLevelManifest.find(level => level.number === id) : arashiLevelManifest.find(level => level.id === id); }
/** Create a validated native Arashi challenge using its stored setup and winning witness.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Create a validated native Arashi challenge using its stored setup and winning witness.
 * @example
 * ```ts
 * import { createArashiLevel } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(createArashiLevel(1).phase);
 * ```
 */
export function createArashiLevel(id: string | number): GameState { const level = getArashiLevel(id); if (!level) throw new RangeError(`Unknown Arashi Colour Chains level: ${String(id)}`); return createNatureLevel(level); }

/** Find a persistent interactive lesson by its stable ID.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Find a persistent interactive lesson by its stable ID. Returns undefined when the id or display number is absent.
 * @example
 * ```ts
 * import { getTutorial, tutorialManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * console.log(getTutorial(tutorialManifest[0].id)?.id);
 * ```
 */
export function getTutorial(id: string): ChainTutorialDefinition | undefined { return tutorialManifest.find(tutorial => tutorial.id === id); }
