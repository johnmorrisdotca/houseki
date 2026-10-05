import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, createChallenge, applyAction, advanceTicks, legalActions, statusOf, landingCells, restartGame, encodeGame, decodeGame, createInputScheduler, setHeldInput, queueInputEdge, actionsForTick, applyScheduledActions, processInputTick, StoneChainsOptionsError } from '../dist/colour-chains.js';
import { findGroups, compactBoard } from '../dist/colour-chains/match.js';

const C = { R: 'red', B: 'blue', G: 'green', Y: 'gold', P: 'purple', T: 'teal', '.': null };
const W = 6; const H = 12; const FULL = H + 3;
function blank() { return Array(W * FULL).fill(null); }
function put(board, x, y, colour, id) { board[(y + 3) * W + x] = { id, colour }; }
function stateWith(board, active = null, extra = {}) {
  const base = createGame({ width: W, height: H, seed: 'fixture' });
  return { ...base, board, active, phase: 'falling', nextId: 10000, allClears: 0, elapsedTicks: 0, assisted: false, witnessIndex: -1, recording: [], ...extra };
}
function active(colours = ['red', 'green'], pivot = { x: 2, y: 10 }, orientation = 'up') {
  return { pivot, orientation, gems: [{ id: 9001, colour: colours[0] }, { id: 9002, colour: colours[1] }], level: 1, gravityTicks: 0, groundedTicks: 0, resetCount: 0, groundedStarted: false };
}
function tick(state, n) { const result = advanceTicks(state, n); return result.state; }

test('public setup validates dimensions, presets, colours and deterministic stable pair identities', () => {
  assert.deepEqual([createGame().settings.width, createGame().settings.height], [6, 12]);
  assert.deepEqual([createGame({ preset: 'narrow' }).settings.width, createGame({ preset: 'narrow' }).settings.height], [5, 12]);
  assert.deepEqual([createGame({ preset: 'wide' }).settings.width, createGame({ preset: 'wide' }).settings.height], [8, 12]);
  assert.deepEqual([createGame({ preset: 'tall' }).settings.width, createGame({ preset: 'tall' }).settings.height], [6, 16]);
  assert.throws(() => createGame({ width: 4 }), /5–16 columns/);
  assert.throws(() => createGame({ height: 11 }), /12–32 visible rows/);
  assert.throws(() => createGame({ width: 10, height: 33 }), /12–32 visible rows/);
  assert.throws(() => createGame({ preset: 'custom' }), /Unsupported board preset/);
  assert.throws(() => createGame({ colourCount: 7 }), /Colour count/);
  const a = createGame({ seed: 'same' }); const b = createGame({ seed: 'same' });
  assert.deepEqual(a, b); assert.deepEqual(a.active.gems.map(g => g.id), [1, 2]);
  assert.deepEqual(a.active.gems.map(g => g.id), [1, 2]); assert.equal(a.nextId, 3);
  assert.deepEqual(a.next, b.next); assert.equal(a.bag.length, 4);
});

test('rigid movement, identity-preserving rotations, legal actions and rejected-state identity', () => {
  const game = createGame({ seed: 'actions' }); const original = structuredClone(game);
  const cw = applyAction(game, { kind: 'rotate-clockwise' });
  assert.equal(cw.state.active.orientation, 'right'); assert.deepEqual(cw.state.active.gems, game.active.gems);
  const ccw = applyAction(cw.state, { kind: 'rotate-anticlockwise' }); assert.equal(ccw.state.active.orientation, 'up');
  const left = applyAction(game, { kind: 'left' }); assert.equal(left.state.active.pivot.x, game.active.pivot.x - 1);
  assert.deepEqual(game, original);
  const blockedBoard = [...game.board]; blockedBoard[(game.active.pivot.y + 3) * W + game.active.pivot.x - 1] = { id: 88, colour: 'teal' };
  const blocked = { ...game, board: blockedBoard }; const reject = applyAction(blocked, { kind: 'left' });
  assert.equal(reject.accepted, false); assert.equal(reject.state, blocked); assert.equal(reject.state.randomState, game.randomState);
  for (const action of legalActions(game)) assert.equal(applyAction(game, action).accepted, true, action.kind);
  assert.equal(statusOf(game).phase, 'falling');
});

test('ordered rotation kick reaches the wall and a fully blocked rotation preserves identity', () => {
  const wallPair = active(['red', 'blue'], { x: 0, y: 5 }, 'up');
  const kicked = applyAction(stateWith(blank(), wallPair), { kind: 'rotate-anticlockwise' });
  assert.equal(kicked.accepted, true); assert.equal(kicked.state.active.orientation, 'left');
  assert.deepEqual(kicked.state.active.pivot, { x: 1, y: 5 }); assert.deepEqual(kicked.events[0].kick, { x: 1, y: 0 });
  const board = blank(); [[3, 5], [2, 5], [4, 5], [3, 4]].forEach(([x, y], i) => put(board, x, y, 'gold', 70 + i));
  const blocked = stateWith(board, active(['red', 'blue'], { x: 2, y: 5 }, 'up'));
  const reject = applyAction(blocked, { kind: 'rotate-clockwise' });
  assert.equal(reject.accepted, false); assert.equal(reject.state, blocked); assert.equal(reject.reason, 'blocked-rotation');
});

