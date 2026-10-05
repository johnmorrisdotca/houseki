import type { ChallengeGoal, Colour, Gem, Orientation, WitnessStep } from './types.js';

export interface LocalizedText { readonly en: string; readonly ja: string }
export interface ChainDifficultyMetrics {
  readonly placementProbes: number;
  readonly legalPlacements: number;
  readonly goalPreservingPlacements: number;
  readonly forcedPlacementShare: number;
  readonly seededPlayoutSamples: number;
  readonly seededPlayoutQueueDepth: number;
  readonly seededPlayoutSuccesses: number;
  readonly seededPlayoutSuccessRate: number;
  readonly setupPairsBeforePayoff: number;
  readonly requiredSetupPairs: number;
  readonly verifiedSetupDependencies: number;
  readonly requiredChainDepth: number;
  readonly requiredRotations: number;
  readonly requiredWallKicks: number;
  readonly splitLandingDependencies: number;
  /** Number of committed pair placements in the supplied winning plan. */
  readonly planningLength: number;
}
export interface ChainCampaignLevel {
  readonly id: string;
  readonly number: number;
  readonly title: LocalizedText;
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
}
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
export interface ChainTutorialStep { readonly instruction: LocalizedText; readonly action: string }
export interface ChainTutorialDefinition {
  readonly id: string;
  readonly title: LocalizedText;
  readonly objective: LocalizedText;
  readonly setup: { readonly board: readonly (Gem | null)[]; readonly queue: readonly (readonly [Colour, Colour])[]; readonly goal: ChallengeGoal; readonly witness: readonly WitnessStep[] };
  readonly steps: readonly ChainTutorialStep[];
  readonly tags: readonly string[];
}
export interface ChainContentData { readonly campaign: ChainCampaignManifest; readonly tutorials: readonly ChainTutorialDefinition[] }
export type { Colour, Orientation, WitnessStep, ChallengeGoal };
