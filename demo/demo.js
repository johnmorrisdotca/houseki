import { animationEnabled, setAnimations } from "./animation.js";
import { setSound, soundEnabled, unlockSound } from "./audio.js";
import { animate, newGame, playAction, resumeCountdown } from "./demo-game.js";
import { bindHeld, bindKeys } from "./demo-keys.js";
import { render, updateBoardScroll } from "./demo-render.js";
import { readPreferences, restoreSavedGame, save, writePreferences } from "./demo-save.js";
import { restoreControls, syncSetup } from "./demo-setup.js";
import { $, heldKeys, pendingReleases, s } from "./demo-state.js";
import {
  applyAction,
  levelManifest,
  queueInputEdge,
  releaseAllActions,
  tutorialManifest,
} from "./dist/falling-triplets.js";
import { pageWords } from "./words.js";

const family = familyLanguage({
  id: "houseki",
  words: pageWords("triplets"),
  onChange: (next) => {
    s.lang = next;
    render();
  },
});
s.lang = family.lang;
document.querySelectorAll('[data-action="left"],[data-action="right"],[data-action="soft-drop"]').forEach((button) => {
  bindHeld(button, button.dataset.action);
});
document.querySelectorAll("[data-action]").forEach((button) => {
  if (["left", "right", "soft-drop", "resume"].includes(button.dataset.action)) return;
  button.addEventListener("click", () => {
    s.input = queueInputEdge(s.input, { kind: button.dataset.action });
  });
});
$("#new").addEventListener("click", () => newGame());
$("#restart").addEventListener("click", () => newGame(true));
$("#mode").addEventListener("change", () => {
  $("#level").value = "";
  $("#lesson").value = "";
  syncSetup();
});
for (const selector of ["#mode", "#preset", "#colours"])
  $(selector).addEventListener("change", () => {
    $("#pending").hidden = false;
  });
$("#material").addEventListener("change", () => {
  render();
  writePreferences();
});
$("#motion").addEventListener("change", (event) => {
  document.documentElement.dataset.motion = event.target.checked ? "reduced" : "full";
  writePreferences();
});
$("#sound").addEventListener("change", (event) => {
  setSound(event.target.checked);
  writePreferences();
});
document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    s.lang = button.dataset.lang;
    syncSetup();
    render();
    writePreferences();
  });
});
bindKeys();
$(".game-screen").addEventListener("dragstart", (event) => event.preventDefault());
function releaseInputs() {
  s.input = releaseAllActions(s.input);
  heldKeys.clear();
  pendingReleases.clear();
}
window.addEventListener("blur", () => {
  releaseInputs();
  if (s.game?.settings.mode !== "relaxed" && s.game?.phase !== "paused") playAction("pause");
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    releaseInputs();
    if (s.game?.settings.mode !== "relaxed" && s.game?.phase !== "paused") playAction("pause");
  }
});
$(".resume").addEventListener("click", resumeCountdown);
window.addEventListener("pagehide", () => {
  clearTimeout(s.saveTimer);
  if (s.game && s.game.settings.mode !== "relaxed" && s.game.phase === "falling")
    s.game = applyAction(s.game, { kind: "pause" }).state;
  save();
});

$("#lesson").innerHTML =
  '<option value="">No lesson</option>' +
  tutorialManifest.map((lesson) => `<option value="${lesson.id}">${lesson.title.en}</option>`).join("");
$("#level").addEventListener("change", () => {
  $("#lesson").value = "";
  syncSetup();
  writePreferences();
});
$("#lesson").addEventListener("change", () => {
  $("#level").value = "";
  syncSetup();
  writePreferences();
});
$("#level").innerHTML =
  '<option value="">Free play</option>' +
  levelManifest
    .map((level) => `<option value="${level.id}">${level.number} · ${level.marks}/5 · ${level.title.en}</option>`)
    .join("");
readPreferences();

restoreSavedGame();
if (!s.game) newGame();
else {
  restoreControls();
  if (s.selectedLevel || s.game.settings.mode === "daily") syncSetup();
  s.resumeRequired = false;
  render();
  if (!["won", "lost", "finished"].includes(s.game.phase)) $(".game-screen").focus({ preventScroll: true });
}
requestAnimationFrame(animate);

$("#animations").checked = animationEnabled();
$("#animations").addEventListener("change", (event) => setAnimations(event.target.checked));

for (const option of $("#preset").options) {
  if (["deep", "large", "extraWide"].includes(option.value) && globalThis.housekiConfig?.oversizedUnlocked === false) {
    option.disabled = true;
    option.textContent += " · Locked";
  }
}
for (const button of document.querySelectorAll("[data-scroll]"))
  button.addEventListener("click", () => {
    const area = $(".well-scroll");
    area.scrollTop = button.dataset.scroll === "top" ? 0 : area.scrollHeight;
    updateBoardScroll();
  });
$(".well-scroll").addEventListener("scroll", updateBoardScroll, { passive: true });

$("#sound").checked = soundEnabled();
document.addEventListener("pointerdown", unlockSound);
document.addEventListener("keydown", unlockSound);
