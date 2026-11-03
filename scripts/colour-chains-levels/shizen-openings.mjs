import { hash, NATURE_GENERATION_REVISION } from "./core.mjs";
import { authoredLevel, canonicalNatureKey } from "./nature-metrics.mjs";
import { playAuthored, playAuthoredRaw, playCounterfactual } from "./shizen-candidates.mjs";

export function addLowDecisionOpenings(unique) {
  const height = 12;
  // Low-decision Shizen openings: one red pair rebounds from the left wall
  // into a small connected red target. Width and target topology change the
  // actual reachable placements; no seed-only or empty-height variants.
  for (const boardWidth of [5, 6, 7, 8, 9, 10, 11, 12])
    for (const offset of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      if (offset + 1 >= boardWidth) continue;
      const shapes = [
        {
          name: "corner-left",
          cells: [
            [offset, 11],
            [offset + 1, 11],
            [offset, 10],
          ],
        },
        {
          name: "corner-right",
          cells: [
            [offset, 11],
            [offset + 1, 11],
            [offset + 1, 10],
          ],
        },
        {
          name: "vertical",
          cells: [
            [offset, 11],
            [offset, 10],
            [offset, 9],
          ],
        },
        ...(offset === 2 && offset + 2 < boardWidth
          ? [
              {
                name: "horizontal",
                cells: [
                  [offset, 11],
                  [offset + 1, 11],
                  [offset + 2, 11],
                ],
              },
            ]
          : []),
        ...(offset === 2 && offset + 1 < boardWidth
          ? [
              {
                name: "square",
                cells: [
                  [offset, 11],
                  [offset + 1, 11],
                  [offset, 10],
                  [offset + 1, 10],
                ],
              },
            ]
          : []),
        {
          name: "tall-vertical",
          cells: [
            [offset, 11],
            [offset, 10],
            [offset, 9],
            [offset, 8],
          ],
        },
        ...(offset === 2 && offset + 3 < boardWidth
          ? [
              {
                name: "wide-row",
                cells: [
                  [offset, 11],
                  [offset + 1, 11],
                  [offset + 2, 11],
                  [offset + 3, 11],
                ],
              },
            ]
          : []),
      ];
      for (const shape of shapes) {
        if (shape.cells.some(([x]) => x >= boardWidth)) continue;
        const board = Array(boardWidth * height).fill(null);
        const targetIds = [];
        shape.cells.forEach(([x, y], index) => {
          const id = index + 1;
          board[y * boardWidth + x] = { id, colour: "red" };
          targetIds.push(id);
        });
        const orientation = offset >= 3 && shape.name !== "horizontal" ? "right" : "up";
        const queue = [
          ["red", "red"],
          [boardWidth > 10 ? "red" : "blue", boardWidth > 10 ? "red" : "gold"],
        ];
        const witness = [{ pivotX: 0, orientation }];
        const source = {
          id: `shizen-red-wall-link-${boardWidth}-${offset}-${shape.name}`,
          width: boardWidth,
          height,
          colourCount: 6,
          board,
          queue,
          goal: { kind: "clear-targets", targetIds },
          tags: ["wall-rebound", "connected-target"],
        };
        const options = {
          seed: `shizen-red-wall-link-${boardWidth}-${offset}-${shape.name}`,
          board,
          nature: true,
          magneticQueue: [
            [false, false],
            [false, false],
          ],
          title:
            boardWidth > 10
              ? { en: "Keep a red pair in reserve", ja: "赤いペアを予備にする" }
              : { en: "Rebound into the red link", ja: "赤い連結へリバウンド" },
          objective:
            boardWidth > 10
              ? {
                  en: "Use the first red pair to rebound into the connected target. The second red pair can recover if the first placement misses.",
                  ja: "最初の赤いペアをリバウンドさせ、つながった目標へ導きます。外した場合は2組目の赤いペアで立て直せます。",
                }
              : {
                  en: "A red pair rebounds from the left edge. Guide it into the connected red target group.",
                  ja: "赤いペアを左端でリバウンドさせ、つながった赤い目標へ導きます。",
                },
        };
        const proof = playAuthored(options, source, witness);
        if (
          proof?.state.phase !== "won" ||
          !proof.events.some((event) => event.type === "power-drop-landed" && event.rebound)
        )
          continue;
        const plain = playCounterfactual(options, source, witness, "nature");
        if (plain?.state.phase === "won") continue;
        if (boardWidth > 10) {
          const wrongFirst = { pivotX: boardWidth - 1, orientation: "up" };
          const miss = playAuthoredRaw(options, source, [wrongFirst]);
          const recovery = playAuthoredRaw(options, source, [wrongFirst, witness[0]]);
          if (miss?.state.phase !== "falling" || recovery?.state.phase !== "won") continue;
        }
        const authored = authoredLevel(source, "shizen", 0, options, witness, proof.events);
        if (boardWidth > 10) authored.level.rawMetrics.verifiedWrongFirstRecovery = 1;
        authored.level.tags.push("rebound-dependency", "counterfactual-fail-without-nature");
        unique.set(authored.key, authored.level);
      }
    }
}

