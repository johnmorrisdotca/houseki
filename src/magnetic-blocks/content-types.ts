import type { Action, Colour, CreateOptions, Floor, GameState, Gem } from './types.js';

/** One authored text in English and Japanese.
 *
 * @example
 * ```ts
 * import type { LocalizedText } from "@johnmorrisdotca/houseki/magnetic-blocks";
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
 * import { levelManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * import type { MagneticDifficultyMetrics } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const level=levelManifest[0];
 * const value: MagneticDifficultyMetrics = level.metrics;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface MagneticDifficultyMetrics {
  readonly legalPlacementChoices: number;
  readonly setupPlacementChoices: number;
  readonly winningPlacementChoices: number;
  readonly availableFloorChoices: number;
  readonly witnessPlacements: number;
  readonly witnessFloorDecisions: number;
  readonly difficultyScore: number;
  /** Board context, recorded separately from strategic difficulty weights. */
  readonly occupiedCells?: number;
  readonly usableCells?: number;
  readonly boardCoverage?: number;
  readonly fullPlanTrials?: number;
  readonly fullPlanWins?: number;
  readonly fullPlanSuccessRate?: number;
  readonly setupDecisionPressure?: number;
  readonly interactingDependencyDepth?: number;
  readonly necessaryFloorDecisionShare?: number;
  readonly setupDecisionEvidence?: readonly { readonly step: number; readonly legalChoices: number; readonly preservingChoices: number; readonly pressure: number }[];
  readonly targetIdsClearedByPlacement?: readonly number[];
  readonly targetIdsRemainingAfterPlacement?: readonly number[];
  readonly targetIdsMovedByPlacement?: readonly number[];
  readonly minimumPlanSearch?: { readonly status: 'exact' | 'unknown'; readonly nodeBudget: number; readonly nodesVisited: number; readonly lowerBound: number; readonly upperBound?: number };
}
export type MagneticDifficultyBand = 'entry' | 'easy' | 'intermediate' | 'hard' | 'expert';
/** One authored native challenge with its stable id, setup, winning witness, measurements and review status.
 *
 * @example
 * ```ts
 * import { levelManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * import type { MagneticCampaignLevel } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const level=levelManifest[0];
 * const value: MagneticCampaignLevel = level;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface MagneticCampaignLevel {
  readonly id: string;
  readonly number: number;
  readonly title: LocalizedText;
  readonly objective: LocalizedText;
  readonly options: CreateOptions;
  readonly witness: readonly Action[];
  readonly witnessResult: 'won';
  readonly metrics: MagneticDifficultyMetrics;
  readonly marks: 1 | 2 | 3 | 4 | 5;
  readonly tags: readonly string[];
  readonly canonicalKey: string;
  readonly canonicalKeyHash: string;
  readonly score: number;
  readonly gradingVersion: string;
  readonly proofStatus: 'engine-witness-verified';
  readonly reviewStatus: 'human-review-pending' | 'human-reviewed';
  readonly band?: MagneticDifficultyBand;
  readonly counterfactual?: { readonly kind: 'floor-choice' | 'floor-schedule' | 'floor-switch'; readonly alternative: string; readonly result: 'won' | 'lost' | 'finished' };
  readonly impactEvidence?: { readonly removedSupportCount: number; readonly disabledImpactResult: 'won' };
}
/** The ordered native campaign, its generation/grading revisions, checksum and measured levels.
 *
 * @example
 * ```ts
 * import type { MagneticCampaignManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * import { campaignManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const value: MagneticCampaignManifest = campaignManifest;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface MagneticCampaignManifest {
  readonly count: number;
  readonly currentCount?: number;
  readonly candidateCount: number;
  readonly generationRevision: string;
  readonly gradingVersion: string;
  readonly difficultyFormula: string;
  readonly normalization: string;
  readonly marksFormula: string;
  readonly checksum: string;
  readonly orderingPolicy: string;
  readonly levels: readonly MagneticCampaignLevel[];
  readonly bands?: readonly { readonly id: MagneticDifficultyBand; readonly count: number; readonly first: number; readonly last: number }[];
}
/** One bilingual native lesson with its authored setup, teaching steps and winning witness.
 *
 * @example
 * ```ts
 * import type { MagneticLesson } from "@johnmorrisdotca/houseki/magnetic-blocks";
 * import { lessonManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";
 *
 * const value: MagneticLesson = lessonManifest[0];
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface MagneticLesson {
  readonly id: string;
  readonly title: LocalizedText;
  readonly objective: LocalizedText;
  readonly options: CreateOptions;
  readonly witness: readonly Action[];
  readonly instruction: readonly LocalizedText[];
}
export interface MagneticContentData {
  readonly campaign: MagneticCampaignManifest;
  readonly lessons: readonly MagneticLesson[];
}
export type { Action, Colour, CreateOptions, Floor, GameState, Gem };
