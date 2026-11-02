import assert from "node:assert/strict";
import { test } from "vitest";
import {
  applyAction,
  BOARD_SIDE,
  canPlace,
  createChallenge,
  createGame,
  createLevel,
  createTutorial,
  decodeGame,
  encodeGame,
  getLevel,
  getTutorial,
  legalActions,
  levelManifest,
  restartGame,
  statusOf,
  tutorialManifest,
} from "../src/tsumiki.ts";

const cell = (row, column) => row * BOARD_SIDE + column;
const placeAt = (state, slot, row, column) => applyAction(state, { kind: "place", slot, row, column });

/** A game whose tray is what the test says, on a board the test fills: the engine reads both from the state it is given. */
const withTray = (state, tray, filled = []) => {
  const board = [...state.board];
  for (const each of filled) board[each] = { id: 1000 + each, colour: "red", stone: false };
  return { ...state, board, tray };
};
const piece = (...cells) => ({ shape: "test", colour: "blue", cells });
const dot = piece([0, 0]);

test("a piece goes only where every one of its cells is free and on the board, and a refused move changes nothing", () => {
  const game = withTray(createGame({ seed: "a" }), [piece([0, 0], [0, 1]), dot, dot], [cell(3, 3)]);
  assert.equal(canPlace(game, 0, 0, 0), true);
  assert.equal(canPlace(game, 0, 0, BOARD_SIDE - 1), false, "off the right edge");
  assert.equal(canPlace(game, 0, 3, 2), false, "onto a filled cell");
  const refused = placeAt(game, 0, 3, 3);
  assert.equal(refused.accepted, false);
  assert.equal(refused.state, game);
  assert.equal(placeAt(game, 9, 0, 0).accepted, false, "no such slot");
});

test("a full row clears, and so does a full column, both at once, a block in both counted once", () => {
  const row = Array.from({ length: BOARD_SIDE - 1 }, (_, column) => cell(2, column));
  const column = Array.from({ length: BOARD_SIDE }, (_, down) => cell(down, BOARD_SIDE - 1)).filter(
    (each) => each !== cell(2, BOARD_SIDE - 1),
  );
  const game = withTray(createGame({ seed: "b" }), [dot, dot, dot], [...row, ...column]);
  const { state, events } = placeAt(game, 0, 2, BOARD_SIDE - 1);
  assert.equal(state.lines, 2);
  assert.ok(
    state.board.every((block) => block === null),
    "both lines left the board",
  );
  const lines = events.find((event) => event.kind === "lines");
  assert.deepEqual(lines.rows, [2]);
  assert.deepEqual(lines.columns, [BOARD_SIDE - 1]);
  // One cell laid, ten times two lines times two lines: clearing together is worth far more than clearing apart.
  assert.equal(state.score, 41);
});

test("a line cleared alone is worth less than two together, and a run of clears earns more", () => {
  const row = Array.from({ length: BOARD_SIDE - 1 }, (_, column) => cell(0, column));
  const game = withTray(createGame({ seed: "c" }), [dot, dot, dot], row);
  const first = placeAt(game, 0, 0, BOARD_SIDE - 1).state;
  assert.equal(first.score, 11);
  assert.equal(first.streak, 1);
  const again = withTray(
    first,
    [null, dot, dot],
    Array.from({ length: BOARD_SIDE - 1 }, (_, column) => cell(1, column)),
  );
  const second = placeAt(again, 1, 1, BOARD_SIDE - 1).state;
  assert.equal(second.score, 11 + 11 + 5);
  assert.equal(second.streak, 2);
  const none = placeAt(second, 2, 4, 4).state;
  assert.equal(none.streak, 0, "a placement that clears nothing ends the run");
});

test("the tray fills again only when it is empty", () => {
  const game = createGame({ seed: "d" });
  const one = applyAction(
    game,
    legalActions(game).find((action) => action.slot === 0),
  ).state;
  assert.equal(one.tray[0], null);
  assert.ok(one.tray[1] !== null && one.tray[2] !== null);
  const two = applyAction(
    one,
    legalActions(one).find((action) => action.slot === 1),
  ).state;
  const three = applyAction(
    two,
    legalActions(two).find((action) => action.slot === 2),
  ).state;
  assert.ok(
    three.tray.every((each) => each !== null),
    "three more came",
  );
});

test("a free game finishes, and a challenge is lost, when nothing in the tray will fit", () => {
  // Holes on every fourth diagonal: two in each row and column, so laying one fills no line, and none beside another, so a piece of two has nowhere to go.
  const full = Array.from({ length: BOARD_SIDE * BOARD_SIDE }, (_, each) => each).filter(
    (each) => (Math.floor(each / BOARD_SIDE) + (each % BOARD_SIDE)) % 4 !== 0,
  );
  const big = piece([0, 0], [0, 1]);
  const free = placeAt(withTray(createGame({ seed: "e" }), [dot, big, null], full), 0, 0, 0).state;
  assert.equal(free.phase, "finished");
  const challenge = placeAt(
    withTray(createChallenge({ id: "x", seed: "e", goal: { kind: "score", target: 9999 } }), [dot, big, null], full),
    0,
    0,
    0,
  ).state;
  assert.equal(challenge.phase, "lost");
  assert.deepEqual(legalActions(challenge), []);
});

