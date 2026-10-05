import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, applyAction, advanceTicks, legalActions, statusOf, GemSwapOptionsError } from '../dist/gem-swap.js';
import { findMatches } from '../dist/gem-swap/board.js';
import { fallbackBoardForTest } from '../dist/gem-swap/engine.js';
import { planWave } from '../dist/gem-swap/specials.js';

const colours = ['red', 'blue', 'green', 'gold', 'purple', 'teal'];
const freezeBoard = cells => Object.freeze(cells.map((colour, id) => colour === null ? null : Object.freeze({ id: id + 1000, colour })));
function oracleMatches(board, settings) {
  const found = new Set(); const { width, height, mask } = settings;
  for (let index = 0; index < board.length; index++) {
    const gem = board[index]; if (!gem || !mask[index]) continue;
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      const x = index % width; const y = Math.floor(index / width);
      if (x > 0 && dx && board[index - 1]?.colour === gem.colour && mask[index - 1]) continue;
      if (y > 0 && dy && board[index - width]?.colour === gem.colour && mask[index - width]) continue;
      const cells = [index]; let nextX = x + dx; let nextY = y + dy;
      while (nextX < width && nextY < height && mask[nextY * width + nextX] && board[nextY * width + nextX]?.colour === gem.colour) {
        cells.push(nextY * width + nextX); nextX += dx; nextY += dy;
      }
      if (cells.length >= 3) for (const cell of cells) found.add(cell);
    }
  }
  return [...found].sort((a, b) => a - b);
}
function setup(width = 6, height = 6, mask = Array(width * height).fill(true), seed = 'fixture') {
  const game = createGame({ width, height, mask, seed });
  const coloursByCell = Array(width * height).fill(null);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (mask[y * width + x]) coloursByCell[y * width + x] = colours[(x + 2 * y) % 5];
  return { ...game, board: freezeBoard(coloursByCell), nextId: 2000, phase: 'ready', pendingCells: Object.freeze([]), gravityBoard: null };
}
function ordinarySwapFixture(seed = 'fixture') {
  const state = setup(6, 6, Array(36).fill(true), seed); const board = [...state.board];
  board[2 * 6 + 1] = Object.freeze({ id: 9, colour: 'blue' });
  board[2 * 6 + 2] = Object.freeze({ id: 10, colour: 'red' });
  board[2 * 6 + 3] = Object.freeze({ id: 16, colour: 'green' });
  board[2 * 6 + 4] = Object.freeze({ id: 22, colour: 'red' });
  return { ...state, board: Object.freeze(board) };
}
function specialSwapFixture(kindP, kindQ, from = 14, to = 15) {
  for (let seed = 0; seed < 1000; seed++) {
    const base = createGame({ seed }); const moved = [...base.board]; [moved[from], moved[to]] = [moved[to], moved[from]];
    if (findMatches(moved, base.settings).length) continue;
    const decorated = [...base.board];
    if (kindP) decorated[from] = Object.freeze({ ...decorated[from], kind: kindP });
    if (kindQ) decorated[to] = Object.freeze({ ...decorated[to], kind: kindQ });
    return { state: { ...base, board: Object.freeze(decorated) }, action: { kind: 'swap', from, to } };
  }
  throw new Error('Could not find a stable no-match swap fixture');
}
function comboOracle(after, action) {
  const { width, height, mask } = after.settings; const p = action.from; const q = action.to;
  const a = after.board[p]; const b = after.board[q]; const ak = a.kind; const bk = b.kind;
  const cells = new Set([p, q]); const active = after.board.flatMap((gem, i) => mask[i] && gem ? [i] : []);
  const addRow = y => active.filter(i => Math.floor(i / width) === y).forEach(i => cells.add(i));
  const addColumn = x => active.filter(i => i % width === x).forEach(i => cells.add(i));
  const addBomb = centre => active.filter(i => Math.abs(i % width - centre % width) <= 1 && Math.abs(Math.floor(i / width) - Math.floor(centre / width)) <= 1).forEach(i => cells.add(i));
  const burst = ak === 'colour-burst' ? a : bk === 'colour-burst' ? b : null;
  if (ak === 'colour-burst' && bk === 'colour-burst') active.forEach(i => cells.add(i));
  else if (burst && (ak && bk)) {
    const power = ak === 'colour-burst' ? bk : ak; const beam = power === 'row-beam' || power === 'column-beam';
    const targetColour = ak === 'colour-burst' ? b.colour : a.colour;
    for (const i of active) if (i !== p && i !== q && after.board[i].colour === targetColour) {
      cells.add(i);
      if (power === 'bomb') addBomb(i);
      if (power === 'row-beam') addRow(Math.floor(i / width));
      if (power === 'column-beam') addColumn(i % width);
    }
    assert.ok(beam || power === 'bomb');
  } else if (burst) {
    const target = ak === 'colour-burst' ? b : a;
    for (const i of active) if (after.board[i].colour === target.colour) cells.add(i);
  } else if (ak === 'bomb' && bk === 'bomb') {
    active.filter(i => Math.abs(i % width - q % width) <= 2 && Math.abs(Math.floor(i / width) - Math.floor(q / width)) <= 2).forEach(i => cells.add(i));
  } else if ((ak === 'row-beam' || ak === 'column-beam') && (bk === 'row-beam' || bk === 'column-beam')) {
    addRow(Math.floor(q / width)); addColumn(q % width);
  } else {
    const isBeamBomb = (ak === 'bomb' && (bk === 'row-beam' || bk === 'column-beam')) || (bk === 'bomb' && (ak === 'row-beam' || ak === 'column-beam'));
    if (isBeamBomb) {
      const x = q % width; const y = Math.floor(q / width);
      for (let row = Math.max(0, y - 1); row <= Math.min(height - 1, y + 1); row++) addRow(row);
      for (let column = Math.max(0, x - 1); column <= Math.min(width - 1, x + 1); column++) addColumn(column);
    }
  }
  return [...cells].sort((x, y) => x - y);
}

