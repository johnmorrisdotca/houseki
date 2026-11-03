import { cascadeBoard, cell, HEIGHT, makeQueue, rng, WIDTH } from "./boards.mjs";

export function tutorialDefinitions() {
  const board = Array(WIDTH * HEIGHT).fill(null);
  board[cell(2, 11)] = { id: 1, colour: "red", target: true };
  board[cell(2, 12)] = { id: 2, colour: "red" };
  const cycle = { type: "targets", targetIds: [1] };
  const diagonalBoard = Array(WIDTH * HEIGHT).fill(null);
  diagonalBoard[cell(1, 10)] = { id: 1, colour: "red", target: true };
  diagonalBoard[cell(1, 11)] = { id: 2, colour: "blue" };
  diagonalBoard[cell(1, 12)] = { id: 3, colour: "gold" };
  diagonalBoard[cell(2, 11)] = { id: 4, colour: "red" };
  diagonalBoard[cell(2, 12)] = { id: 5, colour: "purple" };
  const cascadeSetup = cascadeBoard(rng("lesson-two-wave-cascade"));
  if (!cascadeSetup) throw new Error("Could not make the stable tutorial cascade board");
  const cascadeQueue = makeQueue(rng("lesson-two-wave-cascade-queue"), "cascade", cascadeSetup, 0);
  if (!cascadeQueue) throw new Error("Could not make the tutorial cascade queue");
  return [
    {
      id: "lesson-cycle-and-land",
      title: { en: "Cycle and Land", ja: "回して着地" },
      objective: { en: "Place the red gem above the marked pair.", ja: "赤いジェムを印の上に置きます。" },
      setup: {
        board,
        queue: [
          ["red", "blue", "green"],
          ["gold", "purple", "blue"],
        ],
        goal: cycle,
        witness: [{ x: 2, orientation: 2 }],
      },
      steps: [
        {
          instruction: { en: "Cycle forward to move red to the bottom.", ja: "前へ回して赤を一番下にします。" },
          action: "cycle-forward",
        },
        {
          instruction: {
            en: "Cycle once more, then place the triplet over the target column.",
            ja: "もう一度回して、印の列に置きます。",
          },
          action: "cycle-forward",
        },
      ],
      tags: ["cycling", "vertical-clear"],
    },
    {
      id: "lesson-diagonal-clear",
      title: { en: "Diagonal Thread", ja: "斜めの糸" },
      objective: {
        en: "Complete the rising diagonal through the marked gem.",
        ja: "印のジェムを通る斜めの列を完成させます。",
      },
      setup: {
        board: diagonalBoard,
        queue: [
          ["blue", "gold", "red"],
          ["green", "purple", "gold"],
        ],
        goal: cycle,
        witness: [{ x: 3, orientation: 0 }],
      },
      steps: [
        {
          instruction: {
            en: "Keep the red gem at the bottom and land in the open right column.",
            ja: "赤を一番下にして、右の空いた列に着地します。",
          },
          action: "hard-drop",
        },
      ],
      tags: ["diagonal-clear", "target-planning"],
    },
    {
      id: "lesson-two-wave-cascade",
      title: { en: "Two-Wave Cascade", ja: "二段の連鎖" },
      objective: {
        en: "Set up a clear, then trigger two waves with one placement.",
        ja: "準備をして、一回の着地で二段の消去を起こします。",
      },
      setup: {
        board: cascadeSetup.board,
        queue: cascadeQueue.queue,
        goal: { type: "chain", minimumChain: 2 },
        witness: cascadeQueue.witness,
      },
      steps: [
        {
          instruction: {
            en: "Place the first triplet in the open side column without making a match.",
            ja: "最初のトリプレットを端の空いた列に置き、マッチを作らないようにします。",
          },
          action: "hard-drop",
        },
        {
          instruction: {
            en: "Place the matching-colour gem at the bottom above its pair to start the first wave.",
            ja: "同じ色のジェムが一番下になるように回し、ペアの上に置いて最初の波を始めます。",
          },
          action: "hard-drop",
        },
        {
          instruction: { en: "Watch gravity reveal the second wave.", ja: "重力で二段目が現れるのを見ます。" },
          action: "wait",
        },
      ],
      tags: ["two-wave-chain", "gravity"],
    },
  ];
}
