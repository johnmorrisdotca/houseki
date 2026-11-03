import { createHash } from "node:crypto";
import { findMatches } from "../../dist/falling-triplets.js";
import { GENERATION_REVISION } from "../falling-triplets-levels.mjs";

export const WIDTH = 6;
export const HEIGHT = 13;
const COLOURS = ["red", "blue", "green", "gold", "purple"];
export const MOTIFS = ["vertical", "horizontal", "diagonal", "crossing", "cascade"];

export function rng(seed) {
  let value = Number.parseInt(createHash("sha256").update(String(seed)).digest("hex").slice(0, 8), 16) || 1;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 0x100000000;
  };
}
const pick = (random, values) => values[Math.floor(random() * values.length)];
export const cell = (x, y, width = WIDTH) => y * width + x;
function withIds(board) {
  let id = 1;
  return board.map((gem) => (gem ? { id: id++, colour: gem.colour, ...(gem.target ? { target: true } : {}) } : null));
}
export function add(board, x, y, colour, target = false) {
  board[cell(x, y)] = { colour, ...(target ? { target: true } : {}) };
}
function hasMatch(board) {
  return (
    findMatches(
      board.map((g, i) => (g ? { ...g, id: i + 1 } : null)),
      WIDTH,
      HEIGHT,
    ).length > 0
  );
}
function solidDecor(board, random, protectedColumns, forbiddenColours, maximum = 7) {
  const safe = Array.from({ length: WIDTH }, (_, x) => x).filter((x) => !protectedColumns.has(x));
  const amount = Math.floor(random() * maximum);
  for (let i = 0; i < amount; i++) {
    const x = pick(random, safe);
    const occupied = [];
    for (let y = HEIGHT - 1; y >= 0 && board[cell(x, y)] !== null; y--) occupied.push(y);
    const y = HEIGHT - 1 - occupied.length;
    if (y < 1) continue;
    const choices = COLOURS.filter((colour) => !forbiddenColours.includes(colour));
    add(board, x, y, pick(random, choices));
  }
}
export function cascadeBoard(random) {
  const board = Array(WIDTH * HEIGHT).fill(null);
  const targetColour = pick(random, COLOURS);
  const chainColour = pick(
    random,
    COLOURS.filter((colour) => colour !== targetColour),
  );
  const targetX = pick(random, [2, 3]);
  const safeX = targetX === 2 ? 5 : 0;
  const protectedColumns = new Set([targetX - 1, targetX, targetX + 1, safeX]);
  add(board, targetX, 11, targetColour);
  add(board, targetX, 12, targetColour);
  add(board, targetX - 1, 12, chainColour);
  add(board, targetX + 1, 12, chainColour);
  solidDecor(board, random, protectedColumns, [targetColour, chainColour], 8);
  if (hasMatch(board)) return null;
  return { board: withIds(board), targetColour, chainColour, targetX, safeX, protectedColumns: [...protectedColumns] };
}
export function motifBoard(motif, serial, attempt) {
  const random = rng(`${GENERATION_REVISION}|${motif}|${serial}|${attempt}`);
  const board = Array(WIDTH * HEIGHT).fill(null);
  if (motif === "cascade") {
    return cascadeBoard(random);
  }
  const targetColour = pick(random, COLOURS);
  const c = pick(random, [2, 3]);
  const protectedColumns = new Set();
  let targetCoord;
  if (motif === "vertical") {
    targetCoord = [c, 11];
    protectedColumns.add(c);
    add(board, c, 11, targetColour, true);
    add(board, c, 12, targetColour);
  } else if (motif === "horizontal") {
    targetCoord = [c - 1, 12];
    protectedColumns.add(c - 1);
    protectedColumns.add(c + 1);
    add(board, c - 1, 12, targetColour, true);
    add(board, c + 1, 12, targetColour);
  } else if (motif === "diagonal") {
    const left = c === 2 ? 1 : 2;
    const middle = left + 1;
    const drop = left + 2;
    targetCoord = [left, 10];
    protectedColumns.add(left);
    protectedColumns.add(middle);
    protectedColumns.add(drop);
    add(board, left, 10, targetColour, true);
    add(
      board,
      left,
      11,
      pick(
        random,
        COLOURS.filter((v) => v !== targetColour),
      ),
    );
    add(
      board,
      left,
      12,
      pick(
        random,
        COLOURS.filter((v) => v !== targetColour),
      ),
    );
    add(board, middle, 11, targetColour);
    add(
      board,
      middle,
      12,
      pick(
        random,
        COLOURS.filter((v) => v !== targetColour),
      ),
    );
  } else if (motif === "crossing") {
    targetCoord = [c, 11];
    protectedColumns.add(c - 1);
    protectedColumns.add(c);
    protectedColumns.add(c + 1);
    add(board, c, 11, targetColour, true);
    add(board, c, 12, targetColour);
    for (const x of [c - 1, c + 1]) {
      add(board, x, 10, targetColour);
      add(
        board,
        x,
        11,
        pick(
          random,
          COLOURS.filter((v) => v !== targetColour),
        ),
      );
      add(
        board,
        x,
        12,
        pick(
          random,
          COLOURS.filter((v) => v !== targetColour),
        ),
      );
    }
  }
  solidDecor(board, random, protectedColumns, [targetColour], 8);
  if (motif !== "cascade" && hasMatch(board)) return null;
  const inits = withIds(board);
  const targetId = targetCoord ? inits[cell(...targetCoord)]?.id : undefined;
  return {
    board: inits,
    targetColour,
    targetId,
    targetX:
      motif === "diagonal"
        ? targetCoord[0] + 2
        : motif === "horizontal"
          ? targetCoord[0] + 1
          : motif === "crossing"
            ? c
            : motif === "cascade"
              ? 5
              : c,
    protectedColumns: [...protectedColumns],
  };
}
export function makeQueue(random, motif, setup, serial) {
  const { targetColour, targetX } = setup;
  if (motif === "cascade") {
    const fillers = COLOURS.filter((colour) => colour !== setup.targetColour && colour !== setup.chainColour);
    const permutations = [
      fillers,
      [fillers[0], fillers[2], fillers[1]],
      [fillers[1], fillers[0], fillers[2]],
      [fillers[1], fillers[2], fillers[0]],
      [fillers[2], fillers[0], fillers[1]],
      [fillers[2], fillers[1], fillers[0]],
    ];
    for (let offset = 0; offset < permutations.length; offset++) {
      const harmless = permutations[(serial + offset) % permutations.length];
      const trial = [...setup.board];
      let id = Math.max(0, ...trial.flatMap((gem) => (gem ? [gem.id] : []))) + 1;
      for (let i = 0; i < 3; i++) trial[cell(setup.safeX, HEIGHT - 3 + i)] = { id: id++, colour: harmless[i] };
      if (findMatches(trial, WIDTH, HEIGHT).length) continue;
      const trigger = [pick(random, fillers), setup.chainColour, setup.targetColour];
      return {
        queue: [harmless, trigger],
        witness: [
          { x: setup.safeX, orientation: 0 },
          { x: targetX, orientation: 0 },
        ],
      };
    }
    return null;
  }
  const length = 2 + (serial % 3);
  const diversionCount = length - 1;
  const nonTarget = COLOURS.filter((colour) => colour !== targetColour);
  const queue = [];
  for (let p = 0; p < diversionCount; p++) {
    const set = [...nonTarget];
    for (let i = set.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [set[i], set[j]] = [set[j], set[i]];
    }
    set.length = 3;
    if (serial % 7 === 0)
      set[2] = set[0] === set[1] ? nonTarget[(nonTarget.indexOf(set[0]) + 1) % nonTarget.length] : set[0];
    queue.push(set);
  }
  const orientation = serial % 3;
  const final = [pick(random, nonTarget), pick(random, nonTarget), pick(random, nonTarget)];
  final[(2 - orientation + 3) % 3] = targetColour;
  queue.push(final);
  const available = [0, 5, 1, 4, 2, 3].filter((x) => x !== targetX);
  const witness = Array.from({ length: diversionCount }, (_, i) => ({
    x: available[i % available.length],
    orientation: serial % 3,
  }));
  witness.push({ x: targetX, orientation });
  return { queue, witness };
}
