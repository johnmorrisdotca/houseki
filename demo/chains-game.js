// Colour Chains: starting a game, playing an action and the simulation loop.
import { playTone } from "./audio.js";
import { render } from "./chains-render.js";
import { queueSave, save } from "./chains-save.js";
import { dailySettingsConfig, getOptions, levelsFor } from "./chains-setup.js";
import { $, heldKeys, pendingReleases, s, saveKey } from "./chains-state.js";
import { words } from "./chains-words.js";
import {
  actionsForTick,
  advanceTicks,
  applyAction,
  createArashiLevel,
  createChallenge,
  createGame,
  createInputScheduler,
  createLevel,
  createShizenLevel,
  releaseAllInput as releaseAllActions,
  restartGame,
  setHeldInput as setHeldAction,
  tutorialManifest,
} from "./dist/colour-chains.js";
import { syncAuthoredSettings } from "./settings.js";

function rememberWeather(events) {
  const event = events.find((event) => event.type === "weather-triggered");
  if (event) s.weatherNotice = { kind: event.kind, until: performance.now() + 2500 };
}
export function newGame(restart = false) {
  if (!restart || !s.startOptions.seed) s.startOptions = getOptions();
  if (!restart) {
    const lesson = tutorialManifest.find((item) => item.id === $("#lesson").value);
    const campaign = $("#campaign").value;
    s.selectedLevel = lesson
      ? { ...lesson, ...lesson.setup, seed: `lesson:${lesson.id}`, lesson: true, campaign: "basic" }
      : levelsFor(campaign).find((level) => level.id === $("#level").value)
        ? { ...levelsFor(campaign).find((level) => level.id === $("#level").value), campaign }
        : null;
  }
  syncAuthoredSettings(
    s.selectedLevel
      ? {
          width: s.selectedLevel.width ?? 6,
          height: s.selectedLevel.height ?? 12,
          colourCount: s.selectedLevel.colourCount ?? 4,
          seed: s.selectedLevel.seed,
        }
      : $("#mode").value === "daily"
        ? dailySettingsConfig()
        : null,
    s.lang,
  );
  s.game =
    restart && s.game
      ? restartGame(s.game)
      : s.selectedLevel
        ? s.selectedLevel.lesson
          ? createChallenge({ id: s.selectedLevel.id, ...s.selectedLevel.setup, seed: s.selectedLevel.seed })
          : s.selectedLevel.campaign === "shizen"
            ? createShizenLevel(s.selectedLevel.id)
            : s.selectedLevel.campaign === "arashi"
              ? createArashiLevel(s.selectedLevel.id)
              : createLevel(s.selectedLevel.id)
        : createGame(s.startOptions);
  s.startOptions = { ...s.startOptions, seed: s.game.settings.seed };
  s.input = createInputScheduler();
  s.resumeRequired = false;
  $("#status").textContent = "";
  $("#pending").hidden = true;
  try {
    localStorage.removeItem(saveKey);
  } catch {
    /* A fresh game still starts. */
  }
  heldKeys.clear();
  pendingReleases.clear();
  $("#nature").checked = s.game.settings.nature === true;
  $("#weather").value = s.game.settings.weather ?? "";
  render();
  save();
  if (!["won", "lost", "finished"].includes(s.game.phase)) $(".game-screen").focus({ preventScroll: true });
}
export function playAction(kind) {
  const result = applyAction(s.game, { kind: kind === "soft-drop" ? "down" : kind });
  if (!result.accepted) return false;
  s.game = result.state;
  rememberWeather(result.events);
  render();
  queueSave();
  if (result.events.some((event) => ["piece-locked", "pair-locked"].includes(event.type))) playTone(1, true);
  if (result.events.some((event) => event.type === "cells-cleared") && $("#sound").checked)
    playTone(Math.max(1, s.game.maxChain));
  if (["clear-mark", "clear-remove", "gravity", "won", "lost", "finished"].includes(s.game.phase))
    s.input = releaseAllActions(s.input);
  return true;
}
export async function resumeCountdown() {
  if (s.game.phase !== "paused" || s.resumeRequired) return;
  s.resumeRequired = true;
  s.input = releaseAllActions(s.input);
  $(".resume").disabled = true;
  for (let n = 3; n > 0; n--) {
    $("#status").textContent = `${words[s.lang].countdown} ${n}`;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  s.resumeRequired = false;
  playAction("resume");
}

function simulationTick() {
  let endedPiece = false;
  let actions;
  [actions, s.input] = actionsForTick(s.game, s.input);
  for (const action of pendingReleases) s.input = setHeldAction(s.input, action, false);
  pendingReleases.clear();
  for (const item of actions) {
    const wasFalling = s.game.phase === "falling";
    const oldPieces = s.game.completedPairs;
    playAction(item.kind);
    if ((wasFalling && s.game.phase !== "falling") || s.game.completedPairs > oldPieces) endedPiece = true;
  }
  if (endedPiece || s.game.phase !== "falling") s.input = releaseAllActions(s.input);
  const beforeTick = s.game;
  const result = advanceTicks(s.game, 1);
  s.game = result.state;
  if (s.game !== beforeTick) {
    rememberWeather(result.events);
    for (const event of result.events) if (event.type === "cells-cleared") playTone(event.chain ?? 1);
    render();
    queueSave();
  }
}
export function animate(timestamp) {
  if (!s.lastFrame) s.lastFrame = timestamp;
  const elapsed = Math.min(timestamp - s.lastFrame, 100);
  s.lastFrame = timestamp;
  s.accumulator += elapsed;
  const tickMs = 1000 / 60;
  let count = 0;
  while (s.accumulator >= tickMs && count < 6) {
    simulationTick();
    s.accumulator -= tickMs;
    count++;
  }
  requestAnimationFrame(animate);
}
