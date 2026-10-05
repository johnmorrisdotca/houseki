/** A colour used by a stone. */
export type StoneColour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
/** A stone keeps its run-local identity as it falls or changes column. */
export interface Stone { readonly id: number; readonly colour: StoneColour }
export type BoardPreset = 'compact' | 'standard' | 'wide' | 'tall' | 'extraWide' | 'deep' | 'large';
export type BoardShape = 'heart' | 'star' | 'hexagon';
export type GameMode = 'relaxed' | 'arcade' | 'daily' | 'challenge';
export type StoredTool = 'bomb' | 'pick';
export interface ToolInventory { readonly bomb: number; readonly pick: number }
export type GamePhase = 'ready' | 'clear-mark' | 'clear-remove' | 'gravity' | 'won' | 'lost' | 'finished';
export type ChallengeGoal =
  | { readonly kind: 'clear-all' }
  | { readonly kind: 'clear-targets'; readonly targetIds: readonly number[] }
  | { readonly kind: 'score-target'; readonly minimumScore: number };
export interface Settings {
  readonly mode: GameMode;
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly seed: string | number;
  readonly shape?: BoardShape;
  readonly mask: readonly boolean[];
  readonly dailyDate?: string;
  readonly challengeId?: string;
  readonly goal?: ChallengeGoal;
  readonly moveLimit?: number;
  readonly tools: boolean;
}
export interface ChallengeDefinition {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly seed: string | number;
  readonly mask: readonly boolean[];
  readonly initialBoard: readonly (Stone | null)[];
  readonly goal: ChallengeGoal;
  readonly moveLimit?: number;
  /** Each entry is the complete stable-ID set of the next witnessed group. */
  readonly witness: readonly (readonly number[])[];
}
/** Data sufficient to restore the complete game immediately before a committed move. */
export interface UndoFrame {
  readonly board: readonly (Stone | null)[];
  readonly score: number;
  readonly moves: number;
  readonly removed: number;
  readonly randomState: number;
  readonly nextId: number;
  readonly usedFallback: boolean;
  readonly finishAdjustmentApplied: boolean;
  readonly selectedId: number | null;
  readonly selectedIds: readonly number[];
  readonly previewScore: number;
  readonly witnessIndex: number;
  readonly inventory: ToolInventory;
  readonly toolProgress: number;
  readonly toolAwardCursor: 0 | 1;
  readonly selectedTool: StoredTool | null;
  readonly toolTarget: number | null;
  readonly toolPreview: readonly number[];
}
export type RecordedAction =
  | { readonly kind: 'remove'; readonly move: number; readonly stoneId: number }
  | { readonly kind: 'select-tool'; readonly tool: StoredTool }
  | { readonly kind: 'target-tool'; readonly cell: number }
  | { readonly kind: 'confirm-tool'; readonly move: number }
  | { readonly kind: 'cancel-tool' }
  | { readonly kind: 'undo'; readonly move: number }
  | { readonly kind: 'hint'; readonly witnessIndex: number }
  | { readonly kind: 'ticks'; readonly count: number };
export interface GameState {
  readonly game: 'stone-collapse';
  readonly rules: 'collapse-2';
  readonly settings: Settings;
  readonly challenge: ChallengeDefinition | null;
  readonly initialBoard: readonly (Stone | null)[];
  /** Row-major; masked and currently empty cells contain null. */
  readonly board: readonly (Stone | null)[];
  readonly phase: GamePhase;
  readonly selectedId: number | null;
  readonly selectedIds: readonly number[];
  readonly previewScore: number;
  readonly score: number;
  readonly moves: number;
  readonly removed: number;
  readonly randomState: number;
  readonly nextId: number;
  readonly usedFallback: boolean;
  readonly resolutionTick: number;
  readonly pendingIds: readonly number[];
  /** Settled destination board held during the gravity animation. */
  readonly gravityBoard: readonly (Stone | null)[] | null;
  readonly finishAdjustmentApplied: boolean;
  readonly assisted: boolean;
  readonly history: readonly UndoFrame[];
  /** -1 means the player's current board has left the supplied witness path. */
  readonly witnessIndex: number;
  readonly elapsedTicks: number;
  readonly reason?: string;
  readonly recording: readonly RecordedAction[];
  readonly inventory: ToolInventory;
  /** Ordinary removed stones carried toward the next tool award; always 0–11. */
  readonly toolProgress: number;
  /** 0 awards Bomb next; 1 awards Pick next. */
  readonly toolAwardCursor: 0 | 1;
  readonly selectedTool: StoredTool | null;
  readonly toolTarget: number | null;
  /** Exact row-major cells affected by the current target. */
  readonly toolPreview: readonly number[];
}
export type Action =
  | { readonly kind: 'select'; readonly stoneId: number }
  | { readonly kind: 'confirm' }
  | { readonly kind: 'cancel' }
  | { readonly kind: 'undo' }
  | { readonly kind: 'hint' }
  | { readonly kind: 'select-tool'; readonly tool: StoredTool }
  | { readonly kind: 'target-tool'; readonly cell: number }
  | { readonly kind: 'confirm-tool' }
  | { readonly kind: 'cancel-tool' };
export interface GameEvent { readonly type: string; readonly [key: string]: unknown }
export interface Transition { readonly state: GameState; readonly events: readonly GameEvent[]; readonly accepted: boolean; readonly reason?: string }
export interface CreateOptions {
  readonly mode?: Exclude<GameMode, 'challenge'>;
  readonly preset?: BoardPreset;
  readonly width?: number;
  readonly height?: number;
  readonly colourCount?: 4 | 5 | 6;
  readonly seed?: string | number;
  readonly shape?: BoardShape;
  /** Row-major custom active-cell mask. Supply width and height with a custom mask. */
  readonly mask?: readonly boolean[];
  /** Required for Daily; supplied by the host in UTC. */
  readonly dailyDate?: string;
  /** Optional Bomb and Pick tray; available only in Relaxed and Arcade. */
  readonly tools?: boolean;
}
export interface ChallengeOptions {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly seed?: string | number;
  readonly mask?: readonly boolean[];
  readonly initialBoard: readonly (Stone | null)[];
  readonly goal: ChallengeGoal;
  readonly moveLimit?: number;
  readonly witness: readonly (readonly number[])[];
}
export interface GameStatus {
  readonly mode: GameMode;
  readonly phase: GamePhase;
  readonly score: number;
  readonly moves: number;
  readonly removed: number;
  readonly remaining: number;
  readonly previewScore: number;
  readonly usedFallback: boolean;
  readonly assisted: boolean;
  readonly goal?: ChallengeGoal;
  readonly reason?: string;
  readonly inventory: ToolInventory;
  readonly toolProgress: number;
  readonly toolAwardCursor: 0 | 1;
  readonly selectedTool: StoredTool | null;
  readonly toolTarget: number | null;
  readonly toolPreview: readonly number[];
}
