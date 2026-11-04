import { animationEnabled, setAnimations } from "./animation.js";
import { refreshAppearanceLanguage } from "./appearance.js";
import { setSound, soundEnabled, unlockSound } from "./audio.js";
import { restoreFreeSettings, syncAuthoredSettings } from "./settings.js";
import { act, cancel, cellClick, frame, newGame } from "./tools-game.js";
import { render } from "./tools-render.js";
import { restoreSavedGame, save } from "./tools-save.js";
import { authoredSettings, catalog, modeChanged, modeSettings, selectionChanged } from "./tools-setup.js";
import { $, engines, s } from "./tools-state.js";
import { pageWords } from "./words.js";

const family = familyLanguage({
  id: "houseki",
  words: pageWords("tools"),
  onChange: (next) => {
    s.lang = next;
    refreshAppearanceLanguage(s.lang);
    syncAuthoredSettings(
      s.pendingLevel ? authoredSettings(s.pendingLevel) : $("#mode").value === "daily" ? modeSettings("daily") : null,
      s.lang,
    );
    render();
  },
});
s.lang = family.lang;
$("#grid").addEventListener("click", (event) => {
  const b = event.target.closest("[data-cell]");
  if (b) cellClick(Number(b.dataset.cell));
});
$("#grid").addEventListener("keydown", (event) => {
  const cell = Number(event.target.closest("[data-cell]")?.dataset.cell);
  if (!Number.isInteger(cell)) return;
  const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -s.state.settings.width, ArrowDown: s.state.settings.width }[
    event.key
  ];
  if (delta) {
    event.preventDefault();
    let next = cell + delta;
    while (next >= 0 && next < s.state.board.length) {
      if (
        Math.abs(delta) === 1 &&
        Math.floor(next / s.state.settings.width) !== Math.floor(cell / s.state.settings.width)
      )
        break;
      if (s.state.settings.mask[next]) {
        s.focusCell = next;
        render();
        $("#grid").children[next].focus();
        break;
      }
      next += delta;
    }
  }
});
$("#inventory").addEventListener("click", (event) => {
  const b = event.target.closest("[data-tool]");
  if (b) {
    s.selectedCell = null;
    act({ kind: "select-tool", tool: b.dataset.tool });
  }
});
$("#confirm").addEventListener("click", () => act({ kind: s.state.selectedTool ? "confirm-tool" : "confirm" }));
$("#cancel").addEventListener("click", cancel);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !event.target.closest("input,select,textarea")) {
    event.preventDefault();
    cancel();
  }
});
$("#undo").addEventListener("click", () => act({ kind: "undo" }));
$("#hint").addEventListener("click", () => act({ kind: "hint" }));
$("#reshuffle").addEventListener("click", () => act({ kind: "reshuffle" }));
$("#new").addEventListener("click", () => newGame());
$("#restart").addEventListener("click", () => newGame(true));
$("#mode").addEventListener("change", modeChanged);
$("#game").addEventListener("change", () => {
  if (s.pendingLevel || s.selectedLevel) {
    syncAuthoredSettings(null, s.lang);
    if (s.freePreferences) restoreFreeSettings(s.freePreferences);
  }
  s.pendingLevel = null;
  s.freePreferences = null;
  catalog();
  $("#level").value = "";
  $("#lesson").value = "";
  if ($("#mode").value === "challenge") $("#mode").value = "relaxed";
  newGame();
});
$("#level").addEventListener("change", () => selectionChanged("level"));
$("#lesson").addEventListener("change", () => selectionChanged("lesson"));
$(".game-screen").addEventListener("dragstart", (event) => event.preventDefault());
window.addEventListener("resize", () => {
  if (s.state) render();
});
$("#animations").checked = animationEnabled();
$("#animations").addEventListener("change", (event) => setAnimations(event.target.checked));
try {
  const previousGame = localStorage.getItem("houseki-full-board-game");
  if (engines[previousGame]) $("#game").value = previousGame;
} catch {
  /* Optional preference. */
}
catalog();
if (!restoreSavedGame()) newGame();
window.addEventListener("pagehide", save);
requestAnimationFrame(frame);

$("#sound").checked = soundEnabled();
$("#sound").addEventListener("change", (event) => setSound(event.target.checked));
document.addEventListener("pointerdown", unlockSound);
document.addEventListener("keydown", unlockSound);
