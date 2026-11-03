import assert from "node:assert/strict";
import { test } from "vitest";
import { findMatches } from "../dist/gem-swap/board.js";
import { fallbackBoardForTest } from "../dist/gem-swap/engine.js";
import { planWave } from "../dist/gem-swap/specials.js";
import { advanceTicks, applyAction, createGame, GemSwapOptionsError, legalActions } from "../dist/gem-swap.js";
import { comboOracle, oracleMatches, ordinarySwapFixture, setup, specialSwapFixture } from "./gem-swap-helpers.mjs";

test("public settings reject malformed sizes, masks and unsupported fallback shapes", () => {
  assert.throws(() => createGame({ width: 3, height: 8 }), GemSwapOptionsError);
  assert.throws(() => createGame({ width: Number.MAX_SAFE_INTEGER, height: 8 }), GemSwapOptionsError);
  assert.throws(() => createGame({ seed: -1 }), GemSwapOptionsError);
  assert.throws(() => createGame({ seed: "s".repeat(257) }), GemSwapOptionsError);
  assert.throws(() => createGame({ unknown: true }), GemSwapOptionsError);
  assert.throws(() => createGame({ width: 4, height: 4, mask: Array(16).fill(false) }), GemSwapOptionsError);
});

test("standard fallback has a checked stable board and a pinned legal swap witness", () => {
  const generated = createGame({ seed: "fallback-fixture" });
  const board = fallbackBoardForTest(generated.settings);
  assert.deepEqual(oracleMatches(board, generated.settings), []);
  const state = { ...generated, board, nextId: 65 };
  const action = { kind: "swap", from: 27, to: 35 };
  assert.deepEqual(
    legalActions(state).find((move) => move.from === 27 && move.to === 35),
    action,
  );
  const independent = [...board];
  [independent[27], independent[35]] = [independent[35], independent[27]];
  assert.deepEqual(oracleMatches(independent, generated.settings), [34, 35, 36]);
  const applied = applyAction(state, action);
  assert.equal(applied.accepted, true);
  assert.deepEqual(applied.state.pendingCells, [34, 35, 36]);
});

test("phase durations and one large advance equal sequential ticks, including events", () => {
  const start = applyAction(ordinarySwapFixture(), { kind: "swap", from: 9, to: 15 }).state;
  const batched = advanceTicks(start, 23);
  let sequential = start;
  const events = [];
  for (let i = 0; i < 23; i++) {
    const result = advanceTicks(sequential, 1);
    sequential = result.state;
    events.push(...result.events);
  }
  assert.deepEqual(batched.state, sequential);
  assert.deepEqual(batched.events, events);
});

test("legal actions exclude identical swaps and malformed ready boards", () => {
  const state = ordinarySwapFixture();
  const board = [...state.board];
  board[1] = Object.freeze({ id: 3001, colour: board[0].colour });
  const invalid = { ...state, board: Object.freeze([...board]) };
  const unstableBoard = [...board];
  unstableBoard[2] = Object.freeze({ id: 3002, colour: "red" });
  const unstable = { ...state, board: Object.freeze(unstableBoard) };
  assert.ok(legalActions(invalid).every((move) => move.from !== 0 || move.to !== 1));
  assert.equal(legalActions(unstable).length, 0);
  assert.equal(applyAction(unstable, { kind: "swap", from: 0, to: 1 }).reason, "unstable-board");
});

test("all explicit special combinations resolve exact unique sets in both orders and around q", () => {
  const cases = [
    ["row-beam", "column-beam"],
    ["row-beam", "bomb"],
    ["bomb", "bomb"],
    ["colour-burst", null],
    ["colour-burst", "row-beam"],
    ["colour-burst", "column-beam"],
    ["colour-burst", "bomb"],
    ["colour-burst", "colour-burst"],
  ];
  for (const [firstKind, secondKind] of cases)
    for (const swapKinds of [false, true])
      for (const reverse of [false, true]) {
        const from = reverse ? 15 : 14;
        const to = reverse ? 14 : 15;
        const first = swapKinds ? secondKind : firstKind;
        const second = swapKinds ? firstKind : secondKind;
        const { state, action } = specialSwapFixture(first, second, from, to);
        assert.ok(
          legalActions(state).some((move) => move.from === Math.min(from, to) && move.to === Math.max(from, to)),
          `${firstKind}+${secondKind} was absent from legalActions`,
        );
        const result = applyAction(state, action);
        assert.equal(result.accepted, true, `${firstKind}+${secondKind}, reverse=${reverse}`);
        assert.deepEqual(
          result.state.pendingCells,
          comboOracle(result.state, action),
          `${firstKind}+${secondKind}, reverse=${reverse}`,
        );
        assert.ok(result.events.some((event) => event.type === "special-combination" && event.centre === to));
        const pairIds = new Set([state.board[from].id, state.board[to].id]);
        assert.ok(
          result.events.filter((event) => event.type === "special-activated").every((event) => !pairIds.has(event.id)),
        );
        const removed = advanceTicks(result.state, 7).state;
        assert.equal(removed.score, result.state.pendingCells.length * 10);
        assert.ok(result.state.pendingCells.every((cell) => removed.board[cell] === null));
      }
});

