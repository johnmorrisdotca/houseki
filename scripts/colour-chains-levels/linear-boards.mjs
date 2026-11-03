import { advanceTicks, applyAction, createChallenge } from "../../dist/colour-chains.js";
import {
  COLOURS,
  cell,
  GENERATION_REVISION,
  GRADING_VERSION,
  HEIGHT,
  hash,
  rng,
  SAMPLE_BUDGET,
  SHAPES,
  scoreFor,
  WIDTH,
} from "./core.mjs";

export function initialBoard(serial) {
  const random = rng(`${GENERATION_REVISION}|board|${serial}`);
  const shape = SHAPES[serial % SHAPES.length];
  const shift = Math.floor(random() * (WIDTH - 3));
  const targetColour = COLOURS[Math.floor(random() * COLOURS.length)];
  const board = Array(WIDTH * HEIGHT).fill(null);
  const targets = new Set();
  for (const [dx, y] of shape.cells) {
    const at = cell(shift + dx, y);
    board[at] = targetColour;
    targets.add(at);
  }
  const targetColumns = new Set([...targets].map((at) => at % WIDTH));
  const openApproaches = new Set();
  for (const at of targets) {
    const x = at % WIDTH;
    const y = Math.floor(at / WIDTH);
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (nx >= 0 && nx < WIDTH && ny >= 0 && ny < HEIGHT && !targets.has(cell(nx, ny))) openApproaches.add(nx);
    }
  }
  // Add only stable supports and side stacks; each is checked before selection.
  const safeColours = COLOURS.filter((colour) => colour !== targetColour);
  for (let x = 0; x < WIDTH; x++) {
    const topTarget = Math.min(
      ...[...targets].filter((at) => at % WIDTH === x).map((at) => Math.floor(at / WIDTH)),
      HEIGHT,
    );
    if (topTarget < HEIGHT) {
      for (let y = topTarget + 1; y < HEIGHT; y++)
        if (!board[cell(x, y)]) board[cell(x, y)] = safeColours[(x + y + serial) % safeColours.length];
    } else if (!targetColumns.has(x) && !openApproaches.has(x)) {
      const stackHeight = Math.floor(random() * 7);
      for (let y = HEIGHT - stackHeight; y < HEIGHT; y++)
        board[cell(x, y)] = safeColours[Math.floor(random() * safeColours.length)];
    }
  }
  return { board, targets: [...targets].sort((a, b) => a - b), targetColour, shape: shape.tag };
}
export function withIds(colours) {
  let id = 1;
  return colours.map((colour) => (colour ? { id: id++, colour } : null));
}
export function hasInitialMatch(board) {
  const seen = new Set();
  for (let index = 0; index < board.length; index++) {
    if (!board[index] || seen.has(index)) continue;
    const queue = [index];
    const colour = board[index];
    const cells = [];
    seen.add(index);
    while (queue.length) {
      const at = queue.pop();
      cells.push(at);
      const x = at % WIDTH;
      const y = Math.floor(at / WIDTH);
      for (const [nx, ny] of [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ]) {
        const next = ny * WIDTH + nx;
        if (nx >= 0 && nx < WIDTH && ny >= 0 && ny < HEIGHT && !seen.has(next) && board[next] === colour) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    if (cells.length >= 4) return true;
  }
  return false;
}
export function stableColumns(board) {
  for (let x = 0; x < WIDTH; x++) {
    let gap = false;
    for (let y = HEIGHT - 1; y >= 0; y--) {
      if (!board[cell(x, y)]) gap = true;
      else if (gap) return false;
    }
  }
  return true;
}
export function playPlacement(start, placement) {
  let state = start;
  const events = [];
  const act = (kind) => {
    const result = applyAction(state, { kind });
    if (!result.accepted) return false;
    state = result.state;
    events.push(...result.events);
    return true;
  };
  while (state.active.pivot.x !== placement.pivotX)
    if (!act(state.active.pivot.x < placement.pivotX ? "right" : "left")) return null;
  const orientationIndex = { up: 0, right: 1, down: 2, left: 3 };
  for (let turns = 0; turns < (orientationIndex[placement.orientation] + 4) % 4; turns++)
    if (!act("rotate-clockwise")) return null;
  if (!act("hard-drop")) return null;
  let work = 0;
  while (["clear-mark", "clear-remove", "gravity"].includes(state.phase) && work < 100_000) {
    const result = advanceTicks(state, 3600);
    state = result.state;
    events.push(...result.events);
    work += 3600;
  }
  return { state, events };
}
export function canonicalKey(level) {
  const variants = [];
  for (const mirror of [false, true]) {
    const labels = new Map();
    const label = (colour) => {
      if (!labels.has(colour)) labels.set(colour, labels.size);
      return labels.get(colour);
    };
    const board = [];
    for (let y = 0; y < level.height; y++)
      for (let px = 0; px < level.width; px++) {
        const x = mirror ? level.width - 1 - px : px;
        const gem = level.board[cell(x, y)];
        board.push(
          gem
            ? [label(gem.colour), level.goal.kind === "clear-targets" && level.goal.targetIds.includes(gem.id)]
            : null,
        );
      }
    const queue = level.queue.map((pair) => pair.map(label));
    const goal =
      level.goal.kind === "clear-targets"
        ? {
            kind: "clear-targets",
            targets: level.goal.targetIds
              .map((id) => {
                const at = level.board.findIndex((gem) => gem?.id === id);
                const x = at % level.width;
                return Math.floor(at / level.width) * level.width + (mirror ? level.width - 1 - x : x);
              })
              .sort((a, b) => a - b),
          }
        : level.goal;
    variants.push(JSON.stringify([level.width, level.height, level.colourCount, goal, board, queue]));
  }
  return variants.sort()[0];
}
export function candidate(serial) {
  const boardData = initialBoard(serial);
  if (!stableColumns(boardData.board) || hasInitialMatch(boardData.board)) return null;
  const board = withIds(boardData.board);
  const targetIds = boardData.targets.map((at) => board[at].id);
  const otherColours = COLOURS.filter((colour) => colour !== boardData.targetColour);
  const queue = [
    [boardData.targetColour, otherColours[0]],
    [otherColours[1], otherColours[2]],
  ];
  const goal = { kind: "clear-targets", targetIds };
  const base = {
    id: `candidate-${serial}`,
    width: WIDTH,
    height: HEIGHT,
    colourCount: 4,
    seed: `${GENERATION_REVISION}:${serial}`,
    board,
    queue,
    goal,
  };
  let start = null;
  const placements = [];
  for (let pivotX = 0; pivotX < WIDTH; pivotX++)
    for (const orientation of ["up", "right", "down", "left"]) placements.push({ pivotX, orientation });
  for (const placement of placements) {
    try {
      start = createChallenge({ ...base, witness: [placement] });
      break;
    } catch {
      /* Try the next legal winning placement as the proof. */
    }
  }
  if (!start) return null;
  const wins = [];
  const all = [];
  for (const placement of placements) {
    const outcome = playPlacement(start, placement);
    if (outcome) {
      all.push({ placement, outcome });
      if (outcome.state.phase === "won") wins.push({ placement, outcome });
    }
  }
  if (!wins.length || !all.length) return null;
  const random = rng(`${GENERATION_REVISION}|playouts|${serial}`);
  let successes = 0;
  for (let i = 0; i < SAMPLE_BUDGET; i++)
    if (all[Math.floor(random() * all.length)]?.outcome.state.phase === "won") successes++;
  const witnessChoice = wins.reduce((best, item) => {
    const rotations = item.placement.orientation === "up" ? 0 : item.placement.orientation === "down" ? 2 : 1;
    const bestRotations = best.placement.orientation === "up" ? 0 : best.placement.orientation === "down" ? 2 : 1;
    return rotations + Math.abs(item.placement.pivotX - 2) < bestRotations + Math.abs(best.placement.pivotX - 2)
      ? item
      : best;
  });
  const placement = witnessChoice.placement;
  const event = witnessChoice.outcome.events.find((item) => item.type === "pair-locked");
  const cells = event?.cells ?? [];
  const ids = event?.ids ?? [];
  const settledY = ids.map(
    (id, i) =>
      witnessChoice.outcome.events
        .flatMap((item) => (item.type === "cells-fell" ? item.cells : []))
        .find((move) => move.id === id)?.to.y ?? cells[i]?.y,
  );
  const split =
    ["left", "right"].includes(placement.orientation) && settledY.length === 2 && settledY[0] !== settledY[1];
  const requiredRotations = placement.orientation === "up" ? 0 : placement.orientation === "down" ? 2 : 1;
  const requiredWallKicks = witnessChoice.outcome.events.filter(
    (item) => item.type === "pair-rotated" && (item.kick.x !== 0 || item.kick.y !== 0),
  ).length;
  const metrics = {
    placementProbes: WIDTH * 4,
    legalPlacements: all.length,
    goalPreservingPlacements: wins.length,
    forcedPlacementShare: wins.length === 1 ? 1 : 0,
    seededPlayoutSamples: SAMPLE_BUDGET,
    seededPlayoutQueueDepth: 1,
    seededPlayoutSuccesses: successes,
    seededPlayoutSuccessRate: Number((successes / SAMPLE_BUDGET).toFixed(6)),
    setupPairsBeforePayoff: 0,
    requiredSetupPairs: 0,
    verifiedSetupDependencies: 0,
    requiredChainDepth: 1,
    requiredRotations,
    requiredWallKicks,
    splitLandingDependencies: split ? 1 : 0,
    planningLength: 1,
  };
  const level = {
    id: `chains-${hash(JSON.stringify([boardData.board, boardData.targets, boardData.shape])).slice(0, 12)}`,
    number: 0,
    title: {
      en: `Linked stones: ${boardData.shape}`,
      ja: `つながる石：${{ "horizontal-link": "横のつながり", "corner-link": "角のつながり", "vertical-link": "縦のつながり", "split-link": "段差のつながり", "stepped-link": "階段のつながり" }[boardData.shape]}`,
    },
    canonicalKeyHash: "",
    width: WIDTH,
    height: HEIGHT,
    colourCount: 4,
    seed: `${GENERATION_REVISION}:${serial}`,
    board,
    queue,
    goal,
    witness: [placement],
    tags: [boardData.shape, ...(requiredRotations ? ["rotation"] : []), ...(split ? ["split-landing"] : [])],
    rawMetrics: metrics,
    score: 0,
    marks: 1,
    gradingVersion: GRADING_VERSION,
    proofStatus: "engine-witness-verified",
    reviewStatus: "human-review-pending",
  };
  level.canonicalKeyHash = hash(canonicalKey(level));
  level.score = scoreFor(metrics);
  level.marks = Math.min(5, 1 + Math.floor(level.score / 20));
  return { level, key: canonicalKey(level) };
}
export function splitCandidate(serial) {
  const boardColours = Array(WIDTH * HEIGHT).fill(null);
  const row = 5 + (serial % 5);
  const shift = serial % 2;
  const targetIdsPositions = [];
  for (let x = shift; x < shift + 3; x++) {
    const at = cell(x, row);
    boardColours[at] = "red";
    targetIdsPositions.push(at);
  }
  const safe = ["blue", "green", "gold"];
  for (let x = shift; x < shift + 4; x++)
    for (let y = row + 1; y < HEIGHT; y++) boardColours[cell(x, y)] = safe[(x + y + serial) % safe.length];
  const satelliteX = shift + 4;
  const supportDepth = 1 + (serial % Math.max(1, HEIGHT - row - 1));
  for (let y = HEIGHT - supportDepth; y < HEIGHT; y++)
    boardColours[cell(satelliteX, y)] = safe[(y + serial + 1) % safe.length];
  const farX = shift === 0 ? 5 : 0;
  const farHeight = serial % 4;
  for (let y = HEIGHT - farHeight; y < HEIGHT; y++) boardColours[cell(farX, y)] = safe[(y * 2 + serial) % safe.length];
  if (!stableColumns(boardColours) || hasInitialMatch(boardColours)) return null;
  const board = withIds(boardColours);
  const targetIds = targetIdsPositions.map((at) => board[at].id);
  const queue = [
    ["red", "blue"],
    ["green", "gold"],
  ];
  const goal = { kind: "clear-targets", targetIds };
  const witness = { pivotX: shift + 3, orientation: "right" };
  const base = {
    id: `split-${serial}`,
    width: WIDTH,
    height: HEIGHT,
    colourCount: 4,
    seed: `${GENERATION_REVISION}:split:${serial}`,
    board,
    queue,
    goal,
  };
  let start;
  try {
    start = createChallenge({ ...base, witness: [witness] });
  } catch {
    return null;
  }
  const legal = [];
  const wins = [];
  for (let pivotX = 0; pivotX < WIDTH; pivotX++)
    for (const orientation of ["up", "right", "down", "left"]) {
      const placement = { pivotX, orientation };
      const outcome = playPlacement(start, placement);
      if (!outcome) continue;
      legal.push(outcome);
      if (outcome.state.phase === "won") wins.push({ placement, outcome });
    }
  const expected = wins.find(
    (item) => item.placement.pivotX === witness.pivotX && item.placement.orientation === witness.orientation,
  );
  if (!expected || !legal.length) return null;
  const locked = expected.outcome.events.find((item) => item.type === "pair-locked");
  const finalY = locked.ids.map(
    (id, index) =>
      expected.outcome.events
        .flatMap((item) => (item.type === "cells-fell" ? item.cells : []))
        .find((move) => move.id === id)?.to.y ?? locked.cells[index].y,
  );
  if (finalY[0] === finalY[1]) return null;
  const randomPlayout = rng(`${GENERATION_REVISION}|split-samples|${serial}`);
  let successes = 0;
  for (let i = 0; i < SAMPLE_BUDGET; i++)
    if (legal[Math.floor(randomPlayout() * legal.length)]?.state.phase === "won") successes++;
  const metrics = {
    placementProbes: WIDTH * 4,
    legalPlacements: legal.length,
    goalPreservingPlacements: wins.length,
    forcedPlacementShare: wins.length === 1 ? 1 : 0,
    seededPlayoutSamples: SAMPLE_BUDGET,
    seededPlayoutQueueDepth: 1,
    seededPlayoutSuccesses: successes,
    seededPlayoutSuccessRate: Number((successes / SAMPLE_BUDGET).toFixed(6)),
    setupPairsBeforePayoff: 0,
    requiredSetupPairs: 0,
    verifiedSetupDependencies: 0,
    requiredChainDepth: 1,
    requiredRotations: 1,
    requiredWallKicks: 0,
    splitLandingDependencies: 1,
    planningLength: 1,
  };
  const level = {
    id: `chains-${hash(JSON.stringify([boardColours, targetIdsPositions, "split"])).slice(0, 12)}`,
    number: 0,
    title: { en: "Split landing: close the row", ja: "段差着地：横一列を完成" },
    canonicalKeyHash: "",
    width: WIDTH,
    height: HEIGHT,
    colourCount: 4,
    seed: base.seed,
    board,
    queue,
    goal,
    witness: [witness],
    tags: ["split-landing", "rotation"],
    rawMetrics: metrics,
    score: scoreFor(metrics),
    marks: 1,
    gradingVersion: GRADING_VERSION,
    proofStatus: "engine-witness-verified",
    reviewStatus: "human-review-pending",
  };
  level.canonicalKeyHash = hash(canonicalKey(level));
  level.marks = Math.min(5, 1 + Math.floor(level.score / 20));
  return { level, key: canonicalKey(level) };
}
