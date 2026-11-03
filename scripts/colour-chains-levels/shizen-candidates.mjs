import { initialChallengeState } from "../../dist/colour-chains/engine.js";
import { createChallenge } from "../../dist/colour-chains.js";
import { playPlan } from "./core.mjs";
import { authoredLevel } from "./nature-metrics.mjs";

export function playAuthored(options, source, witness) {
  try {
    const start = createChallenge({
      id: `proof-${source.id}`,
      seed: options.seed,
      width: source.width,
      height: source.height,
      colourCount: source.colourCount,
      board: options.board,
      queue: source.queue,
      goal: source.goal,
      witness,
      nature: true,
      ...(options.weather ? { weather: options.weather } : {}),
      ...(options.magneticQueue ? { magneticQueue: options.magneticQueue } : {}),
    });
    return playPlan(start, witness);
  } catch {
    return null;
  }
}

export function playAuthoredRaw(options, source, witness) {
  try {
    const settings = {
      mode: "challenge",
      width: source.width,
      height: source.height,
      colourCount: source.colourCount,
      seed: options.seed,
      challengeId: `candidate-${source.id}`,
      goal: source.goal,
      initialBoard: options.board,
      queue: source.queue,
      witness,
      nature: true,
      ...(options.weather ? { weather: options.weather } : {}),
      ...(options.magneticQueue ? { magneticQueue: options.magneticQueue } : {}),
    };
    return playPlan(initialChallengeState(settings, options.board, source.queue), witness);
  } catch {
    return null;
  }
}

export function playCounterfactual(options, source, witness, disable) {
  const board =
    disable === "magnetism"
      ? options.board.map((gem) => (gem ? { id: gem.id, colour: gem.colour } : null))
      : options.board;
  const settings = {
    mode: "challenge",
    width: source.width,
    height: source.height,
    colourCount: source.colourCount,
    seed: options.seed,
    challengeId: `counterfactual-${source.id}`,
    goal: source.goal,
    initialBoard: board,
    queue: source.queue,
    witness,
    ...(disable === "weather" || disable === "magnetism" ? { nature: true } : {}),
    ...(disable !== "weather" && options.weather ? { weather: options.weather } : {}),
    ...(options.magneticQueue ? { magneticQueue: options.magneticQueue } : {}),
  };
  const start = initialChallengeState(settings, board, source.queue);
  return playPlan(start, witness);
}

export function gradeNatureConstructionBlueprints(manifest, campaign) {
  const levels = [];
  for (const prior of manifest) {
    const source = {
      id: `construction-${campaign}-${levels.length + 1}`,
      width: prior.width,
      height: prior.height,
      colourCount: prior.colourCount,
      board: prior.board,
      queue: prior.queue,
      goal: prior.goal,
      tags: prior.tags ?? [],
    };
    const options = {
      seed: prior.seed,
      board: prior.board,
      nature: true,
      ...(prior.weather ? { weather: prior.weather } : {}),
      ...(prior.magneticQueue ? { magneticQueue: prior.magneticQueue } : {}),
      title: prior.title,
      objective: prior.objective,
    };
    const proof = playAuthored(options, source, prior.witness);
    if (proof?.state.phase !== "won") continue;
    const disabled = playCounterfactual(options, source, prior.witness, campaign === "arashi" ? "weather" : "nature");
    if (disabled?.state.phase === "won") continue;
    if (
      campaign === "shizen" &&
      !proof.events.some(
        (event) =>
          (event.type === "power-drop-landed" && event.rebound) ||
          (event.type === "magnetic-pulse" && event.moves?.length),
      )
    )
      continue;
    const fallback =
      campaign === "arashi"
        ? {
            title: { en: "Keep the target in range", ja: "目標を範囲に保つ" },
            objective: {
              en: "Preserve the marked target until the scheduled weather can reach it.",
              ja: "予定された天候が届くまで目標を残しましょう。",
            },
          }
        : {
            title: { en: "Guide the pair with nature", ja: "自然の力でペアを導く" },
            objective: {
              en: "Place the marked pair so its nature effect clears the target.",
              ja: "磁石付きのペアを置き、自然の力で目標を消しましょう。",
            },
          };
    const authored = authoredLevel(
      source,
      campaign,
      0,
      { ...options, title: options.title ?? fallback.title, objective: options.objective ?? fallback.objective },
      prior.witness,
      proof.events,
    );
    authored.level.tags.push("construction-blueprint");
    levels.push(authored);
  }
  return levels;
}