test('default and compact presets are deterministic, stable and have a witnessed legal swap', () => {
  for (const options of [{}, { preset: 'compact' }, { preset: 'wide' }, { preset: 'tall' }]) {
    const a = createGame({ ...options, seed: 'repeatable' }); const b = createGame({ ...options, seed: 'repeatable' });
    assert.deepEqual(a, b); assert.equal(a.board.length, a.settings.width * a.settings.height);
    assert.equal(findMatches(a.board, a.settings).length, 0); assert.ok(legalActions(a).length > 0);
    const ids = a.board.filter(Boolean).map(gem => gem.id); assert.equal(new Set(ids).size, ids.length);
  }
  const standard = createGame(); assert.equal(standard.settings.width, 8); assert.equal(standard.settings.height, 8); assert.equal(standard.settings.colourCount, 5);
  for (const shape of ['heart', 'star', 'hexagon']) {
    const masked = createGame({ shape, seed: 3 });
    assert.ok(masked.settings.mask.some(value => !value)); assert.equal(findMatches(masked.board, masked.settings).length, 0);
    assert.ok(legalActions(masked).length > 0); assert.equal(masked.usedFallback, false);
  }
});

test('swap acceptance, 30-point first wave, visible holes, gravity and refill phases', () => {
  const before = ordinarySwapFixture(); const action = { kind: 'swap', from: 9, to: 15 };
  assert.ok(legalActions(before).some(item => item.from === action.from && item.to === action.to));
  const accepted = applyAction(before, action); assert.equal(accepted.accepted, true);
  assert.equal(accepted.state.phase, 'clear-mark'); assert.equal(accepted.state.moves, 1); assert.equal(accepted.state.score, 0);
  assert.deepEqual(accepted.state.pendingCells, [14, 15, 16]);
  const marked = accepted.state;
  const marking = advanceTicks(marked, 6).state;
  assert.equal(marking.phase, 'clear-mark'); assert.equal(marking.resolutionTick, 6); assert.ok(marking.board[14]); assert.equal(marking.score, 0);
  const removed = advanceTicks(marking, 1).state;
  assert.equal(removed.phase, 'clear-remove'); assert.deepEqual([14, 15, 16].map(i => removed.board[i]), [null, null, null]); assert.equal(removed.score, 30);
  const removal = advanceTicks(removed, 5).state;
  assert.equal(removal.phase, 'clear-remove'); assert.equal(removal.resolutionTick, 5);
  const falling = advanceTicks(removal, 1).state;
  assert.equal(falling.phase, 'gravity'); assert.ok(falling.gravityBoard);
  assert.deepEqual([14, 15, 16].map(i => falling.board[i]), [null, null, null]);
  const dropping = advanceTicks(falling, 8).state;
  assert.equal(dropping.phase, 'gravity'); assert.equal(dropping.resolutionTick, 8);
  const settled = advanceTicks(dropping, 1).state; assert.equal(settled.phase, 'refill');
  assert.equal(settled.board.filter(Boolean).length, 33);
  const refilled = advanceTicks(settled, 1); assert.ok(refilled.events.some(event => event.type === 'gem-refilled'));
  assert.equal(refilled.state.board.filter(Boolean).length, 36);
  assert.ok(['ready', 'clear-mark', 'finished'].includes(refilled.state.phase));
});

