import { advanceTicks, createGame } from "../dist/colour-chains.js";

export const W = 6;
export const H = 12;
export const FULL = H + 3;
export function blank() {
  return Array(W * FULL).fill(null);
}
export function put(board, x, y, colour, id) {
  board[(y + 3) * W + x] = { id, colour };
}
export function stateWith(board, active = null, extra = {}) {
  const base = createGame({ width: W, height: H, seed: "fixture" });
  return {
    ...base,
    board,
    active,
    phase: "falling",
    nextId: 10000,
    allClears: 0,
    elapsedTicks: 0,
    assisted: false,
    witnessIndex: -1,
    recording: [],
    ...extra,
  };
}
export function active(colours = ["red", "green"], pivot = { x: 2, y: 10 }, orientation = "up") {
  return {
    pivot,
    orientation,
    gems: [
      { id: 9001, colour: colours[0] },
      { id: 9002, colour: colours[1] },
    ],
    level: 1,
    gravityTicks: 0,
    groundedTicks: 0,
    resetCount: 0,
    groundedStarted: false,
  };
}
export function tick(state, n) {
  const result = advanceTicks(state, n);
  return result.state;
}

// An independent component walk and independent stable compactor check random boards.
export function oracleGroups(board, width, height) {
  const seen = new Set();
  const groups = [];
  for (let i = 0; i < board.length; i++) {
    if (!board[i] || seen.has(i)) continue;
    const colour = board[i].colour;
    const queue = [i];
    seen.add(i);
    const cells = [];
    while (queue.length) {
      const at = queue.shift();
      cells.push(at);
      const x = at % width;
      const y = Math.floor(at / width);
      for (const [nx, ny] of [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ]) {
        const j = ny * width + nx;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && !seen.has(j) && board[j]?.colour === colour) {
          seen.add(j);
          queue.push(j);
        }
      }
    }
    if (cells.length >= 4) groups.push(cells.sort((a, b) => a - b));
  }
  return groups.sort((a, b) => a[0] - b[0]);
}
export function oracleGravity(board, width, height) {
  const result = Array(width * height).fill(null);
  for (let x = 0; x < width; x++) {
    const survivors = [];
    for (let y = 0; y < height; y++) if (board[y * width + x]) survivors.push(board[y * width + x]);
    survivors.forEach((gem, i) => {
      result[(height - survivors.length + i) * width + x] = gem;
    });
  }
  return result;
}

export function groundedArcade({
  x = 2,
  orientation = "right",
  support = [2, 3],
  resetCount = 0,
  groundedTicks = 0,
  groundedStarted = true,
} = {}) {
  const board = blank();
  for (const col of support) put(board, col, 11, "teal", 5000 + col);
  return stateWith(
    board,
    { ...active(["red", "blue"], { x, y: 10 }, orientation), resetCount, groundedTicks, groundedStarted },
    { settings: { ...createGame({ mode: "arcade" }).settings, width: W, height: H } },
  );
}