test('ghost shows independent settled destinations for a horizontal pair over uneven columns', () => {
  const board = blank();
  for (let y = 8; y <= 11; y++) put(board, 2, y, 'gold', 200 + y);
  put(board, 3, 11, 'purple', 220);
  const state = stateWith(board, active(['red', 'blue'], { x: 2, y: 7 }, 'right'));
  assert.deepEqual(landingCells(state), [{ x: 2, y: 7 }, { x: 3, y: 10 }]);
  assert.equal(state.board.filter(Boolean).length, 5);
});

test('diagonal contacts do not join, four-connected groups qualify, and disconnected groups stay distinct', () => {
  const diagonal = blank(); [[0, 0], [1, 1], [2, 2], [3, 3]].forEach(([x, y], i) => put(diagonal, x, y, 'red', i + 1));
  assert.deepEqual(findGroups(diagonal, W, FULL), []);
  const mixed = blank(); [[0, 11], [1, 11], [1, 10], [2, 10]].forEach(([x, y], i) => put(mixed, x, y, 'blue', 20 + i));
  assert.deepEqual(findGroups(mixed, W, FULL), [[(11 + 3) * W, (11 + 3) * W + 1, (10 + 3) * W + 1, (10 + 3) * W + 2].sort((a, b) => a - b)]);
  const groups = blank();
  [[0, 11], [1, 11], [0, 10], [1, 10], [4, 11], [5, 11], [4, 10], [5, 10]].forEach(([x, y], i) => put(groups, x, y, 'green', 50 + i));
  assert.equal(findGroups(groups, W, FULL).length, 2);
  const three = blank(); [[0, 11], [1, 11], [2, 11]].forEach(([x, y], i) => put(three, x, y, 'gold', i + 1));
  assert.deepEqual(findGroups(three, W, FULL), []);
});

test('620-point two-wave all-clear exposes mark, removal holes, gravity, and the next match', () => {
  // B occupies y=8..11; the red at (2,7) waits to fall onto the bottom red group.
  const cascadeBoard = blank();
  put(cascadeBoard, 2, 7, 'red', 301); put(cascadeBoard, 2, 8, 'blue', 302); put(cascadeBoard, 2, 9, 'blue', 303); put(cascadeBoard, 2, 10, 'blue', 304);
  put(cascadeBoard, 2, 11, 'blue', 305); put(cascadeBoard, 0, 11, 'red', 306); put(cascadeBoard, 1, 11, 'red', 307); put(cascadeBoard, 1, 10, 'red', 308);
  // The first clear is the four B at y=8..11; R at x=2 falls to join the three bottom R.
  let state = stateWith(cascadeBoard, null, { phase: 'clear-mark', settings: { ...createGame({ mode: 'arcade' }).settings, width: W, height: H }, resolutionLevel: 1, resolutionHadClear: true, clearCells: [(8 + 3) * W + 2, (9 + 3) * W + 2, (10 + 3) * W + 2, (11 + 3) * W + 2] });
  state = tick(state, 7); assert.equal(state.phase, 'clear-remove'); assert.equal(state.board.filter(Boolean).length, 8);
  state = tick(state, 6); assert.equal(state.phase, 'gravity'); assert.equal(state.board[(11 + 3) * W + 2], null);
  state = tick(state, 9); assert.equal(state.phase, 'clear-mark'); assert.equal(state.waves.length, 1); assert.equal(state.clearCells.length, 4);
  assert.deepEqual(state.waves[0], { chain: 1, cells: [(8 + 3) * W + 2, (9 + 3) * W + 2, (10 + 3) * W + 2, (11 + 3) * W + 2], ids: [302, 303, 304, 305], points: 40 });
  state = tick(state, 22); assert.equal(state.phase, 'falling'); assert.equal(state.score, 620); assert.equal(state.maxChain, 2);
  assert.equal(state.completedPairs, 0); assert.equal(state.board.filter(Boolean).length, 0); assert.equal(state.active.gems.length, 2);
  assert.equal(state.waves[1].points, 80);
});

test('split landing placement compacts stones independently, then matches from the settled board', () => {
  const board = blank();
  put(board, 2, 8, 'gold', 401); put(board, 2, 9, 'gold', 402); put(board, 2, 10, 'gold', 403); put(board, 2, 11, 'gold', 404); put(board, 3, 11, 'purple', 405);
  const pair = active(['red', 'blue'], { x: 2, y: 7 }, 'right'); const before = stateWith(board, pair);
  const placed = applyAction(before, { kind: 'place' });
  assert.equal(placed.accepted, true); assert.equal(placed.state.phase, 'gravity');
  const settled = tick(placed.state, 9);
  assert.deepEqual([settled.board[(7 + 3) * W + 2]?.id, settled.board[(10 + 3) * W + 3]?.id], [9001, 9002]);
});

