import { advanceTicks, applyActionCore, createChallenge } from "./engine-play.js";
import { createGame, RULES, stable } from "./engine-setup.js";
import type { Action, GameState, Settings } from "./types.js";

/** Encodes the authoritative settings, action recording, and derived checkpoint.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @returns Encodes the authoritative settings, action recording, and derived checkpoint.
 * @example
 * ```ts
 * import { createGame, encodeGame } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * console.log(encodeGame(state).length);
 * ```
 */
export function encodeGame(state: GameState): string {
  return JSON.stringify({
    format: 1,
    game: state.game,
    rules: state.rules,
    settings: state.settings,
    actions: state.recording,
    elapsedTicks: state.elapsedTicks,
    checkpoint: state,
  });
}

/** Replays and validates a bounded save, then verifies its checkpoint against the derived state.
 *
 * @param text - A saved JSON recording from this entry’s encodeGame; malformed or inconsistent saves throw.
 * @returns Replays and validates a bounded save, then verifies its checkpoint against the derived state.
 * @example
 * ```ts
 * import { createGame, decodeGame, encodeGame } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * console.log(decodeGame(encodeGame(state)).phase);
 * ```
 */
export function decodeGame(text: string): GameState {
  if (text.length > 2 * 1024 * 1024) throw new RangeError("Save exceeds 2 MiB");
  const value = JSON.parse(text) as {
    format?: number;
    game?: string;
    rules?: string;
    settings?: Settings;
    actions?: unknown[];
    elapsedTicks?: number;
    checkpoint?: GameState;
  };
  if (
    value.format !== 1 ||
    value.game !== "falling-triplets" ||
    value.rules !== RULES ||
    !value.settings ||
    !Array.isArray(value.actions) ||
    !value.checkpoint
  )
    throw new TypeError("Unsupported or invalid Falling Triplets save");
  if (
    value.actions.length > 10_000 ||
    !Number.isInteger(value.elapsedTicks) ||
    value.elapsedTicks! < 0 ||
    value.elapsedTicks! > 600_000
  )
    throw new RangeError("Save exceeds replay limits");
  const s = value.settings;
  let state: GameState;
  if (s.mode === "challenge") {
    const goal =
      s.goal === "targets"
        ? { type: "targets" as const, targetIds: s.targetIds ?? [] }
        : s.goal === "chain"
          ? { type: "chain" as const, minimumChain: s.minimumChain ?? 1 }
          : s.goal === "empty"
            ? { type: "empty" as const }
            : null;
    if (!goal) throw new TypeError("Invalid challenge goal in save");
    state = createChallenge({
      seed: s.seed,
      width: s.width,
      height: s.height,
      colourCount: s.colourCount,
      board: s.challengeBoard ?? [],
      queue: s.challengeQueue ?? [],
      goal,
      ...(s.witness ? { witness: s.witness } : {}),
    });
  } else
    state = createGame({
      mode: s.mode,
      seed: s.seed,
      width: s.width,
      height: s.height,
      colourCount: s.colourCount,
      ...(s.pieceLimit === undefined ? {} : { pieceLimit: s.pieceLimit }),
    });
  if (stable(state.settings) !== stable(s)) throw new TypeError("Save settings are not canonical");
  let previousTick = 0;
  let previousOrdinal = -1;
  const replayRecording: GameState["recording"][number][] = [];
  for (const raw of value.actions) {
    if (!raw || typeof raw !== "object") throw new TypeError("Invalid recorded action");
    const item = raw as { tick?: number; ordinal?: number; action?: Action };
    if (
      !Number.isInteger(item.tick) ||
      item.tick! < previousTick ||
      item.tick! > value.elapsedTicks! ||
      !Number.isInteger(item.ordinal) ||
      !item.action ||
      Object.keys(item.action).some((key) => key !== "kind") ||
      ![
        "left",
        "right",
        "soft-drop",
        "hard-drop",
        "place",
        "cycle-forward",
        "cycle-backward",
        "pause",
        "resume",
        "hint",
      ].includes(item.action.kind)
    )
      throw new TypeError("Invalid recorded action fields");
    const expectedOrdinal = item.tick === previousTick ? previousOrdinal + 1 : 0;
    if (item.ordinal !== expectedOrdinal) throw new TypeError("Invalid action order");
    while (item.tick! > state.elapsedTicks) {
      const prior = state.elapsedTicks;
      state = advanceTicks(state, Math.min(3600, item.tick! - state.elapsedTicks)).state;
      if (state.elapsedTicks === prior) throw new TypeError("Recorded action occurs after the run ended");
    }
    const result = applyActionCore(state, item.action);
    if (!result.accepted)
      throw new TypeError(`Illegal recorded action at tick ${item.tick}: ${result.reason ?? "rejected"}`);
    state = result.state;
    replayRecording.push({ tick: item.tick!, ordinal: item.ordinal!, action: item.action });
    previousTick = item.tick!;
    previousOrdinal = item.ordinal!;
  }
  while (state.elapsedTicks < value.elapsedTicks!) {
    const prior = state.elapsedTicks;
    state = advanceTicks(state, Math.min(3600, value.elapsedTicks! - state.elapsedTicks)).state;
    if (state.elapsedTicks === prior) throw new TypeError("Checkpoint elapsed time exceeds the run clock");
  }
  state = { ...state, recording: replayRecording };
  if (stable(state) !== stable(value.checkpoint))
    throw new TypeError("Save checkpoint does not match its action recording");
  return state;
}
