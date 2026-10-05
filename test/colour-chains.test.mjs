import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, applyAction, advanceTicks, legalActions, statusOf, landingCells } from '../dist/colour-chains.js';
import { findGroups, compactBoard } from '../dist/colour-chains/match.js';

const C = { R: 'red', B: 'blue', G: 'green', Y: 'gold', P: 'purple', T: 'teal', '.': null };
const W = 6; const H = 12; const FULL = H + 3;
function blank() { return Array(W * FULL).fill(null); }
function put(board, x, y, colour, id) { board[(y + 3) * W + x] = { id, colour }; }
function stateWith(board, active = null, extra = {}) {
  const base = createGame({ width: W, height: H, seed: 'fixture' });
  return { ...base, board, active, phase: 'falling', nextId: 10000, ...extra };
}
function active(colours = ['red', 'green'], pivot = { x: 2, y: 10 }, orientation = 'up') {
  return { pivot, orientation, gems: [{ id: 9001, colour: colours[0] }, { id: 9002, colour: colours[1] }], level: 1 };
}
function tick(state, n) { const result = advanceTicks(state, n); return result.state; }

test('public setup validates dimensions, presets, colours and deterministic stable pair identities', () => {
  assert.deepEqual([createGame().settings.width, createGame().settings.height], [6, 12]);
  assert.deepEqual([createGame({ preset: 'narrow' }).settings.width, createGame({ preset: 'narrow' }).settings.height], [5, 12]);
  assert.deepEqual([createGame({ preset: 'wide' }).settings.width, createGame({ preset: 'wide' }).settings.height], [8, 12]);
  assert.deepEqual([createGame({ preset: 'tall' }).settings.width, createGame({ preset: 'tall' }).settings.height], [6, 16]);
  assert.throws(() => createGame({ width: 4 }), /5–10 columns/);
  assert.throws(() => createGame({ height: 11 }), /12–20 visible rows/);
  assert.throws(() => createGame({ width: 10, height: 25 }), /12–20 visible rows/);
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
  let state = stateWith(cascadeBoard, null, { phase: 'clear-mark', clearCells: [(8 + 3) * W + 2, (9 + 3) * W + 2, (10 + 3) * W + 2, (11 + 3) * W + 2] });
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

test('Place and hard drop share rigid ghost landing for uneven horizontal and rotated vertical pairs', () => {
  const supports = blank();
  for (let y = 8; y <= 11; y++) put(supports, 2, y, 'gold', 800 + y);
  put(supports, 3, 11, 'purple', 812);
  const horizontal = stateWith(supports, active(['red', 'blue'], { x: 2, y: 7 }, 'right'));
  assert.deepEqual(landingCells(horizontal), [{ x: 2, y: 7 }, { x: 3, y: 10 }]);
  const horizontalPlace = applyAction(horizontal, { kind: 'place' });
  const horizontalDrop = applyAction(horizontal, { kind: 'hard-drop' });
  assert.deepEqual(horizontalPlace.state.gravityBoard, horizontalDrop.state.gravityBoard);
  assert.deepEqual(horizontalPlace.events.find(e => e.type === 'pair-locked').cells, [{ x: 2, y: 7 }, { x: 3, y: 7 }]);
  assert.deepEqual(horizontalDrop.events.find(e => e.type === 'pair-locked').cells, [{ x: 2, y: 7 }, { x: 3, y: 7 }]);
  assert.deepEqual([horizontalPlace.state.gravityBoard.findIndex(g => g?.id === 9001), horizontalPlace.state.gravityBoard.findIndex(g => g?.id === 9002)], [(7 + 3) * W + 2, (10 + 3) * W + 3]);
  assert.equal(horizontalPlace.state.score, 0); assert.equal(horizontalDrop.state.score, 0);

  const verticalBoard = blank(); for (let y = 8; y <= 11; y++) put(verticalBoard, 2, y, 'gold', 900 + y);
  let vertical = stateWith(verticalBoard, active(['green', 'teal'], { x: 2, y: 3 }, 'up'));
  vertical = applyAction(vertical, { kind: 'rotate-clockwise' }).state;
  vertical = applyAction(vertical, { kind: 'rotate-clockwise' }).state;
  assert.equal(vertical.active.orientation, 'down');
  assert.deepEqual(landingCells(vertical), [{ x: 2, y: 6 }, { x: 2, y: 7 }]);
  const verticalPlace = applyAction(vertical, { kind: 'place' });
  const verticalDrop = applyAction(vertical, { kind: 'hard-drop' });
  assert.deepEqual(verticalPlace.state.gravityBoard, verticalDrop.state.gravityBoard);
  const verticalBoardAfterLock = verticalPlace.state.gravityBoard ?? verticalPlace.state.board;
  assert.deepEqual(verticalPlace.events.find(e => e.type === 'pair-locked').cells, [{ x: 2, y: 6 }, { x: 2, y: 7 }]);
  assert.deepEqual(verticalDrop.events.find(e => e.type === 'pair-locked').cells, [{ x: 2, y: 6 }, { x: 2, y: 7 }]);
  assert.deepEqual([verticalBoardAfterLock.findIndex(g => g?.id === 9001), verticalBoardAfterLock.findIndex(g => g?.id === 9002)], [(6 + 3) * W + 2, (7 + 3) * W + 2]);
  assert.equal(verticalPlace.state.score, 0); assert.equal(verticalDrop.state.score, 0);
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
