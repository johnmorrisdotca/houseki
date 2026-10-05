import type { ChallengeGoal, ChallengeHint, Colour, Gem, Triplet } from './types.js';

export interface LocalizedText { readonly en: string; readonly ja: string }
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
export interface TutorialStep { readonly instruction: LocalizedText; readonly action: string }
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