test('Relaxed Place and timed hard drop share the ghost while bonuses remain mode-specific', () => {
  const supports = blank();
  for (let y = 8; y <= 11; y++) put(supports, 2, y, 'gold', 800 + y);
  put(supports, 3, 11, 'purple', 812);
  const pair = active(['red', 'blue'], { x: 2, y: 7 }, 'right');
  const relaxed = stateWith(supports, pair);
  const arcade = stateWith(supports, pair, { settings: { ...createGame({ mode: 'arcade' }).settings, width: W, height: H } });
  assert.deepEqual(landingCells(relaxed), [{ x: 2, y: 7 }, { x: 3, y: 10 }]);
  const place = applyAction(relaxed, { kind: 'place' }); const drop = applyAction(arcade, { kind: 'hard-drop' });
  assert.deepEqual(place.events.find(e => e.type === 'pair-locked').cells, [{ x: 2, y: 7 }, { x: 3, y: 7 }]);
  assert.deepEqual(drop.events.find(e => e.type === 'pair-locked').cells, [{ x: 2, y: 7 }, { x: 3, y: 7 }]);
  assert.deepEqual(place.state.gravityBoard, drop.state.gravityBoard);
  assert.equal(place.state.score, 0); assert.equal(drop.state.score, 2 * (landingCells(arcade)[0].y - arcade.active.pivot.y));

  const verticalBoard = blank(); for (let y = 8; y <= 11; y++) put(verticalBoard, 2, y, 'gold', 900 + y);
  let vertical = stateWith(verticalBoard, active(['green', 'teal'], { x: 2, y: 3 }, 'up'));
  vertical = applyAction(vertical, { kind: 'rotate-clockwise' }).state;
  vertical = applyAction(vertical, { kind: 'rotate-clockwise' }).state;
  assert.equal(vertical.active.orientation, 'down');
  assert.deepEqual(landingCells(vertical), [{ x: 2, y: 6 }, { x: 2, y: 7 }]);
  const locked = applyAction(vertical, { kind: 'place' });
  assert.equal(locked.accepted, true); assert.equal(locked.state.score, 0);
});

test('hidden rows are checked after the current cascade has had a chance to clear them', () => {
  const board = blank();
  put(board, 0, -1, 'red', 501); put(board, 1, -1, 'red', 502); put(board, 2, -1, 'red', 503); put(board, 3, -1, 'red', 504);
  let state = stateWith(board, null, { phase: 'clear-mark', clearCells: [2 * W, 2 * W + 1, 2 * W + 2, 2 * W + 3] });
  state = tick(state, 7 + 6 + 9);
  assert.equal(state.phase, 'falling'); assert.notEqual(state.reason, 'top-out');
  const loneHidden = blank(); for (let y = -3; y < H; y++) put(loneHidden, 0, y, y % 2 ? 'blue' : 'gold', 601 + y + 3);
  const topped = stateWith(loneHidden, null, { phase: 'clear-mark', clearCells: [] });
  const ended = advanceTicks(topped, 22).state;
  assert.equal(ended.phase, 'lost'); assert.equal(ended.reason, 'top-out');
});

// An independent component walk and independent stable compactor check random boards.
function oracleGroups(board, width, height) {
  const seen = new Set(); const groups = [];
  for (let i = 0; i < board.length; i++) {
    if (!board[i] || seen.has(i)) continue; const colour = board[i].colour; const queue = [i]; seen.add(i); const cells = [];
    while (queue.length) {
      const at = queue.shift(); cells.push(at); const x = at % width; const y = Math.floor(at / width);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const j = ny * width + nx;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && !seen.has(j) && board[j]?.colour === colour) { seen.add(j); queue.push(j); }
      }
    }
    if (cells.length >= 4) groups.push(cells.sort((a, b) => a - b));
  }
  return groups.sort((a, b) => a[0] - b[0]);
}
function oracleGravity(board, width, height) {
  const result = Array(width * height).fill(null);
  for (let x = 0; x < width; x++) {
    const survivors = []; for (let y = 0; y < height; y++) if (board[y * width + x]) survivors.push(board[y * width + x]);
    survivors.forEach((gem, i) => { result[(height - survivors.length + i) * width + x] = gem; });
  }
  return result;
}
test('500 deterministic generated boards agree with independent group and gravity checks', () => {
  let random = 0x7a65bc31;
  const rand = n => { random ^= random << 13; random ^= random >>> 17; random ^= random << 5; return (random >>> 0) % n; };
  for (let run = 0; run < 500; run++) {
    const board = Array(W * FULL).fill(null); let id = 1;
    for (let i = 0; i < board.length; i++) if (rand(100) < 48) board[i] = { id: id++, colour: ['red', 'blue', 'green', 'gold'][rand(4)] };
    assert.deepEqual(findGroups(board, W, FULL), oracleGroups(board, W, FULL), `group board ${run}`);
    assert.deepEqual(compactBoard(board, W, FULL), oracleGravity(board, W, FULL), `gravity board ${run}`);
  }
});

