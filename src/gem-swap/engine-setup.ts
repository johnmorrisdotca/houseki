import { COLOURS, neighbors, PRESETS } from "./board.js";
import type {
  BoardPreset,
  BoardShape,
  ChallengeRules,
  CreateOptions,
  GameMode,
  GemColour,
  Goal,
  Seal,
  Settings,
} from "./types.js";

/** Typed error for invalid settings or a board that cannot be generated safely.
 *
 * @param code - The native stable error code used by callers to distinguish setup or replay failures.
 * @param message - The human-readable diagnostic accompanying the native code.
 * @example
 * ```ts
 * import { GemSwapOptionsError } from "@johnmorrisdotca/houseki/gem-swap";
 *
 * const error=new GemSwapOptionsError("docs-example","Invalid example setup");
 * console.log(error.name,error.code,error.message);
 * ```
 */
export class GemSwapOptionsError extends RangeError {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "GemSwapOptionsError";
    this.code = code;
  }
}

export function shapeMask(shape: BoardShape): readonly [number, number, readonly boolean[]] {
  if (shape === "heart") {
    const width = 10;
    const rows: readonly (readonly (readonly [number, number])[])[] = [
      [
        [1, 3],
        [6, 8],
      ],
      [
        [0, 4],
        [5, 9],
      ],
      [[0, 9]],
      [[0, 9]],
      [[1, 8]],
      [[2, 7]],
      [[3, 6]],
      [[4, 5]],
      [[4, 5]],
      [[4, 5]],
    ];
    return [
      width,
      rows.length,
      rows.flatMap((ranges) => Array.from({ length: width }, (_, x) => ranges.some(([a, b]) => x >= a && x <= b))),
    ];
  }
  if (shape === "star") {
    const width = 12;
    const ranges: readonly (readonly [number, number])[] = [
      [5, 6],
      [5, 6],
      [4, 7],
      [4, 7],
      [0, 11],
      [0, 11],
      [2, 9],
      [2, 9],
      [3, 8],
      [3, 8],
      [4, 7],
      [4, 7],
    ];
    return [
      width,
      ranges.length,
      ranges.flatMap(([a, b]) => Array.from({ length: width }, (_, x) => x >= a && x <= b)),
    ];
  }
  const width = 10;
  const ranges: readonly (readonly [number, number])[] = [
    [2, 7],
    [1, 8],
    [0, 9],
    [0, 9],
    [0, 9],
    [0, 9],
    [0, 9],
    [0, 9],
    [1, 8],
    [2, 7],
  ];
  return [width, ranges.length, ranges.flatMap(([a, b]) => Array.from({ length: width }, (_, x) => x >= a && x <= b))];
}
export function validMask(mask: readonly boolean[], width: number, height: number): boolean {
  if (!Array.isArray(mask) || mask.length !== width * height || mask.some((v) => typeof v !== "boolean")) return false;
  const active = mask.flatMap((on, i) => (on ? [i] : []));
  if (active.length < 16 || active.length > 512 || active.some((i) => neighbors(i, width, height, mask).length === 0))
    return false;
  const visited = new Set([active[0]!]);
  const queue = [active[0]!];
  while (queue.length)
    for (const next of neighbors(queue.pop()!, width, height, mask))
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
  return visited.size === active.length;
}
export function validateDimensions(width: number, height: number): void {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 4 ||
    width > 16 ||
    height < 4 ||
    height > 32 ||
    width * height > 512
  ) {
    throw new GemSwapOptionsError(
      "invalid-board-size",
      "Dimensions must be width 4–16, height 4–32, and at most 512 cells",
    );
  }
}
export function validateChallenge(value: unknown): ChallengeRules {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new GemSwapOptionsError("invalid-challenge", "Challenge rules must be an object");
  const input = value as Record<string, unknown>;
  if (
    Object.keys(input).some((key) => !["goals", "moveLimit", "seals"].includes(key)) ||
    !Array.isArray(input.goals) ||
    input.goals.length < 1 ||
    input.goals.length > 8
  )
    throw new GemSwapOptionsError("invalid-challenge", "A challenge requires one to eight supported goals");
  if (
    input.moveLimit !== undefined &&
    (!Number.isInteger(input.moveLimit) || (input.moveLimit as number) < 1 || (input.moveLimit as number) > 1000)
  )
    throw new GemSwapOptionsError("invalid-challenge", "Challenge move limit must be from 1 to 1000");
  const goals: Goal[] = input.goals.map((raw: unknown) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      throw new GemSwapOptionsError("invalid-challenge-goal", "Challenge goals must be objects");
    const goal = raw as Record<string, unknown>;
    if (
      goal.kind === "score" &&
      Object.keys(goal).every((key) => ["kind", "target"].includes(key)) &&
      Number.isSafeInteger(goal.target) &&
      (goal.target as number) > 0
    )
      return Object.freeze({ kind: "score", target: goal.target as number });
    if (
      goal.kind === "collect" &&
      Object.keys(goal).every((key) => ["kind", "colour", "target"].includes(key)) &&
      COLOURS.includes(goal.colour as GemColour) &&
      Number.isSafeInteger(goal.target) &&
      (goal.target as number) > 0
    )
      return Object.freeze({ kind: "collect", colour: goal.colour as GemColour, target: goal.target as number });
    if (
      goal.kind === "chain" &&
      Object.keys(goal).every((key) => ["kind", "target"].includes(key)) &&
      Number.isInteger(goal.target) &&
      (goal.target as number) >= 2 &&
      (goal.target as number) <= 100
    )
      return Object.freeze({ kind: "chain", target: goal.target as number });
    if (goal.kind === "seals" && Object.keys(goal).length === 1) return Object.freeze({ kind: "seals" });
    throw new GemSwapOptionsError("invalid-challenge-goal", "Challenge goal is malformed or unsupported");
  });
  let seals: readonly Seal[] | undefined;
  if (input.seals !== undefined) {
    if (!Array.isArray(input.seals) || input.seals.length > 512)
      throw new GemSwapOptionsError("invalid-challenge-seals", "Challenge seals must be a bounded list");
    const seen = new Set<number>();
    seals = Object.freeze(
      input.seals.map((raw: unknown) => {
        if (!raw || typeof raw !== "object" || Array.isArray(raw))
          throw new GemSwapOptionsError("invalid-challenge-seal", "Seal entries must be objects");
        const seal = raw as Record<string, unknown>;
        if (
          Object.keys(seal).some((key) => !["cell", "layers"].includes(key)) ||
          !Number.isInteger(seal.cell) ||
          (seal.cell as number) < 0 ||
          !Number.isInteger(seal.layers) ||
          (seal.layers as number) < 1 ||
          (seal.layers as number) > 3 ||
          seen.has(seal.cell as number)
        )
          throw new GemSwapOptionsError("invalid-challenge-seal", "Seal cell or layers are invalid or duplicated");
        seen.add(seal.cell as number);
        return Object.freeze({ cell: seal.cell as number, layers: seal.layers as number });
      }),
    );
  }
  if (goals.some((goal) => goal.kind === "seals") && !seals?.length)
    throw new GemSwapOptionsError("invalid-challenge-seals", "A seal goal requires at least one seal");
  return Object.freeze({
    goals: Object.freeze(goals),
    ...(input.moveLimit === undefined ? {} : { moveLimit: input.moveLimit as number }),
    ...(seals ? { seals } : {}),
  });
}
export function optionsFor(options: CreateOptions): {
  readonly settings: Settings;
  readonly mode: GameMode;
  readonly dailyDate: string | null;
  readonly challenge: ChallengeRules | null;
  readonly initialOptions: CreateOptions;
} {
  if (!options || typeof options !== "object" || Array.isArray(options))
    throw new GemSwapOptionsError("invalid-options", "Options must be an object");
  const allowed = [
    "preset",
    "width",
    "height",
    "colourCount",
    "seed",
    "shape",
    "mask",
    "tools",
    "advancedTools",
    "mode",
    "dailyDate",
    "challenge",
  ];
  if (Object.keys(options).some((key) => !allowed.includes(key)))
    throw new GemSwapOptionsError("unknown-option", "Options contain an unsupported field");
  const mode = options.mode ?? "relaxed";
  if (!["relaxed", "arcade", "daily", "challenge"].includes(mode))
    throw new GemSwapOptionsError("invalid-mode", "Unknown game mode");
  const dailyDate = options.dailyDate ?? null;
  if (mode === "daily") {
    const parsedDate = typeof dailyDate === "string" ? Date.parse(`${dailyDate}T00:00:00.000Z`) : Number.NaN;
    if (
      typeof dailyDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dailyDate) ||
      !Number.isFinite(parsedDate) ||
      new Date(parsedDate).toISOString().slice(0, 10) !== dailyDate
    )
      throw new GemSwapOptionsError("invalid-daily-date", "Daily mode requires a valid UTC date in YYYY-MM-DD form");
    if (
      options.preset !== undefined ||
      options.width !== undefined ||
      options.height !== undefined ||
      options.colourCount !== undefined ||
      options.seed !== undefined ||
      options.tools !== undefined ||
      options.advancedTools !== undefined ||
      options.shape !== undefined ||
      options.mask !== undefined ||
      options.challenge !== undefined
    )
      throw new GemSwapOptionsError(
        "daily-settings-fixed",
        "Daily uses canonical board settings and a date-derived seed",
      );
  } else if (dailyDate !== null)
    throw new GemSwapOptionsError("unexpected-daily-date", "A UTC date is only valid in Daily mode");
  const challenge = mode === "challenge" ? validateChallenge(options.challenge) : null;
  if (mode !== "challenge" && options.challenge !== undefined)
    throw new GemSwapOptionsError("unexpected-challenge", "Challenge rules require Challenge mode");
  if (options.tools !== undefined && typeof options.tools !== "boolean")
    throw new GemSwapOptionsError("invalid-tools-option", "Tools must be enabled or disabled with a boolean");
  if (options.advancedTools !== undefined && typeof options.advancedTools !== "boolean")
    throw new GemSwapOptionsError(
      "invalid-advanced-tools-option",
      "Advanced tools must be enabled or disabled with a boolean",
    );
  if (options.advancedTools && !options.tools)
    throw new GemSwapOptionsError("advanced-tools-require-tools", "Advanced tools require the stored-tool tray");
  const dimensions = options.width !== undefined || options.height !== undefined;
  let width: number;
  let height: number;
  let mask: readonly boolean[] | undefined;
  let shape: BoardShape | undefined;
  if (options.shape !== undefined) {
    if (
      !["heart", "star", "hexagon"].includes(options.shape) ||
      options.preset !== undefined ||
      dimensions ||
      options.mask !== undefined
    )
      throw new GemSwapOptionsError("conflicting-board-options", "Choose one mask shape or one rectangular board");
    shape = options.shape;
    [width, height, mask] = shapeMask(shape);
  } else if (options.mask !== undefined) {
    if (options.preset !== undefined || options.width === undefined || options.height === undefined)
      throw new GemSwapOptionsError(
        "custom-mask-dimensions-required",
        "A custom mask requires explicit dimensions and cannot use a preset",
      );
    width = options.width;
    height = options.height;
    mask = options.mask;
  } else {
    const presetName = options.preset ?? "standard";
    if (!Object.hasOwn(PRESETS, presetName)) throw new GemSwapOptionsError("invalid-preset", "Unknown board preset");
    if (dimensions && options.preset !== undefined)
      throw new GemSwapOptionsError("conflicting-board-options", "Choose a preset or custom dimensions");
    const preset = PRESETS[presetName as BoardPreset];
    width = options.width ?? preset[0];
    height = options.height ?? preset[1];
  }
  validateDimensions(width!, height!);
  if (mask === undefined) mask = Array(width! * height!).fill(true);
  if (!validMask(mask, width!, height!))
    throw new GemSwapOptionsError(
      "invalid-mask",
      "The active mask must be connected, contain 16–512 cells and have no isolated cell",
    );
  if (challenge?.seals?.some((seal) => seal.cell >= mask!.length || !mask![seal.cell]))
    throw new GemSwapOptionsError("invalid-challenge-seal", "Every seal must occupy an active board cell");
  const colourCount = options.colourCount ?? 5;
  if (colourCount !== 4 && colourCount !== 5 && colourCount !== 6)
    throw new GemSwapOptionsError("invalid-colour-count", "Colour count must be 4, 5, or 6");
  if (mode === "daily" && (options.tools || options.advancedTools))
    throw new GemSwapOptionsError("daily-tools-disabled", "Daily mode does not use stored tools");
  const seed = mode === "daily" ? `gem-swap:daily-1:${dailyDate}` : (options.seed ?? "houseki-gem-swap");
  if (typeof seed === "string" ? seed.length > 256 : !Number.isInteger(seed) || seed < 0 || seed > 0xffff_ffff)
    throw new GemSwapOptionsError(
      "invalid-seed",
      "Seed must be a string of at most 256 characters or an unsigned 32-bit integer",
    );
  const settings = Object.freeze({
    width: width!,
    height: height!,
    colourCount,
    seed,
    tools: options.tools ?? false,
    advancedTools: options.advancedTools ?? false,
    ...(shape ? { shape } : {}),
    mask: Object.freeze([...mask]),
  });
  const initialOptions: CreateOptions = Object.freeze(
    mode === "daily"
      ? { mode, dailyDate: dailyDate! }
      : {
          ...(mode === "relaxed" ? {} : { mode }),
          ...(options.preset !== undefined
            ? { preset: options.preset }
            : shape
              ? { shape }
              : { width: width!, height: height!, mask: Object.freeze([...mask]) }),
          colourCount,
          seed,
          tools: options.tools ?? false,
          advancedTools: options.advancedTools ?? false,
          ...(challenge ? { challenge } : {}),
        },
  );
  return Object.freeze({ settings, mode, dailyDate, challenge, initialOptions });
}
