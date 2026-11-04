// Gem Swap and Stone Collapse page: starting a game, playing an action and the frame loop.
import { playTone } from "./audio.js";
import { newSeed } from "./seed.js";
import { readFreeSettings, syncAuthoredSettings } from "./settings.js";
import { makeUiContext } from "./tools-context.js";
import { render } from "./tools-render.js";
import { queueSave, save } from "./tools-save.js";
import { authoredSettings } from "./tools-setup.js";
import { $, engines, s } from "./tools-state.js";
import { text } from "./tools-words.js";

export function newGame(restart = false) {
  s.engine = engines[$("#game").value];
  let nextLevel = s.selectedLevel;
  if (!restart) {
    const lesson = (s.engine.tutorialManifest ?? []).find((item) => item.id === $("#lesson").value);
    nextLevel = lesson
      ? { ...lesson, ...lesson.setup, seed: `lesson:${lesson.id}`, lesson: true }
      : ((s.engine.levelManifest ?? []).find((item) => item.id === $("#level").value) ?? null);
    if (nextLevel && !s.freePreferences) s.freePreferences = readFreeSettings();
    s.startOptions =
      $("#mode").value === "daily"
        ? { mode: "daily", dailyDate: new Date().toISOString().slice(0, 10) }
        : {
            ...(!$("#shape").value ? { preset: $("#preset").value } : {}),
            mode: $("#mode").value || "relaxed",
            colourCount: Number($("#colours").value),
            seed: $("#code").value.trim() || newSeed(),
            tools: $("#tools").checked,
            ...($("#game").value === "gem-swap"
              ? { advancedTools: $("#tools").checked && $("#advanced").checked }
              : {}),
            ...($("#shape").value ? { shape: $("#shape").value } : {}),
          };
  }
  try {
    const nextState =
      restart && s.engine.restartGame
        ? s.engine.restartGame(s.state)
        : nextLevel
          ? nextLevel.lesson
            ? nextLevel.initial
              ? s.engine.createGame(nextLevel.initial)
              : s.engine.createChallenge({
                  id: nextLevel.id,
                  seed: nextLevel.seed,
                  width: nextLevel.setup.width,
                  height: nextLevel.setup.height,
                  colourCount: nextLevel.setup.colourCount,
                  initialBoard: nextLevel.board,
                  goal: nextLevel.goal,
                  moveLimit: nextLevel.setup.moveLimit,
                  witness: nextLevel.witness,
                })
            : s.engine.createLevel(nextLevel.id)
          : s.engine.createGame(s.startOptions);
    s.state = nextState;
    if (!restart) {
      s.selectedLevel = nextLevel;
      s.pendingLevel = nextLevel;
      if (s.selectedLevel) syncAuthoredSettings(authoredSettings(s.selectedLevel), s.lang);
      else if ((s.state.mode ?? s.state.settings.mode) === "daily") {
        if (!s.freePreferences) s.freePreferences = readFreeSettings();
        syncAuthoredSettings({ ...s.state.settings, mode: "daily" }, s.lang);
      } else {
        syncAuthoredSettings(null, s.lang);
        s.freePreferences = null;
      }
      s.activeUi = makeUiContext();
    }
    s.selectedCell = null;
    s.focusCell = s.state.settings.mask.findIndex(Boolean);
    s.notice = "";
    render();
    save();
    $(".full-cell:not(.masked)").focus({ preventScroll: true });
  } catch (error) {
    $("#status").textContent = error.message;
  }
}

export function act(action) {
  const result = s.engine.applyAction(s.state, action);
  if (result.accepted) {
    s.state = result.state;
    s.notice = "";
    const hint = result.events.find((event) => event.type === "hint");
    if (hint?.action) {
      s.selectedCell = hint.action.from;
      s.focusCell = hint.action.to;
      s.notice =
        s.lang === "en"
          ? `Try the highlighted gem with row ${Math.floor(hint.action.to / s.state.settings.width) + 1}, column ${(hint.action.to % s.state.settings.width) + 1}.`
          : "選んだ石と、次のマスを入れ替えてみましょう。";
    }
    queueSave();
  } else s.notice = text[s.lang].invalid;
  render();
  return result.accepted;
}
export function cellClick(cell) {
  if (s.state.phase !== "ready" || !s.state.board[cell]) return;
  s.focusCell = cell;
  if (s.state.selectedTool) {
    act({ kind: "target-tool", cell });
    return;
  }
  if (s.state.game === "stone-collapse") {
    act({ kind: "select", stoneId: s.state.board[cell].id });
    return;
  }
  if (s.selectedCell === null) {
    s.selectedCell = cell;
    s.notice = "";
    render();
    return;
  }
  if (s.selectedCell === cell) {
    s.selectedCell = null;
    render();
    return;
  }
  const from = s.selectedCell;
  s.selectedCell = null;
  if (!act({ kind: "swap", from, to: cell })) {
    s.selectedCell = cell;
    render();
  }
}
export function cancel() {
  s.selectedCell = null;
  if (s.state.selectedTool) act({ kind: "cancel-tool" });
  else if (s.state.game === "stone-collapse") act({ kind: "cancel" });
  else render();
}
export function frame(timestamp) {
  const elapsed = Math.min(100, timestamp - (s.lastFrame || timestamp));
  s.lastFrame = timestamp;
  if (s.state?.mode === "arcade" && s.engine.advanceTime && document.visibilityState === "visible") {
    s.state = s.engine.advanceTime(s.state, Math.round(elapsed)).state;
    render();
    queueSave();
  }
  s.remainder += elapsed;
  const ticks = Math.min(6, Math.floor(s.remainder / (1000 / 60)));
  s.remainder -= ticks * (1000 / 60);
  if (ticks && s.state && !["ready", "won", "lost", "finished"].includes(s.state.phase)) {
    const result = s.engine.advanceTicks(s.state, ticks);
    s.state = result.state;
    for (const event of result.events)
      if (["cells-cleared", "group-cleared", "tool-cleared"].includes(event.type)) playTone(event.chain ?? 1);
    render();
    queueSave();
  }
  requestAnimationFrame(frame);
}
