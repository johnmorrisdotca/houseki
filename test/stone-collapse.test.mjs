import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAction, advanceTicks, createChallenge, createGame, decodeGame, encodeGame, legalActions, requestHint, restartGame, statusOf, undo, StoneCollapseOptionsError } from '../dist/stone-collapse.js';
import { fallbackBoard } from '../dist/stone-collapse/engine.js';

const colour = { R: 'red', B: 'blue', G: 'green', Y: 'gold', P: 'purple', T: 'teal' };
// Fixture-only constructor: hand-built boards exercise positions the seeded public generator rarely emits.
function fixture(rows, { mask, width = rows[0].length, height = rows.length, tools = false } = {}) {
  const state = createGame({ width, height, seed: 'fixture', tools });
  const active = mask ?? Array(width * height).fill(true);
  let id = 1;
  const board = rows.join('').split('').map((token, index) => {
    if (!active[index] || token === '.') return null;
    return Object.freeze({ id: id++, colour: colour[token] });
  });
  return Object.freeze({ ...state, settings: Object.freeze({ ...state.settings, mask: Object.freeze([...active]) }), board: Object.freeze(board), nextId: id, phase: 'ready', selectedId: null, selectedIds: Object.freeze([]), previewScore: 0, score: 0, moves: 0, removed: 0, resolutionTick: 0, pendingIds: Object.freeze([]), gravityBoard: null, finishAdjustmentApplied: false, recording: Object.freeze([]) });
}
function playGroup(state, stoneId) {
  const selected = applyAction(state, { kind: 'select', stoneId });
  assert.equal(selected.accepted, true);
  const committed = applyAction(selected.state, { kind: 'confirm' });
  assert.equal(committed.accepted, true);
  return committed.state;
}
function finishResolution(state) {
  return advanceTicks(advanceTicks(advanceTicks(state, 7).state, 6).state, 9).state;
}
function selectAndConfirm(state, stoneId) {
  const selected = applyAction(state, { kind: 'select', stoneId });
  assert.equal(selected.accepted, true, selected.reason);
  const committed = applyAction(selected.state, { kind: 'confirm' });
  assert.equal(committed.accepted, true, committed.reason);
  return committed.state;
}
function targetAndConfirmTool(state, tool, cell) {
  state = applyAction(state, { kind: 'select-tool', tool }).state;
  state = applyAction(state, { kind: 'target-tool', cell }).state;
  return applyAction(state, { kind: 'confirm-tool' }).state;
}
function challenge(board, goal, witness, moveLimit) {
  return createChallenge({ id: 'test.challenge', width: 4, height: 4, colourCount: 4, initialBoard: board, goal, witness, ...(moveLimit ? { moveLimit } : {}) });
}
const challengeBoard = [
  ['R', 'R', 'B', 'B'],
  ['G', 'Y', 'R', 'B'],
  ['R', 'B', 'G', 'Y'],
  ['G', 'Y', 'R', 'B'],
].flatMap((row, y) => row.map((c, x) => ({ id: 1 + y * 4 + x, colour: colour[c] })));
function ids(board) { return board.map(stone => stone?.id ?? null); }
function oracleGroup(state, startIndex) {
  const seed = state.board[startIndex];
  if (!seed) return [];
  const pending = [startIndex]; const seen = new Set(pending);
  while (pending.length) {
    const at = pending.pop(); const x = at % state.settings.width; const y = Math.floor(at / state.settings.width);
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || ny < 0 || nx >= state.settings.width || ny >= state.settings.height) continue;
      const next = ny * state.settings.width + nx; const stone = state.board[next];
      if (state.settings.mask[next] && stone?.colour === seed.colour && !seen.has(next)) { seen.add(next); pending.push(next); }
    }
  }
  return [...seen];
}

test('public presets, dimensions, colours, connected silhouettes, and custom-mask bounds validate', () => {
  for (const [preset, width, height] of [['compact', 6, 8], ['standard', 8, 10], ['wide', 10, 8], ['tall', 6, 12]]) {
    const game = createGame({ preset, seed: 'bounds' });
    assert.equal(game.settings.width, width); assert.equal(game.settings.height, height);
    assert.equal(game.board.filter(Boolean).length, width * height);
  }
  for (const shape of ['heart', 'star', 'hexagon']) {
    const game = createGame({ shape, seed: 'shape' });
    assert.ok(game.board.filter(Boolean).length >= 16);
    assert.equal(game.settings.mask.length, game.board.length);
    assert.ok(game.settings.mask.every((active, i) => active === Boolean(game.board[i])));
  }
  assert.throws(() => createGame({ width: 3, height: 8 }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ width: 13, height: 8 }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ width: 12, height: 12, colourCount: 3 }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ width: 4, height: 4, mask: Array(15).fill(true) }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ width: 4, height: 4, mask: [true, false, true, true, ...Array(12).fill(true)] }), StoneCollapseOptionsError);
});

