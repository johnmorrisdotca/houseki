/** A gem colour ID. */
export type Colour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
/** A settled or active gem with a stable run-local identity. */
export interface Gem { readonly id: number; readonly colour: Colour; readonly target?: boolean }
export type Mode = 'relaxed' | 'arcade' | 'daily' | 'challenge';
export type Phase = 'falling' | 'clear-mark' | 'clear-remove' | 'gravity' | 'paused' | 'won' | 'lost' | 'finished';
export interface Piece { readonly gems: readonly [Gem, Gem, Gem]; readonly x: number; readonly y: number; readonly orientation: 0 | 1 | 2; readonly level: number; readonly descent: number; readonly lockTicks: number; readonly lockResets: number; readonly lockStarted: boolean }
export interface Settings { readonly mode: Mode; readonly width: number; readonly height: number; readonly colourCount: 4 | 5 | 6; readonly seed: string; readonly pieceLimit?: number; readonly goal?: 'targets' | 'chain' | 'empty'; readonly targetIds?: readonly number[]; readonly minimumChain?: number; readonly challengeBoard?: readonly (Gem | null)[]; readonly challengeQueue?: readonly Triplet[]; readonly witness?: readonly ChallengeHint[] }
export type Triplet = readonly [Colour, Colour, Colour];
export interface ChallengeGoalTargets { readonly type: 'targets'; readonly targetIds: readonly number[] }
export interface ChallengeGoalChain { readonly type: 'chain'; readonly minimumChain: number }
export interface ChallengeGoalEmpty { readonly type: 'empty' }
export type ChallengeGoal = ChallengeGoalTargets | ChallengeGoalChain | ChallengeGoalEmpty;
export interface ChallengeHint { readonly x: number; readonly orientation: 0 | 1 | 2 }
export interface ChallengeSettings extends Settings { readonly mode: 'challenge'; readonly goal: ChallengeGoal['type']; readonly challengeBoard: readonly (Gem | null)[]; readonly challengeQueue: readonly Triplet[] }
export interface Wave { readonly clearedIds: readonly number[]; readonly cells: readonly number[]; readonly chain: number; readonly points: number }
export interface GameState { readonly game: 'falling-triplets'; readonly rules: 'triplets-1'; readonly settings: Settings; readonly board: readonly (Gem | null)[]; readonly phase: Phase; readonly pausedPhase?: Phase; readonly active: Piece | null; readonly next: readonly Triplet[]; readonly bag: readonly Colour[]; readonly randomState: number; readonly nextId: number; readonly score: number; readonly maxChain: number; readonly completedPieces: number; readonly elapsedTicks: number; readonly pieceTicks: number; readonly resolutionTick: number; readonly waves: readonly Wave[]; readonly assisted: boolean; readonly hintsUsed: number; readonly witnessPathMatches: boolean; readonly challengeIndex?: number; readonly pendingClear?: readonly number[]; readonly gravityBoard?: readonly (Gem | null)[]; readonly resolutionChain?: number; readonly resolutionLevel?: number; readonly recording: readonly RecordedAction[]; readonly reason?: string }
export type Action = { readonly kind: 'left' | 'right' | 'soft-drop' | 'hard-drop' | 'place' | 'cycle-forward' | 'cycle-backward' | 'pause' | 'resume' | 'hint' | 'tick' };
export interface Transition { readonly state: GameState; readonly events: readonly GameEvent[]; readonly accepted: boolean; readonly reason?: string }
/** One accepted canonical action and its logical tick position. */
export interface RecordedAction { readonly tick: number; readonly ordinal: number; readonly action: Exclude<Action, { readonly kind: 'tick' }> }
export interface GameEvent { readonly type: string; readonly [key: string]: unknown }
export interface CreateOptions { readonly mode?: Exclude<Mode, 'challenge'>; readonly seed?: string; readonly preset?: 'narrow' | 'standard' | 'wide' | 'tall'; readonly width?: number; readonly height?: number; readonly colourCount?: 4 | 5 | 6; readonly pieceLimit?: number }
export interface ChallengeOptions { readonly seed?: string; readonly width?: number; readonly height?: number; readonly colourCount?: 4 | 5 | 6; readonly board: readonly (Gem | null)[]; readonly queue: readonly Triplet[]; readonly goal: ChallengeGoal; readonly witness?: readonly ChallengeHint[] }
