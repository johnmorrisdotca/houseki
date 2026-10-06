import { test } from 'vitest';
import assert from 'node:assert/strict';
import { createGame, createChallenge, applyAction, advanceTicks, encodeGame, decodeGame, restartGame, StoneChainsOptionsError } from '../dist/colour-chains.js';
import { powerDropPreview } from '../dist/colour-chains/engine.js';

const W = 6; const H = 12; const FULL = H + 3;
function put(board, x, y, colour, id, magnetic = false) {
  board[(y + 3) * W + x] = { id, colour, ...(magnetic ? { magnetic: true } : {}) };
}
function active(colours = ['blue', 'gold'], pivot = { x: 3, y: 10 }, orientation = 'up') {
  return { pivot, orientation, gems: [{ id: 9001, colour: colours[0] }, { id: 9002, colour: colours[1] }], level: 1, gravityTicks: 0, groundedTicks: 0, resetCount: 0, groundedStarted: false };
}

test('Shizen is opt-in, Daily and Challenges reject it, and the ordinary seeded stream stays exact', () => {
  const ordinary = createGame({ mode: 'arcade', seed: 'same' });
  assert.deepEqual(createGame({ mode: 'arcade', seed: 'same', nature: false }), ordinary);
  const shizen = createGame({ mode: 'arcade', seed: 'same', nature: true });
  assert.equal(shizen.settings.nature, true);
  assert.deepEqual(shizen.active.gems.map(gem => gem.colour), ordinary.active.gems.map(gem => gem.colour));
  assert.deepEqual(shizen.next, ordinary.next);
  assert.deepEqual(shizen.bag, ordinary.bag);
  assert.equal(shizen.randomState, ordinary.randomState);
  assert.deepEqual(shizen, createGame({ mode: 'arcade', seed: 'same', nature: true }));
  assert.equal(shizen.nextMagnetic.length, shizen.next.length);
  const markedPreview = createGame({ seed: 'mark-1', nature: true });
  assert.deepEqual(markedPreview.nextMagnetic[2], [true, false]);
  assert.deepEqual(decodeGame(encodeGame(markedPreview)), markedPreview);
  const flaggedQueue = { ...createGame({ mode: 'arcade', seed: 'queue-id', nature: true }), nextMagnetic: [[true, false], [false, false], [false, false]] };
  const spawned = applyAction(flaggedQueue, { kind: 'hard-drop' });
  assert.deepEqual(spawned.state.active.gems.map(gem => [gem.id, gem.magnetic === true]), [[3, true], [4, false]]);
  assert.throws(() => createGame({ mode: 'daily', dailyDate: '2026-10-05', nature: true }), StoneChainsOptionsError);
  assert.throws(() => createGame({ nature: 'yes' }), StoneChainsOptionsError);
  assert.throws(() => createChallenge({ id: 'plain', board: Array(W * H).fill(null), queue: [['red', 'blue'], ['green', 'gold']], goal: { kind: 'empty-board' }, witness: [{ pivotX: 2, orientation: 'up' }], nature: true }), StoneChainsOptionsError);
});

test('the power-drop preview is immutable, rebounds once, and gentle Place has no rebound', () => {
  let state = createGame({ mode: 'arcade', seed: 'bounce', nature: true });
  state = { ...state, active: active(), lastHorizontalDirection: 'left' };
  const before = state;
  const preview = powerDropPreview(state);
  assert.ok(preview);
  assert.equal(preview.rebound, true);
  assert.equal(preview.selectedDirection, 'left');
  assert.equal(preview.moves.length, 2);
  assert.strictEqual(state, before);
  const landed = applyAction(state, { kind: 'hard-drop' });
  assert.equal(landed.accepted, true);
  const event = landed.events.find(item => item.type === 'power-drop-landed');
  assert.equal(event.rebound, true);
  assert.deepEqual(event.moves, preview.moves);
  assert.deepEqual(event.cells.map(cell => [cell.id, cell.x, cell.y]), preview.finalCells.map(cell => [cell.id, cell.x, cell.y]));
  assert.deepEqual(landed.state.board.filter(Boolean).map(gem => gem.id).sort((a, b) => a - b).slice(-2), [9001, 9002]);

  const relaxed = createGame({ seed: 'gentle', nature: true });
  const placed = applyAction({ ...relaxed, active: active() }, { kind: 'place' });
  assert.equal(placed.accepted, true);
  assert.equal(placed.events.some(item => item.type === 'power-drop-landed'), false);
  assert.equal(powerDropPreview({ ...relaxed, active: active() }), null);

  const blockedBoard = Array(W * FULL).fill(null);
  put(blockedBoard, 1, 10, 'teal', 7001); put(blockedBoard, 1, 11, 'teal', 7002);
  put(blockedBoard, 3, 10, 'teal', 7003); put(blockedBoard, 3, 11, 'teal', 7004);
  const blocked = { ...createGame({ mode: 'arcade', seed: 'blocked', nature: true }), board: blockedBoard, active: active(['blue', 'gold'], { x: 2, y: 10 }) };
  const blockedPreview = powerDropPreview(blocked);
  assert.equal(blockedPreview.rebound, false);
  assert.deepEqual(blockedPreview.attempts.map(attempt => attempt.valid), [false, false]);
});

