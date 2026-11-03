import {
  advancedShizenPrototypes,
  arashiCausalPrototype,
  arashiConstructionBlueprints,
  arashiThreeTargetPrototype,
  shizenConstructionBlueprints,
  shizenFourWaveRestorePrototype,
} from "../nature-campaign-levels.mjs";
import { cell, HEIGHT, WIDTH } from "./core.mjs";
import { natureMetrics } from "./nature-metrics.mjs";
import { playAuthored, playCounterfactual } from "./shizen-candidates.mjs";

function prototypeMetricSummary(source, options, witness, campaign) {
  const proof = playAuthored(options, source, witness);
  if (proof?.state.phase !== "won") return { campaign, valid: false, witnessLength: witness.length };
  const measured = natureMetrics(source, options, witness, proof.events);
  const counterfactual = playCounterfactual(
    options,
    source,
    witness,
    campaign === "arashi"
      ? "weather"
      : proof.events.some((event) => event.type === "magnetic-pulse" && event.moves?.length)
        ? "magnetism"
        : "nature",
  );
  const eventEvidence = proof.events
    .filter((event) =>
      ["magnetic-pulse", "power-drop-landed", "weather-triggered", "jumble-completed", "lightning-struck"].includes(
        event.type,
      ),
    )
    .map((event) => ({
      type: event.type,
      ...(event.kind ? { kind: event.kind } : {}),
      ...(event.turn ? { turn: event.turn } : {}),
      ...(event.rebound !== undefined ? { rebound: event.rebound } : {}),
      ...(event.moves?.length ? { moved: event.moves.length } : {}),
      ...(event.removedIds?.length ? { removedIds: event.removedIds } : {}),
    }));
  return {
    campaign,
    valid: true,
    id: source.id,
    witnessLength: witness.length,
    score: measured.score,
    rawDifficultyScore: measured.rawDifficultyScore,
    metrics: measured.rawMetrics,
    mechanicOffPhase: counterfactual?.state.phase ?? "invalid",
    events: eventEvidence,
  };
}

