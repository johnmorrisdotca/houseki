import { test } from 'vitest';
import assert from 'node:assert/strict';
import { createGame, applyAction, advanceTicks, legalActions, statusOf } from '../dist/gem-swap.js';

const makeBoard = (width, height, colourAt, kindAt = () => undefined) => Object.freeze(Array.from({ length: width * height }, (_, cell) => Object.freeze({ id: 5000 + cell, colour: colourAt(cell), ...(kindAt(cell) ? { kind: kindAt(cell) } : {}) })));
const activate = (state, tool, cell) => {
  const selected = applyAction(state, { kind: 'select-tool', tool }); assert.equal(selected.accepted, true);
  return applyAction(selected.state, { kind: 'target-tool', cell });
};

test('tools default off, initialize only when enabled, and leave ordinary setup deterministic', () => {
  const normal = createGame({ seed: 77 }); const disabled = createGame({ seed: 77, tools: false });
  assert.deepEqual(disabled, normal); assert.equal(normal.settings.tools, false);
  assert.deepEqual(normal.inventory, { bomb: 0, 'row-clear': 0, 'colour-clear': 0 });
  const enabled = createGame({ seed: 77, tools: true });
  assert.deepEqual(enabled.inventory, { bomb: 1, 'row-clear': 1, 'colour-clear': 1 });
  assert.equal(enabled.assisted, false); assert.equal(enabled.toolProgress, 0); assert.equal(enabled.toolAwardCursor, 0);
  assert.equal(applyAction(normal, { kind: 'select-tool', tool: 'bomb' }).reason, 'tools-disabled');
  assert.equal(applyAction(enabled, { kind: 'select-tool', tool: 'bomb', extra: 1 }).state, enabled);
});

test('bomb preview and confirmed edge effect agree, with unique scoring and one move', () => {
  const start = createGame({ width: 6, height: 6, tools: true, seed: 21 });
  const target = 0; const preview = activate(start, 'bomb', target);
  assert.equal(preview.accepted, true); assert.deepEqual(preview.state.toolPreview, [0, 1, 6, 7]);
  const confirm = applyAction(preview.state, { kind: 'confirm-tool' });
  assert.equal(confirm.accepted, true); assert.deepEqual(confirm.state.pendingCells, preview.state.toolPreview);
  assert.equal(confirm.state.moves, 1); assert.equal(confirm.state.score, 0); assert.equal(confirm.state.assisted, true);
  assert.equal(confirm.state.inventory.bomb, 0);
  const removed = advanceTicks(confirm.state, 7);
  assert.equal(removed.state.score, 40); assert.deepEqual(removed.state.board.slice(0, 2), [null, null]);
});

test('row clear crosses mask gaps; colour clear selects the target colour and skips inactive cells', () => {
  const width = 6; const mask = Array(36).fill(true); mask[2 * width + 2] = false;
  const base = createGame({ width, height: 6, mask, tools: true, seed: 4 });
  const rowBoard = [...makeBoard(width, 6, cell => (cell % width + Math.floor(cell / width)) % 2 ? 'blue' : 'red')]; rowBoard[14] = null;
  const rowState = { ...base, board: Object.freeze(rowBoard) };
  const row = activate(rowState, 'row-clear', 2 * width + 1);
  assert.deepEqual(row.state.toolPreview, [12, 13, 15, 16, 17]);
  const rowUse = applyAction(row.state, { kind: 'confirm-tool' });
  assert.deepEqual(rowUse.state.pendingCells, [12, 13, 15, 16, 17]);
  const colourBoard = [...makeBoard(width, 6, cell => (cell % width + Math.floor(cell / width)) % 2 ? 'blue' : 'red')]; colourBoard[14] = null;
  const colourState = { ...base, board: Object.freeze(colourBoard) };
  const colour = activate(colourState, 'colour-clear', 0);
  const expected = colourState.board.flatMap((gem, cell) => mask[cell] && gem.colour === 'red' ? [cell] : []);
  assert.deepEqual(colour.state.toolPreview, expected);
  assert.deepEqual(applyAction(colour.state, { kind: 'confirm-tool' }).state.pendingCells, expected);
});

