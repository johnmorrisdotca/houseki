import { test } from 'vitest';
import assert from 'node:assert/strict';
import * as triplets from '../dist/falling-triplets.js';
import * as chains from '../dist/colour-chains.js';
import * as collapse from '../dist/stone-collapse.js';

test('Falling Triplets exposes bounded deep/large presets without changing its default or Daily well', () => {
  const defaults = triplets.createGame();
  assert.deepEqual([defaults.settings.width, defaults.settings.height], [8, 13]);
  const deep = triplets.createGame({ preset: 'deep', seed: 'oversized-triplets' });
  const large = triplets.createGame({ preset: 'large', seed: 'oversized-triplets' });
  assert.deepEqual([deep.settings.width, deep.settings.height, deep.board.length], [8, 32, 8 * 35]);
  assert.deepEqual([large.settings.width, large.settings.height], [12, 24]);
  assert.deepEqual([triplets.createGame({ width: 16, height: 32 }).settings.width, triplets.createGame({ width: 16, height: 32 }).settings.height], [16, 32]);
  assert.deepEqual(deep, triplets.createGame({ preset: 'deep', seed: 'oversized-triplets' }));
  const daily = triplets.createGame({ mode: 'daily', seed: '2026-10-05' });
  assert.deepEqual([daily.settings.width, daily.settings.height], [6, 13]);
  assert.throws(() => triplets.createGame({ mode: 'daily', preset: 'deep', seed: '2026-10-05' }));
  assert.throws(() => triplets.createGame({ width: 16, height: 33 }));
  assert.throws(() => triplets.createGame({ width: 16, height: 32, colourCount: 4, seed: 'x'.repeat(129) }));
});

test('Falling Triplets drops and checkpoints remain within the actual deep well', () => {
  const initial = triplets.createGame({ preset: 'deep', mode: 'arcade', seed: 'triplets-drop' });
  assert.equal(triplets.landingY(initial), 29);
  const placed = triplets.applyAction(initial, { kind: 'hard-drop' });
  assert.equal(placed.accepted, true);
  assert.equal(placed.state.board.length, 8 * 35);
  assert.ok(placed.state.board.every((gem, index) => gem === null || index >= 0 && index < 8 * 35));
  assert.deepEqual(triplets.decodeGame(triplets.encodeGame(placed.state)), placed.state);
  assert.deepEqual([triplets.restartGame(placed.state).settings.width, triplets.restartGame(placed.state).settings.height], [8, 32]);
});

test('Colour Chains keeps standard/Daily canonical settings and supports bounded deep, wide and large wells', () => {
  assert.deepEqual([chains.createGame().settings.width, chains.createGame().settings.height], [6, 12]);
  const daily = chains.createGame({ mode: 'daily', dailyDate: '2026-10-05' });
  assert.deepEqual([daily.settings.width, daily.settings.height, daily.settings.colourCount], [6, 12, 4]);
  assert.deepEqual(chains.decodeGame(chains.encodeGame(daily)), daily);
  assert.deepEqual(chains.restartGame(daily), daily);

  const extraWide = chains.createGame({ preset: 'extraWide', seed: 'chains-bonus' });
  const deep = chains.createGame({ mode: 'arcade', preset: 'deep', seed: 'chains-bonus' });
  const large = chains.createGame({ preset: 'large', seed: 'chains-bonus' });
  assert.deepEqual([extraWide.settings.width, extraWide.settings.height], [12, 12]);
  assert.deepEqual([deep.settings.width, deep.settings.height, deep.board.length], [8, 32, 8 * 35]);
  assert.deepEqual([large.settings.width, large.settings.height], [12, 32]);
  assert.deepEqual(deep, chains.createGame({ mode: 'arcade', preset: 'deep', seed: 'chains-bonus' }));
  const landing = chains.landingCells(deep);
  assert.ok(landing?.every(cell => cell.x >= 0 && cell.x < 8 && cell.y >= 0 && cell.y < 32));
  const placed = chains.applyAction(deep, { kind: 'hard-drop' });
  assert.equal(placed.accepted, true);
  assert.deepEqual(chains.decodeGame(chains.encodeGame(placed.state)), placed.state);
  assert.deepEqual([chains.restartGame(placed.state).settings.width, chains.restartGame(placed.state).settings.height], [8, 32]);
  assert.throws(() => chains.createGame({ width: 16, height: 33 }));
  assert.deepEqual([chains.createGame({ width: 16, height: 32 }).settings.width, chains.createGame({ width: 16, height: 32 }).settings.height], [16, 32]);
  assert.throws(() => chains.createGame({ width: 16, height: 33 }));
});

