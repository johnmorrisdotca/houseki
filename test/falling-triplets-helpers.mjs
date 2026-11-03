import { readFile } from "node:fs/promises";
import { createChallenge, createGame } from "../dist/falling-triplets.js";

export const fixtureDoc = JSON.parse(
  await readFile(new URL("../docs/design/reference/rules-fixtures.json", import.meta.url), "utf8"),
);
export const tripletFixtures = fixtureDoc.cases.filter((item) => item.id.startsWith("triplets-"));
export const code = { R: "red", B: "blue", G: "green", Y: "gold", P: "purple", T: "teal", ".": null };
export function fixtureBoard(rows) {
  return rows.flatMap((row) =>
    [...row].map((char) => (char === "." ? null : { id: row.length * 0 + 1, colour: code[char] })),
  );
}

// This checker enumerates every same-colour run from each starting cell independently of the engine.
export function oracleMatches(board, width, height) {
  const marked = new Set();
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const colour = board[y * width + x]?.colour;
      if (!colour) continue;
      for (const [dx, dy] of [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
      ]) {
        const line = [];
        let nx = x;
        let ny = y;
        while (nx >= 0 && nx < width && ny >= 0 && ny < height && board[ny * width + nx]?.colour === colour) {
          line.push(ny * width + nx);
          nx += dx;
          ny += dy;
        }
        if (line.length >= 3)
          line.forEach((index) => {
            marked.add(index);
          });
      }
    }
  return [...marked].sort((a, b) => a - b);
}
export function oracleSettle(board, width, height) {
  const out = Array(width * height).fill(null);
  for (let x = 0; x < width; x++) {
    const gems = [];
    for (let y = 0; y < height; y++) if (board[y * width + x]) gems.push(board[y * width + x]);
    for (let i = 0; i < gems.length; i++) out[(height - gems.length + i) * width + x] = gems[i];
  }
  return out;
}

export function supportedArcade(overrides = {}) {
  const base = createGame({ mode: "arcade", width: 6, seed: "grounding" });
  const board = [...base.board];
  board[(0 + 3) * 6 + base.active.x] = { id: 999, colour: "teal" };
  return { ...base, board, active: { ...base.active, ...overrides } };
}

export function challengeBoard(width = 6, height = 13) {
  return Array(width * height).fill(null);
}
export function redTargetSetup() {
  const board = challengeBoard();
  board[11 * 6 + 2] = { id: 10, colour: "red", target: true };
  board[12 * 6 + 2] = { id: 11, colour: "red" };
  board[12 * 6] = { id: 12, colour: "red" };
  return board;
}
export function targetChallenge(
  queue = [
    ["gold", "purple", "gold"],
    ["green", "blue", "red"],
  ],
) {
  return createChallenge({
    seed: "target-clear",
    board: redTargetSetup(),
    queue,
    goal: { type: "targets", targetIds: [10] },
    witness: [
      { x: 1, orientation: 0 },
      { x: 2, orientation: 0 },
    ],
  });
}
