import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAction, createGame, decodeGame, encodeGame, legalActions, restartGame, GemSwapOptionsError } from '../dist/gem-swap.js';
import { findMatches } from '../dist/gem-swap/board.js';

const presets = [
  ['extraWide', 16, 10],
  ['deep', 8, 32],
  ['large', 12, 32],
];

test('larger presets generate stable boards with legal swaps and canonical replay', () => {
  for (const [preset, width, height] of presets) {
    for (const seed of ['oversized-a', 'oversized-b']) {
      const state = createGame({ preset, seed });
      assert.equal(state.settings.width, width, preset);
      assert.equal(state.settings.height, height, preset);
      assert.equal(state.board.length, width * height, preset);
      assert.ok(state.board.every(Boolean), preset);
      assert.equal(findMatches(state.board, state.settings).length, 0, preset);
      const actions = legalActions(state);
      assert.ok(actions.some(action => action.kind === 'swap'), preset);
      const moved = applyAction(state, actions[0]);
      assert.equal(moved.accepted, true, preset);
      assert.deepEqual(decodeGame(encodeGame(moved.state)), moved.state, preset);
      assert.deepEqual(restartGame(moved.state), state, preset);
    }
  }
});

test('custom dimensions use the 512-cell ceiling and reject unsafe bounds before allocation', () => {
  const maximum = createGame({ width: 16, height: 32, seed: 'maximum-board' });
  assert.equal(maximum.board.length, 512);
  assert.equal(findMatches(maximum.board, maximum.settings).length, 0);
  assert.ok(legalActions(maximum).some(action => action.kind === 'swap'));
  assert.throws(() => createGame({ width: 17, height: 16 }), GemSwapOptionsError);
  assert.throws(() => createGame({ width: 16, height: 33 }), GemSwapOptionsError);
  assert.throws(() => createGame({ width: 16, height: 33, mask: [] }), GemSwapOptionsError);
  assert.throws(() => createGame({ width: Number.MAX_SAFE_INTEGER, height: 4 }), GemSwapOptionsError);
  assert.throws(() => createGame({ width: 16, height: 32, mask: Array(511).fill(true) }), GemSwapOptionsError);
});

test('Daily remains canonical and does not accept oversized presets', () => {
  const daily = createGame({ mode: 'daily', dailyDate: '2026-10-05' });
  assert.equal(daily.settings.width, 8);
  assert.equal(daily.settings.height, 8);
  assert.throws(() => createGame({ mode: 'daily', dailyDate: '2026-10-05', preset: 'large' }), error => error instanceof GemSwapOptionsError && error.code === 'daily-settings-fixed');
});
