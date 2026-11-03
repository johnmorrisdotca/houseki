import assert from "node:assert/strict";
import { test } from "vitest";
import { fallbackBoard } from "../dist/stone-collapse/engine.js";
import {
  advanceTicks,
  applyAction,
  createGame,
  decodeGame,
  encodeGame,
  legalActions,
  requestHint,
  restartGame,
  StoneCollapseOptionsError,
  statusOf,
} from "../dist/stone-collapse.js";
import { finishResolution, fixture, ids, oracleGroup, playGroup } from "./stone-collapse-helpers.mjs";

test("public presets, dimensions, colours, connected silhouettes, and custom-mask bounds validate", () => {
  for (const [preset, width, height] of [
    ["compact", 6, 8],
    ["standard", 8, 10],
    ["wide", 10, 8],
    ["tall", 6, 12],
  ]) {
    const game = createGame({ preset, seed: "bounds" });
    assert.equal(game.settings.width, width);
    assert.equal(game.settings.height, height);
    assert.equal(game.board.filter(Boolean).length, width * height);
  }
  for (const shape of ["heart", "star", "hexagon"]) {
    const game = createGame({ shape, seed: "shape" });
    assert.ok(game.board.filter(Boolean).length >= 16);
    assert.equal(game.settings.mask.length, game.board.length);
    assert.ok(game.settings.mask.every((active, i) => active === Boolean(game.board[i])));
  }
  assert.throws(() => createGame({ width: 3, height: 8 }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ width: 17, height: 8 }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ width: 12, height: 12, colourCount: 3 }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ width: 4, height: 4, mask: Array(15).fill(true) }), StoneCollapseOptionsError);
  assert.throws(
    () => createGame({ width: 4, height: 4, mask: [true, false, true, true, ...Array(12).fill(true)] }),
    StoneCollapseOptionsError,
  );
});

test("seeded setup is reproducible, IDs are unique, and fallback always contains a legal pair", () => {
  const a = createGame({ width: 4, height: 4, colourCount: 4, seed: 92 });
  const b = createGame({ width: 4, height: 4, colourCount: 4, seed: 92 });
  assert.deepEqual(a, b);
  assert.equal(new Set(a.board.filter(Boolean).map((stone) => stone.id)).size, 16);
  const fallback = fallbackBoard(Array(16).fill(true), 4, 4, 4);
  assert.ok(new Set(fallback.filter(Boolean).map((stone) => stone.id)).size === 16);
  assert.ok(fallback.some((stone, index) => stone && fallback[index + 1]?.colour === stone.colour));
  const maskedFallback = fallbackBoard([true, false, ...Array(14).fill(true)], 4, 4, 4);
  assert.deepEqual(
    maskedFallback.filter(Boolean).map((stone) => stone.id),
    Array.from({ length: 15 }, (_, i) => i + 1),
  );
});

test("diagonal contacts do not join; singleton rejection preserves exact state identity", () => {
  const state = fixture(["R...", ".R..", "....", "...."]);
  const singleton = applyAction(state, { kind: "select", stoneId: 1 });
  assert.equal(singleton.accepted, false);
  assert.equal(singleton.state, state);
  assert.equal(singleton.reason, "choose-two-or-more-connected-stones");
  assert.deepEqual(legalActions(state), []);
});

