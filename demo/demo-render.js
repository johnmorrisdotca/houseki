// Falling Triplets: drawing the board, the panels and the status.
import { positions, settle } from "./animation.js";
import { refreshAppearanceLanguage } from "./appearance.js";
import { newGame } from "./demo-game.js";
import { $, s, symbols } from "./demo-state.js";
import { words } from "./demo-words.js";
import { landingY, levelManifest, tutorialManifest } from "./dist/falling-triplets.js";
import { updateEnding } from "./ending.js";

function gemMarkup(gem, extra = "") {
  const target = s.game?.settings.goal === "targets" && s.game.settings.targetIds?.includes(gem.id);
  return `<span ${gem.id !== undefined ? `data-id="${gem.id}"` : ""} class="gem ${gem.colour} ${target ? "goal-target" : ""} ${extra}" aria-label="${gem.colour}${target ? (s.lang === "en" ? ", target" : ", 目標") : ""}">${symbols[gem.colour]}</span>`;
}
export function render() {
  refreshAppearanceLanguage(s.lang);
  if (!s.game) return;
  const previous = positions($("#well"));
  const w = s.game.settings.width;
  const h = s.game.settings.height;
  const totalH = h + 3;
  const cells = Array(w * totalH).fill("");
  const board = s.game.phase === "gravity" && s.game.gravityBoard ? s.game.gravityBoard : s.game.board;
  const clearing = new Set(s.game.pendingClear ?? []);
  board.forEach((gem, idx) => {
    if (gem)
      cells[idx] = gemMarkup(gem, clearing.has(idx) ? (s.game.phase === "clear-remove" ? "removing" : "marked") : "");
  });
  const ghostY = landingY(s.game);
  if (s.game.active && ghostY !== null)
    s.game.active.gems.forEach((gem, i) => {
      const at = (ghostY + i + 3) * w + s.game.active.x;
      if (!cells[at]) cells[at] = gemMarkup(gem, "ghost");
    });
  if (s.game.active)
    s.game.active.gems.forEach((gem, i) => {
      const y = s.game.active.y + i;
      const at = (y + 3) * w + s.game.active.x;
      if (at >= 0 && at < cells.length) cells[at] = gemMarkup(gem, "active");
    });
  const well = $("#well");
  well.style.setProperty("--cols", String(w));
  well.style.setProperty("--rows", String(h));
  well.style.gridTemplateRows = `repeat(3, calc(var(--cell) * .42)) repeat(${h}, var(--cell))`;
  well.dataset.width = String(w);
  well.dataset.phase = s.game.phase;
  const oversized = h > 20 || w > 12;
  markBoardRegion(oversized);
  const markup = cells
    .map(
      (content, index) =>
        `<div class="cell${index < w * 3 ? " hidden-row" : ""}" aria-label="${cellLabel(index, w, content)}">${content}</div>`,
    )
    .join("");
  if (well.dataset.markup !== markup) {
    well.innerHTML = markup;
    well.dataset.markup = markup;
    settle(well, previous);
  }
  const objective = $("#objective");
  objective.hidden = !s.selectedLevel && !s.game.settings.pieceLimit;
  $("#lesson-guide").hidden = !s.selectedLevel?.lesson;
  if (s.selectedLevel?.lesson)
    $("#lesson-guide").textContent = s.selectedLevel.steps.map((step) => step.instruction[s.lang]).join(" ");
  if (s.selectedLevel) {
    const goal = s.selectedLevel.goal;
    const ids = goal.targetIds;
    const chain = goal.minimumChain ?? goal.chain;
    let target;
    let current;
    let label;
    if (ids) {
      target = ids.length;
      const remaining = new Set(s.game.board.filter(Boolean).map((gem) => gem.id));
      current = ids.filter((id) => !remaining.has(id)).length;
      label = s.lang === "en" ? "Target gems cleared" : "目標の石";
    } else if (chain) {
      target = chain;
      current = s.game.maxChain;
      label = s.lang === "en" ? "Best chain" : "最大連鎖";
    } else {
      target = s.selectedLevel.board.filter(Boolean).length;
      current = s.game.phase === "won" ? target : Math.max(0, target - s.game.board.filter(Boolean).length);
      label = s.lang === "en" ? "Clear the board" : "盤面を空にする";
    }
    $("#goal-text").textContent = `${label}: ${current} / ${target}`;
    $("#goal-progress").max = target || 1;
    $("#goal-progress").value = Math.min(current, target);
    $("#goal-progress").setAttribute("aria-label", label);
    const placed = s.game.completedPieces ?? s.game.completedPairs;
    $("#budget").textContent =
      `${s.lang === "en" ? "Pieces left" : "残り"}: ${Math.max(0, s.selectedLevel.queue.length - placed)}`;
  }
  $("#score").textContent = String(s.game.score);
  $("#chain").textContent = String(s.game.maxChain);
  if (!s.selectedLevel && s.game.settings.pieceLimit) {
    const total = s.game.settings.pieceLimit;
    const placed = s.game.completedPieces;
    $("#goal-text").textContent = `${s.lang === "ja" ? "置いた石" : "Pieces placed"}: ${placed}/${total}`;
    $("#goal-progress").max = total;
    $("#goal-progress").value = placed;
    $("#budget").textContent = `${s.lang === "ja" ? "残り" : "Pieces left"}: ${Math.max(0, total - placed)}`;
  }
  $("#next").innerHTML = s.game.next
    .map(
      (piece) =>
        `<div class="next-piece" aria-label="Next: ${piece.join(", ")}">${piece.map((colour) => gemMarkup({ colour })).join("")}</div>`,
    )
    .join("");
  const t = words[s.lang];
  let status =
    s.game.phase === "lost"
      ? s.selectedLevel
        ? s.lang === "en"
          ? "Challenge ended before the goal was reached"
          : "目標を達成できませんでした"
        : t.lost
      : s.game.phase === "won" || s.game.phase === "finished"
        ? t.won
        : s.game.phase === "paused"
          ? t.paused
          : s.game.phase === "clear-mark"
            ? s.game.resolutionChain > 1
              ? `Chain ${s.game.resolutionChain}`
              : `Clear · ${s.game.pendingClear?.length ?? 0}`
            : t.place;
  const lastWave = s.game.waves.at(-1);
  if (lastWave && ["clear-mark", "clear-remove", "gravity"].includes(s.game.phase))
    status = lastWave.chain > 1 ? `Chain ${lastWave.chain}` : `Clear · ${lastWave.clearedIds.length}`;
  $("#status").textContent = status;
  document.documentElement.lang = s.lang;
  $("#lesson").options[0].textContent = s.lang === "en" ? "No lesson" : "レッスンなし";
  for (const option of [...$("#lesson").options].slice(1)) {
    option.textContent = tutorialManifest.find((item) => item.id === option.value).title[s.lang];
  }
  $("#level").options[0].textContent = s.lang === "en" ? "Free play" : "自由に遊ぶ";
  for (const option of [...$("#level").options].slice(1)) {
    const level = levelManifest.find((item) => item.id === option.value);
    option.textContent = `${level.number} · ${level.marks}/5 · ${level.title[s.lang]}`;
  }
  document.querySelectorAll("[data-i]").forEach((el) => {
    const key = el.dataset.i;
    if (t[key]) el.textContent = t[key];
  });
  $('[data-action="place"]').textContent = t.placeButton;
  $('[data-action="hard-drop"]').textContent = t.drop;
  $('[data-action="soft-drop"]').textContent = t.down;
  $('[data-action="left"]').setAttribute("aria-label", t.left);
  $('[data-action="right"]').setAttribute("aria-label", t.right);
  $('[data-action="pause"]').textContent = t.pause;
  $('[data-action="resume"]').textContent = t.resume;
  const terminal = ["won", "lost", "finished"].includes(s.game.phase);
  document.querySelectorAll(".controls [data-action]").forEach((button) => {
    button.disabled = terminal;
  });
  const relaxed = s.game.settings.mode === "relaxed";
  $(".drop").hidden = relaxed;
  $(".soft").hidden = relaxed;
  $(".place").hidden = !relaxed;
  $(".pause").hidden = s.game.phase === "paused" || ["won", "lost", "finished"].includes(s.game.phase);
  $(".resume").hidden = s.game.phase !== "paused";
  $(".resume").disabled = false;
  $("#well").parentElement.className = `well-wrap material-${$("#material").value}`;
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === s.lang));
  });
  const nextLevel =
    s.selectedLevel && !s.selectedLevel.lesson
      ? levelManifest[levelManifest.findIndex((level) => level.id === s.selectedLevel.id) + 1]
      : null;
  updateEnding({
    phase: s.game.phase,
    score: s.game.score,
    lang: s.lang,
    mode: s.game.settings.mode,
    level: s.selectedLevel,
    next: nextLevel,
    onRestart: () => newGame(true),
    onNext: () => {
      $("#level").value = nextLevel.id;
      $("#lesson").value = "";
      newGame();
    },
    detail: status,
  });
}
export function updateBoardScroll() {
  const area = $(".well-scroll");
  if (!area) return;
  const percent = Math.round((area.scrollTop / Math.max(1, area.scrollHeight - area.clientHeight)) * 100);
  $(".scroll-position").textContent = `${percent}%`;
  $(".scroll-position").setAttribute("aria-label", `${words[s.lang].scrollLabel}: ${percent}%`);
}
function markBoardRegion(oversized) {
  const area = $(".well-scroll");
  area.dataset.oversized = String(oversized);
  $(".board-nav").hidden = !oversized;
  if (oversized) {
    area.setAttribute("tabindex", "0");
    area.setAttribute("role", "region");
    area.setAttribute("aria-label", words[s.lang].boardLabel);
  } else {
    area.removeAttribute("tabindex");
    area.removeAttribute("role");
    area.removeAttribute("aria-label");
  }
  updateBoardScroll();
}
function cellLabel(index, width, markup) {
  const y = Math.floor(index / width) - 3;
  const x = index % width;
  const gem = markup.match(/aria-label="([a-z]+)/);
  return gem
    ? `${markup.includes("goal-target") ? (s.lang === "en" ? "Target " : "目標 ") : ""}${gem[1]} gem, column ${x + 1}, row ${y + 1}`
    : `Empty, column ${x + 1}, row ${y + 1}`;
}