test('one attraction pulse runs before match detection and reports stable-ID destinations', () => {
  const board = Array(W * FULL).fill(null);
  put(board, 1, 6, 'red', 11, true); put(board, 4, 6, 'red', 14, true);
  put(board, 2, 5, 'red', 22); put(board, 3, 5, 'red', 23);
  let state = createGame({ mode: 'arcade', seed: 'magnet', nature: true });
  state = { ...state, board, active: active(['blue', 'gold'], { x: 3, y: 10 }), lastHorizontalDirection: 'right' };
  const result = applyAction(state, { kind: 'hard-drop' });
  assert.equal(result.state.phase, 'clear-mark');
  const pulse = result.events.find(event => event.type === 'magnetic-pulse');
  assert.deepEqual(pulse.moves.map(move => move.id).sort((a, b) => a - b), [11, 14]);
  assert.deepEqual(pulse.moves.map(move => [move.from.x, move.to.x]), [[1, 2], [4, 3]]);
  const match = result.events.find(event => event.type === 'match-marked');
  assert.deepEqual(match.ids.slice().sort((a, b) => a - b), [11, 14, 22, 23]);
  assert.equal(result.state.naturePulsePending, false);
  assert.deepEqual(result.state.board.filter(Boolean).filter(gem => gem.id === 11 || gem.id === 14).map(gem => [gem.id, gem.magnetic]), [[11, true], [14, true]]);
});

test('an initial clear defers the single pulse until removal and replay verifies Shizen state', () => {
  const board = Array(W * FULL).fill(null);
  put(board, 1, 6, 'red', 31, true); put(board, 4, 6, 'red', 34, true);
  put(board, 2, 5, 'red', 32); put(board, 3, 5, 'red', 33);
  put(board, 0, 11, 'blue', 41); put(board, 1, 11, 'blue', 42); put(board, 2, 11, 'blue', 43); put(board, 3, 11, 'blue', 44);
  let state = createGame({ mode: 'arcade', seed: 'deferred', nature: true });
  state = { ...state, board, active: active(['red', 'blue'], { x: 5, y: 10 }), lastHorizontalDirection: 'right' };
  let result = applyAction(state, { kind: 'hard-drop' });
  assert.equal(result.state.phase, 'clear-mark');
  assert.equal(result.state.naturePulsePending, true);
  assert.equal(result.events.some(event => event.type === 'magnetic-pulse'), false);
  result = advanceTicks(result.state, 13);
  assert.equal(result.events.filter(event => event.type === 'magnetic-pulse').length, 1);
  const settled = advanceTicks(result.state, 120);
  assert.equal(settled.events.filter(event => event.type === 'magnetic-pulse').length, 0);
  let recorded = createGame({ mode: 'arcade', seed: 'recorded-shizen', nature: true });
  recorded = applyAction(recorded, { kind: 'hard-drop' }).state;
  recorded = advanceTicks(recorded, 4).state;
  const encoded = encodeGame(recorded);
  assert.deepEqual(decodeGame(encoded), recorded);
  const restarted = restartGame(recorded);
  assert.equal(restarted.settings.nature, true);
  assert.deepEqual(restarted.active.gems.map(gem => gem.magnetic === true), createGame({ mode: 'arcade', seed: 'recorded-shizen', nature: true }).active.gems.map(gem => gem.magnetic === true));
});
