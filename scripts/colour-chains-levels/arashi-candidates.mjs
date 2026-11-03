import { cell, HEIGHT, WIDTH } from "./core.mjs";
import { authoredLevel } from "./nature-metrics.mjs";
import { playAuthored, playAuthoredRaw, playCounterfactual } from "./shizen-candidates.mjs";

export function arashiCausalCandidatePool(minimum = 100) {
  const candidates = new Map();
  const targetPositions = [];
  for (let y = 1; y <= 2; y++) for (let x = 3; x <= 5; x++) targetPositions.push(y * WIDTH + x);
  const plans = [
    {
      queue: [
        ["blue", "gold"],
        ["green", "purple"],
        ["teal", "blue"],
        ["gold", "green"],
      ],
      xs: [0, 1, 0, 0],
    },
    {
      queue: [
        ["green", "purple"],
        ["teal", "blue"],
        ["gold", "green"],
        ["blue", "gold"],
      ],
      xs: [1, 0, 1, 1],
    },
    {
      queue: [
        ["teal", "blue"],
        ["blue", "gold"],
        ["green", "purple"],
        ["gold", "green"],
      ],
      xs: [0, 2, 1, 0],
    },
  ];
  const colors = ["red", "blue", "gold", "purple", "teal"];
  let pattern = 0;
  for (const targetCount of [2, 3]) {
    const familyStart = candidates.size;
    const choose = (start, selected) => {
      if (selected.length === targetCount) {
        const targets = selected.map((position, index) => [position, 9001 + index, colors[index]]);
        const board = Array(WIDTH * HEIGHT).fill(null);
        let id = 1;
        const targetByCell = new Map(
          targets.map(([position, targetId, colour]) => [position, { id: targetId, colour }]),
        );
        for (let y = 0; y < HEIGHT; y++)
          for (let x = 3; x <= 5; x++) {
            const position = cell(x, y);
            const target = targetByCell.get(position);
            board[position] = target ?? {
              id: id++,
              colour: ["blue", "green", "gold", "purple", "teal"][(2 * x + y) % 5],
            };
            if (target) id++;
          }
        const targetIds = targets.map(([, targetId]) => targetId);
        const signature = selected.join("-");
        pattern++;
        for (const [planIndex, plan] of plans.entries())
          for (let seedIndex = 1; seedIndex <= 300 && candidates.size - familyStart < minimum; seedIndex++) {
            const witness = plan.xs.map((pivotX) => ({ pivotX, orientation: "up" }));
            const source = {
              id: `arashi-coordinated-${pattern}-${planIndex}`,
              width: WIDTH,
              height: HEIGHT,
              colourCount: 6,
              board,
              queue: plan.queue,
              goal: { kind: "clear-targets", targetIds },
              tags: [],
            };
            const options = {
              seed: `arashi-causal-${targetCount}-${signature}-${planIndex}-${seedIndex}`,
              board,
              nature: true,
              weather: "frequent",
            };
            const proof = playAuthoredRaw(options, source, witness);
            if (proof?.state.phase !== "won") continue;
            const jumble = proof.events.find((event) => event.type === "jumble-completed" && event.changed);
            const lightning = proof.events.find((event) => event.type === "lightning-struck");
            if (
              !jumble?.moves?.some((move) => targetIds.includes(move.id)) ||
              !targetIds.every((targetId) => lightning?.removedIds?.includes(targetId))
            )
              continue;
            const withoutWeather = playCounterfactual(options, source, witness, "weather");
            if (withoutWeather?.state.phase === "won") continue;
            const title =
              targetCount === 3
                ? { en: "Route three targets into lightning", ja: "3つの目標を雷へ導く" }
                : { en: "Expose both targets after the jumble", ja: "地震の後に2つの目標を露出" };
            const objective =
              targetCount === 3
                ? {
                    en: "Use the turn-two shuffle to expose all three marked stones, then keep each strike column clear until turn-four lightning.",
                    ja: "2手目の入れ替えで3つの目標を露出させ、4手目の雷まで各列を空けておきましょう。",
                  }
                : {
                    en: "The turn-two shuffle must expose both marked stones; preserve their lightning columns until turn four.",
                    ja: "2手目の入れ替えで2つの目標を露出させ、4手目まで雷の列を守りましょう。",
                  };
            const verified = playAuthored(options, source, witness);
            if (verified?.state.phase !== "won") continue;
            const authored = authoredLevel(
              source,
              "arashi",
              0,
              { ...options, title, objective },
              witness,
              verified.events,
            );
            authored.level.tags.push(
              "jumble-dependency",
              "lightning-coordination",
              `${targetCount}-target-coordination`,
              "counterfactual-fail-without-weather",
            );
            if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
          }
        return;
      }
      for (let index = start; index < targetPositions.length && candidates.size - familyStart < minimum; index++)
        choose(index + 1, [...selected, targetPositions[index]]);
    };
    choose(0, []);
  }
  return candidates;
}

