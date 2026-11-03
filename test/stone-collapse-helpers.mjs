import assert from "node:assert/strict";
import { advanceTicks, applyAction, createChallenge, createGame } from "../dist/stone-collapse.js";

export const colour = { R: "red", B: "blue", G: "green", Y: "gold", P: "purple", T: "teal" };
// Fixture-only constructor: hand-built boards exercise positions the seeded public generator rarely emits.
export function fixture(rows, { mask, width = rows[0].length, height = rows.length, tools = false } = {}) {
  const state = createGame({ width, height, seed: "fixture", tools });
  const active = mask ?? Array(width * height).fill(true);
  let id = 1;
  const board = rows
    .join("")
    .split("")
    .map((token, index) => {
      if (!active[index] || token === ".") return null;
      return Object.freeze({ id: id++, colour: colour[token] });
    });
  return Object.freeze({
    ...state,
    settings: Object.freeze({ ...state.settings, mask: Object.freeze([...active]) }),
    board: Object.freeze(board),
    nextId: id,
    phase: "ready",
    selectedId: null,
    selectedIds: Object.freeze([]),
    previewScore: 0,
    score: 0,
    moves: 0,
    removed: 0,
    resolutionTick: 0,
    pendingIds: Object.freeze([]),
    gravityBoard: null,
    finishAdjustmentApplied: false,
    recording: Object.freeze([]),
  });
}
export function playGroup(state, stoneId) {
  const selected = applyAction(state, { kind: "select", stoneId });
  assert.equal(selected.accepted, true);
  const committed = applyAction(selected.state, { kind: "confirm" });
  assert.equal(committed.accepted, true);
  return committed.state;
}
export function finishResolution(state) {
  return advanceTicks(advanceTicks(advanceTicks(state, 7).state, 6).state, 9).state;
}
export function selectAndConfirm(state, stoneId) {
  const selected = applyAction(state, { kind: "select", stoneId });
  assert.equal(selected.accepted, true, selected.reason);
  const committed = applyAction(selected.state, { kind: "confirm" });
  assert.equal(committed.accepted, true, committed.reason);
  return committed.state;
}
export function targetAndConfirmTool(state, tool, cell) {
  let current = state;
  current = applyAction(current, { kind: "select-tool", tool }).state;
  current = applyAction(current, { kind: "target-tool", cell }).state;
  return applyAction(current, { kind: "confirm-tool" }).state;
}
export function challenge(board, goal, witness, moveLimit) {
  return createChallenge({
    id: "test.challenge",
    width: 4,
    height: 4,
    colourCount: 4,
    initialBoard: board,
    goal,
    witness,
    ...(moveLimit ? { moveLimit } : {}),
  });
}
export const challengeBoard = [
  ["R", "R", "B", "B"],
  ["G", "Y", "R", "B"],
  ["R", "B", "G", "Y"],
  ["G", "Y", "R", "B"],
].flatMap((row, y) => row.map((c, x) => ({ id: 1 + y * 4 + x, colour: colour[c] })));
export function ids(board) {
  return board.map((stone) => stone?.id ?? null);
}
export function oracleGroup(state, startIndex) {
  const seed = state.board[startIndex];
  if (!seed) return [];
  const pending = [startIndex];
  const seen = new Set(pending);
  while (pending.length) {
    const at = pending.pop();
    const x = at % state.settings.width;
    const y = Math.floor(at / state.settings.width);
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= state.settings.width || ny >= state.settings.height) continue;
      const next = ny * state.settings.width + nx;
      const stone = state.board[next];
      if (state.settings.mask[next] && stone?.colour === seed.colour && !seen.has(next)) {
        seen.add(next);
        pending.push(next);
      }
    }
  }
  return [...seen];
}
