import assert from "node:assert/strict";
import { test } from "vitest";
import {
  actionsForTick,
  advanceTicks,
  applyAction,
  applyScheduledActions,
  createChallenge,
  createGame,
  createInputScheduler,
  decodeGame,
  encodeGame,
  processInputTick,
  queueInputEdge,
  restartGame,
  StoneChainsOptionsError,
  setHeldInput,
} from "../dist/colour-chains.js";
import { active, blank, groundedArcade, H, put, stateWith, W } from "./colour-chains-helpers.mjs";

test("ground contact begins at zero and locks after 24 accumulated grounded ticks", () => {
  let state = groundedArcade({ groundedStarted: false });
  state = advanceTicks(state, 1).state;
  assert.equal(state.active.groundedStarted, true);
  assert.equal(state.active.groundedTicks, 0);
  state = advanceTicks(state, 23).state;
  assert.equal(state.active.groundedTicks, 23);
  assert.equal(state.completedPairs, 0);
  state = advanceTicks(state, 1).state;
  assert.equal(state.completedPairs, 1);
  assert.equal(state.active.level, 1);
});

test("eight successful grounded slides consume resets; the ninth keeps 23 ticks and locks on the next tick", () => {
  const floor = Array.from({ length: W }, (_, x) => x);
  let state = groundedArcade({ x: 1, support: floor });
  for (const direction of ["right", "right", "right", "left", "left", "left", "right", "right"])
    state = applyAction(state, { kind: direction }).state;
  assert.equal(state.active.resetCount, 8);
  assert.equal(state.active.groundedTicks, 0);
  state = groundedArcade({ x: 2, support: floor, resetCount: 8, groundedTicks: 23 });
  const ninth = applyAction(state, { kind: "right" });
  assert.equal(ninth.accepted, true);
  assert.equal(ninth.state.active.resetCount, 8);
  assert.equal(ninth.state.active.groundedTicks, 23);
  assert.equal(advanceTicks(ninth.state, 1).state.completedPairs, 1);
});

test("blocked moves do not reset; exhausted airtime pauses and recontact resumes grounded time", () => {
  const blocked = groundedArcade({ x: 0, orientation: "right", support: [0, 1], resetCount: 3, groundedTicks: 23 });
  const failed = applyAction(blocked, { kind: "left" });
  assert.equal(failed.accepted, false);
  assert.equal(failed.state, blocked);
  assert.equal(blocked.active.resetCount, 3);
  assert.equal(blocked.active.groundedTicks, 23);

  let state = groundedArcade({ x: 2, support: [2], resetCount: 7, groundedTicks: 19 });
  const departure = applyAction(state, { kind: "right" });
  assert.equal(departure.accepted, true);
  assert.equal(departure.state.active.resetCount, 8);
  assert.equal(departure.state.active.groundedTicks, 0);
  assert.equal(departure.state.active.groundedStarted, false); // the eighth reset clears contact time

  state = groundedArcade({ x: 2, support: [2], resetCount: 8, groundedTicks: 13 });
  const leftSupport = applyAction(state, { kind: "right" });
  assert.equal(leftSupport.state.active.groundedTicks, 13);
  state = advanceTicks(leftSupport.state, 10).state;
  assert.equal(state.active.groundedTicks, 13);
  state = applyAction(state, { kind: "left" }).state;
  assert.equal(state.active.groundedStarted, true);
  assert.equal(state.active.groundedTicks, 13);
  state = advanceTicks(state, 11).state;
  assert.equal(state.completedPairs, 1);
});

