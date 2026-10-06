import { defineConfig } from "vitest/config";

// The engine tests play whole campaigns, which takes a few seconds on a slow runner: give each test room.
export default defineConfig({ test: { testTimeout: 60000, include: ["test/**/*.test.mjs", "src/**/*.test.js"] } });
