import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createGame, createChallenge, restartGame, applyAction, advanceTicks, decodeGame, encodeGame, findMatches, landingY, legalActions, createInputScheduler, setHeldAction, queueInputEdge, actionsForTick, releaseAllActions, nextUint32 } from '../dist/falling-triplets.js';

const fixtureDoc = JSON.parse(await readFile(new URL('../docs/design/reference/rules-fixtures.json', import.meta.url), 'utf8'));
const tripletFixtures = fixtureDoc.cases.filter(item => item.id.startsWith('triplets-'));
const code = { R: 'red', B: 'blue', G: 'green', Y: 'gold', P: 'purple', T: 'teal', '.': null };
function fixtureBoard(rows) { return rows.flatMap(row => [...row].map(char => char === '.' ? null : { id: row.length * 0 + 1, colour: code[char] })); }

// This checker enumerates every same-colour run from each starting cell independently of the engine.
function oracleMatches(board, width, height) {
  const marked = new Set();
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const colour = board[y * width + x]?.colour; if (!colour) continue;
    for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
      const line = []; let nx = x, ny = y;
      while (nx >= 0 && nx < width && ny >= 0 && ny < height && board[ny * width + nx]?.colour === colour) { line.push(ny * width + nx); nx += dx; ny += dy; }
      if (line.length >= 3) line.forEach(index => marked.add(index));
    }
  }
  return [...marked].sort((a, b) => a - b);
}
function oracleSettle(board, width, height) {
  const out = Array(width * height).fill(null);
  for (let x = 0; x < width; x++) {
    const gems = []; for (let y = 0; y < height; y++) if (board[y * width + x]) gems.push(board[y * width + x]);
    for (let i = 0; i < gems.length; i++) out[(height - gems.length + i) * width + x] = gems[i];
  }
  return out;
}

test('independent fixture checker verifies crossing union and every cascade wave', () => {
  for (const fixture of tripletFixtures.filter(item => item.kernel === 'line-match')) {
    const board = fixtureBoard(fixture.board); const expected = fixture.expectedCleared.map(([x, y]) => y * fixture.board[0].length + x).sort((a, b) => a - b);
    assert.deepEqual(oracleMatches(board, fixture.board[0].length, fixture.board.length), expected, fixture.id);
    assert.deepEqual(findMatches(board, fixture.board[0].length, fixture.board.length).flatMap(wave => wave.cells).sort((a, b) => a - b), expected, `engine ${fixture.id}`);
  }
  const fixture = tripletFixtures.find(item => item.id === 'triplets-cascade');
  let board = fixtureBoard(fixture.board); let score = 0; const waves = [];
  for (;;) {
    const cells = oracleMatches(board, fixture.board[0].length, fixture.board.length); if (!cells.length) break;
    const chain = waves.length + 1; const points = 10 * cells.length * fixture.pieceLevel * chain; score += points; waves.push({ cells, points });
    board = oracleSettle(board.map((gem, index) => cells.includes(index) ? null : gem), fixture.board[0].length, fixture.board.length);
  }
  assert.deepEqual(waves.map(wave => ({ cleared: wave.cells.map(cell => [cell % 6, Math.floor(cell / 6)]), points: wave.points })), fixture.expectedWaves);
  assert.deepEqual(board.map((gem, index) => gem ? fixture.board[Math.floor(index / 6)][index % 6] : '.'), fixture.expectedBoard.flatMap(row => [...row]));
  assert.equal(score, fixture.expectedScore);
});

test('cycling works both ways while grounded and restart is deterministic', () => {
  const game = createGame({ seed: 'cycle-check' }); const before = game.active.gems.map(gem => gem.colour);
  const forward = applyAction(game, { kind: 'cycle-forward' }); assert.deepEqual(forward.state.active.gems.map(gem => gem.colour), [before[2], before[0], before[1]]);
  const backward = applyAction(forward.state, { kind: 'cycle-backward' }); assert.deepEqual(backward.state.active.gems.map(gem => gem.colour), before);
  let current = game; for (let i = 0; i < 3; i++) current = applyAction(current, { kind: 'cycle-forward' }).state;
  assert.deepEqual(current.active.gems.map(gem => gem.colour), before);
  const a = createGame({ seed: 'restart-check' }); const b = createGame({ seed: 'restart-check' }); assert.deepEqual(a, b);
});

