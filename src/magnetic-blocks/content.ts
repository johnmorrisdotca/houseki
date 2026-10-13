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

/** The frozen native campaign manifest with its ordering, revisions, checksum and measured levels.
 *
 * @example
 * ```ts
 * import { campaignManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * console.log(campaignManifest.count);
 * ```
 */
export const campaignManifest: MagneticCampaignManifest = deepFreeze(contentData.campaign);
/** The frozen ordered native levels; array indices start at zero and display numbers start at one.
 *
 * @example
 * ```ts
 * import { levelManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * console.log(levelManifest.length);
 * ```
 */
export const levelManifest: readonly MagneticCampaignLevel[] = campaignManifest.levels;
/** Alias kept alongside other Houseki campaign lesson APIs.
 *
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * console.log(tutorialManifest.length);
 * ```
 */
export const tutorialManifest: readonly MagneticLesson[] = deepFreeze(contentData.lessons);
/** The frozen native bilingual lessons and their authored teaching steps.
 *
 * @example
 * ```ts
 * import { lessonManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * console.log(lessonManifest.length);
 * ```
 */
export const lessonManifest = tutorialManifest;

/** Finds a Magnetic Blocks campaign level by stable ID or one-based display number.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Finds a Magnetic Blocks campaign level by stable ID or one-based display number. Returns undefined when the id or display number is absent.
 * @example
 * ```ts
 * import { getLevel } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * console.log(getLevel(1)?.id);
 * ```
 */
export function getLevel(id: string | number): MagneticCampaignLevel | undefined {
  if (typeof id === 'number') return Number.isInteger(id) ? levelManifest.find(level => level.number === id) : undefined;
  return levelManifest.find(level => level.id === id);
}

/** Creates a fresh game with the authored rules, board, queue, and finite move budget.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Creates a fresh game with the authored rules, board, queue, and finite move budget.
 * @example
 * ```ts
 * import { createLevel } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * console.log(createLevel(1).phase);
 * ```
 */
export function createLevel(id: string | number): GameState {
  const level = getLevel(id);
  if (!level) throw new RangeError(`Unknown Magnetic Blocks level: ${String(id)}`);
  return createGame(level.options);
}

/** Finds one of the three bilingual rules lessons by stable ID.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Finds one of the three bilingual rules lessons by stable ID. Returns undefined when the id or display number is absent.
 * @example
 * ```ts
 * import { getLesson, lessonManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * console.log(getLesson(lessonManifest[0].id)?.id);
 * ```
 */
export function getLesson(id: string): MagneticLesson | undefined { return tutorialManifest.find(lesson => lesson.id === id); }
/** Find a magnetic-block lesson by stable id; returns undefined when no lesson has that id.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Find a magnetic-block lesson by stable id; returns undefined when no lesson has that id. Returns undefined when the id or display number is absent.
 * @example
 * ```ts
 * import { getTutorial, lessonManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * console.log(getTutorial(lessonManifest[0].id)?.id);
 * ```
 */
export const getTutorial = getLesson;
/** Creates a fresh lesson game with its authored setup and queue.
 *
 * @param id - A stable content id, or the one-based display number when numbers are accepted.
 * @returns Creates a fresh lesson game with its authored setup and queue.
 * @example
 * ```ts
 * import { createLesson, lessonManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * console.log(createLesson(lessonManifest[0].id).phase);
 * ```
 */
export function createLesson(id: string): GameState {
  const lesson = getLesson(id);
  if (!lesson) throw new RangeError(`Unknown Magnetic Blocks lesson: ${String(id)}`);
  return createGame(lesson.options);
}
