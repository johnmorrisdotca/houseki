import assert from "node:assert/strict";
import { test } from "vitest";
import { findMatches } from "../dist/gem-swap/board.js";
import { advanceTicks, applyAction, createGame, legalActions, statusOf } from "../dist/gem-swap.js";
import { ordinarySwapFixture, setup } from "./gem-swap-helpers.mjs";

test("default and compact presets are deterministic, stable and have a witnessed legal swap", () => {
  for (const options of [{}, { preset: "compact" }, { preset: "wide" }, { preset: "tall" }]) {
    const a = createGame({ ...options, seed: "repeatable" });
    const b = createGame({ ...options, seed: "repeatable" });
    assert.deepEqual(a, b);
    assert.equal(a.board.length, a.settings.width * a.settings.height);
    assert.equal(findMatches(a.board, a.settings).length, 0);
    assert.ok(legalActions(a).length > 0);
    const ids = a.board.filter(Boolean).map((gem) => gem.id);
    assert.equal(new Set(ids).size, ids.length);
  }
  const standard = createGame();
  assert.equal(standard.settings.width, 8);
  assert.equal(standard.settings.height, 8);
  assert.equal(standard.settings.colourCount, 5);
  for (const shape of ["heart", "star", "hexagon"]) {
    const masked = createGame({ shape, seed: 3 });
    assert.ok(masked.settings.mask.some((value) => !value));
    assert.equal(findMatches(masked.board, masked.settings).length, 0);
    assert.ok(legalActions(masked).length > 0);
    assert.equal(masked.usedFallback, false);
  }
});

test("swap acceptance, 30-point first wave, visible holes, gravity and refill phases", () => {
  const before = ordinarySwapFixture();
  const action = { kind: "swap", from: 9, to: 15 };
  assert.ok(legalActions(before).some((item) => item.from === action.from && item.to === action.to));
  const accepted = applyAction(before, action);
  assert.equal(accepted.accepted, true);
  assert.equal(accepted.state.phase, "clear-mark");
  assert.equal(accepted.state.moves, 1);
  assert.equal(accepted.state.score, 0);
  assert.deepEqual(accepted.state.pendingCells, [14, 15, 16]);
  const marked = accepted.state;
  const marking = advanceTicks(marked, 6).state;
  assert.equal(marking.phase, "clear-mark");
  assert.equal(marking.resolutionTick, 6);
  assert.ok(marking.board[14]);
  assert.equal(marking.score, 0);
  const removed = advanceTicks(marking, 1).state;
  assert.equal(removed.phase, "clear-remove");
  assert.deepEqual(
    [14, 15, 16].map((i) => removed.board[i]),
    [null, null, null],
  );
  assert.equal(removed.score, 30);
  const removal = advanceTicks(removed, 5).state;
  assert.equal(removal.phase, "clear-remove");
  assert.equal(removal.resolutionTick, 5);
  const falling = advanceTicks(removal, 1).state;
  assert.equal(falling.phase, "gravity");
  assert.ok(falling.gravityBoard);
  assert.deepEqual(
    [14, 15, 16].map((i) => falling.board[i]),
    [null, null, null],
  );
  const dropping = advanceTicks(falling, 8).state;
  assert.equal(dropping.phase, "gravity");
  assert.equal(dropping.resolutionTick, 8);
  const settled = advanceTicks(dropping, 1).state;
  assert.equal(settled.phase, "refill");
  assert.equal(settled.board.filter(Boolean).length, 33);
  const refilled = advanceTicks(settled, 1);
  assert.ok(refilled.events.some((event) => event.type === "gem-refilled"));
  assert.equal(refilled.state.board.filter(Boolean).length, 36);
  assert.ok(["ready", "clear-mark", "finished"].includes(refilled.state.phase));
});

test("invalid and identical-colour swaps preserve the exact state and random stream", () => {
  const state = ordinarySwapFixture();
  for (const action of [
    { kind: "swap", from: 0, to: 35 },
    { kind: "swap", from: 0, to: 1 },
    { kind: "swap", from: 0, to: 0 },
    { kind: "swap", from: -1, to: 0 },
  ]) {
    const result = applyAction(state, action);
    assert.equal(result.accepted, false);
    assert.equal(result.state, state);
    assert.equal(result.state.randomState, state.randomState);
    assert.equal(result.state.moves, state.moves);
  }
  const during = applyAction(state, { kind: "swap", from: 9, to: 15 }).state;
  const rejectedDuringResolution = applyAction(during, { kind: "swap", from: 0, to: 1 });
  assert.equal(rejectedDuringResolution.accepted, false);
  assert.equal(rejectedDuringResolution.state, during);
  const identicalBoard = [...state.board];
  identicalBoard[1] = Object.freeze({ id: 3000, colour: identicalBoard[0].colour });
  const identicalState = { ...state, board: Object.freeze(identicalBoard) };
  assert.equal(applyAction(identicalState, { kind: "swap", from: 0, to: 1 }).reason, "identical-gems");
  assert.equal(applyAction(state, { kind: "swap", from: 0, to: 1, extra: true }).state, state);
});

