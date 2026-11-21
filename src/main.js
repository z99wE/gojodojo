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
import {
  playCoinSound,
  playLaserShotSound,
  playTargetHitSound,
  playCarHornSound,
  playAlarmSound,
  playRefractionSound,
  playChemicalFizzSound,
  playOverheatSound,
  playForcefieldDownSound,
} from './ui/audio.js';

const INTERACT_RANGE = 2.8;
// Vice City Synthwave Twilight Sky / Ocean Tone
const BG_COLOR = 0x120324;

const container = document.getElementById('app');
const ui = document.getElementById('ui') || document.body;
const startEl = document.getElementById('start');
const startBtn = document.getElementById('start-btn');

const aspect = (container.clientWidth || window.innerWidth) /
  (container.clientHeight || window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(BG_COLOR);
scene.fog = new THREE.FogExp2(0x1a0736, 0.0048);

const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 400);

const rend = createRenderer(container);
const renderer = rend.renderer;
const canvas = renderer.domElement;

// Warm sunset ambient hemisphere light
const hemi = new THREE.HemisphereLight(0xffb7b2, 0x4a154b, 1.25);
scene.add(hemi);

// Sunny sunset directional light
const sun = new THREE.DirectionalLight(0xffecd2, 1.8);
sun.position.set(20, 45, -30);
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

// Dynamic Targeting Reticle
const reticleWrap = document.createElement('div');
reticleWrap.id = 'ss-reticle-wrap';
reticleWrap.style.cssText = [
  'position:fixed',
  'left:50%',
  'top:50%',
  'transform:translate(-50%, -50%)',
  'pointer-events:none',
  'z-index:45',
  'display:flex',
  'flex-direction:column',
  'align-items:center',
  'justify-content:center',
  'transition:all 0.1s ease-out',
].join(';');

const reticleDot = document.createElement('div');
reticleDot.style.cssText = [
  'width:10px',
  'height:10px',
  'border-radius:50%',
  'border:2px solid #00f5d4',
  'background:rgba(255, 59, 119, 0.9)',
  'box-shadow:0 0 8px #00f5d4, 0 0 16px #ff3b77',
  'transition:transform 0.12s ease',
].join(';');

const reticleLabel = document.createElement('div');
reticleLabel.style.cssText = [
  'margin-top:8px',
  'padding:2px 8px',
  'font:800 11px "Fredoka", sans-serif',
  'color:#fff',
  'background:rgba(18, 3, 36, 0.88)',
  'border:1.5px solid #00f5d4',
  'border-radius:6px',
  'letter-spacing:1px',
  'text-transform:uppercase',
  'display:none',
  'box-shadow:0 2px 12px rgba(0,0,0,0.6)',
].join(';');

reticleWrap.appendChild(reticleDot);
reticleWrap.appendChild(reticleLabel);
ui.appendChild(reticleWrap);

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

// Game Rules, Stakes & Player Telemetry
let playerShield = 100;
let playerEnergy = 100;
let lockdownTimer = 0;
let gameTime = 0;

function applyPlayerDamage(amount, reason = 'CONTAINMENT FAILURE') {
  playerShield = Math.max(0, playerShield - amount);
  if (hud) {
    hud.setShield(playerShield);
    hud.triggerDamageFlash();
    hud.showContainmentWarning(`[CONTAINMENT BREACH: -${amount}% SHIELD] ${reason}`);
  }
  playAlarmSound();
  showFloatingCombatText(`[-${amount}% SHIELD] ${reason}`, '#ff3b77');

  // Lockdown penalty: halt player movement temporarily
  lockdownTimer = 3.5;
  if (controller) controller.setPaused(true);

  if (playerShield <= 0) {
    // Critical failure: teleport player back to central hub cradle and reboot
    if (hud) hud.showContainmentWarning('[SYSTEM FAILURE] SHIELD DEPLETED - TELEPORTING TO HUB');
    setTimeout(() => {
      controller.position.set(0, 1.6, 0);
      playerShield = 100;
      playerEnergy = 100;
      if (hud) {
        hud.setShield(100);
        hud.setEnergy(100);
        hud.showContainmentWarning('[SYSTEM REBOOT COMPLETE] SHIELDS RESTORED');
      }
    }, 1200);
  }
}

// Damage event from incorrect quiz answers
on('player:damage', ({ amount = 25, reason = 'INCORRECT ANSWER' }) => {
  applyPlayerDamage(amount, reason);
});

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

