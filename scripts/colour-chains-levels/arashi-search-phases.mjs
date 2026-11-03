import { NATURE_GENERATION_REVISION, rng } from "./core.mjs";
import { authoredLevel } from "./nature-metrics.mjs";
import { playAuthored, playAuthoredRaw, playCounterfactual } from "./shizen-candidates.mjs";

export function addSearchedCandidates(candidates) {
  const width = 6;
  const height = 12;
  const colourCount = 6;
  // A broad, sparse board teaches the scheduled strike as an accessible entry
  // mechanic: the marked lane is tall, all four placements stay on its far
  // side, and only lightning can remove the target. Width/lane are structural.
  for (const boardWidth of [8, 9, 10, 11, 12, 13, 14, 15, 16])
    for (let targetX = 1; targetX < boardWidth; targetX++) {
      const board = Array(boardWidth * height).fill(null);
      const targetId = 50_001 + boardWidth * 100 + targetX;
      board[targetX] = { id: targetId, colour: "red" };
      for (let y = 1; y < height; y++)
        board[y * boardWidth + targetX] = { id: targetId + y, colour: y % 2 ? "green" : "purple" };
      const queue = Array.from({ length: 4 }, () => ["blue", "gold"]);
      const witness = Array.from({ length: 4 }, () => ({ pivotX: 0, orientation: "up" }));
      const source = {
        id: `arashi-open-lightning-lane-${boardWidth}-${targetX}`,
        width: boardWidth,
        height,
        colourCount,
        board,
        queue,
        goal: { kind: "clear-targets", targetIds: [targetId] },
        tags: ["scheduled-lightning", "open-lane"],
      };
      const title = { en: "Keep the marked lane open", ja: "目標の列を空けておく" };
      const objective = {
        en: "Keep all four pairs away from the marked tower. The turn-two shuffle passes, then turn-four lightning removes the exposed target.",
        ja: "4組すべてを目標の塔から離して置きます。2手目の入れ替えの後、4手目の雷で露出した目標を消しましょう。",
      };
      for (let seedIndex = 1; seedIndex <= 80; seedIndex++) {
        const seed =
          boardWidth === 16 && targetX === 15 && seedIndex === 1
            ? "weather-entry-1"
            : `arashi-open-lane-${boardWidth}-${targetX}-${seedIndex}`;
        const options = {
          seed,
          board,
          nature: true,
          weather: "frequent",
          magneticQueue: queue.map(() => [false, false]),
          title,
          objective,
        };
        const raw = playAuthoredRaw(options, source, witness);
        if (raw?.state.phase !== "won") continue;
        const strike = raw.events.find((event) => event.type === "lightning-struck");
        if (!strike?.columns?.includes(targetX) || !strike.removedIds?.includes(targetId)) continue;
        const withoutWeather = playCounterfactual(options, source, witness, "weather");
        if (withoutWeather?.state.phase === "won") continue;
        const proof = playAuthored(options, source, witness);
        if (proof?.state.phase !== "won") continue;
        const authored = authoredLevel(source, "arashi", 0, options, witness, proof.events);
        authored.level.tags.push("lightning-dependency", "counterfactual-fail-without-weather");
        if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
        break;
      }
    }
  // Two independently exposed towers make the strike-column plan a real
  // choice. These compact widths place the same weather lesson in the easy
  // band without assigning difficulty by level position.
  for (const boardWidth of [8, 9, 10, 11, 12])
    for (let firstX = 1; firstX < boardWidth - 2; firstX++)
      for (let secondX = firstX + 3; secondX < boardWidth; secondX++) {
        const board = Array(boardWidth * height).fill(null);
        const targetXs = [firstX, secondX];
        const targetIds = targetXs.map((_, index) => 60_001 + boardWidth * 100 + firstX * 10 + secondX + index);
        let supportId = 1;
        for (const [towerIndex, targetX] of targetXs.entries()) {
          board[targetX] = { id: targetIds[towerIndex], colour: towerIndex ? "gold" : "red" };
          for (let y = 1; y < height; y++)
            board[y * boardWidth + targetX] = { id: supportId++, colour: (y + towerIndex) % 2 ? "green" : "purple" };
        }
        const queue = Array.from({ length: 4 }, () => ["blue", "gold"]);
        const witness = Array.from({ length: 4 }, () => ({ pivotX: 0, orientation: "up" }));
        const source = {
          id: `arashi-dual-open-lanes-${boardWidth}-${firstX}-${secondX}`,
          width: boardWidth,
          height,
          colourCount,
          board,
          queue,
          goal: { kind: "clear-targets", targetIds },
          tags: ["dual-strike-lanes", "scheduled-lightning"],
        };
        const title = { en: "Keep both target lanes clear", ja: "2つの目標列を空ける" };
        const objective = {
          en: "Place each pair away from both marked towers. Turn-four lightning must reach both exposed targets.",
          ja: "各ペアを2つの塔から離して置きます。4手目の雷が露出した両方の目標へ届く必要があります。",
        };
        for (let seedIndex = 1; seedIndex <= 48; seedIndex++) {
          const options = {
            seed: `arashi-dual-lane-${boardWidth}-${firstX}-${secondX}-${seedIndex}`,
            board,
            nature: true,
            weather: "frequent",
            magneticQueue: queue.map(() => [false, false]),
            title,
            objective,
          };
          const raw = playAuthoredRaw(options, source, witness);
          if (raw?.state.phase !== "won") continue;
          const strike = raw.events.find((event) => event.type === "lightning-struck");
          if (!targetIds.every((id) => strike?.removedIds?.includes(id))) continue;
          if (playCounterfactual(options, source, witness, "weather")?.state.phase === "won") continue;
          const proof = playAuthored(options, source, witness);
          if (proof?.state.phase !== "won") continue;
          const authored = authoredLevel(source, "arashi", 0, options, witness, proof.events);
          if (authored.level.score < 21 || authored.level.score > 40) continue;
          authored.level.tags.push("lightning-dependency", "dual-strike-lanes", "counterfactual-fail-without-weather");
          if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
          break;
        }
      }
  const safeColours = ["blue", "green", "gold", "purple", "teal"];
  for (let serial = 1; serial <= 1_200 && candidates.size < 80; serial++) {
    const targetX = serial % width;
    const dropXs = [0, 1, 2, 3, 4, 5].filter((x) => x !== targetX);
    const planOffset = Math.floor(serial / width) % dropXs.length;
    const witness = Array.from({ length: 4 }, (_, index) => ({
      pivotX: dropXs[(planOffset + index) % dropXs.length],
      orientation: "up",
    }));
    const board = Array(width * height).fill(null);
    board[(height - 1) * width + targetX] = { id: 1, colour: "red" };
    // Keep the target exposed above two supports. The four placements must leave its strike column open.
    board[(height - 2) * width + targetX] = { id: 2, colour: "green" };
    board[(height - 3) * width + targetX] = { id: 3, colour: "gold" };
    let nextId = 4;
    const decorationCount = serial % 3;
    const random = rng(`${NATURE_GENERATION_REVISION}|arashi-board|${serial}`);
    const usedColumns = new Set([targetX]);
    for (let i = 0; i < decorationCount; i++) {
      let column = Math.floor(random() * width);
      let attempts = 0;
      while (usedColumns.has(column) && attempts++ < width) column = (column + 1) % width;
      if (usedColumns.has(column)) break;
      usedColumns.add(column);
      const stack = 1 + Math.floor(random() * 3);
      for (let depth = 0; depth < stack; depth++)
        board[(height - 1 - depth) * width + column] = {
          id: nextId++,
          colour: safeColours[Math.floor(random() * safeColours.length)],
        };
    }
    const palette = [
      ...safeColours.slice(serial % safeColours.length),
      ...safeColours.slice(0, serial % safeColours.length),
    ];
    const queue = Array.from({ length: 4 }, (_, index) => [
      palette[(index * 2) % palette.length],
      palette[(index * 2 + 1) % palette.length],
    ]);
    const source = {
      id: `arashi-${serial}`,
      width,
      height,
      colourCount,
      board,
      queue,
      goal: { kind: "clear-targets", targetIds: [1] },
      tags: [],
    };
    const seed = `arashi:${NATURE_GENERATION_REVISION}:${serial}`;
    const options = { seed, board, nature: true, weather: "frequent" };
    const outcome = playAuthored(options, source, witness);
    if (outcome?.state.phase !== "won") continue;
    const weather = outcome.events.filter((event) => event.type === "weather-triggered");
    if (
      !weather.some((event) => event.kind === "jumble" && event.turn === 2) ||
      !weather.some((event) => event.kind === "lightning" && event.turn === 4)
    )
      continue;
    if (
      !outcome.events.some((event) => event.type === "jumble-completed" && event.changed === true) ||
      !outcome.events.some((event) => event.type === "lightning-struck" && event.removedIds?.includes(1))
    )
      continue;
    const withoutWeather = playCounterfactual(options, source, witness, "weather");
    if (!withoutWeather || withoutWeather.state.phase === "won") continue;
    const names = [
      [
        { en: "Keep the target exposed", ja: "目標を露出させる" },
        {
          en: "Leave the target clear through the jumble, then let turn-four lightning remove it.",
          ja: "目標の列を地震の後まで空けておき、4手目の雷で消しましょう。",
        },
      ],
      [
        { en: "Save a path for lightning", ja: "雷への道を残す" },
        {
          en: "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          ja: "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。",
        },
      ],
      [
        { en: "After the jumble", ja: "地震の後に" },
        {
          en: "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          ja: "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。",
        },
      ],
    ];
    const [title, objective] = names[(targetX + decorationCount) % names.length];
    const variantOptions = { ...options, title, objective };
    const authored = authoredLevel(source, "arashi", 0, variantOptions, witness, outcome.events);
    if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
  }
}
