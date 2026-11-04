// Magnetic Blocks: the settings panel, its checks and the options it gives a new game.

import { render } from "./blocks-render.js";
import { writePreferences } from "./blocks-save.js";
import { $, capOversized, s } from "./blocks-state.js";
import { t } from "./blocks-words.js";
import { fillCampaignSelector } from "./campaigns.js";
import { lessonManifest, levelManifest } from "./dist/magnetic-blocks.js";
import { newSeed } from "./seed.js";
import { syncAuthoredSettings } from "./settings.js";

export function setLanguage(value) {
  s.lang = value === "ja" ? "ja" : "en";
  populateCampaignSelectors();
  syncSetup();
  render(true);
  writePreferences();
}
export function populateCampaignSelectors() {
  const selectedLevelId = $("#level").value;
  const selectedLessonId = $("#lesson").value;
  fillCampaignSelector($("#level"), levelManifest, s.lang, t("freePlay"));
  $("#lesson").innerHTML =
    `<option value="">${t("noLesson")}</option>` +
    lessonManifest.map((lesson) => `<option value="${lesson.id}">${lesson.title[s.lang]}</option>`).join("");
  $("#level").value = selectedLevelId;
  $("#lesson").value = selectedLessonId;
}
function floorFromValue(value) {
  if (value === "magnetic") return { kind: "fixed", floor: "magnetic" };
  if (value === "frequent") return { kind: "frequent" };
  if (value === "rare") return { kind: "infrequent" };
  return { kind: "fixed", floor: "calm" };
}
export function presetSize(name) {
  return { standard: [8, 16], extraWide: [16, 16], deep: [8, 32], large: [16, 32] }[name] ?? null;
}
export function optionsFromControls() {
  const width = Number($("#width").value);
  const height = Number($("#height").value);
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 4 ||
    width > 16 ||
    height < 4 ||
    height > 32 ||
    width * height > 512
  )
    throw new RangeError(t("invalidSize"));
  if (capOversized && (width > 12 || height > 20))
    throw new RangeError(
      s.lang === "en"
        ? "Large boards are locked in this host configuration."
        : "この環境では大型盤面がロックされています。",
    );
  return {
    mode: $("#mode").value,
    width,
    height,
    colourCount: Number($("#colours").value),
    seed: newSeed(),
    pieceLimit: 200,
    schedule: floorFromValue($("#schedule").value),
    floorSwitch: true,
    magneticImpact: $("#impact").checked,
  };
}
export function changedSettings() {
  $("#pending").hidden = false;
  validateSize();
}
export function validateSize() {
  const width = Number($("#width").value);
  const height = Number($("#height").value);
  const valid =
    Number.isInteger(width) &&
    Number.isInteger(height) &&
    width >= 4 &&
    width <= 16 &&
    height >= 4 &&
    height <= 32 &&
    width * height <= 512 &&
    !(capOversized && (width > 12 || height > 20));
  $("#size-error").hidden = valid;
  $("#size-error").textContent =
    capOversized && (width > 12 || height > 20)
      ? s.lang === "en"
        ? "Large boards are locked in this host configuration."
        : "この環境では大型盤面がロックされています。"
      : t("invalidSize");
  $("#new").disabled = !valid;
}
export function applySettingsToControls(settings) {
  $("#mode").value = settings.mode;
  $("#width").value = settings.width;
  $("#height").value = settings.height;
  $("#colours").value = settings.colourCount;
  $("#schedule").value = scheduleValue(settings.schedule);
  $("#impact").checked = settings.magneticImpact;
  const preset =
    Object.entries({ standard: [8, 16], extraWide: [16, 16], deep: [8, 32], large: [16, 32] }).find(
      ([, size]) => size[0] === settings.width && size[1] === settings.height,
    )?.[0] ?? "custom";
  $("#preset").value = capOversized && (settings.width > 12 || settings.height > 20) ? "custom" : preset;
  if (capOversized && (settings.width > 12 || settings.height > 20)) {
    $("#new").disabled = true;
  }
  validateSize();
}
/** The select value for a floor schedule, as the settings panel names it. */
function scheduleValue(schedule) {
  return schedule.kind === "fixed"
    ? schedule.floor
    : schedule.kind === "frequent"
      ? "frequent"
      : schedule.kind === "infrequent" || schedule.kind === "occasional"
        ? "rare"
        : schedule.kind === "authored" && schedule.magneticPlacements.includes(1)
          ? "magnetic"
          : "calm";
}
/** What the panel must show for the level or lesson chosen, or null for free play: the chosen content's own rules, not the free choices. */
function setupConfig() {
  const lesson = lessonManifest.find((item) => item.id === $("#lesson").value) ?? null;
  const level = lesson ? null : (levelManifest.find((item) => item.id === $("#level").value) ?? null);
  const options = (lesson ?? level)?.options;
  return options
    ? {
        mode: "challenge",
        width: options.width,
        height: options.height,
        colourCount: options.colourCount,
        schedule: scheduleValue(options.schedule),
        magneticImpact: options.magneticImpact === true,
      }
    : null;
}
/** Shows the chosen content's fixed rules and locks what it decides, or gives free play its own choices back. The board in play is not touched. */
export function syncSetup() {
  syncAuthoredSettings(setupConfig(), s.lang);
  validateSize();
}
export function syncCampaignControls() {
  $("#objective").hidden = !(s.selectedLevel || s.selectedLesson);
}
