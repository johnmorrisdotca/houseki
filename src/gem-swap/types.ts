/** A colour used by a normal gem. */
export type GemColour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
export type SpecialKind = 'row-beam' | 'column-beam' | 'bomb' | 'colour-burst';
export type ToolKind = 'bomb' | 'row-clear' | 'colour-clear';
export type ToolInventory = Readonly<Record<ToolKind, number>>;
/** A gem has a stable identity and stored colour until it is cleared. Missing kind means normal. */
export interface Gem { readonly id: number; readonly colour: GemColour; readonly kind?: SpecialKind }
export interface PlannedSpecial { readonly cell: number; readonly kind: SpecialKind }
export type BoardPreset = 'compact' | 'standard' | 'wide' | 'tall';
export type BoardShape = 'heart' | 'star' | 'hexagon';
export type GamePhase = 'ready' | 'clear-mark' | 'clear-remove' | 'gravity' | 'refill' | 'finished';
export interface Settings {
  readonly width: number;
  readonly height: number;
  readonly colourCount: 4 | 5 | 6;
  readonly seed: string | number;
  readonly tools: boolean;
  readonly shape?: BoardShape;
  readonly mask: readonly boolean[];
}
export interface GameState {
  readonly game: 'gem-swap';
  readonly rules: 'swap-1';
  readonly settings: Settings;
  /** Row-major. Mask gaps and the holes in clear phases contain null. */
  readonly board: readonly (Gem | null)[];
  readonly phase: GamePhase;
  readonly score: number;
  readonly moves: number;
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
}
/** Swaps two row-major cell addresses. */
export interface SwapAction { readonly kind: 'swap'; readonly from: number; readonly to: number }
export interface SelectToolAction { readonly kind: 'select-tool'; readonly tool: ToolKind }
export interface TargetToolAction { readonly kind: 'target-tool'; readonly cell: number }
export interface ConfirmToolAction { readonly kind: 'confirm-tool' }
export interface CancelToolAction { readonly kind: 'cancel-tool' }
export type Action = SwapAction | SelectToolAction | TargetToolAction | ConfirmToolAction | CancelToolAction;
export interface GameEvent { readonly type: string; readonly [key: string]: unknown }
export interface Transition { readonly state: GameState; readonly events: readonly GameEvent[]; readonly accepted: boolean; readonly reason?: string }
export interface CreateOptions {
  readonly preset?: BoardPreset;
  readonly width?: number;
  readonly height?: number;
  readonly colourCount?: 4 | 5 | 6;
  readonly seed?: string | number;
  readonly tools?: boolean;
  readonly shape?: BoardShape;
  /** Row-major active-cell mask. Requires explicit custom dimensions. */
  readonly mask?: readonly boolean[];
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
}
