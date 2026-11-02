import { refreshAppearanceLanguage } from "./appearance.js";
import { playTone, setSound, soundEnabled, unlockSound } from "./audio.js";
import { fillCampaignSelector } from "./campaigns.js";
import {
  applyAction,
  BOARD_SIDE,
  canPlace,
  createGame,
  createLevel,
  createTutorial,
  decodeGame,
  encodeGame,
  levelManifest,
  restartGame,
  tutorialManifest,
} from "./dist/tsumiki.js";
import { updateEnding } from "./ending.js";
import { newSeed } from "./seed.js";
import { pageWords } from "./words.js";

const $ = (selector) => document.querySelector(selector);
const text = {
  en: {
    settings: "Settings",
    mode: "Mode",
    relaxed: "Relaxed",
    daily: "Daily",
    campaign: "Campaign level",
    lessonLabel: "Lesson",
    freePlay: "Free play",
    noLesson: "No lesson",
    new: "New game",
    restart: "Restart",
    help: "Choose a shape in the tray, then the square for its top left. A full row or column clears.",
    sound: "Sound effects",
    title: "Tsumiki",
    score: "Score",
    lines: "Lines",
    placed: "Placed",
    choose: "Choose a shape in the tray.",
    place: "Now press the square for its top left.",
    blocked: "That shape does not fit there.",
    goalScore: "Reach {n} points.",
    goalLines: "Clear {n} lines.",
    goalStones: "Clear every stone.",
    cell: "Row {row}, column {column}",
    filled: "filled",
    empty: "empty",
    stone: "stone",
    slot: "Shape {n}",
    spent: "Shape {n}, already laid",
  },
  ja: {
    settings: "設定",
    mode: "モード",
    relaxed: "ゆったり",
    daily: "デイリー",
    campaign: "キャンペーン",
    lessonLabel: "レッスン",
    freePlay: "フリープレイ",
    noLesson: "レッスンなし",
    new: "新しいゲーム",
    restart: "やり直す",
    help: "トレーの形を選び、形の左上が入るマスを押します。行か列がそろうと消えます。",
    sound: "効果音",
    title: "積み木",
    score: "得点",
    lines: "消した本数",
    placed: "手数",
    choose: "トレーの形を選びます。",
    place: "形の左上が入るマスを押します。",
    blocked: "その形はそこに置けません。",
    goalScore: "{n}点をめざします。",
    goalLines: "{n}本を消します。",
    goalStones: "石をすべて消します。",
    cell: "{row}行{column}列",
    filled: "埋まっています",
    empty: "空きです",
    stone: "石",
    slot: "形{n}",
    spent: "形{n}は置きました",
  },
};

const saveKey = "houseki-tsumiki-save";
const family = familyLanguage({ id: "houseki", words: pageWords("tsumiki"), onChange: (next) => setLanguage(next) });
let lang = family.lang;
let game;
let chosen = null;
let selectedLevel = null;
let selectedLesson = null;

