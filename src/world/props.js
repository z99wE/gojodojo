import * as THREE from 'three';

// =========================================================================
// South Korean Pastel Cyberpunk & GTA Vice City 3D Procedural Assets
// =========================================================================

// 1. First-Person 3D Viewmodel Hand / Cyber Gauntlet
export function makeViewmodelHand() {
  const g = new THREE.Group();

  // Forearm & sleeve (pastel lavender suit cuff)
  const armMat = new THREE.MeshStandardMaterial({
    color: 0x7d5fff,
    roughness: 0.6,
    flatShading: true,
  });
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.45, 8), armMat);
  arm.rotation.x = Math.PI / 3;
  arm.position.set(0.28, -0.28, -0.45);

  // Cyber gauntlet glove (pastel pink & white)
  const gloveMat = new THREE.MeshStandardMaterial({
    color: 0xff758c,
    roughness: 0.4,
    flatShading: true,
  });
  const glove = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.18), gloveMat);
  glove.position.set(0.32, -0.16, -0.58);
  glove.rotation.set(0.1, -0.2, 0.15);

  // Glowing knuckles / energy crystal
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x70e3db,
    emissive: 0x70e3db,
    emissiveIntensity: 0.9,
    roughness: 0.1,
  });
  const knuckleCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.04, 0), crystalMat);
  knuckleCrystal.position.set(0.32, -0.11, -0.62);

  // Fingers
  const fingerMat = new THREE.MeshStandardMaterial({ color: 0xffd1dc, roughness: 0.5 });
  const fingers = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.12), fingerMat);
  fingers.position.set(0.32, -0.14, -0.66);

  g.add(arm, glove, knuckleCrystal, fingers);
  return { group: g, knuckleCrystal };
}

// 2. GTA Vice City Style Pastel Sports Car
export function makeViceCityCar(color = 0xff758c) {
  const g = new THREE.Group();

  // Main Car Body
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.25,
    metalness: 0.35,
    flatShading: true,
  });
  const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.5, 4.2), bodyMat);
  lowerBody.position.y = 0.5;

  // Cabin & Windshield (tinted glass)
  const cabinMat = new THREE.MeshStandardMaterial({
    color: 0x2d2438,
    roughness: 0.1,
    metalness: 0.8,
  });
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.48, 2.1), cabinMat);
  cabin.position.set(0, 0.92, -0.2);

  // Rear Spoiler
  const spoilerBar = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.3), bodyMat);
  spoilerBar.position.set(0, 1.05, 1.7);
  const leftMount = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.1), bodyMat);
  leftMount.position.set(-0.7, 0.85, 1.7);
  const rightMount = leftMount.clone();
  rightMount.position.x = 0.7;

  // Front Headlights
  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xfffae0,
    emissive: 0xfffae0,
    emissiveIntensity: 1.0,
  });
  const leftLight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.1), lightMat);
  leftLight.position.set(-0.75, 0.52, -2.1);
  const rightLight = leftLight.clone();
  rightLight.position.x = 0.75;

  // Tail lights
  const tailMat = new THREE.MeshStandardMaterial({
    color: 0xff0055,
    emissive: 0xff0055,
    emissiveIntensity: 1.2,
  });
  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.1), tailMat);
  tailBar.position.set(0, 0.52, 2.1);

  // 4 Wheels
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x1f1f24, roughness: 0.8 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xd8b4f8, metalness: 0.8, roughness: 0.2 });
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 12);
  wheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    [-1.05, 0.38, -1.3],
    [1.05, 0.38, -1.3],
    [-1.05, 0.38, 1.3],
    [1.05, 0.38, 1.3],
  ];

  wheelPositions.forEach(([wx, wy, wz]) => {
    const tire = new THREE.Mesh(wheelGeo, tireMat);
    tire.position.set(wx, wy, wz);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.32, 8), rimMat);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(wx, wy, wz);
    g.add(tire, rim);
  });

  // Neon Underglow Plane
  const neonMat = new THREE.MeshBasicMaterial({
    color: 0x70e3db,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide,
  });
  const neonGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 4.6), neonMat);
  neonGlow.rotation.x = -Math.PI / 2;
  neonGlow.position.y = 0.05;

  g.add(lowerBody, cabin, spoilerBar, leftMount, rightMount, leftLight, rightLight, tailBar, neonGlow);
  g.userData = { isCar: true, underglow: neonGlow, lowerBody };
  return g;
}