test("each kind of goal wins as soon as it is met", () => {
  const lines = withTray(
    createChallenge({ id: "l", seed: "f", goal: { kind: "lines", target: 1 } }),
    [dot, dot, dot],
    Array.from({ length: BOARD_SIDE - 1 }, (_, column) => cell(0, column)),
  );
  assert.equal(placeAt(lines, 0, 0, BOARD_SIDE - 1).state.phase, "won");
  const score = createChallenge({ id: "s", seed: "f", goal: { kind: "score", target: 1 } });
  assert.equal(applyAction(score, legalActions(score)[0]).state.phase, "won");
  const stone = createChallenge({ id: "c", seed: "f", goal: { kind: "clear-stones" }, stones: [cell(0, 0)] });
  assert.equal(statusOf(stone).stonesLeft, 1);
  assert.equal(statusOf(stone).goalTotal, 1);
  const filled = withTray(
    stone,
    [dot, dot, dot],
    Array.from({ length: BOARD_SIDE - 2 }, (_, column) => cell(0, column + 1)),
  );
  const won = placeAt(filled, 0, 0, BOARD_SIDE - 1).state;
  assert.equal(won.phase, "won");
  assert.equal(statusOf(won).goalDone, 1);
});

test("one seed is one game, a Daily is its date, and nothing given to a move is changed", () => {
  assert.deepEqual(createGame({ seed: "g" }).tray, createGame({ seed: "g" }).tray);
  assert.notDeepEqual(createGame({ seed: "g" }).tray, createGame({ seed: "h" }).tray);
  assert.deepEqual(
    createGame({ mode: "daily", dailyDate: "2026-10-30" }).tray,
    createGame({ mode: "daily", dailyDate: "2026-10-30" }).tray,
  );
  assert.notDeepEqual(
    createGame({ mode: "daily", dailyDate: "2026-10-30" }).tray,
    createGame({ mode: "daily", dailyDate: "2026-10-31" }).tray,
  );
  const game = createGame({ seed: "g" });
  const before = JSON.stringify(game);
  applyAction(game, legalActions(game)[0]);
  assert.equal(JSON.stringify(game), before);
});

test("a save is played again from its moves, so it cannot claim what they do not do", () => {
  let game = createGame({ seed: "i" });
  for (let at = 0; at < 8; at += 1) game = applyAction(game, legalActions(game)[0]).state;
  const text = encodeGame(game);
  assert.deepEqual(decodeGame(text), game);
  const save = JSON.parse(text);
  save.moves[0] = [0, 99, 99];
  assert.throws(() => decodeGame(JSON.stringify(save)));
  assert.throws(() => decodeGame("not a save"));
  assert.throws(() => decodeGame(JSON.stringify({ v: 1, game: "other", settings: game.settings, moves: [] })));
  assert.deepEqual(restartGame(game).tray, createGame({ seed: "i" }).tray);
  assert.equal(restartGame(game).moves, 0);
});

test("every level is won by its recorded moves, through the engine and through a save", () => {
  assert.equal(levelManifest.length, 64);
  for (const level of levelManifest) {
    let state = createLevel(level.id);
    assert.equal(state.settings.goal.kind, level.goal.kind);
    for (const [slot, row, column] of level.witness) {
      const result = placeAt(state, slot, row, column);
      assert.equal(result.accepted, true, `${level.id}: a recorded move was refused`);
      state = result.state;
    }
    assert.equal(state.phase, "won", level.id);
    assert.equal(decodeGame(encodeGame(state)).phase, "won", level.id);
    assert.ok(level.marks >= 1 && level.marks <= 5, level.id);
    assert.ok(level.title.en.length > 0 && level.title.ja.length > 0, level.id);
  }
  const marks = levelManifest.map((level) => level.marks);
  assert.deepEqual(
    [...marks].sort((a, b) => a - b),
    marks,
    "levels are ordered easiest first",
  );
  assert.equal(getLevel(1), levelManifest[0]);
  assert.equal(getLevel("nope"), null);
});

test("every lesson is won by its recorded moves, and says what it teaches in both languages", () => {
  assert.equal(tutorialManifest.length, 3);
  for (const lesson of tutorialManifest) {
    let state = createTutorial(lesson.id);
    for (const [slot, row, column] of lesson.witness) state = placeAt(state, slot, row, column).state;
    assert.equal(state.phase, "won", lesson.id);
    assert.ok(lesson.steps.length >= 2);
    for (const step of lesson.steps) assert.ok(step.instruction.en.length > 0 && step.instruction.ja.length > 0);
  }
  assert.equal(getTutorial("first-line"), tutorialManifest[0]);
  assert.equal(getTutorial("nope"), null);
});