test('resolution batching preserves immutable snapshots and tick/event ordering', () => {
  const board = blank(); [[0, 11], [1, 11], [2, 11], [3, 11]].forEach(([x, y], i) => put(board, x, y, 'blue', 700 + i));
  const start = stateWith(board, null, { phase: 'clear-mark', clearCells: [14 * W, 14 * W + 1, 14 * W + 2, 14 * W + 3] });
  const original = structuredClone(start); let sequential = start; const events = [];
  for (let i = 0; i < 40; i++) { const step = advanceTicks(sequential, 1); sequential = step.state; events.push(...step.events); }
  const batched = advanceTicks(start, 40); assert.deepEqual(batched.state, sequential); assert.deepEqual(batched.events, events); assert.deepEqual(start, original);
  assert.deepEqual(events.map(event => event.type).filter(type => type === 'clear-removal-started' || type === 'cells-cleared' || type === 'cells-fell' || type === 'run-ended' || type === 'pair-spawned'), ['clear-removal-started', 'cells-cleared', 'pair-spawned']);
});

test('modes enforce canonical Daily settings, distinct Place/drop controls, deterministic levels and scoring', () => {
  assert.throws(() => createGame({ mode: 'daily' }), StoneChainsOptionsError);
  const date = '2026-10-05'; const daily = createGame({ mode: 'daily', dailyDate: date });
  assert.deepEqual([daily.settings.width, daily.settings.height, daily.settings.colourCount, daily.settings.pairLimit], [6, 12, 4, 60]);
  assert.deepEqual(daily, createGame({ mode: 'daily', dailyDate: date }));
  assert.throws(() => createGame({ mode: 'daily', dailyDate: date, width: 8 }), StoneChainsOptionsError);
  assert.throws(() => createGame({ mode: 'daily', dailyDate: date, colourCount: 5 }), StoneChainsOptionsError);
  assert.throws(() => createGame({ mode: 'daily', dailyDate: '2026-02-30' }), StoneChainsOptionsError);
  assert.deepEqual(restartGame(daily), daily);

  let relaxed = createGame({ seed: 'relaxed' }); const startY = relaxed.active.pivot.y;
  for (let i = 0; i < 80; i++) relaxed = advanceTicks(relaxed, 1).state;
  assert.equal(relaxed.active.pivot.y, startY); assert.equal(relaxed.score, 0);
  assert.equal(applyAction(relaxed, { kind: 'hard-drop' }).accepted, false);
  for (let i = 0; i < 13; i++) relaxed = applyAction(relaxed, { kind: 'down' }).state;
  assert.equal(relaxed.active.pivot.y, 11);
  const placed = applyAction(relaxed, { kind: 'place' }); assert.equal(placed.accepted, true);
  assert.equal(placed.events.find(event => event.type === 'pair-locked').cells[0].y, 11);

  const arcade = createGame({ mode: 'arcade', seed: 'score' });
  const noPlace = applyAction(arcade, { kind: 'place' }); assert.equal(noPlace.accepted, false); assert.equal(noPlace.state, arcade);
  const soft = applyAction(arcade, { kind: 'down' }); assert.equal(soft.state.score, 1);
  const dropped = applyAction(arcade, { kind: 'hard-drop' });
  assert.equal(dropped.state.score, 2 * (landingCells(arcade)[0].y - arcade.active.pivot.y));
  assert.equal(dropped.accepted, true);
  const threshold = stateWith(blank(), active(['red', 'blue'], { x: 2, y: 10 }, 'right'), { settings: { ...arcade.settings, width: W, height: H }, completedPairs: 29 });
  const next = applyAction(threshold, { kind: 'hard-drop' }); assert.equal(next.state.active.level, 2); assert.equal(next.state.completedPairs, 30);
});

test('Daily ends cleanly at its resolved-pair cap and timed pause becomes assisted practice', () => {
  const daily = createGame({ mode: 'daily', dailyDate: '2026-10-05' });
  const atLimit = { ...daily, board: blank(), completedPairs: 59, active: { ...daily.active, pivot: { x: 2, y: 10 }, level: 2 } };
  const final = applyAction(atLimit, { kind: 'hard-drop' }); assert.equal(final.state.phase, 'finished'); assert.equal(final.state.reason, 'pair-limit');
  assert.equal(final.state.completedPairs, 60); assert.equal(final.state.score, 2);
  const arcade = createGame({ mode: 'arcade' }); const paused = applyAction(arcade, { kind: 'pause' });
  assert.equal(paused.state.phase, 'paused'); assert.equal(paused.state.assisted, true);
  const frozen = advanceTicks(paused.state, 100); assert.equal(frozen.state.elapsedTicks, 0); assert.equal(frozen.state, paused.state);
  const resumed = applyAction(frozen.state, { kind: 'resume' }); assert.equal(resumed.state.phase, 'falling');
  assert.equal(resumed.state.assisted, true); assert.equal(advanceTicks(resumed.state, 1).state.elapsedTicks, 1);
});

