/**
 * @fileoverview Progress save/load system using localStorage.
 * Ensures offline resilience on basic, shared mobile devices.
 */

export const SAVE_KEY = 'gojodojo-progress-v1';
const SAVE_DELAY_MS = 400;

/**
 * Creates a fresh default progress object with zero personally identifiable info.
 * @returns {object} Default player progress state
 */
function makeDefault() {
  return { version: 1, lang: 'hi', stones: {}, zones: {}, updatedAt: 0 };
}

/**
 * Loads saved progress from local storage.
 * Falls back to the default state if missing, invalid, or corrupted.
 * @returns {object} Validated progress object
 */
export function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem('gd-progress-v1');
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.version === 1 && p.stones && typeof p.stones === 'object') return p;
    }
  } catch (e) {
    void e;
  }
  return makeDefault();
}

/**
 * Pending state copy awaiting write to storage.
 * @type {object|null}
 */
let pending = null;

/**
 * Active timer identifier for debounced storage flush.
 * @type {number|null}
 */
let timer = null;

/**
 * Queues a progress save operation. Debounces writes by 400ms to preserve flash storage.
 * @param {object} p Current progress state to persist
 */
export function saveProgress(p) {
  try {
    pending = JSON.parse(JSON.stringify(p));
    pending.updatedAt = Date.now();
  } catch (e) {
    void e;
    return;
  }
  if (timer) clearTimeout(timer);
  timer = setTimeout(flushProgress, SAVE_DELAY_MS);
}

/**
 * Immediately flushes any queued progress payload to localStorage.
 */
export function flushProgress() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (!pending) return;
  const data = pending;
  pending = null;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    void e;
  }
}

/**
 * Resets local student progress to default clean state and clears storage.
 * @returns {object} Fresh default progress state
 */
export function resetProgress() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  pending = null;
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    void e;
  }
  return makeDefault();
}
