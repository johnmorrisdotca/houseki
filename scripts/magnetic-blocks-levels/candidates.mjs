import { applyAction, createGame } from "../../dist/magnetic-blocks.js";
import {
  actionPath,
  advanceToInput,
  choices,
  HEIGHT,
  hash,
  palette,
  prove,
  proveWithWitness,
  WIDTH,
} from "./search.mjs";

export const REVISION = "magnetic-blocks-campaign-2";
export const GRADING = "full-plan-and-interaction-evidence-2";
export function openCandidate(serial) {
  const widths = [4, 5, 6, 7, 8];
  const heights = [6, 8, 10, 12];
  const width = widths[Math.floor(serial / 16) % widths.length];
  const height = heights[Math.floor(serial / 80) % heights.length];
  const vertical = Math.floor(serial / 144) % 2 === 1;
  const shapeIndex = Math.floor(serial / 288) % 3;
  const extent = vertical ? width : width - 2;
  const targetStart = (serial * 7 + Math.floor(serial / 11)) % (extent + 1);
  const targetY = height - 3;
  const initialBoard = Array(width * height).fill(null);
  const targetIds = [];
  const targetCells = Array.from({ length: 3 }, (_, i) =>
    vertical ? [targetStart, targetY + i] : [targetStart + i, height - 1],
  );
  let id = 1;
  for (const [x, y] of targetCells) {
    initialBoard[y * width + x] = { id, colour: "red" };
    targetIds.push(id++);
  }
  // A bottom-connected asymmetric shelf changes actual landing options. Its
  // profile is included in the geometry key and never exists as inert padding.
  const profileCode = Math.floor(serial / 576);
  for (let x = 0; x < width; x++) {
    if (targetCells.some(([tx]) => tx === x && !vertical)) continue;
    if (vertical && x === targetStart) continue;
    const heightHere = (Math.floor(serial / 5 ** (x % 5)) + profileCode + x * 3) % 5;
    for (let d = 0; d < heightHere; d++) {
      const y = height - 1 - d;
      if (initialBoard[y * width + x]) continue;
      initialBoard[y * width + x] = { id: id++, colour: palette[(x + d + shapeIndex) % palette.length] };
    }
  }
  // Rotate which corners carry red across all nonempty patterns; the four
  // corners remain a genuine placement decision rather than a seed variant.
  const redMask = serial % 4 === 0 ? 15 : 1 + ((serial + Math.floor(serial / 5)) % 15);
  const colours = ["blue", "green", "gold", "purple"].map((colour, corner) =>
    redMask & (1 << corner) ? "red" : colour,
  );
  const options = {
    mode: "relaxed",
    width,
    height,
    colourCount: 6,
    seed: `magnetic-open-${serial}`,
    initialBoard,
    queue: [colours],
    pieceLimit: 1,
    schedule: { kind: "fixed", floor: "calm" },
    goal: { kind: "clear-targets", targetIds },
  };
  try {
    const proof = prove(options);
    if (proof.witness?.state.phase !== "won") return null;
    return {
      serial,
      options,
      witness: proof.witness.actions,
      legalPlacementChoices: proof.legalPlacementChoices,
      setupPlacementChoices: 0,
      winningPlacementChoices: proof.winningPlacementChoices,
      witnessPlacements: proof.witness.state.placements,
      witnessFloorDecisions: proof.witness.decisions,
      interactionDepth: 0,
      setupDecisionPressure: 0,
      necessaryFloorDecisionShare: 0,
      exactFullPlanWins: proof.winningPlacementChoices,
      exactFullPlanTrials: proof.legalPlacementChoices,
      variant: 5,
      targetGroupCount: 1,
    };
  } catch {
    return null;
  }
}
export function doubleTargetCandidate(serial) {
  const widths = [4, 6, 8];
  const heights = [10, 12];
  const width = widths[Math.floor(serial / 8) % widths.length];
  const height = heights[Math.floor(serial / 24) % heights.length];
  const targetX = (serial * 3 + Math.floor(serial / 5)) % (width - 1);
  const initialBoard = Array(width * height).fill(null);
  const targetIds = [];
  let id = 1;
  for (const y of [height - 4, height - 3, height - 2]) {
    const gem = { id: id++, colour: "red" };
    initialBoard[y * width + targetX] = gem;
    targetIds.push(gem.id);
  }
  for (const y of [height - 7, height - 6, height - 5]) {
    const gem = { id: id++, colour: "red" };
    initialBoard[y * width + targetX + 1] = gem;
    targetIds.push(gem.id);
  }
  initialBoard[(height - 1) * width + targetX] = { id: id++, colour: "blue" };
  for (let y = height - 4; y < height; y++)
    initialBoard[y * width + targetX + 1] = { id: id++, colour: ["gold", "purple", "teal", "blue"][y - (height - 4)] };
  for (let x = 0; x < width; x++) {
    if (x === targetX || x === targetX + 1) continue;
    const heightHere = (Math.floor(serial / 7 ** (x % 3)) + x + Math.floor(serial / 9)) % 4;
    for (let depth = 0; depth < heightHere; depth++) {
      const y = height - 1 - depth;
      initialBoard[y * width + x] = { id: id++, colour: palette[(x + depth * 2) % palette.length] };
    }
  }
  const options = {
    mode: "relaxed",
    width,
    height,
    colourCount: 6,
    seed: `magnetic-two-target-${serial}`,
    initialBoard,
    queue: [["red", "red", "red", "red"]],
    pieceLimit: 1,
    schedule: { kind: "fixed", floor: "magnetic" },
    goal: { kind: "clear-targets", targetIds },
  };
  try {
    const proof = prove(options);
    if (proof.witness?.state.phase !== "won") return null;
    const calmOptions = structuredClone(options);
    calmOptions.schedule = { kind: "fixed", floor: "calm" };
    const calmResult = proveWithWitness(calmOptions, proof.witness.actions).phase;
    if (calmResult === "won") return null;
    return {
      serial,
      options,
      witness: proof.witness.actions,
      legalPlacementChoices: proof.legalPlacementChoices,
      setupPlacementChoices: 0,
      winningPlacementChoices: proof.winningPlacementChoices,
      witnessPlacements: 1,
      witnessFloorDecisions: proof.witness.decisions,
      interactionDepth: 0,
      setupDecisionPressure: 0,
      necessaryFloorDecisionShare: 1,
      exactFullPlanWins: proof.winningPlacementChoices,
      exactFullPlanTrials: proof.legalPlacementChoices,
      counterfactualResult: calmResult,
      variant: 8,
      targetGroupCount: 2,
    };
  } catch {
    return null;
  }
}
export function layeredCandidate(serial, requireSwitch = true) {
  const shift = Math.floor(serial / 4) % 2;
  const mirror = Math.floor(serial / 8) % 2 === 1;
  const towerHeight = 4 + (serial % 4);
  const width = WIDTH;
  const height = HEIGHT;
  const targetX = 3 + shift;
  const initialBoard = Array(width * height).fill(null);
  const targetIds = [];
  let id = 1;
  const put = (x, y, colour, target = false) => {
    const gem = { id: id++, colour };
    initialBoard[y * width + x] = gem;
    if (target) targetIds.push(gem.id);
  };
  // The lower blue and green bars are separate support layers. Removing them
  // in queue order lowers the red column twice before the final split.
  for (let dx = -1; dx <= 1; dx++) put(targetX + dx, 10, "blue", true);
  for (let dx = -1; dx <= 1; dx++) put(targetX + dx, 11, "green", true);
  for (let y = 7; y <= 9; y++) put(targetX, y, "red", true);
  const towerX = targetX + (mirror ? -1 : 1);
  const colours = ["gold", "purple", "teal", "gold", "purple", "teal", "gold", "purple", "teal"];
  for (let i = 0; i < towerHeight; i++) put(towerX, 10 - towerHeight + i, colours[i]);
  const outerX = (serial & 1) === 0 ? 0 : width - 1;
  const outerHeight = Math.floor(serial / 16) % 5;
  for (let i = 0; i < outerHeight; i++) put(outerX, height - 1 - i, ["teal", "gold", "purple", "teal", "gold"][i]);
  if (mirror) {
    const reflected = Array(width * height).fill(null);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) reflected[y * width + width - 1 - x] = initialBoard[y * width + x];
    initialBoard.splice(0, initialBoard.length, ...reflected);
  }
  const queue = [
    ["blue", "gold", "purple", "teal"],
    ["blue", "gold", "green", "purple"],
    ["gold", "purple", "teal", "red"],
  ];
  if (mirror)
    for (const piece of queue) {
      [piece[0], piece[1]] = [piece[1], piece[0]];
      [piece[2], piece[3]] = [piece[3], piece[2]];
    }
  const options = {
    mode: "relaxed",
    width,
    height,
    colourCount: 6,
    seed: `magnetic-layer-${serial}`,
    initialBoard,
    queue,
    pieceLimit: 3,
    schedule: requireSwitch ? { kind: "fixed", floor: "calm" } : { kind: "authored", magneticPlacements: [3] },
    floorSwitch: requireSwitch,
    magneticImpact: false,
    goal: { kind: "clear-targets", targetIds },
  };
  const xs = mirror ? [1 - shift, 6 - shift, 3 - shift] : [5 + shift, shift, 3 + shift];
  const witness = [];
  let state = createGame(options);
  for (let i = 0; i < 3; i++) {
    const p = actionPath(state, xs[i], 0, requireSwitch && i === 2 ? "magnetic" : null);
    if (!p || ["lost", "finished"].includes(p.state.phase)) return null;
    witness.push(...p.actions);
    state = p.state;
  }
  if (state.phase !== "won") return null;
  const calmOptions = structuredClone(options);
  calmOptions.schedule = { kind: "fixed", floor: "calm" };
  calmOptions.floorSwitch = false;
  const calmActions = witness.filter((action) => action.kind !== "set-floor-override");
  let floorAlternative;
  try {
    floorAlternative = proveWithWitness(calmOptions, calmActions).phase;
  } catch {
    return null;
  }
  if (requireSwitch && floorAlternative === "won") return null;
  const groups = [];
  let group = [];
  for (const action of witness) {
    group.push(action);
    if (action.kind === "hard-drop") {
      groups.push(group);
      group = [];
    }
  }
  let finalStart = createGame(options);
  finalStart = applyGroup(finalStart, groups[0]);
  finalStart = applyGroup(finalStart, groups[1]);
  const finalChoices = choices(finalStart);
  const setupEvidence = measureSetupPressure(options, witness);
  let causalState = createGame(options);
  let remaining = targetIds.length;
  const targetIdsClearedByPlacement = [];
  const targetIdsRemainingAfterPlacement = [];
  const targetIdsMovedByPlacement = [];
  for (const actionGroup of groups) {
    const before = new Map(
      targetIds.map((targetId) => [targetId, causalState.board.findIndex((gem) => gem?.id === targetId)]),
    );
    causalState = applyGroup(causalState, actionGroup);
    const after = targetIds.filter((targetId) => causalState.board.some((gem) => gem?.id === targetId)).length;
    const moved = targetIds.filter((targetId) => {
      const oldIndex = before.get(targetId);
      const newIndex = causalState.board.findIndex((gem) => gem?.id === targetId);
      return oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex;
    }).length;
    targetIdsClearedByPlacement.push(remaining - after);
    targetIdsRemainingAfterPlacement.push(after);
    remaining = after;
    targetIdsMovedByPlacement.push(moved);
  }
  return {
    serial,
    options,
    witness,
    legalPlacementChoices: finalChoices.length,
    setupPlacementChoices: choices(createGame(options)).length,
    winningPlacementChoices: finalChoices.filter((choice) => choice.state.phase === "won").length,
    witnessPlacements: state.placements,
    witnessFloorDecisions: requireSwitch ? 1 : 0,
    interactionDepth: requireSwitch ? 2 : 1,
    setupDecisionPressure: setupEvidence.pressure,
    setupEvidence: setupEvidence.steps,
    targetIdsClearedByPlacement,
    targetIdsRemainingAfterPlacement,
    targetIdsMovedByPlacement,
    necessaryFloorDecisionShare: requireSwitch ? 1 : 0,
    counterfactualResult: floorAlternative,
    variant: requireSwitch ? 6 : 7,
    layerEvidence: true,
  };
}
function measureSetupPressure(options, witness) {
  const groups = [];
  let group = [];
  for (const action of witness) {
    group.push(action);
    if (action.kind === "hard-drop" || action.kind === "land") {
      groups.push(group);
      group = [];
    }
  }
  if (group.length) groups.push(group);
  if (groups.length < 2) return { pressure: 0, steps: [] };
  const pressures = [];
  for (let step = 0; step < groups.length - 1; step++) {
    let state = createGame(options);
    for (let i = 0; i < step; i++) state = applyGroup(state, groups[i]);
    const legal = choices(state);
    const suffix = groups.slice(step + 1).flat();
    let wins = 0;
    for (const choice of legal) {
      let next = choice.state;
      try {
        next = applyActions(next, suffix);
        if (next.phase === "won") wins++;
      } catch {
        /* invalid alternatives are losing evidence */
      }
    }
    pressures.push({
      step,
      legalChoices: legal.length,
      preservingChoices: wins,
      pressure: legal.length ? 1 - wins / legal.length : 1,
    });
  }
  return { pressure: pressures.reduce((sum, value) => sum + value.pressure, 0) / pressures.length, steps: pressures };
}
function applyActions(state, actions) {
  let current = state;
  for (const action of actions) {
    current = advanceToInput(current);
    if (current.phase !== "falling") throw new Error(`terminal phase ${current.phase}`);
    const result = applyAction(current, action);
    if (!result.accepted) throw new Error(`rejected ${action.kind}`);
    current = result.state;
  }
  return advanceToInput(current);
}
function applyGroup(state, group) {
  return applyActions(state, group);
}
function seededRandom(seedText) {
  let state = Number.parseInt(hash(seedText).slice(0, 8), 16) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
function sampleFullPlans(options, trials, seedText) {
  const random = seededRandom(seedText);
  let wins = 0;
  for (let trial = 0; trial < trials; trial++) {
    let state = createGame(options);
    for (let placed = 0; state.phase === "falling" && placed < options.pieceLimit; placed++) {
      const legal = choices(state);
      if (!legal.length) break;
      state = legal[Math.floor(random() * legal.length)].state;
    }
    if (state.phase === "won") wins++;
  }
  return wins;
}
export function grade(item, canonicalKey) {
  const trials = item.variant === 6 ? 1024 : 128;
  let wins;
  if (item.witnessPlacements === 1) {
    const legal = choices(createGame(item.options));
    const random = seededRandom(canonicalKey);
    wins = 0;
    for (let i = 0; i < trials; i++) if (legal[Math.floor(random() * legal.length)]?.state.phase === "won") wins++;
  } else wins = sampleFullPlans(item.options, trials, canonicalKey);
  const fullRate = wins / trials;
  const finalRate = item.legalPlacementChoices ? item.winningPlacementChoices / item.legalPlacementChoices : 0;
  const raw =
    0.35 * (1 - fullRate) +
    0.25 * (1 - finalRate) +
    0.15 * Math.min(1, item.setupDecisionPressure ?? 0) +
    0.15 * Math.min(1, (item.interactionDepth ?? 0) / 2) +
    0.1 * Math.min(1, item.necessaryFloorDecisionShare ?? 0);
  return {
    raw,
    score: Math.max(1, Math.min(100, 1 + Math.round(99 * raw))),
    trials,
    wins,
    fullRate,
    finalRate,
    setupDecisionPressure: item.setupDecisionPressure ?? 0,
  };
}
/** Structural gate rejects several independent target clears masquerading as a layered plan. */
export function hasCausalTargetDependencies(item, minimumDependentSteps) {
  const clears = item.targetIdsClearedByPlacement ?? [];
  const remaining = item.targetIdsRemainingAfterPlacement ?? [];
  const moved = item.targetIdsMovedByPlacement ?? [];
  return (
    Boolean(item.layerEvidence) &&
    remaining.at(-1) === 0 &&
    clears.filter((count) => count > 0).length >= 2 &&
    moved.slice(0, -1).filter((count) => count > 0).length >= minimumDependentSteps
  );
}

/** Keep forgiving openings and the strongest verified endings in an ascending pool. */
export function selectBandCandidates(sortedCandidates, range) {
  return range.id === "expert" ? sortedCandidates.slice(-range.count) : sortedCandidates.slice(0, range.count);
}
