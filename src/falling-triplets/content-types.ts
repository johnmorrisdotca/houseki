import type { ChallengeGoal, ChallengeHint, Colour, Gem, Triplet } from './types.js';

/** One authored text in English and Japanese.
 *
 * @example
 * ```ts
 * import type { LocalizedText } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: LocalizedText = {en:"A small puzzle",ja:"小さいパズル"};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface LocalizedText { readonly en: string; readonly ja: string }
/** The bounded engine measurements used to grade this campaign; they do not claim human difficulty.
 *
 * @example
 * ```ts
 * import { levelManifest } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { DifficultyMetrics } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const level=levelManifest[0];
 * const value: DifficultyMetrics = level.rawMetrics;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface DifficultyMetrics {
  readonly seededGoalSuccesses: number;
  readonly seededGoalSamples: number;
  readonly seededGoalSuccessRate: number;
  readonly legalChoiceBreadth: number;
  readonly goalPreservingChoices: number;
  readonly probedChoices: number;
  readonly goalPreservingChoiceShare: number;
  readonly forcedChoiceShare: number;
  readonly setupPiecesBeforePayoff: number;
  readonly requiredChainDepth: number;
  readonly witnessPlanningLength: number;
  readonly payoffDirections: number;
}
/** One authored native challenge with its stable id, setup, winning witness, measurements and review status.
 *
 * @example
 * ```ts
 * import { levelManifest } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { CampaignLevel } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const level=levelManifest[0];
 * const value: CampaignLevel = level;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CampaignLevel {
  readonly id: string;
  readonly seed: string;
  readonly number: number;
  readonly title: LocalizedText;
  /** SHA-256 fingerprint of the colour- and mirror-canonical duplicate key. */
  readonly canonicalKeyHash: string;
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly goal: ChallengeGoal;
  readonly board: readonly (Gem | null)[];
  readonly queue: readonly Triplet[];
  readonly witness: readonly ChallengeHint[];
  readonly tags: readonly string[];
  readonly rawMetrics: DifficultyMetrics;
  readonly score: number;
  readonly marks: 1 | 2 | 3 | 4 | 5;
  readonly gradingVersion: string;
  readonly proofStatus: 'engine-witness-verified';
  readonly reviewStatus: 'human-review-pending' | 'human-reviewed';
}
/** The ordered native campaign, its generation/grading revisions, checksum and measured levels.
 *
 * @example
 * ```ts
 * import type { CampaignManifest } from "@johnmorrisdotca/houseki/falling-triplets";
 * import { campaignManifest } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const value: CampaignManifest = campaignManifest;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CampaignManifest {
  readonly count: number;
  readonly candidatePoolCount: number;
  readonly generationRevision: string;
  readonly gradingVersion: string;
  readonly category: string;
  readonly curationPolicy: string;
  readonly orderingPolicy: string;
  readonly grading: Readonly<Record<string, unknown>>;
  readonly sampleBudget: number;
  readonly checksum: string;
  readonly levels: readonly CampaignLevel[];
}
/** One bilingual native lesson instruction and the corresponding action or tick step.
 *
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { TutorialStep } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const lesson=tutorialManifest[0];
 * const value: TutorialStep = lesson.steps[0];
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface TutorialStep { readonly instruction: LocalizedText; readonly action: string }
/** One bilingual native lesson with its authored setup, teaching steps and winning witness.
 *
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/falling-triplets";
 * import type { TutorialDefinition } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const lesson=tutorialManifest[0];
 * const value: TutorialDefinition = lesson;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface TutorialDefinition {
  readonly id: string;
  readonly title: LocalizedText;
  readonly objective: LocalizedText;
  readonly setup: {
    readonly board: readonly (Gem | null)[];
    readonly queue: readonly Triplet[];
    readonly goal: ChallengeGoal;
    readonly witness: readonly ChallengeHint[];
  };
  readonly steps: readonly TutorialStep[];
  readonly tags: readonly string[];
}
export type { Colour };
