import { createHash } from "node:crypto";
import { advanceTicks, applyAction } from "../../dist/colour-chains.js";

export const GENERATION_REVISION = "colour-chains-campaign-1.3.1";
export const GRADING_VERSION = "chains-placement-forgiveness-1";
export const NATURE_GENERATION_REVISION = "colour-chains-nature-campaign-3.4.0";
export const NATURE_GRADING_VERSION = "chains-nature-decision-evidence-7";
export const SAMPLE_BUDGET = 64;
export const GRADING_FORMULA =
  "raw=0.18*(1-fullPlanSuccessRate)+0.28*consequentialDecisionShare+0.30*setupDeviationLossShare+0.12*goalCoordinationShare+0.06*cascadeShare+0.06*weatherDependency; score=clamp(1+round(99*raw),1,100)";
export const WIDTH = 6;
export const HEIGHT = 12;
export const COLOURS = ["red", "blue", "green", "gold"];
export const SHAPES = [
  {
    tag: "horizontal-link",
    cells: [
      [0, 11],
      [1, 11],
      [2, 11],
    ],
  },
  {
    tag: "corner-link",
    cells: [
      [0, 11],
      [1, 11],
      [1, 10],
    ],
  },
  {
    tag: "vertical-link",
    cells: [
      [0, 11],
      [0, 10],
      [0, 9],
    ],
  },
  {
    tag: "split-link",
    cells: [
      [0, 11],
      [1, 10],
      [2, 10],
    ],
  },
  {
    tag: "stepped-link",
    cells: [
      [0, 11],
      [1, 10],
      [1, 9],
    ],
  },
];
export const cell = (x, y) => y * WIDTH + x;
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export function rng(seed) {
  let value = Number.parseInt(hash(String(seed)).slice(0, 8), 16) || 1;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 0x1_0000_0000;
  };
}
export function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const item of Object.values(value)) deepFreeze(item);
  }
  return value;
}
export function scoreFor(metrics) {
  const score =
    35 * (1 - metrics.seededPlayoutSuccessRate) +
    10 * metrics.forcedPlacementShare +
    10 * Math.min(1, Math.max(0, (metrics.requiredChainDepth - 1) / 2)) +
    10 * Math.min(1, metrics.splitLandingDependencies) +
    8 * Math.min(1, metrics.requiredRotations) +
    12 * Math.min(1, metrics.requiredSetupPairs / 2) +
    5 * Math.min(1, Math.max(0, (metrics.planningLength - 1) / 2));
  return Math.round(Math.max(0, Math.min(100, score)) * 100) / 100;
}
export const placementDirections = ["up", "right", "down", "left"];
export function placePair(start, placement) {
  let state = start;
  const events = [];
  const act = (kind) => {
    const result = applyAction(state, { kind });
    if (!result.accepted) return false;
    state = result.state;
    events.push(...result.events);
    return true;
  };
  for (let safety = 0; state.active && state.active.pivot.x !== placement.pivotX && safety < 20; safety++)
    if (!act(state.active.pivot.x < placement.pivotX ? "right" : "left")) return null;
  for (let turns = 0; state.active?.orientation !== placement.orientation && turns < 4; turns++)
    if (!act("rotate-clockwise")) return null;
  if (!state.active || state.active.orientation !== placement.orientation || !act("hard-drop")) return null;
  let work = 0;
  while (["clear-mark", "clear-remove", "gravity"].includes(state.phase) && work < 100_000) {
    const tick = advanceTicks(state, 3600);
    state = tick.state;
    events.push(...tick.events);
    work += 3600;
  }
  return { state, events };
}
export function playPlan(start, plan) {
  let state = start;
  const events = [];
  for (const placement of plan) {
    if (state.phase !== "falling") break;
    const outcome = placePair(state, placement);
    if (!outcome) return null;
    state = outcome.state;
    events.push(...outcome.events);
  }
  return { state, events };
}
export function weatherTrace(events, source) {
  const targets = new Set(source.goal.kind === "clear-targets" ? source.goal.targetIds : []);
  return events.flatMap((event) => {
    if (event.type === "weather-triggered") return [{ kind: event.kind, turn: event.turn }];
    if (event.type === "jumble-completed")
      return [
        {
          kind: "jumble-result",
          changed: event.changed === true,
          patchCells: [...(event.patchCells ?? [])].sort((a, b) => a - b),
          moves: (event.moves ?? [])
            .map((move) => [move.from.x, move.from.y, move.to.x, move.to.y, targets.has(move.id)])
            .sort((a, b) => a[1] - b[1] || a[0] - b[0]),
        },
      ];
    if (event.type === "lightning-struck")
      return [
        {
          kind: "lightning-result",
          columns: [...(event.columns ?? [])].sort((a, b) => a - b),
          removedCells: [...(event.removedCells ?? [])].sort((a, b) => a - b),
          removedTargetCells: (event.removedIds ?? [])
            .flatMap((id, index) => (targets.has(id) ? [event.removedCells[index]] : []))
            .sort((a, b) => a - b),
        },
      ];
    return [];
  });
}
export function playRandomLegalPlan(start, random) {
  let state = start;
  let placements = 0;
  let maxChainDepth = 1;
  const width = state.settings.width;
  const choices = Array.from({ length: width * 4 }, (_, index) => ({
    pivotX: Math.floor(index / 4),
    orientation: placementDirections[index % 4],
  }));
  while (state.phase === "falling" && placements < (state.settings.queue?.length ?? 12)) {
    const order = [...choices];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    let next = null;
    for (const placement of order) {
      const placed = placePair(state, placement);
      if (placed) {
        next = placed;
        break;
      }
    }
    if (!next) break;
    state = next.state;
    placements++;
    maxChainDepth = Math.max(maxChainDepth, state.maxChain);
  }
  return { state, placements, maxChainDepth };
}
