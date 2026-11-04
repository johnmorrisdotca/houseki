import { createInputScheduler } from "./dist/falling-triplets.js";

// The Falling Triplets page's shared state: one object every part of the page reads and writes.
export const $ = (selector) => document.querySelector(selector);
export const symbols = { red: "●", blue: "◆", green: "▲", gold: "■", purple: "+", teal: "☾" };
export const saveKey = "houseki-falling-triplets-save";
export const preferenceKey = "houseki-ui";
export const heldKeys = new Map();
export const pendingReleases = new Set();
export const s = {
  customSize: null,
  selectedLevel: null,
  lang: "en",
  game: undefined,
  startOptions: {},
  input: createInputScheduler(),
  lastFrame: 0,
  accumulator: 0,
  saveTimer: 0,
  resumeRequired: false,
};