test('seeded setup is reproducible, IDs are unique, and fallback always contains a legal pair', () => {
  const a = createGame({ width: 4, height: 4, colourCount: 4, seed: 92 });
  const b = createGame({ width: 4, height: 4, colourCount: 4, seed: 92 });
  assert.deepEqual(a, b);
  assert.equal(new Set(a.board.filter(Boolean).map(stone => stone.id)).size, 16);
  const fallback = fallbackBoard(Array(16).fill(true), 4, 4, 4);
  assert.ok(new Set(fallback.filter(Boolean).map(stone => stone.id)).size === 16);
  assert.ok(fallback.some((stone, index) => stone && fallback[index + 1]?.colour === stone.colour));
  const maskedFallback = fallbackBoard([true, false, ...Array(14).fill(true)], 4, 4, 4);
  assert.deepEqual(maskedFallback.filter(Boolean).map(stone => stone.id), Array.from({ length: 15 }, (_, i) => i + 1));
});

test('diagonal contacts do not join; singleton rejection preserves exact state identity', () => {
  const state = fixture(['R...', '.R..', '....', '....']);
  const singleton = applyAction(state, { kind: 'select', stoneId: 1 });
  assert.equal(singleton.accepted, false); assert.equal(singleton.state, state);
  assert.equal(singleton.reason, 'choose-two-or-more-connected-stones');
  assert.deepEqual(legalActions(state), []);
});

test('the worked rectangle fixture exposes marked, removed, and settled snapshots with left-column compression', () => {
  const start = fixture(['....', '....', 'RB.G', 'RBGG']);
  const selected = applyAction(start, { kind: 'select', stoneId: 2 });
  assert.equal(selected.state.previewScore, 10);
  const confirm = applyAction(selected.state, { kind: 'confirm' });
  assert.equal(confirm.state.phase, 'clear-mark');
  assert.deepEqual(ids(confirm.state.board), ids(start.board));
  assert.equal(confirm.state.score, 10);
  const mark = advanceTicks(confirm.state, 6);
  assert.equal(mark.state.phase, 'clear-mark');
  assert.deepEqual(ids(mark.state.board), ids(start.board));
  const remove = advanceTicks(mark.state, 1);
  assert.equal(remove.state.phase, 'clear-remove');
  assert.deepEqual(ids(remove.state.board), [null, null, null, null, null, null, null, null, 1, null, null, 3, 4, null, 6, 7]);
  const gravity = advanceTicks(remove.state, 6);
  assert.equal(gravity.state.phase, 'gravity');
  assert.deepEqual(ids(gravity.state.board), ids(remove.state.board));
  assert.deepEqual(ids(gravity.state.gravityBoard), [null, null, null, null, null, null, null, null, 1, null, 3, null, 4, 6, 7, null]);
  const settled = advanceTicks(gravity.state, 9);
  assert.equal(settled.state.phase, 'ready');
  assert.deepEqual(ids(settled.state.board), ids(gravity.state.gravityBoard));
  assert.equal(settled.state.moves, 1);
  assert.equal(settled.state.score, 10);
  assert.ok(settled.state.board.some(stone => stone?.id === 6));
});

test('selection can change or cancel; blocked actions during resolution preserve reference identity', () => {
  const state = fixture(['RR..', 'BB..', '....', '....']);
  const selectedR = applyAction(state, { kind: 'select', stoneId: 1 }).state;
  assert.equal(selectedR.previewScore, 10);
  const selectedB = applyAction(selectedR, { kind: 'select', stoneId: 3 }).state;
  assert.equal(selectedB.previewScore, 10); assert.equal(selectedB.selectedId, 3);
  const cancelled = applyAction(selectedB, { kind: 'cancel' });
  assert.equal(cancelled.accepted, true); assert.equal(cancelled.state.selectedId, null);
  const resolving = applyAction(selectedB, { kind: 'confirm' }).state;
  const rejected = applyAction(resolving, { kind: 'select', stoneId: 1 });
  assert.equal(rejected.accepted, false); assert.equal(rejected.state, resolving);
  assert.equal(legalActions(resolving).length, 0);
});

test('a second tap anywhere in the selected group confirms it; malformed action kinds reject unchanged', () => {
  const state = fixture(['RR..', '....', '....', '....']);
  const selected = applyAction(state, { kind: 'select', stoneId: 1 }).state;
  const confirmed = applyAction(selected, { kind: 'select', stoneId: 2 });
  assert.equal(confirmed.accepted, true); assert.equal(confirmed.state.phase, 'clear-mark');
  const invalid = applyAction(selected, { kind: 'teleport' });
  assert.equal(invalid.accepted, false); assert.equal(invalid.state, selected);
  assert.equal(applyAction(state, { kind: 'confirm' }).state, state);
});