test('relaxed play moves, projects the rigid landing triplet, drops, and resolves immutable state', () => {
  const initial = createGame({ seed: 'play-check' }); const left = applyAction(initial, { kind: 'left' });
  assert.equal(left.accepted, true); assert.equal(left.state.active.x, initial.active.x - 1); assert.equal(initial.active.x, Math.floor((initial.settings.width - 1) / 2));
  assert.equal(landingY(left.state), 10); const placed = applyAction(left.state, { kind: 'place' });
  assert.equal(placed.accepted, true); assert.equal(placed.state.completedPieces, 1); assert.equal(placed.state.active !== null, true);
  assert.equal(placed.state.board.filter(Boolean).length, 3); assert.equal(placed.state.phase, 'falling');
  assert.equal(applyAction(initial, { kind: 'hard-drop' }).accepted, false);
});

test('arcade gravity, hard drop, pause, and checkpoint round trip preserve deterministic rules state', () => {
  const state = createGame({ mode: 'arcade', seed: 'arcade-check' }); const fallen = advanceTicks(state, 60).state;
  assert.equal(fallen.active.y, state.active.y + 1); const paused = applyAction(fallen, { kind: 'pause' }).state;
  assert.equal(paused.phase, 'paused'); const resumed = applyAction(paused, { kind: 'resume' }).state;
  const dropped = applyAction(resumed, { kind: 'hard-drop' }).state; assert.equal(dropped.completedPieces, 1);
  assert.deepEqual(decodeGame(encodeGame(dropped)), dropped);
});

test('public board bounds reject invalid dimensions before seed consumption', () => {
  assert.throws(() => createGame({ width: 4, height: 13, seed: 'bounds' }), /5–12 columns/);
  assert.throws(() => createGame({ width: 6, height: 11, seed: 'bounds' }), /12–20 visible rows/);
  assert.throws(() => createGame({ width: 10, height: 25, seed: 'bounds' }), /12–20 visible rows/);
  assert.equal(createGame({ width: 5, height: 12, seed: 'bounds' }).settings.width, 5);
  assert.equal(createGame({ width: 12, height: 20, seed: 'bounds' }).settings.height, 20);
});

function supportedArcade(overrides = {}) {
  const base = createGame({ mode: 'arcade', width: 6, seed: 'grounding' }); const board = [...base.board]; board[(0 + 3) * 6 + base.active.x] = { id: 999, colour: 'teal' };
  return { ...base, board, active: { ...base.active, ...overrides } };
}
test('ground timer starts at zero on initial contact; blocked moves preserve state and timer', () => {
  const contact = advanceTicks(supportedArcade(), 1).state;
  assert.equal(contact.active.lockStarted, true); assert.equal(contact.active.lockTicks, 0);
  const grounded = advanceTicks(contact, 23).state; assert.equal(grounded.active.lockTicks, 23);
  const board = [...grounded.board]; board[0 * 6 + grounded.active.x - 1] = { id: 1000, colour: 'red' };
  const blockedState = { ...grounded, board }; const blocked = applyAction(blockedState, { kind: 'left' });
  assert.equal(blocked.accepted, false); assert.equal(blocked.state, blockedState); assert.equal(blocked.state.active.lockTicks, 23);
});

test('first eight grounded cycles reset; the ninth preserves 23 ticks and locks on the next tick', () => {
  let state = supportedArcade({ lockTicks: 23, lockStarted: true });
  for (let i = 0; i < 8; i++) { state = applyAction(state, { kind: 'cycle-forward' }).state; assert.equal(state.active.lockTicks, 0); }
  state = { ...state, active: { ...state.active, lockTicks: 23 } };
  const ninth = applyAction(state, { kind: 'cycle-forward' }).state;
  assert.equal(ninth.active.lockTicks, 23); assert.equal(ninth.active.lockResets, 8);
  const locked = advanceTicks(ninth, 1).state; assert.equal(locked.completedPieces, 1);
});

test('exhausted grounded time pauses while airborne and resumes on recontact', () => {
  let state = supportedArcade({ lockTicks: 23, lockStarted: true, lockResets: 8 });
  state = applyAction(state, { kind: 'left' }).state;
  assert.equal(state.active.lockResets, 8); assert.equal(state.active.lockTicks, 23);
  state = advanceTicks(state, 10).state; assert.equal(state.active.lockTicks, 23);
  const board = [...state.board]; board[(0 + 3) * 6 + state.active.x] = { id: 1001, colour: 'gold' };
  state = { ...state, board };
  const locked = advanceTicks(state, 1).state; assert.equal(locked.completedPieces, 1);
});