function groundedArcade({ x = 2, orientation = 'right', support = [2, 3], resetCount = 0, groundedTicks = 0, groundedStarted = true } = {}) {
  const board = blank(); for (const col of support) put(board, col, 11, 'teal', 5000 + col);
  return stateWith(board, { ...active(['red', 'blue'], { x, y: 10 }, orientation), resetCount, groundedTicks, groundedStarted }, { settings: { ...createGame({ mode: 'arcade' }).settings, width: W, height: H } });
}

test('ground contact begins at zero and locks after 24 accumulated grounded ticks', () => {
  let state = groundedArcade({ groundedStarted: false });
  state = advanceTicks(state, 1).state; assert.equal(state.active.groundedStarted, true); assert.equal(state.active.groundedTicks, 0);
  state = advanceTicks(state, 23).state; assert.equal(state.active.groundedTicks, 23); assert.equal(state.completedPairs, 0);
  state = advanceTicks(state, 1).state; assert.equal(state.completedPairs, 1); assert.equal(state.active.level, 1);
});

test('eight successful grounded slides consume resets; the ninth keeps 23 ticks and locks on the next tick', () => {
  const floor = Array.from({ length: W }, (_, x) => x);
  let state = groundedArcade({ x: 1, support: floor });
  for (const direction of ['right', 'right', 'right', 'left', 'left', 'left', 'right', 'right']) state = applyAction(state, { kind: direction }).state;
  assert.equal(state.active.resetCount, 8); assert.equal(state.active.groundedTicks, 0);
  state = groundedArcade({ x: 2, support: floor, resetCount: 8, groundedTicks: 23 });
  const ninth = applyAction(state, { kind: 'right' }); assert.equal(ninth.accepted, true);
  assert.equal(ninth.state.active.resetCount, 8); assert.equal(ninth.state.active.groundedTicks, 23);
  assert.equal(advanceTicks(ninth.state, 1).state.completedPairs, 1);
});

test('blocked moves do not reset; exhausted airtime pauses and recontact resumes grounded time', () => {
  const blocked = groundedArcade({ x: 0, orientation: 'right', support: [0, 1], resetCount: 3, groundedTicks: 23 });
  const failed = applyAction(blocked, { kind: 'left' }); assert.equal(failed.accepted, false); assert.equal(failed.state, blocked);
  assert.equal(blocked.active.resetCount, 3); assert.equal(blocked.active.groundedTicks, 23);

  let state = groundedArcade({ x: 2, support: [2], resetCount: 7, groundedTicks: 19 });
  const departure = applyAction(state, { kind: 'right' }); assert.equal(departure.accepted, true);
  assert.equal(departure.state.active.resetCount, 8); assert.equal(departure.state.active.groundedTicks, 0);
  assert.equal(departure.state.active.groundedStarted, false); // the eighth reset clears contact time

  state = groundedArcade({ x: 2, support: [2], resetCount: 8, groundedTicks: 13 });
  const leftSupport = applyAction(state, { kind: 'right' }); assert.equal(leftSupport.state.active.groundedTicks, 13);
  state = advanceTicks(leftSupport.state, 10).state; assert.equal(state.active.groundedTicks, 13);
  state = applyAction(state, { kind: 'left' }).state; assert.equal(state.active.groundedStarted, true); assert.equal(state.active.groundedTicks, 13);
  state = advanceTicks(state, 11).state; assert.equal(state.completedPairs, 1);
});

test('rotation consumes reset only on accepted grounded turns and rejected kicks preserve identity', () => {
  const floor = Array.from({ length: W }, (_, x) => x);
  const grounded = groundedArcade({ x: 2, support: floor, groundedTicks: 9 });
  const turned = applyAction(grounded, { kind: 'rotate-clockwise' }); assert.equal(turned.accepted, true);
  assert.equal(turned.state.active.resetCount, 1); assert.equal(turned.state.active.groundedTicks, 0);
  const obstacleBoard = blank(); [[2, 11], [3, 10], [1, 10], [4, 10], [3, 9]].forEach(([x, y], i) => put(obstacleBoard, x, y, 'gold', 6000 + i));
  const blocked = stateWith(obstacleBoard, { ...active(['red', 'blue'], { x: 2, y: 10 }, 'up'), groundedStarted: true, groundedTicks: 22 }, { settings: { ...createGame({ mode: 'arcade' }).settings, width: W, height: H } });
  const rejected = applyAction(blocked, { kind: 'rotate-clockwise' }); assert.equal(rejected.accepted, false); assert.equal(rejected.state, blocked);
  const zeroContact = applyAction(groundedArcade({ groundedStarted: false }), { kind: 'rotate-clockwise' });
  assert.equal(zeroContact.state.active.resetCount, 1); assert.equal(zeroContact.state.active.groundedTicks, 0);
});

