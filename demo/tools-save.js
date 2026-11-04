// Gem Swap and Stone Collapse page: the saved game.
import { restoreUi, validateUiContext } from "./tools-context.js";
import { render } from "./tools-render.js";
import { $, s } from "./tools-state.js";

export function save() {
  if (s.engine.encodeGame)
    try {
      localStorage.setItem("houseki-full-board-game", s.state.game);
      localStorage.setItem(`houseki-${s.state.game}-save`, s.engine.encodeGame(s.state));
      if (s.activeUi) localStorage.setItem(`houseki-${s.state.game}-ui`, JSON.stringify(s.activeUi));
    } catch {
      /* Optional storage. */
    }
}
export function queueSave() {
  if (!s.saveTimer)
    s.saveTimer = setTimeout(() => {
      s.saveTimer = 0;
      save();
    }, 500);
}
export function restoreSavedGame() {
  let recovered = false;
  try {
    const raw = localStorage.getItem(`houseki-${$("#game").value}-save`);
    if (raw && s.engine.decodeGame) {
      s.state = s.engine.decodeGame(raw);
      s.startOptions = s.state.initialOptions ?? {};
      let context = null;
      try {
        const sidecar = JSON.parse(localStorage.getItem(`houseki-${s.state.game}-ui`) ?? "null");
        context = validateUiContext(sidecar, s.state);
      } catch {
        /* Ignore invalid UI metadata; the replay remains authoritative. */
      }
      s.activeUi = restoreUi(context, s.state);
      s.focusCell = s.state.settings.mask.findIndex(Boolean);
      render();
      recovered = true;
    }
  } catch {
    /* Invalid or unavailable saves start fresh. */
  }
  return recovered;
}
