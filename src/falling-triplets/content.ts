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

/** The frozen native campaign manifest with its ordering, revisions, checksum and measured levels.
 *
 * @example
 * ```ts
 * import { campaignManifest } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * console.log(campaignManifest.count);
 * ```
 */
export const campaignManifest: CampaignManifest = deepFreeze(contentData.campaign as unknown as CampaignManifest);
/** The frozen ordered native levels; array indices start at zero and display numbers start at one.
 *
 * @example
 * ```ts
 * import { levelManifest } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * console.log(levelManifest.length);
 * ```
 */
export const levelManifest: readonly CampaignLevel[] = campaignManifest.levels;
/** The frozen native bilingual lessons and their authored teaching steps.
 *
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * console.log(tutorialManifest.length);
 * ```
 */
export const tutorialManifest: readonly TutorialDefinition[] = deepFreeze(contentData.tutorials as unknown as TutorialDefinition[]);

/** Find a level by stable content ID or its current one-based display number.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Find a level by stable content ID or its current one-based display number. Returns undefined when the id or display number is absent.
 * @example
 * ```ts
 * import { getLevel } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * console.log(getLevel(1)?.id);
 * ```
 */
export function getLevel(id: string | number): CampaignLevel | undefined {
  if (typeof id === 'number') return Number.isInteger(id) ? levelManifest.find(level => level.number === id) : undefined;
  return levelManifest.find(level => level.id === id);
}

/** Construct a fresh validated challenge state for a stable level ID or display number.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Construct a fresh validated challenge state for a stable level ID or display number.
 * @example
 * ```ts
 * import { createLevel } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * console.log(createLevel(1).phase);
 * ```
 */
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

/** Find a lesson by its persistent ID.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Find a lesson by its persistent ID. Returns undefined when the id or display number is absent.
 * @example
 * ```ts
 * import { getTutorial, tutorialManifest } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * console.log(getTutorial(tutorialManifest[0].id)?.id);
 * ```
 */
export function getTutorial(id: string): TutorialDefinition | undefined {
  return tutorialManifest.find(tutorial => tutorial.id === id);
}