// 3. Korean Pastel Storefront / Cyber Cafe Building
export function makeKoreanStoreBuilding(titleText = '수학 빵집', themeColor = 0xffb7b2) {
  const g = new THREE.Group();

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    flatShading: true,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.8, 4.2, 3.8), wallMat);
  body.position.y = 2.1;

  const facadeMat = new THREE.MeshStandardMaterial({
    color: themeColor,
    roughness: 0.4,
    flatShading: true,
  });
  const facade = new THREE.Mesh(new THREE.BoxGeometry(4.9, 1.6, 0.3), facadeMat);
  facade.position.set(0, 3.4, 1.95);

  const awningMat = new THREE.MeshStandardMaterial({
    color: 0xff758c,
    roughness: 0.3,
    flatShading: true,
  });
  const awning = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.2, 1.2), awningMat);
  awning.rotation.x = 0.25;
  awning.position.set(0, 2.5, 2.4);

  const windowMat = new THREE.MeshStandardMaterial({
    color: 0xd8b4f8,
    emissive: 0xf7f1ff,
    emissiveIntensity: 0.4,
    roughness: 0.1,
  });
  const shopWindow = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.6, 0.1), windowMat);
  shopWindow.position.set(0, 1.2, 1.95);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#2d2438';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 496, 112);
  ctx.fillStyle = '#ff758c';
  ctx.font = 'bold 50px "Fredoka", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(titleText, 256, 64);

  const signTex = new THREE.CanvasTexture(canvas);
  const signMat = new THREE.MeshStandardMaterial({
    map: signTex,
    emissive: 0xffffff,
    emissiveMap: signTex,
    emissiveIntensity: 0.6,
  });
  const signMesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.9, 0.15), signMat);
  signMesh.position.set(0, 3.4, 2.15);

  const ventMat = new THREE.MeshStandardMaterial({ color: 0x9586a5, roughness: 0.6 });
  const vent = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.2), ventMat);
  vent.position.set(1.4, 4.6, 0.4);

  g.add(body, facade, awning, shopWindow, signMesh, vent);
  return g;
}

// 4. Cute Korean Pastel Beverage Vending Machine
export function makeVendingMachine() {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x7d5fff,
    roughness: 0.35,
    flatShading: true,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.9), bodyMat);
  body.position.y = 1.1;

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xfffae0,
    emissive: 0xfffae0,
    emissiveIntensity: 0.8,
  });
  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.1), glassMat);
  glass.position.set(0, 1.35, 0.46);

  const canColors = [0xff758c, 0x2ed573, 0xffa502, 0x70e3db];
  canColors.forEach((cc, idx) => {
    const can = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.16, 8),
      new THREE.MeshStandardMaterial({ color: cc })
    );
    can.position.set(-0.3 + idx * 0.2, 1.35, 0.48);
    g.add(can);
  });

  const slotMat = new THREE.MeshStandardMaterial({ color: 0x2d2438 });
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.08), slotMat);
  slot.position.set(0, 0.4, 0.46);

  g.add(body, glass, slot);
  return g;
}

// 5. Vice City Style Tropical Palm Tree
export function makePalmTree() {
  const g = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x9b7e72,
    roughness: 0.8,
    flatShading: true,
  });

  for (let i = 0; i < 7; i++) {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.18 - i * 0.012, 0.2 - i * 0.012, 0.65, 6), trunkMat);
    seg.position.set(Math.sin(i * 0.15) * 0.3, i * 0.6 + 0.3, 0);
    seg.rotation.z = -i * 0.05;
    g.add(seg);
  }

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x2ed573,
    roughness: 0.4,
    side: THREE.DoubleSide,
    flatShading: true,
  });
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.45), leafMat);
    leaf.position.set(Math.sin(angle) * 0.8 + 0.3, 4.3, Math.cos(angle) * 0.8);
    leaf.rotation.set(Math.cos(angle) * 0.35, angle, -Math.sin(angle) * 0.35);
    g.add(leaf);
  }

  return g;
}

