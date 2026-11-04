import { animationEnabled, setAnimations } from "./animation.js";
import { setSound, soundEnabled, unlockSound } from "./audio.js";
import {
  changedSettings,
  populateCampaignSelectors,
  presetSize,
  setLanguage,
  syncSetup,
  validateSize,
} from "./blocks-controls.js";
import { activateAction, animate, dispatch, newGame } from "./blocks-game.js";
import { bindKeys } from "./blocks-keys.js";
import { render, updateBoardScroll } from "./blocks-render.js";
import { readPreferences, restoreSavedGame, save, writePreferences } from "./blocks-save.js";
import { $, s } from "./blocks-state.js";
import { pageWords } from "./words.js";

const family = familyLanguage({ id: "houseki", words: pageWords("blocks"), onChange: (next) => setLanguage(next) });
s.lang = family.lang;
for (const button of document.querySelectorAll("[data-action]"))
  button.addEventListener("click", () => activateAction(button.dataset.action));
for (const button of document.querySelectorAll("[data-floor]"))
  button.addEventListener("click", () => dispatch("set-floor-override", { floor: button.dataset.floor }));
$("#cancel-floor").addEventListener("click", () => dispatch("cancel-floor-override"));
$("#apply-floor").addEventListener("click", () => activateAction("apply-floor"));
$("#new").addEventListener("click", () => newGame());
$("#restart").addEventListener("click", () => newGame(true));
$("#level").addEventListener("change", () => {
  $("#lesson").value = "";
  $("#pending").hidden = false;
  syncSetup();
  writePreferences();
});
$("#lesson").addEventListener("change", () => {
  $("#level").value = "";
  $("#pending").hidden = false;
  syncSetup();
  writePreferences();
});
$("#preset").addEventListener("change", () => {
  const size = presetSize($("#preset").value);
  if (size) {
    $("#width").value = size[0];
    $("#height").value = size[1];
  }
  changedSettings();
  writePreferences();
});
$("#mode").addEventListener("change", () => {
  $("#level").value = "";
  $("#lesson").value = "";
  syncSetup();
  changedSettings();
  writePreferences();
});
for (const selector of ["#colours", "#schedule", "#impact", "#width", "#height"])
  $(selector).addEventListener("change", () => {
    if (selector === "#width" || selector === "#height") $("#preset").value = "custom";
    changedSettings();
    writePreferences();
  });
$("#width").addEventListener("input", changedSettings);
$("#height").addEventListener("input", changedSettings);
$("#material").addEventListener("change", () => {
  s.boardKey = "";
  render(true);
  writePreferences();
});
$("#motion").addEventListener("change", (event) => {
  document.documentElement.dataset.motion = event.target.checked ? "reduced" : "full";
  writePreferences();
});
$("#animations").checked = animationEnabled();
$("#animations").addEventListener("change", (event) => setAnimations(event.target.checked));
$("#sound").checked = soundEnabled();
$("#sound").addEventListener("change", (event) => {
  setSound(event.target.checked);
  writePreferences();
});
document.addEventListener("pointerdown", unlockSound);
document.addEventListener("keydown", unlockSound);

bindKeys();
$(".game-screen").addEventListener("dragstart", (event) => event.preventDefault());
for (const button of document.querySelectorAll("[data-scroll]"))
  button.addEventListener("click", () => {
    const area = $(".well-scroll");
    area.scrollTop = button.dataset.scroll === "top" ? 0 : area.scrollHeight;
    updateBoardScroll();
  });
$(".well-scroll").addEventListener("scroll", updateBoardScroll, { passive: true });
window.addEventListener("blur", () => {
  if (s.game?.settings.mode === "arcade" && !["paused", "won", "lost", "finished"].includes(s.game.phase))
    dispatch("pause");
  save();
});
document.addEventListener("visibilitychange", () => {
  if (
    document.hidden &&
    s.game?.settings.mode === "arcade" &&
    !["paused", "won", "lost", "finished"].includes(s.game.phase)
  )
    dispatch("pause");
});
window.addEventListener("pagehide", () => {
  clearTimeout(s.saveTimer);
  save();
});

populateCampaignSelectors();
readPreferences();
for (const option of $("#preset").options) option.dataset.base = option.textContent;
restoreSavedGame();
if (!s.game) newGame();
else {
  render(true);
  if (!["won", "lost", "finished"].includes(s.game.phase)) $(".game-screen").focus({ preventScroll: true });
}
validateSize();
requestAnimationFrame(animate);
