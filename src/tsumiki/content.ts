import { contentData } from './content-data.js';
import { createChallenge } from './engine.js';
import type { TsumikiLevel, TsumikiTutorial } from './content-types.js';
import type { GameState } from './types.js';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
}

/** The frozen graded levels, in order; array indices start at zero and display numbers at one.
 * @example
 * ```ts
 * import { levelManifest } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(levelManifest.length);
 * ```
 */
export const levelManifest: readonly TsumikiLevel[] = deepFreeze(contentData.levels as unknown as readonly TsumikiLevel[]);
/** The frozen bilingual lessons.
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(tutorialManifest.length);
 * ```
 */
export const tutorialManifest: readonly TsumikiTutorial[] = deepFreeze(contentData.tutorials as unknown as readonly TsumikiTutorial[]);

/** Looks a level up by its id or its display number; null where there is none.
 * @param idOrNumber - A level's id or display number.
 * @returns The level, or null where there is no such level.
 *
 * @example
 * ```ts
 * import { getLevel } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(getLevel(1)?.number);
 * ```
 */
export function getLevel(idOrNumber: string | number): TsumikiLevel | null {
  return levelManifest.find((level) => level.id === idOrNumber || level.number === idOrNumber) ?? null;
}

/** Makes a level's game; throws for a level that does not exist.
 * @param idOrNumber - A level's id or display number.
 * @returns A new game of that level. Throws where there is no such level.
 *
 * @example
 * ```ts
 * import { createLevel } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(createLevel(1).settings.mode);
 * ```
 */
export function createLevel(idOrNumber: string | number): GameState {
  const level = getLevel(idOrNumber);
  if (level === null) throw new Error('no such level of Tsumiki');
  return createChallenge({ id: level.id, seed: level.seed, goal: level.goal, stones: level.stones });
}

/** Looks a lesson up by its id; null where there is none.
 * @param id - A lesson's id.
 * @returns The lesson, or null where there is no such lesson.
 *
 * @example
 * ```ts
 * import { getTutorial } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(getTutorial("first-line")?.id);
 * ```
 */
export function getTutorial(id: string): TsumikiTutorial | null {
  return tutorialManifest.find((lesson) => lesson.id === id) ?? null;
}

/** Makes a lesson's game; throws for a lesson that does not exist.
 * @param id - A lesson's id.
 * @returns A new game of that lesson. Throws where there is no such lesson.
 *
 * @example
 * ```ts
 * import { createTutorial } from "@johnmorrisdotca/houseki/tsumiki";
 * console.log(createTutorial("first-line").settings.mode);
 * ```
 */
export function createTutorial(id: string): GameState {
  const lesson = getTutorial(id);
  if (lesson === null) throw new Error('no such lesson of Tsumiki');
  return createChallenge({ id: lesson.id, seed: lesson.seed, goal: lesson.goal, stones: lesson.stones });
}