// 6. Giant 3D Holographic Atomic Model (Above Science Island)
export function makeHoloAtom() {
  const g = new THREE.Group();

  const nucleusMat = new THREE.MeshStandardMaterial({
    color: 0xffa502,
    emissive: 0xffa502,
    emissiveIntensity: 1.2,
    roughness: 0.1,
  });
  const nucleus = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), nucleusMat);
  g.add(nucleus);

  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x70e3db,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
  });
  const electronMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x70e3db,
    emissiveIntensity: 1.5,
  });

  const rings = [];
  const angles = [0, Math.PI / 3, -Math.PI / 3];

  angles.forEach((rotZ) => {
    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.08, 12, 48), ringMat);
    ringMesh.rotation.set(Math.PI / 4, 0, rotZ);
    g.add(ringMesh);

    const electron = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), electronMat);
    g.add(electron);
    rings.push({ ringMesh, electron, speed: 1.5 + Math.random() * 0.8 });
  });

  g.position.y = 12;
  return { group: g, rings, nucleus };
}

// 7. Giant 3D Holographic Math Symbols (Above Maths Island)
export function makeHoloMathSymbols() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0xb39ddb,
    emissive: 0x7d5fff,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.3,
  });

  const infinity = new THREE.Mesh(new THREE.TorusKnotGeometry(1.6, 0.35, 64, 8, 2, 3), mat);
  infinity.position.set(0, 0, 0);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.1, 16, 40), mat);
  ring1.rotation.x = Math.PI / 2;

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.08, 16, 40), mat);
  ring2.rotation.y = Math.PI / 3;

  g.add(infinity, ring1, ring2);
  g.position.y = 12;
  return { group: g, infinity, ring1, ring2 };
}

// 8. Low-Poly Floating Fluffy Cloud Clusters
export function makeFloatingClouds() {
  const g = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffeef4,
    emissiveIntensity: 0.25,
    roughness: 0.6,
    flatShading: true,
  });

  const cloudPuffs = [
    { x: 0, y: 0, z: 0, s: 2.2 },
    { x: 1.6, y: -0.3, z: 0.4, s: 1.6 },
    { x: -1.6, y: -0.2, z: -0.3, s: 1.7 },
    { x: 0.8, y: 0.5, z: -0.2, s: 1.5 },
  ];

  cloudPuffs.forEach((p) => {
    const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(p.s, 1), cloudMat);
    puff.position.set(p.x, p.y, p.z);
    g.add(puff);
  });

  return g;
}

// 9. Shimmering Pastel Ocean Plane
export function makeWaterPlane() {
  const geo = new THREE.PlaneGeometry(350, 350, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xb5e2fa,
    emissive: 0x8ecae6,
    emissiveIntensity: 0.25,
    roughness: 0.2,
    metalness: 0.3,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -1.2;
  return { mesh, geo };
}

// 10. Fluffy Korean Sakura Tree
export function makeSakuraTree() {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.26, 1.4, 7),
    new THREE.MeshStandardMaterial({ color: 0x9b7e72, roughness: 0.8, flatShading: true })
  );
  trunk.position.y = 0.7;

  const canopyBottom = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.1, 1),
    new THREE.MeshStandardMaterial({ color: 0xffb7b2, roughness: 0.5, flatShading: true })
  );
  canopyBottom.position.y = 2.1;
  canopyBottom.scale.set(1.1, 0.9, 1.1);

  const canopyTop = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.85, 1),
    new THREE.MeshStandardMaterial({ color: 0xffccd5, roughness: 0.4, flatShading: true })
  );
  canopyTop.position.set(0, 2.7, 0);

  g.add(trunk, canopyBottom, canopyTop);
  return g;
}

// 11. Fluffy Matcha Tree
export function makeTree() {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.24, 1.3, 6),
    new THREE.MeshStandardMaterial({ color: 0x8a7060, roughness: 0.8, flatShading: true })
  );
  trunk.position.y = 0.65;

  const canopy = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.2, 1),
    new THREE.MeshStandardMaterial({ color: 0xa8e6cf, roughness: 0.5, flatShading: true })
  );
  canopy.position.y = 2.1;
  canopy.scale.set(1.05, 0.95, 1.05);

  g.add(trunk, canopy);
  return g;
}