// Keyboard shortcuts: P for Adventure Log / Progress, Space or F for Blaster Fire
window.addEventListener('keydown', (e) => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

  if ((e.key === 'p' || e.key === 'P' || e.code === 'KeyP') && !e.ctrlKey && !e.metaKey && !e.altKey) {
    if (progressModal.isOpen()) {
      progressModal.close();
    } else {
      onModalOpen();
      progressModal.open('learner');
    }
  } else if ((e.code === 'Space' || e.code === 'KeyF') && started && !isAnyModalOpen()) {
    e.preventDefault();
    fireBlaster();
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

// -------------------------------------------------------------
// BLASTER COMBAT & PROJECTILE SYSTEM
// -------------------------------------------------------------
const projectiles = [];
const particles = [];

// Reusable geometry for projectiles & sparks
const projGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8);
projGeo.rotateX(Math.PI / 2);
const projMat = new THREE.MeshBasicMaterial({
  color: 0x00f5d4,
});

const sparkGeo = new THREE.DodecahedronGeometry(0.09, 0);

function spawnSparks(x, y, z, color = 0x00f5d4, count = 16) {
  const sparkMat = new THREE.MeshBasicMaterial({ color });
  for (let i = 0; i < count; i++) {
    const mesh = new THREE.Mesh(sparkGeo, sparkMat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    const speed = 4 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    particles.push({
      mesh,
      vx: Math.sin(phi) * Math.cos(theta) * speed,
      vy: Math.abs(Math.cos(phi)) * speed + 2.5,
      vz: Math.sin(phi) * Math.sin(theta) * speed,
      life: 0.45 + Math.random() * 0.25,
      maxLife: 0.7,
    });
  }
}

function showFloatingCombatText(text, color = '#ff3b77') {
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = [
    'position:fixed',
    'left:50%',
    'top:45%',
    'transform:translate(-50%, -50%)',
    'font:900 20px "Fredoka", "Baloo 2", sans-serif',
    'color:' + color,
    'text-shadow:0 0 12px rgba(255,255,255,0.85), 0 2px 6px #000',
    'pointer-events:none',
    'z-index:120',
    'animation:combatFloat 0.9s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
  ].join(';');
  ui.appendChild(el);
  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 900);
}

function fireBlaster() {
  if (!started || isAnyModalOpen()) return;
  if (lockdownTimer > 0) {
    if (hud) hud.showContainmentWarning('[SYSTEM LOCKED] WAIT FOR CONTAINMENT CYCLE');
    playAlarmSound();
    return;
  }
  if (controller.isPaused()) return;

  if (playerEnergy < 12) {
    playOverheatSound();
    showFloatingCombatText('[CAPACITOR OVERHEATED - COOLING]', '#ff3b77');
    if (hud) hud.showContainmentWarning('[ENERGY DEPLETED] CAPACITOR VENTING');
    return;
  }

  playerEnergy = Math.max(0, playerEnergy - 12);
  if (hud) hud.setEnergy(playerEnergy);

  playLaserShotSound();
  punchTime = 1.0;
  if (viewmodel && viewmodel.knuckleCrystal) {
    viewmodel.knuckleCrystal.scale.setScalar(2.2);
  }

  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);

  const startPos = new THREE.Vector3();
  camera.getWorldPosition(startPos);
  startPos.addScaledVector(dir, 0.6);

  const mesh = new THREE.Mesh(projGeo, projMat);
  mesh.position.copy(startPos);
  mesh.quaternion.copy(camera.quaternion);
  scene.add(mesh);

  projectiles.push({
    mesh,
    pos: mesh.position,
    dir: dir.clone().normalize(),
    speed: 70,
    distance: 0,
    maxDistance: 95,
  });
}