test('group scoring is exact and the final clear receives its bonus once', () => {
  const pair = fixture(['RR..', '....', '....', '....']);
  const won = finishResolution(playGroup(pair, 1));
  assert.equal(won.phase, 'won'); assert.equal(won.score, 1010); assert.equal(won.finishAdjustmentApplied, true);
  const queried = statusOf(won);
  assert.equal(queried.score, 1010); assert.equal(statusOf(won).score, 1010);
  assert.equal(applyAction(won, { kind: 'confirm' }).state, won);
});

test('no-group ending applies remaining-stone penalty once and clamps score at zero', () => {
  const state = fixture(['RRBG', 'GBGB', 'BGBG', 'GBGB']);
  const finished = finishResolution(playGroup(state, 1));
  assert.equal(finished.phase, 'finished');
  assert.equal(finished.removed, 2); assert.equal(finished.board.filter(Boolean).length, 14);
  assert.equal(finished.score, 0); assert.equal(finished.finishAdjustmentApplied, true);
  assert.equal(statusOf(finished).phase, 'finished'); assert.equal(statusOf(finished).score, 0);
});

test('masked gravity respects vertical segments and never compresses columns', () => {
  const mask = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
  mask[6] = false;
  const start = fixture(['RRB.', '....', '..G.', '....'], { mask });
  // The group is removed in columns 0–1; the gap at row 1, column 2 splits a fall segment.
  const removing = playGroup(start, 1);
  const gravity = advanceTicks(advanceTicks(removing, 7).state, 6).state;
  const settled = advanceTicks(gravity, 9).state;
  assert.equal(settled.board[2]?.id, 3);
  assert.equal(settled.board[14]?.id, 4);
  assert.equal(settled.board[10], null);
  assert.equal(settled.board[6], null);
});

test('500 seeded boards preserve IDs, mask occupancy, immutability, legal groups, and finite play', () => {
  for (let seed = 0; seed < 500; seed++) {
    let state = createGame({ width: 4 + seed % 9, height: 4 + (seed * 7) % 9, colourCount: 4 + seed % 3, seed });
    const original = structuredClone(state);
    const seen = new Set();
    for (const stone of state.board.filter(Boolean)) { assert.ok(!seen.has(stone.id)); seen.add(stone.id); }
    assert.deepEqual(state, original);
    for (let turn = 0; turn < 200 && state.phase === 'ready'; turn++) {
      const actions = legalActions(state).filter(action => action.kind === 'select');
      const expected = state.board.flatMap((stone, index) => stone && oracleGroup(state, index).length >= 2 ? [stone.id] : []);
      assert.deepEqual(actions.map(action => action.stoneId), expected);
      if (!actions.length) break;
      const before = state;
      const selected = applyAction(state, actions[(seed + turn) % actions.length]);
      assert.equal(selected.accepted, true);
      const committed = applyAction(selected.state, { kind: 'confirm' });
      assert.equal(committed.accepted, true);
      assert.deepEqual(before, state);
      const snapshot = structuredClone(committed.state);
      assert.deepEqual(committed.state, snapshot);
      state = finishResolution(committed.state);
      assert.equal(state.moves, before.moves + 1);
      const currentIds = state.board.filter(Boolean).map(stone => stone.id);
      assert.equal(new Set(currentIds).size, currentIds.length);
      assert.ok(currentIds.every(id => seen.has(id)));
      assert.ok(state.board.every((stone, i) => state.settings.mask[i] || stone === null));
      if (state.phase === 'ready') assert.ok(legalActions(state).some(action => action.kind === 'select'));
    }
  }
});

test('Daily is canonical, host-dated, reproducible, and has no practice actions', () => {
  const date = '2026-10-05';
  const daily = createGame({ mode: 'daily', dailyDate: date });
  assert.deepEqual(daily, createGame({ mode: 'daily', dailyDate: date }));
  assert.equal(daily.settings.dailyDate, date); assert.equal(daily.settings.width, 8); assert.equal(daily.settings.height, 10); assert.equal(daily.settings.colourCount, 4);
  assert.notEqual(daily.settings.seed, createGame({ mode: 'daily', dailyDate: '2026-10-06' }).settings.seed);
  assert.throws(() => createGame({ mode: 'daily', dailyDate: '2026-02-30' }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ mode: 'daily', dailyDate: date, width: 8 }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ mode: 'daily', dailyDate: date, seed: 'override' }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ mode: 'arcade', dailyDate: date }), StoneCollapseOptionsError);
  assert.ok(!legalActions(daily).some(action => action.kind === 'undo' || action.kind === 'hint'));
  assert.equal(requestHint(daily).state, daily);
  const restarted = restartGame(daily);
  assert.equal(restarted.settings.dailyDate, date); assert.deepEqual(restarted.board, daily.board);
  assert.deepEqual(decodeGame(encodeGame(daily)), daily);
});

