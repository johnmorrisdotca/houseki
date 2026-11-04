// The Magnetic Blocks page's shared state: one object every part of the page reads and writes.
export const $ = (selector) => document.querySelector(selector);
export const symbols = { red: "●", blue: "◆", green: "▲", gold: "■", purple: "+", teal: "☾" };
export const saveKey = "houseki-magnetic-blocks-save";
export const preferenceKey = "houseki-ui";
export const capOversized = globalThis.housekiConfig?.oversizedUnlocked === false;
export const s = {
  lang: "en",
  game: undefined,
  startOptions: null,
  selectedLevel: null,
  selectedLesson: null,
  lastFrame: 0,
  accumulator: 0,
  saveTimer: 0,
  boardKey: "",
  hudKey: "",
};
