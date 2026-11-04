// Colour Chains: what the settings panel asks for, and the level lists.
import { fillCampaignSelector } from "./campaigns.js";
import { $, s } from "./chains-state.js";
import {
  arashiLevelManifest,
  createGame,
  levelManifest,
  shizenLevelManifest,
  tutorialManifest,
} from "./dist/colour-chains.js";
import { newSeed } from "./seed.js";

export function selectedAuthoredConfig() {
  const lesson = tutorialManifest.find((item) => item.id === $("#lesson").value);
  if (lesson) return { width: 6, height: 12, colourCount: 4, seed: `lesson:${lesson.id}` };
  const level = levelsFor($("#campaign").value).find((item) => item.id === $("#level").value);
  return level
    ? {
        width: level.width,
        height: level.height,
        colourCount: level.colourCount,
        seed: level.seed,
        nature: $("#campaign").value !== "basic",
        weather: $("#campaign").value === "arashi" ? "frequent" : "",
      }
    : null;
}
export function levelsFor(campaign) {
  return campaign === "shizen" ? shizenLevelManifest : campaign === "arashi" ? arashiLevelManifest : levelManifest;
}
export function dailySettingsConfig() {
  return {
    mode: "daily",
    width: 6,
    height: 12,
    colourCount: 4,
    seed: `daily:${new Date().toISOString().slice(0, 10)}`,
  };
}
export function selectedSettingsConfig() {
  return selectedAuthoredConfig() ?? ($("#mode").value === "daily" ? dailySettingsConfig() : null);
}
export function getOptions() {
  if ($("#mode").value === "daily") return { mode: "daily", dailyDate: new Date().toISOString().slice(0, 10) };
  const boardSize =
    $("#preset").value === "saved-size" && s.game
      ? { width: s.game.settings.width, height: s.game.settings.height }
      : {};
  return {
    mode: $("#mode").value,
    ...(Object.keys(boardSize).length ? boardSize : { preset: $("#preset").value }),
    colourCount: Number($("#colours").value),
    nature: $("#nature").checked || Boolean($("#weather").value),
    ...($("#weather").value ? { weather: $("#weather").value } : {}),
    seed: newSeed(),
  };
}
export function applyRecoveredControls(settings) {
  if (settings.mode === "challenge") return;
  $("#mode").value = settings.mode;
  $("#colours").value = String(settings.colourCount);
  $("#nature").checked = settings.nature === true;
  $("#weather").value = settings.weather ?? "";
  let preset = null;
  if (settings.mode === "daily") preset = "standard";
  else
    for (const option of [...$("#preset").options]) {
      if (option.value === "authored" || option.value === "saved-size") continue;
      try {
        const probe = createGame({
          mode: settings.mode,
          preset: option.value,
          colourCount: settings.colourCount,
          nature: settings.nature === true,
          ...(settings.weather ? { weather: settings.weather } : {}),
          seed: "control-probe",
        });
        if (probe.settings.width === settings.width && probe.settings.height === settings.height) {
          preset = option.value;
          break;
        }
      } catch {
        /* Optional preferences. */
      }
    }
  $("#preset").querySelector("[data-saved-size]")?.remove();
  if (preset) $("#preset").value = preset;
  else {
    let option = $("#preset").querySelector("[data-saved-size]");
    if (!option) {
      option = document.createElement("option");
      option.value = "saved-size";
      option.dataset.savedSize = "true";
      $("#preset").append(option);
    }
    option.textContent = `Saved · ${settings.width} × ${settings.height}`;
    $("#preset").value = "saved-size";
  }
}
export function populateLevels() {
  const campaign = $("#campaign").value;
  const placeholder =
    campaign === "basic"
      ? s.lang === "en"
        ? "Free play"
        : "自由に遊ぶ"
      : s.lang === "en"
        ? "Choose a level"
        : "レベルを選択";
  fillCampaignSelector($("#level"), levelsFor(campaign), s.lang, placeholder);
  $("#level").dataset.campaignLanguage = s.lang;
}
