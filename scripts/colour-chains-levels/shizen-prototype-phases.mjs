import {
  advancedShizenPrototypes,
  shizenFourWaveLayouts,
  shizenFourWaveRestorePrototype,
} from "../nature-campaign-levels.mjs";
import { cell } from "./core.mjs";
import { authoredLevel, natureMetrics } from "./nature-metrics.mjs";
import { playAuthored, playCounterfactual } from "./shizen-candidates.mjs";

export function addFourWaveCandidates(unique) {
  const width = 6;
  const height = 12;
  const restoreBoard = Array(width * height).fill(null);
  let restoreId = 1;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const colour = shizenFourWaveRestorePrototype.rows[y][x];
      if (colour !== ".") restoreBoard[cell(x, y)] = { id: restoreId++, colour };
    }
  const restoreSource = {
    id: "shizen-four-wave-restore",
    width,
    height,
    colourCount: 4,
    board: restoreBoard,
    queue: shizenFourWaveRestorePrototype.queue,
    goal: shizenFourWaveRestorePrototype.goal,
    tags: ["minimum-chain", "gravity-setup", "setup-dependency"],
  };
  const restoreOptions = {
    seed: shizenFourWaveRestorePrototype.seed,
    board: restoreBoard,
    nature: true,
    magneticQueue: shizenFourWaveRestorePrototype.magneticQueue,
    title: { en: "Restore the gold step", ja: "金の段差を戻す" },
    objective: {
      en: "Use the first rebound to restore the gold at the top of the cascade. The second pair starts four required clearing waves.",
      ja: "最初のリバウンドで連鎖の頂上に金を戻します。2組目で4段の必須連鎖を起こします。",
    },
  };
  const restoreProof = playAuthored(restoreOptions, restoreSource, shizenFourWaveRestorePrototype.witness);
  const restorePlain = playCounterfactual(
    restoreOptions,
    restoreSource,
    shizenFourWaveRestorePrototype.witness,
    "nature",
  );
  if (
    restoreProof?.state.phase === "won" &&
    restoreProof.state.maxChain >= 4 &&
    restoreProof.events.some((event) => event.type === "power-drop-landed" && event.rebound) &&
    restorePlain?.state.phase !== "won"
  ) {
    const authored = authoredLevel(
      restoreSource,
      "shizen",
      0,
      restoreOptions,
      shizenFourWaveRestorePrototype.witness,
      restoreProof.events,
    );
    authored.level.tags.push("minimum-chain-dependency", "rebound-dependency", "counterfactual-fail-without-nature");
    unique.set(authored.key, authored.level);
  }
  for (const [index, layout] of shizenFourWaveLayouts.entries()) {
    const board = Array(width * height).fill(null);
    const removed = new Set(layout.remove.map(([x, y]) => cell(x, y)));
    let gemId = 1;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const colour = shizenFourWaveRestorePrototype.rows[y][x];
        if (colour !== "." && !removed.has(cell(x, y))) board[cell(x, y)] = { id: gemId++, colour };
      }
    const source = {
      id: `shizen-four-wave-layout-${index + 1}`,
      width,
      height,
      colourCount: 4,
      board,
      queue: shizenFourWaveRestorePrototype.queue,
      goal: shizenFourWaveRestorePrototype.goal,
      tags: ["minimum-chain", "gravity-setup", "setup-dependency"],
    };
    const options = {
      seed: "review:shizen-variant",
      board,
      nature: true,
      magneticQueue: shizenFourWaveRestorePrototype.magneticQueue,
      title: { en: "Restore the gold step", ja: "金の段差を戻す" },
      objective: {
        en: "Use the rebound to restore the cascade route, then trigger the required four-wave clear.",
        ja: "リバウンドで連鎖の道を戻し、必須の4段連鎖を起こしましょう。",
      },
    };
    const proof = playAuthored(options, source, layout.witness);
    const plain = playCounterfactual(options, source, layout.witness, "nature");
    if (
      proof?.state.phase !== "won" ||
      proof.state.maxChain < 4 ||
      !proof.events.some((event) => event.type === "power-drop-landed" && event.rebound) ||
      plain?.state.phase === "won"
    )
      continue;
    const authored = authoredLevel(source, "shizen", 0, options, layout.witness, proof.events);
    authored.level.tags.push(
      "minimum-chain-dependency",
      "rebound-dependency",
      "counterfactual-fail-without-nature",
      "cascade-route-variant",
    );
    if (!unique.has(authored.key)) unique.set(authored.key, authored.level);
  }
  // The same causal rebound route supports a measured cascade progression.
  // Admit a shorter minimum only when its sampled wins or consequential
  // deviations differ from the four-wave objective on the identical board.
  for (const layout of [{ remove: [], witness: shizenFourWaveRestorePrototype.witness }, ...shizenFourWaveLayouts]) {
    const board = Array(width * height).fill(null);
    const removed = new Set(layout.remove.map(([x, y]) => cell(x, y)));
    let gemId = 1;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const colour = shizenFourWaveRestorePrototype.rows[y][x];
        if (colour !== "." && !removed.has(cell(x, y))) board[cell(x, y)] = { id: gemId++, colour };
      }
    const options = {
      seed: "review:shizen-variant",
      board,
      nature: true,
      magneticQueue: shizenFourWaveRestorePrototype.magneticQueue,
    };
    const baselineSource = {
      id: "shizen-cascade-comparison",
      width,
      height,
      colourCount: 4,
      board,
      queue: shizenFourWaveRestorePrototype.queue,
      goal: { kind: "minimum-chain", chain: 4 },
      tags: ["minimum-chain", "gravity-setup", "setup-dependency"],
    };
    const baselineProof = playAuthored(options, baselineSource, layout.witness);
    if (baselineProof?.state.phase !== "won") continue;
    const baseline = natureMetrics(baselineSource, options, layout.witness, baselineProof.events);
    for (const chain of [2, 3]) {
      const source = {
        ...baselineSource,
        id: `shizen-cascade-progression-${chain}`,
        goal: { kind: "minimum-chain", chain },
      };
      const proof = playAuthored(options, source, layout.witness);
      if (proof?.state.phase !== "won" || proof.state.maxChain < chain) continue;
      if (
        !proof.events.some((event) => event.type === "power-drop-landed" && event.rebound) ||
        playCounterfactual(options, source, layout.witness, "nature")?.state.phase === "won"
      )
        continue;
      const measured = natureMetrics(source, options, layout.witness, proof.events);
      if (
        measured.rawMetrics.seededPlayoutSuccesses === baseline.rawMetrics.seededPlayoutSuccesses &&
        measured.rawMetrics.singleStepDeviationWins === baseline.rawMetrics.singleStepDeviationWins
      )
        continue;
      const authored = authoredLevel(
        source,
        "shizen",
        0,
        {
          ...options,
          title: { en: `Require a ${chain}-wave cascade`, ja: `${chain}段連鎖を目標に` },
          objective: {
            en: `Restore the missing support with the first rebound. The next pair must produce at least ${chain} dependent clearing waves.`,
            ja: `最初のリバウンドで欠けた支えを戻します。次のペアで少なくとも${chain}段の連鎖を起こしましょう。`,
          },
        },
        layout.witness,
        proof.events,
      );
      authored.level.tags.push(
        "minimum-chain-dependency",
        "rebound-dependency",
        "cascade-progression",
        "counterfactual-fail-without-nature",
      );
      if (!unique.has(authored.key)) unique.set(authored.key, authored.level);
    }
  }
}

