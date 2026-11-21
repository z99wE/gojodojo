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
  makeViceCityCar,
  makeKoreanStoreBuilding,
  makeVendingMachine,
  makePalmTree,
  makeHoloAtom,
  makeHoloMathSymbols,
  makeFloatingClouds,
  makeWaterPlane,
  makeViceCitySky,
  makeViceCitySun,
  makeDistantSkyline,
  makeAsphaltBoulevard,
  makeTargetDrone,
  makeArtDecoHotel,
  makeLifeguardTower,
  makeTrafficLightGantry,
  makeViceCityStreetLamp,
  makeViceCitySpeedboat,
  makeBeachLoungers,
} from './props.js';
import {
  makePrismLab,
  makeBohrAtomLab,
  makeTitrationLab,
  makeMomentumLab,
  makeLorentzElectromagnetLab,
  makeMolecularLatticeLab,
  makeGalvanicCellLab,
  makeDnaHelixLab,
  makePlantCellLab,
  makeSectorForcefield,
} from './physics-labs.js';
import { emit } from '../engine/events.js';

const STONE_Y = 1.4;
const MATHS_CENTRE = { x: -38, z: -6 };
const SCIENCE_CENTRE = { x: 38, z: -6 };
const BRIDGE_Z = -3;
const BRIDGE_HALF_WIDTH = 1.75;
const COIN_PICKUP_RANGE = 1.4;

