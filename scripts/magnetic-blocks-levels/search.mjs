import { createHash } from "node:crypto";
import { advanceTicks, applyAction, createGame } from "../../dist/magnetic-blocks.js";

export const WIDTH = 8;
export const HEIGHT = 12;
export const palette = ["blue", "green", "gold", "purple"];
export function hash(text) {
  return createHash("sha256").update(text).digest("hex");
}
export function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`)
      .join(",")}}`;
  return JSON.stringify(value);
}
export function normalizedColourKey(options) {
  const width = options.width ?? WIDTH;
  const height = options.height ?? HEIGHT;
  const variants = [];
  const targets = new Set(options.goal.targetIds);
  for (const reflect of [false, true]) {
    const seen = new Map();
    const colour = (name) => {
      if (!seen.has(name)) seen.set(name, String.fromCharCode(65 + seen.size));
      return seen.get(name);
    };
    const board = Array.from({ length: width * height }, (_, index) => {
      const x = index % width;
      const y = Math.floor(index / width);
      const source = options.initialBoard[y * width + (reflect ? width - 1 - x : x)];
      return source ? `${colour(source.colour)}:${targets.has(source.id) ? "t" : "g"}` : ".";
    });
    const queue = options.queue.map((piece) =>
      (reflect ? [piece[1], piece[0], piece[3], piece[2]] : piece).map(colour),
    );
    const mask =
      options.mask &&
      Array.from({ length: width * height }, (_, index) => {
        const x = index % width;
        const y = Math.floor(index / width);
        return options.mask[y * width + (reflect ? width - 1 - x : x)];
      });
    const targetGeometry = options.goal.targetIds
      .map((id) => {
        const i = options.initialBoard.findIndex((g) => g?.id === id);
        const x = i % width;
        return [reflect ? width - 1 - x : x, Math.floor(i / width)];
      })
      .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    variants.push(
      stable({
        width,
        height,
        mask,
        board,
        queue,
        bonds: options.bonds,
        schedule: options.schedule,
        floorSwitch: options.floorSwitch,
        magneticImpact: options.magneticImpact,
        targetGeometry,
      }),
    );
  }
  return variants.sort()[0];
}
function act(state, action) {
  const result = applyAction(state, action);
  return result.accepted ? result.state : null;
}
export function advanceToInput(state) {
  let current = state;
  for (let guard = 0; guard < 8 && ["gravity", "clear-mark", "clear-remove"].includes(current.phase); guard++)
    current = advanceTicks(current, 60).state;
  return current;
}
export function actionPath(state, x, orientation, floor, resolve = true) {
  const actions = [];
  let currentX = state.active.x;
  while (currentX > x) {
    actions.push({ kind: "left" });
    currentX--;
  }
  while (currentX < x) {
    actions.push({ kind: "right" });
    currentX++;
  }
  for (let turn = 0; turn < orientation; turn++) actions.push({ kind: "rotate-clockwise" });
  if (floor) actions.push({ kind: "set-floor-override", floor });
  actions.push({ kind: "hard-drop" });
  let current = state;
  for (const action of actions) {
    current = act(current, action);
    if (!current) return null;
  }
  return { state: resolve ? advanceToInput(current) : current, actions };
}
function floorVariants(state) {
  return state.floorSwitchCharges ? [null, "calm", "magnetic"] : [null];
}
const choiceCache = new Map();
export function choices(state, wantCount = false) {
  const key = stable({
    mode: state.settings.mode,
    width: state.settings.width,
    height: state.settings.height,
    mask: state.settings.mask,
    goal: state.settings.goal,
    schedule: state.settings.schedule,
    floorSwitch: state.settings.floorSwitch,
    magneticImpact: state.settings.magneticImpact,
    pieceLimit: state.settings.pieceLimit,
    board: state.board,
    bonds: state.bonds,
    active: state.active && {
      x: state.active.x,
      y: state.active.y,
      orientation: state.active.orientation,
      gems: state.active.gems,
    },
    queue: state.queue,
    placements: state.placements,
    floor: state.floor,
    nextFloor: state.nextFloor,
    floorSwitchCharges: state.floorSwitchCharges,
    pendingFloorOverride: state.pendingFloorOverride,
    phase: state.phase,
  });
  const cached = choiceCache.get(key);
  if (cached) return wantCount ? { outputs: cached, legal: cached.length } : cached;
  const outputs = [];
  let legal = 0;
  for (let x = 0; x < state.settings.width - 1; x++)
    for (let orientation = 0; orientation < 4; orientation++)
      for (const floor of floorVariants(state)) {
        const result = actionPath(state, x, orientation, floor);
        if (!result) continue;
        legal++;
        outputs.push({ ...result, x, orientation, floor });
      }
  choiceCache.set(key, outputs);
  return wantCount ? { outputs, legal } : outputs;
}
export function prove(options) {
  const start = createGame(options);
  let winningPlacementChoices = 0;
  const firstChoices = choices(start, true);
  if (options.pieceLimit === 1) {
    for (const option of firstChoices.outputs) if (option.state.phase === "won") winningPlacementChoices++;
    const winning = firstChoices.outputs.find((option) => option.state.phase === "won");
    return {
      witness: winning
        ? { state: winning.state, actions: winning.actions, decisions: Number(Boolean(winning.floor)) }
        : null,
      legalPlacementChoices: firstChoices.legal,
      setupPlacementChoices: 0,
      winningPlacementChoices,
    };
  }
  const setupX =
    options.goal.targetIds.length &&
    options.initialBoard.findIndex((gem) => gem?.id === options.goal.targetIds[0]) % WIDTH < WIDTH / 2
      ? WIDTH - 2
      : 0;
  const setup = actionPath(start, setupX, 0, null, true);
  if (setup?.state.phase !== "falling")
    return {
      witness: null,
      legalPlacementChoices: 0,
      setupPlacementChoices: firstChoices.legal,
      winningPlacementChoices,
    };
  const secondChoices = choices(setup.state, true);
  for (const option of secondChoices.outputs) if (option.state.phase === "won") winningPlacementChoices++;
  const winning = secondChoices.outputs.find((option) => option.state.phase === "won");
  return {
    witness: winning
      ? {
          state: winning.state,
          actions: [...setup.actions, ...winning.actions],
          decisions: Number(Boolean(winning.floor)),
        }
      : null,
    legalPlacementChoices: secondChoices.legal,
    setupPlacementChoices: firstChoices.legal,
    winningPlacementChoices,
  };
}
export function proveWithWitness(options, witness) {
  let state = createGame(options);
  for (const action of witness) {
    state = advanceToInput(state);
    const result = applyAction(state, action);
    if (!result.accepted) throw new Error(`Counterfactual rejected ${action.kind}: ${result.reason}`);
    state = result.state;
  }
  return advanceToInput(state);
}