test('clear, removal, gravity, and next-wave phases expose intermediate board snapshots', () => {
  const fixture = tripletFixtures.find(item => item.id === 'triplets-cascade'); const base = createGame({ width: 6, height: 12, mode: 'relaxed', seed: 'phase-fixture' });
  const board = Array(6 * 15).fill(null); let id = 100;
  fixture.board.forEach((row, y) => [...row].forEach((char, x) => { if (char !== '.') board[(y + 3) * 6 + x] = { id: id++, colour: code[char] }; }));
  const piece = { ...base.active, x: 5, y: 9, gems: base.active.gems.map((gem, index) => ({ ...gem, id: 1000 + index })) };
  let game = { ...base, board, active: piece, nextId: 1003 };
  game = applyAction(game, { kind: 'place' }).state;
  assert.equal(game.phase, 'clear-mark'); assert.equal(game.board.filter(Boolean).length, fixture.board.flatMap(row => [...row]).filter(char => char !== '.').length + 3);
  assert.equal(applyAction(game, { kind: 'cycle-forward' }).accepted, false);
  game = advanceTicks(game, 7).state; assert.equal(game.phase, 'clear-remove'); assert.ok(game.board[(9 + 3) * 6 + 2]);
  game = advanceTicks(game, 6).state; assert.equal(game.phase, 'gravity'); assert.equal(game.board[(8 + 3) * 6 + 2]?.colour, 'red'); assert.equal(game.board[(11 + 3) * 6 + 2], null);
  game = advanceTicks(game, 9).state; assert.equal(game.phase, 'clear-mark'); assert.equal(game.resolutionChain, 2); assert.equal(game.board[(11 + 3) * 6 + 2]?.colour, 'red');
  game = advanceTicks(game, 22).state; assert.equal(game.phase, 'falling'); assert.equal(game.score, 90);
});

test('input scheduler orders held movement, cycles, drop, and two-tick soft descent', () => {
  let input = createInputScheduler(); input = setHeldAction(input, 'left', true); input = setHeldAction(input, 'soft-drop', true);
  input = queueInputEdge(input, { kind: 'hard-drop' }); input = queueInputEdge(input, { kind: 'cycle-forward' });
  let result; [result, input] = actionsForTick(input);
  assert.deepEqual(result.map(item => item.kind), ['left', 'cycle-forward', 'hard-drop', 'soft-drop']);
  [result, input] = actionsForTick(input); assert.deepEqual(result, []);
  [result, input] = actionsForTick(input); assert.deepEqual(result.map(item => item.kind), ['soft-drop']);
  assert.deepEqual(releaseAllActions(input), createInputScheduler());
  let held = setHeldAction(createInputScheduler(), 'left', true); for (let i = 0; i < 10; i++) [, held] = actionsForTick(held);
  [result, held] = actionsForTick(held); assert.deepEqual(result.map(item => item.kind), ['left']);
  let opposite = setHeldAction(createInputScheduler(), 'left', true); opposite = setHeldAction(opposite, 'right', true);
  [result, opposite] = actionsForTick(opposite); assert.deepEqual(result, []);
});

test('save decoding replays canonical input and rejects altered checkpoints and invalid settings', () => {
  let game = createGame({ mode: 'arcade', seed: 'replay-save' }); game = applyAction(game, { kind: 'cycle-forward' }).state; game = advanceTicks(game, 65).state; game = applyAction(game, { kind: 'left' }).state;
  assert.deepEqual(decodeGame(encodeGame(game)), game);
  const tampered = JSON.parse(encodeGame(game)); tampered.checkpoint.score += 1;
  assert.throws(() => decodeGame(JSON.stringify(tampered)), /checkpoint does not match/);
  const invalid = JSON.parse(encodeGame(game)); invalid.settings.width = 4;
  assert.throws(() => decodeGame(JSON.stringify(invalid)), /5–12 columns/);
  assert.throws(() => decodeGame('x'.repeat(2 * 1024 * 1024 + 1)), /2 MiB/);
});

