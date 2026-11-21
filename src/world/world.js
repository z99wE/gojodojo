import * as THREE from 'three';
import { ZONES } from './zones.js';
import {
  makeTree,
  makeCrystal,
  makeLamp,
  makeBridgeSegment,
  makeRock,
  makeIslandBase,
} from './props.js';

const STONE_Y = 1.4;
const MATHS_CENTRE = { x: -38, z: -6 };
const SCIENCE_CENTRE = { x: 38, z: -6 };
const BRIDGE_Z = -3;
const BRIDGE_HALF_WIDTH = 1.75;

// Canvas-drawn grid floor with digits 1 to 9, no image files.
function makeGridTexture(ground, line, ink) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = `#${ground.toString(16).padStart(6, '0')}`;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = `#${line.toString(16).padStart(6, '0')}`;
  ctx.lineWidth = 4;
  ctx.fillStyle = `#${ink.toString(16).padStart(6, '0')}`;
  ctx.font = 'bold 40px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cell = size / 4;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * cell;
      const y = row * cell;
      ctx.strokeRect(x + 2, y + 2, cell - 4, cell - 4);
      ctx.fillText(String((row * 4 + col) % 9 + 1), x + cell / 2, y + cell / 2);
    }
  }
  return new THREE.CanvasTexture(canvas);
}