function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    const travel = p.speed * dt;
    p.pos.addScaledVector(p.dir, travel);
    p.distance += travel;

    let hit = false;

    // 0. Physics & Chemistry STEM Apparatus Targets
    if (world.labNodes) {
      for (const node of world.labNodes) {
        if (!node.active) continue;
        const d = p.pos.distanceTo(node.mesh.position);
        if (d <= (node.hitRadius || 1.8)) {
          hit = true;
          if (node.isCorrect) {
            node.active = false;
            node.mesh.visible = false;
            spawnSparks(node.mesh.position.x, node.mesh.position.y, node.mesh.position.z, 0x00f5d4, 28);
            if (node.labId === 'prism') {
              playRefractionSound();
              if (world.labs && world.labs.prism) world.labs.prism.activate();
              world.disengageGate('gate-west');
              if (hud) hud.setMissionDirective("SNELL'S LAW CALIBRATED: WEST CONTAINMENT GATE DOWN");
              showFloatingCombatText("SNELL'S LAW CALIBRATED! +50 XP", '#00f5d4');
            } else if (node.labId === 'bohr') {
              playRefractionSound();
              if (world.labs && world.labs.bohr) world.labs.bohr.activate();
              showFloatingCombatText('QUANTUM LEAP (10.2 eV) ACTIVATED! +50 XP', '#00f5d4');
              if (hud) hud.setMissionDirective('LYMAN EMISSION VERIFIED: ORBIT STABILIZED');
            } else if (node.labId === 'titration') {
              playChemicalFizzSound();
              if (world.labs && world.labs.titration) world.labs.titration.activate();
              world.disengageGate('gate-east');
              showFloatingCombatText('TITRATION NEUTRALIZED (pH 7)! +50 XP', '#00f5d4');
              if (hud) hud.setMissionDirective('TITRATION NEUTRALIZED: EAST CONTAINMENT GATE DOWN');
            } else if (node.labId === 'momentum') {
              playTargetHitSound();
              if (world.labs && world.labs.momentum) world.labs.momentum.activate();
              showFloatingCombatText('ELASTIC IMPULSE SYNCHRONIZED! +50 XP', '#00f5d4');
              if (hud) hud.setMissionDirective('CONSERVATION OF MOMENTUM VERIFIED');
            }
            if (hud) {
              hud.addGold(50);
              hud.addQuizReward(2, 2);
              playerEnergy = Math.min(100, playerEnergy + 25);
              playerShield = Math.min(100, playerShield + 15);
              hud.setEnergy(playerEnergy);
              hud.setShield(playerShield);
            }
          } else {
            spawnSparks(node.mesh.position.x, node.mesh.position.y, node.mesh.position.z, 0xff0044, 24);
            applyPlayerDamage(25, node.desc || 'UNSTABLE STEM CALIBRATION');
          }
          break;
        }
      }
    }

    // 1. Target Drones
    if (!hit && world.targets) {
      for (const tgt of world.targets) {
        if (!tgt.active) continue;
        const d = p.pos.distanceTo(tgt.group.position);
        if (d <= tgt.hitRadius) {
          hit = true;
          tgt.active = false;
          tgt.group.visible = false;
          tgt.respawnTimer = 4.0;
          playTargetHitSound();
          spawnSparks(tgt.group.position.x, tgt.group.position.y, tgt.group.position.z, 0xff3b77, 24);
          if (hud) {
            hud.addGold(15);
            hud.addQuizReward(1, 1);
          }
          showFloatingCombatText('+25 XP [TARGET ELIMINATED]', '#00f5d4');
          break;
        }
      }
    }

    // 2. Star Coins (shoot from distance to collect)
    if (!hit && world.coins) {
      for (const c of world.coins) {
        if (c.collected) continue;
        const d = p.pos.distanceTo(c.mesh.position);
        if (d <= 1.5) {
          hit = true;
          c.collected = true;
          scene.remove(c.mesh);
          playCoinSound();
          spawnSparks(c.mesh.position.x, c.mesh.position.y, c.mesh.position.z, 0xffd166, 18);
          emit('coin:collect', { id: c.id, amount: 10 });
          showFloatingCombatText('+10 CREDITS [DATA COIN]', '#ffd166');
          break;
        }
      }
    }

    // 3. Shrines / Knowledge Stones
    if (!hit && world.stones) {
      for (const s of world.stones) {
        const d = p.pos.distanceTo(s.position);
        if (d <= 1.7) {
          hit = true;
          spawnSparks(s.position.x, s.position.y, s.position.z, 0xbb86fc, 20);
          showFloatingCombatText('[KNOWLEDGE SHRINE ONLINE]', '#ff758c');
          emit('stone:interact', { id: s.id, zone: s.zone, topic: s.topic });
          break;
        }
      }
    }

    // 4. Vice City Sports Cars
    if (!hit && world.cars) {
      for (const car of world.cars) {
        const d = p.pos.distanceTo(car.position);
        if (d <= 2.5) {
          hit = true;
          playCarHornSound();
          car.flareTimer = 1.4;
          spawnSparks(p.pos.x, p.pos.y, p.pos.z, 0x70e3db, 16);
          showFloatingCombatText('[VEHICLE ENGINE HORN]', '#70e3db');
          break;
        }
      }
    }

    // 5. Floor or Max Range
    if (!hit && (p.pos.y <= 0 || p.distance >= p.maxDistance)) {
      hit = true;
      spawnSparks(p.pos.x, Math.max(0.05, p.pos.y), p.pos.z, 0xffffff, 8);
    }

    if (hit) {
      scene.remove(p.mesh);
      projectiles.splice(i, 1);
    }
  }

  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i];
    pt.life -= dt;
    if (pt.life <= 0) {
      scene.remove(pt.mesh);
      particles.splice(i, 1);
      continue;
    }
    pt.vy -= 9.8 * dt;
    pt.mesh.position.x += pt.vx * dt;
    pt.mesh.position.y += pt.vy * dt;
    pt.mesh.position.z += pt.vz * dt;
    if (pt.mesh.position.y < 0.05) {
      pt.mesh.position.y = 0.05;
      pt.vy *= -0.35;
    }
    const scale = pt.life / pt.maxLife;
    pt.mesh.scale.set(scale, scale, scale);
  }
}