test("the worked rectangle fixture exposes marked, removed, and settled snapshots with left-column compression", () => {
  const start = fixture(["....", "....", "RB.G", "RBGG"]);
  const selected = applyAction(start, { kind: "select", stoneId: 2 });
  assert.equal(selected.state.previewScore, 10);
  const confirm = applyAction(selected.state, { kind: "confirm" });
  assert.equal(confirm.state.phase, "clear-mark");
  assert.deepEqual(ids(confirm.state.board), ids(start.board));
  assert.equal(confirm.state.score, 10);
  const mark = advanceTicks(confirm.state, 6);
  assert.equal(mark.state.phase, "clear-mark");
  assert.deepEqual(ids(mark.state.board), ids(start.board));
  const remove = advanceTicks(mark.state, 1);
  assert.equal(remove.state.phase, "clear-remove");
  assert.deepEqual(ids(remove.state.board), [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    1,
    null,
    null,
    3,
    4,
    null,
    6,
    7,
  ]);
  const gravity = advanceTicks(remove.state, 6);
  assert.equal(gravity.state.phase, "gravity");
  assert.deepEqual(ids(gravity.state.board), ids(remove.state.board));
  assert.deepEqual(ids(gravity.state.gravityBoard), [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    1,
    null,
    3,
    null,
    4,
    6,
    7,
    null,
  ]);
  const settled = advanceTicks(gravity.state, 9);
  assert.equal(settled.state.phase, "ready");
  assert.deepEqual(ids(settled.state.board), ids(gravity.state.gravityBoard));
  assert.equal(settled.state.moves, 1);
  assert.equal(settled.state.score, 10);
  assert.ok(settled.state.board.some((stone) => stone?.id === 6));
});

test("selection can change or cancel; blocked actions during resolution preserve reference identity", () => {
  const state = fixture(["RR..", "BB..", "....", "...."]);
  const selectedR = applyAction(state, { kind: "select", stoneId: 1 }).state;
  assert.equal(selectedR.previewScore, 10);
  const selectedB = applyAction(selectedR, { kind: "select", stoneId: 3 }).state;
  assert.equal(selectedB.previewScore, 10);
  assert.equal(selectedB.selectedId, 3);
  const cancelled = applyAction(selectedB, { kind: "cancel" });
  assert.equal(cancelled.accepted, true);
  assert.equal(cancelled.state.selectedId, null);
  const resolving = applyAction(selectedB, { kind: "confirm" }).state;
  const rejected = applyAction(resolving, { kind: "select", stoneId: 1 });
  assert.equal(rejected.accepted, false);
  assert.equal(rejected.state, resolving);
  assert.equal(legalActions(resolving).length, 0);
});

test("a second tap anywhere in the selected group confirms it; malformed action kinds reject unchanged", () => {
  const state = fixture(["RR..", "....", "....", "...."]);
  const selected = applyAction(state, { kind: "select", stoneId: 1 }).state;
  const confirmed = applyAction(selected, { kind: "select", stoneId: 2 });
  assert.equal(confirmed.accepted, true);
  assert.equal(confirmed.state.phase, "clear-mark");
  const invalid = applyAction(selected, { kind: "teleport" });
  assert.equal(invalid.accepted, false);
  assert.equal(invalid.state, selected);
  assert.equal(applyAction(state, { kind: "confirm" }).state, state);
});

test("group scoring is exact and the final clear receives its bonus once", () => {
  const pair = fixture(["RR..", "....", "....", "...."]);
  const won = finishResolution(playGroup(pair, 1));
  assert.equal(won.phase, "won");
  assert.equal(won.score, 1010);
  assert.equal(won.finishAdjustmentApplied, true);
  const queried = statusOf(won);
  assert.equal(queried.score, 1010);
  assert.equal(statusOf(won).score, 1010);
  assert.equal(applyAction(won, { kind: "confirm" }).state, won);
});

test("no-group ending applies remaining-stone penalty once and clamps score at zero", () => {
  const state = fixture(["RRBG", "GBGB", "BGBG", "GBGB"]);
  const finished = finishResolution(playGroup(state, 1));
  assert.equal(finished.phase, "finished");
  assert.equal(finished.removed, 2);
  assert.equal(finished.board.filter(Boolean).length, 14);
  assert.equal(finished.score, 0);
  assert.equal(finished.finishAdjustmentApplied, true);
  assert.equal(statusOf(finished).phase, "finished");
  assert.equal(statusOf(finished).score, 0);
});