test('Arcade has score play without undo or hints; Relaxed undo restores the complete pre-move run and stays assisted', () => {
  const arcade = createGame({ mode: 'arcade', width: 4, height: 4, seed: 4 });
  assert.ok(!legalActions(arcade).some(action => action.kind === 'undo' || action.kind === 'hint'));
  assert.equal(undo(arcade).state, arcade);
  assert.equal(requestHint(arcade).state, arcade);
  const relaxed = createGame({ width: 4, height: 4, seed: 44 });
  const group = legalActions(relaxed).find(action => action.kind === 'select');
  const selected = applyAction(relaxed, group);
  const moved = finishResolution(applyAction(selected.state, { kind: 'confirm' }).state);
  const returned = undo(moved);
  assert.equal(returned.accepted, true);
  assert.deepEqual(returned.state.board, relaxed.board);
  assert.equal(returned.state.score, 0); assert.equal(returned.state.moves, 0); assert.equal(returned.state.removed, 0);
  assert.equal(returned.state.randomState, relaxed.randomState); assert.equal(returned.state.nextId, relaxed.nextId);
  assert.equal(returned.state.selectedId, selected.state.selectedId); assert.deepEqual(returned.state.selectedIds, selected.state.selectedIds);
  assert.equal(returned.state.assisted, true); assert.equal(returned.state.history.length, 0);
  const restarted = restartGame(returned.state);
  assert.deepEqual(restarted.board, relaxed.board); assert.equal(restarted.assisted, false); assert.deepEqual(restarted.recording, []);
  assert.equal(advanceTicks(arcade, 600).state, arcade);
});

test('Challenges validate witnesses and let a goal completed on the final move win before budget loss', () => {
  const marked = challenge(challengeBoard, { kind: 'clear-targets', targetIds: [1, 2] }, [[1, 2]], 1);
  const won = finishResolution(selectAndConfirm(marked, 1));
  assert.equal(won.phase, 'won'); assert.equal(won.reason, 'goal-complete'); assert.equal(won.moves, 1);
  assert.equal(won.board.filter(Boolean).length, 14); assert.equal(won.score, 10); assert.equal(won.finishAdjustmentApplied, false);
  assert.throws(() => challenge(challengeBoard, { kind: 'clear-all' }, [[1, 3]], 1), StoneCollapseOptionsError);
  assert.throws(() => challenge(challengeBoard, { kind: 'score-target', minimumScore: 10 }, [[1, 2]]), StoneCollapseOptionsError);
  const scoreTarget = challenge(challengeBoard, { kind: 'score-target', minimumScore: 10 }, [[1, 2]], 1);
  assert.equal(finishResolution(selectAndConfirm(scoreTarget, 1)).phase, 'won');
});

test('an incomplete challenge loses at its budget; an isolated-stone finish is a loss without the casual penalty', () => {
  const state = challenge(challengeBoard, { kind: 'clear-targets', targetIds: [1, 2] }, [[1, 2]], 1);
  const lost = finishResolution(selectAndConfirm(state, 3));
  assert.equal(lost.phase, 'lost'); assert.equal(lost.reason, 'move-limit'); assert.equal(lost.score, 30);

  const valid = challenge(Array.from({ length: 16 }, (_, i) => ({ id: i + 1, colour: 'red' })), { kind: 'clear-all' }, [Array.from({ length: 16 }, (_, i) => i + 1)], 1);
  const deadBoard = fixture(['RRBG', 'GBGB', 'BGBG', 'GBGB']).board;
  const deadChallenge = Object.freeze({ ...valid.challenge, goal: Object.freeze({ kind: 'clear-targets', targetIds: Object.freeze([3]) }), witness: Object.freeze([[1, 2]]) });
  const noMoves = Object.freeze({ ...valid, challenge: deadChallenge, settings: Object.freeze({ ...valid.settings, goal: deadChallenge.goal }), board: deadBoard, initialBoard: deadBoard, witnessIndex: -1 });
  const challengeFinished = finishResolution(selectAndConfirm(noMoves, 1));
  assert.equal(challengeFinished.phase, 'lost'); assert.equal(challengeFinished.reason, 'no-legal-groups');
  assert.equal(challengeFinished.score, 10);
});

