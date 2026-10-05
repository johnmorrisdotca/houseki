import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceTime, advanceTicks, applyAction, createGame, decodeGame, encodeGame, hintGame, legalActions, reshuffleGame, restartGame, statusOf, undoGame, validateChallengeWitness, GemSwapOptionsError, ReplayError } from '../dist/gem-swap.js';

function finish(state) { return advanceTicks(state, 3600).state; }

test('Daily fixes its canonical rules and date-derived board; move budget is visible', () => {
  const a = createGame({ mode: 'daily', dailyDate: '2026-10-05' });
  const same = createGame({ mode: 'daily', dailyDate: '2026-10-05' });
  const next = createGame({ mode: 'daily', dailyDate: '2026-10-06' });
  assert.deepEqual(a, same); assert.notDeepEqual(a.board, next.board);
  assert.equal(a.settings.width, 8); assert.equal(a.settings.height, 8); assert.equal(a.settings.colourCount, 5); assert.equal(a.settings.tools, false);
  assert.equal(statusOf(a).remainingMoves, 30);
  const moved = applyAction(a, legalActions(a).find(action => action.kind === 'swap'));
  assert.equal(moved.accepted, true); assert.equal(statusOf(moved.state).remainingMoves, 29);
  for (const options of [{ mode: 'daily', dailyDate: '2026-02-30' }, { mode: 'daily', dailyDate: '2026-10-05', width: 6 }, { mode: 'daily', dailyDate: '2026-10-05', tools: true }]) assert.throws(() => createGame(options), GemSwapOptionsError);
});

test('Arcade time is explicit, deterministic, and lets a committed clear settle at expiry', () => {
  const start = createGame({ mode: 'arcade', seed: 47 });
  const swap = applyAction(start, legalActions(start).find(action => action.kind === 'swap'));
  const timed = advanceTime(swap.state, 180_000).state;
  assert.equal(timed.phase, 'clear-mark'); assert.equal(statusOf(timed).remainingMs, 0);
  assert.equal(applyAction(timed, legalActions(timed)[0]).accepted, false);
  const settled = finish(timed);
  assert.equal(settled.phase, 'finished'); assert.equal(settled.outcome, 'finished');
  assert.equal(advanceTime(settled, 1).state, settled);
  const timedOnce = advanceTime(start, 90_000).state;
  const timedTwice = advanceTime(advanceTime(start, 30_000).state, 60_000).state;
  assert.deepEqual(timedOnce, timedTwice);
});

test('challenge progress combines goals and a final permitted clear wins before exhaustion', () => {
  const options = { mode: 'challenge', seed: 92, challenge: { moveLimit: 1, goals: [{ kind: 'collect', colour: 'red', target: 3 }, { kind: 'score', target: 1 }] } };
  const start = createGame(options); const action = legalActions(start).find(item => item.kind === 'swap');
  const first = applyAction(start, action); assert.equal(first.accepted, true);
  const done = finish(first.state);
  assert.equal(done.outcome, 'won'); assert.equal(statusOf(done).goalProgress.every(goal => goal.complete), true);
  const witness = validateChallengeWitness(options, [{ kind: 'action', action }, { kind: 'ticks', count: 3600 }]);
  assert.equal(witness.valid, true); assert.equal(witness.state.outcome, 'won');
  const failed = validateChallengeWitness(options, []); assert.equal(failed.valid, false);
});

test('challenge move budgets count swaps, not explicitly configured tool uses', () => {
  let state = createGame({ mode: 'challenge', tools: true, seed: 38, challenge: { moveLimit: 1, goals: [{ kind: 'score', target: 100_000 }] } });
  state = applyAction(state, { kind: 'select-tool', tool: 'bomb' }).state;
  state = applyAction(state, { kind: 'target-tool', cell: 0 }).state;
  state = applyAction(state, { kind: 'confirm-tool' }).state;
  state = finish(state);
  assert.equal(state.moves, 1); assert.equal(state.swapCount, 0); assert.equal(statusOf(state).remainingMoves, 1); assert.equal(state.outcome, null);
});

test('canonical replay reconstructs initial, mid-resolution, tools and Black Hole-enabled rules', () => {
  for (const options of [{ seed: 'ordinary' }, { mode: 'arcade', seed: 4 }, { tools: true, advancedTools: true, seed: 81 }, { mode: 'daily', dailyDate: '2026-10-05' }]) {
    let state = createGame(options);
    if (options.mode !== 'daily') {
      const selected = applyAction(state, legalActions(state).find(action => action.kind === 'swap'));
      state = selected.state;
      state = advanceTicks(state, 3).state;
    }
    const encoded = encodeGame(state); const decoded = decodeGame(encoded);
    assert.deepEqual(decoded, state);
    assert.deepEqual(decodeGame(encodeGame(decoded)), decoded);
    assert.deepEqual(restartGame(state), createGame(options));
  }
});

