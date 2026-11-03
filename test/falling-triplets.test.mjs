import assert from "node:assert/strict";
import { test } from "vitest";
import {
  actionsForTick,
  advanceTicks,
  applyAction,
  createGame,
  createInputScheduler,
  decodeGame,
  encodeGame,
  findMatches,
  landingY,
  legalActions,
  nextUint32,
  queueInputEdge,
  releaseAllActions,
  setHeldAction,
} from "../dist/falling-triplets.js";
import {
  code,
  fixtureBoard,
  oracleMatches,
  oracleSettle,
  supportedArcade,
  tripletFixtures,
} from "./falling-triplets-helpers.mjs";

test("independent fixture checker verifies crossing union and every cascade wave", () => {
  for (const fixture of tripletFixtures.filter((item) => item.kernel === "line-match")) {
    const board = fixtureBoard(fixture.board);
    const expected = fixture.expectedCleared.map(([x, y]) => y * fixture.board[0].length + x).sort((a, b) => a - b);
    assert.deepEqual(oracleMatches(board, fixture.board[0].length, fixture.board.length), expected, fixture.id);
    assert.deepEqual(
      findMatches(board, fixture.board[0].length, fixture.board.length)
        .flatMap((wave) => wave.cells)
        .sort((a, b) => a - b),
      expected,
      `engine ${fixture.id}`,
    );
  }
  const fixture = tripletFixtures.find((item) => item.id === "triplets-cascade");
  let board = fixtureBoard(fixture.board);
  let score = 0;
  const waves = [];
  for (;;) {
    const cells = oracleMatches(board, fixture.board[0].length, fixture.board.length);
    if (!cells.length) break;
    const chain = waves.length + 1;
    const points = 10 * cells.length * fixture.pieceLevel * chain;
    score += points;
    waves.push({ cells, points });
    board = oracleSettle(
      board.map((gem, index) => (cells.includes(index) ? null : gem)),
      fixture.board[0].length,
      fixture.board.length,
    );
  }
  assert.deepEqual(
    waves.map((wave) => ({ cleared: wave.cells.map((cell) => [cell % 6, Math.floor(cell / 6)]), points: wave.points })),
    fixture.expectedWaves,
  );
  assert.deepEqual(
    board.map((gem, index) => (gem ? fixture.board[Math.floor(index / 6)][index % 6] : ".")),
    fixture.expectedBoard.flatMap((row) => [...row]),
  );
  assert.equal(score, fixture.expectedScore);
});

test("cycling works both ways while grounded and restart is deterministic", () => {
  const game = createGame({ seed: "cycle-check" });
  const before = game.active.gems.map((gem) => gem.colour);
  const forward = applyAction(game, { kind: "cycle-forward" });
  assert.deepEqual(
    forward.state.active.gems.map((gem) => gem.colour),
    [before[2], before[0], before[1]],
  );
  const backward = applyAction(forward.state, { kind: "cycle-backward" });
  assert.deepEqual(
    backward.state.active.gems.map((gem) => gem.colour),
    before,
  );
  let current = game;
  for (let i = 0; i < 3; i++) current = applyAction(current, { kind: "cycle-forward" }).state;
  assert.deepEqual(
    current.active.gems.map((gem) => gem.colour),
    before,
  );
  const a = createGame({ seed: "restart-check" });
  const b = createGame({ seed: "restart-check" });
  assert.deepEqual(a, b);
});

test("relaxed play moves, projects the rigid landing triplet, drops, and resolves immutable state", () => {
  const initial = createGame({ seed: "play-check" });
  const left = applyAction(initial, { kind: "left" });
  assert.equal(left.accepted, true);
  assert.equal(left.state.active.x, initial.active.x - 1);
  assert.equal(initial.active.x, Math.floor((initial.settings.width - 1) / 2));
  assert.equal(landingY(left.state), 10);
  const placed = applyAction(left.state, { kind: "place" });
  assert.equal(placed.accepted, true);
  assert.equal(placed.state.completedPieces, 1);
  assert.equal(placed.state.active !== null, true);
  assert.equal(placed.state.board.filter(Boolean).length, 3);
  assert.equal(placed.state.phase, "falling");
  assert.equal(applyAction(initial, { kind: "hard-drop" }).accepted, false);
});

