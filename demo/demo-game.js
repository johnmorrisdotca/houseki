// Falling Triplets: starting a game, playing an action and the simulation loop.
import { playTone } from "./audio.js";
import { render } from "./demo-render.js";
import { queueSave, save } from "./demo-save.js";
import { getOptions, syncSetup } from "./demo-setup.js";
import { $, heldKeys, pendingReleases, s, saveKey } from "./demo-state.js";
import { words } from "./demo-words.js";
import {
  actionsForTick,
  advanceTicks,
  applyAction,
  createChallenge,
  createGame,
  createInputScheduler,
  createLevel,
  levelManifest,
  releaseAllActions,
  restartGame,
  setHeldAction,
  tutorialManifest,
} from "./dist/falling-triplets.js";

export function newGame(restart = false) {
  if (!restart) syncSetup();
  if (!restart || !s.startOptions.seed) s.startOptions = getOptions();
  if (!restart) {
    const lesson = tutorialManifest.find((item) => item.id === $("#lesson").value);
    s.selectedLevel = lesson
      ? { ...lesson, ...lesson.setup, seed: `lesson:${lesson.id}`, lesson: true }
      : (levelManifest.find((level) => level.id === $("#level").value) ?? null);
  }
  s.game =
    restart && s.game
      ? restartGame(s.game)
      : s.selectedLevel
        ? s.selectedLevel.lesson
          ? createChallenge({ ...s.selectedLevel.setup, seed: s.selectedLevel.seed })
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
  render();
  save();
  if (!["won", "lost", "finished"].includes(s.game.phase)) $(".game-screen").focus({ preventScroll: true });
}
export function playAction(kind) {
  const result = applyAction(s.game, { kind });
  if (!result.accepted) return false;
  s.game = result.state;
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
  [actions, s.input] = actionsForTick(s.input);
  for (const action of pendingReleases) s.input = setHeldAction(s.input, action, false);
  pendingReleases.clear();
  for (const item of actions) {
    const wasFalling = s.game.phase === "falling";
    const oldPieces = s.game.completedPieces;
    playAction(item.kind);
    if ((wasFalling && s.game.phase !== "falling") || s.game.completedPieces > oldPieces) endedPiece = true;
  }
  if (endedPiece || s.game.phase !== "falling") s.input = releaseAllActions(s.input);
  const beforeTick = s.game;
  const result = advanceTicks(s.game, 1);
  s.game = result.state;
  if (s.game !== beforeTick) {
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