test('invalid and identical-colour swaps preserve the exact state and random stream', () => {
  const state = ordinarySwapFixture();
  for (const action of [{ kind: 'swap', from: 0, to: 35 }, { kind: 'swap', from: 0, to: 1 }, { kind: 'swap', from: 0, to: 0 }, { kind: 'swap', from: -1, to: 0 }]) {
    const result = applyAction(state, action); assert.equal(result.accepted, false); assert.equal(result.state, state); assert.equal(result.state.randomState, state.randomState); assert.equal(result.state.moves, state.moves);
  }
  const during = applyAction(state, { kind: 'swap', from: 9, to: 15 }).state;
  const rejectedDuringResolution = applyAction(during, { kind: 'swap', from: 0, to: 1 });
  assert.equal(rejectedDuringResolution.accepted, false); assert.equal(rejectedDuringResolution.state, during);
  const identicalBoard = [...state.board]; identicalBoard[1] = Object.freeze({ id: 3000, colour: identicalBoard[0].colour });
  const identicalState = { ...state, board: Object.freeze(identicalBoard) };
  assert.equal(applyAction(identicalState, { kind: 'swap', from: 0, to: 1 }).reason, 'identical-gems');
  assert.equal(applyAction(state, { kind: 'swap', from: 0, to: 1, extra: true }).state, state);
});

test('all matches in intersecting rows and columns form one unique union', () => {
  const base = setup(); const board = [...base.board];
  for (const index of [2 * 6 + 1, 2 * 6 + 2, 2 * 6 + 3, 2 * 6 + 4, 1 * 6 + 2, 3 * 6 + 2, 4 * 6 + 2]) board[index] = Object.freeze({ id: index + 1, colour: 'red' });
  const expected = [8, 13, 14, 15, 16, 20, 26];
  assert.deepEqual(findMatches(board, base.settings), expected);
  assert.equal(new Set(findMatches(board, base.settings)).size, 7);
});

