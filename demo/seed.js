// A fresh seed for a new board, or the one the address names (`?seed=anything`), so that a board can be shared and a test can
// play the same board every time. `crypto.randomUUID` exists only on a page served securely (https, or localhost), so a demo
// opened from another address over plain http falls back to random bytes, and then to the clock.
export function newSeed() {
  const asked = new URLSearchParams(globalThis.location?.search ?? "").get("seed");
  if (asked !== null && asked !== "") return asked.slice(0, 128);
  const crypto = globalThis.crypto;
  if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
  if (typeof crypto?.getRandomValues === "function") return [...crypto.getRandomValues(new Uint8Array(16))].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `seed-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
