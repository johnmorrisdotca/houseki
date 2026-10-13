import type { ChallengeGoal, Stone, StoneColour } from './types.js';

/** One authored text in English and Japanese.
 *
 * @example
 * ```ts
 * import type { LocalizedText } from "@johnmorrisdotca/houseki/stone-collapse";
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
 * import { levelManifest } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { CollapseDifficultyMetrics } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const level=levelManifest[0];
 * const value: CollapseDifficultyMetrics = level.rawMetrics;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CollapseDifficultyMetrics {
  readonly seededPlayoutSamples: number;
  readonly seededPlayoutSuccesses: number;
  readonly seededPlayoutSuccessRate: number;
  readonly legalGroupChoices: number;
  readonly witnessedDecisionCount: number;
  readonly sampledOrderFailureShare: number;
  readonly forcedSafeGroupShare: number;
  readonly averageGroupChoices: number;
  readonly witnessMoves: number;
  readonly moveBudgetSlack: number;
}
/** One authored native challenge with its stable id, setup, winning witness, measurements and review status.
 *
 * @example
 * ```ts
 * import { levelManifest } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { CollapseCampaignLevel } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const level=levelManifest[0];
 * const value: CollapseCampaignLevel = level;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CollapseCampaignLevel {
  readonly id: string;
  readonly number: number;
  readonly title: LocalizedText;
  readonly canonicalKeyHash: string;
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4;
  readonly mask?: readonly boolean[];
  readonly seed: string;
  readonly board: readonly (Stone | null)[];
  readonly goal: ChallengeGoal;
  readonly moveLimit: number;
  readonly witness: readonly (readonly number[])[];
  readonly tags: readonly string[];
  readonly rawMetrics: CollapseDifficultyMetrics;
  readonly score: number;
  readonly marks: 1 | 2 | 3 | 4 | 5;
  readonly gradingVersion: string;
  readonly proofStatus: 'engine-witness-verified';
  readonly reviewStatus: 'human-review-pending';
}
/** The ordered native campaign, its generation/grading revisions, checksum and measured levels.
 *
 * @example
 * ```ts
 * import type { CollapseCampaignManifest } from "@johnmorrisdotca/houseki/stone-collapse";
 * import { campaignManifest } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const value: CollapseCampaignManifest = campaignManifest;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CollapseCampaignManifest {
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
  readonly levels: readonly CollapseCampaignLevel[];
}
/** One bilingual native lesson instruction and the corresponding action or tick step.
 *
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { CollapseTutorialStep } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const lesson=tutorialManifest[0];
 * const value: CollapseTutorialStep = lesson.steps[0];
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CollapseTutorialStep { readonly instruction: LocalizedText; readonly action: string }
/** One bilingual native lesson with its authored setup, teaching steps and winning witness.
 *
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/stone-collapse";
 * import type { CollapseTutorialDefinition } from "@johnmorrisdotca/houseki/stone-collapse";
 *
 * const lesson=tutorialManifest[0];
 * const value: CollapseTutorialDefinition = lesson;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface CollapseTutorialDefinition {
  readonly id: string;
  readonly title: LocalizedText;
  readonly objective: LocalizedText;
  readonly setup: { readonly width: number; readonly height: number; readonly colourCount: 4; readonly board: readonly (Stone | null)[]; readonly goal: ChallengeGoal; readonly moveLimit?: number; readonly witness: readonly (readonly number[])[] };
  readonly steps: readonly CollapseTutorialStep[];
  readonly tags: readonly string[];
}
export interface CollapseContentData { readonly campaign: CollapseCampaignManifest; readonly tutorials: readonly CollapseTutorialDefinition[] }
export type { ChallengeGoal, Stone, StoneColour };
