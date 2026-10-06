import js from "@eslint/js";
import tseslint from "typescript-eslint";

// What a script or a test run by Node reads from the global scope, and what a page's script reads from the browser's.
const node = { console: "readonly", process: "readonly", URL: "readonly", structuredClone: "readonly", setTimeout: "readonly", clearTimeout: "readonly" };
const browser = {
  document: "readonly", window: "readonly", location: "readonly", history: "readonly", navigator: "readonly", localStorage: "readonly", URLSearchParams: "readonly", Intl: "readonly",
  setInterval: "readonly", setTimeout: "readonly", clearTimeout: "readonly", requestAnimationFrame: "readonly", cancelAnimationFrame: "readonly", performance: "readonly", crypto: "readonly",
  matchMedia: "readonly", AudioContext: "readonly", HTMLElement: "readonly", getComputedStyle: "readonly", familyLanguage: "readonly", familyHelp: "readonly",
};

export default tseslint.config(
  { ignores: ["dist/", "site/", "node_modules/", "test-results/", "playwright-report/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // A name that starts with an underscore says it is left out on purpose: a rest sibling dropped from a copy, a parameter a signature must keep.
  { rules: { "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_", ignoreRestSiblings: true }] } },
  { files: ["e2e/**/*.mjs", "playwright.config.mjs"], languageOptions: { globals: { ...node, ...browser } } },
  { files: ["scripts/**/*.mjs", "test/**/*.mjs", "src/**/*.test.js"], languageOptions: { globals: node } },
  { files: ["demo/**/*.js"], languageOptions: { globals: browser } },
);
