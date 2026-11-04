// Colour Chains: drawing the board, the panels and the status.
import { positions, settle } from "./animation.js";
import { refreshAppearanceLanguage } from "./appearance.js";
import { levelText } from "./campaigns.js";
import { newGame } from "./chains-game.js";
import { levelsFor, populateLevels } from "./chains-setup.js";
import { $, s, symbols } from "./chains-state.js";
import { words } from "./chains-words.js";
import { applyAction, landingCells, levelManifest, powerDropPreview, tutorialManifest } from "./dist/colour-chains.js";
import { updateEnding } from "./ending.js";

function gemMarkup(gem, extra = "") {
  const target = s.game?.settings.goal?.kind === "clear-targets" && s.game.settings.goal.targetIds.includes(gem.id);
  const overlay =
    extra.includes("gravity-destination") || extra.includes("power-drop-ghost")
      ? 'style="position:absolute;inset:6%;pointer-events:none"'
      : "";
  return `<span ${gem.id !== undefined ? `data-id="${gem.id}"` : ""} class="gem ${gem.colour} ${gem.magnetic ? "magnetic" : ""} ${target ? "goal-target" : ""} ${extra}" ${overlay} aria-label="${gem.colour}${target ? (s.lang === "en" ? ", target" : ", 目標") : ""}">${symbols[gem.colour]}${gem.magnetic ? '<small aria-label="magnetic">✧</small>' : ""}</span>`;
}
export function render() {
  refreshAppearanceLanguage(s.lang);
  if (!s.game) return;
  if ($("#nature").dataset.authoredLock !== "true" && $("#weather").dataset.authoredLock !== "true") {
    const locked = s.game.settings.mode === "daily" || s.game.settings.mode === "challenge";
    $("#nature").disabled = locked;
    $("#weather").disabled = locked;
  }
  const previous = positions($("#well"));
  const w = s.game.settings.width;
  const h = s.game.settings.height;
  const totalH = h + 3;
  const cells = Array(w * totalH).fill("");
  s.game.board.forEach((gem, idx) => {
    if (gem) cells[idx] = gemMarkup(gem);
  });
  const landing = landingCells(s.game);
  const powerPreview = s.game.settings.nature && s.game.settings.mode !== "relaxed" ? powerDropPreview(s.game) : null;
  if (s.game.active) {
    const previewState = s.game.phase === "paused" ? applyAction(s.game, { kind: "resume" }).state : s.game;
    const projected = powerPreview ? applyAction(previewState, { kind: "hard-drop" }).state : null;
    const projectedBoard = projected?.gravityBoard ?? projected?.board;
    const previewCells = projectedBoard
      ? projectedBoard.flatMap((gem, index) =>
          gem && s.game.active.gems.some((active) => active.id === gem.id)
            ? [{ id: gem.id, x: index % w, y: Math.floor(index / w) - 3 }]
            : [],
        )
      : landing;
    previewCells?.forEach((cell, index) => {
      const gem = powerPreview
        ? s.game.active.gems.find((candidate) => candidate.id === cell.id)
        : s.game.active.gems[index];
      if (!gem) return;
      const at = (cell.y + 3) * w + cell.x;
      if (powerPreview) cells[at] += gemMarkup(gem, "ghost power-drop-ghost");
      else if (!cells[at]) cells[at] = gemMarkup(gem, "ghost");
    });
  }
  if (s.game.active) {
    const offsets = { up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0] };
    const [dx, dy] = offsets[s.game.active.orientation];
    s.game.active.gems.forEach((gem, i) => {
      const x = s.game.active.pivot.x + (i ? dx : 0);
      const y = s.game.active.pivot.y + (i ? dy : 0);
      const at = (y + 3) * w + x;
      if (at >= 0 && at < cells.length) cells[at] = gemMarkup(gem, "active");
    });
  }
  if (s.game.phase === "gravity" && s.game.gravityBoard) {
    for (let index = 0; index < s.game.gravityBoard.length; index++) {
      const gem = s.game.gravityBoard[index];
      if (!gem || s.game.board[index]?.id === gem.id) continue;
      cells[index] += gemMarkup(gem, "ghost gravity-destination");
    }
  }
  const well = $("#well");
  well.style.setProperty("--cols", String(w));
  well.style.setProperty("--rows", String(h));
  well.style.gridTemplateRows = `repeat(3, calc(var(--cell) * .42)) repeat(${h}, var(--cell))`;
  well.dataset.width = String(w);
  well.dataset.phase = s.game.phase;
  const oversized = h > 20 || w > 12;
  markBoardRegion(oversized);
  const clearCells = new Set(s.game.clearCells ?? []);
  const markup = cells
    .map((content, index) => {
      let current = content;
      if (clearCells.has(index) && s.game.board[index])
        current = gemMarkup(s.game.board[index], s.game.phase === "clear-remove" ? "removing" : "marked");
      return `<div class="cell${index < w * 3 ? " hidden-row" : ""}" data-cell="${index}" aria-label="${cellLabel(index, w, current)}">${current}</div>`;
    })
    .join("");
  if (well.dataset.markup !== markup) {
    well.innerHTML = markup;
    well.dataset.markup = markup;
    settle(well, previous);
  }
  const objective = $("#objective");
  objective.hidden = !s.selectedLevel;
  $("#lesson-guide").hidden = !s.selectedLevel?.lesson && !s.selectedLevel?.objective;
  if (s.selectedLevel?.lesson)
    $("#lesson-guide").textContent = s.selectedLevel.steps.map((step) => step.instruction[s.lang]).join(" ");
  else if (s.selectedLevel?.objective) $("#lesson-guide").textContent = s.selectedLevel.objective[s.lang];
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
  const pairLimit = s.game.settings.pairLimit;
  $("#run-progress").hidden = !pairLimit || s.game.settings.mode === "challenge";
  if (pairLimit) {
    $("#run-progress-label").textContent = s.lang === "en" ? "Resolved pairs" : "完了したペア";
    $("#run-progress-count").textContent = `${Math.min(s.game.completedPairs, pairLimit)} / ${pairLimit}`;
    $("#run-progress-bar").max = pairLimit;
    $("#run-progress-bar").value = Math.min(s.game.completedPairs, pairLimit);
    $("#run-progress-bar").setAttribute("aria-label", $("#run-progress-label").textContent);
  }
  $("#next").innerHTML = s.game.next
    .map(
      (piece, pieceIndex) =>
        `<div class="next-piece" aria-label="Next: ${piece.join(", ")}">${piece.map((colour, index) => gemMarkup({ colour, magnetic: s.game.nextMagnetic?.[pieceIndex]?.[index] })).join("")}</div>`,
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
            ? (s.game.waves.at(-1)?.chain ?? 1) > 1
              ? `Chain ${s.game.waves.at(-1)?.chain ?? 1}`
              : `Clear · ${s.game.clearCells?.length ?? 0}`
            : t.place;
  const lastWave = s.game.waves.at(-1);
  if (lastWave && ["clear-mark", "clear-remove", "gravity"].includes(s.game.phase))
    status = lastWave.chain > 1 ? `Chain ${lastWave.chain}` : `Clear · ${lastWave.ids.length}`;
  if (s.weatherNotice?.until > performance.now() && s.game.phase === "falling")
    status =
      s.weatherNotice.kind === "jumble"
        ? s.lang === "en"
          ? "Earthquake · stones shifted"
          : "地震 · 石が移動しました"
        : s.lang === "en"
          ? "Lightning · exposed stones removed"
          : "雷 · 上の石が消えました";
  $("#status").textContent = status;
  document.documentElement.lang = s.lang;
  if ($("#level").dataset.campaignLanguage !== s.lang) populateLevels();
  $("#lesson").options[0].textContent = s.lang === "en" ? "No lesson" : "レッスンなし";
  for (const option of [...$("#lesson").options].slice(1)) {
    option.textContent = tutorialManifest.find((item) => item.id === option.value).title[s.lang];
  }
  $("#level").options[0].textContent = s.lang === "en" ? "Free play" : "自由に遊ぶ";
  for (const option of [...$("#level").options].slice(1)) {
    const level = levelsFor($("#campaign").value).find((item) => item.id === option.value);
    if (level) option.textContent = levelText(level, s.lang);
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
  const relaxed = s.game.settings.mode === "relaxed";
  $(".drop").hidden = relaxed;
  $(".soft").hidden = relaxed;
  $(".place").hidden = !relaxed;
  $(".pause").hidden = s.game.phase === "paused" || ["won", "lost", "finished"].includes(s.game.phase);
  $(".resume").hidden = s.game.phase !== "paused";
  $(".resume").disabled = false;
  const terminal = ["won", "lost", "finished"].includes(s.game.phase);
  document.querySelectorAll(".controls [data-action]").forEach((button) => {
    button.disabled = terminal;
  });
  $("#well").parentElement.className = `well-wrap material-${$("#material").value}`;
  const activeLevels = s.selectedLevel?.campaign ? levelsFor(s.selectedLevel.campaign) : levelManifest;
  const nextLevel =
    s.selectedLevel && !s.selectedLevel.lesson
      ? activeLevels[activeLevels.findIndex((level) => level.id === s.selectedLevel.id) + 1]
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
      $("#campaign").value = s.selectedLevel.campaign ?? "basic";
      populateLevels();
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
  let current = oversized;
  const area = $(".well-scroll");
  const fitWide = s.game.settings.mode === "challenge" && s.game.settings.width > 12 && s.game.settings.height <= 20;
  area.dataset.authoredFit = String(fitWide);
  if (fitWide) {
    const available = Math.max(180, Math.min(window.innerWidth - 100, $(".game-screen").clientWidth - 76));
    $("#well").style.setProperty(
      "--authored-fit-cell",
      `${Math.max(12, Math.min(32, (available - 2 * (s.game.settings.width - 1)) / s.game.settings.width))}px`,
    );
  }
  current = current && !fitWide;
  area.dataset.oversized = String(current);
  $(".board-nav").hidden = !current;
  if (current) {
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
