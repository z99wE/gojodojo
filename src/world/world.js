import * as THREE from 'three';
import { ZONES } from './zones.js';
import {
  makeTree,
  makeSakuraTree,
  makeCrystal,
  makeLamp,
  makeBridgeSegment,
  makeRock,
  makeIslandBase,
  makeBeaconPillar,
  makeCollectibleCoin,
  makeToriiArch,
} from './props.js';
import { emit } from '../engine/events.js';

const STONE_Y = 1.4;
const MATHS_CENTRE = { x: -38, z: -6 };
const SCIENCE_CENTRE = { x: 38, z: -6 };
const BRIDGE_Z = -3;
const BRIDGE_HALF_WIDTH = 1.75;
const COIN_PICKUP_RANGE = 1.35;

// Pastel Grid Floor Texture
function makePastelGridTexture(groundHex, lineHex, inkHex) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = `#${groundHex.toString(16).padStart(6, '0')}`;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = `#${lineHex.toString(16).padStart(6, '0')}`;
  ctx.lineWidth = 3;
  ctx.fillStyle = `#${inkHex.toString(16).padStart(6, '0')}`;
  ctx.font = 'bold 36px "Fredoka", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const cell = size / 4;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * cell;
      const y = row * cell;
      ctx.strokeRect(x + 2, y + 2, cell - 4, cell - 4);
      const digit = (row * 4 + col) % 9 + 1;
      ctx.fillText(String(digit), x + cell / 2, y + cell / 2);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function bridgeColliders(x0, x1) {
  return [
    { type: 'box', minX: x0, maxX: x1, minZ: BRIDGE_Z - BRIDGE_HALF_WIDTH, maxZ: BRIDGE_Z - BRIDGE_HALF_WIDTH + 0.25 },
    { type: 'box', minX: x0, maxX: x1, minZ: BRIDGE_Z + BRIDGE_HALF_WIDTH - 0.25, maxZ: BRIDGE_Z + BRIDGE_HALF_WIDTH },
  ];
}

