import type { ChallengeGoal, Colour, Gem, Orientation, WitnessStep } from './types.js';

/** One authored text in English and Japanese.
 *
 * @example
 * ```ts
 * import type { LocalizedText } from "@johnmorrisdotca/houseki/colour-chains";
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
 * import { levelManifest } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { ChainDifficultyMetrics } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const level=levelManifest[0];
 * const value: ChainDifficultyMetrics = level.rawMetrics;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChainDifficultyMetrics {
  readonly placementProbes: number;
  readonly legalPlacements: number;
  readonly goalPreservingPlacements: number;
  readonly forcedPlacementShare: number;
  readonly seededPlayoutSamples: number;
  readonly seededPlayoutQueueDepth: number;
  /** Number of pair placements randomized in each seeded playout. */
  readonly seededPlayoutVariablePrefixLength?: number;
  /** Number of later witnessed placements held fixed in each seeded playout. */
  readonly seededPlayoutFixedSuffixLength?: number;
  readonly seededPlayoutPlacements?: number;
  readonly fullPlanSuccessRate?: number;
  readonly witnessedPlanPlacements?: number;
  readonly singleStepDeviationProbes?: number;
  readonly singleStepDeviationWins?: number;
  readonly singleStepDeviationDeadEnds?: number;
  readonly branchingDecisionPoints?: number;
  readonly forcedSafeSteps?: number;
  readonly forcedSafeShare?: number;
  readonly branchingShare?: number;
  readonly consequentialDecisionShare?: number;
  readonly setupDeviationProbes?: number;
  readonly setupDeviationLosses?: number;
  readonly setupDeviationLossShare?: number;
  readonly verifiedSetupDependencyShare?: number;
  readonly seededPlayoutSuccesses: number;
  readonly seededPlayoutSuccessRate: number;
  readonly setupPairsBeforePayoff: number;
  readonly requiredSetupPairs: number;
  readonly verifiedSetupDependencies: number;
  /** Number of pre-payoff steps checked by exhaustive single-step deviations. */
  readonly setupDependencyProbeSteps?: number;
  /** A verified alternate far-side first placement followed by the witnessed recovery pair. */
  readonly verifiedWrongFirstRecovery?: number;
  readonly goalTargets?: number;
  /** Number of distinct target-color components or explicitly required chain waves. */
  readonly goalDependencyCount?: number;
  readonly occupiedCells?: number;
  readonly usableCells?: number;
  readonly boardCoverage?: number;
  readonly goalCoordinationShare?: number;
  readonly cascadeShare?: number;
  readonly weatherEventCount?: number;
  readonly weatherDependency?: number;
  readonly mechanicOffCounterfactualWon?: boolean;
  readonly mechanicOffCounterfactualKind?: 'nature' | 'magnetism' | 'weather';
  readonly mechanicOffCounterfactualPhase?: string;
  readonly rawDifficultyScore?: number;
  readonly requiredChainDepth: number;
  /** Highest chain observed in the exact authored witness. */
  readonly witnessedChainDepth?: number;
  /** Highest chain seen in the bounded random-play sample; not a requirement claim. */
  readonly observedPotentialChainDepth?: number;
  readonly requiredRotations: number;
  readonly requiredWallKicks: number;
  readonly splitLandingDependencies: number;
  /** Number of committed pair placements in the supplied winning plan. */
  readonly planningLength: number;
}
/** One authored native challenge with its stable id, setup, winning witness, measurements and review status.
 *
 * @example
 * ```ts
 * import { levelManifest } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { ChainCampaignLevel } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const level=levelManifest[0];
 * const value: ChainCampaignLevel = level;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChainCampaignLevel {
  readonly id: string;
  readonly number: number;
  readonly title: LocalizedText;
  readonly objective?: LocalizedText;
  readonly nature?: true;
  readonly weather?: 'frequent';
  readonly magneticQueue?: readonly (readonly [boolean, boolean])[];
  readonly canonicalKeyHash: string;
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly seed: string;
  readonly board: readonly (Gem | null)[];
  readonly queue: readonly (readonly [Colour, Colour])[];
  readonly goal: ChallengeGoal;
  readonly witness: readonly WitnessStep[];
  readonly tags: readonly string[];
  readonly rawMetrics: ChainDifficultyMetrics;
  readonly score: number;
  readonly marks: 1 | 2 | 3 | 4 | 5;
  readonly gradingVersion: string;
  readonly proofStatus: 'engine-witness-verified';
  readonly reviewStatus: 'human-review-pending' | 'human-reviewed';
  readonly band?: 'entry' | 'easy' | 'intermediate' | 'hard' | 'expert';
  readonly rawDifficultyScore?: number;
  readonly normalizationCategory?: string;
}
/** One authored native challenge with its stable id, setup, winning witness, measurements and review status.
 *
 * @example
 * ```ts
 * import type { NatureChainCampaignLevel } from "@johnmorrisdotca/houseki/colour-chains";
 * import { shizenLevelManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: NatureChainCampaignLevel = shizenLevelManifest[0];
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface NatureChainCampaignLevel extends ChainCampaignLevel {
  readonly objective: LocalizedText;
  readonly nature: true;
  readonly weather?: 'frequent';
  readonly magneticQueue?: readonly (readonly [boolean, boolean])[];
  readonly weatherTrace?: readonly Readonly<Record<string, unknown>>[];
}
/** The ordered native campaign, its generation/grading revisions, checksum and measured levels.
 *
 * @example
 * ```ts
 * import type { ChainCampaignManifest } from "@johnmorrisdotca/houseki/colour-chains";
 * import { campaignManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: ChainCampaignManifest = campaignManifest;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChainCampaignManifest {
  readonly count: number;
  readonly candidatePoolCount: number;
  readonly generationRevision: string;
  readonly gradingVersion: string;
  readonly category: string;
  readonly curationPolicy: string;
  readonly orderingPolicy: string;
  readonly grading: Readonly<Record<string, number | string>>;
  readonly sampleBudget: number;
  readonly checksum: string;
  readonly levels: readonly ChainCampaignLevel[];
}
/** An inclusive one-based range in a measured native nature-campaign difficulty band.
 *
 * @example
 * ```ts
 * import type { NatureCampaignBand } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: NatureCampaignBand = {id:"entry",count:1,first:1,last:1};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface NatureCampaignBand { readonly id: 'entry' | 'easy' | 'intermediate' | 'hard' | 'expert'; readonly count: number; readonly first: number; readonly last: number }
/** The ordered native campaign, its generation/grading revisions, checksum and measured levels.
 *
 * @example
 * ```ts
 * import type { NatureChainCampaignManifest } from "@johnmorrisdotca/houseki/colour-chains";
 * import { shizenCampaignManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: NatureChainCampaignManifest = shizenCampaignManifest;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface NatureChainCampaignManifest extends Omit<ChainCampaignManifest, 'levels'> { readonly levels: readonly NatureChainCampaignLevel[]; readonly bands?: readonly NatureCampaignBand[] }
/** One bilingual native lesson instruction and the corresponding action or tick step.
 *
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { ChainTutorialStep } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const lesson=tutorialManifest[0];
 * const value: ChainTutorialStep = lesson.steps[0];
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChainTutorialStep { readonly instruction: LocalizedText; readonly action: string }
/** One bilingual native lesson with its authored setup, teaching steps and winning witness.
 *
 * @example
 * ```ts
 * import { tutorialManifest } from "@johnmorrisdotca/houseki/colour-chains";
 * import type { ChainTutorialDefinition } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const lesson=tutorialManifest[0];
 * const value: ChainTutorialDefinition = lesson;
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChainTutorialDefinition {
  readonly id: string;
  readonly title: LocalizedText;
  readonly objective: LocalizedText;
  readonly setup: { readonly board: readonly (Gem | null)[]; readonly queue: readonly (readonly [Colour, Colour])[]; readonly goal: ChallengeGoal; readonly witness: readonly WitnessStep[] };
  readonly steps: readonly ChainTutorialStep[];
  readonly tags: readonly string[];
}
/** The stored native Colour Chains campaign, lessons and optional Shizen/Arashi campaigns.
 *
 * @example
 * ```ts
 * import type { ChainContentData } from "@johnmorrisdotca/houseki/colour-chains";
 * import { campaignManifest, tutorialManifest } from "@johnmorrisdotca/houseki/colour-chains";
 *
 * const value: ChainContentData = {campaign:campaignManifest,tutorials:tutorialManifest};
 * console.log(value == null ? value : typeof value === "object" ? Object.keys(value).slice(0,6) : value);
 * ```
 */
export interface ChainContentData { readonly campaign: ChainCampaignManifest; readonly tutorials: readonly ChainTutorialDefinition[]; readonly shizen?: NatureChainCampaignManifest; readonly arashi?: NatureChainCampaignManifest }
export type { Colour, Orientation, WitnessStep, ChallengeGoal };