test('witness hints are path-limited, mark practice assisted, and replay through saves', () => {
  const state = challenge(challengeBoard, { kind: 'clear-targets', targetIds: [1, 2] }, [[1, 2]], 1);
  const hinted = requestHint(state);
  assert.equal(hinted.accepted, true); assert.equal(hinted.state.assisted, true); assert.deepEqual(hinted.state.selectedIds, [1, 2]);
  assert.deepEqual(decodeGame(encodeGame(hinted.state)), hinted.state);
  const hintedMove = finishResolution(applyAction(hinted.state, { kind: 'confirm' }).state);
  assert.deepEqual(decodeGame(encodeGame(hintedMove)), hintedMove);
  assert.equal(restartGame(hintedMove).challenge.id, state.challenge.id);
  const offPath = finishResolution(selectAndConfirm(state, 3));
  assert.equal(offPath.phase, 'lost'); assert.equal(offPath.witnessIndex, -1);
  const unavailable = requestHint(offPath);
  assert.equal(unavailable.accepted, false); assert.equal(unavailable.state, offPath);
  assert.equal(requestHint(createGame()).state.phase, 'ready');
});

test('canonical replay restores mid-resolution and selected-group checkpoints, including undo and terminal states', () => {
  const start = createGame({ width: 4, height: 4, seed: 7 });
  const selectedAction = legalActions(start).find(action => action.kind === 'select');
  const selected = applyAction(start, selectedAction).state;
  assert.deepEqual(decodeGame(encodeGame(selected)), selected);
  const committed = applyAction(selected, { kind: 'confirm' }).state;
  const partial = advanceTicks(committed, 9).state;
  assert.equal(partial.phase, 'clear-remove'); assert.equal(partial.resolutionTick, 2);
  assert.deepEqual(decodeGame(encodeGame(partial)), partial);
  const sameTicks = advanceTicks(advanceTicks(committed, 4).state, 5).state;
  assert.deepEqual(sameTicks, advanceTicks(committed, 9).state);
  const moved = finishResolution(committed);
  assert.deepEqual(decodeGame(encodeGame(moved)), moved);
  const undone = undo(moved).state;
  assert.equal(undone.assisted, true); assert.deepEqual(decodeGame(encodeGame(undone)), undone);
  const allStones = Array.from({ length: 16 }, (_, i) => ({ id: i + 1, colour: 'red' }));
  const won = finishResolution(selectAndConfirm(challenge(allStones, { kind: 'clear-all' }, [Array.from({ length: 16 }, (_, i) => i + 1)], 1), 1));
  assert.equal(decodeGame(encodeGame(won)).score, won.score);
});

test('replay rejects changed actions, forged checkpoints, malformed challenge definitions, and resource-limit overruns', () => {
  const state = finishResolution(selectAndConfirm(createGame({ width: 4, height: 4, seed: 31 }), legalActions(createGame({ width: 4, height: 4, seed: 31 })).find(action => action.kind === 'select').stoneId));
  const encoded = encodeGame(state);
  const wrongAction = JSON.parse(encoded); wrongAction.actions[0].stoneId = 0x7fffffff;
  assert.throws(() => decodeGame(JSON.stringify(wrongAction)));
  const extraActionField = JSON.parse(encoded); extraActionField.actions[0].unexpected = true;
  assert.throws(() => decodeGame(JSON.stringify(extraActionField)));
  const wrongScore = JSON.parse(encoded); wrongScore.checkpoint.score++;
  assert.throws(() => decodeGame(JSON.stringify(wrongScore)), /checkpoint/);
  const longActions = JSON.parse(encodeGame(createGame({ width: 4, height: 4, seed: 1 })));
  longActions.actions = Array.from({ length: 100_001 }, () => ({}));
  assert.throws(() => decodeGame(JSON.stringify(longActions)), RangeError);
  const tooManyTicks = JSON.parse(encodeGame(createGame({ width: 4, height: 4, seed: 1 })));
  tooManyTicks.actions = [{ kind: 'ticks', count: 10_000_001 }];
  assert.throws(() => decodeGame(JSON.stringify(tooManyTicks)), RangeError);
  const malformedChallenge = JSON.parse(encodeGame(challenge(challengeBoard, { kind: 'clear-targets', targetIds: [1, 2] }, [[1, 2]], 1)));
  malformedChallenge.challenge.witness = [[999, 1000]];
  assert.throws(() => decodeGame(JSON.stringify(malformedChallenge)));
  assert.throws(() => decodeGame(' '.repeat(2 * 1024 * 1024 + 1)), RangeError);
  assert.throws(() => encodeGame({ ...createGame({ width: 4, height: 4 }), recording: Array.from({ length: 100_001 }, () => ({ kind: 'remove', move: 1, stoneId: 1 })) }), RangeError);
  assert.throws(() => encodeGame(createGame({ width: 4, height: 4, seed: '😀'.repeat(300_000) })), RangeError);
});

