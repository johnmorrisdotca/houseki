import { WIDTH } from "./search.mjs";

export function makeLessons() {
  const lessons = [];
  for (const data of [
    [
      "calm-bonds",
      "Calm keeps bonds",
      "静穏では結合が続く",
      "Place a bonded block on an uneven stack. Its gems settle together as one connected group.",
      "段差のある積み重ねに結合したブロックを置きます。つながった宝石は一緒に落ちます。",
      { kind: "fixed", floor: "calm" },
      false,
      false,
    ],
    [
      "magnetic-split",
      "Pull separates columns",
      "引力で列が分かれる",
      "Place the same square on Pull. The bonds break and each column settles independently.",
      "同じ四角ブロックを引力の床に置きます。結合が切れ、列ごとに落ちます。",
      { kind: "fixed", floor: "magnetic" },
      false,
      false,
    ],
    [
      "floor-switch-impact",
      "Switch and impact",
      "床スイッチと衝撃",
      "Select Pull with the one-use Floor Switch, then hard-drop to remove the contacted support layer.",
      "1回分の床スイッチで引力を選び、ハードドロップで接触した支えを壊します。",
      { kind: "fixed", floor: "calm" },
      true,
      true,
    ],
  ]) {
    const [id, en, ja, objectiveEn, objectiveJa, schedule, floorSwitch, magneticImpact] = data;
    const board = Array(WIDTH * 8).fill(null);
    // A short, uneven support shelf demonstrates the lesson without creating an opening clear.
    board[7 * WIDTH + 2] = { id: 1, colour: "red" };
    board[7 * WIDTH + 3] = { id: 2, colour: "blue" };
    board[7 * WIDTH + 4] = { id: 3, colour: "green" };
    board[7 * WIDTH + 5] = { id: 4, colour: "gold" };
    const options = {
      mode: "relaxed",
      width: WIDTH,
      height: 8,
      colourCount: 5,
      seed: `magnetic-lesson-${id}`,
      initialBoard: board,
      queue: [["red", "blue", "green", "gold"]],
      pieceLimit: 1,
      schedule,
      floorSwitch,
      magneticImpact,
    };
    const witness = floorSwitch
      ? [{ kind: "set-floor-override", floor: "magnetic" }, { kind: "hard-drop" }]
      : [{ kind: "hard-drop" }];
    lessons.push({
      id,
      title: { en, ja },
      objective: { en: objectiveEn, ja: objectiveJa },
      options,
      witness,
      instruction: [
        {
          en: "Move and rotate the active square. The ghost shows where its cells will land.",
          ja: "操作して四角ブロックを動かし、回転します。ゴーストは着地点を示します。",
        },
        { en: objectiveEn, ja: objectiveJa },
      ],
    });
  }
  return lessons;
}
export function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}
