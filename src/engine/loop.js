const MAX_DT = 0.05;

export function startLoop(onFrame) {
  let rafId = 0;
  let last = null;

  function tick(now) {
    const seconds = last === null ? 0 : (now - last) / 1000;
    last = now;
    const dt = Math.min(Math.max(seconds, 0), MAX_DT);
    onFrame(dt, now);
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  return function stop() {
    cancelAnimationFrame(rafId);
  };
}