function t(key, values = {}) {
  return Object.entries(values).reduce(
    (line, [name, value]) => line.replace(`{${name}}`, String(value)),
    text[lang][key] ?? text.en[key] ?? key,
  );
}
function setLanguage(value) {
  lang = value === "ja" ? "ja" : "en";
  refreshAppearanceLanguage(lang);
  fillSelectors();
  for (const node of document.querySelectorAll("[data-i]")) node.textContent = t(node.dataset.i);
  render();
}
function fillSelectors() {
  const level = $("#level").value;
  const lesson = $("#lesson").value;
  fillCampaignSelector($("#level"), levelManifest, lang, t("freePlay"));
  $("#lesson").innerHTML =
    `<option value="">${t("noLesson")}</option>` +
    tutorialManifest.map((item) => `<option value="${item.id}">${item.title[lang]}</option>`).join("");
  $("#level").value = level;
  $("#lesson").value = lesson;
}
function goalLine(goal) {
  if (!goal) return "";
  return goal.kind === "score"
    ? t("goalScore", { n: goal.target })
    : goal.kind === "lines"
      ? t("goalLines", { n: goal.target })
      : t("goalStones");
}
function save() {
  try {
    localStorage.setItem(saveKey, encodeGame(game));
  } catch {
    /* Saving is optional. */
  }
}
function newGame(restart = false) {
  if (restart && game) game = restartGame(game);
  else {
    selectedLesson = tutorialManifest.find((item) => item.id === $("#lesson").value) ?? null;
    selectedLevel = selectedLesson ? null : (levelManifest.find((item) => item.id === $("#level").value) ?? null);
    game = selectedLesson
      ? createTutorial(selectedLesson.id)
      : selectedLevel
        ? createLevel(selectedLevel.id)
        : createGame({
            mode: $("#mode").value,
            seed: newSeed(),
            ...($("#mode").value === "daily" ? { dailyDate: new Date().toISOString().slice(0, 10) } : {}),
          });
  }
  chosen = null;
  $("#status").textContent = "";
  save();
  render();
}
function press(row, column) {
  if (chosen === null) {
    $("#status").textContent = t("choose");
    return;
  }
  const result = applyAction(game, { kind: "place", slot: chosen, row, column });
  if (!result.accepted) {
    $("#status").textContent = t("blocked");
    return;
  }
  const before = game.lines;
  game = result.state;
  chosen = null;
  $("#status").textContent = "";
  if (game.lines > before) playTone(game.lines - before, false);
  else playTone(1, true);
  save();
  render();
}
function shapeMarkup(piece) {
  const rows = Math.max(...piece.cells.map(([row]) => row)) + 1;
  const columns = Math.max(...piece.cells.map(([, column]) => column)) + 1;
  const filled = new Set(piece.cells.map(([row, column]) => `${row}:${column}`));
  let marks = "";
  for (let row = 0; row < rows; row += 1)
    for (let column = 0; column < columns; column += 1)
      marks += filled.has(`${row}:${column}`)
        ? `<span class="tsumiki-mark" data-colour="${piece.colour}"></span>`
        : '<span class="tsumiki-mark" data-empty="true"></span>';
  return `<span class="tsumiki-shape" style="grid-template-columns:repeat(${columns},auto)">${marks}</span>`;
}
function render() {
  $("#score").textContent = String(game.score);
  $("#lines").textContent = String(game.lines);
  $("#moves").textContent = String(game.moves);
  const playing = game.phase === "ready";
  const cells = [];
  for (let at = 0; at < BOARD_SIDE * BOARD_SIDE; at += 1) {
    const block = game.board[at];
    const row = Math.floor(at / BOARD_SIDE);
    const column = at % BOARD_SIDE;
    const fits = playing && chosen !== null && canPlace(game, chosen, row, column);
    const state = block ? (block.stone ? t("stone") : t("filled")) : t("empty");
    cells.push(
      `<button type="button" class="tsumiki-cell" role="gridcell" data-cell="${at}" data-fits="${fits}"${block ? ` data-colour="${block.colour}"` : ""}${block?.stone ? ' data-stone="true"' : ""} aria-label="${t("cell", { row: row + 1, column: column + 1 })}, ${state}"></button>`,
    );
  }
  $("#grid").innerHTML = cells.join("");
  $("#tray").innerHTML = game.tray
    .map(
      (piece, slot) =>
        `<button type="button" class="tsumiki-slot" data-slot="${slot}" aria-pressed="${chosen === slot}"${piece && playing ? "" : " disabled"} aria-label="${t(piece ? "slot" : "spent", { n: slot + 1 })}">${piece ? shapeMarkup(piece) : ""}</button>`,
    )
    .join("");
  const objective = selectedLesson?.objective[lang] ?? goalLine(game.settings.goal);
  $("#objective").hidden = objective === "";
  $("#objective").textContent = objective;
  $("#restart").disabled = game.moves === 0;
  if (playing && $("#status").textContent === "") $("#status").textContent = chosen === null ? t("choose") : t("place");
  updateEnding({
    phase: game.phase,
    score: game.score,
    lang,
    mode: game.settings.mode,
    level: selectedLesson ? { ...selectedLesson, lesson: true } : selectedLevel,
    onRestart: () => newGame(true),
  });
}

$("#grid").addEventListener("click", (event) => {
  const cell = event.target.closest("[data-cell]");
  if (cell) {
    const at = Number(cell.dataset.cell);
    press(Math.floor(at / BOARD_SIDE), at % BOARD_SIDE);
  }
});
$("#tray").addEventListener("click", (event) => {
  const slot = event.target.closest("[data-slot]");
  if (!slot || slot.disabled) return;
  chosen = chosen === Number(slot.dataset.slot) ? null : Number(slot.dataset.slot);
  $("#status").textContent = "";
  render();
});
$("#new").addEventListener("click", () => newGame());
$("#restart").addEventListener("click", () => newGame(true));
$("#sound").checked = soundEnabled();
$("#sound").addEventListener("change", (event) => setSound(event.target.checked));
document.addEventListener("pointerdown", unlockSound);

refreshAppearanceLanguage(lang);
fillSelectors();
for (const node of document.querySelectorAll("[data-i]")) node.textContent = t(node.dataset.i);
try {
  const saved = localStorage.getItem(saveKey);
  if (saved) {
    game = decodeGame(saved);
    selectedLevel = levelManifest.find((item) => item.seed === game.settings.seed) ?? null;
    selectedLesson = tutorialManifest.find((item) => item.seed === game.settings.seed) ?? null;
    $("#level").value = selectedLevel?.id ?? "";
    $("#lesson").value = selectedLesson?.id ?? "";
    $("#mode").value = game.settings.mode === "daily" ? "daily" : "relaxed";
  }
} catch {
  game = undefined;
}
if (game) render();
else newGame();
