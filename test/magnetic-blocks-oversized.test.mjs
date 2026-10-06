import { test } from 'vitest';
import assert from 'node:assert/strict';
import { createGame, applyAction, encodeGame, decodeGame, restartGame, MagneticBlocksOptionsError } from '../dist/magnetic-blocks.js';

test('16×32 / 512-cell boards construct, play, restart, and replay canonically', () => {
  const initial = createGame({ width: 16, height: 32, seed: 'oversized-magnetic', pieceLimit: 2, floorSwitch: true, magneticImpact: true });
  assert.equal(initial.board.length, 512);
  assert.equal(initial.settings.width, 16);
  assert.equal(initial.settings.height, 32);
  let game = applyAction(initial, { kind: 'set-floor-override', floor: 'magnetic' }).state;
  game = applyAction(game, { kind: 'hard-drop' }).state;
  assert.deepEqual(decodeGame(encodeGame(game)), game);
  assert.deepEqual(restartGame(game), initial);
});

test('oversized dimensions and malformed board areas are rejected at the public constructor', () => {
  assert.throws(() => createGame({ width: 17, height: 16 }), MagneticBlocksOptionsError);
  assert.throws(() => createGame({ width: 16, height: 33 }), MagneticBlocksOptionsError);
  assert.throws(() => createGame({ width: 16, height: 32, mask: Array(511).fill(true) }), MagneticBlocksOptionsError);
  assert.throws(() => createGame({ width: 16, height: 32, initialBoard: Array(513).fill(null) }), MagneticBlocksOptionsError);
});
