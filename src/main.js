import * as THREE from 'three';
import './ui/styles.css';
import { createRenderer } from './engine/renderer.js';
import { createInput, isTouch } from './engine/input.js';
import { createController } from './engine/controller.js';
import { startLoop } from './engine/loop.js';
import { createWorld } from './world/world.js';
import { emit, on } from './engine/events.js';
import { t, applyDom } from './i18n/index.js';
import { loadProgress, saveProgress, flushProgress } from './save.js';
import { getGrade, setGrade, progressKey } from './content/index.js';
import { createQuizModal } from './ui/quiz.js';
import { createProgressModal } from './ui/progress.js';
import { createBoardModal } from './ui/board-modal.js';
import { createHUD } from './ui/hud.js';

const INTERACT_RANGE = 2.5;
const BG_COLOR = 0xcfe3d6;

const container = document.getElementById('app');
const ui = document.getElementById('ui') || document.body;
const startEl = document.getElementById('start');
const startBtn = document.getElementById('start-btn');

const aspect = (container.clientWidth || window.innerWidth) /
  (container.clientHeight || window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(BG_COLOR);
scene.fog = new THREE.Fog(BG_COLOR, 30, 140);

const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 400);

const rend = createRenderer(container);
const renderer = rend.renderer;
const canvas = renderer.domElement;

const hemi = new THREE.HemisphereLight(0xffffff, 0x556b4a, 0.9);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffffff, 1.4);
sun.position.set(30, 50, 20);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -60;
sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60;
sun.shadow.camera.bottom = -60;
sun.shadow.bias = -0.0005;
scene.add(sun);

const world = createWorld(scene);
const input = createInput(canvas);
const controller = createController(camera, input, world);

// Crosshair (plain CSS, no emoji).
const crosshair = document.createElement('div');
crosshair.style.cssText = [
  'position:fixed',
  'left:50%',
  'top:50%',
  'width:8px',
  'height:8px',
  'margin:-4px 0 0 -4px',
  'border-radius:50%',
  'background:rgba(255,255,255,0.85)',
  'box-shadow:0 0 2px rgba(0,0,0,0.6)',
  'pointer-events:none',
].join(';');
ui.appendChild(crosshair);

// Pause hint, shown when desktop pointer lock is lost.
const hint = document.createElement('div');
hint.textContent = t('app.clickToContinue');
hint.style.cssText = [
  'position:fixed',
  'left:50%',
  'top:60%',
  'transform:translateX(-50%)',
  'padding:8px 16px',
  'background:rgba(15,31,27,0.85)',
  'color:#f4f1e8',
  'font:14px sans-serif',
  'border-radius:8px',
  'border:1px solid rgba(255,255,255,0.15)',
  'pointer-events:none',
  'display:none',
  'z-index:30',
].join(';');
ui.appendChild(hint);

let started = false;
let stopLoop = null;

function showHint(show) {
  if (isAnyModalOpen()) {
    hint.style.display = 'none';
    return;
  }
  hint.textContent = t('app.clickToContinue');
  hint.style.display = show ? 'block' : 'none';
}

function requestLock() {
  if (isTouch) return;
  if (isAnyModalOpen()) return;
  if (document.pointerLockElement === canvas) return;
  const p = canvas.requestPointerLock ? canvas.requestPointerLock() : null;
  if (p && typeof p.catch === 'function') p.catch(() => {});
}

function pauseGame(show) {
  controller.setPaused(true);
  if (show && !isAnyModalOpen()) showHint(true);
}

function resumeGame() {
  if (isAnyModalOpen()) return;
  controller.setPaused(false);
  showHint(false);
}

// Check if any UI dialog is currently displayed
function isAnyModalOpen() {
  return (
    (quizModal && quizModal.isOpen()) ||
    (progressModal && progressModal.isOpen()) ||
    (boardModal && boardModal.isOpen())
  );
}

// Handlers when modals open or close
function onModalOpen() {
  controller.setPaused(true);
  showHint(false);
  if (document.exitPointerLock) {
    try { document.exitPointerLock(); } catch (e) {}
  }
}

function onModalClose() {
  if (!isAnyModalOpen()) {
    controller.setPaused(false);
    showHint(false);
  }
}