// 12. Bubbly Pastel Crystal Cluster
export function makeCrystal(color) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.1,
    flatShading: true,
  });

  const main = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), mat);
  main.scale.set(0.65, 2.0, 0.65);
  main.position.y = 1.7;

  const side1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), mat);
  side1.scale.set(0.5, 1.3, 0.5);
  side1.position.set(0.4, 1.0, 0.2);
  side1.rotation.z = -0.25;

  const side2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), mat);
  side2.scale.set(0.5, 1.1, 0.5);
  side2.position.set(-0.35, 0.9, -0.2);
  side2.rotation.z = 0.3;

  g.add(main, side1, side2);
  return g;
}

// 13. Street Lantern
export function makeLamp() {
  const g = new THREE.Group();
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, 2.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x5c4d6b, roughness: 0.6, flatShading: true })
  );
  post.position.y = 1.1;

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 10, 8),
    new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xffd166,
      emissiveIntensity: 1.0,
      roughness: 0.1,
    })
  );
  bulb.position.y = 2.3;

  const cap = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 0.22, 6),
    new THREE.MeshStandardMaterial({ color: 0x7d5fff, flatShading: true })
  );
  cap.position.y = 2.65;

  g.add(post, bulb, cap);
  return g;
}

// 14. Bridge Segment
export function makeBridgeSegment(length) {
  const g = new THREE.Group();
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(length, 0.35, 3.8),
    new THREE.MeshStandardMaterial({ color: 0xeed6c4, roughness: 0.7, flatShading: true })
  );
  deck.position.y = -0.17;
  g.add(deck);

  const railMat = new THREE.MeshStandardMaterial({ color: 0xffb7b2, roughness: 0.5, flatShading: true });
  const railGeo = new THREE.BoxGeometry(length, 0.18, 0.15);

  const leftRail = new THREE.Mesh(railGeo, railMat);
  leftRail.position.set(0, 0.45, -1.8);

  const rightRail = new THREE.Mesh(railGeo, railMat);
  rightRail.position.set(0, 0.45, 1.8);

  g.add(leftRail, rightRail);
  return g;
}

// 15. Rock
export function makeRock(seed) {
  const rnd = (k) => {
    const v = Math.sin(seed * 91.7 + k * 17.3) * 43758.5;
    return v - Math.floor(v);
  };
  const mesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.55, 1),
    new THREE.MeshStandardMaterial({ color: 0xc8b6d6, roughness: 0.8, flatShading: true })
  );
  mesh.scale.set(0.9 + rnd(1) * 0.5, 0.6 + rnd(2) * 0.4, 0.9 + rnd(3) * 0.5);
  mesh.rotation.set(rnd(4) * Math.PI, rnd(5) * Math.PI, 0);
  return mesh;
}

// 16. Island Base
export function makeIslandBase(radius, thickness, color) {
  const g = new THREE.Group();
  const topMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 0.96, thickness * 0.6, 24),
    new THREE.MeshStandardMaterial({ color, roughness: 0.5, flatShading: true })
  );
  topMesh.position.y = -thickness * 0.3;

  const bottomMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.96, radius * 0.82, thickness * 0.4, 20),
    new THREE.MeshStandardMaterial({ color: 0xd6c2b4, roughness: 0.9, flatShading: true })
  );
  bottomMesh.position.y = -thickness * 0.8;

  g.add(topMesh, bottomMesh);
  return g;
}

// 17. GTA Waypoint Beacon Pillar
export function makeBeaconPillar(color) {
  const g = new THREE.Group();

  const beamMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const beamGeo = new THREE.CylinderGeometry(0.45, 0.85, 36, 12, 1, true);
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.y = 18;

  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const innerGeo = new THREE.CylinderGeometry(0.15, 0.25, 36, 8, 1, true);
  const inner = new THREE.Mesh(innerGeo, innerMat);
  inner.position.y = 18;

  const ringMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });
  const ringGeo = new THREE.RingGeometry(0.7, 0.9, 16);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 1.0;

  g.add(beam, inner, ring);
  return { group: g, ring, beam };
}