test('every advertised action is accepted in the exact listed state, including resolution pause', () => {
  let state = createGame({ mode: 'arcade', seed: 'legal' });
  for (const action of legalActions(state)) assert.equal(applyAction(state, action).accepted, true, action.kind);
  const blockedBoard = [...state.board]; blockedBoard[0 * state.settings.width + state.active.x - 1] = { id: 900, colour: 'teal' };
  state = { ...state, board: blockedBoard };
  assert.equal(legalActions(state).some(action => action.kind === 'left'), false);
  assert.equal(applyAction(state, { kind: 'left' }).state, state);
  const marked = { ...state, phase: 'clear-mark', active: null, pendingClear: [0] };
  assert.deepEqual(legalActions(marked), [{ kind: 'pause' }]);
  const paused = applyAction(marked, { kind: 'pause' }); assert.equal(paused.accepted, true);
  assert.deepEqual(legalActions(paused.state), [{ kind: 'resume' }]);
  assert.equal(applyAction(paused.state, { kind: 'resume' }).state.phase, 'clear-mark');
});

test('tick batching is identical to sequential ticks and xorshift matches the frozen vector', () => {
  const state = createGame({ mode: 'arcade', seed: 'tick-equivalence' });
  let sequential = state; const eventSequence = [];
  for (let i = 0; i < 180; i++) { const step = advanceTicks(sequential, 1); sequential = step.state; eventSequence.push(...step.events); }
  const batched = advanceTicks(state, 180); assert.deepEqual(batched.state, sequential); assert.deepEqual(batched.events, eventSequence);
  let random = 1; const vector = []; for (let i = 0; i < 5; i++) { [random] = nextUint32(random); vector.push(random); }
  assert.deepEqual(vector, [270369, 67634689, 2647435461, 307599695, 2398689233]);
});

test('Daily requires a host supplied UTC date and fixes its board and colour category', () => {
  assert.throws(() => createGame({ mode: 'daily' }), /UTC YYYY-MM-DD date/);
  assert.throws(() => createGame({ mode: 'daily', seed: '2026-19-42' }), /UTC YYYY-MM-DD date/);
  assert.throws(() => createGame({ mode: 'daily', seed: '2026-10-05', preset: 'wide' }), /fixed 6×13/);
  const a = createGame({ mode: 'daily', seed: '2026-10-05' }); const b = createGame({ mode: 'daily', seed: '2026-10-05' });
  assert.deepEqual(a, b); assert.equal(a.settings.pieceLimit, 60); assert.equal(a.settings.colourCount, 5);
  const paused = applyAction(a, { kind: 'pause' }).state; assert.equal(paused.assisted, true);
});

function challengeBoard(width = 6, height = 13) { return Array(width * height).fill(null); }
function redTargetSetup() {
  const board = challengeBoard();
  board[11 * 6 + 2] = { id: 10, colour: 'red', target: true };
  board[12 * 6 + 2] = { id: 11, colour: 'red' };
  board[12 * 6] = { id: 12, colour: 'red' };
  return board;
}
function targetChallenge(queue = [['gold', 'purple', 'gold'], ['green', 'blue', 'red']]) {
  return createChallenge({ seed: 'target-clear', board: redTargetSetup(), queue, goal: { type: 'targets', targetIds: [10] }, witness: [{ x: 1, orientation: 0 }, { x: 2, orientation: 0 }] });
}

test('challenge validates stable authored board, stable IDs, colors, goal IDs, and finite queue before creation', () => {
  const board = challengeBoard(); board[12 * 6 + 2] = { id: 91, colour: 'red', target: true };
  const valid = { board, queue: [['red', 'blue', 'green'], ['gold', 'purple', 'red']], goal: { type: 'targets', targetIds: [91] } };
  const first = createChallenge(valid); assert.equal(first.active.gems[0].id, 92); assert.equal(first.settings.mode, 'challenge');
  assert.deepEqual(restartGame(first), first); assert.throws(() => createGame({ mode: 'challenge' }), /Use createChallenge/);
  assert.throws(() => createChallenge({ ...valid, queue: [['red', 'red', 'red']] }), /2–12 triplets/);
  assert.throws(() => createChallenge({ ...valid, queue: [['red', 'red', 'red'], ['red', 'red', 'red'], ...Array(11).fill(['red', 'red', 'red'])] }), /2–12 triplets/);
  const unstable = board.slice(); unstable[10 * 6 + 2] = { id: 92, colour: 'blue' };
  assert.throws(() => createChallenge({ ...valid, board: unstable }), /unstable/);
  assert.throws(() => createChallenge({ ...valid, board: board.map((cell, i) => i === 12 * 6 + 2 ? { ...cell, id: 0 } : cell) }), /Invalid challenge gem/);
  assert.throws(() => createChallenge({ ...valid, board: board.map((cell, i) => i === 12 * 6 + 2 ? { ...cell, target: false } : cell) }), /Target flags/);
  assert.throws(() => createChallenge({ ...valid, goal: { type: 'targets', targetIds: [999] } }), /Target goal/);
  assert.throws(() => createChallenge({ ...valid, queue: [['teal', 'teal', 'teal'], ['red', 'red', 'teal']] }), /Invalid challenge triplet/);
  assert.throws(() => createChallenge({ ...valid, witness: [{ x: 2, orientation: 0 }, { x: 2, orientation: 0 }] }), /does not solve|ends before/);
});