export function shizenHorizontalOpeningCandidates() {
  const levels = new Map();
  const height = 12;
  for (const width of [5, 6, 7, 8]) {
    const board = Array(width * height).fill(null);
    const targetIds = [1, 2, 3];
    for (const [id, x, y] of [
      [1, 2, 11],
      [2, 3, 11],
      [3, 4, 11],
    ])
      board[y * width + x] = { id, colour: "red" };
    const queue = [
      ["red", "red"],
      ["blue", "gold"],
    ];
    const witness = [{ pivotX: 0, orientation: "up" }];
    const source = {
      id: `shizen-horizontal-red-link-${width}`,
      width,
      height,
      colourCount: 6,
      board,
      queue,
      goal: { kind: "clear-targets", targetIds },
      tags: ["horizontal-target-link", "wall-rebound"],
    };
    const options = {
      seed: `shizen-horizontal-red-link-${width}`,
      board,
      nature: true,
      magneticQueue: [
        [false, false],
        [false, false],
      ],
      title: { en: "Rebound into the long red row", ja: "長い赤い列へリバウンド" },
      objective: {
        en: "Use the left-wall rebound to bridge the gap into all three marked red stones.",
        ja: "左端のリバウンドで隙間を越え、3つの赤い目標へつなげます。",
      },
    };
    const proof = playAuthored(options, source, witness);
    if (
      proof?.state.phase !== "won" ||
      !proof.events.some((event) => event.type === "power-drop-landed" && event.rebound)
    )
      continue;
    if (playCounterfactual(options, source, witness, "nature")?.state.phase === "won") continue;
    const authored = authoredLevel(source, "shizen", 0, options, witness, proof.events);
    authored.level.tags.push("rebound-dependency", "counterfactual-fail-without-nature");
    levels.set(authored.key, authored.level);
  }
  return levels;
}

export function shizenPairOpeningCandidates() {
  const levels = new Map();
  const height = 12;
  for (const width of [5, 6, 7, 8])
    for (const geometry of ["horizontal", "vertical"]) {
      const positions =
        geometry === "horizontal"
          ? Array.from({ length: width - 1 }, (_, index) => [index + 1, 11, index + 2, 11])
          : Array.from({ length: width }, (_, x) => [[x, 10, x, 11]]).flat();
      for (const position of positions) {
        const cells =
          geometry === "horizontal"
            ? [
                [position[0], position[1]],
                [position[2], position[3]],
              ]
            : [position.slice(0, 2), position.slice(2, 4)];
        if (cells.some(([x]) => x >= width)) continue;
        const board = Array(width * height).fill(null);
        const targetIds = [];
        cells.forEach(([x, y], index) => {
          const id = index + 1;
          board[y * width + x] = { id, colour: "red" };
          targetIds.push(id);
        });
        const orientation = cells[0][0] <= 2 ? "up" : "right";
        const queue = [
          ["red", "red"],
          ["blue", "gold"],
        ];
        const witness = [{ pivotX: 0, orientation }];
        const source = {
          id: `shizen-two-target-${geometry}-${width}-${cells[0][0]}-${cells[0][1]}`,
          width,
          height,
          colourCount: 6,
          board,
          queue,
          goal: { kind: "clear-targets", targetIds },
          tags: ["two-target-opening", "wall-rebound"],
        };
        const options = {
          seed: source.id,
          board,
          nature: true,
          magneticQueue: [
            [false, false],
            [false, false],
          ],
          title: { en: "Bridge the marked red pair", ja: "赤い目標の間をつなぐ" },
          objective: {
            en: "Use the left-wall rebound to reach the two marked red stones. Without the rebound, the gap stays open.",
            ja: "左端のリバウンドで2つの赤い目標へ届かせます。リバウンドがなければ隙間が残ります。",
          },
        };
        const proof = playAuthored(options, source, witness);
        if (
          proof?.state.phase !== "won" ||
          !proof.events.some((event) => event.type === "power-drop-landed" && event.rebound)
        )
          continue;
        if (playCounterfactual(options, source, witness, "nature")?.state.phase === "won") continue;
        const authored = authoredLevel(source, "shizen", 0, options, witness, proof.events);
        if (authored.level.score > 20) continue;
        authored.level.tags.push("rebound-dependency", "counterfactual-fail-without-nature");
        levels.set(authored.key, authored.level);
      }
    }
  return levels;
}

export function shizenSupportedTargetCandidates() {
  const levels = new Map();
  const height = 12;
  for (const width of [5, 6, 7])
    for (const towerHeight of [2, 3, 4]) {
      const targetX = 2;
      if (targetX + 2 >= width) continue;
      const board = Array(width * height).fill(null);
      const targetIds = [];
      const targetY = height - towerHeight;
      for (let dx = 0; dx < 3; dx++) {
        const targetId = dx + 1;
        board[targetY * width + targetX + dx] = { id: targetId, colour: "red" };
        targetIds.push(targetId);
        for (let support = 1; support < towerHeight; support++) {
          board[(targetY + support) * width + targetX + dx] = {
            id: 10 + dx * 4 + support,
            colour: (dx + support) % 2 ? "blue" : "green",
          };
        }
      }
      const queue = [
        ["red", "red"],
        ["blue", "gold"],
      ];
      const witness = [{ pivotX: 0, orientation: "up" }];
      const source = {
        id: `shizen-supported-row-${width}-${towerHeight}`,
        width,
        height,
        colourCount: 6,
        board,
        queue,
        goal: { kind: "clear-targets", targetIds },
        tags: ["supported-target-row", "wall-rebound"],
      };
      const options = {
        seed: source.id,
        board,
        nature: true,
        magneticQueue: [
          [false, false],
          [false, false],
        ],
        title: { en: "Rebound onto the raised row", ja: "高い列へリバウンド" },
        objective: {
          en: `Use the left-wall rebound to reach the three marked red stones above the ${towerHeight - 1}-row support.`,
          ja: `左端のリバウンドで、${towerHeight - 1}段の支えの上にある3つの赤い目標へ届かせます。`,
        },
      };
      const proof = playAuthored(options, source, witness);
      if (
        proof?.state.phase !== "won" ||
        !proof.events.some((event) => event.type === "power-drop-landed" && event.rebound)
      )
        continue;
      if (playCounterfactual(options, source, witness, "nature")?.state.phase === "won") continue;
      const authored = authoredLevel(source, "shizen", 0, options, witness, proof.events);
      if (authored.level.score > 20) continue;
      authored.level.tags.push("rebound-dependency", "counterfactual-fail-without-nature");
      levels.set(authored.key, authored.level);
    }
  return levels;
}