// 18. Collectible Coin
export function makeCollectibleCoin() {
  const g = new THREE.Group();
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0xffd166,
    emissive: 0xffb703,
    emissiveIntensity: 0.5,
    metalness: 0.65,
    roughness: 0.25,
  });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.09, 16), coinMat);
  body.rotation.x = Math.PI / 2;

  const starMat = new THREE.MeshStandardMaterial({
    color: 0xfffae0,
    emissive: 0xffffff,
    emissiveIntensity: 0.8,
  });
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), starMat);
  star.scale.set(1.2, 1.2, 0.3);

  g.add(body, star);
  g.position.y = 1.1;
  return g;
}

// 19. Gateway Arch
export function makeToriiArch(color = 0xffb7b2) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, flatShading: true });

  const leftPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.2, 8), mat);
  leftPillar.position.set(-2.0, 2.1, 0);

  const rightPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.2, 8), mat);
  rightPillar.position.set(2.0, 2.1, 0);

  const beam = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.35, 0.45), mat);
  beam.position.set(0, 4.0, 0);

  const subBeam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 0.3), mat);
  subBeam.position.set(0, 3.4, 0);

  g.add(leftPillar, rightPillar, beam, subBeam);
  return g;
}

// 20. Vice City 80s Synthwave Gradient Sky Dome
export function makeViceCitySky() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#0c021c'); // Midnight synthwave violet
  grad.addColorStop(0.3, '#210740'); // Dark neon violet
  grad.addColorStop(0.55, '#5d0e70'); // Magenta purple
  grad.addColorStop(0.72, '#c2185b'); // Vice City neon fuchsia
  grad.addColorStop(0.85, '#e91e63'); // Hot pink
  grad.addColorStop(0.94, '#ff6d00'); // Radiant sunset orange
  grad.addColorStop(1.0, '#ffd54f'); // Horizon golden glow
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle synth stars in upper canopy
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let i = 0; i < 110; i++) {
    const sx = (Math.sin(i * 12.3) * 0.5 + 0.5) * 512;
    const sy = (Math.cos(i * 7.9) * 0.5 + 0.5) * 260;
    const r = ((i % 3) + 1) * 0.7;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  const geo = new THREE.SphereGeometry(280, 32, 24);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
  const sky = new THREE.Mesh(geo, mat);
  sky.position.y = 10;
  return sky;
}

// 21. Giant Sliced Neon Sunset Sun Disk
export function makeViceCitySun() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Sun radial gradient
  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 240);
  grad.addColorStop(0.0, '#fffbe6');
  grad.addColorStop(0.25, '#ffe066');
  grad.addColorStop(0.55, '#ff5e7e');
  grad.addColorStop(0.85, '#e60067');
  grad.addColorStop(1.0, '#900048');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(256, 256, 240, 0, Math.PI * 2);
  ctx.fill();

  // Horizontal scanline slices in lower half (Iconic 80s Outrun / GTA Vice City Sun)
  ctx.globalCompositeOperation = 'destination-out';
  const slices = 9;
  for (let i = 0; i < slices; i++) {
    const y = 260 + i * 24;
    const thickness = 4 + i * 2.4;
    ctx.fillRect(0, y, 512, thickness);
  }
  ctx.globalCompositeOperation = 'source-over';

  const texture = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry(68, 68);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    fog: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 34, -145);
  return mesh;
}

