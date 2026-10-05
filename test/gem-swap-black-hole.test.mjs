import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, applyAction, advanceTicks, legalActions, statusOf, GemSwapOptionsError } from '../dist/gem-swap.js';
import { drawColour } from '../dist/gem-swap/random.js';
import { findMatches } from '../dist/gem-swap/board.js';

const checkerBoard = (width, height, mask = Array(width * height).fill(true), specialCell = -1) => Object.freeze(Array.from({ length: width * height }, (_, cell) => !mask[cell] ? null : Object.freeze({ id: 8000 + cell, colour: (cell % width + Math.floor(cell / width)) % 2 ? 'blue' : 'red', ...(cell === specialCell ? { kind: 'bomb' } : {}) })));
const enabled = (seed = 5, width = 6, height = 6, mask = Array(width * height).fill(true)) => {
  const game = createGame({ width, height, mask, seed, tools: true, advancedTools: true });
  return Object.freeze({ ...game, blackHoleCharges: 1 });
};
const target = (state, cell) => {
  let result = applyAction(state, { kind: 'select-tool', tool: 'black-hole' }); assert.equal(result.accepted, true);
  result = applyAction(result.state, { kind: 'target-tool', cell }); assert.equal(result.accepted, true); return result.state;
};
const place = (state, cell) => applyAction(target(state, cell), { kind: 'confirm-tool' });

test('advanced tools require the explicit tray and remain absent by default', () => {
  assert.throws(() => createGame({ advancedTools: true }), GemSwapOptionsError);
  const normal = createGame({ seed: 9 }); const stored = createGame({ seed: 9, tools: true });
  assert.equal(normal.settings.advancedTools, false); assert.equal(stored.settings.advancedTools, false);
  assert.equal(normal.blackHoleCharges, 0); assert.equal(normal.blackHole, null); assert.equal(normal.blackHoleProgress, 0);
  assert.equal(applyAction(stored, { kind: 'select-tool', tool: 'black-hole' }).reason, 'tool-unavailable');
});

test('placement preview is an independent row-major orthogonal wave with edge and mask clipping', () => {
  const corner = enabled(5); const cornerBoard = checkerBoard(6, 6); const state = { ...corner, board: cornerBoard };
  const preview = target(state, 0);
  assert.deepEqual(preview.toolPreview, [0, 1, 6]); // target plus orthogonal neighbours; diagonals 7 are excluded
  const mask = Array(36).fill(true); mask[13] = false;
  const clipped = enabled(6, 6, 6, mask); const clippedBoard = checkerBoard(6, 6, mask);
  const clippedPreview = target({ ...clipped, board: clippedBoard }, 14);
  assert.deepEqual(clippedPreview.toolPreview, [8, 14, 15, 20]);
  assert.ok(!clippedPreview.toolPreview.includes(13));
});