test('masked gravity keeps independent vertical segments and refill order is deterministic', () => {
  const width = 6; const height = 6; const mask = Array(width * height).fill(true);
  mask[2 * width + 2] = false;
  let state = setup(width, height, mask);
  const board = [...state.board]; board[1 * width + 2] = null; board[4 * width + 2] = null;
  state = { ...state, phase: 'clear-remove', board: Object.freeze(board), pendingCells: Object.freeze([8, 26]), score: 0, wave: 1 };
  const gravity = advanceTicks(state, 6).state;
  assert.equal(gravity.phase, 'gravity');
  assert.equal(gravity.gravityBoard[1 * width + 2].id, state.board[0 * width + 2].id);
  assert.equal(gravity.gravityBoard[4 * width + 2].id, state.board[3 * width + 2].id);
  const refillPhase = advanceTicks(gravity, 9).state;
  const filled = advanceTicks(refillPhase, 1);
  const draws = filled.events.filter(event => event.type === 'gem-refilled');
  const orderKey = index => {
    const x = index % width; const y = Math.floor(index / width); let start = y;
    while (start > 0 && mask[(start - 1) * width + x]) start--;
    return [x, start, -y];
  };
  assert.deepEqual(draws.map(event => event.cell), [...draws.map(event => event.cell)].sort((a, b) => {
    const ka = orderKey(a); const kb = orderKey(b);
    return ka[0] - kb[0] || ka[1] - kb[1] || ka[2] - kb[2];
  }));
  assert.equal(new Set(filled.state.board.filter(Boolean).map(gem => gem.id)).size, filled.state.board.filter(Boolean).length);
});

test('500 seeded starts satisfy an independent matcher and legal-action oracle', () => {
  for (let seed = 0; seed < 500; seed++) {
    const state = createGame({ seed }); const independentMatches = [];
    const { width, height, mask } = state.settings;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const index = y * width + x; if (!mask[index] || !state.board[index]) continue;
      for (const [dx, dy] of [[1, 0], [0, 1]]) {
        let end = 1;
        while (x + dx * end < width && y + dy * end < height && mask[(y + dy * end) * width + x + dx * end] && state.board[(y + dy * end) * width + x + dx * end]?.colour === state.board[index].colour) end++;
        if (end >= 3) independentMatches.push(index);
      }
    }
    assert.deepEqual(independentMatches, []);
    const oracle = [];
    for (let from = 0; from < state.board.length; from++) for (const to of [from % width + 1 < width ? from + 1 : -1, Math.floor(from / width) + 1 < height ? from + width : -1]) {
      if (to < 0 || !state.board[from] || !state.board[to] || !mask[to]) continue;
      const changed = [...state.board]; [changed[from], changed[to]] = [changed[to], changed[from]];
      const match = changed.some((gem, i) => {
        if (!gem) return false; const x = i % width; const y = Math.floor(i / width);
        return [[1, 0], [0, 1]].some(([dx, dy]) => {
          let length = 1;
          for (let sign of [-1, 1]) for (let step = 1; step < 3; step++) {
            const nx = x + dx * step * sign; const ny = y + dy * step * sign;
            if (nx < 0 || nx >= width || ny < 0 || ny >= height || !mask[ny * width + nx] || changed[ny * width + nx]?.colour !== gem.colour) break;
            length++;
          }
          return length >= 3;
        });
      });
      if (match) oracle.push({ kind: 'swap', from, to });
    }
    assert.deepEqual(legalActions(state).filter(action => action.kind === 'swap'), oracle, `seed ${seed}`);
    assert.equal(statusOf(state).legalMoveCount, oracle.length);
  }
});

test('public settings reject malformed sizes, masks and unsupported fallback shapes', () => {
  assert.throws(() => createGame({ width: 3, height: 8 }), GemSwapOptionsError);
  assert.throws(() => createGame({ width: Number.MAX_SAFE_INTEGER, height: 8 }), GemSwapOptionsError);
  assert.throws(() => createGame({ seed: -1 }), GemSwapOptionsError);
  assert.throws(() => createGame({ seed: 's'.repeat(257) }), GemSwapOptionsError);
  assert.throws(() => createGame({ unknown: true }), GemSwapOptionsError);
  assert.throws(() => createGame({ width: 4, height: 4, mask: Array(16).fill(false) }), GemSwapOptionsError);
});

