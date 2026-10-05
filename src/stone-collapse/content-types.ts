import type { ChallengeGoal, Stone, StoneColour } from './types.js';

export interface LocalizedText { readonly en: string; readonly ja: string }
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
export interface CollapseTutorialStep { readonly instruction: LocalizedText; readonly action: string }
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