/** Small, reviewable construction set; intentionally does not generate the full campaign. */
export function generateNaturePrototypeReport() {
  const prototypes = [];
  const introBoard = Array(WIDTH * HEIGHT).fill(null);
  introBoard[cell(2, 11)] = { id: 1, colour: "red" };
  introBoard[cell(3, 11)] = { id: 2, colour: "red" };
  introBoard[cell(4, 11)] = { id: 3, colour: "red" };
  introBoard[cell(0, 11)] = { id: 4, colour: "blue" };
  introBoard[cell(0, 10)] = { id: 5, colour: "red", magnetic: true };
  introBoard[cell(5, 11)] = { id: 6, colour: "green" };
  introBoard[cell(5, 10)] = { id: 7, colour: "red", magnetic: true };
  const introSource = {
    id: "prototype-shizen-attraction-opening",
    width: WIDTH,
    height: HEIGHT,
    colourCount: 6,
    board: introBoard,
    queue: [
      ["blue", "gold"],
      ["green", "teal"],
    ],
    goal: { kind: "clear-targets", targetIds: [1, 2, 3] },
    tags: [],
  };
  const introOptions = {
    seed: "shizen-attraction-opening",
    board: introBoard,
    nature: true,
    magneticQueue: [
      [false, false],
      [false, false],
    ],
  };
  prototypes.push(prototypeMetricSummary(introSource, introOptions, [{ pivotX: 0, orientation: "up" }], "shizen"));
  const shizenIntro = shizenConstructionBlueprints.find((level) => level.witness.length === 1);
  if (shizenIntro)
    prototypes.push(
      prototypeMetricSummary(
        { ...shizenIntro, id: `prototype-${shizenIntro.id}` },
        {
          seed: shizenIntro.seed,
          board: shizenIntro.board,
          nature: true,
          ...(shizenIntro.weather ? { weather: shizenIntro.weather } : {}),
          ...(shizenIntro.magneticQueue ? { magneticQueue: shizenIntro.magneticQueue } : {}),
        },
        shizenIntro.witness,
        "shizen",
      ),
    );
  for (const [index, spec] of advancedShizenPrototypes.entries()) {
    const board = Array(WIDTH * HEIGHT).fill(null);
    for (const [at, id, colour, magnetic] of spec.board)
      board[at] = { id, colour, ...(magnetic ? { magnetic: true } : {}) };
    const source = {
      id: `prototype-shizen-${index + 1}`,
      width: WIDTH,
      height: HEIGHT,
      colourCount: 6,
      board,
      queue: spec.queue,
      goal: { kind: "clear-targets", targetIds: [1, 2, 3] },
      tags: [],
    };
    prototypes.push(
      prototypeMetricSummary(
        source,
        { seed: spec.seed, board, nature: true, magneticQueue: spec.magneticQueue },
        spec.witness,
        "shizen",
      ),
    );
  }
  const coordinatedShizen = advancedShizenPrototypes[18];
  if (coordinatedShizen) {
    const board = Array(WIDTH * HEIGHT).fill(null);
    for (const [at, id, colour, magnetic] of coordinatedShizen.board)
      board[at] = { id, colour, ...(magnetic ? { magnetic: true } : {}) };
    const source = {
      id: "prototype-shizen-three-wave-target-coordination",
      width: WIDTH,
      height: HEIGHT,
      colourCount: 6,
      board,
      queue: coordinatedShizen.queue,
      goal: { kind: "clear-targets", targetIds: [1, 2, 3, 9, 10, 11, 13, 14] },
      tags: [],
    };
    prototypes.push(
      prototypeMetricSummary(
        source,
        { seed: coordinatedShizen.seed, board, nature: true, magneticQueue: coordinatedShizen.magneticQueue },
        coordinatedShizen.witness,
        "shizen",
      ),
    );
  }
  const restoreBoard = Array(WIDTH * HEIGHT).fill(null);
  let restoreId = 1;
  for (let y = 0; y < HEIGHT; y++)
    for (let x = 0; x < WIDTH; x++) {
      const colour = shizenFourWaveRestorePrototype.rows[y][x];
      if (colour !== ".") restoreBoard[cell(x, y)] = { id: restoreId++, colour };
    }
  const restoreSource = {
    id: "prototype-shizen-four-wave-restore",
    width: WIDTH,
    height: HEIGHT,
    colourCount: 4,
    board: restoreBoard,
    queue: shizenFourWaveRestorePrototype.queue,
    goal: shizenFourWaveRestorePrototype.goal,
    tags: [],
  };
  prototypes.push(
    prototypeMetricSummary(
      restoreSource,
      {
        seed: shizenFourWaveRestorePrototype.seed,
        board: restoreBoard,
        nature: true,
        magneticQueue: shizenFourWaveRestorePrototype.magneticQueue,
      },
      shizenFourWaveRestorePrototype.witness,
      "shizen",
    ),
  );
  const weatherIntro = arashiConstructionBlueprints.find((level) => level.witness.length === 4);
  if (weatherIntro)
    prototypes.push(
      prototypeMetricSummary(
        { ...weatherIntro, id: `prototype-${weatherIntro.id}` },
        { seed: weatherIntro.seed, board: weatherIntro.board, nature: true, weather: "frequent" },
        weatherIntro.witness,
        "arashi",
      ),
    );
  const causalSource = {
    id: "prototype-arashi-causal-jumble-lightning",
    width: WIDTH,
    height: HEIGHT,
    colourCount: 6,
    board: arashiCausalPrototype.board,
    queue: arashiCausalPrototype.queue,
    goal: arashiCausalPrototype.goal,
    tags: [],
  };
  prototypes.push(
    prototypeMetricSummary(
      causalSource,
      { seed: arashiCausalPrototype.seed, board: causalSource.board, nature: true, weather: "frequent" },
      arashiCausalPrototype.witness,
      "arashi",
    ),
  );
  const coordinatedSource = {
    id: "prototype-arashi-three-target-coordination",
    width: WIDTH,
    height: HEIGHT,
    colourCount: 6,
    board: arashiThreeTargetPrototype.board,
    queue: arashiThreeTargetPrototype.queue,
    goal: arashiThreeTargetPrototype.goal,
    tags: [],
  };
  prototypes.push(
    prototypeMetricSummary(
      coordinatedSource,
      { seed: arashiThreeTargetPrototype.seed, board: coordinatedSource.board, nature: true, weather: "frequent" },
      arashiThreeTargetPrototype.witness,
      "arashi",
    ),
  );
  const width = 6;
  const height = 12;
  const board = Array(width * height).fill(null);
  board[8 * width + 5] = { id: 1, colour: "red" };
  board[9 * width + 5] = { id: 10, colour: "blue" };
  board[10 * width + 5] = { id: 11, colour: "green" };
  board[11 * width + 5] = { id: 12, colour: "gold" };
  board[8 * width + 4] = { id: 13, colour: "gold" };
  board[9 * width + 4] = { id: 14, colour: "purple" };
  board[10 * width + 4] = { id: 2, colour: "blue" };
  board[11 * width + 4] = { id: 15, colour: "teal" };
  board[10 * width] = { id: 3, colour: "purple" };
  board[11 * width] = { id: 4, colour: "red" };
  board[10 * width + 1] = { id: 5, colour: "blue" };
  board[11 * width + 1] = { id: 6, colour: "green" };
  const longQueue = Array.from({ length: 8 }, () => ["blue", "green"]);
  const longWitness = Array.from({ length: 8 }, (_, index) => ({ pivotX: 2 + (index % 2), orientation: "up" }));
  const longSource = {
    id: "prototype-arashi-dual-target-weather",
    width,
    height,
    colourCount: 6,
    board,
    queue: longQueue,
    goal: { kind: "clear-targets", targetIds: [1, 2] },
    tags: [],
  };
  prototypes.push(
    prototypeMetricSummary(
      longSource,
      { seed: "arashi-dualtarget-292", board, nature: true, weather: "frequent" },
      longWitness,
      "arashi",
    ),
  );
  return prototypes;
}
