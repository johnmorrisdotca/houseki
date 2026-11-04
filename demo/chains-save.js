// Colour Chains: preferences and the saved game.

import { levelsFor, populateLevels } from "./chains-setup.js";
import { $, preferenceKey, s, saveKey } from "./chains-state.js";
import { applyAction, decodeGame, encodeGame, levelManifest, tutorialManifest } from "./dist/colour-chains.js";
import { readFreeSettings, restoreFreeSettings } from "./settings.js";

export function readPreferences() {
  try {
    const pref = JSON.parse(localStorage.getItem(preferenceKey) || "{}");
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
      const shizen = levelsFor("shizen").find((level) => level.id === s.game.settings.challengeId);
      const arashi = levelsFor("arashi").find((level) => level.id === s.game.settings.challengeId);
      const basic = levelManifest.find(
        (level) => level.id === s.game.settings.challengeId || level.seed === s.game.settings.seed,
      );
      s.selectedLevel = shizen
        ? { ...shizen, campaign: "shizen" }
        : arashi
          ? { ...arashi, campaign: "arashi" }
          : basic
            ? { ...basic, campaign: "basic" }
            : null;
      const restoredLesson = tutorialManifest.find((lesson) => `lesson:${lesson.id}` === s.game.settings.seed);
      if (restoredLesson) {
        s.selectedLevel = {
          ...restoredLesson,
          ...restoredLesson.setup,
          seed: s.game.settings.seed,
          lesson: true,
          campaign: "basic",
        };
        $("#lesson").value = restoredLesson.id;
      }
      if (s.game.settings.mode === "challenge" && !s.selectedLevel) throw new Error("Unknown campaign revision");
      if (s.selectedLevel && !s.selectedLevel.lesson) {
        $("#campaign").value = s.selectedLevel.campaign;
        populateLevels();
        $("#level").value = s.selectedLevel.id;
      }
      s.startOptions = {
        mode: s.game.settings.mode,
        width: s.game.settings.width,
        height: s.game.settings.height,
        seed: s.game.settings.seed,
        colourCount: s.game.settings.colourCount,
        ...(s.game.settings.pairLimit ? { pairLimit: s.game.settings.pairLimit } : {}),
      };
      if (s.game.phase === "falling" && ["arcade", "daily"].includes(s.game.settings.mode))
        s.game = applyAction(s.game, { kind: "pause" }).state;
    }
  } catch {
    s.game = null;
  }
}
