import { test } from 'vitest';
import assert from 'node:assert/strict';
import { advanceTicks, applyAction, blockCells, calmGravity, createGame, decodeGame, encodeGame, impactSupportIds, legalActions, magneticGravity, removeIds, restartGame, statusOf } from '../dist/magnetic-blocks.js';

const queue = Object.freeze([Object.freeze(['red', 'red', 'red', 'red'])]);
const nullBoard = (width, height) => Array(width * height).fill(null);
function independentColourComponent(board, start, width, height, mask) {
  const gem = board[start]; if (!gem) return [];
  const pending = [start], found = new Set(pending);
  while (pending.length) {
    const at = pending.pop(), x = at % width, y = Math.floor(at / width);
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const next = ny * width + nx;
      if (mask[next] && board[next]?.colour === gem.colour && !found.has(next)) { found.add(next); pending.push(next); }
    }
  }
  return [...found].sort((a, b) => a - b);
}

function passResolution(state) {
  let current = state;
  for (let i = 0; i < 8 && ['gravity', 'clear-mark', 'clear-remove'].includes(current.phase); i++) {
    const ticks = current.phase === 'gravity' ? 9 : current.phase === 'clear-mark' ? 7 : 6;
    current = advanceTicks(current, ticks).state;
  }
  return current;
}

test('seeded games, frozen public values, strict options, stable gem identity under rotation', () => {
  const a = createGame({ width: 6, height: 8, seed: 'magnetic-core', pieceLimit: 2 });
  const b = createGame({ width: 6, height: 8, seed: 'magnetic-core', pieceLimit: 2 });
  assert.deepEqual(a, b);
  assert.ok(Object.isFrozen(a) && Object.isFrozen(a.board) && Object.isFrozen(a.queue) && Object.isFrozen(a.active.gems));
  const positions = n => blockCells({ ...a.active, orientation: n }, 6).map(item => [item.gem.id, item.index]).sort((x, y) => x[0] - y[0]);
  assert.deepEqual(positions(0), positions(4));
  assert.deepEqual(positions(0).map(([id]) => id), positions(1).map(([id]) => id));
  assert.notDeepEqual(positions(0).map(([, index]) => index), positions(1).map(([, index]) => index));
  assert.throws(() => createGame({ width: 6, height: 8, mask: [true, ...Array(47).fill(false)] }), /Mask|mask/);
  assert.throws(() => createGame({ width: 6, height: 8, queue: [['red', 'red', 'red', 'red']], pieceLimit: 2 }), /queue|Queue/);
});

test('calm bonds bridge a one-cell unsupported gap while magnetic columns split and fall independently', () => {
  const board = nullBoard(6, 6);
  board[3 * 6 + 2] = { id: 1, colour: 'red' };
  board[3 * 6 + 3] = { id: 2, colour: 'blue' };
  board[4 * 6 + 2] = { id: 3, colour: 'green' };
  const bonds = [{ a: 1, b: 2 }];
  const calm = calmGravity(board, bonds, 6, 6, Array(36).fill(true));
  assert.equal(calm[4 * 6 + 2]?.id, 1);
  assert.equal(calm[4 * 6 + 3]?.id, 2);
  const magnetic = magneticGravity(board, 6, 6, Array(36).fill(true));
  assert.equal(magnetic[5 * 6 + 2]?.id, 3);
  assert.equal(magnetic[5 * 6 + 3]?.id, 2);
  assert.equal(magnetic[4 * 6 + 2]?.id, 1);
  const result = removeIds(board, bonds, [3 * 6 + 2]);
  assert.deepEqual(result.bonds, []);
  assert.deepEqual(result.ids, [1]);
});

