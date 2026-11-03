import { noKeysExcept } from "./environment-support.js";
import type { EnvironmentSchedule } from "./environment-types.js";
import { NatureOptionsError } from "./validation.js";

/** Pure one-based schedule lookup: frequent is every second turn; rare is every eighth turn.
 *
 * @param turn - The committed placement/turn number tested against the environment schedule.
 * @param schedule - The native schedule with its authored or periodic trigger settings.
 * @returns Pure one-based schedule lookup: frequent is every second turn; rare is every eighth turn.
 * @example
 * ```ts
 * import { isEnvironmentTurnScheduled } from "@johnmorrisdotca/houseki/nature";
 *
 * console.log(isEnvironmentTurnScheduled(2,{kind:"authored",turns:[2,4]}));
 * ```
 */
export function isEnvironmentTurnScheduled(turn: number, schedule: EnvironmentSchedule): boolean {
  if (
    !Number.isSafeInteger(turn) ||
    turn < 1 ||
    turn > 10_000_000 ||
    !schedule ||
    typeof schedule !== "object" ||
    Array.isArray(schedule)
  )
    throw new NatureOptionsError("invalid-nature-options", "Schedule turn and policy must be valid");
  if (schedule.kind === "frequent" || schedule.kind === "rare") {
    noKeysExcept(schedule, ["kind"], "Environment schedule");
    return turn % (schedule.kind === "frequent" ? 2 : 8) === 0;
  }
  if (schedule.kind === "midlevel") {
    noKeysExcept(schedule, ["kind", "turn"], "Environment schedule");
    if (!Number.isSafeInteger(schedule.turn) || schedule.turn < 1 || schedule.turn > 10_000_000)
      throw new NatureOptionsError("invalid-nature-options", "Midlevel schedule turn is out of range");
    return turn === schedule.turn;
  }
  if (schedule.kind === "authored") {
    noKeysExcept(schedule, ["kind", "turns"], "Environment schedule");
    if (
      !Array.isArray(schedule.turns) ||
      schedule.turns.length > 100_000 ||
      schedule.turns.some(
        (item, index) =>
          !Number.isSafeInteger(item) ||
          item < 1 ||
          item > 10_000_000 ||
          (index > 0 && item <= schedule.turns[index - 1]!),
      )
    )
      throw new NatureOptionsError(
        "invalid-nature-options",
        "Authored turns must be bounded, positive and strictly increasing",
      );
    let low = 0;
    let high = schedule.turns.length - 1;
    while (low <= high) {
      const middle = (low + high) >> 1;
      const candidate = schedule.turns[middle]!;
      if (candidate === turn) return true;
      if (candidate < turn) low = middle + 1;
      else high = middle - 1;
    }
    return false;
  }
  throw new NatureOptionsError("invalid-nature-options", "Unsupported environment schedule");
}