test("all matches in intersecting rows and columns form one unique union", () => {
  const base = setup();
  const board = [...base.board];
  for (const index of [2 * 6 + 1, 2 * 6 + 2, 2 * 6 + 3, 2 * 6 + 4, 1 * 6 + 2, 3 * 6 + 2, 4 * 6 + 2])
    board[index] = Object.freeze({ id: index + 1, colour: "red" });
  const expected = [8, 13, 14, 15, 16, 20, 26];
  assert.deepEqual(findMatches(board, base.settings), expected);
  assert.equal(new Set(findMatches(board, base.settings)).size, 7);
});

test("masked gravity keeps independent vertical segments and refill order is deterministic", () => {
  const width = 6;
  const height = 6;
  const mask = Array(width * height).fill(true);
  mask[2 * width + 2] = false;
  let state = setup(width, height, mask);
  const board = [...state.board];
  board[1 * width + 2] = null;
  board[4 * width + 2] = null;
  state = {
    ...state,
    phase: "clear-remove",
    board: Object.freeze(board),
    pendingCells: Object.freeze([8, 26]),
    score: 0,
    wave: 1,
  };
  const gravity = advanceTicks(state, 6).state;
  assert.equal(gravity.phase, "gravity");
  assert.equal(gravity.gravityBoard[1 * width + 2].id, state.board[0 * width + 2].id);
  assert.equal(gravity.gravityBoard[4 * width + 2].id, state.board[3 * width + 2].id);
  const refillPhase = advanceTicks(gravity, 9).state;
  const filled = advanceTicks(refillPhase, 1);
  const draws = filled.events.filter((event) => event.type === "gem-refilled");
  const orderKey = (index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    let start = y;
    while (start > 0 && mask[(start - 1) * width + x]) start--;
    return [x, start, -y];
  };
  assert.deepEqual(
    draws.map((event) => event.cell),
    [...draws.map((event) => event.cell)].sort((a, b) => {
      const ka = orderKey(a);
      const kb = orderKey(b);
      return ka[0] - kb[0] || ka[1] - kb[1] || ka[2] - kb[2];
    }),
  );
  assert.equal(
    new Set(filled.state.board.filter(Boolean).map((gem) => gem.id)).size,
    filled.state.board.filter(Boolean).length,
  );
});

test("500 seeded starts satisfy an independent matcher and legal-action oracle", () => {
  for (let seed = 0; seed < 500; seed++) {
    const state = createGame({ seed });
    const independentMatches = [];
    const { width, height, mask } = state.settings;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        if (!mask[index] || !state.board[index]) continue;
        for (const [dx, dy] of [
          [1, 0],
          [0, 1],
        ]) {
          let end = 1;
          while (
            x + dx * end < width &&
            y + dy * end < height &&
            mask[(y + dy * end) * width + x + dx * end] &&
            state.board[(y + dy * end) * width + x + dx * end]?.colour === state.board[index].colour
          )
            end++;
          if (end >= 3) independentMatches.push(index);
        }
      }
    assert.deepEqual(independentMatches, []);
    const oracle = [];
    for (let from = 0; from < state.board.length; from++)
      for (const to of [
        (from % width) + 1 < width ? from + 1 : -1,
        Math.floor(from / width) + 1 < height ? from + width : -1,
      ]) {
        if (to < 0 || !state.board[from] || !state.board[to] || !mask[to]) continue;
        const changed = [...state.board];
        [changed[from], changed[to]] = [changed[to], changed[from]];
        const match = changed.some((gem, i) => {
          if (!gem) return false;
          const x = i % width;
          const y = Math.floor(i / width);
          return [
            [1, 0],
            [0, 1],
          ].some(([dx, dy]) => {
            let length = 1;
            for (const sign of [-1, 1])
              for (let step = 1; step < 3; step++) {
                const nx = x + dx * step * sign;
                const ny = y + dy * step * sign;
                if (
                  nx < 0 ||
                  nx >= width ||
                  ny < 0 ||
                  ny >= height ||
                  !mask[ny * width + nx] ||
                  changed[ny * width + nx]?.colour !== gem.colour
                )
                  break;
                length++;
              }
            return length >= 3;
          });
        });
        if (match) oracle.push({ kind: "swap", from, to });
      }
    assert.deepEqual(
      legalActions(state).filter((action) => action.kind === "swap"),
      oracle,
      `seed ${seed}`,
    );
    assert.equal(statusOf(state).legalMoveCount, oracle.length);
  }
});