test('challenge queue advances exactly once per resolved piece and honest exhaustion loses', () => {
  let game = targetChallenge();
  game = applyAction(game, { kind: 'left' }).state;
  game = applyAction(game, { kind: 'hard-drop' }).state;
  assert.equal(game.completedPieces, 1); assert.equal(game.challengeIndex, 1);
  assert.deepEqual(game.active.gems.map(gem => gem.colour), ['green', 'blue', 'red']); assert.deepEqual(game.next, []);
  game = applyAction(game, { kind: 'hard-drop' }).state;
  assert.equal(game.phase, 'clear-mark');
  game = advanceTicks(game, 7 + 6 + 9).state;
  assert.equal(game.phase, 'won'); assert.equal(game.completedPieces, 2); assert.equal(game.board[15 * 6]?.id, 12);

  let exhausted = createChallenge({ seed: 'queue-end', board: redTargetSetup(), queue: [['gold', 'purple', 'gold'], ['green', 'blue', 'purple']], goal: { type: 'targets', targetIds: [10] } });
  exhausted = applyAction(exhausted, { kind: 'left' }).state; exhausted = applyAction(exhausted, { kind: 'hard-drop' }).state;
  exhausted = applyAction(exhausted, { kind: 'hard-drop' }).state;
  assert.equal(exhausted.phase, 'lost'); assert.equal(exhausted.reason, 'challenge-queue-exhausted');
});

test('target goals follow unique gem IDs rather than matching every gem of that colour', () => {
  let game = targetChallenge(); game = applyAction(game, { kind: 'left' }).state; game = applyAction(game, { kind: 'hard-drop' }).state;
  game = applyAction(game, { kind: 'hard-drop' }).state; game = advanceTicks(game, 22).state;
  assert.equal(game.phase, 'won'); assert.ok(game.board.some(gem => gem?.id === 12));
  assert.ok(!game.board.some(gem => gem?.id === 10));
});

test('challenge wins the final queued piece before checking a remaining hidden-row gem', () => {
  let game = targetChallenge();
  const board = [...game.board]; board[11 * 6 + 2 + 3 * 6] = null; board[0] = { id: 999, colour: 'purple' };
  game = { ...game, board, completedPieces: 1, challengeIndex: 1, active: { ...game.active, gems: game.active.gems.map((gem, i) => ({ ...gem, id: 1001 + i, colour: ['green', 'blue', 'red'][i] })) } };
  game = applyAction(game, { kind: 'hard-drop' }).state;
  assert.equal(game.phase, 'won'); assert.equal(game.completedPieces, 2);
});

test('challenge hints, paused resolution, replay, and same-configuration restart are canonical', () => {
  const original = createChallenge({ seed: 'target-clear', board: redTargetSetup(), queue: [['green', 'blue', 'red'], ['gold', 'purple', 'gold']], goal: { type: 'targets', targetIds: [10] }, witness: [{ x: 2, orientation: 0 }, { x: 1, orientation: 0 }] });
  let game = original; const hint = applyAction(game, { kind: 'hint' });
  assert.equal(hint.accepted, true); assert.equal(hint.state.assisted, true); assert.equal(hint.state.hintsUsed, 1);
  assert.deepEqual(hint.events[0], { type: 'hint-shown', piece: 0, x: 2, orientation: 0 }); game = hint.state;
  game = applyAction(game, { kind: 'hard-drop' }).state; game = applyAction(game, { kind: 'pause' }).state;
  assert.equal(game.phase, 'paused'); assert.equal(game.pausedPhase, 'clear-mark');
  assert.deepEqual(decodeGame(encodeGame(game)), game);
  game = applyAction(game, { kind: 'resume' }).state; game = advanceTicks(game, 7 + 6 + 9).state;
  assert.equal(game.phase, 'won'); assert.equal(game.assisted, true);
  assert.deepEqual(restartGame(game), original);
  assert.equal(decodeGame(encodeGame(game)).hintsUsed, 1);
});