test('Stone Collapse deep, extra-wide and large boards keep stable groups, gravity and replay bounded', () => {
  assert.deepEqual([collapse.createGame().settings.width, collapse.createGame().settings.height], [8, 10]);
  const daily = collapse.createGame({ mode: 'daily', dailyDate: '2026-10-05' });
  assert.deepEqual([daily.settings.width, daily.settings.height, daily.settings.colourCount], [8, 10, 4]);
  assert.deepEqual(collapse.decodeGame(collapse.encodeGame(daily)), daily);
  assert.deepEqual(collapse.restartGame(daily), daily);

  const extraWide = collapse.createGame({ preset: 'extraWide', seed: 'collapse-bonus' });
  const deep = collapse.createGame({ preset: 'deep', seed: 'collapse-bonus' });
  const large = collapse.createGame({ preset: 'large', seed: 'collapse-bonus' });
  assert.deepEqual([extraWide.settings.width, extraWide.settings.height], [16, 10]);
  assert.deepEqual([deep.settings.width, deep.settings.height, deep.board.length], [8, 32, 256]);
  assert.deepEqual([large.settings.width, large.settings.height], [12, 32]);
  assert.deepEqual(deep, collapse.createGame({ preset: 'deep', seed: 'collapse-bonus' }));
  assert.ok(collapse.legalActions(deep).length <= 512 + 4);
  const remove = collapse.legalActions(deep).find(action => action.kind === 'select');
  assert.ok(remove);
  const selected = collapse.applyAction(deep, remove);
  const committed = collapse.applyAction(selected.state, { kind: 'confirm' });
  assert.equal(committed.accepted, true);
  const legacyCheckpoint = JSON.parse(collapse.encodeGame(committed.state));
  legacyCheckpoint.checkpoint.history = committed.state.history;
  assert.deepEqual(collapse.decodeGame(JSON.stringify(legacyCheckpoint)), committed.state);
  let settled = committed.state; let work = 0;
  while (['clear-mark', 'clear-remove', 'gravity'].includes(settled.phase) && work++ < 100) settled = collapse.advanceTicks(settled, 3600).state;
  assert.ok(work < 100, 'resolution remains bounded');
  assert.equal(settled.board.length, 256);
  for (let x = 0; x < settled.settings.width; x++) {
    let sawGap = false;
    for (let y = settled.settings.height - 1; y >= 0; y--) {
      const stone = settled.board[y * settled.settings.width + x];
      if (stone && sawGap) assert.fail(`gravity left a hole below a stone in column ${x}`);
      if (!stone && settled.settings.mask[y * settled.settings.width + x]) sawGap = true;
    }
  }
  const encodedDeep = collapse.encodeGame(deep);
  assert.equal(Object.hasOwn(JSON.parse(encodedDeep).checkpoint, 'history'), false);
  assert.deepEqual(collapse.decodeGame(encodedDeep), deep);
  assert.deepEqual([collapse.restartGame(settled).settings.width, collapse.restartGame(settled).settings.height], [8, 32]);
  assert.throws(() => collapse.createGame({ width: 16, height: 33 }));
  assert.deepEqual([collapse.createGame({ width: 16, height: 32 }).settings.width, collapse.createGame({ width: 16, height: 32 }).settings.height], [16, 32]);
});