test('input repeats at 10/3, soft drops every two ticks, orders edges, and releases on lock or resolution', () => {
  const game = createGame({ mode: 'arcade', seed: 'input' });
  let input = createInputScheduler(); input = setHeldInput(input, 'left', true); input = setHeldInput(input, 'soft-drop', true);
  const observed = [];
  for (let tick = 0; tick <= 10; tick++) { const [actions, next] = actionsForTick(game, input); observed.push([tick, actions.map(action => action.kind)]); input = next; }
  assert.deepEqual(observed[0], [0, ['left', 'down']]);
  assert.deepEqual(observed[2], [2, ['down']]); assert.deepEqual(observed[10], [10, ['left', 'down']]);
  input = createInputScheduler(); input = setHeldInput(input, 'left', true);
  input = queueInputEdge(input, { kind: 'rotate-clockwise' }); input = queueInputEdge(input, { kind: 'hard-drop' }); input = queueInputEdge(input, { kind: 'pause' });
  const [ordered] = actionsForTick(game, input); assert.deepEqual(ordered.map(action => action.kind), ['left', 'rotate-clockwise', 'hard-drop', 'pause']);
  const [scheduled, nextInput] = actionsForTick(game, input);
  const [locked, released] = applyScheduledActions(game, nextInput, scheduled, applyAction);
  assert.equal(locked.recording.at(-1).action.kind, 'hard-drop'); assert.deepEqual(released, createInputScheduler());
  const [paused, pauseInput] = actionsForTick({ ...game, phase: 'clear-mark', active: null }, setHeldInput(input, 'right', true));
  assert.deepEqual(paused, [{ kind: 'pause' }]); assert.deepEqual(pauseInput, createInputScheduler());
  const [duringResolution, afterResolution] = actionsForTick({ ...game, phase: 'gravity', active: null }, setHeldInput(createInputScheduler(), 'left', true));
  assert.deepEqual(duringResolution, []); assert.deepEqual(afterResolution, createInputScheduler());
});

test('challenge goals verify their witness, win on the final queue placement and make hints sticky-assisted', () => {
  const board = blank(); for (const x of [0, 1, 3]) put(board, x, 11, 'red', 7000 + x);
  const options = { id: 'chain-targets', width: W, height: H, colourCount: 4, board: board.slice(W * 3), queue: [['green', 'blue'], ['red', 'blue']], goal: { kind: 'clear-targets', targetIds: [7000, 7001, 7003] }, witness: [{ pivotX: 5, orientation: 'up' }, { pivotX: 2, orientation: 'up' }] };
  const challenge = createChallenge(options); const hint = applyAction(challenge, { kind: 'hint' });
  assert.equal(hint.accepted, true); assert.equal(hint.state.assisted, true); assert.equal(hint.events[0].pivotX, 5);
  let state = hint.state; for (let i = 0; i < 3; i++) state = applyAction(state, { kind: 'right' }).state;
  state = applyAction(state, { kind: 'hard-drop' }).state; assert.equal(state.completedPairs, 1); assert.equal(state.phase, 'falling');
  const secondHint = applyAction(state, { kind: 'hint' }); assert.equal(secondHint.accepted, true);
  state = secondHint.state; state = applyAction(state, { kind: 'hard-drop' }).state;
  while (['clear-mark', 'clear-remove', 'gravity'].includes(state.phase)) state = advanceTicks(state, 3600).state;
  assert.equal(state.phase, 'won'); assert.equal(state.reason, 'goal-complete'); assert.equal(state.completedPairs, 2); assert.equal(state.assisted, true);
  assert.equal(restartGame(state).phase, 'falling'); assert.equal(restartGame(state).settings.challengeId, 'chain-targets');
  assert.throws(() => createChallenge({ ...options, witness: [{ pivotX: 5, orientation: 'up' }] }), StoneChainsOptionsError);
});

test('challenge hints disappear off the witnessed prefix and exhausted queues report an honest loss', () => {
  const board = blank(); for (const x of [0, 1, 3]) put(board, x, 11, 'red', 8000 + x);
  const options = { id: 'finite-targets', width: W, height: H, colourCount: 4, board: board.slice(W * 3), queue: [['green', 'blue'], ['red', 'blue']], goal: { kind: 'clear-targets', targetIds: [8000, 8001, 8003] }, witness: [{ pivotX: 5, orientation: 'up' }, { pivotX: 2, orientation: 'up' }] };
  let state = createChallenge(options); state = applyAction(state, { kind: 'right' }).state;
  state = applyAction(state, { kind: 'right' }).state; state = applyAction(state, { kind: 'hard-drop' }).state;
  assert.equal(state.witnessIndex, -1); assert.equal(state.phase, 'falling');
  const unavailable = applyAction(state, { kind: 'hint' }); assert.equal(unavailable.accepted, false); assert.equal(unavailable.state, state);
  for (let i = 0; i < 3; i++) state = applyAction(state, { kind: 'right' }).state;
  state = applyAction(state, { kind: 'hard-drop' }).state;
  assert.equal(state.phase, 'lost'); assert.equal(state.reason, 'challenge-queue-exhausted');
  assert.equal(applyAction(state, { kind: 'left' }).accepted, false);
});

