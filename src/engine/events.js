const listeners = new Map();

export function on(name, fn) {
  let set = listeners.get(name);
  if (!set) {
    set = new Set();
    listeners.set(name, set);
  }
  set.add(fn);
}

export function off(name, fn) {
  const set = listeners.get(name);
  if (!set) return;
  set.delete(fn);
  if (set.size === 0) listeners.delete(name);
}

export function emit(name, payload) {
  const set = listeners.get(name);
  if (!set) return;
  for (const fn of [...set]) {
    try {
      fn(payload);
    } catch (err) {
      console.error(`[events] listener for "${name}" failed`, err);
    }
  }
}
