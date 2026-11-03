import assert from "node:assert/strict";
import { test } from "vitest";
import {
  advanceTicks,
  applyAction,
  createChallenge,
  createGame,
  decodeGame,
  encodeGame,
  legalActions,
  restartGame,
} from "../dist/falling-triplets.js";
import { challengeBoard, redTargetSetup, targetChallenge } from "./falling-triplets-helpers.mjs";

test("Daily requires a host supplied UTC date and fixes its board and colour category", () => {
  assert.throws(() => createGame({ mode: "daily" }), /UTC YYYY-MM-DD date/);
  assert.throws(() => createGame({ mode: "daily", seed: "2026-19-42" }), /UTC YYYY-MM-DD date/);
  assert.throws(() => createGame({ mode: "daily", seed: "2026-10-05", preset: "wide" }), /fixed 6×13/);
  const a = createGame({ mode: "daily", seed: "2026-10-05" });
  const b = createGame({ mode: "daily", seed: "2026-10-05" });
  assert.deepEqual(a, b);
  assert.equal(a.settings.pieceLimit, 60);
  assert.equal(a.settings.colourCount, 5);
  const paused = applyAction(a, { kind: "pause" }).state;
  assert.equal(paused.assisted, true);
});

test("challenge validates stable authored board, stable IDs, colors, goal IDs, and finite queue before creation", () => {
  const board = challengeBoard();
  board[12 * 6 + 2] = { id: 91, colour: "red", target: true };
  const valid = {
    board,
    queue: [
      ["red", "blue", "green"],
      ["gold", "purple", "red"],
    ],
    goal: { type: "targets", targetIds: [91] },
  };
  const first = createChallenge(valid);
  assert.equal(first.active.gems[0].id, 92);
  assert.equal(first.settings.mode, "challenge");
  assert.deepEqual(restartGame(first), first);
  assert.throws(() => createGame({ mode: "challenge" }), /Use createChallenge/);
  assert.throws(() => createChallenge({ ...valid, queue: [["red", "red", "red"]] }), /2–12 triplets/);
  assert.throws(
    () =>
      createChallenge({
        ...valid,
        queue: [["red", "red", "red"], ["red", "red", "red"], ...Array(11).fill(["red", "red", "red"])],
      }),
    /2–12 triplets/,
  );
  const unstable = board.slice();
  unstable[10 * 6 + 2] = { id: 92, colour: "blue" };
  assert.throws(() => createChallenge({ ...valid, board: unstable }), /unstable/);
  assert.throws(
    () => createChallenge({ ...valid, board: board.map((cell, i) => (i === 12 * 6 + 2 ? { ...cell, id: 0 } : cell)) }),
    /Invalid challenge gem/,
  );
  assert.throws(
    () =>
      createChallenge({
        ...valid,
        board: board.map((cell, i) => (i === 12 * 6 + 2 ? { ...cell, target: false } : cell)),
      }),
    /Target flags/,
  );
  assert.throws(() => createChallenge({ ...valid, goal: { type: "targets", targetIds: [999] } }), /Target goal/);
  assert.throws(
    () =>
      createChallenge({
        ...valid,
        queue: [
          ["teal", "teal", "teal"],
          ["red", "red", "teal"],
        ],
      }),
    /Invalid challenge triplet/,
  );
  assert.throws(
    () =>
      createChallenge({
        ...valid,
        witness: [
          { x: 2, orientation: 0 },
          { x: 2, orientation: 0 },
        ],
      }),
    /does not solve|ends before/,
  );
});