test("rotation consumes reset only on accepted grounded turns and rejected kicks preserve identity", () => {
  const floor = Array.from({ length: W }, (_, x) => x);
  const grounded = groundedArcade({ x: 2, support: floor, groundedTicks: 9 });
  const turned = applyAction(grounded, { kind: "rotate-clockwise" });
  assert.equal(turned.accepted, true);
  assert.equal(turned.state.active.resetCount, 1);
  assert.equal(turned.state.active.groundedTicks, 0);
  const obstacleBoard = blank();
  [
    [2, 11],
    [3, 10],
    [1, 10],
    [4, 10],
    [3, 9],
  ].forEach(([x, y], i) => {
    put(obstacleBoard, x, y, "gold", 6000 + i);
  });
  const blocked = stateWith(
    obstacleBoard,
    { ...active(["red", "blue"], { x: 2, y: 10 }, "up"), groundedStarted: true, groundedTicks: 22 },
    { settings: { ...createGame({ mode: "arcade" }).settings, width: W, height: H } },
  );
  const rejected = applyAction(blocked, { kind: "rotate-clockwise" });
  assert.equal(rejected.accepted, false);
  assert.equal(rejected.state, blocked);
  const zeroContact = applyAction(groundedArcade({ groundedStarted: false }), { kind: "rotate-clockwise" });
  assert.equal(zeroContact.state.active.resetCount, 1);
  assert.equal(zeroContact.state.active.groundedTicks, 0);
});

test("input repeats at 10/3, soft drops every two ticks, orders edges, and releases on lock or resolution", () => {
  const game = createGame({ mode: "arcade", seed: "input" });
  let input = createInputScheduler();
  input = setHeldInput(input, "left", true);
  input = setHeldInput(input, "soft-drop", true);
  const observed = [];
  for (let tick = 0; tick <= 10; tick++) {
    const [actions, next] = actionsForTick(game, input);
    observed.push([tick, actions.map((action) => action.kind)]);
    input = next;
  }
  assert.deepEqual(observed[0], [0, ["left", "down"]]);
  assert.deepEqual(observed[2], [2, ["down"]]);
  assert.deepEqual(observed[10], [10, ["left", "down"]]);
  input = createInputScheduler();
  input = setHeldInput(input, "left", true);
  input = queueInputEdge(input, { kind: "rotate-clockwise" });
  input = queueInputEdge(input, { kind: "hard-drop" });
  input = queueInputEdge(input, { kind: "pause" });
  const [ordered] = actionsForTick(game, input);
  assert.deepEqual(
    ordered.map((action) => action.kind),
    ["left", "rotate-clockwise", "hard-drop", "pause"],
  );
  const [scheduled, nextInput] = actionsForTick(game, input);
  const [locked, released] = applyScheduledActions(game, nextInput, scheduled, applyAction);
  assert.equal(locked.recording.at(-1).action.kind, "hard-drop");
  assert.deepEqual(released, createInputScheduler());
  const [paused, pauseInput] = actionsForTick(
    { ...game, phase: "clear-mark", active: null },
    setHeldInput(input, "right", true),
  );
  assert.deepEqual(paused, [{ kind: "pause" }]);
  assert.deepEqual(pauseInput, createInputScheduler());
  const [duringResolution, afterResolution] = actionsForTick(
    { ...game, phase: "gravity", active: null },
    setHeldInput(createInputScheduler(), "left", true),
  );
  assert.deepEqual(duringResolution, []);
  assert.deepEqual(afterResolution, createInputScheduler());
});

test("challenge goals verify their witness, win on the final queue placement and make hints sticky-assisted", () => {
  const board = blank();
  for (const x of [0, 1, 3]) put(board, x, 11, "red", 7000 + x);
  const options = {
    id: "chain-targets",
    width: W,
    height: H,
    colourCount: 4,
    board: board.slice(W * 3),
    queue: [
      ["green", "blue"],
      ["red", "blue"],
    ],
    goal: { kind: "clear-targets", targetIds: [7000, 7001, 7003] },
    witness: [
      { pivotX: 5, orientation: "up" },
      { pivotX: 2, orientation: "up" },
    ],
  };
  const challenge = createChallenge(options);
  const hint = applyAction(challenge, { kind: "hint" });
  assert.equal(hint.accepted, true);
  assert.equal(hint.state.assisted, true);
  assert.equal(hint.events[0].pivotX, 5);
  let state = hint.state;
  for (let i = 0; i < 3; i++) state = applyAction(state, { kind: "right" }).state;
  state = applyAction(state, { kind: "hard-drop" }).state;
  assert.equal(state.completedPairs, 1);
  assert.equal(state.phase, "falling");
  const secondHint = applyAction(state, { kind: "hint" });
  assert.equal(secondHint.accepted, true);
  state = secondHint.state;
  state = applyAction(state, { kind: "hard-drop" }).state;
  while (["clear-mark", "clear-remove", "gravity"].includes(state.phase)) state = advanceTicks(state, 3600).state;
  assert.equal(state.phase, "won");
  assert.equal(state.reason, "goal-complete");
  assert.equal(state.completedPairs, 2);
  assert.equal(state.assisted, true);
  assert.equal(restartGame(state).phase, "falling");
  assert.equal(restartGame(state).settings.challengeId, "chain-targets");
  assert.throws(
    () => createChallenge({ ...options, witness: [{ pivotX: 5, orientation: "up" }] }),
    StoneChainsOptionsError,
  );
});