test('floor schedules are explicit and a Floor Switch is free until a committed placement', () => {
  for (const [schedule, floors] of [
    [{ kind: 'frequent' }, ['calm', 'magnetic', 'calm', 'magnetic']],
    [{ kind: 'occasional' }, ['calm', 'calm', 'calm', 'magnetic']],
    [{ kind: 'infrequent' }, ['calm', 'calm', 'calm', 'calm', 'calm', 'calm', 'calm', 'magnetic']],
    [{ kind: 'mid-level', placement: 2 }, ['calm', 'magnetic', 'calm']],
    [{ kind: 'authored', magneticPlacements: [2, 4], defaultFloor: 'calm' }, ['calm', 'magnetic', 'calm', 'magnetic']],
  ]) {
    let state = createGame({ width: 6, height: 20, schedule, queue: Array.from({ length: floors.length }, () => ['red', 'red', 'red', 'red']), pieceLimit: floors.length });
    for (let i = 0; i < floors.length; i++) {
      assert.equal(state.floor, floors[i]);
      const before = state.floorSwitchCharges;
      state = applyAction(state, { kind: 'hard-drop' }).state;
      assert.equal(state.floorSwitchCharges, before);
      state = passResolution(state);
    }
  }
  let switched = createGame({ width: 6, height: 20, floorSwitch: true, schedule: { kind: 'fixed', floor: 'calm' }, queue });
  const selected = applyAction(switched, { kind: 'set-floor-override', floor: 'magnetic' });
  assert.equal(selected.state.floorSwitchCharges, 1);
  const cancelled = applyAction(selected.state, { kind: 'cancel-floor-override' });
  assert.equal(cancelled.state.floorSwitchCharges, 1);
  assert.equal(cancelled.state.pendingFloorOverride, null);
  switched = applyAction(cancelled.state, { kind: 'set-floor-override', floor: 'magnetic' }).state;
  switched = applyAction(switched, { kind: 'hard-drop' }).state;
  assert.equal(switched.floor, 'magnetic');
  assert.equal(switched.floorSwitchCharges, 0);
  assert.equal(switched.nextFloor, 'calm');
  assert.equal(statusOf(switched).floorSwitchCharges, 0);
  assert.ok(!legalActions(switched).some(action => action.kind === 'set-floor-override'));
});

test('Magnetic Impact removes only direct supports at first contact, once, and preserves incoming IDs', () => {
  const board = nullBoard(6, 8);
  board[6 * 6 + 2] = { id: 1, colour: 'blue' };
  board[6 * 6 + 3] = { id: 2, colour: 'green' };
  board[7 * 6 + 2] = { id: 3, colour: 'gold' };
  board[7 * 6 + 3] = { id: 4, colour: 'gold' };
  const setup = { width: 6, height: 8, initialBoard: board, queue, pieceLimit: 1, schedule: { kind: 'fixed', floor: 'magnetic' } };
  const normal = applyAction(createGame({ ...setup, magneticImpact: false }), { kind: 'hard-drop' }).state;
  const impacted = applyAction(createGame({ ...setup, magneticImpact: true }), { kind: 'hard-drop' }).state;
  assert.deepEqual(impacted.impactRemovedIds, [1, 2]);
  assert.ok(normal.board.some(gem => gem?.id === 1) && normal.board.some(gem => gem?.id === 2));
  assert.ok(impacted.board.some(gem => gem?.id === 3));
  assert.deepEqual(impacted.board.filter(Boolean).map(gem => gem.id).sort((x, y) => x - y), [3, 4, 5, 6, 7, 8]);
  assert.deepEqual(impactSupportIds({ ...createGame({ ...setup, magneticImpact: true }).active, y: 4 }, board, 6, 8, Array(48).fill(true)), [1, 2]);
  assert.deepEqual(applyAction(createGame({ ...setup, magneticImpact: false }), { kind: 'hard-drop' }).state.board, normal.board);
  const noDamageSoft = createGame({ ...setup, magneticImpact: true });
  const soft = applyAction(noDamageSoft, { kind: 'soft-drop' });
  assert.deepEqual(soft.state.impactRemovedIds, []);
});

