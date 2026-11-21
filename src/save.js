// Progress save/load using localStorage. All storage access is guarded.
export const SAVE_KEY = 'ss-progress-v1';
const SAVE_DELAY_MS = 400;

// Fresh default progress object.
function makeDefault() {
  return { version: 1, lang: 'hi', stones: {}, zones: {}, updatedAt: 0 };
}

// Load saved progress. Falls back to the default if missing, invalid or wrong version.
export function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.version === 1 && p.stones && typeof p.stones === 'object') return p;
    }
  } catch (e) {
    // Bad JSON or blocked storage: use the default.
  }
  return makeDefault();
}

// Pending save: only the latest one is written.
let pending = null;
let timer = null;

// Queue a save. Stores a copy stamped with the current time; writes after 400 ms.
export function saveProgress(p) {
  try {
    pending = JSON.parse(JSON.stringify(p));
    pending.updatedAt = Date.now();
  } catch (e) {
    return; // Could not copy the object (e.g. circular); skip this save.
  }
  if (timer) clearTimeout(timer);
  timer = setTimeout(flushProgress, SAVE_DELAY_MS);
}

// Write any pending save right away.
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
    // Storage full or blocked; progress stays in memory only.
  }
}

// Remove saved progress, cancel any pending save, and return the default.
export function resetProgress() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  pending = null;
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    // Storage blocked; nothing to remove.
  }
  return makeDefault();
}
