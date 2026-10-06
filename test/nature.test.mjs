import { test } from 'vitest';
import assert from 'node:assert/strict';
import { applyMagneticPulse, applyPowerDrop, createNatureState, markMagneticStones, NatureOptionsError, previewMagneticPulse, previewPowerDrop } from '../dist/nature.js';

const stone = (id, colour = 'jade', props = {}) => ({ id, kind: 'stone', colour, ...props });
const obstacle = id => ({ id, kind: 'obstacle' });
const piece = (id, x, y, props = {}) => ({ ...stone(id, 'ruby', props), x, y });
const board = (width, height, placements = [], extra = {}) => {
  const cells = Array(width * height).fill(null);
  for (const [x, y, entity] of placements) cells[y * width + x] = entity;
  return createNatureState({ width, height, cells, seed: 'fixture-seed', ...extra });
};

test('magnetic midpoint collision uses the lower stable ID and keeps both identities', () => {
  const state = board(5, 1, [[0, 0, stone(20, 'jade', { magnetic: true })], [4, 0, stone(3, 'ruby', { magnetic: true })]]);
  const preview = previewMagneticPulse(state);
  assert.deepEqual(preview.pairs.map(pair => pair.ids), [[3, 20]]);
  assert.deepEqual(preview.pairs[0].moves.map(move => [move.id, move.from.x, move.to.x]), [[20, 0, 1], [3, 4, 3], [3, 3, 2]]);
  assert.deepEqual(preview.cells.map(cell => cell?.id ?? null), [null, 20, 3, null, null]);
  const result = applyMagneticPulse(state);
  assert.equal(result.state.cells[1]?.id, 20);
  assert.equal(result.state.cells[2]?.id, 3);
  assert.equal(state.cells[0]?.id, 20);
});

test('obstacles and mask gaps stop attraction; disabled parity is exact', () => {
  const blocked = board(5, 1, [[0, 0, stone(1, 'jade', { magnetic: true })], [2, 0, obstacle(2)], [4, 0, stone(3, 'ruby', { magnetic: true })]]);
  assert.deepEqual(previewMagneticPulse(blocked).moves, []);
  const masked = board(5, 1, [[0, 0, stone(1, 'jade', { magnetic: true })], [4, 0, stone(2, 'ruby', { magnetic: true })]], { activeCells: [true, true, false, true, true] });
  assert.deepEqual(previewMagneticPulse(masked).moves, []);
  const disabled = createNatureState({ width: 3, height: 1, cells: [stone(1, 'jade', { magnetic: true }), null, stone(2, 'ruby', { magnetic: true })], magneticEnabled: false });
  assert.equal(applyMagneticPulse(disabled).state, disabled);
  assert.deepEqual(previewMagneticPulse(disabled).cells, disabled.cells);
});

test('candidate pairs prioritize gap then stable IDs and do not reuse a magnet', () => {
  const state = board(7, 1, [[0, 0, stone(9, 'a', { magnetic: true })], [3, 0, stone(8, 'b', { magnetic: true })], [6, 0, stone(1, 'c', { magnetic: true })]]);
  const preview = previewMagneticPulse(state);
  assert.equal(preview.pairs.length, 1);
  assert.deepEqual(preview.pairs[0].ids, [1, 8]);
});

test('vertical attraction moves only the free stone toward an anchored partner', () => {
  const state = board(1, 5, [[0, 0, stone(12, 'jade', { magnetic: true, anchored: true })], [0, 4, stone(2, 'ruby', { magnetic: true })]]);
  const preview = previewMagneticPulse(state);
  assert.deepEqual(preview.pairs.map(pair => [pair.axis, pair.anchoredId, pair.ids]), [['vertical', 12, [2, 12]]]);
  assert.deepEqual(preview.cells.map(cell => cell?.id ?? null), [12, 2, null, null, null]);
  assert.equal(preview.moves.some(move => move.id === 12), false);
});

test('magnetic marking is replayable, bounded, stable-ID preserving, and immutable', () => {
  const state = board(6, 1, Array.from({ length: 6 }, (_, x) => [x, 0, stone(x + 1, `c${x}`)]));
  const options = { probability: 1, maximum: 3, anchoredProbability: 1 };
  const first = markMagneticStones(state, options), second = markMagneticStones(state, options);
  assert.deepEqual(first.state, second.state);
  assert.deepEqual(first.events, second.events);
  assert.deepEqual(first.events[0].ids, [1, 2, 3]);
  assert.deepEqual(first.state.cells.slice(0, 3).map(cell => [cell.id, cell.colour, cell.magnetic, cell.anchored]), [[1, 'c0', true, true], [2, 'c1', true, true], [3, 'c2', true, true]]);
  assert.equal(state.cells[0].magnetic, undefined);
  const noOp = markMagneticStones(state, { probability: 0.5, maximum: 0 });
  assert.equal(noOp.state, state);
});

