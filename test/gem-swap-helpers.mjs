import assert from "node:assert/strict";
import { findMatches } from "../dist/gem-swap/board.js";
import { createGame } from "../dist/gem-swap.js";

export const colours = ["red", "blue", "green", "gold", "purple", "teal"];
export const freezeBoard = (cells) =>
  Object.freeze(cells.map((colour, id) => (colour === null ? null : Object.freeze({ id: id + 1000, colour }))));
export function oracleMatches(board, settings) {
  const found = new Set();
  const { width, height, mask } = settings;
  for (let index = 0; index < board.length; index++) {
    const gem = board[index];
    if (!gem || !mask[index]) continue;
    for (const [dx, dy] of [
      [1, 0],
      [0, 1],
    ]) {
      const x = index % width;
      const y = Math.floor(index / width);
      if (x > 0 && dx && board[index - 1]?.colour === gem.colour && mask[index - 1]) continue;
      if (y > 0 && dy && board[index - width]?.colour === gem.colour && mask[index - width]) continue;
      const cells = [index];
      let nextX = x + dx;
      let nextY = y + dy;
      while (
        nextX < width &&
        nextY < height &&
        mask[nextY * width + nextX] &&
        board[nextY * width + nextX]?.colour === gem.colour
      ) {
        cells.push(nextY * width + nextX);
        nextX += dx;
        nextY += dy;
      }
      if (cells.length >= 3) for (const cell of cells) found.add(cell);
    }
  }
  return [...found].sort((a, b) => a - b);
}
export function setup(width = 6, height = 6, mask = Array(width * height).fill(true), seed = "fixture") {
  const game = createGame({ width, height, mask, seed });
  const coloursByCell = Array(width * height).fill(null);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) if (mask[y * width + x]) coloursByCell[y * width + x] = colours[(x + 2 * y) % 5];
  return {
    ...game,
    board: freezeBoard(coloursByCell),
    nextId: 2000,
    phase: "ready",
    pendingCells: Object.freeze([]),
    gravityBoard: null,
  };
}
export function ordinarySwapFixture(seed = "fixture") {
  const state = setup(6, 6, Array(36).fill(true), seed);
  const board = [...state.board];
  board[2 * 6 + 1] = Object.freeze({ id: 9, colour: "blue" });
  board[2 * 6 + 2] = Object.freeze({ id: 10, colour: "red" });
  board[2 * 6 + 3] = Object.freeze({ id: 16, colour: "green" });
  board[2 * 6 + 4] = Object.freeze({ id: 22, colour: "red" });
  return { ...state, board: Object.freeze(board) };
}
export function specialSwapFixture(kindP, kindQ, from = 14, to = 15) {
  for (let seed = 0; seed < 1000; seed++) {
    const base = createGame({ seed });
    const moved = [...base.board];
    [moved[from], moved[to]] = [moved[to], moved[from]];
    if (findMatches(moved, base.settings).length) continue;
    const decorated = [...base.board];
    if (kindP) decorated[from] = Object.freeze({ ...decorated[from], kind: kindP });
    if (kindQ) decorated[to] = Object.freeze({ ...decorated[to], kind: kindQ });
    return { state: { ...base, board: Object.freeze(decorated) }, action: { kind: "swap", from, to } };
  }
  throw new Error("Could not find a stable no-match swap fixture");
}
export function comboOracle(after, action) {
  const { width, height, mask } = after.settings;
  const p = action.from;
  const q = action.to;
  const a = after.board[p];
  const b = after.board[q];
  const ak = a.kind;
  const bk = b.kind;
  const cells = new Set([p, q]);
  const active = after.board.flatMap((gem, i) => (mask[i] && gem ? [i] : []));
  const addRow = (y) =>
    active
      .filter((i) => Math.floor(i / width) === y)
      .forEach((i) => {
        cells.add(i);
      });
  const addColumn = (x) =>
    active
      .filter((i) => i % width === x)
      .forEach((i) => {
        cells.add(i);
      });
  const addBomb = (centre) =>
    active
      .filter(
        (i) =>
          Math.abs((i % width) - (centre % width)) <= 1 &&
          Math.abs(Math.floor(i / width) - Math.floor(centre / width)) <= 1,
      )
      .forEach((i) => {
        cells.add(i);
      });
  const burst = ak === "colour-burst" ? a : bk === "colour-burst" ? b : null;
  if (ak === "colour-burst" && bk === "colour-burst")
    active.forEach((i) => {
      cells.add(i);
    });
  else if (burst && ak && bk) {
    const power = ak === "colour-burst" ? bk : ak;
    const beam = power === "row-beam" || power === "column-beam";
    const targetColour = ak === "colour-burst" ? b.colour : a.colour;
    for (const i of active)
      if (i !== p && i !== q && after.board[i].colour === targetColour) {
        cells.add(i);
        if (power === "bomb") addBomb(i);
        if (power === "row-beam") addRow(Math.floor(i / width));
        if (power === "column-beam") addColumn(i % width);
      }
    assert.ok(beam || power === "bomb");
  } else if (burst) {
    const target = ak === "colour-burst" ? b : a;
    for (const i of active) if (after.board[i].colour === target.colour) cells.add(i);
  } else if (ak === "bomb" && bk === "bomb") {
    active
      .filter(
        (i) => Math.abs((i % width) - (q % width)) <= 2 && Math.abs(Math.floor(i / width) - Math.floor(q / width)) <= 2,
      )
      .forEach((i) => {
        cells.add(i);
      });
  } else if ((ak === "row-beam" || ak === "column-beam") && (bk === "row-beam" || bk === "column-beam")) {
    addRow(Math.floor(q / width));
    addColumn(q % width);
  } else {
    const isBeamBomb =
      (ak === "bomb" && (bk === "row-beam" || bk === "column-beam")) ||
      (bk === "bomb" && (ak === "row-beam" || ak === "column-beam"));
    if (isBeamBomb) {
      const x = q % width;
      const y = Math.floor(q / width);
      for (let row = Math.max(0, y - 1); row <= Math.min(height - 1, y + 1); row++) addRow(row);
      for (let column = Math.max(0, x - 1); column <= Math.min(width - 1, x + 1); column++) addColumn(column);
    }
  }
  return [...cells].sort((x, y) => x - y);
}
