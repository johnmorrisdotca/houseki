// Hand-authored board data for the nature campaigns; read by ../nature-campaign-levels.mjs.
export const arashiCausalPrototype = {
  seed: "arashi-plan-0-91",
  queue: [
    ["blue", "gold"],
    ["green", "purple"],
    ["teal", "blue"],
    ["gold", "green"],
  ],
  goal: { kind: "clear-targets", targetIds: [9001, 9002] },
  witness: [
    { pivotX: 0, orientation: "up" },
    { pivotX: 1, orientation: "up" },
    { pivotX: 0, orientation: "up" },
    { pivotX: 0, orientation: "up" },
  ],
  board: (() => {
    const colours = ["blue", "green", "gold", "purple", "teal"];
    const board = Array(6 * 12).fill(null);
    let id = 1;
    for (let y = 0; y < 12; y++)
      for (let x = 3; x <= 5; x++) {
        const target = y === 1 && x === 3 ? 9002 : y === 2 && x === 4 ? 9001 : id;
        board[y * 6 + x] = {
          id: target,
          colour: (y === 1 && x === 3) || (y === 2 && x === 4) ? "red" : colours[(2 * x + y) % colours.length],
        };
        id++;
      }
    return board;
  })(),
};

export const arashiThreeTargetPrototype = {
  seed: "causal3-282",
  queue: [
    ["blue", "gold"],
    ["green", "purple"],
    ["teal", "blue"],
    ["gold", "green"],
  ],
  goal: { kind: "clear-targets", targetIds: [9001, 9002, 9003] },
  witness: [
    { pivotX: 0, orientation: "up" },
    { pivotX: 1, orientation: "up" },
    { pivotX: 0, orientation: "up" },
    { pivotX: 0, orientation: "up" },
  ],
  board: (() => {
    const colours = ["blue", "green", "gold", "purple", "teal"];
    const targets = new Map([
      [2 * 6 + 3, [9001, "red"]],
      [2 * 6 + 4, [9002, "blue"]],
      [2 * 6 + 5, [9003, "gold"]],
    ]);
    const board = Array(6 * 12).fill(null);
    let id = 1;
    for (let y = 0; y < 12; y++)
      for (let x = 3; x <= 5; x++) {
        const target = targets.get(y * 6 + x);
        board[y * 6 + x] = target
          ? { id: target[0], colour: target[1] }
          : { id: id++, colour: colours[(2 * x + y) % colours.length] };
        if (target) id++;
      }
    return board;
  })(),
};