test('confirmation consumes the target first, swallows specials without activation, and scores portal gems once', () => {
  const base = enabled(5); const board = [...checkerBoard(6, 6, undefined, 8)];
  const state = { ...base, board: Object.freeze(board) };
  const preview = target(state, 14); assert.deepEqual(preview.toolPreview, [8, 13, 14, 15, 20]);
  const accepted = applyAction(preview, { kind: 'confirm-tool' });
  assert.equal(accepted.accepted, true); assert.deepEqual(accepted.state.pendingCells, preview.toolPreview);
  assert.equal(accepted.state.randomState, preview.randomState);
  assert.equal(accepted.state.blackHole.cell, 14); assert.equal(accepted.state.blackHole.capacityRemaining, 3);
  assert.equal(accepted.state.blackHole.movesRemaining, 2); assert.deepEqual(accepted.state.blackHole.consumedIds, preview.toolPreview.map(cell => board[cell].id));
  assert.equal(accepted.state.blackHoleCharges, 0); assert.equal(accepted.state.moves, 1); assert.equal(accepted.state.assisted, true);
  assert.ok(!accepted.events.some(event => event.type === 'special-activated'));
  const resolved = advanceTicks(accepted.state, 240);
  const portalClears = resolved.events.filter(event => event.type === 'cells-removed' && event.source === 'black-hole');
  assert.equal(portalClears.reduce((sum, event) => sum + event.points, 0), 50);
  assert.deepEqual(resolved.state.blackHole, { cell: 14, capacityRemaining: 3, movesRemaining: 2, consumedIds: preview.toolPreview.map(cell => board[cell].id) });
  assert.equal(resolved.state.blackHoleCharges, 0);
  assert.ok(!resolved.events.some(event => event.type === 'black-hole-closed'));
  const nextSwap = legalActions(resolved.state).find(action => action.kind === 'swap'); assert.ok(nextSwap);
  const nextMove = applyAction(resolved.state, nextSwap); assert.equal(nextMove.accepted, true);
  const fed = advanceTicks(nextMove.state, 240);
  const afterContact = fed.events.filter(event => event.type === 'cells-removed' && event.source === 'black-hole');
  assert.equal(afterContact.reduce((sum, event) => sum + event.points, 0), 30);
  const consumedIds = [...accepted.events.find(event => event.type === 'black-hole-consumed').ids, ...fed.events.filter(event => event.type === 'black-hole-consumed').flatMap(event => event.ids)];
  assert.equal(consumedIds.length, 8); assert.equal(new Set(consumedIds).size, 8);
  assert.equal(fed.state.blackHole, null); assert.ok(fed.events.some(event => event.type === 'black-hole-closed' && event.reason === 'capacity'));
  assert.ok(fed.state.board[14]);
  assert.ok(!fed.events.some(event => event.type === 'special-activated'));
  assert.equal(resolved.state.blackHoleProgress, 0); assert.equal(resolved.state.inventory.bomb, 1);
});

test('invalid targeting, cancellation, ticks, and repeated placement do not spend charge or move duration', () => {
  const start = enabled(12); const initial = { ...start, board: checkerBoard(6, 6) };
  for (const action of [{ kind: 'select-tool', tool: 'black-hole', extra: true }, { kind: 'select-tool', tool: 'black-hole-ish' }, { kind: 'target-tool', cell: 0, extra: true }]) {
    const rejected = applyAction(initial, action); assert.equal(rejected.accepted, false); assert.equal(rejected.state, initial);
  }
  const selected = applyAction(initial, { kind: 'select-tool', tool: 'black-hole' });
  for (const action of [{ kind: 'target-tool', cell: -1 }, { kind: 'target-tool', cell: 36 }, { kind: 'confirm-tool', extra: true }]) {
    const result = applyAction(selected.state, action); assert.equal(result.accepted, false); assert.equal(result.state, selected.state);
  }
  const cancelled = applyAction(selected.state, { kind: 'cancel-tool' });
  assert.equal(cancelled.state.blackHoleCharges, 1); assert.equal(cancelled.state.moves, 0); assert.equal(cancelled.state.randomState, initial.randomState);
  const placed = place(initial, 14); assert.equal(placed.accepted, true);
  assert.equal(applyAction(placed.state, { kind: 'select-tool', tool: 'black-hole' }).reason, 'resolution-in-progress');
  const ready = advanceTicks(placed.state, 240).state;
  if (ready.blackHole) {
    assert.equal(ready.blackHole.movesRemaining, 2);
    assert.equal(legalActions(ready).some(action => action.kind === 'select-tool' && action.tool === 'black-hole'), false);
    assert.equal(ready.blackHoleMovePending, false);
    const secondCharge = { ...ready, blackHoleCharges: 1 };
    assert.equal(applyAction(secondCharge, { kind: 'select-tool', tool: 'black-hole' }).reason, 'tool-unavailable');
  }
});