test('stored tools are opt-in for Relaxed and Arcade, unavailable in Daily and authored Challenges', () => {
  const options = { width: 4, height: 4, seed: 'tool-default' };
  const ordinary = createGame(options); const disabled = createGame({ ...options, tools: false });
  assert.deepEqual(ordinary, disabled); assert.deepEqual(ordinary.inventory, { bomb: 0, pick: 0 });
  assert.ok(!legalActions(ordinary).some(action => action.kind === 'select-tool'));
  const relaxed = createGame({ ...options, tools: true });
  assert.deepEqual(relaxed.inventory, { bomb: 1, pick: 1 }); assert.equal(relaxed.settings.tools, true);
  const arcade = createGame({ ...options, mode: 'arcade', tools: true });
  assert.deepEqual(arcade.inventory, { bomb: 1, pick: 1 });
  assert.throws(() => createGame({ mode: 'daily', dailyDate: '2026-10-05', tools: true }), /Daily does not allow stored tools/);
  assert.throws(() => createGame({ ...options, tools: 'yes' }), /tools must be a boolean/);
  const authored = challenge(challengeBoard, { kind: 'clear-targets', targetIds: [1, 2] }, [[1, 2]], 1);
  assert.equal(authored.settings.tools, false); assert.deepEqual(authored.inventory, { bomb: 0, pick: 0 });
  assert.throws(() => createChallenge({ ...authored.challenge, tools: true }), /unsupported field/);
  assert.deepEqual(restartGame(relaxed), relaxed);
});

test('bomb targeting previews occupied active cells clipped to board and mask, with cancel and retarget costing nothing', () => {
  const width = 5, height = 4, mask = Array(width * height).fill(true); mask[1] = false; mask[6] = false; mask[18] = false; mask[19] = false;
  const start = fixture(['RGBG.', 'G.BGR', 'BRG.P', 'RGBGR'], { width, height, mask, tools: true });
  const before = { inventory: start.inventory, moves: start.moves, score: start.score, randomState: start.randomState, progress: start.toolProgress, cursor: start.toolAwardCursor, assisted: start.assisted };
  const selected = applyAction(start, { kind: 'select-tool', tool: 'bomb' });
  assert.equal(selected.accepted, true); assert.equal(selected.state.selectedTool, 'bomb');
  assert.equal(applyAction(selected.state, { kind: 'target-tool', cell: 1 }).accepted, false);
  assert.equal(applyAction(selected.state, { kind: 'target-tool', cell: 0, extra: true }).accepted, false);
  const aimed = applyAction(selected.state, { kind: 'target-tool', cell: 0 });
  assert.equal(aimed.accepted, true); assert.deepEqual(aimed.state.toolPreview, [0, 5]); assert.deepEqual(aimed.events[0].ids, [start.board[0].id, start.board[5].id]);
  const retargeted = applyAction(aimed.state, { kind: 'select-tool', tool: 'pick' });
  assert.equal(retargeted.state.selectedTool, 'pick'); assert.equal(retargeted.state.toolTarget, null); assert.deepEqual(retargeted.state.toolPreview, []);
  const cancelled = applyAction(retargeted.state, { kind: 'cancel-tool' });
  assert.equal(cancelled.accepted, true); assert.equal(cancelled.state.selectedTool, null);
  assert.deepEqual({ inventory: cancelled.state.inventory, moves: cancelled.state.moves, score: cancelled.state.score, randomState: cancelled.state.randomState, progress: cancelled.state.toolProgress, cursor: cancelled.state.toolAwardCursor, assisted: cancelled.state.assisted }, before);
  assert.equal(applyAction(cancelled.state, { kind: 'cancel-tool' }).state, cancelled.state);
  assert.deepEqual(applyAction(start, { kind: 'select-tool', tool: 'torch' }).state, start);
});

