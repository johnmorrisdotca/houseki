// Colour Chains: held buttons and the keyboard.

import { resumeCountdown } from "./chains-game.js";
import { heldKeys, pendingReleases, s } from "./chains-state.js";
import { queueInputEdge, setHeldInput as setHeldAction } from "./dist/colour-chains.js";

function beginHold(action) {
  pendingReleases.delete(action);
  s.input = setHeldAction(s.input, action, true);
}
function endHold(action) {
  if (s.input.held[action] === 0) pendingReleases.add(action);
  else s.input = setHeldAction(s.input, action, false);
}
export function bindHeld(button, action) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    beginHold(action);
    button.focus();
  });
  const release = () => endHold(action);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
}
export function bindKeys() {
  const keypadKeys = {
    Numpad4: "arrowleft",
    Numpad6: "arrowright",
    Numpad7: "z",
    Numpad9: "x",
    Numpad5: "arrowdown",
    Numpad2: "drop",
  };
  document.addEventListener("keydown", (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    const withinGame = target?.closest(".game-screen") || document.activeElement === document.body;
    if (!withinGame || target?.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"])'))
      return;
    if (
      target?.closest(".well-scroll") &&
      ["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())
    )
      return;
    const key = keypadKeys[event.code] ?? event.key.toLowerCase();
    const holds = { arrowleft: "left", arrowright: "right", arrowdown: "soft-drop" };
    if (holds[key]) {
      event.preventDefault();
      if (!heldKeys.has(event.code)) {
        heldKeys.set(event.code, holds[key]);
        beginHold(holds[key]);
      }
      return;
    }
    if (key === " " && target?.closest("button")) return;
    const map = {
      x: "rotate-clockwise",
      arrowup: "rotate-clockwise",
      z: "rotate-anticlockwise",
      drop: s.game.settings.mode === "relaxed" ? "place" : "hard-drop",
      " ": s.game.settings.mode === "relaxed" ? "place" : "hard-drop",
    };
    if (key !== "escape" && !map[key]) return;
    event.preventDefault();
    if (event.repeat) return;
    if (key === "escape") {
      if (s.game.phase === "paused") void resumeCountdown();
      else s.input = queueInputEdge(s.input, { kind: "pause" });
      return;
    }
    s.input = queueInputEdge(s.input, { kind: map[key] });
  });
  document.addEventListener("keyup", (event) => {
    const action = heldKeys.get(event.code);
    if (action) {
      heldKeys.delete(event.code);
      if (![...heldKeys.values()].includes(action)) endHold(action);
    }
  });
}
