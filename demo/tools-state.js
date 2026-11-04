// Gem Swap and Stone Collapse page: the engines, the shared state and the board sizes.
import * as swap from "./dist/gem-swap.js";
import * as collapse from "./dist/stone-collapse.js";

export const $ = (selector) => document.querySelector(selector);
export const engines = {
  "gem-swap": {
    ...swap,
    levelManifest: swap.GEM_SWAP_CAMPAIGN,
    tutorialManifest: swap.GEM_SWAP_LESSONS,
    createLevel: (id) => swap.createGame(swap.GEM_SWAP_CAMPAIGN.find((level) => level.id === id).options),
  },
  "stone-collapse": collapse,
};
export const symbols = { red: "●", blue: "◆", green: "▲", gold: "■", purple: "+", teal: "☾" };
export const powers = { "row-beam": "↔", "column-beam": "↕", bomb: "✹", "colour-burst": "✦" };
export const presetSizes = {
  compact: [6, 6],
  standard: [8, 8],
  wide: [10, 6],
  tall: [6, 10],
  extraWide: [16, 10],
  deep: [8, 32],
  large: [12, 32],
};
export const s = {
  selectedLevel: null,
  pendingLevel: null,
  saveTimer: 0,
  lang: "en",
  state: undefined,
  engine: undefined,
  startOptions: undefined,
  activeUi: null,
  freePreferences: null,
  selectedCell: null,
  focusCell: 0,
  notice: "",
  lastFrame: 0,
  remainder: 0,
};