/** Search a bounded family where clearing a blue guard steers the later jumble away from the guard area. */
export function arashiGuardedCandidatePool(minimum = 8) {
  const candidates = new Map();
  const guardIds = [9101, 9102, 9103];
  const queue = [
    ["blue", "blue"],
    ["green", "green"],
    ["gold", "gold"],
    ["teal", "teal"],
  ];
  const witness = [0, 0, 0, 0].map((pivotX) => ({ pivotX, orientation: "up" }));
  const colors = ["blue", "green", "gold", "purple", "teal"];
  const positions = Array.from({ length: 9 }, (_, index) => [3 + (index % 3), Math.floor(index / 3)]);
  const combinations = (count, start = 0, chosen = []) =>
    chosen.length === count
      ? [chosen]
      : positions
          .slice(start)
          .flatMap((_, offset) => combinations(count, start + offset + 1, [...chosen, start + offset]));
  let pattern = 0;
  for (const targetCount of [2, 3])
    for (const indices of combinations(targetCount)) {
      const targetIds = Array.from({ length: targetCount }, (_, index) => 9001 + index);
      const targetChoices = indices.map((index) => positions[index]);
      const board = Array(WIDTH * HEIGHT).fill(null);
      let id = 1;
      for (let y = 0; y < HEIGHT; y++)
        for (let x = 3; x <= 5; x++) {
          const targetIndex = targetChoices.findIndex(([tx, ty]) => tx === x && ty === y);
          board[cell(x, y)] =
            targetIndex >= 0
              ? { id: targetIds[targetIndex], colour: ["red", "blue", "gold"][targetIndex] }
              : { id: id++, colour: colors[(2 * x + y) % colors.length] };
        }
      for (let y = 9; y <= 11; y++) board[cell(0, y)] = { id: guardIds[y - 9], colour: "blue" };
      pattern++;
      const source = {
        id: `arashi-guarded-${pattern}`,
        width: WIDTH,
        height: HEIGHT,
        colourCount: 6,
        board,
        queue,
        goal: { kind: "clear-targets", targetIds: [...guardIds, ...targetIds] },
        tags: [],
      };
      const title = { en: "Clear the guard before the shuffle", ja: "入れ替え前に守りを消す" };
      const objective = {
        en: `Clear the three blue guards with the first pair. This removes the left jumble patch; then preserve the ${targetCount} exposed marked targets for the turn-four strike.`,
        ja: `最初のペアで青い守りを3つ消しましょう。左の地震区画がなくなったら、4手目の雷まで${targetCount}つの目標を守ります。`,
      };
      for (let seedIndex = 1; seedIndex <= 160 && candidates.size < minimum; seedIndex++) {
        const options = {
          seed: `arashi-guard-route-${pattern}-${seedIndex}`,
          board,
          nature: true,
          weather: "frequent",
          magneticQueue: queue.map(() => [false, false]),
          title,
          objective,
        };
        const raw = playAuthoredRaw(options, source, witness);
        if (raw?.state.phase !== "won") continue;
        const clearedGuardIds = new Set(
          raw.events.filter((event) => event.type === "cells-cleared").flatMap((event) => event.ids ?? []),
        );
        const jumble = raw.events.find((event) => event.type === "jumble-completed" && event.changed);
        const strike = raw.events.find((event) => event.type === "lightning-struck");
        if (
          !guardIds.every((target) => clearedGuardIds.has(target)) ||
          !targetIds.some((target) => jumble?.moves?.some((move) => move.id === target)) ||
          !targetIds.every((target) => strike?.removedIds?.includes(target)) ||
          guardIds.some((target) => strike?.removedIds?.includes(target))
        )
          continue;
        const wrongFirst = playAuthoredRaw(options, source, [{ pivotX: 1, orientation: "up" }, ...witness.slice(1)]);
        const wrongClear = wrongFirst?.events.some(
          (event) => event.type === "cells-cleared" && guardIds.every((target) => event.ids?.includes(target)),
        );
        if (wrongFirst?.state.phase === "won" && wrongClear) continue;
        const withoutWeather = playCounterfactual(options, source, witness, "weather");
        if (withoutWeather?.state.phase === "won") continue;
        const proof = playAuthored(options, source, witness);
        if (proof?.state.phase !== "won") continue;
        const authored = authoredLevel(source, "arashi", 0, { ...options, title, objective }, witness, proof.events);
        authored.level.tags.push(
          "jumble-dependency",
          "lightning-coordination",
          "cleared-guard-steers-jumble",
          "counterfactual-fail-without-weather",
        );
        if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
      }
    }
  return candidates;
}

