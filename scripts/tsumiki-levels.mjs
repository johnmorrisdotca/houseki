// Writes src/tsumiki/content.data.ts: Tsumiki's graded levels and its lessons, each with a line of moves the engine won with.
// Run after `pnpm build`: node scripts/tsumiki-levels.mjs. A level is its seed, its goal and its stones, kept only when the
// bot below wins it. The bot is a careful beginner: it takes the placement that clears most, and otherwise leaves the board tidiest.
import { writeFileSync } from "node:fs";
import { applyAction, BOARD_SIDE, createChallenge, legalActions } from "../dist/tsumiki.js";

const SIDE = BOARD_SIDE;

/** Lines a placement would clear, and how many empty cells it would leave boxed in. */
function judge(state, action) {
  const result = applyAction(state, action);
  const board = result.state.board;
  let holes = 0;
  for (let cell = 0; cell < board.length; cell += 1) {
    if (board[cell] !== null) continue;
    const row = Math.floor(cell / SIDE);
    const column = cell % SIDE;
    const around = [
      row > 0 ? cell - SIDE : -1,
      row < SIDE - 1 ? cell + SIDE : -1,
      column > 0 ? cell - 1 : -1,
      column < SIDE - 1 ? cell + 1 : -1,
    ];
    if (around.every((next) => next === -1 || board[next] !== null)) holes += 1;
  }
  const filled = board.filter(Boolean).length;
  const stonesLeft = board.filter((block) => block?.stone === true).length;
  return { result, value: (result.state.lines - state.lines) * 60 - holes * 8 - filled - stonesLeft * 12 };
}

/** Plays until the game ends; the moves it made and how it ended. */
function play(state, most = 400) {
  const witness = [];
  let now = state;
  while (now.phase === "ready" && witness.length < most) {
    let best = null;
    for (const action of legalActions(now)) {
      const judged = judge(now, action);
      if (best === null || judged.value > best.value) best = { ...judged, action };
    }
    if (best === null) break;
    witness.push([best.action.slot, best.action.row, best.action.column]);
    now = best.result.state;
  }
  return { witness, phase: now.phase, score: now.score, lines: now.lines };
}

/** Stones spread over the board from a seed: no row or column nearly full, so the first placements cannot be free clears. */
function stonesOf(seed, count) {
  let state = seed >>> 0 || 1;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };
  const cells = new Set();
  while (cells.size < count) {
    const cell = next() % (SIDE * SIDE);
    const row = Math.floor(cell / SIDE);
    const column = cell % SIDE;
    const inRow = [...cells].filter((each) => Math.floor(each / SIDE) === row).length;
    const inColumn = [...cells].filter((each) => each % SIDE === column).length;
    if (inRow < 4 && inColumn < 4) cells.add(cell);
  }
  return [...cells].sort((a, b) => a - b);
}

const LEVELS = 64;
const levels = [];
for (let number = 1; number <= LEVELS; number += 1) {
  const step = (number - 1) / (LEVELS - 1);
  const marks = Math.min(5, 1 + Math.floor(step * 5));
  const shape = number % 3;
  const goal =
    shape === 1
      ? { kind: "lines", target: 2 + Math.round(step * 34) }
      : shape === 2
        ? { kind: "score", target: 40 + Math.round(step * 80) * 10 }
        : { kind: "clear-stones" };
  const stones = shape === 0 ? stonesOf(number * 7919, 3 + Math.round(step * 15)) : [];
  let made = null;
  for (let attempt = 0; attempt < 400 && made === null; attempt += 1) {
    const seed = `level-${number}-${attempt}`;
    const run = play(createChallenge({ id: `tsumiki-${number}`, seed, goal, stones }));
    if (run.phase === "won") made = { seed, witness: run.witness };
  }
  if (made === null) throw new Error(`level ${number} was not won by the bot`);
  const title =
    goal.kind === "lines"
      ? { en: `Clear ${goal.target} lines`, ja: `${goal.target}本を消す` }
      : goal.kind === "score"
        ? { en: `Score ${goal.target}`, ja: `${goal.target}点を取る` }
        : { en: `Clear ${stones.length} stones`, ja: `石を${stones.length}個消す` };
  levels.push({ id: `tsumiki-${number}`, number, title, seed: made.seed, goal, stones, witness: made.witness, marks });
}

const lesson = (id, title, objective, goal, stones, steps) => {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const seed = `${id}-${attempt}`;
    const run = play(createChallenge({ id, seed, goal, stones }));
    if (run.phase === "won") return { id, title, objective, seed, goal, stones, witness: run.witness, steps };
  }
  throw new Error(`lesson ${id} was not won by the bot`);
};

const tutorials = [
  lesson(
    "first-line",
    { en: "Your first line", ja: "はじめての1本" },
    { en: "Fill a row or a column to clear it.", ja: "行か列を埋めると消えます。" },
    { kind: "lines", target: 1 },
    [],
    [
      {
        instruction: {
          en: "Choose a shape in the tray, then a square on the board: its top left goes there.",
          ja: "トレーの形を選び、盤のマスを選びます。形の左上がそこに置かれます。",
        },
      },
      { instruction: { en: "Fill a whole row or column, and it clears.", ja: "行か列を1本埋めると、消えます。" } },
    ],
  ),
  lesson(
    "two-together",
    { en: "Two at once", ja: "同時に2本" },
    {
      en: "Clear several lines together: they are worth far more.",
      ja: "何本かを同時に消すと、ずっと高い点になります。",
    },
    { kind: "score", target: 60 },
    [],
    [
      {
        instruction: {
          en: "Lines cleared together score more than lines cleared one by one.",
          ja: "同時に消した行や列は、1本ずつ消すより高い点になります。",
        },
      },
      {
        instruction: {
          en: "When all three shapes are laid, three more come.",
          ja: "3つの形をすべて置くと、次の3つが出ます。",
        },
      },
    ],
  ),
  lesson(
    "clear-the-stones",
    { en: "Clear the stones", ja: "石を消す" },
    {
      en: "Stones go like anything else: fill the lines they are in.",
      ja: "石もほかと同じように消えます。石のある行や列を埋めます。",
    },
    { kind: "clear-stones" },
    [27, 28, 35, 36],
    [
      {
        instruction: {
          en: "A stone is gold. Fill the row or column it is in, and it clears.",
          ja: "石は金色です。その行か列を埋めると消えます。",
        },
      },
      {
        instruction: {
          en: "The game ends when none of the shapes in the tray will fit: keep room for them.",
          ja: "トレーのどの形も置けなくなると終わりです。置く場所を残しておきましょう。",
        },
      },
    ],
  ),
];

const banner = "/** Written by scripts/tsumiki-levels.mjs: do not edit. */\n";
writeFileSync(
  "src/tsumiki/content.data.ts",
  `${banner}export const contentData = ${JSON.stringify({ levels, tutorials })};\n`,
);
console.log(
  levels.length,
  "levels",
  tutorials.length,
  "lessons",
  "longest witness",
  Math.max(...levels.map((level) => level.witness.length)),
);