test("arcade gravity, hard drop, pause, and checkpoint round trip preserve deterministic rules state", () => {
  const state = createGame({ mode: "arcade", seed: "arcade-check" });
  const fallen = advanceTicks(state, 60).state;
  assert.equal(fallen.active.y, state.active.y + 1);
  const paused = applyAction(fallen, { kind: "pause" }).state;
  assert.equal(paused.phase, "paused");
  const resumed = applyAction(paused, { kind: "resume" }).state;
  const dropped = applyAction(resumed, { kind: "hard-drop" }).state;
  assert.equal(dropped.completedPieces, 1);
  assert.deepEqual(decodeGame(encodeGame(dropped)), dropped);
});

test("public board bounds reject invalid dimensions before seed consumption", () => {
  assert.throws(() => createGame({ width: 4, height: 13, seed: "bounds" }), /5–16 columns/);
  assert.throws(() => createGame({ width: 6, height: 11, seed: "bounds" }), /12–32 visible rows/);
  assert.throws(() => createGame({ width: 10, height: 33, seed: "bounds" }), /12–32 visible rows/);
  assert.equal(createGame({ width: 5, height: 12, seed: "bounds" }).settings.width, 5);
  assert.equal(createGame({ width: 12, height: 20, seed: "bounds" }).settings.height, 20);
});
test("ground timer starts at zero on initial contact; blocked moves preserve state and timer", () => {
  const contact = advanceTicks(supportedArcade(), 1).state;
  assert.equal(contact.active.lockStarted, true);
  assert.equal(contact.active.lockTicks, 0);
  const grounded = advanceTicks(contact, 23).state;
  assert.equal(grounded.active.lockTicks, 23);
  const board = [...grounded.board];
  board[0 * 6 + grounded.active.x - 1] = { id: 1000, colour: "red" };
  const blockedState = { ...grounded, board };
  const blocked = applyAction(blockedState, { kind: "left" });
  assert.equal(blocked.accepted, false);
  assert.equal(blocked.state, blockedState);
  assert.equal(blocked.state.active.lockTicks, 23);
});

test("first eight grounded cycles reset; the ninth preserves 23 ticks and locks on the next tick", () => {
  let state = supportedArcade({ lockTicks: 23, lockStarted: true });
  for (let i = 0; i < 8; i++) {
    state = applyAction(state, { kind: "cycle-forward" }).state;
    assert.equal(state.active.lockTicks, 0);
  }
  state = { ...state, active: { ...state.active, lockTicks: 23 } };
  const ninth = applyAction(state, { kind: "cycle-forward" }).state;
  assert.equal(ninth.active.lockTicks, 23);
  assert.equal(ninth.active.lockResets, 8);
  const locked = advanceTicks(ninth, 1).state;
  assert.equal(locked.completedPieces, 1);
});

test("exhausted grounded time pauses while airborne and resumes on recontact", () => {
  let state = supportedArcade({ lockTicks: 23, lockStarted: true, lockResets: 8 });
  state = applyAction(state, { kind: "left" }).state;
  assert.equal(state.active.lockResets, 8);
  assert.equal(state.active.lockTicks, 23);
  state = advanceTicks(state, 10).state;
  assert.equal(state.active.lockTicks, 23);
  const board = [...state.board];
  board[(0 + 3) * 6 + state.active.x] = { id: 1001, colour: "gold" };
  state = { ...state, board };
  const locked = advanceTicks(state, 1).state;
  assert.equal(locked.completedPieces, 1);
});

test("clear, removal, gravity, and next-wave phases expose intermediate board snapshots", () => {
  const fixture = tripletFixtures.find((item) => item.id === "triplets-cascade");
  const base = createGame({ width: 6, height: 12, mode: "relaxed", seed: "phase-fixture" });
  const board = Array(6 * 15).fill(null);
  let id = 100;
  fixture.board.forEach((row, y) => {
    [...row].forEach((char, x) => {
      if (char !== ".") board[(y + 3) * 6 + x] = { id: id++, colour: code[char] };
    });
  });
  const piece = {
    ...base.active,
    x: 5,
    y: 9,
    gems: base.active.gems.map((gem, index) => ({ ...gem, id: 1000 + index })),
  };
  let game = { ...base, board, active: piece, nextId: 1003 };
  game = applyAction(game, { kind: "place" }).state;
  assert.equal(game.phase, "clear-mark");
  assert.equal(
    game.board.filter(Boolean).length,
    fixture.board.flatMap((row) => [...row]).filter((char) => char !== ".").length + 3,
  );
  assert.equal(applyAction(game, { kind: "cycle-forward" }).accepted, false);
  game = advanceTicks(game, 7).state;
  assert.equal(game.phase, "clear-remove");
  assert.ok(game.board[(9 + 3) * 6 + 2]);
  game = advanceTicks(game, 6).state;
  assert.equal(game.phase, "gravity");
  assert.equal(game.board[(8 + 3) * 6 + 2]?.colour, "red");
  assert.equal(game.board[(11 + 3) * 6 + 2], null);
  game = advanceTicks(game, 9).state;
  assert.equal(game.phase, "clear-mark");
  assert.equal(game.resolutionChain, 2);
  assert.equal(game.board[(11 + 3) * 6 + 2]?.colour, "red");
  game = advanceTicks(game, 22).state;
  assert.equal(game.phase, "falling");
  assert.equal(game.score, 90);
});