test('matching has visible mark, removed-hole, then settled snapshots with deterministic score', () => {
  const board = nullBoard(6, 8);
  board[7 * 6 + 2] = { id: 1, colour: 'red' };
  board[7 * 6 + 3] = { id: 2, colour: 'red' };
  board[7 * 6] = { id: 3, colour: 'gold' };
  let state = createGame({ width: 6, height: 8, initialBoard: board, queue, pieceLimit: 1, schedule: { kind: 'fixed', floor: 'calm' } });
  state = applyAction(state, { kind: 'hard-drop' }).state;
  state = advanceTicks(state, 9).state;
  assert.equal(state.phase, 'clear-mark');
  const expected = independentColourComponent(state.board, 6 * 5 + 2, 6, 8, state.settings.mask);
  assert.equal(expected.length, 6);
  assert.deepEqual(state.pendingClear, expected);
  const mark = advanceTicks(state, 6).state;
  assert.deepEqual(mark.board, state.board);
  const removal = advanceTicks(mark, 1).state;
  assert.equal(removal.phase, 'clear-remove');
  assert.ok(removal.board.some(gem => gem === null));
  assert.ok(removal.gravityBoard.some(gem => gem !== null));
  const gravity = advanceTicks(advanceTicks(removal, 6).state, 9).state;
  assert.equal(gravity.score, 60);
  assert.equal(gravity.phase, 'finished');
  assert.equal(gravity.maxChain, 1);
});

test('Relaxed stays untimed; Arcade falls at 60 Hz and starts a bounded lock delay on contact', () => {
  const relaxed = createGame({ mode: 'relaxed', width: 6, height: 8, seed: 'clock-parity' });
  const relaxedTicks = advanceTicks(relaxed, 120).state;
  assert.equal(relaxedTicks.active.y, relaxed.active.y);
  assert.equal(relaxedTicks.elapsedTicks, 120);
  const arcade = createGame({ mode: 'arcade', width: 6, height: 8, seed: 'clock-parity' });
  const beforeStep = advanceTicks(arcade, 59).state;
  assert.equal(beforeStep.active.y, 0);
  const firstStep = advanceTicks(beforeStep, 1).state;
  assert.equal(firstStep.active.y, 1);
  const contact = advanceTicks(arcade, 360).state;
  assert.equal(contact.active.y, 6);
  assert.equal(contact.active.lockStarted, true);
  assert.equal(contact.active.lockTicks, 0);
  const almost = advanceTicks(contact, 23).state;
  assert.equal(almost.active.lockTicks, 23);
  assert.deepEqual(decodeGame(encodeGame(almost)), almost);
  const landed = advanceTicks(almost, 1).state;
  assert.equal(landed.phase, 'gravity');
  assert.equal(landed.placements, 1);
});

test('grounded rotation has eight Arcade lock resets; the ninth preserves expiry and hard drop is immediate', () => {
  let state = advanceTicks(createGame({ mode: 'arcade', width: 6, height: 8, seed: 'reset-clock' }), 360).state;
  for (let i = 0; i < 8; i++) {
    state = advanceTicks(state, 23).state;
    assert.equal(state.active.lockTicks, 23);
    state = applyAction(state, { kind: 'rotate-clockwise' }).state;
    assert.equal(state.active.lockTicks, 0);
    assert.equal(state.active.lockResets, i + 1);
  }
  state = advanceTicks(state, 23).state;
  assert.equal(state.active.lockTicks, 23);
  state = applyAction(state, { kind: 'rotate-clockwise' }).state;
  assert.equal(state.active.lockTicks, 23);
  assert.equal(state.active.lockResets, 8);
  const locked = advanceTicks(state, 1).state;
  assert.equal(locked.placements, 1);
  const dropped = applyAction(createGame({ mode: 'arcade', width: 6, height: 8, seed: 'hard-drop-clock' }), { kind: 'hard-drop' }).state;
  assert.equal(dropped.placements, 1);
  assert.equal(dropped.phase, 'gravity');
});

