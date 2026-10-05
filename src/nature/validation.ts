import type { MarkingOptions, NatureEntity, NatureErrorCode, NatureOptions, NaturePieceCell, NatureState, PowerDropRequest, QuarterTurn } from './types.js';

export class NatureOptionsError extends RangeError {
  readonly code: NatureErrorCode;
  constructor(code: NatureErrorCode, message: string) { super(message); this.name = 'NatureOptionsError'; this.code = code; }
}
const ownKeysOnly = (value: object, allowed: readonly string[], code: NatureErrorCode, label: string): void => {
  if (Object.keys(value).some(key => !allowed.includes(key))) throw new NatureOptionsError(code, `${label} contains an unsupported field`);
};
export function validateNatureOptions(options: NatureOptions): void {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new NatureOptionsError('invalid-nature-options', 'Nature options must be an object');
  ownKeysOnly(options, ['width', 'height', 'seed', 'activeCells', 'cells', 'magneticEnabled', 'reboundEnabled', 'reboundDirectionMode'], 'invalid-nature-options', 'Nature options');
  if (!Number.isSafeInteger(options.width) || !Number.isSafeInteger(options.height) || options.width < 1 || options.height < 1 || options.width > 32 || options.height > 32 || options.width * options.height > 1024) throw new NatureOptionsError('invalid-grid-size', 'Grid dimensions must be integers from 1 to 32 with at most 1024 cells');
  if (options.seed !== undefined && (typeof options.seed !== 'string' || options.seed.length < 1 || options.seed.length > 200)) throw new NatureOptionsError('invalid-seed', 'Seed must contain 1–200 characters');
  const size = options.width * options.height;
  if (options.activeCells !== undefined && (!Array.isArray(options.activeCells) || options.activeCells.length !== size || options.activeCells.some(value => typeof value !== 'boolean'))) throw new NatureOptionsError('invalid-mask', 'Active-cell mask must contain one boolean per grid cell');
  if (options.cells !== undefined && (!Array.isArray(options.cells) || options.cells.length !== size)) throw new NatureOptionsError('invalid-cell', 'Cells must contain one entry per grid cell');
  if (options.magneticEnabled !== undefined && typeof options.magneticEnabled !== 'boolean' || options.reboundEnabled !== undefined && typeof options.reboundEnabled !== 'boolean') throw new NatureOptionsError('invalid-nature-options', 'Feature flags must be boolean');
  if (options.reboundDirectionMode !== undefined && options.reboundDirectionMode !== 'input-or-alternate' && options.reboundDirectionMode !== 'seeded') throw new NatureOptionsError('invalid-nature-options', 'Unsupported rebound direction mode');
  const ids = new Set<number>();
  for (let index = 0; index < (options.cells?.length ?? 0); index++) {
    const entity = options.cells![index];
    if (entity === null) continue;
    validateEntity(entity, ids, `Grid cell ${index}`);
    if (options.activeCells?.[index] === false) throw new NatureOptionsError('invalid-cell', `Grid cell ${index} is masked but occupied`);
  }
}
export function validateEntity(value: unknown, ids: Set<number>, label: string): asserts value is NatureEntity {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new NatureOptionsError('invalid-cell', `${label} must be null or an entity`);
  const entity = value as Partial<NatureEntity>;
  ownKeysOnly(value, ['id', 'kind', 'colour', 'magnetic', 'anchored'], 'invalid-cell', label);
  if (!Number.isSafeInteger(entity.id) || entity.id! < 1 || entity.id! > 0x7fff_ffff || ids.has(entity.id!)) throw new NatureOptionsError(ids.has(entity.id!) ? 'duplicate-id' : 'invalid-cell', `${label} has an invalid or duplicate stable ID`);
  if (entity.kind !== 'stone' && entity.kind !== 'obstacle') throw new NatureOptionsError('invalid-cell', `${label} has an invalid kind`);
  if (entity.kind === 'stone') {
    if (typeof entity.colour !== 'string' || entity.colour.length < 1 || entity.colour.length > 32) throw new NatureOptionsError('invalid-cell', `${label} must have a colour`);
    if (entity.magnetic !== undefined && typeof entity.magnetic !== 'boolean' || entity.anchored !== undefined && typeof entity.anchored !== 'boolean') throw new NatureOptionsError('invalid-cell', `${label} magnetic properties must be boolean`);
    if (entity.anchored && !entity.magnetic) throw new NatureOptionsError('invalid-cell', `${label} cannot be anchored unless it is magnetic`);
  } else if ('colour' in entity || 'magnetic' in entity || 'anchored' in entity) throw new NatureOptionsError('invalid-cell', `${label} obstacle cannot have stone properties`);
  ids.add(entity.id!);
}
export function validateState(state: NatureState): void {
  if (!state || typeof state !== 'object') throw new NatureOptionsError('invalid-nature-options', 'Nature state must be an object');
  ownKeysOnly(state, ['width', 'height', 'activeCells', 'cells', 'seed', 'randomState', 'nextId', 'committedPlacements', 'rules'], 'invalid-nature-options', 'Nature state');
  if (!Array.isArray(state.activeCells) || !Array.isArray(state.cells) || !state.rules || typeof state.rules !== 'object' || Array.isArray(state.rules)) throw new NatureOptionsError('invalid-nature-options', 'Nature state is missing its grid or rules');
  ownKeysOnly(state.rules, ['magneticEnabled', 'reboundEnabled', 'reboundDirectionMode'], 'invalid-nature-options', 'Nature rules');
  if (typeof state.rules.magneticEnabled !== 'boolean' || typeof state.rules.reboundEnabled !== 'boolean' || (state.rules.reboundDirectionMode !== 'input-or-alternate' && state.rules.reboundDirectionMode !== 'seeded')) throw new NatureOptionsError('invalid-nature-options', 'Nature rules are malformed');
  validateNatureOptions({ width: state.width, height: state.height, seed: state.seed, activeCells: state.activeCells, cells: state.cells, magneticEnabled: state.rules?.magneticEnabled, reboundEnabled: state.rules?.reboundEnabled, reboundDirectionMode: state.rules?.reboundDirectionMode });
  if (!Number.isSafeInteger(state.randomState) || state.randomState < 0 || state.randomState > 0xffff_ffff || !Number.isSafeInteger(state.nextId) || state.nextId < 1 || state.nextId > 0x8000_0000 || !Number.isSafeInteger(state.committedPlacements) || state.committedPlacements < 0) throw new NatureOptionsError('invalid-nature-options', 'Nature state counters are malformed');
  const maxId = state.cells.reduce((maximum, entity) => Math.max(maximum, entity?.id ?? 0), 0);
  if (state.nextId <= maxId) throw new NatureOptionsError('invalid-nature-options', 'nextId must be greater than all board IDs');
}
export function validateMarkingOptions(options: MarkingOptions): void {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new NatureOptionsError('invalid-marking-options', 'Marking options must be an object');
  ownKeysOnly(options, ['probability', 'maximum', 'anchoredProbability'], 'invalid-marking-options', 'Marking options');
  if (typeof options.probability !== 'number' || !Number.isFinite(options.probability) || options.probability < 0 || options.probability > 1) throw new NatureOptionsError('invalid-marking-options', 'Magnetic probability must be between zero and one');
  if (options.maximum !== undefined && (!Number.isSafeInteger(options.maximum) || options.maximum < 0 || options.maximum > 1024)) throw new NatureOptionsError('invalid-marking-options', 'Maximum magnetic count must be an integer from zero to 1024');
  if (options.anchoredProbability !== undefined && (typeof options.anchoredProbability !== 'number' || !Number.isFinite(options.anchoredProbability) || options.anchoredProbability < 0 || options.anchoredProbability > 1)) throw new NatureOptionsError('invalid-marking-options', 'Anchored probability must be between zero and one');
}
export function validatePowerDropRequest(state: NatureState, request: PowerDropRequest): void {
  if (!request || typeof request !== 'object' || Array.isArray(request)) throw new NatureOptionsError('invalid-power-drop', 'Power-drop request must be an object');
  ownKeysOnly(request, ['piece', 'pivotId', 'power', 'lastHorizontalDirection', 'quarterTurn'], 'invalid-power-drop', 'Power-drop request');
  if (!Array.isArray(request.piece) || request.piece.length < 1 || request.piece.length > 16 || !Number.isSafeInteger(request.pivotId) || typeof request.power !== 'boolean') throw new NatureOptionsError('invalid-power-drop', 'Power-drop requires 1–16 cells, a pivot ID and a power flag');
  if (request.lastHorizontalDirection !== undefined && request.lastHorizontalDirection !== 'left' && request.lastHorizontalDirection !== 'right') throw new NatureOptionsError('invalid-power-drop', 'Last horizontal direction must be left or right');
  const turns: readonly QuarterTurn[] = [-1, 0, 1];
  if (request.quarterTurn !== undefined && !turns.includes(request.quarterTurn)) throw new NatureOptionsError('invalid-power-drop', 'Quarter-turn must be -1, 0 or 1');
  const ids = new Set<number>(state.cells.flatMap(entity => entity ? [entity.id] : [])); const pieceIds = new Set<number>(); let hasPivot = false;
  for (const [index, cell] of request.piece.entries()) {
    if (!cell || typeof cell !== 'object' || Array.isArray(cell)) throw new NatureOptionsError('invalid-power-drop', `Piece cell ${index} is malformed`);
    ownKeysOnly(cell, ['id', 'kind', 'colour', 'magnetic', 'anchored', 'x', 'y'], 'invalid-power-drop', `Piece cell ${index}`);
    const { x, y, ...entity } = cell;
    if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y) || entity.kind !== 'stone') throw new NatureOptionsError('invalid-power-drop', `Piece cell ${index} has invalid coordinates or is not a stone`);
    validateEntity(entity, ids, `Piece cell ${index}`); pieceIds.add(entity.id); if (entity.id === request.pivotId) hasPivot = true;
    const at = y * state.width + x;
    if (x < 0 || x >= state.width || y < 0 || y >= state.height || !state.activeCells[at] || state.cells[at] !== null) throw new NatureOptionsError('invalid-piece-position', `Piece cell ${index} starts outside an empty active grid cell`);
  }
  if (!hasPivot || pieceIds.size !== request.piece.length) throw new NatureOptionsError('invalid-power-drop', 'Piece cells need unique IDs and must include the pivot ID');
  if (new Set(request.piece.map(cell => `${cell.x},${cell.y}`)).size !== request.piece.length) throw new NatureOptionsError('invalid-power-drop', 'Piece cells cannot overlap');
}