test("challenge hints disappear off the witnessed prefix and exhausted queues report an honest loss", () => {
  const board = blank();
  for (const x of [0, 1, 3]) put(board, x, 11, "red", 8000 + x);
  const options = {
    id: "finite-targets",
    width: W,
    height: H,
    colourCount: 4,
    board: board.slice(W * 3),
    queue: [
      ["green", "blue"],
      ["red", "blue"],
    ],
    goal: { kind: "clear-targets", targetIds: [8000, 8001, 8003] },
    witness: [
      { pivotX: 5, orientation: "up" },
      { pivotX: 2, orientation: "up" },
    ],
  };
  let state = createChallenge(options);
  state = applyAction(state, { kind: "right" }).state;
  state = applyAction(state, { kind: "right" }).state;
  state = applyAction(state, { kind: "hard-drop" }).state;
  assert.equal(state.witnessIndex, -1);
  assert.equal(state.phase, "falling");
  const unavailable = applyAction(state, { kind: "hint" });
  assert.equal(unavailable.accepted, false);
  assert.equal(unavailable.state, state);
  for (let i = 0; i < 3; i++) state = applyAction(state, { kind: "right" }).state;
  state = applyAction(state, { kind: "hard-drop" }).state;
  assert.equal(state.phase, "lost");
  assert.equal(state.reason, "challenge-queue-exhausted");
  assert.equal(applyAction(state, { kind: "left" }).accepted, false);
});

test("canonical saves replay daily, paused, selected-tick and mid-resolution checkpoints; hostile data is rejected", () => {
  let arcade = createGame({ mode: "arcade", seed: "recording" });
  arcade = applyAction(arcade, { kind: "left" }).state;
  arcade = advanceTicks(arcade, 20).state;
  arcade = applyAction(arcade, { kind: "rotate-clockwise" }).state;
  assert.deepEqual(decodeGame(encodeGame(arcade)), arcade);
  const paused = applyAction(arcade, { kind: "pause" }).state;
  assert.deepEqual(decodeGame(encodeGame(paused)), paused);
  const resumed = applyAction(paused, { kind: "resume" }).state;
  assert.deepEqual(decodeGame(encodeGame(resumed)), resumed);
  const daily = createGame({ mode: "daily", dailyDate: "2026-10-05" });
  assert.deepEqual(decodeGame(encodeGame(daily)), daily);

  const board = blank();
  for (const x of [0, 1, 3]) put(board, x, 11, "red", 9000 + x);
  const challenge = createChallenge({
    id: "save-phase",
    width: W,
    height: H,
    colourCount: 4,
    board: board.slice(W * 3),
    queue: [
      ["green", "blue"],
      ["red", "blue"],
    ],
    goal: { kind: "clear-targets", targetIds: [9000, 9001, 9003] },
    witness: [
      { pivotX: 5, orientation: "up" },
      { pivotX: 2, orientation: "up" },
    ],
  });
  let state = challenge;
  for (let i = 0; i < 3; i++) state = applyAction(state, { kind: "right" }).state;
  state = applyAction(state, { kind: "hard-drop" }).state; // safe first placement
  state = applyAction(state, { kind: "hard-drop" }).state;
  assert.equal(state.phase, "clear-mark");
  assert.deepEqual(decodeGame(encodeGame(state)), state);
  state = advanceTicks(state, 8).state;
  assert.equal(state.phase, "clear-remove");
  state = applyAction(state, { kind: "pause" }).state;
  assert.equal(state.phase, "paused");
  assert.deepEqual(decodeGame(encodeGame(state)), state);
  const elapsed = state.elapsedTicks;
  state = advanceTicks(state, 50).state;
  assert.equal(state.elapsedTicks, elapsed);
  state = applyAction(state, { kind: "resume" }).state;
  state = advanceTicks(state, 100).state;
  assert.equal(state.phase, "won");
  assert.deepEqual(decodeGame(encodeGame(state)), state);

  const parsed = JSON.parse(encodeGame(arcade));
  parsed.checkpoint.score++;
  assert.throws(() => decodeGame(JSON.stringify(parsed)), /checkpoint/);
  const extra = JSON.parse(encodeGame(arcade));
  extra.actions[0].secret = true;
  assert.throws(() => decodeGame(JSON.stringify(extra)), /record/);
  assert.throws(() => decodeGame("{"), /JSON/);
  assert.throws(() => decodeGame("x".repeat(2 * 1024 * 1024 + 1)), RangeError);
  assert.throws(() => encodeGame({ ...arcade, elapsedTicks: 10_000_001 }), RangeError);
  assert.throws(
    () => encodeGame({ ...arcade, recording: Array(100_001).fill({ tick: 0, ordinal: 0, action: { kind: "left" } }) }),
    RangeError,
  );
});