test("challenge queue advances exactly once per resolved piece and honest exhaustion loses", () => {
  let game = targetChallenge();
  game = applyAction(game, { kind: "left" }).state;
  game = applyAction(game, { kind: "hard-drop" }).state;
  assert.equal(game.completedPieces, 1);
  assert.equal(game.challengeIndex, 1);
  assert.deepEqual(
    game.active.gems.map((gem) => gem.colour),
    ["green", "blue", "red"],
  );
  assert.deepEqual(game.next, []);
  game = applyAction(game, { kind: "hard-drop" }).state;
  assert.equal(game.phase, "clear-mark");
  game = advanceTicks(game, 7 + 6 + 9).state;
  assert.equal(game.phase, "won");
  assert.equal(game.completedPieces, 2);
  assert.equal(game.board[15 * 6]?.id, 12);

  let exhausted = createChallenge({
    seed: "queue-end",
    board: redTargetSetup(),
    queue: [
      ["gold", "purple", "gold"],
      ["green", "blue", "purple"],
    ],
    goal: { type: "targets", targetIds: [10] },
  });
  exhausted = applyAction(exhausted, { kind: "left" }).state;
  exhausted = applyAction(exhausted, { kind: "hard-drop" }).state;
  exhausted = applyAction(exhausted, { kind: "hard-drop" }).state;
  assert.equal(exhausted.phase, "lost");
  assert.equal(exhausted.reason, "challenge-queue-exhausted");
});

test("target goals follow unique gem IDs rather than matching every gem of that colour", () => {
  let game = targetChallenge();
  game = applyAction(game, { kind: "left" }).state;
  game = applyAction(game, { kind: "hard-drop" }).state;
  game = applyAction(game, { kind: "hard-drop" }).state;
  game = advanceTicks(game, 22).state;
  assert.equal(game.phase, "won");
  assert.ok(game.board.some((gem) => gem?.id === 12));
  assert.ok(!game.board.some((gem) => gem?.id === 10));
});

test("challenge wins the final queued piece before checking a remaining hidden-row gem", () => {
  let game = targetChallenge();
  const board = [...game.board];
  board[11 * 6 + 2 + 3 * 6] = null;
  board[0] = { id: 999, colour: "purple" };
  game = {
    ...game,
    board,
    completedPieces: 1,
    challengeIndex: 1,
    active: {
      ...game.active,
      gems: game.active.gems.map((gem, i) => ({ ...gem, id: 1001 + i, colour: ["green", "blue", "red"][i] })),
    },
  };
  game = applyAction(game, { kind: "hard-drop" }).state;
  assert.equal(game.phase, "won");
  assert.equal(game.completedPieces, 2);
});

test("challenge hints, paused resolution, replay, and same-configuration restart are canonical", () => {
  const original = createChallenge({
    seed: "target-clear",
    board: redTargetSetup(),
    queue: [
      ["green", "blue", "red"],
      ["gold", "purple", "gold"],
    ],
    goal: { type: "targets", targetIds: [10] },
    witness: [
      { x: 2, orientation: 0 },
      { x: 1, orientation: 0 },
    ],
  });
  let game = original;
  const hint = applyAction(game, { kind: "hint" });
  assert.equal(hint.accepted, true);
  assert.equal(hint.state.assisted, true);
  assert.equal(hint.state.hintsUsed, 1);
  assert.deepEqual(hint.events[0], { type: "hint-shown", piece: 0, x: 2, orientation: 0 });
  game = hint.state;
  game = applyAction(game, { kind: "hard-drop" }).state;
  game = applyAction(game, { kind: "pause" }).state;
  assert.equal(game.phase, "paused");
  assert.equal(game.pausedPhase, "clear-mark");
  assert.deepEqual(decodeGame(encodeGame(game)), game);
  game = applyAction(game, { kind: "resume" }).state;
  game = advanceTicks(game, 7 + 6 + 9).state;
  assert.equal(game.phase, "won");
  assert.equal(game.assisted, true);
  assert.deepEqual(restartGame(game), original);
  assert.equal(decodeGame(encodeGame(game)).hintsUsed, 1);
});