test("masked gravity respects vertical segments and never compresses columns", () => {
  const mask = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
  mask[6] = false;
  const start = fixture(["RRB.", "....", "..G.", "...."], { mask });
  // The group is removed in columns 0–1; the gap at row 1, column 2 splits a fall segment.
  const removing = playGroup(start, 1);
  const gravity = advanceTicks(advanceTicks(removing, 7).state, 6).state;
  const settled = advanceTicks(gravity, 9).state;
  assert.equal(settled.board[2]?.id, 3);
  assert.equal(settled.board[14]?.id, 4);
  assert.equal(settled.board[10], null);
  assert.equal(settled.board[6], null);
});

test("500 seeded boards preserve IDs, mask occupancy, immutability, legal groups, and finite play", () => {
  for (let seed = 0; seed < 500; seed++) {
    let state = createGame({ width: 4 + (seed % 9), height: 4 + ((seed * 7) % 9), colourCount: 4 + (seed % 3), seed });
    const original = structuredClone(state);
    const seen = new Set();
    for (const stone of state.board.filter(Boolean)) {
      assert.ok(!seen.has(stone.id));
      seen.add(stone.id);
    }
    assert.deepEqual(state, original);
    for (let turn = 0; turn < 200 && state.phase === "ready"; turn++) {
      const actions = legalActions(state).filter((action) => action.kind === "select");
      const expected = state.board.flatMap((stone, index) =>
        stone && oracleGroup(state, index).length >= 2 ? [stone.id] : [],
      );
      assert.deepEqual(
        actions.map((action) => action.stoneId),
        expected,
      );
      if (!actions.length) break;
      const before = state;
      const selected = applyAction(state, actions[(seed + turn) % actions.length]);
      assert.equal(selected.accepted, true);
      const committed = applyAction(selected.state, { kind: "confirm" });
      assert.equal(committed.accepted, true);
      assert.deepEqual(before, state);
      const snapshot = structuredClone(committed.state);
      assert.deepEqual(committed.state, snapshot);
      state = finishResolution(committed.state);
      assert.equal(state.moves, before.moves + 1);
      const currentIds = state.board.filter(Boolean).map((stone) => stone.id);
      assert.equal(new Set(currentIds).size, currentIds.length);
      assert.ok(currentIds.every((id) => seen.has(id)));
      assert.ok(state.board.every((stone, i) => state.settings.mask[i] || stone === null));
      if (state.phase === "ready") assert.ok(legalActions(state).some((action) => action.kind === "select"));
    }
  }
});

test("Daily is canonical, host-dated, reproducible, and has no practice actions", () => {
  const date = "2026-10-05";
  const daily = createGame({ mode: "daily", dailyDate: date });
  assert.deepEqual(daily, createGame({ mode: "daily", dailyDate: date }));
  assert.equal(daily.settings.dailyDate, date);
  assert.equal(daily.settings.width, 8);
  assert.equal(daily.settings.height, 10);
  assert.equal(daily.settings.colourCount, 4);
  assert.notEqual(daily.settings.seed, createGame({ mode: "daily", dailyDate: "2026-10-06" }).settings.seed);
  assert.throws(() => createGame({ mode: "daily", dailyDate: "2026-02-30" }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ mode: "daily", dailyDate: date, width: 8 }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ mode: "daily", dailyDate: date, seed: "override" }), StoneCollapseOptionsError);
  assert.throws(() => createGame({ mode: "arcade", dailyDate: date }), StoneCollapseOptionsError);
  assert.ok(!legalActions(daily).some((action) => action.kind === "undo" || action.kind === "hint"));
  assert.equal(requestHint(daily).state, daily);
  const restarted = restartGame(daily);
  assert.equal(restarted.settings.dailyDate, date);
  assert.deepEqual(restarted.board, daily.board);
  assert.deepEqual(decodeGame(encodeGame(daily)), daily);
});