test("gravity follows the level curve, soft drop prevents a duplicate gravity step, and ticks batch identically", () => {
  let state = createGame({ mode: "arcade", seed: "gravity" });
  const start = state.active.pivot.y;
  state = advanceTicks(state, 59).state;
  assert.equal(state.active.pivot.y, start);
  state = advanceTicks(state, 1).state;
  assert.equal(state.active.pivot.y, start + 1);
  const threshold = stateWith(blank(), active(["red", "blue"], { x: 2, y: 10 }, "right"), {
    settings: { ...createGame({ mode: "arcade" }).settings, width: W, height: H },
    completedPairs: 29,
  });
  const secondLevel = applyAction(threshold, { kind: "hard-drop" }).state;
  assert.equal(secondLevel.active.level, 2);
  const atLevelTwo = {
    ...createGame({ mode: "arcade", seed: "level-two" }),
    active: { ...createGame({ mode: "arcade", seed: "level-two" }).active, level: 2 },
  };
  const levelTwoY = atLevelTwo.active.pivot.y;
  const after50 = advanceTicks(atLevelTwo, 50).state;
  assert.equal(after50.active.pivot.y, levelTwoY);
  assert.equal(advanceTicks(after50, 1).state.active.pivot.y, levelTwoY + 1);

  const scheduler = setHeldInput(createInputScheduler(), "soft-drop", true);
  const [softGame, ,] = processInputTick(
    createGame({ mode: "arcade", seed: "soft" }),
    scheduler,
    applyAction,
    advanceTicks,
  );
  assert.equal(softGame.active.pivot.y, -1);
  assert.equal(softGame.score, 1);
  assert.equal(softGame.active.gravityTicks, 1);
  const batchedStart = createGame({ mode: "arcade", seed: "batch-clock" });
  let sequential = batchedStart;
  const events = [];
  for (let i = 0; i < 120; i++) {
    const step = advanceTicks(sequential, 1);
    sequential = step.state;
    events.push(...step.events);
  }
  const batched = advanceTicks(batchedStart, 120);
  assert.deepEqual(batched.state, sequential);
  assert.deepEqual(batched.events, events);
});

