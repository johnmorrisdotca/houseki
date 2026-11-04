// Gem Swap and Stone Collapse page: what the settings panel asks for.
import { readFreeSettings, restoreFreeSettings, syncAuthoredSettings } from "./settings.js";
import { contentFor, dailySettings } from "./tools-context.js";
import { $, engines, s } from "./tools-state.js";

export function authoredSettings(item) {
  if ($("#game").value === "gem-swap")
    return item.lesson ? s.engine.createGame(item.initial).settings : s.engine.createLevel(item.id).settings;
  if (item.lesson)
    return {
      width: item.setup.width,
      height: item.setup.height,
      colourCount: item.setup.colourCount,
      seed: `lesson:${item.id}`,
      tools: false,
    };
  return s.engine.createLevel(item.id).settings;
}
export function modeSettings(mode) {
  return mode === "daily" ? dailySettings() : null;
}
export function selectionChanged(kind) {
  const id = $(`#${kind}`).value;
  if (!id) {
    $("#level").value = "";
    $("#lesson").value = "";
    s.pendingLevel = null;
    syncAuthoredSettings(null, s.lang);
    if (s.freePreferences) restoreFreeSettings(s.freePreferences);
    s.freePreferences = null;
    return;
  }
  const other = kind === "lesson" ? "level" : "lesson";
  $(`#${other}`).value = "";
  const item = contentFor(kind, id);
  if (!item) return;
  if (!s.pendingLevel) s.freePreferences = readFreeSettings();
  s.pendingLevel = {
    ...item,
    ...(kind === "lesson" ? { ...item.setup, seed: `lesson:${item.id}`, lesson: true } : { lesson: false }),
  };
  syncAuthoredSettings(authoredSettings(s.pendingLevel), s.lang);
}
export function modeChanged() {
  const chosen = $("#mode").value;
  const locked = Boolean($("#preset").dataset.authoredLock);
  if ($("#level").value || $("#lesson").value || s.pendingLevel) {
    $("#level").value = "";
    $("#lesson").value = "";
    s.pendingLevel = null;
  }
  if (chosen === "daily") {
    if (locked) syncAuthoredSettings(null, s.lang);
    if (!s.freePreferences) s.freePreferences = readFreeSettings();
    syncAuthoredSettings(modeSettings("daily"), s.lang);
  } else {
    if (locked) syncAuthoredSettings(null, s.lang);
    if (s.freePreferences) restoreFreeSettings(s.freePreferences);
    s.freePreferences = null;
    $("#mode").value = chosen;
  }
}
export function catalog() {
  s.engine = engines[$("#game").value];
  for (const option of $("#preset").options)
    if (["extraWide", "deep", "large"].includes(option.value))
      option.disabled = globalThis.housekiConfig?.oversizedUnlocked === false;
  if ($("#preset").selectedOptions[0]?.disabled) $("#preset").value = "standard";
  $("#level").innerHTML =
    '<option value="">Free play</option>' +
    (s.engine.levelManifest ?? [])
      .map(
        (level) =>
          `<option value="${level.id}">${level.number} · ${level.marks ?? level.difficultyMarks}/5 · ${level.title[s.lang]}</option>`,
      )
      .join("");
  $("#lesson").innerHTML =
    '<option value="">No lesson</option>' +
    (s.engine.tutorialManifest ?? [])
      .map((lesson) => `<option value="${lesson.id}">${lesson.title[s.lang]}</option>`)
      .join("");
  $("#level").parentElement.hidden = !s.engine.levelManifest;
  $("#lesson").parentElement.hidden = !s.engine.tutorialManifest;
}