// Two thin strips along the bridge edges, so the player cannot walk off the sides.
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
  const colour = (hex) => new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.9, flatShading: true });

  // Adds a glowing stone at world (x, z) and registers it.
  function addStone(id, zone, x, z, topic) {
    const glow = ZONES[zone].palette.glow;
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), colour(glow));
    mesh.position.set(x, STONE_Y, z);
    scene.add(mesh);
    stones.push({ id, zone, position: mesh.position, topic });
    bobbers.push({ mesh, phase: stones.length * 1.3 });
  }

  // Hub island
  const hub = new THREE.Group();
  hub.add(makeIslandBase(14, 2, ZONES.hub.palette.ground));
  for (const [x, z, seed] of [[-9, 7, 1], [10, -8, 2], [-11, -6, 3]]) {
    const rock = makeRock(seed);
    rock.position.set(x, 0, z);
    hub.add(rock);
  }
  scene.add(hub);
  addStone('hub-1', 'hub', 2.5, 2.5, 'board');

  // Golden path tiles across the hub, leading to the two bridges.
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xf0c75e, flatShading: true });
  const pathGeo = new THREE.BoxGeometry(1.4, 0.06, 2.2);
  for (let x = -12; x <= 12; x += 2) {
    const tile = new THREE.Mesh(pathGeo, pathMat);
    tile.position.set(x, 0.03, BRIDGE_Z);
    scene.add(tile);
  }

  // Maths island
  const maths = new THREE.Group();
  maths.position.set(MATHS_CENTRE.x, 0, MATHS_CENTRE.z);
  maths.add(makeIslandBase(13, 2, ZONES.maths.palette.ground));
  const gridTex = makeGridTexture(ZONES.maths.palette.ground, ZONES.maths.palette.accent, ZONES.maths.palette.glow);
  gridTex.repeat.set(2, 2);
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(12, 32),
    new THREE.MeshStandardMaterial({ map: gridTex, flatShading: true }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.03;
  maths.add(floor);
  scene.add(maths);

  const mathsCrystals = [
    { x: -7, z: -6, color: ZONES.maths.palette.accent },
    { x: 7, z: -6, color: ZONES.maths.palette.glow },
    { x: -7, z: 6, color: ZONES.maths.palette.glow },
    { x: 7, z: 6, color: ZONES.maths.palette.accent },
  ];
  for (const c of mathsCrystals) {
    const crystal = makeCrystal(c.color);
    const wx = MATHS_CENTRE.x + c.x;
    const wz = MATHS_CENTRE.z + c.z;
    crystal.position.set(wx, 0, wz);
    scene.add(crystal);
    colliders.push({ type: 'circle', x: wx, z: wz, r: 0.6 });
  }
  const mathsStones = [
    ['maths-1', 'ratio', -3, 0],
    ['maths-2', 'algebra', 3, 0],
    ['maths-3', 'mensuration', 0, -3],
    ['maths-4', 'linear-equations', 0, 3],
  ];
  for (const [id, topic, x, z] of mathsStones) {
    addStone(id, 'maths', MATHS_CENTRE.x + x, MATHS_CENTRE.z + z, topic);
  }

  // Science island
  const science = new THREE.Group();
  science.position.set(SCIENCE_CENTRE.x, 0, SCIENCE_CENTRE.z);
  science.add(makeIslandBase(13, 2, ZONES.science.palette.ground));
  scene.add(science);

  // Trees: one InstancedMesh each for trunk and canopy, reusing makeTree geometry.
  const treeSpots = [];
  for (let i = 0; i < 14; i++) {
    const angle = i * 2.4;
    const r = 6 + (i % 3) * 2;
    treeSpots.push({ x: SCIENCE_CENTRE.x + Math.cos(angle) * r, z: SCIENCE_CENTRE.z + Math.sin(angle) * r });
  }
  const treeProto = makeTree();
  const [trunkPart, canopyPart] = treeProto.children;
  trunkPart.updateMatrix();
  canopyPart.updateMatrix();
  const trunks = new THREE.InstancedMesh(trunkPart.geometry, trunkPart.material, treeSpots.length);
  const canopies = new THREE.InstancedMesh(canopyPart.geometry, canopyPart.material, treeSpots.length);
  const base = new THREE.Matrix4();
  const m = new THREE.Matrix4();
  treeSpots.forEach((t, i) => {
    const s = 0.8 + ((i * 37) % 10) / 25;
    base.makeTranslation(t.x, 0, t.z).scale(new THREE.Vector3(s, s, s));
    trunks.setMatrixAt(i, m.multiplyMatrices(base, trunkPart.matrix));
    canopies.setMatrixAt(i, m.multiplyMatrices(base, canopyPart.matrix));
    colliders.push({ type: 'circle', x: t.x, z: t.z, r: 0.6 });
  });
  scene.add(trunks, canopies);

  // Amber lamps at the four diagonals, cloned from makeLamp.
  for (const [x, z] of [[4, 4], [-4, 4], [4, -4], [-4, -4]]) {
    const lamp = makeLamp();
    const wx = SCIENCE_CENTRE.x + x;
    const wz = SCIENCE_CENTRE.z + z;
    lamp.position.set(wx, 0, wz);
    scene.add(lamp);
    colliders.push({ type: 'circle', x: wx, z: wz, r: 0.6 });
  }

  // Small glowing spheres
  const orbGeo = new THREE.SphereGeometry(0.3, 8, 6);
  const orbMat = colour(ZONES.science.palette.glow);
  for (const [x, z] of [[-6, 0], [0, 6], [6, 0]]) {
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(SCIENCE_CENTRE.x + x, 1, SCIENCE_CENTRE.z + z);
    scene.add(orb);
  }

  const scienceStones = [
    ['science-1', 'force-pressure', -3, 0],
    ['science-2', 'acids-bases', 3, 0],
    ['science-3', 'light', 0, -3],
    ['science-4', 'cell-structure', 0, 3],
  ];
  for (const [id, topic, x, z] of scienceStones) {
    addStone(id, 'science', SCIENCE_CENTRE.x + x, SCIENCE_CENTRE.z + z, topic);
  }

  // Bridges from the hub edge (x = 14) out to each island edge.
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

  // Dust motes over the islands
  const count = 300;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = Math.random() * 104 - 52;
    positions[i * 3 + 1] = 0.5 + Math.random() * 5;
    positions[i * 3 + 2] = Math.random() * 34 - 20;
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const motes = new THREE.Points(
    moteGeo,
    new THREE.PointsMaterial({ color: 0xfff4d6, size: 0.12, transparent: true, opacity: 0.6, depthWrite: false }),
  );
  scene.add(motes);

  let elapsed = 0;

  return {
    stones,
    colliders,
    // Islands are flat, so the ground is always at height 0.
    groundHeight(x, z) {
      return 0;
    },
    update(dt, playerPos) {
      elapsed += dt;
      for (const { mesh, phase } of bobbers) {
        mesh.position.y = STONE_Y + Math.sin(elapsed * 2 + phase) * 0.15;
        mesh.rotation.y += dt * 0.8;
      }
      motes.rotation.y = elapsed * 0.02;
    },
  };
}