test('standard fallback has a checked stable board and a pinned legal swap witness', () => {
  const generated = createGame({ seed: 'fallback-fixture' }); const board = fallbackBoardForTest(generated.settings);
  assert.deepEqual(oracleMatches(board, generated.settings), []);
  const state = { ...generated, board, nextId: 65 };
  const action = { kind: 'swap', from: 27, to: 35 };
  assert.deepEqual(legalActions(state).find(move => move.from === 27 && move.to === 35), action);
  const independent = [...board]; [independent[27], independent[35]] = [independent[35], independent[27]];
  assert.deepEqual(oracleMatches(independent, generated.settings), [34, 35, 36]);
  const applied = applyAction(state, action);
  assert.equal(applied.accepted, true); assert.deepEqual(applied.state.pendingCells, [34, 35, 36]);
});

test('phase durations and one large advance equal sequential ticks, including events', () => {
  const start = applyAction(ordinarySwapFixture(), { kind: 'swap', from: 9, to: 15 }).state;
  const batched = advanceTicks(start, 23);
  let sequential = start; const events = [];
  for (let i = 0; i < 23; i++) { const result = advanceTicks(sequential, 1); sequential = result.state; events.push(...result.events); }
  assert.deepEqual(batched.state, sequential); assert.deepEqual(batched.events, events);
});

test('legal actions exclude identical swaps and malformed ready boards', () => {
  const state = ordinarySwapFixture(); const board = [...state.board];
  board[1] = Object.freeze({ id: 3001, colour: board[0].colour });
  const invalid = { ...state, board: Object.freeze([...board]) };
  const unstableBoard = [...board]; unstableBoard[2] = Object.freeze({ id: 3002, colour: 'red' });
  const unstable = { ...state, board: Object.freeze(unstableBoard) };
  assert.ok(legalActions(invalid).every(move => move.from !== 0 || move.to !== 1));
  assert.equal(legalActions(unstable).length, 0);
  assert.equal(applyAction(unstable, { kind: 'swap', from: 0, to: 1 }).reason, 'unstable-board');
});

test('all explicit special combinations resolve exact unique sets in both orders and around q', () => {
  const cases = [
    ['row-beam', 'column-beam'], ['row-beam', 'bomb'], ['bomb', 'bomb'],
    ['colour-burst', null], ['colour-burst', 'row-beam'], ['colour-burst', 'column-beam'],
    ['colour-burst', 'bomb'], ['colour-burst', 'colour-burst'],
  ];
  for (const [firstKind, secondKind] of cases) for (const swapKinds of [false, true]) for (const reverse of [false, true]) {
    const from = reverse ? 15 : 14; const to = reverse ? 14 : 15;
    const first = swapKinds ? secondKind : firstKind; const second = swapKinds ? firstKind : secondKind;
    const { state, action } = specialSwapFixture(first, second, from, to);
    assert.ok(legalActions(state).some(move => move.from === Math.min(from, to) && move.to === Math.max(from, to)), `${firstKind}+${secondKind} was absent from legalActions`);
    const result = applyAction(state, action); assert.equal(result.accepted, true, `${firstKind}+${secondKind}, reverse=${reverse}`);
    assert.deepEqual(result.state.pendingCells, comboOracle(result.state, action), `${firstKind}+${secondKind}, reverse=${reverse}`);
    assert.ok(result.events.some(event => event.type === 'special-combination' && event.centre === to));
    const pairIds = new Set([state.board[from].id, state.board[to].id]);
    assert.ok(result.events.filter(event => event.type === 'special-activated').every(event => !pairIds.has(event.id)));
    const removed = advanceTicks(result.state, 7).state;
    assert.equal(removed.score, result.state.pendingCells.length * 10);
    assert.ok(result.state.pendingCells.every(cell => removed.board[cell] === null));
  }
});