test("hints stop after an off-witness placement; temporary moves and cycles remain recoverable", () => {
  let deviated = targetChallenge();
  deviated = applyAction(deviated, { kind: "left" }).state;
  deviated = applyAction(deviated, { kind: "left" }).state;
  deviated = applyAction(deviated, { kind: "hard-drop" }).state;
  assert.equal(deviated.completedPieces, 1);
  assert.equal(deviated.witnessPathMatches, false);
  assert.equal(
    legalActions(deviated).some((action) => action.kind === "hint"),
    false,
  );
  const rejected = applyAction(deviated, { kind: "hint" });
  assert.equal(rejected.accepted, false);
  assert.equal(rejected.state, deviated);

  let onPath = targetChallenge();
  onPath = applyAction(onPath, { kind: "hint" }).state;
  onPath = applyAction(onPath, { kind: "left" }).state;
  onPath = applyAction(onPath, { kind: "right" }).state;
  onPath = applyAction(onPath, { kind: "cycle-forward" }).state;
  onPath = applyAction(onPath, { kind: "cycle-backward" }).state;
  onPath = applyAction(onPath, { kind: "left" }).state;
  onPath = applyAction(onPath, { kind: "hard-drop" }).state;
  assert.equal(onPath.witnessPathMatches, true);
  assert.equal(onPath.completedPieces, 1);
  assert.equal(applyAction(onPath, { kind: "hint" }).accepted, true);
});

test("Daily resolves to 60-piece finish or a recorded honest top-out", () => {
  let game = createGame({ mode: "daily", seed: "2026-10-05" });
  let guard = 0;
  while (!["finished", "lost"].includes(game.phase) && guard++ < 100_000) {
    if (game.phase === "falling") game = applyAction(game, { kind: "hard-drop" }).state;
    else game = advanceTicks(game, 1).state;
  }
  assert.ok(["finished", "lost"].includes(game.phase));
  if (game.phase === "finished") assert.equal(game.completedPieces, 60);
  else {
    assert.ok(game.completedPieces < 60);
    assert.ok(["top-out", "spawn-collision"].includes(game.reason));
  }
  assert.deepEqual(decodeGame(encodeGame(game)), game);
});

test("save parser rejects oversized replay budgets, noncanonical settings and malformed action payloads", () => {
  const game = createGame({ seed: "save-limits" });
  const tooManyTicks = JSON.parse(encodeGame(game));
  tooManyTicks.elapsedTicks = 600_001;
  assert.throws(() => decodeGame(JSON.stringify(tooManyTicks)), /replay limits/);
  const malformed = JSON.parse(encodeGame(game));
  malformed.actions = Array(10_001).fill({ tick: 0, ordinal: 0, action: { kind: "left" } });
  assert.throws(() => decodeGame(JSON.stringify(malformed)), /replay limits/);
  const extra = JSON.parse(encodeGame(game));
  extra.settings.unknown = true;
  assert.throws(() => decodeGame(JSON.stringify(extra)), /not canonical/);
  const payload = JSON.parse(encodeGame(applyAction(game, { kind: "left" }).state));
  payload.actions[0].action.x = 99;
  assert.throws(() => decodeGame(JSON.stringify(payload)), /recorded action fields/);
});

test("preset widths distinguish narrow, standard, wide and tall", () => {
  for (const [preset, width, height] of [
    ["compact", 5, 13],
    ["extraWide", 12, 13],
    ["narrow", 6, 13],
    ["standard", 8, 13],
    ["wide", 10, 13],
    ["tall", 8, 17],
  ]) {
    const game = createGame({ preset, seed: "preset-check" });
    assert.equal(game.settings.width, width);
    assert.equal(game.settings.height, height);
  }
  assert.equal(createGame({ seed: "default-check" }).settings.width, 8);
  const extra = applyAction(createGame({ preset: "extraWide", mode: "arcade", seed: "wide-replay" }), {
    kind: "hard-drop",
  }).state;
  assert.deepEqual(decodeGame(encodeGame(extra)), extra);
  assert.throws(() => createGame({ width: 17, height: 13 }), /5–16/);
  assert.equal(createGame({ mode: "daily", seed: "2026-10-05" }).settings.width, 6);
});