test("input scheduler orders held movement, cycles, drop, and two-tick soft descent", () => {
  let input = createInputScheduler();
  input = setHeldAction(input, "left", true);
  input = setHeldAction(input, "soft-drop", true);
  input = queueInputEdge(input, { kind: "hard-drop" });
  input = queueInputEdge(input, { kind: "cycle-forward" });
  let result;
  [result, input] = actionsForTick(input);
  assert.deepEqual(
    result.map((item) => item.kind),
    ["left", "cycle-forward", "hard-drop", "soft-drop"],
  );
  [result, input] = actionsForTick(input);
  assert.deepEqual(result, []);
  [result, input] = actionsForTick(input);
  assert.deepEqual(
    result.map((item) => item.kind),
    ["soft-drop"],
  );
  assert.deepEqual(releaseAllActions(input), createInputScheduler());
  let held = setHeldAction(createInputScheduler(), "left", true);
  for (let i = 0; i < 10; i++) [, held] = actionsForTick(held);
  [result, held] = actionsForTick(held);
  assert.deepEqual(
    result.map((item) => item.kind),
    ["left"],
  );
  let opposite = setHeldAction(createInputScheduler(), "left", true);
  opposite = setHeldAction(opposite, "right", true);
  [result, opposite] = actionsForTick(opposite);
  assert.deepEqual(result, []);
});

test("save decoding replays canonical input and rejects altered checkpoints and invalid settings", () => {
  let game = createGame({ mode: "arcade", seed: "replay-save" });
  game = applyAction(game, { kind: "cycle-forward" }).state;
  game = advanceTicks(game, 65).state;
  game = applyAction(game, { kind: "left" }).state;
  assert.deepEqual(decodeGame(encodeGame(game)), game);
  const tampered = JSON.parse(encodeGame(game));
  tampered.checkpoint.score += 1;
  assert.throws(() => decodeGame(JSON.stringify(tampered)), /checkpoint does not match/);
  const invalid = JSON.parse(encodeGame(game));
  invalid.settings.width = 4;
  assert.throws(() => decodeGame(JSON.stringify(invalid)), /5–16 columns/);
  assert.throws(() => decodeGame("x".repeat(2 * 1024 * 1024 + 1)), /2 MiB/);
});

test("every advertised action is accepted in the exact listed state, including resolution pause", () => {
  let state = createGame({ mode: "arcade", seed: "legal" });
  for (const action of legalActions(state)) assert.equal(applyAction(state, action).accepted, true, action.kind);
  const blockedBoard = [...state.board];
  blockedBoard[0 * state.settings.width + state.active.x - 1] = { id: 900, colour: "teal" };
  state = { ...state, board: blockedBoard };
  assert.equal(
    legalActions(state).some((action) => action.kind === "left"),
    false,
  );
  assert.equal(applyAction(state, { kind: "left" }).state, state);
  const marked = { ...state, phase: "clear-mark", active: null, pendingClear: [0] };
  assert.deepEqual(legalActions(marked), [{ kind: "pause" }]);
  const paused = applyAction(marked, { kind: "pause" });
  assert.equal(paused.accepted, true);
  assert.deepEqual(legalActions(paused.state), [{ kind: "resume" }]);
  assert.equal(applyAction(paused.state, { kind: "resume" }).state.phase, "clear-mark");
});

test("tick batching is identical to sequential ticks and xorshift matches the frozen vector", () => {
  const state = createGame({ mode: "arcade", seed: "tick-equivalence" });
  let sequential = state;
  const eventSequence = [];
  for (let i = 0; i < 180; i++) {
    const step = advanceTicks(sequential, 1);
    sequential = step.state;
    eventSequence.push(...step.events);
  }
  const batched = advanceTicks(state, 180);
  assert.deepEqual(batched.state, sequential);
  assert.deepEqual(batched.events, eventSequence);
  let random = 1;
  const vector = [];
  for (let i = 0; i < 5; i++) {
    [random] = nextUint32(random);
    vector.push(random);
  }
  assert.deepEqual(vector, [270369, 67634689, 2647435461, 307599695, 2398689233]);
});
