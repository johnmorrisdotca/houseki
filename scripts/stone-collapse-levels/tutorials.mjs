import { COLOURS, witnessIds } from "../stone-collapse-levels.mjs";

export function tutorials() {
  const board = (colors) => colors.map((colour, index) => (colour === null ? null : { id: index + 1, colour }));
  const pair = board(
    [
      "red",
      "red",
      "blue",
      "gold",
      "green",
      "blue",
      "gold",
      "green",
      "blue",
      "green",
      "green",
      "gold",
      "green",
      "gold",
      "gold",
      "blue",
    ],
    4,
    4,
  );
  const pairIds = [1, 2];
  const compression = board(
    [
      "red",
      "blue",
      "green",
      "gold",
      "red",
      "blue",
      "green",
      "gold",
      "red",
      "blue",
      "green",
      "gold",
      "red",
      "blue",
      "blue",
      "gold",
    ],
    4,
    4,
  );
  const compressionIds = [2, 6, 10, 14, 15];
  const orderColours = [2, 1, 1, 0, 0, 0, 0, 2, 2, 1, 2, 0, 0, 2, 2, 1];
  const orderBoard = board(
    orderColours.map((value) => COLOURS[value]),
    4,
    4,
  );
  const orderSolution = [
    [1, 2],
    [4, 5, 6],
    [10, 14, 13],
    [13, 14],
    [4, 8, 9],
    [9, 13, 12],
  ];
  const orderWitness = witnessIds(orderBoard, orderSolution, 4, 4);
  return [
    {
      id: "identify-a-group",
      title: { en: "Find a Connected Group", ja: "つながったグループを見つける" },
      objective: { en: "Select and clear the marked pair.", ja: "印のペアを選び、消しましょう。" },
      setup: {
        width: 4,
        height: 4,
        colourCount: 4,
        board: pair,
        goal: { kind: "clear-targets", targetIds: pairIds },
        witness: [pairIds],
      },
      steps: [
        {
          instruction: {
            en: "Select either red stone. Both connected stones should be previewed.",
            ja: "赤い石のどちらかを選びます。つながった2つがプレビューされます。",
          },
          action: "select",
        },
        {
          instruction: { en: "Confirm the selected group to clear it.", ja: "選んだグループを確認して消します。" },
          action: "confirm",
        },
      ],
      tags: ["group-selection", "confirmation"],
    },
    {
      id: "follow-gravity-and-compression",
      title: { en: "Follow Gravity and Compression", ja: "重力と列の圧縮を見る" },
      objective: {
        en: "Clear the blue pair and watch the empty column close.",
        ja: "青いペアを消し、空いた列が詰まる様子を見ます。",
      },
      setup: {
        width: 4,
        height: 4,
        colourCount: 4,
        board: compression,
        goal: { kind: "clear-targets", targetIds: compressionIds },
        witness: [compressionIds],
      },
      steps: [
        {
          instruction: {
            en: "Choose either blue stone to preview the complete pair.",
            ja: "青い石を選び、ペア全体をプレビューします。",
          },
          action: "select",
        },
        {
          instruction: {
            en: "Confirm. Stones above fall first; on this rectangle, the empty column then shifts away.",
            ja: "確認します。石が先に下へ落ち、この長方形では空いた列が左へ詰まります。",
          },
          action: "confirm",
        },
      ],
      tags: ["gravity", "column-compression"],
    },
    {
      id: "plan-the-removal-order",
      title: { en: "Plan the Removal Order", ja: "消す順番を考える" },
      objective: {
        en: "Clear the whole board without stranding the remaining stones.",
        ja: "石を取り残さないように盤面をすべて消します。",
      },
      setup: {
        width: 4,
        height: 4,
        colourCount: 4,
        board: orderBoard,
        goal: { kind: "clear-all" },
        moveLimit: orderWitness.length,
        witness: orderWitness,
      },
      steps: [
        {
          instruction: {
            en: "Clear the blue pair first, then the red group. This opens the lower groups.",
            ja: "先に青いペアを消し、次に赤いグループを消して下の道を開きます。",
          },
          action: "select; confirm",
        },
        {
          instruction: {
            en: "The green group is tempting, but taking it first leaves only single stones. Follow the marked route.",
            ja: "緑のグループを先に消すと、1つずつの石が残ってしまいます。印の順番で進めます。",
          },
          action: "plan; clear-all",
        },
      ],
      tags: ["removal-order", "singleton-risk"],
    },
  ];
}