canvas.addEventListener('click', () => {
  if (!started) return;
  if (isAnyModalOpen()) return;
  if (!isTouch && document.pointerLockElement !== canvas) {
    requestLock();
  }
  resumeGame();
  fireBlaster();
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
  gameTime += dt;

  // Containment Lockdown timer
  if (lockdownTimer > 0) {
    lockdownTimer -= dt;
    controller.setPaused(true);
    if (lockdownTimer <= 0) {
      lockdownTimer = 0;
      if (!isAnyModalOpen()) {
        controller.setPaused(false);
      }
      if (hud) hud.showContainmentWarning('');
    }
  }

  // Energy capacitor recharge
  if (playerEnergy < 100) {
    playerEnergy = Math.min(100, playerEnergy + 24 * dt);
    if (hud) hud.setEnergy(playerEnergy);
  }

  controller.update(dt);
  world.update(dt, controller.position);
  updateProjectiles(dt);

  const nearestStone = findNearestStone();
  if (hud) {
    hud.setPrompt(nearestStone);
    hud.updateRadar();
    const p = controller.position;
    hud.setCoordinates(`4D: X=${p.x.toFixed(1)} Y=${p.y.toFixed(1)} Z=${p.z.toFixed(1)} T=${gameTime.toFixed(1)}s`);
  }

  // Dynamic Reticle Lock-On Detection
  let lockedObj = null;
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);

  // STEM Apparatus Interactive Nodes
  if (world.labNodes) {
    for (const node of world.labNodes) {
      if (!node.active) continue;
      const dist = camera.position.distanceTo(node.mesh.position);
      if (dist > 50) continue;
      const toN = node.mesh.position.clone().sub(camera.position).normalize();
      if (toN.dot(forward) > 0.982) {
        lockedObj = {
          name: `[STEM TARGET] ${node.desc}`,
          color: node.isCorrect ? '#00f5d4' : '#ff758c',
        };
        break;
      }
    }
  }

  if (!lockedObj && world.targets) {
    for (const tgt of world.targets) {
      if (!tgt.active) continue;
      const dist = camera.position.distanceTo(tgt.group.position);
      if (dist > 60) continue;
      const toTgt = tgt.group.position.clone().sub(camera.position).normalize();
      if (toTgt.dot(forward) > 0.985) {
        lockedObj = { name: '[TARGET DRONE]', color: '#ff3b77' };
        break;
      }
    }
  }
  if (!lockedObj && world.stones) {
    for (const s of world.stones) {
      const dist = camera.position.distanceTo(s.position);
      if (dist > 40) continue;
      const toS = s.position.clone().sub(camera.position).normalize();
      if (toS.dot(forward) > 0.985) {
        lockedObj = { name: '[KNOWLEDGE SHRINE]', color: '#00f5d4' };
        break;
      }
    }
  }
  if (!lockedObj && world.cars) {
    for (const car of world.cars) {
      const dist = camera.position.distanceTo(car.position);
      if (dist > 40) continue;
      const toC = car.position.clone().sub(camera.position).normalize();
      if (toC.dot(forward) > 0.975) {
        lockedObj = { name: '[CYBER VEHICLE]', color: '#ffd166' };
        break;
      }
    }
  }
  if (!lockedObj && world.coins) {
    for (const c of world.coins) {
      if (c.collected) continue;
      const dist = camera.position.distanceTo(c.mesh.position);
      if (dist > 40) continue;
      const toC = c.mesh.position.clone().sub(camera.position).normalize();
      if (toC.dot(forward) > 0.988) {
        lockedObj = { name: '[DATA CREDIT]', color: '#ffd166' };
        break;
      }
    }
  }

  if (lockedObj) {
    reticleDot.style.transform = 'scale(1.7)';
    reticleDot.style.borderColor = lockedObj.color;
    reticleDot.style.background = lockedObj.color;
    reticleLabel.style.display = 'block';
    reticleLabel.textContent = lockedObj.name;
    reticleLabel.style.borderColor = lockedObj.color;
    reticleLabel.style.color = lockedObj.color;
  } else {
    reticleDot.style.transform = 'scale(1.0)';
    reticleDot.style.borderColor = '#00f5d4';
    reticleDot.style.background = 'rgba(255, 59, 119, 0.9)';
    reticleLabel.style.display = 'none';
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