test("bomb pair clips at the edge, and blast geometry skips masked cells", () => {
  const corner = specialSwapFixture("bomb", "bomb", 1, 0);
  const edge = applyAction(corner.state, corner.action);
  assert.equal(edge.accepted, true);
  assert.equal(edge.state.pendingCells.length, 9);
  const middle = specialSwapFixture("bomb", "bomb", 26, 27);
  assert.equal(applyAction(middle.state, middle.action).state.pendingCells.length, 25);
  const { width, height, mask } = createGame({ shape: "heart", seed: 14 }).settings;
  let candidate = null;
  for (let seed = 0; seed < 100 && !candidate; seed++) {
    const base = createGame({ shape: "heart", seed });
    for (let from = 0; from < base.board.length && !candidate; from++)
      if (base.board[from]) {
        for (const to of [from + 1, from + base.settings.width]) {
          if (!base.settings.mask[to] || !base.board[to]) continue;
          const changed = [...base.board];
          [changed[from], changed[to]] = [changed[to], changed[from]];
          const centre = to;
          const cx = centre % base.settings.width;
          const cy = Math.floor(centre / base.settings.width);
          if (
            findMatches(changed, base.settings).length ||
            !base.settings.mask.some(
              (active, i) =>
                !active &&
                Math.abs((i % base.settings.width) - cx) <= 1 &&
                Math.abs(Math.floor(i / base.settings.width) - cy) <= 1,
            )
          )
            continue;
          const board = [...base.board];
          board[from] = Object.freeze({ ...board[from], kind: "bomb" });
          board[to] = Object.freeze({ ...board[to], kind: "bomb" });
          candidate = { state: { ...base, board: Object.freeze(board) }, action: { kind: "swap", from, to } };
          break;
        }
      }
  }
  assert.ok(candidate, `found a clipped mask fixture within ${width}×${height}`);
  const blast = applyAction(candidate.state, candidate.action);
  assert.equal(blast.accepted, true);
  assert.deepEqual(blast.state.pendingCells, comboOracle(blast.state, candidate.action));
  assert.ok(blast.state.pendingCells.every((cell) => mask[cell]));
});

test("natural four-run creates a protected anchor with q precedence and exact removal score", () => {
  const base = setup();
  const board = [...base.board];
  const set = (index, colour, kind) => {
    board[index] = Object.freeze({ id: board[index].id, colour, ...(kind ? { kind } : {}) });
  };
  set(14, "green");
  set(15, "red");
  set(16, "red");
  set(8, "red");
  const state = { ...base, board: Object.freeze(board) };
  const action = { kind: "swap", from: 8, to: 14 };
  const accepted = applyAction(state, action);
  assert.equal(accepted.accepted, true);
  assert.deepEqual(accepted.state.pendingSpecials, [{ cell: 14, kind: "row-beam" }]);
  assert.deepEqual(accepted.state.pendingCells, [13, 15, 16]);
  const anchorId = accepted.state.board[14].id;
  const removed = advanceTicks(accepted.state, 7);
  assert.equal(removed.state.score, 30);
  assert.equal(removed.state.board[14].id, anchorId);
  assert.equal(removed.state.board[14].kind, "row-beam");
  assert.ok(
    removed.events.some((event) => event.type === "special-created" && event.cell === 14 && event.id === anchorId),
  );
});

test("standard beam combo scores the 15-cell row/column union for 150 points", () => {
  const fixture = specialSwapFixture("row-beam", "column-beam", 26, 27);
  const result = applyAction(fixture.state, fixture.action);
  assert.equal(result.accepted, true);
  assert.equal(result.state.pendingCells.length, 15);
  assert.equal(advanceTicks(result.state, 7).state.score, 150);
});

