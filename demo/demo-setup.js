// Falling Triplets: what the settings panel asks for.

import { $, s } from "./demo-state.js";
import { createGame, levelManifest, tutorialManifest } from "./dist/falling-triplets.js";
import { newSeed } from "./seed.js";
import { syncAuthoredSettings } from "./settings.js";

export function syncSetup() {
  const lesson = tutorialManifest.find((item) => item.id === $("#lesson").value);
  const level = levelManifest.find((item) => item.id === $("#level").value);
  const config = lesson ? { ...lesson.setup, seed: `lesson:${lesson.id}` } : (level ?? null);
  syncAuthoredSettings(config, s.lang);
  if (!config && $("#mode").value === "daily")
    syncAuthoredSettings(createGame({ mode: "daily", seed: new Date().toISOString().slice(0, 10) }).settings, s.lang);
}
export function getOptions() {
  return {
    ...($("#preset").value === "custom" && s.customSize
      ? s.customSize
      : { preset: $("#mode").value === "daily" ? "narrow" : $("#preset").value }),
    mode: $("#mode").value,
    colourCount: $("#mode").value === "daily" ? 5 : Number($("#colours").value),
    seed: $("#mode").value === "daily" ? new Date().toISOString().slice(0, 10) : newSeed(),
  };
}
export function restoreControls() {
  if (s.game.settings.mode === "challenge") {
    syncAuthoredSettings(s.game.settings, s.lang);
    return;
  }
  $("#mode").value = s.game.settings.mode;
  $("#colours").value = String(s.game.settings.colourCount);
  const preset = [...$("#preset").options].find((option) => {
    if (["authored", "custom"].includes(option.value)) return false;
    try {
      const settings = createGame({ preset: option.value, seed: "size-check" }).settings;
      return settings.width === s.game.settings.width && settings.height === s.game.settings.height;
    } catch {
      return false;
    }
  });
  if (preset) $("#preset").value = preset.value;
  else {
    s.customSize = { width: s.game.settings.width, height: s.game.settings.height };
    let option = $('#preset option[value="custom"]');
    if (!option) {
      option = document.createElement("option");
      option.value = "custom";
      $("#preset").append(option);
    }
    option.textContent = `Custom · ${s.customSize.width} × ${s.customSize.height}`;
    $("#preset").value = "custom";
  }
}
