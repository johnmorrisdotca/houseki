import type { Bond, Colour, CreateOptions, Floor, FloorSchedule, Gem, Goal, Mode } from './types.js';
import { calmGravity } from './physics.js';

export class MagneticBlocksOptionsError extends RangeError {
  readonly code: string;
  constructor(code: string, message: string) { super(message); this.name = 'MagneticBlocksOptionsError'; this.code = code; }
}
export const COLOURS: readonly Colour[] = ['red', 'blue', 'green', 'gold', 'purple', 'teal'];
const floor = (value: unknown): value is Floor => value === 'calm' || value === 'magnetic';
export interface ValidatedOptions { readonly mode: Mode; readonly width: number; readonly height: number; readonly colourCount: 4 | 5 | 6; readonly seed: string | number; readonly mask: readonly boolean[]; readonly initialBoard: readonly (Gem | null)[]; readonly bonds: readonly Bond[]; readonly queue?: readonly (readonly [Colour, Colour, Colour, Colour])[]; readonly pieceLimit: number; readonly schedule: FloorSchedule; readonly floorSwitch: boolean; readonly magneticImpact: boolean; readonly goal?: Goal }
function validateSchedule(value: FloorSchedule | undefined): FloorSchedule {
  const schedule = value ?? { kind: 'occasional' as const };
  if (!schedule || typeof schedule !== 'object' || Array.isArray(schedule)) throw new MagneticBlocksOptionsError('invalid-schedule', 'Floor schedule must be an object');
  if (schedule.kind === 'frequent' || schedule.kind === 'occasional' || schedule.kind === 'infrequent') {
    if (Object.keys(schedule).length !== 1) throw new MagneticBlocksOptionsError('invalid-schedule', 'Floor schedule contains unsupported fields');
  } else if (schedule.kind === 'mid-level') {
    if (Object.keys(schedule).some(key => key !== 'kind' && key !== 'placement') || !Number.isInteger(schedule.placement) || schedule.placement < 1 || schedule.placement > 1000) throw new MagneticBlocksOptionsError('invalid-schedule', 'Mid-level pulse requires a placement number from 1 to 1000');
  } else if (schedule.kind === 'fixed') {
    if (Object.keys(schedule).some(key => key !== 'kind' && key !== 'floor') || !floor(schedule.floor)) throw new MagneticBlocksOptionsError('invalid-schedule', 'Fixed floor must be calm or magnetic');
  } else if (schedule.kind === 'authored') {
    if (Object.keys(schedule).some(key => !['kind', 'magneticPlacements', 'defaultFloor'].includes(key)) || !Array.isArray(schedule.magneticPlacements) || schedule.magneticPlacements.length > 1000 || schedule.magneticPlacements.some((n, i) => !Number.isInteger(n) || n < 1 || n > 1000 || i > 0 && n <= schedule.magneticPlacements[i - 1]!) || schedule.defaultFloor !== undefined && !floor(schedule.defaultFloor)) throw new MagneticBlocksOptionsError('invalid-schedule', 'Authored magnetic placements must be sorted unique positive placement numbers');
  } else throw new MagneticBlocksOptionsError('invalid-schedule', 'Unknown floor schedule');
  return Object.freeze({ ...schedule, ...('magneticPlacements' in schedule ? { magneticPlacements: Object.freeze([...schedule.magneticPlacements]) } : {}) });
}
function validateGoal(value: Goal | undefined, ids: ReadonlySet<number>): Goal | undefined {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new MagneticBlocksOptionsError('invalid-goal', 'Goal must be an object');
  if (value.kind === 'clear-all') { if (Object.keys(value).length !== 1) throw new MagneticBlocksOptionsError('invalid-goal', 'Clear-all goal has unsupported fields'); return Object.freeze({ kind: 'clear-all' }); }
  if (value.kind === 'clear-targets' && Object.keys(value).every(key => key === 'kind' || key === 'targetIds') && Array.isArray(value.targetIds) && value.targetIds.length > 0 && value.targetIds.every(id => Number.isSafeInteger(id) && ids.has(id)) && new Set(value.targetIds).size === value.targetIds.length) return Object.freeze({ kind: 'clear-targets', targetIds: Object.freeze([...value.targetIds].sort((a, b) => a - b)) });
  throw new MagneticBlocksOptionsError('invalid-goal', 'Goal must clear all gems or name unique initial gem IDs');
}
export function validateOptions(options: CreateOptions = {}): ValidatedOptions {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new MagneticBlocksOptionsError('invalid-options', 'Options must be an object');
  const allowed = ['mode', 'width', 'height', 'colourCount', 'seed', 'mask', 'initialBoard', 'bonds', 'queue', 'pieceLimit', 'schedule', 'floorSwitch', 'magneticImpact', 'goal'];
  if (Object.keys(options).some(key => !allowed.includes(key))) throw new MagneticBlocksOptionsError('unknown-option', 'Create options contain an unsupported field');
  const mode = options.mode ?? 'relaxed';
  if (mode !== 'relaxed' && mode !== 'arcade') throw new MagneticBlocksOptionsError('invalid-mode', 'Mode must be relaxed or arcade');
  const width = options.width ?? 10, height = options.height ?? 20;
  if (!Number.isInteger(width) || width < 4 || width > 12 || !Number.isInteger(height) || height < 4 || height > 20 || width * height > 240) throw new MagneticBlocksOptionsError('invalid-board-size', 'Board width must be 4–12, height 4–20, with at most 240 cells');
  const colourCount = options.colourCount ?? 4;
  if (![4, 5, 6].includes(colourCount)) throw new MagneticBlocksOptionsError('invalid-colour-count', 'Colour count must be 4, 5, or 6');
  const seed = options.seed ?? 'houseki-magnetic-blocks';
  if (typeof seed !== 'string' && (!Number.isInteger(seed) || seed < 0 || seed > 0xffff_ffff)) throw new MagneticBlocksOptionsError('invalid-seed', 'Numeric seed must be an unsigned 32-bit integer');
  const mask = options.mask === undefined ? Array(width * height).fill(true) : options.mask;
  if (!Array.isArray(mask) || mask.length !== width * height || mask.some(value => typeof value !== 'boolean') || mask.filter(Boolean).length < 16 || mask.filter(Boolean).length > 240) throw new MagneticBlocksOptionsError('invalid-mask', 'Mask must contain 16–240 active cells');
  const active = mask.flatMap((on, i) => on ? [i] : []), connected = new Set([active[0]!]), pending = [active[0]!];
  while (pending.length) { const at = pending.pop()!, x = at % width, y = Math.floor(at / width); for (const next of [x ? at - 1 : -1, x + 1 < width ? at + 1 : -1, y ? at - width : -1, y + 1 < height ? at + width : -1]) if (next >= 0 && mask[next] && !connected.has(next)) { connected.add(next); pending.push(next); } }
  if (connected.size !== active.length) throw new MagneticBlocksOptionsError('disconnected-mask', 'Mask active cells must be connected');
  if (active.some(at => { const x = at % width, y = Math.floor(at / width); return ![x ? at - 1 : -1, x + 1 < width ? at + 1 : -1, y ? at - width : -1, y + 1 < height ? at + width : -1].some(next => next >= 0 && mask[next]); })) throw new MagneticBlocksOptionsError('isolated-mask-cell', 'Every active mask cell must have an orthogonal neighbour');
  const initialBoard = options.initialBoard ?? Array(width * height).fill(null);
  if (!Array.isArray(initialBoard) || initialBoard.length !== width * height) throw new MagneticBlocksOptionsError('invalid-board', 'Initial board must contain one entry per cell');
  const ids = new Set<number>(); const board = initialBoard.map((gem, at) => {
    if (!mask[at]) { if (gem !== null) throw new MagneticBlocksOptionsError('gem-in-masked-cell', 'Masked cells must be empty'); return null; }
    if (gem === null) return null;
    if (!gem || typeof gem !== 'object' || Array.isArray(gem) || Object.keys(gem).some(key => key !== 'id' && key !== 'colour') || !Number.isSafeInteger(gem.id) || gem.id < 1 || ids.has(gem.id) || !COLOURS.slice(0, colourCount).includes(gem.colour)) throw new MagneticBlocksOptionsError('invalid-gem', 'Gems need unique positive IDs and a configured colour');
    ids.add(gem.id); return Object.freeze({ id: gem.id, colour: gem.colour });
  });
  const bonds = options.bonds ?? [];
  if (!Array.isArray(bonds) || bonds.some(edge => !edge || typeof edge !== 'object' || Object.keys(edge).some(key => key !== 'a' && key !== 'b') || !Number.isSafeInteger(edge.a) || !Number.isSafeInteger(edge.b) || edge.a === edge.b || !ids.has(edge.a) || !ids.has(edge.b))) throw new MagneticBlocksOptionsError('invalid-bonds', 'Bond edges must connect two unique occupied gem IDs');
  const bondKeys = bonds.map(edge => `${Math.min(edge.a, edge.b)}:${Math.max(edge.a, edge.b)}`);
  if (new Set(bondKeys).size !== bondKeys.length) throw new MagneticBlocksOptionsError('duplicate-bond', 'Bond edges must be unique');
  const idCells = new Map<number, number>(); board.forEach((gem, index) => { if (gem) idCells.set(gem.id, index); });
  if (bonds.some(edge => { const a = idCells.get(edge.a)!, b = idCells.get(edge.b)!; return Math.abs(a % width - b % width) + Math.abs(Math.floor(a / width) - Math.floor(b / width)) !== 1; })) throw new MagneticBlocksOptionsError('nonadjacent-bond', 'Bond edges must connect orthogonally adjacent gems');
  const stableBonds = bonds.map(edge => ({ a: Math.min(edge.a, edge.b), b: Math.max(edge.a, edge.b) }));
  const settledInitial = calmGravity(board, stableBonds, width, height, mask);
  if (settledInitial.some((gem, index) => gem?.id !== board[index]?.id)) throw new MagneticBlocksOptionsError('unstable-initial-board', 'Initial gems must be settled under calm gravity and their declared bonds');
  const queue = options.queue;
  if (queue !== undefined && (!Array.isArray(queue) || queue.length < 1 || queue.length > 1000 || queue.some(piece => !Array.isArray(piece) || piece.length !== 4 || piece.some(colour => !COLOURS.slice(0, colourCount).includes(colour))))) throw new MagneticBlocksOptionsError('invalid-queue', 'Queue must contain 1–1000 four-colour blocks');
  const pieceLimit = options.pieceLimit ?? queue?.length ?? 200;
  if (!Number.isInteger(pieceLimit) || pieceLimit < 1 || pieceLimit > 1000 || queue && queue.length < pieceLimit) throw new MagneticBlocksOptionsError('invalid-piece-limit', 'Piece limit must fit the fixed queue and be 1–1000');
  if (options.floorSwitch !== undefined && typeof options.floorSwitch !== 'boolean' || options.magneticImpact !== undefined && typeof options.magneticImpact !== 'boolean') throw new MagneticBlocksOptionsError('invalid-option-flag', 'Floor Switch and Magnetic Impact settings must be booleans');
  return { mode, width, height, colourCount: colourCount as 4 | 5 | 6, seed, mask: Object.freeze([...mask]), initialBoard: Object.freeze(board), bonds: Object.freeze(stableBonds.map(edge => Object.freeze(edge)).sort((a, b) => a.a - b.a || a.b - b.b)), ...(queue ? { queue: Object.freeze(queue.map(piece => Object.freeze([...piece]) as unknown as readonly [Colour, Colour, Colour, Colour])) } : {}), pieceLimit, schedule: validateSchedule(options.schedule), floorSwitch: options.floorSwitch ?? false, magneticImpact: options.magneticImpact ?? false, ...(options.goal === undefined ? {} : { goal: validateGoal(options.goal, ids)! }) };
}
