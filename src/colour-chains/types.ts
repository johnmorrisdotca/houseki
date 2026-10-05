/** A gem colour used by Colour Chains. */
export type Colour = 'red' | 'blue' | 'green' | 'gold' | 'purple' | 'teal';
/** A settled or active stone with a stable run-local identity. */
export interface Gem { readonly id: number; readonly colour: Colour }
/** The pivot-to-satellite direction, in clockwise order. */
export type Orientation = 'up' | 'right' | 'down' | 'left';
/** A visible or hidden board coordinate. */
export interface Cell { readonly x: number; readonly y: number }
/** The active rigid pair. The pivot always retains its own gem identity. */
export interface Pair { readonly pivot: Cell; readonly orientation: Orientation; readonly gems: readonly [Gem, Gem]; readonly level: number }
/** Supported well presets. */
export type Preset = 'narrow' | 'standard' | 'wide' | 'tall';
/** Validated public setup values for a new game. */
export interface CreateOptions { readonly seed?: string; readonly preset?: Preset; readonly width?: number; readonly height?: number; readonly colourCount?: 4 | 5 | 6 }
/** Run settings fixed at game creation. */
export interface Settings { readonly width: number; readonly height: number; readonly colourCount: 4 | 5 | 6; readonly seed: string }
/** Observable game phases. */
export type Phase = 'falling' | 'clear-mark' | 'clear-remove' | 'gravity' | 'won' | 'lost';
/** A scored simultaneous match wave. */
export interface Wave { readonly chain: number; readonly cells: readonly number[]; readonly ids: readonly number[]; readonly points: number }
/** A canonical player action. */
export type Action = { readonly kind: 'left' | 'right' | 'down' | 'rotate-clockwise' | 'rotate-anticlockwise' | 'hard-drop' | 'place' };
/** An immutable Colour Chains rules state. Board rows include the three hidden rows above the well. */
export interface GameState {
  readonly game: 'colour-chains'; readonly rules: 'chains-1'; readonly settings: Settings;
  readonly board: readonly (Gem | null)[]; readonly phase: Phase; readonly active: Pair | null;
  readonly next: readonly (readonly [Colour, Colour])[]; readonly bag: readonly Colour[]; readonly randomState: number;
  readonly nextId: number; readonly score: number; readonly maxChain: number; readonly completedPairs: number;
  readonly resolutionTick: number; readonly waves: readonly Wave[]; readonly clearCells: readonly number[];
  readonly gravityBoard: readonly (Gem | null)[] | null; readonly resolutionHadClear: boolean; readonly reason?: string;
}
/** A deterministic transition; rejected actions retain the exact input state. */
export interface Transition { readonly state: GameState; readonly events: readonly GameEvent[]; readonly accepted: boolean; readonly reason?: string }
/** A domain event emitted by one transition. */
export interface GameEvent { readonly type: string; readonly [key: string]: unknown }
/** Compact player status derived from the current state. */
export interface GameStatus { readonly phase: Phase; readonly score: number; readonly maxChain: number; readonly completedPairs: number; readonly reason?: string }
/** Destination cells for the two independently settled ghost stones. */
export type Landing = readonly [Cell, Cell];