export function createWorld(scene) {
  const stones = [];
  const colliders = [];
  const bobbers = [];
  const beacons = [];
  const coins = [];

  const colour = (hex) =>
    new THREE.MeshStandardMaterial({
      color: hex,
      emissive: hex,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      flatShading: true,
    });

  // Register a glowing challenge stone with vertical GTA-style waypoint beacon
  function addStone(id, zone, x, z, topic) {
    const glowHex = ZONES[zone].palette.glow;
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.52, 0), colour(glowHex));
    mesh.position.set(x, STONE_Y, z);
    scene.add(mesh);
    bobbers.push({ mesh, phase: stones.length * 0.7 });

    // Waypoint light beam
    const beacon = makeBeaconPillar(glowHex);
    beacon.group.position.set(x, 0, z);
    scene.add(beacon.group);
    beacons.push(beacon);

    stones.push({ id, zone, position: mesh.position, topic });
  }

  // -------------------------------------------------------------
  // 1. CENTRAL HUB ISLAND (Vanilla Cream & Sakura Haven)
  // -------------------------------------------------------------
  const hubRadius = 14;
  const hubThickness = 3.5;
  const hubBase = makeIslandBase(hubRadius, hubThickness, ZONES.hub.palette.ground);
  scene.add(hubBase);
  colliders.push({ type: 'circle', x: 0, z: 0, r: hubRadius * 0.95 });

  const hubTex = makePastelGridTexture(0xfff5f7, 0xf7d6e0, 0xb892ff);
  hubTex.repeat.set(4, 4);
  const hubFloor = new THREE.Mesh(
    new THREE.CircleGeometry(hubRadius * 0.94, 32),
    new THREE.MeshStandardMaterial({ map: hubTex, roughness: 0.6 })
  );
  hubFloor.rotation.x = -Math.PI / 2;
  hubFloor.position.y = 0.02;
  scene.add(hubFloor);

  // Sakura Trees around Hub rim
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2 + 0.3;
    const dist = 11.2;
    const wx = Math.cos(angle) * dist;
    const wz = Math.sin(angle) * dist;
    // Keep bridges clear (near z = -3)
    if (Math.abs(wz - BRIDGE_Z) > 3.0) {
      const tree = makeSakuraTree();
      tree.position.set(wx, 0, wz);
      scene.add(tree);
      colliders.push({ type: 'circle', x: wx, z: wz, r: 0.8 });
    }
  }

  // Soft decorative rocks & lamps on Hub
  for (let i = 0; i < 6; i++) {
    const seed = i * 13.7 + 1.2;
    const a = (i / 6) * Math.PI * 2 + 0.8;
    const r = 7.5;
    const wx = Math.cos(a) * r;
    const wz = Math.sin(a) * r;
    const rock = makeRock(seed);
    rock.position.set(wx, 0, wz);
    scene.add(rock);

    if (i % 2 === 0) {
      const lamp = makeLamp();
      lamp.position.set(wx * 1.2, 0, wz * 1.2);
      scene.add(lamp);
      colliders.push({ type: 'circle', x: wx * 1.2, z: wz * 1.2, r: 0.5 });
    }
  }

  // Central Hub Board Stone (गुरु पटल)
  addStone('hub-1', 'hub', 0, 2.5, 'board');

  // Golden path tiles leading to bridges
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xffd1dc, roughness: 0.5, flatShading: true });
  const pathGeo = new THREE.BoxGeometry(1.6, 0.05, 2.4);
  for (let x = -13; x <= 13; x += 2.2) {
    const tile = new THREE.Mesh(pathGeo, pathMat);
    tile.position.set(x, 0.03, BRIDGE_Z);
    scene.add(tile);
  }

  // -------------------------------------------------------------
  // 2. GANIT DWEEP / MATHS ISLE (Taro Lilac & Cyan Crystals)
  // -------------------------------------------------------------
  const mathsGroup = new THREE.Group();
  mathsGroup.position.set(MATHS_CENTRE.x, 0, MATHS_CENTRE.z);
  const mathsBase = makeIslandBase(hubRadius, hubThickness, ZONES.maths.palette.ground);
  mathsGroup.add(mathsBase);
  colliders.push({ type: 'circle', x: MATHS_CENTRE.x, z: MATHS_CENTRE.z, r: hubRadius * 0.95 });

  const mathsTex = makePastelGridTexture(0xf3e8ff, 0xd8b4f8, 0x5e35b1);
  mathsTex.repeat.set(4, 4);
  const mathsFloor = new THREE.Mesh(
    new THREE.CircleGeometry(hubRadius * 0.94, 32),
    new THREE.MeshStandardMaterial({ map: mathsTex, roughness: 0.6 })
  );
  mathsFloor.rotation.x = -Math.PI / 2;
  mathsFloor.position.y = 0.02;
  mathsGroup.add(mathsFloor);
  scene.add(mathsGroup);

  // Welcoming Gateway Arch to Ganit Dweep
  const mathsArch = makeToriiArch(0xb39ddb);
  mathsArch.position.set(-25, 0, BRIDGE_Z);
  mathsArch.rotation.y = Math.PI / 2;
  scene.add(mathsArch);

  // Giant glowing crystal monument on Maths Island
  const giantCrystal = makeCrystal(ZONES.maths.palette.glow);
  giantCrystal.scale.set(1.4, 1.4, 1.4);
  giantCrystal.position.set(MATHS_CENTRE.x, 0, MATHS_CENTRE.z);
  scene.add(giantCrystal);
  colliders.push({ type: 'circle', x: MATHS_CENTRE.x, z: MATHS_CENTRE.z, r: 1.2 });

  // Outer Sakura trees on Maths Isle
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const wx = MATHS_CENTRE.x + Math.cos(angle) * 11;
    const wz = MATHS_CENTRE.z + Math.sin(angle) * 11;
    if (Math.abs(wz - BRIDGE_Z) > 3.0) {
      const tree = makeSakuraTree();
      tree.position.set(wx, 0, wz);
      scene.add(tree);
      colliders.push({ type: 'circle', x: wx, z: wz, r: 0.8 });
    }
  }

  // Maths challenge stones (4 cardinal points)
  const mathsStones = [
    ['maths-1', 'ratio-percentage', -4.5, 0],
    ['maths-2', 'algebra', 4.5, 0],
    ['maths-3', 'mensuration', 0, -4.5],
    ['maths-4', 'linear-equations', 0, 4.5],
  ];
  for (const [id, topic, x, z] of mathsStones) {
    addStone(id, 'maths', MATHS_CENTRE.x + x, MATHS_CENTRE.z + z, topic);
  }

  // -------------------------------------------------------------
  // 3. VIGYAN VATIKA / SCIENCE GARDEN (Matcha & Amber Energy)
  // -------------------------------------------------------------
  const scienceGroup = new THREE.Group();
  scienceGroup.position.set(SCIENCE_CENTRE.x, 0, SCIENCE_CENTRE.z);
  const scienceBase = makeIslandBase(hubRadius, hubThickness, ZONES.science.palette.ground);
  scienceGroup.add(scienceBase);
  colliders.push({ type: 'circle', x: SCIENCE_CENTRE.x, z: SCIENCE_CENTRE.z, r: hubRadius * 0.95 });

  const scienceTex = makePastelGridTexture(0xe8f5e9, 0xa5d6a7, 0x2e7d32);
  scienceTex.repeat.set(4, 4);
  const scienceFloor = new THREE.Mesh(
    new THREE.CircleGeometry(hubRadius * 0.94, 32),
    new THREE.MeshStandardMaterial({ map: scienceTex, roughness: 0.6 })
  );
  scienceFloor.rotation.x = -Math.PI / 2;
  scienceFloor.position.y = 0.02;
  scienceGroup.add(scienceFloor);
  scene.add(scienceGroup);

  // Welcoming Gateway Arch to Vigyan Vatika
  const scienceArch = makeToriiArch(0xa5d6a7);
  scienceArch.position.set(25, 0, BRIDGE_Z);
  scienceArch.rotation.y = -Math.PI / 2;
  scene.add(scienceArch);

  // Central glowing Energy Tree / Garden centerpiece
  const scienceCenterTree = makeTree();
  scienceCenterTree.scale.set(1.5, 1.5, 1.5);
  scienceCenterTree.position.set(SCIENCE_CENTRE.x, 0, SCIENCE_CENTRE.z);
  scene.add(scienceCenterTree);
  colliders.push({ type: 'circle', x: SCIENCE_CENTRE.x, z: SCIENCE_CENTRE.z, r: 1.2 });

  // Floating glowing energy orbs around Science garden
  const orbGeo = new THREE.SphereGeometry(0.35, 12, 10);
  const orbMat = colour(ZONES.science.palette.glow);
  for (const [ox, oz] of [[-6, -2], [6, -2], [-3, 6], [3, 6]]) {
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(SCIENCE_CENTRE.x + ox, 1.6, SCIENCE_CENTRE.z + oz);
    scene.add(orb);
    bobbers.push({ mesh: orb, phase: ox + oz });
  }

  // Science challenge stones (4 cardinal points)
  const scienceStones = [
    ['science-1', 'force-pressure', -4.5, 0],
    ['science-2', 'acids-bases', 4.5, 0],
    ['science-3', 'light', 0, -4.5],
    ['science-4', 'cell-structure', 0, 4.5],
  ];
  for (const [id, topic, x, z] of scienceStones) {
    addStone(id, 'science', SCIENCE_CENTRE.x + x, SCIENCE_CENTRE.z + z, topic);
  }

  // -------------------------------------------------------------
  // 4. BRIDGES CONNECTING THE ISLANDS
  // -------------------------------------------------------------
  const bridges = [
    { x0: -25, x1: -14 },
    { x0: 14, x1: 25 },
  ];
  for (const { x0, x1 } of bridges) {
    const length = x1 - x0;
    const deck = makeBridgeSegment(length);
    deck.position.set((x0 + x1) / 2, 0, BRIDGE_Z);
    scene.add(deck);
    colliders.push(...bridgeColliders(x0, x1));
  }

  // -------------------------------------------------------------
  // 5. 3D COLLECTIBLE STAR COINS (Vice City / RPG reward tokens)
  // -------------------------------------------------------------
  const coinLocations = [
    // Hub plaza coins
    { x: 0, z: -1 },
    { x: -5, z: 2 },
    { x: 5, z: 2 },
    { x: 0, z: 6 },
    { x: -6, z: -5 },
    { x: 6, z: -5 },
    // West Bridge to Maths
    { x: -16, z: BRIDGE_Z },
    { x: -20, z: BRIDGE_Z },
    { x: -24, z: BRIDGE_Z },
    // Maths Isle plaza
    { x: MATHS_CENTRE.x - 3, z: MATHS_CENTRE.z - 3 },
    { x: MATHS_CENTRE.x + 3, z: MATHS_CENTRE.z - 3 },
    { x: MATHS_CENTRE.x - 3, z: MATHS_CENTRE.z + 3 },
    { x: MATHS_CENTRE.x + 3, z: MATHS_CENTRE.z + 3 },
    // East Bridge to Science
    { x: 16, z: BRIDGE_Z },
    { x: 20, z: BRIDGE_Z },
    { x: 24, z: BRIDGE_Z },
    // Science Isle plaza
    { x: SCIENCE_CENTRE.x - 3, z: SCIENCE_CENTRE.z - 3 },
    { x: SCIENCE_CENTRE.x + 3, z: SCIENCE_CENTRE.z + 3 },
  ];

  coinLocations.forEach((loc, idx) => {
    const coinMesh = makeCollectibleCoin();
    coinMesh.position.set(loc.x, 1.1, loc.z);
    scene.add(coinMesh);
    coins.push({
      id: `coin-${idx}`,
      mesh: coinMesh,
      x: loc.x,
      z: loc.z,
      collected: false,
      phase: idx * 0.4,
    });
  });

  // Pastel floating magical fairy motes (sparkles)
  const moteCount = 200;
  const motePos = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i++) {
    motePos[i * 3] = (Math.random() - 0.5) * 110;
    motePos[i * 3 + 1] = 0.5 + Math.random() * 6;
    motePos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 3;
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(
    moteGeo,
    new THREE.PointsMaterial({
      color: 0xffe5ec,
      size: 0.16,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    })
  );
  scene.add(motes);

  let elapsed = 0;

  return {
    stones,
    colliders,
    coins,
    groundHeight() {
      return 0;
    },
    update(dt, playerPos) {
      elapsed += dt;

      // Bobbing challenge stones
      for (const { mesh, phase } of bobbers) {
        mesh.position.y = STONE_Y + Math.sin(elapsed * 2.2 + phase) * 0.16;
        mesh.rotation.y += dt * 0.9;
      }

      // Animating waypoint light beams
      for (const b of beacons) {
        b.beam.rotation.y += dt * 0.3;
        const ringScale = 1.0 + Math.sin(elapsed * 2.5) * 0.12;
        b.ring.scale.set(ringScale, ringScale, 1.0);
      }

      // Animating & checking collectible star coins
      for (const c of coins) {
        if (!c.collected) {
          c.mesh.rotation.y += dt * 3.5;
          c.mesh.position.y = 1.1 + Math.sin(elapsed * 3.0 + c.phase) * 0.15;

          // Check proximity to player
          if (playerPos) {
            const dx = playerPos.x - c.x;
            const dz = playerPos.z - c.z;
            const dist = Math.hypot(dx, dz);
            if (dist <= COIN_PICKUP_RANGE) {
              c.collected = true;
              scene.remove(c.mesh);
              emit('coin:collect', { id: c.id, amount: 10 });
            }
          }
        }
      }

      motes.rotation.y = elapsed * 0.015;
    },
  };
}