// 22. Distant Vice City Skyline Silhouettes
export function makeDistantSkyline() {
  const g = new THREE.Group();
  const bldgMat = new THREE.MeshStandardMaterial({
    color: 0x120824,
    roughness: 0.8,
    metalness: 0.3,
  });
  const winColors = [0x70e3db, 0xff758c, 0xffd166, 0xb892ff];

  for (let i = -14; i <= 14; i++) {
    if (Math.abs(i) <= 2) continue; // Keep open silhouette window for sunset sun in center!
    const bx = i * 8.8 + Math.sin(i * 3.3) * 2.0;
    const bw = 5.2 + Math.abs(Math.sin(i * 1.5)) * 4.2;
    const bh = 14 + Math.abs(Math.cos(i * 2.2)) * 28;
    const bd = 6 + Math.abs(Math.sin(i * 4.1)) * 4;

    const bldg = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), bldgMat);
    bldg.position.set(bx, bh * 0.5 - 2, -132 + Math.sin(i) * 5);
    g.add(bldg);

    // Glowing neon window panels
    const winMat = new THREE.MeshBasicMaterial({
      color: winColors[Math.abs(i) % winColors.length],
    });
    const winMesh = new THREE.Mesh(new THREE.PlaneGeometry(bw * 0.72, bh * 0.6), winMat);
    winMesh.position.set(bx, bh * 0.42, -132 + Math.sin(i) * 5 + bd * 0.51);
    g.add(winMesh);

    // Rooftop warning beacon
    if (i % 2 === 0) {
      const spireMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 5, 4), spireMat);
      spire.position.set(bx, bh + 1.5, -132 + Math.sin(i) * 5);
      g.add(spire);
    }
  }
  return g;
}

// 23. Vice City Ocean Drive / Cyber Asphalt Boulevard
export function makeAsphaltBoulevard(length = 26, width = 6) {
  const g = new THREE.Group();

  // Dark sleek asphalt surface
  const asphaltMat = new THREE.MeshStandardMaterial({
    color: 0x16151f,
    roughness: 0.65,
    metalness: 0.2,
  });
  const roadMesh = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, width), asphaltMat);
  roadMesh.position.y = 0.04;
  g.add(roadMesh);

  // Glowing neon pink dashed center double divider line
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xff3b77 });
  const dashCount = Math.floor(length / 2.5);
  for (let i = 0; i < dashCount; i++) {
    const dx = -length * 0.45 + i * 2.5;
    const stripe1 = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.1), dashMat);
    stripe1.rotation.x = -Math.PI / 2;
    stripe1.position.set(dx, 0.09, -0.16);
    const stripe2 = stripe1.clone();
    stripe2.position.z = 0.16;
    g.add(stripe1, stripe2);
  }

  // Glowing neon cyan shoulder lines
  const shoulderMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
  const shoulderGeo = new THREE.PlaneGeometry(length, 0.12);
  const leftShoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
  leftShoulder.rotation.x = -Math.PI / 2;
  leftShoulder.position.set(0, 0.09, -width * 0.46);
  const rightShoulder = leftShoulder.clone();
  rightShoulder.position.z = width * 0.46;
  g.add(leftShoulder, rightShoulder);

  // Checkered retro curb blocks along edges
  const curbGeo = new THREE.BoxGeometry(1.2, 0.16, 0.35);
  const curbMat1 = new THREE.MeshStandardMaterial({ color: 0xff85a1, roughness: 0.5 });
  const curbMat2 = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const curbSteps = Math.floor(length / 1.3);
  for (let i = 0; i < curbSteps; i++) {
    const cx = -length * 0.48 + i * 1.3;
    const mat = i % 2 === 0 ? curbMat1 : curbMat2;
    const curbL = new THREE.Mesh(curbGeo, mat);
    curbL.position.set(cx, 0.1, -width * 0.5 - 0.18);
    const curbR = new THREE.Mesh(curbGeo, mat);
    curbR.position.set(cx, 0.1, width * 0.5 + 0.18);
    g.add(curbL, curbR);
  }

  return g;
}

// 24. Floating Shootable Target Drone
export function makeTargetDrone(id, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Outer glowing neon cyan torus ring
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0x00f5d4,
    wireframe: true,
  });
  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.05, 8, 24), outerRingMat);
  g.add(outerRing);

  // Inner glowing neon hot-pink ring (angled)
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: 0xff3b77,
    wireframe: true,
  });
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 8, 20), innerRingMat);
  innerRing.rotation.x = Math.PI / 3;
  g.add(innerRing);

  // Glowing holographic crystal core
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffd166,
    emissiveIntensity: 1.2,
    metalness: 0.4,
    roughness: 0.1,
  });
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), coreMat);
  g.add(core);

  // Crosshair brackets / targeting fins around drone
  const finMat = new THREE.MeshBasicMaterial({ color: 0xffe66d });
  const finGeo = new THREE.BoxGeometry(0.08, 0.28, 0.08);
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
    const fin = new THREE.Mesh(finGeo, finMat);
    fin.position.set(Math.cos(angle) * 1.05, Math.sin(angle) * 1.05, 0);
    g.add(fin);
  }

  return {
    id,
    group: g,
    outerRing,
    innerRing,
    core,
    baseX: x,
    baseY: y,
    baseZ: z,
    hitRadius: 1.4,
    active: true,
    respawnTimer: 0,
  };
}

