// Gem Swap and Stone Collapse page: the saved settings that go with a saved game, checked and restored.
import { readFreeSettings, restoreFreeSettings, syncAuthoredSettings } from "./settings.js";
import { authoredSettings } from "./tools-setup.js";
import { $, presetSizes, s } from "./tools-state.js";

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(",")}}`;
  return JSON.stringify(value);
}
export function contentFor(kind, id) {
  if (!kind || typeof id !== "string") return null;
  const list = kind === "lesson" ? s.engine.tutorialManifest : s.engine.levelManifest;
  return list?.find((item) => item.id === id) ?? null;
}
function contentMatches(saved, kind, item) {
  if (!item) return false;
  if (saved.game === "stone-collapse") return saved.settings.challengeId === item.id;
  if (kind === "level") {
    const expected = s.engine.createLevel(item.id);
    return (
      canonical(expected.initialOptions) === canonical(saved.initialOptions) &&
      canonical(expected.challenge) === canonical(saved.challenge)
    );
  }
  const expected = s.engine.createGame(item.initial);
  return canonical(expected.initialOptions) === canonical(saved.initialOptions);
}
export function makeUiContext() {
  const authored = Boolean(s.selectedLevel) || s.state.mode === "daily";
  return {
    version: 1,
    game: s.state.game,
    mode: $("#mode").value || "relaxed",
    preset: $("#preset").value,
    shape: $("#shape").value,
    colourCount: Number($("#colours").value),
    code: $("#code").value.trim(),
    tools: $("#tools").checked,
    advanced: $("#advanced").checked,
    content: s.selectedLevel ? { kind: s.selectedLevel.lesson ? "lesson" : "level", id: s.selectedLevel.id } : null,
    freePreferences: authored ? s.freePreferences : null,
  };
}
export function validateUiContext(value, savedState) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).sort().join(",") !==
      "advanced,code,colourCount,content,freePreferences,game,mode,preset,shape,tools,version"
  )
    return null;
  if (
    value.version !== 1 ||
    value.game !== savedState.game ||
    !["gem-swap", "stone-collapse"].includes(value.game) ||
    !["relaxed", "arcade", "daily", "challenge"].includes(value.mode) ||
    (!Object.hasOwn(presetSizes, value.preset) && value.preset !== "authored") ||
    !["", "heart", "star", "hexagon"].includes(value.shape) ||
    !Number.isInteger(value.colourCount) ||
    value.colourCount < 2 ||
    value.colourCount > 6 ||
    typeof value.code !== "string" ||
    value.code.length > 128 ||
    typeof value.tools !== "boolean" ||
    typeof value.advanced !== "boolean"
  )
    return null;
  const preferences = value.freePreferences;
  if (
    preferences !== null &&
    (!preferences ||
      typeof preferences !== "object" ||
      Array.isArray(preferences) ||
      Object.keys(preferences).some(
        (key) =>
          !["mode", "preset", "colours", "shape", "tools", "advanced", "code", "nature", "weather"].includes(key),
      ) ||
      !["relaxed", "arcade", "daily"].includes(preferences.mode) ||
      !Object.hasOwn(presetSizes, preferences.preset) ||
      !["", "heart", "star", "hexagon"].includes(preferences.shape) ||
      !/^([2-6])$/.test(preferences.colours) ||
      typeof preferences.code !== "string" ||
      preferences.code.length > 128 ||
      typeof preferences.tools !== "boolean" ||
      typeof preferences.advanced !== "boolean")
  )
    return null;
  if (value.content === null) {
    const settings = savedState.settings;
    const mode = savedState.mode ?? settings.mode;
    if (mode === "daily") {
      const daily = s.engine.createGame({
        mode: "daily",
        dailyDate: savedState.dailyDate ?? settings.dailyDate,
      }).settings;
      if (
        value.mode !== "daily" ||
        value.preset !== "authored" ||
        value.shape !== (daily.shape ?? "") ||
        value.colourCount !== daily.colourCount ||
        value.tools !== Boolean(daily.tools) ||
        value.advanced !== Boolean(daily.advancedTools) ||
        value.code !== String(daily.seed)
      )
        return null;
      return value;
    }
    const dimensions = presetSizes[value.preset];
    if (
      value.mode !== mode ||
      value.shape !== (settings.shape ?? "") ||
      value.colourCount !== settings.colourCount ||
      value.tools !== Boolean(settings.tools) ||
      value.advanced !== Boolean(settings.advancedTools) ||
      value.preset === "authored" ||
      (!value.shape && (dimensions?.[0] !== settings.width || dimensions?.[1] !== settings.height)) ||
      (value.code && value.code !== String(settings.seed)) ||
      value.freePreferences !== null
    )
      return null;
    return value;
  }
  if (
    !value.content ||
    typeof value.content !== "object" ||
    Array.isArray(value.content) ||
    Object.keys(value.content).sort().join(",") !== "id,kind" ||
    !["level", "lesson"].includes(value.content.kind) ||
    typeof value.content.id !== "string" ||
    value.content.id.length > 128 ||
    !preferences ||
    !["relaxed", "challenge"].includes(value.mode)
  )
    return null;
  const item = contentFor(value.content.kind, value.content.id);
  if (!item || !contentMatches(savedState, value.content.kind, item)) return null;
  const settings = savedState.settings;
  if (
    value.mode !== "challenge" ||
    value.preset !== "authored" ||
    value.shape !== (settings.shape ?? "") ||
    value.colourCount !== settings.colourCount ||
    value.tools !== Boolean(settings.tools) ||
    value.advanced !== Boolean(settings.advancedTools) ||
    String(settings.seed) !== value.code
  )
    return null;
  return value;
}
function presetForSize(width, height) {
  return (
    Object.keys(presetSizes).find((name) => presetSizes[name][0] === width && presetSizes[name][1] === height) ??
    "compact"
  );
}
export function dailySettings(date = new Date().toISOString().slice(0, 10)) {
  return { ...s.engine.createGame({ mode: "daily", dailyDate: date }).settings, mode: "daily" };
}
export function restoreUi(context, savedState) {
  if (context) {
    $("#mode").value = context.mode;
    $("#preset").value = context.preset;
    $("#shape").value = context.shape;
    $("#colours").value = String(context.colourCount);
    $("#code").value = context.code;
    $("#tools").checked = context.tools;
    $("#advanced").checked = context.advanced;
    s.selectedLevel = context.content
      ? { ...contentFor(context.content.kind, context.content.id), lesson: context.content.kind === "lesson" }
      : null;
    s.pendingLevel = s.selectedLevel;
    s.freePreferences = context.freePreferences;
    $("#level").value = s.selectedLevel && !s.selectedLevel.lesson ? s.selectedLevel.id : "";
    $("#lesson").value = s.selectedLevel?.lesson ? s.selectedLevel.id : "";
    if (s.freePreferences) restoreFreeSettings(s.freePreferences);
    syncAuthoredSettings(
      s.selectedLevel
        ? authoredSettings(s.selectedLevel)
        : (savedState.mode ?? savedState.settings.mode) === "daily"
          ? { ...savedState.settings, mode: "daily" }
          : null,
      s.lang,
    );
    return context;
  }
  const settings = savedState.settings;
  const actualMode = savedState.mode ?? settings.mode;
  $("#mode").value = ["relaxed", "arcade", "daily"].includes(actualMode) ? actualMode : "relaxed";
  $("#preset").value = presetForSize(settings.width, settings.height);
  $("#shape").value = settings.shape ?? "";
  $("#colours").value = String(settings.colourCount);
  $("#code").value = String(settings.seed);
  $("#tools").checked = Boolean(settings.tools);
  $("#advanced").checked = Boolean(settings.advancedTools);
  const exactLevel = (s.engine.levelManifest ?? []).find((item) => contentMatches(savedState, "level", item));
  const exactLesson = (s.engine.tutorialManifest ?? []).find((item) => contentMatches(savedState, "lesson", item));
  s.selectedLevel = exactLevel
    ? { ...exactLevel, lesson: false }
    : exactLesson
      ? { ...exactLesson, lesson: true }
      : null;
  s.pendingLevel = s.selectedLevel;
  $("#level").value = exactLevel?.id ?? "";
  $("#lesson").value = exactLesson?.id ?? "";
  if (s.selectedLevel) {
    s.freePreferences = s.freePreferences ?? readFreeSettings();
    syncAuthoredSettings(authoredSettings(s.selectedLevel), s.lang);
  } else if (actualMode === "daily") syncAuthoredSettings({ ...settings, mode: "daily" }, s.lang);
  return makeUiContext();
}
