import { animationEnabled, setAnimations } from "./animation.js";
import { setSound, soundEnabled, unlockSound } from "./audio.js";
import { animate, newGame, playAction, resumeCountdown } from "./chains-game.js";
import { bindHeld, bindKeys } from "./chains-keys.js";
import { render, updateBoardScroll } from "./chains-render.js";
import { readPreferences, restoreSavedGame, save, writePreferences } from "./chains-save.js";
import {
  applyRecoveredControls,
  dailySettingsConfig,
  levelsFor,
  populateLevels,
  selectedAuthoredConfig,
  selectedSettingsConfig,
} from "./chains-setup.js";
import { $, heldKeys, pendingReleases, s } from "./chains-state.js";
import {
  applyAction,
  levelManifest,
  queueInputEdge,
  releaseAllInput as releaseAllActions,
  tutorialManifest,
} from "./dist/colour-chains.js";
import { syncAuthoredSettings } from "./settings.js";
import { pageWords } from "./words.js";

const family = familyLanguage({
  id: "houseki",
  words: pageWords("chains"),
  onChange: (next) => {
    s.lang = next;
    syncAuthoredSettings(selectedSettingsConfig(), s.lang);
    render();
    writePreferences();
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
for (const selector of ["#preset", "#colours", "#nature", "#weather"])
  $(selector).addEventListener("change", () => {
    $("#pending").hidden = false;
    writePreferences();
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
bindKeys();
$(".game-screen").addEventListener("dragstart", (event) => event.preventDefault());
function releaseInputs() {
  s.input = releaseAllActions(s.input);
  heldKeys.clear();
  pendingReleases.clear();
}
window.addEventListener("blur", () => {
  releaseInputs();
  if (["arcade", "daily"].includes(s.game?.settings.mode) && s.game?.phase !== "paused") playAction("pause");
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    releaseInputs();
    if (["arcade", "daily"].includes(s.game?.settings.mode) && s.game?.phase !== "paused") playAction("pause");
  }
});
$(".resume").addEventListener("click", resumeCountdown);
window.addEventListener("pagehide", () => {
  clearTimeout(s.saveTimer);
  if (s.game && ["arcade", "daily"].includes(s.game.settings.mode) && s.game.phase === "falling")
    s.game = applyAction(s.game, { kind: "pause" }).state;
  save();
});

$("#lesson").innerHTML =
  '<option value="">No lesson</option>' +
  tutorialManifest.map((lesson) => `<option value="${lesson.id}">${lesson.title.en}</option>`).join("");
populateLevels();
$("#campaign").addEventListener("change", () => {
  $("#lesson").value = "";
  populateLevels();
  if ($("#campaign").value !== "basic") $("#level").value = levelsFor($("#campaign").value)[0]?.id ?? "";
  syncAuthoredSettings(selectedAuthoredConfig(), s.lang);
  $("#pending").hidden = false;
  writePreferences();
});
$("#level").addEventListener("change", () => {
  $("#lesson").value = "";
  syncAuthoredSettings(selectedAuthoredConfig(), s.lang);
  $("#pending").hidden = false;
  writePreferences();
});
$("#lesson").addEventListener("change", () => {
  $("#level").value = "";
  syncAuthoredSettings(selectedAuthoredConfig(), s.lang);
  $("#pending").hidden = false;
  writePreferences();
});
$("#mode").addEventListener("change", () => {
  $("#level").value = "";
  $("#lesson").value = "";
  syncAuthoredSettings($("#mode").value === "daily" ? dailySettingsConfig() : null, s.lang);
  $("#pending").hidden = false;
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
  if (s.selectedLevel)
    syncAuthoredSettings(
      {
        width: s.selectedLevel.width ?? 6,
        height: s.selectedLevel.height ?? 12,
        colourCount: s.selectedLevel.colourCount ?? 4,
        seed: s.selectedLevel.seed,
        nature: s.selectedLevel.campaign !== "basic",
        weather: s.selectedLevel.campaign === "arashi" ? "frequent" : "",
      },
      s.lang,
    );
  else {
    syncAuthoredSettings(null, s.lang);
    applyRecoveredControls(s.game.settings);
    if (s.game.settings.mode === "daily") syncAuthoredSettings(dailySettingsConfig(), s.lang);
  }
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

window.addEventListener("resize", () => render());
