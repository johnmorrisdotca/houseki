// Magnetic Blocks: drawing the board, the panels and the status.
import { positions, settle } from "./animation.js";
import { refreshAppearanceLanguage } from "./appearance.js";
import { syncCampaignControls } from "./blocks-controls.js";
import { newGame } from "./blocks-game.js";
import { $, capOversized, s, symbols } from "./blocks-state.js";
import { t } from "./blocks-words.js";
import { difficultyText } from "./campaigns.js";
import { applyAction, blockCells, levelManifest } from "./dist/magnetic-blocks.js";
import { updateEnding } from "./ending.js";

function symbol(gem) {
  return symbols[gem.colour] ?? "◆";
}
function gemMarkup(gem, classes = "") {
  const target = s.game?.settings.goal?.kind === "clear-targets" && s.game.settings.goal.targetIds.includes(gem.id);
  const colourLabel =
    { red: "red", blue: "blue", green: "green", gold: "gold", purple: "purple", teal: "teal" }[gem.colour] ?? "gem";
  const overlay = classes.includes("destination-ghost")
    ? ' style="position:absolute;inset:6%;pointer-events:none"'
    : "";
  return `<span class="gem ${gem.colour} ${target ? "goal-target" : ""} ${classes}"${overlay}${gem.id !== undefined ? ` data-id="${gem.id}"` : ""} role="img" aria-label="${colourLabel} gem${target ? (s.lang === "en" ? ", target" : ", 目標") : ""}">${symbol(gem)}</span>`;
}
function previewDrop() {
  if (s.game.phase !== "falling" || !s.game.active) return null;
  return applyAction(s.game, { kind: s.game.settings.mode === "relaxed" ? "land" : "hard-drop" }).state;
}
function floorClasses(floor) {
  return floor === "magnetic" ? "magnetic" : "calm";
}
function floorLabel(floor) {
  return floor === "magnetic" ? t("floorNameMagnetic") : t("floorNameCalm");
}
function currentShownFloor() {
  return s.game.pendingFloorOverride ?? s.game.floor;
}
function renderBoard(force = false) {
  const width = s.game.settings.width;
  const height = s.game.settings.height;
  const board = s.game.phase === "gravity" && s.game.gravityBoard ? s.game.gravityBoard : s.game.board;
  const blockPreview = previewDrop();
  const hitIds = new Set(blockPreview?.impactRemovedIds ?? []);
  const positionsById = new Map(board.flatMap((gem, index) => (gem ? [[gem.id, index]] : [])));
  const bonds = new Set();
  for (const edge of s.game.bonds) {
    const a = positionsById.get(edge.a);
    const b = positionsById.get(edge.b);
    if (a === undefined || b === undefined) continue;
    const ax = a % width;
    const ay = Math.floor(a / width);
    const bx = b % width;
    const by = Math.floor(b / width);
    if (bx === ax + 1) {
      bonds.add(`${a}:right`);
      bonds.add(`${b}:left`);
    }
    if (bx === ax - 1) {
      bonds.add(`${a}:left`);
      bonds.add(`${b}:right`);
    }
    if (by === ay + 1) {
      bonds.add(`${a}:down`);
      bonds.add(`${b}:up`);
    }
    if (by === ay - 1) {
      bonds.add(`${a}:up`);
      bonds.add(`${b}:down`);
    }
  }
  const contents = Array(width * height).fill("");
  const pending = new Set(s.game.pendingClear);
  board.forEach((gem, index) => {
    if (!gem) return;
    const edgeClasses = ["left", "right", "up", "down"]
      .filter((edge) => bonds.has(`${index}:${edge}`))
      .map((edge) => `bond-${edge}`)
      .join(" ");
    contents[index] = gemMarkup(
      gem,
      `${edgeClasses}${pending.has(index) ? " marked" : ""}${hitIds.has(gem.id) ? " impact-hit" : ""}`,
    );
  });
  if (s.game.active && s.game.phase === "falling" && blockPreview) {
    const projected = blockPreview.gravityBoard ?? blockPreview.board;
    for (let index = 0; index < projected.length; index++) {
      const gem = projected[index];
      if (!gem || !s.game.active.gems.some((active) => active.id === gem.id)) continue;
      contents[index] += gemMarkup(gem, "ghost destination-ghost");
    }
    for (const entry of blockCells(s.game.active, width))
      if (entry.index >= 0 && entry.index < contents.length) contents[entry.index] = gemMarkup(entry.gem, "active");
  }
  const boardMarkup = contents
    .map(
      (gem, index) =>
        `<div class="cell${s.game.settings.mask[index] ? "" : " masked"}" data-cell="${index}">${gem}</div>`,
    )
    .join("");
  const oversized = width > 12 || height > 20;
  $(".well-scroll").dataset.oversized = String(oversized);
  $(".board-nav").hidden = !oversized;
  {
    const area = $(".well-scroll");
    if (oversized) {
      area.setAttribute("tabindex", "0");
      area.setAttribute("role", "region");
      area.setAttribute("aria-label", t("boardLabel"));
    } else {
      area.removeAttribute("tabindex");
      area.removeAttribute("role");
      area.removeAttribute("aria-label");
    }
  }
  updateBoardScroll();
  const key = `${width}x${height}|${s.game.phase}|${boardMarkup}|${currentShownFloor()}|${s.game.pendingClear.join(",")}`;
  if (!force && key === s.boardKey) return;
  const well = $("#well");
  const previous = positions(well);
  well.style.setProperty("--cols", String(width));
  well.style.setProperty("--rows", String(height));
  well.dataset.width = String(width);
  well.dataset.height = String(height);
  well.dataset.phase = s.game.phase;
  well.style.gridTemplateColumns = `repeat(${width}, var(--cell))`;
  well.style.gridTemplateRows = `repeat(${height}, var(--cell))`;
  well.innerHTML = boardMarkup;
  s.boardKey = key;
  settle(well, previous);
  $("#floor-line").className = `floor-line ${floorClasses(currentShownFloor())}`;
  $("#floor-line").textContent = currentShownFloor() === "magnetic" ? "✧" : "●";
  if (blockPreview?.impactRemovedIds.length) {
    const message = t("impactPreview").replace("{n}", String(blockPreview.impactRemovedIds.length));
    $("#hits").textContent = message;
    $("#floor-preview").textContent =
      `${t(currentShownFloor() === "magnetic" ? "previewMagnetic" : "previewCalm")} ${message}`;
  } else {
    $("#hits").textContent = "";
    $("#floor-preview").textContent =
      `${t(currentShownFloor() === "magnetic" ? "previewMagnetic" : "previewCalm")}${currentShownFloor() !== s.game.floor ? ` ${t("override")}` : ""}`;
  }
}
export function renderHud(force = false) {
  const floor = currentShownFloor();
  const key = [
    s.game.score,
    s.game.maxChain,
    s.game.moves,
    s.game.placements,
    s.game.phase,
    s.game.floor,
    s.game.nextFloor,
    floor,
    s.game.floorSwitchCharges,
    s.game.pendingFloorOverride,
    s.game.active?.lockTicks,
    s.game.elapsedTicks,
    s.game.queue.length,
    s.selectedLevel?.id,
    s.selectedLesson?.id,
  ].join("|");
  if (!force && key === s.hudKey) return;
  s.hudKey = key;
  $("#score").textContent = String(s.game.score);
  $("#chain").textContent = String(s.game.maxChain);
  $("#placed").textContent = String(s.game.placements);
  $("#piece-limit").textContent = String(s.game.settings.pieceLimit);
  $("#placement-progress").max = s.game.settings.pieceLimit;
  $("#placement-progress").value = Math.min(s.game.placements, s.game.settings.pieceLimit);
  $("#placement-progress").setAttribute(
    "aria-label",
    `${t("placed")} ${s.game.placements}/${s.game.settings.pieceLimit}`,
  );
  const current = $("#current-floor");
  current.className = `floor-chip ${floorClasses(floor)}`;
  current.textContent = `${floor === "magnetic" ? "✧" : "●"} ${floorLabel(floor)}`;
  const next = $("#next-floor");
  next.className = `floor-chip ${floorClasses(s.game.nextFloor)}`;
  next.textContent = `${s.game.nextFloor === "magnetic" ? "✧" : "●"} ${floorLabel(s.game.nextFloor)}`;
  $("#charges").textContent = s.game.floorSwitchCharges ? "1" : "0";
  $("#charges").dataset.tone = s.game.floorSwitchCharges ? "good" : "bad";
  $("#charges").setAttribute("aria-label", s.game.floorSwitchCharges ? t("switchAvailable") : t("switchSpent"));
  for (const button of document.querySelectorAll("[data-floor]")) {
    button.disabled = s.game.phase !== "falling" || !s.game.floorSwitchCharges;
    button.setAttribute("aria-pressed", String(s.game.pendingFloorOverride === button.dataset.floor));
  }
  $("#cancel-floor").disabled = s.game.phase !== "falling" || !s.game.pendingFloorOverride;
  $("#apply-floor").hidden = !s.game.pendingFloorOverride || s.game.phase !== "falling";
  $("#apply-floor").textContent = t("apply");
  $("#lock-wrap").hidden = s.game.settings.mode !== "arcade" || !s.game.active || s.game.phase !== "falling";
  $("#lock-progress").value = s.game.active?.lockTicks ?? 0;
  $("#lock-progress").setAttribute("aria-label", `${t("lock")} ${s.game.active?.lockTicks ?? 0}/24`);
  const nextPieces = s.game.queue.slice(0, 3);
  $("#next").innerHTML =
    nextPieces
      .map(
        (piece, index) =>
          `<div class="next-piece" aria-label="${t("next")} ${index + 1}: ${piece.join(", ")}">${piece.map((colour) => gemMarkup({ colour }, "mini")).join("")}</div>`,
      )
      .join("") || `<span class="micro">—</span>`;
  const failedLevel = Boolean(s.selectedLevel && s.game.phase === "finished");
  const phaseText = failedLevel
    ? t("lost")
    : s.game.phase === "paused"
      ? t("paused")
      : s.game.phase === "won"
        ? t("won")
        : s.game.phase === "lost"
          ? t("lost")
          : s.game.phase === "finished"
            ? t("finished")
            : s.game.phase === "falling"
              ? t("ready")
              : `${s.game.phase === "clear-mark" ? "✦" : "·"} ${s.game.chain > 1 ? `${s.game.chain}×` : ""}`;
  $("#status").textContent = phaseText;
  const campaignDrop = Boolean(s.selectedLevel || s.selectedLesson);
  $(".place").hidden = s.game.settings.mode !== "relaxed";
  $(".drop").hidden = s.game.settings.mode !== "arcade" && !campaignDrop;
  $(".soft").hidden = s.game.settings.mode !== "arcade";
  const level = s.selectedLevel;
  const lesson = s.selectedLesson;
  $("#objective-title").textContent = level
    ? `${level.number} · ${level.title[s.lang]}`
    : (lesson?.title[s.lang] ?? "");
  $("#objective-marks").hidden = !level;
  $("#objective-marks").textContent = level ? difficultyText(level) : "";
  $("#objective-copy").textContent = level?.objective[s.lang] ?? lesson?.objective[s.lang] ?? "";
  const goalHud = $("#goal-hud");
  goalHud.hidden = !level;
  if (level) {
    const targets = level.options.goal?.kind === "clear-targets" ? level.options.goal.targetIds : [];
    const remaining = new Set(s.game.board.flatMap((gem) => (gem ? [gem.id] : [])));
    const cleared = targets.filter((id) => !remaining.has(id)).length;
    const total = targets.length;
    $("#goal-progress").max = total;
    $("#goal-progress").value = cleared;
    $("#goal-text").textContent = s.lang === "en" ? `Marked gems ${cleared}/${total}` : `目標の石 ${cleared}/${total}`;
    $("#goal-progress").setAttribute("aria-label", $("#goal-text").textContent);
  }
  $(".pause").hidden = s.game.phase === "paused" || ["won", "lost", "finished"].includes(s.game.phase);
  $(".resume").hidden = s.game.phase !== "paused";
  document.querySelectorAll(".controls button[data-action]").forEach((button) => {
    const action = button.dataset.action;
    button.disabled =
      (!s.game.active &&
        ["left", "right", "soft-drop", "hard-drop", "land", "rotate-clockwise", "rotate-anticlockwise"].includes(
          action,
        )) ||
      !["falling", "paused", "clear-mark", "clear-remove", "gravity"].includes(s.game.phase);
  });
  $("#well").parentElement.className = `well-wrap material-${$("#material").value}`;
  document.documentElement.lang = s.lang;
  document.querySelectorAll("[data-i]").forEach((element) => {
    const value = t(element.dataset.i);
    if (value) element.textContent = value;
  });
  $('[data-action="hard-drop"]').textContent = t("drop");
  $('[data-action="land"]').textContent = t("place");
  $('[data-action="soft-drop"]').textContent = t("down");
  $('[data-action="pause"]').textContent = t("pause");
  $('[data-action="resume"]').textContent = t("resume");
  const elapsed = Math.floor(s.game.elapsedTicks / 60);
  const time = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  $("#elapsed").textContent = time;
  for (const option of $("#preset").options)
    if (["extraWide", "deep", "large"].includes(option.value)) {
      option.disabled = capOversized;
      option.textContent = `${option.dataset.base ?? option.textContent.replace(/ · Locked$/, "")}${capOversized ? " · Locked" : ""}`;
      option.dataset.base ??= option.textContent.replace(/ · Locked$/, "");
    }
}
export function render(force = false) {
  refreshAppearanceLanguage(s.lang);
  if (!s.game) return;
  renderBoard(force);
  renderHud(force);
  syncCampaignControls();
  const activeLevel = s.selectedLesson ? { ...s.selectedLesson, lesson: true } : s.selectedLevel;
  const activeLevels = levelManifest;
  const index = s.selectedLevel ? activeLevels.findIndex((level) => level.id === s.selectedLevel.id) : -1;
  const next = index >= 0 ? (activeLevels[index + 1] ?? null) : null;
  const endingPhase = s.selectedLevel && s.game.phase === "finished" ? "lost" : s.game.phase;
  updateEnding({
    phase: endingPhase,
    score: s.game.score,
    lang: s.lang,
    mode: s.game.settings.mode,
    level: activeLevel,
    next,
    onRestart: () => newGame(true),
    onNext: next
      ? () => {
          $("#level").value = next.id;
          $("#lesson").value = "";
          newGame();
        }
      : undefined,
    detail: activeLevel?.objective?.[s.lang] ?? $("#status").textContent,
  });
}

export function updateBoardScroll() {
  const area = $(".well-scroll");
  if (!area) return;
  const percent = Math.round((area.scrollTop / Math.max(1, area.scrollHeight - area.clientHeight)) * 100);
  $(".scroll-position").textContent = `${percent}%`;
  $(".scroll-position").setAttribute("aria-label", `${t("scrollLabel")}: ${percent}%`);
}
