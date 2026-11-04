// Gem Swap and Stone Collapse page: drawing the board, the tools and the status.
import { positions, settle } from "./animation.js";
import { refreshAppearanceLanguage } from "./appearance.js";
import { updateEnding } from "./ending.js";
import { newGame } from "./tools-game.js";
import { $, powers, s, symbols } from "./tools-state.js";
import { text } from "./tools-words.js";

export function render() {
  const previous = positions($("#grid"));
  const t = text[s.lang];
  document.documentElement.lang = s.lang;
  refreshAppearanceLanguage(s.lang);
  document.querySelectorAll("[data-i]").forEach((e) => {
    e.textContent = t[e.dataset.i];
  });
  $("#title").textContent = s.state.game === "gem-swap" ? "Gem Swap" : "Stone Collapse";
  $("#score").textContent = s.state.score;
  $("#moves").textContent = s.state.moves;
  $("#instructions").textContent = s.state.game === "gem-swap" ? t.swap : t.collapse;
  const grid = $("#grid");
  const { width, height, mask } = s.state.settings;
  const activeFocus = document.activeElement?.closest("[data-cell]");
  const restoreFocus = activeFocus ? Number(activeFocus.dataset.cell) : null;
  grid.dataset.phase = s.state.phase;
  $(".board-scroll").dataset.oversized = String(height > 16 || width > 12);
  for (const option of $("#preset").options) {
    if (["extraWide", "deep", "large"].includes(option.value))
      option.disabled = globalThis.housekiConfig?.oversizedUnlocked === false;
  }
  grid.style.setProperty("--cols", width);
  grid.style.setProperty("--rows", height);
  grid.setAttribute("aria-rowcount", height);
  grid.setAttribute("aria-colcount", width);
  if (grid.children.length !== s.state.board.length)
    grid.innerHTML = s.state.board
      .map((_, i) => `<button type="button" class="full-cell" role="gridcell" data-cell="${i}"></button>`)
      .join("");
  const preview = new Set(s.state.toolPreview ?? []);
  const groups = new Set(s.state.selectedIds ?? []);
  const clearing = new Set(s.state.pendingCells ?? []);
  const pendingIds = new Set(s.state.pendingIds ?? []);
  [...grid.children].forEach((button, cell) => {
    const gem = s.state.board[cell];
    const portal = s.state.blackHole?.cell === cell;
    button.className = `full-cell${portal ? " portal" : ""}${!mask[cell] ? " masked" : ""}${cell === s.selectedCell || (gem && groups.has(gem.id)) ? " selected" : ""}${preview.has(cell) ? " preview" : ""}${clearing.has(cell) || (gem && pendingIds.has(gem.id)) ? " clearing" : ""}`;
    button.dataset.gemId = gem?.id ?? "";
    button.dataset.colour = gem?.colour ?? "";
    button.dataset.kind = gem?.kind ?? "";
    button.style.setProperty("--strength", portal ? String(s.state.blackHole.capacityRemaining / 8) : "0");
    const content = portal
      ? `<span class="portal-ring">◉</span>`
      : gem
        ? `<span class="gem ${gem.colour}" data-id="${gem.id}">${symbols[gem.colour]}</span>${gem.kind ? `<span class="power-symbol">${powers[gem.kind]}</span>` : ""}`
        : "";
    if (button.innerHTML !== content) button.innerHTML = content;
    button.disabled = !gem || s.state.phase !== "ready";
    button.tabIndex = cell === s.focusCell ? 0 : -1;
    button.setAttribute("aria-selected", String(cell === s.selectedCell || Boolean(gem && groups.has(gem.id))));
    button.setAttribute("aria-disabled", String(!gem || s.state.phase !== "ready"));
    button.setAttribute(
      "aria-label",
      `${portal ? `${t["black-hole"]}, ${s.state.blackHole.capacityRemaining} ${t.charges}` : gem ? `${gem.colour}${gem.kind ? ` ${gem.kind}` : ""}` : "Empty"}, ${Math.floor(cell / width) + 1}, ${(cell % width) + 1}${preview.has(cell) ? ` · ${t.preview}` : ""}`,
    );
  });
  settle(grid, previous);
  if (restoreFocus !== null) grid.children[restoreFocus]?.focus({ preventScroll: true });
  const legal = s.engine.legalActions(s.state);
  const tools =
    s.state.game === "gem-swap"
      ? ["bomb", "row-clear", "colour-clear", ...(s.state.settings.advancedTools ? ["black-hole"] : [])]
      : ["bomb", "pick"];
  $("#advanced").disabled =
    Boolean($("#advanced").dataset.authoredLock) || !$("#tools").checked || $("#tools").disabled;
  $("#advanced-field").hidden = s.state.game !== "gem-swap";
  const inventory = $("#inventory");
  if (inventory.dataset.catalog !== tools.join(",")) {
    inventory.dataset.catalog = tools.join(",");
    inventory.innerHTML = tools
      .map((tool) => `<button type="button" class="fam-button" data-tool="${tool}"></button>`)
      .join("");
  }
  for (const button of inventory.children) {
    const tool = button.dataset.tool;
    const count = tool === "black-hole" ? s.state.blackHoleCharges : (s.state.inventory?.[tool] ?? 0);
    button.textContent = `${tool === "bomb" ? "✹" : tool === "row-clear" ? "↔" : tool === "colour-clear" ? "✦" : "⊙"} ${t[tool]} × ${count}`;
    button.disabled = !legal.some((action) => action.kind === "select-tool" && action.tool === tool);
    button.setAttribute("aria-pressed", String(s.state.selectedTool === tool));
  }
  $("#rare-earning").hidden = !s.state.settings.advancedTools;
  $("#rare-earning").textContent = `${s.state.blackHoleProgress ?? 0}/48 ${t.rare}`;
  $("#portal-state").hidden = !s.state.blackHole;
  $("#portal-state").textContent = s.state.blackHole
    ? `${t["black-hole"]}: ${s.state.blackHole.capacityRemaining}/8 ${t.charges} · ${s.state.blackHole.movesRemaining} ${t.remaining}`
    : "";
  $("#earning").textContent = s.state.settings.tools ? `${s.state.toolProgress ?? 0}/12 ${t.earning}` : t.disabled;
  $("#size-hint").textContent = t.small;
  $("#size-hint").hidden = grid.querySelector(".full-cell:not(.masked)").getBoundingClientRect().width >= 28;
  $("#preview").textContent = s.state.selectedTool
    ? preview.size
      ? `${preview.size} ${t.preview}`
      : t.target
    : s.state.game === "stone-collapse" && groups.size
      ? `${groups.size} · +${s.state.previewScore}`
      : "";
  $("#preview").hidden = !$("#preview").textContent;
  $("#confirm").disabled = !legal.some((action) => action.kind === "confirm" || action.kind === "confirm-tool");
  $("#cancel").disabled =
    !legal.some((action) => action.kind === "cancel" || action.kind === "cancel-tool") &&
    !(s.state.phase === "ready" && s.selectedCell !== null);
  $("#undo").hidden = !legal.some((action) => action.kind === "undo");
  $("#undo").disabled = !legal.some((action) => action.kind === "undo");
  $("#hint").hidden = !legal.some((action) => action.kind === "hint");
  $("#reshuffle").hidden = !legal.some((action) => action.kind === "reshuffle");
  $("#assisted").hidden = !s.state.assisted;
  const status = s.engine.statusOf(s.state);
  const goals = status.goalProgress ?? [];
  if (s.selectedLevel && s.state.game === "stone-collapse") {
    const goal = s.selectedLevel.goal;
    let target;
    let current;
    if (goal.kind === "score-target") {
      target = goal.minimumScore;
      current = s.state.score;
    } else {
      const ids = goal.targetIds ?? s.selectedLevel.board.filter(Boolean).map((stone) => stone.id);
      target = ids.length;
      const remaining = new Set(s.state.board.filter(Boolean).map((stone) => stone.id));
      current = ids.filter((id) => !remaining.has(id)).length;
    }
    goals.push({ kind: goal.kind, target, current });
  }
  const labels =
    s.lang === "en"
      ? {
          score: "Points",
          collect: "Gems collected",
          chain: "Best chain",
          seals: "Seals cleared",
          "clear-all": "Stones cleared",
          "clear-targets": "Target stones",
          "score-target": "Points",
        }
      : {
          score: "得点",
          collect: "集めた石",
          chain: "最大連鎖",
          seals: "封印",
          "clear-all": "消した石",
          "clear-targets": "目標の石",
          "score-target": "得点",
        };
  $("#objectives").hidden = !goals.length;
  $("#objectives").innerHTML = goals
    .map(
      (goal) =>
        `<p>${labels[goal.kind] ?? goal.kind}${goal.colour ? ` · ${goal.colour}` : ""}: ${goal.current} / ${goal.target}</p><progress aria-label="${labels[goal.kind] ?? goal.kind}" max="${goal.target || 1}" value="${Math.min(goal.current, goal.target)}"></progress>`,
    )
    .join("");
  const remainingMoves =
    status.remainingMoves ?? (s.selectedLevel ? Math.max(0, s.selectedLevel.moveLimit - s.state.moves) : null);
  $("#budget").hidden = remainingMoves === null && status.remainingMs == null;
  $("#budget").textContent =
    status.remainingMs != null
      ? `${Math.ceil(status.remainingMs / 1000)} s`
      : remainingMoves !== null
        ? `${remainingMoves} ${t.remaining}`
        : "";
  const nextLevel =
    s.selectedLevel && !s.selectedLevel.lesson
      ? (s.engine.levelManifest ?? [])[
          (s.engine.levelManifest ?? []).findIndex((level) => level.id === s.selectedLevel.id) + 1
        ]
      : null;
  updateEnding({
    phase: s.state.phase,
    outcome: s.state.outcome,
    score: s.state.score,
    lang: s.lang,
    mode: s.state.mode ?? s.state.settings.mode,
    level: s.selectedLevel,
    next: nextLevel,
    onRestart: () => newGame(true),
    onNext: () => {
      $("#level").value = nextLevel.id;
      $("#lesson").value = "";
      newGame();
    },
    detail: $("#status").textContent,
  });
  $("#lesson-guide").hidden = !s.selectedLevel?.lesson;
  if (s.selectedLevel?.lesson)
    $("#lesson-guide").textContent = s.selectedLevel.steps
      .map((step) => (step.instruction ?? step.text)[s.lang])
      .join(" ");

  $("#status").textContent =
    s.notice ||
    (["won", "lost", "finished"].includes(s.state.phase)
      ? status.outcome === "won"
        ? t.goalWon
        : status.remainingMs === 0
          ? t.timeUp
          : status.outcome === "lost"
            ? t.goalLost
            : status.remainingMoves === 0 && status.mode === "daily"
              ? t.dailyDone
              : (t[s.state.phase] ?? t.finished)
      : s.state.phase !== "ready"
        ? t.clearing
        : s.state.selectedTool
          ? t.target
          : s.state.game === "gem-swap"
            ? t.chooseSwap
            : t.choose);
}