test('bomb pair clips at the edge, and blast geometry skips masked cells', () => {
  const corner = specialSwapFixture('bomb', 'bomb', 1, 0);
  const edge = applyAction(corner.state, corner.action);
  assert.equal(edge.accepted, true); assert.equal(edge.state.pendingCells.length, 9);
  const middle = specialSwapFixture('bomb', 'bomb', 26, 27);
  assert.equal(applyAction(middle.state, middle.action).state.pendingCells.length, 25);
  const { width, height, mask } = createGame({ shape: 'heart', seed: 14 }).settings;
  let candidate = null;
  for (let seed = 0; seed < 100 && !candidate; seed++) {
    const base = createGame({ shape: 'heart', seed });
    for (let from = 0; from < base.board.length && !candidate; from++) if (base.board[from]) {
      for (const to of [from + 1, from + base.settings.width]) {
        if (!base.settings.mask[to] || !base.board[to]) continue;
        const changed = [...base.board]; [changed[from], changed[to]] = [changed[to], changed[from]];
        const centre = to; const cx = centre % base.settings.width; const cy = Math.floor(centre / base.settings.width);
        if (findMatches(changed, base.settings).length || !base.settings.mask.some((active, i) => !active && Math.abs(i % base.settings.width - cx) <= 1 && Math.abs(Math.floor(i / base.settings.width) - cy) <= 1)) continue;
        const board = [...base.board]; board[from] = Object.freeze({ ...board[from], kind: 'bomb' }); board[to] = Object.freeze({ ...board[to], kind: 'bomb' });
        candidate = { state: { ...base, board: Object.freeze(board) }, action: { kind: 'swap', from, to } }; break;
      }
    }
  }
  assert.ok(candidate, `found a clipped mask fixture within ${width}×${height}`);
  const blast = applyAction(candidate.state, candidate.action); assert.equal(blast.accepted, true);
  assert.deepEqual(blast.state.pendingCells, comboOracle(blast.state, candidate.action));
  assert.ok(blast.state.pendingCells.every(cell => mask[cell]));
});

test('natural four-run creates a protected anchor with q precedence and exact removal score', () => {
  const base = setup(); const board = [...base.board];
  const set = (index, colour, kind) => { board[index] = Object.freeze({ id: board[index].id, colour, ...(kind ? { kind } : {}) }); };
  set(14, 'green'); set(15, 'red'); set(16, 'red'); set(8, 'red');
  const state = { ...base, board: Object.freeze(board) }; const action = { kind: 'swap', from: 8, to: 14 };
  const accepted = applyAction(state, action); assert.equal(accepted.accepted, true);
  assert.deepEqual(accepted.state.pendingSpecials, [{ cell: 14, kind: 'row-beam' }]);
  assert.deepEqual(accepted.state.pendingCells, [13, 15, 16]);
  const anchorId = accepted.state.board[14].id;
  const removed = advanceTicks(accepted.state, 7);
  assert.equal(removed.state.score, 30); assert.equal(removed.state.board[14].id, anchorId); assert.equal(removed.state.board[14].kind, 'row-beam');
  assert.ok(removed.events.some(event => event.type === 'special-created' && event.cell === 14 && event.id === anchorId));
});

test('standard beam combo scores the 15-cell row/column union for 150 points', () => {
  const fixture = specialSwapFixture('row-beam', 'column-beam', 26, 27);
  const result = applyAction(fixture.state, fixture.action);
  assert.equal(result.accepted, true); assert.equal(result.state.pendingCells.length, 15);
  assert.equal(advanceTicks(result.state, 7).state.score, 150);
});

