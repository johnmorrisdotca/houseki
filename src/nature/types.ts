export type HorizontalDirection = 'left' | 'right';
export type ReboundDirectionMode = 'input-or-alternate' | 'seeded';
export type QuarterTurn = -1 | 0 | 1;

/** Stable board occupant. Obstacles collide and block attraction but cannot move or attract. */
export interface NatureEntity {
  readonly id: number;
  readonly kind: 'stone' | 'obstacle';
  readonly colour?: string;
  readonly magnetic?: boolean;
  readonly anchored?: boolean;
}
export interface NaturePieceCell extends NatureEntity {
  readonly kind: 'stone';
  readonly x: number;
  readonly y: number;
}
export interface NatureRules {
  readonly magneticEnabled: boolean;
  readonly reboundEnabled: boolean;
  readonly reboundDirectionMode: ReboundDirectionMode;
}
export interface NatureOptions {
  readonly width: number;
  readonly height: number;
  readonly seed?: string;
  /** Row-major passability mask. False cells are permanent gaps and cannot hold pieces. */
  readonly activeCells?: readonly boolean[];
  /** Row-major initial occupants; false mask cells must be empty. */
  readonly cells?: readonly (NatureEntity | null)[];
  readonly magneticEnabled?: boolean;
  readonly reboundEnabled?: boolean;
  readonly reboundDirectionMode?: ReboundDirectionMode;
}
export interface NatureState {
  readonly width: number;
  readonly height: number;
  readonly activeCells: readonly boolean[];
  readonly cells: readonly (NatureEntity | null)[];
  readonly seed: string;
  readonly randomState: number;
  readonly nextId: number;
  readonly committedPlacements: number;
  readonly rules: NatureRules;
}
export interface NatureMove {
  readonly id: number;
  readonly from: { readonly x: number; readonly y: number };
  readonly to: { readonly x: number; readonly y: number };
}
export interface AttractionPairPreview {
  readonly ids: readonly [number, number];
  readonly axis: 'horizontal' | 'vertical';
  readonly emptyGap: number;
  readonly midpoint: { readonly x: number; readonly y: number };
  readonly anchoredId?: number;
  readonly moves: readonly NatureMove[];
}
export interface MagneticPreview {
  readonly pairs: readonly AttractionPairPreview[];
  readonly moves: readonly NatureMove[];
  readonly cells: readonly (NatureEntity | null)[];
}
export interface PowerDropRequest {
  readonly piece: readonly NaturePieceCell[];
  readonly pivotId: number;
  readonly power: boolean;
  readonly lastHorizontalDirection?: HorizontalDirection;
  /** A caller-selected quarter-turn applied with the one-cell rebound. */
  readonly quarterTurn?: QuarterTurn;
}
export interface ReboundAttemptPreview {
  readonly direction: HorizontalDirection;
  readonly quarterTurn: QuarterTurn;
  readonly valid: boolean;
}
export interface PowerDropPreview {
  readonly normalLanding: readonly NaturePieceCell[];
  readonly attempts: readonly ReboundAttemptPreview[];
  readonly rebound: boolean;
  readonly selectedDirection?: HorizontalDirection;
  readonly quarterTurn: QuarterTurn;
  readonly finalCells: readonly NaturePieceCell[];
  readonly moves: readonly NatureMove[];
  readonly randomStateAfter: number;
}
export type NatureEvent =
  | { readonly type: 'magnetic-pulse'; readonly pairs: readonly AttractionPairPreview[]; readonly moves: readonly NatureMove[] }
  | { readonly type: 'magnetic-stones-marked'; readonly ids: readonly number[]; readonly randomState: number }
  | { readonly type: 'power-drop-landed'; readonly power: boolean; readonly rebound: boolean; readonly direction?: HorizontalDirection; readonly quarterTurn: QuarterTurn; readonly moves: readonly NatureMove[]; readonly ids: readonly number[] };
export interface NatureTransition {
  readonly state: NatureState;
  readonly accepted: boolean;
  readonly reason?: string;
  readonly events: readonly NatureEvent[];
  readonly preview?: MagneticPreview | PowerDropPreview;
}
export interface MarkingOptions { readonly probability: number; readonly maximum?: number; readonly anchoredProbability?: number }
export type NatureErrorCode = 'invalid-nature-options' | 'invalid-grid-size' | 'invalid-seed' | 'invalid-mask' | 'invalid-cell' | 'duplicate-id' | 'invalid-marking-options' | 'invalid-power-drop' | 'piece-collision' | 'invalid-piece-position';
