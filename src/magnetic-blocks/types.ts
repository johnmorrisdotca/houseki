/** A standard gem colour used by a magnetic block. */
export type Colour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
export type Floor = 'calm' | 'magnetic';
export type FloorSchedule =
  | { readonly kind: 'frequent' }
  | { readonly kind: 'occasional' }
  | { readonly kind: 'infrequent' }
  | { readonly kind: 'mid-level'; readonly placement: number }
  | { readonly kind: 'fixed'; readonly floor: Floor }
  | { readonly kind: 'authored'; readonly magneticPlacements: readonly number[]; readonly defaultFloor?: Floor };
export type Mode = 'relaxed' | 'arcade';
export type Phase = 'falling' | 'clear-mark' | 'clear-remove' | 'gravity' | 'paused' | 'won' | 'lost' | 'finished';
export interface Gem { readonly id: number; readonly colour: Colour }
export interface Bond { readonly a: number; readonly b: number }
export interface Block { readonly x: number; readonly y: number; readonly orientation: 0 | 1 | 2 | 3; readonly gems: readonly [Gem, Gem, Gem, Gem]; readonly descent: number; readonly lockTicks: number; readonly lockResets: number; readonly lockStarted: boolean }
export type Goal = { readonly kind: 'clear-all' } | { readonly kind: 'clear-targets'; readonly targetIds: readonly number[] };
export interface CreateOptions {
  readonly mode?: Mode;
  readonly width?: number;
  readonly height?: number;
  readonly colourCount?: 4 | 5 | 6;
  readonly seed?: string | number;
  readonly mask?: readonly boolean[];
  readonly initialBoard?: readonly (Gem | null)[];
  readonly bonds?: readonly Bond[];
  readonly queue?: readonly (readonly [Colour, Colour, Colour, Colour])[];
  readonly pieceLimit?: number;
  readonly schedule?: FloorSchedule;
  readonly floorSwitch?: boolean;
  readonly magneticImpact?: boolean;
  readonly goal?: Goal;
}
export interface Settings {
  readonly mode: Mode; readonly width: number; readonly height: number; readonly colourCount: 4 | 5 | 6; readonly seed: string | number;
  readonly mask: readonly boolean[]; readonly schedule: FloorSchedule; readonly floorSwitch: boolean;
  readonly magneticImpact: boolean; readonly pieceLimit: number; readonly initialBoard: readonly (Gem | null)[]; readonly bonds: readonly Bond[];
  readonly initialQueue?: readonly (readonly [Colour, Colour, Colour, Colour])[]; readonly goal?: Goal;
}
export interface GameState {
  readonly game: 'magnetic-blocks'; readonly rules: 'magnetic-blocks-1'; readonly settings: Settings;
  readonly board: readonly (Gem | null)[]; readonly bonds: readonly Bond[]; readonly active: Block | null;
  readonly queue: readonly (readonly [Colour, Colour, Colour, Colour])[]; readonly randomState: number; readonly nextId: number;
  readonly phase: Phase; readonly pausedPhase?: Exclude<Phase, 'paused'>; readonly score: number; readonly moves: number; readonly placements: number; readonly chain: number; readonly maxChain: number;
  readonly floor: Floor; readonly nextFloor: Floor; readonly floorSwitchCharges: 0 | 1; readonly pendingFloorOverride: Floor | null;
  readonly pendingClear: readonly number[]; readonly gravityBoard: readonly (Gem | null)[] | null; readonly resolutionTick: number;
  readonly impactRemovedIds: readonly number[]; readonly elapsedTicks: number; readonly recording: readonly RecordedAction[]; readonly reason?: string;
}
export type Action =
  | { readonly kind: 'left' } | { readonly kind: 'right' } | { readonly kind: 'soft-drop' }
  | { readonly kind: 'rotate-clockwise' } | { readonly kind: 'rotate-anticlockwise' }
  | { readonly kind: 'hard-drop' } | { readonly kind: 'land' } | { readonly kind: 'pause' } | { readonly kind: 'resume' }
  | { readonly kind: 'set-floor-override'; readonly floor: Floor } | { readonly kind: 'cancel-floor-override' };
export interface RecordedAction { readonly tick: number; readonly ordinal: number; readonly action: Action }
export interface GameEvent { readonly type: string; readonly [key: string]: unknown }
export interface Transition { readonly state: GameState; readonly events: readonly GameEvent[]; readonly accepted: boolean; readonly reason?: string }
export interface GameStatus { readonly phase: Phase; readonly score: number; readonly moves: number; readonly placements: number; readonly floor: Floor; readonly nextFloor: Floor; readonly floorSwitchCharges: number; readonly pendingFloorOverride: Floor | null; readonly maxChain: number; readonly reason?: string }
