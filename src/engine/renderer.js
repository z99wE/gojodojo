import * as THREE from 'three';

export const QUALITY = {
  high: { name: 'high', pixelRatio: 2, shadowMapSize: 2048, shadows: true },
  balanced: { name: 'balanced', pixelRatio: 1.5, shadowMapSize: 1024, shadows: true },
  fast: { name: 'fast', pixelRatio: 1, shadowMapSize: 1024, shadows: false },
};

const TIER_ORDER = ['high', 'balanced', 'fast'];
const SAMPLE_COUNT = 30;
const SLOW_FRAME_MS = 40;
const SLOW_TIME_LIMIT = 3;

export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  let tierName = 'high';
  const frameTimes = [];
  let frameSum = 0;
  let slowTime = 0;

  function applyPixelRatio() {
    const dpr = window.devicePixelRatio || 1;
    renderer.setPixelRatio(Math.min(dpr, QUALITY[tierName].pixelRatio));
  }

  function setQuality(tier) {
    const q = QUALITY[tier];
    if (!q) return;
    tierName = tier;
    renderer.shadowMap.enabled = q.shadows;
    applyPixelRatio();
  }

  function autoTune(dt) {
    const ms = dt * 1000;
    frameTimes.push(ms);
    frameSum += ms;
    if (frameTimes.length > SAMPLE_COUNT) frameSum -= frameTimes.shift();

    const avg = frameSum / frameTimes.length;
    if (avg > SLOW_FRAME_MS) {
      slowTime += dt;
      if (slowTime >= SLOW_TIME_LIMIT) {
        slowTime = 0;
        const idx = TIER_ORDER.indexOf(tierName);
        if (idx >= 0 && idx < TIER_ORDER.length - 1) {
          setQuality(TIER_ORDER[idx + 1]);
        }
        frameTimes.length = 0;
        frameSum = 0;
      }
    } else {
      slowTime = 0;
    }
  }

  function resize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    applyPixelRatio();
    renderer.setSize(w, h);
  }

  setQuality(tierName);

  return {
    renderer,
    setQuality,
    autoTune,
    resize,
    get tier() {
      return tierName;
    },
  };
}