test('match components prioritize five-runs, T intersections and stable anchor ties', () => {
  const base = setup(); const make = cells => {
    const board = [...base.board]; for (const cell of cells) board[cell] = Object.freeze({ id: board[cell].id, colour: 'red' });
    return { ...base, board: Object.freeze(board) };
  };
  const tCells = [13, 14, 15, 8, 20]; const t = make(tCells);
  const tPlan = planWave(t, findMatches(t.board, t.settings), 13, 14);
  assert.deepEqual(tPlan.specials, [{ cell: 14, kind: 'bomb' }]);
  const fiveCross = make([12, 13, 14, 15, 16, 8, 20]);
  const burst = planWave(fiveCross, findMatches(fiveCross.board, fiveCross.settings), 12, 15);
  assert.deepEqual(burst.specials, [{ cell: 15, kind: 'colour-burst' }]);
  const tiedLongRuns = make([12, 13, 14, 15, 16, 2, 8, 20, 26]);
  const selectedRun = planWave(tiedLongRuns, findMatches(tiedLongRuns.board, tiedLongRuns.settings), null, 12);
  assert.deepEqual(selectedRun.specials, [{ cell: 12, kind: 'colour-burst' }]);
  const fiveTie = make([12, 13, 14, 15, 16]);
  const geometric = planWave(fiveTie, findMatches(fiveTie.board, fiveTie.settings), null, null);
  assert.deepEqual(geometric.specials, [{ cell: 12, kind: 'colour-burst' }]);
  const preferredSource = planWave(fiveTie, findMatches(fiveTie.board, fiveTie.settings), 15, 17);
  assert.deepEqual(preferredSource.specials, [{ cell: 15, kind: 'colour-burst' }]);
  const ineligible = make([13, 14, 15, 8, 20]); const marked = [...ineligible.board];
  marked[14] = Object.freeze({ ...marked[14], kind: 'bomb' });
  const noAnchor = planWave({ ...ineligible, board: Object.freeze(marked) }, findMatches(marked, ineligible.settings), 13, 14);
  assert.deepEqual(noAnchor.specials, []);
  const fiveMarked = [...fiveTie.board]; fiveMarked[14] = Object.freeze({ ...fiveMarked[14], kind: 'bomb' });
  const fallbackAnchor = planWave({ ...fiveTie, board: Object.freeze(fiveMarked) }, findMatches(fiveMarked, fiveTie.settings), 13, 14);
  assert.deepEqual(fallbackAnchor.specials, [{ cell: 13, kind: 'colour-burst' }]);
  const vertical = make([8, 14, 20, 26]);
  assert.deepEqual(planWave(vertical, findMatches(vertical.board, vertical.settings), null, null).specials, [{ cell: 26, kind: 'column-beam' }]);
  const twoComponents = make([7, 8, 9, 10, 25, 26, 27, 28]);
  assert.deepEqual(planWave(twoComponents, findMatches(twoComponents.board, twoComponents.settings), null, null).specials, [
    { cell: 7, kind: 'row-beam' }, { cell: 25, kind: 'row-beam' },
  ]);
});

test('matched specials expand once to a fixed point and protected fresh anchors survive overlap', () => {
  const base = setup(); const board = [...base.board];
  const set = (index, colour, kind) => { board[index] = Object.freeze({ id: board[index].id, colour, ...(kind ? { kind } : {}) }); };
  set(13, 'red', 'row-beam'); set(12, board[12].colour, 'bomb'); set(7, board[7].colour, 'column-beam');
  set(14, 'green'); set(15, 'red'); set(16, 'red'); set(8, 'red');
  const state = { ...base, board: Object.freeze(board) }; const result = applyAction(state, { kind: 'swap', from: 8, to: 14 });
  assert.equal(result.accepted, true);
  const activations = result.events.filter(event => event.type === 'special-activated');
  assert.deepEqual(activations.map(event => event.cell), [7, 12, 13]);
  assert.equal(new Set(activations.map(event => event.id)).size, 3);
  assert.deepEqual(result.state.pendingSpecials, [{ cell: 14, kind: 'row-beam' }]);
  assert.ok(!result.state.pendingCells.includes(14));
  const materialized = advanceTicks(result.state, 7).state;
  assert.equal(materialized.board[14].kind, 'row-beam');
});

test('a line special swapped into an ordinary match activates through the natural run', () => {
  const state = ordinarySwapFixture(); const board = [...state.board];
  board[9] = Object.freeze({ ...board[9], kind: 'row-beam' });
  const ready = { ...state, board: Object.freeze(board) }; const action = { kind: 'swap', from: 9, to: 15 };
  assert.ok(legalActions(ready).some(move => move.from === action.from && move.to === action.to));
  const result = applyAction(ready, action); assert.equal(result.accepted, true);
  assert.deepEqual(result.state.pendingCells, [12, 13, 14, 15, 16, 17]);
  assert.equal(result.events.filter(event => event.type === 'special-activated' && event.id === board[9].id).length, 1);
});

