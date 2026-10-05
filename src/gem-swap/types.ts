/** A colour used by a normal gem. */
export type GemColour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
export type SpecialKind = 'row-beam' | 'column-beam' | 'bomb' | 'colour-burst';
export type ToolKind = 'bomb' | 'row-clear' | 'colour-clear' | 'black-hole';
export type OrdinaryToolKind = Exclude<ToolKind, 'black-hole'>;
export type ToolInventory = Readonly<Record<OrdinaryToolKind, number>>;
export interface BlackHolePortal {
  readonly cell: number;
  readonly capacityRemaining: number;
  readonly movesRemaining: number;
  readonly consumedIds: readonly number[];
}
/** A gem has a stable identity and stored colour until it is cleared. Missing kind means normal. */
export interface Gem { readonly id: number; readonly colour: GemColour; readonly kind?: SpecialKind }
export interface PlannedSpecial { readonly cell: number; readonly kind: SpecialKind }
export type BoardPreset = 'compact' | 'standard' | 'wide' | 'tall';
export type BoardShape = 'heart' | 'star' | 'hexagon';
export type GamePhase = 'ready' | 'clear-mark' | 'clear-remove' | 'gravity' | 'refill' | 'finished';
export type GameMode = 'relaxed' | 'arcade' | 'daily' | 'challenge';
export type GameOutcome = 'won' | 'lost' | 'finished' | null;
export type Goal =
  | { readonly kind: 'score'; readonly target: number }
  | { readonly kind: 'collect'; readonly colour: GemColour; readonly target: number }
  | { readonly kind: 'chain'; readonly target: number }
  | { readonly kind: 'seals' };
export interface Seal { readonly cell: number; readonly layers: number }
export interface ChallengeRules { readonly goals: readonly Goal[]; readonly moveLimit?: number; readonly seals?: readonly Seal[] }
export type ReplayOperation = { readonly kind: 'action'; readonly action: Action } | { readonly kind: 'ticks'; readonly count: number } | { readonly kind: 'time'; readonly milliseconds: number };
export interface Settings {
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly seed: string | number;
  readonly tools: boolean;
  readonly advancedTools: boolean;
  readonly shape?: BoardShape;
  readonly mask: readonly boolean[];
}
export interface GameState {
  readonly game: 'gem-swap';
  readonly rules: 'swap-1';
  readonly settings: Settings;
  readonly initialOptions: CreateOptions;
  readonly mode: GameMode;
  readonly dailyDate: string | null;
  readonly challenge: ChallengeRules | null;
  readonly seals: readonly Seal[];
  readonly sealsCleared: number;
  readonly elapsedMs: number;
  readonly outcome: GameOutcome;
  readonly clearedByColour: Readonly<Record<GemColour, number>>;
  readonly bestChain: number;
  readonly history: readonly ReplayOperation[];
  /** Row-major. Mask gaps and the holes in clear phases contain null. */
  readonly board: readonly (Gem | null)[];
  readonly phase: GamePhase;
  readonly score: number;
  readonly moves: number;
  readonly swapCount: number;
  readonly randomState: number;
  readonly nextId: number;
  readonly usedFallback: boolean;
  readonly wave: number;
  readonly resolutionTick: number;
  readonly pendingCells: readonly number[];
  readonly pendingSpecials: readonly PlannedSpecial[];
  readonly gravityBoard: readonly (Gem | null)[] | null;
  readonly inventory: ToolInventory;
  readonly selectedTool: ToolKind | null;
  readonly toolTarget: number | null;
  readonly toolPreview: readonly number[];
  readonly toolProgress: number;
  readonly toolAwardCursor: number;
  readonly assisted: boolean;
  /** Remains true across cascades originating from one tool use. */
  readonly toolWaveActive: boolean;
  readonly blackHoleCharges: 0 | 1;
  readonly blackHoleProgress: number;
  readonly blackHole: BlackHolePortal | null;
  readonly blackHoleMovePending: boolean;
  readonly blackHoleContactPending: boolean;
  readonly pendingBlackHole: boolean;
}
/** Swaps two row-major cell addresses. */
export interface SwapAction { readonly kind: 'swap'; readonly from: number; readonly to: number }
export interface SelectToolAction { readonly kind: 'select-tool'; readonly tool: ToolKind }
export interface TargetToolAction { readonly kind: 'target-tool'; readonly cell: number }
export interface ConfirmToolAction { readonly kind: 'confirm-tool' }
export interface CancelToolAction { readonly kind: 'cancel-tool' }
export interface UndoAction { readonly kind: 'undo' }
export interface HintAction { readonly kind: 'hint' }
export interface ReshuffleAction { readonly kind: 'reshuffle' }
export type Action = SwapAction | SelectToolAction | TargetToolAction | ConfirmToolAction | CancelToolAction | UndoAction | HintAction | ReshuffleAction;
export interface GameEvent { readonly type: string; readonly [key: string]: unknown }
export interface Transition { readonly state: GameState; readonly events: readonly GameEvent[]; readonly accepted: boolean; readonly reason?: string }
export interface CreateOptions {
  readonly preset?: BoardPreset;
  readonly width?: number;
  readonly height?: number;
  readonly colourCount?: 4 | 5 | 6;
  readonly seed?: string | number;
  readonly tools?: boolean;
  readonly advancedTools?: boolean;
  readonly shape?: BoardShape;
  /** Row-major active-cell mask. Requires explicit custom dimensions. */
  readonly mask?: readonly boolean[];
  readonly mode?: GameMode;
  /** Required for Daily; a UTC calendar date in YYYY-MM-DD form. */
  readonly dailyDate?: string;
  /** Challenge-only finite goals and optional legal-swap budget. */
  readonly challenge?: ChallengeRules;
}
export interface GameStatus {
  readonly phase: GamePhase;
  readonly score: number;
  readonly moves: number;
  readonly legalMoveCount: number;
  readonly usedFallback: boolean;
  readonly availableToolCount: number;
  readonly inventory: ToolInventory;
  readonly toolProgress: number;
  readonly toolAwardCursor: number;
  readonly assisted: boolean;
  readonly blackHoleCharges: 0 | 1;
  readonly blackHoleProgress: number;
  readonly blackHole: BlackHolePortal | null;
  readonly mode: GameMode;
  readonly outcome: GameOutcome;
  readonly remainingMoves: number | null;
  readonly elapsedMs: number;
  readonly remainingMs: number | null;
  readonly goals: readonly Goal[];
  readonly goalProgress: readonly { readonly kind: Goal['kind']; readonly current: number; readonly target: number; readonly colour?: GemColour; readonly complete: boolean }[];
  readonly bestChain: number;
}