test('canonical saves replay daily, paused, selected-tick and mid-resolution checkpoints; hostile data is rejected', () => {
  let arcade = createGame({ mode: 'arcade', seed: 'recording' });
  arcade = applyAction(arcade, { kind: 'left' }).state; arcade = advanceTicks(arcade, 20).state; arcade = applyAction(arcade, { kind: 'rotate-clockwise' }).state;
  assert.deepEqual(decodeGame(encodeGame(arcade)), arcade);
  const paused = applyAction(arcade, { kind: 'pause' }).state; assert.deepEqual(decodeGame(encodeGame(paused)), paused);
  const resumed = applyAction(paused, { kind: 'resume' }).state; assert.deepEqual(decodeGame(encodeGame(resumed)), resumed);
  const daily = createGame({ mode: 'daily', dailyDate: '2026-10-05' }); assert.deepEqual(decodeGame(encodeGame(daily)), daily);

  const board = blank(); for (const x of [0, 1, 3]) put(board, x, 11, 'red', 9000 + x);
  const challenge = createChallenge({ id: 'save-phase', width: W, height: H, colourCount: 4, board: board.slice(W * 3), queue: [['green', 'blue'], ['red', 'blue']], goal: { kind: 'clear-targets', targetIds: [9000, 9001, 9003] }, witness: [{ pivotX: 5, orientation: 'up' }, { pivotX: 2, orientation: 'up' }] });
  let state = challenge; for (let i = 0; i < 3; i++) state = applyAction(state, { kind: 'right' }).state;
  state = applyAction(state, { kind: 'hard-drop' }).state; // safe first placement
  state = applyAction(state, { kind: 'hard-drop' }).state; assert.equal(state.phase, 'clear-mark');
  assert.deepEqual(decodeGame(encodeGame(state)), state);
  state = advanceTicks(state, 8).state; assert.equal(state.phase, 'clear-remove');
  state = applyAction(state, { kind: 'pause' }).state; assert.equal(state.phase, 'paused');
  assert.deepEqual(decodeGame(encodeGame(state)), state);
  const elapsed = state.elapsedTicks; state = advanceTicks(state, 50).state; assert.equal(state.elapsedTicks, elapsed);
  state = applyAction(state, { kind: 'resume' }).state; state = advanceTicks(state, 100).state; assert.equal(state.phase, 'won');
  assert.deepEqual(decodeGame(encodeGame(state)), state);

  const parsed = JSON.parse(encodeGame(arcade)); parsed.checkpoint.score++;
  assert.throws(() => decodeGame(JSON.stringify(parsed)), /checkpoint/);
  const extra = JSON.parse(encodeGame(arcade)); extra.actions[0].secret = true;
  assert.throws(() => decodeGame(JSON.stringify(extra)), /record/);
  assert.throws(() => decodeGame('{'), /JSON/);
  assert.throws(() => decodeGame('x'.repeat(2 * 1024 * 1024 + 1)), RangeError);
  assert.throws(() => encodeGame({ ...arcade, elapsedTicks: 10_000_001 }), RangeError);
  assert.throws(() => encodeGame({ ...arcade, recording: Array(100_001).fill({ tick: 0, ordinal: 0, action: { kind: 'left' } }) }), RangeError);
});

test('gravity follows the level curve, soft drop prevents a duplicate gravity step, and ticks batch identically', () => {
  let state = createGame({ mode: 'arcade', seed: 'gravity' });
  const start = state.active.pivot.y; state = advanceTicks(state, 59).state; assert.equal(state.active.pivot.y, start);
  state = advanceTicks(state, 1).state; assert.equal(state.active.pivot.y, start + 1);
  const threshold = stateWith(blank(), active(['red', 'blue'], { x: 2, y: 10 }, 'right'), { settings: { ...createGame({ mode: 'arcade' }).settings, width: W, height: H }, completedPairs: 29 });
  const secondLevel = applyAction(threshold, { kind: 'hard-drop' }).state; assert.equal(secondLevel.active.level, 2);
  const atLevelTwo = { ...createGame({ mode: 'arcade', seed: 'level-two' }), active: { ...createGame({ mode: 'arcade', seed: 'level-two' }).active, level: 2 } };
  const levelTwoY = atLevelTwo.active.pivot.y; const after50 = advanceTicks(atLevelTwo, 50).state; assert.equal(after50.active.pivot.y, levelTwoY);
  assert.equal(advanceTicks(after50, 1).state.active.pivot.y, levelTwoY + 1);

  const scheduler = setHeldInput(createInputScheduler(), 'soft-drop', true);
  const [softGame, ,] = processInputTick(createGame({ mode: 'arcade', seed: 'soft' }), scheduler, applyAction, advanceTicks);
  assert.equal(softGame.active.pivot.y, -1); assert.equal(softGame.score, 1); assert.equal(softGame.active.gravityTicks, 1);
  const batchedStart = createGame({ mode: 'arcade', seed: 'batch-clock' });
  let sequential = batchedStart; const events = [];
  for (let i = 0; i < 120; i++) { const step = advanceTicks(sequential, 1); sequential = step.state; events.push(...step.events); }
  const batched = advanceTicks(batchedStart, 120); assert.deepEqual(batched.state, sequential); assert.deepEqual(batched.events, events);
});