test('hints stop after an off-witness placement; temporary moves and cycles remain recoverable', () => {
  let deviated = targetChallenge();
  deviated = applyAction(deviated, { kind: 'left' }).state; deviated = applyAction(deviated, { kind: 'left' }).state;
  deviated = applyAction(deviated, { kind: 'hard-drop' }).state;
  assert.equal(deviated.completedPieces, 1); assert.equal(deviated.witnessPathMatches, false);
  assert.equal(legalActions(deviated).some(action => action.kind === 'hint'), false);
  const rejected = applyAction(deviated, { kind: 'hint' }); assert.equal(rejected.accepted, false); assert.equal(rejected.state, deviated);

  let onPath = targetChallenge();
  onPath = applyAction(onPath, { kind: 'hint' }).state;
  onPath = applyAction(onPath, { kind: 'left' }).state; onPath = applyAction(onPath, { kind: 'right' }).state;
  onPath = applyAction(onPath, { kind: 'cycle-forward' }).state; onPath = applyAction(onPath, { kind: 'cycle-backward' }).state;
  onPath = applyAction(onPath, { kind: 'left' }).state;
  onPath = applyAction(onPath, { kind: 'hard-drop' }).state;
  assert.equal(onPath.witnessPathMatches, true); assert.equal(onPath.completedPieces, 1);
  assert.equal(applyAction(onPath, { kind: 'hint' }).accepted, true);
});

test('Daily resolves to 60-piece finish or a recorded honest top-out', () => {
  let game = createGame({ mode: 'daily', seed: '2026-10-05' }); let guard = 0;
  while (!['finished', 'lost'].includes(game.phase) && guard++ < 100_000) {
    if (game.phase === 'falling') game = applyAction(game, { kind: 'hard-drop' }).state;
    else game = advanceTicks(game, 1).state;
  }
  assert.ok(['finished', 'lost'].includes(game.phase));
  if (game.phase === 'finished') assert.equal(game.completedPieces, 60);
  else { assert.ok(game.completedPieces < 60); assert.ok(['top-out', 'spawn-collision'].includes(game.reason)); }
  assert.deepEqual(decodeGame(encodeGame(game)), game);
});

test('save parser rejects oversized replay budgets, noncanonical settings and malformed action payloads', () => {
  const game = createGame({ seed: 'save-limits' });
  const tooManyTicks = JSON.parse(encodeGame(game)); tooManyTicks.elapsedTicks = 600_001;
  assert.throws(() => decodeGame(JSON.stringify(tooManyTicks)), /replay limits/);
  const malformed = JSON.parse(encodeGame(game)); malformed.actions = Array(10_001).fill({ tick: 0, ordinal: 0, action: { kind: 'left' } });
  assert.throws(() => decodeGame(JSON.stringify(malformed)), /replay limits/);
  const extra = JSON.parse(encodeGame(game)); extra.settings.unknown = true;
  assert.throws(() => decodeGame(JSON.stringify(extra)), /not canonical/);
  const payload = JSON.parse(encodeGame(applyAction(game, { kind: 'left' }).state)); payload.actions[0].action.x = 99;
  assert.throws(() => decodeGame(JSON.stringify(payload)), /recorded action fields/);
});

test("preset widths distinguish narrow, standard, wide and tall", () => {
  for (const [preset, width, height] of [["compact",5,13],["extraWide",12,13],["narrow",6,13],["standard",8,13],["wide",10,13],["tall",8,17]]) {
    const game = createGame({preset, seed:"preset-check"}); assert.equal(game.settings.width,width); assert.equal(game.settings.height,height);
  }
  assert.equal(createGame({seed:"default-check"}).settings.width,8);
  const extra = applyAction(createGame({preset:"extraWide",mode:"arcade",seed:"wide-replay"}),{kind:"hard-drop"}).state;
  assert.deepEqual(decodeGame(encodeGame(extra)),extra);
  assert.throws(()=>createGame({width:13,height:13}),/5–12/);
  assert.equal(createGame({mode:"daily", seed:"2026-10-05"}).settings.width,6);
});