// Progress saving helper
function handleSaveProgress(stoneId, grade, result) {
  const currentProgress = loadProgress();
  const key = progressKey(stoneId, grade);
  const existing = currentProgress.stones?.[key] || {};

  if (!currentProgress.stones) currentProgress.stones = {};
  currentProgress.stones[key] = {
    completed: true,
    score: result.score,
    total: result.total,
    attempts: (existing.attempts || 0) + 1,
    mistakes: result.mistakes || [],
    updatedAt: Date.now(),
  };

  saveProgress(currentProgress);
  flushProgress();
  if (hud) hud.update();
}

// Instantiate UI Modals and HUD
let hud = null;
let quizModal = null;
let progressModal = null;
let boardModal = null;

quizModal = createQuizModal({
  container: ui,
  getProgress: loadProgress,
  onSaveProgress: handleSaveProgress,
  onOpenProgress: () => {
    onModalOpen();
    progressModal.open('learner');
  },
  onClose: onModalClose,
});

progressModal = createProgressModal({
  container: ui,
  onOpenTopic: (topicId, grade) => {
    onModalOpen();
    quizModal.open(topicId, grade);
  },
  onClose: onModalClose,
});

boardModal = createBoardModal({
  container: ui,
  onOpenProgress: () => {
    onModalOpen();
    progressModal.open('learner');
  },
  onClose: onModalClose,
});

hud = createHUD({
  container: ui,
  onOpenProgress: (tab = 'learner') => {
    onModalOpen();
    progressModal.open(tab);
  },
  onLanguageChange: () => {
    applyDom(document);
    hint.textContent = t('app.clickToContinue');
  },
});

// Event listener for stone interaction
on('stone:interact', ({ id, zone, topic }) => {
  onModalOpen();
  if (id === 'hub-1') {
    boardModal.open();
  } else {
    quizModal.open(id, getGrade());
  }
});

// Keyboard shortcut: P for Progress
window.addEventListener('keydown', (e) => {
  if ((e.key === 'p' || e.key === 'P') && !e.ctrlKey && !e.metaKey && !e.altKey) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (progressModal.isOpen()) {
      progressModal.close();
    } else {
      onModalOpen();
      progressModal.open('learner');
    }
  }
});

// Pause and resume on tab visibility.
document.addEventListener('visibilitychange', () => {
  if (!started) return;
  if (document.hidden) {
    pauseGame(false);
  } else if (isTouch || document.pointerLockElement === canvas) {
    resumeGame();
  } else {
    pauseGame(true);
  }
});

// Pause and resume on pointer lock changes (desktop only).
document.addEventListener('pointerlockchange', () => {
  if (!started || isTouch) return;
  if (document.pointerLockElement === canvas) {
    resumeGame();
  } else {
    if (!isAnyModalOpen()) {
      pauseGame(true);
    }
  }
});

canvas.addEventListener('click', () => {
  if (!started || isTouch) return;
  if (isAnyModalOpen()) return;
  if (controller.isPaused()) requestLock();
});

// Start overlay.
startBtn.addEventListener('click', () => {
  if (startEl) startEl.style.display = 'none';
  started = true;
  requestLock();
  if (!stopLoop) {
    stopLoop = startLoop(frame);
  }
});

function findNearestStone() {
  const p = controller.position;
  let best = null;
  let bestD2 = INTERACT_RANGE * INTERACT_RANGE;
  for (const stone of world.stones) {
    const dx = stone.position.x - p.x;
    const dz = stone.position.z - p.z;
    const d2 = dx * dx + dz * dz;
    if (d2 <= bestD2) {
      bestD2 = d2;
      best = stone;
    }
  }
  return best;
}

function frame(dt) {
  controller.update(dt);
  world.update(dt, controller.position);

  const nearestStone = findNearestStone();
  if (hud) {
    hud.setPrompt(nearestStone);
  }

  if (input.consumeInteract() && !controller.isPaused() && !isAnyModalOpen()) {
    if (nearestStone) {
      emit('stone:interact', { id: nearestStone.id, zone: nearestStone.zone, topic: nearestStone.topic });
    }
  }

  renderer.render(scene, camera);
  rend.autoTune(dt);
}

function resize() {
  rend.resize();
  camera.aspect = (container.clientWidth || window.innerWidth) /
    (container.clientHeight || window.innerHeight);
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();