test("match components prioritize five-runs, T intersections and stable anchor ties", () => {
  const base = setup();
  const make = (cells) => {
    const board = [...base.board];
    for (const cell of cells) board[cell] = Object.freeze({ id: board[cell].id, colour: "red" });
    return { ...base, board: Object.freeze(board) };
  };
  const tCells = [13, 14, 15, 8, 20];
  const t = make(tCells);
  const tPlan = planWave(t, findMatches(t.board, t.settings), 13, 14);
  assert.deepEqual(tPlan.specials, [{ cell: 14, kind: "bomb" }]);
  const fiveCross = make([12, 13, 14, 15, 16, 8, 20]);
  const burst = planWave(fiveCross, findMatches(fiveCross.board, fiveCross.settings), 12, 15);
  assert.deepEqual(burst.specials, [{ cell: 15, kind: "colour-burst" }]);
  const tiedLongRuns = make([12, 13, 14, 15, 16, 2, 8, 20, 26]);
  const selectedRun = planWave(tiedLongRuns, findMatches(tiedLongRuns.board, tiedLongRuns.settings), null, 12);
  assert.deepEqual(selectedRun.specials, [{ cell: 12, kind: "colour-burst" }]);
  const fiveTie = make([12, 13, 14, 15, 16]);
  const geometric = planWave(fiveTie, findMatches(fiveTie.board, fiveTie.settings), null, null);
  assert.deepEqual(geometric.specials, [{ cell: 12, kind: "colour-burst" }]);
  const preferredSource = planWave(fiveTie, findMatches(fiveTie.board, fiveTie.settings), 15, 17);
  assert.deepEqual(preferredSource.specials, [{ cell: 15, kind: "colour-burst" }]);
  const ineligible = make([13, 14, 15, 8, 20]);
  const marked = [...ineligible.board];
  marked[14] = Object.freeze({ ...marked[14], kind: "bomb" });
  const noAnchor = planWave(
    { ...ineligible, board: Object.freeze(marked) },
    findMatches(marked, ineligible.settings),
    13,
    14,
  );
  assert.deepEqual(noAnchor.specials, []);
  const fiveMarked = [...fiveTie.board];
  fiveMarked[14] = Object.freeze({ ...fiveMarked[14], kind: "bomb" });
  const fallbackAnchor = planWave(
    { ...fiveTie, board: Object.freeze(fiveMarked) },
    findMatches(fiveMarked, fiveTie.settings),
    13,
    14,
  );
  assert.deepEqual(fallbackAnchor.specials, [{ cell: 13, kind: "colour-burst" }]);
  const vertical = make([8, 14, 20, 26]);
  assert.deepEqual(planWave(vertical, findMatches(vertical.board, vertical.settings), null, null).specials, [
    { cell: 26, kind: "column-beam" },
  ]);
  const twoComponents = make([7, 8, 9, 10, 25, 26, 27, 28]);
  assert.deepEqual(
    planWave(twoComponents, findMatches(twoComponents.board, twoComponents.settings), null, null).specials,
    [
      { cell: 7, kind: "row-beam" },
      { cell: 25, kind: "row-beam" },
    ],
  );
});

test("matched specials expand once to a fixed point and protected fresh anchors survive overlap", () => {
  const base = setup();
  const board = [...base.board];
  const set = (index, colour, kind) => {
    board[index] = Object.freeze({ id: board[index].id, colour, ...(kind ? { kind } : {}) });
  };
  set(13, "red", "row-beam");
  set(12, board[12].colour, "bomb");
  set(7, board[7].colour, "column-beam");
  set(14, "green");
  set(15, "red");
  set(16, "red");
  set(8, "red");
  const state = { ...base, board: Object.freeze(board) };
  const result = applyAction(state, { kind: "swap", from: 8, to: 14 });
  assert.equal(result.accepted, true);
  const activations = result.events.filter((event) => event.type === "special-activated");
  assert.deepEqual(
    activations.map((event) => event.cell),
    [7, 12, 13],
  );
  assert.equal(new Set(activations.map((event) => event.id)).size, 3);
  assert.deepEqual(result.state.pendingSpecials, [{ cell: 14, kind: "row-beam" }]);
  assert.ok(!result.state.pendingCells.includes(14));
  const materialized = advanceTicks(result.state, 7).state;
  assert.equal(materialized.board[14].kind, "row-beam");
});