test("challenge minimum-chain and empty-board objectives are independently witnessed", () => {
  const triple = Array(W * H).fill(null);
  triple[11 * W] = { id: 11001, colour: "red" };
  triple[11 * W + 1] = { id: 11002, colour: "red" };
  triple[11 * W + 3] = { id: 11003, colour: "red" };
  const chain = createChallenge({
    id: "minimum-chain",
    width: W,
    height: H,
    colourCount: 4,
    board: triple,
    queue: [
      ["red", "blue"],
      ["green", "gold"],
    ],
    goal: { kind: "minimum-chain", chain: 1 },
    witness: [{ pivotX: 2, orientation: "up" }],
  });
  let win = applyAction(chain, { kind: "hard-drop" }).state;
  while (["clear-mark", "clear-remove", "gravity"].includes(win.phase)) win = advanceTicks(win, 3600).state;
  assert.equal(win.phase, "won");
  assert.equal(win.maxChain, 1);

  const two = Array(W * H).fill(null);
  two[11 * W] = { id: 12001, colour: "gold" };
  two[11 * W + 1] = { id: 12002, colour: "gold" };
  const empty = createChallenge({
    id: "empty-board",
    width: W,
    height: H,
    colourCount: 4,
    board: two,
    queue: [
      ["gold", "gold"],
      ["red", "blue"],
    ],
    goal: { kind: "empty-board" },
    witness: [{ pivotX: 2, orientation: "up" }],
  });
  win = applyAction(empty, { kind: "hard-drop" }).state;
  while (["clear-mark", "clear-remove", "gravity"].includes(win.phase)) win = advanceTicks(win, 3600).state;
  assert.equal(win.phase, "won");
  assert.equal(
    win.board.every((gem) => gem === null),
    true,
  );
  assert.equal(win.allClears, 0); // Challenges do not receive the Arcade/Daily clear bonus.
});

test("the canonical recording captures held timing and rejects malformed setup and replay bounds", () => {
  const start = createGame({ mode: "arcade", seed: "held-save" });
  const held = setHeldInput(createInputScheduler(), "left", true);
  const [saved] = processInputTick(start, held, applyAction, advanceTicks);
  assert.deepEqual(decodeGame(encodeGame(saved)), saved);
  assert.equal(saved.recording[0].tick, 0);
  assert.equal(saved.recording[0].ordinal, 0);
  assert.throws(() => createGame({ mode: "arcade", width: 17, height: 12 }), StoneChainsOptionsError);
  assert.throws(
    () =>
      createChallenge({
        id: "bad",
        width: W,
        height: H,
        board: Array(W * H).fill(null),
        queue: [["red", "blue"]],
        goal: { kind: "empty-board" },
        witness: [{ pivotX: 2, orientation: "up" }],
      }),
    StoneChainsOptionsError,
  );
  const board = Array(W * H).fill(null);
  board[0] = { id: 1, colour: "red" };
  board[1] = { id: 1, colour: "blue" };
  assert.throws(
    () =>
      createChallenge({
        id: "duplicate",
        width: W,
        height: H,
        board,
        queue: [
          ["red", "blue"],
          ["green", "gold"],
        ],
        goal: { kind: "empty-board" },
        witness: [{ pivotX: 2, orientation: "up" }],
      }),
    StoneChainsOptionsError,
  );
});

test("a witnessed objective wins before a simultaneous hidden-row top-out or exhausted queue", () => {
  const board = Array(W * H).fill(null);
  let id = 13000;
  for (let y = 0; y < H; y++) board[y * W + 2] = { id: id++, colour: y % 2 ? "blue" : "green" };
  const targets = [];
  for (let y = 8; y < 12; y++) {
    const gemId = id++;
    targets.push(gemId);
    board[y * W] = { id: gemId, colour: "red" };
  }
  const challenge = createChallenge({
    id: "win-before-topout",
    width: W,
    height: H,
    colourCount: 4,
    board,
    queue: [
      ["gold", "blue"],
      ["red", "green"],
    ],
    goal: { kind: "clear-targets", targetIds: targets },
    witness: [{ pivotX: 2, orientation: "up" }],
  });
  let state = applyAction(challenge, { kind: "hard-drop" }).state;
  assert.equal(state.board.slice(0, W * 3).some(Boolean), true);
  while (["clear-mark", "clear-remove", "gravity"].includes(state.phase)) state = advanceTicks(state, 3600).state;
  assert.equal(state.phase, "won");
  assert.equal(state.reason, "goal-complete");
  assert.equal(state.board.slice(0, W * 3).some(Boolean), true);
});
