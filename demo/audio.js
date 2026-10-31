const key = "houseki-sound";
let enabled = false;
let context = null;
try {
  enabled = localStorage.getItem(key) === "on";
} catch {
  /* Optional storage. */
}
export const soundEnabled = () => enabled;
export function setSound(value) {
  enabled = Boolean(value);
  try {
    localStorage.setItem(key, enabled ? "on" : "off");
  } catch {
    /* Optional storage. */
  }
  if (enabled) unlockSound();
}
export function unlockSound() {
  if (!enabled) return;
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") void context.resume();
  } catch {
    /* Audio is optional. */
  }
}
export function playTone(chain = 1, landing = false) {
  if (!enabled || !context || context.state !== "running") return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  oscillator.type = "sine";
  oscillator.frequency.value = landing ? 260 : 520 * 1.12246 ** (Math.min(6, chain) - 1);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.025, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.14);
  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
}