export function addSeededCandidates(unique) {
  const width = 6;
  const height = 12;
  const colourCount = 6;
  const safeColours = ["blue", "green", "gold", "purple", "teal"];
  for (let serial = 1; serial <= 4_000 && unique.size < 220; serial++) {
    const board = Array(width * height).fill(null);
    const targetIds = [1, 2, 3];
    for (const [index, x] of [
      [0, 2],
      [1, 3],
      [2, 4],
    ])
      board[(height - 1) * width + x] = { id: index + 1, colour: "red" };
    let id = 4;
    // A changing skyline above the red link alters safe landings without changing the proof pattern.
    for (const x of [2, 3, 4]) {
      const heightAbove = Math.floor(serial / (x === 2 ? 1 : x === 3 ? 7 : 49)) % 5;
      for (let depth = 0; depth < heightAbove; depth++)
        board[(height - 2 - depth) * width + x] = {
          id: id++,
          colour: safeColours[(serial + x + depth) % safeColours.length],
        };
    }
    const outsideHeight = 1 + (serial % 11);
    for (let depth = 0; depth < outsideHeight; depth++)
      board[(height - 1 - depth) * width + 5] = {
        id: id++,
        colour: safeColours[(serial * 3 + depth) % safeColours.length],
      };
    const queue = [
      ["red", "blue"],
      [safeColours[serial % safeColours.length], safeColours[(serial + 2) % safeColours.length]],
    ];
    const witness = [{ pivotX: 0, orientation: "up" }];
    const source = {
      id: `magnetic-template-${serial}`,
      width,
      height,
      colourCount,
      board,
      queue,
      goal: { kind: "clear-targets", targetIds },
      tags: [],
    };
    const magneticQueue = [
      [true, false],
      [false, false],
    ];
    const options = { seed: `shizen:${NATURE_GENERATION_REVISION}:${serial}`, board, nature: true, magneticQueue };
    const outcome = playAuthored(options, source, witness);
    if (outcome?.state.phase !== "won") continue;
    const rebound = outcome.events.find(
      (event) =>
        event.type === "power-drop-landed" &&
        event.rebound &&
        event.ids?.includes(outcome.events.find((item) => item.type === "pair-locked")?.ids?.[0]),
    );
    if (!rebound) continue;
    const plain = playCounterfactual(options, source, witness, "nature");
    if (plain?.state.phase === "won") continue;
    const levelOptions = {
      ...options,
      title: { en: "Rebound the red link", ja: "赤い列へリバウンド" },
      objective: {
        en: "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
        ja: "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。",
      },
    };
    const authored = authoredLevel(source, "shizen", 0, levelOptions, witness, outcome.events);
    authored.level.tags.push("rebound-dependency", "counterfactual-fail-without-nature");
    const key = canonicalNatureKey(authored.level);
    authored.level.canonicalKeyHash = hash(key);
    authored.level.id = `shizen-${hash(key).slice(0, 12)}`;
    if (!unique.has(key)) unique.set(key, authored.level);
  }
}