// 25. Iconic GTA Vice City Ocean Drive Art Deco Hotel (Ocean View, Malibu, Colon, etc.)
export function makeArtDecoHotel(name = 'OCEAN VIEW', baseColor = 0xfff0f5, neonColor = 0xff3b77) {
  const g = new THREE.Group();

  // Main 3-story Art Deco Building Body
  const wallMat = new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.55,
    metalness: 0.1,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(13.0, 9.5, 7.5), wallMat);
  body.position.y = 4.75;
  g.add(body);

  // Stepped Geometric Deco Roofline Parapet
  const roofStep1 = new THREE.Mesh(new THREE.BoxGeometry(11.5, 1.2, 7.0), wallMat);
  roofStep1.position.y = 10.1;
  const roofStep2 = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1.0, 5.5), wallMat);
  roofStep2.position.y = 11.2;

  // Central Vertical Art Deco Fin / Pylon
  const finMat = new THREE.MeshStandardMaterial({
    color: neonColor,
    roughness: 0.3,
    metalness: 0.4,
  });
  const centralFin = new THREE.Mesh(new THREE.BoxGeometry(0.6, 13.5, 0.4), finMat);
  centralFin.position.set(0, 6.8, 3.8);
  g.add(roofStep1, roofStep2, centralFin);

  // Ground Floor Portico Awning & Columns
  const awningMat = new THREE.MeshStandardMaterial({ color: neonColor, roughness: 0.4 });
  const awning = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.35, 2.4), awningMat);
  awning.position.set(0, 3.2, 4.8);

  const colMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  for (const cx of [-2.8, -0.9, 0.9, 2.8]) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 3.2, 12), colMat);
    col.position.set(cx, 1.6, 5.8);
    g.add(col);
  }
  g.add(awning);

  // Grand Entrance Steps & Double Glass Doors
  const stepMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
  const steps = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 2.0), stepMat);
  steps.position.set(0, 0.2, 4.5);
  const doors = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 2.4, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.1, metalness: 0.8 })
  );
  doors.position.set(0, 1.4, 3.8);
  g.add(steps, doors);

  // Upper Windows and Rounded Balconies
  const winMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x0891b2,
    emissiveIntensity: 0.6,
    roughness: 0.1,
  });
  const balcMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });

  for (let floor = 0; floor < 2; floor++) {
    const fy = 4.8 + floor * 2.8;
    for (const wx of [-4.2, -2.1, 2.1, 4.2]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.1), winMat);
      win.position.set(wx, fy, 3.8);

      const balc = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 0.8), balcMat);
      balc.position.set(wx, fy - 0.7, 4.1);
      g.add(win, balc);
    }
  }

  // Glowing Neon Signage Header Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#110324';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#00f5d4';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 116);
  ctx.fillStyle = '#ff3b77';
  ctx.font = '900 44px "Fredoka", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, 256, 64);

  const signTex = new THREE.CanvasTexture(canvas);
  const signMat = new THREE.MeshStandardMaterial({
    map: signTex,
    emissive: 0xffffff,
    emissiveMap: signTex,
    emissiveIntensity: 0.85,
  });
  const signMesh = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.4, 0.2), signMat);
  signMesh.position.set(0, 11.2, 3.0);
  g.add(signMesh);

  return g;
}

