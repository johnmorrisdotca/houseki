import { occupied } from "./engine-setup.js";
import { advanceResolution, lock } from "./engine-waves.js";
import type { GameEvent, GameState, Transition } from "./types.js";

/** Advances fixed 60 Hz game ticks. Arcade timing is applied to the active piece.
 *
 * @param state - The immutable native state to read or transition; the input is retained.
 * @param ticks - The nonnegative number of fixed 60 Hz logical ticks to advance.
 * @returns Advances fixed 60 Hz game ticks. Arcade timing is applied to the active piece.
 * @example
 * ```ts
 * import { advanceTicks, createGame } from "@johnmorrisdotca/houseki/falling-triplets";
 *
 * const state=createGame({seed:"docs"});
 * console.log(advanceTicks(state,1).state.phase);
 * ```
 */
export function advanceTicks(state: GameState, ticks: number): Transition {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 3600)
    throw new RangeError("ticks must be an integer from 0 to 3600");
  let current = state;
  const events: GameEvent[] = [];
  for (let i = 0; i < ticks && !["paused", "won", "lost", "finished"].includes(current.phase); i++) {
    if (current.phase !== "falling") {
      const result = advanceResolution(current);
      current = { ...result.state, elapsedTicks: result.state.elapsedTicks + 1 };
      events.push(...result.events);
      continue;
    }
    if (!current.active) break;
    const active = current.active;
    current = { ...current, elapsedTicks: current.elapsedTicks + 1, pieceTicks: current.pieceTicks + 1 };
    if (current.settings.mode === "relaxed") continue;
    const level = active.level;
    const interval = Math.max(6, Math.round(60 * 0.85 ** (level - 1)));
    const grounded = occupied(current, active, active.x, active.y + 1);
    if (grounded) {
      const lockStarted = active.lockStarted;
      const lockTicks = lockStarted ? active.lockTicks + 1 : 0;
      current = { ...current, active: { ...active, lockStarted: true, lockTicks } };
      if (lockTicks >= 24) {
        const result = lock(current);
        current = result.state;
        events.push(...result.events);
      }
    } else if (active.descent + 1 >= interval) {
      const y = active.y + 1;
      const becomesGrounded = occupied(current, active, active.x, y + 1);
      current = {
        ...current,
        active: {
          ...active,
          y,
          descent: 0,
          lockTicks: active.lockResets < 8 && !becomesGrounded ? 0 : active.lockTicks,
          lockStarted:
            becomesGrounded && active.lockResets < 8 ? true : active.lockResets < 8 ? false : active.lockStarted,
        },
      };
    } else
      current = {
        ...current,
        active: {
          ...active,
          descent: active.descent + 1,
          lockTicks: active.lockResets < 8 ? 0 : active.lockTicks,
          lockStarted: active.lockResets < 8 ? false : active.lockStarted,
        },
      };
  }
  return { state: current, events, accepted: true };
}