/** A two-clear setup makes both the first work choice and later weather patch depend on the route. */
export function arashiDoubleGuardCandidatePool(minimum = 8) {
  const candidates = new Map();
  const guardIds = [9101, 9102, 9103, 9201, 9202, 9203];
  const queue = [
    ["blue", "blue"],
    ["green", "green"],
    ["gold", "gold"],
    ["teal", "teal"],
  ];
  const witness = [0, 1, 0, 0].map((pivotX) => ({ pivotX, orientation: "up" }));
  const positions = Array.from({ length: 9 }, (_, index) => [3 + (index % 3), Math.floor(index / 3)]);
  const combinations = (count, start = 0, chosen = []) =>
    chosen.length === count
      ? [chosen]
      : positions
          .slice(start)
          .flatMap((_, offset) => combinations(count, start + offset + 1, [...chosen, start + offset]));
  const colors = ["blue", "green", "gold", "purple", "teal"];
  let pattern = 0;
  for (const targetCount of [2, 3])
    for (const indices of combinations(targetCount)) {
      const targetIds = Array.from({ length: targetCount }, (_, index) => 9301 + index);
      const targetChoices = indices.map((index) => positions[index]);
      const board = Array(WIDTH * HEIGHT).fill(null);
      let id = 1;
      for (let y = 0; y < HEIGHT; y++)
        for (let x = 3; x <= 5; x++) {
          const targetIndex = targetChoices.findIndex(([tx, ty]) => tx === x && ty === y);
          board[cell(x, y)] =
            targetIndex >= 0
              ? { id: targetIds[targetIndex], colour: ["red", "blue", "gold"][targetIndex] }
              : { id: id++, colour: colors[(2 * x + y) % colors.length] };
        }
      for (let y = 9; y <= 11; y++) {
        board[cell(1, y)] = { id: guardIds[y - 9], colour: "blue" };
        board[cell(2, y)] = { id: guardIds[y - 6], colour: "green" };
      }
      pattern++;
      const source = {
        id: `arashi-double-guard-${pattern}`,
        width: WIDTH,
        height: HEIGHT,
        colourCount: 6,
        board,
        queue,
        goal: { kind: "clear-targets", targetIds: [...guardIds, ...targetIds] },
        tags: [],
      };
      const title = { en: "Clear both guards to steer the shuffle", ja: "2つの守りを消して地震を導く" };
      const objective = {
        en: "Clear the blue guard with pair one and the green guard with pair two. With both work columns clear, the turn-two jumble can select the marked target area; preserve those targets for the turn-four strike.",
        ja: "1組目で青、2組目で緑の守りを消します。作業列を空けると2手目の地震が目標区画を選べます。4手目の雷まで目標を守りましょう。",
      };
      for (let seedIndex = 1; seedIndex <= 160 && candidates.size < minimum; seedIndex++) {
        const options = {
          seed: `arashi-double-guard-${pattern}-${seedIndex}`,
          board,
          nature: true,
          weather: "frequent",
          magneticQueue: queue.map(() => [false, false]),
          title,
          objective,
        };
        const raw = playAuthoredRaw(options, source, witness);
        if (raw?.state.phase !== "won") continue;
        const cleared = new Set(
          raw.events.filter((event) => event.type === "cells-cleared").flatMap((event) => event.ids ?? []),
        );
        const jumble = raw.events.find((event) => event.type === "jumble-completed" && event.changed);
        const strike = raw.events.find((event) => event.type === "lightning-struck");
        if (
          !guardIds.every((target) => cleared.has(target)) ||
          !targetIds.some((target) => jumble?.moves?.some((move) => move.id === target)) ||
          !targetIds.every((target) => strike?.removedIds?.includes(target))
        )
          continue;
        const wrongFirst = playAuthoredRaw(options, source, [{ pivotX: 1, orientation: "up" }, ...witness.slice(1)]);
        if (wrongFirst?.state.phase === "won") continue;
        const withoutWeather = playCounterfactual(options, source, witness, "weather");
        if (withoutWeather?.state.phase === "won") continue;
        const proof = playAuthored(options, source, witness);
        if (proof?.state.phase !== "won") continue;
        const authored = authoredLevel(source, "arashi", 0, { ...options, title, objective }, witness, proof.events);
        authored.level.tags.push(
          "jumble-dependency",
          "lightning-coordination",
          "double-guard-steers-jumble",
          "counterfactual-fail-without-weather",
        );
        if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
      }
    }
  return candidates;
}

