import { gemSwapCampaignRows, gemSwapLessonRows } from "./content.data.js";
import type { Action, CreateOptions, ReplayOperation } from "./types.js";

/** The existing campaign’s human-review-pending status; an engine witness is not human review.
 *
 * @example
 * ```ts
 * import type { GemSwapReviewStatus } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: GemSwapReviewStatus = "human-review-pending";
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type GemSwapReviewStatus = "human-review-pending";
/** One authored native challenge with its stable id, setup, winning witness, measurements and review status.
 *
 * @example
 * ```ts
 * import { GEM_SWAP_CAMPAIGN } from "@johnmorrisdotca/houseki/gem-swap";
 * import type { GemSwapCampaignLevel } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const level=GEM_SWAP_CAMPAIGN[0];
 * const value: GemSwapCampaignLevel = level;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GemSwapCampaignLevel {
  readonly id: string;
  readonly number: number;
  readonly title: { readonly en: string; readonly ja: string };
  readonly options: CreateOptions;
  readonly width: number;
  readonly height: number;
  readonly colourCount: number;
  readonly seed: number;
  readonly challenge: NonNullable<CreateOptions["challenge"]>;
  readonly witness: readonly ReplayOperation[];
  readonly canonicalKeyHash: string;
  readonly tags: readonly string[];
  readonly rawMetrics: Readonly<Record<string, number>>;
  readonly difficultyScore: number;
  readonly difficultyMarks: number;
  readonly gradingVersion: string;
  readonly proofStatus: "engine-witness-verified";
  readonly reviewStatus: GemSwapReviewStatus;
}
/** One bilingual native lesson instruction and the corresponding action or tick step.
 *
 * @example
 * ```ts
 * import type { GemSwapLessonStep } from "@johnmorrisdotca/houseki/gem-swap";
 * import { GEM_SWAP_LESSONS } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: GemSwapLessonStep = GEM_SWAP_LESSONS[0].steps[0];
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export type GemSwapLessonStep =
  | {
      readonly kind: "action";
      readonly id: string;
      readonly action: Action;
      readonly accepted: boolean;
      readonly reason?: string;
      readonly event?: string;
      readonly cell?: number;
      readonly text: { readonly en: string; readonly ja: string };
    }
  | {
      readonly kind: "ticks";
      readonly id: string;
      readonly count: number;
      readonly event?: string;
      readonly outcome?: string;
      readonly cell?: number;
      readonly text: { readonly en: string; readonly ja: string };
    };
/** One bilingual native lesson with its authored setup, teaching steps and winning witness.
 *
 * @example
 * ```ts
 * import type { GemSwapLesson } from "@johnmorrisdotca/houseki/gem-swap";
 * import { GEM_SWAP_LESSONS } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const value: GemSwapLesson = GEM_SWAP_LESSONS[0];
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface GemSwapLesson {
  readonly id: string;
  readonly title: { readonly en: string; readonly ja: string };
  readonly initial: CreateOptions;
  readonly steps: readonly GemSwapLessonStep[];
  readonly witness: readonly ReplayOperation[];
  readonly reviewStatus: GemSwapReviewStatus;
}
function freezeContent<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const item of Object.values(value as Record<string, unknown>)) freezeContent(item);
  }
  return value;
}
/** The stored Gem Swap campaign generation revision.
 *
 * @example
 * ```ts
 * import { GENERATION_REVISION } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * console.log(GENERATION_REVISION);
 * ```
 */
export const GENERATION_REVISION = "gem-swap-campaign-1.3.0";
/** The measurement/normalization revision used to grade Gem Swap challenges.
 *
 * @example
 * ```ts
 * import { GRADING_VERSION } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * console.log(GRADING_VERSION);
 * ```
 */
export const GRADING_VERSION = "swap-choice-forgiveness-1";
/** The fixed number of seeded playout samples used in the stored Gem Swap grading.
 *
 * @example
 * ```ts
 * import { SAMPLE_BUDGET } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * console.log(SAMPLE_BUDGET);
 * ```
 */
export const SAMPLE_BUDGET = 24;
/** The bounded Gem Swap metric weights used in the recorded grading formula.
 *
 * @example
 * ```ts
 * import { GRADING_WEIGHTS } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * console.log(Object.keys(GRADING_WEIGHTS));
 * ```
 */
export const GRADING_WEIGHTS = freezeContent({
  seededPlayoutDifficulty: 30,
  choiceDifficulty: 18,
  objectiveCoordination: 12,
  chainDepth: 10,
  witnessLength: 25,
  specialCombination: 5,
});
/** The stored Gem Swap campaign content fingerprint.
 *
 * @example
 * ```ts
 * import { CAMPAIGN_CHECKSUM } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * console.log(CAMPAIGN_CHECKSUM);
 * ```
 */
export const CAMPAIGN_CHECKSUM = "eb7c54a583db428d596b8fbdab0d63a9ad39ad5b9e39948dc4ccab84ba1196aa";
/** The number of stored Gem Swap campaign challenges.
 *
 * @example
 * ```ts
 * import { CAMPAIGN_COUNT } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * console.log(CAMPAIGN_COUNT);
 * ```
 */
export const CAMPAIGN_COUNT = 50;

/** The frozen measured Gem Swap challenges with stable ids, setups, witnesses and review status.
 *
 * @example
 * ```ts
 * import { GEM_SWAP_CAMPAIGN } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * console.log(GEM_SWAP_CAMPAIGN.length);
 * ```
 */
export const GEM_SWAP_CAMPAIGN: readonly GemSwapCampaignLevel[] = freezeContent(gemSwapCampaignRows);
/** The frozen bilingual Gem Swap lessons with setup, teaching steps and witnesses.
 *
 * @example
 * ```ts
 * import { GEM_SWAP_LESSONS } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * console.log(GEM_SWAP_LESSONS.length);
 * ```
 */
export const GEM_SWAP_LESSONS: readonly GemSwapLesson[] = freezeContent(gemSwapLessonRows);
