import type { Action, Colour, CreateOptions, Floor, GameState, Gem } from './types.js';

export interface LocalizedText { readonly en: string; readonly ja: string }
export interface MagneticDifficultyMetrics {
  readonly legalPlacementChoices: number;
  readonly setupPlacementChoices: number;
  readonly winningPlacementChoices: number;
  readonly availableFloorChoices: number;
  readonly witnessPlacements: number;
  readonly witnessFloorDecisions: number;
  readonly difficultyScore: number;
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
  readonly legacyArchive?: readonly MagneticCampaignLevel[];
  readonly bands?: readonly { readonly id: MagneticDifficultyBand; readonly count: number; readonly first: number; readonly last: number }[];
}
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