export function shizenReboundLaneCandidates() {
  const levels = new Map();
  const height = 12;
  for (const width of [5, 6, 7, 8])
    for (const guideHeight of [1, 2, 3]) {
      const board = Array(width * height).fill(null);
      const targetIds = [1, 2, 3];
      for (let dx = 0; dx < 3; dx++) board[11 * width + 2 + dx] = { id: dx + 1, colour: "red" };
      for (let step = 0; step < guideHeight; step++)
        board[(11 - step) * width] = { id: 20 + step, colour: step % 2 ? "green" : "blue" };
      const queue = [
        ["red", "red"],
        ["blue", "gold"],
      ];
      const witness = [{ pivotX: 0, orientation: "up" }];
      const source = {
        id: `shizen-rebound-guide-${width}-${guideHeight}`,
        width,
        height,
        colourCount: 6,
        board,
        queue,
        goal: { kind: "clear-targets", targetIds },
        tags: ["rebound-guide", "wall-rebound"],
      };
      const options = {
        seed: source.id,
        board,
        nature: true,
        magneticQueue: [
          [false, false],
          [false, false],
        ],
        title: { en: "Use the blue rebound guide", ja: "青いガイドでリバウンド" },
        objective: {
          en: `Drop the red pair onto the ${guideHeight}-stone guide in the left landing lane. Its rebound must bridge to all three marked red targets.`,
          ja: `左端の着地路にある${guideHeight}個のガイドへ赤いペアを落とします。リバウンドで3つの赤い目標へつなげましょう。`,
        },
      };
      const proof = playAuthored(options, source, witness);
      if (
        proof?.state.phase !== "won" ||
        !proof.events.some((event) => event.type === "power-drop-landed" && event.rebound)
      )
        continue;
      if (playCounterfactual(options, source, witness, "nature")?.state.phase === "won") continue;
      const authored = authoredLevel(source, "shizen", 0, options, witness, proof.events);
      if (authored.level.score > 20) continue;
      authored.level.tags.push("rebound-dependency", "counterfactual-fail-without-nature");
      levels.set(authored.key, authored.level);
    }
  return levels;
}

export function shizenLedgeOpeningCandidates() {
  const levels = new Map();
  const supportHeights = [2, 1, 2, 2, 2];
  const height = 12;
  for (const width of [6, 7]) {
    const board = Array(width * height).fill(null);
    const targetIds = [1, 2, 3];
    let id = 4;
    for (let x = 0; x < supportHeights.length; x++)
      for (let offset = 0; offset < supportHeights[x]; offset++) {
        board[(11 - offset) * width + x] = { id: id++, colour: (x + offset) % 2 ? "blue" : "green" };
      }
    for (let dx = 0; dx < 3; dx++) board[9 * width + 2 + dx] = { id: dx + 1, colour: "red" };
    const queue = [
      ["red", "red"],
      ["blue", "gold"],
    ];
    const witness = [{ pivotX: 0, orientation: "up" }];
    const source = {
      id: `shizen-low-ledge-${width}`,
      width,
      height,
      colourCount: 6,
      board,
      queue,
      goal: { kind: "clear-targets", targetIds },
      tags: ["uneven-support", "wall-rebound"],
    };
    const options = {
      seed: source.id,
      board,
      nature: true,
      magneticQueue: [
        [false, false],
        [false, false],
      ],
      title: { en: "Find the rebound over the ledge", ja: "段差越しのリバウンド" },
      objective: {
        en: "Use the changing support heights to carry the red pair into the three marked targets.",
        ja: "高さの異なる支えを使い、赤いペアを3つの目標へ導きます。",
      },
    };
    const proof = playAuthored(options, source, witness);
    if (
      proof?.state.phase !== "won" ||
      !proof.events.some((event) => event.type === "power-drop-landed" && event.rebound)
    )
      continue;
    if (playCounterfactual(options, source, witness, "nature")?.state.phase === "won") continue;
    const authored = authoredLevel(source, "shizen", 0, options, witness, proof.events);
    authored.level.tags.push("rebound-dependency", "counterfactual-fail-without-nature");
    levels.set(authored.key, authored.level);
  }
  return levels;
}