test('specials hit by a tool expand once by stable identity and preview equals committed union', () => {
  const base = createGame({ width: 6, height: 6, tools: true, seed: 6 });
  const board = [...base.board];
  board[7] = Object.freeze({ ...board[7], kind: 'row-beam' });
  board[1] = Object.freeze({ ...board[1], kind: 'bomb' });
  const state = { ...base, board: Object.freeze(board) };
  const targeting = activate(state, 'bomb', 0);
  const committed = applyAction(targeting.state, { kind: 'confirm-tool' });
  assert.equal(committed.accepted, true); assert.deepEqual(committed.state.pendingCells, targeting.state.toolPreview);
  const activations = committed.events.filter(event => event.type === 'special-activated');
  assert.deepEqual(activations.map(event => event.id), [board[1].id, board[7].id]);
  assert.equal(new Set(activations.map(event => event.id)).size, 2);
  assert.deepEqual(committed.state.pendingSpecials, []);
});

test('cancel and invalid target/confirm preserve resources, score, RNG, moves and earning state', () => {
  const start = createGame({ width: 6, height: 6, tools: true, seed: 8 });
  const selected = applyAction(start, { kind: 'select-tool', tool: 'row-clear' });
  const before = selected.state;
  for (const action of [{ kind: 'target-tool', cell: -1 }, { kind: 'target-tool', cell: 999 }, { kind: 'confirm-tool' }, { kind: 'cancel-tool', extra: true }]) {
    const result = applyAction(before, action); assert.equal(result.accepted, false); assert.equal(result.state, before);
  }
  const cancelled = applyAction(before, { kind: 'cancel-tool' });
  assert.equal(cancelled.accepted, true); assert.equal(cancelled.state.selectedTool, null);
  for (const key of ['moves', 'score', 'randomState', 'inventory', 'toolProgress', 'toolAwardCursor', 'assisted']) assert.deepEqual(cancelled.state[key], start[key]);
  assert.equal(applyAction(start, { kind: 'target-tool', cell: 0 }).state, start);
});

test('ordinary special swaps earn tools, while tool-origin clears and cascades do not', () => {
  const width = 12; const height = 12; const base = createGame({ width, height, tools: true, seed: 2 });
  const checker = makeBoard(width, height, cell => (cell % width + Math.floor(cell / width)) % 2 ? 'blue' : 'red', cell => cell === 0 ? 'colour-burst' : undefined);
  const state = { ...base, board: checker, inventory: Object.freeze({ bomb: 3, 'row-clear': 1, 'colour-clear': 1 }) };
  const burst = applyAction(state, { kind: 'swap', from: 0, to: 1 });
  assert.equal(burst.accepted, true);
  assert.equal(burst.state.pendingCells.length, 73);
  const removed = advanceTicks(burst.state, 7).state;
  assert.equal(removed.toolProgress, 1); assert.equal(removed.toolAwardCursor, 0);
  assert.deepEqual(removed.inventory, { bomb: 3, 'row-clear': 3, 'colour-clear': 3 });

  const oneClear = { ...state, board: Object.freeze([...checker]), inventory: Object.freeze({ bomb: 3, 'row-clear': 1, 'colour-clear': 1 }), toolProgress: 0, toolAwardCursor: 0 };
  const tool = activate(oneClear, 'colour-clear', 0);
  const used = applyAction(tool.state, { kind: 'confirm-tool' });
  assert.equal(used.state.toolWaveActive, true);
  const toolRemoved = advanceTicks(used.state, 300).state;
  assert.equal(toolRemoved.toolProgress, 0); assert.equal(toolRemoved.toolAwardCursor, 0);
  assert.deepEqual(toolRemoved.inventory, { bomb: 3, 'row-clear': 1, 'colour-clear': 0 });
  assert.equal(toolRemoved.assisted, true);
});