test('ordinary clears earn the independent 48-gem charge with carried progress; portal waves cannot self-award', () => {
  const base = createGame({ width: 6, height: 6, tools: true, advancedTools: true, seed: 4 });
  const colours = ['red','blue','green','gold','purple'];
  const cells = Array.from({ length: 36 }, (_, index) => Object.freeze({ id: 9000 + index, colour: colours[(index % 6 + 2 * Math.floor(index / 6)) % colours.length] }));
  cells[13] = Object.freeze({ id: 13, colour: 'blue' }); cells[14] = Object.freeze({ id: 14, colour: 'red' });
  cells[15] = Object.freeze({ id: 15, colour: 'green' }); cells[16] = Object.freeze({ id: 16, colour: 'red' }); cells[27] = Object.freeze({ id: 27, colour: 'red' });
  const ordinary = { ...base, board: Object.freeze(cells), blackHoleProgress: 47 };
  const swapped = applyAction(ordinary, { kind: 'swap', from: 9, to: 15 }); assert.equal(swapped.accepted, true);
  const removed = advanceTicks(swapped.state, 7).state;
  assert.equal(removed.blackHoleCharges, 1); assert.equal(removed.blackHoleProgress, 2);
  assert.equal(removed.inventory.bomb, ordinary.inventory.bomb);
  const capped = { ...ordinary, blackHoleCharges: 1 };
  const cappedSwap = applyAction(capped, { kind: 'swap', from: 9, to: 15 });
  const cappedRemoval = advanceTicks(cappedSwap.state, 7).state;
  assert.equal(cappedRemoval.blackHoleCharges, 1); assert.equal(cappedRemoval.blackHoleProgress, 2);
  assert.ok(cappedRemoval.blackHoleProgress < 48);
  const portalBase = { ...enabled(5), board: checkerBoard(6, 6), blackHoleProgress: 47 };
  const portal = place(portalBase, 14); const resolved = advanceTicks(portal.state, 240).state;
  assert.equal(resolved.blackHoleCharges, 0); assert.equal(resolved.blackHoleProgress, 47);
});

test('active portal is a gravity and refill barrier, with separate segments above and below', () => {
  const base = enabled(13); const board = [...checkerBoard(6, 6)];
  board[2 * 6 + 2] = null; board[4 * 6 + 2] = null;
  const portal = Object.freeze({ cell: 3 * 6 + 2, capacityRemaining: 5, movesRemaining: 2, consumedIds: Object.freeze([8000 + 3 * 6 + 2]) });
  board[portal.cell] = null;
  const state = { ...base, board: Object.freeze(board), blackHole: portal, phase: 'clear-remove', pendingCells: Object.freeze([14, 26]), pendingBlackHole: true };
  const falling = advanceTicks(state, 6).state;
  assert.equal(falling.phase, 'gravity'); assert.equal(falling.gravityBoard[portal.cell], null);
  assert.equal(falling.gravityBoard[2 * 6 + 2].id, board[1 * 6 + 2].id); assert.equal(falling.gravityBoard[4 * 6 + 2], null); assert.equal(falling.gravityBoard[5 * 6 + 2].id, board[5 * 6 + 2].id);
  const refillPhase = advanceTicks(falling, 9).state;
  const refilled = advanceTicks(refillPhase, 1);
  assert.ok(refilled.events.filter(event => event.type === 'gem-refilled').every(event => event.cell !== portal.cell));
});

test('contact capacity cutoff is row-major and consumed IDs are reserved before removal', () => {
  const base = enabled(31); const board = [...checkerBoard(6, 6)]; board[14] = null;
  const state = { ...base, blackHoleCharges: 0, board: Object.freeze(board), phase: 'refill', blackHole: Object.freeze({ cell: 14, capacityRemaining: 2, movesRemaining: 2, consumedIds: Object.freeze([8014]) }), blackHoleMovePending: true, blackHoleContactPending: true, blackHoleProgress: 47 };
  const wave = advanceTicks(state, 1);
  const event = wave.events.find(item => item.type === 'black-hole-consumed');
  assert.deepEqual(event.cells, [8, 13]); assert.deepEqual(event.ids, [8008, 8013]);
  assert.equal(wave.state.blackHole, null); assert.equal(wave.state.blackHoleContactPending, false);
  const afterRemoval = advanceTicks(wave.state, 7).state;
  assert.equal(afterRemoval.blackHoleCharges, 0); assert.equal(afterRemoval.blackHoleProgress, 47);
});

