// Falling Triplets: preferences and the saved game.
import { preferredLanguage } from "./appearance.js";
import { $, preferenceKey, s, saveKey } from "./demo-state.js";
import { applyAction, decodeGame, encodeGame, levelManifest, tutorialManifest } from "./dist/falling-triplets.js";
import { readFreeSettings, restoreFreeSettings } from "./settings.js";

export function readPreferences() {
  try {
    const pref = JSON.parse(localStorage.getItem(preferenceKey) || "{}");
    s.lang = preferredLanguage(pref.lang);
    restoreFreeSettings(pref.freeSetup);
    if (pref.material) $("#material").value = pref.material;
    if (pref.motion) $("#motion").checked = true;
    if (pref.sound) $("#sound").checked = true;
    document.documentElement.dataset.motion = pref.motion ? "reduced" : "full";
  } catch {
    /* Play starts normally when preferences are unavailable. */
  }
}
export function writePreferences() {
  try {
    localStorage.setItem(
      preferenceKey,
      JSON.stringify({
        lang: s.lang,
        freeSetup: readFreeSettings(),
        material: $("#material").value,
        motion: $("#motion").checked,
        sound: $("#sound").checked,
      }),
    );
  } catch {
    /* Preferences are optional. */
  }
}
export function save() {
  try {
    localStorage.setItem(saveKey, encodeGame(s.game));
  } catch {
    /* Storage failure never interrupts play. */
  }
}
export function queueSave() {
  if (!s.saveTimer)
    s.saveTimer = setTimeout(() => {
      s.saveTimer = 0;
      save();
    }, 350);
}
export function restoreSavedGame() {
  try {
    const saved = localStorage.getItem(saveKey);
    if (saved) {
      s.game = decodeGame(saved);
      s.selectedLevel = levelManifest.find((level) => level.seed === s.game.settings.seed) ?? null;
      const restoredLesson = tutorialManifest.find((lesson) => `lesson:${lesson.id}` === s.game.settings.seed);
      if (restoredLesson) {
        s.selectedLevel = { ...restoredLesson, ...restoredLesson.setup, seed: s.game.settings.seed, lesson: true };
        $("#lesson").value = restoredLesson.id;
      }
      if (s.selectedLevel && !s.selectedLevel.lesson) $("#level").value = s.selectedLevel.id;
      s.startOptions = {
        mode: s.game.settings.mode,
        width: s.game.settings.width,
        height: s.game.settings.height,
        seed: s.game.settings.seed,
        colourCount: s.game.settings.colourCount,
        ...(s.game.settings.pieceLimit ? { pieceLimit: s.game.settings.pieceLimit } : {}),
      };
      if (s.game.phase === "falling" && s.game.settings.mode !== "relaxed")
        s.game = applyAction(s.game, { kind: "pause" }).state;
    }
  } catch {
    s.game = null;
  }
}