test('power drop previews one normal landing, tries preferred side then opposite, and commits immutably', () => {
  const state = board(5, 6, [[1, 4, obstacle(10)], [2, 5, obstacle(11)]]);
  const request = { piece: [piece(1, 2, 0)], pivotId: 1, power: true, lastHorizontalDirection: 'left' };
  const preview = previewPowerDrop(state, request);
  assert.deepEqual(preview.normalLanding.map(cell => [cell.x, cell.y]), [[2, 4]]);
  assert.deepEqual(preview.attempts, [{ direction: 'left', quarterTurn: 0, valid: false }, { direction: 'right', quarterTurn: 0, valid: true }]);
  assert.deepEqual(preview.finalCells.map(cell => [cell.id, cell.x, cell.y]), [[1, 3, 4]]);
  const result = applyPowerDrop(state, request);
  assert.equal(result.accepted, true);
  assert.equal(result.state.cells[4 * 5 + 3]?.id, 1);
  assert.equal(state.cells[4 * 5 + 3], null);
  assert.equal(result.state.committedPlacements, 1);
});

test('quarter turn is applied around the pivot only with a fully valid rebound footprint', () => {
  const state = board(5, 6, [[2, 5, obstacle(10)]]);
  const request = { piece: [piece(1, 2, 0), piece(2, 2, 1)], pivotId: 1, power: true, lastHorizontalDirection: 'left', quarterTurn: 1 };
  const preview = previewPowerDrop(state, request);
  assert.deepEqual(preview.normalLanding.map(cell => [cell.id, cell.x, cell.y]), [[1, 2, 3], [2, 2, 4]]);
  assert.deepEqual(preview.finalCells.map(cell => [cell.id, cell.x, cell.y]), [[1, 1, 3], [2, 0, 3]]);
  const edge = board(3, 6, [[1, 4, obstacle(10)]]);
  const edgePreview = previewPowerDrop(edge, { ...request, piece: [piece(1, 0, 0), piece(2, 0, 1)], lastHorizontalDirection: 'left' });
  assert.equal(edgePreview.rebound, false);
  assert.deepEqual(edgePreview.finalCells.map(cell => [cell.x, cell.y]), [[0, 4], [0, 5]]);
});

test('one-cell rebound obeys masked destinations and falls back to ordinary landing when both sides fail', () => {
  const state = board(3, 5, [], { activeCells: [true, true, true, true, true, true, true, true, true, true, true, true, false, true, false] });
  const preview = previewPowerDrop(state, { piece: [piece(1, 1, 0)], pivotId: 1, power: true });
  assert.deepEqual(preview.normalLanding.map(cell => [cell.x, cell.y]), [[1, 4]]);
  assert.equal(preview.rebound, false);
  assert.deepEqual(preview.attempts.map(attempt => attempt.valid), [false, false]);
  assert.deepEqual(preview.finalCells.map(cell => [cell.x, cell.y]), [[1, 4]]);
});

test('gentle placement and disabled rebound match ordinary landing without RNG consumption', () => {
  const state = board(4, 5, [], { reboundDirectionMode: 'seeded' });
  const base = { piece: [piece(1, 2, 0)], pivotId: 1, lastHorizontalDirection: 'right' };
  const gentle = previewPowerDrop(state, { ...base, power: false });
  const disabled = previewPowerDrop(createNatureState({ width: 4, height: 5, reboundEnabled: false, seed: state.seed }), { ...base, power: true });
  assert.equal(gentle.rebound, false);
  assert.deepEqual(gentle.finalCells.map(cell => [cell.x, cell.y]), [[2, 4]]);
  assert.deepEqual(disabled.finalCells.map(cell => [cell.x, cell.y]), [[2, 4]]);
  assert.equal(gentle.randomStateAfter, state.randomState);
  assert.equal(disabled.randomStateAfter, state.randomState);
  assert.deepEqual(gentle.attempts, []);
});

test('fallback alternates by committed placement; seeded preview and commit replay exactly', () => {
  const state = board(5, 5);
  const request = { piece: [piece(1, 2, 0)], pivotId: 1, power: true };
  assert.equal(previewPowerDrop(state, request).selectedDirection, 'left');
  const first = applyPowerDrop(state, request);
  const secondRequest = { piece: [piece(2, 2, 0)], pivotId: 2, power: true };
  assert.equal(previewPowerDrop(first.state, secondRequest).selectedDirection, 'right');
  const seededA = createNatureState({ width: 5, height: 5, seed: 'same', reboundDirectionMode: 'seeded' });
  const seededB = createNatureState({ width: 5, height: 5, seed: 'same', reboundDirectionMode: 'seeded' });
  assert.deepEqual(applyPowerDrop(seededA, request), applyPowerDrop(seededB, request));
});

test('invalid public options and invalid piece placement are rejected without state mutation', () => {
  assert.throws(() => createNatureState({ width: 33, height: 1 }), error => error instanceof NatureOptionsError && error.code === 'invalid-grid-size');
  assert.throws(() => createNatureState({ width: 2, height: 1, cells: [stone(1), stone(1)] }), error => error instanceof NatureOptionsError && error.code === 'duplicate-id');
  const state = board(3, 3);
  assert.throws(() => previewPowerDrop(state, { piece: [piece(1, 1, 0)], pivotId: 2, power: true }), error => error instanceof NatureOptionsError && error.code === 'invalid-power-drop');
  assert.throws(() => previewMagneticPulse({ ...state, unexpected: true }), error => error instanceof NatureOptionsError && error.code === 'invalid-nature-options');
  assert.equal(state.cells.every(cell => cell === null), true);
});