function makeStylizedPlazaTexture(baseHex, lineHex, accentHex) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = `#${baseHex.toString(16).padStart(6, '0')}`;
  ctx.fillRect(0, 0, size, size);

  // Elegant diamond / plaza pavers
  ctx.strokeStyle = `#${lineHex.toString(16).padStart(6, '0')}`;
  ctx.lineWidth = 4;
  const step = size / 8;
  for (let x = 0; x <= size; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y <= size; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Neon diamond accents at intersections
  ctx.fillStyle = `#${accentHex.toString(16).padStart(6, '0')}`;
  for (let x = 0; x <= size; x += step) {
    for (let y = 0; y <= size; y += step) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
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
  const clouds = [];
  const targets = [];
  const cars = [];
  const labs = [];
  const forcefields = [];
  const labNodes = [];

  const colour = (hex) =>
    new THREE.MeshStandardMaterial({
      color: hex,
      emissive: hex,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      flatShading: true,
    });

  // -------------------------------------------------------------
  // 0. VICE CITY 80s RETRO SKY, SLICED SUN, OCEAN & SKYLINE
  // -------------------------------------------------------------
  const sky = makeViceCitySky();
  scene.add(sky);

  const sunMesh = makeViceCitySun();
  scene.add(sunMesh);

  const skyline = makeDistantSkyline();
  scene.add(skyline);

  const water = makeWaterPlane();
  scene.add(water.mesh);

  // 6 Floating Puffy Clouds
  for (let i = 0; i < 6; i++) {
    const cloud = makeFloatingClouds();
    const cx = (i - 3) * 36 + Math.random() * 10;
    const cy = 20 + Math.random() * 8;
    const cz = -25 + (i % 3) * 20;
    cloud.position.set(cx, cy, cz);
    scene.add(cloud);
    clouds.push({ mesh: cloud, speed: 0.8 + Math.random() * 0.4 });
  }

  function addStone(id, zone, x, z, topic) {
    const glowHex = ZONES[zone].palette.glow;
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), colour(glowHex));
    mesh.position.set(x, STONE_Y, z);
    mesh.userData = { isStone: true, id, zone, topic };
    scene.add(mesh);
    bobbers.push({ mesh, phase: stones.length * 0.7 });

    const beacon = makeBeaconPillar(glowHex);
    beacon.group.position.set(x, 0, z);
    scene.add(beacon.group);
    beacons.push(beacon);

    stones.push({ id, zone, position: mesh.position, mesh, topic });
  }

  // -------------------------------------------------------------
  // 1. CENTRAL HUB ISLAND (Vice City Plaza & Korean Cyber Street)
  // -------------------------------------------------------------
  const hubRadius = 14;
  const hubThickness = 3.5;
  const hubBase = makeIslandBase(hubRadius, hubThickness, ZONES.hub.palette.ground);
  scene.add(hubBase);
  colliders.push({ type: 'circle', x: 0, z: 0, r: hubRadius * 0.95 });

  const hubTex = makeStylizedPlazaTexture(0xfff0f5, 0xffccd5, 0xff758c);
  hubTex.repeat.set(6, 6);
  const hubFloor = new THREE.Mesh(
    new THREE.CircleGeometry(hubRadius * 0.94, 32),
    new THREE.MeshStandardMaterial({ map: hubTex, roughness: 0.5 })
  );
  hubFloor.rotation.x = -Math.PI / 2;
  hubFloor.position.y = 0.02;
  scene.add(hubFloor);

  // -------------------------------------------------------------
  // 1. GRAND GTA VICE CITY OCEAN DRIVE & ART DECO HOTEL ROW
  // -------------------------------------------------------------
  // Ocean Drive continuous dual-lane asphalt highway spanning the district
  const oceanDrive = makeAsphaltBoulevard(96, 6.0);
  oceanDrive.position.set(0, 0, 6.0);
  scene.add(oceanDrive);

  // Traffic Light Overhead Gantries spanning Ocean Drive
  for (const gx of [-22, 22]) {
    const gantry = makeTrafficLightGantry(6.0);
    gantry.position.set(gx, 0, 6.0);
    scene.add(gantry);
  }

  // Cast Iron Street Lamps every 14 units along Ocean Drive
  for (const lx of [-42, -28, -14, 0, 14, 28, 42]) {
    const lamp = makeViceCityStreetLamp();
    lamp.position.set(lx, 0, 2.6);
    scene.add(lamp);
  }

  // Iconic Art Deco Hotel Row (North side of Ocean Drive)
  const hotel1 = makeArtDecoHotel('OCEAN VIEW HOTEL', 0xffedf2, 0xff3b77);
  hotel1.position.set(-16, 0, -14);
  scene.add(hotel1);
  colliders.push({ type: 'box', minX: -23, maxX: -9, minZ: -18, maxZ: -10 });

  const hotel2 = makeArtDecoHotel('THE MALIBU CLUB', 0xedf7ff, 0x00f5d4);
  hotel2.position.set(16, 0, -14);
  scene.add(hotel2);
  colliders.push({ type: 'box', minX: 9, maxX: 23, minZ: -18, maxZ: -10 });

  const hotel3 = makeArtDecoHotel('DEACON HOTEL', 0xfffae0, 0xffa502);
  hotel3.position.set(-34, 0, -14);
  scene.add(hotel3);
  colliders.push({ type: 'box', minX: -41, maxX: -27, minZ: -18, maxZ: -10 });

  const hotel4 = makeArtDecoHotel('HOTEL COLON', 0xf0fff4, 0x2ed573);
  hotel4.position.set(34, 0, -14);
  scene.add(hotel4);
  colliders.push({ type: 'box', minX: 27, maxX: 41, minZ: -18, maxZ: -10 });

  // Ocean Beach Promenade (Golden Sand & Turquoise Sea)
  const beachMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.95 });
  const beach = new THREE.Mesh(new THREE.PlaneGeometry(105, 18), beachMat);
  beach.rotation.x = -Math.PI / 2;
  beach.position.set(0, 0.01, 19);
  scene.add(beach);

  // Lifeguard Towers on Ocean Beach
  const tower1 = makeLifeguardTower(0x00f5d4, 0xff3b77);
  tower1.position.set(-20, 0, 18);
  scene.add(tower1);
  colliders.push({ type: 'circle', x: -20, z: 18, r: 1.5 });

  const tower2 = makeLifeguardTower(0xffd166, 0x7d5fff);
  tower2.position.set(0, 0, 18);
  scene.add(tower2);
  colliders.push({ type: 'circle', x: 0, z: 18, r: 1.5 });

  const tower3 = makeLifeguardTower(0xff3b77, 0x00f5d4);
  tower3.position.set(20, 0, 18);
  scene.add(tower3);
  colliders.push({ type: 'circle', x: 20, z: 18, r: 1.5 });

  // Beach Loungers & Umbrellas
  for (const bx of [-30, -10, 10, 30]) {
    const lounger = makeBeachLoungers(bx % 20 === 0 ? 0xff3b77 : 0x00f5d4);
    lounger.position.set(bx, 0, 15);
    scene.add(lounger);
  }

  // Offshore Speedboats anchored in the ocean
  const boat1 = makeViceCitySpeedboat(0xffffff, 0xff3b77);
  boat1.position.set(-15, 0, 30);
  scene.add(boat1);

  const boat2 = makeViceCitySpeedboat(0x00f5d4, 0xffd166);
  boat2.position.set(15, 0, 30);
  scene.add(boat2);

  // Active Cruising Vice City Sports Cars along Ocean Drive
  const carColors = [
    { name: 'Infernus (Hot Pink)', color: 0xff3b77, x: -18, z: 4.8, speed: 6.8, dir: 1 },
    { name: 'Cheetah (Ocean Teal)', color: 0x00f5d4, x: 18, z: 7.2, speed: -6.8, dir: -1 },
    { name: 'Banshee (Sunset Gold)', color: 0xffd166, x: -36, z: 4.8, speed: 6.0, dir: 1 },
    { name: 'Oceanic (Vice Violet)', color: 0x7d5fff, x: 36, z: 7.2, speed: -6.0, dir: -1 },
  ];

  carColors.forEach((cfg, idx) => {
    const carMesh = makeViceCityCar(cfg.color);
    carMesh.position.set(cfg.x, 0, cfg.z);
    if (cfg.dir === -1) carMesh.rotation.y = Math.PI;
    scene.add(carMesh);
    cars.push({
      id: `car-${idx}`,
      name: cfg.name,
      mesh: carMesh,
      underglow: carMesh.userData.underglow,
      position: carMesh.position,
      flareTimer: 0,
      isCruising: true,
      speed: cfg.speed,
      minX: -48,
      maxX: 48,
    });
  });

  // Korean Pastel Cyber Cafes & Buildings on Hub Edge
  const shop1 = makeKoreanStoreBuilding('수학 빵집 (Maths Cafe)', 0xffb7b2);
  shop1.position.set(-7, 0, -8);
  shop1.rotation.y = 0.3;
  scene.add(shop1);
  colliders.push({ type: 'box', minX: -9.5, maxX: -4.5, minZ: -10, maxZ: -6 });

  const shop2 = makeKoreanStoreBuilding('SANKHYA ARCADE', 0x7d5fff);
  shop2.position.set(7, 0, -8);
  shop2.rotation.y = -0.3;
  scene.add(shop2);
  colliders.push({ type: 'box', minX: 4.5, maxX: 9.5, minZ: -10, maxZ: -6 });

  // Vending Machines on Hub
  const vm1 = makeVendingMachine();
  vm1.position.set(-3.5, 0, -7.5);
  scene.add(vm1);

  const vm2 = makeVendingMachine();
  vm2.position.set(3.5, 0, -7.5);
  scene.add(vm2);

  // Tropical Palm Trees & Sakura Trees on Hub
  const palm1 = makePalmTree();
  palm1.position.set(-9.5, 0, 3);
  scene.add(palm1);

  const palm2 = makePalmTree();
  palm2.position.set(9.5, 0, 3);
  scene.add(palm2);

  // Sakura Trees along Hub
  for (const [tx, tz] of [[-10, -3], [10, -3], [0, 11]]) {
    const sTree = makeSakuraTree();
    sTree.position.set(tx, 0, tz);
    scene.add(sTree);
    colliders.push({ type: 'circle', x: tx, z: tz, r: 0.8 });
  }

  // Central Hub Board Stone (गुरु पटल)
  addStone('hub-1', 'hub', 0, 2.5, 'board');

  // Golden path tiles
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xffd1dc, roughness: 0.5, flatShading: true });
  const pathGeo = new THREE.BoxGeometry(1.6, 0.05, 2.4);
  for (let x = -13; x <= 13; x += 2.2) {
    const tile = new THREE.Mesh(pathGeo, pathMat);
    tile.position.set(x, 0.03, BRIDGE_Z);
    scene.add(tile);
  }

  // -------------------------------------------------------------
  // 2. GANIT DWEEP / MATHS ISLE (Holo Math Wonder & Lilac Crystals)
  // -------------------------------------------------------------
  const mathsGroup = new THREE.Group();
  mathsGroup.position.set(MATHS_CENTRE.x, 0, MATHS_CENTRE.z);
  const mathsBase = makeIslandBase(hubRadius, hubThickness, ZONES.maths.palette.ground);
  mathsGroup.add(mathsBase);
  colliders.push({ type: 'circle', x: MATHS_CENTRE.x, z: MATHS_CENTRE.z, r: hubRadius * 0.95 });

  const mathsTex = makeStylizedPlazaTexture(0xf5efff, 0xd8b4f8, 0x7d5fff);
  mathsTex.repeat.set(6, 6);
  const mathsFloor = new THREE.Mesh(
    new THREE.CircleGeometry(hubRadius * 0.94, 32),
    new THREE.MeshStandardMaterial({ map: mathsTex, roughness: 0.5 })
  );
  mathsFloor.rotation.x = -Math.PI / 2;
  mathsFloor.position.y = 0.02;
  mathsGroup.add(mathsFloor);
  scene.add(mathsGroup);

  // Giant 3D Holographic Math Symbols floating in the sky
  const holoMath = makeHoloMathSymbols();
  holoMath.group.position.set(MATHS_CENTRE.x, 0, MATHS_CENTRE.z);
  scene.add(holoMath.group);

  // Gateway Arch
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

  // Maths challenge stones
  const mathsStones = [
    ['maths-1', 'ratio-percentage', -4.8, 0],
    ['maths-2', 'algebra', 4.8, 0],
    ['maths-3', 'mensuration', 0, -4.8],
    ['maths-4', 'linear-equations', 0, 4.8],
  ];
  for (const [id, topic, x, z] of mathsStones) {
    addStone(id, 'maths', MATHS_CENTRE.x + x, MATHS_CENTRE.z + z, topic);
  }

  // -------------------------------------------------------------
  // 3. VIGYAN VATIKA / SCIENCE GARDEN (Holo Atom & Matcha Energy)
  // -------------------------------------------------------------
  const scienceGroup = new THREE.Group();
  scienceGroup.position.set(SCIENCE_CENTRE.x, 0, SCIENCE_CENTRE.z);
  const scienceBase = makeIslandBase(hubRadius, hubThickness, ZONES.science.palette.ground);
  scienceGroup.add(scienceBase);
  colliders.push({ type: 'circle', x: SCIENCE_CENTRE.x, z: SCIENCE_CENTRE.z, r: hubRadius * 0.95 });

  const scienceTex = makeStylizedPlazaTexture(0xeffaf4, 0xa7f3d0, 0x10b981);
  scienceTex.repeat.set(6, 6);
  const scienceFloor = new THREE.Mesh(
    new THREE.CircleGeometry(hubRadius * 0.94, 32),
    new THREE.MeshStandardMaterial({ map: scienceTex, roughness: 0.5 })
  );
  scienceFloor.rotation.x = -Math.PI / 2;
  scienceFloor.position.y = 0.02;
  scienceGroup.add(scienceFloor);
  scene.add(scienceGroup);

  // Giant 3D Holographic Atomic Model hovering in the sky
  const holoAtom = makeHoloAtom();
  holoAtom.group.position.set(SCIENCE_CENTRE.x, 0, SCIENCE_CENTRE.z);
  scene.add(holoAtom.group);

  // Gateway Arch
  const scienceArch = makeToriiArch(0xa5d6a7);
  scienceArch.position.set(25, 0, BRIDGE_Z);
  scienceArch.rotation.y = -Math.PI / 2;
  scene.add(scienceArch);

  // Science Center Tree
  const scienceCenterTree = makeTree();
  scienceCenterTree.scale.set(1.5, 1.5, 1.5);
  scienceCenterTree.position.set(SCIENCE_CENTRE.x, 0, SCIENCE_CENTRE.z);
  scene.add(scienceCenterTree);
  colliders.push({ type: 'circle', x: SCIENCE_CENTRE.x, z: SCIENCE_CENTRE.z, r: 1.2 });

  // Science challenge stones
  const scienceStones = [
    ['science-1', 'force-pressure', -4.8, 0],
    ['science-2', 'acids-bases', 4.8, 0],
    ['science-3', 'light', 0, -4.8],
    ['science-4', 'cell-structure', 0, 4.8],
  ];
  for (const [id, topic, x, z] of scienceStones) {
    addStone(id, 'science', SCIENCE_CENTRE.x + x, SCIENCE_CENTRE.z + z, topic);
  }

  // -------------------------------------------------------------
  // 4. BRIDGES
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
  // 5. 3D COLLECTIBLE STAR COINS
  // -------------------------------------------------------------
  const coinLocations = [
    { x: 0, z: -1 },
    { x: -5, z: 2 },
    { x: 5, z: 2 },
    { x: 0, z: 6 },
    { x: -6, z: -4 },
    { x: 6, z: -4 },
    { x: -16, z: BRIDGE_Z },
    { x: -20, z: BRIDGE_Z },
    { x: -24, z: BRIDGE_Z },
    { x: MATHS_CENTRE.x - 3, z: MATHS_CENTRE.z - 3 },
    { x: MATHS_CENTRE.x + 3, z: MATHS_CENTRE.z - 3 },
    { x: MATHS_CENTRE.x - 3, z: MATHS_CENTRE.z + 3 },
    { x: MATHS_CENTRE.x + 3, z: MATHS_CENTRE.z + 3 },
    { x: 16, z: BRIDGE_Z },
    { x: 20, z: BRIDGE_Z },
    { x: 24, z: BRIDGE_Z },
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

  // -------------------------------------------------------------
  // 6. FLOATING SHOOTABLE TARGET DRONES
  // -------------------------------------------------------------
  const droneLocations = [
    { id: 'tgt-hub-1', x: -5.5, y: 3.2, z: -1 },
    { id: 'tgt-hub-2', x: 5.5, y: 3.4, z: -1 },
    { id: 'tgt-hub-3', x: 0, y: 4.2, z: -7.5 },
    { id: 'tgt-hub-4', x: 0, y: 3.0, z: 9.5 },
    { id: 'tgt-math-1', x: MATHS_CENTRE.x - 5.5, y: 3.4, z: MATHS_CENTRE.z },
    { id: 'tgt-math-2', x: MATHS_CENTRE.x + 5.5, y: 3.6, z: MATHS_CENTRE.z },
    { id: 'tgt-math-3', x: MATHS_CENTRE.x, y: 4.5, z: MATHS_CENTRE.z + 5.5 },
    { id: 'tgt-sci-1', x: SCIENCE_CENTRE.x - 5.5, y: 3.4, z: SCIENCE_CENTRE.z },
    { id: 'tgt-sci-2', x: SCIENCE_CENTRE.x + 5.5, y: 3.6, z: SCIENCE_CENTRE.z },
    { id: 'tgt-sci-3', x: SCIENCE_CENTRE.x, y: 4.5, z: SCIENCE_CENTRE.z - 5.5 },
  ];

  droneLocations.forEach((loc) => {
    const drone = makeTargetDrone(loc.id, loc.x, loc.y, loc.z);
    scene.add(drone.group);
    targets.push(drone);
  });

  // -------------------------------------------------------------
  // REAL 3D INTERACTIVE STEM LABORATORIES: PHYSICS, CHEMISTRY & BIOLOGY
  // -------------------------------------------------------------
  // 1. Prism Refraction Lab (Physics - Snell's Law Optics)
  const prismLab = makePrismLab(MATHS_CENTRE.x, 0, MATHS_CENTRE.z - 7.0);
  scene.add(prismLab.group);
  labs.push(prismLab);
  labNodes.push(...prismLab.targetNodes);

  // 2. Momentum Collider Lab (Physics - Elastic Impulse Rail)
  const momentumLab = makeMomentumLab(MATHS_CENTRE.x, 0, MATHS_CENTRE.z + 7.0);
  scene.add(momentumLab.group);
  labs.push(momentumLab);
  labNodes.push(...momentumLab.targetNodes);

  // 3. Lorentz Electromagnetism Lab (Physics - Solenoid & Flux Induction)
  const lorentzLab = makeLorentzElectromagnetLab(0, 0, 7.5);
  scene.add(lorentzLab.group);
  labs.push(lorentzLab);
  labNodes.push(...lorentzLab.targetNodes);

  // 4. Bohr Quantum Atom Lab (Chemistry - Atomic Shells & Lyman Emission)
  const atomLab = makeBohrAtomLab(SCIENCE_CENTRE.x, 0, SCIENCE_CENTRE.z - 7.0);
  scene.add(atomLab.group);
  labs.push(atomLab);
  labNodes.push(...atomLab.targetNodes);

  // 5. Chemical Titration Neutralization Lab (Chemistry - Volumetric Burette pH)
  const titrationLab = makeTitrationLab(SCIENCE_CENTRE.x, 0, SCIENCE_CENTRE.z + 7.0);
  scene.add(titrationLab.group);
  labs.push(titrationLab);
  labNodes.push(...titrationLab.targetNodes);

  // 6. Molecular Lattice Lab (Chemistry - VSEPR Tetrahedral & Crystal Unit Cell)
  const moleculeLab = makeMolecularLatticeLab(MATHS_CENTRE.x - 7.5, 0, MATHS_CENTRE.z);
  scene.add(moleculeLab.group);
  labs.push(moleculeLab);
  labNodes.push(...moleculeLab.targetNodes);

  // 7. Galvanic Voltaic Battery Lab (Chemistry - Redox Beakers & Salt Bridge)
  const galvanicLab = makeGalvanicCellLab(SCIENCE_CENTRE.x + 7.5, 0, SCIENCE_CENTRE.z);
  scene.add(galvanicLab.group);
  labs.push(galvanicLab);
  labNodes.push(...galvanicLab.targetNodes);

  // 8. Watson-Crick DNA Double Helix Lab (Biology - Genetics & Nucleotide Base Pairs)
  const dnaLab = makeDnaHelixLab(SCIENCE_CENTRE.x, 0, SCIENCE_CENTRE.z + 12.0);
  scene.add(dnaLab.group);
  labs.push(dnaLab);
  labNodes.push(...dnaLab.targetNodes);

  // 9. Plant Cell & Mitochondria Organelle Lab (Biology - Cellular Respiration & ATP)
  const cellLab = makePlantCellLab(0, 0, -8.0);
  scene.add(cellLab.group);
  labs.push(cellLab);
  labNodes.push(...cellLab.targetNodes);

  // -------------------------------------------------------------
  // SECTOR FORCEFIELD SECURITY GATES
  // -------------------------------------------------------------
  const gateMaths = makeSectorForcefield('gate-maths', -14, BRIDGE_Z, 4.2, 4.5, 0x00f5d4);
  scene.add(gateMaths.group);
  forcefields.push(gateMaths);
  const gateMathsCol = { id: 'gate-maths-col', type: 'box', minX: -14.6, maxX: -13.4, minZ: BRIDGE_Z - BRIDGE_HALF_WIDTH, maxZ: BRIDGE_Z + BRIDGE_HALF_WIDTH };
  colliders.push(gateMathsCol);

  const gateScience = makeSectorForcefield('gate-science', 14, BRIDGE_Z, 4.2, 4.5, 0x7d5fff);
  scene.add(gateScience.group);
  forcefields.push(gateScience);
  const gateScienceCol = { id: 'gate-science-col', type: 'box', minX: 13.4, maxX: 14.6, minZ: BRIDGE_Z - BRIDGE_HALF_WIDTH, maxZ: BRIDGE_Z + BRIDGE_HALF_WIDTH };
  colliders.push(gateScienceCol);

  // Sakura Fluttering Petals Particle System
  const petalCount = 150;
  const petalPos = new Float32Array(petalCount * 3);
  for (let i = 0; i < petalCount; i++) {
    petalPos[i * 3] = (Math.random() - 0.5) * 110;
    petalPos[i * 3 + 1] = 0.5 + Math.random() * 8;
    petalPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 3;
  }
  const petalGeo = new THREE.BufferGeometry();
  petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));
  const petals = new THREE.Points(
    petalGeo,
    new THREE.PointsMaterial({
      color: 0xffb7b2,
      size: 0.22,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })
  );
  scene.add(petals);

  let elapsed = 0;

  const labMap = {
    prism: prismLab,
    momentum: momentumLab,
    lorentz: lorentzLab,
    bohr: atomLab,
    titration: titrationLab,
    molecule: moleculeLab,
    galvanic: galvanicLab,
    dna: dnaLab,
    cell: cellLab,
  };

  return {
    stones,
    colliders,
    coins,
    targets,
    cars,
    labs,
    labMap,
    forcefields,
    labNodes,
    disengageGate(gateId) {
      const gate = forcefields.find((f) => f.id === gateId);
      if (gate) gate.disengage();
      const colIdx = colliders.findIndex((c) => c.id === `${gateId}-col`);
      if (colIdx >= 0) colliders.splice(colIdx, 1);
    },
    groundHeight() {
      return 0;
    },
    update(dt, playerPos) {
      elapsed += dt;

      // Update interactive STEM laboratories & forcefield gates
      labs.forEach((lab) => lab.update(dt));
      forcefields.forEach((ff) => ff.update(dt, elapsed));

      // 0. Animate Sun pulse & skyline beacon shimmer
      if (sunMesh) {
        sunMesh.position.y = 34 + Math.sin(elapsed * 0.5) * 0.6;
      }

      // 1. Animate Water Shimmer
      const pos = water.geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        pos.setZ(i, Math.sin(u * 0.15 + elapsed * 1.5) * Math.cos(v * 0.15 + elapsed * 1.5) * 0.18);
      }
      water.geo.attributes.position.needsUpdate = true;

      // 2. Animate Drifting Clouds
      clouds.forEach((c) => {
        c.mesh.position.x += dt * c.speed;
        if (c.mesh.position.x > 75) c.mesh.position.x = -75;
      });

      // 3. Animate 3D Holographic Math Symbols
      if (holoMath) {
        holoMath.infinity.rotation.x += dt * 0.8;
        holoMath.infinity.rotation.y += dt * 1.2;
        holoMath.ring1.rotation.z += dt * 0.5;
        holoMath.ring2.rotation.x += dt * 0.6;
      }

      // 4. Animate 3D Holographic Atomic Orbitals
      if (holoAtom) {
        holoAtom.nucleus.rotation.y += dt * 1.0;
        holoAtom.rings.forEach((r) => {
          r.ringMesh.rotation.z += dt * r.speed;
          const a = elapsed * r.speed * 2.0;
          r.electron.position.set(Math.cos(a) * 3.6, Math.sin(a) * 3.6, 0);
          r.electron.position.applyEuler(r.ringMesh.rotation);
        });
      }

      // 5. Animate Challenge Stones & Waypoints
      for (const { mesh, phase } of bobbers) {
        mesh.position.y = STONE_Y + Math.sin(elapsed * 2.2 + phase) * 0.16;
        mesh.rotation.y += dt * 0.9;
      }

      for (const b of beacons) {
        b.beam.rotation.y += dt * 0.3;
        const ringScale = 1.0 + Math.sin(elapsed * 2.5) * 0.12;
        b.ring.scale.set(ringScale, ringScale, 1.0);
      }

      // 6. Animate Star Coins & Check Collisions
      for (const c of coins) {
        if (!c.collected) {
          c.mesh.rotation.y += dt * 3.5;
          c.mesh.position.y = 1.1 + Math.sin(elapsed * 3.0 + c.phase) * 0.15;

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

      // 7. Animate Shootable Target Drones
      for (const tgt of targets) {
        if (tgt.active) {
          tgt.outerRing.rotation.z += dt * 1.4;
          tgt.innerRing.rotation.x += dt * 2.1;
          tgt.innerRing.rotation.y += dt * 1.1;
          tgt.core.rotation.y += dt * 1.8;
          tgt.group.position.y = tgt.baseY + Math.sin(elapsed * 2.4 + tgt.baseX) * 0.35;
        } else {
          tgt.respawnTimer -= dt;
          if (tgt.respawnTimer <= 0) {
            tgt.active = true;
            tgt.group.visible = true;
            tgt.group.scale.set(1, 1, 1);
          }
        }
      }

      // 8. Animate Cruising Vice City Traffic & Underglow Flares
      for (const car of cars) {
        if (car.isCruising) {
          car.position.x += car.speed * dt;
          if (car.speed > 0 && car.position.x > car.maxX) {
            car.position.x = car.minX;
          } else if (car.speed < 0 && car.position.x < car.minX) {
            car.position.x = car.maxX;
          }
        }
        if (car.flareTimer > 0) {
          car.flareTimer -= dt;
          if (car.underglow) {
            car.underglow.material.opacity = 0.55 + Math.sin(car.flareTimer * 20) * 0.35;
          }
        } else if (car.underglow) {
          car.underglow.material.opacity = 0.55;
        }
      }

      // 9. Animate Fluttering Sakura Petals
      const petPos = petals.geometry.attributes.position;
      for (let i = 0; i < petalCount; i++) {
        let y = petPos.getY(i) - dt * 0.8;
        if (y < 0.2) y = 7.5;
        petPos.setY(i, y);
      }
      petals.geometry.attributes.position.needsUpdate = true;
    },
  };
}