// 26. Iconic Vice City Ocean Beach Wooden Lifeguard Tower
export function makeLifeguardTower(color = 0x00f5d4, accent = 0xff3b77) {
  const g = new THREE.Group();

  const woodMat = new THREE.MeshStandardMaterial({ color, roughness: 0.65 });
  const trimMat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.5 });

  // 4 Stilt Legs
  for (const [lx, lz] of [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]]) {
    const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.6, 8), trimMat);
    stilt.position.set(lx, 1.3, lz);
    g.add(stilt);
  }

  // Platform Deck
  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.2, 2.8), woodMat);
  deck.position.y = 2.6;
  g.add(deck);

  // Cabin Hut
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.0, 2.0), woodMat);
  cabin.position.y = 3.7;

  // Angled Hip Roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.2, 4), trimMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 5.3;

  // Access Ladder
  const ladder = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.8, 0.1), trimMat);
  ladder.position.set(0, 1.4, 1.45);
  ladder.rotation.x = 0.2;

  g.add(cabin, roof, ladder);
  return g;
}

// 27. Vice City Overhead Traffic Light Gantry
export function makeTrafficLightGantry(roadWidth = 12) {
  const g = new THREE.Group();
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });

  // Vertical Post
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 6.0, 12), steelMat);
  post.position.set(-roadWidth * 0.5, 3.0, 0);

  // Horizontal Crossbar spanning road
  const crossbar = new THREE.Mesh(new THREE.BoxGeometry(roadWidth + 1.0, 0.25, 0.25), steelMat);
  crossbar.position.set(0, 5.8, 0);
  g.add(post, crossbar);

  // 2 Hanging Traffic Light Boxes
  [-roadWidth * 0.25, roadWidth * 0.25].forEach((hx) => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 0.35), steelMat);
    box.position.set(hx, 5.1, 0);

    const redLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff0044 })
    );
    redLens.position.set(0, 0.32, 0.18);

    const greenLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x00f59b })
    );
    greenLens.position.set(0, -0.32, 0.18);

    box.add(redLens, greenLens);
    g.add(box);
  });

  return g;
}

// 28. Vice City Double-Lantern Cast Iron Street Lamp
export function makeViceCityStreetLamp() {
  const g = new THREE.Group();
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e1b29, metalness: 0.85, roughness: 0.3 });

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 4.2, 10), ironMat);
  post.position.y = 2.1;

  const crossArm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.12), ironMat);
  crossArm.position.y = 4.0;
  g.add(post, crossArm);

  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff2a3,
    emissive: 0xfff2a3,
    emissiveIntensity: 1.4,
    roughness: 0.1,
  });

  [-0.7, 0.7].forEach((bx) => {
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), bulbMat);
    bulb.position.set(bx, 3.8, 0);
    g.add(bulb);
  });

  return g;
}

// 29. Miami Vice / Vice City Offshore Speedboat
export function makeViceCitySpeedboat(hullColor = 0xffffff, trimColor = 0xff3b77) {
  const g = new THREE.Group();

  // V-Hull
  const hullMat = new THREE.MeshStandardMaterial({ color: hullColor, roughness: 0.3, metalness: 0.2 });
  const hull = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 5.2), hullMat);
  hull.position.y = 0.35;

  // Deck Trim
  const trimMat = new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.4 });
  const trim = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.15, 3.2), trimMat);
  trim.position.set(0, 0.75, 0.4);

  // Tinted Windshield
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.8 });
  const shield = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 0.8), glassMat);
  shield.position.set(0, 0.95, -0.6);

  // Dual Outboard Motors
  const motorMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.9 });
  for (const mx of [-0.5, 0.5]) {
    const motor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.4), motorMat);
    motor.position.set(mx, 0.5, 2.7);
    g.add(motor);
  }

  g.add(hull, trim, shield);
  return g;
}

// 30. Beach Umbrella and Sun Loungers
export function makeBeachLoungers(umbrellaColor = 0xff3b77) {
  const g = new THREE.Group();

  // Striped Beach Umbrella
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  pole.position.set(0, 1.2, 0);
  pole.rotation.z = 0.12;

  const canopy = new THREE.Mesh(
    new THREE.ConeGeometry(1.4, 0.7, 8),
    new THREE.MeshStandardMaterial({ color: umbrellaColor, roughness: 0.6 })
  );
  canopy.position.set(0.15, 2.3, 0);
  g.add(pole, canopy);

  // 2 Sun Loungers
  const lMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  for (const lx of [-0.9, 0.9]) {
    const lounger = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 1.8), lMat);
    lounger.position.set(lx, 0.1, 0.2);
    g.add(lounger);
  }

  return g;
}