test('one orthogonal contact wave follows each move and the portal expires after placement plus two moves', () => {
  const width = 6; const height = 6; const mask = Array(36).fill(false);
  for (let x = 0; x < 6; x++) mask[x] = true;
  for (let y = 1; y < 6; y++) for (let x = 1; x < 6; x++) mask[y * width + x] = true;
  const base = enabled(22, width, height, mask); const state = { ...base, board: checkerBoard(width, height, mask) };
  const opening = target(state, 0); assert.deepEqual(opening.toolPreview, [0, 1]);
  let current = applyAction(opening, { kind: 'confirm-tool' }).state;
  current = advanceTicks(current, 240).state;
  assert.deepEqual(current.blackHole, { cell: 0, capacityRemaining: 6, movesRemaining: 2, consumedIds: [8000, 8001] });
  for (let move = 0; move < 2; move++) {
    const swap = legalActions(current).find(action => action.kind === 'swap'); assert.ok(swap, `move ${move + 1} remains playable`);
    const accepted = applyAction(current, swap); assert.equal(accepted.accepted, true);
    const resolved = advanceTicks(accepted.state, 240);
    current = resolved.state;
    if (move === 0) { assert.equal(current.blackHole.movesRemaining, 1); assert.ok(current.blackHole.capacityRemaining > 0); }
    else {
      assert.ok(resolved.events.some(event => event.type === 'black-hole-closed' && event.reason === 'duration'));
      assert.equal(current.blackHole, null); assert.ok(resolved.events.some(event => event.type === 'gem-refilled' && event.cell === 0));
    }
  }
});

test('duration closure cascades do not earn ordinary or rare stored tools', () => {
  const base = enabled(41); const board = [...checkerBoard(6, 6)];
  board[14] = null; board[8] = Object.freeze({ id: board[8].id, colour: 'red' });
  board[7] = Object.freeze({ id: board[7].id, colour: 'blue' }); board[9] = Object.freeze({ id: board[9].id, colour: 'blue' });
  board[10] = Object.freeze({ id: board[10].id, colour: 'gold' }); board[12] = Object.freeze({ id: board[12].id, colour: 'green' }); board[13] = Object.freeze({ id: board[13].id, colour: 'red' });
  board[15] = Object.freeze({ id: board[15].id, colour: 'red' }); board[16] = Object.freeze({ id: board[16].id, colour: 'blue' });
  let randomState = 1; while (drawColour(randomState, 5)[0] !== 'red') randomState++;
  const state = { ...base, board: Object.freeze(board), phase: 'refill', randomState, blackHoleCharges: 0,
    blackHole: Object.freeze({ cell: 14, capacityRemaining: 5, movesRemaining: 1, consumedIds: Object.freeze([board[14]?.id ?? 8014]) }),
    blackHoleMovePending: true, blackHoleContactPending: false, toolProgress: 11, blackHoleProgress: 47,
    inventory: Object.freeze({ bomb: 0, 'row-clear': 0, 'colour-clear': 0 }) };
  assert.deepEqual(findMatches(state.board, state.settings), []);
  const expiry = advanceTicks(state, 1);
  assert.ok(expiry.events.some(event => event.type === 'black-hole-closed' && event.reason === 'duration'));
  assert.equal(expiry.state.toolWaveActive, true);
  const settled = advanceTicks(expiry.state, 10);
  assert.equal(settled.state.phase, 'clear-mark'); assert.ok(settled.state.pendingCells.includes(2));
  const removed = advanceTicks(settled.state, 7).state;
  assert.equal(removed.toolProgress, 11); assert.equal(removed.blackHoleProgress, 47);
  assert.deepEqual(removed.inventory, { bomb: 0, 'row-clear': 0, 'colour-clear': 0 });
  assert.equal(removed.blackHoleCharges, 0);
});

test('black-hole contacts batch and sequence identically without consuming random state during UI actions', () => {
  const base = enabled(35); const initial = { ...base, board: checkerBoard(6, 6) };
  const beforeRandom = initial.randomState; const selected = applyAction(initial, { kind: 'select-tool', tool: 'black-hole' }).state;
  const preview = applyAction(selected, { kind: 'target-tool', cell: 14 }).state;
  assert.equal(preview.randomState, beforeRandom);
  const confirmed = applyAction(preview, { kind: 'confirm-tool' }).state;
  const batched = advanceTicks(confirmed, 240); let sequential = confirmed; const events = [];
  for (let tick = 0; tick < 240; tick++) { const step = advanceTicks(sequential, 1); sequential = step.state; events.push(...step.events); }
  assert.deepEqual(batched.state, sequential); assert.deepEqual(batched.events, events);
});
