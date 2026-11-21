import * as THREE from 'three';
import './ui/styles.css';
import { createRenderer } from './engine/renderer.js';
import { createInput, isTouch } from './engine/input.js';
import { createController } from './engine/controller.js';
import { startLoop } from './engine/loop.js';
import { createWorld } from './world/world.js';
import { makeViewmodelHand } from './world/props.js';
import { emit, on } from './engine/events.js';
import { t, applyDom } from './i18n/index.js';
import { loadProgress, saveProgress, flushProgress } from './save.js';
import { getGrade, progressKey } from './content/index.js';
import { createQuizModal } from './ui/quiz.js';
import { createProgressModal } from './ui/progress.js';
import { createBoardModal } from './ui/board-modal.js';
import { createHUD } from './ui/hud.js';
import { playCoinSound } from './ui/audio.js';

const INTERACT_RANGE = 2.8;
// Dreamy South Korean Pastel Anime Sky
const BG_COLOR = 0xfff0f5;

const container = document.getElementById('app');
const ui = document.getElementById('ui') || document.body;
const startEl = document.getElementById('start');
const startBtn = document.getElementById('start-btn');

const aspect = (container.clientWidth || window.innerWidth) /
  (container.clientHeight || window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(BG_COLOR);
scene.fog = new THREE.Fog(BG_COLOR, 35, 160);

const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 400);

const rend = createRenderer(container);
const renderer = rend.renderer;
const canvas = renderer.domElement;

// Warm pastel ambient hemisphere light
const hemi = new THREE.HemisphereLight(0xfff5f8, 0xd4bbf9, 1.1);
scene.add(hemi);

// Sunny pastel directional light
const sun = new THREE.DirectionalLight(0xfff8ee, 1.5);
sun.position.set(30, 50, 20);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -60;
sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60;
sun.shadow.camera.bottom = -60;
sun.shadow.bias = -0.0005;
scene.add(sun);

// First-Person 3D Viewmodel Hand (Attached directly to Camera)
const viewmodel = makeViewmodelHand();
camera.add(viewmodel.group);
scene.add(camera);

const world = createWorld(scene);
const input = createInput(canvas);
const controller = createController(camera, input, world);

// Crosshair (delicate pastel dot)
const crosshair = document.createElement('div');
crosshair.style.cssText = [
  'position:fixed',
  'left:50%',
  'top:50%',
  'width:8px',
  'height:8px',
  'margin:-4px 0 0 -4px',
  'border-radius:50%',
  'background:rgba(255,117,140,0.85)',
  'box-shadow:0 0 4px rgba(255,255,255,0.9), 0 0 10px rgba(255,117,140,0.5)',
  'pointer-events:none',
  'z-index:40',
].join(';');
ui.appendChild(crosshair);

// Pause hint overlay
const hint = document.createElement('div');
hint.textContent = t('app.clickToContinue');
hint.style.cssText = [
  'position:fixed',
  'left:50%',
  'top:60%',
  'transform:translateX(-50%)',
  'padding:10px 20px',
  'background:rgba(255,255,255,0.95)',
  'color:#2d2438',
  'font:800 15px "Baloo 2", sans-serif',
  'border-radius:999px',
  'border:2.5px solid #ffb7b2',
  'box-shadow:0 8px 24px rgba(255,183,178,0.4)',
  'pointer-events:none',
  'display:none',
  'z-index:150',
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
  if (show && !isAnyModalOpen() && started) showHint(true);
}

function resumeGame() {
  if (isAnyModalOpen()) return;
  controller.setPaused(false);
  showHint(false);
}

function isAnyModalOpen() {
  return (
    (quizModal && quizModal.isOpen()) ||
    (progressModal && progressModal.isOpen()) ||
    (boardModal && boardModal.isOpen())
  );
}

function onModalOpen() {
  controller.setPaused(true);
  showHint(false);
  if (document.exitPointerLock) {
    try { document.exitPointerLock(); } catch (e) { void e; }
  }
}

