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

/** The frozen native campaign manifest with its ordering, revisions, checksum and measured levels.
 *
 * @example
 * ```ts
 * import { campaignManifest } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * console.log(campaignManifest.count);
 * ```
 */
export const campaignManifest: CollapseCampaignManifest = deepFreeze(contentData.campaign as unknown as CollapseCampaignManifest);
/** The frozen ordered native levels; array indices start at zero and display numbers start at one.
 *
 * @example
 * ```ts
 * import { levelManifest } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * console.log(levelManifest.length);
 * ```
 */
export const levelManifest: readonly CollapseCampaignLevel[] = campaignManifest.levels;
/** The frozen native bilingual lessons and their authored teaching steps.
 *
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * console.log(tutorialManifest.length);
 * ```
 */
export const tutorialManifest: readonly CollapseTutorialDefinition[] = deepFreeze(contentData.tutorials as unknown as CollapseTutorialDefinition[]);

/** Find a challenge by its persistent content ID or current one-based display number.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Find a challenge by its persistent content ID or current one-based display number. Returns undefined when the id or display number is absent.
 * @example
 * ```ts
 * import { getLevel } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * console.log(getLevel(1)?.id);
 * ```
 */
export function getLevel(id: string | number): CollapseCampaignLevel | undefined {
  if (typeof id === 'number') return Number.isInteger(id) ? levelManifest.find(level => level.number === id) : undefined;
  return levelManifest.find(level => level.id === id);
}

/** Construct a fresh engine-validated challenge from a content ID or display number.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Construct a fresh engine-validated challenge from a content ID or display number.
 * @example
 * ```ts
 * import { createLevel } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * console.log(createLevel(1).phase);
 * ```
 */
export function createLevel(id: string | number): GameState {
  const level = getLevel(id);
  if (!level) throw new RangeError(`Unknown Stone Collapse level: ${String(id)}`);
  return createChallenge({ id: level.id, seed: level.seed, width: level.width, height: level.height, colourCount: level.colourCount, ...(level.mask ? { mask: level.mask } : {}), initialBoard: level.board, goal: level.goal, moveLimit: level.moveLimit, witness: level.witness });
}

/** Find a persistent interactive lesson by its stable ID.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Find a persistent interactive lesson by its stable ID. Returns undefined when the id or display number is absent.
 * @example
 * ```ts
 * import { getTutorial, tutorialManifest } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * console.log(getTutorial(tutorialManifest[0].id)?.id);
 * ```
 */
export function getTutorial(id: string): CollapseTutorialDefinition | undefined { return tutorialManifest.find(tutorial => tutorial.id === id); }