export function arashiHeadroomEntryCandidates() {
  const candidates = new Map();
  const height = 12;
  const colourCount = 6;
  for (const width of [13, 14, 15, 16])
    for (let targetX = 1; targetX < width; targetX++) {
      const board = Array(width * height).fill(null);
      const targetId = 1;
      board[width + targetX] = { id: targetId, colour: "red" };
      for (let y = 2; y < height; y++)
        board[y * width + targetX] = { id: y + 1, colour: y % 2 === 0 ? "purple" : "green" };
      const queue = Array.from({ length: 4 }, () => ["blue", "gold"]);
      const witness = Array.from({ length: 4 }, () => ({ pivotX: 0, orientation: "up" }));
      const source = {
        id: `arashi-headroom-lane-${width}-${targetX}`,
        width,
        height,
        colourCount,
        board,
        queue,
        goal: { kind: "clear-targets", targetIds: [targetId] },
        tags: ["scheduled-lightning", "headroom-target", "open-lane"],
      };
      const title = { en: "Leave space above the target", ja: "目標の上に空間を残す" };
      const objective = {
        en: "Keep the marked lane clear. Lightning removes its exposed target from below the empty row above it.",
        ja: "目標の列を空けておきます。上に空間を残した目標を、4手目の雷で消しましょう。",
      };
      for (let seedIndex = 1; seedIndex <= 128; seedIndex++) {
        const seed =
          width === 16 && targetX === 15 && seedIndex === 1
            ? "weather-entry-1"
            : `weather-headroom-${width}-${targetX}-${seedIndex}`;
        const options = { seed, board, nature: true, weather: "frequent", title, objective };
        const proof = playAuthored(options, source, witness);
        if (proof?.state.phase !== "won") continue;
        const strike = proof.events.find((event) => event.type === "lightning-struck");
        if (!strike?.removedIds?.includes(targetId)) continue;
        if (playCounterfactual(options, source, witness, "weather")?.state.phase === "won") continue;
        const authored = authoredLevel(source, "arashi", 0, options, witness, proof.events);
        authored.level.tags.push("lightning-dependency", "counterfactual-fail-without-weather");
        if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
        break;
      }
    }
  return candidates;
}