test('ordinary color-burst clear earns in cycles and advances past full inventory slots', () => {
  const width = 12; const height = 12; const base = createGame({ width, height, tools: true, seed: 3 });
  const checker = makeBoard(width, height, cell => (cell % width + Math.floor(cell / width)) % 2 ? 'blue' : 'red', cell => cell === 0 ? 'colour-burst' : undefined);
  const state = { ...base, board: checker, inventory: Object.freeze({ bomb: 3, 'row-clear': 0, 'colour-clear': 0 }) };
  const result = applyAction(state, { kind: 'swap', from: 0, to: 1 }); assert.equal(result.accepted, true);
  const removed = advanceTicks(result.state, 7).state;
  assert.equal(removed.toolProgress, 1); assert.equal(removed.toolAwardCursor, 0);
  assert.deepEqual(removed.inventory, { bomb: 3, 'row-clear': 2, 'colour-clear': 2 });
  assert.ok(advanceTicks(result.state, 7).events.some(event => event.type === 'tool-awarded' && event.discarded));
});

test('tool selection rescues a board without swaps and status keeps ordinary moves separate', () => {
  const width = 6; const height = 6; const base = createGame({ width, height, tools: true, seed: 10 });
  const noMoveColours = ['blue','purple','purple','blue','gold','purple','gold','red','blue','green','purple','green','purple','purple','green','green','red','gold','green','gold','blue','red','gold','gold','red','green','red','purple','green','purple','blue','blue','gold','gold','green','red'];
  const board = makeBoard(width, height, cell => noMoveColours[cell]);
  const dead = { ...base, board, inventory: Object.freeze({ bomb: 1, 'row-clear': 0, 'colour-clear': 0 }) };
  assert.equal(legalActions(dead).filter(action => action.kind === 'swap').length, 0);
  assert.ok(legalActions(dead).some(action => action.kind === 'select-tool' && action.tool === 'bomb'));
  assert.equal(statusOf(dead).legalMoveCount, 0); assert.equal(statusOf(dead).availableToolCount, 1);
  assert.equal(applyAction(dead, { kind: 'select-tool', tool: 'bomb' }).accepted, true);

  const deadColours = ['blue','purple','purple','blue','gold','purple','gold','red','blue','green','purple','green','purple','purple','green','green','red','gold','green','gold','blue','red','gold','gold','red','green','red','purple','green','purple','blue','blue','gold','gold','green','red'];
  const terminalBase = createGame({ width, height, tools: true, seed: 2 });
  const terminal = { ...terminalBase, board: makeBoard(width, height, cell => deadColours[cell]), inventory: Object.freeze({ bomb: 0, 'row-clear': 1, 'colour-clear': 0 }) };
  assert.equal(statusOf(terminal).legalMoveCount, 0); assert.equal(statusOf(terminal).availableToolCount, 1);
  const last = applyAction(activate(terminal, 'row-clear', 0).state, { kind: 'confirm-tool' });
  assert.equal(last.accepted, true);
  const ended = advanceTicks(last.state, 400);
  assert.equal(ended.state.phase, 'finished'); assert.equal(ended.state.moves, 1);
  assert.equal(statusOf(ended.state).availableToolCount, 0); assert.equal(statusOf(ended.state).legalMoveCount, 0);
});

test('tool clears preserve exact batched and sequential tick behavior', () => {
  const start = createGame({ width: 6, height: 6, tools: true, seed: 35 });
  const confirmed = applyAction(activate(start, 'bomb', 14).state, { kind: 'confirm-tool' }).state;
  const batched = advanceTicks(confirmed, 128); let sequential = confirmed; const events = [];
  for (let tick = 0; tick < 128; tick++) { const result = advanceTicks(sequential, 1); sequential = result.state; events.push(...result.events); }
  assert.deepEqual(batched.state, sequential); assert.deepEqual(batched.events, events);
});

test('a confirmed use revalidates the target and consumes exactly one tool and move', () => {
  const start = createGame({ width: 6, height: 6, tools: true, seed: 12 });
  const target = activate(start, 'bomb', 7); const tampered = { ...target.state, inventory: Object.freeze({ bomb: 0, 'row-clear': 1, 'colour-clear': 1 }) };
  const failed = applyAction(tampered, { kind: 'confirm-tool' });
  assert.equal(failed.accepted, false); assert.equal(failed.state, tampered);
  const confirmed = applyAction(target.state, { kind: 'confirm-tool' });
  assert.equal(confirmed.state.moves, 1); assert.equal(confirmed.state.inventory.bomb, 0);
});