test('a natural colour-burst activation clears its stored colour and scores the unique union', () => {
  const state = ordinarySwapFixture(); const board = [...state.board];
  board[14] = Object.freeze({ ...board[14], kind: 'colour-burst', colour: 'red' });
  const burstState = { ...state, board: Object.freeze(board) };
  const result = applyAction(burstState, { kind: 'swap', from: 9, to: 15 });
  assert.equal(result.accepted, true);
  assert.ok(result.state.pendingCells.includes(0));
  const expected = result.state.board.flatMap((gem, index) => gem?.colour === 'red' ? [index] : []).sort((a, b) => a - b);
  assert.deepEqual(result.state.pendingCells, expected);
  assert.equal(advanceTicks(result.state, 7).state.score, expected.length * 10);
});

test('burst conversions replace an existing same-colour special power', () => {
  const fixture = specialSwapFixture('colour-burst', 'row-beam'); const before = fixture.state; const action = fixture.action;
  const afterSwap = [...before.board]; [afterSwap[action.from], afterSwap[action.to]] = [afterSwap[action.to], afterSwap[action.from]];
  const beam = afterSwap[action.from].kind === 'row-beam' ? afterSwap[action.from] : afterSwap[action.to];
  const index = afterSwap.findIndex((gem, cell) => cell !== action.from && cell !== action.to && gem.colour === beam.colour);
  assert.ok(index >= 0); afterSwap[index] = Object.freeze({ ...afterSwap[index], kind: 'bomb' });
  const state = { ...before, board: Object.freeze([...before.board]) };
  const decorated = [...state.board]; decorated[index] = Object.freeze({ ...decorated[index], kind: 'bomb' });
  const result = applyAction({ ...state, board: Object.freeze(decorated) }, action);
  assert.equal(result.accepted, true);
  const convertedId = decorated[index].id;
  const activation = result.events.find(event => event.type === 'special-activated' && event.id === convertedId);
  assert.equal(activation.kind, 'row-beam'); assert.ok(!result.events.some(event => event.type === 'special-activated' && event.id === convertedId && event.kind === 'bomb'));
  const swappedBoard = [...decorated]; [swappedBoard[action.from], swappedBoard[action.to]] = [swappedBoard[action.to], swappedBoard[action.from]];
  const overlapping = planWave({ ...state, board: Object.freeze(swappedBoard) }, [index], action.from, action.to);
  const overlapActivation = overlapping.events.find(event => event.type === 'special-activated' && event.id === convertedId);
  assert.equal(overlapActivation.kind, 'row-beam');
});

test('special clears refill with ordinary gems and score the next natural wave at multiplier two', () => {
  const state = ordinarySwapFixture(1); const board = [...state.board];
  board[14] = Object.freeze({ ...board[14], kind: 'colour-burst', colour: 'red' });
  const result = applyAction({ ...state, board: Object.freeze(board) }, { kind: 'swap', from: 9, to: 15 });
  assert.equal(result.accepted, true); assert.ok(result.state.pendingCells.length > 3);
  const resolved = advanceTicks(result.state, 23);
  assert.equal(resolved.state.phase, 'clear-mark'); assert.equal(resolved.state.wave, 2);
  const refilledIds = resolved.events.filter(event => event.type === 'gem-refilled').map(event => event.id);
  assert.ok(refilledIds.length > 0);
  for (const id of refilledIds) assert.equal(resolved.state.board.find(gem => gem?.id === id).kind, undefined);
  const firstScore = result.state.pendingCells.length * 10;
  assert.equal(resolved.state.score, firstScore);
  const secondClear = advanceTicks(resolved.state, 7).state;
  assert.equal(secondClear.score, firstScore + resolved.state.pendingCells.length * 20);
});
