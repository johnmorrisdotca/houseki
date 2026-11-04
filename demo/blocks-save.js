// Magnetic Blocks: preferences and the saved game.

import { applySettingsToControls, syncCampaignControls, syncSetup } from "./blocks-controls.js";
import { $, preferenceKey, s, saveKey } from "./blocks-state.js";
import { decodeGame, encodeGame, lessonManifest, levelManifest } from "./dist/magnetic-blocks.js";
import { readFreeSettings, restoreFreeSettings } from "./settings.js";

export function readPreferences() {
  try {
    const pref = JSON.parse(localStorage.getItem(preferenceKey) || "{}");
    restoreFreeSettings(pref.freeSetup);
    if (pref.material) $("#material").value = pref.material;
    if (pref.motion) $("#motion").checked = true;
    document.documentElement.dataset.motion = pref.motion ? "reduced" : "full";
  } catch {
    /* Optional preferences do not block play. */
  }
}
export function writePreferences() {
  try {
    localStorage.setItem(
      preferenceKey,
      JSON.stringify({
        freeSetup: readFreeSettings(),
        material: $("#material").value,
        motion: $("#motion").checked,
        sound: $("#sound").checked,
      }),
    );
  } catch {
    /* Optional preferences do not block play. */
  }
}
export function queueSave() {
  if (!s.saveTimer) s.saveTimer = setTimeout(save, 350);
}
export function save() {
  clearTimeout(s.saveTimer);
  s.saveTimer = 0;
  try {
    if (s.game) localStorage.setItem(saveKey, encodeGame(s.game));
  } catch {
    /* A save failure never interrupts play. */
  }
}
export function restoreSavedGame() {
  try {
    const saved = localStorage.getItem(saveKey);
    if (saved) {
      s.game = decodeGame(saved);
      s.startOptions = null;
      s.selectedLevel = levelManifest.find((level) => level.options.seed === s.game.settings.seed) ?? null;
      s.selectedLesson = lessonManifest.find((lesson) => lesson.options.seed === s.game.settings.seed) ?? null;
      if (s.game.settings.goal && !s.selectedLevel && !s.selectedLesson) throw new Error("Unknown campaign revision");
      $("#level").value = s.selectedLevel?.id ?? "";
      $("#lesson").value = s.selectedLesson?.id ?? "";
      if (s.selectedLevel || s.selectedLesson) syncSetup();
      else applySettingsToControls(s.game.settings);
      syncCampaignControls();
    }
  } catch {
    s.game = null;
  }
}