test('challenge minimum-chain and empty-board objectives are independently witnessed', () => {
  const triple = Array(W * H).fill(null); triple[11 * W] = { id: 11001, colour: 'red' }; triple[11 * W + 1] = { id: 11002, colour: 'red' }; triple[11 * W + 3] = { id: 11003, colour: 'red' };
  const chain = createChallenge({ id: 'minimum-chain', width: W, height: H, colourCount: 4, board: triple, queue: [['red', 'blue'], ['green', 'gold']], goal: { kind: 'minimum-chain', chain: 1 }, witness: [{ pivotX: 2, orientation: 'up' }] });
  let win = applyAction(chain, { kind: 'hard-drop' }).state;
  while (['clear-mark', 'clear-remove', 'gravity'].includes(win.phase)) win = advanceTicks(win, 3600).state;
  assert.equal(win.phase, 'won'); assert.equal(win.maxChain, 1);

  const two = Array(W * H).fill(null); two[11 * W] = { id: 12001, colour: 'gold' }; two[11 * W + 1] = { id: 12002, colour: 'gold' };
  const empty = createChallenge({ id: 'empty-board', width: W, height: H, colourCount: 4, board: two, queue: [['gold', 'gold'], ['red', 'blue']], goal: { kind: 'empty-board' }, witness: [{ pivotX: 2, orientation: 'up' }] });
  win = applyAction(empty, { kind: 'hard-drop' }).state;
  while (['clear-mark', 'clear-remove', 'gravity'].includes(win.phase)) win = advanceTicks(win, 3600).state;
  assert.equal(win.phase, 'won'); assert.equal(win.board.every(gem => gem === null), true);
  assert.equal(win.allClears, 0); // Challenges do not receive the Arcade/Daily clear bonus.
});

test('the canonical recording captures held timing and rejects malformed setup and replay bounds', () => {
  const start = createGame({ mode: 'arcade', seed: 'held-save' });
  const held = setHeldInput(createInputScheduler(), 'left', true);
  const [saved, ] = processInputTick(start, held, applyAction, advanceTicks);
  assert.deepEqual(decodeGame(encodeGame(saved)), saved);
  assert.equal(saved.recording[0].tick, 0); assert.equal(saved.recording[0].ordinal, 0);
  assert.throws(() => createGame({ mode: 'arcade', width: 17, height: 12 }), StoneChainsOptionsError);
  assert.throws(() => createChallenge({ id: 'bad', width: W, height: H, board: Array(W * H).fill(null), queue: [['red', 'blue']], goal: { kind: 'empty-board' }, witness: [{ pivotX: 2, orientation: 'up' }] }), StoneChainsOptionsError);
  const board = Array(W * H).fill(null); board[0] = { id: 1, colour: 'red' }; board[1] = { id: 1, colour: 'blue' };
  assert.throws(() => createChallenge({ id: 'duplicate', width: W, height: H, board, queue: [['red', 'blue'], ['green', 'gold']], goal: { kind: 'empty-board' }, witness: [{ pivotX: 2, orientation: 'up' }] }), StoneChainsOptionsError);
});

test('a witnessed objective wins before a simultaneous hidden-row top-out or exhausted queue', () => {
  const board = Array(W * H).fill(null); let id = 13000;
  for (let y = 0; y < H; y++) board[y * W + 2] = { id: id++, colour: y % 2 ? 'blue' : 'green' };
  const targets = [];
  for (let y = 8; y < 12; y++) { const gemId = id++; targets.push(gemId); board[y * W] = { id: gemId, colour: 'red' }; }
  const challenge = createChallenge({ id: 'win-before-topout', width: W, height: H, colourCount: 4, board, queue: [['gold', 'blue'], ['red', 'green']], goal: { kind: 'clear-targets', targetIds: targets }, witness: [{ pivotX: 2, orientation: 'up' }] });
  let state = applyAction(challenge, { kind: 'hard-drop' }).state;
  assert.equal(state.board.slice(0, W * 3).some(Boolean), true);
  while (['clear-mark', 'clear-remove', 'gravity'].includes(state.phase)) state = advanceTicks(state, 3600).state;
  assert.equal(state.phase, 'won'); assert.equal(state.reason, 'goal-complete');
  assert.equal(state.board.slice(0, W * 3).some(Boolean), true);
});