test('pause freezes Arcade time and rejected boundary input preserves the exact state', () => {
  let state = createGame({ mode: 'arcade', width: 6, height: 8, seed: 'pause-clock' });
  state = applyAction(state, { kind: 'left' }).state;
  state = applyAction(state, { kind: 'left' }).state;
  assert.equal(state.active.x, 0);
  const blocked = applyAction(state, { kind: 'left' });
  assert.equal(blocked.accepted, false);
  assert.equal(blocked.state, state);
  const paused = applyAction(state, { kind: 'pause' }).state;
  const frozen = advanceTicks(paused, 90).state;
  assert.equal(frozen.elapsedTicks, paused.elapsedTicks);
  assert.equal(frozen.active.y, paused.active.y);
  assert.deepEqual(legalActions(paused), [{ kind: 'resume' }]);
  assert.equal(applyAction(paused, { kind: 'resume' }).state.phase, 'falling');

  let leftEdge = advanceTicks(createGame({ mode: 'arcade', width: 6, height: 8, seed: 'edge-after-fall' }), 120).state;
  while (leftEdge.active.x > 0) leftEdge = applyAction(leftEdge, { kind: 'left' }).state;
  assert.equal(leftEdge.active.y, 2);
  assert.equal(applyAction(leftEdge, { kind: 'left' }).accepted, false);
  let rightEdge = advanceTicks(createGame({ mode: 'arcade', width: 6, height: 8, seed: 'edge-after-fall' }), 120).state;
  while (rightEdge.active.x < 4) rightEdge = applyAction(rightEdge, { kind: 'right' }).state;
  assert.equal(rightEdge.active.y, 2);
  assert.equal(applyAction(rightEdge, { kind: 'right' }).accepted, false);
});

test('batched and single-tick Arcade clocks produce the same lock, phase and events', () => {
  const initial = createGame({ mode: 'arcade', width: 6, height: 8, seed: 'tick-batches' });
  let sequential = initial; const events = [];
  for (let i = 0; i < 420; i++) { const step = advanceTicks(sequential, 1); sequential = step.state; events.push(...step.events); }
  const batched = advanceTicks(initial, 420);
  assert.deepEqual(batched.state, sequential);
  assert.deepEqual(batched.events, events);
  assert.deepEqual(decodeGame(encodeGame(batched.state)), sequential);
});

test('canonical saves replay settings, gadgets, action order, mid-resolution and paused checkpoints', () => {
  const options = {
    mode: 'arcade', width: 6, height: 8, colourCount: 6, seed: 'canonical-magnetic-save', pieceLimit: 2,
    queue: [['red', 'red', 'red', 'red'], ['blue', 'green', 'gold', 'teal']],
    schedule: { kind: 'authored', magneticPlacements: [2], defaultFloor: 'calm' },
    floorSwitch: true, magneticImpact: true,
  };
  const initial = createGame(options);
  let state = applyAction(initial, { kind: 'set-floor-override', floor: 'magnetic' }).state;
  state = applyAction(state, { kind: 'cancel-floor-override' }).state;
  state = applyAction(state, { kind: 'set-floor-override', floor: 'calm' }).state;
  state = advanceTicks(state, 17).state;
  assert.deepEqual(decodeGame(encodeGame(state)), state);
  state = applyAction(state, { kind: 'hard-drop' }).state;
  state = advanceTicks(state, 3).state;
  assert.equal(state.phase, 'gravity');
  state = applyAction(state, { kind: 'pause' }).state;
  assert.deepEqual(decodeGame(encodeGame(state)), state);
  const resumed = applyAction(state, { kind: 'resume' }).state;
  assert.equal(resumed.phase, 'gravity');
  assert.deepEqual(restartGame(state), initial);

  const payload = JSON.parse(encodeGame(state));
  payload.checkpoint.score += 1;
  assert.throws(() => decodeGame(JSON.stringify(payload)), /checkpoint/);
  const badSetting = JSON.parse(encodeGame(state));
  badSetting.settings.mode = 'daily';
  assert.throws(() => decodeGame(JSON.stringify(badSetting)), /Mode|canonical|mode/);
  assert.throws(() => decodeGame('x'.repeat(2 * 1024 * 1024 + 1)), /2 MiB/);
});