test("a line special swapped into an ordinary match activates through the natural run", () => {
  const state = ordinarySwapFixture();
  const board = [...state.board];
  board[9] = Object.freeze({ ...board[9], kind: "row-beam" });
  const ready = { ...state, board: Object.freeze(board) };
  const action = { kind: "swap", from: 9, to: 15 };
  assert.ok(legalActions(ready).some((move) => move.from === action.from && move.to === action.to));
  const result = applyAction(ready, action);
  assert.equal(result.accepted, true);
  assert.deepEqual(result.state.pendingCells, [12, 13, 14, 15, 16, 17]);
  assert.equal(
    result.events.filter((event) => event.type === "special-activated" && event.id === board[9].id).length,
    1,
  );
});

test("a natural colour-burst activation clears its stored colour and scores the unique union", () => {
  const state = ordinarySwapFixture();
  const board = [...state.board];
  board[14] = Object.freeze({ ...board[14], kind: "colour-burst", colour: "red" });
  const burstState = { ...state, board: Object.freeze(board) };
  const result = applyAction(burstState, { kind: "swap", from: 9, to: 15 });
  assert.equal(result.accepted, true);
  assert.ok(result.state.pendingCells.includes(0));
  const expected = result.state.board
    .flatMap((gem, index) => (gem?.colour === "red" ? [index] : []))
    .sort((a, b) => a - b);
  assert.deepEqual(result.state.pendingCells, expected);
  assert.equal(advanceTicks(result.state, 7).state.score, expected.length * 10);
});

test("burst conversions replace an existing same-colour special power", () => {
  const fixture = specialSwapFixture("colour-burst", "row-beam");
  const before = fixture.state;
  const action = fixture.action;
  const afterSwap = [...before.board];
  [afterSwap[action.from], afterSwap[action.to]] = [afterSwap[action.to], afterSwap[action.from]];
  const beam = afterSwap[action.from].kind === "row-beam" ? afterSwap[action.from] : afterSwap[action.to];
  const index = afterSwap.findIndex(
    (gem, cell) => cell !== action.from && cell !== action.to && gem.colour === beam.colour,
  );
  assert.ok(index >= 0);
  afterSwap[index] = Object.freeze({ ...afterSwap[index], kind: "bomb" });
  const state = { ...before, board: Object.freeze([...before.board]) };
  const decorated = [...state.board];
  decorated[index] = Object.freeze({ ...decorated[index], kind: "bomb" });
  const result = applyAction({ ...state, board: Object.freeze(decorated) }, action);
  assert.equal(result.accepted, true);
  const convertedId = decorated[index].id;
  const activation = result.events.find((event) => event.type === "special-activated" && event.id === convertedId);
  assert.equal(activation.kind, "row-beam");
  assert.ok(
    !result.events.some(
      (event) => event.type === "special-activated" && event.id === convertedId && event.kind === "bomb",
    ),
  );
  const swappedBoard = [...decorated];
  [swappedBoard[action.from], swappedBoard[action.to]] = [swappedBoard[action.to], swappedBoard[action.from]];
  const overlapping = planWave({ ...state, board: Object.freeze(swappedBoard) }, [index], action.from, action.to);
  const overlapActivation = overlapping.events.find(
    (event) => event.type === "special-activated" && event.id === convertedId,
  );
  assert.equal(overlapActivation.kind, "row-beam");
});

test("special clears refill with ordinary gems and score the next natural wave at multiplier two", () => {
  const state = ordinarySwapFixture(1);
  const board = [...state.board];
  board[14] = Object.freeze({ ...board[14], kind: "colour-burst", colour: "red" });
  const result = applyAction({ ...state, board: Object.freeze(board) }, { kind: "swap", from: 9, to: 15 });
  assert.equal(result.accepted, true);
  assert.ok(result.state.pendingCells.length > 3);
  const resolved = advanceTicks(result.state, 23);
  assert.equal(resolved.state.phase, "clear-mark");
  assert.equal(resolved.state.wave, 2);
  const refilledIds = resolved.events.filter((event) => event.type === "gem-refilled").map((event) => event.id);
  assert.ok(refilledIds.length > 0);
  for (const id of refilledIds) assert.equal(resolved.state.board.find((gem) => gem?.id === id).kind, undefined);
  const firstScore = result.state.pendingCells.length * 10;
  assert.equal(resolved.state.score, firstScore);
  const secondClear = advanceTicks(resolved.state, 7).state;
  assert.equal(secondClear.score, firstScore + resolved.state.pendingCells.length * 20);
});