export function addAdvancedPrototypes(unique) {
  const width = 6;
  const height = 12;
  const colourCount = 6;
  for (let index = 0; index < advancedShizenPrototypes.length; index++) {
    const prototype = advancedShizenPrototypes[index];
    const board = Array(width * height).fill(null);
    for (const [at, id, colour, magnetic] of prototype.board)
      board[at] = { id, colour, ...(magnetic ? { magnetic: true } : {}) };
    let source = {
      id: `magnetic-setup-${index + 1}`,
      width,
      height,
      colourCount,
      board,
      queue: prototype.queue,
      goal: { kind: "clear-targets", targetIds: [1, 2, 3] },
      tags: [],
    };
    const options = { seed: prototype.seed, board, nature: true, magneticQueue: prototype.magneticQueue };
    let outcome = playAuthored(options, source, prototype.witness);
    if (outcome?.state.phase !== "won") continue;
    const pulseMoves = outcome.events
      .filter((event) => event.type === "magnetic-pulse")
      .flatMap((event) => event.moves ?? []);
    const rebound = outcome.events.some((event) => event.type === "power-drop-landed" && event.rebound);
    if (!pulseMoves.length || !rebound) continue;
    if (prototype.witness.length > 1) {
      const startingIds = new Set(board.filter(Boolean).map((gem) => gem.id));
      const setupTargets = [
        ...new Set(
          outcome.events
            .filter((event) => event.type === "cells-cleared")
            .flatMap((event) => event.ids ?? [])
            .filter((id) => startingIds.has(id)),
        ),
      ];
      if (setupTargets.length > source.goal.targetIds.length) {
        const coordinatedSource = {
          ...source,
          id: `${source.id}-coordinated-goal`,
          goal: { kind: "clear-targets", targetIds: setupTargets },
        };
        const coordinatedOutcome = playAuthored(options, coordinatedSource, prototype.witness);
        const coordinatedOff = playCounterfactual(options, coordinatedSource, prototype.witness, "magnetism");
        if (coordinatedOutcome?.state.phase === "won" && coordinatedOff?.state.phase !== "won") {
          source = coordinatedSource;
          outcome = coordinatedOutcome;
        }
      }
    }
    const attractionDependent = pulseMoves.length > 0;
    const plain = playCounterfactual(options, source, prototype.witness, attractionDependent ? "magnetism" : "nature");
    if (plain?.state.phase === "won") continue;
    const isThreeStep = prototype.witness.length >= 3;
    const levelOptions = {
      ...options,
      title: isThreeStep
        ? { en: "Build two clearings", ja: "2つの連鎖を準備" }
        : { en: "Pulse, then rebound", ja: "磁力の後にリバウンド" },
      objective: isThreeStep
        ? {
            en: "Clear both setup colours first. Watch the magnetic pulse pull the gap closed, then place the marked red pair for the rebound finish.",
            ja: "先に2色の準備を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。",
          }
        : {
            en: "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
            ja: "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。",
          },
    };
    const authored = authoredLevel(source, "shizen", 0, levelOptions, prototype.witness, outcome.events);
    authored.level.tags.push(
      "setup-dependency",
      ...(attractionDependent ? ["magnetic-attraction"] : []),
      ...(rebound ? ["rebound-dependency"] : []),
      "counterfactual-fail-without-nature",
    );
    if (!unique.has(authored.key)) unique.set(authored.key, authored.level);
  }
  // Real boundary-sensitive variants of the authored multi-pair plans. Moving
  // the entire occupied structure changes edge distances and legal landing
  // space; retain only reverified attraction/rebound-dependent outcomes.
  for (let index = 0; index < advancedShizenPrototypes.length; index++) {
    const prototype = advancedShizenPrototypes[index];
    if (prototype.witness.length < 2) continue;
    for (const boardWidth of [7, 8, 9, 10])
      for (let shift = 0; shift <= boardWidth - 6; shift++) {
        const board = Array(boardWidth * height).fill(null);
        for (const [at, id, colour, magnetic] of prototype.board) {
          const oldX = at % 6;
          const y = Math.floor(at / 6);
          const x = oldX + shift;
          board[y * boardWidth + x] = { id, colour, ...(magnetic ? { magnetic: true } : {}) };
        }
        const witness = prototype.witness.map((step) => ({ ...step, pivotX: step.pivotX + shift }));
        const queue = prototype.queue;
        let source = {
          id: `shizen-boundary-${index + 1}-${boardWidth}-${shift}`,
          width: boardWidth,
          height,
          colourCount,
          board,
          queue,
          goal: { kind: "clear-targets", targetIds: [1, 2, 3] },
          tags: ["setup-dependency", "boundary-sensitive-route"],
        };
        const options = { seed: prototype.seed, board, nature: true, magneticQueue: prototype.magneticQueue };
        let outcome = playAuthored(options, source, witness);
        if (outcome?.state.phase !== "won") continue;
        const moved = outcome.events.some((event) => event.type === "magnetic-pulse" && event.moves?.length);
        const rebound = outcome.events.some((event) => event.type === "power-drop-landed" && event.rebound);
        if (!moved && !rebound) continue;
        if (witness.length > 1) {
          const startingIds = new Set(board.filter(Boolean).map((gem) => gem.id));
          const setupTargets = [
            ...new Set(
              outcome.events
                .filter((event) => event.type === "cells-cleared")
                .flatMap((event) => event.ids ?? [])
                .filter((id) => startingIds.has(id)),
            ),
          ];
          if (setupTargets.length > source.goal.targetIds.length) {
            const coordinated = { ...source, goal: { kind: "clear-targets", targetIds: setupTargets } };
            const coordinatedOutcome = playAuthored(options, coordinated, witness);
            const coordinatedOff = playCounterfactual(options, coordinated, witness, "magnetism");
            if (coordinatedOutcome?.state.phase === "won" && coordinatedOff?.state.phase !== "won") {
              source = coordinated;
              outcome = coordinatedOutcome;
            }
          }
        }
        const counterfactual = playCounterfactual(options, source, witness, moved ? "magnetism" : "nature");
        if (counterfactual?.state.phase === "won") continue;
        const title = { en: "Route the pair around the edge", ja: "端を回ってペアを導く" };
        const objective = {
          en: "The wider board changes the magnetic reach and rebound route. Clear the setup targets, then finish the marked group from the verified landing column.",
          ja: "幅広い盤面では磁力の届く範囲とリバウンド経路が変わります。準備の目標を消し、確認済みの着地点から最後の組を決めましょう。",
        };
        const authored = authoredLevel(source, "shizen", 0, { ...options, title, objective }, witness, outcome.events);
        authored.level.tags.push(
          "boundary-sensitive-route",
          ...(moved ? ["magnetic-attraction"] : []),
          ...(rebound ? ["rebound-dependency"] : []),
          "counterfactual-fail-without-nature",
        );
        if (!unique.has(authored.key)) unique.set(authored.key, authored.level);
      }
  }
}