test('confirmed bomb uses exact preview, scores ten per stone and resolves through 7/6/9 phases', () => {
  const width = 5, height = 4, mask = Array(width * height).fill(true); mask[1] = false; mask[6] = false; mask[18] = false; mask[19] = false;
  const start = fixture(['RGBG.', 'G.BGR', 'BRG.P', 'RGBGR'], { width, height, mask, tools: true });
  let aimed = applyAction(start, { kind: 'select-tool', tool: 'bomb' }).state;
  aimed = applyAction(aimed, { kind: 'target-tool', cell: 0 }).state;
  assert.deepEqual(aimed.toolPreview, [0, 5]);
  const committed = applyAction(aimed, { kind: 'confirm-tool' }); const mark = committed.state;
  assert.equal(committed.accepted, true); assert.equal(mark.phase, 'clear-mark'); assert.equal(mark.moves, 1);
  assert.equal(mark.score, 20); assert.equal(mark.assisted, true); assert.deepEqual(mark.inventory, { bomb: 0, pick: 1 });
  assert.equal(mark.toolProgress, 0); assert.equal(mark.toolAwardCursor, 0);
  assert.deepEqual(mark.pendingIds, [start.board[0].id, start.board[5].id]); assert.deepEqual(ids(mark.board), ids(start.board));
  const marked = advanceTicks(mark, 6).state; assert.equal(marked.phase, 'clear-mark'); assert.equal(marked.removed, 0);
  const removed = advanceTicks(marked, 1).state; assert.equal(removed.phase, 'clear-remove'); assert.equal(removed.board[0], null); assert.equal(removed.removed, 2);
  const removalDone = advanceTicks(removed, 6).state; assert.equal(removalDone.phase, 'gravity');
  const settled = advanceTicks(removalDone, 9).state;
  assert.equal(settled.phase, 'ready'); assert.equal(settled.moves, 1); assert.equal(settled.score, 20);
  assert.ok(settled.board[0] === null || settled.board[0]?.id !== start.board[0].id);
});

test('pick removes exactly one stone, tool uses do not earn tools, and ordinary removals award alternately with cap carry', () => {
  let picked = fixture(['RBGY', 'GBPR', 'BRGY', 'YRGB'], { tools: true });
  picked = { ...picked, toolProgress: 11, toolAwardCursor: 1 };
  const single = picked.board.find(stone => stone);
  const toolMove = targetAndConfirmTool(picked, 'pick', picked.board.indexOf(single));
  assert.deepEqual(toolMove.pendingIds, [single.id]); assert.equal(toolMove.score, 10); assert.equal(toolMove.moves, 1);
  assert.equal(toolMove.toolProgress, 11); assert.equal(toolMove.toolAwardCursor, 1);
  assert.deepEqual(toolMove.inventory, { bomb: 1, pick: 0 });

  let earned = fixture(['RR..', '....', '....', '....'], { tools: true });
  earned = { ...earned, toolProgress: 10, toolAwardCursor: 0 };
  const awarded = applyAction(applyAction(earned, { kind: 'select', stoneId: 1 }).state, { kind: 'confirm' });
  assert.equal(awarded.state.toolProgress, 0); assert.equal(awarded.state.toolAwardCursor, 1);
  assert.deepEqual(awarded.state.inventory, { bomb: 2, pick: 1 });
  assert.ok(awarded.events.some(event => event.type === 'tool-awarded' && event.tool === 'bomb' && !event.discarded));
  let nextAward = fixture(['RR..', '....', '....', '....'], { tools: true });
  nextAward = { ...nextAward, toolProgress: 10, toolAwardCursor: 1 };
  const alternated = applyAction(applyAction(nextAward, { kind: 'select', stoneId: 1 }).state, { kind: 'confirm' });
  assert.equal(alternated.state.inventory.pick, 2); assert.equal(alternated.state.toolAwardCursor, 0);
  assert.ok(alternated.events.some(event => event.type === 'tool-awarded' && event.tool === 'pick'));

  let capped = fixture(['RR..', '....', '....', '....'], { tools: true });
  capped = { ...capped, inventory: Object.freeze({ bomb: 3, pick: 3 }), toolProgress: 11, toolAwardCursor: 0 };
  const overflow = applyAction(applyAction(capped, { kind: 'select', stoneId: 1 }).state, { kind: 'confirm' });
  assert.deepEqual(overflow.state.inventory, { bomb: 3, pick: 3 }); assert.equal(overflow.state.toolProgress, 1);
  assert.equal(overflow.state.toolAwardCursor, 1); assert.ok(overflow.events.some(event => event.type === 'tool-awarded' && event.discarded));
});

test('a ready board with no ordinary group remains usable while a stored tool can rescue it, then ends after the last use', () => {
  const start = fixture(['RBRB', 'BRBR', 'RBRB', 'BRBR'], { tools: true });
  let rescued = finishResolution(targetAndConfirmTool(start, 'pick', 0));
  assert.equal(rescued.phase, 'ready'); assert.deepEqual(rescued.inventory, { bomb: 1, pick: 0 });
  assert.ok(legalActions(rescued).some(action => action.kind === 'select-tool' && action.tool === 'bomb'));
  rescued = finishResolution(targetAndConfirmTool(rescued, 'bomb', 1));
  assert.ok(['finished', 'won', 'ready'].includes(rescued.phase));
  if (rescued.phase === 'ready') assert.ok(legalActions(rescued).some(action => action.kind === 'select' || action.kind === 'select-tool'));

  const oneTool = { ...start, inventory: Object.freeze({ bomb: 0, pick: 1 }) };
  const exhausted = finishResolution(targetAndConfirmTool(oneTool, 'pick', 0));
  assert.equal(exhausted.phase, 'finished'); assert.equal(exhausted.reason, 'no-legal-groups');
});