function onModalClose() {
  if (!isAnyModalOpen()) {
    controller.setPaused(false);
    showHint(false);
  }
}

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
  onReward: (score, total) => {
    if (hud) hud.addQuizReward(score, total);
  },
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
  getController: () => controller,
  getWorld: () => world,
  onOpenProgress: (tab = 'learner') => {
    onModalOpen();
    progressModal.open(tab);
  },
  onLanguageChange: () => {
    applyDom(document);
    hint.textContent = t('app.clickToContinue');
  },
});

// Coin Pickup Sound and XP Event
on('coin:collect', ({ id, amount }) => {
  playCoinSound();
  if (hud) hud.addGold(amount);
});

// Stone Interaction Event
on('stone:interact', ({ id, zone, topic }) => {
  onModalOpen();
  if (id === 'hub-1') {
    boardModal.open();
  } else {
    quizModal.open(id, getGrade());
  }
});

// Keyboard shortcut: P for Adventure Log / Progress
window.addEventListener('keydown', (e) => {
  if ((e.key === 'p' || e.key === 'P' || e.code === 'KeyP') && !e.ctrlKey && !e.metaKey && !e.altKey) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (progressModal.isOpen()) {
      progressModal.close();
    } else {
      onModalOpen();
      progressModal.open('learner');
    }
  }
});

// Pause on visibility change
document.addEventListener('visibilitychange', () => {
  if (!started) return;
  if (document.hidden) {
    controller.setPaused(true);
  } else if (!isAnyModalOpen()) {
    resumeGame();
  }
});

// Pointer lock change listener
document.addEventListener('pointerlockchange', () => {
  if (!started) return;
  if (document.pointerLockElement === canvas) {
    showHint(false);
  }
});

canvas.addEventListener('click', () => {
  if (!started) return;
  if (isAnyModalOpen()) return;
  if (!isTouch && document.pointerLockElement !== canvas) {
    requestLock();
  }
  resumeGame();
  // Trigger punch animation on click
  punchTime = 1.0;
});

// Start button click & touch handling
function handleStartGame() {
  if (startEl) startEl.style.display = 'none';
  started = true;
  resumeGame();
  requestLock();
  if (!stopLoop) {
    stopLoop = startLoop(frame);
  }
}

if (startBtn) {
  startBtn.addEventListener('click', handleStartGame);
  startBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleStartGame();
  });
}

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

let animTime = 0;
let punchTime = 0;

function frame(dt) {
  controller.update(dt);
  world.update(dt, controller.position);

  const nearestStone = findNearestStone();
  if (hud) {
    hud.setPrompt(nearestStone);
    hud.updateRadar();
  }

  // 1. Viewmodel Hand Animation (First-Person Immersion)
  animTime += dt;
  const move = input.getMove();
  const isMoving = Math.hypot(move.x, move.z) > 0.1;
  const isSprinting = input.isSprinting();

  // Dynamic Camera FOV (Vice City speed rush)
  const targetFov = isSprinting && isMoving ? 68 : 60;
  camera.fov += (targetFov - camera.fov) * (dt * 6.0);
  camera.updateProjectionMatrix();

  // Natural head-bobbing / hand sway
  const bobSpeed = isSprinting ? 12 : 7;
  const bobAmountY = isMoving ? Math.sin(animTime * bobSpeed) * 0.014 : Math.sin(animTime * 2) * 0.004;
  const bobAmountX = isMoving ? Math.cos(animTime * (bobSpeed * 0.5)) * 0.01 : 0;

  let handZ = 0;
  if (punchTime > 0) {
    punchTime -= dt * 4.5;
    handZ = -Math.sin(punchTime * Math.PI) * 0.16;
    viewmodel.knuckleCrystal.scale.setScalar(1.5);
  } else {
    viewmodel.knuckleCrystal.scale.setScalar(1.0);
  }

  viewmodel.group.position.set(bobAmountX, bobAmountY, handZ);

  // 2. Interaction consume
  if (input.consumeInteract() && !controller.isPaused() && !isAnyModalOpen()) {
    punchTime = 1.0;
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
