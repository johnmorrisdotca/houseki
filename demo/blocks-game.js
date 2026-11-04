// Magnetic Blocks: starting a game, playing an action and the simulation loop.
import { playTone } from "./audio.js";
import { applySettingsToControls, optionsFromControls, syncCampaignControls, syncSetup } from "./blocks-controls.js";
import { render, renderHud } from "./blocks-render.js";
import { queueSave } from "./blocks-save.js";
import { $, s, saveKey } from "./blocks-state.js";
import { t } from "./blocks-words.js";
import {
  advanceTicks,
  applyAction,
  createGame,
  createLesson,
  createLevel,
  lessonManifest,
  levelManifest,
  restartGame,
} from "./dist/magnetic-blocks.js";

export function newGame(restart = false) {
  try {
    if (!restart || !s.game) {
      s.selectedLesson = lessonManifest.find((lesson) => lesson.id === $("#lesson").value) ?? null;
      s.selectedLevel = s.selectedLesson
        ? null
        : (levelManifest.find((level) => level.id === $("#level").value) ?? null);
      $("#level").value = s.selectedLevel?.id ?? "";
      $("#lesson").value = s.selectedLesson?.id ?? "";
      s.startOptions = s.selectedLesson?.options ?? s.selectedLevel?.options ?? optionsFromControls();
    }
    s.game =
      restart && s.game
        ? restartGame(s.game)
        : s.selectedLesson
          ? createLesson(s.selectedLesson.id)
          : s.selectedLevel
            ? createLevel(s.selectedLevel.id)
            : createGame(s.startOptions);
    if (!restart) {
      if (s.selectedLevel || s.selectedLesson) syncSetup();
      else applySettingsToControls(s.game.settings);
      $("#pending").hidden = true;
    }
    $("#status").textContent = "";
    syncCampaignControls();
    try {
      localStorage.removeItem(saveKey);
    } catch {
      /* Saving is optional. */
    }
    render(true);
    if (!["won", "lost", "finished"].includes(s.game.phase)) $(".game-screen").focus({ preventScroll: true });
    queueSave();
  } catch (error) {
    $("#size-error").hidden = false;
    $("#size-error").textContent = `${t("newSave")}${error instanceof Error ? error.message : String(error)}`;
  }
}
export function dispatch(kind, extra = {}) {
  if (!s.game) return false;
  const result = applyAction(s.game, { kind, ...extra });
  if (!result.accepted) {
    if (result.reason === "blocked") {
      $("#status").textContent = t("blocked");
      setTimeout(() => renderHud(true), 600);
    }
    return false;
  }
  s.game = result.state;
  render();
  queueSave();
  if (result.events.some((event) => event.type === "piece-locked")) playTone(1, true);
  if (result.events.some((event) => event.type === "cells-removed")) playTone(Math.max(1, s.game.chain));
  return true;
}
function simulateTick() {
  const before = s.game;
  const result = advanceTicks(s.game, 1);
  s.game = result.state;
  if (
    s.game.phase !== before.phase ||
    s.game.score !== before.score ||
    s.game.active?.y !== before.active?.y ||
    s.game.active?.lockTicks !== before.active?.lockTicks ||
    s.game.queue !== before.queue
  ) {
    render();
    queueSave();
  }
  if (result.events.some((event) => event.type === "piece-locked")) playTone(1, true);
  if (result.events.some((event) => event.type === "cells-removed")) playTone(Math.max(1, s.game.chain));
}
export function animate(timestamp) {
  if (!s.lastFrame) s.lastFrame = timestamp;
  s.accumulator += Math.min(100, timestamp - s.lastFrame);
  s.lastFrame = timestamp;
  const tickMs = 1000 / 60;
  let count = 0;
  while (s.accumulator >= tickMs && count < 6) {
    simulateTick();
    s.accumulator -= tickMs;
    count++;
  }
  requestAnimationFrame(animate);
}
export function activateAction(kind) {
  if (kind === "apply-floor") return dispatch(s.game.settings.mode === "relaxed" ? "land" : "hard-drop");
  return dispatch(kind);
}
