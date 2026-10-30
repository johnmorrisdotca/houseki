import type { ChallengeGoal } from './types.js';

/** Words in both languages.
 *
 * @example
 * ```ts
 * import type { LocalizedText } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: LocalizedText = { en: "Lines", ja: "列" };
 * console.log(value.en);
 * ```
 */
export interface LocalizedText { readonly en: string; readonly ja: string }
/** One graded level: its seed, goal and stones, and a line of moves the engine has been shown to win with.
 *
 * @example
 * ```ts
 * import { levelManifest } from "@johnmorrisdotca/houseki/tsumiki";
 * import type { TsumikiLevel } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: TsumikiLevel = levelManifest[0]!;
 * console.log(value.number);
 * ```
 */
export interface TsumikiLevel {
  readonly id: string;
  readonly number: number;
  readonly title: LocalizedText;
  readonly seed: string;
  readonly goal: ChallengeGoal;
  readonly stones: readonly number[];
  /** The winning moves, each `[slot, row, column]`. */
  readonly witness: readonly (readonly [number, number, number])[];
  readonly marks: 1 | 2 | 3 | 4 | 5;
}
/** One step of a lesson.
 *
 * @example
 * ```ts
 * import type { TsumikiTutorialStep } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: TsumikiTutorialStep = { instruction: { en: "Lay it", ja: "置きます" } };
 * console.log(value.instruction.en);
 * ```
 */
export interface TsumikiTutorialStep { readonly instruction: LocalizedText }
/** One bilingual lesson, with the game it is played on and a line of moves that wins it.
 *
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/tsumiki";
 * import type { TsumikiTutorial } from "@johnmorrisdotca/houseki/tsumiki";
 *
 * const value: TsumikiTutorial = tutorialManifest[0]!;
 * console.log(value.id);
 * ```
 */
export interface TsumikiTutorial {
  readonly id: string;
  readonly title: LocalizedText;
  readonly objective: LocalizedText;
  readonly seed: string;
  readonly goal: ChallengeGoal;
  readonly stones: readonly number[];
  readonly witness: readonly (readonly [number, number, number])[];
  readonly steps: readonly TsumikiTutorialStep[];
}
