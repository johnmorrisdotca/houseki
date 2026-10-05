/** A gem colour used by Colour Chains. */
export type Colour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
/** A settled or active stone with a stable run-local identity. */
export interface Gem { readonly id: number; readonly colour: Colour }
/** The pivot-to-satellite direction, in clockwise order. */
export type Orientation = 'up' | 'right' | 'down' | 'left';
/** A visible or hidden board coordinate. */
export interface Cell { readonly x: number; readonly y: number }
/** The active rigid pair. The pivot always retains its own gem identity. */
export interface Pair { readonly pivot: Cell; readonly orientation: Orientation; readonly gems: readonly [Gem, Gem]; readonly level: number; readonly gravityTicks: number; readonly groundedTicks: number; readonly resetCount: number; readonly groundedStarted: boolean }
/** Supported well presets. */
export type Preset = 'narrow' | 'standard' | 'wide' | 'tall' | 'extraWide' | 'deep' | 'large';
export type Mode = 'relaxed' | 'arcade' | 'daily' | 'challenge';
export interface CreateOptions { readonly mode?: Exclude<Mode, 'challenge'>; readonly seed?: string; readonly dailyDate?: string; readonly preset?: Preset; readonly width?: number; readonly height?: number; readonly colourCount?: 4 | 5 | 6; readonly pairLimit?: number }
/** Run settings fixed at game creation. */
export interface Settings { readonly mode: Mode; readonly width: number; readonly height: number; readonly colourCount: 4 | 5 | 6; readonly seed: string; readonly date?: string; readonly pairLimit?: number; readonly challengeId?: string; readonly goal?: ChallengeGoal; readonly initialBoard?: readonly (Gem | null)[]; readonly queue?: readonly (readonly [Colour, Colour])[]; readonly witness?: readonly WitnessStep[] }
/** Challenge objective; target IDs refer to the visible starting board. */
export type ChallengeGoal = { readonly kind: 'clear-targets'; readonly targetIds: readonly number[] } | { readonly kind: 'minimum-chain'; readonly chain: number } | { readonly kind: 'empty-board' };
export interface WitnessStep { readonly pivotX: number; readonly orientation: Orientation }
export interface ChallengeOptions { readonly id: string; readonly width?: number; readonly height?: number; readonly colourCount?: 4 | 5 | 6; readonly seed?: string; readonly board: readonly (Gem | null)[]; readonly queue: readonly (readonly [Colour, Colour])[]; readonly goal: ChallengeGoal; readonly witness?: readonly WitnessStep[] }
/** Observable game phases. */
export type Phase = 'falling' | 'clear-mark' | 'clear-remove' | 'gravity' | 'paused' | 'won' | 'lost' | 'finished';
/** A scored simultaneous match wave. */
export interface Wave { readonly chain: number; readonly cells: readonly number[]; readonly ids: readonly number[]; readonly points: number }
export type PlayAction = { readonly kind: 'left' } | { readonly kind: 'right' } | { readonly kind: 'down' } | { readonly kind: 'rotate-clockwise' } | { readonly kind: 'rotate-anticlockwise' } | { readonly kind: 'hard-drop' } | { readonly kind: 'place' } | { readonly kind: 'pause' } | { readonly kind: 'resume' } | { readonly kind: 'hint' };
export type Action = PlayAction;
export type HeldControl = 'left' | 'right' | 'soft-drop';
export type InputCommand = { readonly kind: 'hold'; readonly control: HeldControl; readonly pressed: boolean } | { readonly kind: 'edge'; readonly action: Extract<PlayAction, { kind: 'rotate-clockwise' | 'rotate-anticlockwise' | 'hard-drop' | 'place' | 'pause' | 'resume' }> };
export interface RecordedAction { readonly tick: number; readonly ordinal: number; readonly action: PlayAction }
/** An immutable Colour Chains rules state. Board rows include the three hidden rows above the well. */
export interface GameState {
  readonly game: 'colour-chains'; readonly rules: 'chains-1'; readonly settings: Settings;
  readonly board: readonly (Gem | null)[]; readonly phase: Phase; readonly pausedPhase?: Exclude<Phase, 'paused'>; readonly active: Pair | null;
  readonly next: readonly (readonly [Colour, Colour])[]; readonly bag: readonly Colour[]; readonly randomState: number;
  readonly nextId: number; readonly score: number; readonly maxChain: number; readonly allClears: number; readonly completedPairs: number;
  readonly resolutionTick: number; readonly resolutionLevel?: number; readonly waves: readonly Wave[]; readonly clearCells: readonly number[];
  readonly gravityBoard: readonly (Gem | null)[] | null; readonly resolutionHadClear: boolean; readonly elapsedTicks: number;
  readonly assisted: boolean; readonly witnessIndex: number; readonly recording: readonly RecordedAction[]; readonly reason?: string;
}
/** A deterministic transition; rejected actions retain the exact input state. */
export interface Transition { readonly state: GameState; readonly events: readonly GameEvent[]; readonly accepted: boolean; readonly reason?: string }
/** A domain event emitted by one transition. */
export interface GameEvent { readonly type: string; readonly [key: string]: unknown }
/** Compact player status derived from the current state. */
export interface GameStatus { readonly mode: Mode; readonly phase: Phase; readonly score: number; readonly maxChain: number; readonly allClears: number; readonly completedPairs: number; readonly assisted: boolean; readonly reason?: string }
/** Destination cells for the two independently settled ghost stones. */
export type Landing = readonly [Cell, Cell];