test('canonical replay rejects tampering, malformed inputs, excessive work and forged checkpoints', () => {
  const state = createGame({ seed: 12 }); const encoded = encodeGame(state); const data = JSON.parse(encoded);
  assert.throws(() => decodeGame(JSON.stringify({ ...data, score: 999 })), ReplayError);
  assert.throws(() => decodeGame(JSON.stringify({ ...data, operations: [{ kind: 'ticks', count: 3601 }] })), ReplayError);
  assert.throws(() => decodeGame(`${encoded} `), ReplayError);
  assert.throws(() => encodeGame({ ...state, score: 999 }), ReplayError);
  const invalidInitial = { format: 'gem-swap-replay-1', initial: { mode: 'daily', dailyDate: '2026-10-05', width: 6 }, operations: [] };
  assert.throws(() => decodeGame(JSON.stringify(invalidInitial)), ReplayError);
});

test('undo restores the full pre-swap random checkpoint, stays assisted, and survives replay', () => {
  const start = createGame({ mode: 'relaxed', seed: 713 });
  const swap = applyAction(start, legalActions(start).find(action => action.kind === 'swap'));
  const settled = finish(swap.state);
  const undone = undoGame(settled);
  assert.equal(undone.accepted, true); assert.deepEqual(undone.state.board, start.board);
  assert.equal(undone.state.randomState, start.randomState); assert.equal(undone.state.moves, 0); assert.equal(undone.state.assisted, true);
  assert.deepEqual(decodeGame(encodeGame(undone.state)), undone.state);
  assert.equal(undoGame(undone.state).accepted, false);
});

test('hints are legal-only and assistance is sticky; reshuffle preserves gem identities and multiset', () => {
  const start = createGame({ seed: 1234 });
  const hinted = hintGame(start);
  assert.equal(hinted.accepted, true); assert.deepEqual(legalActions(start).find(action => action.kind === 'swap'), hinted.events[0].action);
  assert.equal(hinted.state.assisted, true); assert.deepEqual(decodeGame(encodeGame(hinted.state)), hinted.state);
  const shuffled = reshuffleGame(start);
  assert.equal(shuffled.accepted, true); assert.equal(shuffled.state.assisted, true);
  assert.equal(shuffled.state.moves, start.moves); assert.equal(shuffled.state.score, start.score);
  assert.deepEqual(shuffled.state.board.map(gem => [gem.id, gem.colour, gem.kind]).sort((a, b) => a[0] - b[0]), start.board.map(gem => [gem.id, gem.colour, gem.kind]).sort((a, b) => a[0] - b[0]));
  assert.deepEqual(decodeGame(encodeGame(shuffled.state)), shuffled.state);
});

test('seal layers sit beneath fixed cells, lose at most one layer per wave, and expose finite progress', () => {
  const seed = 550;
  const base = createGame({ seed }); const witnessMove = legalActions(base).find(action => action.kind === 'swap');
  const marked = applyAction(base, witnessMove).state;
  const target = marked.pendingCells[0];
  const options = { mode: 'challenge', seed, challenge: { moveLimit: 1, seals: [{ cell: target, layers: 1 }], goals: [{ kind: 'seals' }] } };
  const start = createGame(options); assert.equal(start.seals[0].cell, target);
  const action = legalActions(start).find(move => move.kind === 'swap');
  const ending = finish(applyAction(start, action).state);
  assert.equal(ending.seals.length, 0); assert.equal(ending.sealsCleared, 1); assert.equal(ending.outcome, 'won');
  assert.deepEqual(statusOf(ending).goalProgress[0], { kind: 'seals', current: 1, target: 1, complete: true });
  assert.deepEqual(decodeGame(encodeGame(ending)), ending);
  assert.throws(() => createGame({ mode: 'challenge', seed, challenge: { goals: [{ kind: 'seals' }], seals: [] } }), GemSwapOptionsError);
});

test('earned tools, rare charge progress, and an active Black Hole reconstruct from their input history', () => {
  let state = createGame({ tools: true, advancedTools: true, seed: 0 });
  for (let count = 0; count < 40 && state.blackHoleCharges === 0; count++) {
    const swap = legalActions(state).find(action => action.kind === 'swap');
    assert.ok(swap, 'the deterministic witness run retains ordinary legal moves');
    state = advanceTicks(applyAction(state, swap).state, 3600).state;
  }
  assert.equal(state.blackHoleCharges, 1); assert.ok(state.blackHoleProgress < 48);
  state = applyAction(state, { kind: 'select-tool', tool: 'black-hole' }).state;
  state = applyAction(state, { kind: 'target-tool', cell: 0 }).state;
  state = applyAction(state, { kind: 'confirm-tool' }).state;
  assert.ok(state.blackHole); assert.equal(state.blackHoleCharges, 0);
  assert.deepEqual(decodeGame(encodeGame(state)), state);
});
