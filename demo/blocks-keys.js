// Magnetic Blocks: the keyboard.
import { dispatch } from "./blocks-game.js";
import { s } from "./blocks-state.js";

export function bindKeys() {
  const keypad = {
    Numpad4: "ArrowLeft",
    Numpad6: "ArrowRight",
    Numpad7: "z",
    Numpad9: "x",
    Numpad5: "ArrowDown",
    Numpad2: "Space",
  };
  document.addEventListener("keydown", (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    const inGame = target?.closest(".game-screen") || document.activeElement === document.body;
    if (!inGame || target?.closest('input,select,textarea,[contenteditable]:not([contenteditable="false"])')) return;
    if (target?.closest(".well-scroll") && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key))
      return;
    const key = keypad[event.code] ?? event.key;
    let action;
    if (key === "ArrowLeft") action = "left";
    else if (key === "ArrowRight") action = "right";
    else if (key === "ArrowDown") action = s.game.settings.mode === "arcade" ? "soft-drop" : null;
    else if (key === "ArrowUp" || key.toLowerCase?.() === "x") action = "rotate-clockwise";
    else if (key.toLowerCase?.() === "z") action = "rotate-anticlockwise";
    else if (key === " " || key === "Space") action = s.game.settings.mode === "relaxed" ? "land" : "hard-drop";
    else if (key === "Escape" || key.toLowerCase?.() === "p") action = s.game.phase === "paused" ? "resume" : "pause";
    if (!action) return;
    if ((key === " " || key === "Space") && target?.closest("button")) return;
    event.preventDefault();
    if (event.repeat && !["left", "right", "soft-drop"].includes(action)) return;
    dispatch(action);
  });
}