test('tool configuration, target previews, mid-resolution replay, batched ticks, undo, and restart are canonical', () => {
  const start = createGame({ width: 4, height: 4, seed: 'tool-save', tools: true });
  let aimed = applyAction(start, { kind: 'select-tool', tool: 'bomb' }).state;
  aimed = applyAction(aimed, { kind: 'target-tool', cell: 5 }).state;
  assert.deepEqual(decodeGame(encodeGame(aimed)), aimed);
  const alteredInventory = JSON.parse(encodeGame(aimed)); alteredInventory.checkpoint.inventory.bomb++;
  assert.throws(() => decodeGame(JSON.stringify(alteredInventory)), /checkpoint/);
  const alteredPreview = JSON.parse(encodeGame(aimed)); alteredPreview.checkpoint.toolPreview = [5];
  assert.throws(() => decodeGame(JSON.stringify(alteredPreview)), /checkpoint/);
  const alteredTarget = JSON.parse(encodeGame(aimed)); alteredTarget.actions[1].cell = 6;
  assert.throws(() => decodeGame(JSON.stringify(alteredTarget)), /checkpoint/);
  const committed = applyAction(aimed, { kind: 'confirm-tool' }).state;
  const batched = advanceTicks(committed, 22).state;
  const stepped = advanceTicks(advanceTicks(advanceTicks(committed, 7).state, 6).state, 9).state;
  assert.deepEqual(batched, stepped); assert.deepEqual(decodeGame(encodeGame(advanceTicks(committed, 9).state)), advanceTicks(committed, 9).state);
  assert.deepEqual(decodeGame(encodeGame(batched)), batched);
  const groupId = legalActions(aimed).find(action => action.kind === 'select')?.stoneId;
  assert.ok(groupId);
  const ordinarySelection = applyAction(aimed, { kind: 'select', stoneId: groupId }).state;
  assert.equal(ordinarySelection.selectedTool, null); assert.equal(ordinarySelection.toolTarget, null); assert.deepEqual(ordinarySelection.toolPreview, []);
  const ordinaryMove = finishResolution(applyAction(ordinarySelection, { kind: 'confirm' }).state);
  assert.deepEqual(decodeGame(encodeGame(ordinaryMove)), ordinaryMove);
  const undone = undo(batched);
  assert.equal(undone.accepted, true); assert.deepEqual(undone.state.inventory, aimed.inventory);
  assert.equal(undone.state.toolProgress, aimed.toolProgress); assert.equal(undone.state.toolAwardCursor, aimed.toolAwardCursor);
  assert.equal(undone.state.selectedTool, aimed.selectedTool); assert.equal(undone.state.toolTarget, aimed.toolTarget);
  assert.deepEqual(undone.state.toolPreview, aimed.toolPreview); assert.equal(undone.state.assisted, true);
  assert.deepEqual(decodeGame(encodeGame(undone.state)), undone.state);
  const restarted = restartGame(batched);
  assert.deepEqual(restarted, start); assert.deepEqual(restarted.inventory, { bomb: 1, pick: 1 });
  assert.throws(() => decodeGame(JSON.stringify({ ...JSON.parse(encodeGame(start)), settings: { ...start.settings, tools: 'yes' } })));
});

test('shaped casual games restore and restart without conflicting custom dimensions', () => {
  for (const shape of ['heart', 'star', 'hexagon']) for (const tools of [false, true]) {
    const initial = createGame({ shape, tools, seed: 'shape-replay' });
    assert.deepEqual(decodeGame(encodeGame(initial)), initial);
    assert.deepEqual(restartGame(initial), initial);
    if (!tools) continue;
    const selected = applyAction(initial, { kind: 'select-tool', tool: 'bomb' }).state;
    const target = initial.settings.mask.findIndex(Boolean);
    const aimed = applyAction(selected, { kind: 'target-tool', cell: target }).state;
    assert.deepEqual(decodeGame(encodeGame(aimed)), aimed);
    const fired = applyAction(aimed, { kind: 'confirm-tool' }).state;
    assert.deepEqual(decodeGame(encodeGame(fired)), fired);
    const settled = advanceTicks(fired, 22).state;
    assert.deepEqual(decodeGame(encodeGame(settled)), settled);
    assert.deepEqual(restartGame(settled), initial);
  }
});
